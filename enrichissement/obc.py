# -*- coding: utf-8 -*-
"""
Normes de l'Office du Baccalauréat du Cameroun, relevées sur les corrigés
harmonisés nationaux (sessions 2020 à 2022, Littérature, séries A-ABI) et sur
les deux maquettes de rédaction jointes.

Source : `Desktop/méthodologies.doc` — recueil de corrigés harmonisés
nationaux de l'OBC, Division des examens.

Trois choses en sortent, et elles corrigent ce que les cahiers portaient :

1. **Le barème réel.** Ce n'est pas « introduction 3 / axes 12 / conclusion 3
   / langue 2 », c'est **6 / 6 / 6 / 2**, avec des sous-critères chiffrés.

2. **Le vocabulaire officiel.** Le corrigé national ne dit pas « axe » mais
   **centre d'intérêt** ; pas « sous-partie » mais **sous-centre** ; pas
   « procédé » mais **outil d'analyse**. Un élève qui emploie le vocabulaire
   de son correcteur est lu plus vite et mieux noté.

3. **Les deux maquettes de rédaction** — celle du commentaire composé et
   celle de la dissertation —, qui donnent les tournures attendues, étape par
   étape. Elles sont reproduites ici pour que les devoirs rédigés des cahiers
   les suivent réellement, et non de loin.
"""

# ═══════════════════════════════════════════════════════ GRILLES OFFICIELLES
# Commentaire composé : le corrigé 2020 détaille les sous-critères.
# Les indicateurs sont ceux du corrigé national ; les paliers d'attribution
# sont ajoutés par le cahier. La grille officielle chiffre les sous-critères
# mais ne dit pas à quelle condition on accorde le maximum : c'est pourtant ce
# dont un correcteur d'établissement a besoin pour harmoniser.
GRILLE_CC = [
    ["Critère", "Indicateurs officiels et paliers d'attribution", "Points"],
    ["C1 — Compréhension",
     "Originalité du travail : 1,5 pt. Intérêts du texte dégagés : 1,5 pt. "
     "Lecture pertinente du texte : 3 pts. — Le candidat reçoit 6 pts : si la "
     "situation du texte est exacte, l'idée générale juste, les centres "
     "d'intérêt pertinents, et si la rubrique « Intérêts du texte » est "
     "présente et développée. 4 pts : si les intérêts du texte manquent ou se "
     "réduisent à une ligne. 2 pts : si le devoir paraphrase le texte. 0 pt : "
     "contresens général.", "6"],
    ["C2 — Organisation des idées",
     "Qualité des observations : 3 pts. Précision et illustrations : 3 pts. "
     "— Le candidat reçoit 6 pts : si chaque centre d'intérêt est annoncé puis "
     "tenu, subdivisé en sous-centres, et si les transitions — partielles et "
     "de partie — sont rédigées. 4 pts : si le plan existe mais suit l'ordre "
     "du texte. 2 pts : si le devoir est une suite de remarques.", "6"],
    ["C3 — Langue et style",
     "Richesse et précision du vocabulaire : 3 pts. Syntaxe, orthographe, "
     "emploi des temps : 3 pts. — Le candidat reçoit 6 pts : si les outils "
     "d'analyse sont nommés exactement puis interprétés, et si la langue est "
     "correcte. 4 pts : si les outils sont nommés sans être interprétés. "
     "2 pts : si les fautes gênent la lecture.", "6"],
    ["C4 — Présentation de la copie",
     "Mise en page ; lisibilité ; propreté de la copie. — Le candidat reçoit "
     "2 pts : si les alinéas sont respectés, les deux lignes sautées après "
     "l'introduction et de part et d'autre de la transition, la copie propre "
     "et sans ratures. 1 pt : si la mise en page est négligée. 0 pt : copie "
     "illisible.", "2"],
    ["**Total**", "", "**20**"],
]

