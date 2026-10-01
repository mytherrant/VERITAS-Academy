# -*- coding: utf-8 -*-
"""
Génération du paratexte d'un cahier neuf.

Les cinq premiers cahiers possédaient déjà leur paratexte : le builder le
relisait dans la conversion markdown. Pour une œuvre qui n'a pas encore de
cahier, tout doit être écrit — c'est le rôle de ce module.

Il ne contient aucun contenu propre à une œuvre : il rend une structure à
partir d'un dictionnaire `INFOS` fourni par `<cahier>_front.py`. Les clés
attendues sont documentées dans `cle_attendues()`.
"""

# Un cahier peut renommer les rubriques qui supposent une intrigue : un recueil
# de poemes n'a ni personnages ni schema dramatique, mais il a des figures, des
# lieux et des mouvements. La cle facultative `libelles` porte ces variantes ;
# sans elle, ce sont les intitules du theatre et du roman qui s'appliquent.
LIBELLES = {
    "personnages_titre": "4. Liste des personnages",
    "personnages_entetes": ("Personnage", "Statut"),
    "etude_personnages_titre": "5 bis. Étude des personnages",
    "etude_personnages_entetes": ("Personnage", "Ce que l'étude doit établir"),
    "lieux_titre": "5 ter. Étude des lieux",
    "lieux_entetes": ("Lieu", "Valeur dramatique et symbolique"),
    "schema_titre": "5 quater. Schéma dramatique",
    "schema_entetes": ("Étape", "Contenu"),
}


def libelle(I, cle):
    return (I.get("libelles") or {}).get(cle, LIBELLES[cle])


CLES = (
    "titre", "sous_titre", "auteur", "edition", "niveau", "genre",
    "avertissements",        # [str]  — à vérifier par l'enseignant
    "note_enseignants",      # [str]
    "citation_guide",        # (texte, référence)
    "notions",               # [[notion, définition, où l'observer]]
    "biographie",            # [str]
    "contexte",              # [str]
    "structure",             # [[partie, contenu]]
    "personnages",           # [[nom, statut]]
    "paratexte",             # [(titre, [str])]
    "augurales",             # [str]
    "controles",             # [(titre, [question])]
    "negociation",           # [str]
    "devoirs_progressifs",   # [(titre, [str])]
    "etude_personnages",     # [[personnage, ce qu'il faut montrer]]
    "etude_lieux",           # [[lieu, valeur]]
    "schema",                # [[étape, contenu]]
    "axes",                  # [(axe, [str])]
    "oral",                  # [str]
    "exposes",               # [str]
    "themes",                # [[thème, occurrences]]
    "bibliographie",         # [str]
)


def cle_attendues():
    return CLES


def _tableau(entetes, lignes):
    return ("grille", [list(entetes)] + [list(l) for l in lignes])


def page_titre(I):
    b = [("p", "**CENTRE VÉRITAS — CAHIER DE L'ŒUVRE INTÉGRALE**"),
         ("p", "**%s**" % I["titre"]),
         ("pi", I["genre"]),
         ("p", "de %s — %s" % (I["auteur"], I["edition"])),
         ("p", "Cahier pédagogique — l'œuvre intégrale en séances"),
         ("p", "Document conforme à l'Approche par les Compétences (APC)"),
         ("p", "Classe de %s" % I["niveau"]),
         ("p", "Réalisé par Jacques Miterand TAKOU"),
         ("p", "Lycée bilingue de Nyalla — Douala"),
         ("encadre", "vigilance", "Droits et usage",
          ["Toute reproduction interdite sans l'accord de l'auteur du présent cahier. "
           "Les citations de l'œuvre sont reproduites à des fins strictement "
           "pédagogiques, dans les limites du droit de courte citation."])]
    if I.get("avertissements"):
        b.append(("encadre", "vigilance", "À vérifier par l'enseignant",
                  I["avertissements"]))
    b.append(("saut",))
    return b


