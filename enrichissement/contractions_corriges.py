# -*- coding: utf-8 -*-
"""
Corrigés du sujet I (contraction + discussion) pour les supports verbatim.

Un corrigé par cahier, au format des corrigés nationaux : thème, thèse,
structure paragraphe par paragraphe, proposition de contraction, éléments
attendus dans la discussion, puis grille OBC.
"""

GRILLE = [
    ["Critère", "Indicateurs", "Points"],
    ["C1 — Compréhension / Pertinence",
     "Le candidat reçoit 6 pts : si la contraction restitue la thèse et l'enchaînement des "
     "étapes sans contresens, et si la discussion traite effectivement la question posée en "
     "s'appuyant sur l'œuvre. 4 pts : si une étape est omise ou si la discussion dérive vers "
     "un exposé général. 2 pts : si le texte est paraphrasé sans hiérarchie. 0 pt : si le "
     "propos est hors sujet.",
     "6"],
    ["C2 — Organisation / Cohérence",
     "Le candidat reçoit 6 pts : si la contraction respecte l'ordre des idées et les liens "
     "logiques, et si la discussion est structurée (thèse, antithèse, position personnelle) "
     "avec transitions. 4 pts : si le plan est perceptible mais sans transitions. 2 pts : si "
     "les idées sont juxtaposées sans progression.",
     "6"],
    ["C3 — Expression / Correction de la langue",
     "Le candidat reçoit 6 pts : si la reformulation est personnelle, la syntaxe correcte, le "
     "lexique précis, et si le nombre de mots est indiqué et respecté (± 10 %). 4 pts : si "
     "quelques phrases sont recopiées ou si l'écart de longueur dépasse la marge. 2 pts : si "
     "les fautes gênent la lecture.",
     "6"],
    ["C4 — Originalité de la production",
     "Le candidat reçoit 2 pts : si la discussion mobilise des exemples littéraires précis et "
     "personnels, ou propose une nuance non prévue au corrigé. 1 pt : si les exemples sont "
     "exacts mais attendus. 0 pt : si aucun exemple n'est fourni.",
     "2"],
    ["**Total**", "", "**20**"],
]

CLOTURE = ("NB — Tous les éléments pertinents non prévus dans cette grille que le candidat "
           "aura ajoutés seront pris en compte. On restera ouvert à toute autre "
           "interprétation pertinente.")


# ═══════════════════════════════════════════════ LE VIEUX NÈGRE ET LA MÉDAILLE
VIEUXNEGRE = dict(
    theme="La parade coloniale dans Le vieux nègre et la médaille : un dispositif de "
          "domination que le dénouement retourne en dérision.",
    these="Oyono construit son roman sur deux scènes de parade qui se répondent : la première "
          "expose l'impuissance absolue du colonisé, contraint d'assister au spectacle de sa "
          "propre humiliation ; la seconde, au dénouement, reprend ce dispositif et le "
          "renverse par le rire.",
    structure=[
        "**À signaler au correcteur.** Le texte de Lydie Moudileno écrit « cercle "
        "de craie » ; le roman d'Oyono, lui, écrit « cercle de chaux » — « ni aucun "
        "membre de son immense famille ne s'étaient trouvés placés, comme lui, dans "
        "un cercle de chaux ». Un candidat qui cite le roman doit écrire « chaux » ; "
        "qui résume le support suit le support. La distinction mérite d'être faite "
        "en classe.",
        "**§ 1 — La première parade.** Description de la cérémonie du 14 Juillet : Meka "
        "immobile dans son cercle de craie, la fierté d'abord, puis la révolte du corps "
        "(le soleil, les souliers, l'envie d'uriner).",
        "**§ 1 (suite) — Les deux niveaux de lecture.** Un comique de situation d'abord, tiré "
        "du décalage entre le faste et la crudité corporelle ; puis un pathétique, quand on "
        "comprend que la souffrance vient de la soumission elle-même.",
        "**§ 2 — L'interprétation allégorique.** La scène figure l'autorité et la soumission "
        "coloniales : le pouvoir subjugue le corps et l'esprit, et contraint le colonisé à "
        "regarder sa propre humiliation ; la parade est « prouesse occidentale ».",
        "**§ 3 — Le renversement du dénouement.** Oyono reprend la scène de domination et la "
        "transforme : le scénario du bila, imaginé dans la case, provoque l'hilarité générale "
        "et donne au roman tout son humour.",
    ],
    contraction=("Deux scènes de parade se répondent chez Oyono et concentrent le sens du "
                 "roman. La première, au milieu du livre, montre Meka figé dans un cercle de "
                 "craie, attendant sous le soleil la médaille qui doit récompenser ses terres "
                 "cédées et ses fils morts. Sa fierté cède peu à peu devant la révolte du "
                 "corps. Le lecteur en rit d'abord, par contraste entre la solennité et la "
                 "trivialité des besoins ; puis il s'émeut, comprenant que la douleur naît de "
                 "la soumission même. La scène vaut alors comme allégorie : le pouvoir "
                 "colonial subjugue les corps et les esprits, et force le colonisé à assister "
                 "au spectacle de son humiliation. Or Oyono reprend ce dispositif au "
                 "dénouement et le retourne : imaginer Meka décoré vêtu d'un simple bila "
                 "déclenche le rire de tout un village."),
    contraction_mots=139,
    discussion=[
        "**Explication de la formule.** Le candidat doit dégager l'idée d'un double "
        "spectacle : Meka regarde la parade des Blancs et se regarde être humilié. C'est "
        "cette duplication, et non la seule contrainte physique, qui fait la violence de la "
        "scène.",
        "**Arguments favorables.** La formule rend compte de l'essentiel du roman : le cercle "
        "de chaux, le revers de main du Père Vandermayer, la nuit en cellule, la poignée de "
        "main finale. Meka est constamment placé en position de spectateur de sa propre "
        "déchéance ; la focalisation interne oblige d'ailleurs le lecteur à occuper cette "
        "place avec lui.",
        "**Arguments contraires.** Le roman ne s'y réduit pas. Meka n'est pas seulement "
        "passif : il lance « la première œillade courroucée de sa vie », il ment au prêtre, il "
        "hurle dans sa cellule, il refuse la main tendue sous le prétexte des mains boueuses. "
        "Et le dénouement, que Moudileno signale elle-même, rend au village une capacité "
        "d'initiative.",
        "**Dépassement.** L'impuissance décrite est réelle mais elle n'est pas totale : ce que "
        "le roman montre, c'est une riposte qui n'a d'autre terrain que le langage et le rire. "
        "On pourra rapprocher cette position de celle de Dualla Manga Bell dans Ngum a Jemea, "
        "qui dispose, lui, d'un terrain juridique.",
    ],
)

