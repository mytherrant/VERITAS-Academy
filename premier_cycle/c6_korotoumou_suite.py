# -*- coding: utf-8 -*-
"""6ᵉ — *Les Contes de Korotoumou* : écrire, jouer, s'évaluer.

Le recueil est fait de récits **dits** avant d'être écrits : les ateliers
d'écriture partent donc de l'oral — raconter, faire parler, chanter — et
remontent vers l'écrit. C'est l'ordre dans lequel ces contes ont réellement
été fabriqués.
"""
import jeux
import source
from gabarit import (epreuve_etude_texte, epreuve_expression,
                     epreuve_orthographe, production)
from kit import enc, grille, h2, h3, p, saut

CLE = "korotoumou"
SRC = "Amadou Koné, *Les Contes de Korotoumou*"
BORNES = ["PREMIÈRE PARTIE", "DES ANIMAUX ENTRE EUX", "LE JEU DES CONGCO",
          "LE MIEL", "LIÈVRE ET HYÈNE", "OISEAU MALAN", "CHIEN ET SINGE",
          "DEUXIÈME PARTIE", "DES HOMMES ENTRE EUX", "GNITORNI",
          "LA PROSCRITE", "NTÉGNAN", "LE PRINCE QUI", "LES TROIS FRÈRES",
          "TROISIÈME PARTIE", "DES HOMMES, DES ANIMAUX", "TCHIÈ",
          "L'ÉCUELLE", "TENDANI ITO", "SOUMAORO", "NOTES PÉDAGOGIQUES"]


# ==================================================== 5. Les productions

