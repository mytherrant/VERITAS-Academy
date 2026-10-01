# -*- coding: utf-8 -*-
"""
Devoirs conformes au format MINESEC — « Au cœur des ténèbres », Joseph Conrad.

Le support de contraction du sujet I est un texte original rédigé pour ce
cahier ; il n'est attribué à aucun auteur.
"""

TEXTE_CONTRACTION = """Une œuvre littéraire vieillit de deux manières. Elle peut cesser d'être lue, et c'est le sort ordinaire ; elle peut aussi continuer d'être lue, mais cesser d'être lue comme elle l'était. Le second cas est plus intéressant, car il oblige à distinguer ce qu'une œuvre dit et ce qu'une époque y entend.

Prenons les récits écrits par des Européens à l'époque coloniale. Beaucoup se voulaient critiques, et certains l'étaient réellement : ils décrivaient des chantiers absurdes, des travailleurs abandonnés, des discours civilisateurs contredits par les actes. Leurs auteurs se croyaient, et étaient parfois, en avance sur leur temps. Cela ne les a pas empêchés de reproduire, dans la forme même de leurs livres, ce qu'ils dénonçaient sur le fond.

Car un récit ne se réduit pas à ses affirmations. Il distribue aussi la parole, et cette distribution est un acte. Un livre peut accuser une entreprise coloniale avec vigueur et ne donner aucune réplique à ceux qu'elle écrase ; les décrire longuement et ne jamais les faire parler ; s'indigner de leur sort et les laisser sans nom. Le lecteur d'alors ne le remarquait pas, parce que cette distribution lui paraissait naturelle. Le lecteur d'aujourd'hui le remarque aussitôt, parce qu'elle ne l'est plus.

Faut-il alors retirer ces livres des programmes ? La tentation existe, et l'argument n'est pas ridicule : on n'est pas tenu d'enseigner des œuvres qui traitent une partie de leurs lecteurs en décor. Mais la solution est courte. Elle prive les élèves d'une occasion rare : celle d'observer, sur un texte précis, comment une critique sincère peut cohabiter avec un aveuglement complet.

Il y a plus. Reprocher à une œuvre son silence suppose qu'on l'ait lue attentivement, et c'est déjà un exercice de lecture supérieur à l'admiration. L'élève qui démontre, citations à l'appui, qu'un roman ne fait jamais parler ceux dont il raconte la mort, a fait un travail littéraire plus exigeant que celui qui récite l'éloge du chef-d'œuvre.

Enseigner ces textes ne revient donc pas à les approuver. Cela revient à les traiter comme ce qu'ils sont : des documents sur ce qu'une époque pouvait voir, et sur ce qu'elle ne pouvait pas encore. C'est aussi la meilleure façon de préparer les élèves à repérer, dans les livres de leur propre temps, les silences que nous ne remarquons pas encore."""

