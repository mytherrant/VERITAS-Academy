# -*- coding: utf-8 -*-
"""5ᵉ — *L'Arbre fétiche*, Jean Pliya (Éditions CLE, Yaoundé).

Quatre nouvelles : *L'Arbre fétiche* (Prix de la Nouvelle africaine, 1963),
*Voiture rouge*, *L'homme qui avait tout donné*, *Le gardien de nuit*.

Tout ce qui est affirmé ici sort du volume : la page de titre, le prix, les
quatre récits, et le **Dossier pédagogique** final, où l'éditeur définit la
nouvelle, analyse la caractérisation « antithétique et paroxystique » des
personnages et relève les deux temps du recueil — le temps chronologique et
le **temps atmosphérique**, cet orage qui monte pendant tout *L'Arbre fétiche*
et n'éclate qu'à la mort de Dossou.
"""
import jeux
import source
from gabarit import cote_enseignant, lecture_suivie, ouvrir
from kit import cases, enc, grille, h1, h2, h3, lignes, num, p, puce, saut

CLE = "arbre"
SRC = "Jean Pliya, *L'Arbre fétiche*, Éditions CLE, Yaoundé"
BORNES = ["VOITURE ROUGE", "L'HOMME QUI AVAIT TOUT DONNÉ", "LE GARDIEN DE NUIT",
          "Dossier pédagogique"]


def _x(amorce, mots=620):
    voisins = [t for t in BORNES if source.plat(t) not in source.plat(amorce)]
    return source.extrait(CLE, amorce, mots=mots, arret=voisins)


# ============================================================ 1. J'ouvre

def partie1():
    return [h1("Œuvre 1 — L'Arbre fétiche, de Jean Pliya")] + ouvrir(
        "L'Arbre fétiche", "Jean Pliya",
        questions_couverture=[
            "**Un arbre fétiche.** Que veut dire « fétiche », d'après toi ? "
            "Écris ta définition avant d'ouvrir un dictionnaire.",
            "Un arbre peut-il être sacré ? En connais-tu un, dans ton village "
            "ou ton quartier, qu'on évite ou qu'on respecte ?",
            "Le livre a reçu le **Prix de la Nouvelle africaine en 1963**. "
            "Cherche : que s'est-il passé en Afrique autour de ces années-là ?",
            "Suppose qu'on te demande d'abattre un arbre que ton grand-père "
            "dit sacré. Que fais-tu ? Écris ta réponse — on la relira."],
        promesses=[
            "L'arbre sera-t-il abattu ? Et si oui, que se passera-t-il ?",
            "Qui aura raison dans ce livre : les anciens ou les modernes ?",
            "Le titre annonce-t-il un livre triste ou un livre gai ?",
            "Peut-on construire une route et respecter une coutume ?"],
        journal_exemple=["10/10", "*L'Arbre fétiche*, les premières pages",
                         "M. Lanta veut percer une rue ; un iroko sacré est "
                         "sur le tracé",
                         "Pourquoi les prisonniers ont-ils si peur ?"])


# ================================================= 2. L'auteur et son livre

