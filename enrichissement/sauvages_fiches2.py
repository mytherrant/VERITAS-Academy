# -*- coding: utf-8 -*-
"""
Lectures méthodiques — « Poèmes sauvages éclairés au feu de brousse » (4 à 6).

Suite de `sauvages_fiches`. Mêmes règles : registre de seconde, mots glosés là
où ils apparaissent, extraits importés depuis `sauvages_extraits`, et
`disposition="vers"` pour que le verset soit composé un vers par ligne.
"""
import sauvages_extraits as X

# ═════════════════════════════════════════════════════════════ FICHE 4
F4 = dict(
    titre="Fiche 4 — La mosquée bleue, ou le souvenir qui répond",
    repere=X.REPERES["S4"],
    extrait=X.S4,
    source=X.REFERENCES["S4"],
    disposition="vers",
    objectif="Étudier le passage où le souvenir heureux revient, et comprendre pourquoi ce "
             "souvenir constitue la réponse la plus forte du livre à ceux qui ont tué.",
    situation=(
        "Nous sommes environ aux deux tiers du poème. La colère a été dite, l'énumération "
        "des villes frappées aussi. Le texte se retourne alors vers le passé : il fait "
        "revivre une conversation ordinaire entre deux amis, sur un balcon d'Abidjan."
    ),
    mouvements=[
        "**Le poème s'enfonce** (« et mon poème enflera de morves… ») : l'écriture comme "
        "travail souterrain, contre les explosions.",
        "**La mort au passage des bombes** (« et la mort / fait foule… ») : quatre vers très "
        "courts, hachés.",
        "**Le souvenir revient** (« et tu me regardes, Henrike… ») : le balcon, la mosquée, "
        "le rire.",
        "**« je suis en toi »** (« et tu sais que je suis bien en toi… ») : la présence "
        "gagnée sur la mort.",
        "**L'impératif final** (« offre donc tes yeux aux hurlements non corrompus… ») : le "
        "poète demande quelque chose à la morte.",
    ],
    lexique=[
        ["des morves", "sécrétions du nez. Mot volontairement laid, à côté du mot « poème »."],
        ["navrée", "profondément attristée. Le mot est fort en français classique."],
        ["un harpon", "arme de jet à pointe crochue, employée pour la pêche."],
        ["écorché vif", "à qui l'on a arraché la peau. Se dit d'une personne très sensible."],
        ["osseux", "fait d'os. Ici, ce sont les souvenirs qui le sont."],
        ["rougeoyer", "briller d'une lueur rouge."],
        ["en rut", "en chaleur, en état d'excitation animale."],
        ["amères", "au goût d'amertume ; ici, tristes."],
        ["le Goethe Institut", "centre culturel allemand. Henrike Grohs dirigeait celui "
                               "d'Abidjan."],
        ["le Plateau", "quartier des affaires d'Abidjan, où se trouve une grande mosquée."],
        ["surplomber", "dominer, se trouver au-dessus."],
        ["sans frein", "que rien n'arrête."],
        ["retrousser", "relever, remonter. Ici : faire remonter un souvenir."],
        ["corrompu", "gâté, perverti. « des hurlements non corrompus » : des cris restés "
                     "purs."],
        ["réconciliateur", "qui remet en paix ceux qui étaient ennemis."],
    ],
    axes=[
        ("Un poème qui s'enfonce au lieu d'exploser",
         [
             "**Le verbe « s'enfoncer » revient trois fois** en quelques vers : le poème "
             "« s'enfoncera aux chemins rompus », « s'enfoncera comme un harpon », et le "
             "poète « enfonce au plus profond de [lui] les souvenirs osseux ». Le mouvement "
             "du texte est vers le bas.",
             "**Il s'oppose au mouvement des bombes.** Une explosion projette vers le haut "
             "et vers l'extérieur ; le poème, lui, descend et rentre. Cette opposition n'est "
             "jamais formulée : elle est portée par les verbes.",
             "**Le harpon.** « s'enfoncera comme un harpon dans la colère des dynamites qui "
             "s'agitent dans les sourates d'Oussama ». Un harpon sert à prendre une bête "
             "dans l'eau. Le poème se donne donc pour une arme — mais une arme qui ramène "
             "quelque chose, au lieu de détruire.",
             "**Le mot laid à côté du mot noble.** « mon poème enflera de morves ». Le poème "
             "n'est pas décrit comme beau : il est enflé, malade, « écorché vif ». N'koumo "
             "refuse au poème toute élégance dans ce passage, parce qu'il vient de traverser "
             "l'horreur.",
         ]),
        ("Un souvenir ordinaire, et une mosquée bleue",
         [
             "**Le retour du passé heureux.** « et tu me parles du dernier spectacle au "
             "Goethe Institut et tu m'ouvres à ton appartement et tu me montres ton "
             "balcon ». Rien d'extraordinaire : une conversation entre amis. C'est "
             "précisément cette banalité qui rend le passage insoutenable.",
             "**Le détail décisif.** Depuis ce balcon, on voit « la mosquée du Plateau », et "
             "les mots d'Henrike « dansent pour cette mosquée si belle et si bleue ». Une "
             "Allemande, directrice d'un centre culturel, admire une mosquée d'Abidjan — et "
             "elle sera tuée au nom de l'islam. Le poème n'ajoute aucun commentaire : le "
             "fait suffit.",
             "**La répétition qui fond les deux.** « si belle et si bleue », puis « si toi "
             "et si bleue ». Le second groupe remplace « belle » par « toi » : Henrike et la "
             "mosquée deviennent un seul objet d'admiration. C'est la réponse la plus forte "
             "du livre à ceux qui prétendent tuer pour une religion.",
             "**Le rire, deux fois.** « ton rire sans frein », « ton rire si long sur le "
             "sable si fin ». Le rire est ce que le poème sauve. Il reviendra à la fin du "
             "livre : « férocement mêlés comme nos éclats de rires ».",
         ]),
        ("« je suis en toi » — une présence gagnée sur la mort",
         [
             "**La formule revient quatre fois** en quatre vers : « je suis bien en toi », "
             "« je suis en toi pour retrousser ta mémoire », « et je suis en toi », « en toi "
             "pour t'offrir le verre bleu de mon âme ». La répétition n'apporte aucune "
             "information nouvelle : elle installe une présence.",
             "**Le prénom coupe encore le vers.** « et tu sais que je suis bien en toi / "
             "Henrike / pour rallumer les bougies de tes yeux ». Comme à la fiche 3, le "
             "prénom est posé seul. Il arrête la phrase et oblige à s'arrêter avec elle.",
             "**« rallumer les bougies de tes yeux ».** Les bougies s'allument pour les "
             "morts ; les yeux s'éteignent quand on meurt. L'image rassemble les deux : le "
             "poème prétend faire pour Henrike ce que la mort a défait.",
             "**Une demande adressée à la morte.** « offre donc tes yeux aux hurlements non "
             "corrompus et à tous les souffles réconciliateurs du monde ». Le poème ne se "
             "contente pas de pleurer : il demande. C'est le premier impératif adressé à "
             "Henrike, et il annonce ceux de la dernière page.",
         ]),
    ],
    forme=[
        "**Le futur et le présent mêlés.** « mon poème enflera », « il maudira » — puis "
        "« tu me regardes », « je tiens toujours ta main ». Le poème passe de ce qu'il fera "
        "à ce qui a eu lieu, sans transition : c'est ainsi que fonctionne un souvenir.",
        "**Le rejet.** « j'ai offert des roses aux chemins / ensanglantés » ; « dans la "
        "déchirure de mes lèvres / si fontaines ». Le mot rejeté au vers suivant est mis en "
        "valeur par la coupure. Ici, il retourne chaque fois l'image qui précède.",
        "**L'anaphore.** « et je suis en toi », trois fois, puis « en toi » seul. La reprise "
        "se resserre : la phrase perd des mots à mesure qu'elle se répète.",
        "**Les vers très courts.** « et la mort », « qui s'offre une poitrine », « si "
        "fontaines ». Dans un texte fait de versets, ces vers d'un souffle produisent un "
        "arrêt brutal.",
        "**L'apostrophe.** « Henrike », posé seul, revient deux fois dans l'extrait. C'est "
        "le seul mot du poème qui ne soit jamais suivi d'autre chose.",
    ],
    plan=[
        ("Introduction",
         "Aux deux tiers de Poèmes sauvages éclairés au feu de brousse, le poème d'Henri "
         "N'koumo cesse un instant d'accuser et se retourne vers le passé. Il fait revivre "
         "une conversation ordinaire entre deux amis, sur un balcon d'Abidjan, devant une "
         "mosquée. On montrera comment ce souvenir banal constitue la réponse la plus forte "
         "du livre à ceux qui ont tué au nom d'une religion."),
        ("I. Un poème qui s'enfonce",
         [
             "A. Le verbe « s'enfoncer », répété : un mouvement vers le bas.",
             "B. L'opposition muette avec le mouvement des bombes.",
             "C. Un poème « écorché vif », qui refuse d'être beau.",
         ]),
        ("II. Un souvenir ordinaire",
         [
             "A. Un spectacle, un appartement, un balcon : la banalité du bonheur.",
             "B. La mosquée « si belle et si bleue », admirée par celle qu'on tuera.",
             "C. « si toi et si bleue » : la reprise qui confond l'amie et le monument.",
         ]),
        ("III. Une présence gagnée sur la mort",
         [
             "A. « je suis en toi », quatre fois : la répétition comme installation.",
             "B. « rallumer les bougies de tes yeux » : défaire ce que la mort a fait.",
             "C. Le premier impératif adressé à la morte.",
         ]),
        ("Conclusion",
         "Ce passage est le cœur secret du livre. Il ne contient ni accusation ni argument : "
         "il montre une femme qui trouve une mosquée belle. Le poème obtient par là ce "
         "qu'aucun discours n'obtiendrait — et il prépare le renversement des dernières "
         "pages, où le deuil deviendra promesse."),
    ],
    comprendre=[
        "Quel souvenir le poète fait-il revivre dans ce passage ? Où se passe la scène ?",
        "Que regarde-t-on depuis le balcon ? Qu'en dit Henrike ?",
        "Quelle demande le poète adresse-t-il à son amie, à la fin de l'extrait ?",
    ],
    analyser=[
        "a) Relevez les trois emplois du verbe « s'enfoncer ». b) Quel mouvement décrivent-"
        "ils ? c) À quel autre mouvement s'opposent-ils, dans un livre qui parle de "
        "bombes ?",
        "« cette mosquée si belle et si bleue », puis « cette mosquée si toi et si bleue ». "
        "a) Quel mot a été remplacé ? b) Par quoi ? c) Que produit ce remplacement ?",
        "a) Comptez les occurrences de « en toi ». b) Que remarque-t-on sur la longueur des "
        "groupes à mesure qu'ils se répètent ? c) Quel effet cela produit-il ?",
    ],
    parcours1=[
        "a) Relevez tout ce que le poème rapporte du souvenir d'Henrike : lieux, gestes, "
        "paroles.",
        "b) En une phrase, dites ce que ces détails ont en commun.",
    ],
    parcours2=[
        "a) Montrez que le passage constitue une réponse aux assassins, alors qu'il ne leur "
        "adresse pas un seul mot.",
        "b) Expliquez pourquoi un souvenir peut être plus efficace qu'une accusation.",
    ],
    synthese="Pourquoi le poète choisit-il de faire revivre une conversation banale, plutôt "
             "que de célébrer les qualités de son amie ?",
    examen="**Vers le commentaire composé.** Rédigez entièrement l'axe II du plan "
           "ci-dessus, en trois paragraphes. Vous citerez au moins une fois le vers de la "
           "mosquée en entier.",
    ouverture="À rapprocher de la fiche 6 : le rire sauvé ici reviendra à la dernière page, "
              "et la demande adressée à la morte y deviendra un appel répété.",
    encadres=[
        ("methode", "Analyser un rejet", [
            "Il y a rejet quand une phrase déborde sur le vers suivant, et que le mot "
            "rejeté prend, de ce fait, un relief particulier.",
            "- **Citez en marquant la coupure** par une barre oblique : « j'ai offert des "
            "roses aux chemins / ensanglantés ».",
            "- **Dites ce que le lecteur croit avant la coupure.** Ici : des roses offertes "
            "à des chemins, image paisible.",
            "- **Dites ce que la coupure révèle.** Le mot « ensanglantés » arrive après, et "
            "retourne l'image entière.",
            "Un rejet seulement nommé, sans ces trois gestes, ne rapporte aucun point.",
        ]),
        ("saviez", "Henrike Grohs", [
            "Henrike Grohs dirigeait le Goethe Institut d'Abidjan, le centre culturel "
            "allemand en Côte d'Ivoire. Elle était une figure familière du milieu artistique "
            "ivoirien, et une amie de l'auteur.",
            "Elle a été tuée le 13 mars 2016 à Grand-Bassam. Le poème lui est dédié en ces "
            "termes : « Pour Henrike Grohs, l'amie cousue à la mort le 13 mars 2016, lors "
            "des attentats terroristes qui ont endeuillé la ville de Grand-Bassam ».",
        ]),
    ],
)


