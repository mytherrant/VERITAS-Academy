# -*- coding: utf-8 -*-
"""
Fabrique `sauvages_extraits.py` à partir du document source du poème.

Même principe que pour le Tartuffe : les extraits d'une œuvre ne se retapent
pas. Ils sont découpés dans le fichier source par ce script, et le module
produit n'est jamais édité à la main.

    python enrichissement/_gen_sauvages_extraits.py

**Nettoyages appliqués — et uniquement ceux-là.**

Le document source est une numérisation. Un seul défaut y est systématique :
la lettre « f » initiale est lue « F » (« la Force imbécile », « les Feux de
brousse », « tous les Fils »). Ce n'est pas un choix de l'auteur — sa poétique
supprime au contraire toute majuscule, y compris en début de vers, et le même
mot revient ailleurs en minuscule. Aucun nom propre du poème ne commence par
un F : la correction est donc sans risque, et la liste des noms propres
rencontrés est vérifiée ci-dessous.

S'y ajoutent deux corrections ponctuelles, relevées une par une.

**Ce qui n'a PAS été corrigé.** « de la bête ô balles trouant… » : on pourrait
croire à un « à » mal lu. Vérification faite, le poème emploie dix autres fois
la même construction — « ô étoile », « ô orage », « ô mémoire », « ô assassins »
— c'est une apostrophe, et le vers est juste tel quel.
"""
import io
import os
import re

import docx

SRC = os.path.join(os.path.expanduser("~"), "Desktop", "Adit manuels",
                   "Poèmes sauvages éclairés au feu de brousse.docx")
ICI = os.path.dirname(os.path.abspath(__file__))
CIBLE = os.path.join(ICI, "sauvages_extraits.py")

# Le poème commence après la dédicace, les épigraphes et « Comme introduction ».
PREMIER_VERS = 34

# Noms propres du poème : aucun ne commence par F. Vérifié sur le relevé
# exhaustif des formes capitalisées du texte.
NOMS_PROPRES = {
    "Anglais", "Bamako", "Barcelone", "Bible", "Bouddha", "Bruxelles",
    "Bruxellois", "Caire", "Caraïbe", "Chibok", "Coran", "Darfour", "Dieu",
    "Etienne-du-Rouvray", "Garissa", "Goethe", "Grand-Bassam", "Hamel",
    "Harvey", "Henrike", "Institut", "Irma", "Kaboul", "Londres", "Maroua",
    "Maïduguri", "Mogadiscio", "Niamey", "Ouagadougou", "Oussama", "Palmyre",
    "Paris", "Plateau", "Ramblas", "Sousse", "Tombouctou", "Torah",
}

CORRECTIONS = [
    ("Maîduguri", "Maïduguri"),          # ï lu î
    ("Saint- Etienne", "Saint-Étienne"),  # césure de fin de ligne + accent
]

# (clé, première ligne, dernière ligne, repère, référence)
PLAGES = [
    ("S1", 35, 58, "Le froid dans le soleil — l'annonce de la mort",
     "pages 9-10 (extrait 2 du dossier pédagogique de l'auteur)"),
    ("S2", 159, 183, "« et mon jour meurt mille fois » — l'inventaire des lieux frappés",
     "pages 28-31 (extrait 3 du dossier pédagogique de l'auteur)"),
    ("S3", 243, 261, "« et nous sommes, Henrike » — le couteau et la meute",
     "pages 39-40 (extrait 4 du dossier pédagogique de l'auteur)"),
    ("S4", 462, 484, "« et tu me regardes, Henrike » — le retour du souvenir heureux",
     "page 63 (extrait 5 du dossier pédagogique de l'auteur)"),
    ("S5", 658, 675, "« nous ne serons plus » — le renversement de l'énumération",
     "pages 84-86 (extrait 6 du dossier pédagogique de l'auteur)"),
    ("S6", 697, 715, "« ce jour-là » — la promesse et l'appel",
     "pages 90-91 (extrait 7 du dossier pédagogique de l'auteur)"),
]


def corriger(v):
    for a, b in CORRECTIONS:
        v = v.replace(a, b)

    def bas(m):
        mot = m.group(0)
        return mot if mot in NOMS_PROPRES else mot[0].lower() + mot[1:]

    return re.sub(r"\bF[a-zà-ÿ’'-]+", bas, v)


def lire_poeme():
    """Toutes les lignes du document, vides comprises : elles font les strophes."""
    d = docx.Document(SRC)
    return [corriger(p.text.rstrip()) for p in d.paragraphs]


def main():
    lignes = lire_poeme()
    assert len(lignes) > 700, "document source inattendu"

    blocs = []
    for cle, a, b, repere, ref in PLAGES:
        seg = lignes[a - 1:b]
        while seg and not seg[0].strip():
            seg = seg[1:]
        while seg and not seg[-1].strip():
            seg = seg[:-1]
        texte = "\n".join(seg)
        blocs.append((cle, repere, ref, texte, len(texte.split()),
                      sum(1 for x in seg if x.strip())))

    with io.open(CIBLE, "w", encoding="utf8") as f:
        f.write('''# -*- coding: utf-8 -*-
"""
Les six extraits du cahier « Poèmes sauvages éclairés au feu de brousse ».

**Ce fichier est produit par `_gen_sauvages_extraits.py` ; ne pas l'éditer.**
Le poème est en vers libres, sans majuscule et presque sans ponctuation : une
retouche à la main y serait invisible et fausserait l'analyse qui s'appuie
dessus. Pour changer un extrait, changer la plage de lignes dans le générateur
et le relancer.

Henri N'koumo, Poèmes sauvages éclairés au feu de brousse, Abidjan, Les
Classiques Ivoiriens, 2022. Les six passages reprennent le découpage proposé
par l'auteur lui-même dans le dossier pédagogique joint au volume — six des
sept extraits qu'il recommande d'étudier. Le septième, « Comme introduction »,
est traité dans l'analyse du paratexte : il précède le poème et ne fait qu'une
centaine de mots.

Les blancs de strophe du volume sont conservés : ils font partie du texte.
"""

SRC = "Henri N'koumo, Poèmes sauvages éclairés au feu de brousse, Abidjan, Les Classiques Ivoiriens, 2022, "

''')
        for cle, repere, ref, texte, n, v in blocs:
            f.write("# %s — %s (%d mots, %d vers)\n" % (cle, repere, n, v))
            f.write('%s = """%s"""\n\n' % (cle, texte))
        f.write("REFERENCES = {\n")
        for cle, repere, ref, texte, n, v in blocs:
            f.write('    "%s": SRC + "%s.",\n' % (cle, ref))
        f.write("}\n\nREPERES = {\n")
        for cle, repere, ref, texte, n, v in blocs:
            f.write('    "%s": "%s",\n' % (cle, repere))
        f.write("}\n")

    for cle, repere, ref, texte, n, v in blocs:
        print("%s  %4d mots  %2d vers  %s" % (cle, n, v, repere))


main()
