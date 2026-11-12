# -*- coding: utf-8 -*-
"""
Fiches 4 à 6 du cahier « Stances et Poèmes ».

Fiche 4  La Femme            Femmes
Fiche 5  Le Lever du soleil  Mélanges
Fiche 6  Je me croyais Poète Poèmes — dernière pièce du recueil

Comme pour les fiches 1 à 3, les poèmes viennent de `stances_extraits.py`
et sont reproduits entiers.
"""
import stances_extraits as X

SRC = X.SRC


def _src(cle):
    return SRC + X.REFERENCES[cle][2] + "."


# ══════════════════════════════════════════════════════════ FICHE 4 — LA FEMME
F4 = dict(
    titre="Fiche 4 — « La Femme »",
    repere=X.REPERES["P4"],
    extrait=X.P4,
    source=_src("P4"),
    disposition="vers",

    objectif="Étudier un poème qui raconte une origine, et apprendre à décrire "
             "avec exactitude le point de vue d'où un texte est écrit.",

    lexique=[
        ["épars", "dispersés, répandus de tous côtés."],
        ["étreindre", "serrer dans ses bras."],
        ["haleine", "souffle qui sort de la bouche."],
        ["féconde", "qui produit beaucoup ; fertile."],
        ["embaumé", "parfumé."],
        ["éclose", "ouverte, comme une fleur qui vient de s'ouvrir."],
        ["lustre", "éclat brillant d'une surface polie."],
        ["candeur", "pureté, innocence. Le mot vient du latin *candidus*, blanc."],
        ["nuées", "gros nuages."],
    ],

    situation="« La Femme » ouvre la section du même nom, la troisième du recueil, "
              "et lui donne son programme. Trente-six alexandrins à rimes plates, "
              "sans division en strophes : la forme du récit en vers, non celle de "
              "la stance. Le poème réécrit une scène d'origine — le premier homme "
              "seul devant le monde — et invente une explication de la femme : elle "
              "serait faite de tout ce que l'homme admirait sans pouvoir le "
              "posséder. C'est le poème du recueil qui demande le plus de précaution "
              "en classe : il faut le décrire avant de le juger, et le juger sans "
              "l'excuser.",

    mouvements=[
        "**Le manque (v. 1-16).** Le premier homme est seul. Il regarde la terre, "
        "en constate la richesse, et découvre qu'il ne peut rien y saisir. Sa "
        "plainte est rapportée au discours direct.",
        "**Le don (v. 17-19).** Trois vers de récit : la nature « Fit un bouquet "
        "vivant, de jeunesse embaumé ». C'est le seul moment où le poème raconte.",
        "**L'éloge (v. 20-36).** Le second discours direct, presque deux fois plus "
        "long que le premier : l'homme énumère ce dont la femme est faite.",
    ],

    axes=[
        ("Un poème d'origine : dire d'où vient ce qui existe", [
            "**Le premier vers pose un commencement absolu.** « Le premier homme est "
            "né, mais il est solitaire. » Le passé composé installe le fait, la "
            "conjonction « mais » installe aussitôt le manque. Tout le poème tient "
            "dans cette opposition d'un seul vers.",
            "**La forme choisie est celle du récit.** Alexandrins à rimes plates, "
            "pas de strophes : c'est le vers du théâtre classique et de la fable, "
            "celui qui permet de raconter longuement. Comparez avec les octosyllabes "
            "des fiches précédentes : la forme dit déjà qu'on change de registre.",
            "**Le poème répond à une question qu'il ne pose pas.** Pourquoi la femme "
            "existe-t-elle ? Réponse : parce que l'homme, seul, ne pouvait aimer "
            "aucune des beautés qu'il voyait. C'est ce qu'on appelle un récit "
            "**étiologique** — un récit qui explique une origine.",
            "**Le poème est un mythe, non une thèse.** Il ne prétend pas décrire le "
            "réel : il raconte. La distinction est importante pour le commentaire — "
            "on analyse une construction imaginaire, pas une affirmation "
            "scientifique.",
        ]),
        ("La femme faite de morceaux du monde", [
            "**L'éloge procède par emprunts.** Chaque trait de la femme vient d'une "
            "chose de la nature : la rose donne la bouche, les rayons du ciel les "
            "yeux, « l'or de la plaine et le lustre de l'onde » la chevelure, un lis "
            "le front, « le frémissement des feuilles » et « le caprice des flots » "
            "la caresse et le sourire.",
            "**L'anaphore du sujet « Il ».** « Dieu… Concentre », « Il fait », « Il "
            "forme », « Il forme », « Il choisit ». Cinq verbes de fabrication, tous "
            "au présent, tous avec le même sujet. La femme est présentée comme un "
            "assemblage, et le poème dit lui-même par qui.",
            "**Une image résume tout : « un bouquet vivant ».** Un bouquet est "
            "précisément un rassemblement de fleurs coupées ailleurs. L'expression "
            "est belle, et elle est exacte : elle avoue la méthode du poème.",
            "**Le vers de conclusion ferme le raisonnement.** « Et la terre n'a "
            "rien, ni l'onde, ni l'azur, / Qu'on ne possède en toi plus brillant et "
            "plus pur. » La femme est déclarée supérieure au monde parce qu'elle le "
            "résume. Le verbe employé est « posséder », et il faut s'y arrêter : "
            "c'est le mot du premier mouvement, celui du manque.",
        ]),
        ("D'où le poème est-il écrit ? — le point de vue et ses limites", [
            "**Toute la parole est masculine.** Deux discours directs, tous deux "
            "prononcés par l'homme ; aucune réplique de la femme. Elle est nommée, "
            "appelée — « Ô femme, viens à moi » —, décrite, mais elle ne parle "
            "jamais. C'est un fait de texte, vérifiable au relevé.",
            "**Elle est définie par ce qu'elle apporte à l'homme.** Le poème "
            "n'indique ni ce qu'elle pense, ni ce qu'elle veut, ni ce qu'elle "
            "éprouve. Elle apparaît à l'endroit exact d'un besoin — le vers 16 dit "
            "« Il cherche vaguement le bienfait du baiser », le vers 17 dit « Mais "
            "un jour ».",
            "**Le vocabulaire de la possession traverse le poème.** « étreindre », "
            "« saisir », « posséder » : trois verbes qui disent la même relation, du "
            "premier mouvement au dernier vers.",
            "**Ce qu'on peut en dire honnêtement.** Le poème donne à la femme la "
            "place la plus haute — au-dessus de la terre, de l'onde et de l'azur — "
            "et, dans le même mouvement, il ne lui donne pas la parole. Les deux "
            "observations sont vraies ensemble. Un commentaire réussi les tient "
            "toutes les deux, au lieu de choisir la plus commode.",
            "**Question ouverte, à débattre en classe.** Est-ce le poète qui pense "
            "ainsi, ou le personnage du premier homme ? Le texte permet les deux "
            "lectures : le poème ne commente pas le discours qu'il rapporte.",
        ]),
    ],

    forme=[
        "**Le mètre.** Alexandrins, vers de douze syllabes. Vérifiez sur le premier : "
        "« Le / pre / mier / hom / me est / né, ‖ mais / il / est / so / li / taire » "
        "— la césure tombe après « né », à la sixième syllabe. C'est la coupe "
        "classique, six plus six.",
        "**Les rimes sont plates** (AABB) : solitaire / terre, côtés / beautés, "
        "courent / entourent. C'est la disposition du récit et du théâtre en vers. "
        "Elle fait avancer, là où la rime embrassée referme.",
        "**Aucune strophe.** Le poème est d'un seul tenant, trente-six vers. Cette "
        "absence de blancs distingue « La Femme » de tous les autres poèmes étudiés "
        "dans ce cahier, et c'est le premier indice de son genre : un récit, non une "
        "stance.",
        "**Deux discours directs encadrent le récit.** Le premier fait huit vers, le "
        "second dix-sept. Ce déséquilibre est significatif : la plainte est brève, "
        "l'éloge est long. Faites compter les vers de chacun avant de commenter.",
        "**L'apostrophe centrale.** « Ô femme, viens à moi » : vocatif, impératif. "
        "Le vers 20 est le pivot du poème, et le seul où quelqu'un s'adresse "
        "directement à quelqu'un.",
        "**Une trouvaille de langue à relever.** « Il forme de ton front la paix et "
        "la splendeur / Avec un lis nouveau qu'il a nommé candeur. » Le poème "
        "fabrique une fleur inexistante pour lui donner le nom d'une qualité morale. "
        "L'abstraction devient une plante : c'est le procédé de tout l'éloge, "
        "condensé en deux vers.",
    ],

    encadres=[
        ("vigilance", "Décrire un texte avant de le juger", [
            "Ce poème heurtera une partie de la classe, et il est bon qu'il la "
            "heurte : cela veut dire qu'elle lit. Mais l'ordre des opérations "
            "compte, et il est le même pour tous les textes anciens.",
            "**1. Décrire.** Qui parle ? Combien de vers chacun ? Quels verbes ? "
            "C'est du relevé, il n'y a pas à discuter.",
            "**2. Situer.** 1865. Le poème reprend un récit d'origine très ancien, "
            "commun à plusieurs traditions.",
            "**3. Interpréter.** Que fait le texte de ce matériau ?",
            "**4. Discuter.** Alors seulement, dire ce qu'on en pense — et le dire "
            "en s'appuyant sur les trois premières étapes.",
            "Un devoir qui commence par l'étape 4 n'est pas un commentaire : c'est "
            "une opinion. Un devoir qui s'arrête à l'étape 1 n'en est pas un non "
            "plus.",
        ]),
        ("methode", "Repérer un point de vue dans un texte", [
            "Trois questions suffisent, et elles se répondent par des relevés :",
            "- **Qui parle ?** Comptez les vers de chaque locuteur.",
            "- **Qui est regardé ?** Cherchez les verbes de perception et leur "
            "sujet.",
            "- **Qui se tait ?** C'est la question qu'on oublie, et c'est souvent la "
            "plus instructive.",
            "Appliquées ici, elles donnent en cinq minutes la matière d'un axe "
            "entier de commentaire.",
        ]),
    ],

    plan=[
        ("Introduction",
         "En tête de la section « Femmes » de *Stances et Poèmes* (1865), Sully "
         "Prudhomme place un poème de trente-six alexandrins à rimes plates qui "
         "raconte une origine : le premier homme, seul devant un monde qu'il ne peut "
         "posséder, voit apparaître la femme, faite de tout ce qu'il admirait. "
         "**Comment un récit d'origine, en donnant à la femme la place la plus "
         "haute, révèle-t-il en même temps le point de vue d'où il est écrit ?** On "
         "étudiera d'abord le poème comme récit des commencements, puis la "
         "construction de la femme par emprunts au monde, enfin la parole unique qui "
         "gouverne le texte."),
        ("I. Un récit des commencements", [
            "**A. Un premier vers qui contient tout.** « Le premier homme est né, "
            "mais il est solitaire » : le fait et le manque en douze syllabes.",
            "**B. Une forme de récit.** Alexandrins à rimes plates, aucune strophe, "
            "un présent de narration : le poème raconte au lieu de chanter.",
            "**C. Une explication des origines.** Le texte répond à la question "
            "« pourquoi la femme ? » par une fable, non par un argument.",
        ]),
        ("II. Une femme faite du monde", [
            "**A. L'éloge par emprunts.** La rose, les rayons, l'or de la plaine, le "
            "lis, les flots, les nuées : chaque trait vient d'ailleurs.",
            "**B. L'anaphore des verbes de fabrication.** « Il fait », « Il forme », "
            "« Il choisit » : la femme est un ouvrage, et le poème le dit.",
            "**C. « Un bouquet vivant ».** L'image avoue la méthode : un bouquet est "
            "un assemblage de fleurs prises ailleurs.",
        ]),
        ("III. La parole d'un seul", [
            "**A. Deux discours, un seul locuteur.** Vingt-cinq vers sur trente-six "
            "sont prononcés par l'homme ; la femme est appelée mais ne répond pas.",
            "**B. Le lexique de la possession.** « étreindre », « saisir », "
            "« posséder » relient le manque initial à l'éloge final.",
            "**C. Ce que le poème donne et ce qu'il retient.** La place la plus "
            "haute, et pas la parole : les deux faits doivent être tenus ensemble.",
        ]),
        ("Conclusion",
         "Poème d'ouverture d'une section entière, « La Femme » vaut autant par ce "
         "qu'il construit que par ce qu'il laisse voir de son époque et de son "
         "auteur. Il montre une admiration réelle, exprimée dans une langue d'une "
         "grande maîtrise, et il montre aussi qu'une admiration peut se passer de la "
         "parole de celle qu'elle admire. On le comparera à « Inconscience », dans "
         "la même section, où le poète interroge cette fois ce que la femme ignore "
         "d'elle-même."),
    ],

    ouverture="À rapprocher des « Vénus » et de « Inconscience », dans la même "
              "section. Et, pour élargir, du « Je me croyais poète » de la fiche 6 : "
              "on y verra le même homme reconnaître, cette fois, les limites de sa "
              "propre parole.",

    comprendre=[
        "Dans quel état se trouve le premier homme au début du poème ? Citez le "
        "premier vers.",
        "Que reproche-t-il au monde qui l'entoure ? Relevez deux vers.",
        "Que fait la nature au vers 17-19 ? Recopiez l'expression qui désigne la "
        "femme.",
        "Citez trois éléments naturels dont la femme est faite, d'après le second "
        "discours.",
        "La femme prend-elle la parole dans le poème ? Justifiez par un relevé.",
    ],

    analyser=[
        "a) Comptez les vers du premier discours direct, puis ceux du second. "
        "b) Lequel est le plus long ? c) Que révèle ce déséquilibre sur ce qui "
        "intéresse le poème ?",
        "a) Relevez les cinq verbes dont Dieu est le sujet dans le second discours. "
        "b) Que font-ils tous ? c) Comment appelle-t-on la reprise d'une même "
        "construction en tête de plusieurs vers ?",
        "« Fit un bouquet vivant, de jeunesse embaumé ». a) Qu'est-ce qu'un bouquet, "
        "concrètement ? b) L'image est-elle seulement flatteuse ? c) Que dit-elle de "
        "la manière dont le poème construit son personnage ?",
        "a) Relevez les verbes « étreindre », « saisir » et « posséder » avec leur "
        "vers. b) Qu'ont-ils en commun ? c) Le dernier vers du poème emploie l'un "
        "d'eux : quel effet cela produit-il sur l'ensemble ?",
        "Comptez les syllabes des vers 1 à 4 et placez la césure de chacun. Un vers "
        "vous résiste-t-il ? Cherchez-y une diérèse.",
        "« Un lis nouveau qu'il a nommé candeur ». a) Le lis existe-t-il ? b) Que "
        "signifie « candeur » ? c) Expliquez le procédé qui consiste à donner à une "
        "qualité morale la forme d'une fleur.",
    ],

    parcours1=[
        "a) Dressez un tableau à deux colonnes : à gauche, l'élément naturel ; à "
        "droite, la partie de la femme qu'il a servi à faire. Six lignes suffisent.",
        "b) Recopiez le vers où l'homme s'adresse pour la première fois à la femme, "
        "et nommez la figure employée.",
    ],

    parcours2=[
        "a) Le poème rapporte deux discours et ne les commente jamais. Montrez que "
        "ce silence du poète rend possibles deux lectures opposées du texte, et "
        "exposez-les l'une et l'autre.",
        "b) Récrivez les six derniers vers en donnant la parole à la femme. Puis "
        "expliquez, en dix lignes, ce que votre réécriture change au poème — et ce "
        "qu'elle lui fait perdre.",
    ],

    synthese="Le poème place la femme au-dessus de tout ce qui existe et ne lui "
             "donne pas un mot à dire. Ces deux faits se contredisent-ils, ou "
             "s'expliquent-ils l'un l'autre ?",

    examen="**Vers la dissertation.** « Un texte ancien s'explique par son époque ; "
           "il ne s'excuse pas par elle. » Vous discuterez cette affirmation en vous "
           "appuyant sur « La Femme » et sur d'autres œuvres de votre choix. On "
           "attend une introduction rédigée et un plan détaillé en trois parties.",
)


