# -*- coding: utf-8 -*-
"""
Paratexte du cahier « Poèmes sauvages éclairés au feu de brousse » — Seconde.

Même consigne de rédaction que pour le cahier Tartuffe : langue très simple,
phrases courtes, beaucoup de lexique, chaque mot difficile expliqué là où il
apparaît puis repris dans le lexique général de la fin.

Les faits biographiques, bibliographiques et historiques de ce paratexte sont
tous relevés dans le dossier pédagogique que l'auteur a joint au volume — la
section « Étude de l'œuvre » et l'entretien final avec Koffi Koffi. Rien n'y a
été ajouté de mémoire.
"""

INFOS = dict(
    titre="Poèmes sauvages éclairés au feu de brousse",
    sous_titre="poème au long cours",
    auteur="Henri N'koumo",
    edition="Abidjan, Les Classiques Ivoiriens, 2022",
    niveau="Seconde",
    genre="poésie",

    # Un recueil n'a ni personnages ni schéma dramatique : il a des figures,
    # des lieux et des mouvements. Les rubriques changent de nom, pas de place.
    libelles={
        "personnages_titre": "4. Les figures et les voix du poème",
        "personnages_entetes": ("Figure", "Ce qu'elle est dans le poème"),
        "etude_personnages_titre": "5 bis. Étude des figures",
        "etude_personnages_entetes": ("Figure", "Ce que l'étude doit établir"),
        "lieux_titre": "5 ter. Étude des lieux",
        "lieux_entetes": ("Lieu", "Ce qu'il apporte au poème"),
        "schema_titre": "5 quater. Mouvement du poème",
        "schema_entetes": ("Temps", "Contenu"),
    },

    avertissements=[
        "**Le poème n'a ni majuscules ni ponctuation, et ce n'est pas une faute.** Le "
        "premier mot du texte s'écrit « il », avec une minuscule, et il en va de même "
        "jusqu'au dernier vers. On ne compte, dans tout le livre, que cinq points "
        "d'interrogation et deux emplois des deux-points. Dites-le à la classe avant la "
        "première lecture, sinon les élèves croiront à une erreur d'impression.",
        "**Le sujet est violent.** Le poème est né d'un attentat qui a tué dix-neuf "
        "personnes sur une plage. Il parle de corps, de sang, de cercueils. Préparez la "
        "séance, et prévoyez que certains élèves aient été touchés de près ou de loin par "
        "des violences semblables.",
        "**L'œuvre est récente et protégée.** Les extraits reproduits dans ce cahier le "
        "sont à des fins strictement pédagogiques, dans les limites du droit de courte "
        "citation. Il faut le livre en classe : ce cahier ne le remplace pas.",
        "**Vérifiez le cadrage officiel.** Contrôlez que cette œuvre figure bien au cadrage "
        "de votre établissement pour l'année en cours : les listes changent.",
    ],

    note_enseignants=[
        "Ce cahier applique au poème d'Henri N'koumo la démarche demandée par le Programme "
        "de français du second cycle : activités augurales, lecture hors classe, contrôle "
        "de lecture, négociation du projet d'étude, étude collective, exposés, évaluation.",
        "L'auteur a joint à son livre un dossier pédagogique où il propose lui-même deux "
        "types d'activités : deux ou trois exposés, et sept études de texte, avec une "
        "séance d'introduction et une de conclusion — douze séances d'une heure. Ce cahier "
        "suit ce découpage. Six des sept extraits qu'il indique deviennent les six lectures "
        "méthodiques ; le septième, « Comme introduction », est étudié dans l'analyse du "
        "paratexte, car il précède le poème et ne fait qu'une centaine de mots.",
        "Deux difficultés reviennent chaque année. La première est la forme : les élèves "
        "cherchent des rimes et des strophes régulières, et n'en trouvent pas. La seconde "
        "est l'image : la poésie de N'koumo est surréaliste, c'est-à-dire qu'elle rapproche "
        "des mots que l'usage sépare. « des allumettes de minuit », « la barbe de mon "
        "poème » ne se comprennent pas au premier degré. Il faut apprendre à la classe à "
        "chercher non pas ce que l'image veut dire, mais ce qu'elle fait voir.",
    ],

    citation_guide=(
        "« L'étude collective de l'œuvre en classe à travers les lectures méthodiques ou "
        "d'autres formes de lectures (lecture suivie, lecture analytique, etc.) ou l'étude "
        "de divers aspects de l'œuvre (l'énonciation, les forces agissantes, les aspects "
        "marquants de l'écriture, les thèmes majeurs, etc.). »",
        "MINESEC, Guide pédagogique 2019, § III.2"),

    notions=[
        ["Poème au long cours",
         "Un seul poème qui remplit tout un livre, au lieu d'un recueil de poèmes courts.",
         "Le texte occupe les 92 pages du volume, d'un seul tenant."],
        ["Vers libre",
         "Vers qui n'a ni nombre de syllabes fixe ni rime obligée.",
         "Toute l'œuvre. Certains vers font trois mots, d'autres cinq lignes."],
        ["Verset",
         "Vers très long, qui tient sur plusieurs lignes et se lit d'un seul souffle.",
         "« et mon jour meurt mille fois dans l'immensité de ma voix… »"],
        ["Strophe",
         "Groupe de vers séparé des autres par un blanc.",
         "Les blancs du livre sont les seules coupures : il n'y a ni titre ni numéro."],
        ["Anaphore",
         "Répétition d'un même mot au début de plusieurs vers ou phrases.",
         "Le mot « et » ouvre des centaines de vers."],
        ["Énumération",
         "Liste de mots ou de groupes de mots mis à la suite.",
         "« Maïduguri Palmyre Paris Niamey Grand-Bassam… »"],
        ["Apostrophe",
         "On s'adresse directement à quelqu'un ou à quelque chose, souvent avec « ô ».",
         "« ô orage percé de toutes parts », « Henrike »."],
        ["Surréalisme",
         "Manière d'écrire qui rapproche des mots que l'usage sépare, pour surprendre.",
         "« des allumettes de minuit », « la barbe de mon poème »."],
        ["Métaphore",
         "On dit qu'une chose est une autre, sans employer « comme ».",
         "« ma parole est nid d'oiseaux »."],
        ["Comparaison",
         "On rapproche deux choses avec un mot de comparaison : comme, tel, pareil à.",
         "« comme la bête saignée dans la gourmandise des primates »."],
        ["Personnification",
         "On prête à une chose des gestes ou des sentiments d'être vivant.",
         "« et mon jour meurt », « le temps ne tourne plus »."],
        ["Hyperbole",
         "On exagère pour frapper.",
         "« mille fois », « des millions d'oiseaux en pleurs »."],
        ["Oxymore",
         "Deux mots de sens contraire mis côte à côte.",
         "« il fait si froid dans le soleil »."],
        ["Champ lexical",
         "Ensemble des mots d'un texte qui parlent du même sujet.",
         "Le feu : brousse, flammes, incendiaire, contre-feu, brûlures."],
        ["Tonalité lyrique",
         "Le poète dit ses sentiments, sa peine, son amour.",
         "« et mes yeux à moi s'éteignent au profond de ma peine »."],
        ["Tonalité pathétique",
         "Le texte cherche à émouvoir, à faire pitié.",
         "Le corps d'Henrike « entre quatre bois »."],
        ["Énonciation",
         "Qui parle, à qui, où et quand.",
         "Un « je » qui parle à Henrike, et un « nous » qui parle au monde."],
        ["Onomastique",
         "Étude des noms propres d'un texte.",
         "Le poème en compte plus de vingt : personnes et villes."],
        ["Litanie",
         "Suite de formules répétées, comme une prière.",
         "« et nous serons… et nous serons… et nous serons… »"],
        ["Ode",
         "Poème qui chante et célèbre quelque chose.",
         "L'auteur appelle son texte « une ode à la liberté »."],
    ],

    biographie=[
        "Henri N'koumo, de son nom d'état civil N'Koumo Koffissé Henri Jonas, est né en "
        "1965 à Bingerville, en Côte d'Ivoire. Il fait ses études primaires et secondaires "
        "à Abidjan, où il se familiarise très tôt avec le livre et la lecture, puis des "
        "études de Lettres modernes et d'histoire de l'art à l'université — aujourd'hui "
        "Université Félix Houphouët-Boigny de Cocody.",
        "Il a quinze ans en 1980, au moment où Abidjan est une plaque tournante de la "
        "culture en Afrique. Le Centre culturel français, ouvert en 1972, y offre une "
        "bibliothèque, une salle de spectacle et un théâtre de verdure. C'est dans ce "
        "bouillonnement que se construit sa vocation.",
        "Après ses études, il enseigne les lettres modernes : une année scolaire à Séguéla, "
        "dans le nord du pays, puis à Dabou, dans la banlieue d'Abidjan. Il mène en même "
        "temps une vie de critique d'art, dont la tribune sera le journal Fraternité Matin.",
        "Il occupe aujourd'hui la fonction de Directeur des Arts Plastiques et visuels au "
        "ministère ivoirien de la Culture et de la Francophonie, après avoir été pendant "
        "plus de huit ans Directeur du Livre et des Arts plastiques et visuels. Il est "
        "lauréat du Prix Jean-Marie Adiaffi de la littérature ivoirienne 2025.",
        "**Son œuvre.** Sept textes, dans trois genres. « M'amante », nouvelle, 1990 — Prix "
        "international de nouvelles d'Africa N° 1. *Zakwato suivi de Morsure d'Eburnie*, "
        "poème à deux mains écrit avec son ami Azo Vaughy, 2009. « Paroles pour Haïti », "
        "2010, écrit après le tremblement de terre du 12 janvier. « La Boue à grande "
        "coulée », nouvelle, 2014. « Au vieux guetteur », 2019, hommage à Bernard Binlin "
        "Dadié. *Poèmes sauvages éclairés au feu de brousse*, 2022. *La Promesse entêtée de "
        "l'ombre*, pièce de théâtre, 2024, écrite en souvenir d'Azo Vaughy.",
    ],

    contexte=[
        "Le 13 mars 2016, la Côte d'Ivoire connaît le premier attentat terroriste de son "
        "histoire. La plage de Grand-Bassam, ville balnéaire proche d'Abidjan, en est le "
        "théâtre : dix-neuf personnes sont tuées et trente-trois blessées. L'attentat est "
        "revendiqué par Al-Qaïda au Maghreb Islamique.",
        "Parmi les morts figure Henrike Grohs, directrice du Goethe Institut de Côte "
        "d'Ivoire, le centre culturel allemand. C'est une actrice culturelle familière "
        "d'Henri N'koumo ; les deux partagent presque le même prénom, Henri et Henrike. Le "
        "livre lui est dédié.",
        "Cet attentat n'est pas isolé. Le terrorisme djihadiste ravage le Mali depuis "
        "janvier 2012, puis s'étend au Burkina Faso et au Niger ; les pays du golfe de "
        "Guinée, comme le Togo et le Bénin, y font face à leur tour. Le poème nomme "
        "d'ailleurs, en un seul vers, des villes de trois continents.",
        "**Pourquoi cela concerne un élève camerounais.** Le poème cite Maroua et "
        "Maïduguri. La première est au Cameroun, la seconde au Nigeria voisin : ce sont "
        "des villes de l'Extrême-Nord frappées par les mêmes violences. Le texte n'est donc "
        "pas le récit d'un malheur étranger.",
    ],

    structure=[
        ["« Comme introduction » (p. 7)",
         "Un court texte placé avant le poème, entre guillemets. L'auteur l'appelle un "
         "exorde : il annonce, en quelques lignes, la douleur et l'appel au réveil."],
        ["Épigraphes et dédicaces",
         "Une dédicace au professeur Séry Bailly, une autre à Henrike Grohs, et une "
         "citation de Samuel Beckett tirée d'En attendant Godot."],
        ["Premier temps (environ p. 9 à p. 35)",
         "Le constat de l'horreur. La mort d'Henrike, l'attentat de Grand-Bassam, "
         "l'enterrement, la révolte du poète."],
        ["Deuxième temps (environ p. 36 à p. 62)",
         "L'élargissement. La révolte s'étend à toutes les violences commises au nom de la "
         "religion, sur tous les continents."],
        ["Troisième temps (environ p. 63 à p. 92)",
         "Le dépassement. La douleur devient chant d'espérance, de paix et de fraternité ; "
         "Henrike « ressuscite » dans le poème."],
        ["**Attention**",
         "Ces bornes sont indicatives. Le poème ne comporte ni partie, ni chapitre, ni "
         "titre : c'est une lecture qui les distingue, pas une table des matières."],
    ],

    personnages=[
        ["Le « je »", "Le poète lui-même. Il dit sa peine, sa colère, puis son espérance."],
        ["Le « nous »", "Les vivants, les endeuillés, l'humanité entière. Le poème passe "
                        "sans cesse du « je » au « nous »."],
        ["Henrike Grohs", "L'amie tuée à Grand-Bassam le 13 mars 2016. Son prénom revient "
                          "plus de vingt fois, seul, sur une ligne."],
        ["Oussama", "Oussama ben Laden. Il ne désigne pas seulement un homme : dans le "
                    "poème, son nom devient celui du fanatisme."],
        ["Les kamikazes", "Ceux qui se font exploser. Le poème les appelle aussi « les fous "
                          "de dieu » et « les assassins des livres millénaires »."],
        ["Les mères de Chibok", "Les mères des lycéennes enlevées au Nigeria. Le poème "
                                "reprend leur cri : « bring back our girls »."],
        ["La foule", "Ceux qui viennent à l'enterrement, « réchauffer ta paume au feu de "
                     "ses pleurs »."],
        ["Le père Hamel", "Le prêtre égorgé dans son église, en France. Le poème le nomme "
                          "sans le commenter."],
        ["Les oiseaux", "Ils traversent tout le livre. Tantôt fusillés, tantôt "
                        "ressuscités : ils mesurent l'espérance du poème."],
        ["Séry Bailly", "Professeur ivoirien, dédicataire du livre."],
        ["Samuel Beckett", "Auteur de l'épigraphe : « Nous naissons tous fous. Quelques-uns "
                           "le demeurent »."],
        ["Le camion-bélier et la kalach", "Deux objets si présents qu'ils agissent comme des "
                                          "personnages : ils frappent, ils fauchent, ils "
                                          "hurlent."],
    ],

    paratexte=[
        ("1. Le titre", [
            "Le titre comporte quatre éléments : **Poèmes**, **sauvages**, **éclairés**, "
            "**au feu de brousse**. Chacun se discute.",
            "**Le pluriel.** Le livre ne contient qu'un seul poème, d'un seul tenant. "
            "Pourquoi « Poèmes » ? Parce que chaque page peut se lire seule, comme un poème "
            "autonome. Le texte est donc à la fois unique et pluriel — l'auteur emploie "
            "l'image d'un collier de perles.",
            "**« sauvages ».** L'adjectif dit la violence du monde que le poème reçoit, et "
            "la violence de la parole qui répond. L'auteur parle d'une « force barbare » : "
            "ces poèmes « gueulent, ils hèlent, en écho aux hurlements des bombes ».",
            "**« éclairés au feu de brousse ».** Le feu de brousse détruit et fait repousser. "
            "C'est un feu africain, et c'est aussi la seule lumière dont on dispose la nuit. "
            "Le titre annonce donc les deux mouvements du livre : brûler et éclairer.",
            "**Une remarque de méthode.** Un titre ne se commande pas. Interrogé sur ce "
            "choix, l'auteur répond qu'un bon titre « s'arrache lui-même de dessous le "
            "texte », qu'il naît des ressorts thématiques et stylistiques de l'œuvre. À "
            "faire discuter en classe : un titre est-il un résumé, une promesse, ou une "
            "énigme ?",
        ]),
        ("2. Les dédicaces", [
            "Le livre porte deux dédicaces. La première est adressée au professeur Séry "
            "Bailly. La seconde nomme Henrike Grohs et la date du 13 mars 2016.",
            "Une dédicace n'est pas une décoration : elle dit à qui le livre est donné, et "
            "donc pourquoi il a été écrit. Ici, elle transforme un recueil en tombeau — au "
            "sens que la poésie donne à ce mot depuis des siècles : un poème écrit pour un "
            "mort.",
        ]),
        ("3. L'épigraphe de Beckett", [
            "Avant le poème, deux lignes de Samuel Beckett, tirées d'En attendant Godot : "
            "« Nous naissons tous fous. Quelques-uns le demeurent. »",
            "Une épigraphe est une citation placée en tête d'un texte. Elle donne un angle "
            "de lecture. Celle-ci pose une distinction que tout le livre va reprendre : la "
            "folie n'est pas le partage de quelques-uns, elle est la condition commune ; "
            "seuls certains y demeurent. Le poème nommera ces derniers.",
            "**Activité.** Demandez aux élèves ce que la phrase change à l'idée qu'ils se "
            "font des auteurs d'attentats. Fait-elle d'eux des monstres, ou des hommes ?",
        ]),
        ("4. « Comme introduction »", [
            "Page 7, avant le poème, un court texte d'une centaine de mots, placé entre "
            "guillemets et intitulé « Comme introduction ». L'auteur l'appelle un exorde, "
            "c'est-à-dire le début d'un discours.",
            "Il tient en deux mouvements, et le livre entier tient dans ces deux "
            "mouvements. D'abord le constat : « et nous buvons à la force imbécile des "
            "bombes et des camions-bélier et des kalach sauvages ». Ensuite l'appel : "
            "« acquittons-nous de nos sanglots dans la ferveur des forges et dressons nos "
            "muscles au mât des rêves pour exiger le réveil de nos voix ».",
            "**Trois choses à faire relever aux élèves.** (1) Le mot « et » ouvre presque "
            "chaque ligne. (2) Aucune phrase ne commence par une majuscule. (3) Le passage "
            "du constat (« nous buvons », « nous flottons ») à l'ordre (« acquittons-nous », "
            "« dressons ») : le poème ne s'arrête pas à la plainte.",
        ]),
    ],

    augurales=[
        "**Avant d'ouvrir le livre — un quart d'heure.** Écrivez le titre au tableau, sans "
        "le nom de l'auteur. Demandez à la classe ce qu'elle attend d'un livre qui "
        "s'appelle ainsi. Notez trois hypothèses au tableau ; on y reviendra à la dernière "
        "séance.",
        "**Le feu de brousse.** Demandez qui, dans la classe, a déjà vu un feu de brousse. "
        "Faites dire ce qu'il détruit, et ce qui repousse ensuite. Cette double valeur — "
        "détruire et faire renaître — est la clé du titre.",
        "**Une date, une carte.** Écrivez au tableau : 13 mars 2016, Grand-Bassam, Côte "
        "d'Ivoire. Situez la ville sur une carte, puis Maroua et Maïduguri. Demandez à la "
        "classe ce qui relie ces trois points. Ne donnez pas la réponse : le poème la "
        "donnera.",
        "**Engagement de lecture.** Chaque élève écrit, en trois lignes, ce qu'il attend de "
        "cette lecture et ce qu'il craint. Les feuilles sont ramassées, non notées, et "
        "rendues à la dernière séance. C'est le meilleur moyen de mesurer, avec la classe, "
        "ce que le livre a changé.",
    ],

    controles=[
        ("Contrôle n° 1 — 15 minutes (après une première lecture des pages 7 à 35)", [
            "À qui le livre est-il dédié ? Que sait-on de cette personne ?",
            "Quel événement le poème prend-il pour point de départ ? Donnez la date et le "
            "lieu.",
            "Relevez trois mots qui reviennent souvent dans les premières pages.",
            "Le poème est-il écrit en vers réguliers ? Justifiez votre réponse en une "
            "phrase.",
        ]),
        ("Contrôle n° 2 — 15 minutes (après les pages 36 à 62)", [
            "Citez cinq villes nommées dans le poème, sur au moins deux continents.",
            "Qui est Oussama ? Que représente ce nom dans le texte ?",
            "Quel cri de mères le poème reprend-il, et à quel enlèvement se rapporte-t-il ?",
            "Relevez une image que vous n'avez pas comprise au premier abord, et proposez "
            "une explication.",
        ]),
        ("Contrôle n° 3 — 15 minutes (après les pages 63 à 92)", [
            "Le poème se termine-t-il sur la douleur ou sur l'espérance ? Citez le texte.",
            "Que devient Henrike à la fin du poème ?",
            "Relevez deux vers qui commencent par « et nous serons ». Que promettent-ils ?",
            "En une phrase : pourquoi ce livre s'appelle-t-il « éclairés au feu de "
            "brousse » ?",
        ]),
    ],

    negociation=[
        "La négociation du projet d'étude se fait juste après le contrôle n° 1, quand la "
        "classe a lu les trente premières pages et qu'elle a rencontré la difficulté sans "
        "l'avoir encore surmontée.",
        "**Ce qui est négociable.** L'ordre des six lectures méthodiques ; le choix des "
        "sujets d'exposé ; la forme de la restitution finale (devoir écrit, lecture à voix "
        "haute, affiche).",
        "**Ce qui ne l'est pas.** Le nombre de séances, la lecture intégrale de l'œuvre, et "
        "les deux devoirs notés.",
        "**Trois questions à poser à la classe.** (1) Qu'est-ce qui vous a le plus gêné dans "
        "ces trente pages ? (2) Qu'est-ce que vous voudriez comprendre avant la fin du "
        "trimestre ? (3) Que faudrait-il pour qu'un texte pareil vous parle ?",
        "Notez les réponses au tableau et gardez-les. La dernière séance consistera à "
        "vérifier, point par point, ce qui a été tenu.",
        "**Un projet qui fonctionne bien avec ce texte.** Une lecture à voix haute "
        "collective, préparée : chaque élève prend quatre à cinq vers, et la classe lit le "
        "poème d'un bout à l'autre. La forme du livre — un seul souffle — devient alors "
        "audible, ce qu'aucune explication n'obtient.",
        "**Un projet à éviter.** Le résumé du poème. Un poème au long cours ne se résume "
        "pas : il n'a pas d'intrigue. L'exercice décourage la classe et ne prouve rien.",
    ],

    devoirs_progressifs=[
        ("Devoir n° 1 — après les pages 7 à 35", [
            "**Question de lecture.** Relevez dix vers qui commencent par « et ». Que "
            "produit cette répétition quand on lit le passage à voix haute ?",
            "**Question de langue.** « il fait si froid dans le soleil ». Expliquez pourquoi "
            "cette phrase est étonnante, et dites comment on appelle ce rapprochement de "
            "deux mots contraires.",
            "**Production écrite (10 lignes).** À la manière du poème, écrivez cinq vers "
            "libres commençant tous par « et », sur une chose qui vous a fait de la peine. "
            "Aucune majuscule, aucune ponctuation.",
        ]),
        ("Devoir n° 2 — après les pages 36 à 62", [
            "**Question de lecture.** Relevez tous les noms de villes que vous trouvez dans "
            "ce passage. Classez-les par continent.",
            "**Question de langue.** Choisissez trois images que vous ne comprenez pas au "
            "premier degré. Pour chacune, dites quels sont les deux mots rapprochés, et ce "
            "que le rapprochement fait voir.",
            "**Production écrite (15 lignes).** Le poème refuse de séparer les morts selon "
            "leur pays. Expliquez pourquoi, en vous appuyant sur deux citations.",
        ]),
        ("Devoir n° 3 — après les pages 63 à 92", [
            "**Question de lecture.** Relevez cinq vers commençant par « et nous serons ». "
            "Que promettent-ils, et à qui ?",
            "**Question de langue.** Comparez le premier vers du livre et le dernier. "
            "Qu'est-ce qui a changé ?",
            "**Production écrite (20 lignes).** « Ce poème est un contre-feu. » Expliquez "
            "cette formule en vous appuyant sur le titre et sur la fin du texte.",
        ]),
    ],

    etude_personnages=[
        ["Le « je »", "Montrer qu'il n'est pas seulement celui qui pleure : il est aussi "
                      "celui qui accuse, puis celui qui promet. Suivre ses verbes d'un bout "
                      "à l'autre du livre."],
        ["Le « nous »", "Établir qui il englobe, et à quel moment il remplace le « je ». "
                        "C'est le passage du deuil privé au deuil commun."],
        ["Henrike", "Montrer que son prénom fonctionne comme un refrain : posé seul sur une "
                    "ligne, il coupe le vers et oblige à s'arrêter. Compter ses occurrences."],
        ["Oussama", "Établir que le nom déborde la personne. Relever les mots qui "
                    "l'accompagnent — « sourates », « mémoire », « haines coloriées » — et "
                    "montrer qu'il désigne un système, non un individu."],
        ["Les oiseaux", "Suivre le motif du début à la fin : oiseaux fusillés, balles "
                        "« habillées d'ailes sombres », puis « l'oiseau bleu au "
                        "roucoulement des nouvelles saisons ». C'est le meilleur fil pour "
                        "faire sentir le mouvement du livre."],
        ["Les victimes anonymes", "Montrer que le poème refuse de les compter comme des "
                                  "chiffres — « les trois cents corps émiettés » — et qu'il "
                                  "leur rend des gestes et des rires."],
    ],

    etude_lieux=[
        ["Grand-Bassam", "Le lieu de l'attentat, et le centre du livre. Une plage, des "
                         "cocotiers, des rires : le poème ne cesse d'opposer le décor "
                         "heureux et ce qui s'y est passé."],
        ["Abidjan — le Plateau, le Goethe Institut", "Les lieux de l'amitié. C'est là que le "
                                                     "souvenir heureux revient : un balcon, "
                                                     "une mosquée bleue, un spectacle."],
        ["Le Sahel — Bamako, Ouagadougou, Niamey, Tombouctou, Maroua, Maïduguri",
         "La zone frappée depuis 2012. Le poème les cite en rafale, sans virgule : la "
         "liste imite le mitraillage."],
        ["L'Europe — Paris, Bruxelles, Londres, Barcelone, Saint-Étienne-du-Rouvray",
         "Le poème met sur le même plan les morts du Nord et ceux du Sud. C'est une thèse, "
         "et elle passe par une simple juxtaposition."],
        ["L'Orient et l'Afrique de l'Est — Kaboul, Palmyre, Sousse, Le Caire, Garissa, "
         "Mogadiscio",
         "L'élargissement maximal. À ce point du livre, la liste ne sert plus à informer : "
         "elle sert à montrer qu'aucun continent n'est épargné."],
        ["La brousse et le feu", "Le seul lieu qui ne soit pas une ville. Il porte le titre, "
                                 "et il donne au livre son image finale : un feu qui éclaire "
                                 "au lieu de brûler."],
    ],

    schema=[
        ["Exorde — « Comme introduction » (p. 7)",
         "Le constat et l'appel, en une centaine de mots. Tout le livre y est en germe."],
        ["Premier temps — le coup (p. 9 à 35 environ)",
         "La mort d'Henrike, la plage, le cercueil, le cortège. Le « je » domine ; la "
         "tonalité est lyrique et pathétique."],
        ["Deuxième temps — l'élargissement (p. 36 à 62 environ)",
         "La révolte s'étend à toutes les violences commises au nom de la religion. Les "
         "noms de villes se multiplient ; le « nous » prend le dessus."],
        ["Troisième temps — le retournement (p. 63 à 84 environ)",
         "Le souvenir heureux revient, puis la promesse. Les futurs remplacent les présents."],
        ["Dernier mouvement — l'appel (p. 84 à 92)",
         "« et nous serons… », puis « viens ». Le poème ne se termine pas sur un constat "
         "mais sur un impératif."],
        ["Dernier vers",
         "« car le futur nu est de notre temps ô voyage » — le livre se ferme sur le mot "
         "voyage, et sur une apostrophe."],
    ],

    axes=[
        ("Axe 1 — Une forme qui refuse la règle", [
            "Pas de majuscules, presque pas de ponctuation, des vers de longueur "
            "imprévisible : le poème se construit contre la grammaire de l'école. Il faut "
            "l'expliquer à la classe, et non le lui laisser deviner.",
            "Cette liberté n'est pas un caprice. Elle vient du surréalisme, et elle passe "
            "par de grands poètes noirs — Aimé Césaire au premier rang, que N'koumo cite "
            "comme l'un de ses auteurs préférés.",
            "**Ce qu'on fera relever** : l'absence de majuscule au premier mot du livre ; "
            "les cinq points d'interrogation de tout le volume ; le « et » en tête de vers.",
        ]),
        ("Axe 2 — Le « et » comme moteur", [
            "La grammaire dit que « et » relie des mots de même nature. Ici, il ouvre les "
            "vers. Il ne relie plus : il relance.",
            "Il joue trois rôles à la fois : il donne le rythme, il enchaîne les images sans "
            "les hiérarchiser, et il empêche le poème de s'arrêter — car une phrase qui "
            "commence par « et » n'est jamais la dernière.",
            "**Ce qu'on fera relever** : compter les « et » d'une page, puis lire la page à "
            "voix haute en les supprimant. La classe entend immédiatement ce qui se perd.",
        ]),
        ("Axe 3 — Nommer, et ne pas compter", [
            "Le poème est plein de noms propres : plus de vingt villes, plusieurs personnes. "
            "Il refuse en revanche les statistiques : quand il donne un nombre — « les trois "
            "cents corps émiettés » — c'est pour lui rendre aussitôt des corps et des "
            "lumières.",
            "Nommer un lieu, c'est refuser qu'il devienne une information. C'est aussi "
            "mettre Paris et Maïduguri sur la même ligne, ce qui est une prise de position.",
            "**Ce qu'on fera relever** : la liste de la page 30 environ, et la liste de la "
            "page 84 environ. La première dit où l'on a frappé ; la seconde dit « nous ne "
            "serons plus » ces villes-là. Le même procédé sert deux fois, en sens contraire.",
        ]),
        ("Axe 4 — Du cri au chant", [
            "Le livre commence par « il fait si froid dans le soleil » et se termine par un "
            "appel : « viens ». Entre les deux, la douleur ne disparaît pas, elle change de "
            "temps verbal — le présent devient futur.",
            "L'auteur le dit lui-même : ces poèmes « ne sont pas violents dans leur for "
            "intérieur ; c'est plutôt le monde actuel, celui qui a conditionné leur "
            "écriture, qui l'est ». Il les appelle « un contre-feu idéal ».",
            "**Ce qu'on fera relever** : les temps verbaux. Relever tous les futurs des dix "
            "dernières pages et les comparer aux présents des dix premières.",
        ]),
    ],

    oral=[
        "**Ce qu'on demande.** Lire vingt vers à voix haute, puis en rendre compte pendant "
        "cinq minutes : de quoi parle le passage, comment il est fait, ce qu'il produit.",
        "**Ce qui compte particulièrement dans ce livre.** La lecture elle-même. Un poème "
        "sans ponctuation oblige le lecteur à décider où respirer. Deux élèves ne "
        "découperont pas le même passage de la même façon, et cette différence est un sujet "
        "d'analyse : demandez toujours pourquoi l'élève s'est arrêté là.",
        "**Trois erreurs à corriger.** Lire en s'arrêtant à chaque fin de ligne, comme si "
        "elle était un point. Chercher des rimes et s'excuser de n'en pas trouver. Traduire "
        "les images au premier degré (« il veut dire qu'il a froid »).",
        "**Barème indicatif sur 20.** Lecture à voix haute : 5. Situation du passage : 3. "
        "Analyse de la forme : 6. Analyse du sens : 4. Expression orale : 2.",
    ],

    exposes=[
        "**L'onomastique dans le poème.** Relever tous les noms propres, compter leurs "
        "occurrences, les classer en noms de personnes et noms de lieux. Dire à quoi ils "
        "renvoient réellement, et pourquoi l'auteur les cite. Point de départ fourni par "
        "l'auteur lui-même : « Henrike » revient plus de dix-huit fois, « Oussama » plus de "
        "dix, « Grand-Bassam » plus de quinze.",
        "**L'énonciation dans le poème.** Qui parle ? Par quels mots se désigne-t-il ? À qui "
        "parle-t-il ? De quoi ? Suivre le passage du « je » au « nous » et dire à quel "
        "moment il se produit.",
        "**La thématique.** Relever les thèmes — la liberté, l'amour, la tolérance, la "
        "violence, la fraternité — puis les classer en thèmes principaux et secondaires, et "
        "dire comment ils se répondent.",
        "**Le feu, du titre à la dernière page.** Suivre le mot et ses dérivés : feu de "
        "brousse, flammes, incendiaire, brûlures, contre-feu. Montrer qu'il change de valeur "
        "au cours du livre.",
        "**Césaire et N'koumo.** Comparer l'ouverture du Cahier d'un retour au pays natal et "
        "celle de Poèmes sauvages. Deux poèmes au long cours, deux souffles. Exposé réservé "
        "à un groupe solide, et à préparer avec le professeur.",
        "**Comment un journal a raconté le 13 mars 2016.** Comparer un article de presse et "
        "les pages du poème qui racontent le même événement. Qu'est-ce que le poème fait que "
        "l'article ne fait pas — et l'inverse ?",
    ],

    themes=[
        ["La mort et le deuil", "Tout le premier temps : le corps, le cercueil, le cortège, "
                                "la morgue."],
        ["Le fanatisme religieux", "Les « fous de dieu », les sourates détournées, les "
                                   "kamikazes, « leur coran aux lames pourpres »."],
        ["La violence du monde", "Les kalachs, les camions-béliers, les bombes, les "
                                 "enlèvements de Chibok, les cyclones eux-mêmes."],
        ["L'amitié", "Henrike vivante : le rire, le balcon, le spectacle, la main tenue."],
        ["La liberté", "L'auteur appelle son texte « une ode à la liberté » ; le mot revient "
                       "aux moments où le poème se redresse."],
        ["La fraternité", "« nous serons Coran et Bible et Torah et Bouddha » : la "
                          "coexistence des croyances, posée comme un futur."],
        ["L'espérance", "Le troisième temps entier : les futurs, la résurrection d'Henrike, "
                        "l'appel final."],
        ["Le pouvoir de la parole", "« ma parole est nid d'oiseaux » : le poème se donne "
                                    "lui-même pour un remède, un « contre-feu »."],
    ],

    lexique_general=[
        ("A — Les mots du recueil", [
            ['à contre-jour', "éclairé par-derrière, si bien qu'on ne voit qu'une ombre."],
            ['à perte de vue', "aussi loin qu'on peut voir."],
            ['aigu', 'pointu, perçant. « les flammes aigues » : les flammes pointues.'],
            ['amères', "au goût d'amertume ; ici, tristes."],
            ['aphone', "qui n'a plus de voix."],
            ['bruire', 'faire un bruit léger et continu.'],
            ['castrer', 'priver de sa force, rendre stérile.'],
            ['ceindre', 'entourer. « les feux de brousse qui nous ceignent » : qui nous encerclent.'],
            ['corrompu', 'gâté, perverti. « des hurlements non corrompus » : des cris restés purs.'],
            ['cramer', 'brûler. Mot familier, employé ici pour sa brutalité.'],
            ['crépiter', 'faire de petits bruits secs et répétés, comme un feu.'],
            ['déraciner', 'arracher avec les racines.'],
            ['des décombres', "restes d'un bâtiment détruit."],
            ['des moignons', "ce qui reste d'un membre coupé."],
            ['des morves', 'sécrétions du nez. Mot volontairement laid, à côté du mot « poème ».'],
            ['des tenailles', 'outil qui serre et arrache.'],
            ['desseins', 'projets, intentions. Ne pas confondre avec « dessins ».'],
            ['dompté', 'maîtrisé, apprivoisé.'],
            ['écorché vif', "à qui l'on a arraché la peau. Se dit d'une personne très sensible."],
            ['écroulées', "effondrées, tombées d'un coup."],
            ['en rut', "en chaleur, en état d'excitation animale."],
            ['endémique', 'qui est installé pour longtemps dans un lieu.'],
            ['enlacer', 'entourer de ses bras.'],
            ['enragées', 'folles de rage. Ici, ce sont les lumières qui le sont.'],
            ['flageller', 'fouetter.'],
            ['giboyeux', 'riche en gibier. « la giboyeuse lumière » : une lumière abondante.'],
            ['Grand-Bassam', "ville de la côte ivoirienne, près d'Abidjan. Lieu de l'attentat du 13 mars 2016."],
            ["l'anémie", 'manque de sang.'],
            ['la bruyance', 'mot rare : le fait de faire du bruit.'],
            ['la démence', 'la folie.'],
            ['la férocité', 'la cruauté sauvage.'],
            ['la fougue', 'élan violent et joyeux.'],
            ['la morgue', "le lieu où l'on garde les corps des morts."],
            ['la repentance', "le regret d'une faute, et la volonté de la réparer."],
            ['la sève', 'liquide qui monte dans les plantes et les fait vivre.'],
            ['la voltige', "acrobatie en l'air."],
            ['le Goethe Institut', "centre culturel allemand. Henrike Grohs dirigeait celui d'Abidjan."],
            ['le levain', 'ce qui fait lever la pâte à pain.'],
            ['le pili-pili', 'petit piment très fort, courant en Afrique.'],
            ['le Plateau', "quartier des affaires d'Abidjan, où se trouve une grande mosquée."],
            ['limpide', 'parfaitement clair.'],
            ['lippues', 'aux grosses lèvres. Le mot est rare ; il donne un corps aux douleurs.'],
            ['malmenées', 'traitées durement.'],
            ['millénaire', 'vieux de mille ans. « les livres millénaires » : les textes sacrés.'],
            ['mutiler', 'blesser en enlevant une partie du corps.'],
            ['navrée', 'profondément attristée. Le mot est fort en français classique.'],
            ['nubile', 'en âge de se marier. Employé ici pour la peur, ce qui surprend.'],
            ['osseux', "fait d'os. Ici, ce sont les souvenirs qui le sont."],
            ['Oussama', "Oussama ben Laden, fondateur d'Al-Qaïda. Dans le poème, son nom désigne le fanatisme en général."],
            ['poindre', 'commencer à paraître.'],
            ['prendre la clé des champs', "s'enfuir. Expression toute faite, prise ici au pied de la lettre."],
            ['primates', 'les singes, et par extension les hommes réduits à leur violence.'],
            ['ravalé', 'ici : refoulé, retenu.'],
            ['récalcitrants', 'qui résistent, qui refusent de se taire.'],
            ['réconciliateur', 'qui remet en paix ceux qui étaient ennemis.'],
            ['rejaillir', 'jaillir de nouveau.'],
            ['retrousser', 'relever, remonter. Ici : faire remonter un souvenir.'],
            ['rougeoyer', "briller d'une lueur rouge."],
            ['saignés à blanc', 'vidés de leur sang.'],
            ['sans frein', "que rien n'arrête."],
            ['surplomber', 'dominer, se trouver au-dessus.'],
            ['un chapelet', "collier de grains que l'on égrène en priant."],
            ['un goitre', 'grosseur au cou. Ici, celui des nuages.'],
            ['un harpon', 'arme de jet à pointe crochue, employée pour la pêche.'],
            ['un hennissement', 'cri du cheval.'],
            ['un juge de paix', "magistrat qui règle les petits litiges, et cherche l'accord plutôt que la condamnation."],
            ['un lieu de culte', "église, mosquée, temple : lieu où l'on prie."],
            ['un linceul', 'tissu dans lequel on enveloppe un mort.'],
            ['un nid', "abri que l'oiseau construit pour ses petits."],
            ['un roucoulement', 'cri doux du pigeon et de la colombe.'],
            ['un tourment', 'grande souffrance.'],
            ['un verset', "phrase numérotée d'un livre sacré. Ne pas confondre avec le verset des poètes, qui est un vers très long."],
            ['un vin tiré', "un vin qu'on a mis en carafe. L'expression « le vin est tiré » signifie qu'on ne peut plus revenir en arrière."],
            ['une corruption', "le fait de gâter, d'abîmer."],
            ['une falaise', 'haute paroi de rocher au bord de la mer.'],
            ['une fosse commune', "trou où l'on enterre plusieurs morts ensemble, sans tombe individuelle."],
            ['une fusion', "le fait de se fondre, de ne plus faire qu'un."],
            ['une kalach', "abréviation de kalachnikov, un fusil d'assaut."],
            ['une mélopée', 'chant lent et monotone.'],
            ['une meute', 'groupe de chiens lancés à la poursuite.'],
            ['une natte', "tapis tressé sur lequel on s'assoit ou l'on prie."],
            ['une oraison', 'une prière.'],
            ['une rengaine', "refrain que l'on répète sans fin."],
            ['une sourate', 'chapitre du Coran.'],
            ['une transe', "état où l'on n'est plus maître de soi."],
            ['vendanger', 'récolter le raisin. Ici, au figuré : recueillir.'],
        ]),

        ("B — Les mots pour parler d'un texte", [
            ["Anaphore", "Répétition d'un même mot au début de plusieurs vers."],
            ["Apostrophe", "On s'adresse directement à quelqu'un ou à quelque chose."],
            ["Champ lexical", "Ensemble des mots d'un texte qui parlent du même sujet."],
            ["Comparaison", "Rapprochement de deux choses avec « comme », « tel », "
                            "« pareil à »."],
            ["Énumération", "Liste de mots mis à la suite."],
            ["Épigraphe", "Citation placée en tête d'un livre."],
            ["Exorde", "Le début d'un discours, qui annonce ce qui va être dit."],
            ["Hyperbole", "Exagération volontaire, pour frapper."],
            ["Image", "Manière de dire une chose par une autre : comparaison, métaphore, "
                      "personnification."],
            ["Litanie", "Suite de formules répétées, comme une prière."],
            ["Métaphore", "Comparaison sans mot de comparaison."],
            ["Ode", "Poème qui chante et célèbre quelque chose."],
            ["Onomastique", "Étude des noms propres d'un texte."],
            ["Oxymore", "Deux mots de sens contraire mis côte à côte."],
            ["Personnification", "On prête à une chose des gestes ou des sentiments d'être "
                                 "vivant."],
            ["Poème au long cours", "Un seul poème qui remplit tout un livre."],
            ["Strophe", "Groupe de vers séparé des autres par un blanc."],
            ["Surréalisme", "Écriture qui rapproche des mots que l'usage sépare."],
            ["Tonalité", "L'émotion qu'un texte fait naître : lyrique, pathétique, "
                         "épique…"],
            ["Vers libre", "Vers sans nombre de syllabes fixe ni rime obligée."],
            ["Verset", "Vers très long, qui se lit d'un seul souffle."],
        ]),
    ],

    bibliographie=[
        "**Œuvre étudiée** — Henri N'KOUMO, Poèmes sauvages éclairés au feu de brousse, "
        "Abidjan, Les Classiques Ivoiriens, 2022, 92 pages.",
        "**Dossier de l'auteur** — le volume est accompagné d'un dossier pédagogique "
        "(« Étude de l'œuvre », pistes d'exposés, sept extraits proposés) et d'un entretien "
        "avec Koffi Koffi. C'est la source des éléments biographiques et des indications de "
        "découpage de ce cahier.",
        "**Textes officiels** — MINESEC, Programme de français du second cycle. MINESEC, "
        "Guide pédagogique 2019, § III.2 (étude de l'œuvre intégrale).",
        "**Pour aller plus loin** — Aimé CÉSAIRE, Cahier d'un retour au pays natal : l'autre "
        "grand poème au long cours de la littérature négro-africaine, auquel l'auteur se "
        "réfère explicitement.",
    ],
)
