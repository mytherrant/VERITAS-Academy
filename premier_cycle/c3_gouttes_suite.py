# -*- coding: utf-8 -*-
"""3ᵉ — *Petites gouttes de chant pour créer l'Homme* : écrire, jouer, s'évaluer.

Deux ateliers, et ils ferment le volume. **Le poème engagé**, parce que ce
recueil est la seule œuvre du programme qui montre comment on accuse sans
insulter — par l'anaphore, par le rapprochement, par la chute. **Le texte
argumentatif**, parce que c'est ce qu'on demandera à l'examen, et parce que le
poème XIV en donne la marche complète : ce qu'on dit partout, l'absence de
preuve, l'exemple vécu, la thèse défendue.

Le support d'étude de texte est le poème **IV, « La voix du ventre »** : il
n'a pas été traité en classe, il tient en une page, et il se lit entier.

Le texte de la correction orthographique est **composé** : l'élève a le
recueil entre les mains, et un poème lui donnerait la version correcte à
recopier.
"""
import jeux
import source
from gabarit import (epreuve_etude_texte, epreuve_expression,
                     epreuve_orthographe, production)
from kit import enc, grille, h2, h3, p, saut

CLE = "gouttes"
SRC = ("René Philombe, *Petites gouttes de chant pour créer l'Homme*, "
       "Éditions CLE, Yaoundé")

# Les mêmes bornes qu'à la lecture suivie : un poème ne doit jamais mordre
# sur son voisin, et l'étude critique qui suit le recueil n'est pas de
# Philombe — la citer sous son nom serait une fausse attribution.
BORNES = ["I. L'homme s'est éloigné", "II.- Guerre de religions",
          "III. Chevaux débridés", "IV.- La voix du ventre", "V.- Macabre",
          "VI.- Dénonciation civique", "VII.- Conseil à un maître",
          "VIII.- Et tu danses, homme", "IX.- Le feu",
          "X.- Poème à déclamer sur la lune", "XI.- Mon chemin",
          "XII.- Dix amours de poète", "XIII.- Invitation à la danse",
          "XIV.- Le hibou", "XV.- Les dormeurs",
          "XVI.- L'homme qui te ressemble", "XVII.- Âmes sœurs",
          "XVIII.- Le tam-tam de l'esclave", "XIX.- Petit poème de minuit",
          "XX.- Témoignage", "XXI.- Black", "XXII.- Prière à ma muse",
          "Les Blancs partis", "Étude critique", "Par Simplice Ambiana",
          "I- Au seuil du recueil", "II- Le corps du texte",
          "III- Au cœur du recueil"]


def poeme(debut, fin):
    """Un poème entier, ou une suite de vers bornée par ses deux extrémités."""
    return source.extrait(CLE, debut, arrivee=fin, arret=BORNES)


# ==================================================== 5. Les productions

