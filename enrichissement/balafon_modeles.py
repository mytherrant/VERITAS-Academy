# -*- coding: utf-8 -*-
"""
Section 8 du cahier « Balafon » : quatre devoirs entièrement rédigés.

Deux commentaires composés et deux dissertations, à la maquette des corrigés
harmonisés nationaux : idée générale, problématique, plan possible, centres
d'intérêt, intérêts du texte pour le commentaire ; thème, reformulation,
problématique, type de plan, parties, synthèse pour la dissertation.

Les commentaires portent sur deux poèmes sans fiche — « Moteczuma » et « Tu
reviendras, Sénégal ! » —, reproduits ici en entier : le cahier étudie donc
huit poèmes du recueil, et l'élève peut confronter chaque devoir à son texte.

La langue vise la classe de Première : phrases courtes, vocabulaire de la
grille, aucune tournure que l'élève ne pourrait reprendre à son compte.
"""
import balafon_extraits as X

SRC = X.SRC


def _src(cle):
    return SRC + X.REFERENCES[cle][2] + "."


# ═════════════════════════════════════════════════════════ COMMENTAIRE N° 1
CC1 = dict(
    numero="Commentaire composé n° 1 — devoir entièrement rédigé",
    sujet="Vous ferez le commentaire composé du poème « Moteczuma » "
          "(*Balafon*, « Lettres à mes amis »). Sans dissocier le fond de la "
          "forme, vous montrerez comment le poète salue un continent en le "
          "décrivant comme un cimetière, et ce qu'il attend de ce salut.",
    support=X.B7,
    source_support=_src("B7"),
    disposition="vers",
    avertissement="Devoir rédigé en entier, comme une copie de candidat, et "
                  "présenté selon la maquette des corrigés nationaux. Les "
                  "intertitres en gras ne figureraient pas sur une copie : "
                  "ils rendent la construction visible. Longueur — environ "
                  "mille cent mots, ce qu'un candidat écrit en quatre heures, "
                  "brouillon compris.",

    corps=[
        ("Introduction", [
            "**Idée générale.** Le poème est adressé à Moteczuma, dernier "
            "empereur aztèque. À travers lui, le poète africain salue "
            "l'Amérique précolombienne, détruite par la conquête. Il "
            "l'appelle « ma double Amérique », la décrit comme un immense "
            "cimetière, puis souhaite qu'un sang nouveau y remonte.",
            "**Plan possible.** Deux centres d'intérêt peuvent être dégagés : "
            "d'abord une lettre adressée à un mort ; ensuite un cimetière "
            "d'où l'on attend une naissance.",
            "Publié en 1972 par le jésuite camerounais Engelbert Mveng, "
            "*Balafon* s'ouvre sur une section intitulée « Lettres à mes "
            "amis ». Après la Chine et l'Europe, la troisième lettre est "
            "adressée à Moteczuma, c'est-à-dire à l'Amérique d'avant la "
            "conquête. Le poème est écrit en versets libres, sans rime ni "
            "mètre régulier.",
        ]),
        ("Premier centre d'intérêt — Une lettre adressée à un mort", [
            "**Premier sous-centre — l'adresse maintenue d'un bout à "
            "l'autre.** Le poème s'ouvre sur une formule de lettre : « A toi, "
            "Moteczuma, / Qui es ma double Amérique, J'envoie le salut de "
            "l'Afrique ». Le destinataire est nommé, le geste est annoncé — "
            "envoyer un salut. Ensuite, le tutoiement ne s'interrompt "
            "jamais : « Et te voici », « Toi, mon Amérique méridienne », « Tu "
            "es ma bouche volcanique ». La reprise anaphorique de « Tu es » "
            "et de « Te voici » (plusieurs occurrences) tient tout le "
            "poème.",
            "Cette adresse est étrange, et il faut le dire : Moteczuma est "
            "mort depuis quatre siècles et demi. Le poète écrit donc à "
            "quelqu'un qui ne peut pas répondre. C'est la première "
            "particularité du texte, et elle en commande le ton.",
            "**Deuxième sous-centre — la caractérisation nominale par "
            "l'absence.** Le poème ne décrit pas l'Amérique par ce qu'elle "
            "est, mais par ce qu'elle n'a plus. On relève une longue série de "
            "négations : « pas une femme en ton harem ne survivra », « Pas "
            "une pleureuse », « Pas une sorcière », « pas une voix de "
            "prêtresse », « nul écho ». Cinq refus successifs.",
            "Ces négations construisent une caractérisation péjorative du "
            "présent : ce continent est celui où plus personne ne reste pour "
            "faire le deuil. La plus dure est la troisième — il n'y a même "
            "plus de pleureuse. Un peuple qui n'a plus personne pour le "
            "pleurer est deux fois mort.",
            "**Troisième sous-centre — les noms propres comme preuves.** Le "
            "poète énumère ce qui a disparu : « les princes de Tula », « les "
            "rois de Texcoco », puis les peuples — « Celle des Sioux, des "
            "Abnakis, des Assiniboéls », « l'Amérique des Iroquois, / Des "
            "Incas, / Des Chichimèques ». L'accumulation ne démontre pas : "
            "elle montre. Chaque nom est une civilisation, et le poème les "
            "aligne comme on relève des tombes.",
            "**Transition partielle.** Le salut adressé à un mort dresse donc "
            "l'inventaire d'un désastre. Reste à savoir pourquoi le poète "
            "s'adresse malgré tout à ce continent : c'est que le cimetière "
            "n'est pas, pour lui, le dernier mot.",
        ]),
        ("Second centre d'intérêt — Un cimetière d'où l'on attend une "
         "naissance", [
            "**Premier sous-centre — le champ lexical de la mort, relevé en "
            "entier.** Il occupe tout le poème : « le grand cimetière », « le "
            "cimetière de tes races », « civilisations égorgées », « immense "
            "nécropole », « le vide des pyramides », « le grand cimetière du "
            "monde », « les lampadaires pulvérisés », « les flambeaux "
            "éteints ». Le mot « cimetière » revient à lui seul trois fois.",
            "Cette insistance produit une tonalité pathétique. Mais le poète "
            "n'accuse personne nommément : il ne dit ni conquistador, ni "
            "Espagne, ni Europe. Il décrit un état, non une faute — et ce "
            "silence rejoint celui de « Marcinelle, 1956 », où le poème "
            "renonce aussi à désigner un coupable.",
            "**Deuxième sous-centre — deux métaphores hyperbolisantes qui "
            "changent tout.** Le continent devient d'abord « la marmite du "
            "grand bouillon de tous les peuples rassemblés », puis « ma "
            "bouche volcanique béante au flanc de notre globe ». La marmite "
            "et le volcan ont un point commun : ce sont des récipients où "
            "quelque chose bout. Ce ne sont pas des images de mort, mais des "
            "images de préparation.",
            "On observera que la marmite reparaîtra à la fin du recueil, dans "
            "« Offrande ». Ici comme là, le récipient humble contient plus "
            "qu'il ne paraît.",
            "**Troisième sous-centre — le souhait final.** Le mouvement se "
            "ferme sur une demande : « que la pluie de mes larmes, / Dans la "
            "chair de tes glèbes appelle le sang vif de peuples neufs ». Le "
            "subjonctif est celui du vœu, non de l'affirmation. Les larmes "
            "deviennent une pluie ; la pluie tombe sur une terre — « la chair "
            "de tes glèbes » — et l'on attend une levée.",
            "Le vocabulaire est agricole autant que funèbre : on enterre, "
            "mais on sème. Le poète se nomme d'ailleurs « le salut sponsoral "
            "de l'Afrique », c'est-à-dire le salut d'un époux : il vient "
            "sceller une alliance, non seulement rendre un hommage.",
        ]),
        ("Conclusion", [
            "« Moteczuma » salue un continent en n'en montrant que les "
            "ruines, et transforme pourtant ce constat en attente. Deux "
            "moyens y concourent : l'adresse, qui traite un mort en "
            "interlocuteur, et les métaphores du récipient — marmite, "
            "volcan —, qui font du cimetière un lieu où quelque chose se "
            "prépare. Le poème appartient bien à la section des « Lettres à "
            "mes amis » : comme les précédentes, il tend une main, mais "
            "celle-ci est tendue vers un peuple qu'on a fait disparaître. On "
            "le rapprochera de « New York », adressé à l'autre Amérique, "
            "vivante et endormie : entre les deux poèmes, c'est tout un "
            "continent que le recueil embrasse.",
        ]),
        ("Intérêts du texte", [
            "**Intérêt stylistique.** Le poème montre comment une "
            "accumulation de négations peut tenir lieu de description. Il "
            "offre aussi un bel exemple de métaphore hyperbolisante — la "
            "marmite, le volcan — employée non pour grandir, mais pour "
            "renverser un sens.",
            "**Intérêt historique.** Le texte suppose connue la destruction "
            "des civilisations précolombiennes. Il nomme les Aztèques, les "
            "Incas, les Iroquois, les Sioux, et l'on peut travailler à partir "
            "de ces noms.",
            "**Intérêt humain.** Un poète africain écrit à un empereur "
            "amérindien : deux continents dépossédés se reconnaissent. Le "
            "poème propose une solidarité qui ne passe ni par l'Europe, ni "
            "par la revendication, mais par le deuil partagé.",
        ]),
    ],

    encadre=("methode", "Ce que le correcteur attend d'une introduction", [
        "L'introduction ci-dessus suit la maquette des corrigés nationaux. "
        "Elle contient, dans cet ordre :",
        "- **l'idée générale** : de quoi parle le texte, en trois ou quatre "
        "phrases ;",
        "- **la problématique** : une question, et une seule ;",
        "- **le plan possible** : les centres d'intérêt annoncés ;",
        "- **la situation** : auteur, œuvre, date, place du texte.",
        "Comptez : cela fait entre cent trente et cent soixante mots. Une "
        "introduction de quarante mots est incomplète ; une introduction de "
        "trois cents empiète sur le développement.",
    ]),
)


