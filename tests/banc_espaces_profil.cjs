#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_espaces_profil.cjs — CHAQUE PROFIL RETROUVE-T-IL SES ACCÈS ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_espaces_profil.cjs

   CE QU'IL PROTÈGE
   Le plan public (plan.html) range le site par profil. Il restait le
   CONNECTÉ : une fois dans l'application, personne n'a de raison de retourner
   sur la page d'accueil pour retrouver les œuvres au programme ou les
   épreuves blanches. `_espacePerso` proposait quatre actions à l'enseignant,
   quatre au parent, quatre au partenaire — et RIEN à l'élève : sa branche
   retombait sur `[]`, alors qu'il est le public principal du site.

   Pire, l'élève n'atteignait même pas cet espace : les cinq appels de
   `_espacePerso` ne concernaient que parent, enseignant et partenaire.

   DEUX SOURCES QUI DOIVENT S'ACCORDER
   `tools/build_plan.py` (page publique) et `window.VERITAS_ACCES` (dans
   l'application) décrivent la même chose pour deux surfaces. Elles vont
   diverger si rien ne les compare — un service ajouté d'un côté et oublié de
   l'autre, c'est un visiteur qui le trouve et un abonné qui ne le trouve pas.
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

console.log(`\n${G}CHAQUE PROFIL RETROUVE-T-IL SES ACCÈS ?${R}\n`);

const appjs = fs.readFileSync(path.join(RACINE, 'app.js'), 'utf8');

/* On extrait la table telle qu'elle est écrite, et on l'exécute : la lire au
   grep dirait qu'elle existe, pas ce qu'elle contient. */
const i = appjs.indexOf('window.VERITAS_ACCES = [');
dire(i > 0, 'la table des accès existe dans app.js');
if (i < 0) { console.log(`\n${ok} au vert, ${ko} au rouge.\n`); process.exit(1); }
const fin = appjs.indexOf('\n];', i);
const ACCES = new Function('return ' + appjs.slice(i + 'window.VERITAS_ACCES = '.length, fin + 2))();
dire(Array.isArray(ACCES) && ACCES.length >= 10,
  'elle porte au moins dix accès (' + ACCES.length + ')');

/* ── ① Chaque profil est servi ─────────────────────────────────────────── */
console.log(`${G}① Chaque profil a de quoi commencer${R}`);
['eleve', 'parent', 'enseignant', 'partenaire'].forEach(p => {
  const n = ACCES.filter(a => (a.p || []).indexOf(p) >= 0).length;
  dire(n >= 4, p + ' : ' + n + ' accès');
});
/* Le principe même de ce classement : un service peut concerner plusieurs
   publics, et doit alors apparaître chez chacun. */
const corriges = ACCES.find(a => a.u === '/corriges/');
dire(!!corriges && (corriges.p || []).length >= 2,
  'les corrigés servent plusieurs profils à la fois',
  corriges ? (corriges.p || []).join(', ') : 'absent');

/* ── ② Rien qui pointe dans le vide ────────────────────────────────────── */
console.log(`\n${G}② Chaque accès mène quelque part${R}`);
const morts = ACCES.map(a => a.u.split('#')[0].replace(/^\//, ''))
  .filter(c => c && !fs.existsSync(path.join(RACINE, c)));
dire(morts.length === 0, 'aucun lien mort', morts.join(', '));
const sansIcone = ACCES.filter(a => !a.i || !/^lc-/.test(a.i));
dire(sansIcone.length === 0, 'chaque accès porte une icône du sprite',
  sansIcone.map(a => a.t).join(', '));
const sansTexte = ACCES.filter(a => !a.t || !a.d);
dire(sansTexte.length === 0, 'et un titre ET une description');

/* ── ③ Les deux surfaces s'accordent ───────────────────────────────────── */
console.log(`\n${G}③ L'application et le plan public proposent la même chose${R}`);
const plan = fs.readFileSync(path.join(RACINE, 'tools', 'build_plan.py'), 'utf8');
const manquants = ACCES.filter(a => {
  const zone = a.u.replace(/^\//, '').replace(/\/$/, '');
  if (!zone || a.u.indexOf('#') >= 0) return false;
  return plan.indexOf("'" + zone + "'") < 0 && plan.indexOf("'" + a.u + "'") < 0;
});
dire(manquants.length === 0,
  'tout accès de l’application figure aussi au plan public',
  manquants.map(a => a.u).join(', '));

/* ── ④ L'élève peut enfin y entrer ─────────────────────────────────────── */
console.log(`\n${G}④ L'élève atteint son espace${R}`);
dire(/role==='eleve' \? \[/.test(appjs),
  'le rôle « élève » a ses propres actions (il retombait sur `[]`)');
/* Le libellé du bouton vit dans une chaîne JS : ses guillemets y sont
   échappés (`\\"eleve\\"`). Le motif doit l'accepter, sinon le contrôle
   rougit pour une question d'échappement et non de comportement. */
dire(/_espacePerso\(\(SES&&SES\.role\)\|\|\\?"eleve\\?"\)/.test(appjs),
  'et une porte pour y entrer, depuis « Mon compte »');
dire(/h \+= _accesProfilHtml\(role\);/.test(appjs),
  'la grille des accès est rendue dans l’espace personnel');
dire(/if\(!lot\.length\) return '';/.test(appjs),
  'et disparaît si le profil n’a rien — un titre suivi de rien serait pire');

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
