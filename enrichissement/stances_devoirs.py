# -*- coding: utf-8 -*-
"""
Section 9 du cahier « Stances et Poèmes » : deux devoirs au format MINESEC.

  Devoir n° 1  Baccalauréat blanc, 4 heures, trois sujets au choix.
  Devoir n° 2  Devoir surveillé de 2 heures, questions dirigées et production.

Le sujet I du devoir n° 1 — contraction et discussion — est **remplacé au
moment de la construction** par le support verbatim de `contractions.py`
(voir README, « Règles de contenu »). Celui qui figure ci-dessous n'est jamais
rendu ; il est conservé pour que le module reste lisible seul.

Les supports des deux devoirs sont des poèmes du recueil qui ne portent ni
fiche ni devoir rédigé : le jour de l'épreuve, l'élève doit affronter un texte
qu'il n'a pas travaillé en classe.
"""
import stances_extraits as X

SRC = X.SRC


def _src(cle):
    return SRC + X.REFERENCES[cle][2] + "."


# Grille harmonisée de l'Office du Baccalauréat : quatre critères, vingt points.
# Les indicateurs changent d'un exercice à l'autre, la structure jamais.
CLOTURE = ("NB — Tous les éléments pertinents non prévus dans cette grille que le "
           "candidat aura ajoutés seront pris en compte. On restera ouvert à toute "
           "autre interprétation pertinente.")

# Formule des corrigés nationaux, réservée au commentaire composé : elle engage
# le correcteur à créditer l'analyse de la langue, non la seule paraphrase.
CLOTURE_CC = ("On insistera tout particulièrement sur l'exploitation par le candidat "
              "des procédés de style, les éléments du vocabulaire, la syntaxe, etc., "
              "dans ses démonstrations et autres illustrations. On restera également "
              "ouvert à toute autre interprétation pertinente du texte par le "
              "candidat.")

CLOTURE_DISS = ("On restera ouvert à toute autre organisation pertinente. Les exemples "
                "empruntés à d'autres œuvres seront crédités dès lors qu'ils sont "
                "exacts et analysés.")


def _grille(c1, c2, c3, c4):
    return [["Critère", "Indicateurs", "Points"],
            ["C1 — Compréhension / Pertinence", c1, "6"],
            ["C2 — Organisation / Cohérence", c2, "6"],
            ["C3 — Expression / Correction de la langue", c3, "6"],
            ["C4 — Originalité de la production", c4, "2"],
            ["**Total**", "", "**20**"]]


# ══════════════════════════════════════════════════ DEVOIR N° 1 — BAC BLANC
DEVOIR1 = dict(
    titre="Devoir n° 1 — Baccalauréat blanc (4 heures)",
    entete=[
        ["Examen", "Baccalauréat blanc — Centre VÉRITAS"],
        ["Épreuve", "Français"],
        ["Séries", "A (coefficient 3) — C, D, E (coefficient 2)"],
        ["Durée", "4 heures"],
        ["Consigne générale",
         "Le candidat traite **un seul** des trois sujets proposés."],
    ],
    consigne_generale="L'usage du dictionnaire n'est pas autorisé. Aucun document "
                      "n'est admis. Le candidat indiquera clairement, en tête de "
                      "copie, le numéro du sujet traité.",

    sujets=[
        # Ce sujet I est ignoré : contractions.sujet_contraction("stances") le
        # remplace au moment de la construction.
        dict(num="Sujet I — Contraction de texte et discussion",
             bareme="Contraction : 10 points — Discussion : 10 points",
             support=None, source_support=None,
             consignes=["Sujet remplacé à la construction par le support "
                        "verbatim déclaré dans contractions.py."]),

        dict(num="Sujet II — Dissertation littéraire",
             bareme="Compréhension / Pertinence : 6 — Organisation / Cohérence : 6 — Correction de l’expression : 6 — Originalité de la production : 2"
                    "Langue : 2",
             support=None, source_support=None,
             consignes=[
                 "Un critique écrit à propos de la poésie : « Le poète ne nous "
                 "apprend rien que nous ne sachions déjà ; il nous fait seulement "
                 "sentir ce que nous savions sans y penser. » En vous appuyant sur "
                 "*Stances et Poèmes* de Sully Prudhomme et sur vos lectures "
                 "personnelles, vous direz si cette définition vous paraît rendre "
                 "compte de ce qu'un poème apporte à son lecteur.",
                 "*Le candidat veillera à citer le texte avec exactitude et à "
                 "analyser chacune de ses citations.*",
             ]),

        dict(num="Sujet III — Commentaire composé",
             bareme="Compréhension : 6 — Organisation des idées : 6 — Langue et style : 6 — Présentation de la copie : 2"
                    "Langue : 2",
             support=X.P9,
             source_support=_src("P9"),
             disposition="vers",
             consignes=[
                 "**Faites le commentaire composé de ce poème.** Vous pourrez "
                 "étudier, entre autres, la manière dont le poète oppose deux "
                 "façons d'atteindre la vérité, et la valeur qu'il finit par "
                 "reconnaître à la poésie.",
                 "*Le plan comportera deux ou trois axes, chacun de deux ou trois "
                 "sous-parties. Les intertitres ne doivent pas figurer sur la "
                 "copie.*",
             ]),
    ],
)