# Dissertation : les indicateurs sont ceux de la grille nationale.
GRILLE_DISS = [
    ["Critère", "Indicateurs", "Points"],
    ["C1 — Compréhension / Pertinence",
     "Définition du domaine et de la problématique. Respect de la consigne. "
     "Richesse et justesse des arguments et des illustrations. Pertinence et "
     "qualité des idées, des arguments et des exemples. — Le candidat reçoit "
     "6 pts : si le thème est dégagé, la citation reformulée, la problématique "
     "posée en question, et chaque argument illustré par une œuvre précise. "
     "4 pts : si la problématique est implicite ou les exemples allusifs. "
     "2 pts : si le devoir traite un sujet voisin. 0 pt : hors sujet.", "6"],
    ["C2 — Organisation / Cohérence",
     "Respect de la structure de l'exercice (introduction, développement, "
     "conclusion). Cohérence et logique de la démonstration. Enchaînement "
     "logique des idées et utilisation judicieuse des connecteurs logiques. "
     "Cohésion : convergence des idées vers un même but. Efficacité dans "
     "l'argumentation. — Le candidat reçoit 6 pts : si les cinq temps de "
     "chaque argument sont respectés (idée, explication, exemple, citation, "
     "transition partielle) et si les transitions de partie sont rédigées. "
     "4 pts : si le plan est perceptible mais sans transitions. 2 pts : si les "
     "idées sont juxtaposées.", "6"],
    ["C3 — Correction de l'expression",
     "Richesse et précision du vocabulaire. Respect des normes de la syntaxe. "
     "Respect des accords et correction de l'orthographe. Maniement correct "
     "des temps et des modes. — Le candidat reçoit 6 pts : si les connecteurs "
     "logiques sont variés et justes, les citations exactes, la langue "
     "correcte. 4 pts : si quelques fautes subsistent sans gêner la lecture. "
     "2 pts : si les fautes gênent la lecture.", "6"],
    ["C4 — Originalité de la production",
     "Originalité des idées ou de l'expression. Respect des alinéas, mise en "
     "page correcte. Copie propre, écriture lisible, aérée, sans ratures. "
     "— Le candidat reçoit 2 pts : s'il mobilise une œuvre hors programme, "
     "exactement citée, ou propose une nuance absente du corrigé, et si la "
     "copie est soignée. 1 pt : si l'un des deux manque. 0 pt : ni l'un ni "
     "l'autre.", "2"],
    ["**Total**", "", "**20**"],
]

# Les deux formules que les corrigés nationaux répètent d'une session à
# l'autre. Elles engagent le correcteur, et le cahier doit les porter telles
# quelles.
CLOTURE_CC = ("On insistera tout particulièrement sur l'exploitation par le "
              "candidat des procédés de style, les éléments du vocabulaire, la "
              "syntaxe etc. dans ses démonstrations et autres illustrations. "
              "On restera également ouvert à toute autre orientation "
              "pertinente du sujet par le candidat.")

CLOTURE_DISS = ("On restera ouvert à toute autre orientation pertinente du "
                "sujet par le candidat. Le candidat qui aura présenté des "
                "arguments autres que ceux évoqués ici ne devra pas être "
                "pénalisé, dès lors qu'ils sont justes et illustrés.")


# ══════════════════════════════════════════════ PLAN D'UN CORRIGÉ NATIONAL
# L'ordre des rubriques est fixe. Un corrigé de cahier qui ne le suit pas
# désoriente l'enseignant qui a l'habitude des corrigés officiels.
RUBRIQUES_CC = ["Situation du texte", "Idée générale", "Plan possible",
                "Première partie", "Transition", "Deuxième partie",
                "Intérêts du texte"]

RUBRIQUES_DISS = ["Thème", "Reformulation", "Problématique", "Type de plan",
                  "Plan possible", "Première partie", "Transition",
                  "Deuxième partie", "Synthèse"]


