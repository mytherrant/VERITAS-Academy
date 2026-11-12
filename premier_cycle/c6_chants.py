# -*- coding: utf-8 -*-
"""6ᵉ — *Les Chants de la Forêt*, Lucien Anya Noa (Afrédit, 2011).

Tout ce qui est affirmé ici a été relevé dans le livre : les dix-huit titres du
sommaire, les noms béti des bêtes (Kulu, Zee, Mvomo, Dzungo'o, Ndoe, Kos, Zog,
Olong…), les proverbes de clôture, et jusqu'aux « Notes pédagogiques » que
l'auteur a placées à la fin de son recueil et où il expose lui-même ce qu'est
un conte. L'avant-propos est signé **Séverin Cécile Abega** — l'auteur des
*Bimanes*, étudié dans le même volume : c'est la première passerelle, et elle
n'est pas inventée, elle est imprimée en page 5.
"""
import jeux
import source
from gabarit import (cote_enseignant, epreuve_etude_texte, epreuve_expression,
                     epreuve_orthographe, lecture_suivie, ouvrir, production)
from kit import cases, enc, grille, h1, h2, h3, lignes, num, p, pi, puce, saut

CLE = "chants"
SRC = "Lucien Anya Noa, *Les Chants de la Forêt*, Afrédit, Yaoundé, 2011"


def _x(amorce, mots=150, **kw):
    return source.extrait(CLE, amorce, mots=mots, **kw)


# ============================================================ 1. J'ouvre

def partie1():
    return [h1("Œuvre 1 — Les Chants de la Forêt, de Lucien Anya Noa")] + ouvrir(
        "Les Chants de la Forêt", "Lucien Anya Noa",
        questions_couverture=[
            "Lis le titre à voix haute : **Les Chants de la Forêt**. Une forêt, "
            "ça chante ? Qu'est-ce qui peut bien chanter, là-dedans ?",
            "Le sous-titre annonce *Contes et Chantefables du Cameroun*. Tu "
            "connais le mot « conte ». Mais « chantefable » ? Coupe le mot en "
            "deux : que trouves-tu ?",
            "D'après toi, qui parle dans ce livre : des hommes, des bêtes, ou "
            "les deux ? Note ta réponse — on la vérifiera.",
            "Cite un conte que ta grand-mère, ton grand-père ou ton oncle t'a "
            "déjà raconté. Écris son titre, même approximatif."],
        promesses=[
            "Quel animal sera le plus fort de ce livre ?",
            "Est-ce que les animaux se marient, dans ces contes ?",
            "Y aura-t-il des morts ? Des bagarres ? Des procès ?",
            "À quoi sert un conte, à ton avis : à rire, ou à apprendre ?"],
        journal_exemple=["12/09", "« L'intelligence, l'aînée de la force »",
                         "Kulu gagne la course contre Zee en trichant un peu",
                         "Pourquoi personne ne s'aperçoit de la triche ?"])


# ======================================================= 2. L'auteur, le livre

