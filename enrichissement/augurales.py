# -*- coding: utf-8 -*-
"""
L'entrée dans l'œuvre, écrite pour l'élève.

La section qui ouvre l'étude s'adressait à l'enseignant : « Séance
d'ouverture (55 minutes) », « Demandez à la classe », « Ramassez les
papiers », « Calendrier fixé collectivement ». L'élève qui ouvrait son
cahier au premier jour y lisait les consignes d'un autre.

Elle est réécrite ici pour lui, en trois temps qu'il fait lui-même :

  J'OBSERVE LE TITRE     des questions posées à l'élève, sur le titre et la
                         couverture, avant toute lecture.
  MON HYPOTHÈSE          un encadré qu'il remplit, et qu'il ne relira qu'à
                         la fin. Une hypothèse n'est ni juste ni fausse :
                         elle sert à mesurer le chemin parcouru.
  MON CONTRAT DE LECTURE ce qu'il s'engage à repérer, en cases à cocher, et
                         un journal de lecture assez simple pour être tenu.

Ce qui revient à l'enseignant — durées de séance, calendrier de la classe,
dates des contrôles — n'est pas perdu : il passe dans un encadré « Côté
enseignant » à la fin de la section, à sa place et sans encombrer l'élève.

Les questions sur le titre sont propres à chaque œuvre ; tout le reste est
commun, parce qu'un élève qui a appris le geste sur un cahier le retrouve
dans les huit autres.
"""

