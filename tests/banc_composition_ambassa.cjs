#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_composition_ambassa.cjs — AMBASSA COMPOSE-T-ELLE UNE ÉPREUVE
   CONFORME, ET L'ÉQUIPE GARDE-T-ELLE LA MAIN ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_composition_ambassa.cjs

   CE QU'IL PROTÈGE — la plainte du 26/09/2026 : « l'Atelier ne passe pas
   parce que ce n'est pas automatique ; les usagers veulent que l'IA génère
   entièrement l'épreuve, ils relisent et corrigent simplement ». Réponse :
   plateforme/generateur.js + le panneau « Composer avec Ambassa » (hybride).

   ① LE PLAN (sans réseau). Pour CHAQUE structure officielle de minesec.js,
     le plan calculé retombe exactement sur le total attendu ; les sujets au
     choix n'y entrent pas ; le texte choisi respecte la longueur officielle ;
     le prompt tient sous le plafond d'octets du proxy.
   ② LE CONTRÔLE. Un barème farfelu renvoyé par l'IA est recalé au point
     près ; « Pourquoi… ? » est détecté (mais pas « commentaire ») ; en mode
     « compléter », les questions de l'équipe restent mot pour mot.
   ③ LE PARCOURS RÉEL. Le bloc applicatif de plateforme/index.html est
     EXÉCUTÉ (harnais vm) avec un Ambassa simulé : le texte est choisi, les
     questions, points et corrigés atterrissent dans l'épreuve, marqués « à
     relire » ; la question fautive est réécrite par un second appel ; le
     garde-fou compte les propositions non relues ; « tout marquer relu »
     les retire ; supprimer une question décale points et corrigé.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.resolve(__dirname, '..');
const P = f => path.join(RACINE, f);
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => {
  b ? ok++ : ko++;
  console.log('  ' + (b ? V : X) + ' ' + m + (!b && d !== undefined ? '  → ' + d : ''));
};

globalThis.MINESEC = require(P('plateforme/minesec.js'));
const GEN = require(P('plateforme/generateur.js'));

/* Un petit corpus de synthèse, aux longueurs contrôlées : le vrai corpus
   MINESEC n'est pas versionné (marchandise). */
function phrase(n, mot) { return Array.from({ length: n }, (_, i) => (i % 12 === 11 ? mot + '.' : mot)).join(' '); }
const CORPUS = [
  { n: 11, level: '3e', type: 'NARRATIF', words: 120, text: phrase(120, 'village'), reference: 'Court, 2001',
    comprehension: '1) Relève les personnages. 2) Quel est le thème ?', exploitation: '1) Transforme la phrase. 2) Rédige la suite.' },
  { n: 12, level: '4e - 3e', type: 'NARRATIF', words: 228, text: phrase(228, 'marché'), reference: 'Moyen, 2010',
    comprehension: '1) Identifie le narrateur. 2) Relève les lieux.', exploitation: '1) Remplace les noms par des pronoms. 2) Raconte une scène.' },
  { n: 13, level: '1ere - Tle', type: 'ARGUMENTATIF', words: 600, text: phrase(600, 'progrès'), reference: 'Essai, 2015',
    comprehension: '1) Relève la thèse.', exploitation: '1) Résume au quart.' },
  { n: 14, level: '1ere - Tle', type: 'POÉTIQUE', words: 190, text: phrase(190, 'fleuve'), reference: 'Poème, 1960',
    comprehension: '1) Relève les images.', exploitation: '1) Étudie le rythme.' },
  { n: 15, level: '6e - 5e', type: 'DESCRIPTIF', words: 135, text: phrase(135, 'maison'), reference: 'Récit, 1998',
    comprehension: '1) Relève les couleurs.', exploitation: '1) Décris ta maison.' },
  { n: 16, level: '3e', type: 'DESCRIPTIF', words: 900, text: phrase(900, 'forêt'), reference: 'Long, 1990',
    comprehension: '1) Relève.', exploitation: '1) Rédige.' },
  { n: 17, level: '3e', type: 'NARRATIF', words: 230, text: phrase(230, 'fermé'), reference: 'Fermé, 2020', _libre: false,
    comprehension: '1) Relève.', exploitation: '1) Rédige.' }
];

