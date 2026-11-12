# -*- coding: utf-8 -*-
"""Le manuel de troisième : trois œuvres, et ce qui les relie.

*Ville cruelle* · *La marmite de Koka-Mbala* · *Petites gouttes de chant pour
créer l'Homme*.

Un roman de la ville, un drame de cour, vingt-deux poèmes : trois genres,
trois pays d'édition — et **une même question** posée trois fois : que fait
celui qui a vu une injustice ? Banda s'en va, Bitala fait briser la marmite,
Philombe écrit. C'est l'année de l'examen : le volume ne se contente pas de
faire lire, il fait écrire six types de textes et propose neuf épreuves au
format du BEPC.
"""
import c3_gouttes
import c3_gouttes_suite
import c3_marmite
import c3_marmite_suite
import c3_villecruelle
import c3_villecruelle_suite
from gabarit import passerelles
from kit import cases, enc, grille, h1, h2, h3, p, saut

OEUVRES = [
    ("Ville cruelle", "Eza Boto — roman"),
    ("La marmite de Koka-Mbala", "Guy Menga — drame en deux actes"),
    ("Petites gouttes de chant pour créer l'Homme",
     "René Philombe — vingt-deux poèmes"),
]


# ---------------------------------------------------------------- ouverture

def avant_propos():
    return [
        h1("Avant de commencer — ce livre et toi"),
        p("Tu entres dans l'année de l'**examen**. Cela ne change pas la "
          "façon de lire une œuvre ; cela change ce qu'on attend de toi "
          "quand tu en parles. On ne te demandera plus seulement de "
          "comprendre une histoire, ni même de voir comment elle est "
          "fabriquée : on te demandera de le **prouver**, avec des passages "
          "relevés, et d'écrire un texte qui se tienne debout tout seul."),
        grille([["L'œuvre", "Genre et forme", "Ce que tu apprends à repérer"],
                ["*Ville cruelle*", "roman, treize chapitres et un épilogue",
                 "la description qui juge sans juger, l'ironie, la "
                 "chronique, l'annonce du malheur"],
                ["*La marmite de Koka-Mbala*", "drame, deux actes",
                 "la réplique qui argumente, la didascalie, le rapport de "
                 "force entre les personnages"],
                ["*Petites gouttes de chant pour créer l'Homme*",
                 "recueil, vingt-deux poèmes",
                 "le vers libre, l'anaphore, le rapprochement, la chute"]]),
        enc("objectif", "Ce que ce manuel te promet", [
            "**Tu ne liras jamais seul.** Chaque passage est situé, "
            "questionné, et suivi d'une grille à remplir.",
            "**Tu écriras sur ces pages.** Les pointillés attendent ton "
            "stylo ; les colonnes vides sont ton travail.",
            "**Tu joueras.** Grilles, QCM, devinettes, cartes mentales : on "
            "retient ce qu'on a cherché, jamais ce qu'on a seulement lu.",
            "**Tu passeras neuf épreuves blanches** — trois par œuvre, au "
            "format exact de l'examen, avec leur barème et leur corrigé.",
            "**Tu discuteras, et tu changeras d'avis.** Trois débats "
            "t'attendent à la fin, et aucun n'a de bonne réponse écrite "
            "d'avance."]),
        h3("Les six ateliers d'écriture de l'année"),
        p("Chaque type de texte n'est travaillé **qu'une fois** dans ce "
          "volume, dans l'œuvre qui s'y prête le mieux. Ensuite, c'est à toi "
          "de le réemployer partout — et le jour de l'examen, tu ne sauras "
          "pas d'avance lequel on te demandera."),
        grille([["Œuvre", "Ateliers"],
                ["*Ville cruelle*",
                 "**la description qui accuse** · **le récit au passé**"],
                ["*La marmite de Koka-Mbala*",
                 "**le dialogue argumentatif** · **l'article de journal**"],
                ["*Petites gouttes de chant*",
                 "**le poème engagé** · **le texte argumentatif**"]]),
        enc("vigilance", "Une règle absolue", [
            "Tous les textes encadrés en gris et signés d'un nom d'auteur "
            "sont **recopiés mot pour mot**. Les coupes sont marquées **[…]**.",
            "Les rares textes écrits pour ce manuel portent la mention "
            "*« Texte composé »*. C'est le cas des trois textes de "
            "correction orthographique : tu as les œuvres entre les mains, "
            "et un passage emprunté au livre te livrerait la version "
            "correcte à recopier.",
            "**Pour les poèmes**, la référence précise toujours qu'il s'agit "
            "d'un **poème entier** : un poème ne se coupe pas."]),
        enc("astuce", "Trois lectures très différentes", [
            "**Le roman** se lit seul, un ou deux chapitres par soir, avec "
            "un journal de lecture de trois lignes. Ne saute pas le "
            "chapitre II : il n'a pas d'action, et c'est le plus beau "
            "morceau du livre.",
            "**Le drame** se lit à voix haute, à plusieurs, en distribuant "
            "les rôles. Une pièce qu'on lit dans sa tête est une pièce à "
            "moitié lue — et celle-ci a été jouée dans toute l'Afrique.",
            "**Le recueil de poèmes** ne se lit pas d'un bout à l'autre. Un "
            "poème, puis on ferme le livre. Deux par jour suffisent, et on "
            "note à chaque fois **un vers** qu'on voudrait savoir par "
            "cœur."]),
        h3("Mon tableau de bord de l'année"),
        p("Coche au fur et à mesure. Ce tableau ne se remplit pas la veille "
          "de l'examen."),
        grille([["Ce que je dois savoir faire", "Fait", "À revoir"],
                ["Situer un passage dans l'œuvre en deux phrases", "☐", "☐"],
                ["Relever un champ lexical et dire ce qu'il prouve", "☐", "☐"],
                ["Nommer une figure de style et l'expliquer", "☐", "☐"],
                ["Donner la nature **et** la fonction d'un groupe de mots",
                 "☐", "☐"],
                ["Employer l'imparfait et le passé simple à bon escient",
                 "☐", "☐"],
                ["Écrire les six types de textes de la page précédente",
                 "☐", "☐"],
                ["Réciter un poème entier sans notes", "☐", "☐"]]),
        saut()]


