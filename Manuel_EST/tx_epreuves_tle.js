/* =====================================================================
   Épreuves réelles VERBATIM — classe de Terminale (Baccalauréat)
   Sources : sujets officiels MINESEC/OBC (Downloads), compilations du Centre.
   Seules les coquilles d'OCR évidentes ont été corrigées.
   ===================================================================== */

const baremeDissertSTT = { head:["Critères","Indicateurs"], w1:2050, rows:[
  ["Compréhension / Pertinence (6 pts)","Respect du type de production attendue (dissertation) ; reformulation correcte du sujet et expression claire et pertinente de la problématique ; qualité des idées, des arguments et des exemples."],
  ["Organisation / Cohérence (6 pts)","Respect de la structure de l'exercice (introduction, développement, conclusion) ; enchaînement logique des idées et utilisation judicieuse des connecteurs logiques ; convergence des idées vers un même but (cohésion)."],
  ["Correction de l’expression (6 pts)","Utilisation d’un vocabulaire juste, précis et varié ; respect des normes orthographiques ; respect des normes de la syntaxe et utilisation correcte des temps verbaux."],
  ["Originalité (2 pts)","Originalité du vocabulaire ; respect des alinéas et de la mise en page ; copie propre, écriture lisible, aérée, sans ratures."],
]};

/* ---------- BACCALAURÉAT ACA/ACC/CG/FIG 2021 — FRANÇAIS (3 h, coef 2) ---------- */
const ocdeBAC = {
  entete:{ examen:"MINESEC / OBC — BACCALAURÉAT ACA, ACC, CG, FIG (sujet officiel, session 2021)", epreuve:"Français", duree:"3 h", coef:"2", nb:"Le candidat traitera l’un des deux sujets au choix." },
  blocs:[
    { h:"Sujet de type I : Résumé de texte et langue",
      texte:{ motsOfficiel:470, titre:"L’immigration apporte une plus-value économique",
      source:"OCDE, Perspectives des migrations internationales, « Résumé en français », Éditions OCDE, 2013",
      paras:[
        "L’apport économique des immigrés doit être évalué avec prudence, étant donné la difficulté de le chiffrer. Cependant, selon un document de l’OIT, l’influence économique de l’immigration semble plutôt positive. L’OCDE, quant à elle, juge son impact sur les finances publiques limité et estime qu’il serait bénéfique d’améliorer le taux d’emploi des immigrés, singulièrement dans certains États européens comme la Belgique, le problème n’étant pas le manque de bonne volonté des immigrés, mais la discrimination à l’embauche dont ils sont victimes — constat étayé par de nombreuses études. L’OCDE observe que « la discrimination à l’encontre des immigrés et de leurs enfants sur le marché du travail et dans la société dans son ensemble peut avoir des répercussions négatives sur la cohésion sociale et sur les incitations à investir dans l’éducation. Elle peut aussi entraîner une perte économique pour le pays d’accueil. » Toujours selon l’OCDE, l’immigration en Belgique rapporte en moyenne près de 3 500 euros de rentrées fiscales par individu par an (déduction faite des prestations sociales dont les immigrés bénéficient) et son impact sur les salaires est plutôt positif.",
        "En toute logique, les personnes d’origine étrangère consomment et payent des taxes au sein du pays hôte, donc leur argent est difficilement réinjecté dans l’économie locale (on ne peut pas en dire autant de certaines entreprises multinationales et personnalités people, habiles à contourner le fisc). De plus, loin de rester passives, certaines deviennent elles-mêmes chefs d’entreprise ; de ce fait, elles créent des emplois directs, pour elles-mêmes si elles sont indépendantes, mais aussi pour d’autres quand elles engagent des employés.",
        "D’après un avis du Comité économique et social européen (CESE), il semble même que les immigrés aient « davantage l’esprit d’entreprise que les autochtones ». En Europe, « les entrepreneurs issus de l’immigration contribuent à la croissance économique et à l’emploi, bien souvent en donnant un nouveau souffle à des secteurs délaissés du commerce et de l’artisanat et participent de plus en plus à la fourniture de biens et de services à valeur ajoutée. » Ils « créent en moyenne entre 1,4 et 2,1 emplois supplémentaires ». […]",
        "Cela dit, même si l’apport économique des immigrés plaide en leur faveur, on ne peut se contenter d’aborder la question migratoire uniquement sous cet angle. Pour reprendre les termes d’un rapport de l’OIT, les migrants « ne devraient pas être perçus comme une réserve de main-d’œuvre taillable et corvéable à merci, internationalement mobile au gré des besoins. »",
        "Enfin, si le poids économique pour le pays hôte pèse dans la balance, il est aussi important pour le pays d’origine. Des montants colossaux sont envoyés par les migrants vers leur terre de départ, où ils ont bien souvent laissé des proches...",
      ]},
      qs:[ "RÉSUMÉ : 10 points — Ce texte compte 470 mots. Résumez-le en 117 mots. Une marge de 12 mots en plus ou en moins est tolérée. Vous indiquerez le nombre exact de mots utilisés à la fin de votre résumé." ]},
    { h:"LANGUE : 8 points — Communication (2 pts)", qs:[
      "a. À partir des indices textuels ou paratextuels, dites si la présence de l’émetteur dans ce texte est explicite ou implicite. À qui s’adresse-t-il ? (0,5 pt × 2)",
      "b. Soit la phrase suivante : « D’après un avis du Comité économique et social européen (CESE), il semble même que les immigrés aient “davantage l’esprit d’entreprise que les autochtones”. » — Identifiez-y un présupposé et un sous-entendu, puis justifiez l’intention de communication de l’auteur. (1 pt)",
    ]},
    { h:"Morphosyntaxe (2 pts)", qs:[
      "a. Donnez la nature grammaticale et la valeur du mot « cependant » dans la phrase suivante : « Cependant, selon un document de l’OIT, l’influence économique de l’immigration semble plutôt positive. » (1 pt)",
      "b. Soit la phrase : « Cela dit, même si l’apport économique des immigrés plaide en leur faveur, on ne peut se contenter d’aborder la question migratoire uniquement sous cet angle. » — À quels temps et mode sont conjugués les verbes de cette phrase ? (0,5 pt) — Justifiez l’emploi de ce temps. (0,5 pt)",
    ]},
    { h:"Sémantique / Lexicologie (2 pts)", qs:[
      "a. Expliquez les mots et expressions suivants : « immigrés », « pays hôte ». (0,5 pt × 2)",
      "b. Construisez à partir des mots et expressions du texte le champ lexical de l’immigration et celui de l’économie (au moins 03 mots de nature différente par champ). Quel est l’effet de sens produit par leur association ? (1 pt)",
    ]},
    { h:"Stylistique / Rhétorique (2 pts)", qs:[
      "a. Soit la phrase : « Des montants colossaux sont envoyés par les migrants vers leur terre de départ, où ils ont bien souvent laissé des proches... » — Quelle est la figure de style utilisée dans cette phrase ? (0,5 pt) — Précisez sa valeur d’emploi. (0,5 pt)",
      "b. À quel type appartient ce texte ? Justifiez votre réponse par deux indices textuels de nature différente. (1 pt)",
      "III. PRÉSENTATION : 2 points",
    ]},
    { h:"Sujet de type II : Dissertation littéraire", qs:[
      "Jacques Lacarrière affirme : « Les gens ne s’intéressent pas aux héros heureux. Il leur faut du tragique, du mythique, du monstrueux, du terrifiant. »",
      "Justifiez ces propos à la lumière des œuvres littéraires lues et/ou étudiées dans le cadre de votre programme.",
    ], bareme:baremeDissertSTT },
  ]};

