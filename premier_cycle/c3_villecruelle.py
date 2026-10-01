# -*- coding: utf-8 -*-
"""3ᵉ — *Ville cruelle*, Eza Boto (Présence Africaine).

Treize chapitres et un épilogue. Banda, un jeune paysan de Bamila, descend à
Tanga vendre deux cents kilos de cacao pour payer la dot de la fille qu'il
veut épouser. Le service du Contrôle brûle sa récolte. En une nuit, tout
bascule.

Le roman est signé **Eza Boto** — c'est le premier nom de plume d'un écrivain
qui se fera connaître ensuite sous celui de **Mongo Beti**. Le texte se
présente lui-même comme une **chronique** : « des événements que relate cette
chronique ».
"""
import jeux
import source
from gabarit import (cote_enseignant, epreuve_etude_texte, epreuve_expression,
                     epreuve_orthographe, lecture_suivie, ouvrir, production)
from kit import cases, enc, grille, h1, h2, h3, lignes, num, p, puce, saut

CLE = "villecruelle"
SRC = "Eza Boto, *Ville cruelle*, Présence Africaine"
BORNES = ["CHAPITRE PREMIER", "CHAPITRE II", "CHAPITRE III", "CHAPITRE IV",
          "CHAPITRE V", "CHAPITRE VI", "CHAPITRE VII", "CHAPITRE VIII",
          "CHAPITRE IX", "CHAPITRE X", "CHAPITRE XI", "CHAPITRE XII",
          "CHAPITRE XIII", "EPILOGUE"]


def _x(amorce, mots=700):
    voisins = [t for t in BORNES if source.plat(t) not in source.plat(amorce)]
    return source.extrait(CLE, amorce, mots=mots, arret=voisins)


# ============================================================ 1. J'ouvre

def partie1():
    return [h1("Œuvre 1 — Ville cruelle, d'Eza Boto")] + ouvrir(
        "Ville cruelle", "Eza Boto",
        questions_couverture=[
            "**Ville cruelle.** Deux mots, dont un adjectif très fort. "
            "Peut-on dire d'une ville qu'elle est cruelle ? Une ville "
            "a-t-elle une volonté ?",
            "À ton avis, qu'est-ce qui, dans une ville, peut faire souffrir "
            "quelqu'un qui vient du village ? Note trois choses.",
            "L'auteur signe **Eza Boto** — c'est un pseudonyme. Pourquoi un "
            "écrivain change-t-il de nom, d'après toi ?",
            "Le livre paraît chez **Présence Africaine**, à Paris. Cherche ce "
            "qu'est cette maison d'édition et à quelle époque elle a été "
            "fondée."],
        promesses=[
            "Le héros va-t-il réussir en ville ?",
            "Qui sera l'ennemi dans ce roman : un homme, ou quelque chose de "
            "plus gros ?",
            "Le roman finira-t-il bien ?",
            "Peut-on changer une société en écrivant un livre ?"],
        journal_exemple=["03/10", "Chapitres I et II",
                         "Banda va vendre son cacao à Tanga ; la ville est "
                         "coupée en deux par une colline",
                         "Pourquoi les deux Tanga se tournent-ils le dos ?"])


# ================================================= 2. L'auteur et son livre

