/**
 * tests/banc_xss_rendus_admin.cjs — LA SAISIE D'UN ACHETEUR NE S'EXÉCUTE PAS CHEZ L'ADMIN
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 *   node tests/banc_xss_rendus_admin.cjs [chemin/vers/app.js]
 *
 * CE QU'IL PROTÈGE (audit sécurité du 19/11/2026)
 *   Nom, téléphone et libellé d'un achat arrivent du navigateur de n'importe
 *   qui. Ils finissent dans DB.visitorOrders, DB.orientationDemandes,
 *   DB.elearning.commandes — que le tableau de bord affichait en HTML BRUT.
 *   Un nom « <img src=x onerror=…> » s'exécutait donc dans le navigateur de
 *   l'administrateur, qui détient la clé de synchronisation (localStorage
 *   vrt10_cc) : lecture et écrasement de toute la base.
 *
 *   On extrait les VRAIES fonctions d'app.js (pas une copie), on leur donne
 *   une base piégée, et on vérifie que le HTML produit ne contient aucune
 *   balise venue de la saisie, et qu'aucun identifiant ne referme un onclick.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const fichier = process.argv[2] || path.join(__dirname, '..', 'app.js');
const src = fs.readFileSync(fichier, 'utf8');

let ok = 0, ko = 0;
function dit(b, m, det) {
  if (b) { ok++; console.log('  \x1b[32m✓\x1b[0m ' + m); }
  else { ko++; console.log('  \x1b[31m✗\x1b[0m ' + m + (det ? '\n      \x1b[33m' + det + '\x1b[0m' : '')); }
}

/* Extrait « function NOM(…){…} » en suivant les accolades, en sautant chaînes,
   gabarits et commentaires (sans quoi un « { » dans un texte fausse le compte). */
function extraire(nom) {
  const i = src.indexOf('\nfunction ' + nom + '(');
  if (i < 0) return null;
  let j = src.indexOf('{', i), prof = 0, k = j;
  const pile = [];               // contextes : '`' gabarit, '${' interpolation
  for (; k < src.length; k++) {
    const c = src[k], n = src[k + 1];
    const ctx = pile[pile.length - 1];
    if (ctx === '`') {
      if (c === '\\') { k++; continue; }
      if (c === '`') { pile.pop(); continue; }
      if (c === '$' && n === '{') { pile.push('${'); k++; continue; }
      continue;
    }
    if (c === '/' && n === '/') { k = src.indexOf('\n', k); continue; }
    if (c === '/' && n === '*') { k = src.indexOf('*/', k + 2) + 1; continue; }
    if (c === '"' || c === "'") {
      for (k++; k < src.length && src[k] !== c; k++) if (src[k] === '\\') k++;
      continue;
    }
    if (c === '`') { pile.push('`'); continue; }
    if (c === '{') { if (ctx === '${') pile.push('{'); else prof++; continue; }
    if (c === '}') {
      if (ctx === '{') { pile.pop(); continue; }
      if (ctx === '${') { pile.pop(); continue; }
      prof--; if (prof === 0) break;
    }
  }
  return src.slice(i + 1, k + 1);
}

// _esc réel (bloc « if(typeof _esc !== 'function'){ window._esc = … } »).
const mEsc = src.match(/if\(typeof _esc !== 'function'\)\{[\s\S]*?\n\}/);
const noms = ['_vrtId', 'pgVisitorOrders', 'pgOrientationAdmin', 'printVisitorReceipt'];
const morceaux = noms.map(n => [n, extraire(n)]);

console.log('\n\x1b[1mBanc XSS — rendus admin des saisies publiques\x1b[0m  (' + path.basename(fichier) + ')');
dit(!!mEsc, '_esc trouvé dans app.js');
morceaux.forEach(([n, s]) => dit(!!s, 'fonction ' + n + ' trouvée'));
if (!mEsc || morceaux.some(m => !m[1])) { console.log('\n  extraction impossible\n'); process.exit(1); }

