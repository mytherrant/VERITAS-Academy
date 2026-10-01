# -*- coding: utf-8 -*-
"""
Appareil pédagogique transversal des cahiers d'œuvre intégrale.

Quatre ajouts, communs aux huit cahiers, **chacun placé là où il sert** :

  I bis        boîte à outils      juste après les notions littéraires
  3 bis        fiche de lecture    juste après le contrôle de lecture
  6 quater     carte mentale       après les six fiches et l'oral
  6 quinquies  exercices bilan     dans la foulée, avant les exposés

  • **Boîte à outils** — les gestes d'analyse, déclinés selon le genre de
    l'œuvre. On n'étudie pas une pièce comme un roman, ni un roman comme un
    recueil de poèmes ; l'outillage change avec l'objet.
  • **Carte mentale** — l'œuvre tenue sur une page. Elle n'est pas rédigée à
    la main : elle est **construite à partir des fiches du cahier**, de ses
    axes et de ses thèmes. Une carte qui contredirait le cahier serait pire
    qu'une absence de carte.
  • **Fiche de lecture globale** — un formulaire que l'élève remplit lui-même.
    Le cahier fournit le cadre, pas les réponses : une fiche déjà remplie ne
    s'apprend pas.
  • **Exercices bilan** — appariement, remise en ordre, vrai/faux justifié,
    questions de synthèse, tous construits sur le contenu réel du cahier.

Le principe qui gouverne le module : ne rien affirmer que le cahier
n'établisse déjà. Tout ce qui est produit ici dérive des fiches.
"""

GENRES = ("roman", "théâtre", "poésie")


def _genre(mot):
    """Ramène un genre déclaré à l'une des trois familles outillées."""
    m = (mot or "").lower()
    if "poé" in m or "poè" in m:
        return "poésie"
    if "com" in m or "trag" in m or "théât" in m or "pièce" in m or "drame" in m:
        return "théâtre"
    return "roman"


# ═══════════════════════════════════════════════════════════ BOÎTE À OUTILS
_OUTILS_COMMUNS = [
    ("Repérer un procédé, et ne pas s'arrêter là", [
        "Un procédé se relève, se nomme, puis s'interprète. Les trois temps "
        "sont indissociables, et c'est le troisième qui rapporte les points.",
        "- **Relever** : citer exactement, entre guillemets, aussi court que "
        "possible. Un mot suffit souvent.",
        "- **Nommer** : employer le terme exact — anaphore, antithèse, "
        "discours indirect libre. « Il y a une figure de style » ne vaut rien.",
        "- **Interpréter** : dire ce que le procédé produit **ici**, dans ce "
        "texte-ci. C'est la seule phrase qu'on ne pourrait pas recopier d'un "
        "manuel.",
        "**Le test de la phrase déplaçable** : si votre analyse pourrait être "
        "collée telle quelle sous un autre texte, elle n'analyse rien.",
    ]),
    ("Construire un axe qui tienne", [
        "Un axe n'est pas un thème, c'est une **idée sur le texte**, "
        "démontrable et discutable.",
        "- « La mort » n'est pas un axe : c'est un sujet.",
        "- « Le texte parle de la mort sans jamais employer le mot » est un "
        "axe : on peut le prouver et on pourrait le contester.",
        "**La règle des trois preuves** : un axe qui ne trouve pas trois "
        "citations pour le soutenir est trop étroit — ou faux. Le vérifier au "
        "brouillon avant de rédiger économise une heure.",
        "**L'ordre des axes** : du plus visible au moins évident. Le "
        "correcteur doit sentir qu'on avance, non qu'on énumère.",
    ]),
    ("Citer sans se faire pénaliser", [
        "- **Guillemets français** « … » pour le texte de l'auteur ; jamais "
        "de citation sans guillemets.",
        "- **Exactitude absolue** : un mot changé et la citation ne prouve "
        "plus rien. Dans le doute, citer plus court.",
        "- **Coupe signalée** par […] ; on ne recolle jamais deux morceaux "
        "sans le dire.",
        "- **Intégration à la phrase** : « Le poète dit que le vase “est "
        "brisé” » vaut mieux qu'une citation posée seule après deux points.",
        "- **Référence** : (l. 12) pour une ligne, (v. 12) pour un vers, "
        "(III, 2) pour un acte et une scène.",
    ]),
]

