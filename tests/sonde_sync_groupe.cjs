/* Sonde de SYNCHRONISATION DU GROUPE — Atelier de Français.
 *
 * Ce qu'elle mesure, et pourquoi le débit passe avant le reste
 * ------------------------------------------------------------
 * `api/plateforme.php?action=etat` partage les épreuves, les cours et les
 * annotations entre les membres d'un groupe. Il existait depuis le début et
 * n'avait aucun appelant : tout le travail « collectif » vivait dans un seul
 * navigateur.
 *
 * En le branchant, on introduit le risque le plus cher de ce projet : LWS
 * bannit l'IP à six mauvaises requêtes par minute, et une file d'envoi trop
 * bavarde a déjà fermé le site entier. `_persist()` est appelé à chaque
 * frappe ; un envoi par appel serait une rafale garantie.
 *
 * Cette sonde vérifie donc D'ABORD le débit, puis la justesse :
 *
 *   1. vingt mutations d'affilée ne produisent pas vingt requêtes ;
 *   2. le travail d'un collègue redescend et FUSIONNE, sans écraser le sien ;
 *   3. une panne réseau ne perd rien et ne déclenche aucune reprise en rafale.
 *
 *   node tests/sonde_sync_groupe.cjs
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.resolve(__dirname, '..');
const P = f => path.join(RACINE, f);
const html = fs.readFileSync(P('plateforme/index.html'), 'utf8');
const iScript = html.indexOf('<script type="text/x-dc"');

function contexte(repondre, journal) {
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
    __VRT_API: '/api/', __VRT_TOKEN: 'JETON-SONDE'
  };
  win.document = { documentElement: elt(), head: elt(), body: elt(), hidden: false,
    createElement: () => elt(), createTextNode: () => elt(),
    getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    addEventListener() {}, removeEventListener() {} };
  win.window = win; win.self = win;
  const ctx = vm.createContext(win);
  ctx.console = { log() {}, warn() {}, error() {} };
  ctx.TextDecoder = require('util').TextDecoder;
  ctx.AbortController = typeof AbortController !== 'undefined' ? AbortController : undefined;
  ctx.Blob = function () {}; ctx.URL = { createObjectURL: () => 'blob:', revokeObjectURL() {} };
  ctx.React = { createElement: (t, p) => ({ type: t, props: p || {} }),
    cloneElement: (e, p) => ({ type: e && e.type, props: Object.assign({}, e && e.props, p) }),
    Fragment: 'F', isValidElement: x => !!(x && x.type) };
  ctx.fetch = (url, o) => {
    journal.push({ url: String(url), methode: (o && o.method) || 'GET', t: Date.now() });
    const r = repondre(String(url), o);
    if (!r) return new Promise(() => {});
    if (r.rejet) return Promise.reject(r.rejet);
    return Promise.resolve({ ok: r.status ? r.status < 300 : true, status: r.status || 200,
      json: () => Promise.resolve(r.corps), body: null });
  };
  vm.runInContext(
    'class DCLogic{constructor(p){this.props=p||{};this.state={};}' +
    'setState(x,a){const d=(typeof x==="function")?x(this.state):x;' +
    'this.state=Object.assign({},this.state,d||{});if(typeof a==="function")a();}}',
    ctx, { filename: 'dclogic.js' });
  ['texte', 'minesec', 'conformite', 'exercices', 'docx'].forEach(n =>
    vm.runInContext(fs.readFileSync(P('plateforme/' + n + '.js'), 'utf8'), ctx, { filename: n + '.js' }));
  vm.runInContext(html.slice(iScript).replace(/^[\s\S]*?>/, '').replace(/<\/script>[\s\S]*$/, ''),
    ctx, { filename: 'index.html#x-dc' });
  return ctx;
}

function atelier(repondre) {
  const journal = [];
  const ctx = contexte(repondre, journal);
  ctx.window.MINESEC_CORPUS = [{ n: 1, words: 10, text: 'un texte', type: 'NARRATIF',
    cycle: 'PREMIER CYCLE', group: 'Module 1', _partiel: false, _libre: true }];
  const C = vm.runInContext('Component', ctx);
  const a = new C({});
  a.__journal = journal;
  return a;
}

const resultats = [];
const attendre = ms => new Promise(r => setTimeout(r, ms));
function juger(nom, ok, vu) {
  resultats.push({ nom, ok, vu });
  console.log('  ' + (ok ? '[ OK ]' : '[ KO ]') + ' ' + nom + '\n         → ' + vu);
}

(async () => {
  console.log('\n  SONDE DE SYNCHRONISATION DU GROUPE — Atelier de Français\n');

  /* --- 1. LE DÉBIT. Vingt mutations ne font pas vingt requêtes. --------- */
  {
    const a = atelier(() => ({ status: 200, corps: { ok: true, revision: 1 } }));
    for (let i = 0; i < 20; i++) { a.state.epreuves = [{ id: 'e1', updatedAt: Date.now() + i }]; a._persist(); }
    await attendre(6000);
    const envois = a.__journal.filter(x => /action=etat/.test(x.url) && x.methode === 'POST').length;
    juger('Vingt mutations d’affilée ne produisent qu’un envoi',
      envois <= 1, envois + ' envoi(s) pour 20 mutations');
  }

  /* --- 2. LA FUSION. Le travail du collègue arrive sans écraser le sien - */
  {
    const mien = { id: 'A', title: 'la mienne', updatedAt: 5000 };
    const sien = { id: 'B', title: 'la sienne', updatedAt: 9000 };
    const a = atelier(u => /action=etat/.test(u)
      ? { status: 200, corps: { ok: true, revision: 7,
          etat: { revision: 7, contenu: { epreuves: [sien], cours: [], annot: {} } } } }
      : { status: 200, corps: { ok: true } });
    a.state.epreuves = [mien];
    a._syncTirer();
    await attendre(120);
    const ids = (a.state.epreuves || []).map(e => e.id).sort().join(',');
    juger('Le travail d’un collègue arrive sans effacer le sien',
      ids === 'A,B', 'épreuves après fusion : ' + (ids || '(aucune)'));
  }

  /* --- 3. Le plus récent l'emporte, objet par objet --------------------- */
  {
    const vieux = { id: 'A', title: 'ancienne', updatedAt: 1000 };
    const neuf = { id: 'A', title: 'récente', updatedAt: 9000 };
    const a = atelier(u => /action=etat/.test(u)
      ? { status: 200, corps: { ok: true, revision: 3,
          etat: { revision: 3, contenu: { epreuves: [neuf], cours: [], annot: {} } } } }
      : { status: 200, corps: { ok: true } });
    a.state.epreuves = [vieux];
    a._syncTirer();
    await attendre(120);
    const t = ((a.state.epreuves || [])[0] || {}).title;
    juger('Sur un même objet, la version la plus récente l’emporte',
      t === 'récente', 'titre retenu : ' + t);
  }

  /* --- 4. Une panne ne perd rien et ne déclenche pas de rafale ---------- */
  {
    const a = atelier(() => ({ status: 500, corps: { ok: false } }));
    a.state.epreuves = [{ id: 'e1', title: 'mon travail', updatedAt: 1 }];
    a._persist();
    await attendre(6000);
    const envois = a.__journal.filter(x => /action=etat/.test(x.url) && x.methode === 'POST').length;
    const garde = ((a.state.epreuves || [])[0] || {}).title === 'mon travail';
    juger('Une panne d’envoi ne perd rien et ne déclenche aucune reprise',
      garde && envois <= 1,
      (garde ? 'travail conservé' : 'TRAVAIL PERDU') + ', ' + envois + ' tentative(s)');
  }

  /* --- 5. Sans compte, on n'appelle pas le serveur ---------------------- */
  {
    const a = atelier(() => ({ status: 200, corps: { ok: true } }));
    a._poserJeton('');
    a.state.epreuves = [{ id: 'e1', updatedAt: 1 }];
    a._persist();
    a._syncTirer();
    await attendre(5500);
    const n = a.__journal.filter(x => /action=etat/.test(x.url)).length;
    juger('Sans jeton, aucune requête de synchronisation ne part',
      n === 0, n + ' requête(s) — chacune retomberait en 401');
  }

  const ok = resultats.filter(r => r.ok).length;
  console.log('\n  ' + ok + '/' + resultats.length + ' contrôles passés\n');
  process.exit(ok === resultats.length ? 0 : 1);
})();
