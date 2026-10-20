#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_atelier_composer.cjs — CLASSE, NATURE, 2NDE, BROUILLON SUPPRIMÉ
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_atelier_composer.cjs

   CE QU'IL PROTÈGE (16/10/2026)
   ① « Composer avec Ambassa » porte la classe et la nature : un enseignant
     tapait « 6e étude de texte » dans le champ Thème, faute de les trouver.
   ② Changer de classe efface une nature d'une AUTRE classe — sinon Ambassa
     composait une 6ᵉ avec la structure de Terminale.
   ③ La 2nde existe : aucune épreuve ne la citait, la classe manquait.
   ④ Un brouillon se supprime, et la synchronisation d'équipe ne le ramène
     pas — sauf si un collègue l'a modifié APRÈS la suppression.
   La logique est EXTRAITE du fichier servi et exécutée : on teste ce qui part
   en production, pas une copie.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.resolve(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => { b ? ok++ : ko++; console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : '')); };

const src = fs.readFileSync(path.join(RACINE, 'plateforme', 'index.html'), 'utf8').replace(/\r\n/g, '\n');
const minesecSrc = fs.readFileSync(path.join(RACINE, 'plateforme', 'minesec.js'), 'utf8');

/** Corps d'une méthode `nom(args){…}` (accolades équilibrées). */
function methode(nom) {
  const i = src.indexOf('  ' + nom + '(');
  if (i < 0) return null;
  const j = src.indexOf('{', i);
  let p = 0;
  for (let k = j; k < src.length; k++) {
    if (src[k] === '{') p++;
    else if (src[k] === '}') { p--; if (p === 0) return src.slice(i, k + 1).trim(); }
  }
  return null;
}

/* ── ① Le panneau porte classe et nature ─────────────────────────────── */
console.log(`\n${G}① Classe et nature dans « Composer avec Ambassa »${R}`);
const composeur = (src.match(/<section id="vrt-composer"[\s\S]*?<\/section>/) || [''])[0];
dire(/1\. Classe\s*<select value="\{\{ ep\.classe \}\}" onChange="\{\{ setClasse \}\}"/.test(composeur),
  'sélecteur de classe dans le panneau, relié à la même donnée que les Renseignements');
dire(/2\. Nature de l’épreuve\s*<select value="\{\{ ep\.epreuveCode \}\}" onChange="\{\{ setEpreuveType \}\}"/.test(composeur),
  'sélecteur de nature dans le panneau, même gestionnaire');
/* 19/10/2026 (lot D) : le Thème a rejoint l’étape « Programme » de l’assistant
   et n’est plus numéroté ; il doit toujours se dire facultatif. */
dire(/>\s*Thème \(facultatif\)/.test(composeur), 'le champ Thème dit qu’il est facultatif');
dire(!/dans les Renseignements/.test(composeur + (src.match(/genErr:'Choisissez d’abord la classe[^']*'/) || [''])[0]),
  'plus aucun renvoi « dans les Renseignements » depuis le panneau');

/* ── ② Changer de classe efface une nature incompatible ──────────────── */
console.log(`\n${G}② Une nature d'une autre classe ne survit pas au changement${R}`);
const setClasse = (src.match(/setClasse:e=>\{[\s\S]*?this\._updateActive\(maj\);\s*\}/) || [''])[0];
dire(setClasse.length > 0, 'setClasse est un gestionnaire dédié (plus un simple setField)');
// Exécution réelle du gestionnaire, avec le vrai référentiel.
const bac = { window: {} };
vm.createContext(bac);
vm.runInContext(minesecSrc, bac);
const MINESEC = bac.window.MINESEC || bac.MINESEC;
dire(!!MINESEC && typeof MINESEC.epreuveParCode === 'function', 'référentiel MINESEC chargé');
function essai(classeAvant, codeAvant, classeApres) {
  let ecrit = null;
  const ctx = { val: e => e.target.value, perm: { edit: true }, MINESEC,
    self: { _active: () => ({ classe: classeAvant, epreuveCode: codeAvant }), _updateActive: m => { ecrit = m; } } };
  const fn = vm.runInNewContext('(function(perm,MINESEC,val){ return (' + setClasse.replace(/^setClasse:/, '').replace(/this\./g, 'self.') + '); })', ctx);
  const h = fn.call(ctx, ctx.perm, MINESEC, ctx.val);
  vm.runInNewContext('h({target:{value:cl}})', { h, cl: classeApres, self: ctx.self });
  return ecrit;
}
let r;
try { r = essai('6e', 'EE_1C', 'Terminale'); } catch (e) { r = { erreur: e.message }; }
dire(r && r.classe === 'Terminale' && r.epreuveCode === '', '6e « Expression écrite » → Terminale : la nature est effacée', JSON.stringify(r));
try { r = essai('6e', 'EE_1C', '5e'); } catch (e) { r = { erreur: e.message }; }
dire(r && r.classe === '5e' && !('epreuveCode' in r), '6e → 5e : la nature, valable en 5e, est gardée', JSON.stringify(r));

/* ── ③ La 2nde existe ─────────────────────────────────────────────────── */
console.log(`\n${G}③ La classe de 2nde${R}`);
const n2 = MINESEC ? (MINESEC.epreuvesParClasse('2nde') || []) : [];
dire(n2.length >= 4, 'la 2nde a ses épreuves de classe (second cycle général)', n2.length + ' nature(s)');
dire(n2.every(e => /Littérature|Langue/.test(e.nom)), 'ce sont celles du second cycle général (A/ABI, C/D/E/TI)');

/* ── ④ Brouillon supprimé : la synchro ne le ramène pas ──────────────── */
console.log(`\n${G}④ Un brouillon supprimé ne revient pas par la synchronisation${R}`);
const sans = methode('_sansSupprimees');
const fusion = methode('_fusionner');
dire(!!sans && !!fusion, 'les deux fonctions sont trouvables');
const obj = vm.runInNewContext('({' + fusion + ',' + sans + ', _epSuppr(){return {};}})');
const local = [{ id: 'e1', updatedAt: 100 }];
const distant = [{ id: 'e1', updatedAt: 100 }, { id: 'e2', updatedAt: 300 }, { id: 'e3', updatedAt: 500 }];
const reg = { e1: 200, e2: 400, e3: 450 };
const res = obj._sansSupprimees(obj._fusionner([], distant), reg).map(e => e.id).sort();
dire(!res.includes('e1') && !res.includes('e2'), 'supprimé APRÈS sa dernière modification : écarté', JSON.stringify(res));
dire(res.includes('e3'), 'modifié par un collègue APRÈS la suppression : gardé', JSON.stringify(res));
dire(/epSuppr:this\._epSuppr\(\)/.test(methode('_syncContenu') || ''), 'le registre part avec l’état partagé');
dire(/_sansSupprimees\(this\._fusionner\(this\.state\.epreuves/.test(methode('_syncTirer') || ''), 'la relecture applique le registre');
const supp = methode('_supprimerBrouillon') || '';
dire(/status\|\|'brouillon'\)!=='brouillon'\)return/.test(supp), 'seul un BROUILLON se supprime');
dire(/window\.confirm\(/.test(supp), 'une confirmation est demandée');
dire(/onClick="\{\{ supprimerBrouillon \}\}"/.test(src), 'le bouton existe dans le composeur');

console.log(`\n${ko === 0 ? G + '  ✓ ' + ok + '/' + ok + ' — le composeur fait ce qu’il annonce.' : '\x1b[31m  ✗ ' + ko + ' au rouge, ' + ok + ' au vert.'}${R}`);
process.exit(ko === 0 ? 0 : 1);