# ═══════════════════════════════════════════════════════ LE LION ET LA PERLE
LIONPERLE = dict(
    theme="La puissance vitale dans Le lion et la perle, et le contresens que risque un "
          "lecteur européen sur l'impuissance de Baroka.",
    these="La pièce repose sur une conception africaine de la force — vigueur physique et "
          "fécondité — que l'égalitarisme abstrait de Lakounlé menace ; l'impuissance de "
          "Baroka ne relève donc pas du vaudeville grivois mais d'un drame social, celui de "
          "l'impossibilité d'engendrer.",
    structure=[
        "**§ 1 — La force au sens immédiat.** L'intensité physique de la présence ; le rôle "
        "du Lutteur ; le roi doit incarner la force de la cité. Ce que tous reprochent à "
        "Lakounlé est d'ignorer cette vigueur.",
        "**§ 1 (suite) — Une société hiérarchisée mais participative.** Le culte de la force "
        "produit de l'inégalité, mais chacun participe à la force de l'ensemble ; la femme "
        "n'y est pas négligeable — Sadikou terrifie Lakounlé, Sidi le fait tomber deux fois.",
        "**§ 2 — Contre l'indifférenciation.** La diversification des rôles ne contredit pas "
        "la fraternité, puisqu'il y a échange de services. L'égalitarisme abstrait conduirait "
        "à une société affadie, sans caractère ; d'où le rôle d'« eunuque » prêté à Lakounlé.",
        "**§ 3 — La force au sens médiat.** Au terme de cette involution, l'homme nouveau est "
        "stérile. Il faut donc éviter le contresens : la question de Baroka n'est pas "
        "grivoise, car l'Afrique traditionnelle ignore le puritanisme et traite ces sujets "
        "avec une gaieté de fabliau.",
    ],
    contraction=("La négritude de la pièce ne tient pas seulement à sa forme : elle engage "
                 "une conception de la puissance vitale. Celle-ci s'entend d'abord comme "
                 "vigueur physique : le roi, chef de chasse et de guerre, doit incarner la "
                 "force de la cité, et l'on reproche à Lakounlé de la mépriser. Un tel culte "
                 "engendre une société inégalitaire, où chacun participe pourtant à la force "
                 "commune, les femmes comprises. La diversification des rôles n'exclut pas la "
                 "fraternité, puisqu'elle repose sur l'échange. L'égalitarisme abstrait que "
                 "prône l'instituteur mènerait au contraire à une société indifférenciée et "
                 "fade, où il fait figure d'eunuque. Elle serait surtout stérile, décevant le "
                 "second sens de la puissance : la fécondité. D'où le contresens à éviter sur "
                 "l'impuissance de Baroka, que l'Afrique traditionnelle, étrangère au "
                 "puritanisme, aborde sans grivoiserie."),
    contraction_mots=141,
    discussion=[
        "**Explication de la formule.** Il s'agit de montrer que le sens d'une œuvre dépend "
        "des catégories que le spectateur y apporte : ce qu'un lecteur européen lit comme une "
        "plaisanterie sur la virilité est, dans le système de la pièce, une question sur la "
        "descendance et donc sur le culte des ancêtres.",
        "**Arguments favorables.** L'exemple de Baroka est probant : son « faux aveu » porte "
        "sur l'impossibilité d'être père, non sur le plaisir. De même, l'épisode du rhombe "
        "reste opaque à qui ignore la voix du dieu Oro, et la question de la dot paraît "
        "vénale à qui ignore qu'elle enregistre publiquement l'union.",
        "**Arguments contraires.** Une œuvre qui exigerait une culture préalable cesserait "
        "d'être universelle ; or la pièce se joue et se comprend hors du pays yorouba. "
        "Le comique de la tirade des quinze adjectifs, l'aveu du Petit Larousse ou la "
        "vanité de Sidi n'ont besoin d'aucune clé.",
        "**Dépassement.** Distinguer ce qui se perd et ce qui se transmet : la mécanique "
        "dramatique est universelle, la portée sociale demande un apprentissage. Le rôle "
        "d'un cahier pédagogique — et d'une préface — est précisément de fournir cette clé "
        "sans laquelle la pièce se réduirait à une farce.",
    ],
)

