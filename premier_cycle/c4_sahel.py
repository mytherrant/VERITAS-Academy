# -*- coding: utf-8 -*-
"""4ᵉ — *Cœur du Sahel*, Djaïli Amadou Amal (Éditions Emmanuelle Collas, 2022).

Un roman en trois parties : **Le chemin de l'espoir**, **Une vie de
domestique**, **Jusqu'au bout du rêve**. Faydé, quinze ans, quitte son village
de l'Extrême-Nord du Cameroun pour aller travailler comme domestique à Maroua.

Le livre porte, dès sa page de garde, deux indications que l'étude ne doit pas
laisser passer : *« Cette œuvre est une fiction inspirée de faits réels »* et
la dédicace **« Aux femmes victimes du Sahel »**. Les remerciements finaux
confirment la méthode : l'auteure a mené « de longues recherches » et recueilli
des témoignages.

⚠ Le roman traite du harcèlement et du viol des jeunes domestiques, et du
suicide d'un personnage. **Aucun extrait de ce manuel ne porte sur ces
scènes** ; elles sont nommées, sans détail, aux endroits où la compréhension
l'exige, et la conduite à tenir est indiquée dans la note « Côté enseignant ».
"""
import jeux
import source
from gabarit import (cote_enseignant, epreuve_etude_texte, epreuve_expression,
                     epreuve_orthographe, lecture_suivie, ouvrir, production)
from kit import cases, enc, grille, h1, h2, h3, lignes, num, p, puce, saut

CLE = "sahel"
SRC = ("Djaïli Amadou Amal, *Cœur du Sahel*, "
       "Éditions Emmanuelle Collas, 2022")
BORNES = ["LE CHEMIN DE L'ESPOIR", "UNE VIE DE DOMESTIQUE",
          "JUSQU'AU BOUT DU RÊVE", "Remerciements"]


def _x(amorce, mots=680):
    return source.extrait(CLE, amorce, mots=mots, arret=BORNES)


# ============================================================ 1. J'ouvre

def partie1():
    return [h1("Œuvre 2 — Cœur du Sahel, de Djaïli Amadou Amal")] + ouvrir(
        "Cœur du Sahel", "Djaïli Amadou Amal",
        questions_couverture=[
            "**Le Sahel.** Cherche-le sur une carte : où commence-t-il, où "
            "finit-il ? Quels pays traverse-t-il ?",
            "Le titre dit *Cœur du Sahel*. Le mot « cœur » a deux sens : le "
            "centre d'un lieu, et l'organe qui aime. Lequel des deux annonce "
            "ce livre, d'après toi ? Peut-être les deux ?",
            "Sous le titre, une phrase : *« Cette œuvre est une fiction "
            "inspirée de faits réels. »* Que change cette phrase pour toi, "
            "lecteur ?",
            "Le livre est dédié **« Aux femmes victimes du Sahel »**. Avant "
            "d'ouvrir : victimes de quoi, à ton avis ? Note trois hypothèses."],
        promesses=[
            "L'héroïne partira-t-elle du village ? Le regrettera-t-elle ?",
            "La ville tiendra-t-elle ses promesses ?",
            "Le livre finira-t-il bien ?",
            "Que peut faire une fille de quinze ans contre la sécheresse et "
            "la pauvreté ?"],
        journal_exemple=["11/01", "Partie I, premières pages",
                         "Faydé veut partir travailler à Maroua ; sa mère "
                         "s'y oppose parce qu'elle-même l'a fait",
                         "Pourquoi la mère refuse-t-elle si violemment ?"])


# ================================================= 2. L'auteure et son livre

def partie2():
    return [
        h2("2. L'auteure et son livre"),
        h3("Djaïli Amadou Amal"),
        p("Djaïli Amadou Amal est une romancière camerounaise. Son livre "
          "précédent, ***Les Impatientes***, a reçu le **prix Goncourt des "
          "lycéens en 2020** — c'est écrit sur la couverture de ton "
          "exemplaire : *« Par l'auteure des Impatientes »*."),
        p("*Cœur du Sahel* paraît en **2022** aux Éditions Emmanuelle Collas."),
        enc("perso", "Comment ce livre a été fabriqué (elle le dit elle-même)",
            ["Dans les **Remerciements**, à la fin du volume, l'auteure "
             "explique : *« Afin de collecter les matériaux préalables à la "
             "gestation de cette histoire, j'ai dû mener de longues recherches "
             "qui m'ont amenée à rencontrer des femmes et des hommes dont les "
             "témoignages ont enrichi la trame du roman. »*",
             "Elle cite leurs prénoms : Alphonse, Sylvie, Marcel, Bintou, "
             "Dada Hamadou, Housseini, Dada Bachirou…",
             "Elle remercie aussi deux femmes disparues qui l'ont « initiée "
             "aux réalités socio-culturelles » de son environnement : "
             "**Doubla Sadjo** et **Dada Srafata**.",
             "**Regarde bien ces deux derniers noms.** Tu les retrouveras dans "
             "le roman : ce sont ceux de personnages. Un romancier ne "
             "s'invente pas tout seul — il écoute d'abord."]),
        h3("Deux phrases mises en tête, et ce qu'elles annoncent"),
        grille([["Ce qui est imprimé", "Où", "Ce que cela annonce"],
                ["*« C'est souvent lorsqu'elle est la plus désagréable à "
                 "entendre qu'une vérité est le plus utile à dire. »* — "
                 "**André Gide**", "en tête du livre",
                 "Le livre va dire des choses qu'on n'a pas envie "
                 "d'entendre — et il prévient."],
                ["*« Dans toutes les larmes s'attarde un espoir. »* — "
                 "**Simone de Beauvoir**", "en tête de la partie I",
                 "Le malheur ne sera pas le dernier mot."],
                ["*« Le feu qui te brûlera, c'est celui auquel tu te "
                 "chauffes. »* — **proverbe africain**", "partie II",
                 "Ce qui devait sauver Faydé est ce qui va la blesser : la "
                 "ville, le travail, la concession."],
                ["*« Le chemin le plus court pour aller d'un point à un autre "
                 "n'est pas la ligne droite, mais le rêve. »* — **proverbe "
                 "malien**", "partie III",
                 "On y arrivera — mais pas par où l'on croyait."]]),
        enc("mot", "Une épigraphe, ça se lit", [
            "Une **épigraphe** est la citation placée en tête d'un livre ou "
            "d'une partie. Beaucoup de lecteurs la sautent. C'est une erreur : "
            "l'auteur l'a choisie **après** avoir écrit, en sachant tout.",
            "Ici, les quatre épigraphes racontent déjà le livre entier : une "
            "vérité pénible → un espoir dans les larmes → le feu qui brûle → "
            "le rêve comme chemin.",
            "**Exercice pour toute l'année :** dans n'importe quel livre, lis "
            "l'épigraphe **deux fois** — une fois avant, une fois après. La "
            "seconde lecture est toujours la bonne."]),
        h3("Ce qu'il y a dedans"),
        grille([["Partie", "Titre", "Ce qui s'y passe"],
                ["**I**", "**Le chemin de l'espoir**",
                 "Le village, la sécheresse, la dispute avec Kondem. Faydé "
                 "part pour Maroua avec Srafata, Danna et Bintou."],
                ["**II**", "**Une vie de domestique**",
                 "La grande concession : les patronnes, les journées de "
                 "travail, l'amitié inégale avec Leïla, la rencontre avec "
                 "Boukar."],
                ["**III**", "**Jusqu'au bout du rêve**",
                 "Boukar doit épouser Hapssi ; Boko Haram impose le "
                 "couvre-feu ; le malheur frappe. Puis, des années plus tard, "
                 "une autre vie."]]),
        enc("lieu", "La géographie du roman", [
            "**Moskota**, **Minawao** : les deux noms imprimés en tête du "
            "livre, dans l'**Extrême-Nord du Cameroun**. Minawao est le nom "
            "d'un grand camp de réfugiés de la région.",
            "**Maroua** : la métropole régionale, « distante d'une "
            "cinquantaine de kilomètres » du village. C'est là que Faydé va "
            "travailler.",
            "**Ngaoundéré**, **Banyo**, **Douala** : les villes où le livre "
            "conduit ses personnages à la fin.",
            "**Une concession**, mot que le roman explique lui-même : *« une "
            "maison où habitent tous les membres d'une famille et qui est "
            "délimitée par des murs ou par une palissade »*. Retiens la "
            "définition, elle est dans le texte."]),
        enc("culture", "Deux mots de la région, employés par le roman", [
            "**Dada** : c'est ainsi que Faydé appelle sa mère.",
            "**Wakkaré** : « ce deuxième pagne qui vient compléter leur "
            "tenue », rabattu « comme seules savent le faire les citadines ».",
            "**Kaado** : dans le roman, le mot désigne les populations non "
            "musulmanes de la région. Faydé est chrétienne ; Boukar est peul "
            "et musulman. C'est là que se joue le drame."]),
        saut()]


