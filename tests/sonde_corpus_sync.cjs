/* Sonde de SYNCHRONISATION DU CORPUS — Atelier de Français (plateforme/).
 *
 * Ce que cette sonde mesure, et pourquoi elle existe
 * --------------------------------------------------
 * Le répertoire descend en DEUX temps. D'abord un index : pour chaque texte,
 * ses métadonnées (dont `words`, le nombre de mots RÉEL) et une amorce de
 * 180 caractères. Ensuite, à l'ouverture d'une fiche ou à l'ajout d'un texte
 * dans une épreuve, une seconde requête va chercher le texte intégral.
 *
 * Ces deux transferts peuvent diverger — et c'est là qu'est la panne. Quand
 * la seconde échoue, l'index reste en place avec ses métadonnées justes,
 * pendant que le contenu, lui, n'est qu'une amorce. La métadonnée dit
 * « 320 mots » et le contenu en porte trente. Tout ce qui lit l'un sans
 * l'autre ment alors sans le savoir :
 *
 *   - le compteur de l'épreuve additionne `f.words` (320) ;
 *   - le garde-fou de conformité juge sur `f.words` (conformite.js:125) ;
 *   - l'export Word écrit `mots:f.words` AU-DESSUS de `texte:f.text`.
 *
 * L'enseignant imprime donc une épreuve dont l'en-tête annonce un texte que
 * la page ne contient pas. C'est ce que l'on appelle ici la
 * « désynchronisation du corpus ».
 *
 * Méthode
 * -------
 * On n'ouvre pas de navigateur : on extrait la classe `Component` du bloc
 * <script type="text/x-dc"> de index.html et on l'exécute dans un contexte
 * `vm` avec un faux `window`, un faux `fetch` et les vrais modules
 * (texte.js, minesec.js, conformite.js, docx.js). Les fonctions mesurées
 * sont donc EXACTEMENT celles qui partent en production, pas une copie.
 *
 * Chaque contrôle est écrit pour ÉCHOUER sur le code d'avant : une sonde
 * qui n'a jamais rougi ne prouve rien (cf. la leçon du test par mutation).
 *
 *   node tests/sonde_corpus_sync.cjs
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.resolve(__dirname, '..');
const P = f => path.join(RACINE, f);

/* ── 1. Extraction de la classe ────────────────────────────────────────── */
function sourceComponent() {
  const html = fs.readFileSync(P('plateforme/index.html'), 'utf8');
  const m = html.match(/<script[^>]*type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/i);
  if (!m) throw new Error('bloc <script type="text/x-dc"> introuvable');
  return m[1];
}

/* ── 2. Un contexte qui ressemble assez à un navigateur ────────────────── */
function contexte() {
  const stockage = {};
  const win = {
    MINESEC_CORPUS: null,
    localStorage: {
      getItem: k => (k in stockage ? stockage[k] : null),
      setItem: (k, v) => { stockage[k] = String(v); },
      removeItem: k => { delete stockage[k]; }
    },
    matchMedia: () => ({ matches: false, addListener() {}, removeListener() {} }),
    addEventListener() {}, removeEventListener() {},
    scrollTo() {}, setTimeout, clearTimeout, setInterval, clearInterval,
    location: { protocol: 'http:', hostname: 'localhost', hash: '', href: 'http://localhost/' },
    history: { pushState() {}, replaceState() {}, back() {} },
    navigator: { userAgent: 'sonde', clipboard: { writeText: () => Promise.resolve() } },
    document: null,
    __VRT_API: '/api/',
    __VRT_TOKEN: 'SONDE'
  };
  const elt = () => ({
    style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {} },
    setAttribute() {}, removeAttribute() {}, getAttribute: () => null,
    appendChild() {}, removeChild() {}, addEventListener() {}, removeEventListener() {},
    click() {}, focus() {}, remove() {}, querySelector: () => null,
    querySelectorAll: () => [], set innerHTML(v) {}, get innerHTML() { return ''; }
  });
  const doc = {
    documentElement: elt(), head: elt(), body: elt(),
    createElement: () => elt(), createTextNode: () => elt(),
    getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    addEventListener() {}, removeEventListener() {}
  };
  win.document = doc;
  win.window = win;
  win.self = win;

  const ctx = vm.createContext(win);
  ctx.console = console;
  ctx.fetch = () => Promise.reject(new Error('fetch non armé'));
  ctx.AbortController = typeof AbortController !== 'undefined' ? AbortController : undefined;
  ctx.TextDecoder = require('util').TextDecoder;
  ctx.Blob = function () {}; ctx.URL = { createObjectURL: () => 'blob:', revokeObjectURL() {} };

  /* Les vrais modules — surtout pas des imitations : la sonde doit mesurer
     le même formatage de dialogue et le même garde-fou que la production. */
  ['support-stub', 'texte', 'minesec', 'conformite', 'exercices', 'docx'].forEach(n => {
    if (n === 'support-stub') {
      /* DCLogic : la classe de base du moteur Design Canvas. On n'a besoin
         que de `state` + `setState`, avec le rappel — c'est justement le
         rappel dont dépend `_completerTexte`. */
      vm.runInContext(`
        class DCLogic {
          constructor(props){ this.props = props || {}; this.state = {}; }
          setState(x, apres){
            const p = (typeof x === 'function') ? x(this.state) : x;
            this.state = Object.assign({}, this.state, p || {});
            if (typeof apres === 'function') apres();
          }
        }
      `, ctx, { filename: 'dclogic.js' });
      return;
    }
    vm.runInContext(fs.readFileSync(P('plateforme/' + n + '.js'), 'utf8'),
      ctx, { filename: n + '.js' });
  });
  return ctx;
}

