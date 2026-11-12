# -*- coding: utf-8 -*-
"""
Rubrique finale « Vers le Probatoire — Vers le BAC ».

Pour chaque cahier, deux entraînements distincts :

    Probatoire (1ère)  → un commentaire composé + une dissertation
    BAC (Tle)          → un commentaire composé + une dissertation

Les supports de commentaire ne sont pas recopiés ici : ils renvoient par leur
indice à l'une des six fiches du cahier (`fiche=n`, numérotation à partir de 1),
ce qui garantit qu'ils font au moins trois cents mots et qu'ils ont déjà été
vérifiés sur le texte intégral. Les fiches servant déjà de support aux devoirs
de la section 9 ne sont pas réutilisées.
"""

RAPPEL_PROBA = ("Épreuve de français du Probatoire — durée 4 h, coefficient 3 (série A) "
                "ou 2 (séries C et D). Le candidat traite un seul sujet. Le niveau "
                "d'exigence porte d'abord sur la correction de la méthode : introduction "
                "en trois étapes, axes construits, citations analysées.")

RAPPEL_BAC = ("Épreuve de français du Baccalauréat — durée 4 h, coefficient 3 (série A) "
              "ou 2 (séries C, D et E). Même format qu'au Probatoire, mais l'exigence "
              "porte en outre sur la finesse de l'interprétation, la maîtrise du "
              "métalangage et la capacité à discuter un jugement.")

RAPPEL_PREMIERE = ("Épreuve de littérature de fin de seconde — durée 4 h. Le candidat "
                   "traite un seul des trois sujets : contraction et discussion, "
                   "commentaire composé, dissertation. Le devoir est noté sur 18 points, "
                   "les 2 derniers récompensant la présentation de la copie. Ce qui est "
                   "attendu à ce niveau, c'est d'abord une méthode tenue de bout en bout : "
                   "introduction en trois étapes, axes annoncés puis respectés, citations "
                   "courtes et analysées.")

BAREME_2ND_CYCLE_CC = "Barème harmonisé OBC — Compréhension : 6 — Organisation des idées : 6 — Langue et style : 6 — Présentation de la copie : 2"
BAREME_2ND_CYCLE_DISS = "Barème harmonisé OBC — Compréhension / Pertinence : 6 — Organisation / Cohérence : 6 — Correction de l’expression : 6 — Originalité de la production : 2"
BAREME_SECONDE_CC = "Barème harmonisé OBC — Compréhension : 6 — Organisation des idées : 6 — Langue et style : 6 — Présentation de la copie : 2"
BAREME_SECONDE_DISS = "Barème harmonisé OBC — Compréhension / Pertinence : 6 — Organisation / Cohérence : 6 — Correction de l’expression : 6 — Originalité de la production : 2"

# Les cinq premiers cahiers visent la Première et la Terminale. Un cahier de
# seconde vise la classe suivante et l'examen qui l'attend : le parcours change,
# la mécanique de la rubrique ne change pas.
PARCOURS_2ND_CYCLE = (
    ("probatoire", "Vers le Probatoire — classe de Première", RAPPEL_PROBA),
    ("bac", "Vers le BAC — classe de Terminale", RAPPEL_BAC),
)
PARCOURS_SECONDE = (
    ("premiere", "Vers la Première — l'épreuve de fin de seconde", RAPPEL_PREMIERE),
    ("probatoire", "Vers le Probatoire — classe de Première", RAPPEL_PROBA),
)


# ═══════════════════════════════════════════════ LE VIEUX NÈGRE ET LA MÉDAILLE
VIEUXNEGRE = dict(
    probatoire=dict(
        commentaire=dict(
            fiche=3,
            consigne="**Faites le commentaire composé de ce texte.** Vous pourrez étudier, "
                     "entre autres, la manière dont un changement de point de vue permet de "
                     "juger le personnage principal, et le rôle des voix anonymes de la foule.",
            pistes=[
                "Le déplacement du foyer narratif : le roman quitte Meka pour Kelara, et "
                "c'est ce déplacement qui rend le jugement possible.",
                "La phrase qui fait tout basculer — « Il a bien perdu ses terres et ses fils "
                "pour ça… » — et la valeur méprisante du démonstratif « ça ».",
                "Le geste du foulard enfoncé dans la bouche : un bâillon volontaire au milieu "
                "d'une cérémonie de parole officielle.",
                "La chaîne des désignations : « son mari » → « quelqu'un qu'elle n'avait "
                "encore jamais vu » → « l'homme qui riait là-bas ».",
                "Le corps qui juge : la « moue méprisante », et la peur que Kelara éprouve "
                "devant sa propre lucidité.",
            ],
        ),
        dissertation=dict(
            sujet="« Dans un roman de dénonciation, les personnages secondaires en disent "
                  "parfois plus que le héros. » Vous discuterez cette affirmation en vous "
                  "appuyant sur Le vieux nègre et la médaille et sur d'autres œuvres de "
                  "votre choix.",
            pistes=[
                "**I.** Le héros porte le récit mais ne le comprend pas : Meka est enfermé "
                "dans une focalisation qui lui interdit de se voir.",
                "**II.** Les personnages secondaires disposent du recul qui lui manque : "
                "Kelara, la « mauvaise langue », Nti, Engamba, Essomba.",
                "**III.** Le partage réel n'est pas entre principal et secondaire, mais entre "
                "celui qui vit la scène et ceux qui la regardent ; le lecteur occupe la même "
                "position que les seconds.",
                "**Écueil à éviter** : réduire les personnages secondaires à des adjuvants. "
                "Montrez qu'ils constituent une instance de jugement, presque un chœur.",
            ],
        ),
    ),
    bac=dict(
        commentaire=dict(
            fiche=6,
            consigne="**Faites le commentaire composé de ce texte.** Vous pourrez étudier, "
                     "entre autres, la fonction du rire collectif et les procédés par lesquels "
                     "le dénouement refuse toute consolation.",
            pistes=[
                "Une riposte trouvée : le bila attaque le protocole colonial par le corps, "
                "c'est-à-dire par son point vulnérable.",
                "La comparaison hydraulique — « une eau bouillonnante longtemps contenue qui "
                "rompt sa digue » — et ses deux expansions.",
                "Le trajet du rire comme travelling : il « jaillit », « sema la panique », "
                "« disparut au-delà du cimetière » et atteint le Père Vandermayer.",
                "Un triomphe à l'irréel du passé : « Meka aurait pu leur faire voir » — rien "
                "n'a été fait, rien ne sera fait.",
                "La dépense sans reste : « quand les corps se furent vidés du rire », puis "
                "l'abandon de Meka par ses amis, « sans un regard ».",
                "Les six derniers mots — « Je ne suis plus qu'un vieil homme… » — et le titre "
                "rendu à sa lettre.",
            ],
        ),
        dissertation=dict(
            sujet="« Le rire est l'arme des désarmés. » Dans quelle mesure cette formule "
                  "rend-elle compte du dénouement du Vieux nègre et la médaille ? Vous "
                  "élargirez votre réflexion à d'autres œuvres.",
            pistes=[
                "**I.** Le rire est bien une arme : il déplace le regard, il est collectif, "
                "il atteint physiquement l'adversaire.",
                "**II.** Mais Oyono en désigne lui-même les limites : le conditionnel passé, "
                "les corps « vidés », la solidarité qui s'évapore.",
                "**III.** Distinguer ce que le rire obtient — rendre l'humiliation racontable "
                "et maintenir un jugement — de ce qu'il ne change pas.",
                "**Ressource** : opposer le rire « démentiel » de la cellule, symptôme "
                "solitaire, et le rire partagé du dénouement. Le même geste change de valeur.",
            ],
        ),
    ),
)

