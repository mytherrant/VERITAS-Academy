# -*- coding: utf-8 -*-
"""4ᵉ — *Trois prétendants… un mari*, Guillaume Oyônô Mbia (Éditions CLE, 1964).

Une comédie en cinq actes, écrite en 1959 par un élève de seconde du Collège
évangélique de Libamba « pour divertir ses camarades après l'étude surveillée ».
Elle a reçu le **prix El Hadj Ahmadou Ahidjo en 1970** et fait rire depuis
soixante ans sur trois continents.

Tout ce qui est affirmé ici sort du volume : la préface où l'auteur explique
son but (« non de moraliser, mais de divertir »), la liste des personnages
rangée par générations, les indications de décor, le **glossaire** final des
expressions bulu et la traduction approximative des chansons.
"""
import jeux
import source
from gabarit import cote_enseignant, lecture_suivie, ouvrir
from kit import cases, enc, grille, h1, h2, h3, lignes, num, p, puce, saut

CLE = "pretendants"
SRC = ("Guillaume Oyônô Mbia, *Trois prétendants… un mari*, "
       "Éditions CLE, Yaoundé, 1964")
BORNES = ["Rideau", "TABLE DES MATIÈRES", "Expressions locales", "PERSONNAGES"]


def _x(amorce, mots=620):
    return source.extrait(CLE, amorce, mots=mots, arret=BORNES)


# ============================================================ 1. J'ouvre

def partie1():
    return [h1("Œuvre 1 — Trois prétendants… un mari, "
               "de Guillaume Oyônô Mbia")] + ouvrir(
        "Trois prétendants… un mari", "Guillaume Oyônô Mbia",
        questions_couverture=[
            "Compte les mots du titre. **Trois** prétendants, **un** mari : "
            "que t'annonce déjà ce déséquilibre ?",
            "Les points de suspension entre « prétendants » et « un mari » : "
            "à quoi servent-ils, d'après toi ?",
            "Le sous-titre annonce une **comédie**. Peut-on rire d'un "
            "mariage ? De quoi rirait-on, exactement ?",
            "Chez toi, qui choisit l'époux ou l'épouse d'un jeune ? Qui paie "
            "quoi ? Écris ce que tu sais, sans juger."],
        promesses=[
            "Qui décidera, à la fin : la jeune fille, ou sa famille ?",
            "La dot est-elle une bonne chose ou une mauvaise chose ?",
            "L'argent aura-t-il le dernier mot ?",
            "Une pièce écrite en 1959 peut-elle encore parler de nous ?"],
        journal_exemple=["09/10", "Acte I",
                         "Juliette rentre du collège et découvre qu'on l'a "
                         "vendue pour cent mille francs",
                         "Pourquoi Abessolo dit-il qu'on ne consulte pas les "
                         "femmes ?"])


# ================================================= 2. L'auteur et son livre