def partie2():
    return [
        h2("2. L'auteur et son livre"),
        h3("Eza Boto, ou Mongo Beti"),
        p("**Eza Boto** est le premier nom de plume d'un écrivain camerounais "
          "qui deviendra célèbre sous un autre : **Mongo Beti**. *Ville "
          "cruelle* est son premier roman ; il paraît aux éditions "
          "**Présence Africaine**, à Paris."),
        enc("perso", "Deux noms pour un seul homme", [
            "Un **pseudonyme** est un nom d'emprunt qu'un auteur se choisit. "
            "Les raisons sont nombreuses : la prudence, la distance, "
            "l'envie de recommencer autrement.",
            "Cet écrivain-là en a pris deux successivement. Le second, Mongo "
            "Beti, a écrit *Le pauvre Christ de Bomba*, *Le roi miraculé*, "
            "*Perpétue et l'habitude du malheur*, *Les Maquisards*…",
            "**Ce qu'il faut en retenir pour la lecture :** *Ville cruelle* "
            "est un **premier livre**. On y sent l'énergie, la colère, et "
            "parfois une ironie très verte qui ne se retient pas."]),
        h3("Un roman qui se dit « chronique »"),
        p("Dès le deuxième chapitre, le narrateur emploie un mot précis : "
          "*« des événements que relate cette chronique »*. Une **chronique**, "
          "c'est un récit de faits **rapportés dans l'ordre du temps**, comme "
          "on tiendrait le registre d'une ville."),
        enc("mot", "Ce que change ce mot", [
            "Un **roman** invente. Une **chronique** prétend rapporter.",
            "En se disant chronique, le livre te souffle : *ceci a eu lieu, "
            "ou aurait pu avoir lieu ; je ne fais que tenir le compte*.",
            "Et le narrateur ouvre le chapitre II par une question de "
            "chroniqueur : *« Qu'est-il advenu de la ville de Tanga depuis "
            "l'époque des événements que relate cette chronique ? »* Il parle "
            "**après**, et il espère que les choses ont changé."]),
        h3("Ce qu'il y a dedans"),
        grille([["Où", "Ce que c'est"],
                ["**Tanga**", "La ville, coupée en deux par une colline. "
                 "C'est le personnage principal du livre, et il a un nom dans "
                 "le titre."],
                ["**Tanga-Sud**", "« Tanga des autres, Tanga étranger » : le "
                 "versant commercial et administratif, le fleuve, le quai à "
                 "billes, le centre grec, les bâtiments blancs."],
                ["**Tanga-Nord**", "« Le Tanga sans spécialité », « le Tanga "
                 "des cases » : le versant que les bâtiments administratifs "
                 "regardent de dos."],
                ["**Bamila**", "Le village de Banda, dans la forêt. Sa mère y "
                 "meurt."],
                ["**Fort-Nègre**", "La grande ville où Banda décide de partir, "
                 "à la dernière page."]]),
        grille([["Personnage", "Qui c'est"],
                ["**Banda**", "un jeune paysan de Bamila. Il descend vendre "
                 "deux cents kilos de cacao."],
                ["**Sa mère**", "malade, mourante. C'est pour elle qu'il veut "
                 "se marier vite."],
                ["**Koumé**", "un jeune mécanicien de Tanga, recherché par la "
                 "police : il était « le meneur »."],
                ["**Odilia**", "sa sœur."],
                ["**Tonga**", "l'oncle de Banda, à Bamila."],
                ["**M. Pallogakis** et les autres", "les commerçants grecs du "
                 "centre commercial de Tanga."],
                ["**Les agents du Contrôle**", "deux hommes qui décident si le "
                 "cacao d'un paysan peut être vendu — ou brûlé."]]),
        enc("astuce", "Comment lire ce roman", [
            "**Le chapitre II n'a pas d'action.** C'est une description de "
            "ville, longue, et beaucoup d'élèves la sautent. Ne la saute "
            "pas : c'est le plus beau morceau du livre, et tout ce qui suit "
            "s'y explique.",
            "Le reste se lit vite : les chapitres sont courts et l'action se "
            "déroule en **deux jours**.",
            "Tiens ton journal de lecture chapitre par chapitre. Le roman "
            "avance par bonds, et l'on s'y perd si l'on ne note rien."]),
        saut()]


# =========================================================== 3. Qui est qui

def partie3():
    b = [h2("3. Une ville coupée en deux"),
         p("Ce roman a un personnage que les autres n'ont pas : **une ville**. "
           "Apprends sa géographie, et tu auras compris le livre."),
         grille([["", "**Tanga-Sud**", "**Tanga-Nord**"],
                 ["Comment le livre l'appelle",
                  "« Tanga des autres, Tanga étranger », « Tanga commerçant "
                  "et administratif »",
                  "« le Tanga sans spécialité », « le Tanga des cases », "
                  "« le Tanga indigène »"],
                 ["Le versant", "au **sud**, « étroit et abrupt »",
                  "au **nord**, « peu incliné, étendu en éventail »"],
                 ["Ce qu'on y trouve",
                  "le fleuve et son pont de ciment armé, le quai à billes, "
                  "les grues, les scieries, le marché, le centre grec, les "
                  "bâtiments administratifs",
                  "« une série de bas-fonds », des cases « plus basses, plus "
                  "chiches, plus ratatinées »"],
                 ["Le jour", "il se remplit de tout le monde",
                  "il se vide de « sa substance humaine »"],
                 ["Ce que le livre en conclut", "**« Deux Tanga… deux "
                  "mondes… deux destins ! »**", ""]]),
         enc("lieu", "Le fleuve, « une espèce de cirque permanent »", [
             "Le narrateur le dit ainsi : on s'accoude au parapet du pont, et "
             "l'on attend. Passent les **cases-pirogues** — de longues cases "
             "montées sur deux ou trois pirogues jumelées, poussées à la "
             "perche, qui ont parcouru « des centaines de kilomètres ».",
             "Passent aussi les **radeaux de billes de bois**, montés par des "
             "hommes « superbement indifférents aux huées qui descendaient du "
             "pont ».",
             "Puis vient l'**autogrue** : « un vrai monstre ». Le narrateur "
             "ajoute cette phrase magnifique : *« Pour un objet qui se déplace "
             "tout seul, il était difficile de rien imaginer de plus laid. »*"]),
         enc("culture", "Le centre commercial, « on aurait tout aussi bien "
             "fait de l'appeler le centre grec »", [
             "Le livre donne les enseignes : **Caramvalis, Despotakis, "
             "Pallogakis, Mavromatis, Michalidès, Staveridès, Nikitopoulos** "
             "— « et l'auteur en passe ».",
             "Il décrit ensuite le mécanisme de la fraude au cacao, et il "
             "faut le lire deux fois pour l'admirer : M. Pallogakis commence "
             "la journée « par un cours supérieur au prix officiel » ; le "
             "bruit se répand « comme un feu de brousse » ; les paysans "
             "accourent ; et **plus il y en a, plus il est facile de baisser "
             "le taux progressivement et insensiblement**.",
             "**Trois lignes pour expliquer une escroquerie de masse.** "
             "Retiens le procédé : décrire calmement un mécanisme est la plus "
             "efficace des accusations."]),
         enc("mot", "Le vocabulaire du bois et du cacao", [
             "**Une bille (de bois)** : un tronc abattu et découpé, prêt pour "
             "la scierie.",
             "**Équarrir** : tailler un tronc pour lui donner des faces "
             "planes.",
             "**Le flottage** : le transport des billes par voie d'eau.",
             "**Une fève de cacao** : la graine, qu'on fait sécher avant de "
             "la vendre. Le contrôleur la presse et la coupe pour vérifier "
             "qu'elle est sèche et sans moisissure.",
             "**Une hotte** : le grand panier qu'on porte sur le dos, avec "
             "des bretelles."])]

    e, c = jeux.relier(
        "Chacun sa place dans la ville",
        [("Banda", "Il descend de Bamila avec deux cents kilos de cacao"),
         ("Koumé", "Mécanicien, meneur, recherché par la police"),
         ("Odilia", "Sa sœur, qui l'avertit qu'il n'a jamais été prudent"),
         ("M. Pallogakis", "Il ouvre la journée au-dessus du prix officiel, "
                           "puis baisse"),
         ("Les agents du Contrôle", "Ils décident si un cacao se vend ou se "
                                    "brûle"),
         ("L'autogrue", "« Un vrai monstre » : l'objet le plus laid du livre")],
        graine=239)
    b += e
    b.append(saut())
    return b, c


