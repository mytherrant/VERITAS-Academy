# -*- coding: utf-8 -*-
"""
Réécriture des questions qui en répétaient une autre.

Le cahier posait ses questions dans trois rubriques successives — le carnet
de bord, le contrôle de lecture, le QCM final — et les trois posaient les
mêmes. L'élève répondait trois fois à « Pourquoi Meka est-il arrêté ? » en
croyant avancer. `structure.py` en a relevé quarante-huit occurrences.

**Le principe retenu : une rubrique, un métier.**

  Carnet de bord      accompagne la lecture, chez soi, partie par partie.
                      C'est lui qui pose les questions de FAIT : qui, où,
                      quand, comment. Il garde donc ses questions.
  Contrôle de lecture se passe en classe, en quinze minutes, et vérifie que
                      l'œuvre a été lue. Il ne peut pas redemander ce que le
                      carnet a déjà fait écrire : il demande autre chose —
                      **situer, ordonner, attribuer, citer exactement**, et
                      une trace personnelle qui ne se copie pas.
  QCM final           est un test de reconnaissance sur l'œuvre entière. Il a
                      le droit de revenir sur un fait capital ; il n'a pas le
                      droit de recopier une question mot pour mot.

Toutes les réponses aux questions nouvelles sont établies ailleurs dans le
cahier — dans `oeuvres.py`, relevé sur les œuvres elles-mêmes. Aucune ne
demande un fait que le cahier n'aurait pas donné.

La table ci-dessous se lit : ancienne question → nouvelle. Le remplacement
est appliqué par `builder._reecrire_questions`, qui **signale toute entrée
qui ne trouve plus sa cible** : une table de réécriture muette pourrit sans
qu'on le sache.
"""

