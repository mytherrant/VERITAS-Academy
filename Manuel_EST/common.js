/* =====================================================================
   VÉRITAS — Français EST (2nde / 1ère / Tle scientifiques & techniques)
   Blocs communs : couverture, tables, méthodologie & astuces
   ===================================================================== */
const R = require("./render");
const {
  docx, Paragraph, TextRun, PageBreak, AlignmentType, HeadingLevel, TableOfContents,
  P, spacer, partTitle, H1c, H2, H2nb, H3, rubrique, proseBlock, encadre, lexique,
  bullets, runs, FONT, FONT_TIT, BLEU, BLEU_CLAIR, OR, GRIS_TXT, CW,
} = R;
const { Table, TableRow, TableCell, BorderStyle, WidthType, ShadingType } = docx;

/* ================= Couverture ================= */
function cover(o){
  const k=[];
  k.push(new Paragraph({ spacing:{before:1300,after:120}, alignment:AlignmentType.CENTER,
    children:[ new TextRun({text:"CENTRE VÉRITAS", font:FONT_TIT, size:26, bold:true, color:OR, allCaps:true, characterSpacing:80}) ] }));
  k.push(new Paragraph({ alignment:AlignmentType.CENTER, spacing:{after:60},
    children:[ new TextRun({text:"Soutien scolaire & e-learning — Douala, Cameroun", font:FONT, size:18, italics:true, color:"6B6B6B"}) ] }));
  k.push(new Paragraph({ alignment:AlignmentType.CENTER, spacing:{before:500,after:100},
    border:{ top:{style:BorderStyle.SINGLE,size:8,color:OR,space:8} },
    children:[ new TextRun({text:"FRANÇAIS", font:FONT_TIT, size:56, bold:true, color:BLEU, characterSpacing:40}) ] }));
  k.push(new Paragraph({ alignment:AlignmentType.CENTER, spacing:{after:80},
    children:[ new TextRun({text:o.classe, font:FONT_TIT, size:40, bold:true, color:BLEU_CLAIR}) ] }));
  k.push(new Paragraph({ alignment:AlignmentType.CENTER, spacing:{after:400},
    border:{ bottom:{style:BorderStyle.SINGLE,size:8,color:OR,space:8} },
    children:[ new TextRun({text:"Enseignement Secondaire Scientifique & Technique", font:FONT_TIT, size:24, bold:true, color:OR}) ] }));
  [ "Programme officiel et cadrage des œuvres",
    "Progression annuelle, semaine par semaine",
    "Structure des épreuves, série par série",
    "Méthodes, astuces et pièges à éviter",
    "Contraction de texte & argumentation : exercices en nombre",
    "Épreuves types avec barèmes (corrigés en ligne)" ].forEach(t=>{
    k.push(new Paragraph({ alignment:AlignmentType.CENTER, spacing:{after:50},
      children:[ new TextRun({text:"— "+t+" —", font:FONT, size:20, color:GRIS_TXT}) ] }));
  });
  k.push(new Paragraph({ spacing:{before:600}, alignment:AlignmentType.CENTER,
    children:[ new TextRun({text:o.examen, font:FONT_TIT, size:22, bold:true, color:BLEU}) ] }));
  k.push(new Paragraph({ alignment:AlignmentType.CENTER, spacing:{before:80},
    children:[ new TextRun({text:"Conforme aux programmes MINESEC — Année scolaire 2026-2027", font:FONT, size:18, italics:true, color:"6B6B6B"}) ] }));
  k.push(new Paragraph({ alignment:AlignmentType.CENTER, spacing:{before:60},
    children:[ new TextRun({text:"Jacques Miterand TAKOU · © Mythe Errant 2026 · veritas-school.com", font:FONT, size:17, color:"8A8A8A"}) ] }));
  k.push(new Paragraph({ children:[new PageBreak()] }));
  return k;
}

/* ============ Sommaire ============ */
function sommaire(){
  return [
    H1c("Sommaire"),
    new TableOfContents("Sommaire", { hyperlink:true, headingStyleRange:"1-2" }),
    new Paragraph({ children:[new PageBreak()] }),
  ];
}

/* ============ Table générique 2 colonnes ============ */
function twoColTable(head, rows, w1){
  const C1=w1||1500, C2=CW-C1;
  const bd={style:BorderStyle.SINGLE,size:2,color:"C9C9C9"};
  const borders={top:bd,bottom:bd,left:bd,right:bd};
  function cell(content,w,o){ o=o||{};
    const paras=(Array.isArray(content)?content:[content]).map(c=>
      new Paragraph({ spacing:{after:20,line:238}, children: runs(c,{font:FONT,size:o.size||18,color:o.color||GRIS_TXT,bold:o.bold,italics:o.italics}) }));
    return new TableCell({ width:{size:w,type:WidthType.DXA}, borders,
      shading:o.fill?{fill:o.fill,type:ShadingType.CLEAR}:undefined,
      margins:{top:60,bottom:60,left:100,right:100}, verticalAlign:docx.VerticalAlign.CENTER, children:paras });
  }
  const out=[ new TableRow({ tableHeader:true, children:[
    cell(head[0],C1,{fill:BLEU,color:"FFFFFF",bold:true,size:17}),
    cell(head[1],C2,{fill:BLEU,color:"FFFFFF",bold:true,size:17}) ]}) ];
  rows.forEach((r,i)=> out.push(new TableRow({ children:[
    cell(r[0],C1,{bold:true,color:BLEU_CLAIR,fill:(i%2)?"F3F1EA":null}),
    cell(r[1],C2,{fill:(i%2)?"F3F1EA":null}) ]})));
  return new Table({ width:{size:CW,type:WidthType.DXA}, columnWidths:[C1,C2], rows:out });
}

