# -*- coding: utf-8 -*-
"""
Fabrique `balafon_extraits.py` à partir du fichier source du recueil.

Comme pour les sept autres cahiers, les extraits ne sont jamais retapés : ils
sont découpés dans l'œuvre par ce script, et le module produit n'est pas
édité à la main. Mveng écrit en versets libres, de longueur très inégale ;
une ligne déplacée détruirait le rythme que les fiches analysent.

Chaque poème est reproduit **entier** — c'est l'unité qui vaut en poésie, non
la longueur.

    python enrichissement/_gen_balafon_extraits.py
"""
import io
import os
import re

import docx

SRC = os.path.join(os.path.expanduser("~"), "Desktop", "Nouveau dossier (2)",
                   "Engelbert MVENG, Balafon.docx")
ICI = os.path.dirname(os.path.abspath(__file__))
CIBLE = os.path.join(ICI, "balafon_extraits.py")

# ⚠️ Le fichier source place le titre de chaque poème **après** ses premiers
# versets, parfois au milieu d'une phrase : « Ta borne qui fonde tout » /
# « Adamawa (1959) » / « les rais de l'aube ». Se fier à la position du titre
# découperait donc des poèmes faux, mêlant la fin de l'un au début de l'autre.
#
# Les bornes sont posées sur le **texte des vers** : premier vers, dernier
# vers, relevés en lisant chaque transition. Le générateur vérifie qu'il les
# trouve, et dans cet ordre ; sinon il s'arrête au lieu de produire un extrait
# approximatif.
POEMES = [
    ("B1", "À Kong-Fu-Tseu", "« Lettres à mes amis »",
     "L'ouverture du recueil — l'Afrique tend la main à l'Asie",
     "section « Lettres à mes amis », poème entier, en tête du recueil",
     "De gazouillis d'enfants et d'aubes éclatées",
     "Et nous voici, côte à côte, depuis toujours"),

    ("B2", "Marcinelle, 1956", "Balafon",
     "L'oratorio de la catastrophe — chœurs et solistes",
     "poème entier, avec son prélude et ses parties de chœur",
     "Prélude.",
     "CETTE TERRE DES HOMMES."),

    ("B3", "New York", "Balafon",
     "L'Afrique et l'Amérique noire — le cri par-dessus l'Atlantique",
     "poème entier",
     "Ici la forêt vierge a la densité",
     "La paix ne viendra pas sur ton sommeil de Béhémoth"),

    ("B4", "Adamawa", "Balafon",
     "La terre pastorale devenue sanctuaire",
     "poème entier",
     "Fondamentale pour moi, Ta borne qui fonde tout",
     "De leurs noms bondissant sur la houle des tam-tams."),

    ("B5", "Épiphanie", "Balafon",
     "Un mage africain devant l'Enfant — les mains vides et l'or vivant",
     "poème entier",
     "...Dieu parmi les hommes.... Je dis : Emmanuel,",
     # Ce dernier vers revient deux fois dans le poème : il faut dire lequel.
     "Dans la chair vive de mes mains.", "L'or vivant de ton Afrique,"),

    # Le cœur du recueil manquait au parcours : l'audit pédagogique a montré
    # un saut de quarante-sept pour cent entre l'Épiphanie et l'Offrande, et
    # « Mère » — le plus long poème du volume, celui qui nomme l'Afrique
    # « Mère des Douleurs » — n'y figurait nulle part.
    ("B11", "Mère", "Balafon",
     "L'Afrique nommée Mère — la section centrale du poème",
     "section 4 du poème « Mère », en entier",
     "Homme, voici ta Mare !",
     "Hélas ! , loin de l'éteindre, le flot l'a rallumée..."),

    ("B6", "Offrande", "Balafon",
     "La clôture du recueil — la marmite d'argile et les mains de Dieu",
     "poème entier, dernière pièce du recueil",
     "Ma mère avait une marmite d'argile fine,",
     "SUR LA LEVRE DE DIEU."),

    # ── Supports de devoirs : ces quatre poèmes ne portent pas de fiche.
    ("B7", "Moteczuma", "« Lettres à mes amis »",
     "L'Afrique salue l'Amérique précolombienne",
     "section « Lettres à mes amis », poème entier",
     "A toi, Moteczuma,",
     "Les couvées, dans leurs nids, chanteront"),

    ("B8", "Tu reviendras, Sénégal !", "Balafon",
     "L'adieu au Sénégal, et la promesse du retour",
     "poème entier, daté de la Semaine sénégalaise de 1971",
     "Sénégal, Sénégal, ô mes rêves Sénégal !",
     "Fraternelle, libre, indivisée."),

    ("B9", "Lettre collective", "« Lettres à mes amis »",
     "Une réponse commune aux trois amis des continents",
     "section « Lettres à mes amis », poème entier",
     "A mes amis KONG-FU-TSEU, ROLAND-ROGER, MOTECZUMA",
     "Nous, votre marche d'espoir sous la lune et les étoiles"),

    ("B10", "Ostende-Douvre", "Balafon",
     "La Manche recomposée en paysage africain",
     "poème entier",
     "Tu n'es pas la poussière outragée",
     "Du long sommeil marin de leurs houles vagabondes"),
]

