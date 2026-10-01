# -*- coding: utf-8 -*-
"""
Données de contenu des huit œuvres, relevées **dans les œuvres elles-mêmes**.

Tout ce qui figure ici a été vérifié en ouvrant le fichier de l'œuvre :
la division en parties et en actes, les noms des personnages et leur poids
dans le texte, les lieux, l'enchaînement des moments. Rien n'est écrit de
mémoire, et rien n'est repris d'une notice en ligne — plusieurs se sont
révélées fausses en cours d'audit.

Ces données alimentent la carte mentale et les exercices bilan
(`apparat.py`). Un cahier dont la carte mentale contredirait l'œuvre serait
plus nuisible qu'un cahier sans carte mentale.

> ⚠️ **Le lion et la perle.** Le fichier source contient, à la suite du texte
> de Soyinka, une seconde pièce sans rapport (Gbêhanzin, Migan, Mèhou, le
> Danhomè). Le texte authentique s'arrête au mot 23 412. Ne jamais citer
> au-delà, ni prendre ces noms pour des personnages de Soyinka.
"""

VIEUXNEGRE = dict(
    structure=[
        ["Première partie (chap. I à V)",
         "Meka apprend qu'un chef blanc va lui remettre une médaille. Le "
         "village commente, la famille se rassemble, l'attente s'organise."],
        ["Deuxième partie (chap. I à III)",
         "La cérémonie du 14 Juillet, le cercle de chaux, la remise de la "
         "médaille, puis la réception au Foyer Africain."],
        ["Troisième partie (chap. I à III)",
         "L'orage, l'errance, l'arrestation, la nuit au poste de police, et "
         "le retour au village."],
    ],
    personnages=[
        ["Meka", "Le vieux paysan décoré. Le discours officiel le résume : « Tu "
                 "as donné tes terres aux missionnaires, tu avais donné tes deux "
                 "fils à la guerre. »"],
        ["Kelara", "Sa femme. C'est par ses yeux que la cérémonie est jugée."],
        ["Engamba", "Son beau-frère, venu du village pour la fête."],
        ["Amalia", "La femme d'Engamba."],
        ["Mvondô", "Le neveu de Meka, fils de sa sœur cadette."],
        ["Ignace Obebé", "Le catéchiste."],
        ["Mami Titi", "La vendeuse d'arki, chez qui l'on boit."],
        ["M. Fouconi", "L'administrateur en chef de Doum, qui remet la "
                       "médaille."],
        ["M. Varini, dit « Gosier d'Oiseau »", "Le commissaire de police."],
        ["Le père Vandermayer", "Le missionnaire."],
    ],
    lieux=["Doum, chef-lieu où se tient la cérémonie",
           "Le village de Meka", "Le Foyer Africain", "Le poste de police"],
    moments=[
        "L'annonce de la médaille et l'attente du village",
        "Le cercle de chaux, sous le soleil, pendant le discours",
        "La remise de la médaille par M. Fouconi",
        "La réception au Foyer Africain, dont Meka est écarté",
        "L'orage, l'errance nocturne, l'arrestation",
        "La nuit en cellule et le retour au village",
    ],
    qcm=[
        ("Pour quelle raison Meka reçoit-il une médaille ?",
         ["Il a donné ses terres aux missionnaires et ses deux fils à la "
          "guerre", "Il a sauvé un administrateur", "Il est chef de village",
          "Il a construit l'église"]),
        ("Dans quelle ville se déroule la cérémonie ?",
         ["Doum", "Yaoundé", "Douala", "Le village de Meka"]),
        ("Qu'est-ce qui délimite la place de Meka pendant la cérémonie ?",
         ["Un cercle de chaux tracé au sol", "Une estrade", "Une chaise",
          "Un tapis"]),
        ("Qui est Kelara ?",
         ["La femme de Meka", "Sa sœur", "Sa fille", "Sa belle-mère"]),
        ("Que surnomme-t-on « Gosier d'Oiseau » ?",
         ["Le commissaire de police, M. Varini", "L'administrateur Fouconi",
          "Le missionnaire", "Le chef du village"]),
        ("Comment la journée de fête se termine-t-elle pour Meka ?",
         ["Par une nuit en cellule au poste de police",
          "Par un banquet en son honneur", "Par un discours qu'il prononce",
          "Par son départ pour la ville"]),
    ],
)