REECRITURES = {

    # ═════════════════════════════════════════════════════════ VIEUXNEGRE
    "vieuxnegre": [
        ("Pour quels motifs exacts Meka est-il arrêté par les gardes, la "
         "nuit de la fête ?",
         "Remettez dans l'ordre les cinq moments de la troisième partie : "
         "l'arrestation, l'errance nocturne, la nuit au poste de police, "
         "l'orage, le retour au village."),

        ("Comment le Père Vandermayer traite-t-il Meka juste après la remise "
         "de la médaille ?",
         "Le discours officiel résume la vie de Meka en deux dons. Citez-les "
         "exactement, entre guillemets."),

        ("Quel est le nom du messager qui apporte la nouvelle au village "
         "d'Engamba, et d'où revient-il ?",
         "Qui sont, pour Meka : Kelara, Engamba, Amalia, Mvondô ? Une ligne "
         "chacun."),
    ],

    # ══════════════════════════════════════════════════════════ LIONPERLE
    "lionperle": [
        ("Que répond Sidi lorsque Lakounlé lui propose de l'épouser malgré "
         "tout, sans dot ?",
         "Les trois actes portent chacun un moment du jour. Nommez-les dans "
         "l'ordre."),

        ("Pourquoi Sidi décide-t-elle finalement d'aller souper chez "
         "Baroka ?",
         "Qui, à la dernière page, reste seul en scène — et avec quoi ?"),

        ("Quelle vérité Sidi révèle-t-elle en revenant, en larmes, de chez "
         "Baroka ?",
         "Le titre nomme deux êtres. Qui est le lion, qui est la perle ? Une "
         "phrase de justification pour chacun."),

        ("Quel message Sadikou vient-elle transmettre à Sidi de la part de "
         "Baroka ?",
         "Rangez ces trois faits dans l'ordre où la pièce les donne : "
         "l'invitation portée par Sadikou, la parution des photographies "
         "dans le magazine, le récit de la route et des arpenteurs."),

        ("Que réclame Sidi à Lakounlé avant d'accepter de l'épouser ?",
         "Où se joue la pièce ? De quel village Baroka est-il le Balé, et "
         "que veut dire ce mot ?"),

        # carnet contre carnet : la question de l'étape 3 reprenait celle de
        # l'étape 2. Elle porte désormais sur ce qui a fait changer Sidi
        # d'avis, non sur son refus, déjà travaillé.
        ("Pourquoi Sidi décide-t-elle d'aller souper chez Baroka, alors "
         "qu'elle avait d'abord refusé ?",
         "Quelle confidence Sadikou rapporte-t-elle à Sidi, et qu'est-ce "
         "qu'elle change à la décision de la jeune fille ?"),
    ],

    # ═══════════════════════════════════════════════════════════════ NGUM
    "ngum": [
        ("Que propose Von Roehm à Dualla Manga dans sa cellule, en échange "
         "de sa signature (Acte IV, scène II) ?",
         "La pièce compte cinq actes. Dites, en une ligne pour chacun, ce "
         "qui s'y passe."),

        ("Pour quels chefs d'accusation exacts Ngos' a Din est-il jugé "
         "(Acte IV, scène III) ?",
         "Qui sont Von Roehm, Niedermeyer, Ngoso Din et Anjo Bell ? Une "
         "ligne chacun."),

        ("Pourquoi Dualla Manga refuse-t-il l'offre de fuite que lui propose "
         "Anjo Bell (Acte V, scène III) ?",
         "À quelle date la pièce situe-t-elle le procès et l'exécution ?"),

        # carnet contre carnet : l'étape 5 redemandait la phrase de refus
        # déjà relevée à l'étape 4. Elle demande maintenant ce que le refus
        # vaut à la pièce — ce qu'aucune autre rubrique ne demande.
        ("Relevez la phrase par laquelle Dualla Manga justifie son refus de "
         "fuir.",
         "En cinq lignes : que perdrait la pièce si Dualla Manga acceptait "
         "de fuir ?"),
    ],

    # ═════════════════════════════════════════════════════════ CAPITOLINE
    "capitoline": [
        ("Que fait papa Malin le jour où Mathieu le bat une deuxième fois au "
         "jeu de dames ?",
         "Rangez dans l'ordre du roman : l'embauche chez Chanas, le refus "
         "d'enterrer l'enfant, la lettre à Capitoline, le départ pour "
         "Douala."),
    ],

    # ═══════════════════════════════════════════════════════════ TENEBRES
    "tenebres": [
        ("Où se trouve exactement Marlow et ses compagnons au moment où il "
         "commence son récit ?",
         "Le récit compte trois chapitres. Dites en une ligne ce que chacun "
         "raconte."),

        ("Que répond Marlow à l'Intended lorsqu'elle lui demande de répéter "
         "les derniers mots de Kurtz ?",
         "Qui est la Promise, et à quel moment du récit paraît-elle ?"),

        ("Pourquoi le voyage de Marlow est-il retardé de plusieurs mois "
         "avant même de commencer ?",
         "Rangez dans l'ordre : la remontée du fleuve, l'engagement à la "
         "Compagnie, la visite à la Promise, l'attente au comptoir."),

        ("Que découvre Marlow, en réglant ses jumelles sur les piquets qui "
         "entourent la maison de Kurtz ?",
         "Qui est l'arlequin russe, et de qui se dit-il l'admirateur ?"),

        ("Quelles sont, selon vous, les toutes dernières paroles prononcées "
         "par Kurtz avant sa mort ?",
         "En cinq lignes : quel passage du récit vous a le plus arrêté, et "
         "pourquoi ? Citez-en au moins trois mots."),

        ("Qui prononce, le premier, le nom de M. Kurtz devant Marlow, et que "
         "dit-il de lui ?",
         "Qui est Fresleven, et qu'apprend-on de lui avant que Marlow ne "
         "parte ?"),
    ],

    # ═══════════════════════════════════════════════════════════ TARTUFFE
    "tartuffe": [
        ("Que répond Orgon chaque fois que Dorine lui parle de sa femme "
         "malade ?",
         "Qui, au premier acte, défend Tartuffe — et contre qui ?"),

        ("Que fait Tartuffe une fois qu'il possède la maison ?",
         "Qui, dans la maison, obtient la preuve contre Tartuffe — et par "
         "quel moyen ?"),
    ],

    # ═══════════════════════════════════════════════════════════ SAUVAGES
    "sauvages": [
        ("À qui le livre est-il dédié ? Que sait-on de cette personne ?",
         "Comment le livre s'ouvre-t-il, avant le poème lui-même ? Combien "
         "de mots compte environ ce seuil ?"),

        ("Relevez deux vers qui commencent par « et nous serons ». Que "
         "promettent-ils ?",
         "Nommez les quatre temps du poème, dans l'ordre où il les "
         "traverse."),
    ],

    # ════════════════════════════════════════════════════════════ STANCES
    "stances": [
        ("Dans « Le meilleur Moment des Amours », quel moment le poète "
         "préfère-t-il, et à quoi le préfère-t-il ?",
         "Les « Stances » comptent quatre sections. Nommez-les dans l'ordre "
         "du volume."),
    ],

    # ════════════════════════════════════════════════════════════ BALAFON
    "balafon": [
        ("Qu'est-ce qu'un balafon ? Pourquoi ce mot donne-t-il son titre au "
         "recueil ?",
         "Le recueil porte deux titres d'ensemble. Lesquels, et dans quel "
         "ordre viennent-ils ?"),
    ],
}
