#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/vignettes_couvertures.py — CHAQUE COUVERTURE A SA VIGNETTE

    python tools/vignettes_couvertures.py
    python tools/vignettes_couvertures.py --controle   # ne produit rien, compte

POURQUOI CE FICHIER EXISTE
  La grille de `livrets/index.html` n'affiche JAMAIS la couverture pleine
  page : elle demande `livret_<slug>_v.jpg`, une vignette de 460 × 613. Et son
  `img.onerror` RETIRE l'image quand elle manque — pas de cadre cassé, pas
  d'erreur en console, rien.

  Mesuré en production le 08/09/2026 : les NEUF cahiers d'œuvre du 2ⁿᵈ cycle
  n'avaient pas de vignette. Leurs couvertures étaient pourtant là, au bon
  format, servies en 200. Neuf cartes s'affichaient nues dans la boutique, à
  l'endroit précis où l'on choisit ce qu'on paie 1 000 à 1 300 F, et la panne
  était parfaitement muette depuis leur mise en vente le 06/09.

  `couvertures_oeuvres.py` produit bien une vignette — mais il ne traite que
  les couvertures d'ŒUVRES (« tout sauf les livrets »). Personne ne s'occupait
  des `livret_*.jpg`. Ce script comble ce trou, et rien d'autre : il ne touche
  pas aux couvertures elles-mêmes, ne réencode pas ce qui existe déjà.

LE GABARIT
  460 × 613 (le rapport 3:4 des couvertures), qualité 80, sous-échantillonnage
  2:0, et le même renfort de netteté que `couvertures_oeuvres.py` — une image
  réduite au tiers perd son piqué, et une couverture floue dans une grille se
  lit comme un produit bâclé.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageFilter

for _f in (sys.stdout, sys.stderr):
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

RACINE = Path(__file__).resolve().parent.parent
DOSSIER = RACINE / "uploads" / "oeuvres"

VIGNETTE_L, VIGNETTE_H = 460, 613
RENFORT = dict(radius=0.7, percent=85, threshold=3)
QUALITE = 80


def couvertures() -> list[Path]:
    """Les couvertures de cahier, sans leurs vignettes."""
    return sorted(p for p in DOSSIER.glob("livret_*.jpg") if not p.stem.endswith("_v"))


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--controle", action="store_true", help="compter sans écrire")
    a = ap.parse_args()

    if not DOSSIER.is_dir():
        print(f"[X] {DOSSIER} introuvable", file=sys.stderr)
        return 1

    manquantes = [p for p in couvertures()
                  if not p.with_name(p.stem + "_v.jpg").is_file()]
    total = len(couvertures())

    if a.controle:
        if manquantes:
            for p in manquantes:
                print(f"::error title=Vignette manquante::{p.name} — la carte de "
                      f"la boutique s'affichera sans visuel")
            print(f"\n✗ {len(manquantes)} couverture(s) sur {total} sans vignette.")
            return 1
        print(f"✓ Les {total} couvertures ont leur vignette.")
        return 0

    if not manquantes:
        print(f"  Les {total} couvertures ont déjà leur vignette — rien à faire.")
        return 0

    for p in manquantes:
        im = Image.open(p).convert("RGB")
        v = im.copy()
        v.thumbnail((VIGNETTE_L, VIGNETTE_H), Image.LANCZOS)
        v = v.filter(ImageFilter.UnsharpMask(**RENFORT))
        dest = p.with_name(p.stem + "_v.jpg")
        v.save(dest, "JPEG", quality=QUALITE, optimize=True,
               progressive=True, subsampling=2)
        print(f"  + {dest.name}  {v.width}×{v.height}  "
              f"{dest.stat().st_size // 1024} Ko")

    print(f"\n  {len(manquantes)} vignette(s) produite(s) sur {total} couvertures.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
