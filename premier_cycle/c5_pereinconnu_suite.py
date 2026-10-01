# -*- coding: utf-8 -*-
"""5ᵉ — *Père inconnu* : écrire, jouer, s'évaluer.

Deux ateliers, tirés de ce que le livre fait le mieux : **le portrait vu par
un enfant** (on décrit ce qu'on voit, on ne conclut pas) et **la lettre qui
demande quelque chose** — la narratrice en écrit une, « mi-véridique,
mi-mensongère », et c'est un modèle de rhétorique involontaire.
"""
import jeux
import source
from gabarit import (epreuve_etude_texte, epreuve_expression,
                     epreuve_orthographe, production)
from kit import enc, grille, h2, h3, p, saut

CLE = "pereinconnu"
SRC = "Pabé Mongo, *Père inconnu*"


# ==================================================== 5. Les productions

def partie5():
    b = [h2("5. J'écris — le portrait et la lettre"),
         p("Deux derniers ateliers. Avec les cinq précédents — description, "
           "narration, scène de théâtre, plaidoyer, protocole — tu auras "
           "parcouru **tout** ce qu'on demande d'écrire au collège. Coche au "
           "fur et à mesure :"),
         ("puce", "☐  décrire un lieu      ☐  raconter      ☐  écrire une "
          "scène de théâtre"),
         ("puce", "☐  plaider      ☐  prescrire      ☐  faire un portrait      "
          "☐  écrire une lettre")]

    b += production(
        "le portrait vu par un enfant",
        "faire un portrait en décrivant seulement ce qu'on voit, sans "
        "conclure à la place du lecteur.",
        modele=(
            "❶ L'oncle Ateba venait chez nous le dernier dimanche de chaque "
            "mois. ❷ Il portait toujours la même chemise blanche, repassée "
            "avec soin, et une montre qu'il remontait devant nous. ❸ Il "
            "s'asseyait sur le meilleur banc, celui qui ne boitait pas, et "
            "posait son chapeau sur son genou. ❹ Il demandait à ma mère "
            "comment allaient les enfants, écoutait la réponse jusqu'au bout, "
            "puis regardait sa montre. ❺ Ma mère lui gardait chaque fois deux "
            "morceaux de viande, qu'elle nous interdisait de toucher pendant "
            "la semaine. ❻ Je n'ai jamais su ce qu'il faisait de son argent, "
            "ni s'il en avait."),
        annotations=[
            ["❶ Le cadre : quand et où",
             "Un portrait d'enfant commence par **une habitude**, non par un "
             "visage."],
            ["❷ Les objets, pas les qualités",
             "La chemise, la montre remontée devant tout le monde. **On ne "
             "dit pas** qu'il est vaniteux."],
            ["❸ La place qu'il occupe",
             "« le meilleur banc, celui qui ne boitait pas ». Où quelqu'un "
             "s'assoit dit son rang."],
            ["❹ Le geste qui trahit",
             "Il écoute jusqu'au bout — puis il regarde sa montre."],
            ["❺ Ce que les autres font pour lui",
             "Deux morceaux de viande interdits toute la semaine. **Le "
             "sacrifice des autres mesure l'importance du personnage.**"],
            ["❻ L'aveu d'ignorance",
             "« Je n'ai jamais su. » C'est la signature du narrateur enfant : "
             "il voit tout, il ne conclut rien."]],
        questions=[
            "Le texte ne dit jamais si l'oncle Ateba est riche, généreux ou "
            "vaniteux. Qu'en penses-tu, toi ? Sur quels détails t'appuies-tu ?",
            "Relève tous les objets nommés. Combien y en a-t-il ? Combien "
            "d'adjectifs de caractère ?",
            "Que produit la dernière phrase ? Essaie de la remplacer par "
            "« C'était un homme mystérieux » et compare.",
            "Relève dans le livre la description du **père externe** "
            "(chapitre III) : combien d'objets ? combien de jugements ?",
            "Retrouve la phrase où la narratrice remarque une ressemblance "
            "entre Frérot et le père externe. Tire-t-elle la conclusion ? Et "
            "toi ?"],
        regle=[
            "Un portrait comporte **le physique** et **le moral** — mais un "
            "portrait vu par un enfant procède autrement : il donne des "
            "**objets**, des **habitudes**, des **gestes**, et laisse le "
            "lecteur conclure.",
            "Trois outils : les **expansions du nom** (*une chemise blanche, "
            "repassée avec soin*), les **verbes d'habitude** à l'imparfait "
            "(*il portait, il s'asseyait, il demandait*), et le **détail qui "
            "trahit**.",
            "**La règle d'or :** un détail vaut mieux qu'un adjectif. « Il "
            "remontait sa montre devant nous » remplace trois lignes "
            "d'explications.",
            "L'aveu d'ignorance (« je n'ai jamais su ») est permis, et même "
            "recommandé : il rend le narrateur crédible."],
        exercices=[
            "**Remplace.** Chaque adjectif par un objet ou un geste : *il "
            "était riche · elle était sévère · il était généreux · elle était "
            "pressée · il était triste*.",
            "**Décris une place.** En trois lignes, montre le rang de "
            "quelqu'un par **l'endroit où il s'assoit** et par ce qu'on lui "
            "réserve. Au choix : chez toi, en classe, à l'église, à une fête.",
            "**Écris seul.** Fais en quinze lignes le portrait d'un adulte de "
            "ton entourage, **vu par toi quand tu avais six ans**. Cinq "
            "étapes obligatoires ; au moins six objets ou gestes ; **aucun** "
            "adjectif de caractère ; une dernière phrase qui commence par "
            "« Je n'ai jamais su… ».",
            "**Fais tester.** Ton voisin doit te dire, sans que tu l'aies "
            "écrit, si ce personnage était aimé ou craint. S'il ne peut pas "
            "trancher, il te manque un détail qui trahit."],
        astuce=("Le piège de l'adjectif", [
            "Écrire « c'était un homme méchant » ferme la porte : le lecteur "
            "n'a plus rien à faire, et il ne te croit pas.",
            "Écrire « il gardait la clé de la case dans sa poche, même quand "
            "il partait pour la journée » ouvre la porte : le lecteur conclut "
            "**tout seul**, et il ne l'oubliera pas.",
            "Le livre entier fonctionne ainsi. Vérifie-le : cherche, dans un "
            "chapitre, combien de fois la narratrice **juge** un adulte. Tu "
            "en trouveras très peu."]))

    b += production(
        "la lettre qui demande quelque chose",
        "écrire une lettre correctement présentée, qui demande sans exiger et "
        "sans mendier.",
        modele=(
            "*Bertoua, le 14 mars*\n"
            "❶ Chère Maman,\n"
            "❷ J'espère que tu vas bien et que ta jambe ne te fait plus "
            "souffrir. Ici, tout se passe comme il faut : j'ai eu 14 en "
            "français et 12 en calcul.\n"
            "❸ Je t'écris parce que la Sœur économe m'a appelée jeudi. Il "
            "manque le tiers de la pension du deuxième trimestre, et elle m'a "
            "demandé de te prévenir avant la fin du mois.\n"
            "❹ Je sais ce que cela représente pour toi, et je ne te le "
            "demanderais pas si je pouvais faire autrement. J'ai déjà proposé "
            "à la Sœur de rester à l'externat : cela coûterait moins cher, et "
            "tante Xavérie accepte de me loger.\n"
            "❺ Réponds-moi ce que tu décides, et je m'y tiendrai.\n"
            "❻ Je t'embrasse.\n"
            "*Ta fille*"),
        annotations=[
            ["*En haut à droite*", "**Le lieu et la date.**"],
            ["❶ L'appel",
             "*Chère Maman,* — suivi d'une **virgule**, et l'on va à la "
             "ligne."],
            ["❷ Les nouvelles avant la demande",
             "On prend des nouvelles et on en donne. **On ne demande jamais "
             "dans la première phrase.**"],
            ["❸ La demande, précisément",
             "Qui a parlé, quand, combien, pour quelle date. **Une demande "
             "vague n'obtient rien.**"],
            ["❹ La preuve qu'on a réfléchi",
             "On reconnaît le sacrifice, et **on propose une solution**. "
             "C'est ce qui distingue une demande d'une réclamation."],
            ["❺ La formule qui laisse décider",
             "« Réponds-moi ce que tu décides » : on ne met pas l'autre au "
             "pied du mur."],
            ["❻ La formule de politesse et la signature",
             "Courtes, à droite, adaptées au destinataire."]],
        questions=[
            "Où se placent le lieu et la date ? Où se place la signature ?",
            "Que fait la lettre avant de demander ? Pourquoi, à ton avis ?",
            "Relève dans l'étape ❸ tous les renseignements précis. Combien y "
            "en a-t-il ?",
            "Qu'apporte l'étape ❹ ? Supprime-la et relis : la lettre te "
            "paraît-elle encore polie ?",
            "Réécris l'appel et la formule finale pour ces trois "
            "destinataires : ton oncle, ton professeur, le principal du "
            "collège.",
            "Dans le livre, la narratrice écrit à sa mère une lettre « mi-"
            "véridique, mi-mensongère ». Cherche ce qu'elle y met de vrai et "
            "ce qu'elle y arrange. Que penses-tu de ce procédé ?"],
        regle=[
            "Une lettre comporte : **le lieu et la date** (en haut à droite), "
            "**l'appel** suivi d'une virgule, **le corps** en paragraphes, "
            "**la formule de politesse**, **la signature** (à droite).",
            "Une lettre privée s'adresse à un proche : *Chère Maman*, *Cher "
            "oncle*, *Je t'embrasse*. Une lettre **officielle** s'adresse à "
            "une autorité : *Monsieur le Principal*, *Je vous prie d'agréer "
            "l'expression de mon profond respect*. **On ne mélange pas les "
            "deux registres.**",
            "L'ordre qui obtient une réponse : **nouvelles → demande précise "
            "→ solution proposée → décision laissée à l'autre**.",
            "Une demande précise indique : **qui, quoi, combien, pour "
            "quand**. Sans ces quatre renseignements, personne ne peut te "
            "répondre, même s'il le veut."],
        exercices=[
            "**Corrige la présentation.** Le professeur te donnera une lettre "
            "où la date, l'appel et la signature sont mal placés. Recopie-la "
            "correctement.",
            "**Change de registre.** Réécris le modèle ci-dessus à "
            "l'intention du **principal du collège** : appel, corps, formule "
            "de politesse.",
            "**Précise.** Rends ces demandes utilisables : *« Il me faut de "
            "l'argent. » · « Je voudrais un livre. » · « J'ai besoin d'aide "
            "pour l'école. »*",
            "**Écris seul.** Rédige une lettre de vingt lignes dans laquelle "
            "tu demandes quelque chose à un adulte de ta famille : présentation "
            "complète, nouvelles, demande précise (qui, quoi, combien, pour "
            "quand), une solution proposée, décision laissée à l'autre.",
            "**Écris seul (bis).** Écris la lettre que la narratrice **aurait "
            "pu** envoyer à son père, à Dimako, après le troisième jour. Vingt "
            "lignes. Sois juste avec elle : ni supplication, ni insulte."])

    b.append(saut())
    return b


