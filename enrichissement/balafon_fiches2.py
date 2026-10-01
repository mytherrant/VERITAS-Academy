# -*- coding: utf-8 -*-
"""
Fiches 4 à 6 du cahier « Balafon ».

Fiche 4  Adamawa    la terre natale
Fiche 5  Épiphanie  le mage africain devant l'Enfant
Fiche 6  Offrande   la clôture du recueil

Comme pour les fiches 1 à 3, les poèmes viennent de `balafon_extraits.py`
et sont reproduits entiers.
"""
import balafon_extraits as X

SRC = X.SRC


def _src(cle):
    return SRC + X.REFERENCES[cle][2] + "."


# ═══════════════════════════════════════════════════════ FICHE 4 — ADAMAWA
F4 = dict(
    titre="Fiche 4 — « Adamawa »",
    repere=X.REPERES["B4"],
    extrait=X.B4,
    source=_src("B4"),
    disposition="vers",

    objectif="Étudier un poème adressé à une terre, et comprendre comment un "
             "paysage devient une personne à qui l'on souhaite la paix.",

    lexique=[
        ["Adamaoua", "haut plateau du nord du Cameroun, terre d'élevage. Le "
                     "poème écrit « Adamawa »."],
        ["MOKOGHIBLY", "nom donné à la montagne dans le poème ; le glossaire "
                       "du volume l'explique."],
        ["saré", "concession, ensemble d'habitations d'une même famille, dans "
                 "le nord du Cameroun."],
        ["matutinal", "du matin."],
        ["Iris", "messagère des dieux dans la mythologie grecque."],
        ["Baghirmi", "ancien royaume de la région du lac Tchad."],
        ["mayo", "en peul, cours d'eau, rivière."],
        ["Foulbés", "peuple d'éleveurs du Sahel et du nord du Cameroun."],
        ["Adama", "chef peul du XIXᵉ siècle qui donna son nom à l'Adamaoua."],
        ["Sunamite", "dans la Bible, jeune femme du Cantique des cantiques."],
    ],

    situation="Daté de 1959, le poème est adressé à l'Adamaoua, haut plateau "
              "du nord du Cameroun. Un an avant l'indépendance, le poète "
              "revient vers une terre qu'il nomme comme une personne — "
              "MOKOGHIBLY — et qu'il tutoie d'un bout à l'autre. Après les "
              "poèmes des continents et des villes, c'est le retour au pays. "
              "Il faut faire remarquer que le texte ne décrit presque rien : "
              "il appelle, il compte, il souhaite. C'est une bénédiction plus "
              "qu'un paysage.",

    mouvements=[
        "**Le fondement.** Le poème s'ouvre sur « Fondamentale pour moi, Ta "
        "borne qui fonde tout » : la terre est présentée comme ce sur quoi "
        "tout repose.",
        "**Le sommeil et l'appel.** « Dors MOKOGHIBLY » d'un côté, « J'appelle "
        "seulement le réveil des pasteurs » de l'autre. Le poème berce et "
        "réveille en même temps.",
        "**Le dénombrement impuissant.** « J'ai compté mes roseaux… mes "
        "ruisseaux… mes tribus… mes villages… l'horizon sur mes doigts » — et "
        "à chaque fois : « mais qu'est-ce pour ton plateau ? »",
        "**L'histoire et les hommes.** Les guerriers d'Adama, les princes "
        "Foulbés, le croissant perdu parmi les voies lactées.",
        "**La bénédiction finale.** « Paix, ô MOKOGHIBLY » : sur les "
        "troupeaux, les zébus, les chèvres, les enfants. Le poème s'achève "
        "sur le chant du coq et « la houle des tam-tams ».",
    ],

    axes=[
        ("Une terre traitée comme une personne", [
            "**Le tutoiement est constant.** « ta table solaire », « ton "
            "silence », « tes flancs », « ton front », « tes enfants ». La "
            "terre a un corps : des flancs, un dos, un front, des pieds, des "
            "lèvres.",
            "**Elle porte un nom propre.** MOKOGHIBLY, en capitales, répété "
            "quatre fois. Ce n'est pas un toponyme ordinaire : c'est un nom "
            "qu'on appelle. Le poème l'emploie comme un vocatif — « Dors "
            "MOKOGHIBLY », « ô MOKOGHIBLY », « Paix, ô MOKOGHIBLY ».",
            "**On lui parle comme à un dormeur.** « Dors MOKOGHIBLY, "
            "Sentinelle de toits fauves » ; « Oh ! repais leur sommeil de la "
            "flûte inédite à tes lèvres ». Le registre est celui de la "
            "berceuse, et il contraste avec l'appel au réveil des pasteurs "
            "qui suit immédiatement.",
            "**Le poème demande, il n'ordonne pas.** Les impératifs — "
            "« Dors », « Pais », « repais » — s'adressent à une puissance "
            "supérieure au poète. Comparez avec « New York », où le poète "
            "commandait aux instruments : ici, il implore.",
        ]),
        ("Le dénombrement, ou l'aveu d'une disproportion", [
            "**Une anaphore organise tout le mouvement central.** « J'ai "
            "compté mes roseaux », « J'ai compté mes ruisseaux », « J'ai "
            "compté mes tribus », « J'ai compté mes villages », « J'ai compté "
            "l'horizon sur mes doigts ». Cinq reprises.",
            "**Chaque compte est suivi d'une question qui l'annule.** « mais "
            "qu'est-ce pour ton plateau ? », « qu'est-ce pour tes "
            "amphores ? », « Mais qu'est-ce tout cela, ô ma table "
            "solaire ! ». Le poème compte pour montrer que compter ne suffit "
            "pas.",
            "**L'image finale du dénombrement est physique.** « J'ai compté "
            "l'horizon sur mes doigts qui s'égrène » : on compte l'horizon "
            "comme un chapelet, et il file entre les doigts. Le geste dit "
            "l'échec mieux qu'un mot.",
            "**Ce que la disproportion établit.** La terre est plus grande "
            "que ce que le poète peut lui apporter. C'est l'inverse du "
            "rapport colonial, où l'on inventorie pour posséder : ici, on "
            "inventorie pour reconnaître qu'on ne possède pas.",
        ]),
        ("Bénir plutôt que décrire", [
            "**Le poème refuse la description pittoresque.** Aucun paysage "
            "n'est vraiment peint : pas de couleurs, peu de formes. À la "
            "place, des relations — ce que la terre fonde, ce qu'elle porte, "
            "ce qu'on lui souhaite.",
            "**La formule de bénédiction revient en fin de texte.** « Je te "
            "dis : / Paix, ô MOKOGHIBLY, / Sur ton troupeau d'éléphants "
            "millénaires, / Paix sur tes zébus de granit et tes chèvres de "
            "calcaire ». La structure — « Paix sur… » — est celle des "
            "bénédictions bibliques.",
            "**Les animaux sont de pierre.** « éléphants millénaires », "
            "« zébus de granit », « chèvres de calcaire à la corne rognée ». "
            "Ce sont des rochers que le poème voit comme un troupeau : "
            "l'image est exacte pour un plateau parsemé de blocs, et elle "
            "fait du paysage un élevage.",
            "**La fin ouvre sur un matin.** « Et tout n'est plus que jour, "
            "Tout n'est plus que soleil » ; puis le coq qui chantera « mille "
            "et mille fois ». Comme presque tous les poèmes du recueil, "
            "celui-ci se ferme sur une aube.",
        ]),
    ],

    forme=[
        "**Un mot revient trois fois en tête de verset : « Fondamental(e) ».** "
        "« Fondamentale pour moi, Ta borne », « Fondamental ton silence », "
        "« Fondamentale cette heure qui commence ». L'adjectif change de "
        "genre selon ce qu'il qualifie, mais la place reste la même : c'est "
        "une anaphore.",
        "**L'anaphore de « J'ai compté » structure le centre du poème.** Cinq "
        "occurrences, chacune suivie d'une question. L'outil d'analyse et son "
        "démenti forment un couple : c'est ce couple qu'il faut analyser, non "
        "l'anaphore seule.",
        "**Les impératifs sont rares et donc voyants.** « Dors » (deux fois), "
        "« Pais » (deux fois), « repais ». Cinq en tout dans un long poème : "
        "les relever suffit à dessiner le mouvement.",
        "**Le vocabulaire mêle trois mondes.** Le peul et le camerounais "
        "(saré, mayo, Foulbés, Adama, Baghirmi), le grec (Homère, Iris, "
        "l'Olympe), le biblique (l'Éden, les Sunamites, l'Angélus). Aucun ne "
        "domine, et aucun n'est traduit dans l'autre.",
        "**Deux versets portent un crochet ouvrant.** « tes [ « Mayo » », "
        "« [ dans la tempête ». C'est une marque de mise en page du volume, "
        "conservée telle quelle : elle signale un vers trop long pour la "
        "justification, reporté à la ligne. À signaler aux élèves, qui la "
        "prennent pour une faute.",
        "**Le poème finit sur un futur.** « Que le coq chantera mille et "
        "mille fois au réveil / De leurs noms bondissant sur la houle des "
        "tam-tams. » Le dernier mot du texte est un instrument.",
    ],

    encadres=[
        ("astuce", "Reconnaître une bénédiction", [
            "Trois marques, et il suffit d'en trouver deux :",
            "- **Un vocatif** : on nomme celui qu'on bénit (« ô MOKOGHIBLY »).",
            "- **La formule « Paix sur… »**, ou « Que… » suivi d'un "
            "subjonctif.",
            "- **Une énumération de ce qui est béni** : les troupeaux, les "
            "enfants, les sommeils.",
            "La bénédiction n'est pas une prière — on ne demande rien pour "
            "soi — ni une description — on ne dit pas ce qui est, mais ce "
            "qu'on souhaite. La distinguer évite le contresens le plus "
            "fréquent sur ce poème, qui consiste à le lire comme un tableau "
            "de paysage.",
        ]),
        ("saviez", "Un plateau qui porte un nom d'homme", [
            "L'Adamaoua tire son nom d'Adama, chef peul du XIXᵉ siècle qui "
            "conquit la région. Le poème le rappelle : « J'ai reçu les "
            "guerriers d'Adama sur la plaine / Avec le grand salut princier "
            "de mes aïeux », et il évoque « les princes Foulbés ».",
            "Le texte ne cache donc pas que cette terre a une histoire "
            "guerrière, et que les Foulbés y sont venus. Il choisit pourtant "
            "de saluer plutôt que de contester : « le grand salut princier de "
            "mes aïeux ». C'est un bon sujet de discussion sur ce que le "
            "poème fait de l'histoire.",
        ]),
    ],

    plan=[
        ("Introduction",
         "Daté de 1959, un an avant l'indépendance du Cameroun, « Adamawa » "
         "appartient au recueil *Balafon* d'Engelbert Mveng. Après les "
         "lettres aux continents et les poèmes des villes, le livre revient "
         "vers la terre natale : le haut plateau du nord du pays, que le "
         "poète appelle par un nom propre, MOKOGHIBLY, et qu'il tutoie de "
         "bout en bout. **Comment un poème peut-il faire d'un paysage une "
         "personne, et remplacer la description par la bénédiction ?** Nous "
         "étudierons d'abord la terre traitée comme un être vivant, puis le "
         "dénombrement qui avoue sa propre impuissance, enfin le geste de "
         "bénir qui referme le poème."),
        ("I. Une terre traitée comme une personne", [
            "**A. Un tutoiement constant et un corps.** Flancs, dos, front, "
            "lèvres, pieds : la terre est décrite comme un être.",
            "**B. Un nom propre, appelé quatre fois.** MOKOGHIBLY est un "
            "vocatif, non un toponyme.",
            "**C. Le registre de la berceuse.** « Dors MOKOGHIBLY » : on "
            "berce une puissance que l'on n'ordonne pas.",
        ]),
        ("II. Un dénombrement qui avoue son impuissance", [
            "**A. Cinq reprises de « J'ai compté ».** Roseaux, ruisseaux, "
            "tribus, villages, horizon.",
            "**B. Chaque compte annulé par une question.** « mais qu'est-ce "
            "pour ton plateau ? » : compter ne suffit pas.",
            "**C. Ce que la disproportion établit.** L'inverse de "
            "l'inventaire colonial : on dénombre pour reconnaître qu'on ne "
            "possède pas.",
        ]),
        ("III. Bénir plutôt que décrire", [
            "**A. Un paysage sans description.** Ni couleurs ni formes : des "
            "relations.",
            "**B. La formule biblique « Paix sur… ».** Les troupeaux, les "
            "zébus, les chèvres, les enfants.",
            "**C. Une aube pour finir.** « Tout n'est plus que soleil », et "
            "le coq qui chantera sur « la houle des tam-tams ».",
        ]),
        ("Conclusion",
         "En refusant la description, « Adamawa » évite le pittoresque où "
         "tant de poèmes de la terre natale se perdent. La terre y est un "
         "interlocuteur, non un décor ; le poète y compte ses biens pour "
         "avouer qu'ils ne sont rien devant elle ; et le texte s'achève sur "
         "une bénédiction, forme qui ne décrit ni ne réclame. On le "
         "rapprochera de « Tu reviendras, Sénégal ! », autre poème du retour, "
         "où le rapport à la terre est cette fois celui du départ."),
    ],

    ouverture="À rapprocher de « Tu reviendras, Sénégal ! », qui suit "
              "immédiatement dans le recueil et traite du même attachement "
              "par le biais inverse — l'adieu. Hors du recueil, on comparera "
              "avec les poèmes de la terre natale de Senghor : on verra ce "
              "que Mveng doit à la Négritude, et ce qu'il en écarte.",

    comprendre=[
        "À qui ou à quoi le poème s'adresse-t-il ? Relevez le nom employé.",
        "Relevez les parties du corps attribuées à la terre.",
        "Que compte le poète ? Citez trois des choses dénombrées.",
        "Quelle réponse revient après chaque dénombrement ?",
        "Quels animaux sont bénis dans la dernière partie ? De quelle matière "
        "sont-ils faits ?",
    ],

    analyser=[
        "a) Relevez les trois versets commençant par « Fondamental » ou "
        "« Fondamentale ». b) Que qualifie l'adjectif à chaque fois ? "
        "c) Comment nomme-t-on cette reprise, et que produit-elle ici ?",
        "a) Relevez les cinq groupes « J'ai compté… ». b) Recopiez la "
        "question qui suit chacun. c) Pourquoi le poète compte-t-il, s'il "
        "sait d'avance que cela ne suffira pas ?",
        "« J'ai compté l'horizon sur mes doigts qui s'égrène ». a) À quel "
        "objet le geste fait-il penser ? b) Que signifie « s'égrène » ici ? "
        "c) En quoi cette image résume-t-elle tout le mouvement ?",
        "« ton troupeau d'éléphants millénaires », « tes zébus de granit », "
        "« tes chèvres de calcaire ». a) De quoi ces animaux sont-ils faits ? "
        "b) Que désignent-ils réellement dans le paysage ? c) Que gagne le "
        "poème à les nommer ainsi plutôt que « rochers » ?",
        "a) Relevez les mots venus du peul et du Cameroun, puis ceux venus de "
        "la Grèce, puis ceux venus de la Bible. b) L'un des trois domine-t-il "
        "les autres ? c) Que traduit cette égalité ?",
        "Le poème dit « Dors » à la terre et « J'appelle le réveil » aux "
        "pasteurs, à deux versets d'écart. a) Y a-t-il contradiction ? b) Qui "
        "dort, qui se réveille ? c) Que dit ce partage sur le rapport de "
        "l'homme à la terre ?",
    ],

    parcours1=[
        "a) Recopiez la dernière bénédiction en allant à la ligne à chaque "
        "« Paix ».",
        "b) Cherchez dans le glossaire du volume les mots MOKOGHIBLY, saré et "
        "mayo. Une phrase pour chacun.",
    ],

    parcours2=[
        "a) Montrez que le poème substitue systématiquement la relation à la "
        "description, et dites ce qu'il gagne — et ce qu'il perd — à ce "
        "choix.",
        "b) « On ne décrit bien que ce qu'on ne possède pas. » Discutez cette "
        "formule à partir du poème, en une vingtaine de lignes.",
    ],

    synthese="Le poète compte ses biens et conclut qu'ils ne sont rien devant "
             "la terre. Est-ce de l'humilité, ou une autre façon de "
             "l'aimer ?",

    examen="**Vers le commentaire composé.** Rédigez entièrement le deuxième "
           "centre d'intérêt du plan ci-dessus, en trois sous-centres. Vous "
           "citerez les cinq reprises de « J'ai compté » et analyserez au "
           "moins deux des questions qui les suivent. On attend de 350 à 400 "
           "mots.",
)