def partie5():
    b = [h2("5. J'écris — le poème engagé et le texte argumentatif"),
         p("Deux ateliers ici, et ce sont les derniers du volume. Avec les "
           "quatre des œuvres précédentes — la description qui accuse, le "
           "récit au passé, le dialogue argumentatif, l'article de journal — "
           "tu auras couvert tout ce qu'on peut te demander d'écrire cette "
           "année."),
         ("puce", "☐  décrire      ☐  raconter      ☐  faire dialoguer      "
          "☐  informer"),
         ("puce", "☐  écrire un poème engagé      ☐  argumenter d'un bout à "
          "l'autre")]

    b += production(
        "le poème engagé",
        "écrire un poème qui dénonce quelque chose sans insulter personne.",
        modele=(
            "**Le robinet de la cour**\n"
            "❶ Il y a un robinet dans la cour\n"
            "et il ne coule plus.\n"
            "❷ Personne ne l'a dit\n"
            "personne ne l'a écrit\n"
            "personne n'a signé.\n"
            "❸ Nous buvons l'eau du bidon\n"
            "posé contre le mur du portail\n"
            "l'eau tiède où tourne une guêpe\n"
            "et le fond où dort le sable.\n"
            "❹ Et nous rions quand même\n"
            "et nous courons quand même\n"
            "et nous chantons quand même\n"
            "sous ce soleil qui ne demande rien à personne.\n"
            "❺ Le robinet est là.\n"
            "Il suffirait d'une clé."),
        annotations=[
            ["❶ Le fait, nu",
             "Deux vers, un constat, **aucun adjectif**. On ne dit pas que "
             "c'est scandaleux : on dit ce qui est. Philombe ouvre de même : "
             "« Regard louche / bouche hypocrite / oreille bouchée »."],
            ["❷ La première anaphore",
             "*Personne ne…*, trois fois. **On accuse par le vide** : ce "
             "n'est pas quelqu'un qui a mal agi, c'est tout le monde qui n'a "
             "rien fait."],
            ["❸ L'image concrète",
             "La guêpe, le sable au fond du bidon. **Un détail précis vaut "
             "dix adjectifs.** Le lecteur voit, donc il juge."],
            ["❹ La deuxième anaphore, et le rapprochement",
             "*Et nous… quand même*, trois fois — le procédé de « Et tu "
             "danses, homme ». On met la joie à côté du manque, **et le "
             "rapprochement suffit à accuser**."],
            ["❺ La chute",
             "Deux vers, dont le dernier est le plus court. Elle ne conclut "
             "pas, elle ne réclame pas : elle **désigne**. C'est la leçon de "
             "« Dénonciation civique »."]],
        questions=[
            "Relève les deux anaphores du modèle. Combien de vers chacune "
            "tient-elle ? Que se passe-t-il si l'on en supprime une ?",
            "Le poème contient-il un seul mot qui juge (*injuste*, "
            "*scandaleux*, *honteux*) ? Cherche. Comment fait-il alors pour "
            "que le lecteur soit en colère ?",
            "Recopie le mouvement ❸. Combien d'objets y sont nommés ? "
            "Remplace-les par « de l'eau sale » et relis : qu'as-tu perdu ?",
            "Le mouvement ❹ dit trois choses gaies. Pourquoi est-ce le "
            "passage le plus dur du poème ?",
            "Compte les mots du dernier vers. Compare avec le dernier vers "
            "de « L'homme qui te ressemble » et celui de « Dénonciation "
            "civique ». Que remarques-tu ?"],
        regle=[
            "Un **poème engagé** ne crie pas : il **montre**, et il laisse "
            "conclure. Un poème qui insulte se referme sur celui qui "
            "l'écrit ; un poème qui montre ouvre la tête de celui qui lit.",
            "Sa charpente est l'**anaphore** — le même mot ou le même groupe "
            "de mots en tête de plusieurs vers. Elle fait dans le poème ce "
            "que fait le tam-tam : elle frappe toujours au même endroit.",
            "Son arme est le **rapprochement** : place deux choses côte à "
            "côte — la danse et le malheur, le rire et le bidon d'eau — et "
            "ne commente pas. C'est le lecteur qui accuse.",
            "**Interdits :** les adjectifs qui jugent à ta place, les "
            "insultes, et le nom d'une personne réelle. Un poème qui vise "
            "quelqu'un n'est plus un poème, c'est une querelle.",
            "**La chute est courte.** Le dernier vers doit être le plus "
            "bref, et il doit retourner ce qui précède ou le désigner d'un "
            "mot. Relis la fin de « Dénonciation civique » : un seul mot "
            "change tout le poème."],
        exercices=[
            "**Trouve les images.** Complète sans employer deux fois le même "
            "domaine (animal, machine, corps, nourriture) : *La salle de "
            "classe à quatorze heures est comme…* · *Le silence après la "
            "cloche ressemble à…* · *La file d'attente devant le bureau "
            "fait penser à…*",
            "**Fabrique une anaphore.** Choisis un début de vers — *Personne "
            "n'a…*, *Et nous… quand même*, *Ouvre-moi*, *Il y a* — et écris "
            "six vers qui commencent tous par lui.",
            "**Écris seul.** Un poème de vingt à trente vers libres sur "
            "**quelque chose qui ne va pas et dont personne ne parle** : "
            "dans ton quartier, dans ton établissement, sur la route que tu "
            "prends. Obligatoire : deux anaphores ; trois détails précis et "
            "concrets ; un rapprochement qui accuse sans un mot de "
            "jugement ; une chute de moins de huit mots.",
            "**Dis-le debout.** Lis ton poème à la classe, sans t'excuser et "
            "sans expliquer. Si tu dois expliquer, c'est que le poème n'est "
            "pas fini."],
        astuce=("Le test des trois lectures", [
            "**Première lecture, à voix haute, seul.** Si tu butes deux fois "
            "au même vers, coupe-le : il est trop long.",
            "**Deuxième lecture, devant quelqu'un qui ne connaît pas le "
            "sujet.** Demande-lui de raconter ce qu'il a compris. S'il "
            "raconte autre chose, c'est ton poème qu'il faut reprendre, pas "
            "son oreille.",
            "**Troisième lecture, un jour plus tard.** Un poème qui plaît "
            "encore le lendemain est bon. Un poème qui ne plaît que le soir "
            "où on l'a écrit était de l'humeur, pas de l'écriture."]))

    b += production(
        "le texte argumentatif",
        "défendre une opinion en cinq temps, en tenant compte de ce que "
        "pensent ceux qui ne sont pas d'accord.",
        modele=(
            "❶ Chez nous, on répète volontiers qu'un élève qui lit beaucoup "
            "finit par se détacher des siens. Je l'ai entendu dire cent "
            "fois, et jamais par la même personne.\n"
            "❷ On l'affirme, mais nul ne le prouve. Demandez qui l'a vu : on "
            "vous parlera d'un cousin, ou du fils d'un voisin. Le cousin n'a "
            "jamais de nom, et le voisin n'habite jamais la maison d'à "
            "côté.\n"
            "❸ Or j'ai vu le contraire. Mon oncle Étienne lisait tout ce qui "
            "lui tombait sous la main, jusqu'aux notices des boîtes de "
            "médicaments. C'est lui qui, le samedi, lisait à voix haute les "
            "ordonnances de l'hôpital pour les vieilles du quartier, et qui "
            "leur expliquait combien de comprimés, et à quelle heure. "
            "Personne n'a jamais dit qu'il s'était détaché de nous.\n"
            "❹ Je soutiens donc que la lecture ne sépare pas de sa famille : "
            "elle donne au contraire de quoi lui être utile. Celui qui lit "
            "comprend un formulaire, une convocation, un contrat — et ceux "
            "qui l'entourent en profitent avant lui.\n"
            "❺ On m'objectera que certains partent et ne reviennent jamais. "
            "C'est vrai, et je ne le nie pas. Mais ceux-là ne sont pas "
            "partis à cause des livres : ils sont partis parce qu'il n'y "
            "avait pas de travail, et un homme sans travail s'en va, qu'il "
            "lise ou non.\n"
            "❻ Ce n'est donc pas la lecture qu'il faut surveiller. C'est ce "
            "qui attend, ici, celui qui a lu."),
        annotations=[
            ["❶ La thèse adverse, énoncée honnêtement",
             "On commence par **ce que pensent les autres**, sans se moquer. "
             "Un devoir qui ouvre sur son propre avis n'a personne à "
             "convaincre : ceux qui étaient d'accord le sont déjà."],
            ["❷ L'absence de preuve",
             "On ne dit pas « c'est faux » : on montre que **rien ne "
             "l'appuie**. Le cousin sans nom fait plus de travail que dix "
             "arguments. C'est exactement la marche du poème « Le hibou » : "
             "« Rares sont ceux qui… », et personne n'explique."],
            ["❸ L'exemple vécu, daté et nommé",
             "**Un exemple précis** — un prénom, un jour de la semaine, un "
             "lieu. Un exemple flou ne prouve rien ; l'oncle Étienne, si."],
            ["❹ La thèse défendue",
             "Elle n'arrive qu'ici, **en quatrième position**, et elle est "
             "annoncée par *je soutiens donc que*. Puis un argument qui "
             "l'appuie."],
            ["❺ L'objection, et sa réfutation",
             "On donne à l'adversaire son meilleur argument (*c'est vrai, et "
             "je ne le nie pas*), puis on montre qu'il **ne prouve pas ce "
             "qu'il croit prouver**. C'est le passage qui rapporte le plus "
             "de points, et celui que la plupart des candidats oublient."],
            ["❻ La conclusion, qui déplace la question",
             "Deux phrases. Elle ne répète pas la thèse : elle **désigne "
             "l'endroit où il faut regarder**."]],
        questions=[
            "Dans quel ordre apparaissent la thèse adverse et la thèse de "
            "l'auteur ? Pourquoi ne pas commencer par la sienne ?",
            "Relève les connecteurs logiques du texte (*mais*, *or*, "
            "*donc*, *parce que*…). Quel est le rôle de chacun ?",
            "Le mouvement ❸ contient six détails précis. Relève-les. "
            "Remplace-les par « mon oncle lisait beaucoup » et relis : que "
            "reste-t-il de la preuve ?",
            "Recopie la première phrase du mouvement ❺. Pourquoi l'auteur "
            "donne-t-il raison à son adversaire avant de lui répondre ?",
            "Compare la marche de ce texte à celle du poème XIV, « Le "
            "hibou ». Fais un tableau à deux colonnes : les étapes du poème, "
            "les étapes du devoir."],
        regle=[
            "Un **texte argumentatif** défend une opinion. Sa marche, celle "
            "qu'on attend à l'examen : **thèse adverse → absence de preuve → "
            "exemple précis → thèse défendue et argumentée → objection "
            "réfutée → conclusion**.",
            "**L'exemple porte tout.** Il doit être daté, situé, nommé. « Les "
            "gens disent » ne prouve rien ; « mon oncle Étienne, le samedi, "
            "à l'hôpital » prouve.",
            "**L'objection n'est pas une faiblesse, c'est une force.** Un "
            "candidat qui n'envisage jamais qu'on puisse penser autrement "
            "n'argumente pas : il récite.",
            "Les **connecteurs** sont les rails du raisonnement : *d'abord, "
            "or, mais, en effet, donc, certes… cependant*. Un devoir sans "
            "connecteurs est une pile de phrases.",
            "**On n'attaque jamais la personne, seulement l'idée.** *Ceux "
            "qui pensent cela se trompent* est une insulte déguisée ; *cette "
            "idée ne s'appuie sur rien* est un argument."],
        exercices=[
            "**Range dans l'ordre.** Voici six phrases dans le désordre : "
            "*Je soutiens donc que… · On dit souvent que… · Mais personne ne "
            "l'a jamais vérifié. · Certes, il arrive que… · L'an dernier, "
            "dans ma classe… · Ce n'est donc pas là qu'est le problème.* "
            "Numérote-les de 1 à 6 et justifie ton ordre en deux lignes.",
            "**Trouve l'objection.** Pour chacune de ces thèses, écris "
            "l'objection la plus forte qu'on pourrait t'opposer, puis "
            "réfute-la en trois lignes : *Le téléphone portable devrait être "
            "interdit au collège.* · *Il faut apprendre des poèmes par "
            "cœur.* · *Chaque élève devrait balayer sa classe.*",
            "**Remplace le flou par du précis.** Réécris ces phrases en "
            "leur donnant un nom, une date et un lieu : *Beaucoup de jeunes "
            "réussissent grâce à la lecture. · On a vu des gens changer "
            "d'avis. · Certains professeurs le font déjà.*",
            "**Écris seul.** Un texte argumentatif de vingt-cinq à trente "
            "lignes sur un sujet de ton choix parmi : *Faut-il apprendre un "
            "poème par cœur ? · Un jeune doit-il obéir sans discuter à un "
            "aîné ? · La ville offre-t-elle vraiment plus que le village ?* "
            "Les six étapes sont obligatoires, l'exemple doit être précis, "
            "et l'objection doit être vraie — pas une objection de paille "
            "qu'on renverse d'un doigt."])

    b.append(saut())
    return b