def partie2():
    b = [h2("2. L'auteur et son livre"),
         h3("Lucien Anya Noa, l'homme qui a écouté la forêt"),
         p("Lucien Anya Noa est né à **Angonfeme**, au Cameroun. Il fait son "
           "école primaire à **Ngomedzap**, puis entre aux petits séminaires "
           "de **Mvaa** et d'**Akono**, de 1948 à 1954. Après son baccalauréat "
           "il rejoint le grand séminaire d'**Otélé**, et il est ordonné prêtre "
           "en **1963**."),
         p("Ensuite, il part étudier à **la Sorbonne**, à Paris, de 1965 à "
           "1968 : il en revient licencié ès lettres classiques et modernes, et "
           "diplômé de linguistique. Il dirige les études au petit séminaire de "
           "Mbalmayo, il est principal du collège Tobie Atangana, il **fonde le "
           "collège Noa en 1972** et la paroisse Toussaints d'Oyack en 1980. Il "
           "a traduit **la Bible en langue ewondo**."),
         enc("culture", "Un homme, deux bibliothèques", [
             "Regarde bien ce parcours : le même homme apprend le latin et le "
             "grec à Paris, **et** note les devinettes, les berceuses et les "
             "chants d'oiseaux de son village.",
             "Il a publié *La poésie beti*, *Mimbenge*, *Les énigmes beti*, "
             "*La Sagesse beti dans le chant des oiseaux*, *La Berceuse beti*.",
             "Autrement dit : il n'a jamais cru qu'il fallait choisir entre "
             "l'école et la maison de son grand-père. **Toi non plus.**"]),
         h3("Un livre présenté par un autre écrivain… que tu vas aussi étudier"),
         p("Ouvre ton livre à la page 5. L'avant-propos n'est pas signé par "
           "Anya Noa : il est signé **Séverin Cécile Abega**. Retiens ce nom. "
           "C'est l'auteur des ***Bimanes***, la deuxième œuvre de ce manuel. "
           "Tes deux premiers livres de l'année se donnent donc la main dès la "
           "cinquième page."),
         ("extrait", source.extrait(CLE, "Les contes gardent vivante", mots=55),
          "Séverin Cécile Abega, avant-propos des *Chants de la Forêt*"),
         enc("perso", "« C'était leur école »", [
             "Abega ne dit pas que le conte **ressemble** à l'école. Il dit que "
             "le conte **était** l'école.",
             "Avant les salles de classe, les tableaux et les craies, on "
             "apprenait à vivre le soir, assis par terre, en écoutant "
             "quelqu'un raconter l'histoire d'une tortue et d'un léopard.",
             "Ce livre est donc un vieux cahier de leçons. Sauf qu'on y rit."]),
         h3("Ce qu'il y a dedans : dix-huit histoires et un mode d'emploi"),
         p("Le recueil contient **dix-huit contes**, puis des **Notes "
           "pédagogiques** où l'auteur explique lui-même comment un conte est "
           "fabriqué, et enfin un **glossaire**. Voici le sommaire, tel qu'il "
           "est imprimé :"),
         grille([["N°", "Titre du conte", "N°", "Titre du conte"],
                 ["1", "L'intelligence, l'aînée de la force", "10",
                  "La vérité vaut mieux que le mensonge"],
                 ["2", "La sagesse et la folie", "11", "Si tu entends dire…"],
                 ["3", "La parole vaut contrat", "12", "Il n'y a qu'une vérité"],
                 ["4", "Le mariage de Kulu", "13",
                  "Trop de conseils rendirent le varan sourd"],
                 ["5", "Le caméléon et le margouillat", "14",
                  "La mère, le père et le chimpanzé"],
                 ["6", "Si Dieu le permet", "15", "Kulu la Tortue et Ndoe l'Aigle"],
                 ["7", "Le chien et le chimpanzé", "16", "Kulu, Zee et les cabris"],
                 ["8", "Tromperie n'est pas amitié", "17",
                  "La mère de Léopard s'est-elle transformée en résine ?"],
                 ["9", "Les deux jeunes gens", "18", "Le chant du bigorneau"]]),
         enc("astuce", "Une bonne nouvelle pour toi", [
             "Un recueil de contes ne se lit pas comme un roman : **tu peux "
             "t'arrêter au bout de chaque histoire** sans rien perdre.",
             "Deux contes par soir, et tu as fini le livre en neuf jours."]),
         h3("Le conte, expliqué par l'auteur lui-même"),
         p("À la fin du livre, Anya Noa a écrit un petit cours. Il y explique "
           "que le conte s'ouvre et se ferme toujours par des **formules**. En "
           "voici quelques-unes, relevées dans son propre recueil :"),
         grille([["Pour ouvrir l'histoire", "Pour la fermer"],
                 ["« Autrefois… », « Il arriva une fois… »",
                  "« Tout est contagieux, la sagesse comme la folie… »"],
                 ["« Un jour… », « Voici ce qui arriva… »",
                  "« C'est ainsi donc que… », « Voilà pourquoi… »"],
                 ["« Ô fils de mon père, voici le conte ! »",
                  "« Un pacte est dangereux… »"],
                 ["« Que les oreilles s'ouvrent ! »",
                  "« La vérité vaut mieux que le mensonge. »"]]),
         enc("mot", "Trois mots à mettre dans ta poche", [
             "**Un conte** : une histoire inventée, qu'on se raconte le soir.",
             "**Une fable** : la même chose, mais qui vise clairement à "
             "t'apprendre quelque chose ; elle finit par une morale.",
             "**Une chantefable** : un conte **dans lequel on chante**. Dans "
             "« Le chant du bigorneau », l'histoire s'arrête cinq fois pour "
             "qu'on entonne la chanson de l'Interdiction. Essaie : tu verras "
             "que le conte devient tout de suite plus vivant."]),
         enc("rire", "La forêt, ce tribunal très occupé", [
             "Compte, en lisant : dans ce livre, on tient un **procès** pour "
             "un python qui chasse hors de sa zone, un **héritage** disputé "
             "pour un sac de kolas, une **plainte** pour vol de kolas, une "
             "**enquête d'identité** pour savoir si la chauve-souris est un "
             "oiseau ou un animal à poils.",
             "Bref : la forêt d'Anya Noa passe son temps au tribunal. Et "
             "l'avocat qui gagne tous ses procès mesure trente centimètres et "
             "marche à quatre pattes."]),
         saut()]
    return b


# =========================================================== 3. Qui est qui