/* ---------- BACCALAURÉAT ACA/ACC/CG/FIG — épreuve zéro ---------- */
const laurasBAC = {
  entete:{ examen:"MINESEC / OBC — BACCALAURÉAT ACA, ACC, CG, FIG (épreuve zéro officielle)", epreuve:"Français", duree:"3 h", coef:"2", nb:"Le candidat traitera l’un des deux sujets au choix." },
  blocs:[
    { h:"Sujet de type I : Résumé et langue",
      texte:{ motsOfficiel:473, titre:"Les jeunes, les structures familiales et l’État",
      source:"Thérèse Lauras-Locoh et Nuria Lopez, Les Jeunes en Afrique : enjeux démographiques, enjeux sociaux",
      paras:[
        "Dans les sociétés rurales africaines, les jeunes passent sans discontinuité de l’enfance à l’âge adulte tout en restant « dépendants » du lignage. La prise en charge des jeunes, d’un « coût » très limité, est assurée par la collectivité familiale, qui a pour conscience de faire un investissement rapidement productif, puisque dès 10-12 ans un jeune entre dans ce que nous appelons la « population active ».",
        "De plus, cette prise en charge incombe au lignage et non aux seuls parents directs des enfants. La circulation des enfants au sein d’un groupe lignager contribue à répartir au mieux les coûts de l’éducation des enfants. […] Cet échange d’enfants fait partie des normes qui renforcent les liens entre les segments du lignage et entre les générations. Un enfant confié contracte une dette à l’égard des adultes qui l’ont accueilli, envers lesquels il se sentira, plus tard, des responsabilités comme envers ses propres parents.",
        "Cette façon de répartir les « coûts » de l’éducation des enfants est maintenant remise en question par les nouvelles aspirations des familles à l’éducation et par les mouvements d’urbanisation, qui obligent à substituer l’emploi urbain, souvent salarié, à l’emploi agricole, dont les revenus étaient contrôlés par les anciens.",
        "La croissance de la population urbaine et les mouvements migratoires, qui sont essentiellement le fait de jeunes en quête d’emploi et de formation, ouvrent de nouvelles perspectives. Les jeunes se reconnaissent en tant que groupe doté d’un début d’autonomie, par rapport à la famille, soit par l’éloignement, soit par le savoir, soit par l’acquisition d’un revenu personnel (emploi salarié).",
        "Mais ce qui est le plus important, une partie des besoins des jeunes africains sort du cadre lignager et doit être satisfaite par des institutions mises en place par l’État ou des collectivités privées. Ces besoins sont fortement ressentis par les jeunes comme par leurs parents. Ceux-ci, considérant, comme ils l’ont toujours fait, leurs enfants comme le seul « investissement » rentable, sont prêts à d’énormes sacrifices pour que ceux-ci s’insèrent dans les nouveaux secteurs économiques et en fassent ainsi bénéficier leur groupe familial tout entier. Mais de plus en plus, ils ont conscience du rôle que doivent jouer les États dans la réponse à donner aux aspirations des jeunes.",
        "L’augmentation rapide de la population jeune s’accompagne de changements sociaux qui déplacent en partie les responsabilités des structures familiales traditionnelles vers des structures institutionnelles étatiques ou para-étatiques.",
        "L’école en est l’exemple le plus évident. La croissance des effectifs à scolariser n’est pas seulement démographique. Elle est renforcée par la croissance, encore plus rapide, de la « demande sociale » d’enseignement. Une fraction de plus en plus étendue de la population aspire à l’éducation et à des études de plus longue durée.",
      ]},
      qs:[ "I — RÉSUMÉ : 10 POINTS — Ce texte compte 473 mots environ. Vous en ferez un résumé de 118 mots. Une marge de 12 mots en plus ou en moins sera tolérée. Veuillez, à la fin de votre résumé, indiquer le nombre exact de mots utilisés." ]},
    { h:"II — LANGUE : 8 POINTS — A. Communication (2 pts)", qs:[
      "1. Qui est l’émetteur de ce texte et quel thème principal aborde-t-il dans ce passage ? Justifiez votre réponse à l’aide d’indices textuels. (1 pt)",
      "2. Soit l’énoncé : « [Les parents] sont prêts à d’énormes sacrifices pour que [leurs enfants] s’insèrent dans les nouveaux secteurs économiques et en fassent ainsi bénéficier leur groupe familial tout entier. » — Dégagez le sous-entendu contenu dans ce passage et déduisez-en l’intention de communication du locuteur. (1 pt)",
    ]},
    { h:"B. Morphosyntaxe (2 pts)", qs:[
      "Soient les phrases suivantes : « Cet échange d’enfants fait partie des normes qui renforcent les liens entre les segments du lignage et entre les générations. Un enfant confié contracte une dette à l’égard des adultes qui l’ont accueilli, envers lesquels il se sentira, plus tard, des responsabilités comme envers ses propres parents. »",
      "1. À quelle structure de phrase appartiennent-elles ? Pourquoi le locuteur en fait-il l’usage ? (1 pt)",
      "2. Reliez ces deux phrases de manière à obtenir une subordonnée de conséquence. (1 pt)",
    ]},
    { h:"C. Sémantique / Lexicologie (2 pts)", qs:[
      "1. Construisez à partir du texte le champ lexical de la jeunesse, celui de l’État et celui de la famille. Montrez ensuite quelles relations ils entretiennent dans le texte. (1,25 pt)",
      "2. Trouvez un synonyme au mot « anciens » dans le passage : « les revenus étaient contrôlés par les anciens », et réemployez-le dans une phrase qui en éclaire le sens. (0,75 pt)",
    ]},
    { h:"D. Stylistique / Rhétorique des textes (2 pts)", qs:[
      "1. À quel type appartient ce texte ? Justifiez votre réponse à l’aide de deux indices textuels de nature différente. (1 pt)",
      "2. Soit l’énoncé : « Les jeunes se reconnaissent en tant que groupe doté d’un début d’autonomie, par rapport à la famille, soit par l’éloignement, soit par le savoir, soit par l’acquisition d’un revenu personnel (emploi salarié). » — Identifiez la figure de style qui y est employée (0,5 pt) ; indiquez l’effet de sens qui se dégage de son emploi. (0,5 pt)",
      "III — PRÉSENTATION : 2 POINTS",
    ]},
    { h:"Sujet de type II : Dissertation", qs:[
      "Friedrich Nietzsche affirme : « L’artiste a le pouvoir de réveiller la force d’agir qui sommeille dans d’autres âmes. »",
      "Montrez en quoi cette déclaration éclaire sur le rôle de l’écrivain dans la société. Vous prendrez appui sur les œuvres littéraires que vous avez lues ou étudiées.",
    ]},
  ]};

