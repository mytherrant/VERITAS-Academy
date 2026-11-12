# -*- coding: utf-8 -*-
"""5ᵉ — *Père inconnu*, Pabé Mongo.

Un récit à la **première personne** : une fille raconte son enfance dans un
quartier de l'Est du Cameroun, entre une mère seule, deux hommes qu'on lui
fait appeler « papa », et un père qu'elle ne connaîtra qu'un jour.

Le livre porte, dès sa page de garde, une dédicace qui dit son projet :
**« Les enfants délaissés · Les futurs papas · Les futures mamans. »** Ce
n'est donc pas un roman d'aventures : c'est un avertissement, écrit du point
de vue de celle qui paie.

⚠ Les onze chapitres ne se traitent pas tous en classe. Les six lectures
suivies s'arrêtent au chapitre X ; la fin du livre est présentée à l'élève
sans détail, et la manière de la conduire est indiquée dans la note
« Côté enseignant ».
"""
import jeux
import source
from gabarit import cote_enseignant, lecture_suivie, ouvrir
from kit import cases, enc, grille, h1, h2, h3, lignes, num, p, puce, saut

CLE = "pereinconnu"
SRC = "Pabé Mongo, *Père inconnu*"


def _x(amorce, mots=620):
    return source.extrait(CLE, amorce, mots=mots)


# ============================================================ 1. J'ouvre

def partie1():
    return [h1("Œuvre 3 — Père inconnu, de Pabé Mongo")] + ouvrir(
        "Père inconnu", "Pabé Mongo",
        questions_couverture=[
            "**Père inconnu.** Où as-tu déjà lu ou entendu ces deux mots "
            "ensemble ? (Indice : sur un papier officiel.)",
            "Le livre est dédié à trois groupes de personnes : *les enfants "
            "délaissés · les futurs papas · les futures mamans*. À ton avis, "
            "pourquoi ces trois-là, et dans cet ordre ?",
            "Un livre peut-il servir d'avertissement ? Cite un proverbe de "
            "chez toi qui avertit.",
            "Selon toi, qu'est-ce qu'un père **fait**, exactement ? Écris "
            "trois choses. On y reviendra à la fin."],
        promesses=[
            "L'enfant qui raconte est-il un garçon ou une fille ? Comment le "
            "sauras-tu ?",
            "Retrouvera-t-elle son père ?",
            "Le livre finira-t-il bien ?",
            "Qui est responsable du malheur de cette enfant ?"],
        journal_exemple=["06/04", "Chapitres I et II",
                         "Elle a deux « pères » à la maison et aucun ne "
                         "l'accompagne à l'école",
                         "Pourquoi sa mère ne lui explique-t-elle rien ?"])


# ================================================= 2. L'auteur et son livre

