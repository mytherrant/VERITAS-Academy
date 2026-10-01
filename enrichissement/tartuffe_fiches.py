# -*- coding: utf-8 -*-
"""
Lectures méthodiques — « Tartuffe ou l'Imposteur », Molière (fiches 1 à 3).

Classe de seconde. Consigne de rédaction commune à tout le cahier : phrases
courtes, vocabulaire expliqué là où il apparaît, aucune notion employée avant
d'avoir été définie.

Les extraits ne sont pas recopiés ici : ils viennent de `tartuffe_extraits`,
module produit mécaniquement depuis l'édition numérique de la pièce. Un vers
retapé à la main est un vers faux, et c'est l'analyse qui s'écroule avec lui.
"""
import tartuffe_extraits as X

# ═════════════════════════════════════════════════════════════ FICHE 1
F1 = dict(
    titre="Fiche 1 — Cinq phrases commencées, aucune finie",
    repere=X.REPERES["E1"],
    extrait=X.E1,
    source=X.REFERENCES["E1"],
    objectif="Comprendre comment une scène d'ouverture peut présenter toute une famille, "
             "poser le conflit et imposer un personnage qui n'est pas encore entré.",
    situation=(
        "C'est le tout début de la pièce. Madame Pernelle, la mère d'Orgon, sort de la "
        "maison de son fils en colère. Toute la famille la suit pour la retenir : Elmire, "
        "sa belle-fille ; Damis et Mariane, ses petits-enfants ; Cléante, le frère "
        "d'Elmire ; Dorine, la servante. Personne n'a encore vu Tartuffe, et son nom "
        "n'est prononcé qu'au milieu de l'extrait."
    ),
    mouvements=[
        "**Le départ** (« Allons, Flipote, allons… ») : Madame Pernelle veut partir, Elmire "
        "essaie de la retenir.",
        "**Le tour de la famille** (« Vous êtes, mamie, une fille suivante… » jusqu'à "
        "« ce que j'ai sur le cœur ») : chacun reçoit son reproche, l'un après l'autre.",
        "**Le nom de Tartuffe** (« Votre monsieur Tartuffe est bien heureux sans doute… ») : "
        "le vrai sujet de la dispute apparaît enfin.",
        "**La révolte de Damis** (« Quoi ! je souffrirai, moi, qu'un cagot de critique… ») : "
        "la famille répond pour la première fois.",
    ],
    lexique=[
        ["ce ménage-ci", "cette maison, cette famille."],
        ["mal édifiée", "mécontente. On est « édifié » par le bon exemple."],
        ["la cour du roi Pétaut", "un endroit où tout le monde commande et où personne "
                                 "n'obéit. Expression toute faite."],
        ["mamie", "mon amie. Ici, c'est méprisant : on parle ainsi à une servante."],
        ["fille suivante", "servante attachée à une jeune fille de bonne famille."],
        ["forte en gueule", "qui parle trop fort et trop souvent."],
        ["un sot en trois lettres", "un sot, et rien d'autre — le mot « sot » a trois "
                                   "lettres. Manière d'insister."],
        ["sous chape", "en cachette."],
        ["un train", "une manière de vivre, une conduite."],
        ["ajustement", "vêtements, parure."],
        ["si j'étais de mon fils", "si j'étais à la place de mon fils."],
        ["maximes de vivre", "règles de conduite."],
        ["cagot", "faux dévot. Le mot est une insulte."],
        ["critique", "employé ici comme un nom : celui qui critique tout."],
        ["céans", "ici, dans cette maison."],
    ],
    axes=[
        ("Une exposition qui se fait toute seule",
         [
             "**Six personnages présentés en une seule dispute.** Une scène d'exposition "
             "doit faire connaître les personnages au spectateur. Molière ne les fait pas "
             "présenter par un serviteur, comme on le faisait souvent : il les fait "
             "insulter par une grand-mère. Chaque reproche apprend au spectateur qui est la "
             "personne visée.",
             "**Le reproche dit le rôle.** Dorine est « forte en gueule » : ce sera la "
             "servante qui ose parler. Damis est « un sot » et « un fou » : ce sera le fils "
             "violent. Mariane « fait la discrète » : ce sera la fille qui n'ose rien dire. "
             "Elmire est « dépensière » et « vêtue ainsi qu'une princesse » : ce sera la "
             "femme élégante. Cléante « prêche des maximes de vivre » : ce sera le sage.",
             "**Un personnage qui ne parle jamais.** Flipote, la servante de Madame "
             "Pernelle, est nommée au premier vers et ne dira pas un mot de toute la pièce. "
             "Elle sert à montrer, dès la première seconde, comment Madame Pernelle traite "
             "les gens : elle lui parle comme on siffle un chien.",
             "**Ce que le spectateur apprend sans qu'on le lui dise.** À la fin de "
             "l'extrait, il sait qui vit dans la maison, qui s'entend avec qui, et sur quoi "
             "porte la dispute. Aucun personnage n'a pourtant rien expliqué.",
         ]),
        ("Une parole confisquée",
         [
             "**Cinq personnages essaient de parler, cinq personnages sont coupés.** "
             "Dorine : « Si… ». Damis : « Mais… ». Mariane : « Je crois… ». Elmire : "
             "« Mais, ma mère… ». Cléante : « Mais, madame, après tout… ». Aucune de ces "
             "phrases n'est achevée.",
             "**Les points de suspension sont un procédé.** Ils marquent la phrase "
             "interrompue. Molière les emploie cinq fois de suite : ce n'est pas un hasard, "
             "c'est un mécanisme. La règle de la scène est simple — dans cette maison, on "
             "n'a pas le droit de finir sa phrase.",
             "**Le mot « Mais » revient six fois.** Il ouvre la plupart des tentatives de "
             "réponse. Un seul mot suffit donc à faire entendre que toute la famille "
             "objecte, et qu'aucune objection ne passe.",
             "**Le vers, lui aussi, est partagé.** « Si… » et « Vous êtes, mamie, une fille "
             "suivante » forment ensemble un seul alexandrin de douze syllabes. Il en va de "
             "même pour les quatre autres interruptions. Le vers est donc coupé en deux "
             "exactement comme la parole : la forme fait ce que la scène raconte.",
         ]),
        ("Un absent qui commande déjà",
         [
             "**Tartuffe est nommé au moment précis où une phrase aboutit.** Damis est le "
             "seul à prononcer un vers entier : « Votre monsieur Tartuffe est bien heureux "
             "sans doute… ». C'est aussi le premier vers où le nom apparaît. Le nom et la "
             "phrase complète arrivent ensemble.",
             "**Le possessif « votre monsieur Tartuffe » est une attaque.** Damis ne dit pas "
             "« Tartuffe » mais « votre monsieur Tartuffe » : il le rend à Madame Pernelle, "
             "comme un objet qui lui appartient. Le mot « monsieur » sonne ici comme une "
             "moquerie.",
             "**La réponse est une définition.** « C'est un homme de bien qu'il faut que "
             "l'on écoute. » Madame Pernelle croit décrire Tartuffe ; en réalité elle donne "
             "au spectateur la thèse que toute la pièce va démonter. L'expression « homme de "
             "bien » reviendra dans la bouche de Tartuffe lui-même, à l'acte III, pour dire "
             "exactement le contraire.",
             "**Un pouvoir déjà installé.** Damis emploie les mots « usurper », « pouvoir "
             "tyrannique », « n'y daigne consentir ». Ce sont des mots de politique, pas de "
             "famille. Un étranger commande dans une maison qui n'est pas la sienne : c'est "
             "le sujet de la pièce, et il est posé avant l'entrée du personnage.",
         ]),
    ],
    forme=[
        "**La stichomythie** — l'échange de répliques très courtes. Ici, elle est "
        "déséquilibrée : les répliques courtes sont toutes du même côté, celui de la "
        "famille, et les longues du côté de Madame Pernelle.",
        "**Les apostrophes** — « ma bru », « mamie », « mon fils », « sa sœur », « monsieur "
        "son frère ». Madame Pernelle nomme chaque personne par sa place dans la famille, "
        "jamais par son prénom. Elle parle en chef, pas en grand-mère.",
        "**L'impératif et le présent** — « Allons », « Laissez », « ne venez pas ». Le mode "
        "impératif sert à ordonner. Le présent donne l'impression que la scène se déroule "
        "sous nos yeux, sans préparation.",
        "**Le proverbe** — « il n'est, comme on dit, pire eau que l'eau qui dort ». "
        "L'incise « comme on dit » avoue que la formule est empruntée. Madame Pernelle ne "
        "juge pas : elle récite.",
        "**Les rimes plates** — les vers riment deux par deux. C'est la rime de la comédie "
        "et de la tragédie classiques. Elle fait entendre que la dispute, si vive soit-elle, "
        "reste tenue par une forme très régulière.",
    ],
    plan=[
        ("Introduction",
         "Tartuffe, comédie en cinq actes et en vers, est créée par Molière en 1664. La "
         "pièce s'ouvre sur une famille qui court après une vieille dame en colère. En "
         "quelques dizaines de vers, le spectateur apprend le nom de chacun, la nature du "
         "conflit et l'existence d'un personnage qui n'est pas encore là. On montrera "
         "comment cette scène d'exposition installe le pouvoir de Tartuffe avant même son "
         "entrée."),
        ("I. Une famille présentée par les reproches qu'elle reçoit",
         [
             "A. Six personnages nommés et caractérisés dans une seule dispute.",
             "B. Chaque défaut reproché annonce le rôle que le personnage tiendra.",
             "C. Flipote, la servante muette : la manière de traiter les gens, montrée et "
             "non expliquée.",
         ]),
        ("II. Une parole que personne ne peut finir",
         [
             "A. Cinq phrases interrompues, marquées par les points de suspension.",
             "B. « Mais » six fois : l'objection permanente et toujours coupée.",
             "C. L'alexandrin partagé entre deux voix : la forme du vers reproduit la "
             "coupure.",
         ]),
        ("III. Un absent qui occupe déjà la maison",
         [
             "A. Le nom de Tartuffe arrive avec la première phrase complète.",
             "B. « Votre monsieur Tartuffe » : le possessif et l'ironie.",
             "C. « Usurper », « pouvoir tyrannique » : le vocabulaire politique dans une "
             "scène de famille.",
         ]),
        ("Conclusion",
         "Cette exposition ne présente pas Tartuffe : elle présente son pouvoir. Le "
         "spectateur devra attendre l'acte III pour le voir paraître, et il aura passé deux "
         "actes entiers à l'entendre nommer. Molière obtient ainsi qu'une entrée en scène "
         "soit attendue comme un événement."),
    ],
    comprendre=[
        "Qui sont les personnages présents sur scène ? Faites la liste et indiquez le lien "
        "de chacun avec Orgon.",
        "Pourquoi Madame Pernelle veut-elle quitter la maison ? Citez le vers qui le dit.",
        "Quel personnage prononce le nom de Tartuffe pour la première fois, et pour en dire "
        "quoi ?",
    ],
    analyser=[
        "a) Relevez les cinq répliques interrompues. b) Quel signe de ponctuation marque "
        "l'interruption ? c) Que produit sa répétition ?",
        "a) Relevez les mots par lesquels Madame Pernelle appelle chaque personne. b) Que "
        "remarquez-vous ? c) Qu'est-ce que cela apprend sur elle ?",
        "« Quoi ! je souffrirai, moi, qu'un cagot de critique / Vienne usurper céans un "
        "pouvoir tyrannique ». a) À quel domaine appartiennent les mots « usurper » et "
        "« tyrannique » ? b) Pourquoi ce vocabulaire surprend-il dans une scène de famille ?",
    ],
    parcours1=[
        "a) Relevez tous les défauts que Madame Pernelle reproche à la famille.",
        "b) Classez-les dans un tableau à deux colonnes : le personnage / le reproche.",
    ],
    parcours2=[
        "a) Montrez que les cinq interruptions forment un système, et non cinq accidents.",
        "b) Expliquez pourquoi c'est la réplique où Tartuffe est nommé qui échappe à ce "
        "système. Que gagne Molière à cette exception ?",
    ],
    synthese="Pourquoi Molière choisit-il de faire commencer sa pièce par une dispute, "
             "plutôt que par une explication ?",
    examen="**Vers le commentaire composé.** Rédigez entièrement l'axe II du plan "
           "ci-dessus, en deux paragraphes. Chaque paragraphe contiendra au moins deux "
           "citations courtes, chacune suivie du nom du procédé et de son effet.",
    ouverture="À rapprocher de la fiche 6 : la pièce s'achèvera elle aussi sur une parole "
              "coupée, mais ce sera Orgon que l'on empêchera de parler, et ce sera pour son "
              "bien.",
    encadres=[
        ("methode", "Reconnaître une scène d'exposition", [
            "Une scène d'exposition doit répondre à quatre questions. Vérifiez-les une par "
            "une sur le texte :",
            "- **Qui ?** Les personnages, leurs liens, leur rang. Ici : une famille et sa "
            "servante.",
            "- **Où et quand ?** Ici : chez Orgon, à Paris, au moment où sa mère s'en va.",
            "- **Quel problème ?** Ce qui va faire la pièce. Ici : un étranger commande "
            "dans la maison.",
            "- **Quel ton ?** Comique, tragique, sérieux. Ici : on rit, mais de choses "
            "graves.",
            "Une exposition réussie répond aux quatre questions sans qu'aucun personnage "
            "n'ait l'air de renseigner le spectateur.",
        ]),
        ("saviez", "Une pièce interdite pendant cinq ans", [
            "Le Tartuffe est joué pour la première fois en mai 1664, à Versailles, devant "
            "Louis XIV. Le roi rit. Mais un groupe de dévots très puissants proteste "
            "aussitôt, et la pièce est interdite en public.",
            "Molière écrit alors au roi trois lettres, appelées « placets », pour se "
            "défendre. Il y répète qu'il n'attaque pas la religion mais ceux qui s'en "
            "servent. Il faut attendre février 1669 — près de cinq ans — pour que la pièce "
            "soit enfin autorisée. Elle fait aussitôt un triomphe.",
        ]),
    ],
)


