# -*- coding: utf-8 -*-
"""
Fiches 1 à 3 du cahier « Stances et Poèmes ».

Les poèmes viennent de `stances_extraits.py`, produit depuis l'édition
numérique : aucun vers n'est retapé ici. Chaque fiche porte sur un poème
**entier** — c'est l'unité qui compte en poésie, non le nombre de mots.

Fiche 1  Le Vase brisé                 La Vie intérieure
Fiche 2  La Mémoire                    La Vie intérieure
Fiche 3  Le meilleur Moment des Amours Jeunes filles
"""
import stances_extraits as X

SRC = X.SRC


def _src(cle):
    return SRC + X.REFERENCES[cle][2] + "."


# ═══════════════════════════════════════════════════════ FICHE 1 — LE VASE BRISÉ
F1 = dict(
    titre="Fiche 1 — « Le Vase brisé »",
    repere=X.REPERES["P1"],
    extrait=X.P1,
    source=_src("P1"),
    disposition="vers",

    objectif="Étudier une allégorie tenue d'un bout à l'autre d'un poème, et "
             "comprendre pourquoi il faut décrire longuement un objet pour parler "
             "d'un cœur.",

    lexique=[
        ["verveine", "plante à petites fleurs, qu'on met dans un vase."],
        ["fêlé", "fendu sans être cassé en morceaux. La fêlure ne se voit pas "
                 "toujours."],
        ["effleurer", "toucher à peine, en passant."],
        ["meurtrissure", "marque laissée par un coup ; blessure sans plaie ouverte."],
        ["mordant", "attaquant peu à peu, comme un acide ronge un métal."],
        ["le suc", "le liquide qui nourrit une plante."],
        ["intact", "entier, qui n'a subi aucun dommage — en apparence."],
    ],

    situation="Le poème est le troisième de « La Vie intérieure », la première "
              "section du recueil, et il est dédié à Albert Decrais. C'est de tout "
              "le livre la pièce que la postérité a retenue : elle était récitée "
              "dans les salons du vivant de l'auteur, et elle a longtemps figuré "
              "dans les anthologies scolaires françaises. Vingt vers, cinq "
              "quatrains d'octosyllabes, une seule image. Rien n'y est raconté : un "
              "vase a été touché par un éventail, et il se vide sans que personne "
              "s'en aperçoive. Le mot « cœur » n'apparaît qu'au quatorzième vers.",

    mouvements=[
        "**Le vase (v. 1-12), trois quatrains.** L'accident, sa marche silencieuse, "
        "son résultat. Le poème s'en tient à l'objet et n'explique rien.",
        "**Le cœur (v. 13-20), deux quatrains.** La comparaison est enfin dite — "
        "« Souvent aussi » — et l'on relit tout ce qui précède autrement.",
        "**La charnière est un seul mot.** « Aussi », au vers 13, fait basculer le "
        "poème du concret à l'humain. Il n'y a ni « ainsi », ni « de même », ni "
        "aucune explication : le lecteur fait le travail.",
    ],

    axes=[
        ("Une allégorie construite avant d'être nommée", [
            "**L'objet occupe les trois cinquièmes du poème.** Douze vers sur vingt "
            "ne parlent que d'un vase : la verveine, le cristal, l'eau, le suc des "
            "fleurs. Aucun de ces mots ne renvoie encore à un être humain. Le "
            "lecteur croit lire une description.",
            "**Le retournement se fait en un vers.** « Souvent aussi la main qu'on "
            "aime, / Effleurant le cœur, le meurtrit ». Deux mots suffisent à "
            "transformer la description en aveu : « la main » et « le cœur ». "
            "Chaque terme de la première moitié trouve alors son répondant.",
            "**Le mot exact est allégorie.** On parle de comparaison quand deux "
            "termes sont rapprochés par « comme » ; de métaphore quand le "
            "rapprochement est implicite ; d'**allégorie** quand une idée abstraite "
            "est représentée par une chose concrète **tout au long** d'un texte. "
            "C'est le cas ici : le vase n'est pas une image passagère, c'est le "
            "poème entier.",
            "**Ce que l'allégorie permet de dire.** Une blessure qu'on ne peut pas "
            "montrer. Si le poète écrivait « j'ai du chagrin », il faudrait le "
            "croire sur parole. En montrant un vase qui se vide, il rend la chose "
            "visible et vérifiable.",
        ]),
        ("Le travail du temps, ou comment une blessure devient une ruine", [
            "**L'accident est minuscule.** « D'un coup d'éventail » : l'objet le "
            "plus léger qui soit. « Le coup dut effleurer à peine » : le verbe même "
            "dit l'insignifiance. « Aucun bruit ne l'a révélé » : rien n'a eu lieu, "
            "en apparence.",
            "**La destruction est lente et méthodique.** Le deuxième quatrain aligne "
            "quatre mots de progression : « Mordant… chaque jour », « D'une marche "
            "invisible et sûre », « lentement », « le tour ». La fêlure est traitée "
            "comme un être qui travaille.",
            "**Le résultat est irréversible.** « Son eau fraîche a fui goutte à "
            "goutte » : le passé composé marque l'achèvement. Et surtout : "
            "« Personne encore ne s'en doute ». Le vase est perdu avant qu'on l'ait "
            "su.",
            "**La même logique s'applique au cœur.** « Il sent croître et pleurer "
            "tout bas / Sa blessure fine et profonde ». Deux adjectifs qui "
            "s'opposent — fine, donc invisible ; profonde, donc mortelle. C'est "
            "l'antithèse centrale du poème.",
        ]),
        ("Un poème sur ce qui ne se voit pas", [
            "**Le champ lexical de l'invisible traverse le texte.** « Aucun bruit », "
            "« invisible », « Personne encore ne s'en doute », « Toujours intact aux "
            "yeux du monde », « tout bas ». Cinq notations pour un poème de vingt "
            "vers.",
            "**Le regard des autres est explicitement mentionné.** « Aux yeux du "
            "monde » : le poème nomme le public qui ne voit rien. La souffrance "
            "n'est pas seulement cachée, elle est en outre invisible aux autres, ce "
            "qui l'aggrave.",
            "**L'avertissement final s'adresse à quelqu'un.** « N'y touchez pas » "
            "est un impératif à la deuxième personne du pluriel : le poème parle à "
            "un vous. Selon qu'on entend là de la politesse ou de la distance, la "
            "fin change de couleur.",
            "**Piste de discussion.** Certains lecteurs trouvent le poème "
            "sentimental. On peut leur objecter qu'il ne dit pas un mot de "
            "sentiment : il décrit un objet, une fêlure, une fuite d'eau. C'est "
            "précisément ce qui l'a sauvé.",
        ]),
    ],

    forme=[
        "**Le mètre.** Des octosyllabes, vers de huit syllabes. Comptez le premier : "
        "« Le / vas(e) / où / meurt / cet / te / ver / vei-ne » — le e de « vase » "
        "s'élide devant la voyelle de « où », celui de « cette » se prononce devant "
        "la consonne de « verveine ». Huit. Faites compter la classe doigt par "
        "doigt : c'est la seule façon d'installer la règle du e muet.",
        "**Pourquoi l'octosyllabe et non l'alexandrin.** Le vers court ne laisse pas "
        "de place au développement. Chaque vers doit porter une seule notation, "
        "d'où la sécheresse du poème et sa force de sentence.",
        "**Les rimes sont croisées** (ABAB) dans les cinq quatrains : verveine / "
        "fêlé / à peine / révélé. Elles alternent régulièrement rime féminine "
        "(terminée par un e muet) et rime masculine. Cette régularité sans faille "
        "contraste avec ce que le poème raconte — un désordre irréparable.",
        "**Un enjambement, un seul.** « Mais la légère meurtrissure, / Mordant le "
        "cristal chaque jour ». La phrase déborde le vers, et le participe "
        "« Mordant » se trouve rejeté en tête du suivant, à la place la plus "
        "exposée. Le seul mot violent du poème est aussi le seul mot rejeté.",
        "**Le chiasme final.** Le vers 12 dit : « N'y touchez pas, il est brisé. » "
        "Le vers 20, dernier du poème, dit : « Il est brisé, n'y touchez pas. » Les "
        "deux membres sont intervertis. Ce croisement s'appelle un **chiasme**, et "
        "il n'est pas un ornement : dans le premier cas on avertit avant de "
        "constater, dans le second on constate avant d'avertir. Le vase se répare "
        "peut-être ; le cœur, non.",
        "**Une ponctuation qui compte.** Le poème n'emploie ni exclamation ni "
        "question. Rien qu'un point-virgule et des points. La retenue est dans la "
        "ponctuation avant d'être dans les mots.",
    ],

    encadres=[
        ("methode", "Reconnaître une allégorie, et ne pas la confondre", [
            "Trois figures voisines, qu'on mélange souvent en classe :",
            "- **Comparaison** : les deux termes sont là, reliés par un outil "
            "(comme, tel, pareil à). « Mon cœur est comme un vase fêlé. »",
            "- **Métaphore** : l'outil disparaît, l'image reste ponctuelle. « Le "
            "vase de mon cœur. »",
            "- **Allégorie** : l'image tient tout le texte et se développe. C'est "
            "le cas ici, et c'est pourquoi le mot « cœur » peut attendre le "
            "quatorzième vers.",
            "**Le test** : essayez de supprimer l'image. Si le texte survit, c'était "
            "une métaphore. S'il ne reste rien, c'était une allégorie.",
        ]),
        ("saviez", "Le poème que tout le monde connaissait", [
            "« Le Vase brisé » a rendu son auteur célèbre presque immédiatement "
            "après 1865, et il est resté pendant des décennies dans les manuels et "
            "les récitations. Quand Sully Prudhomme reçoit le premier prix Nobel de "
            "littérature en 1901, c'est en grande partie sur la réputation de ces "
            "vingt vers.",
            "L'ironie est cruelle : le poète a écrit cent sept autres poèmes, deux "
            "longs livres philosophiques, et traduit Lucrèce. Le public n'a retenu "
            "que le vase. Il y a là un bon sujet de discussion : que retient-on d'un "
            "écrivain, et pourquoi cela plutôt qu'autre chose ?",
        ]),
    ],

    plan=[
        ("Introduction",
         "Publié en 1865 dans *Stances et Poèmes*, premier recueil de Sully "
         "Prudhomme, « Le Vase brisé » est devenu le poème le plus connu d'un auteur "
         "que le Parnasse comptait parmi les siens. En cinq quatrains "
         "d'octosyllabes, il décrit un vase fêlé par un coup d'éventail, puis "
         "compare cet objet à un cœur blessé. **Comment un objet minuscule et une "
         "forme aussi brève parviennent-ils à dire une souffrance que rien ne "
         "montre ?** On étudiera d'abord la construction de l'allégorie, puis le "
         "travail du temps qu'elle rend visible, enfin la poétique de l'invisible "
         "qui donne au poème sa retenue."),
        ("I. Une allégorie patiemment construite", [
            "**A. Douze vers de description pure.** Le vase, la verveine, le "
            "cristal, l'eau : rien qui renvoie à l'homme. Le lecteur est tenu dans "
            "le concret.",
            "**B. Un basculement en un mot.** « Souvent aussi » (v. 13) : "
            "l'adverbe suffit, aucune explication n'est donnée. Chaque élément "
            "trouve rétrospectivement son répondant — la main pour l'éventail, le "
            "cœur pour le vase, l'amour pour la fleur.",
            "**C. Ce que le procédé permet.** Rendre visible une blessure qui ne se "
            "voit pas, et l'imposer au lecteur avant qu'il ait pu se méfier.",
        ]),
        ("II. Le travail du temps", [
            "**A. L'insignifiance du départ.** « d'un coup d'éventail », « effleurer "
            "à peine », « aucun bruit » : la cause est dérisoire.",
            "**B. Une progression méthodique.** « Mordant… chaque jour », « d'une "
            "marche invisible et sûre », « lentement… le tour » : la fêlure "
            "travaille comme un être vivant. Personnification discrète.",
            "**C. L'irréversible.** « Son eau fraîche a fui goutte à goutte » ; "
            "« Personne encore ne s'en doute ». Le désastre est accompli avant "
            "d'être connu.",
        ]),
        ("III. Une poétique de l'invisible", [
            "**A. Le champ lexical du caché.** « aucun bruit », « invisible », "
            "« personne », « aux yeux du monde », « tout bas ».",
            "**B. L'antithèse centrale.** « Toujours intact aux yeux du monde » "
            "contre « Sa blessure fine et profonde ». L'apparence contre la vérité.",
            "**C. La forme retient l'émotion.** Octosyllabe, rimes croisées "
            "régulières, ponctuation sobre, chiasme final. La rigueur parnassienne "
            "n'éteint pas le sentiment : elle l'empêche de déborder, et le rend "
            "d'autant plus perceptible.",
        ]),
        ("Conclusion",
         "En vingt vers et une seule image, Sully Prudhomme fait entendre ce qu'un "
         "aveu direct n'aurait pas fait croire. Le poème vaut moins par son sujet — "
         "un chagrin d'amour — que par sa méthode : décrire jusqu'au bout, et "
         "laisser le lecteur comprendre. On le rapprochera de « Les Chaînes », dans "
         "la même section, où une autre image concrète sert à dire une servitude "
         "intérieure."),
    ],

    ouverture="On comparera avec « L'Habitude » et « Les Chaînes », deux autres "
              "poèmes de « La Vie intérieure » qui procèdent de la même manière : "
              "une chose du monde pour dire un état de l'âme. Et l'on gardera le "
              "procédé en mémoire pour la fiche 6 : dans « Je me croyais poète », "
              "l'objet sera un lingot d'airain, et il servira à dire tout autre "
              "chose.",

    comprendre=[
        "Qui a fêlé le vase ? Le geste était-il volontaire ? Citez le vers qui "
        "répond.",
        "Combien de temps s'écoule entre l'accident et le moment où le vase est "
        "vide ? Relevez les mots qui l'indiquent.",
        "À partir de quel vers le poème cesse-t-il de parler du vase ? Recopiez ce "
        "vers.",
        "Que signifie « Toujours intact aux yeux du monde » ? De qui parle-t-on, du "
        "vase ou du cœur ?",
        "À qui s'adresse l'ordre « N'y touchez pas » ?",
    ],

    analyser=[
        "a) Relevez tous les mots qui disent que rien ne se voit. b) Combien en "
        "comptez-vous pour vingt vers ? c) Que produit cette accumulation ?",
        "« D'une marche invisible et sûre ». a) De quoi parle-t-on ? b) Quel est le "
        "procédé qui consiste à faire agir une chose comme une personne ? "
        "c) Pourquoi ce procédé convient-il particulièrement à une fêlure ?",
        "Comparez le vers 12 et le vers 20. a) Quels mots ont changé de place ? "
        "b) Comment s'appelle cette figure ? c) La reprise dit-elle exactement la "
        "même chose dans les deux cas ? Justifiez.",
        "« Sa blessure fine et profonde ». a) Ces deux adjectifs sont-ils "
        "compatibles ? b) Comment appelle-t-on le rapprochement de deux termes qui "
        "s'opposent ? c) Que gagne le poème à cette contradiction ?",
        "Comptez les syllabes des vers 5 à 8. Marquez d'une croix les e muets qui se "
        "prononcent et d'un rond ceux qui s'élident.",
        "Le mot « cœur » n'arrive qu'au vers 14. a) Qu'aurait changé sa présence au "
        "vers 1 ? b) Réécrivez le premier quatrain en y introduisant le mot, puis "
        "dites ce qui se perd.",
    ],

    parcours1=[
        "a) Recopiez le tableau et complétez-le : dans la colonne de gauche, cinq "
        "mots qui concernent le vase ; dans celle de droite, le mot correspondant "
        "qui concerne le cœur.",
        "b) Apprenez les cinq derniers vers par cœur et récitez-les en marquant la "
        "fin de chaque vers.",
    ],

    parcours2=[
        "a) Montrez que le poème pourrait s'arrêter au vers 12 et qu'il serait "
        "encore un poème — mais un autre. Dites lequel.",
        "b) Le poème ne prononce jamais les mots « amour », « chagrin », "
        "« souffrance ». Établissez la liste de ce qui les remplace, et expliquez ce "
        "que ce refus du mot direct apporte au texte.",
    ],

    synthese="Pourquoi faut-il douze vers de description avant que le mot « cœur » "
             "puisse être prononcé ?",

    examen="**Vers le commentaire composé.** Rédigez entièrement la partie I du "
           "plan ci-dessus, en trois paragraphes. Chaque paragraphe s'ouvre par une "
           "idée directrice, s'appuie sur deux citations courtes, et nomme le "
           "procédé avant d'en donner l'effet. On attend de 250 à 300 mots.",
)


