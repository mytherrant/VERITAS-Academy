# -*- coding: utf-8 -*-
"""tools/verifier_cle_sync.py — La cle de synchronisation locale est-elle celle du serveur ?

POURQUOI CET OUTIL EXISTE
La synchronisation est morte trois fois pour la meme raison : la cle du
navigateur (ou du poste de dev) avait diverge de celle du serveur, et le refus
401 se confondait avec une panne reseau. Douze jours en aout, cinq en septembre.
Chercher la cause a chaque fois a coute des heures, parce que « c'est la cle ou
le serveur ? » ne se tranchait par aucune commande.

Il repond a cette question, et a une seconde que le message d'erreur de
l'application signale sans qu'on puisse la verifier a l'oeil :
`define()` NE REDEFINIT PAS. Si `api/payment_config.php` contient deux
`define('API_SECRET', ...)`, seul le PREMIER compte — PHP emet un avertissement
que `display_errors=0` avale en production. On peut donc modifier la « bonne »
ligne et ne rien changer du tout.

AUCUNE VALEUR N'EST AFFICHEE — seulement la longueur, les trois premiers
caracteres, et l'ordre des definitions. C'est assez pour comparer deux fichiers
sans exposer un secret dans un terminal, une capture d'ecran ou un journal.

USAGE
    python tools/verifier_cle_sync.py               # analyse le fichier local
    python tools/verifier_cle_sync.py --verifier    # + interroge la production
"""
import io
import json
import os
import re
import ssl
import sys
import urllib.error
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CFG = os.path.join(RACINE, 'api', 'payment_config.php')
API = 'https://veritas-school.com/api/db.php?meta=1'

# Les constantes qui portent l'authentification de la synchronisation.
INTERESSANTES = ('API_SECRET', 'PAY_API_SECRET')


def empreinte(v):
    """Assez pour comparer deux valeurs, trop peu pour s'en servir."""
    return f'{len(v)} car., commence par « {v[:3]}… »'


def definitions(src):
    """Chaque define() dans l'ORDRE du fichier. L'ordre est le sujet."""
    out = []
    motif = re.compile(
        r"define\(\s*['\"]([A-Z_]+)['\"]\s*,\s*(?:['\"]([^'\"]*)['\"]|([A-Z_]+))\s*\)")
    for m in motif.finditer(src):
        nom, litteral, alias = m.group(1), m.group(2), m.group(3)
        ligne = src.count('\n', 0, m.start()) + 1
        out.append({'nom': nom, 'ligne': ligne, 'litteral': litteral, 'alias': alias})
    return out


def main():
    if not os.path.isfile(CFG):
        print(f'Fichier introuvable : {CFG}')
        print("Copiez-le depuis le serveur (api/payment_config.php), il est gitignore.")
        return 1

    src = io.open(CFG, encoding='utf-8', errors='replace').read()
    defs = definitions(src)

    print('\n\033[1mLES DEFINITIONS D\'AUTHENTIFICATION, DANS L\'ORDRE DU FICHIER\033[0m')
    print(f'  {CFG}\n')

    vus = {}
    resolu = {}
    for d in defs:
        if d['nom'] not in INTERESSANTES:
            continue
        premier = d['nom'] not in vus
        vus.setdefault(d['nom'], []).append(d)
        if d['litteral'] is not None:
            valeur, quoi = d['litteral'], empreinte(d['litteral'])
        else:
            valeur, quoi = None, f"alias de {d['alias']}"
        if premier:
            resolu[d['nom']] = (valeur, d['alias'])
        marque = '\033[32m← RETENUE\033[0m' if premier else '\033[33m← IGNOREE (define ne redefinit pas)\033[0m'
        print(f"  ligne {d['ligne']:>4}  {d['nom']:<16} {quoi:<34} {marque}")

    if not vus:
        print('  Aucune definition trouvee — le fichier ne suit pas la forme attendue.')
        return 1

    # Resolution des alias : API_SECRET = PAY_API_SECRET, par exemple.
    for nom, (val, alias) in list(resolu.items()):
        if val is None and alias in resolu and resolu[alias][0] is not None:
            resolu[nom] = (resolu[alias][0], None)

    print('\n\033[1mCE QUE PHP UTILISERA REELLEMENT\033[0m')
    for nom in INTERESSANTES:
        if nom in resolu:
            v = resolu[nom][0]
            print(f'  {nom:<16} {empreinte(v) if v else "(non resolue)"}')
        else:
            print(f'  {nom:<16} \033[33mabsente\033[0m')

    doublons = [n for n, l in vus.items() if len(l) > 1]
    if doublons:
        print('\n\033[33m  ATTENTION — definie plusieurs fois : ' + ', '.join(doublons) + '\033[0m')
        print('  Seule la PREMIERE compte. Modifier une ligne plus bas ne change rien,')
        print("  et PHP n'affiche l'avertissement nulle part en production.")

    if '--verifier' not in sys.argv:
        print('\n  Ajoutez --verifier pour comparer cette cle a celle du serveur.')
        return 0

    cle = resolu.get('API_SECRET', (None, None))[0]
    if not cle:
        print('\n  API_SECRET non resolue : rien a verifier.')
        return 1

    print('\n\033[1mLA PRODUCTION ACCEPTE-T-ELLE CETTE CLE ?\033[0m')
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(API, headers={
        'Authorization': 'Bearer ' + cle,
        'User-Agent': 'Mozilla/5.0 (VeritasDiag)'})
    try:
        r = urllib.request.urlopen(req, timeout=40, context=ctx)
        corps = r.read().decode('utf-8', 'replace')[:200]
        print(f'  \033[32mHTTP {r.status} — MEME CLE que le serveur.\033[0m  {corps}')
        return 0
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print('  \033[31mHTTP 401 — la production REFUSE cette cle : les deux fichiers ont diverge.\033[0m')
            print('  Recuperez api/payment_config.php depuis le serveur (FTP) et remplacez le local,')
            print("  ou recopiez la valeur du PREMIER define('API_SECRET', ...) de sa version serveur.")
        elif e.code == 403:
            print("  \033[33mHTTP 403 — ce n'est probablement PAS la cle, mais le mur anti-DDoS de LWS.\033[0m")
            print('  Attendez une minute et relancez : six mauvaises requetes par minute suffisent a le declencher.')
        else:
            print(f'  HTTP {e.code} — reponse inattendue : {e.read().decode("utf-8", "replace")[:160]}')
        return 1
    except Exception as e:
        print(f'  Echec reseau : {e}')
        return 1


if __name__ == '__main__':
    sys.exit(main())
