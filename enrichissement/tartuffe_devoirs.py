# -*- coding: utf-8 -*-
"""
Devoirs conformes au format MINESEC — « Tartuffe », Molière.

Deux devoirs pour une classe de seconde :

  * n° 1 — épreuve blanche de littérature, quatre heures, trois sujets au
    choix (contraction et discussion ; dissertation ; commentaire composé),
    notés sur dix-huit points, les deux derniers allant à la présentation ;
  * n° 2 — devoir surveillé de deux heures sur la scène d'exposition.

Le sujet I n'est pas écrit ici : il est construit à partir du support
verbatim déclaré dans `contractions.py` (la préface que Molière a placée en
tête de sa pièce en 1669). Le corrigé correspondant vient de
`contractions_corriges.py`. Cela évite qu'un texte inventé se glisse dans une
épreuve, et garantit que le sujet et son corrigé ne divergent jamais.
"""
import contractions
import contractions_corriges
import tartuffe_extraits as X

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
        # Remplacé au moment de la construction par le support verbatim ; on le
        # pose ici pour que le module soit juste même lu seul.
        contractions.sujet_contraction("tartuffe"),
        dict(
            num="Sujet II — Dissertation littéraire",
            bareme="Compréhension / Pertinence : 6 — Organisation / Cohérence : 6 — Correction de l’expression : 6 — Originalité de la production : 2"
                   "Présentation : 2",
            support=None,
            source_support=None,
            consignes=[
                "Un professeur affirme : « On ne se moque bien que de ce que l'on connaît "
                "bien. »",
                "**Commentez et discutez cette affirmation** en vous appuyant sur Tartuffe "
                "de Molière et sur les œuvres que vous avez lues ou étudiées.",
            ],
        ),
        dict(
            num="Sujet III — Commentaire composé",
            bareme="Compréhension : 6 — Organisation des idées : 6 — Langue et style : 6 — Présentation de la copie : 2"
                   "Présentation : 2",
            support=X.E3,
            source_support=X.REFERENCES["E3"],
            consignes=[
                "**Sans dissocier le fond de la forme, vous ferez de ce texte un "
                "commentaire composé.** En vous appuyant sur les types de phrase, les "
                "figures de style, les temps verbaux, la ponctuation et les didascalies, vous "
                "montrerez, entre autres, comment cette première apparition dénonce le "
                "personnage avant qu'il ait rencontré ceux qu'il trompe.",
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
        contractions_corriges.corrige_contraction("tartuffe"),
        dict(
            num="Corrigé du sujet II — Dissertation",
            blocs=[
                ("Analyse du sujet",
                 "L'affirmation lie la moquerie à la connaissance. Elle suppose que la "
                 "satire suppose une observation exacte, et qu'un auteur qui se moque de ce "
                 "qu'il ignore manque sa cible. Le candidat doit donc examiner ce que "
                 "Molière connaissait de la fausse dévotion, et ce que sa pièce en montre."),
                ("Problématique attendue",
                 "La réussite d'une satire dépend-elle de la connaissance qu'a l'auteur de "
                 "ce dont il se moque ?"),
                ("Plan possible — première partie", [
                    "**Thèse : la moquerie exige la connaissance.** Molière ne caricature "
                    "pas la dévotion : il en connaît les objets (la haire, la discipline), "
                    "le vocabulaire (« le ciel », « les scrupules », « l'intention »), les "
                    "raisonnements (« on trouve avec lui des accommodements »).",
                    "C'est cette exactitude qui rend la pièce dangereuse pour ceux qu'elle "
                    "vise, et qui explique son interdiction pendant près de cinq ans.",
                    "On acceptera tout autre exemple exact : la satire de la médecine, celle "
                    "des précieuses, celle du bourgeois qui veut être noble.",
                ]),
                ("Plan possible — seconde partie", [
                    "**Antithèse : la moquerie exige aussi la déformation.** Une peinture "
                    "exacte ne fait pas rire ; il faut grossir. Tartuffe mange « deux "
                    "perdrix » et boit « quatre grands coups de vin » : l'hyperbole n'est "
                    "pas de l'observation.",
                    "De même, l'aveuglement d'Orgon est poussé au-delà du vraisemblable "
                    "— il donne tous ses biens à un inconnu — pour que le mécanisme soit "
                    "visible.",
                ]),
                ("Plan possible — dépassement", [
                    "**La satire connaît le mécanisme et déforme la mesure.** Ce que Molière "
                    "connaît, ce n'est pas un individu, c'est une méthode ; ce qu'il "
                    "exagère, ce sont les proportions. Un devoir qui parvient à cette "
                    "distinction sera valorisé.",
                    "On accordera la note maximale à la copie qui appuie chaque affirmation "
                    "sur une citation courte et analysée, même si le plan diffère de celui-ci.",
                ]),
                ("Grille d'évaluation — Sujet II", None),
            ],
            grille=[
                ["Critère", "Indicateurs", "Points"],
                ["C1 — Compréhension / Pertinence",
                 "Le candidat reçoit 6 pts : si le sujet est analysé (les deux termes "
                 "« moquer » et « connaître » sont interrogés) et si la réponse s'appuie sur "
                 "l'œuvre. 4 pts : si le sujet est compris mais traité par affirmations. "
                 "2 pts : si la copie raconte la pièce. 0 pt : hors sujet.", "6"],
                ["C2 — Organisation / Cohérence",
                 "Le candidat reçoit 6 pts : si l'introduction comporte ses trois étapes, si "
                 "les parties sont annoncées puis respectées, et si les transitions existent. "
                 "4 pts : plan perceptible sans transitions. 2 pts : idées juxtaposées.",
                 "6"],
                ["C3 — Expression / Correction de la langue",
                 "Le candidat reçoit 6 pts : si la syntaxe est correcte, le lexique précis, "
                 "les citations ponctuées selon l'usage. 4 pts : fautes n'entravant pas la "
                 "lecture. 2 pts : fautes gênantes.", "6"],
                ["C4 — Présentation de la copie",
                 "Le candidat reçoit 2 pts : si la copie est propre, lisible, et si les "
                 "paragraphes sont nettement séparés. 1 pt : présentation irrégulière.",
                 "2"],
                ["**Total**", "", "**20**"],
            ],
            cloture="On restera ouvert à toute autre organisation pertinente. Les exemples "
                    "empruntés à d'autres œuvres seront crédités dès lors qu'ils sont exacts "
                    "et analysés.",
        ),
        dict(
            num="Corrigé du sujet III — Commentaire composé",
            blocs=[
                ("Situation du passage",
                 "Acte III, scène 2 et ouverture de la scène 3. Première apparition de "
                 "Tartuffe, après deux actes où il n'a été que nommé. Dorine vient le "
                 "chercher de la part d'Elmire."),
                ("Problématique attendue",
                 "Comment cette entrée en scène démasque-t-elle le personnage avant même "
                 "qu'il ait rencontré ceux qu'il trompe ?"),
                ("Premier axe — une entrée entièrement jouée", [
                    "Un ordre adressé à Laurent, valet que le spectateur ne verra jamais ; "
                    "la didascalie « apercevant Dorine » établit que le discours est destiné "
                    "à un témoin.",
                    "Deux objets de pénitence nommés à voix haute (« ma haire », « ma "
                    "discipline ») ; une aumône annoncée et jamais accomplie.",
                    "Le jugement de Dorine, qui nomme le procédé : « Que d'affectation et de "
                    "forfanterie ! »",
                ]),
                ("Second axe — un raisonnement qui se retourne", [
                    "« Couvrez ce sein que je ne saurais voir » : la pudeur invoquée par "
                    "celui qui, seul, a regardé.",
                    "La généralisation (« Par de pareils objets les âmes sont blessées ») "
                    "qui transforme un désir personnel en loi.",
                    "La riposte de Dorine, construite sur le connecteur « donc », et le "
                    "contre-exemple qu'elle donne d'elle-même.",
                    "Le changement de ton à l'annonce d'Elmire (« Hélas ! très "
                    "volontiers ») et la bénédiction finale, à comparer avec la menace.",
                ]),
                ("Écueils à sanctionner", [
                    "Paraphrase suivie du texte, sans axe.",
                    "Analyse des didascalies traitée comme du texte parlé.",
                    "Citation inexacte du vers le plus connu de la pièce : on vérifiera "
                    "« Couvrez ce sein que je ne saurais voir » mot pour mot.",
                ]),
                ("Grille d'évaluation — Sujet III", None),
            ],
            grille=[
                ["Critère", "Indicateurs", "Points"],
                ["C1 — Compréhension / Pertinence",
                 "Le candidat reçoit 6 pts : si le passage est situé avec exactitude, si les "
                 "deux axes sont des thèses et non des intitulés thématiques, et si aucune "
                 "erreur de sens n'est commise. 4 pts : un axe seulement est construit. "
                 "2 pts : paraphrase.", "6"],
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
                 "citations sont ponctuées selon l'usage (guillemets, barre oblique entre "
                 "les vers). 1 pt : usage irrégulier.", "2"],
                ["**Total**", "", "**20**"],
            ],
            cloture="On insistera tout particulièrement sur l'exploitation par le candidat "
                    "des procédés de style, les éléments du vocabulaire, la syntaxe, etc., dans "
                    "ses démonstrations et autres illustrations. On restera également ouvert à "
                    "toute autre interprétation pertinente du texte par le candidat. Tout axe "
                    "non prévu au corrigé mais correctement démontré sera pleinement crédité ; "
                    "on valorisera la copie qui exploite les didascalies.",
        ),
    ],
)