# Coquilles d'océrisation relevées une à une dans les six poèmes retenus, en
# regard du texte imprimé. Rien d'autre n'est touché : ce sont des lettres
# que le scan a mal lues, jamais des mots de l'auteur.
#   « 0 » (zéro) lu pour « Ô », « El » pour « Et », « II » pour « Il ».
# Les titres que le fichier imprime au milieu du texte. Ils sont retirés de
# l'extrait : ce ne sont pas des vers.
TITRES_PARASITES = {
    "A KONG-FU-TSEU", "A ROLAND-ROGER", "MOTECZUMA", "LETTRE COLLECTIVE",
    "Dépaysement (1958)", "Ostende-Douvre (1956)", "MARCINELLE, 1956",
    "New York (1970)", "Moscou (1971)", "Adamawa (1959)",
    "Tu reviendras, Sénégal ! (1971)", "Epiphanie (1962)",
    "Pentecôte sur l'Afrique (1964)", "Mère (1964)", "POSTFACE", "Offrande",
    "GLOSSAIRE", "LETTRES A MES AMIS", "Mappemonde (1961)",
}

SCAN = [
    (re.compile(r"(?<![0-9])\b0\b(?=\s+[a-zàâéèêîôûA-ZÀÂÉÈÊÎÔÛ])"), "Ô"),
    # « II » ne devient « Il » que devant un mot en minuscule : dans
    # « Offrande », les chiffres romains I, II, III… numérotent les parties
    # du poème, et les changer en « Il » détruirait sa construction.
    (re.compile(r"\bII\b(?=\s+[a-zàâéèêîôûç])"), "Il"),
    (re.compile(r"\bEl\b(?=\s+m['’])"), "Et"),
    # Apostrophe parasite collée devant un article : « Et 'des orphelins ».
    # Le scan a pris un signe diacritique pour une apostrophe ; la retirer
    # rend le vers de Mveng, elle ne le change pas.
    (re.compile(r"(?<=\s)'(?=(?:des|les|la|le|un|une|ses|nos)\s)"), ""),
]


def lignes_source():
    return [p.text.rstrip() for p in docx.Document(SRC).paragraphs]


