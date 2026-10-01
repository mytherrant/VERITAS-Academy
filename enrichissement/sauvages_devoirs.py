# -*- coding: utf-8 -*-
"""
Devoirs conformes au format MINESEC — « Poèmes sauvages », Henri N'koumo.

Deux devoirs pour une classe de seconde :

  * n° 1 — épreuve blanche de littérature, quatre heures, trois sujets au
    choix (contraction et discussion ; dissertation ; commentaire composé),
    notés sur dix-huit points, les deux derniers allant à la présentation ;
  * n° 2 — devoir surveillé de deux heures sur le passage où le « je » du
    poème devient « nous ».

Le sujet I n'est pas écrit ici : il est construit à partir du support verbatim
déclaré dans `contractions.py` — trois réponses de l'auteur dans l'entretien
publié en annexe du volume. Le corrigé correspondant vient de
`contractions_corriges.py`.
"""
import contractions
import contractions_corriges
import sauvages_extraits as X

CONSIGNE = ("L'usage du dictionnaire n'est pas autorisé. Le devoir est noté sur dix-huit "
            "points ; les deux points restants récompensent la présentation de la copie — "
            "propreté, lisibilité, paragraphes nettement séparés. Le candidat indiquera "
            "clairement en tête de copie le numéro du sujet choisi.")

DEVOIR1 = dict(
    titre="Devoir n° 1 — Épreuve blanche de littérature (classe de seconde)",
    entete=[
        ["Établissement", "Centre VÉRITAS — composition de fin de séquence"],
        ["Épreuve", "Français — littérature"],
        ["Classe", "Seconde, toutes séries"],
        ["Durée", "4 heures"],
        ["Consigne générale", "Le candidat traite **un seul** des trois sujets proposés."],
    ],
    consigne_generale=CONSIGNE,
    sujets=[
        # Remplacé à la construction par le support verbatim ; posé ici pour que
        # le module reste juste même lu seul.
        contractions.sujet_contraction("sauvages"),
        dict(
            num="Sujet II — Dissertation littéraire",
            bareme="Compréhension / Pertinence : 6 — Organisation / Cohérence : 6 — Correction de l’expression : 6 — Originalité de la production : 2"
                   "Présentation : 2",
            support=None,
            source_support=None,
            consignes=[
                "Un lecteur affirme : « On n'écrit pas un poème sur un massacre : on se "
                "tait. »",
                "**Commentez et discutez cette prise de position** en vous appuyant sur "
                "Poèmes sauvages éclairés au feu de brousse et sur les œuvres que vous avez "
                "lues ou étudiées.",
            ],
        ),
        dict(
            num="Sujet III — Commentaire composé",
            bareme="Compréhension : 6 — Organisation des idées : 6 — Langue et style : 6 — Présentation de la copie : 2"
                   "Présentation : 2",
            support=X.S4,
            source_support=X.REFERENCES["S4"],
            disposition="vers",
            consignes=[
                "**Sans dissocier le fond de la forme, vous ferez de ce texte un commentaire "
                "composé.** En vous appuyant sur les temps verbaux, les figures de style, la "
                "longueur des vers et les répétitions, vous montrerez, entre autres, comment "
                "le retour d'un souvenir ordinaire constitue une réponse à ceux qui ont "
                "tué.",
                "Le plan comportera deux axes, annoncés à la fin de l'introduction, et "
                "comprenant chacun deux sous-parties.",
            ],
        ),
    ],
)