def partie2():
    return [
        h2("2. L'auteur et son livre"),
        h3("Pabé Mongo"),
        p("Pabé Mongo est un écrivain camerounais, auteur de nombreux récits "
          "destinés à la jeunesse — parmi lesquels *L'Homme de la rue*. Il "
          "écrit des histoires qui se passent ici, avec des enfants d'ici, et "
          "qui ne se terminent pas toujours comme on voudrait."),
        enc("perso", "La dédicace est le mode d'emploi du livre", [
            "Avant le premier mot du récit, l'auteur écrit à qui il "
            "s'adresse : **les enfants délaissés**, **les futurs papas**, "
            "**les futures mamans**.",
            "Autrement dit : il parle à ceux qui souffrent — et à ceux qui, "
            "dans dix ou quinze ans, seront **de l'autre côté**.",
            "Ce livre n'accuse donc personne en particulier. Il te dit : "
            "*voici ce que cela fait à une enfant ; souviens-t'en quand ce "
            "sera ton tour d'être adulte.*"]),
        h3("Un récit à la première personne"),
        p("Tout le livre est écrit avec le mot **je**. Celle qui parle est une "
          "**fille**, et elle raconte, des années plus tard, son enfance et "
          "son adolescence."),
        grille([["Ce que le « je » permet", "Ce que le « je » interdit"],
                ["On entre directement dans le cœur de l'enfant : ses "
                 "peurs, ses espoirs, ses raisonnements d'enfant.",
                 "On ne sait **que** ce qu'elle sait. Bien des choses restent "
                 "obscures pour nous parce qu'elles le sont pour elle."],
                ["Le lecteur ne peut pas la juger de haut : il voit par ses "
                 "yeux.",
                 "On n'a jamais la version de la mère, ni celle des deux "
                 "« pères »."],
                ["Chaque humiliation est racontée de l'intérieur, ce qui la "
                 "rend impossible à minimiser.",
                 "Il faut **deviner** ce que les adultes se disent : le récit "
                 "ne nous le livre pas."]]),
        enc("astuce", "Le réflexe du bon lecteur de ce livre", [
            "Chaque fois qu'un adulte se met en colère sans expliquer "
            "pourquoi, **arrête-toi et demande-toi ce qu'il n'a pas dit**.",
            "La narratrice, elle, est trop jeune pour comprendre. Toi, tu es "
            "en cinquième : tu comprends. C'est cette différence qui rend le "
            "livre bouleversant.",
            "Exemple : quand elle demande à son « père interne » de "
            "l'accompagner à l'école, il hurle, puis ramasse un bambou. "
            "Elle croit avoir mal parlé. Toi, tu as déjà compris."]),
        h3("Les lieux et les gens"),
        grille([["Nom", "Ce que c'est"],
                ["**NKA**", "la ville où vit la narratrice avec sa mère"],
                ["**Bertoua**", "la grande ville voisine, où habite la tante "
                 "Xavérie et où se trouve le collège"],
                ["**Dimako**", "la localité où travaille son père"],
                ["**la SFID**", "l'entreprise forestière où il est employé ; "
                 "le samedi y est jour de repos"],
                ["**le Collège Teerenstra**", "le collège de jeunes filles, "
                 "tenu par des Sœurs, à Bertoua. Teerenstra était le nom du "
                 "premier évêque du diocèse de Doumé"],
                ["**le bosquet hanté**", "le bois qui sépare le quartier de la "
                 "ville. Des fées y enlèvent, dit-on, les enfants isolés — "
                 "c'est pourquoi les parents accompagnent leurs enfants"]]),
        grille([["Personnage", "Qui c'est"],
                ["**la narratrice**", "une fille, calme, serviable, "
                 "souriante — au début du livre"],
                ["**Frérot**", "son petit frère, « un marmot rond et dodu », "
                 "deux ans de moins"],
                ["**sa mère**", "une femme corpulente, « d'une taille "
                 "d'homme », qui deviendra employée à l'hôpital"],
                ["**le père interne**", "l'homme qui vit dans la maison, "
                 "qu'on lui fait appeler papa. Il ne s'occupe pas d'eux"],
                ["**le père externe**", "un Ngrafi qui tient boutique au "
                 "centre de la ville ; c'est **le père de Frérot**"],
                ["**ZIBI**", "un camarade de maternelle. Une phrase de lui "
                 "change la vie de la narratrice"],
                ["**Xavérie**", "sa tante, à Bertoua : la seule adulte qui la "
                 "reçoive avec joie"],
                ["**son père**", "il travaille à la SFID, à Dimako. Elle le "
                 "verra pour la première fois au chapitre V"]]),
        enc("mot", "Deux expressions inventées par la narratrice", [
            "**Le père interne** et **le père externe** : ces mots ne sont pas "
            "du français ordinaire. C'est **elle** qui les fabrique, faute de "
            "mieux, pour distinguer celui qui dort dans la case de celui qui "
            "vient dîner.",
            "Le livre le dit : *« Le père externe, si je puis ainsi le "
            "nommer… »*",
            "Quand un enfant doit **inventer des mots** pour désigner sa "
            "propre famille, c'est que quelque chose ne va pas. Voilà tout le "
            "livre en une remarque de vocabulaire."]),
        saut()]


# =========================================================== 3. Qui est qui

