#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_resultats_examens.cjs — AUCUN RÉSULTAT D'EXAMEN INVENTÉ
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_resultats_examens.cjs

   CE QU'IL PROTÈGE
   La page « Nos résultats aux examens » — atteignable depuis l'entrée
   « Résultats aux examens » du menu, colonne Parent — affichait TROIS années
   scolaires complètes : 2022-2023, 2021-2022, 2020-2021. Dix classes chacune
   (3ème, Tle A/C/D/F/G1/TI, CAP 2, Form 5, Upper Sixth), avec pour chacune un
   taux, un nombre de candidats et un nombre d'admis.

   Tout était inventé. Deux de ces années sont antérieures à la fondation du
   centre. Les seuls chiffres confirmés par Jacques sont BEPC 100 %,
   Probatoire 69 %, BAC 61 % — sans détail par classe ni effectif.

   Un taux de réussite est l'argument de vente le plus fort d'un centre
   scolaire, et le plus vérifiable par un parent. L'inventer n'est pas une
   approximation, c'est la seule chose qu'on ne peut pas se permettre.

   CE QUE LE BANC EXIGE
   1. Le seed ne fournit plus aucune année.
   2. La purge de migration retire les années semées d'une base existante —
      vider le seed ne suffit pas, une base créée ne le rejoue jamais.
   3. Elle ÉPARGNE une année réellement saisie par l'administration.
   4. La page ne se contente pas d'être vide : elle montre les taux confirmés.
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

console.log(`\n${G}AUCUN RÉSULTAT D'EXAMEN INVENTÉ${R}\n`);

const src = fs.readFileSync(path.join(RACINE, 'app.js'), 'utf8');

/* ── ① Le seed ne fournit plus rien ─────────────────────────────────────── */
console.log(`${G}① Le seed ne livre aucune année${R}`);
{
  const i = src.indexOf('\n  examResults:');
  dire(i > 0, 'le champ existe toujours dans defaultDB()');
  const suite = src.slice(i, i + 200);
  dire(/examResults:\s*\[\s*\]/.test(suite),
    'et il est vide — plus aucune année livrée d’office',
    suite.split('\n')[1] || '');
  for (const an of ['2020–2021', '2021–2022', '2022–2023']) {
    /* Les années peuvent rester citées dans un commentaire ou dans la purge ;
       ce qu'on interdit, c'est une DONNÉE : une année suivie de ses niveaux. */
    const re = new RegExp("annee:\\s*'" + an + "'\\s*,\\s*niveaux");
    dire(!re.test(src), 'aucune donnée semée pour ' + an);
  }
  dire(src.indexOf("cls:'Upper Sixth'") < 0,
    'et plus une seule classe fictive dans le seed');
}

/* ── ② et ③ La purge, exécutée ──────────────────────────────────────────── */
console.log(`\n${G}② La purge nettoie une base existante, sans excès de zèle${R}`);
{
  const i = src.indexOf('function _purgerResultatsSemes()');
  dire(i > 0, 'la purge de migration est présente');
  if (i > 0) {
    const fin = src.indexOf('\n  })();', i);
    const corps = src.slice(src.indexOf('{', i) + 1, fin);

    const semee = (an) => ({
      annee: an,
      niveaux: [
        { cls: '3ème', taux: 85, candidats: 42, admis: 36 }, { cls: 'Tle A', taux: 78, candidats: 28, admis: 22 },
        { cls: 'Tle C', taux: 90, candidats: 20, admis: 18 }, { cls: 'Tle D', taux: 82, candidats: 15, admis: 13 },
        { cls: 'CAP 2', taux: 88, candidats: 18, admis: 16 }, { cls: 'Tle F', taux: 83, candidats: 12, admis: 10 },
        { cls: 'Tle G1', taux: 87, candidats: 14, admis: 12 }, { cls: 'Tle TI', taux: 84, candidats: 10, admis: 8 },
        { cls: 'Form 5', taux: 91, candidats: 22, admis: 20 }, { cls: 'Upper Sixth', taux: 87, candidats: 16, admis: 14 }
      ]
    });
    /* Une année que l'administration a réellement saisie : même millésime,
       mais deux classes et pas d'Upper Sixth. Elle doit survivre. */
    const vraie = { annee: '2022–2023', niveaux: [{ cls: '3ème', taux: 100, candidats: 7, admis: 7 }] };
    const recente = { annee: '2025–2026', niveaux: [{ cls: '3ème', taux: 100, candidats: 9, admis: 9 }] };

    const lancer = (liste) => {
      const DB = { examResults: liste };
      let sauve = 0;
      new Function('DB', 'save', corps)(DB, () => { sauve++; });
      return { reste: DB.examResults, sauve };
    };

    let r = lancer([semee('2020–2021'), semee('2021–2022'), semee('2022–2023')]);
    dire(r.reste.length === 0, 'les trois années semées disparaissent',
      r.reste.map(x => x.annee).join(', '));
    dire(r.sauve === 1, 'et la base est réécrite une fois — sinon elles reviennent au rechargement');

    r = lancer([semee('2022–2023'), vraie, recente]);
    dire(r.reste.length === 2 && r.reste.indexOf(vraie) >= 0,
      'une année RÉELLE du même millésime est épargnée', r.reste.length + ' restante(s)');
    dire(r.reste.indexOf(recente) >= 0, 'une année récemment saisie est épargnée aussi');

    r = lancer([]);
    dire(r.sauve === 0, 'une base déjà propre n’est pas réécrite pour rien');
  }
}

/* ── ④ La page ne reste pas nue ─────────────────────────────────────────── */
console.log(`\n${G}④ Une liste vide montre les taux confirmés${R}`);
{
  dire(src.indexOf('Taux confirmes par le centre') > 0 || src.indexOf('Taux confirmés par le centre') > 0,
    'l’état vide affiche les taux confirmés au lieu d’une page nue');
  dire(src.indexOf("Le detail par classe et par effectif n") > 0
    || src.indexOf('Le détail par classe et par effectif n') > 0,
    'et il dit explicitement ce qu’il ne publie pas');
  /* La bannière calculait une moyenne sur examResults : vidé, elle annonçait
     « 0% de réussite » comme argument de vente. */
  dire(!/Math\.round\(DB\.examResults\.flatMap/.test(src),
    'la bannière de moyenne ne se calcule plus sur un tableau vide');
}

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