DEVOIR1 = dict(
    titre="Devoir n° 1 — Épreuve blanche de type BAC",
    entete=[
        ["Examen", "Baccalauréat blanc — Centre VÉRITAS"],
        ["Épreuve", "Français"],
        ["Séries", "A (coefficient 3) — C, D, E (coefficient 2)"],
        ["Durée", "4 heures"],
        ["Consigne générale", "Le candidat traite **un seul** des trois sujets proposés."],
    ],
    consigne_generale="L'usage du dictionnaire n'est pas autorisé. La qualité de l'expression "
                      "et la présentation de la copie entrent dans l'appréciation. Le "
                      "candidat indiquera clairement en tête de copie le numéro du sujet "
                      "choisi.",
    sujets=[
        dict(
            num="Sujet I — Contraction de texte et discussion",
            bareme="Contraction : 10 points — Discussion : 10 points",
            support=TEXTE_CONTRACTION,
            source_support="Texte rédigé pour le présent cahier (environ 480 mots). Aucun "
                           "auteur n'est cité : ce support est original.",
            consignes=[
                "**1. Contraction (10 points).** Résumez ce texte au quart de sa longueur, "
                "soit environ 120 mots (marge de ± 10 % admise). Vous indiquerez le nombre "
                "de mots employés et respecterez l'enchaînement des idées.",
                "**2. Discussion (10 points).** « Enseigner ces textes ne revient pas à les "
                "approuver. » Partagez-vous ce point de vue ? Vous répondrez en vous "
                "appuyant sur Au cœur des ténèbres et sur d'autres lectures.",
            ],
        ),
        dict(
            num="Sujet II — Dissertation littéraire",
            bareme="Compréhension / Pertinence : 6 — Organisation / Cohérence : 6 — Correction de l’expression : 6 — Originalité de la production : 2",
            support=None,
            source_support=None,
            consignes=[
                "Un critique écrit : « Ce qu'un récit refuse d'expliquer vaut souvent mieux "
                "que ce qu'il explique. »",
                "**Commentez et discutez ce jugement** en vous appuyant sur Au cœur des "
                "ténèbres de Joseph Conrad et sur d'autres œuvres de votre choix.",
            ],
        ),
        dict(
            num="Sujet III — Commentaire composé",
            bareme="Compréhension : 6 — Organisation des idées : 6 — Langue et style : 6 — Présentation de la copie : 2",
            support="""« Une rue étroite et déserte dans une ombre épaisse, de hautes maisons, d'innombrables fenêtres à jalousies, un silence mortel, de l'herbe qui poussait entre les pavés, d'imposantes portes cochères à droite et à gauche, d'immenses doubles portes à l'entrebâillement impressionnant. Je me suis glissé par une de ces fentes, j'ai monté un escalier nu et balayé, aride comme un désert, et j'ai ouvert la première porte rencontrée. Deux femmes, l'une grasse et l'autre mince, étaient assises sur des chaises paillées, et tricotaient de la laine noire. La mince se leva et marcha droit vers moi — tricotant toujours, les yeux baissés — et c'est seulement comme je pensais m'écarter de son chemin, comme on ferait pour une somnambule, qu'elle s'arrêta et leva la tête. Son vêtement était aussi neutre qu'un fourreau de parapluie. Elle fit demi-tour sans dire un mot et me précéda dans une salle d'attente. Je donnai mon nom, et je regardai autour de moi. Une table de bois blanc au milieu, des chaises de série tout autour des murs, à un bout une grande carte brillante, marquée de toutes les couleurs de l'arc-en-ciel. Il y avait une grande quantité de rouge — qui fait toujours plaisir à voir, parce qu'on sait qu'il se fait là un travail sérieux ; un sacré tas de bleu, un peu de vert, des taches d'orange, et sur la côte Est un morceau de violet pour montrer où les joyeux pionniers du progrès boivent la joyeuse bière blonde. Mais je n'allais ni ici ni là. J'allais dans le jaune. En plein centre. Et le fleuve était là — fascinant, mortel — comme un serpent. Pouah !
« Je commençais à me sentir mal à l'aise. Comme vous le savez, je ne suis pas habitué à ce genre de cérémonies, et il y avait comme une menace dans l'atmosphère. On aurait dit que j'avais été inclus dans quelque conspiration — comment dire — quelque chose de pas tout à fait régulier ; et j'étais content de sortir. Dans l'antichambre, les deux femmes tricotaient leur laine noire, fiévreusement. […] Je la voyais magicienne et fatale. Souvent une fois là-bas j'ai pensé à ces deux, gardant la porte des Ténèbres, tricotant leur laine noire comme pour un chaud catafalque, l'une introduisant sans cesse à l'inconnu, l'autre examinant les visages niaisement réjouis de son vieux regard indifférent. Ave ! Vieille tricoteuse de laine noire. Morituri te salutant. De ceux qu'elle dévisagea ils ne furent pas nombreux à jamais la revoir — pas la moitié, loin de là. »""",
            source_support="Joseph Conrad, Au cœur des ténèbres, chapitre I, traduction "
                           "française, édition numérique.",
            consignes=[
                "**Faites le commentaire composé de ce texte.** Vous pourrez étudier, entre "
                "autres, la transformation d'une formalité administrative en scène "
                "mythologique, et le rôle de l'ironie dans la critique du discours colonial.",
            ],
        ),
    ],
)

