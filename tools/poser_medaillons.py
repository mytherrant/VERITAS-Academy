#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/poser_medaillons.py — pose assets/veritas-medaillons.js sur les pages statiques.

POURQUOI CE SCRIPT
    Les 151 pages statiques du site viennent de quatre sources (build_corriges.py,
    build_seo.cjs, pages ecrites a la main, pages d'oeuvres) et se repartissent sur
    DEUX feuilles de style. Aucun script n'est charge par toutes : veritas-ui.js en
    couvre 83, veritas-convert.js 124, ambassa.js 139. Il n'existait donc aucun
    endroit unique ou poser un comportement commun.

    Ce script ajoute la balise manquante, une fois, la ou elle manque. Il est
    IDEMPOTENT : relance-le autant de fois que tu veux, il ne double rien.

USAGE
    python tools/poser_medaillons.py            # applique
    python tools/poser_medaillons.py --essai    # montre ce qui serait fait
"""
from __future__ import annotations

import io
import re
import sys
from pathlib import Path

BALISE = '<script src="/assets/veritas-medaillons.js?v=1.19.47" defer></script>'

DOSSIERS = [
    'corriges', 'oeuvres', 'ressources', 'niveaux', 'decouvrir',
    'eleve', 'enseignant', 'parcours', 'adopter', 'outils', 'flash',
]
RACINE = ['constellation.html', 'manuels.html']

# Les livrets sont des COQUILLES de produit vendu : leur contenu arrive du
# serveur apres verification du code. On n'y touche pas — un script de plus
# dans une coquille verrouillee demande sa propre revue.
EXCLUS = {'livrets'}


def pages() -> list[Path]:
    out: list[Path] = []
    for d in DOSSIERS:
        if d in EXCLUS:
            continue
        p = Path(d)
        if p.is_dir():
            out.extend(sorted(p.rglob('*.html')))
    for f in RACINE:
        if Path(f).is_file():
            out.append(Path(f))
    return out


def main() -> int:
    essai = '--essai' in sys.argv
    ajoutes, deja, sans_body = 0, 0, []

    for f in pages():
        s = io.open(f, encoding='utf-8').read()
        if 'veritas-medaillons.js' in s:
            deja += 1
            continue
        # On insere juste avant </body> : le script est en `defer`, mais le
        # placer la garantit qu'il ne retarde jamais l'affichage du texte.
        m = re.search(r'</body\s*>', s, re.I)
        if not m:
            sans_body.append(str(f))
            continue
        s2 = s[:m.start()] + BALISE + '\n' + s[m.start():]
        if not essai:
            io.open(f, 'w', encoding='utf-8', newline='').write(s2)
        ajoutes += 1

    print(f"{'[essai] ' if essai else ''}balise ajoutee : {ajoutes}")
    print(f"deja presente  : {deja}")
    if sans_body:
        # Echec BRUYANT : une page sans </body> ne recevra jamais la balise, et
        # ses cartes resteront sans medaillon sans que rien ne le signale.
        print(f"::error:: {len(sans_body)} page(s) sans </body> — non traitees :")
        for p in sans_body:
            print(f"   {p}")
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