/* ============ Séquence : bloc de progression hebdomadaire ============ */
function seqBlock(seq){
  const out=[];
  out.push(H2nb("Séquence "+seq.num+" — "+seq.titre));
  out.push(encadre("Compétence visée", [seq.competence], "objectif"));
  out.push(spacer(40));
  out.push(twoColTable(["Semaine","Contenus (leçons d’1 h sauf mention contraire)"],
    seq.weeks.map(w=>[w.s, w.items]), 1180));
  out.push(spacer(120));
  return out;
}

/* ============ Renvoi corrigés en ligne ============ */
function renvoiWeb(page){
  return encadre("#WEB — Les corrigés sont en ligne", [
    "Tous les corrigés des épreuves types et des exercices signalés par le tag #WEB sont publiés gratuitement dans l’Espace Manuels du Centre VÉRITAS :",
    { t:"veritas-school.com/manuels.html — page « "+page+" »", bold:true },
    "Cherche d’abord par toi-même, compare ensuite ta production au corrigé : c’est la comparaison qui fait progresser, pas la copie.",
  ], "repere");
}

/* =====================================================================
   MÉTHODOLOGIE — ÉPREUVE DE LANGUE
   ===================================================================== */
function methodoLangue(level){
  const out=[];
  out.push(H2("Méthode de l’épreuve de langue"));
  out.push(P("L’épreuve de langue dure 2 heures. Elle s’appuie sur un texte, littéraire ou non, de 250 à 400 mots, et comporte quatre rubriques : Communication, Morphosyntaxe, Sémantique/Lexicologie, Stylistique/Rhétorique des textes."+(level==="tle"?" En C-D-E-TI, chaque rubrique vaut 5 points (deux questions par rubrique, en a. repérage/analyse et b. interprétation). Dans les séries tertiaires (ACA, ACC, FIG, CG, SES), la partie langue du sujet de type I comporte désormais 5 à 6 questions relevant des rubriques les plus représentatives du texte.":" Dans les classes scientifiques et techniques, chaque rubrique comporte en principe deux questions."),{justify:true}));
  out.push(P("Chaque question mobilise l’un des trois gestes suivants — et souvent les trois à la fois :",{justify:true}));
  out.push(twoColTable(["Geste","Ce que le correcteur attend"],[
    ["Repérer","Citer l’élément demandé entre guillemets, exactement comme il figure dans le texte, et le localiser (ligne, paragraphe)."],
    ["Analyser","Nommer l’outil avec le terme technique exact (métaphore, connecteur d’opposition, champ lexical de…, phrase complexe…), puis décrire son fonctionnement dans la phrase."],
    ["Interpréter","Dire l’effet de sens produit dans CE texte précis : que fait cet outil au lecteur ? que révèle-t-il de l’intention de l’auteur ?"],
  ],1400));
  out.push(spacer(60));
  out.push(encadre("ASTUCE — La réponse en trois temps (R.A.I.)", [
    "Une réponse complète suit toujours le même mouvement : je cite (Repérage), je nomme et je décris (Analyse), j’explique l’effet (Interprétation).",
    { li:"Exemple : « L’auteur emploie “gouffre numérique” (l. 12) : c’est une métaphore qui assimile l’écart technologique à un abîme ; elle dramatise le retard à combler et alerte le lecteur. »" },
    { li:"Une citation sans analyse = la moitié des points ; une règle récitée sans citation = zéro." },
  ], "astuce"));
  out.push(encadre("ASTUCE — Gérer les 2 heures", [
    { li:"20 min : lecture crayon en main (numérote les paragraphes, souligne connecteurs, figures, mots inconnus)." },
    { li:"80 min : réponses, en commençant par la rubrique où tu es le plus sûr — les points valent pareil partout." },
    { li:"20 min : relecture ciblée — orthographe des termes techniques, guillemets des citations, numéros de lignes." },
  ], "astuce"));
  out.push(encadre("PIÈGES classiques", [
    { li:"Paraphraser le texte au lieu d’analyser l’outil de langue." },
    { li:"Réciter la leçon (définition générale) sans l’appliquer au texte." },
    { li:"Inventer une citation approximative : le correcteur vérifie sur le texte photocopié joint à l’épreuve." },
    { li:"Oublier qu’une question d’interprétation se juge à la précision : « ça rend le texte vivant » ne rapporte rien." },
  ], "repere"));
  out.push(P("Les quatre rubriques et leurs questions favorites :",{justify:true}));
  out.push(twoColTable(["Rubrique","Questions typiques"],[
    ["Communication","Émetteur/récepteur et leurs marques dans le texte ; facteurs et fonctions du langage ; énoncé/énonciation ; contenus latents et manifestes ; registres de langue ; communication par l’image."],
    ["Morphosyntaxe","Classes de mots variables ; structure de la phrase (simple, coordonnée, complexe) ; conjonctions et adverbes de liaison, valeurs des connecteurs ; ponctuation et sens ; progression, cohérence et cohésion du texte."],
    ["Sémantique / Lexicologie","Dénotation/connotation ; monosémie/polysémie ; synonymes, antonymes, paronymes ; champ lexical / champ sémantique ; hyperonymie/hyponymie ; formation des mots ; lexique commun et lexique spécialisé ; le pouvoir des mots (constatif/performatif ; actes locutoire, illocutoire, perlocutoire)."],
    ["Stylistique / Rhétorique","Figures d’analogie, d’opposition, d’insistance, de construction ; tonalités (comique, tragique, lyrique, satirique, polémique, épique) ; types de textes (narratif, descriptif, argumentatif, explicatif, injonctif) et genres (théâtral, poétique)."],
  ],1700));
  out.push(spacer(80));
  return out;
}

