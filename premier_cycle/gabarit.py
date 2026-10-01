# -*- coding: utf-8 -*-
"""Le plan d'une étude d'œuvre au premier cycle, et ses pièces répétées.

Une étude, ici, tient en sept temps. Ils reviennent identiques pour les douze
œuvres, parce qu'un élève qui a compris le parcours en sixième le retrouve en
troisième sans avoir à le réapprendre :

    1. J'ouvre le livre        entrée, hypothèse, contrat, journal de lecture
    2. L'auteur et son livre   biographie, genre, structure relevée dans l'œuvre
    3. Qui est qui             la galerie des personnages, et un jeu pour la fixer
    4. Je lis l'œuvre          six **lectures suivies** : situation, extrait,
                               grille à compléter, confrontation et bilan
    5. J'écris                 les productions du premier cycle, par l'exemple
    6. Je joue et je révise    grilles, QCM, carte mentale
    7. Je m'évalue             étude de texte · correction orthographique ·
                               expression écrite, au format MINESEC

Deux principes gouvernent l'écriture et ne se négocient pas.

**Le manuel parle à l'élève.** Tout est à la première personne, et ce qui
regarde le professeur (durées, calendrier, conduite de séance) part dans un
encadré « Côté enseignant » à la fin de la section, jamais en tête.

**Une leçon commence par un modèle, jamais par une consigne.** Les six
productions écrites suivent donc toujours la même marche : un texte annoté
❶❷❸ → des questions sur les étapes du modèle → l'élève énonce la règle → la
règle → une imitation sur un **autre** sujet.
"""
from kit import cases, enc, grille, h1, h2, h3, lignes, num, p, pi, puce, saut


# --------------------------------------------------------- 1. J'ouvre le livre

def ouvrir(titre, auteur, questions_couverture, promesses, journal_exemple):
    """L'entrée dans l'œuvre, écrite pour celui qui n'a encore rien lu.

    Les questions de la première page n'ont pas de mauvaise réponse : le livre
    est fermé, personne ne peut se tromper. C'est fait exprès — une première
    page où l'on peut échouer décourage avant d'avoir commencé.
    """
    b = [h2("1. J'ouvre le livre"),
         p("Tu n'as encore rien lu. C'est le bon moment : personne ne peut te "
           "donner tort, puisque le livre est fermé. Écris ce que tu crois. "
           "À la dernière page de l'étude, tu reliras cette feuille — et tu "
           "verras tout ce que **tu** auras appris entre les deux."),
         h3("J'observe le titre et la couverture")]
    b += [num(q) for q in questions_couverture]
    b += lignes(3)
    b.append(h3("Mon hypothèse de lecture"))
    b.append(p("Remplis ce tableau **au crayon**. Tu ne le reliras qu'à la fin."))
    b.append(grille([["Ma question", "Ce que je crois aujourd'hui",
                      "Ce que j'ai découvert (à remplir à la fin)"]]
                    + [[q, "", ""] for q in promesses]))
    b.append(h3("Mon contrat de lecture"))
    b.append(p("Je m'engage à repérer, pendant toute ma lecture :"))
    b += cases(["**qui parle** et à qui,",
                "**où** et **quand** se passe chaque histoire,",
                "un **mot que je ne comprends pas** par séance — et je le note,",
                "une **phrase que j'aimerais savoir écrire**,",
                "ce qui m'a fait **rire**, et ce qui m'a mis **en colère**."])
    b.append(h3("Mon journal de lecture"))
    b.append(p("Trois lignes suffisent. Un journal qu'on ne tient pas ne sert "
               "à rien ; un journal de trois lignes se tient jusqu'au bout."))
    b.append(grille([["Date", "J'ai lu…", "Ce que j'ai compris",
                      "Ce que je n'ai pas compris"], journal_exemple]
                    + [["", "", "", ""] for _ in range(7)]))
    b.append(enc("astuce", "Comment lire une œuvre longue sans se décourager", [
        "Ne lis pas tout d'un coup : lis **un chapitre par jour**, comme on "
        "mange un plat chaud — cuillerée par cuillerée.",
        "Quand un mot te bloque, **saute-le** et continue. Reviens-y après. Un "
        "dictionnaire ouvert toutes les trois lignes tue le plaisir.",
        "Raconte à quelqu'un ce que tu viens de lire. Si tu y arrives, c'est "
        "que tu as compris. Si tu bafouilles, relis la page."]))
    b.append(saut())
    return b