DEVOIR1_CORRIGE = dict(
    titre="Devoir n° 1 — Corrigé et grilles d'évaluation",
    intro="Corrigé présenté selon le modèle des corrigés nationaux : thème, thèse, "
          "structure, proposition, grille chiffrée. Les indications sont rédigées à la "
          "troisième personne, à l'usage du correcteur.",
    sujets=[
        contractions_corriges.corrige_contraction("sauvages"),
        dict(
            num="Corrigé du sujet II — Dissertation",
            blocs=[
                ("Analyse du sujet",
                 "L'affirmation oppose l'écriture au silence devant l'horreur. Elle suppose "
                 "qu'écrire sur un massacre serait indécent — soit parce qu'on en tirerait "
                 "un profit littéraire, soit parce qu'aucune forme ne serait à la hauteur. "
                 "Le candidat doit examiner cette objection avant de la discuter : une copie "
                 "qui la balaie d'emblée manque le sujet."),
                ("Problématique attendue",
                 "Écrire sur un massacre est-il une trahison de ses victimes, ou la seule "
                 "manière de ne pas les abandonner ?"),
                ("Plan possible — première partie", [
                    "**Thèse : le silence se défend.** Écrire, c'est mettre en forme, donc "
                    "rendre supportable ; c'est aussi se servir d'un malheur qui n'est pas "
                    "le sien. Le poème lui-même connaît cette gêne : il se dit « écorché "
                    "vif », « enflé de morves », et refuse toute élégance dans les pages qui "
                    "suivent l'attentat.",
                    "On créditera la copie qui remarque que N'koumo n'écrit pas immédiatement "
                    "après l'attentat : le livre paraît en 2022, six ans après les faits.",
                ]),
                ("Plan possible — seconde partie", [
                    "**Antithèse : le silence abandonne les morts aux chiffres.** Un "
                    "communiqué dit « dix-neuf morts » ; le poème dit « Henrike », plus de "
                    "vingt fois, et lui rend un rire, un balcon, une mosquée « si belle et "
                    "si bleue ».",
                    "Le poème fait en outre ce qu'aucun discours ne fait : il met Paris et "
                    "Maïduguri dans le même vers, sans virgule. L'égalité des deuils y est "
                    "obtenue par la seule disposition des mots.",
                ]),
                ("Plan possible — dépassement", [
                    "**Ce n'est pas écrire qui est en cause, c'est la manière.** Le poème "
                    "n'explique pas, ne console pas, ne conclut pas : il appelle. Sa "
                    "dernière page ne contient que « viens », quatre fois. Un devoir qui "
                    "parvient à cette distinction — entre l'écriture qui exploite et "
                    "l'écriture qui accompagne — sera valorisé.",
                    "On accordera la note maximale à la copie qui appuie chaque affirmation "
                    "sur une citation courte et analysée, même si le plan diffère de "
                    "celui-ci.",
                ]),
                ("Grille d'évaluation — Sujet II", None),
            ],
            grille=[
                ["Critère", "Indicateurs", "Points"],
                ["C1 — Compréhension / Pertinence",
                 "Le candidat reçoit 6 pts : si l'objection du silence est prise au sérieux "
                 "avant d'être discutée, et si la réponse s'appuie sur l'œuvre. 4 pts : si "
                 "le sujet est compris mais traité par affirmations. 2 pts : si la copie "
                 "raconte le livre. 0 pt : hors sujet.", "6"],
                ["C2 — Organisation / Cohérence",
                 "Le candidat reçoit 6 pts : si l'introduction comporte ses trois étapes, si "
                 "les parties sont annoncées puis respectées, et si les transitions "
                 "existent. 4 pts : plan perceptible sans transitions. 2 pts : idées "
                 "juxtaposées.", "6"],
                ["C3 — Expression / Correction de la langue",
                 "Le candidat reçoit 6 pts : si la syntaxe est correcte, le lexique précis, "
                 "et si les citations de vers sont ponctuées selon l'usage — guillemets, "
                 "barre oblique, aucune majuscule ajoutée. 4 pts : fautes n'entravant pas la "
                 "lecture. 2 pts : fautes gênantes.", "6"],
                ["C4 — Présentation de la copie",
                 "Le candidat reçoit 2 pts : si la copie est propre, lisible, et si les "
                 "paragraphes sont nettement séparés. 1 pt : présentation irrégulière.",
                 "2"],
                ["**Total**", "", "**20**"],
            ],
            cloture="On restera ouvert à toute autre organisation pertinente. Les exemples "
                    "empruntés à d'autres œuvres — y compris à la poésie orale — seront "
                    "crédités dès lors qu'ils sont exacts et analysés.",
        ),
        dict(
            num="Corrigé du sujet III — Commentaire composé",
            blocs=[
                ("Situation du passage",
                 "Environ aux deux tiers du poème. La colère a été dite et l'énumération des "
                 "villes frappées achevée. Le texte se retourne vers le passé et fait "
                 "revivre une conversation entre le poète et Henrike Grohs, sur un balcon "
                 "d'Abidjan."),
                ("Problématique attendue",
                 "Comment le retour d'un souvenir ordinaire constitue-t-il la réponse la "
                 "plus forte du livre à ceux qui ont tué au nom d'une religion ?"),
                ("Premier axe — un poème qui s'enfonce", [
                    "Le verbe « s'enfoncer » employé trois fois en quelques vers : le "
                    "mouvement du texte va vers le bas.",
                    "L'opposition muette avec le mouvement d'une explosion, qui projette "
                    "vers le haut. Elle n'est jamais formulée : elle est portée par les "
                    "verbes.",
                    "L'image du harpon : le poème se donne pour une arme qui ramène, non qui "
                    "détruit.",
                    "Le refus de l'élégance : « mon poème enflera de morves », « mon poème "
                    "écorché vif ».",
                ]),
                ("Second axe — un souvenir qui répond", [
                    "La banalité du souvenir : un spectacle, un appartement, un balcon. "
                    "C'est cette banalité qui rend le passage insoutenable.",
                    "Le détail décisif : depuis le balcon, on voit « la mosquée du Plateau », "
                    "que Henrike trouve « si belle et si bleue ». Une Allemande admire une "
                    "mosquée d'Abidjan, et elle sera tuée au nom de l'islam. Le poème "
                    "n'ajoute aucun commentaire.",
                    "La reprise « si toi et si bleue », qui substitue « toi » à « belle » et "
                    "confond l'amie et le monument.",
                    "« je suis en toi », quatre fois, et le prénom posé seul sur une ligne : "
                    "la présence installée par la répétition.",
                    "L'impératif final adressé à la morte : « offre donc tes yeux aux "
                    "hurlements non corrompus ».",
                ]),
                ("Écueils à sanctionner", [
                    "Paraphrase suivie du texte, sans axe.",
                    "Traduction des images au premier degré (« il veut dire qu'il est "
                    "triste »).",
                    "Citation avec majuscule initiale ajoutée, ou ponctuation inventée : on "
                    "cite le vers tel qu'il est écrit.",
                    "Confusion entre l'auteur et le « je » du poème. On écrira « le poète » "
                    "ou « le locuteur ».",
                ]),
                ("Grille d'évaluation — Sujet III", None),
            ],
            grille=[
                ["Critère", "Indicateurs", "Points"],
                ["C1 — Compréhension / Pertinence",
                 "Le candidat reçoit 6 pts : si le passage est situé avec exactitude dans le "
                 "mouvement du livre, si les deux axes sont des thèses et non des intitulés "
                 "thématiques, et si aucune image n'est traduite au premier degré. 4 pts : "
                 "un axe seulement est construit. 2 pts : paraphrase.", "6"],
                ["C2 — Organisation / Cohérence",
                 "Le candidat reçoit 6 pts : si l'introduction comporte situation, "
                 "problématique et annonce, si chaque axe compte deux sous-parties, et si la "
                 "conclusion répond à la problématique. 4 pts : une étape manque.", "6"],
                ["C3 — Analyse des citations",
                 "Le candidat reçoit 6 pts : si chaque sous-partie s'appuie sur deux "
                 "citations courtes, chacune suivie d'un procédé nommé et d'une "
                 "interprétation. 4 pts : citations exactes mais peu analysées. 2 pts : "
                 "citations juxtaposées ou inexactes.", "6"],
                ["C4 — Présentation de la copie",
                 "Le candidat reçoit 2 pts : si la copie est propre et lisible, et si les "
                 "citations de vers sont ponctuées selon l'usage — guillemets, barre oblique "
                 "entre deux vers, aucune majuscule ajoutée. 1 pt : usage irrégulier.",
                 "2"],
                ["**Total**", "", "**20**"],
            ],
            cloture="On insistera tout particulièrement sur l'exploitation par le candidat "
                    "des procédés de style, les éléments du vocabulaire, la syntaxe, etc., "
                    "dans ses démonstrations et autres illustrations. On restera également "
                    "ouvert à toute autre interprétation pertinente du texte par le "
                    "candidat.",
        ),
    ],
)