LIONPERLE = dict(
    structure=[
        ["Acte I", "Le matin. Le magazine où paraissent les photographies de "
                   "Sidi, l'orgueil qui en naît, la demande de Lakounlé."],
        ["Acte II", "Le milieu du jour. Sadikou porte à Sidi l'invitation de "
                    "Baroka ; Sidi refuse et se moque du vieux Balé."],
        ["Acte III", "Le soir. La ruse de Baroka aboutit ; le mariage se "
                     "décide, et Lakounlé reste seul avec ses discours."],
    ],
    personnages=[
        ["Sidi", "La « perle » du village. Le personnage le plus présent de "
                 "la pièce."],
        ["Baroka", "Le Balé, chef d'Iloujinlé. La didascalie le dit "
                   "« barbichu, sec comme une trique, et ne paraissant pas ses "
                   "soixante-deux ans ». C'est le « lion » du titre."],
        ["Lakounlé", "L'instituteur, partisan du progrès et de la vie "
                     "moderne. Il refuse de payer la dot."],
        ["Sadikou", "La première épouse de Baroka, qui sert de messagère."],
    ],
    lieux=["Le village d'Iloujinlé, en pays yoruba",
           "La place du village et son arbre", "La chambre de Baroka"],
    moments=[
        "Les photographies du magazine : Sidi se découvre célèbre",
        "La demande en mariage de Lakounlé et la question de la dot",
        "Sadikou porte l'invitation de Baroka",
        "Le récit de la route et des arpenteurs venus au village",
        "La ruse de Baroka : la fausse confidence d'impuissance",
        "Le dénouement : Sidi choisit, Lakounlé demeure seul",
    ],
    qcm=[
        ("Qui est le « lion » du titre ?",
         ["Baroka, le Balé du village", "Lakounlé", "Le père de Sidi",
          "Un animal de la brousse"]),
        ("Pourquoi Sidi devient-elle célèbre au village ?",
         ["Ses photographies paraissent dans un magazine",
          "Elle a remporté un concours", "Elle a hérité d'une fortune",
          "Elle a fait des études en ville"]),
        ("Quel obstacle Lakounlé oppose-t-il au mariage traditionnel ?",
         ["Il refuse de payer la dot, qu'il juge barbare",
          "Il n'aime pas Sidi", "Il est déjà marié",
          "Sa famille s'y oppose"]),
        ("Quel rôle joue Sadikou dans l'intrigue ?",
         ["Première épouse de Baroka, elle sert de messagère",
          "Elle est la mère de Sidi", "Elle est l'institutrice du village",
          "Elle est la rivale de Sidi"]),
        ("Par quel moyen Baroka l'emporte-t-il ?",
         ["Par une ruse : il se dit impuissant",
          "Par la force", "Par l'argent", "Par l'intervention du chef voisin"]),
        ("Que devient Lakounlé à la fin de la pièce ?",
         ["Il reste seul avec ses discours sur le progrès",
          "Il épouse Sidi", "Il quitte le village", "Il devient Balé"]),
    ],
)

NGUM = dict(
    structure=[
        ["Acte I (3 scènes)", "Von Roehm reçoit Dualla Manga et lui expose le "
                              "projet d'assainissement et d'urbanisation."],
        ["Acte II (1 scène)", "Le conflit s'installe : la ville doit être "
                              "divisée, les Duala déplacés."],
        ["Acte III (2 scènes)", "Le refus s'organise ; les recours et les "
                                "appuis sont cherchés."],
        ["Acte IV (3 scènes)", "L'étau se resserre ; l'entourage presse Dualla "
                               "Manga de fuir."],
        ["Acte V (3 scènes)", "Le procès et l'exécution."],
    ],
    personnages=[
        ["Dualla Manga", "Le roi duala. Le personnage central de la pièce."],
        ["Von Roehm", "Le chef de région allemand, porteur du projet "
                      "d'expropriation."],
        ["Niedermeyer", "L'administrateur allemand."],
        ["Ngoso Din", "Le secrétaire de Dualla Manga, condamné avec lui."],
        ["Kum'a Mbape", "Un proche du roi."],
        ["Anjo Bell", "Celui qui presse Dualla Manga de se mettre à l'abri."],
        ["Engome", "L'épouse."],
    ],
    lieux=["Douala, sous administration allemande",
           "Le bureau du chef de région", "La demeure du roi",
           "Le lieu du procès"],
    moments=[
        "L'entretien courtois qui ouvre la pièce",
        "L'annonce du projet : la ville divisée, les Duala déplacés",
        "L'invocation du traité de 1884",
        "Les recours, les appuis cherchés au-dehors",
        "Le refus de fuir malgré les instances de l'entourage",
        "Le procès, puis l'exécution — 8 août 1914",
    ],
    qcm=[
        ("Que propose Von Roehm au début de la pièce ?",
         ["L'assainissement et l'urbanisation de la ville",
          "Un traité de commerce", "Une alliance militaire",
          "L'ouverture d'une école"]),
        ("Sur quel document Dualla Manga fonde-t-il son refus ?",
         ["Le traité signé en 1884 entre les chefs duala et l'Allemagne",
          "Une lettre du Kaiser", "Un jugement de tribunal",
          "Une pétition du peuple"]),
        ("Qui est Ngoso Din ?",
         ["Le secrétaire du roi, condamné avec lui",
          "Un chef rival", "Un officier allemand", "Le fils du roi"]),
        ("Que refuse Dualla Manga jusqu'au bout ?",
         ["De fuir pour se mettre à l'abri",
          "De rencontrer Von Roehm", "De parler allemand",
          "De se faire assister d'un avocat"]),
        ("Comment la pièce se termine-t-elle ?",
         ["Par le procès et l'exécution du roi",
          "Par sa fuite", "Par sa grâce", "Par une révolte armée"]),
        ("En quelle année ces faits se sont-ils déroulés ?",
         ["1914", "1884", "1900", "1945"]),
    ],
)

