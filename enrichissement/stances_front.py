# -*- coding: utf-8 -*-
"""
Paratexte du cahier « Stances et Poèmes » (Sully Prudhomme, 1865).

Le recueil est déjà servi par un manuel VÉRITAS antérieur, qui l'étudie
poème par poème sur cinquante-quatre pièces. Ce cahier-ci ne le remplace
pas : il l'aligne sur le gabarit des sept autres cahiers d'œuvre intégrale
— six lectures méthodiques, deux commentaires et deux dissertations
rédigés, deux devoirs au format MINESEC, une rubrique d'examen.

Les six poèmes retenus couvrent les cinq sections du recueil et sont
reproduits **entiers**. Voir `stances_extraits.py`, produit depuis
l'édition numérique et jamais édité à la main.
"""

INFOS = dict(
    titre="Stances et Poèmes",
    sous_titre="recueil de cent huit poèmes en cinq sections",
    auteur="Sully Prudhomme",
    edition="Paris, Alphonse Lemerre, 1865",
    niveau="Terminale",
    genre="poésie",

    # Un recueil n'a ni personnages ni intrigue. Il a des figures, des motifs
    # et un mouvement d'ensemble : les rubriques sont renommées en conséquence.
    libelles={
        "personnages_titre": "4. Les figures et les voix du recueil",
        "personnages_entetes": ("Figure", "Ce qu'elle est dans le recueil"),
        "etude_personnages_titre": "5 bis. Étude des figures",
        "etude_personnages_entetes": ("Figure", "Ce que l'étude doit établir"),
        "lieux_titre": "5 ter. Les lieux et les motifs",
        "lieux_entetes": ("Lieu ou motif", "Valeur dans le recueil"),
        "schema_titre": "5 quater. Le mouvement du recueil",
        "schema_entetes": ("Moment", "Contenu"),
    },

    avertissements=[
        "**Le recueil compte cent huit poèmes ; ce cahier en étudie six de près.** "
        "Ce n'est pas un choix d'économie : une lecture méthodique demande une heure "
        "de classe, et l'année n'en offre pas cent huit. Les six pièces retenues "
        "couvrent les cinq sections du livre, du plus court — « Le Vase brisé », "
        "vingt vers — au plus ample. Les autres poèmes ne sont pas abandonnés : ils "
        "servent aux contrôles, aux devoirs progressifs et aux exposés.",

        "**Le titre du recueil nomme deux formes, non deux tons.** « Stances » "
        "désigne les poèmes en strophes régulières et détachables ; « Poèmes », en "
        "fin de volume, les pièces longues et suivies. Un élève qui croit que "
        "« stances » veut dire « tristesse » lira tout le livre de travers.",

        "**Sully Prudhomme n'est pas un romantique attardé.** Il écrit après Hugo et "
        "avant le symbolisme, dans le moment du Parnasse. Le cahier y revient plus "
        "d'une fois, parce que c'est la confusion la plus fréquente en Terminale : "
        "l'émotion y est dite dans une forme travaillée, et non répandue.",
    ],

    note_enseignants=[
        "Ce cahier applique au recueil de Sully Prudhomme la démarche demandée par le "
        "Programme de français du second cycle : activités augurales, lecture hors "
        "classe, contrôle de lecture, négociation du projet d'étude, étude collective, "
        "exposés, évaluation.",

        "L'étude d'un recueil ne se conduit pas comme celle d'un roman. Il n'y a pas "
        "d'intrigue à suivre, donc pas de progression naturelle à laquelle s'accrocher. "
        "Deux principes tiennent lieu de fil. Le premier est la **section** : les cinq "
        "ensembles du livre ont chacun leur objet, et l'ordre des six fiches les suit. "
        "Le second est le **motif** : un vase, un berceau, une étoile reviennent d'un "
        "poème à l'autre et permettent de relier des pièces éloignées.",

        "Trois difficultés reviennent chaque année. La première est le **décompte des "
        "syllabes** : les élèves comptent à l'oreille et perdent l'e muet, la diérèse, "
        "la césure. Le cahier fait compter les vers à haute voix, doigt par doigt, dès "
        "la première fiche, et n'y revient pas ensuite. La deuxième est la confusion "
        "entre **thème** et **procédé** : « le poème parle de la mort » n'est pas une "
        "analyse. La troisième est le **contresens sur l'impassibilité** : croire que "
        "Sully Prudhomme ne dit rien de lui-même parce qu'il écrit en vers réguliers.",

        "Le manuel VÉRITAS *Stances et Poèmes* (étude des cinquante-quatre poèmes) "
        "reste le compagnon de ce cahier : on y trouvera le texte de tous les poèmes "
        "cités ici en renvoi, et une proposition de plan pour chacun.",
    ],

    citation_guide=(
        "« L'étude collective de l'œuvre en classe à travers les lectures méthodiques "
        "ou d'autres formes de lectures (lecture suivie, lecture analytique, etc.) ou "
        "l'étude de divers aspects de l'œuvre (l'énonciation, les forces agissantes, "
        "les aspects marquants de l'écriture, les thèmes majeurs, etc.). »",
        "MINESEC, Guide pédagogique 2019, § III.2"),

    notions=[
        ["Recueil", "Livre qui rassemble des poèmes composés séparément.",
         "Les cent huit pièces de 1865, réparties en cinq sections."],
        ["Stance", "Strophe qui forme à elle seule une unité de sens, et qu'on peut "
         "détacher du poème sans la rendre incompréhensible.",
         "Toute la première partie du volume, dont le titre l'annonce."],
        ["Parnasse", "Mouvement poétique des années 1860 : perfection de la forme, "
         "refus de l'épanchement, goût de l'Antiquité et de la science.",
         "« Les Vénus », « La Néréide », « Le Lever du soleil »."],
        ["Lyrisme", "Expression d'un sentiment personnel, à la première personne.",
         "« Le Vase brisé », « Les Berceaux », « Ici-bas »."],
        ["Élégie", "Poème de la plainte : deuil, séparation, amour perdu.",
         "La section « Jeunes filles » presque entière."],
        ["Art poétique", "Poème qui prend pour sujet la poésie elle-même.",
         "« Au lecteur », « La Poésie », « L'Art », « Je me croyais poète »."],
        ["Alexandrin", "Vers de douze syllabes, coupé le plus souvent en deux moitiés "
         "de six.", "« La Femme », « Le Lever du soleil », « L'Amérique »."],
        ["Octosyllabe", "Vers de huit syllabes. Plus rapide, plus proche de la chanson.",
         "« Le Vase brisé », « La Mémoire », « Le meilleur Moment des Amours »."],
        ["Césure et hémistiche", "La césure est la coupe intérieure du vers ; "
         "l'hémistiche, chacune des deux moitiés qu'elle sépare.",
         "« Le premier homme est né, ‖ mais il est solitaire. »"],
        ["E muet", "Le e final qui se prononce dans le vers quand le mot suivant "
         "commence par une consonne, et disparaît devant une voyelle.",
         "« Le vas(e) où meurt cette verveine » : le e s'élide, le vers fait huit."],
        ["Diérèse", "Deux voyelles voisines prononcées en deux syllabes au lieu d'une, "
         "pour que le compte tombe juste.",
         "« pass-i-on », « vi-o-lette » dans les alexandrins du recueil."],
        ["Enjambement, rejet", "La phrase déborde la fin du vers ; le mot rejeté au "
         "vers suivant reçoit une force particulière.",
         "« Mais la légère meurtrissure, / Mordant le cristal chaque jour… »"],
        ["Rime riche, suffisante, pauvre", "Selon qu'elle fait entendre trois sons "
         "communs, deux, ou un seul.",
         "verveine / à peine (suffisante) ; fêlé / révélé (riche)."],
        ["Rime embrassée, croisée, plate", "ABBA, ABAB, AABB : les trois dispositions "
         "possibles dans un quatrain ou un distique.",
         "« Le Vase brisé » : rimes croisées ; « La Femme » : rimes plates."],
        ["Allégorie", "Une idée abstraite représentée tout au long d'un texte par une "
         "chose concrète.", "Le vase fêlé pour le cœur blessé, dans tout le poème."],
        ["Métaphore filée", "Une même image poursuivie de vers en vers.",
         "La fêlure, la marche, le tour, l'eau qui fuit : une seule image tenue."],
        ["Antithèse", "Deux mots ou deux idées de sens contraire mis côte à côte.",
         "« Toujours intact aux yeux du monde », alors que le cœur est brisé."],
        ["Personnification", "Une chose ou une idée traitée comme une personne.",
         "« Ô Mémoire, qui joins à l'heure… » : on lui parle, elle agit."],
        ["Apostrophe", "On s'adresse directement à quelqu'un ou à quelque chose.",
         "« Ô Mémoire », « N'y touchez pas »."],
        ["Positivisme", "Doctrine du XIXᵉ siècle selon laquelle seule la science donne "
         "un savoir certain.",
         "L'arrière-plan de « Le Lever du soleil » et de « La Poésie »."],
    ],

    biographie=[
        "**Le nom.** Sully Prudhomme est un nom d'écrivain. L'état civil dit "
        "René-François-Armand Prudhomme, né à Paris le 16 mars 1839. Le prénom Sully "
        "vient du père, mort quand l'enfant a deux ans. Il grandit entre sa mère et sa "
        "sœur — la section « Jeunes filles » gardera la trace de cette maison de femmes, "
        "et « À ma Sœur » la nomme.",

        "**Un scientifique empêché.** Élève du lycée Bonaparte, il passe son "
        "baccalauréat ès sciences et se destine au métier d'ingénieur. Une ophtalmie — "
        "une maladie des yeux — interrompt ses études et l'oblige à renoncer. C'est un détail biographique qui explique une part "
        "de l'œuvre : Sully Prudhomme n'est pas un poète qui parle de la science de "
        "loin, c'est un scientifique à qui la science a été retirée. Il travaille "
        "quelque temps aux usines du Creusot, chez le maître de forges Henri Schneider "
        "— à qui « Le Lever du soleil » est dédié —, puis devient clerc chez un avoué.",

        "**Le premier livre.** Encouragé par une société d'étudiants, la Conférence La "
        "Bruyère, il publie en 1865, à vingt-six ans, *Stances et Poèmes*. Un héritage "
        "lui permet alors de se consacrer entièrement aux lettres. Le succès est "
        "immédiat : Sainte-Beuve, le critique le plus écouté du temps, rend compte du "
        "recueil avec faveur, et « Le Vase brisé » devient aussitôt le poème que tout "
        "le monde récite.",

        "**Le poète du Parnasse.** L'année suivante, il figure au sommaire du *Parnasse "
        "contemporain* (1866), aux côtés de Leconte de Lisle et de Heredia. Suivront "
        "*Les Épreuves* (1866), *Les Solitudes* (1869), *Les Vaines Tendresses* (1875), "
        "puis deux longs poèmes philosophiques, *La Justice* (1878) et *Le Bonheur* "
        "(1888). Helléniste et latiniste, il traduit en 1869 le premier livre du *De "
        "rerum natura* de Lucrèce : le poème latin qui explique le monde par la matière.",

        "**La consécration.** Élu à l'Académie française en 1881, il reçoit en 1901 le "
        "tout premier prix Nobel de littérature décerné, distingué pour une œuvre où "
        "l'Académie suédoise salue « un idéalisme élevé, une perfection artistique et une "
        "rare association des qualités du cœur et de l'esprit ». Il en emploie une part à "
        "soutenir de jeunes poètes. Malade, il consacre ses dernières années à "
        "l'esthétique et à la philosophie. Il meurt à Châtenay-Malabry le 6 septembre "
        "1907.",

        "**Ce que la musique en a gardé.** Gabriel Fauré a mis en musique « Ici-bas ! » "
        "en 1875, puis « Les Berceaux » en 1879. Ces deux mélodies ont plus fait pour la survie de Sully "
        "Prudhomme que bien des anthologies : elles rappellent que ses vers ont d'abord "
        "été entendus comme des chansons.",
    ],

    contexte=[
        "**1865 : l'âge de la science.** Le recueil paraît sous le Second Empire. La "
        "France perce des tunnels, pose des rails, allume des hauts-fourneaux. Surtout, "
        "l'esprit scientifique devient la mesure de tout : c'est le temps du positivisme "
        "d'Auguste Comte, pour qui seule la science donne un savoir certain. L'année "
        "même de *Stances et Poèmes*, Claude Bernard publie son *Introduction à l'étude "
        "de la médecine expérimentale*.",

        "**Une crise de la foi.** Six ans plus tôt, Darwin a publié *L'Origine des "
        "espèces* ; deux ans plus tôt, Renan a écrit une *Vie de Jésus* qui traite les "
        "Évangiles comme des documents historiques. Beaucoup d'esprits cultivés perdent "
        "alors une croyance sans en trouver une autre. C'est exactement la situation du "
        "« je » de ce recueil : il ne peut plus croire, et il ne peut pas s'en passer. "
        "« Intus » met les deux voix face à face.",

        "**La tension qui fait le livre.** Pour un homme formé aux sciences et privé "
        "d'elles, la question devient personnelle : que faire de ce que la science ne "
        "dit pas ? La mort d'un être aimé, la beauté d'un visage, la douleur d'un "
        "souvenir ne se mesurent pas. « Le Lever du soleil » pose la question sans la "
        "trancher : l'astronome a raison, et il ne voit pas ce que voit le poète.",

        "**Après le romantisme.** Le grand romantisme appartient déjà au passé. La "
        "poésie réagit contre l'épanchement du moi : Gautier a lancé « l'art pour "
        "l'art », Leconte de Lisle a publié ses *Poèmes antiques*, Baudelaire ses "
        "*Fleurs du mal* (1857). De ce refus commun naîtra en 1866 le Parnasse.",

        "**La place exacte de Sully Prudhomme.** Il est parnassien par la forme : "
        "strophe régulière, rime soignée, sujets antiques. Il ne l'est pas par le fond : "
        "il n'a jamais renoncé à dire son cœur. D'où la formule qu'on emploie souvent à "
        "son sujet — un demi-parnassien —, et qui doit être discutée plutôt que récitée. "
        "C'est un sujet de dissertation à part entière.",
    ],

    structure=[
        ["Seuil — « Au lecteur »",
         "Un poème liminaire de trente vers, placé avant les sections. Le poète y "
         "avertit que ses meilleurs vers ne seront pas lus, parce qu'ils ne sont pas "
         "écrits. Tout le livre se lit à partir de cet aveu."],
        ["Stances — La Vie intérieure (22 poèmes)",
         "Le versant intime et philosophique : le temps, la mémoire, l'habitude, le "
         "doute, la poésie elle-même. On y trouve « Le Vase brisé », « Ici-bas », "
         "« Les Berceaux », « Intus », « La Mémoire »."],
        ["Stances — Jeunes filles (16 poèmes)",
         "L'amour naissant, l'attente, la séparation, la mort d'une jeune fille. Le ton "
         "y est élégiaque : « Le meilleur Moment des Amours », « Les Adieux », "
         "« Consolation »."],
        ["Stances — Femmes (19 poèmes)",
         "La femme comme énigme et comme puissance, du premier homme aux Vénus antiques. "
         "Ton plus grave, réflexion plus large : « La Femme », « Les Vénus », "
         "« Inconscience »."],
        ["Stances — Mélanges (36 poèmes)",
         "La section la plus large : la nature, la mer bretonne, le travail des hommes, "
         "la mythologie, le ciel. « Le Lever du soleil », « Les Ouvriers », « Pan », "
         "« La Néréide », « Sursum »."],
        ["Poèmes (15 pièces)",
         "Les pièces longues et suivies, souvent narratives : « Le Joug », « Le Lion », "
         "« L'Amérique », « L'Art », « À Alfred de Musset ». Le volume se ferme sur "
         "« Je me croyais poète »."],
    ],

    personnages=[
        ["Le « je »", "Le poète. Il observe, se souvient, doute, et finit par avouer "
         "qu'il n'est peut-être pas poète."],
        ["Le « tu » aimé", "Une femme, jamais nommée, présente surtout dans « Jeunes "
         "filles ». Elle écoute plus qu'elle ne parle."],
        ["La sœur", "Première lectrice, figure de la maison d'enfance (« À ma Sœur »)."],
        ["La Femme", "Non pas une personne mais une figure : ce que l'homme cherche et "
         "ne comprend pas (« La Femme », « Les Vénus »)."],
        ["Le savant", "L'astronome, le géomètre, le chimiste. Il a raison, et cela ne "
         "suffit pas (« Le Lever du soleil », « Le Monde des Âmes »)."],
        ["La Mémoire", "Une puissance à qui l'on parle, tour à tour secourable et "
         "cruelle (« La Mémoire »)."],
        ["La Douleur", "Personnifiée dans les poèmes de deuil : elle marche, elle "
         "s'installe, elle finit par se taire (« Consolation »)."],
        ["Dieu", "Une absence plus qu'une présence. On l'invoque, on le suppose, on ne "
         "le rencontre pas (« Intus », « Si j'étais Dieu »)."],
        ["Le lecteur", "Interpellé dès le seuil du livre, et de nouveau à la dernière "
         "page : le recueil est encadré par deux adresses."],
    ],

    paratexte=[
        ("1. Le titre : « Stances et Poèmes »", [
            "Le titre est fait de deux noms de **formes**, reliés par « et ». Ce n'est "
            "ni une image, ni une phrase, ni une promesse : c'est un sommaire.",
            "**Stances.** Le mot désigne des strophes régulières formant chacune une "
            "unité de sens. On peut en détacher une sans que le poème devienne "
            "incompréhensible — essayez sur « Le Vase brisé » : chaque quatrain se tient "
            "seul. Le mot est ancien ; Corneille l'emploie déjà pour les monologues du "
            "*Cid*.",
            "**Poèmes.** Employé seul, le mot ne dit rien de précis : c'est justement "
            "ce qui le distingue ici. Il désigne, en fin de volume, les pièces qui ne "
            "sont pas des stances : longues, suivies, souvent narratives.",
            "**Ce que le titre annonce, et ce qu'il tait.** Il annonce un livre organisé "
            "par la forme, non par le sujet. Il ne dit rien du ton, rien des thèmes, "
            "rien de l'auteur. Comparez avec *Les Fleurs du mal* ou *Les Contemplations*, "
            "qui promettent l'un et l'autre une expérience : le titre de Sully Prudhomme "
            "refuse la promesse. C'est déjà une position parnassienne.",
        ]),
        ("2. La dédicace : « À Léon Bernard-Derosne »", [
            "Le volume s'ouvre sur une lettre-dédicace à un ami, où le poète parle de "
            "leur affection et de ses hésitations. Un livre de vingt-six ans se met "
            "ainsi sous la protection d'une amitié plutôt que d'un maître.",
            "**À faire remarquer en classe.** Presque chaque poème porte en outre sa "
            "propre dédicace : « Le Vase brisé » à Albert Decrais, « Le Lever du soleil » "
            "à Henri Schneider, « Je me croyais poète » à Louis Bertrand. Le recueil est "
            "un réseau d'amitiés autant qu'un livre.",
        ]),
        ("3. Le poème liminaire : « Au lecteur »", [
            "Avant la première section, un poème s'adresse au lecteur pour lui dire que "
            "le meilleur ne sera pas dans le livre : « Le meilleur demeure en moi-même, / "
            "Mes vrais vers ne seront pas lus. »",
            "**Comment le lire.** C'est un art poétique en creux. Le poète ne promet pas "
            "de tout dire ; il annonce au contraire un écart entre ce qu'il éprouve et "
            "ce qu'il écrit. Toute la question du recueil tient là : la forme peut-elle "
            "porter ce qui la déborde ?",
            "**Le dernier poème lui répond.** « Je me croyais poète » reprend l'aveu à "
            "la dernière page, mais en le renversant en souhait : que le poème renaisse "
            "dans un autre cœur. Le livre est donc **encadré** par deux adresses au "
            "lecteur. C'est le fait de composition le plus important du recueil, et le "
            "plus facile à manquer.",
        ]),
        ("4. Le nom de l'auteur", [
            "Sur la couverture, « Sully Prudhomme » sans prénom ni particule. Le lecteur "
            "de 1865 ne sait pas qui c'est : c'est un premier livre.",
            "L'ironie de l'histoire veut que ce nom obscur soit devenu, trente-six ans "
            "plus tard, le premier de la liste des prix Nobel de littérature.",
        ]),
    ],

    augurales=[
        "**Avant d'ouvrir le livre — un quart d'heure.** Écrivez au tableau : « Le "
        "meilleur demeure en moi-même, / Mes vrais vers ne seront pas lus. » Sans dire "
        "de qui c'est. Demandez à la classe ce qu'un écrivain peut vouloir dire par là, "
        "et si l'on peut écrire un livre entier après avoir avoué cela. Gardez trois "
        "réponses au tableau : on y reviendra à la dernière fiche.",

        "**Le titre, seul.** Écrivez « Stances et Poèmes ». Demandez ce que le mot "
        "« stances » évoque. La plupart proposeront quelque chose comme « tristesse » "
        "ou « instances ». Notez les propositions sans corriger, puis donnez la "
        "définition : une strophe qui se tient toute seule. La correction vaut mieux "
        "après l'erreur qu'avant.",

        "**Un objet sur la table.** Apportez un verre ou un pot ébréché. Faites-le "
        "observer une minute, puis demandez d'écrire trois lignes : ce que l'objet a "
        "subi, et si cela se voit. Lisez ensuite « Le Vase brisé ». Les élèves "
        "reconnaîtront d'eux-mêmes la démarche du poème — décrire une chose pour parler "
        "d'autre chose.",

        "**Engagement de lecture.** Le recueil se lit en trois semaines, section par "
        "section, à raison d'une section par cinq jours. Chaque élève tient un carnet où "
        "il recopie, pour chaque section, **un vers qu'il a aimé** et **une question "
        "qu'il se pose**. Ce carnet servira à la négociation du projet d'étude et vaudra "
        "note de participation.",
    ],

    controles=[
        ("Contrôle n° 1 — 15 minutes (après « Au lecteur » et « La Vie intérieure »)", [
            "Combien de sections le recueil compte-t-il ? Nommez-les dans l'ordre.",
            "Que déclare le poète au lecteur dans le poème liminaire ? Citez deux vers.",
            "Dans « Le Vase brisé », quel geste a fêlé le vase, et quel bruit a-t-il "
            "fait ?",
            "À quoi le vase fêlé est-il comparé dans la seconde moitié du poème ?",
        ]),
        ("Contrôle n° 2 — 15 minutes (après « Jeunes filles » et « Femmes »)", [
            "Dans « Le meilleur Moment des Amours », quel moment le poète préfère-t-il, "
            "et à quoi le préfère-t-il ?",
            "Citez deux signes, dans ce poème, par lesquels l'amour se dit sans mot.",
            "Dans « La Femme », que demande le premier homme, et que lui est-il donné ?",
            "Quelle différence de ton voyez-vous entre la section « Jeunes filles » et "
            "la section « Femmes » ?",
        ]),
        ("Contrôle n° 3 — 15 minutes (après « Mélanges » et « Poèmes »)", [
            "Dans « Le Lever du soleil », qui se lève avant le jour, et pour quoi faire ?",
            "Que reproche le poète à ceux qui regardent le soleil sans le comprendre ?",
            "Dans « Je me croyais poète », qu'est-ce que le poète reconnaît ne pas avoir "
            "fait ?",
            "Quel souhait forme-t-il dans les trois derniers vers du recueil ?",
        ]),
    ],

    negociation=[
        "La négociation se tient après le contrôle n° 2, quand la classe a lu les trois "
        "premières sections et découvert que le livre ne raconte rien. C'est le moment "
        "où les élèves demandent d'eux-mêmes : « par quoi commence-t-on ? »",

        "**Déroulement, une heure.** Chaque élève relit son carnet et propose au tableau "
        "un vers et une question. Le professeur regroupe les questions en quatre ou cinq "
        "familles — le temps, l'amour, la croyance, la forme, le métier de poète. La "
        "classe choisit ensuite les deux familles qui feront l'objet des exposés, et "
        "vote l'ordre des six lectures méthodiques.",

        "**Ce qui n'est pas négociable, et qu'il faut dire.** Les six poèmes retenus, "
        "parce qu'ils couvrent les cinq sections ; la présence d'un travail de "
        "versification dans chaque fiche ; et les deux devoirs au format de l'examen. "
        "Tout le reste — l'ordre, les exposés, les prolongements — appartient à la "
        "classe. Une négociation où tout serait déjà décidé serait une leçon "
        "d'obéissance, non d'engagement.",

        "**Trace écrite.** Le projet arrêté est recopié au dos du carnet, daté et signé "
        "par deux élèves délégués. On le relit en fin de séquence pour vérifier ce qui a "
        "été tenu.",
    ],

    devoirs_progressifs=[
        ("Devoir n° 1 — après « La Vie intérieure »", [
            "**1. Question de lecture.** Relevez dans « Le Vase brisé » tous les mots "
            "qui appartiennent au champ lexical de la blessure. Classez-les en deux "
            "colonnes : ceux qui conviennent à un objet, ceux qui conviennent à une "
            "personne. Que remarquez-vous sur la colonne du milieu ?",
            "**2. Versification.** Comptez les syllabes des quatre premiers vers du "
            "poème, en marquant les e muets qui se prononcent. Donnez le nom du vers.",
            "**3. Écriture (12 lignes).** À la manière du poème, décrivez un objet "
            "abîmé de votre entourage, sans jamais dire ce qu'il représente. Le lecteur "
            "doit le deviner à la dernière ligne.",
        ]),
        ("Devoir n° 2 — après « Jeunes filles » et « Femmes »", [
            "**1. Question de lecture.** Dans « Le meilleur Moment des Amours », relevez "
            "les cinq compléments introduits par « il est dans… ». Que produit cette "
            "répétition ?",
            "**2. Comparaison.** Mettez côte à côte la première strophe de « Le meilleur "
            "Moment des Amours » et la première strophe de « La Femme ». Comparez le "
            "vers employé, le ton, et la personne qui parle. Présentez votre réponse "
            "dans un tableau à trois colonnes.",
            "**3. Argumentation (15 lignes).** « L'attente vaut mieux que la "
            "possession. » Le poème le dit ; le pensez-vous ? Répondez en vous appuyant "
            "sur le texte et sur un exemple de votre expérience.",
        ]),
        ("Devoir n° 3 — après « Mélanges » et « Poèmes »", [
            "**1. Question de lecture.** Dans « Le Lever du soleil », relevez tout ce "
            "qui relève du savoir scientifique, puis tout ce qui relève de l'émotion. "
            "Les deux relevés se recoupent-ils ?",
            "**2. Étude de la clôture.** Lisez « Au lecteur » et « Je me croyais poète » "
            "l'un après l'autre. Montrez en dix lignes que le second répond au premier.",
            "**3. Écriture (20 lignes).** Rédigez l'introduction complète d'un "
            "commentaire composé de « Je me croyais poète » : présentation, "
            "problématique, annonce du plan. On n'attend pas le développement.",
        ]),
    ],

    etude_personnages=[
        ["Le « je »", "Montrer qu'il change de statut d'une section à l'autre : "
         "confident dans « La Vie intérieure », amoureux dans « Jeunes filles », "
         "observateur dans « Mélanges », accusé de lui-même dans le dernier poème. "
         "Suivre ses verbes : je sens, je me souviens, je vois, je me croyais."],
        ["Le « tu » aimé", "Établir qu'il n'a ni nom, ni visage, ni parole. Chercher ce "
         "que cette absence permet : le lecteur peut y mettre quelqu'un. Comparer avec "
         "une élégie romantique où l'aimée est nommée."],
        ["La Femme", "Distinguer la femme aimée (« Jeunes filles ») de la Femme comme "
         "idée (« Femmes »). Montrer que la seconde est construite par le regard de "
         "l'homme : dans « La Femme », elle est faite après lui et pour lui, et le poème "
         "ne lui donne pas la parole. C'est un fait de texte, à observer avant d'être "
         "jugé."],
        ["Le savant", "Montrer qu'il n'est jamais ridiculisé. Sully Prudhomme ne "
         "l'oppose pas au poète : il montre deux regards sur le même objet. Relever dans "
         "« Le Lever du soleil » ce que le savant sait et que le rêveur ignore."],
        ["La Mémoire", "Établir qu'elle est traitée en personne : on l'appelle, on la "
         "loue, on l'accuse. Suivre le retournement entre la partie I et la partie II du "
         "poème."],
        ["Le lecteur", "Montrer qu'il est le seul personnage présent au début et à la "
         "fin du livre, et que le recueil est bâti comme une adresse."],
    ],

    etude_lieux=[
        ["Le vase", "Objet fragile et clos, fêlé sans bruit. Il vaut pour le cœur, mais "
         "aussi pour tout ce qui se casse sans qu'on le voie."],
        ["Le berceau, le nid", "Le départ et l'attente. Dans « Les Berceaux », les "
         "navires et les berceaux se répondent : partir et rester."],
        ["Le ciel étoilé", "Le lieu de la science et celui de l'inquiétude. On y "
         "cherche une réponse ; on y trouve une distance."],
        ["La mer", "Surtout la Bretagne des « Mélanges » : la falaise, le quai, la "
         "pointe du Raz. Un lieu réel, daté d'un voyage, et un lieu de méditation."],
        ["La chambre de la malade", "L'intérieur fermé où se joue la mort d'une jeune "
         "fille. Le monde continue derrière la fenêtre."],
        ["L'atelier, la forge", "Le monde du travail, que le poète a connu au Creusot. "
         "« Les Ouvriers », « Le Travail » : la peine des hommes entre au recueil."],
        ["Le livre lui-même", "Lieu paradoxal : « Au lecteur » et « Je me croyais "
         "poète » en font l'objet du poème. Le recueil parle de sa propre insuffisance."],
    ],

    schema=[
        ["Seuil — « Au lecteur »",
         "Le poète avertit que ses vrais vers ne seront pas lus. Une promesse "
         "retournée : le livre commence par un aveu de manque."],
        ["Premier moment — La Vie intérieure",
         "Le regard se tourne vers le dedans : le temps qui passe, l'habitude, la "
         "mémoire, le doute. « Le Vase brisé » y donne le modèle : dire l'intérieur par "
         "un objet."],
        ["Deuxième moment — Jeunes filles",
         "L'amour, mais toujours au bord : l'attente, l'adieu, la mort. Rien ne "
         "s'accomplit ; c'est le principe même de la section."],
        ["Troisième moment — Femmes",
         "Le ton s'élargit. La femme devient une question posée à l'humanité entière, "
         "du premier homme aux statues antiques."],
        ["Quatrième moment — Mélanges",
         "Le monde extérieur entre : la mer, le ciel, la forge, les dieux. La section la "
         "plus longue, et la plus variée de ton."],
        ["Cinquième moment — Poèmes",
         "Les pièces longues. Le poète se fait narrateur, orateur, historien, et "
         "s'adresse à ses maîtres — Musset le premier."],
        ["Clôture — « Je me croyais poète »",
         "Le livre revient à son seuil et le corrige : puisque le poème n'a peut-être "
         "pas de valeur en lui-même, qu'il aille vivre dans un autre cœur."],
    ],

    axes=[
        ("Axe 1 — Dire l'intérieur par le dehors", [
            "C'est le procédé le plus constant du recueil : une chose du monde tient "
            "lieu d'aveu. Le vase pour le cœur, le berceau pour l'attente, la fêlure "
            "pour la blessure.",
            "**Ce qu'il faut établir.** Que l'objet n'est pas un ornement mais l'unique "
            "moyen de dire. Dans « Le Vase brisé », le mot « cœur » n'apparaît qu'au "
            "quatorzième vers, une fois l'objet entièrement décrit : la comparaison "
            "vient après, et l'on a déjà compris.",
            "**Le mot juste.** On parle d'**allégorie** quand l'image tient tout le "
            "texte, de **métaphore filée** quand elle se poursuit sur plusieurs vers. "
            "Faire la différence en classe évite l'à-peu-près."
        ]),
        ("Axe 2 — La forme régulière au service de l'émotion", [
            "Le recueil est écrit dans des vers comptés, des strophes égales, des rimes "
            "suivies. C'est la marque parnassienne. Mais la régularité y sert à retenir "
            "l'émotion plutôt qu'à l'écarter.",
            "**Ce qu'il faut établir.** Que la contrainte produit l'effet. Le "
            "resserrement de l'octosyllabe dans « Le Vase brisé » donne au dernier vers "
            "— « Il est brisé, n'y touchez pas » — une brièveté de sentence. Le même "
            "aveu en prose ne ferait rien.",
            "**L'erreur à éviter.** Dire que « la forme est belle » sans montrer ce "
            "qu'elle fait. Un commentaire qui décrit le mètre sans l'interpréter n'a pas "
            "commencé.",
        ]),
        ("Axe 3 — La science et ce qu'elle ne dit pas", [
            "Sully Prudhomme a été formé aux sciences et en a été privé. Son recueil ne "
            "les attaque jamais : il montre ce qu'elles laissent hors d'atteinte.",
            "**Ce qu'il faut établir.** Que le poète ne choisit pas. Dans « Le Lever du "
            "soleil », l'astronome et le rêveur regardent la même chose et n'en tirent "
            "pas la même vérité — le poème refuse de départager. Dans « Intus », deux "
            "voix parlent en un seul homme, et aucune ne l'emporte.",
            "**Le contresens fréquent.** Faire de « Intus » un conflit entre deux "
            "religions ou entre la foi et l'athéisme. Le titre latin signifie « au "
            "dedans » : c'est un conflit **intérieur**, dans une seule conscience.",
        ]),
        ("Axe 4 — Le poète et son insuffisance", [
            "Du premier au dernier poème, le recueil doute de lui-même. « Au lecteur » "
            "annonce que le meilleur ne sera pas écrit ; « Je me croyais poète » "
            "reconnaît que d'autres ont fait la lyre.",
            "**Ce qu'il faut établir.** Que cet aveu n'est pas une coquetterie. Il "
            "commande la composition du livre — deux adresses au lecteur qui l'encadrent "
            "— et fournit la définition de la poésie que le recueil propose : non pas "
            "une œuvre réussie, mais une parole qui se transmet.",
            "**Prolongement.** Comparer avec « Au lecteur » de Baudelaire, qui prend le "
            "lecteur à partie au lieu de s'excuser devant lui. Deux façons opposées "
            "d'ouvrir un recueil, la même année ou presque.",
        ]),
    ],

    oral=[
        "**Ce qu'on demande.** Lire un poème court en entier, ou vingt vers d'un poème "
        "long, puis en rendre compte pendant cinq minutes : de quoi il parle, comment il "
        "est fait, ce qu'il produit.",

        "**Déroulement en quatre temps.** 1) L'élève lit à voix haute, sans commenter. "
        "2) Il dit en une phrase de quoi parle le passage. 3) Il en donne les mouvements "
        "et s'arrête sur deux procédés, chacun cité puis nommé puis interprété. 4) Il "
        "répond à deux questions de la classe.",

        "**Ce qui se joue dans la lecture elle-même.** En poésie, la lecture à voix "
        "haute est déjà une analyse. Marquer la césure, respecter l'e muet, ne pas "
        "s'arrêter à la fin d'un vers quand la phrase continue : chacun de ces gestes "
        "montre qu'on a compris la construction. Un élève qui lit « Mais la légère "
        "meurtrissure / Mordant le cristal chaque jour » en s'arrêtant après "
        "« meurtrissure » n'a pas vu l'enjambement.",

        "**Barème indicatif sur 20.** Lecture : 5 · Sens du passage : 4 · Mouvements : 3 "
        "· Analyse de deux procédés : 5 · Réponses aux questions : 3.",
    ],

    exposes=[
        "**Le Parnasse en dix minutes.** Ce que le mouvement refuse, ce qu'il demande, "
        "qui en est. Terminer en montrant sur un poème précis en quoi Sully Prudhomme "
        "s'en écarte.",

        "**Le Vase brisé, histoire d'un succès.** Pourquoi ce poème-là est-il devenu "
        "célèbre, quand cent sept autres ne l'ont pas été ? Chercher ce qui le rend "
        "citable : la brièveté, l'image unique, la sentence finale.",

        "**Sully Prudhomme et la musique.** Fauré a mis en musique « Ici-bas ! » et "
        "« Les Berceaux ». Faire écouter, puis montrer ce que la mélodie fait du poème : "
        "ce qu'elle allonge, ce qu'elle répète, ce qu'elle laisse tomber."
        ,
        "**Le premier prix Nobel de littérature.** En 1901, l'Académie suédoise choisit "
        "Sully Prudhomme alors que Tolstoï est vivant. Raconter la polémique, et se "
        "demander ce qu'un prix littéraire récompense.",

        "**Les dédicaces du recueil.** Relever à qui chaque poème est dédié, classer les "
        "destinataires (amis, écrivains, industriels, savants), et dire ce que cette "
        "liste apprend du milieu où naît le livre.",

        "**Un motif d'un bout à l'autre.** Choisir un motif — l'eau, l'étoile, la main, "
        "le silence —, le suivre dans les cinq sections, et montrer s'il garde ou change "
        "de valeur.",

        "**Traduire Lucrèce.** Sully Prudhomme a traduit le premier livre du *De rerum "
        "natura*. Présenter ce poème latin qui explique le monde par la matière, et "
        "chercher sa trace dans « Le Lever du soleil » et « L'Art ».",
    ],

    themes=[
        ["Le temps et la mémoire",
         "« La Mémoire », « L'Habitude », « Le Passé », « Jours lointains »."],
        ["La blessure secrète",
         "« Le Vase brisé », « Les Chaînes », « Mal ensevelie »."],
        ["L'amour et l'attente",
         "« Le meilleur Moment des Amours », « Les Adieux », « Séparation »."],
        ["La mort",
         "« La Malade », « Un Songe », « Consolation », « Fleur sans Soleil »."],
        ["Le doute religieux",
         "« Intus », « Si j'étais Dieu », « À un Trappiste »."],
        ["La science et l'idéal",
         "« Le Lever du soleil », « Le Monde des Âmes », « La Poésie »."],
        ["La nature et la mer",
         "Presque toute la section « Mélanges » : « La Falaise », « L'Océan », "
         "« La Pointe du Raz »."],
        ["Le travail des hommes",
         "« Les Ouvriers », « Le Travail », « Le Joug », « Paysan »."],
        ["Le métier de poète",
         "« Au lecteur », « La Poésie », « L'Art », « Je me croyais poète »."],
    ],

    lexique_general=[
        ("A — Les mots du recueil", [
            ["Belliqueux", "qui aime la guerre, porté au combat."],
            ["Colloque", "conversation, entretien."],
            ["Altier", "fier, hautain."],
            ["Verveine", "plante à petites fleurs, souvent tenue dans un vase."],
            ["Meurtrissure", "marque laissée par un coup ; blessure sans plaie ouverte."],
            ["Suc", "liquide nourricier d'une plante."],
            ["Furtif", "qui se fait à la dérobée, sans être vu."],
            ["Pudeur", "retenue de celui qui n'ose pas montrer ce qu'il éprouve."],
            ["Faveur", "marque d'estime accordée ; ici, presque une récompense."],
            ["Épars", "dispersé, répandu de tous côtés."],
            ["Étreindre", "serrer dans ses bras."],
            ["Ennui", "au XIXᵉ siècle, sens fort : lassitude profonde de l'existence."],
            ["Sphère", "chacun des corps célestes ; par extension, le ciel des "
             "astronomes."],
            ["Lyre", "instrument des poètes antiques ; par métonymie, la poésie."],
            ["Se méprendre", "se tromper sur ce que l'on est ou sur ce que l'on croit."],
        ]),
        ("B — Les mots pour parler d'un poème", [
            ["Allégorie", "idée abstraite représentée tout au long d'un texte par une "
             "chose concrète."],
            ["Anaphore", "répétition d'un même mot au début de plusieurs vers."],
            ["Antithèse", "rapprochement de deux termes de sens contraire."],
            ["Césure", "coupe intérieure du vers ; elle sépare les deux hémistiches."],
            ["Chiasme", "croisement de deux groupes symétriques (AB / BA)."],
            ["Diérèse", "prononciation en deux syllabes de deux voyelles voisines."],
            ["Enjambement", "la phrase se poursuit au vers suivant."],
            ["Hémistiche", "moitié d'un vers, de part et d'autre de la césure."],
            ["Métaphore filée", "image poursuivie sur plusieurs vers."],
            ["Octosyllabe", "vers de huit syllabes."],
            ["Périphrase", "groupe de mots employé à la place d'un seul."],
            ["Quatrain", "strophe de quatre vers."],
            ["Rejet", "mot ou groupe court renvoyé au début du vers suivant."],
            ["Rime riche", "rime qui fait entendre trois sons communs ou plus."],
            ["Strophe", "groupe de vers séparé des autres par un blanc."],
        ]),
    ],

    bibliographie=[
        "**Œuvre étudiée** — SULLY PRUDHOMME, *Stances et Poèmes*, Paris, Alphonse "
        "Lemerre, 1865. Les citations de ce cahier suivent le texte de l'édition des "
        "*Poésies 1865-1866*.",

        "**Du même auteur** — *Les Épreuves* (1866), *Les Solitudes* (1869), *Les "
        "Vaines Tendresses* (1875), *La Justice* (1878), *Le Bonheur* (1888), "
        "*Réflexions sur l'art des vers* (1892).",

        "**Traduction** — LUCRÈCE, *De la nature des choses*, livre I, traduit par Sully "
        "Prudhomme, Paris, Lemerre, 1869.",

        "**Pour situer le mouvement** — *Le Parnasse contemporain*, Paris, Lemerre, "
        "1866 (recueil collectif où figure Sully Prudhomme).",

        "**Textes officiels** — MINESEC, *Programme de français du second cycle* ; "
        "MINESEC, *Guide pédagogique* 2019 ; OBC, grilles d'évaluation harmonisées.",

        "**Compagnon de ce cahier** — CENTRE VÉRITAS, *Stances et Poèmes — manuel "
        "pédagogique d'étude de l'œuvre intégrale*, Douala (étude des cinquante-quatre "
        "poèmes, avec texte intégral et plans de commentaire).",
    ],
)
