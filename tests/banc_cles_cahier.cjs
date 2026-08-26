#!/usr/bin/env node
/**
 * tests/banc_cles_cahier.cjs — LA CLÉ D'UN EXERCICE SURVIT-ELLE À UNE CORRECTION ?
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 *   node tests/banc_cles_cahier.cjs
 *
 * POURQUOI CE BANC EXISTE
 *   Chaque réponse d'élève est rangée sous la clé de son exercice. Si cette clé
 *   bouge quand le cahier est corrigé — un exercice ajouté, un autre retiré —
 *   alors, à la rentrée suivante, l'élève rouvre son cahier et trouve ses
 *   réponses sous les MAUVAISES questions, et l'annotation du professeur
 *   désigne un exercice qu'il n'a pas lu. Personne ne s'en aperçoit tout de
 *   suite : rien ne casse, tout glisse.
 *
 * CE QUI A ÉTÉ MESURÉ LE 26/08/2026, sur un vrai cahier de 2ⁿᵈᵉ (55 champs),
 * en insérant UN SEUL exercice au début :
 *
 *     méthode de clé                     intactes   pointent ailleurs
 *     compteur d'affichage (a1, a2…)        0/55            55
 *     indice du bloc (b14/r2)               0/55            38  (+17 perdues)
 *     séquence + leçon + empreinte         55/55             0
 *
 *   Le compteur d'affichage est ce que faisait le moteur d'origine : les 55
 *   réponses changeaient d'exercice. Et il est trompeur à mesurer — les
 *   CHAÎNES « a1…a55 » se recouvrent d'une version à l'autre, si bien qu'une
 *   comparaison d'ensembles le déclare intact. Il faut comparer ce que la clé
 *   DÉSIGNE, pas la clé elle-même. C'est ce que fait ce banc.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');
const { calculerCles, empreinte } = require(path.join(RACINE, 'livrets', 'cahier.js'));

let ok = 0, ko = 0;
const dit = (bon, quoi, det) => {
  if (bon) { ok++; console.log('  \x1b[32m✓\x1b[0m ' + quoi); }
  else { ko++; console.log('  \x1b[31m✗\x1b[0m ' + quoi + (det ? '  → ' + det : '')); }
};

/* Un cahier réduit mais fidèle : deux séquences, des leçons, des questions
   avec pointillés, des exercices sans. */
function cahierType() {
  const blocs = [];
  for (let s = 1; s <= 2; s++) {
    blocs.push({ y: 'module', no: s, title: 'Séquence ' + s });
    for (let l = 1; l <= 3; l++) {
      blocs.push({ y: 'lecon', no: l, title: 'Leçon ' + l });
      blocs.push({ y: 'texte', r: [{ t: 'Un extrait de la séquence ' + s + ', leçon ' + l + '.' }] });
      for (let q = 1; q <= 4; q++) {
        blocs.push({ y: 'question', r: [
          { t: 'S' + s + 'L' + l + ' — question ' + q + ' : que remarques-tu ?' }, { tail: 1 }] });
      }
      blocs.push({ y: 'exercice', txt: 'S' + s + 'L' + l + ' — exercice de production.' });
    }
  }
  return blocs;
}

/** clé → ce que la clé DÉSIGNE (le texte de l'exercice). */
function carte(blocs) {
  const cles = calculerCles('2nde', blocs);
  const m = {};
  blocs.forEach((b, i) => {
    if (!cles[i]) return;
    const y = b.y || b.t || '';
    if (!/^(question|exercice|taskBody|consigne|hwBody)$/.test(y)) return;
    const t = b.txt || (b.r || []).map(r => r.t || '').join('');
    m[cles[i]] = t;
  });
  return m;
}

function juger(avant, apres) {
  let ailleurs = 0, disparues = 0, total = 0;
  for (const k in avant) {
    total++;
    if (!(k in apres)) disparues++;
    else if (apres[k] !== avant[k]) ailleurs++;
  }
  return { total, ailleurs, disparues, intactes: total - ailleurs - disparues };
}

console.log('\n\x1b[1m1. L’empreinte d’une consigne\x1b[0m');
dit(empreinte('Que remarques-tu ?') === empreinte('  Que   remarques-tu ?  '),
    'les espaces et la mise en page ne changent pas la clé');
dit(empreinte('Que remarques-tu ?') === empreinte('QUE REMARQUES-TU ?'),
    'la casse non plus');
dit(empreinte('Question A') !== empreinte('Question B'),
    'deux consignes différentes donnent deux clés différentes');
dit(/^[a-z0-9]+$/.test(empreinte('Test')), 'l’empreinte tient dans une clé d’URL');