# ================================================ 6. Je joue et je révise

def partie6():
    b = [h2("6. Je joue et je révise"), p("Recueil fermé.")]
    corriges = []

    e, c = jeux.mots_meles("Les mots du recueil", [
        "Philombe", "Yaounde", "recueil", "poeme", "vers", "strophe",
        "anaphore", "refrain", "chute", "sonnet", "synesthesie", "image",
        "hibou", "dormeurs", "esclave", "tamtam", "aurore", "porte",
        "ventre", "muse", "terroriste", "danse", "augure", "famelique",
        "holocauste"], graine=353)
    b += e
    corriges += c

    e, c = jeux.mots_croises("Le vocabulaire du poème", [
        ("ANAPHORE", "Répéter le même mot au début de plusieurs vers"),
        ("VERS", "Une ligne de poème — on ne dit pas « une phrase »"),
        ("STROPHE", "Un groupe de vers séparé du suivant par un blanc"),
        ("SONNET", "Quatorze vers, deux quatrains et deux tercets : la forme "
                   "du poème XIV"),
        ("CHUTE", "Le dernier vers qui retourne tout ce qui précède"),
        ("REFRAIN", "Le vers qui revient, comme un tam-tam qui frappe au "
                    "même endroit"),
        ("SYNESTHESIE", "Mélanger deux sens dans une image : « aux rythmes "
                        "rouges des râles »"),
        ("RECUEIL", "Un livre qui rassemble des poèmes dans un ordre choisi"),
        ("NICTITANT", "Qui cligne — l'œil des étoiles, au poème I"),
        ("FAMELIQUE", "Affamé, maigre de faim"),
        ("AUGURE", "Un présage ; le hibou passe pour l'oiseau des plus "
                   "funestes"),
        ("MUSE", "Celle que le poète prie au dernier poème du recueil"),
    ], graine=137)
    b += e
    corriges += c

    e, c = jeux.qcm("As-tu vraiment lu le recueil ?", [
        ("Combien de poèmes numérotés le recueil contient-il ?",
         ["douze", "dix-huit", "vingt-deux", "trente"], 2),
        ("En quels chiffres sont-ils numérotés ?",
         ["en chiffres arabes", "en chiffres romains", "en lettres",
          "ils ne sont pas numérotés"], 1),
        ("Quel vers ouvre et traverse le premier poème ?",
         ["« Ouvre-moi mon frère »",
          "« l'homme s'est éloigné de l'homme »",
          "« Que l'homme est lent à naître »",
          "« Où es-tu homme homme où es-tu »"], 1),
        ("Par quel mot se termine « Dénonciation civique » ?",
         ["peuple", "voleur", "terroriste", "innocent"], 2),
        ("Quel poème est le plus récité de tout le recueil ?",
         ["« Le hibou »", "« Les dormeurs »",
          "« L'homme qui te ressemble »", "« Témoignage »"], 2),
        ("Combien de fois « Ouvre-moi » revient-il dans ce poème ?",
         ["deux fois", "quatre fois", "six fois", "dix fois"], 2),
        ("Quel poème commence en prose avant de devenir un sonnet ?",
         ["« Le feu »", "« Le hibou »", "« Mon chemin »", "« Macabre »"], 1),
        ("Qu'apprend le poète, plus tard, sur le hibou ?",
         ["qu'il porte malheur", "qu'il annonce la pluie",
          "qu'il est un oiseau utile", "qu'il est en voie de disparition"],
         2),
        ("Quel est le premier vers du « Tam-tam de l'esclave » (XVIII) ?",
         ["« Après-hier et avant demain »", "« Nous on dort ici »",
          "« Lève-toi, Homme »", "« Les miens sont là »"], 0),
        ("Dans ce même poème, qui inscrira le nom de l'esclave ?",
         ["le maître", "le tam-tam", "la plume de l'Aurore", "personne"], 2),
        ("Quel titre le poète donne-t-il à son dernier poème ?",
         ["« Témoignage »", "« Prière à ma muse »", "« Black »",
          "« Mon chemin »"], 1),
        ("Que demande le poète à sa muse, dans ce dernier poème ?",
         ["la gloire", "le repos", "l'autre bout du poème",
          "le silence"], 2),
    ])
    b += e
    corriges += c

    e, c = jeux.vrai_faux("Vrai ou faux chez Philombe", [
        ("Tous les poèmes du recueil sont en vers libres.", False,
         "Le poème XIV, « Le hibou », se termine par un **sonnet** rimé — la "
         "forme la plus rangée qui soit, employée juste au moment où le "
         "poème donne une leçon de sagesse."),
        ("Dans « L'homme qui te ressemble », on apprend à la fin si la porte "
         "s'est ouverte.", False,
         "On ne le saura jamais. Le poème s'arrête sur *l'homme qui te "
         "ressemble* : la réponse est laissée à celui qui lit."),
        ("« Dénonciation civique » se moque de son propre titre.", True,
         "*Civique* est un mot noble ; collé à *dénonciation*, il sonne "
         "faux. Le titre est une arme, et le dernier vers l'explique."),
        ("Le poème « Et tu danses, homme » est un poème de fête.", False,
         "La danse y est placée à côté du malheur, sans un mot de "
         "jugement — et le rapprochement suffit à accuser."),
        ("Dans « Le tam-tam de l'esclave », le même vers revient toujours "
         "écrit de la même façon.", True,
         "Il revient trois fois — mais **la majuscule de la Nuit tombe en "
         "route**. Le vers est le même, son poids ne l'est plus."),
        ("L'anaphore consiste à répéter un mot à la fin des vers.", False,
         "Au **début** des vers. À la fin, ce serait une épiphore."),
        ("Le recueil ne contient que des poèmes de colère.", False,
         "« Dix amours de poète » énumère ce que le poète aime ; « Prière à "
         "ma muse » ferme le livre sur un souhait. La colère n'est qu'un des "
         "tons."),
        ("Le titre du recueil promet de détruire quelque chose.", False,
         "Il promet de **créer** : *pour créer l'Homme*. C'est un programme "
         "de construction, et le premier poème dit pourquoi il est "
         "nécessaire."),
    ])
    b += e
    corriges += c

    e, c = jeux.texte_a_trous(
        "Ce que dit le recueil",
        ["Le recueil de René Philombe rassemble vingt-deux poèmes numérotés "
         "en chiffres ……(1)…… . Il s'ouvre sur un constat : « l'homme s'est "
         "……(2)…… de l'homme ». Le poète ne crie pas ; il répète. Cette "
         "répétition d'un mot en tête de plusieurs vers s'appelle une "
         "……(3)…… , et c'est l'outil qui tient presque tous ces poèmes "
         "debout.",
         "Il accuse rarement en face. Dans « Et tu danses, homme », il place "
         "la danse à côté du malheur : le ……(4)…… suffit. Dans "
         "« Dénonciation civique », tout bascule au dernier vers, sur le mot "
         "*terroriste* — c'est ce qu'on appelle une ……(5)…… .",
         "Deux poèmes s'écartent du reste. « Le ……(6)…… » commence en prose, "
         "raconte un souvenir d'enfance, puis se termine par un ……(7)…… de "
         "quatorze vers. Et « L'homme qui te ressemble », le plus récité de "
         "tous, répète six fois « ……(8)…… » sans qu'on sache jamais si l'on "
         "a ouvert.",
         "Le recueil se referme sur une prière : le poète demande à sa "
         "……(9)…… l'autre bout du poème, pour offrir « une pépite à chaque "
         "……(10)…… de la terre »."],
        ["romains", "éloigné", "anaphore", "rapprochement", "chute", "hibou",
         "sonnet", "Ouvre-moi", "muse", "homme"], graine=61)
    b += e
    corriges += c

    e, c = jeux.qui_suis_je("Devine de quel poème je viens", [
        ("Je commence par trois organes qui fonctionnent mal, et mon vers "
         "revient cinq fois.", "« L'homme s'est éloigné de l'homme » "
         "(poème I)"),
        ("Je décris un homme minuscule pendant quinze vers, et je le "
         "démolis au dernier mot.", "« Dénonciation civique » (poème VI)"),
        ("Je cherche quelqu'un dans le noir, et pendant ce temps-là tu "
         "danses.", "« Et tu danses, homme » (poème VIII)"),
        ("On m'a brûlé vif sur la foi d'une rumeur, et l'école a fini par "
         "dire que j'étais utile.", "« Le hibou » (poème XIV)"),
        ("Je frappe, j'énumère tout ce qui nous sépare, et je finis par te "
         "ressembler.", "« L'homme qui te ressemble » (poème XVI)"),
        ("Je suis coincé entre après-hier et avant demain, et l'Aurore "
         "écrira mon nom.", "« Le tam-tam de l'esclave » (poème XVIII)"),
        ("Je dors ici, à mi-chemin de la source, et je trouve qu'il fait bon "
         "vivre.", "« Les dormeurs » (poème XV)"),
        ("Je suis à table, portes closes, et derrière les portes de ma "
         "conscience un peuple braille de faim.",
         "« La voix du ventre » (poème IV)"),
    ])
    b += e
    corriges += c

    b += jeux.carte_mentale(
        "Petites gouttes de chant", "PETITES GOUTTES DE CHANT",
        [("LA FORME", ["22 poèmes en chiffres romains",
                       "vers libres : ni rime ni compte fixe",
                       "presque pas de ponctuation",
                       "une exception : le sonnet du « Hibou »"]),
         ("LES OUTILS", ["l'anaphore, la colonne vertébrale",
                         "le vers-refrain, qui frappe au même endroit",
                         "la chute, qui retourne tout",
                         "la synesthésie : « rythmes rouges des râles »"]),
         ("LES FIGURES", ["l'Homme, avec sa majuscule",
                          "le ventre : la faim et l'avidité",
                          "l'esclave, un œil dangereusement ouvert",
                          "la porte qu'on n'ouvre pas"]),
         ("LES THÈMES", ["l'homme éloigné de l'homme",
                         "l'injustice qu'on regarde sans rien dire",
                         "le racisme et la fraternité",
                         "l'espoir : créer l'Homme"]),
         ("CE QUE J'EN RETIENS", ["accuser, c'est rapprocher deux choses",
                                  "ce qui se retient est ce qui se répète",
                                  "une majuscule qui tombe change un vers"]),
         ("MON POÈME PRÉFÉRÉ", ["…", "…", "…"])])

    b.append(saut())
    return b, corriges


