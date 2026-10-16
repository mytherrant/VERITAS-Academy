#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_gabarits_lecons.cjs — LES GABARITS DE LEÇON DISENT-ILS LA MÊME
   CHOSE QUE LES ÉPREUVES, ET LE CONTRÔLE DES LEÇONS LES APPLIQUE-T-IL ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_gabarits_lecons.cjs

   CE QU'IL PROTÈGE — la consolidation du 16/10/2026 :
   ① la forme de chaque gabarit (phases, durées, grilles qui existent) ;
   ② l'accord leçon ↔ épreuve : le commentaire s'enseignait « /3 /12 /3 /2 »
     et se notait 6/6/6/2 ; le résumé ne disait ni le type ni la longueur du
     texte ; la remédiation durait 70 min quand sa source dit 2 h ;
   ③ le contrôle d'une leçon : longueur aux bornes DE LA CLASSE pour tout
     gabarit qui la déclare (seule la méthodique du 1er cycle l'était), type
     du texte (argumentatif OU explicatif pour la contraction), règle de
     l'exercice enfin affichée.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const path = require('path');
const RACINE = path.resolve(__dirname, '..');
const P = f => path.join(RACINE, f);
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => { b ? ok++ : ko++; console.log('  ' + (b ? V : X) + ' ' + m + (!b && d !== undefined ? '  → ' + d : '')); };

const M = globalThis.MINESEC = require(P('plateforme/minesec.js'));
// conformite.js s'attache à `this` (window dans la page) : on l'exécute au niveau global.
require('vm').runInThisContext(require('fs').readFileSync(P('plateforme/conformite.js'), 'utf8'), { filename: 'conformite.js' });
const C = globalThis.CONFORMITE;
const GAB = M.gabarits;
const minutes = d => { const s = String(d || ''); const h = s.match(/(\d+(?:[.,]\d+)?)\s*h/); const mn = s.match(/(\d+)\s*min/); return (h ? parseFloat(h[1].replace(',', '.')) * 60 : 0) + (mn ? +mn[1] : 0); };
const g = id => M.gabaritParId(id);

console.log(`\n${G}① La forme de chaque gabarit${R}`);
const ids = GAB.map(x => x.id);
dire(new Set(ids).size === ids.length, ids.length + ' gabarits, aucun identifiant en double');
const malFormes = GAB.filter(x => !x.nom || !['1er', '2nd', 'tous'].includes(x.cycle) || !(x.phases || []).length
  || x.phases.some(p => !p.nom || !minutes(p.duree)));
dire(!malFormes.length, 'chaque gabarit a un nom, un cycle connu et des phases datées', malFormes.map(x => x.id).join(', '));
const grillesAbsentes = GAB.filter(x => x.grille && !M.grille(x.grille));
dire(!grillesAbsentes.length, 'toute grille citée par un gabarit existe dans le référentiel', grillesAbsentes.map(x => x.id + '→' + x.grille).join(', '));
const tsFaux = GAB.filter(x => x.texteSupport && !(x.texteSupport.min < x.texteSupport.max));
dire(!tsFaux.length, 'les bornes de texte sont cohérentes (min < max)', tsFaux.map(x => x.id).join(', '));
const sans = GAB.filter(x => !x.source || !x.confiance);
dire(!sans.length, 'chaque gabarit cite sa source et son niveau de confiance', sans.map(x => x.id).join(', '));

console.log(`\n${G}② Ce qu'on enseigne est ce qui est noté${R}`);
const apc = M.grille('apc4');
const hintCom = g('commentaire').phases.map(p => p.hint).join(' ');
const nombres = (hintCom.match(/\/(\d+)/g) || []).map(x => +x.slice(1));
dire(g('commentaire').grille === 'apc4' && JSON.stringify(nombres) === JSON.stringify(apc.criteres.map(c => c.points)),
  'commentaire : le barème enseigné est la grille officielle 6/6/6/2 (plus de « /3 /12 /3 /2 »)', JSON.stringify(nombres));
['resume', 'analyse'].forEach(id => {
  const x = g(id);
  dire(JSON.stringify(x.typesTexte) === '["ARGUMENTATIF","EXPLICATIF"]' && x.texteSupport.min === 550 && x.texteSupport.max === 650
    && x.texteSupportParClasse['2nde'].min === 400 && x.texteSupportParClasse['2nde'].max === 500,
    id + ' : texte argumentatif ou explicatif, 550-650 mots (400-500 en 2nde) — comme l’épreuve');
  dire(/marge de 10 %/.test(x.regleCle) && /\/9/.test(x.regleCle), id + ' : la règle dit la marge de 10 % et le barème /9');
});
const lit = M.epreuveParCode('A_LITT');
dire(lit.texteSupport.min === g('resume').texteSupport.min && M.texteSupportPour(lit, '2nde A').max === g('resume').texteSupportParClasse['2nde'].max,
  'leçon de résumé et épreuve de Littérature ont les MÊMES bornes');
dire(GAB.filter(x => x.id !== 'discussion' && x.typesTexte).every(x => x.typesTexte.includes('EXPLICATIF')) && g('discussion').typesTexte.includes('EXPLICATIF'),
  'partout où un type de texte est exigé pour la contraction, l’explicatif est admis');
const rem = g('remediation').phases.reduce((a, p) => a + minutes(p.duree), 0);
dire(rem === 120, 'remédiation : 2 h, comme le dit sa source (« Comptes rendus (1h) · Remédiation (1h) »)', rem + ' min');
dire((g('dissertation').interdits || []).some(t => /jamais à un auteur des mots non vérifiés/.test(t)), 'dissertation : une citation de libellé se vérifie dans l’œuvre');

console.log(`\n${G}③ Le contrôle d'une leçon applique le gabarit${R}`);
const texte = n => Array.from({ length: n }, (_, i) => 'mot' + (i % 13)).join(' ');
const ecarts = (gab, classe, n, fiche) => C.verifierCours({ title: 'Leçon', classe, gabarit: gab, objAgir: 'résumer un texte', phaseContent: {} }, texte(n), fiche);
const aLongueur = l => l.some(e => /^Texte de \d+ mots$/.test(e.titre));
dire(aLongueur(ecarts('resume', 'Tle A', 381)) && !aLongueur(ecarts('resume', 'Tle A', 600)), 'résumé en Tle : 381 mots signalé, 600 accepté');
dire(!aLongueur(ecarts('resume', '2nde A', 450)) && aLongueur(ecarts('resume', '2nde A', 600)), 'résumé en 2nde : 450 accepté, 600 signalé (bornes de la CLASSE)');
dire(aLongueur(ecarts('lecture2', '1ère A', 700)), 'lecture méthodique du 2nd cycle : la longueur est enfin contrôlée');
dire(aLongueur(ecarts('lecture', '4e', 700)), 'lecture méthodique du 1er cycle : toujours contrôlée');
const ty = t => ecarts('resume', 'Tle A', 600, { type: t }).some(e => /^Texte \S+ pour contraction/.test(e.titre));
dire(!ty('ARGUMENTATIF') && !ty('EXPLICATIF') && ty('NARRATIF') && ty('POÉTIQUE'), 'type : argumentatif et explicatif admis, narratif et poétique signalés');
dire(ecarts('resume', 'Tle A', 600).some(e => e.titre === 'Règle de l’exercice' && /ordre de l’auteur/.test(e.detail)), 'la règle de l’exercice est affichée (champ jusqu’ici lu par personne)');
dire(!ecarts('resume', 'Tle A', 600).some(e => e.titre === 'Règle de l’exercice' && e.severite !== 'conseil'), 'la règle est un conseil, pas une alerte');

console.log(`\n  ${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko ? 1 : 0);
