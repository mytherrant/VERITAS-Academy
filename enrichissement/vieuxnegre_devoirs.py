# -*- coding: utf-8 -*-
"""Devoirs conformes au format MINESEC — « Le vieux nègre et la médaille ».

Format officiel de l'épreuve de français du second cycle (Probatoire / BAC) :
durée 4 h, coefficient 3 (série A) ou 2 (séries C, D, E), épreuve unique avec
choix entre trois sujets — contraction de texte, dissertation littéraire,
commentaire composé.

Les corrigés appliquent les grilles harmonisées de l'Office du Baccalauréat
(4 critères : Compréhension 6 + Organisation 6 + Expression 6 + Originalité 2).

NOTE SUR LE TEXTE DE CONTRACTION : le support du sujet 1 est un texte original
rédigé pour ce cahier. Il n'est attribué à aucun auteur : aucun extrait
d'auteur n'est jamais reproduit ici sans que la source exacte soit donnée.

Source régénérée depuis le bytecode après la perte des fichiers .py.
"""
import obc


DEVOIR1 = dict(
    titre='Devoir n° 1 — Épreuve blanche de type BAC',
    entete=[
        [
            'Examen',
            'Baccalauréat blanc — Centre VÉRITAS',
        ],
        [
            'Épreuve',
            'Français',
        ],
        [
            'Séries',
            'A (coefficient 3) — C, D, E (coefficient 2)',
        ],
        [
            'Durée',
            '4 heures',
        ],
        [
            'Consigne générale',
            'Le candidat traite **un seul** des trois sujets proposés.',
        ],
    ],
    consigne_generale="L'usage du dictionnaire n'est pas autorisé. La qualité de l'expression et la présentation de la copie entrent dans l'appréciation. Le candidat indiquera clairement en tête de copie le numéro du sujet choisi.",
    sujets=[
        dict(
            support="""Nous avons pris l'habitude de juger sévèrement ceux qui, sous la colonisation, ont accepté les honneurs de l'administration. Le mot de collaboration vient vite, et avec lui le confort de la condamnation rétrospective. Il faudrait pourtant se demander ce que nous aurions fait à leur place, et surtout ce que ces honneurs signifiaient réellement pour ceux qui les recevaient.

Une décoration n'est pas d'abord un morceau de métal. C'est une phrase que le pouvoir prononce sur un homme devant sa communauté rassemblée. Elle dit : celui-ci compte. Pour un paysan dont les terres ont été prises et les fils enterrés au loin, cette phrase-là n'est pas rien. Elle propose une réparation symbolique là où aucune réparation réelle n'est envisageable. Accepter la médaille, ce n'est pas nécessairement se soumettre ; c'est parfois tenter de récupérer, dans le langage de l'occupant, une reconnaissance que sa propre société ne peut plus garantir puisqu'elle a été désorganisée.

Le piège, évidemment, tient à ce que cette reconnaissance est révocable. Elle ne repose sur aucun droit, seulement sur la faveur. L'homme décoré le matin peut être arrêté le soir sans que personne y trouve à redire, car rien, dans le geste qui l'a honoré, ne l'a rendu titulaire de quoi que ce soit. Il a reçu un signe, non un statut. Et c'est précisément là que réside la violence du système : il distribue des marques d'estime tout en refusant les garanties qui donneraient à ces marques une consistance.

On comprend alors pourquoi le ridicule s'attache si souvent aux décorés coloniaux dans la littérature africaine. Ce ridicule n'est pas une méchanceté d'écrivain. Il enregistre un fait : celui qui croit avoir obtenu une place découvre qu'il n'a obtenu qu'un ornement, et cette découverte est d'autant plus cruelle qu'elle est publique. L'homme est humilié deux fois, une fois par le pouvoir qui le lâche, une fois par les siens qui l'ont vu y croire.

Faut-il en conclure qu'il aurait mieux valu refuser ? La question est plus difficile qu'elle n'en a l'air. Refuser suppose qu'on dispose d'un ailleurs — une autre société, un autre système de reconnaissance, encore vivant et capable de vous tenir lieu de monde. Or c'est exactement ce que la colonisation avait entrepris de démonter. Elle n'a pas seulement pris des terres et des vies : elle a rendu inopérants les mécanismes par lesquels une communauté disait à ses membres qu'ils valaient quelque chose. En détruisant cet ailleurs, elle a fabriqué la dépendance qu'elle reprochait ensuite à ses obligés.

Le jugement moral, ici, doit donc céder le pas à l'analyse. Ceux qui ont accepté n'étaient ni des traîtres ni des naïfs : ils étaient des hommes placés dans une situation où toutes les issues avaient été bouchées, sauf une, et qui ne menait nulle part. Les écrivains l'ont mieux compris que les moralistes, parce qu'ils ont dû, pour écrire, entrer dans la tête de leurs personnages plutôt que les regarder de loin.""",
            source_support="Texte rédigé pour le présent cahier (environ 520 mots). Aucun auteur n'est cité : ce support est original.",
            consignes=[
                "**1. Contraction (10 points).** Résumez ce texte au quart de sa longueur, soit environ 130 mots (une marge de ± 10 % est admise). Vous indiquerez le nombre de mots employés. Vous respecterez l'enchaînement des idées de l'auteur et vous vous exprimerez en votre propre langage, sans recopier de phrases entières.",
                "**2. Discussion (10 points).** « Le jugement moral doit céder le pas à l'analyse. » Partagez-vous ce point de vue ? Vous répondrez dans un développement organisé, en vous appuyant sur Le vieux nègre et la médaille et sur d'autres lectures.",
            ],
            bareme='Contraction : 10 points — Discussion : 10 points',
            num='Sujet I — Contraction de texte et discussion',
        ),
        dict(
            support=None,
            source_support=None,
            consignes=[
                "Un critique écrit à propos du roman africain de la période coloniale : « Les plus grands de ces livres ne nous montrent pas des héros, mais des hommes à qui l'on a retiré la possibilité d'en être. »",
                "**Commentez et discutez ce jugement** en vous appuyant sur Le vieux nègre et la médaille de Ferdinand Oyono et sur d'autres œuvres de votre choix.",
            ],
            bareme='Compréhension / Pertinence : 6 — Organisation / Cohérence : 6 — Correction de l’expression : 6 — Originalité de la production : 2',
            num='Sujet II — Dissertation littéraire',
        ),
        dict(
            support="""Meka ne savait à qui s'adresser pour demander quand on allait se rendre au Foyer Africain. Il alla tapoter l'épaule du Père Vandermayer, qui le fusilla du regard tout en l'écartant d'un mouvement violent du revers de la main. Meka, complètement abasourdi, porta sa main à son menton en ouvrant la bouche comme un poisson. Non, ce n'était pas possible, le Père Vandermayer ne pouvait lui répondre de cette façon ?
Meka s'éloigna de quelques pas et alla s'appuyer contre le mur. Il allongea ses jambes et posa ses mains sur ses hanches. Il hocha plusieurs fois la tête puis elle ne bougea plus. L'étonnement lui laissait la bouche ouverte comme la gueule d'un animal étranglé. Il fixait le sol, bêtement fasciné comme si le ciment avait eu des yeux de serpent. Il ne regardait plus le groupe des Blancs et seul le brouhaha de leur conversation lui parvenait. Où est-ce qu'il avait entendu les Blancs parler comme cela, sans qu'il les comprît ni ne les vît ? Il prit sa tête dans ses mains et se mit à se presser les tempes comme s'il eût voulu faire sortir le souvenir fugace du chaos de sa mémoire. Il fronça les sourcils puis son visage se détendit. Il avait trouvé : c'était au phonographe ! Il ferma les yeux et chassa le Père Vandermayer, M. Fouconi et le grand Chef des Blancs de ses pensées.
C'est à ce moment qu'on lui tapota sur l'épaule. Meka, bien avant d'ouvrir les yeux, sentit le Père Vandermayer. Il reconnaissait bien sa façon de frapper sur l'épaule de ses fidèles quand il passait derrière eux le dimanche pour ramasser l'argent au Credo.
— As-tu la maladie du sommeil ? lui demanda-t-il dans un mauvais mvema.
Il se mit à rire, puis le rire se figea sur ses lèvres. Meka venait de lui lancer la première œillade courroucée de sa vie.
— Es-tu malade, as-tu mal quelque part ? bégaya le Père Vandermayer.
— Non, mon Père, je suis un peu fatigué, mentit Meka.""",
            source_support='Ferdinand Oyono, Le vieux nègre et la médaille, Deuxième partie, chap. I. Édition 10/18, 1956.',
            consignes=[
                '**Faites le commentaire composé de ce texte.** Vous pourrez étudier, entre autres, la manière dont un geste minuscule défait une cérémonie officielle, ainsi que les moyens par lesquels le narrateur fait naître le jugement du lecteur sans jamais le formuler lui-même.',
            ],
            bareme="Compréhension : 6 — Organisation des idées : 6 — Langue et style : 6 — Présentation de la copie : 2",
            num='Sujet III — Commentaire composé',
        ),
    ],
)

