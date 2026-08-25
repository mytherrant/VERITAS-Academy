/* Contrôle des LIAISONS de l'Atelier de Français.
 *
 * La panne que ce fichier existe pour empêcher
 * --------------------------------------------
 * Le gabarit et la logique sont deux mondes séparés que rien ne relie
 * automatiquement : le gabarit écrit `onClick="{{ authSubmit }}"`, et
 * `renderVals()` doit fournir une clé `authSubmit`. Si elle manque, il ne se
 * passe RIEN. Pas d'erreur, pas de message, pas de trace dans la console :
 * le bouton est simplement mort.
 *
 * C'est arrivé en production le 21/08/2026. Le formulaire de connexion était
 * un décor — `authSubmit`, `setAuthMail`, `authKey`, `authBtn`, `authLabel`
 * et `essaiJours` n'existaient QUE dans le gabarit. Aucun jeton n'était
 * jamais posé, et `api/plateforme.php` répondait 401 à tout le monde. Rien
 * dans le code ne pouvait le signaler, et aucun test ne le couvrait.
 *
 * Ce contrôle relie les deux mondes : il relève toutes les liaisons
 * `{{ … }}` du gabarit, exécute `renderVals()` pour de vrai, et signale
 * celles qui ne trouvent personne en face. Il signale à part les
 * gestionnaires (`onClick`, `onChange`) qui ne sont pas des fonctions : une
 * liaison présente mais qui ne vaut pas une fonction est un bouton mort tout
 * autant qu'une liaison absente.
 *
 *   node tests/verif_liaisons_atelier.cjs
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.resolve(__dirname, '..');
const P = f => path.join(RACINE, f);
const html = fs.readFileSync(P('plateforme/index.html'), 'utf8');

/* ── 1. Les liaisons écrites dans le gabarit ───────────────────────────── */
const iScript = html.indexOf('<script type="text/x-dc"');
const gabarit = html.slice(0, iScript);

/* Variables de boucle : `<sc-for list="{{ x }}" as="f">` déclare `f`, et
   toutes les liaisons `{{ f.quelquechose }}` sont alors résolues par la
   boucle, pas par renderVals. Les ignorer évite des centaines de faux
   positifs. */
const boucles = new Set();
(gabarit.match(/\bas="([A-Za-z_$][\w$]*)"/g) || []).forEach(m => {
  boucles.add(m.split('"')[1]);
});

/* Relevé : le nom lié, et l'attribut qui le porte (pour distinguer un
   gestionnaire d'un simple affichage). */
const liaisons = new Map();          // nom -> Set(contextes)
const re = /(\w[\w-]*)?=?"?\{\{\s*([^}]+?)\s*\}\}/g;
let m;
while ((m = re.exec(gabarit)) !== null) {
  const attr = m[1] || '';
  let expr = m[2].trim();
  if (/^(true|false|null|\d)/.test(expr)) continue;      // littéraux des hints
  if (attr.indexOf('hint-') === 0) continue;
  const racine = expr.split('.')[0].trim();
  if (!/^[A-Za-z_$][\w$]*$/.test(racine)) continue;
  if (boucles.has(racine)) continue;
  if (!liaisons.has(racine)) liaisons.set(racine, new Set());
  /* On note le contexte SEULEMENT pour une liaison sans point : `{{ x }}`
     dans un onClick doit valoir une fonction, tandis que `{{ c.toggle }}`
     n a que `c` pour racine — un objet, tout a fait normal, dont c est le
     champ qui porte la fonction. Confondre les deux produisait un faux
     signalement a chaque boucle. */
  liaisons.get(racine).add(expr.indexOf('.') >= 0 ? '·champ' : attr);
}

