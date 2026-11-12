# -*- coding: utf-8 -*-
"""
Section 9 du cahier « Balafon » : deux devoirs au format MINESEC.

  Devoir n° 1  Probatoire blanc, 4 heures, trois sujets au choix.
  Devoir n° 2  Devoir surveillé de 2 heures, questions dirigées et production.

Le sujet I du devoir n° 1 — contraction et discussion — est **remplacé au
moment de la construction** par le support verbatim de `contractions.py`.
Celui qui figure ci-dessous n'est jamais rendu ; il est conservé pour que le
module reste lisible seul.

Les corrigés suivent la maquette des corrigés harmonisés nationaux, et leurs
grilles sont celles de l'Office du Baccalauréat : quatre critères, vingt
points, 6 / 6 / 6 / 2.
"""
import balafon_extraits as X
import obc

SRC = X.SRC


def _src(cle):
    return SRC + X.REFERENCES[cle][2] + "."


# ═══════════════════════════════════════════ DEVOIR N° 1 — PROBATOIRE BLANC
DEVOIR1 = dict(
    titre="Devoir n° 1 — Probatoire blanc (4 heures)",
    entete=[
        ["Examen", "Probatoire blanc — Centre VÉRITAS"],
        ["Épreuve", "Français"],
        ["Séries", "A (coefficient 3) — C, D, E (coefficient 2)"],
        ["Durée", "4 heures"],
        ["Consigne générale",
         "Le candidat traite **un seul** des trois sujets proposés."],
    ],
    consigne_generale="L'usage du dictionnaire n'est pas autorisé. Aucun "
                      "document n'est admis. Le candidat indiquera clairement, "
                      "en tête de copie, le numéro du sujet traité.",

    sujets=[
        # Ce sujet I est ignoré : contractions.sujet_contraction("balafon") le
        # remplace au moment de la construction.
        dict(num="Sujet I — Contraction de texte et discussion",
             bareme="Contraction : 10 points — Discussion : 10 points",
             support=None, source_support=None,
             consignes=["Sujet remplacé à la construction par le support "
                        "verbatim déclaré dans contractions.py."]),

        dict(num="Sujet II — Dissertation littéraire",
             bareme="Compréhension / Pertinence : 6 — Organisation / "
                    "Cohérence : 6 — Correction de l'expression : 6 — "
                    "Originalité de la production : 2",
             support=None, source_support=None,
             consignes=[
                 "« Un poème qui s'adresse à quelqu'un n'est jamais tout à "
                 "fait un poème : c'est déjà une conversation. » En vous "
                 "appuyant sur *Balafon* d'Engelbert Mveng et sur vos "
                 "lectures personnelles, vous direz ce que cette affirmation "
                 "vous inspire.",
                 "*Le candidat veillera à citer le texte avec exactitude et à "
                 "analyser chacune de ses citations.*",
             ]),

        dict(num="Sujet III — Commentaire composé",
             bareme="Compréhension : 6 — Organisation des idées : 6 — Langue "
                    "et style : 6 — Présentation de la copie : 2",
             support=X.B9,
             source_support=_src("B9"),
             disposition="vers",
             consignes=[
                 "**Sans dissocier le fond de la forme, vous ferez de ce "
                 "poème un commentaire composé.** Vous pourrez étudier, entre "
                 "autres, la façon dont le poète répond à trois amis à la "
                 "fois, et ce qu'il oppose au portrait qu'on fait de "
                 "l'Afrique.",
                 "*Le plan comportera deux centres d'intérêt, chacun de deux "
                 "ou trois sous-centres. Les intertitres ne doivent pas "
                 "figurer sur la copie.*",
             ]),
    ],
)


