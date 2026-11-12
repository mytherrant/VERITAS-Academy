# -*- coding: utf-8 -*-
"""Sort les items de cahier SANS corrigé, avec le contexte nécessaire pour le rédiger.

Le contexte (texte de lecture, source, lexique) vit déjà dans _bord_extract/<niv>.json :
inutile de rouvrir les .docx. Usage :
    python tools/manques_cahier.py 2nde            → résumé par module
    python tools/manques_cahier.py 2nde 3          → le module 3, leçon par leçon
    python tools/manques_cahier.py 2nde 3 --texte  → avec le texte de lecture
"""
import json, os, glob, sys, re

def charger_sols(niv):
    sols = set()
    d = os.path.join("content", "corriges-cahier", niv)
    if os.path.isdir(d):
        for f in glob.glob(os.path.join(d, "module-*.md")):
            for raw in open(f, encoding="utf-8"):
                if raw.startswith("#SOL::"):
                    p = raw.split("::", 2)
                    if len(p) >= 3:
                        sols.add(p[1].strip())
    return sols

def main():
    niv = sys.argv[1]
    mod_vise = None
    for a in sys.argv[2:]:
        if a.isdigit():
            mod_vise = int(a)
    avec_texte = "--texte" in sys.argv
    data = json.load(open("_bord_extract/%s.json" % niv, encoding="utf-8"))
    sols = charger_sols(niv)
    for mod in data["modules"]:
        manquants = []
        for l in mod["lecons"]:
            for it in l["items"]:
                if it["id"] not in sols and not any(x for x in it.get("sol", [])):
                    manquants.append((l, it))
        if not manquants:
            continue
        if mod_vise is not None and mod["n"] != mod_vise:
            print("M%-2s %-45s %d manquants" % (mod["n"], mod["titre"][:45], len(manquants)))
            continue
        if mod_vise is None:
            print("M%-2s %-45s %d manquants" % (mod["n"], mod["titre"][:45], len(manquants)))
            continue
        print("=" * 78)
        print("MODULE %s — %s" % (mod["n"], mod["titre"]))
        print("=" * 78)
        vue = None
        for l, it in manquants:
            if l["n"] != vue:
                vue = l["n"]
                print("\n" + "-" * 74)
                print("LEÇON %s · %s   [semaine %s]" % (l["n"], l["titre"], l.get("semaine")))
                if l.get("objectif"):
                    print("OBJECTIF : %s" % l["objectif"])
                if l.get("source"):
                    print("SOURCE   : %s" % l["source"])
                if l.get("lexique"):
                    lx = l["lexique"]
                    print("LEXIQUE  : %s" % (lx if isinstance(lx, str) else json.dumps(lx, ensure_ascii=False))[:600])
                if avec_texte and l.get("texte"):
                    print("TEXTE :\n%s" % l["texte"])
                print("-" * 74)
            print("\n[%s] (%s) %s" % (it["id"], it["kind"], it.get("rub") or ""))
            print("   %s" % (it["txt"] or "").replace("\n", "\n   "))

main()
