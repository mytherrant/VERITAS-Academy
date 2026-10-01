# -*- coding: utf-8 -*-
"""
Lectures méthodiques — « Tartuffe ou l'Imposteur », Molière (fiches 4 à 6).

Suite de `tartuffe_fiches`. Mêmes règles : registre de seconde, mots glosés
là où ils apparaissent, extraits importés depuis `tartuffe_extraits`.
"""
import tartuffe_extraits as X

# ═════════════════════════════════════════════════════════════ FICHE 4
F4 = dict(
    titre="Fiche 4 — S'accuser pour être cru innocent",
    repere=X.REPERES["E4"],
    extrait=X.E4,
    source=X.REFERENCES["E4"],
    objectif="Comprendre comment un personnage retourne une accusation en s'accusant "
             "lui-même, et pourquoi cette méthode réussit sur Orgon.",
    situation=(
        "Damis s'est caché dans un cabinet. Il a entendu Tartuffe déclarer son amour à "
        "Elmire, sa belle-mère. Il sort, triomphant, et raconte tout à son père. Orgon "
        "arrive donc en sachant ce que Tartuffe a fait. La scène devrait être celle du "
        "démasquage : elle sera celle de la victoire de Tartuffe."
    ),
    mouvements=[
        "**La question d'Orgon** (« Ce que je viens d'entendre, ô ciel ! est-il "
        "croyable ? ») : le père demande une explication.",
        "**L'aveu général** (« Oui, mon frère, je suis un méchant, un coupable… ») : "
        "Tartuffe s'accuse de tout, sauf de ce dont on l'accuse.",
        "**Le retournement** (« Ah ! traître, oses-tu bien… ») : Orgon se retourne contre "
        "son fils.",
        "**La relance** (« Ah ! laissez-le parler… ») : Tartuffe insiste pour être accusé, "
        "ce qui achève de convaincre Orgon de son innocence.",
        "**Le silence imposé** (« Tais-toi, pendard ! ») : Damis est réduit au silence, "
        "puis menacé.",
    ],
    lexique=[
        ["iniquité", "injustice, faute grave."],
        ["scélérat", "criminel, très mauvais homme."],
        ["souillures", "saletés. Ici, au sens moral : les fautes."],
        ["un amas", "un tas."],
        ["forfait", "crime."],
        ["je n'ai garde de", "je me garde bien de, je ne vais surtout pas."],
        ["courroux", "grande colère."],
        ["feinte", "qui fait semblant, qui n'est pas sincère."],
        ["démentir", "dire que ce que quelqu'un affirme est faux."],
        ["peste maudite", "insulte violente. Orgon la lance à son propre fils."],
        ["pendard", "insulte : celui qui mérite d'être pendu."],
        ["mon extérieur", "ce que l'on voit de moi, mon apparence."],
        ["je ne suis rien moins que", "je ne suis pas du tout."],
        ["perfide", "traître."],
        ["perdu", "ici : perdu de réputation, débauché."],
        ["homicide", "meurtrier."],
        ["ignominie", "grande honte publique."],
        ["se rendre", "ici : céder, se laisser convaincre."],
        ["je te romprai les bras", "je te casserai les bras. Menace physique."],
    ],
    axes=[
        ("Un aveu qui n'avoue rien",
         [
             "**Tartuffe dit oui, tout de suite.** « Oui, mon frère, je suis un méchant, un "
             "coupable, / Un malheureux pécheur tout plein d'iniquité, / Le plus grand "
             "scélérat qui jamais ait été. » Il ne discute pas, il ne se justifie pas : il "
             "en rajoute.",
             "**Mais aucun fait n'est jamais nommé.** Damis a accusé Tartuffe d'une chose "
             "précise : avoir fait une déclaration d'amour à Elmire. Tartuffe, lui, ne parle "
             "que de « crimes », d'« ordures », de « souillures » — des mots vagues, qui "
             "peuvent désigner n'importe quoi. En avouant tout, il n'avoue rien.",
             "**L'accumulation et la gradation.** « un méchant, un coupable, / Un malheureux "
             "pécheur… / Le plus grand scélérat qui jamais ait été ». Les termes se suivent "
             "en devenant de plus en plus forts : c'est une gradation. Le superlatif « le "
             "plus grand… qui jamais ait été » achève de rendre l'aveu invraisemblable.",
             "**Il commande sa propre punition.** « Croyez ce qu'on vous dit, armez votre "
             "courroux, / Et comme un criminel chassez-moi de chez vous. » Trois impératifs. "
             "Un coupable qui exige son châtiment ne peut pas être coupable : c'est ce "
             "raisonnement, jamais énoncé, que Tartuffe installe dans la tête d'Orgon.",
         ]),
        ("Une machine à retourner l'accusation",
         [
             "**Plus il s'accuse, plus Orgon le défend.** « Ah ! traître, oses-tu bien, par "
             "cette fausseté, / Vouloir de sa vertu ternir la pureté ? » Le mot « traître » "
             "n'est pas adressé à Tartuffe mais à Damis, et le mot « vertu » désigne "
             "Tartuffe. Les rôles ont été échangés en deux vers.",
             "**Tartuffe relance quand il aurait pu se taire.** « Ah ! laissez-le parler ; "
             "vous l'accusez à tort, / Et vous ferez bien mieux de croire à son rapport. » "
             "Il défend son accusateur. C'est la manœuvre la plus habile de la scène : la "
             "générosité apparente ferme définitivement l'esprit d'Orgon.",
             "**Il dit la vérité sur lui-même, et c'est ce qui le sauve.** « Tout le monde "
             "me prend pour un homme de bien ; / Mais la vérité pure est que je ne vaux "
             "rien. » Ces deux vers sont exacts. Prononcés sur ce ton, à ce moment, ils "
             "passent pour de l'humilité. Molière montre ici que la vérité elle-même peut "
             "servir de masque.",
             "**Le paradoxe est complet.** « Vous fiez-vous, mon frère, à mon extérieur ? / "
             "Et, pour tout ce qu'on voit, me croyez-vous meilleur ? » Tartuffe met Orgon en "
             "garde contre les apparences — au moment précis où il s'en sert. Le spectateur "
             "entend les deux sens de la phrase ; Orgon n'en entend qu'un.",
         ]),
        ("Une famille qu'on fait taire, et un fils remplacé",
         [
             "**Trois fois « Tais-toi ».** « Tais-toi, peste maudite ! », « Tais-toi, "
             "pendard ! », « Tais-toi. » La répétition est le signe d'un pouvoir qui n'a "
             "plus d'argument. La menace suit : « Si tu dis un seul mot, je te romprai les "
             "bras. »",
             "**Damis ne finit aucune de ses phrases.** « Vous fera démentir… », « … "
             "vous séduiront au point… », « Il peut… », « J'enrage ! Quoi ! je passe… ». On "
             "retrouve exactement le procédé de la première scène de la pièce : la parole "
             "coupée. Elle change seulement de bord — c'est le père, maintenant, qui coupe.",
             "**Les mots de la famille changent de destinataire.** Tartuffe appelle Orgon "
             "« mon frère », et Damis « mon cher fils ». Orgon, lui, appelle son fils "
             "« traître », « peste maudite », « pendard », « infâme ». L'étranger a pris le "
             "vocabulaire de la parenté ; le fils a reçu celui du crime.",
             "**La dernière réplique est une fausse générosité.** « J'aimerais mieux souffrir "
             "la peine la plus dure / Qu'il eût reçu pour moi la moindre égratignure. » "
             "Tartuffe protège Damis de la colère paternelle. Le spectateur sait que le fils "
             "sera pourtant chassé et déshérité : la scène suivante le montrera.",
         ]),
    ],
    forme=[
        "**L'hyperbole** — figure qui exagère pour frapper. « Le plus grand scélérat qui "
        "jamais ait été », « un amas de crimes et d'ordures ». Ici, l'exagération est "
        "l'instrument même de la ruse : elle rend l'aveu incroyable.",
        "**L'accumulation et la gradation** — « de perfide, / D'infâme, de perdu, de "
        "voleur, d'homicide ». Cinq insultes que Tartuffe réclame pour lui-même, rangées de "
        "la moins grave à la plus grave.",
        "**L'impératif** — « Croyez », « armez », « chassez-moi », « parlez », "
        "« traitez-moi », « Accablez-moi ». Tartuffe donne des ordres, mais ce sont des "
        "ordres contre lui : la forme dit l'humilité, la fonction est de commander.",
        "**Les questions oratoires** — « Vous fiez-vous, mon frère, à mon extérieur ? », "
        "« me croyez-vous meilleur ? ». Une question oratoire n'attend pas de réponse : "
        "elle affirme. Ici, elle affirme le contraire de ce que Tartuffe veut faire croire.",
        "**Le vers partagé et la réplique coupée** — « Vous fera démentir… / Tais-toi, "
        "peste maudite ! » : deux locuteurs pour un seul alexandrin. La violence de "
        "l'interruption s'entend dans la métrique.",
    ],
    plan=[
        ("Introduction",
         "À l'acte III de Tartuffe, Damis a surpris la déclaration d'amour de Tartuffe à "
         "Elmire et vient de la rapporter à son père. La scène devrait démasquer "
         "l'imposteur. Elle le renforce. On montrera comment Tartuffe transforme une "
         "accusation précise en aveu général, et comment cette manœuvre lui livre la maison "
         "tout entière."),
        ("I. Un aveu qui ne porte sur rien",
         [
             "A. Une acceptation immédiate, et même une surenchère.",
             "B. Des fautes nommées en termes vagues : jamais le fait reproché.",
             "C. Trois impératifs qui réclament le châtiment — et le rendent impossible.",
         ]),
        ("II. Le retournement de l'accusation",
         [
             "A. « Traître » adressé à Damis, « vertu » attribuée à Tartuffe.",
             "B. Tartuffe défend son accusateur : la manœuvre décisive.",
             "C. « La vérité pure est que je ne vaux rien » : la vérité employée comme "
             "masque.",
         ]),
        ("III. Une famille réduite au silence",
         [
             "A. Trois « Tais-toi » et une menace physique.",
             "B. Les phrases de Damis systématiquement coupées, comme au premier acte.",
             "C. « Mon frère », « mon cher fils » : le vocabulaire de la parenté confisqué.",
         ]),
        ("Conclusion",
         "Cette scène est le sommet de la pièce, parce qu'elle montre que la vérité ne "
         "suffit pas. Damis dit vrai et il est chassé ; Tartuffe dit vrai sur lui-même et il "
         "est cru innocent. Il faudra l'acte IV, et une démonstration faite sous les yeux "
         "d'Orgon, pour que la parole retrouve son pouvoir."),
    ],
    comprendre=[
        "Qu'a fait Damis juste avant cette scène ? De quoi accuse-t-il Tartuffe ?",
        "Comment Tartuffe répond-il à l'accusation ? Cite-t-il une seule fois le fait qu'on "
        "lui reproche ?",
        "Contre qui Orgon se retourne-t-il finalement ? Relevez trois mots qu'il emploie "
        "pour désigner son fils.",
    ],
    analyser=[
        "a) Relevez tous les mots par lesquels Tartuffe se désigne lui-même. b) Ces mots "
        "renvoient-ils à des faits précis ? c) Que gagne-t-il à rester vague ?",
        "a) Relevez les verbes à l'impératif prononcés par Tartuffe. b) Que demande-t-il "
        "dans chaque cas ? c) Pourquoi ces ordres produisent-ils l'effet inverse de ce "
        "qu'ils réclament ?",
        "a) Relevez les trois répliques où Orgon impose le silence à Damis. b) Relevez les "
        "quatre répliques de Damis interrompues. c) Rapprochez ce système de la première "
        "scène de la pièce.",
    ],
    parcours1=[
        "a) Recopiez et complétez : « Tartuffe appelle Orgon … » ; « Tartuffe appelle Damis "
        "… » ; « Orgon appelle Damis … ».",
        "b) En une phrase, dites ce que ce relevé révèle sur la place de chacun dans la "
        "maison.",
    ],
    parcours2=[
        "a) Montrez que la réplique « Tout le monde me prend pour un homme de bien ; / Mais "
        "la vérité pure est que je ne vaux rien » est littéralement exacte.",
        "b) Expliquez comment une phrase vraie peut servir de mensonge, et ce que Molière "
        "démontre par là.",
    ],
    synthese="Pourquoi la vérité, dans cette scène, ne suffit-elle pas à faire tomber "
             "l'imposteur ?",
    examen="**Vers le commentaire composé.** Rédigez entièrement l'axe II du plan "
           "ci-dessus, en trois paragraphes. Chaque paragraphe comportera deux citations "
           "analysées, dont une au moins de plus d'un vers.",
    ouverture="À rapprocher de la fiche 3 : Tartuffe y employait déjà, devant Dorine, la "
              "même méthode de la fausse humilité — mais la servante ne s'y était pas "
              "trompée.",
    encadres=[
        ("astuce", "Analyser une gradation", [
            "Une gradation est une suite de termes rangés du plus faible au plus fort. Pour "
            "l'analyser correctement en devoir, trois gestes :",
            "- **Citer la suite entière**, sans en sauter un terme.",
            "- **Montrer l'ordre** : dire en quoi le dernier terme est plus fort que le "
            "premier.",
            "- **Dire l'effet** : ici, l'exagération finit par rendre l'aveu incroyable, "
            "donc par innocenter celui qui l'énonce.",
            "Une gradation seulement nommée, sans ces trois gestes, ne rapporte aucun "
            "point.",
        ]),
        ("vigilance", "Ne pas confondre l'humilité et la fausse humilité", [
            "Un devoir mal conduit écrit : « Tartuffe fait preuve d'humilité ». C'est un "
            "contresens complet, et il coûte cher.",
            "L'humilité consiste à reconnaître ses fautes devant celui qu'on a lésé. "
            "Tartuffe fait l'inverse : il s'accuse de fautes imaginaires pour éviter d'être "
            "jugé sur la vraie. Écrivez donc « fausse humilité », « humilité affichée » ou "
            "« aveu détourné », et justifiez toujours par le fait qu'aucune faute précise "
            "n'est nommée.",
        ]),
    ],
)