DEVOIR1_CORRIGE = dict(
    titre="Devoir n° 1 — Corrigé et grilles d'évaluation",
    intro="Corrigé présenté selon le modèle des corrigés harmonisés "
          "nationaux : thème, reformulation, problématique, type de plan et "
          "plan possible pour la dissertation ; situation, idée générale, "
          "plan possible, centres d'intérêt et intérêts du texte pour le "
          "commentaire. Les indications sont rédigées à la troisième "
          "personne, à l'usage du correcteur.",
    sujets=[
        # Corrigé du sujet I : remplacé à la construction.
        dict(num="Corrigé du sujet I — Contraction et discussion",
             blocs=[("Corrigé remplacé à la construction", None)],
             grille=obc.GRILLE_DISS,
             cloture=obc.CLOTURE_DISS),

        dict(num="Corrigé du sujet II — Dissertation littéraire",
             blocs=[
                 ("Thème",
                  "La forme adressée en poésie : ce qu'un poème gagne, et ce "
                  "qu'il risque, à parler à quelqu'un."),
                 ("Reformulation",
                  "Selon l'affirmation, un poème qui prend un destinataire "
                  "cesserait d'être pleinement un poème pour devenir un "
                  "échange. Le mot « déjà » suppose un glissement : la poésie "
                  "serait d'un côté, la conversation de l'autre, et l'adresse "
                  "ferait passer de l'une à l'autre."),
                 ("Problématique attendue",
                  "L'adresse fait-elle sortir le poème de la poésie, ou "
                  "est-elle au contraire l'un de ses moyens propres ?"),
                 ("Type de plan",
                  "Plan dialectique en trois parties. On acceptera un plan en "
                  "deux parties s'il comporte un véritable dépassement dans "
                  "la seconde."),
                 ("Plan possible", [
                     "**Première partie — l'affirmation se vérifie dans "
                     "*Balafon*.** La première section s'intitule « Lettres à "
                     "mes amis » : le recueil s'ouvre sur quatre poèmes qui "
                     "sont littéralement des lettres, avec destinataire, "
                     "salutations et réponse (« J'ai reçu hier soir vos "
                     "lettres d'amitié »). L'apostrophe y est constante : "
                     "« Kong-Fu-Tseu mon ami », « ô Manhattan », « Dors "
                     "MOKOGHIBLY », « Mon Seigneur ». Le candidat doit citer "
                     "et analyser, non se contenter de mentionner.",
                     "**Deuxième partie — mais l'adresse ne réduit pas le "
                     "poème.** Une conversation attend une réponse ; ces "
                     "poèmes n'en attendent pas. Moteczuma est mort depuis "
                     "quatre siècles, l'Adamaoua est une montagne, Manhattan "
                     "une ville. L'adresse est ici une forme, non un échange "
                     "réel. On valorisera le candidat qui remarque que le "
                     "seul poème où quelqu'un répond — « Lettre "
                     "collective » — est justement celui où le poète parle "
                     "au nom d'un « nous ».",
                     "**Troisième partie — l'adresse est un outil poétique.** "
                     "Elle permet de dire sans démontrer : « tu n'es plus "
                     "pour moi le Danger jaune » congédie un préjugé sans "
                     "polémique. Elle permet aussi de bénir (« Paix, ô "
                     "MOKOGHIBLY ») et de prier (« Mon Seigneur, je viens de "
                     "loin »). Trois actes de parole que le poème non adressé "
                     "ne peut pas accomplir. On acceptera toute troisième "
                     "partie qui déplace ainsi la question.",
                 ]),
                 ("Citations utiles au candidat", [
                     "« Kong-Fu-Tseu mon ami, / Tu m'as ouvert la porte du "
                     "Levant » (*À Kong-Fu-Tseu*).",
                     "« La paix ne viendra pas sur toi, ô Manhattan » (*New "
                     "York*).",
                     "« Je te dis : / Paix, ô MOKOGHIBLY » (*Adamawa*).",
                     "« Mon Seigneur, / Je viens de loin, de très loin » "
                     "(*Épiphanie*).",
                     "« J'ai reçu hier soir vos lettres d'amitié » (*Lettre "
                     "collective*).",
                 ]),
                 ("Ce qui doit être sanctionné", [
                     "Un devoir sans une seule citation exacte du recueil : "
                     "C1 ne peut excéder 2 points.",
                     "Un devoir qui traite « la poésie doit-elle être "
                     "engagée ? » : hors sujet.",
                     "Un plan en deux parties sans dépassement : C2 plafonne "
                     "à 4 points.",
                 ]),
                 ("Grille d'évaluation — Sujet II", None),
             ],
             grille=obc.GRILLE_DISS,
             cloture=obc.CLOTURE_DISS),

        dict(num="Corrigé du sujet III — Commentaire de « Lettre collective »",
             blocs=[
                 ("Situation du texte",
                  "Quatrième et dernière pièce de la section « Lettres à mes "
                  "amis ». Après avoir écrit séparément à la Chine, à "
                  "l'Europe et à l'Amérique précolombienne, le poète leur "
                  "répond d'un seul texte. Le poème est en versets libres."),
                 ("Idée générale",
                  "Le poète a reçu des lettres d'amitié. Il répond en "
                  "rapportant ce qu'on dit de l'Afrique — qu'on n'y aime pas "
                  "les hommes, qu'on y regarde les Africains comme des bêtes "
                  "exotiques — puis oppose à ces propos la manière d'aimer de "
                  "son continent, avant d'appeler tous les hommes à "
                  "l'unisson."),
                 ("Plan possible",
                  "Deux centres d'intérêt : d'abord une lettre qui rapporte "
                  "les paroles des autres ; ensuite une réponse qui substitue "
                  "un « nous » au « on »."),
                 ("Premier centre d'intérêt — Une lettre qui rapporte", [
                     "**Sous-centre 1.** Les marques de la lettre : "
                     "l'ouverture (« J'ai reçu hier soir vos lettres "
                     "d'amitié »), l'adresse aux trois destinataires nommés "
                     "en tête, le rappel de leurs propos (« Vous me parliez "
                     "d'amitié... », 2 occ).",
                     "**Sous-centre 2.** Le discours rapporté et sa "
                     "distance : « Ils m'ont dit », « On n'aime pas les "
                     "hommes » (2 occ). Le pronom indéfini « on » désigne un "
                     "jugement sans auteur, que le poème cite pour le "
                     "montrer.",
                     "**Sous-centre 3.** La caractérisation péjorative "
                     "rapportée : « Comme des bêtes exotiques ». Le candidat "
                     "doit voir que cette formule n'est pas du poète : elle "
                     "est prêtée à ceux qui parlent.",
                 ]),
                 ("Second centre d'intérêt — Une réponse qui rassemble", [
                     "**Sous-centre 1.** Le retournement par « Et voici que "
                     "ce soir » : le poème quitte le rapport pour "
                     "l'affirmation. « Au bord de votre cœur / Notre cœur "
                     "s'est penché. »",
                     "**Sous-centre 2.** L'énumération finale des humains — "
                     "« Hommes », « Femmes », « Enfants », « Blancs, jaunes, "
                     "noirs et rouges » — et la caractérisation nominale qui "
                     "accompagne chacun (« Notre race de tendresse », « Notre "
                     "race de faiblesse »).",
                     "**Sous-centre 3.** Le mot qui commande la fin : "
                     "« Chante à l'unisson ». Le poème passe du « on » "
                     "anonyme au « nous » choral. C'est le mouvement de tout "
                     "le texte, et il faut que le candidat le formule.",
                 ]),
                 ("Points de vigilance pour le correcteur", [
                     "Ne pas confondre les propos rapportés et la parole du "
                     "poète. Un candidat qui attribue « comme des bêtes "
                     "exotiques » à Mveng commet un contresens majeur.",
                     "Le poème répond à trois lettres à la fois : le titre le "
                     "dit. Un devoir qui l'ignore manque la situation.",
                     "On créditera toute remarque exacte sur les longueurs de "
                     "versets, très inégales dans ce texte.",
                 ]),
                 ("Intérêts du texte", [
                     "**Intérêt stylistique.** L'emploi du discours rapporté "
                     "en poésie, et le passage du « on » au « nous ».",
                     "**Intérêt social.** Le poème cite les préjugés portés "
                     "sur l'Afrique, et y répond sans injurier.",
                     "**Intérêt humain.** L'appel final à l'unisson concerne "
                     "toutes les couleurs et tous les âges : c'est une "
                     "fraternité sans condition.",
                 ]),
                 ("Grille d'évaluation — Sujet III", None),
             ],
             grille=obc.GRILLE_CC,
             cloture=obc.CLOTURE_CC),
    ],
)


