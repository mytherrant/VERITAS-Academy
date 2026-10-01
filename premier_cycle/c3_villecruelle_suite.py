# -*- coding: utf-8 -*-
"""3ᵉ — *Ville cruelle* : écrire, jouer, s'évaluer.

Deux ateliers. **La description qui accuse**, parce que le chapitre II est le
plus grand morceau de description de tout le programme de troisième et qu'il
ne décrit jamais pour décrire. **Le récit au passé**, parce qu'un roman de
cent cinquante pages tient dans un schéma que l'élève doit savoir refaire.

Le texte de la correction orthographique est **composé** : l'élève a le roman
entre les mains, et un extrait lui donnerait la version correcte à recopier.
"""
import jeux
import source
from gabarit import (epreuve_etude_texte, epreuve_expression,
                     epreuve_orthographe, production)
from kit import enc, grille, h2, h3, p, saut

CLE = "villecruelle"
SRC = "Eza Boto, *Ville cruelle*, Présence Africaine"
BORNES = ["CHAPITRE PREMIER", "CHAPITRE II", "CHAPITRE III", "CHAPITRE IV",
          "CHAPITRE V", "CHAPITRE VI", "CHAPITRE VII", "CHAPITRE VIII",
          "CHAPITRE IX", "CHAPITRE X", "CHAPITRE XI", "CHAPITRE XII",
          "CHAPITRE XIII", "EPILOGUE"]


# ==================================================== 5. Les productions

