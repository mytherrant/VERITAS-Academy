#!/usr/bin/env python3
"""Balises d'indexation des pages qui n'en avaient pas.

POURQUOI (21/10/2026)
Relevé en production, page par page (statut, canonique, description, Open
Graph, données structurées) :
  · les sujets d'examen (evaluations/*), les cours (cours/*) et l'accueil
    de VÉRITAS Campus n'avaient NI canonique, NI description, NI Open Graph,
    NI données structurées — Google en était réduit à deviner le résumé ;
  · une quinzaine de pages-carrefours (oeuvres/, livrets/, ressources/,
    niveaux/, plateforme/, plan, pages légales…) avaient titre et
    description mais aucune donnée structurée : pas de fil d'Ariane dans les
    résultats.

CE QUE FAIT LE SCRIPT (idempotent)
Il pose ou remplace, juste avant </head>, un bloc balisé
<!-- seo-tete --> … <!-- /seo-tete -->. Pour les pages de CONTENU il écrit
canonique + description + Open Graph + LearningResource + fil d'Ariane ;
pour les CARREFOURS, seulement le JSON-LD (leur titre et leur description
existants sont repris tels quels). Une page qui porte déjà une canonique ou
une description n'en reçoit pas une seconde.

Les descriptions sont tirées du contenu de chaque page (consigne, sous-titre,
durée, coefficient) : aucune promesse ajoutée.

    python tools/seo_tetes.py            # écrit
    python tools/seo_tetes.py --controle # code 1 si une page changerait
"""
import html
import json
import os
import re
import sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = 'https://veritas-school.com/'
ORG = {'@type': 'EducationalOrganization', 'name': 'Centre VÉRITAS', 'url': BASE}
SECTIONS = {'evaluations': "Sujets d'examen", 'cours': 'Cours', 'campus': 'VÉRITAS Campus',
            'oeuvres': 'Œuvres au programme', 'livrets': 'Cahiers en ligne', 'ressources': 'Ressources',
            'niveaux': 'Programmes par classe', 'decouvrir': 'Découvrir VÉRITAS', 'plateforme': 'Atelier de Français',
            'corriges': 'Corrigés', 'legal': 'Informations légales'}

# Pages de contenu : (description, type de ressource, niveau)
CONTENU = {
    'evaluations/BEPC_blanc_3e_correction_orthographique.html': (
        "BEPC blanc de 3e : correction orthographique d'un texte, à faire en ligne puis corrigée. Programme MINESEC — Centre VÉRITAS, Douala.",
        'Épreuve blanche', '3e'),
    'evaluations/BEPC_blanc_3e_etude_de_texte.html': (
        "BEPC blanc de 3e : étude de texte sur un extrait narratif — compréhension, langue et interprétation, avec corrigé. Programme MINESEC.",
        'Épreuve blanche', '3e'),
    'evaluations/BEPC_blanc_3e_expression_ecrite.html': (
        "BEPC blanc de 3e : expression écrite, un sujet au choix (texte argumentatif sur l'abandon scolaire ou récit d'une cérémonie traditionnelle), avec grilles d'évaluation. Programme MINESEC.",
        'Épreuve blanche', '3e'),
    'evaluations/epreuve_1ere_enfant_noir_2026.html': (
        "Épreuve de français de 1re sur L'Enfant noir de Camara Laye : extrait, questions et corrigé en ligne, conformes au programme MINESEC.",
        "Épreuve d'examen", '1re'),
    'evaluations/epreuve_2nde_lion_perle_2026.html': (
        "Épreuve de français de 2nde sur Le Lion et la Perle de Wole Soyinka : extrait, questions et corrigé en ligne, programme MINESEC.",
        "Épreuve d'examen", '2nde'),
    'evaluations/epreuve_3e_ville_cruelle_2026.html': (
        "Épreuve de français de 3e sur Ville cruelle d'Eza Boto (Mongo Beti) : extrait, questions et corrigé en ligne, programme MINESEC.",
        "Épreuve d'examen", '3e'),
    'evaluations/epreuve_bac_vieux_negre_2026.html': (
        "Épreuve de français du BAC sur Le Vieux nègre et la médaille de Ferdinand Oyono : extrait, questions et corrigé en ligne, programme MINESEC.",
        "Épreuve d'examen", 'Terminale'),
    'evaluations/evaluation_bac_anglais.html': (
        "BAC A (A1 à A5), English Language Examination : 3 heures, coefficient 4, 40 points. Évaluation interactive corrigée, MINESEC – OBC.",
        "Épreuve d'examen", 'Terminale'),
    'evaluations/evaluation_bac_langue_francaise.html': (
        "BAC A, épreuve de langue française : 2 heures, coefficient 2, 20 points. Évaluation interactive corrigée, conforme au programme MINESEC – OBC.",
        "Épreuve d'examen", 'Terminale'),
    'evaluations/evaluation_bac_litterature.html': (
        "BAC A, épreuve de littérature et culture générale : 4 heures, un sujet au choix parmi trois. Évaluation interactive, programme MINESEC.",
        "Épreuve d'examen", 'Terminale'),
    'cours/commentaire_compose_analyse.html': (
        "Leçon interactive niveau BAC : analyser le texte et la consigne d'un commentaire composé pour en tirer le plan. Centre VÉRITAS, Douala.",
        'Leçon', 'Terminale'),
    'cours/module_1_tle_A.html': (
        "Cahier de français de Terminale A sur Stances et Poèmes de Sully Prudhomme : toutes les séquences et semaines, évaluation diagnostique comprise.",
        'Cahier de cours', 'Terminale A'),
    'cours/registres_de_langue_5e.html': (
        "Leçon interactive de 5e : les registres de langue, pour choisir les mots justes selon qu'on parle à un camarade, à un professeur ou par écrit.",
        'Leçon', '5e'),
    'campus/index.html': (
        "VÉRITAS Campus, la plateforme qui gère votre établissement : frais, bulletins bilingues, SMS aux parents, ressources conformes MINESEC.",
        None, None),
}

