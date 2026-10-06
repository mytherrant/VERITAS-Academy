# -*- coding: utf-8 -*-
"""dump_cahiers2c.py — affiche une séquence d'un nouveau cahier du 2nd cycle, pour rédiger.

Usage : python tools/dump_cahiers2c.py <niv> <n_module> [l_debut] [l_fin] [--tout]

Imprime, leçon par leçon, le texte support (jamais publié) et, À LEUR PLACE dans le fil
du cahier, les items avec leur identifiant `#SOL::`. Les items jumeaux (déjà présents à
l'identique dans un cahier traité avant) sont signalés `= <id>` et sautés, sauf --tout.
Les items déjà corrigés (une ligne #SOL existe) sont marqués ✓.
"""
import os, sys, io, json, glob

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

args = [a for a in sys.argv[1:] if not a.startswith("--")]
tout = "--tout" in sys.argv
niv, nmod = args[0], int(args[1])
deb = int(args[2]) if len(args) > 2 else 1
fin = int(args[3]) if len(args) > 3 else 999

faits = set()
for f in glob.glob(os.path.join(ROOT, "content", "corriges-cahier", "*", "module-*.md")):
    for raw in open(f, encoding="utf-8"):
        if raw.startswith("#SOL::"):
            faits.add(raw.split("::")[1].strip())

d = json.load(open(os.path.join(ROOT, "_bord_extract", "%s.json" % niv), encoding="utf-8"))
m = [x for x in d["modules"] if x["n"] == nmod][0]
print("# %s — %s\n" % (niv, m["titre"]))
for l in m["lecons"]:
    if not (deb <= l["n"] <= fin):
        continue
    print("=" * 78)
    print("L%d · %s   [%s]" % (l["n"], l["titre"], l["semaine"] or ""))
    if l["objectif"]:
        print("OBJ : %s" % l["objectif"])
    pos = {}
    for it in l["items"]:
        pos.setdefault(it["ctx"], []).append(it)

    def items_at(k):
        for it in pos.get(k, []):
            if it.get("twin") and not tout:
                print("    = %s  (jumeau de %s)" % (it["id"], it["twin"]))
                continue
            mark = "✓" if (it["id"] in faits or it.get("twin") in faits) else " "
            num = (" (%s)" % it["num"]) if it.get("num") else ""
            rub = (" <%s>" % it["rub"]) if it["rub"] else ""
            print("  %s %s [%s]%s%s\n        %s" % (mark, it["id"], it["kind"], num, rub, it["txt"]))
    for k, t in enumerate(l["texte"]):
        items_at(k)
        print("  | %s" % t)
    items_at(len(l["texte"]))
    print()
