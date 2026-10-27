#!/usr/bin/env node
/* Corrige des fiches mal découpées du corpus de l'Atelier (audit du 26/10/2026).

   ⚠️ À LANCER SUR LA COPIE DU SERVEUR, JAMAIS SUR CELLE DU POSTE.
   `api/data/corpus_minesec.json` est gitignoré et déposé par FTP. Le
   26/10/2026, la copie du poste comptait 3 918 textes (+ 1 014 libres =
   4 932) quand l'Atelier en annonçait 5 006 : redéposer la copie du poste
   aurait effacé 74 textes. Donc : télécharger le fichier du serveur, lancer
   ce script dessus, redéposer CE fichier.

   Les fiches sont visées par (auteur, titre) et non par numéro : les numéros
   ne sont pas garantis identiques d'une copie à l'autre. Relancer le script
   ne change plus rien (idempotent).

   Usage : node tools/corriger_fiches_corpus.cjs chemin/corpus_minesec.json [--ecrire]
   Sans --ecrire : affiche seulement ce qui serait corrigé. */
'use strict';
const fs = require('fs');

const CORRECTIONS = [
  // L'auteur « Gaston-Paul Effa » coupé en deux : « Effa » passait dans le titre.
  // `reference` est la ligne de source imprimée sous le texte : elle se corrige avec.
  { author: 'Gaston Paul', title: "Effa L'enfant que tu as été marche à côté de toi",
    fix: { author: 'Gaston-Paul Effa', title: 'L’Enfant que tu as été marche à côté de toi',
      reference: 'Gaston-Paul Effa, L’Enfant que tu as été marche à côté de toi' } },
  // Éditeur et année recopiés dans le titre ; trait d'union manquant.
  { author: 'Gaston Paul Effa', title: 'L’Enfant que tu as été marche à côté de toi. Gallimard, 2020.',
    fix: { author: 'Gaston-Paul Effa', title: 'L’Enfant que tu as été marche à côté de toi',
      reference: 'Gaston-Paul Effa, L’Enfant que tu as été marche à côté de toi, Gallimard, 2020' } },
  // Titre exact du roman (Gallimard, 2015) : « qui blesse », verbe, sans accent.
  { author: 'Gaston-Paul Effa', title: 'Rendez-vous avec l’heure qui blessé',
    fix: { title: 'Rendez-vous avec l’heure qui blesse',
      reference: 'Gaston-Paul Effa, Rendez-vous avec l’heure qui blesse' } },
];

const [chemin, drapeau] = process.argv.slice(2);
if (!chemin) { console.error('Usage : node tools/corriger_fiches_corpus.cjs <corpus.json> [--ecrire]'); process.exit(2); }
const brut = fs.readFileSync(chemin, 'utf8');
const items = JSON.parse(brut);
if (!Array.isArray(items)) { console.error('Format inattendu : un tableau de fiches est attendu.'); process.exit(2); }

let n = 0;
for (const it of items) {
  for (const c of CORRECTIONS) {
    if (it.author === c.author && it.title === c.title) {
      console.log('n°' + it.n + ' : « ' + it.author + ' — ' + it.title + ' » → « '
        + (c.fix.author || it.author) + ' — ' + (c.fix.title || it.title) + ' »');
      Object.assign(it, c.fix);
      n++;
    }
  }
}
console.log(items.length + ' fiches lues, ' + n + ' corrigée(s).');
if (drapeau === '--ecrire' && n) {
  fs.copyFileSync(chemin, chemin + '.avant-correction');
  fs.writeFileSync(chemin, JSON.stringify(items));
  console.log('Écrit. Sauvegarde : ' + chemin + '.avant-correction');
} else if (n) {
  console.log('Simulation : relancer avec --ecrire pour enregistrer.');
}