/* ── 3. Un index, comme api/plateforme.php le fabrique ─────────────────── */
/* REPLI DE CI. `api/data/` est entièrement gitignoré — le corpus est la
   marchandise et ce dépôt est public — si bien qu'une machine de CI ne le
   voit jamais. Sans ce repli, cette sonde ne pouvait tourner que sur le
   poste de celui qui pensait à la lancer, et l'Atelier n'était gardé nulle
   part. Le repli est ANNONCÉ : une sonde qui se rabat en silence ferait
   croire qu'on mesure le vrai répertoire. */
function corpusOuRepli(chemin) {
  if (fs.existsSync(chemin)) return JSON.parse(fs.readFileSync(chemin, 'utf8'));
  console.log('  (!) corpus_minesec.json absent — corpus SYNTHÉTIQUE. La mécanique\n'
            + '      est vérifiée, les comptages réels ne le sont pas.');
  const mot = 'lorem';
  return Array.from({ length: 60 }, (_, i) => {
    const n = 120 + (i % 8) * 40;
    return { n: i + 1, type: 'NARRATIF', words: n, level: '3e',
      cycle: 'PREMIER CYCLE', group: 'Module 1 — La vie quotidienne',
      groupKind: 'Module', groupNum: 1, subkind: 'corpus',
      usage: 'corpus de leçon', text: (mot + ' ').repeat(n).trim(),
      reference: 'Auteur ' + i + ', Titre ' + i,
      author: 'Auteur ' + i, title: 'Titre ' + i,
      faits: 'le passé simple', comprehension: '1) Question ?', exploitation: '1) Question ?' };
  });
}
const SOURCE = corpusOuRepli(P('api/data/corpus_minesec.json'));
function index(n, libre) {
  const t = SOURCE.find(x => (x.n | 0) === n);
  return {
    n: t.n | 0, type: t.type || '', words: t.words | 0, level: t.level || '',
    cycle: t.cycle || '', group: t.group || '', groupKind: t.groupKind || '',
    subkind: t.subkind || '', usage: t.usage || '', author: t.author || '',
    title: t.title || '', reference: t.reference || '',
    faits: libre ? (t.faits || '') : '',
    libre: libre !== false,
    extrait: String(t.text || '').slice(0, 180)
  };
}

/* Monte un Atelier prêt à l'emploi, avec un `fetch` que le contrôle pilote. */
function atelier(nums, opts) {
  opts = opts || {};
  const ctx = contexte();
  ctx.MINESEC_CORPUS = null;
  const journal = [];
  ctx.fetch = (url, o) => {
    journal.push(String(url));
    const rep = opts.repondre ? opts.repondre(String(url), o) : null;
    if (!rep) return new Promise(() => {});           // muet : jamais de réponse
    if (rep.rejet) return Promise.reject(rep.rejet);
    return Promise.resolve({
      ok: rep.status ? rep.status >= 200 && rep.status < 300 : true,
      status: rep.status || 200,
      json: () => Promise.resolve(rep.corps),
      body: null
    });
  };
  vm.runInContext(sourceComponent(), ctx, { filename: 'index.html#x-dc' });
  /* On pose la base comme le fait le chargeur de l'index : `_partiel` sur
     tout, `text` réduit à l'amorce. C'est l'état exact d'où part la panne. */
  ctx.window.MINESEC_CORPUS = nums.map(n => {
    const i = index(n.n !== undefined ? n.n : n, n.libre);
    return Object.assign({}, i, { text: i.extrait || '', _partiel: true, _libre: i.libre !== false });
  });
  const C = vm.runInContext('Component', ctx);
  const a = new C({});
  a.__journal = journal;
  a.__ctx = ctx;
  return a;
}

