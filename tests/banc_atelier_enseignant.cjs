#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_atelier_enseignant.cjs — L'ENSEIGNANT ATTEINT-IL SON ATELIER,
   ET NE VOIT-IL QUE SES MATIÈRES ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_atelier_enseignant.cjs

   CE QU'IL PROTÈGE — deux frictions signalées en production le 28/08/2026 :

   ① L'ATELIER SANS PORTE. Le site vend l'Atelier de Français à l'inscription,
     puis n'y mène plus : il fallait quitter la page, retaper l'adresse de
     mémoire, et ressaisir l'identifiant qu'on venait de choisir. Le lien
     transporte donc l'identifiant en fragment (#u=), et l'Atelier remplit le
     champ. Deux programmes tiennent cette promesse — app.js écrit le lien,
     plateforme/index.html le lit — et ils n'ont aucun appel en commun : c'est
     exactement la situation qui a produit le bug d'authentification du même
     jour. On mesure donc les DEUX bouts.

   ② LE PROFESSEUR DE FRANÇAIS DEVANT LES ÉPREUVES DE GÉNIE CIVIL. Le filtre
     « Matière » de showEpreuves existait ; rien ne le pré-remplissait. On
     vérifie que la restriction s'applique, qu'elle se laisse lever, qu'elle
     respecte un choix explicite, et surtout qu'elle ne produit JAMAIS une
     page vide.

   MÉTHODE — sans navigateur : les fonctions réelles sont EXTRAITES d'app.js et
   exécutées avec des bouchons. On ne réécrit pas la logique testée, sinon on
   mesurerait sa copie.
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

const app = fs.readFileSync(path.join(RACINE, 'app.js'), 'utf8');
const atelier = fs.readFileSync(path.join(RACINE, 'plateforme', 'index.html'), 'utf8');

/* Extrait une fonction entière depuis sa signature, en comptant les accolades.
   Plus sûr qu'une regex gourmande : le corps contient lui-même des accolades. */
function extraire(src, entete) {
  const i = src.indexOf(entete);
  if (i < 0) return null;
  let prof = 0, j = src.indexOf('{', i);
  if (j < 0) return null;
  for (let k = j; k < src.length; k++) {
    if (src[k] === '{') prof++;
    else if (src[k] === '}') { prof--; if (prof === 0) return src.slice(i, k + 1); }
  }
  return null;
}

console.log(`\n${G}L'ENSEIGNANT ATTEINT-IL SON ATELIER ?${R}\n`);

/* ── ① Le lien vers l'Atelier ──────────────────────────────────────────── */
console.log(`${G}① Le site mène à l'Atelier${R}`);

const srcOuvrir = extraire(app, 'window._ouvrirAtelier = function()');
dire(!!srcOuvrir, '`_ouvrirAtelier` existe dans app.js');

let urlDemandee = null, cible = null;
if (srcOuvrir) {
  const ctx = {
    SES: { mat: 'takou', nom: 'Takou', role: 'enseignant' },
    window: { open: (u, c) => { urlDemandee = u; cible = c; } },
    location: {},
  };
  // eslint-disable-next-line no-new-func
  new Function('SES', 'window', 'location', 'encodeURIComponent',
    srcOuvrir + '; window._ouvrirAtelier();'
  )(ctx.SES, ctx.window, ctx.location, encodeURIComponent);
}
dire(urlDemandee === '/plateforme/#u=takou',
  'le lien porte l’identifiant en fragment', String(urlDemandee));
dire(cible === '_blank', 'il s’ouvre dans un nouvel onglet', String(cible));
dire(!/motDePasse|pwd|password/.test(String(srcOuvrir || '')),
  'aucun mot de passe ne voyage dans l’URL');

/* Sans session, le lien doit rester valide — simplement sans identifiant. */
let urlAnonyme = null;
if (srcOuvrir) {
  new Function('SES', 'window', 'location', 'encodeURIComponent',
    srcOuvrir + '; window._ouvrirAtelier();'
  )(null, { open: (u) => { urlAnonyme = u; } }, {}, encodeURIComponent);
}
dire(urlAnonyme === '/plateforme/',
  'sans session connectée, le lien reste utilisable', String(urlAnonyme));