# ═══════════════════════════════════════════════════════ LE LION ET LA PERLE
LIONPERLE = dict(
    probatoire=dict(
        commentaire=dict(
            fiche=2,
            consigne="**Faites le commentaire composé de ce texte.** Vous pourrez étudier, "
                     "entre autres, la construction du portrait par contraste et la manière "
                     "dont une scène de triomphe prépare une chute.",
            pistes=[
                "Une conscience de soi née d'une image : la didascalie du doigt qui "
                "« redessine les contours » des photographies.",
                "Une langue empruntée au magazine : « la chaude caresse d'un soleil plein de "
                "désir ».",
                "Le parallélisme terme à terme entre les deux visages, et la gradation des "
                "comparants (le cuir, la cendre, l'herbe carbonisée).",
                "La chute qui retourne le titre en injure : « Je suis l'éclat de la perle ; "
                "lui n'est que l'arrière-train du lion ! »",
                "La lucidité qui ne protège de rien : Sidi connaît la réputation des soupers "
                "de Baroka et s'y rendra pourtant.",
            ],
        ),
        dissertation=dict(
            sujet="« Le théâtre comique punit toujours l'orgueil. » Vous discuterez cette "
                  "affirmation à partir du personnage de Sidi dans Le lion et la perle et "
                  "d'autres œuvres de votre choix.",
            pistes=[
                "**I.** La punition est nette : l'insulte de trop déclenche la vengeance de "
                "Baroka, et la scène de triomphe installe la hauteur de la chute.",
                "**II.** Mais la comédie ne punit pas seulement Sidi : Lakounlé est ridicule "
                "sans être orgueilleux, et Baroka triomphe sans être puni.",
                "**III.** Ce que la comédie sanctionne n'est pas l'orgueil mais l'aveuglement "
                "sur soi — d'où le silence final de Sidi, seul personnage qui apprenne.",
                "**Écueil à éviter** : confondre la sanction d'un personnage et la thèse de "
                "l'auteur.",
            ],
        ),
    ),
    bac=dict(
        commentaire=dict(
            fiche=6,
            consigne="**Faites le commentaire composé de ce texte.** Vous pourrez étudier, "
                     "entre autres, la manière dont un personnage se détruit par son propre "
                     "discours, et le sens du silence final de l'héroïne.",
            pistes=[
                "Le bestiaire renversé : du « lion » au « crapaud » qui coasse ; le titre de "
                "la pièce démoli par la victime elle-même.",
                "Une tragédie de pacotille : apostrophe aux éléments, troisième personne "
                "(« engloutis Lakounlé »), référence biblique.",
                "La phrase qui perd le personnage : « c'est pure justice que nous laissions "
                "tomber complètement la dot, puisqu'on ne peut plus t'appeler une jeune fille ».",
                "Le coup d'œil à Sadikou et l'adverbe « précipitamment » : ce que Lakounlé "
                "protège n'est ni Sidi ni son amour, mais sa réputation.",
                "« j'obéis à mes livres » : un homme qui applique un scénario.",
                "La didascalie qui refuse l'information : « son visage est indéchiffrable ».",
            ],
        ),
        dissertation=dict(
            sujet="« Une comédie réussie ne donne raison à personne. » Vous discuterez cette "
                  "formule à partir du Lion et la perle et d'autres œuvres théâtrales de "
                  "votre choix.",
            pistes=[
                "**I.** La pièce semble donner raison à la tradition : Baroka gagne, Lakounlé "
                "est ridicule, le spectacle est tout entier yorouba.",
                "**II.** Mais les arguments de Lakounlé ne sont jamais réfutés, et Baroka "
                "l'emporte par un mensonge, non par la coutume.",
                "**III.** Ce que la pièce oppose n'est pas la tradition et la modernité, mais "
                "ceux qui pensent et ceux qui récitent.",
                "**Ressource décisive** : distinguer ce qu'un personnage obtient et ce que "
                "l'auteur approuve. C'est la distinction que la plupart des copies manquent.",
            ],
        ),
    ),
)

