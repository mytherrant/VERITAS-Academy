# -*- coding: utf-8 -*-
"""4ᵉ — *L'attachement au sol natal*, Ernest Alima (Éditions Ifrikiya, 2024).

**Vingt-six poèmes répartis en six sections** — le chiffre et la répartition
(1, 9, 8, 4, 2 et 2 textes) sont donnés par le **Dossier pédagogique** placé à
la fin du volume et signé Jean-Claude Awono et Josée Meli. Ce dossier fournit
aussi les trois clés de lecture reprises ici : l'**écriture du morcellement**,
le **vers libre teinté de relents classiques**, et le goût du poète pour la
**répétition**.

Règle de la poésie dans cette collection : **un extrait est un poème entier**,
jamais un fragment — et la référence le dit. Coller deux poèmes bout à bout
pour atteindre un quota détruirait précisément l'objet qu'on étudie.
"""
import jeux
import source
from gabarit import (cote_enseignant, epreuve_etude_texte, epreuve_expression,
                     epreuve_orthographe, lecture_suivie, ouvrir, production)
from kit import cases, enc, grille, h1, h2, h3, lignes, num, p, puce, saut

CLE = "solnatal"
SRC = "Ernest Alima, *L'attachement au sol natal*, Éditions Ifrikiya, 2024"


def _poeme(debut, fin):
    """Un poème entier, découpé de son premier à son dernier vers."""
    return source.extrait(CLE, debut, arrivee=fin)


def _ref(titre):
    """La référence nomme l'unité reproduite : c'est la contrepartie de
    l'exemption de longueur accordée à la poésie."""
    return "%s, « %s » — **poème entier**" % (SRC, titre)


# ============================================================ 1. J'ouvre

def partie1():
    return [h1("Œuvre 3 — L'attachement au sol natal, d'Ernest Alima")] + ouvrir(
        "L'attachement au sol natal", "Ernest Alima",
        questions_couverture=[
            "**Le sol natal**, c'est la terre où l'on est né. Écris en trois "
            "lignes ce que ces deux mots évoquent **pour toi** : un village, "
            "une odeur, une saison, un bruit.",
            "Le titre parle d'un **attachement**. Cherche les autres sens de "
            "ce mot : à quoi attache-t-on quelque chose ? Que se passe-t-il "
            "quand un attachement se rompt ?",
            "Ce livre est un **recueil de poèmes**. Qu'attends-tu d'un poème "
            "que tu n'attends pas d'un roman ?",
            "Connais-tu, par cœur ou presque, un chant qui parle de ton "
            "pays ? Écris-en deux vers."],
        promesses=[
            "Un poète peut-il dire son amour d'un pays sans mentir ?",
            "Ce recueil sera-t-il seulement élogieux, ou aussi critique ?",
            "Faut-il rimer pour faire un poème ?",
            "À quoi sert la poésie, aujourd'hui ?"],
        journal_exemple=["17/04", "Section « Fibre patriotique »",
                         "Trois poèmes lus ; il répète « J'aime » au début de "
                         "presque chaque vers",
                         "Pourquoi répéter autant le même mot ?"])


# ================================================= 2. L'auteur et son livre

def partie2():
    return [
        h2("2. L'auteur et son livre"),
        h3("Ernest Alima"),
        p("Le **Dossier pédagogique** du volume le présente en une formule : "
          "« le vieux poète qui a depuis longtemps pris sa retraite et qui vit "
          "à Yaoundé ». Il a publié plusieurs recueils ; celui-ci paraît aux "
          "**Éditions Ifrikiya** en **2024**."),
        p("En tête du livre, une prière empruntée à **Charles Baudelaire** : "
          "*« Seigneur mon Dieu, accordez-moi la grâce de produire quelques "
          "beaux vers qui me prouvent à moi-même que je ne suis pas le dernier "
          "des hommes. »*"),
        enc("perso", "Une épigraphe très humble, et très ambitieuse", [
            "Relis la phrase de Baudelaire. Le poète ne demande pas la gloire, "
            "ni des lecteurs, ni un prix. Il demande **de quoi se prouver à "
            "lui-même** qu'il vaut quelque chose.",
            "Placer cela en tête d'un livre entier consacré à l'amour de son "
            "pays, c'est dire : *je ne suis pas sûr d'y arriver, mais "
            "j'essaie*.",
            "Retiens cette humilité. Elle t'autorise, à toi aussi, à écrire "
            "des vers sans être certain qu'ils soient bons."]),
        h3("Vingt-six poèmes, six sections"),
        p("Le Dossier pédagogique du volume est formel : le recueil « est "
          "constitué de **26 poèmes** répartis dans **six sections** "
          "comportant respectivement **1, 9, 8, 4, 2 et 2** textes »."),
        grille([["Section", "Nombre", "Ce qu'on y trouve"],
                ["**Liminaire**", "1",
                 "« Patriotisme et démocratie » : le programme du livre en "
                 "trente vers."],
                ["**Fibre patriotique**", "9",
                 "L'amour du pays, déclaré et redéclaré : « Mes deux grands "
                 "amours », « Cameroun, ma patrie », « Hymne à mon pays »…"],
                ["**Tripe républicaine**", "8",
                 "Le citoyen et la politique : « Démocratie I » et « II », "
                 "« Le retour des vautours », « Époque de tourmente »…"],
                ["**Chants d'Exil**", "4",
                 "Le poète loin de chez lui : « Pèlerinage aux sources », "
                 "« L'attachement au sol natal », « Soif du bercail »."],
                ["**Couronnes de lauriers**", "2",
                 "« Appel au travail », « Bon anniversaire, République "
                 "Unie »."],
                ["**Hymnes universels**", "2",
                 "Le pays s'ouvre au monde : « Hymne du citoyen de "
                 "l'univers », « Hymne à la solidarité »."]]),
        enc("mot", "Trois clés données par le livre lui-même", [
            "**1. L'écriture du morcellement.** Plutôt qu'un « poème-livre » "
            "unique — comme le *Cahier d'un retour au pays natal* d'Aimé "
            "Césaire —, Alima « organise ses pensées et ses sentiments autour "
            "de vingt-six épisodes textuels », dit le Dossier : une « sorte de "
            "puzzle, que la lecture critique est appelée à reconstituer ».",
            "**2. Le vers libre teinté de relents classiques.** Il garde la "
            "**rime**, mais sans en respecter les règles anciennes : ce qui "
            "l'intéresse, écrit le Dossier, « n'est en réalité que cette "
            "beauté sonore que les mots qui se rapprochent produisent à "
            "l'écoute du texte ».",
            "**3. La répétition.** C'est sa figure préférée : elle « déclenche "
            "le poème, lui assure son identité et sa cohérence », et elle "
            "« arrache le dire à la banalité prosaïque »."]),
        enc("culture", "Où Alima se situe, selon son propre dossier", [
            "Le Dossier pédagogique le place « à la croisée des mondes » : "
            "sensible aux effets de la versification française, **et** enraciné "
            "« dans une Afrique où la parole obéit parfois plus à des logiques "
            "de rythmes et d'images qu'à celle de la rime ».",
            "Et il cite ses voisins de famille : **Senghor**, **Césaire**, et "
            "parmi ses contemporains camerounais **René Philombe**, **Jeanne "
            "Ngo Mai**, **Patrice Kayo**.",
            "Voilà une bibliographie toute prête. Si un de ces poèmes te "
            "plaît, tu sais désormais où aller ensuite."]),
        enc("astuce", "Comment lire un recueil de poèmes", [
            "**Ne le lis pas d'un bout à l'autre comme un roman.** Vingt-six "
            "poèmes lus à la file finissent par se ressembler.",
            "Lis-en **deux par jour**, à voix haute, et note à chaque fois "
            "**un** vers que tu voudrais savoir par cœur.",
            "À la fin, tu auras vingt-six vers choisis par toi : c'est ton "
            "recueil dans le recueil, et il vaut mieux que n'importe quelle "
            "fiche."]),
        saut()]


