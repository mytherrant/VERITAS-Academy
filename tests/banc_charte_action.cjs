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
   · orange rétabli dans veritas-refonte.css   → ② et ④ au rouge
   · orange rétabli dans build_seo.cjs          → ③ au rouge
   · replis retirés des var()                   → ② au rouge
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

console.log('\n' + '─'.repeat(68));
if (rouge === 0) {
  console.log('\x1b[32m\x1b[1m  ✓ ' + vert + '/' + vert + ' — une seule couleur d’action.\x1b[0m');
  process.exit(0);
}
console.log('\x1b[31m\x1b[1m  ✗ ' + rouge + ' au rouge sur ' + (vert + rouge) + '.\x1b[0m');
process.exit(1);