# =========================================================== 3. Qui est qui

def partie3():
    b = [h2("3. Qui est qui"),
         p("Deux mondes, séparés par un mur de concession — et une jeune "
           "fille qui passe de l'un à l'autre tous les jours."),
         grille([["Au village", "Qui c'est"],
                 ["**Faydé**", "quinze ans, l'héroïne. Elle a quitté l'école "
                  "deux ans plus tôt ; elle voulait être médecin."],
                 ["**Kondem**", "sa mère. Elle a été domestique à Maroua "
                  "elle-même, et elle refuse que sa fille le devienne."],
                 ["**Srafata, Danna, Bintou**", "ses amies d'enfance, déjà "
                  "parties travailler en ville."],
                 ["Les petits frères et la petite sœur", "ceux qu'il faut "
                  "nourrir, et qui rendent le départ nécessaire."]]),
         grille([["Dans la concession, à Maroua", "Qui c'est"],
                 ["**Leïla**", "fille unique de Nenné, fiancée à Mohamadou "
                  "qui vit à Douala. Elle devient l'amie **et** la patronne "
                  "de Faydé."],
                 ["**Boukar**", "le jeune homme de la maison. Peul, musulman. "
                  "Il encourage Faydé — et il doit épouser Hapssi."],
                 ["**Hapssi**", "nièce de Diddi, fille du grand Alhadji "
                  "Bakary. Elle n'adresse jamais la parole à Faydé."],
                 ["**Diddi, Nenné, Ayya**", "les épouses de la maison. Diddi "
                  "n'a que des garçons, Ayya des filles plus jeunes."],
                 ["**Biri**", "le jardinier. Il arrose les plantes en fin "
                  "d'après-midi, et c'est avec lui que Faydé parle "
                  "vraiment."]]),
         enc("perso", "L'amitié la plus juste et la plus triste du livre", [
             "Faydé et Leïla ont le même âge. Elles chuchotent, elles rient "
             "beaucoup, elles se racontent des choses.",
             "Mais lis attentivement : *« Si Faydé écoute sa nouvelle amie, "
             "elle ne se confie jamais à elle. »* Et le roman explique "
             "pourquoi : *« la pauvreté suscite toujours le mépris ou la "
             "pitié, et il est impossible de trouver les mots justes sans "
             "avoir l'air de s'apitoyer »*.",
             "**Une amitié à sens unique.** L'une raconte tout, l'autre "
             "écoute et se tait. C'est le portrait le plus fin du livre, et "
             "il ne comporte pas un mot de reproche contre Leïla."]),
         enc("culture", "Pourquoi les filles partent (le roman l'explique)", [
             "Ce ne sont pas des caprices. Le texte donne les raisons, l'une "
             "après l'autre : *« Le climat est de plus en plus aride, la "
             "terre de plus en plus sèche, appauvrie, épuisée. Et trop de "
             "bouches à nourrir ! »*",
             "Quatre mois sans pluie derrière, cinq mois sans pluie devant. "
             "Les greniers vides. Le boutiquier qui refuse le crédit.",
             "Et de l'autre côté : les amies qui reviennent en décembre « les "
             "mains pleines de provisions » — savon, poisson séché, sel, "
             "sucre, allumettes, pétrole, paracétamol — et surtout des "
             "pagnes, des bijoux, des chaussures.",
             "**Ce que le roman appelle « le chemin de l'espoir » est d'abord "
             "un calcul de survie.**"])]

    e, c = jeux.relier(
        "Chacun dans son monde",
        [("Faydé", "Quinze ans, elle voulait être médecin et part faire des "
                   "ménages"),
         ("Kondem", "Elle a été domestique et jure que sa fille ne le sera "
                    "pas"),
         ("Leïla", "Elle attend son iPhone et se plaint de manger toujours la "
                   "même chose"),
         ("Boukar", "Il encourage Faydé, et doit épouser une fille de sa "
                    "condition"),
         ("Hapssi", "Belle, réservée, elle ne parle jamais aux domestiques"),
         ("Biri", "Il arrose les plantes en fin d'après-midi et dit la vérité"),
         ("Bintou", "L'amie d'enfance, celle dont le nom donnera une "
                    "association")],
        graine=191)
    b += e
    b.append(saut())
    return b, c


# ======================================================= 4. Lectures suivies