# =========================================================== 3. Qui est qui

def partie3():
    b = [h2("3. Dans un recueil de poèmes, qui parle ?"),
         p("Un roman a des personnages ; une pièce a des rôles. Un recueil de "
           "poèmes, lui, a **une voix**. Apprendre à la reconnaître, c'est "
           "tout l'art de lire la poésie."),
         grille([["Qui parle", "Comment on le repère", "Exemple du recueil"],
                 ["**Le « je » du poète**", "Les verbes à la 1ʳᵉ personne, "
                  "les possessifs *mon*, *ma*, *mes*",
                  "« J'ai deux grands amours / Que j'éprouve depuis "
                  "toujours »"],
                 ["**Le « je » qui s'adresse au pays**",
                  "L'apostrophe : on parle **à** quelqu'un ou à quelque chose",
                  "« Cameroun, ma patrie, / Je suis né en ton sein »"],
                 ["**Le « nous » du citoyen**",
                  "La 1ʳᵉ personne du pluriel, les mots de la communauté",
                  "« Nous vivons une époque tourmentée »"],
                 ["**La voix qui accuse**",
                  "Les images animales, l'ironie, les mots de la satire",
                  "« Ils sont de retour / Dans nos murs, / Les vautours »"]]),
         enc("mot", "Six mots de poésie, une fois pour toutes", [
             "**Un vers** : une ligne d'un poème. On ne dit jamais « une "
             "phrase » ni « une ligne » : on dit **un vers**.",
             "**Une strophe** : un groupe de vers, séparé du suivant par un "
             "blanc.",
             "**La rime** : la répétition du même son à la fin de deux vers "
             "(*amour / toujours*).",
             "**Le vers libre** : un vers qui ne compte pas ses syllabes et "
             "qui n'est pas obligé de rimer.",
             "**L'anaphore** : la répétition du même mot **au début** de "
             "plusieurs vers. C'est la figure préférée d'Alima.",
             "**L'apostrophe** : le fait de s'adresser directement à quelqu'un "
             "ou à quelque chose (« Ô sol ancestral ! »)."]),
         enc("culture", "Les images que le recueil emploie sans arrêt", [
             "**Le pays est une mère** : on naît « en son sein », on y est "
             "« nourri au sein », « pétri dans le moule de tes mains ».",
             "**Le pays est une aimée** : le Dossier le dit — « son lyrisme "
             "est similaire à celui d'un amant qui voue un véritable culte à "
             "sa belle ».",
             "**Le pays est un corps** : le sang du pays « chemine dans mes "
             "veines / En charriant tes gènes ».",
             "**Les profiteurs sont des oiseaux de proie** : les « vautours », "
             "les « rapaces », qui plongent « toutes serres dehors, / Sur les "
             "poules aux œufs d'or ! »",
             "Repère ces quatre familles d'images en lisant : elles reviennent "
             "d'un poème à l'autre, et elles font l'unité du recueil."])]

    e, c = jeux.relier(
        "Chaque figure, son effet",
        [("L'anaphore", "Elle martèle une idée en la répétant au début des "
                        "vers"),
         ("L'apostrophe", "Elle s'adresse directement au pays, comme à une "
                          "personne"),
         ("La comparaison", "Elle rapproche deux choses avec « comme »"),
         ("La métaphore", "Elle remplace une chose par une autre, sans "
                          "« comme »"),
         ("L'ironie", "Elle dit le contraire de ce qu'elle pense, pour "
                      "critiquer"),
         ("Le vers libre", "Il se passe du compte des syllabes et de "
                           "l'obligation de rimer")],
        graine=211)
    b += e
    b.append(saut())
    return b, c


# ======================================================= 4. Lectures suivies