const PIEGE = '<img src=x onerror=window.__pwn=1>';
const ID_PIEGE = "x');window.__pwn=1;//";
const ctx = {
  window: {}, console,
  iA: () => true, na: () => 'NA',
  fmt: n => String(n) + ' FCFA',
  docHeader: t => '<h1>' + t + '</h1>',
  DB: {
    visitorOrders: [{ id: ID_PIEGE, nom: PIEGE, tel: '"><svg onload=window.__pwn=1>', bookTitle: '<script>window.__pwn=1</script>',
                      cls: PIEGE, prix: 1000, date: '19/11/2026', statut: 'En attente', promo: PIEGE }],
    orientationDemandes: [{ id: ID_PIEGE, nom: PIEGE, tel: PIEGE, niveau: PIEGE, type: PIEGE, dispo: PIEGE,
                            msg: 'm', date: '2026-11-19', statut: 'En attente' }],
  },
};
ctx.printDoc = (html, title) => { ctx.__imprime = html + '|TITRE|' + title; };
vm.createContext(ctx);
vm.runInContext(mEsc[0].replace('window._esc', 'var _esc = window._esc') , ctx);
vm.runInContext('var _esc = window._esc || _esc;', ctx);
morceaux.forEach(([, s]) => vm.runInContext(s, ctx));

/* Une balise venue de la saisie se reconnaît à sa CHARGE : « <img … onerror= »,
   « <svg onload= », « <script>window.__pwn » bruts. Échappée, elle devient
   « &lt;img ». Les icônes <svg class="vico"> du site ne sont pas visées. */
const balise = /<(img|svg)\b[^>]*\bon(error|load)=|<script>window\.__pwn/i;
function sain(h) { return !balise.test(h); }
function onclickSain(h) {
  // Aucun gestionnaire ne doit contenir le code apporté par l'id piégé.
  // (_vrtId en garde les lettres « windowpwn1 » : inertes, sans « ; » ni « = ».)
  const att = h.match(/on(click|change)="[^"]*"/g) || [];
  return att.every(a => a.indexOf('window.__pwn=1') < 0);
}

const hOrders = vm.runInContext('pgVisitorOrders()', ctx);
dit(sain(hOrders), 'Commandes en ligne : aucune balise issue du nom / tél / titre', (hOrders.match(balise) || [''])[0]);
dit(onclickSain(hOrders), 'Commandes en ligne : un id piégé ne referme pas le onclick');
dit(hOrders.indexOf('&lt;img') >= 0, 'Commandes en ligne : le nom reste lisible (échappé, pas supprimé)');

const hOr = vm.runInContext('pgOrientationAdmin()', ctx);dit(sain(hOr), 'Demandes d\'orientation : aucune balise issue de la saisie', (hOr.match(balise) || [''])[0]);
dit(onclickSain(hOr) && hOr.indexOf("__pwn=1;//')") < 0, 'Demandes d\'orientation : id piégé neutralisé (onclick / onchange)');

vm.runInContext('printVisitorReceipt(' + JSON.stringify(ID_PIEGE) + ')', ctx);
const hRecu = ctx.__imprime || '';
dit(hRecu !== '' && sain(hRecu), 'Reçu imprimable : ni le corps ni le titre n\'injectent de balise', (hRecu.match(balise) || ['(rien imprimé)'])[0]);

dit(vm.runInContext('_vrtId("ord_ab12cd") === "ord_ab12cd" && _vrtId("VT251119-AB12") === "VT251119-AB12"', ctx),
    '_vrtId laisse passer nos identifiants réels');

console.log('\n' + (ko ? '\x1b[31m  ✗ ' + ko + ' échec(s) sur ' + (ok + ko) + '\x1b[0m\n' : '\x1b[32m  ✓ ' + ok + '/' + ok + ' contrôles passés\x1b[0m\n'));
process.exit(ko ? 1 : 0);