DEVOIR1_CORRIGE = dict(
    titre="Devoir n° 1 — Corrigé et grilles d'évaluation",
    sujets=[
        dict(
            blocs=[
                (
                    'Thème du texte',
                    'Le sens et le piège des décorations coloniales, et la difficulté de juger moralement ceux qui les ont acceptées.',
                ),
                (
                    "Thèse de l'auteur",
                    "Les décorés coloniaux ne doivent pas être condamnés : la colonisation avait détruit les systèmes de reconnaissance qui auraient permis de refuser, si bien que l'analyse de la situation doit primer sur le jugement moral.",
                ),
                (
                    'Structure du texte, paragraphe par paragraphe',
                    [
                        '**§ 1 — Position du problème.** Nous condamnons trop vite ceux qui ont accepté les honneurs coloniaux.',
                        "**§ 2 — Ce qu'est réellement une décoration.** Non un objet, mais une parole publique de reconnaissance, précieuse pour qui a tout perdu.",
                        "**§ 3 — Le piège.** Cette reconnaissance est révocable : elle donne un signe, jamais un statut ; d'où l'arrestation possible le soir même.",
                        '**§ 4 — Conséquence littéraire.** Le ridicule attaché aux décorés enregistre une double humiliation, par le pouvoir et par les siens.',
                        '**§ 5 — Pourquoi le refus était presque impossible.** Refuser exige un ailleurs ; or la colonisation avait précisément détruit cet ailleurs.',
                        "**§ 6 — Conclusion.** Le jugement moral doit céder à l'analyse ; les écrivains l'ont compris avant les moralistes.",
                    ],
                ),
                (
                    'Proposition de contraction (132 mots)',
                    "On condamne trop aisément ceux qui acceptèrent les honneurs coloniaux. Or une décoration n'est pas un objet : c'est une parole publique affirmant qu'un homme compte. Pour un paysan dépossédé de ses terres et de ses fils, elle offre une réparation symbolique, faute de réparation réelle. Mais cette reconnaissance demeure révocable : elle procure un signe, non un droit, et le décoré du matin peut être emprisonné le soir. De là le ridicule dont la littérature africaine entoure ces personnages : ils découvrent publiquement qu'ils n'ont reçu qu'un ornement, et se trouvent humiliés par le pouvoir comme par les leurs. Refuser eût pourtant supposé qu'existât encore une autre société capable de reconnaître les siens — précisément ce que la colonisation avait démantelé. Comprendre importe donc plus que juger : les romanciers l'ont su avant les moralistes.",
                ),
                (
                    'Éléments attendus dans la discussion',
                    [
                        "**Sens de la formule.** Le candidat doit d'abord expliquer ce que signifie « céder le pas » : il ne s'agit pas de supprimer le jugement moral, mais de le faire précéder par la compréhension des contraintes.",
                        "**Arguments favorables.** L'analyse évite l'anachronisme ; elle rend compte de la destruction des cadres sociaux ; elle est la condition d'une littérature véritable, qui suppose d'entrer dans la conscience d'autrui. Exemple attendu : la focalisation interne du roman d'Oyono, qui interdit de juger Meka de l'extérieur.",
                        "**Arguments contraires.** Tout comprendre risque de tout excuser ; certaines conduites furent des choix et non des contraintes ; les victimes ont droit à ce que le tort subi soit nommé. Exemple attendu : Ngum a Jemea, où le refus de Dualla Manga Bell prouve qu'un autre choix était possible.",
                        "**Dépassement.** L'analyse et le jugement portent sur des objets différents : on analyse une situation, on juge un système. On peut donc comprendre Meka et condamner l'administration qui l'a décoré puis emprisonné.",
                    ],
                ),
                (
                    "Grille d'évaluation — Sujet I",
                    None,
                ),
            ],
            grille=[
                [
                    'Critère',
                    'Indicateurs',
                    'Points',
                ],
                [
                    'C1 — Compréhension / Pertinence',
                    'Le candidat reçoit 6 pts : si la contraction restitue la thèse et les six étapes du raisonnement sans contresens, et si la discussion traite effectivement la question posée. 4 pts : si une étape est omise ou si la discussion dérive vers un exposé sur la colonisation. 2 pts : si le texte est paraphrasé sans hiérarchie. 0 pt : si le sujet est hors de propos.',
                    '6',
                ],
                [
                    'C2 — Organisation / Cohérence',
                    "Le candidat reçoit 6 pts : si la contraction respecte l'ordre des idées et l'enchaînement logique, et si la discussion est structurée (thèse, antithèse, position personnelle) avec transitions. 4 pts : si le plan est perceptible mais sans transitions. 2 pts : si les idées sont juxtaposées sans progression.",
                    '6',
                ],
                [
                    'C3 — Expression / Correction de la langue',
                    "Le candidat reçoit 6 pts : si la reformulation est personnelle, la syntaxe correcte, le lexique précis, et si le nombre de mots est indiqué et respecté (±10 %). 4 pts : si quelques phrases sont recopiées ou si l'écart de longueur dépasse la marge. 2 pts : si les fautes gênent la lecture.",
                    '6',
                ],
                [
                    'C4 — Originalité de la production',
                    "Le candidat reçoit 2 pts : si la discussion mobilise des exemples littéraires précis et personnels, ou propose une nuance non prévue au corrigé. 1 pt : si les exemples sont exacts mais attendus. 0 pt : si aucun exemple n'est fourni.",
                    '2',
                ],
                [
                    '**Total**',
                    '',
                    '**20**',
                ],
            ],
            cloture='NB — Tous les éléments pertinents non prévus dans cette grille que le candidat aura ajoutés seront pris en compte. On restera ouvert à toute autre interprétation pertinente.',
            num='Corrigé du sujet I — Contraction et discussion',
        ),
        dict(
            blocs=[
                (
                    'Analyse du sujet',
                    "La citation oppose deux figures : le héros, qui dispose de la possibilité d'agir, et l'homme « à qui l'on a retiré » cette possibilité. Le candidat doit repérer que le jugement porte non sur la faiblesse des personnages mais sur ce qui leur a été ôté : la citation accuse un système, elle ne dénigre pas des individus. Un devoir qui comprendrait « les personnages sont médiocres » ferait un contresens et serait plafonné au critère C1.",
                ),
                (
                    'Problématique attendue',
                    "La force des grands romans de la période coloniale tient-elle à ce qu'ils montrent des personnages empêchés plutôt que des héros — et si oui, cette impuissance est-elle un aveu ou une accusation ?",
                ),
                (
                    'Plan indicatif — trois parties',
                    [
                        "**I. Le jugement se vérifie largement.** Meka ne décide rien : il reçoit une médaille qu'il n'a pas demandée, subit une arrestation dont il ignore le motif, ment au lieu de protester. Sa révolte n'a lieu que dans le noir, devant « l'invisible adversaire ». Renvoi possible à Une vie de boy, du même auteur, où Toundi meurt sans avoir jamais pu se défendre.",
                        "**II. Le jugement est cependant trop absolu.** Ngum a Jemea prouve qu'un personnage de refus est possible dans la même littérature et le même contexte : Dualla Manga Bell choisit la potence. Et même chez Oyono, Meka accomplit deux gestes de refus — l'« œillade courroucée » et le prétexte des mains boueuses. L'empêchement n'est donc pas total.",
                        "**III. L'empêchement est le sujet même de ces romans.** Ce que ces livres montrent n'est pas l'absence d'héroïsme mais la fabrication de cette absence : le cercle de chaux, la médaille révocable, la cellule. Le personnage empêché est un instrument de démonstration, non un constat de faiblesse. C'est pourquoi ces œuvres accusent plus efficacement qu'un récit héroïque.",
                    ],
                ),
                (
                    'Citations utiles au candidat',
                    [
                        "« Lui, il ne se trouvait ni avec les siens ni avec les autres. » (l'entre-deux)",
                        '« Non, mon Père, je suis un peu fatigué, mentit Meka. » (le mensonge comme seule liberté)',
                        "« tendait le bras droit à l'invisible adversaire » (la révolte sans objet)",
                        '« impersonnel comme un grain de sable dans le désert » (la thèse énoncée par le personnage lui-même)',
                        "« Je ne suis plus qu'un vieil homme… » (la chute)",
                    ],
                ),
                (
                    "Grille d'évaluation — Sujet II",
                    None,
                ),
            ],
            grille=[
                [
                    'Critère',
                    'Indicateurs',
                    'Points',
                ],
                [
                    'C1 — Compréhension / Pertinence',
                    "Le candidat reçoit 6 pts : s'il interprète correctement la citation (un système qui retire la possibilité d'agir, et non des personnages médiocres) et s'il discute réellement le jugement. 4 pts : s'il traite le sujet sans en discuter la portée. 2 pts : s'il récite le roman sans répondre. 0 pt : en cas de contresens sur la citation.",
                    '6',
                ],
                [
                    'C2 — Organisation / Cohérence',
                    "Le candidat reçoit 6 pts : si l'introduction pose le sujet, la problématique et l'annonce du plan ; si chaque partie soutient une thèse distincte ; si les transitions relient les parties ; si la conclusion répond et ouvre. 4 pts : si l'une de ces étapes manque. 2 pts : si le devoir est un exposé continu sans plan apparent.",
                    '6',
                ],
                [
                    'C3 — Expression / Correction de la langue',
                    'Le candidat reçoit 6 pts : si la langue est correcte, le vocabulaire critique employé à bon escient (focalisation, ironie, registre), les citations intégrées et ponctuées correctement. 4 pts : si des maladresses subsistent sans gêner. 2 pts : si les fautes rendent la lecture difficile.',
                    '6',
                ],
                [
                    'C4 — Originalité de la production',
                    "Le candidat reçoit 2 pts : s'il convoque une œuvre pertinente hors programme, ou propose un dépassement personnel argumenté. 1 pt : si les exemples sont corrects mais strictement scolaires. 0 pt : si aucun exemple hors du roman étudié n'est proposé.",
                    '2',
                ],
                [
                    '**Total**',
                    '',
                    '**20**',
                ],
            ],
            cloture="On restera ouvert à toute autre interprétation pertinente, notamment aux devoirs qui contesteraient la citation en s'appuyant sur des œuvres où le personnage agit effectivement.",
            num='Corrigé du sujet II — Dissertation',
        ),
        dict(
            blocs=[
                (
                    'Situation du texte',
                    "Deuxième partie, chapitre I. La médaille vient d'être remise ; Meka, sous la véranda, croit appartenir au monde des Blancs. Le passage constitue le point de bascule du roman.",
                ),
                (
                    'Axes attendus — au moins deux des trois suivants',
                    [
                        "**Axe 1 — Un geste qui annule une cérémonie.** L'exclusion sans agent (« Meka ne sut comment il s'était retrouvé à l'extérieur du cercle ») ; le revers de la main, geste réservé aux choses ; la simultanéité du regard et du geste (« tout en l'écartant »).",
                        "**Axe 2 — La dégradation du personnage par les comparaisons.** La série « comme un poisson » → « comme la gueule d'un animal étranglé » → « comme si le ciment avait eu des yeux de serpent » : gradation de l'hébétude à l'agonie puis à la fascination hypnotique.",
                        "**Axe 3 — Une riposte intérieure et un mensonge.** L'image du phonographe, trouvée par le personnage lui-même, qui réduit à son tour la parole des Blancs à un bruit ; « la première œillade courroucée de sa vie » ; l'incise finale « mentit Meka ».",
                    ],
                ),
                (
                    'Procédés que le candidat doit impérativement exploiter',
                    [
                        "Le discours indirect libre (« Non, ce n'était pas possible… de cette façon ? »)",
                        'Les incises de parole caractérisantes (« mentit Meka », « bégaya le Père »)',
                        "La focalisation interne et l'écart de savoir qu'elle installe avec le lecteur",
                        "Le détail liturgique détourné (la façon de frapper l'épaule « pour ramasser l'argent au Credo »)",
                        "L'absence totale de commentaire du narrateur",
                    ],
                ),
                (
                    'Erreurs fréquentes à sanctionner',
                    [
                        'Le plan « fond / forme », qui sépare artificiellement ce que le texte unit — à pénaliser au critère C2.',
                        'La paraphrase narrative (« Meka va voir le prêtre qui le repousse ») sans analyse de procédé — critère C1.',
                        'Les citations non intégrées ou non analysées — critère C1.',
                        "L'assimilation du narrateur à Ferdinand Oyono — critère C1.",
                    ],
                ),
                (
                    "Grille d'évaluation — Sujet III",
                    None,
                ),
            ],
            grille=[
                [
                    'Critère',
                    'Indicateurs',
                    'Points',
                ],
                [
                    'C1 — Compréhension / Pertinence',
                    "Le candidat reçoit 6 pts : s'il dégage au moins deux axes pertinents et les démontre par des procédés de style nommés et analysés. 4 pts : si les axes sont justes mais insuffisamment étayés. 2 pts : si le devoir paraphrase le texte. 0 pt : en cas de contresens sur le sens du passage.",
                    '6',
                ],
                [
                    'C2 — Organisation / Cohérence',
                    "Le candidat reçoit 6 pts : si l'introduction situe, problématise et annonce ; si chaque axe est composé de paragraphes reliés ; si la conclusion récapitule et ouvre. 4 pts : si le plan est correct mais sans transitions. 2 pts : si le commentaire suit l'ordre linéaire du texte sans axes construits.",
                    '6',
                ],
                [
                    'C3 — Expression / Correction de la langue',
                    'Le candidat reçoit 6 pts : si la langue est correcte et si le métalangage littéraire est employé avec exactitude. 4 pts : si le vocabulaire critique est approximatif. 2 pts : si les fautes gênent la compréhension.',
                    '6',
                ],
                [
                    'C4 — Originalité de la production',
                    "Le candidat reçoit 2 pts : s'il relève un procédé non prévu au corrigé et l'exploite pertinemment, ou s'il propose un rapprochement éclairant avec une autre page du roman. 1 pt : si l'analyse est correcte mais entièrement attendue.",
                    '2',
                ],
                [
                    '**Total**',
                    '',
                    '**20**',
                ],
            ],
            cloture="On insistera tout particulièrement sur l'exploitation par le candidat des procédés de style, les éléments du vocabulaire, la syntaxe, etc., dans ses démonstrations et autres illustrations. On restera également ouvert à toute autre interprétation pertinente du texte par le candidat.",
            num='Corrigé du sujet III — Commentaire composé',
        ),
    ],
    intro='Le corrigé suit la présentation des corrigés nationaux : thème, thèse, structure, proposition de traitement, puis grille chiffrée. Les indications « Le candidat reçoit X pt(s) si… » sont rédigées à la troisième personne, comme dans les documents officiels.',
)