def partie4():
    b = [h2("4. Je lis l'œuvre — six lectures suivies"),
         enc("astuce", "Pourquoi ces extraits sont plus courts", [
             "Dans les deux œuvres précédentes, chaque extrait dépassait cinq "
             "cents mots. Ici, non — et c'est voulu.",
             "**Un poème se lit entier.** Le couper en deux pour atteindre un "
             "nombre de mots reviendrait à étudier une moitié de chanson. "
             "Chacun des six extraits ci-dessous est donc **un poème "
             "complet**, du premier au dernier vers, et la référence le dit.",
             "En revanche, on te demandera de les lire **à voix haute**. Un "
             "poème qu'on n'a pas entendu n'a pas été lu."])]

    b += lecture_suivie(
        1, "Le programme du livre (« Patriotisme et démocratie », liminaire)",
        situation=[
            "C'est le poème **liminaire** : le seul de la première section, "
            "placé en ouverture pour annoncer tout le reste.",
            "Trente vers pour dire ce que le poète attend d'un pays. Lis-le "
            "d'abord en entier sans t'arrêter, puis reprends vers par vers."],
        texte=_poeme("L'amour de la patrie", "véritablement La fibre patriotique."),
        source=_ref("Patriotisme et démocratie"),
        questions=[
            "Quelles sont les **deux** choses que le poète met sur le même "
            "plan dès les premiers vers ?",
            "Relève ce qu'elles produisent, d'après lui. Combien de bienfaits "
            "sont énumérés ?",
            "Comment appelle-t-on une figure qui énumère ainsi ? Que "
            "produit-elle ici ?",
            "Repère les rimes. Sont-elles régulières ? Relève trois séries de "
            "sons qui se répondent.",
            "Compte les syllabes de cinq vers différents. Ont-ils tous la "
            "même longueur ? Comment appelle-t-on ce type de vers ?",
            "Le poème se termine sur l'expression « la fibre patriotique ». "
            "Explique cette image : qu'est-ce qu'une fibre ?",
            "En une phrase : quel est le **programme** annoncé par ce poème "
            "liminaire ?"],
        grille_lecture=[
            ("Que deux notions sont liées",
             "Les mots *patrie* et *démocratie*, et ce qui les relie"),
            ("Que l'énumération donne du souffle",
             "La suite des bienfaits, et la ponctuation"),
            ("Que le vers est libre mais sonore",
             "Les longueurs inégales et les rimes conservées"),
            ("Que le titre du recueil est déjà là",
             "Les mots qui annoncent l'attachement")],
        bilan=[
            "Un poème liminaire est une **porte** : il dit ce qu'on va "
            "trouver derrière.",
            "Et il dit ici quelque chose de précis : aimer son pays et "
            "vouloir la démocratie ne sont pas deux choses différentes. Ce "
            "sont, écrit le poète, deux « atouts majeurs » qui produisent "
            "ensemble la liberté, l'harmonie, le progrès, le bonheur.",
            "**Retiens le procédé de l'énumération.** Le poète ne démontre "
            "rien : il **accumule**, et l'accumulation produit une impression "
            "d'évidence. C'est une arme — apprends à la reconnaître aussi "
            "quand elle sert des idées que tu ne partages pas.",
            "Et note la longueur inégale des vers : deux syllabes ici, dix "
            "là. C'est le **vers libre**. Alima garde la rime — pour le "
            "plaisir de l'oreille — mais il jette le compte des syllabes par "
            "la fenêtre."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**La patrie** : le pays où l'on est né et auquel on se sent "
                "appartenir. (Du latin *pater*, le père.)",
                "**La démocratie** : le régime où le peuple choisit ceux qui "
                "le gouvernent. (Du grec *dêmos*, le peuple, et *kratos*, le "
                "pouvoir.)",
                "**Un atout** : un avantage, une carte maîtresse.",
                "**Générateur de** : qui produit, qui engendre.",
                "**Interpeller** : appeler quelqu'un pour l'obliger à "
                "répondre."])])

    b += lecture_suivie(
        2, "Deux amours (« Mes deux grands amours »)",
        situation=[
            "Premier poème de la section **Fibre patriotique**. Le poète "
            "commence par écarter poliment deux amours plus grands encore, "
            "puis il déclare les siens.",
            "Compte-les en lisant : ils ne sont pas ceux qu'on attendrait "
            "dans un livre patriotique."],
        texte=_poeme("Honnis le grand amour", "Et la fraternité."),
        source=_ref("Mes deux grands amours"),
        questions=[
            "Quels amours le poète met-il **hors concours** dès les premiers "
            "vers ?",
            "Quels sont alors ses « deux grands amours » ? Le second "
            "t'étonne-t-il ?",
            "Relève la comparaison du premier mouvement. À quoi cet amour "
            "est-il comparé ?",
            "« J'aime ma patrie / Jusqu'à l'idolâtrie. » Que signifie ce "
            "mot ? Le poète est-il en train de se vanter, ou de s'accuser un "
            "peu ?",
            "De quelles deux manières dit-il chanter sa patrie ? Recopie les "
            "deux vers.",
            "Pourquoi aime-t-il l'humanité ? Relève les deux raisons — elles "
            "riment ensemble.",
            "Les derniers vers décrivent une humanité idéale. Relève les "
            "trois mots qui la définissent."],
        grille_lecture=[
            ("Que le poème est construit en deux moitiés",
             "Le mot qui ouvre la seconde (*J'aime / De même*)"),
            ("Que les rimes s'enchaînent en cascade",
             "Les séries de sons (*amours / toujours / jours*, *patrie / "
             "idolâtrie / dédie / vie*)"),
            ("Que l'amour du pays n'exclut pas le monde",
             "Le vocabulaire de la variété et de la diversité"),
            ("Que le poète se surveille lui-même",
             "Le mot *idolâtrie* et ce qu'il reconnaît")],
        bilan=[
            "Un poème patriotique qui, dès sa quinzième ligne, **change de "
            "camp** : le second grand amour du poète, c'est l'humanité "
            "entière.",
            "Et il donne sa raison : il l'aime « pour sa variété / Et sa "
            "diversité / Qui font sa beauté ». Autrement dit — **ce qui rend "
            "l'humanité belle, c'est qu'elle n'est pas pareille partout**.",
            "Regarde aussi le mot *idolâtrie*. Idolâtrer, c'est adorer comme "
            "un dieu. Le poète avoue donc qu'il aime son pays **un peu trop**. "
            "C'est une petite phrase, et elle vaccine tout le recueil contre "
            "le fanatisme : celui qui sait qu'il exagère ne devient pas "
            "dangereux.",
            "**Écoute enfin la musique.** Les rimes tombent en cascade — "
            "*patrie, idolâtrie, dédie, partie, vie, mélodies, pétries* — "
            "sept fois le même son. Le Dossier pédagogique appelle cela « une "
            "pluie de mots proches phonétiquement »."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Honni** : rejeté, mis à part (ici : « mis hors concours »).",
                "**Un géniteur** : celui qui a engendré, le père ou la mère.",
                "**L'idolâtrie** : l'adoration excessive, comme celle qu'on "
                "voue à une idole.",
                "**Pétri de** : entièrement fait de.",
                "**L'Être incréé** : Dieu — celui qui n'a pas été créé."]),
            ("jeu", "Ta cascade de rimes", [
                "Choisis un mot de trois syllabes qui te plaît. Puis trouve "
                "**six** mots qui riment avec lui.",
                "Écris ensuite six vers courts, un par mot, qui disent tous "
                "la même idée sous six formes différentes.",
                "Tu viens de faire ce que fait Alima à chaque page. Lis ton "
                "texte à voix haute : la musique compte plus que le sens."])])

    b += lecture_suivie(
        3, "Né en ton sein (« Cameroun, ma patrie »)",
        situation=[
            "Toujours dans la section **Fibre patriotique**. Ce poème est "
            "peut-être le plus connu du recueil, et le plus facile à "
            "apprendre par cœur.",
            "Il est bâti sur une seule expression, répétée. Trouve-la dès la "
            "première lecture."],
        texte=_poeme("Cameroun, ma patrie, Je suis né en ton sein",
                     "s'exhalera de moi !"),
        source=_ref("Cameroun, ma patrie"),
        questions=[
            "Quelle expression revient trois fois ? Où est-elle placée dans "
            "chaque strophe ?",
            "Combien de fois le mot « sein » apparaît-il ? Fais la liste de "
            "ce qui se passe « en ton sein ».",
            "Le poème couvre une vie entière. Relève les étapes : naître, "
            "puis…",
            "« À l'inverse de ces sœurs et frères miens / Qui vont de ciel en "
            "ciel / Au-delà du Sahel / En quête d'une vie divine ! » De qui "
            "parle-t-il ? Que leur reproche-t-il — ou que constate-t-il ?",
            "Relève l'image du sang. Recopie les trois vers. Que veut dire le "
            "poète en écrivant que le sang du pays « chemine dans mes "
            "veines » ?",
            "Le dernier mouvement compare l'amour à quelque chose. À quoi ? "
            "Quand cet amour s'éteindra-t-il ?",
            "Recopie le vers que tu aimerais savoir par cœur. Explique ton "
            "choix en une phrase."],
        grille_lecture=[
            ("Que le pays est une mère",
             "Le mot *sein* et les verbes de la naissance"),
            ("Que le poème suit une vie entière",
             "Les verbes au passé, au présent, puis au futur"),
            ("Que l'appartenance est physique",
             "L'image du sang, des veines, des gènes"),
            ("Que d'autres sont partis",
             "Les vers sur ceux qui vont « au-delà du Sahel »")],
        bilan=[
            "Un poème en trois temps, comme une vie : **je suis né en ton "
            "sein**, **j'ai grandi en ton sein**, **en ton sein je mourrai**.",
            "L'image est celle de la **mère** : on est nourri au sein, « pétri "
            "dans le moule de tes mains ». Le pays n'est pas un territoire "
            "avec des frontières : c'est un corps qui vous a fabriqué.",
            "Puis vient l'image la plus forte : le sang du pays, « pur comme "
            "au point d'émergence / Une onde souterraine », **chemine dans "
            "les veines du poète en charriant ses gènes**. L'appartenance "
            "devient biologique.",
            "Et au milieu de ce poème d'amour, quatre vers sur ceux qui "
            "partent : les frères et sœurs « qui vont de ciel en ciel / "
            "Au-delà du Sahel / En quête d'une vie divine ». Le poète ne les "
            "insulte pas. Il dit seulement : *moi, j'y ai pris racine*.",
            "**À toi de décider ce que tu en penses** — et ce sera l'un des "
            "trois débats de fin d'année."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Pétrir** : travailler une pâte avec les mains pour lui "
                "donner forme.",
                "**Prendre racine** : s'installer durablement, comme un arbre.",
                "**Le point d'émergence** : l'endroit où une source sort de "
                "terre.",
                "**Une onde** : de l'eau qui coule (mot poétique).",
                "**Charrier** : transporter avec soi, en emportant.",
                "**S'exhaler** : sortir en soufflant — un dernier soupir "
                "s'exhale."]),
            ("jeu", "Apprends-le par cœur", [
                "Ce poème s'apprend en vingt minutes, parce qu'il est bâti "
                "sur une répétition. Méthode : apprends d'abord **les trois "
                "vers qui commencent par « Cameroun, ma patrie » et « en ton "
                "sein »**, puis remplis les trous.",
                "Récite-le debout, en frappant le rythme sur ta table. Tu "
                "verras que le poème t'aide : il est fait pour être dit.",
                "Ensuite seulement, essaie de l'écrire de mémoire. Les fautes "
                "que tu feras sont exactement les mots que tu n'avais pas "
                "compris."])])

    b += lecture_suivie(
        4, "Le mot qui manquait au dictionnaire (« Démocratie I »)",
        situation=[
            "Changement de section : nous entrons dans **Tripe "
            "républicaine**, la partie politique du recueil. Huit poèmes, et "
            "le ton change du tout au tout.",
            "Celui-ci raconte l'histoire d'un mot. Lis-le comme une petite "
            "leçon d'histoire versifiée."],
        texte=_poeme("Démocratie ! Démocratie ! Ô vocable hier encore absent",
                     "De la République !"),
        source=_ref("Démocratie I"),
        questions=[
            "Comment le poème commence-t-il ? Combien de fois le mot-titre "
            "est-il répété avant que la phrase ne démarre ?",
            "Que dit le poète de ce mot « hier encore » ? Relève les deux "
            "reproches faits au passé.",
            "Qu'est-ce qu'un « parti monolithique » ? Décompose le mot : "
            "*mono-* et *-lithique*.",
            "Le poème fait allusion à **La Baule**. Cherche : quel discours "
            "un président français y a-t-il prononcé en 1990, et sur quel "
            "sujet ?",
            "Comment le poète désigne-t-il ce président ? Que penses-tu de "
            "cette expression ?",
            "Relève l'anaphore de la fin (« T'appellent à l'unisson à la "
            "rescousse ! »). Qui appelle la démocratie ? Fais la liste.",
            "Les derniers vers emploient une image mécanique. Recopie-la. "
            "Qu'est-ce qui est comparé à une machine ?"],
        grille_lecture=[
            ("Que le poème s'adresse à une idée",
             "Les apostrophes et le *tu* employé pour la démocratie"),
            ("Que le passé est jugé",
             "Les mots de l'interdit (*absent*, *interdit d'usage*)"),
            ("Que le peuple entier réclame",
             "Ce qui « appelle à l'unisson », énuméré"),
            ("Que la politique est vue comme une mécanique",
             "L'image finale des rouages et de la machine")],
        bilan=[
            "Un poème politique, et une leçon de vocabulaire : il raconte "
            "**l'entrée d'un mot dans une langue**.",
            "Le poète rappelle qu'il fut un temps où « démocratie » était "
            "« absent du lexique des politiques » et « interdit d'usage dans "
            "les motions de soutien du parti monolithique ». Un mot peut donc "
            "être interdit — et un pays peut changer le jour où l'on ose le "
            "prononcer.",
            "Puis il fait appel à l'histoire réelle : **le discours de La "
            "Baule**, en juin 1990, où le président français annonça que "
            "l'aide au développement serait liée aux avancées démocratiques. "
            "Alima l'appelle avec ironie « le pape de la gauche de "
            "l'Hexagone ».",
            "Et il termine par une anaphore martelée — les graffitis des "
            "palissades et des façades « t'appellent à l'unisson à la "
            "rescousse » — puis par une image de garage : « les rouages "
            "grippés de la machine politique ». **Un pays qu'il faut "
            "lubrifier.** C'est irrespectueux, et c'est très efficace."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Un vocable** : un mot (terme savant).",
                "**Un lexique** : l'ensemble des mots d'une langue ou d'un "
                "domaine.",
                "**Une motion de soutien** : un texte voté par une assemblée "
                "pour approuver quelqu'un.",
                "**Monolithique** : d'un seul bloc (*mono* = un, *lithos* = "
                "pierre). Un **parti unique**, où aucune autre voix n'existe.",
                "**À l'unisson** : tous ensemble, d'une seule voix.",
                "**Gripper** : se bloquer, faute de graisse — pour un "
                "mécanisme."]),
            ("culture", "Pourquoi un poète parle-t-il de politique ?", [
                "Parce que la poésie africaine du XXᵉ siècle s'est très "
                "souvent chargée de le faire : Senghor, Césaire, Philombe et "
                "beaucoup d'autres ont écrit des vers sur la liberté, la "
                "colonisation, l'indépendance.",
                "**Et parce qu'un poème se retient.** Un discours s'oublie ; "
                "quatre vers qui riment restent.",
                "Le Dossier du volume parle d'un « engagement citoyen ». "
                "Retiens ce mot : un écrivain **engagé** est celui qui met son "
                "art au service d'une cause."])])

    b += lecture_suivie(
        5, "Les vautours sont revenus (« Le retour des vautours »)",
        situation=[
            "Toujours dans **Tripe républicaine**. Vingt-cinq vers très "
            "courts, un seul mouvement, et pas un seul nom propre.",
            "C'est le poème le plus féroce du recueil. Lis-le à voix haute, "
            "vite : le rythme fait la moitié du travail."],
        texte=_poeme("Ils sont de retour", "Sur les poules aux œufs d'or !"),
        source=_ref("Le retour des vautours"),
        questions=[
            "Quels sont les tout premiers mots ? Sont-ils répétés ? Où ?",
            "Que sont ces « vautours » ? Le poème le dit-il explicitement ?",
            "Qu'est-ce qui les attire ? Relève les vers.",
            "« Victimes des feux / Par eux / Allumés. » Que découvre-t-on "
            "ici ? Reformule en une phrase claire.",
            "Relève les trois mots qui riment dans « Voraces / Rapaces / De "
            "pire race ». Que produit cette suite ?",
            "Que sont les « cocoricos cacophoniques et folkloriques des "
            "basses-cours » ? Explique chaque mot, puis l'image entière.",
            "L'expression finale, « les poules aux œufs d'or », vient d'une "
            "fable. Laquelle ? Que désigne-t-elle ici ?"],
        grille_lecture=[
            ("Que le poème est une accusation",
             "Le vocabulaire animal appliqué à des humains"),
            ("Que les coupables ont eux-mêmes allumé le feu",
             "Les trois vers sur les victimes"),
            ("Que le rythme est haché",
             "La longueur des vers : compte les syllabes"),
            ("Que rien n'est nommé",
             "L'absence de nom propre, et l'usage de *ils*")],
        bilan=[
            "Vingt-cinq vers, aucun nom, et tout le monde comprend.",
            "Le procédé s'appelle **l'allégorie animale** : on remplace des "
            "hommes par des bêtes, et l'on peut alors tout dire. La Fontaine "
            "l'a fait, les contes que tu as lus en sixième aussi. Alima "
            "l'emploie ici contre des profiteurs qu'il ne nomme pas.",
            "Et il ajoute la charge la plus grave : ces charognards sont "
            "attirés par « la puanteur des corps morts » — mais ces morts sont "
            "**« victimes des feux / Par eux / Allumés »**. Ils profitent d'un "
            "désastre qu'ils ont provoqué.",
            "Écoute enfin le rythme : « Voraces / Rapaces / De pire race » — "
            "trois vers de trois syllabes, trois fois le même son. Puis "
            "« cocoricos cacophoniques et folkloriques » : essaie de le dire "
            "vite. **Le poème se moque avec ses consonnes.**",
            "Un dernier mot sur la prudence. Ce poème accuse sans nommer : "
            "c'est une des grandes libertés de la poésie. En classe, on "
            "discute **du poème**, jamais de personnes réelles."],
        encadres=[
            ("animal", "Le vautour, ce mal-aimé nécessaire", [
                "Le vautour est un **charognard** : il ne tue pas, il mange "
                "les animaux déjà morts. C'est pour cela qu'il est le symbole "
                "universel du profiteur.",
                "**Et pourtant** : en nettoyant les carcasses, les vautours "
                "empêchent la propagation des maladies. Là où ils disparaissent "
                "— et ils disparaissent vite —, les épidémies augmentent.",
                "Voilà une bonne question pour un débat : peut-on faire d'un "
                "animal utile le symbole du mal ? Le poète a-t-il le droit "
                "d'être injuste envers un oiseau ?"]),
            ("mot", "Les mots difficiles", [
                "**Un rapace** : un oiseau de proie.",
                "**Vorace** : qui dévore avidement.",
                "**Allécher** : attirer par l'appât d'une chose agréable.",
                "**Cacophonique** : qui produit un bruit désagréable, un "
                "mélange de sons discordants.",
                "**Des serres** : les griffes d'un oiseau de proie.",
                "**À l'affût** : à l'endroit où l'on guette sa proie."])])

    b += lecture_suivie(
        6, "Celui qui est parti (« L'attachement au sol natal »)",
        situation=[
            "Nous entrons dans la section **Chants d'Exil**, et voici le "
            "poème qui donne son titre au recueil entier.",
            "Attention : contrairement à ce qu'on attend, il ne parle pas de "
            "quelqu'un qui reste. Il parle de quelqu'un **qui est parti**."],
        texte=_poeme("Sol natal Ô sol ancestral !",
                     "Sous les cendres des années En allées !"),
        source=_ref("L'attachement au sol natal"),
        questions=[
            "Par quoi le poème commence-t-il ? Comment appelle-t-on cette "
            "façon de s'adresser directement à quelque chose ?",
            "À quel moment de la journée le départ a-t-il eu lieu ? Recopie "
            "les vers qui le décrivent.",
            "« Le soleil, / L'œil vermeil de sommeil, / Regagne à l'ouest son "
            "dortoir. » Explique cette image. Combien de comparaisons "
            "contient-elle ?",
            "Pourquoi le poète est-il parti ? Relève le mot exact — il tient "
            "en deux syllabes.",
            "Où est-il allé ? Que signifie « de hautes sphères / Au-delà de "
            "tes frontières » ?",
            "Relève les images de la mémoire dans la seconde moitié du poème "
            "(visages, paysages, pans, cendres). Qu'est-ce qui s'est passé "
            "avec le temps ?",
            "Le poème s'achève sur « Sous les cendres des années / En allées ! » "
            "Trouves-tu cette fin triste, ou apaisée ? Justifie."],
        grille_lecture=[
            ("Que le poète s'adresse à la terre",
             "Les apostrophes et le *tu* employé pour le sol"),
            ("Que le départ est daté et mis en scène",
             "Les vers sur le seuil du soir et le soleil"),
            ("Que le départ n'était pas un abandon",
             "Le mot qui donne la raison du départ"),
            ("Que la mémoire s'efface lentement",
             "Le champ lexical de la cendre et de l'oubli")],
        bilan=[
            "Le poème-titre du recueil, et il dit exactement le contraire de "
            "ce qu'on croyait : l'attachement au sol natal, **c'est le "
            "sentiment de celui qui l'a quitté**.",
            "Le départ est raconté comme une scène de théâtre : au seuil du "
            "soir, à l'heure où le soleil « regagne à l'ouest son dortoir », "
            "le visage baigné de pleurs « coulant goutte à goutte de mon "
            "cœur ». Et la raison tient en deux mots : **par devoir**. Il "
            "n'est pas parti pour l'argent : il est parti servir.",
            "Puis la seconde moitié du poème fait ce que fait la mémoire : "
            "elle rapproche des visages, des paysages, « des pans entiers / De "
            "ma vie / Ensevelie / Sous les cendres des années / En allées ».",
            "**Le mot « cendres » est le plus important du poème.** Sous les "
            "cendres, il y a eu un feu — et sous les cendres, parfois, il "
            "reste de la braise. C'est ainsi que ce recueil parle de l'exil : "
            "non comme d'une mort, mais comme d'un feu couvert.",
            "Relis maintenant le titre du livre. Il ne parle plus du tout de "
            "la même chose qu'à la première page."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Ancestral** : qui vient des ancêtres.",
                "**Vermeil** : d'un rouge vif.",
                "**Un dortoir** : la pièce où l'on dort à plusieurs. Ici, "
                "l'ouest où le soleil va se coucher.",
                "**De hautes sphères** : les milieux du pouvoir, les postes "
                "importants.",
                "**Enseveli** : recouvert, enterré.",
                "**En allées** : passées, disparues (tournure poétique, du "
                "verbe *s'en aller*)."]),
            ("perso", "Trois manières de quitter son pays, dans ce manuel", [
                "**Faydé** part parce que la terre ne nourrit plus. Elle part "
                "à cinquante kilomètres, et elle revient.",
                "**Les frères et sœurs** du poème « Cameroun, ma patrie » "
                "vont « de ciel en ciel, au-delà du Sahel, en quête d'une vie "
                "divine ». Le poète les regarde partir.",
                "**Le poète lui-même**, dans ce poème-ci, est parti « par "
                "devoir », pour servir son pays « au-delà de tes frontières ».",
                "Trois départs, trois raisons, un seul manuel. C'est le "
                "premier fil des Passerelles, à la fin de ce volume."])])

    b += cote_enseignant([
        "Six séances, six **poèmes entiers** couvrant quatre des six sections "
        "du recueil. Les vingt autres poèmes restent en lecture personnelle ; "
        "l'épreuve d'étude de texte porte sur « Hymne à la solidarité », de la "
        "dernière section.",
        "**Sur la longueur des extraits.** Les six textes retenus font de 81 "
        "à 314 mots. C'est volontaire et conforme à la règle de la "
        "collection : en poésie, l'unité d'étude est le **poème entier**, "
        "jamais un fragment ; en contrepartie, chaque référence nomme l'unité "
        "reproduite.",
        "Toutes les séances comportent une lecture à voix haute. Prévoir, une "
        "fois au moins, une **récitation** : « Cameroun, ma patrie » "
        "s'apprend en une vingtaine de minutes grâce à son anaphore.",
        "« Démocratie I » et « Le retour des vautours » sont des poèmes "
        "**politiques**. Ils s'étudient comme des textes : figures, rythme, "
        "images, procédés de l'accusation. Tenir le débat sur le poème et sur "
        "les faits historiques nommés (le discours de La Baule, 1990), jamais "
        "sur des personnes ou des partis actuels.",
        "Le Dossier pédagogique du volume, signé Jean-Claude Awono et Josée "
        "Meli, est un outil de classe : il fournit le décompte des poèmes, "
        "l'analyse de l'esthétique et une mise en perspective avec Césaire, "
        "Senghor et Philombe. Y renvoyer les élèves plutôt que de le "
        "paraphraser."])
    b.append(saut())
    return b


