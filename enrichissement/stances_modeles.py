# -*- coding: utf-8 -*-
"""
Section 8 du cahier « Stances et Poèmes » : quatre devoirs entièrement rédigés.

**Rédigés selon les deux maquettes officielles** reproduites dans `obc.py`,
relevées sur les corrigés harmonisés nationaux de l'Office du Baccalauréat.
Cela commande le vocabulaire — *centre d'intérêt*, *sous-centre*, *outil
d'analyse*, *transition partielle* — et les articulations : « D'entrée de
jeu… », « Cela s'illustre dans le passage à travers… », « Cet indice
traduit… », « Dans un sillage analogue… », « À mi-chemin de notre
commentaire… ».

Les deux commentaires portent sur des poèmes qui n'ont pas de fiche — « Les
Berceaux » et « Intus » —, reproduits ici en entier : le cahier étudie donc
huit poèmes du recueil, et l'élève peut confronter chaque devoir à son texte.

Chaque commentaire se ferme sur la rubrique **Intérêts du texte**, que la
grille note 1,5 point et que les copies oublient.
"""
import stances_extraits as X

SRC = X.SRC


def _src(cle):
    return SRC + X.REFERENCES[cle][2] + "."


# ═════════════════════════════════════════════════════════ COMMENTAIRE N° 1
CC1 = dict(
    numero="Commentaire composé n° 1 — devoir entièrement rédigé",
    sujet="Vous ferez le commentaire composé du poème « Les Berceaux » "
          "(*Stances et Poèmes*, « La Vie intérieure »). Vous montrerez, entre "
          "autres, comment un objet de l'enfance devient le modèle de tous les "
          "abris que l'homme cherche ensuite, et comment le poème passe du "
          "souvenir personnel à une question adressée à tous.",
    support=X.P7,
    source_support=_src("P7"),
    disposition="vers",
    avertissement="Devoir rédigé en entier, comme une copie de candidat, et "
                  "construit sur la maquette du commentaire composé de l'OBC. "
                  "Les articulations sont celles du document officiel ; les "
                  "intertitres en gras, eux, ne figureraient pas sur une "
                  "copie : ils rendent la construction visible pour la classe.",

    corps=[
        ("Introduction", [
            "Publié en 1865 dans *Stances et Poèmes*, premier recueil de Sully "
            "Prudhomme, « Les Berceaux » appartient à « La Vie intérieure », la "
            "section où le poète explore le temps, la mémoire et les états de "
            "l'âme. Le texte compte cinq quatrains d'octosyllabes à rimes "
            "croisées.",
            "**Idée générale.** Le poème part d'une observation ordinaire — les "
            "nids se défont après le départ des oiseaux — pour retrouver un "
            "berceau oublié dans un grenier, puis pour découvrir dans cet objet "
            "le modèle de tous les abris que l'homme cherchera plus tard.",
            "**Problématique.** Comment un objet abandonné devient-il, en vingt "
            "vers, la clé d'un besoin qui ne quitte jamais l'homme ?",
            "**Plan.** Deux centres d'intérêt peuvent être envisagés : la ruine "
            "des abris et la transfiguration du berceau en lieu d'origine, puis "
            "l'élargissement d'un souvenir privé en question universelle.",
        ]),
        ("Premier centre d'intérêt — Des abris qui se défont, un berceau qui "
         "demeure", [
            "D'entrée de jeu, nous allons étudier la manière dont le poème "
            "installe un monde où rien de ce qui abrite ne dure. Ceci se "
            "manifeste à travers la ruine des abris naturels, puis à travers le "
            "sursis que le souvenir accorde à un seul d'entre eux.",
            "En effet, il est clair que le poète ouvre son texte sur une image "
            "empruntée à la nature, et que cette image est déjà une ruine. Il "
            "faut comprendre par là que le lecteur n'assiste pas à une "
            "destruction : il en constate le résultat. Le texte ne raconte rien "
            "du séjour des oiseaux ; il commence après. C'est dire que le poème "
            "s'ouvre sur un état, non sur un événement.",
            "Cela s'illustre dans le passage à travers le complément "
            "circonstanciel de temps « Après le départ des oiseaux », qui place "
            "d'emblée le texte dans l'après. Cet indice traduit un parti pris de "
            "composition : le poète écarte le récit pour ne garder que le "
            "constat. Dans un sillage analogue, cet outil est renforcé par le "
            "présent de l'indicatif à valeur permanente dans « Les nids "
            "abandonnés pourrissent », rejeté à la rime. Il connote un processus "
            "organique et sans retour, que rien n'interrompt.",
            "Cette idée débouche sur un transfert que le poème opère sans "
            "prévenir. La question « Que sont devenus nos berceaux ? » substitue "
            "l'abri humain à l'abri animal, sans le moindre outil de "
            "comparaison — ni « comme », ni « ainsi ». On le perçoit également "
            "dans la caractérisation nominale « De leur bois les vers se "
            "nourrissent », d'une cruauté tranquille : l'objet destiné à "
            "protéger la vie qui commence nourrit désormais une autre vie. Tout "
            "ceci passe nécessairement par une mise en cause du sort commun à "
            "tous les abris.",
            "Par ailleurs, on peut aussi relever la manière dont le poème "
            "individualise ce constat général. Il faut comprendre par là que le "
            "« je » n'entre pas au début du texte, mais au milieu, une fois la "
            "loi générale posée. C'est dire que le poète se range lui-même sous "
            "une règle qu'il vient d'énoncer.",
            "Cette idée est visible avec le possessif singulier de « Le mien "
            "traîne au fond des greniers », qui fait entrer le sujet lyrique "
            "sans le nommer. Cet élément met en évidence un déplacement de "
            "l'échelle : du nid de tous au berceau d'un seul. Aussi, cet outil "
            "est renforcé par la personnification de « L'oubli morne et lent le "
            "dévore », où l'abstraction agit comme un être vivant. Il laisse "
            "entendre que la destruction se poursuit sur un troisième plan — "
            "après la pourriture du nid et les vers du bois, l'oubli de la "
            "mémoire. Trois destructions se succèdent ainsi en huit vers, sur "
            "trois plans différents.",
            "Or c'est au moment le plus sombre qu'un contre-mouvement s'amorce. "
            "Le conditionnel de « Je l'embrasserais volontiers » dit un geste "
            "impossible, mais l'adverbe « encore », dans « Car mon enfance y rit "
            "encore », affirme une persistance. Cet indice signale que quelque "
            "chose résiste à l'oubli : non pas l'objet, mais ce qui s'y est "
            "passé.",
            "À mi-chemin de notre commentaire, nous pouvons relever que le poème "
            "établit d'abord la fragilité de tout abri, puis réserve au seul "
            "berceau du poète un sursis fondé sur la mémoire. Il convient "
            "maintenant de se pencher sur la manière dont ce sursis change de "
            "nature : de souvenir privé, le berceau devient le modèle de tout ce "
            "que l'homme cherchera ensuite.",
        ]),
        ("Second centre d'intérêt — Du souvenir privé à la question de tous", [
            "Poursuivons notre analyse en étudiant la façon dont il est fait "
            "étalage de ce besoin d'abri, à partir de la transfiguration du "
            "berceau en lieu d'origine et de l'élargissement final au « nous ».",
            "En réalité, l'auteur ne se contente pas de se souvenir : il fait du "
            "berceau le lieu où l'on apprend. Il faut comprendre par là que "
            "l'enfance n'y est pas décrite comme un paradis perdu, mais comme un "
            "apprentissage. C'est dire que le poème échappe à la mièvrerie par "
            "la précision même de son vocabulaire.",
            "Cette idée est visible avec la métaphore « Pour ciel de lit, des "
            "yeux de mère » : l'expression « ciel de lit » désigne le dais tendu "
            "au-dessus d'un lit, et le poète y substitue le regard maternel. Cet "
            "élément met en évidence un double sens, car le mot « ciel » garde "
            "sa valeur haute : l'enfant se trouve placé sous un firmament de "
            "tendresse. Dans le même sens, cet outil est renforcé par le "
            "parallélisme des deux vers suivants, « Où mon âme épelait l'amour / "
            "Et ma prunelle la lumière », où un seul verbe vaut pour l'âme et "
            "pour l'œil. Il connote deux apprentissages menés de front, l'un "
            "moral, l'autre physique.",
            "Le choix du verbe mérite qu'on s'y arrête, car il est l'outil le "
            "plus fin du poème. « Épeler », c'est prononcer les lettres une à "
            "une, avant de savoir lire. Le poète ne dit pas que l'enfant a connu "
            "l'amour, mais qu'il en a déchiffré les premiers éléments. Tout ceci "
            "passe nécessairement par un élargissement, puisque cet "
            "apprentissage-là est celui de tous.",
            "Par ailleurs, on peut aussi analyser le passage du « je » au "
            "« nous », qui constitue l'événement central de la fin du poème. "
            "Autrement dit, le berceau cesse d'être un objet pour devenir un "
            "modèle : l'amitié et l'amour sont décrits comme autant de "
            "tentatives de le retrouver.",
            "Cela s'illustre dans le passage à travers trois marques "
            "grammaticales convergentes. L'apostrophe « Femmes sans tache » "
            "introduit un destinataire là où le poème n'en avait aucun ; le "
            "possessif « sur le vôtre » fait entrer le lecteur ; enfin le "
            "pronom « nous » de « C'est un berceau que nous rêvons » remplace "
            "définitivement le « je ». Cet indice traduit un mouvement réglé : "
            "du général au particulier dans la première moitié, du particulier "
            "au collectif dans la seconde. Aussi, cet outil est renforcé par la "
            "caractérisation nominale « Cet instinct de vivre blottis », où le "
            "mot « instinct » classe le besoin d'abri parmi les données de la "
            "nature, non parmi les faiblesses. Il vient signaler que le poète ne "
            "juge pas ce besoin : il le constate.",
            "Le participe « blottis », rejeté à la rime, garde d'ailleurs la "
            "position même du corps dans le berceau : l'homme adulte conserve un "
            "geste d'enfant. Le poème se ferme enfin sur une interpellation dont "
            "il faut mesurer la hardiesse : « Pourquoi donc, si tôt trop petits, "
            "/ Berceaux, trahissez-vous les hommes ? » L'apostrophe s'adresse à "
            "des objets, ce qui achève de les personnifier, et le verbe "
            "« trahir » leur prête une intention. Or le grief est absurde : un "
            "berceau ne peut que devenir trop petit, c'est sa fonction même de "
            "servir à un corps qui grandit. C'est là toute la force du dernier "
            "vers — il accuse ce qui n'est coupable de rien, et rend ainsi "
            "sensible une injustice qui n'a pas d'auteur.",
        ]),
        ("Conclusion", [
            "En cinq quatrains, « Les Berceaux » conduit d'un nid pourrissant à "
            "une question sans réponse, sans avoir employé une seule fois le mot "
            "« tristesse » ni le mot « nostalgie ». Sa réussite tient à une "
            "méthode constante chez Sully Prudhomme : partir d'un objet précis, "
            "le décrire assez longuement pour qu'il devienne familier, puis "
            "découvrir qu'il contenait une idée. La régularité de l'octosyllabe "
            "et des rimes croisées retient l'émotion au lieu de l'exposer, ce "
            "qui est la marque du Parnasse ; mais le sujet — l'enfance, la mère, "
            "le besoin d'être abrité — n'a rien d'impassible. On rapprochera ce "
            "poème du « Vase brisé », qui use de la même méthode sur un autre "
            "objet.",
        ]),
        ("Intérêts du texte", [
            "**Intérêt stylistique.** Richesse des outils d'écriture : "
            "personnification de l'oubli et des berceaux, métaphore du « ciel de "
            "lit », caractérisation nominale, parallélisme, apostrophe finale, "
            "et un emploi remarquable du rejet à la rime — « pourrissent », "
            "« blottis ».",
            "**Intérêt psychologique.** Le passage du souvenir personnel à la "
            "reconnaissance d'un besoin commun : le poème montre comment un "
            "adulte découvre en lui un geste d'enfant qu'il n'a pas quitté.",
            "**Intérêt social ou humain.** L'évocation du besoin de protection "
            "et de la place qu'y tiennent l'amitié, l'amour et la mère — une "
            "expérience que tout lecteur reconnaît, quelle que soit sa culture.",
        ]),
    ],

    encadre=("methode", "Ce que le correcteur cherche dans une introduction", [
        "L'introduction ci-dessus contient quatre choses, dans l'ordre du "
        "corrigé national. Un candidat qui en omet une perd des points, quelle "
        "que soit la qualité du reste :",
        "- **Situation du texte** : l'auteur, l'œuvre, la date, la section, et "
        "la forme (cinq quatrains d'octosyllabes).",
        "- **Idée générale** : de quoi parle le texte, en deux phrases, sans "
        "l'analyser.",
        "- **Problématique** : une question, et une seule.",
        "- **Plan** : « Deux centres d'intérêt peuvent être envisagés : … » — "
        "c'est la formule même du corrigé national.",
        "Comptez : cela fait entre cent vingt et cent soixante mots. Une "
        "introduction de quarante mots est incomplète ; une introduction de "
        "trois cents mots empiète sur le développement.",
    ]),
)