DEVOIR1_CORRIGE = dict(
    titre="Devoir n° 1 — Corrigé et grilles d'évaluation",
    intro="Corrigé présenté selon le modèle des corrigés nationaux : analyse du "
          "sujet, problématique attendue, plan indicatif, citations utiles, grille "
          "chiffrée. Les indications sont rédigées à la troisième personne, à "
          "l'usage du correcteur.",
    sujets=[
        # Corrigé du sujet I : remplacé à la construction.
        dict(num="Corrigé du sujet I — Contraction et discussion",
             blocs=[("Corrigé remplacé à la construction", None)],
             grille=_grille("—", "—", "—", "—"),
             cloture=CLOTURE),

        dict(num="Corrigé du sujet II — Dissertation littéraire",
             blocs=[
                 ("Analyse du sujet",
                  "La citation contient deux propositions qu'il faut séparer. "
                  "D'abord une négation : le poète « ne nous apprend rien ». "
                  "Ensuite une restriction qui est en réalité une définition : il "
                  "nous fait « sentir » ce que nous savions « sans y penser ». Le "
                  "sujet oppose donc deux verbes — apprendre et sentir — et deux "
                  "états d'un même savoir : su mais inaperçu, su et éprouvé. Un "
                  "candidat qui traite « la poésie est-elle utile ? » se trompe de "
                  "sujet."),
                 ("Problématique attendue",
                  "Le poème apporte-t-il une connaissance nouvelle, ou seulement "
                  "une manière nouvelle d'éprouver ce que le lecteur savait déjà ?"),
                 ("Plan indicatif — trois parties", [
                     "**I. La citation se vérifie largement dans le recueil.** "
                     "« Le Vase brisé » n'apprend rien : tout le monde sait qu'une "
                     "blessure peut rester invisible. Le poème rend cette évidence "
                     "sensible en la faisant voir dans un objet. De même « Les "
                     "Berceaux » ne révèle pas que l'on cherche des abris ; il le "
                     "fait éprouver par le souvenir d'un objet au grenier. Le "
                     "candidat doit citer et analyser, non se contenter de "
                     "mentionner.",
                     "**II. Le recueil apporte pourtant des connaissances.** « Le "
                     "Lever du soleil » enseigne effectivement quelque chose : que "
                     "chacun ne voit du soleil que ce que sa position lui permet, "
                     "et que la science a substitué une beauté à une autre. « La "
                     "Femme » propose un récit d'origine. Ces poèmes instruisent, "
                     "et le mot « rien » de la citation devient alors trop fort.",
                     "**III. Dépassement : sentir est peut-être une façon de "
                     "connaître.** L'opposition entre savoir et sentir n'est pas "
                     "tenable. « Intus » ne tranche pas le débat entre la raison et "
                     "le cœur, mais il fait connaître au lecteur ce qu'est ce "
                     "conflit — et cette connaissance-là ne pouvait passer que par "
                     "l'expérience du poème. On acceptera toute troisième partie "
                     "qui déplace ainsi la question, quelle qu'en soit la "
                     "formulation.",
                 ]),
                 ("Citations utiles au candidat", [
                     "« Toujours intact aux yeux du monde, / Il sent croître et "
                     "pleurer tout bas / Sa blessure fine et profonde » (*Le Vase "
                     "brisé*).",
                     "« Cet instinct de vivre blottis / Dure encore à l'âge où nous "
                     "sommes » (*Les Berceaux*).",
                     "« Mais les hommes épars n'ont que des pas bornés » (*Le Lever "
                     "du soleil*).",
                     "« C'est mon martyre, et c'est le tien, / De vivre avec ces "
                     "deux murmures » (*Intus*).",
                     "« Que dans un autre cœur mon poème renaisse » (*Je me croyais "
                     "poète*).",
                 ]),
                 ("Ce qui doit être sanctionné", [
                     "Un devoir sans une seule citation exacte du recueil : C1 ne "
                     "peut excéder 2 points.",
                     "Un devoir qui récite la biographie de Sully Prudhomme en "
                     "guise d'introduction : la partie est hors sujet.",
                     "Un plan en deux parties « pour » et « contre » sans "
                     "dépassement : C2 plafonne à 4 points.",
                 ]),
                 ("Grille d'évaluation — Sujet II", None),
             ],
             grille=_grille(
                 "Le candidat reçoit 6 pts : s'il distingue les deux propositions "
                 "de la citation (apprendre / faire sentir), formule une "
                 "problématique qui les articule, et appuie chaque affirmation sur "
                 "une citation analysée du recueil. 4 pts : si la citation est "
                 "comprise mais que les exemples restent allusifs. 2 pts : si le "
                 "devoir traite un sujet voisin (l'utilité de la poésie, le rôle du "
                 "poète). 0 pt : hors sujet.",
                 "Le candidat reçoit 6 pts : si le devoir comporte introduction, "
                 "trois parties distinctes, transitions rédigées et conclusion qui "
                 "répond à la problématique. 4 pts : si le plan est perceptible "
                 "mais sans transitions, ou si la troisième partie répète les deux "
                 "premières. 2 pts : si les idées sont juxtaposées.",
                 "Le candidat reçoit 6 pts : si la syntaxe est correcte, le lexique "
                 "littéraire employé à bon escient, les vers cités avec la barre "
                 "oblique et les majuscules d'origine. 4 pts : si quelques fautes "
                 "subsistent sans gêner la lecture, ou si les citations sont mal "
                 "présentées. 2 pts : si les fautes gênent la lecture.",
                 "Le candidat reçoit 2 pts : s'il mobilise une œuvre extérieure au "
                 "programme, pertinente et exactement citée, ou propose une nuance "
                 "absente du corrigé. 1 pt : si l'exemple extérieur est exact mais "
                 "attendu. 0 pt : aucune ouverture."),
             cloture=CLOTURE_DISS),

        dict(num="Corrigé du sujet III — Commentaire composé de « La Poésie »",
             blocs=[
                 ("Situation du texte",
                  "« La Poésie » est le vingt-troisième poème de « La Vie "
                  "intérieure ». Dix quatrains d'octosyllabes à rimes croisées. Le "
                  "poème est un art poétique : il compare deux voies vers la vérité "
                  "— la démonstration géométrique et le poème — et finit par "
                  "choisir la seconde sans disqualifier la première."),
                 ("Problématique attendue",
                  "Comment un poème peut-il faire l'éloge de la démonstration "
                  "mathématique avant de lui préférer la poésie, sans se "
                  "contredire ?"),
                 ("Mouvements du texte", [
                     "**Strophes 1-2 : le dégoût des disputes.** Les hommes "
                     "discutent de Dieu sans avancer ; leurs phrases sont "
                     "admirables et creuses.",
                     "**Strophes 3-7 : le bonheur de la preuve.** Euclide, "
                     "l'évidence, la certitude ; le triangle tracé qui éveille « le "
                     "peuple des lois endormi ».",
                     "**Strophes 8-10 : le retournement.** « Non ! j'ai foi dans la "
                     "Poésie » ; la poésie dévoile d'un seul coup ce que la preuve "
                     "découvre pli à pli.",
                 ]),
                 ("Axes attendus (deux ou trois, au choix du candidat)", [
                     "**Axe A — Le procès des mots.** La comparaison centrale "
                     "« Mais les mots ressemblent aux vases : / Les plus beaux sont "
                     "les moins remplis » doit être citée exactement et analysée : "
                     "comparé (les mots), comparant (les vases), point commun (la "
                     "contenance), effet (l'éloquence est suspecte). On valorisera "
                     "le candidat qui rapproche ce vase-ci de celui du « Vase "
                     "brisé » et note que l'image sert deux fois à des fins "
                     "opposées.",
                     "**Axe B — L'éloge de la démonstration.** Champ lexical de la "
                     "lumière : « inondé de jour », « L'évidence, éclair de "
                     "l'étude », « Jaillit ». Verbes de la preuve : « Il propose, "
                     "il prouve, et j'écoute ». Comparaison développée avec "
                     "« l'antique sorcière » qui met « un monde obscur en "
                     "mouvement » : le géomètre est présenté comme un magicien, ce "
                     "qui prépare le renversement final.",
                     "**Axe C — Le retournement et son argument.** La question "
                     "feinte « Un triangle est donc préférable / Aux mots sonores "
                     "que j'ai lus ? » appelle la négation qui ouvre la strophe "
                     "suivante. L'argument tient dans une image de dévoilement : la "
                     "preuve « détache » le voile de la Vérité pli à pli, « le vent "
                     "des strophes » le lui arrache « d'un seul coup, de la tête "
                     "aux pieds ». Ce n'est pas la vérité qui change, c'est la "
                     "vitesse. On attend que le candidat le formule.",
                 ]),
                 ("Points de vigilance pour le correcteur", [
                     "Le poème ne condamne pas la science : le dernier quatrain dit "
                     "« Je regarderais sans envie / Képler toiser le firmament ». "
                     "Un candidat qui conclut à un rejet de la science se trompe.",
                     "La condition « Si j'étais poète vraiment » doit être relevée : "
                     "l'éloge de la poésie est suspendu à un doute sur soi, comme "
                     "dans « Je me croyais poète ».",
                     "La citation « Mais les mots ressemblent aux vases » est "
                     "souvent déformée en « les mots sont comme des vases ». Elle "
                     "doit être exacte : la comparaison porte sur le verbe.",
                 ]),
                 ("Grille d'évaluation — Sujet III", None),
             ],
             grille=_grille(
                 "Le candidat reçoit 6 pts : s'il identifie le genre du texte (art "
                 "poétique), suit les trois mouvements, et interprète le "
                 "retournement de la strophe 8 sans en faire un rejet de la "
                 "science. 4 pts : si l'analyse est juste mais laisse de côté le "
                 "dernier tiers du poème. 2 pts : si le devoir paraphrase strophe "
                 "après strophe. 0 pt : contresens général.",
                 "Le candidat reçoit 6 pts : si le devoir est composé en axes "
                 "annoncés puis tenus, avec introduction en trois étapes et "
                 "conclusion ouvrant sur un autre texte. 4 pts : si les axes "
                 "existent mais suivent l'ordre du poème (plan linéaire déguisé). "
                 "2 pts : si le devoir est une suite de remarques.",
                 "Le candidat reçoit 6 pts : si les vers sont cités avec la barre "
                 "oblique, les procédés nommés exactement (comparaison, champ "
                 "lexical, question oratoire) et la langue correcte. 4 pts : si "
                 "les procédés sont nommés mais non interprétés. 2 pts : si les "
                 "fautes gênent la lecture.",
                 "Le candidat reçoit 2 pts : s'il rapproche le poème d'un autre "
                 "texte du recueil ou hors programme de façon éclairante — par "
                 "exemple le double emploi de l'image du vase. 1 pt : "
                 "rapprochement exact mais sans exploitation. 0 pt : aucun."),
             cloture=CLOTURE_CC),
    ],
)


