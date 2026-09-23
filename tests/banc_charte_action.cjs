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

/* ══ ⑥ LA VITRINE : SON BOUTON PRINCIPAL ÉTAIT ORANGE, ET ILLISIBLE ═══════════
   Mesuré le 13/09/2026, en inventoriant TOUS les boutons pleins de l'accueil :
   le bouton d'action principal n'était pas l'or de la charte, mais un DÉGRADÉ
   orange #FF7A18 → #A84200 à texte blanc, sur 11 boutons — « Commencer
   maintenant », « Connexion », « Lancer un quiz »… Contraste sous le texte :
   3,88:1 ; à l'extrémité claire : 2,61:1. Le bouton le plus important du site
   ne passait pas le seuil AA. L'or n'habillait que le lien « Boutique ».

   Choix de Jacques : l'or partout (fidèle à son « change le rouge orange en
   or » du 12/08). Deux pièges, et ce contrôle les garde tous les deux :
     · les SURVOLS de ces boutons (.vh10:hover, .vh13:hover) réécrivaient
       `color:#fff` — sur or, du blanc à 1,66:1 pendant le survol ;
     · la source `tools/vitrine-bloc.css` doit suivre, sinon la prochaine
       reconstruction de vitrine.html ramène l'orange. */
titre('⑥ La vitrine : le bouton principal est l’or, au repos comme au survol');
const VITRINE_HTML = lire('vitrine.html');
const BLOC_VITRINE = lire('tools/vitrine-bloc.css');
const DEGRADE_ORANGE = /linear-gradient\(135deg,\s*#FF7A18/i;
ok('vitrine.html ne pose plus aucun dégradé orange d’action', !DEGRADE_ORANGE.test(VITRINE_HTML));
ok('la source vitrine-bloc.css non plus', !DEGRADE_ORANGE.test(BLOC_VITRINE));
ok('aucun halo orange ne subsiste sous un bouton devenu doré',
   !/rgba\(242,\s*101,\s*0,/.test(VITRINE_HTML) && !/rgba\(242,\s*101,\s*0,/.test(BLOC_VITRINE));
/* Toute surface dorée doit porter l'encre navy — dans le style ET dans ses survols. */
const surfacesOr = (VITRINE_HTML.match(/background:#FFC93C;color:#[0-9A-Fa-f]{3,6}/gi) || []);
ok('les surfaces dorées portent l’encre navy (' + surfacesOr.length + ')',
   surfacesOr.length >= 7 && surfacesOr.every((x) => /color:#001136/i.test(x)));
ok('les survols .vh10 et .vh13 n’écrivent plus de blanc sur l’or',
   !/\.vh10:hover\{[^}]*color:#fff/i.test(VITRINE_HTML)
   && !/\.vh13:hover\{[^}]*color:#fff/i.test(VITRINE_HTML));

/* ══════════════════════════════════════════════════════════════════════════
   LES ÉCRANS DE VENTE NE DESSINENT PAS AVEC DES ÉMOJIS
   ──────────────────────────────────────────────────────────────────────────
   Le tunnel d'achat des cahiers ouvrait chacun de ses écrans sur un émoji de
   38 px — 📘 pour le paiement, ⏳ pour l'attente, 🔎 pour « retrouver mon
   code », 🎉 pour le code obtenu, 🎁 pour le code ami. La devanture, elle,
   n'emploie que des icônes vectorielles. Deux dessins pour une même marque, et
   sur l'écran qui demande de l'argent c'est le moins maîtrisé des deux qui
   s'affichait : un émoji est rendu par le système du lecteur, jamais par nous,
   et un WebView Android ancien qui n'en possède pas la police affiche le
   rectangle vide « tofu » en tête de l'écran de paiement.
   On ne regarde QUE les chaînes affichées : les émojis cités dans les
   commentaires du code — dont ceux du présent bloc — ne gênent personne.
   Éprouvé par mutation le 15/09/2026 : un émoji remis à la place de l'icône
   « loupe » dans une chaîne de gate.js → 2 au rouge, la ligne fautive nommée
   ET le décompte d'icônes, qui retombe sous cinq.
   ══════════════════════════════════════════════════════════════════════════ */
titre('Les écrans de vente sont dessinés, pas émojifiés');
{
  const EMO = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}]/u;
  /* ⚠️ ON RETIRE LES COMMENTAIRES POUR DE BON, on ne les DEVINE pas.
     Première version : « une ligne sans guillemet est un commentaire ». En
     français, un commentaire sur deux porte une apostrophe — « s'ouvraient »,
     « l'élève » — et passait donc pour du code. Quatre commentaires ⚠️ de
     gate.js ressortaient en faux défauts, sur un fichier pourtant conforme.
     Un banc qui accuse à tort finit par être désactivé. On blanchit donc les
     blocs /* … *​/ et les fins de ligne //, puis on regarde ce qui reste. */
  const sansCommentaires = (src) => src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))   // les \n restent : les numéros de ligne aussi
    .replace(/(^|[^:'"`\\])\/\/[^\n]*/g, (m, p) => p);
  for (const rel of ['livrets/gate.js', 'livrets/liseur.js', 'livrets/cahier.html']) {
    const p = path.join(RACINE, rel);
    if (!fs.existsSync(p)) continue;
    const fautifs = sansCommentaires(fs.readFileSync(p, 'utf8')).split(/\r?\n/)
      .map((l, i) => ({ n: i + 1, l }))
      .filter(({ l }) => EMO.test(l));
    ok(rel + ' n’affiche aucun émoji'
       + (fautifs.length ? ' — ligne ' + fautifs.map((f) => f.n).join(', ') : ''),
       fautifs.length === 0);
  }
  // L'autre moitié : les icônes doivent bien être là, sinon « aucun émoji »
  // serait vrai d'un écran devenu vide.
  const gate = fs.readFileSync(path.join(RACINE, 'livrets', 'gate.js'), 'utf8');
  ok('et le tunnel porte son jeu d’icônes vectorielles',
     /var TRACES = \{/.test(gate) && (gate.match(/ico\('/g) || []).length >= 5);
}

/* ══ ⑦ LE PLAN DU SITE, QUE CE BANC NE REGARDAIT PAS ══════════════════════════
   `plan.html` est la page où mènent « Élèves », « Parents », « Enseignants ».
   Jusqu'au 16/09/2026 elle s'écrivait une charte à elle : une soixantaine de
   lignes de CSS, aucune icône, et une couleur d'action ORANGE, `#C2410C` —
   qui n'est d'ailleurs pas l'orange que ce banc bannissait (`ORANGE` ci-dessus
   vise `#C24E00` et `#A84300`). Deux angles morts empilés : la page n'était
   pas lue, et sa teinte n'aurait pas été reconnue.
   Jacques : « mise en page fade : aucune icône, pas de couleurs, tableaux
   disparates », puis « les vraies icônes dans les ronds, centrées comme dans
   la vitrine », puis « enlève les traits colorés de bordures ».
   Le générateur `tools/build_plan.py` porte ses propres gardes, mais la CI ne
   le lance pas : `plan.html` est versionné tel quel. C'est donc ICI, sur le
   fichier servi, que la règle doit tenir.
   ─── ÉPROUVÉ PAR MUTATION (16/09/2026), plan.html seul permuté ─────────────
   · version actuelle                          → 5 verts
   · version d'avant (git show 7afd6ff)        → 5 rouges sur 5
   · liseré rétabli `border-top:… var(--trait)` → bordure au rouge, seule
   · liseré écrit en dur `#007E11`              → bordure au rouge, seule
   · `color:#C2410C` rétabli sur « Ouvrir »     → orange + couleur étrangère
   · un <symbol> retiré                         → icônes au rouge, symbole nommé
   Le premier passage de cette épreuve a d'abord trouvé un défaut DANS le
   banc : le cas « rien n'est cassé » sortait rouge (voir `orphelins`). */
titre('⑦ Le plan du site porte la charte de la vitrine');
{
  const PLAN = lire('plan.html');
  const VITRINE = lire('vitrine.html');
  const style = (PLAN.match(/<style>([\s\S]*?)<\/style>/g) || []).join('\n');
  ok('le plan charge la feuille partagée des autres pages',
     /href="\/assets\/veritas-pages\.css\?v=/.test(PLAN));
  ok('aucun orange d’action n’y survit — ni #C2410C, ni ceux de la refonte',
     !/#C2410C/i.test(PLAN) && !ORANGE.test(style));
  const etrangeres = [...new Set(style.match(/#[0-9A-Fa-f]{6}\b/g) || [])]
    .filter((c) => !VITRINE.toUpperCase().includes(c.toUpperCase()));
  ok('chaque couleur de son style existe dans la vitrine'
     + (etrangeres.length ? ' — étrangère(s) : ' + etrangeres.join(', ') : ''),
     etrangeres.length === 0 && /#[0-9A-Fa-f]{6}/.test(style));
  const cartes = (PLAN.match(/class="pl-c"/g) || []).length;
  const ronds = (PLAN.match(/class="pl-ico"/g) || []).length;
  /* Une capture, pas `slice(n, -1)` : le premier jet comptait mal le préfixe
     `<use href="#`, gardait un guillemet dans l'identifiant, et déclarait
     TOUS les symboles absents — y compris sur la page saine. L'épreuve par
     mutation l'a vu : le cas « rien n'est cassé » sortait rouge. */
  const orphelins = [...new Set([...PLAN.matchAll(/<use href="#(lc-[a-z0-9-]+)"/g)]
    .map((m) => m[1]))].filter((id) => !PLAN.includes('<symbol id="' + id + '"'));
  ok('chaque carte a son rond, et chaque icône son dessin (' + cartes + ' cartes)'
     + (orphelins.length ? ' — symbole(s) absent(s) : ' + orphelins.join(', ') : ''),
     cartes >= 15 && ronds === cartes && orphelins.length === 0);
  /* Toute bordure est la bordure NEUTRE de la carte de la vitrine, `#E4E9F2`.
     On ne cherche pas « une variable de famille » : un liseré coloré peut
     s'écrire `var(--t)`, `var(--trait)` ou `#007E11` — la version
     intermédiaire du 16/09 l'écrivait `var(--t)`, et un contrôle qui aurait
     visé `--trait` l'aurait laissé passer. On exige donc la seule valeur
     permise, ce qui attrape toutes les autres. `border-radius` n'est pas une
     bordure : le motif ne le lit pas.
     Le bloc « vitrine:habillage » (nav, méga-menu, pied recopiés de la
     vitrine) est hors de ce contrôle : ses séparateurs gris sont ceux de la
     vitrine elle-même. Il reste soumis au contrôle des couleurs ci-dessus. */
  const styleCartes = (PLAN.match(/<style>([\s\S]*?)<\/style>/g) || [])
    .filter((b) => !b.includes('/* vitrine:habillage')).join('\n');
  const bordures = [...styleCartes.matchAll(/border(?:-(?:top|right|bottom|left))?(?:-color)?\s*:\s*([^;}]+)/g)]
    .map((m) => m[1].trim())
    .filter((v) => /var\(|#[0-9A-Fa-f]{3,8}\b/.test(v) && !/^(0|none)$/.test(v))
    .filter((v) => /var\(/.test(v) || (v.match(/#[0-9A-Fa-f]{3,8}\b/g) || [])
      .some((c) => c.toUpperCase() !== '#E4E9F2'));
  ok('aucune bordure colorée : toutes sont le trait neutre de la vitrine'
     + (bordures.length ? ' — ' + bordures.slice(0, 3).join(' | ') : ''),
     bordures.length === 0);
}

console.log('\n' + '─'.repeat(68));
if (rouge === 0) {
  console.log('\x1b[32m\x1b[1m  ✓ ' + vert + '/' + vert + ' — une seule couleur d’action.\x1b[0m');
  process.exit(0);
}
console.log('\x1b[31m\x1b[1m  ✗ ' + rouge + ' au rouge sur ' + (vert + rouge) + '.\x1b[0m');
process.exit(1);