# ═══════════════════════════════════════════════════════════════ PAR CAHIER
# titre        : ce que l'élève a sous les yeux
# observer     : les questions sur le titre et la couverture
# contrat      : ce que cette œuvre-ci demande de suivre, en plus du commun
# attente      : la troisième ligne de l'hypothèse, adaptée au genre
# enseignant   : la conduite de séance, reprise de la version précédente
PAR_CAHIER = {

    "vieuxnegre": dict(
        titre="Le vieux nègre et la médaille",
        observer=[
            "Le titre met côte à côte deux mots qui ne vont pas ensemble : "
            "un homme, et un objet. Lequel des deux, selon vous, le livre "
            "va-t-il raconter ?",
            "Une médaille, on la reçoit. De qui ? Et pourquoi la donne-t-on ?",
            "Le mot « vieux » dit un âge. Que dit-il d'autre, ici ?",
            "Le livre est divisé en trois parties. Regardez seulement leurs "
            "titres, sans lire : à quoi vous attendez-vous ?",
        ],
        contrat=["ce que Meka gagne, et ce qu'il perd, à chaque étape",
                 "les mots par lesquels les autres le désignent"],
        attente="Le personnage principal sera quelqu'un qui…",
        enseignant=[
            "**Séance d'ouverture — 55 minutes.** Exploitation du titre et "
            "de la structure en trois parties ; lecture à voix haute des "
            "toutes premières lignes du roman (première partie, chapitre I) "
            "sans en révéler la suite, pour faire formuler des hypothèses "
            "sur le personnage de Meka.",
            "**Engagement de lecture.** Calendrier fixé collectivement, en "
            "tenant compte du nombre d'exemplaires disponibles ; un contrôle "
            "de lecture après chaque partie, dont les dates sont annoncées "
            "dès la première séance.",
        ],
    ),

    "lionperle": dict(
        titre="Le lion et la perle",
        observer=[
            "Le titre nomme un animal et une pierre. À votre avis, "
            "désignent-ils des bêtes et des objets, ou des personnes ?",
            "Que sait-on d'un lion, avant même de le voir ? Et d'une perle ?",
            "Le mot « et » relie les deux. Attendez-vous une rencontre, une "
            "alliance, ou un affrontement ?",
            "Ouvrez la liste des personnages, et rien d'autre. Lequel vous "
            "paraît être le lion ? Laquelle, la perle ?",
        ],
        contrat=["ce que chaque personnage veut, et ce qu'il est prêt à "
                 "faire pour l'obtenir",
                 "les moments où un personnage dit une chose et en pense "
                 "une autre"],
        attente="Le personnage principal sera quelqu'un qui…",
        enseignant=[
            "**Séance d'ouverture — 55 minutes.** Exploitation du titre et "
            "de la liste des personnages ; lecture à voix haute des toutes "
            "premières répliques (acte I, « Au matin ») sans révéler la "
            "suite, pour faire formuler des hypothèses sur la relation entre "
            "Sidi et Lakounlé.",
            "**Engagement de lecture.** Calendrier fixé collectivement ; un "
            "contrôle de lecture après chaque acte, dont les dates sont "
            "annoncées dès la première séance.",
        ],
    ),

    "ngum": dict(
        titre="Ngum a Jemea",
        observer=[
            "Le titre n'est pas en français. Que produit sur vous un titre "
            "que vous ne comprenez pas encore ?",
            "Cherchez ce que « Ngum a Jemea » veut dire en duala — auprès "
            "d'un locuteur, si vous en connaissez un. Notez la réponse et "
            "sa source.",
            "La pièce porte une dédicace. À qui est-elle adressée ? Qu'est-ce "
            "qu'une dédicace nous apprend d'un livre avant de l'avoir lu ?",
            "Parcourez la liste des personnages, sans lire la pièce. Deux "
            "camps s'y devinent : lesquels ?",
        ],
        contrat=["les arguments de chaque camp — pas seulement les faits, "
                 "les raisons",
                 "les moments où la loi est invoquée, et par qui"],
        attente="Le personnage principal sera quelqu'un qui…",
        enseignant=[
            "**Séance d'ouverture — 55 minutes.** Exploitation du titre, de "
            "la dédicace et de la liste des personnages ; recherche du sens "
            "de « Ngum a Jemea » avec une ressource duala si possible ; "
            "lecture à voix haute du verdict de l'acte IV, scène III "
            "(extrait fermoir), sans en révéler le contexte, pour faire "
            "percevoir d'emblée l'issue tragique et faire formuler des "
            "hypothèses sur son origine.",
            "**Engagement de lecture.** Calendrier fixé collectivement ; "
            "dates des contrôles de lecture annoncées dès la première "
            "séance.",
        ],
    ),

    "capitoline": dict(
        titre="Les tribus de Capitoline",
        observer=[
            "Le mot « tribus » est au pluriel. Combien en attendez-vous ? "
            "Et pourquoi pas une seule ?",
            "« Capitoline » : est-ce un lieu, une personne, une chose ? "
            "Qu'est-ce qui vous fait pencher ?",
            "Si Capitoline est une personne, pourquoi le roman porterait-il "
            "son nom plutôt que celui de son héros ?",
            "Le titre dit « les tribus **de** Capitoline ». Ces tribus sont "
            "donc à elle. En quel sens peut-on posséder une tribu ?",
        ],
        contrat=["les conflits entre familles : qui refuse quoi, et au nom "
                 "de quoi",
                 "les appartenances : chaque fois qu'un personnage est "
                 "désigné par son origine"],
        attente="Le personnage principal sera quelqu'un qui…",
        enseignant=[
            "**Séance d'ouverture — 55 minutes.** Exploitation du titre et "
            "de la dédicace (voir « Analyse du paratexte ») ; lecture à voix "
            "haute de la première phrase du roman, sans révéler l'épilogue ; "
            "formulation d'hypothèses de lecture par les élèves.",
            "**Engagement de lecture.** Calendrier fixé collectivement — "
            "deux à trois semaines, selon le nombre d'exemplaires "
            "disponibles ; dates des contrôles de lecture annoncées dès la "
            "première séance.",
        ],
    ),

    "tenebres": dict(
        titre="Au cœur des ténèbres",
        observer=[
            "« Ténèbres » : cherchez le mot dans un dictionnaire. En quoi "
            "diffère-t-il de « nuit » et de « obscurité » ?",
            "Le titre dit « au cœur ». Un cœur est un centre — mais c'est "
            "aussi un organe. Les deux sens vous paraissent-ils utiles ici ?",
            "Le récit a été écrit par un Européen, en 1899, sur un voyage en "
            "Afrique. Qu'est-ce que cela vous fait attendre — et qu'est-ce "
            "que cela doit vous faire surveiller ?",
            "Regardez la première phrase prononcée par le narrateur, et rien "
            "de plus. De quel pays parle-t-il, à votre avis ?",
        ],
        contrat=["ce que le narrateur voit lui-même, et ce qu'on lui "
                 "raconte",
                 "les mots par lesquels le récit désigne les Africains — et "
                 "ce que ces mots disent de celui qui parle"],
        attente="Le narrateur sera quelqu'un qui…",
        enseignant=[
            "**Séance d'ouverture — 55 minutes.** Exploitation du titre ; "
            "lecture à voix haute de la réplique d'ouverture de Marlow — "
            "« Et ceci aussi a été l'un des lieux ténébreux de la terre » — "
            "sans révéler la suite, pour faire formuler des hypothèses sur "
            "ce que peut signifier cette phrase, prononcée alors que Marlow "
            "regarde Londres.",
            "**Engagement de lecture.** Calendrier fixé collectivement ; un "
            "contrôle de lecture après chaque chapitre.",
        ],
    ),

    "tartuffe": dict(
        titre="Le Tartuffe, ou l'Imposteur",
        observer=[
            "Le titre a deux parties, séparées par « ou ». La seconde "
            "explique-t-elle la première, ou la corrige-t-elle ?",
            "Cherchez « imposteur » dans un dictionnaire. Écrivez la "
            "définition, puis un exemple pris dans votre vie ordinaire.",
            "« Tartuffe » n'existait pas comme mot avant la pièce ; il "
            "existe aujourd'hui. Que s'est-il passé ?",
            "Racontez en trois lignes une situation où quelqu'un fait "
            "semblant d'être bon pour obtenir quelque chose. Gardez ces "
            "lignes : vous les relirez à la fin.",
        ],
        contrat=["qui croit Tartuffe, qui ne le croit pas, et à quel moment "
                 "chacun change d'avis",
                 "les répliques où un personnage dit le contraire de ce "
                 "qu'il pense"],
        attente="Le personnage principal sera quelqu'un qui…",
        enseignant=[
            "**Séance d'ouverture — 55 minutes.** Écrire « hypocrite » au "
            "tableau et faire raconter trois situations ordinaires ; "
            "présenter le titre complet et faire chercher « imposteur » au "
            "dictionnaire ; faire écrire à chacun, en deux lignes, ce qu'il "
            "pense qu'il va se passer. Ramasser ces papiers et les "
            "conserver : ils seront relus à la dernière séance.",
            "**Engagement de lecture.** La pièce se lit hors du cours, acte "
            "par acte. Le journal de lecture ci-dessus tient lieu de trace ; "
            "il est relevé à chaque contrôle.",
        ],
    ),

    "sauvages": dict(
        titre="Poèmes sauvages éclairés au feu de brousse",
        observer=[
            "Le titre est long et rassemble des mots qui jurent : "
            "« sauvages », « éclairés », « feu de brousse ». Lequel vous "
            "arrête le plus, et pourquoi ?",
            "Un feu de brousse détruit. Que fait-il pousser, ensuite ? "
            "Gardez votre réponse : elle est la clé du titre.",
            "Que peut vouloir dire « éclairer » un poème par un feu ? "
            "Proposez deux sens.",
            "Écrivez en trois lignes ce que vous attendez de ce livre, et ce "
            "que vous en craignez. Vous relirez ces lignes à la fin.",
        ],
        contrat=["les villes nommées, et ce qui les relie",
                 "le passage du « je » au « nous » : à quel moment il se "
                 "produit"],
        attente="La voix qui parle sera celle de quelqu'un qui…",
        enseignant=[
            "**Séance d'ouverture — un quart d'heure suffit.** Écrire le "
            "titre au tableau, sans le nom de l'auteur, et recueillir trois "
            "hypothèses ; faire dire ce qu'un feu de brousse détruit et ce "
            "qui repousse ensuite — cette double valeur est la clé du titre. "
            "Écrire enfin : 13 mars 2016, Grand-Bassam, Côte d'Ivoire ; "
            "situer la ville, puis Maroua et Maïduguri, et demander ce qui "
            "relie ces trois points sans donner la réponse : le poème la "
            "donnera.",
            "**Engagement de lecture.** Les trois lignes d'attente et de "
            "crainte sont ramassées, non notées, et rendues à la dernière "
            "séance : c'est le meilleur moyen de mesurer avec la classe ce "
            "que le livre a changé.",
        ],
    ),

    "stances": dict(
        titre="Stances et Poèmes",
        observer=[
            "Le mot « stances » ne s'emploie plus guère. À quoi vous "
            "fait-il penser, avant toute vérification ? Notez votre "
            "réponse, même si vous la croyez fausse.",
            "Cherchez maintenant la définition. En quoi diffère-t-elle de "
            "ce que vous aviez cru ?",
            "Le titre distingue « Stances » et « Poèmes ». Si les deux "
            "étaient la même chose, pourquoi les séparer ?",
            "Le recueil s'ouvre sur un poème adressé au lecteur, où le "
            "poète avoue que ses vrais vers ne seront pas lus. Peut-on "
            "écrire un livre entier après avoir avoué cela ?",
        ],
        contrat=["les objets ordinaires dont un poème parle pour dire autre "
                 "chose",
                 "les poèmes où le savoir et l'émotion se rencontrent"],
        attente="La voix qui parle sera celle de quelqu'un qui…",
        enseignant=[
            "**Séance d'ouverture — un quart d'heure suffit.** Écrire au "
            "tableau « Le meilleur demeure en moi-même, / Mes vrais vers ne "
            "seront pas lus », sans dire de qui c'est, et faire discuter. "
            "Écrire ensuite « Stances et Poèmes » et recueillir ce que le "
            "mot « stances » évoque : la plupart proposeront « tristesse » "
            "ou « instances ». Noter sans corriger, puis donner la "
            "définition — la correction vaut mieux après l'erreur qu'avant.",
            "**Un objet sur la table.** Apporter un verre ou un pot "
            "ébréché, le faire observer une minute, faire écrire trois "
            "lignes sur ce qu'il a subi et si cela se voit, puis lire « Le "
            "Vase brisé ». Les élèves reconnaissent d'eux-mêmes la démarche "
            "du poème.",
            "**Engagement de lecture.** Le recueil se lit en trois "
            "semaines, une section tous les cinq jours. Le journal de "
            "lecture ci-dessus sert à la négociation du projet d'étude et "
            "vaut note de participation.",
        ],
    ),

    "balafon": dict(
        titre="Balafon",
        observer=[
            "Un balafon est un instrument de musique. Qu'est-ce qu'un poète "
            "peut vouloir dire en donnant ce nom à son livre ?",
            "Un balafon se frappe, et il résonne. Un livre peut-il "
            "résonner ? De quelle manière ?",
            "Parcourez la table des matières, et rien d'autre. Les seize "
            "titres se laissent partager en trois groupes : lesquels, et "
            "comment les nommeriez-vous ?",
            "La quatrième de couverture emploie quatre verbes : "
            "« interpeller, supplier, exhorter, rudoyer ». Écrivez trois "
            "lignes en employant l'un d'eux, adressées à quelqu'un que vous "
            "ne connaissez pas.",
        ],
        contrat=["à qui chaque poème s'adresse — le recueil est fait de "
                 "lettres",
                 "les noms propres que vous avez dû chercher"],
        attente="La voix qui parle sera celle de quelqu'un qui…",
        enseignant=[
            "**Séance d'ouverture — un quart d'heure suffit.** Faire "
            "écouter un balafon, si l'on dispose d'un enregistrement ou d'un "
            "instrument, puis demander ce qu'un poète veut dire en donnant "
            "ce nom à son livre ; garder trois réponses au tableau, on y "
            "reviendra à la dernière séquence. Écrire ensuite la liste des "
            "seize titres dans l'ordre et faire chercher les trois "
            "ensembles : les élèves retrouvent presque toujours d'eux-mêmes "
            "l'itinéraire — des personnes, des lieux, des prières.",
            "**Engagement de lecture.** Le recueil se lit en trois "
            "semaines, environ cinq poèmes par semaine. Le journal de "
            "lecture ci-dessus sert à la négociation du projet d'étude et "
            "vaut note de participation.",
        ],
    ),
}