CAPITOLINE = dict(
    structure=[
        ["L'enfance à Elig-Belibi",
         "Mathieu grandit à Yaoundé, dans le quartier d'Elig-Belibi, auprès "
         "d'une mère silencieuse. Son acte de naissance porte « père "
         "inconnu » ; il se croit pourtant de race éwondo."],
        ["La blessure fondatrice",
         "Son premier enfant meurt nouveau-né. Le village refuse de "
         "l'enterrer : Mathieu n'appartient pas à la lignée. C'est là que "
         "l'exclusion devient une expérience, non une idée."],
        ["Le départ pour Douala",
         "Muni d'un BEPC et d'un échec au probatoire, il monte à Douala "
         "chercher du travail. Il est recruté au bout de cinq mois par la "
         "compagnie d'assurances Chanas, à Akwa, et loge à Nkomondo."],
        ["Capitoline",
         "Il rencontre Capitoline Ida Petnga, qui sert au bar de son père. "
         "Après des refus, il lui écrit une longue lettre. Son amie Tamar "
         "l'aide à la lire ; la rencontre a lieu."],
        ["Les deux familles",
         "Le père de Capitoline, originaire de Bandou-mka dans le Haut-Nkam, "
         "veut un gendre bamiléké, de préférence bafang. Sophie Mbezele, elle, "
         "s'oppose à son fils."],
        ["Le dernier repas, et l'épilogue",
         "La mère prépare un plat pour Capitoline et insiste pour qu'elle le "
         "mange, « sûre de son fait ». Capitoline, sans appétit, y touche à "
         "peine. Au matin, c'est Mathieu qui souffre ; il meurt dans la "
         "journée. Il repart de Douala « allongé dans une longue caisse de "
         "bois rouge », tandis qu'au village de son père, où l'on ignore "
         "tout, « la fête avait commencé »."],
    ],
    personnages=[
        ["Mathieu", "Le héros. Il monte à Douala « pour trouver du travail, "
                    "réussir dans la vie et rendre sa mère heureuse ». Sa "
                    "tante l'appelle « Manos »."],
        ["Capitoline Ida Petnga", "La jeune femme qui sert au bar de son "
                                  "père. Elle donne son nom au roman."],
        ["Sophie Mbezele", "La mère de Mathieu, silencieuse et redoutée. "
                           "C'est elle qui prépare le dernier repas."],
        ["Médard Balingué", "Le père de Mathieu, ouvrier-machiniste "
                            "ossananga, longtemps inconnu de son fils."],
        ["Jacqueline Aboui, dite maman Song' Lina", "La tante de Douala, "
                                                    "seule à l'appeler "
                                                    "« Manos »."],
        ["Tamar", "L'amie de Capitoline, qui l'aide à lire la lettre et "
                  "l'encourage à écouter ses sentiments."],
        ["Pascal Sil", "Le meilleur ami, désigné par un terme qui "
                       "hiérarchise les origines."],
        ["Papa Malin", "La « terreur » du club de dames de Kassalafam, "
                       "originaire de Bafang. Mathieu le bat."],
        ["Maman Rose", "L'émissaire envoyée prévenir le père ; son train "
                       "déraille entre Édéa et Éséka."],
    ],
    lieux=["Elig-Belibi, quartier de Yaoundé : l'enfance et l'origine",
           "Douala : Akwa, Nkomondo, Kassalafam, New-Bell, Nylon, le port",
           "Bandou-mka, dans les montagnes du Haut-Nkam, près de Bafang : le "
           "village du père de Capitoline",
           "Bilanga-Kombé, le village de Médard Balingué",
           "La route Douala-Yaoundé par Kikot, non bitumée"],
    moments=[
        "L'enfance à Elig-Belibi et la mention « père inconnu »",
        "L'enfant mort qu'on refuse d'enterrer au village",
        "Le départ pour Douala et l'embauche chez Chanas",
        "Le jeu de dames à Kassalafam : la victoire sur papa Malin",
        "La lettre à Capitoline, et la rencontre devant le bar",
        "L'opposition des deux familles, chacune pour sa tribu",
        "Le dernier repas, la mort de Mathieu, et la fête qui commence",
    ],
    qcm=[
        ("Pourquoi Mathieu vient-il à Douala ?",
         ["Pour « trouver du travail, réussir dans la vie et rendre sa mère "
          "heureuse »", "Pour poursuivre ses études", "Pour fuir sa famille",
          "Pour rejoindre son père"]),
        ("Quel événement révèle à Mathieu qu'il est un étranger dans le "
         "village de sa mère ?",
         ["Le refus d'y enterrer son premier enfant",
          "Un procès", "Une dispute avec son oncle",
          "Le départ de sa tante"]),
        ("Qu'exige le père de Capitoline pour sa fille ?",
         ["Un gendre bamiléké, de préférence bafang",
          "Un gendre éwondo", "Un gendre riche", "Un gendre instruit"]),
        ("Comment Mathieu obtient-il un rendez-vous avec Capitoline ?",
         ["En lui écrivant une longue lettre", "En passant par sa mère",
          "En la suivant", "En payant son amie"]),
        ("De quoi Mathieu meurt-il ?",
         ["Le roman ne le dit pas : il montre un plat destiné à Capitoline, "
          "une mère « sûre de son fait », et Mathieu mort au matin",
          "D'un accident de la route", "D'une longue maladie",
          "Le roman le dit explicitement : d'un poison"]),
        ("Sur quelle phrase le roman se termine-t-il ?",
         ["« La fête avait commencé. »", "« Il était mort. »",
          "« Capitoline pleurait. »", "« Le train déraillait. »"]),
    ],
)

