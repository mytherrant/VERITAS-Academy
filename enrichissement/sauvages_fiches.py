# -*- coding: utf-8 -*-
"""
Lectures méthodiques — « Poèmes sauvages éclairés au feu de brousse » (1 à 3).

Classe de seconde. Registre du cahier : phrases courtes, mots expliqués là où
ils apparaissent, aucune notion employée avant d'avoir été définie.

Les six extraits reprennent le découpage que l'auteur propose lui-même dans le
dossier pédagogique joint au volume. Ils viennent de `sauvages_extraits`,
module produit mécaniquement depuis le document source : un poème sans
ponctuation ni majuscule ne se retape pas à la main.

`disposition="vers"` sur chaque fiche : le verset de N'koumo est aussi long qu'une
ligne de prose, et la détection automatique le composerait donc en prose, ce
qui effacerait la limite du vers et les blancs de strophe.
"""
import sauvages_extraits as X

# ═════════════════════════════════════════════════════════════ FICHE 1
F1 = dict(
    titre="Fiche 1 — « il fait si froid dans le soleil »",
    repere=X.REPERES["S1"],
    extrait=X.S1,
    source=X.REFERENCES["S1"],
    disposition="vers",
    objectif="Étudier l'ouverture d'un poème de deuil, et comprendre comment deux mots "
             "contraires placés côte à côte suffisent à installer tout un livre.",
    situation=(
        "Ce sont les premiers vers du poème, après la dédicace et l'épigraphe. Le poète "
        "s'adresse à Henrike Grohs, son amie, tuée le 13 mars 2016 sur la plage de "
        "Grand-Bassam. Rien n'a encore été raconté : le lecteur apprend la mort en même "
        "temps qu'il apprend à lire ce poème sans majuscules ni ponctuation."
    ),
    mouvements=[
        "**Le froid dans le soleil** (« il fait si froid dans le soleil… sous les "
        "cocotiers ») : l'annonce de la mort, par un contraste.",
        "**Le corps du poète atteint** (« et mes yeux à moi s'éteignent… plus bas que "
        "terre ») : la douleur passe par les yeux, la gorge, les paupières.",
        "**L'attentat, raconté par images** (« dans le ciel, à la place des oiseaux… ») : "
        "les balles remplacent les oiseaux.",
        "**Le retour vers la morte** (« je te retrouve dans les hauteurs de mon poème ») : "
        "le poème devient le lieu où l'on se retrouve.",
    ],
    lexique=[
        ["enragées", "folles de rage. Ici, ce sont les lumières qui le sont."],
        ["écroulées", "effondrées, tombées d'un coup."],
        ["lippues", "aux grosses lèvres. Le mot est rare ; il donne un corps aux douleurs."],
        ["malmenées", "traitées durement."],
        ["primates", "les singes, et par extension les hommes réduits à leur violence."],
        ["récalcitrants", "qui résistent, qui refusent de se taire."],
        ["une oraison", "une prière."],
        ["la morgue", "le lieu où l'on garde les corps des morts."],
        ["une kalach", "abréviation de kalachnikov, un fusil d'assaut."],
        ["Grand-Bassam", "ville de la côte ivoirienne, près d'Abidjan. Lieu de l'attentat "
                         "du 13 mars 2016."],
        ["Oussama", "Oussama ben Laden, fondateur d'Al-Qaïda. Dans le poème, son nom "
                    "désigne le fanatisme en général."],
    ],
    axes=[
        ("Une mort annoncée par un contraste",
         [
             "**Le premier vers est un oxymore.** « il fait si froid dans le soleil ». Un "
             "oxymore rapproche deux mots de sens contraire. Le froid et le soleil ne "
             "peuvent pas coexister ; c'est pourtant ce que le vers affirme. Le lecteur "
             "comprend aussitôt qu'il ne s'agit pas de la température.",
             "**Le mot « froid » revient trois fois** en deux vers : « si froid dans le "
             "soleil », « si froid dans mes mots », et il reviendra plus loin. La "
             "répétition déplace le froid : du ciel, il passe dans la langue du poète.",
             "**Le décor est un décor heureux.** « un samedi de plage et de rires sous les "
             "cocotiers ». Rien, dans ces mots, n'annonce un malheur. C'est le vers suivant "
             "qui retourne tout : « et tu avais de grands cris dans ton sang déversé ». Le "
             "poème ne raconte pas l'attentat : il fait entrer la mort dans une phrase de "
             "vacances.",
             "**« chasse à l'homme ».** L'expression désigne d'ordinaire une poursuite. "
             "Employée ici, elle transforme une plage en terrain de chasse, et des vacanciers "
             "en gibier. C'est la première image violente du livre, et elle tient en quatre "
             "mots.",
         ]),
        ("Un deuil qui passe par le corps",
         [
             "**Le poète ne dit pas sa tristesse : il décrit son corps.** Ses yeux "
             "« s'éteignent », sa gorge s'ouvre, ses paupières « descendent plus bas que "
             "terre », ses douleurs sont « lippues », c'est-à-dire pourvues de lèvres. La "
             "peine devient une chose qu'on peut voir.",
             "**Les comparaisons sont inattendues.** « comme des allumettes de minuit », "
             "« comme la bête saignée dans la gourmandise des primates ». Elles ne servent "
             "pas à expliquer : elles servent à faire voir. C'est le propre de l'écriture "
             "surréaliste, dont l'auteur se réclame et qu'il dit tenir de Césaire.",
             "**« plus bas que terre ».** L'expression signifie d'ordinaire l'humiliation. "
             "Ici, elle est prise au pied de la lettre : les paupières descendent vers le "
             "sol, c'est-à-dire vers la tombe. Le poème réveille les expressions toutes "
             "faites en les prenant au sérieux.",
             "**Le corps de la morte est là aussi.** « ton visage vient à nos cœurs dans une "
             "posture calme, trop calme ». L'adverbe répété — « calme, trop calme » — dit "
             "l'anomalie sans la nommer : ce calme est celui de la mort.",
         ]),
        ("Un ciel où les oiseaux ont été remplacés",
         [
             "**Une image retourne le ciel.** « dans le ciel, à la place des oiseaux, il y "
             "avait des balles habillées d'ailes sombres ». Les balles prennent la place des "
             "oiseaux et leur empruntent leurs ailes. C'est une image, mais c'est aussi un "
             "fait : ce jour-là, ce qui volait au-dessus de la plage était mortel.",
             "**Le motif de l'oiseau ouvre le livre.** Il le fermera : à la dernière page, "
             "le poème espère que la morte ressuscitera « dans l'oiseau bleu au "
             "roucoulement des nouvelles saisons ». Suivre l'oiseau d'un bout à l'autre est "
             "le meilleur fil pour comprendre le mouvement de l'œuvre.",
             "**Les balles sont armées de mémoire.** « d'ailes furieuses comme la "
             "douloureuse mémoire d'Oussama ». Le nom propre entre ici pour la première "
             "fois. Il ne désigne pas un homme présent sur la plage : il désigne ce qui a "
             "armé les mains.",
             "**Le poème se donne pour un refuge.** « je te retrouve dans les hauteurs de "
             "mon poème, Henrike ». Le lieu de la rencontre n'est plus la plage ni la "
             "morgue : c'est le texte lui-même. Cette idée gouvernera tout le livre.",
         ]),
    ],
    forme=[
        "**Pas de majuscule, presque pas de ponctuation.** Le premier mot du livre s'écrit "
        "« il », avec une minuscule. Dans cet extrait, on ne compte que des virgules. "
        "L'auteur écarte les règles de l'orthographe de la phrase : il revendique la "
        "liberté que les surréalistes ont prise avant lui.",
        "**Le « et » en tête de vers.** Cinq des dix-sept vers de l'extrait commencent par "
        "« et ». La grammaire dit que cette conjonction relie des mots de même nature ; ici "
        "elle ouvre les vers. Elle ne relie plus, elle relance : le poème ne peut pas "
        "s'arrêter.",
        "**Le verset.** Certains vers font trois mots, d'autres trois lignes. Un vers long, "
        "qui se lit d'un seul souffle, s'appelle un verset. Il oblige le lecteur à décider "
        "lui-même où respirer.",
        "**L'apostrophe.** « Henrike » est jeté au milieu ou en fin de vers, comme un appel. "
        "Le prénom coupe la phrase et oblige à s'arrêter : le poème parle à quelqu'un qui ne "
        "peut plus répondre.",
        "**Le blanc entre les vers.** Il n'y a ni titre ni numéro dans ce livre : le blanc "
        "est la seule coupure. C'est lui qui fait les strophes, et il faut en tenir compte "
        "en lisant à voix haute.",
    ],
    plan=[
        ("Introduction",
         "Poèmes sauvages éclairés au feu de brousse est un poème d'un seul tenant, écrit "
         "par l'Ivoirien Henri N'koumo en 2022, à la mémoire de son amie Henrike Grohs, "
         "tuée dans l'attentat de Grand-Bassam en mars 2016. L'extrait en constitue les "
         "premiers vers. On montrera comment cette ouverture annonce une mort sans jamais "
         "la nommer, et installe d'emblée la forme très libre qui sera celle du livre "
         "entier."),
        ("I. Une mort dite par le contraste",
         [
             "A. L'oxymore initial et la reprise du mot « froid ».",
             "B. Un décor de vacances retourné en scène de chasse.",
             "C. Le refus de raconter : la mort entre dans une phrase heureuse.",
         ]),
        ("II. Un deuil qui passe par le corps",
         [
             "A. Les yeux, la gorge, les paupières : la peine devient visible.",
             "B. Des comparaisons qui font voir au lieu d'expliquer.",
             "C. « calme, trop calme » : l'anomalie dite par un adverbe.",
         ]),
        ("III. Un poème qui se donne pour refuge",
         [
             "A. Les balles à la place des oiseaux : un ciel retourné.",
             "B. Le nom d'Oussama : ce qui a armé les mains.",
             "C. « je te retrouve dans les hauteurs de mon poème » : le texte comme lieu de "
             "rencontre.",
         ]),
        ("Conclusion",
         "En dix-sept vers, le livre a posé son sujet, son destinataire et sa forme. Il n'a "
         "pourtant rien expliqué : il a fait entendre un froid, montré un corps et retourné "
         "un ciel. C'est cette manière de dire sans raconter que les fiches suivantes "
         "suivront jusqu'à la dernière page, où le même oiseau reviendra, vivant."),
    ],
    comprendre=[
        "À qui le poète s'adresse-t-il ? Comment le sait-on ?",
        "Quel événement est évoqué dans ce passage ? Relevez trois mots qui le désignent "
        "sans le nommer.",
        "Où le poète dit-il retrouver son amie, à la fin de l'extrait ?",
    ],
    analyser=[
        "« il fait si froid dans le soleil ». a) Quels sont les deux mots contraires ? "
        "b) Comment appelle-t-on cette figure ? c) De quel froid s'agit-il, si ce n'est pas "
        "celui du temps ?",
        "a) Relevez toutes les parties du corps nommées dans l'extrait. b) À qui "
        "appartiennent-elles ? c) Que produit ce choix, comparé à des mots comme « je suis "
        "triste » ?",
        "« dans le ciel, à la place des oiseaux, il y avait des balles habillées d'ailes "
        "sombres ». a) Qu'est-ce qui remplace quoi ? b) Quel mot est employé pour les "
        "balles alors qu'il conviendrait aux oiseaux ? c) Quel effet cela produit-il ?",
    ],
    parcours1=[
        "a) Comptez les vers qui commencent par « et ».",
        "b) Lisez l'extrait à voix haute, puis relisez-le en supprimant tous les « et ». "
        "Dites en une phrase ce qui se perd.",
    ],
    parcours2=[
        "a) Montrez que l'extrait ne raconte jamais l'attentat, et qu'il le fait pourtant "
        "comprendre.",
        "b) Expliquez pourquoi un poème peut se permettre ce refus du récit, alors qu'un "
        "article de journal ne le pourrait pas.",
    ],
    synthese="Pourquoi le poète choisit-il de commencer par une contradiction — du froid "
             "dans le soleil — plutôt que par une explication ?",
    examen="**Vers le commentaire composé.** Rédigez entièrement l'axe I du plan ci-dessus, "
           "en trois paragraphes. Chaque paragraphe s'appuiera sur deux citations courtes, "
           "chacune suivie du nom du procédé et de son effet.",
    ouverture="À rapprocher de la fiche 6 : le dernier mouvement du livre reprendra "
              "l'oiseau, mais vivant, et le froid aura fait place au feu.",
    encadres=[
        ("methode", "Lire un poème sans ponctuation", [
            "Un texte sans points ni majuscules n'est pas un texte mal écrit. Il demande "
            "seulement une autre méthode de lecture. Quatre gestes, dans l'ordre :",
            "- **Lire une première fois à voix haute, sans s'arrêter.** On cherche le "
            "souffle, pas le sens.",
            "- **Marquer soi-même les pauses au crayon.** Chaque lecteur découpe "
            "autrement : c'est normal, et c'est déjà une interprétation.",
            "- **Repérer les mots qui reviennent.** En l'absence de ponctuation, ce sont "
            "eux qui organisent le texte. Ici : « et », « froid », « Henrike ».",
            "- **Ne jamais ajouter la ponctuation manquante dans une citation.** On cite le "
            "vers tel qu'il est écrit, sans majuscule initiale.",
        ]),
        ("saviez", "Le 13 mars 2016", [
            "Ce jour-là, la plage de Grand-Bassam, ville balnéaire proche d'Abidjan, est "
            "attaquée. Dix-neuf personnes sont tuées et trente-trois blessées. L'attentat "
            "est revendiqué par Al-Qaïda au Maghreb Islamique. C'est le premier attentat "
            "terroriste de l'histoire de la Côte d'Ivoire.",
            "Parmi les morts se trouve Henrike Grohs, directrice du Goethe Institut "
            "d'Abidjan, le centre culturel allemand. Elle était une figure connue du milieu "
            "culturel ivoirien, et une amie de l'auteur. Les deux partageaient presque le "
            "même prénom : Henri et Henrike.",
        ]),
    ],
)