def partie2():
    return [
        h2("2. L'auteur et son livre"),
        h3("Jean Pliya"),
        p("Jean Pliya est un écrivain **béninois** — le pays s'appelait alors "
          "le **Dahomey**. Son recueil paraît aux **Éditions CLE**, à Yaoundé, "
          "et la nouvelle qui lui donne son titre a reçu le **Prix de la "
          "Nouvelle africaine en 1963**."),
        p("La dernière nouvelle du volume porte une dédicace qui en dit long : "
          "*« À la mémoire de Prosper Pliya, mon père qui fut aussi un guide "
          "et un ami. »* Retiens-la : quand tu liras *Le gardien de nuit*, tu "
          "sauras que l'enfant de dix ans qui raconte ressemble beaucoup à "
          "l'auteur."),
        enc("mot", "Qu'est-ce qu'une nouvelle ? La réponse du livre", [
            "Le Dossier pédagogique du volume le dit exactement : la nouvelle "
            "est, **selon son étymologie**, « un événement que l'on "
            "découvre ». De là on est passé au **récit** de cet événement.",
            "Elle suppose donc **un sujet exceptionnel**, une intrigue nette, "
            "et surtout **un revirement** — un moment où tout se retourne.",
            "Et parce qu'elle est courte, elle doit obtenir le maximum d'effet "
            "avec le minimum de mots. Un roman peut se permettre de traîner ; "
            "une nouvelle, jamais."]),
        h3("Les quatre nouvelles"),
        grille([["N°", "Titre", "Où ça se passe", "De quoi ça parle"],
                ["1", "**L'Arbre fétiche**", "Abomey, l'ancienne capitale du "
                 "Dahomey", "Un fonctionnaire veut percer une rue ; un iroko "
                 "sacré barre le tracé"],
                ["2", "**Voiture rouge**", "Cotonou, la veille de Noël",
                 "Mensavi, un enfant pauvre, vole une toupie et rêve d'une "
                 "voiture rouge"],
                ["3", "**L'homme qui avait tout donné**", "une ville, une "
                 "pharmacie", "Fiogbé, vieux paysan, n'a pas les deux mille "
                 "francs qui sauveraient sa femme"],
                ["4", "**Le gardien de nuit**", "une ville sans électricité",
                 "Un enfant de dix ans admire Zannou, l'homme qui veille "
                 "pendant que les autres dorment"]]),
        enc("culture", "Abomey, une ville qui fut une capitale", [
            "**Abomey** était la capitale historique du **Dahomey** — le Bénin "
            "d'aujourd'hui. Ses rois, dont **Ghézo**, **Tegbessou** et "
            "**Gbêhanzin**, ont laissé un palais royal, devenu musée.",
            "Le livre dit la ville en deux mots : le long de la route "
            "goudronnée s'alignent les écoles, l'hôpital, la poste, le "
            "commissariat — et le cimetière. Mais *« dans le secret des "
            "couvents des divinités vaudou »*, l'ancienne force reste vive.",
            "**Le détail qui frappe :** autrefois, on enterrait les morts "
            "**dans les maisons**, parce qu'ils appartenaient à la famille. Le "
            "cimetière à l'écart, dit le narrateur, est *« l'indice d'une lente "
            "mais douloureuse rupture »*."]),
        enc("culture", "Quatre divinités que le livre nomme", [
            "**Dada Sègbo** : l'être suprême, unique créateur. C'est le seul "
            "en qui Dossou, le bûcheron, dit croire.",
            "**Gou** : la divinité qui protège les forgerons, les guerriers et "
            "tous ceux qui manient des outils tranchants. Dossou évite de "
            "toucher un métal les jours qui lui sont consacrés.",
            "**Tolégba** : la petite statue d'argile installée au pied de "
            "l'iroko, qu'on arrose d'huile de palme. Il faudra la réduire en "
            "miettes.",
            "**Heviesso** : le dieu du tonnerre. C'est lui qui « crache le "
            "feu » à la fin de la première nouvelle."]),
        enc("astuce", "Comment lire ce recueil", [
            "Chaque nouvelle se lit d'un coup, en une soirée. Quatre soirées, "
            "et le livre est fini.",
            "**Mais lis la fin sans sauter de ligne.** Chez Pliya, tout se "
            "joue dans les dix dernières lignes : c'est là qu'est le "
            "revirement."]),
        saut()]


# =========================================================== 3. Qui est qui

