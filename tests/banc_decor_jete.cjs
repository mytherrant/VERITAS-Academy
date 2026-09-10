#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_decor_jete.cjs — LE DÉCOR DE DÉMONSTRATION NE PASSE PAS POUR
   L'ACTIVITÉ DE L'ENSEIGNANT.
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_decor_jete.cjs

   CE QU'IL PROTÈGE
   L'Atelier est livré avec un décor : six profils, trois épreuves, deux cours,
   des propositions et des messages. Il sert la visite guidée — montrer à quoi
   ressemble un Atelier rempli à quelqu'un qui vient de l'ouvrir.

   Mais ce décor ne s'affiche pas comme des exemples : il s'affiche comme des
   NOTIFICATIONS. « 15 » dans la barre, « Aïcha Bello propose une modification
   sur Texte 2 », « Devoir de lecture méthodique — 3ᵉ, en relecture, il y a
   19 j », dans une file intitulée « À TRAITER ». Présenté ainsi, il passe pour
   l'activité réelle de l'enseignant, qui cherche à répondre à des collègues
   qui n'existent pas.

   DEUX PIÈGES, et le second a survécu au premier correctif :

     1. `_adopterIdentite` jette le décor — mais il n'est appelé QU'UNE FOIS,
        à la connexion ou à la première ouverture d'un accès libre. Quiconque
        avait déjà ouvert l'Atelier le gardait pour toujours. Un nettoyage qui
        ne tourne qu'à la création ne nettoie personne : `_jeterDecor` tourne
        désormais à CHAQUE montage.

     2. `proposals`, `chatMsgs` et `msgsByConv` ne passent pas par `_persist()`.
        Le décor les repose donc à chaque chargement, APRÈS le nettoyage — d'où
        « 1 événement — ? propose une modification » chez un invité tout neuf :
        une notification sans auteur, sur une épreuve qui n'existe plus. La
        garde est au RENDU, et exige les deux bouts.

   CE QUI NE DOIT JAMAIS ARRIVER : que le nettoyage emporte le travail RÉEL.
   C'est le contrôle le plus important de ce banc.

   MÉTHODE — le vrai composant, exécuté depuis `plateforme/index.html` tel
   qu'il est déployé (même harnais que sonde_gouts_atelier.cjs). Rien n'est
   réécrit ni simulé.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const P = f => path.resolve(__dirname, '..', f);
const html = fs.readFileSync(P('plateforme/index.html'), 'utf8');
const iScript = (() => {
  const re = /<script\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (/\bsrc\s*=/.test(m[1] || '')) continue;
    const fin = html.indexOf('</script>', m.index);
    if (fin - m.index > 100000) return m.index;   // le gros bloc applicatif
  }
  return -1;
})();
if (iScript < 0) { console.log('  bloc applicatif introuvable'); process.exit(1); }

function elt() {
  const e = { style: {}, dataset: {}, children: [], classList: { add() {}, remove() {}, toggle() {} },
    setAttribute() {}, getAttribute: () => null, removeAttribute() {}, appendChild() {},
    removeChild() {}, addEventListener() {}, removeEventListener() {}, focus() {},
    click() {}, select() {}, remove() {}, querySelector: () => null, querySelectorAll: () => [],
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 0, height: 0 }) };
  return e;
}