def partie5():
    b = [h2("5. J'écris — la description et le récit"),
         p("Deux ateliers ici. Avec les deux de l'œuvre suivante et les deux "
           "de la dernière, tu auras couvert ce qu'on te demandera à "
           "l'examen.")]

    b += production(
        "la description qui accuse",
        "décrire un lieu de telle sorte que le lecteur juge, sans que j'aie "
        "eu besoin de juger à sa place.",
        modele=(
            "❶ Le carrefour se voyait de loin : c'était le seul endroit du "
            "quartier où l'on avait bitumé.\n"
            "❷ À droite, six boutiques neuves, toutes peintes de la même "
            "peinture jaune, avec des vitrines, des climatiseurs qui "
            "gouttaient sur le trottoir et un vigile par porte. À gauche, de "
            "l'autre côté de la route, le marché : des tables de planches, "
            "des bâches trouées tendues sur des piquets, et la boue que "
            "personne n'avait jamais songé à combler.\n"
            "❸ Entre les deux passait la route, large, bien droite, et si "
            "propre qu'on aurait dit qu'elle venait d'ailleurs.\n"
            "❹ Les vendeuses du marché regardaient les boutiques toute la "
            "journée. Les boutiques, elles, avaient été construites de "
            "manière à leur tourner le dos — par souci d'esthétique, "
            "probablement.\n"
            "❺ Deux carrefours. Deux commerces. Deux prix."),
        annotations=[
            ["❶", "**Un point de vue.** On dit d'où l'on regarde, et l'on "
                  "donne le trait qui distingue le lieu de tous les autres."],
            ["❷", "**Deux séries opposées, terme à terme.** Six boutiques "
                  "neuves ↔ des tables de planches ; des vitrines ↔ des "
                  "bâches trouées. Le lecteur compare tout seul."],
            ["❸", "**Ce qui sépare.** La route joue ici le rôle que la "
                  "colline joue dans *Ville cruelle*."],
            ["❹", "**Le détail qui accuse, suivi d'une fausse excuse.** "
                  "« par souci d'esthétique, probablement » : l'auteur fait "
                  "semblant d'excuser, et c'est ce qui condamne. C'est de "
                  "l'**ironie**."],
            ["❺", "**La formule qui ferme.** Trois groupes courts, même "
                  "construction, gradation du concret vers l'argent."]],
        questions=[
            "Combien de fois l'auteur dit-il que la situation est injuste ? "
            "Compte les mots comme *injuste*, *scandaleux*, *honteux*.",
            "Relève les deux séries d'éléments opposés. Range-les dans un "
            "tableau à deux colonnes.",
            "Que fait la route dans ce texte, en plus de passer ?",
            "Supprime la dernière phrase et relis. Qu'est-ce que le texte "
            "perd ?",
            "Réécris l'étape ❹ en enlevant « probablement ». L'effet "
            "est-il plus fort ou moins fort ? Explique.",
            "Le texte suit un ordre : d'où part le regard, et où va-t-il ? "
            "Dessine la flèche."],
        regle=[
            "**Une description ne prouve rien : elle montre, et c'est le "
            "lecteur qui conclut.** C'est pour cela qu'elle est plus forte "
            "qu'un discours.",
            "**Choisis un point de vue** et n'en change pas : de haut, de "
            "loin, en marchant, depuis une fenêtre.",
            "**Suis un ordre** : de gauche à droite, du bas vers le haut, du "
            "proche au lointain. Une description sans ordre est une liste.",
            "**Oppose deux séries** quand tu veux faire sentir une "
            "injustice : les mêmes catégories, deux fois, avec des mots "
            "contraires.",
            "**Glisse une fausse excuse** (« par erreur d'appréciation, "
            "probablement ») : l'ironie accuse mieux que l'indignation.",
            "**Ferme par une formule courte**, rythmée, qui résume tout."],
        astuce=("Trois pièges à éviter", [
            "**L'adjectif qui fait le travail à ta place.** « Un marché "
            "horrible, sale, dégoûtant » ne montre rien. « Des bâches trouées "
            "tendues sur des piquets » montre tout.",
            "**La description qui ne s'arrête jamais.** Douze lignes bien "
            "rangées valent mieux que trente en désordre.",
            "**L'insulte.** Dès que tu insultes, tu as perdu : le lecteur se "
            "met à défendre celui que tu attaques."]),
        exercices=[
            "**Le carrefour de ton quartier**, ou la cour de ton "
            "établissement à la récréation. Quinze lignes, deux séries "
            "opposées, une fausse excuse, une formule finale.",
            "Reprends ta description et **change le point de vue** : "
            "raconte-la depuis une fenêtre du premier étage. Qu'est-ce qui "
            "disparaît ? Qu'est-ce qui apparaît ?",
            "Écris **cinq lignes** décrivant un objet du quotidien (une "
            "mototaxi, un cahier de textes, un ventilateur de salle de "
            "classe) à la manière de l'autogrue d'Eza Boto : en faisant "
            "de l'objet un animal."])

    b += production(
        "le récit au passé",
        "raconter en cinq étapes une histoire qui tient debout, et la "
        "raconter au passé sans mélanger les temps.",
        modele=(
            "❶ Cette année-là, Ateba avait réussi son examen d'entrée en "
            "sixième et son père avait promis un vélo.\n"
            "❷ Un matin de septembre, l'usine où travaillait le père ferma "
            "ses portes sans prévenir personne.\n"
            "❸ Ateba ne dit rien. Il commença par vendre des sachets d'eau "
            "devant le lycée, puis des arachides grillées, puis des cartes "
            "de recharge. Chaque soir, il comptait sa monnaie dans une boîte "
            "de lait. Deux fois, on lui prit sa marchandise ; deux fois, il "
            "recommença.\n"
            "❹ À la fin du deuxième trimestre, il posa la boîte sur la "
            "table. Il y avait exactement de quoi acheter un vélo "
            "d'occasion. Son père la regarda longtemps, puis dit : « Garde "
            "cet argent. Un vélo se casse. »\n"
            "❺ Ateba n'eut jamais de vélo. Il ouvrit, quatre ans plus tard, "
            "la première boutique de recharges du carrefour."),
        annotations=[
            ["❶", "**Situation initiale**, à l'imparfait : ce qui durait, et "
                  "ce qu'on attendait."],
            ["❷", "**Élément perturbateur**, au passé simple : un fait "
                  "unique, qui casse l'équilibre. Repère le changement de "
                  "temps — c'est lui qui fait sentir la rupture."],
            ["❸", "**Péripéties**, au passé simple avec des repères de "
                  "temps : *puis*, *chaque soir*, *deux fois*. Les épreuves "
                  "vont en s'aggravant."],
            ["❹", "**Dénouement** : la scène qui résout, avec une réplique. "
                  "Une phrase prononcée vaut trois phrases racontées."],
            ["❺", "**Situation finale**, qui n'est pas le retour au départ : "
                  "le héros a changé, et le lecteur voit en quoi."]],
        questions=[
            "Relève tous les verbes de l'étape ❶, puis ceux de l'étape ❷. "
            "À quels temps sont-ils ? Que produit le passage de l'un à "
            "l'autre ?",
            "Combien d'épreuves Ateba traverse-t-il ? Sont-elles rangées au "
            "hasard ?",
            "Relève les indicateurs de temps. Combien y en a-t-il ? Que "
            "deviendrait le texte sans eux ?",
            "Pourquoi le père parle-t-il au discours direct, et pas le fils ?",
            "La situation finale est-elle heureuse ? Justifie ta réponse en "
            "une phrase.",
            "Où est le narrateur : dans l'histoire, ou en dehors ? À quoi le "
            "vois-tu ?"],
        regle=[
            "**Cinq étapes, toujours les mêmes** : situation initiale → "
            "élément perturbateur → péripéties → dénouement → situation "
            "finale.",
            "**Deux temps du passé, deux emplois.** L'**imparfait** pour ce "
            "qui dure, se répète, sert de décor. Le **passé simple** pour ce "
            "qui arrive une fois et fait avancer.",
            "**Range tes péripéties par ordre croissant** : la plus dure en "
            "dernier. Trois suffisent.",
            "**Fais parler.** Une réplique bien placée au dénouement vaut "
            "mieux qu'un paragraphe d'explication.",
            "**Change quelque chose entre le début et la fin.** Un récit où "
            "rien n'a changé n'est pas un récit."],
        exercices=[
            "**« Le jour où tout ce que j'avais préparé a été perdu. »** "
            "Vingt-cinq lignes, les cinq étapes, imparfait et passé simple. "
            "Une seule réplique, au dénouement.",
            "Reprends ton récit et **supprime la situation finale**. Fais "
            "lire à ton voisin : que manque-t-il ?",
            "Écris la même histoire **en dix lignes**. Ce que tu gardes est "
            "l'essentiel ; ce que tu jettes était du remplissage."])

    b.append(saut())
    return b