_OUTILS_ROMAN = [
    ("Qui raconte ? — repérer le point de vue", [
        "Trois questions, trois réponses possibles, et l'effet change du tout "
        "au tout :",
        "- **Point de vue omniscient** : le narrateur sait tout, y compris ce "
        "que pensent les personnages absents. Indice : des informations que "
        "nul personnage ne peut détenir.",
        "- **Point de vue interne** : on ne sait que ce qu'un personnage "
        "sait. Indice : les verbes de perception — il vit, il crut, il lui "
        "sembla.",
        "- **Point de vue externe** : on ne voit que les gestes, comme une "
        "caméra. Indice : aucune notation de pensée.",
        "**Le déplacement du point de vue est un événement du récit.** Quand "
        "un roman quitte un personnage pour un autre, demandez-vous ce que ce "
        "changement rend possible : souvent, un jugement que le premier "
        "personnage ne pouvait pas porter sur lui-même.",
    ]),
    ("Le discours indirect libre, et pourquoi il compte", [
        "Il rapporte les pensées d'un personnage sans verbe introducteur ni "
        "guillemets : la voix du narrateur et celle du personnage se "
        "superposent.",
        "**Trois indices** : absence de « il pensa que » ; temps du récit "
        "(imparfait) mais vocabulaire du personnage ; exclamations ou "
        "questions au milieu d'un passage narratif.",
        "**Pourquoi le repérer rapporte des points** : c'est le procédé qui "
        "permet l'ironie. Le lecteur entend le personnage se raconter des "
        "histoires, et il entend en même temps le narrateur les lui laisser "
        "dire.",
    ]),
    ("Le rythme du récit", [
        "- **Scène** : le récit prend le temps de l'action (dialogue). "
        "Effet : on y est.",
        "- **Sommaire** : des semaines en une phrase. Effet : on passe.",
        "- **Ellipse** : un temps sauté sans être raconté. Effet : ce qui "
        "manque devient voyant.",
        "- **Pause** : le récit s'arrête pour décrire. Effet : le regard se "
        "substitue à l'action.",
        "**À chercher en priorité** : l'endroit où le rythme change. C'est "
        "presque toujours un moment important.",
    ]),
]

_OUTILS_THEATRE = [
    ("Lire une scène comme une scène, non comme un texte", [
        "Au théâtre, tout ce qui est dit est dit **devant quelqu'un**. Trois "
        "questions avant d'analyser une réplique :",
        "- **Qui est en scène ?** Une phrase change de sens selon qui "
        "l'entend.",
        "- **Qui parle à qui ?** Un personnage peut s'adresser à l'un en "
        "visant l'autre.",
        "- **Qui se tait ?** Le silence d'un personnage présent est une "
        "réplique.",
        "**La double énonciation** : chaque parole s'adresse à un personnage "
        "et au public en même temps. C'est ce qui rend l'ironie possible — le "
        "public comprend ce que le personnage ne comprend pas.",
    ]),
    ("Ce que les didascalies décident", [
        "Elles ne sont pas des indications facultatives : elles construisent "
        "la scène.",
        "- **D'entrée et de sortie** : elles règlent qui sait quoi. Le "
        "quiproquo naît presque toujours d'une entrée mal placée.",
        "- **De ton** (à part, ironiquement) : elles renversent le sens "
        "littéral d'une réplique.",
        "- **De geste** : elles montrent ce que la parole cache. Un "
        "personnage peut protester en reculant.",
        "**Une didascalie se cite comme le reste du texte.** Elle est de "
        "l'auteur.",
    ]),
    ("Les trois ressorts du comique — et le sérieux qu'ils portent", [
        "- **De mots** : répétitions, jargon, patois, tics de langage.",
        "- **De gestes et de situation** : quiproquo, cachette, double sens.",
        "- **De caractère** : un défaut poussé au point de devenir "
        "mécanique.",
        "**Le geste qui distingue une bonne copie** : montrer que le rire "
        "sert autre chose. On rit d'un personnage aveugle, et cet aveuglement "
        "a des conséquences graves dans la pièce. Un devoir qui s'arrête au "
        "rire n'a pas fini son travail.",
    ]),
]

