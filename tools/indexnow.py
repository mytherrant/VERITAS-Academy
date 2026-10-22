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

N'est PAS lancé par la CI : un envoi doit suivre un déploiement réussi, et
l'adresse de la clé doit déjà répondre en production.
"""
import json
import os
import re
import sys
import urllib.request

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOTE = 'veritas-school.com'
BASE = 'https://%s/' % HOTE
POINT = 'https://api.indexnow.org/indexnow'


def lire(url):
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


def main():
    cle = open(os.path.join(RACINE, 'indexnow.txt'), encoding='utf-8').read().strip()
    en_ligne = lire(BASE + 'indexnow.txt').strip()
    if en_ligne != cle:
        sys.exit("indexnow : la clé servie en production ne correspond pas à indexnow.txt — déployer d'abord.")
    urls = adresses()
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