/* ───────────────────────── ① LE PLAN ───────────────────────── */
console.log(`\n${G}AMBASSA COMPOSE-T-ELLE UNE ÉPREUVE CONFORME ?${R}\n`);
console.log(`${G}① Le plan de chaque structure officielle${R}`);

const fausses = [];
MINESEC.epreuves.forEach(s => {
  const p = GEN.planEpreuve(s);
  const b = GEN.blocsDuPlan(p);
  const t = GEN.totalNote(b.reduce((a, x) => a + x.points, 0), p.sujets);
  if (Math.abs(t - MINESEC.totalAttendu(s)) > 0.001) fausses.push(s.code + ' ' + t + '/' + MINESEC.totalAttendu(s));
});
dire(!fausses.length, 'les ' + MINESEC.epreuves.length + ' structures retombent sur leur total officiel', fausses.join(', '));

const pA = GEN.planEpreuve(MINESEC.epreuveParCode('A_LITT'));
dire(pA.sujets.filter(s => s.auChoix).length === 2 && pA.sujets.some(s => s.genre === 'commentaire'),
  'A_LITT : contraction sur le texte + 2 sujets au choix dont le commentaire', JSON.stringify(pA.sujets.map(s => s.genre)));
const pL = GEN.planEpreuve(MINESEC.epreuveParCode('A_LANGUE'));
dire(pL.expl.rubriques.length === 4 && pL.expl.rubriques.every(r => r.points === 5),
  'Langue française : les 4 rubriques de 5 points', JSON.stringify(pL.expl.rubriques));
const pS = GEN.planEpreuve(MINESEC.epreuveParCode('STT'));
dire(pS.productions.some(x => x.genre === 'resume' && x.points === 10) && pS.expl.points === 8,
  'STT : résumé /10 + langue 4 × 2 /8 + présentation /2', JSON.stringify([pS.productions, pS.expl.points]));
const pO = GEN.planEpreuve(MINESEC.epreuveParCode('BEPC_ORTHO'));
dire(pO.support === 'fautif', 'BEPC — correction orthographique : texte fautif fabriqué à partir d’un texte du corpus');
const pE = GEN.planEpreuve(MINESEC.epreuveParCode('EE_1C'));
dire(pE.support === 'aucun' && pE.sujets[0].points === 20, 'Expression écrite : une situation-problème à 20 points');

const cl = GEN.classerTextes(CORPUS, { classe: '3e', bornes: { min: 200, max: 250 }, alea: () => 0 });
dire(cl[0].f.n === 12, 'BEPC étude de texte : le texte retenu est de 3e et dans la norme 200-250 mots', cl.map(x => x.f.n + ':' + Math.round(x.score)).join(' '));
dire(!cl.some(x => x.f.n === 17), 'un texte fermé par l’abonnement n’est jamais proposé');

let pire = 0;
MINESEC.epreuves.forEach(s => {
  const p = GEN.planEpreuve(s);
  const textes = p.support === 'aucun' ? [] : [Object.assign({ role: p.support === 'texte' ? 'support' : p.support }, CORPUS[5])];
  if (p.sujets.some(x => x.genre === 'commentaire')) textes.push(Object.assign({ role: 'commentaire' }, CORPUS[3]));
  const pr = GEN.ajusterPrompt({ plan: p, struct: s, classe: '3e', textes, exemples: [] });
  pire = Math.max(pire, GEN.octets(pr));
});
dire(pire <= 8000, 'même avec un texte de 900 mots, le prompt tient sous les 8 000 octets du proxy (' + pire + ' o)');
const sys = GEN.formationMinesec(MINESEC.epreuveParCode('BEPC_ETUDE'), null, '3e', GEN.exemplesOfficiels(CORPUS, '3e', 12, 2));
dire(/Relève les personnages|Identifie le narrateur/.test(sys) && /pourquoi/.test(sys) && /200 à 250 mots/.test(sys),
  'la formation d’Ambassa porte le descriptif, les formulations proscrites et des questions RÉELLES de la classe');

/* ───────────────────────── ② LE CONTRÔLE ───────────────────────── */
console.log(`\n${G}② Le contrôle de ce qu'Ambassa renvoie${R}`);