def partie3():
    b = [h2("3. Le monde vu à hauteur d'enfant"),
         p("Ce livre a une particularité : **on n'y voit rien que par les "
           "yeux d'une petite fille**. Les adultes y sont donc décrits par ce "
           "qu'ils font et par ce qu'ils mangent, jamais par ce qu'ils "
           "pensent."),
         h3("Les deux « pères », vus par elle"),
         grille([["", "Le père interne", "Le père externe"],
                 ["Où il dort", "dans la case, sur le deuxième lit",
                  "dans un réduit derrière sa boutique"],
                 ["Ce qu'il fait", "rien ; il « fainéantise » dans la cour, "
                  "une pipe entre les dents", "il tient boutique : des "
                  "allumettes aux chaussures"],
                 ["Sa langue", "il parle la langue du pays",
                  "c'est un **Ngrafi** — il vient d'ailleurs"],
                 ["Comment il traite les enfants",
                  "il bat la narratrice ; il ne s'occupe pas d'eux",
                  "il est affable, mais il a un **penchant pour Frérot** : "
                  "les plus beaux cadeaux, les genoux, l'inquiétude quand il "
                  "est malade"],
                 ["La fin", "il se bâtit une case et rompt tout contact",
                  "il part « en vacances », revient avec une femme, se bâtit "
                  "une case — et oublie"]]),
         enc("perso", "Le détail que l'enfant remarque et ne comprend pas", [
             "Elle observe que le père externe préfère Frérot, et elle cherche "
             "pourquoi : *« peut-être parce que ce dernier était un garçon ? "
             "Ou parce qu'il était plus petit que moi ? »*",
             "Puis elle note une chose en passant : elle leur trouve, « un "
             "vague air de ressemblance, ne serait-ce que dans cette façon "
             "d'être boudiné par le ventre ».",
             "**Elle a compris sans comprendre.** Toi, tu as compris tout "
             "court : le père externe est le père de Frérot, et pas le sien. "
             "Le tribunal le confirmera au chapitre suivant.",
             "Retiens ce procédé : un narrateur enfant **voit tout et "
             "n'explique rien**. C'est au lecteur de faire le reste."]),
         enc("culture", "Ce que dit le livre sur l'école d'alors", [
             "On y apprend la **leçon de choses** : « la poule a deux pattes, "
             "le chien en a quatre, le serpent rien du tout, il se traîne par "
             "le ventre, tandis que l'iule en a mille ! »",
             "On y passe le **CEPE** (Certificat d'études primaires "
             "élémentaires) ; on va au cours préparatoire, au cours moyen "
             "première année…",
             "Et l'on écrit sur une **ardoise**, avec des **morceaux de "
             "craie** et des **bâtonnets pour le calcul** — tout cela tient "
             "dans le cartable de Frérot, que la narratrice appelle « un "
             "véritable coffre-fort »."]),
         enc("mot", "Le mot qui blesse, et pourquoi il blesse", [
             "Deux phrases, dans ce livre, font plus de mal que toutes les "
             "bastonnades : **« Ce n'est pas ton père ! »** et **« Tais-toi, "
             "enfant sans père ! »**",
             "La narratrice explique elle-même l'effet : *« Cette phrase avait "
             "l'art de me terrasser. Même une fille que je battais pouvait "
             "facilement renverser la situation. »*",
             "**Une leçon à emporter hors du livre.** Une insulte qui vise ce "
             "que quelqu'un ne peut pas changer — sa famille, son corps, son "
             "argent — n'est pas une moquerie : c'est une blessure. Ce livre "
             "existe pour que tu le saches."])]

    e, c = jeux.relier(
        "Qui est qui dans sa vie",
        [("Le père interne", "Il fainéantise dans la cour, pipe aux dents, et "
                             "ne s'occupe pas d'eux"),
         ("Le père externe", "Il tient boutique et préfère visiblement Frérot"),
         ("Frérot", "Son petit frère, qui s'en fiche pas mal et respire "
                    "l'opulence"),
         ("Sa mère", "Elle porte tout, pleure en silence, et entre à l'hôpital"),
         ("ZIBI", "Un camarade de maternelle, et une phrase qui terrasse"),
         ("Xavérie", "Sa tante de Bertoua, la seule qui l'accueille avec joie"),
         ("Son père", "Il travaille à la SFID, à Dimako, et arrive au "
                      "chapitre V")],
        graine=137)
    b += e
    b.append(saut())
    return b, c


# ======================================================= 4. Lectures suivies