# ═════════════════════════════════════════════════════════════ FICHE 2
F2 = dict(
    titre="Fiche 2 — « pendant combien de temps encore ? »",
    repere=X.REPERES["S2"],
    extrait=X.S2,
    source=X.REFERENCES["S2"],
    disposition="vers",
    objectif="Étudier le passage où le poème quitte un seul deuil pour tous les autres, et "
             "analyser une liste de villes qui devient un bruit de mitraille.",
    situation=(
        "Nous sommes environ au tiers du livre. Le deuil d'Henrike a été dit. Le poème "
        "élargit maintenant sa plainte : il ne parle plus d'une plage mais de villes "
        "réparties sur trois continents. C'est aussi le passage où apparaît l'expression "
        "qui donne son titre au livre."
    ),
    mouvements=[
        "**Le jour qui meurt** (« et mon jour meurt mille fois… ») : une longue phrase où "
        "le poète énumère ce que font « ceux qui ont mission de cramer les vies ».",
        "**La liste et le bruit** (« Maïduguri Palmyre Paris Niamey… ») : les noms de "
        "villes, l'alphabet et les onomatopées.",
        "**Les questions** (« pendant combien de temps encore… ? ») : trois interrogations, "
        "les seules de l'extrait.",
        "**Le feu de brousse** (« dans les feux de brousse qui nous ceignent ? ») : le titre "
        "du livre apparaît, sous forme de question.",
    ],
    lexique=[
        ["desseins", "projets, intentions. Ne pas confondre avec « dessins »."],
        ["cramer", "brûler. Mot familier, employé ici pour sa brutalité."],
        ["castrer", "priver de sa force, rendre stérile."],
        ["des tenailles", "outil qui serre et arrache."],
        ["mutiler", "blesser en enlevant une partie du corps."],
        ["une fosse commune", "trou où l'on enterre plusieurs morts ensemble, sans tombe "
                              "individuelle."],
        ["des moignons", "ce qui reste d'un membre coupé."],
        ["des décombres", "restes d'un bâtiment détruit."],
        ["la férocité", "la cruauté sauvage."],
        ["nubile", "en âge de se marier. Employé ici pour la peur, ce qui surprend."],
        ["un linceul", "tissu dans lequel on enveloppe un mort."],
        ["l'anémie", "manque de sang."],
        ["un goitre", "grosseur au cou. Ici, celui des nuages."],
        ["endémique", "qui est installé pour longtemps dans un lieu."],
        ["ceindre", "entourer. « les feux de brousse qui nous ceignent » : qui nous "
                    "encerclent."],
    ],
    axes=[
        ("Un poème qui prend en charge tous les morts",
         [
             "**« et mon jour meurt mille fois ».** L'hyperbole — « mille fois » — dit que "
             "la douleur ne s'arrête pas à un mort. Le poème quitte ici le deuil privé pour "
             "le deuil commun.",
             "**Une longue phrase sans point.** Le premier verset énumère, sans respirer, "
             "ce que font les assassins : « cramer les vies », « emprisonner les vents », "
             "« prendre à l'oiseau le souffle de ses plumes libres », « castrer les lèvres "
             "du monde », « assassiner nos rêves ». La liste va des corps aux rêves : "
             "l'attentat ne tue pas seulement des gens, il tue ce qui permet de vivre.",
             "**Le poète se met à la place des victimes.** « je me nourris de toutes les "
             "plaies posées sur les bouches de la désolation ». Il ne parle pas d'elles : il "
             "dit s'en nourrir, c'est-à-dire vivre de leur douleur — ce qui est la "
             "définition même d'un poème de deuil.",
             "**La terre elle-même est atteinte.** « je regarde ma terre confiée à "
             "l'arrogance des tourments », « elle tourne comme son sang d'anémie ». La "
             "planète est personnifiée : elle tourne mal, comme un corps malade.",
         ]),
        ("Une liste qui devient un bruit",
         [
             "**Neuf villes en un seul vers.** « Maïduguri Palmyre Paris Niamey Grand-Bassam "
             "… Sousse Bruxelles Barcelone … Kaboul Maroua ». Trois continents, aucune "
             "virgule entre les noms. L'absence de ponctuation fait que la liste ne se "
             "termine pas : elle défile.",
             "**Paris et Maïduguri sur la même ligne.** C'est une prise de position, et "
             "elle ne passe par aucun argument : elle passe par l'ordre des mots. Le poème "
             "refuse de classer les morts selon leur pays.",
             "**L'alphabet et les onomatopées.** « kaka-kaka-kaka-kaka », « abcdefgh "
             "ijklmnop qrstuvwxy et z », « trente-six boum boum boum ». Le vers cesse d'être "
             "du langage : il devient bruit. L'alphabet dit que la liste pourrait continuer "
             "jusqu'à épuisement des lettres, c'est-à-dire indéfiniment.",
             "**Un mot glissé dans la liste.** Entre Barcelone et Kaboul, un mot qui n'est "
             "pas une ville : « pleurs ». Il ne se remarque qu'à la relecture. C'est le "
             "seul commentaire que le poème se permette, et il tient en un mot.",
         ]),
        ("Une question qui revient trois fois",
         [
             "**Les seules interrogations de l'extrait.** « pendant combien de temps encore "
             "dresserons-nous les silences qui s'agitent en nos peurs tel un cimetière "
             "habité ? », « pendant combien de temps dresserons-nous nos voix sombres… ? », "
             "« pendant combien de temps agiterons-nous les silences de nos peurs dans les "
             "feux de brousse qui nous ceignent ? »",
             "**Une question sans réponse est une accusation.** Personne ne répond, et "
             "personne n'est censé répondre. La question oratoire sert ici à mesurer une "
             "durée : celle pendant laquelle on a supporté.",
             "**La troisième reprise contient le titre.** « les feux de brousse qui nous "
             "ceignent ». Le titre du livre apparaît donc dans une question, et sous sa "
             "forme menaçante : le feu encercle. Il faudra attendre la fin du poème pour "
             "que ce même feu éclaire.",
             "**« dresser les silences ».** L'expression est étrange : on dresse un mur, une "
             "table, un animal — pas un silence. Le verbe donne au silence la solidité d'une "
             "chose qu'on construit. Se taire, dans ce poème, est une activité.",
         ]),
    ],
    forme=[
        "**L'anaphore du « et ».** Quatorze des vingt-quatre vers de l'extrait commencent "
        "par « et ». La conjonction devient un instrument de rythme : elle relance sans "
        "hiérarchiser, si bien qu'aucune image ne compte plus qu'une autre.",
        "**L'énumération.** Deux listes s'enchaînent : celle des crimes (« cramer », "
        "« emprisonner », « castrer », « assassiner ») et celle des villes. La première est "
        "faite de verbes, la seconde de noms propres.",
        "**L'onomatopée.** « kaka-kaka-kaka-kaka », « boum boum boum ». Une onomatopée imite "
        "un bruit. Elle est rare en poésie savante ; elle est ici employée sans précaution, "
        "parce que le bruit des armes ne se dit pas autrement.",
        "**La personnification.** Le jour meurt, la terre tourne comme un malade, l'orage "
        "« n'en croit pas la férocité de ses propres hurlements ». Les choses se comportent "
        "comme des vivants.",
        "**La question oratoire.** Trois questions, aucune réponse. Elles ne demandent rien : "
        "elles constatent une durée devenue insupportable.",
    ],
    plan=[
        ("Introduction",
         "Au tiers de Poèmes sauvages éclairés au feu de brousse, Henri N'koumo quitte le "
         "deuil de son amie pour celui de tous les morts du terrorisme. L'extrait aligne "
         "des villes de trois continents, y mêle des bruits et des lettres de l'alphabet, "
         "et pose trois fois la même question. On montrera comment ce passage transforme "
         "une plainte personnelle en accusation générale, sans jamais formuler un seul "
         "argument."),
        ("I. Du deuil d'une personne au deuil de tous",
         [
             "A. « mon jour meurt mille fois » : l'hyperbole qui multiplie la perte.",
             "B. Une énumération de crimes qui va des corps jusqu'aux rêves.",
             "C. Une terre personnifiée, qui tourne « comme son sang d'anémie ».",
         ]),
        ("II. Une liste qui cesse d'être du langage",
         [
             "A. Neuf villes, trois continents, aucune virgule.",
             "B. L'alphabet et les onomatopées : le vers devient bruit.",
             "C. Le mot « pleurs » glissé entre deux villes : le seul commentaire du poème.",
         ]),
        ("III. Une question posée trois fois",
         [
             "A. Trois interrogations, seules ponctuations fortes de l'extrait.",
             "B. Une question sans réponse vaut accusation.",
             "C. Le titre du livre apparaît dans la troisième : le feu encercle avant "
             "d'éclairer.",
         ]),
        ("Conclusion",
         "Ce passage est le moment où le livre change d'échelle. Il n'argumente pas : il "
         "aligne, il répète, il fait du bruit. Le lecteur en sort avec une conviction qu'on "
         "ne lui a pas démontrée — et c'est précisément ce que peut un poème, et que ne peut "
         "pas un rapport."),
    ],
    comprendre=[
        "De qui le poème parle-t-il dans ce passage : d'une seule personne ou de "
        "plusieurs ? Justifiez.",
        "Relevez cinq noms de villes et indiquez, pour chacune, le pays ou le continent.",
        "Quelle question revient trois fois ? Recopiez-en une entièrement.",
    ],
    analyser=[
        "a) Relevez les verbes qui disent ce que font « ceux qui ont mission de cramer les "
        "vies ». b) Classez-les : lesquels visent les corps, lesquels visent autre chose ? "
        "c) Que montre ce classement ?",
        "« Maïduguri Palmyre Paris Niamey Grand-Bassam kaka-kaka-kaka-kaka Sousse Bruxelles "
        "Barcelone pleurs Kaboul Maroua abcdefgh ijklmnop qrstuvwxy et z et trente-six boum "
        "boum boum ». a) Repérez les éléments qui ne sont pas des noms de villes. b) Que "
        "font-ils dans la liste ? c) Pourquoi l'alphabet est-il particulièrement bien "
        "choisi ?",
        "a) Relevez les trois questions. b) Qu'ont-elles en commun ? c) À qui sont-elles "
        "posées, et pourquoi n'obtiennent-elles pas de réponse ?",
    ],
    parcours1=[
        "a) Recopiez la liste de villes et placez chaque nom sur une carte du monde.",
        "b) En une phrase, dites ce que cette carte montre.",
    ],
    parcours2=[
        "a) Montrez que l'absence de ponctuation, dans le vers des villes, produit un effet "
        "précis.",
        "b) Réécrivez ce vers avec des virgules, puis comparez : qu'est-ce qui disparaît ?",
    ],
    synthese="Pourquoi le poème préfère-t-il nommer des villes plutôt que donner des "
             "chiffres ?",
    examen="**Vers le commentaire composé.** Rédigez entièrement l'axe II du plan "
           "ci-dessus, en trois paragraphes. Vous citerez le vers des villes au moins une "
           "fois, en entier.",
    ouverture="À rapprocher de la fiche 5 : la même liste de villes y reviendra, mais "
              "précédée d'une négation — « nous ne serons plus Maïduguri plus "
              "Grand-Bassam ».",
    encadres=[
        ("astuce", "Analyser une énumération", [
            "Une liste ne s'analyse pas en disant « il y a une énumération ». Trois gestes "
            "sont attendus :",
            "- **Compter.** Le nombre d'éléments est un fait vérifiable.",
            "- **Chercher l'ordre.** Va-t-elle du petit au grand ? Du proche au lointain ? "
            "Ici, elle passe d'un continent à l'autre sans logique apparente — et c'est "
            "cela qui compte.",
            "- **Chercher l'intrus.** Il y en a presque toujours un. Ici, le mot « pleurs » "
            "et les lettres de l'alphabet. C'est lui qui donne le sens de la liste.",
        ]),
        ("vigilance", "Ne pas traduire une image", [
            "L'erreur la plus fréquente sur ce texte consiste à écrire : « le poète veut "
            "dire que… ». Une image ne se traduit pas ; elle se décrit.",
            "Méthode : nommez les deux termes rapprochés, puis dites ce que le rapprochement "
            "fait voir. Pour « les feux de brousse qui nous ceignent » : d'un côté le feu de "
            "brousse, qui est familier et africain ; de l'autre le verbe « ceindre », qui "
            "dit l'encerclement. L'image fait voir une menace venue de partout à la fois — et "
            "non « le terrorisme », qui serait une traduction paresseuse.",
        ]),
    ],
)


