/* =====================================================================
   VÉRITAS — Français Tle Scientifique & Technique — contenu
   ===================================================================== */
const R = require("./render");
const C = require("./common");
const TXC = require("./tx_corpus");
const TXN = require("./tx_net");
const TXF = require("./tx_frais");
const TXF2 = require("./tx_frais2");
const EPT = require("./tx_epreuves_tle");
const CIT = require("./tx_citations");
const SUJ = require("./tx_sujets");
const {
  docx, Paragraph, TextRun, PageBreak, AlignmentType,
  P, spacer, partTitle, H1c, H2, H2nb, H3, rubrique, proseBlock, encadre, bullets,
} = R;
const { mots, quart, tiers, texteSupport, exo } = C;

/* ===================== AVANT-PROPOS ===================== */
function avantPropos(){
  return [
    H1c("Avant-propos"),
    P("Ce document conduit l’élève de Terminale des séries scientifiques et techniques (C/D/E, TI, ESF-HT, ACA-ACC-FIG-CG-SES) jusqu’au Baccalauréat et aux Brevets de techniciens. Il rassemble : le programme et son cadrage, la progression semaine par semaine, la structure exacte des épreuves série par série — elles diffèrent, et les confondre coûte l’examen —, les méthodes, un entraînement intensif à la contraction et à l’argumentation sur textes authentiques, et des épreuves types dont plusieurs sujets officiels du Baccalauréat.",{justify:true}),
    P("En Terminale, on ne découvre plus : on consolide et on chronomètre. Chaque exercice de ce document se traite dans les conditions de l’examen — au propre, montre en main, décompte des mots à l’appui. Les corrigés des épreuves et des exercices marqués #WEB sont publiés en ligne sur l’Espace Manuels du Centre VÉRITAS (veritas-school.com).",{justify:true}),
    C.renvoiWeb("Corrigés EST — Terminale scientifique & technique"),
    new Paragraph({ children:[new PageBreak()] }),
  ];
}

/* ===================== PARTIE 1 — PROGRAMME ===================== */
function programme(){
  const out=[];
  out.push(...partTitle("Première partie","Le programme officiel de Terminale"));
  out.push(P("Trois compétences de base structurent l’année : lire pour apprécier des œuvres littéraires ; utiliser les outils de la langue pour apprécier les effets de sens ; produire divers types de textes à l’écrit comme à l’oral. Volumes, coefficients et œuvres varient selon la série :",{justify:true}));
  out.push(C.twoColTable(["Série","Volume, coefficients et cadrage des œuvres"],[
    ["Tles C / D / E (scientifiques)","108 h/an — 3 h/semaine. Littérature coef 2, Langue coef 1. Œuvres principales (retenues par le Ministère) : 1. un roman ; 2. une pièce théâtrale camerounaise du XXe ou du XXIe siècle."],
    ["Tle TI (Techniques Industrielles)","108 h/an — 3 h/semaine. Littérature coef 2, Langue coef 1. Œuvres principales : 1. un roman camerounais du XXe siècle ; 2. un essai."],
    ["Tles ESF / HT","108 h/an — 3 h/semaine. Littérature coef 2, Langue coef 1. Œuvres principales : 1. un roman africain du XXe/XXIe siècle ; 2. un essai en rapport avec l’univers socio-professionnel."],
    ["Tles ACA / ACC / FIG / CG / SES","144 h/an — 4 h/semaine. Littérature coef 3, Langue coef 1. Œuvres principales (étude systématique) : 1. un roman camerounais du XXe siècle ; 2. un essai. Œuvre secondaire : une œuvre théâtrale française du XVIIIe siècle."],
  ],1650));
  out.push(spacer(60));
  bullets([
    "Les œuvres au programme sont fixées par le Ministère (MINESEC). La progression de cette année (Tles C/D) retient les deux œuvres inscrites : Ngum a Jemea, de David Mbanga Eyombwan (théâtre camerounais, sur la figure du résistant Rudolph Douala Manga Bell), et Le vieux nègre et la médaille, de Ferdinand Oyono (roman camerounais, 1956).",
    "Les œuvres principales font l’objet d’une lecture intégrale et d’une étude approfondie ; les œuvres secondaires d’une lecture intégrale mais d’une étude plus rapide.",
    "Dans les séries tertiaires, l’épreuve de langue « comportera désormais 5 à 6 questions relevant des rubriques les plus représentatives du texte » (programme officiel).",
  ]).forEach(b=>out.push(b));
  out.push(encadre("ASTUCE — Deux œuvres, quatre usages", [
    "Chaque œuvre au programme sert quatre fois : aux évaluations de littérature, en exposé, comme banque d’exemples de dissertation, et comme réservoir de citations. Fiche-la en conséquence : cinq scènes ou chapitres clés, cinq citations exactes avec référence, trois thèmes reliés à l’actualité.",
  ], "astuce"));
  out.push(new Paragraph({ children:[new PageBreak()] }));
  return out;
}

