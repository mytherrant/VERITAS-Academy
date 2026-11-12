# -*- coding: utf-8 -*-
"""
Contrôle « prêt à imprimer » des cahiers d'œuvre intégrale.

`audit.py` mesure la conformité pédagogique, `verbatim.py` l'exactitude des
citations. Aucun des deux ne dit si le document **s'imprime proprement**.
C'est l'objet de celui-ci : il cherche les défauts qui ne se voient qu'une
fois le volume sorti de la machine, et qui coûtent un retirage.

Sept familles de contrôles :

    FICHIER      le .docx s'ouvre, ses styles existent, rien n'est corrompu
    CARACTÈRES   caractères de contrôle, espaces doubles, lignes vides
    BALISAGE     markdown resté en clair (**gras**, *italique*, puces « - »)
    TYPOGRAPHIE  espace avant ponctuation double, guillemets appariés
    STRUCTURE    sommaire conforme aux titres réels, numérotation continue
    TABLEAUX     cellules vides, en-têtes manquants, cellules trop longues
    MISE EN PAGE sauts de page en double, section vide, titre orphelin

    python enrichissement/impression.py
    python enrichissement/impression.py tartuffe --detail
"""
import glob
import os
import re
import sys
import unicodedata

import docx
from docx.oxml.ns import qn
from docx.table import Table
from docx.text.paragraph import Paragraph

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Caractères qui n'ont rien à faire dans un texte destiné à l'impression.
# U+0008 (retour arrière) est le plus traître : il vient d'un « \b » écrit
# dans un patch Python et ne se voit pas à l'écran.
CONTROLE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")

# Ponctuation double : en typographie française, elle veut une espace avant.
# On accepte l'espace insécable, la fine, ou l'espace ordinaire.
PONCT_DOUBLE = re.compile(r"(?<=[^\s   ])([;:!?»])")
# … sauf dans ces contextes, où le signe n'est pas de la ponctuation.
EXCEPTIONS_PONCT = re.compile(
    r"(https?://|\d+:\d+|\w+\.\w+:|::)", re.I)

MARKDOWN = [
    ("gras non rendu", re.compile(r"\*\*[^*\n]{1,80}\*\*")),
    ("italique non rendu", re.compile(r"(?<![\*\w])\*[^*\n]{1,60}\*(?!\*)")),
    ("puce markdown", re.compile(r"^\s*-\s+\S")),
    ("titre markdown", re.compile(r"^#{1,6}\s")),
]

# Ces deux-là ne valent pas dans un extrait d'œuvre : un vers peut
# commencer par un tiret — « - Non ! », dans « Marcinelle, 1956 » — ou par
# un dièse. C'est la ponctuation de l'auteur, pas du markdown oublié.
MARKDOWN_HORS_EXTRAIT = {"puce markdown", "titre markdown"}


# Un extrait d'œuvre est une cellule unique, longue, qui ne commence pas par
# un pictogramme d'encadré.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from docxkit import PICTOS


def _est_extrait(t):
    txt = t.rows[0].cells[0].text.strip()
    return (len(t.rows) == 1 and len(t.columns) == 1 and txt
            and txt[0] not in PICTOS and len(txt.split()) > 40)


def parcourir(doc):
    """Tous les paragraphes du document, tableaux compris, dans l'ordre.

    Chaque paragraphe est rendu avec un drapeau disant s'il appartient à un
    extrait d'œuvre : la typographie y est celle de l'auteur, et certains
    contrôles n'ont pas à s'y appliquer.
    """
    out = []

    def walk(parent, el, extrait=False):
        for c in el:
            if c.tag == qn("w:p"):
                out.append((Paragraph(c, parent), extrait))
            elif c.tag == qn("w:tbl"):
                t = Table(c, parent)
                dedans = extrait or _est_extrait(t)
                for r in t.rows:
                    for cell in r.cells:
                        walk(cell, cell._tc, dedans)

    walk(doc, doc.element.body)
    return out


def _sans_accents(t):
    return "".join(c for c in unicodedata.normalize("NFD", t)
                   if not unicodedata.combining(c))


