# -*- coding: utf-8 -*-
"""4ᵉ — *Trois prétendants… un mari* : écrire, jouer, s'évaluer.

Deux ateliers : **le résumé** — parce qu'une pièce en cinq actes est le
meilleur terrain d'entraînement qui soit — et **le texte explicatif**, parce
que cette comédie repose tout entière sur une coutume qu'il faut savoir
expliquer avant de pouvoir en discuter.
"""
import jeux
import source
from gabarit import (epreuve_etude_texte, epreuve_expression,
                     epreuve_orthographe, production)
from kit import enc, grille, h2, h3, p, saut

CLE = "pretendants"
SRC = ("Guillaume Oyônô Mbia, *Trois prétendants… un mari*, "
       "Éditions CLE, Yaoundé, 1964")
BORNES = ["Rideau", "TABLE DES MATIÈRES", "Expressions locales", "PERSONNAGES"]


# ==================================================== 5. Les productions

def partie5():
    b = [h2("5. J'écris — résumer et expliquer"),
         p("Deux ateliers ici, et cinq autres t'attendent dans les deux "
           "œuvres suivantes. Chaque type d'écrit n'est travaillé **qu'une "
           "fois** : ensuite, c'est à toi de le réemployer."),
         p("La règle ne change pas : **le modèle d'abord, la règle ensuite.**")]

    b += production(
        "le résumé",
        "résumer un texte long en gardant l'essentiel et rien d'autre.",
        modele=(
            "**Le texte de départ (extrait de l'acte I, en 118 mots) :**\n"
            "*« Atangana explique à Juliette qu'un jeune homme est venu "
            "demander sa main cinq semaines plus tôt et qu'on a accepté ses "
            "cent mille francs à cause de son instruction et de sa valeur ; il "
            "ajoute précipitamment que l'argent a été mis de côté, car on "
            "attend l'après-midi même la visite d'un grand fonctionnaire qui "
            "veut lui aussi l'épouser, et que, naturellement, s'il verse une "
            "dot plus importante… Juliette, indignée, demande si elle est "
            "donc à vendre, pourquoi on cherche à la donner au plus offrant, "
            "et si l'on ne peut pas la consulter pour un mariage qui la "
            "concerne. »*\n\n"
            "**Le résumé (39 mots, soit le tiers) :**\n"
            "❶ Atangana apprend à Juliette ❷ qu'elle a été promise à un "
            "prétendant pour cent mille francs ❸ et qu'un second, plus riche, "
            "est attendu. ❹ Elle proteste : ❺ on la vend au plus offrant sans "
            "lui demander son avis."),
        annotations=[
            ["❶ Qui fait quoi",
             "Le sujet et le verbe principal. **On garde toujours l'action.**"],
            ["❷ Le fait central",
             "La promesse et le chiffre. Un chiffre précis est de "
             "l'information : on le garde."],
            ["❸ La complication",
             "Le second prétendant. Sans elle, on ne comprend plus rien."],
            ["❹ La réaction",
             "Un seul verbe : *elle proteste*. Les trois questions de Juliette "
             "sont ramenées à leur idée."],
            ["Ce qu'on a supprimé",
             "« cinq semaines plus tôt », « à cause de son instruction », "
             "« précipitamment », « mis de côté » : des **détails**, non des "
             "faits."],
            ["❺ L'idée, pas les mots",
             "« au plus offrant sans lui demander son avis » **reformule** "
             "les trois questions. Un résumé ne recopie pas."]],
        questions=[
            "Compte les mots du texte de départ, puis ceux du résumé. Quel "
            "rapport obtiens-tu ?",
            "Fais la liste de tout ce qui a été supprimé. Range-le en deux "
            "colonnes : *détails* / *répétitions*.",
            "Le résumé contient-il une seule phrase recopiée du texte ? "
            "Vérifie mot à mot.",
            "Le résumé garde le chiffre « cent mille francs » mais supprime "
            "« cinq semaines ». Pourquoi cette différence de traitement ?",
            "Réécris le résumé en **vingt mots**. Que dois-tu sacrifier en "
            "premier ?"],
        regle=[
            "Résumer, c'est réduire un texte **au quart ou au tiers** en "
            "gardant : **qui fait quoi**, **le fait central**, **la "
            "complication**, **la conclusion**.",
            "On supprime : les exemples, les détails de circonstance, les "
            "répétitions, les adjectifs d'appréciation, les paroles rapportées "
            "au style direct.",
            "**On reformule, on ne recopie pas.** Un résumé fait de phrases "
            "empruntées n'est pas un résumé.",
            "On respecte **le système d'énonciation** : si le texte parle à la "
            "3ᵉ personne, le résumé aussi ; on ne dit jamais « l'auteur dit "
            "que… ».",
            "**On annonce le nombre de mots** à la fin, entre parenthèses : "
            "c'est la règle de l'exercice."],
        exercices=[
            "**Repère l'essentiel.** Dans l'acte II, souligne les cinq phrases "
            "sans lesquelles on ne comprendrait pas la scène. Cinq, pas six.",
            "**Réduis par étapes.** Prends la tirade de présentation de Mbia. "
            "Réécris-la en 60 mots, puis en 30, puis en 15. Note ce que tu "
            "perds à chaque étape.",
            "**Écris seul.** Résume **l'acte III** en 120 à 150 mots. "
            "Obligatoire : la 3ᵉ personne, aucune phrase recopiée, le nombre "
            "de mots indiqué à la fin.",
            "**Fais vérifier.** Ton voisin, qui n'a pas relu l'acte, doit "
            "pouvoir dire ce qui s'y passe et **pourquoi Juliette refuse**. "
            "S'il ne le peut pas, il manque le fait central."],
        astuce=("Le test des trois questions", [
            "Avant d'écrire une phrase de résumé, demande-toi : **si je "
            "l'enlève, est-ce qu'on comprend encore la suite ?**",
            "Si oui → c'est un détail, tu le supprimes.",
            "Si non → c'est un fait, tu le gardes.",
            "Applique le test à chaque phrase. Un résumé bien fait n'est pas "
            "un texte raccourci : c'est un texte **filtré**."]))

    b += production(
        "le texte explicatif",
        "expliquer clairement une coutume ou un mécanisme à quelqu'un qui ne "
        "le connaît pas.",
        modele=(
            "❶ **La dot est la somme que la famille d'un prétendant verse à "
            "celle de la jeune fille avant le mariage.** ❷ Elle existe dans "
            "de nombreuses sociétés, sous des formes très différentes : "
            "argent, bétail, travail agricole, biens de maison.\n"
            "❸ Elle remplit d'abord un rôle de garantie : en versant une "
            "somme importante devant témoins, la famille du mari s'engage "
            "publiquement, et il devient difficile de renvoyer l'épouse sans "
            "scandale. ❹ Elle sert ensuite à **compenser** : la jeune fille "
            "quitte la maison qui l'a élevée, et celle-ci perd une force de "
            "travail.\n"
            "❺ Mais le mécanisme se dérègle dès que la somme devient un "
            "revenu. ❻ Dans *Trois prétendants… un mari*, la dot de Juliette "
            "doit servir à doter l'épouse de son frère : elle n'est plus une "
            "garantie, elle est devenue **une monnaie**.\n"
            "❼ On comprend alors pourquoi Juliette demande à être consultée : "
            "elle n'est pas la bénéficiaire de la transaction, elle en est "
            "l'objet."),
        annotations=[
            ["❶ La définition",
             "Une phrase, au **présent de vérité générale**. On définit avant "
             "d'expliquer."],
            ["❷ L'étendue du phénomène",
             "Où cela existe, sous quelles formes. On situe."],
            ["❸ ❹ Les fonctions, une par une",
             "*d'abord… ensuite…* Chaque fonction est nommée, puis expliquée."],
            ["❺ Le point de bascule",
             "Le mot **mais** : on passe du fonctionnement normal au "
             "dérèglement."],
            ["❻ L'exemple pris dans l'œuvre",
             "Un cas précis, avec le titre en italique. **Sans exemple, une "
             "explication reste abstraite.**"],
            ["❼ La conséquence",
             "*On comprend alors pourquoi…* : l'explication débouche sur ce "
             "qu'elle éclaire."]],
        questions=[
            "À quel temps sont les verbes ? Pourquoi ce temps-là et non le "
            "passé simple ?",
            "Relève tous les connecteurs (*d'abord, ensuite, mais, alors*). "
            "Que fait chacun ?",
            "Le texte donne-t-il son avis sur la dot ? Cherche un adjectif "
            "qui juge. En trouves-tu ?",
            "Quelle est la différence entre l'étape ❹ et l'étape ❺ ? Repère "
            "le mot qui les sépare.",
            "Réécris le paragraphe ❺-❻ en supprimant l'exemple. L'explication "
            "convainc-elle encore ?"],
        regle=[
            "Le texte explicatif **fait comprendre** : il répond aux questions "
            "*qu'est-ce que c'est ? comment ça marche ? pourquoi ?*",
            "Il emploie le **présent de vérité générale**, un vocabulaire "
            "précis, et **des connecteurs logiques** : *d'abord, ensuite, "
            "c'est-à-dire, en effet, par conséquent, mais, en revanche*.",
            "Sa marche habituelle : **définition → situation → fonctionnement "
            "(fonction par fonction) → exemple → conséquence**.",
            "**Il n'argumente pas.** Expliquer la dot n'est ni la défendre ni "
            "la condamner. Le jour où tu ajoutes « c'est injuste », tu as "
            "changé de type de texte — et c'est le suivant.",
            "Un exemple **précis et vérifiable** vaut mieux que trois phrases "
            "d'explication supplémentaires."],
        exercices=[
            "**Trie.** Explicatif ou argumentatif ? (a) *La dot est versée "
            "avant le mariage.* (b) *La dot devrait être supprimée.* "
            "(c) *Dans certaines régions, elle se paie en bétail.* (d) *Ce "
            "système transforme les filles en marchandises.*",
            "**Neutralise.** Réécris ces phrases pour en retirer tout "
            "jugement : *Cette coutume scandaleuse oblige les familles à "
            "vendre leurs filles. · Heureusement, les jeunes se révoltent "
            "aujourd'hui.*",
            "**Écris seul.** Explique en quinze lignes, à quelqu'un qui ne "
            "connaît pas le Cameroun, **ce qu'est une palabre**. Définition, "
            "situation, fonctionnement, un exemple pris dans la pièce, "
            "conséquence. Aucun jugement.",
            "**Écris seul (bis).** Explique **le fonctionnement de la "
            "hiérarchie sociale** telle qu'elle apparaît à l'acte II : qui "
            "regarde qui de haut, et pourquoi. Douze lignes, cinq connecteurs "
            "au minimum."])

    b.append(saut())
    return b