DEVOIR2 = dict(
    titre="Devoir n° 2 — Devoir surveillé de contrôle (2 heures)",
    entete=[
        ["Nature", "Devoir de contrôle en cours d'étude de l'œuvre"],
        ["Classe", "Seconde, toutes séries"],
        ["Durée", "2 heures"],
        ["Support", "Acte I, scène 1 — la scène d'exposition"],
        ["Barème", "Questions : 12 points — Production écrite : 8 points"],
    ],
    consigne_generale="Ce devoir se place après l'étude des fiches 1 à 3. Il vérifie que "
                      "les outils du texte théâtral sont acquis — réplique, didascalie, "
                      "types de phrase, champ lexical — avant l'épreuve longue de quatre "
                      "heures. Les réponses aux questions seront rédigées : un relevé sans "
                      "phrase ne vaut que la moitié des points.",
    support=X.E1,
    source_support=X.REFERENCES["E1"],
    questions=[
        ("I. Compréhension du texte (4 points)", [
            "**1.** Où se passe la scène, et que fait Madame Pernelle au moment où la pièce "
            "commence ? Répondez en une phrase, en citant le texte. **(2 pts)**",
            "**2.** Relevez les six personnages présents et indiquez, pour chacun, son lien "
            "avec Orgon. **(2 pts)**",
        ]),
        ("II. Étude de la langue et des procédés (8 points)", [
            "**3.** Relevez les cinq répliques que Madame Pernelle interrompt. a) Quel signe "
            "de ponctuation les termine ? b) Que produit la répétition de ce procédé ? "
            "**(2 pts)**",
            "**4.** « Vous êtes un sot en trois lettres, mon fils. » a) Identifiez le type "
            "de cette phrase. b) Relevez deux autres phrases du même type dans le texte. "
            "c) Quel rapport ce type de phrase établit-il entre celle qui parle et ceux qui "
            "écoutent ? **(2 pts)**",
            "**5.** Relevez les mots par lesquels Madame Pernelle s'adresse à chacun des "
            "personnages. a) Que remarquez-vous de commun à tous ces mots ? b) Qu'en "
            "concluez-vous sur la façon dont elle considère sa famille ? **(2 pts)**",
            "**6.** « Quoi ! je souffrirai, moi, qu'un cagot de critique / Vienne usurper "
            "céans un pouvoir tyrannique. » a) Relevez les deux mots qui appartiennent au "
            "vocabulaire du pouvoir politique. b) Quel effet produit leur emploi dans une "
            "scène de famille ? **(2 pts)**",
        ]),
        ("III. Production écrite (8 points)", [
            "**7.** Rédigez entièrement l'introduction et le premier axe du commentaire "
            "composé de ce texte. L'axe portera sur la manière dont cette scène présente "
            "les personnages, et comportera au minimum trois citations, chacune suivie de "
            "son analyse. Vous ne rédigerez ni le second axe ni la conclusion. **(8 pts)**",
        ]),
    ],
)

