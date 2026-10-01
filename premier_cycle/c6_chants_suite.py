# -*- coding: utf-8 -*-
"""6ᵉ — *Les Chants de la Forêt* : écrire, jouer, s'évaluer.

Les six productions écrites sont celles du premier cycle — narration,
description, portrait, dialogue, injonctif, argumentatif — et chacune suit la
même marche : **un modèle rédigé et annoté ❶❷❸**, des questions sur les étapes
de ce modèle, la règle formulée par l'élève avant d'être lue, puis une
imitation sur un **autre** sujet que celui du modèle.

Le texte de la correction orthographique est **composé**, non emprunté au
recueil : l'élève a le livre entre les mains, et un support tiré de l'œuvre
lui donnerait la version correcte à recopier. Il est étiqueté comme tel.
"""
import jeux
import source
from gabarit import (epreuve_etude_texte, epreuve_expression,
                     epreuve_orthographe, production)
from kit import enc, grille, h2, h3, lignes, num, p, puce, saut

CLE = "chants"
SRC = "Lucien Anya Noa, *Les Chants de la Forêt*, Afrédit, Yaoundé, 2011"


# ==================================================== 5. Les productions

def partie5():
    b = [h2("5. J'écris — raconter et décrire"),
         p("Deux ateliers ici : **la narration** et **la description**. Les "
           "quatre autres façons d'écrire t'attendent dans les deux œuvres "
           "suivantes de ce manuel — portrait et opinion avec *Les Bimanes*, "
           "dialogue et consignes avec *Les Contes de Korotoumou*. Chaque type "
           "n'est travaillé **qu'une fois** : à toi de réutiliser ensuite."),
         p("Dans chaque atelier, tu commences par **lire un texte déjà "
           "écrit**. Les petits numéros ❶❷❸ montrent comment il a été "
           "fabriqué, morceau par morceau. Tu écriras le tien ensuite."),
         enc("astuce", "Pourquoi on ne commence jamais par la règle", [
             "Personne n'apprend à faire un beignet en lisant la définition du "
             "mot « beignet ». On regarde quelqu'un en faire un, on compte ses "
             "gestes, et on essaie.",
             "C'est pareil ici. Le modèle d'abord, la règle après."])]

    # ---------------------------------------------------------- narration
    b += production(
        "la narration (raconter une histoire)",
        "raconter une histoire courte qui a un début, un milieu et une fin.",
        modele=(
            "❶ Un jour, pendant la grande saison sèche, Ngo, la petite "
            "antilope, mourait de soif. ❷ Elle chercha longtemps, marcha "
            "jusqu'au soir, et finit par trouver une mare cachée sous les "
            "feuilles. ❸ Mais au moment où elle baissa la tête pour boire, "
            "elle vit deux yeux jaunes qui la regardaient au fond de l'eau. "
            "❹ Elle recula d'un bond, le cœur battant. Puis elle comprit : "
            "c'était son propre reflet, éclairé par la lune. ❺ Depuis ce "
            "jour, Ngo ne boit jamais sans avoir d'abord regardé le ciel."),
        annotations=[
            ["❶ La situation de départ",
             "Elle dit **quand**, **qui**, et quel est le problème. Une seule "
             "phrase suffit."],
            ["❷ Les actions",
             "Ce que le personnage **fait** pour s'en sortir. Verbes d'action, "
             "au passé simple."],
            ["❸ L'obstacle",
             "Le moment où ça se complique. Sans obstacle, il n'y a pas "
             "d'histoire — seulement une liste."],
            ["❹ Le dénouement",
             "Comment le problème se règle. Ici : la peur s'explique."],
            ["❺ La situation finale",
             "Ce qui a changé pour toujours. Souvent : « Depuis ce jour… »"]],
        questions=[
            "Compte les cinq étapes. Laquelle est la plus courte ? Laquelle "
            "est la plus longue ? À ton avis, pourquoi ?",
            "Relève tous les verbes au **passé simple**. Combien y en a-t-il ?",
            "Supprime l'étape ❸ et relis le texte à voix haute. Que perd-on ? "
            "Écris ta réponse en une phrase.",
            "Le texte commence par « Un jour ». Trouve dans ton recueil "
            "**trois** autres formules qui ouvrent un conte.",
            "La dernière phrase commence par « Depuis ce jour ». Cherche dans "
            "*Les Chants de la Forêt* deux contes qui se terminent ainsi."],
        regle=[
            "Une narration se bâtit en **cinq temps** : situation de départ → "
            "actions → obstacle → dénouement → situation finale.",
            "Les temps du récit sont l'**imparfait** (pour décrire, pour ce "
            "qui dure) et le **passé simple** (pour les actions qui "
            "surviennent).",
            "**Sans obstacle, pas d'histoire.** Si ton personnage obtient tout "
            "du premier coup, personne n'aura envie de te lire jusqu'au bout."],
        exercices=[
            "**Remets en ordre.** Ces cinq phrases sont mélangées ; numérote-"
            "les de 1 à 5. (a) Le chasseur repartit sans rien. (b) Un matin, un "
            "chasseur poursuivit un porc-épic. (c) Depuis, on dit qu'il ne faut "
            "pas courir après deux gibiers. (d) Mais un lièvre traversa le "
            "sentier et il changea de proie. (e) Il courut derrière le lièvre, "
            "qui disparut dans un trou.",
            "**Complète.** Voici le début et la fin d'une histoire. Écris les "
            "trois étapes du milieu (8 lignes). *Début :* « Un soir, Ma "
            "Ngono envoya son fils chercher de l'eau à la rivière. » *Fin :* "
            "« Depuis ce jour, personne ne va seul à la rivière après le "
            "coucher du soleil. »",
            "**Écris seul.** Raconte, en quinze lignes, une histoire où **un "
            "petit animal l'emporte sur un gros**. Cinq étapes obligatoires. "
            "Ton histoire doit finir par une phrase qui commence par « Voilà "
            "pourquoi… ».",
            "**Fais vérifier.** Échange ta copie avec ton voisin. Il doit "
            "retrouver et souligner tes cinq étapes. S'il n'en trouve que "
            "quatre, c'est qu'il en manque une."],
        astuce=("Le truc du passé simple", [
            "Au passé simple, la plupart des verbes du 1ᵉʳ groupe font "
            "**-a** : *il marcha, il chercha, il tomba*.",
            "Les autres font souvent **-it** ou **-ut** : *il finit, il "
            "prit, il courut, il vit*.",
            "Si tu hésites, essaie avec « il » : *il alla*, *il fit*, *il "
            "dit*. Ton oreille reconnaît ces formes, tu les as entendues "
            "mille fois dans les contes."]))

    # --------------------------------------------------------- description
    b += production(
        "la description (peindre un lieu)",
        "décrire un lieu de façon qu'on puisse le voir sans y être allé.",
        modele=(
            "❶ La source se cachait au bas du village, derrière un rideau de "
            "bambous. ❷ D'abord, on ne voyait rien : seulement des feuilles "
            "larges comme des mains, vertes et luisantes. ❸ Puis, en écartant "
            "les tiges, on découvrait un petit bassin d'eau claire, à peine "
            "plus grand qu'une natte. ❹ Au fond, des cailloux ronds brillaient "
            "comme des dents propres, et de minuscules poissons gris filaient "
            "entre eux. ❺ L'endroit sentait la terre mouillée et la feuille "
            "écrasée. On y entendait, tout le temps, le même bruit doux : "
            "*glou, glou, glou*."),
        annotations=[
            ["❶ Le cadre général",
             "**Où** se trouve le lieu. On situe avant de détailler."],
            ["❷ ❸ ❹ L'ordre du regard",
             "De loin vers près : le rideau de bambous → le bassin → les "
             "cailloux du fond. Le lecteur avance avec l'œil."],
            ["❺ Les autres sens",
             "L'odeur et le bruit. Une description qui n'utilise que la vue "
             "est plate."],
            ["Les comparaisons",
             "« larges comme des mains », « comme des dents propres ». Elles "
             "expliquent l'inconnu par du connu."]],
        questions=[
            "Dans quel ordre le regard se déplace-t-il ? Note les quatre "
            "étapes dans la marge.",
            "Relève les **deux comparaisons**. Quel petit mot les introduit "
            "toutes les deux ?",
            "Quels sens sont sollicités, en plus de la vue ? Relève les mots "
            "qui le prouvent.",
            "Relève tous les **adjectifs de couleur** et de forme. Combien en "
            "comptes-tu ?",
            "Supprime la dernière phrase. La description est-elle encore "
            "vivante ? Dis pourquoi."],
        regle=[
            "Une description suit **un ordre** : de loin vers près, de haut "
            "vers bas, ou de gauche à droite. Un ordre au hasard perd le "
            "lecteur.",
            "Elle emploie des **expansions du nom** : adjectifs (*eau claire*), "
            "compléments du nom (*rideau de bambous*), comparaisons (*larges "
            "comme des mains*).",
            "Elle fait appel à **plusieurs sens** : la vue, l'odorat, l'ouïe, "
            "parfois le toucher.",
            "Le temps de la description est l'**imparfait**."],
        exercices=[
            "**Enrichis.** Ajoute à chaque nom deux expansions : « une case », "
            "« un chemin », « un marché », « une rivière ».",
            "**Classe.** Voici dix mots relevés dans ton recueil : *bosquet, "
            "berge, kolatier, bananeraie, brousse, savane, forêt, rivière, "
            "cour, case*. Range-les dans un tableau à deux colonnes : « lieux "
            "où l'on vit » / « lieux où l'on va ».",
            "**Écris seul.** Décris, en douze lignes, **la cour de ton "
            "école** un jour de récréation. Ordre imposé : d'abord ce que tu "
            "vois de la porte, ensuite ce qui est au milieu, enfin un détail "
            "tout petit. Une comparaison obligatoire, un bruit obligatoire.",
            "**Fais vérifier.** Ton voisin doit pouvoir dessiner ton lieu "
            "sans te poser de question. S'il en pose une, c'est qu'il te "
            "manque un détail."])

    # ------------------------------------------------------------- portrait
    b.append(saut())
    return b


