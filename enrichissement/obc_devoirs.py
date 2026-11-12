# -*- coding: utf-8 -*-
"""
Rubriques du corrigé national manquantes aux devoirs rédigés des sept cahiers
antérieurs.

Ces devoirs ont été écrits avant qu'on dispose du recueil des corrigés
harmonisés de l'OBC. Leur contenu est bon ; c'est leur **charpente** qui
n'est pas celle du corrigé national. Il leur manque :

  • pour un commentaire composé — l'**idée générale**, la **problématique**
    formulée en question, l'annonce du **plan possible** en centres d'intérêt,
    et surtout la rubrique finale **« Intérêts du texte »**, que la grille
    note 1,5 point et que les copies oublient ;
  • pour une dissertation — le **thème**, la **reformulation** de la citation,
    la **problématique**, le **type de plan** et son annonce.

Rien n'est réécrit du corps des devoirs : on ajoute ce qui manque, et
`builder` renomme les parties (« I. » → « Premier centre d'intérêt — »).
Le cahier « stances » n'y figure pas : ses quatre devoirs ont été rédigés
directement sur les maquettes.

L'ordre des clés suit celui des modules : `COMMENTAIRES[0]`, `[1]`, puis
`DISSERTATIONS[0]`, `[1]`.
"""

# ═════════════════════════════════════════════ COMMENTAIRES COMPOSÉS
CC = {
    ("vieuxnegre", 0): dict(
        idee="Le texte montre un vieux paysan décoré par l'administration "
             "coloniale au moment précis où cette même administration le rejette "
             "hors du cercle des Blancs, sans qu'un seul personnage prononce la "
             "moindre parole d'exclusion.",
        problematique="Comment un texte qui ne comporte ni discours ni "
                      "commentaire du narrateur parvient-il à ruiner une "
                      "cérémonie officielle ?",
        annonce="Trois centres d'intérêt peuvent être envisagés : la "
                "construction méthodique d'une illusion, le geste qui la "
                "défait, et la riposte intérieure du personnage.",
        interets=[
            "**Intérêt stylistique.** L'art de l'ellipse et de la voix "
            "effacée : discours indirect libre, tournures impersonnelles sans "
            "agent nommé, comparaisons empruntées au monde paysan, et une "
            "incise de deux mots qui suffit à retourner la scène.",
            "**Intérêt psychologique.** Le passage de la fierté à la lucidité "
            "chez un homme qui n'a pas les mots pour dire ce qu'il éprouve : "
            "le texte fait sentir une humiliation que le personnage lui-même "
            "ne formule pas.",
            "**Intérêt social ou humain.** La mécanique de la domination "
            "coloniale saisie dans un détail matériel — une place, un cercle, "
            "un seuil — plutôt que dans un discours ; d'où sa portée générale.",
        ]),
    ("vieuxnegre", 1): dict(
        idee="Enfermé dans la cellule d'un poste de police, le personnage "
             "passe du mépris à la décision, puis découvre que sa décision ne "
             "change rien à sa situation.",
        problematique="Comment un texte peut-il faire naître la grandeur d'un "
                      "personnage au moment même où il en montre "
                      "l'impuissance ?",
        annonce="Trois centres d'intérêt peuvent être envisagés : le passage "
                "d'un raisonnement à une décision, la grandeur du défi, et "
                "l'annulation intégrale de cette puissance.",
        interets=[
            "**Intérêt stylistique.** Le monologue intérieur rendu par le "
            "discours indirect libre, l'énumération de la lignée, et le "
            "contraste entre l'ampleur du vocabulaire et l'exiguïté du lieu.",
            "**Intérêt psychologique.** La naissance d'une dignité dans la "
            "solitude et l'humiliation : le personnage se donne une grandeur "
            "que personne ne viendra reconnaître.",
            "**Intérêt social ou humain.** Ce que devient une autorité "
            "traditionnelle quand un ordre étranger la prive de tout effet : "
            "le texte pose la question sans y répondre.",
        ]),

    ("lionperle", 0): dict(
        idee="Devenue célèbre par des photographies parues dans un magazine, "
             "la jeune Sidi dresse du vieux chef du village un portrait "
             "méthodiquement dévalorisant, et se déclare supérieure à lui.",
        problematique="Comment une tirade de triomphe peut-elle préparer, sans "
                      "le savoir, la défaite de celle qui la prononce ?",
        annonce="Trois centres d'intérêt peuvent être envisagés : une "
                "conscience de soi née d'une image, un portrait construit "
                "comme une machine de guerre, et une lucidité qui ne protège "
                "de rien.",
        interets=[
            "**Intérêt stylistique.** La richesse des outils de "
            "dévalorisation : caractérisation péjorative, comparaisons "
            "empruntées au monde rural, antithèse finale entre « l'éclat de la "
            "perle » et « l'arrière-train du lion ».",
            "**Intérêt psychologique.** La naissance d'un orgueil chez une "
            "jeune fille à qui une image renvoie soudain sa propre valeur — et "
            "l'aveuglement que cet orgueil produit.",
            "**Intérêt social ou humain.** Le pouvoir que l'image imprimée "
            "exerce sur une communauté villageoise, et le déplacement de "
            "prestige qu'elle provoque.",
        ]),
    ("lionperle", 1): dict(
        idee="Au dénouement, l'instituteur qui se disait moderne réagit à la "
             "perte de Sidi par une lamentation empruntée au théâtre, puis se "
             "reprend en une phrase qui ruine tout ce qu'il vient de dire.",
        problematique="Comment le dénouement d'une comédie peut-il défaire un "
                      "personnage sans jamais le condamner explicitement ?",
        annonce="Trois centres d'intérêt peuvent être envisagés : une tragédie "
                "de pacotille, la phrase qui ruine tout, et un homme qui "
                "n'obéit qu'à des modèles.",
        interets=[
            "**Intérêt stylistique.** Le décalage comique entre le registre "
            "élevé — apostrophes au ciel, exclamations, vocabulaire tragique — "
            "et la banalité de la situation ; la chute obtenue par une seule "
            "phrase.",
            "**Intérêt psychologique.** Le portrait d'un homme qui ne sent "
            "rien par lui-même et n'éprouve que ce que ses lectures lui "
            "prescrivent d'éprouver.",
            "**Intérêt social ou humain.** La question d'une modernité "
            "empruntée, récitée plutôt que comprise — enjeu majeur du "
            "continent au moment où la pièce est créée.",
        ]),

    ("ngum", 0): dict(
        idee="L'administrateur allemand propose au roi duala un arrangement "
             "personnel en échange de son accord au projet d'expropriation, et "
             "le roi déplace le débat du terrain de l'intérêt à celui du droit.",
        problematique="Comment une scène de corruption peut-elle devenir, sous "
                      "la plume du dramaturge, une leçon de droit ?",
        annonce="Trois centres d'intérêt peuvent être envisagés : une "
                "corruption rédigée comme un contrat, l'argument racial placé "
                "au cœur de l'offre, et un refus qui change de terrain.",
        interets=[
            "**Intérêt stylistique.** Le contraste entre le vocabulaire "
            "administratif et juridique de l'offre et la simplicité de la "
            "réponse ; la double énonciation, qui fait entendre au public ce "
            "que le corrupteur croit dissimuler.",
            "**Intérêt psychologique.** La tentation présentée sous son jour "
            "le plus raisonnable, et la fermeté d'un homme qui refuse sans "
            "hausser le ton.",
            "**Intérêt historique et social.** Le mécanisme réel de "
            "l'expropriation du plateau Joss, et le recours au traité de 1884 "
            "comme arme d'un colonisé contre le colonisateur.",
        ]),
    ("ngum", 1): dict(
        idee="La veille de son exécution, le roi refuse l'évasion que ses "
             "proches ont préparée, et le chœur commente ce refus sans "
             "parvenir à le faire changer d'avis.",
        problematique="Comment une pièce peut-elle rendre héroïque un refus "
                      "qui conduit son personnage à la mort ?",
        annonce="Trois centres d'intérêt peuvent être envisagés : une "
                "tentation rendue raisonnable, un refus qui commence par le "
                "corps, et le chœur comme mesure de la solitude du héros.",
        interets=[
            "**Intérêt stylistique.** L'usage du chœur, hérité de la tragédie "
            "antique et acclimaté au chant duala ; la brièveté des répliques "
            "du héros face à l'abondance de celles qui le pressent.",
            "**Intérêt psychologique.** Le courage montré non comme une "
            "absence de peur, mais comme une décision maintenue contre "
            "l'affection de ceux qui veulent sauver le personnage.",
            "**Intérêt historique et humain.** La construction d'une figure "
            "nationale à partir de faits datés, et la question de ce qu'un "
            "peuple fait de la mort de ses héros.",
        ]),

    ("capitoline", 0): dict(
        idee="À la mort de son enfant, une jeune mère se voit refuser "
             "l'enterrement au village du père, et cette exclusion s'accomplit "
             "sans qu'aucun personnage la formule.",
        problematique="Comment un roman peut-il rendre insupportable une "
                      "injustice dont il ne désigne aucun auteur ?",
        annonce="Trois centres d'intérêt peuvent être envisagés : une "
                "exclusion qui ne se formule jamais, une mère qui obtient et "
                "qui se tait, et une blessure à laquelle il manque un coupable.",
        interets=[
            "**Intérêt stylistique.** L'ellipse et les tournures sans agent, "
            "qui laissent la décision sans auteur ; la sobriété d'une écriture "
            "qui refuse le pathétique là où le sujet l'appellerait.",
            "**Intérêt psychologique.** La douleur d'une mère à qui l'on ne "
            "refuse rien ouvertement, et qui comprend pourtant qu'elle n'a rien "
            "obtenu.",
            "**Intérêt social ou humain.** Le poids des appartenances — le "
            "« village », la « tribu » — sur des vies individuelles, et la "
            "difficulté d'attaquer une coutume que personne n'assume "
            "personnellement.",
        ]),
    ("capitoline", 1): dict(
        idee="L'épilogue rappelle en deux phrases le projet initial du héros — "
             "réussir à Douala et rendre sa mère heureuse — et mesure la "
             "distance qui le sépare désormais de ce projet.",
        problematique="Comment quelques lignes de clôture peuvent-elles "
                      "renverser le sens de tout un roman ?",
        annonce="Trois centres d'intérêt peuvent être envisagés : un "
                "renversement énoncé en deux phrases, une géographie qui "
                "interdit le retour, et une ironie tragique laissée ouverte.",
        interets=[
            "**Intérêt stylistique.** L'art de la clôture : reprise des mots "
            "du début, brièveté des phrases, refus d'un dénouement explicite ; "
            "le lecteur achève lui-même le raisonnement.",
            "**Intérêt psychologique.** Le décalage entre ce qu'un homme "
            "voulait et ce qu'il est devenu, saisi sans qu'il en soit rendu "
            "responsable.",
            "**Intérêt social ou humain.** L'exode vers la ville et son prix : "
            "le roman montre ce que coûte, dans les familles, une réussite "
            "qu'on est allé chercher ailleurs.",
        ]),

    ("tenebres", 0): dict(
        idee="Descendu à l'écart du chantier, le narrateur découvre un bosquet "
             "où des hommes épuisés viennent mourir, et il décrit cette scène "
             "sans jamais élever la voix.",
        problematique="Comment un récit peut-il dénoncer une entreprise "
                      "coloniale par la seule exactitude de sa description ?",
        annonce="Trois centres d'intérêt peuvent être envisagés : un chantier "
                "qui ne produit rien, une déshumanisation que la phrase "
                "enregistre, et un visage suivi de questions sans réponse.",
        interets=[
            "**Intérêt stylistique.** Le refus de l'indignation déclarée : "
            "champ lexical de la mécanique appliqué aux hommes, comparaisons "
            "minérales, phrase longue et retenue ; l'émotion naît du détail, "
            "non du commentaire.",
            "**Intérêt psychologique.** Le trouble d'un narrateur qui regarde "
            "et ne peut rien, et qui rapporte son impuissance sans se "
            "justifier.",
            "**Intérêt social ou humain.** Le fonctionnement réel d'une "
            "entreprise coloniale, montré par ses rebuts plutôt que par ses "
            "discours.",
        ]),
    ("tenebres", 1): dict(
        idee="Revenu en Europe, le narrateur rend visite à celle qui attendait "
             "Kurtz et lui rapporte des derniers mots qui ne sont pas les "
             "siens.",
        problematique="Que signifie un mensonge chez un narrateur qui a "
                      "déclaré détester le mensonge ?",
        annonce="Trois centres d'intérêt peuvent être envisagés : une scène "
                "bâtie sur une équivoque, un mensonge pesé et sans "
                "conséquence, et une composition qui referme le cercle.",
        interets=[
            "**Intérêt stylistique.** La construction en boucle du récit, le "
            "jeu de l'ombre et de la lumière, et l'usage de la parole "
            "rapportée pour dire l'inverse de ce qui a été entendu.",
            "**Intérêt psychologique.** La compassion et la lâcheté nouées "
            "dans le même geste : le narrateur ment par égard, et le sait.",
            "**Intérêt social ou humain.** Ce que l'Europe consent à ignorer "
            "de ce qui se fait en son nom — et le rôle qu'y prennent ceux qui "
            "reviennent.",
        ]),

    ("tartuffe", 0): dict(
        idee="De retour de voyage, Orgon s'informe de sa maison et n'entend "
             "que ce qui concerne Tartuffe, répondant quatre fois la même "
             "chose à quatre nouvelles opposées.",
        problematique="Comment une scène de comédie fondée sur une seule "
                      "répétition parvient-elle à faire le portrait complet "
                      "d'un homme ?",
        annonce="Deux centres d'intérêt peuvent être envisagés : une mécanique "
                "comique parfaitement réglée, et le portrait d'un aveugle.",
        interets=[
            "**Intérêt stylistique.** Le comique de répétition porté par la "
            "reprise anaphorique de « Et Tartuffe ? » et de « Le pauvre "
            "homme ! » ; la stichomythie, et le contraste entre les nouvelles "
            "de Dorine et les réponses d'Orgon.",
            "**Intérêt psychologique.** L'aveuglement montré non comme une "
            "sottise passagère, mais comme un système : Orgon entend tout et "
            "ne retient rien.",
            "**Intérêt social ou humain.** La dénonciation de la fausse "
            "dévotion et du pouvoir qu'elle prend sur un esprit crédule — sujet "
            "qui valut à la pièce cinq années d'interdiction.",
        ]),
    ("tartuffe", 1): dict(
        idee="Dénoncé par Damis, Tartuffe s'accuse lui-même avec tant "
             "d'excès qu'Orgon le croit innocent, chasse son fils et lui donne "
             "ses biens.",
        problematique="Comment un aveu peut-il devenir le plus efficace des "
                      "moyens de défense ?",
        annonce="Deux centres d'intérêt peuvent être envisagés : un aveu qui "
                "n'avoue rien, et une famille retournée contre elle-même.",
        interets=[
            "**Intérêt stylistique.** L'hyperbole et l'accumulation mises au "
            "service de la ruse ; le vocabulaire religieux détourné en "
            "instrument de manipulation ; l'ironie de situation, que seul le "
            "public perçoit.",
            "**Intérêt psychologique.** La mécanique de l'emprise : plus "
            "l'accusé s'accuse, plus l'aveuglé le défend.",
            "**Intérêt social ou humain.** Le danger d'une dévotion qu'on ne "
            "vérifie pas, et la ruine d'une famille livrée à un imposteur.",
        ]),

    ("sauvages", 0): dict(
        idee="Le poème s'ouvre sur l'annonce d'une mort, dite par un "
             "rapprochement de mots contraires, et le corps du poète y prend en "
             "charge le deuil avant que la parole ne le formule.",
        problematique="Comment un poème peut-il annoncer une mort sans jamais "
                      "la raconter ?",
        annonce="Deux centres d'intérêt peuvent être envisagés : une mort "
                "annoncée par le contraste, et un deuil pris en charge par le "
                "corps.",
        interets=[
            "**Intérêt stylistique.** L'oxymore inaugural, la reprise "
            "anaphorique du « et », les images surréalistes qui rapprochent des "
            "mots que l'usage sépare, et l'absence de majuscules et de "
            "ponctuation.",
            "**Intérêt psychologique.** Le deuil saisi dans ses effets "
            "physiques — les yeux, la gorge, les paupières — avant d'être "
            "nommé.",
            "**Intérêt social ou humain.** La réponse d'un poète au "
            "terrorisme : nommer une victime plutôt que compter des morts.",
        ]),
    ("sauvages", 1): dict(
        idee="Dans les dernières pages, le poète reprend la liste des villes "
             "frappées, mais précédée d'une négation, et il enchaîne des verbes "
             "au futur qui désarment la violence au lieu de la venger.",
        problematique="Comment une même énumération peut-elle, reprise à la "
                      "fin d'un livre, dire le contraire de ce qu'elle disait "
                      "au début ?",
        annonce="Deux centres d'intérêt peuvent être envisagés : une "
                "énumération employée à l'envers, et une litanie de futurs qui "
                "aboutit à un désarmement.",
        interets=[
            "**Intérêt stylistique.** La reprise d'un motif à distance, la "
            "négation placée en tête d'énumération, et l'emploi du futur comme "
            "temps de la promesse plutôt que de la prédiction.",
            "**Intérêt psychologique.** Le passage du deuil à l'espérance, "
            "obtenu sans consolation ni oubli.",
            "**Intérêt social ou humain.** Le refus de laisser le dernier mot "
            "à la violence, et le choix de la fraternité comme réponse "
            "politique.",
        ]),
}