DEVOIR2_CORRIGE = dict(
    titre="Devoir n° 2 — Corrigé et barème détaillé",
    reponses=[
        ("1. Situation de la scène (2 pts)",
         "Le candidat reçoit 2 pts s'il indique : (a) la scène se passe chez Orgon, à "
         "Paris ; (b) Madame Pernelle, mère d'Orgon, quitte la maison en colère ; (c) la "
         "citation attendue est « Allons, Flipote, allons, que d'eux je me délivre » ou "
         "« Oui, je sors de chez vous fort mal édifiée ». 1 pt pour deux éléments "
         "seulement. On valorisera le candidat qui note que la pièce commence par un "
         "départ, et non par une arrivée."),
        ("2. Les personnages présents (2 pts)",
         "Madame Pernelle (mère d'Orgon) ; Elmire (femme d'Orgon) ; Damis (fils d'Orgon) ; "
         "Mariane (fille d'Orgon) ; Cléante (beau-frère d'Orgon, frère d'Elmire) ; Dorine "
         "(servante attachée à Mariane). Flipote, servante de Madame Pernelle, est présente "
         "mais ne parle pas : on accordera un point de valorisation au candidat qui la "
         "mentionne. 2 pts pour six liens exacts, 1 pt pour quatre."),
        ("3. Les cinq répliques interrompues (2 pts)",
         "Relevé attendu : « Si… » (Dorine), « Mais… » (Damis), « Je crois… » (Mariane), "
         "« Mais, ma mère… » (Elmire), « Mais, madame, après tout… » (Cléante). a) Les "
         "points de suspension. 1 pt pour le relevé complet. b) La répétition installe une "
         "règle : personne, dans cette maison, ne peut achever une phrase. Elle montre que "
         "Madame Pernelle occupe seule la parole. 1 pt pour l'interprétation. On valorisera "
         "le candidat qui remarque que ces répliques et celles de Madame Pernelle forment "
         "ensemble un seul alexandrin."),
        ("4. Les types de phrase (2 pts)",
         "a) Phrase déclarative, employée ici comme un jugement sans appel. b) Deux autres "
         "au choix : « Votre conduite en tout est tout à fait mauvaise », « Vous êtes "
         "dépensière », « C'est un homme de bien qu'il faut que l'on écoute ». c) La phrase "
         "déclarative énonce comme un fait ce qui n'est qu'une opinion : elle interdit la "
         "discussion. On accepte aussi le relevé des phrases exclamatives et impératives "
         "(« Allons, Flipote, allons », « Laissez, ma bru, laissez ») à condition que "
         "l'effet soit correctement analysé. 1 pt pour l'identification et le relevé, 1 pt "
         "pour l'effet."),
        ("5. Les appellations (2 pts)",
         "Relevé : « ma bru », « mamie », « mon fils », « sa sœur », « monsieur son "
         "frère ». a) Tous désignent la personne par sa place dans la famille, jamais par "
         "son prénom ; aucun n'est affectueux, et « mamie » est même méprisant. b) Madame "
         "Pernelle ne voit pas des individus mais des rangs, et se comporte en chef de "
         "famille plutôt qu'en grand-mère. 1 pt pour le relevé, 1 pt pour la conclusion."),
        ("6. Le vocabulaire du pouvoir (2 pts)",
         "a) « usurper » et « tyrannique ». On accepte également « pouvoir » et "
         "« consentir ». b) Ces mots appartiennent au vocabulaire de la politique et non à "
         "celui de la famille. Leur emploi grandit démesurément le conflit domestique et "
         "annonce le véritable sujet de la pièce : un étranger s'est emparé d'une autorité "
         "qui ne lui appartient pas. 1 pt pour le relevé, 1 pt pour l'effet."),
        ("7. Production écrite (8 pts)", None),
    ],
    grille_prod=[
        ["Critère", "Indicateurs", "Points"],
        ["Introduction",
         "Le candidat reçoit 2 pts : si l'introduction comporte les trois étapes — situation "
         "du passage dans l'œuvre, problématique, annonce de l'axe. 1 pt : si une étape "
         "manque. 0 pt : si elle se réduit à une présentation de Molière.",
         "2"],
        ["Pertinence de l'axe",
         "Le candidat reçoit 2 pts : si l'axe est formulé comme une thèse (« une famille "
         "présentée par les reproches qu'elle reçoit »). 1 pt : si l'axe se réduit à un "
         "intitulé thématique du type « les personnages ».",
         "2"],
        ["Analyse des citations",
         "Le candidat reçoit 3 pts : si trois citations au moins sont intégrées, suivies "
         "d'un procédé nommé et d'une interprétation. 2 pts : si l'une n'est pas analysée. "
         "1 pt : citations juxtaposées.",
         "3"],
        ["Langue",
         "Le candidat reçoit 1 pt : si la syntaxe est correcte et si les citations de vers "
         "sont ponctuées selon l'usage — guillemets, barre oblique pour marquer la fin d'un "
         "vers.",
         "1"],
        ["**Total**", "", "**8**"],
    ],
    cloture="On restera ouvert à toute autre interprétation pertinente. Un axe non prévu au "
            "corrigé mais correctement démontré sera pleinement crédité.",
)