/* =====================================================================
   MÉTHODOLOGIE — CONTRACTION DE TEXTE (résumé, analyse, discussion)
   ===================================================================== */
function methodoContraction(level){
  const out=[];
  out.push(H2("Méthode de la contraction de texte"));
  out.push(P("La contraction de texte est l’exercice roi des séries scientifiques et techniques : c’est le sujet de type 1 de l’épreuve de littérature. Elle vérifie une compétence directement professionnelle : comprendre un texte argumentatif, en restituer fidèlement la pensée en peu de mots, puis discuter cette pensée.",{justify:true}));
  if(level==="2nde"){
    out.push(P("En classe de 2nde, on installe les trois gestes séparément : le résumé (Séquence I), l’analyse (Séquence II), puis la discussion (Séquence III). Aux évaluations, le texte support reste plus court (280 à 500 mots environ) que celui du Probatoire (550 à 650 mots en C-D-E-TI).",{justify:true}));
  } else if(level==="1ere"){
    out.push(P("Au Probatoire C, D, E et TI, le sujet de type 1 comporte : un texte argumentatif contemporain de 550 à 650 mots à réduire au quart (résumé) ou au tiers (analyse), noté sur 9 points ; une discussion sur un problème tiré du texte, notée sur 9 points ; la présentation, sur 2 points. Dans les séries industrielles (F, AF, CI, BT) et tertiaires (STT), le texte non littéraire compte 400 à 500 mots (500 à 600 en SES) : résumé sur 10 points, langue sur 8, présentation sur 2.",{justify:true}));
  } else {
    out.push(P("Au Baccalauréat C, D, E et TI, le sujet de type 1 comporte : un texte argumentatif contemporain de 550 à 650 mots à réduire au quart (résumé) ou au tiers (analyse), noté sur 9 points ; une discussion sur un problème tiré du texte, notée sur 9 points ; la présentation, sur 2 points. Dans les séries industrielles (F, AF, CI, BT) et tertiaires (STT), le texte non littéraire compte 400 à 500 mots (500 à 600 en SES) : résumé sur 10 points, langue sur 8, présentation sur 2.",{justify:true}));
  }

  out.push(H3("Étape 1 — Comprendre le texte (le « circuit argumentatif »)"));
  bullets([
    "Première lecture : sans crayon, pour saisir le propos global.",
    "Deuxième lecture : crayon en main. Numérote les paragraphes, encadre les connecteurs logiques, souligne la phrase-clé de chaque paragraphe.",
    "Dégage le thème (de quoi parle le texte ? — un groupe nominal) et la thèse (que soutient l’auteur ? — une phrase complète).",
    "Établis le circuit argumentatif : pour chaque paragraphe, une idée directrice reformulée en une phrase, reliée à la précédente par le connecteur du texte (donc, mais, en effet…).",
  ]).forEach(b=>out.push(b));
  out.push(encadre("ASTUCE — Le squelette de connecteurs", [
    "Recopie au brouillon la seule chaîne des connecteurs du texte (« D’abord… ensuite… pourtant… c’est pourquoi… »). Ce squelette est déjà le plan de ton résumé : il ne reste qu’à poser une idée reformulée sur chaque maillon.",
  ], "astuce"));

  out.push(H3("Étape 2 — Le résumé (réduction au quart)"));
  out.push(P("Le résumé est un texte-miniature fidèle : même ordre des idées, même système d’énonciation (le « je » de l’auteur reste « je », le « nous » reste « nous »), même tonalité.",{justify:true}));
  out.push(...bullets([
    "Reformule : aucun recopiage de phrases entières ; les mots techniques sans équivalent peuvent rester.",
    "Supprime : exemples, illustrations chiffrées, répétitions, citations, digressions.",
    "Condense : une énumération devient un terme générique (« le paludisme, la typhoïde, le choléra » → « les grandes endémies »).",
    "Relie : conserve la logique par des connecteurs, quitte à en changer la forme (« en dépit de » → « malgré »).",
    "Respecte la proportion : nombre de mots du texte ÷ 4, avec une marge tolérée d’environ 10 % ; indique ton compte de mots à la fin, entre parenthèses.",
    "Interdits absolus : commenter, juger, ajouter une idée, dire « l’auteur affirme que » (cela relève de l’analyse).",
  ]));
  out.push(encadre("ASTUCE — Le budget de mots", [
    "Avant d’écrire, fais tes comptes : texte de 600 mots → résumé attendu ≈ 150 mots (fourchette 135–165). Répartis ce budget entre les paragraphes proportionnellement à leur poids : un paragraphe qui occupe la moitié du texte a droit à la moitié du budget.",
    { li:"Convention usuelle de comptage : toute unité séparée par des blancs compte pour un mot ; « c’est-à-dire » (trait d’union) = 1 mot ; « l’école » = 2 mots. Si le libellé fixe une autre règle, elle prime." },
  ], "astuce"));
  out.push(encadre("ASTUCE — Un paragraphe = une phrase (pour commencer)", [
    "Au brouillon, réduis d’abord chaque paragraphe à UNE phrase. Tu obtiens un pré-résumé sûr. Ensuite seulement, ajuste au budget de mots : fusionne deux phrases pauvres, développe la phrase d’un paragraphe riche.",
  ], "astuce"));

  out.push(H3("Étape 3 — L’analyse (réduction au tiers)"));
  out.push(P("L’analyse restitue la même pensée, mais avec un recul d’observateur : tu n’es plus l’auteur en miniature, tu es celui qui rend compte de sa démarche.",{justify:true}));
  out.push(twoColTable(["Critère","Résumé  /  Analyse"],[
    ["Énonciation","Résumé : on garde le système du texte. Analyse : 3e personne obligatoire — « l’auteur », « le journaliste »."],
    ["Verbes","Résumé : aucun verbe d’opinion ajouté. Analyse : verbes de démarche variés — affirme, constate, déplore, réfute, démontre, conclut…"],
    ["Ordre","Résumé : ordre du texte, impérativement. Analyse : regroupements autorisés si la logique y gagne."],
    ["Proportion","Résumé : 1/4 du texte. Analyse : 1/3 du texte (marge ≈ 10 %)."],
    ["Ton","Résumé : neutre par imitation. Analyse : neutre par distance — toujours aucun jugement personnel."],
  ],1650));
  out.push(spacer(60));
  out.push(encadre("ASTUCE — Varier les verbes de démarche", [
    "Bannis la litanie « l’auteur dit que… dit que… ». Classe tes verbes en trois familles et alterne : constater (observe, note, relève), soutenir (affirme, défend, soutient, démontre), nuancer/contester (concède, tempère, déplore, réfute).",
  ], "astuce"));

  out.push(H3("Étape 4 — La discussion"));
  out.push(P("La discussion est une mini-dissertation sur un problème tiré du texte. Le libellé cite généralement une phrase de l’auteur et demande : « Qu’en pensez-vous ? » ou « Discutez ».",{justify:true}));
  out.push(...bullets([
    "Analyse du sujet : recopie la thèse citée, reformule-la avec tes mots, transforme-la en question (la problématique).",
    "Plan attendu en deux mouvements : I. La part de vérité de la thèse (arguments + exemples précis) ; II. Ses limites ou son dépassement (arguments + exemples).",
    "Introduction en trois temps : amener le sujet (idée générale, fait d’actualité), poser le problème (citation + problématique), annoncer le plan.",
    "Paragraphe argumentatif type : affirmation de l’idée, explication, exemple précis (littéraire, historique, scientifique ou vécu), phrase-bilan.",
    "Conclusion en deux temps : bilan de la réflexion, puis ouverture (élargissement, question nouvelle).",
  ]));
  out.push(encadre("ASTUCE — L’exemple précis vaut de l’or", [
    "Un argument sans exemple est une opinion ; un exemple précis (une œuvre au programme, une date, un fait scientifique, une situation camerounaise concrète) en fait une preuve. Constitue dès maintenant ta réserve : 2 exemples par grand thème (école, technique, environnement, culture, santé, travail).",
  ], "astuce"));
  out.push(encadre("ASTUCE — Gérer les 3 heures du sujet de type 1", [
    { li:"30 min : lecture double + thème/thèse + circuit argumentatif." },
    { li:"45 min : résumé (ou analyse) au brouillon puis au propre, compte de mots vérifié." },
    { li:"75 min : discussion (15 min d’analyse du sujet et plan, 60 min de rédaction directe au propre)." },
    { li:"30 min : relecture — orthographe, ponctuation, compte de mots, présentation (la présentation vaut 2 points !)." },
  ], "astuce"));
  out.push(encadre("Le correcteur note avec 4 critères", [
    "Les grilles officielles harmonisées évaluent : la pertinence (réponse adaptée à la consigne), la cohérence (organisation et enchaînements), la correction de la langue (syntaxe, orthographe, ponctuation) et l’originalité (finesse personnelle). Vise les quatre à chaque exercice.",
  ], "repere"));
  out.push(spacer(80));
  return out;
}

