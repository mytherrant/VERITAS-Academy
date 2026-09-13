#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_charte_action.cjs — UNE SEULE COULEUR D'ACTION SUR TOUT LE SITE
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

       node tests/banc_charte_action.cjs

   ─── LA RÈGLE, ET POURQUOI ELLE EXISTE ──────────────────────────────────────

   La doctrine du thème LWS tient en une phrase : UNE couleur d'action, l'or
   `#FFC93C`, réservée au geste d'achat ou d'inscription, jamais décorative — et
   l'encre navy `#001136` obligatoire dessus. Le bénéfice n'est pas esthétique,
   il se mesure : navy sur or donne 12,1:1 ; blanc sur l'orange qu'on employait
   donnait 4,79:1, soit tout juste le seuil AA.

   Mesuré le 13/09/2026 : la vitrine et les 133 pages de `veritas-pages.css`
   suivaient l'or ; les 90 pages de `veritas-refonte.css` avaient un SECOND
   bouton d'action, aplat orange `#C24E00` en pilule de 100 px, texte blanc. Une
   même marque avec deux gestes d'achat différents, et le moins lisible des deux
   sur la moitié du site.

   ─── TROIS ENDROITS, ET C'EST LE PIÈGE ──────────────────────────────────────

   Aligner la feuille ne suffisait pas. Les 90 pages se répartissent ainsi :

     · 63 pages chargent `veritas-refonte.css` AVEC `veritas-tokens.css` ;
     · 27 pages (`seo/`) la chargent SANS — et portent en plus un `<style>` EN
       LIGNE qui redéfinit `.cta` avec l'orange écrit en dur. Ces pages sont
       générées par `tools/build_seo.cjs` : c'est le GÉNÉRATEUR qu'il faut
       corriger, pas les fichiers, sinon la prochaine génération les ramène.

   D'où les replis en dur dans les `var()` de la feuille : un jeton indéfini y
   laisserait un bouton transparent, pas un bouton orange.

   ─── ÉPROUVÉ PAR MUTATION (13/09/2026) ──────────────────────────────────────
   · orange rétabli dans veritas-refonte.css   → ② au rouge (2 contrôles)
   · orange rétabli dans build_seo.cjs          → ③ au rouge (2 contrôles)
   · replis retirés des var()                   → ② au rouge (1 contrôle)
   · orange rétabli dans l'Atelier (clair)      → ⑤ au rouge
   · bleu MOYEN dans l'Atelier (sombre)         → ⑤ au rouge, mesuré à 3,42:1 —
     la preuve que ce contrôle CALCULE le contraste au lieu de relire un nom
   ════════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.dirname(__dirname);
const lire = (p) => fs.readFileSync(path.join(RACINE, p), 'utf8');

let vert = 0, rouge = 0;
const ok = (quoi, cond) => {
  if (cond) { vert++; console.log('  \x1b[32m✓\x1b[0m ' + quoi); }
  else      { rouge++; console.log('  \x1b[31m✗\x1b[0m ' + quoi); }
};
const titre = (t) => console.log('\n\x1b[1m' + t + '\x1b[0m');

/* La couleur d'action, et son encre. Écrites ici en toutes lettres : un banc
   qui lirait la valeur dans la feuille qu'il contrôle ne contrôlerait rien. */
const OR    = '#FFC93C';
const ENCRE = '#001136';
/* L'orange n'est pas banni du site — il reste une couleur de SIGNAL (alertes,
   pictogrammes). Ce qu'on interdit, c'est de le poser en FOND de bouton. */
const ORANGE = /#C24E00|#A84300/i;