function atelier() {
  const stock = {};
  const win = {
    MINESEC_CORPUS: null,
    localStorage: { getItem: k => (k in stock ? stock[k] : null),
      setItem: (k, v) => { stock[k] = String(v); }, removeItem: k => { delete stock[k]; } },
    matchMedia: () => ({ matches: false, addListener() {}, removeListener() {} }),
    addEventListener() {}, removeEventListener() {}, scrollTo() {},
    setTimeout, clearTimeout, setInterval, clearInterval,
    requestAnimationFrame: fn => setTimeout(fn, 0),
    location: { protocol: 'http:', hostname: 'localhost', hash: '', href: 'http://localhost/' },
    history: { pushState() {}, replaceState() {}, back() {} },
    navigator: { userAgent: 'banc', clipboard: { writeText: () => Promise.resolve() } },
    __VRT_API: '/api/', __VRT_TOKEN: ''
  };
  win.document = { documentElement: elt(), head: elt(), body: elt(), hidden: false,
    createElement: () => elt(), createTextNode: () => elt(),
    getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    addEventListener() {}, removeEventListener() {} };
  win.window = win; win.self = win;
  const ctx = vm.createContext(win);
  ctx.console = { log() {}, warn() {}, error() {} };
  ctx.fetch = () => new Promise(() => {});
  ctx.TextDecoder = require('util').TextDecoder;
  ctx.AbortController = typeof AbortController !== 'undefined' ? AbortController : undefined;
  ctx.Blob = function () {}; ctx.URL = { createObjectURL: () => 'blob:', revokeObjectURL() {} };
  ctx.crypto = { getRandomValues: a => { for (let i = 0; i < a.length; i++) a[i] = (i * 7 + 3) % 256; return a; } };
  ctx.React = { createElement: (t, p) => ({ type: t, props: p || {} }),
    cloneElement: (e, p) => ({ type: e && e.type, props: Object.assign({}, e && e.props, p) }),
    Fragment: 'F', isValidElement: x => !!(x && x.type) };
  vm.runInContext(
    'class DCLogic{constructor(p){this.props=p||{};this.state={};}' +
    'setState(x,a){const d=(typeof x==="function")?x(this.state):x;' +
    'this.state=Object.assign({},this.state,d||{});if(typeof a==="function")a();}}',
    ctx, { filename: 'dclogic.js' });
  ['texte', 'minesec', 'conformite', 'exercices', 'docx'].forEach(n =>
    vm.runInContext(fs.readFileSync(P('plateforme/' + n + '.js'), 'utf8'), ctx, { filename: n + '.js' }));
  vm.runInContext(html.slice(iScript).replace(/^[\s\S]*?>/, '').replace(/<\/script>[\s\S]*$/, ''),
    ctx, { filename: 'index.html#x-dc' });
  const C = vm.runInContext('Component', ctx);
  const a = new C({});
  a.__stock = stock;
  return a;
}

/* Un état de poste ORDINAIRE : le décor livré avec l'application, plus le
   travail réel de l'enseignant. C'est le mélange qui compte — un nettoyage qui
   emporte le second est bien pire que le défaut qu'il corrige. */
function etatMele(identite) {
  return {
    currentUserId: identite,
    users: [
      { id: 'u1', name: 'Mme Nadège Fotso', role: 'Enseignant', quota: { limit: 20, used: 6 }, demo: true },
      { id: 'u2', name: 'Aïcha Bello', role: 'Relecteur', quota: { limit: 20, used: 2 }, demo: true },
      { id: identite, name: 'Moi', role: 'Enseignant', quota: { limit: 0, used: 0 } },
    ],
    epreuves: [
      { id: 'e1', title: 'Contrôle — séquence narrative', status: 'brouillon', ownerId: 'u1',
        editorIds: [], textIds: [], comments: [], activity: [], demo: true },
      { id: 'e2', title: 'Devoir de lecture méthodique — 3ᵉ', status: 'relecture', ownerId: 'u1',
        editorIds: [], textIds: [], comments: [], activity: [], demo: true },
      { id: 'e1757000000000', title: 'Mon vrai travail', status: 'brouillon', ownerId: identite,
        editorIds: [], textIds: [], comments: [], activity: [] },
    ],
    cours: [
      { id: 'k1', title: 'Le groupe nominal', ownerId: 'u1', editorIds: [], history: [], demo: true },
      { id: 'k1757000000001', title: 'Ma vraie leçon', ownerId: identite, editorIds: [], history: [] },
    ],
    /* Rangées PAR ÉPREUVE : `e2` est du décor, `e1757…` est réel. */
    proposals: {
      e2: [{ id: 'p1', userId: 'u2', target: 'Texte 2 · Question II.2', status: 'pending' }],
      e1757000000000: [{ id: 'p2', userId: identite, target: 'Texte 1 · Question I.1', status: 'pending' }],
    },
    chatMsgs: [{ userId: 'u2', text: 'Bonjour', ts: Date.now() },           // décor : pas d'id
      { id: 'm1', userId: identite, text: 'Note à moi-même', ts: Date.now() }],
    msgsByConv: { c1: [{ userId: 'u1', text: 'Exemple', ts: Date.now() },
      { id: 'm2', userId: identite, text: 'Vrai message', ts: Date.now() }] },
    team: { name: 'Lycée Bilingue de Yaoundé', plan: 'Collège', quota: { limit: 30, used: 14 } },
    activeId: 'e2', activeCoursId: 'k1',
  };
}