# ═════════════════════════════════════════════════════════════ FICHE 2
F2 = dict(
    titre="Fiche 2 — « Et Tartuffe ? — Le pauvre homme ! »",
    repere=X.REPERES["E2"],
    extrait=X.E2,
    source=X.REFERENCES["E2"],
    objectif="Étudier une scène entièrement construite sur la répétition, et comprendre "
             "comment quatre mots répétés suffisent à peindre un aveuglement.",
    situation=(
        "Orgon rentre de la campagne après deux jours d'absence. Il n'a pas encore paru "
        "sur scène : c'est sa première apparition. Il retrouve son beau-frère Cléante et "
        "la servante Dorine. Sa femme Elmire a été malade pendant son absence. Orgon "
        "demande des nouvelles de la maison."
    ),
    mouvements=[
        "**L'arrivée** (« Ah ! mon frère, bonjour. ») : Orgon salue Cléante, puis le fait "
        "attendre pour interroger la servante.",
        "**Les quatre échanges** (« Madame eut, avant-hier, la fièvre… » jusqu'à « quatre "
        "grands coups de vin ») : quatre fois la même mécanique, de plus en plus grosse.",
        "**La sortie de Dorine** (« Tous deux se portent bien enfin… ») : une dernière "
        "phrase ironique, et elle s'en va.",
    ],
    lexique=[
        ["souffrir", "ici : accepter, permettre."],
        ["céans", "ici, dans cette maison."],
        ["vermeille", "d'un beau rouge. « La bouche vermeille » est la bouche d'un homme en "
                      "pleine santé."],
        ["dégoût", "ici : perte de l'appétit."],
        ["encor", "encore. On écrit ainsi pour que le vers ait douze syllabes."],
        ["perdrix", "oiseau que l'on mange. C'est un plat de riche."],
        ["gigot en hachis", "viande de mouton hachée."],
        ["dévotement", "avec beaucoup de piété. Le mot est ici comique : on ne mange pas "
                       "« dévotement »."],
        ["la paupière", "ici : le sommeil. « Sans fermer la paupière » veut dire sans "
                        "dormir."],
        ["la saignée", "soin qui consistait à faire couler un peu de sang du malade. On "
                       "croyait que cela guérissait."],
        ["convalescence", "période où l'on se remet d'une maladie."],
    ],
    axes=[
        ("Une mécanique réglée comme une horloge",
         [
             "**Quatre fois la même question, quatre fois la même réponse.** Orgon demande "
             "« Et Tartuffe ? » quatre fois. Il s'exclame « Le pauvre homme ! » quatre fois. "
             "Entre les deux, Dorine raconte à chaque fois le malheur d'Elmire, puis le "
             "confort de Tartuffe.",
             "**Le rythme est celui d'un balancier.** Chaque tour comporte trois temps : le "
             "mal d'Elmire, la question d'Orgon, le bien-être de Tartuffe. Le spectateur "
             "apprend le mécanisme au premier tour, l'attend au deuxième, et rit dès le "
             "troisième parce qu'il l'a prévu.",
             "**La gradation.** Les malheurs d'Elmire s'aggravent : la fièvre, puis "
             "l'impossibilité de manger, puis la nuit blanche, puis la saignée. Les plaisirs "
             "de Tartuffe grossissent en même temps : il se porte bien, il mange deux "
             "perdrix, il dort tout son soûl, il boit quatre grands verres de vin. Les deux "
             "courbes s'éloignent l'une de l'autre à chaque tour.",
             "**La quatrième réponse est la plus forte.** Tartuffe boit « pour réparer le "
             "sang qu'avait perdu madame ». Boire du vin pour remplacer le sang d'une autre "
             "personne n'a aucun sens : c'est le sommet de l'absurde, et Molière l'a gardé "
             "pour la fin.",
         ]),
        ("Une servante qui ne dit jamais ce qu'elle pense",
         [
             "**Dorine ne juge pas : elle raconte.** Pas une seule fois elle ne dit que "
             "Tartuffe est un profiteur. Elle se contente d'énumérer ce qu'il a mangé, bu et "
             "dormi. C'est le spectateur qui conclut.",
             "**C'est de l'ironie.** L'ironie consiste à faire entendre le contraire de ce "
             "qu'on dit, ou à laisser voir un jugement sans le prononcer. « Il se porte à "
             "merveille, / Gros et gras, le teint frais et la bouche vermeille » : ces mots "
             "sont des compliments, et pourtant ils accusent.",
             "**Les détails chiffrés sont des preuves.** « Deux perdrix », « une moitié de "
             "gigot », « quatre grands coups de vin ». Le chiffre est ce qui donne à un "
             "récit son air de vérité. Dorine parle comme un témoin, pas comme une "
             "accusatrice.",
             "**Le mot « dévotement » fait tout le travail.** « Et fort dévotement il mangea "
             "deux perdrix » : un adverbe de religion collé à un verbe de gourmandise. Ce "
             "seul rapprochement dit ce qu'est Tartuffe, sans qu'aucun personnage ait à le "
             "dire.",
         ]),
        ("Un aveuglement qui se voit à quatre mots",
         [
             "**Orgon ne pose qu'une question, toujours la même.** Sa femme a eu la fièvre, "
             "un mal de tête, une nuit blanche et une saignée : il ne demande jamais comment "
             "elle va. Il demande quatre fois comment va Tartuffe. Le silence sur Elmire est "
             "plus parlant que ses paroles.",
             "**« Le pauvre homme ! » est une réplique fausse.** Elle exprime la pitié ; "
             "elle est prononcée devant le récit d'un homme qui mange, dort et boit. L'écart "
             "entre ce qui est dit et ce qui vient d'être raconté est ce qui fait rire.",
             "**C'est un comique de caractère.** On ne rit pas d'une situation ni d'un mot "
             "d'esprit : on rit d'un défaut de personnage, l'aveuglement d'Orgon. Ce défaut "
             "conduira la pièce jusqu'au bord de la catastrophe.",
             "**Le spectateur en sait plus que le personnage.** Il a entendu Dorine, il voit "
             "ce qu'Orgon ne voit pas. On appelle cela l'ironie dramatique. Elle produit le "
             "rire ici ; à l'acte IV, elle produira l'angoisse, quand Orgon sera caché sous "
             "la table.",
         ]),
    ],
    forme=[
        "**La répétition** — quatre « Et Tartuffe ? », quatre « Le pauvre homme ! ». La "
        "répétition d'une formule courte revenant à place fixe fonctionne comme un refrain. "
        "Ici, elle sert de mesure : le spectateur compte les tours.",
        "**La stichomythie** — les répliques d'Orgon tiennent en trois ou quatre mots, "
        "celles de Dorine en quatre vers. Ce déséquilibre est constant, et il donne à la "
        "servante toute la parole.",
        "**Le vers partagé** — « Et Tartuffe ? » ne remplit pas un vers à lui seul : la "
        "réponse de Dorine le complète. Question et réponse forment un seul alexandrin. Les "
        "deux personnages sont donc enfermés dans la même mesure.",
        "**L'antithèse** — chaque tour oppose deux corps : celui d'Elmire, qui souffre, et "
        "celui de Tartuffe, qui se régale. L'antithèse est une figure qui met deux idées "
        "contraires côte à côte.",
        "**L'hyperbole finale** — « quatre grands coups de vin » après « le sang qu'avait "
        "perdu madame ». L'hyperbole exagère pour frapper. Ici, elle achève de rendre "
        "Tartuffe grotesque.",
    ],
    plan=[
        ("Introduction",
         "À l'acte I de Tartuffe, Molière fait entrer en scène Orgon, le maître de maison, "
         "qui rentre après deux jours d'absence. Il interroge sa servante Dorine sur ce qui "
         "s'est passé chez lui. Toute la scène tient en quatre échanges identiques. On "
         "montrera comment cette mécanique de répétition suffit à peindre un homme aveugle, "
         "et comment le rire naît ici d'un silence plutôt que d'un mot d'esprit."),
        ("I. Une mécanique de répétition",
         [
             "A. Quatre tours identiques : le mal d'Elmire, la question, le bien de Tartuffe.",
             "B. Une double gradation : les malheurs s'aggravent, les plaisirs grossissent.",
             "C. Le vers partagé entre les deux personnages : la forme enferme le dialogue.",
         ]),
        ("II. Une accusation qui ne s'énonce jamais",
         [
             "A. Dorine énumère et ne juge pas : le rôle du détail chiffré.",
             "B. L'adverbe « dévotement » accolé à la gourmandise.",
             "C. Une ironie qui laisse au spectateur le soin de conclure.",
         ]),
        ("III. Le portrait d'un aveugle",
         [
             "A. Quatre questions sur Tartuffe, aucune sur sa femme malade.",
             "B. « Le pauvre homme ! » : une pitié adressée à celui qui n'en a pas besoin.",
             "C. Un comique de caractère, qui deviendra le ressort de toute la pièce.",
         ]),
        ("Conclusion",
         "Molière obtient en une seule scène ce qu'un long discours n'aurait pas obtenu : "
         "le spectateur ne croit pas qu'Orgon est aveugle, il le voit. La scène est célèbre "
         "parce qu'elle démontre au lieu d'affirmer. On la comparera utilement à la scène de "
         "la table, à l'acte IV, où le même Orgon devra enfin voir de ses propres yeux."),
    ],
    comprendre=[
        "D'où revient Orgon, et depuis combien de temps était-il parti ?",
        "Quels sont, dans l'ordre, les quatre malheurs d'Elmire rapportés par Dorine ?",
        "Que fait Tartuffe pendant ce temps ? Répondez en citant le texte.",
    ],
    analyser=[
        "a) Combien de fois Orgon demande-t-il « Et Tartuffe ? » ? b) Combien de fois "
        "s'exclame-t-il « Le pauvre homme ! » ? c) Que produit cette répétition sur le "
        "spectateur, au troisième et au quatrième tour ?",
        "« Et fort dévotement il mangea deux perdrix. » a) À quel domaine appartient "
        "l'adverbe « dévotement » ? b) À quel domaine appartient le verbe « manger » ? "
        "c) Quel effet produit leur rencontre ?",
        "Orgon ne demande pas une seule fois comment va sa femme. a) Relevez les quatre "
        "informations qu'il reçoit pourtant sur elle. b) Que révèle ce silence ?",
    ],
    parcours1=[
        "a) Recopiez un tableau à deux colonnes — « ce que subit Elmire » / « ce que fait "
        "Tartuffe » — et complétez-le pour les quatre tours.",
        "b) En une phrase, dites ce que ce tableau montre.",
    ],
    parcours2=[
        "a) Montrez que la scène est construite comme une gradation, et non comme une "
        "simple répétition.",
        "b) Expliquez pourquoi la dernière réponse de Dorine — le vin bu « pour réparer le "
        "sang » — ne pouvait pas être placée ailleurs que dans le dernier tour.",
    ],
    synthese="Le rire, dans cette scène, vient-il de ce que Dorine dit ou de ce qu'Orgon ne "
             "comprend pas ?",
    examen="**Vers le commentaire composé.** Rédigez l'introduction complète du commentaire "
           "de ce texte : situation du passage, problématique en une phrase, annonce des "
           "trois axes. Douze lignes au maximum.",
    ouverture="À rapprocher de la fiche 5 : Orgon, qui refuse ici d'entendre, devra "
              "s'enfermer sous une table pour accepter enfin de voir.",
    encadres=[
        ("astuce", "Ne pas confondre les trois comiques", [
            "- **Comique de mots** : on rit de ce qui est dit. Un jeu de mots, une "
            "exagération, un mot mal employé.",
            "- **Comique de situation** : on rit de la position où sont les personnages. Un "
            "homme caché qui entend ce qu'il ne devrait pas entendre.",
            "- **Comique de caractère** : on rit d'un défaut du personnage. L'avarice, la "
            "jalousie, l'aveuglement.",
            "Dans cette scène, les trois se rencontrent, mais c'est le comique de caractère "
            "qui domine : ce qui fait rire, c'est Orgon lui-même. Dites-le en ces termes "
            "dans un devoir, et justifiez toujours par une citation.",
        ]),
        ("vigilance", "« Le pauvre homme ! » : de qui parle-t-on ?", [
            "L'erreur la plus fréquente en devoir consiste à croire qu'Orgon plaint sa "
            "femme. Relisez : il vient d'entendre parler de Tartuffe, et c'est de Tartuffe "
            "qu'il parle.",
            "Cette erreur détruit toute l'analyse, car c'est précisément le déplacement de "
            "la pitié — d'Elmire vers Tartuffe — qui fait la scène. Vérifiez toujours à qui "
            "renvoie un pronom ou un groupe nominal avant de bâtir un paragraphe dessus.",
        ]),
    ],
)


