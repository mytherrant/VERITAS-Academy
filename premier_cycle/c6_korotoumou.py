# -*- coding: utf-8 -*-
"""6ᵉ — *Les Contes de Korotoumou*, Amadou Koné.

Quatorze contes en trois parties, précédés d'un prologue où l'auteur demande
à sa grande sœur de raconter, un soir, comme autrefois — la télévision étant
allumée à côté. C'est ce prologue qui donne au recueil son sens, et il est
imprimé, pas deviné.

Les renseignements donnés ici viennent du volume : le sommaire, le prologue,
les contes eux-mêmes et les **Notes pédagogiques** finales, qui contiennent la
biographie de l'auteur, l'analyse de la couverture et le tableau des valeurs
attachées à chaque animal.
"""
import jeux
import source
from gabarit import cote_enseignant, lecture_suivie, ouvrir
from kit import cases, enc, grille, h1, h2, h3, lignes, num, p, puce, saut

CLE = "korotoumou"
SRC = "Amadou Koné, *Les Contes de Korotoumou*"

# Les intertitres du volume : ils bornent les découpes d'extraits.
BORNES = ["PREMIÈRE PARTIE", "DES ANIMAUX ENTRE EUX", "LE JEU DES CONGCO",
          "LE MIEL", "LIÈVRE ET HYÈNE", "OISEAU MALAN", "CHIEN ET SINGE",
          "DEUXIÈME PARTIE", "DES HOMMES ENTRE EUX", "GNITORNI",
          "LA PROSCRITE", "NTÉGNAN", "LE PRINCE QUI", "LES TROIS FRÈRES",
          "TROISIÈME PARTIE", "DES HOMMES, DES ANIMAUX", "TCHIÈ",
          "L'ÉCUELLE", "TENDANI ITO", "SOUMAORO", "NOTES PÉDAGOGIQUES"]


def _x(amorce, mots=620):
    voisins = [t for t in BORNES if source.plat(t) not in source.plat(amorce)]
    return source.extrait(CLE, amorce, mots=mots, arret=voisins)


# ============================================================ 1. J'ouvre

def partie1():
    return [h1("Œuvre 3 — Les Contes de Korotoumou, d'Amadou Koné")] + ouvrir(
        "Les Contes de Korotoumou", "Amadou Koné",
        questions_couverture=[
            "Le titre est un groupe de mots : **Les Contes** *de Korotoumou*. "
            "Qui est Korotoumou, d'après toi : l'auteur du livre, ou quelqu'un "
            "d'autre ?",
            "Regarde la couverture : un village dans la forêt, des gens de "
            "tous âges rassemblés le soir sous un grand arbre. Qui parle, sur "
            "cette image ? Comment le vois-tu ?",
            "Les couleurs dominantes sont le **jaune** et le **vert**. À quoi "
            "te font-elles penser ?",
            "Chez toi, qui raconte les histoires le soir ? Et si personne ne "
            "le fait, qu'est-ce qui a pris la place de ces histoires ?"],
        promesses=[
            "Les contes de ce livre seront-ils les mêmes que ceux du premier "
            "recueil ?",
            "Y aura-t-il des sorcières ? des rois ? des génies ?",
            "Un conte peut-il encore servir à quelque chose aujourd'hui ?",
            "Est-ce qu'on peut oublier un conte ?"],
        journal_exemple=["15/01", "Le prologue et « Le jeu des congco'ngan »",
                         "Le frère demande à sa sœur de raconter comme "
                         "autrefois ; l'hyène coupe le cœur de l'éléphant",
                         "Pourquoi la sœur hésite-t-elle autant à raconter ?"])


# ================================================= 2. L'auteur et son livre

