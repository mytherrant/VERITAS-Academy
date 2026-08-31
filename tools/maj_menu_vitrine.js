#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tools/maj_menu_vitrine.js — REPORTER LA TABLE DU MENU DANS LA PAGE SERVIE
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tools/maj_menu_vitrine.js          # applique
     node tools/maj_menu_vitrine.js --verifier   # constate sans écrire

   POURQUOI CET OUTIL EXISTE
   `vitrine.html` est un artefact CONSTRUIT, mais c'est lui qui est versionné
   et servi ; la maquette Design Canvas dont il sort ne l'est pas. Reconstruire
   toute la page pour changer une entrée de menu rejouerait tout le pipeline
   sur une source absente de l'intégration — et écraserait au passage les
   corrections portées à la main dans les deux fichiers.

   Cet outil ne touche donc QUE les deux panneaux de menu (#vrtPlus pour le
   bureau, la colonne ajoutée après #vrtBurger pour le téléphone), en réutilisant
   la table `MENU` et le générateur d'entrées de `build_vitrine.js`. Le balisage
   produit est identique à celui du build : même fonction, même source.

   `--verifier` sert à l'intégration : il échoue si la page servie ne présente
   pas exactement ce que la table déclare. Sans lui, une entrée ajoutée à la
   table et jamais reportée resterait invisible, et personne ne le saurait.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');
const SRC = path.join(RACINE, 'tools', 'build_vitrine.js');
const PAGE = path.join(RACINE, 'vitrine.html');
const VERIF = process.argv.indexOf('--verifier') >= 0;

/* ── On emprunte la table et le générateur au build, sans l'exécuter ──────
   build_vitrine.js lit process.argv et écrit un fichier dès qu'on le charge :
   on en extrait donc les seuls morceaux utiles, par leurs bornes de texte. */
const src = fs.readFileSync(SRC, 'utf8');

function morceau(depart, finLigne) {
  const i = src.indexOf(depart);
  if (i < 0) throw new Error('Introuvable dans build_vitrine.js : ' + depart);
  const j = src.indexOf(finLigne, i);
  if (j < 0) throw new Error('Fin introuvable pour : ' + depart);
  return src.slice(i, j + finLigne.length);
}

const bloc = [
  morceau("const esc = s =>", ";\n"),
  morceau("const APP = ", ";\n"),
  morceau("const MENU = [", "\n];"),
  morceau("const ICO_MENU = ", "/></svg>';"),
  morceau("function entreeHTML(e) {", "\n}")
].join('\n');

const { MENU, entreeHTML, esc } = new Function(bloc + '\nreturn { MENU, entreeHTML, esc };')();

const colonnes = MENU.map(g =>
  '<div class="vmn-col"><p class="vmn-t">' + esc(g.titre)
  + (g.sous ? '<small>' + esc(g.sous) + '</small>' : '') + '</p>'
  + g.entrees.map(entreeHTML).join('') + '</div>').join('');

/* ── Remplacement des deux panneaux, avec la même mécanique que le build ── */
let page = fs.readFileSync(PAGE, 'utf8');
const avant = page;

function bornes(marqueur) {
  const deb = page.indexOf(marqueur);
  if (deb < 0) throw new Error('Panneau introuvable : ' + marqueur);
  const ouv = page.indexOf('>', deb);
  let prof = 0, fin = -1;
  for (let k = ouv + 1; k < page.length; k++) {
    if (page.startsWith('<div', k)) prof++;
    else if (page.startsWith('</div>', k)) { if (prof === 0) { fin = k; break; } prof--; }
  }
  if (fin < 0) throw new Error('Panneau non refermé : ' + marqueur);
  return { deb, fin: fin + '</div>'.length };
}

/* 1. Bureau */
{
  const b = bornes('<div id="vrtPlus"');
  page = page.slice(0, b.deb)
    + '<div id="vrtPlus" class="vmn" hidden role="menu" aria-label="Toutes les rubriques">' + colonnes + '</div>'
    + page.slice(b.fin);
}
/* 2. Téléphone — le panneau est posé APRÈS #vrtBurger par le build ; on le
      remplace s'il existe, on l'ajoute sinon. */
{
  const i = page.indexOf('<div class="vmn vmn-mob">');
  const neuf = '<div class="vmn vmn-mob">' + colonnes + '</div>';
  if (i >= 0) {
    const b = bornes('<div class="vmn vmn-mob">');
    page = page.slice(0, b.deb) + neuf + page.slice(b.fin);
  } else {
    const b = bornes('<div id="vrtBurger"');
    page = page.slice(0, b.fin - '</div>'.length) + neuf + page.slice(b.fin - '</div>'.length);
  }
}

const total = MENU.reduce((n, g) => n + g.entrees.length, 0);

if (VERIF) {
  if (page !== avant) {
    console.error('✗ vitrine.html ne présente pas le menu que la table déclare.');
    console.error('  Lance : node tools/maj_menu_vitrine.js');
    process.exit(1);
  }
  console.log('✓ Le menu servi correspond à la table (' + total + ' entrées, ' + MENU.length + ' groupes).');
  process.exit(0);
}

if (page === avant) {
  console.log('= menu déjà à jour (' + total + ' entrées).');
} else {
  fs.writeFileSync(PAGE, page);
  console.log('+ menu reporté dans vitrine.html : ' + total + ' entrées en ' + MENU.length + ' groupes.');
}
