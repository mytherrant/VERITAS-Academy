# -*- coding: utf-8 -*-
"""Lectures méthodiques 3 à 6 — « Au cœur des ténèbres », Joseph Conrad."""

SRC = ("Joseph Conrad, Au cœur des ténèbres (Heart of Darkness, 1899-1902), "
       "traduction française, édition numérique.")

# ═════════════════════════════════════════════════════════════ FICHE 3
F3_EXTRAIT = """« J'évitai un vaste trou que quelqu'un avait creusé sur la pente, et dont j'étais incapable de deviner l'objet. Ce n'était pas une carrière, ni une sablière, en tout cas. Ce n'était qu'un trou. Il se rattachait peut-être au désir philanthropique de donner aux criminels quelque chose à faire. Je ne sais pas. Puis je faillis tomber dans un ravin très étroit, à peine plus qu'une balafre au flanc de la colline. Je découvris qu'un tas de tuyaux de drainage destinés à l'établissement y avait été versé. Il n'y en avait pas un d'intact. C'était un massacre gratuit. À la fin j'arrivai sous les arbres. Mon idée était de marcher quelques instants à l'ombre ; mais je ne m'y trouvai pas plus tôt que je crus être entré dans le sombre cercle de quelque Enfer. Les rapides étaient proches et le bruit d'un flot ininterrompu, uniforme, précipité, emplissait l'immobilité lugubre du bosquet, où pas un souffle ne bougeait, pas une feuille ne s'agitait, d'un bruit mystérieux — comme si le mouvement furieux de la terre lancée était tout à coup devenu perceptible.
« Des formes noires étaient accroupies, prostrées, assises entre les arbres, appuyées aux troncs, cramponnées au sol, à demi surgissantes, à demi estompées dans l'obscure lumière, dans toutes les attitudes de la douleur, de l'abandon, du désespoir. Une autre mine explosa sur la falaise, suivie d'un léger frémissement du sol sous mes pieds. Le travail continuait. Le travail ! Et c'était ici le lieu où quelques-uns des auxiliaires s'étaient retirés pour mourir.
« Ils mouraient lentement — c'était bien clair. Ce n'étaient pas des ennemis, pas des criminels, ce n'était rien de terrestre maintenant — rien que des ombres noires de maladie et de famine, gisant confusément dans la pénombre verdâtre. Amenés de tous les recoins de la côte dans toutes les formes légales de contrats temporaires, perdus dans un milieu hostile, nourris d'aliments inconnus, ils tombaient malades, devenaient inutiles, et on leur permettait alors de se traîner à l'écart et de se reposer. Ces formes moribondes étaient libres comme l'air, et presque autant insubstantielles… Je commençai à distinguer la lueur des yeux sous les arbres. Puis abaissant mon regard je vis un visage près de ma main. La sombre ossature reposait tout de son long, une épaule contre l'arbre, et lentement les paupières se soulevèrent et les yeux creux se levèrent sur moi, énormes et vides, avec une espèce d'étincelle aveugle et blanche dans la profondeur des orbites, qui s'éteignit lentement. L'homme semblait jeune — presque un gamin — mais comme vous savez avec eux on ne peut pas dire. Je ne vis rien d'autre à faire que de lui offrir un des biscuits de marin de mon bon Suédois, que j'avais en poche. Ses doigts le serrèrent lentement et le gardèrent — il n'y eut pas d'autre mouvement ni d'autre regard. Il s'était attaché un bout de fil blanc autour du cou… Pourquoi ? Où l'avait-il trouvé ? Était-ce un insigne ? Un ornement ? Un grigris ? Un acte propitiatoire ? S'y rattachait-il une idée quelconque ? Cela surprenait autour de son cou noir, ce bout de coton blanc d'outre-mer. »"""