def partie5():
    b = [h2("5. J'écris — faire parler, faire faire"),
         p("Ces contes ont d'abord été **dits**, puis écrits. Les deux "
           "derniers ateliers du manuel suivent le même chemin : **le "
           "dialogue** (faire parler) et **le texte injonctif** (faire faire)."),
         p("Avec les quatre précédents — narration, description, portrait, "
           "argumentation — tu auras vu les **six** façons d'écrire du "
           "collège. Coche-les au fur et à mesure :"),
         ("puce", "☐  raconter (narration)      ☐  décrire (description)"),
         ("puce", "☐  peindre quelqu'un (portrait)      ☐  donner mon avis "
          "(argumentation)"),
         ("puce", "☐  faire parler (dialogue)      ☐  faire faire (injonctif)")]

    b += production(
        "le dialogue de conte",
        "écrire un dialogue où chaque personnage parle comme il est.",
        modele=(
            "❶ L'hyène arriva chez le lièvre avant le premier coq.\n"
            "❷ — Minanhanlan, il fait jour ! Lève-toi ! Regarde, le ciel "
            "rougit !\n"
            "❸ — Ce que tu vois rougir, répondit calmement le lièvre, c'est "
            "la torche que tu viens d'attacher à l'arbre.\n"
            "❹ — Moi ? Une torche ? Jamais de la vie ! s'indigna l'hyène, qui "
            "sentait encore la résine sur ses pattes.\n"
            "❺ — Alors va dormir. Nous partirons quand le jour se lèvera tout "
            "seul.\n"
            "❻ L'hyène s'en alla en traînant les pieds. Elle revint une heure "
            "plus tard."),
        annotations=[
            ["❶ La phrase de cadre",
             "Qui, où, quand — avant la première parole."],
            ["❷ La parole de l'impatient",
             "Trois phrases exclamatives en une réplique. On **entend** son "
             "excitation."],
            ["❸ La parole du calme",
             "Une seule phrase, longue, avec l'adverbe *calmement*. Le "
             "contraste fait tout."],
            ["❹ Le mensonge démasqué",
             "Le narrateur ajoute un détail que le personnage ignore : la "
             "résine sur les pattes."],
            ["❺ La réplique qui clôt",
             "Courte, sans discussion."],
            ["❻ La phrase de sortie",
             "Et la dernière ligne annonce déjà que ça va recommencer."]],
        questions=[
            "Compte les phrases dans la réplique de l'hyène, puis dans celle "
            "du lièvre. Que remarques-tu ?",
            "Relève les signes de ponctuation employés par l'hyène. Et par le "
            "lièvre ? Que t'apprend cette différence ?",
            "Où sont placés les verbes de parole ? Relève-les tous.",
            "Quelle information le narrateur donne-t-il, que l'hyène ignore ? "
            "Pourquoi est-ce drôle ?",
            "Relis la dernière ligne. En quoi annonce-t-elle la suite ?"],
        regle=[
            "Dans un dialogue, **on va à la ligne** et l'on met un **tiret** à "
            "chaque changement de personnage.",
            "Chaque personnage doit avoir **sa façon de parler** : phrases "
            "courtes et exclamations pour l'impatient, phrases posées pour le "
            "rusé. Si l'on peut échanger les répliques sans rien perdre, le "
            "dialogue est raté.",
            "Les **verbes de parole** varient (*répondit, s'indigna, "
            "protesta, murmura*) et peuvent se placer avant, après ou au "
            "milieu de la réplique. Quand ils suivent, le sujet passe derrière "
            "le verbe : *dit-il*.",
            "Le narrateur peut glisser, entre deux répliques, **une "
            "information que le personnage ignore**. C'est le meilleur moyen "
            "de faire rire sans commenter."],
        exercices=[
            "**Attribue.** Voici huit répliques mélangées et deux "
            "personnages — un glouton pressé, un sage patient. Range-les en "
            "deux colonnes, puis justifie chaque choix.",
            "**Varie.** Remplace les six « dit » de ce dialogue par des verbes "
            "précis. (Le professeur te donnera le texte.)",
            "**Écris seul.** Imagine le dialogue entre **le cafard et le "
            "lion** au moment où le lion s'invite dans « Le miel ». Dix "
            "répliques, quatre verbes de parole différents, une phrase de "
            "cadre au début et une phrase de sortie à la fin.",
            "**Joue-le.** À deux, devant la classe. Les auditeurs doivent "
            "dire, sans voir le texte, lequel est le glouton."])

    b += production(
        "le texte injonctif",
        "écrire les règles d'un jeu pour quelqu'un qui n'y a jamais joué.",
        modele=(
            "**La règle du jeu des cailloux (à deux joueurs)**\n"
            "❶ Il te faut : douze petits cailloux, un bâton pour tracer, un "
            "sol de terre battue, et un adversaire.\n"
            "❷ ❸ Trace d'abord deux rangées de six trous. Dépose ensuite deux "
            "cailloux dans chaque trou. Joue chacun ton tour : prends tous les "
            "cailloux d'un trou de ton camp et sème-les un par un dans les "
            "trous suivants, en tournant. Ramasse les cailloux du dernier trou "
            "s'ils sont exactement deux ou trois.\n"
            "❹ Le gagnant est celui qui a ramassé le plus de cailloux quand "
            "le plateau est vide.\n"
            "❺ Attention : ne sème jamais à l'envers, et ne compte pas à voix "
            "haute — ton adversaire compte pour toi."),
        annotations=[
            ["❶ Le matériel", "Y compris l'adversaire : on n'oublie rien."],
            ["❷ Les étapes dans l'ordre",
             "*Trace → dépose → joue → ramasse*. Aucune n'est déplaçable."],
            ["❸ Les verbes à l'impératif",
             "Deuxième personne du singulier. Pas de *tu*, pas de *il faut*."],
            ["❹ La condition de victoire",
             "Une règle du jeu sans condition de victoire n'est pas une règle "
             "du jeu."],
            ["❺ Les interdits, avec leur raison",
             "Deux interdits, chacun expliqué."]],
        questions=[
            "Relève les verbes. À quel mode ? Comment le reconnais-tu ?",
            "Quelle étape ne peut pas être déplacée ? Que se passerait-il ?",
            "Quelle information manquerait si l'on supprimait ❹ ?",
            "Réécris deux consignes à l'**infinitif**. Le texte gagne-t-il ou "
            "perd-il ?",
            "Dans le conte « Le jeu des congco'ngan », les règles du jeu ne "
            "sont jamais données. Cela te gêne-t-il en lisant ? Pourquoi, à "
            "ton avis, l'auteur ne les donne-t-il pas ?"],
        regle=[
            "Un texte injonctif **fait agir** : recette, règle du jeu, mode "
            "d'emploi, notice, consigne.",
            "Verbes à l'**impératif** ou à l'**infinitif** — jamais les deux "
            "mélangés.",
            "**À l'impératif, 2ᵉ personne du singulier, pas de *s* aux verbes "
            "du 1ᵉʳ groupe** : *joue*, *trace*, *sème* — sauf devant *en* et "
            "*y* : *sèmes-en*.",
            "Une règle du jeu comporte toujours : le **matériel**, le "
            "**déroulement**, la **condition de victoire**, les **interdits**."],
        exercices=[
            "**Conjugue à l'impératif** : *jouer, tracer, semer, prendre, "
            "aller, être, avoir, savoir*.",
            "**Corrige.** Quatre formes sont fautives : *joues chacun ton "
            "tour · trace deux rangées · sèmes les cailloux · prend le "
            "bâton · va chercher les pierres · sois patient*.",
            "**Écris seul.** Rédige les règles d'un jeu auquel tu joues dans "
            "ta cour : matériel, quatre étapes, condition de victoire, deux "
            "interdits avec leur raison.",
            "**Teste-les.** Donne ta feuille à deux camarades qui ne "
            "connaissent pas le jeu. S'ils jouent sans te poser de question, "
            "c'est gagné. Chaque question qu'ils posent est une consigne qui "
            "manque."])

    b.append(saut())
    return b