TENEBRES = dict(
    structure=[
        ["Chapitre I", "À bord de la Nellie, « cotre de croisière » mouillé sur "
                       "la Tamise, Marlow commence son récit : l'engagement à la "
                       "Compagnie, la traversée, le comptoir, la station centrale, "
                       "et le nom de Kurtz qui commence à circuler."],
        ["Chapitre II", "La remontée du fleuve vers la station intérieure : le "
                        "vapeur, le brouillard, l'attaque, la mort du timonier."],
        ["Chapitre III", "L'arlequin russe, la rencontre de Kurtz, son agonie, "
                         "puis le retour en Europe et la visite à la Promise."],
    ],
    personnages=[
        ["Marlow", "Le narrateur. C'est lui qui raconte, à bord de la "
                   "Nellie, cotre de croisière mouillé sur la Tamise."],
        ["Kurtz", "L'agent dont tout le monde parle avant qu'il paraisse. Le "
                  "nom le plus fréquent du livre."],
        ["Le Directeur", "Le chef de la station centrale."],
        ["L'arlequin russe", "Le jeune homme vêtu de pièces rapportées, "
                             "admirateur de Kurtz."],
        ["Fresleven", "Le prédécesseur de Marlow, tué avant le récit."],
        ["La Promise", "Celle qui attend Kurtz en Europe, et à qui Marlow "
                       "ment."],
    ],
    lieux=["La Tamise, au départ et à l'arrivée du récit",
           "La ville « sépulcre blanchi » — Bruxelles, jamais nommée",
           "Le fleuve et ses stations", "La station intérieure de Kurtz"],
    moments=[
        "Le récit commencé sur la Tamise, à la tombée du jour",
        "L'engagement à la Compagnie et le départ",
        "Le comptoir : les hommes épuisés, le désordre, l'attente",
        "La remontée du fleuve et la rumeur autour de Kurtz",
        "La rencontre de Kurtz et ses derniers mots",
        "Le retour, et le mensonge fait à la Promise",
    ],
    qcm=[
        ("Où Marlow raconte-t-il son histoire ?",
         ["À bord de la Nellie, mouillée sur la Tamise",
          "Dans un salon à Bruxelles", "Sur le fleuve Congo",
          "Dans un bureau de la Compagnie"]),
        ("Quel métier Kurtz exerce-t-il officiellement ?",
         ["Collecteur d'ivoire pour la Compagnie",
          "Médecin", "Militaire", "Missionnaire"]),
        ("Comment le récit désigne-t-il la ville d'où part Marlow ?",
         ["Comme « une cité qui me fait toujours penser à un sépulcre "
          "blanchi », sans la nommer",
          "Bruxelles", "Londres", "Anvers"]),
        ("Qui est l'arlequin ?",
         ["Un jeune Russe vêtu de pièces rapportées, admirateur de Kurtz",
          "Un employé de la Compagnie", "Un chef local",
          "Le second du vapeur"]),
        ("Que fait Marlow lors de sa visite finale en Europe ?",
         ["Il ment à celle qui attendait Kurtz",
          "Il révèle toute la vérité", "Il remet un rapport à la Compagnie",
          "Il refuse de la recevoir"]),
        ("Sur quelle expérience personnelle Conrad s'est-il appuyé ?",
         ["Un voyage au Congo en 1890",
          "Un séjour en Inde", "Une campagne militaire",
          "Un naufrage en Méditerranée"]),
    ],
)

