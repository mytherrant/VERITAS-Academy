/* =====================================================================
   VÉRITAS — Français 2nde Scientifique & Technique — contenu
   ===================================================================== */
const R = require("./render");
const C = require("./common");
const {
  docx, Paragraph, TextRun, PageBreak, AlignmentType,
  P, spacer, partTitle, H1c, H2, H2nb, H3, rubrique, proseBlock, encadre, bullets,
} = R;

/* ---------- helpers partagés ---------- */
const { mots, quart, tiers, texteSupport, exo } = C;
const CIT = require("./tx_citations");
const SUJ = require("./tx_sujets");
const SIG = "Jacques M. TAKOU, Chroniques pour l’école, Douala, 2026 (texte inédit)";

/* =====================================================================
   AVANT-PROPOS
   ===================================================================== */
function avantPropos(){
  return [
    H1c("Avant-propos"),
    P("Ce document accompagne l’élève de 2nde des séries scientifiques et techniques (2nde C et 2ndes des lycées techniques) pendant toute l’année de français. Il rassemble en un seul volume ce qui est d’ordinaire dispersé : le programme officiel et son cadrage, la progression semaine par semaine, la structure exacte des évaluations, les méthodes des exercices d’examen, un grand nombre d’exercices d’entraînement — avec une insistance volontaire sur la contraction de texte et l’argumentation, les deux piliers des séries scientifiques et techniques — et des épreuves types complètes.",{justify:true}),
    P("La 2nde est une année de fondation : tout ce que le Probatoire puis le Baccalauréat exigeront s’installe maintenant. L’élève qui sait, dès juin, résumer un texte au quart, bâtir un plan de discussion et rédiger un paragraphe argumentatif solide a déjà fait la moitié du chemin des classes d’examen.",{justify:true}),
    P("Les corrigés des épreuves types et des exercices marqués #WEB sont publiés en ligne sur l’Espace Manuels du Centre VÉRITAS (veritas-school.com). Le document imprimé pose les questions ; l’espace en ligne donne les réponses commentées — dans cet ordre, et pas l’inverse.",{justify:true}),
    C.renvoiWeb("Corrigés EST — 2nde scientifique & technique"),
    new Paragraph({ children:[new PageBreak()] }),
  ];
}

/* =====================================================================
   PARTIE 1 — PROGRAMME
   ===================================================================== */
function programme(){
  const out=[];
  out.push(...partTitle("Première partie","Le programme officiel de 2nde"));
  out.push(P("Le programme de français des 2ndes scientifiques et techniques se décline en trois compétences de base, travaillées de front toute l’année à raison de 3 heures hebdomadaires (littérature coefficient 2, langue coefficient 1 aux évaluations) :",{justify:true}));
  out.push(C.twoColTable(["Compétence de base","Contenu"],[
    ["CB 1 — Lire","Lire et apprécier des œuvres littéraires : s’informer, critiquer, découvrir les genres, les courants et les mouvements littéraires. Étude d’œuvres intégrales : paratexte, lectures méthodiques, étude d’ensemble (personnages, espace, temps, schémas narratif et actantiel), inscription de l’œuvre dans son contexte."],
    ["CB 2 — Langue","Utiliser les outils de la langue pour lire et interpréter des textes variés : communication verbale et non verbale, facteurs de la communication, registres, dénotation/connotation, polysémie, synonymes/antonymes/homonymes/paronymes, champs lexicaux, hyperonymie/hyponymie, relations logiques, cohérence et cohésion, classes de mots, formation des mots, groupes dans la phrase."],
    ["CB 3 — Produire","Produire oralement et par écrit divers types de textes. Exercices écrits : contraction de texte, dissertation, initiation au commentaire composé, initiation à l’écriture poétique et narrative. Exercices oraux : débat, compte rendu, exposé, dramatisation, déclamation, slam poétique."],
  ],1650));
  out.push(spacer(80));
  out.push(H3("Cadrage des œuvres"));
  bullets([
    "Œuvre principale n°1 : un roman camerounais. La progression de cette année retient Les Tribus de Capitoline.",
    "Œuvre principale n°2 : une œuvre théâtrale française. La progression retient Tartuffe de Molière.",
  ]).forEach(b=>out.push(b));
  out.push(encadre("REPÈRE — Pourquoi ces deux œuvres ?", [
    "Le roman camerounais ancre la lecture dans une réalité proche (la ville, la famille, les tensions communautaires) ; la comédie classique française installe les outils du texte théâtral (didascalies, répliques, comique) et une réserve d’exemples précieuse pour la dissertation : Molière défendait « le devoir de la comédie », qui est « de corriger les hommes en les divertissant » (Premier placet au roi, 1664).",
  ], "repere"));
  out.push(encadre("ASTUCE — Le journal de lecture, ton meilleur investissement", [
    "Pour chaque œuvre, tiens un cahier : personnages (fiche d’identité, évolution), une citation par chapitre ou par acte, thèmes rencontrés, questions restées ouvertes. Aux évaluations de littérature comme aux exposés, tout part de ce journal — et il devient ta banque d’exemples de dissertation.",
  ], "astuce"));
  out.push(new Paragraph({ children:[new PageBreak()] }));
  return out;
}

