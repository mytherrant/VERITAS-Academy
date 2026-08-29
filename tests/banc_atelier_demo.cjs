#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_atelier_demo.cjs — LE NOUVEL INSCRIT TROUVE-T-IL UNE PAGE VIERGE ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_atelier_demo.cjs

   CE QU'IL PROTÈGE
   L'Atelier est livré avec un décor : six profils, trois épreuves, deux cours,
   des propositions, des messages. Il sert la visite guidée — montrer à quoi
   ressemble l'outil rempli, avant toute inscription. Légitime.

   Mais `_adopterIdentite` RE-TAMPONNAIT ce décor au nom du compte qui venait
   de se connecter. Constaté en production le 28/08/2026 sur chaque compte
   créé : trois épreuves jamais écrites (dont deux signées du nom du nouvel
   inscrit), « 12 événement(s) » d'activité, dix notifications, des
   propositions de « Mme Aïcha Bello », « Lycée Bilingue de Yaoundé » inscrit
   d'office dans le profil, et « CRÉDITS 14 / 20 épreuves ce mois » — un
   compteur hérité du profil de démonstration `u1`.

   C'est une règle du projet, pas un détail d'affichage : base vide ⇒ rien
   affiché ; on n'invente ni activité ni statistique. Elle avait déjà été
   rétablie trois fois par des filtres à l'AFFICHAGE (membres, messages,
   sélecteur de compte) — et chaque fois un écran passait entre les mailles.
   D'où la règle à la SOURCE : le décor porte `demo:true`, et la connexion à
   un vrai compte le jette.

   CE QUI NE DOIT PAS CASSER
   ① la visite guidée garde son décor (personne n'est connecté) ;
   ② le travail réellement produit avant l'inscription reste acquis, et
     continue d'être re-tamponné au nom du nouveau compte.
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

const src = fs.readFileSync(path.join(RACINE, 'plateforme', 'index.html'), 'utf8');

function extraire(s, entete) {
  const i = s.indexOf(entete);
  if (i < 0) return null;
  let prof = 0, j = s.indexOf('{', i);
  if (j < 0) return null;
  for (let k = j; k < s.length; k++) {
    if (s[k] === '{') prof++;
    else if (s[k] === '}') { prof--; if (prof === 0) return s.slice(i, k + 1); }
  }
  return null;
}

console.log(`\n${G}LE NOUVEL INSCRIT TROUVE-T-IL UNE PAGE VIERGE ?${R}\n`);

/* ── ① Le décor est marqué à la source ─────────────────────────────────── */
console.log(`${G}① Le décor se sait décor${R}`);
dire(/seedUsers\.forEach\(function\(u\)\{\s*u\.demo\s*=\s*true/.test(src),
  'les profils de démonstration portent `demo`');
dire(/seedEp\.forEach\(function\(e\)\{\s*e\.demo\s*=\s*true/.test(src),
  'les épreuves de démonstration aussi');
dire(/seedCours\.forEach\(function\(c\)\{\s*c\.demo\s*=\s*true/.test(src),
  'les cours de démonstration aussi');

/* ── ② _adopterIdentite jette le décor et garde le travail ─────────────── */
console.log(`\n${G}② La connexion à un vrai compte fait le tri${R}`);

const corps = extraire(src, '_adopterIdentite(accId,nom){');
dire(!!corps, '`_adopterIdentite` est extractible');

function etatDemo() {
  return {
    currentUserId: 'u1',
    users: [
      { id: 'u1', name: 'Mme Nadège Fotso', role: 'Enseignant', quota: { limit: 20, used: 6 }, demo: true },
      { id: 'u3', name: 'Mme Aïcha Bello', role: 'Inspecteur / concepteur', quota: { limit: 40, used: 4 }, demo: true },
    ],
    epreuves: [
      { id: 'e1', title: 'Devoir de lecture méthodique — 3ᵉ', ownerId: 'u1', editorIds: ['u3'],
        comments: [{ id: 'c1', userId: 'u3', text: 'Bonne sélection.' }],
        activity: [{ userId: 'u1', text: 'a créé l’épreuve', ts: 1 }], demo: true },
      { id: 'e1756000000000', title: 'Mon vrai brouillon', ownerId: 'u1', editorIds: [],
        comments: [], activity: [{ userId: 'u1', text: 'a créé l’épreuve', ts: 2 }] },
    ],
    cours: [
      { id: 'k1', ownerId: 'u1', history: [{ userId: 'u1', text: 'a créé le cours' }], demo: true },
      { id: 'k1756000000000', ownerId: 'u1', history: [{ userId: 'u1', text: 'a créé le cours' }] },
    ],
    proposals: { e1: [{ id: 'p1', userId: 'u3', target: 'Texte 2 · Question II.2' }] },
    chatMsgs: [{ userId: 'u3', text: 'message du décor' }, { id: 'm1', userId: 'u1', text: 'vrai message' }],
    msgsByConv: { team: [{ userId: 'u3', text: 'décor' }, { id: 'm2', userId: 'u1', text: 'vrai' }] },
    team: { name: 'Lycée Bilingue de Yaoundé', plan: 'Établissement', quota: { limit: 120, used: 38 } },
    activeId: 'e1', activeCoursId: 'k1',
  };
}

/* `_adopterIdentite` s'appuie sur la MEME reconnaissance du décor que
   l'instantané partagé avec l'équipe (`_estDecor` / `_sansDecor`). On les
   extrait avec elle : les tester séparément laisserait passer une divergence
   entre les deux chemins — et c'est précisément cette divergence qui a
   permis au décor de revenir par la synchronisation. */
const outils = ['_estDecor(x, motif){', '_sansDecor(liste, motif){']
  .map(e => extraire(src, e));

function adopter(etat, accId, nom) {
  const obj = new Function('return ({' + [corps].concat(outils.filter(Boolean)).join(',') + '});')();
  obj.state = etat;
  let recu = null;
  obj.setState = (s) => { recu = s; };
  obj._adopterIdentite(accId, nom);
  return recu;
}

let r = corps ? adopter(etatDemo(), 'va_1756000000_ab12', 'jacques') : null;
dire(!!r, 'la connexion produit bien un nouvel état');

if (r) {
  const titres = (r.epreuves || []).map(e => e.title);
  dire(r.epreuves.length === 1 && titres[0] === 'Mon vrai brouillon',
    'les épreuves du décor sont jetées, le vrai brouillon reste', titres.join(' | '));
  dire(r.epreuves[0].ownerId === 'va_1756000000_ab12',
    'et il est bien re-tamponné au nom du nouveau compte', r.epreuves[0].ownerId);
  dire((r.cours || []).length === 1 && r.cours[0].id === 'k1756000000000',
    'les cours du décor sont jetés, le vrai reste', (r.cours || []).map(c => c.id).join(' | '));
  dire(!(r.users || []).some(u => u.demo),
    'plus aucun profil de démonstration dans l’équipe',
    (r.users || []).map(u => u.name).join(' | '));
  dire((r.users || []).some(u => u.id === 'va_1756000000_ab12'),
    'le compte réel, lui, est présent');

  const moi = (r.users || []).find(u => u.id === 'va_1756000000_ab12') || {};
  dire(moi.quota && moi.quota.limit === 0 && moi.quota.used === 0,
    'aucun compteur hérité de « u1 » (pas de « 14 / 20 épreuves » inventés)',
    JSON.stringify(moi.quota));

  dire(Object.keys(r.proposals || {}).length === 0,
    'les propositions du décor disparaissent avec leur épreuve',
    JSON.stringify(r.proposals));
  dire((r.chatMsgs || []).length === 1 && r.chatMsgs[0].id === 'm1',
    'les messages du décor sont effacés — pastille de non-lus comprise',
    JSON.stringify((r.chatMsgs || []).map(m => m.text)));
  dire(r.msgsByConv && (r.msgsByConv.team || []).length === 1,
    'y compris dans les conversations');
  dire(r.team && r.team.name === '',
    'l’établissement de démonstration ne s’écrit plus dans le profil',
    r.team ? JSON.stringify(r.team.name) : 'team absent');
  dire(r.team && r.team.quota && r.team.quota.used === 0,
    'ni son compteur d’épreuves consommées');
  dire(r.activeId === null,
    'le composeur ne reste pas ouvert sur une épreuve jetée', String(r.activeId));
  dire(r.activeCoursId === null, 'idem pour les cours', String(r.activeCoursId));
}

/* ── ②ᵇ Les comptes DÉJÀ pollués ───────────────────────────────────────── */
console.log(`\n${G}②ᵇ Le décor déjà installé chez les inscrits d'avant${R}`);
/* Le drapeau `demo` n'existait pas quand ces états ont été enregistrés : le
   décor dort dans leur stockage local SANS marque. S'en remettre au seul
   drapeau laisserait ces comptes-là avec leurs trois épreuves fantômes pour
   toujours — c'est-à-dire précisément les comptes qui ont signalé le bug. */
const ancien = etatDemo();
ancien.epreuves = ancien.epreuves.map(e => { const c = Object.assign({}, e); delete c.demo; return c; });
ancien.cours = ancien.cours.map(c => { const d = Object.assign({}, c); delete d.demo; return d; });
ancien.users = ancien.users.map(u => { const v = Object.assign({}, u); delete v.demo; return v; });
const rAnc = corps ? adopter(ancien, 'va_deja_inscrit', 'jacques') : null;
if (rAnc) {
  dire((rAnc.epreuves || []).length === 1 && rAnc.epreuves[0].title === 'Mon vrai brouillon',
    'reconnu par son identifiant (e1/e2/e3) même sans drapeau',
    (rAnc.epreuves || []).map(e => e.id).join(' | '));
  dire((rAnc.cours || []).length === 1 && rAnc.cours[0].id === 'k1756000000000',
    'idem pour les cours (k1/k2)', (rAnc.cours || []).map(c => c.id).join(' | '));
  dire(!(rAnc.users || []).some(u => /^u\d$/.test(u.id)),
    'idem pour les profils (u1…u6)', (rAnc.users || []).map(u => u.id).join(' | '));
}

/* ── ③ La visite guidée garde son décor ────────────────────────────────── */
console.log(`\n${G}③ Avant toute inscription, le décor reste${R}`);

const rDemo = corps ? adopter(etatDemo(), 'u3', 'Mme Aïcha Bello') : null;
if (rDemo) {
  dire((rDemo.epreuves || []).length === 2,
    'changer de profil pendant la visite guidée ne détruit rien',
    'épreuves : ' + (rDemo.epreuves || []).length);
  dire((rDemo.users || []).some(u => u.demo),
    'les profils de démonstration restent disponibles');
  dire(rDemo.proposals === undefined && rDemo.team === undefined,
    'et l’état de démonstration n’est pas touché');
}

/* ── ④ Deux comptes réels sur le même poste ────────────────────────────── */
console.log(`\n${G}④ Un second enseignant ne s'approprie pas le travail du premier${R}`);
const etat2 = etatDemo();
etat2.currentUserId = 'va_premier';
etat2.epreuves = [{ id: 'e900', title: 'Travail du premier', ownerId: 'va_premier',
  editorIds: [], comments: [], activity: [] }];
etat2.users = [{ id: 'va_premier', name: 'Premier', role: 'Enseignant', quota: { limit: 5, used: 2 } }];
const r2 = corps ? adopter(etat2, 'va_second', 'Second') : null;
if (r2) {
  dire((r2.epreuves || [])[0] && r2.epreuves[0].ownerId === 'va_premier',
    'le travail du premier lui reste attribué',
    r2.epreuves[0] ? r2.epreuves[0].ownerId : 'aucune épreuve');
  dire((r2.users || []).some(u => u.id === 'va_premier'),
    'et son profil n’est pas effacé (il n’est pas du décor)');
}

/* ── ⑤ Le décor ne voyage pas dans l'équipe ────────────────────────────── */
console.log(`\n${G}⑤ Le décor ne revient pas par la synchronisation${R}`);
/* Jeter le décor à la connexion ne suffit pas : l'instantané partagé partait
   avec `st.epreuves` et `st.cours` EN ENTIER. Un collègue qui ne s'était pas
   encore reconnecté — donc pas encore purgé — poussait les trois épreuves de
   démonstration à toute l'équipe, et la fusion les RÉINSTALLAIT chez ceux qui
   venaient de les perdre. Le filtre existait pour les messages ; il manquait
   pour les épreuves et les cours. */
dire(/_sansDecor\(st\.epreuves,\/\^e\[1-3\]\$\/\)/.test(src),
  'l’instantané envoyé à l’équipe est débarrassé des épreuves du décor');
dire(/cours:this\._sansDecor\(st\.cours,\/\^k\[1-2\]\$\/\)/.test(src),
  'et des cours du décor');
dire(/this\._fusionner\(this\.state\.epreuves,this\._sansDecor\(c\.epreuves/.test(src),
  'et ce qui ARRIVE d’un coéquipier est filtré aussi — les deux versions vont cohabiter');
dire(/this\._fusionner\(this\.state\.cours,this\._sansDecor\(c\.cours/.test(src),
  'idem pour les cours reçus');

if (outils.every(Boolean)) {
  const o = new Function('return ({' + outils.join(',') + '});')();
  const lot = [
    { id: 'e1', title: 'décor' },
    { id: 'e2', title: 'décor' },
    { id: 'e1756000000000', title: 'vrai travail' },
    { id: 'e900', title: 'vrai travail aussi', demo: false },
    { id: 'e901', title: 'marqué démo', demo: true },
  ];
  const reste = o._sansDecor(lot, /^e[1-3]$/);
  dire(reste.length === 2 && reste.every(x => /vrai travail/.test(x.title)),
    'seul le travail réel survit au filtre', reste.map(x => x.id).join(', '));
  dire(o._sansDecor([], /^e[1-3]$/).length === 0, 'une liste vide reste vide');
  dire(o._sansDecor(null, /^e[1-3]$/).length === 0, 'une liste absente ne fait pas tomber la synchro');
}

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
