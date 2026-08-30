#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_recherche.cjs — LA RECHERCHE TROUVE-T-ELLE CE QUE LE SITE PUBLIE ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_recherche.cjs

   CE QU'IL PROTÈGE
   L'index de recherche ne connaissait que les catalogues de l'application et
   les corrigés : 309 entrées, dont zéro page publique hors corrigés. Chercher
   « BEPC blanc » ne rendait RIEN, alors que trois épreuves blanches sont en
   ligne. Chercher « Ville cruelle » trouvait la fiche de l'application, jamais
   l'analyse publiée sous /oeuvres/.

   Pire, l'index était PÉRIMÉ : il portait 55 corrigés là où 89 sont publiés.
   Trente-quatre pages introuvables sans que rien ne le signale — un index
   obsolète ne produit pas d'erreur, il produit du silence.

   CE QU'IL VÉRIFIE
     ① l'index couvre les corrigés RÉELLEMENT publiés (il se périme sinon)
     ② les pages des autres zones y sont, avec une URL pour les ouvrir
     ③ chaque entrée `page` porte de quoi être ouverte — un résultat sur
       lequel cliquer ne fait rien est pire qu'un résultat absent
     ④ le client sait ouvrir ce type, et l'affiche avec sa propre étiquette
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RACINE = path.resolve(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => {
  b ? ok++ : ko++;
  console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : ''));
};

console.log(`\n${G}LA RECHERCHE TROUVE-T-ELLE CE QUE LE SITE PUBLIE ?${R}\n`);

const CHUNK = path.join(RACINE, 'chunks', 'index-recherche.js');
dire(fs.existsSync(CHUNK), 'l’index existe (sinon : node tools/build_search_index.cjs)');
if (!fs.existsSync(CHUNK)) { console.log(`\n${ok} au vert, ${ko} au rouge.\n`); process.exit(1); }

const brut = fs.readFileSync(CHUNK, 'utf8');
const idx = JSON.parse(brut.slice(brut.indexOf('['), brut.lastIndexOf(']') + 1));
const parType = {};
idx.forEach(e => { parType[e.t] = (parType[e.t] || 0) + 1; });
dire(idx.length > 0, 'il contient des entrées (' + idx.length + ')');

function versionnees(zone) {
  try {
    return execFileSync('git', ['ls-files', zone + '/'], { cwd: RACINE, encoding: 'utf8' })
      .split('\n').filter(l => l.endsWith('.html'));
  } catch (e) { return []; }
}

/* ── ① L'index ne se périme pas ────────────────────────────────────────── */
console.log(`${G}① L'index suit les corrigés réellement publiés${R}`);
const corriges = versionnees('corriges').filter(f => !f.endsWith('index.html'));
dire(corriges.length > 0, 'des corrigés sont publiés', String(corriges.length));
dire((parType.corrige || 0) >= corriges.length,
  'l’index en connaît au moins autant (' + (parType.corrige || 0) + ' pour ' + corriges.length + ')',
  'index périmé — relancer node tools/build_search_index.cjs');

/* ── ② Les autres zones ────────────────────────────────────────────────── */
console.log(`\n${G}② Les pages publiques hors corrigés y sont aussi${R}`);
dire((parType.page || 0) > 0, 'le type `page` existe dans l’index',
  Object.keys(parType).join(', '));
/* Une page en `noindex` est HORS de ce compte, et c'est délibéré : onze
   livrets portent `<meta name="robots" content="noindex, nofollow">` — ce sont
   les cahiers PAYANTS, servis après paiement. Les faire remonter dans la
   recherche les annoncerait à tout visiteur. Ce qu'on demande aux moteurs
   d'ignorer, notre propre moteur l'ignore aussi. */
const indexable = f => {
  try {
    return !/<meta[^>]+name=["']robots["'][^>]+noindex/i
      .test(fs.readFileSync(path.join(RACINE, f), 'utf8'));
  } catch (e) { return true; }
};
const ZONES = ['oeuvres', 'niveaux', 'evaluations', 'livrets', 'cours', 'outils'];
ZONES.forEach(z => {
  const pub = versionnees(z).filter(f => !f.endsWith('index.html'));
  const ouvertes = pub.filter(indexable);
  if (!pub.length) return;
  const dans = idx.filter(e => e.t === 'page' && (e.u || '').indexOf('/' + z + '/') === 0).length;
  const protegees = pub.length - ouvertes.length;
  dire(dans >= ouvertes.length,
    z + ' : ' + dans + ' indexée(s) pour ' + ouvertes.length + ' publique(s)'
    + (protegees ? ' (' + protegees + ' protégée(s), volontairement hors index)' : ''));
});
/* Le contrôle qui protège le chiffre d'affaires : aucune page marquée
   `noindex` ne doit se retrouver dans la recherche du site. */
const fuites = idx.filter(e => e.t === 'page' && e.u)
  .filter(e => !indexable(e.u.replace(/^\//, '')));
dire(fuites.length === 0,
  'aucune page protégée (`noindex`) n’a fuité dans la recherche',
  fuites.slice(0, 3).map(e => e.u).join(', '));

/* ── ③ Un résultat qu'on ne peut pas ouvrir n'est pas un résultat ──────── */
console.log(`\n${G}③ Chaque page indexée peut être ouverte${R}`);
const pages = idx.filter(e => e.t === 'page');
const sansUrl = pages.filter(e => !e.u);
dire(sansUrl.length === 0, 'toutes les entrées `page` portent une URL',
  sansUrl.slice(0, 3).map(e => e.l).join(', '));
const urlsMortes = pages.filter(e => e.u && !fs.existsSync(path.join(RACINE, e.u.replace(/^\//, ''))));
dire(urlsMortes.length === 0, 'et aucune ne pointe dans le vide',
  urlsMortes.slice(0, 3).map(e => e.u).join(', '));
const sansTitre = pages.filter(e => !e.l || e.l.length < 3);
dire(sansTitre.length === 0, 'et chacune porte un libellé lisible',
  sansTitre.slice(0, 3).map(e => e.u).join(', '));

/* ── ④ Le client sait quoi en faire ────────────────────────────────────── */
console.log(`\n${G}④ Le navigateur sait ouvrir et étiqueter ce type${R}`);
const appjs = fs.readFileSync(path.join(RACINE, 'app.js'), 'utf8');
dire(/if\(e\.t === 'page' && e\.u\)\{ cm\(\); window\.open\(e\.u/.test(appjs),
  'cliquer un résultat `page` ouvre bien son URL');
dire(/page:\s*\{ l:'Page'/.test(appjs),
  'et il s’affiche avec sa propre étiquette, pas le gris de repli');

/* Le contrôle qui rattrape l'oubli le plus probable : ajouter un type à
   l'index sans lui donner de branche d'ouverture. */
const typesIdx = Object.keys(parType);
const nonGeres = typesIdx.filter(t => !new RegExp("e\\.t === '" + t + "'").test(appjs));
dire(nonGeres.length === 0,
  'chaque type présent dans l’index a une branche d’ouverture', nonGeres.join(', '));

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