DEVOIR1_CORRIGE = dict(
    titre="Devoir n° 1 — Corrigé et grilles d'évaluation",
    intro="Corrigé présenté selon le modèle des corrigés nationaux : thème, thèse, "
          "structure, proposition, grille chiffrée. Indications rédigées à la troisième "
          "personne.",
    sujets=[
        dict(
            num="Corrigé du sujet I — Contraction et discussion",
            blocs=[
                ("Thème du texte",
                 "La lecture et l'enseignement, aujourd'hui, des œuvres écrites à l'époque "
                 "coloniale."),
                ("Thèse de l'auteur",
                 "Ces œuvres doivent être enseignées non parce qu'elles seraient "
                 "irréprochables, mais parce qu'elles permettent d'observer la coexistence "
                 "d'une critique sincère et d'un aveuglement de forme — exercice de lecture "
                 "plus exigeant que l'éloge, et qui prépare à repérer les silences de notre "
                 "propre époque."),
                ("Structure du texte, paragraphe par paragraphe", [
                    "**§ 1 — Distinction initiale.** Deux manières de vieillir : cesser "
                    "d'être lu, ou cesser d'être lu comme avant.",
                    "**§ 2 — Le cas des récits coloniaux.** Sincèrement critiques sur le "
                    "fond, ils reproduisaient dans leur forme ce qu'ils dénonçaient.",
                    "**§ 3 — L'argument central.** Un récit distribue la parole, et cette "
                    "distribution est un acte ; ce qui paraissait naturel hier saute aux "
                    "yeux aujourd'hui.",
                    "**§ 4 — L'objection.** Faut-il les retirer des programmes ? "
                    "L'argument n'est pas ridicule, mais la solution est courte.",
                    "**§ 5 — Le bénéfice pédagogique.** Démontrer un silence exige une "
                    "lecture plus fine que l'admiration.",
                    "**§ 6 — Conclusion.** Les traiter comme des documents sur ce qu'une "
                    "époque pouvait voir, et s'entraîner à repérer nos propres silences.",
                ]),
                ("Proposition de contraction (121 mots)",
                 "Une œuvre vieillit soit en cessant d'être lue, soit en cessant d'être lue "
                 "comme autrefois : ce second cas oblige à séparer ce qu'un livre dit de ce "
                 "qu'une époque y entend. Ainsi des récits coloniaux européens : sincèrement "
                 "critiques quant au fond, ils reconduisaient dans leur forme ce qu'ils "
                 "dénonçaient, car un texte distribue la parole, et peut décrire longuement "
                 "ceux qu'il ne fait jamais parler. Invisible hier, cette répartition frappe "
                 "aujourd'hui. Faut-il pour autant les écarter des programmes ? Ce serait "
                 "priver les élèves d'un cas rare, où lucidité et aveuglement coexistent ; "
                 "et démontrer un silence, preuves à l'appui, forme mieux qu'un éloge. "
                 "Les enseigner, c'est y voir des documents sur les limites d'une époque — "
                 "et apprendre à reconnaître les nôtres."),
                ("Éléments attendus dans la discussion", [
                    "**Explication.** Distinguer enseigner, approuver et recommander. "
                    "Le candidat qui manque cette distinction glisse vers un débat général "
                    "sur la censure.",
                    "**Arguments favorables.** L'étude d'Au cœur des ténèbres permet "
                    "d'observer conjointement une dénonciation précise (le bosquet, les "
                    "« formes légales de contrats temporaires ») et un silence complet des "
                    "personnages africains. Un même texte fournit donc la critique et son "
                    "objet.",
                    "**Arguments contraires.** Enseigner suppose une sélection, et toute "
                    "sélection est une forme de recommandation ; un élève peut recevoir "
                    "l'œuvre sans son appareil critique ; le temps consacré à ces textes "
                    "n'est pas consacré à d'autres. Exemple attendu : Le vieux nègre et la "
                    "médaille, qui traite le même sujet depuis l'intérieur.",
                    "**Dépassement.** L'alternative « enseigner ou écarter » est mal posée : "
                    "ce qui compte est le dispositif d'étude — un texte européen lu seul "
                    "n'a pas le même effet que le même texte confronté à une œuvre "
                    "africaine.",
                ]),
                ("Grille d'évaluation — Sujet I", None),
            ],
            grille=[
                ["Critère", "Indicateurs", "Points"],
                ["C1 — Compréhension / Pertinence",
                 "Le candidat reçoit 6 pts : si la contraction restitue la thèse et les six "
                 "étapes sans contresens, et si la discussion distingue enseigner et "
                 "approuver. 4 pts : une étape omise ou glissement vers un débat sur la "
                 "censure. 2 pts : paraphrase. 0 pt : hors sujet.",
                 "6"],
                ["C2 — Organisation / Cohérence",
                 "Le candidat reçoit 6 pts : ordre des idées respecté, discussion structurée "
                 "avec transitions. 4 pts : plan perceptible sans transitions. 2 pts : "
                 "juxtaposition.",
                 "6"],
                ["C3 — Expression / Correction de la langue",
                 "Le candidat reçoit 6 pts : reformulation personnelle, syntaxe correcte, "
                 "nombre de mots indiqué et respecté. 4 pts : phrases recopiées ou longueur "
                 "hors marge. 2 pts : fautes gênantes.",
                 "6"],
                ["C4 — Originalité de la production",
                 "Le candidat reçoit 2 pts : exemples précis et personnels, ou nuance non "
                 "prévue (par exemple la question du dispositif d'étude). 1 pt : exemples "
                 "attendus. 0 pt : aucun exemple.",
                 "2"],
                ["**Total**", "", "**20**"],
            ],
            cloture="NB — Tous les éléments pertinents non prévus dans cette grille que le "
                    "candidat aura ajoutés seront pris en compte. On restera ouvert à toute "
                    "autre interprétation pertinente.",
        ),
        dict(
            num="Corrigé du sujet II — Dissertation",
            blocs=[
                ("Analyse du sujet",
                 "La citation oppose ce qu'un récit explique et ce qu'il laisse "
                 "inexpliqué, et donne l'avantage au second. Le candidat doit comprendre "
                 "qu'il s'agit d'un choix de composition, non d'une négligence. Erreur à "
                 "éviter : conclure qu'un récit obscur vaut mieux qu'un récit clair."),
                ("Problématique attendue",
                 "Le silence d'un récit sur ce qu'il montre est-il une faiblesse à combler "
                 "ou un procédé qui transfère au lecteur le travail de comprendre ?"),
                ("Plan indicatif — trois parties", [
                    "**I. Le jugement se vérifie amplement chez Conrad.** « Horreur ! "
                    "Horreur ! » est isolé dans un paragraphe d'une ligne, sans glose ; les "
                    "six questions sur le fil blanc restent sans réponse ; les discours de "
                    "Kurtz ne sont presque jamais cités, seulement leurs effets. Chaque fois, "
                    "le lecteur est contraint de conclure lui-même.",
                    "**II. Mais tout silence n'est pas fécond.** Certains passages ne "
                    "suspendent rien : ils omettent. Les Africains du récit ne parlent "
                    "jamais, et cette absence n'est pas un procédé — c'est une limite du "
                    "point de vue. Le candidat distinguera le non-dit qui fait penser du "
                    "non-vu qui appauvrit.",
                    "**III. Le critère : à qui profite le silence ?** Un silence est fécond "
                    "quand il transfère au lecteur un travail qu'on ne peut pas faire à sa "
                    "place ; il est stérile quand il l'en dispense ou lui cache ce qu'il "
                    "faudrait savoir. Rapprochement possible avec le dénouement du Vieux "
                    "nègre et la médaille, où le rire collectif n'est jamais expliqué non "
                    "plus.",
                ]),
                ("Citations utiles au candidat", [
                    "« Horreur ! Horreur ! » (le mot non expliqué)",
                    "« Était-ce un insigne ? Un ornement ? Un grigris ? » (les six questions)",
                    "« Il m'a fait voir des choses — des choses. » (l'éloquence sans contenu)",
                    "« Cela aurait été trop ténébreux — absolument trop ténébreux. »",
                    "« semblait mener au cœur d'immenses ténèbres » (la fin non conclusive)",
                ]),
                ("Grille d'évaluation — Sujet II", None),
            ],
            grille=[
                ["Critère", "Indicateurs", "Points"],
                ["C1 — Compréhension / Pertinence",
                 "Le candidat reçoit 6 pts : s'il traite le silence comme un procédé de "
                 "composition et le discute avec des exemples précis. 4 pts : s'il traite "
                 "sans discuter. 2 pts : s'il raconte l'œuvre. 0 pt : s'il conclut que "
                 "l'obscurité est en soi une qualité.",
                 "6"],
                ["C2 — Organisation / Cohérence",
                 "Le candidat reçoit 6 pts : introduction complète, parties soutenant "
                 "chacune une thèse, transitions, conclusion répondant et ouvrant. 4 pts : "
                 "une étape manquante. 2 pts : exposé continu.",
                 "6"],
                ["C3 — Expression / Correction de la langue",
                 "Le candidat reçoit 6 pts : langue correcte, métalangage narratif exact "
                 "(récit enchâssé, point de vue, ironie, ellipse), citations intégrées. "
                 "4 pts : vocabulaire approximatif. 2 pts : fautes gênantes.",
                 "6"],
                ["C4 — Originalité de la production",
                 "Le candidat reçoit 2 pts : œuvre pertinente hors programme ou dépassement "
                 "argumenté. 1 pt : exemples scolaires exacts. 0 pt : aucun exemple "
                 "extérieur.",
                 "2"],
                ["**Total**", "", "**20**"],
            ],
            cloture="On restera ouvert à toute autre interprétation pertinente, notamment "
                    "aux devoirs qui contesteraient la citation au nom de la clarté due au "
                    "lecteur.",
        ),
        dict(
            num="Corrigé du sujet III — Commentaire composé",
            blocs=[
                ("Situation du texte",
                 "Chapitre I. Avant de partir pour l'Afrique, Marlow se rend au siège de la "
                 "Compagnie, dans une ville européenne qu'il ne nomme pas mais que le "
                 "lecteur identifie à Bruxelles. Le passage est le seuil du voyage."),
                ("Axes attendus — au moins deux des trois suivants", [
                    "**Axe 1 — Un décor de mort.** L'accumulation nominale sans verbe ; "
                    "l'herbe entre les pavés, le « silence mortel », l'escalier « aride "
                    "comme un désert » ; le « sépulcre blanchi » évoqué juste avant "
                    "l'extrait.",
                    "**Axe 2 — L'ironie contre le discours colonial.** « un travail "
                    "sérieux » pour la conquête ; « les joyeux pionniers du progrès boivent "
                    "la joyeuse bière blonde » ; le serpent « fascinant, mortel ». On "
                    "notera que l'ironie n'épargne pas Marlow lui-même, satisfait du rouge "
                    "britannique.",
                    "**Axe 3 — Le passage du bureau au mythe.** La laine noire répétée trois "
                    "fois ; « gardant la porte des Ténèbres » ; le « chaud catafalque » ; "
                    "la citation latine des gladiateurs adressée à une employée.",
                ]),
                ("Procédés que le candidat doit impérativement exploiter", [
                    "La phrase nominale et l'accumulation",
                    "L'ironie verbale (écart entre le mot et la chose)",
                    "L'allusion biblique, mythologique et historique",
                    "La comparaison (« comme un serpent », « aussi neutre qu'un fourreau de "
                    "parapluie »)",
                    "Le contraste entre le trivial (le chat, la chaufferette) et le solennel",
                ]),
                ("Erreurs fréquentes à sanctionner", [
                    "Relever une allusion sans en expliquer le sens d'origine ni mesurer "
                    "l'écart — critère C1.",
                    "Attribuer l'ironie à Conrad plutôt qu'à Marlow, ou l'inverse, sans "
                    "précaution — critère C1.",
                    "Traiter la description du bureau comme un simple décor réaliste — "
                    "critère C1.",
                    "Le plan « fond / forme » — critère C2.",
                ]),
                ("Grille d'évaluation — Sujet III", None),
            ],
            grille=[
                ["Critère", "Indicateurs", "Points"],
                ["C1 — Compréhension / Pertinence",
                 "Le candidat reçoit 6 pts : s'il dégage au moins deux axes et les démontre "
                 "par des procédés nommés et analysés, en traitant complètement au moins "
                 "une allusion. 4 pts : axes justes mais peu étayés. 2 pts : paraphrase. "
                 "0 pt : contresens sur le ton du passage.",
                 "6"],
                ["C2 — Organisation / Cohérence",
                 "Le candidat reçoit 6 pts : introduction en trois étapes, axes composés, "
                 "transitions, conclusion avec ouverture. 4 pts : plan correct sans "
                 "transitions. 2 pts : commentaire linéaire.",
                 "6"],
                ["C3 — Expression / Correction de la langue",
                 "Le candidat reçoit 6 pts : langue correcte, métalangage exact. 4 pts : "
                 "vocabulaire approximatif. 2 pts : fautes gênantes.",
                 "6"],
                ["C4 — Originalité de la production",
                 "Le candidat reçoit 2 pts : procédé non prévu au corrigé exploité "
                 "pertinemment, ou rapprochement éclairant avec le bosquet de la mort. "
                 "1 pt : analyse exacte mais attendue.",
                 "2"],
                ["**Total**", "", "**20**"],
            ],
            cloture="On insistera tout particulièrement sur l'exploitation par le candidat "
                    "des procédés de style, les éléments du vocabulaire, la syntaxe, etc., "
                    "dans ses démonstrations et autres illustrations. On restera également "
                    "ouvert à toute autre interprétation pertinente du texte par le "
                    "candidat.",
        ),
    ],
)

