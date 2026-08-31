#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_lisibilite_panneau.cjs — LE TITRE RESTE LISIBLE SUR SON PANNEAU
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_lisibilite_panneau.cjs

   CE QU'IL PROTÈGE
   Le panneau d'abonnement (`.vrtc`) est posé en bas des pages de corrigés,
   de niveaux, d'œuvres et d'outils. Son titre porte l'argument de vente.

   Il a été illisible DEUX FOIS, pour la raison inverse à chaque fois :

     v1.19.20  fond SOMBRE (#142554 → #1E3A8A), titre bleu de marque.
               Contraste 1,22:1. Corrigé en passant le titre en blanc.
     31/08/26  la refonte LWS a éclairci le panneau — `veritas-convert.js`
               déclare `.vrtc-in{background:#FAFBFE}` — et le blanc est resté.
               Mesuré en production : 1,03:1. Le correctif de 2026 avait
               reproduit exactement la panne qu'il avait réparée.

   La leçon n'est pas « ne pas mettre de blanc » : c'est que la couleur du
   titre et le fond du panneau sont UN COUPLE, écrits dans deux fichiers
   différents, et que rien ne les tenait ensemble. Ce banc les tient.

   MÉTHODE — on lit le fond là où il est déclaré (`veritas-convert.js`), la
   couleur du titre là où elle est décidée (`veritas-pages.css`, qui a la
   dernière main), et on calcule le contraste WCAG entre les deux.
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

console.log(`\n${G}LE TITRE RESTE LISIBLE SUR SON PANNEAU${R}\n`);

const convert = fs.readFileSync(path.join(RACINE, 'assets', 'veritas-convert.js'), 'utf8');
const pages = fs.readFileSync(path.join(RACINE, 'assets', 'veritas-pages.css'), 'utf8');

/* ── Outils de couleur ──────────────────────────────────────────────────── */
function versRvb(h) {
  h = h.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
}
function luminance(rvb) {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(rvb[0]) + 0.7152 * f(rvb[1]) + 0.0722 * f(rvb[2]);
}
function contraste(a, b) {
  const l1 = luminance(a), l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/* ── ① Le fond du panneau, là où il est déclaré ─────────────────────────── */
console.log(`${G}① Le fond du panneau se lit dans le code qui le pose${R}`);
const mFond = convert.match(/\.vrtc-in\{background:\s*(#[0-9a-fA-F]{3,6})/);
dire(!!mFond, 'assets/veritas-convert.js déclare le fond de .vrtc-in',
  'motif « .vrtc-in{background:#… » introuvable');
if (!mFond) { console.log(`\n${ok} au vert, ${ko} au rouge.\n`); process.exit(1); }
const fond = versRvb(mFond[1]);
dire(!!fond, 'et cette couleur est lisible : ' + mFond[1]);

/* ── ② La couleur du titre, là où elle est décidée ──────────────────────── */
console.log(`\n${G}② La couleur du titre est fixée une seule fois${R}`);
/* `veritas-pages.css` est chargée après le style injecté : c'est elle qui
   tranche. On y cherche la dernière règle qui colore .vrtc-t. */
const regles = [...pages.matchAll(/\.vrtc[^{}]*\.vrtc-t[^{}]*\{([^}]*)\}/g)]
  .map(m => m[1])
  .filter(d => /(^|;)\s*color\s*:/.test(d));
dire(regles.length > 0, 'veritas-pages.css fixe explicitement la couleur du titre',
  'aucune règle : la couleur retombe sur « h2:nth-of-type(4n+1) », donc elle change selon le RANG du titre dans la page — deux pages voisines, deux couleurs');
if (!regles.length) { console.log(`\n${ok} au vert, ${ko} au rouge.\n`); process.exit(1); }

const mCoul = regles[regles.length - 1].match(/color\s*:\s*(#[0-9a-fA-F]{3,6})/);
dire(!!mCoul, 'et cette couleur est une valeur littérale, pas une variable',
  'une variable ne se vérifie pas hors du navigateur');
if (!mCoul) { console.log(`\n${ok} au vert, ${ko} au rouge.\n`); process.exit(1); }
const titre = versRvb(mCoul[1]);

/* ── ③ Le couple tient ──────────────────────────────────────────────────── */
console.log(`\n${G}③ Le couple fond / titre est lisible${R}`);
const c = contraste(titre, fond);
dire(c >= 4.5,
  'contraste ' + c.toFixed(2) + ':1 entre le titre ' + mCoul[1] + ' et le fond ' + mFond[1]
  + ' (plancher WCAG AA : 4,5)',
  'le titre est illisible sur son propre panneau');
dire(c >= 7, 'et il atteint même le niveau AAA (7:1)',
  'lisible, mais sans marge : contraste ' + c.toFixed(2));

/* ── ④ Le piège précis, nommé ───────────────────────────────────────────── */
console.log(`\n${G}④ Plus de blanc imposé par !important${R}`);
{
  const blancForce = /\.vrtc-t[^{}]*\{[^}]*color\s*:\s*(#fff(f{3})?|white)\s*!important/i.test(pages);
  dire(!blancForce,
    'aucune règle ne force le titre en blanc — c’est ce qui a survécu à l’éclaircissement du panneau');
  /* Le fond est-il clair ou sombre ? Le banc doit rester juste si le panneau
     redevient sombre un jour : dans ce cas c'est un titre SOMBRE qui serait la
     faute, et le contrôle ③ le dirait déjà. On note simplement l'état. */
  const clair = luminance(fond) > 0.5;
  console.log('  ' + (clair ? '·' : '·') + ' pour mémoire : le panneau est actuellement '
    + (clair ? 'CLAIR' : 'SOMBRE') + ' — si cela change, la couleur du titre doit changer avec lui.');
}

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
