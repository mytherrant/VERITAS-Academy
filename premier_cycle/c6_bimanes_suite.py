# -*- coding: utf-8 -*-
"""6ᵉ — *Les Bimanes* : écrire, jouer, s'évaluer.

Abega est un maître du **portrait méchant** et de la **comparaison qui "
change de monde** : les ateliers d'écriture partent de là, parce qu'un modèle
tiré du livre qu'on vient de lire vaut mieux qu'un modèle abstrait.

Le support de correction orthographique est **composé** pour l'épreuve : le
livre est entre les mains de l'élève, et un passage emprunté lui donnerait la
version correcte à recopier.
"""
import jeux
import source
from gabarit import (epreuve_etude_texte, epreuve_expression,
                     epreuve_orthographe, production)
from kit import enc, grille, h2, h3, p, saut

CLE = "bimanes"
SRC = "Séverin Cécile Abega, *Les Bimanes*, NEA/EDICEF, 1982"
NOUVELLES = ["Le fardeau.", "Dans la forêt.", "Une petite vendeuse de beignets.",
             "Le savon.", "Un étranger de passage.", "Mots d'enfants.",
             "Au ministère du soya."]


# ==================================================== 5. Les productions

def partie5():
    b = [h2("5. J'écris — le portrait et l'opinion"),
         p("Tu sais déjà raconter et décrire : c'était l'atelier des *Chants "
           "de la Forêt*. Deux nouveaux outils maintenant, et ce sont les deux "
           "spécialités d'Abega : **le portrait** et **l'argumentation**."),
         p("Même méthode qu'avant — **modèle d'abord, règle ensuite** — mais "
           "on vise plus haut : ici, on cherche à écrire **drôle**.")]

    b += production(
        "le portrait moqueur",
        "faire un portrait qui fait rire sans jamais insulter personne.",
        modele=(
            "❶ Le grand Bella était l'homme le plus occupé du quartier. ❷ Il "
            "avait un ventre en avance de trois pas sur le reste de sa "
            "personne, des lunettes noires qu'il ne retirait jamais, même la "
            "nuit, et une chemise dont les boutons vivaient dans une angoisse "
            "permanente. ❸ Il traversait la cour à petits pas pressés, un "
            "dossier vide sous le bras, en regardant sa montre toutes les "
            "vingt secondes. ❹ Personne ne savait quel était son travail. "
            "Personne n'avait jamais osé le lui demander. ❺ Il était "
            "important, affairé, et parfaitement inutile."),
        annotations=[
            ["❶ Le trait principal, annoncé net",
             "Une phrase. Ici, un mensonge poli : « le plus occupé »."],
            ["❷ Les détails qui trahissent",
             "Le ventre, les lunettes, les boutons. **On ne dit pas** qu'il est "
             "gros ni prétentieux : on le montre."],
            ["❸ Le geste répété",
             "La montre consultée toutes les vingt secondes. Un tic vaut dix "
             "adjectifs."],
            ["❹ Ce que le quartier n'ose pas dire",
             "Deux phrases courtes, en écho. Le silence des autres est un "
             "portrait."],
            ["❺ La chute",
             "Trois adjectifs, dont le dernier renverse tout : *inutile*."]],
        questions=[
            "Relève la comparaison la plus exagérée. Quel mot signale "
            "l'exagération ?",
            "Le texte ne dit jamais « il était prétentieux ». Par quels détails "
            "le comprend-on ?",
            "Que fait la répétition de « Personne » ? Essaie de la supprimer et "
            "relis à voix haute.",
            "Compare avec le portrait du ngomna dans « Le fardeau » : quels "
            "procédés Abega emploie-t-il aussi ?",
            "Le portrait est moqueur, mais aucune insulte n'y figure. "
            "Vérifie-le : cherche un mot blessant. Y en a-t-il un ?"],
        regle=[
            "Un portrait moqueur ne dit pas de gros mots : il **choisit des "
            "détails** et laisse le lecteur conclure.",
            "Ses trois armes : la **comparaison exagérée** (un ventre en "
            "avance de trois pas), le **geste répété** (la montre), et la "
            "**chute** (un dernier adjectif qui retourne tout).",
            "**Attention.** On se moque d'un *personnage inventé*, jamais d'un "
            "camarade de classe. La moquerie devient méchanceté dès qu'elle "
            "vise quelqu'un de réel qui ne peut pas répondre."],
        exercices=[
            "**Transforme.** Remplace chaque insulte par un détail qui la "
            "montre : *il est paresseux · elle est bavarde · il est avare · il "
            "est menteur*.",
            "**Invente une comparaison.** « Il avait une voix comme… », « Elle "
            "marchait comme… », « Ses chaussures ressemblaient à… ». Interdit "
            "de citer un animal deux fois.",
            "**Écris seul.** Fais en douze lignes le portrait d'un personnage "
            "inventé : *le vendeur qui jure que sa marchandise est la moins "
            "chère du marché*. Cinq étapes obligatoires, une chute en trois "
            "adjectifs.",
            "**Lis-le à voix haute.** Si la classe rit à la chute, c'est "
            "réussi. Si elle rit avant, ta chute est arrivée trop tôt."],
        astuce=("La recette de la comparaison d'Abega", [
            "Ne compare jamais une chose à une chose du même monde. Un "
            "ronflement comparé à un autre bruit ne fait pas rire.",
            "**Change de monde** : le ronflement devient *« un groupe "
            "électrogène en accélération constante »* ; les cases du village "
            "deviennent des copies *« d'un duplicateur mal réglé »* ; les "
            "souliers *« ricanent de vieillesse »*.",
            "Formule : chose ordinaire + monde inattendu (machines, bureaux, "
            "hôpital, école) = rire."]))

    b += production(
        "le texte argumentatif",
        "défendre une opinion sur un vrai débat, avec deux arguments et un "
        "exemple pris dans le livre.",
        modele=(
            "❶ À mon avis, Dany n'est pas un mauvais garçon : il est "
            "seulement mal informé.\n"
            "❷ D'abord, parce qu'il n'a pas mis les pieds au village depuis "
            "cinq ans. Il juge un endroit qu'il ne connaît plus, avec les "
            "idées qu'on lui a données en ville.\n"
            "❸ Ensuite, parce qu'il change dès qu'on lui montre les faits. "
            "Quand sa grand-mère part au champ avec sa houe, il ne discute "
            "pas : il prend une machette et la suit.\n"
            "❹ Par exemple, le texte dit qu'il était « navré de constater "
            "qu'elle avait raison ». Un orgueilleux véritable n'aurait rien "
            "constaté du tout.\n"
            "❺ C'est pourquoi je pense que le vrai défaut de Dany n'est pas "
            "l'orgueil, mais l'ignorance — et l'ignorance, cela se soigne."),
        annotations=[
            ["❶ Mon opinion", "Une phrase, et elle est **nuancée** : « pas "
             "un mauvais garçon, seulement mal informé »."],
            ["❷ Premier argument", "Une raison, expliquée en deux phrases."],
            ["❸ Deuxième argument", "Une autre raison, appuyée sur une scène "
             "précise du livre."],
            ["❹ L'exemple, avec citation",
             "Une phrase du texte, entre guillemets. C'est elle qui fait la "
             "différence entre une opinion et une preuve."],
            ["❺ La conclusion",
             "On reprend l'opinion, plus fort, et l'on ouvre une porte."]],
        questions=[
            "Recopie l'opinion. Pourquoi le mot « seulement » est-il "
            "important ?",
            "Relève les quatre mots de liaison qui annoncent chaque partie.",
            "Quelle est la différence entre l'argument ❸ et l'exemple ❹ ?",
            "La conclusion ajoute quelque chose que l'introduction ne disait "
            "pas. Quoi ?",
            "Écris l'opinion contraire en une phrase, puis trouve un argument "
            "**et** un exemple du livre pour la défendre."],
        regle=[
            "On annonce **son opinion**, on donne **deux arguments** (des "
            "raisons), on les appuie sur **un exemple précis avec citation**, "
            "on **conclut** en reprenant l'opinion autrement.",
            "Les mots de liaison guident : *d'abord, ensuite, par exemple, "
            "c'est pourquoi*.",
            "Une opinion **nuancée** (« pas… mais… », « seulement ») est "
            "presque toujours plus solide qu'une opinion tranchée : elle "
            "montre que tu as réfléchi aux deux camps."],
        exercices=[
            "**Trie.** Argument ou exemple ? (a) *Le travail manuel est mal "
            "considéré.* (b) *Dans « Le savon », les oncles proposent à Mbah "
            "une place de boy plutôt que de le laisser travailler à son "
            "compte.* (c) *Un diplôme ne rend pas meilleur.* (d) *Ahanda a le "
            "bac et cultive la terre.*",
            "**Nuance.** Réécris ces opinions trop tranchées : *L'école ne sert "
            "à rien · Les gens des bureaux sont tous méchants · Il faut "
            "toujours obéir aux vieux.*",
            "**Écris seul.** *« Un diplôme rend-il meilleur que les autres ? »* "
            "Quinze lignes : opinion nuancée, deux arguments, un exemple cité "
            "du livre, conclusion.",
            "**Débat en classe.** Une moitié soutient Dany, l'autre soutient "
            "Ahanda. Chaque camp doit citer **deux** phrases du livre. Une "
            "opinion sans citation ne compte pas."])

    b.append(saut())
    return b


