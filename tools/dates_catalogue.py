#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/dates_catalogue.py — LA DATE DE MISE EN VENTE DE CHAQUE OUVRAGE

    python tools/dates_catalogue.py            # complète les dates manquantes
    python tools/dates_catalogue.py --controle # échoue si une fiche n'en a pas

POURQUOI
  La boutique met en avant les NOUVEAUTÉS : un bandeau « Nouveautés » et un
  badge « Nouveau » sur les cartes récentes. Encore faut-il savoir ce qui est
  récent. Le catalogue ne portait aucune date — et une nouveauté écrite à la
  main se périme sans que personne y pense : le badge reste, le produit a six
  mois, et la vitrine ment.

  La règle maison (« preuve sociale et chiffres : réels uniquement ») veut que
  la date soit VRAIE. On la lit donc dans l'historique : le premier commit où
  la fiche apparaît dans `api/data/livrets_catalogue.json`, c'est-à-dire le
  jour où l'ouvrage est entré en vente. Rien n'est inventé, rien n'est à
  maintenir : le badge disparaît tout seul quand l'ouvrage vieillit.

  Une date déjà posée n'est JAMAIS réécrite : si Jacques en corrige une à la
  main (une sortie officielle différente du dépôt), elle fait foi.

CONTRÔLE
  `--controle` échoue si une fiche n'a pas de date valide. C'est ce qui empêche
  un outil de publication qui réécrit une fiche entière d'effacer la date en
  silence — le bandeau des nouveautés perdrait alors un titre sans un mot.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import subprocess
import sys
from pathlib import Path

for _f in (sys.stdout, sys.stderr):
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

RACINE = Path(__file__).resolve().parent.parent
CATALOGUE = RACINE / "api" / "data" / "livrets_catalogue.json"
REL = "api/data/livrets_catalogue.json"
RE_DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def premiere_apparition(slug: str) -> str | None:
    """Date (AAAA-MM-JJ) du plus ancien commit qui a introduit `"<slug>": {`."""
    motif = f'"{slug}": {{'
    try:
        r = subprocess.run(
            ["git", "log", "--format=%ad", "--date=short", "-S", motif, "--", REL],
            cwd=RACINE, capture_output=True, text=True, encoding="utf-8", check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None
    dates = [l.strip() for l in r.stdout.splitlines() if RE_DATE.match(l.strip())]
    return min(dates) if dates else None


def main() -> int:
    ap = argparse.ArgumentParser(description="Dates de mise en vente du catalogue.")
    ap.add_argument("--controle", action="store_true")
    a = ap.parse_args()

    cat = json.loads(CATALOGUE.read_text(encoding="utf-8"))
    ouvrages = cat.get("ouvrages") or {}

    if a.controle:
        sans = [s for s, o in ouvrages.items()
                if not RE_DATE.match(str((o or {}).get("ajoute", "")))]
        if sans:
            for s in sans:
                print(f"::error title=Ouvrage sans date de mise en vente::{s} — "
                      f"lancer : python tools/dates_catalogue.py")
            print(f"\n✗ {len(sans)} fiche(s) sans date : la boutique ne peut pas "
                  f"dire si elles sont nouvelles.")
            return 1
        print(f"✓ Les {len(ouvrages)} ouvrages du catalogue portent leur date de mise en vente.")
        return 0

    aujourd_hui = dt.date.today().isoformat()
    poses = 0
    for slug, o in ouvrages.items():
        if RE_DATE.match(str(o.get("ajoute", ""))):
            continue                                   # posée : elle fait foi
        # Pas encore dans l'historique = ajouté dans la copie de travail, donc
        # aujourd'hui. C'est exactement le cas d'un ouvrage qu'on publie.
        o["ajoute"] = premiere_apparition(slug) or aujourd_hui
        poses += 1
        print(f"  {slug:22} {o['ajoute']}")

    if poses:
        CATALOGUE.write_text(json.dumps(cat, ensure_ascii=False, indent=2) + "\n",
                             encoding="utf-8")
    print(f"\n{poses} date(s) posée(s), {len(ouvrages) - poses} déjà présente(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
