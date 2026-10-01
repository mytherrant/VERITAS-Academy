# -*- coding: utf-8 -*-
"""3ᵉ — *Petites gouttes de chant pour créer l'Homme*, René Philombe.

Vingt-deux poèmes numérotés en chiffres romains, suivis, dans le même volume,
d'un long poème : *Les Blancs partis, les Nègres dansent*.

Un recueil ne se lit pas comme un roman : on ne le lit pas d'un bout à
l'autre, on entre dedans par un poème. Les six lectures suivies de cette
étude sont donc six **poèmes entiers** — jamais des morceaux. Un poème coupé
en deux n'est plus un poème, c'est un exercice de grammaire.
"""
import jeux
import source
from gabarit import cote_enseignant, lecture_suivie, ouvrir
from kit import cases, enc, grille, h1, h2, h3, lignes, num, p, puce, saut

CLE = "gouttes"
SRC = ("René Philombe, *Petites gouttes de chant pour créer l'Homme*, "
       "Éditions CLE, Yaoundé")

# Les titres des vingt-deux poèmes, plus ce qui suit le recueil : ce sont les
# bornes qui empêchent un poème d'avaler son voisin.
BORNES = ["I. L'homme s'est éloigné", "II.- Guerre de religions",
          "III. Chevaux débridés", "IV.- La voix du ventre", "V.- Macabre",
          "VI.- Dénonciation civique", "VII.- Conseil à un maître",
          "VIII.- Et tu danses, homme", "IX.- Le feu",
          "X.- Poème à déclamer sur la lune", "XI.- Mon chemin",
          "XII.- Dix amours de poète", "XIII.- Invitation à la danse",
          "XIV.- Le hibou", "XV.- Les dormeurs",
          "XVI.- L'homme qui te ressemble", "XVII.- Âmes sœurs",
          "XVIII.- Le tam-tam de l'esclave", "XIX.- Petit poème de minuit",
          "XX.- Témoignage", "XXI.- Black", "XXII.- Prière à ma muse",
          "Les Blancs partis", "I- Au seuil du recueil",
          "II- Le corps du texte", "III- Au cœur du recueil"]


def poeme(debut, fin):
    """Un poème entier, découpé entre son premier et son dernier vers."""
    return source.extrait(CLE, debut, arrivee=fin, arret=BORNES)


# ============================================================ 1. J'ouvre

def partie1():
    return [h1("Œuvre 3 — Petites gouttes de chant pour créer l'Homme, "
               "de René Philombe")] + ouvrir(
        "Petites gouttes de chant pour créer l'Homme", "René Philombe",
        questions_couverture=[
            "Lis le titre lentement. **Créer l'Homme** — avec une majuscule. "
            "Le mot *homme* désigne-t-il ici un monsieur, ou autre chose ?",
            "**Petites gouttes.** Qu'est-ce qu'une goutte peut bien faire "
            "contre quelque chose de grand ? Cherche un proverbe qui parle "
            "de gouttes.",
            "Un livre peut-il créer un homme ? Réponds honnêtement, en deux "
            "lignes. On relira ta réponse à la fin.",
            "Le volume contient aussi un long poème intitulé *Les Blancs "
            "partis, les Nègres dansent*. Que t'annonce ce titre ?"],
        promesses=[
            "De quoi la poésie peut-elle parler, à part de l'amour et de la "
            "nature ?",
            "Un poème doit-il rimer pour être un poème ?",
            "Peut-on se mettre en colère en vers ?",
            "À qui le poète s'adresse-t-il ?"],
        journal_exemple=["12/01", "Poèmes I à IV",
                         "Le même vers revient trois fois dans le premier "
                         "poème",
                         "Pourquoi *l'homme s'est éloigné de l'homme* et non "
                         "*des hommes* ?"])


# ================================================= 2. L'auteur et son livre

