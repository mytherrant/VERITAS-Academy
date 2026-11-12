# -*- coding: utf-8 -*-
"""6ᵉ — *Les Chants de la Forêt* : les six lectures suivies.

Chaque extrait fait **plus de cinq cents mots** et sort tel quel du recueil :
il est découpé par `source.extrait`, jamais retapé. La liste `CONTES` sert de
garde — un passage long s'arrête avant le titre du conte suivant, sans quoi
l'élève lirait deux histoires en croyant n'en lire qu'une.

Les six contes retenus ne sont pas les six premiers : ce sont les six qui
dépassent cinq cents mots **et** qui couvrent l'ensemble du recueil, du
premier conte au dernier, en passant par les trois familles que l'auteur
distingue lui-même dans ses Notes pédagogiques — les bêtes entre elles, les
hommes avec les esprits, et les récits qui expliquent le monde.
"""
import source
from gabarit import cote_enseignant, lecture_suivie
from kit import h2, p, saut

CLE = "chants"
SRC = "Lucien Anya Noa, *Les Chants de la Forêt*, Afrédit, Yaoundé, 2011"

# Les dix-huit titres du sommaire : ils bornent les découpes.
CONTES = [
    "L'intelligence, l'aînée de la force", "La sagesse et la folie",
    "La parole vaut contrat", "Le mariage de Kulu",
    "Le caméléon et le margouillat", "Si Dieu le permet",
    "Le chien et le chimpanzé", "Tromperie n'est pas amitié",
    "Les deux jeunes gens", "La vérité vaut mieux que le mensonge",
    "Si tu entends dire", "Il n'y a qu'une vérité",
    "Trop de conseils rendirent le varan sourd",
    "La mère, le père et le chimpanzé", "Kulu la Tortue et Ndoe l'Aigle",
    "Kulu, Zee et les cabris", "La mère de Léopard",
    "Le chant du bigorneau", "L'ORIGINE  DES CONTES",
]


def _x(amorce, mots=600):
    """Un extrait long, borné par les titres voisins."""
    voisins = [t for t in CONTES if source.plat(t) not in source.plat(amorce)]
    return source.extrait(CLE, amorce, mots=mots, arret=voisins)