# ============================================================ 6. Je joue

def partie6():
    b = [h2("6. Je joue et je révise"), p("Livre fermé. On vérifie.")]
    corriges = []

    e, c = jeux.mots_meles("Le peuple des contes", [
        "lievre", "hyene", "elephant", "cafard", "coq", "renard", "chien",
        "singe", "lion", "panthere", "belier", "tortue", "Gnitorni", "Ngolo",
        "Ntegnan", "Soumaoro", "Korotoumou", "Kongodjan", "Fari", "genie"],
        graine=53)
    b += e
    corriges += c

    e, c = jeux.mots_croises("Les mots du conte", [
        ("CONTE", "Récit d'aventures imaginaires, d'abord dit puis écrit"),
        ("MORALE", "La leçon qui ferme le récit"),
        ("VEILLEE", "La soirée où l'on se réunit pour écouter"),
        ("OPPOSANT", "Celui qui bloque le héros, selon les Notes pédagogiques"),
        ("ADJUVANT", "Celui qui aide le héros"),
        ("GRIOTTE", "Celle qui garde la mémoire du village"),
        ("GENIE", "Fari, l'esprit qui habite la rivière"),
        ("SORCIERE", "Ce qu'est Gnitorni"),
        ("HYENE", "Elle veut toujours les paniers de demain"),
        ("RUSE", "L'arme du lièvre"),
        ("KONGODJAN", "La plantation de l'enfance"),
        ("CERMA", "La langue dans laquelle ces contes se disaient"),
    ], graine=37)
    b += e
    corriges += c

    e, c = jeux.qcm("As-tu lu les quatorze contes ?", [
        ("Qui est Korotoumou ?",
         ["l'auteur du livre", "la grande sœur du narrateur",
          "une sorcière", "une griotte"], 1),
        ("Comment s'appelle le village d'enfance du narrateur ?",
         ["Kekem", "Dioulasso", "Kongodjan", "Moskota"], 2),
        ("Dans « Le jeu des congco'ngan », à qui appartient l'éléphant ?",
         ["au lièvre", "aux génies", "à personne", "au chef du village"], 1),
        ("Que fait l'hyène pour faire croire qu'il fait jour ?",
         ["elle chante", "elle attache une torche allumée à un arbre",
          "elle réveille le coq", "elle allume un feu de brousse"], 1),
        ("Dans « Chien et Singe », qui creuse le puits ?",
         ["le singe", "le chien", "la panthère", "le bélier"], 1),
        ("Que signifie le nom « Gnitorni » ?",
         ["Dent pourrie", "Vieille femme", "Celle qui mange",
          "Longue nuit"], 0),
        ("Que signifie le surnom « Ntégnan » ?",
         ["le rusé", "le bon à rien, poursuivi par la fatalité",
          "le voyageur", "l'héritier"], 1),
        ("Comment s'appelle le génie de la rivière ?",
         ["Malan", "Fari", "Soumaoro", "Ngolo"], 1),
    ])
    b += e
    corriges += c

    e, c = jeux.vrai_faux("Vrai ou faux au village", [
        ("Le narrateur revient d'Amérique.", True,
         "Il le dit lui-même dans le prologue, pour appuyer son argument."),
        ("Korotoumou accepte tout de suite de raconter.", False,
         "Elle objecte le feuilleton, l'absence de public, l'oubli et la "
         "langue."),
        ("Le recueil compte quatorze contes en trois parties.", True,
         "Des animaux entre eux · Des hommes entre eux · Des hommes, des "
         "animaux, des objets."),
        ("L'hyène finit toujours par gagner.", False,
         "Elle perd chaque fois, et toujours par impatience ou gourmandise."),
        ("Ngolo échappe à sa mère parce qu'il court plus vite qu'elle.", False,
         "Son cheval est plus lent qu'elle : il s'en sort par la négociation "
         "puis par les trois objets magiques."),
        ("Dans « Chien et Singe », la panthère juge selon les faits.", False,
         "Elle donne raison au singe par solidarité entre animaux sauvages."),
    ])
    b += e
    corriges += c

    e, c = jeux.remise_en_ordre("La fuite de Ngolo", [
        "Gnitorni annonce à Ngolo qu'elle va enfin le manger.",
        "Ngolo demande un délai : qu'elle attende qu'il devienne un homme.",
        "Il obtient un second délai en se mariant, puis un troisième en ayant "
        "un enfant.",
        "Il consulte un grand sorcier et achète un cheval.",
        "Il jette derrière lui une brindille, puis un caillou.",
        "Il jette une bouteille d'eau : la mer s'étend et rejette Gnitorni.",
    ], graine=47)
    b += e
    corriges += c

    e, c = jeux.qui_suis_je("Devine qui parle", [
        ("Je vis très loin, dans un pays de gratte-ciel, et je demande à ma "
         "grande sœur de rallumer une veillée éteinte.", "le narrateur, frère "
         "de Korotoumou"),
        ("Je n'ai qu'une dent, longue et rougie par le tabac, et j'attends que "
         "mes enfants prononcent mon surnom.", "Gnitorni"),
        ("Je refuse le panier d'aujourd'hui parce que je veux les deux paniers "
         "de demain. Tous les jours.", "l'hyène"),
        ("Je suis à demi aveugle, à demi sourde, bossue et lépreuse ; la ville "
         "m'est interdite, et je suis la seule à savoir où est la reine.",
         "la vieille griotte proscrite"),
        ("On m'a offert une plume par oiseau pour que je puisse voler jusqu'à "
         "Dioulasso manger de la viande.", "l'hyène (« Oiseau Malan, Hyène et "
         "Chat »)"),
    ])
    b += e
    corriges += c

    b += jeux.carte_mentale(
        "Les Contes de Korotoumou", "LES CONTES DE KOROTOUMOU",
        [("Le cadre", ["un prologue : la veillée retrouvée",
                       "Kongodjan ≠ le village électrifié",
                       "la télévision contre la voix"]),
         ("Les trois parties", ["les animaux entre eux",
                                "les hommes entre eux",
                                "hommes, animaux et objets"]),
         ("Les personnages", ["des types, pas des individus",
                              "des noms qui sont des programmes",
                              "opposants et adjuvants"]),
         ("Les thèmes", ["la gourmandise punie", "la parole tenue",
                         "la mémoire menacée", "la justice de clan"]),
         ("Les procédés", ["le conte en randonnée", "la fuite magique",
                           "la fin étiologique", "le chant traduit"]),
         ("Ma question au livre", ["…", "…"])])

    b.append(saut())
    return b, corriges


