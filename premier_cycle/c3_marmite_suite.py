# -*- coding: utf-8 -*-
"""3ᵉ — *La marmite de Koka-Mbala* : écrire, jouer, s'évaluer.

Deux ateliers : **le dialogue argumentatif** — la pièce entière est une suite
de gens qui essaient de convaincre un roi — et **l'article de journal**, parce
qu'une classe d'examen doit savoir rendre compte d'un événement en respectant
les faits.
"""
import jeux
import source
from gabarit import (epreuve_etude_texte, epreuve_expression,
                     epreuve_orthographe, production)
from kit import enc, grille, h2, h3, p, saut

CLE = "marmite"
SRC = ("Guy Menga, *La marmite de Koka-Mbala*, "
       "Nouvelles Éditions Numériques Africaines")
BORNES = ["ACTE I", "ACTE II", "L'oracle", "Note sur la pièce", "Personnages",
          "RIDEAU", "Préliminaires", "Résumé", "Auteur"]


# ==================================================== 5. Les productions

def partie5():
    b = [h2("5. J'écris — le dialogue argumentatif et l'article"),
         p("Deux ateliers ici. Avec les deux de l'œuvre précédente et les "
           "deux de la suivante, tu auras couvert ce qu'on te demandera à "
           "l'examen.")]

    b += production(
        "le dialogue argumentatif",
        "écrire un dialogue où deux personnages défendent des positions "
        "opposées, sans qu'aucun ne soit ridicule.",
        modele=(
            "**LE PROVISEUR**, *(feuilletant un dossier, sans lever les "
            "yeux)* : ❶ Vous demandez donc qu'on rouvre la bibliothèque le "
            "samedi.\n"
            "**LA DÉLÉGUÉE** : ❷ Oui, monsieur. Quarante élèves l'ont signé.\n"
            "**LE PROVISEUR** : ❸ Quarante sur mille deux cents. Et qui "
            "surveillera ? Je n'ai pas de personnel le samedi, et je ne peux "
            "pas laisser une salle ouverte sans adulte.\n"
            "**LA DÉLÉGUÉE** : ❹ C'est juste, monsieur. Aussi ne demandons-"
            "nous pas d'ouvrir toute la journée. Deux heures, de huit à dix, "
            "et deux professeurs se sont proposés — leurs noms sont sur la "
            "deuxième page.\n"
            "**LE PROVISEUR**, *(tournant la page)* : ❺ …\n"
            "**LA DÉLÉGUÉE** : ❻ Et si personne ne vient pendant un mois, "
            "monsieur, nous retirons nous-mêmes la demande.\n"
            "**LE PROVISEUR**, *(refermant le dossier)* : ❼ Un mois. Nous "
            "verrons en novembre."),
        annotations=[
            ["❶ La thèse adverse, reformulée",
             "Le proviseur redit la demande — c'est une manière de la "
             "réduire. **Qui reformule domine.**"],
            ["❷ Le premier argument : le nombre",
             "Court. On donne un chiffre, rien de plus."],
            ["❸ La contre-attaque : le chiffre retourné + l'obstacle réel",
             "« Quarante sur mille deux cents. » Puis **la vraie objection** : "
             "la surveillance."],
            ["❹ La concession, puis la réponse",
             "*C'est juste, monsieur* — on accorde **avant** de répondre. Puis "
             "on réduit la demande et on lève l'obstacle."],
            ["❺ Le silence",
             "Trois points. **Un adversaire qui se tait est un adversaire qui "
             "réfléchit** : c'est le sommet de la scène."],
            ["❻ Le pari",
             "On propose soi-même la condition de son échec. Rien ne désarme "
             "davantage."],
            ["❼ La concession finale, minimale",
             "Il n'a pas dit oui. Il a dit « nous verrons ». C'est déjà une "
             "victoire."]],
        questions=[
            "Compte les mots de chaque réplique. Qui parle le plus long au "
            "début ? Et à la fin ? Que révèle ce renversement ?",
            "Relève la concession de l'étape ❹. Par quels mots commence-t-elle ?",
            "À quoi sert l'étape ❺ ? Remplace les points de suspension par "
            "une réplique et compare.",
            "L'étape ❻ propose une condition d'échec. En quoi est-ce plus "
            "fort qu'une promesse de succès ?",
            "Retrouve dans l'acte I de la pièce l'échange entre Bobolo et le "
            "roi sur l'exécution de Bitala. Repère : la demande, les deux "
            "raisons, le refus, les deux raisons du refus."],
        regle=[
            "Un **dialogue argumentatif** met face à face deux positions "
            "défendables. **Si l'un des deux est ridicule, il n'y a plus de "
            "débat** : il y a une leçon déguisée, et le lecteur s'ennuie.",
            "Chaque réplique doit **faire avancer** : apporter un argument, "
            "une objection, une concession ou une proposition. Une réplique "
            "qui ne fait que répéter se supprime.",
            "**La concession est l'arme la plus efficace** : *c'est juste, "
            "mais…*, *je vous l'accorde, cependant…*. Elle prouve qu'on a "
            "écouté, et elle rend la suite irrésistible.",
            "Les **didascalies** portent la moitié du rapport de force : qui "
            "lève les yeux, qui feuillette, qui se tait.",
            "**Le silence est une réplique.** Il s'écrit, et il compte."],
        exercices=[
            "**Trouve la vraie objection.** Pour chaque demande, écris "
            "l'objection la plus solide (pas la plus bête) : *ouvrir la "
            "cantine plus tôt · autoriser les téléphones en récréation · "
            "supprimer les devoirs du week-end.*",
            "**Concède.** Réécris ces répliques en commençant par une "
            "concession : *« Vous avez tort. » · « Ce n'est pas possible. » · "
            "« Vous exagérez. »*",
            "**Écris seul.** Une scène de quatorze répliques : **un jeune "
            "demande quelque chose à un aîné qui a de bonnes raisons de "
            "refuser**. Obligatoire : une reformulation, deux objections "
            "réelles, deux concessions, un silence écrit, une conclusion qui "
            "n'est ni un oui ni un non.",
            "**Joue-la.** À deux devant la classe. Demandez ensuite à main "
            "levée qui, du jeune ou de l'aîné, avait raison. **Si la classe "
            "est partagée, votre dialogue est réussi.**"],
        astuce=("Le test de l'adversaire", [
            "Relis ton dialogue en te mettant **du côté de celui que tu "
            "n'aimes pas**.",
            "S'il te paraît bête, faible, ou méchant sans raison, tu as écrit "
            "un plaidoyer, pas un dialogue. Redonne-lui son meilleur "
            "argument.",
            "Guy Menga fait exactement cela avec Bobolo : ce personnage est "
            "un manipulateur, mais il a des arguments — la loi, la coutume, "
            "la nouvelle lune, sa propre épouse offensée. **C'est pour cela "
            "qu'on a peur de lui.**"]))

    b += production(
        "l'article de journal",
        "rendre compte d'un événement en donnant les faits avant les "
        "commentaires.",
        modele=(
            "❶ **KOKA-MBALA — Le Conseil des anciens dissous après la "
            "destruction de la marmite sacrée**\n"
            "❷ Le roi Bintsamou a dissous hier soir, dans la grande cour du "
            "palais, le Conseil des anciens du royaume, à l'issue d'une nuit "
            "d'affrontement entre les notables et les jeunes de la cité.\n"
            "❸ Les faits ont commencé peu après le coucher du soleil. Une "
            "cinquantaine de jeunes gens, conduits par Bitala, fils de feu "
            "Ngoma, ont pénétré dans l'enceinte du palais où siégeait le "
            "Conseil. Ils ont posé deux conditions : la destruction de la "
            "marmite sacrée et la dissolution du Conseil.\n"
            "❹ « Nous voudrions que les choses s'arrangent dans le calme », a "
            "déclaré leur porte-parole devant l'assemblée.\n"
            "❺ Le premier conseiller, Bobolo, également grand féticheur du "
            "royaume, a été arrêté sur ordre du roi et conduit en prison. Il "
            "sera jugé par le prochain Conseil.\n"
            "❻ Un nouveau Conseil doit être constitué à la prochaine nouvelle "
            "lune. Le roi a proposé d'y admettre deux ou trois jeunes gens."),
        annotations=[
            ["❶ Le titre",
             "**Le lieu, puis le fait principal.** Un titre d'article n'est "
             "pas une devinette : il donne la nouvelle."],
            ["❷ L'attaque (le « chapeau »)",
             "Elle répond aux cinq questions : **qui, quoi, où, quand, "
             "comment**. Un lecteur pressé s'arrête là et sait l'essentiel."],
            ["❸ Le déroulement, dans l'ordre",
             "Les faits, datés, chiffrés, avec les noms."],
            ["❹ La citation",
             "Entre guillemets, avec le verbe de parole et la source. **Une "
             "citation ne s'invente jamais.**"],
            ["❺ Les conséquences",
             "Ce qui a changé pour les personnes concernées."],
            ["❻ La suite attendue",
             "Ce qui va se passer. Un article se termine par l'avenir, non "
             "par une morale."]],
        questions=[
            "Relève, dans l'attaque, les réponses aux cinq questions : qui, "
            "quoi, où, quand, comment.",
            "L'article donne-t-il l'avis du journaliste ? Cherche un adjectif "
            "qui juge. En trouves-tu ?",
            "À quel temps sont les verbes ? Pourquoi ce temps-là ?",
            "Que se passerait-il si l'on plaçait le paragraphe ❻ en tête ? "
            "Essaie.",
            "Compare ce texte au **résumé** que tu as appris à faire. Quelle "
            "est la différence principale ?"],
        regle=[
            "Un article de journal donne **les faits d'abord**, du plus "
            "important au moins important. On appelle cela **la pyramide "
            "inversée** : si l'on coupe le dernier paragraphe, l'article tient "
            "encore.",
            "L'**attaque** (ou chapeau) répond aux **cinq questions** : qui, "
            "quoi, où, quand, comment — et parfois pourquoi.",
            "Le journaliste **n'écrit pas ce qu'il pense** dans un article "
            "d'information : il rapporte, il cite, il attribue. « Selon… », "
            "« a déclaré… », « d'après un témoin… ».",
            "Une **citation** se met entre guillemets, avec le nom de celui "
            "qui parle. **On ne l'invente pas et on ne la retouche pas.**",
            "Temps employés : **passé composé** ou **présent** pour les faits "
            "récents ; **futur** pour la suite annoncée."],
        exercices=[
            "**Trouve les cinq questions.** Lis un article de presse "
            "camerounaise et repère, dans l'attaque, les réponses à *qui, "
            "quoi, où, quand, comment*.",
            "**Neutralise.** Réécris ces phrases pour en retirer tout "
            "jugement : *« Le scandaleux Conseil a enfin été balayé par des "
            "jeunes courageux. » · « Cet odieux féticheur méritait la "
            "prison. »*",
            "**Écris seul.** Rédige un article de vingt lignes sur **un "
            "événement de ton établissement** : une compétition, une remise "
            "de prix, un incident, une visite. Titre, attaque avec les cinq "
            "questions, déroulement, une citation réelle recueillie auprès "
            "d'un témoin, conséquences, suite attendue.",
            "**Fais vérifier.** Donne ton article à quelqu'un qui n'était pas "
            "là. Il doit pouvoir raconter l'événement — et **il ne doit pas "
            "pouvoir deviner ton opinion**."])

    b.append(saut())
    return b