# ============================================================ 6. Je joue

def partie6():
    b = [h2("6. Je joue et je révise"), p("Livre fermé. Toujours.")]
    corriges = []

    e, c = jeux.mots_meles("Le monde des bimanes", [
        "bimane", "quadrumane", "bipede", "ngomna", "maguida", "soya",
        "poubelle", "cravate", "beignet", "machette", "cacaoyere", "savon",
        "Tchakarias", "Ambombo", "Ahanda", "Etoundi", "Garba", "Mbah",
        "Towa", "Serge"], graine=41)
    b += e
    corriges += c

    e, c = jeux.mots_croises("Les mots d'Abega", [
        ("BIMANE", "Celui qui a deux mains et s'en sert"),
        ("NGOMNA", "L'administrateur, le représentant du gouvernement"),
        ("MAGUIDA", "Populations du Nord, maîtres du soya selon le livre"),
        ("SOYA", "Viande grillée « baptisée au piment »"),
        ("CHUTE", "La dernière phrase qui retourne toute la nouvelle"),
        ("NOUVELLE", "Récit court à personnages peu nombreux"),
        ("SAVON", "Ce qui lave le corps, jamais la conscience"),
        ("CRAVATE", "Ce que Dany porte pour traverser le village"),
        ("MEPRIS", "Ce que le livre combat de la première à la dernière page"),
        ("PEINTRE", "L'autre métier de Séverin Cécile Abega"),
        ("IRONIE", "Dire le contraire de ce qu'on pense, pour se moquer"),
        ("TOISER", "Regarder quelqu'un de haut en bas"),
    ], graine=29)
    b += e
    corriges += c

    e, c = jeux.qcm("As-tu lu les sept nouvelles ?", [
        ("Selon la Présentation, qui sont les quadrumanes ?",
         ["les oiseaux", "les singes", "les hommes de bureau",
          "les travailleurs"], 1),
        ("Que veut obtenir Tchakarias au début du « Fardeau » ?",
         ["une carte d'identité", "un pourboire", "du vin",
          "un poste au bureau"], 0),
        ("Qui est Ambombo ?",
         ["un vieux redoublant", "un instituteur",
          "la fille aux lunettes, ingénieur", "l'oncle de Dany"], 2),
        ("Comment s'appelle la grand-mère de Dany ?",
         ["Epképké I – Ndeck", "Mebara", "Towa", "Carmaillée"], 0),
        ("Pourquoi Serge s'enfuit-il en taxi ?",
         ["il est en retard", "il a peur d'être vu avec une vendeuse",
          "il a oublié son argent", "elle l'a insulté"], 1),
        ("De quoi vit Mbah ?",
         ["de la pêche", "de la vente de soya",
          "de ce qu'il trouve dans les poubelles", "d'un emploi de bureau"], 2),
        ("Pourquoi Towa reçoit-elle une gifle ?",
         ["elle a cassé la calebasse", "elle est rentrée tard",
          "elle a dit une vérité qu'on ne croit pas", "elle a menti"], 2),
        ("Que fait Garba dans la septième nouvelle ?",
         ["il vend du soya", "il conduit un taxi", "il soigne les malades",
          "il fouille les poubelles"], 0),
    ])
    b += e
    corriges += c

    e, c = jeux.vrai_faux("Vrai ou faux chez les bimanes", [
        ("Le mot « bimane » est un mot que tout le monde emploie.", False,
         "C'est un mot rare, qu'Abega redéfinit lui-même dans la Présentation."),
        ("Abega a aussi écrit l'avant-propos des *Chants de la Forêt*.", True,
         "Il le signe page 5 du recueil d'Anya Noa."),
        ("Dany finit par admirer le village.", False,
         "Il découvre surtout qu'il s'est trompé sur Ambombo : ce n'est pas la "
         "même chose que d'admirer."),
        ("Selon « Le savon », aucune saleté ne s'enlève.", False,
         "La saleté du corps s'enlève au savon ; celle qu'on gagne en volant "
         "ou en mentant, non."),
        ("Ahanda a échoué à ses examens.", False,
         "Il a le baccalauréat : il a choisi de rentrer, ce que le village "
         "prend pour un échec."),
        ("Une nouvelle se termine souvent par une chute.", True,
         "C'est même sa marque : une dernière phrase qui retourne tout."),
    ])
    b += e
    corriges += c

    e, c = jeux.qui_suis_je("Les visages du livre", [
        ("Je porte une veste et une cravate sous un soleil de plomb, mes "
         "souliers me mangent les orteils, et personne dans ce village ne me "
         "regarde.", "Dany (« Dans la forêt »)"),
        ("Je pousse un pousse-pousse de poubelle en poubelle, ma famille en "
         "meurt de honte, et j'ai les mains plus propres qu'eux.",
         "Mbah (« Le savon »)"),
        ("Je danse au bal comme une comète, et le lendemain je pleure devant "
         "ma friture.", "la petite vendeuse de beignets"),
        ("J'ai le baccalauréat et je préfère l'odeur de la terre mouillée à "
         "tous les parfums du monde.", "Ahanda (« Un étranger de passage »)"),
        ("Je n'ai plus travaillé depuis sept ans, mais mon vin de palme "
         "convainc les beaux-parents mieux que les discours des vieillards.",
         "Etoundi (« Mots d'enfants »)"),
    ])
    b += e
    corriges += c

    b += jeux.carte_mentale(
        "Les Bimanes", "LES BIMANES",
        [("Le genre", ["sept nouvelles", "récits courts à chute",
                       "textes primés à la radio"]),
         ("Les personnages", ["ceux qui travaillent de leurs mains",
                              "ceux qui portent une cravate",
                              "les enfants qui disent vrai"]),
         ("Les lieux", ["le village et sa cacaoyère", "la ville, le carrefour",
                        "le bureau, l'hôpital, le bal"]),
         ("Les thèmes", ["le mépris du travail manuel", "l'apparence trompeuse",
                         "l'école et la terre", "la honte de famille"]),
         ("Le style", ["l'ironie", "la comparaison qui change de monde",
                       "la chute finale"]),
         ("Ce que j'en pense", ["…", "…"])])

    b.append(saut())
    return b, corriges