# ═════════════════════════════════════════════════════════════ FICHE 3
F3 = dict(
    titre="Fiche 3 — « et nous sommes, Henrike »",
    repere=X.REPERES["S3"],
    extrait=X.S3,
    source=X.REFERENCES["S3"],
    disposition="vers",
    objectif="Étudier le passage où le « je » devient « nous », et analyser des images de "
             "couteaux qui empruntent leurs ailes aux oiseaux.",
    situation=(
        "Le poème a élargi sa plainte à tous les lieux frappés. Il rassemble maintenant "
        "ceux qui restent. Le prénom d'Henrike revient, posé seul sur une ligne, au milieu "
        "d'une phrase qui commence par « et nous sommes »."
    ),
    mouvements=[
        "**Le corps du poète** (« la grande faim de mon visage… ») : deux vers encore au "
        "singulier.",
        "**Le passage au « nous »** (« et nous sommes / Henrike / un nuage poilu… ») : le "
        "prénom coupe la phrase en deux.",
        "**La course** (« et nos pulsations courent courent courent… ») : le rythme "
        "s'accélère.",
        "**Les couteaux ailés** (« immenses couteaux habillés d'ailes… ») : la longue image "
        "centrale.",
        "**La pointe et le quai** (« et une pointe cherche un quai… ») : l'arme cherche où "
        "se poser.",
    ],
    lexique=[
        ["un vin tiré", "un vin qu'on a mis en carafe. L'expression « le vin est tiré » "
                        "signifie qu'on ne peut plus revenir en arrière."],
        ["saignés à blanc", "vidés de leur sang."],
        ["une meute", "groupe de chiens lancés à la poursuite."],
        ["flageller", "fouetter."],
        ["ravalé", "ici : refoulé, retenu."],
        ["un hennissement", "cri du cheval."],
        ["une sourate", "chapitre du Coran."],
        ["un verset", "phrase numérotée d'un livre sacré. Ne pas confondre avec le verset "
                      "des poètes, qui est un vers très long."],
        ["à contre-jour", "éclairé par-derrière, si bien qu'on ne voit qu'une ombre."],
        ["crépiter", "faire de petits bruits secs et répétés, comme un feu."],
        ["la voltige", "acrobatie en l'air."],
        ["une transe", "état où l'on n'est plus maître de soi."],
        ["la démence", "la folie."],
        ["une rengaine", "refrain que l'on répète sans fin."],
        ["une mélopée", "chant lent et monotone."],
    ],
    axes=[
        ("Le moment où « je » devient « nous »",
         [
             "**Deux vers au singulier, puis le basculement.** L'extrait s'ouvre sur « la "
             "grande faim de mon visage » et « mon corps entier ». Au troisième vers, la "
             "phrase change de sujet : « et nous sommes ».",
             "**Le prénom coupe la phrase.** Entre « et nous sommes » et « un nuage poilu », "
             "un vers d'un seul mot : « Henrike ». Le prénom est posé seul, à la ligne. Il "
             "interrompt la syntaxe, exactement comme une mort interrompt une vie.",
             "**La morte reste le destinataire.** Le « nous » ne remplace pas Henrike : il "
             "lui parle. Le poème rassemble les vivants et continue de s'adresser à celle "
             "qui n'est plus là.",
             "**Ce que devient le « nous ».** Il est successivement « un nuage poilu plus "
             "agressif qu'un piment de grand âge », « des saignés à blanc », des poursuivis "
             "dont « les pulsations courent à se rompre le souffle ». Le collectif n'est pas "
             "glorieux : il est traqué.",
         ]),
        ("Des armes qui empruntent leurs ailes aux oiseaux",
         [
             "**La longue image centrale.** « immenses couteaux habillés d'ailes fort "
             "alertes comme les sourates et versets qui nous éclairent à contre-jour ». "
             "Trois éléments s'y rejoignent : l'arme, l'oiseau et le livre sacré.",
             "**Le motif revient.** À la fiche 1, les balles étaient déjà « habillées "
             "d'ailes sombres ». Le poème ne varie pas au hasard : il reprend ses images et "
             "les déplace. Ce que le lecteur a appris à la première page lui sert ici.",
             "**« à contre-jour ».** Les textes sacrés « éclairent », mais à contre-jour, "
             "c'est-à-dire de telle sorte qu'on ne distingue plus rien. C'est une critique "
             "précise : le poème ne s'en prend pas au Coran, il s'en prend à une lumière mal "
             "placée, qui aveugle au lieu de montrer.",
             "**Les oiseaux paient.** « où se fracassent les chants ensanglantés de millions "
             "d'oiseaux en pleurs ». Le chant est ensanglanté : c'est la poésie même qui est "
             "atteinte. Le poème dit ici ce qu'un attentat fait à la parole.",
         ]),
        ("Une plainte qui exige",
         [
             "**Le cri n'est pas passif.** « et elles hurlent pour exiger le réveil de nos "
             "voix ». Le verbe « exiger » n'appartient pas au vocabulaire de la plainte : il "
             "appartient à celui de la revendication.",
             "**La formule vient de l'exorde.** « Comme introduction », page 7, se terminait "
             "déjà par « pour exiger le réveil de nos voix ». Le poème reprend ici sa propre "
             "phrase. Ce n'est pas une répétition : c'est un rappel de programme.",
             "**« et nue est notre nuit ».** Là encore, la formule vient de l'exorde. La "
             "construction est inhabituelle — l'attribut est placé avant le sujet — et cette "
             "inversion attire l'attention sur le mot « nue ».",
             "**La dernière image est une reconstruction.** « reconstruire le royaume des "
             "batailles pour que s'écoutent plus belles qu'une veine géante les mélopées du "
             "sang le long des âges ». Le verset est difficile, et il faut l'accepter comme "
             "tel : ce que le poème demande, ce n'est pas la fin des combats, c'est qu'ils "
             "redeviennent audibles, c'est-à-dire racontables.",
         ]),
    ],
    forme=[
        "**Le vers d'un seul mot.** « Henrike ». Dans un poème fait de versets très longs, "
        "un vers d'un mot arrête tout. C'est l'effet le plus simple et le plus fort du "
        "passage.",
        "**La répétition immédiate.** « nos pulsations courent courent courent ». Trois fois "
        "le même verbe, sans virgule. La répétition ne dit pas la vitesse : elle la fait "
        "entendre.",
        "**L'anaphore du « et ».** Neuf vers sur dix-neuf commencent par « et ». On notera "
        "que l'extrait ne contient pas une seule virgule : le rythme repose entièrement sur "
        "les reprises et sur les blancs.",
        "**La comparaison.** « comme la coulée de nos pleurs », « comme les sourates et "
        "versets », « plus belles qu'une veine géante ». Les comparants sont pris tantôt au "
        "corps, tantôt au sacré : les deux domaines qui font tout le livre.",
        "**L'inversion.** « et nue est notre nuit ». L'ordre habituel serait « notre nuit "
        "est nue ». Déplacer l'adjectif en tête le met en valeur.",
    ],
    plan=[
        ("Introduction",
         "Après avoir dit un deuil, puis tous les deuils, le poème d'Henri N'koumo "
         "rassemble ceux qui restent. L'extrait est le moment précis où le « je » devient "
         "« nous », et où le prénom de la morte vient couper la phrase. On montrera comment "
         "ce passage transforme une plainte en revendication collective, par les seuls "
         "moyens de la disposition et de l'image."),
        ("I. Le basculement du « je » au « nous »",
         [
             "A. Deux vers au singulier, puis un changement de sujet.",
             "B. Un vers d'un seul mot : le prénom qui interrompt la syntaxe.",
             "C. Un collectif traqué, non glorieux.",
         ]),
        ("II. Des armes qui portent des ailes",
         [
             "A. Couteau, oiseau, livre sacré : la triple image centrale.",
             "B. « à contre-jour » : une lumière qui aveugle.",
             "C. Les chants « ensanglantés » : ce qu'un attentat fait à la parole.",
         ]),
        ("III. Une plainte qui exige",
         [
             "A. « exiger le réveil de nos voix » : le vocabulaire de la revendication.",
             "B. Le retour des formules de l'exorde : un programme rappelé.",
             "C. « reconstruire le royaume des batailles » : rendre le malheur racontable.",
         ]),
        ("Conclusion",
         "Ce passage est une charnière. Le livre y cesse d'être le tombeau d'une amie pour "
         "devenir la parole d'un groupe, et il le fait sans jamais l'annoncer : un pronom "
         "change, un prénom est posé seul sur une ligne, et tout le reste suit. La suite du "
         "poème pourra désormais dire « nous serons »."),
    ],
    comprendre=[
        "Quel pronom domine les deux premiers vers ? Quel pronom domine la suite ?",
        "Où le prénom d'Henrike est-il placé ? Qu'est-ce que cette place a de particulier ?",
        "À quoi les couteaux sont-ils comparés ?",
    ],
    analyser=[
        "a) Relevez la phrase « et nous sommes … un nuage poilu ». b) Qu'est-ce qui la coupe "
        "en deux ? c) Quel effet cette coupure produit-elle à la lecture à voix haute ?",
        "« immenses couteaux habillés d'ailes fort alertes comme les sourates et versets qui "
        "nous éclairent à contre-jour ». a) Quels sont les trois éléments rapprochés ? "
        "b) Que signifie « à contre-jour » ? c) Contre quoi le poème s'élève-t-il "
        "exactement : contre les textes sacrés, ou contre autre chose ?",
        "a) Relevez la formule « pour exiger le réveil de nos voix ». b) Cherchez-la dans "
        "« Comme introduction », page 7. c) Que produit ce retour ?",
    ],
    parcours1=[
        "a) Relevez tout ce que le « nous » est dit être dans l'extrait.",
        "b) En une phrase, dites si ce « nous » est fort ou faible, et justifiez.",
    ],
    parcours2=[
        "a) Montrez que le motif de l'oiseau, présent dès les premières pages, est ici "
        "repris et déplacé.",
        "b) Expliquez ce qu'un lecteur gagne à reconnaître une image déjà rencontrée.",
    ],
    synthese="Que change, pour le lecteur, le passage du « je » au « nous » ?",
    examen="**Vers le commentaire composé.** Rédigez entièrement l'axe I du plan ci-dessus, "
           "en trois paragraphes. Vous accorderez une attention particulière à la "
           "disposition des vers.",
    ouverture="À rapprocher de la fiche 5 : le « nous » installé ici deviendra le sujet de "
              "toutes les promesses de la fin du livre.",
    encadres=[
        ("methode", "Analyser la disposition d'un poème", [
            "Dans un texte sans ponctuation, la mise en page fait le travail de la "
            "ponctuation. Trois choses se relèvent et se citent :",
            "- **La longueur des vers.** Un vers d'un mot au milieu de versets de trois "
            "lignes est un événement.",
            "- **Les blancs.** Ils séparent les strophes ; ils marquent aussi les silences.",
            "- **Le rejet.** Quand une phrase continue au vers suivant, le mot rejeté est "
            "mis en valeur. Citez-le en indiquant la coupure par une barre oblique.",
            "En devoir, écrivez « le vers isolé » ou « le vers d'un seul mot », jamais « la "
            "ligne ».",
        ]),
        ("saviez", "Le surréalisme de Césaire à N'koumo", [
            "Le surréalisme est un mouvement né en France dans les années 1920. Il libère "
            "l'image : au lieu de comparer deux choses proches, il rapproche des mots que "
            "l'usage sépare, pour surprendre et pour dire autrement.",
            "Aimé Césaire, poète martiniquais, en a fait l'instrument de la négritude. Henri "
            "N'koumo le revendique à son tour : « Ce surréalisme né de ma rencontre "
            "littéraire avec un Césaire ou un Zadi Zaourou m'autorise l'exploitation "
            "d'images complexes, cocasses, déroutantes. »",
        ]),
    ],
)

FICHES_SV_1_3 = [F1, F2, F3]