/* ── 4. Contrôles ──────────────────────────────────────────────────────── */
const resultats = [];
/* Délai de garde. Un contrôle qui PEND est lui-même un résultat — c'est le
   symptôme d'un rappel qui n'est jamais appelé — mais une sonde qui pend ne
   rend aucun rapport et ne peut pas servir de garde-fou. On borne donc
   chaque contrôle et on écrit ce qui s'est passé. */
function controle(nom, fn) {
  let fini = false;
  const garde = new Promise(r => setTimeout(() => r({
    ok: false, dit: 'BLOQUÉ : aucun rappel en 3 s (l’appelant attendrait pour toujours)'
  }), 3000));
  return Promise.race([Promise.resolve().then(fn), garde]).then(
    r => { if (!fini) { fini = true; resultats.push({ nom, ok: r.ok, dit: r.dit }); } },
    e => { if (!fini) { fini = true; resultats.push({ nom, ok: false, dit: 'exception : ' + (e && e.message || e) }); } }
  );
}
const attendre = ms => new Promise(r => setTimeout(r, ms));

/* Un texte long, pour que l'écart amorce/intégral soit indiscutable. */
const LONG = SOURCE.filter(t => (t.words | 0) > 250).slice(0, 3).map(t => t.n | 0);
if (LONG.length < 2) throw new Error('corpus_minesec.json : pas assez de textes longs');
const N1 = LONG[0], N2 = LONG[1];
const integral = n => String((SOURCE.find(x => (x.n | 0) === n) || {}).text || '');

const suite = [];

/* --- 1. L'échec de complétion doit se voir ---------------------------- */
suite.push(() => controle(
  'Complétion refusée (500) : le texte est marqué non synchronisé',
  async () => {
    const a = atelier([N1], { repondre: () => ({ status: 500, corps: { ok: false, error: 'Panne' } }) });
    await new Promise(r => a._completerTexte(N1, r));
    await attendre(30);
    const f = a.all.find(x => x.n === N1);
    /* La marque porte un MOTIF (« reseau », « abonnement », « forme »…) :
       une raison se lit, un booléen se devine. */
    const marque = f && f._syncKo;
    return {
      ok: !!marque,
      dit: marque ? 'texte marqué non synchronisé (motif : ' + marque + ')'
        : 'AUCUNE marque : le texte reste partiel en silence (text=' +
          (f ? (f.text || '').length : '?') + ' car. pour words=' + (f ? f.words : '?') + ')'
    };
  }));

/* --- 2. Le rappel doit TOUJOURS revenir ------------------------------- */
suite.push(() => controle(
  'Réponse 200 de forme inattendue : le rappel revient quand même',
  async () => {
    const a = atelier([N1], { repondre: () => ({ status: 200, corps: { ok: true } }) });
    let revenu = false;
    a._completerTexte(N1, () => { revenu = true; });
    await attendre(60);
    return { ok: revenu, dit: revenu ? 'rappel appelé' : 'rappel JAMAIS appelé — l’appelant attend pour toujours' };
  }));

/* --- 3. La clé `citation` du serveur doit être lue -------------------- */
suite.push(() => controle(
  'Le serveur répond sous la clé « citation » : elle est lue',
  async () => {
    const a = atelier([N1], {
      repondre: () => ({ status: 200, corps: { ok: true, citation: { n: N1, text: integral(N1) } } })
    });
    await new Promise(r => a._completerTexte(N1, r));
    await attendre(30);
    const f = a.all.find(x => x.n === N1);
    const complet = f && !f._partiel && (f.text || '').length > 300;
    return { ok: !!complet, dit: complet ? 'clé « citation » reconnue' : 'clé « citation » ignorée — le texte reste partiel' };
  }));

