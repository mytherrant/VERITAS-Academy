# -*- coding: utf-8 -*-
"""
Compléments documentaires insérés dans la section II de chaque cahier.

Les cahiers portaient déjà une biographie et un contexte. Ce module y ajoute
ce qui manquait le plus à un élève de second cycle : **une chronologie** — des
dates alignées, vérifiables, qu'on peut apprendre — et un paragraphe de
**réception et postérité**, qui dit ce que l'œuvre est devenue après sa
publication.

Règle appliquée à chaque ligne : aucune date, aucun chiffre qui ne soit
attesté. Quand les sources divergent, c'est l'ouvrage lui-même qui tranche —
ainsi pour « Poèmes sauvages », dont le dossier annonce l'édition de 2022 et
le bilan de dix-neuf tués, là où plusieurs sites en ligne donnent d'autres
nombres. Un cahier scolaire ne recopie pas le web : il vérifie sur le livre.

Rien n'est ajouté pour un cahier qui n'a pas d'entrée ici : `blocs()` rend une
liste vide, et le document est construit comme avant.
"""

# ─────────────────────────────────────────────────────────────── vieuxnegre
VIEUXNEGRE = dict(
    titre="2 bis. Repères chronologiques et postérité",
    chrono=[
        ["1929", "Naissance de Ferdinand Oyono à N'Goulemakong, au sud du "
                 "Cameroun."],
        ["années 1950", "Études de droit et de sciences politiques à Paris."],
        ["1956", "Deux romans la même année : *Une vie de boy* et *Le vieux "
                 "nègre et la médaille*. Oyono a vingt-sept ans."],
        ["1960", "*Chemin d'Europe*, son troisième roman. Le Cameroun accède "
                 "à l'indépendance la même année."],
        ["après 1960", "Carrière diplomatique, puis ministérielle : Oyono "
                       "cesse presque entièrement de publier."],
        ["2010", "Mort de Ferdinand Oyono."],
    ],
    paras=[
        "**Trois romans, et puis le silence.** C'est le fait le plus étonnant "
        "de cette biographie : Oyono écrit ses trois livres avant trente-deux "
        "ans, puis se tait pendant un demi-siècle. Toute son œuvre tient dans "
        "les quatre années qui précèdent l'indépendance.",

        "**Ce que la date de 1956 signifie.** Le roman paraît quand la "
        "colonisation n'est pas encore finie et que sa fin est déjà certaine. "
        "Cela explique le ton : Oyono n'écrit pas contre un système lointain, "
        "il écrit sur un monde que ses premiers lecteurs ont sous les yeux. "
        "La médaille remise à Meka est un objet du présent, non un souvenir.",

        "**Une question à poser en classe.** Pourquoi un écrivain qui a si "
        "bien montré les mécanismes du pouvoir colonial choisit-il ensuite de "
        "servir l'État ? La question n'a pas de réponse simple, et elle vaut "
        "mieux qu'un jugement rapide : elle ouvre sur ce que devient une "
        "génération d'écrivains quand son pays devient indépendant.",
    ],
    encadre=("saviez", "Deux romans la même année", [
        "*Une vie de boy* et *Le vieux nègre et la médaille* paraissent tous "
        "deux en 1956. Les deux racontent la même désillusion, mais par des "
        "moyens opposés : le premier est un journal tenu à la première "
        "personne par un jeune domestique ; le second suit un vieil homme, à "
        "la troisième personne.",
        "Les lire l'un après l'autre est le meilleur exercice de "
        "narratologie qu'on puisse proposer à une classe : même sujet, même "
        "auteur, même année, deux dispositifs de récit, deux effets.",
    ]),
)