# ============================================================ 6. Je joue

def partie6():
    b = [h2("6. Je joue et je révise"), p("Livre fermé, rideau baissé.")]
    corriges = []

    e, c = jeux.mots_meles("Mvoutessi et ses environs", [
        "Mvoutessi", "Libamba", "Sangmelima", "Yaounde", "Zoetele", "Ambam",
        "Ebolowa", "Juliette", "Atangana", "Abessolo", "Bella", "Makrita",
        "Ondua", "Mbarga", "Mezoe", "Matalina", "Mbia", "Tchetgen", "Kouma",
        "Engulu", "Sangatiti", "songho", "arki", "tergal", "medaille",
        "palabre", "oyenga", "mvet"], taille=17, graine=1)
    b += e
    corriges += c

    e, c = jeux.mots_croises("Les mots de la pièce", [
        ("DOT", "La somme versée à la famille de la jeune fille"),
        ("PRETENDANT", "Celui qui demande une jeune fille en mariage"),
        ("PALABRE", "Assemblée où l'on discute une affaire jusqu'à la régler"),
        ("DIDASCALIE", "L'indication scénique, jamais prononcée"),
        ("COMEDIE", "Le genre annoncé par le sous-titre"),
        ("SATIRE", "Faire rire de quelqu'un pour le critiquer"),
        ("ARKI", "Boisson de maïs fermenté, de fabrication interdite"),
        ("TERGAL", "Le tissu du costume de Mbia"),
        ("MVET", "La harpe du Sorcier, et le nom d'une épopée chantée"),
        ("OYENGA", "Le cri de joie traditionnel des femmes"),
        ("SONGHO", "Le jeu auquel jouent Ondua et Oyônô au lever du rideau"),
        ("KAOLIN", "L'argile blanche dont Sanga-Titi se badigeonne le torse"),
    ], graine=89)
    b += e
    corriges += c

    e, c = jeux.qcm("As-tu lu les cinq actes ?", [
        ("En quelle année la pièce a-t-elle été écrite, et pourquoi ?",
         ["1964, pour un concours", "1959, pour divertir des camarades de "
          "collège", "1970, pour un prix", "1968, pour la BBC"], 1),
        ("Combien Ndi a-t-il versé pour Juliette ?",
         ["cinquante mille francs", "cent mille francs",
          "deux cent mille francs", "trois cent mille francs"], 1),
        ("Que dit Mbia de son travail ?",
         ["il est ingénieur", "il dirige une école",
          "il travaille dans un très grand bureau", "il est commerçant"], 2),
        ("Selon le glossaire, que désigne le mot « blanc » dans la pièce ?",
         ["un Européen", "un personnage « évolué »", "un fonctionnaire",
          "un commerçant"], 1),
        ("Dans quel décor se passe l'acte III ?",
         ["la cour d'Atangana", "la cuisine de Makrita", "la route",
          "la maison du Sorcier"], 1),
        ("À quoi devait servir la dot de Juliette, selon Makrita ?",
         ["à payer le collège", "à doter l'épouse de son frère Oyônô",
          "à acheter un fusil", "à rembourser Ndi"], 1),
        ("Quel titre Kouma attribue-t-il à Okô ?",
         ["Docteur en médecine", "Docteur en Doctorat", "Professeur agrégé",
          "Inspecteur général"], 1),
        ("D'où vient l'argent avec lequel Okô paie la dot ?",
         ["de son père", "d'une bourse", "des dots versées par les autres "
          "prétendants", "de la vente d'un terrain"], 2),
    ])
    b += e
    corriges += c

    e, c = jeux.vrai_faux("Vrai ou faux à Mvoutessi", [
        ("L'auteur a écrit cette pièce pour dénoncer la dot.", False,
         "Il écrit dans sa préface : « mon but, en écrivant, est non de "
         "moraliser, mais de divertir »."),
        ("Juliette est consultée avant qu'on accepte la première dot.", False,
         "Atangana voulait la consulter ; son père l'en a dissuadé."),
        ("Mbia est un Européen.", False,
         "C'est un fonctionnaire camerounais de Sangmélima. Le glossaire "
         "précise que « blanc » désigne un personnage « évolué »."),
        ("L'acte III se passe dans un décor différent des autres.", True,
         "C'est le seul : la cuisine de Makrita, le seul lieu où les femmes "
         "parlent."),
        ("Okô est riche.", False,
         "Juliette le dit : « Il n'en a même pas le premier franc ! Il étudie "
         "encore au Lycée Leclerc, à Yaoundé. »"),
        ("À la fin, Juliette s'assoit dans un fauteuil à côté d'Okô.", False,
         "Mbarga fait apporter un **petit tabouret** pour elle, et le grand "
         "fauteuil pour Okô. La didascalie dit « apparemment soumise »."),
    ])
    b += e
    corriges += c

    e, c = jeux.remise_en_ordre("La pièce, acte par acte", [
        "Juliette revient de Libamba et découvre qu'on l'a promise à Ndi pour "
        "cent mille francs.",
        "Mbia, le grand fonctionnaire, arrive avec chauffeur et médailles, et "
        "verse une dot plus élevée.",
        "Dans la cuisine, Bella et Makrita rappellent à Juliette tout ce qu'on "
        "a sacrifié pour elle.",
        "La nuit, Sanga-Titi le Sorcier consulte les esprits au milieu des "
        "chants et des danses.",
        "L'argent des dots a disparu ; le village attend les commissaires de "
        "police.",
        "Kouma présente Okô comme « Docteur en Doctorat », qui verse trois "
        "cent mille francs.",
    ], graine=97)
    b += e
    corriges += c

    e, c = jeux.qui_suis_je("Devine qui parle", [
        ("Je sculpte une figurine d'ébène, je fume une longue pipe, et je "
         "conseille aux hommes de battre leurs femmes.", "Abessolo"),
        ("Je surveille un énorme réveil posé par terre et je m'indigne que ma "
         "femme soit encore au champ.", "Atangana"),
        ("Je travaille dans un très grand bureau, je suis bien connu de "
         "Monsieur le Ministre, et j'ai beaucoup de médailles.", "Mbia"),
        ("Je reviens de Libamba avec mon examen en poche, et j'apprends que "
         "j'ai déjà deux maris.", "Juliette"),
        ("Je présente les prétendants sur des feuilles de palmier et "
         "j'invente des titres qui n'existent pas.", "Kouma"),
        ("Je porte des peaux de chats sauvages, des plumes de toucan et des "
         "clochettes aux pieds, et je joue du mvet.", "Sanga-Titi"),
    ])
    b += e
    corriges += c

    b += jeux.carte_mentale(
        "Trois prétendants… un mari", "TROIS PRÉTENDANTS… UN MARI",
        [("Le genre", ["comédie en cinq actes", "écrite pour être jouée "
                       "dehors", "prix El Hadj Ahmadou Ahidjo, 1970"]),
         ("Les personnages", ["trois générations qui s'opposent",
                              "des types, non des individus",
                              "une seule qui demande la parole"]),
         ("Les lieux", ["la cour d'Atangana", "la cuisine de Makrita",
                        "le feu du Sorcier, la nuit"]),
         ("Les thèmes", ["la dot et l'argent", "la parole refusée aux femmes",
                         "l'école qui devient un placement",
                         "l'apparence qui tient lieu de mérite"]),
         ("Les procédés", ["l'ironie de situation", "la satire",
                           "l'aparté au public", "chants et danses"]),
         ("Ma question à la pièce", ["…", "…"])])

    b.append(saut())
    return b, corriges


