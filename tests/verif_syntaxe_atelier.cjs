/* Contrôle de syntaxe du bloc applicatif de l'Atelier de Français.
 *
 * `plateforme/index.html` porte ~5 000 lignes de JavaScript dans un
 * <script type="text/x-dc"> que le NAVIGATEUR NE COMPILE PAS lui-même : le
 * moteur Design Canvas le lit comme du texte et l'évalue à la volée. Une
 * faute de syntaxe n'est donc signalée nulle part avant l'exécution — pas
 * par le navigateur au chargement, pas par `node --check index.html`, qui
 * ne sait pas lire du HTML. L'écran reste blanc et rien ne dit pourquoi.
 *
 * Ce contrôle extrait le bloc et le compile vraiment. Il prend 200 ms et
 * remplace une demi-heure de recherche à l'aveugle.
 *
 *   node tests/verif_syntaxe_atelier.cjs
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.resolve(__dirname, '..');
let soucis = 0;

/* 1. Le bloc x-dc de index.html */
const html = fs.readFileSync(path.join(RACINE, 'plateforme/index.html'), 'utf8');
const m = html.match(/<script[^>]*type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/i);
if (!m) {
  console.log('  [ KO ] bloc <script type="text/x-dc"> introuvable dans index.html');
  process.exit(1);
}
/* Le bloc commence par un commentaire puis `class Component extends DCLogic`.
   On lui donne une base pour que la compilation porte sur le vrai code. */
try {
  new vm.Script('class DCLogic{constructor(){}setState(){}}\n' + m[1],
    { filename: 'plateforme/index.html (bloc x-dc)' });
  const lignes = m[1].split('\n').length;
  console.log('  [ OK ] bloc x-dc compilé (' + lignes + ' lignes)');
} catch (e) {
  console.log('  [ KO ] bloc x-dc : ' + e.message);
  soucis++;
}

/* 2. Les modules chargés à côté */
['support.js', 'minesec.js', 'conformite.js', 'exercices.js', 'texte.js', 'docx.js']
  .forEach(n => {
    const f = path.join(RACINE, 'plateforme', n);
    if (!fs.existsSync(f)) { console.log('  [ KO ] ' + n + ' : absent'); soucis++; return; }
    try {
      new vm.Script(fs.readFileSync(f, 'utf8'), { filename: 'plateforme/' + n });
      console.log('  [ OK ] ' + n);
    } catch (e) { console.log('  [ KO ] ' + n + ' : ' + e.message); soucis++; }
  });

/* 3. Equilibrage des balises du gabarit.
   Une <div> ouverte et jamais fermee ne provoque aucune erreur : le
   navigateur referme tout seul, en general au mauvais endroit, et la mise en
   page se decale sans que rien ne le signale. Sur un gabarit de plus de
   2 000 lignes, cela ne se voit pas a la lecture -- et un volet repliable
   ajoute une paire de balises a chaque fois, ce qui est exactement le geste
   ou l'on en oublie une. */
const gabarit = html.slice(0, html.indexOf('<script type="text/x-dc"'));
[['div', /<div\b[^>]*>/gi, /<\/div>/gi],
 ['section', /<section\b[^>]*>/gi, /<\/section>/gi],
 ['aside', /<aside\b[^>]*>/gi, /<\/aside>/gi],
 ['sc-if', /<sc-if\b[^>]*>/gi, /<\/sc-if>/gi],
 ['sc-for', /<sc-for\b[^>]*>/gi, /<\/sc-for>/gi]].forEach(function (t) {
  var nom = t[0];
  var a = (gabarit.match(t[1]) || []).length;
  var b = (gabarit.match(t[2]) || []).length;
  if (a === b) { console.log('  [ OK ] <' + nom + '> equilibre (' + a + ' paires)'); return; }
  console.log('  [ KO ] <' + nom + '> : ' + a + ' ouvertes pour ' + b + ' fermees (ecart ' + (a - b) + ')');
  soucis++;
});

console.log(soucis ? '\n  ' + soucis + ' fichier(s) en faute\n' : '\n  Syntaxe saine\n');
process.exit(soucis ? 1 : 0);