# ============================================================ 6. Je joue

def partie6():
    b = [h2("6. Je joue et je révise"),
         p("Tout ce qui suit se joue avec le livre **fermé**. Si tu dois "
           "l'ouvrir, c'est que la relecture n'est pas finie — et ce n'est pas "
           "grave, c'est même le but.")]
    corriges = []

    e, c = jeux.mots_meles("Les bêtes de la forêt", [
        "Kulu", "Zee", "Ndoe", "Mvomo", "Dzungoo", "Zog", "Kos", "Olong",
        "Berne", "tortue", "leopard", "aigle", "python", "cameleon",
        "elephant", "perroquet", "bigorneau", "sanglier"], graine=17)
    b += e
    corriges += c

    e, c = jeux.mots_croises("Le vocabulaire du conte", [
        ("CONTE", "Histoire inventée qu'on raconte le soir"),
        ("MORALE", "La leçon écrite à la fin d'une fable"),
        ("PROVERBE", "Phrase courte de sagesse, comme « l'intelligence est "
                     "l'aînée de la force »"),
        ("KOLA", "Noix amère qu'on offre à un hôte"),
        ("GAGE", "Ce que Kulu et Zee déposent avant la course"),
        ("PALABRE", "Assemblée où l'on discute une affaire jusqu'à la régler"),
        ("RUSE", "L'arme de la tortue"),
        ("PACTE", "Accord solennel avec le revenant"),
        ("GENT", "Vieux mot qui désigne le peuple des animaux"),
        ("NSOG", "La purée de maïs du dernier conte"),
        ("FOSSE", "Le trou où l'homme dépèce l'éléphant"),
        ("FORET", "Le décor du recueil"),
    ], graine=23)
    b += e
    corriges += c

    e, c = jeux.qcm("As-tu vraiment lu le recueil ?", [
        ("Qui accuse Mvomo le python devant le tribunal des animaux ?",
         ["Kulu", "Zee", "Ndoe", "Dzungo'o"], 1),
        ("Que réclame Zameyo Mebenga à qui veut épouser sa fille ?",
         ["une corde de fumée", "un sac de kolas", "une poutre d'eau",
          "un éléphant"], 2),
        ("Dans « La parole vaut contrat », qui revient au revenant ?",
         ["les bêtes mâles", "les bêtes femelles", "la moitié du gibier",
          "rien du tout"], 1),
        ("Pourquoi le chimpanzé s'enfuit-il dans la forêt pour toujours ?",
         ["il a perdu son pagne", "il a été mordu", "il a volé un os",
          "il a peur du chien"], 0),
        ("Qui hérite du sac de kolas du caméléon ?",
         ["Zee, son ami", "Kulu, le juge", "le margouillat, son frère",
          "la fille du caméléon"], 2),
        ("Qui chante au fond de la source dans le dernier conte ?",
         ["Mvaa l'Ablette", "Ngol le Silure", "Olong le Bigorneau",
          "père Ngondzanga"], 2),
        ("Qui a écrit l'avant-propos du recueil ?",
         ["Amadou Koné", "Séverin Cécile Abega", "Lucien Anya Noa",
          "Guy Menga"], 1),
        ("Que veut dire « la gent animale » ?",
         ["les animaux gentils", "le peuple des animaux",
          "les animaux domestiques", "les grands animaux"], 1),
    ])
    b += e
    corriges += c

    e, c = jeux.vrai_faux("Vrai ou faux dans la forêt", [
        ("Kulu gagne la course parce qu'il court plus vite que Zee.", False,
         "Il place ses enfants sur les trois rives : il gagne par la ruse."),
        ("Le caméléon et le margouillat sont frères.", True,
         "Le texte dit qu'ils sont « issus de la même mère et du même père »."),
        ("Le revenant a triché en prenant les femmes de l'homme.", False,
         "Le pacte lui donnait toutes les femelles. Il l'a appliqué à la "
         "lettre — c'est bien là ce qui fait peur."),
        ("Zog l'Éléphant rapporte l'eau de la source.", False,
         "Il s'enfuit en oubliant sa cruche. Seul Kulu réussit."),
        ("Les animaux remercient Kulu après le repas de nsog.", False,
         "Ils le chassent : « Vieux rabougri, ôte-toi de là. »"),
        ("Le recueil contient dix-huit contes.", True,
         "Le sommaire en compte dix-huit, suivis des Notes pédagogiques."),
    ])
    b += e
    corriges += c

    e, c = jeux.remise_en_ordre("La course de Kulu et Zee", [
        "Zee se moque de la lenteur de Kulu et le compare au caméléon.",
        "Vexé, Kulu défie le léopard à la course ; chacun met sa fille en gage.",
        "Kulu rentre chez lui et poste ses enfants sur les trois rives.",
        "Zee s'élance, la langue pendante, sous les rires de la forêt.",
        "À chaque rivière, un enfant de Kulu se montre et chante.",
        "Zee accuse Kulu de sorcellerie, et Kulu emporte la fille du léopard.",
    ], graine=31)
    b += e
    corriges += c

    e, c = jeux.qui_suis_je("Les habitants du recueil", [
        ("Je suis lent, je change de couleur selon l'arbre où je grimpe, et "
         "l'on me dit de marcher doucement de peur que la terre ne s'effondre.",
         "Dzungo'o le Caméléon"),
        ("Je suis le plus fort de la forêt, je perds tous mes procès et toutes "
         "mes courses, et je finis par massacrer des chèvres innocentes.",
         "Zee le Léopard"),
        ("Je tiens dans une main d'enfant, je chante au fond de l'eau, et je "
         "fais fuir l'éléphant, le léopard et le lion.", "Olong le Bigorneau"),
        ("Je porte les messages d'un bout à l'autre de la forêt, et je répète "
         "tout ce que j'entends — y compris ce qu'il ne fallait pas répéter.",
         "Kos le Perroquet"),
        ("On m'appelle Tortue Aux-Cent-Astuces. Je n'ai ni griffes ni "
         "vitesse, et je gagne tout.", "Kulu la Tortue"),
    ])
    b += e
    corriges += c

    b += jeux.carte_mentale(
        "Les Chants de la Forêt", "LES CHANTS DE LA FORÊT",
        [("Le genre", ["conte et chantefable", "tradition orale béti",
                       "formules d'ouverture et de clôture"]),
         ("Les personnages", ["Kulu la ruse", "Zee la force",
                              "les hommes, les esprits, Dieu"]),
         ("Les lieux", ["la grande forêt équatoriale", "la rivière, la source",
                        "le tribunal en plein air"]),
         ("Les thèmes", ["l'intelligence contre la force", "la parole donnée",
                         "l'ingratitude", "la justice et la fausse preuve"]),
         ("Les leçons", ["« L'intelligence est l'aînée de la force »",
                         "« Un pacte est dangereux »",
                         "« Tout est contagieux, la sagesse comme la folie »"]),
         ("Ce que j'ai aimé", ["…", "…"])])

    b.append(saut())
    return b, corriges