# Carrefours : JSON-LD seul (titre et description existants)
CARREFOURS = ['decouvrir/index.html', 'livrets/index.html', 'livrets/mode-emploi.html', 'manuels.html',
              'niveaux/index.html', 'oeuvres/index.html', 'plan.html', 'ressources/index.html',
              'plateforme/index.html', 'corriges/est-1ere.html', 'corriges/est-2nde.html', 'corriges/est-tle.html', 'corriges/est-tle-ed2.html',
              'legal/cgv.html', 'legal/charte-pedagogique.html', 'legal/confidentialite.html',
              'legal/mentions-legales.html']

DEBUT, FIN = '<!-- seo-tete -->', '<!-- /seo-tete -->'

# 26/10/2026 — audit du 21/10 : 42 pages des sitemaps (ressources, niveaux,
# découvrir, outils, légal, est-*…) partaient sur WhatsApp et Facebook SANS
# vignette, faute d'og:image. Les carrefours reçoivent désormais les balises
# Open Graph qui leur manquent ; toute autre page des sitemaps qui n'a pas
# d'og:image reçoit un bloc « og seul » (aucun JSON-LD : elle a peut-être le
# sien). Titre et description existants, repris tels quels.
def og_manquants(sans, nom, desc, url):
    if re.search(r'property=["\']og:image["\']', sans, re.I):
        return []
    lignes = []
    for p, v in (('og:type', 'website'), ('og:site_name', 'Centre VÉRITAS'), ('og:locale', 'fr_CM'),
                 ('og:title', nom), ('og:description', desc), ('og:url', url),
                 ('og:image', BASE + 'og-image.jpg')):
        if v and not re.search(r'property=["\']%s["\']' % re.escape(p), sans, re.I):
            lignes.append('<meta property="%s" content="%s">' % (p, html.escape(v, quote=True)))
    if not re.search(r'name=["\']twitter:card["\']', sans, re.I):
        lignes.append('<meta name="twitter:card" content="summary_large_image">')
    return lignes


def og_seuls():
    """Pages des sitemaps hors CONTENU/CARREFOURS dont le HTML, bloc seo-tete
    retiré, n'a pas d'og:image."""
    vus, out = set(CONTENU) | set(CARREFOURS), []
    for racine, _, fichiers in os.walk(RACINE):
        if 'node_modules' in racine or os.sep + '.' in racine:
            continue
        for f in fichiers:
            if not (f.startswith('sitemap') and f.endswith('.xml')):
                continue
            xml = open(os.path.join(racine, f), encoding='utf-8').read()
            for loc in re.findall(r'<loc>' + re.escape(BASE) + r'([^<]*)</loc>', xml):
                rel = (loc or 'index.html') + ('index.html' if loc.endswith('/') else '')
                if rel in vus or not rel.endswith('.html') or rel == 'index.html':
                    continue
                vus.add(rel)
                chemin = os.path.join(RACINE, rel)
                if not os.path.exists(chemin):
                    continue
                s = open(chemin, encoding='utf-8', errors='ignore').read()
                sans = re.sub(re.escape(DEBUT) + r'[\s\S]*?' + re.escape(FIN), '', s)
                if not re.search(r'property=["\']og:image["\']', sans, re.I):
                    out.append(rel)
    return sorted(out)