def partie2():
    return [
        h2("2. L'auteur et son livre"),
        h3("Amadou Koné, un Ivoirien qui enseigne l'Afrique en Amérique"),
        p("Amadou Koné est un **écrivain ivoirien**. Il enseigne la "
          "littérature, la culture et l'histoire africaines à l'**université "
          "de Georgetown, aux États-Unis**. Presque toutes ses œuvres ont un "
          "point commun : **le récit**."),
        enc("culture", "Un détail qui explique tout le livre", [
            "Dans le prologue, le narrateur dit : *« je reviens d'Amérique »*.",
            "C'est donc un homme qui vit très loin, dans un pays de gratte-"
            "ciel, qui demande à sa grande sœur de raconter des contes de "
            "village. Ce n'est pas de la nostalgie de vieux : c'est un "
            "professeur d'université qui a compris qu'on était en train de "
            "perdre quelque chose.",
            "Et il ajoute une phrase surprenante : là-bas aussi, dit-il, "
            "*« les héros existent toujours, les miracles existent, les "
            "animaux parlent »*. Autrement dit : l'Amérique se raconte des "
            "contes, elle aussi. Elle les appelle des films."]),
        h3("Le titre, mot à mot"),
        p("« Les Contes **de Korotoumou** » : le complément ne dit pas qui a "
          "**écrit** les contes, mais qui les **dit**. Korotoumou est la "
          "grande sœur du narrateur, et c'est elle la conteuse."),
        enc("mot", "Conte : ce que le livre en dit lui-même", [
            "Les Notes pédagogiques du volume donnent cette définition : le "
            "conte est « un genre littéraire fondé sur une histoire plus ou "
            "moins longue ». **À l'origine, il était oral ; il est devenu "
            "écrit.**",
            "Et elles précisent son mécanisme : *« Dans les contes, héros et "
            "héroïnes doivent faire des épreuves, affronter des ennemis, les "
            "opposants. Il leur faut trouver des aides, des adjuvants. »*",
            "Deux mots à retenir : un **opposant** est celui qui bloque le "
            "héros ; un **adjuvant** est celui qui l'aide. Cherche-les dans "
            "chaque conte : tu les trouveras toujours."]),
        h3("La veillée qui n'a plus lieu"),
        p("Le prologue raconte une scène très simple et très grave. Le frère "
          "propose une veillée de contes. Sa sœur objecte trois choses. "
          "Écoute-les bien, car elles sont vraies pour toi aussi :"),
        grille([["Ce que dit Korotoumou", "Ce que cela veut dire"],
                ["« Ce soir, il y a le feuilleton-là. »",
                 "La télévision occupe déjà la soirée."],
                ["« Qui voudra et pourra se détacher du téléviseur pour "
                 "écouter des contes ? »",
                 "Il n'y a plus de public : un conte sans auditoire n'existe "
                 "pas."],
                ["« On oublie les contes quand on ne les dit pas. »",
                 "Un conte n'est pas dans un livre : il est dans une mémoire. "
                 "Si personne ne le dit, il meurt."],
                ["« Les contes sont des histoires trop vieilles qui ne "
                 "correspondent plus à rien. »",
                 "Le doute le plus grave : et si tout cela était périmé ?"]]),
        enc("perso", "Ce soir-là, la télévision est restée éteinte", [
            "Le prologue finit par une phrase toute simple : *« Mes neveux et "
            "nièces n'ont pas allumé la télévision ce soir-là. »*",
            "Et la veillée a duré **plusieurs nuits**.",
            "Autrement dit : le livre que tu tiens est le compte rendu d'une "
            "expérience. Quelqu'un a essayé de savoir si les contes tenaient "
            "encore debout. Réponse : oui — à condition que quelqu'un les "
            "dise."]),
        h3("Ce qu'il y a dedans : quatorze contes, trois familles"),
        grille([["Partie", "Titre de la partie", "Les contes"],
                ["I", "**Des animaux entre eux**",
                 "Le jeu des congco'ngan · Le miel · Lièvre et Hyène pêcheurs · "
                 "Oiseau Malan, Hyène et Chat · Chien et Singe"],
                ["II", "**Des hommes entre eux**",
                 "Gnitorni · La proscrite et la femme du roi · Ntégnan · Le "
                 "prince qui avait épousé un singe · Les trois frères"],
                ["III", "**Des hommes, des animaux, des objets**",
                 "Tchiè Tla Kélé ou Moitié d'homme · L'écuelle et le fouet · "
                 "Tendani Ito · Soumaoro et les œufs du Grand Oiseau"]]),
        enc("astuce", "Le classement le plus utile du livre", [
            "Ces trois parties ne sont pas décoratives : elles t'apprennent à "
            "**classer** les contes du monde entier.",
            "**Partie I** : seuls les animaux parlent. **Partie II** : seuls "
            "les hommes agissent. **Partie III** : hommes, bêtes et **objets** "
            "se mélangent — une écuelle et un fouet deviennent des "
            "personnages.",
            "Quand tu liras un conte ailleurs, demande-toi : dans quelle "
            "partie du livre de Korotoumou l'aurait-on rangé ?"]),
        saut()]


# =========================================================== 3. Qui est qui

