# -*- coding: utf-8 -*-
"""Le manuel de quatrième : trois œuvres, et ce qui les relie.

*Trois prétendants… un mari* · *Cœur du Sahel* · *L'attachement au sol natal*.

Une comédie de 1959, un roman de 2022, un recueil de poèmes de 2024 : soixante-
cinq ans d'écart, trois genres, et **une même question** posée trois fois — qui
a le droit de parler, et de quoi vit-on quand on n'a rien ?
"""
import c4_pretendants
import c4_pretendants_suite
import c4_sahel
import c4_solnatal
from gabarit import passerelles
from kit import cases, enc, grille, h1, h2, h3, lignes, num, p, puce, saut

OEUVRES = [
    ("Trois prétendants… un mari",
     "Guillaume Oyônô Mbia — comédie en cinq actes"),
    ("Cœur du Sahel", "Djaïli Amadou Amal — roman"),
    ("L'attachement au sol natal", "Ernest Alima — vingt-six poèmes"),
]


# ---------------------------------------------------------------- ouverture

def avant_propos():
    return [
        h1("Avant de commencer — ce livre et toi"),
        p("Trois œuvres, trois genres, et trois époques. En quatrième, on ne "
          "te demande plus seulement de comprendre une histoire : on te "
          "demande de voir **comment elle est fabriquée**, et pourquoi "
          "l'auteur s'y est pris ainsi plutôt qu'autrement."),
        grille([["L'œuvre", "Genre et date", "Ce que tu apprends à repérer"],
                ["*Trois prétendants… un mari*", "comédie, 1959",
                 "la satire, l'ironie de situation, l'aparté au public"],
                ["*Cœur du Sahel*", "roman, 2022",
                 "le point de vue interne, le contraste sans commentaire, "
                 "l'accumulation"],
                ["*L'attachement au sol natal*", "poésie, 2024",
                 "le vers libre, l'anaphore, l'image, l'allégorie"]]),
        enc("objectif", "Ce que ce manuel te promet", [
            "**Tu ne liras jamais seul.** Chaque passage est situé, "
            "questionné, et suivi d'une grille à remplir.",
            "**Tu écriras sur ces pages.** Les pointillés attendent ton "
            "stylo ; les colonnes vides sont ton travail.",
            "**Tu joueras.** Grilles, QCM, devinettes, cartes mentales : on "
            "retient ce qu'on a cherché.",
            "**Tu discuteras, et tu changeras d'avis.** Trois débats "
            "t'attendent à la fin, et aucun n'a de bonne réponse écrite "
            "d'avance."]),
        h3("Les sept ateliers d'écriture de l'année"),
        p("Chaque type de texte n'est travaillé **qu'une fois** dans ce "
          "volume, dans l'œuvre qui s'y prête le mieux. Ensuite, c'est à toi "
          "de le réemployer partout."),
        grille([["Œuvre", "Ateliers"],
                ["*Trois prétendants… un mari*",
                 "**le résumé** · **le texte explicatif**"],
                ["*Cœur du Sahel*",
                 "**le portrait en contraste** · **le texte argumentatif "
                 "complet**"],
                ["*L'attachement au sol natal*",
                 "**le poème en vers libres** · **l'appel** (injonctif et "
                 "argumentatif)"]]),
        enc("vigilance", "Une règle absolue", [
            "Tous les textes encadrés en gris et signés d'un nom d'auteur "
            "sont **recopiés mot pour mot**. Les coupes sont marquées **[…]**.",
            "Les rares textes écrits pour ce manuel portent la mention "
            "*« Texte composé »*.",
            "**Pour les poèmes**, la référence précise toujours qu'il s'agit "
            "d'un **poème entier** : un poème ne se coupe pas."]),
        enc("astuce", "Trois lectures très différentes", [
            "**La comédie** se lit à voix haute, à plusieurs, en distribuant "
            "les rôles. Sinon elle ne fait pas rire — et si elle ne fait pas "
            "rire, elle n'a pas été lue.",
            "**Le roman** se lit seul, un chapitre par soir, avec un journal "
            "de lecture de trois lignes.",
            "**Le recueil de poèmes** se lit deux poèmes à la fois, à voix "
            "haute, en notant à chaque fois **un vers** qu'on voudrait savoir "
            "par cœur."]),
        saut()]