# ═════════════════════════════════════════════════════════ FICHE 2 — LA MÉMOIRE
F2 = dict(
    titre="Fiche 2 — « La Mémoire »",
    repere=X.REPERES["P2"],
    extrait=X.P2,
    source=_src("P2"),
    disposition="vers",

    objectif="Étudier un poème en deux parties qui se retournent l'une contre "
             "l'autre, et comprendre qu'une composition peut porter à elle seule "
             "une idée.",

    lexique=[
        ["révolus", "achevés, écoulés. Les « temps révolus » sont le passé."],
        ["belliqueux", "porté à la guerre, combatif."],
        ["colloque", "conversation, entretien."],
        ["altier", "fier, hautain."],
        ["trépassé", "mort (nom)."],
        ["revenant", "mort qui reparaît chez les vivants."],
        ["gisantes", "couchées, étendues à terre."],
        ["dépouillé d'écorces", "quitté d'enveloppes successives, comme un arbre "
                                "perd ses couches."],
        ["oublieuse", "qui oublie ; ici, l'histoire elle-même."],
    ],

    situation="Quinzième poème de « La Vie intérieure », « La Mémoire » est l'une "
              "des rares pièces du recueil à porter une division interne : deux "
              "parties numérotées I et II, de neuf quatrains chacune, en "
              "octosyllabes. Le poème est bâti sur une apostrophe : le poète parle à "
              "la mémoire comme à une personne. Il faut faire remarquer d'emblée "
              "que la partie II ne prolonge pas la partie I — elle la contredit. "
              "C'est un poème dont le sens est dans l'architecture.",

    mouvements=[
        "**Partie I — l'éloge (9 quatrains).** La mémoire ressuscite les morts, "
        "grands hommes et humbles cœurs ; elle donne au présent l'épaisseur du "
        "passé. Le poète l'admire, puis commence à s'étonner.",
        "**À l'intérieur de la partie I, un glissement.** Les six premiers quatrains "
        "louent ; les trois derniers interrogent : « Quelle existence ai-je "
        "rendue / À mon père en me souvenant ? » L'éloge devient question avant même "
        "la partie II.",
        "**Partie II — l'échec (9 quatrains).** Le poète demande à la mémoire "
        "l'origine, ce qui précède la naissance. Elle se tait. « Ah, tu t'obstines à "
        "te taire ! »",
        "**La chute.** Les deux derniers vers élargissent l'échec à l'humanité "
        "entière : ni l'histoire ni la terre ne répondent.",
    ],

    axes=[
        ("Une puissance à qui l'on parle", [
            "**Le poème s'ouvre sur une apostrophe.** « Ô Mémoire, qui joins à "
            "l'heure / La chaîne des temps révolus ». Le O vocatif, la majuscule, la "
            "proposition relative qui la définit : la mémoire est traitée en "
            "personne dès le premier vers.",
            "**La personnification se poursuit par les verbes.** Elle « joint », "
            "elle « nomme », elle « permet », elle « peut faire », elle « donne ». "
            "Ce sont tous des verbes d'action et de pouvoir. La mémoire est présentée "
            "comme une souveraine.",
            "**Elle a même un regard et un œil.** Partie II : « jusqu'où ton regard "
            "s'enfonce », « Ton œil rêveur, clos à demi ». La figure se précise en "
            "un visage — et ce visage détourne les yeux.",
            "**Deux noms pour une même puissance.** La partie I dit « Mémoire », la "
            "partie II dit « souvenir ». Le premier est une faculté, le second un "
            "contenu. Le passage de l'un à l'autre accompagne le passage de "
            "l'admiration à la déception.",
        ]),
        ("Une architecture qui porte le sens", [
            "**Deux parties égales et opposées.** Neuf quatrains chacune, même "
            "mètre, même disposition de rimes. L'égalité formelle rend l'opposition "
            "de sens plus nette : c'est la même voix qui loue puis qui reproche.",
            "**Le parallélisme des deux ouvertures.** « Ô Mémoire, qui joins… / Je "
            "t'admire » (I) répond à « Ô souvenir, l'âme renonce, / Effrayée, à te "
            "concevoir » (II). Même apostrophe, sentiment inverse : admiration "
            "contre effroi.",
            "**Deux quatrains construits en miroir dans la partie I.** « Le présent "
            "n'est qu'un feu de joie… mais tu peux faire qu'il flamboie / Des mille "
            "fêtes du passé » ; puis « Le présent n'est qu'un cri d'angoisse… mais "
            "tu peux faire qu'il s'accroisse / De tous les sanglots du passé ». Même "
            "moule, contenu inversé : la mémoire amplifie la joie et la douleur "
            "avec la même indifférence. C'est le premier signe qu'elle n'est pas "
            "seulement bienfaisante.",
            "**Ce qu'il faut en conclure.** Le poème ne dit pas son idée, il la "
            "construit. Un commentaire qui n'analyserait que les images passerait à "
            "côté de l'essentiel.",
        ]),
        ("Ce que la mémoire ne peut pas donner", [
            "**La demande de la partie II est précise.** Non pas se souvenir "
            "davantage, mais remonter avant la naissance : « Ce que j'étais avant de "
            "naître, / N'en sais-tu rien, ô souvenir ? »",
            "**Le refus est formulé comme un entêtement.** « Ah, tu t'obstines à te "
            "taire ! » Le verbe accuse : ce n'est pas une impuissance, c'est un "
            "silence volontaire. La mémoire devient une interlocutrice qui se "
            "dérobe.",
            "**L'image de la lampe qu'on porte à l'envers.** « Devant moi la vie "
            "inquiète / Marche en levant sa lampe d'or, / Et j'avance en tournant la "
            "tête / Le long d'un sombre corridor. » L'homme avance vers l'avenir en "
            "regardant derrière lui : la posture même de la mémoire. Le flambeau "
            "« N'éclaire ma route éternelle / Que du berceau vide au tombeau ».",
            "**La conclusion est un double aveu d'ignorance.** « L'histoire, "
            "passante oublieuse, / Ne m'a pas appris d'où je sors, / Et la terre "
            "silencieuse / N'a jamais dit où vont les morts. » Deux savoirs manquent, "
            "symétriquement : l'origine et la fin. C'est la question philosophique de "
            "tout le recueil.",
        ]),
    ],

    forme=[
        "**Le mètre.** Octosyllabes, comme « Le Vase brisé ». Le vers court convient "
        "ici à une pensée qui procède par affirmations successives, chacune tenant "
        "en une ligne.",
        "**Les rimes sont croisées** (ABAB) et alternent régulièrement féminines et "
        "masculines : l'heure / révolus / demeure / plus. Dix-huit quatrains sans "
        "une irrégularité : la forme est parfaitement stable pendant que le propos "
        "se renverse.",
        "**Une même rime tient trois quatrains de suite : « passé ».** « amassé / passé », « poussé / "
        "passé », « trépassé / passé ». Le mot qui est le sujet du poème occupe la "
        "position la plus exposée du vers, à répétition. Ce n'est pas une pauvreté "
        "de rime, c'est un martèlement.",
        "**Le motif de la chaîne encadre le poème.** Vers 2 : « La chaîne des temps "
        "révolus ». Avant-dernier quatrain : « De la chaîne de mes années / Je sens "
        "les deux bouts dans la nuit. » La même image ouvre et ferme, mais elle a "
        "changé de sens — d'abord ce qui relie, ensuite ce dont on ne voit plus les "
        "extrémités.",
        "**L'interrogation gouverne la fin.** Comptez les points d'interrogation : "
        "ils se concentrent dans les trois derniers quatrains de la partie I et dans "
        "la partie II. Le poème commence en affirmations et finit en questions — "
        "sauf les deux derniers quatrains, qui retombent en constat.",
        "**Une remarque de vocabulaire.** L'édition de 1865 imprime des formes que "
        "l'orthographe moderne a abandonnées. Elles sont conservées telles quelles "
        "dans ce cahier : on n'améliore pas le texte d'un auteur.",
    ],

    encadres=[
        ("methode", "Lire un poème divisé en parties", [
            "Quand un poème porte des chiffres romains, la première question n'est "
            "pas « de quoi parle chaque partie ? » mais « **quel rapport les deux "
            "parties entretiennent-elles ?** ». Quatre cas seulement :",
            "- **Progression** : la seconde prolonge la première (avant / après).",
            "- **Opposition** : la seconde contredit la première. C'est le cas ici.",
            "- **Élargissement** : la seconde passe du particulier au général.",
            "- **Miroir** : la seconde reprend la première en inversant.",
            "Trancher entre ces quatre cas dès la première lecture donne un plan de "
            "commentaire presque tout fait.",
        ]),
        ("astuce", "Repérer un renversement sans se tromper", [
            "Un renversement laisse toujours des traces dans le lexique. Relevez les "
            "verbes que le poète emploie pour lui-même : dans la partie I, "
            "« j'admire » ; dans la partie II, « l'âme renonce », « cherchant en "
            "vain », « je sens ». On passe de l'admiration à l'effort, puis à "
            "l'échec, puis à une simple sensation.",
            "Le même relevé sur les verbes de la mémoire donne : « tu joins », « tu "
            "permets », « tu peux faire », puis « tu t'obstines à te taire », « ne "
            "suit point ». La courbe est identique. Deux relevés de cinq minutes "
            "valent mieux qu'une intuition.",
        ]),
    ],

    plan=[
        ("Introduction",
         "« La Mémoire » figure dans « La Vie intérieure », première section de "
         "*Stances et Poèmes* (1865). Sully Prudhomme, formé aux sciences et privé "
         "d'elles par la maladie, y interroge la faculté qui permet à l'homme de "
         "retenir son passé. En deux parties de neuf quatrains d'octosyllabes, il "
         "adresse à la mémoire un éloge, puis une accusation. **Comment un poème "
         "construit-il, par sa seule architecture, l'idée que la mémoire promet plus "
         "qu'elle ne tient ?** On examinera d'abord la mémoire comme puissance à qui "
         "l'on parle, puis la composition en deux volets qui porte le sens, enfin "
         "l'aveu d'ignorance sur lequel le poème se referme."),
        ("I. Une puissance à qui l'on parle", [
            "**A. L'apostrophe fondatrice.** « Ô Mémoire » : vocatif, majuscule, "
            "relative définitoire dès le premier quatrain.",
            "**B. Une personnification par les verbes de pouvoir.** Joindre, nommer, "
            "permettre, faire, donner : la mémoire agit et autorise.",
            "**C. Un visage qui se dérobe.** « ton regard », « ton œil rêveur, clos "
            "à demi » : la figure s'incarne au moment même où elle refuse de "
            "répondre.",
        ]),
        ("II. Une composition qui porte l'idée", [
            "**A. Deux parties égales et opposées.** Neuf quatrains chacune ; "
            "« je t'admire » contre « l'âme renonce, effrayée ».",
            "**B. Le parallélisme du feu de joie et du cri d'angoisse.** Même moule "
            "syntaxique, contenus inverses : la mémoire amplifie indifféremment le "
            "bonheur et la douleur.",
            "**C. Le motif de la chaîne, d'un bout à l'autre.** Ce qui reliait au "
            "début est ce dont on perd les deux bouts à la fin.",
        ]),
        ("III. Un aveu d'ignorance", [
            "**A. La demande impossible.** Non plus se souvenir, mais savoir « ce "
            "que j'étais avant de naître ».",
            "**B. L'image de l'homme qui avance à reculons.** La lampe d'or portée "
            "devant, la tête tournée en arrière, le corridor sombre.",
            "**C. La double clôture.** L'histoire ne dit pas d'où l'on vient, la "
            "terre ne dit pas où vont les morts. Le poème rejoint l'inquiétude de "
            "tout le recueil.",
        ]),
        ("Conclusion",
         "Poème de facture parfaitement régulière, « La Mémoire » démontre qu'une "
         "forme stable peut porter une pensée qui se défait. L'éloge du début n'est "
         "pas annulé par l'échec de la fin : la mémoire fait bien tout ce qu'on lui "
         "prête, mais elle ne fait pas ce dont l'homme aurait besoin. On rapprochera "
         "ce poème de « Intus », où deux voix se partagent aussi une seule "
         "conscience."),
    ],

    ouverture="À rapprocher de « Intus », dans la même section, où le débat n'est "
              "plus entre l'homme et une puissance extérieure mais entre deux voix "
              "intérieures — et de « L'Habitude », qui traite du temps par le biais "
              "opposé, celui de l'usure quotidienne.",

    comprendre=[
        "En combien de parties le poème est-il divisé ? Combien de quatrains "
        "compte chacune ?",
        "À qui le poète s'adresse-t-il dans le premier vers ? Et dans le premier "
        "vers de la partie II ?",
        "Selon la partie I, que permet la mémoire à l'égard des morts ? Citez deux "
        "vers.",
        "Que demande le poète à la mémoire dans la partie II ? Que lui répond-elle ?",
        "Quelles sont les deux choses que le poète déclare ignorer dans les quatre "
        "derniers vers ?",
    ],

    analyser=[
        "a) Relevez tous les verbes dont « Mémoire » ou « souvenir » est le sujet. "
        "b) Classez-les en deux colonnes selon qu'ils appartiennent à la partie I ou "
        "à la partie II. c) Que montre cette répartition ?",
        "Comparez les deux quatrains qui commencent par « Le présent n'est qu'un… ». "
        "a) Qu'est-ce qui est identique ? b) Qu'est-ce qui change ? c) Quelle idée "
        "ce parallélisme fait-il naître, sans que le poète ait à l'énoncer ?",
        "« Devant moi la vie inquiète / Marche en levant sa lampe d'or, / Et "
        "j'avance en tournant la tête ». a) Décrivez la position du corps. "
        "b) Pourquoi cette position convient-elle au sujet du poème ? c) Quel est "
        "l'effet de « sombre corridor » à la rime ?",
        "Cherchez le mot « chaîne » dans le poème. a) Combien de fois apparaît-il et "
        "où ? b) Le sens est-il le même aux deux endroits ? c) Comment appelle-t-on "
        "un motif qui ouvre et ferme un texte ?",
        "Relevez les points d'interrogation. a) Dans quelle partie se concentrent-"
        "ils ? b) Le poème se termine-t-il sur une question ou sur une affirmation ? "
        "c) Ce choix vous paraît-il plus dur ou plus doux qu'une question finale ?",
        "« Ah, tu t'obstines à te taire ! » a) Quel sentiment exprime « Ah ! » ? "
        "b) Que suppose le verbe « s'obstiner » quant à la volonté de la mémoire ? "
        "c) Le poète serait-il plus consolé si la mémoire était simplement "
        "impuissante ?",
    ],

    parcours1=[
        "a) Recopiez le premier quatrain de la partie I et le premier quatrain de la "
        "partie II l'un sous l'autre. Soulignez ce qui se ressemble.",
        "b) En une phrase chacun, dites ce que le poète pense de la mémoire au début "
        "et à la fin.",
    ],

    parcours2=[
        "a) Démontrez, relevés à l'appui, que la partie I contient déjà l'inquiétude "
        "de la partie II : à partir de quel quatrain le ton change-t-il ?",
        "b) « Je ne peux pas vivre en arrière, / Il ne peut revivre aujourd'hui ! » "
        "Analysez la construction de ces deux vers (symétrie, négations, temps "
        "verbaux) et montrez que la forme y interdit toute rencontre.",
    ],

    synthese="Le poème aurait-il le même sens si la partie II était placée avant la "
             "partie I ? Justifiez en une dizaine de lignes.",

    examen="**Vers la dissertation.** « Un poème peut penser sans démontrer. » "
           "Vous expliquerez cette formule en vous appuyant sur « La Mémoire », puis "
           "vous direz si elle vaut pour toute poésie. On attend un plan détaillé "
           "en deux parties, introduction rédigée.",
)