_OUTILS_POESIE = [
    ("Compter un vers sans se tromper", [
        "- **L'e muet** se prononce devant une consonne, s'élide devant une "
        "voyelle ou un h muet, ne compte jamais en fin de vers.",
        "- **La diérèse** : deux voyelles voisines comptent parfois pour deux "
        "syllabes. Si le compte tombe une syllabe trop court, en chercher une.",
        "- **La césure** de l'alexandrin tombe après la sixième syllabe ; "
        "quand elle tombe ailleurs, c'est un fait à commenter, non une erreur "
        "de comptage.",
        "**La méthode sûre** : compter sur les doigts, à voix basse. Un élève "
        "qui écrit « alexandrin » sans avoir compté se trompe une fois sur "
        "trois.",
    ]),
    ("Ce que la disposition des rimes produit", [
        "- **Plates** (AABB) : le récit avance. C'est le vers du théâtre "
        "classique et de la fable.",
        "- **Croisées** (ABAB) : l'alternance installe une régularité, une "
        "attente.",
        "- **Embrassées** (ABBA) : la strophe se referme sur elle-même. "
        "Convient à ce qui est suspendu, protégé, enclos.",
        "**La richesse de la rime** se compte en sons communs : un = pauvre, "
        "deux = suffisante, trois ou plus = riche. À ne mentionner que si "
        "l'on en tire quelque chose.",
    ]),
    ("Sortir du thème : les quatre entrées d'un poème", [
        "Quand un poème résiste, entrer par l'une de ces portes :",
        "- **L'énonciation** : qui parle, à qui, de qui ? Le passage d'un "
        "« je » à un « nous » est toujours un événement.",
        "- **Le temps des verbes** : un poème qui bascule du passé au présent "
        "change de projet.",
        "- **Les images** : une seule image tenue tout du long est une "
        "allégorie ; plusieurs images d'un même domaine forment un réseau.",
        "- **La disposition** : longueur des strophes, place des blancs, "
        "vers isolé. Ce qui se voit avant d'être lu se commente.",
    ]),
]

_OUTILS_GENRE = {"roman": _OUTILS_ROMAN, "théâtre": _OUTILS_THEATRE,
                 "poésie": _OUTILS_POESIE}


def carte_amorce(fiches_vues):
    """Une première carte mentale, dès la deuxième séquence.

    Elle ne donne pas la carte finie : elle donne le centre, les deux
    branches déjà parcourues, et des branches vides. L'élève la complète à
    mesure qu'il avance ; une carte livrée toute faite à la dernière page
    ne lui apprend rien.
    """
    b = [("h3", "À mi-parcours — ma carte mentale, première ébauche"),
         ("p", "Vous avez étudié deux textes. Recopiez ce tableau sur une "
               "feuille libre et complétez-le après chaque séquence : à la fin "
               "du cahier, vous aurez fabriqué votre propre carte de "
               "l'œuvre.")]
    lignes = [[f["titre"], f["repere"], ""] for f in fiches_vues]
    lignes += [["Séquence %d" % i, "…", ""] for i in range(len(fiches_vues) + 1, 7)]
    b.append(("grille", [["Séquence", "Ce que le texte établit",
                          "Ce que j'y ajoute"]] + lignes))
    b.append(("encadre", "lien", "Relier deux textes", [
        "Deux séquences suffisent déjà pour chercher un lien : un mot qui "
        "revient, une image, une situation qui se répète.",
        "Écrivez-le en une phrase, même maladroite. C'est ce genre de "
        "rapprochement qui fait les deux points d'originalité de la grille, "
        "et il ne s'improvise pas le jour de l'épreuve."]))
    b.append(("saut",))
    return b