# ═════════════════════════════════════════════════════════ COMMENTAIRE N° 2
CC2 = dict(
    numero="Commentaire composé n° 2 — devoir entièrement rédigé",
    sujet="Vous ferez le commentaire composé du poème « Intus » (*Stances et "
          "Poèmes*, « La Vie intérieure »). Vous étudierez notamment la mise en "
          "scène du débat intérieur et la manière dont le poème refuse de le "
          "trancher.",
    support=X.P8,
    source_support=_src("P8"),
    disposition="vers",
    avertissement="Devoir rédigé en entier, sur la maquette de l'OBC. Le titre "
                  "latin *intus* signifie « au dedans » : il commande toute la "
                  "lecture, et c'est sur lui que porte le contresens le plus "
                  "fréquent — faire du poème un débat entre deux religions ou "
                  "entre deux personnes, alors qu'il se tient dans une seule "
                  "conscience.",

    corps=[
        ("Introduction", [
            "« Intus » figure dans « La Vie intérieure », première section de "
            "*Stances et Poèmes* (1865). Sully Prudhomme écrit au moment où la "
            "science, avec Darwin et Renan, ébranle les croyances établies, et "
            "où beaucoup d'esprits cultivés perdent une foi sans en trouver une "
            "autre. Le poème compte quatre quatrains d'octosyllabes.",
            "**Idée générale.** Le texte fait entendre deux voix qui "
            "s'affrontent dans une même âme, la raison et l'amour, et il "
            "s'achève sans que l'une l'emporte. Le titre latin signifie « au "
            "dedans » et interdit d'y voir un débat entre deux personnes ou deux "
            "confessions.",
            "**Problématique.** Comment un poème de seize vers peut-il donner "
            "forme à un conflit qui n'a ni vainqueur ni fin ?",
            "**Plan.** Deux centres d'intérêt peuvent être envisagés : la mise "
            "en scène de deux voix intérieures, puis le refus de conclure sur "
            "lequel le poème se referme.",
        ]),
        ("Premier centre d'intérêt — Deux voix dans une seule âme", [
            "Pour commencer notre commentaire, analysons la manière dont le "
            "poète installe un dialogue à l'intérieur d'une conscience. "
            "Celui-ci est visible avec la mise en place du dispositif, puis avec "
            "l'extension de ce conflit à tout lecteur.",
            "En effet, il est clair que l'auteur nomme le lieu du débat dès le "
            "premier vers. Il faut comprendre par là que le poème ne met pas aux "
            "prises deux personnages, mais deux mouvements d'un même être. C'est "
            "dire que le titre n'est pas un ornement savant : il donne la clé du "
            "texte, et il faut le traduire avant de lire.",
            "Cela s'illustre dans le passage à travers la caractérisation "
            "nominale « Des profondeurs troubles de l'âme », où l'adjectif "
            "« troubles » indique d'emblée qu'on n'y voit pas clair. Cet indice "
            "traduit l'aveu d'une confusion que la suite du poème va pourtant "
            "mettre en ordre. Dans un sillage analogue, cet outil est renforcé "
            "par la locution adverbiale « tour à tour », qui annonce une "
            "alternance et non un affrontement simultané. Il laisse entendre que "
            "les deux voix ne se recouvrent jamais : elles se succèdent, et le "
            "débat peut donc durer indéfiniment.",
            "Cette idée débouche sur la caractérisation des deux instances, que "
            "le poète confie à deux verbes seulement. « La raison blasphème, et "
            "l'amour / Rêve un dieu juste et le proclame » : le verbe "
            "« blasphémer » appartient au lexique religieux et suppose un sacré "
            "offensé, de sorte que la raison est décrite avec le vocabulaire de "
            "ce qu'elle nie. On le perçoit également dans le couple « rêve » et "
            "« proclame », qui associe à l'amour une part d'illusion et une part "
            "d'affirmation publique. Aucune des deux voix n'est flattée. Tout "
            "ceci passe nécessairement par la mise en scène proprement dite.",
            "Par ailleurs, on peut aussi examiner la manière dont le poème donne "
            "la parole à chacune. Autrement dit, le texte cesse d'être une "
            "description pour devenir un dialogue de théâtre, avec ses "
            "guillemets et ses verbes introducteurs.",
            "Cette idée est visible avec « L'intelligence dit au cœur », "
            "formule qui installe un échange en règle. Cet élément met en "
            "évidence deux arguments de nature opposée : celui de "
            "l'intelligence est empirique — « Vois, le mal est partout "
            "vainqueur » —, et l'impératif « Vois » en appelle à la seule preuve "
            "qu'elle reconnaisse, l'observation. Aussi, cet outil est renforcé "
            "par la réplique du cœur, « Je crois et j'espère », qui aligne deux "
            "verbes sans avancer une seule raison. Il connote une conviction qui "
            "ne se fonde pas sur l'expérience et qui l'assume.",
            "On remarquera enfin l'apostrophe familière « Espère, ô ma sœur, "
            "crois un peu », par laquelle le cœur reconnaît sa parenté avec "
            "l'intelligence. Cet indice signale que les deux voix habitent le "
            "même être et ne se traitent pas en ennemies.",
            "De ce qui précède, nous pouvons relever que le poème construit "
            "méthodiquement un débat intime, en nommant son lieu, en "
            "caractérisant ses deux instances et en leur donnant tour à tour la "
            "parole. Qu'en est-il maintenant de son issue ? Nous allons dès à "
            "présent examiner la manière dont le texte refuse de trancher, et ce "
            "que ce refus signifie.",
        ]),
        ("Second centre d'intérêt — Un conflit que le poème refuse de trancher",
         [
            "Notre analyse se poursuit avec le refus de conclure, manifesté par "
            "l'extension du conflit à tout lecteur et par la brutalité du "
            "dernier vers.",
            "En fait, l'auteur interrompt sa mise en scène pour s'adresser "
            "directement au lecteur, et c'est le geste le plus important du "
            "poème. Il faut comprendre par là que le débat n'est pas présenté "
            "comme une particularité du poète. C'est dire que le texte cesse un "
            "instant d'être un tableau pour devenir une adresse.",
            "Cela s'illustre dans le passage à travers l'énumération "
            "« Panthéiste, athée ou chrétien », qui nomme trois positions "
            "inconciliables — celui qui identifie Dieu au monde, celui qui le "
            "nie, celui qui l'adore. Cet élément met en évidence une thèse "
            "forte : le conflit ne dépend pas de la croyance qu'on professe, il "
            "la précède et lui survit. C'est là que se joue la lecture du texte, "
            "et c'est là que se commet le contresens le plus courant, qui "
            "consiste à faire de « Intus » un débat entre le croyant et "
            "l'incroyant. Dans le même sens, cet outil est renforcé par le "
            "parallélisme des possessifs dans « C'est mon martyre, et c'est le "
            "tien », qui met le poète et le lecteur à égalité. Il vient signaler "
            "que le mot « martyre », emprunté encore une fois au lexique "
            "religieux, désigne une souffrance sans faute : on ne l'a pas "
            "méritée, on la subit.",
            "Le terme « murmures », enfin, corrige ce que le mot « voix » "
            "pouvait avoir de trop net au premier vers. Un murmure est continu, "
            "sourd, difficile à distinguer : le poème avoue ainsi que le débat "
            "qu'il met en scène si clairement est en réalité confus, et que la "
            "mise en dialogue est une commodité de poète. Tout ceci passe "
            "nécessairement par le dernier vers, où tout se joue.",
            "Par ailleurs, on peut aussi étudier la manière dont le poème "
            "organise son propre inachèvement. Autrement dit, toute la "
            "construction prépare une conclusion que la dernière ligne refuse de "
            "donner.",
            "On le perçoit dans le texte avec le déséquilibre calculé des deux "
            "dernières prises de parole. Le cœur parle le dernier au discours "
            "direct, et il parle longuement — cinq vers contre trois —, pour "
            "s'achever sur l'affirmation la plus forte du texte : « Je suis "
            "immortel, je sens Dieu. » Ces deux propositions juxtaposées, sans "
            "lien logique, revendiquent par le verbe « sentir » une connaissance "
            "qui se passe de preuve. Cet indice traduit l'assurance d'une voix "
            "qui n'argumente plus. Aussi, cet outil est renforcé par la réplique "
            "finale, précédée d'un tiret : « — L'intelligence lui dit : "
            "“Prouve !” ». Il illustre un renversement de tout le poids du "
            "poème : un seul mot, à l'impératif, suivi d'un point "
            "d'exclamation, contre cinq vers de conviction.",
            "Ce mot unique ne réfute rien ; il rappelle une règle — ce qui est "
            "affirmé doit être établi. Le poème s'arrête là, sans dire si la "
            "preuve viendra ni si son absence disqualifie le cœur. Le lecteur "
            "reste avec les deux voix, exactement comme au premier vers : le "
            "texte est donc circulaire, et l'alternance annoncée par « tour à "
            "tour » se poursuivra après la dernière ligne. On observera enfin "
            "qu'aucune des deux voix n'est ridiculisée, l'exigence de "
            "l'intelligence étant aussi légitime que la méthode que propose le "
            "cœur, « C'est à force d'aimer qu'on trouve ».",
        ]),
        ("Conclusion", [
            "« Intus » donne à un conflit intime la forme d'un dialogue de "
            "théâtre, puis retire au lecteur le dénouement qu'un dialogue "
            "promet. Le poème ne prend pas parti, non par prudence, mais parce "
            "que son sujet est précisément l'impossibilité de trancher : c'est "
            "ce que dit le mot « murmures », et ce que confirme le dernier vers, "
            "où l'exigence de preuve reste sans réponse. On rapprochera ce texte "
            "du « Lever du soleil », où la science et l'émerveillement coexistent "
            "également sans s'exclure : chez Sully Prudhomme, la poésie n'est "
            "pas l'endroit où l'on conclut, mais celui où l'on tient ensemble "
            "deux vérités qui ne s'accordent pas.",
        ]),
        ("Intérêts du texte", [
            "**Intérêt stylistique.** L'emploi du dialogue au discours direct "
            "dans un poème lyrique, la caractérisation par le seul verbe "
            "(« blasphème », « rêve », « proclame »), le parallélisme des "
            "possessifs, et une chute d'un seul mot à l'impératif.",
            "**Intérêt psychologique.** La représentation d'un conflit "
            "intérieur qui ne se résout pas, et le refus de le présenter comme "
            "une faiblesse : le poème le nomme « martyre », c'est-à-dire une "
            "souffrance qu'on n'a pas méritée.",
            "**Intérêt philosophique et humain.** La question du rapport entre "
            "la raison et la croyance, posée sans que le poète impose sa "
            "réponse — ce qui en fait un texte de débat plutôt qu'un texte de "
            "thèse.",
        ]),
    ],

    encadre=("vigilance", "Le contresens à éviter sur « Intus »", [
        "Le titre est latin et signifie « au dedans ». Il désigne le lieu du "
        "conflit, non ses participants.",
        "**Le contresens** : faire du poème un débat entre un croyant et un "
        "athée, ou entre deux religions. Le texte l'interdit explicitement au "
        "vers 5 — « Panthéiste, athée ou chrétien, / Tu connais leurs luttes "
        "obscures » —, où les trois positions sont mises sur le même plan et "
        "reçoivent le même diagnostic.",
        "**La conséquence sur le devoir** : un candidat qui construit ses "
        "centres d'intérêt sur l'opposition foi / athéisme ne commet pas une "
        "erreur de détail, il se trompe de sujet. Le correcteur ne peut pas le "
        "rattraper dans le critère C2.",
        "**Le réflexe à prendre** : quand un poème porte un titre en langue "
        "étrangère, le traduire avant de lire. Une minute de dictionnaire évite "
        "quatre heures de contresens.",
    ]),
)


