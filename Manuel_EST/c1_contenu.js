/* =====================================================================
   VÉRITAS — Français 1ère Scientifique & Technique — contenu
   ===================================================================== */
const R = require("./render");
const C = require("./common");
const TXC = require("./tx_corpus");
const TXN = require("./tx_net");
const TXF = require("./tx_frais");
const TXF2 = require("./tx_frais2");
const EP1 = require("./tx_epreuves_1ere");
const EPT = require("./tx_epreuves_tle"); // barème dissertation STT
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
    P("Ce document accompagne l’élève de 1ère des séries scientifiques et techniques (1ères C/D, TI, E, ESF-HT, ACA-ACC-FIG-CG-SES) jusqu’au Probatoire. Il rassemble : le programme officiel et son cadrage, la progression semaine par semaine, la structure exacte des épreuves — série par série, car elles diffèrent et ne doivent jamais être confondues —, les méthodes des exercices, un entraînement massif à la contraction de texte et à l’argumentation sur des textes authentiques, et des épreuves types dont plusieurs sujets officiels récents.",{justify:true}),
    P("Le Probatoire se gagne sur deux exercices : la contraction (comprendre, réduire, discuter) et la dissertation (problématiser, organiser, illustrer). Ce document leur consacre l’essentiel de ses pages, en suivant la même démarche que le cours : d’abord les techniques une à une, puis les gammes, enfin les conditions réelles.",{justify:true}),
    P("Les corrigés des épreuves types et des exercices marqués #WEB sont publiés en ligne sur l’Espace Manuels du Centre VÉRITAS (veritas-school.com).",{justify:true}),
    C.renvoiWeb("Corrigés EST — 1ère scientifique & technique"),
    new Paragraph({ children:[new PageBreak()] }),
  ];
}

/* ===================== PARTIE 1 — PROGRAMME ===================== */
function programme(){
  const out=[];
  out.push(...partTitle("Première partie","Le programme officiel de 1ère"));
  out.push(P("Le programme de français de 1ère se décline en trois compétences de base : lire pour apprécier des œuvres littéraires (roman, théâtre, essai) ; utiliser les outils de la langue pour apprécier les effets de sens ; produire divers types de textes à l’écrit comme à l’oral. Volumes horaires et coefficients selon la série :",{justify:true}));
  out.push(C.twoColTable(["Série","Volume & coefficients"],[
    ["1ères C / D (scientifiques)","108 h/an — 3 h/semaine. Littérature : coef 2 ; Langue : coef 1."],
    ["1ère TI (Techniques Industrielles)","108 h/an — 3 h/semaine. Littérature : coef 2 ; Langue : coef 1."],
    ["1ère E","108 h/an — 3 h/semaine. Littérature : coef 2 ; Langue : coef 1."],
    ["1ères ESF / HT (tertiaire)","108 h/an — 3 h/semaine. Littérature : coef 2 ; Langue : coef 1."],
    ["1ères ACA / ACC / FIG / CG / SES (tertiaire)","144 h/an — 4 h/semaine. Littérature : coef 3 ; Langue : coef 1."],
  ],1900));
  out.push(spacer(80));
  out.push(H3("Cadrage des œuvres par série"));
  out.push(C.twoColTable(["Série","Œuvres au programme"],[
    ["C / D, TI, ESF / HT, ACA…","Œuvres principales (étude systématique) : 1. un roman français du XIXe siècle ; 2. une œuvre théâtrale africaine du XXe / XXIe siècle. Œuvre secondaire : un essai. Les œuvres principales font l’objet d’une lecture intégrale et d’une étude approfondie ; les secondaires d’une lecture intégrale mais d’une étude plus rapide."],
    ["1ère E","Œuvres principales : 1. une œuvre théâtrale africaine du XXe siècle ; 2. un essai."],
  ],1550));
  out.push(spacer(60));
  bullets([
    "La progression de cette année retient : Au cœur des ténèbres de Joseph Conrad (roman) et Le lion et la perle de Wole Soyinka (théâtre africain).",
    "L’épreuve de langue « comportera les quatre rubriques habituelles ; chaque rubrique comportera deux questions » (programme officiel).",
    "« Dans la mesure du possible, les textes supports des cours de langue auront un lien avec la spécialité (textes fonctionnels, utilitaires). »",
  ]).forEach(b=>out.push(b));
  out.push(encadre("ASTUCE — L’essai, l’allié invisible", [
    "L’essai au programme n’est pas une lecture d’agrément : c’est un réservoir de thèses et d’arguments directement réutilisables en discussion comme en dissertation. Fiche chaque chapitre : thèse, deux arguments, un exemple, une phrase citable.",
  ], "astuce"));
  out.push(new Paragraph({ children:[new PageBreak()] }));
  return out;
}