def partie4():
    b = [h2("4. Je lis l'œuvre — six lectures suivies"),
         p("Deux séances par partie. Le roman est long : lis un chapitre par "
           "soir, et tiens ton journal de lecture — trois lignes suffisent.")]

    b += lecture_suivie(
        1, "La dispute (partie I)",
        situation=[
            "Fin janvier, dans un village de l'Extrême-Nord. Quatre mois se "
            "sont écoulés depuis les dernières pluies ; cinq autres passeront "
            "avant la suivante.",
            "Kondem et sa fille arrachent les dernières gousses de haricots "
            "niébé. Elles ne se parlent pas. Depuis que Faydé a annoncé "
            "qu'elle voulait aller travailler à Maroua, sa mère est passée de "
            "l'effarement au désespoir, puis à la colère.",
            "C'est la **première fois** que Faydé ose défier sa mère."],
        texte=_x("La matinée est à peine entamée"), source=SRC,
        questions=[
            "Relève six détails qui décrivent la sécheresse. Range-les en "
            "deux colonnes : ce qu'on voit / ce qu'on ne voit plus.",
            "« De la montagne on distingue les rochers gris qui veillent sur "
            "le village comme de grands chiens. » Quelle figure de style "
            "reconnais-tu ? Que produit-elle ?",
            "Que fait Kondem de sa bassine ? Que dit ce geste, qu'aucune "
            "parole ne dit ?",
            "Relève ce que les deux femmes ont en commun, physiquement. Et ce "
            "qui les sépare. Recopie la phrase exacte.",
            "Quels arguments Faydé donne-t-elle ? Fais-en la liste numérotée — "
            "il y en a au moins quatre.",
            "Quel est l'argument de Kondem ? Pourquoi, à ton avis, "
            "refuse-t-elle si violemment ?",
            "« Je n'aurais pas dû t'en parler. Je serais partie discrètement, "
            "comme les autres. » Que révèle cette phrase sur les autres "
            "familles du village ?"],
        grille_lecture=[
            ("Que la terre ne nourrit plus",
             "Le champ lexical de la sécheresse et les chiffres (quatre mois, "
             "cinq mois)"),
            ("Que la colère se dit par les gestes",
             "Les verbes d'action de Kondem"),
            ("Que la mère et la fille se ressemblent",
             "Le passage qui compare leurs deux silhouettes"),
            ("Que Faydé argumente comme une adulte",
             "Ses questions et ses arguments successifs")],
        bilan=[
            "Une scène de dispute, et un cours de géographie. Djaïli Amadou "
            "Amal fait les deux en même temps : la colère de Kondem est "
            "décrite **avec la terre** — elle « passe sa colère sur la terre "
            "desséchée », elle jette la bassine, un lézard file.",
            "Note ce que le texte dit du paysage : la saison des pluies « n'est "
            "qu'un lointain souvenir », les épis de sorgho jonchent le sol, "
            "les tiges de mil sont « dépouillées de leurs grains ». **Rien "
            "n'est décoratif :** chaque détail explique pourquoi une fille de "
            "quinze ans doit partir.",
            "Et regarde la construction : la mère refuse **parce qu'elle sait**. "
            "Elle a fait exactement la même chose à l'âge de sa fille, elle a "
            "tenu tête à sa propre mère, elle a eu les mêmes rêves — et elle "
            "a caché aux autres « les réalités de la ville trop dures à "
            "entendre ».",
            "**Voilà le nœud du roman :** chaque génération se tait, et la "
            "suivante repart au même endroit."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Caniculaire** : d'une chaleur extrême.",
                "**Le niébé** : le haricot à œil noir, cultivé dans tout le "
                "Sahel.",
                "**Le sorgho**, **le mil** : deux céréales de la région, "
                "résistantes à la sécheresse.",
                "**Morose** : triste, sombre.",
                "**Atterrée** : accablée, effondrée."]),
            ("culture", "Le climat n'est pas un décor", [
                "Le roman écrit : *« Même avec beaucoup de volonté, on ne "
                "peut pas faire tomber la pluie. »*",
                "Dans tout le Sahel, la saison des pluies s'est raccourcie et "
                "les récoltes ont baissé. Les jeunes partent en ville, les "
                "champs restent aux parents, aux épouses et aux petits "
                "enfants « qui n'ont pas la force de les cultiver ».",
                "**C'est ce qu'on appelle l'exode rural**, et ce roman en "
                "montre le premier maillon : une adolescente qui fait ses "
                "comptes."])])

    b += lecture_suivie(
        2, "La ville rêvée (partie I)",
        situation=[
            "Faydé a vécu ses premières années à Maroua avec sa mère, alors "
            "domestique — mais elle n'en garde aucun souvenir.",
            "Ce qu'elle sait de la ville, elle le tient de ses amies qui en "
            "reviennent chaque fin d'année. Lis ce passage comme on regarde "
            "une publicité : en te demandant ce qu'on ne te montre pas."],
        texte=_x("Ce que Faydé connaît de cette ville mythique"), source=SRC,
        questions=[
            "Fais **deux listes** : ce que les filles rapportent d'utile, et "
            "ce qu'elles rapportent qui fait envie. Combien d'articles dans "
            "chacune ?",
            "Que font-elles le soir, à la lueur des feux de bois ? Et le jour "
            "de Noël ?",
            "Relève les mots qui décrivent leur allure de citadines. Quel "
            "adjectif Faydé emploie-t-elle pour les qualifier ?",
            "« Faydé les envie. » Trois mots, une phrase entière. Quel effet "
            "produit cette brièveté ?",
            "Comment le village a-t-il changé ? Relève les signes de ce "
            "changement.",
            "Quelle décision Kondem prend-elle en observant sa fille ? Que "
            "revit-elle ?",
            "À la fin du passage, de quoi parlent la mère et la fille ? "
            "Pourquoi cette conversation sur le sucre est-elle plus efficace "
            "que dix pages d'explications ?"],
        grille_lecture=[
            ("Que la ville se raconte en objets",
             "Les deux listes de ce qu'on rapporte"),
            ("Que les récits sont embellis",
             "Ce que Kondem sait, et que les jeunes filles ne disent pas"),
            ("Que le village se vide",
             "Les phrases sur les fêtes qui raccourcissent"),
            ("Que la pauvreté est concrète",
             "Le dialogue sur le sucre, le miel, le tamarin, le crédit")],
        bilan=[
            "Un chapitre construit sur un **mensonge collectif**. Les filles "
            "qui reviennent racontent « dans de grands éclats de rire » leurs "
            "aventures, revêtent leurs nouveaux pagnes le jour de Noël, "
            "marchent avec des talons. Elles ne disent pas le reste.",
            "Et Kondem, qui a fait la même chose vingt ans plus tôt, le sait : "
            "*« n'a-t-elle pas dissimulé aux autres, restés au village, les "
            "réalités de la ville trop dures à entendre ? »*",
            "Puis le romancier fait ce qu'un romancier sait faire : il quitte "
            "les grandes explications et met **une cuillère de sucre** au "
            "milieu de la scène. Il n'y a plus de sucre, ni de miel, ni de "
            "tamarin ; le boutiquier Abdou refuse le crédit et humilie la "
            "petite quand on l'envoie ; la voisine est devenue hautaine depuis "
            "que son fils travaille à Douala.",
            "**Retiens ce procédé :** pour faire sentir la misère, on ne "
            "l'explique pas. On enlève le sucre de la bouillie."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Mythique** : dont on parle comme d'une légende.",
                "**La convoitise** : le désir d'avoir ce que possède un "
                "autre.",
                "**Guindé** : raide, apprêté, un peu emprunté.",
                "**Décomplexé** : qui n'a plus de gêne, qui ose.",
                "**Tangible** : qu'on peut toucher, dont on constate "
                "l'évidence."]),
            ("rire", "Le détail des chaussures à talon", [
                "Le texte note que les talons donnent aux filles « une "
                "démarche un peu guindée mais gracieuse ».",
                "**Un peu guindée** : deux mots, et toute la mise en scène "
                "s'effondre gentiment. Ces filles jouent aux citadines, et "
                "l'auteure le voit — sans se moquer d'elles.",
                "C'est la marque des grands romanciers : ils regardent leurs "
                "personnages avec tendresse **et** avec lucidité, en même "
                "temps."])])

    b += lecture_suivie(
        3, "Une journée de travail (partie II)",
        situation=[
            "Faydé est à Maroua, dans la grande concession. Elle a une "
            "patronne, ou plutôt plusieurs : les épouses de la maison — Diddi, "
            "Nenné, Ayya — et leurs enfants.",
            "Ce passage suit sa journée. Compte les tâches en lisant : "
            "c'est l'exercice le plus instructif de toute l'étude."],
        texte=_x("Quand, au bout d'une demi-heure, elle termine enfin sa "
                 "première tâche"), source=SRC,
        questions=[
            "Fais la liste, dans l'ordre, de toutes les tâches accomplies par "
            "Faydé dans ce passage. Numérote-les.",
            "À quelle heure commence sa journée ? À quelle heure s'arrête-t-"
            "elle ? Calcule.",
            "Relève les moments où d'autres personnes de la maison dorment, "
            "se reposent ou attendent pendant qu'elle travaille.",
            "Comment le texte décrit-il la nourriture préparée, et celle qui "
            "est gâchée ? Que ressent Faydé ?",
            "Quelle question Faydé se pose-t-elle sur l'eau ? Pourquoi cette "
            "question est-elle bouleversante quand on vient de son village ?",
            "Relève une phrase où le narrateur passe **dans la tête** de "
            "Faydé. Comment le reconnais-tu ?",
            "À ton avis, pourquoi l'auteure détaille-t-elle autant les "
            "tâches, au lieu d'écrire simplement « elle travaillait beaucoup » ?"],
        grille_lecture=[
            ("Que le travail n'a pas de fin",
             "L'enchaînement des tâches et les indications d'heure"),
            ("Que deux mondes cohabitent",
             "Ce que font les autres pendant qu'elle travaille"),
            ("Que l'abondance de la maison est un scandale pour elle",
             "Les passages sur la nourriture et sur l'eau"),
            ("Que le récit épouse le regard de Faydé",
             "Les phrases qui rapportent ses pensées")],
        bilan=[
            "Voici la partie du roman qui a fait sa réputation, et elle "
            "n'emploie aucun grand mot. **Elle compte.** Les tâches, les "
            "heures, les repas, les seaux d'eau.",
            "C'est une technique très ancienne et très efficace : "
            "**l'accumulation**. Un lecteur à qui l'on dit « elle travaillait "
            "dur » hoche la tête et tourne la page. Un lecteur à qui l'on "
            "énumère quatorze tâches finit par être fatigué lui-même.",
            "Et l'auteure ajoute le détail qui fait mal : **la nourriture "
            "gâchée**. Faydé vient d'un village où l'on boit la bouillie sans "
            "sucre ; elle jette ici des plats entiers. Ce n'est pas de la "
            "colère, c'est de la stupéfaction.",
            "**Une remarque de méthode.** Le narrateur n'est pas Faydé — le "
            "récit est à la troisième personne — mais il voit par ses yeux. "
            "On appelle cela le **point de vue interne**. Repère-le : c'est "
            "lui qui rend ce livre impossible à lire de haut."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Une tâche** : un travail à accomplir. (Attention : *une "
                "tache*, sans accent, est une salissure.)",
                "**Le hangar** : l'abri ouvert où l'on se tient à l'ombre, au "
                "centre de la concession.",
                "**L'apathie** : l'absence de réaction, l'abattement.",
                "**Réprimander** : reprocher sévèrement.",
                "**Un groupe électrogène** : la machine qui produit de "
                "l'électricité quand le courant est coupé."]),
            ("culture", "Le mot « domestique » et ce qu'il recouvre", [
                "Une **domestique** — on dit aussi une **bonne** — est "
                "employée pour le ménage, la cuisine, le linge, l'eau et la "
                "garde des enfants, souvent logée chez ses employeurs.",
                "Dans beaucoup de pays, ce travail est réel mais **mal "
                "reconnu** : pas de contrat, pas d'horaires, pas de congés, "
                "un salaire fixé de gré à gré.",
                "Le roman ne réclame rien et ne fait aucun discours. Il "
                "**décrit une journée**. C'est sa manière d'argumenter."])])

    b += lecture_suivie(
        4, "Deux filles du même âge (partie II)",
        situation=[
            "Fin d'après-midi. Faydé s'assied dans la cour, sous un parterre "
            "de fleurs, à l'heure où Biri arrose les plantes. Leïla vient les "
            "rejoindre.",
            "Elles ont le même âge. L'une est fille unique et fiancée ; "
            "l'autre est sa servante. Le roman appelle ce qui les lie une "
            "**amitié** — et il va montrer exactement ce que ce mot peut "
            "porter."],
        texte=_x("Faydé a pris l'habitude, en fin d'après-midi"), source=SRC,
        questions=[
            "Que devient Faydé pour Leïla, en plus de sa servante ? Relève le "
            "mot du texte.",
            "Pourquoi Leïla se confie-t-elle si facilement à Faydé ? Recopie "
            "la raison donnée par le narrateur.",
            "Faydé se confie-t-elle en retour ? Recopie l'explication du "
            "texte — elle tient en une phrase et elle est très juste.",
            "De quoi Leïla parle-t-elle constamment ? Relève la formule par "
            "laquelle commencent toujours ses confidences.",
            "Que reçoit Faydé de Leïla ? Comment l'accepte-t-elle ? Que "
            "ressentent ses amies ?",
            "Relève ce que Leïla préfère chez son fiancé. Combien de ses "
            "raisons concernent le jeune homme lui-même ?",
            "« Rien n'est plus indiscret qu'un estomac affamé. » Explique "
            "cette phrase. Pourquoi est-elle placée juste après la commande "
            "de tartines au chocolat ?"],
        grille_lecture=[
            ("Que l'amitié est réelle",
             "Les verbes de complicité (chuchoter, rire, écouter)"),
            ("Qu'elle est pourtant inégale",
             "Le vocabulaire de la position (servante, patronne, faveurs)"),
            ("Que Leïla ne peut pas comprendre",
             "Ce que le narrateur dit de son horizon"),
            ("Que Faydé se tait par dignité",
             "Le passage sur le mépris et la pitié")],
        bilan=[
            "Le chapitre le plus fin du roman, et il ne s'y passe rien : deux "
            "filles bavardent sous des fleurs.",
            "Mais lis les phrases du narrateur. *« Entre elle et Faydé est née "
            "une amitié, bien qu'un fossé les sépare. »* Et la question qui "
            "suit, laissée ouverte : *« jusqu'à quel point Leïla peut-elle "
            "comprendre Faydé ? »*",
            "Puis la raison du silence de Faydé, qui vaut pour toutes les "
            "amitiés inégales du monde : *« la pauvreté suscite toujours le "
            "mépris ou la pitié, et il est impossible de trouver les mots "
            "justes sans avoir l'air de s'apitoyer »*.",
            "**Ne fais pas de Leïla une méchante.** Elle est « innocente, un "
            "peu puérile, capricieuse » ; elle offre ses pagnes ; elle ne juge "
            "pas Faydé. Son seul tort est de n'avoir jamais eu faim — et le "
            "roman écrit : *« Comment expliquer à une fille qui n'a jamais "
            "connu la faim ce qu'on peut ressentir quand on est obligée de "
            "dormir le ventre vide ? »*"],
        encadres=[
            ("perso", "Le détail de l'iPhone", [
                "Leïla se plaint : son téléphone « est déjà dépassé », son "
                "fiancé lui en a promis un « de la dernière génération ».",
                "Trois lignes plus loin, elle se plaint de manger toujours la "
                "même chose et commande des tartines au chocolat.",
                "L'auteure ne commente pas. Elle place ces phrases **à côté** "
                "de la journée de travail que tu viens de lire, et elle laisse "
                "faire.",
                "Cela s'appelle le **contraste**, et c'est l'arme la plus "
                "silencieuse du roman."]),
            ("mot", "Les mots difficiles", [
                "**Puéril** : enfantin, qui n'est plus de son âge.",
                "**Cancaner** : raconter des ragots.",
                "**Un fossé** (au figuré) : une distance impossible à "
                "franchir.",
                "**S'apitoyer** : montrer une pitié appuyée.",
                "**Tenir pour acquis** : croire que quelque chose vous est dû "
                "et ne plus le remarquer."])])

    b += lecture_suivie(
        5, "Ce qui sépare, et ce qui ferme la ville (partie III)",
        situation=[
            "Faydé a pris l'habitude de parler avec Boukar, le jeune homme de "
            "la maison : c'est lui qui l'a encouragée. Puis elle apprend qu'il "
            "va se marier.",
            "Il épousera **Hapssi**, la nièce de Diddi, fille du grand Alhadji "
            "Bakary : « une belle jeune fille, de bonne famille, musulmane et "
            "peule, comme lui ».",
            "Au même moment, la ville change de visage."],
        texte=_x("Il va se marier ! Pourquoi l'évidence"), source=SRC,
        questions=[
            "Quelles sont les quatre qualités qui font de Hapssi l'épouse "
            "attendue ? Recopie-les. Combien concernent son caractère ?",
            "Comment Hapssi traite-t-elle Faydé ? Recopie la phrase.",
            "Que fait Faydé désormais quand elle croise Boukar ? Et lui, que "
            "fait-il ?",
            "« Il n'est pas de son monde et ne sera jamais son ami. » Qui "
            "pense cette phrase ? Le narrateur l'approuve-t-il ?",
            "Pourquoi le mariage de Leïla ne peut-il pas être une grande "
            "cérémonie ? Relève **trois** mesures imposées à la ville.",
            "Comment Leïla réagit-elle ? Que lui répondent Diddi, Ayya, puis "
            "Nenné ?",
            "Compare les deux malheurs de ce passage : celui de Faydé et "
            "celui de Leïla. Qu'en penses-tu ?"],
        grille_lecture=[
            ("Que la barrière est sociale et religieuse",
             "Les mots qui décrivent Hapssi et sa famille"),
            ("Que Faydé lutte contre elle-même",
             "Les questions qu'elle se pose et les verbes de volonté"),
            ("Que la ville vit sous la menace",
             "Les mots des mesures de sécurité"),
            ("Que les deux chagrins ne pèsent pas le même poids",
             "Ce qui manque à Leïla, et ce qui manque à Faydé")],
        bilan=[
            "Deux fils se nouent dans ce chapitre, et l'auteure les tresse "
            "sans les commenter.",
            "**Le premier** est intime : Faydé aime un garçon qui ne peut pas "
            "l'épouser, parce qu'elle est *kaado* et chrétienne, et lui peul "
            "et musulman. Elle se répète que « le cœur désobéit et n'en fait "
            "qu'à sa tête ».",
            "**Le second** est collectif : les attentats, les incursions de "
            "Boko Haram, l'interdiction des rassemblements de plus de "
            "cinquante personnes, le couvre-feu à 22 heures. Dans une ville "
            "où les veillées font partie de la culture, **c'est la vie "
            "sociale entière qui s'arrête**.",
            "Et l'auteure place au milieu la colère de Leïla, qui trouve son "
            "mariage « naze » parce qu'elle ne pourra pas inviter toutes les "
            "filles du collège — « pour une histoire de terrorisme qui, selon "
            "elle, ne la concerne pas ».",
            "**Trois malheurs de trois tailles différentes, dans la même "
            "page.** Il faut relire le passage pour voir qui souffre "
            "vraiment, et cette relecture est tout le travail du lecteur."],
        encadres=[
            ("culture", "Comprendre le contexte, sans le confondre avec "
                        "l'histoire", [
                "**Boko Haram** est un groupe armé actif autour du lac Tchad "
                "depuis 2009 ; ses attaques ont touché l'Extrême-Nord du "
                "Cameroun et provoqué le déplacement de centaines de milliers "
                "de personnes — d'où le camp de **Minawao**, nommé en tête du "
                "livre.",
                "Le roman ne raconte pas la guerre : il montre **ce qu'elle "
                "fait à la vie ordinaire** — un couvre-feu, un mariage réduit, "
                "des veillées interdites.",
                "**Attention à ne pas généraliser.** Un groupe armé n'est pas "
                "une religion, ni une région, ni un peuple. Le roman est "
                "d'ailleurs écrit par une romancière musulmane du Nord, et "
                "son héroïne est chrétienne."]),
            ("mot", "Les mots difficiles", [
                "**Une incursion** : une attaque rapide en territoire "
                "ennemi.",
                "**Un couvre-feu** : l'interdiction de circuler à partir "
                "d'une certaine heure.",
                "**Une marâtre** : ici, au sens local, la coépouse du père — "
                "sans le sens péjoratif du français de France.",
                "**Le henné** : la pâte végétale dont on se teint les mains "
                "et les pieds.",
                "**Maugréer** : protester à mi-voix."])])

    b += lecture_suivie(
        6, "Cinq ans plus tard (partie III, dénouement)",
        situation=[
            "Des années ont passé. Faydé a repris des études : elle est "
            "devenue **infirmière**. Sa mère vit à Banyo ; Srafata tient un "
            "restaurant à Ngaoundéré.",
            "Entre-temps, le malheur a frappé : **Bintou est morte**, et "
            "Faydé a créé une association pour venir en aide aux femmes.",
            "Boukar revient. Le roman se referme sur cette conversation."],
        texte=_x("Eh bien, prof, c'est gentil de passer me voir", mots=700),
        source=SRC,
        questions=[
            "Comment Boukar appelle-t-il Faydé ? Que dit ce surnom du chemin "
            "qu'elle a parcouru ?",
            "Combien de temps a duré le mariage de Boukar et Hapssi ? Relève "
            "la réaction de Faydé : combien de fois répète-t-elle ce chiffre ?",
            "Qu'a fait Faydé pendant ces cinq années ? Relève **trois** "
            "éléments : ses études, sa vie sentimentale, son engagement.",
            "Pourquoi a-t-elle créé son association ? Recopie la phrase qui "
            "l'explique.",
            "Quels arguments Boukar donne-t-il pour la convaincre ? Fais-en "
            "la liste.",
            "Que répond Faydé à propos de sa religion ? Recopie sa phrase — "
            "c'est l'une des plus importantes du livre.",
            "« Nous ne sommes pas du même monde. » — « Nous sommes exactement "
            "du même monde. » Qui a raison, selon toi ? Justifie.",
            "Recopie les trois dernières lignes du roman. Pourquoi "
            "l'auteure a-t-elle choisi de finir sur un verbe répété ?"],
        grille_lecture=[
            ("Que le temps a passé",
             "Les indications de durée et le sort de chaque personnage"),
            ("Que Faydé s'est construite seule",
             "Ce qu'elle a fait de ses années : études, travail, association"),
            ("Que la barrière est intérieure autant qu'extérieure",
             "Les mots *barrières* et *entraves* dans la bouche de Boukar"),
            ("Que la fin reste ouverte",
             "Les trois dernières lignes et leur ponctuation")],
        bilan=[
            "Le roman aurait pu finir sur un malheur. Il finit sur un "
            "**verbe**.",
            "Regarde d'abord ce que Faydé est devenue : infirmière — pas "
            "médecin comme elle en rêvait à quinze ans, mais soignante quand "
            "même. Elle a fondé une association « pour venir en aide aux "
            "femmes », et elle explique pourquoi avec une modestie qui "
            "désarme : *« dans son malheur, elle a eu de la chance »*. "
            "D'autres ne s'en sortent pas.",
            "Regarde ensuite ce qu'elle refuse : *« C'est toujours moi, la "
            "kaado chrétienne. Je n'ai aucune intention de m'islamiser ou de "
            "me renier. »* Elle veut être aimée **telle qu'elle est**, ou pas "
            "aimée du tout. C'est là que le titre du livre prend son second "
            "sens.",
            "Et la réponse de Boukar est celle que tout le roman attendait : "
            "*« Nous sommes exactement du même monde, Faydé. Tu te mets des "
            "barrières toute seule. »* Il a raison — mais il a fallu cinq ans, "
            "un mariage raté et une morte pour qu'il puisse le dire.",
            "**Les trois derniers mots :** « Juste aimer ! » Après un livre "
            "entier de calculs, de dots, de castes, de religions et de "
            "salaires, l'auteure choisit de finir sur le seul verbe qui ne se "
            "négocie pas."],
        encadres=[
            ("perso", "Bintou", [
                "Bintou est l'une des trois amies d'enfance parties avec "
                "Faydé. Elle **meurt** dans la troisième partie, et le roman "
                "dit franchement de quoi : elle s'est donné la mort, après "
                "avoir été méprisée et abandonnée.",
                "Le roman refuse de la juger, et il montre ce que le village "
                "lui fait : on évitera de prononcer son nom, son souvenir "
                "sera effacé.",
                "**Et c'est précisément contre cet effacement que Faydé fonde "
                "son association.** Le nom qu'on ne devait plus dire devient "
                "la raison d'un engagement. C'est ainsi que ce livre répond au "
                "malheur : par une œuvre, pas par une vengeance."]),
            ("mot", "Les mots difficiles", [
                "**Une entrave** : ce qui empêche d'avancer ; au sens propre, "
                "le lien qu'on met aux pattes d'un animal.",
                "**Songeur** : pensif, absorbé.",
                "**Refouler** : repousser au fond de soi.",
                "**S'esclaffer** : éclater de rire.",
                "**Assumer** : accepter pleinement, et en répondre."])])

    b += cote_enseignant([
        "Six séances, deux par partie. Le roman est long : prévoir un "
        "calendrier de lecture personnelle et un journal de bord tenu "
        "réellement.",
        "**⚠ Contenus sensibles.** Le roman traite du harcèlement et du viol "
        "des jeunes domestiques (le personnage de Faydé y échappe ; d'autres "
        "non), et du **suicide** de Bintou, enceinte et rejetée. **Aucun "
        "extrait retenu dans ce manuel ne porte sur ces scènes.**",
        "Elles sont cependant nécessaires à la compréhension du dénouement : "
        "elles sont nommées, sans détail, dans l'encadré « Bintou » de la "
        "sixième séance. Annoncer ces faits à la classe **avant** qu'elle "
        "n'atteigne les chapitres concernés, en s'appuyant sur la dédicace du "
        "livre (« Aux femmes victimes du Sahel ») et sur l'épigraphe de Gide.",
        "Ne pas organiser de lecture à voix haute de ces passages ; ne pas "
        "les donner en support d'évaluation ; rappeler qu'un adulte de "
        "l'établissement est disponible pour en parler en particulier.",
        "Sur Boko Haram : traiter le contexte comme un fait daté et localisé. "
        "Prévenir explicitement tout amalgame entre un groupe armé et une "
        "religion, une région ou un peuple — l'auteure elle-même est "
        "musulmane et originaire du Nord, et son héroïne est chrétienne.",
        "Le débat sur l'emploi des domestiques mineures est légitime en "
        "classe, à condition qu'il porte sur le roman et sur des faits, "
        "jamais sur la situation supposée de tel ou tel élève."])
    b.append(saut())
    return b