/* ══ ① LA SOURCE UNIQUE PORTE LE JETON ════════════════════════════════════ */
titre('① La couleur d’action a une origine, et une seule');
const TOKENS = lire('assets/veritas-tokens.css');
ok('`veritas-tokens.css` déclare --r-cta', TOKENS.includes('--r-cta:'));
ok('et il vaut l’or ' + OR, new RegExp('--r-cta:\\s*' + OR, 'i').test(TOKENS));
ok('avec son encre navy déclarée', new RegExp('--r-cta-txt:\\s*' + ENCRE, 'i').test(TOKENS));
/* --r-action reste l'orange : c'est une ENCRE de signal, pas une surface. */
ok('--r-action reste distinct (encre de signal, pas surface de bouton)',
   /--r-action:\s*#C24E00/i.test(TOKENS));

/* ══ ② LA FEUILLE DES 90 PAGES ════════════════════════════════════════════ */
titre('② La feuille de la refonte pose l’or, pas l’orange');
const REFONTE = lire('assets/veritas-refonte.css');
/* On isole le bloc `.cta` : ailleurs dans la feuille, l'orange est légitime. */
const iCta = REFONTE.indexOf('\n.cta {');
if (iCta < 0) { console.error('bloc .cta introuvable dans veritas-refonte.css'); process.exit(2); }
const blocCta = REFONTE.slice(iCta, REFONTE.indexOf('\n.rel', iCta) >= 0
  ? REFONTE.indexOf('\n.rel', iCta) : iCta + 1200);
ok('le fond du bouton vient du jeton d’action', /background:\s*var\(--r-cta/.test(blocCta));
ok('l’encre aussi', /color:\s*var\(--r-cta-txt/.test(blocCta));
ok('aucun orange en fond de bouton', !ORANGE.test(blocCta));
ok('le rayon n’est plus une pilule', !/var\(--r-pilule\)/.test(blocCta));
/* LE PIÈGE : 27 pages chargent cette feuille sans les jetons. */
ok('les var() portent un repli en dur (27 pages n’ont pas les jetons)',
   blocCta.includes('var(--r-cta, ' + OR) && blocCta.includes('var(--r-cta-txt, ' + ENCRE));

/* ══ ③ LE GÉNÉRATEUR DES PAGES SEO ════════════════════════════════════════ */
titre('③ Le générateur des 27 pages seo suit la même règle');
const GEN = lire('tools/build_seo.cjs');
const reglesCta = (GEN.match(/\.cta(?::hover)?\{[^}]*\}/g) || []);
ok('les règles .cta du générateur ont été trouvées', reglesCta.length >= 2);
ok('aucune ne pose d’orange en fond',
   !reglesCta.some((r) => ORANGE.test(r)));
ok('toutes posent l’or et l’encre navy',
   reglesCta.filter((r) => /background:#FFC93C/i.test(r)).length >= 1
   && reglesCta.filter((r) => /color:#001136/i.test(r)).length >= 1);

/* ══ ④ CE QUI EST RÉELLEMENT SERVI ════════════════════════════════════════ */
titre('④ Et les pages générées le portent vraiment');
const seoDir = path.join(RACINE, 'seo');
const seoPages = fs.existsSync(seoDir)
  ? fs.readdirSync(seoDir).filter((f) => f.endsWith('.html') && f !== 'index.html') : [];
/* ⚠️ `seo/` EST GITIGNORÉ : un dépôt fraîchement cloné ne l'a pas, et la CI ne
   le fabrique qu'au moment du déploiement (`node tools/build_seo.cjs`, puis
   `cp -r seo deploy/`). Exiger sa présence ferait rougir ce banc partout
   ailleurs qu'après une génération — et un banc qui rougit sans défaut finit
   par ne plus être lu. On le SAUTE en le disant. Les contrôles ① à ③ portent
   sur les SOURCES, qui sont versionnées : c'est eux qui gardent la règle. */
if (seoPages.length === 0) {
  console.log('  \x1b[33m·\x1b[0m seo/ absent (gitignoré) — contrôle sauté, '
    + 'lancez `node tools/build_seo.cjs` pour l’exercer');
} else {
const fautives = seoPages.filter((f) => {
  const h = fs.readFileSync(path.join(seoDir, f), 'utf8');
  const r = (h.match(/\.cta\{[^}]*\}/) || [''])[0];
  return ORANGE.test(r);
});
ok('les ' + seoPages.length + ' pages générées portent l’or'
   + (fautives.length ? ' — fautive(s) : ' + fautives.slice(0, 4).join(', ') : ''),
   fautives.length === 0);
}

/* ══ ⑤ L'ATELIER A QUITTÉ SA CHARTE PROPRE ══════════════════════════════════
   Le 10/09/2026 une session l'avait diagnostiqué noir sur blanc dans
   plateforme/index.html : « charte propre (Open Sans / #1a72bb) + stockage
   séparé → l'Atelier se comportait comme un autre site ». Elle avait posé un
   bandeau-pont aux couleurs du site, mais laissé la charte en place.

   Les 927 couleurs de l'Atelier passent par `var(--cXXXXXX,#XXXXXX)` : c'est
   la seule voie fiable (le moteur re-sérialise les styles en rgb(), un sélecteur
   sur la valeur ne mord jamais). On remappe donc les DÉFINITIONS.

   L'orange d'action n'y devient PAS l'or : il ne sert que des gestes d'OUTIL
   (« Nouvelle épreuve », « Imprimer / PDF »), et l'or est réservé à l'achat. Il
   devient le bleu profond — ce qui évite aussi le piège du blanc-sur-or, la
   variable d'encre `--cffffff` étant partagée par toutes les surfaces blanches.

   Thème SOMBRE : l'encre du bouton y devient foncée (`--cffffff:#161f2b`). Un
   bleu moyen dessous tomberait à 3,4:1 ; d'où un bleu CLAIR (7,3:1). */
titre('⑤ L’Atelier porte la charte du site, en clair comme en sombre');
const ATELIER = lire('plateforme/index.html');
const bloc = (sel) => {
  const i = ATELIER.indexOf(sel);
  return i < 0 ? '' : ATELIER.slice(i, ATELIER.indexOf('}', i));
};
const clair  = bloc('  :root{\n    --c0e2a4f');
const sombre = bloc('  html[data-theme="sombre"]{\n    --c0e2a4f');
ok('les deux blocs de thème ont été trouvés', clair.length > 200 && sombre.length > 200);
ok('clair : le bleu primaire est celui du site (#1e499b)', /--c1a72bb:#1e499b;/i.test(clair));
ok('clair : l’action d’outil n’est plus orange', /--cf39200:#0c2a6a;/i.test(clair)
   && !/--cf39200:#f39200/i.test(clair));
ok('sombre : l’action n’est plus orange', !/--cf39200:#f0a02a/i.test(sombre));
/* Le calcul, pas l'intuition : l'encre sombre du bouton contre sa surface. */
const hex = (h) => h.replace('#', '').match(/../g).map((x) => parseInt(x, 16));
const L = (h) => hex(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92
  : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => (Math.max(L(a), L(b)) + 0.05) / (Math.min(L(a), L(b)) + 0.05);
const surfSombre = (sombre.match(/--cf39200:(#[0-9a-f]{6})/i) || [])[1];
const encreSombre = (sombre.match(/--cffffff:(#[0-9a-f]{6})/i) || [])[1];
ok('sombre : le bouton reste lisible sous son encre foncée (≥ 4,5:1)'
   + (surfSombre && encreSombre ? ' — ' + ratio(surfSombre, encreSombre).toFixed(2) + ':1' : ''),
   !!surfSombre && !!encreSombre && ratio(surfSombre, encreSombre) >= 4.5);
ok('aucun halo orange ne subsiste sous un bouton devenu bleu',
   ATELIER.indexOf('rgba(243,146,0,') < 0);
ok('la barre latérale suit (élément actif, lien, jauge)',
   /--sb-active-fg:#1e499b;/i.test(ATELIER) && /--sb-link:#1e499b;/i.test(ATELIER)
   && /--sb-bar:#1e499b;/i.test(ATELIER));
ok('le corps est en Poppins, comme le reste du site',
   /body\{[^}]*font-family:'Poppins'/.test(ATELIER));

console.log('\n' + '─'.repeat(68));
if (rouge === 0) {
  console.log('\x1b[32m\x1b[1m  ✓ ' + vert + '/' + vert + ' — une seule couleur d’action.\x1b[0m');
  process.exit(0);
}
console.log('\x1b[31m\x1b[1m  ✗ ' + rouge + ' au rouge sur ' + (vert + rouge) + '.\x1b[0m');
process.exit(1);