# ──────────────────────────────────────────────────────────────── lionperle
LIONPERLE = dict(
    titre="2 bis. Repères chronologiques et postérité",
    chrono=[
        ["1934", "Naissance de Wole Soyinka à Abeokuta, en pays yoruba "
                 "(Nigeria)."],
        ["1959", "Création de *The Lion and the Jewel* à Ibadan. Le Nigeria "
                 "est encore colonie britannique."],
        ["1960", "Indépendance du Nigeria."],
        ["1967-1969", "Emprisonné pendant la guerre du Biafra, en grande "
                      "partie au secret."],
        ["1986", "Prix Nobel de littérature — le premier décerné à un "
                 "écrivain africain."],
    ],
    paras=[
        "**Une pièce écrite à la veille de l'indépendance.** *Le lion et la "
        "perle* est créée en 1959, un an avant que le Nigeria ne devienne "
        "indépendant. Le débat qui occupe la pièce — faut-il moderniser le "
        "village, et à quel prix ? — est exactement celui que le pays "
        "s'apprête à trancher. Lakounlé et Baroka ne sont pas deux caractères "
        "de comédie : ce sont deux réponses politiques.",

        "**Ce que le titre annonce, et ce qu'il cache.** Le lion, c'est "
        "Baroka ; la perle, c'est Sidi. Mais un lion est un prédateur et une "
        "perle un objet : le titre distribue déjà les rôles, et l'on peut "
        "demander à la classe si le dénouement les confirme ou les défait.",

        "**La postérité.** Soyinka reçoit le Nobel en 1986, le premier "
        "attribué à un écrivain africain, pour une œuvre que le comité décrit "
        "comme mêlant la tradition yoruba et l'héritage européen. *Le lion et "
        "la perle* est aujourd'hui la plus jouée de ses pièces dans les "
        "écoles du continent.",
    ],
    encadre=("saviez", "Une comédie d'un futur prix Nobel", [
        "Soyinka a vingt-cinq ans quand la pièce est créée. Il en aura "
        "cinquante-deux quand il recevra le prix Nobel de littérature, en "
        "1986 — le premier décerné à un écrivain du continent africain.",
        "Entre les deux, il aura connu la prison : arrêté en 1967 pendant la "
        "guerre du Biafra pour avoir tenté une médiation, il passera plus de "
        "deux ans en détention, dont une longue période au secret. Il faut le "
        "savoir pour comprendre que la légèreté du *Lion et la perle* est un "
        "choix d'écrivain, non une naïveté d'auteur.",
    ]),
)

# ───────────────────────────────────────────────────────────────────── ngum
NGUM = dict(
    titre="2 bis. Repères chronologiques — les faits que la pièce met en scène",
    chrono=[
        ["1884", "Traité germano-douala : les chefs duala signent avec "
                 "l'Allemagne un accord qui garantit leurs terres."],
        ["vers 1873", "Naissance de Rudolf Duala Manga Bell. Il fera une "
                      "partie de ses études en Allemagne."],
        ["1908", "Il succède à son père à la tête du peuple duala."],
        ["1910", "Le gouverneur allemand approuve un plan d'expropriation : "
                 "déplacer la population duala loin du fleuve Wouri et créer "
                 "un quartier européen séparé."],
        ["1911-1913", "Manga Bell conteste au nom du traité de 1884. Il "
                      "obtient d'abord une suspension du plan, puis la "
                      "décision est renversée."],
        ["7 août 1914", "Procès."],
        ["8 août 1914", "Rudolf Duala Manga Bell est pendu à Douala, en même "
                        "temps que son secrétaire Ngoso Din."],
    ],
    paras=[
        "**La pièce repose sur des faits datés.** Ce n'est pas une fiction "
        "inspirée d'une époque : chaque étape du conflit qu'elle met en scène "
        "a eu lieu. L'expropriation du plateau Joss, le recours au traité de "
        "1884, l'appel à l'opinion allemande, l'arrestation, le procès "
        "expéditif et la pendaison sont attestés.",

        "**Le recours juridique avant la résistance.** Il faut insister sur "
        "ce point en classe, parce qu'il contredit l'image d'une résistance "
        "purement armée : Manga Bell commence par plaider. Il invoque un "
        "traité, saisit l'administration, cherche des appuis dans la presse "
        "et le parlement allemands. Ce n'est qu'après l'échec de ces recours "
        "qu'il se tourne vers d'autres peuples du territoire.",

        "**La date de l'exécution.** Le 8 août 1914 : la Première Guerre "
        "mondiale a commencé quelques jours plus tôt. La pièce ne l'invente "
        "pas — elle exploite cette coïncidence, qui explique la hâte du "
        "procès et l'absence de tout recours.",
    ],
    encadre=("saviez", "Un roi jugé en un jour", [
        "Le procès s'est tenu le 7 août 1914 ; la sentence a été exécutée le "
        "lendemain. Rudolf Duala Manga Bell a été pendu avec son secrétaire "
        "Ngoso Din, condamné dans la même affaire.",
        "L'accusation retenue était la trahison. La défense, elle, tenait en "
        "un document : le traité signé en 1884 entre les chefs duala et "
        "l'Allemagne, qui garantissait les terres. C'est ce texte que la "
        "pièce fait résonner d'un bout à l'autre, et c'est pourquoi les "
        "répliques de Dualla Manga sont si souvent des arguments de droit.",
    ]),
)