/* ---------- Épreuve de séquence du Centre — LITTÉRATURE Tle C/D (Tchatchoua) ---------- */
const tchatchouaLitt = {
  entete:{ examen:"Centre VÉRITAS — Épreuve de littérature de séquence (Tle C/D — format Baccalauréat)", epreuve:"Littérature : contraction de texte et discussion", duree:"3 h", coef:"2" },
  blocs:[
    { texte:{ motsOfficiel:534,
      source:"Thomas Tchatchoua, Les bamilékés au Cameroun, L’Harmattan, 2012",
      paras:[
        "L’Afrique est le continent des ethnies, qui ont tendance à s’exclure mutuellement. Le phénomène, feutré et pudique généralement, a quelquefois dégénéré en conflits ouverts qui ont menacé jusqu’à l’existence même des États. La guerre du Biafra de 1967, le génocide rwandais de 1994, la question touareg au Mali, quelles qu’en soient les causes, gardent toujours en toile de fond un goût d’exclusion d’un groupe ethnique ou culturel par les autres.",
        "Au Cameroun, l’ethnie est un sujet ultra sensible. Tout le monde l’esquive, tout le monde se comporte comme si la tribu n’existait pas mais, en secret, tout le monde vit sa tribalité comme une infrastructure de base et une référence essentielle qui portent l’individu et décident en premier et en dernier ressort du destin de chacun.",
        "Combien sont-ils les Camerounais, travailleurs, intègres, compétents, dont le destin a été compromis par la loi du hasard, le diktat d’une naissance qui leur est tombée dessus ? D’autres, moins méritants, parfois d’illustres fainéants, qui se sont contentés de naître, occupent les avant-scènes de la société qu’ils contribuent à saborder, évidemment et malheureusement.",
        "L’injustice est une perversité universelle, nous dira-t-on. Mais, ce qui est conjoncturel et accidentel ailleurs est érigé en système chez nous et c’est ce qui fait problème ! Depuis la naissance de l’État, c’est dans l’ambiance des iniquités sociales que les Camerounais sont forgés. On peut imaginer la qualité du matériau humain en ouvrage dans notre pays. Entièrement à refondre !",
        "En septembre 1989, dans un lycée de notre pays, au cours d’une ronde de contrôle, nous tombons sur le cas d’un enfant, la douzaine à peine, dont le nom ne figurait pas sur la liste des admis au concours d’entrée en 6e. Pendant que ses camarades crient : « para, para ! », le petit bonhomme, candide et sûr de lui, défend sa présence en ces termes : « Monsieur, on a fait la godasse ». Et on, c’était son père, sa mère, ou une relation de sa famille, qui a usé de son influence ou de son argent, la godasse, pour le « parachuter » là où, en principe, seule, l’admission au concours donne accès.",
        "Une douzaine d’années plus tôt, dans un établissement similaire du Nord, un gaillard de la classe terminale avait sorti, sans doute fièrement : « L’argent se cultive au Sud et se récolte au Nord ». Mesurait-il la gravité de la situation qu’il représentait ainsi ? Il ne croyait pas si bien dire, en tout cas.",
        "« Godasse, récolte par les uns de ce que les autres cultivent » ! Ces âpres métaphores résument parfaitement l’atmosphère dans laquelle se déroule l’éducation de nos enfants. D’une part, la force ou la magouille qui peuvent se substituer au mérite et au droit et, de l’autre, le détournement par les uns de l’effort consenti par les autres. Tristes reflets d’une société où prévalent la corruption et la discrimination, deux grands fléaux qui ruinent le Cameroun ; que nous regardons souvent, complices ou désarmés, par égoïsme ou calculs politiciens, comme des valeurs nouvelles ou comme si nous attendions notre délivrance d’une main étrangère. Malheureusement, la question ethnique, épicentrale à la géopolitique nationale au Cameroun, est de ces sujets que le visiteur de passage percevra difficilement.",
      ]},
      qs:[
        "1. Résumé / 9 pts. — Ce texte compte 534 mots. Faites-en un résumé de 134 mots. Une marge de 13 mots en plus ou en moins vous est accordée. Vous indiquerez à la fin de votre résumé le nombre de mots utilisés.",
        "2. Discussion / 9 pts. — Selon l’auteur, « la question ethnique [est] épicentrale à la géopolitique nationale au Cameroun ». Pensez-vous, comme cet auteur, que le tribalisme est le principal problème de gouvernance au Cameroun ? Vous répondrez à cette question dans une argumentation bien organisée et illustrée par des exemples tirés de votre expérience.",
        "3. Présentation / 2 pts.",
      ]},
  ]};

