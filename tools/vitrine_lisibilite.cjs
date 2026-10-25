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

function appliquer(html) {
  let out = anneaux(html);
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
