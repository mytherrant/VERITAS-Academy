# -*- coding: utf-8 -*-
"""5ᵉ — *N'koum-wam* : écrire, jouer, s'évaluer.

Une comédie apprend trois choses qu'aucun roman n'apprend aussi bien : faire
**parler** (réplique et didascalie), **plaider** (défendre un candidat devant
une assemblée), et **prescrire** (le protocole d'une cérémonie, qui est un
texte injonctif à l'état pur). Les trois ateliers d'ici sont là.
"""
import jeux
import source
from gabarit import (epreuve_etude_texte, epreuve_expression,
                     epreuve_orthographe, production)
from kit import enc, grille, h2, h3, p, saut

CLE = "nkumwam"
SRC = ("David Massoma Pandong, *N'koum-wam, le huitième notable*, "
       "Afrédit, Yaoundé, 2024")
BORNES = ["Acte I", "Acte II", "Acte III", "Acte IV", "Acte V", "Glossaire",
          "Notes pédagogiques", "Personnages", "Préface"]


# ==================================================== 5. Les productions

def partie5():
    b = [h2("5. J'écris — faire parler, plaider, prescrire"),
         p("Trois ateliers, et trois choses que le théâtre enseigne mieux que "
           "tout : écrire une **scène**, écrire un **plaidoyer**, écrire un "
           "**protocole**.")]

    b += production(
        "la scène de théâtre (réplique et didascalie)",
        "écrire une scène de théâtre où l'on voit et l'on entend les "
        "personnages.",
        modele=(
            "**LE CHEF DU QUARTIER**, *(assis sur un tabouret, un éventail à "
            "la main)* : ❶ Alors, mon fils ? On me dit que tu veux ouvrir un "
            "commerce sur ma place.\n"
            "**ZACHARIE**, *(debout, tordant son bonnet entre ses doigts)* : "
            "❷ Une petite table, papa. Rien qu'une petite table.\n"
            "**LE CHEF**, *(sans lever les yeux)* : ❸ Une petite table "
            "aujourd'hui. Et demain ?\n"
            "**ZACHARIE** : ❹ Demain aussi une petite table.\n"
            "*(Le chef se met à rire. Les vieux assis autour rient avec lui. "
            "Zacharie ne rit pas.)*\n"
            "**LE CHEF**, *(cessant de rire d'un coup)* : ❺ Reviens lundi.\n"
            "❻ *(Zacharie salue et sort. Le chef reprend son éventail. "
            "Personne ne dit plus rien.)*"),
        annotations=[
            ["❶ La réplique qui ouvre",
             "Elle installe la situation **et** le rapport de force : « mon "
             "fils », « ma place »."],
            ["❷ La réplique du plus faible",
             "Courte, répétée, humble. Le geste — le bonnet tordu — dit "
             "l'angoisse."],
            ["❸ ❹ L'échange serré",
             "Deux répliques de six mots. Le dialogue accélère : c'est là "
             "qu'on sent la tension."],
            ["Les didascalies de geste",
             "*assis*, *debout*, *sans lever les yeux*. **Un chef assis qui "
             "ne lève pas les yeux** en dit plus que dix adjectifs."],
            ["❺ La réplique qui tranche",
             "Trois mots, et sans réponse possible."],
            ["❻ La didascalie de sortie",
             "Elle referme la scène. « Personne ne dit plus rien » : le "
             "silence est une réplique."]],
        questions=[
            "Relève toutes les **didascalies**. Range-les en trois colonnes : "
            "gestes / position / ton.",
            "Compte les mots de chaque réplique. Qui parle le plus court ? "
            "Que révèle cette différence ?",
            "Que fait le chef pendant que Zacharie parle ? En quoi ce détail "
            "est-il humiliant ?",
            "Supprime toutes les didascalies et relis. Que reste-t-il ? "
            "Comprend-on encore qui domine ?",
            "Retrouve dans l'acte II de la pièce les didascalies qui décrivent "
            "l'humeur du chef Maya. Recopies-en quatre, dans l'ordre."],
        regle=[
            "Une scène de théâtre s'écrit ainsi : **le nom du personnage** (en "
            "capitales ou en gras), **deux points**, puis sa **réplique**.",
            "Les **didascalies** — en *italique*, souvent entre parenthèses — "
            "indiquent le décor, les entrées et sorties, les gestes, le ton. "
            "**Elles ne sont jamais prononcées.**",
            "Un bon dialogue de théâtre **montre le rapport de force** : qui "
            "parle long et qui parle court, qui est assis et qui est debout, "
            "qui regarde et qui baisse les yeux.",
            "Une scène commence quand un personnage **entre** et finit quand "
            "il **sort**."],
        exercices=[
            "**Transforme.** Voici un récit ; réécris-le en scène de théâtre "
            "avec didascalies : « Le marchand refusa de baisser son prix. La "
            "cliente insista trois fois, puis s'en alla furieuse. Le marchand "
            "la rappela au dernier moment. »",
            "**Ajoute les didascalies.** Le professeur te donnera une scène "
            "sans indications : ajoute une didascalie de décor, quatre de "
            "geste et trois de ton.",
            "**Écris seul.** Écris une scène de douze répliques entre **deux "
            "personnages dont l'un a besoin de l'autre**. Au choix : un élève "
            "et un surveillant, un vendeur et un client, un jeune et son "
            "oncle. Obligatoire : une didascalie de décor au début, une de "
            "sortie à la fin, et une réplique de trois mots qui tranche.",
            "**Joue-la.** À deux devant la classe. Un troisième élève lit les "
            "didascalies à voix haute : la classe doit deviner, sans "
            "explication, qui des deux est le plus fort."],
        astuce=("Le secret des grandes scènes : la longueur des répliques", [
            "Deux personnages qui parlent la même longueur sont **à égalité**.",
            "Un personnage qui parle trois fois plus long que l'autre "
            "**domine** — ou bien il se noie, s'il parle pour se justifier.",
            "Des répliques qui **raccourcissent** de page en page annoncent "
            "une explosion. Des répliques qui **s'allongent** annoncent un "
            "discours.",
            "Vérifie-le dans la pièce : les notables parlent en longues "
            "tirades ; les réponses en chœur font trois mots. C'est ce "
            "contraste qui donne le rythme de tambour."]))

    b += production(
        "le plaidoyer (défendre une candidature)",
        "défendre quelqu'un devant une assemblée, avec un principe, des faits "
        "et une réponse aux objections.",
        modele=(
            "❶ Chers camarades, je propose Awono comme chef de classe.\n"
            "❷ Nos aînés disent : « On ne confie pas la calebasse à celui qui "
            "a soif. » Il faut donc, à cette place, quelqu'un qui n'y cherche "
            "rien pour lui-même.\n"
            "❸ Or Awono est le seul, dans cette salle, à avoir balayé la "
            "classe pendant trois semaines sans qu'on le lui demande, et sans "
            "en parler à personne. C'est Madame qui l'a découvert.\n"
            "❹ On me dira qu'il n'a pas les meilleures notes. C'est vrai. "
            "Mais un chef de classe ne corrige pas les devoirs : il fait "
            "tenir un groupe debout. Et cela, il l'a déjà prouvé.\n"
            "❺ Voilà pourquoi je propose Awono, et voilà pourquoi je "
            "voterai pour lui."),
        annotations=[
            ["❶ L'annonce",
             "Une phrase. On sait tout de suite pour qui l'on parle."],
            ["❷ Le principe partagé",
             "Un **proverbe** que personne ne contestera. C'est le procédé "
             "d'Ekango dans la pièce."],
            ["❸ Le fait vérifiable",
             "Pas un adjectif : **un fait**, daté, avec un témoin."],
            ["❹ L'objection, dite par moi-même",
             "On reconnaît la faiblesse, puis on montre qu'elle ne compte pas "
             "**pour ce poste-là**."],
            ["❺ La reprise",
             "On répète le nom, et l'on ajoute un engagement personnel."]],
        questions=[
            "Repère les cinq étapes dans la marge. Laquelle est la plus "
            "courte ?",
            "Pourquoi commencer par un proverbe plutôt que par les qualités "
            "du candidat ?",
            "Quelle différence y a-t-il entre « Awono est serviable » et "
            "l'étape ❸ ? Laquelle convainc, et pourquoi ?",
            "Que gagne-t-on à énoncer soi-même l'objection ?",
            "Retrouve les mêmes cinq étapes dans le discours d'Ekango en "
            "faveur d'Edièlè (acte I). Recopie, pour chacune, la phrase "
            "correspondante de la pièce."],
        regle=[
            "Un plaidoyer se bâtit en cinq temps : **annonce → principe "
            "partagé → faits vérifiables → réponse à l'objection → reprise**.",
            "Un **fait daté avec un témoin** vaut dix adjectifs. « Il est "
            "généreux » ne prouve rien ; « il a payé la craie de la classe en "
            "octobre » prouve.",
            "**Énoncer soi-même l'objection** est la marque des bons "
            "orateurs : cela désarme l'adversaire et montre qu'on a réfléchi.",
            "Les mots de liaison portent la construction : *or, en effet, on "
            "me dira que, c'est vrai, mais, voilà pourquoi*."],
        exercices=[
            "**Transforme en faits.** Remplace chaque adjectif par un fait "
            "daté : *il est courageux · elle est honnête · il est travailleur "
            "· elle est juste*.",
            "**Trouve l'objection.** Pour chacune de ces candidatures, écris "
            "l'objection qu'on fera **et** la réponse : *le plus fort du "
            "village · la plus riche · le plus âgé · le plus instruit*.",
            "**Écris seul.** Rédige en quinze lignes un plaidoyer pour **un "
            "candidat de la pièce** — Eyango, Edièlè, Essouman, Ndéma, Etamè "
            "ou Essokè — en respectant les cinq étapes. Interdiction "
            "d'inventer : tous tes faits doivent venir du texte.",
            "**Le grand conseil.** Six élèves plaident, chacun pour un "
            "candidat. La classe joue les notables et vote. Puis on relit "
            "l'acte V — et l'on compte combien d'entre vous avaient pensé à "
            "Kwangué."])

    b += production(
        "le texte injonctif (le protocole d'une cérémonie)",
        "écrire un protocole que quelqu'un pourrait suivre sans moi.",
        modele=(
            "**Protocole d'accueil d'un hôte de marque à la chefferie**\n"
            "❶ Il faut : deux joueurs de tam-tam, une natte neuve, une "
            "calebasse de vin de palme, un panier de kolas, quatre jeunes "
            "porteurs.\n"
            "❷ ❸ Dispose la natte à l'entrée de la cour, jamais à "
            "l'intérieur. Poste les tambourineurs à droite. Envoie deux "
            "jeunes au-devant de l'hôte, dès qu'on l'aperçoit au tournant. "
            "Fais annoncer son nom **avant** son arrivée dans la cour. "
            "Présente-lui la calebasse **des deux mains**, puis les kolas.\n"
            "❹ L'hôte est reçu quand il a bu la première gorgée : c'est à ce "
            "moment, et pas avant, que les tambours peuvent reprendre.\n"
            "❺ Attention : ne fais jamais entrer un hôte par la porte "
            "arrière, et ne lui présente pas la calebasse d'une seule main — "
            "il y verrait un mépris."),
        annotations=[
            ["❶ Le nécessaire", "Y compris les personnes."],
            ["❷ L'ordre, strict",
             "*Dispose → poste → envoie → fais annoncer → présente*. Aucun "
             "échange possible."],
            ["❸ L'impératif",
             "Deuxième personne du singulier. **Pas de *tu*, pas de *il "
             "faut*** dans le corps du protocole."],
            ["❹ Le moment charnière",
             "Un protocole doit dire **quand** une étape est accomplie."],
            ["❺ Les interdits, avec leur raison",
             "Deux interdits, chacun expliqué. Sans le pourquoi, personne "
             "n'obéit."]],
        questions=[
            "Relève tous les verbes. À quel mode sont-ils ? Comment le "
            "reconnais-tu ?",
            "Quelles étapes ne peuvent pas être échangées ? Explique ce qui se "
            "passerait.",
            "Relève les mots qui marquent le temps et l'ordre.",
            "Pourquoi les interdits sont-ils placés à la fin ?",
            "Relis la première didascalie de l'acte IV de la pièce. Elle "
            "décrit une cérémonie réelle. Fais-en la liste des éléments : les "
            "sièges, les vêtements du chef, ceux des notables, les soldats, "
            "les danses, les chèvres, les caisses de vin."],
        regle=[
            "Un texte injonctif **fait agir** : protocole, recette, règle du "
            "jeu, mode d'emploi, consigne.",
            "Ses verbes sont à l'**impératif** ou à l'**infinitif** — jamais "
            "les deux mélangés dans un même texte.",
            "**À l'impératif, 2ᵉ personne du singulier, les verbes du 1ᵉʳ "
            "groupe ne prennent pas de *s*** : *dispose*, *poste*, *présente* "
            "— sauf devant *en* et *y* (*présentes-en*).",
            "Un protocole complet comporte : le **matériel et les "
            "personnes**, les **étapes dans l'ordre**, le **signe que "
            "l'étape est accomplie**, les **interdits avec leur raison**."],
        exercices=[
            "**Conjugue à l'impératif** (2ᵉ pers. sing.) : *disposer, poster, "
            "envoyer, présenter, aller, faire, être, savoir*.",
            "**Corrige.** Cinq formes sont fautives : *disposes la natte · "
            "poste les tambours · envoies deux jeunes · présente la calebasse "
            "· fais annoncer · vas chercher le vin · sois patient · "
            "présentes-en une autre*.",
            "**Ajoute la raison.** Complète chaque interdit : *Ne touche pas "
            "au foie de la chèvre, parce que… · N'entre pas dans la forêt "
            "sacrée, car… · Ne siffle pas la nuit, sinon…*",
            "**Écris seul.** Rédige le protocole d'une cérémonie que tu "
            "connais : une remise de prix, un baptême, un mariage, une rentrée "
            "des classes. Matériel, cinq étapes numérotées, un signe "
            "d'accomplissement, deux interdits motivés. Un camarade doit "
            "pouvoir l'organiser sans te parler."])

    b.append(saut())
    return b