DEVOIR2 = dict(
    titre="Devoir n° 2 — Devoir surveillé de contrôle (2 heures)",
    entete=[
        ["Nature", "Devoir de contrôle en cours d'étude de l'œuvre"],
        ["Classe", "Première / Terminale — toutes séries"],
        ["Durée", "2 heures"],
        ["Support", "Première partie, chapitre I — l'ouverture du roman"],
        ["Barème", "Questions : 12 points — Production écrite : 8 points"],
    ],
    consigne_generale="Ce devoir se place après l'étude des séquences 1 à 4. Il "
                      "vérifie la maîtrise des outils d'analyse avant "
                      "l'épreuve longue. Les questions sont à traiter dans "
                      "l'ordre ; la production écrite est obligatoire et "
                      "compte pour huit points.",
    support="""Meka était en avance sur le « bonjour du Seigneur », le premier rayon de soleil qui lui tombait habituellement dans la narine gauche, en s’infiltrant par l’un des trous du toit de raphia pourri et criblé de ciel.
Meka n’avait presque pas dormi. Les yeux le piquaient. Il bailla et s’étira pour décharger le panier de pierres qu’il sentait sur ses omoplates comme au lendemain d’une cuite. Il en voulut à sa femme qui continuait à ronfler. Comment pouvait-elle dormir si profondément alors que la convocation du commandant était sous le lit, dans une savate !
— Kelara ! hurla Meka en lui donnant des bourrades. Comment peux-tu dormir quand ton mari a des ennuis ?
Kelara jappa et se retourna contre le mur.
Meka l’empoigna par les épaules.
— Réveille-toi ! Comment peux-tu dormir quand j’ai des ennuis !... O femme aussi faible que les apôtres du Seigneur sur le mont des Oliviers ! Tu sais que je dois me présenter très tôt chez le commandant. Prions !... Tu laisseras les prières à tous les saints. Je ne veux pas être en retard... Au nom du Père... .
Ils prièrent d’une voix monotone et chantante, agenouillés sur leur lit de bambou comme des chameaux que l’on charge.
Meka dit enfin « Amen ». Il se leva, s’enveloppa de son pagne puis alla ouvrir la porte.
— Pour ce que tu vas faire tout à l’heure, lui dit sa femme, tu devras aller un peu plus loin. Ça sent déjà jusqu’ici...
Meka se dirigea derrière la case. Il contourna un tas d’immondices puis pénétra dans un buisson, et s’accroupit. A proximité, une truie attendait impatiemment qu’il eût fini.
Meka se tournait et se retournait devant sa femme. Il boutonna sa veste kaki et remua délicatement les épaules. Il se dirigea vers le piquet central de la case sur lequel était planté de biais un énorme clou rouillé qui tenait lieu de porte- chapeaux. Il en décrocha gravement son vieux casque de liège noirci par la fumée et qui pendait par sa jugulaire rapiécée. Des cancrelats et un jeune scolopendre s’en échappèrent et coururent jusqu’à Kelara qui les broya avec ses talons en cul de pioche, Meka contempla l’intérieur de son casque, le tapota, le contempla encore puis s’en coiffa. Il paracheva son élégance en glissant la jugulaire sous le menton.
— Tu es très bien, dit sa femme, on dirait un pasteur américain.
Meka lui sourit et s’assit sur une vieille caisse à sardines.
— Apporte-moi à manger, dit-il. On ne se présente pas devant un Blanc le ventre vide.
Sa femme lui apporta le plat de manioc de la veille et une pâte d’arachides. Quand le plat fut vide, Meka but un grand gobelet d’eau et se leva.
— Fais attention, lui recommanda sa femme. Ne va pas montrer ta susceptibilité devant le Blanc. Pour une fois, aie un peu pitié de moi. Ne réponds pas aux gardes, tu sais bien qu’ils n’hésitent pas à brimer un homme mûr et respectable comme toi...
— Je garderai la bouche fermée, promit Meka. Seulement si je ne rentre pas, va le dire au prêtre... pour qu’il arrange cela, il me doit bien ça...
Meka sortit de la case. Sa femme, assise à côté de la porte, le suivit des yeux jusqu’à ce que sa silhouette ne fut plus qu’un point blanc à l’autre bout du village.""",
    source_support="Ferdinand Oyono, Le vieux nègre et la médaille, Première "
                   "partie, chapitre I — les premières pages du roman. Édition "
                   "10/18, 1956.",

    questions=[
        ("I. Compréhension du texte (4 points)", [
            "**1.** Qu'est-ce qui empêche Meka de dormir ? Où se trouve "
            "l'objet qui l'inquiète, et que nous apprend cette cachette ? "
            "**(2 pts)**",
            "**2.** Relevez les recommandations que Kelara fait à son mari "
            "avant son départ. Que redoute-t-elle ? **(2 pts)**",
        ]),
        ("II. Étude de la langue et des outils d'analyse (8 points)", [
            "**3.** « le premier rayon de soleil qui lui tombait "
            "habituellement dans la narine gauche, en s'infiltrant par l'un "
            "des trous du toit de raphia pourri et criblé de ciel ». "
            "a) Relevez ce qui, dans cette phrase, dit la pauvreté sans "
            "employer le mot. b) Comment appelle-t-on l'expression « criblé "
            "de ciel » ? c) Que gagne le roman à décrire la misère par le "
            "trajet d'un rayon de soleil ? **(2 pts)**",
            "**4.** « le panier de pierres qu'il sentait sur ses omoplates "
            "comme au lendemain d'une cuite ». a) Nommez le procédé. "
            "b) Quels sont le comparé et le comparant ? c) Le comparant "
            "appartient-il au monde de Meka ou à celui du narrateur ? "
            "Justifiez. **(2 pts)**",
            "**5.** Étudiez la comparaison « O femme aussi faible que les "
            "apôtres du Seigneur sur le mont des Oliviers ! » a) D'où "
            "vient-elle ? b) Qui la prononce ? c) Qu'apprend-elle sur ce "
            "personnage, et sur ce que la mission a fait de lui ? "
            "**(2 pts)**",
            "**6.** « On ne se présente pas devant un Blanc le ventre "
            "vide. » a) Qui parle, et à qui ? b) Cette phrase est-elle "
            "présentée comme une opinion de Meka ou comme une règle "
            "générale ? c) Que révèle cette formulation sur le rapport aux "
            "Blancs dans le village ? **(2 pts)**",
        ]),
        ("III. Production écrite (8 points)", [
            "**7.** Rédigez entièrement l'introduction et le premier centre "
            "d'intérêt du commentaire composé de ce passage. Le centre "
            "d'intérêt comportera deux sous-centres, chacun appuyé sur au "
            "moins deux citations analysées. On attend environ trois cents "
            "mots. Les intertitres ne doivent pas figurer sur la copie.",
        ]),
    ],
)