let ok = 0, ko = 0;
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
const dire = (b, m, d) => {
  b ? ok++ : ko++;
  console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : ''));
};

console.log(`\n${G}LE DÉCOR NE PASSE PAS POUR L'ACTIVITÉ DE L'ENSEIGNANT${R}\n`);

/* ── ① La visite guidée garde son décor ──────────────────────────────── */
console.log(`${G}① Avant toute identité, le décor a le droit d'être là${R}`);
{
  const a = atelier();
  a.state = Object.assign({}, a.state, etatMele('u1'));
  a.state.currentUserId = 'u1';
  a._jeterDecor();
  dire(a.state.epreuves.length === 3 && a.state.users.length === 3,
    'sous un profil de démonstration (u1), RIEN n’est jeté — c’est la visite guidée',
    a.state.epreuves.length + ' épreuves, ' + a.state.users.length + ' profils');
}

/* ── ② Une identité réelle jette le décor ────────────────────────────── */
for (const [quoi, id] of [['invité', 'inv_6aa2827d_47207ccf'], ['titulaire', 'va_1757000000_ab12cd']]) {
  console.log(`\n${G}② Sous une identité réelle (${quoi})${R}`);
  const a = atelier();
  a.state = Object.assign({}, a.state, etatMele(id));
  a._jeterDecor();
  const s = a.state;

  dire(!s.users.some(u => u.demo || /^u[1-9]$/.test(u.id)),
    'les profils d’exemple sont partis', JSON.stringify(s.users.map(u => u.name)));
  dire(!s.epreuves.some(e => e.demo || /^e[1-3]$/.test(e.id)),
    'les épreuves du décor aussi', JSON.stringify(s.epreuves.map(e => e.title)));
  dire(!s.cours.some(c => c.demo || /^k[1-2]$/.test(c.id)),
    'les cours du décor aussi', JSON.stringify(s.cours.map(c => c.title)));

  /* LE CONTRÔLE QUI COMPTE LE PLUS. */
  dire(s.epreuves.length === 1 && s.epreuves[0].title === 'Mon vrai travail',
    '✦ le travail RÉEL de l’enseignant est conservé',
    JSON.stringify(s.epreuves.map(e => e.title)));
  dire(s.cours.length === 1 && s.cours[0].title === 'Ma vraie leçon',
    '✦ sa leçon aussi', JSON.stringify(s.cours.map(c => c.title)));
  dire(s.users.length === 1 && s.users[0].id === id,
    'et son propre profil reste', JSON.stringify(s.users.map(u => u.id)));

  dire(!s.proposals.e2 && !!s.proposals.e1757000000000,
    'la proposition qui visait une épreuve du décor part ; la sienne reste',
    JSON.stringify(Object.keys(s.proposals)));
  dire(s.chatMsgs.length === 1 && s.chatMsgs[0].id === 'm1',
    'les messages d’exemple (sans identifiant) partent, les vrais restent',
    JSON.stringify(s.chatMsgs.map(m => m.text)));
  dire(s.msgsByConv.c1.length === 1 && s.msgsByConv.c1[0].id === 'm2',
    'idem dans les conversations', JSON.stringify(s.msgsByConv.c1.map(m => m.text)));
  dire(s.team.name === '' && s.team.quota.used === 0,
    'l’établissement de démonstration ne s’affiche plus dans le profil',
    JSON.stringify(s.team));
  dire(s.activeId === null && s.activeCoursId === null,
    'l’épreuve « active » jetée ne laisse pas le composeur sur un fantôme',
    JSON.stringify({ ep: s.activeId, co: s.activeCoursId }));
}