# ═══════════════════════════════════════ DEVOIR N° 2 — DEVOIR SURVEILLÉ (2 H)
DEVOIR2 = dict(
    titre="Devoir n° 2 — Devoir surveillé de contrôle (2 heures)",
    entete=[
        ["Nature", "Devoir de contrôle en cours d'étude de l'œuvre"],
        ["Classe", "Première / Terminale — toutes séries"],
        ["Durée", "2 heures"],
        ["Support", "« L'Habitude », section « La Vie intérieure », poème entier"],
        ["Barème", "Questions : 12 points — Production écrite : 8 points"],
    ],
    consigne_generale="Ce devoir se place après l'étude des fiches 1 à 4. Il vérifie "
                      "la maîtrise des outils d'analyse avant l'épreuve longue. Les "
                      "questions sont à traiter dans l'ordre ; la production écrite "
                      "est obligatoire et compte pour huit points.",
    support=X.P10,
    source_support=_src("P10"),
    disposition="vers",

    questions=[
        ("I. Compréhension du texte (4 points)", [
            "**1.** À quoi l'habitude est-elle comparée dans le premier quatrain ? "
            "Relevez les deux mots qui la désignent. **(2 pts)**",
            "**2.** Le poème porte sur l'habitude un jugement qui change en cours de "
            "route. À partir de quel vers ce changement se produit-il ? Recopiez ce "
            "vers et justifiez votre choix en deux phrases. **(2 pts)**",
        ]),
        ("II. Étude de la langue et des procédés (8 points)", [
            "**3.** Relevez les adjectifs qui qualifient l'habitude dans les "
            "quatrains 2 et 4. Que produit leur accumulation, et pourquoi le "
            "lecteur est-il surpris par la suite du poème ? **(2 pts)**",
            "**4.** « Et lui dit tout bas : “Par ici.” » a) De quel procédé "
            "d'énonciation s'agit-il ? b) Pourquoi cette réplique est-elle plus "
            "efficace qu'une description du même phénomène ? **(2 pts)**",
            "**5.** « Elle a l'œil de la vigilance, / Les lèvres douces du "
            "sommeil. » a) Nommez la figure qui donne un corps à une notion "
            "abstraite. b) Les vers 15 et 16 se contredisent-ils ? "
            "Expliquez. **(2 pts)**",
            "**6.** Étudiez les deux derniers vers du poème : « Sont des hommes par "
            "la figure, / Des choses par le mouvement. » a) Relevez la construction "
            "symétrique. b) Quels sont les deux termes opposés ? c) Pourquoi cette "
            "chute est-elle plus dure qu'une condamnation explicite ? **(2 pts)**",
        ]),
        ("III. Production écrite (8 points)", [
            "**7.** Rédigez entièrement l'introduction et le premier axe du "
            "commentaire composé de ce poème. L'axe comportera deux sous-parties, "
            "chacune appuyée sur au moins deux citations analysées. On attend "
            "environ trois cents mots. Les intertitres ne doivent pas figurer sur "
            "la copie.",
        ]),
    ],
)