# -------------------------------------------------------------- passerelles

def passerelles_3e():
    return passerelles(
        "Passerelles — les trois œuvres se répondent",
        "Un roman camerounais paru à Paris, un drame congolais primé en "
        "1967, un recueil de poèmes publié à Yaoundé. Trois genres, trois "
        "auteurs qui ne se ressemblent pas. Et pourtant : partout un "
        "règlement qu'on n'a pas fait, partout quelqu'un qui n'a pas le "
        "droit de parler, partout une peur qui tient lieu de gouvernement. "
        "Voici les preuves, tirées des textes.",
        tableaux=[
            ("1. Trois manières de dénoncer sans accuser personne",
             ["L'œuvre", "Le procédé", "Comment il fonctionne"],
             [["*Ville cruelle*", "**l'ironie**",
               "Les bâtiments administratifs tournent le dos au Tanga des "
               "cases « par une erreur d'appréciation probablement ». Le "
               "narrateur donne l'excuse lui-même — et personne ne la "
               "croit."],
              ["*La marmite de Koka-Mbala*", "**la parole d'un personnage**",
               "L'auteur ne commente jamais. C'est Bitala qui dit, devant le "
               "roi : « Cette marmite n'a rien de sacré. Elle n'est qu'un "
               "instrument de mystification inventé par un individu aux "
               "ambitions incommensurables. »"],
              ["*Petites gouttes de chant*", "**le rapprochement**",
               "Le poète met la danse à côté du malheur et n'ajoute rien : "
               "« Et tu danses, homme ». Ailleurs, il attend le dernier mot "
               "pour tout retourner : « le plus affreux terroriste de notre "
               "peuple »."]]),
            ("2. Qui a le droit de parler ?",
             ["Qui se tait", "Pourquoi", "Ce que cela produit"],
             [["**Banda**, paysan",
               "Devant les agents du Contrôle, on ne discute pas. Trois "
               "solutions sont possibles « officiellement » ; la quatrième, "
               "« transactionnelle », ne se dit pas.",
               "Son cacao est brûlé. Le livre note froidement : « Banda "
               "aurait bien fait de la connaître »"],
              ["**Lemba**, la reine",
               "« Depuis quand les femmes se mêlent-elles des affaires du "
               "royaume ? » lui lance Bobolo.",
               "Elle répond quand même, en trois questions — et c'est elle "
               "qui, à la fin, appuie le roi dans « la grave décision de "
               "détruire cette marmite »."],
              ["**Celui qui frappe à la porte**",
               "On ne lui demande pas ce qu'il veut : on lui demande d'où il "
               "vient, la longueur de son nez, la couleur de sa peau.",
               "Il continue de parler pendant tout le poème. On ne saura "
               "jamais si l'on a ouvert — et c'est au lecteur de "
               "répondre."]]),
            ("3. La règle, et ce qu'elle cache",
             ["L'œuvre", "La règle affichée", "Ce qui se passe vraiment"],
             [["*Ville cruelle*",
               "Trois solutions officielles au Contrôle : vendre, sécher au "
               "soleil, ou mettre au feu.",
               "**Une quatrième existe**, que le texte appelle "
               "« transactionnelle » et ne définit jamais. Elle n'est écrite "
               "nulle part, et tout le monde la connaît sauf Banda."],
              ["*La marmite de Koka-Mbala*",
               "La loi interdit à tout homme de lever les yeux sur une "
               "femme ; le contrevenant est puni de mort.",
               "**La loi n'est pas la même pour tous** : elle « frappait "
               "surtout les jeunes tandis qu'elle était clémente pour les "
               "adultes ». L'injustice n'est pas dans le texte de la loi, "
               "elle est dans son application."],
              ["*Petites gouttes de chant*",
               "Rien n'est interdit : on demande seulement à celui qui "
               "frappe d'où il vient.",
               "**La règle est dans les têtes.** Aucun article, aucun "
               "tribunal — une porte qu'on n'ouvre pas suffit."]]),
            ("4. La peur, et à quoi elle sert",
             ["Ce qui fait peur", "Qui l'a fabriqué", "À qui elle sert"],
             [["**La marmite**, en terre cuite, remplie de fétiches",
               "Bobolo, premier conseiller **et** grand féticheur : la Note "
               "de l'auteur le dit avant que le rideau se lève.",
               "Non pas à punir les coupables, mais à **terroriser les "
               "juges** — « ceux qui hésitaient à prononcer la condamnation "
               "à mort »."],
              ["**Le Contrôle, la police, les gardes régionaux**",
               "Personne en particulier : un règlement, des hangars, une "
               "file d'attente.",
               "À obtenir sans un mot ce qu'on n'oserait pas demander. "
               "Banda, le soir, ne pense plus qu'à des coffres-forts."],
              ["**L'habitude**",
               "Personne. Elle s'installe toute seule.",
               "« Comme il fait bon vivre ici », dit le poème « Les "
               "dormeurs » — et il finit sur ce vers : « on nous apprend à "
               "dormir ici »."]]),
            ("5. Trois façons de finir",
             ["Qui décide", "Ce qu'il fait", "Ses derniers mots"],
             [["**Banda**", "Il quitte Bamila et part s'installer à "
               "Fort-Nègre. Sa mère est morte ; il ne reste rien à garder.",
               "« Qui donc a dit […] que le fils devait nécessairement vivre "
               "où a vécu le père ! »"],
              ["**Bitala**", "Il reste, casse la marmite avec le manche de "
               "sa lance, obtient la dissolution du Conseil — et demande "
               "qu'on épargne le prisonnier.",
               "Il cite le proverbe des pères — « Quelle que soit leur "
               "grandeur, les oreilles ne dépassent jamais la tête » — puis "
               "il conclut : « J'ai parlé. »"],
              ["**Le poète**", "Il ne part pas, il ne casse rien : il "
               "demande à sa muse de quoi continuer.",
               "« si tu me donnais encore l'autre bout du poème / je "
               "cueillerais ce jour-même / et le soleil / et la lune / et "
               "les étoiles »"]]),
            ("6. Ce que chaque livre dit de lui-même",
             ["L'œuvre", "Le mot qu'elle emploie", "Ce que ce mot engage"],
             [["*Ville cruelle*", "**une chronique**",
               "Le narrateur écrit, au chapitre II : « Qu'est-il advenu de "
               "la ville de Tanga depuis l'époque des événements que relate "
               "cette chronique ? » Un roman "
               "invente ; une chronique prétend **rapporter**, dans l'ordre "
               "du temps. Le narrateur se donne pour un témoin, pas pour un "
               "inventeur."],
              ["*La marmite de Koka-Mbala*", "**un drame**",
               "Pas une tragédie — le malheur menace, il ne s'accomplit pas. "
               "Et le volume ajoute un mot que l'auteur n'a pas choisi : "
               "**Grand prix du Concours théâtral interafricain 1967**."],
              ["*Petites gouttes de chant*", "**des gouttes**",
               "Chaque poème est une goutte ; leur somme doit « créer "
               "l'Homme ». Un livre qui annonce dans son titre ce qu'il "
               "veut faire de son lecteur."]]),
        ],
        debats=[
            ("Débat 1 — Faut-il partir, ou rester et changer les choses ?", [
                "Banda part pour Fort-Nègre à la dernière page. Bitala "
                "reste, et fait briser la marmite le soir même. Le poète, "
                "lui, appelle : « Lève-toi, Homme / Homme, lève-toi ».",
                "**Camp A :** on ne réforme pas ce qui vous écrase ; partir "
                "est parfois la seule décision qu'un homme puisse encore "
                "prendre seul.",
                "**Camp B :** un pays que ses jeunes quittent ne changera "
                "jamais. Bitala n'était pas plus fort que Banda — il était "
                "**nombreux**.",
                "**Règle du débat :** chaque camp cite **deux passages "
                "exacts**, pris dans deux œuvres différentes. Une opinion "
                "sans citation ne compte pas.",
                "**Ce qui complique tout :** Banda dit « Peut-être "
                "reviendrai-je à Bamila ». Partir empêche-t-il de revenir ?"]),
            ("Débat 2 — Peut-on désobéir à une règle injuste ?", [
                "À Tanga, une quatrième solution « transactionnelle » "
                "existe : celui qui la connaît sauve sa récolte, et le texte "
                "regrette que Banda l'ait ignorée. À Koka-Mbala, la loi "
                "condamne à mort et Bitala refuse d'y passer. Dans le "
                "recueil, « Dénonciation civique » demande d'ouvrir les yeux "
                "sur un homme… qui n'a rien fait.",
                "**Camp A :** une règle injuste n'oblige personne ; obéir, "
                "c'est la faire durer.",
                "**Camp B :** si chacun décide quelles règles il suit, il ne "
                "reste plus que la force — et la force n'est jamais du côté "
                "du plus pauvre.",
                "**Attention au piège :** la quatrième solution de *Ville "
                "cruelle*, c'est le pot-de-vin. Désobéir et corrompre "
                "sont-ils la même chose ? Le débat commence là."]),
            ("Débat 3 — Un livre change-t-il quelque chose ?", [
                "*La marmite de Koka-Mbala* a été jouée dans toute "
                "l'Afrique : l'éditeur du volume demande lui-même combien de "
                "fois elle l'a été, sans pouvoir les compter. « L'homme qui "
                "te ressemble » est récité "
                "par cœur dans des écoles de plusieurs pays. *Ville cruelle* "
                "se dit une chronique et espère, dès son chapitre II, que la "
                "ville a changé depuis.",
                "**Camp A :** un texte ne nourrit personne et n'abroge "
                "aucune loi. Ce qui change les choses, ce sont les "
                "décisions.",
                "**Camp B :** on ne décide que ce qu'on a d'abord pensé — et "
                "on ne pense que ce que quelqu'un a su dire. Un poème appris "
                "par cœur est une idée qu'on ne peut plus confisquer.",
                "**À vérifier avant de conclure :** cherchez, dans votre "
                "établissement ou autour de vous, **une seule personne** qui "
                "connaît par cœur un vers de Philombe. Rapportez le vers, et "
                "dites qui vous l'a récité. La réponse à ce débat est "
                "peut-être dans la cour."]),
        ],
        projet=("Le projet du trimestre — le journal de la classe", [
            "Vous allez fabriquer, à trente, **un numéro unique de "
            "journal** : huit pages, un titre, une date, des signatures. "
            "Comptez quatre semaines. Il réemploie les six ateliers de "
            "l'année, et c'est le but.",
            "**Étape 1 — la conférence de rédaction.** La classe choisit le "
            "titre du journal et arrête le sommaire. Chaque page reçoit un "
            "responsable. Rien ne s'écrit avant que le sommaire soit au "
            "tableau.",
            "**Étape 2 — les rubriques.** Un **article** sur un événement "
            "réel de l'établissement (atelier de *La marmite*) · un "
            "**reportage descriptif** sur un lieu du quartier, en deux "
            "séries opposées (atelier de *Ville cruelle*) · une **tribune "
            "argumentée** sur une question qui fâche, avec objection "
            "réfutée (atelier de *Petites gouttes*) · une **interview** en "
            "dialogue, où l'interviewé n'est jamais ridicule · un **récit** "
            "d'une journée ordinaire · et **un poème**, un seul, en dernière "
            "page.",
            "**Étape 3 — la vérification.** Aucun fait n'est publié sans "
            "être vérifié par deux élèves qui n'ont pas écrit l'article. "
            "Toute citation est relue par la personne citée. **Un journal "
            "qui se trompe une fois n'est plus cru ensuite.**",
            "**Étape 4 — la fabrication.** Un comité **maquette** (titres, "
            "colonnes, dessins), un comité **relecture** (orthographe, "
            "accords, ponctuation), un comité **une** (le titre principal, "
            "et lui seul, occupe le haut de la page).",
            "**Étape 5 — la sortie.** Affichez le numéro, ou tirez-le en "
            "trente exemplaires. Puis faites le tour des lecteurs et notez "
            "**ce qu'ils ont retenu**.",
            "Ce que ce projet vous apprend : écrire pour de vrai n'est pas "
            "écrire mieux, c'est écrire **devant quelqu'un**. Vous "
            "découvrirez que la moitié des phrases dont vous étiez fiers ne "
            "survivent pas à la relecture d'un camarade. **C'est exactement "
            "ce qui doit arriver.**"]))