# ======================================================== 7. Je m'évalue

ORTHO_FAUTIF = (
    "Un soir de saison seche, Korotoumou rassambla les enfants du village sous "
    "le grand arbre. La lune éclairait la cour les criquets chantait dans les "
    "herbes. Elle avait appris ces histoires a Kongodjan, quand elle était "
    "petite. Elle raconta le conte du lièvre et de l'hyène. Les enfants "
    "écoutait sans bouger. Quand elle imita la voix de l'hyène affamee, tous "
    "éclatèrent de rire. Puis elle se tut. « Pourquoi t'arrêtes-tu ? » "
    "demandèrent-ils. « Parce qu'un conte ne se raconte pas jusqu'au bout le "
    "premier soir », repondit-elle en souriant. Les enfants protestèrent, mais "
    "ils revinrent le landemain, et le surlendemain encore. S'est ainsi que la "
    "vieille conteuze leurs apprit la patiance sans jamais prononcer se mot. "
    "Aujourd'hui, la télévision parle plus fort que les grand-mères. Pourtant, "
    "aucune image ne remplacent une voix qui s'arrête au bon moment.")

ORTHO_CORRIGE = [
    ["1", "saison **seche**", "saison **sèche**", "accent grave manquant", "0,5"],
    ["2", "la cour **_** les criquets", "la cour **;** les criquets",
     "point-virgule manquant", "0,5"],
    ["3", "l'hyène **affamee**", "l'hyène **affamée**", "accent manquant", "0,5"],
    ["4", "**repondit**-elle", "**répondit**-elle", "accent manquant", "0,5"],
    ["5", "**rassambla**", "**rassembla**", "orthographe d'usage", "1"],
    ["6", "le **landemain**", "le **lendemain**", "orthographe d'usage", "1"],
    ["7", "la vieille **conteuze**", "la vieille **conteuse**",
     "orthographe d'usage", "1"],
    ["8", "la **patiance**", "la **patience**", "orthographe d'usage", "1"],
    ["9", "les criquets **chantait**", "les criquets **chantaient**",
     "accord sujet-verbe", "2"],
    ["10", "Les enfants **écoutait**", "Les enfants **écoutaient**",
     "accord sujet-verbe", "2"],
    ["11", "**leurs** apprit", "**leur** apprit",
     "*leur* pronom personnel est invariable", "2"],
    ["12", "aucune image ne **remplacent**", "… ne **remplace**",
     "le sujet *aucune image* est au singulier", "2"],
    ["13", "appris ces histoires **a** Kongodjan", "… **à** Kongodjan",
     "homophone : *à* préposition, *a* verbe avoir", "2"],
    ["14", "**S'est** ainsi que", "**C'est** ainsi que",
     "homophone : *c'est* = cela est", "2"],
    ["15", "prononcer **se** mot", "prononcer **ce** mot",
     "homophone : *ce* est un déterminant démonstratif", "2"],
]