# ======================================================== 7. Je m'évalue

ORTHO_FAUTIF = (
    "Ce matin-la, tout le village c'était réuni dans la cour d'Atangana. Les "
    "hommes avaient apporté leurs tabouret les femmes restait debout près de "
    "la cuisine. Un grand fauteuil attendait le visiteur, au milieu de la "
    "place. Ont avait balayé le sol et arrossé la poussière. Vers dix heures, "
    "une voiture s'arrêta sur la route. Le chaufeur descendit le premier et "
    "ouvrit la portiere avec des gestes lent, comme s'il présentait un roi. "
    "Les villageois retenait leur soufle. L'homme qui parut portait un costume "
    "impecable et des lunettes noires. Il salua l'assemblée sans sourire, puis "
    "s'assit. Alors seulement les conversations reprirent. Personne n'osa "
    "demander ce qu'il faisait exactement dans son bureau. On admirait ces "
    "medailles, et cela suffisait à tout le monde.")

ORTHO_CORRIGE = [
    ["1", "Ce **matin-la**", "Ce **matin-là**", "accent grave manquant",
     "0,5"],
    ["2", "leurs tabouret **_** les femmes",
     "leurs tabourets **;** les femmes", "point-virgule manquant", "0,5"],
    ["3", "la **portiere**", "la **portière**", "accent grave manquant",
     "0,5"],
    ["4", "ces **medailles**", "ces **médailles**", "accent manquant", "0,5"],
    ["5", "et **arrossé** la poussière", "et **arrosé** la poussière",
     "orthographe d'usage : un seul *s* double", "1"],
    ["6", "Le **chaufeur**", "Le **chauffeur**",
     "orthographe d'usage : deux *f*", "1"],
    ["7", "leur **soufle**", "leur **souffle**",
     "orthographe d'usage : deux *f*", "1"],
    ["8", "un costume **impecable**", "un costume **impeccable**",
     "orthographe d'usage : deux *c*", "1"],
    ["9", "leurs **tabouret**", "leurs **tabourets**",
     "accord du nom au pluriel", "2"],
    ["10", "les femmes **restait**", "les femmes **restaient**",
     "accord sujet-verbe", "2"],
    ["11", "des gestes **lent**", "des gestes **lents**",
     "accord de l'adjectif", "2"],
    ["12", "Les villageois **retenait**", "Les villageois **retenaient**",
     "accord sujet-verbe", "2"],
    ["13", "le village **c'était** réuni", "le village **s'était** réuni",
     "homophone : *s'était* = se + était", "2"],
    ["14", "**Ont** avait balayé", "**On** avait balayé",
     "homophone : *on* est le sujet", "2"],
    ["15", "On admirait **ces** medailles", "On admirait **ses** médailles",
     "homophone : *ses* est un possessif — ce sont les médailles de Mbia",
     "2"],
]