# ==================================================== 5. Les productions

def partie5():
    b = [h2("5. J'écris — le portrait en contraste et l'argumentation "
            "complète"),
         p("Deux ateliers, et ce sont les deux outils du roman lui-même : "
           "**mettre deux choses côte à côte sans commenter**, et **défendre "
           "une opinion d'un bout à l'autre**.")]

    b += production(
        "le portrait en contraste",
        "faire sentir une injustice en plaçant deux portraits côte à côte, "
        "sans jamais dire qu'elle est injuste.",
        modele=(
            "❶ À six heures, Adèle est déjà debout. ❷ Elle balaie la cour, "
            "allume le feu, met l'eau à chauffer, réveille les petits, prépare "
            "la bouillie, lave le linge de la veille, et il n'est pas encore "
            "sept heures et demie.\n"
            "❸ À sept heures et demie, Chantal se retourne dans son lit. ❹ "
            "Elle demande si le petit déjeuner est prêt, se plaint qu'il fasse "
            "trop chaud, cherche son téléphone sous l'oreiller, et déclare "
            "qu'elle est fatiguée.\n"
            "❺ Elles ont toutes les deux quinze ans. ❻ Elles habitent la même "
            "maison."),
        annotations=[
            ["❶ ❸ Deux fois la même heure",
             "**C'est l'horloge qui fait le portrait.** Le même repère "
             "temporel, deux vies."],
            ["❷ L'accumulation",
             "Sept verbes d'affilée, sans respirer. On **sent** la fatigue."],
            ["❹ L'accumulation aussi — mais de plaintes",
             "Quatre verbes, tous tournés vers soi. Le parallèle est exact, "
             "le contenu est inverse."],
            ["❺ La révélation",
             "Six mots. **On ne l'a pas dit plus tôt exprès.**"],
            ["❻ La chute",
             "Cinq mots. On n'ajoute rien : le lecteur a compris, et il est "
             "en colère tout seul."]],
        questions=[
            "Compte les verbes du paragraphe ❷, puis ceux du paragraphe ❹. "
            "Que remarques-tu ?",
            "Relève tous les indicateurs d'heure. Combien y en a-t-il ? À "
            "quoi servent-ils ?",
            "Le texte contient-il un seul adjectif qui juge ? Cherche.",
            "Que se passerait-il si l'on plaçait la phrase ❺ au tout début ? "
            "Essaie, puis compare.",
            "Retrouve dans le roman deux passages qui fonctionnent ainsi : "
            "la journée de Faydé d'un côté, les plaintes de Leïla de l'autre. "
            "Recopie une phrase de chacun."],
        regle=[
            "Le **portrait en contraste** met en parallèle deux personnages "
            "dans la même situation, en gardant **exactement la même "
            "structure de phrase**.",
            "Il utilise l'**accumulation** (une suite de verbes d'action sans "
            "coordination) et les **indicateurs de temps** comme points de "
            "repère communs.",
            "**Il ne juge jamais.** Aucun adjectif d'appréciation, aucune "
            "phrase du type « c'est injuste ». Le lecteur conclut seul, et "
            "c'est pour cela qu'il ne l'oublie pas.",
            "La **révélation** — ce qui rend le contraste insupportable — se "
            "garde pour la fin.",
            "Temps employés : **présent** pour un contraste actuel, "
            "**imparfait** pour une habitude passée."],
        exercices=[
            "**Construis le parallèle.** Écris six lignes sur deux élèves de "
            "ta classe (inventés) : le même jour, la même heure, deux emplois "
            "du temps opposés. Interdit de porter un jugement.",
            "**Accumule.** Écris une phrase de dix verbes d'action à la "
            "suite, sans « et », pour dire une matinée de travail.",
            "**Écris seul.** Fais en vingt lignes le portrait en contraste de "
            "**Faydé et Leïla**, un même jour, de six heures à vingt-deux "
            "heures. **Tous les faits doivent venir du roman.** Révélation à "
            "la fin, chute en une phrase courte.",
            "**Fais tester.** Ton voisin doit être en colère à la fin sans "
            "que tu aies écrit un seul mot de colère. S'il ne l'est pas, ta "
            "révélation est arrivée trop tôt."],
        astuce=("Le secret : la symétrie", [
            "Un contraste ne marche que si les deux moitiés se ressemblent "
            "**en tout sauf en une chose**.",
            "Même heure, même lieu, même âge, mêmes structures de phrase — et "
            "une seule différence.",
            "Si tu changes aussi le lieu et le moment, le lecteur ne compare "
            "plus rien : il lit deux textes.",
            "Vérifie ton texte en le pliant mentalement en deux. Les deux "
            "moitiés doivent se superposer."]))

    b += production(
        "le texte argumentatif complet",
        "défendre une opinion en trois temps — introduction, développement, "
        "conclusion — avec une objection traitée honnêtement.",
        modele=(
            "**Introduction** ❶ Faut-il autoriser les jeunes filles de quinze "
            "ans à travailler comme domestiques en ville ? La question se pose "
            "dans toute la région, et elle divise les familles elles-mêmes. "
            "❷ Il me semble qu'on ne peut pas l'interdire sans rien changer "
            "d'autre, mais qu'on ne peut pas non plus l'accepter telle "
            "qu'elle est.\n"
            "**Développement** ❸ D'abord, il faut reconnaître que ce travail "
            "nourrit des familles entières. Faydé le dit à sa mère : sans son "
            "salaire, personne ne paiera l'école de ses frères ni le savon de "
            "la maison. Interdire ce travail sans donner autre chose, c'est "
            "condamner ceux qui en vivent.\n"
            "❹ Ensuite, il faut voir ce que ce travail coûte réellement. Une "
            "journée qui commence avant six heures et se termine après vingt "
            "et une, sans contrat ni horaires, n'est pas un emploi : c'est une "
            "servitude. Et le roman montre ce qui arrive aux filles qui n'ont "
            "personne pour les protéger.\n"
            "❺ On m'objectera que c'est ainsi depuis toujours et que les "
            "familles s'arrangent entre elles. C'est vrai, et c'est justement "
            "le problème : un arrangement n'est pas une règle, et il ne "
            "protège que celui qui est déjà fort.\n"
            "**Conclusion** ❻ Je pense donc qu'il faut moins interdire "
            "qu'**encadrer** : un âge minimum, des horaires, un salaire "
            "connu, et quelqu'un à qui parler. ❼ Faydé ne demandait rien "
            "d'autre : elle voulait travailler, pas disparaître."),
        annotations=[
            ["❶ La question, posée nettement",
             "On rappelle le sujet **avec ses propres mots**, et l'on dit "
             "qu'il divise."],
            ["❷ La thèse, annoncée dès l'introduction",
             "Nuancée : « ni… ni… ». On sait où l'on va."],
            ["❸ Premier argument : ce qui plaide **pour**",
             "On commence par reconnaître ce que l'adversaire a de juste."],
            ["❹ Deuxième argument : ce qui plaide **contre**",
             "Appuyé sur des faits chiffrés tirés de l'œuvre."],
            ["❺ L'objection, énoncée puis traitée",
             "*On m'objectera que…* — puis *C'est vrai, et c'est justement le "
             "problème*. **C'est le paragraphe qui distingue un bon devoir "
             "d'un devoir moyen.**"],
            ["❻ La conclusion qui propose",
             "Elle ne répète pas : elle **déplace** — d'*interdire* à "
             "*encadrer*."],
            ["❼ La phrase de fin",
             "Courte, concrète, revenue au personnage."]],
        questions=[
            "Repère les trois parties. Combien de paragraphes dans chacune ?",
            "Relève tous les connecteurs. Range-les : ceux qui **ajoutent**, "
            "ceux qui **opposent**, ceux qui **concluent**.",
            "Dans quel paragraphe l'auteur donne-t-il raison à ses "
            "adversaires ? Pourquoi est-ce habile et non faible ?",
            "Quels faits précis du roman sont utilisés ? Combien y en a-t-il ?",
            "La conclusion propose une solution en quatre points. Cite-les. "
            "En vois-tu un cinquième ?",
            "Réécris la thèse ❷ de façon **tranchée** (« il faut interdire »). "
            "Le devoir devient-il plus fort ou plus faible ? Explique."],
        regle=[
            "Un texte argumentatif complet comporte trois parties : "
            "**introduction** (le sujet + ta thèse), **développement** (deux "
            "ou trois arguments + une objection traitée), **conclusion** (le "
            "bilan + une ouverture).",
            "Chaque argument tient en un **paragraphe** : une idée, une "
            "explication, un **exemple précis**, une phrase de liaison.",
            "**L'objection est obligatoire** au collège comme après. On "
            "l'énonce honnêtement (*on m'objectera que…*), on lui donne ce "
            "qu'elle a de juste, puis on montre pourquoi elle ne suffit pas.",
            "La conclusion **ne répète pas l'introduction** : elle avance — "
            "elle propose, elle nuance, ou elle ouvre sur une autre question.",
            "Les connecteurs organisent tout : *d'abord, ensuite, or, "
            "cependant, en revanche, on m'objectera que, c'est pourquoi, "
            "donc*."],
        exercices=[
            "**Trouve l'objection.** Pour chacune de ces thèses, écris "
            "l'objection la plus forte **contre toi** : (a) *Il faut garder "
            "les filles à l'école le plus longtemps possible.* (b) *La ville "
            "offre plus de chances que le village.* (c) *On doit pouvoir "
            "épouser qui l'on veut.*",
            "**Répare une conclusion.** Voici une conclusion qui se contente "
            "de répéter l'introduction. Réécris-la pour qu'elle avance d'un "
            "pas. (Le professeur te la donnera.)",
            "**Écris seul.** *« Faut-il quitter son village pour réussir ? »* "
            "Vingt-cinq lignes : introduction avec thèse nuancée, deux "
            "arguments avec exemples du roman, une objection traitée, une "
            "conclusion qui propose.",
            "**Le débat des deux camps.** La classe se coupe en deux : "
            "*partir* / *rester*. Chaque camp prépare deux arguments, un "
            "exemple cité et **l'objection adverse**. Le camp qui n'aura pas "
            "préparé l'objection perdra."])

    b.append(saut())
    return b