# ======================================================== 7. Je m'évalue

ORTHO_FAUTIF = (
    "Chaque matin, Mbah pousse sa charette le long des trottoirs de la ville. "
    "Il s'arrete devant chaque poubele, se penche et fouille sans se presser. "
    "Les bouteilles vides vaut trente-cinq francs les cartons, eux, se vendent "
    "bien au marché. Ses voisins le regardent passer sans le saluer : ils "
    "racontent qu'il deshonore la famille. Pourtant, dès qu'il rentre, il se "
    "lave longuement les mains au savon, puis il compte tranquilement ses "
    "pièces sur la table. Ses habits sont propre et son cœur et léger. Les "
    "elegants qui l'évitent, eux, ont les mains blanches et les poches pleine "
    "d'argent volé. Aucun savon ne laveras jamais ses mains-là. Un jour, une "
    "fillete lui a demandé pourquoi il fouillait les ordures. Il à souri et "
    "lui a répondu qu'il cherchait de quoi payer l'école de son fils. Depuis, "
    "elle le salue quand elle le croise.")

ORTHO_CORRIGE = [
    ["1", "s'**arrete**", "s'**arrête**", "accent circonflexe manquant", "0,5"],
    ["2", "francs **_** les cartons", "francs **;** les cartons",
     "point-virgule manquant", "0,5"],
    ["3", "**deshonore**", "**déshonore**", "accent manquant", "0,5"],
    ["4", "Les **elegants**", "Les **élégants**", "accents manquants", "0,5"],
    ["5", "sa **charette**", "sa **charrette**", "orthographe d'usage : deux "
     "*r*", "1"],
    ["6", "chaque **poubele**", "chaque **poubelle**", "orthographe d'usage : "
     "deux *l*", "1"],
    ["7", "**tranquilement**", "**tranquillement**", "orthographe d'usage : "
     "deux *l*", "1"],
    ["8", "une **fillete**", "une **fillette**", "orthographe d'usage : deux "
     "*t*", "1"],
    ["9", "Les bouteilles vides **vaut**", "… **valent**",
     "accord sujet-verbe", "2"],
    ["10", "Ses habits sont **propre**", "… **propres**",
     "accord de l'attribut du sujet", "2"],
    ["11", "les poches **pleine**", "les poches **pleines**",
     "accord de l'adjectif dans le groupe nominal", "2"],
    ["12", "ne **laveras** jamais", "ne **lavera** jamais",
     "le sujet est *aucun savon* : 3ᵉ personne", "2"],
    ["13", "**ses** mains-là", "**ces** mains-là",
     "homophone : *ces* est un déterminant démonstratif", "2"],
    ["14", "son cœur **et** léger", "son cœur **est** léger",
     "homophone : *est* est le verbe être", "2"],
    ["15", "Il **à** souri", "Il **a** souri",
     "homophone : *a* est le verbe avoir", "2"],
]