# ------------------------------------------------------ 4. La lecture suivie

def lecture_suivie(numero, titre, situation, texte, source, questions,
                   grille_lecture, bilan, encadres=(), forme=None):
    """Une séance de lecture suivie, dans l'ordre officiel de la démarche.

    **Situation → lecture → grille → confrontation et bilan.** La grille est
    donnée avec son axe **nommé** et son outil de langue **fourni** ; la
    colonne des passages reste vide, parce que c'est là, et là seulement, que
    se trouve le travail de l'élève.
    """
    b = [h3("Lecture suivie n° %d — %s" % (numero, titre)),
         enc("lire", "Situation du passage", situation),
         ("extrait", texte, source) if forme is None
         else ("extrait", texte, source, forme)]
    for typ, t, corps in encadres:
        b.append(enc(typ, t, corps))
    b.append(p("**J'observe et je réponds.**"))
    for q in questions:
        b.append(num(q))
        b += lignes(2)
    b.append(p("**Ma grille de lecture.** L'axe et l'outil sont écrits ; à toi "
               "de trouver dans le texte les passages qui le prouvent."))
    b.append(grille([["Ce que je cherche", "L'outil qui le montre",
                      "Les passages du texte (à relever)"]]
                    + [[a, o, ""] for a, o in grille_lecture]))
    b.append(enc("retiens", "Confrontation et bilan", bilan))
    return b


# ------------------------------------------------ 5. Les productions écrites

def production(type_texte, objectif, modele, annotations, questions, regle,
               exercices, astuce=None):
    """Une leçon d'expression écrite : le modèle d'abord, la règle après.

    `modele` est un texte **déjà rédigé et numéroté ❶❷❸** ; `annotations`
    nomme chaque étape. Les questions portent sur les étapes de ce modèle —
    jamais sur une définition à réciter. L'élève formule la règle lui-même,
    la lit ensuite, puis l'imite sur un **autre** sujet : imiter le sujet du
    modèle revient à le recopier.
    """
    b = [h3("J'écris : %s" % type_texte),
         enc("objectif", "Objectif",
             ["À la fin de cette leçon, **je** serai capable de " + objectif,
              "☐ je sais le faire      ☐ je dois revoir"]),
         p("**J'observe ce modèle.** Il est déjà écrit ; les numéros montrent "
           "comment il a été fabriqué."),
         ("extrait", modele, "Texte composé pour la leçon")]
    b.append(grille([["Étape", "Ce qu'elle fait dans le texte"]] + annotations))
    b.append(p("**Je manipule.**"))
    for q in questions:
        b.append(num(q))
        b += lignes(2)
    b.append(num("**Formule maintenant la règle toi-même**, avec tes mots."))
    b += lignes(3)
    b.append(enc("methode", "Je retiens la règle", regle))
    if astuce:
        b.append(enc("astuce", astuce[0], astuce[1]))
    b.append(p("**Je m'exerce.**"))
    for e in exercices:
        b.append(puce(e))
        b += lignes(2)
    return b


# ------------------------------------------------------------- 7. L'évaluation

