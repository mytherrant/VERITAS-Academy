#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/build_hubs.py — GÉNÈRE les pages d'index manquantes des dossiers publics
© 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

    python tools/build_hubs.py

POURQUOI CE FICHIER EXISTE — mesuré le 17/09/2026
    La Search Console a signalé trois nouveaux motifs de non-indexation :
    « Bloquée en raison d'une interdiction d'accès (403) », « Erreur serveur
    (5xx) », « Introuvable (404) ». Mesuré en production, avec l'agent de
    Googlebot :

        /evaluations/  → 403        /cours/   → 403
        /legal/        → 403        /uploads/ → 403

    La cause n'est pas une panne : `.htaccess` pose `Options -Indexes`, et un
    dossier SANS page d'index ne peut donc que refuser. Les pages, elles,
    répondent 200 — `/legal/cgv.html` comme `/evaluations/BEPC_blanc_3e…`.
    C'est l'adresse du DOSSIER qui est fermée, et Google la demande parce
    qu'elle apparaît dans le JavaScript servi (app.js écrit « /evaluations/ »
    et « /cours/ ») et parce qu'un moteur remonte les chemins.

    Et ces 403 coûtent plus qu'un motif dans un rapport : LWS ferme le site
    entier à une IP au-delà de SIX réponses refusées par minute
    (OL-BADRATE-PER-IP, réserve 20) et rend alors 509/512 — un 5xx. Un
    Googlebot qui butte sur plusieurs dossiers refusés fabrique lui-même
    l'« Erreur serveur » du rapport suivant.

CE QUE FAIT CE SCRIPT
    Il écrit une vraie page d'accueil pour chaque dossier de contenu qui n'en
    a pas : la liste de ses pages, avec leur titre et leur description réels,
    lus dans les fichiers. Le 403 devient une page utile — pour Google, et
    pour le visiteur qui tape l'adresse du dossier.

    Les dossiers d'ASSETS (/assets/, /chunks/, /uploads/…) n'ont pas de page à
    montrer : ils sont traités dans robots.txt, qui interdit leur seule adresse
    de dossier sans toucher aux fichiers qu'ils contiennent.

    Mise en forme : la carte de la vitrine, importée de build_plan.py. Aucune
    charte nouvelle — c'est la dérive qui avait rendu plan.html « fade ».
"""
import io
import os
import re
import sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(RACINE, 'tools'))

import build_plan as BP  # noqa: E402  (CSS_CARTES, ico, sprite, esc, VER, SITE)

# ── Les dossiers à doter d'un index ────────────────────────────────────────
#    (dossier, titre, sous-titre, description meta, icône, famille)
HUBS = [
    ('evaluations', 'Évaluations et épreuves blanches',
     'Se situer avant l\'examen, sur des sujets au format officiel',
     'Épreuves blanches BEPC et corrigés d\'œuvres au programme, en accès libre : '
     'étude de texte, expression écrite, correction orthographique.',
     'lc-target', 'rose'),
    ('cours', 'Cours rédigés',
     'La leçon écrite, pour reprendre ce qui n\'a pas été compris en classe',
     'Cours de français rédigés pour le programme camerounais : registres de langue, '
     'commentaire composé, cahier de Terminale A.',
     'lc-doc', 'bleu'),
    ('legal', 'Informations légales',
     'Qui édite ce site, ce qu\'il vend, ce qu\'il fait de vos données',
     'Mentions légales, conditions générales de vente, politique de confidentialité '
     'et charte pédagogique du Centre VÉRITAS.',
     'lc-shield', 'sarcelle'),
]

# Fichiers qui ne sont pas des pages : notes de travail, gabarits, verrous.
EXCLUS = re.compile(r'^(index\.html|_|\.)')


def pages_du_dossier(dossier):
    """Les pages HTML du dossier, avec leur titre et leur description réels."""
    chemin = os.path.join(RACINE, dossier)
    out = []
    for nom in sorted(os.listdir(chemin)):
        if not nom.endswith('.html') or EXCLUS.match(nom):
            continue
        s = io.open(os.path.join(chemin, nom), encoding='utf-8', errors='replace').read(8000)
        t = re.search(r'<title>([^<]{1,140})', s)
        titre = (t.group(1).strip() if t else nom[:-5])
        titre = re.sub(r'\s*[—|·-]\s*(Centre\s+)?V[ÉE]RITAS.*$', '', titre).strip()
        # La description vient de la balise `description`, et de nulle part
        # ailleurs. Un repli sur le premier <p> avait paru raisonnable : sur les
        # épreuves, ce premier paragraphe est le TEXTE DE L'ŒUVRE. Les cartes
        # annonçaient donc « LAHUNLE (essoufflée) : Sidi, arrête toi… » comme
        # descriptif de la page — un extrait d'auteur présenté pour autre chose
        # que ce qu'il est. Sans balise, la carte n'a pas de description : le
        # titre suffit, et il est exact.
        d = re.search(r'<meta\s+name="description"\s+content="([^"]{1,300})"', s)
        desc = (d.group(1).strip() if d else '')
        out.append({'url': nom, 'titre': titre or nom, 'desc': desc})
    return out


def annexes(dossier):
    """Les corrigés servis en .txt — présents, publics, et jusqu'ici sans lien."""
    chemin = os.path.join(RACINE, dossier)
    out = []
    for nom in sorted(os.listdir(chemin)):
        if not nom.endswith('.txt') or EXCLUS.match(nom):
            continue
        etiquette = re.sub(r'^corrige_', '', nom[:-4]).replace('_', ' ')
        etiquette = re.sub(r'^(1ere|2nde|tle|3e|4e|5e|6e)\b',
                           lambda m: {'1ere': '1ʳᵉ', 'tle': 'Tˡᵉ', '2nde': '2ⁿᵈᵉ'}.get(m.group(1), m.group(1) + 'ᵉ'),
                           etiquette)
        out.append({'url': nom, 'titre': 'Corrigé — ' + etiquette[0].upper() + etiquette[1:]})
    return out