# ═══════════════════════════════════════ DEVOIR N° 2 — DEVOIR SURVEILLÉ (2 H)
DEVOIR2 = dict(
    titre="Devoir n° 2 — Devoir surveillé de contrôle (2 heures)",
    entete=[
        ["Nature", "Devoir de contrôle en cours d'étude de l'œuvre"],
        ["Classe", "Première — toutes séries"],
        ["Durée", "2 heures"],
        ["Support", "« Mère », section 4, en entier"],
        ["Barème", "Questions : 12 points — Production écrite : 8 points"],
    ],
    consigne_generale="Ce devoir se place après l'étude des séquences 1 à 4. Il "
                      "vérifie la maîtrise des outils d'analyse avant "
                      "l'épreuve longue. Les questions sont à traiter dans "
                      "l'ordre ; la production écrite est obligatoire et "
                      "compte pour huit points.",
    support=X.B11,
    source_support=_src("B11"),
    disposition="vers",

    questions=[
        ("I. Compréhension du texte (4 points)", [
            "**1.** Qui parle dans ce passage, et à qui s'adresse-t-il ? "
            "Attention : il y a deux destinataires successifs. Citez pour "
            "chacun. **(2 pts)**",
            "**2.** Le poète rapporte deux rencontres, l'une en Occident, "
            "l'autre chez les siens. Que lui répond-on dans chaque cas ? "
            "Recopiez les deux réponses. **(2 pts)**",
        ]),
        ("II. Étude de la langue et des outils d'analyse (8 points)", [
            "**3.** Relevez les occurrences de « Je te nomme » au début du "
            "passage. a) Comment appelle-t-on cette reprise ? b) Que "
            "produit-elle sur celle qui est ainsi nommée ? **(2 pts)**",
            "**4.** « Ma Mère des Douleurs sur mon crâne du Calvaire ». "
            "a) De quelle tradition religieuse cette expression est-elle "
            "tirée ? b) À quelle figure est-elle ici appliquée ? c) Comment "
            "nomme-t-on la rencontre de deux traditions dans une même "
            "image ? **(2 pts)**",
            "**5.** Comparez les deux paragraphes qui commencent par « Je "
            "suis passé » et « J'ai rencontré ». a) Relevez ce qui est "
            "identique dans leur construction. b) Qu'est-ce qui change ? "
            "c) Que ce parallélisme démontre-t-il, que le poète n'a pas "
            "besoin d'énoncer ? **(2 pts)**",
            "**6.** Étudiez la fin du passage, de « Et je suis parti / Pour "
            "saluer le chef de poste » à « le flot l'a rallumée ». "
            "a) Relevez l'énumération des autorités saluées : que "
            "montre-t-elle sur le pays entre le début et la fin ? b) Le "
            "poète arrive « les mains vides » : que lui reste-t-il ? "
            "c) Expliquez le dernier vers. **(2 pts)**",
        ]),
        ("III. Production écrite (8 points)", [
            "**7.** Rédigez entièrement l'introduction et le premier centre "
            "d'intérêt du commentaire composé de ce passage. Le centre "
            "d'intérêt comportera deux sous-centres, chacun appuyé sur au "
            "moins deux citations analysées. On attend environ trois cents "
            "mots. Les intertitres ne doivent pas figurer sur la copie.",
        ]),
    ],
)