# ============================================================ 6. Je joue

def partie6():
    b = [h2("6. Je joue et je révise"), p("Livre fermé.")]
    corriges = []

    e, c = jeux.mots_meles("Le monde de la narratrice", [
        "Bertoua", "Dimako", "SFID", "Teerenstra", "Xaverie", "Frerot",
        "ZIBI", "Kolondo", "bosquet", "ruisseau", "case", "pension",
        "internat", "ardoise", "batonnets", "CEPE", "pisé", "raphia",
        "goupillon", "kaolin", "grabat", "tribunal"], graine=149)
    b += e
    corriges += c

    e, c = jeux.mots_croises("Les mots du livre", [
        ("PISE", "Terre battue dont on fait les murs du hameau"),
        ("GRABAT", "Le lit misérable de la grand-mère"),
        ("GOUPILLON", "Le bouquet de feuilles qui sert à asperger"),
        ("KAOLIN", "L'argile blanche des piquets d'ornement"),
        ("PENSION", "Ce que la mère n'arrive plus à payer"),
        ("INTERNAT", "Où elle dort au collège, avant de le quitter"),
        ("VERDICT", "La décision du tribunal qui envoie Frérot chez son père"),
        ("ARDOISE", "Sur quoi l'on écrit, avec de la craie"),
        ("BOSQUET", "Le bois hanté qu'il faut traverser pour aller à l'école"),
        ("RECONNU", "Ce qu'est Frérot, et ce que la narratrice n'est pas"),
        ("MOLLUSQUE", "Le nom que la narratrice donne au père interne"),
        ("IULE", "Le mille-pattes de la leçon de choses"),
    ], graine=83)
    b += e
    corriges += c

    e, c = jeux.qcm("As-tu lu le livre ?", [
        ("À qui le livre est-il dédié ?",
         ["aux enseignants", "aux enfants délaissés, aux futurs papas et aux "
          "futures mamans", "à la mère de l'auteur", "aux orphelins"], 1),
        ("Comment la narratrice appelle-t-elle les deux hommes de la "
         "maison ?", ["papa et tonton", "le grand et le petit père",
                      "le père interne et le père externe",
                      "le vrai et le faux père"], 2),
        ("Que répond ZIBI quand elle attrape le bras de son père ?",
         ["« Viens avec nous ! »", "« Ce n'est pas ton père ! »",
          "« Demande à ta mère »", "« Où est ton papa ? »"], 1),
        ("Pourquoi Frérot va-t-il vivre chez le père externe ?",
         ["parce qu'il est malade", "parce qu'il a été reconnu par son père",
          "parce que la mère travaille", "parce qu'il l'a demandé"], 1),
        ("Que devient la mère après le départ de Frérot ?",
         ["elle se remarie", "elle part au village",
          "elle est embauchée à l'hôpital d'Arrondissement",
          "elle ouvre une boutique"], 2),
        ("Où travaille son père ?",
         ["à la Mairie de Bertoua", "à la SFID, à Dimako",
          "au Collège Teerenstra", "dans la boutique du centre"], 1),
        ("Qui était Teerenstra ?",
         ["un directeur d'école", "le premier évêque du diocèse de Doumé",
          "un commerçant", "le père de Xavérie"], 1),
        ("Combien de livres la narratrice lit-elle en classe de sixième ?",
         ["une dizaine", "une trentaine", "plus de cent", "aucun"], 2),
    ])
    b += e
    corriges += c

    e, c = jeux.vrai_faux("Vrai ou faux", [
        ("Le récit est écrit à la troisième personne.", False,
         "Tout le livre est à la première personne : c'est la fille elle-même "
         "qui raconte."),
        ("La narratrice comprend, dès quatre ans, pourquoi elle a deux "
         "« pères ».", False,
         "Elle observe tout et ne comprend rien : c'est au lecteur de "
         "conclure."),
        ("Elle finit par rencontrer son père.", True,
         "Au chapitre V : il vient la chercher à l'école et dit « Je suis ton "
         "père ! »"),
        ("Son père se bat pour la garder auprès de lui.", False,
         "Elle l'écrit elle-même : « ne bougeant jamais le petit doigt pour me "
         "garder »."),
        ("Xavérie est sa sœur.", False, "C'est sa tante, qui habite Bertoua."),
        ("Le titre du livre renvoie à une mention d'état civil.", True,
         "« Père inconnu » est ce qu'on inscrit quand un enfant n'a pas été "
         "reconnu par son père."),
    ])
    b += e
    corriges += c

    e, c = jeux.remise_en_ordre("La vie de la narratrice", [
        "Elle vit dans une cuisine avec sa mère, Frérot et deux « pères ».",
        "À l'école maternelle, elle s'aperçoit qu'elle est la seule "
        "accompagnée par sa mère.",
        "ZIBI la chasse du bras de son père : « Ce n'est pas ton père ! »",
        "Le tribunal envoie Frérot vivre chez le père externe qui l'a reconnu.",
        "Un homme élégant vient la chercher à l'école : « Je suis ton père ! »",
        "Il l'emmène deux heures durant, à travers la forêt, jusqu'à son "
        "village.",
    ], graine=79)
    b += e
    corriges += c

    e, c = jeux.qui_suis_je("Devine qui parle", [
        ("Je fainéantise dans la cour, une pipe entre les dents, et je "
         "réponds à la mère que la petite ne veut pas aller à l'école.",
         "le père interne"),
        ("Je tiens boutique au centre de la ville, je vends de tout, et je "
         "préfère visiblement le petit garçon.", "le père externe"),
        ("Je suis rond et dodu, je porte un cartable qui est un coffre-fort, "
         "et je me fiche pas mal de savoir qui m'accompagne à l'école.",
         "Frérot"),
        ("J'habite Bertoua, je reçois ma nièce comme une fête et je la "
         "présente à tous mes visiteurs comme un petit prodige.", "Xavérie"),
        ("Je porte un chapeau, des lunettes fumées et un costume beige sans "
         "cravate, et je dis quatre mots qui changent une vie.",
         "son père"),
    ])
    b += e
    corriges += c

    b += jeux.carte_mentale(
        "Père inconnu", "PÈRE INCONNU",
        [("Le genre", ["récit à la première personne",
                       "onze chapitres, une enfance",
                       "un livre-avertissement (voir la dédicace)"]),
         ("Les personnages", ["une fille qui raconte",
                              "une mère seule et débordée",
                              "deux « pères », et un père"]),
         ("Les lieux", ["NKA, le quartier et sa case",
                        "le bosquet hanté, l'école",
                        "Bertoua, Dimako, le collège Teerenstra"]),
         ("Les thèmes", ["l'enfant sans père", "l'humiliation à l'école",
                         "la fille et le garçon traités autrement",
                         "le malheur qui se répète d'une génération à "
                         "l'autre"]),
         ("Les procédés", ["le narrateur enfant qui voit tout et ne conclut "
                           "rien", "les mots inventés (père interne/externe)",
                           "l'objet qui remplace l'adjectif"]),
         ("Ce que j'en retiens", ["…", "…"])])

    b.append(saut())
    return b, corriges