/* ---------- Texte long d'entraînement — Jeune Afrique (585 mots) ---------- */
const jeuneAfrique = {
  titre:"La condition des États africains", motsOfficiel:585,
  source:"Jeune Afrique, n° 1545/46 — 8 au 21 août 1990, p. 171",
  paras:[
    "L’Afrique a entamé une révolution libératrice dès la fin de la Seconde Guerre mondiale. Cette révolution avait pour but la rupture du cordon ombilical qui enchaînait le continent à l’impérialo-colonialisme. Elle se situait dans le contexte de la lutte libératrice de tout ce monde qu’on nomme aujourd’hui « Tiers-Monde ». Mais, tandis que l’Inde, la Chine, le Vietnam, voire l’Algérie ont réussi à mener ce combat à terme, l’Afrique noire, et surtout ses régions dites francophones, n’a pas achevé sa révolution.",
    "Après trois à quatre siècles de « traite du bois d’ébène » et d’esclavage, après un siècle de colonisation, il apparaît clair maintenant que l’Afrique noire avait besoin d’un « choc salutaire » qui l’eût lavée de toutes souillures et humiliations, qui lui eût permis de recouvrer sa place de créatrice à part entière dans le concert des nations. Certes, « cela » n’eût pas à lui seul suffi à tout régler. Mais « cela » était indispensable… Or, nous nous sommes laissé embarquer dans un système d’asservissement beaucoup plus subtil et plus pernicieux que le colonialisme classique, le néocolonialisme, qui n’a fait que renforcer le cordon ombilical avec l’ancien maître. Là gît la racine première, la cause fondamentale du mal qui ronge l’Afrique noire depuis les années 1960.",
    "La néo-colonisation européenne a consisté à placer à la tête des micro-États post-coloniaux des dictateurs autocrates qui, pour la plupart, n’avaient même pas participé à la lutte émancipatrice de nos peuples. Des hommes qui, ayant comploté pour accéder au pouvoir, n’ont aucune assise populaire, aucune légitimité. Des hommes qui, de ce fait, se trouvent aisément manipulables par leurs suppôts étrangers sans lesquels ils sauteraient rapidement comme des bulles de savon… Des despotes obscurs adossés à des armadas pléthoriques, à des oppositions ethniques sciemment suscitées, au régionalisme savamment entretenu. […]",
    "Au nom de la « raison d’État » qui n’est autre chose que l’égoïsme d’État, certaines puissances européennes ont stationné des troupes sophistiquées chez nous, prêtes à accourir, au profit des autocrates, contre nos peuples. Prêtes à sauvegarder des intérêts économiques, culturels et géostratégiques inavoués.",
    "Au moindre frémissement des populations africaines, ces puissances apportent leur soutien financier, diplomatique et militaire aux tenants des démocraties, y compris aux plus bouffonnes d’entre elles. Nos peuples s’en trouvent terrorisés, bâillonnés.",
    "Intrinsèquement, l’économie du néocolonialisme n’a aucune différence à revendiquer par rapport à celle du « pacte colonial » : elle est demeurée une économie de traite régie par l’échange inégal, incontrôlable de l’intérieur. C’est sur de telles bases que sont venus se greffer la corruption institutionnalisée, la gabegie et l’incurie notoire des nouvelles classes militaro-politico-affairistes qui, systématiquement, pillent les ressources publiques de nos pays au profit de leurs comptes bancaires personnels.",
    "L’inadéquation des micro-États post-coloniaux crève les yeux. Il convient dès lors de repenser l’espace géopolitique global du continent, en transcendant les frontières héritées de la conférence de Berlin.",
    "Du fait de leur formation exogène et extravertie, nos intellectuels, dans leur majorité, ne constituent pas une entité intimement intégrée à leurs sociétés. Ils sont coupés des masses populaires qu’ils s’avèrent incapables de conduire vers le nécessaire renouveau.",
  ],
  consignes:[
    "Résumé / 9 pts. — Ce texte comporte 585 mots. Vous le résumerez en 147 mots. Une marge de 15 mots en plus ou en moins sera tolérée. Vous préciserez le nombre de mots exacts utilisés à la fin du résumé.",
    "Discussion / 9 pts. — Posant le problème de l’émancipation de l’Afrique vis-à-vis des puissances colonisatrices, ce numéro de Jeune Afrique déclare : « L’Afrique noire, et surtout ses régions dites francophones, n’a pas achevé sa révolution ». Pensez-vous que l’Afrique noire francophone continue de subir l’influence de l’ancienne puissance coloniale ? Vous répondrez à cette question à la lumière de votre culture générale.",
    "Présentation / 2 pts.",
  ]};