# ═══════════════════════════════════════════════════════════ NGUM A JEMEA
NGUM = dict(
    theme="Le devoir de mémoire envers Rudolf Dualla Manga Bell et la fonction fondatrice de "
          "son martyre.",
    these="L'œuvre doit être lue et transmise parce que le sacrifice de Dualla Manga Bell, "
          "qui refusa de céder les droits et la dignité de son peuple contre des avantages "
          "personnels, constitue un acte fondateur de la conscience nationale camerounaise.",
    structure=[
        "**§ 1 — Le principe.** Il est juste d'accorder une pensée à quiconque a rendu un "
        "service à son pays.",
        "**§ 2 — L'hommage à l'auteur.** Mbanga Eyombwan doit être remercié : l'histoire du "
        "service rendu par le roi Bell et son secrétaire mérite d'être portée à la "
        "connaissance des uns et rappelée aux autres.",
        "**§ 3 — La fonction éducative.** Ces hauts faits doivent être gravés dans les cœurs "
        "des enfants, qui verront en eux des phares ; malgré leur fin tragique, ces hommes "
        "ont montré le chemin du nationalisme.",
        "**§ 4 — Les compagnons.** Remerciements aux amis qui soutinrent la lutte sans se "
        "lasser, et qui faillirent périr le même jour.",
        "**§ 5 — Le vœu.** Que le livre soit lu par tous, afin que cette histoire ne soit pas "
        "reléguée aux oubliettes.",
        "**§ 6 — La notice.** La pièce est une tragédie qui va de l'intronisation de 1910 à "
        "la pendaison de 1914 ; le refus du roi, opposé aux intérêts égoïstes qu'on lui fait "
        "miroiter, fait de son martyre un acte fondateur.",
    ],
    contraction=("Rendre hommage à qui a servi son pays est un devoir. À ce titre, David "
                 "Mbanga Eyombwan mérite reconnaissance : son œuvre porte à la connaissance "
                 "de tous, jeunes et vieux, le service rendu par le roi Bell et son "
                 "secrétaire. Ainsi leurs actes seront-ils gravés dans le cœur des enfants, "
                 "qui verront en ces hommes des guides ; malgré une fin tragique, ils ont "
                 "ouvert la voie du nationalisme. Leurs compagnons, qui soutinrent la lutte "
                 "sans faiblir et faillirent périr avec eux, méritent la même gratitude. Ce "
                 "livre doit donc être lu, afin qu'une telle histoire ne tombe pas dans "
                 "l'oubli. La pièce, qui mène de l'intronisation de 1910 à la pendaison de "
                 "1914, montre un chef refusant de troquer les droits de son peuple contre "
                 "des avantages : son martyre fonde la conscience nationale."),
    contraction_mots=145,
    discussion=[
        "**Explication de la formule.** « Fonder » ne signifie pas « raconter » : il s'agit "
        "de savoir si une œuvre littéraire peut instituer une mémoire commune, c'est-à-dire "
        "produire chez un peuple la conscience d'une origine partagée.",
        "**Arguments favorables.** La littérature fixe et transmet ce que les archives "
        "laisseraient inerte ; elle donne des figures identifiables, et elle atteint un "
        "public que l'histoire savante n'atteint pas. Exemple attendu : la scène du refus de "
        "fuir, qui rend sensible ce qu'un document ne montrerait pas — la délibération.",
        "**Arguments contraires.** Une littérature chargée de fonder risque l'hagiographie : "
        "elle distribue les rôles à l'avance et cesse d'être discutable. On pourra noter que "
        "Von Roehm finit par avouer lui-même sa doctrine — « la force prime le droit » — ce "
        "qui simplifie l'adversaire. Le risque d'un usage politique de l'œuvre doit être "
        "signalé.",
        "**Dépassement.** Distinguer le jugement porté sur l'homme et celui porté sur l'œuvre. "
        "Une pièce sert d'autant mieux une mémoire qu'elle laisse à son héros le droit "
        "d'hésiter : le monologue « Que faire ?… » est ce qui empêche Dualla Manga Bell de "
        "devenir une statue.",
    ],
)