# ═════════════════════════════════════════════════════════════ FICHE 5
F5 = dict(
    titre="Fiche 5 — La table, ou la démonstration par les yeux",
    repere=X.REPERES["E5"],
    extrait=X.E5,
    source=X.REFERENCES["E5"],
    objectif="Étudier une scène où un personnage organise une expérience pour convaincre "
             "un autre, et analyser le comique de situation le plus célèbre du théâtre "
             "français.",
    situation=(
        "Orgon n'a rien voulu croire à l'acte III : il a chassé son fils et donné tous ses "
        "biens à Tartuffe. Elmire propose alors une preuve. Elle fait cacher son mari sous "
        "la table, puis reçoit Tartuffe seule. Orgon écoute donc tout, sans être vu. La "
        "scène se termine quand il consent enfin à sortir."
    ),
    mouvements=[
        "**L'objection du ciel** (« Mais comment consentir à ce que vous voulez… ») : Elmire "
        "oppose la religion, pour obliger Tartuffe à répondre.",
        "**La science des accommodements** (« Je puis vous dissiper ces craintes "
        "ridicules… ») : Tartuffe expose sa méthode.",
        "**La toux** (« Vous toussez fort, madame. ») : le signal convenu, que Tartuffe "
        "prend pour un rhume.",
        "**La feinte reddition** (« Enfin je vois qu'il faut se résoudre à céder… ») : "
        "Elmire fait mine d'accepter et se protège d'avance.",
        "**L'aveu de trop** (« C'est un homme, entre nous, à mener par le nez. ») : Tartuffe "
        "insulte Orgon devant Orgon.",
        "**La sortie de dessous la table** (« Voilà, je vous l'avoue, un abominable "
        "homme ! ») : Orgon paraît, et c'est Elmire qui lui fait la leçon.",
    ],
    lexique=[
        ["contentements", "plaisirs, satisfactions."],
        ["accommodements", "arrangements, façons de s'entendre malgré un désaccord."],
        ["scrupules", "hésitations de conscience, craintes de mal faire."],
        ["une science", "ici : un savoir-faire, une technique."],
        ["la conscience", "le sentiment du bien et du mal."],
        ["rectifier", "corriger, redresser."],
        ["l'intention", "ce qu'on a en tête en agissant."],
        ["effroi", "grande peur."],
        ["je suis au supplice", "je souffre terriblement. Elmire dit vrai : c'est un aveu "
                               "que Tartuffe entend de travers."],
        ["jus de réglisse", "pastille contre la toux."],
        ["le scandale", "le bruit public fait autour d'une faute."],
        ["l'offense", "la faute, ce qui blesse."],
        ["prétendre", "ici : espérer, réclamer."],
        ["mener par le nez", "faire faire à quelqu'un tout ce qu'on veut."],
        ["faire gloire de", "se vanter de."],
        ["conjectures", "suppositions, hypothèses non vérifiées."],
        ["croire de léger", "croire trop vite, sans preuve."],
        ["se méprendre", "se tromper."],
    ],
    axes=[
        ("Un imposteur qui expose sa méthode",
         [
             "**Elmire pose l'obstacle qu'il faut.** « Mais comment consentir à ce que vous "
             "voulez / Sans offenser le ciel, dont toujours vous parlez ? » Elle choisit "
             "l'objection à laquelle Tartuffe ne peut répondre sans se trahir : sa propre "
             "religion.",
             "**Tartuffe présente sa ruse comme un savoir.** « Je sais l'art de lever les "
             "scrupules », « il est une science / D'étendre les liens de notre conscience ». "
             "Les mots « art » et « science » donnent à la malhonnêteté l'apparence d'une "
             "compétence enseignable.",
             "**Le principe est énoncé en deux vers.** « Le ciel défend, de vrai, certains "
             "contentements ; / Mais on trouve avec lui des accommodements. » La conjonction "
             "« mais » sépare la règle de son contournement. Tout tient dans ce mot.",
             "**La conclusion est une maxime scandaleuse.** « Le scandale du monde est ce "
             "qui fait l'offense, / Et ce n'est pas pécher que pécher en silence. » La faute "
             "n'est plus dans l'acte mais dans le bruit qu'il fait. Le verbe « pécher », "
             "répété dans le même vers, oppose deux fois le même acte à lui-même : selon "
             "qu'on en parle ou non, il change de nature.",
         ]),
        ("Une femme qui conduit l'expérience",
         [
             "**Elmire ne se défend pas : elle interroge.** Chacune de ses répliques est "
             "une question ou une objection qui oblige Tartuffe à aller plus loin. Elle "
             "mène l'entretien comme on mène un interrogatoire.",
             "**La toux est un signal, et un aveu double.** « Vous toussez fort, madame. — "
             "Oui, je suis au supplice. » Elmire dit la vérité : elle souffre de ce qu'elle "
             "doit faire. Tartuffe comprend un rhume et propose une pastille. Le spectateur, "
             "lui, entend les deux sens.",
             "**Elle se protège avant de céder.** « Si ce consentement porte en soi quelque "
             "offense, / Tant pis pour qui me force à cette violence : / La faute assurément "
             "n'en doit pas être à moi. » Elmire s'adresse en réalité à son mari, caché sous "
             "la table. La phrase est une précaution prise devant témoin.",
             "**Elle obtient l'aveu décisif en éloignant Tartuffe.** « Ouvrez un peu la "
             "porte, et voyez, je vous prie, / Si mon mari n'est point dans cette galerie. » "
             "En feignant la peur, elle provoque la phrase qui achèvera Orgon : « C'est un "
             "homme, entre nous, à mener par le nez. »",
         ]),
        ("Un mari sous la table, et une leçon retournée",
         [
             "**Le comique de situation est complet.** Un homme est caché sous une table ; "
             "on parle de lui au-dessus ; il entend son ami le traiter d'imbécile. Le "
             "spectateur voit les trois personnages à la fois, et lui seul.",
             "**Orgon sort trop tôt.** « Voilà, je vous l'avoue, un abominable homme ! » Il "
             "a compris, mais il a mis quatre actes à le faire, et il sort encore avant la "
             "fin de la preuve.",
             "**Elmire le renvoie sous le tapis.** « Quoi ! vous sortez si tôt ? Vous vous "
             "moquez des gens. / Rentrez sous le tapis, il n'est pas encor temps. » La "
             "situation s'inverse : c'est la femme qui commande, et le maître de maison qui "
             "obéit.",
             "**La leçon finale est une ironie.** « Mon Dieu, l'on ne doit point croire trop "
             "de léger ; / Laissez-vous bien convaincre avant que de vous rendre. » Elmire "
             "rend à Orgon ses propres arguments : c'est exactement ce qu'il opposait à sa "
             "famille depuis le premier acte. La dernière didascalie — « Elle fait mettre "
             "son mari derrière elle » — achève le renversement : il est désormais protégé "
             "par elle.",
         ]),
    ],
    forme=[
        "**La didascalie d'auteur** — au milieu du texte, Molière écrit : « C'est un "
        "scélérat qui parle. » Ce n'est pas un personnage qui parle, c'est l'auteur, qui "
        "prévient son lecteur. Le fait est rare, et il s'explique : la pièce venait d'être "
        "accusée d'attaquer la religion.",
        "**L'euphémisme** — « certains contentements », « des accommodements », « les "
        "dernières faveurs ». L'euphémisme adoucit ce qu'on ne veut pas nommer. Chez "
        "Tartuffe, il sert à rendre présentable ce qui ne l'est pas.",
        "**Le double sens** — « je suis au supplice », « ce n'est qu'un rhume obstiné ». "
        "Chaque réplique d'Elmire s'adresse à deux destinataires : Tartuffe, qui entend une "
        "chose, et Orgon, qui en entend une autre.",
        "**L'ironie dramatique** — le spectateur sait qu'Orgon écoute, Tartuffe l'ignore. "
        "C'est ce savoir inégal qui fait rire, et qui rend insupportable chaque nouvelle "
        "phrase de Tartuffe.",
        "**La reprise du même mot** — « ce n'est pas pécher que pécher en silence ». Le "
        "verbe se répète à quelques syllabes d'intervalle, une fois condamné, une fois "
        "excusé. La formule est mémorable parce qu'elle est construite comme un jeu.",
    ],
    plan=[
        ("Introduction",
         "Après avoir chassé son fils et donné ses biens à Tartuffe, Orgon refuse toujours "
         "d'ouvrir les yeux. Elmire, sa femme, décide alors de lui montrer ce qu'il n'a pas "
         "voulu entendre : elle le cache sous une table et reçoit Tartuffe seule. On "
         "montrera comment cette scène fait d'une démonstration de logique la scène la plus "
         "drôle de la pièce, et comment elle renverse les rapports de force dans la "
         "maison."),
        ("I. Un imposteur qui expose lui-même sa méthode",
         [
             "A. L'objection choisie par Elmire : le ciel, dont Tartuffe parle sans cesse.",
             "B. « L'art de lever les scrupules » : la malhonnêteté présentée comme une "
             "science.",
             "C. « Ce n'est pas pécher que pécher en silence » : la faute déplacée de "
             "l'acte vers le bruit.",
         ]),
        ("II. Une femme qui mène l'expérience",
         [
             "A. Des questions, et non une défense : Elmire conduit l'entretien.",
             "B. La toux, signal convenu et aveu à double sens.",
             "C. Une précaution prise devant témoin, puis l'aveu arraché en feignant la "
             "peur.",
         ]),
        ("III. Le renversement des rôles",
         [
             "A. Un comique de situation fondé sur ce que seul le spectateur voit.",
             "B. « Rentrez sous le tapis » : la femme commande, le mari obéit.",
             "C. Une leçon de prudence rendue à celui qui la donnait à tous.",
         ]),
        ("Conclusion",
         "La scène de la table est célèbre parce qu'elle réunit tout ce que peut le "
         "théâtre : un dispositif visible, une parole à double sens, et un renversement "
         "complet. Orgon y perd son autorité en même temps qu'il retrouve la vue. Il ne la "
         "récupérera pas : au dernier acte, c'est encore un autre qui le sauvera."),
    ],
    comprendre=[
        "Où se trouve Orgon pendant toute cette scène ? Qui l'y a mis, et pourquoi ?",
        "Quel obstacle Elmire oppose-t-elle d'abord à Tartuffe ? Que répond-il ?",
        "Quelle phrase de Tartuffe décide enfin Orgon à sortir ?",
    ],
    analyser=[
        "« Le ciel défend, de vrai, certains contentements ; / Mais on trouve avec lui des "
        "accommodements. » a) Quel mot de liaison sépare les deux vers ? b) Que fait ce mot "
        "au raisonnement ? c) Reformulez la thèse de Tartuffe en une phrase simple.",
        "a) Relevez les répliques d'Elmire qui ont deux sens. b) Pour chacune, dites ce que "
        "comprend Tartuffe et ce que comprend Orgon. c) Comment appelle-t-on ce procédé de "
        "théâtre ?",
        "« Elle fait mettre son mari derrière elle. » a) Qui protège qui, à la fin de "
        "l'extrait ? b) Comparez avec la place d'Orgon au premier acte. c) Que montre ce "
        "déplacement ?",
    ],
    parcours1=[
        "a) Relevez les mots par lesquels Tartuffe désigne ce qu'il demande à Elmire.",
        "b) Montrez qu'aucun de ces mots ne dit clairement la chose, et dites comment on "
        "appelle ce procédé.",
    ],
    parcours2=[
        "a) Montrez qu'Elmire ne subit pas la scène mais la dirige, en vous appuyant sur "
        "quatre de ses répliques.",
        "b) Expliquez pourquoi il fallait qu'Orgon entende lui-même, et non qu'on lui "
        "rapporte.",
    ],
    synthese="Pourquoi Orgon a-t-il besoin de voir et d'entendre, quand Dorine et Damis "
             "avaient compris depuis le premier acte ?",
    examen="**Vers le commentaire composé.** Rédigez entièrement l'axe III du plan "
           "ci-dessus, en trois paragraphes, en accordant une place particulière aux "
           "didascalies.",
    ouverture="À rapprocher de la fiche 2 : Orgon répétait « Le pauvre homme ! » sans "
              "écouter ; il lui aura fallu se cacher sous une table pour entendre enfin.",
    encadres=[
        ("saviez", "Une phrase que Molière a écrite pour se défendre", [
            "Au milieu de cette scène, une ligne en italique interrompt le dialogue : "
            "« C'est un scélérat qui parle. » Elle n'est prononcée par personne.",
            "Molière l'a ajoutée à l'impression de 1669, après cinq ans d'interdiction. Ses "
            "adversaires prétendaient que la pièce enseignait à tromper le ciel. En plaçant "
            "cette note à l'endroit le plus dangereux du texte, l'auteur signale que la "
            "doctrine exposée est celle d'un criminel, et non la sienne. C'est un rare cas "
            "où l'on voit un écrivain se protéger à l'intérieur même de son œuvre.",
        ]),
        ("methode", "Commenter une scène à double destinataire", [
            "Quand un personnage caché écoute, chaque réplique a deux destinataires. Pour "
            "en rendre compte proprement :",
            "- **Nommez les deux destinataires** avant d'analyser : celui à qui l'on parle, "
            "celui à qui l'on fait entendre.",
            "- **Donnez les deux sens de la citation**, dans cet ordre : ce que comprend le "
            "personnage trompé, puis ce que comprend le témoin caché.",
            "- **Concluez sur le spectateur**, qui est le seul à recevoir les deux sens en "
            "même temps. C'est là que se loge le comique.",
        ]),
    ],
)