# ═════════════════════════════════════════════════════════ COMMENTAIRE N° 2
CC2 = dict(
    numero="Commentaire composé n° 2 — devoir entièrement rédigé",
    sujet="Vous ferez le commentaire composé du poème « Tu reviendras, "
          "Sénégal ! » (*Balafon*). Vous étudierez notamment la façon dont le "
          "poète transforme un adieu en promesse, et le rôle qu'y jouent les "
          "noms de lieux.",
    support=X.B8,
    source_support=_src("B8"),
    disposition="vers",
    avertissement="Devoir rédigé en entier, à la maquette des corrigés "
                  "nationaux. Le poème est daté de la Semaine sénégalaise de "
                  "mars 1971, à Yaoundé : le poète écrit donc au moment de "
                  "quitter des hôtes, non de quitter un pays. Un candidat qui "
                  "l'ignore fait un contresens sur le mot « exil ».",

    corps=[
        ("Introduction", [
            "**Idée générale.** Le poème est adressé au Sénégal au moment "
            "d'une séparation. Le poète rassemble le pays par ses noms de "
            "villes, entend des pas qui annoncent le départ, salue les morts "
            "et les vivants, puis affirme trois fois que le Sénégal "
            "reviendra.",
            "**Plan possible.** Deux centres d'intérêt : d'abord un pays "
            "rassemblé par ses noms ; ensuite un adieu retourné en promesse.",
            "Composé à Yaoundé en mars 1971, lors d'une Semaine sénégalaise, "
            "ce poème d'Engelbert Mveng appartient au recueil *Balafon* "
            "(1972). Écrit en versets libres, il s'adresse à un pays comme on "
            "s'adresserait à un ami qui s'en va.",
        ]),
        ("Premier centre d'intérêt — Un pays rassemblé par ses noms", [
            "**Premier sous-centre — l'apostrophe et la répétition du nom.** "
            "Le premier verset donne le ton : « Sénégal, Sénégal, ô mes rêves "
            "Sénégal ! » Le nom est répété trois fois dans une seule ligne, "
            "avec l'interjection « ô » et un point d'exclamation. Le poème "
            "n'informe pas : il appelle.",
            "Le nom reviendra ensuite comme une reprise anaphorique, en tête "
            "ou en fin de verset, jusqu'à la formule du titre : « Tu "
            "reviendras, Sénégal » (3 occ).",
            "**Deuxième sous-centre — la géographie comme preuve d'amour.** "
            "Le poète énumère les villes : « de Rosso à Podor, de Boghé à "
            "Matam, de Bakel à Tambacounda », puis « de Djourbel au "
            "Sine-Saloum », puis la Casamance. La construction « de… à… », "
            "répétée, parcourt le pays d'un bout à l'autre.",
            "Connaître les noms d'un pays, c'est déjà le posséder d'une "
            "certaine façon — non pour le prendre, mais pour le rassembler. "
            "Le verbe employé le dit : « Je rassemble ton nom », « Je te "
            "rassemble » (2 occ). L'énumération n'est donc pas un ornement "
            "géographique : elle est l'acte même du poème.",
            "**Troisième sous-centre — les mains du Cameroun.** Ce "
            "rassemblement se fait « Dans ma corbeille de rêves » et « Dans "
            "mes mille et mille mains d'enfants du Cameroun ! » Le poète ne "
            "parle pas en son nom seul : il parle au nom d'un autre pays. "
            "L'hyperbole — « mille et mille mains » — donne au geste une "
            "dimension collective.",
            "**Transition partielle.** Le pays est donc rassemblé, nommé, "
            "tenu dans des mains. C'est alors, et alors seulement, que le "
            "départ s'annonce — et le poème peut le transformer.",
        ]),
        ("Second centre d'intérêt — Un adieu retourné en promesse", [
            "**Premier sous-centre — le départ entendu avant d'être vu.** "
            "« J'entends des pas sous la porte... Est-ce le départ ? / "
            "Sénégal, / Est-ce déjà l'adieu ? » Deux questions, des points de "
            "suspension, un verset réduit à un seul mot. Après l'ampleur des "
            "énumérations, cette brièveté produit un silence : c'est l'outil "
            "d'analyse le plus efficace du passage.",
            "L'adverbe « déjà » porte tout le regret. Il ne dit pas que le "
            "départ est triste, il dit qu'il est trop tôt — ce qui est plus "
            "juste et plus discret.",
            "**Deuxième sous-centre — les morts et les vivants convoqués.** "
            "Le poète demande aux « Hommes du pays de Sine » de parler « aux "
            "mânes de Demba Diouf, de Blaise Diagne, / Aux mânes de Lamine "
            "Guèye ». Puis il s'adresse aux vivantes : « Vous direz aux "
            "vierges de Saloum ». Les morts d'abord, les vivants ensuite : "
            "l'ordre est celui d'une salutation traditionnelle.",
            "Aux jeunes filles, il dit : « Vous êtes la savane, / Vous êtes "
            "palmeraies fleuries au matin, vous êtes cacaoyères ». La "
            "caractérisation nominale identifie les personnes au pays "
            "lui-même. Puis vient une prière brève : « Vierges, ne partez "
            "pas ».",
            "**Troisième sous-centre — le retournement final.** La formule "
            "« Tu reviendras, Sénégal » est répétée trois fois, et à chaque "
            "reprise elle s'ouvre davantage. La première annonce l'abolition "
            "du temps : « La nuit ne sera plus, l'ennui ne sera plus, le "
            "temps ne sera plus » — trois négations parallèles, une "
            "gradation. La deuxième rappelle ce qui a été bâti : « Nous avons "
            "consacré nos routes d'espérance / Et bâti coude à coude la case "
            "de ce jour ». La troisième élargit à tout un continent : « Tu "
            "reviendras, Nous irons / Par-delà nos exils, vers l'Afrique de "
            "nos rêves / Fraternelle, libre, indivisée. »",
            "Trois adjectifs pour finir, sans verbe. Le poème d'adieu à un "
            "pays s'achève sur un programme pour l'Afrique entière.",
        ]),
        ("Conclusion", [
            "« Tu reviendras, Sénégal ! » commence par une énumération de "
            "villes et se termine par trois adjectifs qui décrivent un "
            "continent : c'est tout le mouvement du poème. L'adieu y est "
            "posé au centre, entre deux gestes de rassemblement, si bien "
            "qu'il ne conclut rien — il n'est qu'un passage. On rapprochera "
            "ce texte d'« Adamawa », autre poème de la terre, où le poète "
            "dénombrait aussi ce qu'il aimait ; mais là il comptait pour "
            "avouer sa petitesse, tandis qu'ici il compte pour retenir.",
        ]),
        ("Intérêts du texte", [
            "**Intérêt stylistique.** Le poème montre ce que produit "
            "l'alternance des longueurs dans un texte en versets : après "
            "trois lignes d'énumération, un verset d'un mot — « Sénégal, » — "
            "suffit à créer l'émotion.",
            "**Intérêt historique.** Les noms cités — Blaise Diagne, Lamine "
            "Guèye — sont ceux d'hommes politiques sénégalais. Le poème rend "
            "hommage à une histoire précise, et non à un Sénégal de "
            "convention.",
            "**Intérêt humain.** Le texte dit une amitié entre deux pays "
            "africains, sans passer par l'Europe. C'est rare dans la poésie "
            "de cette période, et cela mérite d'être relevé.",
        ]),
    ],

    encadre=("astuce", "Analyser une reprise sans se répéter", [
        "Quand une formule revient trois fois, ne dites pas trois fois "
        "qu'elle revient. Faites voir **ce qui change** autour d'elle.",
        "Ici : « Tu reviendras, Sénégal » est suivi d'abord de l'abolition du "
        "temps, puis du souvenir de ce qui a été bâti, enfin du départ vers "
        "toute l'Afrique. Même formule, trois horizons de plus en plus "
        "larges.",
        "C'est cette progression qui rapporte les points — non le simple "
        "relevé de l'anaphore.",
    ]),
)


