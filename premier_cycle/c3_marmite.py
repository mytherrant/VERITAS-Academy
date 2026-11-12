# -*- coding: utf-8 -*-
"""3ᵉ — *La marmite de Koka-Mbala*, Guy Menga.

**Drame en deux actes**, Grand prix du Concours théâtral interafricain 1967,
suivi dans le même volume de *L'oracle*, comédie en trois actes.

Tout ce qui est affirmé ici sort du volume : la page de titre et le prix, la
notice « Auteur », la **Note** liminaire qui expose la loi de Koka-Mbala, la
liste des personnages, les deux actes — et le **Résumé** de l'éditeur, qui
nomme lui-même les sujets : « la domination des vieux sur les jeunes, les
mœurs entourant le mariage et qui défavorisent les jeunes ».
"""
import jeux
import source
from gabarit import (cote_enseignant, epreuve_etude_texte, epreuve_expression,
                     epreuve_orthographe, lecture_suivie, ouvrir, production)
from kit import cases, enc, grille, h1, h2, h3, lignes, num, p, puce, saut

CLE = "marmite"
SRC = ("Guy Menga, *La marmite de Koka-Mbala*, "
       "Nouvelles Éditions Numériques Africaines")
BORNES = ["ACTE I", "ACTE II", "L'oracle", "Note sur la pièce", "Personnages",
          "RIDEAU", "Préliminaires", "Résumé", "Auteur"]


def _x(amorce, mots=680):
    return source.extrait(CLE, amorce, mots=mots, arret=BORNES)


# ============================================================ 1. J'ouvre

def partie1():
    return [h1("Œuvre 2 — La marmite de Koka-Mbala, de Guy Menga")] + ouvrir(
        "La marmite de Koka-Mbala", "Guy Menga",
        questions_couverture=[
            "**Une marmite** dans un titre de pièce de théâtre. À quoi sert "
            "normalement une marmite ? Que peut-elle bien contenir, ici, pour "
            "mériter d'être au centre d'un drame ?",
            "Le sous-titre annonce un **drame**, non une comédie. Quelle "
            "différence attends-tu ?",
            "Cette pièce a reçu le **Grand prix du Concours théâtral "
            "interafricain en 1967**. Cherche : quels pays d'Afrique venaient "
            "d'accéder à l'indépendance dans ces années-là ?",
            "Dans ton entourage, existe-t-il un objet ou un lieu qu'on "
            "**craint** sans savoir exactement pourquoi ? Décris-le en trois "
            "lignes, sans te moquer."],
        promesses=[
            "Qui aura le dernier mot : le roi, son conseiller, ou les jeunes ?",
            "La marmite est-elle vraiment puissante ?",
            "Une loi injuste peut-elle être changée de l'intérieur ?",
            "Une femme aura-t-elle le droit de parler dans cette pièce ?"],
        journal_exemple=["06/10", "Acte I, scènes I et II",
                         "Le roi a rêvé que la marmite se rompait ; un jeune "
                         "est arrêté pour avoir regardé une femme se baigner",
                         "Pourquoi Bobolo veut-il l'exécuter la nuit même ?"])


# ================================================= 2. L'auteur et son livre

