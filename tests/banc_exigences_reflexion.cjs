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

console.log(`\n${G}② Ce qui se répare est réparé ; le reste est signalé${R}`);
const repare = r => r.controles.filter(c => c.ok && /^Réparé automatiquement/.test(c.libelle)).map(c => c.libelle).join(' ');
let o = conforme();
o.questions[0].corrige = o.questions[0].corrige.replace(resume150, resume150 + ' ' + resume150.split(' ').slice(0, 80).join(' '));
let r = valider(o);
dire(avec(r, /Résumé modèle : 230 mots recomptés pour 150 attendus — hors de la marge/).length === 1 && /\(230 mots\)/.test(r.questions[1].expl[0].corrige),
  'un résumé de 230 mots annoncé « (150 mots) » : l’annonce est corrigée, le dépassement signalé');

o = conforme(); o.questions[0].corrige = o.questions[0].corrige.replace('(150 mots)', '(140 mots)');
r = valider(o);
dire(/\(150 mots\)/.test(r.questions[1].expl[0].corrige) && !avec(r, /Résumé modèle/).length && /nombre de mots du résumé modèle/.test(repare(r)),
  'une annonce fausse dans la marge est corrigée sans alerte');

o = conforme(); o.questions[0].corrige = 'Idées essentielles : 1. … 2. …\n' + BAREME9;
dire(avec(valider(o), /aucun résumé modèle/).length === 1, 'un corrigé de résumé sans résumé modèle est signalé');

o = conforme(); o.questions[0].corrige = o.questions[0].corrige.replace(/^Barème.*$/m, 'Barème : compréhension 3 pts + cohérence 3 pts + expression 2 pts');
r = valider(o);
dire(!avec(r, /Barème/).length && /expression 3 pts \(vocabulaire personnel 1/.test(r.questions[1].expl[0].corrige) && !/expression 2 pts/.test(r.questions[1].expl[0].corrige),
  'un barème de 8 points pour un résumé sur 9 est remplacé par le barème officiel');

o = conforme(); o.questions[0].corrige = o.questions[0].corrige.replace(/^Barème.*$/m, 'Barème : compréhension et pertinence 3 pts (texte réduit 1, fidélité au texte 1, proportions respectées 1) + cohérence et technique 3 pts (ordre des idées et système d’énonciation 1, enchaînement et connecteurs 1, idées convergentes 1) + expression 3 pts (vocabulaire personnel 1, o');
r = valider(o);
dire(/syntaxe 1\)$/.test(r.questions[1].expl[0].corrige) && (r.questions[1].expl[0].corrige.match(/Barème/g) || []).length === 1,
  'un barème TRONQUÉ (cas réel du 16/10) est remplacé, pas doublé');

o = conforme(); o.sujets[1].corrige = 'Introduction… Plan… ' + BAREME20.replace('2 pts', '4 pts');
r = valider(o);
dire(!avec(r, /barème/i).length && /originalité et présentation 2 pts$/.test(r.sujets.find(x => x.genre === 'dissertation').corrige), 'une dissertation ventilée sur 22 reçoit le barème officiel');

o = conforme(); o.sujets[0].corrige = 'Introduction… Plan…';
r = valider(o);
dire(!avec(r, /barème/i).length && /progression vers le thème structurateur 2/.test(r.sujets.find(x => x.genre === 'commentaire').corrige), 'un commentaire sans barème reçoit le barème officiel');

o = conforme(); o.questions[1].q = 'Tu discuteras ce point de vue : « La jeunesse africaine doit inventer son propre avenir. »';
r = valider(o);
dire(r.aReparer.some(x => x.defauts.some(d => d.code === 'tutoiement')), 'une consigne qui tutoie au second cycle part en réécriture');

o = conforme(); o.questions[0].q = 'Ce texte compte 600 mots. Résume-le au quart, soit environ 150 mots.';
/* Depuis le 16/10 (vouvoyer) : corrigé SUR PLACE, sans appel de réécriture. */
r = valider(o);
dire(/Résumez-le au quart/.test(r.questions[1].expl[0].q) && !r.aReparer.some(x => x.defauts.some(d => d.code === 'tutoiement')),
  '« Résume-le » à la 2e phrase est vouvoyé sur place (« Résumez-le »), sans appel d’IA', r.questions[1].expl[0].q);
dire(GEN.tutoie('Ce texte compte 600 mots. Résume-le au quart.'), 'le détecteur, lui, voit toujours « Résume-le » à la 2e phrase');

/* Guide du 2nd cycle : la discussion porte « soit sur un problème abordé
   dans le texte, soit sur un passage précis » — citer n'est pas exigé. */