# ═════════════════════════════════════════════════════ FICHE 5 — ÉPIPHANIE
F5 = dict(
    titre="Fiche 5 — « Épiphanie »",
    repere=X.REPERES["B5"],
    extrait=X.B5,
    source=_src("B5"),
    disposition="vers",

    objectif="Étudier un poème qui réécrit un épisode biblique en le "
             "transportant en Afrique, et comprendre pourquoi le don y vaut "
             "moins par sa valeur que par ce qu'il a coûté.",

    lexique=[
        ["Épiphanie", "fête chrétienne du 6 janvier : la visite des mages à "
                      "l'Enfant Jésus."],
        ["Emmanuel", "nom donné au Christ dans la Bible ; il signifie « Dieu "
                     "avec nous »."],
        ["Couschân, Cousch", "noms bibliques désignant une région d'Afrique "
                            "orientale."],
        ["Koumbi-Salé", "capitale de l'ancien empire du Ghana."],
        ["griot", "en Afrique de l'Ouest, poète et musicien dépositaire de la "
                  "mémoire de la communauté."],
        ["gris-gris", "amulette protectrice."],
        ["tata", "en Afrique de l'Ouest, enceinte fortifiée."],
        ["Pactole", "rivière de Lydie réputée charrier de l'or ; par "
                    "extension, source de richesse."],
        ["Gondwana", "ancien continent, dont l'Afrique est issue."],
        ["squameux", "couvert d'écailles."],
        ["ikône", "icône, image sainte de l'Église d'Orient."],
    ],

    situation="Le poème réécrit l'Épiphanie — la visite des mages à l'Enfant "
              "— en faisant du mage un roi africain venu du Royaume de "
              "Couschân. Il appartient au moment du recueil où le sacré "
              "chrétien se dit en images africaines. Le texte est long et "
              "procède par retours : le même refrain — l'or dans la chair "
              "vive des mains — ouvre et ferme le poème. Il faut prévenir les "
              "élèves que la première lecture donne une impression de "
              "répétition : c'est voulu, et c'est le sujet de la fiche.",

    mouvements=[
        "**L'offrande annoncée.** « Je dis : Emmanuel, / Je dis : mon "
        "Seigneur, Voici de l'or » : le poème commence par la fin du voyage.",
        "**L'aveu de la pauvreté.** « Ne regarde pas mes mains, Mes mains "
        "sont sales » : les mains, les pieds, le pagne déchiré.",
        "**Le récit du voyage.** « il n'y avait point de routes… pas de "
        "voitures… pas d'avion » : ce que le mage n'avait pas.",
        "**Le souvenir de la splendeur perdue.** « Il était beau pourtant, "
        "mon pagne de couleurs » : les princesses du Ghana, les griots, le "
        "henné.",
        "**La distance dite par les tam-tams.** « Les tam-tams de chez nous "
        "n'arrivent pas jusqu'ici » : trois fois, la séparation.",
        "**L'or et ceux qui l'ont extrait.** Les noms des mines africaines, "
        "puis « Mille tribus, depuis des milliers d'ans, l'ont arraché ».",
        "**Ce que l'or n'est pas.** « ce n'est point la dorure squameuse des "
        "ikônes », « pas la blonde chevelure des Madones » : le don africain "
        "se définit par opposition.",
    ],

    axes=[
        ("Réécrire l'Évangile depuis l'Afrique", [
            "**L'épisode est identifiable et déplacé.** Un mage, une étoile "
            "qui appelle — « Ton Etoile me disait : VIENS ! » —, un long "
            "voyage, de l'or offert à un enfant. Tout y est, sauf le décor : "
            "le mage vient du Royaume de Couschân, passe par Koumbi-Salé, "
            "porte un pagne tissé par les princesses du Ghana.",
            "**Le déplacement n'est pas un ornement.** Il fonde le poème : si "
            "le mage est africain, alors l'Afrique était présente à la "
            "naissance du christianisme, et non convertie plus tard. C'est "
            "une thèse théologique autant que poétique.",
            "**Les noms propres font le travail.** Couschân et Cousch sont "
            "bibliques ; Koumbi-Salé, Ghana, Fouta, Galam sont africains. Le "
            "poème les met dans la même phrase, sans jamais expliquer que les "
            "premiers désignent déjà l'Afrique dans la Bible.",
            "**Le vocatif structure tout.** « Mon Seigneur » revient d'un "
            "bout à l'autre : le poème est une adresse continue, comme les "
            "lettres qui ouvraient le recueil. Le destinataire a changé, pas "
            "la forme.",
        ]),
        ("Des mains sales qui portent de l'or", [
            "**Le poème est bâti sur un contraste tenu.** D'un côté : mains "
            "sales, pieds couverts de limon, pagne en lambeaux. De l'autre : "
            "l'or pur, l'or vierge, l'or vif comme des braises. Les deux sont "
            "dans la même phrase — « l'or pur dans la chair vive de mes "
            "mains ».",
            "**Le refus du regard est répété trois fois.** « Ne regarde pas "
            "mes mains », « Ne regarde pas mes pieds », « Ne regarde pas mon "
            "pagne ». Le mage détourne l'attention de lui-même vers ce qu'il "
            "apporte.",
            "**La splendeur perdue est racontée au passé.** « Il était beau "
            "pourtant, mon pagne de couleurs » : suit une longue évocation "
            "des princesses, des griots, du henné. Le poème montre ce que la "
            "route a coûté — c'est le prix du don, non sa valeur, qui "
            "importe.",
            "**L'expression clé revient comme un refrain.** « dans la chair "
            "vive de mes mains » : cinq occurrences au moins. Faites-les "
            "relever. « Chair vive » veut dire à vif, écorchée : l'or n'est "
            "pas posé sur la main, il est dans la blessure.",
        ]),
        ("Un don collectif, non le geste d'un roi", [
            "**Le mage ne donne pas son or : il porte celui des autres.** "
            "« Mille tribus, depuis des milliers d'ans, l'ont arraché pour "
            "Toi aux entrailles de la terre. » Le poème énumère ensuite qui a "
            "travaillé : les hommes avec des pics, les femmes avec des houes, "
            "les enfants avec des paniers.",
            "**Tous les âges sont nommés.** Des nourrissons « dormant comme "
            "fruits mûrs sur la hanche des mamans » jusqu'aux « Ancêtres à la "
            "démarche titubante ». Le don traverse les générations.",
            "**Les lieux de l'or sont réels.** Galam, Obuassi, Bétaré Oya, "
            "Tarkwa, Mono, Kilo, Moto, « les Pactoles du Rand "
            "Sud-Africain ». Ce sont des mines africaines. Derrière l'offrande "
            "religieuse, il y a le travail des mines — et le poème ne "
            "l'efface pas : « La sueur d'or pur de leurs fronts de ferveur ».",
            "**L'or n'a pas été détourné.** « Nous ne l'avons point prostitué "
            "avant le retour de l'Alliance : Ni veau d'or, Ni idole "
            "ventrue… » Le poème revendique une fidélité : cet or attendait. "
            "C'est ce qui autorise le mage à l'offrir.",
            "**Ce que l'or n'est pas, dit en trois refus.** Pas « la dorure "
            "squameuse des ikônes de Kazan », pas « la blonde chevelure des "
            "Madones de Memling », pas « le reliquaire d'argent arraché par "
            "les voleurs ». L'art religieux européen est écarté au profit "
            "d'un or brut, sorti de la terre par des mains.",
        ]),
    ],

    forme=[
        "**Le poème avance par retours, non par progression.** Le refrain de "
        "l'or ouvre et ferme le texte. Entre les deux, le voyage, le pagne, "
        "les tam-tams, les mines. Cette construction circulaire est celle de "
        "la prière, non celle du récit.",
        "**L'anaphore des « Ne regarde pas ».** Trois occurrences, chacune "
        "suivie d'un aveu. L'outil d'analyse installe une humilité qui n'est pas de "
        "convention : chaque refus attire précisément l'attention sur ce "
        "qu'il prétend cacher.",
        "**Les énumérations sont des preuves.** Les noms de mines, les âges "
        "de la vie, les outils : le poème ne démontre pas que le don est "
        "collectif, il l'énumère. Dans un poème en versets, la liste tient "
        "lieu d'argument.",
        "**Les négations construisent le sens de la fin.** « ce n'est point », "
        "« ce n'est pas », « ce n'est pas même » : trois refus qui définissent "
        "l'or africain par ce qu'il n'est pas.",
        "**Le vocatif « Mon Seigneur » scande le texte.** Comptez-en les "
        "occurrences : elles marquent les articulations du poème mieux que "
        "les blancs.",
        "**Une remarque de lecture.** Le verset le plus court — « VIENS ! - » "
        "— est en capitales et isolé. C'est la parole de l'étoile, et le "
        "seul moment où quelqu'un d'autre que le mage parle.",
    ],

    encadres=[
        ("methode", "Étudier une réécriture", [
            "Quand un texte reprend un récit connu, quatre questions, dans "
            "l'ordre :",
            "- **Que garde-t-il ?** Ici : l'étoile, le voyage, l'or, "
            "l'Enfant.",
            "- **Que change-t-il ?** L'origine du mage, les lieux, les "
            "objets.",
            "- **Qu'ajoute-t-il ?** Les mines, le travail des tribus, le "
            "pagne déchiré.",
            "- **Que retire-t-il ?** Les deux autres mages, Hérode, la fuite "
            "en Égypte.",
            "C'est le troisième point qui rapporte le plus : ce qu'un auteur "
            "ajoute dit ce qui l'intéresse.",
        ]),
        ("vigilance", "Ne pas confondre humilité et effacement", [
            "Le mage dit trois fois « ne regarde pas ». Un devoir rapide y "
            "verra de la modestie, et s'arrêtera là.",
            "Or ce même mage énumère les mines de tout un continent, "
            "revendique la fidélité de son peuple — « Nous ne l'avons point "
            "prostitué » — et refuse explicitement l'or des icônes et des "
            "madones européennes. L'humilité porte sur sa personne ; sur ce "
            "qu'il apporte, le ton est celui de la fierté.",
            "**Tenir les deux ensemble** est ce qui distingue un bon "
            "commentaire de ce poème.",
        ]),
    ],

    plan=[
        ("Introduction",
         "Dans *Balafon* (1972), Engelbert Mveng, prêtre jésuite camerounais, "
         "réécrit l'Épiphanie : le mage qui vient adorer l'Enfant est un roi "
         "africain, parti du Royaume de Couschân, les mains sales et le pagne "
         "déchiré, portant l'or arraché par mille tribus aux entrailles de la "
         "terre. **Comment un poème peut-il transporter un épisode de "
         "l'Évangile en Afrique sans le trahir, et faire d'une offrande "
         "royale le don de tout un peuple ?** Nous verrons d'abord la "
         "réécriture et son enjeu, puis le contraste entre les mains sales et "
         "l'or pur, enfin le caractère collectif du don."),
        ("I. Réécrire l'Évangile depuis l'Afrique", [
            "**A. Un épisode reconnaissable et déplacé.** L'étoile, le "
            "voyage, l'or ; mais Couschân, Koumbi-Salé, le pagne du Ghana.",
            "**B. Une thèse sous la fable.** Si le mage est africain, "
            "l'Afrique était présente à la naissance, non convertie ensuite.",
            "**C. La forme de l'adresse.** « Mon Seigneur » scande le texte : "
            "le poème reste une lettre, comme au seuil du recueil.",
        ]),
        ("II. Des mains sales qui portent de l'or", [
            "**A. Un contraste tenu dans la même phrase.** « l'or pur dans la "
            "chair vive de mes mains ».",
            "**B. L'anaphore des « Ne regarde pas ».** Trois refus qui "
            "désignent ce qu'ils prétendent cacher.",
            "**C. La splendeur racontée au passé.** Le pagne des princesses, "
            "les griots, le henné : le poème montre ce que la route a coûté.",
        ]),
        ("III. Un don collectif", [
            "**A. Le mage porte l'or des autres.** « Mille tribus, depuis des "
            "milliers d'ans, l'ont arraché. »",
            "**B. Les mines nommées, le travail dit.** Galam, Obuassi, "
            "Tarkwa, le Rand : derrière l'offrande, la sueur.",
            "**C. Trois refus pour finir.** Ni la dorure des icônes, ni les "
            "Madones, ni le reliquaire volé : l'or africain se définit contre "
            "l'art religieux d'Europe.",
        ]),
        ("Conclusion",
         "En donnant à l'Épiphanie un mage africain, Mveng ne fait pas "
         "seulement un exercice d'inculturation : il revendique une "
         "antériorité et une dignité. Le don qu'il met en scène ne vaut pas "
         "par la valeur du métal, mais par le travail de ceux qui l'ont "
         "extrait et par la fidélité de ceux qui ne l'ont pas détourné. On "
         "rapprochera ce poème d'« Offrande », qui referme le recueil sur un "
         "don d'une autre nature : une simple marmite d'argile."),
    ],

    ouverture="À rapprocher d'« Offrande », dernier poème du recueil : l'or "
              "y cède la place à l'argile, et le roi à la mère. La "
              "comparaison des deux dons est le meilleur sujet de "
              "dissertation que ce cahier puisse offrir. On lira aussi "
              "« Pentecôte sur l'Afrique », où le tam-tam prend la place du "
              "vent de la Pentecôte.",

    comprendre=[
        "Quel épisode biblique le poème réécrit-il ? Qui en est le "
        "personnage principal ici ?",
        "D'où vient le mage ? Relevez deux noms de lieux qu'il traverse ou "
        "d'où il part.",
        "Dans quel état sont ses mains, ses pieds et son pagne ? Citez les "
        "vers.",
        "Qui a extrait l'or qu'il apporte ? Relevez le vers qui le dit.",
        "À quoi le poète refuse-t-il de comparer son or, dans les derniers "
        "versets ?",
    ],

    analyser=[
        "a) Relevez les trois groupes « Ne regarde pas… ». b) Qu'est-ce qui "
        "suit chacun ? c) Ces refus cachent-ils vraiment, ou attirent-ils "
        "l'attention ? Justifiez.",
        "a) Comptez les occurrences de « dans la chair vive de mes mains ». "
        "b) Que signifie « chair vive » ? c) Pourquoi l'or n'est-il pas "
        "simplement « dans mes mains » ?",
        "a) Relevez les noms de mines et de lieux aurifères. b) Que "
        "représentent-ils réellement ? c) Que fait le poème en les plaçant "
        "dans une offrande religieuse ?",
        "« Les hommes avaient des pics, / Les femmes avaient des houes, / Les "
        "enfants des “baskets” à la hauteur de leur âge ». a) Quelle "
        "construction est répétée ? b) Qui est laissé de côté ? c) Que "
        "démontre cette énumération sur la nature du don ?",
        "a) Relevez les trois négations des derniers versets. b) Quelles "
        "œuvres d'art européennes sont écartées ? c) Pourquoi le poème "
        "définit-il son or par ce qu'il n'est pas ?",
        "« Ton Etoile me disait : VIENS ! - ». a) Qui parle ici ? b) Combien "
        "de mots compte ce verset, et comment est-il imprimé ? c) Que produit "
        "sa brièveté au milieu d'un poème si ample ?",
    ],

    parcours1=[
        "a) Recopiez les trois « Ne regarde pas… » avec ce qui les suit.",
        "b) Cherchez ce qu'est l'Épiphanie et qui sont les mages. Cinq lignes.",
    ],

    parcours2=[
        "a) Montrez que le poème tient ensemble une humilité personnelle et "
        "une fierté collective, et dites par quels moyens précis il évite la "
        "contradiction.",
        "b) « Un don vaut par ce qu'il a coûté, non par ce qu'il vaut. » "
        "Discutez cette formule à partir du poème, en une trentaine de "
        "lignes.",
    ],

    synthese="Le mage répète qu'il ne faut pas le regarder. Pourquoi le poème "
             "s'attarde-t-il alors si longuement sur son pagne, ses mains et "
             "ses pieds ?",

    examen="**Vers la dissertation.** « Réécrire un texte sacré, c'est en "
           "changer le propriétaire. » Vous discuterez cette affirmation en "
           "vous appuyant sur « Épiphanie » et sur vos lectures personnelles. "
           "On attend une introduction rédigée et un plan détaillé en trois "
           "parties.",
)