# ═══════════════════════════════════════════════════════════ NGUM A JEMEA
NGUM = dict(
    probatoire=dict(
        commentaire=dict(
            fiche=1,
            consigne="**Faites le commentaire composé de ce texte.** Vous pourrez étudier, "
                     "entre autres, la fonction du soliloque d'exposition et la manière dont "
                     "une politesse peut constituer une résistance.",
            pistes=[
                "Le soliloque qui arme le spectateur : « Je dois simuler un accueil des plus "
                "chaleureux » — tout ce qui suit est désigné comme une comédie.",
                "Le mépris posé en axiome : « Dualla est un homme après tout, c'est-à-dire "
                "pervers par essence. »",
                "La cordialité comme technique : le tutoiement, l'abandon du titre, la "
                "photographie décrochée du mur au bon moment.",
                "Le titre maintenu quatre fois — « monsieur le Chef de Région » — : refuser "
                "l'homme sans manquer à la forme.",
                "Le refus du verre de gin : le premier refus de la pièce, modèle exact de "
                "celui qui portera sur trois cent mille Marks.",
                "Le fait opposé au sentiment : l'arrestation rappelée contre la photographie "
                "brandie.",
            ],
        ),
        dissertation=dict(
            sujet="« Le théâtre historique ne nous apprend pas ce qui s'est passé ; il nous "
                  "apprend ce qu'il a fallu décider. » Vous discuterez ce jugement à partir "
                  "de Ngum a Jemea et d'autres œuvres de votre choix.",
            pistes=[
                "**I.** La pièce restitue bien des faits : le traité du 12 juillet 1884 et "
                "son article 3, le plateau Joss, New-Bell, la pendaison de 1914.",
                "**II.** Mais l'essentiel se joue dans les refus : le verre, la mallette, la "
                "barque de l'évasion ; et dans le monologue « Que faire ?… ».",
                "**III.** Le théâtre historique invente précisément ce que les archives ne "
                "conservent pas : une délibération.",
                "**Écueil à éviter** : traiter le sujet comme une question sur l'exactitude "
                "historique de la pièce.",
            ],
        ),
    ),
    bac=dict(
        commentaire=dict(
            fiche=4,
            consigne="**Faites le commentaire composé de ce texte.** Vous pourrez étudier, "
                     "entre autres, la construction méthodique d'une tentative de corruption "
                     "et les moyens par lesquels un refus en récuse le terrain.",
            pistes=[
                "Une corruption rédigée comme un contrat : « En premier lieu… Deuxièmement… "
                "Enfin », contredite par la didascalie « sur le ton de la confidence ».",
                "L'argument le plus violent, formulé comme un compliment : « bien que votre "
                "peau soit noire, vous êtes un Blanc, un vrai Blanc ».",
                "L'argent mis en scène : le chiffre, la mallette ouverte, les liasses "
                "« soigneusement rangées ».",
                "Le retour à la langue douala au moment de l'indignation : « Tete Ndumbe nde "
                "na kanno ! »",
                "Le déplacement du débat : « une insulte à mon honneur ! » — Von Roehm ne "
                "pourra plus suivre sur ce terrain.",
                "La substitution d'héritage : « Le vrai héritage que je dois laisser à mes "
                "enfants c'est le sens du devoir et l'amour de la patrie. »",
                "Deux maximes face à face : « la force prime le droit » et le proverbe de la "
                "fourmi.",
            ],
        ),
        dissertation=dict(
            sujet="« Il n'y a de tragédie que là où le héros pouvait faire autrement. » Vous "
                  "discuterez cette affirmation à partir de Ngum a Jemea et d'autres œuvres "
                  "de votre choix.",
            pistes=[
                "**I.** Sans choix possible, il n'y a que du pathétique : la pièce multiplie "
                "les issues offertes — l'exemption, l'argent, la permission, la barque.",
                "**II.** Mais le tragique naît aussi de l'impossibilité : Œdipe, ou Meka dans "
                "Le vieux nègre et la médaille, qui défie « l'invisible adversaire ».",
                "**III.** Le tragique est dans l'écart entre ce qu'on choisit — sa conduite, "
                "sa parole — et ce qu'on subit : Dualla Manga décide de « lever le gage », "
                "non d'échapper à la potence.",
                "**Ressource** : le chœur qui supplie le roi de fuir. Le peuple lui-même ne "
                "réclame pas sa mort : elle est un choix, non un devoir.",
            ],
        ),
    ),
)

# ═══════════════════════════════════════════════════ LES TRIBUS DE CAPITOLINE
CAPITOLINE = dict(
    probatoire=dict(
        commentaire=dict(
            fiche=4,
            consigne="**Faites le commentaire composé de ce texte.** Vous pourrez étudier, "
                     "entre autres, la construction du portrait par contraste et ce qu'un "
                     "regard amoureux révèle de celui qui regarde.",
            pistes=[
                "Un portrait qui n'existe que par différence : la structure en « alors que », "
                "répétée deux fois.",
                "Le repoussoir des compagnes : « patauger », « lourdeur », « si agressivement ».",
                "La minutie comme symptôme : trois lignes pour comparer deux façons de tenir "
                "un sac à main.",
                "Une objectivité feinte : le lexique de la mesure appliqué à une silhouette "
                "entrevue dans la rue.",
                "« comme un propriétaire fier » : posséder avant d'avoir parlé.",
                "Le conditionnel du présage : « cette femme-ci lui porterait-elle chance ? »",
            ],
        ),
        dissertation=dict(
            sujet="« Le personnage de roman est d'autant plus vrai qu'il se trompe. » Vous "
                  "discuterez cette affirmation à partir des Tribus de Capitoline et "
                  "d'autres œuvres de votre choix.",
            pistes=[
                "**I.** L'erreur produit du récit et crée la sympathie : « Je ne suis pas "
                "fâché », dénégation qui avoue.",
                "**II.** Mais l'erreur ne suffit pas : ce qui rend Mathieu crédible, c'est "
                "qu'il en sorte — la nuit où il conclut qu'« une tribu s'apprend ».",
                "**III.** La vérité d'un personnage tient à la contradiction maintenue : "
                "maman Mbezele aime « par-dessus tout » et détruit.",
                "**Écueil à éviter** : psychologiser sans citer. Toute affirmation sur un "
                "personnage doit s'appuyer sur un fait du texte.",
            ],
        ),
    ),
    bac=dict(
        commentaire=dict(
            fiche=6,
            consigne="**Faites le commentaire composé de ce texte.** Vous pourrez étudier, "
                     "entre autres, le double renversement qui organise l'épilogue et les "
                     "effets produits par une scène que l'auteur refuse de raconter.",
            pistes=[
                "La symétrie initiale : « était venu » / « en repartit », trois projets contre "
                "une « longue caisse de bois rouge ».",
                "La périphrase et la marque du véhicule : un effet de réel qui écarte le pathos.",
                "L'adverbe « probablement » : un narrateur omniscient qui refuse d'affirmer "
                "quoi que ce soit sur l'au-delà.",
                "Une géographie hostile : les « bourbiers jaloux de leur puissance "
                "saisonnière ».",
                "Trois négations en gradation : le train, la ville natale, le village du père.",
                "Le décalage généralisé d'information : personne, sauf le lecteur, ne sait.",
                "La dernière phrase : « combien il était le bienvenu chez lui ».",
            ],
        ),
        dissertation=dict(
            sujet="« Le roman ne dénonce jamais mieux une injustice que lorsqu'il refuse de "
                  "désigner un coupable. » Vous discuterez ce jugement à partir des Tribus de "
                  "Capitoline et d'autres œuvres de votre choix.",
            pistes=[
                "**I.** Le jugement se vérifie : « On essayait de lui faire comprendre sans "
                "le lui dire » ; la révolte sans objet — « Mais contre qui ? ».",
                "**II.** Mais le roman désigne aussi : « une possessivité à la limite du "
                "supportable », la définition du mot « Belobolobo » par le narrateur.",
                "**III.** Le vrai partage est entre la faute individuelle et le mécanisme : "
                "désigner un coupable réduirait une coutume à un cas particulier.",
                "**Ressource** : comparer avec Ngum a Jemea, où l'adversaire avoue lui-même "
                "sa doctrine — « la force prime le droit ».",
            ],
        ),
    ),
)

