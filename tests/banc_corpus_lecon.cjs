#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_corpus_lecon.cjs — LE CORPUS PROPOSÉ CORRESPOND-IL À LA LEÇON ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_corpus_lecon.cjs

   CE QU'IL PROTÈGE
   Le sélecteur de texte support ne cherchait que dans l'auteur, le titre et le
   corps du texte. Rien ne le reliait à la leçon en cours : pour une « Leçon de
   langue — les expansions du nom, 6ᵉ, séquence 3 », il proposait les 2 054
   fiches du répertoire dans l'ordre du fichier. L'enseignant lisait des
   extraits jusqu'à en trouver un qui serve.

   Chaque fiche porte pourtant de quoi répondre : son NIVEAU, son TYPE
   (descriptif, narratif, dialogue…), son MODULE, et ses `faits` — les faits de
   langue qu'elle permet d'observer.

   LA RÈGLE : on CLASSE, on ne filtre pas. Masquer, c'est risquer de cacher le
   texte que l'enseignant cherchait ; et une liste vide ferait croire au
   répertoire vide, alors que c'est la leçon qui n'est pas renseignée.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => {
  b ? ok++ : ko++;
  console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : ''));
};

const src = fs.readFileSync(path.join(RACINE, 'plateforme', 'index.html'), 'utf8');

function extraire(s, entete) {
  const i = s.indexOf(entete);
  if (i < 0) return null;
  let prof = 0;
  const j = s.indexOf('{', i);
  if (j < 0) return null;
  for (let k = j; k < s.length; k++) {
    if (s[k] === '{') prof++;
    else if (s[k] === '}') { prof--; if (prof === 0) return s.slice(i, k + 1); }
  }
  return null;
}

console.log(`\n${G}LE CORPUS PROPOSÉ CORRESPOND-IL À LA LEÇON ?${R}\n`);

const corps = extraire(src, '_scoreCorpus(f, co){');
dire(!!corps, '`_scoreCorpus` est extractible du fichier');
if (!corps) { console.log('\n0 au vert, 1 au rouge.\n'); process.exit(1); }

const obj = new Function('return ({' + corps + '});')();
const score = (f, co) => obj._scoreCorpus(f, co);

/* Fiches calquées sur le répertoire réel (mêmes champs, mêmes libellés). */
const FICHES = [
  { n: 1, type: 'DESCRIPTIF', level: '6e', groupNum: 3, words: 120,
    group: 'Module 3 — La maison', author: 'Ombété-Bella',
    faits: 'le champ lexical dominant ; l’imparfait descriptif ; les expansions du nom (épithète, complément du nom).' },
  { n: 2, type: 'NARRATIF', level: '3e', groupNum: 1, words: 200,
    group: 'Module 1 — La vie quotidienne', author: 'Oyono',
    faits: 'le passé simple ; les connecteurs temporels ; le schéma narratif.' },
  { n: 3, type: 'DESCRIPTIF', level: '3e', groupNum: 5, words: 150,
    group: 'Module 5 — Le village', author: 'Beti',
    faits: 'les expansions du nom ; la comparaison ; les adjectifs qualificatifs.' },
  { n: 4, type: 'DIALOGUE', level: '6e', groupNum: 3, words: 90,
    group: 'Module 3 — La maison', author: 'Maeterlinck',
    faits: 'les types de phrases ; le tiret de dialogue ; les verbes de parole.' },
  { n: 5, type: 'ARGUMENTATIF', level: 'Tle', groupNum: 2, words: 320,
    group: 'Module 2 — Le débat', author: 'Senghor',
    faits: 'les connecteurs logiques ; la thèse et l’antithèse ; le lexique de l’opinion.' },
];

/* ── ① La leçon renseignée fait remonter ce qui lui correspond ─────────── */
console.log(`${G}① Une leçon de langue retrouve ses textes${R}`);
const lecon = { id: 'k1', title: 'Les expansions du nom', type: 'Leçon de langue',
  classe: '6ᵉ', sequence: 'Séquence 3', competence: 'Lire pour décrire',
  objAgir: 'Identifier et employer les expansions du nom dans un texte descriptif',
  regle: '' };

const classe = FICHES.map(f => ({ n: f.n, s: score(f, lecon) }))
  .sort((a, b) => b.s.score - a.s.score);