# ═════════════════════════════════════════════════════════════ FICHE 5
F5 = dict(
    titre="Fiche 5 — « et nous ne serons plus » : une liste retournée",
    repere=X.REPERES["S5"],
    extrait=X.S5,
    source=X.REFERENCES["S5"],
    disposition="vers",
    objectif="Étudier le renversement final du poème, et comprendre comment un même "
             "procédé — l'énumération de villes — peut servir deux fois en sens contraire.",
    situation=(
        "Nous sommes dans les dernières pages. Le deuil a été dit, la colère aussi, le "
        "souvenir heureux est revenu. Le poème passe maintenant au futur, et il reprend, "
        "pour la retourner, la liste des villes frappées qu'il avait donnée au tiers du "
        "livre."
    ),
    mouvements=[
        "**La parole comme abri** (« car ma parole est nid d'oiseaux… ») : deux métaphores "
        "en une phrase.",
        "**La liste niée** (« et nous ne serons plus Maïduguri plus Grand-Bassam… ») : les "
        "mêmes villes, précédées d'une négation.",
        "**Les promesses** (« et nous éteindrons… et le soleil… et en avant toutes… ») : la "
        "litanie des futurs.",
        "**Le pardon** (« et je rendrai au juge de paix les muscles de ma voix sauvage… ») : "
        "le « je » revient, pour renoncer.",
        "**La fraternité** (« et nous serons tous les fils d'un même Dieu… ») : la promesse "
        "finale.",
    ],
    lexique=[
        ["un nid", "abri que l'oiseau construit pour ses petits."],
        ["un tourment", "grande souffrance."],
        ["un lieu de culte", "église, mosquée, temple : lieu où l'on prie."],
        ["vendanger", "récolter le raisin. Ici, au figuré : recueillir."],
        ["le levain", "ce qui fait lever la pâte à pain."],
        ["la repentance", "le regret d'une faute, et la volonté de la réparer."],
        ["une natte", "tapis tressé sur lequel on s'assoit ou l'on prie."],
        ["aphone", "qui n'a plus de voix."],
        ["millénaire", "vieux de mille ans. « les livres millénaires » : les textes "
                       "sacrés."],
        ["un juge de paix", "magistrat qui règle les petits litiges, et cherche l'accord "
                            "plutôt que la condamnation."],
        ["à perte de vue", "aussi loin qu'on peut voir."],
        ["un chapelet", "collier de grains que l'on égrène en priant."],
        ["bruire", "faire un bruit léger et continu."],
        ["dompté", "maîtrisé, apprivoisé."],
        ["giboyeux", "riche en gibier. « la giboyeuse lumière » : une lumière abondante."],
    ],
    axes=[
        ("La même liste, retournée par une négation",
         [
             "**Les villes reviennent.** « et nous ne serons plus Maïduguri plus "
             "Grand-Bassam plus Bamako plus Le Caire Kaboul Niamey Bamako Bruxelles / plus "
             "Paris plus Londres ni Tombouctou ni Garissa ni Barcelone ni et ni et ni ». Ce "
             "sont, pour l'essentiel, les mêmes noms qu'au tiers du livre.",
             "**Le procédé est identique, l'effet est inverse.** La première liste disait où "
             "l'on avait frappé ; celle-ci dit ce qu'on ne sera plus. Un poète qui reprend "
             "son propre procédé pour l'inverser fait plus qu'un effet de style : il montre "
             "que le monde peut changer sans changer de mots.",
             "**Les villes deviennent des attributs.** « nous ne serons plus Maïduguri ». La "
             "construction est étrange : on n'est pas une ville. Elle signifie qu'un nom de "
             "ville est devenu le nom d'un massacre — et que le poème refuse cet état.",
             "**La liste se défait toute seule.** Elle s'achève sur « ni et ni et ni » : "
             "trois mots vides, sans nom derrière. La liste s'épuise au lieu de se terminer, "
             "comme si les noms manquaient enfin.",
         ]),
        ("Une litanie de futurs",
         [
             "**Le temps change.** Les dix premières pages du livre étaient au présent ; "
             "cet extrait est presque entièrement au futur : « nous éteindrons », « nos voix "
             "n'iront point », « le soleil viendra », « nos frères poseront », « nous "
             "conduirons nos pas », « je rendrai », « nous marcherons », « nous serons », "
             "« nous ouvrirons », « nous enseignerons ».",
             "**Onze vers sur dix-sept commencent par « et ».** Le même mot qui relançait la "
             "plainte relance maintenant la promesse. C'est encore un procédé retourné.",
             "**« et nous serons », trois fois.** La formule est une litanie, c'est-à-dire "
             "une suite de phrases répétées comme une prière. Le poème emprunte la forme de "
             "la prière à ceux-là mêmes qu'il combat.",
             "**Les promesses sont concrètes.** Il ne s'agit pas d'idées mais de gestes : "
             "des bras ouverts, une natte, des mains, des parfums, des pieds collés à la "
             "terre. Le futur de N'koumo est un futur de corps.",
         ]),
        ("Le pardon, et la voix sauvage rendue",
         [
             "**Le « je » revient une dernière fois.** « et je rendrai au juge de paix les "
             "muscles de ma voix sauvage et j'asseoirai sur une natte la nouvelle mémoire de "
             "mes genoux et je serai fait de pardon à perte de vue. »",
             "**Le mot du titre est là.** « ma voix sauvage » : c'est l'adjectif du titre, "
             "*Poèmes sauvages*. Le poète promet de rendre cette voix, c'est-à-dire de la "
             "déposer. Le livre annonce donc sa propre fin comme un désarmement.",
             "**« au juge de paix ».** On ne rend pas une arme à un juge de paix, qui "
             "cherche l'accord plutôt que la condamnation. Le choix du magistrat est une "
             "prise de position : le poème ne demande pas justice, il demande la paix.",
             "**La fraternité est nommée sans naïveté.** « nous serons tous les fils d'un "
             "même Dieu descendu à nos côtés » ; « notre fraternité sans frontières "
             "s'endormira calme et paisible ». Mais le même passage traite les kamikazes "
             "d'« assassins des livres millénaires » : le pardon promis ne dispense pas de "
             "nommer la faute.",
         ]),
    ],
    forme=[
        "**La métaphore.** « ma parole est nid d'oiseaux », « est arbre pour accueillir le "
        "sourire de tous les futurs ». Deux métaphores sans article — « est nid », « est "
        "arbre » — ce qui les rend plus abruptes, comme des définitions.",
        "**L'anaphore.** Onze vers sur dix-sept ouverts par « et » ; « et nous serons » trois "
        "fois ; « plus… plus… plus… ni… ni… ni ».",
        "**La négation.** « ne serons plus », « n'iront point », « n'égorgera plus », « ne "
        "boira plus ». Le futur de ce passage est un futur négatif : il dit d'abord ce qui "
        "cessera.",
        "**L'apostrophe.** « ô assassins des livres millénaires ». La seule interpellation "
        "directe des coupables dans tout l'extrait, jetée au milieu d'une phrase de paix.",
        "**Le vers isolé.** « Henrike », encore une fois seul entre « et nous marcherons » "
        "et « férocement mêlés comme nos éclats de rires ». Le prénom coupe la phrase pour "
        "la troisième fois du cahier.",
    ],
    plan=[
        ("Introduction",
         "Dans les dernières pages de Poèmes sauvages éclairés au feu de brousse, Henri "
         "N'koumo reprend la liste de villes qu'il avait donnée au tiers du livre, et la "
         "fait précéder d'une négation. Le poème passe au futur et devient une suite de "
         "promesses. On montrera comment ce passage retourne, un à un, les procédés de la "
         "première partie du livre, et fait du deuil une espérance sans effacer la faute."),
        ("I. Une énumération employée à l'envers",
         [
             "A. Les mêmes villes, précédées de « nous ne serons plus ».",
             "B. Un nom de ville devenu le nom d'un massacre, et refusé comme tel.",
             "C. « ni et ni et ni » : une liste qui s'épuise au lieu de finir.",
         ]),
        ("II. Une litanie de futurs",
         [
             "A. Le présent du deuil remplacé par le futur de la promesse.",
             "B. « et nous serons », trois fois : la forme de la prière.",
             "C. Des promesses de gestes, non d'idées.",
         ]),
        ("III. Un désarmement",
         [
             "A. « je rendrai au juge de paix les muscles de ma voix sauvage ».",
             "B. L'adjectif du titre déposé : le livre annonce sa propre fin.",
             "C. Un pardon qui n'efface pas l'accusation.",
         ]),
        ("Conclusion",
         "Le poème se referme sur ce qu'il avait ouvert : la même liste, le même « et », la "
         "même voix. Rien n'a été remplacé ; tout a changé de signe. C'est la démonstration "
         "la plus claire de ce que peut la poésie — non pas décrire un monde meilleur, mais "
         "retourner les mots dont on disposait pour dire le pire."),
    ],
    comprendre=[
        "À quel temps la plupart des verbes sont-ils conjugués dans cet extrait ?",
        "Quelles villes le poème cite-t-il ? Où les avait-on déjà rencontrées ?",
        "Que promet le poète de rendre, et à qui ?",
    ],
    analyser=[
        "a) Relevez la liste de villes de cet extrait. b) Comparez-la à celle de la "
        "fiche 2. c) Qu'est-ce qui a changé, et qu'est-ce qui est resté identique ?",
        "a) Relevez tous les verbes au futur. b) Combien de vers commencent par « et » ? "
        "c) En quoi ce passage emprunte-t-il sa forme à la prière ?",
        "« et je rendrai au juge de paix les muscles de ma voix sauvage ». a) Quel mot du "
        "titre reconnaît-on ? b) Que signifie « rendre » une voix ? c) Pourquoi le poème "
        "choisit-il un juge de paix, et non un tribunal ?",
    ],
    parcours1=[
        "a) Relevez cinq promesses formulées au futur.",
        "b) Classez-les : lesquelles disent ce qui cessera, lesquelles disent ce qui "
        "commencera ?",
    ],
    parcours2=[
        "a) Montrez que ce passage reprend, pour les inverser, au moins trois procédés déjà "
        "rencontrés dans le livre.",
        "b) Expliquez ce que le poète gagne à réutiliser ses propres procédés plutôt qu'à en "
        "inventer de nouveaux.",
    ],
    synthese="Le pardon promis dans cet extrait vous paraît-il effacer l'accusation portée "
             "dans le reste du livre ?",
    examen="**Vers le commentaire composé.** Rédigez entièrement l'axe I du plan ci-dessus, "
           "en trois paragraphes. Vous mettrez en regard les deux listes de villes, celle "
           "de la fiche 2 et celle-ci.",
    ouverture="À rapprocher de la fiche 2 : la même liste y disait où l'on avait frappé. "
              "Le poème n'a pas changé de mots, il a changé de temps.",
    encadres=[
        ("astuce", "Comparer deux passages d'une même œuvre", [
            "C'est l'exercice le mieux noté, et le plus rare dans les copies. Trois "
            "gestes :",
            "- **Citer les deux passages**, brièvement, l'un après l'autre.",
            "- **Nommer ce qui est identique** : ici, la liste de villes, l'anaphore du "
            "« et », la longueur du verset.",
            "- **Nommer ce qui change** : ici, la négation, le temps verbal, le pronom "
            "sujet.",
            "Concluez toujours sur l'effet du retour, jamais sur le simple constat qu'il y a "
            "retour.",
        ]),
        ("vigilance", "Le pardon n'est pas l'oubli", [
            "Une copie mal conduite écrit : « à la fin, le poète pardonne et oublie ». "
            "C'est un contresens, et il se réfute par le texte lui-même.",
            "Dans le passage où le poète promet d'être « fait de pardon à perte de vue », il "
            "appelle aussi les kamikazes « assassins des livres millénaires » et dit que "
            "« leur coran aux lames pourpres » n'égorgera plus ses sommeils. Le pardon "
            "annoncé coexiste avec l'accusation maintenue. Un bon devoir tient les deux "
            "ensemble.",
        ]),
    ],
)