def partie2():
    return [
        h2("2. L'auteur et son livre"),
        h3("Guy Menga"),
        p("Le volume le présente lui-même : **Guy Menga**, de son vrai nom "
          "**Bikouta-Menga**, est originaire de **Mankonongo**, « un village "
          "situé au bord de la rivière Foulaki, dans la région sud de la "
          "République populaire du Congo »."),
        p("**Enseignant d'abord**, il devient rapidement journaliste, puis "
          "**directeur des programmes à la Radiodiffusion et Télévision "
          "congolaise**. Il est aussi l'auteur de *La Palabre stérile*, roman "
          "qui reçut le **Grand Prix littéraire de l'Afrique noire en 1969**, "
          "et des *Aventures de Moni-Mambou*."),
        enc("perso", "Ce que l'éditeur dit de ces deux pièces", [
            "« Les deux pièces que nous présentons aujourd'hui sont en fait "
            "les premières productions de Guy Menga et lui ont valu sa "
            "renommée. »",
            "« Combien souvent *La Marmite de Koka-Mbala* n'a-t-elle pas été "
            "jouée en Afrique ? »",
            "Et il nomme les sujets sans détour : *« la domination des vieux "
            "sur les jeunes, les mœurs entourant le mariage et qui "
            "défavorisent les jeunes »*.",
            "**Retiens la formule.** Elle te donne, en une ligne, le "
            "programme de l'année : ce volume parle du droit d'aînesse et de "
            "ce qu'il coûte."]),
        h3("La loi de Koka-Mbala, telle que le livre l'expose"),
        p("Avant la première réplique, une **Note** de l'auteur explique le "
          "monde de la pièce. Elle est indispensable : sans elle, on ne "
          "comprend rien. La voici, résumée fidèlement."),
        grille([["Ce que dit la Note", "Ce qu'il faut en retenir"],
                ["L'action se déroule « dans un des petits royaumes qui "
                 "morcelaient le Kongo », dans la cité de **Koka-Mbala**.",
                 "Un royaume ancien, avant la colonisation."],
                ["« les lois étaient rigides et les juges inflexibles et "
                 "impitoyables ». Il était interdit à tout homme de « lever "
                 "les yeux » sur une femme, et inversement.",
                 "Une loi sur le **regard** : c'est déjà dire jusqu'où va le "
                 "contrôle."],
                ["« Le contrevenant était puni de mort ; il en était de même "
                 "du vol. »",
                 "La peine est unique, et c'est la mort."],
                ["« À Koka-Mbala, cette loi frappait surtout les jeunes "
                 "tandis qu'elle était clémente pour les adultes. »",
                 "**Voilà l'injustice centrale** : ce n'est pas la loi, c'est "
                 "son application."],
                ["Les jeunes étaient « condamnés à être enterrés vivants sur "
                 "la place du marché, dans une fosse hérissée de sagaies ». "
                 "Sur leur tombe on plantait un jeune arbre, le **N'sanda**.",
                 "L'auteur ajoute qu'on voit encore aujourd'hui, dans le sud "
                 "du Congo, « quelques N'sanda solitaires parmi les arbres de "
                 "la brousse »."]]),
        enc("culture", "L'invention de la marmite", [
            "La Note le dit noir sur blanc : sous le règne du roi "
            "**Bintsamou**, le premier Conseiller — qui était **en même temps "
            "le Grand Féticheur du Royaume** — inventa une « marmite à "
            "esprits ».",
            "Et elle donne son usage exact : elle était « destinée à faire "
            "peur à ceux qui hésitaient à prononcer la condamnation à mort » "
            "d'un jeune pris en flagrant délit.",
            "**Lis bien.** La marmite ne sert pas à punir les coupables : "
            "elle sert à terroriser **les juges**. C'est un instrument de "
            "pouvoir déguisé en objet sacré, et l'auteur te le dit avant même "
            "que le rideau se lève."]),
        h3("Les personnages, tels que le livre les présente"),
        grille([["Personnage", "Ce que dit la liste"],
                ["**BINTSAMOU**", "Roi de Koka-Mbala"],
                ["**LEMBA**", "La reine — dans la pièce, « mon épouse "
                 "préférée »"],
                ["**Bobolo**", "Le premier conseiller **et** grand féticheur "
                 "du royaume"],
                ["**BITALA**", "Le jeune délinquant"],
                ["**QUATRE NOTABLES**", "Composant le conseil du royaume"],
                ["**DEUX GARDES**", ""],
                ["**LA VEUVE**", "Témoin"],
                ["**LE DANSEUR**", "Témoin"],
                ["**PLUSIEURS FIGURANTS JEUNES**", ""],
                ["**LA MARMITE**", "« En terre cuite, présentée de façon à "
                 "faire peur : elle est remplie de fétiches »"]]),
        enc("rire", "Un objet dans la liste des personnages", [
            "Relis la dernière ligne du tableau. **La marmite figure dans la "
            "liste des personnages.**",
            "Ce n'est pas une coquetterie d'auteur : c'est une indication de "
            "mise en scène. Sur le plateau, la marmite occupe une place, "
            "attire les regards, fait taire les gens — exactement comme un "
            "acteur.",
            "Quand tu liras la pièce, compte les répliques qui la nomment. Tu "
            "verras qu'elle « parle » plus que certains notables."]),
        saut()]


# =========================================================== 3. Qui est qui