def partie3():
    b = [h2("3. Qui est qui"),
         p("Le Dossier pédagogique du livre prévient : ces personnages sont "
           "**« plus des types que des personnages »**. Autrement dit, chacun "
           "représente une force, et l'auteur les dresse deux par deux, l'un "
           "contre l'autre."),
         grille([["Personnage", "Nouvelle", "Ce qu'il représente"],
                 ["**Paul Lanta**", "L'Arbre fétiche", "la modernité : commis "
                  "d'administration, « moderne jusqu'au bout des ongles », il "
                  "prend les récits du passé pour des « contes d'un autre "
                  "âge »"],
                 ["**Mèhou**", "L'Arbre fétiche", "la tradition : vieux "
                  "prisonnier, fils d'un grand chef féticheur, né avant la "
                  "chute du roi Gbêhanzin"],
                 ["**Dossou**", "L'Arbre fétiche", "l'orgueil : bûcheron "
                  "magnifique, **et boiteux** — retiens ce détail, c'est la "
                  "clé du personnage"],
                 ["**Cossi**", "L'Arbre fétiche", "l'apprenti qui a peur des "
                  "présages, et qui a raison d'avoir peur"],
                 ["**Anatole**", "L'Arbre fétiche", "le garde, pris entre son "
                  "chef et ses hommes"],
                 ["**Mensavi**", "Voiture rouge", "l'enfant pauvre : une "
                  "culotte loqueteuse, des pieds enflés de chiques, et une "
                  "envie de toupie"],
                 ["**Aboki**", "Voiture rouge", "l'ami rieur, « si noir que "
                  "ses gencives semblaient teintées de bleu »"],
                 ["**Fiogbé**", "L'homme qui avait tout donné", "le vieux "
                  "paysan qui pleure dans une pharmacie"],
                 ["**Phina**", "L'homme qui avait tout donné", "sa fille, qui "
                  "parle quand son père ne peut plus"],
                 ["**Zannou**", "Le gardien de nuit", "le veilleur : une "
                  "massue, des gris-gris, et le courage d'affronter la nuit"],
                 ["**Cicavi**", "Le gardien de nuit", "la fille unique de "
                  "Zannou"],
                 ["**Ayélé**", "Le gardien de nuit", "la restauratrice — et, "
                  "dit le Dossier, la « méchante » face au courageux Zannou"]]),
         enc("perso", "Le détail qui explique tout : Dossou boite", [
             "Lis bien : Dossou s'appuie « sur sa jambe valide », et à la fin "
             "sa « jambe éclopée ne suivit pas l'élan de tout l'être ».",
             "Le Dossier pédagogique du volume est formel : *« Un détail "
             "s'avère être la clé de lecture du personnage de Dossou : sa "
             "claudication. »*",
             "Pourquoi abat-il des arbres avec cette rage ? **Non pour "
             "détruire la tradition** — il n'y croit pas — mais « pour se "
             "venger du destin ». Un homme qui boite prouve à chaque coup de "
             "hache qu'il est le plus fort. Et c'est justement sa jambe qui le "
             "tuera."]),
         enc("culture", "L'iroko, un arbre qui existe vraiment", [
             "Le livre lui donne ses deux noms : **iroko**, et son nom "
             "savant, *chlorophora excelsa* — « le chlorophora excelsa des "
             "botanistes », écrit Pliya.",
             "C'est un géant de la forêt africaine : un fût droit « comme une "
             "colonne de cathédrale », des contreforts « pareils à des carènes "
             "de navire ». Celui-ci, dit le texte, était **presque trois fois "
             "centenaire** — on le voit à l'entaille.",
             "Son bois est superbe, et c'est là le drame : *« depuis quelque "
             "temps on a commencé à le couper pour faire des chaises, des "
             "tables, des portes »*. Ceux qui restent n'en sont que plus "
             "précieux."])]

    e, c = jeux.relier(
        "Chacun sa force",
        [("Paul Lanta", "La modernité pressée, qui ne croit plus aux fétiches"),
         ("Mèhou", "La mémoire des rois et des bois sacrés"),
         ("Dossou", "L'orgueil d'un homme qui boite et veut le prouver"),
         ("Mensavi", "La faim d'un jouet, un soir de Noël"),
         ("Fiogbé", "Deux mille francs qui manquent, et une femme qui meurt"),
         ("Zannou", "Une massue, et la nuit à traverser seul")],
        graine=91)
    b += e
    b.append(saut())
    return b, c


# ======================================================= 4. Lectures suivies