# ────────────────────────────────────────────────────────────────── tenebres
TENEBRES = dict(
    titre="2 bis. Repères chronologiques et postérité",
    chrono=[
        ["1857", "Naissance de Józef Teodor Konrad Korzeniowski, en Pologne "
                 "alors sous domination russe. Il n'apprendra l'anglais "
                 "qu'adulte."],
        ["1874-1889", "Marin, d'abord dans la marine marchande française, "
                      "puis britannique."],
        ["juin 1890", "Il signe à Bruxelles un contrat de trois ans et part "
                      "commander un vapeur sur le fleuve Congo."],
        ["décembre 1890", "Il rentre en Europe après six mois, gravement "
                          "malade. Le contrat de trois ans est rompu."],
        ["1899", "*Heart of Darkness* paraît en trois livraisons dans le "
                 "*Blackwood's Edinburgh Magazine*, en février, mars et "
                 "avril."],
        ["1885-1908", "Durée de l'État indépendant du Congo, possession "
                      "personnelle du roi Léopold II de Belgique."],
    ],
    paras=[
        "**Six mois, et un livre.** Conrad n'a pas passé des années au Congo : "
        "il y est resté six mois, en 1890, et en est revenu malade au point "
        "de rompre un contrat de trois ans. Le récit qu'il publie neuf ans "
        "plus tard n'est donc pas un reportage : c'est ce qu'un séjour bref "
        "et violent a laissé dans une mémoire.",

        "**Un roman écrit dans une langue apprise.** Le polonais est sa "
        "langue maternelle, le français sa deuxième langue ; il n'apprend "
        "l'anglais qu'adulte, en mer. Cela s'entend dans la phrase de "
        "Conrad — longue, tournée, jamais tout à fait idiomatique — et cela "
        "explique une part de son étrangeté.",

        "**Un livre discuté, et c'est un bon sujet.** En 1975, l'écrivain "
        "nigérian Chinua Achebe a mis en cause le roman, lui reprochant de "
        "réduire l'Afrique à un décor et les Africains à une masse sans "
        "parole. La critique est célèbre et elle a été discutée depuis. On ne "
        "la tranche pas en classe : on la pose, et l'on demande aux élèves de "
        "l'éprouver sur le texte, relevés à l'appui. C'est un excellent sujet "
        "de débat argumenté.",
    ],
    encadre=("saviez", "Ce que le livre ne dit pas", [
        "Le récit ne nomme jamais le Congo, ni la Belgique, ni Léopold II. La "
        "ville d'où part Marlow est seulement « une ville qui me fait toujours "
        "penser à un sépulcre blanchi ».",
        "Ce refus de nommer a deux effets contraires, et il faut les tenir "
        "ensemble. Il donne au récit une portée générale : c'est toute "
        "l'entreprise coloniale qui est visée, non un seul pays. Mais il "
        "efface aussi les responsabilités précises — et c'est l'un des "
        "reproches qui lui ont été adressés.",
    ]),
)