# ==================================================== 5. Les productions

def partie5():
    b = [h2("5. J'écris — le poème et l'appel"),
         p("Deux derniers ateliers. Avec les cinq précédents — résumé, texte "
           "explicatif, portrait en contraste, argumentation complète — tu "
           "auras couvert tout ce qu'on demande d'écrire en quatrième."),
         ("puce", "☐  résumer      ☐  expliquer      ☐  faire un portrait en "
          "contraste"),
         ("puce", "☐  argumenter d'un bout à l'autre      ☐  écrire un poème  "
          "    ☐  lancer un appel")]

    b += production(
        "le poème en vers libres",
        "écrire un poème en vers libres qui tienne debout par son rythme et "
        "ses images.",
        modele=(
            "**Mon quartier**\n"
            "❶ J'aime mon quartier,\n"
            "Ses toits de tôle rouillée\n"
            "Qui chantent sous la pluie\n"
            "Comme un tambour mouillé.\n"
            "❷ J'aime ses caniveaux,\n"
            "Ses tas de sable,\n"
            "Ses portes qu'on ne ferme pas.\n"
            "❸ J'aime, au petit matin,\n"
            "L'odeur du pain\n"
            "Et le cri des vendeuses\n"
            "Qui réveille les paresseux\n"
            "Mieux qu'un réveil.\n"
            "❹ Mais je n'aime pas\n"
            "La flaque du carrefour\n"
            "Qui ne sèche jamais,\n"
            "Ni les fils électriques\n"
            "Qui pendent comme des lianes mortes.\n"
            "❺ Mon quartier n'est pas beau.\n"
            "Il est à moi."),
        annotations=[
            ["❶ ❷ ❸ L'anaphore",
             "*J'aime* répété au début de trois mouvements. **C'est elle qui "
             "tient le poème debout** : sans elle, ce serait une liste."],
            ["Les images",
             "Les toits « chantent » ; ils sont « comme un tambour mouillé » ; "
             "les fils pendent « comme des lianes mortes ». **Deux "
             "comparaisons, une métaphore.**"],
            ["Le vers libre",
             "Deux syllabes ici, huit là. Aucune règle de longueur — mais des "
             "rimes gardées quand elles viennent (*rouillée / mouillé*, "
             "*matin / pain*)."],
            ["❹ Le retournement",
             "*Mais je n'aime pas*. **Un poème d'amour sans une réserve ne "
             "convainc personne.**"],
            ["❺ La chute",
             "Deux phrases très courtes, dont la dernière fait quatre mots. "
             "On n'explique rien."]],
        questions=[
            "Compte les syllabes de six vers différents. Sont-elles "
            "régulières ? Comment appelle-t-on ce type de vers ?",
            "Relève l'anaphore. Combien de fois revient-elle ? Que se "
            "passerait-il si on la supprimait ?",
            "Relève les deux comparaisons et la métaphore. Quel petit mot "
            "signale les comparaisons ?",
            "À quoi sert le mouvement ❹ ? Supprime-le et relis : le poème "
            "est-il plus fort ou plus faible ?",
            "Compare la chute avec la fin de « Cameroun, ma patrie ». Laquelle "
            "des deux préfères-tu, et pourquoi ?"],
        regle=[
            "Un **vers libre** ne compte pas ses syllabes et n'est pas obligé "
            "de rimer — mais il doit avoir **un rythme** : on l'entend quand "
            "on lit à voix haute.",
            "L'**anaphore** — répéter le même mot au début de plusieurs vers "
            "— est la colonne vertébrale du poème. Elle « déclenche le poème "
            "et lui assure sa cohérence », dit le Dossier du recueil.",
            "Les **images** sont obligatoires : comparaison (avec *comme*), "
            "métaphore (sans *comme*), personnification (une chose qui agit "
            "comme un être vivant).",
            "**Un éloge sans réserve ne convainc pas.** Place toujours un "
            "*mais* quelque part.",
            "**La chute est courte.** Plus le poème s'allonge, plus sa "
            "dernière ligne doit être brève."],
        exercices=[
            "**Trouve des images.** Complète : *Le soleil de midi est comme…* "
            "· *La pluie sur la tôle fait le bruit de…* · *La poussière du "
            "chemin ressemble à…* Interdiction d'employer deux fois le même "
            "domaine (animal, machine, corps, nourriture).",
            "**Fabrique une anaphore.** Choisis un début de vers (*Je me "
            "souviens*, *Il y a*, *J'aime*, *Chez nous*) et écris huit vers "
            "qui commencent tous par lui.",
            "**Écris seul.** Un poème de vingt à trente vers libres sur "
            "**ton lieu** : ton quartier, ton village, ton école, ta cour. "
            "Obligatoire : une anaphore tenue sur trois mouvements ; deux "
            "comparaisons et une métaphore ; un retournement introduit par "
            "*mais* ; une chute de moins de dix mots.",
            "**Dis-le.** Lis ton poème debout, devant la classe, sans lire tes "
            "notes plus de deux fois. Un poème qu'on ne peut pas dire n'est "
            "pas fini."],
        astuce=("Comment savoir si ton vers est bon", [
            "Lis-le **à voix haute**, seul, deux fois. Si tu butes au même "
            "endroit les deux fois, le vers est mauvais — coupe-le ou "
            "raccourcis-le.",
            "Un vers trop long se reconnaît à ce qu'on manque d'air en le "
            "disant. Un vers trop court se reconnaît à ce qu'il n'apporte "
            "rien.",
            "Et si un vers te plaît beaucoup mais n'a rien à faire là, "
            "**garde-le dans un carnet** et sers-t'en une autre fois. Aucun "
            "bon vers ne se jette."]))

    b += production(
        "l'appel (texte injonctif et argumentatif à la fois)",
        "écrire un appel qui donne envie d'agir, et qui dit quoi faire.",
        modele=(
            "**Appel aux élèves de quatrième**\n"
            "❶ Notre cour est sale, et nous nous en plaignons tous les jours.\n"
            "❷ Nous nous plaignons du vent qui rabat les papiers, de la pluie "
            "qui bouche le caniveau, du gardien qui ne balaie plus. Nous "
            "n'avons jamais accusé le seul responsable que nous connaissions "
            "personnellement : nous.\n"
            "❸ Alors voici ce que je propose. **Choisis** un jour de la "
            "semaine. **Arrive** dix minutes avant la cloche. **Ramasse** ce "
            "qui traîne sur trois mètres autour de toi, pas davantage. "
            "**Recommence** la semaine suivante.\n"
            "❹ Trois mètres, dix minutes, une fois par semaine : c'est peu. "
            "Mais nous sommes cent quatre-vingts.\n"
            "❺ Ne compte pas sur les autres pour commencer. Commence, et "
            "compte-les après."),
        annotations=[
            ["❶ Le constat, en une phrase",
             "Ce que tout le monde reconnaît. **On ne commence jamais par une "
             "consigne.**"],
            ["❷ L'objection retournée",
             "On énumère les excuses — puis on désigne le vrai responsable. "
             "Le *nous* est capital : celui qui lance un appel s'y inclut."],
            ["❸ Les consignes, à l'impératif",
             "*Choisis, arrive, ramasse, recommence.* Quatre verbes, quatre "
             "actions **précises et petites**."],
            ["❹ Le calcul",
             "Un chiffre vaut mille encouragements. « Nous sommes cent "
             "quatre-vingts. »"],
            ["❺ La formule finale",
             "Deux impératifs qui se répondent. **Une chute d'appel se "
             "retient par cœur.**"]],
        questions=[
            "Combien de verbes à l'impératif comptes-tu ? Relève-les tous.",
            "Pourquoi les consignes sont-elles si petites (trois mètres, dix "
            "minutes) ? Que se passerait-il si l'on demandait de nettoyer "
            "toute la cour ?",
            "À quoi sert le chiffre du paragraphe ❹ ?",
            "Relève l'emploi de *nous* et celui de *tu*. Pourquoi ce "
            "changement de personne au milieu du texte ?",
            "Dans « Appel au travail », Ernest Alima lance lui aussi un appel. "
            "Cherche ce qu'il demande, et à qui. Compare avec le modèle "
            "ci-dessus."],
        regle=[
            "Un **appel** est à la fois un texte **argumentatif** (il "
            "convainc) et **injonctif** (il fait agir).",
            "Sa marche : **constat partagé → responsabilité assumée → "
            "consignes précises à l'impératif → un chiffre ou une preuve → "
            "une formule finale courte**.",
            "Les consignes doivent être **petites et vérifiables**. Un appel "
            "qui demande l'impossible n'obtient rien.",
            "Le **nous** engage celui qui parle ; le **tu** ou le **vous** "
            "s'adresse à celui qui doit agir. On peut passer de l'un à l'autre, "
            "à condition de savoir pourquoi.",
            "**À l'impératif, 2ᵉ personne du singulier, pas de *s* aux verbes "
            "du 1ᵉʳ groupe** : *ramasse*, *commence*, *arrive*."],
        exercices=[
            "**Conjugue à l'impératif** : *ramasser, commencer, arriver, "
            "choisir, venir, faire, être, savoir*.",
            "**Rends les consignes possibles.** Réécris ces demandes pour "
            "qu'on puisse vraiment les suivre : *Soyez plus solidaires. · "
            "Aimez votre pays. · Faites des efforts. · Respectez "
            "l'environnement.*",
            "**Écris seul.** Rédige un **appel** de vingt lignes sur un sujet "
            "de ton établissement ou de ton quartier. Cinq étapes "
            "obligatoires, au moins quatre impératifs, un chiffre, une "
            "formule finale de moins de douze mots.",
            "**Teste-le.** Lis ton appel à la classe. Demande ensuite, à main "
            "levée, combien d'élèves feraient ce que tu demandes **dès "
            "demain**. C'est la seule note qui compte."])

    b.append(saut())
    return b