F3 = dict(
    titre="Fiche 3 — Le bosquet de la mort",
    repere="Chapitre I — le premier poste de la Compagnie",
    extrait=F3_EXTRAIT,
    source=SRC + " Chapitre I, la station du bas fleuve.",
    objectif="Étudier la page la plus directement accusatrice du récit, et analyser une "
             "écriture qui obtient l'indignation du lecteur en refusant de l'exprimer.",
    situation=(
        "Débarqué au premier poste de la Compagnie, Marlow traverse le chantier : un trou "
        "sans objet, des tuyaux brisés, une falaise qu'on fait sauter sans nécessité. Il "
        "entre alors sous les arbres pour chercher de l'ombre. Le passage est le cœur "
        "documentaire du livre — celui qui répond le plus directement à ce que Conrad avait "
        "vu au Congo en 1890."
    ),
    mouvements=[
        "**Premier axe — l'absurde** (« J'évitai un vaste trou… C'était un massacre "
        "gratuit. ») : trois exemples de travail sans objet.",
        "**Deuxième axe — l'entrée** (« À la fin j'arrivai sous les arbres… "
        "perceptible. ») : le passage de l'ombre cherchée à l'Enfer trouvé.",
        "**Troisième axe — les formes** (« Des formes noires étaient accroupies… "
        "s'étaient retirés pour mourir. ») : la description collective, puis la phrase qui "
        "nomme.",
        "**Quatrième axe — l'explication** (« Ils mouraient lentement… presque autant "
        "insubstantielles… ») : le mécanisme administratif exposé froidement.",
        "**Cinquième axe — un visage** (« Je commençai à distinguer la lueur des "
        "yeux… ce bout de coton blanc d'outre-mer. ») : le passage du collectif au singulier.",
    ],
    axes=[
        ("Un travail qui ne produit rien",
         [
             "**La série des inutilités** — un trou « dont j'étais incapable de deviner "
             "l'objet », des tuyaux de drainage tous brisés, une falaise qu'on dynamite sans "
             "raison. Trois exemples successifs installent le motif : ici, l'activité ne "
             "sert à rien. La colonisation est d'abord décrite comme un désordre, non comme "
             "une exploitation rationnelle.",
             "**« Ce n'était qu'un trou »** — la phrase, brève et tautologique, refuse "
             "l'explication. Conrad aurait pu faire de ce trou un symbole ; il le laisse "
             "vide, ce qui est plus efficace.",
             "**L'ironie sur la philanthropie** — « Il se rattachait peut-être au désir "
             "philanthropique de donner aux criminels quelque chose à faire. Je ne sais "
             "pas. » L'hypothèse est absurde, et l'aveu d'ignorance qui la suit la laisse "
             "en suspens. Le mot « philanthropique » appartient au vocabulaire officiel de "
             "l'entreprise coloniale : Conrad le place là où il ne peut désigner que le "
             "contraire de lui-même.",
             "**« C'était un massacre gratuit »** — l'expression, employée pour des tuyaux, "
             "annonce par déplacement ce qui va être décrit deux lignes plus loin. Le mot "
             "« massacre » est prononcé une première fois à propos d'objets, ce qui prépare "
             "le lecteur sans le prévenir.",
         ]),
        ("Une déshumanisation que la phrase enregistre",
         [
             "**« Des formes noires »** — le mot « formes » revient trois fois dans le "
             "passage (« formes noires », « formes moribondes »). Il refuse le nom "
             "d'« hommes » — non par mépris du narrateur, mais parce que le traitement subi "
             "les a effectivement défaits. C'est le système, non Marlow, qui a produit cette "
             "indistinction.",
             "**L'accumulation des postures** — « accroupies, prostrées, assises entre les "
             "arbres, appuyées aux troncs, cramponnées au sol, à demi surgissantes, à demi "
             "estompées ». Sept participes juxtaposés : la phrase ne parvient pas à fixer "
             "ces corps, comme le regard n'y parvient pas.",
             "**La triple négation** — « Ce n'étaient pas des ennemis, pas des criminels, ce "
             "n'était rien de terrestre maintenant ». Conrad procède par élimination des "
             "catégories disponibles : ces hommes n'entrent dans aucune. L'adverbe "
             "« maintenant » date leur sortie de l'humanité.",
             "**Le vocabulaire juridique** — « Amenés de tous les recoins de la côte dans "
             "toutes les formes légales de contrats temporaires ». La phrase la plus "
             "accablante du passage est aussi la plus administrative. Tout ce qui a conduit "
             "ces hommes à mourir sous ces arbres était légal, et le texte prend soin de le "
             "dire sans commentaire.",
             "**Le verbe « permettait »** — « on leur permettait alors de se traîner à "
             "l'écart et de se reposer ». Le verbe de la faveur employé pour l'abandon : "
             "l'euphémisme est le procédé même du discours qu'il dénonce.",
         ]),
        ("Le passage au singulier, ou le refus du symbole",
         [
             "**Un visage près de la main** — après trois paragraphes collectifs, un seul "
             "homme. La construction du passage est celle d'un travelling qui se resserre, "
             "de la colline au bosquet, du bosquet au groupe, du groupe à un visage.",
             "**L'étincelle qui s'éteint** — « une espèce d'étincelle aveugle et blanche "
             "dans la profondeur des orbites, qui s'éteignit lentement ». Une mort est "
             "décrite en une proposition relative, sans que le mot soit prononcé.",
             "**Le biscuit** — « Je ne vis rien d'autre à faire que de lui offrir un des "
             "biscuits de marin de mon bon Suédois. » Le geste est dérisoire et Marlow le "
             "sait : la tournure « je ne vis rien d'autre à faire » avoue l'impuissance. "
             "Conrad refuse à son personnage toute posture de sauveur.",
             "**Le fil blanc et les cinq questions** — « Pourquoi ? Où l'avait-il trouvé ? "
             "Était-ce un insigne ? Un ornement ? Un grigris ? Un acte propitiatoire ? "
             "S'y rattachait-il une idée quelconque ? » Six interrogations sans réponse. "
             "Marlow ne comprend pas, et le texte ne comble pas ce vide. C'est le refus le "
             "plus net du livre : ces hommes ont une vie intérieure à laquelle le narrateur "
             "n'a pas accès, et il ne l'invente pas.",
             "**« ce bout de coton blanc d'outre-mer »** — l'objet européen au cou d'un "
             "mourant africain referme le passage sur l'image même de la rencontre "
             "coloniale : quelque chose est venu d'ailleurs, s'est attaché là, et personne "
             "ne sait dire ce que cela signifie.",
         ]),
    ],
    forme=[
        "**L'alternance des rythmes** — de très longues phrases descriptives coupées par "
        "des propositions de trois mots (« Le travail ! », « C'était un massacre gratuit. »). "
        "Les brèves fonctionnent comme des constats.",
        "**L'accumulation de participes** — sept dans une seule phrase, sans coordination. "
        "La juxtaposition produit un effet d'entassement.",
        "**La litote et l'euphémisme** — « on leur permettait de se reposer », « devenaient "
        "inutiles ». Le texte emprunte la langue de l'administration pour en montrer la "
        "monstruosité.",
        "**L'interrogation en série** — six questions consécutives, toutes sans réponse. "
        "Elles marquent la limite du savoir du narrateur.",
        "**La comparaison infernale** — « je crus être entré dans le sombre cercle de "
        "quelque Enfer ». L'allusion à Dante est discrète (« cercle »), et elle situe la "
        "scène dans un ordre littéraire plutôt que documentaire.",
    ],
    plan=[
        ("Introduction",
         "Cherchant un peu d'ombre au premier poste de la Compagnie, Marlow entre sous les "
         "arbres et y découvre les hommes que le chantier a usés jusqu'à la mort. On "
         "montrera comment Conrad construit la page la plus accusatrice de son récit en "
         "s'interdisant toute indignation déclarée, et pourquoi il refuse jusqu'au bout de "
         "prêter une pensée à ceux qu'il décrit."),
        ("I. Un chantier qui ne produit rien",
         [
             "A. Trois inutilités successives : le trou, les tuyaux, la mine.",
             "B. Le mot « philanthropique » retourné contre lui-même.",
             "C. « C'était un massacre gratuit » : le mot lâché d'abord à propos d'objets.",
         ]),
        ("II. Une déshumanisation enregistrée par la phrase",
         [
             "A. « des formes noires » : le refus du mot « hommes », et sa raison.",
             "B. Sept participes juxtaposés : un regard qui ne peut pas fixer.",
             "C. « toutes les formes légales de contrats temporaires » : l'accusation en "
             "langue administrative.",
         ]),
        ("III. Un visage, et six questions sans réponse",
         [
             "A. Le resserrement du regard, de la colline à une main.",
             "B. Le biscuit : un geste dérisoire que le texte ne valorise pas.",
             "C. Le fil blanc : Conrad refuse d'inventer la pensée de l'autre.",
         ]),
        ("Conclusion",
         "Cette page ne comporte ni exclamation ni jugement : un trou, des tuyaux, des "
         "formes, un visage, un fil de coton. C'est de cette retenue que naît sa force. "
         "Le livre entier fonctionnera ainsi — en montrant ce que le discours officiel "
         "recouvre, sans jamais élever la voix."),
    ],
    comprendre=[
        "Que cherche Marlow en entrant sous les arbres ? Que trouve-t-il ?",
        "Pourquoi ces hommes se trouvent-ils là ? Relevez la phrase qui l'explique.",
        "Que fait Marlow pour le jeune homme qu'il aperçoit ? Ce geste sert-il à quelque "
        "chose ?",
    ],
    analyser=[
        "a) Relevez les trois exemples de travail inutile du premier axe. b) Que "
        "produit leur accumulation sur l'image de l'entreprise coloniale ?",
        "Étudiez la phrase « Amenés de tous les recoins de la côte dans toutes les formes "
        "légales de contrats temporaires… ». a) Relevez le vocabulaire juridique. b) Pourquoi "
        "ce vocabulaire rend-il l'accusation plus forte qu'une indignation explicite ?",
        "Relevez les six questions du dernier axe. Reçoivent-elles une réponse ? Que "
        "signifie ce silence ?",
    ],
    parcours1=[
        "a) Relevez tous les mots employés pour désigner les hommes du bosquet.",
        "b) Montrez qu'aucun ne les nomme comme des personnes, et dites qui est responsable "
        "de cet état.",
    ],
    parcours2=[
        "a) Étudiez la composition du passage : sur quoi le regard s'arrête-t-il "
        "successivement ?",
        "b) Montrez que ce mouvement va du plus vaste au plus intime, et dites ce que cette "
        "construction produit sur le lecteur.",
    ],
    synthese="Pourquoi Conrad ne fait-il jamais parler les hommes du bosquet ? Cette "
             "absence est-elle une limite du livre ou un choix ?",
    examen="**Vers le commentaire composé.** Faites le commentaire composé du quatrième "
           "mouvement (« Ils mouraient lentement… insubstantielles… ») en montrant comment "
           "une langue administrative peut constituer un réquisitoire.",
    ouverture="À rapprocher de la fiche 2 : ces hommes ont été recrutés dans les bureaux "
              "gardés par les deux tricoteuses.",
    encadres=[
        ("methode", "Commenter une page sans indignation déclarée", [
            "Les textes les plus accusateurs sont souvent les plus neutres. Trois prises "
            "pour les analyser :",
            "- **Chercher l'euphémisme.** Un mot doux pour une chose atroce : « se "
            "reposer » pour agoniser, « devenaient inutiles » pour mouraient. Signalez "
            "toujours l'écart entre le mot et la chose.",
            "- **Chercher le vocabulaire d'emprunt.** Juridique, administratif, "
            "commercial. Il donne à l'horreur l'apparence de la procédure.",
            "- **Chercher ce que le narrateur ne dit pas.** Ici, il ne condamne personne et "
            "ne prête aucune pensée aux mourants. C'est ce refus qui laisse au lecteur la "
            "place de juger.",
            "**Formule utilisable** : « le narrateur s'abstient de tout commentaire, et "
            "c'est cette abstention qui contraint le lecteur à formuler lui-même le "
            "jugement que le texte lui refuse. »",
        ]),
        ("vigilance", "Un texte qui a été discuté", [
            "Au cœur des ténèbres est, depuis 1975, l'objet d'un débat critique important, "
            "ouvert par l'écrivain nigérian Chinua Achebe, qui reprochait au récit de faire "
            "de l'Afrique un décor et de ne jamais donner la parole aux Africains.",
            "Le débat est légitime et il est utile en classe. Deux précautions cependant : "
            "d'abord, il porte sur ce que le livre ne fait pas, non sur ce qu'il fait — la "
            "dénonciation des violences y est réelle et précise ; ensuite, un devoir doit "
            "distinguer ce que dit Marlow, ce que montre le récit, et ce que le lecteur "
            "d'aujourd'hui peut y reprocher. Confondre les trois niveaux est l'erreur "
            "la plus commune.",
        ]),
    ],
)