# ═════════════════════════════════════════════════════════ DISSERTATION N° 1
D1 = dict(
    numero="Dissertation n° 1 — devoir entièrement rédigé",
    sujet="Un critique écrit à propos de la poésie africaine : « Le poète "
          "africain n'a pas à chanter l'Afrique : il a à la défendre. » Cette "
          "affirmation vous paraît-elle rendre compte du recueil *Balafon* "
          "d'Engelbert Mveng ? Vous répondrez en vous appuyant sur l'œuvre et "
          "sur vos lectures personnelles.",
    avertissement="Devoir rédigé en entier, à la maquette des corrigés "
                  "nationaux. Le sujet oppose deux verbes — chanter, "
                  "défendre. Un candidat qui traite « la poésie doit-elle "
                  "être engagée ? » se trompe de sujet : la question porte "
                  "sur ce que fait ce recueil-ci.",

    corps=[
        ("Introduction", [
            "**Thème.** Le rôle du poète africain : célébrer son continent ou "
            "le défendre.",
            "**Reformulation.** Selon le critique, la poésie africaine "
            "n'aurait pas pour tâche de louer l'Afrique, mais de la protéger "
            "contre ce qui la menace. Chanter serait un luxe ; défendre, un "
            "devoir.",
            "**Problématique.** Le recueil *Balafon* défend-il l'Afrique, la "
            "chante-t-il, ou fait-il autre chose que l'un et l'autre ?",
            "**Type de plan.** Plan dialectique en trois parties : ce que "
            "l'affirmation a de juste, ce qu'elle laisse de côté, ce qu'il "
            "faut lui substituer.",
            "Publié en 1972 par Engelbert Mveng, prêtre jésuite, historien et "
            "artiste camerounais, *Balafon* réunit seize poèmes en versets, "
            "des lettres aux continents jusqu'aux prières finales.",
        ]),
        ("Première partie — Ce que l'affirmation a de juste", [
            "Il faut d'abord reconnaître que le recueil défend, et qu'il le "
            "fait ouvertement.",
            "**Il nomme les violences.** « Marcinelle, 1956 » évoque les "
            "mineurs morts sous terre, et élargit aussitôt « Aux mineurs "
            "Basuto, à ceux du Katanga ». « Moteczuma » dresse la liste des "
            "civilisations « égorgées en plein midi ». « New York » cite les "
            "Black Panthers, Martin Luther King, Malcolm X. Le recueil ne "
            "détourne pas les yeux.",
            "**Il conteste des représentations.** Dans « À Kong-Fu-Tseu », le "
            "poète écarte une expression raciste : « tu n'es plus pour moi le "
            "Danger jaune ». Dans « Épiphanie », il refuse que l'or africain "
            "soit comparé « à la dorure squameuse des ikônes » ou « à la "
            "blonde chevelure des Madones de Memling ». Ce sont des refus "
            "précis, et donc des défenses.",
            "**Il revendique une antériorité.** Toujours dans « Épiphanie », "
            "le mage venu adorer l'Enfant est africain. Le poème affirme ainsi "
            "que l'Afrique était présente à la naissance du christianisme, et "
            "non convertie ensuite. C'est une thèse, et elle défend.",
            "**Transition partielle.** Le recueil défend donc bel et bien. "
            "Mais s'y réduit-il ?",
        ]),
        ("Deuxième partie — Ce que l'affirmation laisse de côté", [
            "L'affirmation devient étroite dès qu'on regarde ce que le "
            "recueil fait le plus souvent.",
            "**Il chante, et il le dit dans son titre.** Le balafon est un "
            "instrument. Le tam-tam, le likembe, la kora reviennent dans "
            "presque tous les poèmes. Le dernier mot du livre est un chant : "
            "« Et chante la marmite, Les marmites de ma mère, / SUR LA LEVRE "
            "DE DIEU. »",
            "**Il bénit plutôt qu'il n'accuse.** Dans « Adamawa », le poète "
            "souhaite : « Paix, ô MOKOGHIBLY, / Sur ton troupeau d'éléphants "
            "millénaires ». Aucune défense là-dedans : une bénédiction.",
            "**Il refuse même d'accuser quand il le pourrait.** C'est le fait "
            "le plus net. Dans « Marcinelle », après avoir formulé un long "
            "réquisitoire par la reprise anaphorique des « Pourquoi », le "
            "chœur s'interrompt : « Non ! Nous ne dirons pas ». Un poète qui "
            "voudrait seulement défendre n'aurait pas retiré son "
            "accusation.",
            "**Il écrit aux autres, non contre eux.** La première section "
            "s'intitule « Lettres à mes amis ». On n'écrit pas une lettre "
            "d'amitié à un adversaire. Ce geste est l'inverse de la défense : "
            "c'est une invitation.",
        ]),
        ("Troisième partie — Ce qu'il faut substituer à l'affirmation", [
            "L'opposition entre chanter et défendre est mal posée, et le "
            "recueil montre pourquoi.",
            "**Chanter est, pour Mveng, une façon de défendre.** Quand il "
            "énumère les mines d'où vient l'or — « l'or d'Obuassi, l'or de "
            "Bétaré Oya, l'or de Tarkwa » — il célèbre et il rappelle en même "
            "temps le travail arraché « aux entrailles de la terre ». La "
            "louange contient le fait.",
            "**Le recueil propose un troisième verbe : relier.** L'Afrique y "
            "écrit à la Chine, à l'Europe, à l'Amérique. Dans « New York », "
            "le poète se fait l'Atlantique lui-même, « cousant les franges du "
            "destin ». Ni chant pur, ni défense : une couture.",
            "**L'auteur l'a formulé lui-même.** Selon lui, l'écrivain "
            "« cherche toujours l'homme qui vient après l'enfant, la vie qui "
            "vient après la mort, le jour qui vient après la nuit ». Ce n'est "
            "ni chanter ni défendre : c'est annoncer. Et de fait, presque "
            "tous les poèmes du recueil s'achèvent sur une aube.",
            "**On peut vérifier ailleurs.** Chez Senghor, l'éloge de la femme "
            "noire est en même temps une réponse à ceux qui la méprisaient : "
            "là encore, chanter et défendre ne sont pas séparables. Le "
            "critique a donc raison sur le fait, et tort sur l'opposition.",
        ]),
        ("Conclusion", [
            "**Synthèse.** L'affirmation décrit exactement une part de "
            "*Balafon* : le recueil nomme les violences, conteste les "
            "représentations, revendique une histoire. Elle en manque "
            "cependant l'essentiel, qui est le geste de tendre la main — aux "
            "continents, aux morts, à Dieu. Chez Mveng, chanter et défendre "
            "ne s'opposent pas : le chant est le moyen, et ce qu'il défend, "
            "c'est moins l'Afrique seule qu'une fraternité possible.",
            "Il resterait à se demander si ce geste est encore tenable "
            "aujourd'hui, à une époque où la poésie africaine s'est faite "
            "plus rude. Les *Poèmes sauvages* d'Henri N'koumo, écrits après "
            "un attentat, montrent que le deuil peut se dire autrement — et "
            "que l'espérance y a désormais un autre son.",
        ]),
    ],

    encadre=("methode", "Discuter un jugement sans le contredire à plat", [
        "Un sujet qui cite un critique attend une discussion, non une "
        "réfutation. Trois erreurs, et leur remède :",
        "- **Nier d'emblée.** « Cette affirmation est fausse » en première "
        "ligne : le correcteur sait que la première partie n'existera pas. "
        "Remède : chercher d'abord ce qui l'a rendue vraisemblable.",
        "- **Approuver de bout en bout.** Le devoir n'a plus de mouvement. "
        "Remède : un jugement qu'on n'a pas besoin de discuter n'aurait pas "
        "été donné en sujet.",
        "- **Rester dans le pour et le contre.** Une troisième partie qui "
        "répète les deux premières ne vaut rien. Remède : elle doit déplacer "
        "la question — ici, en montrant que l'opposition entre chanter et "
        "défendre est elle-même mal posée.",
    ]),
)


