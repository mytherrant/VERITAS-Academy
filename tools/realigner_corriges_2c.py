# -*- coding: utf-8 -*-
"""realigner_corriges_2c.py — rattache les corrigés rédigés aux questions d'une NOUVELLE
version d'un cahier du 2nd cycle.

Quand un cahier est refait (consignes reformulées, questions ajoutées), l'extracteur
renumérote : `tle-a-m1-l24-n3` peut désigner une autre question. Les corrigés, eux, sont
rangés sous l'ancien identifiant. Ce script relit la table « question → corrigé » que
`build_corriges_2c.py` écrit à chaque construction (`_bord_extract/table_alignement_<niv>.tsv`, à copier
AVANT de ré-extraire) et cherche, pour chaque corrigé, la question la plus proche dans
la nouvelle extraction (même leçon, énoncé le plus ressemblant).

Procédure :
  1. copie _bord_extract/table_alignement_<niv>.tsv → ancienne_table.tsv
  2. python tools/extract_cahiers2c.py            (nouvelle version du cahier)
  3. python tools/realigner_corriges_2c.py <niv> ancienne_table.tsv
         → _bord_extract/realignement_<niv>.tsv : ancien id, nouvel id, score, verdict
  4. relire les verdicts « douteux » et « perdu », puis
     python tools/realigner_corriges_2c.py <niv> ancienne_table.tsv --appliquer
         → réécrit les identifiants dans content/corriges-cahier/<niv>/*.md
            (seulement les correspondances « sûr » ; le reste est à traiter à la main)
"""
import os, re, sys, io, json, glob, difflib

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SEUIL_SUR, SEUIL_DOUTE = 0.80, 0.55


def norm(s):
    s = (s or "").replace("’", "'").lower()
    s = re.sub(r"^\W*(\d{1,2}\s*[.)/-]|exercice\s*\d*\s*(\([^)]*\))?\s*:)", "", s)
    return re.sub(r"\s+", " ", s).strip()


def ratio(a, b):
    return difflib.SequenceMatcher(None, norm(a), norm(b)).ratio()


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    niv, ancienne = args[0], args[1]
    vieux = []
    for ligne in open(ancienne, encoding="utf-8").read().splitlines()[1:]:
        c = ligne.split("\t")
        if len(c) >= 6 and c[2] in ("SOL", "NOSOL"):
            vieux.append(dict(id=c[0], statut=c[2], lecon=c[4], txt=c[5]))
    data = json.load(open(os.path.join(ROOT, "_bord_extract", "%s.json" % niv), encoding="utf-8"))
    neufs = [dict(id=it["id"], lecon=l["titre"], txt=it["txt"])
             for m in data["modules"] for l in m["lecons"] for it in l["items"]]
    pris, plan, rapport = set(), {}, ["ancien\tnouveau\tscore\tverdict\tancien_enonce\tnouvel_enonce"]
    cache_lecon = {}

    def r_lecon(a, b):
        if (a, b) not in cache_lecon:
            cache_lecon[(a, b)] = ratio(a, b)
        return cache_lecon[(a, b)]

    for v in vieux:
        best, sc = None, 0.0
        # d'abord la même leçon (ou une leçon au titre très proche) ; tout le cahier sinon
        proches = [n_ for n_ in neufs if r_lecon(v["lecon"], n_["lecon"]) >= 0.85] or neufs
        for n_ in proches:
            if n_["id"] in pris:
                continue
            if n_["id"] == v["id"] and norm(n_["txt"]) == norm(v["txt"]):
                best, sc = n_, 1.0           # inchangé : rien à chercher
                break
            sm = difflib.SequenceMatcher(None, norm(v["txt"]), norm(n_["txt"]))
            if 0.3 + 0.7 * sm.quick_ratio() <= sc:
                continue
            s = 0.3 * r_lecon(v["lecon"], n_["lecon"]) + 0.7 * sm.ratio()
            if s > sc:
                best, sc = n_, s
        if best and sc >= SEUIL_SUR and best["id"] not in pris:
            verdict = "sûr"; pris.add(best["id"]); plan[v["id"]] = best["id"]
        elif best and sc >= SEUIL_DOUTE:
            verdict = "douteux"
        else:
            verdict = "perdu"
        rapport.append("\t".join([v["id"], best["id"] if best else "", "%.2f" % sc, verdict,
                                  v["txt"][:120], (best or {}).get("txt", "")[:120]]))
    nouveaux = [n_ for n_ in neufs if n_["id"] not in pris]
    out = os.path.join(ROOT, "_bord_extract", "realignement_%s.tsv" % niv)
    with open(out, "w", encoding="utf-8") as f:
        f.write("\n".join(rapport) + "\n\n# questions nouvelles ou non rattachées\n")
        f.write("\n".join("%s\t%s" % (n_["id"], n_["txt"][:120]) for n_ in nouveaux) + "\n")
    cpt = {}
    for r in rapport[1:]:
        cpt[r.split("\t")[3]] = cpt.get(r.split("\t")[3], 0) + 1
    print("%s : %s · %d questions sans corrigé rattaché → %s" % (niv, cpt, len(nouveaux), out))
    if "--appliquer" in sys.argv:
        for f in glob.glob(os.path.join(ROOT, "content", "corriges-cahier", niv, "module-*.md")):
            src = open(f, encoding="utf-8").read()
            # deux passes (jeton intermédiaire) : un ancien id peut être le nouvel id d'un autre
            def jeton(m):
                k = m.group(2)
                # non rattaché → « orphelin- » : sinon l'ancien id désignerait en
                # silence une AUTRE question de la nouvelle version.
                if k.startswith("orphelin-"):
                    return m.group(0)
                return m.group(1) + ("@@%s@@" % plan[k] if k in plan else "orphelin-" + k) + m.group(3)
            src = re.sub(r"^(#(?:SOL|NOSOL|LAB):: )(\S+)( ::)", jeton, src, flags=re.M)
            src = re.sub(r"@@(\S+?)@@", r"\1", src)
            open(f, "w", encoding="utf-8").write(src)
        print("identifiants « sûrs » réécrits ; traiter à la main les « douteux » et « perdus ».")


if __name__ == "__main__":
    main()
