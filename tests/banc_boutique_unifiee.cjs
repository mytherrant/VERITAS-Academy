#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_boutique_unifiee.cjs — UNE SEULE DEVANTURE, UN SEUL FLUX
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_boutique_unifiee.cjs

   CE QU'IL PROTÈGE
   Le centre vendait ses ouvrages à deux endroits, avec deux catalogues et deux
   parcours : les manuels par `DB.books` et la boutique de l'accueil, les
   quinze cahiers interactifs par `livrets_catalogue.json` et une page à part.
   Un client cherchant « le cahier de 4ᵉ » devait savoir lequel des deux rayons
   regarder — et rien sur l'accueil ne lui disait que le second existait.

   Les deux sortent désormais du MÊME flux (`api/public_data.php`), classés par
   rayon. Ce qui reste distinct, et doit l'être, c'est le PARCOURS d'achat : un
   manuel part en commande, un cahier ouvre un code d'accès émis au paiement
   confirmé. D'où `kind` et `url` sur chaque entrée.

   LE PIÈGE ÉVITÉ, ET QU'IL FAUT GARDER FERMÉ : sans le cas `b.url`, la carte
   d'un cahier aurait pointé `app.html#livre?id=livret:6e` — une fiche qui
   n'existe pas, le cahier ne vivant pas dans `DB.books`. Un lien mort au bout
   d'une devanture unifiée annulerait tout le bénéfice de l'unification.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const RACINE = path.resolve(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => {
  b ? ok++ : ko++;
  console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : ''));
};

console.log(`\n${G}UNE SEULE DEVANTURE, UN SEUL FLUX${R}\n`);

/* On exécute réellement l'endpoint : lire le source dirait qu'il contient du
   code pour les livrets, pas qu'il en produit. La sentinelle anti-robots
   refuse un client sans en-têtes de navigateur — on les fournit. */
/* ⚠️ LE BANC FOURNIT SES PROPRES DONNÉES, SINON IL MESURE LA MACHINE.
   Depuis le 01/09/2026, « disponible » ne veut plus dire « a une page » mais
   « le serveur peut LIVRER » : `booklet-<slug>.js` déposé, ou le dossier de
   pages du feuilletage. Or ce dossier est hors dépôt (FTP), donc absent en
   local ET sur le runner. Sans fixture, ce banc afficherait 0 cahier partout
   et rougirait sur l'état du disque au lieu de la règle — c'est exactement
   l'erreur qui a bloqué le déploiement du 26/08 sur le catalogue.
   `VRT_LIVRET_DONNEES` existe pour ça. */
const DEPOT = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-boutique-'));
const catalogue = JSON.parse(fs.readFileSync(
  path.join(RACINE, 'api', 'data', 'livrets_catalogue.json'), 'utf8')).ouvrages || {};
const deposer = (slugs) => {
  for (const f of fs.readdirSync(DEPOT)) fs.rmSync(path.join(DEPOT, f), { recursive: true, force: true });
  for (const s of slugs) fs.writeFileSync(path.join(DEPOT, 'booklet-' + s + '.js'), 'window.BOOKLET={};', 'utf8');
};