# ────────────────────────────────────────────────────────────────── tartuffe
TARTUFFE = dict(
    titre="2 bis. Chronologie de l'affaire Tartuffe",
    chrono=[
        ["12 mai 1664", "Une première version, en trois actes, est jouée à "
                        "Versailles devant le roi. Elle plaît au roi."],
        ["mai 1664", "La pièce est aussitôt interdite en public. La Compagnie "
                     "du Saint-Sacrement s'était employée, dès le mois "
                     "d'avril, à en empêcher la représentation."],
        ["1664", "Premier placet au roi : Molière demande l'autorisation de "
                 "jouer."],
        ["5 août 1667", "Une version remaniée est jouée au Palais-Royal sous "
                        "le titre *L'Imposteur*. Une seule représentation."],
        ["6 août 1667", "Le président de Lamoignon interdit les "
                        "représentations suivantes, en l'absence du roi parti "
                        "en campagne. Second placet."],
        ["5 février 1669", "Création de la version en cinq actes, au "
                           "Palais-Royal. Elle est enfin autorisée."],
        ["1669", "Publication, précédée d'une préface où Molière se défend "
                 "lui-même."],
    ],
    paras=[
        "**Cinq ans d'interdiction : ce n'est pas une anecdote.** C'est la "
        "clé de la pièce que nous lisons. Le texte de 1669 n'est pas celui de "
        "1664 : il a été remanié deux fois pour désarmer l'accusation "
        "d'impiété. C'est pourquoi Cléante y tient de si longs discours sur "
        "la vraie et la fausse dévotion, et pourquoi le dénouement fait "
        "intervenir le roi en personne.",

        "**Qui s'est opposé à la pièce.** La Compagnie du Saint-Sacrement, "
        "association dévote puissante et discrète, s'est employée dès avril "
        "1664 à empêcher les représentations. Molière n'affrontait donc pas "
        "l'Église en général, mais un parti organisé — nuance qu'un devoir "
        "doit faire.",

        "**Un succès à la mesure de l'attente.** Autorisée en février 1669, "
        "la pièce est jouée plus de quarante fois de suite au Palais-Royal, "
        "chiffre exceptionnel pour l'époque. Cinq ans d'interdiction avaient "
        "fait sa publicité.",
    ],
    encadre=("saviez", "Trois versions, un seul texte conservé", [
        "La version de 1664 comptait trois actes ; celle de 1667, remaniée, "
        "portait un autre titre — *L'Imposteur* — et un autre nom de "
        "personnage. Aucune des deux ne nous est parvenue.",
        "Nous ne lisons donc que le troisième état du texte, celui de 1669, "
        "écrit par un auteur qui savait exactement ce qui avait fait "
        "interdire les deux précédents. Toute la prudence de la pièce vient "
        "de là — et un candidat qui l'ignore prend pour de la tiédeur ce qui "
        "est une stratégie.",
    ]),
)

# ────────────────────────────────────────────────────────────────── sauvages
SAUVAGES = dict(
    titre="2 bis. Repères — l'événement, le livre, l'auteur",
    chrono=[
        ["13 mars 2016", "Attentat de Grand-Bassam, revendiqué par Al-Qaïda "
                         "au Maghreb Islamique. Le dossier joint au volume "
                         "donne le bilan : trente-trois blessés et dix-neuf "
                         "tués."],
        ["parmi les victimes", "Henrike Grohs, directrice du Goethe Institut "
                               "d'Abidjan, amie du poète. Le livre lui est "
                               "dédié."],
        ["2009", "*Zakwato*, recueil copublié avec le journaliste Azo "
                 "Vauguy."],
        ["2022", "*Poèmes sauvages éclairés au feu de brousse*, Abidjan, Les "
                 "Classiques Ivoiriens."],
    ],
    paras=[
        "**Un poème né d'une date.** Le livre ne cache pas son origine : il "
        "est écrit après le 13 mars 2016 et pour une morte nommée. C'est ce "
        "qui le distingue d'un recueil de circonstance — la circonstance y "
        "est le sujet, non le prétexte.",

        "**Deux dédicataires, et non un seul.** Le volume porte une dédicace "
        "à Séry Bailly, puis un « Pour Henrike Grohs, l'amie cousue à la mort "
        "le 13 mars 2016 ». Les élèves confondent souvent les deux : la "
        "première est un hommage à un aîné, la seconde désigne la personne "
        "dont le poème porte le deuil.",

        "**Vérifier les chiffres sur le livre, non sur le web.** Plusieurs "
        "sites en ligne donnent d'autres bilans de l'attentat, et une autre "
        "année de parution. Le dossier joint au volume dit trente-trois "
        "blessés, dix-neuf tués, et l'édition de 2022. C'est cette source-là "
        "que le cahier suit, et c'est la règle à enseigner : quand on écrit "
        "sur un livre, c'est le livre qui fait foi.",
    ],
    encadre=("saviez", "Un poème avec un dossier pédagogique", [
        "L'auteur a joint à son volume un dossier où il propose lui-même des "
        "activités : des exposés, et sept extraits à étudier, répartis sur "
        "douze séances d'une heure.",
        "Ce cahier suit ce découpage : six des sept extraits deviennent les "
        "six lectures méthodiques. Le septième, « Comme introduction », est "
        "traité dans l'analyse du paratexte, parce qu'il précède le poème et "
        "ne fait qu'une centaine de mots. Il est rare qu'un poète indique "
        "ainsi comment lire son livre : autant s'en servir.",
    ]),
)

