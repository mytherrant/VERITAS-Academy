/* Sonde des GOÛTS, SUGGESTIONS ET ASTUCES — Atelier de Français.
 *
 * La règle que cette sonde défend avant toutes les autres
 * -------------------------------------------------------
 * On n'invente ni activité ni statistique. Base vide = rien affiché.
 *
 * Elle vaut ici plus qu'ailleurs. Proposer « les textes que vous aimez » à
 * quelqu'un qui n'a rien ouvert ne se contente pas d'être inutile : cela lui
 * apprend que le reste de l'écran ment peut-être aussi. Une recommandation
 * fabriquée coûte plus cher que pas de recommandation du tout.
 *
 * Les astuces obéissent à la même règle : elles sortent du RÉFÉRENTIEL
 * (minesec.js) ou de l'état réel du compte. Que « pourquoi » et « comment »
 * soient absents des 3 372 questions officielles est une mesure, pas un
 * conseil inventé — et c'est ce qui la rend utile à un professeur.
 *
 *   node tests/sonde_gouts_atelier.cjs
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.resolve(__dirname, '..');
const P = f => path.join(RACINE, f);
const html = fs.readFileSync(P('plateforme/index.html'), 'utf8');
const iScript = html.indexOf('<script type="text/x-dc"');

function atelier() {
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

  /* Un corpus de travail : deux auteurs, deux types, de quoi voir si les
     suggestions suivent l'auteur plutôt que le hasard. */
  const fiches = [];
  for (let i = 1; i <= 40; i++) {
    fiches.push({
      n: i, author: (i % 2 ? 'Maupassant' : 'Flaubert'),
      title: 'Titre ' + i, reference: 'Ref ' + i,
      type: (i % 3 ? 'NARRATIF' : 'DESCRIPTIF'),
      cycle: 'PREMIER CYCLE', group: 'Module ' + (1 + (i % 3)),
      words: 120 + i, level: '3e', text: ('mot ').repeat(120).trim(),
      _partiel: false, _libre: true
    });
  }
  ctx.window.MINESEC_CORPUS = fiches;
  const C = vm.runInContext('Component', ctx);
  const a = new C({});
  a.__ctx = ctx;
  return a;
}

const resultats = [];
function juger(nom, ok, vu) {
  resultats.push({ nom, ok, vu });
  console.log('  ' + (ok ? '[ OK ]' : '[ KO ]') + ' ' + nom + '\n         → ' + vu);
}

console.log('\n  GOÛTS, SUGGESTIONS ET ASTUCES — Atelier de Français\n');

/* --- 1. Sans historique, on ne propose RIEN --------------------------- */
{
  const a = atelier();
  const s = a._suggestions(6);
  juger('Sans historique, aucune suggestion n’est inventée',
    s.length === 0, s.length + ' suggestion(s) pour 0 geste');
}

/* --- 2. Deux gestes ne font pas un goût ------------------------------- */
{
  const a = atelier();
  a._noterGout(1, 1); a._noterGout(3, 1);
  const s = a._suggestions(6);
  juger('Deux gestes ne suffisent pas à conclure',
    s.length === 0, s.length + ' suggestion(s) pour 2 gestes');
}

/* --- 3. Au-delà, les suggestions suivent l'AUTEUR --------------------- */
{
  const a = atelier();
  /* Trois textes de Maupassant (impairs), dont un ajouté à une épreuve. */
  a._noterGout(1, 1); a._noterGout(3, 2); a._noterGout(5, 3);
  const s = a._suggestions(6);
  const mm = s.filter(f => f.author === 'Maupassant').length;
  juger('Les suggestions suivent l’auteur qui a plu',
    s.length > 0 && mm >= Math.ceil(s.length / 2),
    s.length + ' suggestion(s), dont ' + mm + ' du même auteur');
}

/* --- 4. On ne repropose pas ce qui a déjà été vu ---------------------- */
{
  const a = atelier();
  a._noterGout(1, 1); a._noterGout(3, 1); a._noterGout(5, 1);
  const s = a._suggestions(20);
  const revus = s.filter(f => [1, 3, 5].indexOf(f.n) >= 0).length;
  juger('Un texte déjà ouvert n’est jamais reproposé',
    revus === 0, revus + ' texte(s) déjà vus dans les suggestions');
}