# ================================================ 6. Je joue et je révise

def partie6():
    b = [h2("6. Je joue et je révise"), p("Livre fermé.")]
    corriges = []

    e, c = jeux.mots_meles("Les mots de Tanga", [
        "Tanga", "Bamila", "Banda", "Koume", "Odilia", "Tonga", "cacao",
        "controle", "bille", "autogrue", "colline", "fleuve", "pirogue",
        "flottage", "hotte", "romaine", "clerc", "rabatteur", "scierie",
        "quai", "grue", "feve", "chronique", "FortNegre"], graine=94)
    b += e
    corriges += c

    e, c = jeux.mots_croises("Le vocabulaire du roman", [
        ("CHRONIQUE", "Le mot par lequel le narrateur désigne son propre "
                      "récit"),
        ("BILLE", "Un tronc abattu, prêt pour la scierie"),
        ("FLOTTAGE", "Le transport des troncs par voie d'eau"),
        ("AUTOGRUE", "La machine que le narrateur trouve plus laide qu'un "
                     "éléphant"),
        ("ROMAINE", "La balance à contrepoids du contrôleur"),
        ("RABATTEUR", "Celui qui crie dans la rue pour attirer les vendeurs"),
        ("HOTTE", "Le panier de dos dont les bretelles entrent dans les "
                  "épaules"),
        ("FEVE", "La graine du cacao, que le contrôleur presse et coupe"),
        ("PARAPET", "Le muret du pont d'où l'on regarde passer le fleuve"),
        ("CLERC", "L'employé qui vous invite « trop chaleureusement »"),
        ("EXPORTATION", "Ce à quoi les billes de bois sont destinées"),
        ("IRONIE", "Dire poliment le contraire de ce qu'on pense"),
    ], graine=181)
    b += e
    corriges += c

    e, c = jeux.qcm("As-tu vraiment lu le roman ?", [
        ("Sous quel nom ce roman est-il signé ?",
         ["Mongo Beti", "Eza Boto", "Ferdinand Oyono", "Ernest Alima"], 1),
        ("Comment le narrateur appelle-t-il son propre récit, au chapitre "
         "II ?",
         ["un roman", "une chronique", "un conte", "un témoignage"], 1),
        ("Qu'est-ce qui coupe la ville de Tanga en deux ?",
         ["le fleuve", "la voie ferrée", "une haute colline", "le marché"], 2),
        ("Combien de kilos de cacao Banda descend-il vendre ?",
         ["cinquante", "cent", "deux cents", "mille"], 2),
        ("Combien de solutions officielles s'offrent au cacao présenté au "
         "Contrôle ?",
         ["une", "deux", "trois", "quatre"], 2),
        ("Qu'arrive-t-il au cacao de Banda ?",
         ["il est vendu au prix officiel", "il est séché au soleil",
          "il est saisi et mis au feu", "il est volé pendant la nuit"], 2),
        ("Qui est Koumé ?",
         ["un contrôleur", "un commerçant grec",
          "un jeune mécanicien recherché par la police",
          "l'oncle de Banda"], 2),
        ("Comment Koumé meurt-il ?",
         ["la police le tue", "il tombe du pont de ciment",
          "il glisse d'une passerelle — un tronc d'arbre — et se noie",
          "il meurt de ses blessures dans la case"], 2),
        ("Que trouve Banda dans la poche de Koumé ?",
         ["un couteau seulement", "une lettre",
          "un canif, puis un paquet de billets de banque", "rien du tout"], 2),
        ("Qui, à la fin, compte dix billets de mille francs dans la main de "
         "Banda ?",
         ["son oncle Tonga", "le contrôleur", "M. Pallogakis",
          "Démétropoulos"], 3),
        ("Où Banda décide-t-il d'aller, dans l'épilogue ?",
         ["à Bamila", "à Tanga", "à Fort-Nègre", "en France"], 2),
        ("Que répond-il à Sabina qui lui rappelle le village de son père ?",
         ["« Je reviendrai demain »",
          "« Qui donc a dit […] que le fils devait nécessairement vivre où a "
          "vécu le père ! »", "« La terre est à ceux qui la travaillent »",
          "« Je n'ai plus de père »"], 1),
    ])
    b += e
    corriges += c

    e, c = jeux.vrai_faux("Vrai ou faux à Tanga", [
        ("Les bâtiments administratifs sont construits face au Tanga "
         "indigène.", False,
         "Ils lui **tournent le dos** — « par une erreur d'appréciation "
         "probablement », ajoute le narrateur, qui n'en croit pas un mot."),
        ("M. Pallogakis ouvre la journée en achetant le cacao **au-dessus** "
         "du prix officiel.", True,
         "C'est le début du mécanisme : la nouvelle se répand « comme un feu "
         "de brousse », la foule arrive, et le cours baisse ensuite « "
         "progressivement et insensiblement »."),
        ("Une quatrième solution existait au Contrôle, en plus des trois "
         "officielles.", True,
         "Le texte l'appelle « transactionnelle », et ajoute : « Banda "
         "aurait bien fait de la connaître »."),
        ("Banda vend son cacao et rentre au village avec l'argent de la "
         "dot.", False,
         "Son cacao est saisi et mis au feu. Tout le roman part de là."),
        ("Le narrateur écrit que l'autogrue est une belle machine moderne.",
         False,
         "Il écrit exactement le contraire : « Pour un objet qui se déplace "
         "tout seul, il était difficile de rien imaginer de plus laid. »"),
        ("Banda avait prévenu Koumé de ne pas s'engager seul sur la "
         "passerelle.", True,
         "Il devait frotter une allumette depuis l'autre berge. Koumé n'a "
         "pas attendu le signal."),
        ("La mère de Banda meurt avant les événements racontés dans le "
         "roman.", False,
         "Elle meurt « quelques jours après les événements que vient de "
         "relater cette chronique » — c'est la première phrase de "
         "l'épilogue."),
        ("Le père de Banda lui avait légué une plantation de cacaoyers.",
         True,
         "Sabina le lui rappelle à la dernière page pour le retenir au "
         "village. Cela ne le retient pas."),
    ])
    b += e
    corriges += c

    e, c = jeux.remise_en_ordre("Remets le roman dans l'ordre", [
        "Banda descend de Bamila à Tanga avec deux cents kilos de cacao, "
        "portés à six.",
        "Il fait la queue devant les agents du Contrôle, qui se font "
        "attendre et renvoient les gens au bout de la file.",
        "Son cacao est refusé, saisi, puis mis au feu.",
        "Le soir, seul, il cherche où trouver les dix mille francs de la "
        "dot et pense aux caisses de la ville.",
        "Il conduit Odilia sur la passerelle et dit à Koumé d'attendre le "
        "signal de l'allumette.",
        "Koumé s'engage sans attendre, glisse et se noie.",
        "Démétropoulos lui compte dix billets de mille francs.",
        "Sa mère meurt ; il fait ses adieux à Bamila et part pour "
        "Fort-Nègre."])
    b += e
    corriges += c

    e, c = jeux.qui_suis_je("Qui suis-je ?", [
        ("Je suis coupée en deux par une haute colline, et j'ai un adjectif "
         "dans mon titre.", "Tanga"),
        ("J'ai deux dents, je chuinte, je branle, et l'éléphant est plus "
         "élégant que moi.", "l'autogrue"),
        ("Je descends vendre mon cacao un samedi, parce que le samedi est "
         "un jour joyeux.", "Banda"),
        ("Je suis mécanicien, on me recherche, et ma sœur voit bien que je "
         "mens.", "Koumé"),
        ("J'ouvre au-dessus du prix officiel, puis je baisse "
         "insensiblement.", "M. Pallogakis"),
        ("Je suis « transactionnelle », je n'existe dans aucun règlement, "
         "et Banda aurait bien fait de me connaître.",
         "la quatrième solution — le pot-de-vin"),
        ("Je suis le village de Banda, et son père y a laissé une "
         "plantation de cacaoyers.", "Bamila"),
        ("Je suis la ville où il part s'installer à la dernière page.",
         "Fort-Nègre"),
    ])
    b += e
    corriges += c

    b += jeux.carte_mentale(
        "La carte de Ville cruelle", "VILLE CRUELLE",
        [("LE LIEU", ["Tanga, coupée par une colline",
                      "Tanga-Sud : le commerce, l'administration, le fleuve",
                      "Tanga-Nord : « le Tanga des cases »",
                      "Bamila, le village · Fort-Nègre, l'ailleurs"]),
         ("LES FORCES", ["le Contrôle et ses trois solutions",
                         "la quatrième solution : « transactionnelle »",
                         "le monopole d'achat des commerçants",
                         "la police et les gardes régionaux"]),
         ("LES GENS", ["Banda, le paysan qui ne savait pas",
                       "Koumé, le meneur · Odilia, sa sœur",
                       "Tonga, l'oncle · la mère, mourante",
                       "Pallogakis, Démétropoulos"]),
         ("LES THÈMES", ["la ville qui prend et ne rend pas",
                         "le travail payé au prix qu'un autre décide",
                         "la dot, et l'argent qu'il faut trouver",
                         "partir : la dernière phrase du livre"]),
         ("L'ÉCRITURE", ["la chronique : rapporter, non inventer",
                         "l'ironie : la fausse excuse",
                         "la description en deux séries opposées",
                         "la prolepse : annoncer le malheur"])])

    b.append(saut())
    return b, corriges