def carte(e, icone, famille, dossier):
    return ('<a class="pl-c" data-f="' + famille + '" href="/' + dossier + '/' + BP.esc(e['url']) + '">'
            '<span class="pl-ico">' + BP.ico(icone) + '</span>'
            '<span class="pl-t">' + BP.esc(e['titre']) + '</span>'
            + ('<span class="pl-d">' + BP.esc(e['desc']) + '</span>' if e.get('desc') else '')
            + '<span class="pl-go">Ouvrir' + BP.ico('lc-arrow-right', 15, 2.2) + '</span></a>')


GABARIT = """<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>__TITRE__ — Centre VÉRITAS</title>
<meta name="description" content="__DESC__">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="__SITE__/__DOSSIER__/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Centre VÉRITAS">
<meta property="og:title" content="__TITRE__ — Centre VÉRITAS">
<meta property="og:description" content="__DESC__">
<meta property="og:url" content="__SITE__/__DOSSIER__/">
<meta property="og:image" content="__SITE__/uploads/logo-veritas.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"></noscript>
<link rel="stylesheet" href="/assets/veritas-pages.css?v=__VER__">
<script type="application/ld+json">__JSONLD__</script>
<style>
__CSS__
</style>
</head>
<body>
__SPRITE__
<header class="top">
  <span class="badge">__BADGE__</span>
  <h1>__TITRE__</h1>
  <p>__SOUS__</p>
</header>
<div class="wrap">
  <p class="crumb"><a href="/">Accueil</a> &rsaquo; <a href="/plan.html">Plan du site</a> &rsaquo; __TITRE__</p>
  <div class="pl-g">__CARTES__</div>
  __ANNEXES__
  <footer class="bot">
    __COMPTE__ &nbsp;·&nbsp; <a href="/plan.html">Tout VÉRITAS, rangé par profil</a>
    &nbsp;·&nbsp; <a href="/">Accueil</a>
  </footer>
</div>
</body>
</html>
"""