def partie3():
    b = [h2("3. Qui est qui dans la forêt"),
         p("Dans ces contes, les bêtes portent leur **nom béti**. C'est plus "
           "joli, et c'est plus juste : ce sont des personnages, pas des "
           "espèces. Apprends-les, tu en auras besoin à chaque page."),
         grille([["Nom dans le livre", "Qui c'est", "Son caractère",
                  "Combien de fois il paraît"],
                 ["**Kulu**", "la Tortue", "rusée, patiente, un peu tricheuse",
                  "116 fois — c'est la vedette"],
                 ["**Zee**", "le Léopard", "fort, colérique, toujours berné",
                  "82 fois"],
                 ["**Ndoe**", "l'Aigle", "orgueilleux, croit être hors d'atteinte",
                  "25 fois"],
                 ["**Dzungo'o**", "le Caméléon", "lent, prudent, très rusé",
                  "14 fois"],
                 ["**Mvomo**", "le Python", "chasse là où il n'a pas le droit",
                  "6 fois"],
                 ["**Zog**", "l'Éléphant", "énorme, sûr de lui, et qui fuit",
                  "5 fois"],
                 ["**Kos**", "le Perroquet", "le messager, celui qui répète tout",
                  "9 fois"],
                 ["**Olong**", "le Bigorneau", "minuscule, et il fait fuir tout "
                  "le monde", "le héros du dernier conte"],
                 ["**Berne**", "le Sanglier", "gras et fier de l'être", "12 fois"],
                 ["**Zameyo Mebenga**", "un homme", "le père de la plus belle "
                  "fille du pays", "11 fois"]]),
         enc("animal", "Pourquoi la tortue ?", [
             "Regarde une tortue : pas de griffes, pas de crocs, pas de "
             "vitesse. Sur le papier, elle devrait perdre à tous les coups.",
             "C'est exactement pour cela qu'on l'a choisie. Un conte où le "
             "plus fort gagne n'apprend rien à personne — tout le monde le "
             "savait déjà. Un conte où **le plus petit gagne** apprend quelque "
             "chose à tous les petits qui écoutent. C'est-à-dire à toi.",
             "Son surnom dans le livre : **« Tortue Aux-Cent-Astuces »**."]),
         enc("animal", "Le caméléon marche lentement — et le sol tient bon", [
             "Deux fois dans le recueil revient cette phrase que les hommes "
             "disent au caméléon : *« Caméléon, marche lentement, de peur que "
             "la terre ne s'effondre. »*",
             "C'est une plaisanterie et un compliment en même temps. On se "
             "moque de sa lenteur — et on lui prête assez de puissance pour "
             "faire trembler le sol. Le caméléon, lui, ne dément pas.",
             "Vrai de vrai : un caméléon bouge chaque œil **séparément**. Il "
             "peut te regarder en avant et en arrière au même moment. "
             "Difficile de lui mentir."]),
         enc("animal", "Le bigorneau, ce minuscule terroriste", [
             "Un bigorneau est un tout petit coquillage. Dans le dernier "
             "conte, il chante au fond de l'eau — et il fait fuir "
             "successivement l'Éléphant, le Léopard et le **Lion**.",
             "Trois des plus gros animaux d'Afrique battus par quelque chose "
             "qui tient dans une main d'enfant. Anya Noa adore cette blague : "
             "il la raconte dix-huit fois avec des bêtes différentes."]),
         enc("lieu", "Où se passe tout cela ?", [
             "Dans **la grande forêt équatoriale**, celle du Sud-Cameroun : "
             "des bosquets, des cours d'eau à franchir, des kolatiers derrière "
             "les cases, des bananeraies, un tribunal en plein air.",
             "Les lieux réels de la vie de l'auteur ne sont pas loin : "
             "Angonfeme, Ngomedzap, Mbalmayo, Akono, Oyack. Cherche-les sur "
             "une carte du Cameroun : tu marches dans la forêt du conteur."])]

    e, c = jeux.relier(
        "Chacun son caractère",
        [("Kulu", "Il gagne par la ruse, jamais par la force"),
         ("Zee", "Il est le plus fort — et il perd à chaque fois"),
         ("Dzungo'o", "Il arrive toujours en retard, et il a raison"),
         ("Ndoe", "Il se croit à l'abri au sommet d'un arbre"),
         ("Kos", "Il porte les messages et répète tout ce qu'il entend"),
         ("Olong", "Il est minuscule, et sa voix fait fuir le lion")],
        graine=61)
    b += e
    b.append(enc("defi", "Le défi des trente secondes", [
        "Ferme le manuel. Cite **cinq** noms béti d'animaux du recueil, avec "
        "leur traduction. Cinq sur cinq : tu es prêt. Moins de trois : "
        "relis le tableau, il te servira jusqu'à la dernière page."]))
    b.append(saut())
    return b, c


# ======================================================= 4. Lectures suivies

