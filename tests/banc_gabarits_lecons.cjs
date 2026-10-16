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
const hintCom = g('commentaire').phases.map(p => p.hint).join(' ') + ' ' + (g('commentaire').regleCle || '');
dire(g('commentaire').grille === 'apc4' && /compréhension et pertinence 6, organisation et cohérence 6, expression 6, originalité et présentation 2/.test(hintCom) && !/\/12/.test(hintCom),
  'commentaire : le barème enseigné est la grille officielle 6/6/6/2 (plus de « /3 /12 /3 /2 »)');
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
dire(ecarts('resume', 'Tle A', 600).some(e => e.titre === 'Règle de l’exercice' && /ordre des idées/.test(e.detail)), 'la règle de l’exercice est affichée (champ jusqu’ici lu par personne)');
dire(!ecarts('resume', 'Tle A', 600).some(e => e.titre === 'Règle de l’exercice' && e.severite !== 'conseil'), 'la règle est un conseil, pas une alerte');

console.log(`\n${G}④ Durées et déroulés : les documents de Jacques font foi${R}`);
/* « Vérification 1er cycle » : chaque séance du 1er cycle dure 55 minutes.
   Draft EST, progressions du 2nd cycle : chaque leçon vaut 1 h. */
const total = x => x.phases.reduce((a, p) => a + minutes(p.duree), 0);
const hors1 = GAB.filter(x => x.cycle === '1er' && total(x) !== 55);
dire(!hors1.length, '1er cycle : chaque séance fait 55 min', hors1.map(x => x.id + '=' + total(x)).join(', '));
const parLecon = GAB.filter(x => x.cycle === '2nd' && x.phases.every(p => /min/.test(p.duree)));
const hors2 = parLecon.filter(x => total(x) !== 60);
dire(parLecon.length >= 10 && !hors2.length, '2nd cycle : chaque leçon fait 1 h (' + parLecon.length + ' gabarits)', hors2.map(x => x.id + '=' + total(x)).join(', '));
const parSeance = GAB.filter(x => x.cycle === '2nd' && !parLecon.includes(x));
dire(parSeance.every(x => x.phases.every(p => minutes(p.duree) % 60 === 0)), 'les méthodologies en plusieurs séances comptent en heures entières');
dire(JSON.stringify(g('suivie').phases.map(p => p.nom)) === JSON.stringify(['Situation de l’extrait', 'Lecture du texte', 'Élaboration de la grille de lecture', 'Confrontation', 'Bilan']),
  'lecture suivie : les 5 étapes de la fiche, dans l’ordre');
dire(/fin|clôt/.test(g('suivie').note || '') && /fiche d’identité/.test(g('suivie').note || ''), 'la fiche d’identité vient À LA FIN de l’étude de l’œuvre, pas en ouverture');
dire(/^Lecture silencieuse par les élèves, puis lecture expressive du professeur/.test(g('lecture').phases[0].hint), 'lecture méthodique : lecture silencieuse d’abord, puis lecture du professeur');
dire(g('ee').phases.map(p => p.nom).join(' → ') === 'Découverte de la situation-problème → Analyse du corpus et production → Confrontation → Formulation de la règle → Exercices d’application',
  'expression écrite : la démarche de l’écrit de la fiche');
const e1 = n => M.epreuveParCode(n);
dire(e1('CO_1C').duree === '1 h' && e1('CO_1C').coeff === '1' && e1('ET_1C').duree === '1 h' && e1('ET_1C').coeff === '1' && e1('EE_1C').duree === '2 h' && e1('EE_1C').coeff === '2',
  'évaluations du 1er cycle : CO 1 h coef 1, étude de texte 1 h coef 1, expression écrite 2 h coef 2');
dire(e1('BEPC_ORTHO').duree === '45 min', 'le BEPC garde ses 45 min (Draft EST)');

