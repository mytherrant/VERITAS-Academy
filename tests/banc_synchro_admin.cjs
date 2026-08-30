#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_synchro_admin.cjs — LE TRAVAIL DE L'ADMINISTRATEUR SURVIT-IL ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_synchro_admin.cjs

   CE QU'IL PROTÈGE — deux pertes silencieuses, signalées le 30/08/2026 sous
   la forme « la modale ne s'ouvre pas et l'enregistrement ne tient pas après
   rechargement ».

   ① LE PULL ÉCRASAIT LE TRAVAIL NON ENCORE ENVOYÉ.
     `_lwsBackgroundPull` remplace la base locale (`DB=_lwsRemote`) dès que le
     serveur se dit plus récent. Or `save()` écrit d'abord en local puis
     DIFFÈRE l'envoi. Et le serveur touche `lastModified` de son côté à chaque
     écriture : une inscription de visiteur, une soumission de devoir, un
     paiement. Il suffisait donc qu'un élève s'inscrive pour que le poste de
     l'administrateur soit déclaré périmé — et le rechargement suivant
     effaçait le manuel qu'il venait d'ajouter, sans un mot.

   ② L'ENVOI SUPPRIMAIT LES MOTS DE PASSE QU'IL FALLAIT GARDER.
     Le filtre ne conservait que ce qui commence par « $ », c'est-à-dire
     bcrypt. Le navigateur, lui, fabrique ses empreintes en « S256$… » :
     `'S256$…'.startsWith('$')` vaut FAUX. Tout compte visiteur né sur le poste
     de l'admin montait donc au serveur SANS mot de passe — et son titulaire se
     voyait refuser à l'Atelier avec le bon mot de passe, exactement comme au
     bug du 28/08, par un autre chemin.
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

const src = fs.readFileSync(path.join(RACINE, 'app.js'), 'utf8');

function extraire(s, entete) {
  const i = s.indexOf(entete);
  if (i < 0) return null;
  let prof = 0;
  const j = s.indexOf('{', i);
  if (j < 0) return null;
  for (let k = j; k < s.length; k++) {
    if (s[k] === '{') prof++;
    else if (s[k] === '}') { prof--; if (prof === 0) return s.slice(i, k + 1); }
  }
  return null;
}

console.log(`\n${G}LE TRAVAIL DE L'ADMINISTRATEUR SURVIT-IL ?${R}\n`);

/* ── ① Les empreintes de mot de passe ──────────────────────────────────── */
console.log(`${G}① L'envoi garde les empreintes, jette le clair${R}`);
const corps = extraire(src, 'function _stripPlainPwd(o){');
dire(!!corps, '`_stripPlainPwd` est extractible');
if (corps) {
  const f = new Function('return ' + corps + '; ')();
  const cas = [
    ['S256$' + 'a'.repeat(64), true,  'une empreinte S256 (celle du navigateur)'],
    ['$2y$12$' + 'b'.repeat(50), true, 'une empreinte bcrypt (celle du serveur)'],
    ['motdepasse', false, 'un mot de passe EN CLAIR'],
    ['123456', false, 'un mot de passe court en clair'],
  ];
  cas.forEach(([pwd, garde, quoi]) => {
    const o = { pwd: pwd };
    f(o);
    dire((o.pwd !== undefined) === garde,
      (garde ? 'garde ' : 'supprime ') + quoi,
      'pwd ' + (o.pwd === undefined ? 'supprimé' : 'conservé'));
  });
  /* Ce qui ne doit pas casser : un compte sans mot de passe du tout. */
  const vide = {};
  f(vide);
  dire(vide.pwd === undefined, 'un compte sans mot de passe ne fait pas tomber l’envoi');
}

/* ── ② Le pull n'écrase pas le travail non envoyé ──────────────────────── */
console.log(`\n${G}② Le pull respecte ce qui n'est pas encore parti${R}`);
dire(/var _pousseOk = window\._fbLastSyncedMs \|\| 0;/.test(src),
  'le pull lit le dernier envoi CONFIRMÉ');
dire(/if\(_lwsLocal > _pousseOk\)\{/.test(src),
  'et compare la base locale à celui-ci');
const i = src.indexOf('if(_lwsLocal > _pousseOk){');
const bloc = i > 0 ? src.slice(i, i + 600) : '';
dire(/return;/.test(bloc),
  'il RENONCE au remplacement quand du travail local n’est pas parti');
dire(/save\(\)/.test(bloc),
  'et il repousse ce travail au lieu de l’abandonner');
const iEcrase = src.indexOf('DB=_lwsRemote;');
dire(iEcrase > i && i > 0,
  'la garde est bien AVANT l’écrasement — après, elle ne servirait à rien',
  'garde à ' + i + ', écrasement à ' + iEcrase);
dire(/window\._fbLastSyncedMs=DB\.lastModified\|\|Date\.now\(\);/.test(src),
  'et le marqueur est posé quand l’envoi réussit');

/* ── ③ Ce que l'administration doit pouvoir publier ────────────────────── */
console.log(`\n${G}③ Un manuel ajouté peut atteindre la vitrine${R}`);
dire(/id="bkVit"/.test(src),
  'le formulaire de création porte la case de publication');
dire(/DB\.books\[DB\.books\.length-1\]\.vitrine = !!\(document\.getElementById\('bkVit'\)/.test(src),
  'et elle est bien enregistrée sur le manuel créé');
dire(/b\.vitrine=!!\(document\.getElementById\('eBkVit'\)\?\.checked\)/.test(src),
  'la fiche de modification la porte aussi');

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