# ======================================================== 7. Je m'évalue

# Le support de la correction orthographique : écrit pour l'épreuve, dans la
# manière du recueil, mais **absent du livre** — sinon l'élève y lirait la
# version correcte au lieu de la chercher.
ORTHO_FAUTIF = (
    "Ce matin-la, Kulu la Tortue ce leva avant le jour. Il prit son panier sa "
    "machette est descendit vers la rivière. Les oiseaux chantait deja dans "
    "les grands arbres. Sur la berge, il rencontra Zee le Léopard, qui "
    "aiguisait ses griffe contre une pierre.\n"
    "— Où vas-tu si tôt, fils de mon pere ? demanda le léopard.\n"
    "La tortue répondit qu'elle allait cueillir des kolas. Zee éclata de "
    "rire : ses pattes étaient si courtes qu'elle arriverait le lendemain ! "
    "Kulu ne se fâcha pas. Il posa son panier, s'assit sur une racine et "
    "attendit tranquilement. Quand le soleil fut haut, le léopard était déjà "
    "reparti, fatigé d'avoir couru toute la matiné. La tortue ramassa les "
    "fruits tombé pendant la nuit et rentra chez elle, le panier plein. Les "
    "animaux qu'elle croisa la félicita. Depuis ce jour, ont dit au village "
    "que la patiance est la sœur aînée de l'intelligence.")