/* ===================== PARTIE 2 — PROGRESSION ===================== */
function progression(){
  const out=[];
  out.push(...partTitle("Deuxième partie","Progression annuelle, semaine par semaine (1ère C/D)"));
  out.push(P("Six séquences de six semaines : trois semaines de leçons (1 h lecture + 1 h langue + 1 h expression), une semaine d’intégration, une semaine d’évaluations (langue 2 h, littérature 3 h), une semaine de comptes rendus et de remédiation. Les autres séries suivent la même architecture, les textes supports étant, autant que possible, liés à la spécialité.",{justify:true}));
  out.push(spacer(60));

  out.push(...C.seqBlock({ num:"I", titre:"Bâtir un plan détaillé de dissertation",
    competence:"À la fin de la séquence, l’élève devra bâtir un plan détaillé de dissertation. Famille de situations : utilisation de l’écrit et de l’oral pour produire divers types de textes (réalisation d’un exercice scolaire : la dissertation).",
    weeks:[
      {s:"S1", items:["Au cœur des ténèbres de Joseph Conrad : activités augurales (étude des paratextes et texte ouvroir).","La communication par l’image.","La dissertation : analyse du sujet."]},
      {s:"S2", items:["Lecture autonome : tenue du journal de lecture (hors horaire).","La ponctuation faible ou basse.","Le champ lexical.","La dissertation : recherche des idées."]},
      {s:"S3", items:["Lecture autonome : tenue du journal de lecture (hors horaire).","Les facteurs de la communication.","Le texte descriptif : caractéristiques et fonctions.","Élaboration du plan détaillé."]},
      {s:"S4", items:["Intégration — Tâche : sur la base d’un sujet de dissertation, 1) tu analyseras le sujet ; 2) tu rechercheras les idées ; 3) tu élaboreras un plan détaillé."]},
      {s:"S5", items:["Évaluations : langue française (2 h) ; littérature (3 h)."]},
      {s:"S6", items:["Comptes rendus (2 h).","Remédiation (1 h)."]},
    ]}));

  out.push(...C.seqBlock({ num:"II", titre:"Produire un développement de dissertation entier",
    competence:"À la fin de la séquence, l’élève devra produire un développement de dissertation entier.",
    weeks:[
      {s:"S1", items:["Les fonctions de la communication.","La ponctuation forte.","Rédaction des chapeaux introductifs."]},
      {s:"S2", items:["Texte 1 : lecture méthodique.","Lexique commun, lexique spécialisé.","Rédaction du paragraphe de dissertation."]},
      {s:"S3", items:["Texte 2 : lecture analytique.","Le texte narratif : caractéristiques et fonctions.","Rédaction de la transition."]},
      {s:"S4", items:["Intégration — Tâche : sur la base d’un plan de dissertation, tu produiras un développement comportant 1) les chapeaux introductifs ; 2) les paragraphes argumentatifs ; 3) la transition majeure."]},
      {s:"S5", items:["Évaluations : langue française (2 h) ; littérature (3 h)."]},
      {s:"S6", items:["Texte 3 : lecture expliquée.","Comptes rendus. Remédiation (1 h)."]},
    ]}));

  out.push(...C.seqBlock({ num:"III", titre:"Produire un devoir de dissertation complet",
    competence:"À la fin de la séquence, l’élève devra produire un devoir de dissertation complet.",
    weeks:[
      {s:"S1", items:["Texte 4 : lecture suivie.","Structure de la phrase simple et composée.","La dissertation : rédaction de l’introduction."]},
      {s:"S2", items:["Texte 5 : lecture méthodique.","Le texte argumentatif : caractéristiques et fonctions.","Les modes de raisonnement (déduction, induction, analogie…)."]},
      {s:"S3", items:["Au cœur des ténèbres : inscription de l’œuvre dans son contexte.","Structure de la phrase complexe.","La dissertation : rédaction de la conclusion."]},
      {s:"S4", items:["Intégration — Tâche : sur la base d’un sujet de dissertation, tu produiras un devoir complet : introduction, développement (un paragraphe au choix et révision de la structure intégrale), conclusion."]},
      {s:"S5", items:["Évaluations : langue française (2 h) ; littérature (3 h)."]},
      {s:"S6", items:["Compte rendu (1 h).","Remédiation (2 h)."]},
    ]}));

  out.push(...C.seqBlock({ num:"IV", titre:"Reformuler les idées d’un texte à contracter",
    competence:"À la fin de la séquence, l’élève devra reformuler les idées d’un texte à contracter.",
    weeks:[
      {s:"S1", items:["Le lion et la perle de Wole Soyinka : activités augurales, lecture du texte ouvroir.","Le texte théâtral : didascalies et répliques.","Contraction de texte : analyse globale du texte (thème, thèse)."]},
      {s:"S2", items:["Lecture autonome : journal de lecture (hors horaire).","De la phrase au paragraphe : cohérence et cohésion.","Les tonalités dramatique et comique.","Contraction : circuit argumentatif du texte."]},
      {s:"S3", items:["Lecture autonome : journal de lecture (hors horaire).","La progression thématique.","Lexique commun / lexique spécialisé.","Contraction : reformulation des idées maîtresses de chaque paragraphe."]},
      {s:"S4", items:["Intégration — Tâche : sur la base d’un texte à contracter, 1) dégager le thème et la thèse ; 2) dégager et reformuler les idées directrices et secondaires de chaque paragraphe."]},
      {s:"S5", items:["Évaluations : langue française (2 h) ; littérature (3 h)."]},
      {s:"S6", items:["Lecture méthodique : texte 1.","Compte rendu. Remédiation."]},
    ]}));

  out.push(...C.seqBlock({ num:"V", titre:"Produire un résumé et une analyse",
    competence:"À la fin de la séquence, l’élève produira un résumé et une analyse.",
    weeks:[
      {s:"S1", items:["Lecture analytique : texte 2.","Les figures de style : comparaison, métaphore, personnification.","Contraction : rédaction du résumé."]},
      {s:"S2", items:["Lecture méthodique : texte 3.","Le monologue introspectif.","Contraction : rédaction de l’analyse."]},
      {s:"S3", items:["Lecture expliquée : texte 4.","La tonalité lyrique.","Contraction : résumé et analyse, tableau des divergences."]},
      {s:"S4", items:["Intégration — Tâche : sur la base du circuit argumentatif d’un texte à contracter, tu produiras 1) un résumé ; 2) une analyse."]},
      {s:"S5", items:["Évaluations : épreuve de langue (2 h) ; épreuve de littérature (3 h)."]},
      {s:"S6", items:["Comptes rendus. Remédiation."]},
    ]}));

  out.push(...C.seqBlock({ num:"VI", titre:"Produire un devoir de contraction de texte complet",
    competence:"À la fin de la séquence, l’élève produira un devoir de contraction de texte complet.",
    weeks:[
      {s:"S1", items:["Lecture méthodique : texte 5.","Les figures de style : anaphore, hyperbole, gradation.","La discussion : analyse du sujet et élaboration du plan."]},
      {s:"S2", items:["Le lion et la perle : inscription de l’œuvre dans son contexte.","Le monologue délibératif.","La discussion : rédaction du développement."]},
      {s:"S3", items:["Travaux dirigés.","La tonalité tragique.","La discussion : rédaction de l’introduction et de la conclusion."]},
      {s:"S4", items:["Intégration — Tâche : sur la base d’un sujet de discussion, tu rédigeras 1) une introduction ; 2) un développement (un paragraphe au choix) ; 3) une conclusion."]},
      {s:"S5", items:["Évaluations : épreuve de langue française (2 h) ; littérature (3 h)."]},
      {s:"S6", items:["Compte rendu. Remédiation. Révisions générales pour le Probatoire."]},
    ]}));
  out.push(new Paragraph({ children:[new PageBreak()] }));
  return out;
}

