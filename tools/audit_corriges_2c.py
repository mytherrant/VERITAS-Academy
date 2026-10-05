# -*- coding: utf-8 -*-
"""audit_corriges_2c.py — contrôle des corrigés des nouveaux cahiers du 2nd cycle.

Quatre contrôles, recomptés depuis les fichiers (rien de mémoire) :
  1. COUVERTURE   chaque item à corriger (hors auto-évaluation) a un #SOL (le sien ou
                  celui de son jumeau) ou un #NOSOL motivé. Les manquants sont listés.
  2. FUITE        aucune page publiée ne contient le texte d'un énoncé ni une ligne de
                  texte d'auteur (le cahier est vendu, les corrigés sont gratuits).
  3. CITATIONS    toute citation « … » d'un corrigé figure MOT POUR MOT dans le cahier.
  4. NORMES OBC   vocabulaire proscrit (« axe » au lieu de « centre d'intérêt »,
                  barème 3/12/3/2).
Sortie : résumé à l'écran ; détail dans _bord_extract/audit_2c_{niv}.txt.
Code de sortie 1 si un contrôle échoue.

Usage : python tools/audit_corriges_2c.py [niv ...] [--strict]
"""
import os, re, sys, io, json, glob, html
from collections import Counter, defaultdict

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import extract_cahiers2c as ex                                 # noqa: E402
import build_corriges_2c as b2                                 # noqa: E402

ROOT = b2.ROOT


def norm(s):
    s = html.unescape(s or "")
    s = s.replace(" ", " ").replace(" ", " ").replace("’", "'").replace("‘", "'")
    s = s.replace("œ", "oe").replace("Œ", "Oe").replace("–", "-").replace("—", "-")
    s = re.sub(r"[«»“”\"*]|__", "", s)
    s = re.sub(r"\s/\s", " ", s)                  # « vers 1 / vers 2 » : saut de vers
    s = re.sub(r"\s+", " ", s)
    return s.strip().lower()


def texte_cahier(path):
    from docx import Document
    doc = Document(path)
    out = []
    for b in ex.blocs(doc):
        if isinstance(b, ex.Table):
            for row in b.rows:
                for c in row.cells:
                    out.append(c.text)
        else:
            out.append(b.text)
    return norm(" ".join(out))


def page_texte(p):
    s = open(p, encoding="utf-8").read()
    s = re.sub(r"(?s)<(script|style|head)\b.*?</\1>", " ", s)
    return norm(re.sub(r"<[^>]+>", " ", s))


QUOTE = re.compile(r"«\s*(.+?)\s*»")


def segments(q):
    """« a […] b » → [a, b] ; on ne contrôle que les segments d'au moins 2 mots."""
    for seg in re.split(r"\[\s*…\s*\]|\(\s*…\s*\)|\[\.\.\.\]|…", q):
        seg = seg.strip(" ,;:.!?/")
        if len(seg.split()) >= 2:
            yield seg