# ======================================================== 7. Je m'évalue

ORTHO_FAUTIF = (
    "Ce matin-la, m'a mère m'acompagna jusqu'à la porte de l'école, comme tous "
    "les autres jours. Les enfants arrivait par petits groupes leurs pères "
    "marchait devant eux, un cartable à la main. Je regardais ses hommes en "
    "silence et je serrais les dents. Personne ne pouvait deviner ce que je "
    "pensait. Quand la cloche sonna, nous entrâmes imédiatement en classe. Le "
    "maître nous fit réciter la leçon de choses. Je repondis juste, comme "
    "toujours, mais mon cœur battait ailleurs. À la recreation, une fille du "
    "cours moyen me demanda pourquoi mon père ne venait jamais. Je ne répondis "
    "pas. Je m'assis contre le mur est je comptai les fourmies jusqu'à la fin "
    "de la récréation. Ce jour-là, j'ai compris qu'il fallait aprendre à se "
    "taire pour ne pas pleurer devant les autre.")

ORTHO_CORRIGE = [
    ["1", "Ce **matin-la**", "Ce **matin-là**", "accent grave manquant",
     "0,5"],
    ["2", "petits groupes **_** leurs pères",
     "petits groupes **;** leurs pères", "point-virgule manquant", "0,5"],
    ["3", "Je **repondis**", "Je **répondis**", "accent manquant", "0,5"],
    ["4", "À la **recreation**", "À la **récréation**", "accents manquants",
     "0,5"],
    ["5", "m'**acompagna**", "m'**accompagna**",
     "orthographe d'usage : deux *c*", "1"],
    ["6", "**imédiatement**", "**immédiatement**",
     "orthographe d'usage : deux *m*", "1"],
    ["7", "les **fourmies**", "les **fourmis**",
     "orthographe d'usage : pluriel de *fourmi*", "1"],
    ["8", "il fallait **aprendre**", "il fallait **apprendre**",
     "orthographe d'usage : deux *p*", "1"],
    ["9", "Les enfants **arrivait**", "Les enfants **arrivaient**",
     "accord sujet-verbe", "2"],
    ["10", "leurs pères **marchait**", "leurs pères **marchaient**",
     "accord sujet-verbe", "2"],
    ["11", "ce que je **pensait**", "ce que je **pensais**",
     "le sujet est *je* : 1ʳᵉ personne", "2"],
    ["12", "devant les **autre**", "devant les **autres**",
     "accord du nom au pluriel", "2"],
    ["13", "**m'a** mère", "**ma** mère",
     "homophone : *ma* est un déterminant possessif", "2"],
    ["14", "Je regardais **ses** hommes", "Je regardais **ces** hommes",
     "homophone : *ces* est un démonstratif", "2"],
    ["15", "contre le mur **est** je comptai",
     "contre le mur **et** je comptai",
     "homophone : *et* relie deux verbes", "2"],
]


