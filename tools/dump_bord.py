# -*- coding: utf-8 -*-
"""dump_bord.py — affiche le contenu d'un module extrait, pour rédiger ses corrigés.

Usage : python tools/dump_bord.py <niveau> <n_module> [n_lecon_debut] [n_lecon_fin]

Sort, leçon par leçon : l'objectif, le corpus/texte support (jamais publié, mais
indispensable pour corriger), puis les items avec leur identifiant `#SOL::`.
"""
import os, sys, io, json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

niv = sys.argv[1]
nmod = int(sys.argv[2])
deb = int(sys.argv[3]) if len(sys.argv) > 3 else 1
fin = int(sys.argv[4]) if len(sys.argv) > 4 else 99

d = json.load(open(os.path.join(ROOT, "_bord_extract", "%s.json" % niv), encoding="utf-8"))
mods = [m for m in d["modules"] if m["n"] == nmod]
if not mods:
    print("module %d absent (%s)" % (nmod, [m["n"] for m in d["modules"]])); sys.exit(1)
m = mods[0]
print("# %s — %s" % (niv, m["titre"]))
print("# %s\n" % m["comp"])
for l in m["lecons"]:
    if not (deb <= l["n"] <= fin):
        continue
    print("=" * 78)
    print("LEÇON %d · %s   [%s]" % (l["n"], l["titre"], l["semaine"] or ""))
    if l["objectif"]:
        print("OBJECTIF : %s" % l["objectif"])
    for t in l["texte"]:
        print("  | %s" % t)
    if l["source"]:
        print("  | SOURCE : %s" % l["source"])
    print("-" * 78)
    for it in l["items"]:
        rub = (" <%s>" % it["rub"]) if it["rub"] else ""
        num = (" (%s)" % it["num"]) if it.get("num") else ""
        print("%s [%s]%s%s  %s" % (it["id"], it["kind"], num, rub, it["txt"]))
    print()
