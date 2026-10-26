#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_planche_mobile.cjs — SUR TÉLÉPHONE, LE TEXTE ET LES QUESTIONS
   PASSENT-ILS AVANT LES BANDEAUX ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_planche_mobile.cjs

   CE QU'IL PROTÈGE — mesuré au composeur le 16/10/2026 (375 × 812, BEPC, un
   texte de 220 mots, six questions) : texte à 1 894 px, première question à
   3 501 px. Après correction : 884 et 2 210 px, sans défilement horizontal.
   Mesures faites au navigateur (banc_atelier.cjs) ; ce banc garde les
   RÈGLES qui les produisent, sans navigateur :
   ① le volet « Renseignements » ne se déplie plus de lui-même par-dessus le
     texte sur téléphone (il le fait toujours sur ordinateur) ;
   ② la bulle d'astuces ne recouvre pas les deux planches de travail ;
   ③ la feuille de style : piste `minmax(0,1fr)` (la rangée d'outils
     élargissait la page à 481 px), rembourrages du texte, saisie à la
     hauteur du contenu — le tout sous requête de média, jamais sur
     ordinateur.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const RACINE = path.resolve(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => { b ? ok++ : ko++; console.log('  ' + (b ? V : X) + ' ' + m + (!b && d !== undefined ? '  → ' + d : '')); };

const html = fs.readFileSync(path.join(RACINE, 'plateforme/index.html'), 'utf8').replace(/\r\n/g, '\n');
/* Extrait une méthode de la classe par son nom (corps équilibré en accolades). */
function methode(nom) {
  const i = html.indexOf('\n  ' + nom + '(');
  if (i < 0) return null;
  let j = html.indexOf('{', i), prof = 0, k = j;
  for (; k < html.length; k++) { if (html[k] === '{') prof++; else if (html[k] === '}' && --prof === 0) break; }
  const sig = html.slice(i + 3, j).trim();
  const args = sig.slice(sig.indexOf('(') + 1, sig.lastIndexOf(')'));
  return new Function(...args.split(',').map(x => x.trim()).filter(Boolean), html.slice(j + 1, k));
}
const fenetre = large => ({ matchMedia: q => ({ matches: /max-width:820px/.test(q) ? !large : false }) });

console.log(`\n${G}① Le volet « Renseignements » ne passe plus devant le texte${R}`);
const repli = methode('_repliAuto');
dire(!!repli, '_repliAuto se lit dans le gabarit');
const ouvert = (large, complets, travail, brut) => {
  global.window = fenetre(large);
  const o = repli.call({ state: { renseignementsOpen: brut }, setState() {} }, 'renseignements', 'Renseignements', 'Masquer', complets, 'résumé', travail);
  return o.renseignementsCorpsStyle === '';
};
dire(!ouvert(false, false, true), 'téléphone, champs incomplets, un texte présent : volet REPLIÉ');
dire(ouvert(false, false, false), 'téléphone, épreuve sans texte : le volet se déplie pour qu’on la renseigne');
dire(ouvert(true, false, true), 'ordinateur : inchangé, le volet incomplet reste déplié (il est À CÔTÉ du texte)');
dire(ouvert(false, false, true, true), 'le choix de l’enseignant l’emporte : ouvert à la main, il reste ouvert');
dire(/'à compléter'\]\.filter\(Boolean\)/.test(html), 'replié, son bouton dit qu’il reste des champs « à compléter »');

console.log(`\n${G}② La bulle d'astuces ne couvre pas la planche${R}`);
const astuce = methode('_montrerAstuce');
let montree = 0;
const lancer = (ecran, large) => {
  montree = 0;
  global.window = fenetre(large); global.document = { hidden: false, getElementById: () => null };
  try { astuce.call({ state: { screen: ecran }, _astuces: () => { montree++; return []; } }); } catch (e) {}
  return montree > 0;
};
dire(!lancer('composeur', false) && !lancer('coursEdit', false), 'téléphone : aucune astuce au composeur ni à l’éditeur de cours');
/* Règle du 26/10/2026 (audit d'usage) : sur téléphone, la bulle (89 px)
   s'ajoutait à la barre d'onglets (71 px) sur TOUS les écrans. Plus
   d'astuce au téléphone, ni sur l'accueil où l'on s'oriente. */