DEVOIR2_CORRIGE = dict(
    titre="Devoir n° 2 — Corrigé et grille d'évaluation",
    cloture=obc.CLOTURE_CC,
    reponses=[
        ("1. Les deux destinataires (2 pts)",
         "Le passage s'ouvre sur une parole rapportée de Dieu — « Homme, "
         "voici ta Mère ! » — puis le poète s'adresse à l'Afrique : « Je te "
         "nomme ma terre africaine ». Plus loin, il se tourne vers Dieu : "
         "« Tu m'as dit, Seigneur ». Le candidat reçoit 2 pts s'il distingue "
         "les deux destinataires et cite pour chacun ; 1 pt s'il n'en voit "
         "qu'un."),
        ("2. Les deux réponses reçues (2 pts)",
         "En Occident : « Il parle petit nègre ». Chez les siens : « Il "
         "parle “petit blanc” ». Le candidat reçoit 2 pts s'il recopie les "
         "deux exactement. On acceptera qu'il souligne que les deux "
         "formules sont construites de la même façon — c'est ce qui fait "
         "leur violence."),
        ("3. L'anaphore « Je te nomme » (2 pts)",
         "a) Une **anaphore** : la reprise du même groupe en tête de "
         "plusieurs versets (trois occurrences dans les douze premiers "
         "vers). b) 2 pts si le candidat montre qu'elle **fait** ce qu'elle "
         "dit : nommer est un acte, et la répétition l'accomplit sous nos "
         "yeux. L'Afrique n'est pas décrite comme une mère, elle est "
         "instituée mère par la parole du poème. 1 pt si le procédé est "
         "nommé sans être interprété."),
        ("4. Le syncrétisme (2 pts)",
         "a) « Mère des Douleurs » et « Calvaire » viennent de la tradition "
         "chrétienne — la Vierge au pied de la croix. b) Elle est appliquée "
         "à l'Afrique. c) On parle de **syncrétisme** : la rencontre de deux "
         "traditions dans une même image. Le candidat reçoit 2 pts s'il "
         "répond aux trois points ; on valorisera celui qui note que le "
         "poème place cette rencontre dans un seul vers, sans la commenter."),
        ("5. Le parallélisme des deux rencontres (2 pts)",
         "a) Même construction : un déplacement (« Je suis passé » / « J'ai "
         "rencontré »), un arrêt (« Je me suis arrêté »), une prise de "
         "parole (« Et j'ai parlé »), une réplique collective, un départ "
         "(« Et je suis reparti » / « Et je suis parti »). b) Ce qui change : "
         "les interlocuteurs, et le reproche qu'ils font. c) 2 pts si le "
         "candidat conclut que le poète est rejeté **des deux côtés pour la "
         "même raison** — sa langue —, et que le parallélisme suffit à le "
         "démontrer sans qu'aucun vers ait à l'affirmer."),
        ("6. La fin du passage (2 pts)",
         "a) « chef de poste », « commandant », « Monsieur le Maire », "
         "« Préfet », puis « le nouveau chef de mon nouveau pays », « le "
         "Président » : l'énumération traverse la colonisation et "
         "l'indépendance. Les titres changent, la démarche du poète reste la "
         "même. b) Il ne lui reste que « le message en ma bouche de Ton Nom "
         "de Sainteté ». c) 2 pts si le candidat explique le retournement "
         "final : le poète verse son propre sang « pour éteindre la "
         "flamme », et ce sang la rallume. Ce qui devait finir commence."),
        ("7. Production écrite — attentes (8 pts)", None),
        ("Éléments attendus dans l'introduction",
         "Situation (Engelbert Mveng, *Balafon*, 1972 ; « Mère », daté de "
         "1964, le plus long poème du recueil ; la section 4, où l'Afrique "
         "est nommée Mère), présentation du passage, problématique formulée "
         "en question, annonce du centre d'intérêt. Aucune analyse ne doit "
         "figurer dans l'introduction."),
        ("Centres d'intérêt acceptables", None),
        ("Proposition A", "« Nommer, c'est instituer » — l'anaphore « Je te "
         "nomme », les compléments qui suivent (« de ma bouche de couscous », "
         "« de mes mains de fétiches »), et le syncrétisme de la « Mère des "
         "Douleurs »."),
        ("Proposition B", "« Un homme rejeté des deux côtés » — le "
         "parallélisme des deux rencontres, les deux répliques symétriques, "
         "et le silence qui suit chacune."),
        ("Proposition C", "« Des mains vides et une bouche pleine » — "
         "l'énumération des autorités, la perte des « bouquets de "
         "révérences », et ce qui reste au terme du dépouillement."),
        ("Grille d'évaluation — production écrite", None),
    ],
    grille_prod=[
        ["Critère", "Indicateurs", "Points"],
        ["Introduction",
         "Le candidat reçoit 2 pts : si l'introduction comporte les trois "
         "étapes — situation du passage dans l'œuvre, problématique formulée "
         "en question, annonce du centre d'intérêt. 1 pt : si une étape "
         "manque. 0 pt : si l'introduction se réduit à une présentation de "
         "l'auteur.", "2"],
        ["Construction du centre d'intérêt",
         "Le candidat reçoit 3 pts : si le centre d'intérêt comporte deux "
         "sous-centres distincts, chacun ouvert par une idée directrice et "
         "fermé par une transition partielle. 2 pts : si les sous-centres "
         "existent sans idée directrice explicite. 1 pt : si le devoir suit "
         "l'ordre des versets sans organisation.", "3"],
        ["Citations et outils d'analyse",
         "Le candidat reçoit 2 pts : si chaque sous-centre s'appuie sur au "
         "moins deux citations exactes, chacune suivie du nom de l'outil "
         "d'analyse et de son effet. 1 pt : si les citations sont présentes "
         "mais non analysées. 0 pt : si le devoir ne cite pas.", "2"],
        ["Langue et présentation",
         "Le candidat reçoit 1 pt : si la syntaxe est correcte, les versets "
         "cités avec la barre oblique, et la copie lisible. 0 pt : si les "
         "fautes gênent la lecture.", "1"],
        ["**Total**", "", "**8**"],
    ],
)