def partie3():
    b = [h2("3. Qui est qui à Koka-Mbala"),
         p("Cinq forces s'affrontent dans cette pièce. Sache les distinguer "
           "dès la première séance : tout le reste en découle."),
         grille([["Qui", "Ce qu'il veut", "Son arme"],
                 ["**Le roi Bintsamou**", "comprendre son rêve, et cesser de "
                  "faire couler le sang des jeunes",
                  "l'autorité — mais il dit lui-même : « Je suis le roi, mais "
                  "je ne suis pas le conseil »"],
                 ["**Lemba**, la reine", "que la parole des femmes compte, et "
                  "que les enfants ne meurent plus",
                  "l'argument. C'est elle qui parle le mieux de toute la "
                  "pièce"],
                 ["**Bobolo**", "conserver son pouvoir sur le conseil et sur "
                  "le roi", "la peur — la marmite, qu'il a lui-même "
                  "fabriquée"],
                 ["**Bitala**", "vivre, et faire cesser l'oppression des "
                  "jeunes", "la franchise, puis le nombre"],
                 ["**Les quatre notables**", "ne pas être les prochains à "
                  "mourir", "le silence, et l'obéissance"]]),
         enc("perso", "La réplique la plus courageuse de la pièce", [
             "Quand Bobolo demande « Depuis quand les femmes se mêlent-elles "
             "des affaires du royaume ? », Lemba ne recule pas :",
             "*« Cet enfant dont tu souhaites la condamnation immédiate "
             "n'est-il pas sorti des entrailles d'une mère ? […] Et toi-même "
             "Bobolo, serais-tu venu d'un tronc de palétuvier ? Alors c'est "
             "nous qui souffrons pour donner ces enfants et c'est vous qui en "
             "disposez à votre aise ? »*",
             "**Note la construction :** trois questions, dont la deuxième "
             "est une insulte polie (un palétuvier est un arbre de "
             "mangrove), et la troisième pose le problème entier. Elle a "
             "gagné le débat en quatre lignes."]),
         enc("culture", "Le N'sanda", [
             "L'auteur précise, dans sa Note, qu'on plantait sur la tombe de "
             "chaque jeune exécuté un arbre nommé **N'sanda** — et qu'on en "
             "voit encore, « solitaires parmi les arbres de la brousse », "
             "dans le sud du Congo.",
             "Un arbre isolé au milieu de la brousse : voilà le monument aux "
             "morts de cette pièce. Il ne porte aucun nom.",
             "**Question à garder pour la fin :** pourquoi l'auteur "
             "a-t-il tenu à préciser que ces arbres existent encore ?"]),
         enc("mot", "Six mots pour lire un drame", [
             "**Un drame** : une pièce sérieuse, où le malheur menace — sans "
             "l'obligation de finir mal, contrairement à la tragédie.",
             "**Un féticheur** : celui qui manie les fétiches et les rites.",
             "**Une fosse hérissée de sagaies** : le trou garni de lances où "
             "l'on enterrait les condamnés vivants.",
             "**Un devin** : celui qui interprète les rêves et les signes.",
             "**Les Mânes** : les esprits des ancêtres morts.",
             "**Le droit d'aînesse** : le privilège accordé aux plus âgés. "
             "C'est le vrai sujet de la pièce ; Bitala le nomme à la dernière "
             "page."])]

    e, c = jeux.relier(
        "Chacun sa force",
        [("Bintsamou", "Il a rêvé du sang, et il n'ose pas encore désobéir à "
                       "son propre conseil"),
         ("Lemba", "Elle parle quand on lui interdit de parler, et elle a "
                   "raison"),
         ("Bobolo", "Il a fabriqué l'objet qui terrorise ceux qui le jugent"),
         ("Bitala", "Il avoue sa faute, et démontre que la loi n'est pas la "
                    "même pour tous"),
         ("Les notables", "Ils approuvent tout, par peur de la fosse"),
         ("La marmite", "Elle est en terre cuite, remplie de fétiches, et "
                        "figure dans la liste des personnages")],
        graine=227)
    b += e
    b.append(saut())
    return b, c


# ======================================================= 4. Lectures suivies