# ============================================================ 6. Je joue

def partie6():
    b = [h2("6. Je joue et je révise"), p("Livre fermé, rideau baissé.")]
    corriges = []

    e, c = jeux.mots_meles("Le royaume de Koka-Mbala", [
        "Bintsamou", "Lemba", "Bobolo", "Bitala", "Nzila", "marmite",
        "feticheur", "notable", "sagaie", "fosse", "Nsanda", "manes",
        "devin", "songe", "libation", "palissade", "trone", "royaume",
        "exil", "lune", "oppression", "ainesse", "Menga", "Congo"],
        graine=1)
    b += e
    corriges += c

    e, c = jeux.mots_croises("Les mots du drame", [
        ("DRAME", "Une pièce sérieuse, où le malheur menace"),
        ("MARMITE", "L'objet de terre cuite qui figure dans la liste des "
                    "personnages"),
        ("FETICHEUR", "Ce qu'est Bobolo, en plus d'être premier conseiller"),
        ("DEVIN", "Celui qui interprète le rêve du roi"),
        ("SONGE", "Le rêve qui ouvre la pièce"),
        ("LIBATION", "Verser du vin sur le sol pour les ancêtres"),
        ("MANES", "Les esprits des ancêtres"),
        ("NSANDA", "L'arbre planté sur la tombe des jeunes exécutés"),
        ("SAGAIE", "La lance dont la fosse est hérissée"),
        ("AINESSE", "Le droit que Bitala dénonce à la dernière page"),
        ("JOUG", "Ce dont la jeunesse se libère, selon le roi"),
        ("EXIL", "La peine que le roi inflige à Bitala au lieu de la mort"),
    ], graine=113)
    b += e
    corriges += c

    e, c = jeux.qcm("As-tu lu les deux actes ?", [
        ("Quel prix la pièce a-t-elle reçu ?",
         ["le Grand Prix littéraire de l'Afrique noire",
          "le Grand prix du Concours théâtral interafricain 1967",
          "le prix Goncourt", "le prix El Hadj Ahmadou Ahidjo"], 1),
        ("Qui a inventé la marmite, et pourquoi ?",
         ["le roi, pour honorer les ancêtres",
          "le premier conseiller, pour faire peur à ceux qui hésitaient à "
          "condamner", "le devin, pour lire l'avenir",
          "les notables, pour se protéger"], 1),
        ("De quoi Bitala est-il accusé au début ?",
         ["de vol", "d'avoir regardé une femme qui se baignait",
          "de sorcellerie", "d'avoir frappé un garde"], 1),
        ("Que répond le devin au roi, après son rêve ?",
         ["« la marmite est sacrée »", "« nos morts ont assez du sang de nos "
          "enfants »", "« il faut condamner »", "« le royaume est perdu »"], 1),
        ("Quelle peine le roi inflige-t-il finalement à Bitala à l'acte I ?",
         ["la mort", "la prison", "l'exil", "aucune"], 2),
        ("Quelles sont les deux conditions posées par les jeunes ?",
         ["l'argent et la terre",
          "briser la marmite et dissoudre le Conseil",
          "libérer Bitala et exiler Bobolo",
          "changer de roi et de lois"], 1),
        ("Qui brise la marmite ?",
         ["le roi", "Bobolo", "Bitala, sur ordre du roi", "les notables"], 2),
        ("À qui le roi attribue-t-il une part de sa victoire ?",
         ["à son devin", "à Bitala", "à Lemba, son épouse préférée",
          "aux notables"], 2),
    ])
    b += e
    corriges += c

    e, c = jeux.vrai_faux("Vrai ou faux à Koka-Mbala", [
        ("La loi de Koka-Mbala frappait tout le monde de la même façon.",
         False,
         "La Note de l'auteur est formelle : « cette loi frappait surtout les "
         "jeunes tandis qu'elle était clémente pour les adultes »."),
        ("Le roi est un tyran qui veut la mort des jeunes.", False,
         "Il cherche au contraire à les épargner dès le premier acte, et il "
         "dit : « Je suis le roi, mais je ne suis pas le conseil »."),
        ("Lemba se tait pendant toute la pièce.", False,
         "Elle prend la parole malgré l'interdiction et prononce la réplique "
         "la plus argumentée de l'acte I."),
        ("Quand la marmite est brisée, une catastrophe se produit.", False,
         "Rien ne se produit. C'est précisément la démonstration de la pièce."),
        ("Bitala se venge des notables après la victoire.", False,
         "Il les rassure : « Vous demeurez nos pères même si vous nous avez "
         "reniés »."),
        ("Le roi annonce une seconde libération à venir.", True,
         "Celle des femmes : « demain il faudra que cette même jeunesse "
         "puisse aider la femme à briser la gangue… »"),
    ])
    b += e
    corriges += c

    e, c = jeux.remise_en_ordre("Le drame, scène après scène", [
        "Le roi raconte à Lemba son rêve : le sang des jeunes fait éclater la "
        "marmite.",
        "Des gardes amènent Bitala, accusé d'avoir regardé une femme se "
        "baigner.",
        "Resté seul, le roi fait une libation et met en doute la marmite.",
        "Trois lunes plus tard, une veuve annonce que Bitala est revenu "
        "d'exil.",
        "Les jeunes envahissent le palais et posent leurs deux conditions.",
        "La marmite est brisée, Bobolo arrêté, le Conseil dissous.",
    ], graine=127)
    b += e
    corriges += c

    e, c = jeux.qui_suis_je("Devine qui parle", [
        ("J'ai rêvé que le sang de tous les jeunes condamnés emplissait mon "
         "palais.", "le roi Bintsamou"),
        ("Je demande si Bobolo est venu d'un tronc de palétuvier.", "Lemba"),
        ("J'ai fabriqué l'objet qui fait trembler les juges, et je veux une "
         "exécution avant la nouvelle lune.", "Bobolo"),
        ("J'ai avoué ma faute, et j'ai fait remarquer que le garde qui "
         "m'arrêtait avait regardé lui aussi.", "Bitala"),
        ("Je suis veuve, j'ai un champ de manioc, et je n'avais pas le droit "
         "de parler au roi à une heure si tardive.", "Nzila"),
    ])
    b += e
    corriges += c

    b += jeux.carte_mentale(
        "La marmite de Koka-Mbala", "LA MARMITE DE KOKA-MBALA",
        [("Le genre", ["drame en deux actes",
                       "Grand prix du Concours théâtral interafricain 1967",
                       "suivi de L'oracle, comédie en trois actes"]),
         ("Les personnages", ["un roi qui doute", "une reine qui argumente",
                              "un féticheur qui manipule",
                              "un jeune qui avoue et démontre"]),
         ("Les lieux", ["la véranda du palais", "la cour et la marmite",
                        "la fosse du marché, l'arbre N'sanda"]),
         ("Les thèmes", ["la domination des vieux sur les jeunes",
                         "la loi appliquée à sens unique",
                         "la peur comme instrument de pouvoir",
                         "la parole refusée aux femmes"]),
         ("Les procédés", ["le rêve qui annonce", "la libation-monologue",
                           "l'objet-personnage", "le proverbe qui conclut"]),
         ("Ma question à la pièce", ["…", "…"])])

    b.append(saut())
    return b, corriges


