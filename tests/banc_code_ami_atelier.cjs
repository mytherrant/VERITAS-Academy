#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_code_ami_atelier.cjs — LE CODE AMI VAUT AUSSI DANS L'ATELIER
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_code_ami_atelier.cjs

   ─── CE QU'IL PROTÈGE ───────────────────────────────────────────────────────

   Le serveur honore le Code ami sur `intent:'subscription'`, et les quatre
   plans de l'Atelier ont bien un tarif de référence dans vrt_prix_catalogue().
   Mais `api/payment_camerpay.php` ne l'évalue QUE si la requête d'initiation
   porte la clé `code` — garde délibérée, pour qu'un parrain ne soit jamais
   rémunéré sur un rabais que le filleul n'a pas vu.

   L'Atelier ne l'envoyait pas. La remise promise partout ailleurs sur le site
   ne valait donc sur aucun de ses abonnements — 800 F au mois, 5 000, 30 000 et
   70 000 F à l'année — et rien ne l'aurait dit : le paiement aboutissait, au
   plein tarif.

   ─── UN SEUL INVARIANT, COMME POUR LES CAHIERS ──────────────────────────────

       le prix affiché = le libellé du bouton = le montant envoyé au débit

   Et il vient du SERVEUR, jamais d'un calcul local : un prix deviné serait
   promis à l'écran puis refusé au débit (409 PRIX_INCOHERENT).

   ─── COMMENT IL MESURE ──────────────────────────────────────────────────────

   Le bloc applicatif de `plateforme/index.html` est EXÉCUTÉ tel qu'il est
   déployé (même harnais `vm` que tests/sonde_tarifs_atelier.cjs) : on ne rejoue
   pas une copie de la logique, on interroge le fichier réellement servi. `fetch`
   est bouchonné : on répond ce que le serveur répondrait, et on LIT LE CORPS
   réellement envoyé à `?action=init`.

   ─── POUR LE FAIRE ROUGIR (éprouvé le 16/09/2026, chiffres mesurés) ─────────
   Dans `plateforme/index.html` :
     · `if(_remiseVaut)_corps.code=_stp.payCode;`
       → `_corps.code=_stp.payCode||'';`                        4 au rouge
     · `montant:_remiseVaut?_stp.payMontant:_base`
       → `montant:Math.round(_base*0.9)` (prix deviné)          4 au rouge
     · garde-fou `&&_stp.payBase===_base` retiré                2 au rouge

   Muter par remplacement exact puis par son INVERSE exact — jamais par une
   copie de fichier : une session voisine écrit peut-être dans le même dossier,
   et une restauration l'écraserait sans un mot.
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.resolve(__dirname, '..');
const P = (r) => path.join(RACINE, r);
const html = fs.readFileSync(P('plateforme/index.html'), 'utf8');
const iScript = html.indexOf('<script type="text/x-dc"');

const G = '\x1b[32m', R = '\x1b[0m', Rg = '\x1b[31m';
let ok = 0, ko = 0;
function dire(cond, titre, vu) {
  if (cond) { ok++; console.log(`  ${G}✓${R} ${titre}`); }
  else { ko++; console.log(`  ${Rg}✗${R} ${titre}${vu ? '\n      ' + vu : ''}`); }
}