CITATION = (
    "Les activités augurales : exploitation des éléments paratextuels en vue "
    "de formuler des attentes de lecture ; étude d'un extrait ouvroir et / "
    "ou d'un extrait fermoir.",
    "MINESEC, Guide pédagogique 2019, § III.2",
)

# Ce que toute lecture d'œuvre demande de suivre, quel que soit le livre.
CONTRAT_COMMUN_TETE = [
    "les personnages : qui ils sont, et ce que chacun veut",
    "les lieux : où l'on se trouve, et ce que le lieu change à ce qui s'y "
    "passe",
    "les événements importants : ceux après lesquels rien n'est plus comme "
    "avant",
]
CONTRAT_COMMUN_QUEUE = [
    "les passages qui m'arrêtent : ceux que je relis deux fois, sans savoir "
    "pourquoi",
    "les indices qui annoncent la fin — on ne les voit qu'après, mais on "
    "peut les chercher avant",
]


def _cases(items):
    """Une liste à cocher : la case est dans le texte, elle se remplit à la
    main. Un contrat qu'on ne peut pas cocher n'engage personne."""
    return [("puce", "☐  " + t) for t in items]


def blocs(cle):
    """La section « Avant de lire », pour l'élève."""
    d = PAR_CAHIER.get(cle)
    if not d:
        return None

    b = [("h2", "2. Avant de lire — j'observe, je fais des hypothèses"),
         ("p", "Cette page se remplit **avant** d'ouvrir le livre, et ne se "
               "relit qu'à la fin. Elle ne demande aucune connaissance : "
               "seulement ce que vous voyez, et ce que vous en déduisez."),

         ("h3", "J'observe le titre et la couverture"),
         ("p", "Répondez par écrit, dans le cahier. Personne n'a encore lu "
               "l'œuvre : aucune de ces réponses ne peut être fausse.")]
    b += [("num", q) for q in d["observer"]]

    b.append(("encadre", "retiens", "Mon hypothèse de lecture", [
        "Avant d'ouvrir le livre, j'écris ce que je crois. Je ne relirai "
        "cette page qu'à la dernière séance.",
    ]))
    b.append(("grille", [
        ["Avant d'ouvrir le livre, je crois que…", "Ce que j'écris"],
        ["Le livre va parler de…", "…"],
        ["Ce que le titre me promet, c'est…", "…"],
        [d["attente"], "…"],
        ["Je crois que cela finira…", "…"],
        ["Ce qui me rendra la lecture difficile, ce sera…", "…"],
    ]))
    b.append(("encadre", "astuce", "Une hypothèse n'est ni juste ni fausse", [
        "Elle sert à mesurer le chemin parcouru. À la dernière séance, vous "
        "reviendrez à ce tableau : l'écart entre ce que vous croyiez et ce "
        "que vous savez, **c'est cela que l'étude vous aura appris**.",
        "Un élève qui n'écrit rien ici ne peut rien mesurer à la fin.",
    ]))

    b.append(("h3", "Mon contrat de lecture"))
    b.append(("p", "Je m'engage à repérer, au fil de ma lecture, et à noter "
                   "dans mon journal :"))
    b += _cases(CONTRAT_COMMUN_TETE + list(d["contrat"])
                + CONTRAT_COMMUN_QUEUE)
    b.append(("p", "Je coche chaque ligne le jour où j'ai commencé à la "
                   "suivre — non le jour où je l'ai finie."))

    b.append(("h3", "Mon journal de lecture"))
    b.append(("p", "Une ligne par séance de lecture personnelle. Ce journal "
                   "n'est pas noté sur sa beauté : il sert à la négociation "
                   "du projet d'étude, et c'est là que vous puiserez vos "
                   "questions."))
    b.append(("grille", [
        ["Date", "J'en suis à…", "Ce qui m'a marqué", "La question que je me "
                                                      "pose"],
    ] + [["…", "…", "…", "…"] for _ in range(6)]))
    b.append(("encadre", "astuce", "Trois lignes suffisent", [
        "Un journal qu'on tient vaut mieux qu'un journal qu'on soigne. Si "
        "vous n'avez qu'une minute : notez **où vous en êtes** et **un mot "
        "que vous avez dû chercher**. C'est déjà une entrée utile.",
        "Ne résumez pas l'histoire : le livre le fait déjà. Notez ce que le "
        "livre vous fait, et ce qu'il vous laisse comme question.",
    ]))

    b.append(("encadre", "citation", "Texte officiel",
              [CITATION[0], "— " + CITATION[1]]))
    b.append(("encadre", "vigilance", "Côté enseignant — conduite de la "
                                      "séance", list(d["enseignant"])))
    return b