# ═══════════════════════════════════════════════════ LES TRIBUS DE CAPITOLINE
CAPITOLINE = dict(
    theme="Le repli tribal comme obstacle à l'intégration nationale, et le sens de la mort de "
          "Mathieu Belibi.",
    these="Le roman restitue de façon réaliste un phénomène socio-anthropologique séculaire ; "
          "la mort du héros, loin d'être un simple échec, doit se lire comme le ferment d'une "
          "société nouvelle et l'aboutissement d'un parcours initiatique.",
    structure=[
        "**§ 1 — La nature de l'œuvre.** Ni roman d'aventure, ni roman sociologique "
        "exclusivement : une restitution romancée mais réaliste, appuyée sur une abondance de "
        "références onomastiques.",
        "**§ 1 (suite) — L'enjeu national.** Que des peuples d'une même nation se "
        "claquemurent dans le repli identitaire est suicidaire pour l'intégration nationale.",
        "**§ 1 (suite) — La question de la mort du héros.** Pourquoi l'auteur tue-t-il "
        "Mathieu ? Pour souligner l'âpreté du combat à mener, ou pour marquer la vanité de "
        "toute tentative ?",
        "**§ 1 (fin) — La réponse par le titre.** Le roman est un foisonnement de tribus "
        "unies par les alliances ; la mort de Mathieu devient dès lors une source d'espoir, "
        "un ferment.",
        "**§ 2 — Le parcours initiatique.** L'expérience de Mathieu est une trajectoire "
        "formatrice : au terme des épreuves, le jeune homme devient homme et s'affirme comme "
        "valeur sociale.",
    ],
    contraction=("Les Tribus de Capitoline échappent aux classements : le roman veut d'abord "
                 "restituer, sous une forme romancée mais réaliste, un phénomène social "
                 "ancien, que confirme l'abondance des noms de lieux et de personnes. Or "
                 "voir des peuples d'une même nation se replier sur eux-mêmes et se rejeter "
                 "ruine tout projet d'intégration. D'où l'inquiétude que suscite la mort du "
                 "héros : faut-il y lire l'âpreté du combat à mener, ou l'inutilité de "
                 "vouloir changer des esprits figés ? Le titre répond, puisque l'œuvre "
                 "multiplie les unions entre tribus différentes ; le sang versé devient alors "
                 "ferment d'une société nouvelle. Le parcours de Mathieu s'entend enfin comme "
                 "une initiation : par une succession d'épreuves surmontées, le jeune homme "
                 "accède à la stature d'homme accompli."),
    contraction_mots=132,
    discussion=[
        "**Explication de la formule.** Le candidat doit distinguer la fin malheureuse du "
        "personnage et le sens que le récit lui donne. « Source d'espoir » suppose que la "
        "mort produise quelque chose : ici, une prise de conscience chez le lecteur et, dans "
        "la fiction, un enfant à naître.",
        "**Arguments favorables.** Capitoline est enceinte et tient tête à sa belle-mère ; "
        "l'épilogue montre un village prêt à accueillir Mathieu, donc une appartenance "
        "possible ; et la thèse du héros — « une tribu s'apprend » — lui survit. La mort scelle "
        "l'absurdité de l'interdit et le rend intolérable.",
        "**Arguments contraires.** Rien, dans l'épilogue, ne garantit ce dénouement heureux : "
        "l'émissaire est bloquée en forêt, le père ne saura rien, Sophie Mbezele est "
        "« déséquilibrée ». Le romancier refuse la scène de reconnaissance ; on peut donc y "
        "lire un pessimisme, non une espérance.",
        "**Dépassement.** L'espérance n'est pas dans les faits mais dans l'effet produit sur "
        "le lecteur. Une fin tragique n'est porteuse d'espoir que si elle rend une situation "
        "insupportable à celui qui la lit — ce qui déplace la question de la fiction vers son "
        "public.",
    ],
)

# ═══════════════════════════════════════════════════ AU CŒUR DES TÉNÈBRES
TENEBRES = dict(
    theme="La conquête coloniale vue par Marlow : l'épreuve de l'incompréhensible, la "
          "fascination de l'abominable, et l'idée censée racheter la violence.",
    these="Toute conquête se ramène à prendre leur terre à des hommes d'une autre couleur ; "
          "seule une idée désintéressée, et non un prétexte sentimental, pourrait la racheter.",
    structure=[
        "**§ 1 — L'expérience du colon isolé.** Un jeune Romain débarque dans un marécage et "
        "se trouve encerclé par une sauvagerie absolue, sans initiation possible : il faut "
        "vivre au milieu de l'incompréhensible.",
        "**§ 1 (suite) — La fascination de l'abominable.** De cette situation émane une "
        "attirance ; suivent les regrets, le désir de fuir, le dégoût impuissant, la "
        "capitulation, la haine.",
        "**§ 2 — La mise en garde.** Aucun de nous n'éprouverait cela : ce qui nous sauve est "
        "l'efficacité, la volonté d'être efficace.",
        "**§ 2 (suite) — Conquérants et non colonisateurs.** Ces hommes n'administraient pas, "
        "ils pressuraient ; la force brute suffit, et elle n'est qu'un accident tenant à la "
        "faiblesse des autres. Rapine et meurtre à grande échelle.",
        "**§ 2 (fin) — La définition et le rachat.** La conquête consiste à prendre la terre "
        "d'hommes d'une autre couleur ; elle n'est pas belle vue de près. Seule une idée, "
        "soutenue par une foi désintéressée, pourrait la racheter.",
    ],
    contraction=("Qu'on imagine un jeune Romain venu se refaire aux confins de l'Empire : "
                 "débarqué dans un marécage, cerné par une sauvagerie qu'aucune initiation "
                 "ne lui rend intelligible, il doit vivre au milieu de l'incompréhensible. "
                 "Il en éprouve d'abord une fascination pour l'abominable, puis le regret, "
                 "l'envie de fuir, le dégoût, la capitulation et la haine. Nous autres, "
                 "assure Marlow, échapperions à cela par l'efficacité. Ces hommes-là, "
                 "d'ailleurs, ne colonisaient pas : ils pressuraient. Simples conquérants, "
                 "ils ne disposaient que d'une force brutale, accident né de la faiblesse "
                 "d'autrui, et s'adonnaient au pillage et au meurtre. Car conquérir, c'est "
                 "essentiellement prendre sa terre à qui a une autre couleur de peau ; vue "
                 "de près, la chose est laide. Seule une idée, servie par une foi "
                 "désintéressée, pourrait la racheter."),
    contraction_mots=133,
    discussion=[
        "**Explication de la formule.** Marlow distingue le fait — la prise de possession "
        "par la force — et sa justification. « Racheter » suppose que la violence demeure, "
        "mais qu'une fin supérieure lui donnerait un sens. Le candidat doit voir que la "
        "phrase est restrictive : « n'est que l'idée ».",
        "**Arguments favorables.** Une entreprise peut être menée pour des motifs qui la "
        "dépassent, et les hommes ont besoin de croire à ce qu'ils font. Marlow lui-même "
        "oppose une « foi désintéressée » à un « prétexte sentimental » : il ne valide pas "
        "n'importe quelle justification.",
        "**Arguments contraires.** Le roman réfute cette thèse par ce qu'il montre : la "
        "Compagnie invoque la civilisation et pratique le pillage ; Kurtz, envoyé pour "
        "porter la lumière, achève son rapport par « Exterminez toutes ces brutes ! ». "
        "L'idée n'a pas racheté la conquête, elle l'a maquillée.",
        "**Dépassement.** La phrase est prononcée par un personnage, au début du récit, avant "
        "l'expérience du fleuve ; tout le roman peut se lire comme sa réfutation progressive. "
        "On distinguera donc ce que dit Marlow au départ et ce que le livre établit à "
        "l'arrivée.",
    ],
)