# -------------------------------------------------------------- passerelles

def passerelles_4e():
    return passerelles(
        "Passerelles — les trois œuvres se répondent",
        "Une comédie villageoise de 1959, un roman du Sahel de 2022, "
        "vingt-six poèmes patriotiques de 2024. Trois auteurs qui ne se "
        "ressemblent pas, et qui posent pourtant les mêmes questions. Voici "
        "les preuves, tirées des textes.",
        tableaux=[
            ("1. Trois manières de critiquer sans jamais accuser personne",
             ["L'œuvre", "Le procédé", "Comment il fonctionne"],
             [["*Trois prétendants… un mari*", "**la satire**",
               "On laisse les personnages dire eux-mêmes des choses "
               "indéfendables — « battez vos femmes ! » — et le public rit "
               "d'eux. L'auteur ne commente jamais."],
              ["*Cœur du Sahel*", "**le contraste**",
               "On met la journée de Faydé à côté des caprices de Leïla, sans "
               "un mot de jugement. Le lecteur se met en colère tout seul."],
              ["*L'attachement au sol natal*", "**l'allégorie animale**",
               "On remplace des hommes par des vautours : « Voraces / Rapaces "
               "/ De pire race ». Personne n'est nommé, et tout le monde "
               "comprend."]]),
            ("2. Qui a le droit de parler ?",
             ["Qui se tait", "Pourquoi", "Ce que cela produit"],
             [["**Juliette**, collégienne",
               "« Depuis quand est-ce que les femmes parlent à Mvoutessi ? » "
               "lui répond son grand-père.",
               "Elle se taira — et gagnera par la ruse, en retournant le "
               "système au lieu de le renverser."],
              ["**Faydé**, domestique",
               "« la pauvreté suscite toujours le mépris ou la pitié, et il "
               "est impossible de trouver les mots justes sans avoir l'air de "
               "s'apitoyer ».",
               "Elle écoute Leïla pendant des mois sans jamais se confier. "
               "Son silence est une dignité, pas une soumission."],
              ["**Le mot « démocratie »**",
               "« Ô vocable hier encore absent / Du lexique des politiques ! "
               "Ô vocable hier encore interdit d'usage… »",
               "Un mot interdit finit par revenir, appelé « à l'unisson » par "
               "les graffitis des palissades."]]),
            ("3. Trois départs",
             ["Qui part", "Pourquoi", "Ce qu'il en dit"],
             [["**Juliette**", "elle est envoyée au collège de Libamba — et "
               "son père le dit franchement : « Un beau jour, cela me "
               "rapportera ! »",
               "Elle revient avec un examen réussi et deux maris qu'elle n'a "
               "pas choisis."],
              ["**Faydé**", "la terre ne nourrit plus : quatre mois sans "
               "pluie derrière, cinq devant, les greniers vides.",
               "« Dada, regarde autour de toi. Il n'y a plus rien ici. »"],
              ["**Le poète**", "il est parti « par devoir », servir son pays "
               "« au-delà de tes frontières ».",
               "Il en fait le titre de son livre : *L'attachement au sol "
               "natal* est le sentiment de **celui qui est parti**."]]),
            ("4. L'argent, compté à voix haute",
             ["L'œuvre", "Ce qu'on compte", "Devant qui"],
             [["*Trois prétendants… un mari*",
               "cent mille, puis deux cent mille, puis trois cent mille "
               "francs de dot",
               "**Devant tout le village**, et le père compte les billets sur "
               "scène, aidé de son propre père."],
              ["*Cœur du Sahel*",
               "le prix du savon, du sucre, du poisson séché ; le crédit "
               "refusé par le boutiquier Abdou",
               "**Dans une cuisine**, entre une mère et sa fille, à propos "
               "d'une bouillie sans sucre."],
              ["*L'attachement au sol natal*",
               "« les poules aux œufs d'or » sur lesquelles plongent les "
               "rapaces",
               "**Nulle part et partout** : le poème ne nomme personne, et "
               "c'est ce qui le rend redoutable."]]),
            ("5. Le mariage, vu de trois côtés",
             ["Ce qui décide", "Dans quelle œuvre", "Ce qui est en jeu"],
             [["Le montant de la dot",
               "*Trois prétendants… un mari*",
               "Juliette est « à vendre », et sa dot doit servir à doter "
               "l'épouse de son frère : elle est **la monnaie d'un autre "
               "mariage**."],
              ["La condition et la religion", "*Cœur du Sahel*",
               "Boukar doit épouser « une belle jeune fille, de bonne "
               "famille, musulmane et peule, comme lui ». Faydé est kaado et "
               "chrétienne."],
              ["Rien — et c'est le sujet", "*L'attachement au sol natal*",
               "Le recueil ne parle pas de mariage : il parle d'un amour qui "
               "ne se négocie pas. « Juste aimer ! », écrit d'ailleurs Djaïli "
               "Amadou Amal à la dernière ligne de son roman."]]),
            ("6. Trois auteurs, trois façons de dire pourquoi ils écrivent",
             ["L'auteur", "Ce qu'il déclare", "Où c'est écrit"],
             [["**Guillaume Oyônô Mbia**",
               "« mon but, en écrivant, est non de moraliser, mais de "
               "divertir »",
               "Préface à la deuxième édition."],
              ["**Djaïli Amadou Amal**",
               "« C'est souvent lorsqu'elle est la plus désagréable à entendre "
               "qu'une vérité est le plus utile à dire. » (André Gide) — et la "
               "dédicace : « Aux femmes victimes du Sahel ».",
               "Épigraphe et page de garde."],
              ["**Ernest Alima**",
               "« accordez-moi la grâce de produire quelques beaux vers qui me "
               "prouvent à moi-même que je ne suis pas le dernier des "
               "hommes » (Baudelaire)",
               "Épigraphe du recueil."]]),
        ],
        debats=[
            ("Débat 1 — Faut-il rire des choses graves ?", [
                "Oyônô Mbia écrit une comédie sur la vente d'une jeune fille "
                "et refuse de moraliser. Djaïli Amadou Amal écrit un roman "
                "sur le même sujet et ne fait jamais rire.",
                "**Camp A :** le rire désarme et fait passer les idées ; un "
                "public qui s'ennuie n'écoute rien.",
                "**Camp B :** rire d'une injustice, c'est risquer de la rendre "
                "acceptable ; certaines choses demandent qu'on ne sourie pas.",
                "**Règle du débat :** chaque camp cite **deux passages "
                "exacts**, un de chaque œuvre. Une opinion sans citation ne "
                "compte pas."]),
            ("Débat 2 — Faut-il partir ou rester ?", [
                "Faydé part parce qu'il n'y a plus rien. Le poète est parti "
                "« par devoir » et le regrette dans ses vers. Et dans "
                "« Cameroun, ma patrie », le poète regarde « ces sœurs et "
                "frères miens / Qui vont de ciel en ciel / Au-delà du Sahel ».",
                "**Camp A :** partir est une nécessité, pas une trahison. On "
                "ne mange pas des racines.",
                "**Camp B :** un pays que tous ses jeunes quittent ne se "
                "relèvera jamais.",
                "**Question qui complique tout :** Faydé revient. Le poète "
                "écrit. **Partir empêche-t-il de revenir ?**"]),
            ("Débat 3 — Un écrivain doit-il s'engager ?", [
                "Ernest Alima écrit des poèmes politiques ; Djaïli Amadou "
                "Amal dédie son livre « aux femmes victimes du Sahel » ; "
                "Oyônô Mbia refuse le titre de « champion de l'émancipation "
                "de la femme africaine ».",
                "**Camp A :** un écrivain qui voit une injustice et se tait "
                "s'en rend complice.",
                "**Camp B :** l'écrivain n'est pas un ministre ; son travail "
                "est d'écrire bien, et un mauvais livre engagé ne sert "
                "personne.",
                "**À vérifier avant de conclure :** ces trois œuvres ont-elles "
                "changé quelque chose ? Cherchez ce qu'a produit *Les "
                "Impatientes*, prix Goncourt des lycéens 2020, du même auteur "
                "que *Cœur du Sahel*."]),
        ],
        projet=("Le projet du trimestre — l'anthologie de la classe", [
            "Vous allez fabriquer, à trente, **une anthologie** : un recueil "
            "de textes choisis, présentés et illustrés par vous. Comptez "
            "quatre semaines.",
            "**Étape 1.** Chacun choisit **un** texte : un poème d'Alima, une "
            "réplique de la pièce, un passage du roman — ou un texte trouvé "
            "ailleurs, à condition d'en donner la source exacte.",
            "**Étape 2.** Chacun rédige, pour son texte, une **présentation "
            "explicative** de dix lignes (atelier du texte explicatif) : de "
            "quoi il s'agit, qui l'a écrit, comment il est construit. Aucun "
            "jugement.",
            "**Étape 3.** Chacun rédige ensuite un **paragraphe "
            "argumentatif** de dix lignes : pourquoi ce texte mérite d'entrer "
            "dans l'anthologie. Une objection obligatoire.",
            "**Étape 4.** La classe se partage en comités : un comité "
            "**sommaire** (l'ordre des textes et les sections), un comité "
            "**couverture** (titre, image, quatrième de couverture), un "
            "comité **relecture** (orthographe et sources).",
            "**Étape 5.** Une **lecture publique**. Chacun lit son texte à "
            "voix haute et défend son choix en une minute, montre en main.",
            "Ce que ce projet vous apprend : une anthologie n'est pas une "
            "pile de textes. **C'est un ordre, et un ordre est déjà une "
            "opinion.** Vous en discuterez plus longtemps que prévu — c'est "
            "le but."]))