/* ---------- Texte support épreuve industrielle Tle (Nug Bissohong, 525 mots) ---------- */
const nug = {
  titre:"L’hymne national du Cameroun", motsOfficiel:525,
  source:"Thomas Théophile NUG BISSOHONG, L’hymne national du Cameroun (…), Éditions CLE, 2010",
  paras:[
    "C’est dans le cadre de l’animation d’un cours intitulé « littérature et société au Cameroun » que j’en suis venu à m’intéresser particulièrement au poème-chant « Ô Cameroun berceau de nos ancêtres ». J’ai alors découvert que ce texte, présenté par plusieurs auteurs d’anthologie de notre littérature et d’essais historiques comme œuvre patriotique de la première heure, a été produit en 1928, en français, par les élèves de l’école des instituteurs de FULASSI. Il a été consacré comme hymne national par l’assemblée législative du Cameroun, avant que trois de ses vers originaux ne soient modifiés. Nos députés ont également adopté comme « version anglaise » de l’hymne national un texte différent. À l’exception du premier vers qui leur est commun et qui sert de titre, les versions française et anglaise de l’hymne du Cameroun ont un contenu différent.",
    "Nous ne pouvons pas, hier comme aujourd’hui, prétendre faire de l’unité nationale un idéal essentiel pour notre société politique et nous côtoyer tous les jours en chantant simultanément des versions de l’hymne national qui n’expriment pas une même vision du monde, un projet commun de vie. La recherche du bien commun national aurait pu nous ouvrir courageusement les yeux sur l’incongruité symbolique dans laquelle nous vivons depuis près de 50 ans. La faute politique est là, paralysante à bien des égards. Elle contribue à plomber, voire vicier, à sa manière, notre quête permanente d’unité.",
    "« L’homme c’est sa parole », dit un proverbe camerounais, et les paroles d’un hymne national sont quasi sacrées. Nous chantons et faisons chanter celles du nôtre dans une cacophonie et une fourberie généralisées : à la présidence de la République, à l’Assemblée nationale, dans les ministères, dans les établissements scolaires et universitaires, au sein de l’armée, des partis politiques, des syndicats, sur les terrains de sport, dans les églises et les mosquées, partout, à l’intérieur comme à l’extérieur du pays. Cela est grave, car nous bâtissons et célébrons l’unité nationale sur la base d’une supercherie organique et instituée, laquelle pourrait bien être l’un des moteurs de la corruption dans laquelle nous avons mondialement excellé. Nous vivons ainsi dans le mensonge, l’hypocrisie et la confusion, toutes choses qui sont en partie l’héritage d’un colonialisme spirituel, dont nous nous rendons cependant complices des effets sournoisement pernicieux.",
    "La coexistence des deux hymnes que l’on chante actuellement est, en elle-même, porteuse de germes de division, pour un Cameroun qui aspire en permanence et légitimement à l’unité nationale. De plus, je pense que notre hymne national n’a pas nécessairement vocation à être pensé et produit soit en français, soit en anglais, des langues qui restent étrangères, même si elles sont devenues officielles. Quand bien même cela devait être le cas, la forme et le fond, qui sont habilement colonialistes dans le texte français adopté avant l’indépendance, devraient davantage s’inspirer de ce que nous sommes et voulons nous-mêmes devenir. Rien et personne ne nous empêche, par exemple, de consigner et de célébrer dans notre cantique national des figures emblématiques, des héros de la fondation de notre pays.",
  ],
  consignes:[
    "RÉSUMÉ : 8 pts — Ce texte comporte 525 mots. Vous en ferez un résumé de 132 mots. Une marge de 10 % en plus ou en moins vous est accordée. À la fin de votre résumé vous préciserez le nombre de mots utilisés.",
    "DISCUSSION : 10 pts — Partagez-vous l’opinion de Thomas Théophile NUG BISSOHONG lorsqu’il affirme : « La coexistence des deux hymnes que l’on chante actuellement est, en elle-même, porteuse de germes de division, pour un Cameroun qui aspire à l’unité nationale » ?",
    "PRÉSENTATION : 02 pts",
  ]};