/* ── ② L'Atelier lit ce que le site lui transmet ───────────────────────── */
console.log(`\n${G}② L'Atelier reçoit l'identifiant (l'autre bout du contrat)${R}`);

dire(/_lireIdentifiantPropose\(\)/.test(atelier),
  '`_lireIdentifiantPropose` est APPELÉE au démarrage (pas seulement écrite)');
const srcLire = extraire(atelier, '_lireIdentifiantPropose(){');
dire(!!srcLire, 'sa définition est présente');
dire(!!srcLire && /\[#&\]u=/.test(srcLire),
  'elle lit bien le fragment `#u=` — le format que le site écrit');
dire(!!srcLire && /authMail/.test(srcLire),
  'elle remplit le champ Identifiant (authMail)');
dire(!!srcLire && /replaceState/.test(srcLire),
  'elle nettoie l’adresse : un lien partagé ne trimballe pas l’identifiant');
dire(!!srcLire && /this\._jeton\(\)/.test(srcLire),
  'elle n’écrase pas une session déjà ouverte');

/* ── ③ La porte est visible depuis l'espace enseignant ─────────────────── */
console.log(`\n${G}③ La porte est là où l'enseignant regarde${R}`);

const srcEspace = extraire(app, 'window._espacePerso = function(role)');
dire(!!srcEspace, '`_espacePerso` est trouvable');
/* Découper sur `role==='parent' ?` seul tomberait sur la ligne du BADGE, bien
   avant la liste d'actions — le banc mesurait alors un fragment qui ne
   contient rien de ce qu'il cherche, et rougissait sur du code correct. On
   ancre donc sur la fin réelle du tableau des actions enseignant. */
const iActions = (srcEspace || '').indexOf("var actions = role==='enseignant' ? [");
const iFinActions = (srcEspace || '').indexOf("] : role==='parent' ? [", iActions);
const blocEns = (iActions >= 0 && iFinActions > iActions)
  ? srcEspace.slice(iActions, iFinActions) : '';
dire(blocEns.length > 0, 'le tableau des actions enseignant est délimitable');
dire(/Atelier de Français/.test(blocEns),
  'la carte « Atelier de Français » est dans les actions enseignant');
dire(/_ouvrirAtelier\(\)/.test(blocEns),
  'et elle appelle vraiment `_ouvrirAtelier`');
const iAtelier = blocEns.indexOf('Atelier de Français');
const iEpreuves = blocEns.indexOf('Épreuves & annales');
dire(iAtelier > 0 && iEpreuves > 0 && iAtelier < iEpreuves,
  'elle vient en PREMIER — c’est le produit qu’on lui a vendu');
dire(/Mes matières/.test(blocEns) && /mMesMatieres\(\)/.test(blocEns),
  'la carte « Mes matières » est présente et branchée');

/* ── ④ La concordance des matières ─────────────────────────────────────── */
console.log(`\n${G}④ « Maths » retrouve-t-il « Mathématiques » ?${R}`);

const srcNorm = extraire(app, 'function _rechNorm(s)');
const srcAlias = (app.match(/var _MAT_ALIAS = \{[\s\S]*?\};/) || [null])[0];
const srcCle = extraire(app, 'function _matCle(s)');
const srcConc = extraire(app, 'function _matConcorde(a, b)');
dire(!!(srcNorm && srcAlias && srcCle && srcConc),
  'les fonctions de concordance sont extractibles');

let concorde = () => false;
if (srcNorm && srcAlias && srcCle && srcConc) {
  concorde = new Function(
    srcNorm + '\n' + srcAlias + '\n' + srcCle + '\n' + srcConc + '\nreturn _matConcorde;'
  )();
}
dire(concorde('Maths', 'Mathématiques'), '« Maths » = « Mathématiques » (ce n’est pas un préfixe)');
dire(concorde('FRANCAIS', 'Français'), 'la casse et les accents ne séparent pas');
dire(concorde('Français', 'Littérature') === false, '« Français » ≠ « Littérature »');
dire(concorde('Philo', 'Philosophie'), '« Philo » = « Philosophie »');
dire(concorde('SVT', 'Français') === false, 'deux matières distinctes ne se confondent pas');
dire(concorde('', 'Français') === false, 'une matière vide n’attrape rien');
dire(concorde('e', 'Français') === false,
  'un fragment d’une lettre n’attrape pas la moitié du catalogue');

/* ── ⑤ La restriction dans showEpreuves ────────────────────────────────── */
console.log(`\n${G}⑤ Le filtre s'applique, se lève, et ne vide jamais la page${R}`);

/* On extrait le bloc RÉEL de showEpreuves, entre son premier repère et le
   commentaire « // Filtres ». C'est ce code-là qu'on exécute — pas une
   paraphrase écrite pour le test. */
const iDeb = app.indexOf("  var _mesMat=(typeof _matieresEnseignant==='function')");
const iFin = app.indexOf('  // Filtres', iDeb);
const blocRestriction = (iDeb > 0 && iFin > iDeb) ? app.slice(iDeb, iFin) : null;
dire(!!blocRestriction, 'le bloc de restriction est extractible de showEpreuves');

function jouer(poolInit, matieresProf, opts) {
  opts = opts || {};
  const w = { _epMesMat: opts.epMesMat };
  const f = new Function('pool', 'mat', 'window', '_matieresEnseignant', '_matConcorde',
    blocRestriction + '\nreturn {pool:pool, filtre:_filtreMesMat};');
  return f(poolInit.slice(), opts.mat || '', w, () => matieresProf.slice(), concorde);
}

const CATALOGUE = [
  { id: 'a', matiere: 'Français', classe: '3ème' },
  { id: 'b', matiere: 'Littérature', classe: '1ère' },
  { id: 'c', matiere: 'SVT', classe: '3ème' },
  { id: 'd', matiere: 'Génie civil', classe: 'F4' },
  { id: 'e', matiere: 'Comptabilité générale', classe: 'STT' },
];

if (blocRestriction) {
  const r1 = jouer(CATALOGUE, ['Français', 'Littérature']);
  dire(r1.filtre === true, 'le filtre s’active pour un enseignant qui a des matières');
  dire(r1.pool.length === 2 && r1.pool.every(e => e.id === 'a' || e.id === 'b'),
    'seules ses matières restent', r1.pool.map(e => e.matiere).join(', '));

  const r2 = jouer(CATALOGUE, []);
  dire(r2.filtre === false && r2.pool.length === 5,
    'sans matières déclarées, rien n’est masqué');

  const r3 = jouer(CATALOGUE, ['Français'], { epMesMat: false });
  dire(r3.filtre === false && r3.pool.length === 5,
    '« Tout voir » lève bien la restriction');

  const r4 = jouer(CATALOGUE, ['Français'], { mat: 'SVT' });
  dire(r4.filtre === false && r4.pool.length === 5,
    'un filtre choisi à la main a le dernier mot');

  /* Le cas qui compte : une matière déclarée qui ne correspond à RIEN. Une
     restriction appliquée aveuglément donnerait une page vide — l'enseignant
     conclurait que le catalogue est vide, pas que son filtre est trop étroit. */
  const r5 = jouer(CATALOGUE, ['Éducation musicale']);
  dire(r5.filtre === false && r5.pool.length === 5,
    'une matière sans aucune épreuve ne vide pas la page');

  const r6 = jouer(CATALOGUE, ['Maths']);
  dire(r6.filtre === false && r6.pool.length === 5,
    '« Maths » sans épreuve de maths au catalogue : page conservée');
}

/* ── ⑥ Le filtre s'annonce ─────────────────────────────────────────────── */
console.log(`\n${G}⑥ Un filtre qui masque doit le dire${R}`);
const srcShow = extraire(app, 'function showEpreuves()');
dire(!!srcShow && /Filtré sur vos matières/.test(srcShow),
  'le bandeau annonce ce qui est masqué');
dire(!!srcShow && /window\._epMesMat=false;showEpreuves\(\)/.test(srcShow),
  'le bouton « Tout voir » est câblé');
dire(!!srcShow && /revenir à mes matières/.test(srcShow),
  'et le chemin de retour existe aussi');

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