ORTHO_CORRIGE = [
    ["1", "matin-**la**", "matin-**là**", "accent manquant", "0,5"],
    ["2", "panier **_** sa machette", "panier**,** sa machette",
     "virgule manquante", "0,5"],
    ["3", "**deja**", "**déjà**", "accents manquants", "0,5"],
    ["4", "mon **pere**", "mon **père**", "accent manquant", "0,5"],
    ["5", "**tranquilement**", "**tranquillement**", "orthographe d'usage : "
     "deux *l*", "1"],
    ["6", "**fatigé**", "**fatigué**", "orthographe d'usage : lettre oubliée",
     "1"],
    ["7", "la **matiné**", "la **matinée**", "orthographe d'usage : nom "
     "féminin en *-ée*", "1"],
    ["8", "la **patiance**", "la **patience**", "orthographe d'usage", "1"],
    ["9", "Les oiseaux **chantait**", "Les oiseaux **chantaient**",
     "accord sujet-verbe", "2"],
    ["10", "ses **griffe**", "ses **griffes**", "accord dans le groupe "
     "nominal", "2"],
    ["11", "les fruits **tombé**", "les fruits **tombés**",
     "accord du participe passé employé comme adjectif", "2"],
    ["12", "Les animaux … la **félicita**", "… la **félicitèrent**",
     "accord sujet-verbe (sujet éloigné)", "2"],
    ["13", "**ce** leva", "**se** leva", "homophone : *se* est un pronom", "2"],
    ["14", "**est** descendit", "**et** descendit",
     "homophone : *et* relie deux verbes", "2"],
    ["15", "**ont** dit au village", "**on** dit au village",
     "homophone : *on* est le sujet", "2"],
]