TARTUFFE = dict(
    structure=[
        ["Acte I", "On parle de Tartuffe, il ne paraît pas. Madame Pernelle "
                   "le défend contre toute la maison ; Orgon revient."],
        ["Acte II", "Orgon veut donner Mariane à Tartuffe. Dorine résiste."],
        ["Acte III", "Tartuffe paraît enfin. Il se déclare à Elmire ; Damis "
                     "le dénonce et se fait chasser."],
        ["Acte IV", "La scène de la table : Orgon caché entend Tartuffe."],
        ["Acte V", "Tartuffe passe à l'attaque. Le dénouement vient du "
                   "Prince."],
    ],
    personnages=[
        ["Tartuffe", "Le faux dévot. Il ne paraît qu'au troisième acte."],
        ["Orgon", "Le maître de maison, aveuglé."],
        ["Elmire", "Sa femme, qui obtient la preuve par la ruse."],
        ["Madame Pernelle", "La mère d'Orgon, dernière à se rendre."],
        ["Dorine", "La suivante, qui dit tout haut ce que la maison pense."],
        ["Cléante", "Le beau-frère, porteur de la parole raisonnable."],
        ["Damis et Mariane", "Les enfants d'Orgon."],
        ["Valère", "Le fiancé de Mariane."],
    ],
    lieux=["La maison d'Orgon, lieu unique de la pièce"],
    moments=[
        "L'exposition : la maison jugée par Madame Pernelle",
        "« Et Tartuffe ? — Le pauvre homme ! »",
        "L'entrée de l'imposteur et la déclaration à Elmire",
        "La dénonciation de Damis, et la donation qui la punit",
        "La scène de la table : Orgon entend enfin",
        "Le retournement du dénouement, par l'intervention du Prince",
    ],
    qcm=[
        ("À quel acte Tartuffe paraît-il pour la première fois ?",
         ["À l'acte III", "À l'acte I", "À l'acte II", "À l'acte IV"]),
        ("Que répond Orgon quand on lui parle de sa famille malade ?",
         ["« Et Tartuffe ? — Le pauvre homme ! »",
          "« Je m'en moque »", "« Qu'on aille chercher le médecin »",
          "« Cela ne me regarde pas »"]),
        ("Comment Elmire obtient-elle la preuve de l'imposture ?",
         ["En cachant Orgon sous une table pendant qu'elle reçoit Tartuffe",
          "En produisant une lettre", "En appelant un témoin",
          "En interrogeant Dorine"]),
        ("Qui est Dorine ?",
         ["La suivante, qui dit tout haut ce que la maison pense",
          "La fille d'Orgon", "La mère d'Orgon", "La femme d'Orgon"]),
        ("Que fait Orgon après la dénonciation de Damis ?",
         ["Il chasse son fils et donne ses biens à Tartuffe",
          "Il chasse Tartuffe", "Il ne fait rien",
          "Il convoque un notaire pour se protéger"]),
        ("D'où vient le dénouement ?",
         ["De l'intervention du Prince", "D'un aveu de Tartuffe",
          "D'un revirement de Madame Pernelle", "De la fuite de Tartuffe"]),
    ],
)

SAUVAGES = dict(
    structure=[
        ["« Comme introduction » (p. 7)", "Un exorde d'une centaine de mots, "
                                          "entre guillemets, avant le poème."],
        ["Le deuil d'une amie", "Le premier temps : Henrike Grohs, la plage, "
                                "les balles, le corps du poète atteint."],
        ["Le deuil de tous", "L'élargissement : la liste des villes frappées, "
                             "sur trois continents."],
        ["Le « nous »", "Le passage du je au nous : ceux qui restent se "
                        "rassemblent."],
        ["L'espérance", "Le dernier temps : la négation de la liste, l'appel, "
                        "le refus du dernier mot laissé à la violence."],
    ],
    personnages=[
        ["Le « je »", "Le poète. Il pleure, puis accuse, puis promet."],
        ["Henrike Grohs", "L'amie tuée le 13 mars 2016, à qui le livre est "
                          "dédié."],
        ["Le « nous »", "Les vivants, les endeuillés."],
        ["Séry Bailly", "Le dédicataire du volume, distinct de la personne "
                        "dont le poème porte le deuil."],
    ],
    lieux=["Grand-Bassam et sa plage",
           "Les villes de la liste, sur trois continents",
           "Le corps du poète, lieu du poème"],
    moments=[
        "L'exorde placé avant le poème",
        "L'annonce de la mort : « il fait si froid dans le soleil »",
        "L'énumération des crimes et des villes",
        "Le passage du « je » au « nous »",
        "La reprise de la liste, précédée d'une négation",
        "L'appel final",
    ],
    qcm=[
        ("À quel événement le poème répond-il ?",
         ["L'attentat de Grand-Bassam, le 13 mars 2016",
          "Une guerre civile", "Un accident", "Une catastrophe naturelle"]),
        ("À qui le livre est-il dédié ?",
         ["À Séry Bailly, et pour Henrike Grohs",
          "À l'auteur lui-même", "À la Côte d'Ivoire", "À aucun"]),
        ("Quelle particularité formelle frappe dès la première ligne ?",
         ["Ni majuscules ni ponctuation régulière",
          "Des rimes suivies", "Des strophes de quatre vers",
          "Des alexandrins"]),
        ("Que devient le « je » au cours du poème ?",
         ["Il devient un « nous »", "Il disparaît",
          "Il devient un « tu »", "Il reste inchangé"]),
        ("Qu'est-ce qui revient deux fois dans le livre, la seconde fois "
         "précédé d'une négation ?",
         ["La liste des villes frappées", "Le prénom de l'amie",
          "L'exorde", "Le mot « brousse »"]),
        ("Quel est le genre revendiqué par l'ouvrage ?",
         ["Un poème au long cours, d'un seul tenant",
          "Un recueil de sonnets", "Un récit en prose",
          "Une pièce de théâtre"]),
    ],
)