# ═════════════════════════════════════════════════════════════ FICHE 6
F6 = dict(
    titre="Fiche 6 — « Qui ? moi, monsieur ? — Oui, vous. »",
    repere=X.REPERES["E6"],
    extrait=X.E6,
    source=X.REFERENCES["E6"],
    objectif="Étudier un dénouement où l'imposteur triomphe pendant cinquante vers avant "
             "d'être arrêté en deux mots, et discuter la vraisemblance de cette fin.",
    situation=(
        "Tartuffe possède désormais la maison et une cassette de papiers compromettants. "
        "Il est allé dénoncer Orgon au roi. Il revient avec un officier de police, "
        "l'Exempt, pour faire arrêter celui qui l'avait accueilli. C'est la dernière scène "
        "de la pièce."
    ),
    mouvements=[
        "**L'arrestation annoncée** (« Tout beau, monsieur, tout beau… ») : Tartuffe "
        "empêche Orgon de fuir.",
        "**Le concert des reproches** (« Vos injures n'ont rien à me pouvoir aigrir… ») : "
        "cinq personnages attaquent tour à tour, Tartuffe répond à chacun.",
        "**Le démontage par Cléante** (« Mais, s'il est si parfait que vous le "
        "déclarez… ») : deux questions précises, auxquelles Tartuffe ne répond pas.",
        "**Le retournement** (« Oui, c'est trop demeurer, sans doute, à l'accomplir. ») : "
        "l'Exempt arrête Tartuffe.",
        "**Le refus d'explication** (« Ce n'est pas vous à qui j'en veux rendre raison. ») : "
        "l'officier ne s'explique pas devant lui.",
    ],
    lexique=[
        ["tout beau", "doucement ! Formule pour arrêter quelqu'un."],
        ["votre gîte", "votre logement. Ici, ironique : la prison."],
        ["le prince", "le roi."],
        ["ce trait", "ce coup, cette manœuvre."],
        ["aigrir", "irriter, mettre en colère."],
        ["je suis appris à", "j'ai appris à, on m'a appris à."],
        ["la modération", "le calme, la retenue."],
        ["impudemment", "sans aucune honte."],
        ["se jouer de", "se moquer de, tromper."],
        ["un emploi", "ici : une mission, une charge."],
        ["ingrat", "qui ne reconnaît pas le bien qu'on lui a fait."],
        ["des secours", "de l'aide, des bienfaits."],
        ["de si puissants nœuds", "des liens si forts. Il parle de son devoir envers le "
                                  "roi."],
        ["imposteur", "personne qui se fait passer pour ce qu'elle n'est pas."],
        ["de traîtresse manière", "d'une manière de traître."],
        ["révérer", "respecter profondément."],
        ["en distraire", "en détourner."],
        ["la criaillerie", "les cris, les protestations. Mot méprisant."],
        ["demeurer", "ici : tarder, rester sans agir."],
        ["tout à l'heure", "tout de suite. Le sens a changé depuis le XVIIᵉ siècle."],
        ["rendre raison", "donner des explications, se justifier."],
    ],
    axes=[
        ("Un imposteur qui change de masque sans changer de méthode",
         [
             "**Le ciel cède la place au prince.** Pendant quatre actes, Tartuffe invoquait "
             "« le ciel ». Ici, il invoque « le prince » : « de la part du prince on vous "
             "fait prisonnier », « l'intérêt du prince est mon premier devoir ». Le nom "
             "change, la manœuvre est la même — se couvrir d'une autorité que personne "
             "n'ose contester.",
             "**Le mot « devoir » revient quatre fois.** « mon premier devoir », « De ce "
             "devoir sacré la juste violence », « je ne songe à rien qu'à faire mon "
             "devoir ». La répétition transforme une trahison en obligation morale.",
             "**Le sommet du cynisme.** « Et je sacrifierais à de si puissants nœuds / "
             "Amis, femme, parents, et moi-même avec eux. » L'énumération va du plus "
             "lointain au plus proche, et se termine par lui-même : c'est une gradation. "
             "Tartuffe se présente en martyr au moment où il livre son bienfaiteur.",
             "**Dorine trouve l'image exacte.** « Comme il sait de traîtresse manière / Se "
             "faire un beau manteau de tout ce qu'on révère ! » Le manteau est une "
             "métaphore : ce que l'on respecte — la religion, le roi — devient un vêtement "
             "qu'on endosse. En deux vers, la servante définit l'imposture mieux que "
             "personne.",
         ]),
        ("Une famille devenue chœur",
         [
             "**Cinq personnages attaquent en cinq répliques.** Cléante, Damis, Mariane, "
             "Elmire, Dorine : chacun parle une fois, brièvement, et Tartuffe répond à "
             "chacun. La scène est construite comme un tir groupé.",
             "**Chacun garde son registre.** Cléante est ironique : « La modération est "
             "grande, je l'avoue ! ». Damis est violent : « l'infâme impudemment se joue ». "
             "Mariane est ironique à son tour : « cet emploi pour vous est fort honnête à "
             "prendre ». Elmire est brève : « L'imposteur ! ». Dorine analyse. Les "
             "caractères posés au premier acte tiennent jusqu'au dernier.",
             "**Cléante seul argumente.** Il pose deux questions qui n'ont pas de réponse : "
             "pourquoi Tartuffe a-t-il attendu d'être chassé pour dénoncer ? et pourquoi "
             "a-t-il accepté la donation s'il jugeait Orgon coupable ? Ce sont les seules "
             "vraies objections de la scène.",
             "**Tartuffe refuse le débat.** « Délivrez-moi, monsieur, de la criaillerie. » "
             "Le mot « criaillerie » réduit cinq argumentations à un bruit. Ne pas répondre "
             "est sa dernière défense — et c'est cette phrase même qui va le perdre.",
         ]),
        ("Un dénouement en deux mots",
         [
             "**L'Exempt retourne la situation avec la phrase de Tartuffe.** « Votre bouche "
             "à propos m'invite à le remplir. » Tartuffe a réclamé qu'on exécute l'ordre : "
             "on l'exécute, contre lui. Le procédé est le même qu'à l'acte III, où il "
             "réclamait son châtiment — mais cette fois, il l'obtient.",
             "**Trois répliques suffisent.** « Qui ? moi, monsieur ? — Oui, vous. — Pourquoi "
             "donc la prison ? » Après cinquante vers de longues tirades, le rythme se brise "
             "en répliques de deux ou trois mots. Le changement de rythme est le signe du "
             "renversement.",
             "**Le refus de s'expliquer est un jugement.** « Ce n'est pas vous à qui j'en "
             "veux rendre raison. » L'Exempt ne discute pas avec Tartuffe : il le traite en "
             "objet de la procédure, non en interlocuteur. Le personnage qui parlait sans "
             "cesse est renvoyé au silence.",
             "**Un sauvetage qui vient du dehors.** Aucun personnage de la maison n'a "
             "défait Tartuffe. C'est un envoyé du roi, arrivé au dernier moment, qui règle "
             "tout. On appelle cela un deus ex machina : une solution qui tombe de "
             "l'extérieur. Molière l'assume, et la pièce y gagne un hommage au roi — le "
             "même roi dont il attendait, depuis cinq ans, l'autorisation de jouer.",
         ]),
    ],
    forme=[
        "**La répétition d'ouverture** — « Tout beau, monsieur, tout beau ». La formule "
        "encadre le premier hémistiche et donne à Tartuffe, dès son entrée, le ton du "
        "maître.",
        "**L'ironie** — « La modération est grande, je l'avoue ! », « cet emploi pour vous "
        "est fort honnête à prendre ». Les mots sont élogieux, l'intention est accusatrice.",
        "**La métaphore** — « se faire un beau manteau de tout ce qu'on révère ». Une "
        "métaphore est une comparaison sans mot de comparaison. Celle-ci donne à voir "
        "l'imposture comme un vêtement.",
        "**La gradation** — « Amis, femme, parents, et moi-même avec eux » : du plus "
        "éloigné au plus intime.",
        "**La stichomythie finale** — les répliques les plus courtes de la scène arrivent "
        "au moment du retournement. La longueur des répliques est ici un instrument : elle "
        "mesure qui domine.",
    ],
    plan=[
        ("Introduction",
         "Tartuffe possède la maison d'Orgon et revient avec un officier de police pour "
         "faire arrêter son bienfaiteur. La dernière scène de la pièce commence donc par le "
         "triomphe de l'imposteur. On montrera comment Molière laisse ce triomphe se "
         "déployer entièrement avant de le briser en trois répliques, et ce que cette "
         "construction dit du personnage."),
        ("I. Un masque remplacé par un autre",
         [
             "A. Du ciel au prince : la même méthode sous un autre nom.",
             "B. « Devoir », quatre fois : la trahison présentée comme une obligation.",
             "C. « Se faire un beau manteau de tout ce qu'on révère » : la définition donnée "
             "par Dorine.",
         ]),
        ("II. Une famille qui parle enfin d'une seule voix",
         [
             "A. Cinq personnages, cinq attaques, cinq registres.",
             "B. Cléante seul argumente : deux questions restées sans réponse.",
             "C. « La criaillerie » : Tartuffe refuse le débat, et se perd par cette phrase.",
         ]),
        ("III. Un retournement de trois répliques",
         [
             "A. L'ordre réclamé par Tartuffe exécuté contre lui.",
             "B. La rupture de rythme : de la tirade à deux mots.",
             "C. Le refus de rendre raison : l'imposteur renvoyé au silence.",
         ]),
        ("Conclusion",
         "La pièce ne se dénoue pas par la force de la vérité mais par l'intervention d'un "
         "pouvoir extérieur. On peut y voir une faiblesse ; on peut aussi y voir une "
         "lucidité : dans la maison d'Orgon, personne n'était en état d'arrêter Tartuffe. "
         "Molière laisse au spectateur le soin de décider ce qui se serait passé si le roi "
         "n'avait pas envoyé son officier."),
    ],
    comprendre=[
        "Pourquoi Tartuffe revient-il accompagné d'un officier de police ?",
        "Quels personnages prennent la parole contre lui ? Citez-les dans l'ordre.",
        "Que se passe-t-il finalement ? Qui est arrêté ?",
    ],
    analyser=[
        "a) Relevez toutes les occurrences du mot « devoir » et du mot « prince ». b) Que "
        "remplacent-ils, par rapport aux quatre premiers actes ? c) Que montre ce "
        "remplacement sur le personnage ?",
        "« Comme il sait de traîtresse manière / Se faire un beau manteau de tout ce qu'on "
        "révère ! » a) Quelle figure de style est employée ? b) Que désigne le manteau ? "
        "c) Pourquoi cette image convient-elle à Tartuffe mieux qu'une insulte ?",
        "a) Comparez la longueur des répliques au début et à la fin de l'extrait. b) À quel "
        "moment le changement se produit-il ? c) Quel effet cette rupture produit-elle ?",
    ],
    parcours1=[
        "a) Relevez les deux questions que Cléante pose à Tartuffe.",
        "b) Dites, pour chacune, ce qu'elle reproche exactement, et si Tartuffe y répond.",
    ],
    parcours2=[
        "a) Montrez que l'arrestation de Tartuffe est obtenue par sa propre phrase.",
        "b) Discutez : ce dénouement vous paraît-il satisfaisant ? Vous justifierez votre "
        "réponse par deux arguments tirés du texte.",
    ],
    synthese="Molière avait-il d'autres moyens de terminer sa pièce ? Que perdrait-elle, ou "
             "que gagnerait-elle, si Tartuffe était démasqué par la famille elle-même ?",
    examen="**Vers la dissertation.** « Un dénouement de comédie doit rassurer le "
           "spectateur. » Cette affirmation vous paraît-elle vérifiée par la fin du "
           "Tartuffe ? Rédigez l'introduction et le plan détaillé en deux parties.",
    ouverture="À rapprocher de la fiche 1 : la pièce s'ouvrait sur une famille qui ne "
              "pouvait pas finir ses phrases ; elle s'achève sur un imposteur à qui l'on "
              "refuse de répondre.",
    encadres=[
        ("saviez", "Le deus ex machina", [
            "L'expression est latine : « le dieu descendu par la machine ». Au théâtre "
            "antique, une machine faisait descendre un dieu sur la scène pour régler une "
            "situation devenue insoluble.",
            "On appelle aujourd'hui deus ex machina toute solution qui vient du dehors, "
            "sans avoir été préparée par l'action. La critique lui reproche en général "
            "d'être facile. Dans Le Tartuffe, l'arrivée de l'Exempt en est un exemple "
            "célèbre — et il faut se rappeler que Molière attendait, au moment où il "
            "l'écrivait, une décision du roi sur sa propre pièce.",
        ]),
        ("astuce", "Discuter un dénouement en devoir", [
            "Un sujet vous demandera souvent si une fin est réussie. Trois entrées sûres :",
            "- **La vraisemblance** : la solution était-elle préparée par ce qui précède ?",
            "- **La justice** : chacun reçoit-il ce qu'il mérite ? Ici, Orgon récupère ses "
            "biens, mais on ne lui demande jamais de rendre des comptes à son fils.",
            "- **Le sens** : ce que la fin dit du monde de la pièce. Ici, que la famille "
            "seule n'aurait pas pu se défendre.",
            "Prenez position, mais appuyez chaque affirmation sur une citation.",
        ]),
    ],
)

FICHES_TA_4_6 = [F4, F5, F6]