def partie2():
    return [
        h2("2. L'auteur et son livre"),
        h3("René Philombe"),
        p("**René Philombe** est un écrivain camerounais. Le volume que tu "
          "tiens donne, en tête, la liste de ses livres : des contes "
          "(*Lettres de ma cambuse*, prix Mottart de l'Académie française "
          "1966), des romans (*Sola ma chérie*, *Un Sorcier blanc à "
          "Zangali*), du théâtre (*Les Trouble-fête d'Afrikapolis*), de la "
          "poésie (*Hallalis et chansons nègres*), et même une histoire du "
          "livre camerounais (*Le Livre camerounais et ses auteurs*)."),
        enc("perso", "Un écrivain traduit à Zurich et à Moscou", [
            "Regarde la liste des œuvres, au début du volume : ses livres "
            "ont été traduits **en anglais** (Washington), **en allemand** "
            "(Francfort, Berlin, Zurich) et **en russe** (Moscou).",
            "Un poète camerounais lu en quatre langues, publié à Yaoundé "
            "par les **Éditions CLE** et par les **Éditions Semences "
            "africaines** : voilà ce que c'est qu'une œuvre.",
            "**À retenir :** on peut écrire depuis Yaoundé et être lu "
            "partout. Ce recueil en est la preuve imprimée."]),
        h3("Ce qu'est un recueil"),
        p("Un **recueil** n'est pas un livre à histoire. C'est une "
          "collection de poèmes rangés dans un ordre choisi par le poète. "
          "Celui-ci en compte **vingt-deux**, numérotés en chiffres romains "
          "de I à XXII, et se termine par un long poème séparé : *Les Blancs "
          "partis, les Nègres dansent*."),
        grille([["N°", "Titre", "Ce dont il parle"],
                ["I", "L'homme s'est éloigné de l'homme", "le vers qui donne "
                 "le ton de tout le recueil"],
                ["II", "Guerre de religions", "on se bat au nom du ciel"],
                ["III", "Chevaux débridés", "ceux que plus rien n'arrête"],
                ["IV", "La voix du ventre", "la faim, et ce qu'elle fait "
                 "dire"],
                ["V", "Macabre", "la mort, sans décoration"],
                ["VI", "Dénonciation civique", "un homme est dénoncé — "
                 "attention à la chute"],
                ["VII", "Conseil à un maître", "des conseils que le maître "
                 "n'aimera pas"],
                ["VIII", "Et tu danses, homme", "la danse comme accusation"],
                ["IX-XI", "Le feu · Poème à déclamer sur la lune · Mon "
                 "chemin", "trois poèmes courts"],
                ["XII", "Dix amours de poète", "ce que le poète aime — et le "
                 "dernier n'est pas comme les autres"],
                ["XIII", "Invitation à la danse", "un appel à se lever"],
                ["XIV", "Le hibou", "une histoire d'enfance, puis un sonnet"],
                ["XV", "Les dormeurs", "ceux qui dorment pendant que…"],
                ["XVI", "L'homme qui te ressemble", "le poème le plus connu "
                 "du recueil"],
                ["XVII-XIX", "Âmes sœurs · Le tam-tam de l'esclave · Petit "
                 "poème de minuit", "trois poèmes du milieu"],
                ["XX-XXII", "Témoignage · Black / Immaculée conception · "
                 "Prière à ma muse", "la fin du recueil"]]),
        enc("astuce", "Comment lire un recueil de poèmes", [
            "**Ne le lis pas d'un bout à l'autre comme un roman.** Lis un "
            "poème, ferme le livre, laisse-le travailler.",
            "**Lis à voix haute.** Un poème qu'on lit dans sa tête est un "
            "poème à moitié lu. Philombe écrit pour l'oreille : ses vers "
            "n'ont pas de ponctuation à la fin, c'est le **souffle** qui "
            "coupe.",
            "**Copie les vers qui te frappent** dans ton journal de lecture. "
            "À la fin de l'étude, tu auras ton propre recueil.",
            "**Ne cherche pas la rime partout.** La plupart de ces poèmes "
            "sont en **vers libres** : pas de rime obligatoire, pas de "
            "nombre de syllabes fixe. Ce qui les tient, c'est la "
            "**répétition** et le **rythme**."]),
        h3("Le vers libre, en trois minutes"),
        grille([["Le vers classique", "Le vers libre de Philombe"],
                ["un nombre fixe de syllabes (12, 10, 8)",
                 "des vers de longueurs différentes, parfois d'un seul mot"],
                ["des rimes à la fin", "presque pas de rimes"],
                ["une ponctuation régulière",
                 "peu de ponctuation : le retour à la ligne fait le silence"],
                ["des strophes égales",
                 "des blocs inégaux, séparés par le vers qui revient"]]),
        enc("mot", "Trois mots à connaître avant de commencer", [
            "**Un vers** : une ligne de poème. On dit *un vers*, pas *une "
            "phrase*.",
            "**Une strophe** : un groupe de vers, séparé du suivant par un "
            "blanc.",
            "**Une anaphore** : la répétition d'un même mot ou groupe de "
            "mots **en tête** de plusieurs vers. C'est l'outil préféré de "
            "Philombe — tu le rencontreras dans presque tous les poèmes de "
            "cette étude."]),
        saut()]


# ====================================================== 3. Les mots du recueil