function interroger() {
  const php = "define('VRT_LIVRET_DONNEES', " + JSON.stringify(DEPOT) + ");"
    + "$_SERVER['REQUEST_METHOD']='GET';"
    + "$_SERVER['HTTP_USER_AGENT']='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36';"
    + "$_SERVER['HTTP_ACCEPT']='text/html';$_SERVER['HTTP_ACCEPT_LANGUAGE']='fr-FR';"
    + "$_SERVER['REMOTE_ADDR']='127.0.0.1';"
    + "include " + JSON.stringify(path.join(RACINE, 'api', 'public_data.php')) + ";";
  const sortie = execFileSync('php', ['-r', php], { cwd: RACINE, encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
  return JSON.parse(sortie);
}

let flux = null;
try {
  deposer(Object.keys(catalogue));      // tout est déposé : la devanture complète
  flux = interroger();
} catch (e) {
  dire(false, 'api/public_data.php répond', String(e.message).slice(0, 120));
}
dire(!!flux && !flux.error, 'api/public_data.php répond sans refus',
  flux && flux.error ? flux.error : '');
if (!flux || flux.error) { console.log(`\n${ok} au vert, ${ko} au rouge.\n`); process.exit(1); }

const boutique = flux.boutique || [];

/* ── ① Les cahiers sont dans la devanture ──────────────────────────────── */
console.log(`${G}① Les cahiers interactifs sont publiés avec les manuels${R}`);
const livrets = boutique.filter(x => x.kind === 'livret');
const attendus = Object.keys(catalogue).filter(k => (catalogue[k] || {}).prix > 0).length;
dire(livrets.length === attendus,
  'les ' + attendus + ' cahiers du catalogue sont dans le flux', 'trouvés : ' + livrets.length);
dire(livrets.every(x => x.rayon === 'Cahiers interactifs'),
  'ils portent tous leur rayon (le classement de la devanture)');

/* ── ② Chacun peut être acheté ─────────────────────────────────────────── */
console.log(`\n${G}② Chaque cahier mène à SON parcours d'achat${R}`);
dire(livrets.every(x => x.url), 'tous portent une URL d’achat');
const urlsMortes = livrets
  .map(x => (x.url || '').split('?')[0].replace(/^\//, ''))
  .filter((c, i, a) => a.indexOf(c) === i)
  .filter(c => c && !fs.existsSync(path.join(RACINE, c)));
dire(urlsMortes.length === 0, 'et cette page existe', urlsMortes.join(', '));
dire(livrets.every(x => x.prix > 0), 'aucun n’est publié sans prix');

/* ── ③ La carte suit cette porte ───────────────────────────────────────── */
console.log(`\n${G}③ La vitrine respecte la porte du produit${R}`);
const vit = fs.readFileSync(path.join(RACINE, 'assets', 'vitrine.js'), 'utf8');
dire(/if \(b\.url\) c\.lien = b\.url;/.test(vit),
  'la carte utilise l’URL fournie quand il y en a une');
const iUrl = vit.indexOf('if (b.url) c.lien = b.url;');
const iNum = vit.indexOf("c.lien = 'app.html#livre?id='");
dire(iUrl > 0 && iNum > iUrl,
  'et elle passe AVANT le cas « fiche de livre » — sinon un cahier pointerait une fiche inexistante');

/* ── ④ Les couvertures suivent ─────────────────────────────────────────── */
console.log(`\n${G}④ Les cahiers arrivent avec leur couverture${R}`);
const sansCouv = livrets.filter(x => !x.couv);
const fichiersManquants = livrets
  .filter(x => x.couv)
  .filter(x => !fs.existsSync(path.join(RACINE, x.couv.replace(/^\//, ''))));
dire(sansCouv.length === 0, 'tous portent une couverture',
  sansCouv.slice(0, 3).map(x => x.titre).join(', '));
dire(fichiersManquants.length === 0,
  'et le fichier existe pour chacune — la couverture est constatée, pas déclarée',
  fichiersManquants.slice(0, 3).map(x => x.couv).join(', '));

/* ── ⑤ ON NE VEND QUE CE QU'ON PEUT LIVRER ─────────────────────────────────
   LE GARDE-FOU ÉTAIT DEVENU DÉCORATIF SANS QU'UNE LIGNE DE SON CODE CHANGE.
   `vrt_livret_etat()` calculait `disponible = coquille || données`, et
   « coquille » voulait dire « une page-LECTEUR existe » — vrai de cinq
   ouvrages seulement. Le 31/08/2026, dix pages d'ATTERRISSAGE ont été produites
   pour le référencement : les quinze ouvrages ont eu une page, le premier terme
   est devenu vrai partout, et la condition a cessé de conditionner quoi que ce
   soit. La boutique se remettait donc à publier tout ouvrage tarifé, déposé ou
   non — précisément ce que ce calcul nommait comme l'incident à ne pas
   reproduire : « le jour où l'on a pu payer 1 000 F un livre dont le contenu
   n'était pas sur le serveur ».

   On l'éprouve là où ça se décide : on RETIRE le contenu d'un ouvrage en
   laissant sa page de vente en place, et on exige qu'il disparaisse de la
   devanture. Lire le source aurait dit que la règle est écrite ; seul ce
   retrait dit qu'elle mord.                                                  */
console.log(`\n${G}⑤ Un cahier sans contenu déposé ne se vend pas${R}`);
{
  const tous = Object.keys(catalogue);
  const temoin = tous.includes('bord-4e') ? 'bord-4e' : tous[tous.length - 1];
  const page = path.join(RACINE, 'livrets', temoin + '.html');
  dire(fs.existsSync(page),
    'le témoin « ' + temoin + ' » a bien une page de vente — c’est ce qui trompait la garde');

  deposer(tous.filter(s => s !== temoin));     // tout sauf lui
  let sansLui = null;
  try { sansLui = interroger(); } catch (e) { /* signalé ci-dessous */ }
  const restants = ((sansLui && sansLui.boutique) || []).filter(b => (b.kind || '') === 'livret');
  const ids = restants.map(b => b.id);

  dire(!!sansLui, 'l’endpoint répond toujours');
  dire(ids.indexOf('livret:' + temoin) < 0,
    'contenu retiré : il quitte la devanture, malgré sa page',
    'toujours en vente : ' + temoin);
  dire(restants.length === tous.length - 1,
    'et les ' + (tous.length - 1) + ' autres restent en vente — on ne vide pas la boutique',
    'restants : ' + restants.length);
}

try { fs.rmSync(DEPOT, { recursive: true, force: true }); } catch (e) {}

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