DEVOIR2 = dict(
    titre="Devoir n° 2 — Devoir surveillé de contrôle (2 heures)",
    entete=[
        ["Nature", "Devoir de contrôle en cours d'étude de l'œuvre"],
        ["Classe", "Première / Terminale — toutes séries"],
        ["Durée", "2 heures"],
        ["Support", "Extrait du chapitre I — le bosquet de la mort"],
        ["Barème", "Questions : 12 points — Production écrite : 8 points"],
    ],
    consigne_generale="Ce devoir se place après l'étude des fiches 1 à 3. Il vérifie la "
                      "maîtrise des outils d'analyse du récit — point de vue, euphémisme, "
                      "composition — avant l'épreuve longue.",
    support="""« À la fin j'arrivai sous les arbres. Mon idée était de marcher quelques instants à l'ombre ; mais je ne m'y trouvai pas plus tôt que je crus être entré dans le sombre cercle de quelque Enfer. Les rapides étaient proches et le bruit d'un flot ininterrompu, uniforme, précipité, emplissait l'immobilité lugubre du bosquet, où pas un souffle ne bougeait, pas une feuille ne s'agitait, d'un bruit mystérieux — comme si le mouvement furieux de la terre lancée était tout à coup devenu perceptible.
« Des formes noires étaient accroupies, prostrées, assises entre les arbres, appuyées aux troncs, cramponnées au sol, à demi surgissantes, à demi estompées dans l'obscure lumière, dans toutes les attitudes de la douleur, de l'abandon, du désespoir. Une autre mine explosa sur la falaise, suivie d'un léger frémissement du sol sous mes pieds. Le travail continuait. Le travail ! Et c'était ici le lieu où quelques-uns des auxiliaires s'étaient retirés pour mourir.
« Ils mouraient lentement — c'était bien clair. Ce n'étaient pas des ennemis, pas des criminels, ce n'était rien de terrestre maintenant — rien que des ombres noires de maladie et de famine, gisant confusément dans la pénombre verdâtre. Amenés de tous les recoins de la côte dans toutes les formes légales de contrats temporaires, perdus dans un milieu hostile, nourris d'aliments inconnus, ils tombaient malades, devenaient inutiles, et on leur permettait alors de se traîner à l'écart et de se reposer. Ces formes moribondes étaient libres comme l'air, et presque autant insubstantielles… Je commençai à distinguer la lueur des yeux sous les arbres. Puis abaissant mon regard je vis un visage près de ma main. La sombre ossature reposait tout de son long, une épaule contre l'arbre, et lentement les paupières se soulevèrent et les yeux creux se levèrent sur moi, énormes et vides, avec une espèce d'étincelle aveugle et blanche dans la profondeur des orbites, qui s'éteignit lentement. »""",
    source_support="Joseph Conrad, Au cœur des ténèbres, chapitre I, traduction française, "
                   "édition numérique.",
    questions=[
        ("I. Compréhension du texte (4 points)", [
            "**1.** Situez ce passage : où se trouve Marlow, que cherchait-il en entrant "
            "sous les arbres, et que découvre-t-il ? **(2 pts)**",
            "**2.** Qui sont les hommes du bosquet, et pour quelle raison se trouvent-ils "
            "là ? Répondez en citant le texte. **(2 pts)**",
        ]),
        ("II. Étude de la langue et des procédés (8 points)", [
            "**3.** Relevez les sept participes qui décrivent la position des corps. "
            "Que remarquez-vous sur les deux derniers ? Que traduit cette accumulation ? "
            "**(2 pts)**",
            "**4.** « ils tombaient malades, devenaient inutiles, et on leur permettait "
            "alors de se traîner à l'écart et de se reposer. » a) Relevez deux euphémismes. "
            "b) Quel effet produit l'emploi du verbe « permettre » ? **(2 pts)**",
            "**5.** « Ce n'étaient pas des ennemis, pas des criminels, ce n'était rien de "
            "terrestre maintenant. » a) Quelle construction est employée trois fois ? "
            "b) Quelle est la valeur de l'adverbe « maintenant » ? **(2 pts)**",
            "**6.** Étudiez la composition du passage : sur quels éléments le regard "
            "s'arrête-t-il successivement, du début à la fin ? Que produit ce mouvement ? "
            "**(2 pts)**",
        ]),
        ("III. Production écrite (8 points)", [
            "**7.** Rédigez entièrement l'introduction et le premier axe du commentaire "
            "composé de ce texte. L'axe comportera au minimum trois citations, chacune "
            "suivie de son analyse. Vous ne rédigerez ni le deuxième axe ni la conclusion. "
            "**(8 pts)**",
        ]),
    ],
)