# ============================================================ 6. Je joue

def partie6():
    b = [h2("6. Je joue et je révise"), p("Livre fermé, rideau baissé.")]
    corriges = []

    e, c = jeux.mots_meles("Le village de Kekem", [
        "Kekem", "Sanzo", "Lelem", "Njezou", "Banguem", "Nguti", "Ngono",
        "Nkamba", "Ahon", "notable", "Maya", "Emambo", "Ebodiam", "Ekah",
        "Elong", "Essoua", "Ekango", "Epanlo", "Kwangue", "Eyango", "Ediele",
        "Douma", "Gnama", "Mbola", "kola", "calebasse"], graine=127)
    b += e
    corriges += c

    e, c = jeux.mots_croises("Les mots du théâtre et de la pièce", [
        ("REPLIQUE", "Ce qu'un personnage dit sur scène"),
        ("DIDASCALIE", "L'indication en italique, jamais prononcée"),
        ("ACTE", "Grande partie de la pièce ; il y en a cinq"),
        ("COMEDIE", "Le genre annoncé par le sous-titre"),
        ("DENOUEMENT", "Le moment où tout s'explique"),
        ("NOTABLE", "Membre du conseil du chef"),
        ("NGONO", "La danse des Mbo, connue dans le monde entier"),
        ("MARABOUT", "Ce qu'est Ehob-Gnama, du village Sanzo"),
        ("KOLA", "La noix qui circule pendant la séance"),
        ("SERMENT", "Ce que Kwangué fait prêter à ceux qui l'ont méprisé"),
        ("ADAGE", "Autre mot pour proverbe ; l'arme d'Ekango"),
        ("APPARENCE", "Ce sur quoi tout le monde s'est trompé"),
    ], graine=71)
    b += e
    corriges += c

    e, c = jeux.qcm("As-tu lu les cinq actes ?", [
        ("Depuis combien de temps N'koum Epié est-il mort, au lever du "
         "rideau ?", ["un mois", "six mois", "un an", "dix ans"], 2),
        ("Qu'est-ce qui distingue le N'koum-wam des sept autres notables ?",
         ["il est le plus âgé", "sa charge ne s'hérite pas de père en fils",
          "il commande les soldats", "il remplace le chef en son absence"], 1),
        ("Qui le N'koum-wam doit-il obligatoirement épouser ?",
         ["la reine", "une fille de sang royal", "une étrangère",
          "la fille d'un notable"], 1),
        ("Quel notable propose Kwangué ?",
         ["N'koum Elong", "N'koum Ekango", "N'koum Ekah", "N'koum Samè"], 2),
        ("Que fait Douma, le coursier, en plus de servir les plats ?",
         ["il garde la forêt sacrée", "il note tous les dons dans un cahier",
          "il conduit les danses", "il transmet les messages du marabout"], 1),
        ("Pourquoi Epanlo soutient-il l'administrateur Etamè ?",
         ["c'est son neveu", "Etamè a promis de faire du chef le maire de "
          "Kekem", "Etamè est le plus instruit", "le marabout l'a dit"], 1),
        ("Combien de temps Kwangué a-t-il disparu du village ?",
         ["une semaine", "un mois", "trois mois", "un an"], 2),
        ("Quel surnom le chef donne-t-il à Kwangué, en pidgin ?",
         ["big man", "get sense pass all", "no man pass am",
          "small no be sick"], 1),
    ])
    b += e
    corriges += c

    e, c = jeux.vrai_faux("Vrai ou faux à la chefferie", [
        ("Les sept notables ont chacun une fonction précise.", True,
         "Culture, salubrité, économie, santé et eau, conflits, coutumes, "
         "porte-parole."),
        ("Le chef écoute ses notables avant de décider de la sentence "
         "d'Ekah.", False,
         "Il annonce à l'avance qu'il ne tolérera aucune complaisance : la "
         "sentence est décidée avant les débats."),
        ("Kwangué obtient la place grâce à un pouvoir magique.", False,
         "Il obtient la place par un plan : trois mois d'absence, un marabout, "
         "des cadeaux, un serment. La pièce le dit explicitement."),
        ("Les notables regrettent, à la fin, d'avoir méprisé Kwangué.", True,
         "Le chef lui-même s'excuse auprès d'Ekah et reconnaît s'être fié aux "
         "apparences."),
        ("Le chef revient sur sa parole quand il comprend la ruse.", False,
         "Il refuse : « j'ai donné ma parole et je n'y reviendrai point »."),
        ("Ce que Kwangué a exploité, c'est le respect des ancêtres.", False,
         "Samè corrige lui-même : « Non. On craint plutôt la mort ! »"),
    ])
    b += e
    corriges += c

    e, c = jeux.remise_en_ordre("La pièce, acte par acte", [
        "Le chef demande à ses sept notables de proposer chacun un candidat.",
        "Ekah propose Kwangué, un jeune désœuvré ; le chef s'estime offensé.",
        "On juge Ekah pour avoir pris la mission à la légère.",
        "Ekah fait la synthèse des six candidatures retenues, et le "
        "marchandage commence.",
        "La cour se remplit de chèvres et de caisses de vin apportées par un "
        "inconnu.",
        "Le voile tombe : Kwangué est le nouveau N'koum-wam, et il épouse la "
        "princesse.",
    ], graine=73)
    b += e
    corriges += c

    e, c = jeux.qui_suis_je("Devine qui parle", [
        ("Je suis pédagogique, j'explique tout deux fois, et je siège sur un "
         "trône en bois d'ébène.", "Sambo Maya, le chef"),
        ("Je suis en charge des danses, j'oublie exprès l'essentiel pour qu'on "
         "me le réclame, et mon candidat a donné le Ngono au monde.",
         "N'koum Essoua"),
        ("Je raisonne par proverbes, et le mien parle d'une cour où le gazon "
         "a toujours poussé.", "N'koum Ekango"),
        ("J'ai risqué la guillotine pour avoir proposé un chômeur, et j'ai eu "
         "raison à la fin.", "N'koum Ekah"),
        ("Je note dans un cahier tous les dons qui arrivent au chef.",
         "Douma, le coursier"),
        ("J'ai disparu trois mois, je suis revenu couvert d'un pagne noir, et "
         "j'épouse la princesse.", "Kwangué"),
    ])
    b += e
    corriges += c

    b += jeux.carte_mentale(
        "N'koum-wam, le huitième notable", "N'KOUM-WAM",
        [("Le genre", ["comédie en cinq actes", "répliques et didascalies",
                       "un dénouement qui retourne tout"]),
         ("Les personnages", ["un chef et sept notables",
                              "sept candidats, un seul méprisé",
                              "un marabout et son porte-parole"]),
         ("Les lieux", ["la forêt sacrée de la chefferie",
                        "la place des cérémonies", "Kekem, Sanzo, Lelem"]),
         ("Les thèmes", ["juger sur les apparences", "la peur de la mort",
                         "les dons aux décideurs", "se marier par amour"]),
         ("Les procédés", ["l'appel et la réponse en chœur",
                           "le proverbe comme argument",
                           "le solennel mêlé au trivial"]),
         ("Ma question au livre", ["…", "…"])])

    b.append(saut())
    return b, corriges