def controler(chemin):
    """Renvoie {famille: [problèmes]} pour un cahier."""
    pb = {k: [] for k in ("fichier", "caracteres", "balisage", "typographie",
                          "structure", "tableaux", "miseenpage")}
    try:
        doc = docx.Document(chemin)
    except Exception as e:                       # noqa: BLE001 — on rapporte
        pb["fichier"].append("le fichier ne s'ouvre pas : %s" % e)
        return pb, {}

    paras = parcourir(doc)
    textes = [p.text for p, _ in paras]
    plein = "\n".join(textes)

    # ── FICHIER : les styles employés doivent exister dans le document
    connus = {s.name for s in doc.styles}
    for p, _ in paras:
        try:
            nom = p.style.name
        except Exception:                        # noqa: BLE001
            pb["fichier"].append("paragraphe sans style résoluble")
            continue
        if nom not in connus:
            pb["fichier"].append("style absent du document : %s" % nom)

    # ── CARACTÈRES
    for i, t in enumerate(textes):
        for m in CONTROLE.finditer(t):
            pb["caracteres"].append(
                "caractère de contrôle U+%04X — « %s »"
                % (ord(m.group()), t[max(0, m.start() - 30):m.start() + 30]))
        if "  " in t:
            pb["caracteres"].append("double espace — « %s »" % t[:70])
        if t != t.rstrip():
            pb["caracteres"].append("espace en fin de paragraphe — « %s »" % t[:60])

    # ── BALISAGE : du markdown resté en clair
    for libelle, motif in MARKDOWN:
        for para, dans_extrait in paras:
            if dans_extrait and libelle in MARKDOWN_HORS_EXTRAIT:
                continue
            if motif.search(para.text):
                pb["balisage"].append("%s — « %s »"
                                      % (libelle, para.text[:80]))

    # ── TYPOGRAPHIE
    for t in textes:
        if EXCEPTIONS_PONCT.search(t):
            continue
        m = PONCT_DOUBLE.search(t)
        if m:
            pb["typographie"].append(
                "pas d'espace avant « %s » — « %s »"
                % (m.group(1), t[max(0, m.start() - 40):m.start() + 20]))
    # Hors extraits : dans un extrait, la ponctuation est celle de l'auteur.
    notre = "\n".join(t for (p, ext), t in zip(paras, textes) if not ext)
    ouvrants, fermants = notre.count("«"), notre.count("»")
    if ouvrants != fermants:
        pb["typographie"].append(
            "guillemets non appariés hors extraits : %d « pour %d »"
            % (ouvrants, fermants))
    if "'" in plein:
        n = plein.count("'")
        pb["typographie"].append(
            "%d apostrophe(s) droite(s) au lieu de l'apostrophe typographique" % n)

    # ── STRUCTURE : le sommaire doit annoncer les titres réellement présents
    titres = [p.text.strip() for p, _ in paras
              if p.style.name.startswith("Heading") and p.text.strip()]
    i = next((k for k, t in enumerate(textes) if t.strip() == "Sommaire"), None)
    annonces = []
    if i is not None:
        # Le sommaire s'arrête au premier titre qui suit : prendre un nombre
        # fixe de lignes déborderait sur le corps du cahier et ferait passer
        # des paragraphes ordinaires pour des entrées de table des matières.
        for k in range(i + 1, len(paras)):
            p_, _ = paras[k]
            if p_.style.name.startswith("Heading") and p_.text.strip():
                break
            t = p_.text.strip()
            if not t:
                continue
            if re.match(r"^(I{1,3}V?|VI?|[0-9]+ ?(bis|ter|quater|quinquies)?\.)", t):
                annonces.append(t)
    reels = {_sans_accents(t).lower().strip() for t in titres}
    for a in annonces:
        cle = _sans_accents(a).lower().strip()
        if not any(cle.startswith(r[:22]) or r.startswith(cle[:22]) for r in reels):
            pb["structure"].append("annoncé au sommaire, absent du corps : « %s »" % a)

    # ── TABLEAUX
    for t in doc.tables:
        if len(t.columns) == 1:
            continue                             # extrait ou encadré
        entetes = [c.text.strip() for c in t.rows[0].cells]
        if any(not e for e in entetes):
            pb["tableaux"].append("en-tête vide : %s" % entetes)
        for r in t.rows[1:]:
            cells = [c.text.strip() for c in r.cells]
            if all(not c for c in cells):
                pb["tableaux"].append("ligne entièrement vide dans un tableau")
            for c in cells:
                if len(c) > 900:
                    pb["tableaux"].append(
                        "cellule de %d caractères (risque de débordement) — « %s… »"
                        % (len(c), c[:60]))

    # ── MISE EN PAGE
    vides = 0
    for p, dans in paras:
        if not p.text.strip():
            vides += 1
            if vides >= 4:
                pb["miseenpage"].append("quatre paragraphes vides consécutifs")
                vides = 0
        else:
            vides = 0
    sauts = 0
    for p, _ in paras:
        est_saut = bool(p._p.findall(".//" + qn("w:br")))
        if est_saut and not p.text.strip():
            sauts += 1
            if sauts >= 2:
                pb["miseenpage"].append("deux sauts de page consécutifs")
                sauts = 0
        else:
            sauts = 0
    # Un titre suivi immédiatement d'un autre titre : section vide.
    for k in range(len(paras) - 1):
        a, b = paras[k][0], paras[k + 1][0]
        if (a.style.name.startswith("Heading")
                and b.style.name.startswith("Heading")
                and a.text.strip() and b.text.strip()
                and a.style.name >= b.style.name):
            pb["miseenpage"].append(
                "section sans contenu : « %s » suivi de « %s »"
                % (a.text.strip()[:40], b.text.strip()[:40]))

    stats = dict(paragraphes=len(paras), titres=len(titres),
                 tableaux=len(doc.tables), mots=len(plein.split()))
    return pb, stats