CONTRACTION_TARTUFFE = (
    "Cette comédie a fait du bruit et fut longtemps persécutée. Les marquis, les précieuses et les médecins avaient supporté d'être joués ; les hypocrites, eux, ne l'ont pas admis. Plutôt que d'attaquer la pièce par où elle les atteint, ils ont déguisé leur intérêt en cause de Dieu et l'ont déclarée impie jusque dans ses gestes. Molière se soucierait peu de leurs cris s'ils ne lui gagnaient, par cet artifice, de véritables croyants : c'est donc à ceux-là qu'il s'adresse, les priant de ne rien condamner avant d'avoir vu. Examinée de bonne foi, sa comédie montre des intentions innocentes. Il a pris les précautions qu'exigeait la matière, séparé l'hypocrite du dévot sincère, employé deux actes à préparer son scélérat, rendu celui-ci reconnaissable dès l'abord et lui a opposé un homme de bien.")

# ═══════════════════════════════════════════════════════════════ TARTUFFE
TARTUFFE = dict(
    theme="La défense d'une comédie accusée d'attaquer la religion : pourquoi Molière se "
          "justifie, devant qui, et sur quelles preuves tirées de sa pièce.",
    these="Le Tartuffe n'offense pas la piété. Ses adversaires, incapables de l'attaquer "
          "par où elle les blesse réellement, déguisent leur intérêt en cause de Dieu ; "
          "c'est donc aux vrais dévots que Molière s'adresse, et la construction même de la "
          "pièce — deux actes employés à préparer le scélérat, un personnage reconnaissable "
          "dès sa première apparition, un homme de bien qui lui est opposé — prouve qu'elle "
          "sépare l'hypocrite du croyant sincère.",
    structure=[
        "**§ 1 — L'accusation et son origine.** Les marquis, les précieuses, les cocus et "
        "les médecins ont accepté d'être joués ; les hypocrites, non. Faute de pouvoir "
        "attaquer la pièce par le côté qui les a blessés, ils « ont couvert leurs intérêts "
        "de la cause de Dieu » et déclarent la comédie impie jusque dans ses gestes.",
        "**§ 2 — L'inutilité des cautions.** Corrections, jugement du roi et de la reine, "
        "présence des princes et des ministres, témoignage des gens de bien : rien n'y a "
        "fait. (Ce paragraphe est écarté du support : la coupe est signalée par […].)",
        "**§ 3 — La raison de se défendre.** Molière ne craint pas leurs cris mais leur "
        "artifice, qui lui gagne de véritables gens de bien. Il s'adresse donc aux vrais "
        "dévots et les conjure de ne rien condamner avant d'avoir vu.",
        "**§ 4 — La preuve tirée de la pièce elle-même.** Intentions innocentes, "
        "précautions prises, distinction expresse de l'hypocrite et du vrai dévot ; deux "
        "actes entiers employés à préparer la venue du scélérat, qui « ne tient pas un seul "
        "moment l'auditeur en balance », et auquel un « véritable homme de bien » est "
        "opposé.",
    ],
    contraction=CONTRACTION_TARTUFFE,
    contraction_mots=132,
    discussion=[
        "**Explication de la formule.** Molière ne se justifie pas devant ses accusateurs, "
        "qu'il juge de mauvaise foi, mais devant les croyants sincères que ces accusateurs "
        "risquent d'entraîner. La distinction est capitale : se justifier devant qui l'on "
        "peut convaincre n'est pas se soumettre à qui l'on veut faire taire.",
        "**Premier mouvement attendu — oui, une œuvre gagne à s'expliquer.** Elle prévient "
        "le contresens : c'est pour cela que Molière rappelle avoir opposé un vrai dévot à "
        "son imposteur, et qu'il ajoutera dans le texte même de l'acte IV la mention « C'est "
        "un scélérat qui parle ». On créditera tout candidat qui cite un auteur préfaçant "
        "son œuvre pour la même raison.",
        "**Second mouvement attendu — non, une œuvre qui se justifie s'affaiblit.** Le "
        "sujet appelle une objection : si la pièce doit être expliquée, c'est peut-être "
        "qu'elle n'est pas claire ; et une œuvre qui demande la permission d'exister se "
        "place sous la surveillance de ceux qu'elle critique. On valorisera le candidat qui "
        "remarque que la préface n'a rien changé : la pièce a été interdite près de cinq "
        "ans, et c'est une décision du roi, non un argument, qui l'a fait rejouer.",
        "**Dépassement attendu.** La vraie justification d'une œuvre est l'œuvre. Molière "
        "l'admet lui-même en renvoyant à sa construction — « J'ai employé pour cela deux "
        "actes entiers » — plutôt qu'à ses intentions. On accordera la note maximale à la "
        "copie qui distingue la justification par les intentions, toujours suspecte, et la "
        "justification par les moyens, vérifiable dans le texte.",
        "**Écueils à sanctionner.** Une copie qui traite de la censure en général sans "
        "revenir à Tartuffe ; une copie qui confond les vrais dévots, à qui Molière "
        "s'adresse, et les hypocrites, contre qui il écrit.",
    ],
)

