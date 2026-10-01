# -*- coding: utf-8 -*-
"""Le manuel de sixième : trois œuvres, et ce qui les relie.

*Les Chants de la Forêt* · *Les Bimanes* · *Les Contes de Korotoumou*.

Les trois études sont indépendantes — on peut les traiter dans n'importe quel
ordre — mais elles ne sont pas étrangères l'une à l'autre, et la section
**Passerelles** le montre avec des faits, pas avec des impressions : le même
homme signe l'avant-propos du premier livre et écrit le deuxième ; un conte
entier est enchâssé dans une nouvelle ; les trois volumes racontent la même
erreur, celle de juger sur l'apparence.
"""
import c6_bimanes
import c6_bimanes_suite
import c6_chants
import c6_chants_lectures
import c6_chants_suite
import c6_korotoumou
import c6_korotoumou_suite
from gabarit import passerelles
from kit import cases, enc, grille, h1, h2, h3, lignes, num, p, puce, saut

OEUVRES = [
    ("Les Chants de la Forêt", "Lucien Anya Noa — contes et chantefables"),
    ("Les Bimanes", "Séverin Cécile Abega — sept nouvelles"),
    ("Les Contes de Korotoumou", "Amadou Koné — quatorze contes"),
]


# ---------------------------------------------------------------- ouverture

def avant_propos():
    return [
        h1("Avant de commencer — ce livre et toi"),
        p("Tu as trois livres à lire cette année. Trois seulement. Et tu as "
          "un an pour le faire. Cela fait environ **une page par jour** : "
          "moins de temps que pour regarder un épisode d'une série."),
        p("Ce manuel n'est pas un résumé qui t'éviterait de les lire. Il ne "
          "sert à rien si tu n'ouvres pas les livres — c'est même le seul "
          "point sur lequel il ne cédera pas. En revanche, il te promet quatre "
          "choses :"),
        enc("objectif", "Ce que ce manuel te promet", [
            "**Tu ne liras jamais seul.** Chaque passage difficile est situé, "
            "expliqué, et suivi de questions qui te montrent quoi chercher.",
            "**Tu écriras sur ces pages.** Les pointillés sont faits pour ton "
            "stylo. Un manuel propre à la fin de l'année est un manuel qui "
            "n'a pas servi.",
            "**Tu joueras.** Grilles, QCM, devinettes, cartes mentales : on "
            "révise beaucoup mieux en cherchant un mot caché qu'en relisant "
            "trois fois la même page.",
            "**Tu riras.** Ces trois livres sont drôles. Si tu ne ris jamais "
            "en les lisant, c'est que tu lis trop vite."]),
        h3("Comment ce manuel est fait"),
        p("Chaque œuvre est étudiée en **sept temps**, toujours les mêmes. "
          "Quand tu auras compris le parcours une fois, tu le retrouveras "
          "partout — jusqu'en classe de troisième."),
        grille([["Temps", "Ce que tu y fais"],
                ["**1. J'ouvre le livre**", "Tu écris ce que tu crois avant "
                 "d'avoir lu. Tu le reliras à la fin."],
                ["**2. L'auteur et son livre**", "Qui a écrit, quand, "
                 "pourquoi, et comment le livre est bâti."],
                ["**3. Qui est qui**", "La galerie des personnages, et de quoi "
                 "les retenir."],
                ["**4. Je lis l'œuvre**", "Six **lectures suivies** : on "
                 "situe, on lit, on remplit une grille, on fait le bilan."],
                ["**5. J'écris**", "Les six façons d'écrire du premier cycle : "
                 "raconter, décrire, faire un portrait, faire parler, donner "
                 "des consignes, défendre un avis."],
                ["**6. Je joue et je révise**", "Mots mêlés, mots croisés, "
                 "QCM, vrai/faux, devinettes, carte mentale."],
                ["**7. Je m'évalue**", "Les trois épreuves officielles : étude "
                 "de texte, correction orthographique, expression écrite."]]),
        enc("astuce", "Les six panneaux à reconnaître", [
            "🐾 / 🌍 **Le savais-tu ?** — un vrai renseignement sur une bête, "
            "un lieu, une coutume, un objet.",
            "👤 **Qui est qui ?** — pour ne plus confondre les personnages.",
            "📍 **C'est où ?** — la géographie du livre.",
            "😄 **Le coin du rire** — le passage qu'il faut avoir remarqué.",
            "🔑 **Les mots difficiles** — quatre ou cinq mots par séance, pas "
            "davantage.",
            "🎲 **À toi de jouer** — un exercice qui ne ressemble pas à un "
            "exercice."]),
        enc("vigilance", "Une règle absolue", [
            "Tous les textes encadrés en gris et signés d'un nom d'auteur sont "
            "**recopiés mot pour mot** du livre. Pas un mot n'a été changé.",
            "Quand un passage a été coupé, tu vois **[…]**.",
            "Les rares textes écrits pour ce manuel portent la mention "
            "*« Texte composé »*. Tu sauras donc toujours qui parle : "
            "l'écrivain, ou ton manuel."]),
        saut()]


