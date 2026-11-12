# -*- coding: utf-8 -*-
"""6ᵉ — *Les Bimanes*, Séverin Cécile Abega (NEA/EDICEF, 1982).

Sept nouvelles, un mot inventé pour titre, et une colère très drôle contre
ceux qui méprisent les mains sales. Tout ce qui est affirmé ici sort du
volume : la table des matières, la notice de l'éditeur (né le 25 novembre
1955 à Nkolmebanga, près de Saa), la Présentation où l'auteur définit
lui-même son mot, et les sept récits.

C'est le même Abega qui signe l'avant-propos des *Chants de la Forêt* : les
deux premières œuvres du volume sont tenues par la même main.
"""
import jeux
import source
from gabarit import (cote_enseignant, epreuve_etude_texte, epreuve_expression,
                     epreuve_orthographe, lecture_suivie, ouvrir, production)
from kit import cases, enc, grille, h1, h2, h3, lignes, num, p, puce, saut

CLE = "bimanes"
SRC = "Séverin Cécile Abega, *Les Bimanes*, NEA/EDICEF, 1982"

NOUVELLES = ["Le fardeau.", "Dans la forêt.", "Une petite vendeuse de beignets.",
             "Le savon.", "Un étranger de passage.", "Mots d'enfants.",
             "Au ministère du soya."]


def _x(amorce, mots=620):
    voisins = [t for t in NOUVELLES if source.plat(t) not in source.plat(amorce)]
    return source.extrait(CLE, amorce, mots=mots, arret=voisins)


# ============================================================ 1. J'ouvre

def partie1():
    return [h1("Œuvre 2 — Les Bimanes, de Séverin Cécile Abega")] + ouvrir(
        "Les Bimanes", "Séverin Cécile Abega",
        questions_couverture=[
            "**Bimanes.** Ce mot n'existe presque pas. Coupe-le en deux : "
            "*bi-* et *-mane*. Que veut dire *bi-* dans *bicyclette*, *bilingue*, "
            "*bimensuel* ? Et *-mane*, dans *manuel*, *manucure* ?",
            "Tu viens donc de traduire le titre. Écris ta traduction ici : "
            "« les bimanes sont ceux qui ont … ».",
            "Mais **tout le monde** a deux mains ! Alors pourquoi inventer un "
            "mot pour cela ? Réfléchis : de qui pourrait-on dire qu'il a *"
            "vraiment* deux mains ?",
            "Cite trois métiers de ton quartier où l'on se salit les mains. "
            "Est-ce qu'on les respecte, chez toi ?"],
        promesses=[
            "Le livre va-t-il se moquer des riches ou des pauvres ?",
            "Est-ce que ce sera triste ou drôle ?",
            "Y aura-t-il des animaux qui parlent, comme dans le recueil "
            "précédent ?",
            "Selon toi, avoir les mains sales, est-ce être sale ?"],
        journal_exemple=["03/11", "« Le fardeau »",
                         "Un vieux obtient la carte de sa fille, mais un chef "
                         "se met à tourner autour d'elle",
                         "Qu'est-ce qu'un ngomna, exactement ?"])


# ================================================= 2. L'auteur et son livre