/* =====================================================================
   MÉTHODOLOGIE — DISSERTATION
   ===================================================================== */
function methodoDissertation(level){
  const out=[];
  out.push(H2("Méthode de la dissertation"));
  if(level==="2nde"){
    out.push(P("La dissertation entre au programme dès la 2nde (Séquences IV et V). L’objectif de l’année : savoir analyser un sujet, bâtir un plan détaillé et rédiger introduction, paragraphes et conclusion. C’est l’exercice qui départage les candidats au Probatoire puis au Baccalauréat : autant l’apprivoiser tôt.",{justify:true}));
  } else if(level==="1ere"){
    out.push(P("Au Probatoire, la dissertation est le sujet de type 2 : une problématique littéraire ou un sujet de culture générale, souvent introduits par une citation suivie d’une consigne. Une grille critériée est annexée au libellé — le correcteur ne note pas à l’impression, il coche des critères.",{justify:true}));
  } else {
    out.push(P("Au Baccalauréat, la dissertation est le second sujet au choix (type 3 dans les séries générales C, D, E, TI ; type 2 dans les séries F, AF, CI, BT et tertiaires, où elle est dite « de culture littéraire » ou « littéraire »). Le sujet porte sur un problème littéraire ouvrant un champ de réflexion large, ou sur un sujet de culture générale ; une grille critériée est annexée au libellé.",{justify:true}));
  }
  out.push(H3("Étape 1 — Analyser le sujet (15 minutes qui valent 15 points)"));
  out.push(...bullets([
    "Recopie le sujet au brouillon. Souligne les mots-clés ; encadre la consigne (discutez, commentez, pensez-vous que, dans quelle mesure…).",
    "Si le sujet cite un auteur : identifie sa thèse (que soutient-il ?), son domaine (le roman ? le théâtre ? la science ?), et le présupposé de la citation.",
    "Reformule le sujet en une question : c’est ta problématique. Si tu ne peux pas le reformuler, tu ne l’as pas compris — relis.",
    "Identifie le type de sujet : analytique (expliquer/illustrer une thèse), dialectique (peser le pour et le contre), ou commentaire de citation (expliquer puis apprécier).",
  ]));
  out.push(twoColTable(["Consigne","Type de plan attendu"],[
    ["« Expliquez », « Montrez que », « Illustrez »","Plan analytique : I. Explication de la thèse — II. Illustration par des exemples — III. Portée/intérêt de la thèse."],
    ["« Discutez », « Qu’en pensez-vous ? », « Partagez-vous… »","Plan dialectique : I. Défense de la thèse — II. Limites/objections — III. (Tle) Dépassement/synthèse."],
    ["« Commentez »","Plan de commentaire : I. Sens et fondements de la citation — II. Appréciation critique (validité, limites, actualité)."],
  ],1850));
  out.push(spacer(60));
  out.push(encadre("ASTUCE — Le tri des idées en tableau", [
    "Au brouillon, trace deux colonnes (POUR / RÉSERVES) ou trois (SENS / EXEMPLES / PORTÉE selon le type). Jette-y en vrac idées et exemples pendant 10 minutes. Ensuite seulement, numérote : chaque colonne devient une partie, chaque groupe de 2-3 idées un paragraphe.",
  ], "astuce"));
  out.push(H3("Étape 2 — Bâtir le plan détaillé"));
  out.push(...bullets([
    "Deux ou trois parties équilibrées ; chaque partie contient 2 à 3 paragraphes ; chaque paragraphe porte UNE idée et UN exemple au moins.",
    "Formule chaque titre de partie en phrase complète au brouillon (« Le théâtre corrige les mœurs en riant ») : tu tiens déjà tes chapeaux introductifs.",
    "Prévois la transition majeure entre les parties : bilan de la partie achevée + annonce de la suivante.",
  ]));
  out.push(H3("Étape 3 — Rédiger"));
  out.push(...bullets([
    "Introduction (un seul paragraphe, 3 temps) : amener le sujet (idée générale ou contexte littéraire, jamais « De tout temps l’homme… ») ; poser le sujet (citation intégrée + problématique) ; annoncer le plan en une phrase fluide.",
    "Paragraphe argumentatif (méthode A.E.E.B.) : Affirmation de l’idée — Explication — Exemple exploité (pas seulement cité : dis en quoi il prouve) — Bilan-liaison.",
    "Chapeau introductif de partie : une phrase qui annonce l’idée générale de la partie.",
    "Conclusion (2 temps) : bilan qui répond explicitement à la problématique ; ouverture sobre (autre genre, autre époque, question voisine) — jamais une question artificielle.",
  ]));
  out.push(encadre("ASTUCE — Insérer une citation proprement", [
    "Une citation s’intègre à ta phrase et se commente : « Molière rappelle que “le devoir de la comédie [est] de corriger les hommes en les divertissant” : le rire est ici un instrument moral, non un simple divertissement. » Jamais de citation-parachute posée seule en début de paragraphe.",
    { li:"Ta réserve minimale : 8 à 10 citations vérifiées, apprises avec leur source exacte. Mieux vaut peu de citations sûres que beaucoup d’à-peu-près." },
  ], "astuce"));
  out.push(encadre("ASTUCE — Les œuvres au programme sont ta banque d’exemples", [
    "Chaque œuvre étudiée dans l’année fournit des exemples réutilisables dans presque toute dissertation littéraire : un personnage (pour l’engagement, la résistance, l’hypocrisie…), une scène (pour le comique, le tragique…), un choix d’écriture (pour le rôle du style). Fiche-les séquence par séquence : titre exact, auteur, date, deux situations précises, une phrase retenue.",
  ], "astuce"));
  out.push(encadre("PIÈGES qui coûtent le plus cher", [
    { li:"Le hors-sujet par glissement : toutes les 20 minutes, relis le libellé et vérifie que ton paragraphe y répond." },
    { li:"Le catalogue : enchaîner les exemples sans argument, ou réciter un cours sur l’auteur de la citation." },
    { li:"La partie fantôme : annoncer trois parties et n’en rédiger que deux — annonce seulement ce que tu tiendras." },
    { li:"La citation déformée : si tu n’es pas sûr du mot à mot, préfère « selon X » + reformulation honnête, sans guillemets." },
  ], "repere"));
  out.push(encadre("ASTUCE — Gérer les 3 heures (sujet de type 2)", [
    { li:"25 min : analyse du sujet + tri des idées ; 20 min : plan détaillé complet (chapeaux et exemples placés)." },
    { li:"15 min : introduction et conclusion au brouillon (elles se rédigent ensemble : la conclusion répond à l’introduction)." },
    { li:"85 min : rédaction directe du développement au propre, plan sous les yeux." },
    { li:"35 min : relecture en deux passes — cohérence (connecteurs, transitions) puis langue (accords, ponctuation)." },
  ], "astuce"));
  out.push(spacer(80));
  return out;
}

