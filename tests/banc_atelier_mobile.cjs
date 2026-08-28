#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_atelier_mobile.cjs — LA PLANCHE DE TRAVAIL TIENT-ELLE SUR UN
   TÉLÉPHONE ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_atelier_mobile.cjs

   CE QU'IL PROTÈGE — mesuré au navigateur sur 375 px le 28/08/2026, épreuve
   ouverte dans le composeur :

     · 842 px défilaient AVANT la première ligne du texte — un écran entier
       (819 px) rien que pour y arriver ;
     · la rangée « Structure officielle » ne s'est JAMAIS repliée : son style
       s'écrivait `{{ structureCorpsStyle }};display:flex`, et la seconde
       déclaration `display` annulait la première. 87 px perdus à chaque
       ouverture, sous un sélecteur dont l'étiquette est masquée à cette
       largeur — donc un menu déroulant anonyme ;
     · la zone de saisie d'une question faisait 184 px de large pour 36 px de
       haut, quand son contenu en demandait jusqu'à 121 : l'enseignant relisait
       le tiers de ce qu'il venait d'écrire ;
     · le texte restait justifié avec césure sur une colonne de ~250 px, ce qui
       donne « II.  Langue  et production » écartelé et « architectu-raux »
       coupé à chaque ligne.

   Après correction : 563 px avant le contenu (279 px rendus), question sur
   291 px de large et 58 px de haut, plus aucun élément justifié sous 820 px.

   Ce banc ne relance pas un navigateur : il verrouille les RÈGLES qui
   produisent ces mesures. Une règle réécrite dans le mauvais ordre, un
   `!important` retiré, et le gain repart en silence.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => {
  b ? ok++ : ko++;
  console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : ''));
};

const src = fs.readFileSync(path.join(RACINE, 'plateforme', 'index.html'), 'utf8');

console.log(`\n${G}LA PLANCHE DE TRAVAIL TIENT-ELLE SUR UN TÉLÉPHONE ?${R}\n`);

/* ── ① L'ordre des déclarations de style ───────────────────────────────── */
console.log(`${G}① Un repli qui se replie vraiment${R}`);
const ligneStruct = (src.split('\n').find(l => l.includes('{{ structureCorpsStyle }}')) || '');
dire(ligneStruct.length > 0, 'la rangée « structure » est trouvable');
const iVar = ligneStruct.indexOf('{{ structureCorpsStyle }}');
const iFlex = ligneStruct.indexOf('display:flex');
dire(iVar > 0 && iFlex > 0 && iVar > iFlex,
  '`structureCorpsStyle` est écrit APRÈS `display:flex` (sinon il est annulé)',
  'variable à ' + iVar + ', display:flex à ' + iFlex);

/* ── ② Le sélecteur de nature est nommé, et une seule fois ─────────────── */
console.log(`\n${G}② La nature de l'épreuve : un seul champ, et il est nommé${R}`);
const nbSelectCode = (src.match(/onChange="\{\{ setEpreuveType \}\}"/g) || []).length;
dire(nbSelectCode === 1, 'un seul sélecteur de nature dans toute la page',
  nbSelectCode + ' occurrence(s)');
dire(/Nature de l’épreuve<select/.test(src),
  'il porte une étiquette lisible (pas un menu anonyme)');
dire(!/setEpreuveCode/.test(src.replace(/\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/g, '')),
  'l’ancien sélecteur du garde-fou ne subsiste pas en double');
dire(/natureOptions/.test(src) && /epreuveParCode|MINESEC\.epreuves/.test(src),
  'ses options viennent du référentiel MINESEC, pas d’une liste écrite à la main');

/* ── ③ La question prend la ligne ──────────────────────────────────────── */
console.log(`\n${G}③ La question est le travail : elle prend la ligne${R}`);
const nbQrow = (src.match(/class="vrt-qrow"/g) || []).length;
dire(nbQrow === 2, 'les deux rangées de question (compréhension et langue) sont marquées',
  nbQrow + ' rangée(s)');
const regleQ = (src.match(/\.vrt-qrow > textarea\{[^}]*\}/) || [''])[0];
dire(/flex:1 1 100%!important/.test(regleQ),
  '`!important` est présent — le `flex:1` en ligne l’emporterait sinon', regleQ);
dire(/min-height:58px/.test(regleQ),
  'la zone montre plusieurs lignes au lieu d’une seule', regleQ);
dire(/\.vrt-qrow > input\{order:2;margin-left:auto\}/.test(src),
  'le champ « pts » se range en en-tête, il ne mange plus la largeur');

/* ── ④ La justification s'arrête où la colonne devient étroite ─────────── */
console.log(`\n${G}④ Plus de lézardes ni de coupures sur colonne étroite${R}`);
const blocJust = (src.match(/@media \(max-width:820px\)\{\s*main p, \.vrt-justif[^}]*\}/) || [''])[0];
dire(blocJust.length > 0, 'la règle mobile de dé-justification existe');
dire(/text-align:left!important/.test(blocJust),
  'le texte repasse au fer à gauche', blocJust.slice(0, 80));
dire(/hyphens:none/.test(blocJust), 'et la césure automatique est coupée');
dire(/main \[style\*="text-align:justify"\]/.test(src),
  'les blocs justifiés EN LIGNE sont couverts aussi — un titre en `inherit` suivait sinon son parent');
dire(/main \[style\*="text-align:center"\]\{text-align:center!important\}/.test(src),
  'ce qui est explicitement centré le reste');

/* ── ④ᵇ Le conseil qui passe doit se voir ──────────────────────────────── */
console.log(`\n${G}④ᵇ La bulle d'astuce se remarque et ne masque rien${R}`);
const bulle = (src.match(/_bulleAstuce\(titre,corps\)\{[\s\S]*?\n  \}/) || [''])[0];
dire(bulle.length > 0, '`_bulleAstuce` est trouvable');
dire(/linear-gradient\(135deg/.test(bulle),
  'elle est posée sur un dégradé bleu, plus blanche sur fond blanc');
dire(/#FFC93C/.test(bulle), 'son titre porte l’or de la maison');
dire(/matchMedia\('\(max-width:820px\)'\)/.test(bulle) && /78px/.test(bulle),
  'sur téléphone elle remonte au-dessus de la barre de navigation',
  'sinon elle la recouvre — et `pointer-events:none` fait tomber le doigt dans le vide');
dire(/pointer-events:none/.test(bulle),
  'elle n’intercepte toujours pas les clics de ce qu’elle survole');

/* ── ⑤ Ce qu'il ne faut pas refaire ────────────────────────────────────── */
console.log(`\n${G}⑤ Le piège déjà tombé une fois${R}`);
const blocEx = (src.match(/\.vrt-exrow\{[^}]*\}/) || [''])[0];
dire(!/nowrap/.test(blocEx),
  '« Compléter le devoir » ne force pas `nowrap` — le titre tomberait un mot par ligne',
  blocEx);
dire(!/\.vrt-exrow > span:nth-of-type\(2\)\{[^}]*min-width:0/.test(src),
  'ni `min-width:0` sur la colonne du titre, pour la même raison');

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
