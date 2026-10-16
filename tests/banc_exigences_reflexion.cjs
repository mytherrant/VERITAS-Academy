#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_exigences_reflexion.cjs — CE QU'AMBASSA RÉDIGE POUR LE
   PROBATOIRE ET LE BAC EST-IL VÉRIFIÉ, OU SEULEMENT DEMANDÉ ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_exigences_reflexion.cjs

   CE QU'IL PROTÈGE — l'audit du 16/10/2026 d'une épreuve de Littérature A
   composée par Ambassa. La formation exige un résumé modèle au quart, des
   barèmes sur 9 et sur 20, le vouvoiement, les seules œuvres de la classe,
   aucune citation prêtée à un auteur. Rien n'était recompté. Ce banc
   envoie une épreuve CONFORME (aucune alerte ne doit sortir), puis la même
   épreuve gâtée défaut par défaut (chaque alerte doit sortir, seule).
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const path = require('path');
const RACINE = path.resolve(__dirname, '..');
const P = f => path.join(RACINE, f);
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => { b ? ok++ : ko++; console.log('  ' + (b ? V : X) + ' ' + m + (!b && d !== undefined ? '  → ' + d : '')); };

globalThis.MINESEC = require(P('plateforme/minesec.js'));
const GEN = require(P('plateforme/generateur.js'));

/* Un texte argumentatif de 600 mots, aux phrases distinctes : la citation de
   la discussion doit s'y retrouver mot pour mot. */
const PHRASES = [
  'La jeunesse africaine doit inventer son propre avenir.',
  'Les écrans occupent désormais les soirées des familles.',
  'Le chômage des diplômés nourrit le doute sur l’école.',
  'Certains voient dans le numérique une chance unique.',
  'D’autres redoutent une dépendance nouvelle et coûteuse.'
];
const mots = [];
for (let i = 0; mots.length < 600; i++) mots.push(...PHRASES[i % PHRASES.length].split(' '));
const TEXTE = mots.slice(0, 600).join(' ');
const COMMENTAIRE = Array.from({ length: 200 }, (_, i) => ['fleuve', 'lumière', 'pirogue', 'silence', 'rive'][i % 5] + (i % 10 === 9 ? '.' : '')).join(' ');

const struct = MINESEC.epreuveParCode('A_LITT');
const classe = 'Tle A';
const plan = GEN.planEpreuve(struct, { classe });
const ctx = { plan, struct, classe, textes: [
  { n: 1, role: 'support', type: 'ARGUMENTATIF', words: 600, text: TEXTE, reference: 'Essai, 2015' },
  { n: 2, role: 'commentaire', type: 'POÉTIQUE', words: 200, text: COMMENTAIRE, reference: 'Poème, 1960' }] };

const resume150 = Array.from({ length: 150 }, (_, i) => 'idée' + (i % 7)).join(' ');
const BAREME9 = 'Barème : compréhension et pertinence 3 pts (texte réduit 1, fidélité 1, proportions 1) + cohérence et technique 3 pts (ordre 1, connecteurs 1, convergence 1) + expression 3 pts (vocabulaire 1, orthographe 1, syntaxe 1)';
const BAREME20 = 'Barème : compréhension et pertinence 6 pts (2, 2, 2) + organisation et cohérence 6 pts (2, 2, 2) + expression 6 pts (2, 2, 2) + originalité et présentation 2 pts';
const conforme = () => ({
  titre: 'Épreuve de français', consigne: 'x', remarques: '',
  questions: [
    { texte: 1, liste: 'expl', bloc: 'p0', pts: 9, q: 'Résumez ce texte au quart de sa longueur, soit environ 150 mots, ou analysez-le au tiers. Vous indiquerez le nombre de mots employés.',
      corrige: 'Idées essentielles : 1. … 2. …\nRésumé modèle :\n' + resume150 + ' (150 mots)\n' + BAREME9 },
    { texte: 1, liste: 'expl', bloc: 'p1', pts: 9, q: '« La jeunesse africaine doit inventer son propre avenir. » Vous discuterez ce point de vue dans un développement argumenté.',
      corrige: 'Problématique… Plan… ' + BAREME9 }],
  sujets: [
    { texte: 'Vous ferez de ce texte un commentaire composé. Vous pourrez, par exemple, montrer comment le poète fait du fleuve un témoin.', corrige: 'Introduction… Plan… ' + BAREME20 },
    { texte: 'On a pu dire que le roman est un miroir de la société. Vous expliquerez, puis discuterez ce jugement en vous appuyant sur « Le Vieux Nègre et la Médaille » et sur vos lectures.', corrige: 'Introduction… Plan… ' + BAREME20 }]
});
const valider = o => GEN.validerEpreuve(o, ctx);
const alertes = r => r.controles.filter(c => !c.ok).map(c => c.libelle);
const avec = (r, re) => alertes(r).filter(l => re.test(l));