/* =====================================================================
   MÉTHODOLOGIE — ARGUMENTER AU QUOTIDIEN (2nde surtout)
   ===================================================================== */
function methodoArgumenter(){
  const out=[];
  out.push(H2("Argumenter au quotidien : convaincre, persuader, réfuter"));
  out.push(P("Avant d’être un exercice d’examen, l’argumentation est une compétence de vie : négocier, débattre au village ou en classe, défendre un projet devant un jury, réfuter poliment une rumeur. Le programme en fait une famille de situations à part entière.",{justify:true}));
  out.push(twoColTable(["Stratégie","Moyens privilégiés"],[
    ["Convaincre","S’adresse à la raison : arguments logiques, faits, chiffres, exemples vérifiables, raisonnement (déduction, induction, analogie), connecteurs logiques explicites."],
    ["Persuader","S’adresse au cœur : appel aux émotions et aux valeurs, images fortes, questions rhétoriques, implication du destinataire (« nous », apostrophe), tonalités lyrique ou polémique."],
    ["Réfuter","Contester une thèse : concession préalable (« certes… mais »), contre-exemple, mise en évidence d’une contradiction, requalification des termes."],
    ["Délibérer","Peser le pour et le contre avant de trancher : c’est le mouvement même de la discussion et du plan dialectique."],
  ],1500));
  out.push(spacer(60));
  out.push(encadre("ASTUCE — La concession, arme des forts", [
    "Commencer par accorder un point à l’adversaire (« Il est vrai que… ») rend ta réfutation crédible : tu montres que tu as compris sa position avant de la dépasser (« …mais c’est oublier que… »). C’est la structure exacte du paragraphe II de toute discussion.",
  ], "astuce"));
  out.push(encadre("ASTUCE — Les connecteurs, panneaux indicateurs du correcteur", [
    { li:"Addition : de plus, en outre, par ailleurs. Cause : car, en effet, parce que. Conséquence : donc, ainsi, c’est pourquoi, dès lors." },
    { li:"Opposition/concession : mais, pourtant, toutefois, certes… mais, bien que. Illustration : par exemple, notamment, ainsi." },
    { li:"Un devoir sans connecteurs est illisible ; un devoir aux connecteurs mécaniques (premièrement, deuxièmement, troisièmement…) est pauvre. Varie-les." },
  ], "astuce"));
  out.push(spacer(80));
  return out;
}

