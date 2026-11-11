#!/usr/bin/env node
/* Relie le français d'Apprendre aux séquences de l'Atelier (10/11/2026).

   Pourquoi un rapprochement, et pas « module N = séquence N »
   ------------------------------------------------------------
   Les deux progressions ne sont pas découpées pareil. L'Atelier lit les
   progressions nationales (Word ESG, plateforme/progressions.js) : 6 séquences
   par classe. Apprendre lit la progression collectée en ligne
   (apprendre/progressions.js) : le découpage tombe à chaque « remédiation »,
   d'où 8 chapitres en 6e, 14 en 5e, 13 en 4e, 9 à 12 au 2nd cycle C/D — les
   chapitres de trop sont les remédiations de la séquence d'avant. « Chapitre N
   → séquence N » enverrait le professeur sur la mauvaise séquence dès le
   chapitre 2 en 5e.

   On aligne donc DANS L'ORDRE, par le contenu : chaque chapitre est comparé
   aux contenus des semaines 1 à 4 de chaque séquence (mots en commun), et
   l'alignement qui maximise la ressemblance est cherché sous contrainte : il
   commence à la séquence 1 et n'avance que d'une séquence à la fois (un
   chapitre peut rester sur la séquence précédente). Un chapitre sans aucun
   mot commun reste sur la séquence d'avant — c'est sa remédiation.

   Sortie : apprendre/atelier.js (GÉNÉRÉ — ne pas retoucher à la main).
     window.VRT_ATELIER = { "<classe Apprendre>": { prog:"esg-…", libelle, seq:[…] } }
   `seq[i]` = numéro de séquence de l'Atelier du i-ème chapitre de français.

   Usage : node tools/build_apprendre_atelier.cjs [--verifie]
   --verifie : n'écrit rien, échoue si le fichier n'est plus à jour. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.resolve(__dirname, '..');
const SORTIE = path.join(RACINE, 'apprendre', 'atelier.js');

function charger(fichier) {
  const ctx = { window: {}, VRT: {} };
  ctx.window = ctx; ctx.self = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(RACINE, fichier), 'utf8'), ctx, { filename: fichier });
  return ctx;
}
const AP = charger('apprendre/progressions.js').VRT_PROG;
const AT = charger('plateforme/progressions.js').VRT_PROGRESSIONS;
if (!AP || !AT) { console.error('Progressions introuvables (apprendre/ ou plateforme/).'); process.exit(2); }

/* Classes d'Apprendre → classes ESG de l'Atelier (séries A : littéraire ;
   C et D : scientifique). L'enseignement technique n'a pas d'Apprendre. */
const CLASSES = {
  '6e': 'esg-6', '5e': 'esg-5', '4e': 'esg-4', '3e': 'esg-3',
  '2nde A': 'esg-seconde-litteraire', '2nde C': 'esg-seconde-scientifique',
  '1re A': 'esg-premiere-litteraire', '1re C': 'esg-premiere-scientifique', '1re D': 'esg-premiere-scientifique',
  'Tle A': 'esg-terminale-litteraire', 'Tle C': 'esg-terminale-scientifique', 'Tle D': 'esg-terminale-scientifique'
};
const VIDES = new Set(('le la les de du des un une et en au aux texte textes lecture expression ecrite orale ecrit oral '
  + 'grammaire orthographe conjugaison vocabulaire methodique suivie lecon lecons titres pour dans avec leur leurs '
  + 'faire etre avoir sont cette entre plus partir').split(' '));
const mots = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9 ]+/g, ' ').split(' ').filter(m => m.length > 3 && !VIDES.has(m));

/* Alignement monotone : s(0) = 1, s(i+1) ∈ {s(i), s(i)+1}, somme des scores
   maximale. */
function aligner(scores, nSeq) {
  const n = scores.length;
  const NEG = -1e9;
  const best = Array.from({ length: n }, () => new Array(nSeq).fill(NEG));
  const prev = Array.from({ length: n }, () => new Array(nSeq).fill(-1));
  best[0][0] = scores[0][0];
  for (let i = 1; i < n; i++) {
    for (let s = 0; s < nSeq; s++) {
      const rester = best[i - 1][s];
      const avancer = s > 0 ? best[i - 1][s - 1] : NEG;
      /* À égalité on vient de la séquence d'AVANT : on avance le plus tard
         possible, si bien qu'un chapitre sans mot commun (une remédiation)
         reste sur la séquence qu'il suit au lieu d'anticiper la suivante. */
      if (avancer >= rester && avancer > NEG) { best[i][s] = avancer + scores[i][s]; prev[i][s] = s - 1; }
      else if (rester > NEG) { best[i][s] = rester + scores[i][s]; prev[i][s] = s; }
    }
  }
  /* fin : la meilleure séquence atteinte, la plus avancée à score égal */
  let s = 0;
  for (let k = 0; k < nSeq; k++) if (best[n - 1][k] >= best[n - 1][s]) s = k;
  const out = new Array(n);
  for (let i = n - 1; i >= 0; i--) { out[i] = s + 1; s = prev[i][s]; }
  return out;
}

const table = {};
const rapport = [];
for (const c of Object.keys(CLASSES)) {
  const cls = AT.classes.find(x => x.id === CLASSES[c]);
  const chaps = (AP[c] && AP[c]['Français']) || [];
  if (!cls || !chaps.length) { rapport.push(c + ' : classe ou chapitres absents, ignorée'); continue; }
  const seqMots = cls.sequences.map(sq => {
    const S = new Set(mots(sq.module));
    (sq.semaines || []).filter(w => w.n <= 4).forEach(w => (w.contenus || []).forEach(t => mots(t).forEach(m => S.add(m))));
    return S;
  });
  const scores = chaps.map(ch => {
    const ms = []; (ch[1] || []).forEach(l => mots(l[1]).forEach(m => ms.push(m)));
    return seqMots.map(S => ms.filter(m => S.has(m)).length);
  });
  const seq = aligner(scores, cls.sequences.length);
  table[c] = { prog: cls.id, libelle: cls.libelle, seq };
  rapport.push(c.padEnd(7) + ' → ' + cls.id.padEnd(27) + ' ' + seq.join(' '));
}

const contenu = '/* GÉNÉRÉ par tools/build_apprendre_atelier.cjs — ne pas retoucher à la main.\n'
  + '   Chapitre de français d’Apprendre → séquence de l’Atelier de français\n'
  + '   (alignement par le contenu ; voir l’outil pour la méthode). */\n'
  + 'window.VRT_ATELIER=' + JSON.stringify(table) + ';\n';

if (process.argv.includes('--verifie')) {
  const actuel = fs.existsSync(SORTIE) ? fs.readFileSync(SORTIE, 'utf8').replace(/\r\n/g, '\n') : '';
  if (actuel !== contenu) { console.error('apprendre/atelier.js n’est plus à jour : relancer node tools/build_apprendre_atelier.cjs'); process.exit(1); }
  console.log('apprendre/atelier.js à jour (' + Object.keys(table).length + ' classes)');
  process.exit(0);
}
fs.writeFileSync(SORTIE, contenu);
console.log(rapport.join('\n'));
console.log('OK  ' + Object.keys(table).length + ' classes -> apprendre/atelier.js');
