# -*- coding: utf-8 -*-
"""
Fabrique `tartuffe_extraits.py` à partir de l'édition numérique du Tartuffe.

Les extraits d'une œuvre sont la seule partie d'un cahier qu'il est interdit
de retaper : une lettre déplacée dans un alexandrin détruit le vers, et le
cahier prétend l'analyser. Ils sont donc découpés dans le fichier source par
ce script, et le module produit n'est jamais édité à la main.

Nettoyages appliqués — et uniquement ceux-là :
  * appels de note de l'éditeur (`<a class="apnb">18</a>` et l'astérisque de
    renvoi au lexique de bas de page) ;
  * doubles parenthèses des didascalies internes, artefact du balisage ;
  * virgule suspendue d'un nom de personnage suivi d'une didascalie détachée
    (« ORGON, » puis « (À Cléante.) »).

Aucun mot de Molière n'est touché. Les six passages ont été relus vers à vers
sur le fichier source avant d'être retenus.

    python enrichissement/_gen_tartuffe_extraits.py
"""
import html
import io
import os
import re
import zipfile

SRC_EPUB = os.path.join(os.path.expanduser("~"), "Desktop", "Nouveau dossier (2)",
                        "Molière - Le Tartuffe @EpubsFR.epub")
ICI = os.path.dirname(os.path.abspath(__file__))
CIBLE = os.path.join(ICI, "tartuffe_extraits.py")

PARA = re.compile(r'<p class="([^"]+)"[^>]*>(.*?)</p>', re.S)
NOTE = re.compile(r'<a class="apnb".*?</a>', re.S)

# (clé, première ligne, dernière ligne, repère, référence)
PLAGES = [
    ("E1", 2, 74, "Acte I, scène 1 — l'exposition",
     "acte I, scène 1 (début de la pièce)"),
    ("E2", 284, 351, "Acte I, scène 4 — « Et Tartuffe ? — Le pauvre homme ! »",
     "acte I, scène 4 (scène entière)"),
    ("E3", 1351, 1411, "Acte III, scène 2 et ouverture de la scène 3 — l'entrée de l'imposteur",
     "acte III, scène 2 (scène entière) et scène 3 (les dix premiers vers)"),
    ("E4", 1644, 1712, "Acte III, scène 6 — l'aveu qui innocente",
     "acte III, scène 6 (des premiers vers à « la moindre égratignure »)"),
    ("E5", 2211, 2295, "Acte IV, scène 5 (fin) et scène 6 — la table",
     "acte IV, scène 5 (seconde moitié) et scène 6 (entière)"),
    ("E6", 2772, 2839, "Acte V, scène 7 — le retournement du dénouement",
     "acte V, scène 7 (des premiers vers à « rendre raison »)"),
]


def _texte(brut):
    brut = NOTE.sub("", brut)
    t = html.unescape(re.sub(r"<[^>]+>", "", brut))
    t = t.replace("\u00a0", " ").replace("*", "")
    t = re.sub(r"\(\s*\((.*?)\)\s*\)", r"(\1)", t)
    return re.sub(r"[ \t]+", " ", t).strip()


def lire_piece():
    """La pièce entière, une ligne par vers, avec ses repères de balisage."""
    z = zipfile.ZipFile(SRC_EPUB)
    out = []
    for nom in ("OPS/chap3.xhtml", "OPS/chap3-2.xhtml"):
        d = z.read(nom).decode("utf8")
        for cls, brut in PARA.findall(d):
            t = _texte(brut)
            if not t:
                continue
            if "acte_n" in cls:
                out.append("@@ %s" % t)
            elif "scene_n" in cls:
                out.append("@ %s" % t)
            elif "didasc" in cls:
                out.append("( %s )" % t.strip("() "))
            elif cls == "pers":
                out.append("$ %s" % t)
            else:
                out.append(t)
    fin = max(i for i, l in enumerate(out) if l.startswith("La flamme d’un amant"))
    return out[:fin + 1]


def mettre_en_page(lignes):
    """Nom de personnage en gras, didascalie entre parenthèses, vers tels quels."""
    out = []
    for k, l in enumerate(lignes):
        if l.startswith("@"):
            continue
        if l.startswith("$ "):
            nom = l[2:].strip()
            suivante = lignes[k + 1] if k + 1 < len(lignes) else ""
            if nom.endswith(",") and suivante.startswith("("):
                nom = nom[:-1]
            out.append("**%s**" % nom)
        elif l.startswith("("):
            out.append("(%s)" % l.strip("() ").strip())
        else:
            out.append(l)
    return "\n".join(out)


def main():
    piece = lire_piece()
    blocs = []
    for cle, a, b, repere, ref in PLAGES:
        texte = mettre_en_page(piece[a - 1:b])
        blocs.append((cle, repere, ref, texte, len(texte.split())))

    with io.open(CIBLE, "w", encoding="utf8") as f:
        f.write('''# -*- coding: utf-8 -*-
"""
Les six extraits du cahier « Tartuffe », relevés sur le texte intégral.

**Ce fichier est produit par `_gen_tartuffe_extraits.py` ; ne pas l'éditer.**
Toute retouche à la main d'un vers serait invisible et fausserait l'analyse
qui s'appuie dessus. Pour changer un extrait, changer la plage de lignes dans
le générateur et le relancer.

Molière, Tartuffe ou l'Imposteur, comédie en cinq actes et en vers, créée en
1664, publiée en 1669. Les passages sont continus : aucune coupe interne, donc
aucun […]. Les appels de note de l'éditeur ont été retirés.
"""

SRC = "Molière, Tartuffe ou l'Imposteur (1664-1669), "

''')
        for cle, repere, ref, texte, n in blocs:
            f.write('# %s — %s (%d mots)\n' % (cle, repere, n))
            f.write('%s = """%s"""\n\n' % (cle, texte))
        f.write("REFERENCES = {\n")
        for cle, repere, ref, texte, n in blocs:
            f.write('    "%s": SRC + "%s",\n' % (cle, ref))
        f.write("}\n\nREPERES = {\n")
        for cle, repere, ref, texte, n in blocs:
            f.write('    "%s": "%s",\n' % (cle, repere))
        f.write("}\n")

    for cle, repere, ref, texte, n in blocs:
        print("%s  %4d mots  %s" % (cle, n, repere))


main()
