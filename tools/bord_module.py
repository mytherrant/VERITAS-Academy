# -*- coding: utf-8 -*-
"""bord_module.py — vue de travail d'un module de cahier, pour rédiger ses corrigés.

    python tools/bord_module.py 6e 1          # module 1 du cahier de 6e
    python tools/bord_module.py 6e 1 --brut   # textes d'auteur complets (par défaut : tronqués)
    python tools/bord_module.py 6e --liste    # sommaire des modules et des leçons

Affiche, leçon par leçon : l'objectif, le texte d'appui (indispensable pour corriger
une lecture méthodique), puis les items avec leur identifiant. Les corrigés rédigés
vont dans content/corriges-cahier/{niv}/module-N.md sous la forme :

    #SOL:: 6e-m1-l1-n1 :: L'auteur est Guillaume Nana ; le texte est tiré de…

Un item sans #SOL n'est pas publié : c'est ainsi qu'on écarte les lignes de corpus
et les paragraphes de leçon que l'extracteur a pu ramasser au passage.
"""
import os, re, sys, io, glob, json

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXT = os.path.join(ROOT, "_bord_extract")
SRC = os.path.join(ROOT, "content", "corriges-cahier")


def charge(niv):
    with open(os.path.join(EXT, "%s.json" % niv), encoding="utf-8") as f:
        return json.load(f)


def deja_faits(niv, mod):
    """IDs déjà corrigés (pour reprendre un module en cours sans doublonner).

    Un module se rédige en plusieurs passes : module-3.md, puis module-3-2.md,
    module-3-3.md… Tous ces fichiers sont lus, ici comme par le générateur.
    """
    ids = set()
    for p in sorted(glob.glob(os.path.join(SRC, niv, "module-%s.md" % mod))
                    + glob.glob(os.path.join(SRC, niv, "module-%s-*.md" % mod))):
        for ln in open(p, encoding="utf-8"):
            if ln.startswith("#SOL::"):
                ids.add(ln.split("::")[1].strip())
    return ids


def main():
    if len(sys.argv) < 2:
        print(__doc__); return
    niv = sys.argv[1]
    d = charge(niv)
    args = sys.argv[2:]
    brut = "--brut" in args
    args = [a for a in args if not a.startswith("--")]

    if "--liste" in sys.argv or not args:
        for m in d["modules"]:
            n_it = sum(len(l["items"]) for l in m["lecons"])
            print("M%-2d %-52s %2d leçons %4d items" % (m["n"], m["titre"][:52], len(m["lecons"]), n_it))
            for l in m["lecons"]:
                print("      l%-2d %-58s %3d items" % (l["n"], l["titre"][:58], len(l["items"])))
        return

    mod = int(args[0])
    m = next(x for x in d["modules"] if x["n"] == mod)
    faits = deja_faits(niv, mod)
    # « 6e 1 3-8 » : ne sortir que les leçons 3 à 8 (un module entier dépasse 80 Ko)
    lecons = m["lecons"]
    if len(args) > 1 and re.match(r"^\d+(-\d+)?$", args[1]):
        a, _, b = args[1].partition("-")
        a, b = int(a), int(b or a)
        lecons = [l for l in lecons if a <= l["n"] <= b]
    print("═" * 92)
    print("%s — MODULE %d : %s" % (niv.upper(), m["n"], m["titre"]))
    if m["comp"]:
        print("   %s" % m["comp"])
    print("   %d leçons · %d items · %d déjà corrigés"
          % (len(m["lecons"]), sum(len(l["items"]) for l in m["lecons"]), len(faits)))
    print("═" * 92)
    for l in lecons:
        reste = [i for i in l["items"] if i["id"] not in faits]
        print("\n▌ %s   [l%d]" % (l["titre"], l["n"]))
        if l["semaine"]:
            print("  %s" % l["semaine"])
        if l["objectif"]:
            print("  %s" % l["objectif"])
        if l["texte"]:
            txt = " ".join(l["texte"])
            if not brut and len(txt) > 2000:
                txt = txt[:2000] + " […texte tronqué, relancer avec --brut…]"
            print("  ┌ TEXTE ─────────────────────────────────────────────")
            for ligne in txt.split("\n"):
                print("  │ %s" % ligne)
            if l["source"]:
                print("  │ SOURCE : %s" % l["source"])
            if l["lexique"]:
                print("  │ %s" % l["lexique"][:400])
            print("  └────────────────────────────────────────────────────")
        if not reste:
            print("  (tous les items de cette leçon sont corrigés)")
            continue
        rub = None
        for i in reste:
            if i["rub"] != rub:
                rub = i["rub"]
                print("  ⟨%s⟩" % (rub or "—"))
            print("  %-16s [%s] %s" % (i["id"], i["kind"], i["txt"]))


if __name__ == "__main__":
    main()