def outils_de_seance(genre):
    """Les six outils du cahier, un par séquence, dans l'ordre où ils servent.

    Ils ne sont plus servis en bloc au début : chacun paraît dans la séance
    où l'élève en a besoin. On alterne un outil commun à tous les textes et
    un outil propre au genre, pour qu'une séquence n'enchâsse jamais deux
    notions de même famille.
    """
    g = _genre(genre)
    communs, propres = list(_OUTILS_COMMUNS), list(_OUTILS_GENRE[g])
    out = []
    for i in range(max(len(communs), len(propres))):
        if i < len(communs):
            out.append(communs[i])
        if i < len(propres):
            out.append(propres[i])
    return out


def grande_boite(genre):
    """La boîte à outils complète, en référence à la fin du cahier.

    Deux niveaux, et c'est voulu : l'outil de la séance paraît quand on
    s'en sert ; celui-ci sert à réviser, quand on cherche une notion dont
    on ne sait plus le nom.
    """
    g = _genre(genre)
    b = [("saut",),
         ("h2", "Grande boîte à outils — le mémento du lecteur"),
         ("p", "Chaque outil a déjà servi dans une séance. Il est repris ici "
               "en entier, pour qu'on le retrouve sans feuilleter tout le "
               "cahier. Les trois premiers valent pour tous les textes ; les "
               "trois suivants sont propres au genre étudié ici, %s." % g)]
    for titre, corps in _OUTILS_COMMUNS + _OUTILS_GENRE[g]:
        b.append(("encadre", "methode", titre, corps))
    b.append(("encadre", "astuce", "Le brouillon en quatre colonnes", [
        "Avant de rédiger, partagez une page de brouillon en quatre "
        "colonnes : **citation** | **outil d'analyse** | **effet** | "
        "**interprétation**.",
        "Remplissez la première colonne en relisant le texte, sans réfléchir "
        "au plan. Puis les deux suivantes. Les centres d'intérêt se forment "
        "seuls : les lignes qui se ressemblent se regroupent.",
        "Ce tableau évite les deux fautes les plus coûteuses — le plan "
        "linéaire, et l'axe qu'on ne peut pas prouver.",
    ]))
    return b


def boite_a_outils(genre):
    """Section transversale : les gestes d'analyse, selon le genre."""
    g = _genre(genre)
    b = [("saut",),
         ("h2", "I bis. Boîte à outils — les gestes de l'analyse"),
         ("p", "Ce qui suit n'est pas à apprendre par cœur : c'est à garder "
               "sous la main pendant qu'on travaille. Les trois premiers "
               "outils valent pour tous les textes ; les trois derniers sont "
               "propres au genre de l'œuvre étudiée ici.")]
    for titre, corps in _OUTILS_COMMUNS:
        b.append(("encadre", "methode", titre, corps))
    b.append(("p", "**Outils propres au genre : %s.**" % g))
    for titre, corps in _OUTILS_GENRE[g]:
        b.append(("encadre", "methode", titre, corps))
    b.append(("encadre", "astuce", "Le brouillon en quatre colonnes", [
        "Avant de rédiger, partagez une page de brouillon en quatre colonnes : "
        "**citation** | **procédé** | **effet** | **axe**.",
        "Remplissez la première colonne en relisant le texte, sans réfléchir "
        "au plan. Puis les deux suivantes. La quatrième colonne se remplit "
        "toute seule : les lignes se regroupent, et les groupes sont vos axes.",
        "Ce tableau évite les deux fautes les plus coûteuses — le plan "
        "linéaire, et l'axe qu'on ne peut pas prouver.",
    ]))
    return b