/* --- 4. Pas de requête en double -------------------------------------- */
suite.push(() => controle(
  'Deux demandes simultanées ne font qu’une requête',
  async () => {
    const a = atelier([N1], {
      repondre: () => ({ status: 200, corps: { ok: true, texte: { n: N1, text: integral(N1) } } })
    });
    a._completerTexte(N1); a._completerTexte(N1); a._completerTexte(N1);
    await attendre(60);
    const n = a.__journal.filter(u => /mode=complet/.test(u)).length;
    return { ok: n === 1, dit: n + ' requête(s) pour un seul texte' };
  }));

/* --- 5. Un texte verrouillé n'entre pas dans l'épreuve ---------------- */
suite.push(() => controle(
  'Un texte verrouillé (payant) n’est pas ajouté à l’épreuve',
  async () => {
    const a = atelier([{ n: N1, libre: false }], { repondre: () => ({ status: 402, corps: { ok: false, error: 'Abonnement requis' } }) });
    a.state.epreuves = [{ id: 'e1', title: 'T', textIds: [], editorIds: [], ownerId: 'u1', status: 'brouillon', comments: [], activity: [] }];
    a.state.activeId = 'e1';
    a._toggleText(N1);
    await attendre(60);
    const ep = a.state.epreuves.find(e => e.id === 'e1');
    const dedans = ep && ep.textIds.indexOf(N1) >= 0;
    return { ok: !dedans, dit: dedans ? 'AJOUTÉ malgré le verrou : l’épreuve porte une amorce de 180 car.' : 'refusé, comme il se doit' };
  }));

/* --- 6. L'export ne peut pas annoncer ce qu'il ne contient pas -------- */
suite.push(() => controle(
  'Export Word : « mots » ne dépasse jamais le texte réellement présent',
  async () => {
    const a = atelier([N1], { repondre: () => ({ status: 500, corps: { ok: false } }) });
    a.state.epreuves = [{ id: 'e1', title: 'T', textIds: [N1], editorIds: [], ownerId: 'u1', status: 'brouillon', comments: [], activity: [], classe: '', duree: '', coeff: '', consigne: '', etab: '' }];
    a.state.activeId = 'e1';
    let recu = null, alerte = null;
    a.__ctx.VRT_DOCX.telecharger = (ep, textes) => { recu = textes; };
    a._avis = (m, ton) => { alerte = '[' + (ton || '') + '] ' + m; };
    try { a._exporterWord(); } catch (e) { alerte = 'exception ' + e.message; }
    /* Le refus passe par un rattrapage : on laisse la seconde tentative
       aboutir avant de juger. */
    await attendre(200);
    if (!recu) {
      /* Un export retenu doit se DIRE. Sans message, l'enseignant clique,
         rien ne descend, et il recommence sans savoir pourquoi. */
      const nomme = alerte && /export impossible/i.test(alerte);
      return {
        ok: !!nomme,
        dit: nomme ? 'export refusé et motivé — ' + alerte
          : 'export retenu SANS message (' + (alerte || 'rien') + ')'
      };
    }
    const t = recu[0] || {};
    const reels = String(t.texte || '').split(/\s+/).filter(Boolean).length;
    const menteur = (t.mots | 0) > reels * 2;
    return {
      ok: !menteur,
      dit: menteur ? 'le .docx annonce ' + t.mots + ' mots au-dessus de ' + reels + ' mots réels'
        : 'annonce ' + t.mots + ' mots pour ' + reels + ' mots présents'
    };
  }));

/* --- 7. Le garde-fou ne juge pas sur une métadonnée orpheline --------- */
suite.push(() => controle(
  'Garde-fou : un texte non synchronisé est signalé, pas validé',
  async () => {
    const a = atelier([N1], { repondre: () => ({ status: 500, corps: { ok: false } }) });
    await new Promise(r => a._completerTexte(N1, r));
    await attendre(30);
    const f = a.all.find(x => x.n === N1);
    const C = a.__ctx.CONFORMITE;
    if (!C || typeof C.verifierEpreuve !== 'function')
      return { ok: false, dit: 'CONFORMITE.verifierEpreuve introuvable' };
    const ep = { textIds: [N1], classe: '', epreuveCode: '', title: 'T' };
    let ecarts = [];
    try { ecarts = C.verifierEpreuve(ep, [f], () => [], () => 0) || []; }
    catch (e) { return { ok: false, dit: 'verifierEpreuve() a levé : ' + e.message }; }
    const txt = JSON.stringify(ecarts).toLowerCase();
    const signale = txt.indexOf('synchronis') >= 0 || txt.indexOf('incomplet') >= 0;
    return {
      ok: signale,
      dit: signale ? 'écart signalé sur le texte tronqué'
        : 'AUCUN écart : le garde-fou valide ' + (f.words | 0) +
          ' mots de métadonnée sur un contenu de ' +
          String(f.text || '').split(/\s+/).filter(Boolean).length + ' mots'
    };
  }));