def partie7():
    b = [h2("7. Je m'évalue — trois épreuves")]
    corriges = []

    texte = source.extrait(CLE, "Malgré la bonté des Sœurs et leur efficacité",
                           mots=330)
    b += epreuve_etude_texte(
        "Le samedi, jour des visites (chapitre X)",
        chapeau="Ce chapitre n'a pas été étudié en classe : c'est ta lecture "
                "personnelle qui parle. La narratrice est maintenant "
                "pensionnaire au Collège Teerenstra, à Bertoua — un collège de "
                "jeunes filles tenu par des Sœurs, avec des fleurs et du "
                "gazon. Sa réputation, elle, l'a précédée.",
        texte=texte, source=SRC,
        comprehension=[
            ("Pourquoi le séjour de la narratrice au collège n'est-il pas "
             "heureux ? Donne deux raisons du texte.", "2"),
            ("Comment ses camarades l'accueillent-elles ? Relève quatre "
             "manières de faire.", "2"),
            ("Pourquoi appelle-t-elle le samedi « mon jour de "
             "crucifixion » ?", "2"),
            ("Elle se compare à Florentine et à Hortense. Que montrent ces "
             "deux comparaisons ?", "2"),
            ("Quelle est sa seule consolation ? Ce qu'elle trouve chez sa "
             "tante te paraît-il suffisant ? Donne ton avis.", "2")],
        langue=[
            ("Relève quatre verbes conjugués ; donne leur infinitif et leur "
             "temps.", "2"),
            ("« Elle me donnait de l'argent de poche. » Donne la nature et la "
             "fonction de chaque mot souligné par ton professeur.", "2"),
            ("Réécris « J'étais la seule qui ne reçût pas de visite » au "
             "pluriel, puis à la forme affirmative.", "2"),
            ("Relève deux compléments circonstanciels et précise ce qu'ils "
             "expriment (temps, lieu, manière).", "2"),
            ("Trouve dans le texte trois mots du champ lexical de la "
             "moquerie.", "2")])
    corriges += [h3("Épreuve 1 — Étude de texte : éléments de corrigé"),
                 grille([["Question", "Ce qu'on attend", "Pts"],
                         ["I.1", "Sa réputation de « fille sans père » l'y a "
                          "précédée, colportée par ses aînées d'école ; et le "
                          "samedi, jour des visites, elle est la seule à ne "
                          "recevoir personne.", "2"],
                         ["I.2", "« des regards sournois, des sourires en "
                          "coin, des chuchotements derrière le dos, et toutes "
                          "sortes de méchanceté de fille ».", "2"],
                         ["I.3", "Parce que c'est le jour où les parents — "
                          "« les pères en général » — apportent des cadeaux, "
                          "et où son absence de visite devient publique. "
                          "L'image religieuse dit la souffrance offerte en "
                          "spectacle.", "2"],
                         ["I.4", "Florentine a des parents divorcés et reçoit "
                          "quand même son père ; Hortense est orpheline et "
                          "reçoit son nouveau père. Même les situations les "
                          "plus difficiles donnent droit à une visite : elle "
                          "est la seule exception sur quatre cent cinquante "
                          "élèves.", "2"],
                         ["I.5", "Les dimanches chez sa tante Xavérie, qui la "
                          "reçoit avec joie, lui donne de l'argent de poche et "
                          "la présente comme « un petit prodige "
                          "d'intelligence ». Toute réponse argumentée est "
                          "acceptée — on valorisera l'élève qui remarque que "
                          "cette consolation vient d'une tante, non d'un "
                          "parent.", "2"],
                         ["II.1", "Ex. : *fut* (être, passé simple) ; *avait "
                          "précédée* (précéder, plus-que-parfait) ; "
                          "*apportaient* (apporter, imparfait) ; *recevait* "
                          "(recevoir, imparfait).", "2"],
                         ["II.2", "*Elle* : pronom personnel, sujet — *me* : "
                          "pronom personnel, complément d'objet second — *de "
                          "l'argent de poche* : groupe nominal, complément "
                          "d'objet direct.", "2"],
                         ["II.3", "Pluriel : *Nous étions les seules qui ne "
                          "reçussent pas de visite.* — Affirmative : *J'étais "
                          "la seule qui reçût une visite.*", "2"],
                         ["II.4", "Ex. : *Le samedi en particulier* (temps) ; "
                          "*derrière le dos* (lieu) ; *avec des regards "
                          "sournois* (manière).", "2"],
                         ["II.5", "*sournois, sourires en coin, "
                          "chuchotements, méchanceté*.", "2"]])]

    b += epreuve_orthographe(ORTHO_FAUTIF,
                             "Texte composé pour l'épreuve, dans la manière du "
                             "récit", nb_fautes=15)
    corriges += [h3("Épreuve 2 — Correction orthographique : corrigé"),
                 grille([["N°", "Écrit dans le texte", "Correction",
                          "Pourquoi", "Pts"]] + ORTHO_CORRIGE),
                 ("p", "**Total : 20 points.** Retirer **0,5 point** par mot "
                  "correct barré à tort.")]

    b += epreuve_expression([
        {"type": "Narration et portrait",
         "contexte": "Dans ce livre, une enfant guette pendant des années la "
                     "présence d'un adulte qui s'occuperait d'elle. Quand "
                     "elle la trouve enfin, elle la décrit comme une "
                     "apparition — et elle n'a que trois jours.",
         "citation": "Une fille tenant la main de son père me semble "
                     "constituer l'image parfaite du bonheur.",
         "source": SRC,
         "taches": [
             "Produis un **récit à la première personne** de vingt à "
             "vingt-cinq lignes.",
             "Un enfant attend quelqu'un depuis longtemps. Ce jour-là, la "
             "personne arrive. Raconte cette journée **de son point de vue**.",
             "**Obligatoire :** le récit à la 1ʳᵉ personne, au passé ; les "
             "cinq étapes du récit ; **un portrait de six lignes fait "
             "d'objets et de gestes, sans adjectif de caractère** ; une "
             "phrase qui commence par « Je n'ai jamais su… »."],
         "bareme": [["Le récit est complet et cohérent", "5"],
                    ["Le portrait est fait de détails, non de jugements",
                     "5"],
                    ["Le point de vue de l'enfant est tenu du début à la fin",
                     "3"],
                    ["Orthographe et ponctuation", "4"],
                    ["Présentation, écriture lisible, longueur respectée",
                     "3"]]},
        {"type": "Lettre",
         "contexte": "Au collège, la narratrice écrit à sa mère une lettre "
                     "qu'elle qualifie elle-même de « mi-véridique, "
                     "mi-mensongère » pour régler la question de sa pension. "
                     "Elle obtient ce qu'elle voulait — et cela finit très "
                     "mal.",
         "citation": "Ma mère garda un silence de complaisance.",
         "source": SRC,
         "taches": [
             "Rédige une **lettre** de vingt à vingt-cinq lignes.",
             "Tu écris à un adulte de ta famille pour lui demander de t'aider "
             "dans tes études. **Tout doit être vrai** : c'est la différence "
             "avec la lettre du livre.",
             "**Obligatoire :** lieu et date en haut à droite ; appel suivi "
             "d'une virgule ; des nouvelles avant la demande ; une demande "
             "précise (qui, quoi, combien, pour quand) ; une solution que tu "
             "proposes toi-même ; une formule de politesse et une signature."],
         "bareme": [["La présentation de la lettre est complète et correcte",
                     "5"],
                    ["La demande est précise et utilisable", "4"],
                    ["Une solution est proposée ; le ton est juste", "4"],
                    ["Orthographe et ponctuation", "4"],
                    ["Présentation et longueur", "3"]]},
    ])
    b.append(saut())
    return b, corriges