# ═════════════════════════════════════════════════════════════ FICHE 6
F6 = dict(
    titre="Fiche 6 — « viens » : la dernière page",
    repere=X.REPERES["S6"],
    extrait=X.S6,
    source=X.REFERENCES["S6"],
    disposition="vers",
    objectif="Étudier la clôture d'un poème de deuil, et comprendre pourquoi un livre né "
             "d'un attentat se termine par un impératif adressé à une morte.",
    situation=(
        "Ce sont les dernières pages du poème. Le renversement a eu lieu : le deuil est "
        "devenu promesse. Le texte s'adresse une dernière fois à Henrike, et ne lui dit "
        "plus qu'un mot, répété quatre fois : « viens »."
    ),
    mouvements=[
        "**« ce jour-là »** (deux fois) : le temps de la promesse, annoncé sans date.",
        "**Les retrouvailles** (« tu me verras dans ton jour couvert de roses blanches… ») : "
        "la scène rêvée.",
        "**La renaissance par le corps** (« et mes rêves rejailliront mûrs… ») : la vie "
        "revient par la faim, la sève, la gourmandise.",
        "**« viens donc »** puis **« viens », trois fois** : le poème cesse de raconter et "
        "appelle.",
        "**La résurrection** (« pour que tu ressuscites dans l'oiseau bleu… ») : le dernier "
        "vers de l'extrait referme le motif ouvert à la première page.",
    ],
    lexique=[
        ["prendre la clé des champs", "s'enfuir. Expression toute faite, prise ici au pied "
                                      "de la lettre."],
        ["poindre", "commencer à paraître."],
        ["une fusion", "le fait de se fondre, de ne plus faire qu'un."],
        ["la fougue", "élan violent et joyeux."],
        ["une falaise", "haute paroi de rocher au bord de la mer."],
        ["rejaillir", "jaillir de nouveau."],
        ["limpide", "parfaitement clair."],
        ["le pili-pili", "petit piment très fort, courant en Afrique."],
        ["la sève", "liquide qui monte dans les plantes et les fait vivre."],
        ["aigu", "pointu, perçant. « les flammes aigues » : les flammes pointues."],
        ["enlacer", "entourer de ses bras."],
        ["une corruption", "le fait de gâter, d'abîmer."],
        ["la bruyance", "mot rare : le fait de faire du bruit."],
        ["déraciner", "arracher avec les racines."],
        ["un roucoulement", "cri doux du pigeon et de la colombe."],
    ],
    axes=[
        ("Un futur sans date",
         [
             "**« ce jour-là », deux fois.** L'expression ouvre l'extrait et le relance "
             "quatre vers plus loin. Elle annonce un jour dont on ne dit ni quand il vient "
             "ni comment : c'est un jour promis, non prévu.",
             "**Tous les verbes sont au futur.** « ta peur n'aura pas de jambe », « tu me "
             "verras », « mon cœur te dévorera », « je lancerai », « mes rêves "
             "rejailliront », « nos forces renaîtront ». Le livre s'achève entièrement dans "
             "un temps qui n'est pas encore arrivé.",
             "**La peur perd son corps.** « ta peur n'aura pas de jambe pour prendre la clé "
             "des champs ». L'expression « prendre la clé des champs » signifie s'enfuir ; "
             "le poème la prend au pied de la lettre en donnant des jambes à la peur, puis "
             "les lui retire. La peur ne pourra plus fuir : elle sera immobilisée.",
             "**Le poème annonce sa propre disparition.** « le silence est en train de voler "
             "les mots fermant les matins où s'enracine mon poème ». Le texte dit qu'il "
             "s'achève, et il le dit dans ses derniers vers. C'est un adieu à double titre : "
             "à l'amie, et au livre.",
         ]),
        ("La vie qui revient par le corps",
         [
             "**Le vocabulaire est celui de la faim et de la sève.** « nos voix se vêtiront "
             "d'une faim immense », « d'une faim de grande gourmandise comme un soleil "
             "coléreux », « une lumière d'où remontera la sève ». La renaissance promise "
             "n'est pas spirituelle : elle est organique.",
             "**Les images sont volontairement crues.** Le pili-pili qui brûle, le rut des "
             "bonobos, les corps qui s'additionnent. N'koumo refuse d'adoucir la vie pour "
             "l'opposer à la mort : il l'oppose telle qu'elle est, animale et affamée.",
             "**C'est une réponse au reste du livre.** Les pages précédentes étaient pleines "
             "de corps morts, saignés, émiettés, « entre quatre bois ». Les dernières sont "
             "pleines de corps qui mangent, dansent et engendrent. Le renversement passe par "
             "le même terrain : le corps.",
             "**Le baobab.** « que nous dansions nos nuits dressées sous le baobab ». "
             "L'arbre est africain, il vit des siècles, et il abrite les assemblées. En un "
             "mot, le poème replace la scène finale chez lui.",
         ]),
        ("Un impératif, quatre fois",
         [
             "**« viens donc », puis « viens », « viens », « viens ».** Quatre vers de "
             "l'extrait commencent par ce verbe, et trois d'entre eux ne comportent rien "
             "d'autre. Un poème de quatre-vingt-douze pages se termine sur un mot d'une "
             "syllabe.",
             "**L'impératif est adressé à une morte.** C'est ce qui rend la fin bouleversante "
             "et non consolante : on ne commande pas à un mort de venir. Le poème le sait, "
             "et il appelle quand même.",
             "**Chaque « viens » est suivi d'une raison.** « que nous mourrions du même "
             "pleur », « que nous dansions nos nuits », « car ma colère a éteint ses lampes "
             "vives », « que nous déracinions nos nuits ». Le subjonctif — « que nous "
             "mourrions », « que nous dansions » — exprime le souhait, non le fait.",
             "**Le dernier mot est un oiseau.** « pour que tu ressuscites dans l'oiseau bleu "
             "au roucoulement des nouvelles saisons ». À la première page, les oiseaux "
             "avaient été remplacés dans le ciel par « des balles habillées d'ailes "
             "sombres ». Le livre se referme en leur rendant leur place.",
         ]),
    ],
    forme=[
        "**L'anaphore de l'impératif.** Quatre vers commencent par « viens ». Trois d'entre "
        "eux tiennent en un mot. Dans un poème fait de versets de plusieurs lignes, ces vers "
        "d'une syllabe sont l'effet le plus violent du livre.",
        "**Le subjonctif de souhait.** « que nous mourrions », « que nous dansions », « que "
        "nous portions », « que nous déracinions ». Ce mode dit ce que l'on souhaite, et non "
        "ce qui est.",
        "**La comparaison.** « comme la fougue des falaises », « comme des nuits de pleine "
        "lune », « comme un soleil coléreux ». Les comparants sont pris à la nature "
        "violente : le poème ne promet pas la douceur.",
        "**Le rejet.** « dans l'étroitesse de / nos croupes », « qui coupera / du tranchant "
        "de ses brûlures ». La phrase déborde sur le vers suivant et met le mot rejeté en "
        "relief.",
        "**Le retour des motifs.** L'oiseau, le feu, la nuit, le poème lui-même : les quatre "
        "images de la première page reviennent toutes dans les derniers vers, transformées. "
        "Une clôture réussie ne conclut pas : elle referme.",
    ],
    plan=[
        ("Introduction",
         "Poèmes sauvages éclairés au feu de brousse est né d'un attentat qui a tué "
         "dix-neuf personnes, dont l'amie à qui le livre est dédié. Il s'achève pourtant "
         "sur un mot d'une syllabe, répété quatre fois : « viens ». On montrera comment "
         "cette clôture transforme un tombeau en appel, et comment elle referme, un à un, "
         "les motifs ouverts à la première page."),
        ("I. Un jour promis, sans date",
         [
             "A. « ce jour-là », deux fois : un futur annoncé et jamais situé.",
             "B. Une expression toute faite prise au pied de la lettre : la peur privée de "
             "jambes.",
             "C. Le poème annonce sa propre fin dans ses derniers vers.",
         ]),
        ("II. Une renaissance organique",
         [
             "A. La faim, la sève, la gourmandise : le vocabulaire du vivant.",
             "B. Des images crues, opposées terme à terme aux corps morts du début.",
             "C. Le baobab : la scène finale replacée en Afrique.",
         ]),
        ("III. Un appel adressé à une morte",
         [
             "A. « viens », quatre fois, dont trois vers d'un seul mot.",
             "B. Le subjonctif de souhait : ce qui est demandé, non ce qui est.",
             "C. L'oiseau bleu du dernier vers, qui referme le motif ouvert à la première "
             "page.",
         ]),
        ("Conclusion",
         "Le livre ne se termine ni sur une consolation ni sur une leçon : il se termine "
         "sur un ordre impossible, adressé à quelqu'un qui ne peut plus l'entendre. C'est "
         "peut-être la définition la plus exacte de ce qu'est un poème de deuil — non pas "
         "ce qui répare, mais ce qui continue d'appeler."),
    ],
    comprendre=[
        "À quel temps le poème parle-t-il dans ce passage ?",
        "Quel mot est répété quatre fois ? À qui est-il adressé ?",
        "Sous quelle forme le poète espère-t-il que son amie revienne ?",
    ],
    analyser=[
        "a) Relevez les quatre vers commençant par « viens ». b) Combien de mots comportent-"
        "ils ? c) Quel effet produisent ces vers très courts dans un poème fait de versets ?",
        "a) Relevez les verbes au subjonctif. b) Que signifie ce mode ? c) Pourquoi "
        "convient-il mieux qu'un futur, dans les derniers vers ?",
        "« pour que tu ressuscites dans l'oiseau bleu au roucoulement des nouvelles "
        "saisons ». a) Où avait-on déjà rencontré des oiseaux dans le livre ? b) Que leur "
        "était-il arrivé ? c) Que produit leur retour à la dernière page ?",
    ],
    parcours1=[
        "a) Relevez tous les mots qui appartiennent au champ lexical de la nourriture et de "
        "la faim.",
        "b) En une phrase, dites à quoi ce champ lexical s'oppose dans le reste du livre.",
    ],
    parcours2=[
        "a) Montrez que les quatre motifs de la première page — l'oiseau, le feu, la nuit, "
        "le poème — reviennent tous dans cet extrait.",
        "b) Expliquez ce que le lecteur comprend grâce à ce retour, et qu'aucune phrase du "
        "livre ne lui dit.",
    ],
    synthese="Un poème né d'un attentat peut-il se terminer autrement que par un appel ?",
    examen="**Vers la dissertation.** « La poésie ne console de rien ; elle accompagne. » "
           "Cette affirmation vous paraît-elle vérifiée par la fin de ce poème ? Rédigez "
           "l'introduction et le plan détaillé en deux parties.",
    ouverture="À rapprocher de la fiche 1 : le livre s'ouvrait sur un ciel où les oiseaux "
              "avaient été remplacés par des balles. Il se ferme en leur rendant le ciel.",
    encadres=[
        ("vigilance", "Un texte adulte, à préparer avant la séance", [
            "Les dernières pages du poème emploient un vocabulaire du corps très direct : "
            "les croupes, les seins, le rut. Ce n'est pas de la provocation, et ce n'est pas "
            "détachable du sens : le livre oppose des corps vivants et affamés aux corps "
            "morts qu'il a décrits pendant quatre-vingts pages.",
            "L'extrait est celui que l'auteur lui-même propose dans son dossier pédagogique. "
            "Il se travaille donc en classe, mais il se prépare : annoncez le registre avant "
            "de lire, expliquez l'opposition vie/mort qui le commande, et coupez court à "
            "l'amusement en le nommant d'avance.",
        ]),
        ("methode", "Commenter une clôture", [
            "La fin d'une œuvre s'analyse presque toujours de la même façon. Trois "
            "questions, dans cet ordre :",
            "- **Qu'est-ce qui est refermé ?** Cherchez les motifs du début qui reviennent. "
            "Ici : l'oiseau, le feu, la nuit.",
            "- **Qu'est-ce qui a changé de valeur ?** Le même oiseau était mort, il est "
            "vivant. Le même feu brûlait, il éclaire.",
            "- **Qu'est-ce qui reste ouvert ?** Une bonne clôture ne règle pas tout. Ici, "
            "l'appel « viens » n'obtient aucune réponse.",
            "Trois lectures sont possibles d'une fin : la boucle (rien n'a bougé), la "
            "fatalité (tout recommence), la révélation (le même point, vu autrement). Dites "
            "laquelle vous retenez, et prouvez-la.",
        ]),
    ],
)

FICHES_SV_4_6 = [F4, F5, F6]