def partie3():
    b = [h2("3. Le monde du recueil"),
         p("Un recueil n'a pas de personnages : il a des **figures**, qui "
           "reviennent d'un poème à l'autre. Apprends-les, et tu les "
           "reconnaîtras partout."),
         grille([["La figure", "Où on la trouve", "Ce qu'elle veut dire"],
                 ["**L'homme**", "partout, dès le titre", "non pas *un* "
                  "homme, mais l'espèce humaine — d'où la majuscule du "
                  "titre : *créer l'Homme*"],
                 ["**Le ventre**", "« La voix du ventre », « esclave du "
                  "ventre et de l'argent »", "la faim, mais aussi l'avidité "
                  "de celui qui s'en met plein"],
                 ["**L'esclave**", "« Le tam-tam de l'esclave », le dernier "
                  "des « Dix amours »", "celui qu'on écrase et qui garde "
                  "« un œil dangereusement ouvert »"],
                 ["**La porte**", "« L'homme qui te ressemble »", "ce qu'on "
                  "ouvre ou qu'on n'ouvre pas à un inconnu"],
                 ["**Le tam-tam et la danse**", "« Et tu danses, homme », "
                  "« Invitation à la danse »", "tantôt l'oubli, tantôt le "
                  "réveil : le même geste, deux sens contraires"],
                 ["**Le hibou**", "poème XIV", "celui qu'on accuse sans "
                  "savoir — et qui rend service la nuit"],
                 ["**Les dormeurs**", "poème XV", "ceux qui laissent faire"]]),
         enc("mot", "Les mots difficiles du recueil", [
             "**Nictitant** : qui cligne (l'œil des étoiles, poème I).",
             "**Un balafon** : instrument à lames de bois, frappé avec des "
             "maillets.",
             "**Un holocauste** : à l'origine, un sacrifice où tout est "
             "brûlé.",
             "**Un augure** : un présage, un signe annonçant l'avenir. Le "
             "hibou est dit « oiseau des funestes augures ».",
             "**Famélique** : affamé, maigre de faim.",
             "**Un potentat** : un chef qui gouverne sans contrôle.",
             "**Fratricide** : qui tue son frère."]),
         enc("culture", "Pourquoi tant de majuscules ?", [
             "Philombe écrit souvent **Homme**, **Nuit**, **Aurore** avec "
             "une majuscule, alors que la grammaire ne l'exige pas.",
             "Une majuscule au milieu d'un texte transforme un mot ordinaire "
             "en **personnage**. La nuit devient quelqu'un ; l'homme devient "
             "l'humanité entière.",
             "**Repère-les en lisant** : chaque majuscule inattendue est un "
             "coup de projecteur."])]

    e, c = jeux.relier(
        "Chaque figure à sa place",
        [("L'homme", "L'espèce entière, celle qu'il s'agit de « créer »"),
         ("Le ventre", "La faim — et l'avidité de ceux qui n'ont pas faim"),
         ("L'esclave", "Il plie l'échine, un œil dangereusement ouvert"),
         ("La porte", "Ce qu'on n'ouvre pas à l'inconnu qui frappe"),
         ("Le hibou", "Accusé par tout un village, utile à tout un village"),
         ("Les dormeurs", "Ceux qui trouvent qu'on est bien ici")],
        graine=419)
    b += e
    b.append(saut())
    return b, c


# ======================================================= 4. Lectures suivies