# ═══════════════════════════════════════════════ FICHE 5 — LE LEVER DU SOLEIL
F5 = dict(
    titre="Fiche 5 — « Le Lever du soleil »",
    repere=X.REPERES["P5"],
    extrait=X.P5,
    source=_src("P5"),
    disposition="vers",

    objectif="Étudier un poème où le savoir scientifique n'est pas l'ennemi de la "
             "poésie, et défaire le lieu commun selon lequel la science "
             "désenchanterait le monde.",

    lexique=[
        ["royal ennui", "lassitude d'un souverain ; ici, la solitude du soleil."],
        ["les sphères", "les corps célestes. Le « chœur des sphères » vient de la "
                        "pensée antique, qui leur prêtait une musique."],
        ["voraces", "qui dévorent, insatiables."],
        ["empourpre", "colore de pourpre, de rouge sombre."],
        ["blêmes", "d'une pâleur maladive."],
        ["l'Hellade", "la Grèce ancienne."],
        ["fatalement", "nécessairement, par une loi à laquelle on n'échappe pas."],
        ["imposture", "tromperie de celui qui se fait passer pour ce qu'il n'est "
                      "pas."],
        ["répudié", "rejeté, renvoyé — le mot s'emploie d'abord pour une épouse."],
    ],

    situation="Le poème ouvre « Mélanges », la plus vaste section du recueil, et "
              "porte une dédicace : « à Henri Schneider », maître de forges du "
              "Creusot chez qui Sully Prudhomme avait travaillé après avoir dû "
              "renoncer aux études scientifiques. Dix quatrains d'alexandrins. Le "
              "titre annonce un lever de soleil ; le poème n'en décrit aucun. Il "
              "décrit un **savoir** : ce que l'astronomie a fait du soleil, et ce "
              "que ce savoir change au regard des hommes. C'est le texte central du "
              "recueil pour comprendre le rapport de son auteur à la science.",

    mouvements=[
        "**Le soleil en lui-même (str. 1-3).** Un astre indifférent, sans haut ni "
        "bas, qui donne sans recevoir et ne porte aucun vivant.",
        "**La terre et les hommes (str. 4-6).** La terre cherche sa caresse ; les "
        "hommes, eux, n'ont « que des pas bornés » et ne voient qu'un fragment du "
        "phénomène.",
        "**Deux cris, deux époques (str. 7-8).** Les Grecs saluaient un dieu à char ; "
        "« Nous autres nous crions : Salut à l'Infini ! »",
        "**Ce que la science a changé (str. 9-10).** Le rideau des apparences est "
        "tombé ; l'univers, loin d'être appauvri, « vêt une beauté neuve ».",
    ],

    axes=[
        ("Un soleil dépouillé de ses images", [
            "**Le poème commence par un renversement.** « Le grand soleil, plongé "
            "dans un royal ennui, / Brûle au désert des cieux. » Le soleil de la "
            "poésie traditionnelle est joie et générosité. Celui-ci s'ennuie, et le "
            "ciel est un désert.",
            "**Les négations font le portrait.** « il n'est ni haut ni bas », « Il "
            "ne prend d'aucun feu le feu qu'il communique », « Son regard ne s'élève "
            "et ne s'abaisse pas », « il ne peuple point son immense rondeur ». "
            "Quatre négations en deux strophes : le poème définit l'astre par ce "
            "qu'il n'est pas.",
            "**Ce que ces négations disent exactement.** Elles décrivent un objet "
            "que la physique a dépouillé de toute intention. Le soleil ne veut rien, "
            "ne regarde personne, ne favorise personne. C'est un fait, et le poème "
            "l'énonce sans se plaindre.",
            "**Une trace de grandeur subsiste.** « Flamboyant, invisible à force de "
            "splendeur » : le paradoxe est exact — on ne peut pas regarder le soleil. "
            "Le poème ne renonce donc pas à l'émerveillement ; il le déplace du "
            "mythe vers le phénomène.",
        ]),
        ("La petitesse des hommes, et pourquoi elle n'est pas une humiliation", [
            "**La terre est décrite du dehors.** « Sur son axe qui vibre et tourne, "
            "elle offre au jour / Son épaisseur énorme et sa face vivante ». C'est le "
            "point de vue de l'astronome : on voit la planète entière, pas un "
            "paysage.",
            "**Les hommes, eux, n'en perçoivent qu'un morceau.** « Mais les hommes "
            "épars n'ont que des pas bornés, / Avec le sol natal ils émergent ou "
            "plongent ». Le lever de soleil que chacun croit voir n'est qu'un effet "
            "de sa position.",
            "**Le vers le plus fort est une observation, pas une leçon.** « Quand "
            "les uns du sommeil sortent illuminés, / Les autres dans la nuit "
            "s'enfoncent et s'allongent. » Deux moitiés d'humanité, dans le même "
            "vers, en sens contraire. La rotation de la terre est dite sans un mot "
            "de vocabulaire technique.",
            "**Aucune amertume.** Le poème ne dit pas que l'homme est ridicule. Il "
            "dit qu'il est situé — « avec le sol natal » —, ce qui est une autre "
            "chose. La nuance est essentielle pour ne pas contresens le texte.",
        ]),
        ("Ce que la science donne en échange de ce qu'elle enlève", [
            "**Les deux cris sont mis en parallèle exact.** Les Grecs : « Criaient : "
            "Salut au dieu dont les quatre chevaux / Frappent d'un pied d'argent le "
            "ciel solide et rose ! » Nous : « Nous autres nous crions : Salut à "
            "l'Infini ! » Même verbe, même salut, deux objets.",
            "**Ce qui a disparu est nommé.** « le ciel solide », les « quatre "
            "chevaux », le dieu : la mythologie est rendue à ce qu'elle était, une "
            "image du monde. « Il est tombé pour nous, le rideau merveilleux / Où du "
            "vrai monde erraient les fausses apparences. »",
            "**Ce qui reste n'est pas rien.** « Salut à l'Infini ! / Au grand Tout, "
            "à la fois idole, temple et prêtre, / Qui tient fatalement l'homme à la "
            "terre uni, / Et la terre au soleil, et chaque être à chaque être ! » La "
            "loi physique — la gravitation — devient l'objet d'un salut. Le poème "
            "propose un émerveillement de remplacement.",
            "**Le dernier vers est la thèse du poème.** « Et l'univers entier vêt "
            "une beauté neuve. » Non pas « perd sa beauté », mais « en revêt une "
            "autre ». Tout élève qui écrira que ce poème déplore le progrès de la "
            "science aura lu le contraire du texte.",
            "**Une réserve, tout de même.** « La science a vaincu l'imposture des "
            "yeux, / L'homme a répudié les vaines espérances. » Le mot "
            "« espérances » n'est pas neutre : ce qu'on a répudié, ce sont des "
            "espoirs. Le poème enregistre une perte en même temps qu'un gain. C'est "
            "cet équilibre qu'un bon commentaire doit rendre.",
        ]),
    ],

    forme=[
        "**Le mètre.** Alexandrins, en dix quatrains. Le vers long convient à une "
        "pensée qui a besoin de développer : comparez avec l'octosyllabe du « Vase "
        "brisé », qui procède par notations brèves.",
        "**Les rimes sont croisées** (ABAB) et alternent féminines et masculines : "
        "ennui / silence / lui / balance. La régularité est parfaite sur quarante "
        "vers.",
        "**Un enjambement de strophe à l'intérieur du premier quatrain.** « Sous les "
        "traits qu'en silence / Il disperse et rappelle incessamment à lui, / Le "
        "chœur grave et lointain des sphères se balance. » La phrase traverse trois "
        "vers : le mouvement du texte imite celui qu'il décrit.",
        "**Le parallélisme des deux cris.** « Criaient : Salut au dieu… » / « nous "
        "crions : Salut à l'Infini ! » Même verbe, même formule, même place dans le "
        "quatrain. Le poème oppose deux époques par une symétrie, sans dire laquelle "
        "a raison.",
        "**Trois métaphores gouvernent la fin.** Le **rideau** qui tombe (le "
        "théâtre), les **piliers** mis à l'épreuve (l'architecture), l'univers qui "
        "**vêt** une beauté neuve (le vêtement). Trois images de ce qui se découvre "
        "ou se recouvre : le poème pense le savoir comme un changement d'apparence, "
        "non comme une destruction.",
        "**Une accumulation qui vaut définition.** « Au grand Tout, à la fois idole, "
        "temple et prêtre » : trois termes religieux pour désigner ce qui n'est plus "
        "une religion. Le poème garde le vocabulaire du sacré pour dire la loi "
        "naturelle. C'est le geste le plus audacieux du texte.",
    ],

    encadres=[
        ("vigilance", "Le contresens à ne pas faire sur ce poème", [
            "Chaque année, des copies écrivent que Sully Prudhomme regrette le temps "
            "des dieux et accuse la science d'avoir tué la poésie. Le texte dit "
            "exactement l'inverse, et il le dit à son dernier vers : « Et l'univers "
            "entier vêt une beauté neuve. »",
            "**D'où vient l'erreur ?** De trois expressions négatives — « imposture "
            "des yeux », « mensonge ancien », « vaines espérances » — qu'on attribue "
            "à la science alors qu'elles désignent **ce que la science a corrigé**. "
            "Relisez : c'est le ciel qui a menti, pas la science.",
            "**Le bon usage de ces mots.** Ils permettent de nuancer, non de "
            "renverser. Le poème enregistre bien une perte — on a répudié des "
            "espérances —, mais il conclut sur un gain.",
        ]),
        ("saviez", "Un poète qui a connu l'usine", [
            "La dédicace « à Henri Schneider » n'est pas un ornement. Après "
            "l'ophtalmie qui l'a écarté des études scientifiques, Sully Prudhomme a "
            "travaillé au Creusot, dans les établissements de la famille Schneider, "
            "avant de se tourner vers le droit puis vers les lettres.",
            "Cela explique deux choses dans le recueil. D'abord la place du travail "
            "et des ouvriers dans la section « Mélanges ». Ensuite l'absence de "
            "mépris pour la science : l'auteur en vient, il en a été privé, et il "
            "n'a jamais écrit contre elle. Il traduira d'ailleurs, en 1869, le "
            "premier livre du *De rerum natura* de Lucrèce — le grand poème latin "
            "qui explique le monde par la matière.",
        ]),
    ],

    plan=[
        ("Introduction",
         "Placé en tête de « Mélanges » et dédié au maître de forges Henri "
         "Schneider, « Le Lever du soleil » est un poème de dix quatrains "
         "d'alexandrins qui ne décrit aucun lever de soleil : il décrit ce que "
         "l'astronomie a fait de cet astre, et ce que ce savoir change au regard des "
         "hommes. Sully Prudhomme, formé aux sciences puis écarté d'elles par la "
         "maladie, y traite un débat de son siècle. **La connaissance scientifique "
         "appauvrit-elle le monde, ou lui donne-t-elle une autre beauté ?** On "
         "examinera d'abord le soleil dépouillé de ses images, puis la place exacte "
         "que le poème assigne aux hommes, enfin l'échange que la science propose."),
        ("I. Un soleil dépouillé de ses images", [
            "**A. Un renversement d'entrée.** « royal ennui », « désert des cieux » : "
            "l'astre de la joie devient un astre indifférent.",
            "**B. Un portrait par la négation.** Quatre négations en deux strophes : "
            "le soleil ne veut rien, ne regarde personne, ne porte personne.",
            "**C. L'émerveillement déplacé, non supprimé.** « Flamboyant, invisible "
            "à force de splendeur » : le paradoxe est physiquement exact et "
            "poétiquement intact.",
        ]),
        ("II. La place des hommes", [
            "**A. Le point de vue de l'astronome.** La terre vue du dehors, « son "
            "épaisseur énorme et sa face vivante ».",
            "**B. Des perceptions bornées.** « les hommes épars n'ont que des pas "
            "bornés » : chacun ne voit qu'un fragment, selon l'endroit où il est.",
            "**C. Situer n'est pas humilier.** « Avec le sol natal ils émergent ou "
            "plongent » : le poème décrit une condition, il ne prononce pas une "
            "condamnation.",
        ]),
        ("III. L'échange que propose la science", [
            "**A. Deux cris parallèles.** Les Grecs saluent un dieu, nous saluons "
            "l'Infini : même verbe, deux objets.",
            "**B. Ce qui tombe.** Le rideau, les fausses apparences, le mensonge "
            "ancien du ciel : la mythologie est rendue à son statut d'image.",
            "**C. Ce qui reste, et qui est neuf.** La loi qui unit « chaque être à "
            "chaque être », et un univers qui « vêt une beauté neuve ». La perte des "
            "« vaines espérances » est enregistrée, mais le bilan est positif.",
        ]),
        ("Conclusion",
         "Le poème refuse l'opposition commode entre la science et la poésie. Il "
         "reconnaît ce que le savoir enlève — des dieux, des espérances, un ciel "
         "solide — et affirme ce qu'il donne : une loi qui relie tout, et un "
         "émerveillement d'une autre espèce. Le vocabulaire du sacré, conservé pour "
         "dire la loi naturelle, est le signe le plus net de ce transfert. On "
         "rapprochera ce poème de « La Poésie » et de « Le Monde des Âmes », où la "
         "même question est reprise autrement."),
    ],

    ouverture="À rapprocher de « La Poésie » et de « Intus », dans « La Vie "
              "intérieure », où le débat entre le savoir et la croyance se joue "
              "cette fois à l'intérieur d'une seule conscience. Et, hors du recueil, "
              "du *De rerum natura* de Lucrèce, que Sully Prudhomme traduira quatre "
              "ans plus tard.",

    comprendre=[
        "Le poème décrit-il un lever de soleil ? Justifiez votre réponse.",
        "Relevez quatre choses que le soleil ne fait pas, d'après les strophes 2 et "
        "3.",
        "Pourquoi les hommes ne voient-ils pas tous le soleil au même moment ? "
        "Citez le vers qui l'explique.",
        "Que criaient les Grecs ? Que crions-nous, selon le poète ? Recopiez les "
        "deux formules.",
        "Quel est le dernier vers du poème ? Le poète y déplore-t-il quelque chose ?",
    ],

    analyser=[
        "a) Relevez toutes les négations des strophes 2 et 3. b) De quoi le soleil "
        "est-il privé par ces négations ? c) Le poème le regrette-t-il ? Justifiez.",
        "« Quand les uns du sommeil sortent illuminés, / Les autres dans la nuit "
        "s'enfoncent et s'allongent. » a) Quel phénomène est décrit sans être nommé ? "
        "b) Relevez ce qui, dans la construction du vers, met les deux moitiés de "
        "l'humanité en opposition. c) Quel mot scientifique le poète aurait-il pu "
        "employer, et que perdrait le vers ?",
        "Comparez les strophes 7 et 8. a) Quel mot est repris à l'identique ? b) Ce "
        "parallélisme désigne-t-il un vainqueur ? c) Que produit l'expression « Nous "
        "autres » ?",
        "« Il est tombé pour nous, le rideau merveilleux ». a) De quel domaine cette "
        "image est-elle tirée ? b) Cherchez les deux autres métaphores des deux "
        "dernières strophes et nommez leur domaine. c) Qu'ont en commun les trois ?",
        "« À la fois idole, temple et prêtre ». a) À quel domaine ces trois mots "
        "appartiennent-ils ? b) De quoi parle-t-on pourtant ? c) Que fait le poème en "
        "employant ce vocabulaire ?",
        "a) Comptez les syllabes du vers « Flamboyant, invisible à force de "
        "splendeur ». b) La coupe classique, après la sixième syllabe, tombe-t-elle "
        "ici entre deux mots ? Qu'en concluez-vous sur la souplesse que le poète "
        "s'autorise ? c) Expliquez pourquoi « invisible à force de splendeur » "
        "n'est pas une contradiction.",
    ],

    parcours1=[
        "a) Dressez deux colonnes : ce que voyaient les Grecs, ce que nous savons. "
        "Quatre lignes, en vous appuyant sur les strophes 7 à 10.",
        "b) Recopiez le dernier vers et expliquez-le en deux phrases.",
    ],

    parcours2=[
        "a) Démontrez, citations à l'appui, que le poème enregistre à la fois une "
        "perte et un gain. Dites lequel des deux l'emporte, et à quel endroit "
        "précis du texte cela se décide.",
        "b) « La science a vaincu l'imposture des yeux. » Discutez cette formule en "
        "vingt lignes : la science corrige-t-elle nos sens, ou nous apprend-elle "
        "seulement à nous en méfier ?",
    ],

    synthese="Le titre annonce « Le Lever du soleil » et le poème n'en décrit "
             "aucun. Ce décalage est-il un défaut de composition, ou le sujet même "
             "du texte ?",

    examen="**Vers le commentaire composé.** Rédigez entièrement la partie III du "
           "plan ci-dessus, en trois paragraphes suivis de la conclusion. Vous "
           "veillerez à citer au moins une fois chacune des trois métaphores "
           "finales. On attend de 400 à 450 mots.",
)