ENCADRES_DEVOIRS = [
    ("methode", "Citer un vers, et non une ligne", [
        "Une pièce en vers ne se cite pas comme un roman. Trois règles, qui valent des "
        "points à chaque devoir :",
        "- **La barre oblique marque la fin du vers.** « Couvrez ce sein que je ne saurais "
        "voir. / Par de pareils objets les âmes sont blessées. »",
        "- **On ne coupe pas un vers au milieu** sans nécessité. Si vous ne citez qu'un "
        "membre de vers, ne mettez pas de barre.",
        "- **La citation reste entre guillemets et se fond dans la phrase.** Écrivez : "
        "Tartuffe se dit « le plus grand scélérat qui jamais ait été » — et non : citation : "
        "« le plus grand scélérat ».",
        "Vérifiez toujours vos citations sur le texte. Un vers déformé prouve au correcteur "
        "que vous citez de mémoire.",
    ]),
    ("vigilance", "Les deux erreurs qui coûtent le plus cher", [
        "- **Confondre Molière et ses personnages.** Écrivez « Tartuffe affirme… », "
        "« Cléante répond… », et réservez « Molière » à ce qui relève de la construction de "
        "la pièce : le choix de faire entrer le personnage à l'acte III, la place des "
        "didascalies, la fin par l'envoyé du roi.",
        "- **Croire que la pièce attaque la religion.** C'est l'accusation qui l'a fait "
        "interdire pendant près de cinq ans, et c'est un contresens. Molière distingue "
        "expressément les vrais dévots des faux, par la bouche de Cléante. Un devoir qui "
        "écrit le contraire perd la totalité du critère de compréhension.",
    ]),
]