# -------------------------------------------------------------- passerelles

def passerelles_6e():
    return passerelles(
        "Passerelles — les trois livres se répondent",
        "Tu viens de lire trois livres très différents : des contes de la "
        "forêt béti, sept nouvelles féroces sur la ville, quatorze contes "
        "racontés un soir par une grande sœur. On pourrait croire qu'ils "
        "n'ont rien à voir. C'est faux, et voici les preuves.",
        tableaux=[
            ("1. Le même homme, deux fois",
             ["Le fait", "Où tu peux le vérifier"],
             [["**Séverin Cécile Abega** a écrit *Les Bimanes*.",
               "Page de titre du deuxième livre."],
              ["Le **même** Séverin Cécile Abega signe l'avant-propos des "
               "*Chants de la Forêt*.",
               "Page 5 du premier livre : « Les contes gardent vivante la "
               "sagesse des hommes d'autrefois. C'était leur école. »"],
              ["Il défend donc, la même année, **le conte de village** et "
               "**les travailleurs de la ville**.",
               "Compare l'avant-propos et la Présentation des *Bimanes* : dans "
               "les deux cas, il prend le parti de ceux qu'on n'écoute pas."]]),
            ("2. Un conte caché dans une nouvelle",
             ["Ce qu'on trouve", "Ce que cela prouve"],
             [["Dans « Le fardeau », Tchakarias raconte à son ami **l'histoire "
                "du bélier** qui perd sa fiancée pour avoir mangé des peaux de "
                "banane sur un dépotoir.",
               "Le conte n'est pas mort : il vit **à l'intérieur** de la "
               "littérature moderne."],
              ["Il exige d'abord une kola et du vin, et déclare qu'on ne sait "
               "savourer une histoire ni sans proverbes ni sans devinettes.",
               "Ce sont exactement les « assaisonnements » dont parlent les "
               "Notes pédagogiques d'Anya Noa."],
              ["Ce conte enchâssé sert d'**argument** : il explique au voisin "
               "pourquoi le ngomna ne revient plus.",
               "Un conte, ici, n'est pas une distraction : c'est une façon de "
               "dire une chose qu'on ne peut pas dire en face."]]),
            ("3. Trois façons de sauver la même chose",
             ["Le livre", "Sa manière de sauver le conte"],
             [["*Les Chants de la Forêt*",
               "Anya Noa **écrit** les contes béti, puis ajoute des Notes "
               "pédagogiques pour expliquer comment ils sont faits. Il les "
               "met en conserve, et il livre la recette."],
              ["*Les Contes de Korotoumou*",
               "Koné **met en scène la veillée** elle-même : la télévision "
               "allumée, la sœur qui doute, les neveux qui écoutent enfin. Il "
               "sauve la situation, pas seulement les histoires."],
              ["*Les Bimanes*",
               "Abega **glisse un conte dans une nouvelle** et écrit des "
               "textes primés à la radio — c'est-à-dire faits pour l'oreille. "
               "Il sauve la voix."]]),
            ("4. La même erreur, racontée trois fois",
             ["L'œuvre", "Qui juge sur l'apparence", "Ce que cela lui coûte"],
             [["*Les Chants de la Forêt*",
               "La jeune fille du conte « Le chien et le chimpanzé » hésite "
               "entre « poils lisses » et « poils hérissés ».",
               "Sa mère la reprend : « N'aime personne à cause de la beauté de "
               "sa peau. Ce qui fait l'homme, ce sont ses vertus. »"],
              ["*Les Bimanes*",
               "Dany juge la villageoise à ses « pagnes rafistolés » ; Serge "
               "juge la jeune fille à sa friture.",
               "Dany découvre qu'elle est ingénieur ; Serge perd la seule "
               "personne qui l'ait fait rire."],
              ["*Les Contes de Korotoumou*",
               "La ville chasse la vieille griotte parce qu'elle est infirme "
               "et pauvre ; la panthère juge le singe selon son clan.",
               "La proscrite est la seule à savoir où est la reine ; la "
               "panthère est rouée de coups par le bélier."]]),
            ("5. Le petit contre le gros",
             ["Le petit", "Le gros", "Résultat"],
             [["Kulu la Tortue", "Zee le Léopard", "Kulu gagne la course, "
               "l'héritage, le procès, et emporte la fille du léopard."],
              ["Olong le Bigorneau", "Zog l'Éléphant, Zee, Emgbeme le Lion",
               "Les trois géants fuient ; le bigorneau reste."],
              ["Le lièvre Minanhanlan", "L'hyène", "Le lièvre mange tous les "
               "jours ; l'hyène est assommée par les génies."],
              ["Ambombo, en pagnes rafistolés", "Dany, en veste et cravate",
               "Elle est ingénieur ; il lui a fait la leçon toute la matinée."],
              ["**Mais attention :** la petite vendeuse de beignets",
               "Serge, en costume trois-pièces",
               "**Elle perd.** Et c'est ce qui rend cette nouvelle si dure : "
               "dans la vraie ville, le petit ne gagne pas toujours."]]),
            ("6. La parole donnée, dans les trois livres",
             ["Le pacte", "Qui le rompt", "Le prix payé"],
             [["L'homme et le revenant partagent le gibier : mâles à l'homme, "
               "femelles au revenant *(Chants de la Forêt)*.",
               "Personne. Le revenant applique l'accord **à la lettre**.",
               "L'homme perd toutes ses femmes. « La parole vaut contrat. »"],
              ["Le chien et le chimpanzé se confient chacun sa faiblesse "
               "*(Chants de la Forêt)*.",
               "Les deux, l'un après l'autre.",
               "« Voilà pourquoi le chien et le chimpanzé ne s'aiment plus. »"],
              ["Le lièvre fait jurer à l'hyène de ne pas toucher au cœur "
               "*(Contes de Korotoumou)*.",
               "L'hyène, qui avait juré sur la tête de sa mère.",
               "Les génies l'assomment à coups de gourdin."],
              ["Malan promet à l'hyène des plumes pour voler *(Contes de "
               "Korotoumou)*.",
               "Malan et sa famille, en plein vol.",
               "L'hyène tombe. Un cadeau trop beau était un piège."]]),
        ],
        debats=[
            ("Débat 1 — Kulu est-il un héros ou un tricheur ?", [
                "Kulu gagne toujours, mais il place ses enfants sur les rives, "
                "il ment sur les kolas, il fait tuer la mère de Zee et il "
                "mange seul toute la marmite.",
                "**Camp A :** c'est un héros, il défend les faibles par la "
                "seule arme qui leur reste.",
                "**Camp B :** c'est un tricheur, et le recueil le dit "
                "lui-même : « On ne recommandera jamais d'imiter la ruse de "
                "Kulu lorsqu'il incite Zee à tuer sa mère. » (Notes "
                "pédagogiques du volume.)",
                "**Règle du débat :** chaque camp doit citer **deux** passages "
                "exacts. Une opinion sans citation ne compte pas."]),
            ("Débat 2 — Faut-il quitter le village ou y rester ?", [
                "Dany est parti et méprise ceux qui restent. Ahanda est resté "
                "et passe pour un raté. Le narrateur de Korotoumou revient "
                "d'Amérique pour écouter des contes.",
                "**Camp A :** il faut partir : l'école, le travail, l'avenir "
                "sont ailleurs.",
                "**Camp B :** il faut rester : Ahanda bâtit des écoles pour "
                "les siens, et personne ne le remercie.",
                "**Question qui met tout le monde d'accord — ou pas :** "
                "peut-on partir **et** revenir ?"]),
            ("Débat 3 — La télévision a-t-elle tué les contes ?", [
                "Korotoumou dit : « Qui voudra et pourra se détacher du "
                "téléviseur pour écouter des contes ? »",
                "Son frère répond que même en Amérique « les héros existent "
                "toujours, les miracles existent, les animaux parlent ».",
                "**Camp A :** oui, et c'est fini : plus de veillée, plus de "
                "public, plus de langue.",
                "**Camp B :** non : les contes ont changé de forme. Les films, "
                "les séries, les jeux racontent les mêmes histoires.",
                "**Preuve à apporter :** chaque camp doit citer **un conte du "
                "recueil** et **un film ou une série** qui raconte la même "
                "chose."]),
        ],
        projet=("Le projet du trimestre — le recueil de la classe", [
            "Voici ce que vous allez fabriquer, à trente, en un trimestre : "
            "**un recueil de contes de votre région**, écrit, illustré et "
            "relié par vous.",
            "**Étape 1 (semaine 1).** Chacun va trouver une personne de plus "
            "de soixante ans et lui demande **un** conte. On note : le titre, "
            "les personnages, les lieux, la morale, et **le nom de celui ou "
            "celle qui raconte**.",
            "**Étape 2 (semaines 2 et 3).** Chacun écrit son conte : formule "
            "d'ouverture, cinq étapes, formule de clôture, morale. Un camarade "
            "relit et vérifie que les cinq étapes y sont.",
            "**Étape 3 (semaine 4).** On classe les contes **comme Amadou "
            "Koné** : les animaux entre eux · les hommes entre eux · les "
            "hommes, les animaux et les objets.",
            "**Étape 4 (semaine 5).** Chacun illustre un conte : un dessin, "
            "une carte des lieux, ou une carte mentale des personnages.",
            "**Étape 5 (semaine 6).** **Une veillée.** On éteint tout, on "
            "s'assoit en rond, et chacun **dit** son conte sans lire sa "
            "feuille. C'est la seule épreuve qui compte vraiment : un conte "
            "qu'on ne sait pas dire n'a pas encore été appris.",
            "Le recueil terminé porte un titre, le nom de tous les auteurs — "
            "**et celui de tous les conteurs qui vous les ont donnés**. Sans "
            "eux, il n'y aurait rien."]))