# ═══════════════════════════════════════════════════ LE CARNET DE BORD
# La note propre à l'œuvre, quand son découpage demande une explication.
# Deux cahiers seulement en avaient une ; l'une renvoyait à « la pièce
# étudiée dans le cahier précédent » — un renvoi qui n'a aucun sens pour
# l'élève qui n'a que ce volume-ci entre les mains.
NOTE_DECOUPAGE = {
    "capitoline":
        "Le roman n'est pas découpé en chapitres numérotés. Les cinq étapes "
        "ci-dessous sont des **repères de contenu**, établis pour "
        "accompagner votre lecture — non une division imprimée dans le "
        "livre.",
    "ngum":
        "La pièce est réellement divisée en actes et en scènes, imprimés "
        "dans le texte : les étapes suivent exactement ce découpage.",
}


def carnet(cle):
    """Ce qui ouvre le carnet de bord, adressé à l'élève.

    Sept cahiers sur neuf passaient du titre de la rubrique à la première
    question, sans dire à l'élève ce qu'on attendait de lui ni quand.
    """
    b = [("p", "Le livre se lit chez vous, par étapes. À chaque étape, "
               "quelques questions à faire **par écrit dans le cahier**, "
               "puis une question d'interprétation — celle-là n'a pas de "
               "bonne réponse : c'est la vôtre qu'on attend.")]
    note = NOTE_DECOUPAGE.get(cle)
    if note:
        b.append(("p", note))
    b.append(("encadre", "astuce", "Comment travailler une étape", [
        "**Lisez d'abord la partie en entier, sans le cahier.** Les "
        "questions viennent après la lecture, jamais pendant : chercher une "
        "réponse en lisant empêche de lire.",
        "**Répondez de mémoire, puis vérifiez dans le livre.** Ce que vous "
        "n'aviez pas retenu vous dit exactement quoi relire — et cela prend "
        "cinq minutes au lieu d'une heure.",
        "**La question d'interprétation prépare la négociation du projet "
        "d'étude.** Votre réponse y servira, même si la classe la conteste. "
        "Une hypothèse discutée vaut mieux qu'une page blanche.",
    ]))
    return b