DEVOIR2_CORRIGE = dict(
    titre="Devoir n° 2 — Corrigé et grille d'évaluation",
    cloture=obc.CLOTURE_CC,
    reponses=[
        ("1. La convocation (2 pts)",
         "C'est « la convocation du commandant », que Meka a rangée « sous "
         "le lit, dans une savate ». Le candidat reçoit 2 pts s'il cite la "
         "cachette et en tire une conclusion : le papier est à la fois "
         "précieux — on le garde — et redoutable — on le dissimule. On "
         "valorisera celui qui note qu'un objet administratif est rangé dans "
         "un objet domestique : deux mondes se touchent dès la première "
         "page."),
        ("2. Les recommandations de Kelara (2 pts)",
         "« Ne va pas montrer ta susceptibilité devant le Blanc », « aie un "
         "peu pitié de moi », « Ne réponds pas ». Elle redoute que son mari "
         "ne réponde et ne s'attire des ennuis. Le candidat reçoit 2 pts "
         "s'il relève au moins deux consignes et nomme la crainte ; 1 pt "
         "s'il se contente de citer."),
        ("3. La pauvreté dite par un rayon de soleil (2 pts)",
         "a) « toit de raphia pourri », « l'un des trous ». b) « Criblé de "
         "ciel » est une **métaphore** : les trous du toit sont dits par ce "
         "qu'ils laissent voir. On acceptera « image » si l'analyse suit. "
         "c) 2 pts si le candidat explique que la misère n'est pas décrite "
         "mais **déduite** : le lecteur la reconstitue à partir du trajet "
         "d'un rayon, ce qui l'oblige à regarder au lieu de recevoir un "
         "jugement tout fait."),
        ("4. La comparaison du panier de pierres (2 pts)",
         "a) Une **comparaison** (outil : « comme »). b) Comparé : la "
         "sensation dans les omoplates ; comparant : « le lendemain d'une "
         "cuite ». c) 2 pts si le candidat voit que le comparant appartient "
         "à l'expérience de Meka, non à celle du narrateur : le récit épouse "
         "la façon dont le personnage se représente son propre corps. C'est "
         "un premier indice du **point de vue interne**."),
        ("5. Les apôtres au mont des Oliviers (2 pts)",
         "a) De l'Évangile — les apôtres qui s'endorment pendant l'agonie du "
         "Christ. b) Meka lui-même. c) 2 pts si le candidat conclut que la "
         "culture chrétienne est devenue la langue ordinaire de ce "
         "personnage : il ne cite pas la Bible pour faire savant, il "
         "l'emploie pour gronder sa femme. On valorisera celui qui rapproche "
         "ce détail du fait que Meka a « donné » ses terres aux "
         "missionnaires."),
        ("6. « On ne se présente pas devant un Blanc le ventre vide » (2 pts)",
         "a) Meka, à sa femme. b) Le pronom « on » et le présent de vérité "
         "générale en font une **règle**, non une préférence personnelle. "
         "c) 2 pts si le candidat montre que la rencontre avec un Blanc est "
         "vécue comme une épreuve qui se prépare, avec ses rites — la "
         "toilette, la veste kaki, le repas. La convocation n'est pas un "
         "rendez-vous : c'est une comparution."),
        ("7. Production écrite — attentes (8 pts)", None),
        ("Éléments attendus dans l'introduction",
         "Situation (Ferdinand Oyono, *Le vieux nègre et la médaille*, 1956 ; "
         "les premières pages du roman, avant toute annonce de médaille), "
         "présentation du passage, problématique formulée en question, "
         "annonce du centre d'intérêt. Aucune analyse ne doit figurer dans "
         "l'introduction."),
        ("Centres d'intérêt acceptables", None),
        ("Proposition A", "« Un portrait par les objets » — le toit criblé, "
         "la savate, la caisse à sardines, la veste kaki : Meka est décrit "
         "par ce qui l'entoure avant de l'être par ce qu'il pense."),
        ("Proposition B", "« Une convocation vécue comme une comparution » — "
         "la nuit sans sommeil, les rites de préparation, les "
         "recommandations de Kelara, la phrase « si je ne rentre pas »."),
        ("Proposition C", "« Le comique et ce qu'il cache » — la prière, la "
         "truie, le « pasteur américain » : on rit, et le rire dit une "
         "dépendance."),
        ("Grille d'évaluation — production écrite", None),
    ],
    grille_prod=[
        ["Critère", "Indicateurs", "Points"],
        ["Introduction",
         "Le candidat reçoit 2 pts : si l'introduction comporte les trois "
         "étapes — situation du passage dans l'œuvre, problématique formulée "
         "en question, annonce du centre d'intérêt. 1 pt : si une étape "
         "manque. 0 pt : si l'introduction se réduit à une présentation de "
         "l'auteur.", "2"],
        ["Construction du centre d'intérêt",
         "Le candidat reçoit 3 pts : si le centre d'intérêt comporte deux "
         "sous-centres distincts, chacun ouvert par une idée directrice et "
         "fermé par une transition partielle. 2 pts : si les sous-centres "
         "existent sans idée directrice. 1 pt : si le devoir suit l'ordre du "
         "texte sans organisation.", "3"],
        ["Citations et outils d'analyse",
         "Le candidat reçoit 2 pts : si chaque sous-centre s'appuie sur au "
         "moins deux citations exactes, chacune suivie du nom de l'outil "
         "d'analyse et de son effet. 1 pt : si les citations sont présentes "
         "mais non analysées. 0 pt : si le devoir ne cite pas.", "2"],
        ["Langue et présentation",
         "Le candidat reçoit 1 pt : si la syntaxe est correcte, les "
         "citations exactes, et la copie lisible. 0 pt : si les fautes "
         "gênent la lecture.", "1"],
        ["**Total**", "", "**8**"],
    ],
)


