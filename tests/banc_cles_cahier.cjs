#!/usr/bin/env node
/**
 * tests/banc_cles_cahier.cjs — LA CLÉ D'UN EXERCICE NE DOIT PAS BOUGER
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 *   node tests/banc_cles_cahier.cjs
 *
 * POURQUOI CE BANC EXISTE
 *   Un cahier scolaire se corrige entre deux rentrées : on ajoute un exercice,
 *   on en retire un, on en déplace un. Si la clé qui porte la réponse d'un
 *   élève dépend de la POSITION de l'exercice, tout se décale — l'élève
 *   retrouve ses réponses sous les mauvaises questions, et l'annotation du
 *   professeur désigne autre chose que ce qu'il a lu. Personne ne s'en plaint,
 *   parce que personne ne sait que c'est arrivé.
 *
 *   Mesuré sur un cahier de 2ⁿᵈᵉ, en ajoutant UN SEUL exercice au début :
 *     • compteur d'affichage (le moteur d'origine) : 55 réponses sur 55
 *       changent d'exercice ;
 *     • indice de bloc : 38 changent, 17 disparaissent ;
 *     • clé « séquence / leçon / empreinte de la consigne » : 55 intactes.
 *
 * CE QU'IL MESURE VRAIMENT
 *   Pas « la clé existe-t-elle encore ? » — un compteur garde ses clés
 *   « a1…a55 » et les fait pourtant toutes pointer ailleurs. On vérifie donc
 *   que CHAQUE CLÉ DÉSIGNE ENCORE LA MÊME QUESTION. C'est la seule mesure qui
 *   dit quelque chose, et la première version de ce contrôle se trompait.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.resolve(__dirname, '..');

let ok = 0, ko = 0;
const dit = (bon, quoi, det) => {
  if (bon) { ok++; console.log('  \x1b[32m✓\x1b[0m ' + quoi); }
  else { ko++; console.log('  \x1b[31m✗\x1b[0m ' + quoi + (det ? '  → ' + det : '')); }
};

// ── On charge le VRAI moteur, pas une copie de sa logique ───────────────────
// Une réimplémentation dans le test finirait par diverger du code livré, et le
// banc certifierait alors une règle que plus personne n'applique.
const bac = { window: {}, document: undefined, module: { exports: {} } };
bac.globalThis = bac;
vm.createContext(bac);
vm.runInContext(fs.readFileSync(path.join(RACINE, 'livrets', 'cahier.js'), 'utf8'), bac);
const calculerCles = bac.window.VRTCahierCles || (bac.module.exports || {}).calculerCles;

// ── Un cahier d'essai, avec ce qui fait la vie d'un vrai document ───────────
const q = (t) => ({ y: 'question', r: [{ t: t }, { tail: 1 }] });
const DOC = [
  { y: 'module', no: '1', r: [{ t: 'Le texte et ses marques' }] },
  { y: 'lecon', no: '1', r: [{ t: 'Émetteur et récepteur' }] },
  q('Relève quatre marques de l’émetteur.'),
  q('Relève quatre marques du récepteur.'),
  { y: 'texte', r: [{ t: 'Un extrait de Mpoundi Ngolle.' }] },
  q('Quelle est l’intention dominante ?'),
  { y: 'lecon', no: '2', r: [{ t: 'Les fonctions du langage' }] },
  q('Nomme la fonction expressive.'),
  q('Justifie ta réponse.'),
  q('Justifie ta réponse.'),          // doublon VOLONTAIRE : cela arrive
  { y: 'module', no: '2', r: [{ t: 'Le récit' }] },
  { y: 'lecon', no: '1', r: [{ t: 'Le narrateur' }] },
  q('Le narrateur est-il interne ou externe ?'),
  q('Relève deux indices.'),
];

/** Carte { clé → question désignée } pour la méthode retenue. */
function carteStable(blocs) {
  const cles = calculerCles('2nde', blocs);
  const m = {};
  blocs.forEach((b, i) => {
    const y = b.y || b.t || '';
    if (y !== 'question' && y !== 'exercice') return;
    const t = (b.r || []).map(r => r.t || '').join('').trim();
    (b.r || []).forEach((r, ri) => { if (r && r.tail) m[cles[i] + '/r' + ri] = t; });
  });
  return m;
}