# ============================================== 7. Les épreuves de l'examen

ORTHO_FAUTIF = (
    "Le marché de Tanga s'éveillait avant le soleil. Les paysans arrivait de "
    "la forêt, leur sac de cacao sur la tête, et ils attendaient devant les "
    "hangars du contrôle. Les femmes portaient des hotes dont les bretelles "
    "leur entraient dans les épaules. Personne ne parlait ; on écoutait le "
    "fleuve. Vers set heures, un employé sortait, regardait le ciel et "
    "annonçait le cours du jour. Alors la foule se pressait les vendeurs "
    "criaient plus fort que les autres. Les comerçants, eux, restait derrière "
    "leurs comptoirs, immobiles et patiens. Ils savaient que la fatigue "
    "ferait le reste. Un vieux paysan ma dit qu'il avait marché deux jours "
    "pour venir. La récolte qu'il avait apporté pesait cent kilos. Il ne "
    "savait pas encore si sont cacao serait acheté ou brulé. Sa récolte était "
    "bonne, pourtant : son fils avait seché les fèves au soleil avec soin. A "
    "midi, les prix avait baissé de moitié, est personne n'osa protester.")

ORTHO_CORRIGE = [
    ["1", "se pressait **_** les vendeurs", "se pressait **;** les vendeurs",
     "point-virgule manquant : deux phrases se touchent", "0,5"],
    ["2", "acheté ou **brulé**", "acheté ou **brûlé**",
     "accent circonflexe manquant", "0,5"],
    ["3", "avait **seché** les fèves", "avait **séché** les fèves",
     "accents aigus manquants", "0,5"],
    ["4", "**A** midi", "**À** midi",
     "accent grave sur la majuscule", "0,5"],
    ["5", "des **hotes**", "des **hottes**",
     "orthographe d'usage : deux *t*", "1"],
    ["6", "Vers **set** heures", "Vers **sept** heures",
     "orthographe d'usage : le *p* de *sept*", "1"],
    ["7", "Les **comerçants**", "Les **commerçants**",
     "orthographe d'usage : deux *m*", "1"],
    ["8", "immobiles et **patiens**", "immobiles et **patients**",
     "orthographe d'usage : le *t* de *patient*", "1"],
    ["9", "Les paysans **arrivait**", "Les paysans **arrivaient**",
     "accord sujet-verbe", "2"],
    ["10", "Les comerçants, eux, **restait**",
     "Les commerçants, eux, **restaient**",
     "accord sujet-verbe : le sujet reste pluriel malgré l'incise", "2"],
    ["11", "La récolte qu'il avait **apporté**",
     "La récolte qu'il avait **apportée**",
     "accord du participe passé avec le COD placé avant", "2"],
    ["12", "les prix **avait baissé**", "les prix **avaient baissé**",
     "accord sujet-verbe", "2"],
    ["13", "Un vieux paysan **ma** dit", "Un vieux paysan **m'a** dit",
     "homophones : *ma* (déterminant) / *m'a* (pronom + verbe *avoir*)", "2"],
    ["14", "si **sont** cacao", "si **son** cacao",
     "homophones : *son* (déterminant) / *sont* (verbe *être*)", "2"],
    ["15", "de moitié, **est** personne", "de moitié, **et** personne",
     "homophones : *et* (conjonction) / *est* (verbe *être*)", "2"],
]


