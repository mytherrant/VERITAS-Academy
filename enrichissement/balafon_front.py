# -*- coding: utf-8 -*-
"""
Paratexte du cahier « Balafon » (Engelbert Mveng, 1972).

Le recueil est déjà servi par un manuel VÉRITAS antérieur, qui étudie les
seize poèmes en cinq étapes chacun. Ce cahier-ci ne le remplace pas : il
l'aligne sur le gabarit des huit autres cahiers d'œuvre intégrale — six
lectures méthodiques, deux commentaires et deux dissertations rédigés, deux
devoirs au format MINESEC, une rubrique d'examen.

Les six poèmes retenus vont de l'ouverture du recueil à sa clôture et sont
reproduits **entiers**. Voir `balafon_extraits.py`, produit par un générateur
qui délimite chaque pièce par son premier et son dernier vers — le fichier
source imprime les titres au milieu du texte, et s'y fier découperait des
poèmes faux.
"""

INFOS = dict(
    titre="Balafon",
    sous_titre="seize poèmes en versets",
    auteur="Engelbert Mveng",
    edition="1972",
    niveau="Première",
    genre="poésie",

    # Un recueil n'a ni personnages ni intrigue : il a des voix, des lieux et
    # un itinéraire. Les rubriques sont renommées en conséquence.
    libelles={
        "personnages_titre": "4. Les voix et les figures du recueil",
        "personnages_entetes": ("Figure", "Ce qu'elle est dans le recueil"),
        "etude_personnages_titre": "5 bis. Étude des figures",
        "etude_personnages_entetes": ("Figure", "Ce que l'étude doit établir"),
        "lieux_titre": "5 ter. Les lieux et les motifs",
        "lieux_entetes": ("Lieu ou motif", "Valeur dans le recueil"),
        "schema_titre": "5 quater. L'itinéraire du recueil",
        "schema_entetes": ("Moment", "Contenu"),
    },

    avertissements=[
        "**Le recueil compte seize poèmes ; ce cahier en étudie six de près.** "
        "Une lecture méthodique demande une heure de classe, et l'année n'en "
        "offre pas seize. Les six pièces retenues suivent l'itinéraire du "
        "livre, de son ouverture — « À Kong-Fu-Tseu » — à sa clôture — "
        "« Offrande ». Les dix autres ne sont pas abandonnés : ils servent aux "
        "contrôles, aux devoirs progressifs et aux exposés.",

        "**Mveng écrit en versets, non en vers comptés.** On ne comptera donc "
        "pas les syllabes de ce recueil comme on compte celles d'un "
        "alexandrin : il n'y a ni mètre fixe, ni rime régulière. Ce qui fait "
        "le rythme, ce sont les reprises, les énumérations et la longueur "
        "inégale des lignes. Un élève qui cherche des rimes ne trouvera rien "
        "et croira le texte informe.",

        "**Le fichier numérique du recueil place les titres au milieu du "
        "texte.** C'est un défaut de numérisation, non une intention de "
        "l'auteur : « Ta borne qui fonde tout » / « Adamawa (1959) » / « les "
        "rais de l'aube » sont une seule phrase coupée par un titre. Les "
        "extraits de ce cahier ont été délimités vers à vers pour corriger "
        "cela. Si l'on travaille sur une autre copie, il faut le vérifier.",
    ],

    note_enseignants=[
        "Ce cahier applique au recueil d'Engelbert Mveng la démarche demandée "
        "par le Programme de français du second cycle : activités augurales, "
        "lecture hors classe, contrôle de lecture, négociation du projet "
        "d'étude, étude collective, exposés, évaluation.",

        "L'étude d'un recueil ne se conduit pas comme celle d'un roman : il n'y "
        "a pas d'intrigue à suivre. Deux principes tiennent lieu de fil. Le "
        "premier est l'**itinéraire** — le livre va de l'Afrique vers les "
        "continents, puis vers Dieu, et l'ordre des six fiches le suit. Le "
        "second est le **motif** : le tam-tam, les mains, l'or, la mère "
        "reviennent d'un poème à l'autre et relient des pièces éloignées.",

        "Trois difficultés reviennent chaque année. La première est le "
        "**verset** : les élèves cherchent un mètre, n'en trouvent pas, et "
        "concluent que le texte est en prose. Il faut leur faire entendre le "
        "rythme des reprises. La deuxième est le **double héritage** : Mveng "
        "est africain et chrétien, et son poème fond les deux — le calice et "
        "le tam-tam, la croix et le balafon. Séparer les deux registres, c'est "
        "manquer le livre. La troisième est la **densité des noms propres** : "
        "Kong-Fu-Tseu, Moteczuma, Marcinelle, Mokoghibly. Le glossaire du "
        "volume est indispensable, et ce cahier le prolonge.",

        "Le manuel VÉRITAS *Balafon* (étude des seize poèmes en cinq étapes) "
        "reste le compagnon de ce cahier : on y trouvera le texte des poèmes "
        "cités ici en renvoi, et une analyse pour chacun.",
    ],

    citation_guide=(
        "« L'étude collective de l'œuvre en classe à travers les lectures "
        "méthodiques ou d'autres formes de lectures (lecture suivie, lecture "
        "analytique, etc.) ou l'étude de divers aspects de l'œuvre "
        "(l'énonciation, les forces agissantes, les aspects marquants de "
        "l'écriture, les thèmes majeurs, etc.). »",
        "MINESEC, Guide pédagogique 2019, § III.2"),

    notions=[
        ["Recueil", "Livre qui rassemble des poèmes composés séparément.",
         "Les seize pièces de 1972, groupées en ensembles."],
        ["Verset", "Longue ligne libre, sans mètre fixe ni rime régulière, "
         "rythmée par le souffle et les reprises.",
         "Tout le recueil ; comparer un vers de « New York » et un vers de "
         "« Offrande »."],
        ["Litanie", "Reprise d'une même formule, comme dans une prière.",
         "« Je suis… » dans « À Kong-Fu-Tseu » ; « Tam-tam… » dans "
         "« Moscou »."],
        ["Anaphore", "Répétition d'un même mot en tête de plusieurs lignes.",
         "« La paix… » répété dans « New York »."],
        ["Apostrophe", "On s'adresse directement à quelqu'un ou à quelque "
         "chose.", "« Ô Manhattan », « Dors MOKOGHIBLY », « mon Seigneur »."],
        ["Énumération, accumulation", "Longue liste de noms ou d'images.",
         "Les villes et les peuples de « New York » ; les tam-tams de "
         "« Moscou »."],
        ["Métaphore", "Image sans outil de comparaison.",
         "« la forêt vierge a la densité que j'ordonne verticale d'acier »."],
        ["Symbole", "Objet concret qui vaut pour une idée, dans tout le "
         "livre.", "Le balafon, le tam-tam, la marmite d'argile, l'or."],
        ["Hyperbole", "Exagération qui grandit ce dont on parle.",
         "« mille et mille fois », « les siècles pulvérisés »."],
        ["Gradation", "Suite de termes d'intensité croissante.",
         "Les mouvements finaux d'« Offrande »."],
        ["Registre lyrique", "Expression d'un sentiment personnel.",
         "« Ma mère », « Postface »."],
        ["Registre épique", "Fresque de peuples, souffle collectif.",
         "« New York », « Moteczuma »."],
        ["Registre sacré, prophétique", "Prière, annonce, bénédiction.",
         "« Épiphanie », « Pentecôte sur l'Afrique », « Offrande »."],
        ["Oratorio", "Œuvre à plusieurs voix, avec chœurs et solistes.",
         "« Marcinelle, 1956 », qui porte des indications de chœur."],
        ["Négritude", "Mouvement littéraire d'affirmation de la culture "
         "noire, autour de Senghor et de Césaire.",
         "L'arrière-plan de tout le recueil, prolongé et déplacé par Mveng."],
        ["Syncrétisme", "Union de deux traditions en une seule expression.",
         "Le calice et le tam-tam, la croix et le balafon."],
    ],

    biographie=[
        "**Un prêtre, un savant, un poète.** Engelbert Mveng naît en 1930 près "
        "de Yaoundé. Entré chez les Jésuites, ordonné prêtre, il mène de front "
        "plusieurs vocations : historien, théologien, archéologue, artiste. La "
        "quatrième de couverture du recueil le présente comme « l'auteur de "
        "nombreuses publications sur l'histoire, l'archéologie, la théologie, "
        "la géographie ».",

        "**Un homme qui écrit d'abord de l'histoire.** Avant *Balafon*, il "
        "publie une *Histoire du Cameroun* (Présence Africaine, 1963) et "
        "*L'art d'Afrique noire* (1964). La liste « Du même auteur », en tête "
        "du volume, compte des essais, des livres d'art et des textes de "
        "prière. *Balafon*, paru en 1972, est son grand recueil poétique : le "
        "poème vient après le savoir, non avant.",

        "**Un double héritage assumé.** La quatrième de couverture le dit "
        "d'une phrase : « le Mveng de ce recueil de poèmes n'est pas seulement "
        "fils d'Afrique. Il se veut aussi fils du monde ». Le christianisme "
        "n'est pas chez lui un vêtement emprunté : il l'écrit en images "
        "africaines — la croix et le balafon, le calice et la marmite "
        "d'argile.",

        "**Une mort violente.** Engelbert Mveng est « arraché brutalement à la "
        "vie le 23 avril 1995 par une main criminelle », selon les termes du "
        "volume. L'affaire n'a jamais été élucidée. Il faut le dire aux élèves "
        "avec sobriété : ce cahier n'a pas à trancher ce que la justice n'a "
        "pas tranché.",
    ],

    contexte=[
        "**1972 : douze ans après l'indépendance.** Le Cameroun est "
        "indépendant depuis 1960. Le temps n'est plus à la revendication mais "
        "à la question : que dire, maintenant qu'on peut parler ? *Balafon* "
        "répond en tendant la main plutôt qu'en réglant des comptes.",

        "**Après la Négritude, avec elle.** Senghor et Césaire ont affirmé la "
        "dignité de la culture noire. Mveng prolonge ce mouvement et le "
        "déplace : son Afrique ne se définit pas contre l'Europe, elle écrit "
        "« à ses amis » — à la Chine, à l'Europe, à l'Amérique précolombienne, "
        "aux mineurs de Belgique. Le recueil s'intitule d'ailleurs, dans sa "
        "première partie, « Lettres à mes amis ».",

        "**Des événements datés.** Plusieurs poèmes portent une année, et "
        "renvoient à des faits réels : Marcinelle, 1956, où une catastrophe "
        "minière tue des ouvriers, dont beaucoup d'immigrés ; New York, 1970, "
        "au temps des Black Panthers, de Martin Luther King assassiné et de "
        "Malcolm X ; Moscou, 1971, en pleine Guerre froide. Le poème ne "
        "commente pas l'actualité : il la fait entrer dans un chant.",

        "**Un christianisme africain.** Les années 1960-1970 sont celles où "
        "l'Église d'Afrique cherche ses propres formes. Mveng y prend part "
        "comme théologien et comme artiste — il a décoré des chapelles. Sa "
        "poésie fait le même travail : donner au sacré chrétien un visage "
        "africain, sans le trahir ni s'y dissoudre.",

        "**Ce que le poète attend de l'écrivain.** Mveng l'a formulé "
        "lui-même, et la phrase éclaire tout le recueil : l'écrivain « cherche "
        "toujours l'homme qui vient après l'enfant, la vie qui vient après la "
        "mort, le jour qui vient après la nuit ». Le livre est traversé de "
        "souffrances, et il finit toujours par l'aube.",
    ],

    structure=[
        ["« Lettres à mes amis »",
         "L'Afrique écrit aux continents : « À Kong-Fu-Tseu » (l'Asie), « À "
         "Roland-Roger » (l'Europe), « Moteczuma » (l'Amérique "
         "précolombienne), « Lettre collective »."],
        ["Les poèmes de lieux et de dates",
         "« Dépaysement » (1958), « Ostende-Douvre » (1956), « Marcinelle, "
         "1956 », « New York » (1970), « Moscou » (1971), « Adamawa » (1959), "
         "« Tu reviendras, Sénégal ! » (1971)."],
        ["Les poèmes de la foi",
         "« Épiphanie » (1962) et « Pentecôte sur l'Afrique » (1964) : le "
         "sacré chrétien dit en images africaines."],
        ["« Mère » (1964) et « Postface »",
         "Le plus long poème du recueil, et son écho intime : l'Afrique-Mère, "
         "puis le fils qui rend compte."],
        ["« Offrande » (1963)",
         "La clôture, en dix mouvements numérotés : la marmite d'argile de la "
         "mère devient l'offrande déposée dans les mains de Dieu."],
    ],

    personnages=[
        ["Le « je »", "Le poète. Tour à tour fils d'Afrique, hôte des "
                      "continents, mage, orant."],
        ["Les destinataires", "Kong-Fu-Tseu, Roland-Roger, Moteczuma : le "
                              "recueil s'ouvre par des lettres à des "
                              "figures."],
        ["L'Afrique", "Non pas un décor mais une personne : on lui parle, "
                      "elle parle, elle est mère."],
        ["La Mère", "Figure double : la mère du poète et l'Afrique. Le poème "
                    "« Mère » ne les sépare jamais tout à fait."],
        ["Dieu, le Seigneur", "Destinataire de la prière, et présence au "
                              "terme de l'itinéraire."],
        ["Les morts de Marcinelle", "Les ouvriers de la catastrophe, dont le "
                                    "poème fait un chœur."],
        ["Les peuples", "Les Noirs d'Amérique, les pasteurs de l'Adamaoua, "
                        "les foules des villes : le collectif est partout."],
    ],

    paratexte=[
        ("1. Le titre : « Balafon »", [
            "Le balafon est un instrument de musique africain, fait de lames "
            "de bois posées sur des calebasses. On en joue dans la fête, mais "
            "aussi pour accompagner la parole.",
            "**Ce que le titre annonce.** Un livre qui se veut instrument : "
            "non pas un texte à lire en silence, mais une parole à faire "
            "entendre. La quatrième de couverture le confirme en parlant du "
            "balafon comme d'un « instrument de communication, véhicule à la "
            "fois du plaisir et de la parole ».",
            "**Ce que le titre engage.** Un instrument ne parle pas seul : "
            "quelqu'un en joue, quelqu'un écoute. Tout le recueil est bâti "
            "sur cette adresse — des lettres, des apostrophes, des prières.",
        ]),
        ("2. La quatrième de couverture", [
            "Elle donne le programme du livre en trois phrases : « Seize "
            "poèmes dont le message interpelle, supplie, exhorte et rudoie "
            "quand il le faut. »",
            "**Quatre verbes, quatre tons.** Interpeller, supplier, exhorter, "
            "rudoyer : c'est déjà l'annonce d'un livre à plusieurs registres. "
            "Faire chercher aux élèves, après lecture, un poème pour chacun de "
            "ces quatre verbes — l'exercice vaut mieux qu'un cours sur les "
            "registres.",
            "**L'universel visé, non l'exotisme.** La suite l'affirme : les "
            "poèmes prennent leur essor « de leurs sources africaine et "
            "chrétienne » et se mêlent « aux mélodies d'autres continents pour "
            "atteindre l'universel ». Le recueil ne se veut pas régional.",
        ]),
        ("3. L'itinéraire annoncé par les titres", [
            "Lire seulement la table des seize titres suffit à voir le "
            "mouvement : des noms de personnes (Kong-Fu-Tseu, Roland-Roger, "
            "Moteczuma), puis des noms de lieux et de dates (Marcinelle 1956, "
            "New York 1970, Moscou 1971, Adamawa 1959), puis des noms de fêtes "
            "(Épiphanie, Pentecôte), enfin des noms de personnes à nouveau, "
            "mais intimes : « Mère », « Offrande ».",
            "**Un mouvement du lointain vers le proche, et du monde vers "
            "Dieu.** C'est le fait de composition le plus important du "
            "recueil, et l'on peut le faire découvrir aux élèves avant même "
            "d'ouvrir un poème.",
        ]),
        ("4. Le glossaire final", [
            "Le volume se termine par un glossaire qui explique les noms "
            "africains et bibliques employés dans les poèmes.",
            "**À utiliser dès la première séance.** Un poème dont on ne "
            "comprend pas les noms propres reste opaque. Faire chercher aux "
            "élèves, avant chaque lecture, les entrées du glossaire "
            "correspondant au poème du jour : c'est cinq minutes qui rendent "
            "l'heure possible.",
        ]),
    ],

    augurales=[
        "**Avant d'ouvrir le livre — un quart d'heure.** Faire écouter un "
        "balafon, si l'on dispose d'un enregistrement ou d'un instrument. "
        "Demander ensuite ce qu'un poète peut vouloir dire en donnant ce nom à "
        "son livre. Garder trois réponses au tableau ; on y reviendra à la "
        "dernière fiche.",

        "**Le titre seul, puis les seize titres.** Écrire au tableau la liste "
        "des seize titres, dans l'ordre. Demander à la classe de la partager "
        "en trois groupes et de nommer chaque groupe. Les élèves retrouvent "
        "presque toujours d'eux-mêmes l'itinéraire — des personnes, des lieux, "
        "des prières.",

        "**Quatre verbes.** Écrire « interpeller, supplier, exhorter, "
        "rudoyer » — les quatre verbes de la quatrième de couverture. Demander "
        "d'écrire trois lignes en employant l'un d'eux, adressées à quelqu'un "
        "qu'on ne connaît pas. C'est l'exercice qui prépare le mieux à la "
        "forme épistolaire des premiers poèmes.",

        "**Engagement de lecture.** Le recueil se lit en trois semaines, "
        "environ cinq poèmes par semaine. Chaque élève tient un carnet où il "
        "recopie, pour chaque poème, **un verset qu'il a aimé** et **un nom "
        "propre qu'il a dû chercher**. Ce carnet servira à la négociation du "
        "projet d'étude et vaudra note de participation.",
    ],

    controles=[
        ("Contrôle n° 1 — 15 minutes (après « Lettres à mes amis »)", [
            "À qui les quatre premiers poèmes sont-ils adressés ? Nommez les "
            "destinataires.",
            "Dans « À Kong-Fu-Tseu », quel préjugé le poète déclare-t-il "
            "abandonner ? Citez le vers.",
            "Que partagent le poète et son ami à la fin du poème ? Relevez "
            "deux vers.",
            "Qu'est-ce qu'un balafon ? Pourquoi ce mot donne-t-il son titre au "
            "recueil ?",
        ]),
        ("Contrôle n° 2 — 15 minutes (après les poèmes de lieux et de dates)", [
            "Que s'est-il passé à Marcinelle en 1956 ? Comment le poème le "
            "fait-il entendre ?",
            "Dans « New York », citez trois noms propres de la lutte des Noirs "
            "américains.",
            "Quel mot est répété tout au long de « New York » ? Que "
            "produit-il ?",
            "Dans « Adamawa », à quoi le poète compare-t-il la terre ? Relevez "
            "deux images.",
        ]),
        ("Contrôle n° 3 — 15 minutes (après les poèmes de la foi et la "
         "clôture)", [
            "Dans « Épiphanie », qu'apporte le poète, et dans quel état sont "
            "ses mains ?",
            "Quel objet donne son sujet au poème « Offrande » ? À qui "
            "appartenait-il ?",
            "En combien de mouvements « Offrande » est-il divisé ? Comment "
            "sont-ils désignés ?",
            "Quels sont les derniers mots du recueil ? Que signifient-ils, "
            "selon vous ?",
        ]),
    ],

    negociation=[
        "La négociation se tient après le contrôle n° 2, quand la classe a lu "
        "les deux tiers du recueil et découvert qu'il ne raconte rien. C'est "
        "le moment où les élèves demandent d'eux-mêmes par quoi commencer.",

        "**Déroulement, une heure.** Chaque élève relit son carnet et propose "
        "au tableau un verset et un nom propre. Le professeur regroupe les "
        "propositions en quatre ou cinq familles — la fraternité, la "
        "souffrance, la foi, la mère, la parole. La classe choisit les deux "
        "familles qui feront l'objet des exposés, et vote l'ordre des six "
        "lectures méthodiques.",

        "**Ce qui n'est pas négociable, et qu'il faut dire.** Les six poèmes "
        "retenus, parce qu'ils suivent l'itinéraire du livre ; la présence "
        "d'un travail sur le verset dans chaque fiche ; et les deux devoirs au "
        "format de l'examen. Tout le reste appartient à la classe. Une "
        "négociation où tout serait décidé d'avance serait une leçon "
        "d'obéissance, non d'engagement.",

        "**Trace écrite.** Le projet arrêté est recopié au dos du carnet, daté "
        "et signé par deux élèves délégués. On le relit en fin de séquence "
        "pour vérifier ce qui a été tenu.",
    ],

    devoirs_progressifs=[
        ("Devoir n° 1 — après « Lettres à mes amis »", [
            "**1. Question de lecture.** Relevez dans « À Kong-Fu-Tseu » tous "
            "les versets qui commencent par « Je suis ». Que produit cette "
            "reprise ?",
            "**2. Vocabulaire.** Cherchez dans le glossaire du volume cinq "
            "noms propres rencontrés dans les quatre premiers poèmes. "
            "Recopiez-les avec leur définition.",
            "**3. Écriture (15 lignes).** À la manière de Mveng, écrivez une "
            "lettre en versets à un pays que vous ne connaissez pas. Vous "
            "emploierez au moins trois fois la formule « Tu m'as ouvert… ».",
        ]),
        ("Devoir n° 2 — après les poèmes de lieux et de dates", [
            "**1. Question de lecture.** Dans « New York », relevez toutes les "
            "occurrences du mot « paix ». Où se trouvent-elles dans le poème ?",
            "**2. Comparaison.** Mettez côte à côte l'ouverture de "
            "« Marcinelle » et celle de « New York ». Comparez la longueur des "
            "versets, le ton et la personne qui parle. Présentez votre réponse "
            "dans un tableau à trois colonnes.",
            "**3. Argumentation (15 lignes).** « Un poème peut-il parler d'une "
            "catastrophe sans la raconter ? » Répondez en vous appuyant sur "
            "« Marcinelle, 1956 ».",
        ]),
        ("Devoir n° 3 — après les poèmes de la foi et la clôture", [
            "**1. Question de lecture.** Dans « Épiphanie », relevez tout ce "
            "qui est sale, pauvre ou déchiré, puis tout ce qui est d'or. Que "
            "montre l'opposition des deux relevés ?",
            "**2. Étude de la composition.** « Offrande » est divisé en "
            "mouvements numérotés. Donnez à chacun un titre de trois mots.",
            "**3. Écriture (20 lignes).** Rédigez l'introduction complète d'un "
            "commentaire composé de « New York » : situation, présentation, "
            "problématique, annonce du plan. On n'attend pas le développement.",
        ]),
    ],

    etude_personnages=[
        ["Le « je »", "Montrer qu'il change de statut d'un ensemble à "
         "l'autre : épistolier dans les « Lettres », témoin dans les poèmes "
         "de lieux, mage puis orant dans les poèmes de foi, fils dans "
         "« Postface ». Suivre ses verbes : j'écris, je vois, j'apporte, je "
         "dis."],
        ["L'Afrique", "Établir qu'elle n'est jamais un décor. Elle parle, on "
         "lui parle, elle donne, elle enfante. Relever les verbes dont elle "
         "est sujet."],
        ["La Mère", "Distinguer, sans les séparer, la mère du poète et "
         "l'Afrique-Mère. Montrer par le texte que le poème les fait "
         "coïncider — et se demander ce que ce glissement permet de dire."],
        ["Dieu", "Montrer qu'il est destinataire avant d'être sujet : le "
         "poète lui parle bien plus qu'il ne parle de lui. Relever les "
         "apostrophes."],
        ["Les peuples", "Établir que le collectif est partout : chœurs de "
         "Marcinelle, foules de New York, pasteurs de l'Adamaoua. Le « je » "
         "de Mveng n'est presque jamais seul."],
    ],

    etude_lieux=[
        ["Le balafon, le tam-tam, le likembe", "Les instruments : ce qui "
         "porte la parole. Ils reviennent d'un bout à l'autre du livre."],
        ["Les mains", "Motif central : mains sales d'« Épiphanie », mains "
         "tendues d'« Offrande », mains de Dieu. Les suivre suffit à "
         "construire un axe."],
        ["L'or", "Ce qu'on apporte, et ce qu'on n'a pas. L'or pur, l'or "
         "vivant, les mains vides."],
        ["La marmite d'argile", "Objet de la mère, matière humble ; elle "
         "devient l'offrande du dernier poème."],
        ["Les villes", "Marcinelle, New York, Moscou, Ostende : le monde "
         "moderne entre dans le poème par ses noms."],
        ["La terre natale", "L'Adamaoua, ses troupeaux, ses pasteurs : le "
         "seul lieu que le poème appelle par un nom de personne, "
         "MOKOGHIBLY."],
        ["L'aube et la nuit", "Le grand couple du recueil : « le jour qui "
         "vient après la nuit », selon la formule de l'auteur."],
    ],

    schema=[
        ["Ouverture — « Lettres à mes amis »",
         "L'Afrique écrit aux continents. Le ton est celui de l'amitié : on "
         "tend la main, on refuse le préjugé, on partage le pain."],
        ["Deuxième moment — les villes et les dates",
         "Le monde moderne entre avec ses catastrophes et ses luttes : "
         "Marcinelle, New York, Moscou. Le chant devient plus grave."],
        ["Troisième moment — la terre natale",
         "« Adamawa », « Tu reviendras, Sénégal ! » : le regard revient vers "
         "l'Afrique, ses pasteurs et ses fleuves."],
        ["Quatrième moment — la foi",
         "« Épiphanie », « Pentecôte sur l'Afrique » : le sacré chrétien dit "
         "en images africaines. Le poète n'apporte que des mains vides."],
        ["Cinquième moment — la mère",
         "« Mère », le plus long poème du livre, et « Postface » : le chant "
         "devient intime, et l'Afrique devient une personne."],
        ["Clôture — « Offrande »",
         "En dix mouvements, la marmite d'argile de la mère est déposée dans "
         "les mains de Dieu. Le recueil se ferme « sur la lèvre de Dieu »."],
    ],

    axes=[
        ("Axe 1 — Écrire aux autres, non contre eux", [
            "Le recueil s'ouvre par des lettres. C'est un choix de forme, et "
            "c'en est un de pensée : on ne s'adresse pas à un adversaire comme "
            "à un ami.",
            "**Ce qu'il faut établir.** Que l'apostrophe gouverne tout le "
            "livre — à Confucius, à l'Europe, à Manhattan, à Dieu. Et que le "
            "préjugé y est nommé pour être congédié : « tu n'es plus pour moi "
            "le Danger jaune ».",
            "**L'erreur à éviter.** Faire de Mveng un poète de la "
            "revendication. Il vient après la Négritude et il en garde la "
            "fierté ; mais son geste est l'invitation, non l'accusation.",
        ]),
        ("Axe 2 — Le verset, ou le rythme sans le mètre", [
            "Mveng n'écrit ni en alexandrins ni en prose : il écrit en "
            "versets, de longueur libre.",
            "**Ce qu'il faut établir.** Que le rythme vient d'ailleurs que du "
            "compte des syllabes : des reprises (« La paix, la paix, la "
            "paix… »), des énumérations, de l'inégalité voulue des lignes. Un "
            "verset de trois mots après un verset de trente produit un "
            "silence.",
            "**Le geste de classe.** Faire lire à voix haute, deux élèves en "
            "alternance. Ce qui ne s'entend pas à l'œil s'entend "
            "immédiatement."
        ]),
        ("Axe 3 — L'Afrique et la Croix : un seul langage", [
            "Le recueil ne juxtapose pas deux héritages, il les fond.",
            "**Ce qu'il faut établir.** Relever les images doubles : le calice "
            "et la coupe partagée, le tam-tam et la Pentecôte, la marmite "
            "d'argile et l'offrande. Montrer que le mot africain ne sert pas "
            "d'ornement au mot chrétien : il le dit.",
            "**Prolongement.** Comparer avec un cantique traduit en langue "
            "locale : la traduction remplace des mots ; Mveng, lui, refait "
            "l'image."
        ]),
        ("Axe 4 — La souffrance et l'aube", [
            "Le livre est plein de morts : les mineurs de Marcinelle, les "
            "Noirs d'Amérique, les peuples décimés.",
            "**Ce qu'il faut établir.** Qu'aucun de ces poèmes ne s'arrête à "
            "la plainte. La formule de l'auteur le dit : l'écrivain cherche "
            "« la vie qui vient après la mort, le jour qui vient après la "
            "nuit ». Vérifier sur les fins de poèmes : elles s'ouvrent presque "
            "toutes sur une aube, une paix, une parole.",
            "**La nuance à tenir.** Cette espérance n'efface pas la "
            "souffrance ; elle vient après elle. Un devoir qui ne garderait "
            "que l'optimisme trahirait le livre."
        ]),
    ],

    oral=[
        "**Ce qu'on demande.** Lire un poème court en entier, ou vingt versets "
        "d'un poème long, puis en rendre compte pendant cinq minutes : de quoi "
        "il parle, comment il est fait, ce qu'il produit.",

        "**Déroulement en quatre temps.** 1) L'élève lit à voix haute, sans "
        "commenter. 2) Il dit en une phrase de quoi parle le passage. 3) Il en "
        "donne les mouvements et s'arrête sur deux outils d'analyse, chacun "
        "cité puis nommé puis interprété. 4) Il répond à deux questions de la "
        "classe.",

        "**La lecture est déjà une analyse.** Dans un poème en versets, tout "
        "se joue au souffle : où l'on reprend, où l'on s'arrête, ce qu'on "
        "détache. Un élève qui lit « La paix, la paix, la paix… » sans marquer "
        "la reprise n'a pas vu l'anaphore. Un élève qui enchaîne un verset de "
        "trois mots sans silence en a perdu l'effet.",

        "**Barème indicatif sur 20.** Lecture : 5 · Sens du passage : 4 · "
        "Mouvements : 3 · Analyse de deux outils : 5 · Réponses aux "
        "questions : 3.",
    ],

    exposes=[
        "**Qu'est-ce qu'un balafon ?** Présenter l'instrument, sa facture, son "
        "usage. Terminer en montrant, sur un poème précis, en quoi le recueil "
        "en imite le jeu.",

        "**Marcinelle, 1956.** Raconter la catastrophe minière et dire qui "
        "étaient les victimes. Montrer ensuite ce que le poème garde de "
        "l'événement et ce qu'il en écarte.",

        "**New York, 1970 : les noms du poème.** Martin Luther King, Malcolm "
        "X, les Black Panthers, Armstrong. Qui étaient-ils ? Pourquoi le poème "
        "les cite-t-il ensemble ?",

        "**La Négritude, et ce que Mveng en fait.** Senghor, Césaire, Damas : "
        "le mouvement en dix minutes. Puis montrer sur un poème ce que Mveng "
        "en garde et ce qu'il déplace.",

        "**Un christianisme africain.** Mveng théologien et artiste : ce qu'il "
        "a écrit, ce qu'il a peint. Chercher dans le recueil les images qui "
        "font ce travail.",

        "**Le glossaire du recueil.** Relever vingt entrées, les classer "
        "(noms de lieux, de peuples, de personnes, mots bibliques), et dire ce "
        "que cette liste apprend du monde du poète.",

        "**Un motif d'un bout à l'autre.** Choisir un motif — les mains, l'or, "
        "l'aube, le tam-tam —, le suivre dans les seize poèmes, et montrer "
        "s'il garde ou change de valeur.",
    ],

    themes=[
        ["La fraternité universelle",
         "« À Kong-Fu-Tseu », « À Roland-Roger », « Moteczuma », « Lettre "
         "collective »."],
        ["L'affirmation africaine",
         "Tout le recueil ; particulièrement « New York » et « Mère »."],
        ["Le christianisme africain",
         "« Épiphanie », « Pentecôte sur l'Afrique », « Offrande »."],
        ["La souffrance des opprimés",
         "« Marcinelle, 1956 », « New York », « Moteczuma »."],
        ["L'espérance et l'aube",
         "Les fins de « Marcinelle », de « New York », d'« Offrande »."],
        ["La paix",
         "« New York » (le mot y revient comme un refrain), « Adamawa »."],
        ["La parole et le chant",
         "Le balafon, le tam-tam, le likembe : partout dans le recueil."],
        ["La terre natale",
         "« Adamawa », « Tu reviendras, Sénégal ! »."],
        ["La mère",
         "« Mère », « Postface », « Offrande »."],
    ],

    lexique_general=[
        ("A — Les mots du recueil", [
            ["Balafon", "instrument de musique africain, fait de lames de "
             "bois posées sur des calebasses."],
            ["Likembe", "petit instrument à lamelles métalliques, pincées "
             "avec les pouces."],
            ["Tam-tam", "tambour ; par extension, la parole qu'il porte."],
            ["Saré", "concession, ensemble d'habitations d'une même famille, "
             "dans le nord du Cameroun."],
            ["Adamaoua", "haut plateau du Cameroun, terre d'élevage."],
            ["Zébu", "bœuf à bosse des troupeaux sahéliens."],
            ["Matutinal", "du matin."],
            ["Béhémoth", "bête monstrueuse du livre de Job ; ici, la ville."],
            ["Plérôme", "en théologie, la plénitude divine."],
            ["Patène", "petit plat qui porte l'hostie."],
            ["Calice", "coupe de la messe ; aussi, la coupe de la "
             "souffrance."],
            ["Requiescant in pace", "« qu'ils reposent en paix », formule "
             "latine des funérailles."],
            ["Parturition", "accouchement."],
            ["Gemme", "pierre précieuse."],
        ]),
        ("B — Les mots pour parler d'un poème en versets", [
            ["Verset", "longue ligne libre, sans mètre fixe ni rime "
             "régulière."],
            ["Anaphore", "répétition d'un même mot en tête de plusieurs "
             "lignes."],
            ["Litanie", "suite de reprises, sur le modèle de la prière."],
            ["Apostrophe", "on s'adresse directement à quelqu'un."],
            ["Énumération", "liste de termes ; accumulation quand elle "
             "s'allonge."],
            ["Gradation", "suite de termes d'intensité croissante."],
            ["Hyperbole", "exagération qui grandit ce dont on parle."],
            ["Métaphore", "image sans outil de comparaison."],
            ["Symbole", "objet concret qui vaut pour une idée, dans tout le "
             "texte."],
            ["Registre", "la couleur d'un passage : lyrique, épique, sacré, "
             "pathétique."],
            ["Champ lexical", "ensemble de mots d'un même domaine."],
            ["Parallélisme", "deux lignes bâties sur le même moule."],
        ]),
    ],

    bibliographie=[
        "**Œuvre étudiée** — Engelbert MVENG, *Balafon*, 1972. Les citations "
        "de ce cahier suivent le texte du volume, glossaire compris.",

        "**Du même auteur** — *Histoire du Cameroun*, Présence Africaine, "
        "1963 ; *L'art d'Afrique noire*, Mame, 1964 ; *Dossier culturel "
        "panafricain*, Présence Africaine, 1966 ; *Art nègre, art chrétien*, "
        "Rome, 1969.",

        "**Pour situer le mouvement** — les textes de la Négritude : Senghor, "
        "Césaire, Damas.",

        "**Textes officiels** — MINESEC, *Programme de français du second "
        "cycle* ; MINESEC, *Guide pédagogique* 2019 ; OBC, grilles "
        "d'évaluation harmonisées.",

        "**Compagnon de ce cahier** — CENTRE VÉRITAS, *Balafon — manuel "
        "pédagogique d'étude de l'œuvre intégrale*, Douala (étude des seize "
        "poèmes en cinq étapes, avec texte et plan de commentaire pour "
        "chacun).",
    ],
)