# ═════════════════════════════════════════════════════════════ FICHE 4
F4_EXTRAIT = """Je le regardai, perdu d'étonnement. Il était là devant moi, bariolé, comme s'il s'était échappé d'une troupe de mimes, enthousiaste, fabuleux. Son existence même était improbable, inexplicable, tout à fait déconcertante. Il était un problème insoluble. Comment il avait subsisté, on n'arrivait pas à l'imaginer ; comment il avait réussi à arriver jusque-là, comment il avait trouvé moyen d'y rester, comment il ne disparaissait pas instantanément. « J'ai été un peu plus loin », dit-il, « puis encore un peu plus loin — jusqu'à ce que je sois allé si loin que je ne sais comment je retournerai jamais. N'importe. Rien ne presse. Je peux me débrouiller. Emmenez Kurtz, vite — vite, je vous le dis. » Une magie de jeunesse enveloppait ses haillons multicolores, sa misère, sa solitude, l'essentielle désolation de ses futiles vagabondages. Des mois, des années durant, on ne lui aurait pas donné un jour à vivre ; et il était là vivant, vaillant et sans souci, selon toute apparence indestructible par la seule vertu de son peu d'années et de son audace étourdie. J'étais conquis jusqu'à éprouver une sorte d'admiration — d'envie. Une magie le poussait, une magie le gardait invulnérable. À coup sûr il ne voulait rien de la brousse que l'espace de respirer et de passer outre. Son besoin, c'était d'exister, et d'aller de l'avant au plus grand risque possible et avec un maximum de privations. Si la pureté absolue, sans calcul, sans côté pratique, de l'esprit d'aventure avait jamais gouverné un être humain, c'était ce garçon rapiécé. Je lui enviais presque la possession de cette modeste et claire flamme. Elle semblait avoir consumé toute pensée égoïste si complètement qu'alors même qu'il vous parlait, on oubliait que c'était lui, l'homme qui était là sous vos yeux, qui avait enduré tout cela. Je ne lui enviais pas son dévouement à Kurtz cependant. Il n'y avait pas réfléchi. Cela lui était venu et il l'acceptait avec une sorte d'avidité fataliste. Je dois dire que quant à moi cela me parut la chose la plus dangereuse de tout point de vue qu'il eût jamais rencontrée.
« Ils s'étaient rencontrés inévitablement, comme deux navires encalminés proches l'un de l'autre, qui se frottent enfin les flancs. Je suppose que Kurtz avait besoin d'un auditoire, puisque une certaine fois, campant dans la forêt, ils avaient causé toute la nuit, ou que, plus probablement, Kurtz avait causé. « Nous avons parlé de tout », dit-il, transporté à ce souvenir. « J'ai oublié que le sommeil existait. La nuit n'a pas semblé durer une heure. Tout ! Tout !… De l'amour, aussi. » « Ah, il vous a parlé d'amour ! » dis-je, fort amusé. « Ce n'est pas ce que vous imaginez », s'écria-t-il, presque avec passion. « C'était en général. Il m'a fait voir des choses — des choses. »
« Il leva les bras. Nous étions sur le pont à ce moment-là et le chef de mes coupeurs de bois, paressant tout auprès, tourna vers lui ses yeux lourds et brillants. Je regardai alentour, et, je ne sais pourquoi, je vous assure que jamais, jamais auparavant cette terre, ce fleuve, cette jungle, l'arche même de ce ciel enflammé, ne m'avaient paru si privés d'espoir, si sombres, si impénétrables à la pensée humaine, si impitoyables à la faiblesse humaine. »"""

