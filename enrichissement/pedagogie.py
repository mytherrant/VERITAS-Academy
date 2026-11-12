# -*- coding: utf-8 -*-
"""
Audit pédagogique des parcours.

Les trois autres contrôles disent si le cahier est bien fait : conforme au
format (`audit`), fidèle à l'œuvre (`verbatim`), imprimable (`impression`).
Aucun ne dit s'il **sert à apprendre**. Un cahier peut être irréprochable et
n'étudier que les trente premières pages d'un roman, poser les mêmes
questions six fois, ou faire lire l'élève sans jamais le faire écrire.

Quatre mesures, toutes prises sur le `.docx` produit et sur l'œuvre :

  COUVERTURE   où tombent les six extraits dans l'œuvre, du premier au
               dernier centile. Un parcours qui s'arrête au tiers du livre
               ne le fait pas étudier.
  ÉQUILIBRE    la longueur de chaque séquence. Une séance de trois mille
               mots et une de six cents ne tiennent pas dans la même heure.
  PROGRESSION  les objectifs et les outils diffèrent-ils d'une séquence à
               l'autre ? Six fois le même geste n'est pas une progression.
  ACTIVITÉ     ce que l'élève produit — questions, tableaux à remplir,
               consignes d'écriture — rapporté à ce qu'il lit.

    python enrichissement/pedagogie.py            # les neuf cahiers
    python enrichissement/pedagogie.py balafon    # un seul
"""
import os
import re
import sys

import docx
from docx.oxml.ns import qn
from docx.table import Table
from docx.text.paragraph import Paragraph

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
sys.path.insert(0, ICI)

import verbatim as V                                        # noqa: E402
from docxkit import PICTOS                                  # noqa: E402

SEUILS = dict(
    # Le premier extrait doit ouvrir l'œuvre, le dernier la fermer. On laisse
    # une marge : un poème liminaire n'est pas exactement au centile zéro.
    debut_max=25,        # le premier extrait ne doit pas commencer après 25 %
    fin_min=70,          # le dernier ne doit pas s'arrêter avant 70 %
    ecart_max=45,        # deux extraits voisins ne sautent pas plus de 45 %
    seq_min=700,         # une séquence trop courte ne remplit pas une séance
    seq_max=4200,        # trop longue, elle n'en tient pas dans une
    activites_min=10,    # questions et consignes par séquence
)

# Ce que l'élève produit lui-même : questions numérotées, consignes
# d'écriture, cases à remplir.
#
# La liste ne retient que des impératifs de deuxième personne du pluriel :
# à cette forme, un verbe est une consigne, jamais une description. Elle
# était incomplète, et la cinquième séquence de « Capitoline » passait pour
# pauvre alors qu'elle demandait de « distinguer », « reconstituer » et
# « discuter » — trois verbes que le contrôle ne connaissait pas. Un défaut
# de mesure ressemble à un défaut de contenu : on rouvre le cahier avant de
# l'accuser.
VERBES_PRODUCTION = re.compile(
    r"\b(relevez|citez|recopiez|classez|comparez|montrez|expliquez|"
    r"r[ée]digez|[ée]crivez|justifiez|comptez|analysez|dites|cherchez|"
    r"compl[ée]tez|dressez|apprenez|lisez|d[ée]montrez|reformulez|"
    r"choisissez|proposez|distinguez|reconstituez|discutez|observez|"
    r"soulignez|notez|nommez|indiquez|r[ée]sumez|traitez|pr[ée]sentez|"
    r"associez|remettez|cochez|remplissez|v[ée]rifiez|relisez|r[ée]pondez|"
    r"rapprochez|situez|rangez|faites)\b", re.I)


def _blocs(doc):
    """Paragraphes et tableaux dans l'ordre, avec leur profondeur."""
    out = []

    def walk(parent, el, dans_table=False):
        for c in el:
            if c.tag == qn("w:p"):
                out.append(("p", Paragraph(c, parent), dans_table))
            elif c.tag == qn("w:tbl"):
                t = Table(c, parent)
                out.append(("t", t, dans_table))
                for r in t.rows:
                    for cell in r.cells:
                        walk(cell, cell._tc, True)

    walk(doc, doc.element.body)
    return out