def construire(dossier, titre, sous, desc, icone, famille, vitrine):
    pages = pages_du_dossier(dossier)
    if not pages:
        raise SystemExit('build_hubs : aucune page dans /%s/ — un index vide ne vaut pas mieux '
                         'qu\'un 403.' % dossier)
    cartes = ''.join(carte(e, icone, famille, dossier) for e in pages)

    annexe_html = ''
    ann = annexes(dossier)
    if ann:
        liens = ''.join('<a href="/' + dossier + '/' + BP.esc(a['url']) + '">'
                        + BP.ico('lc-arrow-right', 14, 2.2) + '<span>' + BP.esc(a['titre'])
                        + '</span></a>' for a in ann)
        annexe_html = ('<h2 class="sec">' + BP.ico('lc-checkcircle', 24, 2, 'i')
                       + 'Corrigés à lire en ligne</h2>'
                       '<p class="pl-sub">' + str(len(ann)) + ' corrigés d\'œuvres au programme, '
                       'en texte simple</p><div class="pl-c" data-f="' + famille + '">'
                       '<span class="pl-l">' + liens + '</span></div>')

    jsonld = ('{"@context":"https://schema.org","@type":"CollectionPage",'
              '"name":"' + BP.esc(titre) + '","description":"' + BP.esc(desc) + '",'
              '"url":"' + BP.SITE + '/' + dossier + '/","inLanguage":"fr",'
              '"isPartOf":{"@type":"WebSite","name":"Centre VÉRITAS","url":"' + BP.SITE + '"},'
              '"hasPart":[' + ','.join(
                  '{"@type":"WebPage","name":"' + BP.esc(e['titre']) + '","url":"'
                  + BP.SITE + '/' + dossier + '/' + e['url'] + '"}' for e in pages) + ']}')

    compte = str(len(pages)) + (' page' if len(pages) == 1 else ' pages') \
        + (' et ' + str(len(ann)) + ' corrigés' if ann else '') + ' — recomptés à chaque publication'

    return (GABARIT
            .replace('__CSS__', BP.CSS_CARTES)
            .replace('__FAMILLES__', BP.regles_familles())
            .replace('__SPRITE__', BP.sprite(vitrine))
            .replace('__CARTES__', cartes)
            .replace('__ANNEXES__', annexe_html)
            .replace('__JSONLD__', jsonld)
            .replace('__BADGE__', BP.esc(dossier.capitalize()))
            .replace('__TITRE__', BP.esc(titre))
            .replace('__SOUS__', BP.esc(sous))
            .replace('__DESC__', BP.esc(desc))
            .replace('__COMPTE__', compte)
            .replace('__DOSSIER__', dossier)
            .replace('__VER__', BP.VER)
            .replace('__SITE__', BP.SITE)), len(pages), len(ann)


def main():
    vitrine = io.open(BP.VITRINE, encoding='utf-8', errors='replace').read()
    total = 0
    for dossier, titre, sous, desc, icone, famille in HUBS:
        if not os.path.isdir(os.path.join(RACINE, dossier)):
            raise SystemExit('build_hubs : dossier /%s/ absent.' % dossier)
        BP._UTILISEES.clear()   # un sprite par page, limité à ses propres icônes
        html, n, na = construire(dossier, titre, sous, desc, icone, famille, vitrine)

        # ── Les mêmes gardes que pour le plan ──────────────────────────────
        styles = ''.join(re.findall(r'<style>([\s\S]*?)</style>', html))
        etrangeres = sorted(c for c in set(re.findall(r'#[0-9A-Fa-f]{6}\b', styles))
                            if c.upper() not in vitrine.upper())
        if etrangeres:
            raise SystemExit('build_hubs : couleur(s) absente(s) de vitrine.html — %s'
                             % ', '.join(etrangeres))
        manquants = [u for u in set(re.findall(r'<use href="#(lc-[a-z0-9-]+)"', html))
                     if ('<symbol id="%s"' % u) not in html]
        if manquants:
            raise SystemExit('build_hubs : symbole(s) non recopié(s) — %s' % ', '.join(manquants))

        dest = os.path.join(RACINE, dossier, 'index.html')
        io.open(dest, 'w', encoding='utf-8', newline='\n').write(html)
        total += n
        print('  /%s/index.html — %d page(s)%s, %d o'
              % (dossier, n, (' + %d corrigés' % na) if na else '', len(html.encode('utf-8'))))
    print('%d hub(s) écrit(s), %d page(s) rendues atteignables.' % (len(HUBS), total))
    return 0


if __name__ == '__main__':
    sys.exit(main())