# ------------------------------------------------------------------- montage

def note_aux_enseignants():
    return [
        h1("Note aux enseignants"),
        p("Ce volume réunit les **trois œuvres au programme de la classe de "
          "troisième** et propose, pour chacune, un parcours complet en sept "
          "temps. Il est conçu pour être écrit dessus, et il vise "
          "explicitement l'examen de fin de cycle."),
        h3("Le principe qui gouverne le volume"),
        p("**Aucune règle n'est donnée avant son modèle.** Chaque atelier "
          "s'ouvre sur un texte rédigé et annoté ❶❷❸, questionne les étapes "
          "de ce modèle, demande à l'élève de formuler la règle **avant** de "
          "la lui donner, puis fait imiter sur un autre sujet."),
        h3("Les lectures suivies"),
        p("Dix-huit séances — six par œuvre — suivant la démarche "
          "officielle : **situation → lecture → grille → confrontation et "
          "bilan**. Les grilles donnent l'axe **nommé** et l'outil de langue "
          "**fourni** ; seule la colonne des relevés reste vide."),
        enc("astuce", "Sur la longueur des extraits", [
            "Pour la **prose** — le roman et le drame —, chaque extrait de "
            "lecture suivie **dépasse cinq cents mots**.",
            "Pour la **poésie**, la règle est autre et elle est délibérée : "
            "l'unité d'étude est le **poème entier**, quelle qu'en soit la "
            "longueur. Les six textes retenus vont d'une centaine de mots à "
            "plus de quatre cents.",
            "**La contrepartie est stricte :** chaque référence nomme "
            "l'unité reproduite (« poème entier »). Sans cette mention, on "
            "ne saurait plus si l'on tient le poème ou un fragment."]),
        h3("Ce qui reste en lecture personnelle"),
        grille([["Œuvre", "Étudié en classe", "Support d'épreuve"],
                ["*Ville cruelle*",
                 "les chapitres I, II, IV, VII, IX et l'épilogue",
                 "un passage du chapitre VI"],
                ["*La marmite de Koka-Mbala*",
                 "l'acte I (trois séances) et l'acte II (trois séances)",
                 "une scène non traitée en classe"],
                ["*Petites gouttes de chant*",
                 "les poèmes I, VI, VIII, XIV, XVI et XVIII",
                 "le poème IV, « La voix du ventre »"]]),
        enc("vigilance", "⚠ Trois points de conduite, œuvre par œuvre", [
            "***Ville cruelle*** : la mort de Koumé, la brutalité des "
            "gardes et la tentation du vol occupent le cœur du livre. Rien "
            "n'y est complaisant, et aucun extrait du manuel ne s'y "
            "attarde ; conduire l'échange sur **ce que le texte fait** — "
            "l'ironie, la description en deux séries, l'annonce du "
            "malheur — plutôt que sur l'actualité, qui emporterait la "
            "séance ailleurs. La « quatrième solution, transactionnelle » "
            "est un pot-de-vin : le nommer, et ne pas laisser la classe "
            "conclure que Banda avait tort de l'ignorer.",
            "***La marmite de Koka-Mbala*** : la pièce repose sur une "
            "peine de mort par enfouissement dans une fosse hérissée de "
            "sagaies, et sur une loi qui punit un regard. La Note liminaire "
            "de l'auteur situe tout cela dans **un royaume ancien du "
            "Kongo** : le rappeler avant la première séance. Distribuer les "
            "rôles — cette pièce a été écrite pour être jouée, et lue en "
            "silence elle perd son ressort.",
            "***Petites gouttes de chant*** : deux poèmes du recueil ne "
            "figurent volontairement dans aucune séance. **XXI, « Black / "
            "Immaculée conception »**, dont les images de la conception "
            "sortent du cadre du premier cycle ; et **XII, « Dix amours de "
            "poète »**, dont le texte, dans les tirages numériques "
            "courants, est **interrompu par une ligne parasite étrangère à "
            "l'auteur**. Les signaler aux élèves qui liront le recueil "
            "entier, plutôt que de découvrir la question en pleine "
            "séance."]),
        enc("mot", "Deux avertissements sur le volume de Philombe", [
            "Les tirages du recueil font suivre les vingt-deux poèmes d'une "
            "**étude critique signée Simplice Ambiana**. Elle est utile au "
            "professeur ; elle n'est **pas de René Philombe**, et aucune de "
            "ses phrases ne doit être citée sous le nom du poète.",
            "Le même volume annonce, après le recueil, le long poème *Les "
            "Blancs partis, les Nègres dansent*. Il n'est étudié dans aucune "
            "séance de ce manuel : le signaler comme lecture "
            "supplémentaire, non comme support d'évaluation."]),
        h3("Les épreuves"),
        p("Trois par œuvre, soit **neuf épreuves blanches** : **étude de "
          "texte** (I. Compréhension /10 + II. Langue /10), **correction "
          "orthographique** (15 fautes = 20 points, répartition 0,5 / 1 / 2 / "
          "2), **expression écrite** (deux sujets au choix, grille de "
          "notation fournie). Les trois supports d'étude de texte n'ont "
          "**pas** été traités en classe : ils mesurent la lecture "
          "personnelle."),
        p("Les trois textes de correction orthographique sont **composés "
          "pour l'épreuve** et étiquetés comme tels : l'élève ayant l'œuvre "
          "entre les mains, un support emprunté au livre lui livrerait la "
          "version correcte à recopier."),
        h3("La progression annuelle proposée"),
        grille([["Période", "Œuvre", "Ce qu'on installe"],
                ["Trimestre 1", "*Ville cruelle*",
                 "le roman, la description et l'ironie ; la description qui "
                 "accuse ; le récit au passé"],
                ["Trimestre 2", "*La marmite de Koka-Mbala*",
                 "le théâtre, la réplique et la didascalie ; le dialogue "
                 "argumentatif ; l'article de journal"],
                ["Trimestre 3", "*Petites gouttes de chant*",
                 "la poésie, le vers libre et les figures ; le poème "
                 "engagé ; le texte argumentatif — et le journal de la "
                 "classe"]]),
        p("La section **Passerelles** se traite en fin d'année. Ses trois "
          "débats constituent une évaluation orale toute prête ; le projet "
          "de journal peut démarrer dès le deuxième trimestre, dès que "
          "l'atelier de l'article a été conduit."),
        enc("objectif", "Ce que le volume prépare, épreuve par épreuve", [
            "**Étude de texte** — neuf entraînements corrigés, sur trois "
            "genres différents. La colonne « Réponse attendue » des "
            "corrigés est rédigée pour être lue **par l'élève**, pas "
            "seulement cochée par le correcteur.",
            "**Correction orthographique** — trois textes, quarante-cinq "
            "fautes, toujours la même répartition : quatre accents ou "
            "signes, quatre fautes d'usage, quatre accords, trois "
            "homophones.",
            "**Expression écrite** — six sujets au total, un par type de "
            "texte travaillé dans l'année. Aucun sujet ne demande un type "
            "qui n'aurait pas été enseigné."]),
        saut()]


def manuel():
    """Rend (blocs du manuel, blocs des corrigés)."""
    blocs = list(avant_propos())
    corriges = [h1("Corrigés")]

    for titre, mod, mod_suite in [
            ("Œuvre 1 — Ville cruelle", c3_villecruelle,
             c3_villecruelle_suite),
            ("Œuvre 2 — La marmite de Koka-Mbala", c3_marmite,
             c3_marmite_suite),
            ("Œuvre 3 — Petites gouttes de chant pour créer l'Homme",
             c3_gouttes, c3_gouttes_suite)]:
        blocs += mod.partie1() + mod.partie2()
        b3, c3 = mod.partie3()
        blocs += b3 + mod.partie4() + mod_suite.partie5()
        b6, c6 = mod_suite.partie6()
        b7, c7 = mod_suite.partie7()
        blocs += b6 + b7
        corriges += [h2(titre)] + c3 + c6 + c7

    blocs += passerelles_3e()
    blocs += note_aux_enseignants()
    return blocs, corriges