# ═════════════════════════════════════════════════════════ DISSERTATION N° 2
D2 = dict(
    numero="Dissertation n° 2 — devoir entièrement rédigé",
    sujet="Engelbert Mveng écrit que l'écrivain « cherche toujours l'homme "
          "qui vient après l'enfant, la vie qui vient après la mort, le jour "
          "qui vient après la nuit ». Cette définition vous paraît-elle "
          "éclairer *Balafon* ? Vous répondrez en vous appuyant sur le "
          "recueil et sur vos lectures.",
    avertissement="Devoir rédigé en entier. La citation est de l'auteur "
                  "lui-même : elle figure en tête du volume. Un candidat doit "
                  "donc la situer avant de la discuter, et se rappeler qu'un "
                  "écrivain n'est pas toujours le meilleur juge de ce qu'il "
                  "fait.",

    corps=[
        ("Introduction", [
            "**Thème.** La définition que Mveng donne du rôle de l'écrivain, "
            "et sa vérification dans son propre recueil.",
            "**Reformulation.** Pour Mveng, l'écrivain ne s'arrête pas à ce "
            "qui est : il cherche ce qui vient après. Trois couples le "
            "disent — l'enfant et l'homme, la mort et la vie, la nuit et le "
            "jour. L'écrivain serait donc celui qui regarde vers la suite.",
            "**Problématique.** Cette définition rend-elle compte de "
            "*Balafon*, et suffit-elle à en décrire la démarche ?",
            "**Type de plan.** Plan dialectique en trois parties : la "
            "définition se vérifie ; elle laisse de côté une part du recueil ; "
            "elle doit être complétée.",
            "La phrase figure en tête du volume publié en 1972. Elle sert de "
            "programme à seize poèmes qui vont des lettres aux continents "
            "jusqu'à l'offrande finale.",
        ]),
        ("Première partie — Une définition qui se vérifie", [
            "Le recueil confirme la formule presque partout, et d'abord dans "
            "ses fins de poèmes.",
            "**Presque tous s'achèvent sur une aube.** « Marcinelle » attend "
            "que « la voix claire du coq chante l'aurore ». « Adamawa » se "
            "ferme sur « Tout n'est plus que jour, Tout n'est plus que "
            "soleil » et sur un coq qui chantera. « Offrande » voit la flamme "
            "monter « comme monte l'aurore ». Trois poèmes, trois aubes.",
            "**La mort n'est jamais le dernier mot.** Dans « Moteczuma », "
            "après l'inventaire du cimetière, le poète souhaite que ses "
            "larmes « appelle[nt] le sang vif de peuples neufs ». Le "
            "mouvement est exactement celui que la citation décrit : la vie "
            "qui vient après la mort.",
            "**L'enfance est présente comme promesse.** « New York » "
            "multiplie les mots de la naissance — berceau, parturition, "
            "vagissement — et attend de la ville qu'elle crie enfin. La "
            "définition vaut donc aussi pour son premier couple.",
            "**Transition partielle.** La formule décrit bien le mouvement "
            "des poèmes. Rend-elle compte pour autant de tout le recueil ?",
        ]),
        ("Deuxième partie — Ce que la définition laisse de côté", [
            "Elle décrit une direction, non une manière. Or c'est la manière "
            "qui fait ce recueil.",
            "**Elle ne dit rien de l'adresse.** *Balafon* s'ouvre sur des "
            "« Lettres à mes amis ». Chaque poème parle à quelqu'un : "
            "Confucius, Manhattan, l'Adamaoua, Dieu. Cette forme est le "
            "propre du livre, et la citation n'en souffle mot.",
            "**Elle ne dit rien du double héritage.** Le calice et le "
            "tam-tam, la croix et le balafon, la marmite d'argile et la "
            "patène : le recueil fond deux traditions dans la même image. "
            "C'est ce qui le distingue, et la formule ne le prévoit pas.",
            "**Elle ne dit rien du silence.** Or « Marcinelle » se construit "
            "sur un refus de parler — « Nous ne proférerons que ce silence » —, "
            "et « Offrande » culmine sur « Tout n'est plus que silence... » "
            "avant le chant final. Un écrivain qui cherche le jour d'après "
            "peut se taire longuement : la définition ne l'explique pas.",
        ]),
        ("Troisième partie — Ce qu'il faut ajouter à la définition", [
            "Il faut compléter la formule par le moyen qu'elle passe sous "
            "silence : ce jour d'après ne s'annonce pas seul, il se demande à "
            "quelqu'un.",
            "**Ce qui vient après est toujours attendu d'un autre.** Dans "
            "« New York », la paix ne viendra pas « Sans le vagissement "
            "initiatique de mes tam-tams » : elle dépend de l'Afrique. Dans "
            "« Marcinelle », elle est demandée à Dieu : « POUR QUE DESCENDE "
            "TA PAIX SUR LA TERRE DES HOMMES ». Dans « Offrande », c'est "
            "Dieu qui reçoit la marmite. L'aube n'est jamais un simple "
            "lendemain : elle est un don espéré.",
            "**Le poème sert d'instrument, non de prophétie.** Le titre du "
            "recueil le dit : un balafon ne parle pas tout seul. Le poète "
            "n'annonce pas le jour, il en joue la musique pour que d'autres "
            "l'entendent — ce que confirme la dernière image du livre, une "
            "marmite qui chante « SUR LA LEVRE DE DIEU ».",
            "**On peut mesurer la différence.** Un écrivain qui « cherche le "
            "jour » pourrait le faire seul, dans une méditation. Mveng, lui, "
            "écrit des lettres, des prières et des bénédictions : trois "
            "formes qui supposent toutes un destinataire. La définition dit "
            "où il va ; elle ne dit pas qu'il n'y va jamais seul.",
        ]),
        ("Conclusion", [
            "**Synthèse.** La définition que Mveng donne de l'écrivain "
            "éclaire réellement son recueil : les poèmes de *Balafon* "
            "regardent tous vers ce qui vient après, et leurs fins le "
            "prouvent. Elle reste pourtant incomplète, car elle décrit une "
            "direction sans dire la forme que le poète a choisie : l'adresse. "
            "Chez Mveng, on ne cherche pas le jour d'après tout seul — on le "
            "demande, on l'annonce à quelqu'un, on le joue comme on joue d'un "
            "instrument.",
            "On pourrait prolonger en se demandant si un écrivain est bien "
            "placé pour définir son propre travail. La formule de Mveng est "
            "juste et modeste ; elle ne dit pourtant pas ce que son lecteur "
            "voit en premier — que ce livre est fait de lettres.",
        ]),
    ],

    encadre=("astuce", "Traiter un sujet qui cite l'auteur de l'œuvre", [
        "Quand la citation est de l'auteur lui-même, le devoir change "
        "légèrement de nature. Trois réflexes :",
        "- **Situer la citation.** Où l'a-t-il écrite, à quelle occasion ? "
        "Ici : en tête du volume, comme une profession de foi.",
        "- **Vérifier, ne pas croire.** Un auteur décrit son intention, non "
        "son résultat. La deuxième partie doit chercher ce que l'œuvre fait "
        "et que la formule ne prévoit pas.",
        "- **Ne pas la contredire pour le plaisir.** Si la citation se "
        "vérifie, dites-le, preuves à l'appui. La discussion porte sur ce "
        "qu'elle omet, non sur ce qu'elle affirme.",
    ]),
)


COMMENTAIRES = [CC1, CC2]
DISSERTATIONS = [D1, D2]
