# -*- coding: utf-8 -*-
"""5ᵉ — *L'Arbre fétiche* : écrire, jouer, s'évaluer.

Pliya est d'abord un **descripteur** : il ouvre sa nouvelle par une ville et
la ferme par un orage. Les deux ateliers d'ici partent de là — décrire un lieu
qui annonce l'histoire, et raconter une histoire dont la fin est préparée sans
être dite.

Le support de correction orthographique est **composé** pour l'épreuve : le
livre est entre les mains de l'élève.
"""
import jeux
import source
from gabarit import (epreuve_etude_texte, epreuve_expression,
                     epreuve_orthographe, production)
from kit import enc, grille, h2, h3, p, saut

CLE = "arbre"
SRC = "Jean Pliya, *L'Arbre fétiche*, Éditions CLE, Yaoundé"
BORNES = ["VOITURE ROUGE", "L'HOMME QUI AVAIT TOUT DONNÉ", "LE GARDIEN DE NUIT",
          "Dossier pédagogique"]


# ==================================================== 5. Les productions

def partie5():
    b = [h2("5. J'écris — décrire un lieu, raconter une fin"),
         p("Deux ateliers ici. Les cinq autres façons d'écrire t'attendent "
           "dans les deux œuvres suivantes de ce manuel : chaque type n'est "
           "travaillé **qu'une fois**, à toi de réutiliser ensuite."),
         p("Comme toujours : **le modèle d'abord, la règle ensuite.**")]

    b += production(
        "la description d'un lieu qui annonce l'histoire",
        "décrire un lieu de telle façon que le lecteur devine ce qui va s'y "
        "passer.",
        modele=(
            "❶ Le carrefour de Nkolbisson n'a l'air de rien : quatre routes, "
            "un poteau tordu, deux boutiques. ❷ Sur la gauche, un bitume neuf "
            "file droit vers la ville, bordé de lampadaires que personne "
            "n'allume. ❸ Sur la droite, une piste de terre rouge s'enfonce "
            "entre les manguiers, fait un coude brusque et disparaît. ❹ On "
            "dirait qu'elle évite quelque chose. ❺ Les enfants du quartier "
            "prennent toujours la piste, même quand il pleut, même quand la "
            "route est plus courte. ❻ Personne ne leur a jamais expliqué "
            "pourquoi ; ils ne l'ont jamais demandé."),
        annotations=[
            ["❶ L'impression d'ensemble, volontairement plate",
             "« n'a l'air de rien ». On sous-entend le contraire."],
            ["❷ ❸ Deux moitiés opposées",
             "Le bitume droit / la piste qui fait un coude. **Toute la "
             "tension du lieu tient dans cette opposition.**"],
            ["❹ La phrase qui inquiète",
             "Six mots. On ne dit pas quoi : on dit **qu'il y a** quelque "
             "chose."],
            ["❺ Un usage inexpliqué",
             "Ce que les gens **font** dans ce lieu en dit plus long que sa "
             "forme."],
            ["❻ La question qu'on ne pose pas",
             "Le lecteur, lui, la posera. Il lira la suite pour cela."]],
        questions=[
            "Relève les deux moitiés du lieu et ce qui les oppose. Fais un "
            "petit tableau à deux colonnes.",
            "Compte les mots de la phrase ❹. Pourquoi si peu ?",
            "Le texte ne dit jamais ce qu'évite la piste. Est-ce un oubli ? "
            "Explique.",
            "Relis maintenant l'ouverture de *L'Arbre fétiche*. Retrouve le "
            "même procédé : quelle est la route droite ? quelles sont les "
            "ruelles qui font des coudes ? qu'évitent-elles ?",
            "Récris la phrase ❺ en supprimant « même quand il pleut, même "
            "quand la route est plus courte ». Que perd-on ?"],
        regle=[
            "Une description **suit un ordre** (de loin vers près, de gauche à "
            "droite, de haut en bas) et le lecteur avance avec le regard.",
            "Elle emploie des **expansions du nom** : adjectifs (*bitume "
            "neuf*), compléments du nom (*piste de terre rouge*), propositions "
            "relatives (*des lampadaires que personne n'allume*).",
            "**Une description peut annoncer l'histoire.** Pour cela : oppose "
            "deux parties du lieu, glisse un détail inexpliqué, et raconte ce "
            "que les gens y font.",
            "Temps employé : l'**imparfait** pour un lieu du passé, le "
            "**présent** pour un lieu qu'on décrit tel qu'il est."],
        exercices=[
            "**Enrichis.** Donne à chaque nom trois expansions différentes "
            "(adjectif, complément du nom, relative) : *une route · un arbre · "
            "un marché · une case*.",
            "**Oppose.** Décris en six lignes un lieu coupé en deux : d'un "
            "côté le neuf, de l'autre l'ancien. Au choix : un carrefour, une "
            "cour d'école, un marché, un quartier.",
            "**Écris seul.** Décris en quinze lignes **un lieu de ton "
            "quartier que les gens évitent** — ou qu'ils traversent d'une "
            "certaine façon. Obligatoire : un ordre annoncé, deux expansions "
            "par phrase au moins, une phrase courte qui inquiète, un usage "
            "inexpliqué.",
            "**Fais vérifier.** Ton voisin doit pouvoir dessiner ton lieu, et "
            "te dire ce qu'il croit qu'il va s'y passer. S'il n'a aucune idée, "
            "il manque un détail inquiétant."],
        astuce=("Le truc du détail inexpliqué", [
            "Ne dis jamais « c'était inquiétant » : le lecteur décide seul de "
            "ce qui l'inquiète.",
            "Donne-lui plutôt **un fait bizarre et sans explication** : une "
            "porte toujours fermée, un banc que personne n'occupe, un chien "
            "qui ne s'approche pas, des lampadaires qu'on n'allume pas.",
            "Chez Pliya, ce détail est une **ruelle qui fait un coude**. Rien "
            "de plus. Et le lecteur ne pense plus qu'à cela."]))

    b += production(
        "la narration : préparer une fin sans la dire",
        "raconter une histoire dont la fin, une fois lue, paraissait "
        "inévitable.",
        modele=(
            "❶ Le vieux Ndjock répétait à son fils de ne jamais traverser le "
            "pont pendant la saison des pluies. ❷ Le garçon haussait les "
            "épaules : le pont tenait depuis vingt ans. ❸ Ce matin-là, le ciel "
            "était bas et l'air si lourd que les mouches ne volaient plus. La "
            "rivière avait changé de couleur. ❹ Il partit quand même, un sac "
            "de manioc sur la tête, en sifflant. ❺ Au milieu du pont, il se "
            "retourna pour saluer un voisin. ❻ Il n'y eut pas de cri. Le "
            "premier coup de tonnerre couvrit tout."),
        annotations=[
            ["❶ L'avertissement",
             "Quelqu'un a prévenu. Le lecteur le sait ; le personnage aussi."],
            ["❷ Le mépris de l'avertissement",
             "Un geste suffit : hausser les épaules."],
            ["❸ Les signes",
             "Le ciel, l'air, les mouches, la couleur de l'eau. **Aucun n'est "
             "commenté.**"],
            ["❹ La faute, faite gaiement",
             "« en sifflant » : c'est ce mot qui rend la suite insupportable."],
            ["❺ Le geste de trop",
             "Il se retourne. Comme Dossou, qui « tourna le dos » à l'arbre."],
            ["❻ La fin, en creux",
             "On ne raconte pas la chute : on dit ce qu'on **n'a pas** "
             "entendu."]],
        questions=[
            "Relève les quatre signes de l'étape ❸. Le narrateur explique-t-il "
            "ce qu'ils annoncent ?",
            "Quel mot de l'étape ❹ rend la suite plus cruelle ? Supprime-le et "
            "compare.",
            "La dernière étape ne décrit pas l'accident. Comment le comprend-on "
            "quand même ?",
            "Retrouve dans *L'Arbre fétiche* les signes que Pliya sème avant "
            "la mort de Dossou : le voisin croisé au départ, le ciel, la "
            "jambe. Fais-en la liste dans l'ordre.",
            "Écris la même histoire en **annonçant** la fin dès la première "
            "phrase (« Ce jour-là, mon frère est mort sur le pont »). Quelle "
            "version préfères-tu ? Pourquoi ?"],
        regle=[
            "Un récit comporte cinq temps : **situation initiale → élément "
            "déclencheur → péripéties → dénouement → situation finale**.",
            "Pour qu'une fin paraisse **inévitable sans avoir été annoncée**, "
            "on sème des **présages** : des détails vrais, jamais commentés — "
            "le temps, un geste, un avertissement méprisé.",
            "Le **temps atmosphérique** (le ciel, l'orage, la chaleur) est le "
            "présage le plus commode : personne ne s'en méfie, et tout le "
            "monde le sent.",
            "Temps du récit : **imparfait** pour ce qui dure et pour les "
            "signes, **passé simple** pour les actions qui surviennent."],
        exercices=[
            "**Sème trois présages.** Voici trois fins ; écris, pour chacune, "
            "trois détails à placer avant, sans les commenter. (a) *Le toit "
            "s'effondre.* (b) *L'élève est renvoyé.* (c) *Le match est "
            "perdu.*",
            "**Réécris une fin en creux.** « Il tomba et se cassa le bras » → "
            "réécris-la sans nommer la chute ni la fracture.",
            "**Écris seul.** Raconte en vingt lignes une histoire où quelqu'un "
            "**passe outre un avertissement**. Obligatoire : les cinq temps du "
            "récit ; trois présages non commentés dont au moins un sur le "
            "temps ; une fin qui ne décrit pas l'accident.",
            "**Fais tester.** Lis ton texte à un camarade en t'arrêtant avant "
            "la fin, et demande-lui ce qui va arriver. S'il ne sait pas du "
            "tout, tes présages sont trop faibles ; s'il connaît la fin "
            "exacte, ils sont trop lourds."])

    b.append(saut())
    return b