# ═══════════════════════════════════════════════════ AU CŒUR DES TÉNÈBRES
TENEBRES = dict(
    probatoire=dict(
        commentaire=dict(
            fiche=1,
            consigne="**Faites le commentaire composé de ce texte.** Vous pourrez étudier, "
                     "entre autres, la mise en place du cadre et du récit enchâssé, ainsi que "
                     "le renversement opéré par la phrase « Et ceci aussi a été l'un des lieux "
                     "ténébreux de la terre ».",
            pistes=[
                "Un décor d'abord glorieux : la Tamise, les grands navigateurs, la lumière "
                "qui part de ce fleuve vers le monde.",
                "Le renversement : la même Tamise fut jadis un lieu de ténèbres pour les "
                "Romains ; la civilisation n'est qu'une « lueur vacillante ».",
                "Le récit enchâssé : un narrateur anonyme rapporte le récit de Marlow, ce qui "
                "installe une distance et interdit d'attribuer ses paroles à l'auteur.",
                "La pose de Marlow, « comme un Bouddha prêchant en habits européens » : "
                "l'ironie d'une image qui mêle Orient et Occident.",
                "Le vocabulaire de l'obscurité et de la brume, qui installe dès l'ouverture le "
                "motif du titre.",
            ],
        ),
        dissertation=dict(
            sujet="« Un récit de voyage ne nous apprend rien sur les pays traversés ; il nous "
                  "apprend qui les traverse. » Vous discuterez cette affirmation à partir "
                  "d'Au cœur des ténèbres et d'autres œuvres de votre choix.",
            pistes=[
                "**I.** Le roman de Conrad confirme largement la formule : l'Afrique y reste "
                "un décor sans nom, sans langue traduite et sans personnage individualisé.",
                "**II.** Mais un récit de voyage peut aussi documenter : le bosquet de la "
                "mort, la station, les chaînes constituent des faits observés que le texte "
                "impose au lecteur.",
                "**III.** Ce que le récit révèle vraiment, c'est le regard : Marlow apprend "
                "moins sur le Congo que sur l'Europe qui s'y conduit.",
                "**Écueil à éviter** : confondre Marlow et Conrad. La construction en récit "
                "enchâssé interdit précisément cette assimilation.",
            ],
        ),
    ),
    bac=dict(
        commentaire=dict(
            fiche=5,
            consigne="**Faites le commentaire composé de ce texte.** Vous pourrez étudier, "
                     "entre autres, la construction du personnage de Kurtz par la seule voix, "
                     "et la portée de son dernier cri.",
            pistes=[
                "Un personnage réduit à une voix : « Une voix ! une voix ! » — Kurtz existe "
                "avant tout comme parole, ce que la structure du roman prépare depuis le "
                "début.",
                "L'écart entre l'éloquence et l'acte : le rapport sur la civilisation et le "
                "post-scriptum, « Exterminez toutes ces brutes ! ».",
                "Le jugement final — « Horreur ! Horreur ! » — et son ambiguïté : condamnation "
                "de soi, du monde, ou lucidité ultime ?",
                "Le commentaire de Marlow, qui y voit « une victoire morale » : une "
                "interprétation du narrateur, non un fait établi par le texte.",
                "Le lexique des ténèbres et du vide, filé jusqu'à la dernière ligne.",
                "L'ellipse : le lecteur n'apprendra jamais ce que Kurtz a réellement fait au "
                "poste de l'intérieur.",
            ],
        ),
        dissertation=dict(
            sujet="« Ce qui la rachète n'est que l'idée. » Une entreprise injuste peut-elle "
                  "être rachetée par l'idée qui la justifie ? Vous discuterez cette "
                  "affirmation à partir d'Au cœur des ténèbres et d'autres œuvres de votre "
                  "choix.",
            pistes=[
                "**I.** La formule a sa force : les hommes agissent au nom de fins qui les "
                "dépassent, et Marlow distingue la « foi désintéressée » du « prétexte "
                "sentimental ».",
                "**II.** Mais le roman la réfute par ce qu'il montre : la Compagnie invoque la "
                "civilisation et pratique le pillage ; Kurtz écrit un rapport lumineux et le "
                "conclut par « Exterminez toutes ces brutes ! ».",
                "**III.** L'idée ne rachète pas : elle masque. Ce que Conrad met au jour, "
                "c'est la fonction de la justification dans l'exercice de la violence.",
                "**Ressource** : rapprocher de la médaille chez Oyono ou du projet "
                "d'« assainissement » de Von Roehm chez Mbanga Eyombwan — trois façons de "
                "nommer noblement une spoliation.",
            ],
        ),
    ),
)