# ======================================================= 4. Lectures suivies

def partie4():
    b = [h2("4. Je lis l'œuvre — six lectures suivies"),
         p("Six séances, des chapitres II à V — c'est-à-dire la ville, "
           "l'attente, et la catastrophe. La suite du roman, tu la liras "
           "seul : c'est là que tout s'accélère.")]

    b += lecture_suivie(
        1, "Deux Tanga, deux destins (chapitre II)",
        situation=[
            "Le narrateur interrompt son récit pour décrire la ville. Il "
            "commence par une question de chroniqueur — qu'est devenue Tanga "
            "depuis ? — puis il installe le décor.",
            "Imagine, dit-il, « une immense clairière dans la forêt de chez "
            "nous », et au milieu, « une haute colline ». C'est cette colline "
            "qui coupe la ville en deux."],
        texte=_x("À cette époque-là, Tanga ressemblait certes"), source=SRC,
        questions=[
            "Relève, dans le premier paragraphe, ce que Tanga a de commun "
            "avec les autres villes du pays. Puis relève ce qui l'en "
            "distingue.",
            "Décris la géographie : où est le Tanga commerçant ? où est le "
            "Tanga des cases ? Fais un croquis dans la marge.",
            "Relève tout ce qui passe sur le fleuve. Comment le narrateur "
            "appelle-t-il ce spectacle ?",
            "Recopie la phrase sur l'autogrue. Quelle est la figure de style ? "
            "Que reproche exactement le narrateur à cette machine ?",
            "Que devient la bille de bois, du radeau jusqu'au train ? Fais la "
            "chaîne complète — il y a au moins cinq étapes.",
            "« Deux Tanga… deux mondes… deux destins ! » Compte les mots. "
            "Pourquoi les points de suspension ? Pourquoi le point "
            "d'exclamation ?",
            "Relève les adjectifs qui décrivent les cases du Tanga nord. Que "
            "produisent-ils, mis les uns à la suite des autres ?"],
        grille_lecture=[
            ("Que la ville est coupée en deux",
             "Les deux séries d'adjectifs et de noms, opposées terme à terme"),
            ("Que tout y sert au bois et au cacao",
             "Le champ lexical de l'exploitation forestière"),
            ("Que le narrateur juge sans crier",
             "Les remarques glissées entre deux descriptions"),
            ("Que la description est un mouvement",
             "L'ordre suivi : le fleuve → le quai → le marché → le centre "
             "grec → les bâtiments → l'autre versant")],
        bilan=[
            "Un chapitre entier sans action, et c'est le cœur du livre.",
            "Regarde comment il est bâti : **de bas en haut, puis de l'autre "
            "côté**. Le fleuve, le quai à billes, le marché, le centre "
            "commercial, les bâtiments administratifs au sommet — puis le "
            "versant nord, les cases. Le lecteur monte la colline avec le "
            "narrateur, et redescend de l'autre côté dans un autre monde.",
            "Et note le détail qui dit tout : les bâtiments administratifs "
            "**tournent le dos** au Tanga indigène. Le narrateur ajoute, "
            "faussement innocent : *« par une erreur d'appréciation "
            "probablement »*. C'est de l'**ironie** — et c'est l'arme "
            "principale de ce livre.",
            "La formule finale, elle, est un vers : *« Deux Tanga… deux "
            "mondes… deux destins ! »* Trois groupes, trois fois le même "
            "chiffre, une gradation. **Une description vient de devenir un "
            "réquisitoire**, et pas un mot n'a été élevé."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Une clairière** : un espace sans arbres au milieu d'une "
                "forêt.",
                "**Abrupt** : très pentu.",
                "**Un parapet** : le muret qui borde un pont.",
                "**La poupe** et **la proue** : l'arrière et l'avant d'un "
                "bateau.",
                "**Dégingandé** : trop long et mal bâti.",
                "**Chiche** : pauvre, insuffisant."]),
            ("rire", "Le portrait de l'autogrue", [
                "Lis-le à voix haute : elle « chuinte », elle « branle », elle "
                "« s'avance vers le fleuve », elle « se penche dangereusement "
                "sur l'eau », elle « se redresse tenant triomphalement une "
                "longue bille accrochée à ses deux dents ». Puis « elle se "
                "retourne et s'en va ».",
                "Le narrateur en fait une **bête** — et une bête laide : « À "
                "côté de cette machine, l'éléphant même aurait fait figure de "
                "parure. »",
                "**C'est de la personnification**, et elle est méchante. La "
                "machine du progrès a des dents."])])

    b += lecture_suivie(
        2, "Comment on trompe un paysan (chapitre II, suite)",
        situation=[
            "Nous montons du quai vers le haut de la colline. Voici le "
            "« Centre commercial » — que le narrateur propose aussitôt "
            "d'appeler autrement.",
            "Puis vient la saison du cacao, de décembre à février. Et avec "
            "elle, un mécanisme."],
        texte=_x("En remontant plus haut, on pénétrait dans le Tanga "
                 "proprement commercial"), source=SRC,
        questions=[
            "Comment le narrateur propose-t-il de rebaptiser le centre "
            "commercial ? Relève les enseignes qu'il cite.",
            "Décris une boutique : la construction, la véranda, ce qu'on y "
            "vend, qui se tient derrière le comptoir.",
            "Relève les deux phrases que les clercs répètent aux clients. "
            "Que remarques-tu, si tu les compares aux boutiques voisines ?",
            "Quand voit-on le patron grec ? Pourquoi à ce moment-là ?",
            "Décris M. Pallogakis : sa tenue, son teint, son nez, son "
            "attitude. Combien d'adjectifs le narrateur emploie-t-il ?",
            "Explique le mécanisme de la fraude, étape par étape. Combien "
            "d'étapes comptes-tu ?",
            "Relève ce que crient les rabatteurs. Que font-ils si le paysan "
            "a « l'air dédaigneux » ?"],
        grille_lecture=[
            ("Que le commerce est aux mains d'un seul groupe",
             "La liste des enseignes"),
            ("Que la publicité ment",
             "Les promesses identiques faites dans toutes les boutiques"),
            ("Que la fraude est un mécanisme, non un accident",
             "Les étapes du cours qui monte puis baisse"),
            ("Que le narrateur se moque",
             "Les adjectifs qui décrivent Pallogakis")],
        bilan=[
            "Une page d'économie déguisée en portrait.",
            "Le mécanisme est simple et implacable : on ouvre **au-dessus** du "
            "prix officiel, la nouvelle court « comme un feu de brousse », les "
            "paysans arrivent en masse — et **plus la foule grossit, plus il "
            "devient facile de baisser** « progressivement et "
            "insensiblement ». Ils sont venus de loin ; ils ne repartiront "
            "pas avec leur charge.",
            "Le narrateur ajoute, l'air de rien : « et de commettre d'autres "
            "fraudes ». Il ne les détaille pas. **Il te laisse imaginer**, ce "
            "qui est pire.",
            "Regarde enfin le portrait de M. Pallogakis : « gommeux, "
            "olivâtre, frais, fort sobrement habillé de blanc, sec, le nez "
            "crochu et paternaliste ». Sept adjectifs, dont le dernier — "
            "**paternaliste** — n'est pas physique du tout. Il a été glissé "
            "au milieu des autres, et c'est lui qui accuse."],
            encadres=[
            ("mot", "Les mots difficiles", [
                "**Un clerc** : un employé de bureau ou de commerce.",
                "**Un rabatteur** : celui qui attire les clients vers un "
                "vendeur.",
                "**Une balance romaine** : une balance à contrepoids "
                "coulissant, facile à truquer.",
                "**Paternaliste** : qui traite les autres comme des enfants "
                "en prétendant les protéger.",
                "**Levantin** : originaire du Levant, c'est-à-dire de la "
                "Méditerranée orientale."]),
            ("perso", "Trois mots pour comprendre une exploitation", [
                "**Le monopole** : quand un petit groupe est seul à acheter, "
                "il fixe le prix qu'il veut.",
                "**L'asymétrie d'information** : le paysan ne sait pas le "
                "cours réel ; l'acheteur, si.",
                "**Le coût de retour** : celui qui a marché deux jours avec "
                "un sac sur la tête n'a pas les moyens de refuser une mauvaise "
                "offre.",
                "Ces trois notions ne sont pas dans le roman — mais le roman "
                "les montre, toutes les trois, en une page."])])

    b += lecture_suivie(
        3, "Un frère, une sœur, et une inquiétude (chapitre III)",
        situation=[
            "Changement complet de décor : nous entrons chez des gens. Un "
            "jeune homme enfile sa combinaison de mécanicien ; sa sœur, "
            "appuyée au mur, l'observe du coin de l'œil.",
            "Il s'appelle **Koumé**. Elle s'appelle **Odilia**. Elle sait "
            "qu'il lui cache quelque chose."],
        texte=_x("Ayant enfilé sa combinaison de mécanicien autrefois kaki"),
        source=SRC,
        questions=[
            "Décris la combinaison de Koumé. Que nous apprend-elle sur son "
            "métier et sur sa condition ?",
            "Que fait-il à la fenêtre ? Comment interpelle-t-il les femmes "
            "qui passent ? Relève l'exemple donné par le texte.",
            "Relève la phrase qui décrit le moment où il cesse de plaisanter. "
            "Combien de temps cela dure-t-il, et pourquoi s'arrête-t-il ?",
            "Décrivez la pièce et la maison à partir des indices du texte : "
            "que sait-on d'eux ?",
            "Que reproche Odilia à son frère ? Recopie sa mise en garde.",
            "Que lui répond Koumé au sujet de l'argent et de la nourriture ? "
            "Que révèle cette réplique de leur situation ?",
            "Relève tous les signes qui montrent qu'Odilia se doute de quelque "
            "chose **avant** de le savoir."],
        grille_lecture=[
            ("Que Koumé joue la désinvolture",
             "Ses plaisanteries, ses sifflements, sa façon d'interpeller"),
            ("Qu'il est inquiet malgré tout",
             "Les moments où son regard « se perd dans le lointain »"),
            ("Qu'Odilia surveille",
             "Les verbes de perception qui lui sont appliqués"),
            ("Que la pauvreté est là sans être nommée",
             "La petite ouverture qui tient lieu de fenêtre, la petite table, "
             "la question de l'argent")],
        bilan=[
            "Le roman quitte la grande description pour entrer dans **une "
            "pièce commune**, et le changement d'échelle est brutal : on "
            "passe des grues et des scieries à un homme qui sifflote à une "
            "fenêtre.",
            "Regarde comment Eza Boto fait exister Koumé : il ne le décrit "
            "presque pas. Il montre ce qu'il **fait** — enfiler une "
            "combinaison huileuse, tourner le dos à sa sœur, interpeller « "
            "Popeline bleue » dans la rue, se taire une seconde de trop, se "
            "reprendre « sachant que sa sœur l'épiait ».",
            "**Toute l'inquiétude du personnage tient dans ce “bref "
            "instant”.** Un homme qui plaisante trop est un homme qui a peur, "
            "et sa sœur le sait avant nous.",
            "Retiens la technique pour tes propres récits : **on ne dit pas "
            "qu'un personnage est inquiet ; on le montre en train de le "
            "cacher.**"],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Nonchalamment** : avec une lenteur indifférente.",
                "**Grivois** : d'une gaieté un peu leste, osée.",
                "**Épier** : surveiller en cachette.",
                "**Réticent** : qui hésite à parler, qui retient quelque "
                "chose.",
                "**Se dérober** : éviter de répondre, se soustraire."]),
            ("perso", "« Popeline bleue »", [
                "Koumé appelle les passantes **par la couleur de l'étoffe de "
                "leur robe**. La popeline est un tissu de coton, courant et "
                "peu cher.",
                "Le jeu est réglé : il lance une plaisanterie, la femme "
                "« dit une réplique de convention », et tous deux éclatent de "
                "rire.",
                "**Une réplique de convention** : c'est-à-dire une réponse "
                "connue d'avance, comme dans un jeu. Eza Boto note cela en "
                "passant — et il vient de décrire toute une rue en une "
                "expression."])])

    b += lecture_suivie(
        4, "La file d'attente (chapitre IV)",
        situation=[
            "Retour au marché. Banda fait la queue devant les agents du "
            "Contrôle, à qui il doit soumettre ses **deux cents kilos de "
            "cacao** avant d'avoir le droit de les proposer aux Grecs.",
            "Il n'a pas encore compris ce qui l'attend. Nous non plus."],
        texte=_x("Ce même matin-là, Banda faisait la queue"), source=SRC,
        questions=[
            "Décris les deux agents du Contrôle. Que dit le narrateur de leur "
            "mine ? Et de la façon dont ils se comportent ?",
            "Recopie le discours qu'ils prononcent chaque fois qu'ils "
            "renvoient quelqu'un. Combien de fois le répètent-ils ?",
            "Combien d'hommes accompagnent les contrôleurs ? De quels corps "
            "sont-ils ?",
            "Décris la position des hommes et celle des femmes dans la file. "
            "Relève les détails du corps.",
            "Que font les jeunes gens qui arrivent en retard ? Comment "
            "finissent-ils par l'emporter ?",
            "Que deviennent les gardes régionaux ? Recopie l'expression du "
            "narrateur.",
            "Relève la pensée de Banda sur le samedi. Que révèle-t-elle de "
            "lui ?"],
        grille_lecture=[
            ("Que les contrôleurs abusent d'un petit pouvoir",
             "Le discours répété et les motifs d'exclusion"),
            ("Que la file est un corps qui souffre",
             "Les détails physiques : cou, épaules, dos, bretelles"),
            ("Que la force finit par l'emporter",
             "L'évolution des bousculades, jusqu'aux gardes « spectateurs "
             "impuissants »"),
            ("Que Banda se plie à tout",
             "Les phrases sur sa complaisance et sa patience")],
        bilan=[
            "Une file d'attente, et c'est une leçon de politique.",
            "Regarde les contrôleurs : ils commencent par « se faire attendre "
            "une grande partie de la matinée », puis ils passent les rangs en "
            "revue, puis ils renvoient au bout de la file quiconque est « un "
            "peu de côté ». Et ils prononcent chaque fois **le même discours "
            "sur le désordre et les têtes d'hommes de la brousse**.",
            "**Un pouvoir minuscule exercé à fond** : voilà ce que le roman "
            "décrit, et c'est peut-être ce qu'il y a de plus universel dans "
            "ce livre.",
            "Puis vient le détail qui serre le cœur : les femmes portent des "
            "hottes, « elles marchaient penchées vers l'avant », et *« on "
            "pouvait voir les bretelles des hottes leur entrer dans les "
            "épaules »*. Une seule phrase, et l'on ne l'oublie plus.",
            "Enfin, Banda. Il pense : *« Je n'aurais pas dû venir un "
            "samedi »*, parce que dans son esprit le samedi est lié à la joie. "
            "**Le narrateur note cela sans rire.** Ce garçon a apporté sa "
            "bonne humeur dans un endroit qui n'en veut pas."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Un remous** : un mouvement de foule, comme une vague.",
                "**Opiniâtre** : obstiné, qui ne renonce pas.",
                "**Un dérivatif** : ce qui détourne l'attention d'un ennui.",
                "**La complaisance** : ici, la docilité de celui qui accepte "
                "tout.",
                "**Sévir** : punir avec rigueur."]),
            ("rire", "« M. le Contrôleur »", [
                "Le narrateur écrit : l'appareil de bois « venait à hauteur de "
                "l'abdomen de M. le Contrôleur, **comme il aimait à se faire "
                "appeler** ».",
                "Six mots ajoutés entre virgules, et le personnage est "
                "achevé.",
                "**C'est l'ironie**, et c'est le procédé le plus constant "
                "d'Eza Boto : il rapporte poliment le titre que quelqu'un "
                "s'est donné, et il laisse le lecteur sourire."])])

    b += lecture_suivie(
        5, "Trois solutions officielles, et une quatrième (chapitre IV)",
        situation=[
            "Banda regarde travailler le contrôleur de l'autre trottoir. Il "
            "observe l'appareil de bois, les gestes, les procédés de "
            "vérification.",
            "Puis le narrateur énumère ce qui peut arriver à un sac de cacao. "
            "Compte bien : il y a trois solutions **officielles**.",
            "La fin du passage revient dans la file d'attente : Sabina et "
            "Régina, qui portent le cacao avec lui, ont un avis — et elles "
            "ne le gardent pas pour elles."],
        texte=source.extrait(
            CLE, "Le cacao était transvasé du sac", mots=800,
            coupes=[("Tout avait commencé par une équipe de parasites",
                     "à tout contrôler.")],
            arret=BORNES),
        source=SRC + ", chapitre IV",
        questions=[
            "Décris l'appareil de bois : sa forme, sa fabrication, ses "
            "supports, sa fermeture.",
            "Par quels procédés le contrôleur vérifie-t-il les fèves ? "
            "Relève-en deux.",
            "Recopie les trois solutions officielles. Puis recopie la phrase "
            "qui annonce la quatrième. Quelle est cette quatrième solution, à "
            "ton avis ?",
            "« Banda aurait bien fait de la connaître. » Que prépare cette "
            "phrase ? Comment appelle-t-on ce procédé de récit ?",
            "À qui appartenait l'affaire du cacao avant que l'Administration "
            "ne s'en mêle ? Relève la phrase qui le dit.",
            "Sabina répète presque mot pour mot la même phrase à trois "
            "reprises. Recopie-la. Que reproche-t-elle exactement à Banda ?",
            "« Tu aurais dû t'entendre avec lui... » De quoi Sabina "
            "parle-t-elle ? Fais le lien avec la quatrième solution — et "
            "explique pourquoi elle ne prononce jamais le mot."],
        grille_lecture=[
            ("Que l'appareil est grossier",
             "Les adjectifs qui décrivent le meuble de bois"),
            ("Que le sort d'une récolte tient à un geste",
             "Les procédés de vérification et leurs conséquences"),
            ("Que le narrateur annonce le malheur",
             "La phrase sur la quatrième solution"),
            ("Que la quatrième solution se dit à mots couverts",
             "Les points de suspension et les tournures allusives du "
             "dialogue")],
        bilan=[
            "Le passage le plus important du roman, et il est écrit comme une "
            "notice administrative.",
            "**Les trois solutions officielles** : vendre, sécher au soleil "
            "sous surveillance, ou brûler. Puis cette ligne, glissée sans "
            "commentaire : *« En fait, une quatrième solution, "
            "transactionnelle celle-là, avait cours : Banda aurait bien fait "
            "de la connaître. »*",
            "**Transactionnelle** : c'est-à-dire qu'on s'arrange. C'est-à-"
            "dire qu'on paie. Le mot est technique, poli, et il désigne un "
            "pot-de-vin.",
            "Et la dernière phrase — « Banda aurait bien fait de la "
            "connaître » — est ce qu'on appelle une **prolepse** : le "
            "narrateur annonce le malheur avant qu'il n'arrive. À partir de "
            "cette ligne, le lecteur sait, et le personnage non.",
            "Retiens enfin la fin du passage, où le roman fait dire la "
            "quatrième solution par quelqu'un d'autre. Sabina répète trois "
            "fois : *« on ne risque pas deux cents kilos de cacao comme "
            "ça »*, et lâche la phrase décisive — *« Tu aurais dû "
            "t'entendre avec lui... »*",
            "**S'entendre avec lui.** Voilà le mot du pot-de-vin, dans la "
            "bouche d'une femme qui porte une hotte. Elle ne dit pas "
            "*payer*, elle ne dit pas *corrompre* : elle laisse les points "
            "de suspension finir la phrase. Tout le monde sait, personne ne "
            "nomme — **et c'est exactement ce que le narrateur avait fait "
            "quatre paragraphes plus haut avec le mot *transactionnelle*.**",
            "Note enfin la réponse de Banda : *« J'ai fait tout ce qu'ils "
            "ont recommandé. J'ai suivi leurs instructions. »* Il a obéi au "
            "règlement écrit. C'est précisément ce qui le perd."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Transvaser** : verser d'un récipient dans un autre.",
                "**Fourrager** : fouiller.",
                "**Une palette** : ici, la planche qui ferme le fond de "
                "l'appareil.",
                "**Expéditif** : très rapide, sans s'embarrasser de formes.",
                "**Maugréer** : protester entre ses dents.",
                "**Une transaction** : un arrangement — le mot du roman pour "
                "dire ce qu'il ne dit pas."]),
            ("perso", "Ce que le narrateur ne dit jamais", [
                "Relis tout le passage : il n'y a **aucun mot** comme "
                "*corruption*, *injustice*, *vol*, *scandale*.",
                "Il y a : une notice, trois solutions numérotées, une "
                "quatrième « transactionnelle », un adjectif — *expéditif* — "
                "et une phrase de Sabina qui s'arrête sur des points de "
                "suspension.",
                "**C'est ainsi qu'on accuse en littérature.** Le mot qui "
                "manque fait plus de bruit que celui qu'on aurait écrit."])])

    b += lecture_suivie(
        6, "Deux cents kilos (chapitre V)",
        situation=[
            "Le cacao de Banda a été saisi, puis mis au feu. Il l'a vu.",
            "Ce passage est une conversation : quelqu'un l'interroge, "
            "reprend les chiffres, refuse de croire ce qu'il entend — et lui "
            "explique comment il aurait fallu s'y prendre."],
        texte=_x("Et vous portiez à vous six deux cents kilos de cacao"),
        source=SRC,
        questions=[
            "Combien de personnes ont porté le cacao ? Combien de kilos ? "
            "Refais le calcul par personne.",
            "Que répond Banda quand on lui dit que son cacao a été mis au "
            "feu ? Relève son hésitation.",
            "Que soutient son interlocuteur à propos du feu ? Pourquoi cette "
            "idée est-elle terrible ?",
            "Que conseille-t-il à Banda d'avoir fait ? Recopie l'expression "
            "imagée qu'il emploie.",
            "Relève trois répliques très courtes qui se répondent. Quel "
            "rythme cela donne-t-il à la scène ?",
            "Quel est l'état d'esprit de Banda dans ce passage ? Justifie par "
            "trois indices.",
            "Que penses-tu du conseil qu'on lui donne ? Aurait-il dû le "
            "suivre ? Discute honnêtement les deux côtés."],
        grille_lecture=[
            ("Que le dialogue avance par reprises",
             "Les répliques qui reprennent les mots de la précédente"),
            ("Que Banda ne comprend pas encore",
             "Ses hésitations et ses « je ne sais pas »"),
            ("Que l'autre connaît les règles du jeu",
             "Ses affirmations catégoriques et son conseil"),
            ("Que la perte est chiffrée",
             "Les nombres, répétés, dans les deux premières répliques")],
        bilan=[
            "Une scène presque entièrement faite de **répliques courtes**, et "
            "c'est ce qui la rend étouffante.",
            "Regarde le mécanisme : on reprend les chiffres — deux cents "
            "kilos, six porteurs — comme on récite un procès-verbal. « C'est "
            "beaucoup, ça. » « Oui, beaucoup. » Puis vient le fait brut : "
            "« ils l'ont saisi et ils l'ont mis au feu ».",
            "Et l'interlocuteur soutient une chose atroce : **« ils ont fait "
            "semblant »**. Le cacao n'aurait pas brûlé. Quelqu'un l'aurait "
            "revendu.",
            "Enfin, le conseil : il aurait fallu leur « mouiller la barbe » — "
            "c'est-à-dire les payer. **Banda ne savait pas.** Toute sa "
            "catastrophe tient dans cette ignorance : il est venu avec sa "
            "récolte, sa bonne foi et son idée du samedi.",
            "**Le roman ne dit pas qu'il aurait fallu payer.** Il montre un "
            "monde où celui qui ne paie pas perd tout — et il laisse le "
            "lecteur avec cette question sur les bras."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Saisir** (un bien) : le confisquer légalement.",
                "**Faire semblant** : feindre.",
                "**« Mouiller la barbe »** : expression imagée pour dire "
                "*graisser la patte*, verser un pot-de-vin.",
                "**Une chronique** : le récit de faits rapportés dans l'ordre "
                "du temps."]),
            ("jeu", "Le calcul de Banda", [
                "Deux cents kilos, portés à six, depuis Bamila jusqu'à Tanga.",
                "**Calcule** : combien de kilos par personne ? Et si la "
                "marche a duré une journée entière, avec la charge sur la "
                "tête ?",
                "Puis cherche, dans le chapitre II, le prix annoncé par les "
                "rabatteurs (« Soixante francs le kilo »). **Combien Banda "
                "vient-il de perdre ?**",
                "Écris le résultat ici : ……………………… Ce chiffre est le "
                "sujet du roman."])])

    b += [h3("Ce qui arrive ensuite"),
          ("encadre", "lire", "La fin, en trois lignes — sans te la gâcher", [
              "Le roman ne s'arrête pas là. Une nuit passe, un homme meurt, "
              "une jeune fille reste seule, et Banda se retrouve devant des "
              "choix qu'il n'avait pas prévus.",
              "**Va lire les chapitres VI à XIII toi-même.** Ils se lisent "
              "d'une traite.",
              "Et ne saute surtout pas l'**Épilogue** : trois pages, écrites "
              "après tout le reste, où Banda annonce qu'il quitte Bamila. "
              "Sa dernière réplique est l'une des plus discutées de la "
              "littérature camerounaise : *« Qui donc a dit […] que le fils devait "
              "nécessairement vivre où a vécu le père ! »*"])]

    b += cote_enseignant([
        "Six séances, des chapitres II à V : la ville, la mécanique "
        "commerciale, les personnages, l'attente, la catastrophe. Les "
        "chapitres VI à XIII et l'épilogue restent en lecture personnelle ; "
        "le chapitre VIII sert de support à l'épreuve d'étude de texte.",
        "**Ne pas sauter le chapitre II.** C'est la page d'anthologie du "
        "roman, et c'est celle que les élèves abandonnent, faute d'action. "
        "Deux séances lui sont consacrées ici, à dessein.",
        "L'exemplaire courant est un scan : quelques coquilles subsistent "
        "(mots collés, lettres manquantes). Les extraits de ce manuel ont été "
        "choisis dans des passages nets ; signaler le fait aux élèves plutôt "
        "que de le laisser découvrir.",
        "Le roman décrit une escroquerie commerciale et une administration "
        "abusive dans un contexte colonial daté. Conduire la discussion sur "
        "**les mécanismes** — monopole d'achat, information inégale, coût du "
        "retour, pot-de-vin — plutôt que sur les nationalités des "
        "personnages : c'est ce que fait le texte lui-même.",
        "Le chapitre VIII (support d'épreuve) suit la mort d'un personnage et "
        "montre Banda consolant Odilia. Prévoir de situer brièvement la scène "
        "avant l'épreuve, sans en raconter la cause."])
    b.append(saut())
    return b