/* ===================== PARTIE 2 — PROGRESSION ===================== */
function progression(){
  const out=[];
  out.push(...partTitle("Deuxième partie","Progression annuelle, semaine par semaine (Tle C/D)"));
  out.push(P("Cinq séquences didactiques de six semaines, puis une séquence de révisions du Baccalauréat. Chaque séquence : trois semaines de leçons, une semaine d’intégration, une semaine d’évaluations (langue 2 h, littérature 3 h), une semaine de comptes rendus et de remédiation.",{justify:true}));
  out.push(spacer(60));

  out.push(...C.seqBlock({ num:"1", titre:"Produire un paragraphe de dissertation",
    competence:"À la fin de la séquence, l’élève produira un paragraphe de dissertation.",
    weeks:[
      {s:"S1", items:["Ngum a Jemea ou la foi inébranlable de Rudolph Douala Manga Bell : activités augurales (étude des paratextes, texte ouvroir) et distribution des thèmes d’exposé.","Le texte argumentatif : caractéristiques et fonctions.","Dissertation littéraire : le thème, la thèse, la problématique et les types de plan."]},
      {s:"S2", items:["Lecture autonome : journal de lecture (hors horaire).","Présentation des textes relatifs au thème « l’expression du malaise social dans le théâtre négro-africain » (à titre indicatif).","Les actes de parole : contenus latents / contenus manifestes.","Dissertation littéraire : le plan détaillé."]},
      {s:"S3", items:["Lecture autonome : journal de lecture (hors horaire).","Lecture méthodique : texte 1.","Les liaisons dans la phrase : conjonctions de coordination et de subordination.","Dissertation littéraire : rédaction du paragraphe."]},
      {s:"S4", items:["Intégration — Tâche : sur la base d’un sujet de dissertation, 1) analyser le sujet ; 2) élaborer un plan détaillé ; 3) rédiger un paragraphe."]},
      {s:"S5", items:["Évaluations : langue (2 h) ; littérature (3 h).","Lecture suivie, dirigée et commentée : texte 2."]},
      {s:"S6", items:["Comptes rendus.","Remédiation."]},
    ]}));

  out.push(...C.seqBlock({ num:"2", titre:"Produire un devoir complet de dissertation",
    competence:"À la fin de la séquence, l’élève produira un devoir complet de dissertation.",
    weeks:[
      {s:"S1", items:["Lecture suivie, dirigée et commentée : texte 3.","La néologie de sens.","Rédaction de l’introduction partielle et de la transition."]},
      {s:"S2", items:["Lecture expliquée : texte 4.","Le texte théâtral : caractéristiques et fonctions.","Rédaction de l’introduction."]},
      {s:"S3", items:["Communication : énoncé constatif, énoncé performatif.","Les liaisons dans la phrase : adverbes de liaison et locutions adverbiales.","Rédaction de la conclusion."]},
      {s:"S4", items:["Intégration — Tâche : sur la base d’un sujet de dissertation, produire 1) une introduction ; 2) un développement (paragraphe au choix) ; 3) une conclusion."]},
      {s:"S5", items:["Évaluations : épreuve de langue ; épreuve de littérature."]},
      {s:"S6", items:["Groupement de textes : confrontation et bilan.","Comptes rendus. Remédiation."]},
    ]}));

  out.push(...C.seqBlock({ num:"3", titre:"Produire un résumé de texte",
    competence:"À la fin de la séquence, l’élève produira un résumé de texte.",
    weeks:[
      {s:"S1", items:["Les actes locutoire, illocutoire et perlocutoire.","Sigles et abréviations.","Contraction de texte : analyse du texte et de la consigne."]},
      {s:"S2", items:["Les liaisons dans la phrase : les pronoms relatifs.","Les techniques du résumé.","Présentation des exposés : Ngum a Jemea, thèmes 1 et 2."]},
      {s:"S3", items:["Relations sémantiques : synonymie et antonymie.","Produire un résumé.","Présentation des exposés : Ngum a Jemea, thèmes 3 et 4."]},
      {s:"S4", items:["Intégration — Tâche : sur la base d’un texte à contracter, 1) dégager les idées essentielles ; 2) les reformuler ; 3) produire un résumé."]},
      {s:"S5", items:["Évaluations : épreuve de langue ; épreuve de littérature."]},
      {s:"S6", items:["Ngum a Jemea : inscription de l’œuvre dans son contexte (intérêts).","Comptes rendus. Remédiation."]},
    ]}));

  out.push(...C.seqBlock({ num:"4", titre:"Rédiger correctement une analyse de texte",
    competence:"À la fin de la séquence, l’élève rédigera correctement une analyse de texte.",
    weeks:[
      {s:"S1", items:["Étude de l’œuvre intégrale — Le vieux nègre et la médaille : activités augurales.","Les tonalités : tragique, satirique, polémique.","Les techniques de l’analyse."]},
      {s:"S2", items:["Le vieux nègre et la médaille : texte ouvroir et projet de lecture.","Les liaisons dans la phrase : les prépositions.","Produire une analyse : le développement."]},
      {s:"S3", items:["Le vieux nègre et la médaille : contrôle de lecture.","Relations sémantiques : hyponymie et hyperonymie.","Produire une analyse : l’introduction et la conclusion."]},
      {s:"S4", items:["Intégration (3 h) — Tâche : sur la base d’un texte à contracter, 1) dégager les idées essentielles ; 2) les reformuler ; 3) produire une analyse intégrale."]},
      {s:"S5", items:["Évaluations : épreuve de langue (2 h) ; épreuve de littérature."]},
      {s:"S6", items:["Le vieux nègre et la médaille : correction du contrôle de lecture et remise des copies.","Comptes rendus. Remédiation."]},
    ]}));

  out.push(...C.seqBlock({ num:"5", titre:"Produire méthodiquement une discussion",
    competence:"À la fin de la séquence, l’élève produira méthodiquement une discussion.",
    weeks:[
      {s:"S1", items:["Le vieux nègre et la médaille : lecture méthodique, texte 2.","Les tonalités : épique et dramatique.","Contraction : analyse d’un sujet de discussion (thème, problème, problématique)."]},
      {s:"S2", items:["Le vieux nègre et la médaille : lecture méthodique, textes 3 et 4.","Discussion : élaboration du plan détaillé."]},
      {s:"S3", items:["Le vieux nègre et la médaille : lecture méthodique, texte 5.","Discussion : production d’une discussion complète (introduction, développement, conclusion) (2 h)."]},
      {s:"S4", items:["Intégration — Tâche : sur la base d’un sujet de discussion, produire 1) une introduction ; 2) un développement ; 3) une conclusion."]},
      {s:"S5", items:["Évaluations : épreuve de langue ; épreuve de littérature."]},
      {s:"S6", items:["Le vieux nègre et la médaille : inscription de l’œuvre dans son contexte.","Comptes rendus. Remédiation."]},
    ]}));

  out.push(...C.seqBlock({ num:"6", titre:"Révisions du Baccalauréat",
    competence:"Consolider tous les acquis : traiter chaque type de sujet dans les conditions de l’examen.",
    weeks:[
      {s:"S1", items:["Révisions : résumé et analyse (textes de 550-650 mots, chronométrés).","Révisions : la discussion."]},
      {s:"S2", items:["Révisions : la dissertation (analyse de sujets des annales).","Révisions : l’épreuve de langue (méthode R.A.I.)."]},
      {s:"S3", items:["Épreuve blanche n°1 : littérature (3 h)."]},
      {s:"S4", items:["Épreuve blanche n°2 : langue (2 h). Correction commentée."]},
      {s:"S5", items:["Révision des œuvres : citations, personnages, thèmes, contexte."]},
      {s:"S6", items:["Bilan général et derniers conseils d’examen."]},
    ]}));
  out.push(new Paragraph({ children:[new PageBreak()] }));
  return out;
}