def partie4():
    b = [h2("4. Je lis l'œuvre — six lectures suivies"),
         p("Deux actes, six séances. Distribuez les rôles : un drame se lit à "
           "voix haute, et celui-ci a été écrit par un homme de radio.")]

    b += lecture_suivie(
        1, "Le rêve du roi (acte I, scène I)",
        situation=[
            "Sous la véranda du palais royal. Le roi est assis sur son trône, "
            "Lemba, son épouse préférée, à son côté ; deux gardes. Ils "
            "congédient le musicien.",
            "Le roi n'est pas content — et ce n'est pas un souci ordinaire. "
            "La nuit précédente, il a fait un rêve."],
        texte=_x("Sa majesté ne paraît pas contente"), source=SRC,
        questions=[
            "Comment Lemba obtient-elle que le roi lui parle ? Relève sa "
            "formule — elle est très habile.",
            "Raconte le rêve du roi, étape par étape. Que devient le sang ? "
            "Où entre-t-il ? Que fait la marmite ?",
            "Qu'a répondu le devin ? Recopie sa phrase exacte. Combien de "
            "mots comporte-t-elle ?",
            "Que conseille Lemba au roi ? Relève les deux mots qu'elle "
            "emploie pour dire ce qu'il devrait faire.",
            "« Je suis le roi, mais je ne suis pas le conseil. » Explique "
            "cette phrase. Que révèle-t-elle du pouvoir réel du roi ?",
            "Que répond Lemba ? En quoi sa réponse relance-t-elle le roi ?",
            "Relève les didascalies de cette scène. Combien y en a-t-il ? "
            "Qu'indiquent-elles ?"],
        grille_lecture=[
            ("Que la reine sait s'y prendre",
             "Ses formules de modestie (« une pauvre femme »)"),
            ("Que le rêve est un avertissement",
             "Le vocabulaire du sang et de l'effervescence"),
            ("Que le roi n'est pas tout-puissant",
             "Ce qu'il dit du conseil"),
            ("Que la pièce s'ouvre sur un doute",
             "Les phrases où le roi parle de son trouble")],
        bilan=[
            "Une pièce qui commence par **un cauchemar** et par **une phrase "
            "de devin**. Retiens les deux : ce sont les deux ressorts du "
            "drame.",
            "Le rêve : le sang de tous les jeunes condamnés emplit le palais, "
            "entre dans la marmite sacrée, bouillonne — et **la marmite se "
            "rompt**. Toute la pièce est déjà là, dans un songe : ce qui va "
            "casser, c'est la marmite.",
            "La réponse du devin tient en huit mots : **« nos morts ont assez "
            "du sang de nos enfants »**. Elle renverse tout le système, car "
            "le système reposait justement sur l'idée inverse — que les morts "
            "réclament du sang.",
            "Et note la position du roi : il n'est pas un tyran, il est **un "
            "homme coincé**. « Je suis le roi, mais je ne suis pas le "
            "conseil. » Un chef qui ne peut pas décider seul : c'est de là "
            "que naîtra le drame, et c'est très moderne."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Un songe** : un rêve — mot plus solennel, employé quand le "
                "rêve a un sens.",
                "**L'effervescence** : l'agitation d'un liquide qui bout ou "
                "qui mousse.",
                "**La clémence** : la douceur d'un juge qui pardonne.",
                "**Mander quelqu'un** : le faire venir.",
                "**Un pilier** : ce qui soutient un édifice ; au figuré, "
                "celui sans qui une institution tombe."]),
            ("perso", "Comment Lemba s'y prend pour parler", [
                "Elle ne dit jamais « je pense que ». Elle demande la "
                "permission : *« Mon roi peut-il oublier un instant que je ne "
                "suis qu'une pauvre femme et me faire part de ce problème "
                "grave ? »*",
                "Elle se rabaisse pour obtenir le droit de parler — et, une "
                "fois qu'elle l'a, elle donne le conseil le plus juste de la "
                "scène.",
                "**Ce n'est pas de la soumission : c'est de la stratégie.** "
                "Surveille-la tout au long de la pièce, elle ne procède "
                "jamais autrement."])])

    b += lecture_suivie(
        2, "Un homme a regardé une femme (acte I, scène II)",
        situation=[
            "Le tam-tam des visites bat. Bobolo, premier conseiller et grand "
            "féticheur, entre et se prosterne : deux gardes du service des "
            "renseignements demandent audience.",
            "Ils poussent devant eux un jeune homme, les bras ligotés derrière "
            "le dos, et le jettent aux pieds du roi."],
        texte=_x("Majesté, nous avons surpris ce jeune"), source=SRC,
        questions=[
            "De quoi le jeune homme est-il accusé, exactement ? Recopie "
            "l'accusation des deux gardes.",
            "Qui est la femme concernée ? Pourquoi ce détail est-il capital "
            "pour la suite ?",
            "Que répond le roi aux gardes ? Relève sa question — elle est "
            "ironique. Que reproche-t-il aux gardes ?",
            "Bobolo demande une chose précise, et il donne **deux** raisons. "
            "Recopie-les.",
            "Que répond le roi ? Donne ses deux raisons à lui.",
            "Comment Lemba entre-t-elle dans le débat ? Relève la question de "
            "Bobolo, puis la réponse de Lemba en entier.",
            "Que dit Bobolo sur la façon dont une femme doit être traitée ? "
            "Que lui répond le roi ? Compare les deux répliques."],
        grille_lecture=[
            ("Que la loi est appliquée à sens unique",
             "La remarque du roi sur les gardes qui ont regardé aussi"),
            ("Que Bobolo est pressé",
             "Ses arguments sur la nouvelle lune et sur sa propre épouse"),
            ("Que la reine argumente en trois questions",
             "La réplique sur les entrailles d'une mère et le palétuvier"),
            ("Que le roi commence à résister",
             "Les phrases où il refuse et celles où il protège Lemba")],
        bilan=[
            "La scène qui met le feu aux poudres, et elle tient sur **un "
            "regard**.",
            "Regarde d'abord l'ironie du roi : *« Et vous aussi vous avez "
            "regardé naturellement, n'est-ce pas ? »* Le deuxième garde "
            "bafouille. **En une réplique, le roi vient de démontrer que la "
            "loi n'est pas applicable** : pour constater le délit, il a fallu "
            "le commettre.",
            "Puis Bobolo se démasque à moitié : il veut l'exécution « cette "
            "nuit », parce que c'est **sa propre épouse** qu'on a regardée, "
            "et parce que la nouvelle lune approche. Un juge qui est partie "
            "au procès et qui court après le calendrier : le lecteur a "
            "compris.",
            "Enfin, Lemba parle — et Bobolo réplique par une phrase qui "
            "restera : *« Une femme doit être humiliée devant un homme, "
            "Majesté. »* Le roi répond : *« Cette femme est mon épouse et la "
            "façon dont elle doit être traitée ne concerne que moi. »*",
            "**Ce n'est pas encore l'égalité** — c'est un mari qui revendique "
            "un droit de propriété. Mais c'est le premier refus de la pièce, "
            "et il en appellera d'autres."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Se prosterner** : se coucher à terre en signe de respect.",
                "**Une audience** : le fait d'être reçu par une autorité.",
                "**Un contrevenant** : celui qui enfreint une règle.",
                "**Une inculpation** : l'accusation officielle portée contre "
                "quelqu'un.",
                "**Un palétuvier** : arbre des mangroves, aux racines "
                "aériennes. Lemba s'en sert pour dire à Bobolo qu'il est né "
                "d'une femme, comme tout le monde."]),
            ("rire", "Le comique glacé du deuxième garde", [
                "Le roi demande : « Et vous aussi vous avez regardé "
                "naturellement, n'est-ce pas ? »",
                "Réponse : *« Majesté ?... heu ! … c'est-à-dire… »*",
                "Trois points de suspension, un « heu », et tout le système "
                "s'effondre. **Guy Menga vient de démonter une loi avec une "
                "hésitation.**"])])

    b += lecture_suivie(
        3, "Le roi parle à ses morts (acte I, scène III)",
        situation=[
            "Bobolo est sorti, vexé. Les gardes ont emmené le prisonnier. Le "
            "roi reste seul, pensif.",
            "Il demande alors le vin du sacrifice, congédie ses gardes, et "
            "s'avance **vers le public** pour faire une libation à ses "
            "ancêtres.",
            "C'est le seul moment de la pièce où un personnage est vraiment "
            "seul. Écoute-le."],
        texte=_x("Va me chercher le vin pour le sacrifice"), source=SRC,
        questions=[
            "Que fait le roi avec le vin ? À qui s'adresse-t-il, et comment "
            "se nomme-t-il lui-même ?",
            "Que lui ont laissé ses ancêtres, selon lui ? Relève les trois "
            "compléments qui disent avec quoi il a gouverné.",
            "« Le méchant est châtié, comme il est indiqué, le bon "
            "récompensé, comme l'exige la loi. » Que pense le roi de son "
            "propre règne, jusqu'ici ?",
            "Relève les **quatre questions** qu'il pose ensuite (« Mais quel "
            "est ce nuage sombre… »). Que cherche-t-il à savoir ?",
            "« Mes oreilles de simple humain ne peuvent, hélas, vous "
            "entendre. » Que reconnaît le roi ici ? Et qu'affirme-t-il "
            "malgré tout ?",
            "Il répète la phrase du devin. Puis il pose une question qui "
            "ébranle tout le système. Laquelle ?",
            "Que décide-t-il à la fin de la scène ? Pourquoi n'est-ce pas "
            "encore une décision courageuse ?"],
        grille_lecture=[
            ("Que la libation est un rite précis",
             "Les gestes décrits par les didascalies : le vin, le coin de la "
             "scène, le pot"),
            ("Que le roi se justifie devant ses morts",
             "Les verbes de la fidélité (*perpétuer*, *guider*, *préserver*, "
             "*suivre*)"),
            ("Que le doute s'installe",
             "Les quatre questions, et la place des points d'interrogation"),
            ("Que la foi tient malgré l'absence de preuve",
             "La formule répétée « Je crois »")],
        bilan=[
            "Une des plus belles scènes du théâtre africain, et elle ne "
            "contient aucune action : **un homme parle à des morts qui ne "
            "répondent pas**.",
            "Remarque le mouvement du roi. Il commence par un **bilan** — "
            "j'ai suivi vos traces, le méchant est châtié, le bon récompensé, "
            "« je ne pense pas avoir failli à ma tâche ». Puis quatre "
            "questions : *quel est ce nuage sombre ? cette note discordante ? "
            "cette voix étrange qui vient troubler l'ordre établi ?*",
            "Et il finit sur la seule chose qui lui reste : « Mes oreilles de "
            "simple humain ne peuvent, hélas, vous entendre, ni mes yeux "
            "d'homme aveugle vous voir, **mais je crois et cela suffit**. »",
            "Puis vient la question qui fait basculer la pièce : si nos morts "
            "ont assez du sang de nos enfants, **« Mais la marmite alors ? "
            "Les esprits qui y reposent n'exigeraient-ils donc plus le prix "
            "du sang ? »**",
            "**Le roi vient de mettre en doute la marmite.** Il ne le sait "
            "pas encore, mais son royaume vient de changer."],
        encadres=[
            ("culture", "La libation", [
                "Verser un peu de boisson sur le sol avant de boire, en "
                "s'adressant aux ancêtres : le geste existe dans une grande "
                "partie de l'Afrique, et bien au-delà.",
                "Il dit une conviction simple : **les morts ne sont pas "
                "partis**. Ils écoutent, ils protègent, ils exigent parfois.",
                "Toute la pièce se joue sur ce qu'ils exigent réellement. "
                "Bobolo dit : du sang. Le devin dit : plus de sang. **Aucun "
                "des deux ne peut le prouver**, et c'est le sujet du drame."]),
            ("mot", "Les mots difficiles", [
                "**Perpétuer** : faire durer, continuer.",
                "**Ceindre** : entourer. « Depuis que le collier royal ceint "
                "mon cou » = depuis que je suis roi.",
                "**Châtier** : punir sévèrement.",
                "**Discordant** : qui détonne, qui ne s'accorde pas.",
                "**L'expiation** : le fait de payer pour une faute."])])

    b += lecture_suivie(
        4, "Le banni est revenu (acte II, scène I)",
        situation=[
            "Le roi n'a pas fait exécuter Bitala : il l'a envoyé en exil. "
            "Trois lunes ont passé.",
            "Le roi et ses trois épouses regardent danser les deux meilleurs "
            "danseurs du royaume. Un garde vient parler à l'oreille du roi ; "
            "le visage du roi se trouble. Bobolo entre, « fait un semblant de "
            "révérence », et annonce que le pays est menacé."],
        texte=_x("Majesté, la situation est grave"), source=SRC,
        questions=[
            "Que fait le roi avant que Bobolo ne parle ? Pourquoi congédie-"
            "t-il ses épouses ? Relève la didascalie.",
            "Par quel proverbe Bobolo commence-t-il ? Que veut-il dire, et "
            "de qui parle-t-il ?",
            "Comment Bobolo désigne-t-il Bitala ? Relève l'expression — elle "
            "contient un reproche adressé au roi.",
            "Qui est le témoin ? Comment s'appelle-t-elle et quelle est sa "
            "situation ?",
            "Où et quand a-t-elle vu Bitala ? Était-il accompagné ? Relève sa "
            "comparaison.",
            "Pourquoi n'est-elle pas venue le dire plus tôt ? Relève ses "
            "**deux** raisons. Laquelle te frappe le plus ?",
            "Que conclut Bobolo à propos de la marmite ? Que répond le roi ? "
            "Relève l'échange en entier."],
        grille_lecture=[
            ("Que Bobolo triomphe",
             "Les didascalies sur son sourire et sa révérence"),
            ("Que la parole des femmes est réglementée jusque dans les "
             "horaires",
             "La raison donnée par la veuve pour son silence"),
            ("Que le roi perd son calme",
             "Les didascalies de gestes (se lever, se gratter, s'asseoir)"),
            ("Que la marmite sert d'argument",
             "Ce que Bobolo en tire, et ce que le roi refuse d'en tirer")],
        bilan=[
            "Une scène d'audience, et une leçon de manipulation.",
            "Bobolo n'accuse pas : il **fait accuser**. Il amène une veuve, "
            "il la laisse parler, il attend. Et pendant que le roi s'énerve — "
            "« il se lève, se gratte nerveusement la tête, s'assied de "
            "nouveau, se relève » — la didascalie note en trois mots : "
            "**« Bobolo sourit malicieusement »**.",
            "Puis il place son argument : *« C'est la réponse de la marmite. "
            "Tu ne douteras plus désormais de son contenu. »* Il transforme un "
            "fait divers en preuve surnaturelle. **C'est exactement à quoi "
            "sert la marmite qu'il a fabriquée.**",
            "Mais écoute aussi la veuve. Pourquoi n'a-t-elle rien dit plus "
            "tôt ? « Je rentre toujours tard au village » — et surtout : "
            "**« Il n'est pas permis à une femme de parler au roi ou à son "
            "conseiller à cette heure si tardive. »**",
            "Une loi sur les horaires de parole des femmes vient de retarder "
            "une information d'État. La pièce ne commente pas. Elle n'en a "
            "pas besoin."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**L'ahurissement** : la stupéfaction.",
                "**Sans détour** : franchement, sans tourner autour du pot.",
                "**Une révérence** : une inclinaison respectueuse. « Un "
                "semblant de révérence » = un salut qui n'en est pas un.",
                "**Exécrable** : détestable.",
                "**Le dénouement** : la fin, le moment où l'affaire se "
                "résout."]),
            ("perso", "Nzila, la veuve", [
                "Elle a un nom, une situation (veuve), un champ de manioc, "
                "une santé fragile, et une raison précise de s'être tue.",
                "Guy Menga aurait pu écrire « un témoin ». Il a préféré lui "
                "donner cinq lignes de vie.",
                "**C'est la marque d'un bon dramaturge :** même un rôle de "
                "trois répliques a une biographie. Compare avec « La veuve : "
                "Témoin » dans la liste des personnages — le texte lui a "
                "donné bien plus."])])

    b += lecture_suivie(
        5, "Les jeunes entrent dans le palais (acte II)",
        situation=[
            "Le conseil est réuni autour de la marmite. Bobolo mène les "
            "débats. Le sort de Bitala doit être scellé.",
            "C'est alors que les jeunes du royaume font irruption. Bitala est "
            "avec eux, et il parle."],
        texte=_x("Je m'en doutais. Tout le monde est réuni autour de la "
                 "marmite"), source=SRC,
        questions=[
            "Que constate Bitala en entrant ? Relève sa première phrase.",
            "Que réclament les jeunes ? Relève les deux verbes qu'emploie "
            "Bitala pour dire ce qu'ils veulent.",
            "Quelles sont les **deux conditions** posées ? Recopie-les "
            "exactement.",
            "Comment Bitala justifie-t-il la seconde condition ?",
            "Que dit-il à Bobolo au sujet de la marmite ? Recopie "
            "l'accusation — elle nomme l'inventeur et la fonction de l'objet.",
            "Bitala menace-t-il de violence ? Relève la phrase où il dit ce "
            "qu'il préférerait.",
            "Relève la formule par laquelle il clôt chacune de ses "
            "interventions. Que produit cette répétition ?"],
        grille_lecture=[
            ("Que les jeunes arrivent en position de force",
             "Ce que Bitala dit des gardes"),
            ("Que les revendications sont précises",
             "Les deux conditions, énoncées comme un ultimatum"),
            ("Que Bobolo est démasqué publiquement",
             "Les phrases qui commencent par « Nous savons que »"),
            ("Que Bitala refuse la violence",
             "Les phrases sur le calme et sur ce qui les y obligerait")],
        bilan=[
            "Voici la révolte — et elle est **polie**.",
            "Bitala ne casse rien, ne frappe personne, ne renverse pas le "
            "trône. Il énonce **deux conditions** : que la marmite soit "
            "brisée, et que le Conseil des anciens soit dissous. Puis il "
            "ajoute : *« Nous voudrions que les choses s'arrangent dans le "
            "calme. »*",
            "Et il fait ce que personne n'avait osé faire depuis le lever du "
            "rideau : **il dit tout haut qui a fabriqué la marmite**. *« Nous "
            "savons que c'est toi l'inventeur de ce satanique instrument "
            "destiné à semer le désarroi et la panique dans les cœurs des "
            "conseillers et du roi. »*",
            "Regarde ce que fait cette phrase : elle ne détruit pas la "
            "marmite, elle **l'explique**. Or un objet de terreur qu'on "
            "explique a déjà perdu la moitié de sa force.",
            "Retiens la leçon, elle vaut au-delà de la pièce : **on ne casse "
            "pas la peur, on la démonte.**"],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Conspirer** : comploter en secret.",
                "**Une brimade** : une vexation, une humiliation infligée "
                "systématiquement.",
                "**Intégré** : admis, incorporé dans un ensemble.",
                "**Satanique** : diabolique.",
                "**Le désarroi** : le trouble profond de celui qui ne sait "
                "plus quoi faire."]),
            ("perso", "Ce que Bitala avait déjà dit à l'acte I", [
                "Arrêté, à genoux, il n'avait pas nié : *« Oui Majesté, j'ai "
                "contemplé la jeune épouse de l'honorable conseiller alors "
                "qu'elle se baignait. »*",
                "Puis il avait ajouté l'argument qui a sauvé sa vie : le "
                "garde qui l'a arrêté *« n'est-il pas resté un bon moment à "
                "regarder, lui aussi ? »* — mais lui est garde de Sa Majesté, "
                "et Bitala « un simple citoyen ». « La loi ne le concerne pas "
                "tandis qu'elle existe pour moi. »",
                "**Il a avoué la faute et démontré l'injustice dans la même "
                "réplique.** C'est pour cela que le roi l'épargne — et c'est "
                "pour cela qu'il revient."])])

    b += lecture_suivie(
        6, "« Brise cette marmite » (acte II, dénouement)",
        situation=[
            "Bobolo tente une dernière fois d'imposer la terreur : il saisit "
            "la marmite et met les notables au défi.",
            "Personne ne bouge. La peur les cloue tous sur place. C'est le "
            "moment que choisit le roi."],
        texte=_x("Alors qui ? (Il regarde chacun des conseillers"), source=SRC,
        questions=[
            "Que reproche Bobolo aux notables et au roi lui-même ? Recopie sa "
            "phrase sur la peur.",
            "Quel ordre le roi donne-t-il aux gardes ? Et à Bitala ? Recopie "
            "les deux ordres.",
            "Que se passe-t-il quand la marmite est brisée ? Relève la "
            "didascalie, puis la malédiction de Bobolo.",
            "Que dit Bitala aux notables juste après ? Relève la phrase où il "
            "les appelle encore « nos pères ».",
            "Le roi explique pourquoi il avait épargné Bitala. À qui "
            "attribue-t-il une part de sa victoire ? Recopie le passage.",
            "Recopie la phrase du roi sur la jeunesse et sur la femme. Quelle "
            "est la seconde libération qu'il annonce ?",
            "Quelles décisions le roi prend-il pour le Conseil ? Que propose-"
            "t-il pour le suivant ?",
            "Recopie le proverbe par lequel Bitala termine la pièce. "
            "Explique-le : que veut-il rassurer chez les anciens ?"],
        grille_lecture=[
            ("Que la peur paralyse tout le monde",
             "Ce que Bobolo constate, et ce que font les notables"),
            ("Que le roi tranche enfin",
             "Ses deux ordres, l'un après l'autre"),
            ("Que la révolte se veut sans vengeance",
             "Les paroles de Bitala aux notables"),
            ("Que la victoire est partagée",
             "Ce que le roi dit de Lemba et des Mânes")],
        bilan=[
            "Le dénouement d'un drame, et il est **généreux** — ce qui est "
            "rare.",
            "D'abord le geste : le roi ordonne, et **Bitala casse la marmite "
            "avec le manche de sa lance**. Cris d'épouvante, panique chez les "
            "notables — et rien. Rien ne se produit. L'objet n'était qu'un "
            "objet.",
            "Puis Bitala fait ce qu'aucun vainqueur ne fait d'ordinaire : il "
            "rassure. *« Vous demeurez nos pères même si vous nous avez "
            "reniés pour sauvegarder vos intérêts. »*",
            "Le roi, lui, prononce la phrase la plus importante de la pièce, "
            "et elle regarde vers l'avenir : *« Aujourd'hui c'est la jeunesse "
            "qui se libère du joug de l'oppression des anciens, demain il "
            "faudra que cette même jeunesse puisse aider la femme à briser la "
            "gangue où notre société se complaît à la maintenir "
            "prisonnière. »*",
            "**Deux libérations, dans l'ordre.** Et il n'oublie pas de dire "
            "à qui il doit la sienne : *« Je dois en partie cette victoire à "
            "mon épouse préférée, Lemba. »*",
            "Enfin, Bitala referme la pièce par un proverbe qui limite sa "
            "propre victoire : **« Quelle que soit leur grandeur, les "
            "oreilles ne dépassent jamais la tête. »** Les jeunes sont "
            "libres, mais l'autorité des pères, « parce que naturelle et "
            "raisonnable, demeure immuable ». Une révolution qui s'arrête "
            "elle-même : voilà pourquoi ce texte est un drame et non une "
            "tragédie."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Le joug** : la pièce de bois qu'on met sur le cou des "
                "bœufs ; au figuré, l'oppression.",
                "**Une gangue** : l'enveloppe de terre qui emprisonne un "
                "minerai. Le roi l'emploie pour la condition des femmes.",
                "**L'ivraie** : une mauvaise herbe des champs de blé ; "
                "l'image vient de l'Évangile.",
                "**Dissoudre** (un conseil) : le supprimer officiellement.",
                "**Immuable** : qui ne change pas."]),
            ("jeu", "Le débat que la pièce vous laisse", [
                "Le roi promet **deux** libérations : celle des jeunes, "
                "aujourd'hui ; celle des femmes, demain.",
                "Bitala, lui, s'empresse de rassurer les anciens : l'autorité "
                "des pères « demeure immuable ».",
                "**Question :** une révolte qui se limite elle-même est-elle "
                "une sagesse ou une timidité ?",
                "Note ta réponse ici, en trois lignes, et relis-la après le "
                "débat de fin d'année : ……………………………………………"])])

    b += cote_enseignant([
        "Six séances : trois sur l'acte I, trois sur l'acte II. *L'oracle*, "
        "la comédie qui suit dans le même volume, reste en lecture "
        "personnelle et sert de support à l'épreuve d'étude de texte.",
        "Distribuer les rôles dès la première séance et faire lire à voix "
        "haute : l'auteur a été directeur des programmes d'une radio, et le "
        "texte est écrit pour l'oreille.",
        "La **Note** liminaire de l'auteur (la loi de Koka-Mbala, la fosse "
        "aux sagaies, l'arbre N'sanda, l'invention de la marmite) doit être "
        "lue et travaillée **avant** l'acte I : elle contient la clé de tout "
        "le drame, et les élèves la sautent spontanément.",
        "Le délit initial — un jeune homme qui regarde une femme se baigner — "
        "s'examine comme un fait juridique de la pièce : la question posée "
        "par le texte n'est pas celle du regard, mais celle de **l'inégalité "
        "d'application de la loi** (le garde a regardé aussi). Conduire la "
        "discussion sur ce point.",
        "La pièce se prête à une mise en voix intégrale de l'acte II, "
        "chœur des jeunes compris. Le bris de la marmite peut être mimé : "
        "l'effet sur la classe vaut une leçon entière sur le pouvoir des "
        "symboles."])
    b.append(saut())
    return b