# ══════════════════════════════════════════ FICHE 6 — JE ME CROYAIS POÈTE
F6 = dict(
    titre="Fiche 6 — « Je me croyais Poète »",
    repere=X.REPERES["P6"],
    extrait=X.P6,
    source=_src("P6"),
    disposition="vers",

    objectif="Étudier le poème qui ferme le recueil, et comprendre comment un "
             "livre peut se conclure sur l'aveu de son insuffisance sans se "
             "détruire lui-même.",

    lexique=[
        ["se méprendre", "se tromper sur ce que l'on est."],
        ["la lyre", "instrument des poètes antiques ; par métonymie, la poésie "
                    "elle-même et ses règles."],
        ["impétueuse", "vive, emportée."],
        ["le statuaire", "le sculpteur (nom d'agent, aujourd'hui rare)."],
        ["l'argile", "la terre dont le sculpteur fait son modèle."],
        ["fange indocile", "boue qui refuse d'obéir à la main."],
        ["l'airain", "le bronze."],
        ["l'effigie", "l'image gravée sur une monnaie, qui lui donne sa valeur."],
        ["monnayer", "transformer en monnaie ; par extension, rendre utilisable."],
        ["la houle", "le mouvement large de la mer."],
        ["pavillon", "drapeau d'un navire."],
    ],

    situation="C'est le dernier poème du recueil, dédié à Louis Bertrand : onze "
              "strophes de trois alexandrins suivis d'un vers court. Le titre "
              "emploie l'imparfait — « Je me croyais » — et l'aveu tombe dès le "
              "premier hémistiche. Il faut le lire en regard de « Au lecteur », le "
              "poème liminaire, qui annonçait déjà que « les vrais vers ne seront "
              "pas lus ». Le livre est donc **encadré** par deux aveux d'échec, et "
              "c'est le second qui donne au premier son sens.",

    mouvements=[
        "**L'aveu et sa réserve (str. 1-2).** « Je me croyais poète et j'ai pu me "
        "méprendre » — mais l'âme, elle, est ce qu'elle est, et le poète seul le "
        "sait.",
        "**La défense par l'exemple (str. 3-4).** Le sculpteur dont l'argile résiste "
        "est-il moins inspiré ? Dieu juge l'œuvre intérieure, non l'exécution.",
        "**Le constat de l'écart (str. 5-8).** Entre ce qu'on sent et ce qu'on peut "
        "dire, il y a une distance que rien ne comble : le lingot d'airain sans "
        "effigie.",
        "**Le rêve de gloire (str. 9-10).** L'image maritime : surnager sur la houle "
        "des noms, arriver seul mais vainqueur au port.",
        "**Le renoncement transformé en vœu (str. 11).** « Que dans un autre cœur "
        "mon poème renaisse, / Qu'il vibre et soit aimé ! »",
    ],

    axes=[
        ("Un aveu qui ne se rend pas", [
            "**Le premier vers concède et résiste en même temps.** « Je me croyais "
            "poète et j'ai pu me méprendre » : l'aveu est net. Mais la strophe se "
            "termine par une question — « Qui le sait mieux que moi ? » — qui "
            "revendique une supériorité de connaissance sur tous les juges "
            "possibles.",
            "**La structure de chaque strophe reproduit ce mouvement.** Trois "
            "alexandrins pour développer, un vers court pour trancher. Le vers bref "
            "n'est jamais une conclusion résignée : « Qui le sait mieux que moi ? », "
            "« Est-il moins inspiré ? », « Qu'il vibre et soit aimé ! »",
            "**La défense passe par une analogie précise.** « Mais quoi ! le "
            "statuaire, au moment où l'argile / Refuse au sentiment le contour "
            "désiré, / Parce qu'il trouve alors une fange indocile / Est-il moins "
            "inspiré ? » L'argument sépare l'inspiration de son exécution : le "
            "matériau peut trahir sans que l'artiste soit en cause.",
            "**Un juge est convoqué.** « Dieu, qui sans interprète aperçoit qui nous "
            "sommes, / Juge l'œuvre en mon sein. » L'expression « sans interprète » "
            "est le cœur du poème : il existerait un regard qui lit l'intention sans "
            "passer par les mots.",
        ]),
        ("L'écart entre le sentir et le dire", [
            "**Le problème est formulé sans métaphore d'abord.** « Mon rêve de sa "
            "lutte avec les mots rebelles / Ne sort jamais vainqueur ! » Les mots "
            "sont un adversaire, et le combat est perdu d'avance.",
            "**Puis par une série d'images qui disent toutes la même chose.** Les "
            "cordes qui « ne vibrent jamais au rhythme de mon cœur » ; l'argile "
            "indocile ; « l'outil qui tremble dans ma main » ; le signe qui « se "
            "dérobe » ; « ma sordide robe / Cache aux yeux mon trésor ».",
            "**L'image la plus exacte est monétaire.** « L'airain sans l'effigie est "
            "un bien illusoire, / Et j'en porte un lingot qu'il faudrait monnayer ; "
            "/ J'ai de ce fort métal dont s'achète la gloire, / Et ne la puis "
            "payer. » Le métal a la valeur ; il lui manque la frappe qui la rend "
            "échangeable. La forme n'ajoute rien à la matière, elle la rend "
            "transmissible.",
            "**Ce que l'analogie apprend sur la poésie.** Elle n'est pas le "
            "sentiment, et elle n'est pas non plus un ornement du sentiment : elle "
            "est ce qui permet au sentiment de circuler. C'est la définition la plus "
            "précise que le recueil donne de son art.",
            "**Une observation amère sur le lecteur.** « Quand j'ai changé mon âme "
            "en un bruit pour l'oreille, / Les hommes ont-ils vu ma joie et ma "
            "douleur ? / ils n'ont qu'un mot : l'amour, expression pareille / De mon "
            "trouble et du leur. » Le langage commun réduit toutes les expériences à "
            "un seul mot.",
        ]),
        ("Une fin qui déplace la réussite au lieu de l'abandonner", [
            "**L'ambition est nommée et n'est pas reniée.** « La gloire ! oh ! "
            "surnager sur cette immense houle » : deux strophes entières, la plus "
            "longue image du poème, développent le rêve d'un nom qui traverse le "
            "temps.",
            "**Le vocabulaire maritime construit ce rêve.** La houle, le flux, les "
            "brumes du passé, la mer humaine, le pavillon, le port. Le poème le plus "
            "modeste du recueil contient sa plus vaste métaphore.",
            "**Le renversement final tient en un mot : « Mais ».** « Ce rêve "
            "ambitieux remplira ma jeunesse, / Mais, si l'air ne s'est point de ma "
            "vie animé, / Que dans un autre cœur mon poème renaisse, / Qu'il vibre "
            "et soit aimé ! »",
            "**Le subjonctif change la nature de la réussite.** Les trois derniers "
            "vers ne sont ni une affirmation ni une plainte : ce sont des souhaits. "
            "La réussite d'un poème n'est plus sa perfection, ni la gloire de son "
            "auteur, mais sa reprise par quelqu'un d'autre.",
            "**Le mot « vibre » referme le poème sur son ouverture.** À la deuxième "
            "strophe, les cordes « ne vibrent jamais au rhythme de mon cœur ». Au "
            "dernier vers, on souhaite que le poème « vibre » dans un autre cœur. Ce "
            "que l'instrument n'a pas su faire, le lecteur le fera.",
        ]),
    ],

    forme=[
        "**Une strophe à vers inégaux.** Trois alexandrins suivis d'un vers court. "
        "Comptez le quatrième vers de la première strophe : « Qui / le / sait / "
        "mieux / que / moi » — six syllabes. C'est un hexasyllabe, exactement la "
        "moitié de l'alexandrin.",
        "**Ce que cette forme produit.** Le vers court crée une chute à chaque "
        "strophe. Il est de plus décalé vers la droite dans l'édition : le blanc "
        "typographique le détache encore. Sur onze strophes, l'effet devient un "
        "rythme de tout le poème.",
        "**Les rimes sont croisées** (ABAB), féminines et masculines alternées : "
        "méprendre / loi / tendre / moi.",
        "**Le premier mot est un pronom, le dernier une forme verbale de souhait.** "
        "« Je » ouvre, « soit aimé » ferme. Le poème se déplace du sujet vers son "
        "lecteur, et c'est là tout son mouvement.",
        "**Trois interjections, et elles jalonnent le poème.** « Mais quoi ! » ouvre la "
        "défense (str. 3), « Hélas ! » ouvre le constat d'échec (str. 7), « La "
        "gloire ! oh ! » ouvre le rêve (str. 9). Chacune marque un changement de "
        "mouvement : les repérer, c'est tenir le plan du texte.",
        "**Une graphie d'époque, conservée.** L'édition de 1865 imprime « rhythme », "
        "orthographe alors courante, formée sur le grec. Ce cahier ne la corrige "
        "pas : on ne modernise pas le texte d'un auteur sans le dire. À signaler aux "
        "élèves, qui la prendront pour une faute.",
    ],

    encadres=[
        ("methode", "Étudier un poème de clôture", [
            "Un dernier poème ne se lit jamais seul. Trois gestes, dans l'ordre :",
            "**1. Le confronter au premier.** Ici, « Au lecteur » annonçait : « Le "
            "meilleur demeure en moi-même, / Mes vrais vers ne seront pas lus. » Le "
            "dernier poème reprend l'aveu et le transforme en souhait. Le livre est "
            "encadré.",
            "**2. Chercher ce qui revient.** Un mot, une image. Ici « vibrer », qui "
            "passe de l'échec de l'instrument au souhait adressé au lecteur.",
            "**3. Demander ce que le livre devient.** Si la clôture annule ce qui "
            "précède, le recueil se détruit. Si elle le déplace, elle l'achève. "
            "C'est le second cas.",
        ]),
        ("saviez", "Un aveu qui n'a pas empêché le Nobel", [
            "Le poète qui écrit « Je me croyais poète et j'ai pu me méprendre » "
            "recevra, trente-six ans plus tard, le tout premier prix Nobel de "
            "littérature, en 1901. L'Académie suédoise salue alors une œuvre "
            "témoignant « d'un idéalisme élevé, d'une perfection artistique et d'une "
            "rare association des qualités du cœur et de l'esprit ».",
            "La décision fit scandale : beaucoup attendaient qu'elle allât à Tolstoï, "
            "vivant et immense. Des écrivains suédois lui adressèrent une lettre "
            "d'excuses. La postérité leur a plutôt donné raison — ce qui rend le "
            "dernier poème du recueil d'une ironie singulière, et en fait un "
            "excellent sujet de discussion sur ce que vaut un prix littéraire.",
        ]),
    ],

    plan=[
        ("Introduction",
         "Dernier poème de *Stances et Poèmes* (1865), « Je me croyais Poète » "
         "s'ouvre sur un aveu : celui d'une méprise sur soi. En onze strophes de "
         "trois alexandrins et d'un vers court, Sully Prudhomme y sépare "
         "l'inspiration de son exécution, mesure l'écart entre ce qu'il éprouve et "
         "ce qu'il parvient à dire, puis remet son poème à un lecteur inconnu. "
         "**Comment un recueil peut-il se conclure sur l'aveu de son insuffisance "
         "sans se détruire lui-même ?** On étudiera d'abord un aveu qui ne se rend "
         "pas, puis l'écart entre le sentir et le dire, enfin le déplacement final "
         "de la réussite."),
        ("I. Un aveu qui ne se rend pas", [
            "**A. Une concession immédiate.** « Je me croyais poète et j'ai pu me "
            "méprendre » : l'imparfait du titre est confirmé dès le premier vers.",
            "**B. Une résistance dans la forme même.** Le vers court de chaque "
            "strophe est une question ou une exclamation, jamais une capitulation.",
            "**C. Une défense argumentée.** L'analogie du sculpteur et de l'argile "
            "sépare l'inspiration de l'exécution ; Dieu, « sans interprète », juge "
            "l'œuvre intérieure.",
        ]),
        ("II. L'écart entre le sentir et le dire", [
            "**A. Les mots comme adversaires.** « sa lutte avec les mots rebelles / "
            "Ne sort jamais vainqueur ».",
            "**B. Une série d'images convergentes.** Cordes qui ne vibrent pas, "
            "argile indocile, outil qui tremble, signe qui se dérobe, robe sordide "
            "sur un trésor.",
            "**C. L'analogie monétaire.** Le lingot d'airain sans effigie : la forme "
            "ne crée pas la valeur, elle la rend échangeable. C'est une définition "
            "de la poésie.",
        ]),
        ("III. Le déplacement de la réussite", [
            "**A. Le rêve de gloire, longuement développé.** La houle, le pavillon, "
            "le port : la plus vaste métaphore du poème sert son ambition la plus "
            "grande.",
            "**B. Le renversement par « Mais ».** Trois vers au subjonctif "
            "substituent un souhait à une conquête.",
            "**C. La boucle du mot « vibrer ».** Ce que l'instrument n'a pas su "
            "faire, un autre cœur le fera. Le poème ne renonce pas : il change de "
            "critère.",
        ]),
        ("Conclusion",
         "Le poème achève le recueil en répondant à son seuil : à l'aveu de « Au "
         "lecteur », il substitue un vœu adressé au lecteur. La réussite d'un poème "
         "n'y est plus mesurée à sa perfection, ni à la gloire de son auteur, mais à "
         "sa capacité d'être repris. C'est une définition modeste et exigeante à la "
         "fois, et elle éclaire rétrospectivement les cent sept poèmes qui "
         "précèdent. On la comparera au « Au lecteur » de Baudelaire, qui ouvre son "
         "recueil en accusant son lecteur au lieu de s'en remettre à lui."),
    ],

    ouverture="À lire immédiatement après « Au lecteur », le poème liminaire du "
              "recueil : les deux textes forment un cadre, et aucun des deux ne se "
              "comprend entièrement sans l'autre. Pour élargir, on comparera avec "
              "« Au lecteur » de Baudelaire (*Les Fleurs du mal*, 1857), qui ouvre "
              "un recueil en prenant son lecteur à partie — deux manières opposées "
              "de nouer le même lien.",

    comprendre=[
        "Quel aveu le poète fait-il dès le premier vers ? Recopiez-le.",
        "À quel artiste le poète se compare-t-il dans la troisième strophe ? Quel "
        "obstacle rencontre cet artiste ?",
        "Que possède le poète, et que ne peut-il pas en faire ? Répondez en "
        "reprenant l'image du métal.",
        "Quel rêve occupe les strophes 9 et 10 ? Relevez trois mots du champ lexical "
        "de la mer.",
        "Quel souhait le poète forme-t-il dans les trois derniers vers ?",
    ],

    analyser=[
        "a) Recopiez les vers courts des onze strophes. b) Combien de syllabes "
        "font-ils ? c) Combien sont des questions ou des exclamations ? Que montre "
        "ce relevé sur le ton du poème ?",
        "« L'airain sans l'effigie est un bien illusoire ». a) Qu'est-ce que "
        "l'effigie d'une monnaie ? b) Que représente le lingot, et que représente "
        "l'effigie, pour un poète ? c) Reformulez en une phrase l'idée que le poète "
        "se fait de la forme poétique.",
        "a) Relevez toutes les images qui disent l'impuissance à exprimer. b) "
        "Classez-les selon leur domaine (musique, sculpture, vêtement, monnaie). "
        "c) Pourquoi cette variété sert-elle mieux le propos qu'une image unique ?",
        "Cherchez le verbe « vibrer » dans le poème. a) Où apparaît-il ? b) Qui en "
        "est le sujet à chaque fois ? c) Que produit ce retour à la dernière ligne "
        "du recueil ?",
        "Lisez « Au lecteur », en tête du recueil. a) Quel aveu y est déjà fait ? "
        "b) En quoi le dernier poème le reprend-il ? c) En quoi le corrige-t-il ?",
        "« Que dans un autre cœur mon poème renaisse, / Qu'il vibre et soit aimé ! » "
        "a) À quel mode sont ces verbes ? b) Le poète décide-t-il, demande-t-il ou "
        "espère-t-il ? c) Ce choix vous paraît-il plus faible ou plus fort qu'une "
        "affirmation ?",
    ],

    parcours1=[
        "a) Recopiez la strophe du sculpteur et expliquez en trois phrases "
        "l'argument qu'elle contient.",
        "b) Apprenez la dernière strophe et récitez-la en marquant le vers court.",
    ],

    parcours2=[
        "a) Montrez que le poème refuse successivement trois définitions de la "
        "réussite poétique — la maîtrise technique, le jugement des hommes, la "
        "gloire — avant d'en proposer une quatrième. Citez pour chacune.",
        "b) « Il n'y a pas de poème réussi, il n'y a que des poèmes repris. » "
        "Discutez cette formule à partir du texte, en une trentaine de lignes.",
    ],

    synthese="Le recueil s'ouvre et se ferme sur un aveu d'échec. Est-ce une "
             "modestie de convention, ou la véritable idée que Sully Prudhomme se "
             "fait de la poésie ?",

    examen="**Vers le commentaire composé.** Rédigez entièrement l'introduction et "
           "la partie III du plan ci-dessus. Vous confronterez explicitement ce "
           "poème à « Au lecteur », que vous citerez. On attend de 400 à 450 mots.",
)

FICHES_ST_4_6 = [F4, F5, F6]