def partie7():
    b = [h2("7. Je m'évalue — trois épreuves")]
    corriges = []

    # ------------------------------------------------------ étude de texte
    texte = source.extrait(
        CLE, "Le partage de la nourriture créait souvent", mots=340,
        arret=["La mère, le père et le chimpanzé"])
    b += epreuve_etude_texte(
        "Trop de conseils rendirent le varan sourd",
        chapeau="Ce conte n'a pas été étudié en classe : c'est ta lecture "
                "personnelle qui va parler. Les animaux se disputent au "
                "partage de la nourriture, car certains touchent deux parts. "
                "On convoque donc une réunion où chacun doit dire ce qu'il est.",
        texte=texte, source=SRC,
        comprehension=[
            ("De quel problème part le conte ? Réponds en une phrase.", "2"),
            ("Relève le nom des animaux interrogés, dans l'ordre.", "2"),
            ("Comment la chauve-souris justifie-t-elle son droit à deux "
             "parts ? Recopie son raisonnement.", "2"),
            ("Explique l'expression « décliner sa généalogie ».", "2"),
            ("Pourquoi le varan ne répond-il rien ? Donne ton avis et "
             "justifie-le.", "2")],
        langue=[
            ("Relève dans le texte **quatre** noms d'animaux et donne, pour "
             "chacun, son genre (masculin ou féminin).", "2"),
            ("« Je suis un animal à poils. » Réécris cette phrase à la forme "
             "**négative**, puis à la forme **interrogative**.", "2"),
            ("Relève deux verbes au **passé simple** et donne leur infinitif.",
             "2"),
            ("« La chauve-souris alla s'asseoir. » Quel est le **sujet** de "
             "« alla » ? Quelle est sa **nature** ?", "2"),
            ("Donne le contraire de : *raison · gagner · confus · s'asseoir*.",
             "2")])
    corriges += [h3("Épreuve 1 — Étude de texte : éléments de corrigé"),
                 grille([["Question", "Ce qu'on attend", "Pts"],
                         ["I.1", "Le partage de la nourriture crée des "
                          "conflits : certains reçoivent deux parts, comme "
                          "membres de deux familles à la fois.", "2"],
                         ["I.2", "La chauve-souris, la loutre, l'anomalure, "
                          "le varan.", "2"],
                         ["I.3", "Elle a des poils **et** des ailes, des dents "
                          "**et** le vol : elle appartient donc aux deux "
                          "camps et réclame une part de chaque côté.", "2"],
                         ["I.4", "Dire de qui l'on descend, nommer ses "
                          "parents et ses origines.", "2"],
                         ["I.5", "Parce qu'on lui souffle des réponses "
                          "contraires des deux côtés : à force d'écouter tout "
                          "le monde, il ne sait plus quoi dire. Toute réponse "
                          "argumentée est acceptée.", "2"],
                         ["II.1", "Ex. : la chauve-souris (fém.), la loutre "
                          "(fém.), l'anomalure (masc.), le varan (masc.).", "2"],
                         ["II.2", "Négative : *Je ne suis pas un animal à "
                          "poils.* — Interrogative : *Suis-je un animal à "
                          "poils ?* (ou *Est-ce que je suis…*)", "2"],
                         ["II.3", "Ex. : *appela* → appeler ; *répondit* → "
                          "répondre ; *alla* → aller ; *prononça* → prononcer.",
                          "2"],
                         ["II.4", "Sujet : *La chauve-souris* — nature : "
                          "groupe nominal (déterminant + nom).", "2"],
                         ["II.5", "tort · perdre · clair · se lever.", "2"]])]

    # ---------------------------------------------- correction orthographique
    b += epreuve_orthographe(ORTHO_FAUTIF,
                             "Texte composé pour l'épreuve, dans la manière du "
                             "recueil", nb_fautes=15)
    corriges += [h3("Épreuve 2 — Correction orthographique : corrigé"),
                 grille([["N°", "Écrit dans le texte", "Correction",
                          "Pourquoi", "Pts"]] + ORTHO_CORRIGE),
                 ("p", "**Total : 20 points.** Retirer **0,5 point** par mot "
                  "correct barré à tort.")]

    # -------------------------------------------------------- expression
    b += epreuve_expression([
        {"type": "Narration",
         "contexte": "Dans *Les Chants de la Forêt*, un animal minuscule "
                     "l'emporte presque toujours sur un géant. Kulu la Tortue "
                     "bat Zee le Léopard à la course ; Olong le Bigorneau fait "
                     "fuir l'éléphant, le léopard et le lion.",
         "citation": "Mes Frères, moi aussi je vais essayer d'aller voir cette "
                     "affaire de la source !",
         "source": SRC,
         "taches": [
             "Produis un **récit** de vingt à vingt-cinq lignes.",
             "Un petit animal de ton choix se trouve devant un obstacle que "
             "personne n'a pu franchir. Raconte comment il y arrive.",
             "**Obligatoire :** les cinq étapes du récit ; au moins six verbes "
             "au passé simple ; un dialogue de quatre répliques ; une phrase "
             "finale commençant par « Voilà pourquoi… »."],
         "bareme": [["Le récit comporte les cinq étapes", "5"],
                    ["Le dialogue est correctement présenté (tirets, verbes de "
                     "parole)", "4"],
                    ["Les temps du récit sont respectés", "4"],
                    ["Orthographe et ponctuation", "4"],
                    ["Présentation, écriture lisible, longueur respectée", "3"]]},
        {"type": "Portrait et description",
         "contexte": "Le recueil ne décrit presque jamais ses personnages : "
                     "on les reconnaît à ce qu'ils font. À toi de leur donner "
                     "un visage.",
         "citation": "Zee surgit, la langue pendante, le regard menaçant, la "
                     "queue fouettant ses flancs.",
         "source": SRC,
         "taches": [
             "Produis un texte de vingt à vingt-cinq lignes à dominante "
             "**descriptive**.",
             "Première partie : décris **le lieu** où se tient le tribunal des "
             "animaux, tel que tu l'imagines.",
             "Seconde partie : fais le **portrait** de Kulu la Tortue — "
             "physique, puis caractère.",
             "**Obligatoire :** un ordre de description annoncé ; deux "
             "comparaisons ; un détail qui touche un autre sens que la vue ; "
             "trois adjectifs de caractère à la fin du portrait."],
         "bareme": [["La description suit un ordre visible", "4"],
                    ["Le portrait joint le physique et le moral", "5"],
                    ["Les expansions du nom sont variées et justes", "4"],
                    ["Orthographe et ponctuation", "4"],
                    ["Présentation, écriture lisible, longueur respectée", "3"]]},
    ])
    b.append(saut())
    return b, corriges