/* =====================================================================
   PARTIE 2 — PROGRESSION
   ===================================================================== */
function progression(){
  const out=[];
  out.push(...partTitle("Deuxième partie","Progression annuelle, semaine par semaine"));
  out.push(P("Chaque séquence court sur six semaines : trois semaines de leçons (lecture, langue, expression écrite — 1 h chacune par semaine), une semaine d’intégration, une semaine d’évaluations (langue 2 h, littérature 3 h), une semaine de comptes rendus et de remédiation.",{justify:true}));
  out.push(spacer(60));

  out.push(...C.seqBlock({ num:"I", titre:"Réduire un texte en le résumant",
    competence:"Étant donné la nécessité de présenter une synthèse dans la vie courante, l’apprenant devra résumer un texte en se servant des ressources de la séquence.",
    weeks:[
      {s:"S1", items:["Les Tribus de Capitoline : activités augurales (paratexte, hypothèses de lecture).","Communication verbale / non verbale et communication iconique.","La contraction de texte : présentation de l’exercice."]},
      {s:"S2", items:["Lecture méthodique des textes ouvroir et fermoir.","Le texte argumentatif : caractéristiques et fonctions.","Travail préparatoire : repérage du thème, de la (des) thèse(s), des arguments."]},
      {s:"S3", items:["Les connecteurs logiques.","Les facteurs de la communication.","Repérage des parties essentielles d’un texte et techniques du résumé."]},
      {s:"S4", items:["Activités d’intégration : sur la base d’un texte, travail préparatoire puis production d’un résumé."]},
      {s:"S5", items:["Évaluations : langue française (2 h) ; littérature (3 h)."]},
      {s:"S6", items:["Lecture méthodique 2 (Les Tribus de Capitoline).","Comptes rendus des évaluations.","Remédiation."]},
    ]}));

  out.push(...C.seqBlock({ num:"II", titre:"Réduire un texte en l’analysant",
    competence:"Étant donné la nécessité de présenter une synthèse, l’apprenant produira une analyse en se servant des ressources de la séquence.",
    weeks:[
      {s:"S1", items:["Lecture méthodique 3 (Les Tribus de Capitoline).","Le texte narratif : caractéristiques et fonctions.","Production d’une analyse : les techniques de l’analyse d’un texte."]},
      {s:"S2", items:["Lecture méthodique 4.","Notion de mot / unité lexicale.","Les fonctions du langage."]},
      {s:"S3", items:["Les registres familier, courant et soutenu.","Champ lexical / champ sémantique.","Contraction de texte — la discussion : analyse du sujet."]},
      {s:"S4", items:["Activités d’intégration : sur la base d’un texte, produire une analyse complète."]},
      {s:"S5", items:["Évaluations : langue française (2 h) ; littérature (3 h)."]},
      {s:"S6", items:["Exposés : la condition de la femme dans Les Tribus de Capitoline ; les formes d’expression de l’amour.","Comptes rendus.","Remédiation."]},
    ]}));

  out.push(...C.seqBlock({ num:"III", titre:"Argumenter au quotidien",
    competence:"Étant donné la nécessité de soutenir ou de réfuter un point de vue, l’apprenant devra argumenter au quotidien en s’appuyant sur les ressources de la séquence.",
    weeks:[
      {s:"S1", items:["Exposés : le tribalisme, puis la mort, dans Les Tribus de Capitoline.","Les valeurs des temps de l’indicatif : présent et imparfait.","La discussion : élaboration du plan détaillé."]},
      {s:"S2", items:["Les Tribus de Capitoline : inscription de l’œuvre dans son contexte de production.","Les figures d’analogie : comparaison, métaphore, personnification.","La discussion : rédaction d’une introduction."]},
      {s:"S3", items:["La syntaxe de la phrase : phrase simple, phrase composée, phrase complexe.","La discussion : rédaction d’une conclusion.","La discussion : rédaction du paragraphe argumentatif."]},
      {s:"S4", items:["Activités d’intégration : sur la base d’un sujet de discussion, produire une introduction, un paragraphe de développement au choix, une conclusion."]},
      {s:"S5", items:["Évaluations : langue française (2 h) ; littérature (3 h)."]},
      {s:"S6", items:["Comptes rendus. Remédiation.","La dissertation : présentation de l’exercice."]},
    ]}));

  out.push(...C.seqBlock({ num:"IV", titre:"Vers la dissertation : analyser et planifier",
    competence:"Étant donné la nécessité d’exprimer un point de vue, l’apprenant devra élaborer un plan afin de produire une dissertation en s’appuyant sur les ressources de la séquence.",
    weeks:[
      {s:"S1", items:["Connotation / dénotation ; synonymes, antonymes, paronymes.","Sens propre / sens figuré.","Dissertation : les types de plan et quelques problèmes littéraires."]},
      {s:"S2", items:["Syntaxe de la phrase : types et formes de phrases.","Analyse d’un sujet de dissertation de type analytique.","Analyse d’un sujet de dissertation de type dialectique."]},
      {s:"S3", items:["Tartuffe de Molière : activités augurales.","Le texte théâtral : caractéristiques, fonctions, sous-genres.","Dissertation : élaboration d’un plan détaillé (analytique et dialectique)."]},
      {s:"S4", items:["Activité d’intégration : sur la base d’un sujet analytique ou dialectique — analyser le sujet, rechercher les idées, élaborer un plan détaillé cohérent."]},
      {s:"S5", items:["Évaluations : langue française (2 h) ; littérature (3 h)."]},
      {s:"S6", items:["Tartuffe : lecture du texte ouvroir et lancement du journal de lecture.","Comptes rendus.","Remédiation."]},
    ]}));

  out.push(...C.seqBlock({ num:"V", titre:"Produire une dissertation",
    competence:"Étant donné la nécessité de critiquer ou de soutenir une opinion, l’apprenant devra rédiger une dissertation en s’appuyant sur les ressources de la séquence.",
    weeks:[
      {s:"S1", items:["Tartuffe : lecture méthodique du texte 2.","La formation des mots : dérivation et composition.","Dissertation : rédaction de l’introduction et de la conclusion."]},
      {s:"S2", items:["Tartuffe : lecture analytique du texte 3.","Les figures d’opposition : oxymore, antithèse, ironie.","Dissertation : rédaction du paragraphe argumentatif."]},
      {s:"S3", items:["Tartuffe : lecture méthodique du texte 4.","L’énonciation.","Dissertation : rédaction du chapeau introductif et de la transition majeure."]},
      {s:"S4", items:["Activités d’intégration : sur la base d’un sujet de dissertation, produire une introduction, un paragraphe au choix, une conclusion."]},
      {s:"S5", items:["Évaluations : langue française (2 h) ; littérature (3 h)."]},
      {s:"S6", items:["Tartuffe : inscription de l’œuvre dans son contexte de production.","Comptes rendus.","Remédiation."]},
    ]}));

  out.push(...C.seqBlock({ num:"VI", titre:"Révisions et intégration générale",
    competence:"Consolider les acquis de l’année : répondre méthodiquement aux questions de langue, produire résumé, analyse, discussion et dissertation dans les conditions de l’examen.",
    weeks:[
      {s:"S1", items:["Révisions : apprendre à répondre aux questions de langue (méthode R.A.I.).","Révisions : résumé / analyse.","Exposés de synthèse."]},
      {s:"S2", items:["Révisions : la discussion.","Révisions : la dissertation.","Ateliers d’écriture chronométrés."]},
      {s:"S3", items:["Intégration : production d’une dissertation complète en 3 h."]},
      {s:"S4", items:["Évaluations de fin d’année."]},
      {s:"S5", items:["Comptes rendus, remédiation, bilan des journaux de lecture."]},
      {s:"S6", items:["Orientation : présentation des épreuves de 1ère et du Probatoire par série."]},
    ]}));
  out.push(new Paragraph({ children:[new PageBreak()] }));
  return out;
}