DEVOIR2 = dict(
    titre="Devoir n° 2 — Devoir surveillé de contrôle (2 heures)",
    entete=[
        ["Nature", "Devoir de contrôle en cours d'étude de l'œuvre"],
        ["Classe", "Seconde, toutes séries"],
        ["Durée", "2 heures"],
        ["Support", "Le passage où le « je » du poème devient « nous »"],
        ["Barème", "Questions : 12 points — Production écrite : 8 points"],
    ],
    consigne_generale="Ce devoir se place après l'étude des fiches 1 à 3. Il vérifie que "
                      "les outils du texte poétique sont acquis — vers, verset, strophe, "
                      "anaphore, comparaison, énonciation — avant l'épreuve longue de "
                      "quatre heures. Les réponses aux questions seront rédigées : un relevé "
                      "sans phrase ne vaut que la moitié des points.",
    support=X.S3,
    source_support=X.REFERENCES["S3"],
    disposition="vers",
    questions=[
        ("I. Compréhension du texte (4 points)", [
            "**1.** À qui le poète s'adresse-t-il dans ce passage ? Justifiez votre réponse "
            "en citant le texte. **(2 pts)**",
            "**2.** Situez ce passage dans le mouvement du livre : que s'est-il passé avant, "
            "et qu'annonce-t-il ? **(2 pts)**",
        ]),
        ("II. Étude de la langue et des procédés (8 points)", [
            "**3.** Relevez les deux premiers vers, puis le troisième. a) Quel pronom "
            "domine les deux premiers ? b) Quel pronom domine le troisième ? c) Que produit "
            "ce changement ? **(2 pts)**",
            "**4.** « et nous sommes / Henrike / un nuage poilu plus agressif qu'un piment "
            "de grand âge ». a) Combien de mots compte le vers du milieu ? b) Qu'est-ce que "
            "sa place fait à la phrase ? c) Comment appelle-t-on le fait de s'adresser "
            "directement à quelqu'un ? **(2 pts)**",
            "**5.** Comptez les vers qui commencent par « et ». a) Donnez le nombre exact. "
            "b) Quelle est la fonction habituelle de ce mot en grammaire ? c) Quelle "
            "fonction prend-il ici ? **(2 pts)**",
            "**6.** « immenses couteaux habillés d'ailes fort alertes comme les sourates et "
            "versets qui nous éclairent à contre-jour ». a) Relevez le mot de comparaison. "
            "b) Quels sont les trois éléments rapprochés ? c) Que signifie « éclairer à "
            "contre-jour », et que reproche le poème exactement ? **(2 pts)**",
        ]),
        ("III. Production écrite (8 points)", [
            "**7.** Rédigez entièrement l'introduction et le premier axe du commentaire "
            "composé de ce texte. L'axe portera sur le passage du « je » au « nous », et "
            "comportera au minimum trois citations, chacune suivie de son analyse. Vous ne "
            "rédigerez ni le second axe ni la conclusion. **(8 pts)**",
        ]),
    ],
)

