# -*- coding: utf-8 -*-
"""
sans_bordure_gauche.py — retire les barres verticales colorées à gauche des cartes.

Le motif « 4px solid <couleur> à gauche » était le tic visuel du fichier : tuiles
de l'accueil, cartes d'examen, encadrés, éléments actifs de la barre latérale.
Empilé, il découpe l'écran en tranches et vieillit la page. On l'enlève partout ;
la couleur reste portée par la pastille d'icône, le fond teinté et le titre.

Ce qu'on NE touche PAS :
  • border-left:7px solid transparent  → c'est un triangle CSS, pas une bordure ;
  • border-left:0 / border-left-width:0 → suppressions déjà en place ;
  • les bordures de 1 et 2 px           → séparateurs de structure, invisibles.

Usage :
    python tools/sans_bordure_gauche.py            # rapport
    python tools/sans_bordure_gauche.py --appliquer
"""
import io, os, re, sys

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# « partout » : l'application ET les pages statiques (espaces, corrigés, SEO…)
EXCLUS = {".git", "node_modules", "graphify-out", "_archives_backups", "vendor",
          "data", "uploads", "scratchpad", ".agents", "tools"}
EXT = (".html", ".css", ".js")


def fichiers():
    for base, dossiers, noms in os.walk(RACINE):
        dossiers[:] = [d for d in dossiers
                       if d not in EXCLUS and not d.startswith((".", "_"))
                       and not d.startswith("Manuel")]
        for n in noms:
            if n.endswith(EXT) and not n.endswith(".min.js"):
                yield os.path.relpath(os.path.join(base, n), RACINE)

# « border-left:4px solid #FFC93C », « border-left: 3px solid var(--x) », etc.
# La couleur peut aussi être une CONCATÉNATION JS ('+o.color+') ou un ${...} :
# si on ne l'avale pas avec la déclaration, il reste un fragment orphelin dans
# l'attribut style — c'est ce qui produisait « border:1px solid #E6EAF2;'+o.color+'; ».
COULEUR_JS = (r"(?:#[0-9A-Fa-f]{3,8}|var\([^)]*\)|\$\{[^}]*\}|rgba?\([^)]*\)|currentColor"
              r"|'\s*\+[^+]{1,80}?\+\s*'|\"\s*\+[^+]{1,80}?\+\s*\")")
BARRE = re.compile(
    r"border-left\s*:\s*[345]px\s+solid\s*"          # épaisseur décorative
    + COULEUR_JS + r"?"
    r"\s*(?:!important)?\s*;?", re.I)
# « border-left-color:… » devient sans objet une fois la barre partie
COULEUR = re.compile(r"border-left-color\s*:\s*[^;}\"']+\s*(?:!important)?\s*;?", re.I)


def nettoie(src):
    n = 0
    def coupe(m):
        nonlocal n
        if "transparent" in m.group(0).lower():   # triangle CSS : on laisse
            return m.group(0)
        n += 1
        return ""
    out = BARRE.sub(coupe, src)
    out, k = COULEUR.subn("", out)
    # des « ;; » ou « { ; » peuvent rester après la coupe
    out = re.sub(r";\s*;", ";", out)
    out = re.sub(r"\{\s*;", "{", out)
    return out, n + k


def main():
    appliquer = "--appliquer" in sys.argv
    total = 0
    for nom in sorted(fichiers()):
        chemin = os.path.join(RACINE, nom)
        try:
            src = io.open(chemin, encoding="utf-8").read()
        except (UnicodeDecodeError, OSError):
            continue
        out, n = nettoie(src)
        if not n:
            continue
        if appliquer:
            io.open(chemin, "w", encoding="utf-8", newline="").write(out)
        print("  %-42s %3d barres retirées" % (nom, n))
        total += n
    print("TOTAL : %d" % total)
    print("-> écrit." if appliquer else "-> rapport seulement (--appliquer pour écrire).")


if __name__ == "__main__":
    main()
