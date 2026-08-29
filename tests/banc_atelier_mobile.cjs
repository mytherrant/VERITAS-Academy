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
dire(/main \[style\*="text-align:center"\][^{]*\{text-align:center!important\}/.test(src),
  'ce qui est explicitement centré le reste');
/* ⚠️ 28/08/2026 — LE SELECTEUR SANS ESPACE NE MATCHE RIEN.
   Mesuré dans le navigateur : `[style*="text-align:center"]` renvoie 0
   élément, `[style*="text-align: center"]` en renvoie 46. Le navigateur
   NORMALISE l'attribut `style` : ce que le gabarit écrit « text-align:center »
   est relu « text-align: center ». Toutes les règles à sélecteur d'attribut
   de ce fichier étaient donc inertes depuis leur écriture — y compris la
   dé-justification mobile que ce banc croyait vérifier, et le centrage des
   icônes présenté comme une règle de lecture de toute l'application.
   Une règle CSS qui ne matche rien ne produit ni erreur ni avertissement :
   seul un contrôle explicite la rattrape. */
dire(/\[style\*="text-align: center"\]/.test(src),
  'et la forme NORMALISÉE par le navigateur est couverte (sans elle, zéro élément)');
dire(/\[style\*="text-align: justify"\]/.test(src),
  'idem pour les blocs justifiés en ligne');
dire(/\[style\*="place-items: center"\]/.test(src),
  'idem pour le centrage des icônes dans leur pastille');

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

/* ── ⑥ Un panneau déjà rempli rend sa place au texte ───────────────────── */
console.log(`\n${G}⑥ Les renseignements se replient une fois saisis${R}`);
/* Établissement, classe, série, durée, coefficient, nature, consigne se
   saisissent UNE FOIS. Ensuite ce panneau occupait le haut de la colonne
   pendant toute la rédaction — un tiers d'écran sur téléphone — alors que
   personne n'y touche plus. Il se referme désormais de lui-même, en portant
   le RÉSUMÉ de ce qu'il contient : on ne cache rien, on résume. */
function extraireM(s, entete) {
  const i = s.indexOf(entete);
  if (i < 0) return null;
  let prof = 0;
  const j = s.indexOf('{', i);
  if (j < 0) return null;
  for (let k = j; k < s.length; k++) {
    if (s[k] === '{') prof++;
    else if (s[k] === '}') { prof--; if (prof === 0) return s.slice(i, k + 1); }
  }
  return null;
}
const mCorps = ['_renseignementsComplets(ep){', '_resumeRenseignements(ep){',
  '_repliAuto(cle, ferme, ouvert, complets, resume){']
  .map(e => extraireM(src, e));
dire(mCorps.every(Boolean), 'les trois fonctions du repli automatique existent');

if (mCorps.every(Boolean)) {
  const o = new Function('return ({' + mCorps.join(',') + '});')();

  const plein = { title: 'Devoir de lecture', classe: '3ᵉ', serie: 'A4',
    duree: '2 h', coeff: '2', date: 'Trimestre 1' };
  const vide = { title: '', classe: '', duree: '', coeff: '' };
  dire(o._renseignementsComplets(plein) === true, 'un panneau renseigné est reconnu complet');
  dire(o._renseignementsComplets(vide) === false, 'un panneau vide ne l’est pas');
  dire(o._renseignementsComplets({ title: 'Devoir', classe: '3ᵉ', duree: '', coeff: '2' }) === false,
    'un seul champ manquant suffit à le déclarer incomplet');
  dire(o._renseignementsComplets(null) === false, 'aucune épreuve ouverte → incomplet');

  const res = o._resumeRenseignements(plein);
  dire(/3ᵉ/.test(res) && /2 h/.test(res) && /coef 2/.test(res),
    'le résumé porte la classe, la durée et le coefficient', res);
  dire(!/·\s*·/.test(res) && !/^·|·$/.test(res.trim()),
    'et ne laisse pas de séparateur orphelin quand un champ manque',
    o._resumeRenseignements({ classe: '3ᵉ', duree: '', coeff: '' }));

  /* L'état par défaut se DÉDUIT du contenu ; le clic de l'enseignant
     l'emporte ensuite — sinon le panneau se refermerait sous ses doigts. */
  o.setState = () => {};
  o.state = { renseignementsOpen: null };
  dire(o._repliAuto('renseignements', 'F', 'O', true, 'r').renseignementsCorpsStyle === 'display:none',
    'complet et jamais touché → replié');
  dire(o._repliAuto('renseignements', 'F', 'O', false, '').renseignementsCorpsStyle === '',
    'incomplet et jamais touché → ouvert, pour qu’on le remplisse');
  o.state = { renseignementsOpen: true };
  dire(o._repliAuto('renseignements', 'F', 'O', true, 'r').renseignementsCorpsStyle === '',
    'rouvert à la main → reste ouvert malgré la complétude');
  o.state = { renseignementsOpen: false };
  dire(o._repliAuto('renseignements', 'F', 'O', false, '').renseignementsCorpsStyle === 'display:none',
    'refermé à la main → reste fermé malgré l’incomplétude');
  o.state = { renseignementsOpen: null };
  dire(/·\s*r$/.test(o._repliAuto('renseignements', 'F', 'O', true, 'r').renseignementsToggleLabel),
    'le bouton refermé porte le résumé');
}

dire(/class="vrt-repli-corps vrt-repli-auto"/.test(src),
  'le panneau des renseignements porte bien la classe du repli automatique');
dire(/\.vrt-repli-corps:not\(\.vrt-repli-auto\)\{display:block!important\}/.test(src),
  'et la règle grand écran ne le force plus ouvert — sinon le clic serait sans effet');

/* ── ⑦ Le garde-fou de conformité s'ouvre quand il proteste ────────────── */
console.log(`\n${G}⑦ Le contrôle de la norme ne prend la place que s'il a à dire${R}`);
/* Il restait déplié en permanence sur grand écran, pour annoncer la plupart du
   temps que tout va bien. Un garde-fou muet n'a pas besoin de place — c'est
   quand il proteste qu'il doit se voir. */
dire(/const confEstOuvert = \(st\.confOpen === null \|\| st\.confOpen === undefined\)/.test(src),
  'son état par défaut se déduit, au lieu d’être figé');
dire(/\?\s*\(confAControler > 0\)/.test(src),
  'ouvert seulement s’il existe au moins un écart à montrer');
/* `resume()` compte les CONSEILS dans `total`, alors que le titre du panneau
   n'annonce que les écarts. S'en remettre à `total` faisait dire au bouton
   « Analyser 4 écarts » sous un titre annonçant « 2 écart(s) à la norme », et
   ouvrait le panneau pour une simple suggestion. */
dire(/const confAControler = \(confRes\.bloquants \|\| 0\) \+ \(confRes\.ecarts \|\| 0\);/.test(src),
  'et ce compte exclut les simples conseils — sinon il contredirait le titre');
/* Le fichier écrit ses accents tantôt en clair, tantôt en séquence Unicode
   (`écart`) : le test doit accepter les deux, sinon il rougit pour une
   question d'encodage et non de comportement. */
dire(/Analyser '\+confAControler\+' (écart|\\u00e9cart)/.test(src),
  'le bouton d’analyse annonce le MÊME nombre que le titre');
dire(/:\s*!!st\.confOpen;/.test(src),
  'et le clic de l’enseignant l’emporte ensuite');
dire(/confOpen:null,confIA:null/.test(src),
  'l’état initial est bien `null` (automatique), plus `!_petitEcran()`');
dire(!/structureCorpsStyle:st\.confOpen/.test(src),
  'la structure officielle suit le même état — pas l’ancien drapeau');
dire(!/confToggleLabel:st\.confOpen/.test(src) && !/confToggle:\(\)=>this\.setState\(\{confOpen:!st\.confOpen\}\)/.test(src),
  'le bouton aussi, sinon son libellé mentirait sur ce qu’il fait');

/* ── ⑧ La barre d'actions coulissante ──────────────────────────────────── */
console.log(`\n${G}⑧ Les gestes du composeur sont à portée de pouce${R}`);
/* Ils étaient dispersés : ajouter un texte au bas du corpus, appliquer le
   barème dans la carte de conformité, exporter tout en bas de la colonne de
   droite — laquelle passe SOUS la planche sur un écran étroit. Chacun
   demandait de faire défiler quatre mille pixels, puis de revenir. */
dire(/class="vrt-only-sm vrt-actions-cl"/.test(src),
  'la barre existe et ne paraît que sur téléphone');
dire(/\.vrt-actions-cl\{display:flex!important;gap:8px;overflow-x:auto;/.test(src),
  'elle glisse horizontalement au lieu de couper ses boutons');
dire(/scroll-snap-type:x proximity/.test(src),
  'et une puce ne reste jamais à moitié visible');
dire(/min-height:44px/.test(src),
  'les puces atteignent la cible tactile de 44 px');
dire(/white-space:nowrap/.test((src.match(/actClStyle:[\s\S]{0,400}/) || [''])[0]),
  'leur libellé ne se coupe pas en deux lignes');
const barre = (src.match(/vrt-actions-cl">([\s\S]*?)<\/div>/) || ['', ''])[1];
['goListe', 'appliquerBareme', 'confAmbassa', 'generate', 'exportWord', 'submitReview']
  .forEach(h => dire(new RegExp('\\{\\{ ' + h + ' \\}\\}').test(barre),
    'elle porte l’action `' + h + '`'));

console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko === 0 ? 0 : 1);