def partie4():
    b = [h2("4. Je lis l'œuvre — six lectures suivies"),
         p("Quatre nouvelles, six séances : quatre pour *L'Arbre fétiche*, une "
           "pour *Voiture rouge*, une pour *L'homme qui avait tout donné*. "
           "*Le gardien de nuit* est ta lecture personnelle — et le support de "
           "ton épreuve.")]

    b += lecture_suivie(
        1, "Une ville à deux visages (ouverture de *L'Arbre fétiche*)",
        situation=[
            "Le livre ne commence pas par une action : il commence par **une "
            "ville**. Pliya prend cinq paragraphes pour installer Abomey, "
            "l'ancienne capitale du Dahomey.",
            "Lis-le comme on regarde une carte : d'abord le passé prestigieux, "
            "puis la route goudronnée, puis les ruelles qui font des détours "
            "bizarres. Le décor contient déjà toute l'histoire."],
        texte=_x("Dans l'histoire de la civilisation négro-africaine"), source=SRC,
        questions=[
            "Quels bâtiments s'alignent le long de la route goudronnée ? Fais "
            "la liste dans l'ordre du texte. Lequel arrive en dernier — et "
            "trouves-tu cela un hasard ?",
            "Où enterrait-on les morts autrefois ? Pourquoi ? Recopie la "
            "phrase qui explique le changement.",
            "Pourquoi les ruelles font-elles « des détours curieux » ? Que "
            "répondrait un enfant du quartier ?",
            "Relève **deux** comparaisons dans la description de la ville.",
            "« La construction d'une nation moderne peut exiger la destruction "
            "de certaines reliques du passé. » Reformule cette phrase avec tes "
            "mots. Es-tu d'accord ?",
            "Comment M. Lanta est-il habillé ? Que nous apprend cette tenue "
            "avant même qu'il ait parlé ?"],
        grille_lecture=[
            ("Que la ville a deux visages",
             "Les mots du passé face aux mots du présent"),
            ("Que la tradition survit en secret",
             "Les mots du caché (**secret**, **couvents**, **disséminés**)"),
            ("Que le narrateur nous prend par la main",
             "Les passages où il dit **vous** (« si vous vous promenez… »)"),
            ("Que Lanta est présenté par son apparence",
             "Les détails de son costume et de sa démarche")],
        bilan=[
            "Voilà comment on ouvre une nouvelle : **le décor annonce le "
            "conflit**. Une route droite d'un côté ; des ruelles qui font des "
            "coudes pour éviter un arbre de l'autre. Tout le livre est là.",
            "Note la manière dont Lanta est peint : pas de portrait "
            "psychologique, seulement **un pantalon de tergal, une cravate de "
            "soie rouge et des mocassins à boucles**. Pliya te fait deviner un "
            "caractère par une garde-robe.",
            "Et retiens la phrase du narrateur sur les « jeunes "
            "responsables » : ils ne connaissent de leur propre civilisation "
            "*« que les vestiges désuets qui en sont restés »*. Ce n'est pas "
            "un reproche de vieux : c'est un constat triste."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Occulte** : caché, secret, mystérieux.",
                "**Un antagonisme** : une opposition, un conflit.",
                "**Une venelle** : une toute petite rue.",
                "**Désuet** : passé de mode, qui ne sert plus.",
                "**Végéter** : survivre péniblement, sans se développer.",
                "**Imbu de lui-même** : très content de sa personne."])])

    b += lecture_suivie(
        2, "L'ordre et l'obstacle",
        situation=[
            "M. Lanta arrive à son bureau de la Mairie, consulte son "
            "éphéméride et fait sonner sa clochette. Aujourd'hui, son équipe "
            "de prisonniers doit percer une rue nouvelle.",
            "Ce que ni lui ni eux ne savent encore : sur le tracé, après le "
            "premier coude, il y a un arbre."],
        texte=_x("Paul Lanta est l'un de ces responsables"), source=SRC,
        questions=[
            "Comment est décrit le vieux planton ? Relève trois détails de son "
            "vêtement.",
            "Comment sont habillés les prisonniers ? Quel détail de leur corps "
            "prouve qu'ils marchent toujours pieds nus ?",
            "Quels outils portent-ils ? Pourquoi cette liste est-elle "
            "importante pour la suite ?",
            "Relève les indications de **temps** et de **saison**. Que "
            "prépare, à ton avis, la mention du « temps orageux » ?",
            "Décris l'iroko en reprenant les mots du texte : le fût, les "
            "lianes, les branches. Relève la comparaison avec un bâtiment.",
            "« À la vue de cet arbre, on ressentait malgré soi une impression "
            "de vénération. » Qui est ce « on » ? Pourquoi « malgré soi » ?"],
        grille_lecture=[
            ("Que Lanta est un homme d'ordre",
             "Les gestes méthodiques (épousseter, consulter, agiter la "
             "clochette)"),
            ("Que les prisonniers sont misérables",
             "Les détails du corps et du vêtement"),
            ("Que l'arbre est majestueux",
             "Les comparaisons et le vocabulaire de la grandeur"),
            ("Que l'orage se prépare",
             "Les mots du ciel et de l'air")],
        bilan=[
            "Deux mondes se mettent en marche dans la même page : un bureau "
            "avec une clochette et un éphéméride, et douze hommes pieds nus "
            "armés de houes.",
            "Puis arrive l'arbre — et le texte change de registre : "
            "« colonne de cathédrale », « arcade », « ombre compacte ». Pliya "
            "décrit l'iroko avec le vocabulaire d'une **église**. Avant qu'un "
            "seul personnage ait parlé, le lecteur sait qu'on va commettre un "
            "sacrilège.",
            "**Le mot à retenir de cette séance :** le *temps atmosphérique*. "
            "Le Dossier pédagogique du livre le désigne comme « l'un des "
            "présages constants du tragique final ». Souligne, à chaque page, "
            "les phrases sur le ciel : elles te racontent la fin à l'avance."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Un éphéméride** : un calendrier où l'on note ce qu'il y a à "
                "faire chaque jour.",
                "**Un planton** : un employé chargé de porter les messages.",
                "**Un fût** : le tronc droit d'un arbre, sans branches.",
                "**Le faîte** : le sommet.",
                "**La latérite** : cette terre rouge des routes de brousse.",
                "**Le gabarit** : les dimensions prévues."]),
            ("lieu", "Le trajet, pas à pas", [
                "Suis-le sur une feuille : la Mairie → l'artère goudronnée → "
                "le marché **Houndjro** → à droite, une piste de latérite → "
                "cinq cents mètres → le sentier de **Sinhoué** → premier "
                "coude, à main gauche : **l'iroko**.",
                "Pliya ne dit jamais « ils allèrent travailler ». Il donne "
                "les virages. C'est ainsi qu'on fait exister un lieu."])])

    b += lecture_suivie(
        3, "Le vieux Mèhou plaide pour un arbre",
        situation=[
            "Les prisonniers refusent d'abattre l'iroko. Leur porte-parole "
            "explique qu'ils n'ont que des coupe-coupe ; Lanta répond que des "
            "haches arriveront demain.",
            "Le travail ralentit. Anatole, interrogé, désigne un meneur : un "
            "vieux prisonnier aux cheveux « gris comme du kapok ». Lanta le "
            "prend à part pour le faire parler. Il s'appelle **Mèhou**."],
        texte=_x("Chef, répondit Mèhou en se tenant respectueusement"),
        source=SRC,
        questions=[
            "Dans quelle position Mèhou se tient-il pour parler ? Relève les "
            "trois détails. Que disent-ils de sa place dans cette "
            "conversation ?",
            "Comment Mèhou date-t-il sa naissance ? Pourquoi ne donne-t-il pas "
            "une année ?",
            "Quelle est sa filiation ? En quoi cela lui donne-t-il le droit de "
            "parler des bois sacrés ?",
            "Selon Mèhou, qu'est-il arrivé aux forêts d'iroko ? Quelle en est "
            "la conséquence pour ceux qui restent ?",
            "Raconte, en trois phrases, l'histoire du roi Tegbessou et de "
            "l'oiseau.",
            "Que répond M. Lanta ? Recopie sa phrase sur le XXᵉ siècle. Quel "
            "est son argument ?",
            "Qui, des deux, te paraît avoir raison ? Dis-le franchement, puis "
            "cherche **un** argument pour l'autre camp."],
        grille_lecture=[
            ("Que Mèhou parle en dépositaire d'un savoir",
             "Les verbes de la connaissance et de la mémoire"),
            ("Que le monde ancien avait ses lois",
             "Les mots de l'interdit (**nul n'avait le droit**, "
             "**représailles**)"),
            ("Que Lanta n'écoute pas vraiment",
             "Les indications sur son attitude (sourire, ironie, "
             "scepticisme)"),
            ("Que deux temps s'affrontent",
             "Le passé des rois face au « plein XXᵉ siècle »")],
        bilan=[
            "Cette page est le cœur du livre : **deux hommes ont raison en "
            "même temps**, et c'est pour cela que l'histoire finira mal.",
            "Mèhou n'invoque pas la magie tout de suite : il commence par un "
            "**fait vérifiable** — on a coupé les irokos pour faire des chaises "
            "et des tables. Puis il raconte le roi Tegbessou. Puis il signale "
            "le tronc creux et le serpent. Du plus solide au plus incertain : "
            "c'est un plaidoyer bien construit.",
            "Lanta, lui, tient un argument qu'on ne peut pas balayer non plus : "
            "sans routes, pas de ville ; sans ville moderne, pas de nation. "
            "Sauf qu'il ajoute une phrase de trop : il traite tout cela de "
            "*« contes d'un autre âge »*.",
            "Retiens la leçon d'écriture : **pour qu'un conflit soit "
            "intéressant, les deux camps doivent avoir de bons arguments.** "
            "Deux méchants qui se battent n'intéressent personne."],
        encadres=[
            ("culture", "Gbêhanzin et Tegbessou : deux rois qui ont existé", [
                "**Gbêhanzin** fut le dernier roi indépendant du Dahomey : il "
                "se rendit aux Français et fut déporté. Mèhou dit être né "
                "**avant** cela : c'est sa façon de dire son grand âge.",
                "**Tegbessou** est un roi plus ancien. Selon le conte de "
                "Mèhou, un oiseau logé dans cet iroko l'avertissait des ruses "
                "de ses ennemis de Zâ.",
                "**Ce qu'il faut comprendre :** l'arbre n'est pas seulement un "
                "arbre. C'est une **archive**. On y a rangé un souvenir de "
                "guerre. L'abattre, c'est effacer une page d'histoire."]),
            ("mot", "Les mots difficiles", [
                "**Un féticheur** : celui qui s'occupe des fétiches et des "
                "rites.",
                "**Des représailles** : une punition, une vengeance.",
                "**Un sortilège** : un sort, un mauvais charme.",
                "**Un sabbat** : une assemblée nocturne de sorciers.",
                "**Sceptique** : qui ne croit pas, qui doute."])])

    b += lecture_suivie(
        4, "La hache et l'orage (le combat de Dossou)",
        situation=[
            "Lanta a renoncé à faire abattre l'arbre par les prisonniers. Un "
            "détenu nommé Dossou a proposé de trouver un bûcheron : ce sera "
            "lui-même.",
            "Au matin, Dossou part avec son apprenti Cossi et deux haches "
            "affûtées à l'huile de palme. En chemin, il croise un homme — "
            "mauvais présage. Cossi se tait.",
            "Ce que tu vas lire est un **combat**. Lis-le comme tel."],
        texte=_x("Dès que le bûcheron arriva sur le chantier"), source=SRC,
        questions=[
            "Relève les mots qui font de l'arbre un **adversaire** et non un "
            "végétal. Il y en a au moins quatre.",
            "Quels animaux fuient aux premiers coups ? Que produit ce détail ?",
            "Qu'y avait-il sous la paillote, au pied de l'iroko ? Que "
            "faut-il en faire ?",
            "Décrit les gestes de Dossou avant le premier coup. Pourquoi Pliya "
            "les détaille-t-il autant ?",
            "Relève **trois** phrases sur le ciel et le temps. Range-les dans "
            "l'ordre : que se passe-t-il, dans le ciel, pendant que la hache "
            "frappe ?",
            "Comment le narrateur fait-il comprendre l'âge de l'arbre ?",
            "À la fin du passage, les prisonniers chantent. À la manière de "
            "qui ? Que devient Dossou à leurs yeux ?"],
        grille_lecture=[
            ("Que l'abattage est raconté comme un duel",
             "Le vocabulaire du combat (**adversaire**, **combat "
             "singulier**, **violé**)"),
            ("Que l'arbre est un corps",
             "Les mots du corps appliqués à l'arbre (**chair**, **peau**, "
             "**charpente**, **frissonna**)"),
            ("Que l'orage monte avec la tension",
             "Les phrases sur le ciel, dans leur ordre d'apparition"),
            ("Que Dossou perd son calme",
             "L'évolution de ses gestes, du début à la fin du passage")],
        bilan=[
            "Pliya ne raconte pas un travail forestier : il raconte **un "
            "duel**. L'arbre a une chair, une peau qui se gerce « comme une "
            "peau de caïman », une charpente qui frissonne, un râle "
            "d'agonisant.",
            "Et pendant que Dossou frappe, **le ciel se couvre**. Relis tes "
            "trois phrases relevées : elles montent en même temps que la "
            "colère du bûcheron. Quand l'arbre tombe et l'écrase, l'orage "
            "éclate — Heviesso, dit le texte, « exprimait sa colère en "
            "crachant le feu ».",
            "Le livre laisse alors le lecteur libre. Est-ce le fétiche qui "
            "s'est vengé ? Ou bien un bûcheron boiteux, épuisé et ivre "
            "d'orgueil, qui a refusé la corde, refusé l'aide, refusé la "
            "pause — et qui s'est trompé de côté ?",
            "**Les deux lectures tiennent.** C'est précisément pour cela que "
            "cette nouvelle a reçu un prix."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Une cognée** : une grosse hache de bûcheron.",
                "**Un contrefort** : la base élargie d'un tronc, qui "
                "l'arc-boute.",
                "**Se desquamer** : perdre son écorce par plaques.",
                "**Ahaner** : souffler bruyamment sous l'effort.",
                "**Claudicant** : qui boite.",
                "**La frondaison** : l'ensemble du feuillage."]),
            ("rire", "Le seul rire de cette nouvelle est un rire jaune", [
                "Au moment le plus solennel, Pliya glisse un détail "
                "invraisemblable : Dossou, sûr de son coup, **se pavane**. Il "
                "« allait et venait d'un groupe à l'autre », « s'amusait de la "
                "consternation générale », « flatté du regard admiratif des "
                "prisonniers ».",
                "Trois lignes de parade, et l'arbre tombe.",
                "C'est cruel, et c'est l'un des plus vieux ressorts de la "
                "littérature : **on tombe toujours au moment où l'on se "
                "regarde marcher**."])])

    b += lecture_suivie(
        5, "Une toupie qui tourne, un enfant qui vole (*Voiture rouge*)",
        situation=[
            "Deuxième nouvelle, autre ville : **Cotonou**, la veille de Noël. "
            "Dans une rue chauffée à blanc, un grand garçon fait tourner une "
            "toupie et une bande d'enfants l'admire.",
            "À l'écart, adossé à un cailcédrat, un enfant regarde. Il "
            "s'appelle **Mensavi**, et il n'a pas de toupie."],
        texte=_x("Sur le bitume de la rue du Roi Dako-Donou"), source=SRC,
        questions=[
            "Relève les bruits de la toupie et du fouet. Comment Pliya les "
            "écrit-il ? Comment appelle-t-on ces mots-là ?",
            "Où se tient Mensavi, et pourquoi n'est-ce pas pour l'ombre ? "
            "Relève la phrase qui dit son désir.",
            "Raconte la poursuite en cinq étapes. À quel moment tourne-t-elle "
            "au drame ?",
            "Pourquoi Mensavi ne se défend-il pas ? Recopie l'explication du "
            "texte.",
            "Relève les insultes que les enfants lui lancent. Laquelle "
            "atteint la famille, et non lui ?",
            "« Ça va, il a son compte. » Qui parle ? Que se passe-t-il "
            "immédiatement après cette phrase ?"],
        grille_lecture=[
            ("Que la toupie fascine",
             "Les onomatopées et les verbes de mouvement"),
            ("Que Mensavi est seul contre tous",
             "Les mots qui désignent le groupe (**bande**, **meute**, "
             "**horde**)"),
            ("Que le narrateur a pitié de lui",
             "Les détails de son corps et de son vêtement pendant la chute"),
            ("Que la violence est banale",
             "La vitesse à laquelle l'indignation s'éteint")],
        bilan=[
            "Pliya écrit ici l'une des pages les plus dures du recueil, et il "
            "n'y a pas un mot de jugement. Un enfant vole un jouet ; dix "
            "enfants le lapident ; on lui casse un fouet sur la tête ; et "
            "l'affaire se referme en une réplique : « Ça va, il a son "
            "compte. »",
            "Remarque le vocabulaire du groupe : **bande**, puis **meute**, "
            "puis **horde**. En trois mots, les camarades sont devenus des "
            "bêtes.",
            "Et remarque surtout le détail qui déchire : Mensavi, sous les "
            "coups, **ne lâche pas la toupie**. « De peur de lâcher son butin, "
            "il s'abstenait de riposter. » Un enfant qui préfère être battu "
            "plutôt que de rendre un jouet, cela dit tout de ce qu'il n'a "
            "jamais eu.",
            "**Et pourtant cette nouvelle finit bien.** Le Dossier "
            "pédagogique du volume le dit : c'est « un coup de la providence » "
            "qui procure à Mensavi *« la voiture rouge »* de ses rêves, avec "
            "des friandises en prime — et l'enfant offre à son tour un don à "
            "l'enfant Jésus, comme les rois mages. Va lire cette fin : tu "
            "l'auras méritée."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Un garnement**, **un galopin**, **un chenapan** : trois "
                "mots pour dire « enfant mal élevé ». Pliya les emploie tous "
                "les trois dans la même page.",
                "**Dépenaillé** : en haillons, mal habillé.",
                "**Incontinent** : aussitôt, immédiatement (rien à voir avec "
                "le sens médical).",
                "**Flageoler** : trembler sur ses jambes.",
                "**Un cailcédrat** : un grand arbre d'Afrique de l'Ouest."]),
            ("jeu", "Écris les bruits", [
                "Pliya écrit la toupie ainsi : **clac !** pour le fouet, "
                "**vrr !** pour la rotation, et « les ronrons de la toupie "
                "guillerette ».",
                "Ces mots qui imitent un bruit s'appellent des "
                "**onomatopées**.",
                "À toi : écris l'onomatopée d'une porte qui grince, d'un "
                "seau qui tombe, d'un moto-taxi qui démarre, d'une pluie sur "
                "un toit de tôle. Interdit d'utiliser deux fois la même "
                "lettre doublée."])])

    b += lecture_suivie(
        6, "Deux mille francs (*L'homme qui avait tout donné*)",
        situation=[
            "Troisième nouvelle. Elle s'ouvre sur une épigraphe de "
            "Saint-Exupéry : *« Car donner est jeter un pont par-dessus "
            "l'abîme de ta solitude. »* Retiens cette phrase, elle est le "
            "programme du récit.",
            "Un vieux paysan et sa fille sortent de l'hôpital avec une "
            "ordonnance. La mère est malade ; il faut deux mille francs. Ils "
            "entrent dans une pharmacie."],
        texte=_x("Le vieux paysan devenu soudain insensible à la honte"),
        source=SRC,
        questions=[
            "Que fait le vieux paysan en pleine pharmacie ? Pourquoi cela ne "
            "lui importe-t-il plus ?",
            "Relève trois détails de son vêtement et de ses mains. Quelle "
            "impression donnent-ils ?",
            "Que fait la fille de l'ordonnance ? Pourquoi ce geste est-il "
            "touchant ?",
            "Comment la pharmacienne réagit-elle ? Recopie son ordre. Quel "
            "mot emploie-t-elle, et non « faites-le sortir » ?",
            "Relève la phrase de l'employé au crâne rasé. Que reproche-t-il "
            "au vieux, exactement ?",
            "Qui les arrête dans la rue ? Comment est-il habillé ? Quelle est "
            "sa première question — et qu'est-ce qu'elle révèle de ce qu'on "
            "pense des pauvres ?",
            "Fais la liste du parcours de ces deux-là : dispensaire → … → … "
            "Pourquoi ce parcours est-il, en lui-même, une critique ?"],
        grille_lecture=[
            ("Que la misère est décrite par des objets",
             "L'ordonnance, le pagne, les ongles, le boubou déchiré"),
            ("Que la foule regarde sans aider",
             "Les paroles des clientes, entre pitié et curiosité"),
            ("Que le mépris vient aussi des siens",
             "La phrase de l'employé, qui est africain comme eux"),
            ("Que l'inconnu tranche avec tous les autres",
             "Ses questions, son ton, et ce qu'il finit par faire")],
        bilan=[
            "Deux mille francs. Toute la nouvelle tient dans un chiffre — et "
            "dans le fait qu'un vieil homme pleure en public parce qu'il ne "
            "les a pas.",
            "Regarde bien qui l'humilie. Ce n'est pas seulement la "
            "pharmacienne blanche « au visage cireux » : c'est aussi "
            "**l'employé au crâne rasé**, dont la blouse s'élime aux coudes, "
            "et qui lui dit : « Tu dégrades les nègres ; fous le camp. » Un "
            "pauvre qui chasse un plus pauvre pour ne pas lui ressembler.",
            "C'est ce que le Dossier pédagogique appelle « l'injustice entre "
            "Africains née d'une mauvaise gestion des pays après les "
            "indépendances ».",
            "Et puis l'inconnu paie. Le titre — *L'homme qui avait tout "
            "donné* — désigne d'ailleurs **Fiogbé**, non le bienfaiteur : le "
            "vieux paysan sera finalement récompensé de sa générosité. Va voir "
            "comment."],
        encadres=[
            ("mot", "Les mots difficiles", [
                "**Une ordonnance** : le papier où le médecin écrit les "
                "médicaments à acheter.",
                "**La lippe** : la lèvre inférieure, quand elle est épaisse ou "
                "boudeuse.",
                "**S'élimer** : s'user jusqu'à devenir mince.",
                "**Un quolibet** : une moquerie lancée à haute voix.",
                "**S'esclaffer** : éclater de rire bruyamment."]),
            ("perso", "Une épigraphe, et pourquoi elle sert", [
                "Une **épigraphe** est la citation qu'un auteur place en tête "
                "d'un texte, pour l'éclairer.",
                "Ici, Pliya cite Saint-Exupéry : donner ne diminue pas, cela "
                "augmente ; et *« il n'est point de marchandise que l'on "
                "épargne, quand il s'agit des mouvements du cœur »*.",
                "Cherche l'épigraphe de *Le gardien de nuit* : c'est une "
                "dédicace au père de l'auteur. Deux textes, deux phrases mises "
                "en tête — et à chaque fois, la clé du récit est dedans."])])

    b += cote_enseignant([
        "Six séances : quatre sur la nouvelle-titre (dont l'ouverture "
        "descriptive, souvent sautée à tort), une sur *Voiture rouge*, une sur "
        "*L'homme qui avait tout donné*.",
        "*Le gardien de nuit* reste en lecture personnelle et sert de support "
        "à l'épreuve d'étude de texte : la lecture réelle de l'œuvre est donc "
        "mesurée, non la mémoire du cours.",
        "Le passage de l'abattage comporte la description du Tolégba, statue "
        "d'argile pourvue d'un phallus de bois : l'extrait retenu la mentionne "
        "en une ligne. La traiter comme un fait d'ethnographie, sans détour ni "
        "insistance.",
        "La séance 4 se prête à un relevé collectif au tableau : les phrases "
        "sur le ciel, dans l'ordre. Les élèves découvrent seuls que l'orage "
        "monte avec la tension — c'est la meilleure entrée possible dans la "
        "notion de présage.",
        "La fin de *Voiture rouge* est heureuse : ne pas laisser la classe sur "
        "la scène de la lapidation."])
    b.append(saut())
    return b