console.log(`\n${G}⑤ Une leçon déjà écrite garde son contenu sous les bons titres${R}`);
const ps = M.phasesDuCours({ gabarit: 'suivie', phaseContent: { 0: 'fiche', 1: 'lecture', 2: 'compréhension', 3: 'bilan' } });
dire(ps[4] === 'bilan' && ps[3] === undefined && ps[2] === 'compréhension', 'lecture suivie : l’ancien « Bilan » reste sous « Bilan »', JSON.stringify(ps));
const pe = M.phasesDuCours({ gabarit: 'ee', phaseContent: { 0: 'a', 1: 'plan', 2: 'prod', 3: 'relecture' } });
dire(pe[1] === 'plan\n\nprod' && pe[2] === 'relecture' && pe[3] === undefined, 'écrit : préparation + production fusionnées, amélioration → confrontation', JSON.stringify(pe));
const neuf = { gabarit: 'suivie', phasesRev: M.PHASES_REV, phaseContent: { 3: 'confrontation' } };
dire(M.phasesDuCours(neuf)[3] === 'confrontation', 'une leçon au nouveau déroulé n’est jamais déplacée');
const ixd = require('fs').readFileSync(P('plateforme/index.html'), 'utf8');
dire(/gabarit:g\.id,phasesRev:MINESEC\.PHASES_REV,/.test(ixd), 'une leçon CRÉÉE naît au nouveau déroulé (sinon sa « Confrontation » partirait sous « Bilan »)');
dire(/this\._updateCours\(\{phaseContent:pc,phasesRev:MINESEC\.PHASES_REV\}\)/.test(ixd) && /MINESEC\.phasesDuCours\(cActive\)/.test(ixd), 'l’éditeur lit par la correspondance et écrit au nouveau déroulé');
const vieux = C.verifierCours({ title: 'L', classe: '5e', gabarit: 'suivie', objAgir: 'x', phaseContent: { 0: 'a', 1: 'b', 2: 'c', 3: 'd' } }, '');
dire(!vieux.some(e => /phase\(s\) non renseignée/.test(e.titre) && /Bilan/.test(e.quoiFaire || '')), 'le garde-fou lit aussi par la correspondance : le Bilan d’une ancienne leçon n’est pas « vide »',
  JSON.stringify(vieux.filter(e => /phase/.test(e.titre)).map(e => e.quoiFaire)));

console.log(`\n${G}⑥ Gabarits du 2nd cycle selon le guide (Jacques, 16/10/2026)${R}`);
dire(g('langue2').phases.map(p => p.nom).join(' → ') === 'Observation / découverte → Analyse → Vérification / confrontation → Formulation de la règle → Consolidation',
  'leçon de langue (2nd cycle) : les 5 étapes du guide');
dire(/quinzaine de lignes/.test(g('langue2').exigencesCorpus.join(' ')), 'leçon de langue : corpus d’une quinzaine de lignes');
dire(g('lecture2').phases.map(p => p.nom).join(' → ') === 'Lectures du texte → Observation et formulation des hypothèses → Choix des outils d’analyse → Analyse du texte → Validation des hypothèses → Bilan',
  'lecture méthodique (2nd cycle) : les 6 étapes du guide');
dire(/LITTÉRAIRE/.test(g('lecture2').texteSupport.note) && /œuvre au programme/.test(g('lecture2').texteSupport.note), 'lecture méthodique : texte littéraire de 20 à 30 lignes, œuvre au programme ou groupement');
dire(g('commentaire').phases.map(p => p.nom).join(' → ') === 'Découverte de l’épreuve → Analyse détaillée du texte → Regroupement des données par affinités → Plan détaillé',
  'commentaire : les 4 étapes du guide');