CONTRACTION_SAUVAGES = (
    "Chacun se construit à partir de limons qu'il lui revient de reconnaître et de cultiver. Ceux d'Henri N'koumo l'ont porté vers les arts plastiques et la poésie, deux pratiques qui n'en font qu'une : toutes deux transportent l'émotion et disent le monde dans sa crudité. La poésie gouverne donc son écriture entière ; elle lui sert à mesurer sa conscience d'homme et à faire monter au jour les blessures comme les espérances. Le surréalisme hérité de Césaire lui fournit les images déroutantes qu'exige cette tâche. Le titre, lui, ne se décide pas : il s'arrache du texte, dont il porte la force barbare et le refus de toute consolation menteuse. Reste que ces poèmes ne sont pas violents : le monde l'est, et ils lui opposent un contre-feu qui invente un horizon.")

# ═══════════════════════════════════════════ POÈMES SAUVAGES (N'KOUMO)
SAUVAGES = dict(
    theme="Ce qu'un poète attend de la poésie : d'où elle lui vient, comment son titre lui "
          "est venu, et pourquoi un livre né d'un attentat se range du côté de l'espérance.",
    these="La poésie n'est pas un ornement mais l'organe par lequel l'auteur rencontre le "
          "monde et mesure sa conscience d'homme. Le surréalisme hérité de Césaire lui "
          "donne des images à la mesure de l'horreur ; le titre naît du texte lui-même et "
          "non d'un calcul ; et la violence apparente du livre n'est pas la sienne mais "
          "celle du monde qui l'a produit — le poème y répond par un contre-feu, c'est-à-"
          "dire par une espérance.",
    structure=[
        "**§ 1 — Les limons.** Tout homme se construit à partir de matières premières "
        "qu'il doit identifier et cultiver. Celles de l'auteur l'ont porté vers les arts "
        "plastiques et la poésie, qu'il déclare être « une même réalité ontologique » : "
        "des « passeurs d'émotion ».",
        "**§ 2 — La poésie gouverne tout.** Elle est son identité d'écrivain, sa manière "
        "d'aller à la rencontre du monde et d'évaluer sa conscience. Le surréalisme, hérité "
        "de Césaire et de Zadi Zaourou, l'autorise à des images « complexes, cocasses, "
        "déroutantes ». C'est depuis la poésie qu'il vient au théâtre et à la fiction, comme "
        "les premiers dramaturges de l'humanité, poètes avant d'être dramaturges.",
        "**§ 3 — Le titre.** « Un bon titre ne se commande pas : il s'arrache lui-même de "
        "dessous le texte. » Il naît des ressorts thématiques et stylistiques de l'œuvre. "
        "Celui-ci convient parce que ces poèmes sont « d'une force barbare » et qu'ils "
        "constituent « un terrain de vérité nue », non une utopie consolante.",
        "**§ 4 — L'espérance.** Le poète est « condamné à porter l'espérance ». Le livre "
        "est « un immense chant d'amour » ; ce n'est pas lui qui est violent, c'est le monde "
        "qui a conditionné son écriture. Contre le feu des bombes, il est « un contre-feu "
        "idéal », fait pour parler au cœur des hommes et « lui inventer un horizon ».",
    ],
    contraction=CONTRACTION_SAUVAGES,
    contraction_mots=132,
    discussion=[
        "**Explication de la formule.** « Ils sont faits pour parler au cœur des hommes, à "
        "lui inventer un horizon. » L'auteur n'attribue pas à la poésie le pouvoir "
        "d'empêcher un attentat : il lui attribue celui d'ouvrir un avenir à ceux qui "
        "restent. La distinction commande tout le devoir.",
        "**Premier mouvement attendu — non, la poésie ne peut rien.** Un poème n'arrête pas "
        "une balle. Le livre lui-même le reconnaît : il compte les villes frappées les unes "
        "après les autres, et la liste ne cesse pas parce qu'on l'écrit. On créditera le "
        "candidat qui cite le vers des villes ou les trois questions « pendant combien de "
        "temps encore ? ».",
        "**Second mouvement attendu — oui, mais autrement.** La poésie garde les noms. Elle "
        "rend à Henrike Grohs un rire, un balcon, une mosquée bleue, là où un communiqué "
        "n'aurait donné qu'un chiffre. Elle refuse aussi de classer les morts : Paris et "
        "Maïduguri sont sur la même ligne. On valorisera la copie qui montre que cette "
        "égalité passe par la seule disposition des mots.",
        "**Dépassement attendu.** L'image du contre-feu est plus exacte qu'il n'y paraît : "
        "un contre-feu ne combat pas l'incendie de front, il brûle ce dont l'incendie se "
        "nourrirait. La poésie n'affronte donc pas la violence : elle lui retire sa matière, "
        "qui est l'oubli et l'indifférence. On accordera la note maximale à la copie qui "
        "conduit l'image jusque-là.",
        "**Écueils à sanctionner.** Une copie qui vante la poésie en général sans revenir au "
        "texte ; une copie qui conclut que « la poésie sauve le monde », affirmation que "
        "rien dans l'œuvre ne soutient ; une copie qui confond l'auteur et son « je ».",
    ],
)