# ======================================================== 7. Je m'évalue

ORTHO_FAUTIF = (
    "Le jour de l'intronisation, tout le village de Kekem c'était rassamblé "
    "sur la place des ceremonies. Les tam-tams résonnait depuis l'aube les "
    "femmes lançaient des youyous. Sous le hanguar, le chef et ses sept "
    "notables attendaient, vêtus de pagnes noir et coiffés de bonets rouges. "
    "Le siège du huitième notable restait vide. Personne ne savait encore qui "
    "viendrait s'y asseoir. Les danseurs se tremoussaient au milieu de la "
    "cour, et des chèvres déambulait entre les caisses de vin. Quand le "
    "porte-parole entra en courant, les tambours se taisirent d'un seul coup. "
    "Il cria trois fois sont appel, et la foule lui répondit. Alors ont vit "
    "s'avancer un inconu couvert d'un pagne noir des pieds à la tête. Les "
    "notables se levèrent malgré eux : ils avait compris que cette journée "
    "resterait dans les memoires.")

ORTHO_CORRIGE = [
    ["1", "des **ceremonies**", "des **cérémonies**", "accents manquants",
     "0,5"],
    ["2", "depuis l'aube **_** les femmes", "depuis l'aube **;** les femmes",
     "point-virgule manquant", "0,5"],
    ["3", "se **tremoussaient**", "se **trémoussaient**", "accent manquant",
     "0,5"],
    ["4", "dans les **memoires**", "dans les **mémoires**", "accents "
     "manquants", "0,5"],
    ["5", "**rassamblé**", "**rassemblé**", "orthographe d'usage", "1"],
    ["6", "le **hanguar**", "le **hangar**", "orthographe d'usage", "1"],
    ["7", "de **bonets** rouges", "de **bonnets** rouges",
     "orthographe d'usage : deux *n*", "1"],
    ["8", "un **inconu**", "un **inconnu**",
     "orthographe d'usage : deux *n*", "1"],
    ["9", "Les tam-tams **résonnait**", "… **résonnaient**",
     "accord sujet-verbe", "2"],
    ["10", "vêtus de pagnes **noir**", "… de pagnes **noirs**",
     "accord de l'adjectif", "2"],
    ["11", "des chèvres **déambulait**", "des chèvres **déambulaient**",
     "accord sujet-verbe", "2"],
    ["12", "ils **avait** compris", "ils **avaient** compris",
     "accord de l'auxiliaire avec le sujet", "2"],
    ["13", "Kekem **c'était** rassamblé", "Kekem **s'était** rassemblé",
     "homophone : *s'était* = se + était", "2"],
    ["14", "trois fois **sont** appel", "trois fois **son** appel",
     "homophone : *son* est un déterminant possessif", "2"],
    ["15", "Alors **ont** vit", "Alors **on** vit",
     "homophone : *on* est le sujet du verbe", "2"],
]