# ══════════════════════════════════ FICHE 3 — LE MEILLEUR MOMENT DES AMOURS
F3 = dict(
    titre="Fiche 3 — « Le meilleur Moment des Amours »",
    repere=X.REPERES["P3"],
    extrait=X.P3,
    source=_src("P3"),
    disposition="vers",

    objectif="Étudier un poème entièrement construit sur une répétition "
             "syntaxique, et montrer qu'une définition peut se faire uniquement par "
             "accumulation d'exemples.",

    lexique=[
        ["intelligences", "ici, ententes silencieuses : se comprendre sans parler."],
        ["promptes", "rapides."],
        ["furtives", "qui se font à la dérobée, sans être vues."],
        ["feintes rigueurs", "sévérités jouées, qui ne sont pas sincères."],
        ["indulgences", "marques de bienveillance ; ici, secrètes."],
        ["pudeur", "retenue de celui qui n'ose pas montrer ce qu'il éprouve."],
        ["faveur conquise", "marque d'estime obtenue de haute lutte."],
        ["exquise", "d'une délicatesse rare."],
    ],

    situation="Deuxième poème de « Jeunes filles », la section élégiaque du "
              "recueil. Cinq quatrains d'octosyllabes, une seule phrase de bout en "
              "bout ou presque. Le poème répond à une question qu'il ne pose pas : "
              "quel est le meilleur moment de l'amour ? Il écarte d'abord la réponse "
              "attendue — la déclaration —, puis énumère ce qui vaut mieux. Le texte "
              "ne raconte rien, ne met en scène personne : c'est une définition en "
              "vers.",

    mouvements=[
        "**Le refus (v. 1-2).** « Le meilleur moment des amours / N'est pas quand on "
        "a dit : “Je t'aime.” » La réponse attendue est écartée d'entrée.",
        "**L'énumération des signes (v. 3-12).** Quatre propositions en « il est "
        "dans… » : le silence, les ententes, les fausses sévérités, le frisson du "
        "bras. Ce sont tous des gestes ou des absences de geste.",
        "**L'exaltation (v. 13-20).** Le ton s'élève : « Heure unique », "
        "exclamations, « Heure de la tendresse exquise ». On ne définit plus, on "
        "célèbre.",
    ],

    axes=[
        ("Une définition par la négative, puis par accumulation", [
            "**Le poème commence par écarter.** « N'est pas quand on a dit : “Je "
            "t'aime.” » La citation entre guillemets isole la formule convenue et la "
            "met à distance. Le meilleur moment n'est pas celui que tout le monde "
            "croit.",
            "**L'anaphore fournit toute la structure.** Quatre fois « Il est "
            "dans… » : dans le silence, dans les intelligences, dans les feintes "
            "rigueurs, dans le frisson du bras. Le poème avance en répétant le même "
            "moule.",
            "**Ce que l'anaphore produit ici.** Elle donne l'impression que la liste "
            "pourrait continuer, donc que le moment décrit est inépuisable. Elle "
            "remplace aussi l'argumentation : le poète ne prouve rien, il montre.",
            "**Tous les exemples ont un point commun.** Aucun n'est un acte "
            "explicite. Un silence, une entente rapide, une sévérité jouée, un "
            "tremblement : ce sont des signes qu'il faut savoir lire. L'amour dont "
            "parle le poème est un langage, pas un aveu.",
        ]),
        ("Le paradoxe de l'attente préférée", [
            "**L'idée est contraire au sens commun.** On attend d'un poème d'amour "
            "qu'il célèbre l'union ; celui-ci célèbre le moment d'avant. C'est un "
            "paradoxe assumé, et c'est ce qui fait le poème.",
            "**Le détail le plus juste est le plus quotidien.** « Dans la page qu'on "
            "tourne ensemble / Et que pourtant on ne lit pas. » Deux personnes "
            "penchées sur un livre dont elles ne lisent pas un mot : la scène est "
            "banale, l'observation exacte, et elle dit tout.",
            "**La bouche close qui parle.** « Heure unique où la bouche close / Par "
            "sa pudeur seule en dit tant ». Le silence est présenté comme une "
            "parole plus riche que la parole. C'est un **oxymore** de situation.",
            "**Le dernier vers noue le paradoxe.** « Où les respects sont des "
            "aveux ! » Deux mots que tout oppose : le respect maintient la distance, "
            "l'aveu la supprime. Le poème se referme sur la contradiction qu'il a "
            "explorée.",
        ]),
        ("Un poème sans personnages", [
            "**Personne n'est nommé.** Ni « je », ni « tu », ni prénom, ni portrait. "
            "Le poème emploie le pronom indéfini « on » : « quand on a dit », "
            "« la page qu'on tourne ».",
            "**Ce que ce choix permet.** L'expérience devient celle de tout le "
            "monde. Le lecteur n'assiste pas à l'amour d'un autre : il reconnaît le "
            "sien. Comparez avec une élégie romantique, où l'aimée est nommée et "
            "l'amant singulier.",
            "**Le corps est pourtant présent.** Le bras, la main qui tremble, la "
            "bouche, les cheveux, le cœur. Le poème n'a pas de personnages mais il a "
            "des corps — réduits à des parties, comme dans un regard rapproché.",
            "**Une remarque à faire en classe.** Ce refus de nommer est aussi ce qui "
            "date le poème : la retenue décrite ici suppose des usages où l'on ne "
            "déclarait pas son amour aisément. On peut le discuter sans le juger.",
        ]),
    ],

    forme=[
        "**Le mètre.** Octosyllabes réguliers. Comptez le vers 2 : « N'est / pas / "
        "quand / on / a / dit : / Je / t'ai-me » — le e final de « t'aime » ne se "
        "prononce pas en fin de vers, mais il compte comme rime féminine.",
        "**Les rimes sont embrassées** (ABBA) : amours / t'aime / même / jours. "
        "C'est une différence notable avec « Le Vase brisé » et « La Mémoire », qui "
        "emploient des rimes croisées. La rime embrassée referme le quatrain sur "
        "lui-même : la première et la dernière se répondent, comme un cercle. Pour "
        "un poème sur un moment suspendu, la forme est bien choisie.",
        "**La syntaxe est une seule coulée.** Les quatre premiers quatrains ne "
        "forment qu'une phrase, tenue par les points-virgules. Aucune rupture : le "
        "moment décrit ne s'interrompt pas.",
        "**Un second réseau anaphorique dans la fin.** Après les quatre « Il est "
        "dans… », les deux derniers quatrains enchaînent les relatives en « où » : "
        "« Heure unique où… », « Où le cœur… », « Où le parfum… », « Où les "
        "respects… ». Le poème change d'outil sans changer de méthode.",
        "**Le passage de la définition à l'exclamation.** Les douze premiers vers "
        "n'ont pas une seule exclamation ; les huit derniers en ont deux. Le poème "
        "commence en analyse et finit en émotion.",
        "**Une comparaison discrète mais centrale.** « Où le cœur s'ouvre en "
        "éclatant / Tout bas, comme un bouton de rose ». « Éclater » et « tout bas » "
        "se contredisent, et la comparaison florale résout la contradiction : une "
        "fleur s'ouvre violemment et sans bruit.",
    ],

    encadres=[
        ("methode", "Analyser une anaphore sans se contenter de la nommer", [
            "Repérer une anaphore ne vaut aucun point. Ce qui en vaut, c'est de dire "
            "**ce qu'elle fait**. Quatre effets possibles, à choisir selon le texte :",
            "- **Insistance** : marteler une idée pour l'imposer.",
            "- **Accumulation** : suggérer que la liste pourrait continuer.",
            "- **Rythme** : donner au texte une allure de litanie ou de chanson.",
            "- **Structure** : servir de charpente à un poème qui n'a pas de récit.",
            "Ici, les trois derniers effets jouent ensemble. Un candidat qui écrit "
            "« l'anaphore insiste » sans plus n'a rien analysé.",
        ]),
        ("saviez", "Ce que la musique a retenu de cette section", [
            "Gabriel Fauré a mis en musique deux poèmes de Sully Prudhomme : "
            "« Ici-bas ! » en 1875, puis « Les Berceaux » en 1879. Les deux "
            "appartiennent au même monde que le poème étudié ici : brièveté, "
            "octosyllabes ou vers courts, émotion retenue.",
            "Cela s'explique. Un texte fait de répétitions et de strophes égales "
            "offre au musicien une structure toute prête : il peut répéter la même "
            "phrase mélodique d'une strophe à l'autre. La régularité parnassienne, "
            "qu'on croit froide, est en réalité chantable.",
        ]),
    ],

    plan=[
        ("Introduction",
         "Publié en 1865 dans la section « Jeunes filles » de *Stances et Poèmes*, "
         "« Le meilleur Moment des Amours » est un poème de cinq quatrains "
         "d'octosyllabes qui écarte d'emblée la réponse attendue : le meilleur "
         "moment n'est pas celui de la déclaration. **Comment un poème peut-il "
         "définir un sentiment sans le nommer et sans mettre en scène personne ?** "
         "On étudiera d'abord la définition par accumulation, puis le paradoxe de "
         "l'attente préférée à la possession, enfin l'effacement volontaire des "
         "personnes."),
        ("I. Définir par accumulation", [
            "**A. Un refus liminaire.** La formule « Je t'aime », mise entre "
            "guillemets, est écartée dès le deuxième vers.",
            "**B. L'anaphore « Il est dans… ».** Quatre occurrences, quatre signes, "
            "aucun argument : la liste tient lieu de démonstration.",
            "**C. Le relais des relatives en « où ».** Le procédé change, la "
            "méthode reste : accumuler pour suggérer l'inépuisable.",
        ]),
        ("II. Le paradoxe de l'attente", [
            "**A. Une thèse contraire au sens commun.** Le poème préfère l'avant à "
            "l'accomplissement.",
            "**B. Le silence comme parole.** « La bouche close / Par sa pudeur seule "
            "en dit tant » : le mutisme est le langage le plus dense du poème.",
            "**C. La chute en forme d'oxymore.** « Où les respects sont des "
            "aveux ! » : la distance devient le mode de l'aveu.",
        ]),
        ("III. Un poème sans personnages, mais non sans corps", [
            "**A. L'indéfini « on » et l'absence de noms.** L'expérience est "
            "offerte à tout lecteur.",
            "**B. Des corps réduits à des détails.** Le bras, la main qui tremble, "
            "la bouche, les cheveux : un regard rapproché plutôt qu'un portrait.",
            "**C. Une forme qui suspend le temps.** Rimes embrassées, phrase unique "
            "sans rupture, aucune notation de durée : le moment ne passe pas.",
        ]),
        ("Conclusion",
         "Le poème réussit à définir un sentiment sans le nommer, en substituant "
         "l'accumulation des signes à l'analyse. Sa réussite tient à un choix de "
         "forme : la rime embrassée et la phrase continue installent une suspension "
         "que le contenu revendique. On le comparera aux « Adieux », dans la même "
         "section, qui traite du moment inverse — celui où tout est déjà dit."),
    ],

    ouverture="On rapprochera ce poème de « Séparation » et des « Adieux », qui "
              "occupent l'autre extrémité de la même histoire. Et l'on notera que "
              "« Les Berceaux », dans « La Vie intérieure », emploie déjà cette "
              "manière d'écrire une émotion par un détail matériel plutôt que par "
              "une confidence.",

    comprendre=[
        "Quelle réponse le poème écarte-t-il dès le deuxième vers ?",
        "Relevez les quatre groupes introduits par « il est dans ». Recopiez-les.",
        "Que font les deux personnes évoquées au troisième quatrain ? Que ne "
        "font-elles pas ?",
        "À quoi le cœur qui s'ouvre est-il comparé ?",
        "Comment le poème se termine-t-il ? Recopiez le dernier vers et expliquez-le "
        "en une phrase.",
    ],

    analyser=[
        "a) Combien de fois le groupe « il est dans » revient-il ? b) Comment "
        "appelle-t-on cette répétition en tête de proposition ? c) Donnez deux "
        "effets qu'elle produit ici, autres que l'insistance.",
        "« Dans la page qu'on tourne ensemble / Et que pourtant on ne lit pas. » "
        "a) Quel mot marque la contradiction ? b) Que font réellement les deux "
        "personnes ? c) Pourquoi ce détail est-il plus efficace qu'une déclaration ?",
        "a) Relevez toutes les parties du corps mentionnées dans le poème. b) Le "
        "poème donne-t-il un visage entier à quelqu'un ? c) Que produit ce "
        "morcellement ?",
        "« Où le cœur s'ouvre en éclatant / Tout bas ». a) Quels sont les deux "
        "termes qui s'opposent ? b) Comment nomme-t-on ce rapprochement ? c) La "
        "comparaison qui suit résout-elle la contradiction ? Expliquez.",
        "Établissez le schéma des rimes du premier quatrain (A, B…). a) De quel type "
        "de rimes s'agit-il ? b) En quoi diffère-t-il de celui du « Vase brisé » ? "
        "c) Ce choix vous paraît-il convenir au sujet ?",
        "Le poème n'emploie ni « je » ni « tu ». a) Quel pronom les remplace ? "
        "b) Réécrivez les quatre premiers vers à la première personne. c) Dites "
        "précisément ce que le poème perd.",
    ],

    parcours1=[
        "a) Recopiez les quatre groupes en « il est dans » en les numérotant, et "
        "donnez à chacun un titre de deux mots.",
        "b) Apprenez le dernier quatrain et récitez-le en marquant l'exclamation "
        "finale.",
    ],

    parcours2=[
        "a) Montrez que le poème change d'outil grammatical à mi-parcours (de « il "
        "est dans » aux relatives en « où ») et cherchez ce que ce changement "
        "accompagne dans le ton.",
        "b) « Les respects sont des aveux. » Discutez cette formule en une "
        "vingtaine de lignes : la retenue est-elle toujours une manière de dire, ou "
        "peut-elle être une manière de taire ?",
    ],

    synthese="Le poème réussit-il à définir le meilleur moment des amours, ou "
             "seulement à en donner des exemples ? La différence a-t-elle de "
             "l'importance ?",

    examen="**Vers le commentaire composé.** Rédigez la partie II du plan ci-dessus "
           "en trois paragraphes, puis la conclusion. Chaque paragraphe comportera "
           "au moins deux citations, chacune analysée. On attend de 350 à 400 mots.",
)

FICHES_ST_1_3 = [F1, F2, F3]