/* ── ②bis LE BRANCHEMENT : la fonction doit etre APPELEE au montage ──── */
console.log(`
${G}②bis Le nettoyage est-il seulement branché ?${R}`);
{
  /* ⚠️ Les controles ci-dessus appellent `_jeterDecor()` a la main : ils
     mesurent la fonction, pas son APPEL. Retirer la ligne de
     `componentDidMount` les laissait tous verts pendant que plus personne
     n'etait nettoye — c'est-a-dire exactement le defaut d'origine.
     Mesure par mutation le 10/09/2026. On monte donc pour de vrai. */
  const a = atelier();
  const id = 'inv_6aa2827d_47207ccf';
  a.state = Object.assign({}, a.state, etatMele(id), { ready: true });
  try { a.componentDidMount(); } catch (e) {}
  dire(!a.state.epreuves.some(e => e.demo || /^e[1-3]$/.test(e.id)),
    '✦ componentDidMount jette le décor — sans cet appel, la fonction ne sert à personne',
    JSON.stringify(a.state.epreuves.map(e => e.title)));
  dire(a.state.epreuves.some(e => e.title === 'Mon vrai travail'),
    'et le travail réel a survécu au montage complet');
  try { if (a.componentWillUnmount) a.componentWillUnmount(); } catch (e) {}
}

/* ── ③ Idempotence : sur un Atelier déjà propre, aucun rendu ─────────── */
console.log(`\n${G}③ Sur un Atelier déjà propre${R}`);
{
  const a = atelier();
  const id = 'inv_6aa2827d_47207ccf';
  a.state = Object.assign({}, a.state, etatMele(id));
  a._jeterDecor();
  let rendus = 0;
  const vrai = a.setState.bind(a);
  a.setState = (x, cb) => { rendus++; return vrai(x, cb); };
  a._jeterDecor();
  dire(rendus === 0,
    'un second passage ne déclenche AUCUN rendu — c’est un simple comptage',
    rendus + ' rendu(s)');
}

/* ── ④ La garde de rendu, pour ce que le nettoyage ne peut pas tenir ── */
console.log(`\n${G}④ Une proposition orpheline ne s'affiche pas${R}`);
{
  /* `proposals` n'est pas persisté : le décor le repose au chargement suivant,
     après le nettoyage. Le rendu doit donc s'en défendre tout seul. */
  const a = atelier();
  const id = 'inv_6aa2827d_47207ccf';
  a.state = Object.assign({}, a.state, etatMele(id));
  a._jeterDecor();
  /* ⚠️ DEUX GARDES, DONC DEUX CAS. Avec une seule proposition à qui
     manquaient À LA FOIS l'épreuve et l'auteur, chaque garde suffisait à
     l'écarter : neutraliser l'une laissait l'autre faire le travail, et le
     banc restait vert. Mesure par mutation le 10/09/2026. */
  a.state.proposals = {
    e2: [{ id: 'p1', userId: id, target: 'Épreuve absente · Q1', status: 'pending' }],
    e1757000000000: [
      { id: 'p2', userId: id, target: 'Texte 1 · Question I.1', status: 'pending' },
      { id: 'p3', userId: 'u2', target: 'Auteur absent · Q2', status: 'pending' },
    ],
  };
  const vals = a.renderVals();
  const traiter = (vals.actGroupes || []).filter(g => g.titre === 'À traiter');
  const lignes = traiter.length ? traiter[0].items.length : 0;
  dire(lignes === 1,
    'sur trois propositions, seule celle dont l’épreuve ET l’auteur existent est rendue',
    lignes + ' ligne(s) dans « À traiter »');
  const txt = JSON.stringify(vals.actGroupes || []);
  dire(txt.indexOf('Épreuve absente') < 0,
    'celle dont l’ÉPREUVE a disparu est écartée (son auteur, lui, existe)');
  dire(txt.indexOf('Auteur absent') < 0,
    'celle dont l’AUTEUR a disparu aussi — plus de « ? propose une modification »');
}

console.log('\n' + G + (ko ? X + ' ' + ko + ' contrôle(s) en échec' : V + ' tout est vert')
  + ' — ' + ok + '/' + (ok + ko) + R + '\n');
process.exit(ko ? 1 : 0);