/* ── 2. Exécuter renderVals() pour de vrai ─────────────────────────────── */
function contexte() {
  const stock = {};
  const elt = () => ({
    style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {} },
    setAttribute() {}, removeAttribute() {}, getAttribute: () => null,
    appendChild() {}, removeChild() {}, addEventListener() {}, removeEventListener() {},
    click() {}, focus() {}, remove() {}, scrollIntoView() {},
    querySelector: () => null, querySelectorAll: () => [],
    getBoundingClientRect: () => ({ top: 0, height: 0, width: 0 }),
    set innerHTML(v) {}, get innerHTML() { return ''; }
  });
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
    navigator: { userAgent: 'sonde', clipboard: { writeText: () => Promise.resolve() } },
    __VRT_API: '/api/', __VRT_TOKEN: 'SONDE'
  };
  win.document = { documentElement: elt(), head: elt(), body: elt(),
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
  /* Le moteur Design Canvas fournit React : `_icoRond` et `_icon` s'en
     servent pour bâtir les pictogrammes. Un substitut suffit — on ne juge
     pas le rendu, on veut seulement que renderVals() aille au bout. */
  ctx.React = {
    createElement: function (t, p) {
      return { type: t, props: p || {}, enfants: [].slice.call(arguments, 2) }; },
    cloneElement: function (e, p) {
      return { type: e && e.type, props: Object.assign({}, e && e.props, p || {}),
               enfants: (e && e.enfants) || [] }; },
    Fragment: 'Fragment', isValidElement: function (x) { return !!(x && x.type); } };
  vm.runInContext(
    'class DCLogic{constructor(p){this.props=p||{};this.state={};}' +
    'setState(x,a){const d=(typeof x==="function")?x(this.state):x;' +
    'this.state=Object.assign({},this.state,d||{});if(typeof a==="function")a();}}',
    ctx, { filename: 'dclogic.js' });
  ['texte', 'minesec', 'conformite', 'exercices', 'docx'].forEach(n =>
    vm.runInContext(fs.readFileSync(P('plateforme/' + n + '.js'), 'utf8'), ctx,
      { filename: n + '.js' }));
  return ctx;
}

const SOURCE = JSON.parse(fs.readFileSync(P('api/data/corpus_minesec.json'), 'utf8'));
const ctx = contexte();
vm.runInContext(html.slice(iScript).replace(/^[\s\S]*?>/, '').replace(/<\/script>[\s\S]*$/, ''),
  ctx, { filename: 'index.html#x-dc' });
/* Une base non vide : renderVals emprunte des chemins differents quand le
   repertoire est absent, et l'on veut voir TOUTES les cles. */
ctx.window.MINESEC_CORPUS = SOURCE.slice(0, 30).map(t => Object.assign({}, t,
  { _partiel: false, _libre: true }));
const C = vm.runInContext('Component', ctx);
const app = new C({});

/* On visite les ecrans : certaines cles ne sont produites que sur l'un
   d'eux, et une seule visite laisserait croire a des liaisons mortes. */
const ECRANS = ['accueil', 'liste', 'fiche', 'composeur', 'epreuves', 'cours',
  'collab', 'activite', 'profil', 'admin', 'abo', 'login'];
const fournies = new Set();
const typeDe = new Map();
let plantages = 0;
ECRANS.forEach(e => {
  try {
    app.state = Object.assign({}, app.state, { screen: e, ready: true, authed: true });
    const v = app.renderVals();
    Object.keys(v).forEach(k => { fournies.add(k); if (!typeDe.has(k)) typeDe.set(k, typeof v[k]); });
  } catch (err) {
    console.log('  [ KO ] renderVals() a levé sur l’écran « ' + e + " » : " + err.message);
    plantages++;
  }
});

/* ── 3. Verdict ────────────────────────────────────────────────────────── */
const GLOBALES = new Set(['true', 'false', 'null', 'undefined']);
const mortes = [], pasFonction = [];
liaisons.forEach((ctxs, nom) => {
  if (GLOBALES.has(nom)) return;
  if (!fournies.has(nom)) { mortes.push({ nom, ou: [...ctxs].join(',') }); return; }
  const gestionnaire = [...ctxs].some(a => /^on[A-Z]/.test(a));
  if (gestionnaire && typeDe.get(nom) !== 'function' && typeDe.get(nom) !== 'undefined')
    pasFonction.push({ nom, type: typeDe.get(nom) });
});

console.log('\n  LIAISONS GABARIT <-> LOGIQUE — Atelier de Français\n');
console.log('  ' + liaisons.size + ' liaisons relevées dans le gabarit');
console.log('  ' + fournies.size + ' clés fournies par renderVals() sur ' + ECRANS.length + ' écrans');
console.log('  ' + boucles.size + ' variables de boucle ignorées (' + [...boucles].join(', ') + ')\n');

if (mortes.length) {
  console.log('  [ KO ] ' + mortes.length + ' liaison(s) SANS personne en face :');
  mortes.forEach(x => console.log('         · {{ ' + x.nom + ' }}  (' + (x.ou || 'texte') + ')'));
} else {
  console.log('  [ OK ] toute liaison du gabarit trouve sa clé');
}
if (pasFonction.length) {
  console.log('  [ KO ] ' + pasFonction.length + ' gestionnaire(s) qui ne sont pas des fonctions :');
  pasFonction.forEach(x => console.log('         · ' + x.nom + ' vaut un ' + x.type));
} else {
  console.log('  [ OK ] tout gestionnaire lié vaut bien une fonction');
}
const soucis = mortes.length + pasFonction.length + plantages;
console.log(soucis ? '\n  ' + soucis + ' problème(s) de liaison\n' : '\n  Tout est relié\n');
process.exit(soucis ? 1 : 0);