/** Les deux méthodes écartées, rejouées pour que la comparaison ait un sens. */
function carteCompteur(blocs) {
  let n = 0; const m = {};
  blocs.forEach(b => {
    const y = b.y || b.t || '';
    if (y !== 'question' && y !== 'exercice') return;
    const t = (b.r || []).map(r => r.t || '').join('').trim();
    (b.r || []).forEach(r => { if (r && r.tail) m['a' + (++n)] = t; });
  });
  return m;
}
function cartePosition(blocs) {
  const m = {};
  blocs.forEach((b, i) => {
    const y = b.y || b.t || '';
    if (y !== 'question' && y !== 'exercice') return;
    const t = (b.r || []).map(r => r.t || '').join('').trim();
    (b.r || []).forEach((r, ri) => { if (r && r.tail) m['2nde/b' + i + '/r' + ri] = t; });
  });
  return m;
}

function juger(f, avantDoc, apresDoc) {
  const a = f(avantDoc), b = f(apresDoc);
  let ailleurs = 0, disparues = 0, total = 0;
  for (const k in a) {
    total++;
    if (!(k in b)) disparues++;
    else if (b[k] !== a[k]) ailleurs++;
  }
  return { total, ailleurs, disparues, intactes: total - ailleurs - disparues };
}

(function () {
  console.log('\n\x1b[1m1. Le moteur expose bien sa règle\x1b[0m');
  dit(typeof calculerCles === 'function', 'calculerCles() est accessible au banc');
  if (typeof calculerCles !== 'function') { console.log('\x1b[31m✗ moteur illisible\x1b[0m'); process.exit(1); }

  const cles = calculerCles('2nde', DOC);
  dit(cles.length === DOC.length, 'une clé par bloc');
  const desQuestions = cles.filter((c, i) => (DOC[i].y === 'question'));
  dit(new Set(desQuestions).size === desQuestions.length,
      'les ' + desQuestions.length + ' questions ont des clés distinctes — doublon de consigne compris');
  dit(/^2nde\/s1\/l1\//.test(cles[2]), 'la clé porte la séquence et la leçon', cles[2]);
  dit(cles.every(c => c === null || c.length <= 120), 'aucune clé ne dépasse la limite du serveur');

  console.log('\n\x1b[1m2. On ajoute un exercice au début du cahier\x1b[0m');
  const ajout = DOC.slice(0, 2).concat([q('Question ajoutée cette année.')]).concat(DOC.slice(2));
  const s = juger(carteStable, DOC, ajout);
  const c = juger(carteCompteur, DOC, ajout);
  const p = juger(cartePosition, DOC, ajout);
  console.log('     méthode retenue        : ' + JSON.stringify(s));
  console.log('     compteur d’affichage   : ' + JSON.stringify(c));
  console.log('     indice de bloc         : ' + JSON.stringify(p));
  dit(s.intactes === s.total && s.ailleurs === 0,
      'AUCUNE réponse ne change d’exercice (' + s.intactes + '/' + s.total + ')');
  dit(c.ailleurs > 0, 'le compteur d’affichage, lui, en déplacerait ' + c.ailleurs
      + ' — c’est bien la panne qu’on évite');

  console.log('\n\x1b[1m3. On DÉPLACE une leçon entière\x1b[0m');
  const permute = DOC.slice(0, 6).concat(DOC.slice(10)).concat(DOC.slice(6, 10));
  const s2 = juger(carteStable, DOC, permute);
  dit(s2.ailleurs === 0, 'aucune réponse ne change d’exercice après permutation',
      JSON.stringify(s2));

  console.log('\n\x1b[1m4. On RETIRE un exercice\x1b[0m');
  const retrait = DOC.slice(0, 3).concat(DOC.slice(4));
  const s3 = juger(carteStable, DOC, retrait);
  dit(s3.ailleurs === 0, 'les réponses restantes gardent leur exercice', JSON.stringify(s3));
  dit(s3.disparues === 1, 'seule la réponse de l’exercice supprimé se détache');

  console.log('\n\x1b[1m5. Réécrire une consigne détache sa réponse — et elle SEULE\x1b[0m');
  const reecrit = DOC.map((b, i) => (i === 2
    ? { y: 'question', r: [{ t: 'Relève SIX marques de l’émetteur.' }, { tail: 1 }] } : b));
  const s4 = juger(carteStable, DOC, reecrit);
  dit(s4.disparues === 1 && s4.ailleurs === 0,
      'une consigne changée = une réponse détachée, les autres intactes', JSON.stringify(s4));

  console.log('\n' + '─'.repeat(68));
  const total = ok + ko;
  if (ko === 0) console.log(`\x1b[32m\x1b[1m  ✓ ${ok}/${total} contrôles passés\x1b[0m`);
  else console.log(`\x1b[31m\x1b[1m  ✗ ${ko} échec(s) sur ${total}\x1b[0m`);
  process.exit(ko === 0 ? 0 : 1);
})();