/* ══ LE HARNAIS — identique à sonde_tarifs_atelier, plus un fetch pilotable ══ */
function atelier(repondre) {
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
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    matchMedia: () => ({ matches: false, addListener() {}, removeListener() {} }),
    addEventListener() {}, removeEventListener() {}, scrollTo() {},
    setTimeout, clearTimeout, setInterval, clearInterval,
    requestAnimationFrame: fn => setTimeout(fn, 0),
    location: { protocol: 'http:', hostname: 'localhost', hash: '', href: 'http://localhost/', search: '' },
    history: { pushState() {}, replaceState() {}, back() {} },
    navigator: { userAgent: 'banc', clipboard: { writeText: () => Promise.resolve() } },
    open: () => null,
    __VRT_API: '/api/', __VRT_TOKEN: ''
  };
  win.document = { documentElement: elt(), head: elt(), body: elt(), hidden: false,
    createElement: () => elt(), createTextNode: () => elt(),
    getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    addEventListener() {}, removeEventListener() {} };
  win.window = win; win.self = win;
  const ctx = vm.createContext(win);
  ctx.console = { log() {}, warn() {}, error() {} };
  const vus = [];
  ctx.fetch = (url, opts) => {
    let corps = null;
    try { corps = JSON.parse((opts && opts.body) || 'null'); } catch (e) {}
    vus.push({ url: String(url), corps });
    const r = repondre(String(url), corps);
    if (r === undefined) return new Promise(() => {});       // laissé en suspens
    return Promise.resolve({ status: r.statut || 200, ok: true,
      json: () => Promise.resolve(r.corps) });
  };
  ctx.TextDecoder = require('util').TextDecoder;
  ctx.AbortController = typeof AbortController !== 'undefined' ? AbortController : undefined;
  ctx.Blob = function () {}; ctx.URL = { createObjectURL: () => 'blob:', revokeObjectURL() {} };
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
  a.__vus = vus;
  /* Ce qu'il faut pour atteindre l'initiation sans rejouer tout le parcours :
     un jeton en main, un compte, et un numéro valide. */
  a._payTok = 'tok-banc';
  a._estInvite = () => false;
  a._ajouterAttente = () => {};
  a._sonderPaiement = () => {};
  a.setState({ paySelected: 'ens', payOpen: true, payCard: '697637739',
               payName: 'Banc', compteId: 'acc-banc', payBusy: false });
  return a;
}

const attendre = () => new Promise(r => setTimeout(r, 30));
const initDe = (a) => (a.__vus.filter(v => /action=init/.test(v.url)).pop() || {}).corps || null;
const verifDe = (a) => (a.__vus.filter(v => /action=verifier/.test(v.url)).pop() || {}).corps || null;

/* Le serveur répond une remise que RIEN ne permet de deviner localement :
   ni 10 %, ni un arrondi. Si le client affichait un prix calculé chez lui, le
   banc le verrait aussitôt. */
const TARIF_ENS = 5000;
const REMISE = 743;
const MONTANT = TARIF_ENS - REMISE;

const repondreOk = (url) => {
  if (/action=verifier/.test(url)) return { corps: { ok: true, code: 'VRTBANC1', remisePct: 10,
    remise: REMISE, prix: TARIF_ENS, montant: MONTANT, parrain: 'Awa T.', message: '' } };
  if (/action=init/.test(url)) return { statut: 201, corps: { pay_url: 'https://exemple/pay' } };
  return { corps: {} };
};
const repondreRefus = (url) => {
  if (/action=verifier/.test(url)) return { corps: { ok: false, message: 'Code inconnu, épuisé ou expiré.' } };
  if (/action=init/.test(url)) return { statut: 201, corps: { pay_url: 'https://exemple/pay' } };
  return { corps: {} };
};

