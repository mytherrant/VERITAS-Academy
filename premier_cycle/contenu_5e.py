# -*- coding: utf-8 -*-
"""Le manuel de cinquième : trois œuvres, et ce qui les relie.

*L'Arbre fétiche* · *N'koum-wam, le huitième notable* · *Père inconnu*.

Trois genres différents — quatre nouvelles, une comédie en cinq actes, un
récit à la première personne — et une même question posée trois fois : **qui
décide, et sur quoi se fonde-t-il pour décider ?** Un fonctionnaire décide
d'abattre un arbre ; un chef et sept notables décident d'un huitième ; un
tribunal décide où vivra un enfant. Chaque fois, la décision est prise sur des
apparences, et chaque fois quelqu'un le paie.
"""
import c5_arbre
import c5_arbre_suite
import c5_nkumwam
import c5_nkumwam_suite
import c5_pereinconnu
import c5_pereinconnu_suite
from gabarit import passerelles
from kit import cases, enc, grille, h1, h2, h3, lignes, num, p, puce, saut

OEUVRES = [
    ("L'Arbre fétiche", "Jean Pliya — quatre nouvelles"),
    ("N'koum-wam, le huitième notable",
     "David Massoma Pandong — comédie en cinq actes"),
    ("Père inconnu", "Pabé Mongo — récit"),
]


# ---------------------------------------------------------------- ouverture

def avant_propos():
    return [
        h1("Avant de commencer — ce livre et toi"),
        p("Trois livres cette année, et trois genres différents. C'est fait "
          "exprès : à la fin de l'année, tu sauras lire **une nouvelle**, "
          "**une pièce de théâtre** et **un récit à la première personne**. "
          "Ce sont les trois portes de la littérature. Elles s'ouvrent "
          "toutes les trois en un an."),
        grille([["L'œuvre", "Le genre", "Ce que tu apprends à repérer"],
                ["*L'Arbre fétiche*", "quatre **nouvelles**",
                 "le décor qui annonce l'histoire, les présages, le "
                 "revirement final"],
                ["*N'koum-wam*", "une **comédie** en cinq actes",
                 "la réplique et la didascalie, le rapport de force, le "
                 "dénouement"],
                ["*Père inconnu*", "un **récit à la première personne**",
                 "le point de vue, ce que le narrateur voit sans "
                 "comprendre"]]),
        enc("objectif", "Ce que ce manuel te promet", [
            "**Tu ne liras jamais seul.** Chaque passage est situé, expliqué, "
            "et suivi de questions qui te montrent quoi chercher.",
            "**Tu écriras sur ces pages.** Les pointillés sont pour ton "
            "stylo, les colonnes vides des grilles sont ton travail.",
            "**Tu joueras.** Mots mêlés, mots croisés, QCM, devinettes, "
            "cartes mentales : on retient mieux ce qu'on a cherché.",
            "**Tu discuteras.** Trois débats t'attendent à la fin, et il n'y "
            "a pas de bonne réponse écrite d'avance."]),
        h3("Comment ce manuel est fait"),
        p("Chaque œuvre est étudiée en **sept temps**, toujours les mêmes : "
          "1. j'ouvre le livre · 2. l'auteur et son livre · 3. qui est qui · "
          "4. six **lectures suivies** · 5. j'écris · 6. je joue et je révise "
          "· 7. je m'évalue."),
        enc("astuce", "Les sept panneaux à reconnaître", [
            "🐾 / 🌍 **Le savais-tu ?** — un vrai renseignement sur une bête, "
            "un lieu, une coutume, un objet.",
            "👤 **Qui est qui ?** — pour ne plus confondre les personnages.",
            "📍 **C'est où ?** — la géographie du livre.",
            "😄 **Le coin du rire** — le passage qu'il fallait remarquer.",
            "🔑 **Les mots difficiles** — cinq mots par séance, pas plus.",
            "🎲 **À toi de jouer** — un exercice qui n'en a pas l'air.",
            "⚠ **Attention** — ce qui demande de la prudence."]),
        enc("vigilance", "Une règle absolue", [
            "Tous les textes encadrés en gris et signés d'un nom d'auteur "
            "sont **recopiés mot pour mot**. Pas un mot n'a été changé ; les "
            "coupes sont marquées **[…]**.",
            "Les rares textes écrits pour ce manuel portent la mention "
            "*« Texte composé »*. Tu sauras donc toujours qui parle."]),
        saut()]