DEVOIR2_CORRIGE = dict(
    titre="Devoir n° 2 — Corrigé et barème détaillé",
    reponses=[
        ("1. Le destinataire (2 pts)",
         "Le candidat reçoit 2 pts s'il indique que le poète s'adresse à Henrike Grohs, son "
         "amie tuée le 13 mars 2016, et s'il cite le vers où le prénom est posé seul : "
         "« Henrike ». 1 pt pour l'identification sans citation. On valorisera le candidat "
         "qui remarque que la morte reste le destinataire alors même que le sujet du poème "
         "est devenu « nous »."),
        ("2. Situation du passage (2 pts)",
         "Le passage se place après le deuil personnel (premières pages) et après "
         "l'élargissement à toutes les villes frappées. Il annonce la partie où le « nous » "
         "portera les promesses de la fin. 2 pts pour les deux bornes, 1 pt pour une seule. "
         "On acceptera toute formulation équivalente du mouvement en trois temps."),
        ("3. Le changement de pronom (2 pts)",
         "a) Les deux premiers vers sont au singulier : « la grande faim de mon visage », "
         "« mon corps entier ». b) Le troisième vers change de sujet : « et nous sommes ». "
         "c) Le poème quitte le deuil privé pour le deuil commun : la douleur d'un homme "
         "devient celle d'un groupe. 1 pt pour le relevé, 1 pt pour l'effet."),
        ("4. Le vers isolé (2 pts)",
         "a) Un seul mot. b) Placé entre « et nous sommes » et « un nuage poilu », il coupe "
         "la phrase en deux et oblige le lecteur à s'arrêter au milieu d'une proposition ; "
         "dans un poème fait de versets de plusieurs lignes, un vers d'un mot est un "
         "événement. c) Une apostrophe. 1 pt pour l'analyse de la coupure, 1 pt pour le "
         "terme exact. On valorisera le candidat qui relie cette coupure à la mort "
         "elle-même, qui interrompt."),
        ("5. L'anaphore du « et » (2 pts)",
         "a) Neuf vers sur dix-neuf. On acceptera un écart d'une unité. b) En grammaire, "
         "« et » est une conjonction de coordination : elle relie des mots de même nature ou "
         "des groupes de même fonction. c) Ici, elle ouvre les vers : elle ne relie plus, "
         "elle relance. Elle donne le rythme, elle enchaîne les images sans les hiérarchiser, "
         "et elle empêche le poème de s'arrêter. 1 pt pour le compte, 1 pt pour la "
         "fonction."),
        ("6. La comparaison des couteaux (2 pts)",
         "a) « comme ». b) Trois éléments : les couteaux, les ailes d'oiseaux, les sourates "
         "et versets. c) Éclairer à contre-jour, c'est éclairer par-derrière, si bien qu'on "
         "ne distingue plus rien. Le poème ne s'en prend donc pas aux textes sacrés "
         "eux-mêmes, mais à une lumière mal placée, qui aveugle au lieu de montrer. 1 pt "
         "pour le relevé, 1 pt pour l'interprétation. On sanctionnera la copie qui conclut "
         "que le poème attaque l'islam : c'est un contresens que le texte ne soutient pas."),
        ("7. Production écrite (8 pts)", None),
    ],
    grille_prod=[
        ["Critère", "Indicateurs", "Points"],
        ["Introduction",
         "Le candidat reçoit 2 pts : si l'introduction comporte les trois étapes — situation "
         "du passage dans le mouvement du livre, problématique, annonce de l'axe. 1 pt : si "
         "une étape manque. 0 pt : si elle se réduit à une présentation de l'auteur.",
         "2"],
        ["Pertinence de l'axe",
         "Le candidat reçoit 2 pts : si l'axe est formulé comme une thèse (« le moment où "
         "le deuil privé devient collectif »). 1 pt : si l'axe se réduit à un intitulé "
         "thématique du type « les pronoms ».",
         "2"],
        ["Analyse des citations",
         "Le candidat reçoit 3 pts : si trois citations au moins sont intégrées, suivies "
         "d'un procédé nommé et d'une interprétation. 2 pts : si l'une n'est pas analysée. "
         "1 pt : citations juxtaposées.",
         "3"],
        ["Langue",
         "Le candidat reçoit 1 pt : si la syntaxe est correcte et si les citations de vers "
         "sont ponctuées selon l'usage — guillemets, barre oblique entre deux vers, aucune "
         "majuscule ajoutée.",
         "1"],
        ["**Total**", "", "**8**"],
    ],
    cloture="On restera ouvert à toute autre interprétation pertinente. Un axe non prévu au "
            "corrigé mais correctement démontré sera pleinement crédité.",
)