def _sequences(blocs):
    """Découpe le document en séquences, à partir des titres « Séquence N »."""
    # Les séquences sont montées au niveau 2 et portent désormais un numéro
    # de section — « 4.1 Séquence 1 — … ». Un découpage qui cherche un titre
    # commençant par « Séquence » n'en trouve plus aucun, et le cahier passe
    # pour vide sans que rien ne le signale.
    bornes = [i for i, (k, o, _) in enumerate(blocs)
              if k == "p" and o.style.name.startswith("Heading")
              and re.match(r"^(?:\d+\.\d+\s+)?Séquence\s+\d", o.text.strip())]
    if not bornes:
        return []
    fin = next((i for i, (k, o, _) in enumerate(blocs)
                if i > bornes[-1] and k == "p"
                and o.style.name in ("Heading 1", "Heading 2")), len(blocs))
    return [blocs[a:b] for a, b in zip(bornes, bornes[1:] + [fin])]


def _texte(seq):
    return "\n".join(o.text for k, o, _ in seq if k == "p")


def couverture(cle, doc):
    """Où tombent les extraits dans l'œuvre, en centiles.

    On cherche chaque extrait dans la source normalisée : sa position dit ce
    que le parcours fait lire, et surtout ce qu'il laisse de côté.
    """
    nom_src = V.CAHIERS[cle][1]
    src = V.charger_source(nom_src)
    total = len(src)
    plancher = V.MOTS_MIN_VERS if cle in V.POESIE else V.MOTS_MIN
    positions = []
    for txt in V.extraits_du_cahier(
            os.path.join(RACINE, V.CAHIERS[cle][0]), plancher):
        m = V.mots(txt)
        if len(m) < 8:
            continue
        # On ancre sur les huit premiers mots : assez pour être unique,
        # assez peu pour survivre à une coquille de scan plus loin.
        tete = " ".join(m[:8])
        i = src.find(tete)
        if i < 0:
            tete = " ".join(m[:5])
            i = src.find(tete)
        if i >= 0:
            positions.append(round(100.0 * i / total))
    return sorted(set(positions))


def analyser(cle):
    chemin = os.path.join(RACINE, V.CAHIERS[cle][0])
    if not os.path.exists(chemin):
        return None
    doc = docx.Document(chemin)
    blocs = _blocs(doc)
    seqs = _sequences(blocs)

    r = dict(cle=cle, sequences=len(seqs))
    r["longueurs"] = [len(_texte(s).split()) for s in seqs]

    # Les repères présents dans chaque séquence
    attendus = ("📖", "🔎", "🧰", "🎯", "✍")
    r["reperes"] = []
    for s in seqs:
        vus = set()
        for k, o, _ in s:
            if k == "t" and len(o.rows) == 1 and len(o.columns) == 1:
                t = o.rows[0].cells[0].text.strip()
                if t[:1] in PICTOS:
                    vus.add(t[:1])
        r["reperes"].append(vus)
    r["reperes_manquants"] = [
        [p for p in attendus if p not in v] for v in r["reperes"]]

    # Progression : objectifs et outils distincts d'une séquence à l'autre
    objectifs, outils = [], []
    for s in seqs:
        for k, o, _ in s:
            if k == "t" and len(o.rows) == 1 and len(o.columns) == 1:
                t = o.rows[0].cells[0].text.strip()
                if t.startswith("🧭"):
                    objectifs.append(t[:160])
                elif t.startswith("🧰"):
                    outils.append(t.split("\n")[0][:90])
    r["objectifs_distincts"] = len(set(objectifs))
    r["outils_distincts"] = len(set(outils))
    r["outils_total"] = len(outils)

    # Activité : ce que l'élève produit
    r["activites"] = []
    for s in seqs:
        n = 0
        for k, o, _ in s:
            if k == "p" and o.style.name == "List Number":
                n += 1
            elif k == "p" and VERBES_PRODUCTION.search(o.text):
                n += 1
        r["activites"].append(n)

    # Tableaux à remplir : la trace écrite de l'élève
    r["a_remplir"] = sum(
        1 for k, o, _ in blocs if k == "t" and len(o.columns) >= 2
        and any("…" == c.text.strip() for row in o.rows for c in row.cells))

    r["couverture"] = couverture(cle, doc)
    return r