DEVOIR2_CORRIGE = dict(
    titre="Devoir n° 2 — Corrigé et grille d'évaluation",
    cloture=CLOTURE,
    reponses=[
        ("1. La comparaison initiale (2 pts)",
         "L'habitude est comparée à une personne qui entre dans une maison : « une "
         "étrangère » puis « une ancienne ménagère ». Le candidat reçoit 2 pts s'il "
         "cite les deux termes ; 1 pt s'il n'en donne qu'un. On acceptera qu'il "
         "nomme le procédé — personnification, ou métaphore filée — sans que cela "
         "soit exigé ici."),
        ("2. Le vers du retournement (2 pts)",
         "Le changement se produit au vers 17 : « Mais imprudent qui s'abandonne ». "
         "Le candidat reçoit 2 pts s'il recopie ce vers et justifie par la "
         "conjonction « Mais » et par le passage de l'éloge à l'avertissement. "
         "1 pt s'il désigne le bon quatrain sans citer le vers exact. On acceptera "
         "également le vers 19 (« Cette vieille au pas monotone ») s'il est "
         "justifié par le changement de désignation — de « ménagère » à "
         "« vieille »."),
        ("3. Les adjectifs et l'effet de surprise (2 pts)",
         "Quatrain 2 : « discrète », « humble », « fidèle », « familière ». "
         "Quatrain 4 : « sûr », « pareil » (pour le geste), « douces » (pour les "
         "lèvres). Le candidat reçoit 2 pts s'il en relève au moins cinq et note "
         "qu'ils sont tous laudatifs ou rassurants ; l'accumulation installe une "
         "figure bienveillante, ce qui rend le retournement d'autant plus brutal. "
         "1 pt si le relevé est fait sans interprétation."),
        ("4. Le discours direct (2 pts)",
         "a) Il s'agit du **discours direct** : guillemets, deux-points, verbe "
         "introducteur « dit ». b) 2 pts si le candidat explique que la réplique "
         "fait entendre l'habitude au lieu de la décrire, et que sa brièveté — deux "
         "mots — imite la discrétion dont parle le poème. 1 pt si seul le procédé "
         "est nommé."),
        ("5. La personnification et son paradoxe (2 pts)",
         "a) **Personnification** (on acceptera « allégorie » si le candidat "
         "justifie que la figure tient tout le poème). b) 2 pts si le candidat "
         "montre que « l'œil de la vigilance » et « les lèvres douces du sommeil » "
         "associent deux états contraires — veiller et endormir — et que cette "
         "contradiction est précisément ce que le poème reproche à l'habitude : "
         "elle travaille pendant que nous ne pensons plus. 1 pt si la contradiction "
         "est relevée sans être interprétée."),
        ("6. La chute (2 pts)",
         "a) Construction symétrique : « Sont des hommes par la figure, / Des "
         "choses par le mouvement » — même préposition, même place, deux "
         "attributs opposés. b) Les deux termes opposés sont **hommes** et "
         "**choses**. c) 2 pts si le candidat explique que le poème ne condamne "
         "personne : il constate une transformation, ce qui est plus dur qu'un "
         "reproche, car un reproche suppose encore une liberté. 1 pt si l'opposition "
         "est relevée sans cette analyse."),
        ("7. Production écrite — attentes (8 pts)", None),
        ("Éléments attendus dans l'introduction",
         "Situation (Sully Prudhomme, *Stances et Poèmes*, 1865, section « La Vie "
         "intérieure »), présentation du poème (six quatrains d'octosyllabes, "
         "personnification de l'habitude), problématique (par exemple : comment un "
         "portrait bienveillant se retourne-t-il en avertissement ?), annonce de "
         "l'axe. Aucune analyse ne doit figurer dans l'introduction."),
        ("Axes acceptables pour le premier axe", None),
        ("Proposition A", "« Un portrait rassurant » — la métaphore domestique "
         "(l'étrangère, la ménagère, la maison), puis l'accumulation des adjectifs "
         "favorables et les « invisibles soins »."),
        ("Proposition B", "« Une présence qui agit à notre place » — les verbes dont "
         "l'habitude est sujet (« conduit », « sait », « connaît », « dit »), et la "
         "dépossession progressive du « il » qui les subit."),
        ("Grille d'évaluation — production écrite", None),
    ],
    grille_prod=[
        ["Critère", "Indicateurs", "Points"],
        ["Introduction",
         "Le candidat reçoit 2 pts : si l'introduction comporte les trois étapes — "
         "situation du poème dans l'œuvre, problématique formulée en question, "
         "annonce de l'axe. 1 pt : si une étape manque. 0 pt : si l'introduction se "
         "réduit à une présentation de l'auteur.", "2"],
        ["Construction de l'axe",
         "Le candidat reçoit 3 pts : si l'axe comporte deux sous-parties "
         "distinctes, chacune ouverte par une idée directrice et fermée par une "
         "phrase de bilan. 2 pts : si les sous-parties existent sans idée "
         "directrice explicite. 1 pt : si l'axe suit l'ordre des strophes sans "
         "organisation.", "3"],
        ["Citations et analyse",
         "Le candidat reçoit 2 pts : si chaque sous-partie s'appuie sur au moins "
         "deux citations exactes, chacune suivie du nom du procédé et de son effet. "
         "1 pt : si les citations sont présentes mais non analysées. 0 pt : si le "
         "devoir ne cite pas.", "2"],
        ["Langue et présentation",
         "Le candidat reçoit 1 pt : si la syntaxe est correcte, les vers cités avec "
         "la barre oblique, et la copie lisible. 0 pt : si les fautes gênent la "
         "lecture.", "1"],
        ["**Total**", "", "**8**"],
    ],
)