# ═══════════════════════════════════════════════════════════════ TARTUFFE
# Cahier de seconde : la rubrique 10 ne vise pas le Probatoire et le BAC mais
# la classe suivante et l'examen qui l'attend au bout.
TARTUFFE = dict(
    parcours=PARCOURS_SECONDE,
    titre_rubrique="10. Vers la Première — Vers le Probatoire",
    baremes=(BAREME_SECONDE_CC, BAREME_SECONDE_DISS),
    chapeau="Deux entraînements complets. Le premier est au format de l'épreuve de fin de "
            "seconde ; le second anticipe celui du Probatoire, que l'élève passera l'année "
            "suivante. Chacun propose un sujet de commentaire composé accompagné de son "
            "texte, et un sujet de dissertation, tous deux portant sur l'œuvre étudiée. Les "
            "pistes indiquées ne sont pas un corrigé : elles signalent ce qu'un devoir "
            "solide devrait exploiter.",
    premiere=dict(
        commentaire=dict(
            fiche=5,
            consigne="**Sans dissocier le fond de la forme, vous ferez de ce texte un "
                     "commentaire composé.** Vous pourrez étudier, entre autres, la manière "
                     "dont un personnage caché transforme chaque réplique en une phrase à "
                     "deux sens, et le renversement d'autorité qui clôt l'extrait. Le plan "
                     "comportera deux axes de deux sous-parties.",
            pistes=[
                "Le dispositif : Orgon sous la table, Elmire seule en scène, le spectateur "
                "seul à voir les trois. Nommer le comique de situation et le prouver par la "
                "didascalie « sortant de dessous la table ».",
                "La casuistique exposée par Tartuffe : « je sais l'art de lever les "
                "scrupules », « il est une science / D'étendre les liens de notre "
                "conscience ». Montrer que les mots « art » et « science » donnent à la "
                "malhonnêteté l'apparence d'un savoir.",
                "La maxime « ce n'est pas pécher que pécher en silence » : le même verbe "
                "condamné puis excusé dans le même vers, selon qu'on parle ou non.",
                "Les répliques à double destinataire : « je suis au supplice », « c'est un "
                "rhume obstiné ». Donner à chaque fois les deux sens, dans l'ordre — ce que "
                "comprend Tartuffe, ce que comprend Orgon.",
                "Le renversement final : « Rentrez sous le tapis », puis la leçon de "
                "prudence rendue à celui qui la donnait à tous, puis la didascalie « Elle "
                "fait mettre son mari derrière elle ».",
                "**Écueil à éviter** : raconter la scène. Le devoir doit partir du "
                "dispositif, non de l'anecdote.",
            ],
        ),
        dissertation=dict(
            sujet="« Une comédie ne corrige personne : elle amuse, et l'on sort du théâtre "
                  "comme on y est entré. » Partagez-vous ce jugement ? Vous répondrez en "
                  "vous appuyant sur Tartuffe de Molière et sur les œuvres que vous avez "
                  "lues ou étudiées.",
            pistes=[
                "**I.** Ce qui donne raison au jugement : la comédie vise le plaisir, elle "
                "grossit les traits, et Orgon lui-même n'est corrigé par personne — il faut "
                "l'envoyé du roi pour le sauver.",
                "**II.** Ce qui le dément : la pièce a été interdite près de cinq ans. On "
                "n'interdit pas ce qui ne fait qu'amuser. Molière écrivait lui-même que le "
                "devoir de la comédie est « de corriger les hommes en les divertissant ».",
                "**III.** La correction ne porte pas sur ceux qu'on montre mais sur ceux qui "
                "regardent : en riant d'Orgon, le spectateur prend le parti de Dorine, "
                "c'est-à-dire du bon sens.",
                "**Ressource** : rapprocher d'une fable ou d'un conte étudié en classe, où "
                "la leçon passe aussi par le plaisir du récit.",
            ],
        ),
    ),
    probatoire=dict(
        commentaire=dict(
            fiche=6,
            consigne="**Faites le commentaire composé de ce texte.** Vous pourrez étudier, "
                     "entre autres, la manière dont l'imposteur change de masque sans "
                     "changer de méthode, et la brutalité du retournement qui clôt la "
                     "pièce.",
            pistes=[
                "Le remplacement du ciel par le prince : relever « de la part du prince », "
                "« l'intérêt du prince est mon premier devoir », et les quatre occurrences "
                "du mot « devoir ».",
                "La gradation « Amis, femme, parents, et moi-même avec eux » : du plus "
                "éloigné au plus intime, et le martyre que Tartuffe se donne au moment où il "
                "livre son bienfaiteur.",
                "La métaphore de Dorine — « se faire un beau manteau de tout ce qu'on "
                "révère » — comme définition de l'imposture.",
                "Le chœur familial : cinq personnages, cinq registres, et Cléante seul à "
                "argumenter par deux questions restées sans réponse.",
                "La rupture de rythme : après cinquante vers de tirades, « Qui ? moi, "
                "monsieur ? — Oui, vous. » Montrer que la longueur des répliques mesure qui "
                "domine.",
                "**Écueil à éviter** : traiter le deus ex machina comme un défaut évident. "
                "Il se discute, il ne se constate pas.",
            ],
        ),
        dissertation=dict(
            sujet="« Le personnage le plus intéressant du Tartuffe n'est pas Tartuffe, mais "
                  "Orgon. » Discutez cette affirmation en vous appuyant sur la pièce et sur "
                  "vos lectures.",
            pistes=[
                "**I.** Tartuffe donne son nom à la pièce, il en est le moteur, et son "
                "entrée est préparée pendant deux actes entiers ; il concentre l'attention "
                "du spectateur.",
                "**II.** Mais Tartuffe ne change jamais : il est le même à l'acte III et à "
                "l'acte V, il change seulement de masque. Orgon, lui, passe de "
                "l'aveuglement à la vue, et c'est lui qui est présent dans presque toutes "
                "les scènes.",
                "**III.** Le partage véritable n'est pas entre deux personnages mais entre "
                "deux objets d'étude : Tartuffe est un mécanisme, Orgon est une victime "
                "consentante. La pièce s'intéresse moins à l'imposture qu'à ce qui la rend "
                "possible.",
                "**Écueil à éviter** : réduire Orgon à un sot. Molière lui donne le pouvoir, "
                "l'argent et l'autorité : c'est ce qui rend son aveuglement dangereux.",
            ],
        ),
    ),
)