dire(classe[0].n === 1,
  'la fiche 6ᵉ · module 3 · descriptif · expansions du nom arrive en tête',
  'ordre obtenu : ' + classe.map(c => 'n°' + c.n + '(' + c.s.score + ')').join(' '));
dire(classe[0].s.score > classe[classe.length - 1].s.score,
  'le classement discrimine réellement (le premier devance le dernier)');

const r1 = score(FICHES[0], lecon);
dire(r1.raisons.some(x => /6e/i.test(x)), 'la raison cite le niveau', JSON.stringify(r1.raisons));
dire(r1.raisons.some(x => /descriptif/i.test(x)), 'et le type de texte', JSON.stringify(r1.raisons));
dire(r1.raisons.some(x => /fait/i.test(x)), 'et les faits de langue communs', JSON.stringify(r1.raisons));
dire(r1.raisons.some(x => /module 3/i.test(x)), 'et le module', JSON.stringify(r1.raisons));

/* Une fiche du bon fait de langue mais du mauvais niveau doit rester derrière
   celle qui coche tout — sans pour autant tomber à zéro : elle reste utile. */
const r3 = score(FICHES[2], lecon);
dire(r3.score > 0, 'un texte au bon fait de langue mais d’un autre niveau reste conseillé',
  'score ' + r3.score);
dire(r3.score < r1.score, 'mais passe après celui qui correspond aussi au niveau',
  r3.score + ' vs ' + r1.score);

/* ── ② Une leçon vide ne fabrique aucun conseil ────────────────────────── */
console.log(`\n${G}② Sans leçon renseignée, aucun conseil inventé${R}`);
const vide = { id: 'k2', title: '', classe: '', sequence: '', objAgir: '',
  competence: '', regle: '', type: '' };
const scoresVides = FICHES.map(f => score(f, vide).score);
dire(scoresVides.every(s => s === 0),
  'toutes les fiches sont à zéro — on n’annonce pas un conseil qu’on n’a pas',
  JSON.stringify(scoresVides));
dire(score(FICHES[0], null).score === 0, 'aucune leçon ouverte → aucun score');

/* ── ③ Le bruit ne remonte pas ─────────────────────────────────────────── */
console.log(`\n${G}③ Les mots vides ne font pas remonter tout le répertoire${R}`);
const bruit = { id: 'k3', title: 'Séance de français pour les élèves',
  objAgir: 'Faire lire le texte aux élèves', classe: '', sequence: '',
  competence: '', regle: '', type: '' };
const sc = FICHES.map(f => score(f, bruit).score);
dire(sc.every(s => s === 0),
  '« élèves », « texte », « français », « lire » sont écartés',
  JSON.stringify(sc));

/* ── ④ Le dialogue et la poésie se reconnaissent par l'intention ───────── */
console.log(`\n${G}④ L'intention de la leçon désigne le type de texte${R}`);
const theatre = { id: 'k4', title: 'Étudier une scène de théâtre', classe: '6ᵉ',
  objAgir: 'Repérer les répliques et les didascalies', sequence: '',
  competence: '', regle: '', type: '' };
const sd = score(FICHES[3], theatre);
dire(sd.raisons.some(x => /dialogue/i.test(x)),
  'une leçon sur les répliques retrouve les textes DIALOGUE', JSON.stringify(sd.raisons));
const narratif = { id: 'k5', title: 'Raconter un souvenir', classe: '3e',
  objAgir: 'Écrire un récit au passé', sequence: '', competence: '', regle: '', type: '' };
dire(score(FICHES[1], narratif).raisons.some(x => /narratif/i.test(x)),
  '« raconter » retrouve les textes NARRATIF');

/* ── ⑤ Le classement ne masque jamais la liste ─────────────────────────── */
console.log(`\n${G}⑤ Classer n'est pas filtrer${R}`);
dire(/coClasse=coFiltre\.slice\(\)\.sort/.test(src),
  'la liste complète est TRIÉE, pas réduite');
dire(/coSeulsConseilles\s*=\s*!!st\.coCorpusConseilles\s*&&\s*coNbConseilles>0/.test(src),
  'la bascule « ne montrer que ceux-là » ne s’arme que s’il y a des conseillés');
dire(/coConseilVisible:coNbConseilles>0/.test(src),
  'le bandeau disparaît quand il n’a rien à dire, au lieu d’afficher « 0 texte »');
dire(/if\(coScores && !coQ\)/.test(src),
  'une recherche libre reste prioritaire — on ne réordonne pas sous les doigts');

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