def mode_emploi():
    """La page qui ouvre le cahier : ce que chaque repère demande.

    Elle est identique dans les neuf volumes — c'est le propre d'une
    collection. Un élève qui a compris les pictogrammes une fois les
    reconnaît dans tous les cahiers.
    """
    b = [("h1", "Comment utiliser ce cahier"),
         ("p", "Ce cahier n'est pas un cours à lire de bout en bout : c'est "
               "un **parcours**. On y avance séquence par séquence, et chaque "
               "séquence suit toujours le même chemin — on lit, on comprend, "
               "on observe, on analyse, on retient, on s'entraîne."),
         ("p", "**Les six lectures méthodiques sont le moteur de l'étude**, "
               "non son couronnement. Elles commencent tôt et sont réparties "
               "sur tout le parcours : c'est en travaillant un texte qu'on "
               "découvre l'outil dont on avait besoin, et non l'inverse."),
         ("p", "**Dix repères reviennent d'une page à l'autre.** Ils disent "
               "chacun ce qu'on attend de vous. Apprenez-les une fois : ils "
               "sont les mêmes dans tous les cahiers de la collection."),
         ("grille", [
             ["Repère", "Ce qu'il demande"],
             ["\U0001F4D6 Je lis",
              "Lire le passage en entier, sans crayon, puis une seconde fois "
              "en soulignant ce qui résiste."],
             ["\U0001F9ED Objectif",
              "Ce que la séance doit vous faire savoir faire. À relire à la "
              "fin pour vérifier."],
             ["\U0001F50E J'observe",
              "Relever avant d'interpréter. C'est ici que se remplit le "
              "tableau des quatre colonnes."],
             ["\U0001F9F0 Boîte à outils",
              "La notion dont la séance a besoin, expliquée au moment où "
              "elle sert."],
             ["\U0001F4A1 Astuce",
              "Un geste de méthode, court, immédiatement applicable."],
             ["\U0001F4DA Le saviez-vous ?",
              "Un fait de contexte ou de culture qui éclaire le passage — "
              "jamais un cours d'histoire."],
             ["⚠ Attention",
              "Une erreur fréquente, et comment l'éviter. Ce sont les points "
              "qui coûtent le plus cher en copie."],
             ["\U0001F3AF Je retiens",
              "L'essentiel de la séance, en quelques lignes. À savoir "
              "reformuler sans regarder."],
             ["✍ Je m'entraîne",
              "Une application immédiate, le jour même. Un outil qu'on "
              "n'emploie pas le jour où on l'apprend est perdu."],
             ["\U0001F9E0 Je fais le lien",
              "Rapprocher deux textes, deux séances, deux œuvres. C'est ce "
              "qui rapporte les points d'originalité."],
             ["\U0001F4DD Côté examen",
              "Ce que le jury attend précisément sur ce point : format, "
              "barème, formulation."],
         ]),
         ("encadre", "astuce", "Trois conseils pour tirer parti du cahier", [
             "**Une séance = une séquence.** Le tableau des quatre colonnes "
             "prend à lui seul vingt minutes, et c'est lui qui fait le "
             "travail.",
             "**Écrivez dans le cahier.** Les tableaux à points de suite, la "
             "fiche de lecture, la carte mentale à mi-parcours sont faits "
             "pour être remplis à la main. Un cahier propre est un cahier "
             "qui n'a pas servi.",
             "**Les devoirs entièrement rédigés se lisent, ne se recopient "
             "pas.** On les lit pour voir comment ils sont construits, puis "
             "on rédige les siens.",
         ]),
         ("encadre", "vigilance", "Côté enseignant", [
             "Le cahier est utilisable par l'élève seul, mais il porte aussi "
             "ce qui vous revient : objectifs de séance, corrigés, grilles "
             "d'évaluation harmonisées, pistes d'exploitation et durées "
             "indicatives.",
             "Les rubriques qui vous sont destinées sont toujours "
             "explicites — « Objectif de la séance », « Corrigé », « Grille "
             "d'évaluation », « Note aux enseignant(e)s ». Tout le reste "
             "s'adresse directement à l'élève.",
         ]),
         ("saut",)]
    return b


def sommaire(I=None):
    """Table des matières. Elle suit `fin()` : le lexique général décale la
    numérotation romaine des deux dernières parties, et le sommaire doit le
    dire, sans quoi il renvoie à des numéros qui n'existent pas."""
    I = I or {}
    entrees = [
        "Note aux enseignant(e)s",
        "I. Quelques notions littéraires",
        "II. Éléments bio-bibliographiques et contexte",
        "III. Étude de l'œuvre",
        "   1. Analyse du paratexte",
        "   2. Activités augurales et engagement de lecture",
        "   3. Contrôle de lecture",
        "   3 bis. Fiche de lecture globale",
        "   4. Négociation du projet d'étude",
        "   5. Devoirs progressifs",
        "   " + libelle(I, "etude_personnages_titre"),
        "   " + libelle(I, "lieux_titre"),
        "   " + libelle(I, "schema_titre"),
        "   6. Axes d'étude et démarches combinées",
        "   6 bis. Lectures méthodiques — six fiches complètes",
        "   6 ter. Lecture analytique — l'exercice oral",
        "   6 quater. Carte mentale de l'œuvre",
        "   6 quinquies. Faire le point sur l'œuvre entière",
        "   7. Exposés",
        "   8. Devoirs rédigés — commentaires composés et dissertations",
        "   9. Devoirs conformes au format MINESEC, corrigés et grilles",
        # La rubrique d'examen change de nom avec la classe visée : un cahier
        # de seconde prépare la Première, les autres le BAC. Une entrée fixe
        # annonçait au sommaire un titre absent du corps.
        ("   10. Vers la Première — Vers le Probatoire"
         if str(I.get("niveau", "")).lower().startswith("seconde")
         else "   10. Vers le Probatoire — Vers le BAC"),
        "   11. Avant l'épreuve — la dernière révision",
        "Grande boîte à outils — le mémento du lecteur",
        "IV. Relevé synthétique des thèmes",
    ]
    if I.get("lexique_general"):
        entrees += ["V. Lexique général", "VI. Bibliographie"]
    else:
        entrees += ["V. Bibliographie"]
    return [("h1", "Sommaire")] + [("p", e) for e in entrees] + [("saut",)]