# ═════════════════════════════════════════════ STANCES ET POÈMES (SULLY PRUDHOMME)
STANCES = dict(
    theme="Le rapport du mot à la chose qu’il désigne : conventionnel dans "
          "l’immense majorité des cas, mais rendu naturel en apparence par l’usage.",

    these="Les mots ne sont presque jamais expressifs par eux-mêmes — l’onomatopée "
          "est l’exception qui le prouve ; ils le deviennent en apparence par "
          "l’accoutumance, et ils le deviennent réellement par la manière dont on "
          "les rapproche et les enchaîne. L’expressivité n’est donc pas dans le "
          "lexique, elle est dans la composition.",

    structure=[
        "**§ 1 — L’exception.** Le mot n’imite la chose que lorsque cette chose est "
        "un son : liste d’onomatopées (murmurer, grommeler, bourdonner…). Le "
        "candidat doit voir que cette liste est un exemple, non une thèse.",
        "**§ 2 — La règle.** Les onomatopées sont rares ; le lien du mot à l’objet "
        "est conventionnel. La convention est un accord instinctif, tacite, mais "
        "réelle. Suit une hypothèse contraire (« si tout le vocabulaire était fait "
        "d’onomatopées… ») aussitôt écartée comme chimérique, avec sa raison : le "
        "progrès des sciences abstrait la pensée et rend ses notations algébriques.",
        "**§ 3 — La correction par l’usage.** L’habitude de l’oreille et de l’œil "
        "prête au mot une physionomie vivante ; le signe conventionnel paraît "
        "devenir naturel. Conséquence pratique : l’hostilité du poète aux "
        "néologismes et aux réformes orthographiques, illustrée par l’exemple du "
        "y de « lys ».",
        "**§ 4 — Reprise et nuance.** Un mot peut être harmonieux sans que son "
        "objet le soit, et l’inverse ; l’accoutumance efface ces désaccords.",
        "**§ 5 — Le déplacement final.** La langue ne se réduit pas au vocabulaire : "
        "les rapprochements et les enchaînements sont, eux, toujours expressifs. "
        "C’est la phrase que la discussion reprendra ; un résumé qui la perd manque "
        "la conclusion du texte.",
    ],

    contraction="""Le mot imite rarement la chose qu’il nomme : seules les onomatopées, en petit nombre, reproduisent un son. Partout ailleurs, le lien entre le nom et l’objet relève d’une convention instinctive et tacite, mais réelle. Un vocabulaire entièrement expressif est d’ailleurs impensable : plus la pensée devient abstraite, plus ses notations tendent vers le signe algébrique. L’usage prolongé corrige pourtant cette froideur : l’oreille et l’œil finissent par prêter au mot un visage inséparable de son objet, ce qui explique l’hostilité des poètes aux néologismes et aux réformes de l’orthographe. Les désaccords entre la sonorité et le sens s’effacent de même par accoutumance. La langue, du reste, ne se réduit pas au vocabulaire : ce sont les rapprochements et les enchaînements de mots qui sont, eux, toujours expressifs.""",
    contraction_mots=128,

    discussion=[
        "**Analyse de la citation.** Deux termes s’opposent : les mots pris un à un "
        "(le vocabulaire) et leurs « rapprochements choisis » et « enchaînements "
        "ordonnés » (la composition). Le candidat doit voir que Sully Prudhomme ne "
        "dévalorise pas le mot : il déplace l’expressivité du lexique vers la "
        "syntaxe, le rythme et la disposition.",

        "**I. Ce qui donne raison à l’auteur.** Dans « Le Vase brisé », aucun mot "
        "n’est rare : vase, verveine, eau, main, cœur. C’est la disposition qui "
        "fait le poème — douze vers pour l’objet, huit pour le cœur, et un chiasme "
        "final (« N’y touchez pas, il est brisé » / « Il est brisé, n’y touchez "
        "pas ») dont l’effet tient uniquement à l’ordre des mots. Même démonstration "
        "avec « Le meilleur Moment des Amours », bâti sur la reprise de « il est "
        "dans… ».",

        "**II. Ce qui la nuance.** Certains mots portent à eux seuls une charge que "
        "l’agencement n’explique pas. « Fange indocile », « sordide robe », "
        "« l’airain sans l’effigie » dans « Je me croyais poète » : le choix lexical "
        "y est décisif. De même les mots rares du recueil (belliqueux, altier, "
        "empourpre) créent un registre que nul agencement ne remplacerait.",

        "**III. Dépassement.** L’opposition est peut-être mal posée : un mot n’a de "
        "valeur que placé. « Brisé » n’est rien ; « Il est brisé, n’y touchez pas » "
        "est un vers. Inversement, un agencement savant sur un vocabulaire faux ne "
        "produit rien. Le poème est le lieu où le choix et la disposition cessent "
        "d’être deux opérations séparées — ce que dit aussi le titre du chapitre "
        "d’où le texte est tiré.",

        "**Attentes minimales.** Deux exemples au moins tirés de Stances et Poèmes, "
        "cités exactement ; une ouverture sur une autre œuvre ou un autre art "
        "(chanson, proverbe, slogan) ; une position personnelle formulée en "
        "conclusion et non en introduction.",
    ],
)

