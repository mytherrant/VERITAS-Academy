#!/usr/bin/env python3
"""Sitemap racine (sitemap.xml) : pages manquantes + dates réelles.

POURQUOI (21/10/2026)
Relevé en production : 22 pages de contenu n'étaient dans AUCUN sitemap —
les trois cours (cours/), les dix sujets d'examen (evaluations/), les cinq
pages légales, le plan du site et l'accueil de VÉRITAS Campus. Google ne
les découvrait que par les liens, quand il les suivait. Et les dates du
sitemap racine étaient figées (l'accueil au 25/07) : une date qui ne bouge
jamais n'incite pas le robot à repasser.

CE QUE FAIT LE SCRIPT (idempotent)
1. ajoute, avant </urlset>, chaque page de PAGES absente du fichier ;
2. recale TOUTES les <lastmod> du fichier sur la date du dernier commit qui
   a touché la page (git log), quand cette date est connue.

    python tools/sitemap_racine.py            # écrit sitemap.xml
    python tools/sitemap_racine.py --controle # code 1 si le fichier changerait
"""
import os
import re
import subprocess
import sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = 'https://veritas-school.com/'

# (chemin du fichier, priorité, fréquence, commentaire)
PAGES = [
    ('plan.html', '0.8', 'weekly', 'Plan du site par profil'),
    ('cours/', '0.7', 'monthly', None),
    ('cours/commentaire_compose_analyse.html', '0.7', 'monthly', 'Cours'),
    ('cours/module_1_tle_A.html', '0.7', 'monthly', None),
    ('cours/registres_de_langue_5e.html', '0.7', 'monthly', None),
    ('evaluations/', '0.8', 'weekly', "Sujets d'examen interactifs et corrigés"),
    ('evaluations/BEPC_blanc_3e_correction_orthographique.html', '0.7', 'monthly', None),
    ('evaluations/BEPC_blanc_3e_etude_de_texte.html', '0.7', 'monthly', None),
    # BEPC_blanc_3e_expression_ecrite.html : « Document enseignant — Ne pas distribuer
    # aux élèves » — volontairement HORS du sitemap.
    ('evaluations/epreuve_1ere_enfant_noir_2026.html', '0.7', 'monthly', None),
    ('evaluations/epreuve_2nde_lion_perle_2026.html', '0.7', 'monthly', None),
    ('evaluations/epreuve_3e_ville_cruelle_2026.html', '0.7', 'monthly', None),
    ('evaluations/epreuve_bac_vieux_negre_2026.html', '0.7', 'monthly', None),
    ('evaluations/evaluation_bac_anglais.html', '0.7', 'monthly', None),
    ('evaluations/evaluation_bac_langue_francaise.html', '0.7', 'monthly', None),
    ('evaluations/evaluation_bac_litterature.html', '0.7', 'monthly', None),
    ('campus/', '0.6', 'monthly', 'VÉRITAS Campus (établissements)'),
    ('legal/', '0.3', 'yearly', 'Informations légales'),
    ('legal/cgv.html', '0.3', 'yearly', None),
    ('legal/charte-pedagogique.html', '0.4', 'yearly', None),
    ('legal/confidentialite.html', '0.3', 'yearly', None),
    ('legal/mentions-legales.html', '0.3', 'yearly', None),
]


def fichier_de(url):
    rel = url[len(BASE):]
    if rel == '':
        return 'vitrine.html'
    return rel + 'index.html' if rel.endswith('/') else rel


def date_git(rel):
    try:
        d = subprocess.check_output(['git', 'log', '-1', '--format=%cs', '--', rel],
                                    cwd=RACINE, stderr=subprocess.DEVNULL).decode().strip()
        return d or None
    except Exception:
        return None


def construire(s):
    nl = '\r\n' if '\r\n' in s else '\n'
    bloc = []
    for rel, prio, freq, note in PAGES:
        url = BASE + rel
        if '<loc>%s</loc>' % url in s:
            continue
        if note:
            bloc.append('  <!-- %s -->' % note)
        bloc += ['  <url>', '    <loc>%s</loc>' % url, '    <lastmod>2026-01-01</lastmod>',
                 '    <changefreq>%s</changefreq>' % freq, '    <priority>%s</priority>' % prio, '  </url>', '']
    if bloc:
        i = s.rindex('</urlset>')
        s = s[:i] + nl.join(bloc) + nl + s[i:]

    def recaler(m):
        url, avant = m.group(1), m.group(2)
        d = date_git(fichier_de(url))
        return m.group(0).replace('<lastmod>%s</lastmod>' % avant, '<lastmod>%s</lastmod>' % d) if d else m.group(0)
    return re.sub(r'<loc>([^<]+)</loc>\s*<lastmod>([^<]+)</lastmod>', recaler, s)


def main():
    chemin = os.path.join(RACINE, 'sitemap.xml')
    avant = open(chemin, encoding='utf-8', newline='').read()
    apres = construire(avant)
    if '--controle' in sys.argv:
        if apres != avant:
            print('sitemap_racine --controle : sitemap.xml à mettre à jour (python tools/sitemap_racine.py)')
            sys.exit(1)
        print('sitemap_racine --controle : à jour')
        return
    if apres != avant:
        open(chemin, 'w', encoding='utf-8', newline='').write(apres)
    print('sitemap_racine : %d adresse(s) dans sitemap.xml' % apres.count('<loc>'))


if __name__ == '__main__':
    main()