/* =====================================================================
   PARTIE 3 — ÉVALUATIONS & HORIZON DES SÉRIES
   ===================================================================== */
function evaluations(){
  const out=[];
  out.push(...partTitle("Troisième partie","Les évaluations et l’horizon des séries"));
  out.push(P("Dès la 2nde, les évaluations séquentielles adoptent le format des épreuves officielles, avec des textes plus courts. Chaque séquence se clôt par deux épreuves :",{justify:true}));
  out.push(C.twoColTable(["Épreuve","Format en 2nde scientifique et technique"],[
    ["Langue française (2 h, coef 1)","Un texte de 250 à 400 mots ; quatre rubriques (communication, morphosyntaxe, sémantique/lexicologie, stylistique/rhétorique), deux questions par rubrique ; présentation notée."],
    ["Littérature (3 h, coef 2)","Selon la séquence : contraction de texte (résumé ou analyse + discussion) ou dissertation. Barème d’orientation : contraction 9 pts + discussion 9 pts + présentation 2 pts ; dissertation sur 18 pts + présentation 2 pts, avec grille critériée (pertinence, cohérence, correction de la langue, originalité)."],
  ],1900));
  out.push(spacer(80));
  out.push(H3("Ce qui t’attend selon ta série"));
  out.push(P("La 2nde prépare des orientations différentes. Voici, série par série, l’épreuve de français que tu affronteras au Probatoire (fin de 1ère) puis au Baccalauréat ou Brevet de technicien :",{justify:true}));
  out.push(C.twoColTable(["Séries","Épreuves officielles de français"],[
    ["C – D – E – TI (Probatoire puis Bac)","Littérature/Culture générale (3 h) : deux sujets au choix — type 1 : contraction (texte argumentatif de 550 à 650 mots ; résumé au 1/4 ou analyse au 1/3, 9 pts + discussion 9 pts + présentation 2 pts) ; type 2 : dissertation. Langue française (2 h) : texte de 250 à 400 mots, 4 rubriques."],
    ["F – AF – CI – BT (industrielles)","Une épreuve de 3 h, coef 2, deux sujets au choix — type 1 : résumé (texte non littéraire de 400 à 500 mots, au 1/4) ou analyse (au 1/3) + langue (4 rubriques × 2 pts) ; type 2 : dissertation de culture littéraire (citation + consigne, grille critériée)."],
    ["STT : ACA – ACC – FIG – CG – ESF – HT","Sujet de type I : résumé de texte (400 à 500 mots) 10 pts + langue (4 rubriques × 2 pts) 8 pts + présentation 2 pts ; ou sujet de type II : dissertation littéraire (libellé + consigne). Textes non littéraires liés au domaine de spécialité."],
    ["STT : SES","Même structure que ci-dessus, mais texte de 500 à 600 mots, relatif au domaine de la spécialité."],
  ],1500));
  out.push(spacer(60));
  out.push(encadre("ASTUCE — Une seule stratégie pour toutes les séries", [
    "Quelle que soit ta future série, remarque ce que toutes les épreuves ont en commun : contraction + argumentation + langue. C’est exactement l’ordre des priorités de ce document. Travaille-les dans cet ordre, et ton orientation ne changera rien à ta préparation.",
  ], "astuce"));
  out.push(new Paragraph({ children:[new PageBreak()] }));
  return out;
}

