#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VÉRITAS — Poppins servie par le site, plus par Google Fonts
===========================================================
Audit du 21/10/2026 (phase performance) : chaque page publique chargeait
Poppins depuis fonts.googleapis.com, qui renvoie à fonts.gstatic.com — deux
connexions tierces (DNS + TCP + TLS) avant que le texte puisse s'afficher
dans sa police. Sur la 3G des élèves (RTT ~300 ms), c'est l'essentiel du
délai de premier affichage d'une page de 10 Ko. Jacques, 22/10 : « héberger
les polices sur le site ».

CE QUE FAIT LA PASSE (idempotente)
  · tout <link> qui ne demande QUE Poppins à Google
    (…css2?family=Poppins:wght@…&display=swap) pointe désormais vers
    /assets/polices.css?v=1 — feuille écrite une fois avec les woff2 de
    Google Fonts (licence OFL), latin + latin-ext, graisses 300 à 700, dans
    assets/polices/. Ses autres attributs (media="print" onload=…) restent ;
  · les <link rel="preconnect"> vers fonts.googleapis.com / fonts.gstatic.com
    sont retirés d'une page QUAND plus aucune police Google n'y est demandée ;
  · un lien qui mêle Poppins à d'autres familles (Atelier, cahiers) n'est PAS
    touché : il resterait sinon une demande Google, sans le gain.

JAMAIS SUR LE DÉPÔT. Essayé le 26/10 : habiller_pages.py se repère sur ces
liens pour placer ses blocs, et son --controle tombait sur 247 pages. La
passe ne tourne donc QUE sur la copie de déploiement, en CI, APRÈS
l'habillage et AVANT l'alignement des ?v= (qui remplace le « ?v=1 ») : elle
couvre ainsi toutes les pages, y compris celles qu'un générateur reproduira
demain avec l'ancien lien, sans que le dépôt ait à changer.

Usage :
    python tools/polices_locales.py deploy          # CI
    python tools/polices_locales.py <dossier>       # banc local sur une copie
"""
import os
import re
import sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIEN = re.compile(r'(<link\b[^>]*?href=")https://fonts\.googleapis\.com/css2\?family=Poppins:wght@[\d;]+&(?:amp;)?display=swap(")', re.I)
PRECONNECT = re.compile(r'[ \t]*<link\b[^>]*rel="preconnect"[^>]*href="https://fonts\.(?:googleapis|gstatic)\.com"[^>]*>[ \t]*\r?\n?', re.I)
GOOGLE = re.compile(r'fonts\.googleapis\.com/(?:css|icon)', re.I)
LOCAL = '/assets/polices.css?v=1'


def traiter(texte):
    corps, n = LIEN.subn(lambda m: m.group(1) + LOCAL + m.group(2), texte)
    if n and not GOOGLE.search(corps):
        corps = PRECONNECT.sub('', corps)
    return corps, n


def main():
    if len(sys.argv) < 2:
        raise SystemExit("polices_locales : indiquer le dossier de déploiement (ex. « deploy »). "
                         "Le dépôt lui-même n'est jamais réécrit — voir l'en-tête.")
    cible = os.path.abspath(os.path.join(RACINE, sys.argv[1]))
    if cible == RACINE or not os.path.isdir(cible):
        raise SystemExit("polices_locales : %s n'est pas un dossier de déploiement." % sys.argv[1])
    pages = liens = 0
    for racine, dossiers, fichiers in os.walk(cible):
        dossiers[:] = [d for d in dossiers if d not in ('node_modules', '.git', 'deploy') and not d.startswith('.')]
        for f in fichiers:
            if not f.endswith(('.html', '.php')):
                continue
            chemin = os.path.join(racine, f)
            s = open(chemin, encoding='utf-8', errors='surrogateescape', newline='').read()
            if 'family=Poppins' not in s:
                continue
            nouveau, n = traiter(s)
            if nouveau != s:
                open(chemin, 'w', encoding='utf-8', errors='surrogateescape', newline='').write(nouveau)
                pages += 1
                liens += n
    print('polices_locales : %d lien(s) Poppins -> %s, sur %d page(s) de %s'
          % (liens, LOCAL, pages, os.path.relpath(cible, RACINE)))


if __name__ == '__main__':
    main()