# ═════════════════════════════════════════════════════════ DISSERTATION N° 1
D1 = dict(
    numero="Dissertation n° 1 — devoir entièrement rédigé",
    sujet="Un critique écrit à propos de la poésie parnassienne : « À force de "
          "vouloir la perfection de la forme, ces poètes ont fini par éteindre "
          "l'émotion qu'ils prétendaient servir. » Cette affirmation vous "
          "paraît-elle rendre justice à *Stances et Poèmes* de Sully Prudhomme ? "
          "Vous répondrez en vous appuyant sur le recueil et sur vos lectures "
          "personnelles.",
    avertissement="Devoir rédigé en entier, sur la maquette de la dissertation "
                  "de l'OBC : thème, reformulation, problématique, type de "
                  "plan, puis chaque argument en cinq temps — idée, "
                  "explication, exemple, citation, transition partielle. Le "
                  "sujet propose un jugement à discuter : le plan dialectique "
                  "s'impose.",

    corps=[
        ("Introduction", [
            "**Thème.** Le rapport entre la rigueur formelle et l'expression de "
            "l'émotion en poésie.",
            "**Reformulation.** Selon ce critique, les poètes parnassiens, en "
            "recherchant une forme parfaite, auraient étouffé le sentiment qu'ils "
            "voulaient exprimer.",
            "**Problématique.** La rigueur formelle éteint-elle l'émotion, ou "
            "lui donne-t-elle au contraire sa forme la plus efficace ?",
            "**Type de plan.** Le sujet, qui invite à apprécier un jugement, "
            "incline à adopter un plan dialectique.",
            "**Plan possible.** Nous examinerons d'abord ce qui fonde le "
            "reproche, puis ce que le recueil lui oppose, avant de montrer que "
            "l'opposition entre forme et émotion est elle-même mal posée.",
        ]),
        ("Première partie — Ce que le reproche a de fondé", [
            "Le critique soutient que la perfection formelle a éteint l'émotion "
            "chez les parnassiens. Plusieurs arguments justifient son point de "
            "vue.",
            "Tout d'abord, le programme même du Parnasse contient un refus de "
            "l'expression directe. Autrement dit, ces poètes se sont donné pour "
            "règle d'écarter le « moi » du poème, au nom de ce que Leconte de "
            "Lisle appelait l'impassibilité. Il faut comprendre là que le "
            "reproche du critique ne porte pas sur une maladresse, mais sur une "
            "doctrine assumée : une poésie qui se veut sculpture court le risque "
            "de la froideur, et la métaphore est révélatrice, puisque le marbre "
            "ne pleure pas. C'est le cas dans les poèmes de facture antique de "
            "la section « Femmes » — « Les Vénus », « La Néréide » —, où la "
            "beauté plastique laisse peu de place à l'émotion. Voilà pourquoi "
            "Théophile Gautier avait pu lancer la formule de « l'art pour "
            "l'art », qui affranchit le poème de toute mission autre que sa "
            "propre beauté. Cette idée prend encore plus d'épaisseur avec "
            "l'examen d'un poème précis du recueil.",
            "Ensuite, *Stances et Poèmes* comporte des pièces où ce risque se "
            "réalise. Cela signifie que le reproche ne vise pas seulement les "
            "contemporains de Sully Prudhomme, mais atteint parfois son propre "
            "recueil. À titre illustratif, « La Femme », qui ouvre la section du "
            "même nom, est un exercice brillant : trente-six alexandrins à rimes "
            "plates énumèrent les éléments de la nature dont la femme serait "
            "faite — « Avec l'or de la plaine et le lustre de l'onde / Il fait "
            "ta chevelure étincelante et blonde ». Le poème admire, mais il "
            "n'émeut pas, et l'on peut soutenir que la perfection de l'exécution "
            "y tient lieu de sentiment. Cette idée engendre forcément une "
            "observation sur la forme même du recueil.",
            "Enfin, la régularité du recueil est absolue, et cette absence de "
            "toute irrégularité peut passer pour une raideur. C'est dire que sur "
            "les cent huit pièces on ne trouve ni vers libre, ni strophe "
            "irrégulière, ni rime approximative. En guise d'illustration, « La "
            "Mémoire » aligne dix-huit quatrains d'octosyllabes à rimes croisées "
            "sans un seul écart. Un lecteur habitué aux ruptures de Rimbaud ou "
            "d'Apollinaire y verra une contrainte subie, et le verbe "
            "« éteindre » employé par le critique lui semblera juste.",
        ]),
        ("Transition", [
            "À ce niveau de la réflexion, nous pouvons relever que le reproche "
            "s'appuie sur une doctrine réelle, sur des poèmes précis du recueil "
            "et sur une régularité formelle sans faille. Toutefois, il faut "
            "aussi reconnaître que les pièces les plus connues du volume "
            "démentent ce jugement, et qu'elles le démentent par leur forme "
            "même.",
        ]),
        ("Seconde partie — Ce que le recueil oppose à ce jugement", [
            "La position défendue par ce critique, quoique valide en son "
            "principe, présente des limites que le recueil met en évidence. En "
            "effet, de nombreux arguments confortent le point de vue contraire.",
            "D'entrée de jeu, la contrainte formelle y produit l'effet au lieu "
            "de l'empêcher. Ceci revient à dire que l'octosyllabe, trop court "
            "pour développer, oblige chaque vers à ne porter qu'une seule "
            "notation, d'où vient la sécheresse du poème et sa force de "
            "sentence. C'est le cas dans « Le Vase brisé », dont le dernier vers "
            "— « Il est brisé, n'y touchez pas » — a la brièveté d'une maxime, "
            "et que le même aveu, écrit en prose ou en alexandrins, perdrait "
            "aussitôt. Tel critique a donc raison de louer la forme parnassienne "
            "quand elle sert ainsi le sens, car le chiasme qui inverse le vers "
            "douze n'y est pas un ornement : il distingue le vase, qu'on peut "
            "encore manier, du cœur, qu'on ne doit plus toucher. Cette idée se "
            "révèle davantage pertinente à travers un second poème.",
            "En outre, la disposition des rimes y accomplit ce qu'aucun mot ne "
            "dirait. Il faut comprendre là que le choix d'une forme n'est pas "
            "décoratif : il installe un état. Cette idée se vérifie dans « Le "
            "meilleur Moment des Amours », où la reprise anaphorique de « Il est "
            "dans » (4 occ.) donne l'impression que la liste pourrait continuer, "
            "et où la rime embrassée referme chaque quatrain sur lui-même. C'est "
            "dans ce sens qu'il faut appréhender la réussite du poème : "
            "l'impression de suspension que le lecteur éprouve ne vient pas d'un "
            "adjectif, mais d'une disposition. Cette idée engendre forcément une "
            "objection à l'impassibilité prêtée à ces poètes.",
            "Par ailleurs, le recueil dément l'impassibilité par son sujet même. "
            "Autrement dit, un poète impassible ne se plaindrait pas de ne "
            "pouvoir tout dire. En guise d'illustration, le volume traite de la "
            "mort d'une jeune fille, du souvenir d'une mère, de la perte de la "
            "foi, et son auteur formule lui-même son écart dès le seuil du "
            "livre : « Le meilleur demeure en moi-même, / Mes vrais vers ne "
            "seront pas lus. » Voilà pourquoi la formule de « demi-parnassien », "
            "souvent appliquée à Sully Prudhomme, doit être discutée plutôt que "
            "récitée.",
        ]),
        ("Synthèse", [
            "Il reste à dépasser l'alternative, car le jugement cité repose sur "
            "une image implicite : l'émotion serait un liquide, la forme un "
            "récipient, et un récipient trop étroit ferait déborder ou tarir. "
            "Cette image ne résiste pas à l'examen.",
            "Sully Prudhomme a lui-même proposé une autre analogie, plus juste. "
            "Dans le dernier poème du recueil, il compare son sentiment à un "
            "métal non frappé : « L'airain sans l'effigie est un bien "
            "illusoire, / Et j'en porte un lingot qu'il faudrait monnayer. » Le "
            "métal a la valeur ; ce qui lui manque, c'est la frappe qui la rend "
            "échangeable. La forme n'ajoute donc rien à l'émotion et ne lui "
            "retire rien : elle la rend transmissible. Sans elle, le sentiment "
            "reste chez celui qui l'éprouve.",
            "Cette conception résout d'ailleurs le cas des pièces froides du "
            "recueil : si « La Femme » nous touche moins que « Les Berceaux », "
            "ce n'est pas parce qu'elle est plus travaillée — elle ne l'est pas "
            "—, mais parce que l'émotion y était moindre au départ. Le défaut "
            "n'est pas dans la frappe, il est dans le métal. Et la démonstration "
            "vaut hors du Parnasse : un chant funèbre traditionnel, un proverbe, "
            "une chanson reprise en chœur tirent leur force de la reprise, du "
            "parallélisme, du refrain, c'est-à-dire de contraintes. La forme "
            "n'est pas l'ennemie de l'émotion ; elle est la condition pour que "
            "celle d'un homme atteigne un autre homme. On peut enfin se demander "
            "ce qu'il advient de cette conception au siècle suivant : les poèmes "
            "d'un Senghor ou d'un Césaire, qui renoncent au mètre compté, n'ont "
            "renoncé ni au rythme ni à la reprise. Ils ont changé de frappe, non "
            "de principe.",
        ]),
    ],

    encadre=("methode", "Discuter un jugement sans le contredire à plat", [
        "Un sujet qui cite un critique attend une discussion, non une "
        "réfutation. Trois erreurs à éviter, et leur remède :",
        "- **Nier d'emblée.** « Ce jugement est faux » en première ligne : le "
        "correcteur sait que la première partie n'existera pas. Remède : "
        "chercher d'abord ce qui a pu le rendre vraisemblable.",
        "- **Approuver de bout en bout.** Le devoir n'a plus de mouvement. "
        "Remède : un jugement qu'on n'a pas besoin de discuter n'aurait pas été "
        "donné en sujet.",
        "- **Rester dans le pour et le contre.** Une synthèse qui répète les "
        "deux parties ne vaut rien. Remède : elle doit déplacer la question — "
        "ici, en montrant que l'opposition entre forme et émotion repose sur "
        "une image fausse.",
        "**Et n'oubliez pas la transition partielle** : après chaque argument, "
        "une phrase qui annonce le suivant. C'est elle qui oblige à enchaîner "
        "les idées au lieu de les juxtaposer, et le critère C2 la cherche.",
    ]),
)


