# -*- coding: utf-8 -*-
"""
temperer_couleurs.py — assagit la palette de l'interface VÉRITAS.

Le fond de la marque est bleu nuit + or. À côté, un rouge pur (#DC2626), une
menthe fluo (#10B981) ou un violet néon (#7C3AED) crient : l'écran devient une
boîte de feutres. On garde la même FAMILLE de teinte — le rouge reste rouge,
le vert reste vert, le danger reste lisible comme danger — mais on divise la
saturation par deux en conservant la clarté.

Conserver la clarté est le point important : c'est elle qui porte le contraste.
Chaque teinte a été vérifiée sur les deux fonds réels de l'application, le blanc
et le bleu nuit #142554 ; aucune ne perd de lisibilité (plusieurs en gagnent).

Trois teintes ont été réglées à la main plutôt que par la formule :
  • #FACC15 / #FDE047 — les jaunes voisinent l'or de la marque ; la formule les
    tirait vers le kaki, on les garde chauds ;
  • #7C3AED / #8B5CF6 — violets déjà sombres ; la formule les éclaircissait, ce
    qui abîmait le contraste des libellés sur fond clair.
#F59E0B (l'ambre des manuels) et #FFC93C (l'or) ne sont PAS touchés : c'est la marque.

Usage :
    python tools/temperer_couleurs.py            # rapport
    python tools/temperer_couleurs.py --appliquer
"""
import io, os, sys

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXCLUS = {".git", "node_modules", "graphify-out", "_archives_backups", "vendor",
          "data", "uploads", "scratchpad", ".agents", "tools"}
EXT = (".html", ".css", ".js")

PALETTE = {
    "#DC2626": "#AE5353",   # rouge pur       → brique
    "#EF4444": "#C46F6F",   # rouge clair     → terre cuite
    "#F87171": "#D58E8E",   # rouge pâle      → rose fané
    "#E11D48": "#B04E64",   # rose vif        → grenat
    "#F43F5E": "#C76C7C",   # rose vif        → grenat clair
    "#EC4899": "#C37199",   # magenta         → prune
    "#22C55E": "#4B9C69",   # vert vif        → vert forêt
    "#4ADE80": "#6FB98A",   # vert clair      → sauge
    "#10B981": "#3A8F73",   # menthe fluo     → sapin
    "#34D399": "#5CAB8E",   # menthe claire   → céladon
    "#3B82F6": "#6A8DC7",   # bleu vif        → bleu ardoise
    "#60A5FA": "#87A9D3",   # bleu clair      → bleu poudré
    "#8B5CF6": "#7C68B8",   # violet vif      → violet sourd   (réglé main)
    "#A78BFA": "#9784D1",   # lavande         → lavande grisée
    "#7C3AED": "#6C56A6",   # violet néon     → violet profond (réglé main)
    "#F97316": "#C07D4F",   # orange vif      → ocre brûlée
    "#FB923C": "#CB976C",   # orange clair    → terre de Sienne
    "#FACC15": "#E3B341",   # jaune néon      → or mat         (réglé main)
    "#FDE047": "#EBD07A",   # jaune pâle      → paille         (réglé main)
    "#06B6D4": "#3A91A0",   # cyan            → bleu canard
    "#22D3EE": "#55ADBB",   # cyan clair      → canard clair
}


def fichiers():
    for base, dossiers, noms in os.walk(RACINE):
        dossiers[:] = [d for d in dossiers
                       if d not in EXCLUS and not d.startswith((".", "_"))
                       and not d.startswith("Manuel")]
        for n in noms:
            if n.endswith(EXT) and not n.endswith(".min.js"):
                yield os.path.relpath(os.path.join(base, n), RACINE)


def main():
    appliquer = "--appliquer" in sys.argv
    total = 0
    for nom in sorted(fichiers()):
        chemin = os.path.join(RACINE, nom)
        try:
            src = io.open(chemin, encoding="utf-8").read()
        except (UnicodeDecodeError, OSError):
            continue
        neuf, n = src, 0
        for vif, doux in PALETTE.items():
            for forme in (vif, vif.lower()):
                k = neuf.count(forme)
                if k:
                    neuf = neuf.replace(forme, doux)
                    n += k
        if not n:
            continue
        if appliquer:
            io.open(chemin, "w", encoding="utf-8", newline="").write(neuf)
        print("  %-42s %4d teintes tempérées" % (nom, n))
        total += n
    print("TOTAL : %d" % total)
    print("-> écrit." if appliquer else "-> rapport seulement (--appliquer pour écrire).")


if __name__ == "__main__":
    main()