ENCADRES_DEVOIRS = [
    (
        'methode',
        'Réussir la contraction de texte — la procédure MINESEC',
        [
            "- **Compter avant de rédiger.** Relevez le nombre de mots du texte source, divisez par quatre, notez la fourchette autorisée (± 10 %). Un résumé hors fourchette est pénalisé au critère C3 même s'il est excellent.",
            "- **Un paragraphe source = une phrase de résumé.** C'est la règle de sûreté : elle garantit que l'enchaînement des idées est respecté et qu'aucune étape n'est omise.",
            "- **Reformuler, ne pas recopier.** Cherchez systématiquement le mot abstrait qui remplace l'exemple. « une décoration n'est pas un morceau de métal mais une parole publique » → « reconnaissance symbolique ».",
            "- **Conserver le système d'énonciation.** Si l'auteur dit « nous », le résumé dit « nous ». On ne passe jamais à « l'auteur pense que… » : c'est une faute de méthode sanctionnée.",
            '- **Indiquer le nombre de mots** en fin de contraction. Son absence coûte des points.',
        ],
    ),
    (
        'methode',
        "L'introduction du commentaire composé — trois étapes, jamais deux",
        [
            'Une introduction incomplète plafonne la note au critère « Organisation ». Elle comporte obligatoirement :',
            "- **La situation** — auteur, œuvre, date, et surtout place du passage dans l'œuvre. Écrivez « l'extrait se situe immédiatement après la remise de la médaille », non « ce texte est de Ferdinand Oyono ».",
            "- **La problématique** — une question, ou une formulation qui en tient lieu : « on se demandera par quels moyens… ». Sans elle, le devoir n'est qu'une description.",
            "- **L'annonce du plan** — les axes dans l'ordre où ils seront traités, sans les numéroter lourdement.",
            "**À proscrire** : commencer par « De tout temps, les hommes ont… ». Cette entrée en matière ne situe rien et signale au correcteur que le texte n'a pas été travaillé.",
        ],
    ),
    (
        'vigilance',
        'Ce qui fait perdre le plus de points, chaque année',
        [
            "- **La paraphrase.** Raconter le texte au lieu de l'analyser. Le remède : après chaque phrase écrite, vérifiez qu'elle contient un nom de procédé (comparaison, discours indirect libre, gradation, incise…). Si elle n'en contient aucun, vous racontez.",
            '- **Le plan fond / forme.** Séparer « les idées » et « le style » est artificiel et explicitement déconseillé : la forme sert le sens, elle ne se traite pas à part.',
            "- **Les citations non intégrées.** Une citation doit s'insérer grammaticalement dans votre phrase. Écrivez : le narrateur note que Meka « mentit » — non : « mentit Meka » montre que Meka ment.",
            '- **La confusion narrateur / auteur.** Écrivez « le narrateur », « le texte », « le roman ». Réservez « Oyono » aux affirmations que vous pouvez fonder sur autre chose que le récit lui-même.',
            "- **L'ouverture inventée.** Une œuvre citée de mémoire et mal attribuée coûte plus cher qu'une conclusion sans ouverture.",
        ],
    ),
]