console.log(`\n${G}① Une épreuve conforme ne déclenche aucune alerte nouvelle${R}`);
const r0 = valider(conforme());
const NOUVELLES = /Résumé modèle|résumé modèle|Barème du corrigé|barème de|aucune ligne « Barème|recopié|tutoiement|attribuée|hors programme/;
dire(!avec(r0, NOUVELLES).length, 'aucune alerte de réflexion sur l’épreuve conforme', JSON.stringify(avec(r0, NOUVELLES)));
dire(r0.controles.some(c => c.ok && /Résumé modèle : 150 mots recomptés/.test(c.libelle)), 'le résumé modèle est recompté (150 mots pour 150)');
dire(!r0.aReparer.length, 'aucune consigne à réécrire', JSON.stringify(r0.aReparer.map(x => x.motif)));
dire(r0.consigne === 'Le candidat traitera l’un des 3 sujets au choix.', 'consigne générale : la phrase du descriptif', r0.consigne);

console.log(`\n${G}② Chaque défaut est trouvé${R}`);
let o = conforme();
o.questions[0].corrige = o.questions[0].corrige.replace('(150 mots)', '(150 mots)').replace(resume150, resume150 + ' ' + resume150.split(' ').slice(0, 80).join(' '));
dire(avec(valider(o), /Résumé modèle : 230 mots recomptés \(Ambassa en annonce 150\).*hors de la marge/).length === 1, 'un résumé de 230 mots annoncé « (150 mots) » est démasqué');

o = conforme(); o.questions[0].corrige = 'Idées essentielles : 1. … 2. …\n' + BAREME9;
dire(avec(valider(o), /aucun résumé modèle/).length === 1, 'un corrigé de résumé sans résumé modèle est signalé');

o = conforme(); o.questions[0].corrige = o.questions[0].corrige.replace(/^Barème.*$/m, 'Barème : compréhension 3 pts + cohérence 3 pts + expression 2 pts');
dire(avec(valider(o), /Barème du corrigé « Résumé du texte » : 8 points ventilés pour 9/).length === 1, 'un barème de 8 points pour un résumé sur 9 est signalé');

o = conforme(); o.sujets[1].corrige = 'Introduction… Plan… ' + BAREME20.replace('2 pts', '4 pts');
dire(avec(valider(o), /barème de 22 points pour un sujet sur 20/).length === 1, 'une dissertation ventilée sur 22 est signalée');

o = conforme(); o.sujets[0].corrige = 'Introduction… Plan…';
dire(avec(valider(o), /aucune ligne « Barème : … » chiffrée/).length === 1, 'un commentaire sans barème est signalé');

o = conforme(); o.questions[1].q = 'Tu discuteras ce point de vue : « La jeunesse africaine doit inventer son propre avenir. »';
let r = valider(o);
dire(r.aReparer.some(x => x.defauts.some(d => d.code === 'tutoiement')), 'une consigne qui tutoie au second cycle part en réécriture');

o = conforme(); o.questions[0].q = 'Ce texte compte 600 mots. Résume-le au quart, soit environ 150 mots.';
dire(valider(o).aReparer.some(x => x.defauts.some(d => d.code === 'tutoiement')), '« Résume-le » à la 2e phrase est vu');

o = conforme(); o.questions[1].q = 'Vous discuterez ce point de vue sur la jeunesse dans un développement argumenté.';
dire(valider(o).aReparer.some(x => x.defauts.some(d => d.code === 'discussion')), 'une discussion qui ne cite pas le texte part en réécriture');

o = conforme(); o.sujets[0].texte = COMMENTAIRE + ' Vous ferez de ce texte un commentaire composé.';
dire(avec(valider(o), /le texte y est recopié/).length === 1, 'un sujet de commentaire qui recopie le texte est signalé');

o = conforme(); o.sujets[1].texte = '« Le roman est un miroir que l’on promène le long d’un chemin. » — Victor Hugo. Vous discuterez ce jugement.';
dire(avec(valider(o), /citation attribuée à Victor Hugo/).length === 1, 'une citation attribuée à un auteur est à vérifier');

o = conforme(); o.sujets[1].texte = 'Comme l’écrit Mongo Beti, la littérature engage. Vous apprécierez cette opinion.';
dire(avec(valider(o), /citation attribuée à Mongo Beti/).length === 1, '« comme l’écrit Mongo Beti » est vu aussi');

o = conforme(); o.sujets[1].corrige = 'Exemples : « Ville cruelle » d’Eza Boto. ' + BAREME20;
dire(avec(valider(o), /Œuvre hors programme de la classe : « Ville cruelle » \(3e\)/).length === 1, 'une œuvre du 1er cycle au BAC est refusée');

o = conforme(); o.sujets[1].texte = 'Vous expliquerez ce jugement. Tu t’appuieras sur tes lectures.';
dire(avec(valider(o), /tutoiement/).length === 1, 'un sujet de dissertation qui tutoie est signalé');

console.log(`\n${G}③ Le premier cycle n'est pas concerné par le vouvoiement${R}`);
const s1 = MINESEC.epreuveParCode('BEPC_ETUDE');
dire(!GEN.diagnostiquer('Relève deux personnages du texte.', { vous: false }).some(d => d.code === 'tutoiement'), '« Relève » reste correct en 3e');
dire(!GEN.diagnostiquer('Relevez le ton ironique de l’auteur.', { vous: true }).some(d => d.code === 'tutoiement'), '« le ton » n’est pas un tutoiement');
dire(!GEN.diagnostiquer('Résumé au quart : 150 mots environ.', { vous: true }).some(d => d.code === 'tutoiement'), '« Résumé » (nom) n’est pas un impératif');
dire(!!s1, 'structure BEPC présente');

console.log(`\n  ${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko ? 1 : 0);
