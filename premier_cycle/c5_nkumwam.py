# -*- coding: utf-8 -*-
"""5ᵉ — *N'koum-wam, le huitième notable*, David Massoma Pandong (Afrédit, 2024).

Une **comédie en cinq actes**, chez les Mbo, au village de Kekem. Le chef
Sambo Maya doit remplacer son huitième notable, mort un an plus tôt ; chacun
de ses sept notables parraine un candidat ; le porte-parole en propose un que
tout le monde méprise — et c'est celui-là qui gagnera.

Les renseignements donnés ici sortent du volume : la page de titre, la
préface, la **liste des personnages**, les cinq actes, le glossaire final des
mots mbo. Le nom est orthographié dans le livre **N'koum-wam** : c'est cette
graphie qui est employée ici.
"""
import jeux
import source
from gabarit import cote_enseignant, lecture_suivie, ouvrir
from kit import cases, enc, grille, h1, h2, h3, lignes, num, p, puce, saut

CLE = "nkumwam"
SRC = ("David Massoma Pandong, *N'koum-wam, le huitième notable*, "
       "Afrédit, Yaoundé, 2024")
BORNES = ["Acte I", "Acte II", "Acte III", "Acte IV", "Acte V", "Glossaire",
          "Notes pédagogiques", "Personnages", "Préface"]


def _x(amorce, mots=620):
    voisins = [t for t in BORNES if source.plat(t) not in source.plat(amorce)]
    return source.extrait(CLE, amorce, mots=mots, arret=voisins)


# ============================================================ 1. J'ouvre

def partie1():
    return [h1("Œuvre 2 — N'koum-wam, le huitième notable, "
               "de David Massoma Pandong")] + ouvrir(
        "N'koum-wam, le huitième notable", "David Massoma Pandong",
        questions_couverture=[
            "Le sous-titre annonce **« Comédie en cinq actes »**. Deux mots à "
            "expliquer : que veut dire *comédie* ? et *acte* ?",
            "**Le huitième notable.** S'il y a un huitième, c'est qu'il y en a "
            "sept autres. À ton avis, à quoi sert un notable dans un village ?",
            "Chez toi, qui décide de qui commande ? Le père ? Le plus âgé ? "
            "Une élection ? Un chef ? Écris ce que tu sais.",
            "Ce livre est une pièce de théâtre : il est fait pour être "
            "**joué**. Repère, dans les premières pages, les passages écrits "
            "en italique entre parenthèses. À quoi servent-ils ?"],
        promesses=[
            "Qui sera choisi comme huitième notable : le plus riche, le plus "
            "savant, ou quelqu'un d'autre ?",
            "Le chef décidera-t-il vraiment tout seul ?",
            "Une comédie doit faire rire. De qui va-t-on rire ici ?",
            "Peut-on tromper tout un village ?"],
        journal_exemple=["14/01", "Acte I",
                         "Le chef demande à ses sept notables de proposer "
                         "chacun un candidat",
                         "Pourquoi le huitième notable doit-il épouser une "
                         "princesse ?"])


# ================================================= 2. L'auteur et son livre