/* --- 8. Le domaine public n'est jamais partiel ------------------------ */
suite.push(() => controle(
  'Un texte libre de droits arrive entier, sans requête de complétion',
  async () => {
    const ctx = contexte();
    const journal = [];
    ctx.fetch = u => { journal.push(String(u)); return new Promise(() => {}); };
    vm.runInContext(sourceComponent(), ctx, { filename: 'index.html#x-dc' });
    /* Tel que le serveur le sert : `src:'libre'` et le texte COMPLET dans
       `extrait`. On passe par le vrai chemin d'installation du client. */
    const t = SOURCE.find(x => (x.n | 0) === N1);
    ctx.window.MINESEC_CORPUS = null;
    const C = vm.runInContext('Component', ctx);
    const a = new C({});
    a.setState({ ready: false });
    /* On rejoue la transformation exacte du chargeur d'index. */
    const brut = { n: 10000 + N1, src: 'libre', words: t.words | 0,
                   type: t.type, level: t.level, cycle: t.cycle, group: t.group,
                   author: t.author, title: t.title, reference: t.reference,
                   libre: true, extrait: String(t.text || '') };
    ctx.window.MINESEC_CORPUS = [Object.assign({}, brut, {
      src: 'libre', text: brut.extrait, _partiel: false, _libre: true })];
    a._installerBase();
    const f = a.all.find(x => x.n === 10000 + N1);
    const entier = f && !f._partiel && (f.text || '').length > 300;
    await new Promise(r => a._completerTexte(10000 + N1, r));
    await attendre(40);
    const req = journal.filter(u => /mode=complet/.test(u)).length;
    return {
      ok: !!entier && req === 0,
      dit: !entier ? 'texte libre marqué partiel ou tronqué ('
            + (f ? (f.text || '').length : 0) + ' car.)'
        : (req ? req + ' requête(s) de complétion pour un texte déjà entier'
               : 'entier en mémoire, 0 requête')
    };
  }));

/* --- 9. Le domaine public n'est jamais derrière le mur ---------------- */
suite.push(() => controle(
  'Un texte libre de droits n’est jamais fermé par l’abonnement',
  async () => {
    const ctx = contexte();
    ctx.fetch = () => new Promise(() => {});
    vm.runInContext(sourceComponent(), ctx, { filename: 'index.html#x-dc' });
    const t = SOURCE.find(x => (x.n | 0) === N1);
    ctx.window.MINESEC_CORPUS = [{
      n: 10000 + N1, src: 'libre', words: t.words | 0, type: t.type,
      level: t.level, cycle: t.cycle, group: t.group, author: t.author,
      title: t.title, reference: t.reference,
      text: String(t.text || ''), _partiel: false, _libre: true }];
    const C = vm.runInContext('Component', ctx);
    const a = new C({});
    a.state.epreuves = [{ id: 'e1', title: 'T', textIds: [], editorIds: [],
      ownerId: 'u1', status: 'brouillon', comments: [], activity: [] }];
    a.state.activeId = 'e1';
    a._toggleText(10000 + N1);
    await attendre(60);
    const ep = a.state.epreuves.find(e => e.id === 'e1');
    const dedans = ep && ep.textIds.indexOf(10000 + N1) >= 0;
    const mur = !!a.state.payOpen;
    return {
      ok: dedans && !mur,
      dit: mur ? 'le mur d’abonnement s’est ouvert sur un texte du domaine public'
        : (dedans ? 'ajouté à l’épreuve sans condition'
                  : 'refusé alors qu’il est libre de droits')
    };
  }));

/* ── 5. Exécution ──────────────────────────────────────────────────────── */
(async () => {
  for (const s of suite) await s();
  console.log('\n  SONDE DE SYNCHRONISATION DU CORPUS — Atelier de Français\n');
  let ok = 0;
  resultats.forEach(r => {
    console.log('  ' + (r.ok ? '[ OK ]' : '[ KO ]') + ' ' + r.nom + '\n         → ' + r.dit);
    if (r.ok) ok++;
  });
  console.log('\n  ' + ok + '/' + resultats.length + ' contrôles passés\n');
  process.exit(ok === resultats.length ? 0 : 1);
})();