# ═══════════════════════════════════════════════════ BALAFON (ENGELBERT MVENG)
BALAFON = dict(
    theme="La double source de Balafon — africaine et chrétienne — et la "
          "mission que Mveng assigne à l’écrivain : chercher ce qui vient après.",

    these="Le recueil n’enferme pas son auteur dans une seule appartenance : "
          "parti de l’Afrique, il rejoint les autres continents pour atteindre "
          "l’universel. Le titre le dit déjà, puisque le balafon est un "
          "instrument qui transmet. Et l’écrivain, selon Mveng, n’est ni un "
          "démolisseur ni un agitateur : il cherche l’homme, la vie et le jour "
          "— ce qui l’oblige à nommer d’abord l’enfance, la mort et la nuit.",

    structure=[
        "**§ 1 — Ce que font les seize poèmes.** Quatre verbes gradués — "
        "interpeller, supplier, exhorter, rudoyer — puis la double source, "
        "africaine et chrétienne, et la visée : l’universel, « ce quelque chose "
        "dans lequel se retrouve l’homme de toute culture ».",
        "**§ 2 — La date.** 1972, après des travaux consacrés à l’Afrique.",
        "**§ 3 — Le titre expliqué.** Mveng n’est pas seulement fils "
        "d’Afrique mais fils du monde ; le balafon est choisi parce qu’il "
        "transmet le plaisir et la parole. Un candidat qui manque ce paragraphe "
        "perd l’explication du titre.",
        "**§ 4 — L’homme.** Assassiné en 1995 ; une œuvre d’historien, "
        "d’archéologue, de théologien, de géographe.",
        "**§ 5 — La déclaration de Mveng.** Deux mouvements : ce que l’écrivain "
        "n’est pas (subversion, démolition gratuite), ce qu’il cherche (l’homme "
        "après l’enfant, la vie après la mort, le jour après la nuit), et la "
        "conséquence — il lui faut donc pourchasser les ténèbres.",
    ],

    contraction="""Balafon rassemble seize poèmes dont la parole tour à tour appelle, supplie et réprimande. Née de deux sources, africaine et chrétienne, elle rejoint les autres continents pour atteindre l’universel, où tout homme se reconnaît. Engelbert Mveng, qui publie le recueil en 1972, ne se veut pas seulement fils d’Afrique mais fils du monde : d’où le titre, emprunté à un instrument qui transmet à la fois le plaisir et la parole. Assassiné en 1995, ce savant laisse une œuvre considérable. Il assignait à l’écrivain un rôle qui n’est pas de subversion ni de démolition gratuite : chercher l’homme derrière l’enfant, la vie derrière la mort, le jour derrière la nuit — ce qui oblige à combattre d’abord les ténèbres.""",
    contraction_mots=119,

    discussion=[
        "**Analyse de la citation.** Trois couples, tous orientés du moins vers "
        "le plus : enfant/homme, mort/vie, nuit/jour. La formule assigne à "
        "l’écrivain une fonction d’annonce, non de constat. Le candidat doit "
        "voir que le second terme de chaque couple n’est pas encore là : "
        "l’écrivain parle de ce qui vient.",

        "**I. Le recueil donne raison à Mveng.** « Marcinelle, 1956 » part de la "
        "catastrophe minière et refuse de s’y arrêter : les chœurs demandent la "
        "paix et la terre des hommes. « Adamawa » se termine sur un réveil — "
        "« Que le coq chantera mille et mille fois au réveil ». Le mouvement de "
        "la nuit vers le jour est inscrit dans la composition même des poèmes.",

        "**II. Mais dire ce qui est occupe une grande part du livre.** "
        "« Épiphanie » énumère longuement les mains sales, le pagne en lambeaux, "
        "les pieds couverts de boue ; « Lettre collective » constate qu’en "
        "Europe « on n’aime pas les hommes ». Sans ce constat, l’annonce "
        "n’aurait aucun poids : c’est parce que la nuit est décrite que le jour "
        "annoncé compte.",

        "**III. Dépassement.** Les deux gestes n’en font qu’un chez Mveng, et "
        "sa formule le dit : il est « bien obligé pour cela de pourchasser les "
        "ténèbres ». Annoncer le jour suppose de nommer la nuit ; le poète ne "
        "choisit pas entre constater et espérer, il fait dépendre le second du "
        "premier.",

        "**Attentes minimales.** Deux poèmes du recueil cités exactement, une "
        "ouverture sur une autre œuvre — la Négritude s’impose —, et une "
        "position personnelle formulée en conclusion, non en introduction.",
    ],
)

PAR_CAHIER = {
    "vieuxnegre": VIEUXNEGRE,
    "lionperle": LIONPERLE,
    "ngum": NGUM,
    "capitoline": CAPITOLINE,
    "tenebres": TENEBRES,
    "tartuffe": TARTUFFE,
    "sauvages": SAUVAGES,
    "stances": STANCES,
    "balafon": BALAFON,
}


def corrige_contraction(cle):
    """Construit le corrigé du sujet I au format attendu par le builder."""
    c = PAR_CAHIER[cle]
    return dict(
        num="Corrigé du sujet I — Contraction et discussion",
        blocs=[
            ("Thème du texte", c["theme"]),
            ("Thèse de l'auteur", c["these"]),
            ("Structure du texte, paragraphe par paragraphe", c["structure"]),
            ("Proposition de contraction (%d mots)" % c["contraction_mots"],
             c["contraction"]),
            ("Éléments attendus dans la discussion", c["discussion"]),
            ("Grille d'évaluation — Sujet I", None),
        ],
        grille=GRILLE,
        cloture=CLOTURE,
    )