STANCES = dict(
    structure=[
        ["« Au lecteur »", "Le poème liminaire : le meilleur ne sera pas lu."],
        ["Stances — La Vie intérieure (22 poèmes)",
         "Le temps, la mémoire, l'habitude, le doute, la poésie."],
        ["Stances — Jeunes filles (16 poèmes)",
         "L'amour naissant, l'attente, la séparation, la mort."],
        ["Stances — Femmes (19 poèmes)",
         "La femme comme énigme, du premier homme aux Vénus antiques."],
        ["Stances — Mélanges (36 poèmes)",
         "La nature, la mer, le travail, la mythologie, le ciel."],
        ["Poèmes (15 pièces)",
         "Les pièces longues et suivies. Le volume se ferme sur « Je me "
         "croyais poète »."],
    ],
    personnages=[
        ["Le « je »", "Le poète : confident, amoureux, observateur, puis "
                      "accusé de lui-même."],
        ["Le « tu » aimé", "Une femme jamais nommée, qui ne parle pas."],
        ["La Mémoire", "Une puissance à qui l'on parle, tour à tour "
                       "secourable et muette."],
        ["Le savant", "L'astronome, le géomètre. Il a raison, et cela ne "
                      "suffit pas."],
        ["Le lecteur", "Interpellé au seuil du livre et à sa dernière page."],
    ],
    lieux=["Le vase, le berceau, le nid : les objets qui parlent",
           "Le ciel étoilé et la mer bretonne",
           "Le livre lui-même, objet de ses deux poèmes-cadres"],
    moments=[
        "L'aveu liminaire : « Mes vrais vers ne seront pas lus »",
        "Le vase fêlé, et le cœur qu'il figure",
        "Le meilleur moment des amours, avant l'aveu",
        "Le premier homme seul, et l'apparition de la femme",
        "Le lever du soleil expliqué par la science",
        "Le vœu final : que le poème renaisse dans un autre cœur",
    ],
    qcm=[
        ("Combien de poèmes le recueil compte-t-il ?",
         ["Cent huit", "Cinquante-quatre", "Vingt", "Deux cents"]),
        ("Que signifie le mot « stances » dans le titre ?",
         ["Des strophes régulières formant chacune une unité de sens",
          "Des poèmes tristes", "Des poèmes d'amour",
          "Des poèmes sans rime"]),
        ("Quel poème du recueil est resté le plus célèbre ?",
         ["« Le Vase brisé »", "« Intus »", "« La Femme »",
          "« Le Lever du soleil »"]),
        ("Que dit le poète au lecteur, dès le seuil du livre ?",
         ["Que ses vrais vers ne seront pas lus",
          "Qu'il a tout dit", "Qu'il écrit pour la gloire",
          "Qu'il n'écrira plus"]),
        # Cette question portait sur « Le Lever du soleil » — que le carnet
        # de bord fait déjà relever ligne à ligne. Le QCM final teste ici ce
        # qu'aucune autre rubrique ne demande : la composition du volume.
        ("Combien de sections les « Stances » comptent-elles, avant la "
         "partie « Poèmes » ?",
         ["Quatre : La Vie intérieure, Jeunes filles, Femmes, Mélanges",
          "Trois", "Cinq", "Six"]),
        ("Sur quel souhait le recueil se referme-t-il ?",
         ["Que le poème renaisse dans un autre cœur",
          "Que la gloire vienne", "Que le poète se taise",
          "Que le lecteur juge"]),
    ],
)

BALAFON = dict(
    structure=[
        ["« Mappemonde » (1961) et « Lettres à mes amis »",
         "Le premier ensemble : l\u2019Afrique écrit aux continents. « À "
         "Kong-Fu-Tseu » (l\u2019Asie), « À Roland-Roger » (l\u2019Europe), "
         "« Moteczuma » (l\u2019Amérique précolombienne), « Lettre collective », "
         "« Dépaysement », « Ostende-Douvre », « Marcinelle, 1956 »."],
        ["« Cette terre des hommes »",
         "Le second ensemble, annoncé par un titre en capitales juste avant "
         "« New York » : « New York » (1970), « Moscou » (1971), « Adamawa » "
         "(1959), « Tu reviendras, Sénégal ! » (1971), « Épiphanie » (1962)."],
        ["Les pièces finales",
         "« Pentecôte sur l\u2019Afrique » (1964), « Mère » (1964), la "
         "« Postface », et « Offrande » (1963), qui ferme le volume sur la "
         "marmite d\u2019argile et les mains de Dieu."],
    ],
    personnages=[
        ["Le « je »", "Le poète : voyageur, témoin, orant. Il est celui qui "
                      "écrit des lettres et celui qui apporte l\u2019offrande."],
        ["Les destinataires", "Kong-Fu-Tseu, Roland-Roger, Moteczuma : des "
                              "noms propres qui valent pour des continents. "
                              "Chaque poème est adressé."],
        ["Le « nous »", "L\u2019Afrique, les peuples, les tribus rassemblées. Le "
                        "passage du je au nous est un moment à repérer dans "
                        "chaque poème."],
        ["La Mère", "L\u2019Afrique et la Vierge en une seule figure : « Je te "
                    "nomme MÈRE »."],
        ["Le Seigneur", "Le destinataire des dernières pièces. « Épiphanie » "
                        "et « Offrande » sont des poèmes d\u2019offrande."],
    ],
    lieux=["Les continents auxquels le recueil écrit : Asie, Europe, "
           "Amérique précolombienne",
           "Marcinelle, ville minière de Belgique",
           "New York et Moscou, les deux capitales de la Guerre froide",
           "L\u2019Adamaoua, les Sarés, la savane des pasteurs",
           "Les royaumes anciens : Koumbi-Salé, le Ghana, Couschân"],
    moments=[
        "L\u2019ouverture : l\u2019Afrique écrit à l\u2019Asie",
        "L\u2019Europe interpellée, des négriers aux cloches de France",
        "Marcinelle : les chœurs, le deuil des mineurs, la demande de paix",
        "New York et Moscou : le regard africain sur les deux blocs",
        "L\u2019Adamaoua : le réveil des pasteurs et des troupeaux",
        "L\u2019offrande finale : l\u2019or apporté au Seigneur, puis la marmite "
        "d\u2019argile",
    ],
    qcm=[
        ("Combien de poèmes Balafon rassemble-t-il ?",
         ["Seize", "Dix", "Vingt-quatre", "Trente"]),
        ("Qu\u2019est-ce qu\u2019un balafon, et pourquoi ce titre ?",
         ["Un instrument de musique, présenté comme véhicule du plaisir et de "
          "la parole", "Un tambour de guerre", "Un chant funèbre",
          "Le nom d\u2019un village"]),
        ("À qui s\u2019adresse le premier poème du recueil ?",
         ["À Kong-Fu-Tseu, c\u2019est-à-dire à l\u2019Asie", "À l\u2019Europe",
          "À Dieu", "À sa mère"]),
        ("Que rappelle le poème « Marcinelle, 1956 » ?",
         ["Une catastrophe minière en Belgique", "Une bataille",
          "Une famine", "Un pèlerinage"]),
        ("En quelle année Balafon a-t-il été publié ?",
         ["1972", "1956", "1964", "1995"]),
        ("Quelles sont les deux sources que le paratexte reconnaît au "
         "recueil ?",
         ["Africaine et chrétienne", "Grecque et latine",
          "Orale et écrite", "Française et anglaise"]),
    ],
)