o = conforme(); o.questions[1].q = 'Vous exprimerez un avis argumenté sur la place des écrans dans la vie des familles, en vous appuyant sur votre expérience et sur vos lectures.';
dire(!valider(o).aReparer.length, 'une discussion sur un PROBLÈME du texte, sans citation, est acceptée (guide du 2nd cycle)');
o = conforme(); o.questions[1].q = '« La jeunesse africaine doit inventer son avenir à tout prix. » Vous exprimerez un avis argumenté.';
dire(valider(o).aReparer.some(x => x.defauts.some(d => d.code === 'citation')), 'mais un passage cité doit l’être mot pour mot');

o = conforme(); o.sujets[0].texte = COMMENTAIRE + ' Vous ferez de ce texte un commentaire composé. Vous montrerez comment le fleuve devient témoin.';
r = valider(o);
dire(r.sujets.find(x => x.genre === 'commentaire').texte === 'Vous ferez de ce texte un commentaire composé. Vous montrerez comment le fleuve devient témoin.' && !avec(r, /recopié/).length,
  'le texte recopié dans le sujet de commentaire est retiré, la consigne reste');

o = conforme(); o.sujets[0].texte = 'Dans ce poème consacré au fleuve et à ses rives, montrez avec précision comment le passage « ' + COMMENTAIRE.split(' ').slice(20, 60).join(' ') + ' » installe le silence. Vous ferez un commentaire composé.';
dire(avec(valider(o), /passages du texte y sont recopiés/).length === 1, 'un long passage du texte recopié au milieu du sujet reste signalé');

console.log(`\n${G}③ Rejeu de l’épreuve réelle du 16/10/2026 (Littérature A, Tle)${R}`);
/* Ce qu'Ambassa a renvoyé : la Présentation glissée dans le bloc du résumé,
   un barème tronqué, « (95 mots) » sous un résumé de 104 mots, une
   discussion « À partir de l'affirmation : « … », discutez », une
   citation à un mot près dans le corrigé, des remarques sur la longueur. */
const R95 = Array.from({ length: 104 }, (_, i) => 'mot' + (i % 9)).join(' ');
const reel = {
  titre: 'x', consigne: 'L’épreuve comporte deux parties dont la première est obligatoire.',
  remarques: 'Le texte 1 est légèrement court (381 mots) pour un texte argumentatif de Terminale, mais reste dans la marge. Le texte 2 pour le commentaire composé est incomplet. Vérifiez la date de la citation de Mveng.',
  questions: [
    { texte: 1, liste: 'expl', bloc: 'p0', pts: 9, q: 'Résumez ce texte au quart de sa longueur, soit environ 150 mots. Vous indiquerez le nombre de mots employés.',
      corrige: 'Idées essentielles : 1. …\nRésumé modèle :\n' + R95 + ' (95 mots)\nBarème : compréhension et pertinence 3 pts (texte réduit 1, fidélité au texte 1) + cohérence et technique 3 pts (ordre 1, connecteurs 1, convergence 1) + expression 3 pts (vocabulaire personnel 1, o' },
    { texte: 1, liste: 'expl', bloc: 'p1', pts: 9, q: 'À partir de l’affirmation de l’auteur : « La jeunesse africaine doit inventer son propre avenir. Les écrans occupent désormais les soirées des familles. Le chômage des diplômés nourrit le doute sur l’école. », discutez ce point de vue dans un développement argumenté.',
      corrige: 'Problématique… Introduction : l’auteur affirme que « la jeunesse africaine doit inventer son avenir » et nous invite… Plan détaillé : I. … II. …' },
    { texte: 1, liste: 'expl', bloc: 'p0', pts: 2, q: 'Présentation et perfectionnement de la copie.', corrige: 'Propreté, lisibilité.' }],
  sujets: conforme().sujets
};
/* Le texte réel comptait 381 mots : résumé au quart = 95. */
const T381 = mots.slice(0, 381).join(' ');
const ctx381 = Object.assign({}, ctx, { textes: [Object.assign({}, ctx.textes[0], { words: 381, text: T381 }),
  Object.assign({}, ctx.textes[1], { title: 'Le Vieux Nègre et la Médaille', reference: 'Ferdinand Oyono, Le Vieux Nègre et la Médaille' })] });