# -------------------------------------------------------------- passerelles

def passerelles_5e():
    return passerelles(
        "Passerelles — les trois livres se répondent",
        "Une nouvelle béninoise des années soixante, une comédie camerounaise "
        "de 2024, un récit d'enfance : trois livres qui n'ont, en apparence, "
        "rien à voir. Regarde de plus près. Ils racontent tous les trois la "
        "même chose — **une décision prise sur une apparence** — et ils la "
        "racontent chacun dans une langue différente.",
        tableaux=[
            ("1. Trois fois la même erreur",
             ["L'œuvre", "Qui juge sur l'apparence", "Ce que cela coûte"],
             [["*L'Arbre fétiche*",
               "M. Lanta prend le savoir de Mèhou pour des « contes d'un autre "
               "âge » ; Dossou prend l'iroko pour un adversaire ordinaire.",
               "Un homme meurt sous l'arbre. Et personne ne saura jamais si "
               "c'est le fétiche ou l'orgueil."],
              ["*N'koum-wam*",
               "Sept notables et un chef écartent Kwangué parce qu'il est "
               "jeune et sans travail.",
               "Ils manquent le seul candidat capable de mobiliser tout un "
               "peuple — et ils ont failli tuer celui qui l'avait vu."],
              ["*Père inconnu*",
               "Toute une école décide qu'une enfant vaut moins parce qu'elle "
               "n'a pas de père.",
               "Une petite fille calme, serviable et souriante devient « une "
               "fontaine de larmes », puis une fille renfermée."]]),
            ("2. Trois façons de raconter la même scène",
             ["Le genre", "Comment on montre qu'un personnage est méprisé"],
             [["**La nouvelle** *(Pliya)*",
               "Par la **description** : la culotte loqueteuse de Mensavi, "
               "les pieds enflés de chiques, le pagne usé jusqu'à la trame de "
               "Fiogbé. On voit, et l'on conclut."],
              ["**La comédie** *(Massoma Pandong)*",
               "Par la **réplique et la didascalie** : « un jeune désœuvré, "
               "sans passé et même sans avenir », et les notables qui "
               "répondent en chœur *(approuvant)*. On entend."],
              ["**Le récit à la 1ʳᵉ personne** *(Pabé Mongo)*",
               "Par **l'intérieur** : « Quelle espèce d'enfant étais-je "
               "donc ? » On ne voit ni n'entend : on éprouve."]]),
            ("3. La parole donnée, dans les trois livres",
             ["Qui promet", "À qui", "Tient-il parole ?"],
             [["Le pacte des anciens : nul n'a le droit de toucher à l'iroko",
               "à toute la communauté d'Abomey",
               "**Non.** On a coupé les irokos « pour faire des chaises, des "
               "tables, des portes »."],
              ["Sambo Maya, qui a juré devant Gnama", "à Kwangué et au village",
               "**Oui.** « J'ai donné ma parole et je n'y reviendrai point. » "
               "Même quand il comprend la ruse."],
              ["Le père : « Tu ne me quitteras plus, n'est-ce pas papa ? » — "
               "« Non »", "à sa fille, sur la piste forestière",
               "**Non.** Trois jours plus tard elle est ramenée de force, et "
               "il ne « bouge jamais le petit doigt » pour la garder."]]),
            ("4. Ce que les objets disent des gens",
             ["L'objet", "Dans quelle œuvre", "Ce qu'il dit"],
             [["Un pantalon de tergal, une cravate de soie rouge, des "
               "mocassins à boucles", "*L'Arbre fétiche*",
               "Lanta est présenté par sa garde-robe **avant** d'avoir "
               "parlé : la modernité comme costume."],
              ["Une calebasse de vin de palme entre les jambes, des kolas qui "
               "circulent", "*N'koum-wam*",
               "On délibère en mangeant : le pouvoir, ici, se partage comme "
               "un repas."],
              ["Un cartable qui est « un véritable coffre-fort » : bâtonnets, "
               "ardoise, craie, pain beurré, bonbons, pièces d'argent",
               "*Père inconnu*",
               "L'inventaire du cartable de Frérot dit tout ce que sa sœur "
               "n'a pas."],
              ["Un pagne noir des pieds à la tête", "*N'koum-wam*",
               "Un vêtement qui **cache** : le seul objet du volume dont le "
               "sens soit une énigme jusqu'à la dernière page."]]),
            ("5. Qui décide, et comment",
             ["Qui décide", "Comment", "Résultat"],
             [["M. Lanta, seul", "il tranche d'autorité, « rien ne nous "
               "arrêtera »", "un mort"],
              ["Sambo Maya, après consultation", "il écoute sept avis, puis "
               "cède aux cadeaux et à la peur", "il est joué — et il "
               "reconnaît publiquement son erreur"],
              ["Le tribunal coutumier", "il applique la règle : l'enfant "
               "reconnu va chez son père", "une fratrie coupée en deux, et "
               "une question sans réponse : « Et les filles alors ? »"]]),
            ("6. Trois jeunes qu'on n'a pas regardés",
             ["Le jeune", "Ce qu'on voit de lui", "Ce qu'il est vraiment"],
             [["**Mensavi**", "un voleur de toupie qu'on lapide dans la rue",
               "un enfant qui n'a jamais rien reçu, et qui offrira pourtant un "
               "don à son tour"],
              ["**Kwangué**", "« un jeune désœuvré, sans passé et même sans "
               "avenir »",
               "le seul capable de faire venir tout un peuple — et le futur "
               "« get sense pass all »"],
              ["**la narratrice**", "« l'enfant sans père », la bâtarde de la "
               "cour de récréation",
               "une élève qui lit plus de cent livres en une année de "
               "sixième"]]),
        ],
        debats=[
            ("Débat 1 — Fallait-il abattre l'iroko ?", [
                "**Camp A :** oui. Une ville a besoin de rues droites, "
                "d'écoles, d'un hôpital. On ne bâtit pas un pays autour d'un "
                "arbre.",
                "**Camp B :** non. Cet arbre portait la mémoire d'un roi, il "
                "était presque trois fois centenaire, et il en restait très "
                "peu.",
                "**Question qui complique tout :** pouvait-on faire passer la "
                "rue **à côté** ? Cherchez dans le texte si quelqu'un le "
                "propose. Vous ne trouverez personne.",
                "**Règle du débat :** deux citations exactes par camp. Une "
                "opinion sans citation ne compte pas."]),
            ("Débat 2 — Kwangué a-t-il triché ?", [
                "Il s'est déguisé, il a fait parler un marabout à sa place, il "
                "a offert des chèvres et du vin à ceux qui devaient le juger, "
                "et il leur a fait prêter un serment.",
                "**Camp A :** c'est de la ruse, et elle est légitime : on ne "
                "lui laissait aucune autre porte.",
                "**Camp B :** c'est de la manipulation, et le village entier "
                "s'est humilié pour rien.",
                "**Le texte vous donne un arbitre :** le chef lui-même. "
                "Cherchez ce qu'il conclut, et si vous êtes d'accord avec "
                "lui."]),
            ("Débat 3 — À qui la faute, dans *Père inconnu* ?", [
                "Une enfant grandit sans père, se fait humilier à l'école, "
                "s'installe chez une tante faute de mieux, et sa scolarité "
                "s'arrête.",
                "Quatre accusés possibles : **le père absent**, **la mère "
                "débordée**, **les camarades qui répètent « enfant sans "
                "père »**, **personne — c'était la faute à pas de chance**.",
                "Répartissez-vous les quatre positions. Chacune doit citer le "
                "texte deux fois.",
                "**Et une dernière question, pour tout le monde :** la "
                "narratrice écrit « mon tort comportait une part d'héritage ». "
                "Un malheur peut-il vraiment s'hériter ? Et si oui, où se "
                "coupe la chaîne ?"]),
        ],
        projet=("Le projet du trimestre — le procès de l'iroko", [
            "Vous allez rejouer, en classe, le procès qui n'a jamais eu lieu. "
            "Comptez trois semaines.",
            "**Étape 1.** Répartissez les rôles : M. Lanta et son avocat ; "
            "Mèhou et le sien ; Dossou (mort, il témoigne par une lettre "
            "lue) ; le garde Anatole ; deux prisonniers ; un botaniste ; un "
            "urbaniste ; trois juges. Le reste de la classe est le public — "
            "et il votera.",
            "**Étape 2.** Chaque camp prépare **un plaidoyer écrit** selon les "
            "cinq étapes de l'atelier : annonce → principe partagé → faits "
            "vérifiables → réponse à l'objection → reprise. **Tous les faits "
            "doivent venir du livre**, avec la page.",
            "**Étape 3.** Écrivez le **protocole d'audience** (atelier "
            "injonctif) : qui entre, qui parle, dans quel ordre, à quel "
            "signal, et ce qui est interdit.",
            "**Étape 4.** L'audience se tient. Chacun lit son texte. Les juges "
            "posent trois questions par camp. Le public vote à main levée.",
            "**Étape 5.** Chacun rédige seul, en vingt lignes, **le jugement "
            "qu'il aurait rendu** — et une phrase pour dire s'il a changé "
            "d'avis depuis le début du trimestre.",
            "Ce que ce projet vous apprend n'est pas dans le livre : c'est "
            "qu'**on peut avoir tort en ayant de bons arguments**, et que "
            "l'écrire à l'avance est la seule façon de s'en apercevoir."]))


