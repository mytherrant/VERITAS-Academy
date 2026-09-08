/* ══════════════════════════════════════════════════════════════════════════
   tests/banc_vignettes_boutique.cjs — CHAQUE CARTE MONTRE SON OUVRAGE, UNE FOIS
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

   CE QU'IL PROTÈGE — deux pannes muettes, mesurées ensemble le 08/09/2026.

   ① LA VIGNETTE, PAS LA COUVERTURE.
      `livrets/index.html` n'affiche jamais `livret_<slug>.jpg` : il demande
      `livret_<slug>_v.jpg`, et son `img.onerror` RETIRE l'image quand elle
      manque. Les neuf cahiers d'œuvre du 2ⁿᵈ cycle n'en avaient aucune depuis
      leur mise en vente le 06/09 : neuf cartes nues dans la grille, sans une
      erreur en console, à l'endroit précis où l'on choisit ce qu'on paie.

   ② UNE PAGE, TROIS GRILLES, UN SEUL RELEVÉ.
      `var grille = document.querySelector('.grid')` rend la PREMIÈRE. Les
      cartes des deux autres n'entraient donc ni dans `deja` ni dans
      `carteDe()` : le script les croyait absentes et en ajoutait un second
      exemplaire. Mesuré en production : 41 cartes pour 28 destinations —
      TREIZE ouvrages affichés deux fois.

   Ce banc lit le DÉPÔT, pas le navigateur : il n'a besoin ni de PHP ni de
   Chrome, et il tourne en trois dixièmes de seconde à chaque déploiement.
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';

const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;

function dit(bon, msg, det) {
  if (bon) { ok++; console.log(`  ${V} ${msg}`); }
  else { ko++; console.log(`  ${X} ${msg}${det ? '  → ' + det : ''}`); }
}

console.log(`\n${G}BANC — CHAQUE CARTE MONTRE SON OUVRAGE, ET UNE SEULE FOIS${R}`);

/* ── ① Toute couverture a sa vignette ───────────────────────────────────── */
console.log(`\n${G}1. La grille demande des vignettes : elles existent toutes${R}`);
const dossier = path.join(RACINE, 'uploads', 'oeuvres');
const couvertures = fs.existsSync(dossier)
  ? fs.readdirSync(dossier).filter(f => /^livret_.*\.jpg$/.test(f) && !/_v\.jpg$/.test(f))
  : [];
dit(couvertures.length > 0, `${couvertures.length} couvertures de cahier trouvées`);

const sansVignette = couvertures.filter(
  f => !fs.existsSync(path.join(dossier, f.replace(/\.jpg$/, '_v.jpg'))));
dit(sansVignette.length === 0,
  'chacune a sa vignette `_v.jpg` — sans quoi la carte s’affiche nue',
  sansVignette.slice(0, 5).join(', ') + (sansVignette.length > 5 ? ` (+${sansVignette.length - 5})` : ''));

/* ── ② Le relevé des cartes porte sur TOUTE la page ─────────────────────── */
console.log(`\n${G}2. Le script lit les trois grilles, pas seulement la première${R}`);
const idx = fs.readFileSync(path.join(RACINE, 'livrets', 'index.html'), 'utf8');
const nbGrilles = (idx.match(/class="grid"/g) || []).length;
dit(nbGrilles >= 2, `la page compte ${nbGrilles} grilles de cartes`);

/* On mesure le CODE, parce que c'est là qu'est la règle : un relevé cantonné
   à `grille` ne verra jamais les cartes des autres grilles, et le défaut se
   constate seulement à l'écran, en comptant les doublons à la main. */
dit(/toutesGrilles\s*=\s*document\.querySelectorAll\(['"]\.grid['"]\)/.test(idx),
  'le relevé des ouvrages déjà présents parcourt toutes les grilles');
dit(/deja\[[^\]]+\]\s*=\s*1/.test(idx) && /toutesGrilles\.forEach/.test(idx),
  'et il alimente bien `deja` depuis chacune');
dit(/carteDe\s*=\s*function[\s\S]{0,400}?document\.querySelector\(['"]\.grid \.card\[data-slug=/.test(idx),
  '`carteDe()` cherche dans le document entier, pas dans la première grille');

/* ── ③ Aucune carte en dur ne double une autre ──────────────────────────── */
console.log(`\n${G}3. Aucun ouvrage n'est écrit deux fois dans la page${R}`);
const slugs = [...idx.matchAll(/data-slug="([a-z0-9-]+)"/g)].map(m => m[1]);
const vus = {}, doubles = [];
for (const s of slugs) { if (vus[s]) doubles.push(s); vus[s] = 1; }
dit(doubles.length === 0, `les ${slugs.length} cartes écrites à la main sont distinctes`,
  doubles.join(', '));

/* Chaque carte en dur doit exister au catalogue : une carte orpheline mène à
   une page de vente qui ne peut rien encaisser. */
const cat = JSON.parse(fs.readFileSync(
  path.join(RACINE, 'api', 'data', 'livrets_catalogue.json'), 'utf8')).ouvrages || {};
const inconnus = slugs.filter(s => !cat[s]);
dit(inconnus.length === 0, 'et chacune correspond à un ouvrage du catalogue',
  inconnus.join(', '));

console.log('\n' + '─'.repeat(68));
if (ko === 0) { console.log(`\x1b[32m${G}  ✓ ${ok}/${ok} — la boutique montre ce qu'elle vend.${R}\n`); process.exit(0); }
console.log(`\x1b[31m${G}  ✘ ${ko} échec(s) sur ${ok + ko}${R}\n`);
process.exit(1);