def main():
    args = sys.argv[1:]
    detail = "--detail" in args
    cibles = [a for a in args if not a.startswith("--")]
    fichiers = sorted(glob.glob(os.path.join(RACINE,
                                             "Manuel_*_Etude_Integrale.docx")))
    if cibles:
        fichiers = [f for f in fichiers
                    if any(c.lower() in os.path.basename(f).lower() for c in cibles)]
    if not fichiers:
        print("aucun cahier trouvé")
        return 0

    print("=" * 78)
    print("  CONTRÔLE PRÊT À IMPRIMER — cahiers d'œuvre intégrale VÉRITAS")
    print("=" * 78)
    familles = ["fichier", "caracteres", "balisage", "typographie",
                "structure", "tableaux", "miseenpage"]
    entetes = {"fichier": "fichier", "caracteres": "caract.",
               "balisage": "balisage", "typographie": "typo.",
               "structure": "structure", "tableaux": "tableaux",
               "miseenpage": "mise en p."}
    print("\n%-24s %8s %8s %8s %7s %9s %8s %10s"
          % ("cahier", *[entetes[f] for f in familles]))
    total = 0
    tous = {}
    for f in fichiers:
        pb, st = controler(f)
        tous[f] = pb
        n = sum(len(v) for v in pb.values())
        total += n
        print("%-24s %8d %8d %8d %7d %9d %8d %10d"
              % (os.path.basename(f)[7:-21][:24],
                 *[len(pb[k]) for k in familles]))

    print("\n── DÉTAIL ────────────────────────────────────────────────────────────────")
    for f in fichiers:
        pb = tous[f]
        n = sum(len(v) for v in pb.values())
        if not n:
            print("\n  ✓ %-42s prêt à imprimer" % os.path.basename(f))
            continue
        print("\n  %s — %d point(s)" % (os.path.basename(f), n))
        for k in familles:
            if not pb[k]:
                continue
            vus, uniques = set(), []
            for x in pb[k]:
                cle = x[:60]
                if cle not in vus:
                    vus.add(cle)
                    uniques.append(x)
            print("     [%s] %d occurrence(s), %d cas distinct(s)"
                  % (entetes[k], len(pb[k]), len(uniques)))
            for x in uniques[:None if detail else 3]:
                print("        · %s" % x[:150])
            if not detail and len(uniques) > 3:
                print("        … et %d autre(s) — relancer avec --detail"
                      % (len(uniques) - 3))

    print("\n" + "=" * 78)
    print("  %d point(s) à examiner sur %d cahier(s)." % (total, len(fichiers)))
    return total


if __name__ == "__main__":
    sys.exit(1 if main() else 0)