def partie2():
    return [
        h2("2. L'auteur et son livre"),
        h3("Guillaume Oyônô Mbia, fils de cultivateur"),
        p("Il est né à **Mvoutessi**, au Cameroun, en **1939** — c'est-à-dire "
          "dans le village même où se passe la pièce. **Fils d'un "
          "cultivateur**, il fait ses études secondaires, enseigne au "
          "**Collège évangélique de Libamba**, puis part, boursier, étudier "
          "la philosophie en Angleterre. Il enseignera ensuite à la faculté "
          "des lettres de Yaoundé."),
        p("Sa pièce radiophonique *Jusqu'à nouvel avis* a reçu le premier "
          "prix d'un concours de la **BBC**. Il a également publié *Notre "
          "fille ne se mariera pas*, *Le train spécial de son Excellence* et "
          "les *Chroniques de Mvoutessi*."),
        enc("perso", "Pourquoi il a écrit cette pièce (c'est lui qui le dit)",
            ["En **1959**, en classe de seconde, il a voulu raconter les "
             "aventures de sa cousine « Juliette » à ses camarades de "
             "Libamba, « pour les divertir le soir, après l'étude "
             "surveillée » — et **pour remercier ceux qui lui faisaient ses "
             "devoirs d'algèbre**.",
             "Il ajoute, dans sa préface : *« mon but, en écrivant, est non "
             "de moraliser, mais de divertir »*.",
             "Et il explique pourquoi : *« Rares sont les gens disposés à "
             "aller passer toute une soirée au théâtre, les bras sagement "
             "croisés, pour que les acteurs viennent leur déverser des "
             "torrents d'éloquence et de morale sur la tête. »*",
             "**C'est la meilleure définition du théâtre que tu liras cette "
             "année.** On ne fait pas réfléchir les gens en les ennuyant."]),
        enc("culture", "L'anecdote du car de Mbalmayo", [
            "La préface s'ouvre sur une scène vraie. Dans un petit car entre "
            "Mbalmayo et Sangmélima, des voyageurs discutent de "
            "« l'émancipation de la femme africaine ». Sa voisine de banc "
            "démontre, perruque blonde à l'appui, que tout va changer.",
            "Le car ralentit devant une plaque : **Mvoutessi**. Et la dame "
            "s'écrie, triomphante : *« D'ailleurs, nous voici chez Guillaume "
            "Oyônô, le grand champion de l'émancipation de la femme "
            "africaine »…*",
            "L'auteur commente : *« Il est toujours inquiétant de s'entendre "
            "proclamer champion d'une grande cause. »* Retiens cette "
            "prudence : elle explique pourquoi sa pièce ne fait jamais la "
            "leçon."]),
        h3("Ce qu'il y a dedans : cinq actes, un village, une dot"),
        grille([["Acte", "Où", "Ce qui s'y passe"],
                ["**I**", "la cour d'Atangana, à Mvoutessi",
                 "Juliette rentre du collège de Libamba. On lui apprend "
                 "qu'elle est promise à Ndi, qui a versé cent mille francs — "
                 "et qu'un fonctionnaire doit venir en offrir davantage."],
                ["**II**", "la même cour", "Mbia, le grand fonctionnaire de "
                 "Sangmélima, arrive avec chauffeur, médailles et billets. "
                 "Le village est ébloui."],
                ["**III**", "**la cuisine de Makrita**", "Entre femmes : "
                 "Bella et Makrita expliquent à Juliette tout ce qu'on a "
                 "sacrifié pour elle. Juliette et son ami Kouma préparent "
                 "autre chose."],
                ["**IV**", "autour d'un grand feu, la nuit",
                 "Sanga-Titi le Sorcier, sa femme Mô-Boula et son Aide "
                 "consultent les esprits sur l'affaire. Chants et danses."],
                ["**V**", "la cour d'Atangana, le lendemain",
                 "Le dénouement. Un dernier prétendant se présente."]]),
        enc("mot", "Cinq mots à connaître avant de commencer", [
            "**Un prétendant** : celui qui demande une jeune fille en mariage.",
            "**La dot** : la somme (ou les biens) que le prétendant verse à la "
            "famille de la jeune fille. Dans la pièce, elle est en argent "
            "liquide, et on la compte à voix haute.",
            "**Une palabre** : une assemblée où l'on discute une affaire "
            "jusqu'à la régler. Ici, elle se tient entre hommes ; « les femmes "
            "n'assistent pas à cette palabre au sommet », dit une didascalie.",
            "**Un blanc** : le glossaire du livre est formel — le mot désigne "
            "ici *« un personnage “évolué”, et non pas nécessairement un homme "
            "à peau blanche »*. Quand Bella s'écrie « Ma petite-fille va "
            "épouser un vrai blanc ! », elle parle de Mbia, qui est "
            "camerounais.",
            "**L'arki** : « boisson de maïs fermenté de fabrication locale » "
            "(glossaire). Sa distillation est interdite — d'où les ennuis de "
            "la femme d'Ondua avec la police."]),
        enc("astuce", "La pièce est faite pour être jouée dehors", [
            "L'auteur le demande explicitement : il souhaite que ses pièces "
            "soient jouées **en plein air**, « devant un public qui prendrait "
            "spontanément part aux chants et aux danses ».",
            "Et cela marche : à la fin des représentations qu'il a données en "
            "Angleterre, le public britannique — « flegmatique par "
            "définition » — est venu **en masse** se joindre à la grande "
            "danse finale.",
            "Alors ne lisez pas cette pièce assis en silence. Distribuez les "
            "rôles, criez les « Eé é é kié ! », frappez dans les mains. "
            "C'est écrit pour cela."]),
        saut()]


# =========================================================== 3. Qui est qui