# ======================================================== 7. Je m'évalue

ORTHO_FAUTIF = (
    "Ce soir-la, les notables se réunirent sous la veranda du palais. Le roi "
    "n'avait pas encore paru les gardes attendait debout, la lance à la main. "
    "Au centre de la cour, la marmite sacrée reposait sur une natte neuf. "
    "Personne n'osait la regarder trop lontemps. Ont racontait que les esprits "
    "des ancêtres y dormaient et qu'ils réclamaient chaque lune le sang d'un "
    "jeune homme. Les vieux baissait la voix quand ils en parlaient. Pourtant, "
    "se soir-là, quelque chose avait changé. Les jeunes du village s'étaient "
    "rassamblé derrière la palisade, silensieux, est ils écoutaient. Le "
    "premier conseiler sentit leur présence et fronça les sourcils. Il savait "
    "que la peur ne dure jamais eternellement.")

ORTHO_CORRIGE = [
    ["1", "Ce **soir-la**", "Ce **soir-là**", "accent grave manquant", "0,5"],
    ["2", "encore paru **_** les gardes", "encore paru **;** les gardes",
     "point-virgule manquant", "0,5"],
    ["3", "sous la **veranda**", "sous la **véranda**", "accent manquant",
     "0,5"],
    ["4", "jamais **eternellement**", "jamais **éternellement**",
     "accent manquant", "0,5"],
    ["5", "trop **lontemps**", "trop **longtemps**",
     "orthographe d'usage : le *g* de *long*", "1"],
    ["6", "derrière la **palisade**", "derrière la **palissade**",
     "orthographe d'usage : deux *s*", "1"],
    ["7", "**silensieux**", "**silencieux**",
     "orthographe d'usage : *c* et non *s*", "1"],
    ["8", "Le premier **conseiler**", "Le premier **conseiller**",
     "orthographe d'usage : deux *l*", "1"],
    ["9", "les gardes **attendait**", "les gardes **attendaient**",
     "accord sujet-verbe", "2"],
    ["10", "sur une natte **neuf**", "sur une natte **neuve**",
     "accord de l'adjectif au féminin", "2"],
    ["11", "Les vieux **baissait**", "Les vieux **baissaient**",
     "accord sujet-verbe", "2"],
    ["12", "s'étaient **rassamblé**", "s'étaient **rassemblés**",
     "orthographe d'usage **et** accord du participe passé", "2"],
    ["13", "**Ont** racontait", "**On** racontait",
     "homophone : *on* est le sujet", "2"],
    ["14", "**se** soir-là", "**ce** soir-là",
     "homophone : *ce* est un déterminant démonstratif", "2"],
    ["15", "silensieux, **est** ils écoutaient",
     "silencieux, **et** ils écoutaient",
     "homophone : *et* est une conjonction", "2"],
]