def avant_fiches(I):
    """Tout ce qui précède la section 6 bis."""
    b = []

    b.append(("h1", "Note aux enseignant(e)s"))
    b += [("p", p) for p in I["note_enseignants"]]
    if I.get("citation_guide"):
        texte, ref = I["citation_guide"]
        b.append(("encadre", "citation", "Texte officiel", [texte, "— " + ref]))

    b.append(("h1", "I. Quelques notions littéraires"))
    b.append(("p", "Avant d'entrer dans l'œuvre, quelques notions sont à installer ou à "
                   "rappeler : le texte y recourt de façon dense et systématique."))
    b.append(_tableau(("Notion", "Définition brève", "Où l'observer dans l'œuvre"),
                      I["notions"]))

    b.append(("h1", "II. Éléments bio-bibliographiques et contexte"))
    b.append(("h2", "1. L'auteur"))
    b += [("p", p) for p in I["biographie"]]
    b.append(("h2", "2. Contexte de l'œuvre"))
    b += [("p", p) for p in I["contexte"]]
    b.append(("h2", "3. Structure de l'œuvre"))
    b.append(_tableau(("Partie", "Contenu dominant"), I["structure"]))
    b.append(("h2", libelle(I, "personnages_titre")))
    b.append(_tableau(libelle(I, "personnages_entetes"), I["personnages"]))

    b.append(("h1", "III. Étude de l'œuvre"))
    b.append(("h2", "1. Analyse du paratexte"))
    for titre, paras in I["paratexte"]:
        b.append(("h3", titre))
        b += [("p", p) for p in paras]

    b.append(("h2", "2. Activités augurales et engagement de lecture"))
    b += [("p", p) for p in I["augurales"]]

    b.append(("h2", "3. Contrôle de lecture"))
    b.append(("pi", "Barème indicatif : 5 points par question sur 20. Correction "
                    "collective immédiate, suivie de la négociation du projet d'étude."))
    for titre, questions in I["controles"]:
        b.append(("h3", titre))
        b += [("num", q) for q in questions]

    b.append(("h2", "4. Négociation du projet d'étude"))
    b += [("p", p) for p in I["negociation"]]

    b.append(("h2", "5. Devoirs progressifs"))
    for titre, contenu in I["devoirs_progressifs"]:
        b.append(("h3", titre))
        b += [("p", c) for c in contenu]

    b.append(("h2", libelle(I, "etude_personnages_titre")))
    b.append(_tableau(libelle(I, "etude_personnages_entetes"),
                      I["etude_personnages"]))

    b.append(("h2", libelle(I, "lieux_titre")))
    b.append(_tableau(libelle(I, "lieux_entetes"), I["etude_lieux"]))

    b.append(("h2", libelle(I, "schema_titre")))
    b.append(_tableau(libelle(I, "schema_entetes"), I["schema"]))

    b.append(("h2", "6. Axes d'étude et démarches combinées"))
    for titre, paras in I["axes"]:
        b.append(("h3", titre))
        b += [("p", p) for p in paras]
    return b


def apres_devoirs(I):
    """Sections 6 ter et 7, insérées entre les fiches et les devoirs rédigés."""
    b = [("h2", "6 ter. Lecture analytique — l'exercice oral")]
    b += [("p", p) for p in I["oral"]]
    b.append(("h2", "7. Exposés"))
    b += [("num", e) for e in I["exposes"]]
    return b


def fin(I):
    b = [("h1", "IV. Relevé synthétique des thèmes"),
         _tableau(("Thème", "Où il se manifeste"), I["themes"])]

    # Lexique général — indispensable en seconde : l'élève doit pouvoir
    # retrouver en un seul endroit tous les mots rencontrés dans le cahier.
    if I.get("lexique_general"):
        b.append(("h1", "V. Lexique général"))
        b.append(("p", "Tous les mots difficiles du cahier sont réunis ici, par ordre "
                       "alphabétique. Deux sortes de mots s'y trouvent : les mots de "
                       "l'œuvre, et les mots que le professeur emploie pour parler d'un "
                       "texte."))
        for titre, entrees in I["lexique_general"]:
            b.append(("h2", titre))
            b.append(_tableau(("Mot", "Ce que cela veut dire"), entrees))

    b.append(("h1", "VI. Bibliographie" if I.get("lexique_general")
              else "V. Bibliographie"))
    b += [("p", r) for r in I["bibliographie"]]
    return b


def lexique_extrait(entrees):
    """Petit tableau de mots, à placer juste après un extrait."""
    return _tableau(("Mot du texte", "Ce que cela veut dire"), entrees)