# ============================================== 7. Les épreuves de l'examen

ORTHO_FAUTIF = (
    "Le maitre avait demandé à chaque eleve d'aprendre un poeme par cœur. "
    "Les enfants s'était installés sous le manguier de la cour, leur cahier "
    "ouvert sur les genoux. Certains remuaient les lèvres sans faire de "
    "bruit d'autres récitaient à voix haute pour s'entendre. Awa répétait "
    "toujours le même vers, et sa voisine finit par le savoir mieux "
    "qu'elle. Vers dix heures, l'enseignant les apella un par un. Il ne "
    "corrigeait pas la prononciation ; il écoutait le rithme. « Un texte "
    "qu'on dit trop vite, disait-il, n'est pas un chant : c'est une "
    "liste. » Les élèves attendaient leur tour, silencieux et attentif. Awa "
    "récita son texte sans une hésitation, et la classe l'applaudit "
    "longtemp. Elle "
    "avoua ensuite qu'elle l'avait travailler pendant trois soirs, a la "
    "lueur d'une lampe-tempête. La poésie qu'elle avait choisi était la "
    "plus longue du livre. Son frère, lui, avait tout oublié : il resta "
    "debout, muet, et ne sut que sourire. L'enseignant ne le gronda pas. Il "
    "lui rendit sont cahier et lui dit de revenir le lendemain. Ces "
    "camarades ne se moquèrent pas.")