# ============================================================ 6. Je joue

def partie6():
    b = [h2("6. Je joue et je révise"), p("Livre fermé.")]
    corriges = []

    e, c = jeux.mots_meles("Le Sahel de Faydé", [
        "Faydé", "Kondem", "Srafata", "Bintou", "Danna", "Leila", "Boukar",
        "Hapssi", "Diddi", "Nenne", "Ayya", "Biri", "Maroua", "Moskota",
        "Minawao", "Banyo", "Douala", "Ngaoundere", "niebe", "sorgho",
        "mil", "wakkare", "concession", "harmattan", "domestique"],
        graine=1)
    b += e
    corriges += c

    e, c = jeux.mots_croises("Les mots du roman", [
        ("SAHEL", "La bande de terre sèche au sud du Sahara"),
        ("CONCESSION", "Maison où habitent tous les membres d'une famille"),
        ("DOMESTIQUE", "Le métier que Faydé va exercer à Maroua"),
        ("EPIGRAPHE", "La citation placée en tête d'un livre"),
        ("NIEBE", "Le haricot que Kondem arrache au début du roman"),
        ("SORGHO", "Céréale dont les épis secs jonchent le sol"),
        ("HARMATTAN", "Le vent sec qui, dit Faydé, ne souffle plus"),
        ("EXODE", "Le départ des jeunes vers la ville"),
        ("WAKKARE", "Le deuxième pagne des citadines"),
        ("MAROUA", "La métropole régionale, à cinquante kilomètres"),
        ("CONTRASTE", "Mettre deux choses côte à côte sans commenter"),
        ("INFIRMIERE", "Ce que Faydé devient à la fin du roman"),
    ], graine=103)
    b += e
    corriges += c

    e, c = jeux.qcm("As-tu lu le roman ?", [
        ("Quel âge a Faydé au début du roman ?",
         ["douze ans", "quinze ans", "dix-huit ans", "vingt ans"], 1),
        ("Pourquoi Kondem refuse-t-elle que sa fille parte ?",
         ["elle a besoin d'elle aux champs", "elle a été domestique elle-même "
          "et sait ce qui attend sa fille", "elle veut la marier",
          "elle n'aime pas la ville"], 1),
        ("À quelle distance se trouve Maroua ?",
         ["dix kilomètres", "une cinquantaine de kilomètres",
          "deux cents kilomètres", "on ne le sait pas"], 1),
        ("Que voulait devenir Faydé quand elle allait à l'école ?",
         ["institutrice", "médecin", "commerçante", "infirmière"], 1),
        ("Qui est Leïla ?",
         ["une domestique comme Faydé", "la fille unique de Nenné",
          "la sœur de Faydé", "la patronne principale"], 1),
        ("Pourquoi Boukar ne peut-il pas épouser Faydé au début ?",
         ["il est déjà marié", "elle est trop jeune",
          "elle est kaado et chrétienne, lui peul et musulman",
          "il part à l'étranger"], 2),
        ("Pourquoi le mariage de Leïla doit-il être réduit ?",
         ["par manque d'argent", "à cause du couvre-feu et de l'interdiction "
          "des rassemblements", "parce que le fiancé refuse",
          "à cause de la sécheresse"], 1),
        ("Que devient Faydé à la fin du roman ?",
         ["commerçante à Douala", "infirmière, et fondatrice d'une "
          "association", "institutrice au village", "domestique en chef"], 1),
    ])
    b += e
    corriges += c

    e, c = jeux.vrai_faux("Vrai ou faux dans le Sahel", [
        ("Le roman se présente comme une histoire entièrement inventée.",
         False,
         "La page de garde dit : « Cette œuvre est une fiction inspirée de "
         "faits réels », et les remerciements décrivent de longues "
         "recherches."),
        ("Faydé est la première de sa famille à partir travailler en ville.",
         False, "Sa mère Kondem a été domestique à Maroua avant elle."),
        ("Leïla méprise ouvertement Faydé.", False,
         "Elle la traite en confidente et lui offre ses pagnes. Le fossé "
         "n'est pas de la méchanceté : c'est de l'ignorance."),
        ("Le roman explique lui-même ce qu'est une concession.", True,
         "« une maison où habitent tous les membres d'une famille et qui est "
         "délimitée par des murs ou par une palissade »."),
        ("Boko Haram est au centre de l'intrigue.", False,
         "Le groupe n'apparaît que par ses effets : couvre-feu, "
         "rassemblements interdits, mariage réduit."),
        ("Le roman se termine sur un malheur.", False,
         "Il se termine sur trois mots : « Juste aimer ! »"),
    ])
    b += e
    corriges += c

    e, c = jeux.remise_en_ordre("Le chemin de Faydé", [
        "Au village, elle annonce à sa mère qu'elle veut partir travailler à "
        "Maroua.",
        "Elle part avec Srafata, Danna et Bintou vers la grande concession.",
        "Elle devient la servante et la confidente de Leïla.",
        "Elle apprend que Boukar doit épouser Hapssi.",
        "Le couvre-feu et les interdictions réduisent le mariage de Leïla.",
        "Des années plus tard, devenue infirmière, elle dirige une "
        "association pour les femmes.",
    ], graine=107)
    b += e
    corriges += c

    e, c = jeux.qui_suis_je("Devine qui parle", [
        ("J'arrache des gousses de niébé en passant ma colère sur la terre, "
         "et je refuse que ma fille fasse ce que j'ai fait.", "Kondem"),
        ("J'attends un iPhone de la dernière génération et je suis fatiguée "
         "de manger toujours la même chose.", "Leïla"),
        ("J'arrose les plantes en fin d'après-midi, et je dis tout haut ce "
         "que les autres taisent.", "Biri"),
        ("Je suis belle, réservée, de bonne famille, et je n'adresse jamais "
         "la parole aux domestiques.", "Hapssi"),
        ("On m'appelle « prof » parce que je suis allée à l'école, et j'ai "
         "fondé une association au nom d'une amie disparue.", "Faydé"),
    ])
    b += e
    corriges += c

    b += jeux.carte_mentale(
        "Cœur du Sahel", "CŒUR DU SAHEL",
        [("Le genre", ["roman en trois parties",
                       "fiction inspirée de faits réels",
                       "point de vue interne"]),
         ("Les personnages", ["Faydé, quinze ans",
                              "deux mondes séparés par un mur",
                              "des amitiés inégales"]),
         ("Les lieux", ["le village de l'Extrême-Nord",
                        "Maroua et la grande concession",
                        "Ngaoundéré, Banyo, Douala"]),
         ("Les thèmes", ["la sécheresse et l'exode rural",
                         "le travail des jeunes domestiques",
                         "les barrières de caste et de religion",
                         "s'instruire quand même"]),
         ("Les procédés", ["le contraste sans commentaire",
                           "l'accumulation des tâches",
                           "les épigraphes qui annoncent",
                           "le détail concret (le sucre, l'eau)"]),
         ("Ce que j'en retiens", ["…", "…"])])

    b.append(saut())
    return b, corriges