# ------------------------------------------------------------------- montage

def note_aux_enseignants():
    return [
        h1("Note aux enseignants"),
        p("Ce volume réunit les **trois œuvres au programme de la classe de "
          "sixième** et propose, pour chacune, un parcours complet en sept "
          "temps. Il est conçu pour être écrit dessus : les pointillés, les "
          "cases à cocher et les colonnes vides des grilles sont le travail de "
          "l'élève, non des ornements."),
        h3("Le principe qui gouverne tout le volume"),
        p("**Aucune règle n'est donnée avant son modèle.** Chaque leçon "
          "d'expression écrite s'ouvre par un texte rédigé et annoté ❶❷❸, "
          "questionne les étapes de ce modèle, demande à l'élève de formuler "
          "la règle **avant** de la lui donner, puis fait imiter sur un autre "
          "sujet. Inverser cet ordre revient à demander une production que "
          "l'élève n'a jamais vu fabriquer."),
        h3("Les lectures suivies"),
        p("Dix-huit séances en tout — six par œuvre — suivant la démarche "
          "officielle : **situation du passage → lecture → grille → "
          "confrontation et bilan**. Chaque extrait dépasse **cinq cents "
          "mots** et est reproduit **verbatim** ; les coupes éventuelles sont "
          "signalées par […]. Les grilles donnent l'axe **nommé** et l'outil "
          "de langue **fourni** ; seule la colonne des relevés reste vide."),
        h3("Ce qui reste en lecture personnelle"),
        grille([["Œuvre", "Étudié en classe", "Lecture personnelle",
                 "Support d'épreuve"],
                ["*Les Chants de la Forêt*", "6 contes sur 18",
                 "les 12 autres", "« Trop de conseils rendirent le varan "
                 "sourd »"],
                ["*Les Bimanes*", "6 nouvelles sur 7", "—",
                 "« Au ministère du soya »"],
                ["*Les Contes de Korotoumou*", "prologue + 5 contes sur 14",
                 "les 9 autres, dont toute la 3ᵉ partie",
                 "« Oiseau Malan, Hyène et Chat »"]]),
        p("Les trois supports d'épreuve n'ont donc **pas** été traités en "
          "classe : l'épreuve mesure la lecture réelle de l'œuvre, non la "
          "mémoire du cours."),
        h3("Les épreuves"),
        p("Trois par œuvre, au format en vigueur : **étude de texte** "
          "(I. Compréhension /10 + II. Langue /10), **correction "
          "orthographique** (15 fautes = 20 points, selon la répartition "
          "0,5 / 1 / 2 / 2), **expression écrite** (deux sujets au choix, "
          "grille de notation fournie)."),
        enc("vigilance", "Sur les supports de correction orthographique", [
            "Les trois textes fautifs sont **composés pour l'épreuve** et "
            "étiquetés comme tels. Ce n'est pas un défaut de rigueur, c'est "
            "une nécessité : l'élève a l'œuvre entre les mains ; un support "
            "emprunté au livre lui livrerait la version correcte à recopier.",
            "Tous les autres textes encadrés du volume sont, eux, **découpés "
            "mot pour mot dans les œuvres**."]),
        enc("astuce", "Trois passages à ne pas lire à voix haute en classe", [
            "*Les Chants de la Forêt*, conte 11 « Si tu entends dire… » : "
            "échange sur la castration d'un sanglier.",
            "*Les Contes de Korotoumou*, fin de « Chien et Singe » : "
            "plaisanterie corporelle. Les extraits retenus dans ce manuel "
            "s'arrêtent avant.",
            "*Les Bimanes*, nouvelle 3 : les conquêtes de Serge. Le passage "
            "retenu n'en dit rien."]),
        h3("La progression annuelle proposée"),
        grille([["Période", "Œuvre", "Ce qu'on installe"],
                ["Trimestre 1", "*Les Chants de la Forêt*",
                 "le conte, le schéma du récit, la narration, la description, "
                 "le portrait"],
                ["Trimestre 2", "*Les Bimanes*",
                 "la nouvelle et la chute, le portrait moqueur, l'ironie, "
                 "l'argumentation"],
                ["Trimestre 3", "*Les Contes de Korotoumou*",
                 "l'oral et le conte dit, le dialogue, la reprise de tout — "
                 "et le projet de recueil de la classe"]]),
        p("La section **Passerelles** se traite en fin d'année, quand les "
          "trois œuvres sont lues : elle n'a de sens qu'à ce moment-là. Les "
          "trois débats qu'elle propose constituent une évaluation orale "
          "toute prête."),
        saut()]