def partie3():
    b = [h2("3. Qui est qui à Mvoutessi"),
         p("Le livre range ses personnages **par générations**. Ce n'est pas "
           "un détail : c'est le sujet de la pièce. Les vieux décident, les "
           "parents encaissent, les jeunes paient."),
         grille([["Génération", "Personnage", "Qui c'est", "Ce qu'il veut"],
                 ["**Grands-parents**", "**Abessolo**", "grand-père de "
                  "Juliette", "que rien ne change — « battez vos femmes ! »"],
                 ["", "**Bella**", "sa femme, grand-mère de Juliette",
                  "que sa petite-fille épouse « un vrai blanc »"],
                 ["**Parents**", "**Atangana**", "paysan, père de Juliette",
                  "la dot la plus élevée possible"],
                 ["", "**Makrita**", "sa femme, mère de Juliette",
                  "qu'on n'oublie pas ce qu'elle a sacrifié"],
                 ["", "**Ondua**", "frère d'Atangana", "des boissons fortes, "
                  "et la paix avec la police"],
                 ["", "**Mbarga**", "cousin, chef du protocole du village",
                  "que tout se passe dans les règles"],
                 ["", "**Mezoe**", "cousin", "un costume en tergal"],
                 ["", "**Mbia**", "grand fonctionnaire de Sangmélima",
                  "épouser Juliette — et qu'on admire ses médailles"],
                 ["", "**Tchetgen**", "commerçant", "la même chose, moins "
                  "cher"],
                 ["", "**Sanga-Titi**", "le Sorcier", "être payé, et "
                  "impressionner"],
                 ["**Jeunes**", "**Juliette**", "collégienne à Libamba",
                  "choisir elle-même"],
                 ["", "**Oko**", "lycéen au Lycée Leclerc, à Yaoundé",
                  "épouser Juliette — sans un franc"],
                 ["", "**Kouma**", "lycéen, ami de Juliette",
                  "faire réussir le plan"],
                 ["", "**Ndi**", "paysan", "récupérer ses cent mille francs"],
                 ["", "**Oyono**", "paysan, frère de Juliette",
                  "de quoi doter sa propre fiancée"],
                 ["", "**Matalina**", "fille d'Ondua, cousine de Juliette",
                  "être à la place de Juliette"],
                 ["", "**Engulu**", "chauffeur de Mbia",
                  "regarder « ces broussards » d'un peu haut"]]),
         enc("perso", "La phrase qui revient et qui dit tout", [
             "Abessolo, à Juliette qui demande à être consultée : "
             "*« Depuis quand est-ce que les femmes parlent à Mvoutessi ? »*",
             "Et un peu plus tôt : *« Je vous le répète, battez vos femmes ! "
             "Oui, battez-les ! »*",
             "**Attention à ne pas se tromper de lecture.** Ce n'est pas "
             "l'auteur qui parle : c'est un personnage, et la pièce le rend "
             "ridicule. Il confond ses souvenirs (« De mon temps, quand "
             "j'étais encore Abessôlô »), il appelle Libamba « Dibamba », et "
             "toute la salle rit de lui.",
             "Faire dire une bêtise à un personnage pour que le public la "
             "trouve bête, cela s'appelle **la satire**."]),
         enc("lieu", "La carte de la pièce", [
             "**Mvoutessi** : le village, construit le long de la route. "
             "C'est là que tout se passe — et c'est le village réel de "
             "l'auteur.",
             "**Libamba** : le collège de Juliette. Son grand-père dit "
             "obstinément « Dibamba », qui est un fleuve.",
             "**Sangmélima** : la ville où Mbia est fonctionnaire.",
             "**Yaoundé** : la capitale, et le **Lycée Leclerc** où étudie "
             "Oko.",
             "**Zoétele**, **Ambam**, **Ebolowa** : les localités voisines "
             "citées au passage.",
             "Une didascalie précise l'ambiance : on entendra passer des "
             "voitures, des mobylettes, des aboiements, des cris d'enfants, "
             "des bêlements, des chants de coq — « l'atmosphère sera celle "
             "d'un petit village de brousse où les gens s'ennuient volontiers "
             "à leurs moments perdus »."])]

    e, c = jeux.relier(
        "Chacun sa raison",
        [("Abessolo", "« Depuis quand est-ce que les femmes parlent à "
                       "Mvoutessi ? »"),
         ("Atangana", "Il compte la dot à voix haute et se frappe la poitrine"),
         ("Ondua", "Il espère surtout des boissons fortes et la paix avec la "
                   "police"),
         ("Mbia", "Il travaille « dans un très grand bureau » et porte des "
                  "médailles"),
         ("Juliette", "« Quoi ? Je suis donc à vendre ? »"),
         ("Kouma", "Il présente les prétendants sur des feuilles de palmier"),
         ("Matalina", "Elle envie sa cousine et voudrait être à sa place")],
        graine=163)
    b += e
    b.append(saut())
    return b, c


# ======================================================= 4. Lectures suivies