/* ---------- Épreuve de séquence du Centre — LANGUE Tle (Verlaine) ---------- */
const oyonoLangue = {
  entete:{ examen:"Centre VÉRITAS — Épreuve de langue (Tle C-D-E-TI) — support : œuvre au programme", epreuve:"Langue française", duree:"2 h", coef:"1" },
  blocs:[
    { texte:{ sansCompte:true,
      source:"Ferdinand Oyono, Le vieux nègre et la médaille, 1956 (œuvre au programme)",
      paras:[
        "Une tristesse indéfinissable plissa son front. Il se remémorait ce bon vieux temps où il avait succédé à son père. Il était riche alors et on disait à Zourian « être riche comme Engamba ». En mourant, son père lui avait laissé dix jeunes femmes et sa mère. Kelara avait alors des seins gros comme des citrons. Engamba passait des journées dans la case à palabres, assis entre les jambes de l’une de ses femmes, en discutant des mille choses dont est faite la vie d’un polygame africain. C’était une vie facile, oisive, où il était le grand bénéficiaire de l’émulation qui opposait ses femmes. Il ne pensait pas, à l’époque, que les Blancs avec leur religion seraient redoutables pour son bonheur. Il se souvint de ce matin où le premier prêtre blanc était arrivé à Zourian… Il parlait des péchés mortels, du Paradis… On l’écoutait parce qu’on ne pouvait faire autrement. Les choses changèrent quand il parla du mariage religieux. Les femmes qui, jusque-là, tiraient sur la corde comme des chèvres attachées à un piquet usé, en profitèrent pour réclamer leur liberté par l’intermédiaire du baptême.",
        "Pressentant le danger et le ridicule dont il était menacé, Engamba prit les devants en se convertissant. Amalia était la seule de ses femmes qui acceptât de se marier à l’église avec lui. Ce jour-là, le prêtre parla de l’opération du Saint-Esprit, il parla, tout rouge, les yeux étincelants, du succès de la religion catholique romaine dans cette contrée perdue où la grâce de Dieu faisait ses premiers pas dans le cœur d’Engamba, le premier païen converti.",
        "Nkolo, lui, n’avait pas eu cette malchance. Il avait encore cinq femmes et allait bientôt « briser les pattes de l’antilope » pour la sixième fois.",
        "— Le veinard ! s’écria Engamba en levant les bras au ciel.",
      ]}},
    { h:"I — Communication (5 pts)", qs:[
      "1.a. Qui raconte cette histoire ? La focalisation du premier paragraphe est-elle interne, externe ou zéro ? Justifiez par deux indices. (1,5 pt)",
      "1.b. Que permet ce point de vue quant à la nostalgie d’Engamba ? (1 pt)",
      "2.a. « — Le veinard ! s’écria Engamba » : identifiez l’émetteur, le destinataire implicite et le type d’énoncé. (1,5 pt)",
      "2.b. Que révèle cette exclamation sur le regard qu’Engamba porte sur Nkolo ? (1 pt)",
    ]},
    { h:"II — Morphosyntaxe (5 pts)", qs:[
      "1.a. Relevez le temps verbal dominant du premier paragraphe et donnez sa valeur d’emploi. (1,5 pt)",
      "1.b. En quoi ce temps sert-il l’évocation du passé ? (1 pt)",
      "2.a. « Les femmes qui, jusque-là, tiraient sur la corde comme des chèvres attachées à un piquet usé, en profitèrent pour réclamer leur liberté » : analysez la structure de cette phrase (proposition principale, subordonnée, expansions). (1,5 pt)",
      "2.b. Quel effet produit cette phrase longue et ramifiée ? (1 pt)",
    ]},
    { h:"III — Sémantique / Lexicologie (5 pts)", qs:[
      "1.a. Construisez le champ lexical de la religion chrétienne et celui de la tradition africaine (polygamie) à partir du texte. (1,5 pt)",
      "1.b. Quel rapport (opposition, conflit ?) leur association révèle-t-elle ? (1 pt)",
      "2.a. Expliquez les mots « polygame » et « converti » ; pour « converti », précisez le procédé de formation. (1,5 pt)",
      "2.b. « Le premier païen converti » : quelle connotation (ironique ?) le narrateur donne-t-il à cette expression ? (1 pt)",
    ]},
    { h:"IV — Stylistique / Rhétorique (5 pts)", qs:[
      "1.a. Identifiez la figure de style dans « des seins gros comme des citrons », puis dans « comme des chèvres attachées à un piquet usé ». (1,5 pt)",
      "1.b. Que traduisent ces images sur la condition des femmes dans le texte ? (1 pt)",
      "2.a. Quelle est la tonalité dominante du texte ? Justifiez par deux indices précis. (1,5 pt)",
      "2.b. Sur quoi porte principalement l’ironie du narrateur ? (1 pt)",
    ]},
  ]};