# ═══════════════════════════════════════════════════ LES DEUX MAQUETTES
MAQUETTE_CC = ("methode", "Maquette de rédaction du commentaire composé (OBC)", [
    "Le corps du devoir se rédige selon un enchaînement fixe. Les formules "
    "ci-dessous sont celles du document officiel : elles ne sont pas des "
    "ornements, ce sont les articulations que le correcteur cherche.",
    "**Après l'introduction, sauter deux lignes.**",
    "**1. Annonce du premier centre d'intérêt.** « D'entrée de jeu, nous "
    "allons étudier… (C1). Ceci se manifeste à travers… (sc1) et… (sc2). » — "
    "variantes : « Pour commencer notre commentaire, analysons… », « Entamons "
    "cette lecture en nous penchant sur… », « D'emblée, nous allons nous "
    "attarder sur… ».",
    "**2. Le premier sous-centre.** « En effet / En fait / En réalité, il est "
    "clair que le narrateur (l'auteur) présente… (sc1). » Puis l'explication : "
    "« Il faut comprendre par là que / Cela revient à dire / Autrement dit / "
    "C'est dire… » — **au moins trois phrases**.",
    "**3. L'outil d'analyse.** « Cela s'illustre dans le passage à travers… / "
    "On le perçoit dans le texte avec… / Cette idée est visible avec… » "
    "(outil 1). Puis son interprétation : « Cet indice traduit / Cet élément "
    "met en évidence / Il vient signaler / On comprend à travers lui que… ».",
    "**4. Le second outil.** « Aussi / Dans le même sens / Dans un sillage "
    "analogue, cet outil est renforcé par… » (outil 2), puis « Il illustre / "
    "connote / laisse entendre… ».",
    "**5. La transition partielle.** « Cette idée débouche sur / conduit à… / "
    "Tout ceci passe nécessairement par… » — elle annonce le sous-centre "
    "suivant.",
    "**6. Le second sous-centre.** « Par ailleurs / En outre / Ensuite / De "
    "plus, on peut aussi relever / examiner / analyser / étudier… (sc2) », et "
    "l'on reprend le même enchaînement.",
    "**7. La transition entre les deux centres**, à la ligne. « De ce qui "
    "précède / À ce niveau de la lecture / À mi-chemin de notre commentaire, "
    "nous pouvons relever que… » (bilan du centre, **avec des synonymes**), "
    "puis « Il convient maintenant de se pencher sur… / Nous allons dès à "
    "présent examiner… / Qu'en est-il de… (C2) ? ».",
    "**Après la transition, sauter de nouveau deux lignes.**",
    "**8. Le second centre d'intérêt.** « Poursuivons notre analyse en "
    "étudiant la façon dont il est fait étalage de… (C2) à partir de… et "
    "de… », puis le même enchaînement qu'au premier centre.",
    "**Après la fin du corps du devoir, sauter deux lignes.**",
])

MAQUETTE_DISS = ("methode", "Maquette de rédaction de la dissertation (OBC)", [
    "Le développement se construit en cinq temps par argument. Les formules "
    "sont celles du document officiel.",
    "**Annonce de la thèse.** « L'auteur (Nom) pense / soutient / est d'avis "
    "que… » — ou « Selon (Nom) », « D'après… ». Puis : « Plusieurs arguments "
    "(idées, raisons, motifs) valident / justifient / confirment / confortent "
    "son point de vue (sa position, sa posture) : ».",
    "**1. L'idée**, en une phrase. « Tout d'abord / D'entrée de jeu / D'emblée "
    "/ Premièrement… ».",
    "**2. L'explication**, en trois ou quatre phrases. « Autrement dit / Cela "
    "signifie / Ceci revient à dire / C'est dire / Il faut comprendre là "
    "que… ».",
    "**3. L'exemple**, commenté. « C'est le cas dans / Par exemple / À "
    "l'exemple de / À titre illustratif / En guise d'illustration / Cette idée "
    "se vérifie dans… ».",
    "**4. La citation**, commentée. « C'est ce qui amène tel à dire / Voilà "
    "pourquoi tel a pu déclarer / Tel a donc raison quand il dit que… ».",
    "**5. La transition partielle.** « Cette idée prend encore plus "
    "d'épaisseur avec… / La thèse de (auteur) se révèle davantage pertinente à "
    "travers… ». Elle annonce l'argument suivant.",
    "**Le second argument** reprend le même procédé : « Ensuite / En outre / "
    "De plus / Par ailleurs / Deuxièmement… ».",
    "**La transition entre les parties**, à la ligne. « À ce niveau de la "
    "réflexion / De ce qui précède / À mi-chemin de notre analyse, nous "
    "pouvons dire (relever, avancer, noter) que… » (bilan de la thèse), puis "
    "« Toutefois / Cependant / Seulement / Nonobstant, il faut aussi admettre "
    "(reconnaître, préciser) que… » (annonce de l'antithèse).",
    "**L'antithèse.** « La position défendue par… est évidente, mais, quoique "
    "valide, la pensée de tel présente des limites (des manquements, des "
    "carences). En effet / En réalité / En fait… ». Puis les mêmes cinq temps.",
    "**Après la transition** : « Nous poursuivons notre démonstration en "
    "évoquant (en abordant) la question de… ».",
    "**Attention à la transition partielle** : elle intervient après le "
    "premier argument de chaque partie, et après le deuxième si la partie en "
    "compte trois. C'est elle qui oblige à enchaîner logiquement les idées au "
    "lieu de les juxtaposer.",
])