# ═══════════════════════════════════════════════ NUMÉROTATION DES RUBRIQUES
# Les branches de la carte mentale et les exercices bilan sont conditionnels :
# sans axes, pas de branche « axes » ; sans QCM, pas d'exercice « QCM ». Écrire
# le numéro dans le titre supposait donc que tout soit toujours rendu — et la
# carte sautait de la « Branche 5 » à la « Branche 8 », pendant que l'annonce
# promettait six exercices là où le cahier en imprimait sept.
#
# Le titre ne porte donc plus de numéro : il est posé à la fin, sur les seules
# rubriques présentes, et l'annonce les compte au lieu de les réciter. Une
# rubrique ajoutée ou retirée renumérote les suivantes toute seule.

_NB = {0: "Aucun", 1: "Un", 2: "Deux", 3: "Trois", 4: "Quatre", 5: "Cinq",
       6: "Six", 7: "Sept", 8: "Huit", 9: "Neuf", 10: "Dix", 11: "Onze",
       12: "Douze"}


def _numeroter(blocs, etiquette):
    """Numérote les titres « <etiquette> — … » et renseigne l'annonce.

    Le gabarit « {N} » d'un paragraphe est remplacé par le nombre de titres
    effectivement numérotés : une annonce ne peut donc plus contredire ce
    qui la suit.
    """
    tete = etiquette + " —"
    total = sum(1 for x in blocs
                if x[0] == "h3" and isinstance(x[1], str)
                and x[1].startswith(tete))
    out, k = [], 0
    for x in blocs:
        if x[0] == "h3" and isinstance(x[1], str) and x[1].startswith(tete):
            k += 1
            out.append(("h3", x[1].replace(tete, "%s %d —" % (etiquette, k), 1)))
        elif x[0] == "p" and isinstance(x[1], str) and "{N}" in x[1]:
            out.append(("p", x[1].replace("{N}", _NB.get(total, str(total)))))
        else:
            out.append(x)
    return out


# ═══════════════════════════════════════════════════════════ CARTE MENTALE
def carte_mentale(titre_oeuvre, fiches, axes=None, themes=None, oeuvre=None):
    """L'œuvre sur une page, construite depuis le cahier lui-même.

    Aucune branche n'est inventée : les textes viennent des six fiches, les
    axes de la section 6, les thèmes du relevé final. Une carte mentale qui
    n'aurait pas la même carte que le cahier serait un piège pour l'élève.
    """
    b = [("saut",),
         ("h2", "6 quater. Carte mentale de l'œuvre"),
         ("p", "Une carte mentale ne se lit pas : elle se refait. Recopiez "
               "celle-ci au centre d'une feuille, puis complétez-la de "
               "mémoire, une branche à la fois. Ce que vous ne parvenez pas à "
               "compléter vous dit exactement ce qu'il vous reste à relire."),
         ("p", "**Au centre de la carte : %s.**" % titre_oeuvre)]

    if oeuvre:
        b.append(("h3", "Branche — La structure de l'œuvre"))
        b.append(("p", "Relevée dans l'œuvre elle-même, non dans une notice. "
                       "Savoir où l'on est quand on cite : c'est la première "
                       "chose que le correcteur vérifie."))
        b.append(("grille", [["Partie", "Ce qui s'y passe"]]
                  + [list(x) for x in oeuvre["structure"]]))

        b.append(("h3", "Branche — Qui est qui"))
        b.append(("grille", [["Figure", "Ce qu'elle est dans l'œuvre"]]
                  + [list(x) for x in oeuvre["personnages"]]))

        b.append(("h3", "Branche — Les lieux"))
        b += [("puce", x) for x in oeuvre["lieux"]]

        b.append(("h3", "Branche — Les moments à savoir situer"))
        b.append(("p", "Dans l'ordre. Un candidat qui ne sait pas situer un "
                       "passage ne peut pas l'introduire."))
        b += [("num", x) for x in oeuvre["moments"]]

    b.append(("h3", "Branche — Les textes étudiés"))
    b.append(("grille", [["Texte", "Ce qu'il établit"]]
              + [[f["titre"], f["repere"]] for f in fiches]))

    if axes:
        b.append(("h3", "Branche — Les axes de lecture"))
        b.append(("p", "Chaque axe traverse plusieurs textes. C'est ce qui en "
                       "fait un axe, et non un thème."))
        b.append(("grille", [["Axe", "Ce que le cahier en dit"]]
                  + [[t, (p[0] if isinstance(p, (list, tuple)) and p else "")[:220]]
                     for t, p in axes]))

    if themes:
        b.append(("h3", "Branche — Les thèmes et où les trouver"))
        b.append(("grille", [["Thème", "Où l'observer"]]
                  + [list(l) for l in themes]))

    b.append(("h3", "Branche — Les procédés à savoir nommer"))
    b.append(("p", "Relevez dans les six fiches les procédés que le cahier "
                   "nomme, et notez pour chacun **un** exemple. Un procédé "
                   "sans exemple ne sert à rien le jour de l'épreuve ; un "
                   "exemple sans nom de procédé non plus."))

    b.append(("encadre", "astuce", "Refaire la carte en cinq minutes", [
        "Feuille blanche, titre de l'œuvre au centre, cinq branches tracées "
        "avant d'écrire quoi que ce soit.",
        "Remplissez d'abord ce qui vient sans effort. Encerclez ensuite les "
        "branches restées vides : c'est votre programme de révision, et il "
        "est établi en cinq minutes plutôt qu'en trois heures de relecture.",
        "Refaites l'exercice trois jours plus tard sans regarder la première "
        "carte. Ce que vous retrouvez deux fois est acquis.",
    ]))
    return _numeroter(b, "Branche")