def partie2():
    return [
        h2("2. L'auteur et son livre"),
        h3("David Massoma Pandong"),
        p("David Massoma Pandong est un auteur camerounais. Sa pièce paraît "
          "chez **Afrédit**, à Yaoundé, en **2024** — c'est donc une œuvre "
          "toute neuve, écrite de ton vivant."),
        p("La préface du volume explique son choix : l'auteur a retenu le "
          "théâtre parce que, comme le disait Aristote, *« le théâtre répond "
          "chez l'homme au besoin, puis au plaisir d'imiter »*. Et elle "
          "annonce le programme : cette « fresque en cinq actes » fait "
          "redécouvrir *« l'Afrique que nous semblons avoir perdue »*."),
        enc("mot", "Le théâtre : cinq mots à connaître pour toute l'année", [
            "**Une réplique** : ce qu'un personnage dit. Elle est précédée de "
            "son nom.",
            "**Une didascalie** : l'indication écrite en *italique*, souvent "
            "entre parenthèses. Elle dit le décor, les gestes, le ton. **Elle "
            "n'est jamais prononcée sur scène.**",
            "**Un acte** : une grande partie de la pièce. Entre deux actes, le "
            "rideau tombe. Ici, il y en a cinq.",
            "**Une scène** : une subdivision de l'acte. Elle change quand un "
            "personnage entre ou sort.",
            "**Un dénouement** : le moment où tout s'explique. Ici, il "
            "n'arrive qu'à la fin de l'acte V — et il retourne toute la "
            "pièce."]),
        h3("Le pays de la pièce"),
        p("Tout se passe chez les **Mbo**, que le texte appelle aussi les "
          "**Ban bi Ngo Ni Nsongo**. Le village est **Kekem** ; les autres "
          "cités dans la pièce sont **Lelem, Sanzo, Mbouroukou, Njezou, "
          "Mbokambo, Elong, Mouanguel, Nguti, Banguem**. Les voisins riches "
          "s'appellent les **Ba-Njong**."),
        enc("culture", "Le Ngono, une danse qui a fait le tour du monde", [
            "Dans l'acte I, le notable Essoua raconte ce que lui disent les "
            "voyageurs : les Mbo sont connus dans le monde entier **par une "
            "danse**, le **Ngono**.",
            "Et il explique pourquoi : *« un de nos dignes fils a travaillé "
            "les sonorités du Ngono, mélangeant nos instruments à ceux des "
            "Blancs »* — si bien qu'on chante le Ngono partout.",
            "La pièce nomme aussi le **Nkamba**, autre danse populaire, et "
            "l'**Ahôn**, la danse **initiatique** que les notables exécutent "
            "en séance."]),
        h3("Une charge qui ne se transmet pas de père en fils"),
        p("Le chef l'explique lui-même dès la première page, et c'est toute "
          "l'intrigue :"),
        grille([["Les sept notables (Okoum-Samba)", "Le huitième (N'koum-wam)"],
                ["Chacun a une **fonction précise** : danses et culture, "
                 "salubrité, économie, santé et eau potable, règlement des "
                 "conflits, lieux sacrés et coutumes, porte-parole du chef.",
                 "**Aucune fonction particulière** — mais il est le **grand "
                 "conseiller du chef**."],
                ["La charge se transmet **de père en fils**.",
                 "Elle **ne se transmet pas** : le chef choisit lui-même, "
                 "après avoir consulté les sept."],
                ["Ils se marient comme ils veulent.",
                 "Il doit **impérativement épouser une fille de sang "
                 "royal**, choisie par le chef."]]),
        enc("astuce", "Pourquoi cette règle change tout", [
            "Réfléchis une minute. Une charge qui **ne s'hérite pas** est une "
            "porte ouverte : n'importe qui peut y prétendre, même un pauvre, "
            "même un jeune.",
            "Et l'obligation d'épouser une princesse transforme la "
            "nomination en **mariage**.",
            "Retiens ces deux points : ils expliquent, à la fin de la pièce, "
            "pourquoi un jeune homme sans le sou a pu monter une opération "
            "aussi énorme."]),
        h3("Les personnages, tels que le livre les présente"),
        grille([["Qui", "Ce que le livre en dit"],
                ["**Sambo Maya**", "chef du village Kekem"],
                ["**Emambo**", "sa reine"],
                ["**Ebodiam**", "la princesse, fille de Maya et d'Emambo"],
                ["**N'koum Epié**", "le défunt notable N'koum-wam, mort un an "
                 "plus tôt ; c'est sa place qu'il faut remplir"],
                ["**Efon**", "fils du défunt N'koum Epié"],
                ["**Douma**", "le coursier du chef ; c'est lui qui note les "
                 "dons dans un cahier"],
                ["**Ehob-Gnama**", "mystérieux marabout, du village Sanzo"],
                ["**Mbôla**", "aide-marabout, assistant et porte-parole "
                 "d'Ehob-Gnama"]]),
        grille([["Les sept notables", "En charge de", "Leur candidat",
                 "Métier du candidat"],
                ["N'koum Essoua", "danses et activités culturelles", "Eyango",
                 "artiste musicien"],
                ["N'koum Ekango", "salubrité et travaux d'intérêt général",
                 "Edièlè", "grand planteur et grand commerçant"],
                ["N'koum Samè", "questions économiques", "Essouman",
                 "ingénieur agronome"],
                ["N'koum Ngalé", "santé et eau potable", "Ndéma", "médecin"],
                ["N'koum Epanlo", "règlement des conflits", "Etamè",
                 "administrateur civil"],
                ["N'koum Elong", "lieux sacrés et coutumes", "Essokè",
                 "enseignant"],
                ["**N'koum Ekah**", "**porte-parole du chef**", "**Kwangué**",
                 "**jeune désœuvré**"]]),
        enc("rire", "Sept candidats, et un scandale", [
            "Regarde la dernière ligne du tableau. Six notables proposent un "
            "musicien célèbre, un riche planteur, un agronome, un médecin, un "
            "administrateur et un enseignant.",
            "Et **le porte-parole du chef** — celui qui lui est le plus proche, "
            "celui à qui il avait donné « des recommandations toutes "
            "particulières en aparté » — propose **un jeune sans travail**.",
            "Le chef le prendra pour une insulte personnelle. Il fera juger "
            "son porte-parole à l'acte II. Retiens bien ce détail : c'est la "
            "graine de toute la pièce."]),
        saut()]


# =========================================================== 3. Qui est qui