def main():
    voulus = [a for a in sys.argv[1:] if not a.startswith("--")]
    sols, nosol = b2.lire_tout()
    echec = False
    for niv in b2.NIVEAUX_2C:
        slug = niv["slug"]
        if voulus and slug not in voulus:
            continue
        data = b2.charger(slug)
        lignes = []
        # 1. couverture
        cpt = Counter(); manq = defaultdict(list)
        for m in data["modules"]:
            for l in m["lecons"]:
                for it in l["items"]:
                    if it["kind"] == "auto":
                        cpt["auto"] += 1; continue
                    if b2.solution(it, sols):
                        cpt["sol"] += 1
                    elif it["id"] in nosol or (it.get("twin") in nosol):
                        cpt["nosol"] += 1
                    else:
                        cpt["manque"] += 1; manq[m["n"]].append(it)
        # corrigés rédigés pour un identifiant que l'extraction ne connaît plus
        connus = {it["id"] for m in data["modules"] for l in m["lecons"] for it in l["items"]}
        prefixe = slug + "-"
        orphelins = sorted(k for k in list(sols) + list(nosol)
                           if k.startswith(prefixe) and k not in connus)
        cpt["orphelins"] = len(orphelins)
        lignes.append("COUVERTURE %s : %s" % (slug, dict(cpt)))
        lignes += ["  ORPHELIN " + k for k in orphelins]
        for k in sorted(manq):
            lignes.append("  séquence %d : %d sans corrigé" % (k, len(manq[k])))
            for it in manq[k]:
                lignes.append("     %s  %s" % (it["id"], it["txt"][:90]))
        # 2. fuite
        fuites = []
        d = os.path.join(ROOT, "corriges", slug)
        pages = {p: page_texte(p) for p in glob.glob(os.path.join(d, "cahier-*.html"))}
        for m in data["modules"]:
            for l in m["lecons"]:
                sondes = []
                for it in l["items"]:
                    if it["kind"] == "grille":       # ligne de grille : axe imposé, cité à bon droit
                        continue
                    t = norm(ex.NUMQ.sub("", it["txt"]))
                    t = re.sub(r"^\W*exercice\s*\d*\s*(\([^)]*\))?\s*:?\s*", "", t)
                    if len(t) >= 40:
                        sondes.append(("énoncé", it["id"], t[:60]))
                # Texte d'auteur : une citation courte est permise (preuve, relevé demandé
                # par la question) ; on cherche donc des passages de 160 caractères.
                for t in l["texte"]:
                    if t.startswith("["):
                        continue
                    t = norm(t)
                    for k in range(0, max(1, len(t) - 160), 40):
                        if len(t) >= 160:
                            sondes.append(("texte", l["titre"][:40], t[k:k + 160]))
                for kind, ref, s in sondes:
                    for p, txt in pages.items():
                        if s in txt:
                            fuites.append("%s %s → %s" % (kind, ref, os.path.basename(p)))
        lignes.append("FUITES : %d" % len(fuites))
        lignes += ["   " + f for f in fuites]
        # 3. citations
        src = texte_cahier(os.path.join(ex.SRC, ex.CAHIERS[slug]))
        fausses = []
        for m in data["modules"]:
            for l in m["lecons"]:
                for it in l["items"]:
                    for para in (sols.get(it["id"]) or []):
                        # Une production modèle (« Exemple : », « Proposition : ») invente ses
                        # propres répliques : seules les citations qui la précèdent sont vérifiées.
                        para = re.split(r"(?:Exemple|Proposition|Modèle)\s*[:(]", para)[0]
                        for q in QUOTE.findall(para):
                            for seg in segments(q):
                                if norm(seg) not in src:
                                    fausses.append("%s  « %s »" % (it["id"], seg[:100]))
        lignes.append("CITATIONS absentes du cahier : %d" % len(fausses))
        lignes += ["   " + f for f in fausses]
        # 4. normes
        normes = []
        for m in data["modules"]:
            for l in m["lecons"]:
                for it in l["items"]:
                    for para in (sols.get(it["id"]) or []):
                        if slug in ex.PREMIER_CYCLE:      # BEPC : « axes de lecture » est le terme officiel
                            continue
                        hors_citation = QUOTE.sub("", para)   # « Sur son axe… » est une citation
                        if re.search(r"\baxes?\b", hors_citation, re.I):
                            normes.append("%s  « axe »" % it["id"])
                        if "3/12/3/2" in para.replace(" ", ""):
                            normes.append("%s  barème 3/12/3/2" % it["id"])
        lignes.append("NORMES : %d" % len(normes))
        lignes += ["   " + f for f in normes]
        with open(os.path.join(ROOT, "_bord_extract", "audit_2c_%s.txt" % slug), "w",
                  encoding="utf-8") as f:
            f.write("\n".join(lignes) + "\n")
        print("── %-7s couverture %s · fuites %d · citations hors cahier %d · normes %d"
              % (slug, dict(cpt), len(fuites), len(fausses), len(normes)))
        if fuites or fausses or normes or orphelins or ("--strict" in sys.argv and cpt["manque"]):
            echec = True
    sys.exit(1 if echec else 0)


if __name__ == "__main__":
    main()