# ------------------------------------------------------------------- montage

def note_aux_enseignants():
    return [
        h1("Note aux enseignants"),
        p("Ce volume réunit les **trois œuvres au programme de la classe de "
          "quatrième** et propose, pour chacune, un parcours complet en sept "
          "temps. Il est conçu pour être écrit dessus."),
        h3("Le principe qui gouverne le volume"),
        p("**Aucune règle n'est donnée avant son modèle.** Chaque atelier "
          "s'ouvre sur un texte rédigé et annoté ❶❷❸, questionne les étapes "
          "de ce modèle, demande à l'élève de formuler la règle **avant** de "
          "la lui donner, puis fait imiter sur un autre sujet."),
        h3("Les lectures suivies"),
        p("Dix-huit séances — six par œuvre — suivant la démarche officielle : "
          "**situation → lecture → grille → confrontation et bilan**. Les "
          "grilles donnent l'axe **nommé** et l'outil de langue **fourni** ; "
          "seule la colonne des relevés reste vide."),
        enc("astuce", "Sur la longueur des extraits", [
            "Pour la **prose** — la comédie et le roman —, chaque extrait de "
            "lecture suivie **dépasse cinq cents mots**.",
            "Pour la **poésie**, la règle est autre et elle est délibérée : "
            "l'unité d'étude est le **poème entier**, quelle qu'en soit la "
            "longueur. Les six poèmes retenus font de 81 à 314 mots.",
            "**La contrepartie est stricte :** chaque référence nomme l'unité "
            "reproduite (« poème entier »). Sans cette mention, on ne saurait "
            "plus si l'on tient le poème ou un fragment."]),
        h3("Ce qui reste en lecture personnelle"),
        grille([["Œuvre", "Étudié en classe", "Support d'épreuve"],
                ["*Trois prétendants… un mari*",
                 "actes I (2 séances), II, III, IV, V",
                 "l'ouverture de l'acte V"],
                ["*Cœur du Sahel*", "deux séances par partie",
                 "un passage de la partie II"],
                ["*L'attachement au sol natal*",
                 "6 poèmes sur 26, dans quatre des six sections",
                 "« Hymne à la solidarité »"]]),
        enc("vigilance", "⚠ *Cœur du Sahel* : contenus sensibles", [
            "Le roman traite du **harcèlement et du viol des jeunes "
            "domestiques** (le personnage principal y échappe ; d'autres non) "
            "et du **suicide** d'un personnage, enceinte et rejetée.",
            "**Aucun extrait de ce manuel ne porte sur ces scènes.** Elles "
            "sont nommées, sans détail, dans un encadré de la sixième séance, "
            "parce que le dénouement est incompréhensible sans elles.",
            "Conduite recommandée : annoncer ces faits **avant** que la classe "
            "n'atteigne les chapitres concernés, en s'appuyant sur la dédicace "
            "(« Aux femmes victimes du Sahel ») et sur l'épigraphe de Gide ; "
            "ne pas en faire une lecture à voix haute ; ne pas les donner en "
            "support d'évaluation ; signaler qu'un adulte de l'établissement "
            "est disponible pour en parler en particulier.",
            "Sur **Boko Haram** : traiter le contexte comme un fait daté et "
            "localisé, et prévenir explicitement tout amalgame entre un groupe "
            "armé et une religion, une région ou un peuple — l'auteure est "
            "musulmane et originaire du Nord, son héroïne est chrétienne."]),
        enc("astuce", "Deux autres points de conduite", [
            "*Trois prétendants… un mari* : les propos d'Abessolo sur les "
            "femmes sont des propos de **personnage**, tournés en dérision "
            "par la pièce. Le faire établir par les élèves à partir des "
            "didascalies plutôt que de l'affirmer. Et distribuer les rôles : "
            "l'auteur demande explicitement que sa pièce soit **jouée**.",
            "*L'attachement au sol natal* : « Démocratie I » et « Le retour "
            "des vautours » sont des poèmes politiques. Les étudier comme des "
            "textes — figures, rythme, images — et tenir le débat sur le poème "
            "et sur les faits historiques nommés (discours de La Baule, 1990), "
            "jamais sur des personnes ou des partis actuels."]),
        h3("Les épreuves"),
        p("Trois par œuvre : **étude de texte** (I. Compréhension /10 + "
          "II. Langue /10), **correction orthographique** (15 fautes = "
          "20 points, répartition 0,5 / 1 / 2 / 2), **expression écrite** "
          "(deux sujets au choix, grille de notation fournie). Les trois "
          "supports d'étude de texte n'ont **pas** été traités en classe."),
        p("Les trois textes de correction orthographique sont **composés pour "
          "l'épreuve** et étiquetés comme tels : l'élève ayant l'œuvre entre "
          "les mains, un support emprunté au livre lui livrerait la version "
          "correcte à recopier."),
        h3("La progression annuelle proposée"),
        grille([["Période", "Œuvre", "Ce qu'on installe"],
                ["Trimestre 1", "*Trois prétendants… un mari*",
                 "le théâtre et la satire ; le résumé ; le texte explicatif"],
                ["Trimestre 2", "*Cœur du Sahel*",
                 "le roman et le point de vue ; le portrait en contraste ; "
                 "l'argumentation complète"],
                ["Trimestre 3", "*L'attachement au sol natal*",
                 "la poésie, le vers libre et les figures ; le poème ; "
                 "l'appel — et l'anthologie de la classe"]]),
        p("La section **Passerelles** se traite en fin d'année. Ses trois "
          "débats constituent une évaluation orale toute prête ; le projet "
          "d'anthologie peut démarrer dès le deuxième trimestre."),
        saut()]


def manuel():
    """Rend (blocs du manuel, blocs des corrigés)."""
    blocs = list(avant_propos())
    corriges = [h1("Corrigés")]

    # L'œuvre 1 a ses parties 5 à 7 dans un module séparé ; les deux autres
    # tiennent dans un seul fichier chacune.
    plan = [("Œuvre 1 — Trois prétendants… un mari",
             c4_pretendants, c4_pretendants_suite),
            ("Œuvre 2 — Cœur du Sahel", c4_sahel, c4_sahel),
            ("Œuvre 3 — L'attachement au sol natal", c4_solnatal, c4_solnatal)]

    for titre, mod, mod_suite in plan:
        blocs += mod.partie1() + mod.partie2()
        b3, c3 = mod.partie3()
        blocs += b3 + mod.partie4() + mod_suite.partie5()
        b6, c6 = mod_suite.partie6()
        b7, c7 = mod_suite.partie7()
        blocs += b6 + b7
        corriges += [h2(titre)] + c3 + c6 + c7

    blocs += passerelles_4e()
    blocs += note_aux_enseignants()
    return blocs, corriges