# ============================================================ 6. Je joue

def partie6():
    b = [h2("6. Je joue et je révise"), p("Livre fermé.")]
    corriges = []

    e, c = jeux.mots_meles("Les mots du recueil", [
        "poeme", "vers", "strophe", "rime", "anaphore", "apostrophe",
        "metaphore", "comparaison", "patrie", "democratie", "vautour",
        "rapace", "exil", "bercail", "solidarite", "citoyen", "terroir",
        "Cameroun", "Yaounde", "Ifrikiya", "Alima", "Baudelaire", "Senghor",
        "Cesaire", "Philombe"], graine=2)
    b += e
    corriges += c

    e, c = jeux.mots_croises("Le vocabulaire de la poésie", [
        ("VERS", "Une ligne de poème"),
        ("STROPHE", "Un groupe de vers séparé du suivant par un blanc"),
        ("RIME", "Le même son à la fin de deux vers"),
        ("ANAPHORE", "Répéter le même mot au début de plusieurs vers"),
        ("APOSTROPHE", "S'adresser directement à quelqu'un ou à quelque chose"),
        ("METAPHORE", "Remplacer une chose par une autre, sans « comme »"),
        ("RECUEIL", "Un livre qui rassemble des poèmes"),
        ("LIMINAIRE", "Le poème placé en ouverture, qui annonce le reste"),
        ("EPIGRAPHE", "La citation mise en tête d'un livre"),
        ("EXIL", "Le fait de vivre loin de son pays"),
        ("VAUTOUR", "L'oiseau qui donne son titre au poème le plus féroce"),
        ("PATRIE", "Le pays où l'on est né"),
    ], graine=109)
    b += e
    corriges += c

    e, c = jeux.qcm("As-tu lu le recueil ?", [
        ("Combien de poèmes compte le recueil ?",
         ["seize", "vingt-six", "trente-six", "quarante"], 1),
        ("En combien de sections sont-ils répartis ?",
         ["trois", "quatre", "six", "huit"], 2),
        ("Quel poète est cité en épigraphe du livre ?",
         ["Senghor", "Césaire", "Baudelaire", "Philombe"], 2),
        ("Quels sont les « deux grands amours » du poète ?",
         ["sa mère et sa patrie", "sa patrie et l'humanité",
          "Dieu et ses parents", "sa patrie et la démocratie"], 1),
        ("Dans « Cameroun, ma patrie », quelle expression revient trois "
         "fois ?", ["« ma patrie »", "« en ton sein »", "« j'aime »",
                    "« mon pays »"], 1),
        ("Que représentent les « vautours » du poème ?",
         ["des oiseaux du Sahel", "des profiteurs qui reviennent",
          "des soldats", "des étrangers"], 1),
        ("Quel événement historique « Démocratie I » évoque-t-il ?",
         ["l'indépendance", "le discours de La Baule",
          "la réunification", "les jeux Olympiques"], 1),
        ("Dans le poème qui donne son titre au recueil, pourquoi le poète "
         "a-t-il quitté son sol natal ?",
         ["par ambition", "par devoir", "par peur", "par amour"], 1),
    ])
    b += e
    corriges += c

    e, c = jeux.vrai_faux("Vrai ou faux en poésie", [
        ("Un poème doit obligatoirement rimer.", False,
         "Le vers libre se passe de la rime. Alima, lui, la garde souvent — "
         "mais pour le plaisir du son, non par obligation."),
        ("Le poète n'aime que son pays.", False,
         "Ses « deux grands amours » sont la patrie **et** l'humanité, "
         "aimée « pour sa variété et sa diversité »."),
        ("Le recueil ne contient que des éloges.", False,
         "La section « Tripe républicaine » contient des poèmes de "
         "dénonciation, dont « Le retour des vautours »."),
        ("Le poème-titre parle de quelqu'un qui est resté au pays.", False,
         "Il parle au contraire de celui qui l'a quitté « par devoir »."),
        ("L'anaphore consiste à répéter un mot à la fin des vers.", False,
         "Au **début** des vers. À la fin, ce serait une épiphore."),
        ("Le Dossier pédagogique compare Alima à Césaire.", True,
         "Il oppose « l'esthétique du morcellement » d'Alima au poème-livre "
         "du *Cahier d'un retour au pays natal*."),
    ])
    b += e
    corriges += c

    e, c = jeux.qui_suis_je("Devine de quel poème je viens", [
        ("Je répète trois fois « en ton sein », et je finis sur un dernier "
         "soupir.", "« Cameroun, ma patrie »"),
        ("Je suis revenu dans vos murs, attiré par la puanteur des corps que "
         "mes feux ont tués.", "« Le retour des vautours »"),
        ("J'étais un mot interdit d'usage, et les graffitis des palissades "
         "m'appellent à la rescousse.", "« Démocratie I »"),
        ("Je suis parti au seuil du soir, par devoir, le visage baigné de "
         "pleurs.", "« L'attachement au sol natal »"),
        ("J'ai deux grands amours : une patrie et une humanité.",
         "« Mes deux grands amours »"),
    ])
    b += e
    corriges += c

    b += jeux.carte_mentale(
        "L'attachement au sol natal", "L'ATTACHEMENT AU SOL NATAL",
        [("La forme", ["26 poèmes, 6 sections", "vers libres, rimes gardées",
                       "l'écriture du morcellement"]),
         ("Les voix", ["le « je » du poète", "le « nous » du citoyen",
                       "la voix qui accuse"]),
         ("Les images", ["le pays est une mère", "le pays est une aimée",
                         "le sang, les veines, les gènes",
                         "les vautours et les rapaces"]),
         ("Les thèmes", ["l'amour du pays", "la démocratie",
                         "l'exil et le retour", "la solidarité universelle"]),
         ("Les figures", ["l'anaphore", "l'apostrophe", "la comparaison",
                          "l'ironie"]),
         ("Mon vers préféré", ["…", "…"])])

    b.append(saut())
    return b, corriges


