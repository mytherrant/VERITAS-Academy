/* Sonde des TARIFS ANNONCÉS — Atelier de Français.
 *
 * La règle que cette sonde défend
 * -------------------------------
 * On annonce ce qu'on applique. Les cartes d'abonnement portaient leurs
 * prix, leurs quotas et leur nombre de places ÉCRITS EN DUR dans la page.
 * L'administration réglait un plafond, le serveur l'appliquait, et la carte
 * continuait d'annoncer l'ancien chiffre : l'enseignant lisait « 30 exports
 * par mois » et se voyait refuser le sixième, ou payait le montant affiché
 * et se faisait rejeter au guichet parce que le prix de référence avait
 * bougé. `?action=config` publie désormais tarifs, paliers et places, et
 * `_appliquerTarifs()` les pose sur les cartes.
 *
 * Ce que cette sonde surveille, et que rien d'autre ne surveille
 * -------------------------------------------------------------
 * 1. Le CONTRAT entre le PHP et le navigateur. Le serveur peut renommer une
 *    clé sans qu'aucune erreur ne se lève : le client lit `undefined`, garde
 *    ses valeurs en dur, et le défaut qu'on vient de corriger revient en
 *    silence. C'est exactement la divergence front/back déjà payée ailleurs.
 * 2. Le REPLI. Une sonde qui échoue ne doit pas vider la carte : mieux vaut
 *    un chiffre d'hier qu'une carte muette devant un client qui hésite.
 * 3. Le FRANÇAIS. Ces libellés sont lus par des professeurs de français.
 *    « Utilisateurs illimites » sur une carte payante est la faute que ce
 *    produit-là ne peut pas se permettre.
 *
 *   node tests/sonde_tarifs_atelier.cjs
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.resolve(__dirname, '..');
const P = f => path.join(RACINE, f);
const html = fs.readFileSync(P('plateforme/index.html'), 'utf8');
const php = fs.readFileSync(P('api/plateforme.php'), 'utf8');
const iScript = html.indexOf('<script type="text/x-dc"');

/* Le bloc applicatif est EXÉCUTÉ tel qu'il est déployé, jamais recopié :
   un test qui rejoue une copie de la logique ne prouve rien du fichier
   réellement servi. */
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

const plan = (a, id) => (a.plans || []).find(p => p.id === id);

console.log('\n  TARIFS ANNONCÉS — Atelier de Français\n');

/* --- 1. Le prix vient du serveur, pas de la page ---------------------- */
{
  const a = atelier();
  const avant = plan(a, 'ens').price;
  a._appliquerTarifs({ tarifs: { ens: 7500 } }, null);
  const apres = plan(a, 'ens').price;
  /* L'espace fine insécable (U+202F) est le séparateur français des
     milliers : on compare sur les chiffres seuls. */
  juger('Le prix affiché est celui que le serveur exige',
    avant !== apres && apres.replace(/\D/g, '') === '7500',
    'carte « Enseignant » : ' + avant + ' → ' + apres);
}

/* --- 2. Le quota annoncé est le quota appliqué ------------------------ */
{
  const a = atelier();
  a._appliquerTarifs({ paliers: { ens: { epreuves: 12 } } }, null);
  const p = plan(a, 'ens');
  const dit = (p.features || []).find(f => /épreuves \/ mois/.test(f)) || '';
  juger('Le quota annoncé sur la carte est celui que le serveur applique',
    p.quota === 12 && /^12 /.test(dit),
    'quota ' + p.quota + ' · la carte dit « ' + dit + ' »');
}

/* --- 3. Le nombre de places aussi ------------------------------------- */
{
  const a = atelier();
  a._appliquerTarifs({ places: { etab: 8, pro: -1 } }, null);
  juger('Le nombre de places vient du serveur',
    plan(a, 'etab').seats === "Jusqu'à 8 enseignants"
      && plan(a, 'pro').seats === 'Utilisateurs illimités',
    plan(a, 'etab').seats + ' · ' + plan(a, 'pro').seats);
}

/* --- 4. LE FRANÇAIS. Aucun libellé réécrit ne perd ses accents --------
   Le premier jet écrivait « 30 epreuves / mois », « Utilisateurs
   illimites », « Jusqu'a 15 enseignants ». Sur les cartes payantes d'un
   outil destiné aux professeurs de français, c'est la faute qui coûte la
   crédibilité de tout le reste. */
{
  const a = atelier();
  a._appliquerTarifs({ tarifs: { ens: 5000, etab: 30000, pro: 70000 },
    paliers: { ens: { epreuves: 30 }, etab: { epreuves: 120 }, pro: { epreuves: 400 } },
    places: { ens: 1, etab: 15, pro: -1 } }, 7);
  const tout = (a.plans || []).map(p =>
    [p.name, p.seats, p.period].concat(p.features || []).join(' | ')).join(' | ');
  const fautes = ['epreuves', 'illimites', "Jusqu'a ", 'Acces', 'Bibliotheque']
    .filter(m => tout.indexOf(m) >= 0);
  juger('Aucun libellé réécrit ne perd ses accents',
    fautes.length === 0,
    fautes.length ? 'trouvé : ' + fautes.join(', ') : 'les 5 cartes sont en français correct');
}