const somme = GEN.repartir([3, 7, null, 1], 10);
dire(Math.abs(somme.reduce((a, b) => a + b, 0) - 10) < 0.001 && somme.every(x => x > 0),
  'un barème farfelu est recalé au point près', JSON.stringify(somme));
const b4 = GEN.motsBannis();
dire(GEN.motifBanni('Pourquoi le narrateur part-il ?', b4) === 'pourquoi', '« Pourquoi… ? » est détecté');
dire(GEN.motifBanni('Rédige un commentaire composé.', b4) === '', '« commentaire » n’est pas pris pour « comment »');

const sBE = MINESEC.epreuveParCode('BEPC_ETUDE');
const planBE = GEN.planEpreuve(sBE);
const ctxBE = { plan: planBE, struct: sBE, classe: '3e', textes: [Object.assign({ role: 'support' }, CORPUS[1])] };
const brut = { titre: 'Épreuve', questions: [
  { texte: 1, liste: 'comp', bloc: 'comp', q: 'Relève les lieux du texte.', pts: 7, corrige: 'le marché' },
  { texte: 1, liste: 'comp', bloc: 'comp', q: 'Pourquoi le marché est-il bruyant ?', pts: 1 },
  { texte: 1, liste: 'expl', bloc: 'expl', q: 'Transforme « le marché » en pronom.', pts: 30 }
] };
const v = GEN.validerEpreuve(brut, ctxBE);
const tot = (v.questions[12].comp.concat(v.questions[12].expl)).reduce((a, x) => a + x.pts, 0);
dire(Math.abs(tot - 20) < 0.001 && v.questions[12].comp.reduce((a, x) => a + x.pts, 0) === 10,
  'BEPC : compréhension /10 et langue /10 imposées par le plan, quoi qu’ait écrit l’IA', tot);
dire(v.aReparer.length === 1 && v.aReparer[0].motif === 'pourquoi', 'la question en « Pourquoi » part en réécriture');
const v2 = GEN.appliquerReparation(v, { questions: ['Explique ce qui rend le marché bruyant.'] });
dire(!v2.aReparer.length && /Explique/.test(v2.questions[12].comp[1].q), 'la réécriture est appliquée et recontrôlée');

const fixes = { 12: { comp: ['Question de l’équipe A', 'Question de l’équipe B'], expl: ['Question C'] } };
const vf = GEN.validerEpreuve({ questions: [
  { texte: 1, liste: 'comp', q: 'IA réécrit A', pts: 4, corrige: 'cA' },
  { texte: 1, liste: 'comp', q: 'IA réécrit B', pts: 6, corrige: 'cB' },
  { texte: 1, liste: 'expl', q: 'IA réécrit C', pts: 10, corrige: 'cC' }] }, Object.assign({}, ctxBE, { fixes }));
dire(vf.questions[12].comp[0].q === 'Question de l’équipe A' && vf.questions[12].comp[1].corrige === 'cB',
  'mode « compléter » : les énoncés de l’équipe restent, seuls points et corrigés viennent d’Ambassa');

/* ───────────────────────── ③ LE PARCOURS RÉEL ───────────────────────── */
console.log(`\n${G}③ Dans l'Atelier (bloc applicatif exécuté, Ambassa simulé)${R}`);

const html = fs.readFileSync(P('plateforme/index.html'), 'utf8');
const iScript = html.indexOf('<script type="text/x-dc"');