/* =====================================================================
/* =====================================================================
   PARTIE 5 — EXERCICES (textes verbatim : corpus 2nd cycle + textes du net)
   ===================================================================== */
const TXC = require("./tx_corpus");
const TXN = require("./tx_net");
const TXF = require("./tx_frais");

function exercices(){
  const out=[];
  out.push(...partTitle("Cinquième partie","Exercices : maîtriser la contraction et l’argumentation"));
  out.push(P("Cette partie suit la démarche du cours : comprendre le texte (étape 1), s’approprier une à une les techniques de réduction (étape 2), maîtriser le décompte des mots (étape 3), produire des contractions complètes (étape 4), puis conduire l’argumentation du sujet au devoir (étape 5). Tous les textes supports sont des textes authentiques, reproduits mot pour mot avec leur source. Les exercices marqués #WEB ont leur corrigé détaillé en ligne.",{justify:true}));
  out.push(spacer(60));

  /* ---------- ÉTAPE 1 ---------- */
  out.push(H2nb("Étape 1 — Comprendre le texte : énonciation et circuit argumentatif"));
  out.push(...exo("1","Lecture guidée d’un texte argumentatif  #WEB",[]));
  out.push(...texteSupport(TXC.khouribga));
  bullets([
    "Ressors le système énonciatif dominant (temps verbaux, types de phrases, pronoms personnels).",
    "Détermine le thème abordé et donne son intérêt (politique, social, économique, didactique, sportif).",
    "Analyse le circuit argumentatif du texte en relevant les connecteurs logiques, sans oublier de préciser leur valeur.",
    "Précise l’idée majeure défendue par l’auteur.",
    "Formule de manière simple l’idée maîtresse de chaque paragraphe.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("2","Comparer deux systèmes énonciatifs  #WEB",[]));
  out.push(...texteSupport(TXC.boniface));
  bullets([
    "Compare le système énonciatif de ce texte avec celui du texte de l’exercice 1 (personnes, temps, présence de l’énonciateur).",
    "Présente les particularités qu’auront les résumés de ces deux passages au niveau énonciatif.",
    "Relève le squelette des connecteurs du second paragraphe et donne la valeur de chacun.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("3","Le circuit argumentatif",[]));
  out.push(...texteSupport(TXC.boucher));
  bullets([
    "Dégage le thème et la thèse de ce texte.",
    "Présente son circuit argumentatif : pour chaque argument, précise, si possible, le connecteur introducteur.",
    "À quel « futur du travail » l’auteur veut-il préparer son lecteur ? Réponds en une phrase.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  /* ---------- ÉTAPE 2 ---------- */
  out.push(H2nb("Étape 2 — Les techniques de réduction"));
  out.push(encadre("REPÈRE — Les six gestes du contracteur", [
    { li:"La synonymie : remplacer un mot ou une expression par un équivalent plus court (« faire preuve de courage » → « oser »)." },
    { li:"La pronominalisation : reprendre le terme-clé déjà posé par un pronom (« la bande dessinée… » → « elle »)." },
    { li:"La nominalisation : condenser une proposition entière en un nom (« parce que les prix ont brutalement augmenté » → « la flambée des prix »)." },
    { li:"Le terme englobant (hyperonyme) : couvrir une énumération d’un seul mot (« le blé, le riz, les pâtes, le lait » → « les denrées essentielles »)." },
    { li:"La suppression des exemples, digressions et données chiffrées illustratives — sauf si l’exemple EST l’argument." },
    { li:"L’élimination des répétitions et redondances : une idée ne se paie qu’une fois." },
  ], "repere"));
  out.push(spacer(60));

  out.push(...exo("4","Le terme englobant",[
    "Remplace chaque énumération par un terme ou un groupe nominal englobant :",
    {b:[
      "le paludisme, la typhoïde, le choléra et la dysenterie ;",
      "les houes, les machettes, les arrosoirs et les brouettes ;",
      "WhatsApp, Facebook, TikTok et Instagram ;",
      "la colère, la jalousie, la peur et la honte ;",
      "le maïs, le manioc, la banane plantain et l’arachide.",
    ]},
  ]));
  out.push(...exo("5","Réduire une phrase",[
    "Réduis chacune de ces phrases à dix mots au plus, sans perdre l’information essentielle :",
    {b:[
      "« Dans la plupart des établissements scolaires de la ville, les enseignants constatent avec une inquiétude grandissante que les élèves arrivent le matin dans un état de fatigue avancée. »",
      "« Il faut reconnaître, même si cela déplaît à certains, que les jeux vidéo, lorsqu’ils sont pratiqués avec excès et sans aucun contrôle des parents, finissent par nuire gravement aux résultats scolaires. »",
      "« Les techniciens qui sortent chaque année des lycées techniques de notre pays trouvent, dans la grande majorité des cas, un emploi stable bien plus rapidement que beaucoup de diplômés des filières générales. »",
    ]},
    {enc:{titre:"ASTUCE", corps:["Cherche le verbe porteur du sens, garde son sujet et son complément essentiel, sacrifie le reste : précautions oratoires (« il faut reconnaître que… »), relatives descriptives, adverbes d’insistance."], type:"astuce"}},
  ]));

  out.push(...exo("6","Pronominalisation, nominalisation, synonymie  #WEB",[]));
  out.push(...texteSupport(TXC.winsavi));
  bullets([
    "Réduis ce texte en utilisant la pronominalisation du terme-clé (« la dépigmentation »), la nominalisation et la synonymie.",
    "Propose ensuite une phrase-résumé de 25 mots au maximum.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("7","Terme englobant et synonyme",[]));
  out.push(...texteSupport(TXC.ouedraogo));
  bullets([
    "Utilise le terme englobant pour réduire les énumérations (infrastructures, industries, manifestations culturelles…).",
    "Propose des synonymes plus courts pour les expressions longues, puis réduis chaque paragraphe à une phrase.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("8","La question des exemples  #WEB",[]));
  out.push(...texteSupport(TXC.lepays));
  bullets([
    "Relève les exemples contenus dans ce texte et précise leur type (illustratif ou argumentatif).",
    "Indique, pour chacun, la conduite à tenir dans le cadre du résumé : suppression pure, ou condensation par un terme englobant ?",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("9","Identifier puis appliquer les techniques",[]));
  out.push(...texteSupport(TXN.ebongue));
  bullets([
    "Identifie au moins trois techniques de réduction applicables à ce texte, en citant à chaque fois le passage concerné.",
    "Applique-les : réduis le texte au quart de son volume, soit environ "+quart(TXN.ebongue)+" mots.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("10","Gammes sur des paragraphes d’une centaine de mots  #WEB",[
    "Réduis chacun des deux paragraphes suivants à 25-30 mots, en indiquant en marge la ou les techniques utilisées à chaque transformation.",
  ]));
  out.push(...texteSupport(TXF.dDembeleHeritage));
  out.push(...texteSupport(TXF.dNgomEntreprises));
  out.push(spacer(80));

  out.push(...exo("11","La chasse aux chiffres",[]));
  out.push(...texteSupport(TXF.dDembeleOCDE));
  bullets([
    "Ce paragraphe multiplie les données chiffrées. Lesquelles sont de simples illustrations ? L’une d’elles porte-t-elle l’argument lui-même ?",
    "Réduis le paragraphe à 30 mots au maximum.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  /* ---------- ÉTAPE 3 ---------- */
  out.push(H2nb("Étape 3 — Le décompte des mots et la marge"));
  out.push(...exo("12","L’intervalle de réduction  #WEB",[
    "Calcule l’intervalle de réduction (fourchette basse – fourchette haute) pour les consignes ci-dessous :",
    {b:[
      "Consigne 1 : « Ce texte compte 488 mots. Résume-le au quart de sa longueur avec une marge de 10 % en plus ou en moins. »",
      "Consigne 2 : « Ce texte compte 677 mots. Résume-le au quart de sa longueur avec une marge de 10 % en plus ou en moins. »",
      "Consigne 3 : « Ce texte compte 599 mots. Résume-le au quart de sa longueur avec une marge de 10 % en plus ou en moins. »",
    ]},
  ]));
  out.push(...exo("13","Combien de mots comptent ces textes ?",[
    "En appliquant la convention de comptage (unité séparée par des blancs = 1 mot ; « l’école » = 2 mots ; « c’est-à-dire » = 1 mot), compte les mots des deux textes suivants, puis calcule pour chacun le volume du résumé au quart et sa fourchette (± 10 %).",
  ]));
  out.push(...texteSupport(TXC.frydman));
  out.push(...texteSupport(TXN.malapa));
  out.push(spacer(80));

  /* ---------- ÉTAPE 4 ---------- */
  out.push(H2nb("Étape 4 — Contractions complètes"));
  out.push(...exo("14","Du circuit au résumé  #WEB",[]));
  bullets([
    "Reprends le texte de Pascal Boniface (exercice 2). Établis son circuit argumentatif complet.",
    "Résume-le au quart de son volume, soit environ "+quart(TXC.boniface)+" mots (marge de 10 %). Indique le nombre de mots utilisés.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(60));

  out.push(...exo("15","L’analyse (réduction au tiers)  #WEB",[]));
  out.push(...texteSupport(TXN.taubira));
  bullets([
    "Dégage le thème et la thèse de ce texte.",
    "Analyse-le au tiers de son volume, soit environ "+tiers(TXN.taubira)+" mots : 3e personne, verbes de démarche variés, aucune prise de position personnelle.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("16","Résumé d’un texte d’actualité",[]));
  out.push(...texteSupport(TXN.bonifaceIA));
  bullets([
    "Dégage le thème et la thèse du texte.",
    "Résume-le au quart de son volume, soit environ "+quart(TXN.bonifaceIA)+" mots. Indique le nombre de mots utilisés.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("17","Corriger un résumé fautif  #WEB",[
    "Voici un résumé (fautif) du texte de Clément Winsavi (exercice 6), produit par un élève : « La dépigmentation artificielle est devenue un véritable phénomène de société. Je trouve cela dommage, car les femmes noires devraient être fières de leur peau. L’auteur dit que des femmes analphabètes à celles lettrées, toutes semblent ne pas pouvoir résister au désir de changer la couleur de leur peau, ce qui prouve la puissance des complexes hérités de la colonisation. » (63 mots)",
    "Le texte source compte environ "+C.totalMots(TXC.winsavi)+" mots ; le résumé demandé était au quart, marge de 10 %.",
    {b:[
      "Identifie au moins quatre fautes de méthode dans ce résumé (proportion, recopiage, énonciation, ajout d’idées, jugement personnel…).",
      "Propose un résumé correct.",
    ]},
  ]));

  /* ---------- ÉTAPE 5 ---------- */
  out.push(H2nb("Étape 5 — L’argumentation : du sujet au devoir"));
  out.push(P("La dissertation s’adapte au genre. Voici, pour t’entraîner dès la 2nde, des sujets classés par genre : commence par ceux du roman et du théâtre (tes deux œuvres de l’année).",{justify:true}));
  out.push(...C.sujetsListe("Roman", SUJ.roman));
  out.push(...C.sujetsListe("Théâtre", SUJ.theatre));
  out.push(...C.sujetsListe("Fonction de la littérature & société", SUJ.engagementSociete));
  out.push(spacer(40));
  out.push(...exo("18","Analyser un sujet de dissertation  #WEB",[
    "Pour chacun des sujets suivants : délimite le libellé et la consigne ; détermine le type de plan et l’indice qui le justifie ; précise le domaine d’application (ouvert ou fermé) ; souligne les termes-clés et explique-les.",
    {b:[ TXC.sujets2nde[0], TXC.sujets2nde[1], TXC.sujets2nde[2], TXC.sujets2nde[3] ]},
    {enc:{titre:"REPÈRE — Les indices du type de plan", corps:[
      { li:"Dialectique : « partagez-vous… ? », « discutez », « appréciez », « êtes-vous du même avis ? », « qu’en pensez-vous ? »." },
      { li:"Analytique : « montrez », « démontrez », « justifiez », « expliquez », « illustrez », « commentez »." },
    ], type:"repere"}},
  ]));
  out.push(...exo("19","De la reformulation à la problématique  #WEB",[
    "Pour chacun des sujets suivants : reformule la citation en une phrase minimale (sujet, verbe, complément) ; dégage le thème puis le problème posé ; élabore la problématique adaptée au type de plan.",
    {b:[ TXC.sujets2nde[4], TXC.sujets2nde[5], TXC.sujets2nde[6] ]},
    {enc:{titre:"REPÈRE — Formuler la problématique", corps:[
      "Plan dialectique : une interrogation totale avec un adverbe restrictif (« L’écrivain doit-il toujours aider la société ? »), ou trois interrogations (partielle, rhétorique, partielle).",
      "Plan analytique : une seule interrogation partielle (« En quoi… ? », « Dans quelle mesure… ? »).",
    ], type:"repere"}},
  ]));
  out.push(...exo("20","Radiographie d’une introduction  #WEB",[]));
  out.push(...texteSupport(TXC.introModele));
  bullets([
    "Identifie les différentes parties de cette introduction et les connecteurs qui les introduisent.",
    "Par quoi peut-on remplacer chacun de ces connecteurs ?",
    "Quelle méthode a-t-on employée pour amener le sujet ? Quelles sont les autres méthodes possibles ?",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("21","Compléter un plan détaillé",[
    "Sujet : « Le roman se consacre-t-il uniquement à la peinture du vrai ? ». Complète le plan détaillé suivant : rédige chaque explication (« C’est-à-dire… ») et propose un exemple précis tiré de tes lectures.",
    {b:[
      "I. La littérature reproduit la réalité quotidienne. — Argument 1 : le personnage naît de l’observation du réel. Citation d’appui : François Mauriac — « Le personnage naît du mariage que le romancier contracte avec la réalité ». Explication : … Exemple : …",
      "I. Argument 2 : le livre restitue les réalités sociales. Citation d’appui : Stendhal — « Le roman est un miroir qui se promène sur une grande route ». Explication : … Exemple : …",
      "II. L’écrivain fait aussi appel à son imagination. — Argument 1 : les lieux, cadres de l’histoire, sont souvent inventés. Citation d’appui : Stendhal — « Tout roman est un beau mensonge ». Explication : … Exemple : …",
      "II. Argument 2 : les personnages sont le fruit de l’imagination de l’écrivain. Citation d’appui : Nelly Cormeau — « Le personnage est un être de papier ». Explication : … Exemple : …",
    ]},
  ]));
  out.push(...exo("22","Rédiger l’introduction et la conclusion",[
    "À partir de ton analyse du sujet d’Aragon (exercice 18) : rédige l’introduction complète (amener — poser — annoncer), puis la conclusion (bilan — ouverture). Interdits : « De tout temps… », « Depuis la nuit des temps… », l’annonce mécanique en « I. », « II. ».",
  ]));
  out.push(...exo("23","Paragraphe argumentatif et concession",[
    "a) Rédige un paragraphe argumentatif complet (méthode A.E.E.B.) à partir de ce matériau — idée : le rire du théâtre corrige les mœurs ; exemple : Tartuffe et la satire de l’hypocrisie religieuse.",
    "b) Transforme chacune de ces affirmations brutales en un mouvement concessif (« Certes…, mais… ») :",
    {b:[
      "Le téléphone portable n’a rien à faire à l’école.",
      "Les séries télévisées sont une perte de temps.",
      "Seuls les diplômes des filières générales ont de la valeur.",
      "La ville offre plus d’avenir que le village.",
    ]},
  ]));
  out.push(...exo("24","Culture littéraire : classer les œuvres  #WEB",[
    "Classe les œuvres ci-dessous selon le genre auquel elles appartiennent (roman, théâtre, poésie) :",
    TXC.classementOeuvres,
  ]));
  out.push(new Paragraph({ children:[new PageBreak()] }));
  return out;
}

/* =====================================================================
   PARTIE 6 — ÉPREUVES TYPES
   ===================================================================== */
const TL = { titre:"Texte — Premier jour à l’atelier", source:SIG, paras:[
  "Le matin de la rentrée, Essomba poussa la porte de l’atelier comme on entre dans une église : le souffle court, la casquette à la main. D’immenses établis alignaient leurs étaux ; des copeaux de fer luisaient au sol comme une pluie d’étoiles tombées pendant la nuit ; au fond, la perceuse à colonne dressait son cou d’oiseau attentif.",
  "« On ne touche à rien sans consigne », dit une voix. Le chef d’atelier était un homme sec, aux mains larges, dont la blouse portait plus de brûlures que de boutons. Il fit asseoir les nouveaux et parla sans notes. Il dit que la machine ne pardonne pas la distraction ; que la règle n’est pas une punition mais une armure ; qu’un technicien qui range son poste pense déjà comme un ingénieur.",
  "Essomba écoutait, et quelque chose se déplaçait en lui. Au collège, on lui avait répété qu’il « travaillait de ses mains » comme on avoue une faiblesse. Ici, les mains étaient des reines : elles mesuraient, traçaient, ajustaient, et l’erreur d’un demi-millimètre faisait plus de bruit qu’une mauvaise note. Il comprit, ce matin-là, qu’il ne venait pas d’entrer dans un atelier, mais dans un métier — et peut-être, se dit-il en serrant sa casquette, dans une vie.",
  "À la pause, un ancien lui tendit une lime : « Tiens, petit. Le fer, ça se respecte, mais ça s’apprend. » Essomba sourit. Dehors, la cour sentait l’huile chaude et la limaille ; il trouva que cela sentait l’avenir.",
]};

function epreuves(){
  const out=[];
  out.push(...partTitle("Sixième partie","Épreuves types (corrigés en ligne)"));
  out.push(P("Les évaluations de 2nde reprennent le format des épreuves du Probatoire C-D-E-TI : une épreuve de langue de 2 heures (quatre rubriques de 5 points) et une épreuve de littérature de 3 heures (deux sujets au choix). Entraîne-toi dans les conditions réelles : au propre, sans documents, montre en main.",{justify:true}));
  out.push(spacer(60));

  out.push(H2nb("Épreuve type n°1 — Langue française (2 h, coef 1)  #WEB"));
  out.push(...texteSupport(TL));
  out.push(rubrique("I — Communication (5 pts)"));
  bullets([
    "1.a. Identifie l’émetteur et le récepteur du discours rapporté au deuxième paragraphe, à partir d’indices précis. (1,5 pt) — 1.b. Quel est l’effet produit par ce discours rapporté ? (1 pt)",
    "2.a. « On ne touche à rien sans consigne » : cet énoncé décrit-il ou fait-il agir ? Nomme la notion en jeu et justifie. (1,5 pt) — 2.b. Que révèle-t-il de l’univers de l’atelier ? (1 pt)",
  ]).forEach(b=>out.push(b));
  out.push(rubrique("II — Morphosyntaxe (5 pts)"));
  bullets([
    "1.a. « Il dit que la machine ne pardonne pas la distraction ; que la règle n’est pas une punition mais une armure » : analyse la structure de cette phrase (nature des propositions, mots de liaison). (1,5 pt) — 1.b. Quel effet produit cette accumulation de subordonnées ? (1 pt)",
    "2.a. Relève deux connecteurs ou signes de ponctuation qui assurent la cohésion du troisième paragraphe. (1,5 pt) — 2.b. Précise leur rôle dans la progression du texte. (1 pt)",
  ]).forEach(b=>out.push(b));
  out.push(rubrique("III — Sémantique / Lexicologie (5 pts)"));
  bullets([
    "1.a. « Les mains étaient des reines » : donne le sens dénoté de « reines », puis son sens connoté dans le texte. (1,5 pt) — 1.b. Que traduit cette connotation quant au regard porté sur le métier ? (1 pt)",
    "2.a. Construis le champ lexical de l’atelier à partir de quatre mots du texte. (1,5 pt) — 2.b. Quel effet produit-il ? (1 pt)",
  ]).forEach(b=>out.push(b));
  out.push(rubrique("IV — Stylistique / Rhétorique des textes (5 pts)"));
  bullets([
    "1.a. Identifie la figure de style dans « des copeaux de fer luisaient au sol comme une pluie d’étoiles », puis celle de « la perceuse à colonne dressait son cou d’oiseau attentif ». (1,5 pt) — 1.b. Que révèlent-elles du regard d’Essomba ? (1 pt)",
    "2.a. Ce texte est-il narratif, descriptif ou argumentatif ? Justifie en montrant qu’il mêle en réalité deux types. (1,5 pt) — 2.b. Quelle est la fonction de ce mélange ? (1 pt)",
  ]).forEach(b=>out.push(b));
  out.push(spacer(120));

  out.push(H2nb("Épreuve type n°2 — Littérature (3 h, coef 2)  #WEB"));
  out.push(P([{t:"Le candidat traitera l’un des deux sujets au choix.", italics:true, bold:true}],{after:80}));
  out.push(H3("Sujet de type 1 — Contraction de texte et discussion"));
  out.push(...texteSupport(TXC.droit));
  bullets([
    "Résumé (9 pts) : ce texte compte "+C.totalMots(TXC.droit)+" mots. Résume-le au quart de son volume, soit environ "+quart(TXC.droit)+" mots (marge de 10 %). Indique le nombre de mots utilisés à la fin de ton résumé.",
    "Discussion (9 pts) : « Nous savons célébrer les nourritures, nous savons les produire, nous ne savons pas encore les partager », déplore Roger-Pol Droit. Pensez-vous que le partage soit le principal défi de notre temps ? Vous répondrez à cette question dans un développement argumenté et illustré d’exemples précis.",
    "Présentation : 2 pts.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));
  out.push(H3("Sujet de type 2 — Dissertation"));
  out.push(encadre("Sujet", [
    "Louis Aragon déclare : « Le roman est une clef qui ouvre les portes interdites de nos maisons. »",
    "Partagez-vous cet avis ? Vous répondrez dans un développement organisé et illustré d’exemples précis tirés des œuvres lues ou étudiées, notamment Les tribus de Capitoline.",
    "Grille d’évaluation : pertinence (5 pts), cohérence (5 pts), correction de la langue (5 pts), originalité (3 pts), présentation (2 pts).",
  ], "methode"));
  out.push(spacer(80));
  out.push(C.renvoiWeb("Corrigés EST — 2nde scientifique & technique"));
  return out;
}

/* ===================== BANQUE DE CITATIONS ===================== */
function citations(){
  const out=[];
  out.push(...partTitle("Septième partie","Banque de citations pour la dissertation"));
  out.push(P("Dès la 2nde, commence à te constituer une réserve de citations. Elles ne remplacent pas les arguments : elles les appuient. En voici, classées par thème, pour la dissertation littéraire.",{justify:true}));
  out.push(spacer(40));
  out.push(...C.citationBank(CIT.THEMES));
  return out;
}

module.exports = { avantPropos, programme, progression, evaluations, exercices, epreuves, citations };
