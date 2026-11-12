# -*- coding: utf-8 -*-
"""
Audit de conformité des cahiers d'œuvre intégrale.

Trois familles de contrôles, tous mesurés sur le .docx produit :

    DENSITÉ      volume, extraits, longueur des devoirs rédigés
    RICHESSE     fiches, axes, exercices, encadrés, parcours différenciés
    CONFORMITÉ   format d'épreuve MINESEC, grilles OBC, barèmes, formulations

Usage :  python enrichissement/audit.py
"""
import glob
import os
import re
import sys

import docx

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from docxkit import PICTOS
from docx.oxml.ns import qn
from docx.table import Table
from docx.text.paragraph import Paragraph

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SEUILS = dict(
    mots_min=25000,          # densité visée par cahier
    extrait_min=300,         # longueur minimale d'un extrait d'œuvre
    fiches=6,
    devoirs_rediges=4,       # 2 commentaires + 2 dissertations
    devoir_redige_min=900,   # mots par devoir rédigé
    encadres_min=12,
)


# L'apostrophe droite et la courbe, l'espace fine et l'espace ordinaire : la
# typographie d'un livre imprimé ne doit pas décider si un contrôle passe.
# On aplatit les deux côtés avant de les confronter.
_TYPO = {"\u2019": "'", "\u02bc": "'", "\u00a0": " ", "\u202f": " ",
         "\u2009": " ", "\u2007": " "}


def aplatir(t):
    """Ramène un texte à une forme typographique neutre."""
    for a, b in _TYPO.items():
        t = t.replace(a, b)
    return t


def tous_paragraphes(doc):
    out = []

    def walk(parent, el):
        for c in el:
            if c.tag == qn("w:p"):
                out.append(Paragraph(c, parent))
            elif c.tag == qn("w:tbl"):
                for r in Table(c, parent).rows:
                    for cell in r.cells:
                        walk(cell, cell._tc)

    walk(doc, doc.element.body)
    return out


# Ce qui, dans une référence, nomme l'unité reproduite.
UNITE = re.compile(
    r"poème entier|en entier|intégralité|intégral|section [IVX\d]+"
    r"|partie [IVX\d]+|strophes? \d|vers \d+|extrait \d+ du dossier"
    r"|scène entière|acte [IVX]+|chapitre [IVX\d]+"
    # Un support de contraction n'est pas tiré du poème : il déclare son
    # unité autrement, en disant ce qu'il reproduit et ce qu'il a écarté.
    r"|reproduites? verbatim|réponses de l'auteur|préface|postface", re.I)


def references_extraits(doc, plancher):
    """Le paragraphe de référence qui suit chaque extrait, dans l'ordre du
    document. Un extrait sans référence rend une chaîne vide, ce qui le fait
    compter comme non déclaré : c'est bien le défaut qu'on cherche."""
    out, attend = [], False
    for el in doc.element.body:
        if el.tag == qn("w:tbl"):
            t = Table(el, doc)
            attend = False
            if len(t.rows) == 1 and len(t.columns) == 1:
                txt = t.rows[0].cells[0].text.strip()
                if (txt and txt[0] not in PICTOS
                        and len(txt.split()) > plancher):
                    attend = True
        elif el.tag == qn("w:p") and attend:
            txt = Paragraph(el, doc).text.strip()
            if txt:
                out.append(txt)
                attend = False
    return out


def cellules_seules(doc):
    """Tables 1×1 : extraits et encadrés."""
    for t in doc.tables:
        if len(t.rows) == 1 and len(t.columns) == 1:
            yield t.rows[0].cells[0].text.strip()