def partie4():
    b = [h2("4. Je lis l'œuvre — six lectures suivies"),
         p("Six poèmes, **entiers**. On ne coupe pas un poème : un morceau "
           "de poème ne veut plus rien dire, comme une phrase dont on aurait "
           "retiré le verbe.")]

    b += lecture_suivie(
        1, "Le vers qui revient (poème I, « L'homme s'est éloigné de "
           "l'homme »)",
        situation=[
            "C'est le premier poème du recueil, et il donne son programme à "
            "tout le livre.",
            "Lis-le d'abord **sans t'arrêter**, à voix haute. Puis compte "
            "combien de fois revient le vers du titre."],
        texte=poeme("Regard louche", "ce lourd soleil de son cœur d'homme"),
        source=SRC + ", poème I (poème entier)",
        questions=[
            "Combien de fois le vers « l'homme s'est éloigné de l'homme » "
            "revient-il ? Où est-il placé chaque fois ?",
            "Les trois premiers vers sont très courts. Relève-les. Que "
            "décrivent-ils ? Quelle partie du corps chacun désigne-t-il ?",
            "« Esclave du ventre et de l'argent / esclave de sa peau et de "
            "son cerveau ». Explique chacun des quatre esclavages.",
            "Relève les mots qui décrivent le ciel. Quelle couleur revient ? "
            "À quoi est-elle comparée ?",
            "« l'œil nictitant des étoiles » : cherche le mot. Que fait "
            "l'auteur aux étoiles en employant ce mot ?",
            "Le poème dit *l'homme*, jamais *les hommes*. Pourquoi, à ton "
            "avis ?",
            "Y a-t-il des rimes ? De la ponctuation à la fin des vers ? "
            "Qu'est-ce qui tient le poème ensemble, alors ?"],
        grille_lecture=[
            ("Que le poème tourne autour d'une phrase",
             "L'anaphore : le retour du même vers"),
            ("Que l'homme est réduit à des morceaux",
             "Les noms de parties du corps, sans article ni verbe"),
            ("Que le monde entier a changé de couleur",
             "Le champ lexical de la couleur et de l'orage"),
            ("Que le poème n'a presque pas de ponctuation",
             "Les retours à la ligne, qui remplacent les virgules")],
        bilan=[
            "Le recueil s'ouvre sur un **constat**, pas sur une émotion.",
            "Regarde le début : « Regard louche / bouche hypocrite / oreille "
            "bouchée ». Trois vers, trois organes, trois adjectifs — et **pas "
            "un seul verbe**. L'homme n'est plus une personne : il est un "
            "assemblage de morceaux qui fonctionnent mal.",
            "Puis le vers-refrain tombe : *l'homme s'est éloigné de "
            "l'homme*. Il reviendra. C'est une **anaphore**, et elle fait ce "
            "que fait un tam-tam : elle frappe toujours au même endroit.",
            "Note enfin le paradoxe du titre du recueil. Si l'homme s'est "
            "éloigné de l'homme, alors il faut le **créer** — et c'est ce "
            "que le livre annonce de faire, avec de petites gouttes de "
            "chant."],
        forme="vers",
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Louche** : qui n'est pas franc, qui inspire la méfiance.",
                "**D'antan** : d'autrefois.",
                "**Nictitant** : qui cligne.",
                "**Une pelure** : une mince épaisseur, comme la peau d'un "
                "fruit."]),
            ("jeu", "Fabrique ton refrain", [
                "Écris **trois vers de deux mots** sur le modèle « Regard "
                "louche / bouche hypocrite / oreille bouchée » : un nom, un "
                "adjectif, et rien d'autre.",
                "Puis invente **un vers-refrain** de six à huit mots, que tu "
                "répéteras trois fois.",
                "Tu viens d'écrire la charpente d'un poème. Le reste, ce "
                "sont des images entre deux refrains."])])

    b += lecture_suivie(
        2, "La chute (poème VI, « Dénonciation civique »)",
        situation=[
            "Ce poème est court, et il est construit comme un piège.",
            "**Lis-le à voix haute jusqu'au bout sans t'arrêter, et ne "
            "regarde pas la fin d'avance.** Tu ne pourras le lire qu'une "
            "seule fois pour la première fois."],
        texte=poeme("Ouvrez les yeux, regardez-le",
                    "le plus affreux terroriste de notre peuple."),
        source=SRC + ", poème VI (poème entier)",
        questions=[
            "À qui le poème s'adresse-t-il ? Relève les verbes à "
            "l'impératif.",
            "Qui est désigné par « le » dans « regardez-le » ? À quel moment "
            "du poème l'apprends-tu ?",
            "Relève tout ce que cet homme fait — ou ne fait pas.",
            "Quel est le dernier mot du poème ? Qu'est-ce que tu croyais "
            "avant de l'avoir lu ?",
            "Explique le titre : que veut dire **dénonciation civique** ? "
            "Le titre est-il sérieux, ou moqueur ?",
            "Le poème accuse-t-il l'homme dont il parle, ou ceux à qui il "
            "parle ? Justifie.",
            "Réécris les quatre premiers vers **en prose**. Que perd le "
            "texte ?"],
        grille_lecture=[
            ("Que le poème donne un ordre",
             "Les verbes à l'impératif, en tête de vers"),
            ("Que l'accusé est décrit par ce qui lui manque",
             "Les tournures négatives et restrictives : *ne… que*"),
            ("Que la fin retourne le poème",
             "Le dernier vers, et le mot qui le termine"),
            ("Que le titre est ironique",
             "L'écart entre le mot *civique* et ce que fait le poème")],
        bilan=[
            "Un poème de moins de vingt vers, et il tient sur un seul "
            "effet : **la chute**.",
            "Toute la première partie décrit un homme minuscule : « Il ne "
            "peut prendre qu'un seul petit repas / Il ne peut dormir que "
            "dans un seul petit lit / Il ne peut loger que sous un seul "
            "petit toit ». La construction *ne… que* revient, et l'adjectif "
            "*petit* aussi. On croit lire un poème sur la modestie.",
            "Puis vient le dernier vers, et le mot **terroriste**. Tout ce "
            "qu'on vient de lire change de sens d'un coup.",
            "**C'est la chute** : le dernier vers d'un poème peut retourner "
            "tous les autres, comme la dernière phrase d'une blague. Retiens "
            "l'outil — tu l'emploieras dans tes propres textes.",
            "Et pose-toi la vraie question, celle que le poème te tend : "
            "qui, dans ce texte, se conduit mal ? Celui qu'on dénonce, ou "
            "ceux à qui l'on demande d'ouvrir les yeux ?"],
        forme="vers",
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Civique** : qui concerne le citoyen et son devoir envers "
                "la cité.",
                "**Une dénonciation** : le fait de signaler quelqu'un à "
                "l'autorité.",
                "**Affreux** : qui fait horreur.",
                "**Un peuple** : l'ensemble des habitants d'un pays."]),
            ("rire", "Le titre le plus ironique du recueil", [
                "« Dénonciation **civique** » : le mot *civique* est un mot "
                "noble. On l'emploie pour le devoir, le vote, le service "
                "rendu à tous.",
                "Le collant à *dénonciation*, Philombe fabrique une "
                "expression que les régimes de peur emploient sérieusement — "
                "et il la fait sonner faux.",
                "**Un titre peut être une arme.** Lis les vingt-deux titres "
                "du recueil et cherche les autres."])])

    b += lecture_suivie(
        3, "Danser pendant ce temps-là (poème VIII, « Et tu danses, homme »)",
        situation=[
            "Le poème s'ouvre sur une question — répétée, insistante, "
            "sans point d'interrogation.",
            "Quelqu'un cherche l'homme et ne le trouve pas. Pendant ce "
            "temps, on danse."],
        texte=poeme("Où es-tu homme homme où es-tu",
                    "aux rythmes rouges des râles."),
        source=SRC + ", poème VIII (poème entier)",
        questions=[
            "Recopie le premier vers. Combien de fois le mot *homme* y "
            "apparaît-il ? Que produit cette répétition à l'oreille ?",
            "Relève tous les vers qui commencent par « Et tu danses ». "
            "Combien y en a-t-il ?",
            "Quels sont les autres verbes appliqués à *tu* ? Que fait ce "
            "*tu* pendant tout le poème ?",
            "Relève ce qui se passe **autour** de la danse : les images "
            "violentes, les mots du malheur.",
            "« aux rythmes rouges des râles » : explique cette expression "
            "mot à mot. Quelles sensations y sont mêlées ?",
            "Qui est le *tu* du poème, à ton avis ? Le poète parle-t-il à un "
            "seul homme, ou à quelqu'un d'autre ?",
            "La danse est-elle une joie, dans ce poème ? Justifie ta "
            "réponse par deux relevés."],
        grille_lecture=[
            ("Que le poème est une interpellation",
             "La deuxième personne : *tu*, *es-tu*, *tu danses*"),
            ("Que le reproche revient sans cesse",
             "L'anaphore « Et tu danses »"),
            ("Que le monde autour est en feu",
             "Le champ lexical de la violence et de la souffrance"),
            ("Que les sensations se mélangent",
             "Les alliances de mots : une couleur pour un son")],
        bilan=[
            "Un poème entier construit sur **un reproche répété**.",
            "Le premier vers pose la question — *Où es-tu homme homme où "
            "es-tu* — et la répétition du mot *homme*, sans virgule, imite "
            "un appel qu'on lance dans le noir.",
            "Puis, à chaque strophe, le même constat tombe : **et tu "
            "danses**. Ce n'est pas une danse de fête. C'est une danse "
            "pendant que. Le poème ne dit jamais *tu as tort* : il place la "
            "danse à côté du malheur, et le rapprochement suffit.",
            "Regarde l'expression finale : « aux rythmes rouges des râles ». "
            "Un **rythme** s'entend, une couleur **rouge** se voit, un "
            "**râle** est le souffle d'un mourant. Trois sens mêlés en "
            "quatre mots : on appelle cela une **synesthésie**, et c'est "
            "l'un des grands outils de la poésie moderne.",
            "**À retenir :** en poésie, accuser, c'est souvent simplement "
            "**mettre deux choses côte à côte**."],
        forme="vers",
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Un râle** : le souffle rauque d'un agonisant.",
                "**Une synesthésie** : le mélange de deux sens dans une même "
                "image (un son coloré, un parfum sonore).",
                "**Interpeller** : s'adresser à quelqu'un brusquement, pour "
                "le mettre en cause."]),
            ("defi", "Trouve l'autre danse", [
                "Le recueil contient un second poème de danse : le numéro "
                "**XIII, « Invitation à la danse »**.",
                "Va le lire. La danse y a-t-elle le même sens qu'ici ?",
                "Écris **trois lignes** comparant les deux poèmes. C'est "
                "exactement le genre de question qu'on te posera à "
                "l'examen."])])

    b += lecture_suivie(
        4, "L'oiseau qu'on brûle (poème XIV, « Le hibou »)",
        situation=[
            "Ce poème n'est pas comme les autres : il commence **en "
            "prose**. Le poète raconte d'abord un souvenir d'enfance, puis "
            "il donne le poème.",
            "Lis les deux parties à la suite, sans t'arrêter entre elles."],
        texte=poeme("Rares sont ceux qui, en Afrique noire",
                    "de nuit et de mystère."),
        source=SRC + ", poème XIV (poème entier : la partie en prose "
                     "et le sonnet)",
        questions=[
            "Où s'arrête la prose ? Où commence le poème ? Comment le "
            "vois-tu ?",
            "Que dit-on du hibou dans le village ? Relève la phrase exacte. "
            "Quelqu'un l'explique-t-il ?",
            "Raconte en trois lignes la scène dont l'enfant a été témoin.",
            "« qui marqua mon cœur au fer rouge » : explique l'image. "
            "D'où vient-elle ?",
            "Qu'apprend le poète plus tard, à l'école, sur le hibou ?",
            "Compte les vers du poème et les syllabes du premier. Comment "
            "s'appelle un poème de cette forme ?",
            "Recopie les deux derniers vers. Que compare-t-on à quoi ? "
            "Explique la leçon."],
        grille_lecture=[
            ("Que le texte passe de la prose au vers",
             "La disposition sur la page, et la longueur des lignes"),
            ("Que la croyance ne s'explique pas",
             "Les phrases qui rapportent ce qu'on dit sans le justifier"),
            ("Que le savoir vient corriger la peur",
             "Ce qui est appris à l'école, et le mot *or* qui l'introduit"),
            ("Que le poème est régulier, contrairement aux autres",
             "Les rimes et le nombre de syllabes")],
        bilan=[
            "Voici le texte le plus utile du recueil pour un élève de "
            "troisième, parce qu'il **raisonne**.",
            "Regarde la marche : d'abord ce que tout le monde dit (« C'est "
            "un oiseau de malheur ! ») ; ensuite le constat que **personne "
            "ne l'explique** ; puis le souvenir — un hibou brûlé vif par des "
            "villageois convaincus ; puis, des années plus tard, l'école, et "
            "la vérité : le hibou est un oiseau utile.",
            "**C'est un raisonnement complet**, celui-là même qu'on te "
            "demandera dans un devoir argumentatif : la thèse adverse, son "
            "absence de preuve, l'exemple vécu, la thèse défendue.",
            "Et la forme change avec le propos : le poème final est un "
            "**sonnet**, avec des rimes et des alexandrins, alors que tout "
            "le recueil est en vers libres. Quand Philombe veut donner une "
            "leçon de sagesse, il emprunte la forme la plus rangée qui soit.",
            "La chute est un proverbe : le sage, comme le hibou, « couvre "
            "son bienfait de nuit et de mystère » — il fait le bien sans le "
            "faire savoir."],
        encadres=[
            ("animal", "Le hibou, pour de vrai", [
                "Le hibou est un **rapace nocturne**. Il chasse la nuit et "
                "mange surtout des **rongeurs** : rats, souris, musaraignes.",
                "Un seul couple peut consommer plusieurs milliers de "
                "rongeurs par an. Or ce sont les rongeurs qui ravagent les "
                "greniers et les récoltes.",
                "**Autrement dit :** l'oiseau qu'on brûlait protégeait les "
                "réserves du village. C'est exactement ce que dit le poème — "
                "et le poème avait raison avant les manuels."]),
            ("mot", "Les mots difficiles", [
                "**Un augure** : un présage.",
                "**Funeste** : qui annonce ou apporte le malheur.",
                "**Un écervelé** : quelqu'un qui n'a pas de tête.",
                "**Un sonnet** : poème de quatorze vers, deux quatrains puis "
                "deux tercets.",
                "**Un bienfait** : le bien qu'on fait à quelqu'un."])])

    b += lecture_suivie(
        5, "La porte (poème XVI, « L'homme qui te ressemble »)",
        situation=[
            "C'est le poème le plus connu de René Philombe, et l'un des plus "
            "récités d'Afrique.",
            "Quelqu'un frappe à une porte. Il parle pendant tout le poème. "
            "On ne saura jamais si on lui a ouvert."],
        texte=poeme("J'ai frappé à ta porte", "l'homme qui te ressemble."),
        source=SRC + ", poème XVI (poème entier)",
        questions=[
            "Qui parle dans ce poème ? À qui ? Relève les marques des deux "
            "personnes.",
            "Relève les vers qui commencent par « J'ai frappé » et par "
            "« ouvre-moi ». Combien de fois reviennent-ils ?",
            "Que demande exactement celui qui frappe ? Fais la liste : ce "
            "n'est pas ce qu'on croit.",
            "Relève tout ce que l'homme n'est pas — les différences qu'il "
            "énumère lui-même.",
            "Recopie le dernier vers. En quoi répond-il à tout le poème ?",
            "Pourquoi le poème ne dit-il pas si la porte s'est ouverte ? "
            "Qu'est-ce que cela change pour le lecteur ?",
            "Apprends les six derniers vers par cœur. (Oui, c'est une "
            "question : on te les demandera un jour.)"],
        grille_lecture=[
            ("Que le poème est une demande",
             "Les impératifs : *ouvre-moi*, et les verbes de la prière"),
            ("Que la demande est minuscule",
             "Les compléments des verbes : ce qui est réellement demandé"),
            ("Que les différences sont énumérées pour être écartées",
             "Les termes de la couleur, de la taille, de la forme"),
            ("Que le dernier vers renverse tout le reste",
             "Le mot *ressemble*, et à qui il renvoie")],
        bilan=[
            "Six vers de plus qu'une chanson, et le poème le plus cité de "
            "toute la poésie camerounaise.",
            "Le mécanisme est d'une simplicité redoutable. **On frappe.** On "
            "énumère toutes les raisons qu'on pourrait avoir de ne pas "
            "ouvrir — la couleur, la forme, la différence. Puis on dit ce "
            "qu'on demande, et ce n'est presque rien.",
            "Et le dernier vers referme le piège : celui qui frappe est "
            "**l'homme qui te ressemble**. Tout ce qui séparait était de "
            "surface ; ce qui reste est commun.",
            "Note l'**anaphore** — le retour de *ouvre-moi* — et note "
            "surtout que le poème **n'insulte personne**. Il ne dit pas : tu "
            "es un raciste. Il dit : ouvre. C'est pour cela qu'on le récite "
            "encore.",
            "Un poème qui tient en une page peut faire ce qu'un discours "
            "d'une heure ne fait pas. **Apprends-le.**"],
        forme="vers",
        encadres=[
            ("culture", "Un poème qui a voyagé", [
                "Ce texte est appris par cœur dans les écoles de plusieurs "
                "pays d'Afrique. On le récite, on le chante, on l'affiche.",
                "Ce n'est pas un hasard : il est **court**, il est **facile "
                "à retenir** grâce à ses répétitions, et il dit une chose "
                "que tout le monde comprend sans explication.",
                "**Ce que ça t'apprend sur l'écriture :** ce qui se retient "
                "est ce qui se répète. Si tu veux qu'on se souvienne d'une "
                "de tes phrases, répète-la."]),
            ("jeu", "À toi de frapper", [
                "Écris **huit vers** commençant tous par « J'ai frappé à ta "
                "porte » ou « Ouvre-moi ».",
                "Choisis toi-même qui frappe : un élève nouveau dans "
                "l'établissement, quelqu'un qui vient d'ailleurs, un "
                "camarade qu'on ne veut pas dans l'équipe.",
                "**Une seule contrainte :** ta dernière ligne doit "
                "retourner le poème, comme Philombe retourne le sien."])])

    b += lecture_suivie(
        6, "Le tam-tam et l'aurore (poème XVIII, « Le tam-tam de "
           "l'esclave »)",
        situation=[
            "Un homme enchaîné parle. Il parle du passé, du présent et de "
            "l'avenir en même temps — le premier vers le dit tout de suite.",
            "C'est l'un des poèmes les plus difficiles du recueil, et l'un "
            "des plus beaux. Lis-le deux fois."],
        texte=poeme("Après-hier et avant demain", "Dans la racine humaine."),
        source=SRC + ", poème XVIII (poème entier)",
        questions=[
            "Recopie le premier vers. Comment peut-on être « après-hier et "
            "avant demain » ? Quel moment cela désigne-t-il ?",
            "Relève le vers qui revient dans le poème. Qu'est-ce qui change "
            "d'une reprise à l'autre ? Regarde bien les majuscules.",
            "Quels instruments et quels sons trouve-t-on dans le poème ?",
            "« L'œil rouge de l'holocauste a incendié la Nuit » : explique "
            "l'image. Que représente la Nuit ?",
            "Relève tout ce qui annonce l'aurore, la lumière, l'avenir.",
            "Qui écrira le nom de l'esclave, et où ? Recopie le vers.",
            "Le poème est-il désespéré ou confiant ? Défends ta réponse en "
            "deux relevés."],
        grille_lecture=[
            ("Que le temps du poème est étrange",
             "Les indications de temps, dès le premier vers"),
            ("Que la nuit et l'aurore s'opposent",
             "Les deux champs lexicaux, et les majuscules"),
            ("Que le tam-tam parle",
             "Les verbes dont l'instrument est le sujet"),
            ("Que le poème regarde vers l'avenir",
             "Les verbes au futur")],
        bilan=[
            "Le poème le plus ambitieux du recueil : il tient debout entre "
            "deux temps.",
            "**« Après-hier et avant demain »** : ni le passé, ni le futur, "
            "mais l'instant coincé entre les deux — le présent de celui qui "
            "n'a pas encore été libéré et n'est plus tout à fait esclave.",
            "Puis le vers-refrain revient, et regarde le détail : *« L'œil "
            "rouge de l'holocauste a incendié la Nuit »*, avec une majuscule "
            "— puis, plus loin, *la nuit*, sans majuscule. **Le même vers, "
            "et il n'a plus le même poids.** La Nuit qui était une puissance "
            "devient une nuit ordinaire.",
            "Et le poème finit sur une promesse : *« La plume de l'Aurore "
            "inscrira et mon nom »*. Ce n'est plus l'esclave qui parle de "
            "lui-même : c'est le lever du jour qui écrira son nom.",
            "**Retiens la leçon d'écriture :** répéter un vers en changeant "
            "**une seule lettre** est l'un des gestes les plus puissants de "
            "la poésie. Cherche la majuscule qui a disparu, et tu tiens le "
            "sens du poème."],
        forme="vers",
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Un holocauste** : un sacrifice où la victime est "
                "entièrement brûlée.",
                "**L'aurore** : la première lueur du jour, avant le lever du "
                "soleil.",
                "**Un tam-tam** : tambour africain, qui sert aussi à "
                "transmettre des messages à distance.",
                "**La racine** : ici, ce qu'il y a de plus profond et de "
                "plus ancien dans un être."]),
            ("defi", "L'expérience de la majuscule", [
                "Recopie deux fois la même phrase de ton choix, en changeant "
                "**une seule majuscule** : « la peur est entrée dans la "
                "ville » / « la Peur est entrée dans la ville ».",
                "Fais lire les deux à un camarade et demande-lui laquelle "
                "fait le plus peur.",
                "**Note ce qui s'est passé.** Tu viens de découvrir seul un "
                "procédé que les poètes emploient depuis trois siècles."])])

    b += [h3("Ce qu'il te reste à lire"),
          ("encadre", "lire", "Seize poèmes t'attendent encore", [
              "Tu viens d'en étudier six. Le recueil en compte "
              "**vingt-deux**, et le volume se termine par un long poème "
              "séparé, *Les Blancs partis, les Nègres dansent*.",
              "Va lire au moins : **XII, « Dix amours de poète »** (le "
              "dernier amour n'est pas comme les autres) ; **XV, « Les "
              "dormeurs »** (« Comme il fait bon vivre ici ») ; et **IV, "
              "« La voix du ventre »**.",
              "Choisis-en **un** que tu apprendras par cœur. Un poème appris "
              "à quinze ans reste toute la vie ; c'est le seul bagage qu'on "
              "ne peut pas te confisquer."])]

    b += cote_enseignant([
        "Six séances, six poèmes entiers. Le découpage est le point "
        "sensible : **ne jamais donner un extrait de poème**. Un poème "
        "amputé fausse tout ce qu'on en dira.",
        "Faire lire **à voix haute** à chaque séance, par deux élèves "
        "différents, avant toute analyse. Les vers libres de Philombe se "
        "comprennent par le souffle ; à l'œil seul, ils paraissent "
        "obscurs.",
        "Le poème VI (« Dénonciation civique ») repose entièrement sur sa "
        "chute : ne pas la déflorer, ne pas distribuer le texte à l'avance, "
        "faire lire jusqu'au bout d'une traite.",
        "Le poème XVIII évoque l'esclavage et le poème VIII la violence "
        "politique. Conduire l'échange sur ce que le texte fait — le "
        "rapprochement, la répétition, la majuscule qui tombe — plutôt que "
        "sur l'actualité, qui emporterait la séance ailleurs.",
        "Prévoir une **récitation notée** en fin de séquence : le poème XVI "
        "s'y prête, et les élèves le retiennent en deux jours.",
        "Le poème XIV, avec sa prose puis son sonnet, prépare directement "
        "l'épreuve d'expression argumentative : y consacrer une séance "
        "entière si le temps manque ailleurs."])
    b.append(saut())
    return b