def partie4():
    b = [h2("4. Je lis l'œuvre — six lectures suivies"),
         p("Six séances, du premier chapitre au dixième. Attention : ce livre "
           "est un **récit continu**, non un recueil ; certains passages "
           "traversent une frontière de chapitre, ce qui ne gêne en rien la "
           "lecture — c'est la même voix qui parle du début à la fin.")]

    b += lecture_suivie(
        1, "Une case, et pas de maison principale (chapitre I)",
        situation=[
            "Le livre s'ouvre sur une phrase qui donne le ton : *« Être un "
            "enfant sans père, il n'y a pas douleur plus profonde, désarroi "
            "plus grand, tristesse plus corrosive. »*",
            "Puis la narratrice remonte à ses quatre ans : une petite fille "
            "calme, serviable, souriante, jolie. Un petit frère de deux ans. "
            "Une mère corpulente, « d'une taille d'homme ».",
            "Et elle décrit sa maison. Lis bien cette description : c'est un "
            "plan de logement, et c'est aussi un diagnostic."],
        texte=_x("Nous habitions une case située sur la deuxième rangée"),
        source=SRC,
        questions=[
            "Que dit exactement le texte de leur case ? Pourquoi la "
            "narratrice précise-t-elle « c'était donc une cuisine » ?",
            "Fais le plan de l'intérieur : que trouve-t-on à droite ? "
            "Comment la chambre est-elle délimitée ?",
            "Qu'est-ce qu'une « maison principale », dans ce quartier ? "
            "Pourquoi la narratrice tient-elle tant à en avoir une ?",
            "Qu'est-il arrivé à la narratrice le jour où elle a posé la "
            "question à sa mère ? Relève la réponse qu'elle a reçue.",
            "Relève trois détails matériels très concrets (le matelas, "
            "l'étagère, les bancs…). Quelle impression donnent-ils ?",
            "Comment appelle-t-elle sa famille ? Recopie l'expression. Que "
            "veut-elle dire par là ?"],
        grille_lecture=[
            ("Que la pauvreté est dite par des objets",
             "Les noms de meubles et de matériaux (paille, pagne, bancs "
             "épars)"),
            ("Que la maison est incomplète",
             "Ce que le texte dit de la « maison principale »"),
            ("Que l'enfant compare avec les voisins",
             "Les passages où elle parle des autres cases du quartier"),
            ("Que la question est interdite",
             "Ce qui arrive quand elle la pose")],
        bilan=[
            "Une description d'habitation, et un livre entier déjà contenu "
            "dedans. Ils vivent **dans la cuisine** : la maison principale, "
            "celle où l'on reçoit, celle qu'un père bâtirait, n'existe pas.",
            "Et lorsque l'enfant demande pourquoi, elle est **battue**. "
            "Retiens cet enchaînement, il revient tout le long du livre : "
            "*une question → une gifle*. Ce n'est pas de la méchanceté "
            "gratuite : c'est une mère qui n'a pas de réponse.",
            "Remarque enfin le mot qu'elle emploie pour eux trois : « notre "
            "trinité ». Un mot de catéchisme, appliqué à sa mère, son frère "
            "et elle. C'est joli et c'est terrible : elle nomme sa famille "
            "avec le seul vocabulaire qu'on lui a donné."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Une concession** : l'ensemble des cases et de la cour "
                "d'une famille.",
                "**Un marmot** : un petit enfant (familier).",
                "**Corpulent** : gros, de forte taille.",
                "**Épars** : dispersés, çà et là.",
                "**Le désarroi** : le trouble profond de celui qui ne sait "
                "plus quoi faire."])])

    b += lecture_suivie(
        2, "Deux papas, deux langues (chapitre I)",
        situation=[
            "Ils sont trois dans la case — la mère, Frérot et elle — et deux "
            "hommes tournent autour. La narratrice les distingue avec des mots "
            "qu'elle invente : **le père interne** et **le père externe**.",
            "Elle a quatre ans. Elle ne comprend pas ce qu'elle décrit. Toi, "
            "si."],
        texte=_x("Ce monsieur, qu'on me faisait appeler papa"), source=SRC,
        questions=[
            "Recopie la phrase où la narratrice **invente** l'expression "
            "« père externe ». Pourquoi doit-elle inventer un mot ?",
            "Quels reproches fait-elle au père interne ? Relève l'expression "
            "sur ses manières.",
            "Quelle est « la différence la plus marquée » entre les deux "
            "papas ? Recopie la réponse du texte.",
            "Où dort chacun des deux ? Que révèle cette information sur leur "
            "place dans la maison ?",
            "Que se passe-t-il le jour où elle demande au père interne de "
            "l'accompagner à l'école ? Décris la scène en trois étapes.",
            "Pourquoi le père interne se met-il d'abord en colère, puis "
            "adoucit-il son regard, puis ramasse-t-il un bambou ? Fais des "
            "hypothèses — le texte ne l'explique pas.",
            "Qui arrive et empêche la bastonnade ? Que dit alors le père ? "
            "Est-ce la vérité ?"],
        grille_lecture=[
            ("Que la narratrice classe les adultes",
             "Les mots qu'elle fabrique (**interne**, **externe**)"),
            ("Qu'elle observe sans juger",
             "Les verbes de perception (*je remarquais*, *je trouvais*, "
             "*il me semblait*)"),
            ("Que le père interne ment",
             "Sa réponse à la mère, comparée à ce qui vient de se passer"),
            ("Que l'enfant s'accuse elle-même",
             "Les questions qu'elle se pose sur son propre sort")],
        bilan=[
            "Voici la scène-clé du livre, et elle tient en dix lignes. Une "
            "petite fille de cinq ans demande à un homme de l'accompagner à "
            "l'école. Il hurle. Il se calme. Il ramasse un bambou. La mère "
            "arrive. Il dit : **« Elle ne veut pas aller à l'école. »**",
            "Un mensonge de quatre mots, et l'enfant est punie deux fois : "
            "par le bambou évité et par la calomnie.",
            "Puis elle fait ce que font tous les enfants dans cette situation "
            "— elle **cherche ce qu'elle a fait de mal** : « Quelle espèce "
            "d'enfant étais-je donc ? Quel était mon sort ? »",
            "L'auteur ajoute alors la phrase la plus juste du livre : à cinq "
            "ans, ce n'était pas encore le désir d'un père qui la tourmentait, "
            "*« mais plutôt la recherche d'une présence virile »*. S'il y avait "
            "eu **un homme, n'importe lequel**, qui se conduisît en papa, la "
            "découverte plus tard ne l'aurait pas tant blessée."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Un pique-assiette** : celui qui s'invite pour manger chez "
                "les autres.",
                "**Affable** : aimable, accueillant.",
                "**Ingénue** : innocente, sans arrière-pensée.",
                "**Darder un regard** : lancer un regard perçant.",
                "**Une méprise** : une erreur, un malentendu."]),
            ("perso", "Un mot que le livre emploie pour lui-même", [
                "La narratrice écrit : le père interne était « ce gros "
                "mollusque ».",
                "Un **mollusque** est un animal sans squelette : une limace, "
                "un escargot. Autrement dit : **un homme sans colonne "
                "vertébrale**.",
                "Elle avait quatre ans quand la scène s'est passée, mais c'est "
                "l'adulte qui écrit. Une insulte trouvée vingt ans plus tard "
                "et gardée pour l'occasion : cela s'appelle une rancune bien "
                "conservée."])])

    b += lecture_suivie(
        3, "« Ce n'est pas ton père ! » (chapitre II)",
        situation=[
            "À cinq ans, elle entre à l'école maternelle de la Mission "
            "Catholique, à plus d'un kilomètre de la concession. Pour y aller, "
            "il faut traverser **le bosquet hanté** : les parents accompagnent "
            "donc leurs enfants.",
            "C'est là qu'elle remarque une chose. Une seule. Et sa vie change."],
        texte=_x("A cinq ans, je fus inscrite à l'école maternelle"), source=SRC,
        questions=[
            "Pourquoi les parents accompagnent-ils leurs enfants ? Que "
            "raconte-t-on du ruisseau ?",
            "Quelle différence la narratrice constate-t-elle dès les premiers "
            "jours ? Recopie sa phrase.",
            "Quelles conséquences cette découverte a-t-elle sur son corps ? "
            "Relève deux signes.",
            "Que concluent ses deux pères ? Recopie la phrase du père interne. "
            "Que penses-tu de ce diagnostic ?",
            "Selon elle, qu'y avait-il « de grandiose, de solennel et "
            "d'imposant » à être accompagné par son père ? Et comment "
            "termine-t-elle la phrase, à propos de sa mère ?",
            "Que fait-elle à six ans, à la sortie de midi ? Que lui répond "
            "ZIBI ? Recopie ses mots exacts.",
            "Quel raisonnement l'enfant tire-t-elle de la réaction de ZIBI ? "
            "Le trouves-tu logique ?"],
        grille_lecture=[
            ("Que la comparaison avec les autres fait le malheur",
             "Les mots de la différence et de la singularité"),
            ("Que le chagrin se voit dans le corps",
             "La tristesse, la nourriture boudée, les larmes"),
            ("Que les adultes se trompent de diagnostic",
             "Ce qu'ils concluent, et ce qui est vrai"),
            ("Que l'enfant raisonne en enfant",
             "Le mot « donc » et les preuves qu'elle se donne")],
        bilan=[
            "Regarde comment l'auteur construit ce chapitre : **une "
            "observation minuscule** — tous les autres arrivent avec leur "
            "père, moi avec ma mère — et de là une année de tristesse.",
            "Puis la scène de ZIBI. Elle attrape le bras du père d'un "
            "camarade, parce qu'elle a « tellement envie de tenir un bras de "
            "père ». Et le camarade la chasse **« comme on chasse une petite "
            "chienne »**.",
            "L'enfant en tire alors un raisonnement parfaitement logique et "
            "parfaitement faux : *puisque ZIBI défend son père, un père est "
            "sacré ; puisque aucun homme ne m'accompagne, je n'ai pas de père.* "
            "Elle appelle cela « une raison d'enfant, peut-être, mais dont la "
            "certitude était inébranlable ».",
            "**C'est cela qu'un adulte ne devine jamais :** un enfant tire des "
            "conclusions définitives à partir de trois faits. Et personne ne "
            "vient les corriger."],
        encadres=[
            ("culture", "Le bosquet hanté : à quoi servent les fées", [
                "On dit que des fées habitent sous l'eau du ruisseau et "
                "enlèvent les enfants isolés qui s'aventurent par là.",
                "Résultat pratique : **les parents accompagnent leurs enfants "
                "à l'école**. La peur des fées fait exactement ce que fait un "
                "panneau de sécurité routière.",
                "Et c'est cette coutume protectrice qui, par ricochet, révèle "
                "à la narratrice ce qui lui manque. Une croyance faite pour "
                "protéger les enfants blesse celle qui n'a personne."]),
            ("rire", "Un seul rire, et il fait mal", [
                "Elle rêve d'être **battue par un père dans la cour de "
                "l'école**, comme Kolondo qui avait sali son tablier : *« Je "
                "voulais la bastonnade d'un père, dans la cour de l'école. »*",
                "Elle précise : son père interne la battait, « mais je sentais "
                "que ce n'était pas la même chose ».",
                "On sourit, et puis on s'arrête net. Une enfant qui envie une "
                "correction publique parce qu'elle prouverait qu'on lui "
                "appartient : voilà ce que ce livre trouve à dire, et aucun "
                "discours ne le dirait mieux."])])

    b += lecture_suivie(
        4, "Le tribunal, et le départ de Frérot (chapitre IV)",
        situation=[
            "Le père interne s'est bâti une case et y a fait venir une femme ; "
            "il a rompu tout contact. Puis le père externe disparaît « en "
            "vacances », revient avec une femme, se bâtit une case, et les "
            "oublie.",
            "La mère s'effondre. Il y a des démarches, des transactions. Puis "
            "on parle de tribunal. Cela dure trois mois."],
        texte=_x("Quand j'entrai au cours préparatoire"), source=SRC,
        questions=[
            "Que fait le père externe à la rentrée du premier trimestre ? "
            "Comment la mère explique-t-elle son absence, et combien de temps "
            "cela dure-t-il en réalité ?",
            "Relève les signes de l'effondrement de la mère. Combien en "
            "comptes-tu ?",
            "Quel est le verdict ? Où Frérot doit-il vivre désormais ?",
            "« Il a été reconnu par son père. » Que comprend la narratrice de "
            "cette phrase ? Et toi ?",
            "Que dit le visiteur à la mère ? Recopie sa phrase. Quelle "
            "question la narratrice se pose-t-elle alors ?",
            "Comment sa vie change-t-elle après l'embauche de sa mère à "
            "l'hôpital ? Relève l'expression qu'elle emploie pour décrire "
            "leur nouvelle vie à deux.",
            "Décris le cartable de Frérot. Que prouve cette liste, mise en "
            "face de la case de la narratrice ?"],
        grille_lecture=[
            ("Que l'enfant assiste sans comprendre",
             "Les phrases sur ce qu'elle entend « sans que cela lui soit "
             "destiné »"),
            ("Que la mère perd tout",
             "L'énumération des choses qu'elle perd (appétit, sommeil, "
             "entrain, toilette)"),
            ("Que la loi favorise les garçons",
             "La phrase du visiteur, et la question que l'enfant lui oppose"),
            ("Que la richesse de Frérot est décrite par un inventaire",
             "Le contenu du cartable")],
        bilan=[
            "Un chapitre qui montre comment une décision d'adultes s'abat sur "
            "des enfants. Le verdict est juste en droit — un enfant reconnu va "
            "chez son père — et il coupe une fratrie en deux.",
            "Et la narratrice pose **la question du livre** : *« Et les filles "
            "alors, n'ont-elles pas besoin de père ? »* Personne ne lui "
            "répond. Personne, dans tout le livre, ne lui répondra.",
            "Note la générosité de ce récit : Frérot part, il devient riche, "
            "il « respire la santé et l'opulence » — et **elle ne lui en veut "
            "pas**. Elle répète à qui veut l'entendre que c'est son petit "
            "frère, « bien que personne ne songeât à me contredire ».",
            "Enfin, souligne la phrase la plus douce du chapitre : sa mère et "
            "elle deviennent « deux femmes malheureuses qui pouvaient se "
            "soutenir mutuellement ». Elles font le ménage et bavardent « en "
            "adultes ». **Une vraie vie de vieilles filles**, dit-elle, à neuf "
            "ans."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Un verdict** : la décision rendue par un tribunal.",
                "**Une transaction** : un arrangement conclu avec des "
                "concessions de part et d'autre.",
                "**Soliloquer** : parler tout seul.",
                "**La torpeur** : un état d'engourdissement, d'abattement.",
                "**L'opulence** : la grande richesse."]),
            ("culture", "« Reconnaître » un enfant", [
                "**Reconnaître un enfant**, c'est déclarer officiellement, à "
                "l'état civil, qu'on est son père ou sa mère. L'enfant reçoit "
                "alors le nom, et des droits.",
                "Un enfant non reconnu par son père porte, sur son acte de "
                "naissance, la mention **« père inconnu »** — le titre du "
                "livre.",
                "Ce n'est donc pas une image poétique : c'est une case "
                "administrative. Tout le récit sort de deux mots imprimés sur "
                "un papier."])])

    b += lecture_suivie(
        5, "« Je suis ton père ! » (chapitre V)",
        situation=[
            "Elle a retrouvé un peu de tranquillité : la mère travaille, "
            "Frérot vient à l'école tout seul, les moyennes sont bonnes.",
            "Un matin, en pleine leçon de choses, le Directeur apparaît dans "
            "l'encadrement de la porte. Il chuchote quelque chose au maître. "
            "Le maître la désigne du doigt.",
            "Quelqu'un l'attend dans la cour."],
        texte=_x("J'étais sur le point de me sentir tout à fait heureuse"),
        source=SRC,
        questions=[
            "Quelle leçon suit-on en classe au moment où le Directeur entre ? "
            "Recopie-la. Trouves-tu ce détail bien choisi ?",
            "Comment la narratrice décrit-elle les battements de son cœur ? "
            "Relève deux images.",
            "Quelle décision prend-elle avant de sortir dans la cour ? "
            "Recopie-la.",
            "Décris l'homme qu'elle trouve : sa silhouette, son chapeau, ses "
            "lunettes, son costume. Quelle impression lui fait-il ?",
            "Que dit-il ? Combien de mots ? Que fait-il aussitôt après ?",
            "À qui la narratrice compare-t-elle son père ? Pourquoi cette "
            "comparaison-là ?",
            "Que se passe-t-il dans la boutique du père de Frérot ? Décris les "
            "regards des deux hommes, puis le geste du père de Frérot. "
            "Qu'est-ce que cela nous apprend ?"],
        grille_lecture=[
            ("Que l'attente est insoutenable",
             "Les images du cœur (chiot, cage, tapage)"),
            ("Que le père est vu comme une apparition",
             "Le vocabulaire de l'élégance et de la lumière"),
            ("Que l'enfant s'était préparée à être déçue",
             "La condition qu'elle se pose avant de sortir"),
            ("Que la scène de la boutique se joue en silence",
             "Les regards, la poitrine qui se gonfle, les lèvres qui remuent")],
        bilan=[
            "La plus belle page du livre, et il faut la lire en sachant ce "
            "qu'elle coûte. Un homme élégant, jeune, beau, dit quatre mots — "
            "**« Je suis ton père ! »** — et soulève de terre une enfant qui "
            "attendait cela depuis cinq ans.",
            "Elle a tout de suite le réflexe d'un enfant heureux : elle "
            "voudrait « qu'on fasse sortir toute l'école pour voir » son père. "
            "Il dépasse, dit-elle, le Sous-Préfet, le Maire et le Commandant "
            "de Brigade. **Les seules célébrités qu'elle connaisse.**",
            "Et puis il y a la boutique. Deux hommes se regardent sans un "
            "mot ; le père de Frérot ouvre et rétrécit les yeux, gonfle la "
            "poitrine, remue les lèvres — et **glisse en cachette un second "
            "paquet de biscuits** à la petite. Elle le prend « d'un geste "
            "rapide et camouflé dont la complicité silencieuse me surprit "
            "moi-même ».",
            "Une phrase suit, et c'est peut-être la meilleure du livre : "
            "**« Les enfants savent flairer les secrets et les exploiter. »**"],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Indélébile** : qui ne s'effacera jamais.",
                "**Svelte** : mince et élégant.",
                "**Arborer** : porter avec fierté, exhiber.",
                "**Crâner** : faire le fier.",
                "**Considérer quelqu'un** : ici, le regarder attentivement."]),
            ("rire", "La leçon de choses la mieux placée de la littérature", [
                "Au moment précis où le Directeur vient annoncer qu'un père "
                "attend dans la cour, la classe récite : *« la poule a deux "
                "pattes, le chien en a quatre, le serpent rien du tout, il se "
                "traîne par le ventre, tandis que l'iule en a mille ! »*",
                "Une leçon sur **le nombre de pattes** — c'est-à-dire sur "
                "qui a ce qu'il faut pour tenir debout — juste avant qu'une "
                "enfant sans père trouve enfin le sien.",
                "Un **iule** est un mille-pattes. Vérifie-le : ce livre "
                "t'apprend même la zoologie."])])

    b += lecture_suivie(
        6, "Le village du père (chapitre V, suite)",
        situation=[
            "Le père ne la ramène pas à la maison : il traverse le quartier "
            "sans même regarder de ce côté, et prend la piste forestière.",
            "Deux heures de marche, la petite à califourchon sur ses épaules, "
            "« comme un cheval humain ». Elle lui pose les questions qui font "
            "rire les adultes, et se garde bien de poser celles qui lui "
            "brûlent les lèvres.",
            "Au bout de la piste, un hameau."],
        texte=_x("Au bout de deux heures de marche, nous arrivâmes"),
        source=SRC,
        questions=[
            "Décris le hameau : combien de cases, quels toits, quels murs, "
            "quelles fenêtres ? Relève la comparaison sur les troncs "
            "d'arbre.",
            "Pourquoi le village « respirait la propreté » malgré la crotte de "
            "moutons ? Donne les deux raisons du texte.",
            "Décris, étape par étape, la façon dont la vieille femme les "
            "identifie. Combien d'« opérations » lui faut-il ?",
            "Que fait-elle ensuite ? Explique le geste de la calebasse et du "
            "goupillon.",
            "Comment le village accueille-t-il le père ? Relève les deux "
            "gestes de bienvenue — ils peuvent te surprendre.",
            "Qui est cette vieille femme ? Comment la narratrice le "
            "comprend-elle, sans qu'on le lui dise ?",
            "Recopie la phrase où elle décrit son bonheur à cet instant. "
            "Quelle comparaison emploie-t-elle ?"],
        grille_lecture=[
            ("Que le village est pauvre et pourtant net",
             "Les matériaux (raphia, pisé, bambou) et les marques de propreté"),
            ("Que la vieille femme est très âgée",
             "La lenteur décrite geste par geste"),
            ("Que l'accueil est un rite",
             "L'eau, le goupillon, les formules, la salive, la boue"),
            ("Que l'enfant est heureuse comme jamais",
             "Sa position, son point de vue, ses comparaisons")],
        bilan=[
            "Pabé Mongo prend son temps, ici, et il a raison : c'est le seul "
            "moment de bonheur complet du livre, et il durera trois jours.",
            "Regarde la manière de décrire la vieille femme. Trois "
            "« opérations » pour les reconnaître : redresser la colonne "
            "« comme un fil de fer qu'on étire », balayer la cour du regard, "
            "ouvrir et fermer les paupières. **Puis un cri, et une course.** "
            "Le corps très vieux redevient rapide d'un coup : c'est la joie.",
            "Note aussi les gestes d'accueil, qui déconcertent quand on ne les "
            "connaît pas : on **asperge** d'eau avec un goupillon de feuilles, "
            "on **crache des salives de bénédiction**, on **macule de boue**. "
            "Ce ne sont pas des insultes : ce sont les marques d'un retour "
            "attendu depuis des années.",
            "Et l'image finale, la seule photographie du livre : elle, "
            "« haut perchée sur les épaules » de son père, contemplant « le "
            "troupeau de gens contents ». Elle écrit : *« une image plus nette "
            "qu'une photographie en couleur »*.",
            "**Garde-la.** Elle va te servir pour comprendre tout ce qui suit."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Le pisé** : de la terre battue, mélangée et tassée, dont on "
                "fait des murs.",
                "**Un grabat** : un lit misérable.",
                "**Un goupillon** : l'objet avec lequel on asperge de l'eau "
                "lors d'un rite ; ici, un bouquet de feuilles.",
                "**Le kaolin** : une argile blanche dont on peint et dont on "
                "se sert dans les rites.",
                "**Ameuter** : rassembler une foule.",
                "**Perclus** : qui ne peut presque plus bouger, paralysé par "
                "l'âge."]),
            ("perso", "Ce que le père répond, et ce qu'il ne répond pas", [
                "Elle lui demande son nom. Il répond : *« J'ai le même nom que "
                "toi, ma fille. »* — une réponse qui n'en est pas une.",
                "Elle lui demande pourquoi les arbres sont si hauts. Il "
                "répond : *« C'est nous qui sommes courts, ma fille. »* — et "
                "c'est très beau.",
                "Elle lui demande si elle pèse. Il cite un proverbe : *« le "
                "lièvre est devenu lourd à cause de la longueur du chemin »*.",
                "**Trois questions, trois réponses charmantes, et pas une "
                "explication.** Elle écrit : « je me gardais de lui poser les "
                "questions qui me brûlaient les lèvres. Je trichais avec "
                "moi-même. » Souviens-t'en."])])

    b += [h3("Ce qui arrive ensuite — et pourquoi ce livre existe"),
          p("Les chapitres qui suivent, tu les liras seul. Ils sont durs, et "
            "il vaut mieux le savoir avant."),
          ("encadre", "vigilance", "À lire avant d'ouvrir la fin du livre", [
              "Le bonheur du village ne dure pas. La mère vient la chercher "
              "de force. Le père, lui, ne bouge pas : « Toujours très heureux "
              "et très fier de me voir, mais ne bougeant jamais le petit doigt "
              "pour me garder ! »",
              "Au collège Teerenstra, sa réputation la précède ; le samedi, "
              "jour des visites, elle est **la seule des quatre cent cinquante "
              "élèves à ne recevoir personne**.",
              "Puis sa mère n'arrive plus à payer la pension. La narratrice "
              "s'installe chez sa tante — et là, faute de surveillance, de "
              "table pour travailler et de qui que ce soit pour la protéger, "
              "sa scolarité s'arrête net, à seize ans, en classe de "
              "troisième. Exactement comme celle de sa mère, seize ans plus "
              "tôt.",
              "Elle écrit alors la phrase qui donne son sens à tout le livre : "
              "*« mon tort comportait une part d'héritage »*.",
              "**Ce livre n'est pas un roman triste pour faire pleurer.** "
              "C'est ce que dit sa dédicace : il est écrit pour *les enfants "
              "délaissés*, et surtout pour *les futurs papas* et *les futures "
              "mamans* — c'est-à-dire pour vous, dans quelques années. "
              "L'auteur vous montre une chaîne : un père absent, une mère "
              "seule et débordée, une enfant sans personne, et le même malheur "
              "qui recommence à la génération suivante.",
              "**Une chaîne se brise à un maillon.** C'est tout ce que ce "
              "livre demande."])]

    b += cote_enseignant([
        "Six séances, des chapitres I à V. Les chapitres VI à XI restent en "
        "lecture personnelle ; l'épreuve d'étude de texte porte sur le "
        "chapitre X.",
        "**Le chapitre XI demande une préparation.** La narratrice, à seize "
        "ans et en classe de troisième, se retrouve enceinte, est reniée par "
        "sa mère et échoue à son examen. Le manuel n'en propose aucun extrait "
        "et n'en donne à l'élève qu'un résumé sobre, placé après la sixième "
        "séance.",
        "Conduite recommandée : annoncer la fin **avant** que les élèves ne "
        "l'atteignent, en s'appuyant sur la dédicace du livre (les futurs "
        "papas, les futures mamans) ; rappeler que le récit désigne un "
        "enchaînement de causes — absence du père, isolement de la mère, "
        "absence d'adulte protecteur — et non une faute individuelle à juger.",
        "Ne pas transformer la séance en leçon de morale sur la jeune fille. "
        "Le livre, lui, ne le fait pas : il écrit « mon tort comportait une "
        "part d'héritage ».",
        "Prévoir de signaler aux élèves qu'un adulte de l'établissement est "
        "disponible pour en parler en particulier : dans toute classe, "
        "plusieurs élèves connaissent une partie de cette histoire.",
        "Les séances 5 et 6 (l'arrivée du père, le village) sont les plus "
        "heureuses du livre : ne pas les traiter à la hâte pour aller vite à "
        "la fin."])
    b.append(saut())
    return b