def partie7():
    b = [h2("7. Je m'évalue — au format de l'examen")]
    corriges = [h2("Ville cruelle — corrigés des épreuves")]

    b += epreuve_etude_texte(
        "Dix mille francs",
        "Le cacao de Banda a été brûlé. La nuit est tombée sur Tanga. Il "
        "pense à sa mère, malade à Bamila, et à la somme qu'il lui faudrait "
        "pour se marier. Lis deux fois avant de répondre.",
        texte=source.extrait(
            CLE, "Il ne pouvait pas s'empêcher de penser au contrô",
            mots=320, arret=BORNES),
        source=SRC + ", chapitre VI",
        comprehension=[
            ("Relève tous les personnages auxquels Banda pense dans le "
             "premier paragraphe. Combien y en a-t-il ?", "2"),
            ("Quelle image finit par chasser toutes les autres ? "
             "Décris-la avec les mots du texte.", "2"),
            ("Quelle somme cherche-t-il, et pourquoi lui faut-il "
             "exactement celle-là ?", "2"),
            ("« Il eut la soudaine sensation qu'on lui avait fait une "
             "profonde entaille dans le cœur. » Explique cette phrase avec "
             "tes propres mots.", "2"),
            ("À quoi Banda est-il en train de penser à la fin du texte ? "
             "Le dit-il clairement ? Justifie ta réponse.", "2")],
        langue=[
            ("Relève quatre verbes conjugués et donne leur temps. Quel temps "
             "domine, et pourquoi ?", "2"),
            ("« Que faire ? Que faire ?... » : nomme la figure de style et "
             "dis ce qu'elle traduit de l'état du personnage.", "2"),
            ("Relève trois compléments circonstanciels et précisez leur "
             "nature (temps, lieu, manière).", "2"),
            ("« pleurant à petits coups de souffle » : quelle est la nature "
             "de *pleurant* ? Quelle est sa fonction ?", "2"),
            ("Compte les points de suspension du texte. Quel effet "
             "produisent-ils sur le rythme de la pensée de Banda ?", "2")])

    corriges += [h3("Épreuve 1 — Étude de texte : éléments de corrigé"),
                 grille([["N°", "Réponse attendue", "Pts"],
                         ["I.1", "Le contrôleur, le commissaire de police, "
                          "les jeunes mécaniciens, le gradé blanc, les gardes "
                          "régionaux, le gros Blanc qui geignait, le vieil "
                          "oncle fatigué — et les fèves rouges amoncelées, "
                          "qui ne sont pas une personne mais reviennent avec "
                          "elles.", "2"],
                         ["I.2", "Celle de sa mère « gisant sur un lit de "
                          "bambou et pleurant à petits coups de souffle, avec "
                          "des larmes si grosses qu'on aurait dit qu'elles "
                          "l'avaient vidée ».", "2"],
                         ["I.3", "Dix mille francs — la somme qu'il faut "
                          "pour se marier, c'est-à-dire pour donner à sa "
                          "mère mourante ce qu'elle attend de lui.", "2"],
                         ["I.4", "C'est une image : la douleur morale est "
                          "décrite comme une blessure physique. Accepter "
                          "toute reformulation qui rend la violence du "
                          "chagrin et son caractère soudain.", "2"],
                         ["I.5", "Il cherche une caisse à voler : il passe "
                          "en revue la mission catholique, puis l'écarte à "
                          "cause des veilleurs et des chiens. Le texte ne "
                          "prononce jamais le mot *voler* — il fait le tour "
                          "des coffres-forts et laisse comprendre.", "2"],
                         ["II.1", "Ex. : *pouvait* (pouvoir, imparfait) ; "
                          "*eut* (avoir, passé simple) ; *vinrent* (venir, "
                          "passé simple) ; *fit* (faire, passé simple). "
                          "L'imparfait installe l'état, le passé simple "
                          "marque les secousses.", "2"],
                         ["II.2", "Une **répétition** (et, plus précisément, "
                          "une interrogation répétée). Elle traduit "
                          "l'affolement : la pensée tourne en rond sans "
                          "trouver d'issue.", "2"],
                         ["II.3", "Ex. : *en quelques secondes* (temps) ; "
                          "*dans un coin de leur bureau* (lieu) ; *en "
                          "cherchant à tâtons* (manière) ; *violemment* "
                          "(manière).", "2"],
                         ["II.4", "*pleurant* est un **participe présent** ; "
                          "il est **épithète** (apposé) du nom *mère*.", "2"],
                         ["II.5", "Une dizaine. Ils hachent la phrase et "
                          "miment une pensée qui s'interrompt, revient, "
                          "hésite : on suit le raisonnement de Banda en "
                          "direct.", "2"]])]

    b += epreuve_orthographe(ORTHO_FAUTIF,
                             "Texte composé pour l'épreuve, dans la matière "
                             "du roman", nb_fautes=15)
    corriges += [h3("Épreuve 2 — Correction orthographique : corrigé"),
                 grille([["N°", "Écrit dans le texte", "Correction",
                          "Pourquoi", "Pts"]] + ORTHO_CORRIGE),
                 ("p", "**Total : 20 points.** Retirer **0,5 point** par mot "
                  "correct barré à tort.")]

    b += epreuve_expression([
        {"type": "Description",
         "contexte": "Au chapitre II, le narrateur arrête son récit pour "
                     "décrire Tanga. Il ne dit jamais que la ville est "
                     "injuste : il la montre, et le lecteur conclut.",
         "citation": source.extrait(
             CLE, "Une série de bas-fonds, en réalité",
             arrivee="deux destins !"),
         "source": SRC,
         "taches": [
             "Décris **un lieu que tu connais et qui est coupé en deux** : "
             "un marché et le centre commercial d'en face, deux quartiers "
             "séparés par une route, une cour d'établissement à la "
             "récréation. Vingt à vingt-cinq lignes.",
             "**Obligatoire :** un point de vue tenu du début à la fin ; un "
             "ordre de description annoncé par les repères d'espace ; **deux "
             "séries opposées** terme à terme ; au moins une **fausse "
             "excuse** ironique ; une formule finale courte et rythmée.",
             "**Interdit :** les adjectifs qui jugent à ta place (*horrible*, "
             "*scandaleux*, *magnifique*) et toute insulte."],
         "bareme": [["Le point de vue est tenu", "3"],
                    ["L'ordre de la description est net et suivi", "3"],
                    ["Les deux séries s'opposent réellement", "4"],
                    ["L'ironie est présente et fonctionne", "3"],
                    ["La formule finale ferme le texte", "2"],
                    ["Orthographe et ponctuation", "3"],
                    ["Présentation et longueur", "2"]]},
        {"type": "Récit",
         "contexte": "Banda descend à Tanga avec deux cents kilos de cacao "
                     "et la certitude que tout ira bien. Le roman entier "
                     "tient dans l'écart entre ce qu'il croyait et ce qui "
                     "arrive.",
         "citation": source.extrait(
             CLE, "Et vous portiez à vous six deux cents kilos de cacao",
             arrivee="Oui, beaucoup."),
         "source": SRC,
         "taches": [
             "Raconte, en vingt-cinq à trente lignes, **le jour où quelqu'un "
             "a perdu le fruit d'un long travail** — un cahier, une récolte, "
             "un examen, une marchandise. Tu peux raconter à la première ou "
             "à la troisième personne.",
             "**Obligatoire :** les cinq étapes du récit ; l'imparfait pour "
             "le décor et le passé simple pour les faits ; trois péripéties "
             "d'intensité croissante ; **une seule réplique**, placée au "
             "dénouement ; une situation finale qui ne ramène pas au point "
             "de départ.",
             "**Un conseil :** ne dis jamais que ton personnage est "
             "malheureux. Montre ce qu'il fait de ses mains."],
         "bareme": [["Les cinq étapes sont identifiables", "5"],
                    ["Imparfait et passé simple sont employés à bon escient",
                     "4"],
                    ["Les péripéties sont ordonnées et crédibles", "3"],
                    ["La réplique du dénouement porte", "3"],
                    ["Orthographe et ponctuation", "3"],
                    ["Présentation et longueur", "2"]]}])

    b.append(saut())
    return b, corriges