def partie3():
    b = [h2("3. Qui est qui dans les contes"),
         p("Les Notes pédagogiques du volume donnent elles-mêmes la clé : dans "
           "ces contes, chaque animal **incarne une valeur ou un défaut**. Ce "
           "n'est pas une invention de professeur, c'est écrit dans le livre."),
         grille([["L'animal", "Ce qu'il incarne, selon le livre",
                  "Où tu le vois"],
                 ["**Le lièvre** (Minanhanlan)",
                  "la ruse, la sagesse, l'intelligence",
                  "il plume l'hyène tous les jours dans « Lièvre et Hyène "
                  "pêcheurs »"],
                 ["**L'oiseau**", "la ruse, l'intelligence",
                  "Malan offre des plumes à l'hyène pour mieux les reprendre"],
                 ["**L'hyène**", "la gloutonnerie, la cupidité, l'avidité",
                  "elle coupe le cœur de l'éléphant, elle veut « les paniers "
                  "de demain »"],
                 ["**L'éléphant** et **le cafard**",
                  "la crédulité, la confiance, le partage",
                  "l'éléphant rit et se laisse vider ; le cafard trouve le "
                  "miel et le perd"],
                 ["**Le singe**", "la paresse, l'oisiveté, l'ingratitude",
                  "il refuse de creuser le puits, puis s'y baigne"],
                 ["**Le coq, le renard, le lion**",
                  "la méchanceté, la malveillance, l'agressivité",
                  "chacun se fait « grand frère » et prend la place du "
                  "précédent"]]),
         enc("perso", "Les humains n'ont pas de nom — sauf quatre", [
             "Le livre le dit : les personnages humains « ne sont pas des "
             "individus identifiables : ils représentent des types ». On les "
             "désigne par :",
             "**leur âge** — la vieille femme ; **leur condition** — la "
             "proscrite ; **leur rang** — le prince, le roi, la femme du roi.",
             "Quatre noms font exception, et ce sont des **surnoms** : "
             "**Gnitorni** (« Dent pourrie »), **Ntégnan** (« celui qui, "
             "poursuivi par la fatalité, ne peut pas réussir »), **Ngolo** "
             "(le fils qui dit « maman »), **Soumaoro**.",
             "Retiens la règle : dans un conte, un nom propre est presque "
             "toujours un **programme**."]),
         enc("animal", "Pourquoi l'hyène perd toujours", [
             "Dans toute l'Afrique de l'Ouest, l'hyène est le personnage du "
             "glouton. Elle ne perd pas parce qu'elle est faible : elle est "
             "grande, forte, et elle a des mâchoires terribles.",
             "Elle perd parce qu'elle **ne peut pas attendre**. Dans « Le jeu "
             "des congco'ngan », elle met du piment sur des braises pour faire "
             "tousser les vieilles femmes, tourmente les poules et allume une "
             "torche dans un arbre — trois fois pour faire croire au lever du "
             "jour.",
             "Dans « Lièvre et Hyène pêcheurs », elle refuse le panier "
             "d'aujourd'hui pour avoir les deux paniers de demain. Tous les "
             "jours. Pendant des mois."]),
         enc("lieu", "Kongodjan, et le village d'à côté", [
             "**Kongodjan** est la plantation de café et de cacao où le "
             "narrateur et sa sœur ont grandi. Le livre en parle comme d'« un "
             "vieux mythe » et d'« un univers anachronique, figé dans le temps "
             "passé ».",
             "Le **nouveau village**, lui, est « éclairé à l'électricité, "
             "couvert par les radios et les chaînes de télévision ».",
             "Deux villages, deux mondes, à quelques kilomètres l'un de "
             "l'autre. Toute la question du livre tient dans cet écart.",
             "Le narrateur précise aussi la langue de la maison : le "
             "**Cerma**. Sa sœur doute de pouvoir encore raconter dans cette "
             "langue-là."])]

    e, c = jeux.relier(
        "Chaque animal, sa réputation",
        [("L'hyène", "La gloutonnerie et l'impatience"),
         ("Le lièvre", "La ruse qui gagne sans jamais se battre"),
         ("Le singe", "La paresse, puis l'ingratitude"),
         ("L'éléphant", "La confiance de celui qui rit trop fort"),
         ("Le lion", "La force qui prend la part des autres"),
         ("L'oiseau Malan", "Le piège offert comme un cadeau")],
        graine=83)
    b += e
    b.append(saut())
    return b, c


# ======================================================= 4. Lectures suivies