# ======================================================== 7. Je m'évalue

ORTHO_FAUTIF = (
    "Le vieux poete écrivait chaque matin, assis sous le manguier de sa cour. "
    "Il posait sont cahier sur ces genoux l'encre séchait vite a cause de la "
    "chaleur. Ses voisins le saluait en passant, mais aucun n'osait "
    "l'interompre. On disait qu'il avait chanté son pays pendant cinquante "
    "ans, et que ses vers étaient récité dans les écoles. Pourtant il ne se "
    "prenait pas au serieux. Quand les enfants venaient lui aporter des "
    "mangues, il leur lisait un poeme à voix haute, en frappant le rythme sur "
    "son genou. Il récitait courament, sans faire atention aux fautes. Ils "
    "riait beaucoup, car il exagérait les rimes exprès. Puis il refermait son "
    "cahier. Personne ne savait combien de pages il avait noirci depuis sa "
    "retraite.")

ORTHO_CORRIGE = [
    ["1", "Le vieux **poete**", "Le vieux **poète**", "accent grave manquant",
     "0,5"],
    ["2", "sur ces genoux **_** l'encre", "sur ces genoux **;** l'encre",
     "point-virgule manquant", "0,5"],
    ["3", "au **serieux**", "au **sérieux**", "accent manquant", "0,5"],
    ["4", "un **poeme**", "un **poème**", "accent grave manquant", "0,5"],
    ["5", "l'**interompre**", "l'**interrompre**",
     "orthographe d'usage : deux *r*", "1"],
    ["6", "lui **aporter**", "lui **apporter**",
     "orthographe d'usage : deux *p*", "1"],
    ["7", "Il récitait **courament**", "… **couramment**",
     "orthographe d'usage : deux *m*", "1"],
    ["8", "sans faire **atention**", "sans faire **attention**",
     "orthographe d'usage : deux *t*", "1"],
    ["9", "Ses voisins le **saluait**", "… le **saluaient**",
     "accord sujet-verbe", "2"],
    ["10", "ses vers étaient **récité**", "… étaient **récités**",
     "accord du participe passé avec *être*", "2"],
    ["11", "**Ils riait** beaucoup", "**Ils riaient** beaucoup",
     "accord sujet-verbe", "2"],
    ["12", "combien de pages il avait **noirci**", "… il avait **noircies**",
     "participe passé avec *avoir* : le COD *pages* est placé avant", "2"],
    ["13", "Il posait **sont** cahier", "Il posait **son** cahier",
     "homophone : *son* est un déterminant possessif", "2"],
    ["14", "sur **ces** genoux", "sur **ses** genoux",
     "homophone : *ses* est un possessif — ce sont ses propres genoux", "2"],
    ["15", "**a** cause de la chaleur", "**à** cause de la chaleur",
     "homophone : *à* préposition, *a* verbe avoir", "2"],
]