# ─────────────────────────────────────────────────────────────────── stances
STANCES = dict(
    titre="2 bis. Repères chronologiques et postérité",
    chrono=[
        ["16 mars 1839", "Naissance de René-François-Armand Prudhomme à "
                         "Paris."],
        ["vers 1855", "Une ophtalmie interrompt ses études scientifiques et "
                      "l'écarte du métier d'ingénieur."],
        ["1865", "*Stances et Poèmes*, chez Alphonse Lemerre. Sainte-Beuve "
                 "en rend compte avec faveur ; « Le Vase brisé » devient "
                 "aussitôt célèbre."],
        ["1866", "Il figure au sommaire du *Parnasse contemporain*, aux côtés "
                 "de Leconte de Lisle et de Heredia."],
        ["1869", "Traduction du premier livre du *De rerum natura* de "
                 "Lucrèce."],
        ["1875 et 1879", "Gabriel Fauré met en musique « Ici-bas ! » puis "
                         "« Les Berceaux »."],
        ["1881", "Élection à l'Académie française."],
        ["1901", "Premier prix Nobel de littérature décerné."],
        ["6 septembre 1907", "Mort à Châtenay-Malabry."],
    ],
    paras=[
        "**Un premier livre qui réussit tout de suite.** Sully Prudhomme a "
        "vingt-six ans en 1865 et personne ne le connaît. Le compte rendu de "
        "Sainte-Beuve, alors le critique le plus écouté de France, le fait "
        "entrer d'un coup dans la vie littéraire. C'est un cas rare, et il "
        "explique la place que le recueil occupe dans son œuvre.",

        "**Une célébrité qui s'est réduite à un poème.** De cent huit pièces, "
        "le public n'a retenu que « Le Vase brisé ». Les anthologies "
        "scolaires l'ont reproduit pendant des décennies, et c'est en grande "
        "partie sur lui que reposait la réputation du poète en 1901.",

        "**Un prix Nobel contesté.** L'attribution du premier prix Nobel de "
        "littérature à Sully Prudhomme, en 1901, fit scandale : beaucoup "
        "attendaient qu'il allât à Tolstoï, vivant et immense. Des écrivains "
        "suédois adressèrent à Tolstoï une lettre pour marquer leur "
        "désaccord. La postérité leur a plutôt donné raison — ce qui rend le "
        "dernier poème du recueil, où l'auteur doute d'être poète, d'une "
        "ironie singulière.",
    ],
    encadre=("saviez", "Ce que l'Académie suédoise a salué", [
        "En 1901, le comité Nobel distingue une œuvre qui témoigne, selon sa "
        "formule, « d'un idéalisme élevé, d'une perfection artistique et "
        "d'une rare association des qualités du cœur et de l'esprit ».",
        "La formule dit exactement ce que ce cahier essaie de faire "
        "comprendre : chez ce poète, la perfection de la forme et l'émotion "
        "ne s'opposent pas. C'est une bonne citation à garder pour une "
        "introduction de dissertation — à condition de l'attribuer "
        "correctement, au comité Nobel et non au poète.",
    ]),
)