TEXTE_CONTRACTION = """Nous avons pris l'habitude de juger sévèrement ceux qui, sous la colonisation, ont accepté les honneurs de l'administration. Le mot de collaboration vient vite, et avec lui le confort de la condamnation rétrospective. Il faudrait pourtant se demander ce que nous aurions fait à leur place, et surtout ce que ces honneurs signifiaient réellement pour ceux qui les recevaient.

Une décoration n'est pas d'abord un morceau de métal. C'est une phrase que le pouvoir prononce sur un homme devant sa communauté rassemblée. Elle dit : celui-ci compte. Pour un paysan dont les terres ont été prises et les fils enterrés au loin, cette phrase-là n'est pas rien. Elle propose une réparation symbolique là où aucune réparation réelle n'est envisageable. Accepter la médaille, ce n'est pas nécessairement se soumettre ; c'est parfois tenter de récupérer, dans le langage de l'occupant, une reconnaissance que sa propre société ne peut plus garantir puisqu'elle a été désorganisée.

Le piège, évidemment, tient à ce que cette reconnaissance est révocable. Elle ne repose sur aucun droit, seulement sur la faveur. L'homme décoré le matin peut être arrêté le soir sans que personne y trouve à redire, car rien, dans le geste qui l'a honoré, ne l'a rendu titulaire de quoi que ce soit. Il a reçu un signe, non un statut. Et c'est précisément là que réside la violence du système : il distribue des marques d'estime tout en refusant les garanties qui donneraient à ces marques une consistance.

On comprend alors pourquoi le ridicule s'attache si souvent aux décorés coloniaux dans la littérature africaine. Ce ridicule n'est pas une méchanceté d'écrivain. Il enregistre un fait : celui qui croit avoir obtenu une place découvre qu'il n'a obtenu qu'un ornement, et cette découverte est d'autant plus cruelle qu'elle est publique. L'homme est humilié deux fois, une fois par le pouvoir qui le lâche, une fois par les siens qui l'ont vu y croire.

Faut-il en conclure qu'il aurait mieux valu refuser ? La question est plus difficile qu'elle n'en a l'air. Refuser suppose qu'on dispose d'un ailleurs — une autre société, un autre système de reconnaissance, encore vivant et capable de vous tenir lieu de monde. Or c'est exactement ce que la colonisation avait entrepris de démonter. Elle n'a pas seulement pris des terres et des vies : elle a rendu inopérants les mécanismes par lesquels une communauté disait à ses membres qu'ils valaient quelque chose. En détruisant cet ailleurs, elle a fabriqué la dépendance qu'elle reprochait ensuite à ses obligés.

Le jugement moral, ici, doit donc céder le pas à l'analyse. Ceux qui ont accepté n'étaient ni des traîtres ni des naïfs : ils étaient des hommes placés dans une situation où toutes les issues avaient été bouchées, sauf une, et qui ne menait nulle part. Les écrivains l'ont mieux compris que les moralistes, parce qu'ils ont dû, pour écrire, entrer dans la tête de leurs personnages plutôt que les regarder de loin."""