def partie7():
    b = [h2("7. Je m'évalue — trois épreuves")]
    corriges = []

    b += epreuve_etude_texte(
        "Hymne à la solidarité",
        chapeau="Ce poème n'a pas été étudié en classe : c'est ta lecture "
                "personnelle qui parle. Il ferme le recueil, dans la section "
                "« Hymnes universels ». Le poète, seul et méditant, s'adresse "
                "aux hommes du monde entier.",
        texte=_poeme("Souvent lorsque je savoure en toute quiétude",
                     "Et une fraternelle accolade."),
        source=_ref("Hymne à la solidarité"),
        comprehension=[
            ("Dans quelle situation le poète se trouve-t-il au début du "
             "poème ? Relève les vers.", "2"),
            ("À qui s'adresse-t-il ? Recopie l'apostrophe.", "2"),
            ("Relève l'anaphore de la première partie. Combien de fois "
             "revient-elle, et à quoi le poète songe-t-il ?", "2"),
            ("Quels trois présents envoie-t-il à ses « frères humains » ? "
             "Que symbolise chacun d'eux ?", "2"),
            ("Quel est le sentiment dominant de ce poème ? Justifie par deux "
             "éléments précis.", "2")],
        langue=[
            ("Relève une comparaison et donne les quatre éléments qui la "
             "composent (le comparé, l'outil, le comparant, le point "
             "commun).", "2"),
            ("Les vers ont-ils tous le même nombre de syllabes ? Compte-les "
             "sur cinq vers et nomme le type de vers employé.", "2"),
            ("Relève trois rimes et précise, pour chacune, si elle est "
             "**suivie**, **croisée** ou **embrassée**.", "2"),
            ("« J'envoie auprès de vous en ambassade / La blanche colombe de "
             "ma pensée. » Donne la nature et la fonction de chaque groupe "
             "souligné par ton professeur.", "2"),
            ("Trouve dans le poème trois mots du champ lexical de la paix.",
             "2")])
    corriges += [h3("Épreuve 1 — Étude de texte : éléments de corrigé"),
                 grille([["Question", "Ce qu'on attend", "Pts"],
                         ["I.1", "Il savoure « en toute quiétude / "
                          "L'ineffable bonheur de la solitude » et se plonge "
                          "dans de profondes méditations.", "2"],
                         ["I.2", "« Chers frères humains des quatre coins du "
                          "monde ».", "2"],
                         ["I.3", "« Je songe à… », répétée : il songe à leurs "
                          "climats divers, à leurs cadres de vie, à leurs "
                          "modes de vie. (Accepter le décompte exact de "
                          "l'édition de l'élève.)", "2"],
                         ["I.4", "**Un rameau d'olivier** (la paix), **un "
                          "quartier de noix de kola** (l'hospitalité et "
                          "l'accord, en Afrique de l'Ouest et centrale), "
                          "**une fraternelle accolade** (l'amitié, la "
                          "fraternité).", "2"],
                         ["I.5", "La fraternité universelle : le poète, seul, "
                          "pense au monde entier et lui envoie des signes de "
                          "paix. Toute réponse justifiée par deux éléments est "
                          "acceptée.", "2"],
                         ["II.1", "Ex. : « Tel un pêcheur d'éponges » — "
                          "comparé : *le poète qui se plonge dans ses "
                          "méditations* ; outil : *tel* ; comparant : *un "
                          "pêcheur d'éponges* ; point commun : *plonger "
                          "profondément*.", "2"],
                         ["II.2", "Non : les vers sont de longueurs inégales. "
                          "Ce sont des **vers libres**.", "2"],
                         ["II.3", "Ex. : *quiétude / solitude* (suivies) ; "
                          "*éponges / songe* (embrassées avec les vers "
                          "voisins). Accepter toute analyse exacte du passage "
                          "cité.", "2"],
                         ["II.4", "*J'* : pronom personnel, sujet — *auprès de "
                          "vous* : groupe prépositionnel, complément "
                          "circonstanciel de lieu — *la blanche colombe de ma "
                          "pensée* : groupe nominal, complément d'objet "
                          "direct.", "2"],
                         ["II.5", "*paix, rameau d'olivier, fraternelle, "
                          "accolade, colombe*.", "2"]])]

    b += epreuve_orthographe(ORTHO_FAUTIF,
                             "Texte composé pour l'épreuve", nb_fautes=15)
    corriges += [h3("Épreuve 2 — Correction orthographique : corrigé"),
                 grille([["N°", "Écrit dans le texte", "Correction",
                          "Pourquoi", "Pts"]] + ORTHO_CORRIGE),
                 ("p", "**Total : 20 points.** Retirer **0,5 point** par mot "
                  "correct barré à tort.")]

    b += epreuve_expression([
        {"type": "Poème",
         "contexte": "Ernest Alima consacre vingt-six poèmes à un seul sujet : "
                     "le lieu d'où il vient. Il le fait par l'anaphore, par "
                     "l'image, et par le vers libre.",
         "citation": _poeme("Cameroun, ma patrie, Je suis né en ton sein",
                            "Et pétri dans le moule de tes mains."),
         "source": _ref("Cameroun, ma patrie") + " (premiers vers)",
         "taches": [
             "Écris un **poème en vers libres** de vingt-cinq à trente-cinq "
             "vers sur **le lieu d'où tu viens**.",
             "**Obligatoire :** une anaphore tenue sur au moins trois "
             "mouvements ; **trois images** dont une métaphore ; une "
             "apostrophe (tu t'adresses au lieu lui-même) ; un retournement "
             "introduit par *mais* ; une chute de moins de dix mots.",
             "Tu peux garder les rimes quand elles viennent ; tu n'es pas "
             "obligé de les chercher."],
         "bareme": [["L'anaphore tient le poème d'un bout à l'autre", "4"],
                    ["Les trois images sont présentes et justes", "5"],
                    ["L'apostrophe et le retournement sont bien employés",
                     "3"],
                    ["Le rythme se tient à la lecture à voix haute", "3"],
                    ["Orthographe et présentation en vers", "3"],
                    ["Longueur respectée", "2"]]},
        {"type": "Appel",
         "contexte": "Dans « Appel au travail », le poète s'adresse à ses "
                     "compatriotes et leur demande quelque chose de précis. "
                     "C'est à la fois un poème et un texte injonctif.",
         "citation": _poeme("O Cameroun ! Puissent tes enfants",
                            "De leur solennel engagement !"),
         "source": _ref("Appel au travail") + " (derniers vers)",
         "taches": [
             "Rédige un **appel** de vingt à vingt-cinq lignes, en prose.",
             "Sujet au choix : la propreté de ton établissement · l'entraide "
             "entre élèves · la lecture · la protection d'un lieu de ton "
             "quartier.",
             "**Obligatoire :** un constat que tout le monde partage ; **le "
             "*nous* qui t'inclut** ; au moins quatre consignes à l'impératif, "
             "petites et vérifiables ; un chiffre ou une preuve ; une formule "
             "finale de moins de douze mots."],
         "bareme": [["Le constat est juste et partagé", "3"],
                    ["Les consignes sont précises et réalisables", "5"],
                    ["L'impératif est correctement employé", "3"],
                    ["Le chiffre et la formule finale font leur effet", "3"],
                    ["Orthographe et ponctuation", "4"],
                    ["Présentation et longueur", "2"]]},
    ])
    b.append(saut())
    return b, corriges