ENCADRES_DEVOIRS = [
    ("methode", "Citer un vers, et non une ligne", [
        "Un poème ne se cite pas comme un roman. Quatre règles, qui valent des "
        "points à chaque devoir :",
        "- **La barre oblique marque la fin du vers.** « Toujours intact aux yeux "
        "du monde, / Il sent croître et pleurer tout bas. »",
        "- **La majuscule d'origine est conservée**, même au milieu d'une phrase "
        "du candidat : c'est le texte de l'auteur.",
        "- **Une citation longue se détache** : deux points, retour à la ligne, "
        "les vers copiés tels quels, un par ligne, sans guillemets.",
        "- **On numérote les vers** quand on en cite plusieurs éloignés : (v. 12) "
        "et (v. 20) valent mieux que « au début » et « à la fin ».",
    ]),
    ("astuce", "Compter un vers sans se tromper", [
        "Trois pièges, et la manière de les éviter :",
        "- **L'e muet.** Il se prononce devant une consonne, s'élide devant une "
        "voyelle ou un h muet, et ne compte jamais en fin de vers. « Le vas(e) où "
        "meurt cette verveine » : huit syllabes.",
        "- **La diérèse.** Deux voyelles voisines peuvent compter pour deux "
        "syllabes. Si votre compte tombe une syllabe trop court, cherchez-en une.",
        "- **Les noms propres et les mots rares** suivent la même règle que les "
        "autres : ne pas les compter au jugé.",
        "**La méthode sûre** : compter sur les doigts, à voix basse, en marquant "
        "chaque syllabe. Un candidat qui écrit « octosyllabe » sans avoir compté "
        "se trompe une fois sur trois.",
    ]),
    ("vigilance", "Ce qui coûte le plus de points en poésie", [
        "Trois erreurs reviennent dans presque toutes les copies faibles :",
        "- **Nommer sans interpréter.** « Il y a une anaphore » ne vaut rien si "
        "l'on ne dit pas ce qu'elle produit dans ce texte-ci.",
        "- **Paraphraser.** Raconter le poème strophe après strophe n'est pas le "
        "commenter. Le test : si votre phrase pourrait figurer dans un résumé, "
        "elle n'a pas sa place dans un commentaire.",
        "- **Séparer le fond de la forme.** Un axe sur le sens suivi d'un axe sur "
        "la versification donne deux devoirs juxtaposés. Chaque procédé doit être "
        "analysé là où il sert le sens.",
    ]),
]