dire(/ŒUVRE INTÉGRALE AU PROGRAMME/.test(g('commentaire').exigencesCorpus.join(' ')), 'commentaire : extrait d’une œuvre au programme');
dire(/SOIT sur un problème abordé dans le texte, SOIT sur un passage précis/.test(g('discussion').regleCle) && /\/10 en 2nde/.test(g('discussion').regleCle), 'discussion : un problème du texte ou un passage ; /10 en 2nde, /9 ensuite');
dire(/\/8 en 2nde/.test(g('resume').regleCle) && /pronominalisation, nominalisation/i.test(g('resume').phases.map(p => p.hint).join(' ')), 'résumé : /8 en 2nde, techniques de contraction du guide');
dire(!!g('gt') && total(g('gt')) === 360 && /4 à 6 textes/.test(g('gt').exigencesCorpus.join(' ')), 'groupement de textes : 4 à 6 textes, 6 heures');
dire(/dialectique, analytique ou mixte/.test(g('dissertation').phases[0].hint), 'dissertation : analyse du sujet selon le type (dialectique, analytique, mixte)');
const lg = M.phasesDuCours({ gabarit: 'langue2', phasesRev: '2026-10-16', phaseContent: { 0: 'obs', 1: 'rep', 2: 'ana', 3: 'int', 4: 'conso' } });
dire(lg[1] === 'rep\n\nana\n\nint' && lg[4] === 'conso' && lg[2] === undefined, 'leçon de langue déjà écrite : repérage + analyse + interprétation regroupés sous « Analyse », réemploi → consolidation', JSON.stringify(lg));
dire(M.phasesDuCours({ gabarit: 'langue2', phasesRev: M.PHASES_REV, phaseContent: { 2: 'verif' } })[2] === 'verif', 'une leçon de langue au nouveau déroulé n’est jamais déplacée');
const e2 = M.epreuveParCode('A_LITT');
dire(/ŒUVRE INTÉGRALE AU PROGRAMME/.test(M.partiesPour(e2, 'Tle A')[1].consigne) && /PLAN DÉTAILLÉ/.test(M.partiesPour(e2, '2nde A')[1].consigne), 'structure : commentaire sur une œuvre au programme ; plan détaillé seul en 2nde');
dire(M.grille('contraction8102').total === 20 && JSON.stringify(M.grille('contraction8102').criteres.map(c => c.points)) === '[8,10,2]', 'grille de 2nde 8 / 10 / 2 au référentiel');

console.log(`\n${G}⑦ Ce qu'Ambassa reçoit pour une leçon : la norme COMPLÈTE${R}`);
(async () => {
  const nCom = M.normeDuGabarit('commentaire', 'Tle A').join('\n');
  dire(/Déroulé officiel :/.test(nCom) && /Regroupement des données par affinités \(1 h\) — Formuler deux ou trois centres d’intérêt/.test(nCom)
    && /Corpus : Extrait d’une ŒUVRE INTÉGRALE AU PROGRAMME/.test(nCom) && /Œuvres au programme de la classe : « Ngum a Jemea »/.test(nCom) && !/\.\./.test(nCom),
    'la norme porte le déroulé avec ce que chaque phase contient, le corpus exigé et les œuvres de la classe');
  dire(!/Œuvres au programme/.test(M.normeDuGabarit('langue', '5e').join(' ')), 'pas d’œuvres du 2nd cycle dans une leçon de langue du 1er cycle');
  const envoyes = [];
  const fetch0 = globalThis.fetch;
  globalThis.fetch = (u, o) => { envoyes.push(JSON.parse(o.body)); return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ text: '{}' }) }); };
  const lourd = { title: 'L', classe: 'Tle A', gabarit: 'lecture', objAgir: 'x', phasesRev: M.PHASES_REV,
    phaseContent: Object.fromEntries(M.gabaritParId('lecture').phases.map((p, i) => [i, 'é'.repeat(1500)])) };
  try { await C.analyserAvecAmbassa('cours', lourd, [{ text: 'é'.repeat(5000) }], []); } catch (e) {}
  globalThis.fetch = fetch0;
  const env = envoyes[0] || {};
  dire(Buffer.byteLength(env.prompt || '') <= 8000, 'une leçon très remplie tient sous les 8 000 octets du proxy (avant : 9 971, refusée)', Buffer.byteLength(env.prompt || ''));
  dire(/NORME DU TYPE DE LEÇON/.test(env.sysPrompt || '') && /Déroulé officiel/.test(env.sysPrompt || ''), 'l’audit envoie la norme en consigne système');
  console.log(`\n  ${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
  process.exit(ko ? 1 : 0);
})();