F4 = dict(
    titre="Fiche 4 — L'arlequin russe",
    repere="Chapitre III — au poste de Kurtz",
    extrait=F4_EXTRAIT,
    source=SRC + " Chapitre III, la rencontre du jeune Russe.",
    objectif="Étudier un personnage secondaire qui sert de révélateur, et analyser comment "
             "l'admiration d'un disciple constitue la plus grave des accusations contre son "
             "maître.",
    situation=(
        "Parvenu au poste le plus reculé, Marlow y trouve un jeune Russe vêtu de haillons "
        "rapiécés de toutes les couleurs, seul compagnon de Kurtz. Ce personnage — que la "
        "critique appelle l'arlequin — est le dernier témoin avant la rencontre du "
        "protagoniste. Sa fonction est de préparer Kurtz en le racontant, et de mesurer, "
        "par son propre enthousiasme, ce qu'il y a d'irrésistible et de destructeur dans "
        "cette éloquence."
    ),
    mouvements=[
        "**Premier axe — le portrait** (« Je le regardai, perdu d'étonnement… "
        "vite, je vous le dis. ») : l'apparition, l'invraisemblance, la parole du jeune "
        "homme.",
        "**Deuxième axe — l'admiration de Marlow** (« Une magie de jeunesse… ce "
        "garçon rapiécé. ») : l'éloge de l'esprit d'aventure pur.",
        "**Troisième axe — la réserve** (« Je lui enviais presque… qu'il eût jamais "
        "rencontrée. ») : le retournement, sur le dévouement à Kurtz.",
        "**Quatrième axe — la nuit de parole** (« Ils s'étaient rencontrés "
        "inévitablement… des choses. ») : le récit de la rencontre avec Kurtz.",
        "**Cinquième axe — le paysage** (« Il leva les bras… si impitoyables à la "
        "faiblesse humaine. ») : la réaction de Marlow, reportée sur le décor.",
    ],
    axes=[
        ("Un personnage impossible",
         [
             "**Le costume** — « bariolé, comme s'il s'était échappé d'une troupe de "
             "mimes », « ses haillons multicolores », « ce garçon rapiécé ». Le personnage "
             "est identifié par ses vêtements avant de l'être par son nom — qu'il n'aura "
             "d'ailleurs jamais. Il est l'Arlequin, figure de la comédie italienne, égarée "
             "au fond de l'Afrique.",
             "**L'accumulation des adjectifs d'invraisemblance** — « improbable, "
             "inexplicable, tout à fait déconcertante », « un problème insoluble ». Marlow "
             "renonce quatre fois de suite à comprendre. Le personnage est présenté comme "
             "une anomalie logique.",
             "**L'anaphore des « comment »** — « Comment il avait subsisté… comment il avait "
             "réussi à arriver jusque-là, comment il avait trouvé moyen d'y rester, comment "
             "il ne disparaissait pas instantanément. » Quatre interrogations indirectes "
             "sans réponse : la phrase mime l'échec de l'explication.",
             "**Sa manière de parler** — « J'ai été un peu plus loin, puis encore un peu "
             "plus loin — jusqu'à ce que je sois allé si loin que je ne sais comment je "
             "retournerai jamais. » La répétition du comparatif dit un mouvement sans "
             "projet ni terme. Le jeune homme n'est pas venu chercher quelque chose : il est "
             "allé.",
         ]),
        ("Une admiration soigneusement limitée",
         [
             "**L'éloge de la pureté** — « Si la pureté absolue, sans calcul, sans côté "
             "pratique, de l'esprit d'aventure avait jamais gouverné un être humain, c'était "
             "ce garçon rapiécé. » Marlow accorde au Russe ce qu'il refuse à tous les autres "
             "Européens du livre : le désintéressement. Face aux « pèlerins » qui ne pensent "
             "qu'à l'ivoire, ce vagabond ne veut rien.",
             "**La métaphore de la flamme** — « cette modeste et claire flamme. Elle "
             "semblait avoir consumé toute pensée égoïste ». L'image reprend le motif de la "
             "lumière posé dès l'ouverture (fiche 1), mais l'applique cette fois à un "
             "individu. La flamme est « modeste » : Conrad la distingue de l'embrasement "
             "que prétend être la civilisation.",
             "**Le retournement** — « Je ne lui enviais pas son dévouement à Kurtz "
             "cependant. » L'adverbe placé en fin de phrase suspend tout ce qui précède. "
             "L'éloge n'était qu'une préparation.",
             "**La sentence finale** — « cela me parut la chose la plus dangereuse de tout "
             "point de vue qu'il eût jamais rencontrée. » Le superlatif est massif : plus "
             "dangereux que la brousse, la maladie, la solitude, les mois sans vivres. "
             "Kurtz est désigné, avant d'apparaître, comme le seul vrai péril du livre.",
             "**« Il n'y avait pas réfléchi »** — la formule est décisive. Le dévouement du "
             "Russe n'est pas un choix mais un état, accepté « avec une sorte d'avidité "
             "fataliste ». Conrad décrit ici un phénomène d'emprise, et il le décrit "
             "cliniquement.",
         ]),
        ("La parole de Kurtz, rapportée et jamais citée",
         [
             "**La comparaison maritime** — « comme deux navires encalminés proches l'un de "
             "l'autre, qui se frottent enfin les flancs ». L'image dit l'inévitabilité sans "
             "volonté : deux corps immobiles que le courant rapproche. Conrad, ancien marin, "
             "tire ses comparaisons de son métier — procédé constant du livre.",
             "**La correction du narrateur** — « ils avaient causé toute la nuit, ou que, "
             "plus probablement, Kurtz avait causé. » L'incise rectifie sèchement : il n'y "
             "eut pas de conversation, mais un discours. Le rapport n'était pas d'échange "
             "mais de captation.",
             "**Le vide du contenu** — « Nous avons parlé de tout. […] Tout ! Tout !… De "
             "l'amour, aussi. » puis « Il m'a fait voir des choses — des choses. » Le "
             "disciple est incapable de rapporter une seule idée. L'éloquence de Kurtz a "
             "produit un effet total et un souvenir nul.",
             "**La stratégie de Conrad** — dans tout le livre, Kurtz est annoncé, décrit, "
             "commenté, mais ses discours ne sont presque jamais reproduits. Le romancier "
             "évite ainsi l'épreuve impossible d'écrire une éloquence géniale, et il obtient "
             "mieux : une parole dont on ne connaît que les effets.",
         ]),
        ("Le paysage qui répond",
         [
             "**Le décrochement** — après le dialogue, une phrase entière est consacrée au "
             "paysage. Rien ne l'appelait : c'est Marlow qui « regarde alentour » sans "
             "savoir pourquoi (« je ne sais pourquoi »).",
             "**Le quadruple parallélisme** — « si privés d'espoir, si sombres, si "
             "impénétrables à la pensée humaine, si impitoyables à la faiblesse humaine ». "
             "Quatre attributs introduits par le même adverbe, en gradation, et les deux "
             "derniers construits en symétrie exacte.",
             "**Le report de l'émotion** — Marlow ne dit pas ce qu'il éprouve : il décrit "
             "un ciel. Le procédé — faire porter au décor un sentiment que le personnage ne "
             "formule pas — est l'un des plus constants du récit, et il évite toute "
             "confidence.",
             "**Le témoin muet** — « le chef de mes coupeurs de bois, paressant tout auprès, "
             "tourna vers lui ses yeux lourds et brillants ». Un Africain regarde la scène. "
             "Il ne dit rien, et le texte ne dit pas ce qu'il pense. Ce regard, glissé sans "
             "commentaire, est l'un des rares moments où le livre signale sa propre limite.",
         ]),
    ],
    forme=[
        "**L'anaphore** — les quatre « comment », les quatre « si… ». La figure structure "
        "les deux moments forts de l'extrait.",
        "**L'adverbe en position finale** — « Je ne lui enviais pas son dévouement à Kurtz "
        "cependant. » Le rejet du connecteur à la fin retarde le renversement d'une phrase "
        "entière.",
        "**La comparaison technique** — empruntée à la marine, elle donne au récit son "
        "assise concrète et rappelle la profession du narrateur.",
        "**L'incise correctrice** — « ou que, plus probablement, Kurtz avait causé ». "
        "Le narrateur rectifie le témoignage qu'il rapporte : le lecteur est prévenu qu'il "
        "reçoit une parole filtrée.",
        "**La réticence** — « Il m'a fait voir des choses — des choses. » Le tiret et la "
        "répétition tiennent lieu de contenu. Conrad fait de l'indicible un procédé, et "
        "non un aveu d'impuissance.",
    ],
    plan=[
        ("Introduction",
         "Avant de rencontrer Kurtz, Marlow rencontre son unique disciple : un jeune Russe "
         "vêtu de haillons multicolores, seul survivant du poste le plus reculé. On montrera "
         "comment ce personnage improbable sert de révélateur, et comment son admiration "
         "sans réserve constitue, contre Kurtz, l'accusation la plus grave du livre."),
        ("I. Un personnage que le texte déclare impossible",
         [
             "A. L'Arlequin : un costume de comédie au fond de l'Afrique.",
             "B. Quatre adjectifs d'invraisemblance et quatre « comment » sans réponse.",
             "C. « un peu plus loin, puis encore un peu plus loin » : un mouvement sans "
             "objet.",
         ]),
        ("II. Une admiration qui se retourne",
         [
             "A. Le seul Européen désintéressé du livre : la « modeste et claire flamme ».",
             "B. « cependant » : un adverbe final qui suspend tout l'éloge.",
             "C. « la chose la plus dangereuse » : Kurtz désigné avant d'apparaître.",
         ]),
        ("III. Une éloquence dont on ne connaît que les effets",
         [
             "A. « Kurtz avait causé » : la conversation corrigée en discours.",
             "B. « Tout ! Tout ! », « des choses — des choses » : un souvenir vide.",
             "C. Le paysage chargé de dire ce que Marlow ne formule pas.",
         ]),
        ("Conclusion",
         "Conrad prépare l'entrée de son personnage central en montrant d'abord ce qu'il "
         "produit sur les autres : une adhésion totale, sans contenu et sans retour. "
         "Lorsque Kurtz paraîtra enfin, il ne restera de lui qu'une voix — et cette voix "
         "prononcera deux mots."),
    ],
    comprendre=[
        "Comment le jeune Russe est-il habillé ? À quoi Marlow le compare-t-il ?",
        "Qu'est-ce que Marlow admire chez lui ? Qu'est-ce qu'il ne lui envie pas ?",
        "Que raconte le jeune homme de sa première nuit avec Kurtz ? Rapporte-t-il ce qui a "
        "été dit ?",
    ],
    analyser=[
        "a) Relevez les quatre propositions introduites par « comment ». b) Reçoivent-elles "
        "une réponse ? c) Que produit cette accumulation ?",
        "Étudiez la phrase « Je ne lui enviais pas son dévouement à Kurtz cependant. » "
        "a) Où est placé l'adverbe ? b) Quel effet produit cette place sur tout ce qui "
        "précède ?",
        "« Nous avons parlé de tout. […] Il m'a fait voir des choses — des choses. » "
        "Pourquoi le disciple ne peut-il rien rapporter du contenu ? Qu'est-ce que cela "
        "révèle sur l'éloquence de Kurtz ?",
    ],
    parcours1=[
        "a) Relevez les adjectifs par lesquels Marlow qualifie le jeune Russe.",
        "b) Classez-les en deux colonnes : ceux qui admirent, ceux qui inquiètent.",
    ],
    parcours2=[
        "a) Étudiez la dernière phrase de l'extrait : relevez la construction répétée.",
        "b) Montrez que Marlow y décrit un paysage pour éviter de décrire un sentiment, et "
        "dites ce que ce report produit.",
    ],
    synthese="Pourquoi Conrad ne cite-t-il presque jamais les paroles de Kurtz, alors que "
             "tout le livre parle de son éloquence ?",
    examen="**Vers la dissertation.** « Un personnage de roman existe surtout par l'effet "
           "qu'il produit sur les autres. » Vous discuterez cette affirmation à partir de "
           "Kurtz et d'autres œuvres de votre choix.",
    ouverture="À rapprocher de la fiche 5 : cette voix dont personne ne peut rapporter le "
              "contenu prononcera, en mourant, deux mots que tout le monde retiendra.",
    encadres=[
        ("astuce", "Le personnage annoncé avant d'apparaître", [
            "Beaucoup d'œuvres retardent l'entrée de leur personnage principal en le "
            "faisant décrire par d'autres : c'est le cas de Tartuffe chez Molière, de Kurtz "
            "chez Conrad.",
            "**Ce qu'il faut analyser** : non pas les portraits eux-mêmes, mais leurs "
            "**divergences**. Le Russe adore Kurtz, le Directeur le juge « malsain », les "
            "pèlerins l'envient. Le lecteur reçoit un personnage contradictoire avant de "
            "l'avoir vu, et cette contradiction est l'objet même du livre.",
            "**Formule utilisable** : « le retard de l'apparition ne crée pas seulement "
            "l'attente ; il constitue le personnage comme un objet de discours, et rend "
            "impossible toute vision unifiée de lui. »",
        ]),
    ],
)

FICHES_TN_3_4 = [F3, F4]