def partie4():
    b = [h2("4. Je lis l'œuvre — six lectures suivies"),
         p("Le prologue, puis cinq contes pris dans les deux premières parties "
           "du recueil. Les autres t'attendent en lecture personnelle — et "
           "l'un d'eux t'attend à l'épreuve.")]

    b += lecture_suivie(
        1, "« Et si nous disions des contes ce soir ? » (le prologue)",
        situation=[
            "Ce n'est pas encore un conte : c'est la scène qui rend tous les "
            "autres possibles.",
            "Le narrateur, de retour d'Amérique, retrouve sa grande sœur "
            "Korotoumou dans leur village — un village moderne, électrifié, "
            "avec la télévision allumée. Il lui propose une veillée de contes, "
            "comme autrefois à Kongodjan.",
            "Elle ne dit pas oui tout de suite. C'est cela qui est "
            "intéressant."],
        texte=_x("Kouncoun, et si nous disions des contes"), source=SRC,
        questions=[
            "Comment le narrateur appelle-t-il sa sœur ? Et comment "
            "s'appelle-t-elle vraiment ? Que t'apprend cette double "
            "appellation ?",
            "Relève **trois** objections de Korotoumou. Laquelle te paraît la "
            "plus sérieuse ?",
            "Recopie la phrase : « On oublie les contes quand on ne les dit "
            "pas. » Explique-la avec un exemple pris chez toi.",
            "Que sont devenues les soirées dans le nouveau village ? Relève "
            "les mots qui décrivent ce changement.",
            "« Des personnages qui parlent français » : pourquoi le narrateur "
            "insiste-t-il là-dessus ? Qu'est-ce qui le gêne ?",
            "Quel argument le narrateur ramène-t-il d'Amérique ? "
            "Trouves-tu qu'il a raison ?",
            "Quelle est la dernière phrase du prologue ? Que s'est-il passé "
            "ce soir-là ?"],
        grille_lecture=[
            ("Que deux mondes s'opposent",
             "Les mots de Kongodjan face aux mots du village moderne"),
            ("Que la sœur hésite vraiment",
             "Les verbes de doute et les questions qu'elle pose"),
            ("Que le frère insiste avec douceur",
             "Ses phrases qui commencent par « Et si… »"),
            ("Que le conte a besoin d'un public",
             "Tout ce que Korotoumou dit sur ceux qui écoutent")],
        bilan=[
            "Ce prologue est un petit chef-d'œuvre d'honnêteté. L'auteur "
            "aurait pu écrire : « voici de beaux contes africains ». Il "
            "commence au contraire par **donner la parole à celle qui n'y "
            "croit plus**.",
            "Et les objections de sa sœur sont solides : plus de public, plus "
            "de mémoire, plus de langue, et peut-être plus de vérité. Un livre "
            "qui commence par ses propres objections est un livre qui ne te "
            "prend pas pour un imbécile.",
            "La réponse du frère n'est pas « c'était mieux avant ». Elle est "
            "beaucoup plus fine : *« Je crois que ce sont des histoires du "
            "passé, mais qui nous projette dans le futur. »*",
            "Garde cette phrase. C'est le contrat de lecture du livre entier."],
        encadres=[
            ("culture", "Ce qu'on perd quand une veillée s'arrête", [
                "Une veillée de contes, ce n'est pas seulement une histoire. "
                "C'est aussi : une **langue** qu'on entend, des **proverbes** "
                "qu'on retient, des **chansons** qu'on reprend en chœur, et "
                "des **vieux** à qui l'on donne la parole.",
                "Quand la veillée s'arrête, les quatre disparaissent en même "
                "temps. La télévision, elle, donne une histoire — et rien "
                "d'autre.",
                "**Ce n'est pas une raison de détester la télévision.** C'est "
                "une raison de ne pas laisser mourir l'autre chose."]),
            ("jeu", "Fais l'expérience toi-même", [
                "Ce week-end, demande à quelqu'un de plus de soixante ans de "
                "te raconter **une** histoire de son enfance.",
                "Note ensuite trois choses : le titre, un personnage, et une "
                "phrase exacte qu'il a prononcée.",
                "Rapporte-la en classe. Vous aurez, à trente élèves, refait le "
                "travail d'Amadou Koné."])])

    b += lecture_suivie(
        2, "L'hyène qui ne sait pas attendre (« Le jeu des congco'ngan »)",
        situation=[
            "Premier conte du recueil. C'est la sécheresse et la famine. Le "
            "lièvre, au lieu de travailler, va jouer tous les jours avec "
            "l'éléphant — qui appartient aux génies et n'a besoin de rien.",
            "Chaque soir, le lièvre fait rire l'éléphant, et pendant qu'il "
            "rit, il lui prélève de la viande. Personne ne s'aperçoit de rien.",
            "Jusqu'au jour où la femme de l'hyène découvre le pot aux roses."],
        texte=_x("En cette période de sécheresse et de famine"), source=SRC,
        questions=[
            "Pourquoi l'éléphant n'a-t-il jamais besoin de travailler ? "
            "Recopie l'explication du texte.",
            "Comment Carmaillée, la femme de l'hyène, s'y prend-elle pour "
            "prouver à son mari qu'il y a de la viande chez le lièvre ? "
            "Raconte sa ruse en trois phrases.",
            "Que craint le lièvre en emmenant l'hyène avec lui ? Relève sa "
            "phrase exacte.",
            "Que jure l'hyène ? Sur quoi ?",
            "Dans la suite du conte, l'hyène cherche trois fois à faire "
            "croire qu'il fait jour. Décris les trois ruses. Laquelle est la "
            "plus drôle ?",
            "À chaque fois, comment le lièvre répond-il ? Relève la formule "
            "qu'il répète.",
            "L'hyène apporte un grand couteau alors qu'on lui a demandé un "
            "petit. Que nous annonce ce détail ?"],
        grille_lecture=[
            ("Que l'hyène ne peut pas attendre",
             "Les trois fausses aurores qu'elle fabrique"),
            ("Que le lièvre sait déjà tout",
             "La formule « j'ai rêvé et vu… » répétée"),
            ("Que le conte se moque de la gourmandise",
             "Les mots de la faim et de l'excitation"),
            ("Que le désastre est annoncé d'avance",
             "Le grand couteau, la grande écuelle, et le cœur « lorgné »")],
        bilan=[
            "Un conte parfaitement construit : tout ce qui va mal était "
            "**annoncé**. Le lièvre prévient ; l'hyène jure ; l'hyène apporte "
            "quand même le grand couteau.",
            "Le comique tient dans les trois fausses aurores — le piment sur "
            "les braises pour faire tousser les vieilles, les poules "
            "tourmentées, la torche accrochée à un arbre. C'est absurde et "
            "c'est très logique : l'hyène ne triche pas sur le temps, elle "
            "triche sur **les signes** du temps.",
            "Et la morale n'est pas seulement « ne sois pas gourmand ». Elle "
            "est plus précise : **on perd tout en voulant tout, tout de "
            "suite**. Le lièvre prenait un peu de viande chaque jour depuis des "
            "semaines. L'hyène a voulu le cœur en une fois."],
        encadres=[
            ("mot", "Les mots difficiles de la séance", [
                "**Désœuvré** : qui n'a rien à faire.",
                "**Calciné** : brûlé, réduit en cendres. La terre est calcinée "
                "par le soleil.",
                "**Un encensoir** : un récipient où l'on brûle des braises "
                "parfumées.",
                "**Une gibecière** : le sac où le chasseur met son gibier.",
                "**Couard** : peureux, lâche."]),
            ("rire", "Le lièvre qui « rêve » toujours juste", [
                "Trois fois, le lièvre répond à l'hyène : *« J'ai rêvé et vu "
                "en songe que c'est toi qui as… »* — et il décrit exactement "
                "la triche.",
                "Il ne rêve rien du tout, évidemment : il connaît son amie par "
                "cœur. Mais en présentant sa lucidité comme un rêve, il évite "
                "de l'accuser — et il l'impressionne.",
                "C'est une leçon de diplomatie déguisée en blague."])])

    b += lecture_suivie(
        3, "La chaîne des grands frères (« Le miel »)",
        situation=[
            "Deuxième conte. Le cafard découvre du miel dans un arbre mort. "
            "Il rentre au village chercher une torche et une calebasse pour "
            "récolter.",
            "Sur la route, il rencontre quelqu'un. Puis quelqu'un d'autre. "
            "Puis encore quelqu'un.",
            "Compte-les bien en lisant : c'est là tout le mécanisme du conte."],
        texte=_x("Le cafard, un jour, découvrit du miel"), source=SRC,
        questions=[
            "Qui découvre le miel ? Que va-t-il chercher au village ?",
            "Fais la liste, **dans l'ordre**, de tous ceux qui se joignent au "
            "cafard.",
            "Quelle phrase chacun prononce-t-il pour s'inviter ? Recopie-la.",
            "Que veut dire « être le grand frère », dans ce conte ? Qui décide "
            "de qui est le grand frère ?",
            "Qui obtient finalement le miel ? Est-ce celui qui l'a trouvé ?",
            "Comment le chien se sort-il de l'affaire ? Explique la ruse des "
            "« fesses coincées ».",
            "À la fin, le conte explique quelque chose de bien réel. Quoi ? "
            "Recopie la phrase."],
        grille_lecture=[
            ("Que la chaîne s'allonge selon la force",
             "L'ordre des animaux : cafard, coq, renard, chien, hyène, lion"),
            ("Que la même phrase revient à chaque étape",
             "La formule d'invitation, répétée"),
            ("Que le conte est aussi une chanson",
             "Les passages en langue, suivis de leur traduction"),
            ("Que le récit explique le présent",
             "La dernière phrase, sur le cri de chaque animal")],
        bilan=[
            "Voici un conte **en escalier** : chaque marche est plus forte que "
            "la précédente, et à chaque marche, celui d'en dessous perd son "
            "rang. Le cafard, qui a tout trouvé, finit dernier.",
            "Ce mécanisme a un nom dans le monde entier : c'est le **conte "
            "en randonnée**, où une même scène se répète en s'agrandissant. "
            "Tu le retrouveras dans « Si Dieu le permet » du recueil précédent "
            "— trois hommes, la même phrase, une seule différence.",
            "Mais regarde la fin : elle est **étiologique**, c'est-à-dire "
            "qu'elle explique l'origine de quelque chose. *« Chacune de ces "
            "paroles devint le cri de chacun de ces animaux. »* Le chant de "
            "l'hyène qui appelle le chien, l'appel du lion qui réclame sa "
            "calebasse : ce que tu entends aujourd'hui dans la brousse, ce "
            "sont, dit le conte, les restes de cette dispute."],
        encadres=[
            ("animal", "Le cri des bêtes, expliqué par une dispute", [
                "Beaucoup de contes africains expliquent les cris des "
                "animaux : ce sont les dernières paroles d'une vieille "
                "querelle, restées coincées dans leur gorge.",
                "C'est joli, et c'est faux — évidemment. Mais essaie une fois "
                "d'écouter une hyène en pensant à ce conte. Tu n'entendras "
                "plus jamais la même chose.",
                "**C'est cela, au fond, que fait la littérature :** elle ne "
                "change pas le monde, elle change ce qu'on entend."]),
            ("culture", "Les langues du livre", [
                "Le conte donne d'abord la chanson dans la langue d'origine "
                "(*« Wourou, na monmi san »*), puis sa traduction française "
                "juste en dessous.",
                "Ce n'est pas une coquetterie. C'est le seul moyen de garder "
                "le **rythme** du chant, qui disparaîtrait dans une traduction "
                "seule.",
                "Essaie de le chanter dans les deux langues. Tu comprendras "
                "pourquoi l'auteur a tenu à les imprimer toutes les deux."])])

    b += lecture_suivie(
        4, "Le puits que l'un creuse et où l'autre se baigne (« Chien et "
           "Singe »)",
        situation=[
            "Cinquième conte de la première partie. Le chien et le singe "
            "habitent le même village et sont fiancés à des jeunes filles d'un "
            "autre village, à une journée de marche.",
            "Un jour de grande chaleur, sur la route, le chien fait une "
            "proposition au singe."],
        texte=_x("Le chien et le singe vivaient dans le même village"),
        source=SRC,
        questions=[
            "Que propose le chien ? Recopie sa proposition.",
            "Que répond le singe ? Recopie sa réponse, et dis ce qu'elle "
            "révèle de lui.",
            "Que fait le singe pendant que le chien creuse ?",
            "Au retour, quel prétexte le singe invente-t-il pour s'éclipser ?",
            "Comment le chien découvre-t-il la vérité ? Décris la scène de la "
            "liane.",
            "La panthère donne raison au singe. Pourquoi ? Recopie la raison "
            "donnée par le texte.",
            "Le bélier, lui, donne raison au chien. Que se passe-t-il alors "
            "entre la panthère et le bélier ?",
            "Chacun envoie un messager. Compare les deux missions et les deux "
            "consignes. Pourquoi l'une réussit-elle et l'autre échoue-t-elle ?"],
        grille_lecture=[
            ("Que le singe refuse l'effort",
             "Sa réponse sur ses habits et sa position à l'ombre"),
            ("Que le jugement dépend du juge",
             "Les deux verdicts opposés, et leurs motifs"),
            ("Que les deux messagers sont mis à la même épreuve",
             "Les deux consignes : « même si tu vois un os » / « ne prête pas "
             "attention aux fruits »"),
            ("Que la fidélité décide de tout",
             "Ce que fait le chien, et ce que fait le singe, en chemin")],
        bilan=[
            "Ce conte contient une leçon de justice terrible : la panthère ne "
            "juge pas les faits, **elle juge selon le clan**. Le singe et elle "
            "sont tous deux des animaux sauvages ; cela suffit.",
            "Puis vient le plus beau : deux messagers reçoivent exactement la "
            "même épreuve — courir sans se laisser distraire. Le chien passe "
            "devant les os. Le singe s'arrête aux fruits.",
            "Le résultat n'est donc pas une question de force : la panthère "
            "est bien plus dangereuse qu'un bélier. **C'est une question de "
            "parole tenue.** Celui qui a été loyal dès le premier jour — en "
            "creusant le puits — l'est encore au dernier.",
            "Retiens la construction : le conte pose une petite injustice au "
            "début (le puits), et la répare à la fin par le même défaut chez "
            "le même personnage. C'est propre comme une démonstration."],
        encadres=[
            ("mot", "Les mots difficiles de la séance", [
                "**Se désaltérer** : boire pour n'avoir plus soif.",
                "**Un combat singulier** : un duel, un contre un.",
                "**Magnanime** : généreux avec un ennemi vaincu.",
                "**Des coups de boutoir** : des coups violents donnés en "
                "chargeant, comme le fait un sanglier.",
                "**La solidarité** : le fait de se soutenir entre gens du même "
                "groupe — ici, pour le pire."]),
            ("perso", "Le chien : le seul animal des deux camps", [
                "Regarde bien : le chien vit **au village**, avec les hommes, "
                "mais il est bel et bien un animal. La panthère et le singe "
                "sont **de la brousse** ; le bélier, comme le chien, est du "
                "village.",
                "Le conte trace donc une frontière : brousse contre village. "
                "Chacun soutient les siens.",
                "Dans le conte « Le miel », c'est encore le chien qui finit "
                "coincé dans la clôture de son maître — à moitié dedans, à "
                "moitié dehors. Cette image le résume : le chien est l'animal "
                "de la frontière."])])

    b += lecture_suivie(
        5, "La mère qui mange ses enfants (« Gnitorni »)",
        situation=[
            "Deuxième partie du recueil : les hommes entre eux. Et le premier "
            "conte est le plus effrayant du livre.",
            "Une vieille femme du village n'a plus qu'une seule dent, longue "
            "et rougie par le tabac. On l'appelle **Gnitorni**, « Dent "
            "pourrie ». Chacun de ses enfants meurt mystérieusement à l'âge où "
            "il commence à parler.",
            "Elle est bel et bien une sorcière — et elle attend que ses "
            "enfants l'appellent « Gnitorni » pour les manger. Puis naît "
            "Ngolo."],
        texte=_x("Personne ne savait son vrai nom"), source=SRC,
        questions=[
            "Que signifie le nom « Gnitorni » ? Pourquoi le village le lui "
            "a-t-il donné ?",
            "Qu'attend la sorcière pour manger ses enfants ? Pourquoi Ngolo "
            "échappe-t-il à cette règle ?",
            "Combien de fois Ngolo obtient-il un délai ? Recopie ses trois "
            "arguments.",
            "Que fait Ngolo avant de fuir ? Auprès de qui va-t-il ?",
            "Quels sont les trois objets magiques, et en quoi se "
            "transforment-ils ? Remplis le tableau ci-dessous.",
            "Recopie la traduction française de la chanson de Gnitorni. "
            "Qu'apprend-elle sur les enfants précédents ?",
            "Comment le conte explique-t-il, à la dernière ligne, le mouvement "
            "de la mer ?"],
        grille_lecture=[
            ("Que Ngolo gagne du temps par la parole",
             "Ses trois répliques qui commencent par « Tu aurais tort »"),
            ("Que la fuite est rythmée par trois obstacles",
             "La brindille, le caillou, la bouteille d'eau"),
            ("Que la chanson raconte l'histoire entière",
             "Les noms des enfants nommés dans le chant"),
            ("Que le conte explique un fait de la nature",
             "La dernière phrase, sur les eaux qui rejettent")],
        bilan=[
            "Ce conte se retrouve, presque identique, sur tous les continents : "
            "on l'appelle **la fuite magique**. Un héros poursuivi jette "
            "derrière lui des objets qui se changent en obstacles — une forêt, "
            "une montagne, une mer.",
            "Ce qui appartient en propre à ce conte-ci, c'est **la façon dont "
            "Ngolo gagne du temps**. Il ne se bat pas, il ne fuit pas tout de "
            "suite : il **négocie**, trois fois, en offrant à sa mère une "
            "meilleure affaire : « Attends que je devienne un homme grand et "
            "musclé », puis « Attends que j'épouse une femme ». La "
            "troisième fois, le conte passe au discours indirect : il "
            "« lui proposa d'attendre qu'ils aient un enfant ».",
            "Autrement dit : il utilise la gourmandise de la sorcière contre "
            "elle-même. C'est exactement ce que fait le lièvre avec l'hyène.",
            "Et la fin est magnifique : la mer, dit le conte, continue "
            "aujourd'hui encore à rejeter tout corps étranger, croyant que "
            "c'est Gnitorni. Le ressac que tu vois sur une plage est, dans ce "
            "livre, une vieille peur qui n'a jamais cessé."],
        encadres=[
            ("culture", "Pourquoi tant de sorcières dans les contes ?", [
                "Parce que le conte sert à **mettre un nom sur ce qui fait "
                "peur**. Autrefois, beaucoup d'enfants mouraient très jeunes, "
                "sans qu'on sache expliquer pourquoi.",
                "Le conte ne guérit personne, mais il donne une forme à "
                "l'angoisse : une vieille femme, une dent, un chant. Et surtout, "
                "il donne un **héros qui s'en sort**.",
                "**Attention.** Ce sont des récits, pas des accusations. "
                "Traiter quelqu'un de sorcier dans la vraie vie a détruit des "
                "familles entières. Le conte se lit ; il ne se pratique pas."]),
            ("jeu", "Le tableau des trois obstacles", [
                "Remplis-le en relisant le conte :",
                "objet jeté → obstacle créé → comment Gnitorni le franchit",
                "1. ……………… → ……………… → ………………",
                "2. ……………… → ……………… → ………………",
                "3. ……………… → ……………… → ………………",
                "Question bonus : pourquoi le **troisième** obstacle "
                "est-il le seul qui tienne ?"])])

    b += lecture_suivie(
        6, "La voix qui chante dans la rivière (« La proscrite et la femme "
           "du roi »)",
        situation=[
            "Deuxième partie, deuxième conte. Dans cette ville, chaque année, "
            "on sacrifie une jeune fille au génie de la rivière ; en échange, "
            "le pays prospère. Les hommes y consentent « avec amertume ».",
            "Il y a aussi une vieille griotte, pauvre, à demi aveugle, à demi "
            "sourde, bossue, lépreuse. Le roi l'a chassée : la ville lui est "
            "interdite.",
            "Cette année-là, le roi a pris une nouvelle épouse. Sept jours "
            "après le mariage, elle va puiser de l'eau avec une coépouse."],
        texte=_x("Dans cette ville, la coutume était de sacrifier"), source=SRC,
        questions=[
            "Quelle est la coutume de cette ville ? Que reçoit-on en échange ?",
            "Fais la liste des infirmités de la vieille griotte. Pourquoi le "
            "roi l'a-t-il chassée, à ton avis ?",
            "Comment la coépouse s'y prend-elle pour faire avancer la jeune "
            "femme dans la rivière ? Recopie ses deux phrases.",
            "Pourquoi la jeune épouse obéit-elle ? Qu'est-ce qui la pousse ?",
            "Que fait la coépouse en rentrant au village ? Que penses-tu de "
            "ce silence ?",
            "Comment la vieille griotte apprend-elle ce qui s'est passé ? "
            "Décris la scène de la gourde.",
            "Pourquoi la griotte hésite-t-elle à parler au roi ? Donne ses "
            "**deux** raisons."],
        grille_lecture=[
            ("Que la coépouse tue par des paroles, non par des gestes",
             "Ses deux phrases sur l'eau que boit le roi"),
            ("Que la proscrite est exclue de tout",
             "L'énumération de ses infirmités et l'interdiction de la ville"),
            ("Que l'eau parle",
             "Le bruit de la gourde, puis le chant qui en sort"),
            ("Que la peur empêche de dire la vérité",
             "Les deux raisons qui retiennent la griotte")],
        bilan=[
            "Un conte bâti sur un renversement : **celle qu'on a chassée est "
            "la seule à pouvoir sauver la reine**. La ville a jeté dehors la "
            "vieille femme inutile ; c'est elle qui détient la nouvelle.",
            "Regarde aussi comment la coépouse tue. Elle ne pousse pas, elle "
            "ne frappe pas. Elle dit deux fois : *« le roi boit l'eau pure qui "
            "coule loin de la berge »*. Et la jeune femme avance toute seule. "
            "**Il n'y a pas de crime plus difficile à prouver.**",
            "Enfin, remarque les deux peurs de la griotte : elle craint Fari, "
            "le génie de l'eau, et elle craint que la coépouse ne la fasse "
            "tuer si son histoire n'est pas crue. La seconde peur est la plus "
            "réaliste — et c'est celle que connaît, aujourd'hui encore, toute "
            "personne qui hésite à dénoncer une injustice."],
        encadres=[
            ("culture", "Qu'est-ce qu'un griot, une griotte ?", [
                "Dans une grande partie de l'Afrique de l'Ouest, le **griot** "
                "est celui qui garde la mémoire : il connaît les généalogies, "
                "chante les louanges, raconte l'histoire des familles et "
                "conseille les rois.",
                "Chasser une griotte, ce n'est donc pas seulement chasser une "
                "pauvresse : **c'est chasser la mémoire de la ville**.",
                "Le conte est plus malin qu'il n'en a l'air : il fait de la "
                "mémoire exclue la seule qui puisse encore sauver quelqu'un."]),
            ("lieu", "Fari, le génie de l'eau", [
                "La rivière n'est pas un décor : c'est un **personnage**. "
                "Elle a un nom, Fari, elle prend, elle garde, et elle laisse "
                "chanter sa prisonnière.",
                "Dans le recueil précédent, une source chantait aussi et "
                "interdisait qu'on y puise. Rapproche les deux : dans les deux "
                "livres, **l'eau parle, et il faut lui répondre**."])])

    b += cote_enseignant([
        "Six séances : le prologue, trois contes de la première partie, deux "
        "de la deuxième. La troisième partie (« Des hommes, des animaux, des "
        "objets ») reste en lecture personnelle et alimente le contrôle.",
        "La fin de « Chien et Singe » comporte une plaisanterie corporelle "
        "(les « deux fruits ») : la lecture en classe s'arrête au passage "
        "retenu, qui n'y va pas.",
        "« Gnitorni » peut impressionner : prévoir un temps de parole après la "
        "lecture, et rappeler explicitement que l'accusation de sorcellerie "
        "dans la vie réelle est une violence, non un jeu.",
        "Le prologue gagne à être lu à deux voix — un élève pour le frère, une "
        "élève pour Korotoumou — la classe jouant les neveux et nièces.",
        "Encourager la collecte demandée dans l'encadré « Fais l'expérience "
        "toi-même » : trente élèves rapportent trente contes, et le recueil de "
        "la classe se constitue tout seul."])
    b.append(saut())
    return b