# ═══════════════════════════════════════════ POÈMES SAUVAGES (N'KOUMO)
# Cahier de seconde : la rubrique 10 vise la classe suivante et l'examen qui
# l'attend au bout, non le BAC.
SAUVAGES = dict(
    parcours=PARCOURS_SECONDE,
    titre_rubrique="10. Vers la Première — Vers le Probatoire",
    baremes=(BAREME_SECONDE_CC, BAREME_SECONDE_DISS),
    chapeau="Deux entraînements complets. Le premier est au format de l'épreuve de fin de "
            "seconde ; le second anticipe celui du Probatoire, que l'élève passera l'année "
            "suivante. Chacun propose un sujet de commentaire composé accompagné de son "
            "texte, et un sujet de dissertation, tous deux portant sur l'œuvre étudiée. Les "
            "pistes indiquées ne sont pas un corrigé : elles signalent ce qu'un devoir "
            "solide devrait exploiter.",
    premiere=dict(
        commentaire=dict(
            fiche=2,
            consigne="**Sans dissocier le fond de la forme, vous ferez de ce texte un "
                     "commentaire composé.** En vous appuyant sur les répétitions, les "
                     "énumérations, la ponctuation et la longueur des vers, vous montrerez, "
                     "entre autres, comment le poème passe d'un deuil personnel à une "
                     "accusation générale. Le plan comportera deux axes de deux "
                     "sous-parties.",
            pistes=[
                "L'hyperbole d'ouverture — « et mon jour meurt mille fois » — et ce qu'elle "
                "change à l'échelle du livre.",
                "La longue énumération de crimes, qui va des corps (« cramer les vies ») "
                "jusqu'aux rêves (« assassiner nos rêves posés sur les routes vives »).",
                "Le vers des villes : neuf noms, trois continents, aucune virgule. Montrer "
                "que l'égalité des deuils y est produite par la seule disposition des mots, "
                "sans argument.",
                "Les intrus de la liste : le mot « pleurs » glissé entre deux villes, "
                "l'alphabet, les onomatopées « kaka-kaka-kaka-kaka » et « boum boum boum ». "
                "Le vers cesse d'être du langage et devient bruit.",
                "Les trois questions « pendant combien de temps encore ? » : seules "
                "ponctuations fortes de l'extrait, et seule apparition du titre du livre — "
                "« les feux de brousse qui nous ceignent ».",
                "**Écueil à éviter** : commenter la liste sans la citer en entier. Le "
                "correcteur doit voir que le candidat a recopié le vers tel qu'il est.",
            ],
        ),
        dissertation=dict(
            sujet="« Ce qui manque à un texte compte autant que ce qu'il contient. » Cette "
                  "affirmation vous paraît-elle éclairer Poèmes sauvages éclairés au feu de "
                  "brousse ? Vous répondrez en vous appuyant sur l'œuvre et sur vos "
                  "lectures.",
            pistes=[
                "**I.** Ce qui manque dans ce livre est visible dès la première ligne : ni "
                "majuscule, ni point, ni rime, ni strophe régulière, ni titre de partie. "
                "Faire le relevé, avec des chiffres — cinq points d'interrogation dans "
                "quatre-vingt-douze pages.",
                "**II.** Chaque absence est remplacée : le « et » tient lieu de mètre, le "
                "blanc tient lieu de ponctuation, le vers d'un seul mot tient lieu de point. "
                "L'absence n'est donc pas un vide, c'est un déplacement.",
                "**III.** Il manque aussi des choses au récit : le poème ne raconte jamais "
                "l'attentat, ne nomme jamais les assaillants autrement que par un nom "
                "propre devenu symbole, ne donne aucun bilan chiffré. Ces silences-là sont "
                "des choix, et ils protègent les victimes du sort de statistiques.",
                "**Écueil à éviter** : conclure que « le poète a voulu faire moderne ». "
                "Chaque absence doit être reliée à un effet mesurable dans le texte.",
            ],
        ),
    ),
    probatoire=dict(
        commentaire=dict(
            fiche=6,
            consigne="**Faites le commentaire composé de ce texte.** Vous pourrez étudier, "
                     "entre autres, la manière dont un poème né d'un attentat parvient à "
                     "s'achever sur un appel, et le rôle qu'y jouent les vers d'un seul "
                     "mot.",
            pistes=[
                "« ce jour-là », deux fois : un futur annoncé sans jamais être daté.",
                "Le passage au subjonctif — « que nous mourrions », « que nous dansions » — "
                "qui dit le souhait et non le fait.",
                "Le vocabulaire du vivant : la faim, la sève, la gourmandise, le pili-pili, "
                "le baobab. Montrer qu'il s'oppose terme à terme aux corps morts des "
                "premières pages.",
                "« viens », quatre fois, dont trois vers d'un seul mot : un poème de "
                "quatre-vingt-douze pages qui s'achève sur une syllabe.",
                "Un impératif adressé à une morte : ce qui rend la fin bouleversante et non "
                "consolante.",
                "L'oiseau bleu du dernier vers, qui referme le motif ouvert à la première "
                "page, où des balles avaient pris la place des oiseaux dans le ciel.",
                "**Écueil à éviter** : lire cette fin comme un happy end. Rien n'est réparé ; "
                "un appel n'est pas une réponse.",
            ],
        ),
        dissertation=dict(
            sujet="« Le poète ne parle pas pour lui : il parle à la place de ceux qui ne "
                  "peuvent plus parler. » Discutez cette affirmation en vous appuyant sur "
                  "Poèmes sauvages éclairés au feu de brousse et sur les œuvres que vous "
                  "avez lues ou étudiées.",
            pistes=[
                "**I.** L'affirmation se vérifie largement : le livre est dédié à une morte, "
                "il porte son prénom plus de vingt fois, il rend la parole aux mères de "
                "Chibok en reprenant leur cri — « bring back our girls ».",
                "**II.** Mais parler à la place de quelqu'un est aussi une manière de le "
                "faire taire. Henrike ne dit jamais rien dans le livre : elle est regardée, "
                "nommée, appelée. Le poème le sait, et c'est pourquoi il finit par lui "
                "adresser un ordre plutôt qu'un discours : « viens ».",
                "**III.** Le partage exact n'est pas entre parler pour soi et parler pour "
                "les autres, mais entre parler à leur place et parler vers eux. Le « nous » "
                "du poème rassemble sans confisquer ; le « tu » maintient l'autre comme "
                "interlocuteur.",
                "**Ressource** : rapprocher d'un chant funèbre traditionnel de votre région, "
                "où le chanteur prête sa voix au mort. Comparer ce que les deux formes "
                "autorisent.",
            ],
        ),
    ),
)