def verdict(r):
    m = []
    c = r["couverture"]
    if not c:
        m.append("aucun extrait localisé dans l'œuvre")
    else:
        if c[0] > SEUILS["debut_max"]:
            m.append("le parcours n'ouvre l'œuvre qu'à %d %%" % c[0])
        if c[-1] < SEUILS["fin_min"]:
            m.append("le parcours s'arrête à %d %% de l'œuvre" % c[-1])
        sauts = [(b - a) for a, b in zip(c, c[1:])]
        if sauts and max(sauts) > SEUILS["ecart_max"]:
            m.append("un saut de %d %% entre deux extraits" % max(sauts))
    if r["sequences"] != 6:
        m.append("%d séquences (6 attendues)" % r["sequences"])
    courtes = [n for n in r["longueurs"] if n < SEUILS["seq_min"]]
    longues = [n for n in r["longueurs"] if n > SEUILS["seq_max"]]
    if courtes:
        m.append("%d séquence(s) sous %d mots" % (len(courtes), SEUILS["seq_min"]))
    if longues:
        m.append("%d séquence(s) au-dessus de %d mots"
                 % (len(longues), SEUILS["seq_max"]))
    manquants = sum(1 for x in r["reperes_manquants"] if x)
    if manquants:
        m.append("%d séquence(s) sans tous les repères" % manquants)
    if r["outils_distincts"] < r["outils_total"]:
        m.append("outil répété : %d distincts pour %d posés"
                 % (r["outils_distincts"], r["outils_total"]))
    if r["objectifs_distincts"] < r["sequences"]:
        m.append("%d objectifs distincts pour %d séquences"
                 % (r["objectifs_distincts"], r["sequences"]))
    faibles = [n for n in r["activites"] if n < SEUILS["activites_min"]]
    if faibles:
        m.append("%d séquence(s) sous %d activités"
                 % (len(faibles), SEUILS["activites_min"]))
    return m


def main():
    cibles = [a for a in sys.argv[1:] if a in V.CAHIERS] or list(V.CAHIERS)
    print("=" * 78)
    print("  AUDIT PÉDAGOGIQUE — les parcours des cahiers VÉRITAS")
    print("=" * 78)
    res = [x for x in (analyser(c) for c in cibles) if x]

    print("\n── COUVERTURE DE L'ŒUVRE ─────────────────────────────────────────────────")
    print("  Position des extraits dans l'œuvre, en centiles.")
    print("  %-12s %-42s %s" % ("cahier", "extraits situés à", "amplitude"))
    for r in res:
        c = r["couverture"]
        print("  %-12s %-42s %s"
              % (r["cle"], " ".join("%d%%" % x for x in c) or "—",
                 "%d–%d %%" % (c[0], c[-1]) if c else "—"))

    print("\n── ÉQUILIBRE ET ACTIVITÉ ─────────────────────────────────────────────────")
    print("  %-12s %8s %10s %11s %9s" %
          ("cahier", "séq.", "mots/séq.", "activités", "à remplir"))
    for r in res:
        L = r["longueurs"] or [0]
        A = r["activites"] or [0]
        print("  %-12s %8d %10s %11s %9d"
              % (r["cle"], r["sequences"],
                 "%d–%d" % (min(L), max(L)), "%d–%d" % (min(A), max(A)),
                 r["a_remplir"]))

    print("\n── PROGRESSION ───────────────────────────────────────────────────────────")
    print("  %-12s %14s %16s %s" %
          ("cahier", "objectifs", "outils", "repères par séquence"))
    for r in res:
        etat = ("complets" if not any(r["reperes_manquants"])
                else "%d incomplète(s)" % sum(1 for x in r["reperes_manquants"] if x))
        print("  %-12s %14s %16s %s"
              % (r["cle"], "%d/%d" % (r["objectifs_distincts"], r["sequences"]),
                 "%d/%d" % (r["outils_distincts"], r["outils_total"]), etat))

    print("\n── VERDICT ───────────────────────────────────────────────────────────────")
    total = 0
    for r in res:
        m = verdict(r)
        total += len(m)
        if m:
            print("\n  %s" % r["cle"])
            for x in m:
                print("     ✗ %s" % x)
        else:
            print("  ✓ %-12s parcours pertinent, œuvre couverte" % r["cle"])
    print("\n" + "=" * 78)
    print("  %d remarque(s) sur %d cahier(s)." % (total, len(res)))
    return total


if __name__ == "__main__":
    sys.exit(1 if main() else 0)