DEVOIR2_CORRIGE = dict(
    titre="Devoir n° 2 — Corrigé et barème détaillé",
    reponses=[
        ("1. Situation du passage (2 pts)",
         "Le candidat reçoit 2 pts s'il indique : (a) Marlow vient de débarquer au premier "
         "poste de la Compagnie, sur le bas du fleuve ; (b) il entre sous les arbres pour "
         "chercher un peu d'ombre ; (c) il y découvre des travailleurs africains qui "
         "agonisent. 1 pt pour deux éléments seulement. On valorisera le candidat qui note "
         "l'écart entre l'intention (« marcher quelques instants à l'ombre ») et la "
         "découverte."),
        ("2. Les hommes du bosquet (2 pts)",
         "Ce sont des travailleurs recrutés sur toute la côte pour le chantier de la "
         "Compagnie, devenus inaptes et abandonnés. Citation attendue : « Amenés de tous "
         "les recoins de la côte dans toutes les formes légales de contrats temporaires, "
         "perdus dans un milieu hostile, nourris d'aliments inconnus, ils tombaient "
         "malades, devenaient inutiles. » On accordera la totalité des points au candidat "
         "qui souligne l'adjectif « légales » : rien de ce qui a conduit ces hommes là "
         "n'était illégal, et c'est ce qui rend l'accusation redoutable."),
        ("3. Les sept participes (2 pts)",
         "Relevé attendu : accroupies, prostrées, assises, appuyées, cramponnées, "
         "surgissantes, estompées. 1 pt pour un relevé complet ou quasi complet. Les deux "
         "derniers sont contradictoires (« à demi surgissantes, à demi estompées ») : le "
         "regard ne parvient pas à fixer ces corps. L'accumulation, sans coordination, "
         "traduit à la fois l'entassement des hommes et l'échec de la perception. 1 pt pour "
         "l'interprétation."),
        ("4. Les euphémismes (2 pts)",
         "Deux au choix parmi : « devenaient inutiles » (pour mouraient ou devenaient "
         "invalides), « se traîner à l'écart » (pour être abandonnés), « se reposer » (pour "
         "agoniser). Le verbe « permettre » appartient au vocabulaire de la faveur : "
         "l'abandon est présenté comme une autorisation bienveillante. Conrad emprunte ici "
         "la langue de l'administration coloniale et la laisse se retourner contre "
         "elle-même. 1 pt pour le relevé, 1 pt pour l'analyse du verbe."),
        ("5. La triple négation (2 pts)",
         "a) La construction négative « ce n'étaient pas / ce n'était rien », employée "
         "trois fois : procédé d'élimination des catégories disponibles (ennemis, criminels, "
         "êtres terrestres). Ces hommes n'entrent dans aucune. b) L'adverbe « maintenant », "
         "placé en fin de proposition, date cette sortie de l'humanité : elle n'est pas un "
         "état de nature mais le résultat d'un processus. On valorisera le candidat qui "
         "l'exprime en ces termes."),
        ("6. La composition (2 pts)",
         "Le regard va du plus vaste au plus intime : le bosquet et son bruit, puis "
         "l'ensemble des corps (« des formes noires »), puis « la lueur des yeux sous les "
         "arbres », puis « un visage près de ma main », puis les paupières et les orbites. "
         "Le mouvement est celui d'un resserrement continu, comparable à un travelling. "
         "Effet : le collectif anonyme se change en individu singulier, et le lecteur, "
         "d'abord tenu à distance, se retrouve à la distance d'une main. 1 pt pour le "
         "relevé des étapes, 1 pt pour l'effet."),
        ("7. Production écrite (8 pts)", None),
    ],
    grille_prod=[
        ["Critère", "Indicateurs", "Points"],
        ["Introduction",
         "Le candidat reçoit 2 pts : si l'introduction comporte les trois étapes — situation "
         "du passage dans l'œuvre, problématique, annonce de l'axe. 1 pt : si une étape "
         "manque. 0 pt : si elle se réduit à une présentation de l'auteur.",
         "2"],
        ["Pertinence de l'axe",
         "Le candidat reçoit 2 pts : si l'axe est formulé comme une thèse. 1 pt : si l'axe "
         "se réduit à un intitulé thématique du type « la souffrance des travailleurs ».",
         "2"],
        ["Analyse des citations",
         "Le candidat reçoit 3 pts : si trois citations au moins sont intégrées, suivies "
         "d'un procédé nommé et d'une interprétation. 2 pts : si l'une n'est pas analysée. "
         "1 pt : citations juxtaposées.",
         "3"],
        ["Langue",
         "Le candidat reçoit 1 pt : si la syntaxe est correcte et la ponctuation des "
         "citations respectée.",
         "1"],
        ["**Total**", "", "**8**"],
    ],
    cloture="On restera ouvert à toute autre interprétation pertinente. Les axes non prévus "
            "au corrigé mais correctement démontrés seront pleinement crédités.",
)