# ═════════════════════════════════════════════════════════ DISSERTATION N° 2
D2 = dict(
    numero="Dissertation n° 2 — devoir entièrement rédigé",
    sujet="Sully Prudhomme achève *Stances et Poèmes* sur ce vœu : « Que dans "
          "un autre cœur mon poème renaisse, / Qu'il vibre et soit aimé ! » "
          "Pensez-vous qu'un poème n'existe vraiment que lorsqu'un lecteur s'en "
          "empare ? Vous répondrez en vous appuyant sur le recueil et sur vos "
          "lectures.",
    avertissement="Devoir rédigé en entier, sur la maquette de l'OBC. La "
                  "citation est le dernier vers du recueil : le candidat doit "
                  "donc la situer avant de la traiter, et se souvenir que le "
                  "premier poème du livre, « Au lecteur », annonçait déjà que "
                  "« les vrais vers ne seront pas lus ». Un devoir qui ignore "
                  "ce cadre passe à côté de la moitié du sujet.",

    corps=[
        ("Introduction", [
            "**Thème.** L'existence du poème et le rôle qu'y joue le lecteur.",
            "**Reformulation.** Sully Prudhomme souhaite que son poème revive "
            "chez un autre : un texte n'aurait donc de valeur qu'à partir du "
            "moment où quelqu'un se l'approprie.",
            "**Problématique.** Un poème n'existe-t-il vraiment que lorsqu'un "
            "lecteur s'en empare ?",
            "**Type de plan.** Le sujet appelle une discussion : le plan "
            "dialectique s'impose.",
            "**Plan possible.** Nous verrons d'abord ce qui rend cette thèse "
            "convaincante, puis ce qui lui résiste, avant de montrer comment le "
            "recueil lui-même propose une solution en se donnant deux adresses "
            "au lecteur.",
        ]),
        ("Première partie — Un poème inachevé sans lecteur", [
            "Le poète soutient que son texte doit renaître dans un autre cœur "
            "pour valoir quelque chose. Plusieurs raisons confirment sa "
            "position.",
            "Tout d'abord, un poème est fait de mots, et un mot n'a de sens que "
            "pour quelqu'un. Ceci revient à dire que le langage est par nature "
            "un échange : une parole que personne n'entend n'a pas encore "
            "produit son effet. C'est le cas dans le poème même d'où le sujet "
            "est tiré, où le poète compare son sentiment à un métal non "
            "frappé : « L'airain sans l'effigie est un bien illusoire. » Voilà "
            "pourquoi il a pu écrire qu'il porte « un lingot qu'il faudrait "
            "monnayer » : le métal a la valeur, mais tant qu'il n'est pas "
            "frappé, il ne circule pas. Cette idée prend encore plus d'épaisseur "
            "avec l'histoire même du recueil.",
            "Ensuite, l'expérience de la lecture confirme cette dépendance. "
            "Autrement dit, ce sont les lecteurs qui décident de ce qui survit, "
            "et leur choix ne recoupe pas toujours celui de l'auteur. À "
            "l'exemple du « Vase brisé », devenu célèbre au point d'être récité "
            "dans les salons et reproduit dans les anthologies scolaires "
            "pendant des décennies : les cent sept autres pièces du même volume, "
            "écrites avec le même soin, n'ont pas eu cette vie. C'est dans ce "
            "sens qu'il faut appréhender le vœu du poète : il ne demande pas la "
            "gloire, il demande à être repris. Cette idée engendre forcément un "
            "examen du poème lui-même.",
            "Par ailleurs, le recueil inscrit ce déplacement dans son "
            "vocabulaire. Il faut comprendre là que le verbe « vibrer » y "
            "apparaît deux fois, et qu'il change de sujet. En guise "
            "d'illustration, la deuxième strophe du dernier poème l'emploie pour "
            "un échec — les cordes de la lyre « ne vibrent jamais au rhythme de "
            "mon cœur » —, tandis que le dernier vers l'emploie pour un "
            "espoir : « Qu'il vibre et soit aimé ! » Tel poète a donc raison de "
            "confier au lecteur ce que l'instrument n'a pas su faire.",
        ]),
        ("Transition", [
            "De ce qui précède, nous pouvons avancer que le poème demeure "
            "inachevé tant qu'un lecteur ne s'en est pas saisi, et que le "
            "recueil lui-même l'affirme. Cependant, il faut aussi admettre que "
            "cette thèse rencontre des objections sérieuses, et que le même "
            "recueil en fournit la première.",
        ]),
        ("Seconde partie — Ce qui résiste à cette thèse", [
            "La position du poète, quoique séduisante, est porteuse de limites. "
            "En réalité, de nombreux arguments valident le point de vue "
            "contraire.",
            "D'emblée, le poème liminaire du recueil affirme exactement "
            "l'inverse du dernier. Cela signifie qu'il existerait des vers "
            "réels et non lus, c'est-à-dire une poésie sans lecteur. C'est le "
            "cas dans « Au lecteur », où le poète déclare : « Le meilleur "
            "demeure en moi-même, / Mes vrais vers ne seront pas lus. » Voilà "
            "pourquoi il compare, dans la même pièce, ses beaux vers à des "
            "papillons qui fuient dès que la main les touche, « N'y laissant que "
            "le fard léger / De leur aile frêle et farouche » : ce qui parvient "
            "au lecteur n'est qu'une poussière tombée de l'aile. Cette idée "
            "prend encore plus d'épaisseur avec une objection de simple bon "
            "sens.",
            "Ensuite, si un poème n'existait que par son lecteur, tout poème "
            "oublié n'aurait jamais existé, ce qui est absurde. Ceci revient à "
            "dire que la lecture révèle un texte, mais ne le crée pas. À titre "
            "illustratif, des œuvres ont attendu des siècles avant d'être lues : "
            "elles n'ont pas commencé d'exister le jour de leur découverte. "
            "C'est dire que la thèse confond l'existence d'un poème et sa "
            "réception. Cette idée engendre forcément une méfiance à l'égard "
            "d'un critère purement quantitatif.",
            "Enfin, admettre la thèse sans réserve conduirait à mesurer la "
            "valeur d'une œuvre à son succès. Autrement dit, le poème le plus lu "
            "serait le plus grand, ce que l'histoire littéraire dément "
            "constamment. En guise d'illustration, l'auteur du recueil a reçu en "
            "1901 le tout premier prix Nobel de littérature alors que Tolstoï "
            "était vivant, et des écrivains suédois adressèrent à ce dernier une "
            "lettre pour marquer leur désaccord. La postérité leur a plutôt "
            "donné raison, ce qui montre assez que le nombre des lecteurs ne "
            "fait pas la valeur.",
        ]),
        ("Synthèse", [
            "La contradiction entre le premier et le dernier poème n'est pas une "
            "inadvertance : c'est la structure même du recueil. Le livre s'ouvre "
            "en disant que le meilleur ne sera pas lu, et il se ferme en "
            "souhaitant qu'il soit repris. Entre les deux, cent huit poèmes.",
            "Ce cadre permet de dépasser l'alternative. Ce que le poète garde — "
            "l'émotion vécue, l'intention, ce que « Dieu, sans interprète » "
            "aperçoit — lui appartient et n'est transmissible d'aucune manière. "
            "Ce que le poème devient chez un lecteur est autre chose : non pas "
            "le sentiment de l'auteur retrouvé, mais un sentiment nouveau, "
            "éveillé chez un autre par le même agencement de mots. Le poète ne "
            "demande d'ailleurs pas d'être compris ; il demande que son poème "
            "« renaisse », et le verbe suppose une autre vie, non la même.",
            "Cette conception assigne au lecteur un rôle actif : il ne reçoit "
            "pas un contenu, il en produit un. Chacun, lisant « Le Vase brisé », "
            "y met la fêlure qu'il connaît — et le poème ne dit jamais quelle "
            "blessure il décrit, ce silence étant précisément ce qui le rend "
            "disponible. On peut le vérifier hors du recueil : un proverbe, une "
            "chanson qu'on reprend en chœur, un poème appris à l'école n'ont pas "
            "de propriétaire, ils vivent d'être redits, et chaque reprise les "
            "modifie un peu. Gabriel Fauré, mettant « Les Berceaux » en musique "
            "en 1879, n'a pas restitué l'émotion de Sully Prudhomme : il en a "
            "fait naître une autre à partir des mêmes vers. Un poème existe donc "
            "deux fois, et jamais de la même façon — ce qui est une définition "
            "modeste et exigeante à la fois.",
        ]),
    ],

    encadre=("astuce", "Situer une citation avant de la discuter", [
        "Quand le sujet cite l'œuvre au programme, le premier réflexe est de "
        "**retrouver la citation dans le livre** : où se trouve-t-elle, qui "
        "parle, à quel moment ?",
        "Ici, la réponse change tout le devoir. Les deux vers cités sont les "
        "derniers du recueil ; ils répondent au poème liminaire, qui affirmait "
        "l'inverse. Un candidat qui l'ignore traite un sujet général sur le "
        "lecteur ; celui qui le sait dispose d'une synthèse toute trouvée.",
        "**Le réflexe à installer** : deux minutes de recherche dans le livre "
        "au brouillon, avant même de faire le plan. C'est le meilleur "
        "investissement de l'épreuve.",
    ]),
)


COMMENTAIRES = [CC1, CC2]
DISSERTATIONS = [D1, D2]