def partie3():
    b = [h2("3. Comment on parle à Kekem"),
         p("Cette pièce ne se lit pas comme un roman : elle **s'entend**. Les "
           "notables ne discutent pas, ils **célèbrent** — avec des cris de "
           "ralliement, des proverbes, des réponses en chœur. Apprends ce "
           "code, et tout devient clair."),
         h3("Le rituel de la parole"),
         grille([["Ce qu'on entend", "Traduction ou sens",
                  "Quand cela se dit"],
                 ["« **Ba nza bon diase ?** »", "« Qui sont ceux-ci "
                  "réunis ? »", "Pour ouvrir la parole devant l'assemblée"],
                 ["« **Okoum-Along !** »", "« Les notables du peuple ! »",
                  "La réponse, criée en chœur"],
                 ["« **A' Sambo** », « **O'koum** »",
                  "*A'* devant un nom marque l'affection et le respect ; son "
                  "pluriel est *O'*", "Chaque fois qu'on s'adresse à "
                  "quelqu'un"],
                 ["« **A iiiiiii !** »", "Cri de ralliement",
                  "Pour les grandes annonces, en courant"],
                 ["« **Parle !** », « **Accouche !** »", "Encouragements de "
                  "l'assemblée", "Entre deux morceaux d'un discours"],
                 ["« **Ainsi soit-il, A'Sambo** »", "Formule d'obéissance",
                  "Quand un serviteur se retire"]]),
         enc("culture", "Le glossaire est dans ton livre — utilise-le", [
             "À la fin du volume, l'auteur a placé un **glossaire** des "
             "« expressions ou mots tirés d'un dialecte ou découlant du "
             "contexte local ».",
             "Prends l'habitude d'y aller **avant** de demander. Trois mots "
             "cherchés par acte, et la pièce devient limpide.",
             "Exemple donné par le livre lui-même : *A'* ajoute « de "
             "l'affection et du respect dans la manière d'appeler quelqu'un » "
             "(A' Sambo) ; son pluriel est *O'* (O'koum)."]),
         enc("perso", "Comment reconnaître les personnages à leur façon de "
             "parler", [
             "**Sambo Maya** est *pédagogique* : il explique, il rappelle, il "
             "prend son temps — et les didascalies le disent (*« toujours "
             "pédagogique »*, *« concluant »*).",
             "**Essoua** est *doctoral* et *dithyrambique* : il fait des "
             "révélations, il ménage ses effets, il oublie exprès l'essentiel "
             "pour se faire réclamer.",
             "**Ekango** raisonne par **proverbes** : « Ce n'est pas le coq "
             "lui-même qui se donne la crête », « une cour dans laquelle le "
             "gazon a jamais eu à pousser ».",
             "**Ekah**, le porte-parole, est *pragmatique* puis *combatif* "
             "puis *triomphant*. Suis-le : la pièce est son histoire autant "
             "que celle de Kwangué."]),
         enc("mot", "Ce qui se mange et se boit en séance", [
             "Les notables siègent **une calebasse de vin de palme entre les "
             "jambes**, et se partagent la **kola** en morceaux qui circulent.",
             "Douma leur apporte des **épis de maïs grillés**, de "
             "l'**essissang-mol** (plat de morelle noire à l'huile de palme) "
             "et des **safous**.",
             "Ce n'est pas du décor : dans cette pièce, **on parle en "
             "mangeant**, et les didascalies notent chaque gorgée. Le rythme "
             "des répliques est celui d'un repas."])]

    e, c = jeux.relier(
        "Chaque notable, son candidat",
        [("N'koum Essoua", "Eyango, l'artiste musicien"),
         ("N'koum Ekango", "Edièlè, le planteur et commerçant"),
         ("N'koum Samè", "Essouman, l'ingénieur agronome"),
         ("N'koum Ngalé", "Ndéma, le médecin"),
         ("N'koum Epanlo", "Etamè, l'administrateur civil"),
         ("N'koum Elong", "Essokè, l'enseignant"),
         ("N'koum Ekah", "Kwangué, le jeune désœuvré")],
        graine=113)
    b += e
    b.append(saut())
    return b, c


# ======================================================= 4. Lectures suivies