/* --- 5. La durée d'essai annoncée est celle du serveur ---------------- */
{
  const a = atelier();
  a._appliquerTarifs({}, 14);
  const dit = (plan(a, 'essai').features || []).find(f => /essai/i.test(f)) || '';
  const b = atelier();
  b._appliquerTarifs({}, 1);
  const un = (plan(b, 'essai').features || []).find(f => /essai/i.test(f)) || '';
  juger('La durée d’essai annoncée suit le réglage, au pluriel près',
    /^14 jours d/.test(dit) && /^1 jour d/.test(un),
    '« ' + dit +' » · « ' + un + ' »');
}

/* --- 6. Une réponse muette ne vide pas la carte -----------------------
   Le HTML pré-rendu reste la valeur par défaut. Un chiffre d'hier vaut
   mieux qu'une carte blanche devant un client qui hésite. */
{
  const a = atelier();
  const t = atelier();
  a._appliquerTarifs({}, null);
  const memes = (a.plans || []).every((p, i) => {
    const r = (t.plans || [])[i];
    return r && p.price === r.price && p.seats === r.seats && p.quota === r.quota;
  });
  juger('Une réponse vide laisse les cartes intactes, jamais muettes',
    memes, 'les ' + (a.plans || []).length + ' cartes gardent leurs valeurs par défaut');
}

/* --- 7. L'argumentaire n'est pas effacé ------------------------------- */
{
  const a = atelier();
  const avant = (plan(a, 'ens').features || []).slice();
  a._appliquerTarifs({ paliers: { ens: { epreuves: 44 } } }, null);
  const apres = plan(a, 'ens').features || [];
  const intacts = avant.filter((f, i) => !/épreuves \/ mois/.test(f) && apres[i] === f).length;
  juger('Seules les phrases qui énoncent un chiffre sont réécrites',
    apres.length === avant.length && intacts === avant.length - 1,
    intacts + '/' + (avant.length - 1) + ' avantage(s) conservés mot pour mot');
}

/* --- 8. LE CONTRAT SERVEUR. Les clés lues existent-elles côté PHP ? ---
   Le serveur peut renommer une clé sans qu'aucune erreur ne se lève : le
   client lit `undefined`, garde ses chiffres en dur, et le défaut revient
   en silence. Ce contrôle-là est le seul qui l'attrape. */
{
  const bloc = php.slice(php.indexOf("if ($action === 'config')"));
  const fin = bloc.indexOf('}\n');
  const config = bloc.slice(0, fin > 0 ? bloc.indexOf('\n}') : 4000);
  const manquantes = ['tarifs', 'paliers', 'places', 'essai']
    .filter(k => config.indexOf("'" + k + "'") < 0);
  juger('?action=config publie bien les clés que la page lit',
    manquantes.length === 0,
    manquantes.length ? 'absente(s) du PHP : ' + manquantes.join(', ')
      : 'tarifs, paliers, places, essai — toutes présentes');
}

/* --- 9. Tout plan vendu par la page a son prix côté serveur -----------
   La règle des « quatre miroirs » : un plan absent de plat_plans_atelier()
   n'est jamais reconnu actif, et un plan sans prix de référence se vend au
   montant que le client veut bien saisir. */
{
  const a = atelier();
  const vendus = (a.plans || []).map(p => p.id).filter(id => id !== 'essai');
  const m = php.match(/function plat_plans_atelier\(\)[\s\S]*?return \[([^\]]*)\]/);
  const connus = m ? (m[1].match(/'([a-z_]+)'/g) || []).map(s => s.replace(/'/g, '')) : [];
  const orphelins = vendus.filter(id => connus.indexOf(id) < 0);
  juger('Tout plan vendu par la page est connu de plat_plans_atelier()',
    orphelins.length === 0 && vendus.length > 0,
    orphelins.length ? 'vendu(s) sans miroir serveur : ' + orphelins.join(', ')
      : vendus.length + ' plan(s) vendus, tous inscrits : ' + connus.join(', '));
}

/* --- 10. Un tarif absurde n'écrase pas un prix juste ------------------ */
{
  const a = atelier();
  const avant = plan(a, 'ens').price;
  a._appliquerTarifs({ tarifs: { ens: 0 } }, null);
  juger('Un tarif nul ou négatif est ignoré, pas affiché',
    plan(a, 'ens').price === avant,
    'prix conservé : ' + plan(a, 'ens').price);
}

const ok = resultats.filter(r => r.ok).length;
console.log('\n  ' + ok + '/' + resultats.length + ' contrôles passés\n');
if (ok !== resultats.length) {
  console.log('  Échecs :');
  resultats.filter(r => !r.ok).forEach(r => console.log('    · ' + r.nom));
  console.log('');
}
process.exit(ok === resultats.length ? 0 : 1);