def partie2():
    return [
        h2("2. L'auteur et son livre"),
        h3("Séverin Cécile Abega : le monsieur qui écrit, peint, et se fâche"),
        p("Séverin Cécile Abega est né le **25 novembre 1955 à Nkolmebanga**, "
          "près de **Saa**, dans le Sud-Cameroun. Il fait ses études "
          "secondaires au **lycée de Nkongsamba**, à l'Ouest du pays, puis des "
          "études supérieures de lettres. Il est **écrivain et peintre**, et il "
          "travaille à la Chancellerie de l'université de Yaoundé."),
        p("Il a été **lauréat du 5ᵉ concours radiophonique de la meilleure "
          "nouvelle de langue française**. Autrement dit : ses histoires ont "
          "d'abord été faites pour être **entendues**, pas seulement lues. "
          "Cela s'entend encore quand on les lit à voix haute — essaie."),
        enc("perso", "Le lien avec ton premier livre", [
          "Reprends *Les Chants de la Forêt*, page 5. L'avant-propos est signé "
          "**Séverin Cécile Abega** : c'est lui.",
          "Le même homme présente les contes de la forêt **et** écrit sept "
          "nouvelles féroces sur la ville. Ce n'est pas un hasard : dans les "
          "deux cas, il défend ceux qu'on n'écoute pas.",
          "Tu verras d'ailleurs, dans « Le fardeau », **un conte entier** — "
          "celui du bélier — glissé au milieu de la nouvelle. Le conteur n'est "
          "jamais loin."]),
        h3("Un mot inventé, et il l'explique lui-même"),
        p("Le livre s'ouvre par une **Présentation** où Abega fabrique son "
          "titre sous tes yeux. Il classe l'humanité sur une échelle :"),
        grille([["En haut", "Au milieu", "En bas"],
                ["**les bipèdes** — deux pieds, comme les oiseaux ; c'est ainsi "
                 "que l'homme aime se nommer, parce que les oiseaux ont des "
                 "ailes et les anges aussi",
                 "**les bimanes** — deux mains, et ils s'en servent",
                 "**les quadrumanes** — quatre mains : les singes"]]),
        ("extrait",
         source.extrait(CLE, "Au milieu, nous situerons les bimanes", mots=400,
                        arret=NOUVELLES),
         SRC),
        enc("mot", "Les mots difficiles de la Présentation", [
            "**Un laissé-pour-compte** : quelqu'un dont personne ne veut, "
            "qu'on abandonne.",
            "**Un plan quinquennal** : un programme de développement prévu "
            "pour cinq ans par un gouvernement.",
            "**Un portefaix** : celui qui porte les charges des autres, au "
            "marché ou au port.",
            "**Le cambouis** : la graisse noire des moteurs.",
            "**Un bousier** : un insecte qui vit dans la bouse. Abega l'emploie "
            "exprès, pour dire jusqu'où va le mépris."]),
        enc("rire", "La définition la plus méchante du livre", [
            "Selon la Présentation, pour être « un homme digne de l'espèce », "
            "il faut : **une veste, une cravate, un pantalon au pli acéré, une "
            "chaussure éblouissante de cirage, un français impeccable, un "
            "bureau climatisé et un portefeuille bien garni**.",
            "Sept conditions. Aucune ne concerne ce qu'on fait, ce qu'on sait "
            "faire, ni comment on traite les autres.",
            "Et la phrase qui tombe ensuite : *« Dès qu'il cesse de servir le "
            "papier et l'encre pour utiliser des outils, il n'est plus un "
            "homme. C'est un bimane. »* Voilà. Tu tiens le livre entier."]),
        h3("Ce qu'il y a dedans : sept nouvelles"),
        grille([["N°", "Titre", "De quoi ça parle"],
                ["1", "Le fardeau", "Un vieux, sa fille, une carte d'identité "
                 "et un chef trop entreprenant"],
                ["2", "Dans la forêt", "Un bachelier revient au village avec sa "
                 "cravate — et une surprise l'attend"],
                ["3", "Une petite vendeuse de beignets", "Un beau garçon "
                 "reconnaît, au carrefour, la fille du bal"],
                ["4", "Le savon", "Mbah fouille les poubelles, et sa famille en "
                 "meurt de honte"],
                ["5", "Un étranger de passage", "Ahanda a le bac et choisit la "
                 "terre. Personne ne comprend"],
                ["6", "Mots d'enfants", "Towa reçoit une gifle pour avoir dit "
                 "la vérité"],
                ["7", "Au ministère du soya", "Garba se coupe une artère ; "
                 "l'hôpital rit"]]),
        enc("mot", "Nouvelle ou roman ?", [
            "**Une nouvelle** est un récit court : peu de personnages, une "
            "seule histoire, souvent une **chute** — une fin qui retourne tout "
            "en une phrase.",
            "**Un roman** est long : beaucoup de personnages, plusieurs "
            "histoires mêlées.",
            "*Les Bimanes* contient sept nouvelles. Tu peux donc lire une "
            "histoire complète en une soirée. Et tu peux te tromper sept fois "
            "sur la fin."]),
        enc("astuce", "Comment lire Abega sans se noyer", [
            "Abega écrit **riche** : des mots rares, des comparaisons "
            "inattendues, des phrases longues. C'est fait exprès, et c'est ce "
            "qui rend le livre drôle.",
            "La méthode : lis un paragraphe **jusqu'au point**, sans "
            "t'arrêter, même si trois mots te manquent. Puis relis-le. La "
            "deuxième fois, tu comprends presque tout.",
            "Et souligne les images qui te font rire. Tu en trouveras une "
            "toutes les dix lignes."]),
        saut()]


# =========================================================== 3. Qui est qui