/* ===================== PARTIE 3 — STRUCTURE DES ÉPREUVES ===================== */
function structures(){
  const out=[];
  out.push(...partTitle("Troisième partie","La structure des épreuves du Probatoire, série par série"));
  out.push(encadre("À NE JAMAIS CONFONDRE", [
    "Chaque groupe de séries a SA structure d’épreuve. Réviser sur le mauvais format, c’est préparer un autre examen que le sien. En cas de doute, une seule référence : les consignes officielles du MINESEC de la session en cours.",
  ], "objectif"));
  out.push(spacer(60));
  out.push(H3("Probatoire C – D – E – TI : DEUX épreuves distinctes"));
  out.push(C.twoColTable(["Épreuve","Structure officielle"],[
    ["Littérature ou culture générale (3 h, coef 2)","Deux sujets au choix. Type 1 — Contraction de texte et discussion : texte argumentatif contemporain de 550 à 650 mots ; résumé au 1/4 (ou analyse au 1/3) : 9 pts, marge de 10 %, nombre de mots à indiquer ; discussion d’une citation tirée du texte : 9 pts ; présentation : 2 pts. Type 2 — Dissertation : citation + consigne, prenant appui sur les œuvres du programme."],
    ["Langue française (2 h, coef 1)","Un texte littéraire ou non de 250 à 400 mots. Quatre rubriques de 5 pts : I. Communication ; II. Morphosyntaxe ; III. Sémantique/Lexicologie ; IV. Stylistique/Rhétorique des textes. Deux questions par rubrique, chacune en a. (repérage/analyse, 1,5 à 2 pts) et b. (interprétation, 0,5 à 1 pt)."],
  ],1900));
  out.push(spacer(80));
  out.push(H3("Probatoire STT (ACA, ACC, CG, FIG, ESF, HT, SES) : UNE épreuve"));
  out.push(C.twoColTable(["Épreuve","Structure officielle"],[
    ["Français (3 h, coef 2)","Deux sujets au choix. Type I — Résumé de texte et langue : texte non littéraire de 400 à 500 mots (500 à 600 en SES) lié au domaine de spécialité ; résumé : 10 pts (≈ 1/4, marge ± 12 mots, nombre exact à indiquer) ; langue : 8 pts (4 rubriques × 2 pts, sous-questions a/b) ; présentation : 2 pts. Type II — Dissertation littéraire : citation + consigne ; barème critérié : compréhension/pertinence 6 pts, organisation/cohérence 6 pts, correction de l’expression 6 pts, originalité 2 pts."],
  ],1900));
  out.push(spacer(80));
  out.push(H3("Probatoire industriel F – AF – CI – BT"));
  out.push(C.twoColTable(["Épreuve","Structure (épreuve zéro 2020, IP-LAL)"],[
    ["Français (3 h, coef 3)","Trois sujets au choix. Type I — Exploitation de texte : compréhension 4 pts ; langue française 4 pts ; esprit de synthèse 5 pts (résumé d’une partie du texte, marge indiquée) ; expression écrite 5 pts ; présentation 2 pts. Type II — Dissertation littéraire. Type III — Dissertation de culture générale."],
    ["Variante (descriptif du programme)","Deux sujets au choix, coef 2 : type 1 = résumé (texte non littéraire de 400 à 500 mots, au 1/4) ou analyse (au 1/3) + langue (4 rubriques × 2 pts) ; type 2 = dissertation de culture littéraire (citation + consigne, grille critériée). → Se conformer à la consigne MINESEC de la session."],
  ],1900));
  out.push(spacer(60));
  out.push(spacer(40));
  out.push(...C.conseilsCandidats("le Probatoire"));
  out.push(new Paragraph({ children:[new PageBreak()] }));
  return out;
}