def manuel():
    """Rend (blocs du manuel, blocs des corrigés)."""
    blocs = list(avant_propos())
    corriges = [h1("Corrigés")]

    # --- Œuvre 1 : Les Chants de la Forêt
    blocs += c6_chants.partie1() + c6_chants.partie2()
    b3, c3 = c6_chants.partie3()
    blocs += b3
    blocs += c6_chants_lectures.partie4()
    blocs += c6_chants_suite.partie5()
    b6, c6 = c6_chants_suite.partie6()
    b7, c7 = c6_chants_suite.partie7()
    blocs += b6 + b7
    corriges += [h2("Œuvre 1 — Les Chants de la Forêt")] + c3 + c6 + c7

    # --- Œuvre 2 : Les Bimanes
    blocs += c6_bimanes.partie1() + c6_bimanes.partie2()
    b3, c3 = c6_bimanes.partie3()
    blocs += b3
    blocs += c6_bimanes.partie4()
    blocs += c6_bimanes_suite.partie5()
    b6, c6 = c6_bimanes_suite.partie6()
    b7, c7 = c6_bimanes_suite.partie7()
    blocs += b6 + b7
    corriges += [h2("Œuvre 2 — Les Bimanes")] + c3 + c6 + c7

    # --- Œuvre 3 : Les Contes de Korotoumou
    blocs += c6_korotoumou.partie1() + c6_korotoumou.partie2()
    b3, c3 = c6_korotoumou.partie3()
    blocs += b3
    blocs += c6_korotoumou.partie4()
    blocs += c6_korotoumou_suite.partie5()
    b6, c6 = c6_korotoumou_suite.partie6()
    b7, c7 = c6_korotoumou_suite.partie7()
    blocs += b6 + b7
    corriges += [h2("Œuvre 3 — Les Contes de Korotoumou")] + c3 + c6 + c7

    # --- Ce qui relie les trois, puis la note aux enseignants
    blocs += passerelles_6e()
    blocs += note_aux_enseignants()
    return blocs, corriges