def partie4():
    b = [h2("4. Je lis l'œuvre — six lectures suivies"),
         p("Cinq actes, six séances. L'acte IV — la grande cérémonie — est ta "
           "lecture personnelle, et c'est le support de ton épreuve."),
         enc("astuce", "Comment lire une pièce à haute voix", [
             "Répartissez les rôles. Quelqu'un lit **les didascalies** : ce "
             "n'est pas un rôle ingrat, c'est le metteur en scène.",
             "Les réponses en chœur (« Okoum-Along ! », « Parle ! ») se "
             "crient **par toute la classe**. Essayez une fois : vous "
             "comprendrez la pièce mieux qu'avec dix explications."])]

    b += lecture_suivie(
        1, "Le siège vide (acte I, ouverture)",
        situation=[
            "Kekem, un matin de saison sèche, vers neuf heures. Le rideau se "
            "lève sur une clairière de la forêt sacrée : le chef **Sambo "
            "Maya** siège sur un trône en ébène, ses sept notables autour de "
            "lui sur des tabourets de bois.",
            "Il y a exactement un an qu'on a enterré ici même **N'koum "
            "Epié**, le huitième notable. Le siège est resté vide. "
            "Aujourd'hui, il faut le remplir."],
        texte=_x("Mes frères, nies grands Notables"), source=SRC,
        questions=[
            "Depuis combien de temps N'koum Epié est-il mort ? Relève "
            "l'expression exacte du chef.",
            "En quoi le N'koum-wam est-il un notable **spécial** ? Donne les "
            "**deux** raisons que le chef énumère.",
            "Combien de candidats chaque notable peut-il présenter ? Depuis "
            "combien de temps cherchent-ils ?",
            "Contre quoi le chef les a-t-il mis en garde ? Recopie sa phrase.",
            "Dans quel ordre les notables doivent-ils prendre la parole ?",
            "Relève **trois** réponses en chœur des notables. À quoi servent-"
            "elles dans la pièce ?",
            "Relis la première didascalie. Fais la liste de tout ce qu'elle "
            "t'apprend : le lieu, l'heure, la saison, la disposition des "
            "sièges, ce qu'on boit, ce qu'on mange."],
        grille_lecture=[
            ("Que la séance est un rituel",
             "Les appels et les réponses en chœur"),
            ("Que le chef instruit son assemblée",
             "Les didascalies qui le disent *pédagogique*"),
            ("Que la charge est exceptionnelle",
             "Les mots qui insistent (**spécial**, **impérativement**, "
             "**lui-même**)"),
            ("Que le décor est celui d'un lieu sacré",
             "Les éléments de la première didascalie")],
        bilan=[
            "Une pièce de théâtre commence toujours par **poser le "
            "problème**. Ici, il est posé en trois minutes : un siège est "
            "vide, il faut le remplir, et la règle de remplissage est "
            "bizarre.",
            "Remarque l'usage des **didascalies**. La première, très longue, "
            "installe tout le décor ; les suivantes sont minuscules — "
            "*(pédagogique)*, *(concluant)*, *(avec autorité)* — et donnent "
            "le **ton** de chaque réplique. Sans elles, tu lirais un texte ; "
            "avec elles, tu vois un homme.",
            "Retiens surtout la mise en garde du chef contre « toute forme de "
            "légèreté dans les propositions ». Il ne sait pas encore que son "
            "propre porte-parole va lui présenter un chômeur — ni que ce sera "
            "la meilleure idée de sa vie."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Un notable** : un homme important d'un village, membre du "
                "conseil du chef.",
                "**La préséance** : l'ordre dans lequel on passe, selon son "
                "rang.",
                "**Parrainer** : présenter et soutenir quelqu'un.",
                "**Une consultation** : le fait de demander l'avis des autres "
                "avant de décider.",
                "**Impérativement** : obligatoirement, sans exception "
                "possible."])])

    b += lecture_suivie(
        2, "Un candidat qui a donné le Ngono au monde (acte I)",
        situation=[
            "Le premier notable à parler est **Essoua**, en charge des danses "
            "et des activités culturelles. Il commence par entonner un air de "
            "l'**Ahôn**, la danse initiatique, et tout le monde se lève pour "
            "danser — sauf le chef, « scotché sur son siège ».",
            "Puis il plaide. Écoute-le bien : c'est un morceau de "
            "rhétorique — un vrai discours, construit pour convaincre."],
        texte=_x("A'Sambo Maya, O'koum, le peuple Kekem nous regarde"),
        source=SRC,
        questions=[
            "Par quoi Essoua commence-t-il son discours : par son candidat, "
            "ou par autre chose ? Pourquoi ce choix ?",
            "Il dit n'avoir « pas beaucoup voyagé ». Comment retourne-t-il "
            "cette faiblesse en force ?",
            "Quelle question a-t-il posée aux voyageurs ? Quelle réponse "
            "lui ont-ils faite ?",
            "Relève le proverbe du paysan et du billon. Que veut dire Essoua "
            "en le citant ?",
            "Que fait Essoua juste avant de donner le nom de son candidat ? "
            "Relève la didascalie. Quel effet cela produit-il sur "
            "l'assemblée ?",
            "Comment explique-t-il le nom d'Eyango ? Recopie son explication.",
            "Relève tous les noms de villages cités. Combien y en a-t-il ?"],
        grille_lecture=[
            ("Qu'Essoua ménage ses effets",
             "Les didascalies (*prêt à faire une révélation*, *conscient "
             "d'avoir aiguisé la curiosité*)"),
            ("Qu'il flatte l'assemblée avant de demander",
             "Les compliments adressés aux notables et au peuple"),
            ("Qu'il argumente par la fierté collective",
             "Le passage sur le Ngono connu du monde entier"),
            ("Que l'assemblée le pousse à parler",
             "Les répliques d'encouragement et d'impatience")],
        bilan=[
            "Voici comment on plaide, à Kekem comme ailleurs. Essoua ne dit "
            "pas « voici mon candidat ». Il commence par **le peuple** et par "
            "**la fierté du peuple** — le Ngono qu'on chante partout — puis il "
            "arrive à son homme, qui est celui par qui cette fierté existe.",
            "Et il fait durer. Il oublie « l'essentiel » — le nom ! — pour "
            "qu'on le lui réclame. C'est un vieux truc d'orateur, et la "
            "didascalie le dénonce en souriant : *(conscient d'avoir aiguisé "
            "la curiosité de l'assistance)*.",
            "Enfin, remarque l'argument qu'il glisse au chef : avec un "
            "candidat globe-trotter, *« un jour, toi, Sambo Maya, tu montes "
            "dans l'avion ! »* Tout le monde applaudit. **Le premier candidat "
            "a promis un voyage au chef** : la pièce vient de dire, sans un "
            "mot de commentaire, comment ces choses-là se décident."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Doctoral** : sur un ton savant et solennel.",
                "**Dithyrambique** : qui fait des éloges immenses.",
                "**Un mélomane** : quelqu'un qui aime la musique.",
                "**Un billon** : la butte de terre qu'on forme avec la houe "
                "pour semer.",
                "**Un globe-trotter** : quelqu'un qui parcourt le monde."]),
            ("rire", "L'art de se faire supplier", [
                "Compte les fois où l'assemblée doit dire à Essoua : "
                "« Parle ! », « Dis-nous ! », « Accouche ! ».",
                "Chaque fois, il boit une gorgée de vin de palme, se rassoit, "
                "se relève.",
                "Un discours de trois minutes étiré sur trois pages : c'est "
                "exactement cela, une comédie. On rit **de la manière**, pas "
                "du personnage."])])

    b += lecture_suivie(
        3, "Le riche, la magie et la jalousie (acte I)",
        situation=[
            "Deuxième à parler : **N'koum Ekango**, en charge de la salubrité "
            "et des travaux d'intérêt général. Il commence, lui aussi, par un "
            "proverbe — et il le fait deviner à l'assemblée.",
            "Son candidat s'appelle **Edièlè**. C'est le plus riche du "
            "village. Et c'est précisément ce qui va poser problème."],
        texte=_x("Alors, m'appuyant sur ce sage adage"), source=SRC,
        questions=[
            "Quel est le proverbe d'Ekango ? Recopie-le, puis explique "
            "comment il l'applique à Edièlè.",
            "Quel est le lien de parenté entre Edièlè et le défunt N'koum "
            "Epié ? Sois précis.",
            "Fais la liste de tout ce que possède Edièlè. Combien "
            "d'exploitations, de quels types ?",
            "Que lui reprochent « d'aucuns » ? Relève les deux accusations.",
            "Comment Ekango répond-il à ces accusations ? Quel est son "
            "argument principal ?",
            "Selon Ekango, où réside « le secret de la prospérité » ? Recopie "
            "sa phrase.",
            "Qui travaille dans les plantations et magasins d'Edièlè ? "
            "Trouves-tu cela normal ? Discute."],
        grille_lecture=[
            ("Qu'Ekango raisonne par proverbes",
             "Les adages cités et la façon de les faire deviner"),
            ("Qu'il énumère la fortune du candidat",
             "La liste des biens, et les mots du grand nombre"),
            ("Qu'il anticipe les objections",
             "Le passage « Il est certes vrai que d'aucuns prétendent… »"),
            ("Que l'assemblée suit celui qui parle",
             "Les réponses en chœur : *dubitatifs*, puis *approuvant*, puis "
             "*unanimes*")],
        bilan=[
            "Une leçon d'argumentation en trois temps, et tu peux la copier "
            "telle quelle : **(1)** j'énonce un principe que tout le monde "
            "accepte — un proverbe ; **(2)** j'y range mon candidat ; "
            "**(3)** je réponds moi-même à l'objection avant qu'on me la "
            "fasse.",
            "Ce troisième temps est le plus fort. Ekango **cite lui-même** les "
            "rumeurs — la magie, les tontines où l'on mise des humains — puis "
            "les balaie d'un mot : « personne n'a jamais été en mesure de "
            "montrer du doigt la moindre de ses victimes ». Et l'assemblée, "
            "qui était *dubitative*, devient *unanime*.",
            "Regarde bien comment elle vire. Trois répliques en chœur "
            "suffisent : « Vrai ! Mais… » → « Tu as raison ! La jalousie ! » → "
            "« Un bosseur ! » **Une foule change d'avis en trois lignes.** "
            "Toute la pièce va jouer sur cela."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Un adage** : une phrase de sagesse, un proverbe.",
                "**D'aucuns** : certaines personnes (langue soutenue).",
                "**La témérité** : l'audace, le fait d'oser.",
                "**Un comice agropastoral** : un grand concours agricole où "
                "l'on récompense les meilleurs éleveurs et cultivateurs.",
                "**Une tontine** : une caisse où plusieurs personnes cotisent "
                "à tour de rôle."]),
            ("culture", "Ce que la pièce ose dire", [
                "Ekango mentionne, pour les écarter, « les tontines où on mise "
                "tantôt de l'argent, tantôt des humains ».",
                "C'est une rumeur que l'on entend dans beaucoup de villages "
                "sur les gens brusquement enrichis. La pièce ne dit pas "
                "qu'elle est vraie : elle montre **comment on la lance et "
                "comment on l'éteint**.",
                "Et elle donne, par la bouche d'Ekango, la seule réponse "
                "sérieuse : *« le secret de la prospérité réside avant tout "
                "dans le travail acharné et la témérité »*."])])

    b += lecture_suivie(
        4, "Le procès du porte-parole (acte II)",
        situation=[
            "Entre les deux actes, le chef a compris ce qu'avait fait son "
            "porte-parole : **N'koum Ekah** lui a proposé Kwangué, un jeune "
            "sans travail.",
            "Douma, le coursier, apporte les plats — et signale qu'il "
            "enregistre « tous les dons » dans un cahier au fur et à mesure "
            "qu'ils lui parviennent. Note ce détail au passage.",
            "Puis le chef ouvre la séance. Aujourd'hui, on juge un notable."],
        texte=_x("Je pense vous avoir laissé suffisamment de temps"),
        source=SRC,
        questions=[
            "De quoi Ekah est-il accusé ? Recopie les mots exacts du chef.",
            "Pourquoi cette faute est-elle, aux yeux du chef, plus grave "
            "venant d'Ekah que d'un autre ?",
            "Relève les didascalies qui décrivent l'humeur du chef "
            "(*amer*, *accusateur*, *moqueur*, *menaçant*…). Range-les dans "
            "l'ordre : que se passe-t-il dans son cœur au fil de la scène ?",
            "Que fait le chef pendant qu'il attend la réponse des notables ? "
            "Relève la didascalie. Que produit ce détail ?",
            "Comment Elong commence-t-il sa réponse ? Recopie le proverbe du "
            "coq et de la crête, et explique-le.",
            "Le chef a-t-il déjà décidé de la sentence avant d'écouter ? "
            "Justifie par une phrase du texte.",
            "Que penses-tu du fait que les notables se soient concertés « en "
            "l'absence de l'accusé » ?"],
        grille_lecture=[
            ("Que le chef est blessé personnellement",
             "Les mots de l'offense (« qui m'a offensé, que dis-je ? Qui nous "
             "a offensés tous »)"),
            ("Qu'il oriente le jugement",
             "Ce qu'il annonce avant même d'ouvrir les débats"),
            ("Que les notables flattent avant de juger",
             "Les proverbes et les compliments d'Elong"),
            ("Que la comédie perce sous la solennité",
             "Les gestes de table notés par les didascalies")],
        bilan=[
            "Une scène de tribunal, et c'est une scène **comique**. Pourquoi ? "
            "Parce que le juge mange du maïs grillé et crache des noyaux de "
            "safou pendant qu'il menace un homme.",
            "C'est le procédé le plus efficace du théâtre : **faire coexister "
            "le solennel et le trivial**. Le chef prononce des phrases "
            "terribles — « je ne saurais tolérer la moindre complaisance » — "
            "en croquant un épi.",
            "Mais l'auteur dit aussi quelque chose de sérieux. Le chef "
            "annonce la sentence **avant** d'avoir écouté ; les notables se "
            "sont concertés **sans** l'accusé. Ce n'est pas un procès, c'est "
            "une formalité. Souviens-t'en à l'acte V, quand ces mêmes hommes "
            "s'apercevront qu'Ekah avait raison **et** qu'ils ont failli le "
            "tuer pour cela.",
            "Et n'oublie pas le cahier de Douma. **Quelqu'un compte les "
            "cadeaux.** La pièce vient de te donner sa clé, mine de rien."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Désœuvré** : qui n'a pas de travail, qui ne fait rien.",
                "**Réitérer** : répéter, redire.",
                "**Une sentence** : la décision d'un juge, la peine "
                "prononcée.",
                "**La complaisance** : la faiblesse de celui qui ferme les "
                "yeux pour faire plaisir.",
                "**Infortuné** : malheureux, qui n'a pas de chance."]),
            ("rire", "« Tu as fait, A'Sambo ! Tu l'as fait ! »", [
                "Compte les réponses en chœur des notables dans cette scène. "
                "Elles approuvent **tout** ce que dit le chef, y compris "
                "quand il se contredit.",
                "Regarde surtout comment elles suivent son humeur : "
                "*approuvant*, *acquis*, *fiers*, *en soutien*, "
                "*approuvant*…",
                "Sept hommes sages, et pas un qui dise « attendons "
                "d'entendre l'accusé ». C'est très drôle. Et c'est très "
                "gênant, si l'on y réfléchit dix secondes."])])

    b += lecture_suivie(
        5, "Six candidats, et un bon argument de trop (acte III)",
        situation=[
            "Le repas est terminé, Douma débarrasse. Il ne reste à chacun "
            "qu'une calebasse entre les jambes et quelques kolas dans un "
            "panier.",
            "Le chef demande à son porte-parole — celui qu'on jugeait à "
            "l'acte précédent — de faire **la synthèse des candidatures**. "
            "Ekah s'exécute, avec une petite pointe d'amertume."],
        texte=_x("Comme il te plaira, A 'Sambo. Nous avons reçu sept"),
        source=SRC,
        questions=[
            "Combien de candidatures ont été reçues ? Combien le chef en a-t-il "
            "jugées recevables ?",
            "Recopie la présentation de chacun des six candidats, en une ligne "
            "chacune. Lequel te paraît le plus utile au village ? Justifie.",
            "Comment Ekah parle-t-il du septième candidat ? Relève sa phrase. "
            "Que trahit ce ton ?",
            "Comment le chef réagit-il à cette pointe ? Relève sa réponse.",
            "Que propose Epanlo, et pour quelle raison ? Recopie la promesse "
            "faite par Etamè.",
            "Nomme, avec tes mots, le procédé dont il s'agit : soutenir "
            "quelqu'un parce qu'il vous a promis quelque chose.",
            "À ce stade de la pièce, qui va gagner, d'après toi ? Écris ton "
            "pronostic — on le vérifiera à l'acte V."],
        grille_lecture=[
            ("Que chaque candidat est résumé par son utilité",
             "Les formules de présentation d'Ekah"),
            ("Qu'Ekah n'a pas digéré son procès",
             "Ses phrases sur le septième candidat"),
            ("Que le chef veut apaiser",
             "Ses mots sur ce qui divise et ce qui unit"),
            ("Que l'intérêt personnel entre en scène",
             "Le raisonnement d'Epanlo sur le « partenaire stratégique »")],
        bilan=[
            "Cette scène est le sommet de l'ironie de la pièce. On y range six "
            "hommes remarquables — un musicien mondialement connu, un "
            "planteur, un agronome, un médecin, un administrateur, un "
            "enseignant — et l'on écarte d'entrée le seul qui n'a rien.",
            "Puis Epanlo prend la parole, et le ton change. Il ne parle plus "
            "du village : il parle d'un « partenaire stratégique », d'un "
            "« contexte sensible », et surtout d'une promesse — Etamè ferait "
            "de Sambo Maya **le prochain maire de Kekem**, « tant qu'il "
            "vivra ».",
            "Autrement dit : le choix du plus sage est en train de devenir un "
            "**marchandage**. Note-le, car c'est ce qui rendra possible ce qui "
            "va suivre. **Une assemblée qui se laisse acheter avec des "
            "promesses se laissera acheter avec des chèvres.**"],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Une synthèse** : un résumé qui rassemble l'essentiel.",
                "**Recevable** : qu'on accepte d'examiner.",
                "**Recalé** : refusé, écarté.",
                "**Une polémique** : une dispute publique.",
                "**Indéfectible** : qui ne peut pas faiblir, absolument "
                "fidèle."]),
            ("perso", "Le mot que la pièce ne prononce pas", [
                "Epanlo n'emploie jamais les mots *corruption* ni "
                "*clientélisme*. Il dit : « Avons-nous intérêt à fâcher un "
                "partenaire stratégique et allié indéfectible ? »",
                "C'est ainsi que ces choses se disent : dans un langage "
                "irréprochable.",
                "**Exercice de vigilance :** dans la suite de la pièce, "
                "chaque fois qu'un personnage parle d'« intérêt », de "
                "« réalisme » ou de « reconnaissance », demande-toi ce qu'il "
                "aurait dit en langage direct."])])

    b += lecture_suivie(
        6, "Le dénouement : « get sense pass all » (acte V)",
        situation=[
            "L'acte V est celui de l'intronisation. La cour est en fête. Un "
            "inconnu couvert d'un pagne noir des pieds à la tête est assis au "
            "milieu de la cour ; on n'a pas le droit de le découvrir avant que "
            "sa compagne n'arrive — **parole d'Ehob-Gnama**, le marabout de "
            "Sanzo, transmise par son aide Mbôla.",
            "Puis le visage est dévoilé. Et les notables, entre eux, font le "
            "compte de ce qui vient de se passer."],
        texte=_x("Sans oublier que des têtes couronnées ont transporté"),
        source=SRC,
        questions=[
            "Fais la liste de tout ce que les notables énumèrent avec "
            "stupeur : qui a porté quoi, qui a traîné quoi, qui est allé "
            "accueillir qui ?",
            "« Tout ça, parce qu'on craint les ancêtres ! » Que corrige "
            "aussitôt N'koum Samè ? Pourquoi cette correction est-elle "
            "importante ?",
            "Recopie la phrase d'Epanlo sur le contraste entre vénérer les "
            "morts et redouter la mort. Qu'en penses-tu ?",
            "Combien de temps Kwangué a-t-il disparu du village ? Qu'a-t-il "
            "fabriqué pendant ce temps ?",
            "Pourquoi le chef refuse-t-il de revenir sur sa parole ? Donne ses "
            "**deux** raisons.",
            "Recopie la phrase où Sambo Maya reconnaît son erreur. Sur quoi "
            "tous s'étaient-ils trompés ?",
            "Selon le chef, qui gagne à la fin ? Fais la liste : la princesse, "
            "Kwangué, les notables, le village.",
            "Quel surnom le chef donne-t-il à Kwangué ? Dans quelle langue ? "
            "Que signifie-t-il ?"],
        grille_lecture=[
            ("Que le village entier s'est humilié",
             "L'énumération des grandes personnes qui ont porté des charges"),
            ("Que la peur était le vrai moteur",
             "Le passage « on craint les ancêtres / on craint la mort »"),
            ("Que la parole donnée reste sacrée",
             "Les répliques d'Elong et du chef sur le serment"),
            ("Que la sagesse a été mal jugée",
             "Les mots du chef sur les apparences")],
        bilan=[
            "Voilà le **dénouement** : le jeune désœuvré que tout le monde "
            "avait écarté est le nouveau N'koum-wam. Et il ne l'a pas obtenu "
            "par magie — il l'a obtenu par **un plan**.",
            "Reconstituons-le. Kwangué disparaît trois mois. Il revient "
            "invisible, sous un pagne noir, précédé d'un marabout dont "
            "personne n'ose contredire la « parole ». Il apporte assez de "
            "chèvres et de vin pour que le village entier s'en souvienne. Et "
            "il fait prêter un serment à ceux-là même qui l'avaient méprisé.",
            "Ce qu'il a exploité n'est pas la crédulité des ancêtres : c'est "
            "**la peur de la mort**, comme le dit Samè, et le goût des "
            "cadeaux, comme le montre le cahier de Douma. La pièce est une "
            "comédie ; sa leçon n'est pas gaie.",
            "Mais elle finit bien, et magnifiquement. Le chef s'excuse "
            "publiquement auprès d'Ekah — « un visionnaire, qui a risqué la "
            "guillotine pour excès d'avance sur son temps ». Ekah lance la "
            "phrase de la pièce : **« Laissons désormais nos enfants se marier "
            "par amour ! »** Et Kwangué reçoit son nom de notable, en pidgin : "
            "**« get sense pass all »** — il a surpassé tout le monde en "
            "sagesse.",
            "Relis maintenant la fin de l'acte I. Tu comprendras que l'auteur "
            "t'avait prévenu dès la première page : le seul notable dont la "
            "charge **ne s'hérite pas** est aussi le seul qui puisse être "
            "gagné par un pauvre."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Subversif** : qui menace l'ordre établi.",
                "**Abject** : bas, méprisable.",
                "**Un initié** : celui qui a reçu les secrets d'une société "
                "traditionnelle. Elong se dit « le plus grand initié du "
                "Mouankoum, après le chef ».",
                "**Un visionnaire** : celui qui voit juste avant les autres.",
                "**Une têtre couronnée** — le texte dit « des têtes "
                "couronnées » : des personnages importants, des dignitaires."]),
            ("rire", "Le classement des humiliations", [
                "Relis l'énumération, elle est irrésistible : un "
                "administrateur civil, un ingénieur agronome, un médecin et un "
                "grand musicien ont porté **des caisses de vin sur la tête** "
                "« tels de malheureux esclaves ».",
                "Et le sommet : *« tout un maître de conférences a traîné, de "
                "Sanzo à Kekem, la corde du cheval qu'il montait ! »*",
                "Six candidats prestigieux transformés en porteurs par un "
                "chômeur déguisé. Voilà pourquoi cette pièce est une comédie — "
                "et pourquoi elle fait rire même quand on a compris ce qu'elle "
                "dit."])])

    b += cote_enseignant([
        "Six séances : trois sur l'acte I (l'ouverture et deux plaidoiries), "
        "une sur l'acte II, une sur l'acte III, une sur le dénouement de "
        "l'acte V. L'acte IV reste en lecture personnelle et sert de support "
        "d'épreuve.",
        "**Ne pas dévoiler le dénouement.** Toute la pièce repose sur "
        "l'identité de l'inconnu voilé. Faire noter aux élèves, à l'acte III, "
        "leur pronostic écrit : la relecture de ce pronostic, après l'acte V, "
        "vaut mieux que n'importe quelle synthèse.",
        "La pièce se lit à voix haute, rôles distribués, les réponses en "
        "chœur criées par le groupe. Prévoir un élève lecteur de didascalies.",
        "Le glossaire final du volume est un outil de travail : y renvoyer "
        "systématiquement plutôt que de traduire soi-même.",
        "La pièce parle de dons aux décideurs, de tontines et de promesses "
        "électorales. Le débat est légitime en classe et l'auteur l'a voulu ; "
        "le tenir sur les personnages, jamais sur des personnes réelles."])
    b.append(saut())
    return b