def analyse(chemin):
    doc = docx.Document(chemin)
    paras = tous_paragraphes(doc)
    textes = [p.text for p in paras]
    plein = "\n".join(textes)
    titres = [p.text.strip() for p in doc.paragraphs
              if p.style.name.startswith("Heading")]
    r = {"fichier": os.path.basename(chemin)}

    # ---------------------------------------------------------- DENSITÉ
    r["mots"] = len(plein.split())

    # Un cahier de poésie ne se juge pas à la longueur de ses extraits.
    # « Ici-bas » fait cinquante-neuf mots ; le rallonger pour tenir un quota
    # reviendrait à coller deux poèmes l'un à l'autre. Ce qu'on exige d'un
    # extrait de vers, c'est d'être une unité complète — et de le dire.
    r["poesie"] = bool(re.search(r"^poésie$", plein[:2000], re.M | re.I))
    plancher = 40 if r["poesie"] else 150

    extraits, encadres = [], []
    for txt in cellules_seules(doc):
        if not txt:
            continue
        if txt[0] in PICTOS:
            encadres.append(txt)
        elif len(txt.split()) > plancher:
            extraits.append(len(txt.split()))
    r["extraits"] = len(extraits)
    r["extrait_min"] = min(extraits) if extraits else 0
    r["extrait_med"] = sorted(extraits)[len(extraits) // 2] if extraits else 0
    r["extraits_courts"] = (0 if r["poesie"] else
                            sum(1 for n in extraits if n < SEUILS["extrait_min"]))
    r["encadres"] = len(encadres)

    # À la place du quota : chaque référence d'extrait doit nommer l'unité
    # reproduite, faute de quoi le lecteur ignore s'il tient le poème entier
    # ou un fragment choisi. La référence n'a pas d'étiquette : c'est le
    # paragraphe qui suit la cellule. On la repère donc à sa place, non à son
    # libellé — une garde qui cherche « Source : » ne trouverait rien.
    refs = references_extraits(doc, plancher)
    r["refs_extraits"] = len(refs)
    r["refs_unite"] = sum(1 for t in refs if UNITE.search(t))

    # ---------------------------------------------------------- RICHESSE
    # Les six lectures méthodiques s'intitulent désormais « Séquence N — … » :
    # le cahier suit un parcours, non une liste de ressources. Elles portent
    # en outre un numéro de section depuis qu'elles sont montées au niveau 2
    # — « 4.1 Séquence 1 » — et le compte les ignorait toutes. On accepte les
    # trois formes, pour qu'un cahier non reconstruit reste mesurable.
    r["fiches"] = sum(1 for t in titres
                      if re.match(r"^(?:\d+\.\d+\s+)?(?:Séquence|Fiche)\s+\d", t))
    r["axes"] = sum(1 for t in textes if re.match(r"^Axe \d+ —", t.strip()))
    r["parcours"] = sum(1 for t in textes if t.strip().startswith("Parcours "))
    r["comprendre"] = sum(1 for t in textes if "Comprendre" in t and t.strip().startswith("☑"))
    r["analyser"] = sum(1 for t in textes if "Analyser" in t and t.strip().startswith("☑"))

    # devoirs rédigés : mots entre chaque titre « Commentaire composé n° » /
    # « Dissertation n° » et le titre suivant
    idx = [i for i, p in enumerate(paras)
           if p.style.name.startswith("Heading 3")
           and re.match(r"^(Commentaire composé|Dissertation) n°", p.text.strip())]
    bornes = [i for i, p in enumerate(paras) if p.style.name.startswith("Heading")]
    longueurs = []
    for i in idx:
        suivant = next((b for b in bornes if b > i), len(paras))
        longueurs.append(len(" ".join(textes[i:suivant]).split()))
    r["devoirs_rediges"] = len(longueurs)
    r["devoir_min"] = min(longueurs) if longueurs else 0
    r["devoir_moy"] = sum(longueurs) // len(longueurs) if longueurs else 0

    # ------------------------------------------------------- CONFORMITÉ
    plat = aplatir(plein)

    def presence(motif):
        """Le motif est-il dans le document, typographie mise à plat ?"""
        return bool(re.search(aplatir(motif), plat, re.I))

    # Un cahier de seconde ne se juge pas au format du second cycle : il vise
    # la classe de Premiere et non le BAC, et sa notation reserve deux points
    # a la presentation de la copie. Les controles suivent donc le cycle.
    vise_seconde = any(t.startswith("Vers la Première") for t in titres)
    r["cycle"] = "seconde" if vise_seconde else "second cycle"
    seconde = r["cycle"] == "seconde"

    r["c_duree"] = presence(r"4\s*heures")
    r["c_coef"] = (presence(r"Seconde, toutes séries") if seconde
                   else presence(r"coefficient\s*3.*coefficient\s*2|A \(coefficient 3\)"))
    r["c_choix"] = presence(r"un seul\*{0,2} des trois sujets")
    r["c_3sujets"] = all(presence(s) for s in
                         (r"Sujet I —", r"Sujet II —", r"Sujet III —"))
    r["c_contraction"] = presence(r"quart de sa longueur") and presence(r"±\s*10")
    # Le barème est celui de la grille harmonisée de l'OBC — 6/6/6/2 —, non
    # un découpage « introduction / développement / conclusion » qui ne figure
    # dans aucun corrigé national. Il ne dépend pas du cycle.
    r["c_bareme_cc"] = presence(
        r"Compréhension\s*:\s*6.*Organisation des idées\s*:\s*6"
        r".*Langue et style\s*:\s*6.*Présentation de la copie\s*:\s*2")
    r["c_bareme_diss"] = presence(
        r"Compréhension / Pertinence\s*:\s*6.*Organisation / Cohérence\s*:\s*6"
        r".*Correction de l’expression\s*:\s*6.*Originalité de la production"
        r"\s*:\s*2")
    r["c_criteres"] = all(presence(x) for x in
                          (r"C1 — Compréhension", r"C2 — Organisation",
                           r"C3 — Expression", r"C4 — Originalité"))
    r["c_recoit"] = len(re.findall(r"Le candidat reçoit", plat))
    r["c_cloture"] = presence(r"ouvert à toute autre interprétation pertinente")
    r["c_procedes"] = presence(r"exploitation par le candidat des procédés de style")
    r["c_total20"] = presence(r"\*\*Total\*\*|Total") and presence(r"\*\*20\*\*|^20$")
    r["c_proba"] = any(t.startswith("Vers le Probatoire") for t in titres)
    r["c_bac"] = any(t.startswith("Vers la Première" if seconde else "Vers le BAC")
                     for t in titres)
    r["c_presentation"] = presence(r"Présentation de la copie\s*:\s*2")
    # Conformité des devoirs rédigés aux corrigés harmonisés nationaux : les
    # rubriques du corrigé officiel, son vocabulaire, et les deux maquettes de
    # rédaction. Un cahier peut être riche et rester hors format.
    r["c_obc_cc"] = (presence(r"Idée générale") and presence(r"Plan possible")
                     and presence(r"Intérêts du texte")
                     and presence(r"centre d'intérêt"))
    r["c_obc_diss"] = (presence(r"Thème") and presence(r"Reformulation")
                       and presence(r"Type de plan")
                       and presence(r"Problématique"))
    r["c_maquettes"] = (presence(r"Maquette de rédaction du commentaire")
                        and presence(r"Maquette de rédaction de la dissertation"))
    r["c_interets"] = len(re.findall(r"Intérêt stylistique", plat))
    r["c_verbatim"] = presence(r"verbatim")
    r["c_coupes"] = "[…]" in plat

    # grilles : vérifier qu'une grille OBC totalise bien 20
    total_ok = 0
    for t in doc.tables:
        if len(t.columns) == 3 and len(t.rows) >= 5:
            col = [t.rows[i].cells[2].text.strip().replace("*", "")
                   for i in range(len(t.rows))]
            pts = [int(x) for x in col if x.isdigit()]
            if pts and sum(pts[:-1]) == pts[-1] == 20:
                total_ok += 1
    r["grilles_20"] = total_ok
    return r


def verdict(r):
    """Liste des manquements."""
    m = []
    if r["mots"] < SEUILS["mots_min"]:
        m.append("volume %d < %d mots" % (r["mots"], SEUILS["mots_min"]))
    if r["extraits_courts"]:
        m.append("%d extrait(s) sous %d mots" % (r["extraits_courts"], SEUILS["extrait_min"]))
    if r.get("poesie") and r["refs_extraits"] and r["refs_unite"] < r["refs_extraits"]:
        m.append("%d référence(s) d'extrait ne nomment pas l'unité reproduite"
                 % (r["refs_extraits"] - r["refs_unite"]))
    if r["fiches"] != SEUILS["fiches"]:
        m.append("%d fiches (6 attendues)" % r["fiches"])
    if r["devoirs_rediges"] != SEUILS["devoirs_rediges"]:
        m.append("%d devoirs rédigés (4 attendus)" % r["devoirs_rediges"])
    if r["devoir_min"] < SEUILS["devoir_redige_min"]:
        m.append("devoir rédigé le plus court : %d mots" % r["devoir_min"])
    if r["encadres"] < SEUILS["encadres_min"]:
        m.append("%d encadrés (%d attendus)" % (r["encadres"], SEUILS["encadres_min"]))
    seconde = r.get("cycle") == "seconde"
    bar = "6/6/6/2, grille harmonisée OBC"
    for cle, libelle in [
            ("c_duree", "durée 4 h"),
            ("c_coef", "classe visée" if seconde else "coefficients"),
            ("c_choix", "choix entre trois sujets"), ("c_3sujets", "les trois sujets"),
            ("c_contraction", "consigne de contraction (quart, ±10 %)"),
            ("c_bareme_cc", "barème commentaire " + bar),
            ("c_bareme_diss", "barème dissertation " + bar),
            ("c_presentation", "les 2 points de présentation (seconde)"),
            ("c_criteres", "les 4 critères OBC"),
            ("c_cloture", "formule de clôture OBC"),
            ("c_procedes", "clause sur les procédés de style"),
            ("c_proba", "rubrique Vers le Probatoire"),
            ("c_bac", "rubrique Vers la Première" if seconde
             else "rubrique Vers le BAC"),
            ("c_obc_cc", "rubriques du corrigé national (commentaire)"),
            ("c_obc_diss", "rubriques du corrigé national (dissertation)"),
            ("c_maquettes", "les deux maquettes de rédaction de l'OBC"),
            ("c_verbatim", "mention verbatim"), ("c_coupes", "signalement des coupes […]")]:
        if not r[cle]:
            m.append("MANQUE : " + libelle)
    if r["c_recoit"] < 12:
        m.append("seulement %d formulations « Le candidat reçoit »" % r["c_recoit"])
    if r["c_interets"] < 2:
        m.append("seulement %d rubrique(s) « Intérêt stylistique » "
                 "(2 attendues, une par commentaire)" % r["c_interets"])
    if r["grilles_20"] < 3:
        m.append("seulement %d grille(s) totalisant 20" % r["grilles_20"])
    return m


def main():
    fichiers = sorted(glob.glob(os.path.join(RACINE, "Manuel_*_Etude_Integrale.docx")))
    if not fichiers:
        print("aucun cahier trouvé"); return
    res = [analyse(f) for f in fichiers]

    print("═" * 78)
    print("  AUDIT DE CONFORMITÉ — cahiers d'œuvre intégrale VÉRITAS")
    print("═" * 78)

    print("\n── DENSITÉ ───────────────────────────────────────────────────────────────")
    print("%-26s %7s %8s %8s %8s %8s" %
          ("cahier", "mots", "extraits", "min", "médiane", "<300"))
    for r in res:
        print("%-26s %7d %8d %8d %8d %8d" %
              (r["fichier"][7:-20], r["mots"], r["extraits"], r["extrait_min"],
               r["extrait_med"], r["extraits_courts"]))

    print("\n── RICHESSE ──────────────────────────────────────────────────────────────")
    print("%-26s %6s %5s %8s %9s %9s" %
          ("cahier", "fiches", "axes", "encadrés", "parcours", "dev. réd."))
    for r in res:
        print("%-26s %6d %5d %8d %9d %5d (%d mots moy.)" %
              (r["fichier"][7:-20], r["fiches"], r["axes"], r["encadres"],
               r["parcours"], r["devoirs_rediges"], r["devoir_moy"]))

    print("\n── CONFORMITÉ MINESEC ────────────────────────────────────────────────────")
    print("%-26s %5s %6s %7s %7s %7s %7s" %
          ("cahier", "4h", "3suj", "critOBC", "grill20", "reçoit", "Pro/BAC"))
    for r in res:
        print("%-26s %5s %6s %7s %7d %7d %7s" %
              (r["fichier"][7:-20],
               "oui" if r["c_duree"] else "NON",
               "oui" if r["c_3sujets"] else "NON",
               "oui" if r["c_criteres"] else "NON",
               r["grilles_20"], r["c_recoit"],
               "oui" if (r["c_proba"] and r["c_bac"]) else "NON"))

    print("\n── VERDICT ───────────────────────────────────────────────────────────────")
    total = 0
    for r in res:
        m = verdict(r)
        total += len(m)
        if m:
            print("\n  %s" % r["fichier"])
            for x in m:
                print("     ✗ %s" % x)
        else:
            print("  ✓ %-40s conforme" % r["fichier"])
    print("\n%s" % ("═" * 78))
    print("  %d manquement(s) sur %d cahiers." % (total, len(res)))
    return total


if __name__ == "__main__":
    sys.exit(1 if main() else 0)