/* ===================== PARTIE 3 — STRUCTURES DES ÉPREUVES ===================== */
function structures(){
  const out=[];
  out.push(...partTitle("Troisième partie","La structure des épreuves du Baccalauréat, série par série"));
  out.push(encadre("À NE JAMAIS CONFONDRE", [
    "Chaque groupe de séries a SA structure d’épreuve. En cas de doute, une seule référence : les consignes officielles du MINESEC de la session en cours.",
  ], "objectif"));
  out.push(spacer(60));
  out.push(H3("Baccalauréat C – D – E – TI : DEUX épreuves distinctes"));
  out.push(C.twoColTable(["Épreuve","Structure officielle"],[
    ["Littérature ou culture générale (3 h, coef 2)","DEUX sujets au choix (le commentaire composé est réservé aux séries A/ABI). Type 1 — Contraction de texte et discussion : texte argumentatif contemporain de 550 à 650 mots ; résumé au 1/4 ou analyse au 1/3 : 9 pts (marge de 10 %, nombre de mots à indiquer) ; discussion d’un problème tiré du texte : 9 pts ; présentation : 2 pts. Type 3 — Dissertation : problématique littéraire ou sujet de culture générale invitant à une réflexion personnelle."],
    ["Langue française (2 h, coef 1)","Un texte littéraire ou non de 250 à 400 mots. Quatre rubriques de 5 pts (Communication ; Morphosyntaxe ; Sémantique/Lexicologie ; Stylistique/Rhétorique), deux questions par rubrique, en a. (repérage/analyse) et b. (interprétation)."],
  ],1900));
  out.push(spacer(80));
  out.push(H3("Baccalauréat / Brevet de technicien STT (ACA, ACC, CG, FIG, ESF, HT, SES)"));
  out.push(C.twoColTable(["Épreuve","Structure officielle"],[
    ["Français (3 h, coef 2)","Deux sujets au choix. Type I — Résumé de texte et langue : texte non littéraire de 400 à 500 mots (500 à 600 en SES) lié au domaine des spécialités ; résumé 10 pts (≈ 1/4, marge ± 12 mots, nombre exact à indiquer) ; langue 8 pts (4 rubriques × 2 pts, sous-questions a/b — désormais 5 à 6 questions des rubriques les plus représentatives) ; présentation 2 pts. Type II — Dissertation littéraire : citation + consigne ; barème critérié 6-6-6-2 (compréhension/pertinence, organisation/cohérence, correction de l’expression, originalité)."],
  ],1900));
  out.push(spacer(80));
  out.push(H3("Baccalauréat industriel F – AF – CI – BT"));
  out.push(C.twoColTable(["Épreuve","Structure officielle"],[
    ["Français (3 h, coef 2)","Deux sujets au choix. Type 1 — Résumé de texte et langue, ou analyse de texte et langue : le résumé porte sur un texte non littéraire de 400 à 500 mots à réduire au 1/4 ; l’analyse, sur un texte d’égale longueur à réduire au 1/3 ; la langue comporte 4 rubriques (communication, morphosyntaxe, sémantique/lexicologie, stylistique/rhétorique) notées 2 pts chacune (repérage, analyse, interprétation). Type 2 — Dissertation de culture littéraire : citation (ou non) d’un écrivain ou d’un critique suivie d’une consigne ; grille critériée annexée au libellé."],
  ],1900));
  out.push(spacer(80));
  out.push(H3("Annexe — Autres examens de l’enseignement technique (repères)"));
  out.push(C.twoColTable(["Examen","Épreuve de français"],[
    ["BP industriel","Deux sujets au choix, 3 h, coef 2 : rédaction d’une lettre administrative (sujet 1) ; rédaction ou exploitation d’un rapport ou d’un compte rendu (sujet 2). Barème type : forme/méthodologie 6 pts, organisation des idées 6 pts, maîtrise de la langue 6 pts, présentation 2 pts."],
    ["BEP industriel","Deux sujets au choix, 3 h, coef 2 : exploitation de texte (texte non littéraire de 400-500 mots : compréhension 5, maniement de la langue 5, expression écrite 8, présentation 2) ; ou dissertation de culture générale (compréhension 6, organisation 6, langue 6, présentation 2)."],
    ["CAP industriel","Étude de texte, 2 h, coef 2 : compréhension 4, maniement de la langue 4, expression écrite 10 (situation-problème : contexte, support, production attendue, trois consignes), présentation 2. Critères : pertinence, cohérence, correction de la langue, originalité."],
    ["CAPIET","Exploitation de texte, 3 h, coef 3 : compréhension 6, maniement de la langue 6, essai 8 (trois sujets de culture générale au choix). Texte d’appui non littéraire de 400 à 500 mots."],
    ["ENIET 1 / 2 / 3","1ère année : étude de texte (compréhension 4, maniement 4, expression 4, présentation 2 ; texte de 150-250 mots), 2 h, coef 2. 2ème année : exploitation de texte (compréhension 4, maniement 4, esprit de synthèse 5, présentation 2 ; texte de 400-500 mots), 3 h, coef 4. 3ème année : culture générale (deux sujets au choix), 2 h, coef 2."],
  ],1350));
  out.push(spacer(60));
  out.push(encadre("ASTUCE — La présentation, deux points gratuits", [
    "Dans toutes les séries, la présentation vaut 2 points : copie propre, alinéas marqués, sauts de ligne entre les parties, décompte des mots indiqué, aucune rature. Ce sont les points les plus faciles de l’examen — les perdre est impardonnable.",
  ], "astuce"));
  out.push(spacer(40));
  out.push(...C.conseilsCandidats("le Baccalauréat"));
  out.push(new Paragraph({ children:[new PageBreak()] }));
  return out;
}