ORTHO_CORRIGE = [
    ["1", "Le **maitre** avait demandé", "Le **maître** avait demandé",
     "accent circonflexe manquant", "0,5"],
    ["2", "à chaque **eleve**", "à chaque **élève**",
     "deux accents manquants (aigu, puis grave)", "0,5"],
    ["3", "un **poeme** par cœur", "un **poème** par cœur",
     "accent grave manquant", "0,5"],
    ["4", "sans faire de bruit **_** d'autres", "sans faire de bruit **;** "
     "d'autres", "point-virgule manquant : deux phrases se touchent", "0,5"],
    ["5", "d'**aprendre**", "d'**apprendre**",
     "orthographe d'usage : deux *p*", "1"],
    ["6", "l'enseignant les **apella**", "l'enseignant les **appela**",
     "orthographe d'usage : deux *p* et un seul *l*", "1"],
    ["7", "il écoutait le **rithme**", "il écoutait le **rythme**",
     "orthographe d'usage : *y* et non *i*", "1"],
    ["8", "la classe l'applaudit **longtemp**",
     "la classe l'applaudit **longtemps**",
     "orthographe d'usage : *longtemps* prend un *s*", "1"],
    ["9", "Les enfants **s'était** installés",
     "Les enfants **s'étaient** installés",
     "accord sujet-verbe : le sujet est au pluriel", "2"],
    ["10", "silencieux et **attentif**", "silencieux et **attentifs**",
     "accord de l'adjectif avec *les élèves*", "2"],
    ["11", "qu'elle l'avait **travailler**", "qu'elle l'avait **travaillé**",
     "après l'auxiliaire, le participe passé en *-é*, jamais l'infinitif",
     "2"],
    ["12", "La poésie qu'elle avait **choisi**",
     "La poésie qu'elle avait **choisie**",
     "participe passé avec *avoir* : le COD *que* (la poésie) est placé "
     "avant", "2"],
    ["13", "**a** la lueur d'une lampe-tempête",
     "**à** la lueur d'une lampe-tempête",
     "homophones : *à* préposition / *a* verbe *avoir*", "2"],
    ["14", "Il lui rendit **sont** cahier", "Il lui rendit **son** cahier",
     "homophones : *son* déterminant / *sont* verbe *être*", "2"],
    ["15", "**Ces** camarades ne se moquèrent pas",
     "**Ses** camarades ne se moquèrent pas",
     "homophones : *ses* possessif — ce sont les camarades du frère", "2"],
]