def epreuve_etude_texte(titre, chapeau, texte, source, comprehension, langue,
                        forme=None):
    """Étude de texte au format MINESEC : I. Compréhension /10 · II. Langue /10."""
    b = [h3("Épreuve n° 1 — Étude de texte  ·  1 heure  ·  /20"),
         enc("examen", titre, [chapeau]),
         ("extrait", texte, source) if forme is None
         else ("extrait", texte, source, forme),
         p("**I. Compréhension du texte  —  10 points**")]
    for i, (q, pts) in enumerate(comprehension, 1):
        b.append(num("%s  *(%s pt%s)*" % (q, pts, "s" if pts != "1" else "")))
        b += lignes(3)
    b.append(p("**II. Connaissance et maniement de la langue  —  10 points**"))
    for i, (q, pts) in enumerate(langue, 1):
        b.append(num("%s  *(%s pt%s)*" % (q, pts, "s" if pts != "1" else "")))
        b += lignes(3)
    return b


def epreuve_orthographe(texte_fautif, source, nb_fautes=15):
    """Correction orthographique : la consigne officielle, mot pour mot.

    Le texte porte des fautes semées ; le barème du premier cycle vaut vingt
    points pour quinze fautes, réparties en quatre catégories de poids
    différents. Le texte support est choisi **hors** des manuels de la
    collection, sinon l'élève retrouve la version correcte ailleurs et
    l'exercice ne mesure plus rien.
    """
    return [h3("Épreuve n° 2 — Correction orthographique  ·  45 minutes  ·  /20"),
            enc("examen", "Consigne", [
                "*« Le texte ci-après comporte des fautes. Corrigez-les en "
                "rayant d'un seul trait le mot incorrect et en écrivant le mot "
                "correct au-dessus. »*",
                "Ce texte contient **%d fautes**. Ni plus, ni moins : si tu en "
                "trouves seize, c'est que tu as corrigé un mot qui était juste "
                "— et cela coûte des points." % nb_fautes]),
            ("extrait", texte_fautif, source),
            grille([["Catégorie de faute", "Points par faute", "Nombre"],
                    ["Ponctuation, accent manquant", "0,5", "4"],
                    ["Orthographe d'usage (lettre oubliée, doublement)", "1", "4"],
                    ["Grammaire (accord du participe, sujet-verbe, adjectif)", "2", "4"],
                    ["Homophones (sens changé)", "2", "3"],
                    ["**Total**", "", "**20 points**"]]),
            enc("vigilance", "Le piège du candidat pressé", [
                "Chaque mot **correct** que tu barres te retire **0,5 point**. "
                "Relis deux fois avant de rayer.",
                "Commence par les accords : ce sont les fautes qui rapportent "
                "le plus (2 points pièce)."])]


def epreuve_expression(sujets):
    """Expression écrite : deux sujets au canevas MINESEC, au choix."""
    b = [h3("Épreuve n° 3 — Expression écrite  ·  2 heures  ·  /20"),
         p("**Traite un seul sujet, à ton choix.**")]
    for i, s in enumerate(sujets, 1):
        b.append(p("**SUJET %d — %s**" % (i, s["type"])))
        b.append(p(s["contexte"]))
        if s.get("citation"):
            b.append(("extrait", s["citation"], s["source"]))
        b.append(enc("examen", "Ta tâche", s["taches"]))
        b.append(grille([["Ce qui est noté", "Points"]] + s["bareme"]))
    return b


# ---------------------------------------------------------------- passerelles

def passerelles(titre, introduction, tableaux, debats, projet):
    """Ce qui relie les trois œuvres du volume.

    Trois livres reliés par une même classe ne sont pas trois livres : c'est
    une conversation. Cette section la rend visible — et elle ne renvoie
    jamais à un autre volume, que l'élève n'a pas entre les mains.
    """
    b = [h1(titre), p(introduction)]
    for sous_titre, entete, corps in tableaux:
        b.append(h3(sous_titre))
        b.append(grille([entete] + corps))
    b.append(h3("Trois débats pour la classe"))
    for d in debats:
        b.append(enc("jeu", d[0], d[1]))
    b.append(h3("Le projet du trimestre"))
    b.append(enc("defi", projet[0], projet[1]))
    b.append(saut())
    return b


def cote_enseignant(corps):
    """Ce qui revient au professeur — à la fin de la section, jamais en tête."""
    return [enc("vigilance", "Côté enseignant — conduite de la séquence", corps)]