# ────────────────────────────────────────────────────────────────── balafon
BALAFON = dict(
    titre="2 bis. Repères chronologiques et postérité",
    chrono=[
        ["1930", "Naissance d\u2019Engelbert Mveng au Cameroun."],
        ["1956", "« Ostende-Douvre », le plus ancien poème daté du recueil. "
                 "« Marcinelle, 1956 » porte la date de la catastrophe minière "
                 "belge dans son titre même."],
        ["1958-1964", "Les poèmes s\u2019écrivent au fil des voyages et des "
                      "séjours : « Dépaysement » (1958), « Adamawa » (1959), "
                      "« Mappemonde » (1961), « Épiphanie » (1962), "
                      "« Offrande » (1963), « Pentecôte sur l\u2019Afrique » et "
                      "« Mère » (1964)."],
        ["1963-1969", "Travaux d\u2019historien et d\u2019historien de l\u2019art : "
                      "*Histoire du Cameroun* (1963), *L\u2019art d\u2019Afrique noire* "
                      "(1964), *Art nègre, art chrétien* (1969)."],
        ["1970-1971", "« New York » (1970), « Moscou » et « Tu reviendras, "
                      "Sénégal ! » (1971) : les trois pièces les plus tardives."],
        ["1972", "Publication de *Balafon*."],
        ["23 avril 1995", "Mveng meurt assassiné à Yaoundé."],
    ],
    paras=[
        "**Un recueil composé sur seize ans.** Les dates portées sous les "
        "poèmes vont de 1956 à 1971 : *Balafon* n\u2019est pas écrit d\u2019un jet, "
        "c\u2019est un livre rassemblé. Cela explique la variété des lieux \u2014 la "
        "Manche, la Belgique, New York, Moscou, l\u2019Adamaoua, le Sénégal \u2014 et "
        "la constance du propos.",

        "**Un poète qui était aussi historien.** Avant *Balafon*, Mveng avait "
        "publié une *Histoire du Cameroun* et *L\u2019art d\u2019Afrique noire*. Les "
        "noms de royaumes et de peuples qui traversent les poèmes \u2014 Koumbi, "
        "Ghana, Couschân, les Incas, les Chichimèques \u2014 ne sont pas décoratifs : "
        "ils viennent d\u2019un savoir.",

        "**Ce que le titre engage.** Le balafon est un instrument à lames de "
        "bois. Le paratexte du volume le présente comme « instrument de "
        "communication, véhicule à la fois du plaisir et de la parole ». Le "
        "recueil se donne donc pour un message porté, non pour une confidence.",
    ],
    encadre=("saviez", "Un livre composé sur seize ans", [
        "Presque chaque poème porte sa date : 1956 pour « Ostende-Douvre » et "
        "« Marcinelle », 1971 pour « Moscou » et « Tu reviendras, Sénégal ! ». "
        "Entre les deux, quinze ans de voyages et de travaux.",
        "C\u2019est un fait à exploiter en classe. Un recueil rassemblé n\u2019a pas la "
        "même unité qu\u2019un livre écrit d\u2019un trait : ce qui fait tenir *Balafon* "
        "n\u2019est pas une intrigue ni une chronologie, mais un geste répété \u2014 "
        "l\u2019Afrique qui s\u2019adresse au monde.",
    ]),
)

PAR_CAHIER = {
    "vieuxnegre": VIEUXNEGRE,
    "lionperle": LIONPERLE,
    "ngum": NGUM,
    "tenebres": TENEBRES,
    "tartuffe": TARTUFFE,
    "sauvages": SAUVAGES,
    "stances": STANCES,
    "balafon": BALAFON,
}


def blocs(cle):
    """Les blocs à insérer dans la section II du cahier, ou rien."""
    c = PAR_CAHIER.get(cle)
    if not c:
        return []
    b = [("h2", c["titre"]),
         ("grille", [["Date", "Fait"]] + [list(l) for l in c["chrono"]])]
    b += [("p", p) for p in c["paras"]]
    typ, titre, corps = c["encadre"]
    b.append(("encadre", typ, titre, corps))
    return b