/* =====================================================================
   Helpers d'exercices (partagés par les trois niveaux)
   ===================================================================== */
/* Convention d'examen : unité séparée par des blancs = 1 mot ;
   l'apostrophe sépare (« l'école » = 2 mots) ; le trait d'union ne sépare pas. */
function mots(s){ return s.trim().split(/\s+/).reduce((n,w)=>n+1+(w.match(/[’']/g)||[]).length,0); }
function totalMots(t){ return t.paras.reduce((n,p)=>n+mots(p),0); }
function quart(t){ return Math.round(totalMots(t)/4); }
function tiers(t){ return Math.round(totalMots(t)/3); }
function texteSupport(t){
  const total = t.motsOfficiel || totalMots(t);
  const out=[];
  if(t.titre) out.push(P([{t:t.titre, bold:true, color:BLEU}],{after:40}));
  out.push(proseBlock(t.paras));
  out.push(P([{t:t.source+(t.sansCompte?"":" — "+total+" mots"+(t.motsOfficiel?" (décompte officiel)":""))+".", italics:true, color:"6B6B6B"}],{before:40, after:120, size:18}));
  out.push(spacer(20));
  return out;
}
function exo(num, titre, corps){
  const out=[];
  out.push(rubrique("Exercice "+num+" — "+titre));
  (corps||[]).forEach(c=>{
    if(typeof c==="string") out.push(P(c,{justify:true}));
    else if(c.b) bullets(c.b).forEach(x=>out.push(x));
    else if(c.enc) out.push(encadre(c.enc.titre, c.enc.corps, c.enc.type||"repere"));
    else if(c.raw) out.push(c.raw);
  });
  out.push(spacer(60));
  return out;
}

/* ---------- Poème (vers non justifiés) ---------- */
function poemBlock(t){
  const out=[];
  if(t.titre) out.push(P([{t:t.titre, bold:true, color:BLEU}],{after:40}));
  const paras=[];
  t.strophes.forEach((st,i)=>{
    st.forEach(v=> paras.push(new docx.Paragraph({ spacing:{after:10,line:252}, indent:{left:340},
      children: runs(v,{font:FONT,size:20,color:"23252B"}) })));
    if(i<t.strophes.length-1) paras.push(new docx.Paragraph({ children:[new docx.TextRun("")], spacing:{after:60} }));
  });
  const cell=new TableCell({ width:{size:CW,type:WidthType.DXA}, shading:{fill:"F3F1EA",type:ShadingType.CLEAR},
    borders:{ left:{style:BorderStyle.SINGLE,size:18,color:OR}, top:{style:BorderStyle.NONE}, bottom:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE} },
    margins:{top:140,bottom:140,left:170,right:140}, children:paras });
  out.push(new Table({ width:{size:CW,type:WidthType.DXA}, columnWidths:[CW], rows:[ new TableRow({children:[cell]}) ] }));
  out.push(P([{t:t.source, italics:true, color:"6B6B6B"}],{before:40, after:120, size:18}));
  return out;
}

/* ---------- Épreuve officielle complète ---------- */
function epreuveBlock(ep){
  const out=[];
  out.push(encadre(ep.entete.examen, [
    (ep.entete.epreuve?ep.entete.epreuve+" — ":"")+"Durée : "+ep.entete.duree+" — Coefficient : "+ep.entete.coef,
    ep.entete.nb || "Aucun document en dehors de ceux remis au candidat n’est autorisé.",
  ], "objectif"));
  out.push(spacer(40));
  (ep.blocs||[]).forEach(b=>{
    if(b.h) out.push(rubrique(b.h));
    if(b.h2) out.push(H3(b.h2));
    if(b.texte) texteSupport(b.texte).forEach(x=>out.push(x));
    if(b.poeme) poemBlock(b.poeme).forEach(x=>out.push(x));
    (b.qs||[]).forEach(q=> out.push(P(q,{justify:true})));
    if(b.list) bullets(b.list).forEach(x=>out.push(x));
    if(b.enc) out.push(encadre(b.enc.titre, b.enc.corps, b.enc.type||"methode"));
    if(b.bareme) out.push(twoColTable(b.bareme.head, b.bareme.rows, b.bareme.w1||2300));
    out.push(spacer(30));
  });
  out.push(spacer(80));
  return out;
}

/* ---------- Banque de citations classées par thème ---------- */
function citationBank(themes){
  const out=[];
  out.push(P("Une citation ne remplace jamais un argument : elle l’appuie, le justifie, l’illustre. Trois à quatre citations bien placées suffisent à un devoir. Apprends-en quelques-unes par thème, avec leur auteur exact — une citation déformée vaut moins que pas de citation du tout.",{justify:true}));
  out.push(spacer(40));
  themes.forEach(t=>{
    out.push(H3(t.theme));
    if(t.question) out.push(new docx.Paragraph({ spacing:{after:60,line:252}, alignment:AlignmentType.JUSTIFIED,
      children:[ new docx.TextRun({text:"Problèmes littéraires visés : ", font:FONT, size:19, italics:true, bold:true, color:OR}),
                 new docx.TextRun({text:t.question, font:FONT, size:19, italics:true, color:"6B6B6B"}) ] }));
    t.cits.forEach(c=> out.push(new docx.Paragraph({ numbering:{reference:"bullets",level:0}, spacing:{after:40,line:256}, alignment:AlignmentType.JUSTIFIED,
      children:[ new docx.TextRun({text:"« "+c[0]+" » ", font:FONT, size:20, color:GRIS_TXT}),
                 new docx.TextRun({text:"— "+c[1]+".", font:FONT, size:20, bold:true, color:BLEU_CLAIR}) ] })));
    out.push(spacer(60));
  });
  return out;
}

/* ---------- Sujets types par série ---------- */
function sujetsParSerie(rows){
  return twoColTable(["Série / filière","Genres à maîtriser et pools de sujets"], rows, 2100);
}

/* ---------- Conseils aux candidats (Probatoire / BAC) ---------- */
function conseilsCandidats(examen){
  const B = examen || "l’examen";
  const out=[];
  out.push(H2("Conseils aux candidats — réussir "+B));
  out.push(P("Ce qui départage deux copies de même niveau, ce n’est pas le talent : c’est la méthode et le sang-froid. Voici les réflexes qui font gagner des points — et ceux qui en font perdre bêtement.",{justify:true}));

  out.push(encadre("CHOISIR SON SUJET — 5 minutes décisives", [
    { li:"Lis TOUS les sujets avant de choisir. Ne te jette pas sur le premier." },
    { li:"Contraction/résumé : choisis-le si tu comprends le texte dès la première lecture — le barème y est mécanique, donc plus « sûr »." },
    { li:"Dissertation : choisis-la seulement si tu peux citer de mémoire au moins DEUX œuvres et DEUX exemples précis en rapport avec le sujet." },
    { li:"Décide en 5 minutes, puis ne reviens plus en arrière : une copie qui change de sujet à mi-parcours est perdue." },
  ], "astuce"));

  out.push(encadre("GÉRER LE TEMPS — la montre est ton premier correcteur", [
    { li:"Épreuve de littérature (3 h) : 30 min de lecture et de plan au brouillon, 2 h de rédaction directe au propre, 30 min de relecture. Ne rédige jamais tout au brouillon d’abord : tu n’auras pas le temps de recopier." },
    { li:"Épreuve de langue (2 h) : 20 min de lecture crayon en main, 80 min de réponses (commence par la rubrique où tu es le plus sûr), 20 min de relecture ciblée." },
    { li:"Note l’heure de fin de chaque partie en haut de ton brouillon et tiens-toi à ton horaire, même si un paragraphe n’est pas parfait." },
  ], "astuce"));

  out.push(encadre("LA PRÉSENTATION — 2 points offerts, ne les perds pas", [
    "La présentation vaut 2 points dans TOUTES les séries. Les perdre est impardonnable :",
    { li:"copie propre, sans ratures ni surcharges ; écriture lisible et aérée." },
    { li:"un alinéa à chaque paragraphe ; un saut de ligne entre les grandes parties." },
    { li:"le nombre de mots indiqué entre parenthèses à la fin du résumé (obligatoire)." },
    { li:"les citations entre guillemets ; les titres d’œuvres soulignés." },
  ], "repere"));

  out.push(encadre("LES FAUTES QUI COÛTENT LE PLUS CHER", [
    { li:"Résumé : recopier des phrases entières, changer le système d’énonciation, dépasser la marge de mots, ajouter un avis personnel." },
    { li:"Discussion/dissertation : le hors-sujet par glissement (relis le libellé toutes les 20 min), le catalogue d’exemples sans arguments, la partie annoncée puis non rédigée." },
    { li:"Langue : paraphraser au lieu d’analyser l’outil, réciter la règle sans citer le texte, inventer une citation (le correcteur a le texte sous les yeux)." },
    { li:"Partout : l’orthographe des termes techniques et les accords — une copie fautive plafonne, quel que soit le fond." },
  ], "repere"));

  out.push(encadre("LE JOUR J — sérénité et rigueur", [
    { li:"Relis le libellé DEUX fois avant d’écrire une seule ligne ; souligne la consigne (ce qu’on te demande exactement)." },
    { li:"Garde 10 % du temps pour la relecture : elle rapporte plus que dix minutes de rédaction en plus." },
    { li:"Relis en deux passes : d’abord la cohérence (connecteurs, transitions, réponse à la consigne), puis la langue (accords, ponctuation, orthographe)." },
    { li:"Une copie finie et relue vaut mieux qu’une copie brillante mais inachevée : termine toujours." },
  ], "astuce"));
  out.push(spacer(60));
  return out;
}

/* ---------- Liste de sujets numérotés (banque par genre) ---------- */
function sujetsListe(titre, arr, start){
  const out=[]; start=start||1;
  if(titre) out.push(rubrique(titre));
  arr.forEach((s,i)=> out.push(new docx.Paragraph({ numbering:{reference:"q-numbers",level:0}, spacing:{after:44,line:256}, alignment:AlignmentType.JUSTIFIED,
    children: runs(s,{font:FONT,size:20,color:GRIS_TXT}) })));
  out.push(spacer(40));
  return out;
}

module.exports = { cover, sommaire, twoColTable, seqBlock, renvoiWeb,
  methodoLangue, methodoContraction, methodoDissertation, methodoArgumenter,
  mots, totalMots, quart, tiers, texteSupport, exo, poemBlock, epreuveBlock,
  citationBank, sujetsParSerie, sujetsListe, conseilsCandidats };