# ======================================================== 7. Je m'évalue

ORTHO_FAUTIF = (
    "La saison seche s'instalait sur le village. Depuis quatre mois, aucune "
    "goutte d'eau n'était tombée la terre craquellée refusait de nourrir quoi "
    "que ce soit. Les jeunes filles partait les unes après les autres vers la "
    "ville, et le village ce vidait. Faydé regardait ces amies revenir chaque "
    "decembre, les mains pleines de savon, de sucre et de poisson seché. Le "
    "soir, autour du feu, elles racontait leurs aventures en riant très fort. "
    "Leurs chaussures neuve brilaient dans la lumière des flammes. Sa mère, "
    "elle, ne riait jamais quand ont parlait de la ville. Elle savait ce qui "
    "attendait là-bas les filles de quinze an. Mais comment expliquer cela à "
    "une adolesente qui n'a plus rien à manger ? Faydé écoutait, se taisait, "
    "et comptait les jours.")

ORTHO_CORRIGE = [
    ["1", "La saison **seche**", "La saison **sèche**", "accent grave "
     "manquant", "0,5"],
    ["2", "n'était tombée **_** la terre", "n'était tombée **;** la terre",
     "point-virgule manquant", "0,5"],
    ["3", "chaque **decembre**", "chaque **décembre**", "accent manquant",
     "0,5"],
    ["4", "de poisson **seché**", "de poisson **séché**", "accent manquant",
     "0,5"],
    ["5", "**s'instalait**", "**s'installait**",
     "orthographe d'usage : deux *l*", "1"],
    ["6", "la terre **craquellée**", "la terre **craquelée**",
     "orthographe d'usage : un seul *l*", "1"],
    ["7", "**brilaient**", "**brillaient**",
     "orthographe d'usage : deux *l*", "1"],
    ["8", "une **adolesente**", "une **adolescente**",
     "orthographe d'usage : *sc*", "1"],
    ["9", "Les jeunes filles **partait**", "… **partaient**",
     "accord sujet-verbe", "2"],
    ["10", "elles **racontait**", "elles **racontaient**",
     "accord sujet-verbe", "2"],
    ["11", "Leurs chaussures **neuve**", "Leurs chaussures **neuves**",
     "accord de l'adjectif", "2"],
    ["12", "les filles de quinze **an**", "… de quinze **ans**",
     "accord du nom au pluriel", "2"],
    ["13", "le village **ce** vidait", "le village **se** vidait",
     "homophone : *se* est un pronom", "2"],
    ["14", "regardait **ces** amies", "regardait **ses** amies",
     "homophone : *ses* est un possessif — ce sont les amies de Faydé", "2"],
    ["15", "quand **ont** parlait", "quand **on** parlait",
     "homophone : *on* est le sujet", "2"],
]