PAR_CAHIER = {
    "vieuxnegre": VIEUXNEGRE,
    "lionperle": LIONPERLE,
    "ngum": NGUM,
    "capitoline": CAPITOLINE,
    "tenebres": TENEBRES,
    "tartuffe": TARTUFFE,
    "sauvages": SAUVAGES,
    "stances": STANCES,
    "balafon": BALAFON,
}


def donnees(cle):
    return PAR_CAHIER.get(cle)


# ═════════════════════════════ SECTIONS DE SYNTHÈSE ABSENTES D'UN CAHIER RELU
# Huit cahiers sur neuf possèdent, entre les six séquences et les axes, une
# étude des personnages, une étude des lieux et un schéma narratif. Le cahier
# relu de « Capitoline » ne les avait pas : sans elles, rien ne sépare les
# séquences des axes, et le plan plaçait « J'interprète l'œuvre » avant « Je
# lis et j'analyse » — on demandait d'interpréter le roman avant de l'avoir lu.
#
# Ce qui suit est relevé dans le roman, comme le reste du module.


def _capitoline_synthese():
    return [
        ("saut",),
        ("h2", "5 bis. Étude des personnages"),
        ("p", "Le roman n'a pas de héros isolé : il a des familles. Chaque "
              "personnage y tient une place que le tableau ci-dessous "
              "rappelle, et que l'étude doit démontrer sur le texte, "
              "citation à l'appui."),
        ("grille", [
            ["Personnage", "Ce que l'étude doit établir"],
            ["Mathieu Belibi",
             "Qu'il est défini d'abord par un manque — « père inconnu » sur "
             "son acte de naissance — et qu'il passe le roman à chercher une "
             "appartenance : celle du village de sa mère, qui la lui refuse ; "
             "celle du travail, à Douala ; celle du mariage, que deux "
             "familles lui interdisent. Montrer que sa mort le rend enfin à "
             "un village, mais mort."],
            ["Capitoline Ida Petnga",
             "Qu'elle donne son nom au roman sans en être le sujet : elle est "
             "ce que Mathieu veut, et ce que les deux tribus se disputent. "
             "Montrer que ses refus successifs sont d'abord de la prudence — "
             "elle sait ce qu'un mariage hors de la tribu coûte — avant "
             "d'être de la coquetterie."],
            ["Sophie Mbezele",
             "Qu'elle n'est presque jamais montrée en train de parler, et "
             "que le roman lui prête pourtant l'acte décisif. Montrer "
             "comment le texte construit son hostilité par petites touches, "
             "jusqu'au plat qu'elle prépare et fait insister, « sûre de son "
             "fait ». Elle reproduit contre Capitoline le geste que le "
             "village avait eu contre l'enfant de Méléna."],
            ["Médard Balingué",
             "Que le père retrouvé ne répare rien : il arrive trop tard dans "
             "le récit, et c'est chez lui, au moment où il fête un fils "
             "enfin reconnu, que le roman s'arrête sur « La fête avait "
             "commencé ». Montrer ce que ce décalage produit."],
            ["Le père de Capitoline",
             "Qu'il est le pendant exact de Sophie Mbezele : même exigence, "
             "autre tribu. Il veut « un gendre bamiléké, de préférence "
             "bafang ». Montrer que le roman refuse d'attribuer le préjugé à "
             "un seul camp."],
            ["Jacqueline Aboui, dite maman Song' Lina",
             "Qu'elle est la seule à donner à Mathieu un nom à lui — "
             "« Manos ». Montrer ce qu'un surnom fait à un personnage dont "
             "l'état civil porte un blanc."],
            ["Tamar",
             "Qu'elle est l'adjuvant du récit : c'est par elle que la lettre "
             "est lue et que la rencontre a lieu. Montrer qu'elle est aussi "
             "la seule voix qui invite Capitoline à écouter ce qu'elle "
             "éprouve plutôt que ce qu'on attend d'elle."],
            ["Pascal Sil et papa Malin",
             "Qu'ils servent au roman à faire entendre les mots ordinaires "
             "du classement : l'ami désigné par son origine, le joueur de "
             "dames désigné par la sienne. Montrer que ces mots sont dits "
             "sans haine — et que c'est précisément la démonstration du "
             "roman."],
            ["Maman Rose",
             "Qu'un accident de train, entre Édéa et Éséka, suffit à "
             "retarder la nouvelle. Montrer comment ce retard rend possible "
             "la dernière phrase du roman."],
        ]),
        ("encadre", "astuce", "Comment se servir de ce tableau", [
            "Il ne se recopie pas : chaque ligne est une **thèse à prouver**. "
            "Prenez-en une, cherchez trois passages qui la soutiennent, et "
            "vous avez le premier tiers d'un commentaire.",
            "Une ligne que vous ne parvenez pas à prouver est une ligne à "
            "discuter en classe : le tableau propose une lecture, il ne la "
            "décrète pas.",
        ]),
        ("saut",),
        ("h2", "5 ter. Étude des lieux"),
        ("p", "La géographie du roman n'est pas un décor : c'est un système. "
              "Chaque lieu vaut par ce qu'il autorise et ce qu'il interdit."),
        ("grille", [
            ["Lieu", "Valeur dans le récit"],
            ["Elig-Belibi, quartier de Yaoundé",
             "L'origine, et le lieu du refus. C'est là que naît la mention "
             "« père inconnu », là que le village refuse la sépulture. "
             "Le point de départ est déjà une exclusion."],
            ["Douala — Akwa, Nkomondo, Kassalafam, New-Bell, Nylon, le port",
             "La ville de l'espoir et du travail : cinq mois de recherche, "
             "puis l'embauche chez Chanas, à Akwa. C'est la ville où l'on "
             "peut devenir quelqu'un — et celle où l'on meurt."],
            ["Le bar du père de Capitoline",
             "Le seul lieu où les deux mondes se croisent avant le drame. "
             "On y sert, on y regarde, on y refuse."],
            ["Bandou-mka, dans le Haut-Nkam, près de Bafang",
             "Le village du père de Capitoline : la tribu comme exigence, "
             "énoncée à distance et sans appel."],
            ["Bilanga-Kombé, village de Médard Balingué",
             "Le village du père retrouvé, et le lieu de la fête finale. "
             "Le roman s'y termine, sur des gens qui ne savent pas encore."],
            ["La route Douala-Yaoundé par Kikot, et la voie ferrée",
             "Les chemins du roman, et ses accidents. C'est par eux que le "
             "corps revient et que la nouvelle n'arrive pas."],
        ]),
        ("saut",),
        ("h2", "5 quater. Schéma narratif"),
        ("p", "Le roman n'est pas divisé en chapitres numérotés. Le tableau "
              "ci-dessous établit les cinq moments du récit, tels que le "
              "texte les enchaîne — c'est un repère de lecture, non une "
              "division imprimée dans le livre."),
        ("grille", [
            ["Étape", "Contenu"],
            ["Situation initiale",
             "Mathieu grandit à Elig-Belibi auprès de sa mère. Son acte de "
             "naissance porte « père inconnu ». Il se croit éwondo."],
            ["Élément perturbateur",
             "Son premier enfant meurt ; le village refuse de l'enterrer. "
             "L'exclusion cesse d'être une idée pour devenir une expérience."],
            ["Péripéties",
             "Le départ pour Douala ; cinq mois de recherche, puis l'embauche "
             "chez Chanas ; le jeu de dames à Kassalafam ; la lettre à "
             "Capitoline et la rencontre ; l'opposition des deux familles."],
            ["Dénouement",
             "Le plat préparé par Sophie Mbezele pour Capitoline. Au matin, "
             "c'est Mathieu qui souffre ; il meurt dans la journée."],
            ["Situation finale",
             "Le corps repart de Douala « allongé dans une longue caisse de "
             "bois rouge ». Au village du père, où l'on ne sait rien encore, "
             "« la fête avait commencé »."],
        ]),
        ("encadre", "vigilance", "Ce que le roman ne dit pas", [
            "Le mot **poison** n'est écrit nulle part. Le roman montre un "
            "plat destiné à Capitoline, une mère « sûre de son fait », et "
            "Mathieu mort au matin — et il laisse le lecteur conclure.",
            "Écrire « Sophie Mbezele empoisonne Capitoline » est donc une "
            "faute de lecture doublée d'une faute de fait : le plat n'était "
            "pas pour Mathieu, et c'est lui qui meurt. Toute la force de la "
            "fin tient dans cet écart.",
        ]),
    ]


SYNTHESE_ABSENTE = {"capitoline": _capitoline_synthese}