# ═════════════════════════════════════════════════════════════ FICHE 3
F3 = dict(
    titre="Fiche 3 — Une entrée en scène préparée pendant deux actes",
    repere=X.REPERES["E3"],
    extrait=X.E3,
    source=X.REFERENCES["E3"],
    objectif="Analyser la première apparition d'un personnage attendu depuis le début de "
             "la pièce, et voir comment quelques vers suffisent à le démasquer.",
    situation=(
        "Nous sommes au troisième acte sur cinq. Tartuffe a été nommé, discuté, défendu et "
        "attaqué pendant deux actes entiers, mais il n'a jamais paru. Dorine vient le "
        "chercher : Elmire souhaite lui parler seule. C'est la première fois que le "
        "spectateur le voit."
    ),
    mouvements=[
        "**L'ordre à Laurent** (« Laurent, serrez ma haire… ») : Tartuffe parle à un valet "
        "que personne ne voit, en sachant que Dorine l'entend.",
        "**Le mouchoir** (« prenez-moi ce mouchoir… ») : Tartuffe veut couvrir la poitrine "
        "de Dorine.",
        "**La riposte de Dorine** (« Vous êtes donc bien tendre à la tentation… ») : la "
        "servante retourne l'argument contre celui qui l'emploie.",
        "**Le changement de ton** (« Madame va venir… ») : Tartuffe se radoucit dès qu'il "
        "entend le nom d'Elmire.",
        "**Le salut à Elmire** (« Que le ciel à jamais… ») : la piété revient, en public.",
    ],
    lexique=[
        ["serrez", "rangez, mettez de côté."],
        ["la haire", "chemise rugueuse portée sur la peau pour se faire souffrir, par "
                     "piété."],
        ["la discipline", "petit fouet dont les dévots se servaient pour se punir "
                          "eux-mêmes."],
        ["les deniers", "l'argent."],
        ["l'aumône", "argent donné aux pauvres."],
        ["affectation", "manière de faire semblant, de se donner un air."],
        ["forfanterie", "vantardise."],
        ["la chair", "le corps, par opposition à l'âme. Mot de religion."],
        ["convoiter", "désirer avec avidité ce qui appartient à un autre."],
        ["prompte", "rapide."],
        ["quitter la partie", "abandonner, s'en aller."],
        ["la salle basse", "la pièce du bas, au rez-de-chaussée."],
        ["la grâce", "ici : la faveur, la permission."],
        ["en soi-même", "à part soi, sans être entendu des autres. C'est un aparté."],
    ],
    axes=[
        ("Une entrée qui est déjà une comédie",
         [
             "**Tartuffe se met en scène.** Il ne dit pas bonjour : il donne un ordre à un "
             "valet nommé Laurent, que le spectateur ne verra jamais. Cet ordre concerne "
             "deux objets de pénitence, la haire et la discipline. Tartuffe annonce donc "
             "qu'il se fait souffrir pour Dieu — au moment exact où il aperçoit un témoin.",
             "**La didascalie donne la clé.** « apercevant Dorine ». Molière a pris soin "
             "d'écrire que Tartuffe voit la servante avant de parler. Sans cette "
             "indication, on pourrait le croire sincère. Avec elle, tout ce qu'il dit "
             "devient un spectacle destiné à quelqu'un.",
             "**L'aumône est annoncée, jamais faite.** « Si l'on vient pour me voir, je vais "
             "aux prisonniers / Des aumônes que j'ai partager les deniers. » Tartuffe déclare "
             "une bonne action à venir. Le spectateur ne le verra jamais l'accomplir. "
             "Annoncer le bien qu'on va faire est déjà une manière de ne pas le faire.",
             "**Dorine résume la scène en un vers.** « Que d'affectation et de "
             "forfanterie ! » Deux mots suffisent : l'un dit qu'il fait semblant, l'autre "
             "qu'il se vante. La servante nomme le procédé au moment où le spectateur le "
             "découvre.",
         ]),
        ("Deux vers qui démasquent un homme",
         [
             "**« Couvrez ce sein que je ne saurais voir. »** C'est le vers le plus connu de "
             "la pièce. Tartuffe demande à Dorine de se couvrir, et présente cela comme une "
             "exigence de pudeur.",
             "**Le raisonnement se retourne tout seul.** « Par de pareils objets les âmes "
             "sont blessées, / Et cela fait venir de coupables pensées. » Tartuffe affirme "
             "que la vue du corps produit de mauvaises pensées. Mais il est le seul, sur "
             "scène, à avoir regardé. Il décrit donc ce qui se passe en lui, en le "
             "présentant comme une loi générale.",
             "**Dorine attaque exactement ce point.** « Vous êtes donc bien tendre à la "
             "tentation, / Et la chair sur vos sens fait grande impression ! » Le connecteur "
             "« donc » indique une conclusion tirée de ce que l'autre vient de dire. La "
             "servante ne conteste pas la morale de Tartuffe : elle en tire la conséquence "
             "qui l'accuse.",
             "**Elle va jusqu'au bout de la démonstration.** « Et je vous verrais nu du haut "
             "jusques en bas / Que toute votre peau ne me tenterait pas. » En se donnant "
             "elle-même comme contre-exemple, Dorine prouve que la tentation n'est pas dans "
             "l'objet regardé, mais dans celui qui regarde.",
         ]),
        ("Un homme qui change de voix selon son public",
         [
             "**Le ton sec avec la servante.** « Mettez dans vos discours un peu de "
             "modestie, / Ou je vais sur-le-champ vous quitter la partie. » C'est une "
             "menace. Aucune humilité, aucune formule pieuse : Tartuffe parle en maître à "
             "quelqu'un qui ne lui sert à rien.",
             "**Le revirement au nom d'Elmire.** « Hélas ! très volontiers. » Trois mots, et "
             "l'homme est un autre. L'interjection « hélas » appartient au langage de la "
             "plainte pieuse ; elle n'a ici aucune raison d'être, sinon l'habitude du rôle.",
             "**Dorine le note pour le spectateur.** « Comme il se radoucit ! » La réplique "
             "est un aparté : elle est dite à part soi, sans que l'autre l'entende. Molière "
             "s'assure ainsi que personne dans la salle ne manque le changement.",
             "**La preuve par le salut à Elmire.** « Que le ciel à jamais, par sa toute "
             "bonté, / Et de l'âme et du corps vous donne la santé. » Quatre vers de "
             "bénédiction, où Tartuffe se nomme « le plus humble de ceux que son amour "
             "inspire ». Le même homme vient de menacer une servante. Le spectateur peut "
             "comparer, parce que Molière a mis les deux moments l'un contre l'autre.",
         ]),
    ],
    forme=[
        "**La didascalie** — « apercevant Dorine », « il tire un mouchoir de sa poche », "
        "« en soi-même ». Ces indications ne sont pas dites : elles s'adressent au metteur "
        "en scène et au lecteur. Ici, elles font l'essentiel de la démonstration.",
        "**L'aparté** — une réplique que les autres personnages ne sont pas censés entendre. "
        "« Comme il se radoucit ! » relie directement Dorine au public : c'est la double "
        "énonciation du théâtre, un personnage parle à un autre et l'auteur parle au "
        "spectateur.",
        "**Le connecteur logique « donc »** — il transforme la réplique de Dorine en "
        "raisonnement. Repérer les connecteurs est le moyen le plus sûr de suivre un "
        "argument dans un dialogue.",
        "**Le champ lexical de la religion** — « le ciel », « illumine », « aumônes », "
        "« âmes », « coupables pensées », « bonté », « amour ». Il est constamment employé "
        "par Tartuffe, et par lui seul. Un champ lexical est l'ensemble des mots d'un texte "
        "qui parlent du même sujet.",
        "**Le contraste de registre** — la menace (« je vais sur-le-champ vous quitter la "
        "partie ») et la bénédiction (« Que le ciel à jamais… ») sont séparées par quelques "
        "vers seulement. Le rapprochement est l'argument.",
    ],
    plan=[
        ("Introduction",
         "Molière fait attendre son personnage principal pendant deux actes entiers. "
         "Tartuffe n'entre qu'à l'acte III, et sa première réplique n'est pas adressée à "
         "quelqu'un qui est là, mais à un valet invisible. On montrera comment cette entrée "
         "en scène démasque le personnage avant même qu'il ait rencontré ceux qu'il "
         "trompe."),
        ("I. Une entrée préparée et jouée",
         [
             "A. Un ordre donné à un absent, en présence d'un témoin.",
             "B. La didascalie « apercevant Dorine » : la clé de lecture donnée par "
             "l'auteur.",
             "C. Une bonne action annoncée et jamais accomplie.",
         ]),
        ("II. Deux vers qui se retournent contre celui qui les dit",
         [
             "A. « Couvrez ce sein que je ne saurais voir » : la pudeur invoquée.",
             "B. Le raisonnement de Tartuffe décrit son propre désir sous forme de loi.",
             "C. La riposte de Dorine : le « donc » qui conclut à sa place.",
         ]),
        ("III. Deux voix pour deux publics",
         [
             "A. La menace adressée à la servante.",
             "B. « Hélas ! très volontiers » : le revirement au nom d'Elmire.",
             "C. La bénédiction à Elmire, mise en regard de la menace.",
         ]),
        ("Conclusion",
         "Le spectateur sait désormais à quoi s'en tenir, et il le sait avant Orgon. Tout "
         "le reste de la pièce consistera à attendre que le maître de maison voie ce que la "
         "servante a compris en quelques vers. Le retard d'Orgon sur le public est le "
         "véritable ressort de la comédie."),
    ],
    comprendre=[
        "À quel acte Tartuffe paraît-il pour la première fois ? Combien d'actes le "
        "spectateur a-t-il attendus ?",
        "À qui Tartuffe adresse-t-il sa première réplique ? Ce personnage est-il sur scène ?",
        "Pourquoi Dorine est-elle venue trouver Tartuffe ?",
    ],
    analyser=[
        "a) Relevez les trois didascalies de l'extrait. b) Pour chacune, dites ce qu'elle "
        "apprend au spectateur et que les paroles ne disent pas.",
        "« Couvrez ce sein que je ne saurais voir. » a) Quel sentiment Tartuffe prétend-il "
        "éprouver ? b) Que prouve en réalité cette demande ? c) Comment Dorine le "
        "démontre-t-elle ?",
        "a) Relevez tous les mots appartenant au champ lexical de la religion. b) Qui les "
        "emploie ? c) Que devient ce champ lexical dans la réplique « Mettez dans vos "
        "discours un peu de modestie » ?",
    ],
    parcours1=[
        "a) Relevez ce que Tartuffe dit à Dorine, puis ce qu'il dit à Elmire.",
        "b) En une phrase, dites ce qui change.",
    ],
    parcours2=[
        "a) Montrez que la réplique de Dorine « Vous êtes donc bien tendre à la tentation » "
        "est un raisonnement, et non une insulte.",
        "b) Expliquez pourquoi ce raisonnement est plus efficace, contre Tartuffe, qu'une "
        "accusation directe.",
    ],
    synthese="Pourquoi Molière attend-il l'acte III pour faire entrer le personnage qui "
             "donne son nom à la pièce ?",
    examen="**Vers le commentaire composé.** Rédigez entièrement l'axe I du plan ci-dessus, "
           "en trois paragraphes. Chaque paragraphe s'appuiera sur une citation et sur une "
           "didascalie.",
    ouverture="À rapprocher de la fiche 4 : Tartuffe y emploiera la même méthode — se dire "
              "coupable pour être cru innocent — mais devant Orgon, et le résultat sera tout "
              "autre.",
    encadres=[
        ("methode", "Lire une didascalie", [
            "Une didascalie est une indication écrite par l'auteur, qui n'est pas prononcée "
            "sur scène. On la reconnaît à l'italique.",
            "- **Didascalie d'entrée et de sortie** : qui est là. Exemple : « Tartuffe, "
            "Laurent, Dorine. »",
            "- **Didascalie de geste** : ce que fait le personnage. Exemple : « il tire un "
            "mouchoir de sa poche ».",
            "- **Didascalie de destinataire** : à qui l'on parle. Exemple : « à Cléante », "
            "« à son fils ».",
            "- **Didascalie de ton** : comment on parle. Exemple : « en soi-même ».",
            "Dans un devoir, citez la didascalie comme vous citeriez un vers, entre "
            "guillemets, et dites toujours ce qu'elle ajoute au texte parlé.",
        ]),
        ("saviez", "La haire et la discipline", [
            "La haire est une chemise faite de crin ou de poil de chèvre, portée à même la "
            "peau pour qu'elle gratte. La discipline est un petit fouet à plusieurs "
            "lanières. Les deux servaient à se punir soi-même, par piété.",
            "Ces objets existaient réellement au XVIIᵉ siècle, et de vrais dévots les "
            "employaient. Molière ne se moque donc pas d'un usage inventé : il montre un "
            "homme qui parle très fort d'objets que les gens sincères, eux, cachaient.",
        ]),
    ],
)

FICHES_TA_1_3 = [F1, F2, F3]
