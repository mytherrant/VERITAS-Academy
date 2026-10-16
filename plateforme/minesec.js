/* ============================================================================
   VÉRITAS — Référentiel MINESEC (source de vérité unique)
   ----------------------------------------------------------------------------
   Structures officielles des épreuves de français par examen et par série,
   gabarits de leçon conformes au programme, grilles de correction harmonisées.
   Ce fichier alimente TROIS choses à la fois :

     1. les gabarits proposés dans le composeur d'épreuves et l'éditeur de cours
     2. le garde-fou de conformité local (conformite.js), qui compare ce que
        l'enseignant a produit à ce que la norme exige
     3. le contexte envoyé à l'IA Ambassa pour l'analyse fine

   SOURCE PRINCIPALE : « Draft EST » (MINESEC) — programmes, progressions et
   DESCRIPTIF DES ÉPREUVES, y compris le descriptif des examens de
   l'enseignement secondaire général. Complété par les corrigés harmonisés
   nationaux OBC 2020-2022 et par le programme officiel du 1er cycle.

   RÈGLE DE RÉDACTION. Rien ici n'est deviné. Chaque structure porte `source`
   et `confiance` :
     'officiel'   — lu dans le descriptif officiel ou sur des sujets réels
     'standard'   — déduit par parallélisme explicite avec une structure officielle
     'a_verifier' — à confirmer sur la circulaire de la session
   Une structure 'a_verifier' ne déclenche JAMAIS d'écart bloquant : on ne
   reproche pas à un enseignant de s'écarter d'une règle dont on n'est pas sûr.

   Publier une règle d'examen fausse dans un outil d'enseignant est la pire
   erreur possible : le collègue compose son devoir dessus.
   ========================================================================= */