(async () => {
  console.log(`\n${G}① Le gabarit porte le champ, et le serveur est interrogé${R}`);
  {
    dire(/id="vrt-ca"|\{\{ payCode \}\}/.test(html) && /\{\{ applyPayCode \}\}/.test(html),
      'la fenêtre de paiement affiche un champ « Code ami » et son bouton',
      'aucun champ : la remise ne pourrait pas être saisie');
    dire(/parrainage\.php'\)\+'\?action=verifier/.test(html),
      'et l’Atelier demande au SERVEUR ce qu’il honorerait');
    dire(/intent:'subscription',targetId:plan\.id/.test(html),
      '… sous l’intent « subscription », celui que le serveur reconnaît');
    /* On lit le LITTÉRAL `const _corps = { … }` envoyé au débit, et on exige
       qu'il ne porte aucune clé `code` : elle ne s'ajoute qu'après, sous
       condition. Scanner tout le fichier accuserait à tort — un objet
       « équipe » porte lui aussi un champ `code`, sans rapport avec l'argent. */
    const litt = /const _corps=\{[\s\S]*?\};/.exec(html);
    dire(!!litt && !/(^|[{,]\s*)code:/.test(litt[0])
      && /if\(_remiseVaut\)_corps\.code=_stp\.payCode;/.test(html),
      'la clé `code` n’est ajoutée au débit que si une remise est ACQUISE',
      'une clé `code` inconditionnelle ferait appliquer un lien inconnu de la page');
  }

  console.log(`\n${G}② Sans code : plein tarif, et pas de clé${R}`);
  {
    const a = atelier(repondreOk);
    a._payerCamerpay();
    await attendre();
    const c = initDe(a);
    dire(!!c, 'le tunnel initie bien un paiement', 'aucun corps capté');
    dire(!!c && c.montant === TARIF_ENS, `montant = plein tarif (${TARIF_ENS})`,
      'montant : ' + (c && c.montant));
    dire(!!c && !('code' in c), 'et la clé `code` est ABSENTE',
      'clés : ' + (c ? Object.keys(c).join(',') : '—'));
  }

  console.log(`\n${G}③ Code accepté : le chiffre du serveur, du début à la fin${R}`);
  {
    const a = atelier(repondreOk);
    a.setState({ payCode: 'vrtbanc1' });
    a._verifierCodeAmi();
    await attendre();
    const v = verifDe(a);
    dire(!!v && v.intent === 'subscription' && v.targetId === 'ens' && v.montant === TARIF_ENS,
      'la vérification part avec le plan et son tarif de référence',
      'envoyé : ' + JSON.stringify(v));
    dire(a.state.payCodeOk === true && a.state.payMontant === MONTANT
      && a.state.payRemise === REMISE && a.state.payBase === TARIF_ENS,
      `l’état retient CE que le serveur a dit (${MONTANT}), pas un calcul local`,
      'état : ' + JSON.stringify({ ok: a.state.payCodeOk, m: a.state.payMontant,
        r: a.state.payRemise, b: a.state.payBase }));
    a._payerCamerpay();
    await attendre();
    const c = initDe(a);
    dire(!!c && c.montant === MONTANT, 'et c’est ce chiffre-là qui part au débit',
      'montant : ' + (c && c.montant));
    dire(!!c && c.code === 'VRTBANC1', 'le code qui a produit la remise accompagne le paiement',
      'code : ' + (c && c.code));
  }

  console.log(`\n${G}④ Changer de plan retire la remise${R}`);
  {
    const a = atelier(repondreOk);
    a.setState({ payCode: 'VRTBANC1' });
    a._verifierCodeAmi();
    await attendre();
    // L'acheteur revient en arrière et choisit le Collège (30 000 F).
    a.setState({ paySelected: 'etab' });
    a._payerCamerpay();
    await attendre();
    const c = initDe(a);
    dire(!!c && c.montant === 30000,
      'le débit part au tarif du plan choisi (30 000), pas au remisé de l’autre',
      'montant : ' + (c && c.montant));
    dire(!!c && !('code' in c), 'et sans clé `code` — la remise n’a pas été validée pour CE plan',
      'clés : ' + (c ? Object.keys(c).join(',') : '—'));
  }

  console.log(`\n${G}⑤ Code refusé : le prix ne bouge pas d’un franc${R}`);
  {
    const a = atelier(repondreRefus);
    a.setState({ payCode: 'VRTFAUX0' });
    a._verifierCodeAmi();
    await attendre();
    dire(a.state.payCodeOk === false && a.state.payMontant === 0,
      'aucune remise n’est retenue', 'état : ' + JSON.stringify({ ok: a.state.payCodeOk, m: a.state.payMontant }));
    dire(/inconnu|épuis|expir/i.test(String(a.state.payCodeMsg || '')),
      'et l’acheteur lit POURQUOI', 'message : ' + a.state.payCodeMsg);
    a._payerCamerpay();
    await attendre();
    const c = initDe(a);
    dire(!!c && c.montant === TARIF_ENS && !('code' in c),
      'le débit part au plein tarif, sans clé `code`',
      'montant : ' + (c && c.montant) + ' clés : ' + (c ? Object.keys(c).join(',') : '—'));
  }

  console.log(`\n${ok} contrôle(s) au vert, ${ko} au rouge.\n`);
  process.exit(ko === 0 ? 0 : 1);
})();