def partie4():
    b = [h2("4. Je lis l'œuvre — six lectures suivies"),
         p("Six séances, six contes entiers. À chaque fois la même marche : on "
           "**situe** le passage, on le **lit**, on remplit une **grille**, on "
           "en tire un **bilan**. Quatre étapes, pas une de plus — mais toutes "
           "les quatre, vraiment."),
         p("Les six contes ont été choisis pour couvrir tout le recueil : le "
           "premier, le dernier, et quatre autres pris entre les deux. Quand tu "
           "auras fini, tu connaîtras le livre par ses quatre coins.")]

    # ------------------------------------------------------------- séance 1
    b += lecture_suivie(
        1, "La course truquée (« L'intelligence, l'aînée de la force »)",
        situation=[
            "C'est le tout premier conte du recueil. Zee le Léopard a traîné "
            "Mvomo le Python devant le tribunal des animaux : ils s'étaient "
            "partagé la brousse — la savane au python, la forêt au léopard — "
            "et le python franchit la limite pour chasser.",
            "Le procès est reporté de cinq jours, parce que Dzungo'o le "
            "Caméléon est arrivé en retard. Furieux, Zee se moque de la "
            "lenteur de Kulu la Tortue et le compare au caméléon. Vexé, Kulu "
            "le défie **à la course**. Chacun met sa fille en gage. Toute la "
            "forêt se tord de rire.",
            "Tu vas lire la préparation du coup, la course, et son résultat."],
        texte=_x("Dès que Kulu eut quitté"), source=SRC,
        questions=[
            "Kulu commence par citer une parole de ses pères. Recopie-la "
            "exactement, guillemets compris.",
            "Combien y a-t-il de bandes de terre à franchir ? Combien de cours "
            "d'eau ? Combien d'enfants Kulu doit-il donc placer ?",
            "Explique le plan de Kulu **comme si tu le racontais à un ami** : "
            "trois phrases, pas plus.",
            "Sur quoi Zee compte-t-il, lui ? Relève le mot exact employé par "
            "Kulu pour le dire.",
            "Relève **trois** passages où le conteur montre que les animaux "
            "rient. Que gagne l'histoire à ce que tout le monde se moque de "
            "Kulu au début ?",
            "Quand Zee comprend qu'il a perdu, il n'accuse pas la ruse : il "
            "accuse autre chose. Quoi ? Pourquoi est-ce plus facile pour lui ?",
            "**Question qui fâche.** Kulu triche. Gagne-t-il honnêtement ? "
            "Donne ton avis et justifie-le par un passage du texte."],
        grille_lecture=[
            ("Que Kulu prépare son coup à l'avance",
             "Les verbes d'organisation (**appela**, **dit**, **partirent**)"),
            ("Que la ruse s'oppose à la force",
             "Les couples de mots contraires (**intelligence** ≠ **force "
             "musculaire**)"),
            ("Que la forêt entière regarde",
             "Les mots qui désignent le public (**la gent animale**, "
             "**chaque spectateur**)"),
            ("Que le conteur s'adresse à ceux qui l'écoutent",
             "Les formules lancées à l'auditoire (« Que les oreilles "
             "s'ouvrent ! »)")],
        bilan=[
            "Le recueil s'ouvre sur une petite équation : **intelligence > "
            "force**. Elle n'est pas démontrée dans un cours ; elle court sur "
            "trois rivières.",
            "Remarque bien ceci : Kulu ne devient jamais rapide. Il reste "
            "lent jusqu'au bout. Il ne cherche pas à gagner au jeu de l'autre — "
            "il **change les règles du jeu**. C'est exactement ce que fait un "
            "élève malin devant un exercice trop dur : il cherche un autre "
            "chemin plutôt que de forcer par le même.",
            "La formule finale est devenue un proverbe : **« L'intelligence "
            "est l'aînée de la force. »** Apprends-la : elle te servira à "
            "l'oral comme à l'écrit."],
        encadres=[
            ("mot", "Les mots difficiles de la séance", [
                "**Un litige** : une dispute qu'on porte devant un juge.",
                "**La gent animale** : le peuple des animaux. « Gent » est un "
                "vieux mot français qui signifie « le peuple, la race ».",
                "**Un gage** : ce qu'on dépose pour garantir qu'on paiera si "
                "l'on perd. Kulu et Zee mettent leur **fille** en gage — cela "
                "dit assez la gravité du pari.",
                "**Crâner** : faire le fier, se vanter.",
                "**Piaffer** : frapper le sol du pied, d'impatience ou de rage."]),
            ("rire", "Le détail que personne ne remarque", [
                "Kulu, caché dans son buisson, ne se contente pas de gagner : "
                "il **tambourine le sol de ses petites pattes** et lance à Zee "
                "qu'il crèvera tout seul à courir.",
                "Le champion officiel de la course est donc, à cet instant "
                "précis, assis dans un buisson en train de ricaner. Anya Noa "
                "aurait pu l'écrire noblement. Il a choisi de nous faire rire.",
                "Et Zee, beau joueur ? Il « eut envie de se suicider ». Trois "
                "fois de suite."])])

    # ------------------------------------------------------------- séance 2
    b += lecture_suivie(
        2, "Une poutre d'eau contre une corde de fumée (« Le mariage de Kulu »)",
        situation=[
            "Quatrième conte du recueil. Zameyo Mebenga a une fille si belle "
            "que, dit le texte, « la fièvre gagna tout le pays » : chacun veut "
            "l'épouser.",
            "Le père pose alors une condition. Une seule. Et tous les jeunes "
            "gens du pays viennent, essaient, et rentrent chez eux.",
            "Puis Kulu entend parler de l'affaire."],
        texte=_x("Zameyo Mebenga avait engendré"), source=SRC,
        questions=[
            "Quelle est **exactement** la condition posée par Zameyo Mebenga ? "
            "Recopie ses mots.",
            "Pourquoi tous les jeunes gens repartent-ils ? Qu'est-ce qui est "
            "impossible dans cette demande ?",
            "Avant d'aller à la rivière, Kulu réclame une seule chose. "
            "Laquelle ? Pourquoi cette demande est-elle capitale pour la suite ?",
            "Kulu envoie l'enfant chercher une hache. À quoi lui sert-elle "
            "vraiment ? (Attention : ce n'est pas à couper.)",
            "Recopie la demande que Kulu fait porter à Zameyo Mebenga. "
            "Explique en une phrase pourquoi elle est si maligne.",
            "Que répond le père ? Relève la phrase où il reconnaît sa défaite, "
            "et le surnom qu'il donne alors à Kulu.",
            "Le conte se ferme sur un proverbe. Recopie-le. À ton avis, que "
            "veut-il dire ?"],
        grille_lecture=[
            ("Que la demande est impossible",
             "Les groupes de mots qui collent ensemble deux choses "
             "incompatibles (**poutre d'eau**, **corde de fumée**)"),
            ("Que tout le pays s'y est cassé les dents",
             "Les mots qui disent le grand nombre (« se remplit à craquer », "
             "« aucun ne manquait »)"),
            ("Que Kulu joue la comédie",
             "Les verbes qui décrivent son agitation dans l'eau"),
            ("Que la foule vient regarder",
             "Le passage où les curieux suivent l'enfant")],
        bilan=[
            "Kulu ne dit jamais : « Ta demande est absurde. » Il fait beaucoup "
            "mieux : il **répond par une absurdité du même genre** et oblige "
            "Zameyo Mebenga à le reconnaître lui-même.",
            "Retiens l'arme, elle sert toute la vie : quand quelqu'un te "
            "réclame l'impossible, ne proteste pas — demande-lui une chose "
            "impossible **symétrique**, et laisse-le conclure.",
            "Remarque aussi la mise en scène. Kulu ne va pas discuter : il "
            "descend dans l'eau, il s'agite, il fait venir une hache, il fait "
            "venir des curieux. **Il se rend crédible avant de poser sa "
            "question.** Sans ce théâtre, sa demande passerait pour de "
            "l'insolence."],
        encadres=[
            ("mot", "Les mots difficiles de la séance", [
                "**Une poutre** : une grosse pièce de bois qui porte un toit. "
                "On la taille dans un tronc — jamais dans une rivière.",
                "**Des volutes** : les rouleaux de fumée qui montent en "
                "tournant.",
                "**Engendrer** : donner naissance à.",
                "**De mauvaise foi** : qui refuse de reconnaître qu'il a tort "
                "alors qu'il le sait parfaitement."]),
            ("jeu", "Fabrique trois demandes impossibles", [
                "La recette de la « poutre d'eau » : **un objet solide + une "
                "matière qui ne l'est pas**.",
                "Pour démarrer : un *panier de vent*, une *échelle de "
                "rivière*, un *tabouret de brouillard*.",
                "À moi : ………………………………  ………………………………  ………………………………",
                "Puis échange avec ton voisin : il doit trouver, comme Kulu, "
                "la demande **symétrique** qui annule la tienne."])])

    # ------------------------------------------------------------- séance 3
    b += lecture_suivie(
        3, "Un pacte avec un revenant (« La parole vaut contrat »)",
        situation=[
            "Changement de monde : ici, plus d'animaux qui plaident. Un homme "
            "rencontre **un revenant** — un mort, un esprit — sur une ligne de "
            "pièges.",
            "Ils deviennent amis et passent un accord très simple : ils "
            "poseront leurs pièges le long du même sentier ; **les bêtes mâles "
            "iront à l'homme, les femelles au revenant**.",
            "Retiens bien les deux mots : mâles / femelles. Tout le conte "
            "tient dans ces deux mots."],
        texte=_x("Il arriva une fois qu'un homme et un revenant"), source=SRC,
        questions=[
            "Recopie les termes exacts du pacte.",
            "À la première inspection, puis à la deuxième, que trouvent-ils ? "
            "Pourquoi l'homme s'affole-t-il d'une telle chance ?",
            "Que répond le revenant, chaque fois qu'on lui propose une part ? "
            "Recopie sa phrase — elle revient trois fois.",
            "Qu'est-ce que l'homme oublie dans la fosse ? Pourquoi ce détail "
            "minuscule est-il le pivot de toute l'histoire ?",
            "Combien de femmes l'homme envoie-t-il, et dans quel ordre ? Que "
            "leur arrive-t-il ?",
            "Quand l'homme arrive enfin à la fosse, que voit-il ? Recopie la "
            "phrase du revenant qui explique tout.",
            "Le revenant a-t-il triché ? Réponds par oui ou par non, puis "
            "justifie ta réponse en citant le pacte du début."],
        grille_lecture=[
            ("Que le pacte est répété pour qu'on ne l'oublie pas",
             "La phrase du revenant qui revient trois fois à l'identique"),
            ("Que la chance de l'homme grandit peu à peu",
             "La suite des prises : quelques bêtes → beaucoup → **un éléphant**"),
            ("Que le malheur se prépare longtemps à l'avance",
             "Le détail de la pipe, glissé sans insistance"),
            ("Que le conteur ralentit au moment fort",
             "Les répétitions de verbes (« il le dépeça, le dépeça, le "
             "dépeça »)")],
        bilan=[
            "Voici un conte qui fait peur sans monstre et sans sang. L'arme "
            "du revenant, c'est **une phrase**. Il n'a pas menti une seule "
            "fois ; il n'a pas changé un mot ; il a simplement appliqué "
            "l'accord jusqu'au bout.",
            "Et l'accord, c'est l'homme qui l'a accepté. Là est la leçon, et "
            "elle est glaçante : **« la parole vaut contrat »**. On ne signe "
            "pas ce qu'on n'a pas relu.",
            "Note la construction, tu la reverras : trois fois la même scène "
            "(inspection, refus du revenant), puis **la fois où tout bascule**. "
            "Le conteur t'a bercé pour mieux te surprendre."],
        encadres=[
            ("culture", "Un revenant, ce n'est pas un fantôme de film", [
                "Dans les contes béti, les morts ne sont pas partis très loin. "
                "Ils habitent un village voisin, ils chassent, ils passent des "
                "accords.",
                "Ils ne sont ni gentils ni méchants : ils sont **exacts**. "
                "C'est bien plus effrayant.",
                "Le conte le dit lui-même : *« Un pacte est dangereux chez "
                "nous les esprits ! »* — l'esprit prévient trois fois. Il n'y "
                "a pas de piège : il y a un homme qui n'écoute pas."]),
            ("mot", "Les mots difficiles de la séance", [
                "**Un revenant** : un mort qui revient parmi les vivants.",
                "**Un pacte** : un accord solennel, qu'on ne peut plus défaire.",
                "**Une fosse** : un grand trou creusé pour piéger le gibier.",
                "**Dépecer** : découper un animal en quartiers.",
                "**Le butin** : ce qu'on rapporte d'une chasse ou d'un combat."])])

    # ------------------------------------------------------------- séance 4
    b += lecture_suivie(
        4, "Deux amis, deux secrets, deux trahisons (« Le chien et le chimpanzé »)",
        situation=[
            "Le chien et le chimpanzé partent ensemble faire la cour **à la "
            "même jeune fille**. Avant de partir, chacun confie à l'autre sa "
            "faiblesse et lui demande de la couvrir.",
            "Lis très attentivement ce pacte : toute la suite en dépend, et "
            "l'histoire explique, à la dernière ligne, une chose que tu "
            "constates encore aujourd'hui dans ta cour."],
        texte=_x("Un jour le chien et le chimpanzé allaient"), source=SRC,
        questions=[
            "Quelle est la faiblesse du chien ? Que demande-t-il donc au "
            "chimpanzé de ne jamais faire ?",
            "Recopie la réponse du chimpanzé. Quelle image emploie-t-il pour "
            "dire qu'il a bien entendu ?",
            "Quelle est la faiblesse du chimpanzé ? Que demande-t-il en retour ?",
            "La jeune fille hésite et va consulter sa mère. Recopie le conseil "
            "de la mère. Trouves-tu ce conseil juste ?",
            "Vers qui la jeune fille penche-t-elle **d'abord** ? Et pourquoi "
            "change-t-elle d'avis ?",
            "Le chimpanzé jette l'os **exprès**. Qu'espère-t-il ? Cela "
            "marche-t-il ?",
            "Relève deux passages où le conteur s'adresse directement à toi. "
            "Que t'y demande-t-il ?"],
        grille_lecture=[
            ("Qu'il s'agit d'une promesse solennelle",
             "Les mots du serment (« je t'interdis », « de la manière la plus "
             "absolue »)"),
            ("Que les deux amis se parlent avec beaucoup de respect",
             "Les façons de s'appeler (« ô fils de la famille de mon père »)"),
            ("Que la mère énonce la morale avant la fin",
             "Ses deux phrases sur la beauté et les vertus"),
            ("Que le conte explique une chose d'aujourd'hui",
             "La dernière phrase, qui commence par « Voilà pourquoi »")],
        bilan=[
            "Ce conte appartient à une famille précise, très répandue : les "
            "contes qui **expliquent pourquoi le monde est comme il est**. "
            "Pourquoi le chien et le singe se détestent ; pourquoi la mer "
            "rejette les corps ; pourquoi le léopard massacre les chèvres. "
            "Trois de ces contes sont dans ton recueil.",
            "Ce sont des explications inventées, bien sûr. Mais elles font "
            "quelque chose de sérieux : elles rendent le monde **lisible**. "
            "Rien n'y arrive sans raison.",
            "La leçon morale, elle, est amère : les deux amis se sont "
            "**mutuellement** trahis, et chacun a utilisé le secret que "
            "l'autre lui avait confié. Personne n'a raison à la fin. C'est "
            "souvent ainsi dans les vraies disputes — y compris les tiennes."],
        encadres=[
            ("perso", "Le mot de passe : « fils de mon père »", [
                "Dans tout le recueil, les personnages s'appellent « ô fils de "
                "mon père », « fils de la famille de mon père ».",
                "Ce ne sont pas de vrais frères. C'est une **formule de "
                "politesse** qui signifie : « toi et moi sommes du même monde, "
                "tu peux me faire confiance ».",
                "Et c'est justement quand elle est employée que quelqu'un "
                "s'apprête à trahir. Surveille-la : dans ce livre, elle est "
                "presque un signal d'alarme."]),
            ("rire", "Le conteur qui refuse de tout raconter", [
                "Deux fois, le conteur s'interrompt : « Inutile de fatiguer "
                "l'auditoire », « Toi, essaye d'imaginer les idées que le cœur "
                "du chimpanzé brassait ».",
                "Autrement dit : *je ne vous raconte pas tout, débrouillez-"
                "vous*. C'est une vieille malice de conteur — elle oblige "
                "l'auditoire à travailler, et elle donne l'impression que "
                "l'histoire est trop grande pour tenir dans une soirée."])])

    # ------------------------------------------------------------- séance 5
    b += lecture_suivie(
        5, "Le procès des mâchoires (« Kulu, Zee et les cabris »)",
        situation=[
            "Zee le Léopard a un kolatier derrière sa case, et toute la forêt "
            "sait combien il y tient. Un jour, Kulu vient en cueillir **tous** "
            "les fruits. Il a même une justification toute prête.",
            "Quand Zee découvre l'arbre vide, il entre dans une colère "
            "épouvantable et menace d'exterminer tout ce qui bouge. C'est "
            "alors que Kulu vient lui donner un conseil."],
        texte=_x("En ce temps-là, Zee le Léopard avait un kolatier"), source=SRC,
        questions=[
            "Comment Kulu justifie-t-il sa cueillette ? Recopie son "
            "raisonnement. Te paraît-il honnête ?",
            "Que répond Kulu quand Zee l'accuse ? Relève le mensonge exact.",
            "Quel conseil Kulu donne-t-il à Zee pour découvrir le coupable ? "
            "Recopie-le.",
            "Que crie Zee en convoquant les animaux ? Pourquoi ceux-ci "
            "viennent-ils armés ?",
            "Pourquoi les chèvres et les moutons remuent-ils la bouche ? "
            "Est-ce une preuve ?",
            "Que fait Kulu au moment décisif ? Relève le geste — il tient en "
            "trois mots.",
            "Qu'explique la fin du conte ? Quelle habitude d'aujourd'hui "
            "vient-elle justifier ?"],
        grille_lecture=[
            ("Que Kulu ment avec assurance",
             "Les questions qu'il pose pour paraître innocent"),
            ("Que la colère de Zee est démesurée",
             "Le vocabulaire de la destruction (« anéantir », « exterminer »)"),
            ("Que l'appel de Zee imite un vrai tam-tam",
             "Les répétitions de son cri (« vous tous, tous, tous »)"),
            ("Que la preuve est fausse",
             "La description des bouches qui mâchent (« bôgos, bogos, bègos »)")],
        bilan=[
            "Voici le conte le plus inquiétant du recueil, et il est écrit "
            "pour faire rire. Un innocent est massacré ; le coupable rentre "
            "chez lui « subrepticement ». Personne ne l'a vu.",
            "Comment cela a-t-il été possible ? Parce que Zee a accepté une "
            "**fausse preuve** : des bouches qui remuent. Les chèvres "
            "ruminaient, voilà tout. Elles ruminent encore aujourd'hui.",
            "Retiens la leçon, elle est précieuse et elle vaut pour ta cour "
            "de récréation : **une apparence n'est pas une preuve**. Avant "
            "d'accuser quelqu'un parce qu'« il avait l'air », demande-toi qui "
            "a intérêt à ce que tu l'accuses.",
            "Et méfie-toi de celui qui te souffle la solution un peu trop "
            "vite : dans ce conte, le conseiller est le voleur."],
        encadres=[
            ("animal", "Pourquoi les chèvres remuent-elles la bouche ?", [
                "Parce qu'elles **ruminent** : elles avalent l'herbe, la font "
                "remonter, la remâchent tranquillement pendant des heures.",
                "C'est un mécanisme de digestion, pas un aveu. Le conte "
                "s'appuie sur une observation parfaitement exacte de la nature "
                "— et en tire une catastrophe judiciaire.",
                "Voilà comment on reconnaît un bon conteur : son invention "
                "s'accroche toujours à un détail vrai."]),
            ("mot", "Les mots difficiles de la séance", [
                "**Un kolatier** : l'arbre qui donne les noix de kola.",
                "**Subrepticement** : sans se faire voir, en douce.",
                "**Les caprins** : la famille des chèvres et des boucs.",
                "**Une palabre** : une assemblée où l'on discute une affaire "
                "jusqu'à la régler."])])

    # ------------------------------------------------------------- séance 6
    b += lecture_suivie(
        6, "La voix au fond de la source (« Le chant du bigorneau »)",
        situation=[
            "Dernier conte du recueil, et le plus gai. À la saison où le maïs "
            "mûrit, tous les animaux décident de préparer ensemble un grand "
            "plat de **nsog**, la purée de maïs.",
            "Le maïs est cueilli, les épis raclés — et l'on s'aperçoit qu'il "
            "manque de l'eau. On envoie des coursiers à la source. Ils "
            "reviennent en hurlant.",
            "Ce que tu vas lire est une **chantefable** : un conte où l'on "
            "chante. Prépare-toi à entonner le refrain."],
        texte=_x("C'était à la saison où le maïs"), source=SRC,
        questions=[
            "Que sont venus faire les animaux ? Relève la phrase qui l'annonce.",
            "Recopie les deux premiers vers de la chanson de l'Interdiction. "
            "Qui est « père Ngondzanga » ?",
            "Combien de fois la chanson est-elle répétée dans le conte entier ? "
            "Pourquoi le conteur ne la résume-t-il pas ?",
            "Dans quel ordre les animaux sont-ils envoyés à la source ? "
            "Pourquoi cet ordre-là et pas un autre ?",
            "Comment Zog l'Éléphant part-il ? Comment revient-il ? Relève les "
            "deux phrases et compare-les.",
            "Dans la suite du conte, Kulu réussit. Que fait-il que personne "
            "n'avait fait ? (La réponse est très simple : c'est tout le sel de "
            "l'histoire.)",
            "Une fois le nsog prêt, comment les animaux traitent-ils leur "
            "sauveur ? Trouves-tu la vengeance de Kulu juste ? Explique."],
        grille_lecture=[
            ("Que la chanson est un refrain",
             "Les vers repris mot pour mot à chaque tentative"),
            ("Que les plus gros échouent les premiers",
             "L'ordre des animaux envoyés (Zog, Zee, Emgbeme)"),
            ("Que le conteur se moque des puissants",
             "Les détails ridicules du retour (la cruche oubliée, la langue "
             "pendante)"),
            ("Que la peur se transmet de l'un à l'autre",
             "Les verbes de fuite (« détalèrent », « s'échappa »)")],
        bilan=[
            "Deux leçons dans un seul conte, et elles se contredisent presque.",
            "**Première leçon :** les gros bras ont fui, le petit a réfléchi. "
            "Kulu n'a pas combattu la voix — il est simplement **descendu voir "
            "qui chantait**, et il a posé la question à trois habitants de "
            "l'eau. Poser la question que personne n'ose poser, c'est souvent "
            "toute la solution.",
            "**Deuxième leçon :** à peine le plat est-il prêt qu'on chasse le "
            "sauveur — « Vieux rabougri, ôte-toi de là ». Anya Noa referme son "
            "recueil sur l'ingratitude, et sur une tortue qui mange, seule, "
            "toute la marmite, et rentre chez elle sans plus pouvoir marcher.",
            "C'est ainsi que finit ce livre : par un festin, une injustice et "
            "un éclat de rire. Retiens-le, c'est très exactement la recette du "
            "conte africain."],
        encadres=[
            ("culture", "Le nsog", [
                "Le **nsog** est une purée de maïs : on cueille les épis, on "
                "les racle, on écrase les grains, on cuit à l'eau.",
                "Tout le monde avait apporté le maïs. Il ne manquait que "
                "l'eau — et il a fallu une tortue pour aller la chercher."]),
            ("jeu", "Chantez l'Interdiction, pour de vrai", [
                "Ce refrain revient **quatre fois**, mot pour mot. Ce n'est pas "
                "une erreur d'imprimerie : c'est une **chantefable**, faite "
                "pour être chantée.",
                "Organisez-vous : un élève raconte, la classe entière reprend "
                "le refrain à chaque tentative. Un autre frappe le rythme sur "
                "la table.",
                "Vous découvrirez en trois minutes ce qu'aucune explication ne "
                "peut vous dire : ce livre n'a pas été écrit pour être lu en "
                "silence."])])

    b += cote_enseignant([
        "Six séances de 55 minutes, une par semaine, laissent entre elles le "
        "temps de la lecture personnelle du recueil.",
        "Les six contes retenus couvrent le premier et le dernier texte du "
        "volume ; les douze autres restent au programme de lecture "
        "personnelle, et alimentent le contrôle de lecture.",
        "Le conte 11 (« Si tu entends dire… ») comporte un échange sur la "
        "castration d'un sanglier : à écarter de la lecture à voix haute, ou "
        "à résumer.",
        "Le contrôle de lecture se place utilement après la séance 3 : la "
        "moitié du recueil est alors parcourue.",
        "La chantefable de la séance 6 gagne énormément à être exécutée "
        "réellement, refrain repris par le groupe et rythme frappé."])
    b.append(saut())
    return b