/* ===================== PARTIE 5 — EXERCICES ===================== */
function exercices(){
  const out=[];
  out.push(...partTitle("Cinquième partie","Exercices : contraction et argumentation, niveau Baccalauréat"));
  out.push(P("Textes plus longs, temps compté, exigence maximale : ces exercices reproduisent les conditions du Baccalauréat. Tous les textes sont authentiques et reproduits mot pour mot. Corrigés en ligne pour les exercices marqués #WEB.",{justify:true}));
  out.push(spacer(60));

  /* Étape 1 */
  out.push(H2nb("Étape 1 — Énonciation et circuit argumentatif"));
  out.push(...exo("1","Un texte de sciences sociales  #WEB",[]));
  out.push(...texteSupport(TXN.duverger579));
  bullets([
    "Ressors le système énonciatif du texte et les particularités que son résumé devra conserver.",
    "Établis le circuit argumentatif complet : idée directrice de chaque paragraphe et connecteurs (explicites ou implicites).",
    "Reformule en une phrase la thèse de Duverger sur le progrès technique et les inégalités.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("2","Une argumentation militante",[]));
  out.push(...texteSupport(TXN.ngugi));
  bullets([
    "Dégage le thème, la thèse et le circuit argumentatif du texte.",
    "Quels indices d’énonciation trahissent l’engagement de l’auteur ? Quel problème cela pose-t-il au résumeur ?",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  /* Étape 2 */
  out.push(H2nb("Étape 2 — Les techniques de réduction"));
  out.push(...exo("3","Identifier et appliquer  #WEB",[]));
  out.push(...texteSupport(TXN.delors506));
  bullets([
    "Identifie dans ce texte : deux énumérations réductibles par terme englobant ; une donnée illustrative supprimable ; deux expressions réductibles par nominalisation ou synonymie. Cite les passages exacts.",
    "Applique ces techniques au premier paragraphe : réduis-le au quart.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("4","Gammes sur des paragraphes d’une centaine de mots  #WEB",[
    "Réduis chacun des paragraphes suivants à 30 mots au plus, en notant en marge les techniques utilisées.",
  ]));
  out.push(...texteSupport(TXF.dGassamaDemande));
  out.push(...texteSupport(TXF.dNgomMedias));
  out.push(...texteSupport(TXF2.dTobner));
  out.push(spacer(80));

  out.push(...exo("5","Anecdotes et discours rapportés",[]));
  out.push(...texteSupport(TXN.kelman539));
  bullets([
    "Ce texte enchâsse anecdotes et discours rapportés (le colloque en Belgique, « bon appétit »/« bonne chance »…). Quelle conduite tenir face à chacun dans un résumé ? Face à une analyse ?",
    "Analyse ce texte au tiers de son volume, soit environ "+tiers(TXN.kelman539)+" mots.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  /* Étape 3 */
  out.push(H2nb("Étape 3 — Le décompte des mots et la marge"));
  out.push(...exo("6","Intervalles niveau Baccalauréat  #WEB",[
    "Calcule le volume attendu et la fourchette pour :",
    {b:[
      "un texte de 534 mots, résumé au 1/4, marge 10 % ;",
      "un texte de 585 mots, résumé en 147 mots, marge de 15 mots ;",
      "un texte de 525 mots, résumé en 132 mots, marge de 10 % ;",
      "un texte de 470 mots, résumé en 117 mots, marge de 12 mots ;",
      "un texte de 606 mots, analyse au 1/3, marge 10 %.",
    ]},
  ]));
  out.push(...exo("7","Compter dans les conditions réelles",[
    "Compte les mots du texte suivant selon la convention d’examen, puis calcule résumé au quart et fourchette :",
  ]));
  out.push(...texteSupport(TXN.hebga));
  out.push(spacer(80));

  /* Étape 4 */
  out.push(H2nb("Étape 4 — Contractions complètes"));
  out.push(...exo("8","Sujet complet format BAC C-D-E-TI  #WEB",[]));
  out.push(...texteSupport(EPT.jeuneAfrique));
  bullets(EPT.jeuneAfrique.consignes).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("9","Résumé + discussion : l’aide au développement",[]));
  out.push(...texteSupport(TXF.fraisSiribie606));
  bullets([
    "Résumé (9 pts) : ce texte compte environ "+C.totalMots(TXF.fraisSiribie606)+" mots. Résume-le au quart, soit environ "+quart(TXF.fraisSiribie606)+" mots (marge de 10 %). Indique le nombre de mots utilisés.",
    "Discussion (9 pts) : l’auteur dénonce « l’illusion que l’Aide Publique au Développement sortira le continent africain du sous-développement ». Pensez-vous que l’aide extérieure soit un obstacle plutôt qu’un remède au développement de l’Afrique ? Développement argumenté et illustré d’exemples précis.",
    "Présentation (2 pts).",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("10","Format STT : texte de spécialité  #WEB",[]));
  out.push(...texteSupport(TXF.fraisNgom526));
  bullets([
    "Résumé (10 pts) : ce texte compte environ "+C.totalMots(TXF.fraisNgom526)+" mots. Résume-le en "+quart(TXF.fraisNgom526)+" mots environ (marge de 12 mots). Indique le nombre exact de mots utilisés.",
    "Langue (8 pts) : a) « la migration est le plus souvent utilisée à des fins de campagne politique » : identifie la voix employée et son effet ; b) construis le champ lexical de la politique ; c) explique « instrumentalisation » et donne sa formation ; d) quel est le type de ce texte ? Justifie par deux indices.",
    "Présentation (2 pts).",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("11","L’analyse au tiers sur texte scientifique",[]));
  out.push(...texteSupport(TXN.gelin));
  bullets([
    "Dégage le thème et la thèse de ce texte consacré à l’intelligence artificielle.",
    "Analyse-le au tiers de son volume, soit environ "+tiers(TXN.gelin)+" mots : 3e personne, verbes de démarche variés.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("12","Sujet d’actualité camerounaise",[]));
  out.push(...texteSupport(TXN.nganang));
  bullets([
    "Résume ce texte au quart, soit environ "+quart(TXN.nganang)+" mots (marge de 10 %).",
    "En deux phrases, dis ce qui distingue la position de l’auteur d’un simple compte rendu journalistique.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  /* Étape 5 */
  out.push(H2nb("Étape 5 — L’argumentation : dissertation de Terminale"));
  out.push(P("Au Baccalauréat, le sujet de dissertation dépend de ta série : chaque filière traite les genres de son programme. Repère d’abord ton pool de sujets, puis entraîne-toi dessus en priorité.",{justify:true}));
  out.push(C.sujetsParSerie(SUJ.parSerieTle));
  out.push(spacer(60));
  out.push(H3("Banque de sujets par genre"));
  out.push(...C.sujetsListe("Roman (C/D/E, TI, ESF/HT, ACA…)", SUJ.roman));
  out.push(...C.sujetsListe("Théâtre (C/D/E, ACA…)", SUJ.theatre));
  out.push(...C.sujetsListe("Engagement & société (toutes séries)", SUJ.engagementSociete));
  out.push(...C.sujetsListe("Culture générale (industriel, STT)", SUJ.cultureGenerale));
  out.push(spacer(40));
  out.push(...exo("13","Analyser des sujets du niveau Bac  #WEB",[
    "Pour chacun de ces sujets : identifie le type de plan et son indice ; précise le domaine d’application (ouvert/fermé) ; reformule la citation en phrase minimale ; formule la problématique ; propose deux œuvres d’appui.",
    {b:[ EPT.sujetsTle[0], EPT.sujetsTle[2], EPT.sujetsTle[3], EPT.sujetsTle[4] ]},
  ]));
  out.push(...exo("14","Reformulation et problématique",[
    "Reformule la citation de chaque sujet en une phrase minimale, puis formule la problématique adaptée :",
    {b:[ EPT.sujetsTle[6], EPT.sujetsTle[10], EPT.sujetsTle[11] ]},
  ]));
  out.push(...exo("15","Le plan détaillé  #WEB",[
    "Sujet (BAC ACA 2021) : Jacques Lacarrière affirme : « Les gens ne s’intéressent pas aux héros heureux. Il leur faut du tragique, du mythique, du monstrueux, du terrifiant. » Justifiez ces propos à la lumière des œuvres littéraires lues et/ou étudiées.",
    "Élabore le plan détaillé complet : chaque argument avec son explication (« En d’autres termes… ») et son exemple exploité (Ngum a Jemea, Le vieux nègre et la médaille, ou toute œuvre lue).",
  ]));
  out.push(...exo("16","Rédaction complète guidée",[
    "Sujet : Friedrich Nietzsche affirme : « L’artiste a le pouvoir de réveiller la force d’agir qui sommeille dans d’autres âmes. » Montrez en quoi cette déclaration éclaire le rôle de l’écrivain dans la société.",
    {b:[
      "Rédige l’introduction (amener par le contexte du théâtre engagé camerounais, poser la citation et la problématique, annoncer).",
      "Rédige deux paragraphes argumentatifs complets (A.E.E.B.), l’un appuyé sur Ngum a Jemea, l’autre sur Le vieux nègre et la médaille.",
      "Rédige la conclusion (bilan + ouverture vers un autre art ou une autre époque).",
    ]},
  ]));
  out.push(...exo("17","De l’argument à l’exemple  #WEB",[
    "Sujet : « L’œuvre littéraire est-elle au service de la société ? ». Pour chacun des arguments suivants, rédige l’explication (« Autrement dit… ») puis propose et commente DEUX œuvres qui l’illustrent (respecte le domaine d’application de ta série) :",
    {b:[
      "Argument 1 : l’écrivain expose les tares qui gangrènent sa société.",
      "Argument 2 : son but est de provoquer une prise de conscience chez le lecteur.",
      "Argument 3 : il propose aussi un plan de reconstruction pour améliorer la condition humaine.",
    ]},
    {enc:{titre:"REPÈRE — Un argument se prouve, un exemple s’exploite", corps:[
      "Un argument sans exemple est une opinion ; un exemple sans argument est un catalogue. Le bon paragraphe énonce l’idée, l’explique (« C’est-à-dire… »), puis convoque une œuvre en montrant PRÉCISÉMENT en quoi elle prouve l’idée (un personnage, une scène, un choix d’écriture), avant une phrase-bilan.",
    ], type:"repere"}},
  ]));
  out.push(...exo("18","La banque de sujets du Baccalauréat  #WEB",[
    "Traite, au brouillon, l’analyse complète (type, problématique, plan sommaire, exemples) d’un sujet par semaine, en choisissant dans le pool de ta série :",
    {b: EPT.sujetsTle.slice(5,10).concat([EPT.sujetsTle[12]]) },
  ]));
  out.push(...exo("19","Corriger une introduction fautive",[
    "Introduction d’élève (sujet Lacarrière) : « De tout temps, l’homme a toujours aimé la littérature. Jacques Lacarrière a dit que les gens ne s’intéressent pas aux héros heureux. Je vais montrer qu’il a raison. Dans une première partie je vais parler des héros malheureux et dans une deuxième partie je vais donner des exemples. »",
    {b:[
      "Relève au moins cinq défauts (amorce banale et fausse, citation tronquée sans guillemets complets ni source, absence de problématique, annonce mécanique et non conceptuelle, confusion argument/exemple).",
      "Récris cette introduction dans les règles.",
    ]},
  ]));
  out.push(new Paragraph({ children:[new PageBreak()] }));
  return out;
}

/* ===================== PARTIE 6 — ÉPREUVES TYPES ===================== */
function epreuves(){
  const out=[];
  out.push(...partTitle("Sixième partie","Épreuves types et sujets officiels (corrigés en ligne)"));
  out.push(P("Cinq épreuves complètes, chacune dans le format exact de sa série — dont deux sujets officiels du Baccalauréat STT. À traiter en conditions réelles.",{justify:true}));
  out.push(spacer(60));

  out.push(H2nb("Épreuve n°1 — BAC C-D-E-TI : langue française  #WEB"));
  out.push(...C.epreuveBlock(EPT.oyonoLangue));

  out.push(H2nb("Épreuve n°2 — BAC C-D-E-TI : littérature  #WEB"));
  out.push(...C.epreuveBlock(EPT.tchatchouaLitt));
  out.push(H3("Sujet de type 3 — Dissertation (au choix avec le type 1)"));
  out.push(encadre("Sujet", [
    EPT.sujetsTle[2],
    "Grille d’évaluation : pertinence, cohérence, correction de la langue, originalité (grille critériée annexée au libellé).",
  ], "methode"));
  out.push(spacer(120));

  out.push(H2nb("Épreuve n°3 — BAC ACA/ACC/CG/FIG, session 2021 (sujet officiel)  #WEB"));
  out.push(...C.epreuveBlock(EPT.ocdeBAC));

  out.push(H2nb("Épreuve n°4 — BAC ACA/ACC/CG/FIG, épreuve zéro (sujet officiel)  #WEB"));
  out.push(...C.epreuveBlock(EPT.laurasBAC));

  out.push(H2nb("Épreuve n°5 — BAC industriel F-AF-CI-BT (épreuve type)  #WEB"));
  out.push(P([{t:"Le candidat traitera l’un des deux sujets au choix.", italics:true, bold:true}],{after:80}));
  out.push(H3("Sujet de type 1 — Résumé de texte et langue"));
  out.push(...texteSupport(TXN.montassier));
  bullets([
    "Résumé (10 pts) : ce texte compte environ "+C.totalMots(TXN.montassier)+" mots. Résume-le au quart, soit environ "+quart(TXN.montassier)+" mots (marge de 10 %). Indique le nombre de mots utilisés.",
    "Langue (8 pts) — Communication (2 pts) : qui parle et à qui ? Justifie par deux indices ; quelle est la fonction de langage dominante ? — Morphosyntaxe (2 pts) : relève un connecteur logique, donne sa nature et son rôle dans l’argumentation ; analyse la structure d’une phrase complexe du texte. — Sémantique/Lexicologie (2 pts) : explique deux expressions du texte ; construis le champ lexical de la culture. — Stylistique/Rhétorique (2 pts) : identifie une figure de style et son effet ; à quel type appartient ce texte ? Justifie.",
    "Présentation (2 pts).",
  ]).forEach(b=>out.push(b));
  out.push(spacer(60));
  out.push(H3("Sujet de type 2 — Dissertation de culture littéraire"));
  out.push(encadre("Sujet", [
    "Pour Guy de Maupassant, l’œuvre littéraire a pour fonction de réveiller les consciences et d’affirmer son refus de voir l’humanité se déchirer.",
    "En vous appuyant sur des œuvres lues ou étudiées, expliquez et discutez ces propos.",
    "Grille critériée : compréhension/pertinence 6 pts ; organisation/cohérence 6 pts ; correction de l’expression 6 pts ; originalité 2 pts.",
  ], "methode"));
  out.push(spacer(80));

  out.push(H2nb("Entraînement supplémentaire — texte support de 525 mots  #WEB"));
  out.push(...texteSupport(EPT.nug));
  bullets(EPT.nug.consignes).forEach(b=>out.push(b));
  out.push(spacer(80));
  out.push(C.renvoiWeb("Corrigés EST — Terminale scientifique & technique"));
  return out;
}

/* ===================== PARTIE 7 — BANQUE DE CITATIONS ===================== */
function citations(){
  const out=[];
  out.push(...partTitle("Septième partie","Banque de citations pour la dissertation"));
  out.push(...C.citationBank(CIT.THEMES));
  out.push(encadre("ASTUCE — Une citation par thème, apprise par cœur", [
    "N’essaie pas de tout retenir. Choisis dans chaque thème UNE citation courte que tu comprends parfaitement, apprends-la avec son auteur, et entraîne-toi à l’intégrer dans une phrase (« Comme le dit X, “…”, ce qui montre que… »). Cinq citations sûres valent mieux que trente approximatives.",
  ], "astuce"));
  return out;
}

module.exports = { avantPropos, programme, progression, structures, exercices, epreuves, citations };