# ============================================================ 6. Je joue

def partie6():
    b = [h2("6. Je joue et je révise"), p("Livre fermé.")]
    corriges = []

    e, c = jeux.mots_meles("Le monde de Pliya", [
        "iroko", "Abomey", "Dahomey", "Cotonou", "Sinhoue", "Houndjro",
        "cognee", "Tolegba", "Heviesso", "Gou", "Segbo", "Tegbessou",
        "Gbehanzin", "Mehou", "Dossou", "Lanta", "Cossi", "Mensavi",
        "Fiogbe", "Zannou", "toupie", "latérite"], graine=3)
    b += e
    corriges += c

    e, c = jeux.mots_croises("Les mots du recueil", [
        ("IROKO", "Le grand arbre sacré, chlorophora excelsa des botanistes"),
        ("NOUVELLE", "Récit court : « un événement que l'on découvre »"),
        ("FETICHE", "Objet ou arbre auquel on prête un pouvoir"),
        ("COGNEE", "La grosse hache de Dossou"),
        ("PRESAGE", "Signe qui annonce ce qui va arriver"),
        ("ORAGE", "Il monte pendant tout l'abattage et éclate à la fin"),
        ("ABOMEY", "L'ancienne capitale du Dahomey"),
        ("TOUPIE", "Ce que Mensavi vole au début de Voiture rouge"),
        ("VENELLE", "Toute petite rue qui fait un coude pour éviter un arbre"),
        ("EPIGRAPHE", "Citation placée en tête d'un texte pour l'éclairer"),
        ("KAPOK", "Ce à quoi ressemblent les cheveux de Mèhou"),
        ("ONOMATOPEE", "Mot qui imite un bruit, comme « clac ! »"),
    ], graine=59)
    b += e
    corriges += c

    e, c = jeux.qcm("As-tu lu les quatre nouvelles ?", [
        ("Quel prix a reçu la nouvelle *L'Arbre fétiche* ?",
         ["le Grand Prix littéraire de l'Afrique noire",
          "le Prix de la Nouvelle africaine 1963", "le Prix Goncourt",
          "le Prix du Concours théâtral interafricain"], 1),
        ("Quel est le métier de Paul Lanta ?",
         ["ingénieur des ponts et chaussées", "commis d'administration",
          "garde républicain", "bûcheron"], 1),
        ("De qui Mèhou est-il le fils ?",
         ["d'un roi", "d'un grand chef féticheur", "d'un bûcheron",
          "d'un commerçant"], 1),
        ("Quel roi, selon Mèhou, fut sauvé par un oiseau de cet iroko ?",
         ["Ghézo", "Gbêhanzin", "Tegbessou", "Dako-Donou"], 2),
        ("Quel détail du corps de Dossou explique sa mort ?",
         ["sa main calleuse", "sa jambe éclopée", "ses yeux injectés de sang",
          "ses biceps"], 1),
        ("Que vole Mensavi au début de *Voiture rouge* ?",
         ["une voiture rouge", "un beignet", "une toupie", "un fouet"], 2),
        ("Combien manque-t-il à Fiogbé pour les médicaments ?",
         ["cinq cents francs", "mille francs", "deux mille francs",
          "dix mille francs"], 2),
        ("Quel dieu « crache le feu » à la fin de *L'Arbre fétiche* ?",
         ["Gou", "Dada Sègbo", "Heviesso", "Tolégba"], 2),
    ])
    b += e
    corriges += c

    e, c = jeux.vrai_faux("Vrai ou faux à Abomey", [
        ("Les prisonniers refusent d'abattre l'arbre parce qu'ils sont "
         "paresseux.", False,
         "Ils manquent d'outils, et surtout ils redoutent le fétiche : "
         "« il y aurait un grave danger à s'y attaquer »."),
        ("Dossou croit aux divinités vaudou.", False,
         "Il n'y croit pas : il ne reconnaît que Dada Sègbo, l'être suprême. "
         "Mais il respecte les présages."),
        ("Le narrateur affirme que le fétiche s'est vengé.", False,
         "Il ne l'affirme jamais. Il rapporte l'orage, la jambe, le dos "
         "tourné — et laisse le lecteur conclure."),
        ("L'iroko avait environ trois cents ans.", True,
         "« Un connaisseur aurait pu, en regardant l'entaille, s'apercevoir "
         "que l'iroko était presque trois fois centenaire. »"),
        ("Mensavi finit par obtenir sa voiture rouge.", True,
         "La nouvelle se termine bien : un coup de la providence, la nuit de "
         "Noël."),
        ("C'est la pharmacienne seule qui humilie Fiogbé.", False,
         "L'employé au crâne rasé, africain comme lui, le chasse aussi : "
         "« Tu dégrades les nègres. »"),
    ])
    b += e
    corriges += c

    e, c = jeux.remise_en_ordre("La journée de l'iroko", [
        "M. Lanta consulte son éphéméride et convoque les prisonniers.",
        "L'équipe descend vers le sentier de Sinhoué et découvre l'iroko.",
        "Une délégation vient demander ce qu'on fera de l'arbre.",
        "Mèhou raconte l'histoire du roi Tegbessou et de l'oiseau.",
        "Dossou est engagé ; il affûte ses deux haches à l'huile de palme.",
        "L'arbre bascule du côté du sentier et écrase le bûcheron.",
    ], graine=67)
    b += e
    corriges += c

    e, c = jeux.qui_suis_je("Devine qui parle", [
        ("Je porte une cravate de soie rouge, je crois au plan "
         "d'urbanisation, et les histoires de fétiches me font sourire.",
         "Paul Lanta"),
        ("Je suis né avant que le roi Gbêhanzin ne fût déporté, et mon père "
         "était un grand féticheur.", "Mèhou"),
        ("Je boite, je refuse les cordes et les conseils, et j'abats des "
         "arbres pour me venger du destin.", "Dossou"),
        ("Je suis adossé à un cailcédrat, je regarde tourner une toupie qui "
         "n'est pas à moi, et j'ai très envie d'une voiture rouge.",
         "Mensavi"),
        ("Je veille la nuit avec une simple massue, et les enfants me croient "
         "capable d'affronter les esprits.", "Zannou"),
    ])
    b += e
    corriges += c

    b += jeux.carte_mentale(
        "L'Arbre fétiche", "L'ARBRE FÉTICHE",
        [("Le genre", ["quatre nouvelles", "un revirement dans chacune",
                       "Prix de la Nouvelle africaine 1963"]),
         ("Les personnages", ["des types opposés deux à deux",
                              "Lanta ≠ Mèhou", "Dossou et sa jambe"]),
         ("Les lieux", ["Abomey l'ancienne capitale", "Cotonou la ville neuve",
                        "la pharmacie, la nuit sans lampadaires"]),
         ("Les thèmes", ["tradition contre modernité", "riches contre pauvres",
                         "l'orgueil puni", "le don qui sauve"]),
         ("Les procédés", ["le décor qui annonce l'histoire",
                           "le temps atmosphérique", "l'épigraphe",
                           "les onomatopées"]),
         ("Ma question au livre", ["…", "…"])])

    b.append(saut())
    return b, corriges