/* ===================== PARTIE 5 — EXERCICES ===================== */
function exercices(){
  const out=[];
  out.push(...partTitle("Cinquième partie","Exercices : contraction et argumentation, niveau Probatoire"));
  out.push(P("Même démarche qu’en cours : comprendre (étape 1), réduire technique par technique (étape 2), compter (étape 3), produire (étape 4), argumenter (étape 5). Tous les textes sont authentiques et reproduits mot pour mot. Corrigés en ligne pour les exercices marqués #WEB.",{justify:true}));
  out.push(spacer(60));

  /* Étape 1 */
  out.push(H2nb("Étape 1 — Énonciation et circuit argumentatif"));
  out.push(...exo("1","Un classique : Valéry  #WEB",[]));
  out.push(...texteSupport(TXC.valery));
  bullets([
    "Ressors le système énonciatif du texte (personnes, temps, types de phrases). Quelle particularité son résumé devra-t-il conserver ?",
    "Présente le circuit argumentatif du texte ; pour chaque mouvement, précise, si possible, le connecteur introducteur.",
    "Formule en une phrase la distinction centrale que fait Valéry entre les deux « leçons ».",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("2","Deux textes, deux énonciations",[]));
  out.push(...texteSupport(TXC.marcotte));
  bullets([
    "Compare le système énonciatif de ce texte avec celui de Valéry (exercice 1) : implication de l’énonciateur, destinataire, tonalité.",
    "L’auteur soutient une thèse provocante (« la littérature est inutile ») pour mieux la retourner : reconstitue ce mouvement en trois phrases.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  /* Étape 2 */
  out.push(H2nb("Étape 2 — Les techniques de réduction"));
  out.push(...exo("3","Terme englobant, synonyme, interrogation indirecte  #WEB",[]));
  out.push(...texteSupport(TXC.igue));
  out.push(...texteSupport(TXC.kizerbo));
  bullets([
    "Utilise le terme englobant pour réduire les énumérations (« traversé les déserts, les mers et les montagnes »…).",
    "Propose des synonymes plus brefs pour les expressions longues (« opacité profonde », « libérateurs au long cours »…).",
    "Transforme, en la réduisant, l’interrogation directe du premier texte en une interrogation indirecte.",
    "Dans le second texte, explique en quoi le passage sur les serments du roi est une expansion de l’idée du dicton. Doit-on en tenir compte dans le résumé ?",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("4","Identifier les techniques applicables",[]));
  out.push(...texteSupport(TXC.tagne));
  bullets([
    "Repère dans ce texte : une énumération réductible par terme englobant ; une redondance ; un exemple supprimable ; une expression réductible par nominalisation ou synonymie. Cite à chaque fois le passage exact.",
    "Applique ces techniques : réduis le texte au quart, soit environ "+quart(TXC.tagne)+" mots.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("5","La question des exemples  #WEB",[]));
  out.push(...texteSupport(TXC.kelman));
  bullets([
    "Relève les exemples et anecdotes de ce texte ; précise leur type et la conduite à tenir pour le résumé.",
    "La phrase « le dominant n’a jamais libéré le dominé » est-elle un exemple ou un argument ? Que devient-elle dans le résumé ?",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("6","Chiffres, notes et citations",[]));
  out.push(...texteSupport(TXC.lugan));
  bullets([
    "Ce texte est saturé de données chiffrées et de citations. Identifie au moins deux techniques de réduction utilisables et applique-les au premier paragraphe.",
    "Que fait-on, dans un résumé, d’une citation rapportée par l’auteur (celle de Carlos Ghosn) ?",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("7","Gammes sur des paragraphes d’une centaine de mots  #WEB",[
    "Réduis chacun des paragraphes suivants à 25-35 mots, en notant en marge la ou les techniques utilisées.",
  ]));
  out.push(...texteSupport(TXF.dGassamaConcession));
  out.push(...texteSupport(TXF.dDembeleCapitalisme));
  out.push(...texteSupport(TXF.dNgomTontines));
  out.push(...texteSupport(TXF2.dDioufChiffres));
  out.push(...texteSupport(TXF2.dCastanou));
  out.push(spacer(80));

  /* Étape 3 */
  out.push(H2nb("Étape 3 — Le décompte des mots et la marge"));
  out.push(...exo("8","Intervalles de réduction niveau Probatoire  #WEB",[
    "Calcule le volume attendu du résumé et sa fourchette pour :",
    {b:[
      "un texte de 534 mots à réduire au 1/4, marge de 10 % ;",
      "un texte de 585 mots à réduire au 1/4, marge de 15 mots en plus ou en moins ;",
      "un texte de 485 mots à réduire en 121 mots, marge de 12 mots ;",
      "un texte de 470 mots à réduire au 1/3 (analyse), marge de 10 %.",
    ]},
  ]));
  out.push(...exo("9","Combien de mots comptent ces textes ?",[
    "Compte les mots des deux textes suivants selon la convention d’examen, puis calcule le volume du résumé au quart et sa fourchette (± 10 %).",
  ]));
  out.push(...texteSupport(TXC.zemmouri));
  out.push(...texteSupport(TXF.dNgomVoieTerrestre));
  out.push(spacer(80));

  /* Étape 4 */
  out.push(H2nb("Étape 4 — Contractions complètes"));
  out.push(...exo("10","Format Probatoire C-D-E-TI  #WEB",[]));
  out.push(...texteSupport(TXN.djarmailaDiscipline));
  bullets([
    "Résumé (9 pts) : ce texte compte environ "+C.totalMots(TXN.djarmailaDiscipline)+" mots. Résume-le au quart, soit environ "+quart(TXN.djarmailaDiscipline)+" mots (marge de 10 %). Indique le nombre de mots utilisés.",
    "Discussion (9 pts) : l’auteur estime qu’« il faut repenser la discipline scolaire ». Pensez-vous que le retour à une discipline plus stricte suffise à restaurer l’école ? Vous répondrez dans un développement argumenté illustré d’exemples précis.",
    "Présentation (2 pts).",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("11","Format STT : résumé sur 10 points  #WEB",[]));
  out.push(...texteSupport(TXF.fraisNgom507));
  bullets([
    "Résumé (10 pts) : ce texte compte environ "+C.totalMots(TXF.fraisNgom507)+" mots. Résume-le en "+quart(TXF.fraisNgom507)+" mots environ (marge de 12 mots). Indique le nombre exact de mots utilisés.",
    "Langue (8 pts) : a) relève un connecteur logique et donne sa valeur ; b) construis le champ lexical de l’économie familiale ; c) explique « économie domestique » ; d) à quel type appartient ce texte ? Justifie par deux indices.",
    "Présentation (2 pts).",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("12","L’analyse (réduction au tiers)",[]));
  out.push(...texteSupport(TXC.tazieff));
  bullets([
    "Analyse ce texte au tiers de son volume, soit environ "+tiers(TXC.tazieff)+" mots : 3e personne, verbes de démarche variés, regroupements autorisés.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(60));

  out.push(...exo("13","Résumé d’un texte de spécialité (éducation)",[]));
  out.push(...texteSupport(TXN.fozing));
  bullets([
    "Dégage le thème, la thèse et le circuit argumentatif.",
    "Résume ce texte au quart, soit environ "+quart(TXN.fozing)+" mots. Indique le nombre de mots utilisés.",
  ]).forEach(b=>out.push(b));
  out.push(spacer(60));

  out.push(...exo("14","Résumé + discussion sur un texte engagé  #WEB",[]));
  out.push(...texteSupport(TXF.fraisGassama431));
  bullets([
    "Résumé (9 pts) : ce texte compte environ "+C.totalMots(TXF.fraisGassama431)+" mots. Résume-le au quart, soit environ "+quart(TXF.fraisGassama431)+" mots (marge de 10 %).",
    "Discussion (9 pts) : les auteurs affirment : « Nos gouvernants ont trahi leurs peuples ». Pensez-vous que les difficultés de l’Afrique s’expliquent d’abord par la responsabilité de ses dirigeants ? Développement argumenté et illustré d’exemples précis.",
    "Présentation (2 pts).",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  out.push(...exo("15","Un débat de société : les mariages forcés  #WEB",[]));
  out.push(...texteSupport(TXF2.fraisDiouf));
  bullets([
    "Résumé (9 pts) : ce texte compte environ "+C.totalMots(TXF2.fraisDiouf)+" mots. Résume-le au quart, soit environ "+quart(TXF2.fraisDiouf)+" mots (marge de 10 %). Indique le nombre de mots utilisés.",
    "Discussion (9 pts) : les auteurs jugent le relativisme culturel « un non-sens » lorsqu’il sert à justifier le mariage forcé. Pensez-vous qu’au nom du respect des cultures on doive tolérer toutes les traditions ? Vous répondrez dans un développement argumenté illustré d’exemples précis.",
    "Présentation (2 pts).",
  ]).forEach(b=>out.push(b));
  out.push(spacer(80));

  /* Étape 5 */
  out.push(H2nb("Étape 5 — L’argumentation : discussion et dissertation"));
  out.push(P("Au Probatoire, le sujet de dissertation dépend de ta série : chaque filière traite les genres de son programme. Repère ton pool, entraîne-toi dessus en priorité.",{justify:true}));
  out.push(C.sujetsParSerie(SUJ.parSerie1ere));
  out.push(spacer(50));
  out.push(H3("Banque de sujets par genre"));
  out.push(...C.sujetsListe("Roman (toutes séries)", SUJ.roman));
  out.push(...C.sujetsListe("Théâtre (toutes séries)", SUJ.theatre));
  out.push(...C.sujetsListe("Engagement & société (essai, toutes séries)", SUJ.engagementSociete));
  out.push(...C.sujetsListe("Culture générale (STT, industriel)", SUJ.cultureGenerale));
  out.push(spacer(40));
  out.push(...exo("16","Analyser des sujets de discussion du Probatoire  #WEB",[
    "Pour chacun de ces sujets officiels : délimite le libellé et la consigne ; reformule la citation en une phrase minimale (sujet-verbe-complément) ; dégage le thème puis le problème ; formule la problématique (interrogation totale avec adverbe restrictif) ; donne la thèse et l’antithèse.",
    {b: TXC.sujetsDiscussion1ere.slice(0,4).map(s=>s.ref+" — "+s.txt) },
  ]));
  out.push(...exo("17","Reformulation en phrase minimale",[
    "Reformule la citation de chacun de ces sujets en une phrase minimale, puis formule la problématique :",
    {b: TXC.sujetsDiscussion1ere.slice(4).map(s=>s.txt) },
    {enc:{titre:"REPÈRE — Thèse, antithèse", corps:[
      "La thèse est le point de vue de l’auteur (le « oui » de la problématique). L’antithèse n’invalide pas la thèse : elle en montre les limites — d’où les adverbes « toujours », « uniquement », « seulement » dans une phrase généralement négative (« Les parents ne doivent pas toujours être autoritaires »), ou une phrase affirmative avec « aussi ».",
    ], type:"repere"}},
  ]));
  out.push(...exo("18","Le plan détaillé de la discussion  #WEB",[
    "Sujet (Probatoire CDE 2020) : « Les médias de masse se plient aux besoins de leur public », déclare Martin Hafen. Partagez-vous ce point de vue ?",
    "Élabore le plan détaillé complet : thèse (2 arguments + explications + exemples), antithèse (2 arguments + explications + exemples), en t’inspirant du modèle : Argument — Explication (« En d’autres termes… ») — Exemple.",
  ]));
  out.push(...exo("19","Test de culture générale",[
    "Pour chacun des thèmes ci-dessous, propose deux arguments et deux exemples précis (faits historiques, actualité, statistiques, personnalités, ouvrages) :",
    {b: TXC.themesCG },
  ]));
  out.push(...exo("20","Analyser des sujets de dissertation  #WEB",[
    "Pour chaque sujet : identifie le type de plan et l’indice qui le justifie ; précise le domaine d’application ; formule la problématique ; propose deux œuvres d’appui.",
    {b:[
      "« La littérature n'est pas un objet de loisir, elle a une fonction humaine et grave, ce qui ne veut pas dire ennuyeuse. » (Anne-Marie Garat) — Qu’en pensez-vous ?",
      "Pour Guy de Maupassant, l’œuvre littéraire a pour fonction de réveiller les consciences et d’affirmer son refus de voir l’humanité se déchirer. Expliquez et discutez.",
      "« Si les grandes œuvres arrivent à vaincre le temps, alors elles sont vraies. » (Pierre Corneille) — Quelles réflexions vous inspire cette affirmation ?",
      TXC.sujets2nde[4],
    ]},
  ]));
  out.push(...exo("21","De l’introduction à la conclusion",[
    "Sujet retenu : celui d’Anne-Marie Garat (exercice 19).",
    {b:[
      "Rédige l’introduction complète : amener (contexte littéraire ou fait d’actualité), poser (citation intégrée + problématique), annoncer.",
      "Rédige un paragraphe argumentatif complet (A.E.E.B.) appuyé sur Le lion et la perle ou sur l’essai au programme.",
      "Rédige la transition majeure puis la conclusion (bilan + ouverture).",
    ]},
  ]));
  out.push(...exo("22","Corriger une discussion fautive",[
    "Un élève commence ainsi sa discussion du sujet Hafen (exercice 17) : « Dans ce texte, l’auteur parle des médias. Je suis d’accord avec lui parce que les médias mentent beaucoup. Premièrement les journalistes inventent. Deuxièmement ils exagèrent. Troisièmement ils cachent la vérité. Donc l’auteur a raison. »",
    {b:[
      "Relève au moins cinq défauts de méthode (absence d’introduction en trois temps, confusion résumé/discussion, arguments non expliqués, absence d’exemples, absence d’antithèse, connecteurs mécaniques…).",
      "Récris ce début de discussion dans les règles.",
    ]},
  ]));
  out.push(new Paragraph({ children:[new PageBreak()] }));
  return out;
}

/* ===================== PARTIE 6 — ÉPREUVES TYPES ===================== */
function epreuves(){
  const out=[];
  out.push(...partTitle("Sixième partie","Épreuves types et sujets officiels (corrigés en ligne)"));
  out.push(P("Quatre épreuves complètes, chacune dans le format exact de sa série. Traite-les dans les conditions réelles avant de consulter les corrigés en ligne.",{justify:true}));
  out.push(spacer(60));
  out.push(H2nb("Épreuve n°1 — Probatoire C-D-E-TI : langue française (sujet officiel)  #WEB"));
  out.push(...C.epreuveBlock(EP1.kayoLangue));
  out.push(H2nb("Épreuve n°2 — Probatoire C-D-E-TI : littérature (sujet officiel)  #WEB"));
  out.push(...C.epreuveBlock(EP1.varelaLitt));
  out.push(H2nb("Épreuve n°3 — Probatoire STT ACA-ACC-CG-FIG (épreuve zéro officielle)  #WEB"));
  out.push(...C.epreuveBlock(EP1.mataSTT));
  out.push(P("Barème officiel de la dissertation (séries tertiaires) :",{justify:true}));
  out.push(C.twoColTable(EPT.baremeDissertSTT.head, EPT.baremeDissertSTT.rows, EPT.baremeDissertSTT.w1));
  out.push(spacer(120));
  out.push(H2nb("Épreuve n°4 — Probatoire industriel F-AF-CI-BT (épreuve zéro 2020)  #WEB"));
  out.push(...C.epreuveBlock(EP1.poneIND));
  out.push(H2nb("Entraînements supplémentaires du Centre (format Probatoire)  #WEB"));
  out.push(...C.epreuveBlock(EP1.mengaLangue));
  out.push(...C.epreuveBlock(EP1.tubianaLitt));
  out.push(C.renvoiWeb("Corrigés EST — 1ère scientifique & technique"));
  return out;
}

/* ===================== PARTIE 7 — BANQUE DE CITATIONS ===================== */
function citations(){
  const out=[];
  out.push(...partTitle("Septième partie","Banque de citations pour la dissertation"));
  out.push(...C.citationBank(CIT.THEMES));
  out.push(encadre("ASTUCE — Une citation par thème, apprise par cœur", [
    "Choisis dans chaque thème UNE citation courte que tu comprends parfaitement, apprends-la avec son auteur, et entraîne-toi à l’intégrer dans une phrase. Cinq citations sûres valent mieux que trente approximatives — et une citation déformée coûte des points.",
  ], "astuce"));
  return out;
}

module.exports = { avantPropos, programme, progression, structures, exercices, epreuves, citations };