ENCADRES_DEVOIRS = [
    ("methode", "Traiter une œuvre traduite", [
        "Au cœur des ténèbres a été écrit en anglais. Trois conséquences pour vos devoirs :",
        "- **Prudence sur les sonorités.** Allitérations, assonances, rythme de la phrase "
        "appartiennent au traducteur autant qu'à l'auteur. Évitez de bâtir un axe entier "
        "sur eux.",
        "- **Pleine validité de tout le reste.** Composition, point de vue, images, "
        "structure des phrases longues, choix des comparants, ironie : tout cela résiste à "
        "la traduction et constitue la matière ordinaire du commentaire.",
        "- **Citer l'édition.** Indiquez que vous travaillez sur une traduction. Une copie "
        "qui le précise montre une conscience méthodologique que les correcteurs "
        "valorisent.",
    ]),
    ("vigilance", "Les trois voix, et le débat critique", [
        "- **Distinguer les trois niveaux d'énonciation.** Conrad (l'auteur), le narrateur "
        "anonyme (qui ouvre et ferme le livre), Marlow (qui raconte). Écrivez « Marlow "
        "affirme », « le narrateur note », et réservez « Conrad » à la composition.",
        "- **Connaître le débat sans le réciter.** Depuis Chinua Achebe (1975), on reproche "
        "au récit de ne jamais donner la parole aux Africains. L'objection est sérieuse et "
        "peut être discutée en devoir — à condition de la traiter comme une hypothèse "
        "confrontée au texte, non comme une opinion à répéter.",
        "- **Ne pas confondre ce que le livre montre et ce qu'il tait.** La dénonciation des "
        "violences y est réelle et précise ; le silence des personnages africains est une "
        "limite du point de vue choisi. Un bon devoir tient les deux ensemble.",
    ]),
]