def url_de(rel):
    return BASE + re.sub(r'(^|/)index\.html$', r'\1', rel)


def lire(s, motif):
    m = re.search(motif, s, re.I)
    return html.unescape(m.group(1)).strip() if m else None


def fil(rel, nom):
    morceaux = [{'@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': BASE}]
    sec = rel.split('/')[0] if '/' in rel else None
    if sec and not rel.endswith('index.html'):
        morceaux.append({'@type': 'ListItem', 'position': 2, 'name': SECTIONS.get(sec, sec), 'item': BASE + sec + '/'})
    morceaux.append({'@type': 'ListItem', 'position': len(morceaux) + 1, 'name': nom, 'item': url_de(rel)})
    return {'@type': 'BreadcrumbList', 'itemListElement': morceaux}


def bloc(rel, s):
    sans = re.sub(re.escape(DEBUT) + r'[\s\S]*?' + re.escape(FIN), '', s)
    titre = lire(sans, r'<title[^>]*>([^<]+)</title>') or rel
    nom = re.sub(r'\s*[—–|-]\s*(Centre )?VÉRITAS\s*$', '', titre).strip()
    url = url_de(rel)
    lignes = []
    if rel in CONTENU:
        desc, typ, niveau = CONTENU[rel]
        if not re.search(r'<link[^>]+rel=["\']canonical', sans, re.I):
            lignes.append('<link rel="canonical" href="%s">' % url)
        if not re.search(r'<meta[^>]+name=["\']description', sans, re.I):
            lignes.append('<meta name="description" content="%s">' % html.escape(desc, quote=True))
        if not re.search(r'property=["\']og:title', sans, re.I):
            for p, v in (('og:type', 'website'), ('og:site_name', 'Centre VÉRITAS'), ('og:locale', 'fr_CM'),
                         ('og:title', nom), ('og:description', desc), ('og:url', url),
                         ('og:image', BASE + 'og-image.jpg')):
                lignes.append('<meta property="%s" content="%s">' % (p, html.escape(v, quote=True)))
            lignes.append('<meta name="twitter:card" content="summary_large_image">')
        graphe = [fil(rel, nom)]
        if typ:
            graphe.insert(0, {'@type': 'LearningResource', 'name': nom, 'description': desc, 'url': url,
                              'inLanguage': 'fr', 'learningResourceType': typ, 'educationalLevel': niveau,
                              'isAccessibleForFree': True, 'provider': ORG, 'publisher': ORG})
        else:
            graphe.insert(0, {'@type': 'WebPage', 'name': nom, 'description': desc, 'url': url, 'inLanguage': 'fr', 'publisher': ORG})
    else:
        desc = lire(sans, r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)') or ''
        lignes += og_manquants(sans, nom, desc, url)
        if rel not in CARREFOURS:                     # « og seul » : pas de JSON-LD
            return DEBUT + '\n' + '\n'.join(lignes) + '\n' + FIN
        typ = 'CollectionPage' if rel.endswith('index.html') or rel == 'plan.html' else 'WebPage'
        graphe = [{'@type': typ, 'name': nom, 'description': desc, 'url': url, 'inLanguage': 'fr', 'publisher': ORG},
                  fil(rel, nom)]
    lignes.append('<script type="application/ld+json">%s</script>'
                  % json.dumps({'@context': 'https://schema.org', '@graph': graphe}, ensure_ascii=False, separators=(',', ':')))
    return DEBUT + '\n' + '\n'.join(lignes) + '\n' + FIN


def traiter(rel, ecrire):
    chemin = os.path.join(RACINE, rel)
    s = open(chemin, encoding='utf-8', newline='').read()
    nl = '\r\n' if '\r\n' in s else '\n'
    b = bloc(rel, s).replace('\n', nl)
    if DEBUT in s:
        nouveau = re.sub(re.escape(DEBUT) + r'[\s\S]*?' + re.escape(FIN), lambda m: b, s, count=1)
    else:
        i = s.lower().index('</head>')
        nouveau = s[:i] + b + nl + s[i:]
    if nouveau != s and ecrire:
        open(chemin, 'w', encoding='utf-8', newline='').write(nouveau)
    return nouveau != s


def main():
    controle = '--controle' in sys.argv
    changes = [rel for rel in list(CONTENU) + CARREFOURS + og_seuls() if traiter(rel, not controle)]
    if controle and changes:
        print('seo_tetes --controle : %d page(s) à mettre à jour, dont %s' % (len(changes), ', '.join(changes[:4])))
        sys.exit(1)
    print('seo_tetes : %d page(s) %s' % (len(changes), 'à jour' if controle else 'écrite(s)'))


if __name__ == '__main__':
    main()