def partie4():
    b = [h2("4. Je lis l'œuvre — six lectures suivies"),
         p("Six séances, réparties sur les cinq actes. Distribuez les rôles "
           "dès la première : cette pièce ne se comprend pas en silence.")]

    b += lecture_suivie(
        1, "Une dot déjà encaissée (acte I)",
        situation=[
            "Mvoutessi, un après-midi tranquille. Atangana fabrique un "
            "panier en jetant des coups d'œil impatients à un énorme réveil. "
            "Abessolo sculpte une figurine d'ébène. Ondua et Oyônô jouent au "
            "« songho » en buvant du vin de palme. Matalina décortique des "
            "arachides.",
            "Une didascalie prévient : « Il va sans dire que les femmes ne "
            "boivent pas. »",
            "La conversation commence par une plainte — et elle arrive très "
            "vite à Juliette."],
        texte=_x("Tu vois, Ondua ? Le réveil lui-même nous dit"), source=SRC,
        questions=[
            "De quoi Atangana se plaint-il en ouvrant la pièce ? Et Ondua "
            "juste après ?",
            "Que reproche Abessolo aux hommes de la génération de son fils ? "
            "Fais la liste — il y a quatre reproches.",
            "Combien Ndi a-t-il versé ? En combien de fois ? Pourquoi ce "
            "détail impressionne-t-il Matalina ?",
            "Qu'avait proposé Atangana avant que son père ne l'en empêche ? "
            "Que révèle cette hésitation sur lui ?",
            "Relève la phrase où Atangana explique pourquoi il a envoyé sa "
            "fille au collège. Que penses-tu de cette raison ?",
            "Fais la liste de ce que la famille espère obtenir du "
            "fonctionnaire. Combien de ces avantages concernent Juliette ?",
            "Quelle est la seule question qui préoccupe vraiment Atangana ? "
            "Recopie-la."],
        grille_lecture=[
            ("Que les vieux commandent",
             "Les impératifs et les leçons d'Abessolo"),
            ("Que Juliette est un placement",
             "Le vocabulaire de l'argent (dot, verser, rembourser, rapporter)"),
            ("Que les femmes sont hors du cercle",
             "Les didascalies sur ce que font et ne font pas les femmes"),
            ("Que le comique naît de la mauvaise foi",
             "L'histoire de la bouteille d'arki d'Ondua")],
        bilan=[
            "Une pièce entière annoncée en trois pages. Une jeune fille "
            "revient du collège, et l'on a **déjà encaissé** cent mille "
            "francs pour elle.",
            "Note comment l'auteur fait rire sans une seule blague : il "
            "laisse simplement les personnages dire ce qu'ils pensent. Ondua "
            "est furieux que sa femme ne lui ait donné **qu'une** bouteille "
            "d'alcool interdit ; Abessolo réclame qu'on batte les femmes ; "
            "Atangana s'attribue le mérite d'avoir envoyé Juliette à l'école — "
            "parce que « cela me rapportera ».",
            "**Le procédé s'appelle l'ironie de situation** : le spectateur "
            "comprend l'inverse de ce que le personnage croit dire.",
            "Et guette la phrase d'Atangana, la seule qui compte pour lui : "
            "*« qu'est-ce que le fonctionnaire nous apporte comme argent ? »* "
            "Toute la pièce tient dans cette question, et dans le fait que "
            "personne ne pose l'autre : *qu'est-ce que Juliette en pense ?*"],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Un songho** : un jeu de société africain à graines et à "
                "cases, joué sur un plateau creusé.",
                "**Vindicatif** : qui garde rancune, qui veut se venger.",
                "**La commisération** : la pitié qu'on manifeste à quelqu'un.",
                "**Sentencieux** : qui parle sur un ton solennel, comme s'il "
                "énonçait des vérités éternelles.",
                "**Tabou** : interdit par la coutume — ici, certains animaux "
                "que les femmes n'avaient pas le droit de manger."]),
            ("rire", "Le réveil d'Atangana", [
                "Regarde l'objet posé devant lui : **un énorme réveil**, "
                "qu'il consulte avec impatience.",
                "Un homme qui n'a pas de montre mais un réveil posé par terre "
                "dans une cour de village, et qui s'indigne que sa femme ne "
                "soit pas rentrée « bien avant midi » alors qu'elle est au "
                "champ depuis l'aube.",
                "Oyônô Mbia n'écrit pas « Atangana était injuste ». Il pose un "
                "réveil sur le sol. **C'est tout le théâtre.**"])])

    b += lecture_suivie(
        2, "« Je suis donc à vendre ? » (acte I)",
        situation=[
            "Une auto s'arrête. Juliette arrive de Libamba, joyeuse, "
            "embrassée par tout le monde à la manière traditionnelle des "
            "Bulu. Elle annonce qu'elle a réussi son examen ; sa grand-mère "
            "pousse le cri de joie, l'*ôyenga*.",
            "Puis Matalina laisse échapper un mot de trop."],
        texte=_x("Te voilà arrivée plus tôt que d'habitude, Juliette"),
        source=SRC,
        questions=[
            "Comment Juliette corrige-t-elle son grand-père à propos de "
            "Libamba ? Pourquoi cette erreur est-elle drôle ?",
            "Quel mot de Matalina met le feu aux poudres ? Que font les "
            "hommes pour l'arrêter, et pourquoi est-ce trop tard ?",
            "Recopie la réponse de Bella : « Un mari, Juliette ? Mais tu en "
            "as déjà… ». Quel effet produit ce pluriel ?",
            "Comment Atangana présente-t-il l'affaire à sa fille ? Relève les "
            "deux précautions qu'il prend dans sa phrase.",
            "Recopie la réaction de Juliette. Combien de questions "
            "pose-t-elle ? Que demande-t-elle exactement ?",
            "Que répond Abessolo ? Relève sa question et l'aparté qu'il "
            "lance au public.",
            "Relève la didascalie qui décrit le visage d'Atangana pendant la "
            "réplique de Juliette. Que s'attendait-il à entendre ?"],
        grille_lecture=[
            ("Que la nouvelle tombe par accident",
             "L'enchaînement des répliques de Matalina et d'Ondua"),
            ("Que la famille croit faire un cadeau",
             "Les mots de la chance et de la fierté"),
            ("Que Juliette pose une question neuve",
             "Ses phrases interrogatives et le verbe *consulter*"),
            ("Que le public est pris à témoin",
             "Les apartés adressés au public")],
        bilan=[
            "Voici la scène qui a fait le tour du monde. Une jeune fille "
            "apprend, en rentrant de son collège avec un examen réussi, "
            "qu'elle a **deux maris** et qu'on attend le plus offrant.",
            "Sa réponse tient en trois questions : *« Je suis donc à vendre ? "
            "Pourquoi faut-il que vous essayiez de me donner au plus offrant ? "
            "Est-ce qu'on ne peut pas me consulter pour un mariage qui me "
            "concerne ? »*",
            "Et la réponse du grand-père est encore plus révélatrice que la "
            "question : *« Depuis quand est-ce que les femmes parlent à "
            "Mvoutessi ? »* Il ne dit pas « tu as tort » ; il dit « tu n'as "
            "pas le droit de parler ».",
            "**Observe la mécanique du comique.** Toute la famille est "
            "sincèrement stupéfaite : ils croyaient annoncer une bonne "
            "nouvelle. La didascalie le dit — le sourire fier d'Atangana « s'est "
            "peu à peu transformé en une grimace scandalisée ». On ne rit pas "
            "de méchants : on rit de gens persuadés de bien faire."],
        encadres=[
            ("culture", "L'ôyenga", [
                "C'est le **cri de joie traditionnel des femmes** : « Ou-ou-"
                "ou-ou-ou… ! » Bella le pousse quand elle apprend que sa "
                "petite-fille a réussi son examen, et on le retrouve à la "
                "toute fin de la pièce, au moment du mariage.",
                "Cherche-le dans le texte : il revient plusieurs fois, "
                "toujours aux moments de bonheur. C'est un **repère "
                "sonore** — le théâtre en a besoin autant que de mots."]),
            ("perso", "Deux mots qui datent la pièce, et deux qui ne datent "
                      "pas", [
                "**Ce qui a changé :** on n'envoie plus une collégienne "
                "apprendre son mariage par sa cousine, et les examens ne "
                "servent plus à faire monter une dot.",
                "**Ce qui n'a pas changé :** on continue, partout dans le "
                "monde, à décider pour des jeunes gens en croyant leur faire "
                "plaisir ; et l'on continue à répondre « depuis quand est-ce "
                "que tu parles ? » à celui qui demande son avis.",
                "C'est pour cela qu'une pièce de 1959 fait encore rire — et "
                "encore réfléchir."])])

    b += lecture_suivie(
        3, "Le grand fonctionnaire (acte II)",
        situation=[
            "Le même après-midi. Atangana a battu le tam-tam pour convoquer "
            "tout le village. Mbia est assis « bien en évidence » dans un "
            "grand fauteuil d'acajou : costume en tergal du bon faiseur, "
            "lunettes de soleil, et « une formidable collection de médailles » "
            "sur la poitrine.",
            "Son chauffeur Engulu distribue des cigarettes. Les villageois en "
            "prennent « toujours plus d'une à la fois ». Une didascalie "
            "précise : « les femmes n'assistent pas à cette palabre au "
            "sommet »."],
        texte=_x("C'est moi Mbia, grand fonctionnaire de Sangmélima"),
        source=SRC,
        questions=[
            "Comment Mbia se présente-t-il ? Recopie ses trois premières "
            "phrases. Combien de fois parle-t-il de lui-même ?",
            "Que dit-il exactement de son travail ? Trouves-tu cette "
            "description précise ?",
            "Quelles sont ses preuves de valeur ? Que remarques-tu à propos "
            "de ce qu'il ne dit **jamais** ?",
            "Comment les villageois réagissent-ils ? Relève leurs réponses en "
            "chœur — elles se ressemblent toutes.",
            "Que propose Mbia pour qu'on le connaisse mieux ? Que révèle "
            "cette proposition sur la manière dont on se fait accepter ici ?",
            "Comment Engulu, simple chauffeur, considère-t-il les villageois ? "
            "Relève l'expression de la didascalie.",
            "Compare la tenue de Mbia et celle d'Atangana (qui enfile « une "
            "vieille veste croisée »). Que dit ce contraste ?"],
        grille_lecture=[
            ("Que Mbia se met en scène",
             "Les didascalies sur ses gestes (s'éclaircir la gorge, se bomber "
             "la poitrine)"),
            ("Que sa valeur est faite d'objets",
             "Les médailles, le costume, les lunettes, la voiture, le "
             "chauffeur"),
            ("Que le village est ébloui",
             "Les répliques en chœur et les points d'exclamation"),
            ("Que le mépris descend en cascade",
             "Ce qu'Engulu pense des villageois")],
        bilan=[
            "Un portrait en creux, et un chef-d'œuvre de comique. Mbia parle "
            "de lui pendant toute la scène **sans dire une seule fois ce "
            "qu'il fait**. « Je travaille dans un très grand bureau » : voilà "
            "tout ce qu'on saura.",
            "Ce qui le rend grand, ce sont des **signes** : des médailles, un "
            "costume, des lunettes de soleil, un chauffeur, et le fait d'être "
            "« bien connu de Monsieur le Ministre ». Pas une compétence, pas "
            "un acte.",
            "Et le village marche à fond, parce que le village a besoin qu'il "
            "soit grand : un gendre pareil, ce sont des démarches "
            "administratives accélérées et une police plus commode.",
            "**La leçon d'écriture :** pour se moquer d'un vaniteux, ne dis "
            "jamais qu'il est vaniteux. Laisse-le parler, et compte ses "
            "médailles."],
        encadres=[
            ("rire", "La cascade du mépris", [
                "Regarde la chaîne : Mbia méprise les villageois ; **Engulu, "
                "son chauffeur**, les méprise aussi « en bon citadin » ; les "
                "villageois, eux, méprisent Ndi le paysan qui avait payé le "
                "premier.",
                "Et tout en bas de la chaîne, il y a Juliette, dont personne "
                "ne demande l'avis.",
                "Oyônô Mbia ne dénonce pas : il **empile**. Chaque étage "
                "regarde l'étage du dessous de haut."]),
            ("mot", "Les mots difficiles", [
                "**Le tergal** : un tissu synthétique, très à la mode dans "
                "les années soixante — le signe du costume de ville.",
                "**Un broussard** : celui qui vit en brousse (péjoratif dans "
                "la bouche d'un citadin).",
                "**Épaté** : très étonné, admiratif.",
                "**Une palabre au sommet** : une discussion entre les plus "
                "importants.",
                "**S'évertuer à** : faire de grands efforts pour."])])

    b += lecture_suivie(
        4, "Entre femmes, dans la cuisine (acte III)",
        situation=[
            "Le soir du même jour. **Changement de décor** — le seul de toute "
            "la pièce : nous sommes à l'intérieur de la cuisine de Makrita, "
            "éclairée par un feu de bois et une vieille lampe-tempête.",
            "Bella, Makrita et Juliette préparent le repas. Juliette, « moins "
            "élégante qu'à son arrivée de Libamba », décortique des "
            "arachides.",
            "Pour la première fois, il n'y a pas un homme sur scène."],
        texte=_x("Maintenant que nous sommes entre femmes, Juliette"),
        source=SRC,
        questions=[
            "Que fait chacune des trois femmes pendant la scène ? Relève les "
            "trois activités.",
            "Que reproche Bella à Juliette ? Recopie sa première question.",
            "Qu'a-t-il fallu faire pour que Juliette reste au collège ? "
            "Relève ce que dit Makrita.",
            "Pourquoi Atangana était-il « la risée de Mvoutessi » ? Que "
            "trouvaient bête les autres hommes ?",
            "Qu'a promis Makrita à Oyônô, le frère de Juliette ? Recopie sa "
            "phrase entière.",
            "Récapitule : à quoi devait servir le mariage de Juliette, dans "
            "les plans de sa mère et de sa grand-mère ?",
            "Que répond Juliette ? Sa réponse te paraît-elle égoïste, ou "
            "juste ? Discute honnêtement les deux côtés."],
        grille_lecture=[
            ("Que les femmes travaillent en parlant",
             "Les didascalies d'activité, tout au long de la scène"),
            ("Que le sacrifice est rappelé comme une dette",
             "Les phrases sur ce qu'on a « fait pour elle »"),
            ("Que la dot circule d'une génération à l'autre",
             "Le passage sur la femme d'Oyônô"),
            ("Que Juliette est isolée",
             "Le nombre de personnes contre elle dans la scène")],
        bilan=[
            "L'acte le plus important de la pièce, et le seul qui se passe "
            "dans une cuisine. **Ce changement de décor n'est pas décoratif :** "
            "c'est le seul endroit où les femmes ont la parole.",
            "Et que disent-elles ? Elles rappellent une dette. Atangana a "
            "« gaspillé tout l'argent de son cacao sur une fille » au lieu "
            "d'épouser d'autres femmes ; il fallait le supplier chaque fois "
            "que Juliette était renvoyée du collège pour pension impayée.",
            "Puis vient la phrase qui explique tout le système : Makrita a "
            "promis à son fils Oyônô que **la dot de sa sœur paierait la dot "
            "de sa femme**. La jeune fille n'est pas seulement vendue : elle "
            "est **la monnaie d'un autre mariage**.",
            "C'est cela que la pièce montre sans jamais le dénoncer : un "
            "engrenage où personne n'est un monstre, et où chacun a de "
            "bonnes raisons. Bella et Makrita ne sont pas des ennemies de "
            "Juliette. **Elles ont été Juliette.**"],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Une lampe-tempête** : une lampe à pétrole protégée par un "
                "verre, qui ne s'éteint pas au vent.",
                "**La risée de quelqu'un** : celui dont tout le monde se "
                "moque.",
                "**Doter une femme** : verser la dot pour l'épouser.",
                "**Un défaut de pension** : le fait de ne pas avoir payé les "
                "frais de l'internat.",
                "**Séduisante** : qui plaît, qui attire."]),
            ("perso", "Trois femmes, trois générations, un seul système", [
                "**Bella** a été mariée sans qu'on lui demande son avis, et "
                "elle trouve cela normal.",
                "**Makrita** a dû mendier l'argent de la pension de sa fille, "
                "et elle a monnayé d'avance son mariage.",
                "**Juliette** refuse — et c'est la première.",
                "Trois femmes du même sang. La pièce ne dit pas laquelle a "
                "raison : elle les met dans la même cuisine et les fait "
                "parler. À toi de conclure."])])

    b += lecture_suivie(
        5, "Le Sorcier Sanga-Titi (acte IV)",
        situation=[
            "Il fait nuit. Un grand feu, les villageois assis en demi-cercle. "
            "Entre **Sanga-Titi**, le Sorcier : peaux de chats sauvages et de "
            "singes autour des reins, torse badigeonné de kaolin, coiffure de "
            "plumes de coq et de toucan, clochettes aux pieds.",
            "Avec lui, sa femme **Mô-Boula** et son **Aide**. Il chante en "
            "s'accompagnant de sa harpe **Mvet** ; sa femme reprend le "
            "refrain « pour donner aux villageois le temps de l'apprendre ».",
            "Lis la didascalie avant les répliques : c'est un mode d'emploi "
            "de spectacle."],
        texte=_x("Il fait déjà nuit. La scène est éclairée par un grand feu"),
        source=SRC,
        questions=[
            "Décris le costume de Sanga-Titi, élément par élément. Combien "
            "d'animaux différents y reconnais-tu ?",
            "Qui l'accompagne ? Que dit la didascalie de leur apparence, "
            "comparée à la sienne ?",
            "Que fait Mô-Boula pendant que son mari chante ? Pourquoi ?",
            "Que font les musiciens, et sur quels instruments ? Relève les "
            "deux noms de danses ou de rythmes cités.",
            "Relève la phrase qui invite **les spectateurs** eux-mêmes à "
            "danser. Que devient alors la frontière entre la scène et la "
            "salle ?",
            "Le glossaire du livre traduit approximativement les chansons. "
            "Que dit-il de la fonction du sens dans ces chants ?",
            "À ton avis, pourquoi l'auteur place-t-il une scène de sorcier au "
            "milieu d'une pièce sur la dot ?"],
        grille_lecture=[
            ("Que l'entrée du Sorcier est un spectacle",
             "L'inventaire du costume et des accessoires"),
            ("Que la musique organise la scène",
             "L'ordre : chant → refrain → signe de tête → tam-tams → danse"),
            ("Que le public est invité à entrer",
             "Les phrases qui s'adressent aux spectateurs"),
            ("Que le Sorcier éclipse tout le monde",
             "La comparaison avec les autres acteurs, Mbarga compris")],
        bilan=[
            "Un acte entier qui ne fait presque pas avancer l'histoire — et "
            "qui est indispensable.",
            "Souviens-toi du but déclaré de l'auteur : **divertir**. Il veut "
            "que ses pièces soient jouées en plein air, avec un public qui "
            "chante et qui danse. L'acte IV est là pour cela : c'est le moment "
            "où la salle se lève.",
            "Mais il fait aussi autre chose. Il montre que, pour trancher une "
            "affaire d'argent et de mariage, ce village convoque **un homme "
            "en plumes de toucan qui joue de la harpe**. La pièce ne se moque "
            "pas de lui : elle le rend magnifique, « il éclipse facilement les "
            "autres acteurs ».",
            "Et regarde comment l'auteur traite ses chansons dans le "
            "glossaire : *« le sens a beaucoup moins d'importance que la "
            "musique et la danse auxquelles elles se rapportent et, surtout, "
            "l'atmosphère créée »*. Il demande même aux troupes qui ne "
            "connaissent pas ces chants **d'en trouver des équivalents "
            "locaux**. Une œuvre qui prévoit d'être transformée par ceux qui "
            "la jouent : c'est rare, et c'est très africain."],
        encadres=[
            ("culture", "Le Mvet", [
                "Le **Mvet** est à la fois un instrument — une harpe-cithare "
                "à cordes tendues sur une tige de raphia et des calebasses de "
                "résonance — et un **genre littéraire** : la grande épopée "
                "chantée des peuples du Sud-Cameroun et du Gabon.",
                "Le joueur de mvet chante, récite, joue et danse, parfois "
                "toute la nuit.",
                "Une didascalie de la pièce nomme d'ailleurs les **Ayangan**, "
                "« tribu imaginaire très souvent citée dans les épopées de "
                "\" Mvet \" »."]),
            ("mot", "Les mots difficiles", [
                "**Le kaolin** : argile blanche dont on se badigeonne dans "
                "les rites.",
                "**Pittoresque** : qui frappe l'œil, qui a du caractère.",
                "**Éclipser quelqu'un** : le faire paraître insignifiant à "
                "côté de soi.",
                "**Un intermède** : un moment inséré entre deux parties d'un "
                "spectacle.",
                "**En cadence** : en suivant le rythme."])])

    b += lecture_suivie(
        6, "Docteur en Doctorat (acte V, dénouement)",
        situation=[
            "Le lendemain après-midi. Les villageois attendent, résignés, de "
            "voir surgir les commissaires de police de Zoétele et de "
            "Sangmélima : l'argent des dots a disparu.",
            "Arrive alors **Kouma**, l'ami lycéen de Juliette, qui organise "
            "une présentation en règle des prétendants, à l'aide de quatre "
            "feuilles de palmier posées au sol.",
            "Tchetgen, le commerçant, vient de renoncer. Il reste un dernier "
            "candidat à présenter."],
        texte=_x("Le troisième prétendant n'a guère besoin qu'on en parle"),
        source=SRC,
        questions=[
            "Pourquoi Tchetgen s'en va-t-il ? Recopie ce qu'il grommelle en "
            "partant.",
            "Fais la liste **complète** des titres que Kouma attribue à Okô. "
            "Lesquels existent vraiment ?",
            "Qui souffle « Docteur en Doctorat » ? Que révèle cette réplique "
            "sur Mbarga ?",
            "Que fait Atangana pendant que Juliette hésite ? Relève la "
            "didascalie.",
            "Combien Okô verse-t-il ? Compare ce chiffre aux dots déjà "
            "versées par Ndi, Mbia et Tchetgen. Que remarques-tu ?",
            "D'où vient cet argent ? (Relis l'acte III et l'acte V.) "
            "Explique le tour en trois phrases.",
            "Recopie la dernière phrase d'Atangana à sa fille. Pourquoi "
            "est-elle si drôle — et si cruelle pour lui ?",
            "Où Juliette est-elle assise à la fin ? Sur quoi Okô est-il "
            "assis ? Relève la didascalie et commente ce détail."],
        grille_lecture=[
            ("Que les titres sont une pure invention",
             "L'accumulation des grades et des langues"),
            ("Que la famille se laisse éblouir une fois de plus",
             "Les gestes d'Atangana et de Mbarga"),
            ("Que l'argent tourne en rond",
             "Le montant versé, comparé aux dots précédentes"),
            ("Que rien n'a peut-être changé",
             "La dernière didascalie : le fauteuil, le tabouret, « apparemment "
             "soumise »")],
        bilan=[
            "Le dénouement est une farce parfaite. Okô « achète » Juliette "
            "**avec l'argent des autres prétendants**, que Juliette elle-même "
            "lui a remis. Atangana compte joyeusement ses propres billets, "
            "aidé de son père.",
            "Et il lâche, à voix basse pour qu'Okô n'entende pas : *« j'aurais "
            "autant gagné à te donner pour rien… à ton écolier Leclerc, par "
            "exemple ! »* — **il ne l'a pas reconnu**. Le grand docteur devant "
            "lui est le lycéen qu'il refusait.",
            "Mais ne referme pas le livre trop vite. Relis la toute dernière "
            "didascalie : Mbarga fait apporter le **grand fauteuil** pour Okô, "
            "renvoie Mezôé chercher **un petit tabouret** pour Juliette, et "
            "l'on voit la jeune fille assise « apparemment soumise » à côté du "
            "fauteuil de son mari.",
            "**Le mot « apparemment » est le dernier mot de l'auteur.** "
            "Juliette a gagné son mari ; a-t-elle gagné sa place ? La pièce ne "
            "répond pas. Elle lance la danse, et invite le public à s'y "
            "joindre."],
        encadres=[
            ("rire", "Le palmarès des faux titres", [
                "« Docteur en **Doctorat** » · « Docteur en **Baccalauréat** » "
                "· « et en **feuilles de palmier** » · « **Bas et "
                "Haut-Commissaire** » · « parlant parfaitement toutes les "
                "langues blanches et le jaman ».",
                "Le glossaire précise que **jaman** (ou *doïche*) désigne "
                "l'allemand — les Allemands ayant été les premiers "
                "colonisateurs du Cameroun.",
                "Aucun de ces titres n'existe. Et personne ne s'en aperçoit, "
                "parce que **personne ne sait ce qu'est un doctorat**. C'est "
                "exactement ce qui s'est passé à l'acte II avec les médailles "
                "de Mbia."]),
            ("perso", "Ce que la pièce ne dit pas, et qu'il faut voir", [
                "Juliette obtient l'homme qu'elle aime. C'est une victoire.",
                "Mais elle l'obtient **en jouant le jeu de la dot**, pas en le "
                "refusant. Le système n'a pas été renversé : il a été "
                "retourné, une fois, par une fille plus maligne que les "
                "autres.",
                "Souviens-toi de la préface : l'auteur refuse d'être « le "
                "grand champion de l'émancipation de la femme africaine ». Sa "
                "pièce ne promet pas de solution — elle montre le mécanisme, "
                "et elle fait rire.",
                "**À toi de décider si cela suffit.** C'est le premier des "
                "trois débats de fin d'année."])])

    b += cote_enseignant([
        "Six séances : deux sur l'acte I, une par acte ensuite, sauf l'acte "
        "IV traité en une séance ; l'acte II fournit en outre le support de "
        "l'épreuve d'étude de texte (passage non étudié).",
        "**Distribuer les rôles dès la première séance.** L'auteur demande "
        "explicitement que sa pièce soit jouée en plein air avec participation "
        "du public : une lecture assise et silencieuse la trahit.",
        "Le texte comporte des expressions bulu et des chansons : le "
        "glossaire final du volume les traduit, et l'auteur invite les troupes "
        "à trouver des **équivalents locaux**. Une classe peut donc adapter — "
        "c'est prévu par l'œuvre.",
        "Les propos d'Abessolo sur les femmes (« battez-les ») sont des "
        "propos de personnage, tournés en dérision par la pièce elle-même. Le "
        "faire établir par les élèves à partir des didascalies plutôt que de "
        "l'affirmer.",
        "L'exemplaire courant de la pièce est un scan : quelques coquilles "
        "d'impression subsistent dans certaines éditions. Les extraits de ce "
        "manuel ont été choisis dans des passages nets."])
    b.append(saut())
    return b