dire(!lancer('liste', false) && !lancer('accueil', false), 'téléphone : aucune astuce, sur aucun écran');
dire(!lancer('accueil', true), 'ordinateur : aucune astuce sur l’accueil');
dire(lancer('composeur', true) && lancer('liste', true), 'ordinateur : l’astuce reste au composeur et au corpus');

console.log(`\n${G}③ La feuille de style${R}`);
const bloc = (html.match(/L'ESPACE DE TRAVAIL D'ABORD[\s\S]*?@media screen and \(max-width:560px\)\{[\s\S]*?\n  \}/) || [''])[0];
dire(/\.vrt-col2\{grid-template-columns:minmax\(0,1fr\)!important\}/.test(html) && !/\.vrt-col2\{grid-template-columns:1fr!important\}/.test(html),
  'piste minmax(0,1fr) : une rangée qui défile n’élargit plus la page');
dire(/@media screen and \(max-width:820px\)\{[\s\S]*\.vrt-txtcarte\{padding:11px 10px!important/.test(bloc) && /\.vrt-txtcorps\{padding:10px 9px!important/.test(bloc),
  'rembourrages du texte resserrés, SOUS requête de média');
dire(/field-sizing:content/.test(bloc) && /min-height:36px!important/.test(bloc), 'la saisie d’une question prend la hauteur de son contenu');
dire(/#vrt-composer:not\(:has\(> :nth-child\(2\)\)\)\{display:none!important\}/.test(bloc), '« Composer avec Ambassa » fermé ne double plus « Générer » sur téléphone');
const classes = ['vrt-txtcarte', 'vrt-txtcorps', 'vrt-annot', 'vrt-titrelbl', 'vrt-confsrc'];
const absentes = classes.filter(c => !new RegExp('class="[^"]*\\b' + c + '\\b').test(html));
dire(!absentes.length, 'les cinq classes visées existent dans le gabarit (sinon la règle ne mord sur rien)', absentes.join(', '));
const horsMedia = html.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
dire(!/\.vrt-txtcarte\{|\.vrt-txtcorps\{|\.vrt-annot\{/.test(horsMedia), 'aucune de ces règles n’existe hors requête de média : l’ordinateur est intact');

console.log(`\n${G}④ Pas de « Compréhension » sans compréhension (capture du 16/10/2026)${R}`);
/* 20/10/2026 : la règle s'étend à TOUTE structure sans compréhension
   (correction orthographique, dictée, expression écrite…), et les questions
   du corpus ne sont plus reprises par défaut quand la structure n'a pas la
   rubrique (« compréhension et langue reviennent à toutes les épreuves »). */
dire(/compZone:\(sansComp\|\|estCom\|\|\(\(sansCompStruct\|\|\(\(\)=>\{const r=this\._rubriquesPrevues\(active\);return r&&!r\.comp;\}\)\(\)\)&&!this\._qListOf\(active,f,'comp'\)\.length\)\)\?hidden:''/.test(html),
  'une structure sans points de compréhension masque la zone — sauf si des questions y existent déjà');
dire(/const r=this\._rubriquesPrevues\(ep\);if\(r&&!r\[kind\]\)return \[\];/.test(html),
  'les questions du corpus ne sont reprises que si la structure prévoit la rubrique');
dire(/const sansCompStruct=!!\(planAct&&planAct\.support==='texte'&&!planAct\.comp\.points\);/.test(html), 'le critère est la structure, pas le seul cas de la contraction');
dire(/titreExpl:this\._titreLangueSeule\(stru,a\.classe\)\|\|undefined/.test(html) && /\['expl',tl\|\|'II\. Langue et production'\]/.test(html),
  'l’export Word et le corrigé ne titrent plus « II. » une épreuve sans partie I');
globalThis.MINESEC = require(path.join(RACINE, 'plateforme/minesec.js'));
const GENp = require(path.join(RACINE, 'plateforme/generateur.js'));
['A_LANGUE', 'CDETI_LANGUE', 'STT'].forEach(c => {
  const pl = GENp.planEpreuve(MINESEC.epreuveParCode(c), { classe: 'Tle A' });
  dire(pl.support === 'texte' && !pl.comp.points, c + ' : aucune compréhension dans la structure (la zone sera masquée)');
});

console.log(`\n  ${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko ? 1 : 0);