def partie7():
    b = [h2("7. Je m'évalue — trois épreuves")]
    corriges = []

    texte = source.extrait(CLE, "L'hyène avait fourni un effort inhabituel",
                           mots=330, arret=[t for t in BORNES
                                            if "OISEAU MALAN" not in t])
    b += epreuve_etude_texte(
        "Oiseau Malan, Hyène et Chat",
        chapeau="Ce conte n'a pas été étudié en classe : c'est ta lecture "
                "personnelle qui parle. Pour une fois, l'hyène travaille — et "
                "son champ de fonio est superbe. C'est alors qu'un oiseau au "
                "chant étrange vient lui apporter une nouvelle.",
        texte=texte, source=SRC,
        comprehension=[
            ("Pourquoi la récolte de l'hyène s'annonce-t-elle si belle cette "
             "année-là ? Donne trois raisons tirées du texte.", "2"),
            ("Quelle nouvelle Malan apporte-t-il ? Où se passe la chose ?",
             "2"),
            ("Relève la phrase par laquelle Malan flatte l'hyène. Pourquoi "
             "commence-t-il par là ?", "2"),
            ("Quelle objection l'hyène fait-elle d'abord ? Comment Malan la "
             "résout-il ?", "2"),
            ("À ton avis, Malan dit-il la vérité ? Justifie ta réponse par un "
             "détail du texte.", "2")],
        langue=[
            ("Relève quatre verbes conjugués et donne leur infinitif et leur "
             "temps.", "2"),
            ("« L'hyène travaillait sans relâche. » Réécris cette phrase au "
             "passé composé, puis au futur simple.", "2"),
            ("Donne la nature et la fonction des mots soulignés par ton "
             "professeur dans la phrase : « Malan, l'oiseau au chant étrange, "
             "arriva un beau matin. »", "2"),
            ("Trouve dans le texte trois mots du champ lexical de "
             "l'agriculture.", "2"),
            ("Forme un nom à partir de chacun de ces verbes : *récolter, "
             "voler, travailler, informer*.", "2")])
    corriges += [h3("Épreuve 1 — Étude de texte : éléments de corrigé"),
                 grille([["Question", "Ce qu'on attend", "Pts"],
                         ["I.1", "Elle a semé son fonio au bon moment ; les "
                          "pluies sont tombées comme il fallait ; son terrain "
                          "convenait exactement au fonio. (Et elle a travaillé "
                          "sans relâche.)", "2"],
                         ["I.2", "À Dioulasso, à un jour de vol, de nombreux "
                          "animaux sont morts sans raison : buffles, cerfs, "
                          "moutons, cabris, renards, étendus partout.", "2"],
                         ["I.3", "« Tu fais l'admiration de nous tous. Et ton "
                          "champ est superbe. » Il flatte d'abord pour "
                          "endormir la méfiance : c'est la technique du piège.",
                          "2"],
                         ["I.4", "Elle ne sait pas voler et refuse d'abandonner "
                          "son champ. Malan propose que chaque oiseau de sa "
                          "famille lui donne une plume.", "2"],
                         ["I.5", "Non : l'histoire est trop belle, et Malan "
                          "insiste étrangement (« que d'autres te "
                          "cacheraient »). La suite le confirme — les Malans "
                          "reprennent leurs plumes en vol. Toute réponse "
                          "argumentée est acceptée.", "2"],
                         ["II.1", "Ex. : *avait fourni* (fournir, "
                          "plus-que-parfait) ; *travaillait* (travailler, "
                          "imparfait) ; *arriva* (arriver, passé simple) ; "
                          "*dit* (dire, passé simple).", "2"],
                         ["II.2", "Passé composé : *L'hyène a travaillé sans "
                          "relâche.* — Futur : *L'hyène travaillera sans "
                          "relâche.*", "2"],
                         ["II.3", "*Malan* : nom propre, sujet ; *l'oiseau au "
                          "chant étrange* : groupe nominal, apposition (mis "
                          "pour Malan) ; *un beau matin* : groupe nominal, "
                          "complément circonstanciel de temps.", "2"],
                         ["II.4", "Ex. : *fonio, plants, récolte, épis, "
                          "mauvaises herbes, champ, planter*.", "2"],
                         ["II.5", "récolte · vol · travail · information.",
                          "2"]])]

    b += epreuve_orthographe(ORTHO_FAUTIF,
                             "Texte composé pour l'épreuve, dans la manière du "
                             "recueil", nb_fautes=15)
    corriges += [h3("Épreuve 2 — Correction orthographique : corrigé"),
                 grille([["N°", "Écrit dans le texte", "Correction",
                          "Pourquoi", "Pts"]] + ORTHO_CORRIGE),
                 ("p", "**Total : 20 points.** Retirer **0,5 point** par mot "
                  "correct barré à tort.")]

    b += epreuve_expression([
        {"type": "Narration",
         "contexte": "Dans ce recueil, l'hyène perd toujours — non parce "
                     "qu'elle est faible, mais parce qu'elle ne peut pas "
                     "attendre. Le lièvre, lui, prend un peu chaque jour.",
         "citation": "Le problème avec toi, Hyène, est que n'écoutes pas quand "
                     "je te dis quelque chose.",
         "source": SRC,
         "taches": [
             "Produis un **conte** de vingt à vingt-cinq lignes.",
             "Deux animaux s'associent. L'un est patient, l'autre pressé. "
             "Raconte ce qui arrive.",
             "**Obligatoire :** une formule d'ouverture ; les cinq étapes du "
             "récit ; un dialogue de six répliques au moins ; une explication "
             "finale (« Depuis ce jour… ») **et** une morale en une phrase."],
         "bareme": [["Le conte est complet et les cinq étapes sont là", "5"],
                    ["Les deux caractères se distinguent nettement", "4"],
                    ["Le dialogue est correctement présenté", "3"],
                    ["Formule d'ouverture, explication finale et morale", "3"],
                    ["Orthographe et ponctuation", "3"],
                    ["Présentation et longueur", "2"]]},
        {"type": "Argumentation",
         "contexte": "Le prologue s'ouvre sur un désaccord entre un frère et "
                     "sa sœur : faut-il encore raconter des contes, à l'heure "
                     "de la télévision ?",
         "citation": "On oublie les contes quand on ne les dit pas, tu sais.",
         "source": SRC,
         "taches": [
             "Produis un texte **argumentatif** de vingt à vingt-cinq lignes.",
             "Sujet : *« Faut-il continuer à raconter des contes aux enfants "
             "d'aujourd'hui ? »*",
             "**Obligatoire :** ton opinion, clairement énoncée ; deux "
             "arguments expliqués ; **un exemple pris dans le recueil, avec "
             "une citation entre guillemets** ; quatre mots de liaison ; une "
             "conclusion qui avance d'un pas."],
         "bareme": [["L'opinion est claire", "3"],
                    ["Deux arguments sont donnés et vraiment expliqués", "5"],
                    ["L'exemple du recueil est exact et cité", "4"],
                    ["Les mots de liaison organisent le texte", "2"],
                    ["Orthographe et ponctuation", "4"],
                    ["Présentation et longueur", "2"]]},
    ])
    b.append(saut())
    return b, corriges