# ======================================================== 7. Je m'évalue

ORTHO_FAUTIF = (
    "Le vieux Mèhou marchait lentement sur la piste de laterite. Le soleil "
    "chauffait déjà l'asphalte les acacias ne donnait presque plus d'ombre. Il "
    "connaissait ce sentier depuis son enfence et savait ou se dressait chaque "
    "grand arbre. Devant lui, les prisonniers avançait en silance, leurs houes "
    "sur l'épaule. Personne n'osait parler du fétiche. Quand ils arrivèrent au "
    "premier coude, le vieil homme s'arreta net, imobile, et leva les yeux vers "
    "la cime. Les lianes pendaient jusqu'au sol comme de grosse cordes. Un "
    "oiseau invisible chantait dans les branches hautes. Mèhou baissa la tête "
    "et murmurra quelques mots que personne ne comprit. Se jour-là, aucun "
    "d'eux ne touchèrent à l'iroko. Ils deblayèrent les herbes, entassèrent les "
    "branchages est rentrèrent au camp avant la pluie.")

ORTHO_CORRIGE = [
    ["1", "de **laterite**", "de **latérite**", "accent manquant", "0,5"],
    ["2", "l'asphalte **_** les acacias", "l'asphalte **;** les acacias",
     "point-virgule manquant", "0,5"],
    ["3", "s'**arreta**", "s'**arrêta**", "accent circonflexe manquant", "0,5"],
    ["4", "Ils **deblayèrent**", "Ils **déblayèrent**", "accent manquant",
     "0,5"],
    ["5", "son **enfence**", "son **enfance**", "orthographe d'usage", "1"],
    ["6", "en **silance**", "en **silence**", "orthographe d'usage", "1"],
    ["7", "net, **imobile**", "net, **immobile**",
     "orthographe d'usage : deux *m*", "1"],
    ["8", "**murmurra**", "**murmura**",
     "orthographe d'usage : un seul *r*", "1"],
    ["9", "les acacias ne **donnait**", "… ne **donnaient**",
     "accord sujet-verbe", "2"],
    ["10", "les prisonniers **avançait**", "… **avançaient**",
     "accord sujet-verbe", "2"],
    ["11", "comme de **grosse** cordes", "comme de **grosses** cordes",
     "accord de l'adjectif", "2"],
    ["12", "aucun d'eux ne **touchèrent**", "aucun d'eux ne **toucha**",
     "le sujet *aucun* est au singulier", "2"],
    ["13", "savait **ou** se dressait", "savait **où** se dressait",
     "homophone : *où* marque le lieu", "2"],
    ["14", "**Se** jour-là", "**Ce** jour-là",
     "homophone : *ce* est un déterminant démonstratif", "2"],
    ["15", "les branchages **est** rentrèrent",
     "les branchages **et** rentrèrent",
     "homophone : *et* relie deux verbes", "2"],
]