def partie7():
    b = [h2("7. Je m'évalue — au format de l'examen")]
    corriges = [h2("Petites gouttes de chant — corrigés des épreuves")]

    b += epreuve_etude_texte(
        "La voix du ventre",
        chapeau="Ce poème n'a pas été étudié en classe : c'est ta lecture "
                "personnelle qui parle. C'est le quatrième du recueil. Un "
                "homme est à table avec les siens, portes fermées, et il "
                "entend quelque chose. Lis-le deux fois à voix haute avant "
                "de répondre.",
        texte=poeme("Les miens sont là",
                    "derrière les portes de ma conscience."),
        source=SRC + ", poème IV (poème entier)",
        comprehension=[
            ("Où se trouve celui qui parle, et avec qui ? Relève les vers "
             "qui le disent.", "2"),
            ("Relève les deux vers qui reviennent à l'identique. Où sont-ils "
             "placés ? Comment s'appelle ce procédé ?", "2"),
            ("Que se passe-t-il « derrière les portes de ma conscience » ? "
             "Explique l'expression avec tes propres mots : de quelles "
             "portes s'agit-il ?", "2"),
            ("Relève deux mots ou groupes de mots qui disent l'abondance, et "
             "deux qui disent la faim. Que produit leur voisinage ?", "2"),
            ("Le poète est-il fier de lui à la fin du poème ? Recopie le "
             "vers qui te permet de répondre.", "2")],
        langue=[
            ("« un peuple de gosiers faméliques » : nomme la figure de style "
             "et explique-la. Que voit-on à la place des hommes ?", "2"),
            ("Relève trois adjectifs qualificatifs et donne, pour chacun, le "
             "nom qu'il qualifie.", "2"),
            ("Les vers riment-ils ? Comptent-ils le même nombre de "
             "syllabes ? Compte cinq vers et nomme le type de vers employé.",
             "2"),
            ("« Hélas ! Que je me sens malheureux et vil » : donne la nature "
             "et la fonction de *malheureux*. À quel type de phrase cette "
             "ligne appartient-elle ?", "2"),
            ("Relève les deux mots que le poème répète pour dire le froid et "
             "la nuit. Quel effet cette reprise produit-elle ?", "2")])
    corriges += [
        h3("Épreuve 1 — Étude de texte : éléments de corrigé"),
        grille([["N°", "Réponse attendue", "Pts"],
                ["I.1", "Il est chez lui, à table, avec sa famille : « Les "
                 "miens sont là / et moi avec eux / autour de cette table "
                 "chargée de victuailles ». Accepter la reprise du vers "
                 "« et les miens avec moi ».", "2"],
                ["I.2", "« toutes portes closes » (deux fois) et « derrière "
                 "les portes de ma conscience » (deux fois, dont le dernier "
                 "vers). Ils ouvrent le premier et le troisième mouvement, "
                 "et referment le poème : c'est une **anaphore**, doublée "
                 "d'un retour final.", "2"],
                ["I.3", "Ce ne sont pas des portes de bois : ce sont celles "
                 "que l'homme ferme **en lui-même** pour ne pas entendre. "
                 "Le poème passe d'une porte réelle (« toutes portes "
                 "closes ») à une porte intérieure, et c'est tout son "
                 "mouvement.", "2"],
                ["I.4", "Abondance : *table chargée de victuailles*, "
                 "*parfums délicieux de la soupe fumante*, *le ventre gonflé "
                 "de béatitudes*, *l'opulence*. Faim : *gosiers faméliques*, "
                 "*braille*, *de faim*. Leur voisinage accuse sans un mot de "
                 "jugement — c'est le procédé du rapprochement.", "2"],
                ["I.5", "Non : « Hélas ! Que je me sens malheureux et vil / "
                 "de me trouver ainsi dans l'opulence ». Le mot **vil** dit "
                 "le mépris qu'il a de lui-même.", "2"],
                ["II.1", "Une **métonymie** (accepter *synecdoque*) : les "
                 "hommes affamés sont désignés par leur seul gosier. On ne "
                 "voit plus des personnes, mais des bouches — la faim les a "
                 "réduits à cela. Accepter aussi la mention de "
                 "l'**hyperbole** dans « un peuple de ».", "2"],
                ["II.2", "Ex. : *noire* (nuit) ; *délicieux* (parfums) ; "
                 "*fumante* (soupe) ; *faméliques* (gosiers) ; *gonflé* "
                 "(ventre) ; *malheureux* et *vil* (je). Deux sur trois "
                 "suffisent pour la note pleine.", "2"],
                ["II.3", "Non et non : aucune rime régulière, et les vers "
                 "vont de deux syllabes (« de faim ») à une douzaine. Ce "
                 "sont des **vers libres**.", "2"],
                ["II.4", "*malheureux* : adjectif qualificatif, **attribut "
                 "du sujet** *je* (verbe d'état *se sentir*). La ligne est "
                 "une **phrase exclamative**, introduite par l'interjection "
                 "*Hélas !*", "2"],
                ["II.5", "*nuit noire* et *froid*, repris presque à "
                 "l'identique aux vers 5-6 puis 10-11. La reprise installe "
                 "le dehors comme une menace permanente — et rend d'autant "
                 "plus confortable, donc d'autant plus coupable, l'intérieur "
                 "où l'on mange.", "2"]])]

    b += epreuve_orthographe(ORTHO_FAUTIF,
                             "Texte composé pour l'épreuve", nb_fautes=15)
    corriges += [h3("Épreuve 2 — Correction orthographique : corrigé"),
                 grille([["N°", "Écrit dans le texte", "Correction",
                          "Pourquoi", "Pts"]] + ORTHO_CORRIGE),
                 ("p", "**Total : 20 points.** Retirer **0,5 point** par mot "
                  "correct barré à tort.")]

    b += epreuve_expression([
        {"type": "Poème engagé",
         "contexte": "Philombe n'écrit pas pour décorer. Dans « Invitation à "
                     "la danse », il s'adresse à l'Homme et lui demande de "
                     "se lever — par l'anaphore, et par l'apostrophe.",
         "citation": poeme("Lève-toi, Homme", "Des dieux mortels"),
         "source": SRC + ", poème XIII (premiers vers)",
         "taches": [
             "Écris un **poème engagé** de vingt à trente vers libres sur "
             "**quelque chose qui ne va pas et dont personne ne parle** : "
             "dans ton quartier, dans ton établissement, sur ton trajet.",
             "**Obligatoire :** deux anaphores, dont une tenue sur au moins "
             "trois vers ; une apostrophe (tu t'adresses à quelqu'un ou à "
             "quelque chose) ; trois détails précis et concrets ; un "
             "rapprochement qui accuse **sans un mot de jugement** ; une "
             "chute de moins de huit mots.",
             "**Interdit :** les adjectifs qui jugent à ta place "
             "(*scandaleux*, *horrible*), les insultes, et le nom d'une "
             "personne réelle."],
         "bareme": [["Les deux anaphores tiennent le poème", "4"],
                    ["Les détails sont précis et concrets", "4"],
                    ["Le rapprochement accuse sans jugement", "4"],
                    ["L'apostrophe et la chute font leur effet", "3"],
                    ["Rythme à la lecture à voix haute et présentation en "
                     "vers", "3"],
                    ["Orthographe et longueur respectée", "2"]]},
        {"type": "Texte argumentatif",
         "contexte": "Au poème XIV, tout un village tient le hibou pour un "
                     "oiseau de malheur, et personne ne l'explique. Des "
                     "années plus tard, l'école apprend au poète que cet "
                     "oiseau rend service. Une croyance très partagée peut "
                     "donc être fausse — et se combattre par un "
                     "raisonnement.",
         "citation": poeme("Rares sont ceux qui, en Afrique noire",
                           "n'étaient pas des écervelés en le croyant."),
         "source": SRC + ", poème XIV (début de la partie en prose)",
         "taches": [
             "Rédige un **texte argumentatif** de vingt-cinq à trente "
             "lignes. Sujet au choix : *Une croyance partagée par tout le "
             "monde peut-elle être fausse ? · Faut-il apprendre des poèmes "
             "par cœur ? · Un jeune doit-il obéir sans discuter à un aîné ?*",
             "**Obligatoire — les six étapes :** la thèse adverse énoncée "
             "honnêtement ; le constat qu'elle n'est pas prouvée ; **un "
             "exemple précis, daté, situé, nommé** ; ta thèse et son "
             "argument ; une objection réelle, puis sa réfutation ; une "
             "conclusion de deux phrases.",
             "**Interdit :** attaquer ceux qui pensent autrement. On "
             "démonte une idée, jamais une personne."],
         "bareme": [["Les six étapes sont identifiables", "5"],
                    ["L'exemple est précis et prouve réellement", "4"],
                    ["L'objection est vraie et bien réfutée", "4"],
                    ["Les connecteurs logiques enchaînent le raisonnement",
                     "2"],
                    ["Orthographe et ponctuation", "3"],
                    ["Présentation et longueur", "2"]]}])

    b.append(saut())
    return b, corriges