ENCADRES_DEVOIRS = [
    ("methode", "Citer un vers libre", [
        "Un poème sans ponctuation ne se cite pas comme une phrase de roman. Quatre règles, "
        "qui valent des points à chaque devoir :",
        "- **On cite tel quel.** Aucune majuscule ajoutée au début, aucun point ajouté à la "
        "fin : « il fait si froid dans le soleil ».",
        "- **La barre oblique marque la fin du vers** : « il fait si froid dans le soleil / "
        "si froid dans mes mots ».",
        "- **Un verset trop long se coupe avec des crochets** : « et mes yeux à moi "
        "s'éteignent […] comme des allumettes de minuit ». Ne coupez jamais sans le "
        "signaler.",
        "- **Le vers d'un seul mot se cite seul** : « Henrike ». C'est un vers, et il se "
        "traite comme tel.",
    ]),
    ("vigilance", "Les trois erreurs qui coûtent le plus cher", [
        "- **Confondre l'auteur et le « je ».** Écrivez « le poète » ou « le locuteur », et "
        "réservez « N'koumo » à ce qui relève de la construction du livre : le choix du "
        "titre, le découpage en trois temps, la reprise de la liste de villes à la fin.",
        "- **Traduire les images.** « Le poète veut dire que… » est la formule à bannir. "
        "Nommez les deux termes rapprochés, puis dites ce que le rapprochement fait voir.",
        "- **Croire que le poème attaque une religion.** C'est le contresens le plus grave "
        "sur cette œuvre. Le texte s'en prend aux « fous de dieu » et aux « assassins des "
        "livres millénaires » — c'est-à-dire à ceux qui se servent des textes sacrés — et il "
        "annonce en même temps un avenir où « nous serons Coran et Bible et Torah ». Une "
        "copie qui écrit le contraire perd la totalité du critère de compréhension.",
    ]),
]