def partie7():
    b = [h2("7. Je m'évalue — trois épreuves")]
    corriges = []

    texte = source.extrait(
        CLE, "Vous voyez bien comme moi que les choses sont telles",
        mots=330, arret=[t for t in BORNES if t != "Acte IV"])
    b += epreuve_etude_texte(
        "Le jour des chèvres (acte IV)",
        chapeau="Cet acte n'a pas été étudié en classe : c'est ta lecture "
                "personnelle qui parle. La cour royale est envahie de chèvres "
                "et de caisses de vin apportées par un candidat dont on ignore "
                "encore le nom. Le chef et ses notables commentent, sous le "
                "hangar de la tribune.",
        texte=texte, source=SRC,
        comprehension=[
            ("Qu'est-ce qui étonne le chef et ses notables ? Réponds en une "
             "phrase.", "2"),
            ("Relève la comparaison employée par Essoua pour dire le nombre "
             "des chèvres et des caisses.", "2"),
            ("Quel proverbe Ngalé cite-t-il ? Que veut-il dire, appliqué à "
             "cette journée ?", "2"),
            ("Quelle règle de la tradition Elong rappelle-t-il à propos du "
             "foie de chèvre ? Que répond Ekah ?", "2"),
            ("Explique le proverbe : « Si tu as la chance de vivre longtemps, "
             "alors tu finiras par manger ton plantain avec du foie de "
             "chèvre. »", "2")],
        langue=[
            ("Relève quatre verbes conjugués et donne leur infinitif et leur "
             "temps.", "2"),
            ("« Les jours de fête sont jours de salut pour les orphelins. » "
             "Donne la nature et la fonction de chaque groupe de cette "
             "phrase.", "2"),
            ("Réécris « Des chèvres déambulent dans le village » au passé "
             "composé, puis à la forme négative.", "2"),
            ("Relève une phrase interrogative et une phrase exclamative. "
             "Donne, pour chacune, sa ponctuation finale et ce qu'elle "
             "exprime.", "2"),
            ("Trouve dans le texte trois mots du champ lexical de la fête.",
             "2")])
    corriges += [h3("Épreuve 1 — Étude de texte : éléments de corrigé"),
                 grille([["Question", "Ce qu'on attend", "Pts"],
                         ["I.1", "La quantité inouïe de chèvres et de caisses "
                          "de vin rouge apportées dans la cour : Douma les "
                          "avait annoncées, mais les notables ne le croyaient "
                          "pas.", "2"],
                         ["I.2", "« Des chèvres et des caisses de vin en aussi "
                          "grand nombre que les arbres dans une forêt "
                          "dense ! »", "2"],
                         ["I.3", "« Les jours de fête sont jours de salut pour "
                          "les orphelins » : dans une telle abondance, les "
                          "plus pauvres du village mangeront et boiront à leur "
                          "faim, car rien ne pourra être contrôlé.", "2"],
                         ["I.4", "Le foie de chèvre est « la propriété "
                          "exclusive des anciens ». Ekah répond qu'on ne peut "
                          "pas respecter la tradition à tous les coups : il "
                          "faudrait des mois aux anciens — de moins en moins "
                          "nombreux — pour consommer autant de foies.", "2"],
                         ["I.5", "Comme le foie de chèvre est réservé aux "
                          "anciens, il faut avoir vécu longtemps pour y avoir "
                          "droit : le proverbe fait de la longue vie une "
                          "chance, celle de connaître des choses rares.", "2"],
                         ["II.1", "Ex. : *voyez* (voir, présent) ; *a "
                          "décrites* (décrire, passé composé) ; *disaient* "
                          "(dire, imparfait) ; *rends* (rendre, présent).",
                          "2"],
                         ["II.2", "*Les jours de fête* : groupe nominal, sujet "
                          "— *sont* : verbe être, 3ᵉ pers. pluriel — *jours de "
                          "salut pour les orphelins* : groupe nominal, "
                          "attribut du sujet.", "2"],
                         ["II.3", "Passé composé : *Des chèvres ont déambulé "
                          "dans le village.* — Négative : *Des chèvres ne "
                          "déambulent pas dans le village.*", "2"],
                         ["II.4", "Interrogative : « Qu'allons-nous faire de "
                          "tout ça ? » — point d'interrogation, exprime la "
                          "question. Exclamative : « Du jamais vu, A'Sambo "
                          "Maya ! » — point d'exclamation, exprime "
                          "l'étonnement.", "2"],
                         ["II.5", "Ex. : *fête, tam-tams, danseurs, "
                          "acclamations, youyous, vin*.", "2"]])]

    b += epreuve_orthographe(ORTHO_FAUTIF,
                             "Texte composé pour l'épreuve, dans la manière de "
                             "la pièce", nb_fautes=15)
    corriges += [h3("Épreuve 2 — Correction orthographique : corrigé"),
                 grille([["N°", "Écrit dans le texte", "Correction",
                          "Pourquoi", "Pts"]] + ORTHO_CORRIGE),
                 ("p", "**Total : 20 points.** Retirer **0,5 point** par mot "
                  "correct barré à tort.")]

    b += epreuve_expression([
        {"type": "Scène de théâtre",
         "contexte": "Dans la pièce, on juge un homme pour avoir présenté un "
                     "candidat que tout le monde méprisait. Le chef annonce sa "
                     "sévérité avant même d'avoir écouté l'accusé.",
         "citation": source.extrait(
             CLE, "Maintenant, je vous donne la parole",
             arrivee="à votre infortuné collègue !"),
         "source": SRC,
         "taches": [
             "Écris une **scène de théâtre** de vingt-cinq à trente lignes.",
             "Une assemblée doit juger quelqu'un qui a proposé une idée que "
             "tous trouvent ridicule — et qui a peut-être raison.",
             "**Obligatoire :** une didascalie de décor au début ; au moins "
             "trois personnages ; six didascalies de geste ou de ton ; une "
             "réponse en chœur employée deux fois ; un proverbe cité par un "
             "personnage ; une réplique de moins de cinq mots qui tranche."],
         "bareme": [["La présentation théâtrale est correcte (noms, deux "
                     "points, italiques)", "4"],
                    ["Les didascalies sont utiles et variées", "4"],
                    ["Le rapport de force est visible dans les répliques",
                     "4"],
                    ["Orthographe et ponctuation", "4"],
                    ["Présentation, écriture lisible, longueur respectée",
                     "4"]]},
        {"type": "Argumentation",
         "contexte": "À la fin de la pièce, le chef reconnaît qu'on avait "
                     "écarté Kwangué « juste en considération des "
                     "apparences ». Et le porte-parole conclut : « Laissons "
                     "désormais nos enfants se marier par amour ! »",
         "citation": source.extrait(
             CLE, "Kwangué est le nouveau N", arrivee="des apparences !"),
         "source": SRC,
         "taches": [
             "Produis un texte **argumentatif** de vingt à vingt-cinq lignes.",
             "Sujet : *« Faut-il choisir un responsable pour ce qu'il possède "
             "ou pour ce qu'il sait faire ? »*",
             "**Obligatoire :** ton opinion, nuancée ; un principe de départ "
             "(un proverbe convient) ; deux arguments appuyés sur des faits ; "
             "**un exemple pris dans la pièce, avec citation entre "
             "guillemets** ; une objection que tu énonces toi-même et à "
             "laquelle tu réponds ; une conclusion."],
         "bareme": [["L'opinion est claire et nuancée", "3"],
                    ["Deux arguments appuyés sur des faits", "5"],
                    ["L'exemple de la pièce est exact et cité", "3"],
                    ["L'objection est énoncée et traitée", "3"],
                    ["Orthographe et ponctuation", "4"],
                    ["Présentation et longueur", "2"]]},
    ])
    b.append(saut())
    return b, corriges