function atelier(repondre) {
  const stock = {};
  const elt = () => ({ style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {} },
    setAttribute() {}, removeAttribute() {}, getAttribute: () => null, appendChild() {}, removeChild() {},
    addEventListener() {}, removeEventListener() {}, click() {}, focus() {}, remove() {}, scrollIntoView() {},
    querySelector: () => null, querySelectorAll: () => [], getBoundingClientRect: () => ({ top: 0, height: 0, width: 0 }) });
  const win = {
    MINESEC_CORPUS: null,
    localStorage: { getItem: k => (k in stock ? stock[k] : null), setItem: (k, v2) => { stock[k] = String(v2); }, removeItem: k => { delete stock[k]; } },
    matchMedia: () => ({ matches: false, addListener() {}, removeListener() {} }),
    addEventListener() {}, removeEventListener() {}, scrollTo() {},
    setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame: fn => setTimeout(fn, 0),
    location: { protocol: 'http:', hostname: 'localhost', hash: '', href: 'http://localhost/', pathname: '/plateforme/', origin: 'http://localhost' },
    history: { pushState() {}, replaceState() {}, back() {} },
    navigator: { userAgent: 'banc', clipboard: { writeText: () => Promise.resolve() } },
    __VRT_API: '/api/', __VRT_TOKEN: 'JETON-BANC'
  };
  win.document = { documentElement: elt(), head: elt(), body: elt(), hidden: false, createElement: () => elt(),
    createTextNode: () => elt(), getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    addEventListener() {}, removeEventListener() {} };
  win.window = win; win.self = win;
  const ctx = vm.createContext(win);
  ctx.console = { log() {}, warn() {}, error() {} };
  ctx.TextDecoder = require('util').TextDecoder; ctx.TextEncoder = require('util').TextEncoder;
  ctx.Blob = function () {}; ctx.URL = { createObjectURL: () => 'blob:', revokeObjectURL() {} };
  ctx.React = { createElement: (t, p) => ({ type: t, props: p || {} }), Fragment: 'F', isValidElement: x => !!(x && x.type),
    cloneElement: (e, p) => ({ type: e && e.type, props: Object.assign({}, e && e.props, p) }) };
  const journal = [];
  ctx.fetch = (url, o) => {
    const corps = (() => { try { return JSON.parse((o && o.body) || 'null'); } catch (e) { return null; } })();
    journal.push({ url: String(url), corps });
    const r = repondre(String(url), corps);
    if (!r) return new Promise(() => {});
    return Promise.resolve({ ok: (r.status || 200) < 300, status: r.status || 200, json: () => Promise.resolve(r.corps) });
  };
  vm.runInContext('class DCLogic{constructor(p){this.props=p||{};this.state={};}' +
    'setState(x,a){const d=(typeof x==="function")?x(this.state):x;this.state=Object.assign({},this.state,d||{});if(typeof a==="function")a();}}',
    ctx, { filename: 'dclogic.js' });
  ['texte', 'minesec', 'conformite', 'exercices', 'generateur', 'docx'].forEach(n =>
    vm.runInContext(fs.readFileSync(P('plateforme/' + n + '.js'), 'utf8'), ctx, { filename: n + '.js' }));
  vm.runInContext(html.slice(iScript).replace(/^[\s\S]*?>/, '').replace(/<\/script>[\s\S]*$/, ''), ctx, { filename: 'index.html#x-dc' });
  ctx.window.MINESEC_CORPUS = CORPUS.map(t => Object.assign({ cycle: 'PREMIER CYCLE', group: 'Module 1', _partiel: false, _libre: true }, t));
  const C = vm.runInContext('Component', ctx);
  const a = new C({});
  a.__journal = journal;
  if (a._installerBase) a._installerBase();
  return a;
}

const REPONSE_BEPC = { titre: 'BEPC blanc — Le marché', consigne: 'Lis attentivement le texte puis réponds aux questions.',
  questions: [
    { texte: 1, liste: 'comp', bloc: 'comp', q: 'Relève trois lieux du texte.', pts: 3, niveau: 'reperage', corrige: 'le marché, la place, la rue' },
    { texte: 1, liste: 'comp', bloc: 'comp', q: 'Pourquoi le narrateur aime-t-il le marché ?', pts: 3, niveau: 'analyse', corrige: 'il y retrouve…' },
    { texte: 1, liste: 'comp', bloc: 'comp', q: 'Quel effet la répétition de « marché » produit-elle ?', pts: 4, niveau: 'interpretation', corrige: 'insistance' },
    { texte: 1, liste: 'expl', bloc: 'expl', q: 'Remplace « le marché » par un pronom dans la phrase 1.', pts: 5, niveau: 'analyse', corrige: 'il' },
    { texte: 1, liste: 'expl', bloc: 'expl', q: 'Réécris la phrase 2 au passé composé.', pts: 5, niveau: 'analyse', corrige: '…' }
  ], sujets: [], grille: [{ critere: 'Compréhension', points: 10, indicateurs: '…' }], remarques: 'Vérifier la phrase 2.' };

