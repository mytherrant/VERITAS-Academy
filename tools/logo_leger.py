#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VÉRITAS — Le logo affiché en 46 px n'a pas à peser 91 Ko
========================================================
Audit 3G du 28/10/2026 : chaque page affiche le logo en 46 × 46 px (62 px au
pied de l'accueil) à partir de /assets/veritas-logo.png. Ce fichier a été
allégé le 21/10 (91 Ko → 12 Ko), mais .htaccess le sert « immutable, un an »
SANS ?v= : un visiteur venu avant le 21/10 garde les 91 Ko jusqu'en 2027.
C'est ce que l'audit a mesuré. Seule une URL NEUVE l'atteint.

CE QUE FAIT LA PASSE (idempotente)
  · dans toute balise <img> qui affiche assets/veritas-logo.png, l'adresse
    devient assets/veritas-logo-96.webp (96 × 97, 7 Ko, net jusqu'à 2× en
    46 px), et width/height suivent ;
  · rien d'autre : le favicon, le JSON-LD et og:image gardent le PNG — un
    moteur ou un réseau social ne lit pas forcément le WebP, et ce ne sont
    pas des octets que le visiteur attend.

JAMAIS SUR LE DÉPÔT, comme tools/polices_locales.py : la barre vient de
vitrine.html, recopiée par build_plan.py puis habiller_pages.py sur ~300
pages, et le --controle de l'habillage compare au modèle. La passe tourne sur
la copie de déploiement, en CI : elle couvre toutes les pages, y compris
celles qu'un générateur reproduira demain avec l'ancien lien.

Usage :
    python tools/logo_leger.py deploy          # CI
    python tools/logo_leger.py <dossier>       # banc local sur une copie
"""
import os
import re
import sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = re.compile(r'<img\b[^>]*?assets/veritas-logo\.png[^>]*>', re.I)


def leger(balise):
    b = balise.replace('assets/veritas-logo.png', 'assets/veritas-logo-96.webp')
    b = re.sub(r'\bwidth="\d+"', 'width="96"', b)
    return re.sub(r'\bheight="\d+"', 'height="97"', b)


def traiter(texte):
    return IMG.subn(lambda m: leger(m.group(0)), texte)


def main():
    if len(sys.argv) < 2:
        raise SystemExit("logo_leger : indiquer le dossier de déploiement (ex. « deploy »). "
                         "Le dépôt lui-même n'est jamais réécrit — voir l'en-tête.")
    cible = os.path.abspath(os.path.join(RACINE, sys.argv[1]))
    if cible == RACINE or not os.path.isdir(cible):
        raise SystemExit("logo_leger : %s n'est pas un dossier de déploiement." % sys.argv[1])
    if not os.path.isfile(os.path.join(cible, 'assets', 'veritas-logo-96.webp')):
        raise SystemExit("logo_leger : assets/veritas-logo-96.webp absent de %s — "
                         "le logo disparaîtrait de chaque page." % sys.argv[1])
    pages = logos = 0
    for racine, dossiers, fichiers in os.walk(cible):
        dossiers[:] = [d for d in dossiers if d not in ('node_modules', '.git', 'deploy') and not d.startswith('.')]
        for f in fichiers:
            if not f.endswith(('.html', '.php')):
                continue
            chemin = os.path.join(racine, f)
            s = open(chemin, encoding='utf-8', errors='surrogateescape', newline='').read()
            if 'veritas-logo.png' not in s:
                continue
            nouveau, n = traiter(s)
            if nouveau != s:
                open(chemin, 'w', encoding='utf-8', errors='surrogateescape', newline='').write(nouveau)
                pages += 1
                logos += n
    print('logo_leger : %d logo(s) -> assets/veritas-logo-96.webp, sur %d page(s) de %s'
          % (logos, pages, os.path.relpath(cible, RACINE)))


if __name__ == '__main__':
    main()