def partie3():
    b = [h2("3. Qui est qui dans les sept nouvelles"),
         p("Chaque nouvelle a ses personnages : ils ne se croisent pas d'une "
           "histoire à l'autre. Ce qui les relie, c'est leur **place** dans la "
           "société — et le regard qu'on pose sur eux."),
         grille([["Personnage", "Nouvelle", "Qui c'est", "Ce qui lui arrive"],
                 ["**Tchakarias**", "Le fardeau", "un vieux paysan rusé, "
                  "rhumatisant, qu'on appelle Tchakeli", "il obtient la carte "
                  "d'identité de sa fille — et hérite d'un prétendant "
                  "encombrant"],
                 ["**Ana**", "Le fardeau", "sa fille, jolie", "un « ngomna » "
                  "ventru s'installe chez eux et n'en repart plus"],
                 ["**Dany**", "Dans la forêt", "un bachelier de la ville, en "
                  "veste et cravate", "il méprise le village… et découvre qui "
                  "est vraiment Ambombo"],
                 ["**Ambombo**", "Dans la forêt", "l'« écolier » dont tout le "
                  "monde parle", "c'est **la fille aux lunettes**, et elle est "
                  "ingénieur"],
                 ["**Epképké I – Ndeck**", "Dans la forêt", "la grand-mère de "
                  "Dany ; son nom signifie « la vieille calebasse vide »",
                  "elle prend sa houe et va au champ, laissant le bachelier "
                  "sans réponse"],
                 ["**Serge**", "Une petite vendeuse de beignets", "un beau "
                  "garçon, collectionneur de conquêtes", "il fuit en taxi "
                  "plutôt que d'être vu avec elle"],
                 ["**Mbah**", "Le savon", "il vit de ce que les autres jettent",
                  "il refuse toutes les charités de sa famille"],
                 ["**Ahanda**", "Un étranger de passage", "bachelier, revenu au "
                  "village par goût de la terre", "on le croit raté ; il est "
                  "seulement libre"],
                 ["**Towa**", "Mots d'enfants", "une fillette", "elle reçoit "
                  "une gifle pour avoir dit une chose vraie"],
                 ["**Etoundi**", "Mots d'enfants", "le meilleur tireur de vin "
                  "de palme du village", "il aiguise une machette — et le "
                  "village entier en tremble d'étonnement"],
                 ["**Garba**", "Au ministère du soya", "un maguida, vendeur de "
                  "soya", "il se coupe une artère ; à l'hôpital, on rit"]]),
         enc("culture", "Trois mots de chez nous que le livre emploie", [
             "**Ngomna** : le représentant du gouvernement, l'administrateur. "
             "Le mot vient de l'anglais *government*.",
             "**Maguida** : dans le livre, « terme qui désigne les populations "
             "de type soudanais habitant originellement la province "
             "septentrionale de notre pays ». Ce sont les maîtres du soya.",
             "**Soya** : la viande de bœuf en tranches ou en brochettes, "
             "grillée au feu et « baptisée au piment ». Abega en parle comme "
             "d'une œuvre d'art — et il n'exagère qu'à moitié."]),
         enc("rire", "Le nom le plus cruel du livre", [
             "La grand-mère de Dany s'appelle **Epképké I – Ndeck**, c'est-à-"
             "dire « la vieille-calebasse-vide ».",
             "Et Dany, comme fils aîné, a hérité du nom de son grand-père : "
             "**Mebara**, « lésion-cutanée-due-au-pian ».",
             "Le texte ajoute qu'il *« aurait préféré la maladie elle-même à ce "
             "nom, car la maladie, elle au moins, est curable »*. Voilà "
             "pourquoi il ne veut pas venir au village."])]

    e, c = jeux.relier(
        "Chacun dans sa nouvelle",
        [("Tchakarias", "Il troque ses tracas contre un prétendant encombrant"),
         ("Ambombo", "On la prend pour une villageoise ; elle est ingénieur"),
         ("Serge", "Il saute dans un taxi pour ne pas être vu"),
         ("Mbah", "Il vit des poubelles et refuse la charité des siens"),
         ("Ahanda", "Il a le bac et choisit la terre"),
         ("Towa", "Elle est giflée pour avoir dit la vérité"),
         ("Garba", "Il se coupe la main en regardant passer une jolie fille")],
        graine=71)
    b += e
    b.append(saut())
    return b, c


# ======================================================= 4. Lectures suivies