def bornes(paras, debut, fin, depuis=0, apres=None):
    """(i, j) du poème, repérés par son premier et son dernier vers.

    `depuis` fait avancer la recherche poème après poème : deux pièces du
    recueil peuvent partager un vers, et l'ordre du volume tranche.

    `apres` désambiguïse un dernier vers qui revient à l'intérieur du même
    poème — Mveng reprend ses refrains. On cherche alors la fin **après** ce
    repère, lui-même unique.
    """
    i = next((k for k in range(depuis, len(paras))
              if paras[k].strip().startswith(debut)), None)
    if i is None and depuis:
        # Les supports de devoirs sont listés après les fiches, mais situés
        # plus tôt dans le volume : on reprend depuis le début.
        i = next((k for k in range(len(paras))
                  if paras[k].strip().startswith(debut)), None)
    if i is None:
        raise LookupError("premier vers introuvable : %r" % debut)
    depart = i
    if apres:
        depart = next((k for k in range(i, len(paras))
                       if paras[k].strip().startswith(apres)), None)
        if depart is None:
            raise LookupError("repère introuvable : %r" % apres)
    j = next((k for k in range(depart, len(paras))
              if paras[k].strip().startswith(fin)), None)
    if j is None:
        raise LookupError("dernier vers introuvable : %r" % fin)
    return i, j


def poeme(paras, i, j, titre_source=None):
    """Les versets d'un poème, blancs de strophe conservés.

    Le titre imprimé au milieu du texte est retiré : il n'est pas un vers.
    """
    out = []
    for t in paras[i:j + 1]:
        s = t.strip()
        if s in TITRES_PARASITES:
            continue                       # titre inséré au milieu du poème
        for motif, rempl in SCAN:
            s = motif.sub(rempl, s)
        out.append(s)
    # Un seul blanc entre deux mouvements, aucun en tête ni en queue.
    texte = "\n".join(out)
    texte = re.sub(r"[ \t]+\n", "\n", texte)
    texte = re.sub(r"\n{3,}", "\n\n", texte)
    return texte.strip("\n")


def main():
    paras = lignes_source()
    L = ['# -*- coding: utf-8 -*-',
         '"""',
         "Les six poèmes du cahier « Balafon », relevés sur le fichier source.",
         "",
         "**Ce fichier est produit par `_gen_balafon_extraits.py` ; ne pas",
         "l'éditer.** Mveng écrit en versets libres : une ligne déplacée",
         "détruirait le rythme que les fiches analysent. Pour changer un poème,",
         "changer ses bornes dans le générateur et le relancer.",
         "",
         "Engelbert Mveng, Balafon, 1972. Chaque poème est reproduit **entier** :",
         "aucune coupe, donc aucun […]. Les six pièces couvrent le recueil de",
         "son ouverture à sa clôture.",
         '"""',
         "",
         'SRC = "Engelbert Mveng, Balafon, 1972, "',
         ""]
    fiches = []
    depuis = 0
    for entree in POEMES:
        cle, titre, section, repere, ref, v1, vn = entree[:7]
        apres = entree[7] if len(entree) > 7 else None
        i, j = bornes(paras, v1, vn, depuis, apres)
        depuis = j
        t = poeme(paras, i, j)
        n = len(t.split())
        v = sum(1 for x in t.split("\n") if x.strip())
        L.append("# %s — %s — %s (%d versets, %d mots)" % (cle, titre, repere, v, n))
        L.append('%s = """%s"""' % (cle, t.replace("\\", "\\\\")))
        L.append("")
        fiches.append((cle, titre, section, repere, ref))
        print("  %-3s %-26s %3d versets %5d mots" % (cle, titre, v, n))

    L.append("# Titre, section et référence de chaque poème. La référence nomme")
    L.append("# l'unité reproduite : l'audit le vérifie.")
    L.append("REFERENCES = {")
    for cle, titre, section, repere, ref in fiches:
        L.append('    "%s": ("%s", "%s",' % (cle, titre, section))
        L.append('           "%s"),' % ref)
    L.append("}")
    L.append("")
    L.append("REPERES = {")
    for cle, titre, section, repere, ref in fiches:
        L.append('    "%s": "%s",' % (cle, repere.replace('"', "'")))
    L.append("}")
    L.append("")

    io.open(CIBLE, "w", encoding="utf8").write("\n".join(L))
    print("\nbalafon_extraits.py écrit — %d poèmes." % len(fiches))


if __name__ == "__main__":
    main()