def partie7():
    b = [h2("7. Je m'évalue — trois épreuves")]
    corriges = []

    texte = source.extrait(CLE, "À dix ans, l'homme que j'admirais le plus",
                           mots=330, arret=["Dossier pédagogique"])
    b += epreuve_etude_texte(
        "Le gardien de nuit",
        chapeau="Cette quatrième nouvelle n'a pas été étudiée en classe : "
                "c'est ta lecture personnelle qui parle. Un enfant de dix ans "
                "raconte. Il admire Zannou, le veilleur de nuit, et cherche à "
                "comprendre d'où lui vient tant de courage. Le soir, il "
                "sifflote sur sa natte — et sa tante Goussi entre.",
        texte=texte, source=SRC,
        comprehension=[
            ("Qui raconte cette histoire ? Quel âge a-t-il ? Justifie par le "
             "texte.", "2"),
            ("Pourquoi le narrateur admire-t-il Zannou ? Donne trois raisons "
             "tirées du texte.", "2"),
            ("Que reproche la tante Goussi à l'enfant ? Quel danger annonce-"
             "t-elle ?", "2"),
            ("Relève l'explication que la tante donne du courage de Zannou. "
             "Le narrateur y croit-il tout de suite ?", "2"),
            ("« Comme les revenants, cet homme dormait le jour. » Explique "
             "cette comparaison. Que dit-elle du métier de veilleur ?", "2")],
        langue=[
            ("Relève quatre verbes conjugués, donne leur infinitif et leur "
             "temps.", "2"),
            ("« Je venais de m'étendre sur une natte. » Réécris cette phrase "
             "au présent, puis au futur simple.", "2"),
            ("Donne la nature et la fonction de chaque mot du groupe « une "
             "simple massue ».", "2"),
            ("Relève deux adjectifs qualificatifs et donne leur féminin et "
             "leur pluriel.", "2"),
            ("Trouve dans le texte un mot de la famille de *nuit*, un mot de "
             "la famille de *veille*, un mot de la famille de *peur*.", "2")])
    corriges += [h3("Épreuve 1 — Étude de texte : éléments de corrigé"),
                 grille([["Question", "Ce qu'on attend", "Pts"],
                         ["I.1", "Un enfant, qui dit « je » : il a **dix ans** "
                          "(« À dix ans, l'homme que j'admirais… »). Il dort "
                          "sur une natte à côté de son petit frère David.",
                          "2"],
                         ["I.2", "Zannou veille sur le sommeil des autres au "
                          "prix de mille périls ; armé d'une simple massue, il "
                          "affronte les voleurs et défie les bêtes sauvages ; "
                          "il ne craint même pas les esprits malfaisants.",
                          "2"],
                         ["I.3", "De **siffler la nuit**. Elle affirme que "
                          "cela attire les serpents venimeux, qui incarnent "
                          "des esprits ou des génies.", "2"],
                         ["I.4", "Zannou est « un homme fort » : il possède "
                          "des gris-gris. Le narrateur ne croit pas d'abord la "
                          "tante — « Ce n'est pas vrai, tante. Tu veux sans "
                          "doute m'effrayer. » — mais il se tait, le cœur "
                          "battant.", "2"],
                         ["I.5", "Le veilleur vit à l'envers des autres : "
                          "éveillé la nuit, endormi le jour. Il en devient "
                          "presque un être d'un autre monde — d'où la "
                          "comparaison avec les revenants, qui prépare le "
                          "climat de la nouvelle.", "2"],
                         ["II.1", "Ex. : *admirais* (admirer, imparfait) ; "
                          "*veillait* (veiller, imparfait) ; *résolus* "
                          "(résoudre, passé simple) ; *entra* (entrer, passé "
                          "simple).", "2"],
                         ["II.2", "Présent : *Je viens de m'étendre sur une "
                          "natte.* — Futur : *Je viendrai de m'étendre…* (ou "
                          "*Je m'étendrai sur une natte*).", "2"],
                         ["II.3", "*une* : déterminant article indéfini ; "
                          "*simple* : adjectif qualificatif, épithète de "
                          "*massue* ; *massue* : nom commun, noyau du groupe "
                          "nominal.", "2"],
                         ["II.4", "Ex. : *fort → forte, forts, fortes* ; "
                          "*venimeux → venimeuse, venimeux, venimeuses* ; "
                          "*sévère → sévère, sévères*.", "2"],
                         ["II.5", "*nuit → nuits, nocturne* ; *veille → "
                          "veillait, veilleuse* ; *peur → effrayer, "
                          "épouvante*.", "2"]])]

    b += epreuve_orthographe(ORTHO_FAUTIF,
                             "Texte composé pour l'épreuve, dans la manière du "
                             "recueil", nb_fautes=15)
    corriges += [h3("Épreuve 2 — Correction orthographique : corrigé"),
                 grille([["N°", "Écrit dans le texte", "Correction",
                          "Pourquoi", "Pts"]] + ORTHO_CORRIGE),
                 ("p", "**Total : 20 points.** Retirer **0,5 point** par mot "
                  "correct barré à tort.")]

    b += epreuve_expression([
        {"type": "Description et narration",
         "contexte": "Pliya ouvre sa nouvelle par une ville dont les ruelles "
                     "font des coudes pour éviter des arbres, et il la ferme "
                     "par un orage. Entre les deux, un homme meurt d'avoir "
                     "méprisé un avertissement.",
         "citation": "À la vue de cet arbre, on ressentait malgré soi une "
                     "impression de vénération.",
         "source": SRC,
         "taches": [
             "Produis un texte de vingt à vingt-cinq lignes.",
             "**Première partie (descriptive) :** décris un lieu de ton "
             "village ou de ton quartier que les gens respectent ou évitent.",
             "**Seconde partie (narrative) :** raconte ce qui arrive à "
             "quelqu'un qui n'a pas voulu tenir compte de cet usage.",
             "**Obligatoire :** un ordre de description annoncé ; deux "
             "expansions du nom par phrase ; trois présages non commentés "
             "dont un sur le temps ; une fin qui ne décrit pas l'accident."],
         "bareme": [["La description suit un ordre et fait voir le lieu", "5"],
                    ["Les présages sont présents et discrets", "4"],
                    ["Le récit est complet et sa fin est préparée", "4"],
                    ["Orthographe et ponctuation", "4"],
                    ["Présentation, écriture lisible, longueur respectée",
                     "3"]]},
        {"type": "Argumentation",
         "contexte": "Deux hommes s'affrontent dans *L'Arbre fétiche* : "
                     "M. Lanta veut percer une rue « pour cause d'utilité "
                     "publique » ; Mèhou veut sauver un arbre qui garde la "
                     "mémoire d'un roi. Aucun des deux n'est un imbécile.",
         "citation": "En plein XXe siècle nous ne pouvons plus croire aux "
                     "fétiches.",
         "source": SRC,
         "taches": [
             "Produis un texte **argumentatif** de vingt à vingt-cinq lignes.",
             "Sujet : *« Faut-il détruire les traces du passé pour construire "
             "un pays moderne ? »*",
             "**Obligatoire :** ton opinion, nuancée ; deux arguments "
             "expliqués ; **un exemple pris dans l'œuvre, avec une citation "
             "entre guillemets** ; la mention honnête d'un argument du camp "
             "adverse ; une conclusion."],
         "bareme": [["L'opinion est claire et nuancée", "3"],
                    ["Deux arguments sont donnés et expliqués", "5"],
                    ["L'exemple de l'œuvre est exact et cité", "3"],
                    ["Un argument adverse est reconnu honnêtement", "2"],
                    ["Orthographe et ponctuation", "4"],
                    ["Présentation et longueur", "3"]]},
    ])
    b.append(saut())
    return b, corriges