def partie7():
    b = [h2("7. Je m'évalue — au format de l'examen")]
    corriges = [h2("La marmite de Koka-Mbala — corrigés des épreuves")]

    texte = source.extrait(
        CLE, "La scène représente l'entrée d'une case", mots=340,
        arret=["ACTE II", "Scène II"])
    b += epreuve_etude_texte(
        "L'oracle, ouverture (acte I, scène I)",
        chapeau="Le volume que tu tiens contient une seconde pièce, *L'oracle*, "
                "comédie en trois actes, également couronnée en 1967. Elle "
                "n'a pas été étudiée en classe. Louaka, seize ans, veut "
                "devenir infirmière ; un riche polygame offre à son père une "
                "forte dot pour l'épouser tout de suite. Voici le lever du "
                "rideau.",
        texte=texte, source=SRC.replace("*La marmite de Koka-Mbala*",
                                        "*L'oracle*, dans *La marmite de "
                                        "Koka-Mbala*"),
        comprehension=[
            ("Décris le décor : les matériaux, les objets suspendus, les "
             "objets posés au sol. Relève au moins six éléments.", "2"),
            ("Comment Biyoki est-il habillé ? Que nous apprennent ses "
             "vêtements sur sa condition ?", "2"),
            ("Que fait-il au lever du rideau ? Relève ses deux occupations.",
             "2"),
            ("Comment Wamba salue-t-il Biyoki ? Que dit ce salut de leur "
             "relation ?", "2"),
            ("De quoi Wamba se plaint-il en s'asseyant ? Quel effet cette "
             "plainte produit-elle sur le spectateur ?", "2")],
        langue=[
            ("Relève quatre verbes conjugués ; donne leur infinitif et leur "
             "temps.", "2"),
            ("« Il est habillé d'un pantalon qui s'arrête à mi-mollet. » "
             "Donne la nature et la fonction de la proposition soulignée par "
             "ton professeur.", "2"),
            ("Réécris « Entre Wamba » à la forme habituelle sujet-verbe, puis "
             "explique pourquoi l'auteur a inversé.", "2"),
            ("Relève deux compléments circonstanciels de lieu et un "
             "complément circonstanciel de manière.", "2"),
            ("Trouve dans le texte trois mots du champ lexical de la "
             "pauvreté.", "2")])
    corriges += [h3("Épreuve 1 — Étude de texte : éléments de corrigé"),
                 grille([["Question", "Ce qu'on attend", "Pts"],
                         ["I.1", "Un mur en pisé, une ouverture cachée par un "
                          "rideau en raphia, des calebasses et un vieux filet "
                          "de chasse suspendus sous la véranda, deux mortiers "
                          "(un grand, un petit), des pilons posés à terre, "
                          "deux chaises longues face au public.", "2"],
                         ["I.2", "Un pantalon qui s'arrête à mi-mollet et une "
                          "chemise, « rapiécés en maints endroits », un vieux "
                          "casque colonial : c'est un paysan pauvre.", "2"],
                         ["I.3", "Il tresse une cordelette et fume sa pipe ; "
                          "un petit balai lui sert à chasser les mouches.",
                          "2"],
                         ["I.4", "« Je te salue, infatigable ouvrier. » Le "
                          "salut est amical et un peu moqueur : Wamba "
                          "reconnaît le travail de Biyoki tout en le "
                          "taquinant.", "2"],
                         ["I.5", "De ses jambes : « si d'ici à deux ans elles "
                          "me portent encore, c'est que vraiment Dieu est "
                          "là-haut ». La plainte fait sourire et installe le "
                          "ton de la comédie.", "2"],
                         ["II.1", "Ex. : *représente* (représenter, présent) ; "
                          "*voit* (voir, présent) ; *tresse* (tresser, "
                          "présent) ; *salue* (saluer, présent).", "2"],
                         ["II.2", "*qui s'arrête à mi-mollet* : proposition "
                          "subordonnée relative, complément de l'antécédent "
                          "*pantalon* (épithète).", "2"],
                         ["II.3", "*Wamba entre.* L'inversion met en valeur "
                          "l'entrée du personnage : au théâtre, c'est le fait "
                          "d'entrer qui compte, non celui qui entre.", "2"],
                         ["II.4", "CC de lieu : *sous la véranda*, *près de "
                          "la porte d'entrée*, *contre le mur*, *à terre*. CC "
                          "de manière : *parallèlement au mur*, *en fumant sa "
                          "pipe*.", "2"],
                         ["II.5", "*rapiécés, vieux (filet, casque), pisé*.",
                          "2"]])]

    b += epreuve_orthographe(ORTHO_FAUTIF,
                             "Texte composé pour l'épreuve, dans la manière de "
                             "la pièce", nb_fautes=15)
    corriges += [h3("Épreuve 2 — Correction orthographique : corrigé"),
                 grille([["N°", "Écrit dans le texte", "Correction",
                          "Pourquoi", "Pts"]] + ORTHO_CORRIGE),
                 ("p", "**Total : 20 points.** Retirer **0,5 point** par mot "
                  "correct barré à tort.")]

    b += epreuve_expression([
        {"type": "Dialogue argumentatif",
         "contexte": "Dans cette pièce, un jeune homme obtient d'un roi ce "
                     "que personne n'avait jamais obtenu — et il l'obtient "
                     "sans violence, en posant deux conditions et en "
                     "démontrant qui a fabriqué la peur.",
         "citation": source.extrait(
             CLE, "Nous voudrions que les choses s'arrangent dans le calme",
             arrivee="nos deux conditions restent posées."),
         "source": SRC,
         "taches": [
             "Écris un **dialogue argumentatif** de vingt-cinq à trente "
             "lignes, présenté comme une scène de théâtre.",
             "Un jeune (ou un groupe de jeunes) demande à un aîné de changer "
             "une règle établie. L'aîné a de vraies raisons de refuser.",
             "**Obligatoire :** une didascalie de décor ; au moins six "
             "didascalies de geste ou de ton ; deux objections solides de "
             "l'aîné ; deux concessions du jeune (« c'est juste, mais… ») ; "
             "un silence écrit ; une fin qui n'est ni un oui ni un non."],
         "bareme": [["La présentation théâtrale est correcte", "3"],
                    ["Les deux positions sont également défendables", "5"],
                    ["Les concessions sont employées et efficaces", "4"],
                    ["Les didascalies portent le rapport de force", "3"],
                    ["Orthographe et ponctuation", "3"],
                    ["Présentation et longueur", "2"]]},
        {"type": "Article de journal",
         "contexte": "À la fin de la pièce, un royaume change de "
                     "constitution en une nuit : une marmite est brisée, un "
                     "conseiller arrêté, un Conseil dissous, et l'entrée des "
                     "jeunes au pouvoir annoncée.",
         "citation": source.extrait(
             CLE, "Un autre Conseil sera mis sur pied",
             arrivee="en fassent partie."),
         "source": SRC,
         "taches": [
             "Rédige un **article de journal** de vingt à vingt-cinq lignes "
             "rendant compte des événements de la nuit à Koka-Mbala.",
             "**Obligatoire :** un titre (lieu + fait principal) ; une "
             "attaque répondant aux cinq questions (qui, quoi, où, quand, "
             "comment) ; le déroulement des faits dans l'ordre ; **deux "
             "citations exactes de la pièce, entre guillemets, avec le nom de "
             "celui qui parle** ; les conséquences ; la suite annoncée.",
             "**Interdit :** donner ton opinion. Aucun adjectif qui juge."],
         "bareme": [["Le titre et l'attaque remplissent leur fonction", "4"],
                    ["Les faits sont exacts, complets et dans l'ordre", "5"],
                    ["Les deux citations sont exactes et attribuées", "4"],
                    ["Aucun jugement personnel ne se glisse dans l'article",
                     "3"],
                    ["Orthographe et ponctuation", "2"],
                    ["Présentation et longueur", "2"]]},
    ])
    b.append(saut())
    return b, corriges
