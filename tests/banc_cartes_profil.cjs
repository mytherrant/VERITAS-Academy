#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_cartes_profil.cjs — CHACUN ARRIVE CHEZ LUI
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_cartes_profil.cjs

   CE QU'IL PROTÈGE
   La vitrine porte DEUX jeux de cartes par public, et c'est le piège. Les
   quatre vignettes « chacun son espace » (région `services`) ont été
   repointées le 30/08/2026 ; les trois grandes cartes illustrées Élèves /
   Parents / Enseignants, elles, sont restées telles quelles. Jacques l'a
   signalé le 31/08 : « ceci renvoie toujours vers e-learning ».

   Un élève à qui la carte promet « le programme de sa classe, les corrigés et
   un tuteur » atterrissait sur le catalogue d'abonnements. Ce n'est pas un
   détour : la section `elearning` de la vitrine ne porte AUCUN lien sortant,
   `parents` en porte 2, `enseignants` 3. Ce sont des pages de présentation.
   Les panneaux de plan.html en portent 22, 20 et 14, vers les corrigés, les
   œuvres au programme, les épreuves, les cours et les outils réellement
   publiés.

   CE QUE LE BANC EXIGE
   Toute carte qui nomme un public mène au panneau de ce public ; ce panneau
   existe ; et il porte assez de liens pour mériter le mot « espace ».
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

console.log(`\n${G}CHACUN ARRIVE CHEZ LUI${R}\n`);

const vitrine = fs.readFileSync(path.join(RACINE, 'vitrine.html'), 'utf8');
const js = fs.readFileSync(path.join(RACINE, 'assets', 'vitrine.js'), 'utf8');
const plan = fs.readFileSync(path.join(RACINE, 'plan.html'), 'utf8');

/* ── ① Aucune carte de public ne retombe sur une section de présentation ── */
console.log(`${G}① Les cartes de public ne mènent plus à une page de vente${R}`);

/* Les boutons qui NOMMENT un public. On les repère par leur libellé, pas par
   leur position : la maquette peut être reconstruite, le libellé reste. */
const LIBELLES = ['Espace Élève', 'Espace Parents', 'Rejoindre le réseau', 'Espace Partenaires'];
const boutons = [];
/* 900 caractères et non 80 : le libellé du bouton précède une icône SVG
   entière. Trop court, la capture n'atteint jamais `</button>` et le banc
   déclare zéro carte — un vert par cécité. */
const reBouton = /<button[^>]*onclick="VRT\.act\('([a-zA-Z_]+)'[^>]*>([\s\S]{0,900}?)<\/button>/g;
let m;
while ((m = reBouton.exec(vitrine))) {
  const texte = m[2].replace(/<[^>]*>/g, '').trim();
  for (const l of LIBELLES) if (texte.indexOf(l) === 0) boutons.push({ act: m[1], libelle: l });
}
dire(boutons.length >= 3, 'les cartes de public sont repérables dans la page servie',
  boutons.length + ' bouton(s) trouvé(s)');

const generiques = boutons.filter(b => b.act === 'u__aller');
dire(generiques.length === 0,
  'aucune ne passe par le routeur générique, qui les renvoyait dans la vitrine',
  generiques.map(b => b.libelle).join(', '));

/* ── ② Chaque destination est un panneau de profil ──────────────────────── */
console.log(`\n${G}② Chaque bouton vise un panneau de profil${R}`);
const cibles = {};
for (const b of boutons) {
  const re = new RegExp(b.act + ":\\s*function\\s*\\([^)]*\\)\\s*\\{[^}]*'(/plan\\.html#[a-z]+)'");
  const t = js.match(re);
  dire(!!t, '« ' + b.libelle + ' » → ' + (t ? t[1] : 'aucune destination lisible'),
    t ? '' : 'le gestionnaire ' + b.act + ' ne pointe pas plan.html');
  if (t) cibles[b.libelle] = t[1].split('#')[1];
}

/* ── ③ Le panneau existe, et il mène quelque part ───────────────────────── */
console.log(`\n${G}③ Le panneau existe et porte de vraies ressources${R}`);
const ancres = Object.keys(cibles).map(k => cibles[k]);
const idsPlan = (plan.match(/id="([a-z]+)"/g) || []).map(s => s.slice(4, -1));
for (const a of ancres.filter((v, i, s) => s.indexOf(v) === i)) {
  dire(idsPlan.indexOf(a) >= 0, 'plan.html porte bien l’ancre #' + a);
}

/* Combien de liens sortants chaque panneau porte-t-il ? On délimite un
   panneau par l'ancre suivante — c'est la structure du plan. */
function liensDuPanneau(ancre) {
  const i = plan.indexOf('id="' + ancre + '"');
  if (i < 0) return -1;
  let fin = plan.length;
  for (const autre of idsPlan) {
    if (autre === ancre) continue;
    const j = plan.indexOf('id="' + autre + '"', i + 1);
    if (j > i && j < fin) fin = j;
  }
  return (plan.slice(i, fin).match(/<a\s[^>]*href=/g) || []).length;
}
const PLANCHER = 5;
for (const a of ancres.filter((v, i, s) => s.indexOf(v) === i)) {
  const n = liensDuPanneau(a);
  dire(n >= PLANCHER,
    'le panneau #' + a + ' porte ' + n + ' liens (plancher ' + PLANCHER + ')',
    'un « espace » qui ne mène nulle part n’en est pas un');
}

/* ── ④ Aucun public n'est laissé sans porte ─────────────────────────────── */
console.log(`\n${G}④ Chaque public a une porte depuis l'accueil${R}`);
{
  /* « Chacun doit trouver facilement ce qui l'intéresse sans effort. » Le
     contrôle ci-dessus vérifie que les cartes PRÉSENTES visent juste ; celui-ci
     vérifie qu'il n'en MANQUE aucune. Une carte supprimée par mégarde laisserait
     un public entier sans entrée depuis la page d'accueil, sans rien casser
     ailleurs — c'est le genre de perte qu'aucun autre banc ne verrait. */
  const atteints = {};
  /* Les deux écritures comptent : les gestionnaires de vitrine.js posent
     « /plan.html#… » (absolu), le pied de page écrit « plan.html#… »
     (relatif à la racine, où la page est servie). Ne reconnaître que la
     première ferait déclarer absente une porte qui fonctionne. */
  for (const t of vitrine.match(/\bplan\.html#([a-z]+)/g) || []) atteints[t.split('#')[1]] = true;
  for (const a of (vitrine.match(/VRT\.act\('(go[A-Za-z]+)'/g) || [])) {
    const nom = a.slice(9, -1);
    const t = js.match(new RegExp(nom + ":\\s*function\\s*\\([^)]*\\)\\s*\\{[^}]*'/plan\\.html#([a-z]+)'"));
    if (t) atteints[t[1]] = true;
  }
  for (const p of ['eleve', 'parent', 'enseignant', 'partenaire']) {
    dire(!!atteints[p], 'le public « ' + p + ' » a une porte depuis la page servie',
      'aucun bouton ni lien de vitrine.html ne mène à /plan.html#' + p);
  }
}

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