# ═══════════════════════════════════════════ STANCES ET POÈMES (SULLY PRUDHOMME)
# Cahier de Terminale. Les deux entraînements reprennent les fiches 2 et 5, qui
# ne servent de support à aucun devoir de la section 9 : le candidat n'y
# retrouvera donc pas un texte déjà corrigé devant lui.
STANCES = dict(
    probatoire=dict(
        commentaire=dict(
            fiche=2,
            consigne="**Faites le commentaire composé de ce poème.** Vous étudierez, "
                     "entre autres, la manière dont le poète s'adresse à la mémoire "
                     "comme à une personne, et ce que la division du texte en deux "
                     "parties apporte à son propos.",
            pistes=[
                "L'apostrophe initiale « Ô Mémoire » et la série des verbes de pouvoir "
                "— joindre, nommer, permettre, faire, donner — qui construisent une "
                "souveraine.",
                "Le parallélisme des deux quatrains « Le présent n'est qu'un feu de "
                "joie… » et « Le présent n'est qu'un cri d'angoisse… » : même moule, "
                "contenus inverses. La mémoire amplifie le bonheur et la douleur avec "
                "la même indifférence, et le poème le montre sans le dire.",
                "Le changement de nom entre les deux parties : « Mémoire » d'abord, "
                "« souvenir » ensuite. Une faculté, puis un contenu.",
                "L'image de l'homme qui avance à reculons — « Devant moi la vie "
                "inquiète / Marche en levant sa lampe d'or, / Et j'avance en tournant "
                "la tête » — et le flambeau qui n'éclaire « Que du berceau vide au "
                "tombeau ».",
                "Le motif de la chaîne, au vers 2 puis dans l'avant-dernier quatrain : "
                "ce qui reliait devient ce dont on perd les deux bouts.",
                "**Écueil à éviter** : traiter la partie I puis la partie II l'une "
                "après l'autre. Le plan serait linéaire et le devoir plafonnerait. Il "
                "faut des axes qui traversent les deux parties.",
            ],
        ),
        dissertation=dict(
            sujet="« La poésie ne console de rien : elle donne seulement une forme à "
                  "ce qui nous manque. » En vous appuyant sur Stances et Poèmes de "
                  "Sully Prudhomme et sur vos lectures personnelles, vous direz si "
                  "cette affirmation vous paraît juste.",
            pistes=[
                "**I.** Le recueil donne raison à la formule. « La Mémoire » se ferme "
                "sur une double ignorance — d'où l'on vient, où vont les morts — et "
                "n'offre aucune consolation. « Le Vase brisé » constate une blessure "
                "irréparable et se borne à interdire qu'on y touche.",
                "**II.** Mais donner une forme est déjà agir. Le poème rend une "
                "douleur communicable : le lecteur du « Vase brisé » y reconnaît la "
                "sienne. « Les Berceaux » transforme un regret privé en question "
                "adressée à tous — et une peine partagée n'est plus la même peine.",
                "**III.** Ce que la poésie console n'est peut-être pas la perte, mais "
                "la solitude devant la perte. « C'est mon martyre, et c'est le tien » "
                "(*Intus*) : la formule ne guérit rien et change tout.",
                "**Ressource** : rapprocher d'un chant funèbre traditionnel de votre "
                "région. Il ne rend pas le mort ; il donne au deuil une forme tenable, "
                "et une place à ceux qui restent.",
                "**Attentes minimales** : trois citations exactes du recueil au moins, "
                "une œuvre extérieure, une position personnelle en conclusion.",
            ],
        ),
    ),
    bac=dict(
        commentaire=dict(
            fiche=5,
            consigne="**Sans dissocier le fond de la forme, faites le commentaire "
                     "composé de ce poème.** Vous montrerez notamment comment un texte "
                     "qui décrit un savoir scientifique parvient à rester un poème, et "
                     "quel émerveillement il propose en échange de celui qu'il retire.",
            pistes=[
                "Le renversement d'entrée : « royal ennui », « désert des cieux ». "
                "L'astre de la joie devient indifférent dès le premier vers.",
                "Les quatre négations des strophes 2 et 3 : le soleil ne veut rien, ne "
                "regarde personne, ne porte personne. Un portrait fait de ce qui "
                "manque.",
                "Le vers qui dit la rotation de la terre sans un mot technique : "
                "« Quand les uns du sommeil sortent illuminés, / Les autres dans la "
                "nuit s'enfoncent et s'allongent. »",
                "Le parallélisme des deux cris — les fils de l'Hellade « Criaient : "
                "Salut au dieu… », « Nous autres nous crions : Salut à l'Infini ! » — "
                "et le fait que le poème ne désigne aucun vainqueur.",
                "Les trois métaphores finales : le rideau qui tombe, les piliers mis à "
                "l'épreuve, l'univers qui « vêt une beauté neuve ». Trois façons de "
                "dire un changement d'apparence, non une destruction.",
                "Le vocabulaire du sacré conservé pour dire la loi physique : « à la "
                "fois idole, temple et prêtre ». C'est le geste le plus audacieux du "
                "texte.",
                "**Écueil à éviter** : conclure que le poète regrette le temps des "
                "dieux. Le dernier vers dit le contraire, et « imposture des yeux » "
                "désigne ce que la science a corrigé, non ce qu'elle a détruit.",
            ],
        ),
        dissertation=dict(
            sujet="Sully Prudhomme achève Stances et Poèmes sur ces mots : « Que dans "
                  "un autre cœur mon poème renaisse, / Qu'il vibre et soit aimé ! » Un "
                  "poème appartient-il encore à celui qui l'a écrit ? Vous répondrez "
                  "en vous appuyant sur le recueil et sur vos lectures.",
            pistes=[
                "**I.** Le poème reste celui de son auteur. Le recueil s'ouvre en "
                "affirmant que « Le meilleur demeure en moi-même, / Mes vrais vers ne "
                "seront pas lus » : il existerait donc une part du poème que nul ne "
                "recevra. L'image des papillons dont la main ne garde que « le fard "
                "léger » de l'aile dit la même chose.",
                "**II.** Le poème n'existe pourtant que repris. « L'airain sans "
                "l'effigie est un bien illusoire » : le métal ne circule pas sans la "
                "frappe. Le succès du seul « Vase brisé », face à cent sept poèmes "
                "écrits avec le même soin, montre que les lecteurs décident aussi.",
                "**III.** Deux existences, donc, plutôt qu'une propriété. Le verbe "
                "« renaisse » suppose une autre vie, non la même. Le poète ne demande "
                "pas d'être compris, il demande que son texte serve à quelqu'un "
                "d'autre. Fauré, mettant « Les Berceaux » en musique en 1879, n'a pas "
                "restitué l'émotion de 1865 : il en a fait naître une autre.",
                "**Ressource** : le proverbe, la chanson reprise en chœur, le poème "
                "appris à l'école n'ont pas de propriétaire. Ils vivent d'être redits.",
                "**Écueil à éviter** : traiter un sujet général sur le lecteur sans "
                "voir que la citation est le dernier vers du recueil et qu'elle répond "
                "au premier poème. Le cadre du livre est la moitié du sujet.",
            ],
        ),
    ),
)