def partie4():
    b = [h2("4. Je lis l'œuvre — six lectures suivies"),
         p("Six nouvelles sur sept. La septième, « Au ministère du soya », "
           "t'attend à l'épreuve d'étude de texte : lis-la de ton côté.")]

    b += lecture_suivie(
        1, "Le vieux qui savait ce qu'il voulait (« Le fardeau »)",
        situation=[
            "Première nouvelle. Le vieux Tchakarias rentre chez lui, épuisé : "
            "il a passé la journée dans un bureau à réclamer la carte "
            "d'identité de sa fille Ana. On l'a renvoyé, comme on renvoie tout "
            "le monde.",
            "Sa femme lui apporte de l'eau. Deux vieux qui se comprennent sans "
            "phrases. Puis Tchakarias prend une décision."],
        texte=_x("Le crâne du vieux Tchakarias"), source=SRC,
        questions=[
            "Relève trois expressions qui montrent que le vieux souffre "
            "physiquement. Laquelle te paraît la plus drôle ?",
            "Que dit Tchakarias de ceux qui travaillent dans les bureaux ? "
            "Recopie sa phrase.",
            "« Qui a jamais souffert l'amertume d'une Kola alors qu'il avait "
            "du sel dans sa poche ? » Explique cette phrase : quel est le sel, "
            "dans son cas ?",
            "Comment Ana obtient-elle finalement la carte ? Que lui en "
            "coûte-t-il ?",
            "Relève tout ce que le ngomna apporte à la maison. Pourquoi "
            "personne n'y touche-t-il ?",
            "« Le bénéfice qu'il y a à avoir une fille jolie. » Le narrateur "
            "est-il sérieux ? Comment appelle-t-on cette façon de dire le "
            "contraire de ce qu'on pense ?"],
        grille_lecture=[
            ("Que le vieux a mal partout",
             "Les mots du corps (crâne, ventre, jambes, genoux, rhumatismes)"),
            ("Que le narrateur se moque en douceur",
             "Les images inattendues (« deux souliers ricanant de vieillesse »)"),
            ("Que les deux vieux se comprennent sans parler",
             "Le nombre de mots échangés — compte-les"),
            ("Que le ngomna est ridicule",
             "Les mots qui décrivent son ventre")],
        bilan=[
            "Voici comment fonctionne tout le livre : le narrateur ne dit "
            "jamais « c'est injuste ». Il **décrit**, et l'injustice se voit "
            "toute seule.",
            "Regarde la mécanique : pour obtenir un papier auquel elle a droit, "
            "Ana doit se rendre visible à un homme puissant. Le papier arrive "
            "en **trois minutes** — le texte le précise. Trois minutes, contre "
            "des journées de marche pour le vieux.",
            "Et le titre alors ? *Le fardeau*. Le fardeau, c'est le ventre du "
            "ngomna, c'est sa charge, c'est la beauté d'Ana, ce sont les "
            "cadeaux qu'on ne peut ni refuser ni consommer. Un mot, quatre "
            "sens : c'est ce qu'on appelle un **titre qui travaille**."],
        encadres=[
            ("mot", "Les mots difficiles de la séance", [
                "**La calvitie** : l'absence de cheveux.",
                "**Se désaltérer** : boire pour n'avoir plus soif.",
                "**Adipeux** : gras.",
                "**Un gnome** : un nain de conte, petit et laid.",
                "**Un pourboire** : l'argent qu'on donne en plus — ici, le "
                "petit cadeau qu'on exige pour faire son travail."]),
            ("rire", "L'art de décrire un ronflement", [
                "Abega ne dit pas « il ronflait fort ». Il demande : *« Avez-"
                "vous jamais essayé de dormir sous les mêmes draps qu'un groupe "
                "électrogène en accélération constante ? »*",
                "Puis il plaint la femme, qui pince les côtes et tire la "
                "moustache de son mari **en vain**, et finit par s'endormir "
                "« bercée par le tyrannique et nasillard ronflement ».",
                "Retiens le procédé, tu t'en serviras : pour faire rire, ne "
                "grossis pas l'adjectif — **change de monde**. Un ronflement "
                "devient une machine."])])

    b += lecture_suivie(
        2, "Le bachelier et sa cravate (« Dans la forêt »)",
        situation=[
            "Deuxième nouvelle. Dany vient d'obtenir son baccalauréat. Sa mère "
            "a dû le harceler pendant des semaines pour qu'il accepte d'aller "
            "voir sa grand-mère au village — il n'y était pas venu depuis cinq "
            "ans.",
            "Il arrive à seize heures, en veste et cravate, après deux heures "
            "de marche au soleil. Regarde bien comment il entre."],
        texte=_x("Du haut de son baccalauréat"), source=SRC,
        questions=[
            "« Du haut de son baccalauréat, Dany toisa le village. » Explique "
            "le verbe *toiser*. Que nous apprend cette première phrase sur "
            "Dany ?",
            "Comment le village est-il décrit ? Relève la comparaison avec un "
            "appareil de bureau. Pourquoi est-elle méchante ?",
            "« Et juché sur sa cravate, le prodige entra dans le village. » "
            "Qui parle ici : Dany, ou le narrateur qui se moque de lui ? "
            "Justifie.",
            "Qui accueille Dany à son arrivée ? Fais la liste. Qu'est-ce que "
            "cela dit de l'effet produit par sa cravate ?",
            "Relève trois passages où le corps de Dany souffre à cause de ses "
            "vêtements. Quel est le rapport avec le titre du livre ?",
            "La villageoise qu'il croise porte « à califourchon sur son nez, un "
            "morceau de civilisation ». De quoi s'agit-il ? Pourquoi Dany "
            "sursaute-t-il ?"],
        grille_lecture=[
            ("Que Dany se croit supérieur",
             "Les mots de hauteur (*du haut de*, *toisa*, *juché*, *éminence*)"),
            ("Que le narrateur ne partage pas son avis",
             "Les mots d'ironie (*le prodige*, *sa dignité lui interdisait*)"),
            ("Que le village est indifférent",
             "Les seuls témoins de son arrivée (poulets, cabris, margouillat)"),
            ("Que le corps dit la vérité avant la tête",
             "Les souffrances physiques (orteils, sueur, cou raidi)")],
        bilan=[
            "Cette nouvelle est bâtie comme un piège, et le piège se referme à "
            "la dernière ligne. Dany passe toute l'histoire à chercher qui est "
            "**Ambombo**, ce rival dont les écoliers vantent les calculs. Il "
            "imagine un vieil élève barbu, redoublant depuis toujours.",
            "Ambombo est **la fille aux lunettes** croisée sur la route, celle "
            "dont il a jugé les pagnes rafistolés — et elle est **ingénieur**. "
            "Toute la journée, il lui a exposé ses théories. Elle a souri.",
            "La dernière phrase est une des plus belles du livre : *« Que ne "
            "peut-on ramasser les paroles qui ont franchi le seuil de nos "
            "lèvres ! »*",
            "**Ce retournement final s'appelle une chute.** C'est la marque de "
            "la nouvelle. Guette-la désormais dans chacune des sept."],
        encadres=[
            ("mot", "Les mots difficiles de la séance", [
                "**Toiser** : regarder quelqu'un de haut en bas, avec mépris.",
                "**Équarrir** : tailler un tronc pour en faire une poutre "
                "droite.",
                "**Un duplicateur** : une machine de bureau qui recopie un "
                "document en série. Dany compare les cases du village aux "
                "copies mal réglées d'une même page.",
                "**Une éminence** : un personnage important.",
                "**Un pensum** : une punition écrite ; par extension, une "
                "corvée."]),
            ("perso", "Ce que la grand-mère répond sans un mot", [
                "Dany déballe devant elle la liste des prétextes qu'il a "
                "préparés pour ne pas aller au champ.",
                "Elle **sourit**, hoche la tête, met son panier sur la tête — "
                "houe, machette, semences — et part au champ en disant que "
                "*« la plume et le papier ramollissaient les mains d'une façon "
                "inquiétante pour l'avenir du pays »*.",
                "Dany, « navré de constater qu'elle avait raison », prend une "
                "machette et la suit. Une phrase de vieille dame vient de "
                "gagner contre un baccalauréat."])])

    b += lecture_suivie(
        3, "Le sourire le plus cher du monde (« Une petite vendeuse de "
           "beignets »)",
        situation=[
            "Troisième nouvelle. Serge, étudiant en médecine, beau garçon et "
            "collectionneur de conquêtes, a rencontré au bal de sa promotion "
            "une jeune fille dont le rire l'a foudroyé. Elle lui a donné "
            "rendez-vous au carrefour, devant un bar.",
            "Il descend du taxi, en costume trois-pièces blanc et cravate "
            "rouge. Il s'avance. Et il la voit.",
            "Attention : la nouvelle commence **après** la catastrophe. Le "
            "narrateur te fait d'abord un cours sur le rire."],
        texte=_x("C'est une maladie contagieuse qui fait larmoyer"), source=SRC,
        questions=[
            "Les huit premières lignes décrivent une « maladie contagieuse ». "
            "Relève cinq symptômes. À quelle ligne comprends-tu de quoi il "
            "s'agit ?",
            "Pourquoi l'auteur a-t-il choisi de nous faire deviner au lieu de "
            "dire le mot tout de suite ?",
            "« La huitième merveille du monde s'est abîmée dans un flot de "
            "larmes. » De quelle merveille parle-t-il ?",
            "Que fait la vendeuse pendant qu'elle pleure ? Pourquoi ce détail "
            "est-il si dur ?",
            "Relève la description du costume de Serge. Combien de détails "
            "comptes-tu ? Et pour la vendeuse, combien de mots sur ses "
            "vêtements ?",
            "Que craint Serge exactement ? Relève ses raisons. Y en a-t-il une "
            "seule qui concerne **elle** ?"],
        grille_lecture=[
            ("Que le narrateur retarde le mot « rire »",
             "Les symptômes accumulés avant la révélation"),
            ("Que la tristesse est dite par le corps",
             "Les mots de la bouche, des dents, des lèvres"),
            ("Que Serge ne pense qu'à son image",
             "Les mots du regard des autres (*scandale*, *honneur*, *bonne "
             "presse*)"),
            ("Que le narrateur juge Serge",
             "Les formules ironiques (*son tableau de chasse plaidait contre "
             "lui*)")],
        bilan=[
            "Une nouvelle en deux temps. **Le présent** : une fille pleure "
            "devant sa friture, et personne ne sait pourquoi. **Le passé** : "
            "le bal, la danse, le rire, le rendez-vous.",
            "Ce montage n'est pas un caprice. Il t'oblige à te poser la "
            "question du narrateur — *pourquoi la vendeuse de beignets "
            "pleure-t-elle ?* — avant de pouvoir y répondre. Quand la réponse "
            "arrive, elle fait mal.",
            "Et regarde ce que Serge n'a pas fait : il n'a pas parlé. Il "
            "s'est arrêté, il a hésité, il a battu en retraite. **La lâcheté, "
            "ici, tient en trois verbes.**",
            "Le texte donne à la jeune fille une image magnifique : elle a été "
            "« une comète, un météore qui brûle si brièvement, mais si "
            "violemment, qu'il éclipse les étoiles ». Puis le bal a fini."],
        encadres=[
            ("mot", "Les mots difficiles de la séance", [
                "**Éphémère** : qui ne dure pas.",
                "**Un quolibet** : une moquerie lancée à haute voix.",
                "**Un polyglotte** : quelqu'un qui parle plusieurs langues.",
                "**Éconduire** : renvoyer quelqu'un poliment mais fermement.",
                "**Une guenille** : un vêtement en loques."]),
            ("rire", "Le rire, seule langue commune", [
                "Le narrateur rappelle la tour de Babel : quand elle s'est "
                "écroulée, elle a fait « autant de débris que d'idiomes » — "
                "autant de langues différentes.",
                "« Pourtant, un seul langage est resté commun à tous les "
                "hommes. C'est le rire, et bien sûr, son frère jumeau, le "
                "sanglot. »",
                "Retiens la formule. Elle explique pourquoi le rire ouvre la "
                "nouvelle et pourquoi les larmes la ferment."])])

    b += lecture_suivie(
        4, "La leçon du savon (« Le savon »)",
        situation=[
            "Quatrième nouvelle, et cœur du livre. Mbah vit de ce que les "
            "autres jettent : il pousse un pousse-pousse de poubelle en "
            "poubelle et revend bouteilles, cartons, ferraille, bidons.",
            "Sa famille en meurt de honte. Tantes, oncles paternels, oncles "
            "maternels : tous se réunissent tour à tour pour le sauver malgré "
            "lui. Il s'échappe de chaque réunion.",
            "Mais avant de raconter Mbah, le narrateur t'explique ce qu'est "
            "vraiment la saleté. Écoute-le : c'est la page la plus importante "
            "du volume."],
        texte=_x("Avoir à patauger chaque jour"), source=SRC,
        questions=[
            "La première phrase est très longue. Compte les infinitifs qui "
            "s'y accumulent. Quel effet cette accumulation produit-elle ?",
            "« Ils ne craignent pas de se salir les mains. Pourtant, ils "
            "restent parmi les rares à avoir les mains propres. » Explique ce "
            "paradoxe avec tes mots.",
            "Fais la liste des prix relevés dans le texte (bouteille, "
            "dame-jeanne…). Pourquoi l'auteur donne-t-il des chiffres précis ?",
            "Dans quel ordre les usines sont-elles arrivées, selon le texte ? "
            "Quelle est la dernière ? Qu'en pense le narrateur ?",
            "Recopie la phrase qui commence par « Mon fils, le corps n'est "
            "jamais sale ». Qui parle ? À qui ?",
            "Quelle est la seule saleté qu'aucun savon ne lave ? Recopie la "
            "réponse du texte."],
        grille_lecture=[
            ("Que le travail des écumeurs est un enfer",
             "L'accumulation des infinitifs et des mots de dégoût"),
            ("Que le narrateur les respecte",
             "Le renversement (« ils restent parmi les rares à avoir les mains "
             "propres »)"),
            ("Que le narrateur accuse les usines",
             "L'ordre d'arrivée : alcool et tabac d'abord, ciment ensuite"),
            ("Que la leçon s'adresse à un enfant",
             "Les appels au fils (« mon fils », « mon enfant »)")],
        bilan=[
            "C'est ici que le titre du livre s'explique tout entier. Il y a "
            "**deux saletés**, et on les confond sans arrêt.",
            "La première se voit : la boue, la suie, le cambouis, la farine, "
            "la sueur. Elle est **glorieuse**, dit le texte, car sans elle "
            "« personne, personne au monde ne mangerait ». Et elle part au "
            "savon.",
            "La seconde ne se voit pas : *« le jour où tu te seras sali les "
            "mains pour vivre, en tuant, en mentant, en volant, en escroquant, "
            "eh bien, aucun savon, aucun détergent n'aura la puissance "
            "nécessaire pour te laver de cette souillure »*.",
            "Toute la colère du livre tient dans cet écart. On méprise ceux "
            "que le savon nettoie, et l'on respecte ceux qu'aucun savon ne "
            "nettoiera jamais."],
        encadres=[
            ("mot", "Les mots difficiles de la séance", [
                "**Abject** : bas, méprisable, dégoûtant.",
                "**Pestilentiel / nauséabond** : qui sent horriblement mauvais.",
                "**Une dame-jeanne** : une très grosse bouteille de verre, "
                "protégée par de l'osier.",
                "**Frelaté** : trafiqué, mélangé à autre chose de mauvaise "
                "qualité.",
                "**Un anathème** : une malédiction, une condamnation "
                "solennelle."]),
            ("culture", "Une question à se poser en famille", [
                "Le texte affirme que les Blancs ont installé d'abord des "
                "**brasseries**, puis des **fabriques de tabac**, et que les "
                "usines de ciment sont venues bien plus tard.",
                "L'auteur en tire une ironie : ils disaient vouloir aider à "
                "bâtir le pays, et ils ont commencé par la boisson.",
                "**À toi de vérifier.** Cherche, auprès d'un adulte ou d'un "
                "livre d'histoire, quelles furent les premières usines de ton "
                "pays. Un écrivain a le droit d'exagérer ; un élève a le "
                "devoir de vérifier."])])

    b += lecture_suivie(
        5, "L'odeur de la terre mouillée (« Un étranger de passage »)",
        situation=[
            "Cinquième nouvelle. Ahanda a passé son baccalauréat « plus par "
            "honneur que par désir », puis il a annoncé à son père qu'il "
            "n'irait plus à l'école. Le village a hurlé. Les tantes ont "
            "convoqué les esprits.",
            "Il est revenu au village pour toujours. Il y bâtit des écoles et "
            "cultive. La plupart des gens ricanent et disent qu'il a échoué.",
            "Voici pourquoi il est revenu. Ce n'est pas ce que le village "
            "croit."],
        texte=_x("Rien ne grise autant que l'odeur"), source=SRC,
        questions=[
            "Recopie la première phrase. Sur quoi porte-t-elle : une idée, un "
            "sentiment, ou une **sensation** ?",
            "« On souhaiterait voir son corps transformé en un immense nez, "
            "tous ses pores devenir autant de narines. » Cette image "
            "est-elle sérieuse ? Que veut-elle faire sentir ?",
            "Pourquoi le mot ODEUR est-il écrit en capitales ?",
            "Que se passe-t-il pour Ahanda pendant les cours ? Où va-t-il ?",
            "« Les oreilles n'ont pas de paupières. » Explique cette phrase. "
            "En quoi éclaire-t-elle le problème d'Ahanda en classe ?",
            "L'oncle prévient Ahanda : « Ne crois pas qu'ils réalisent ce que "
            "tu as fait pour eux. » A-t-il raison ? Cherche dans la suite de "
            "la nouvelle."],
        grille_lecture=[
            ("Que l'odeur envahit tout",
             "Les mots de l'odorat (nez, narines, pores, aspirer, senteurs)"),
            ("Que le village appelle Ahanda",
             "Les bruits qu'il entend en classe, à cent cinquante kilomètres"),
            ("Que l'école lui glisse dessus",
             "Les images de l'imperméabilité (« glissaient sur son cerveau », "
             "« vacciné »)"),
            ("Que le narrateur invente des mots pour les sensations",
             "Les comparaisons et les exagérations")],
        bilan=[
            "Voici la nouvelle la plus douce du livre, et la plus utile pour "
            "toi. Ahanda n'est pas paresseux : *« sa nature profonde "
            "l'éloignait des livres »*. Ce n'est pas la même chose.",
            "Regarde ce que le texte fait avec une odeur. Il ne dit pas "
            "« ça sentait bon ». Il dit qu'on voudrait aspirer cette odeur "
            "entièrement, « sans en laisser la moindre bouffée à un autre ». "
            "**Une sensation devient un sentiment** : de la gourmandise, de la "
            "jalousie, de l'amour.",
            "Mets cette nouvelle à côté de « Dans la forêt » : Dany a le bac et "
            "méprise la terre ; Ahanda a le bac et la choisit. Abega ne dit pas "
            "que l'école est inutile — il dit qu'un diplôme **ne rend "
            "supérieur à personne**."],
        encadres=[
            ("mot", "Les mots difficiles de la séance", [
                "**Griser** : monter à la tête, enivrer.",
                "**Une fragrance** : un parfum agréable.",
                "**Futile** : sans importance, léger.",
                "**Une soupape d'admission** : la pièce qui laisse entrer ou "
                "non l'air dans un moteur. L'auteur regrette que l'oreille n'en "
                "ait pas.",
                "**Des tribulations** : une suite d'aventures difficiles."]),
            ("jeu", "Écris ton ODEUR", [
                "Choisis **une seule odeur** que tu reconnaîtrais les yeux "
                "fermés : le beignet chaud, la pluie sur la poussière, le "
                "poisson braisé, la craie du tableau, le savon du dimanche.",
                "Écris cinq lignes pour la faire sentir à quelqu'un qui ne la "
                "connaît pas. **Interdit** : les mots *bon*, *bien*, "
                "*agréable*, *délicieux*. Obligatoire : une comparaison et une "
                "exagération."])])

    b += lecture_suivie(
        6, "La gifle de la vérité (« Mots d'enfants »)",
        situation=[
            "Sixième nouvelle. Le père de Towa l'envoie chez Etoundi chercher "
            "une calebasse de vin de palme commandée — et payée — la veille.",
            "La fillette revient et annonce ce qu'elle a vu. Sa mère la gifle "
            "immédiatement.",
            "Pour comprendre, il faut savoir une chose : Etoundi n'a plus "
            "travaillé depuis sept ans."],
        texte=_x("Towa crut que sa mère lui avait mis la cervelle"), source=SRC,
        questions=[
            "Qu'a annoncé Towa exactement ? Pourquoi cela paraît-il "
            "invraisemblable à sa mère ?",
            "Relève la comparaison qui décrit la force de la gifle. Est-elle "
            "drôle ou cruelle ? Peut-elle être les deux ?",
            "Selon la mère, qu'aurait été plus **croyable** que ce que Towa "
            "raconte ? Que nous dit cette phrase sur Etoundi ?",
            "Que découvre la mère en allant vérifier ? Qu'est-ce qui lui "
            "arrive en chemin ?",
            "Comment le père commente-t-il l'affaire ? Que révèle son "
            "commentaire sur l'ambiance de ce couple ?",
            "Pourquoi le départ d'Etoundi vers sa cacaoyère est-il « l'événement "
            "de l'année » ? Réponds en citant le texte."],
        grille_lecture=[
            ("Que l'enfant dit vrai et se fait punir",
             "L'ordre des faits : l'annonce, la gifle, la vérification"),
            ("Que le narrateur exagère pour faire rire",
             "Les comparaisons (« décortiquer comme une arachide trop mûre »)"),
            ("Que le village juge Etoundi",
             "Les surnoms qu'on lui donne (« un estomac sur pattes »)"),
            ("Que le narrateur défend pourtant Etoundi",
             "Le passage qui commence par « Mais dire qu'Etoundi n'était "
             "qu'un estomac sur pattes… »")],
        bilan=[
            "Une nouvelle qui tient sur une injustice minuscule et parfaite : "
            "**une enfant est punie pour avoir dit la vérité**, parce que la "
            "vérité était plus étonnante que le mensonge.",
            "Et le narrateur enfonce le clou : la mère aurait mieux cru sa "
            "fille si celle-ci avait annoncé qu'une corne poussait sur le front "
            "d'Etoundi. Un miracle passe ; un homme qui se remet au travail, "
            "non.",
            "Note enfin comment le texte **refuse de mépriser Etoundi** : oui, "
            "c'est une bouche ; mais c'est aussi « un brillant canif », le "
            "meilleur tireur de vin de palme du village, dont le vin convainc "
            "les beaux-pères mieux que l'éloquence des vieillards. Chez Abega, "
            "personne n'est réductible à son défaut."],
        encadres=[
            ("mot", "Les mots difficiles de la séance", [
                "**Une taloche** : une gifle.",
                "**Cauteleux** : rusé et hypocrite.",
                "**Un pique-assiette** : celui qui s'invite pour manger chez "
                "les autres.",
                "**Une commotion** : un choc violent.",
                "**Le nectar** : une boisson délicieuse — le mot vient de la "
                "boisson des dieux grecs."]),
            ("culture", "Le vin de palme et le canif", [
                "Pour tirer le vin de palme, on **entaille** le tronc ou le "
                "régime du palmier avec une lame, et l'on recueille la sève "
                "qui coule dans une calebasse.",
                "Le texte dit d'Etoundi : *« Jamais canif ne fut mieux employé "
                "que le sien. Chaque fois que son fer mordait la chair d'un "
                "palmier, il en coulait des merveilles. »*",
                "C'est un vrai métier, avec une vraie main. Un métier de "
                "**bimane** — et le village le sait, puisqu'on lui pardonne "
                "tout le reste."])])

    b += cote_enseignant([
        "Six séances ; la septième nouvelle, « Au ministère du soya », sert de "
        "support à l'épreuve d'étude de texte et se lit à la maison.",
        "La nouvelle 3 évoque les conquêtes féminines de Serge et une "
        "postulante religieuse : la lecture en classe s'en tient au passage "
        "retenu, qui n'en dit rien.",
        "La langue d'Abega est riche : prévoir, à chaque séance, cinq minutes "
        "de lecture à voix haute par l'enseignant avant la lecture "
        "silencieuse. Le texte a été primé dans un concours **radiophonique** ; "
        "il est fait pour l'oreille.",
        "Le retournement final de la nouvelle 2 (Ambombo) ne doit surtout pas "
        "être dévoilé avant que les élèves aient lu le texte entier."])
    b.append(saut())
    return b