ENCADRES_DEVOIRS = [
    ("methode", "Citer un verset, et non une ligne de prose", [
        "Un poème en versets ne se cite pas comme un roman. Quatre règles, "
        "qui valent des points à chaque devoir :",
        "- **La barre oblique marque la fin du verset.** « Je te dis : / "
        "Paix, ô MOKOGHIBLY, / Sur ton troupeau d'éléphants millénaires. »",
        "- **On ne compte pas les syllabes.** Mveng écrit en versets libres : "
        "parler d'alexandrin ou d'octosyllabe est une faute.",
        "- **On mesure les longueurs.** Dire qu'un verset fait trois mots "
        "après un verset de trente est une observation recevable, et souvent "
        "décisive.",
        "- **On numérote quand on cite loin.** (v. 12) et (v. 40) valent "
        "mieux que « au début » et « à la fin ».",
    ]),
    ("astuce", "Nommer les outils d'analyse comme le correcteur", [
        "Les corrigés nationaux emploient un vocabulaire précis. L'adopter, "
        "c'est être lu par quelqu'un qui reconnaît ses propres termes :",
        "- **Caractérisation nominale** : on qualifie par un nom ou un groupe "
        "nominal — « Tu es la fleur fine ».",
        "- **Reprise anaphorique** : un mot repris en tête de plusieurs "
        "versets. On indique le nombre d'occurrences — « (3 occ) ».",
        "- **Champ lexical** : on le relève **en entier**, entre guillemets, "
        "puis on dit ce qu'il produit.",
        "- **Valeur d'un temps** : « présent de l'indicatif à valeur "
        "descriptive ». On ne nomme jamais un temps sans dire sa valeur.",
        "- **Centre d'intérêt** pour les grandes parties, **sous-centre** "
        "pour leurs subdivisions. C'est le vocabulaire de la grille.",
    ]),
    ("vigilance", "Ce qui coûte le plus de points sur ce recueil", [
        "Trois erreurs reviennent dans presque toutes les copies faibles sur "
        "*Balafon* :",
        "- **Chercher un mètre.** Mveng écrit en versets libres. Compter des "
        "syllabes revient à mesurer ce qui n'est pas mesuré.",
        "- **Séparer l'africain et le chrétien.** Le calice et le tam-tam "
        "sont dans la même phrase ; en faire deux parties de devoir, c'est "
        "défaire le poème.",
        "- **Attribuer au poète les propos qu'il rapporte.** Dans « Lettre "
        "collective », « comme des bêtes exotiques » est cité, non assumé. "
        "Le contresens est grave et il est fréquent.",
    ]),
]