/* ---------- Banque de sujets de dissertation Tle (verbatim compilations) ---------- */
const sujetsTle = [
  "Antonin Artaud déclare : « Les chefs-d’œuvre du passé sont bons pour le passé ; ils ne sont pas bons pour nous. Nous avons le droit de dire ce qui a été dit et même ce qui n’a pas été dit d’une façon qui nous appartienne, qui soit immédiate, directe, et réponde aux façons de sentir actuelles et que tout le monde comprendra. » Commentez et discutez ce point de vue à partir de votre culture littéraire.",
  "Au sujet de la création du personnage, Alfred de Vigny déclare : « Laissez-nous rêver que parfois ont paru des hommes plus forts et plus grands, qui furent des bons ou des méchants plus résolus ». Épousez-vous cette vision imaginaire et idéaliste du personnage ?",
  "Dans L’homme révolté, Albert Camus, au sujet de la création du héros, déclare : « Les héros ont notre langage, nos faiblesses, nos forces. Leur univers n’est ni plus beau, ni plus édifiant que le nôtre. Mais eux, du moins, courent jusqu’au bout de leur destin ». Expliquez cette pensée à la lumière des œuvres théâtrales et romanesques lues ou étudiées.",
  "Se prononçant en faveur d’une littérature exclusivement belle, Théophile Gautier affirme : « Tout ce qui est utile est laid, car c’est l’expression de quelque besoin, et ceux de l’homme sont ignobles et dégoûtants ». La littérature doit-elle uniquement s’orienter vers la forme ?",
  "Dans Situations II, Jean-Paul Sartre déclare : « Vu que l’écrivain n’a aucun moyen de s’évader, nous voulons qu’il embrasse étroitement son époque. Elle est sa chance unique ». Selon vous, l’écrivain doit-il uniquement produire pour son temps ?",
  "Barthélémy Kotchy déclare : « Le théâtre négro-africain doit être un théâtre de réflexion au sens physique et philosophique du terme ; il doit être un donner à voir et un donner à penser. » Commentez cette pensée à la lumière des œuvres théâtrales camerounaises lues ou étudiées.",
  "Malherbe, au sujet du métier de poète, déclare : « La seule gloire qu’on pourra tirer est qu’on dira de nous que nous sommes de bons arrangeurs de syllabes ». Commentez et discutez ce point de vue à partir de votre culture poétique.",
  "Discutez ces propos de Victor Hugo à partir de votre culture poétique : « Malheur à qui prend ses sandales, quand la haine et le scandale tourmentent le peuple agité ».",
  "Un romancier à qui l’on demandait pourquoi il ne faisait pas de poésie répondit : « Parce que je n’aime pas parler de moi-même. » Cet avis sur la différence entre le roman et la poésie vous semble-t-il justifié ? Répondez à partir de votre culture romanesque et poétique.",
  "Selon Chateaubriand : « Nous sommes persuadés que les plus grands écrivains ont mis leur vie dans leurs œuvres. On ne peint son propre cœur qu’en l’attribuant à un autre et la meilleure partie du génie se compose du souvenir. » Partagez-vous cet avis ? Répondez à partir de votre culture littéraire.",
  "Au sujet du pouvoir de la littérature, Victor Hugo avance : « Méfiez-vous des mots, ils sont des forces ». Appréciez ce point de vue.",
  "Gustave Flaubert asserte : « Je n’aime pas intéresser le public avec ma personne ». À votre avis, l’écrivain doit-il, pour obtenir l’intérêt du public, s’effacer de son livre ?",
  "Parlant du rôle du théâtre, un metteur en scène déclare : « Notre volonté est de mettre sur scène la société, de la présenter et provoquer vis-à-vis d’elle des regards critiques… Mais dans le même temps, le théâtre doit aussi être un lieu où se libèrent les forces de l’imagination, où s’organise le rêve. » Qu’en pensez-vous ?",
];

module.exports = { ocdeBAC, laurasBAC, tchatchouaLitt, jeuneAfrique, nug, oyonoLangue, sujetsTle, baremeDissertSTT };