# ═══════════════════════════════════════════════════════ DISSERTATIONS
DISS = {
    ("vieuxnegre", 0): dict(
        theme="Les moyens de la dénonciation dans le roman.",
        reformulation="La question posée revient à se demander si un roman "
                      "dénonce plus efficacement en montrant un personnage qui "
                      "se révolte ou un personnage qui se soumet.",
        problematique="La force critique d'un roman tient-elle à la révolte de "
                      "son personnage ou à la lucidité qu'il éveille chez son "
                      "lecteur ?",
        type_plan="Le sujet, formulé en alternative, incline à adopter un plan "
                  "dialectique.",
        annonce="Nous examinerons d'abord la clarté du modèle révolté, puis "
                "l'efficacité propre de la résignation apparente, avant de "
                "montrer que les deux voies se rejoignent."),
    ("vieuxnegre", 1): dict(
        theme="Les fonctions du rire dans une œuvre de dénonciation.",
        reformulation="Selon cette affirmation, le rire pourrait n'être qu'une "
                      "façon de rendre l'humiliation supportable, au lieu de la "
                      "combattre.",
        problematique="Le rire est-il une arme contre l'humiliation, ou un "
                      "moyen de s'en accommoder ?",
        type_plan="Le sujet appelle une discussion : le plan dialectique "
                  "s'impose.",
        annonce="Nous verrons d'abord le rire comme riposte, puis les limites "
                "que le texte lui-même désigne, avant d'établir ce que le rire "
                "obtient réellement."),

    ("lionperle", 0): dict(
        theme="Le conflit de la tradition et de la modernité dans le théâtre "
              "africain.",
        reformulation="Cette affirmation soutient que la pièce oppose deux "
                      "mondes et tranche en faveur du monde ancien.",
        problematique="Le lion et la perle donne-t-il raison à la tradition, "
                      "ou récuse-t-il l'opposition même sur laquelle repose "
                      "cette lecture ?",
        type_plan="Le sujet propose un jugement tranché : le plan dialectique "
                  "s'impose.",
        annonce="Nous verrons d'abord ce qui autorise cette lecture, puis "
                "pourquoi elle ne résiste pas au texte, avant de préciser ce "
                "que Soyinka oppose réellement."),
    ("lionperle", 1): dict(
        theme="La fonction du personnage trompeur au théâtre.",
        reformulation="Selon cette affirmation, celui qui ruse en apprendrait "
                      "davantage au spectateur que celui qui dit vrai.",
        problematique="Le personnage qui trompe est-il plus instructif que "
                      "celui qui dit la vérité, ou l'enseignement naît-il "
                      "ailleurs ?",
        type_plan="Le sujet invite à apprécier une affirmation : le plan "
                  "dialectique convient.",
        annonce="Nous verrons d'abord le trompeur comme révélateur des autres "
                "et du monde, puis les limites de cette supériorité, avant de "
                "montrer que la leçon naît de l'écart et non du personnage."),

    ("ngum", 0): dict(
        theme="Les conditions du tragique au théâtre.",
        reformulation="Cette affirmation subordonne le tragique à l'existence "
                      "d'un choix : sans liberté, il n'y aurait pas de "
                      "tragédie.",
        problematique="Le tragique suppose-t-il que le héros ait pu faire "
                      "autrement, ou naît-il précisément de l'impossibilité de "
                      "faire autrement ?",
        type_plan="Le sujet énonce une condition à discuter : le plan "
                  "dialectique s'impose.",
        annonce="Nous verrons d'abord qu'un héros sans choix ne produit que du "
                "pathétique, puis que le tragique naît aussi de la nécessité, "
                "avant de situer le tragique dans l'écart entre ce qu'on "
                "choisit et ce qu'on subit."),
    ("ngum", 1): dict(
        theme="Le rapport entre l'œuvre littéraire et la mémoire nationale.",
        reformulation="Selon cette affirmation, célébrer un héros national "
                      "exposerait l'écrivain à produire un monument plutôt "
                      "qu'une œuvre.",
        problematique="Une œuvre consacrée à un héros national peut-elle "
                      "servir une mémoire sans cesser d'être une œuvre ?",
        type_plan="Le sujet signale un risque à évaluer : le plan dialectique "
                  "convient.",
        annonce="Nous verrons d'abord que le risque est réel, puis ce qui, "
                "dans la pièce, y résiste, avant de dire à quelles conditions "
                "une œuvre peut servir une mémoire."),

    ("capitoline", 0): dict(
        theme="La place des idées dans le roman.",
        reformulation="Cette affirmation distingue l'idée qu'un personnage "
                      "découvre de l'idée que l'auteur énonce, et ne reconnaît "
                      "de valeur qu'à la première.",
        problematique="Un roman d'idées vaut-il seulement lorsque l'idée y est "
                      "trouvée par un personnage plutôt qu'énoncée par "
                      "l'auteur ?",
        type_plan="Le sujet propose une règle exclusive : le plan dialectique "
                  "s'impose.",
        annonce="Nous verrons d'abord qu'une idée trouvée vaut mieux qu'une "
                "idée énoncée, puis que l'auteur peut aussi parler en son nom, "
                "avant d'établir le vrai partage entre le roman qui démontre "
                "et celui qui montre."),
    ("capitoline", 1): dict(
        theme="La vérité du personnage romanesque.",
        reformulation="Selon cette affirmation, l'erreur d'un personnage "
                      "serait la marque même de sa vérité.",
        problematique="Un personnage est-il d'autant plus vrai qu'il se "
                      "trompe, ou sa vérité tient-elle à autre chose ?",
        type_plan="Le sujet énonce une équivalence à éprouver : le plan "
                  "dialectique convient.",
        annonce="Nous verrons d'abord l'erreur comme signe de vie, puis "
                "qu'elle ne suffit pas, avant de situer la vérité d'un "
                "personnage dans sa contradiction."),

    ("tenebres", 0): dict(
        theme="Les limites de ce qu'une œuvre littéraire peut dire.",
        reformulation="Cette affirmation soutient qu'il existerait, pour "
                      "l'écrivain, un devoir de silence.",
        problematique="Une œuvre littéraire a-t-elle le devoir de taire "
                      "certaines vérités, ou ce silence la rend-il complice de "
                      "ce qu'elle tait ?",
        type_plan="Le sujet formule un devoir à discuter : le plan dialectique "
                  "s'impose.",
        annonce="Nous verrons d'abord ce que le silence protège, puis en quoi "
                "taire revient parfois à laisser faire, avant de distinguer "
                "deux silences que rien n'autorise à confondre."),
    ("tenebres", 1): dict(
        theme="La nature du récit de voyage.",
        reformulation="Selon cette affirmation, le récit de voyage renseigne "
                      "davantage sur le voyageur que sur les pays qu'il "
                      "traverse.",
        problematique="Un récit de voyage nous apprend-il davantage sur celui "
                      "qui voyage que sur les pays traversés ?",
        type_plan="Le sujet propose une affirmation générale : le plan "
                  "dialectique convient.",
        annonce="Nous verrons d'abord que le voyageur se peint en décrivant, "
                "puis qu'un récit peut aussi établir des faits, avant de "
                "montrer qu'il fait surtout connaître une relation."),

    ("tartuffe", 0): dict(
        theme="La finalité de la comédie.",
        reformulation="Molière assigne à la comédie une double fin : corriger "
                      "les mœurs et divertir le public, la seconde servant la "
                      "première.",
        problematique="La comédie corrige-t-elle réellement les hommes, ou se "
                      "borne-t-elle à les divertir ?",
        type_plan="Le sujet cite l'auteur de l'œuvre au programme : on "
                  "adoptera un plan dialectique, en partant de ce que la pièce "
                  "vérifie.",
        annonce="Nous verrons d'abord que la pièce divertit, puis qu'elle "
                "corrige, avant de montrer que le rire y est le moyen même de "
                "la correction."),
    ("tartuffe", 1): dict(
        theme="Le mode d'existence du personnage de théâtre.",
        reformulation="Cette affirmation lie l'existence d'un personnage à sa "
                      "présence physique sur le plateau.",
        problematique="Un personnage de théâtre n'existe-t-il que lorsqu'il "
                      "est en scène ?",
        type_plan="Le sujet propose une règle générale que l'œuvre met en "
                  "défaut : le plan dialectique s'impose.",
        annonce="Nous verrons d'abord ce qui rend l'affirmation solide, puis "
                "ce que le cas de Tartuffe lui oppose, avant de montrer que la "
                "question est mal posée."),

    ("sauvages", 0): dict(
        theme="Le pouvoir de la poésie face à la violence.",
        reformulation="Cette affirmation dénie au poème toute efficacité "
                      "devant la violence du monde.",
        problematique="Un poème est-il impuissant devant la violence, ou agit-"
                      "il autrement qu'on ne l'attend ?",
        type_plan="Le sujet énonce un jugement négatif : le plan dialectique "
                  "s'impose.",
        annonce="Nous verrons d'abord ce qui donne raison à cette affirmation, "
                "puis ce que le poème lui oppose, avant de proposer l'image du "
                "contre-feu."),
    ("sauvages", 1): dict(
        theme="La définition du poème et le rôle de la forme.",
        reformulation="La question revient à se demander si les marques "
                      "extérieures du vers — rime, majuscule, ponctuation — "
                      "sont constitutives du poème.",
        problematique="Un texte privé des marques ordinaires du vers est-il "
                      "encore un poème ?",
        type_plan="Le sujet pose une question fermée qui appelle un examen en "
                  "trois temps.",
        annonce="Nous verrons d'abord ce qui semble manquer, puis ce que le "
                "texte met à la place, avant de dire ce qui fait un poème."),
}


def commentaire(cle, index):
    return CC.get((cle, index))


def dissertation(cle, index):
    return DISS.get((cle, index))