# ═════════════════════════════════════════════════════ FICHE DE LECTURE
def fiche_lecture(titre_oeuvre, auteur, genre):
    """Formulaire à remplir par l'élève. Le cahier fournit le cadre, pas les
    réponses : une fiche déjà remplie ne s'apprend pas."""
    g = _genre(genre)
    propre = {
        "roman": [["Narrateur et point de vue",
                   "Qui raconte ? Sait-il tout, ou seulement ce que sait un "
                   "personnage ? Relevez un indice."],
                  ["Schéma narratif",
                   "Situation initiale, élément perturbateur, péripéties, "
                   "dénouement, situation finale."],
                  ["Un passage de description",
                   "Référence, ce qui est décrit, et ce que la description "
                   "apprend sur le personnage qui regarde."]],
        "théâtre": [["Structure",
                     "Nombre d'actes et de scènes. Où se situe le nœud ? Où "
                     "le dénouement ?"],
                    ["Espace et temps",
                     "Où se joue la pièce ? En combien de temps ? Que "
                     "produit ce resserrement ?"],
                    ["Une didascalie qui compte",
                     "Laquelle, et ce qu'elle change à la scène où elle "
                     "figure."]],
        "poésie": [["Composition du recueil",
                    "Combien de sections ? Quel est leur ordre, et pourquoi "
                    "cet ordre ?"],
                   ["Formes employées",
                    "Quels mètres ? Quelles strophes ? Quelles dispositions "
                    "de rimes ?"],
                   ["Deux poèmes qui se répondent",
                    "Lesquels, et ce que leur rapprochement fait apparaître."]],
    }[g]

    lignes = [["Titre complet", titre_oeuvre],
              ["Auteur, dates", "%s — à compléter" % auteur],
              ["Genre", g],
              ["Date et lieu de publication", "à compléter"],
              ["Contexte en trois lignes",
               "Ce qui se passe dans le pays et dans la littérature au moment "
               "où l'œuvre paraît."],
              ["Résumé en dix lignes",
               "Sans jugement ni commentaire : ce qui se passe, et dans quel "
               "ordre."]]
    lignes += propre
    lignes += [
        ["Trois thèmes majeurs",
         "Pour chacun, une référence précise dans l'œuvre."],
        ["Cinq citations apprises par cœur",
         "Courtes. Avec leur référence. Choisies pour être réutilisables dans "
         "plusieurs sujets."],
        ["Le passage qui vous a le plus frappé",
         "Lequel, et pourquoi. Cette ligne n'est pas un ornement : c'est elle "
         "qui nourrira les deux points d'originalité de la grille."],
        ["Une objection à l'œuvre",
         "Ce que vous lui reprochez, ou ce qui vous a résisté. Un lecteur qui "
         "n'a rien à objecter n'a pas lu de près."],
        ["Deux œuvres à rapprocher",
         "Une du programme, une de votre choix. Dire en une phrase ce que le "
         "rapprochement éclaire."],
    ]

    return [("saut",),
            ("h2", "3 bis. Fiche de lecture globale"),
            ("p", "À remplir soi-même, à la main, une fois l'œuvre lue en "
                  "entier. Le cahier donne le cadre et ne donne pas les "
                  "réponses : une fiche recopiée ne s'apprend pas, une fiche "
                  "remplie s'est déjà à moitié apprise."),
            ("grille", [["Rubrique", "Ce qu'on y écrit"]] + lignes),
            ("encadre", "astuce", "La règle des deux relectures", [
                "Remplissez la fiche une première fois **sans rouvrir "
                "l'œuvre**. Vous verrez tout de suite ce qui manque.",
                "Rouvrez alors le livre pour les seules rubriques restées "
                "vides. C'est trois fois plus rapide qu'une relecture "
                "complète, et cela fixe mieux.",
            ])]


