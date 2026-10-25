/* ============================================================================
   VÉRITAS — lisibilité de la vitrine : anneaux d'icônes et textes secondaires
   ----------------------------------------------------------------------------
   25/10/2026 — « Taille de police inchangée et encore très petite à certains
   endroits. Arrière-plan des icônes coloré à certains endroits alors qu'il
   faut le cercle dessus avec fond blanc comme les autres » (Jacques).

   1. ANNEAUX. La vitrine mêlait deux systèmes : l'anneau (rond blanc, filet
      de 3 px teinté) et des ronds PLEINS — pastille pâle ou dégradé sombre
      sous un chiffre blanc. Les ronds pleins deviennent des anneaux.
   2. TEXTES SECONDAIRES. Mesuré à 390 px : ~300 textes des sections sous
      15 px (10 à 14,5 px), écrits en ligne par la maquette (`font-size:` ou
      `font:<graisse> <taille>`) ou portés par une classe (.vbq-*, .vcle-*…).
      Une feuille relève chaque taille, dans les sections seulement
      ([data-vp]) : la barre et le pied gardent les leurs.

   Utilisé par tools/build_vitrine.js (à chaque construction) et en ligne de
   commande sur vitrine.html, qui est retouché à la main depuis la maquette :
       node tools/vitrine_lisibilite.cjs vitrine.html
   Idempotent.
   ========================================================================== */
'use strict';

// Taille d'origine → taille relevée.
const TAILLES = { '10': 12, '10.5': 12.5, '11': 13, '11.5': 13.5, '12': 14, '12.5': 14.5,
  '13': 15, '13.5': 15.5, '14': 16, '14.5': 16.5, '15': 16.5, '15.5': 17 };
const GRAISSES = ['300', '400', '500', '600', '700', '800', 'italic 400', 'italic 500'];
const CLASSES = { 'vbq-cat': 13, 'vbq-type': 15, 'vbq-prix-lbl': 12.5, 'vbq-mention': 13.5,
  'vbq-fmt-papier': 13, 'vbq-fmt-ebook': 13, 'vbq-cta': 15, 'vbq-niv': 13, 'vbq-exos': 14,
  'vbq-lire': 15, 'vcle-q': 16.5, 'vcle-d': 15.5, 'vnews-tab': 14.5, 'vnews-src': 13,
  'vcal-note': 14.5, 'vcal-lien': 16 };

function cssSecondaires() {
  let css = '<style id="vrt-secondaires">\n/* Généré par tools/vitrine_lisibilite.cjs — ne pas éditer à la main. */\n';
  for (const [t, n] of Object.entries(TAILLES)) {
    const sel = ['[data-vp] [style*="font-size:' + t + 'px"]']
      .concat(GRAISSES.map(g => '[data-vp] [style*="font:' + g + ' ' + t + 'px"]'));
    css += sel.join(',') + '{font-size:' + n + 'px!important}\n';
  }
  for (const [c, n] of Object.entries(CLASSES)) css += '[data-vp] .' + c + '{font-size:' + n + 'px!important}\n';
  /* Titres plus affirmés (25/10/2026) : 600 → 700/800, comme sur toutes les
     autres surfaces (assets/veritas-harmonie.js). */
  css += '[data-vp] :is(h1,h2)[style*="font:600"]{font-weight:800!important}'
       + '[data-vp] :is(h3,h4)[style*="font:600"]{font-weight:700!important}\n';
  /* Tunnel de paiement, au téléphone : les champs « Numéro Mobile Money » et
     « Confirmer le numéro » se partageaient deux colonnes de 150 px, et leurs
     libellés se chevauchaient (relevé le 25/10/2026, antérieur à ce module).
     Une colonne sous 600 px. */
  css += '@media (max-width:600px){[data-vp] div:has(> [data-vrt-item="champsPaiement"]){grid-template-columns:1fr!important}'
       + '[data-vp] [data-vrt-item="champsPaiement"]{grid-column:1/-1!important}}\n';
  return css + '</style>\n';
}

/* Rond plein → anneau. Deux formes, relevées dans la page :
   · pastille pâle  : background:#XXXXXX;color:#TEINTE
   · dégradé sombre : background:linear-gradient(135deg,#T1,#T2);color:#fff  */
function anneaux(html) {
  const TAILLE = { 34: 44, 42: 60, 44: 48, 46: 50 };
  return html
    .replace(/width:(34|42)px;height:\1px;border-radius:50%;background:#[0-9A-Fa-f]{6};color:(#[0-9A-Fa-f]{6});/g,
      (m, w, teinte) => 'width:' + TAILLE[w] + 'px;height:' + TAILLE[w] + 'px;border-radius:50%;background:#fff;'
        + 'border:3px solid ' + teinte + ';box-sizing:border-box;color:' + (w === '42' ? '#001136' : teinte) + ';')
    .replace(/width:(44|46)px;height:\1px;border-radius:50%;background:linear-gradient\(135deg,(#[0-9A-Fa-f]{6}),#[0-9A-Fa-f]{6}\);color:#fff;/g,
      (m, w, teinte) => 'width:' + TAILLE[w] + 'px;height:' + TAILLE[w] + 'px;border-radius:50%;background:#fff;'
        + 'border:3px solid ' + teinte + ';box-sizing:border-box;color:' + teinte + ';');
}

/* 25/10/2026 — 3G (« les téléphones 3G doivent naviguer avec fluidité »).
   Trois photos de l'accueil pesaient 352 Ko : deux fonds de cartes de 172 px
   de haut servis en 748 px, et l'image principale en 1 400 px même sur un
   écran de 390 px. Versions allégées (transparence conservée) : 140 Ko.
   NOUVEAUX NOMS : .htaccess sert les images « immutable » un an — un fichier
   modifié sous le même nom ne serait jamais rechargé. */
function images(html) {
  return html
    .replace(/url\(assets\/photo-groupe\.webp\)/g, 'url(assets/photo-groupe-600.webp)')
    .replace(/url\(assets\/photo-examen\.webp\)/g, 'url(assets/photo-examen-600.webp)')
    .replace(/<img([^>]*?) src="assets\/hero-eleves\.webp"(?![^>]*srcset)/g,
      '<img$1 src="assets/hero-eleves.webp" srcset="assets/hero-eleves-800.webp 800w, assets/hero-eleves.webp 1400w" sizes="(max-width: 999px) 100vw, 640px"');
}

function appliquer(html) {
  let out = images(anneaux(html));
  out = out.replace(/<style id="vrt-secondaires">[\s\S]*?<\/style>\n?/, '');
  if (out.split('</head>').length !== 2) throw new Error('vitrine_lisibilite : </head> introuvable ou multiple.');
  return out.replace('</head>', cssSecondaires() + '</head>');
}

module.exports = { appliquer, anneaux, cssSecondaires };

if (require.main === module) {
  const fs = require('fs');
  const f = process.argv[2];
  if (!f) { console.error('usage : node tools/vitrine_lisibilite.cjs vitrine.html'); process.exit(2); }
  const avant = fs.readFileSync(f, 'utf8');
  const apres = appliquer(avant);
  fs.writeFileSync(f, apres);
  console.log('vitrine_lisibilite : ' + f + (apres === avant ? ' déjà à jour' : ' mis à jour'));
}