const rr = GEN.validerEpreuve(reel, ctx381);
const exp = rr.questions[1].expl;
dire(exp.length === 2 && exp[0].pts === 9 && exp[1].pts === 9, 'la « Présentation » parasite est retirée du bloc du résumé : 9 + 9 points', JSON.stringify(exp.map(x => x.pts)));
dire(!rr.aReparer.length, '« À partir de l’affirmation : « … », discutez » est reconnu comme consigne', JSON.stringify(rr.aReparer.map(x => x.motif)));
dire(/« La jeunesse africaine doit inventer son propre avenir »/.test(exp[1].corrige), 'la citation « à un mot près » du corrigé est recalée mot pour mot sur le texte', exp[1].corrige.slice(0, 160));
dire(/\(104 mots\)/.test(exp[0].corrige) && (exp[0].corrige.match(/Barème/g) || []).length === 1 && /syntaxe 1\)$/.test(exp[0].corrige), 'résumé modèle : 104 mots annoncés, barème officiel complet');
dire(/Barème : compréhension et pertinence 3 pts \(type de production 1/.test(exp[1].corrige), 'le corrigé de la discussion reçoit son barème officiel');
dire(rr.remarques === 'Vérifiez la date de la citation de Mveng.', 'remarques : les commentaires de longueur d’Ambassa sont retirés, le reste gardé', rr.remarques);
const restantes = alertes(rr);
dire(restantes.length === 1 && /Texte de la contraction : argumentatif, 381 mots au lieu de 550-650/.test(restantes[0]),
  'une SEULE alerte reste : la longueur du texte, que le corpus ne peut pas fournir', JSON.stringify(restantes));
dire(rr.consigne === 'Le candidat traitera l’un des 3 sujets au choix.', 'la consigne « deux parties dont la première est obligatoire » est remplacée');

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

console.log(`\n${G}④ Texte de la contraction : argumentatif OU explicatif (Jacques, 16/10/2026)${R}`);
const avecType = ty => GEN.validerEpreuve(conforme(), Object.assign({}, ctx, { textes: [Object.assign({}, ctx.textes[0], { type: ty }), ctx.textes[1]] }));
dire(!avec(avecType('EXPLICATIF'), /Texte de la contraction/).length, 'un texte EXPLICATIF de 600 mots est accepté');
dire(avec(avecType('NARRATIF'), /narratif au lieu d’argumentatif ou explicatif/).length === 1, 'un texte NARRATIF est refusé, et le message cite les deux types admis');
const cands = [
  { n: 91, level: 'Tle', type: 'NARRATIF', words: 600, text: TEXTE, title: 'Récit' },
  { n: 92, level: 'Tle', type: 'EXPLICATIF', words: 600, text: TEXTE, title: 'Exposé' },
  { n: 93, level: 'Tle', type: 'ARGUMENTATIF', words: 600, text: TEXTE, title: 'Essai' }];
/* `alea` FIXÉ : le classement ajoute exprès 0 à 6 points au hasard pour varier
   les textes d'une épreuve à l'autre. Laissé libre, ce contrôle passait sur le
   poste (écart 1,2) et rougissait en CI (5,1) — un banc intermittent. */
const cl = GEN.classerTextes(cands, { classe: 'Tle A', bornes: plan.texteSupport, genre: 'resume', alea: () => 0 });
const sc = n => (cl.find(x => x.f.n === n) || {}).score;
dire(sc(92) === sc(93) && sc(92) > sc(91) + 50, 'au choix du texte, l’explicatif vaut l’argumentatif, devant le narratif', JSON.stringify(cl.map(x => [x.f.n, x.score])));
dire(/argumentatif ou explicatif/.test(MINESEC.epreuveParCode('A_LITT').texteSupport.nature) && /argumentatif ou explicatif/.test(MINESEC.texteSupportPour(MINESEC.epreuveParCode('CDETI_LITT'), '2nde C').nature),
  'le référentiel (1ère-Tle et 2nde) dit « argumentatif ou explicatif »');

console.log(`\n${G}⑤ Langue française (2nd cycle) : capture de Jacques du 16/10/2026${R}`);
/* Ambassa recopiait l'en-tête de rubrique et les points dans la question,
   numérotait lui-même (« 1. b. »), et tutoyait en Terminale. */
const stL = MINESEC.epreuveParCode('A_LANGUE');
const plL = GEN.planEpreuve(stL, { classe: 'Tle A' });
const blL = GEN.blocsDuPlan(plL);
const ctxL = { plan: plL, struct: stL, classe: 'Tle A', textes: [{ n: 1, role: 'support', type: 'NARRATIF', words: 300, text: TEXTE }] };
const rL = GEN.validerEpreuve({ titre: 'x', questions: [
  { texte: 1, liste: 'expl', bloc: blL[0].cle, pts: 1.5, q: 'I. Communication (5 points)\n1. a. Relève la phrase qui ouvre le texte. (1,5 pts)', corrige: 'La phrase est : « La jeunesse africaine doit inventer son propre avenir. » Barème : 1,5 pt' },
  { texte: 1, liste: 'expl', bloc: blL[0].cle, pts: 1, q: '1. b. Interprète l’effet produit par cette phrase. (1 pt)', corrige: 'Elle pose la thèse.' },
  { texte: 1, liste: 'expl', bloc: blL[1].cle, pts: 2, q: 'II. Morphosyntaxe — 2. a. Transforme la phrase « Le chômage des diplômés nourrit le doute sur l’école. » à la voix passive, puis justifie ta réponse.', corrige: 'Le doute… Barème : 2 pts' }] }, ctxL);
const qL = rL.questions[1].expl.map(x => x.q);
dire(qL[0] === 'I. Communication — a. Relevez la phrase qui ouvre le texte.', 'en-tête de rubrique, numéro et « (1,5 pts) » retirés ; le préfixe posé UNE fois', qL[0]);
dire(qL[1] === 'I. Communication — b. Interprétez l’effet produit par cette phrase.', 'plus de « — b. 1. b. » : la lettre vient du préfixe seul', qL[1]);
dire(/^II\. Morphosyntaxe — a\. Transformez la phrase « Le chômage des diplômés nourrit le doute sur l’école\. » à la voix passive, puis justifiez votre réponse\.$/.test(qL[2]),
  'vouvoiement posé, la citation intacte (mot pour mot)', qL[2]);
dire(!rL.aReparer.some(x => x.defauts.some(d => d.code === 'tutoiement')), 'plus aucune question renvoyée en réécriture pour tutoiement (un appel d’IA épargné)');
const rL1 = GEN.validerEpreuve({ questions: [{ texte: 1, liste: 'comp', bloc: 'comp', pts: 10, q: 'Relève deux personnages du texte.', corrige: 'x Barème : 10 pts' }] },
  { plan: GEN.planEpreuve(MINESEC.epreuveParCode('BEPC_ETUDE')), struct: MINESEC.epreuveParCode('BEPC_ETUDE'), classe: '3e', textes: [{ n: 1, role: 'support', words: 220, text: TEXTE }] });
dire(rL1.questions[1].comp[0].q === 'Relève deux personnages du texte.', 'au 1er cycle, la 2e personne reste (« Relève »)');
dire(GEN.vouvoyer('Résumé au quart : 150 mots.') === 'Résumé au quart : 150 mots.' && GEN.vouvoyer('Analyse au tiers.') === 'Analyse au tiers.'
  && GEN.vouvoyer('Analyse le rôle du narrateur.') === 'Analysez le rôle du narrateur.', '« Résumé » et « Analyse » noms restent des noms ; verbes, ils s’accordent');

console.log(`\n${G}⑥ Guide du 2nd cycle (Jacques, 16/10/2026)${R}`);
/* Commentaire : un extrait d'une œuvre AU PROGRAMME de la classe. */
const avecCom = f => GEN.validerEpreuve(conforme(), Object.assign({}, ctx, { textes: [ctx.textes[0], Object.assign({}, ctx.textes[1], f)] }));
dire(avec(avecCom({ title: 'Poème', reference: 'Poème, 1960' }), /Commentaire composé : le texte n’est pas tiré d’une œuvre au programme de la classe \(« Ngum a Jemea »/).length === 1,
  'commentaire sur un texte hors programme : signalé, avec les œuvres de la classe');
dire(avecCom({ title: 'Le Vieux Nègre et la Médaille', reference: 'F. Oyono' }).controles.some(c => c.ok && /extrait de « Le Vieux Nègre et la Médaille »/.test(c.libelle)),
  'extrait d’une œuvre de Terminale : reconnu');
dire(avec(GEN.validerEpreuve(conforme(), Object.assign({}, ctx, { classe: '1ère A', textes: [ctx.textes[0], Object.assign({}, ctx.textes[1], { title: 'Le Vieux Nègre et la Médaille' })] })), /n’est pas tiré d’une œuvre au programme/).length === 1,
  'la même œuvre en 1ère : refusée (elle est au programme de Terminale)');
/* 2nde : contraction 8 + 10 + 2 (grilles du guide), barèmes officiels reposés. */
const pl2 = GEN.planEpreuve(struct, { classe: '2nde A' });
dire(JSON.stringify(pl2.productions.map(x => x.points)) === '[8,10]' && pl2.sujets.find(x => x.genre === 'presentation').points === 2, '2nde : résumé /8, discussion /10, présentation /2');
dire(JSON.stringify(GEN.planEpreuve(struct, { classe: 'Tle A' }).productions.map(x => x.points)) === '[9,9]', '1ère-Tle : 9 + 9 + 2 inchangé');
const ctx2 = { plan: pl2, struct, classe: '2nde A', textes: [Object.assign({}, ctx.textes[0], { words: 450, text: mots.slice(0, 450).join(' ') }), Object.assign({}, ctx.textes[1], { title: 'Les Tribus de Capitoline' })] };
const o2 = conforme(); o2.questions[0].pts = 8; o2.questions[1].pts = 10;
o2.questions[0].corrige = o2.questions[0].corrige.replace(resume150, Array.from({ length: 112 }, (_, i) => 'mot' + (i % 9)).join(' ')).replace('(150 mots)', '(112 mots)');
const r2 = GEN.validerEpreuve(o2, ctx2);
dire(/compréhension 3 pts \(fidélité au texte 1,5/.test(r2.questions[1].expl[0].corrige) && /compréhension du sujet 4 pts/.test(r2.questions[1].expl[1].corrige),
  '2nde : le barème du guide (8 et 10) remplace le barème du BAC (9)');
const s2 = GEN.formationMinesec(struct, pl2, '2nde A', []);
dire(/CONTRACTION DE TEXTE \(résumé ou analyse \/8\)/.test(s2) && /DISCUSSION \(\/10\)/.test(s2) && /EXTRAIT D’UNE ŒUVRE INTÉGRALE AU PROGRAMME/.test(s2), 'la formation d’Ambassa en 2nde dit /8, /10 et « extrait d’une œuvre au programme »');
dire(/SOIT sur un problème abordé dans le texte, SOIT sur un passage précis/.test(s2) && !/elle cite MOT POUR MOT entre « » la phrase visée/.test(s2), 'la discussion : un problème du texte OU un passage précis (plus d’obligation de citer)');
/* Langue : repérage → analyse → interprétation, dans chaque rubrique. */
const stA = MINESEC.epreuveParCode('A_LANGUE'), plA = GEN.planEpreuve(stA, { classe: 'Tle A' }), blA = GEN.blocsDuPlan(plA);
const sA = GEN.formationMinesec(stA, plA, 'Tle A', []);
dire(/TROIS sous-questions dans cet ordre : a\. REPÉRER ou IDENTIFIER/.test(sA) && /b\. L’ANALYSER/.test(sA) && /c\. L’INTERPRÉTER/.test(sA), 'la formation exige repérage, analyse, interprétation');
dire(/TROIS items, dans cet ordre/.test(GEN.ajusterPrompt({ plan: plA, struct: stA, classe: 'Tle A', textes: [{ n: 1, role: 'support', words: 300, text: TEXTE }] })), 'chaque rubrique demande trois items a/b/c');
const qA = (bloc, q) => ({ texte: 1, liste: 'expl', bloc, pts: 1.5, q, corrige: 'x' });
const ctxA = { plan: plA, struct: stA, classe: 'Tle A', textes: [{ n: 1, role: 'support', words: 300, text: TEXTE }] };
const complet = GEN.validerEpreuve({ questions: blA.flatMap(b => [qA(b.cle, 'Relevez la phrase interrogative.'), qA(b.cle, 'Précisez sa nature.'), qA(b.cle, 'Interprétez l’effet produit.')]) }, ctxA);
dire(complet.controles.some(c => c.ok && /repérage, analyse et interprétation dans chaque rubrique/.test(c.libelle)), 'quatre rubriques complètes : contrôle au vert');
const bancal = GEN.validerEpreuve({ questions: blA.flatMap(b => [qA(b.cle, 'Relevez la phrase interrogative.'), qA(b.cle, 'Relevez un adverbe.')]) }, ctxA);
dire(avec(bancal, /Langue : chaque rubrique doit aller du repérage à l’analyse puis à l’interprétation — à reprendre : Communication \(sans analyse, interprétation\)/).length === 1, 'une rubrique de pur repérage est signalée, avec ce qui manque');
dire(GEN.operationLangue('Repérez deux figures.') === 'reperage' && GEN.operationLangue('Précisez la nature du mot.') === 'analyse' && GEN.operationLangue('Dégagez l’effet de sens.') === 'interpretation',
  'les trois opérations se reconnaissent (« Repérez », « Précisez la nature », « Dégagez l’effet »)');

console.log(`\n  ${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
process.exit(ko ? 1 : 0);
