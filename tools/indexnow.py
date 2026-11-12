#!/usr/bin/env python3
"""Signale les adresses du site aux moteurs IndexNow (Bing, Yandex, Seznam…).

POURQUOI (21/10/2026)
« Qu'on puisse voir de partout » : Google n'est pas seul. Bing alimente aussi
DuckDuckGo, Yahoo, Ecosia et la recherche de ChatGPT ; IndexNow lui signale
une page neuve ou modifiée en quelques minutes, sans attendre son robot. Une
seule requête suffit pour tous les moteurs du protocole (ils se la
partagent).

La clé vit dans indexnow.txt, à la racine du site (déployée par deploy.yml) :
le moteur la relit pour vérifier que l'envoi vient bien du propriétaire.

    python tools/indexnow.py            # envoie toutes les adresses des sitemaps EN PRODUCTION
    python tools/indexnow.py --essai    # liste ce qui serait envoyé, n'envoie rien
    python tools/indexnow.py --evenement "$GITHUB_EVENT_PATH"
                                        # seulement les pages touchées par ce push

LANCÉ PAR LA CI DEPUIS LE 06/11/2026, APRÈS un déploiement réussi (deploy.yml,
étape « 📣 Signaler les pages neuves »). Jacques devait le lancer à la main
depuis son PC, et ne pouvait pas le faire depuis une session cloud (pas
d'accès au site) : chaque page publiée attendait donc le passage spontané
de Bing. Avec --evenement, on lit dans l'événement « push » de GitHub les
fichiers ajoutés ou modifiés, on les traduit en adresses, et on ne garde que
celles qui figurent dans les sitemaps EN PRODUCTION : IndexNow demande de
signaler ce qui a changé, pas tout le site à chaque fois. Sans liste de
commits (lancement manuel du workflow), tout le site est signalé.
"""
import json
import os
import re
import sys
import time
import urllib.request

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOTE = 'veritas-school.com'
BASE = 'https://%s/' % HOTE
POINT = 'https://api.indexnow.org/indexnow'


def lire(url):
    # Requête FRAÎCHE (06/11/2026). Sans Accept-Encoding, urllib lit la
    # variante « identity » du cache edge de LWS — que nul navigateur ne
    # demande — et elle peut dater de la veille : le sitemap-index lu juste
    # après le déploiement de la #208 ne connaissait pas encore les 101
    # scènes, qui n'ont pas été signalées. Une query non vide contourne le
    # cache et lit le disque.
    sep = '&' if '?' in url else '?'
    url = '%s%sfrais=%d' % (url, sep, int(time.time()))
    req = urllib.request.Request(url, headers={'User-Agent': 'VeritasIndexNow/1.0'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode('utf-8', 'replace')


def adresses():
    vues, urls = set(), []
    for sm in re.findall(r'<loc>([^<]+)</loc>', lire(BASE + 'sitemap-index.xml')):
        for u in re.findall(r'<loc>([^<]+)</loc>', lire(sm.strip())):
            u = u.strip()
            if u.startswith(BASE) and u not in vues:
                vues.add(u)
                urls.append(u)
    return urls


def url_du_fichier(rel):
    """Chemin du dépôt → adresse publique. vitrine.html est servie sur « / »
    (index.php) ; un index.html, sur son dossier."""
    rel = rel.replace('\\', '/').lstrip('./')
    if rel == 'vitrine.html':
        return BASE
    if not rel.endswith('.html'):
        return None
    if rel == 'index.html' or rel.endswith('/index.html'):
        rel = rel[:-len('index.html')]
    return BASE + rel


def fichiers_du_push(chemin):
    """Fichiers ajoutés ou modifiés par les commits de l'événement « push ».
    None quand l'événement n'en porte pas (lancement manuel) : tout le site."""
    try:
        with open(chemin, encoding='utf-8') as f:
            ev = json.load(f)
    except (OSError, ValueError):
        return None
    if not ev.get('commits'):
        return None
    # Les commits de l'événement « push » ne listent PAS leurs fichiers dans
    # GitHub Actions (added/modified absents) : le premier envoi automatique,
    # le 06/11/2026, a lu « 0 fichier » pour un push qui en touchait 115. On
    # demande donc la liste à l'API « compare » entre l'avant et l'après.
    avant, apres = ev.get('before') or '', ev.get('after') or ''
    depot = (ev.get('repository') or {}).get('full_name') or ''
    jeton = os.environ.get('GITHUB_TOKEN', '')
    if not (avant.strip('0') and apres and depot):
        return None
    url = 'https://api.github.com/repos/%s/compare/%s...%s' % (depot, avant, apres)
    entetes = {'Accept': 'application/vnd.github+json', 'User-Agent': 'VeritasIndexNow/1.0'}
    if jeton:
        entetes['Authorization'] = 'Bearer ' + jeton
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=entetes), timeout=30) as r:
            comp = json.loads(r.read().decode('utf-8'))
    except Exception as e:  # API indisponible : on signale tout le site plutôt que rien
        print('indexnow : comparaison GitHub impossible (%s) — tout le site sera signalé.' % e)
        return None
    fichiers = comp.get('files') or []
    if len(fichiers) >= 300:  # l'API tronque la liste à 300 : on ne sait pas tout, on signale tout
        return None
    return sorted(f['filename'] for f in fichiers if f.get('status') in ('added', 'modified', 'renamed', 'copied'))


def main():
    cle = open(os.path.join(RACINE, 'indexnow.txt'), encoding='utf-8').read().strip()
    en_ligne = lire(BASE + 'indexnow.txt').strip()
    if en_ligne != cle:
        sys.exit("indexnow : la clé servie en production ne correspond pas à indexnow.txt — déployer d'abord.")
    urls = adresses()
    if '--evenement' in sys.argv:
        i = sys.argv.index('--evenement')
        fichiers = fichiers_du_push(sys.argv[i + 1]) if i + 1 < len(sys.argv) else None
        if fichiers is not None:
            touchees = {url_du_fichier(f) for f in fichiers} - {None}
            urls = [u for u in urls if u in touchees]
            print('indexnow : %d fichier(s) dans ce push, %d page(s) publique(s) concernée(s)' % (len(fichiers), len(urls)))
            if not urls:
                print('indexnow : aucune page publique touchée — rien à signaler.')
                return
    print('indexnow : %d adresse(s) à signaler' % len(urls))
    if '--essai' in sys.argv:
        for u in urls[:10]:
            print('  ', u)
        return
    for i in range(0, len(urls), 10000):
        corps = json.dumps({'host': HOTE, 'key': cle, 'keyLocation': BASE + 'indexnow.txt',
                            'urlList': urls[i:i + 10000]}).encode('utf-8')
        req = urllib.request.Request(POINT, data=corps, method='POST',
                                     headers={'Content-Type': 'application/json; charset=utf-8'})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                print('indexnow : réponse %d' % r.status)
        except urllib.error.HTTPError as e:
            print('indexnow : réponse %d — %s' % (e.code, e.read()[:200]))


if __name__ == '__main__':
    main()