(function (root) {
  'use strict';

  /* ------------------------------------------------------------------
     1. GRILLES DE CORRECTION
     ------------------------------------------------------------------ */

  var GRILLES = {
    apc4: {
      id: 'apc4', nom: 'Grille harmonisée à 4 critères', total: 20,
      criteres: [
        { nom: 'Pertinence / Compréhension', points: 6 },
        { nom: 'Cohérence / Organisation des idées', points: 6 },
        { nom: 'Correction de la langue', points: 6 },
        { nom: 'Originalité / Présentation', points: 2 }
      ],
      source: 'Corrigés harmonisés nationaux OBC 2020-2022 ; Draft EST (grille critériée annexée aux dissertations)',
      confiance: 'officiel',
      note: 'Grille des dissertations, des essais et de l’expression écrite. Le Draft EST nomme les critères pertinence, cohérence, correction de la langue et originalité.'
    },
    langue4rub5: {
      id: 'langue4rub5', nom: 'Langue française — 4 rubriques × 5 points', total: 20,
      criteres: [
        { nom: 'I. Communication', points: 5 },
        { nom: 'II. Morphosyntaxe', points: 5 },
        { nom: 'III. Sémantique / Lexicologie', points: 5 },
        { nom: 'IV. Stylistique / Rhétorique des textes', points: 5 }
      ],
      source: 'Épreuve de Langue française Probatoire/BAC (ESG) ; sujets réels 2021',
      confiance: 'officiel',
      note: 'Dans chaque rubrique, la question se décompose en a. repérage ou identification, b. analyse, c. interprétation (« Les questions posées renvoient au repérage, à l’analyse et à l’interprétation », Draft EST). Jamais de question théorique.'
    },
    langue4rub2: {
      id: 'langue4rub2', nom: 'Langue — 4 rubriques × 2 points', total: 8,
      criteres: [
        { nom: 'I. Communication', points: 2 },
        { nom: 'II. Morphosyntaxe', points: 2 },
        { nom: 'III. Sémantique / Lexicologie', points: 2 },
        { nom: 'IV. Stylistique / Rhétorique des textes', points: 2 }
      ],
      source: 'Draft EST — sujet de type 1, séries techniques (STT et industrielles)',
      confiance: 'officiel'
    },
    contraction992: {
      id: 'contraction992', nom: 'Contraction de texte et discussion', total: 20,
      criteres: [
        { nom: 'Résumé (au ¼) ou analyse (au 1/3)', points: 9 },
        { nom: 'Discussion', points: 9 },
        { nom: 'Présentation', points: 2 }
      ],
      source: 'Draft EST — descriptif des sujets ESG, Probatoire et BAC',
      confiance: 'officiel',
      note: 'Détail des 9 points du résumé : pertinence 3, technique 3, expression 3.'
    },
    resumeLangue1082: {
      id: 'resumeLangue1082', nom: 'Résumé de texte et langue', total: 20,
      criteres: [
        { nom: 'Résumé de texte', points: 10 },
        { nom: 'Langue (4 rubriques × 2)', points: 8 },
        { nom: 'Présentation', points: 2 }
      ],
      source: 'Draft EST — tableau des arrêtés, séries STT (Probatoire et BAC)',
      confiance: 'officiel'
    },
    orthoBEPC: {
      id: 'orthoBEPC', nom: 'Correction orthographique — barème par nature de faute', total: 20,
      criteres: [
        { nom: 'Grammaire / conjugaison (accord, conjugaison…)', points: 2, nombre: 5, sousTotal: 10 },
        { nom: 'Accent, majuscule, mauvaise coupure de mot en fin de ligne', points: 0.5, nombre: 4, sousTotal: 2 },
        { nom: 'Orthographe simple', points: 1, nombre: 4, sousTotal: 4 },
        { nom: 'Orthographe à incidence sémantique', points: 2, nombre: 2, sousTotal: 4 }
      ],
      source: 'Draft EST — descriptif BEPC ; arrêté N° 08/19/MINESEC/SG/IGE/IP-STT/IP-LAL pour CAP/STT',
      confiance: 'officiel',
      note: '15 fautes injectées, réparties en orthographe /10 et grammaire /10.'
    },
    etudeTexte1010: {
      id: 'etudeTexte1010', nom: 'Étude de texte — 2 rubriques', total: 20,
      criteres: [
        { nom: 'I. Compréhension du texte', points: 10 },
        { nom: 'II. Connaissance et maniement de la langue', points: 10 }
      ],
      source: 'Draft EST — descriptif BEPC ; programme officiel 1er cycle',
      confiance: 'officiel',
      note: 'Réponses ENTIÈREMENT RÉDIGÉES. La partie II porte sur des manipulations (expansions, réductions, transformations, substitutions), jamais sur des questions théoriques.'
    },
    etudeTexte44102: {
      id: 'etudeTexte44102', nom: 'Étude de texte technique — 4 parties', total: 20,
      criteres: [
        { nom: 'Compréhension', points: 4 },
        { nom: 'Maniement de la langue', points: 4 },
        { nom: 'Expression écrite', points: 10 },
        { nom: 'Présentation', points: 2 }
      ],
      source: 'Draft EST — CAP Industriels (examens DECC)',
      confiance: 'officiel',
      note: 'L’expression écrite est une situation-problème sous forme de tâche : contexte, support, type de production attendu, et trois consignes. Critères : pertinence, cohérence, correction de la langue, originalité.'
    },
    exploitation5582: {
      id: 'exploitation5582', nom: 'Exploitation de texte — BEP industriels', total: 20,
      criteres: [
        { nom: 'Compréhension', points: 5 },
        { nom: 'Maniement de la langue', points: 5 },
        { nom: 'Expression écrite', points: 8 },
        { nom: 'Présentation', points: 2 }
      ],
      source: 'Draft EST — BEP industriels',
      confiance: 'officiel'
    },
    exploitation668: {
      id: 'exploitation668', nom: 'Exploitation de texte — CAPIET', total: 20,
      criteres: [
        { nom: 'Compréhension', points: 6 },
        { nom: 'Maniement de la langue', points: 6 },
        { nom: 'Essai', points: 8 }
      ],
      source: 'Draft EST — CAPIET',
      confiance: 'officiel',
      note: 'Trois sujets d’essai de culture générale sont proposés au candidat.'
    },
    ee1erCycle: {
      id: 'ee1erCycle', nom: 'Expression écrite — 1er cycle', total: 20,
      criteres: [
        { nom: 'Compréhension de la situation', points: 6 },
        { nom: 'Organisation de la production', points: 6 },
        { nom: 'Correction de la langue', points: 6 },
        { nom: 'Présentation', points: 2 }
      ],
      source: 'Programme officiel MINESEC 1er cycle — évaluation sommative',
      confiance: 'officiel',
      note: 'Épreuve de 2 h, coefficient 2.'
    },
    contraction8102: {
      id: 'contraction8102', nom: 'Contraction de texte et discussion — 2nde', total: 20,
      criteres: [
        { nom: 'Résumé (au ¼) ou analyse (au 1/3)', points: 8 },
        { nom: 'Discussion', points: 10 },
        { nom: 'Présentation (perfectionnement)', points: 2 }
      ],
      source: 'guide pédagogique du 2nd cycle (« Changements 2nde », IGE) — grilles d’évaluation de la contraction et de la discussion',
      confiance: 'officiel',
      note: 'Résumé /8 : compréhension 3 (fidélité au texte 1,5 ; reformulation exacte des idées 1,5), technique 3 (chronologie des idées et système d’énonciation 1 ; cohérence et cohésion 1 ; limites du nombre de mots 1), expression 2 (accords et vocabulaire 1 ; syntaxe, temps et modes 1). Discussion /10 : compréhension 4 (thèse reformulée, développée, illustrée 2 ; antithèse 2), organisation 3 (enchaînement 1,5 ; cohésion 1,5), expression 3 (accords et vocabulaire 1,5 ; syntaxe, temps et modes 1,5).'
    },
    resumeDetail: {
      id: 'resumeDetail', nom: 'Résumé — grille de détail', total: 9,
      criteres: [
        { nom: 'Pertinence (idées retenues)', points: 3 },
        { nom: 'Technique du résumé', points: 3 },
        { nom: 'Expression', points: 3 }
      ],
      source: 'Corpus 2nd cycle — grille de résumé',
      confiance: 'officiel'
    }
  };

  /* ------------------------------------------------------------------
     2. STRUCTURES D'ÉPREUVES
     ------------------------------------------------------------------
     `sujetsAuChoix` > 1 signifie que le candidat CHOISIT : chaque sujet vaut
     20 points à lui seul. C'est l'oubli le plus fréquent quand on compose.
     ------------------------------------------------------------------ */

  var EPREUVES = [

    /* ======================= 1er CYCLE — classe ======================= */
    {
      code: 'CO_1C', examen: 'Évaluation sommative', cycle: 'Premier cycle',
      classes: ['6e', '5e', '4e', '3e'], nom: 'Correction orthographique',
      duree: '1 h', coeff: '1', sujetsAuChoix: 1, grille: 'orthoBEPC',
      texteSupport: { min: 120, max: 150, unite: 'mots', nature: 'texte contemporain en prose, lié aux domaines de vie du cycle' },
      parties: [{ titre: 'Texte fautif à corriger', points: 20, consigne: 'Recopie le texte en corrigeant les fautes. 15 fautes injectées.' }],
      interdits: ['Ne pas intituler l’épreuve « Dictée » : le programme du 1er cycle prescrit une CORRECTION ORTHOGRAPHIQUE, où l’élève corrige un texte fautif.'],
      consignesRedaction: ['Texte fautif noté sur une base de 00/20 : 15 fautes exactement — 5 de grammaire ou conjugaison (2 pts), 4 d’accent, majuscule, ponctuation ou coupure de mot (0,5 pt), 4 d’orthographe simple (1 pt), 2 d’orthographe à incidence sémantique (2 pts). L’examinateur ne note que les fautes prévues.'],
      source: 'Programme officiel MINESEC 1er cycle ; arrêté N° 08/19 pour la longueur 120-150 mots ; guide pédagogique 1er cycle (IGE) : 1 h, coefficient 1',
      confiance: 'officiel',
      note: 'Au BEPC, le descriptif officiel porte le texte à 150-200 mots.'
    },
    {
      code: 'ET_1C', examen: 'Évaluation sommative', cycle: 'Premier cycle',
      classes: ['6e', '5e', '4e', '3e'], nom: 'Étude de texte',
      duree: '1 h', coeff: '1', sujetsAuChoix: 1, grille: 'etudeTexte1010',
      texteSupport: { min: 150, max: 250, unite: 'mots', nature: 'texte contemporain de compréhension aisée' },
      parties: [
        { titre: 'I. Compréhension du texte', points: 10, consigne: 'Action, personnages, idées, éléments culturels.' },
        { titre: 'II. Connaissance et maniement de la langue', points: 10, consigne: 'Expansions, réductions, transformations, substitutions.' }
      ],
      interdits: [
        'Aucune question théorique (« Qu’est-ce qu’un… ? », « Récite la règle »).',
        'Aucune analyse logique : le programme la bannit de cette épreuve.'
      ],
      consignesRedaction: [
        'Compréhension : questions sur l’action, les personnages, les idées, les éléments culturels du texte.',
        'Langue : le vocabulaire sert la compréhension du texte ; la grammaire et la conjugaison se pratiquent par MANIPULATION d’une phrase du texte (expansion, réduction, transformation, substitution, déplacement, transposition, comparaison, groupes fonctionnels).',
        'Les réponses de l’élève sont entièrement rédigées.'
      ],
      source: 'Programme officiel MINESEC 1er cycle ; guide pédagogique 1er cycle (IGE) : 1 h, coefficient 1',
      confiance: 'officiel',
      note: 'Au BEPC, le descriptif officiel porte le texte à 200-250 mots.'
    },
    {
      code: 'EE_1C', examen: 'Évaluation sommative', cycle: 'Premier cycle',
      classes: ['6e', '5e', '4e', '3e'], nom: 'Expression écrite',
      duree: '2 h', coeff: '2', sujetsAuChoix: 1, grille: 'ee1erCycle',
      encadreSituation: { min: 40, max: 50, unite: 'mots' },
      parties: [
        { titre: 'Situation de communication', points: 0, consigne: 'Encadré de mise en situation de 40 à 50 mots.' },
        { titre: 'Production écrite', points: 20, consigne: 'Consigne en trois temps (1-2-3).' }
      ],
      consignesRedaction: ['L’énoncé d’intégration réunit : le CONTEXTE (situation de vie), le PROBLÈME à résoudre, la PRODUCTION attendue (type de texte), les CONSIGNES (durée, longueur en lignes) et les CONTRAINTES (ex. : « au moins trois raisons assorties d’exemples »). Ex. du guide : « Vous faites partie du club environnement… votre paragraphe, rédigé en 1 heure, ne devra pas dépasser 15 lignes. »'],
      source: 'Programme officiel MINESEC 1er cycle ; guide pédagogique 1er cycle (IGE) : 2 h, coefficient 2, grille 6/6/6/2',
      confiance: 'officiel'
    },

    /* ============================ BEPC ============================ */
    {
      code: 'BEPC_DICTEE', examen: 'BEPC', cycle: 'Premier cycle', classes: ['3e'],
      nom: 'BEPC — Dictée', duree: '45 min', coeff: '—', sujetsAuChoix: 1,
      texteSupport: { min: 150, max: 200, unite: 'mots', nature: 'texte en français moderne, accessible' },
      parties: [{ titre: 'Dictée', points: 20 }],
      source: 'Draft EST — descriptif des sujets ESG, examens DECC : le BEPC',
      confiance: 'officiel'
    },
    {
      code: 'BEPC_ORTHO', examen: 'BEPC', cycle: 'Premier cycle', classes: ['3e'],
      nom: 'BEPC — Correction orthographique', duree: '45 min', coeff: '—',
      sujetsAuChoix: 1, grille: 'orthoBEPC',
      texteSupport: { min: 150, max: 200, unite: 'mots', nature: 'texte en français moderne' },
      parties: [{ titre: 'Texte fautif à corriger', points: 20, consigne: 'Fautes injectées à hauteur de 20 points : orthographe /10 et grammaire /10.' }],
      source: 'Draft EST — descriptif des sujets ESG, examens DECC : le BEPC',
      confiance: 'officiel'
    },
    {
      code: 'BEPC_ETUDE', examen: 'BEPC', cycle: 'Premier cycle', classes: ['3e'],
      nom: 'BEPC — Étude de texte', duree: '2 h', coeff: '2',
      sujetsAuChoix: 1, grille: 'etudeTexte1010',
      texteSupport: { min: 200, max: 250, unite: 'mots', nature: 'texte en français moderne, accessible' },
      parties: [
        { titre: 'I. Compréhension', points: 10 },
        { titre: 'II. Connaissance et maniement de la langue', points: 10 }
      ],
      interdits: ['Aucune question théorique ni analyse logique dans la partie II.'],
      formulesCorrige: ['Tous les éléments pertinents non prévus dans ces grilles que le candidat aura ajoutés seront pris en compte.'],
      source: 'Draft EST — descriptif des sujets ESG, examens DECC : le BEPC',
      confiance: 'officiel'
    },
    {
      code: 'BEPC_EE', examen: 'BEPC', cycle: 'Premier cycle', classes: ['3e'],
      nom: 'BEPC — Expression écrite', duree: '2 h', coeff: '2',
      sujetsAuChoix: 1, grille: 'apc4',
      encadreSituation: { min: 40, max: 50, unite: 'mots' },
      parties: [{ titre: 'Situation-problème', points: 20, consigne: 'Situation-problème d’évaluation des compétences : descriptive, narrative, argumentative…' }],
      source: 'Draft EST — descriptif des sujets ESG, examens DECC : le BEPC',
      confiance: 'officiel'
    },

    /* 2NDE (16/10/2026) — aucune épreuve ne la citait : la classe n'existait
       pas dans l'Atelier, et un professeur de 2nde ne pouvait pas composer
       avec Ambassa. Pas d'examen national en 2nde : ses épreuves de CLASSE
       suivent le descriptif ESG du second cycle (mêmes types de sujets, même
       barème sur 20), comme le font les cahiers de 2nde A et 2nde C-D. */
    /* ============ ESG — Probatoire et BAC séries A et ABI ============ */
    {
      code: 'A_LITT', examen: 'Probatoire / BAC', cycle: 'Second cycle général',
      classes: ['2nde', '1ère', 'Terminale'], series: ['A', 'ABI'],
      nom: 'Littérature ou culture générale — A, ABI',
      duree: '4 h', coeff: '3', sujetsAuChoix: 3, grille: 'contraction992',
      partiesParClasse: { '2nde': [
        { titre: 'Sujet de type 1 — Contraction de texte et discussion', points: 20, consigne: 'Résumé au ¼ ou analyse au 1/3 /8 · Discussion d’un problème tiré du texte /10 · Présentation /2.' },
        { titre: 'Sujet de type 2 — Commentaire composé', points: 20, consigne: 'Extrait de 20 à 30 lignes (200 à 250 mots) d’une ŒUVRE INTÉGRALE AU PROGRAMME de 2nde. En 2nde, on s’arrête au PLAN DÉTAILLÉ : 1. exprimer le thème ; 2. donner les centres d’intérêt avec leurs éléments constitutifs.' },
        { titre: 'Sujet de type 3 — Dissertation', points: 20, consigne: 'Dissertation littéraire ou de culture générale, sur une problématique invitant à une réflexion personnelle.' }
      ] },
      texteSupport: { min: 550, max: 650, unite: 'mots', nature: 'texte argumentatif ou explicatif en français contemporain' },
      texteSupportParClasse: { '2nde': { min: 400, max: 500, unite: 'mots', nature: 'texte argumentatif ou explicatif d’actualité, sans grande difficulté de compréhension (guide pédagogique 2nd cycle : 400 à 500 mots en 2nde)' } },
      parties: [
        { titre: 'Sujet de type 1 — Contraction de texte et discussion', points: 20, consigne: 'Résumé au ¼ ou analyse au 1/3 /9 · Discussion d’un problème tiré du texte /9 · Présentation /2.' },
        { titre: 'Sujet de type 2 — Commentaire composé', points: 20, consigne: 'Extrait de 20 à 30 lignes (200 à 250 mots) ou d’une vingtaine de vers d’une ŒUVRE INTÉGRALE AU PROGRAMME de la classe, avec une consigne non contraignante.' },
        { titre: 'Sujet de type 3 — Dissertation', points: 20, consigne: 'Dissertation littéraire ou de culture générale, sur une problématique invitant à une réflexion personnelle.' }
      ],
      formulesCorrige: [
        'On restera ouvert à toute autre interprétation pertinente du texte par le candidat.',
        'NB. Le candidat qui aura présenté d’autres arguments que ceux évoqués ici ne devra pas être pénalisé.'
      ],
      source: 'Draft EST — descriptif des sujets ESG ; corrigés harmonisés OBC ; guide pédagogique du 2nd cycle (« Changements 2nde », IGE) pour la 2nde (contraction /8 + discussion /10)',
      confiance: 'officiel',
      note: 'Le COMMENTAIRE COMPOSÉ n’existe qu’en séries A et ABI, et porte sur un extrait d’une œuvre intégrale au programme de la classe (règle de Jacques, 16/10/2026).',
      avertissement: 'Durée et coefficient issus des sujets et de l’usage ; le descriptif officiel ne les précise pas pour l’ESG. À confirmer sur la circulaire.'
    },
    {
      code: 'A_LANGUE', examen: 'Probatoire / BAC', cycle: 'Second cycle général',
      classes: ['2nde', '1ère', 'Terminale'], series: ['A', 'ABI'],
      nom: 'Langue française — A, ABI',
      duree: '2 h', coeff: '1', sujetsAuChoix: 1, grille: 'langue4rub5',
      consignesRedaction: [
        'CHAQUE QUESTION articule les trois opérations du descriptif, dans cet ordre et en sous-questions distinctes : a. REPÉRER ou IDENTIFIER le fait de langue dans le texte (relevez, identifiez, repérez) ; b. ANALYSER sa forme ou son fonctionnement (précisez la nature, la fonction, la valeur, la construction) ; c. INTERPRÉTER l’effet de sens qu’il produit dans CE texte (interprétez, dégagez l’effet, montrez le rôle).',
        'Aucune question théorique : ni définition, ni règle à réciter ; on fait observer et manipuler la langue sur des phrases du texte, citées entre « » mot pour mot.',
        'Les questions portent OBLIGATOIREMENT sur les contenus enseignés et mettent en évidence des aspects importants du texte ; elles évaluent des compétences d’expression et de communication.',
        '1ère et Terminale : les QUATRE rubriques (Communication, Morphosyntaxe, Sémantique / Lexicologie, Stylistique / Rhétorique des textes), 5 points chacune. 2nde : 5 à 6 questions, réparties sur les rubriques significatives du texte.'
      ],
      texteSupport: { min: 250, max: 400, unite: 'mots', nature: 'texte littéraire ou non littéraire' },
      texteSupportParClasse: { '2nde': { min: 200, max: 250, unite: 'mots', nature: 'texte littéraire ou non (guide pédagogique 2nd cycle : 200 à 250 mots en 2nde littéraire)' } },
      parties: [
        { titre: 'I. Communication', points: 5 },
        { titre: 'II. Morphosyntaxe', points: 5 },
        { titre: 'III. Sémantique / Lexicologie', points: 5 },
        { titre: 'IV. Stylistique / Rhétorique des textes', points: 5 }
      ],
      source: 'Draft EST — descriptif des sujets ESG',
      confiance: 'officiel',
      note: 'ÉPREUVE DISTINCTE de la littérature : les séries A composent DEUX épreuves de français.',
      avertissement: 'Durée et coefficient à confirmer sur la circulaire de la session.'
    },

    /* ========== ESG — Probatoire et BAC séries C, D, E, TI ========== */
    {
      code: 'CDETI_LITT', examen: 'Probatoire / BAC', cycle: 'Second cycle général scientifique',
      classes: ['2nde', '1ère', 'Terminale'], series: ['C', 'D', 'E', 'TI'],
      nom: 'Littérature ou culture générale — C, D, E, TI',
      duree: '3 h', coeff: '2', sujetsAuChoix: 2, grille: 'contraction992',
      partiesParClasse: { '2nde': [
        { titre: 'Sujet de type 1 — Contraction de texte et discussion', points: 20, consigne: 'Résumé au ¼ ou analyse au 1/3 /8 · Discussion d’un problème tiré du texte /10 · Présentation /2.' },
        { titre: 'Sujet de type 2 — Dissertation', points: 20, consigne: 'Dissertation littéraire ou de culture générale.' }
      ] },
      texteSupport: { min: 550, max: 650, unite: 'mots', nature: 'texte argumentatif ou explicatif en français contemporain' },
      texteSupportParClasse: { '2nde': { min: 400, max: 500, unite: 'mots', nature: 'texte argumentatif ou explicatif d’actualité, sans grande difficulté de compréhension (guide pédagogique 2nd cycle : 400 à 500 mots en 2nde)' } },
      parties: [
        { titre: 'Sujet de type 1 — Contraction de texte et discussion', points: 20, consigne: 'Résumé au ¼ ou analyse au 1/3 /9 · Discussion d’un problème tiré du texte /9 · Présentation /2.' },
        { titre: 'Sujet de type 2 — Dissertation', points: 20, consigne: 'Dissertation littéraire ou de culture générale.' }
      ],
      interdits: [
        'Pas de commentaire composé : le descriptif officiel le réserve aux séries A et ABI.',
        'DEUX sujets au choix, pas trois.'
      ],
      source: 'Draft EST — descriptif des sujets ESG (« 3 sujets pour les séries A et ABI ; 2 pour les CDETI ») ; sujets réels Probatoire C-D-E-TI 2021',
      confiance: 'officiel',
      note: 'L’analyse au 1/3 impose la distanciation : style indirect, modification des pronoms et des temps. Le résumé au ¼ conserve l’ordre et le système d’énonciation de l’auteur. Indiquer le nombre exact de mots.'
    },
    {
      code: 'CDETI_LANGUE', examen: 'Probatoire / BAC', cycle: 'Second cycle général scientifique',
      classes: ['2nde', '1ère', 'Terminale'], series: ['C', 'D', 'E', 'TI'],
      nom: 'Langue française — C, D, E, TI',
      duree: '2 h', coeff: '1', sujetsAuChoix: 1, grille: 'langue4rub5',
      consignesRedaction: [
        'CHAQUE QUESTION articule les trois opérations du descriptif, dans cet ordre et en sous-questions distinctes : a. REPÉRER ou IDENTIFIER le fait de langue dans le texte (relevez, identifiez, repérez) ; b. ANALYSER sa forme ou son fonctionnement (précisez la nature, la fonction, la valeur, la construction) ; c. INTERPRÉTER l’effet de sens qu’il produit dans CE texte (interprétez, dégagez l’effet, montrez le rôle).',
        'Aucune question théorique : ni définition, ni règle à réciter ; on fait observer et manipuler la langue sur des phrases du texte, citées entre « » mot pour mot.',
        'Les questions portent OBLIGATOIREMENT sur les contenus enseignés et mettent en évidence des aspects importants du texte ; elles évaluent des compétences d’expression et de communication.',
        '1ère et Terminale : les QUATRE rubriques (Communication, Morphosyntaxe, Sémantique / Lexicologie, Stylistique / Rhétorique des textes), 5 points chacune. 2nde : 5 à 6 questions, réparties sur les rubriques significatives du texte.'
      ],
      texteSupport: { min: 250, max: 400, unite: 'mots', nature: 'texte littéraire ou non littéraire' },
      texteSupportParClasse: { '2nde': { min: 150, max: 200, unite: 'mots', nature: 'texte littéraire ou non (guide pédagogique 2nd cycle : 150 à 200 mots en 2nde scientifique)' } },
      parties: [
        { titre: 'I. Communication', points: 5 },
        { titre: 'II. Morphosyntaxe', points: 5 },
        { titre: 'III. Sémantique / Lexicologie', points: 5 },
        { titre: 'IV. Stylistique / Rhétorique des textes', points: 5 }
      ],
      source: 'Draft EST — descriptif des sujets ESG ; en-tête du programme TI (« Coefficient : Littérature 2 / Langue 1 »)',
      confiance: 'officiel',
      note: 'ÉPREUVE DISTINCTE de la littérature : les séries scientifiques composent DEUX épreuves de français, pas une.'
    },

    /* =============== EST tertiaire — STT (Probatoire, BAC) =============== */
    {
      code: 'STT', examen: 'Probatoire / BAC', cycle: 'Enseignement secondaire technique — tertiaire',
      classes: ['1ère technique', 'Terminale technique'],
      series: ['ACA', 'ACC', 'CG', 'FIG', 'ESF', 'HT'],
      nom: 'Probatoire / BAC STT — Français',
      duree: '3 h', coeff: '2', sujetsAuChoix: 2, grille: 'resumeLangue1082',
      texteSupport: { min: 400, max: 500, unite: 'mots', nature: 'texte non littéraire relatif au domaine de la spécialité' },
      parties: [
        { titre: 'Sujet de type I — Résumé de texte et langue', points: 20, consigne: 'Résumé /10 · Langue, 4 rubriques × 2 pts /8 · Présentation /2.' },
        { titre: 'Sujet de type II — Dissertation littéraire', points: 20, consigne: 'Libellé + consigne. Toujours préciser le domaine ou le problème posé.' }
      ],
      source: 'Draft EST — tableau des arrêtés, Probatoires et Baccalauréats séries ACA, CG, ACC, FIG, ESF, HT',
      confiance: 'officiel',
      note: 'En série SES, le texte support monte à 500-600 mots. UNE seule épreuve de français, contrairement aux séries scientifiques.',
      consignesRedaction: ['Toujours associer le corrigé et le texte original photocopié à l’épreuve proposée.']
    },
    {
      code: 'SES', examen: 'Probatoire / BAC', cycle: 'Enseignement secondaire technique — tertiaire',
      classes: ['1ère technique', 'Terminale technique'], series: ['SES'],
      nom: 'Probatoire / BAC SES — Français',
      duree: '3 h', coeff: '2', sujetsAuChoix: 2, grille: 'resumeLangue1082',
      texteSupport: { min: 500, max: 600, unite: 'mots', nature: 'texte non littéraire relatif au domaine de la spécialité' },
      parties: [
        { titre: 'Sujet de type I — Résumé de texte et langue', points: 20, consigne: 'Résumé /10 · Langue, 4 rubriques × 2 pts /8 · Présentation /2.' },
        { titre: 'Sujet de type II — Dissertation littéraire', points: 20 }
      ],
      source: 'Draft EST — tableau des arrêtés, série SES',
      confiance: 'officiel'
    },

    /* ============== EST industriel — F, AF, CI, BT ============== */
    {
      code: 'IND', examen: 'Probatoire / BAC', cycle: 'Enseignement secondaire technique — industriel',
      classes: ['1ère technique', 'Terminale technique'],
      series: ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'AF', 'CI', 'BT'],
      nom: 'Probatoire / BAC industriel — Français',
      duree: '3 h', coeff: '2', sujetsAuChoix: 2, grille: 'resumeLangue1082',
      texteSupport: { min: 400, max: 500, unite: 'mots', nature: 'texte non littéraire' },
      parties: [
        { titre: 'Sujet de type 1 — Résumé (au ¼) ou analyse (au 1/3) de texte et langue', points: 20, consigne: 'Langue notée sur 8 : 4 rubriques × 2 pts. Questions de repérage, d’analyse et d’interprétation.' },
        { titre: 'Sujet de type 2 — Dissertation de culture littéraire', points: 20, consigne: 'Citation (ou non) d’un écrivain ou d’un critique, suivie d’une consigne. Grille critériée annexée au libellé.' }
      ],
      source: 'Draft EST — DESCRIPTIF DES ÉPREUVES TI, I. Baccalauréat F, AF, CI et de BT (la même définition s’applique au Probatoire)',
      confiance: 'officiel',
      note: 'Le Draft EST donne DEUX sujets au choix et le coefficient 02. Une épreuve zéro Probatoire industriel 2020 (IP/LAL) circule avec TROIS sujets et le coefficient 03, ajoutant un esprit de synthèse /5 et une expression écrite /5. Suivre la consigne MINESEC de la session.',
      avertissement: 'Deux variantes coexistent (Draft EST coef 2 / épreuve zéro 2020 coef 3). Confirmer sur la circulaire.'
    },

    /* ================= EST industriel — BP et BEP ================= */
    {
      code: 'BP_IND', examen: 'BP industriel', cycle: 'Enseignement secondaire technique — industriel',
      classes: ['BP'], nom: 'BP Industriel — Français',
      duree: '3 h', coeff: '2', sujetsAuChoix: 2,
      parties: [
        { titre: 'Sujet 1 — Rédaction d’une lettre administrative', points: 20, consigne: 'Respect de la forme /6 · Organisation des idées /6 · Maîtrise de la langue /6 · Présentation de la copie /2.' },
        { titre: 'Sujet 2 — Rédaction ou exploitation d’un rapport ou d’un compte rendu', points: 20, consigne: 'Méthodologie /6 · Organisation des idées /6 · Maîtrise de la langue /6 · Présentation de la copie /2.' }
      ],
      source: 'Draft EST — BP et BEP Industriels',
      confiance: 'officiel'
    },
    {
      code: 'BEP_IND', examen: 'BEP industriel', cycle: 'Enseignement secondaire technique — industriel',
      classes: ['BEP'], nom: 'BEP Industriels — Français',
      duree: '3 h', coeff: '2', sujetsAuChoix: 2, grille: 'exploitation5582',
      texteSupport: { min: 400, max: 500, unite: 'mots', nature: 'texte non littéraire' },
      parties: [
        { titre: 'Sujet 1 — Exploitation de texte', points: 20, consigne: 'Compréhension /5 · Maniement de la langue /5 · Expression écrite /8 · Présentation /2.' },
        { titre: 'Sujet 2 — Dissertation de culture générale', points: 20, consigne: 'Point de vue sur un problème de culture générale en rapport avec le monde socio-professionnel. Compréhension /6 · Organisation des idées /6 · Langue /6 · Présentation /2.' }
      ],
      source: 'Draft EST — BEP industriels',
      confiance: 'officiel'
    },

    /* ===================== Examens DECC techniques ===================== */
    {
      code: 'CAP_IND', examen: 'CAP', cycle: 'Enseignement secondaire technique',
      classes: ['4e année technique'], nom: 'CAP Industriels — Étude de texte',
      duree: '2 h', coeff: '2', sujetsAuChoix: 1, grille: 'etudeTexte44102',
      parties: [
        { titre: 'Compréhension', points: 4 },
        { titre: 'Maniement de la langue', points: 4 },
        { titre: 'Expression écrite', points: 10, consigne: 'Situation-problème sous forme de tâche : contexte, support, type de production attendu et trois consignes.' },
        { titre: 'Présentation', points: 2 }
      ],
      source: 'Draft EST — IV. Examens DECC, 1. Le CAP Industriels',
      confiance: 'officiel',
      note: 'Critères évalués : pertinence, cohérence, correction de la langue, originalité de la copie.'
    },
    {
      code: 'CAP_STT_ORTHO', examen: 'CAP / STT', cycle: 'Enseignement secondaire technique',
      classes: ['4e année technique'], nom: 'CAP-STT — Correction orthographique',
      duree: '45 min', coeff: '—', sujetsAuChoix: 1, grille: 'orthoBEPC',
      texteSupport: { min: 120, max: 150, unite: 'mots', nature: 'texte contemporain en prose, relatif aux domaines de vie du cycle' },
      parties: [{ titre: 'Texte fautif à corriger', points: 20, consigne: 'Orthographe /10 · Grammaire /10. 15 fautes.' }],
      source: 'Draft EST — arrêté N° 08/19/MINESEC/SG/IGE/IP-STT/IP-LAL',
      confiance: 'officiel',
      consignesRedaction: ['Toujours associer le corrigé et le texte original photocopié à l’épreuve proposée.']
    },
    {
      code: 'CAP_STT_ETUDE', examen: 'CAP / STT', cycle: 'Enseignement secondaire technique',
      classes: ['4e année technique'], nom: 'CAP-STT — Étude de texte',
      duree: '2 h', coeff: '2', sujetsAuChoix: 1, grille: 'etudeTexte44102',
      texteSupport: { min: 200, max: 250, unite: 'mots', nature: 'texte contemporain de compréhension aisée, relatif aux domaines de vie étudiés' },
      parties: [
        { titre: 'Compréhension du texte', points: 4 },
        { titre: 'Maniement de la langue', points: 4 },
        { titre: 'Expression écrite', points: 10 },
        { titre: 'Présentation', points: 2 }
      ],
      source: 'Draft EST — arrêté N° 08/19/MINESEC/SG/IGE/IP-STT/IP-LAL',
      confiance: 'officiel'
    },
    {
      code: 'CAPIET', examen: 'CAPIET', cycle: 'Enseignement secondaire technique',
      classes: ['CAPIET'], nom: 'CAPIET — Exploitation de texte',
      duree: '3 h', coeff: '3', sujetsAuChoix: 1, grille: 'exploitation668',
      texteSupport: { min: 400, max: 500, unite: 'mots', nature: 'texte non littéraire, de compréhension aisée' },
      parties: [
        { titre: 'Compréhension', points: 6 },
        { titre: 'Maniement de la langue', points: 6 },
        { titre: 'Essai', points: 8, consigne: 'Trois sujets de culture générale sont proposés ; le candidat donne son opinion sur un problème précis.' }
      ],
      source: 'Draft EST — IV. Examens DECC, le CAPIET',
      confiance: 'officiel'
    },
    {
      code: 'ENIET1', examen: 'ENIET', cycle: 'Enseignement secondaire technique',
      classes: ['ENIET 1ère année'], nom: 'ENIET 1ère année — Étude de texte',
      duree: '2 h', coeff: '2', sujetsAuChoix: 1,
      texteSupport: { min: 150, max: 250, unite: 'mots' },
      parties: [
        { titre: 'Compréhension', points: 4, consigne: 'Action, personnages, idées, éléments culturels.' },
        { titre: 'Maniement', points: 4, consigne: 'Grammaire, conjugaison, vocabulaire, orthographe.' },
        { titre: 'Expression', points: 4, consigne: 'Situation-problème : contexte, type de production attendu, consignes.' },
        { titre: 'Présentation', points: 2 }
      ],
      grille: 'apc4',
      source: 'Draft EST — LES ENIET 1, 2 et 3',
      confiance: 'a_verifier',
      avertissement: 'Le descriptif officiel énumère 4 + 4 + 4 + 2 = 14 points, pas 20. Il manque vraisemblablement des points sur l’expression écrite. Confirmer sur la circulaire avant de composer.'
    },
    {
      code: 'ENIET2', examen: 'ENIET', cycle: 'Enseignement secondaire technique',
      classes: ['ENIET 2e année'], nom: 'ENIET 2e année — Exploitation de texte',
      duree: '3 h', coeff: '4', sujetsAuChoix: 1,
      texteSupport: { min: 400, max: 500, unite: 'mots', nature: 'texte non littéraire, contemporain, de compréhension facile' },
      parties: [
        { titre: 'Compréhension', points: 4 },
        { titre: 'Maniement', points: 4 },
        { titre: 'Esprit de synthèse', points: 5, consigne: 'Résumé partiel du texte.' },
        { titre: 'Présentation', points: 2 }
      ],
      source: 'Draft EST — LES ENIET 1, 2 et 3',
      confiance: 'a_verifier',
      avertissement: 'Le descriptif officiel énumère 4 + 4 + 5 + 2 = 15 points, pas 20. L’épreuve zéro industrielle 2020 comporte en plus une expression écrite /5, ce qui compléterait le total. Confirmer sur la circulaire.'
    },
    {
      code: 'ENIET3', examen: 'ENIET', cycle: 'Enseignement secondaire technique',
      classes: ['ENIET 3e année'], nom: 'ENIET 3e année — Culture générale',
      duree: '2 h', coeff: '2', sujetsAuChoix: 2, grille: 'apc4',
      parties: [
        { titre: 'Sujet 1 — Culture générale', points: 20, consigne: 'Point de vue sur un problème socioprofessionnel, socioéconomique ou socioculturel.' },
        { titre: 'Sujet 2 — Culture générale', points: 20 }
      ],
      source: 'Draft EST — LES ENIET 1, 2 et 3',
      confiance: 'officiel'
    }
  ];

  /* ------------------------------------------------------------------
     3. GABARITS DE LEÇON
     ------------------------------------------------------------------ */

  var GABARITS = [

    /* ===================== PREMIER CYCLE ===================== */
    {
      id: 'langue', nom: 'Leçon de langue', famille: 'cours', cycle: '1er', icon: 'book', tint: '#e7f1fb',
      tag: '5 étapes', demarche: 'inductive et contrastive',
      desc: 'Observation, analyse, vérification, formulation de la règle, consolidation.',
      sousTypes: ['Grammaire', 'Conjugaison', 'Vocabulaire', 'Orthographe'],
      phases: [
        { nom: 'Observation / découverte', hint: 'Lecture du corpus, reconnaissance du fait de langue par un questionnaire guide.', duree: '10 min' },
        { nom: 'Analyse', hint: 'Repérage puis manipulations : transformation, substitution, permutation, expansion, réduction.', duree: '15 min' },
        { nom: 'Vérification / confrontation', hint: 'Les apprenants confrontent leurs productions, relèvent et corrigent.', duree: '10 min' },
        { nom: 'Formulation de la règle', hint: 'Les élèves formulent la règle ; le professeur l’améliore. C’est le « Je retiens ».', duree: '10 min' },
        { nom: 'Consolidation', hint: 'Exercices de repérage, à trous, de transformation, puis de production.', duree: '10 min' }
      ],
      exigencesCorpus: [
        'Corpus COURT, d’auteur ou composé, contemporain.',
        'Thématique rattachée au module en cours.',
        'Contient effectivement le fait de langue visé.',
        'UNE seule structure à la fois.'
      ],
      source: 'Programme officiel MINESEC 1er cycle', confiance: 'officiel'
    },
    {
      id: 'lecture', nom: 'Lecture méthodique', famille: 'cours', cycle: '1er', icon: 'search', tint: '#efe8fa',
      tag: '6 étapes',
      desc: 'Lecture, hypothèses, axes, analyse en tableau à 4 entrées, confrontation, synthèse.',
      phases: [
        { nom: 'Lecture du texte', hint: 'Lecture silencieuse par les élèves, puis lecture expressive du professeur.', duree: '5 min' },
        { nom: 'Observation et hypothèses de lecture', hint: 'Paratexte, éléments formels (mise en page, typographie, ponctuation), premières impressions, hypothèses à vérifier.', duree: '10 min' },
        { nom: 'Choix des axes de lecture', hint: 'Les axes se déduisent des hypothèses ; chacun étudie ensemble le fond et la forme.', duree: '5 min' },
        { nom: 'Analyse en tableau à 4 entrées', hint: 'Outils d’analyse | Repérage des indices | Analyse | Interprétation — en partant des outils de la langue.', duree: '15 min' },
        { nom: 'Confrontation des résultats', hint: 'Les apprenants justifient leur bilan de lecture ; on revient aux hypothèses : confirmées, nuancées, écartées.', duree: '10 min' },
        { nom: 'Synthèse', hint: 'Tableau d’analyse et sens du texte : la trace écrite. Lecture expressive finale si le temps le permet.', duree: '10 min' }
      ],
      texteSupport: { min: 250, max: 400, unite: 'mots', note: 'La poésie peut être plus courte.' },
      objectifsInterdits: ['construire le sens', 'montrer que le personnage est'],
      source: 'Fiche « Vérification 1er cycle » (démarches officielles du 1er cycle) : séance de 55 min ; Programme officiel MINESEC 1er cycle', confiance: 'officiel',
      note: 'Un texte par module doit être rattaché aux contenus transversaux (EVF/EMP, VIH-SIDA, EPA).'
    },
    {
      id: 'suivie', nom: 'Lecture suivie', famille: 'cours', cycle: '1er', icon: 'book', tint: '#fdefdb',
      tag: '~100 lignes',
      desc: 'Compréhension globale d’un extrait long, avec fiche d’identité de l’œuvre.',
      phases: [
        { nom: 'Situation de l’extrait', hint: 'Les apprenants situent le passage dans l’action de l’œuvre.', duree: '5 min' },
        { nom: 'Lecture du texte', hint: 'Lecture expressive du professeur pour donner le ton, puis lecture de quelques élèves.', duree: '15 min' },
        { nom: 'Élaboration de la grille de lecture', hint: 'Compréhension GLOBALE : qui parle ? à qui ? de quoi ? où, quand ? — en groupes.', duree: '15 min' },
        { nom: 'Confrontation', hint: 'Chaque groupe présente et justifie sa grille ; les mots difficiles s’expliquent en contexte, sans s’y attarder.', duree: '10 min' },
        { nom: 'Bilan', hint: 'Synthèse : grille améliorée, résumé ou leçon tirée du texte, notés par les élèves.', duree: '10 min' }
      ],
      objectifsInterdits: ['lire couramment', 'formuler la leçon de morale', 'saisir le sens'],
      interdits: ['Ne pas expliquer systématiquement les mots difficiles : l’objectif est la compréhension GLOBALE.'],
      note: 'L’étude de l’œuvre s’ouvre par des activités augurales et se clôt par la fiche d’identité (fiche structure) établie par les élèves. Hors de la classe : lecture des autres passages, résumé ou compte rendu.',
      source: 'Fiche « Vérification 1er cycle » (démarches officielles du 1er cycle) : séance de 55 min ; Programme officiel MINESEC 1er cycle', confiance: 'officiel'
    },
    {
      id: 'ee', nom: 'Expression écrite', famille: 'cours', cycle: '1er', icon: 'pen', tint: '#fdefdb', tag: '5 étapes',
      desc: 'Situation-problème, analyse du corpus et production, confrontation, règle, application.',
      phases: [
        { nom: 'Découverte de la situation-problème', hint: 'Un corpus (texte court ou sujet) et un questionnaire : les traits saillants de l’objet d’étude.', duree: '10 min' },
        { nom: 'Analyse du corpus et production', hint: 'Vocabulaire, syntaxe, organisation, intention, style, idées ; travail individuel ou en équipes, temps fixé.', duree: '20 min' },
        { nom: 'Confrontation', hint: 'Chaque groupe présente et justifie sa production ; les erreurs sont décelées et corrigées.', duree: '10 min' },
        { nom: 'Formulation de la règle', hint: 'Les corrections sont synthétisées et notées dans le cahier.', duree: '5 min' },
        { nom: 'Exercices d’application', hint: 'Repérage, transformation, substitution, reconstruction, production.', duree: '10 min' }
      ],
      grille: 'ee1erCycle',
      source: 'Fiche « Vérification 1er cycle » (démarches officielles du 1er cycle) : séance de 55 min', confiance: 'officiel'
    },
    {
      id: 'eo', nom: 'Expression orale', famille: 'cours', cycle: '1er', icon: 'mic', tint: '#e6f5ec', tag: '4 phases',
      desc: 'Amorce, écoute, production orale, évaluation.',
      phases: [
        { nom: 'Amorce', hint: 'Mise en situation de communication.', duree: '8 min' },
        { nom: 'Écoute / observation', hint: 'Support oral, repérage.', duree: '12 min' },
        { nom: 'Production orale', hint: 'Prise de parole des apprenants.', duree: '25 min' },
        { nom: 'Évaluation / remédiation', hint: 'Grille d’écoute, retours.', duree: '10 min' }
      ],
      source: 'Programme officiel MINESEC', confiance: 'standard'
    },
    {
      id: 'integ', nom: 'Activité d’intégration', famille: 'cours', cycle: 'tous', icon: 'puzzle', tint: '#e7f1fb', tag: 'situation',
      desc: 'Contexte, support, tâche, production attendue, consignes, contraintes.',
      phases: [
        { nom: 'Présentation de la situation', hint: 'Contexte et problème à résoudre.', duree: '10 min' },
        { nom: 'Mobilisation des ressources', hint: 'Les élèves mobilisent les savoirs du module ou de la séquence.', duree: '15 min' },
        { nom: 'Production', hint: 'Réalisation de la tâche.', duree: '30 min' },
        { nom: 'Objectivation', hint: 'Retour réflexif sur la démarche suivie.', duree: '5 min' }
      ],
      champsObligatoires: ['intContexte', 'intTache', 'intProduction', 'intConsignes', 'intContraintes'],
      source: 'Approche par les compétences — programme MINESEC ; formulation du Draft EST',
      confiance: 'officiel',
      note: 'Le descriptif du CAP Industriels précise que la tâche comprend le contexte, le support, le type de production attendu et TROIS consignes.'
    },
    {
      id: 'remediation', nom: 'Compte rendu et remédiation', famille: 'cours', cycle: 'tous', icon: 'puzzle', tint: '#fdefdb', tag: 'après évaluation',
      desc: 'Rendre la copie, analyser les erreurs, remédier, revérifier.',
      phases: [
        { nom: 'Compte rendu de l’évaluation', hint: 'Résultats, attentes du barème, erreurs les plus fréquentes.', duree: '30 min' },
        { nom: 'Typologie des erreurs', hint: 'Classer : compréhension, méthode, langue, présentation.', duree: '30 min' },
        { nom: 'Remédiation ciblée', hint: 'Un exercice par type d’erreur dominant, pas un cours entier refait.', duree: '40 min' },
        { nom: 'Vérification', hint: 'Reprise d’une tâche du même type pour mesurer le progrès.', duree: '20 min' }
      ],
      source: 'Draft EST — progression : « Comptes rendus (1h) · Remédiation (1h) » en fin de séquence',
      confiance: 'officiel'
    },

    /* ===================== SECOND CYCLE — ŒUVRE ===================== */
    {
      id: 'augurales', nom: 'Activités augurales', famille: 'cours', cycle: '2nd', icon: 'search', tint: '#e6f5ec',
      tag: 'entrée en œuvre',
      desc: 'Entrer dans une œuvre intégrale par le paratexte et les textes ouvroir et fermoir.',
      phases: [
        { nom: 'Paratexte auctorial', hint: 'Nom de l’auteur, titre, dédicace, épigraphe, préface d’auteur.', duree: '10 min' },
        { nom: 'Paratexte éditorial et critique', hint: 'Couverture, quatrième de couverture, collection, appareil critique.', duree: '10 min' },
        { nom: 'Texte ouvroir', hint: 'Incipit : ce qu’il installe et ce qu’il promet.', duree: '15 min' },
        { nom: 'Texte fermoir', hint: 'Excipit : ce qu’il clôt et ce qu’il laisse ouvert.', duree: '15 min' },
        { nom: 'Horizon d’attente', hint: 'Hypothèses de lecture pour l’étude de l’œuvre.', duree: '10 min' }
      ],
      source: 'Draft EST — éléments liés aux activités augurales', confiance: 'officiel'
    },
    {
      id: 'lecture2', nom: 'Lecture méthodique (2nd cycle)', famille: 'cours', cycle: '2nd', icon: 'search', tint: '#efe8fa',
      tag: '6 étapes',
      desc: 'Lectures, hypothèses, outils d’analyse, analyse, validation des hypothèses, bilan.',
      phases: [
        { nom: 'Lectures du texte', hint: 'Situer l’extrait dans l’œuvre ; lecture expressive par le professeur, lecture silencieuse par les élèves.', duree: '5 min' },
        { nom: 'Observation et formulation des hypothèses', hint: 'Par des questions simples : paratexte, mise en page, ponctuation, typographie ; premières impressions → hypothèses de lecture.', duree: '10 min' },
        { nom: 'Choix des outils d’analyse', hint: 'Les outils se choisissent selon le genre et le type du texte et selon les hypothèses : ils ne sont pas donnés d’avance.', duree: '5 min' },
        { nom: 'Analyse du texte', hint: 'Analyse à l’aide des outils retenus : repérage des indices, analyse, interprétation (tableau à 4 entrées).', duree: '20 min' },
        { nom: 'Validation des hypothèses', hint: 'Ce que l’analyse confirme, nuance ou écarte des hypothèses de départ.', duree: '10 min' },
        { nom: 'Bilan', hint: 'Sens du texte construit avec la classe ; rapport à l’œuvre entière ou au groupement.', duree: '10 min' }
      ],
      texteSupport: { min: 200, max: 350, unite: 'mots', note: '20 à 30 lignes, texte LITTÉRAIRE tiré d’une œuvre au programme ou d’un groupement de textes.' },
      exigencesCorpus: ['Texte LITTÉRAIRE de 20 à 30 lignes.', 'Tiré d’une œuvre intégrale au programme de la classe, ou d’un groupement de textes.'],
      objectifsInterdits: ['construire le sens'],
      interdits: ['L’objectif évite les formules passe-partout (« construire le sens du texte ») et l’anticipation du sens : il part des traits formels de l’écriture et de la thématique de CE texte.'],
      source: 'guide pédagogique du 2nd cycle (« Changements 2nde », IGE) — l’apprentissage de la lecture méthodique ; Draft EST, progressions (1 h)',
      confiance: 'officiel'
    },
    {
      id: 'gt', nom: 'Groupement de textes', famille: 'cours', cycle: '2nd', icon: 'book', tint: '#e6f5ec',
      tag: '4 à 6 textes',
      desc: 'Une collection de 4 à 6 textes de 20 à 30 lignes autour d’un problème, d’un thème, d’un genre ou d’un auteur.',
      phases: [
        { nom: 'Présentation du groupement', hint: 'L’axe d’étude (un titre formulé avec précision), l’objectif, les textes ordonnés, les motifs de confrontation. Peut se coupler à l’étude du 1er texte.', duree: '1 h' },
        { nom: 'Étude des textes', hint: 'Une heure par texte, sous le prisme des motifs de confrontation ; méthode choisie selon le texte (lecture méthodique, commentaire, épreuve de langue, résumé pour un texte d’idées).', duree: '4 h' },
        { nom: 'Confrontation et bilan', hint: 'Deux tableaux : les motifs de confrontation par texte ; convergences, divergences et bilan. La séance vaut évaluation du groupement.', duree: '1 h' }
      ],
      texteSupport: { min: 200, max: 350, unite: 'mots', note: 'Chaque texte : 20 à 30 lignes.' },
      exigencesCorpus: ['4 à 6 textes de 20 à 30 lignes, de préférence du même genre ou de la même époque.', 'Séries littéraires : deux groupements, à la fin de l’étude des deux premières œuvres ; séries scientifiques : un seul, après la 1ère œuvre.'],
      source: 'guide pédagogique du 2nd cycle (« Changements 2nde », IGE) — le groupement de textes (durée : 6 heures environ)',
      confiance: 'officiel'
    },
    {
      id: 'etudeEnsemble', nom: 'Étude d’ensemble de l’œuvre', famille: 'cours', cycle: '2nd', icon: 'book', tint: '#e7f1fb',
      tag: 'synthèse d’œuvre',
      desc: 'Personnages, espace, temps, actions, rythme, forces agissantes, écriture, thèmes.',
      phases: [
        { nom: 'Personnages et forces agissantes', hint: 'Schéma actantiel : sujet, objet, adjuvants, opposants, destinateur, destinataire.', duree: '15 min' },
        { nom: 'Espace et temps', hint: 'Lieux, chronologie, rythme du récit (sommaire, scène, ellipse, pause).', duree: '10 min' },
        { nom: 'Actions et structure', hint: 'Schéma narratif, articulation des séquences.', duree: '10 min' },
        { nom: 'Écriture et points de vue narratifs', hint: 'Narrateur, focalisation, registres, style.', duree: '15 min' },
        { nom: 'Thèmes', hint: 'Thèmes majeurs et leur traitement.', duree: '10 min' }
      ],
      source: 'Draft EST — éléments de l’étude d’ensemble', confiance: 'officiel'
    },
    {
      id: 'contexte', nom: 'Inscription de l’œuvre dans son contexte', famille: 'cours', cycle: '2nd', icon: 'search', tint: '#fdefdb',
      tag: 'contexte',
      desc: 'Ambiance de l’époque, vie de l’auteur, idées et canons artistiques.',
      phases: [
        { nom: 'Ambiance de l’époque', hint: 'Situation historique, sociale et politique au moment de l’écriture.', duree: '15 min' },
        { nom: 'Événements marquants de la vie de l’auteur', hint: 'Ce qui, dans sa biographie, éclaire l’œuvre — sans réduire l’œuvre à la vie.', duree: '15 min' },
        { nom: 'Idées et canons artistiques', hint: 'Courants, esthétiques et débats contemporains de l’œuvre.', duree: '15 min' },
        { nom: 'Retour au texte', hint: 'Trois passages que le contexte permet de mieux comprendre.', duree: '15 min' }
      ],
      source: 'Draft EST — éléments nécessaires à l’inscription de l’œuvre dans son contexte',
      confiance: 'officiel'
    },

    /* ============ SECOND CYCLE — MÉTHODOLOGIE DES EXERCICES ============ */
    {
      id: 'resume', nom: 'Contraction : le résumé', famille: 'cours', cycle: '2nd', icon: 'pen', tint: '#e7f1fb',
      tag: 'au ¼',
      desc: 'Réduire un texte au quart en conservant l’ordre et l’énonciation de l’auteur.',
      phases: [
        { nom: 'Travail préparatoire', hint: 'Repérer le thème, la thèse, le système énonciatif ; dégager la structure argumentative (thèse, connecteurs, arguments) ; traiter les exemples et les citations pour n’en garder que l’essentiel.', duree: '20 min' },
        { nom: 'Reformulation des idées', hint: 'Reformuler les idées retenues, dans l’ordre et l’énonciation de l’auteur (résumé) ou en les distanciant (analyse).', duree: '15 min' },
        { nom: 'Techniques de contraction', hint: 'Pronominalisation, nominalisation, phrase complexe → phrase simple (relative → adjectif ; complétive → groupe nominal ; circonstancielle → groupe prépositionnel).', duree: '15 min' },
        { nom: 'Rédaction et vérification', hint: 'Rester dans l’intervalle (marge de 10 %) et INDIQUER le nombre exact de mots employés.', duree: '10 min' }
      ],
      texteSupport: { min: 550, max: 650, unite: 'mots', nature: 'texte argumentatif ou explicatif en français contemporain' },
      texteSupportParClasse: { '2nde': { min: 400, max: 500, unite: 'mots', nature: 'texte argumentatif ou explicatif d’actualité (guide pédagogique 2nd cycle)' } },
      typesTexte: ['ARGUMENTATIF', 'EXPLICATIF'],
      exigencesCorpus: ['Texte ARGUMENTATIF ou EXPLICATIF, contemporain, d’actualité (jeunesse, chômage, TIC, sports…).', '400 à 500 mots en 2nde ; 550 à 650 mots en 1ère et en Terminale.', 'Texte d’auteur reproduit mot pour mot : on coupe en marquant […], on ne rallonge jamais.'],
      regleCle: 'Le résumé réduit au ¼ en respectant le système d’énonciation, l’ordre des idées et les limites fixées (marge de 10 %) ; le candidat indique le nombre exact de mots. Barème : /8 en 2nde (compréhension 3, technique 3, expression 2) ; /9 en 1ère et Terminale (3 + 3 + 3).',
      grille: 'resumeDetail',
      source: 'guide pédagogique du 2nd cycle (« Changements 2nde », IGE) — la contraction de texte ; Draft EST — progression 2nde, séquence I ; descriptif des épreuves',
      confiance: 'officiel'
    },
    {
      id: 'analyse', nom: 'Contraction : l’analyse', famille: 'cours', cycle: '2nd', icon: 'pen', tint: '#efe8fa',
      tag: 'au 1/3',
      desc: 'Réduire au tiers avec distanciation : le candidat parle de ce que dit l’auteur.',
      phases: [
        { nom: 'Travail préparatoire', hint: 'Repérer le thème, la thèse, le système énonciatif ; dégager la structure argumentative (thèse, connecteurs, arguments) ; traiter les exemples et les citations pour n’en garder que l’essentiel.', duree: '20 min' },
        { nom: 'Reformulation des idées', hint: 'Reformuler les idées retenues, dans l’ordre et l’énonciation de l’auteur (résumé) ou en les distanciant (analyse).', duree: '15 min' },
        { nom: 'Techniques de contraction', hint: 'Pronominalisation, nominalisation, phrase complexe → phrase simple (relative → adjectif ; complétive → groupe nominal ; circonstancielle → groupe prépositionnel).', duree: '15 min' },
        { nom: 'Rédaction et vérification', hint: 'Rester dans l’intervalle (marge de 10 %) et INDIQUER le nombre exact de mots employés.', duree: '10 min' }
      ],
      texteSupport: { min: 550, max: 650, unite: 'mots', nature: 'texte argumentatif ou explicatif en français contemporain' },
      texteSupportParClasse: { '2nde': { min: 400, max: 500, unite: 'mots', nature: 'texte argumentatif ou explicatif d’actualité (guide pédagogique 2nd cycle)' } },
      typesTexte: ['ARGUMENTATIF', 'EXPLICATIF'],
      exigencesCorpus: ['Texte ARGUMENTATIF ou EXPLICATIF, contemporain, d’actualité.', '400 à 500 mots en 2nde ; 550 à 650 mots en 1ère et en Terminale.'],
      regleCle: 'L’analyse réduit au 1/3 en CHANGEANT le système énonciatif (distanciation), en respectant ou non l’ordre des idées, en mettant en évidence les liens logiques (marge de 10 %) ; nombre exact de mots indiqué. Barème : /8 en 2nde ; /9 en 1ère et Terminale.',
      grille: 'resumeDetail',
      source: 'guide pédagogique du 2nd cycle (« Changements 2nde », IGE) — la contraction de texte ; Draft EST — descriptif des épreuves ; corrigés harmonisés OBC',
      confiance: 'officiel'
    },
    {
      id: 'discussion', nom: 'La discussion', famille: 'cours', cycle: '2nd', icon: 'mic', tint: '#fdefdb',
      tag: '5 séances',
      desc: 'Analyse du sujet, plan détaillé, introduction, paragraphe argumentatif, conclusion.',
      phases: [
        { nom: 'Analyse du sujet', hint: 'Repérer le problème tiré du texte, délimiter le champ du débat.', duree: '1 h' },
        { nom: 'Élaboration du plan détaillé', hint: 'Plan dialectique quand le libellé dit « discutez » ou « dans quelle mesure ».', duree: '1 h' },
        { nom: 'Rédaction de l’introduction', hint: 'Amener, poser le problème, annoncer.', duree: '1 h' },
        { nom: 'Rédaction du paragraphe argumentatif', hint: 'Idée, argument, exemple, retour à la thèse.', duree: '1 h' },
        { nom: 'Rédaction de la conclusion', hint: 'Bilan, réponse au problème, ouverture.', duree: '1 h' }
      ],
      typesTexte: ['ARGUMENTATIF', 'EXPLICATIF'],
      regleCle: 'La discussion, mini-dissertation, prend appui sur le texte à résumer : elle porte SOIT sur un problème abordé dans le texte, SOIT sur un passage précis (cité alors mot pour mot). Ce n’est pas une reprise du texte. L’élève donne un avis argumenté, nourri de son expérience et de ses lectures. Aucune limite de mots. Barème : /10 en 2nde (compréhension 4, organisation 3, expression 3) ; /9 en 1ère et Terminale (3 + 3 + 3).',
      source: 'Draft EST — progression 2nde, séquence III', confiance: 'officiel',
      note: 'La discussion vaut 9 points dans le sujet de type 1 du Probatoire et du BAC.'
    },
    {
      id: 'dissertation', nom: 'La dissertation', famille: 'cours', cycle: '2nd', icon: 'pen', tint: '#e7f1fb',
      tag: 'méthodologie',
      desc: 'Un jugement ou une opinion sur un problème littéraire ou général, et une consigne.',
      phases: [
        { nom: 'Analyse du sujet', hint: 'Expliquer l’opinion ; analyser la consigne (type de sujet — dialectique, analytique ou mixte — et plan induit ; domaine d’application) ; reformuler ; dégager le problème et formuler la problématique.', duree: '2 h' },
        { nom: 'Élaboration du plan', hint: 'Plan d’ensemble (réponses aux questions de la problématique), puis plan détaillé : arguments, exemples tirés des œuvres au programme, citations, hiérarchisés.', duree: '1 h' },
        { nom: 'Rédaction de l’introduction et de la conclusion', hint: 'Introduction : amener le sujet, poser le problème, énoncer la problématique, annoncer le plan. Conclusion : rappel de la problématique, bilan, ouverture.', duree: '1 h' },
        { nom: 'Rédaction du développement', hint: 'Le paragraphe argumentatif (idée, argument, exemple, citation insérée) et les transitions.', duree: '1 h' }
      ],
      grille: 'apc4',
      regleCle: 'Le sujet : un JUGEMENT ou une OPINION sur un problème littéraire, artistique ou général, suivi d’une CONSIGNE. Le type de sujet commande le plan. Barème /20 : 6 + 6 + 6 + 2.',
      interdits: ['Un libellé « sur citation » ne prête jamais à un auteur des mots non vérifiés dans l’œuvre : à défaut, une affirmation non attribuée (« On a pu dire que… »).', 'Les exemples viennent des œuvres AU PROGRAMME de la classe, jamais d’une œuvre du 1er cycle.'],
      source: 'guide pédagogique du 2nd cycle (« Changements 2nde », IGE) — la dissertation et sa grille ; Draft EST, progressions',
      confiance: 'officiel'
    },
    {
      id: 'commentaire', nom: 'Le commentaire composé', famille: 'cours', cycle: '2nd', icon: 'search', tint: '#efe8fa',
      tag: 'séries A et ABI',
      desc: 'Sur un extrait de 20 à 30 lignes d’une œuvre au programme : thème, centres d’intérêt, plan détaillé.',
      phases: [
        { nom: 'Découverte de l’épreuve', hint: 'Paratexte et lecture → premières impressions ; repérage du genre et du type de texte ; examen de la consigne (exprimer le thème ; donner les centres d’intérêt avec leurs éléments constitutifs).', duree: '1 h' },
        { nom: 'Analyse détaillée du texte', hint: 'Outils d’analyse textuelle adaptés au genre et au type du texte.', duree: '1 h' },
        { nom: 'Regroupement des données par affinités', hint: 'Formuler deux ou trois centres d’intérêt pertinents ; y rattacher les interprétations. Le commentaire ne suit pas le fil du texte et ne sépare pas le fond de la forme.', duree: '1 h' },
        { nom: 'Plan détaillé', hint: 'Pour chaque centre d’intérêt : idées directrices, idées-arguments, moyens d’expression (vocabulaire, syntaxe, figures). En 1ère et Terminale seulement : rédaction (introduction, paragraphes explicatifs, conclusion).', duree: '2 h' }
      ],
      grille: 'apc4',
      texteSupport: { min: 150, max: 400, unite: 'mots', note: '20 à 30 lignes (200 à 250 mots) ou une vingtaine de vers ayant une unité de sens, tirés d’une œuvre au programme.' },
      exigencesCorpus: ['Extrait d’une ŒUVRE INTÉGRALE AU PROGRAMME de la classe.', '20 à 30 lignes (200 à 250 mots) ou une vingtaine de vers ayant une unité de sens.'],
      regleCle: 'Exercice écrit, entièrement rédigé, « composé » : il regroupe les remarques en centres d’intérêt au lieu de suivre le texte. En 2nde, on s’arrête au plan détaillé. Barème /20 : compréhension et pertinence 6, organisation et cohérence 6, expression 6, originalité et présentation 2.',
      seriesReservees: ['A', 'ABI'],
      source: 'Draft EST — descriptif des sujets ESG ; guide pédagogique du 2nd cycle (« Changements 2nde », IGE) — initiation au commentaire composé et grille',
      confiance: 'officiel',
      note: 'Réservé aux séries A et ABI. Ne pas le proposer en C, D, E ou TI.'
    },
    {
      id: 'cultureGen', nom: 'Dissertation de culture générale', famille: 'cours', cycle: '2nd', icon: 'mic', tint: '#e6f5ec',
      tag: 'EST',
      desc: 'Point de vue sur un problème économique, social, culturel ou politique du monde professionnel.',
      phases: [
        { nom: 'Cerner le problème', hint: 'Le domaine doit être explicitement précisé dans le libellé.', duree: '1 h' },
        { nom: 'Mobiliser des références', hint: 'Faits, chiffres, expériences professionnelles, lectures.', duree: '1 h' },
        { nom: 'Construire la position', hint: 'Thèse, contre-arguments, position personnelle argumentée.', duree: '1 h' },
        { nom: 'Rédaction', hint: 'Compréhension /6 · Organisation des idées /6 · Langue /6 · Présentation /2.', duree: '2 h' }
      ],
      grille: 'apc4',
      source: 'Draft EST — BEP industriels, CAPIET, ENIET 3e année', confiance: 'officiel'
    },

    /* ============ SECOND CYCLE — LANGUE ET COMMUNICATION ============ */
    {
      id: 'langue2', nom: 'Langue française (2nd cycle)', famille: 'cours', cycle: '2nd', icon: 'book', tint: '#e7f1fb',
      tag: '5 étapes',
      desc: 'Observation, analyse, vérification, formulation de la règle, consolidation — sur un corpus d’une quinzaine de lignes.',
      sousTypes: [
        'I. Communication — émetteur/récepteur, référent et ses substituts, contenus latents et manifestes',
        'II. Morphosyntaxe — mots variables, structure de la phrase, liaisons',
        'III. Sémantique / Lexicologie — forme et signification des mots, champs lexicaux et sémantiques, énoncés constatif et performatif, actes de langage',
        'IV. Stylistique / Rhétorique des textes — types et genres de textes, figures'
      ],
      phases: [
        { nom: 'Observation / découverte', hint: 'Lecture du corpus ; découverte et reconnaissance du fait de langue EN CONTEXTE par un questionnaire guide.', duree: '10 min' },
        { nom: 'Analyse', hint: 'Repérage des signes par des questions précises, puis manipulations (transformation, substitution, permutation, addition, suppression) : les FORMES et les VALEURS du fait de langue.', duree: '20 min' },
        { nom: 'Vérification / confrontation', hint: 'Les apprenants évaluent leurs travaux, relèvent les erreurs, les expliquent et les corrigent ; les règles se dégagent.', duree: '10 min' },
        { nom: 'Formulation de la règle', hint: 'Les élèves formulent la règle ; le professeur l’améliore.', duree: '5 min' },
        { nom: 'Consolidation', hint: 'Entraînement sur une NOUVELLE situation : repérer, analyser, interpréter — comme à l’épreuve.', duree: '15 min' }
      ],
      exigencesCorpus: ['Texte littéraire ou non, d’une quinzaine de lignes, ayant une unité sémantique (ou document iconique, sonore).', 'Contient les faits de langue à maîtriser et repose sur un domaine de vie.'],
      grille: 'langue4rub5',
      source: 'guide pédagogique du 2nd cycle (« Changements 2nde », IGE) — méthode d’apprentissage de la langue ; Draft EST, progressions (1 h)',
      confiance: 'officiel',
      note: 'À l’épreuve, chaque question renvoie au repérage (ou à l’identification), à l’analyse et à l’interprétation : la consolidation entraîne à ces trois opérations.'
    },
    {
      id: 'typologie', nom: 'Typologie textuelle', famille: 'cours', cycle: '2nd', icon: 'book', tint: '#efe8fa',
      tag: 'types de textes',
      desc: 'Caractéristiques et fonctions des types de textes.',
      sousTypes: ['Descriptif', 'Narratif', 'Argumentatif', 'Explicatif', 'Injonctif', 'Théâtral', 'Poétique'],
      phases: [
        { nom: 'Observation d’un corpus contrasté', hint: 'Deux textes de types différents sur un même thème.', duree: '15 min' },
        { nom: 'Caractéristiques', hint: 'Marques linguistiques repérables : temps, personnes, connecteurs, lexique.', duree: '15 min' },
        { nom: 'Fonctions', hint: 'À quoi ce type de texte sert dans la communication.', duree: '10 min' },
        { nom: 'Production', hint: 'Rédiger un court texte du type étudié.', duree: '20 min' }
      ],
      source: 'Draft EST — rhétorique des textes ; progression 2nde',
      confiance: 'officiel'
    },
    {
      id: 'image', nom: 'Lecture de l’image', famille: 'cours', cycle: '2nd', icon: 'search', tint: '#e6f5ec',
      tag: 'iconique',
      desc: 'Première de couverture, affiches et illustrations diverses.',
      phases: [
        { nom: 'Description objective', hint: 'Ce qu’on voit, sans interpréter : plans, cadrage, couleurs, texte.', duree: '10 min' },
        { nom: 'Composition', hint: 'Organisation, lignes de force, place du regard.', duree: '15 min' },
        { nom: 'Connotations', hint: 'Ce que l’image suggère : symboles, stéréotypes, références.', duree: '20 min' },
        { nom: 'Fonction et destinataire', hint: 'À qui l’image parle et ce qu’elle cherche à obtenir.', duree: '15 min' }
      ],
      source: 'Draft EST — « lire l’image : a) la première de couverture ; b) affiches et illustrations diverses »',
      confiance: 'officiel'
    },
    {
      id: 'exposeCR', nom: 'Exposé, compte rendu et note de lecture', famille: 'cours', cycle: '2nd', icon: 'mic', tint: '#fdefdb',
      tag: 'oral et écrit',
      desc: 'Présenter un compte rendu, une note de lecture ou une note critique.',
      phases: [
        { nom: 'Choix et délimitation du sujet', hint: 'Un problème précis, pas un thème vague.', duree: '5 min' },
        { nom: 'Recherche et prise de notes', hint: 'Sources identifiées, citations relevées avec leur référence.', duree: '5 min' },
        { nom: 'Plan de l’exposé', hint: 'Annonce, développement en deux ou trois points, conclusion.', duree: '10 min' },
        { nom: 'Présentation orale', hint: '30 minutes en classe, questions comprises.', duree: '30 min' },
        { nom: 'Note de lecture écrite', hint: 'Fiche : référence, thèse, structure, appréciation critique.', duree: '10 min' }
      ],
      source: 'Draft EST — présentation d’un compte rendu, d’une note de lecture, note critique ; progression 2nde',
      confiance: 'officiel'
    },
    {
      id: 'ecritsPro', nom: 'Écrits professionnels', famille: 'cours', cycle: '2nd', icon: 'pen', tint: '#e7f1fb',
      tag: 'EST',
      desc: 'Lettre administrative, rapport, compte rendu professionnel.',
      sousTypes: ['Lettre administrative', 'Rapport', 'Compte rendu'],
      phases: [
        { nom: 'La situation de communication professionnelle', hint: 'Émetteur, destinataire, objet, enjeu.', duree: '10 min' },
        { nom: 'La forme normée', hint: 'Mentions obligatoires, disposition, formules d’appel et de politesse.', duree: '15 min' },
        { nom: 'La rédaction', hint: 'Respect de la forme /6 · Organisation des idées /6 · Maîtrise de la langue /6 · Présentation /2.', duree: '25 min' },
        { nom: 'Relecture normative', hint: 'Vérifier la forme avant le fond : c’est elle qui est notée en premier.', duree: '10 min' }
      ],
      source: 'Draft EST — BP Industriel', confiance: 'officiel'
    }
  ];

  /* ------------------------------------------------------------------
     3 bis. ARCHITECTURE D'UNE SÉQUENCE
     ------------------------------------------------------------------
     Le Draft EST organise la séquence du 2nd cycle en six temps. Le 1er
     cycle raisonne en modules, avec la même logique d'aboutissement :
     des ressources, puis une intégration, puis une évaluation.
     ------------------------------------------------------------------ */

  var SEQUENCE_TYPE = {
    '2nd': {
      nom: 'Séquence du second cycle',
      duree: '6 temps',
      temps: [
        { rang: 'I', nom: 'Ressources 1', contenu: 'Activités augurales de l’œuvre, leçon de langue, présentation de l’exercice méthodologique.' },
        { rang: 'II', nom: 'Ressources 2', contenu: 'Lecture méthodique, typologie textuelle, travail préparatoire.' },
        { rang: 'III', nom: 'Ressources 3', contenu: 'Leçon de langue, techniques de l’exercice, étape de rédaction.' },
        { rang: 'IV', nom: 'Activités d’intégration', contenu: 'Sur la base d’un texte ou d’un sujet, produire la tâche complète.' },
        { rang: 'V', nom: 'Évaluations', contenu: 'Langue française 2 h · Littérature 3 h.' },
        { rang: 'VI', nom: 'Exposés, comptes rendus et remédiation', contenu: 'Exposés (30 min chacun), compte rendu de l’évaluation (1 h), remédiation (1 h).' }
      ],
      competenceType: 'Étant donné [la nécessité de …], l’apprenant devra [agir compétent] en se servant des ressources de la séquence.',
      source: 'Draft EST — progressions 2nde C, séquences I à IV',
      confiance: 'officiel'
    },
    '1er': {
      nom: 'Module du premier cycle',
      duree: 'variable',
      temps: [
        { rang: 'I', nom: 'Ressources', contenu: 'Leçons de langue (grammaire, conjugaison, vocabulaire, orthographe), lecture méthodique, lecture suivie, expression orale.' },
        { rang: 'II', nom: 'Activité d’intégration', contenu: 'Situation-problème mobilisant les ressources du module.' },
        { rang: 'III', nom: 'Évaluation sommative', contenu: 'Correction orthographique · Étude de texte · Expression écrite.' },
        { rang: 'IV', nom: 'Remédiation', contenu: 'Compte rendu et reprise ciblée.' }
      ],
      competenceType: 'Face à [situation de vie], l’apprenant sera capable de [agir compétent] afin de [fonction sociale].',
      source: 'Programme officiel MINESEC 1er cycle',
      confiance: 'officiel'
    }
  };

  /* ------------------------------------------------------------------
     4. HORAIRES ET COEFFICIENTS
     ------------------------------------------------------------------ */

  var SOUS_CYCLES = [
    { nom: 'Sous-cycle d’observation', classes: ['6e', '5e'], heures: '6 h/semaine', coeff: '6',
      style: 'Guidé et progressif ; registre familier à courant ; productions courtes de 10 à 15 lignes.',
      source: 'Programme MINESEC 1er cycle', confiance: 'officiel' },
    { nom: 'Sous-cycle d’orientation', classes: ['4e', '3e'], heures: '4 h/semaine', coeff: '4',
      style: 'Plus autonome ; registre courant à soutenu ; productions de 20 à 30 lignes, semi-guidées à libres.',
      source: 'Programme MINESEC 1er cycle', confiance: 'officiel' },
    { nom: 'Second cycle — séries scientifiques et techniques', classes: ['2nde C', '1ère', 'Terminale'],
      heures: '3 h/semaine · 108 h/an', coeff: 'Littérature 2 · Langue 1',
      style: 'Deux enseignements distincts : littérature ou culture générale, et langue française.',
      source: 'Draft EST — en-tête du programme', confiance: 'officiel' }
  ];

  /* ------------------------------------------------------------------
     5. FORMULATIONS
     ------------------------------------------------------------------ */

  var FORMULATIONS = {
    objectifsBannis: [
      { motif: 'lire couramment', pourquoi: 'Ce n’est pas une compétence spécifique évaluable au sens du programme.' },
      { motif: 'formuler la leçon de morale', pourquoi: 'Banni des objectifs de lecture suivie.' },
      { motif: 'saisir le sens', pourquoi: 'Trop vague pour un objectif de lecture suivie.' },
      { motif: 'construire le sens', pourquoi: 'Banni des objectifs de lecture méthodique.' },
      { motif: 'montrer que le personnage est', pourquoi: 'Oriente la lecture au lieu de la faire construire.' }
    ],
    questionsBannies: [
      { motif: 'analyse logique', pourquoi: 'Bannie de l’épreuve d’étude de texte par le programme.' },
      { motif: 'analyse logiquement', pourquoi: 'Même interdiction : reformuler en manipulation.' },
      { motif: 'récite la règle', pourquoi: 'Question théorique interdite dans la partie maniement de la langue.' },
      { motif: 'qu’est-ce qu’un', pourquoi: 'Question théorique : la partie maniement évalue l’usage, pas la définition.' },
      { motif: 'que remarques-tu', pourquoi: 'Question vague : préférer un repérage guidé.' }
    ],
    plans: [
      { declencheurs: ['discutez', 'dans quelle mesure', 'partagez-vous'], plan: 'dialectique' },
      { declencheurs: ['commentez', 'expliquez', 'montrez'], plan: 'analytique' }
    ],
    formulesCorrige: {
      resume: 'Le candidat reçoit X pt(s) : s’il…',
      commentaire: 'On restera ouvert à toute autre interprétation pertinente du texte par le candidat.',
      dissertation: 'NB. Le candidat qui aura présenté d’autres arguments que ceux évoqués ici ne devra pas être pénalisé.',
      bepc: 'Tous les éléments pertinents non prévus dans ces grilles que le candidat aura ajoutés seront pris en compte.'
    },
    consignesGenerales: [
      'Toujours associer le corrigé et le texte original photocopié à l’épreuve proposée.',
      'Toujours préciser le domaine ou le problème posé dans la formulation d’un sujet de dissertation.'
    ]
  };

  /* ------------------------------------------------------------------
     7. QUESTIONNEMENT ET OBJECTIFS
     ------------------------------------------------------------------
     Les verbes ci-dessous ne sont pas une liste d'école : ils sont mesurés
     sur les 3 372 questions des 562 textes du corpus MINESEC. Les effectifs
     réels figurent dans `n` — ils disent ce que la norme emploie vraiment.

     Constat qui surprend et qu'il faut respecter : « Pourquoi… ? » et
     « Comment… ? » n'apparaissent JAMAIS dans ce corpus. La question
     officielle ne demande pas à l'élève de deviner une intention ; elle lui
     fait relever, puis justifier. C'est la raison pour laquelle on classe
     les verbes par NIVEAU : une épreuve qui ne contient que du relevé
     n'évalue pas, et une épreuve qui commence par l'interprétation
     n'accompagne pas.
     ------------------------------------------------------------------ */

  var QUESTIONNEMENT = {
    niveaux: [
      {
        id: 'reperage', nom: 'Repérage', couleur: '#1a72bb', rang: 1,
        role: 'L’élève retrouve dans le texte. Aucune inférence n’est demandée.',
        verbes: [
          { v: 'relève', n: 1124 }, { v: 'cite', n: 0 }, { v: 'identifie', n: 0 },
          { v: 'nomme', n: 0 }, { v: 'recopie', n: 0 }, { v: 'souligne', n: 0 },
          { v: 'classe', n: 55 }, { v: 'complète', n: 0 }
        ],
        tours: ['Quel / Quelle…', 'Qui…', 'De quoi ce texte parle-t-il ?', 'Relève … qui …'],
        exemple: 'Relève trois mots ou expressions qui situent le lieu de la scène.'
      },
      {
        id: 'analyse', nom: 'Analyse', couleur: '#7b52c7', rang: 2,
        role: 'L’élève met en rapport, transforme, compare. Il manipule la langue.',
        verbes: [
          { v: 'explique', n: 250 }, { v: 'justifie', n: 664 }, { v: 'étudie', n: 88 },
          { v: 'montre', n: 0 }, { v: 'compare', n: 0 }, { v: 'transforme', n: 0 },
          { v: 'remplace', n: 0 }, { v: 'réécris', n: 0 }, { v: 'distingue', n: 0 }
        ],
        tours: ['Justifie ta réponse.', 'Explique le sens de…', 'Transforme … en …'],
        exemple: 'Transforme la phrase soulignée en une phrase complexe, puis justifie ton choix.'
      },
      {
        id: 'interpretation', nom: 'Interprétation', couleur: '#c26a12', rang: 3,
        role: 'L’élève dit l’effet produit. C’est la question « b. » des épreuves de langue.',
        verbes: [
          { v: 'interprète', n: 0 }, { v: 'déduis', n: 0 }, { v: 'apprécie', n: 0 },
          { v: 'commente', n: 0 }, { v: 'discute', n: 0 }
        ],
        tours: ['Quel effet cet emploi produit-il ?', 'Que traduit cette insistance ?'],
        exemple: 'Quel effet la répétition de ce mot produit-elle sur le lecteur ?'
      },
      {
        id: 'production', nom: 'Production', couleur: '#1f9d55', rang: 4,
        role: 'L’élève écrit à son tour, dans une situation donnée.',
        verbes: [
          { v: 'rédige', n: 216 }, { v: 'décris', n: 133 }, { v: 'raconte', n: 102 },
          { v: 'prolonge', n: 88 }, { v: 'imagine', n: 0 }, { v: 'poursuis', n: 0 },
          { v: 'résume', n: 0 }, { v: 'compose', n: 0 }
        ],
        tours: ['Rédige un texte de … lignes dans lequel…', 'Prolonge le texte en…'],
        exemple: 'Prolonge ce texte en une dizaine de lignes en gardant le même narrateur.'
      }
    ],

    /* Ce qu'on ne demande pas — mesuré, pas supposé. */
    aEviter: [
      { motif: 'pourquoi', pourquoi: 'Absent des 3 372 questions du corpus officiel : la norme fait relever puis justifier, elle ne fait pas deviner une intention.' },
      { motif: 'comment', pourquoi: 'Absent lui aussi des questions du corpus officiel. Préférer une consigne de repérage suivie d’une justification.' },
      { motif: 'que remarques-tu', pourquoi: 'Question vague : l’élève ne sait pas ce qu’on attend de lui.' },
      { motif: 'qu’en penses-tu', pourquoi: 'Sans critère, la réponse n’est pas évaluable.' }
    ],

    /* Équilibre attendu dans une épreuve complète. */
    equilibre: {
      reperage: [30, 50], analyse: [25, 45], interpretation: [10, 25], production: [15, 35],
      note: 'Proportions indicatives, en pourcentage des points. Une épreuve faite uniquement de repérage ne classe pas les élèves ; une épreuve sans repérage décourage les plus faibles.'
    },

    /* ---- Formulation des objectifs ---- */
    objectif: {
      moule: 'Face à [situation de vie], l’apprenant sera capable de [agir compétent] afin de [fonction sociale].',
      moule2ndCycle: 'Étant donné [la nécessité de …], l’apprenant devra [agir compétent] en se servant des ressources de la séquence.',
      parties: [
        { cle: 'objAgir', nom: 'Agir compétent', aide: 'Un verbe d’action observable, à l’infinitif. C’est ce que l’élève FAIT.', exemple: 'identifier et employer les expansions du nom' },
        { cle: 'objContexte', nom: 'Contexte', aide: 'La situation de vie dans laquelle cet agir se déploie.', exemple: 'à partir d’un corpus décrivant son quartier' },
        { cle: 'objFonction', nom: 'Fonction sociale', aide: 'À quoi cela sert dans la vie réelle. C’est ce qui rend l’objectif APC.', exemple: 'afin de rendre une description plus précise' }
      ],
      verbes: [
        { v: 'identifier', niveau: 'reperage' }, { v: 'relever', niveau: 'reperage' },
        { v: 'distinguer', niveau: 'analyse' }, { v: 'analyser', niveau: 'analyse' },
        { v: 'employer', niveau: 'production' }, { v: 'produire', niveau: 'production' },
        { v: 'rédiger', niveau: 'production' }, { v: 'interpréter', niveau: 'interpretation' },
        { v: 'justifier', niveau: 'analyse' }, { v: 'transformer', niveau: 'analyse' }
      ],
      /* Repris de FORMULATIONS.objectifsBannis, rappelé ici pour l'aide en ligne. */
      interdits: ['lire couramment', 'construire le sens', 'saisir le sens',
                  'formuler la leçon de morale', 'montrer que le personnage est',
                  'connaître', 'comprendre', 'savoir']
    },

    /* ---- Travail collaboratif ---- */
    collaboration: [
      {
        id: 'relecture', nom: 'Relecture croisée', duree: '20 min',
        desc: 'Deux collègues échangent leurs sujets et les relisent avec la grille officielle.',
        etapes: ['Échanger les sujets', 'Relire avec la grille de la série', 'Noter trois écarts maximum', 'Restituer en deux minutes']
      },
      {
        id: 'harmonisation', nom: 'Harmonisation du barème', duree: '30 min',
        desc: 'Le département fixe une répartition commune des points avant la composition.',
        etapes: ['Poser la structure officielle', 'Répartir les points partie par partie', 'Éprouver sur deux copies fictives', 'Verrouiller le barème']
      },
      {
        id: 'banque', nom: 'Banque de textes du département', duree: 'continu',
        desc: 'Chacun verse dans la bibliothèque partagée les textes qu’il a éprouvés en classe.',
        etapes: ['Mettre le texte au panier', 'Renseigner niveau et module', 'Publier dans la bibliothèque', 'Signaler ce qui a fonctionné']
      },
      {
        id: 'correction', nom: 'Correction concertée', duree: '45 min',
        desc: 'On corrige les cinq premières copies ensemble pour caler la sévérité.',
        etapes: ['Corriger cinq copies chacun', 'Comparer les notes', 'Écrire la règle qui explique l’écart', 'Reprendre le reste seul']
      }
    ]
  };

  /* ------------------------------------------------------------------
     5 bis. ŒUVRES INTÉGRALES AU PROGRAMME, par classe
     ------------------------------------------------------------------
     Relevé du 16/10/2026 : programme 2nde du département (« Œuvres
     intégrales »), bibliothèque d'œuvres fournie par Jacques (Desktop/Adit
     manuels), couvertures des cahiers d'œuvre et des cahiers 6e-3e du site.
     Le genre n'est écrit que s'il a été vérifié dans l'œuvre elle-même.
     Une œuvre du 1er cycle ne sert JAMAIS au 2nd cycle (règle du 04/10). */
  var OEUVRES = {
    '6e': [
      { titre: 'Les Contes de Korotoumou', auteur: 'Amadou Koné', genre: 'contes (veillée malinké)' },
      { titre: 'Les Bimanes', auteur: 'Séverin Cécile Abega' },
      { titre: 'Les Chants de la forêt', auteur: 'Lucien Anya Noa', genre: 'contes et chantefables béti' }
    ],
    '5e': [
      { titre: 'N’kum-Wam, le 8e notable', auteur: 'David Massoma Pandong' },
      { titre: 'L’Arbre fétiche', auteur: 'Jean Pliya', genre: 'nouvelles' },
      { titre: 'Père inconnu', auteur: 'Pabé Mongo', genre: 'récit' }
    ],
    '4e': [
      { titre: 'Cœur du Sahel', auteur: 'Djaïli Amadou Amal', genre: 'roman' },
      { titre: 'Trois prétendants… un mari', auteur: 'Guillaume Oyônô Mbia', genre: 'comédie' },
      { titre: 'L’Attachement au sol natal', auteur: 'Ernest Alima', genre: 'poésie' }
    ],
    '3e': [
      { titre: 'Ville cruelle', auteur: 'Eza Boto', genre: 'roman' },
      { titre: 'La Marmite de Koka-Mbala', auteur: 'Guy Menga', genre: 'théâtre' },
      { titre: 'Petites gouttes de chant pour créer l’homme', auteur: 'René Philombe', genre: 'poésie' }
    ],
    '2nde': [
      { titre: 'Les Tribus de Capitoline', auteur: 'P.-C. Ombété Bella', genre: 'roman' },
      { titre: 'Poèmes sauvages éclairés au feu de brousse', auteur: 'Henri N’koumo', genre: 'poésie' },
      { titre: 'Tartuffe ou l’Imposteur', auteur: 'Molière', genre: 'comédie' }
    ],
    '1ere': [
      { titre: 'Balafon', auteur: 'Engelbert Mveng', genre: 'poésie' },
      { titre: 'Le Lion et la Perle', auteur: 'Wole Soyinka', genre: 'théâtre' },
      { titre: 'Au cœur des ténèbres', auteur: 'Joseph Conrad', genre: 'récit' }
    ],
    tle: [
      { titre: 'Ngum a Jemea', auteur: 'David Mbanga Eyombwan', genre: 'théâtre' },
      { titre: 'Stances et Poèmes', auteur: 'Sully Prudhomme', genre: 'poésie' },
      { titre: 'Le Vieux Nègre et la Médaille', auteur: 'Ferdinand Oyono', genre: 'roman' }
    ]
  };

  /* « 2nde A », « Tle C », « 1ère », « 4e » → clé d'OEUVRES. */
  function cleClasse(c) {
    var s = String(c || '').toLowerCase();
    if (s.normalize) s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (/terminale|\btle\b/.test(s)) return 'tle';
    if (/1ere|premiere|\b1re\b/.test(s)) return '1ere';
    if (/2nde|seconde|\b2de\b/.test(s)) return '2nde';
    var m = s.match(/\b([3-6])(?:e|eme)\b/);
    return m ? m[1] + 'e' : '';
  }

  /* ------------------------------------------------------------------
     6. ACCÈS
     ------------------------------------------------------------------ */

  var API = {
    version: '2.0.0',
    sourcePrincipale: 'Draft EST (MINESEC) — programmes et descriptif des épreuves',
    grilles: GRILLES,
    epreuves: EPREUVES,
    gabarits: GABARITS,
    sousCycles: SOUS_CYCLES,
    sequenceType: SEQUENCE_TYPE,
    formulations: FORMULATIONS,
    questionnement: QUESTIONNEMENT,
    oeuvres: OEUVRES,
    cleClasse: cleClasse,
    /* PHASES D'UNE LEÇON ENREGISTRÉE. Le contenu des phases est rangé par
       POSITION (phaseContent[0], [1]…). Le 16/10/2026, deux gabarits ont
       changé de déroulé pour suivre la fiche « Vérification 1er cycle » :
       - lecture suivie : Fiche d'identité, Lecture, Compréhension globale,
         Bilan  →  Situation, Lecture, Grille, Confrontation, Bilan ;
       - expression écrite : Découverte, Préparation, Production, Amélioration
         →  Situation-problème, Analyse et production, Confrontation, Règle,
         Application.
       Sans correspondance, le « Bilan » d'une leçon déjà écrite se serait
       affiché sous « Confrontation ». Une leçon marquée `phasesRev` est déjà
       au nouveau déroulé ; on n'y touche plus.
       Rév. « 2026-10-16b » : la leçon de langue du 2nd cycle suit à son tour
       le guide du 2nd cycle (voir plus bas). */
    PHASES_REV: '2026-10-16b',
    phasesDuCours: function (cours) {
      var pc = (cours && cours.phaseContent) || {};
      if (!cours || cours.phasesRev === '2026-10-16b') return pc;
      var o = {}, k;
      for (k in pc) if (Object.prototype.hasOwnProperty.call(pc, k)) o[k] = pc[k];
      var joindre = function (a, b) { return [a, b].filter(function (x) { return x && String(x).trim(); }).join('\n\n'); };
      var avant1 = cours.phasesRev !== '2026-10-16';   // pas encore passé au déroulé du 16/10 (1er cycle)
      /* Leçon de langue du 2nd cycle (16/10, guide) : Observation, Repérage,
         Analyse, Interprétation, Réemploi → Observation, Analyse (repérage +
         manipulations, formes ET valeurs), Vérification, Règle, Consolidation. */
      if (cours.gabarit === 'langue2' && (o[2] != null || o[3] != null)) {
        o[1] = joindre(joindre(o[1], o[2]), o[3]); delete o[2]; delete o[3];
        return o;
      }
      if (!avant1) return o;
      if (cours.gabarit === 'suivie' && o[3] != null && o[4] == null) {
        o[4] = o[3]; delete o[3];
      } else if (cours.gabarit === 'ee' && (o[2] != null || o[3] != null) && o[4] == null) {
        o[1] = joindre(o[1], o[2]); o[2] = o[3]; delete o[3];
        if (o[2] == null) delete o[2];
      }
      return o;
    },
    oeuvresDe: function (classe) { return OEUVRES[cleClasse(classe)] || []; },
    /* Longueur du texte support POUR CETTE CLASSE : la 2nde contracte un
       texte de 400 à 500 mots, la 1ère et la Terminale un texte plus long. */
    /* Parties DE LA CLASSE : la 2nde note la contraction 8 + 10 + 2 et
       arrête le commentaire au plan détaillé (guide du 2nd cycle). */
    partiesPour: function (ep, classe) {
      if (!ep) return [];
      var par = ep.partiesParClasse && ep.partiesParClasse[cleClasse(classe)];
      return par || ep.parties || [];
    },
    texteSupportPour: function (ep, classe) {
      if (!ep) return null;
      var par = ep.texteSupportParClasse && ep.texteSupportParClasse[cleClasse(classe)];
      return par || ep.texteSupport || null;
    },

    epreuveParCode: function (code) {
      for (var i = 0; i < EPREUVES.length; i++) if (EPREUVES[i].code === code) return EPREUVES[i];
      return null;
    },
    /* Toutes les épreuves d'une série. Une série d'ESG en renvoie DEUX
       (littérature + langue) : c'est l'oubli le plus fréquent. */
    epreuvesParSerie: function (serie) {
      if (!serie) return [];
      var s = String(serie).toUpperCase();
      return EPREUVES.filter(function (e) {
        return e.series && e.series.some(function (x) { return String(x).toUpperCase() === s; });
      });
    },
    epreuvesParClasse: function (classe) {
      if (!classe) return [];
      var c = String(classe).toLowerCase();
      return EPREUVES.filter(function (e) {
        return (e.classes || []).some(function (x) { return String(x).toLowerCase() === c; });
      });
    },
    epreuvesParExamen: function (examen) {
      if (!examen) return [];
      var x = String(examen).toLowerCase();
      return EPREUVES.filter(function (e) { return String(e.examen).toLowerCase().indexOf(x) >= 0; });
    },
    /* Toutes les séries connues, pour peupler un menu. */
    series: function () {
      var vus = {}, out = [];
      EPREUVES.forEach(function (e) {
        (e.series || []).forEach(function (s) { if (!vus[s]) { vus[s] = 1; out.push(s); } });
      });
      return out;
    },
    gabaritsParCycle: function (cycle) {
      if (!cycle) return GABARITS;
      return GABARITS.filter(function (g) { return g.cycle === cycle || g.cycle === 'tous'; });
    },
    /* LA NORME D'UN TYPE DE LEÇON, telle qu'Ambassa doit la lire (16/10/2026).
       L'audit d'une leçon et la proposition d'objectif n'envoyaient que les
       NOMS des phases : ni leur contenu attendu, ni le corpus exigé, ni la
       règle de l'exercice, ni les interdits. Une seule source pour les deux. */
    normeDuGabarit: function (id, classe) {
      var g = typeof id === 'string' ? this.gabaritParId(id) : id;
      if (!g) return [];
      var l = [];
      l.push('Type de leçon : ' + g.nom + (g.cycle && g.cycle !== 'tous' ? ' (' + g.cycle + ' cycle)' : '') + (g.demarche ? ' — démarche ' + g.demarche : '') + '.');
      l.push('Déroulé officiel :');
      g.phases.forEach(function (p, i) { l.push('  ' + (i + 1) + '. ' + p.nom + ' (' + p.duree + ') — ' + p.hint); });
      var cle = cleClasse(classe);
      var ts = (g.texteSupportParClasse && g.texteSupportParClasse[cle]) || g.texteSupport;
      var sansPoint = function (x) { return String(x || '').replace(/[.\s]+$/, ''); };
      if (ts) l.push('Texte support : ' + ts.min + ' à ' + ts.max + ' mots' + (ts.nature ? ', ' + sansPoint(ts.nature) : '') + (ts.note ? ' — ' + sansPoint(ts.note) : '') + '.');
      if (g.typesTexte) l.push('Type de texte exigé : ' + g.typesTexte.map(function (t) { return t.toLowerCase(); }).join(' ou ') + '.');
      (g.exigencesCorpus || []).forEach(function (x) { l.push('Corpus : ' + x); });
      if (g.regleCle) l.push('Règle de l’exercice : ' + g.regleCle);
      (g.interdits || []).forEach(function (x) { l.push('Interdit : ' + x); });
      if (g.objectifsInterdits && g.objectifsInterdits.length) l.push('Objectifs bannis pour ce type de leçon : ' + g.objectifsInterdits.map(function (x) { return '« ' + x + ' »'; }).join(', ') + '.');
      if (g.seriesReservees) l.push('Réservé aux séries : ' + g.seriesReservees.join(', ') + '.');
      if (g.note) l.push('À savoir : ' + g.note);
      var oe = OEUVRES[cle];
      if (oe && oe.length && g.cycle !== '1er' && /oeuvre|œuvre|commentaire|lecture|augurales|contexte|ensemble|dissertation|gt/.test(g.id + ' ' + g.nom.toLowerCase()))
        l.push('Œuvres au programme de la classe : ' + oe.map(function (o) { return '« ' + o.titre + ' » (' + o.auteur + ')'; }).join(', ') + '.');
      if (g.source) l.push('Source : ' + sansPoint(g.source) + '.');
      return l;
    },
    gabaritParId: function (id) {
      for (var i = 0; i < GABARITS.length; i++) if (GABARITS[i].id === id) return GABARITS[i];
      return null;
    },
    grille: function (id) { return GRILLES[id] || null; },
    /* Niveau cognitif d'une question, d'apres son verbe de consigne. Renvoie
       null quand aucun verbe connu n'est trouve : on ne devine pas. */
    niveauQuestion: function (texte) {
      var t = String(texte || '').toLowerCase()
        .normalize ? String(texte || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                   : String(texte || '').toLowerCase();
      /* Les tours interrogatifs d'abord : « Quel effet … ? » releve de
         l'interpretation meme s'il ne porte aucun verbe de consigne. */
      var motsCles = { interpretation: ['quel effet', 'que traduit', 'que revele', 'que montre'],
                       reperage: ['de quoi', 'qui est', 'quel est', 'quelle est'] };
      for (var nk in motsCles) {
        for (var mi = 0; mi < motsCles[nk].length; mi++) {
          if (t.indexOf(motsCles[nk][mi]) >= 0) {
            for (var z = 0; z < QUESTIONNEMENT.niveaux.length; z++)
              if (QUESTIONNEMENT.niveaux[z].id === nk) return QUESTIONNEMENT.niveaux[z];
          }
        }
      }
      for (var i = 0; i < QUESTIONNEMENT.niveaux.length; i++) {
        var nv = QUESTIONNEMENT.niveaux[i];
        for (var j = 0; j < nv.verbes.length; j++) {
          var v = nv.verbes[j].v.normalize ? nv.verbes[j].v.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : nv.verbes[j].v;
          if (new RegExp('(^|[^a-z])' + v.slice(0, -1) + '[a-z]{0,3}([^a-z]|$)').test(t)) return nv;
        }
      }
      return null;
    },
    /* Total attendu : 20 quand les sujets sont AU CHOIX (chacun vaut 20),
       sinon la somme des parties. */
    totalAttendu: function (ep) {
      if (!ep) return 20;
      if (ep.sujetsAuChoix > 1) return 20;
      var s = (ep.parties || []).reduce(function (a, p) { return a + (p.points || 0); }, 0);
      return s || 20;
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.MINESEC = API;

})(typeof window !== 'undefined' ? window : this);