def partie7():
    b = [h2("7. Je m'évalue — trois épreuves")]
    corriges = []

    texte = source.extrait(CLE, "Le lendemain après-midi à Mvoutessi",
                           mots=330, arret=BORNES)
    b += epreuve_etude_texte(
        "Le lendemain, à Mvoutessi (ouverture de l'acte V)",
        chapeau="Ce passage n'a pas été étudié en classe : c'est ta lecture "
                "personnelle qui parle. Nous sommes au lendemain de la nuit du "
                "Sorcier. L'argent des dots a disparu, et les villageois "
                "attendent, résignés, de voir arriver la police.",
        texte=texte, source=SRC,
        comprehension=[
            ("Où et quand se passe cette scène ? Relève les deux indications "
             "de la didascalie.", "2"),
            ("Que font les personnages au lever du rideau ? Cite trois "
             "activités différentes.", "2"),
            ("Qu'attendent-ils ? Recopie la phrase qui le dit.", "2"),
            ("Relève l'expression qui décrit leur état d'esprit. Que "
             "signifie-t-elle ?", "2"),
            ("Pourquoi leur conversation est-elle « entrecoupée de grands "
             "cris d'effroi » ? Que s'est-il passé la veille ?", "2")],
        langue=[
            ("Relève quatre verbes conjugués ; donne leur infinitif et leur "
             "temps.", "2"),
            ("« Les villageois sont installés devant la maison principale "
             "d'Atangana. » Donne la nature et la fonction de chaque groupe.",
             "2"),
            ("Réécris cette même phrase à la voix **active**, puis au "
             "**passé composé**.", "2"),
            ("Relève deux compléments circonstanciels et précise ce qu'ils "
             "expriment.", "2"),
            ("Trouve dans le texte trois mots du champ lexical de la peur.",
             "2")])
    corriges += [h3("Épreuve 1 — Étude de texte : éléments de corrigé"),
                 grille([["Question", "Ce qu'on attend", "Pts"],
                         ["I.1", "À Mvoutessi, le lendemain après-midi ; il "
                          "fait très chaud.", "2"],
                         ["I.2", "Mbarga, Abessôlô et Atangana bavardent à "
                          "voix basse ; Ondua et Mezôé boivent du vin de "
                          "palme ; Abessôlô prépare des feuilles de tabac et "
                          "mâche des noix de kola.", "2"],
                         ["I.3", "« ils s'attendent à voir surgir les "
                          "commissaires de police de Zoétele et de Sangmélima "
                          "d'un moment à l'autre ».", "2"],
                         ["I.4", "« l'air résigné » : ils ont renoncé à "
                          "lutter et acceptent d'avance ce qui va leur "
                          "arriver.", "2"],
                         ["I.5", "L'argent des deux dots a disparu pendant la "
                          "nuit ; les prétendants vont le réclamer, et la "
                          "police avec eux. Toute réponse fondée sur la "
                          "lecture est acceptée.", "2"],
                         ["II.1", "Ex. : *sont installés* (installer, présent "
                          "passif) ; *bavardent* (bavarder, présent) ; *sont* "
                          "(être, présent) ; *prépare* (préparer, présent).",
                          "2"],
                         ["II.2", "*Les villageois* : groupe nominal, sujet — "
                          "*sont installés* : verbe à la voix passive — "
                          "*devant la maison principale d'Atangana* : groupe "
                          "prépositionnel, complément circonstanciel de lieu.",
                          "2"],
                         ["II.3", "Active : *On a installé les villageois "
                          "devant la maison…* — Passé composé : *Les "
                          "villageois ont été installés devant la maison…*",
                          "2"],
                         ["II.4", "Ex. : *le lendemain après-midi* (temps) ; "
                          "*à Mvoutessi* (lieu) ; *à voix basse* (manière).",
                          "2"],
                         ["II.5", "*effroi, cris, résigné* (et, selon les "
                          "éditions, *s'attendent à voir surgir*).", "2"]])]

    b += epreuve_orthographe(ORTHO_FAUTIF,
                             "Texte composé pour l'épreuve, dans la manière de "
                             "la pièce", nb_fautes=15)
    corriges += [h3("Épreuve 2 — Correction orthographique : corrigé"),
                 grille([["N°", "Écrit dans le texte", "Correction",
                          "Pourquoi", "Pts"]] + ORTHO_CORRIGE),
                 ("p", "**Total : 20 points.** Retirer **0,5 point** par mot "
                  "correct barré à tort.")]

    b += epreuve_expression([
        {"type": "Texte explicatif",
         "contexte": "Toute la pièce repose sur une coutume que les "
                     "personnages n'expliquent jamais, parce qu'ils la "
                     "connaissent tous. Le lecteur étranger, lui, a besoin "
                     "qu'on la lui expose.",
         "citation": source.extrait(
             CLE, "Si c'est moins que les cent mille francs de Ndi",
             arrivee="qu'est-ce qu'il me restera en poche ?"),
         "source": SRC,
         "taches": [
             "Produis un texte **explicatif** de vingt à vingt-cinq lignes.",
             "Explique, à quelqu'un qui n'en a jamais entendu parler, **ce "
             "qu'est la dot et comment elle fonctionne dans cette pièce**.",
             "**Obligatoire :** une définition en tête ; le présent de vérité "
             "générale ; au moins cinq connecteurs logiques ; **un exemple "
             "précis tiré de l'œuvre, avec une citation entre guillemets** ; "
             "aucun jugement personnel."],
         "bareme": [["La définition ouvre le texte et elle est exacte", "3"],
                    ["Le fonctionnement est exposé fonction par fonction",
                     "5"],
                    ["L'exemple de l'œuvre est exact et cité", "3"],
                    ["Les connecteurs organisent le texte ; aucun jugement",
                     "3"],
                    ["Orthographe et ponctuation", "4"],
                    ["Présentation et longueur", "2"]]},
        {"type": "Résumé et argumentation",
         "contexte": "Guillaume Oyônô Mbia refuse le titre de « champion de "
                     "l'émancipation de la femme africaine » et affirme "
                     "écrire pour divertir. Sa pièce fait pourtant réfléchir "
                     "des générations d'élèves.",
         "citation": source.extrait(
             CLE, "Je voudrais donc rappeler aux lecteurs",
             arrivee="mais de divertir."),
         "source": SRC,
         "taches": [
             "**Première partie (résumé) :** résume l'acte V en 100 à "
             "120 mots. Indique le nombre de mots à la fin.",
             "**Seconde partie (argumentation) :** *« Peut-on faire réfléchir "
             "les gens en les faisant rire ? »* Donne ton opinion en quinze "
             "lignes.",
             "**Obligatoire dans la seconde partie :** une opinion nuancée ; "
             "deux arguments expliqués ; un exemple de la pièce avec "
             "citation ; une objection que tu énonces toi-même ; une "
             "conclusion."],
         "bareme": [["Le résumé garde l'essentiel et ne recopie rien", "5"],
                    ["Le nombre de mots est respecté et indiqué", "2"],
                    ["L'opinion est claire et nuancée", "2"],
                    ["Deux arguments expliqués et un exemple cité", "5"],
                    ["Orthographe et ponctuation", "4"],
                    ["Présentation et longueur", "2"]]},
    ])
    b.append(saut())
    return b, corriges