const attendre = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  let appelsIA = 0;
  const a = atelier((url, corps) => {
    if (/ia_proxy/.test(url)) {
      appelsIA++;
      if (corps && /Réécris chaque question/.test(corps.prompt || ''))
        return { corps: { text: JSON.stringify({ questions: ['Explique ce qui attire le narrateur au marché.'] }) } };
      return { corps: { text: '```json\n' + JSON.stringify(REPONSE_BEPC) + '\n```' } };
    }
    return { status: 200, corps: { ok: true } };
  });

  await new Promise(r => a._ensureDraft(() => r()));
  a._updateActive({ classe: '3e', epreuveCode: 'BEPC_ETUDE', etab: 'Lycée de Bonabéri' });
  const avant = a._active();
  dire(!!avant && avant.textIds.length === 0, 'point de départ : une épreuve vide, classe 3e, BEPC étude de texte');

  a._composerAvecAmbassa('tout');
  for (let i = 0; i < 60 && a.state.genBusy; i++) await attendre(100);
  const e = a._active();
  const iaCall = a.__journal.find(x => /ia_proxy/.test(x.url));
  dire(!a.state.genErr, 'aucune erreur affichée', a.state.genErr);
  dire(e.textIds.length === 1 && e.textIds[0] === 12, 'Ambassa a pris un texte de 3e dans la norme (n°12)', JSON.stringify(e.textIds));
  dire(!!iaCall && iaCall.corps.token === 'JETON-BANC' && /FORMULATIONS PROSCRITES/.test(iaCall.corps.sysPrompt || ''),
    'l’appel porte le jeton du compte et la formation MINESEC en consigne système');
  dire(appelsIA === 2, 'la question en « Pourquoi » a déclenché UNE réécriture', appelsIA);
  const qs = a._qList(a.all.find(x => x.n === 12), 'comp');
  dire(qs.length === 3 && !/pourquoi/i.test(qs.join(' ')), 'les questions d’Ambassa sont dans l’épreuve, sans « Pourquoi »', JSON.stringify(qs));
  dire(Math.abs(a._baremeTotal() - 20) < 0.001, 'barème : 20 / 20', a._baremeTotal());
  dire(e.corrige && e.corrige[12] && e.corrige[12].comp[0] === 'le marché, la place, la rue', 'chaque question a son corrigé');
  dire(e.title === 'BEPC blanc — Le marché' && e.duree === '2 h' && e.coeff === '2', 'titre, durée et coefficient officiels posés');
  const n0 = vmConf(a).compterNonRelus(e);
  dire(n0 === 5, 'les 5 questions sont marquées « à relire »', n0);
  const garde = vmConf(a).verifierEpreuve(e, e.textIds.map(n => a.all.find(x => x.n === n)), (f, k) => a._qList(f, k), (n, k, i) => a._qPts(n, k, i));
  dire(garde.some(x => /à relire/.test(x.titre)) && !garde.some(x => x.severite === 'bloquant'),
    'le garde-fou signale les propositions non relues, sans aucun bloquant', garde.map(x => x.severite + ':' + x.titre).join(' | '));
  dire(/a fait composer l’épreuve par Ambassa/.test((e.activity || []).map(x => x.text).join(' ')), 'l’historique de l’équipe dit qui a fait composer');

  let vals = null;
  try { vals = a.renderVals(); } catch (err) { vals = { __err: err.message }; }
  dire(vals && !vals.__err && vals.genARapport && /20 \/ 20/.test(vals.genControles.map(c => c.libelle).join(' ')),
    'le panneau rend le rapport de contrôle (barème 20 / 20)', vals && (vals.__err || JSON.stringify(vals.genControles)));

  /* Relecture : modifier une question retire SA marque, rien d'autre. */
  const f12 = a.all.find(x => x.n === 12);
  a._setQ(f12, 'expl', 0, 'Remplace « le marché » par le pronom qui convient.');
  dire(vmConf(a).compterNonRelus(a._active()) === 4, 'modifier une question vaut relecture de cette question seule');
  /* Supprimer la 1re question : points et corrigé suivent leur question. */
  const avantPts = a._qPts(12, 'comp', 1), avantCorr = a._active().corrige[12].comp[1];
  a._setQ(f12, 'comp', 0, null);
  dire(a._qPts(12, 'comp', 0) === avantPts && a._active().corrige[12].comp[0] === avantCorr,
    'supprimer une question décale ses points et son corrigé avec elle');
  a._toutRelu();
  dire(vmConf(a).compterNonRelus(a._active()) === 0, '« Tout marquer comme relu » retire toutes les marques');

  const blocs = a._corrigePourExport(a._active());
  dire(Array.isArray(blocs) && blocs.some(b => /Compréhension/.test(b.titre)), 'l’export Word reçoit le corrigé, séparé de la feuille du candidat');

  /* Mode « compléter » : les questions de l'équipe ne bougent pas. */
  const avantQ = a._qList(f12, 'comp').concat(a._qList(f12, 'expl'));
  a._composerAvecAmbassa('completer');
  for (let i = 0; i < 60 && a.state.genBusy; i++) await attendre(100);
  const apresQ = a._qList(f12, 'comp').concat(a._qList(f12, 'expl'));
  dire(JSON.stringify(avantQ) === JSON.stringify(apresQ) && Math.abs(a._baremeTotal() - 20) < 0.001,
    '« Compléter » garde les énoncés de l’équipe mot pour mot et remet le barème à 20', a._baremeTotal());

  /* Expression écrite : aucun texte, une situation-problème rédigée. */
  const b = atelier((url) => /ia_proxy/.test(url)
    ? { corps: { text: JSON.stringify({ titre: 'Expression écrite', sujets: [{ texte: 'Situation : ton quartier… Consigne : 1) … 2) … 3) …', corrige: 'Attentes…' }] }) } }
    : { corps: { ok: true } });
  await new Promise(r => b._ensureDraft(() => r()));
  b._updateActive({ classe: '4e', epreuveCode: 'EE_1C', etab: 'CES' });
  b._composerAvecAmbassa('tout');
  for (let i = 0; i < 60 && b.state.genBusy; i++) await attendre(100);
  const eb = b._active();
  dire((eb.sujets || []).length === 1 && /Situation/.test(eb.sujets[0].texte) && Math.abs(b._baremeTotal() - 20) < 0.001 && !eb.textIds.length,
    'expression écrite : une situation-problème /20, sans texte support', JSON.stringify(eb.sujets));
  const gb = vmConf(b).verifierEpreuve(eb, [], () => [], () => null);
  dire(!gb.some(x => x.severite === 'bloquant'), 'le garde-fou accepte une épreuve portée par un sujet rédigé', gb.map(x => x.titre).join(' | '));

  /* Sans classe : on n'appelle pas l'IA, on dit quoi faire. */
  const c = atelier(() => ({ corps: { ok: true } }));
  await new Promise(r => c._ensureDraft(() => r()));
  c._composerAvecAmbassa('tout');
  dire(/Renseignements/.test(c.state.genErr || '') && !c.__journal.some(x => /ia_proxy/.test(x.url)),
    'sans classe ni nature d’épreuve : aucun appel, un message qui dit quoi renseigner');

  console.log(`\n  ${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
  process.exit(ko ? 1 : 0);
})().catch(e => { console.log('  ' + X + ' exception : ' + (e && e.stack || e)); process.exit(1); });

/* CONFORMITE vit dans le contexte vm de l'Atelier : on la récupère par
   l'instance, pour mesurer celle que l'interface emploie vraiment. */
function vmConf(inst) {
  return inst.__conf || (inst.__conf = (function () {
    // Le composant n'expose pas son contexte ; on relit le module dans un
    // contexte neuf, avec le même minesec.js — c'est le même code.
    const ctx = vm.createContext({});
    vm.runInContext(fs.readFileSync(P('plateforme/minesec.js'), 'utf8'), ctx);
    vm.runInContext(fs.readFileSync(P('plateforme/conformite.js'), 'utf8'), ctx);
    return vm.runInContext('CONFORMITE', ctx);
  })());
}