LEXIQUE_OUTILS = ("astuce", "Les outils d'analyse, dans les mots du correcteur", [
    "Les corrigés nationaux emploient un vocabulaire précis. L'adopter, c'est "
    "être lu par un correcteur qui reconnaît ses propres termes.",
    "- **Caractérisation nominale** : on qualifie par un nom ou un groupe "
    "nominal — « les bêtes », « des faubourgs en feu ».",
    "- **Caractérisation adjectivale** : on qualifie par un adjectif — "
    "« leurs plumes meurtrières ».",
    "- **Caractérisation péjorative** : la qualification dévalorise, souvent "
    "par une subordonnée relative.",
    "- **Champ lexical** : l'ensemble des mots d'un même domaine. On le "
    "**relève en entier**, entre guillemets, puis on dit ce qu'il produit.",
    "- **Reprise anaphorique** : un mot repris en tête de plusieurs "
    "propositions. On indique le nombre d'occurrences — « (2 occ) ».",
    "- **Valeur d'un temps** : « présent de l'indicatif à valeur descriptive », "
    "« imparfait à valeur itérative ». On ne nomme pas un temps sans dire sa "
    "valeur.",
    "- **Métaphore hyperbolisante**, **métonymie**, **interjection**, "
    "**gradation**, **antithèse**, **tonalité satirique** : tous employés dans "
    "les corrigés nationaux.",
    "**Le mot qui compte le plus** : *centre d'intérêt* pour les grandes "
    "parties, *sous-centre* pour leurs subdivisions, *outil d'analyse* pour ce "
    "qui les prouve. C'est le vocabulaire de la grille.",
])

INTERETS_TEXTE = ("astuce", "Les « intérêts du texte » : une rubrique notée", [
    "Le corrigé national termine le commentaire par une rubrique « Intérêts du "
    "texte », et la grille lui accorde **1,5 point** sur les 6 de la "
    "compréhension. Une copie qui l'omet perd ces points sans le savoir.",
    "Trois entrées, une phrase chacune :",
    "- **Intérêt stylistique** : la richesse des procédés d'écriture. On les "
    "énumère — métaphores, caractérisation, champs lexicaux, interjection.",
    "- **Intérêt psychologique** : ce que le texte fait éprouver, ou ce qu'il "
    "montre d'un état d'âme.",
    "- **Intérêt social ou humain** : ce que le texte dit de la société ou de "
    "la condition humaine.",
    "On peut y ajouter un **intérêt historique** ou **didactique** quand le "
    "texte s'y prête. Ces trois lignes se rédigent en cinq minutes et "
    "rapportent plus que dix lignes de développement supplémentaire.",
])


def grille_pour(intitule, defaut=None):
    """La grille officielle qui convient à ce sujet.

    Le type d'exercice se lit dans l'intitulé du corrigé — « Commentaire
    composé », « Dissertation », « Contraction ». La contraction garde la
    grille du cahier : le document officiel n'en publie pas pour elle, et
    celle des cahiers est déjà au format 6/6/6/2.
    """
    t = (intitule or "").lower()
    if "commentaire" in t:
        return GRILLE_CC
    if "dissertation" in t:
        return GRILLE_DISS
    return defaut if defaut else GRILLE_DISS


def cloture_pour(intitule, defaut=None):
    """La formule de clôture que le corrigé national emploie pour ce type."""
    t = (intitule or "").lower()
    if "commentaire" in t:
        return CLOTURE_CC
    if "dissertation" in t:
        return CLOTURE_DISS
    return defaut if defaut else CLOTURE_DISS