# ═══════════════════════════════════════════════════ BALAFON (ENGELBERT MVENG)
# Cahier de Première. Les deux entraînements reprennent les fiches 3 et 5, qui
# ne servent de support à aucun devoir de la section 9.
BALAFON = dict(
    probatoire=dict(
        commentaire=dict(
            fiche=3,
            consigne="**Faites le commentaire composé de ce poème.** Vous "
                     "montrerez, entre autres, comment la ville est saisie par "
                     "un regard venu d\u2019ailleurs, et ce que le poème oppose à "
                     "ce qu\u2019il décrit.",
            pistes=[
                "Le verset comme unité : ni mètre compté ni rime, mais une "
                "respiration qui s\u2019allonge et se reprend. Compter les reprises "
                "avant d\u2019interpréter.",
                "Les noms propres et ce qu\u2019ils font entrer dans le poème : "
                "géographie réelle, histoire, mémoire des peuples.",
                "L\u2019apostrophe et la voix qui parle : à qui le poète "
                "s\u2019adresse-t-il, et qu\u2019attend-il de son interlocuteur ?",
                "Le passage du « je » au « nous », et le moment exact où il se "
                "produit.",
                "**Écueil à éviter** : traiter le poème comme un discours "
                "politique dont la forme serait un ornement. Chaque affirmation "
                "doit s\u2019appuyer sur un fait de langue.",
            ],
        ),
        dissertation=dict(
            sujet="« Un poème n\u2019a pas à consoler : il lui suffit de nommer. » "
                  "En vous appuyant sur Balafon d\u2019Engelbert Mveng et sur vos "
                  "lectures personnelles, vous discuterez cette affirmation.",
            pistes=[
                "**I.** Nommer est bien le premier geste du recueil : "
                "Marcinelle, New York, Moscou, l\u2019Adamawa. Les noms propres "
                "abondent, et ils portent chacun une souffrance ou une mémoire.",
                "**II.** Mais Balafon ne s\u2019arrête jamais au constat : chaque "
                "poème s\u2019achève sur une demande, une prière ou une annonce. "
                "Mveng écrit lui-même que l\u2019écrivain cherche « le jour qui "
                "vient après la nuit ».",
                "**III.** Nommer et consoler ne s\u2019opposent pas ici : c\u2019est en "
                "nommant que le poème rend la souffrance partageable, et une "
                "peine partagée n\u2019est plus la même peine.",
                "**Ressource** : rapprocher d\u2019un chant de deuil traditionnel de "
                "votre région, qui nomme le mort et console les vivants dans le "
                "même mouvement.",
            ],
        ),
    ),
    bac=dict(
        commentaire=dict(
            fiche=5,
            consigne="**Sans dissocier le fond de la forme, faites le "
                     "commentaire composé de ce poème.** Vous étudierez "
                     "notamment la manière dont l\u2019offrande est présentée, et "
                     "ce que l\u2019accumulation apporte au propos.",
            pistes=[
                "Le mouvement d\u2019ensemble : de l\u2019aveu d\u2019indignité à "
                "l\u2019affirmation d\u2019une richesse. Repérer où il bascule.",
                "L\u2019anaphore et l\u2019énumération : compter les occurrences avant "
                "de commenter, puis dire ce que la longueur de la liste "
                "produit.",
                "Les noms de lieux : ils ne décorent pas, ils dressent une carte "
                "et donnent à l\u2019offrande l\u2019étendue d\u2019un continent.",
                "L\u2019opposition entre ce que le poème refuse et ce qu\u2019il "
                "apporte : relever les négations.",
                "La tonalité : le poème emprunte au vocabulaire liturgique. "
                "Nommer ce registre et dire ce qu\u2019il ajoute.",
                "**Écueil à éviter** : paraphraser l\u2019énumération. Le correcteur "
                "attend qu\u2019on explique pourquoi elle est longue, pas qu\u2019on la "
                "recopie.",
            ],
        ),
        dissertation=dict(
            sujet="Engelbert Mveng écrit que l\u2019écrivain « ne cherche pas à "
                  "faire la critique pour la critique, ni à démolir pour le "
                  "simple plaisir ». Cette conception de l\u2019écrivain vous "
                  "paraît-elle rendre compte de ce que fait Balafon ? Vous "
                  "répondrez en vous appuyant sur le recueil et sur vos "
                  "lectures.",
            pistes=[
                "**I.** Le recueil accuse, et fermement : la traite, les "
                "colons, l\u2019indifférence des villes, la mort des mineurs. La "
                "critique y est constante et nommée.",
                "**II.** Mais elle n\u2019est jamais l\u2019objet du poème. Chaque "
                "dénonciation débouche sur une main tendue \u2014 « Lettre "
                "collective » finit sur l\u2019unisson des races, « Marcinelle » sur "
                "la demande de paix. La critique est un moyen, non une fin.",
                "**III.** Reste à décider si cette retenue est une force ou une "
                "limite. On acceptera les deux réponses, à condition qu\u2019elles "
                "s\u2019appuient sur des citations exactes et qu\u2019elles tiennent "
                "compte de la position de Mveng, prêtre et historien.",
                "**Écueil à éviter** : réciter la biographie de Mveng au lieu "
                "d\u2019analyser le recueil. Sa mort violente en 1995 n\u2019explique "
                "aucun vers de 1972.",
            ],
        ),
    ),
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


def parcours(cle):
    """Les deux niveaux visés par la rubrique 10, et leurs rappels de format."""
    return PAR_CAHIER[cle].get("parcours", PARCOURS_2ND_CYCLE)


def titre_rubrique(cle):
    return PAR_CAHIER[cle].get("titre_rubrique",
                               "10. Vers le Probatoire — Vers le BAC")


def chapeau(cle):
    return PAR_CAHIER[cle].get(
        "chapeau",
        "Deux entraînements complets, l'un au format du Probatoire, l'autre au format du "
        "Baccalauréat. Chacun propose un sujet de commentaire composé accompagné de son "
        "texte, et un sujet de dissertation, tous deux portant sur l'œuvre étudiée. Les "
        "pistes indiquées ne sont pas un corrigé : elles signalent ce qu'un devoir solide "
        "devrait exploiter.")


def baremes(cle):
    """(barème du commentaire, barème de la dissertation) pour ce cahier."""
    return PAR_CAHIER[cle].get("baremes",
                               (BAREME_2ND_CYCLE_CC, BAREME_2ND_CYCLE_DISS))