/* --- 5. Chaque suggestion dit POURQUOI -------------------------------- */
{
  const a = atelier();
  a._noterGout(1, 1); a._noterGout(3, 1); a._noterGout(5, 1);
  const s = a._suggestions(4);
  const sans = s.filter(f => !a._raisonSuggestion(f)).length;
  juger('Chaque suggestion porte sa raison',
    s.length > 0 && sans === 0,
    s.length ? (sans + ' sans raison') : 'aucune suggestion à vérifier');
}

/* --- 6. Le poids d'un ajout pèse plus qu'une ouverture ---------------- */
{
  const a = atelier();
  a._noterGout(2, 3);           // Flaubert, ajouté à une épreuve
  a._noterGout(1, 1); a._noterGout(7, 1);   // Maupassant, simplement ouverts
  const g = a._gouts();
  juger('Ajouter à une épreuve pèse plus qu’ouvrir une fiche',
    (g.auteurs.Flaubert || 0) > (g.auteurs.Maupassant || 0) / 2,
    'Flaubert ' + (g.auteurs.Flaubert || 0) + ' contre Maupassant '
      + (g.auteurs.Maupassant || 0));
}

/* --- 7. Les astuces sortent du référentiel, pas de l'imagination ------ */
{
  const a = atelier();
  const l = a._astuces();
  const M = a.__ctx.MINESEC;
  const motifs = ((M && M.questionnement && M.questionnement.aEviter) || [])
    .map(x => x.motif);
  const ancrees = l.filter(x => motifs.some(m => (x.c || '').indexOf(m) >= 0)).length;
  juger('Les astuces citent le référentiel MINESEC',
    l.length >= 3 && ancrees > 0,
    l.length + ' astuce(s), dont ' + ancrees + ' citant une formulation mesurée');
}

/* --- 8. Une astuce ne se répète pas d'affilée ------------------------- */
{
  const a = atelier();
  const vues = [];
  a._bulleAstuce = (t) => vues.push(t);
  a._montrerAstuce();
  a._astuceLe = 0;              // on lève la limite d'une par minute
  a._montrerAstuce();
  juger('Deux astuces d’affilée ne sont jamais la même',
    vues.length === 2 && vues[0] !== vues[1],
    vues.length + ' astuce(s) : ' + vues.join(' / ').slice(0, 70));
}

/* --- 8 bis. Le panier PESE, et il pese le poids annonce ---------------
   Le code documentait trois gestes : ouvrir (1), mettre au panier (2),
   ajouter a une epreuve (3). Le deuxieme n'etait appele nulle part -- le
   geste le plus revelateur du parcours ne comptait pour rien. Une regle
   ecrite et jamais appelee est le defaut qui se relit sans se voir. */
{
  const a = atelier();
  a._panierToggle(1);                    // Maupassant (impair)
  const g = a._gouts();
  const pese = (g.auteurs['Maupassant'] || 0);
  /* Et le retrait n'ajoute rien : ce n'est pas un gout, c'est un remords. */
  a._panierToggle(1);
  const apresRetrait = (a._gouts().auteurs['Maupassant'] || 0);
  juger('Mettre un texte au panier pese 2, le retirer ne pese rien',
    pese === 2 && apresRetrait === 2,
    'apres ajout : ' + pese + ' · apres retrait : ' + apresRetrait);
}

/* --- 9. Le profil ne sort pas du navigateur --------------------------- */
{
  const a = atelier();
  a._noterGout(1, 1);
  const g = a._gouts();
  const brut = JSON.stringify(g);
  const fuite = /nom|mail|tel|token|compte|id[A-Z]/.test(brut);
  juger('Le profil de goûts ne contient rien d’identifiant',
    !fuite, 'clés : ' + Object.keys(g).join(', '));
}

const ok = resultats.filter(r => r.ok).length;
console.log('\n  ' + ok + '/' + resultats.length + ' contrôles passés\n');
process.exit(ok === resultats.length ? 0 : 1);