def partie7():
    b = [h2("7. Je m'évalue — trois épreuves")]
    corriges = []

    texte = source.extrait(CLE, "Faydé se lève à nouveau vers 8 heures",
                           mots=330, arret=BORNES)
    b += epreuve_etude_texte(
        "La grande cuisine (partie II)",
        chapeau="Ce passage n'a pas été étudié en classe : c'est ta lecture "
                "personnelle qui parle. Nous sommes dans la concession, à "
                "Maroua, pendant le mois de jeûne. Faydé s'est déjà levée une "
                "première fois avant l'aube.",
        texte=texte, source=SRC,
        comprehension=[
            ("Fais la liste, dans l'ordre, des tâches accomplies par Faydé "
             "dans ce passage.", "2"),
            ("À quelle heure se lève-t-elle « à nouveau » ? Que font les "
             "autres à ce moment-là ? Recopie la phrase.", "2"),
            ("Pourquoi prépare-t-elle un petit déjeuner alors que la maison "
             "jeûne ?", "2"),
            ("« Et, à midi, la grande cuisine commence ! » Quel effet produit "
             "le point d'exclamation ici ?", "2"),
            ("Quelle impression d'ensemble ce passage laisse-t-il ? Justifie "
             "par deux éléments du texte.", "2")],
        langue=[
            ("Relève quatre verbes conjugués ; donne leur infinitif et leur "
             "temps.", "2"),
            ("« Elle lave la vaisselle, balaie la cour et s'occupe du "
             "linge. » Combien de propositions comporte cette phrase ? "
             "Comment sont-elles reliées ?", "2"),
            ("Réécris cette même phrase à l'imparfait, puis au passé "
             "composé.", "2"),
            ("Relève deux compléments d'objet direct et deux compléments "
             "circonstanciels.", "2"),
            ("Forme un nom à partir de chacun de ces verbes : *laver, "
             "balayer, préparer, se lever*.", "2")])
    corriges += [h3("Épreuve 1 — Étude de texte : éléments de corrigé"),
                 grille([["Question", "Ce qu'on attend", "Pts"],
                         ["I.1", "Laver la vaisselle, balayer la cour, "
                          "s'occuper du linge, préparer le petit déjeuner des "
                          "enfants — puis, à midi, la grande cuisine.", "2"],
                         ["I.2", "Vers 8 heures, « pendant que tout le monde "
                          "dort ».", "2"],
                         ["I.3", "Pour les enfants, « encore trop jeunes pour "
                          "respecter le jeûne ».", "2"],
                         ["I.4", "Il marque l'ampleur de ce qui reste à faire : "
                          "après une matinée entière de travail, la journée ne "
                          "fait que commencer. L'exclamation est ici ironique "
                          "et accablante.", "2"],
                         ["I.5", "Celle d'un travail sans fin et d'une "
                          "solitude : elle est debout quand les autres "
                          "dorment, et chaque tâche achevée en découvre une "
                          "autre. Toute réponse justifiée par deux éléments "
                          "est acceptée.", "2"],
                         ["II.1", "Ex. : *se lève* (se lever, présent) ; *lave* "
                          "(laver, présent) ; *balaie* (balayer, présent) ; "
                          "*dort* (dormir, présent).", "2"],
                         ["II.2", "Trois propositions indépendantes : les deux "
                          "premières **juxtaposées** (virgule), la troisième "
                          "**coordonnée** par *et*.", "2"],
                         ["II.3", "Imparfait : *Elle lavait la vaisselle, "
                          "balayait la cour et s'occupait du linge.* — Passé "
                          "composé : *Elle a lavé la vaisselle, a balayé la "
                          "cour et s'est occupée du linge.*", "2"],
                         ["II.4", "COD : *la vaisselle*, *la cour*, *le petit "
                          "déjeuner*. CC : *à nouveau vers 8 heures* (temps), "
                          "*à midi* (temps).", "2"],
                         ["II.5", "lavage · balayage · préparation · lever.",
                          "2"]])]

    b += epreuve_orthographe(ORTHO_FAUTIF,
                             "Texte composé pour l'épreuve, dans la manière du "
                             "roman", nb_fautes=15)
    corriges += [h3("Épreuve 2 — Correction orthographique : corrigé"),
                 grille([["N°", "Écrit dans le texte", "Correction",
                          "Pourquoi", "Pts"]] + ORTHO_CORRIGE),
                 ("p", "**Total : 20 points.** Retirer **0,5 point** par mot "
                  "correct barré à tort.")]

    b += epreuve_expression([
        {"type": "Argumentation complète",
         "contexte": "Kondem refuse que sa fille aille travailler en ville. "
                     "Faydé répond qu'il n'y a pas le choix. Ni l'une ni "
                     "l'autre n'a entièrement tort.",
         "citation": source.extrait(
             CLE, "Cette école et ses promesses d'un avenir meilleur",
             arrivee="sans avoir aucune chance de l'atteindre."),
         "source": SRC,
         "taches": [
             "Produis un texte **argumentatif complet** de vingt-cinq à "
             "trente lignes.",
             "Sujet : *« L'école est-elle encore un chemin sûr vers une vie "
             "meilleure ? »*",
             "**Obligatoire :** une introduction qui pose le sujet et annonce "
             "une thèse nuancée ; deux arguments développés, chacun avec un "
             "**exemple précis du roman et une citation entre guillemets** ; "
             "**une objection énoncée et traitée** ; une conclusion qui "
             "propose ou qui ouvre."],
         "bareme": [["L'introduction pose le sujet et annonce la thèse", "3"],
                    ["Deux arguments développés avec exemples cités", "6"],
                    ["L'objection est énoncée et honnêtement traitée", "4"],
                    ["La conclusion avance au lieu de répéter", "2"],
                    ["Orthographe et ponctuation", "3"],
                    ["Présentation et longueur", "2"]]},
        {"type": "Portrait en contraste",
         "contexte": "Deux jeunes filles du même âge vivent dans la même "
                     "concession. L'une se lève avant l'aube ; l'autre "
                     "commande des tartines au chocolat.",
         "citation": source.extrait(
             CLE, "Comment expliquer à une fille qui n'a jamais connu la faim",
             arrivee="Rien n'est plus indiscret qu'un estomac affamé."),
         "source": SRC,
         "taches": [
             "Produis un **portrait en contraste** de vingt à vingt-cinq "
             "lignes.",
             "Deux personnes du même âge, un même jour, une même maison — et "
             "deux vies opposées. Tu peux partir du roman ou inventer.",
             "**Obligatoire :** une structure symétrique (mêmes repères "
             "d'heure des deux côtés) ; **une accumulation d'au moins sept "
             "verbes** ; **aucun adjectif qui juge** ; une révélation gardée "
             "pour la fin ; une chute d'une phrase."],
         "bareme": [["La symétrie des deux portraits est tenue", "5"],
                    ["L'accumulation produit son effet", "4"],
                    ["Aucun jugement : le lecteur conclut seul", "4"],
                    ["La révélation et la chute sont bien placées", "3"],
                    ["Orthographe et ponctuation", "2"],
                    ["Présentation et longueur", "2"]]},
    ])
    b.append(saut())
    return b, corriges