# ------------------------------------------------------------------- montage

def note_aux_enseignants():
    return [
        h1("Note aux enseignants"),
        p("Ce volume réunit les **trois œuvres au programme de la classe de "
          "cinquième** et propose, pour chacune, un parcours complet en sept "
          "temps. Il est conçu pour être écrit dessus."),
        h3("Le principe qui gouverne le volume"),
        p("**Aucune règle n'est donnée avant son modèle.** Chaque atelier "
          "d'écriture s'ouvre sur un texte rédigé et annoté ❶❷❸, questionne "
          "les étapes de ce modèle, demande à l'élève de formuler la règle "
          "**avant** de la lui donner, puis fait imiter sur un autre sujet."),
        h3("Les sept ateliers d'écriture, répartis sur les trois œuvres"),
        p("Chaque type de production n'est traité **qu'une fois** dans le "
          "volume, dans l'œuvre qui s'y prête le mieux. L'élève est invité à "
          "réinvestir ensuite."),
        grille([["Œuvre", "Ateliers"],
                ["*L'Arbre fétiche*",
                 "**la description** d'un lieu qui annonce l'histoire · "
                 "**la narration** : préparer une fin sans la dire"],
                ["*N'koum-wam*",
                 "**la scène de théâtre** (réplique et didascalie) · "
                 "**le plaidoyer** · **le texte injonctif** (protocole)"],
                ["*Père inconnu*",
                 "**le portrait** vu par un enfant · **la lettre** qui "
                 "demande quelque chose"]]),
        h3("Les lectures suivies"),
        p("Dix-huit séances — six par œuvre — suivant la démarche officielle : "
          "**situation du passage → lecture → grille → confrontation et "
          "bilan**. Chaque extrait dépasse **cinq cents mots** et est "
          "reproduit **verbatim**. Les grilles donnent l'axe **nommé** et "
          "l'outil de langue **fourni** ; seule la colonne des relevés reste "
          "vide."),
        h3("Ce qui reste en lecture personnelle"),
        grille([["Œuvre", "Étudié en classe", "Support d'épreuve"],
                ["*L'Arbre fétiche*",
                 "*L'Arbre fétiche* (4 séances), *Voiture rouge*, *L'homme qui "
                 "avait tout donné*", "*Le gardien de nuit*"],
                ["*N'koum-wam*", "actes I (3 séances), II, III, V",
                 "acte IV"],
                ["*Père inconnu*", "chapitres I à V",
                 "chapitre X"]]),
        enc("vigilance", "⚠ *Père inconnu* : la fin demande une préparation",
            ["Le chapitre XI raconte que la narratrice, à seize ans et en "
             "classe de troisième, se retrouve enceinte, est reniée par sa "
             "mère et échoue à son examen.",
             "**Le manuel n'en propose aucun extrait** et n'en donne à l'élève "
             "qu'un résumé sobre, placé après la sixième séance, adossé à la "
             "dédicace de l'auteur (« les futurs papas, les futures mamans »).",
             "Conduite recommandée : annoncer la fin **avant** que la classe "
             "ne l'atteigne ; présenter l'enchaînement des causes — absence du "
             "père, isolement de la mère, absence d'adulte protecteur — plutôt "
             "qu'une faute individuelle ; signaler qu'un adulte de "
             "l'établissement est disponible pour en parler en particulier.",
             "Ne pas transformer la séance en leçon de morale sur la jeune "
             "fille : le livre ne le fait pas."]),
        enc("astuce", "Deux autres points de vigilance", [
            "*L'Arbre fétiche* : la description du **Tolégba** comporte la "
            "mention d'un phallus de bois. L'extrait retenu la mentionne en "
            "une ligne ; la traiter comme un fait d'ethnographie, sans "
            "détour.",
            "*N'koum-wam* : **ne pas dévoiler le dénouement.** Toute la pièce "
            "repose sur l'identité de l'inconnu voilé. Faire noter aux élèves, "
            "à l'acte III, un pronostic écrit : sa relecture après l'acte V "
            "vaut mieux que toute synthèse."]),
        h3("Les épreuves"),
        p("Trois par œuvre : **étude de texte** (I. Compréhension /10 + "
          "II. Langue /10), **correction orthographique** (15 fautes = "
          "20 points, répartition 0,5 / 1 / 2 / 2), **expression écrite** "
          "(deux sujets au choix, grille de notation fournie). Les trois "
          "supports d'étude de texte n'ont pas été traités en classe : "
          "l'épreuve mesure la lecture réelle de l'œuvre."),
        p("Les trois textes de correction orthographique sont **composés pour "
          "l'épreuve** et étiquetés comme tels : l'élève ayant l'œuvre entre "
          "les mains, un support emprunté au livre lui livrerait la version "
          "correcte à recopier."),
        h3("La progression annuelle proposée"),
        grille([["Période", "Œuvre", "Ce qu'on installe"],
                ["Trimestre 1", "*L'Arbre fétiche*",
                 "la nouvelle, la description, le récit et ses présages"],
                ["Trimestre 2", "*N'koum-wam*",
                 "le théâtre, l'argumentation, le texte injonctif — et le "
                 "projet du procès de l'iroko"],
                ["Trimestre 3", "*Père inconnu*",
                 "le récit à la première personne, le portrait, la lettre, et "
                 "la reprise de tout"]]),
        p("La section **Passerelles** se traite en fin d'année, quand les "
          "trois œuvres sont lues. Ses trois débats constituent une "
          "évaluation orale toute prête ; le projet du trimestre peut être "
          "avancé au deuxième trimestre, après *N'koum-wam*."),
        saut()]


def manuel():
    """Rend (blocs du manuel, blocs des corrigés)."""
    blocs = list(avant_propos())
    corriges = [h1("Corrigés")]

    for titre, mod, mod_suite in [
            ("Œuvre 1 — L'Arbre fétiche", c5_arbre, c5_arbre_suite),
            ("Œuvre 2 — N'koum-wam, le huitième notable",
             c5_nkumwam, c5_nkumwam_suite),
            ("Œuvre 3 — Père inconnu", c5_pereinconnu, c5_pereinconnu_suite)]:
        blocs += mod.partie1() + mod.partie2()
        b3, c3 = mod.partie3()
        blocs += b3 + mod.partie4() + mod_suite.partie5()
        b6, c6 = mod_suite.partie6()
        b7, c7 = mod_suite.partie7()
        blocs += b6 + b7
        corriges += [h2(titre)] + c3 + c6 + c7

    blocs += passerelles_5e()
    blocs += note_aux_enseignants()
    return blocs, corriges
