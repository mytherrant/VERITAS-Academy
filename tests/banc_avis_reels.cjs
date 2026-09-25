#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_avis_reels.cjs — DES AVIS CLIENTS RÉELS, OU AUCUN
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_avis_reels.cjs

   CE QU'IL PROTÈGE
   defaultDB() semait huit avis nominatifs (« Mme MBALLA Pauline », datés de
   2024, `verified:true`) rattachés à des manuels qui n'existaient plus. Chaque
   visiteur les recevait, et la boutique affichait « 6 avis vérifiés · 4,7/5 »
   avec la mention « Achat vérifié » : de la preuve sociale inventée présentée
   comme vérifiée. Ce banc garde fermés les trois chemins qui y menaient :
     1. aucun avis dans la graine de defaultDB() ;
     2. la migration retire les faux avis des bases déjà créées — sans toucher
        un vrai avis qui porterait le même identifiant ;
     3. l'affichage échappe ce qu'un visiteur écrit (nom, rôle, texte) et ne
        dit « vérifié » que si l'avis l'est.
   Le code n'est pas recopié : il est EXTRAIT d'app.js et exécuté tel quel.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.resolve(__dirname, '..', 'app.js'), 'utf8');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => { b ? ok++ : ko++; console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : '')); };

function extraire(nom) {
  const i = src.indexOf('function ' + nom + '(');
  if (i < 0) throw new Error(nom + ' introuvable');
  let p = src.indexOf('{', i), n = 0, j = p;
  for (; j < src.length; j++) { const c = src[j]; if (c === '{') n++; else if (c === '}') { n--; if (n === 0) { j++; break; } } }
  return src.slice(i, j);
}

console.log('\nDES AVIS CLIENTS RÉELS, OU AUCUN\n');

// 1. La graine
const graine = src.match(/bookReviews:\s*\[([^\]]*)\]/);
dire(graine && !/\{/.test(graine[1]), 'defaultDB() ne sème aucun avis', graine && graine[1].slice(0, 80));
dire(!/MBALLA Pauline'\s*,\s*role/.test(src), 'plus aucun avis de démonstration écrit en dur');

// 2. La migration, exécutée
const esc = "function _esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#39;');}";
const aides = esc + "function starsHtml(n){return '*'.repeat(Math.round(n));}function ICO(){return '';}";
const code = aides + extraire('_retirerFauxAvis') + extraire('_avisReels') + extraire('_avisCarte') + extraire('_avisCompte')
  + ';return {_retirerFauxAvis,_avisReels,_avisCarte,_avisCompte};';
const DB = {
  books: [{ id: 'm1', titre: 'Le Tube digestif' }],
  bookReviews: [
    { id: 'rv1', bid: 'b1', nom: 'Mme MBALLA Pauline', stars: 5, text: 'faux', verified: true },
    { id: 'rv8', bid: 'b2', nom: 'Marie-Claire BELLA', stars: 5, text: 'faux', verified: true },
    { id: 'rv3', bid: 'm1', nom: 'Awa Ngono', stars: 4, text: 'Vrai avis, même identifiant qu’un faux', verified: false },
    { id: 'z9', bid: 'disparu', nom: 'Paul', stars: 5, text: 'Avis d’un manuel supprimé', verified: false },
  ],
};
const F = new Function('DB', code)(DB);
const retires = F._retirerFauxAvis();
dire(retires === 2, 'la migration retire les 2 faux avis', retires);
dire(DB.bookReviews.some(r => r.nom === 'Awa Ngono'), 'un vrai avis portant l’identifiant « rv3 » est conservé');
dire(F._avisReels().length === 1, 'seuls les avis d’un manuel existant s’affichent', F._avisReels().length);

// 3. L'affichage
const carte = F._avisCarte({ nom: '<img src=x onerror=alert(1)>', role: '<b>', text: '<script>x</script>', stars: 5, date: '', verified: false }, '');
dire(!/<img|<script|<b>/.test(carte), 'nom, rôle et texte d’un visiteur sont échappés', carte.slice(0, 120));
dire(!/Achat vérifié/.test(carte), 'pas de « Achat vérifié » sur un avis non vérifié');
dire(F._avisCompte([{ verified: false }, { verified: false }]) === '2 avis', '« 2 avis », pas « 2 avis vérifiés »', F._avisCompte([{ verified: false }, { verified: false }]));
dire(F._avisCompte([{ verified: true }, { verified: false }]) === '2 avis dont 1 vérifié', 'compte mixte honnête', F._avisCompte([{ verified: true }, { verified: false }]));

console.log('\n  ' + ok + ' réussi(s), ' + ko + ' échec(s)\n');
process.exit(ko ? 1 : 0);