def partie7():
    b = [h2("7. Je m'évalue — trois épreuves")]
    corriges = []

    texte = source.extrait(CLE, "Le piment est une bénédiction du ciel",
                           mots=330, arret=NOUVELLES)
    b += epreuve_etude_texte(
        "Au ministère du soya",
        chapeau="Cette septième nouvelle n'a pas été étudiée en classe : "
                "c'est ta lecture personnelle qui parle. Le narrateur commence "
                "par un éloge du piment et du soya, avant de suivre Garba, un "
                "vendeur qui vient de se couper la main.",
        texte=texte, source=SRC,
        comprehension=[
            ("De quoi le narrateur fait-il l'éloge dans ce passage ? "
             "Réponds en une phrase.", "2"),
            ("Qui sont les *maguidas* ? Recopie la définition donnée par le "
             "texte lui-même.", "2"),
            ("Relève trois adjectifs qui décrivent Garba. Quelle impression "
             "d'ensemble donnent-ils ?", "2"),
            ("Comment Garba s'est-il blessé ? Explique en deux phrases.", "2"),
            ("Le titre parle d'un « ministère ». Y a-t-il vraiment un "
             "ministère dans le texte ? Que veut dire ce titre, à ton avis ?",
             "2")],
        langue=[
            ("Relève quatre noms au pluriel et donne leur singulier.", "2"),
            ("« Garba descendit du taxi en catastrophe. » Donne la nature et "
             "la fonction de *Garba*, puis le temps de *descendit*.", "2"),
            ("Réécris « Le piment est une merveille » à la forme négative, "
             "puis au pluriel.", "2"),
            ("Relève deux adjectifs qualificatifs et donne leur féminin.", "2"),
            ("Trouve dans le texte un mot de la famille de *cuire*, un mot de "
             "la famille de *sang*, un mot de la famille de *couper*.", "2")])
    corriges += [h3("Épreuve 1 — Étude de texte : éléments de corrigé"),
                 grille([["Question", "Ce qu'on attend", "Pts"],
                         ["I.1", "Du piment et du soya : le narrateur les "
                          "présente comme une bénédiction et une merveille, "
                          "au point d'en parler comme d'une création divine.",
                          "2"],
                         ["I.2", "« Terme qui désigne les populations de type "
                          "soudanais habitant originellement la province "
                          "septentrionale de notre pays. »", "2"],
                         ["I.3", "Ex. : *noir, dépenaillé, mince, élancé, "
                          "déguenillé*. Ils disent la pauvreté et la maigreur : "
                          "Garba est un homme qui travaille dur et possède peu.",
                          "2"],
                         ["I.4", "Il découpait la viande d'un client ; "
                          "distrait par une jolie passante, il s'est entaillé "
                          "la main et s'est coupé une artère.", "2"],
                         ["I.5", "Il n'y a aucun ministère : c'est une image "
                          "moqueuse. Le narrateur donne au petit foyer de soya "
                          "le nom d'une grande administration — manière de dire "
                          "qu'il vaut mieux que bien des bureaux. Toute réponse "
                          "argumentée est acceptée.", "2"],
                         ["II.1", "Ex. : *brochettes/brochette · tranches/"
                          "tranche · babouches/babouche · merveilles/merveille*.",
                          "2"],
                         ["II.2", "*Garba* : nom propre, sujet du verbe "
                          "*descendit* — passé simple de l'indicatif.", "2"],
                         ["II.3", "Négative : *Le piment n'est pas une "
                          "merveille.* — Pluriel : *Les piments sont des "
                          "merveilles.*", "2"],
                         ["II.4", "Ex. : *savoureux → savoureuse ; crasseux → "
                          "crasseuse ; mince → mince ; banal → banale*.", "2"],
                         ["II.5", "*cuisson / culinaire* ; *sang / sanglant* ; "
                          "*couteau / découpait / coupé*.", "2"]])]

    b += epreuve_orthographe(ORTHO_FAUTIF,
                             "Texte composé pour l'épreuve, dans la manière du "
                             "recueil", nb_fautes=15)
    corriges += [h3("Épreuve 2 — Correction orthographique : corrigé"),
                 grille([["N°", "Écrit dans le texte", "Correction",
                          "Pourquoi", "Pts"]] + ORTHO_CORRIGE),
                 ("p", "**Total : 20 points.** Retirer **0,5 point** par mot "
                  "correct barré à tort.")]

    b += epreuve_expression([
        {"type": "Portrait et narration",
         "contexte": "Tout le livre repose sur une erreur de jugement : on "
                     "regarde les vêtements de quelqu'un, et l'on croit savoir "
                     "qui il est. Dany se trompe sur Ambombo ; Serge se trompe "
                     "sur la vendeuse ; la mère de Towa se trompe sur sa fille.",
         "citation": "Que ne peut-on ramasser les paroles qui ont franchi le "
                     "seuil de nos lèvres !",
         "source": SRC,
         "taches": [
             "Produis un **récit** de vingt à vingt-cinq lignes.",
             "Un personnage juge quelqu'un sur son apparence, puis découvre "
             "qu'il s'est trompé.",
             "**Obligatoire :** un portrait de six lignes au moins (physique "
             "et caractère) ; les cinq étapes du récit ; une **chute** de "
             "trois phrases courtes au maximum, qui n'explique rien."],
         "bareme": [["Le portrait joint le physique et le caractère", "5"],
                    ["Le récit est complet et l'erreur de jugement est claire",
                     "5"],
                    ["La chute est brève et ne s'explique pas", "3"],
                    ["Orthographe et ponctuation", "4"],
                    ["Présentation, écriture lisible, longueur respectée", "3"]]},
        {"type": "Argumentation",
         "contexte": "Dans « Le savon », un père explique à son fils qu'il "
                     "existe deux saletés : celle qui se voit et part au savon, "
                     "et celle qu'aucun savon n'enlève.",
         "citation": "Mon fils, le corps n'est jamais sale, car il y a le "
                     "savon.",
         "source": SRC,
         "taches": [
             "Produis un texte **argumentatif** de vingt à vingt-cinq lignes.",
             "Sujet : *« Un métier manuel vaut-il un métier de bureau ? »* "
             "Donne ton opinion et défends-la.",
             "**Obligatoire :** une opinion nuancée ; deux arguments expliqués ; "
             "**un exemple tiré du livre, avec une citation entre "
             "guillemets** ; quatre mots de liaison ; une conclusion."],
         "bareme": [["L'opinion est claire et nuancée", "3"],
                    ["Deux arguments sont donnés et expliqués", "5"],
                    ["L'exemple du livre est exact et cité correctement", "4"],
                    ["Les mots de liaison organisent le texte", "2"],
                    ["Orthographe et ponctuation", "4"],
                    ["Présentation et longueur", "2"]]},
    ])
    b.append(saut())
    return b, corriges