# ═══════════════════════════════════════════════════════ FICHE 6 — OFFRANDE
F6 = dict(
    titre="Fiche 6 — « Offrande »",
    repere=X.REPERES["B6"],
    extrait=X.B6,
    source=_src("B6"),
    disposition="vers",

    objectif="Étudier le poème qui ferme le recueil, et comprendre comment un "
             "objet domestique peut devenir l'offrande la plus haute.",

    lexique=[
        ["parasolier", "arbre africain à larges feuilles, qui pousse vite."],
        ["okoumé", "arbre d'Afrique équatoriale, au bois précieux."],
        ["érythréen", "de la mer Érythrée, ancien nom de la mer Rouge."],
        ["éthiopique", "d'Éthiopie ; par extension, africain."],
        ["Emmaüs", "village où, dans l'Évangile, le Christ ressuscité marche "
                   "avec deux disciples sans être reconnu."],
        ["Couschân", "nom biblique d'une région d'Afrique orientale."],
        ["topaze, rubis, gemme", "pierres précieuses."],
        ["lambris", "revêtement décoratif d'un mur."],
        ["Esingang, Mekom, Abiedë, Enam-Ngal", "villages du pays de l'auteur ; "
                                              "le glossaire du volume les "
                                              "situe."],
        ["patène", "petit plat qui porte l'hostie à la messe."],
    ],

    situation="C'est le dernier poème du recueil, divisé en dix mouvements "
              "numérotés de I à X. Il part d'un objet ordinaire — la marmite "
              "d'argile de la mère du poète — et le conduit jusque dans les "
              "mains de Dieu. Après l'or d'« Épiphanie », l'argile : le livre "
              "se ferme sur le don le plus humble. Les derniers mots du "
              "recueil sont « SUR LA LEVRE DE DIEU », en capitales.",

    mouvements=[
        "**I à V — la marmite décrite.** « Ma mère avait une marmite d'argile "
        "fine » : la matière, la couleur, le feu, la faim du village, les "
        "lèvres qui attendent.",
        "**VI et VII — Dieu passe, et il n'y a pas de place.** Sur la nappe "
        "de lin fin, le marbre, les colonnes de topaze : « Pas une place, / "
        "Une humble place vide pour la marmite de ma mère... »",
        "**VIII — le dépôt.** « Lors sur les deux mains de mon Dieu… Ma mère "
        "a déposé la marmite d'argile ». Les mains de Dieu sont décrites "
        "longuement : tendues, ouvertes, vides.",
        "**IX — l'incendie.** La flamme monte autour de la marmite et dans "
        "ses flancs : « La flamme monte comme monte l'aurore. »",
        "**X — le silence, puis le chant.** « Tout s'est tu… Tout n'est plus "
        "que silence… / ...Et chante la marmite, Les marmites de ma mère, / "
        "SUR LA LEVRE DE DIEU. »",
    ],

    axes=[
        ("Un objet ordinaire élevé au rang d'offrande", [
            "**Le poème commence par une phrase de conte.** « Ma mère avait "
            "une marmite d'argile fine ». Sujet, verbe à l'imparfait, objet "
            "concret : rien de plus simple, et cette simplicité est "
            "voulue.",
            "**La formule est reprise cinq fois, avec des variations.** « une "
            "marmite d'argile fine », « d'argile rouge », « d'argile », "
            "« d'argile rare », « à la lèvre compacte et nette ». Chaque "
            "reprise ajoute un trait : le poème tourne autour de l'objet "
            "comme on tourne autour d'un vase.",
            "**L'objet grandit sans changer de nature.** Ses flancs sont "
            "d'abord « ronds comme un fruit mûr », puis « ronds comme les "
            "flancs du monde ». La comparaison passe du fruit au monde en "
            "deux mouvements, et la marmite reste une marmite.",
            "**Ce que l'argile porte de sens.** Matière pauvre, façonnée par "
            "« les doigts effilés du potier de la tribu », rouge « comme le "
            "pur sang des fils de la tribu ». L'objet est à la fois "
            "domestique, artisanal et sacrificiel.",
        ]),
        ("Une place refusée, puis les mains ouvertes", [
            "**Le mouvement VI oppose deux mondes en quelques versets.** D'un "
            "côté la nappe de lin fin, le marbre « luisant comme la glace des "
            "marchands », les colonnes de topaze, les lambris d'or, les "
            "rubis. De l'autre, « la marmite de ma mère ». Et le constat : "
            "« Pas une place ».",
            "**Le refus est répété au mouvement VII.** Presque mot pour mot. "
            "La reprise n'ajoute rien au sens : elle ajoute du temps, et "
            "l'attente devient pesante. C'est un effet de composition, à "
            "analyser comme tel.",
            "**Dieu, lui, s'arrête.** « Dieu vint et s'arrêta. » Puis : "
            "« Dieu vint. Il s'arrêta. » Deux phrases courtes, presque "
            "identiques, dans un poème fait de longs versets. Le contraste "
            "de longueur porte tout le sens.",
            "**Pourquoi il s'arrête : à cause des noms.** « ses pas "
            "chantaient les noms de mon pays, / Les noms d'Esingang, de "
            "Mekom, d'Abiedë, / Et l'humble nom d'Enam-Ngal ». Ce ne sont pas "
            "des lieux saints : ce sont des villages. Le poème place la "
            "reconnaissance divine dans la toponymie la plus locale.",
            "**Les mains remplacent la table.** Là où le marbre n'avait pas "
            "de place, les mains en ont : « Mains tendues, Mains ouvertes, / "
            "Mains vides comme la natte solitaire au soleil déployée ». Le "
            "vide des mains est ce qui permet le don.",
        ]),
        ("Du silence au chant : une clôture qui ouvre", [
            "**Le mouvement IX est un embrasement.** « Et monte l'incendie, / "
            "Et cerne l'incendie la marmite d'argile, / Et court la flamme "
            "sur sa lèvre » : cinq versets commençant par « Et », une "
            "gradation qui gagne la chair, les veines, le sein.",
            "**La comparaison finale de ce mouvement est décisive.** « La "
            "flamme monte comme monte l'aurore. » Le feu qui aurait pu "
            "détruire devient une aube — c'est le mouvement de tout le "
            "recueil, du deuil vers le jour.",
            "**Le mouvement X commence par le silence.** « Tout s'est tu. » "
            "Trois mots après l'incendie. Puis « Tout n'est plus que "
            "silence... ».",
            "**Et le poème se ferme sur un chant.** « ...Et chante la "
            "marmite, Les marmites de ma mère, / SUR LA LEVRE DE DIEU. » "
            "L'objet muet a reçu une voix ; le singulier est devenu pluriel ; "
            "et les derniers mots du livre, en capitales, placent ce chant "
            "sur la lèvre de Dieu.",
            "**Ce que la clôture fait au recueil entier.** Le livre s'appelle "
            "*Balafon* — un instrument. Il se termine sur un objet qui se met "
            "à chanter. La boucle est complète, et il faut la faire voir aux "
            "élèves.",
        ]),
    ],

    forme=[
        "**Dix mouvements numérotés en chiffres romains.** C'est le seul "
        "poème du recueil ainsi construit. La numérotation crée des paliers, "
        "comme les stations d'un chemin.",
        "**⚠️ Le fichier numérique intervertit trois numéros.** Ils s'y "
        "présentent dans l'ordre I, II, IV, V, III, VI… C'est un défaut de "
        "numérisation, non une intention de l'auteur. Le cahier reproduit le "
        "fichier tel quel, sans réordonner : on ne récrit pas un texte sur "
        "une hypothèse. Le signaler aux élèves, et leur faire rétablir "
        "l'ordre logique par le sens — l'exercice vaut mieux qu'une "
        "correction silencieuse.",
        "**L'anaphore de « Ma mère avait une marmite ».** Cinq occurrences, "
        "chacune complétée différemment. C'est le fil du poème.",
        "**Le contraste des longueurs porte le sens.** « Dieu vint. Il "
        "s'arrêta. » — cinq mots — au milieu de versets qui en font trente. "
        "Faire mesurer aux élèves : le sens est dans l'écart.",
        "**La reprise en « Et » du mouvement IX.** Cinq versets consécutifs "
        "commencent par la conjonction. Cet outil d'analyse — la **polysyndète** — "
        "donne l'impression que le feu ne s'arrête pas.",
        "**Les points de suspension ouvrent et ferment des versets.** "
        "« ... Une marmite : », « ...Fruit mûr sur la table de ses mains », "
        "« Tout n'est plus que silence... ». Ils marquent ce qui n'est pas "
        "dit, et il y en a beaucoup dans ce poème.",
        "**Les capitales du dernier vers.** « SUR LA LEVRE DE DIEU. » — comme "
        "dans « Marcinelle », la typographie remplace la scansion pour "
        "marquer le sommet.",
    ],

    encadres=[
        ("astuce", "Suivre un objet d'un bout à l'autre d'un poème", [
            "Quand un texte est bâti sur un objet, faites-en la fiche de "
            "suivi, en quatre colonnes :",
            "**mouvement** | **comment l'objet est nommé** | **ce qu'on en "
            "dit** | **qui le touche**.",
            "Pour « Offrande » : la marmite est d'abord de la mère, puis du "
            "potier, puis du village affamé, puis de Dieu. Ce simple tableau "
            "donne le plan du poème — et un centre d'intérêt entier.",
        ]),
        ("saviez", "Pourquoi une marmite, après l'or ?", [
            "Le recueil contient déjà un poème d'offrande : « Épiphanie », où "
            "un roi africain apporte l'or de tout un continent. Mveng place "
            "en clôture un don exactement inverse : un ustensile de cuisine, "
            "en terre, qui appartient à sa mère.",
            "Les deux poèmes se répondent, et c'est délibéré. L'or dit ce que "
            "l'Afrique a de plus précieux ; l'argile dit ce qu'elle a de plus "
            "quotidien. Le livre choisit de finir par le second. Rapprocher "
            "les deux textes est le meilleur exercice que ce cahier propose.",
        ]),
    ],

    plan=[
        ("Introduction",
         "*Balafon* (1972) se referme sur « Offrande », poème en dix "
         "mouvements où Engelbert Mveng part d'un objet ordinaire — la "
         "marmite d'argile de sa mère — pour la déposer, à la fin, dans les "
         "mains de Dieu. Après l'or d'« Épiphanie », le livre choisit "
         "l'argile. **Comment un ustensile domestique peut-il devenir "
         "l'offrande la plus haute, et donner au recueil sa clôture ?** Nous "
         "verrons d'abord l'objet ordinaire élevé au rang d'offrande, puis la "
         "place refusée qui conduit aux mains ouvertes, enfin le passage du "
         "silence au chant."),
        ("I. Un objet ordinaire élevé au rang d'offrande", [
            "**A. Une phrase de conte, reprise cinq fois.** « Ma mère avait "
            "une marmite d'argile… », complétée différemment à chaque fois.",
            "**B. L'objet grandit sans changer de nature.** Des flancs « ronds "
            "comme un fruit mûr » aux flancs « ronds comme les flancs du "
            "monde ».",
            "**C. Une matière chargée de sens.** Argile pauvre, façonnée par "
            "le potier de la tribu, rouge « comme le pur sang des fils de la "
            "tribu ».",
        ]),
        ("II. Une place refusée, puis les mains ouvertes", [
            "**A. Deux mondes opposés.** Le marbre, la topaze, les lambris "
            "d'or — et « Pas une place » pour la marmite.",
            "**B. Le refus répété, et Dieu qui s'arrête.** « Dieu vint. Il "
            "s'arrêta. » : cinq mots au milieu de versets immenses.",
            "**C. Ce qui l'arrête : des noms de villages.** Esingang, Mekom, "
            "Abiedë, « l'humble nom d'Enam-Ngal ». La reconnaissance divine "
            "passe par la toponymie la plus locale.",
        ]),
        ("III. Du silence au chant", [
            "**A. L'incendie du mouvement IX.** Cinq versets en « Et » : la "
            "flamme gagne la chair, les veines, le sein.",
            "**B. Le feu devenu aurore.** « La flamme monte comme monte "
            "l'aurore » : la destruction se retourne en aube.",
            "**C. La clôture du recueil.** L'objet muet chante ; le livre "
            "intitulé *Balafon* se termine sur un instrument retrouvé, « SUR "
            "LA LEVRE DE DIEU ».",
        ]),
        ("Conclusion",
         "En choisissant la marmite plutôt que l'or, Mveng donne à son "
         "recueil une clôture cohérente avec tout ce qui précède : c'est "
         "l'humble et le quotidien qui portent le sacré, non la richesse. Le "
         "poème conduit un objet de cuisine du foyer d'un village aux mains "
         "de Dieu, sans jamais lui retirer sa nature d'objet — et c'est "
         "précisément ce refus de la métamorphose qui fait sa force. On le "
         "lira en regard d'« Épiphanie », dont il est la réponse."),
    ],

    ouverture="À lire immédiatement après « Épiphanie » : les deux poèmes "
              "forment un couple — l'or et l'argile, le roi et la mère — et "
              "aucun des deux ne se comprend entièrement sans l'autre. Pour "
              "élargir, on rapprochera de « Mère », le plus long poème du "
              "recueil, où l'Afrique et la mère du poète finissent par se "
              "confondre.",

    comprendre=[
        "Quel objet donne son sujet au poème ? À qui appartient-il ?",
        "En combien de mouvements le poème est-il divisé ? Comment sont-ils "
        "désignés ?",
        "Que ne trouve-t-on pas pour la marmite, sur la nappe de lin fin ? "
        "Citez le vers.",
        "Où la marmite est-elle finalement déposée ?",
        "Quels sont les derniers mots du poème — et du recueil ?",
    ],

    analyser=[
        "a) Relevez les cinq débuts « Ma mère avait une marmite… ». b) Qu'est "
        "ajouté à chaque fois ? c) Pourquoi le poème tourne-t-il ainsi autour "
        "de son objet au lieu d'avancer ?",
        "a) Comparez « ronds comme un fruit mûr » et « ronds comme les flancs "
        "du monde ». b) Qu'est-ce qui change ? c) La marmite a-t-elle changé "
        "de nature pour autant ?",
        "« Dieu vint. Il s'arrêta. » a) Combien de mots comptent ces deux "
        "phrases ? b) Comparez avec la longueur des versets voisins. "
        "c) Qu'est-ce qui, dans le texte, arrête Dieu ?",
        "a) Relevez les cinq versets du mouvement IX commençant par « Et ». "
        "b) Comment nomme-t-on cette accumulation de conjonctions ? c) Quel "
        "effet produit-elle sur la description du feu ?",
        "« La flamme monte comme monte l'aurore. » a) Quels sont le comparé "
        "et le comparant ? b) Qu'attendait-on d'un incendie ? c) En quoi ce "
        "renversement résume-t-il tout le recueil ?",
        "Le poème se termine par « SUR LA LEVRE DE DIEU », en capitales. "
        "a) Qui chante ? b) Pourquoi le singulier « la marmite » devient-il "
        "« les marmites » ? c) En quoi cette fin convient-elle à un livre "
        "intitulé *Balafon* ?",
    ],

    parcours1=[
        "a) Donnez un titre de trois mots à chacun des dix mouvements.",
        "b) Recopiez le mouvement VIII en allant à la ligne à chaque "
        "« Mains ».",
    ],

    parcours2=[
        "a) Rétablissez l'ordre logique des dix mouvements, que le fichier "
        "numérique intervertit, et justifiez chacun de vos choix par le sens "
        "du texte.",
        "b) Comparez le don d'« Épiphanie » et celui d'« Offrande » : la "
        "matière, celui qui donne, ce qui est reçu. Puis dites, en une "
        "trentaine de lignes, pourquoi le recueil choisit de finir par le "
        "second.",
    ],

    synthese="Le recueil s'ouvre sur une lettre à un philosophe chinois et se "
             "ferme sur la marmite d'une mère. Ce trajet vous paraît-il un "
             "rétrécissement ou un accomplissement ?",

    examen="**Vers le commentaire composé.** Rédigez entièrement "
           "l'introduction et le troisième centre d'intérêt du plan "
           "ci-dessus. Vous confronterez explicitement ce poème à "
           "« Épiphanie », que vous citerez. On attend de 400 à 450 mots.",
)

FICHES_BA_4_6 = [F4, F5, F6]