console.log('\n\x1b[1m2. Le cahier ne bouge pas : rien ne doit bouger\x1b[0m');
const base = cahierType();
const c0 = carte(base);
dit(Object.keys(c0).length === 30, Object.keys(c0).length + ' exercices repérés');
dit(new Set(Object.keys(c0)).size === Object.keys(c0).length, 'toutes les clés sont distinctes');
const cIdem = juger(c0, carte(cahierType()));
dit(cIdem.intactes === cIdem.total, 'deux rendus du même cahier donnent les mêmes clés');

console.log('\n\x1b[1m3. UN exercice ajouté au début — le cas qui casse tout\x1b[0m');
const ajout = [{ y: 'question', r: [{ t: 'Question ajoutée cette année.' }, { tail: 1 }] }]
  .concat(cahierType());
const j1 = juger(c0, carte(ajout));
dit(j1.ailleurs === 0, 'aucune réponse ne change d’exercice', j1.ailleurs + ' déplacée(s)');
dit(j1.disparues === 0, 'aucune réponse n’est orpheline', j1.disparues + ' perdue(s)');

console.log('\n\x1b[1m4. Un exercice RETIRÉ au milieu\x1b[0m');
const sansUn = cahierType();
const iRetire = sansUn.findIndex(b => (b.r || []).some(r => /S1L2 — question 2/.test(r.t || '')));
sansUn.splice(iRetire, 1);
const j2 = juger(c0, carte(sansUn));
dit(j2.ailleurs === 0, 'les autres réponses restent sur leur exercice', j2.ailleurs + ' déplacée(s)');
dit(j2.disparues === 1, 'seule la réponse de l’exercice retiré devient orpheline',
    j2.disparues + ' orpheline(s)');

console.log('\n\x1b[1m5. Une LEÇON entière insérée\x1b[0m');
const avecLecon = cahierType();
const iSeq2 = avecLecon.findIndex(b => b.y === 'module' && b.no === 2);
avecLecon.splice(iSeq2, 0,
  { y: 'lecon', no: 9, title: 'Leçon neuve' },
  { y: 'question', r: [{ t: 'Question de la leçon neuve.' }, { tail: 1 }] });
const j3 = juger(c0, carte(avecLecon));
dit(j3.ailleurs === 0 && j3.disparues === 0,
    'la séquence 2 n’est pas affectée par une leçon ajoutée en séquence 1',
    j3.ailleurs + ' déplacée(s), ' + j3.disparues + ' perdue(s)');

console.log('\n\x1b[1m6. Deux consignes IDENTIQUES dans la même leçon\x1b[0m');
const jumelles = [
  { y: 'module', no: 1 }, { y: 'lecon', no: 1 },
  { y: 'question', r: [{ t: 'Justifie ta réponse.' }, { tail: 1 }] },
  { y: 'question', r: [{ t: 'Justifie ta réponse.' }, { tail: 1 }] },
];
const cj = calculerCles('2nde', jumelles);
dit(cj[2] !== cj[3], 'elles ne se partagent pas la même clé', cj[2] + ' vs ' + cj[3]);

console.log('\n\x1b[1m7. Ce que donnaient les méthodes abandonnées\x1b[0m');
/* On les rejoue pour que le chiffre du bandeau ci-dessus reste vérifiable, et
   pour que ce banc échoue si quelqu'un y revenait par mégarde. */
function carteCompteur(blocs) {
  let n = 0; const m = {};
  blocs.forEach(b => {
    const y = b.y || b.t || '';
    const tails = (b.r || []).filter(r => r && (r.tail || r.rule || r.fill)).length;
    const t = b.txt || (b.r || []).map(r => r.t || '').join('');
    for (let i = 0; i < tails; i++) m['a' + (++n)] = t;
    if (/^(question|exercice|taskBody|consigne|hwBody)$/.test(y) && !tails) m['a' + (++n)] = t;
  });
  return m;
}
const jc = juger(carteCompteur(base), carteCompteur(ajout));
dit(jc.ailleurs > 0,
    'le compteur d’affichage déplacerait ' + jc.ailleurs + ' réponse(s) sur ' + jc.total,
    'il n’en déplace aucune ?');
dit(jc.intactes === 0, 'et il n’en laisserait AUCUNE en place');

console.log('\n' + '─'.repeat(68));
const total = ok + ko;
if (ko === 0) console.log(`\x1b[32m\x1b[1m  ✓ ${ok}/${total} contrôles passés\x1b[0m`);
else console.log(`\x1b[31m\x1b[1m  ✗ ${ko} échec(s) sur ${total}\x1b[0m`);
process.exit(ko === 0 ? 0 : 1);