# ══════════════════════════════════════════════════════ EXERCICES BILAN
def exercices_bilan(titre_oeuvre, fiches, themes=None, oeuvre=None):
    """Batterie d'exercices sur l'œuvre entière.

    Tous portent sur ce que le cahier a établi : les six textes, leurs
    repères, les thèmes relevés. Aucun ne demande une information que le
    cahier n'aurait pas donnée.
    """
    b = [("saut",),
         ("h2", "6 quinquies. Faire le point sur l'œuvre entière"),
         ("p", "{N} exercices, à faire sans rouvrir le cahier. Les corrigés "
               "ne sont pas donnés : ils sont dans les pages qui précèdent, et "
               "les y chercher fait partie de l'exercice.")]

    b.append(("h3", "Exercice — Associer chaque texte à ce qu'il établit"))
    b.append(("p", "Reliez chaque texte de la colonne de gauche à la "
                   "proposition qui lui correspond. Les propositions ont été "
                   "mélangées."))
    n = len(fiches)
    # Rotation d'une demi-longueur : c'est une permutation complète, sans
    # point fixe et sans doublon. Un « mélange » calculé par (i*3+1) % 6 ne
    # donnerait que deux propositions distinctes, répétées trois fois —
    # l'exercice serait insoluble.
    melange = fiches[n // 2:] + fiches[:n // 2]
    b.append(("grille", [["Texte", "Proposition (dans le désordre)"]]
              + [[fiches[i]["titre"], "%s. %s" % (chr(97 + i),
                                                  melange[i]["repere"])]
                 for i in range(n)]))

    b.append(("h3", "Exercice — Remettre dans l'ordre de l'œuvre"))
    b.append(("p", "Les six textes étudiés sont donnés ci-dessous dans le "
                   "désordre. Rétablissez l'ordre dans lequel ils "
                   "apparaissent dans l'œuvre, et justifiez votre premier et "
                   "votre dernier choix."))
    # Un autre ordre que celui de l'exercice 1 : sinon le second exercice
    # donne la réponse du premier.
    b += [("puce", f["titre"]) for f in fiches[::-1]]

    if oeuvre and oeuvre.get("qcm"):
        b.append(("h3", "Exercice — Avez-vous lu l'œuvre ? (QCM)"))
        b.append(("p", "Une seule réponse par question. Les questions portent "
                       "sur le texte, non sur le cahier : on n'y répond pas "
                       "sans avoir lu."))
        for k, (q, rep) in enumerate(oeuvre["qcm"], 1):
            b.append(("p", "**%d.** %s" % (k, q)))
            # La bonne réponse est toujours la première du module : on la
            # déplace selon le rang de la question, sans quoi l'élève
            # répondrait « a » six fois de suite.
            d = k % len(rep)
            melange = rep[-d:] + rep[:-d] if d else list(rep)
            b += [("puce", "%s) %s" % (chr(97 + i), x))
                  for i, x in enumerate(melange)]
        b.append(("h3", "Exercice — Vrai ou faux, et justifiez"))
    else:
        b.append(("h3", "Exercice — Vrai ou faux, et justifiez"))
    b.append(("p", "Une réponse sans justification ne compte pas. La "
                   "justification doit citer l'œuvre."))
    b += [("num", x) for x in [
        "Chacun des six textes étudiés appartient à une partie différente de "
        "l'œuvre.",
        "Un axe de lecture et un thème sont deux noms pour la même chose.",
        "Le repérage d'un procédé suffit à en faire une analyse.",
        "Une citation peut être raccourcie sans qu'on le signale, à condition "
        "de ne pas en changer le sens.",
        "Dans un commentaire composé, on suit l'ordre du texte.",
        "La conclusion d'un devoir vaut autant de points que l'introduction.",
    ]]

    b.append(("h3", "Exercice — Compléter"))
    b.append(("p", "Recopiez et complétez ces phrases. Chaque réponse figure "
                   "dans le cahier."))
    b += [("num", x) for x in [
        "L'œuvre étudiée s'intitule ……… ; elle a été publiée en ……… .",
        "Les six textes étudiés dans ce cahier se situent respectivement "
        "dans ……… .",
        "Trois procédés que le cahier m'a appris à nommer sont ………, ……… et "
        "……… .",
        "Le devoir de type examen dure ……… heures et propose ……… sujets, dont "
        "le candidat traite ……… .",
        "La grille d'évaluation comporte ……… critères, pour un total de ……… "
        "points.",
    ]]

    if themes:
        b.append(("h3", "Exercice — Retrouver les références"))
        b.append(("p", "Pour chaque thème, citez **un** passage précis de "
                       "l'œuvre, avec sa référence. Le cahier en donne "
                       "plusieurs : n'en recopiez pas la liste, choisissez."))
        b.append(("grille", [["Thème", "Ma référence"]]
                  + [[l[0], "…"] for l in themes]))
    else:
        b.append(("h3", "Exercice — Retrouver les références"))
        b.append(("p", "Dressez la liste des thèmes majeurs de l'œuvre. Pour "
                       "chacun, citez un passage précis, avec sa référence."))

    b.append(("h3", "Exercice — Écrire"))
    b += [("num", x) for x in [
        "**En dix lignes.** Présentez l'œuvre à quelqu'un qui ne l'a pas lue, "
        "sans en raconter la fin, et en donnant une raison de la lire.",
        "**En vingt lignes.** Choisissez deux des six textes étudiés et "
        "montrez ce que leur rapprochement fait apparaître, que la lecture "
        "séparée ne montrait pas.",
        "**En une phrase.** Formulez la question à laquelle, selon vous, "
        "cette œuvre répond. C'est l'exercice le plus court et le plus "
        "difficile : il vaut la peine d'y revenir plusieurs fois.",
    ]]

    b.append(("encadre", "saviez", "Pourquoi le cahier ne donne pas les corrigés",
              ["Chercher une réponse dans un livre qu'on a déjà lu fixe la "
               "mémoire bien mieux que la lire dans un corrigé. Le phénomène "
               "est connu des enseignants : on retient ce qu'on a eu du mal à "
               "retrouver.",
               "Les six exercices ci-dessus ont donc leurs réponses dans les "
               "pages qui précèdent, et nulle part ailleurs. Le temps passé à "
               "les y chercher n'est pas perdu : c'est une révision."]))
    return _numeroter(b, "Exercice")


def blocs(titre_oeuvre, auteur, genre, fiches, axes=None, themes=None,
          oeuvre=None):
    """Les quatre sections, dans l'ordre où elles entrent dans le cahier."""
    return (boite_a_outils(genre)
            + carte_mentale(titre_oeuvre, fiches, axes, themes, oeuvre)
            + fiche_lecture(titre_oeuvre, auteur, genre)
            + exercices_bilan(titre_oeuvre, fiches, themes, oeuvre))
