#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_couvertures.cjs — LES COUVERTURES DÉPOSÉES SONT-ELLES UTILISÉES ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_couvertures.cjs

   CE QU'IL PROTÈGE
   `uploads/oeuvres/` contient soixante visuels — dix-huit couvertures d'œuvres
   au programme, vingt-huit de livrets — tous versionnés et tous servis en
   production (vérifié : HTTP 200). Et pourtant, le 30/08/2026 :

     · la page d'accueil affichait la MÊME photo générique de manuels empilés
       (`assets/photo-manuels.webp`) pour « Ngum a Jemea », « Balafon »,
       « Capitoline » et « Le Tube Digestif », alors que les quatre ont leur
       couverture sur le serveur ;
     · `oeuvres/5e-arbre-fetiche.html` retombait sur l'image de partage du site
       parce que sa couverture est le SEUL fichier en .png du dossier — le
       reste est en .jpg, et la page cherchait un .jpg.

   Le travail existe, il est en ligne, il est invisible. Rien ne le signale :
   une image générique s'affiche parfaitement, elle est juste fausse.

   La règle du dossier est simple, et c'est celle d'api/livret.php : le nom de
   la couverture se DÉDUIT de la clé, et déposer un fichier suffit à l'afficher.
   Ce banc vérifie l'autre moitié — qu'un fichier déposé soit bien utilisé.
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

console.log(`\n${G}LES COUVERTURES DÉPOSÉES SONT-ELLES UTILISÉES ?${R}\n`);

const DOSSIER = path.join(RACINE, 'uploads', 'oeuvres');
dire(fs.existsSync(DOSSIER), 'le dossier des couvertures existe');
if (!fs.existsSync(DOSSIER)) { console.log(`\n${ok} au vert, ${ko} au rouge.\n`); process.exit(1); }

const fichiers = fs.readdirSync(DOSSIER).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
dire(fichiers.length > 0, fichiers.length + ' visuel(s) déposé(s)');

/* ── ① Ils partent bien en production ──────────────────────────────────── */
console.log(`${G}① Les fichiers sont versionnés (donc déployables)${R}`);
let suivis = [];
try {
  suivis = require('child_process')
    .execFileSync('git', ['ls-files', 'uploads/oeuvres/'], { cwd: RACINE, encoding: 'utf8' })
    .split('\n').filter(Boolean).map(f => path.basename(f));
} catch (e) { suivis = fichiers; }
const nonSuivis = fichiers.filter(f => suivis.indexOf(f) < 0);
dire(nonSuivis.length === 0,
  'aucune couverture n’est restée hors du dépôt',
  nonSuivis.slice(0, 4).join(', '));

/* ── ② Chaque page d'œuvre porte SA couverture ─────────────────────────── */
console.log(`\n${G}② Chaque page d'œuvre porte la sienne, pas une image générique${R}`);
/* Le nom du fichier suit la clé de l'œuvre : `3e_ville_cruelle.jpg` pour
   `oeuvres/3e-ville-cruelle.html`. On accepte les deux extensions : le seul
   PNG du dossier est précisément celui qui manquait à sa page. */
const pagesOeuvres = fs.existsSync(path.join(RACINE, 'oeuvres'))
  ? fs.readdirSync(path.join(RACINE, 'oeuvres')).filter(f => f.endsWith('.html') && f !== 'index.html')
  : [];
dire(pagesOeuvres.length > 0, pagesOeuvres.length + ' page(s) d’œuvre');

const orphelines = [];
pagesOeuvres.forEach(f => {
  const cle = f.replace(/\.html$/, '').replace(/-/g, '_');
  const visuel = fichiers.find(v => v.replace(/\.[a-z]+$/i, '') === cle);
  if (!visuel) return;                       // pas de couverture déposée : rien à exiger
  const html = fs.readFileSync(path.join(RACINE, 'oeuvres', f), 'utf8');
  if (html.indexOf('uploads/oeuvres/' + visuel) < 0) orphelines.push(f + ' → ' + visuel);
});
dire(orphelines.length === 0,
  'toute page dont la couverture existe l’utilise',
  orphelines.slice(0, 4).join(' · '));

/* ── ③ La vitrine n'affiche plus la photo générique ────────────────────── */
console.log(`\n${G}③ L'accueil montre les vraies couvertures${R}`);
const vitrine = fs.readFileSync(path.join(RACINE, 'vitrine.html'), 'utf8');
[['Ngum a Jemea', 'tle_ngum_jemea'],
 ['Balafon', '1ere_balafon'],
 ['Capitoline', '2nde_tribus_capitoline'],
 ['Le Tube Digestif', 'tubedigestif']].forEach(([titre, base]) => {
  const visuel = fichiers.find(v => v.replace(/\.[a-z]+$/i, '') === base);
  if (!visuel) { dire(false, titre + ' : couverture absente du dossier', base); return; }
  dire(vitrine.indexOf('uploads/oeuvres/' + visuel) >= 0,
    titre + ' porte sa couverture', visuel);
});
/* Le contrôle qui empêche le retour en arrière : la photo de manuels empilés
   ne doit plus servir de couverture d'œuvre. Elle reste légitime ailleurs
   (illustration de section), d'où le seuil plutôt que zéro. */
const generiques = (vitrine.match(/assets\/photo-manuels\.webp/g) || []).length;
dire(generiques <= 1,
  'la photo générique ne sert plus de couverture (' + generiques + ' usage restant)');

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
