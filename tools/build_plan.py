#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/build_plan.py — GÉNÈRE plan.html, « Tout VÉRITAS, par profil »
© 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

    python tools/build_plan.py

POURQUOI CETTE PAGE EXISTE
    Mesuré sur la page d'accueil RÉELLEMENT SERVIE le 30/08/2026 : le mot
    « corrigé » y figure 139 fois, et il n'existe AUCUN lien vers /corriges/ —
    ni href, ni window.open, ni action de navigation. Quatre-vingt-treize pages
    de corrigés, dont on parle sans jamais y mener.

    Le compte complet, mesuré de la même façon :

        /corriges/     93 pages   0 lien depuis l'accueil
        /oeuvres/      22 pages   5 liens
        /livrets/      16 pages   0
        /evaluations/  10 pages   0
        /niveaux/       8 pages   0
        /decouvrir/     6 pages   0
        /outils/        4 pages   0
        /cours/         3 pages   0
        /parcours/      1 page    0
        /flash/         1 page    0
        /adopter/       1 page    0
        constellation.html, manuels.html      0

    Un enseignant qui cherche les mouvements littéraires, un parent qui veut
    évaluer le niveau de son enfant, un élève qui cherche l'analyse d'une œuvre
    au programme : rien ne les y conduit. Le travail existe, il est publié, il
    est invisible.

CE QUE LA PAGE FAIT
    Elle range TOUT le site par PROFIL — élève, parent, enseignant, partenaire
    — et un même service apparaît sous chaque profil qu'il concerne. Les
    corrigés servent l'élève qui révise ET l'enseignant qui prépare : les deux
    doivent le trouver chez eux, sans deviner que c'est ailleurs.

POURQUOI ELLE EST GÉNÉRÉE, ET NON ÉCRITE
    Les compteurs (« 93 corrigés ») se recomptent depuis les fichiers à chaque
    exécution. C'est la règle du projet : un chiffre annoncé doit se recompter
    depuis le contenu publié, jamais être saisi à la main — la vitrine a déjà
    annoncé 3 854 exercices là où il y en avait 3 716.

SA MISE EN FORME — REFAITE LE 16/09/2026, SUR LA CARTE DE LA VITRINE
    Jacques : « mise en page fade : aucune icône, pas de couleurs, tableaux
    disparates, aucune cohérence visuelle », puis « mets les vraies icônes dans
    les ronds et centre-les exactement comme dans la vitrine », puis « enlève
    les traits colorés de bordures ».

    Ce qui était en cause :
      • Une charte à elle : une soixantaine de lignes de CSS avec leurs propres
        variables, dont une couleur d'action ORANGE (`C2410C`) que le reste du
        site a quittée le 13/09. `tests/banc_charte_action.cjs` ne regardait pas
        cette page — l'orange avait survécu au balayage.
      • Zéro icône, ni `<svg>` ni `<use>`.
      • Les rubriques sans index dépliaient TOUTES leurs pages dans la carte :
        dix lignes à côté d'une carte de trois, et des rangées en escalier.

    Pourquoi la page COPIE la vitrine :
      • Une première reprise empruntait le sprite `/assets/veritas-icons.svg`,
        celui des pages de corrigés. Il se dessinait correctement, mais ce
        n'étaient pas les icônes de la vitrine, ni son médaillon : Jacques a
        demandé « les vraies icônes, centrées exactement comme dans la
        vitrine ». On reprend donc SES icônes, `lc-*`, extraites de
        vitrine.html à chaque build : si la vitrine change une icône, le plan
        suit ; si une icône disparaît, le build s'arrête.
      • ⚠️ Correction du 17/09. Une version antérieure de ce commentaire, et le
        message du commit 05c14b3, affirmaient que ce sprite se dessinait
        « fill:black, stroke:none — des pâtés ». C'ÉTAIT FAUX. La mesure lisait
        le style calculé du <svg> EXTÉRIEUR, qui vaut toujours fill:black par
        défaut et ne dit rien de ce que dessine le symbole cloné par <use>.
        Vérifié ensuite à l'œil, icône agrandie à 180 px : trait vert, net,
        identique à celui de la vitrine. Pour juger une icône, la regarder.
      • La carte est celle de la vitrine, cote pour cote : fond blanc, bordure
        neutre `E4E9F2`, rayon 14 px, ombre douce ; médaillon rond de 42 px
        centré (`margin:0 auto 13px`), icône de 20 px au trait de 2 ; titre,
        texte et action centrés. Aucun trait coloré : ni liseré en tête de
        carte, ni bordure teintée au survol.
      • Les couleurs sont les six paires de médaillon de la vitrine. Une garde
        vérifie à chaque build que TOUTE couleur écrite dans le style de cette
        page existe dans vitrine.html — une teinte inventée ici arrête tout.
"""
import io
import os
import re
import sys
from datetime import date

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://veritas-school.com"
VITRINE = os.path.join(RACINE, "vitrine.html")

# ── Les six familles de médaillon de la vitrine : (fond teinté, icône) ─────
#    Relevées dans vitrine.html le 16/09/2026. Elles ne sont pas « inspirées »
#    de la vitrine, elles SONT les siennes : main() vérifie leur présence.
FAMILLES = {
    'bleu':     ('#DBE8FE', '#1E499B'),
    'sarcelle': ('#E3F1EE', '#0E7C86'),
    'vert':     ('#E7F7EC', '#007E11'),
    'violet':   ('#EEE9F8', '#5B4FA8'),
    'rose':     ('#FBE9F1', '#B03A6E'),
    'brique':   ('#FFF3E4', '#A84200'),
}

# ── Ce que chaque zone du site contient, et QUI elle concerne ───────────────
#    Un service peut viser plusieurs profils : c'est le principe même de cette
#    page. « eleve » et « enseignant » sur les corrigés n'est pas une
#    redondance, c'est la raison d'être du classement.
#
#    La famille suit la RUBRIQUE, pas la section : « Corrigés des cahiers » a
#    la même pastille chez l'élève et chez l'enseignant, on la reconnaît d'un
#    coup d'œil — c'est tout l'objet d'une page où un service revient.
ZONES = [
    # dossier        libellé                      description                                                                                   profils                                  icône              famille
    ('corriges',    'Corrigés des cahiers',      'Chaque exercice des cahiers VÉRITAS, corrigé et expliqué. Accès libre, sans compte.',        ['eleve', 'enseignant', 'parent'],        'lc-checkcircle',  'vert'),
    ('oeuvres',     'Œuvres au programme',       'Analyse, résumé, personnages, mouvement littéraire et citations des œuvres étudiées.',       ['eleve', 'enseignant'],                  'lc-bookopen',     'violet'),
    ('niveaux',     'Le programme par niveau',   'Ce qu\'il faut savoir en fin d\'année, classe par classe, de la 6ᵉ à la Terminale.',         ['eleve', 'parent', 'enseignant'],        'lc-trending',     'bleu'),
    ('evaluations', 'Évaluations',               'De quoi situer son niveau et repérer ce qui manque avant l\'examen.',                        ['eleve', 'parent'],                      'lc-target',       'rose'),
    ('livrets',     'Livrets interactifs',       'Le cahier qu\'on remplit à l\'écran, avec correction immédiate.',                            ['eleve', 'parent'],                      'lc-monitor',      'sarcelle'),
    ('cours',       'Cours rédigés',             'La leçon écrite, pour reprendre ce qui n\'a pas été compris en classe.',                     ['eleve', 'enseignant'],                  'lc-doc',          'bleu'),
    ('outils',      'Outils',                    'Calculs, conversions et aides de travail.',                                                  ['eleve', 'enseignant'],                  'lc-calculator',   'sarcelle'),
    ('parcours',    'Parcours',                  'Un chemin de révision ordonné, plutôt qu\'une pile de documents.',                           ['eleve', 'parent'],                      'lc-map',          'violet'),
    ('decouvrir',   'Découvrir VÉRITAS',         'Ce que fait le centre, comment il travaille, ce qu\'il propose.',                            ['visiteur', 'parent', 'partenaire'],     'lc-sparkles',     'brique'),
    ('flash',       'Flash — accès par QR',      'Le code imprimé dans un cahier ouvre directement sa correction.',                             ['eleve', 'enseignant'],                  'lc-qr',           'rose'),
    ('adopter',     'Adopter les cahiers',       'Pour un établissement qui veut équiper ses classes.',                                        ['enseignant', 'partenaire'],             'lc-university',   'bleu'),
]

# ── Les destinations qui ne sont pas des dossiers de pages ─────────────────
FIXES = [
    ('/plateforme/',        'Atelier de Français',        'Composer épreuves et leçons conformes au programme, à partir d\'un corpus vérifié.', ['enseignant'],                                  'lc-clipboard',  'violet'),
    ('/constellation.html', 'La Constellation VÉRITAS',   'Tout ce que le centre publie, réuni sur une seule carte.',                            ['visiteur', 'enseignant', 'parent'],            'lc-globe',      'sarcelle'),
    ('/manuels.html',       'Les manuels',                'Les ouvrages du centre, leur sommaire et leur usage en classe.',                      ['enseignant', 'parent', 'partenaire'],          'lc-book',       'brique'),
    ('/#tarifs',            'Abonnements et tarifs',      'Ce qui est gratuit, ce qui est payant, et ce que chaque formule ouvre.',              ['visiteur', 'parent', 'eleve', 'enseignant'],   'lc-coins',      'vert'),
    ('/app.html#boutique',  'Boutique',                   'Commander les cahiers et les manuels imprimés.',                                      ['parent', 'enseignant', 'partenaire'],          'lc-shop',       'brique'),
    ('/app.html#cagnotte',  'Cagnotte de scolarité',      'Réunir la scolarité à plusieurs, et suivre ce qui a été réglé.',                     ['parent', 'eleve'],                             'lc-wallet',     'vert'),
    ('/app.html#partenariat', 'Devenir partenaire',       'Libraires, inspecteurs, établissements : les façons de travailler avec le centre.',   ['partenaire'],                                  'lc-handshake',  'rose'),
]

PROFILS = [
    ('eleve',      'Élèves',        'Réviser, s\'entraîner, comprendre',     'lc-graduation'),
    ('parent',     'Parents',       'Suivre son enfant et l\'accompagner',   'lc-users'),
    ('enseignant', 'Enseignants',   'Préparer, composer, publier',           'lc-presentation'),
    ('partenaire', 'Partenaires',   'Diffuser, équiper, collaborer',         'lc-handshake'),
    ('visiteur',   'Tout le monde', 'Ce que fait VÉRITAS',                   'lc-globe'),
]


def _version_assets():
    """Reprend la version demandée par la coquille (app.js?v=…).

    Même règle que build_corriges.py : la feuille partagée est servie
    « immutable » un an sous `?v=`. Sans version, un visiteur de retour garde
    l'ancienne. Pas de repli silencieux.
    """
    coquille = os.path.join(RACINE, "VERITAS_v1.2.html")
    try:
        with io.open(coquille, "r", encoding="utf-8", errors="ignore") as f:
            tete = f.read(200000)
        m = re.search(r"app\.js\?v=([0-9.]+)", tete)
        if m:
            return m.group(1)
    except OSError:
        pass
    raise SystemExit("build_plan : version introuvable dans VERITAS_v1.2.html "
                     "(motif app.js?v=…). Corriger avant de régénérer.")


VER = _version_assets()

# Les icônes réellement employées, dans l'ordre d'apparition : seules celles-là
# sont recopiées depuis la vitrine.
_UTILISEES = []

# Icônes du bloc d'habillage recopié de vitrine.html (nav, bandeau, bulles
# flottantes, pied) — ce balisage est brut, donc hors de ico(), qui ne voit
# que les cartes de CETTE page.
_CHROME_ICONES = [
    'pay-mc',
    'pay-mtn',
    'pay-orange',
    'pay-paypal',
    'pay-stripe',
    'pay-visa',
    'lc-arrow-right',
    'lc-award',
    'lc-basket',
    'lc-book',
    'lc-bookopen',
    'lc-brain',
    'lc-building',
    'lc-calculator',
    'lc-checkcircle',
    'lc-chevron-right',
    'lc-clock',
    'lc-coins',
    'lc-compass',
    'lc-doc',
    'lc-gift',
    'lc-graduation',
    'lc-handshake',
    'lc-home',
    'lc-languages',
    'lc-megaphone',
    'lc-moon',
    'lc-presentation',
    'lc-qr',
    'lc-scale',
    'lc-search',
    'lc-shield',
    'lc-shop',
    'lc-smartphone',
    'lc-sparkles',
    'lc-target',
    'lc-trophy',
    'lc-university',
    'lc-user',
    'lc-users',
    'lc-wallet',
]
for _n in _CHROME_ICONES:
    if _n not in _UTILISEES:
        _UTILISEES.append(_n)


def ico(nom, taille=20, trait=2, cls=None):
    """Une icône de la vitrine, balisée EXACTEMENT comme la vitrine la balise.

    Les attributs de dessin sont sur le <svg> porteur, comme dans la vitrine :
    les symboles `lc-*` n'en portent aucun. Référence locale `#lc-…` : le
    symbole est recopié dans la page par sprite().
    """
    if nom not in _UTILISEES:
        _UTILISEES.append(nom)
    return ('<svg%s width="%d" height="%d" viewBox="0 0 24 24" fill="none" '
            'stroke="currentColor" stroke-width="%s" stroke-linecap="round" '
            'stroke-linejoin="round" aria-hidden="true"><use href="#%s"/></svg>'
            % ((' class="%s"' % cls) if cls else '', taille, taille, trait, nom))


def sprite(vitrine):
    """Recopie depuis vitrine.html les <symbol> que cette page emploie."""
    symboles = []
    for nom in _UTILISEES:
        m = re.search(r'<symbol id="' + re.escape(nom) + r'"[\s\S]*?</symbol>', vitrine)
        if not m:
            raise SystemExit('build_plan : icône « %s » absente de vitrine.html — '
                             'un <use> vers un symbole manquant ne lève rien, il '
                             'dessine un rond vide.' % nom)
        symboles.append(m.group(0))
    return ('<svg width="0" height="0" style="position:absolute;overflow:hidden" '
            'aria-hidden="true">' + ''.join(symboles) + '</svg>')


def compter(dossier):
    """Nombre de pages qui seront RÉELLEMENT EN LIGNE dans une zone.

    On compte ce que git suit, PAS ce qui traîne sur le poste. Les deux
    diffèrent : le 30/08/2026, quatre corrigés en cours de rédaction (deux
    modules de 4ᵉ, deux séquences de Terminale) étaient présents sur la machine
    et volontairement non versionnés — donc jamais déployés. Compter le disque
    faisait annoncer « 93 corrigés » pour 89 réellement servis, et la CI l'a
    refusé, à juste titre.

    C'est la règle du projet dans sa formulation exacte : un chiffre annoncé se
    recompte depuis le contenu PUBLIÉ. Un brouillon sur un poste n'est pas du
    contenu publié.

    Repli sur le disque si git est indisponible (archive téléchargée, runner
    sans historique) : mieux vaut un compte approché qu'une page vide.
    """
    chemin = os.path.join(RACINE, dossier)
    if not os.path.isdir(chemin):
        return 0
    try:
        import subprocess
        sortie = subprocess.run(
            ['git', 'ls-files', dossier + '/'],
            cwd=RACINE, capture_output=True, text=True, timeout=30)
        if sortie.returncode == 0:
            suivis = [l for l in sortie.stdout.split('\n') if l.endswith('.html')]
            if suivis:
                return len(suivis)
    except Exception:
        pass
    n = 0
    for r, _, fs in os.walk(chemin):
        n += sum(1 for f in fs if f.endswith('.html'))
    return n


def esc(s):
    return (s.replace('&', '&amp;').replace('<', '&lt;')
             .replace('>', '&gt;').replace('"', '&quot;'))


def pages_suivies(dossier):
    """Les pages HTML versionnées d'une zone, avec leur titre réel."""
    try:
        import subprocess
        r = subprocess.run(['git', 'ls-files', dossier + '/'],
                           cwd=RACINE, capture_output=True, text=True, timeout=30)
        fichiers = [l for l in r.stdout.split('\n') if l.endswith('.html')]
    except Exception:
        fichiers = []
    out = []
    for f in fichiers:
        if os.path.basename(f) == 'index.html':
            continue
        try:
            s = io.open(os.path.join(RACINE, f), encoding='utf-8', errors='replace').read(4000)
        except Exception:
            continue
        m = re.search(r'<title>([^<]{1,90})', s)
        titre = (m.group(1).strip() if m else os.path.basename(f)[:-5])
        titre = re.sub(r'\s*[—|·-]\s*(Centre\s+)?V[ÉE]RITAS.*$', '', titre).strip()
        out.append({'url': '/' + f.replace(os.sep, '/'), 'titre': titre or os.path.basename(f)})
    return sorted(out, key=lambda x: x['titre'])


def construire():
    entrees = []
    for dossier, titre, desc, profils, icone, famille in ZONES:
        n = compter(dossier)
        if n == 0:
            # Une zone vide n'est pas annoncée : mieux vaut une rubrique
            # absente qu'un lien vers une page qui n'existe pas.
            continue
        e = {'url': '/' + dossier + '/', 'titre': titre, 'desc': desc,
             'profils': profils, 'n': n, 'icone': icone, 'famille': famille}
        # ── SANS INDEX, UNE ZONE EST UN CUL-DE-SAC ─────────────────────────
        # /corriges/ mène à ses sept niveaux, qui mènent chacun à leurs pages :
        # les 89 corrigés sont donc atteignables en trois clics. Mais
        # /evaluations/ et /cours/ n'ont AUCUN index — ouvrir le dossier ne
        # donne rien, et leurs pages restent hors d'atteinte quoi qu'on
        # clique. Pour ces zones-là, le plan liste les pages UNE À UNE.
        if not os.path.isfile(os.path.join(RACINE, dossier, 'index.html')):
            e['pages'] = pages_suivies(dossier)
        entrees.append(e)
    for url, titre, desc, profils, icone, famille in FIXES:
        entrees.append({'url': url, 'titre': titre, 'desc': desc, 'profils': profils,
                        'n': 0, 'icone': icone, 'famille': famille})
    return entrees


def carte(e):
    compteur = ('<span class="pl-n">' + str(e['n']) + ' page'
                + ('s' if e['n'] > 1 else '') + '</span>') if e['n'] else ''
    tete = ('<span class="pl-ico">' + ico(e['icone']) + '</span>'
            '<span class="pl-t">' + esc(e['titre']) + '</span>' + compteur
            + '<span class="pl-d">' + esc(e['desc']) + '</span>')

    # ── LES RUBRIQUES SANS INDEX SE REPLIENT ───────────────────────────────
    # Leurs pages doivent rester atteignables — c'est la raison d'être de la
    # liste — mais dépliée, une rubrique de dix pages écrasait ses voisines et
    # mettait la rangée en escalier. `<details>` garde les liens DANS le HTML
    # (indexables, et comptés par banc_plan_site) tout en rendant les cartes
    # égales au repos. Aucun script : c'est natif.
    if e.get('pages'):
        liens = ''.join('<a href="' + esc(p['url']) + '">' + ico('lc-arrow-right', 14, 2.2)
                        + '<span>' + esc(p['titre']) + '</span></a>' for p in e['pages'])
        n = len(e['pages'])
        return ('<div class="pl-c" data-f="' + e['famille'] + '">' + tete
                + '<details class="pl-x"><summary>'
                + ('Voir la page' if n == 1 else 'Voir les ' + str(n) + ' pages')
                + ico('lc-chevron-right', 14, 2.2, 'pl-chev')
                + '</summary><span class="pl-l">' + liens + '</span></details>'
                '</div>')

    return ('<a class="pl-c" data-f="' + e['famille'] + '" href="' + esc(e['url']) + '">'
            + tete + '<span class="pl-go">Ouvrir' + ico('lc-arrow-right', 15, 2.2) + '</span></a>')


# ── La carte de la vitrine, en une seule copie ─────────────────────────────
#    `tools/build_hubs.py` (pages d'index de /evaluations/, /cours/, /legal/)
#    l'importe : deux copies dériveraient, et c'est précisément la dérive qui
#    avait donné à cette page une charte à elle.
# ── Bloc d'habillage recopié tel quel de vitrine.html (nav, bandeau,
#    bulles flottantes, pied) — logo, thème, animations identiques à la
#    vitrine. Comportement (JS) : assets/vitrine.js.
NAV_VITRINE = r"""  <nav id="vrtNav" style="position:sticky;top:0;z-index:60;background:rgba(255,255,255,.96);backdrop-filter:blur(8px);height:76px;display:flex;align-items:center;transition:box-shadow .18s ease">
    <div style="max-width:1170px;margin:0 auto;padding:0 24px;display:flex;align-items:center;width:100%;height:100%;gap:8px">
      <button type="button" onclick="VRT.act('goAccueil',this,event)" data-go="accueil" style="display:flex;align-items:center;gap:11px;background:none;border:0;cursor:pointer;padding:0;margin-right:18px;flex-shrink:0;text-align:left" aria-label="Accueil VÉRITAS">
        <img fetchpriority="high" decoding="async" width="344" height="347" src="assets/veritas-logo.png" alt="Logo VÉRITAS" style="width:46px;height:46px;object-fit:contain;display:block">
        <span style="display:flex;flex-direction:column;line-height:1.15;font:600 19px Poppins,sans-serif;color:#001136">VÉRITAS<small style="font:400 11px Poppins,sans-serif;color:#6E7385;margin-top:2px">Centre d'Excellence Scolaire</small></span>
      </button>
      <div class="vrt-large" style="display:flex;align-items:center;gap:2px;height:100%;flex:0 1 auto;min-width:0">
          <button type="button" onclick="VRT.act('goEleves',this,event)" data-go="elearning" style="display:inline-flex;align-items:center;height:100%;padding:0 14px;border:0;border-bottom:3px solid transparent;background:none;cursor:pointer;font:500 15px Poppins,sans-serif;color:#001136;white-space:nowrap;transition:color .18s,border-color .18s" class="vh2">Élèves</button>
          <button type="button" onclick="VRT.act('goParents',this,event)" data-go="parents" style="display:inline-flex;align-items:center;height:100%;padding:0 14px;border:0;border-bottom:3px solid transparent;background:none;cursor:pointer;font:500 15px Poppins,sans-serif;color:#001136;white-space:nowrap;transition:color .18s,border-color .18s" class="vh3">Parents</button>
          <button type="button" onclick="VRT.act('goEnseignants',this,event)" data-go="enseignants" style="display:inline-flex;align-items:center;height:100%;padding:0 14px;border:0;border-bottom:3px solid transparent;background:none;cursor:pointer;font:500 15px Poppins,sans-serif;color:#001136;white-space:nowrap;transition:color .18s,border-color .18s" class="vh4">Enseignants</button><a href="app.html#partenariat" style="display:inline-flex;align-items:center;height:100%;padding:0 14px;border:0;border-bottom:3px solid transparent;background:none;cursor:pointer;font:500 15px Poppins,sans-serif;color:#001136;white-space:nowrap;text-decoration:none;transition:color .18s,border-color .18s" class="vh4">Partenaires</a>
          <div style="position:relative;height:100%;display:flex;align-items:center">
            <button type="button" onclick="VRT.act('basculerPlus',this,event)" aria-expanded="false" style="display:inline-flex;align-items:center;gap:6px;height:100%;padding:0 14px;border:0;border-bottom:3px solid transparent;background:none;cursor:pointer;font:500 15px Poppins,sans-serif;color:#001136;white-space:nowrap;transition:color .18s,border-color .18s" class="vh5">Plus<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(90deg)" aria-hidden="true"><use href="#lc-chevron-right"></use></svg></button>
            <div id="vrtPlus" class="vmn" hidden role="menu" aria-label="Toutes les rubriques"><div class="vmn-col"><p class="vmn-t">Élève<small>Apprendre et réviser</small></p><button type="button" class="vmn-i" onclick="VRT.act('pl__aller',this,event)" data-go="elearning"><span class="vmn-p" style="background:#DBE8FE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E499B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-book"/></svg></span><span class="vmn-x">Catalogue e-learning<small>Matières, œuvres, séquences</small></span><span class="vmn-l" title="Réservé aux membres inscrits"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><span class="vsr">Réservé aux membres inscrits</span></span></button><a class="vmn-i" href="corriges/"><span class="vmn-p" style="background:#E0F5E5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007E11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-checkcircle"/></svg></span><span class="vmn-x">Corrigés des cahiers<small>Accès libre, par séquence</small></span></a><a class="vmn-i" href="app.html#epreuves"><span class="vmn-p" style="background:#EAE7F7"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B4FA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-doc"/></svg></span><span class="vmn-x">Annales corrigées<small>BEPC, Probatoire, BAC, GCE</small></span><span class="vmn-l" title="Réservé aux membres inscrits"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><span class="vsr">Réservé aux membres inscrits</span></span></a><a class="vmn-i" href="app.html#evaluations"><span class="vmn-p" style="background:#FFF3E4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A84200" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-clock"/></svg></span><span class="vmn-x">Évaluations en ligne<small>Entraînement chronométré</small></span><span class="vmn-l" title="Réservé aux membres inscrits"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><span class="vsr">Réservé aux membres inscrits</span></span></a><a class="vmn-i" href="oeuvres/"><span class="vmn-p" style="background:#DBE8FE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E499B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-bookopen"/></svg></span><span class="vmn-x">Œuvres au programme<small>Analyses et fiches</small></span></a><a class="vmn-i" href="niveaux/"><span class="vmn-p" style="background:#DDF2F4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E7C86" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-graduation"/></svg></span><span class="vmn-x">Programmes par classe<small>De la 6ᵉ à la Terminale</small></span></a><a class="vmn-i" href="outils/"><span class="vmn-p" style="background:#E0F5E5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007E11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-calculator"/></svg></span><span class="vmn-x">Outils gratuits<small>Calculateurs de moyenne</small></span></a><a class="vmn-i" href="eleve/"><span class="vmn-p" style="background:#DBE8FE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E499B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-user"/></svg></span><span class="vmn-x">Espace élève<small>Corrigés, quiz et méthodes</small></span></a><a class="vmn-i" href="livrets/"><span class="vmn-p" style="background:#FFF3E4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A84200" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-bookopen"/></svg></span><span class="vmn-x">Mon cahier en ligne<small>Interactif, 6ᵉ → Terminale</small></span></a><a class="vmn-i" href="flash/"><span class="vmn-p" style="background:#EAE7F7"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B4FA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-qr"/></svg></span><span class="vmn-x">VÉRITAS Flash<small>Scanner le QR de sa séquence</small></span></a></div><div class="vmn-col"><p class="vmn-t">Parent<small>Suivre et soutenir</small></p><a class="vmn-i" href="app.html#orientation"><span class="vmn-p" style="background:#DDF2F4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E7C86" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-compass"/></svg></span><span class="vmn-x">Orientation<small>Choisir sa série</small></span></a><a class="vmn-i" href="parcours/"><span class="vmn-p" style="background:#EAE7F7"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B4FA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-scale"/></svg></span><span class="vmn-x">Matières et coefficients<small>Poids réels, orientation</small></span></a><a class="vmn-i" href="app.html#cagnotte"><span class="vmn-p" style="background:#FFF3E4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A84200" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-gift"/></svg></span><span class="vmn-x">Cagnotte de scolarité<small>Faire financer son année</small></span></a><a class="vmn-i" href="app.html#trophees"><span class="vmn-p" style="background:#FFF6DA"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8860B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-trophy"/></svg></span><span class="vmn-x">Trophées VÉRITAS<small>Vote gratuit et unique</small></span></a><a class="vmn-i" href="app.html#leaderboard-junior"><span class="vmn-p" style="background:#EAE7F7"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B4FA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-award"/></svg></span><span class="vmn-x">Classement junior<small>Le tableau d’honneur</small></span></a></div><div class="vmn-col"><p class="vmn-t">Enseignant<small>Enseigner et publier</small></p><a class="vmn-i" href="ressources/"><span class="vmn-p" style="background:#FBE4EE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B03A6E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-presentation"/></svg></span><span class="vmn-x">Ressources et cours<small>Leçons interactives</small></span></a><a class="vmn-i" href="manuels.html"><span class="vmn-p" style="background:#DBE8FE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E499B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-qr"/></svg></span><span class="vmn-x">Corrigés du cahier papier<small>La page des QR codes</small></span></a><button type="button" class="vmn-i" onclick="VRT.act('pl__aller',this,event)" data-go="boutique"><span class="vmn-p" style="background:#FFF3E4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A84200" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-shop"/></svg></span><span class="vmn-x">Boutique de manuels<small>Cahiers et études d’œuvres</small></span></button><button type="button" class="vmn-i" onclick="VRT.act('pl__aller',this,event)" data-go="tarifs"><span class="vmn-p" style="background:#EAE7F7"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B4FA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-wallet"/></svg></span><span class="vmn-x">Abonnements<small>Élève, enseignant, établissement</small></span></button><a class="vmn-i" href="app.html#verifier-certificat"><span class="vmn-p" style="background:#DBE8FE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E499B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-shield"/></svg></span><span class="vmn-x">Vérifier un certificat<small>Authentifier une distinction</small></span></a><a class="vmn-i" href="plateforme/"><span class="vmn-p" style="background:#FBE4EE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B03A6E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-presentation"/></svg></span><span class="vmn-x">Atelier de Français<small>Composer une épreuve MINESEC</small></span></a><a class="vmn-i" href="enseignant/"><span class="vmn-p" style="background:#DDF2F4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E7C86" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-doc"/></svg></span><span class="vmn-x">Espace enseignant<small>Guide, grilles, progressions</small></span></a><a class="vmn-i" href="adopter/"><span class="vmn-p" style="background:#E0F5E5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007E11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-checkcircle"/></svg></span><span class="vmn-x">Adopter les cahiers<small>Pour une classe, un établissement</small></span></a></div><div class="vmn-col"><p class="vmn-t">Partenaire<small>Diffuser et représenter</small></p><a class="vmn-i" href="app.html#partenariat"><span class="vmn-p" style="background:#FBE4EE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B03A6E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-users"/></svg></span><span class="vmn-x">Devenir partenaire<small>9 formules, marges revendeur</small></span></a><a class="vmn-i" href="app.html#nos-partenaires"><span class="vmn-p" style="background:#DDF2F4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E7C86" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-handshake"/></svg></span><span class="vmn-x">Nos partenaires<small>Ceux qui nous accompagnent</small></span></a><a class="vmn-i" href="campus/"><span class="vmn-p" style="background:#E4E9F2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0C2A6A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-university"/></svg></span><span class="vmn-x">VÉRITAS Campus<small>Pour les établissements</small></span></a><a class="vmn-i" href="constellation.html"><span class="vmn-p" style="background:#FBE4EE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B03A6E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-sparkles"/></svg></span><span class="vmn-x">Constellation VÉRITAS<small>Tout l’écosystème</small></span></a></div><div class="vmn-col"><p class="vmn-t">Le centre<small>Nous connaître</small></p><a class="vmn-i" href="decouvrir/"><span class="vmn-p" style="background:#DBE8FE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E499B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-building"/></svg></span><span class="vmn-x">Présentation<small>Qui nous sommes</small></span></a><a class="vmn-i" href="app.html#actualites"><span class="vmn-p" style="background:#FFF3E4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A84200" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-megaphone"/></svg></span><span class="vmn-x">Actualités<small>Ce qui se passe au centre</small></span></a><a class="vmn-i" href="app.html#inscription"><span class="vmn-p" style="background:#FFF3E4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A84200" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-user"/></svg></span><span class="vmn-x">S’inscrire<small>Créer un compte gratuit</small></span></a><a class="vmn-i" href="plan.html"><span class="vmn-p" style="background:#E4E9F2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0C2A6A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-compass"/></svg></span><span class="vmn-x">Plan du site<small>Tout VÉRITAS, par profil</small></span></a></div></div>
          </div>
        </div>

      <div class="vrt-compact" style="position:relative;height:100%;display:flex;align-items:center;margin-left:auto">
          <!-- aria-controls écrit ICI, et pas seulement posé par vitrine.js au
               premier basculement : un lecteur d'écran lit la barre AVANT que
               l'utilisateur ne touche quoi que ce soit. Le lien bouton →
               panneau doit exister dès le premier octet. -->
          <button type="button" onclick="VRT.act('basculerBurger',this,event)" aria-label="Menu" aria-expanded="false" aria-controls="vrtBurger" style="width:50px;height:50px;border-radius:14px;border:1px solid transparent;background:#fff;color:#001136;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;transition:background .18s,border-color .18s">
            <span style="width:19px;height:2px;border-radius:2px;background:currentColor;display:block"></span>
            <span style="width:19px;height:2px;border-radius:2px;background:currentColor;display:block"></span>
            <span style="width:19px;height:2px;border-radius:2px;background:currentColor;display:block"></span>
          </button>
          <div id="vrtBurger" hidden style="position:absolute;top:calc(100% + 10px);right:0;width:290px;background:#FAFBFE;border:1px solid transparent;border-radius:14px;box-shadow:0 18px 40px rgba(0,17,54,.12);padding:10px;display:flex;flex-direction:column;gap:3px;z-index:90;animation:vpop .24s cubic-bezier(.22,1,.36,1)">
              
                <button type="button" onclick="VRT.act('goEleves',this,event)" style="display:flex;align-items:center;gap:12px;padding:12px 13px;border:0;border-radius:10px;background:none;cursor:pointer;text-align:left;font:500 15px Poppins,sans-serif;color:#001136;transition:background .18s" class="vh7">
                  <span style="width:36px;height:36px;border-radius:10px;background:#DBE8FE;color:#1E499B;display:flex;align-items:center;justify-content:center;flex:0 0 auto"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-graduation"></use></svg></span>
                  <span style="display:flex;flex-direction:column;line-height:1.35;flex:1;min-width:0">Élèves<small style="font:400 12px Poppins,sans-serif;color:#6E7385">Cours, corrigés, tuteur IA</small></span>
                </button>
              
                <button type="button" onclick="VRT.act('goParents',this,event)" style="display:flex;align-items:center;gap:12px;padding:12px 13px;border:0;border-radius:10px;background:none;cursor:pointer;text-align:left;font:500 15px Poppins,sans-serif;color:#001136;transition:background .18s" class="vh7">
                  <span style="width:36px;height:36px;border-radius:10px;background:#E3F1EE;color:#0E7C86;display:flex;align-items:center;justify-content:center;flex:0 0 auto"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-users"></use></svg></span>
                  <span style="display:flex;flex-direction:column;line-height:1.35;flex:1;min-width:0">Parents<small style="font:400 12px Poppins,sans-serif;color:#6E7385">Notes, absences, scolarité</small></span>
                </button>
              
                <button type="button" onclick="VRT.act('goEnseignants',this,event)" style="display:flex;align-items:center;gap:12px;padding:12px 13px;border:0;border-radius:10px;background:none;cursor:pointer;text-align:left;font:500 15px Poppins,sans-serif;color:#001136;transition:background .18s" class="vh7">
                  <span style="width:36px;height:36px;border-radius:10px;background:#FBE9F1;color:#B03A6E;display:flex;align-items:center;justify-content:center;flex:0 0 auto"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-presentation"></use></svg></span>
                  <span style="display:flex;flex-direction:column;line-height:1.35;flex:1;min-width:0">Enseignants<small style="font:400 12px Poppins,sans-serif;color:#6E7385">Publier et encadrer</small></span>
                </button>
              
                <button type="button" onclick="VRT.act('mm__aller',this,event)" data-go="elearning" style="display:flex;align-items:center;gap:12px;padding:12px 13px;border:0;border-radius:10px;background:none;cursor:pointer;text-align:left;font:500 15px Poppins,sans-serif;color:#001136;transition:background .18s" class="vh7">
                  <span style="width:36px;height:36px;border-radius:10px;background:#DBE8FE;color:#1E499B;display:flex;align-items:center;justify-content:center;flex:0 0 auto"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-book"></use></svg></span>
                  <span style="display:flex;flex-direction:column;line-height:1.35;flex:1;min-width:0">Catalogue E-Learning<small style="font:400 12px Poppins,sans-serif;color:#6E7385">Matières et œuvres</small></span>
                </button>
              
                <button type="button" onclick="VRT.act('mm__aller',this,event)" data-go="tarifs" style="display:flex;align-items:center;gap:12px;padding:12px 13px;border:0;border-radius:10px;background:none;cursor:pointer;text-align:left;font:500 15px Poppins,sans-serif;color:#001136;transition:background .18s" class="vh7">
                  <span style="width:36px;height:36px;border-radius:10px;background:#EEE9F8;color:#5B4FA8;display:flex;align-items:center;justify-content:center;flex:0 0 auto"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-wallet"></use></svg></span>
                  <span style="display:flex;flex-direction:column;line-height:1.35;flex:1;min-width:0">Abonnements<small style="font:400 12px Poppins,sans-serif;color:#6E7385">Dès <span data-vrt-prix="abo_starter_m">1 000</span> FCFA / mois</small></span>
                </button>
              
                <button type="button" onclick="VRT.act('mm__aller',this,event)" data-go="boutique" style="display:flex;align-items:center;gap:12px;padding:12px 13px;border:0;border-radius:10px;background:none;cursor:pointer;text-align:left;font:500 15px Poppins,sans-serif;color:#001136;transition:background .18s" class="vh7">
                  <span style="width:36px;height:36px;border-radius:10px;background:#FFF3E4;color:#A84200;display:flex;align-items:center;justify-content:center;flex:0 0 auto"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-basket"></use></svg></span>
                  <span style="display:flex;flex-direction:column;line-height:1.35;flex:1;min-width:0">Boutique de manuels<small style="font:400 12px Poppins,sans-serif;color:#6E7385">Cahiers et études d’œuvres</small></span>
                </button>
              
                <button type="button" onclick="VRT.act('mm__aller',this,event)" data-go="accueil" style="display:flex;align-items:center;gap:12px;padding:12px 13px;border:0;border-radius:10px;background:none;cursor:pointer;text-align:left;font:500 15px Poppins,sans-serif;color:#001136;transition:background .18s" class="vh7">
                  <span style="width:36px;height:36px;border-radius:10px;background:#F4F5F8;color:#4D5163;display:flex;align-items:center;justify-content:center;flex:0 0 auto"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-home"></use></svg></span>
                  <span style="display:flex;flex-direction:column;line-height:1.35;flex:1;min-width:0">Accueil<small style="font:400 12px Poppins,sans-serif;color:#6E7385">Revenir à la page d’accueil</small></span>
                </button>
              
              <a href="app.html#connexion" style="margin-top:6px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px;border-radius:10px;background:#FFC93C;color:#001136;font:600 15px Poppins,sans-serif;box-shadow:0 8px 18px rgba(242,165,32,.3)" class="vh8"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><use href="#lc-user"></use></svg>Connexion</a>
            <div class="vmn vmn-mob"><div class="vmn-col"><p class="vmn-t">Élève<small>Apprendre et réviser</small></p><button type="button" class="vmn-i" onclick="VRT.act('pl__aller',this,event)" data-go="elearning"><span class="vmn-p" style="background:#DBE8FE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E499B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-book"/></svg></span><span class="vmn-x">Catalogue e-learning<small>Matières, œuvres, séquences</small></span><span class="vmn-l" title="Réservé aux membres inscrits"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><span class="vsr">Réservé aux membres inscrits</span></span></button><a class="vmn-i" href="corriges/"><span class="vmn-p" style="background:#E0F5E5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007E11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-checkcircle"/></svg></span><span class="vmn-x">Corrigés des cahiers<small>Accès libre, par séquence</small></span></a><a class="vmn-i" href="app.html#epreuves"><span class="vmn-p" style="background:#EAE7F7"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B4FA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-doc"/></svg></span><span class="vmn-x">Annales corrigées<small>BEPC, Probatoire, BAC, GCE</small></span><span class="vmn-l" title="Réservé aux membres inscrits"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><span class="vsr">Réservé aux membres inscrits</span></span></a><a class="vmn-i" href="app.html#evaluations"><span class="vmn-p" style="background:#FFF3E4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A84200" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-clock"/></svg></span><span class="vmn-x">Évaluations en ligne<small>Entraînement chronométré</small></span><span class="vmn-l" title="Réservé aux membres inscrits"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><span class="vsr">Réservé aux membres inscrits</span></span></a><a class="vmn-i" href="oeuvres/"><span class="vmn-p" style="background:#DBE8FE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E499B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-bookopen"/></svg></span><span class="vmn-x">Œuvres au programme<small>Analyses et fiches</small></span></a><a class="vmn-i" href="niveaux/"><span class="vmn-p" style="background:#DDF2F4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E7C86" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-graduation"/></svg></span><span class="vmn-x">Programmes par classe<small>De la 6ᵉ à la Terminale</small></span></a><a class="vmn-i" href="outils/"><span class="vmn-p" style="background:#E0F5E5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007E11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-calculator"/></svg></span><span class="vmn-x">Outils gratuits<small>Calculateurs de moyenne</small></span></a><a class="vmn-i" href="eleve/"><span class="vmn-p" style="background:#DBE8FE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E499B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-user"/></svg></span><span class="vmn-x">Espace élève<small>Corrigés, quiz et méthodes</small></span></a><a class="vmn-i" href="livrets/"><span class="vmn-p" style="background:#FFF3E4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A84200" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-bookopen"/></svg></span><span class="vmn-x">Mon cahier en ligne<small>Interactif, 6ᵉ → Terminale</small></span></a><a class="vmn-i" href="flash/"><span class="vmn-p" style="background:#EAE7F7"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B4FA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-qr"/></svg></span><span class="vmn-x">VÉRITAS Flash<small>Scanner le QR de sa séquence</small></span></a></div><div class="vmn-col"><p class="vmn-t">Parent<small>Suivre et soutenir</small></p><a class="vmn-i" href="app.html#orientation"><span class="vmn-p" style="background:#DDF2F4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E7C86" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-compass"/></svg></span><span class="vmn-x">Orientation<small>Choisir sa série</small></span></a><a class="vmn-i" href="parcours/"><span class="vmn-p" style="background:#EAE7F7"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B4FA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-scale"/></svg></span><span class="vmn-x">Matières et coefficients<small>Poids réels, orientation</small></span></a><a class="vmn-i" href="app.html#cagnotte"><span class="vmn-p" style="background:#FFF3E4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A84200" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-gift"/></svg></span><span class="vmn-x">Cagnotte de scolarité<small>Faire financer son année</small></span></a><a class="vmn-i" href="app.html#trophees"><span class="vmn-p" style="background:#FFF6DA"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8860B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-trophy"/></svg></span><span class="vmn-x">Trophées VÉRITAS<small>Vote gratuit et unique</small></span></a><a class="vmn-i" href="app.html#leaderboard-junior"><span class="vmn-p" style="background:#EAE7F7"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B4FA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-award"/></svg></span><span class="vmn-x">Classement junior<small>Le tableau d’honneur</small></span></a></div><div class="vmn-col"><p class="vmn-t">Enseignant<small>Enseigner et publier</small></p><a class="vmn-i" href="ressources/"><span class="vmn-p" style="background:#FBE4EE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B03A6E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-presentation"/></svg></span><span class="vmn-x">Ressources et cours<small>Leçons interactives</small></span></a><a class="vmn-i" href="manuels.html"><span class="vmn-p" style="background:#DBE8FE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E499B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-qr"/></svg></span><span class="vmn-x">Corrigés du cahier papier<small>La page des QR codes</small></span></a><button type="button" class="vmn-i" onclick="VRT.act('pl__aller',this,event)" data-go="boutique"><span class="vmn-p" style="background:#FFF3E4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A84200" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-shop"/></svg></span><span class="vmn-x">Boutique de manuels<small>Cahiers et études d’œuvres</small></span></button><button type="button" class="vmn-i" onclick="VRT.act('pl__aller',this,event)" data-go="tarifs"><span class="vmn-p" style="background:#EAE7F7"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B4FA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-wallet"/></svg></span><span class="vmn-x">Abonnements<small>Élève, enseignant, établissement</small></span></button><a class="vmn-i" href="app.html#verifier-certificat"><span class="vmn-p" style="background:#DBE8FE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E499B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-shield"/></svg></span><span class="vmn-x">Vérifier un certificat<small>Authentifier une distinction</small></span></a><a class="vmn-i" href="plateforme/"><span class="vmn-p" style="background:#FBE4EE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B03A6E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-presentation"/></svg></span><span class="vmn-x">Atelier de Français<small>Composer une épreuve MINESEC</small></span></a><a class="vmn-i" href="enseignant/"><span class="vmn-p" style="background:#DDF2F4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E7C86" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-doc"/></svg></span><span class="vmn-x">Espace enseignant<small>Guide, grilles, progressions</small></span></a><a class="vmn-i" href="adopter/"><span class="vmn-p" style="background:#E0F5E5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007E11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-checkcircle"/></svg></span><span class="vmn-x">Adopter les cahiers<small>Pour une classe, un établissement</small></span></a></div><div class="vmn-col"><p class="vmn-t">Partenaire<small>Diffuser et représenter</small></p><a class="vmn-i" href="app.html#partenariat"><span class="vmn-p" style="background:#FBE4EE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B03A6E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-users"/></svg></span><span class="vmn-x">Devenir partenaire<small>9 formules, marges revendeur</small></span></a><a class="vmn-i" href="app.html#nos-partenaires"><span class="vmn-p" style="background:#DDF2F4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E7C86" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-handshake"/></svg></span><span class="vmn-x">Nos partenaires<small>Ceux qui nous accompagnent</small></span></a><a class="vmn-i" href="campus/"><span class="vmn-p" style="background:#E4E9F2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0C2A6A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-university"/></svg></span><span class="vmn-x">VÉRITAS Campus<small>Pour les établissements</small></span></a><a class="vmn-i" href="constellation.html"><span class="vmn-p" style="background:#FBE4EE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B03A6E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-sparkles"/></svg></span><span class="vmn-x">Constellation VÉRITAS<small>Tout l’écosystème</small></span></a></div><div class="vmn-col"><p class="vmn-t">Le centre<small>Nous connaître</small></p><a class="vmn-i" href="decouvrir/"><span class="vmn-p" style="background:#DBE8FE"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E499B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-building"/></svg></span><span class="vmn-x">Présentation<small>Qui nous sommes</small></span></a><a class="vmn-i" href="app.html#actualites"><span class="vmn-p" style="background:#FFF3E4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A84200" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-megaphone"/></svg></span><span class="vmn-x">Actualités<small>Ce qui se passe au centre</small></span></a><a class="vmn-i" href="app.html#inscription"><span class="vmn-p" style="background:#FFF3E4"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A84200" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-user"/></svg></span><span class="vmn-x">S’inscrire<small>Créer un compte gratuit</small></span></a><a class="vmn-i" href="plan.html"><span class="vmn-p" style="background:#E4E9F2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0C2A6A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-compass"/></svg></span><span class="vmn-x">Plan du site<small>Tout VÉRITAS, par profil</small></span></a></div></div></div>
        </div>

      <div class="vrt-large" style="display:flex;align-items:center;gap:10px;flex-shrink:0;margin-left:auto">
        <a href="app.html#recherche" aria-label="Rechercher dans tout le site" title="Rechercher dans tout le site" style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#4D5163;border:1px solid transparent;transition:background .18s,border-color .18s,color .18s" class="vh9"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><use href="#lc-search"></use></svg></a>
        <a href="app.html#connexion" style="display:inline-flex;align-items:center;gap:7px;padding:11px 22px;border-radius:10px;background:#FFC93C;color:#001136;font:600 15px Poppins,sans-serif;box-shadow:0 6px 16px rgba(242,165,32,.34);transition:transform .18s,box-shadow .18s" class="vh10"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><use href="#lc-user"></use></svg>Connexion</a>
      </div>
    </div>
  </nav>"""

PROMO_VITRINE = r"""  <!-- BANDEAU D'ANNONCE -->
  <div style="background:linear-gradient(90deg,#0C2A6A,#1E499B 45%,#0E7C86);color:#fff">
    <div style="max-width:1170px;margin:0 auto;padding:13px 24px;display:flex;align-items:center;justify-content:center;gap:10px 18px;flex-wrap:wrap;text-align:center;font-size:15px">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFC93C" stroke-width="2" stroke-linecap="round" aria-hidden="true"><use href="#lc-sparkles"></use></svg>
      <span>VÉRITAS accompagne et suit les apprenants <b style="font-weight:600;color:#FFC93C">au centre, en ligne et à domicile</b>. Pour les enseignants : de quoi préparer tous ses cours et ses épreuves.</span>
      <a href="corriges/" style="display:inline-flex;align-items:center;gap:6px;padding:6px 18px;border-radius:100px;border:1px solid rgba(255,255,255,.55);color:#fff;font:600 13px Poppins,sans-serif;letter-spacing:.4px;text-transform:uppercase;transition:background .18s,color .18s" class="vh11">Corrigés gratuits</a>
      <a href="/#boutique" style="display:inline-flex;align-items:center;gap:7px;padding:6px 18px;border-radius:100px;background:#FFC93C;color:#001136;font:600 13px Poppins,sans-serif;letter-spacing:.4px;text-transform:uppercase;transition:background .18s,box-shadow .18s" class="vh12"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-shop"></use></svg>Boutique</a>
      <a href="plateforme/" style="display:inline-flex;align-items:center;gap:7px;padding:6px 18px;border-radius:100px;border:1px solid rgba(255,255,255,.55);color:#fff;font:600 13px Poppins,sans-serif;letter-spacing:.4px;text-transform:uppercase;transition:background .18s,color .18s" class="vh11"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-presentation"></use></svg>Atelier de français</a>
    </div>
  </div>"""

WIDGETS_VITRINE = r"""  <!-- ══════ OUTILS FLOTTANTS ══════ -->
  <div style="position:fixed;right:22px;bottom:22px;z-index:200;display:flex;flex-direction:column;align-items:flex-end;justify-content:flex-end;gap:12px;pointer-events:none">

    <div id="vrtCit" hidden style="pointer-events:auto;max-width:322px;background:linear-gradient(135deg,#0C2A6A,#5B4FA8);color:#fff;border-radius:16px;padding:18px 20px;box-shadow:0 20px 48px rgba(12,42,106,.36);animation:vpop .42s cubic-bezier(.22,1,.36,1);position:relative">
        <button type="button" onclick="VRT.act('fermerCitation',this,event)" aria-label="Fermer" style="position:absolute;top:11px;right:11px;width:26px;height:26px;border-radius:10px;border:0;background:rgba(255,255,255,.16);color:#fff;cursor:pointer;font:400 15px Poppins,sans-serif;line-height:1;transition:background .18s" class="vh56">×</button>
        <span style="display:inline-flex;align-items:center;gap:8px;font:600 11px Poppins,sans-serif;color:#FFC93C;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:10px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-sparkles"></use></svg>Instant de motivation</span>
        <p style="margin:0 0 8px;font:400 15px/1.65 Poppins,sans-serif;color:#fff;text-wrap:pretty"><span data-vrt-val="citationTexte">Le génie, c’est un pour cent d’inspiration et quatre-vingt-dix-neuf pour cent de transpiration.</span></p>
        <small style="font:500 12.5px Poppins,sans-serif;color:rgba(255,255,255,.7)"><span data-vrt-val="citationAuteur">— Thomas Edison</span></small>
      </div>

    <div id="vrtTrad" hidden style="pointer-events:auto;width:288px;background:#FAFBFE;border:1px solid transparent;border-radius:16px;padding:18px;box-shadow:0 18px 40px rgba(0,17,54,.12);animation:vpop .32s cubic-bezier(.22,1,.36,1)">
        <b style="display:flex;align-items:center;gap:9px;font:600 15px Poppins,sans-serif;color:#001136;margin-bottom:6px"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0E7C86" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-languages"></use></svg>Langue du site</b>
        <small style="display:block;font:400 13px/1.6 Poppins,sans-serif;color:#6E7385;margin-bottom:14px">Sous-système francophone ou anglophone (GCE).</small>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button type="button" onclick="VRT.act('mettreFr',this,event)" style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 14px;border-radius:10px;border:1.5px solid #1E499B;background:#F0F5FF;color:#1E499B;font:600 14px Poppins,sans-serif;cursor:pointer;transition:border-color .18s,background .18s,color .18s">Français<span style="font:400 12px Poppins,sans-serif;opacity:.7">FR</span></button>
          <button type="button" onclick="VRT.act('mettreEn',this,event)" style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 14px;border-radius:10px;border:1.5px solid #E4E7EF;background:#fff;color:#4D5163;font:600 14px Poppins,sans-serif;cursor:pointer;transition:border-color .18s,background .18s,color .18s">English<span style="font:400 12px Poppins,sans-serif;opacity:.7">EN</span></button>
        </div>
      </div>

    <div id="vrtIA" hidden style="pointer-events:auto;width:min(290px,calc(100vw - 96px));background:#FAFBFE;border:1px solid transparent;border-radius:16px;overflow:hidden;box-shadow:0 18px 40px rgba(0,17,54,.12);animation:vpop .34s cubic-bezier(.22,1,.36,1)">
        <div style="background:linear-gradient(135deg,#5B4FA8,#2E2470);padding:11px 13px;display:flex;align-items:center;gap:9px">
          <span style="position:relative;width:34px;height:34px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;flex:0 0 auto;box-shadow:0 4px 12px rgba(0,0,0,.24)"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-brain"></use></svg><span aria-hidden="true" style="position:absolute;right:-2px;bottom:-2px;width:11px;height:11px;border-radius:50%;background:#7BD99C;border:2px solid #4A3E92"></span></span>
          <span style="display:flex;flex-direction:column;line-height:1.25;flex:1;min-width:0">
            <b style="font:600 13.5px Poppins,sans-serif;color:#fff">Professeur Ambassa</b>
            <small style="display:inline-flex;align-items:center;gap:5px;font:400 11px Poppins,sans-serif;color:rgba(255,255,255,.75)"><span style="width:6px;height:6px;border-radius:50%;background:#7BD99C;animation:vpulse 2.4s ease-out infinite"></span>en ligne</small>
          </span>
          <button type="button" onclick="VRT.act('basculerIA',this,event)" aria-label="Fermer" style="width:26px;height:26px;border-radius:9px;border:0;background:rgba(255,255,255,.16);color:#fff;cursor:pointer;font:400 15px Poppins,sans-serif;line-height:1;transition:background .18s" class="vh56">×</button>
        </div>
        <div style="display:flex;gap:5px;padding:8px 11px;background:#F4F2FC;border-bottom:1px solid #E7E3F5">
          <button type="button" onclick="VRT.act('ambassaOutil',this,event)" data-outil="quiz" title="Génère un quiz d'entraînement" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 2px;border:1px solid #DDD6F3;border-radius:9px;background:#fff;color:#5B4FA8;font:600 9.5px Poppins,sans-serif;cursor:pointer;transition:background .16s,transform .16s" class="vh57"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-target"></use></svg>Quiz</button>
          <button type="button" onclick="VRT.act('ambassaOutil',this,event)" data-outil="fiche" title="Fiche de révision synthétique" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 2px;border:1px solid #DDD6F3;border-radius:9px;background:#fff;color:#5B4FA8;font:600 9.5px Poppins,sans-serif;cursor:pointer;transition:background .16s,transform .16s" class="vh57"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-bookopen"></use></svg>Fiche</button>
          <button type="button" onclick="VRT.act('ambassaOutil',this,event)" data-outil="corriger" title="Corrige ma copie ou ma réponse" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 2px;border:1px solid #DDD6F3;border-radius:9px;background:#fff;color:#5B4FA8;font:600 9.5px Poppins,sans-serif;cursor:pointer;transition:background .16s,transform .16s" class="vh57"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-checkcircle"></use></svg>Corriger</button>
          <button type="button" onclick="VRT.act('ambassaOutil',this,event)" data-outil="methode" title="La méthode pas à pas" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 2px;border:1px solid #DDD6F3;border-radius:9px;background:#fff;color:#5B4FA8;font:600 9.5px Poppins,sans-serif;cursor:pointer;transition:background .16s,transform .16s" class="vh57"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-compass"></use></svg>Méthode</button>
        </div>
        <div style="padding:12px 13px;background:#FAFBFE">
          <div id="vrtIAMsgs" role="log" aria-live="polite" aria-label="Conversation avec le Professeur Ambassa" style="display:flex;flex-direction:column;gap:10px;max-height:240px;overflow-y:auto;margin-bottom:14px">
            <div style="align-self:flex-start;max-width:92%;background:#FAFBFE;border:1px solid transparent;border-radius:12px;border-top-left-radius:4px;padding:13px 15px;font:400 14px/1.65 Poppins,sans-serif;color:#4D5163;text-wrap:pretty">Salut ! Sur quoi tu bloques ? Une méthode, un exercice, une œuvre — je t'explique la démarche, pas la réponse.</div>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:14px">
            
              <span onclick="VRT.act('ambassaSuggestion',this,event)" role="button" tabindex="0" style="background:#EEE9F8;color:#5B4FA8;border-radius:100px;padding:7px 13px;font:500 12.5px Poppins,sans-serif;cursor:pointer;transition:background .18s" class="vh58">Méthode de la dissertation</span>
            
              <span onclick="VRT.act('ambassaSuggestion',this,event)" role="button" tabindex="0" style="background:#EEE9F8;color:#5B4FA8;border-radius:100px;padding:7px 13px;font:500 12.5px Poppins,sans-serif;cursor:pointer;transition:background .18s" class="vh58">Expliquer ce passage</span>
            
              <span onclick="VRT.act('ambassaSuggestion',this,event)" role="button" tabindex="0" style="background:#EEE9F8;color:#5B4FA8;border-radius:100px;padding:7px 13px;font:500 12.5px Poppins,sans-serif;cursor:pointer;transition:background .18s" class="vh58">Équation du second degré</span>
            
          </div>
          <div style="display:flex;gap:8px">
            <input id="vrtIAInput" type="text" enterkeyhint="send" autocomplete="off" placeholder="Pose ta question…" aria-label="Pose ta question au Professeur Ambassa" style="flex:1;min-width:0;border:1px solid transparent;border-radius:10px;padding:11px 13px;font:400 14px Poppins,sans-serif;color:#001136;outline:0;background:#FAFBFE">
            <button id="vrtIASend" type="button" onclick="VRT.act('ambassaEnvoyer',this,event)" aria-label="Envoyer" style="width:44px;border-radius:10px;border:0;background:linear-gradient(135deg,#7C6BD6,#5B4FA8);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .18s" class="vh59"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-arrow-right"></use></svg></button>
          </div>
          <small id="vrtIAQuota" style="display:block;margin-top:11px;font:400 12px Poppins,sans-serif;color:#6E7385">3 questions offertes par semaine · 30/jour avec le plan Pro</small>
        </div>
      </div>

    <div style="pointer-events:auto;display:flex;flex-direction:column;gap:10px;align-items:flex-end">
      <button type="button" onclick="VRT.act('basculerTheme',this,event)" aria-label="Thème clair ou sombre" title="Thème clair / sombre" style="width:46px;height:46px;border-radius:50%;border:1px solid rgba(12,42,106,.10);background:rgba(255,255,255,.94);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#4D5163;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,17,54,.07),0 8px 22px rgba(0,17,54,.10);transition:transform .18s,box-shadow .18s,color .18s" class="vh60">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-moon"></use></svg></button>

      <button type="button" onclick="VRT.act('basculerTraducteur',this,event)" aria-label="Traducteur" title="Français / English" style="width:46px;height:46px;border-radius:50%;border:1px solid rgba(12,42,106,.10);background:rgba(255,255,255,.94);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#0E7C86;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,17,54,.06);transition:transform .18s,box-shadow .18s" class="vh61">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-languages"></use></svg></button>

      <button type="button" onclick="VRT.act('basculerIA',this,event)" aria-label="Professeur Ambassa" title="Professeur Ambassa" style="position:relative;width:58px;height:58px;border-radius:50%;border:0;background:linear-gradient(150deg,#8272DD,#5B4FA8);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(91,79,168,.20),0 12px 28px rgba(91,79,168,.30);transition:transform .18s,box-shadow .18s" class="vh62">
        <span aria-hidden="true" style="position:absolute;inset:-5px;border-radius:50%;border:1.5px solid rgba(124,107,214,.38);animation:vpulse 2.8s ease-out infinite"></span>
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-brain"></use></svg></button>
    </div>
  </div>"""

FOOTER_VITRINE = r"""<footer style="background:#001136;color:rgba(255,255,255,.72);margin-top:64px">
    <div style="max-width:1170px;margin:0 auto;padding:52px 24px 30px;display:grid;grid-template-columns:1.25fr 1fr 1fr 1fr;gap:34px">
      <div>
        <div style="display:flex;align-items:center;gap:11px;margin-bottom:14px">
          <img loading="lazy" decoding="async" width="344" height="347" src="assets/veritas-logo.png" alt="" style="width:48px;height:48px;object-fit:contain;background:#fff;border-radius:10px;padding:3px">
          <span style="font:600 19px Poppins,sans-serif;color:#fff">VÉRITAS<small style="display:block;font:400 11px Poppins,sans-serif;color:#8FA0C4">La réussite assurée</small></span>
        </div>
        <p style="font-size:14px;line-height:1.7;margin:0 0 16px;max-width:300px">Centre d'Excellence Scolaire — Douala, Cameroun. Cours, corrigés et accompagnement conformes au programme MINESEC.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.08);border-radius:100px;padding:6px 12px;font:500 12px Poppins,sans-serif;color:#FFC93C"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><use href="#lc-smartphone"></use></svg>MTN MoMo</span>
          <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.08);border-radius:100px;padding:6px 12px;font:500 12px Poppins,sans-serif;color:#A84200"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><use href="#lc-coins"></use></svg>Orange Money</span>
          <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.08);border-radius:100px;padding:6px 12px;font:500 12px Poppins,sans-serif;color:#7BD99C"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><use href="#lc-shield"></use></svg>Reçu automatique</span>
        </div>
      </div>
      
        <div>
          <div style="font:600 12px Poppins,sans-serif;color:#fff;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px">Apprendre</div>
          <div style="display:flex;flex-direction:column;gap:9px">
            
              <a href="/#elearning" style="font-size:14px;color:rgba(255,255,255,.72)" class="vh1">Catalogue E-Learning</a>
            
              <a href="corriges/" style="font-size:14px;color:rgba(255,255,255,.72)" class="vh1">Corrigés des cahiers</a>
            
              <a href="/#elearning" style="font-size:14px;color:rgba(255,255,255,.72)" class="vh1">Mes matières</a>
            
              <a href="app.html#epreuves" style="font-size:14px;color:rgba(255,255,255,.72)" class="vh1">Épreuves &amp; annales</a>
            
              <a href="oeuvres/" style="font-size:14px;color:rgba(255,255,255,.72)" class="vh1">Œuvres au programme</a>
            
          </div>
        </div>
      
        <div>
          <div style="font:600 12px Poppins,sans-serif;color:#fff;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px">Services</div>
          <div style="display:flex;flex-direction:column;gap:9px">
            
              <a href="/#boutique" style="font-size:14px;color:rgba(255,255,255,.72)" class="vh1">Boutique de manuels</a><a href="plan.html#partenaire" style="font-size:14px;color:rgba(255,255,255,.72)">Partenaires</a>
            
              <a href="/#tarifs" style="font-size:14px;color:rgba(255,255,255,.72)" class="vh1">Abonnements</a>
            
              <a href="/#elearning" style="font-size:14px;color:rgba(255,255,255,.72)" class="vh1">Professeur Ambassa</a>
            
              <a href="/#elearning" style="font-size:14px;color:rgba(255,255,255,.72)" class="vh1">Labos virtuels</a>
            
              <a href="app.html#cagnotte" style="font-size:14px;color:rgba(255,255,255,.72)" class="vh1">Cagnotte de scolarité</a>
            
          </div>
        </div>
      
        <div>
          <div style="font:600 12px Poppins,sans-serif;color:#fff;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px">Le centre</div>
          <div style="display:flex;flex-direction:column;gap:9px">
            
              <a href="decouvrir/" style="font-size:14px;color:rgba(255,255,255,.72)" class="vh1">Qui nous sommes</a>
            
              <a href="plan.html#parent" style="font-size:14px;color:rgba(255,255,255,.72)" class="vh1">Espace Parents</a>
            
              <a href="app.html#partenariat" style="font-size:14px;color:rgba(255,255,255,.72)" class="vh1">Réseau enseignants</a>
            
              <a href="app.html#partenariat" style="font-size:14px;color:rgba(255,255,255,.72)" class="vh1">Partenaires</a>
            
              <a href="campus/" style="font-size:14px;color:rgba(255,255,255,.72)" class="vh1">VÉRITAS Campus</a>
            
              <a href="app.html#verifier-certificat" style="font-size:14px;color:rgba(255,255,255,.72)" class="vh1">Vérifier un certificat</a>
            
          </div>
        </div>
      
    </div>
    <div style="border-top:1px solid rgba(255,255,255,.12)">
      <div style="max-width:1170px;margin:0 auto;padding:26px 24px;display:grid;grid-template-columns:1.4fr 1fr;gap:28px;align-items:start">
        <div>
          <details style="border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:0;background:rgba(255,255,255,.04)">
            <summary style="cursor:pointer;list-style:none;padding:11px 14px;font:600 12px Poppins,sans-serif;color:#fff;letter-spacing:1px;text-transform:uppercase;display:flex;align-items:center;gap:9px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFC93C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#lc-shield"></use></svg>Mentions légales
              <span aria-hidden="true" style="margin-left:auto;font:400 15px Poppins,sans-serif;color:rgba(255,255,255,.55)">+</span>
            </summary>
            <div style="padding:0 14px 14px">
          <p style="margin:0 0 10px;font:400 13px/1.85 Poppins,sans-serif;color:rgba(255,255,255,.72);text-wrap:pretty"><b style="color:#fff">VERITAS EDUCATION SARL</b> — SARL pluripersonnelle au capital de 999 000 FCFA. Siège social : Douala, Ndogpassi 14<sup>e</sup>, lieu-dit Carrefour Mbouda, Cameroun.</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            
              <span style="display:inline-flex;align-items:baseline;gap:6px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:6px 11px;font:400 12px Poppins,sans-serif;color:rgba(255,255,255,.72)"><b style="font:600 12px Poppins,sans-serif;color:#FFC93C">RCCM</b>CM-DLA-03-2026-B12-00729</span>
            
              <span style="display:inline-flex;align-items:baseline;gap:6px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:6px 11px;font:400 12px Poppins,sans-serif;color:rgba(255,255,255,.72)"><b style="font:600 12px Poppins,sans-serif;color:#FFC93C">NIU</b>M072618875274L</span>
            
              <span style="display:inline-flex;align-items:baseline;gap:6px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:6px 11px;font:400 12px Poppins,sans-serif;color:rgba(255,255,255,.72)"><b style="font:600 12px Poppins,sans-serif;color:#FFC93C">Capital</b>999 000 FCFA</span>
            
              <span style="display:inline-flex;align-items:baseline;gap:6px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:6px 11px;font:400 12px Poppins,sans-serif;color:rgba(255,255,255,.72)"><b style="font:600 12px Poppins,sans-serif;color:#FFC93C">Siège</b>Douala, Cameroun</span>
            
          </div>
          <p style="margin:12px 0 0;font:400 12px/1.7 Poppins,sans-serif;color:rgba(255,255,255,.5)">Attestation d'immatriculation et attestation de conformité fiscale délivrées le 7 août 2026. Centre des impôts : CFLP Douala 3<sup>e</sup> bis.</p>
            </div>
          </details>
        </div>
        <div>
          <div style="font:600 12px Poppins,sans-serif;color:#fff;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px">Paiements acceptés</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            
              <span role="img" aria-label="MTN Mobile Money" title="MTN Mobile Money" style="display:flex;align-items:center;justify-content:center;height:38px;padding:0 5px;background:#fff;border-radius:8px"><svg width="62" height="25" viewBox="0 0 80 32" aria-hidden="true"><use href="#pay-mtn"></use></svg></span>
            
              <span role="img" aria-label="Orange Money" title="Orange Money" style="display:flex;align-items:center;justify-content:center;height:38px;padding:0 5px;background:#fff;border-radius:8px"><svg width="62" height="25" viewBox="0 0 80 32" aria-hidden="true"><use href="#pay-orange"></use></svg></span>
            
              <span role="img" aria-label="Visa" title="Visa" style="display:flex;align-items:center;justify-content:center;height:38px;padding:0 5px;background:#fff;border-radius:8px"><svg width="62" height="25" viewBox="0 0 80 32" aria-hidden="true"><use href="#pay-visa"></use></svg></span>
            
              <span role="img" aria-label="Mastercard" title="Mastercard" style="display:flex;align-items:center;justify-content:center;height:38px;padding:0 5px;background:#fff;border-radius:8px"><svg width="62" height="25" viewBox="0 0 80 32" aria-hidden="true"><use href="#pay-mc"></use></svg></span>
            
              <span role="img" aria-label="PayPal" title="PayPal" style="display:flex;align-items:center;justify-content:center;height:38px;padding:0 5px;background:#fff;border-radius:8px"><svg width="62" height="25" viewBox="0 0 80 32" aria-hidden="true"><use href="#pay-paypal"></use></svg></span>
            
              <span role="img" aria-label="Stripe" title="Stripe" style="display:flex;align-items:center;justify-content:center;height:38px;padding:0 5px;background:#fff;border-radius:8px"><svg width="62" height="25" viewBox="0 0 80 32" aria-hidden="true"><use href="#pay-stripe"></use></svg></span>
            
          </div>
          <p style="margin:12px 0 0;font:400 12px/1.7 Poppins,sans-serif;color:rgba(255,255,255,.5)">Aucun frais supplémentaire côté famille. Reçu numéroté avec QR de vérification à chaque règlement.</p>
        </div>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,.1)">
      <div style="max-width:1170px;margin:0 auto;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;font-size:13px">
        <span>© 2026 · veritas-school.com<small style="display:block;margin-top:3px;font:400 12px Poppins,sans-serif;color:rgba(255,255,255,.55)">Veritas Education <em style="font-style:normal;color:rgba(255,255,255,.75)">by Mythe Errant</em></small></span>
        <span style="display:flex;gap:18px">
          <a href="legal/mentions-legales.html" style="color:rgba(255,255,255,.72)" class="vh50">Mentions légales</a>
          <a href="legal/cgv.html" style="color:rgba(255,255,255,.72)" class="vh50">CGV</a>
          <!-- Le site n'avait AUCUNE politique de confidentialité (les deux URL
               attendues rendaient 404) alors qu'il collecte nom, WhatsApp et
               classe, dès la 6ᵉ. La page existe depuis le 27/08/2026 ; ce lien
               est le seul chemin public qui y mène. -->
          <a href="legal/confidentialite.html" style="color:rgba(255,255,255,.72)" class="vh50">Confidentialité</a>
          <a href="app.html#contact" style="color:rgba(255,255,255,.72)" class="vh50">Contact</a>
        </span>
      </div>
      </div>
    </div>
  </footer>"""

CSS_CHROME = r"""  @keyframes vpulse{0%,100%{box-shadow:0 0 0 0 rgba(91,224,122,.5)}70%{box-shadow:0 0 0 9px rgba(91,224,122,0)}}
  @keyframes vpop{0%{transform:scale(.82);opacity:0}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}

/* Barre large / compacte : bascule à 1000 px, en CSS pur. */
.vrt-compact{display:none!important}
@media (max-width:999.98px){
  .vrt-large{display:none!important}
  .vrt-compact{display:flex!important}
}
[hidden]{display:none!important}

/* ── Le menu « Plus » s'ouvre au survol ────────────────────────────────────
   Trois choses à savoir avant de toucher à cette règle.

   1. Le mot-clé important est OBLIGATOIRE ici. La ligne [hidden] juste
      au-dessus ferme le panneau avec la même arme : sans important en face,
      la règle de survol perd l'arbitrage, en silence.

   2. On s'accroche au PARENT via :has(), faute de conteneur. Le panneau est
      positionné en absolu, mais l'élément #vrtPlusWrap que vitrine.js
      interroge dans son gestionnaire de clic extérieur n'existe pas dans la
      page — :has(> #vrtPlus) désigne donc le vrai parent, quel qu'il soit.
      Là où :has() n'est pas connu (Chrome antérieur à 105, encore présent
      sur une partie du parc Android d'ici), la règle est simplement ignorée
      et le clic continue de fonctionner : l'ouverture au survol est un
      confort, jamais la seule porte d'entrée.

   3. Réservé aux pointeurs FINS. Sur un écran tactile, un menu qui s'ouvre au
      survol piège l'utilisateur : la première frappe ouvre au lieu de
      naviguer, et rien n'indique qu'il faut frapper deux fois. La demande
      était « au pointeur de la souris » — la media query dit exactement
      cela. */
@media (hover:hover) and (pointer:fine){
  *:has(> #vrtPlus):hover > #vrtPlus[hidden]{display:flex!important}
  /* Pont de survol : sans lui, les quelques pixels entre le bouton et le
     panneau referment le menu en cours de trajet. */
  *:has(> #vrtPlus){position:relative}
  *:has(> #vrtPlus)::after{content:'';position:absolute;left:0;right:0;top:100%;height:10px}
}

/* ── Menu « Plus » : toutes les rubriques ──────────────────────────────────
   Le panneau d'origine tenait quatre entrées dans 236 px. Il en porte
   maintenant vingt-sept, groupées : il faut des colonnes, sinon la liste
   dépasse l'écran et on perd ce qu'on venait de gagner.

   Largeurs choisies pour que le panneau NE SOIT JAMAIS coupé. Il est ancré
   sur le bouton « Plus », qui se trouve autour du tiers gauche de la barre :
   trois colonnes de 218 px (≈ 690 px) tiennent à partir de 1200 px de
   fenêtre, deux colonnes en dessous. Sous 1000 px le panneau n'est plus
   affiché du tout — c'est le menu mobile qui prend le relais, et il reçoit
   les mêmes entrées. */
/* MÉGA-MENU PLEINE LARGEUR (v1.19.31). Barre fixée SOUS l'en-tête, fond
   pleine largeur (technique du padding-inline : le bloc s'étend d'un bord à
   l'autre, le CONTENU reste centré à 1160 px). Trois colonnes ÉGALES qui
   s'étalent sur toute la largeur — plus de panneau étroit ancré à gauche, plus
   de descriptions tronquées.

   Ancrage : #vrtNav porte un backdrop-filter, qui fait de lui le BLOC CONTENANT
   des descendants position:fixed. « top:100% » = exactement le bas du nav, et
   s'ajuste tout seul quand le nav se compacte au défilement — aucun JS requis.
   Repli @supports pour les rares navigateurs sans backdrop-filter (le bloc
   contenant redevient alors le viewport, où le nav commence à 0 → 76 px). */
.vmn{position:fixed;left:0;right:0;top:100%;
  background:#fff;border-top:1px solid #EEF1F7;border-bottom:1px solid #E1E6F0;
  box-shadow:0 26px 52px rgba(12,28,74,.16);z-index:59;
  padding:24px max(24px,calc((100vw - 1160px)/2)) 30px;
  display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:2px 30px;
  max-height:min(80vh,540px);overflow-y:auto;overscroll-behavior:contain;
  animation:vmnDown .26s cubic-bezier(.22,1,.36,1)}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){ .vmn{top:76px} }
/* Cinq colonnes de rôle tiennent au-delà de 1240 px. En dessous on passe à
   trois puis à deux : une colonne de rôle écrasée sous ~200 px coupe les
   libellés (« Matières et coefficients »), et un menu illisible ne range
   rien. Le classement par rôle survit à chaque palier — seul le nombre de
   colonnes change, jamais l'ordre des groupes. */
@media (max-width:1239.98px){ .vmn{grid-template-columns:repeat(3,minmax(0,1fr))} }
@media (max-width:1023.98px){ .vmn{grid-template-columns:repeat(2,minmax(0,1fr));gap:2px 30px;padding-left:24px;padding-right:24px} }
@keyframes vmnDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}
.vmn-col{display:flex;flex-direction:column;gap:1px;min-width:0}
.vmn-t{margin:8px 0 6px;padding:0 12px 6px;font:700 11px Poppins,sans-serif;
  letter-spacing:1px;text-transform:uppercase;color:#5B4FA8;border-bottom:1px solid #F0F2F8}
/* Le sous-titre dit à qui la colonne s'adresse, en minuscules et sans
   interlettrage : il se lit comme une phrase, pas comme une deuxième
   étiquette qui concurrencerait le nom du rôle. */
.vmn-t small{display:block;margin-top:3px;font:400 11px Poppins,sans-serif;
  letter-spacing:0;text-transform:none;color:#8A8FA3}
/* Bandeau d'annonces piloté par l'admin (« Portail visiteur → Bandeau
   défilant »). Inséré par vitrine.js seulement s'il y a un message : pas de
   barre vide. Navy plein plutôt qu'un jaune d'alerte — c'est une information
   du centre, pas un avertissement, et l'accueil est déjà clair. */
/* Podium du panneau « Apprendre en jouant ». Rempli par vitrine.js depuis les
   scores réels ; le conteneur reste masqué tant qu'il n'y en a aucun. */
.vpod-list{list-style:none;margin:12px 0 0;padding:0;display:flex;flex-direction:column;gap:7px}
.vpod-l{display:flex;align-items:center;gap:11px;padding:10px 13px;border-radius:12px;
  background:#F7F9FD;font:500 14px Poppins,sans-serif;color:#12203F}
.vpod-l:first-child{background:#FFF8E6}
.vpod-r{flex:0 0 auto;width:25px;height:25px;border-radius:50%;color:#fff;
  display:inline-flex;align-items:center;justify-content:center;font:700 12.5px Poppins,sans-serif}
.vpod-n{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.vpod-p{flex:0 0 auto;font:700 13.5px Poppins,sans-serif;color:#A84200}

.vann{display:flex;align-items:center;justify-content:center;gap:9px;
  padding:9px 20px;background:linear-gradient(90deg,#0C2A6A,#1E499B);color:#fff;
  font:500 13.5px/1.45 Poppins,sans-serif;text-align:center;position:relative;z-index:58}
.vann-p{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;
  width:22px;height:22px;border-radius:7px;background:rgba(255,255,255,.16);color:#FFC93C}
.vann-x{animation:vannIn .5s cubic-bezier(.22,1,.36,1);min-width:0}
@keyframes vannIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){ .vann-x{animation:none} }
@media (max-width:600px){ .vann{font-size:12.5px;padding:8px 14px} }

/* Texte réservé aux lecteurs d'écran : présent dans l'arbre d'accessibilité,
   invisible à l'œil. On masque par clip-path et non par display:none, qui le
   retirerait aussi de l'annonce vocale. */
.vsr{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;
  overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}
.vmn-l{flex:0 0 auto;margin-left:auto;display:inline-flex;align-items:center;
  justify-content:center;width:19px;height:19px;border-radius:6px;
  background:#F1F0FA;color:#5B4FA8}
.vmn-i:hover .vmn-l{background:#E4E1F6}
.vmn-i{display:flex;align-items:center;gap:11px;padding:9px 12px;border:0;border-radius:11px;
  background:none;cursor:pointer;text-align:left;text-decoration:none;width:100%;
  font:500 14px Poppins,sans-serif;color:#12203F;
  transition:background .16s ease,color .16s ease,transform .16s ease}
.vmn-i:hover,.vmn-i:focus-visible{background:#F3F6FC;color:#1E499B;outline:none;transform:translateX(3px)}
.vmn-i:focus-visible{box-shadow:0 0 0 2px #1E499B inset}
.vmn-i:hover .vmn-p{transform:scale(1.1) rotate(-3deg)}
.vmn-p{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;
  justify-content:center;flex:0 0 auto;transition:transform .18s cubic-bezier(.34,1.56,.64,1)}
.vmn-x{display:flex;flex-direction:column;line-height:1.35;min-width:0}
.vmn-x small{font:400 12px Poppins,sans-serif;color:#6E7385;margin-top:1px}
@media (prefers-reduced-motion:reduce){ .vmn{animation:none} .vmn-i,.vmn-p{transition:none} .vmn-i:hover{transform:none} .vmn-i:hover .vmn-p{transform:none} }

/* Version mobile : dans le tiroir, donc en flux, une seule colonne, sans
   ombre ni cadre — le tiroir en porte déjà. */
.vmn-mob{position:static;display:block;border:0;box-shadow:none;padding:4px 0 0;
  max-height:none;overflow:visible;animation:none;background:none;
  border-top:1px solid #E4E7EF;margin-top:8px}
.vmn-mob .vmn-col{margin-bottom:2px}

.vh1:hover{color:#fff;text-decoration:underline}
.vh2:hover{color:#1E499B;border-bottom-color:#1E499B}
.vh3:hover{color:#0E7C86;border-bottom-color:#0E7C86}
.vh4:hover{color:#B03A6E;border-bottom-color:#B03A6E}
.vh5:hover{color:#5B4FA8;border-bottom-color:#5B4FA8}
.vh7:hover{background:#F4F7FD}
.vh8:hover{color:#fff;text-decoration:none}
.vh9:hover{background:#F0F4FB;border-color:#DBE8FE;color:#1E499B;text-decoration:none}
.vh10:hover{color:#001136;text-decoration:none;transform:translateY(-2px);box-shadow:0 10px 22px rgba(242,165,32,.42)}
.vh11:hover{background:#fff;color:#1E499B;text-decoration:none}
.vh12:hover{background:#FFD96B;box-shadow:0 4px 12px rgba(255,201,60,.4);text-decoration:none}
.vh50:hover{color:#fff}
.vh56:hover{background:rgba(255,255,255,.3)}
.vh57:hover{background:#5B4FA8;color:#fff;transform:translateY(-2px)}
.vh58:hover{background:#5B4FA8;color:#fff}
.vh59:hover{transform:translateY(-2px)}
.vh60:hover{transform:translateY(-3px) rotate(-8deg);box-shadow:0 12px 26px rgba(0,17,54,.09);color:#A84200}
.vh61:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(14,124,134,.28)}
.vh62:hover{transform:translateY(-4px) scale(1.05);box-shadow:0 18px 40px rgba(91,79,168,.55)}"""


CSS_CARTES = """  /* LA CARTE DE LA VITRINE, reproduite cote pour cote. Toute couleur écrite
     ici doit exister dans vitrine.html : main() le vérifie et s'arrête sinon.
     L'enveloppe (en-tête, fil d'Ariane, titres de section, pied) vient de
     veritas-pages.css, comme sur les 133 autres pages. */
  .pl-nav{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:0 0 6px}
  .pl-nav a{display:inline-flex;align-items:center;gap:7px;font:600 13.5px Poppins,sans-serif;
            color:#001136;text-decoration:none;border:1px solid #E4E9F2;border-radius:999px;
            padding:8px 15px;background:#fff;transition:background .18s,transform .18s}
  .pl-nav a svg{color:#1E499B}
  .pl-nav a:hover{background:#F4F5F8;transform:translateY(-1px)}
  .pl-s{margin-top:2.4rem}
  /* `h2.sec` est CENTRÉ par la feuille partagée ; le sous-titre suit. */
  .pl-sub{margin:.15rem 0 1.2rem;font:400 14px Poppins,sans-serif;color:#4D5163;text-align:center}

  /* `stretch` et non `start` : les cartes d'une rangée prennent la hauteur de
     la plus haute, et `margin-top:auto` aligne toutes les actions en bas. */
  .pl-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;
        align-items:stretch}

  .pl-c{display:flex;flex-direction:column;align-items:center;text-align:center;
        background:#fff;border:1px solid #E4E9F2;border-radius:14px;padding:20px 18px;
        box-shadow:0 4px 14px rgba(0,17,54,.05);text-decoration:none;color:inherit;
        transition:transform .18s,box-shadow .18s}
  /* Le survol de la vitrine (.vh15), MOINS sa bordure bleue : aucun trait
     coloré, au repos comme au survol. */
  a.pl-c:hover{transform:translateY(-4px);box-shadow:0 12px 26px rgba(0,17,54,.09);
               text-decoration:none}
__FAMILLES__

  .pl-ico{width:42px;height:42px;border-radius:50%;background:var(--fond);color:var(--trait);
          display:flex;align-items:center;justify-content:center;margin:0 auto 13px;flex:none}
  .pl-t{display:block;font:600 15.5px Poppins,sans-serif;color:#001136;margin-bottom:5px;
        line-height:1.35}
  .pl-n{display:inline-block;font:600 11.5px Poppins,sans-serif;color:var(--trait);
        background:var(--fond);border-radius:999px;padding:2px 10px;margin:1px 0 7px}
  .pl-d{display:block;font:400 13px/1.6 Poppins,sans-serif;color:#4D5163}
  .pl-go{margin-top:auto;padding-top:12px;display:inline-flex;align-items:center;gap:4px;
         font:600 13.5px Poppins,sans-serif;color:var(--trait)}
  .pl-go svg{transition:transform .18s}
  a.pl-c:hover .pl-go svg{transform:translateX(3px)}

  /* Le repli des rubriques sans index : même place et même encre que « Ouvrir ». */
  .pl-x{margin-top:auto;padding-top:12px;width:100%}
  .pl-x>summary{cursor:pointer;list-style:none;display:inline-flex;align-items:center;gap:4px;
                font:600 13.5px Poppins,sans-serif;color:var(--trait)}
  .pl-x>summary::-webkit-details-marker{display:none}
  .pl-x>summary .pl-chev{transition:transform .18s}
  .pl-x[open]>summary .pl-chev{transform:rotate(90deg)}
  .pl-l{display:flex;flex-direction:column;gap:6px;margin-top:10px;padding-top:10px;
        border-top:1px solid #E4E9F2;text-align:left}
  .pl-l a{display:flex;align-items:flex-start;gap:6px;font:400 13px/1.45 Poppins,sans-serif;
          color:#001136;text-decoration:none}
  .pl-l a svg{color:var(--trait);flex:none;margin-top:2px}
  .pl-l a:hover span{text-decoration:underline}
  @media (max-width:620px){ .pl-g{grid-template-columns:1fr} }"""


def regles_familles():
    """Une règle par paire de médaillon de la vitrine."""
    return '\n'.join('  .pl-c[data-f="%s"]{--fond:%s;--trait:%s}' % (k, f, t)
                     for k, (f, t) in FAMILLES.items())


def page(entrees, vitrine):
    total = sum(e['n'] for e in entrees)
    blocs = []
    for cle, nom, sous, icone in PROFILS:
        lot = [e for e in entrees if cle in e['profils']]
        if not lot:
            continue
        blocs.append(
            '<section class="pl-s" id="' + cle + '">'
            '<h2 class="sec">' + ico(icone, 24, 2, 'i') + esc(nom) + '</h2>'
            '<p class="pl-sub">' + esc(sous)
            + ' &nbsp;·&nbsp; ' + str(len(lot)) + ' rubriques</p>'
            '<div class="pl-g">' + ''.join(carte(e) for e in lot) + '</div>'
            '</section>')

    nav = ''.join('<a href="#' + c + '">' + ico(i, 15, 2) + esc(n) + '</a>'
                  for c, n, _, i in PROFILS
                  if any(c in e['profils'] for e in entrees))

    familles = regles_familles()

    # Le sprite se calcule APRÈS le rendu : il ne recopie que les icônes
    # réellement posées dans la page.
    lutins = sprite(vitrine)

    return """<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Plan du site — tout VÉRITAS, classé par profil</title>
<meta name="description" content="Corrigés, œuvres au programme, cours, évaluations, livrets et outils du Centre VÉRITAS, rangés selon que vous êtes élève, parent, enseignant ou partenaire.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="__SITE__/plan.html">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Centre VÉRITAS">
<meta property="og:title" content="Plan du site — tout VÉRITAS, classé par profil">
<meta property="og:description" content="Tout ce que publie le Centre VÉRITAS, rangé par profil : élève, parent, enseignant, partenaire.">
<meta property="og:url" content="__SITE__/plan.html">
<meta property="og:image" content="__SITE__/uploads/logo-veritas.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"></noscript>
<link rel="stylesheet" href="/assets/veritas-pages.css?v=__VER__">
<style>
__CSS__
</style>
<style>
/* vitrine:habillage — recopié tel quel de vitrine.html */
__CSS_CHROME__
</style>
</head>
<body>
__SPRITE__
<div style="background:#fff">
__NAV_VITRINE__
__PROMO_VITRINE__
</div>
<header class="top">
  <span class="badge">Plan du site</span>
  <h1>Tout VÉRITAS, rangé selon qui vous êtes</h1>
  <p>Le centre publie __TOTAL__ pages en accès libre : corrigés, œuvres au programme,
     cours, évaluations et outils. Un même service peut vous concerner à plusieurs
     titres — il apparaît alors sous chacun.</p>
</header>
<div class="wrap">
  <p class="crumb"><a href="/">Accueil</a> &rsaquo; Plan du site</p>
  <nav class="pl-nav">__NAV__</nav>
  __BLOCS__
  <p class="pl-sub" style="text-align:center;margin-top:2.4rem">
    Page mise à jour le __DATE__ — les compteurs se recomptent depuis les pages
    publiées.
  </p>
</div>
__FOOTER_VITRINE__
__WIDGETS_VITRINE__
<script src="/assets/vitrine.js?v=__VER__" defer></script>
</body>
</html>
""".replace('__CSS__', CSS_CARTES) \
   .replace('__CSS_CHROME__', CSS_CHROME) \
   .replace('__FAMILLES__', familles) \
   .replace('__SPRITE__', lutins) \
   .replace('__NAV_VITRINE__', NAV_VITRINE) \
   .replace('__PROMO_VITRINE__', PROMO_VITRINE) \
   .replace('__FOOTER_VITRINE__', FOOTER_VITRINE) \
   .replace('__WIDGETS_VITRINE__', WIDGETS_VITRINE) \
   .replace('__TOTAL__', str(total)) \
   .replace('__NAV__', nav) \
   .replace('__BLOCS__', ''.join(blocs)) \
   .replace('__VER__', VER) \
   .replace('__SITE__', SITE) \
   .replace('__DATE__', date.today().strftime('%d/%m/%Y'))


def main():
    try:
        vitrine = io.open(VITRINE, encoding='utf-8', errors='replace').read()
    except OSError:
        raise SystemExit('build_plan : vitrine.html introuvable — la page copie ses '
                         'icônes et ses couleurs, elle ne peut pas se construire sans.')

    entrees = construire()
    html = page(entrees, vitrine)

    # ── Garde 1 : aucune couleur qui ne soit pas celle de la vitrine ────────
    # C'est par une couleur « à soi » que l'orange était entré, et qu'il avait
    # tenu trois semaines hors de portée du banc de charte.
    styles = ''.join(re.findall(r'<style>([\s\S]*?)</style>', html))
    etrangeres = sorted(c for c in set(re.findall(r'#[0-9A-Fa-f]{6}\b', styles))
                        if c.upper() not in vitrine.upper())
    if etrangeres:
        raise SystemExit('build_plan : couleur(s) absente(s) de vitrine.html — %s. '
                         'Le plan reprend la charte de la vitrine, il n\'en invente pas.'
                         % ', '.join(etrangeres))

    # ── Garde 2 : chaque rubrique a son icône, et chaque icône son symbole ──
    # « Aucune icône » est exactement ce qui a été signalé. On exige, on ne
    # suppose pas : un médaillon par carte, un <symbol> par icône employée.
    n_medaillons = html.count('class="pl-ico"')
    n_cartes = html.count('class="pl-c"')
    if n_medaillons != n_cartes:
        raise SystemExit('build_plan : %d médaillon(s) pour %d carte(s).'
                         % (n_medaillons, n_cartes))
    manquants = [u for u in set(re.findall(r'<use href="#(lc-[a-z0-9-]+)"', html))
                 if ('<symbol id="%s"' % u) not in html]
    if manquants:
        raise SystemExit('build_plan : symbole(s) non recopié(s) — %s.' % ', '.join(manquants))

    # ── Garde 3 : aucun trait coloré en bordure ────────────────────────────
    # Demande explicite du 16/09. Une bordure qui prend une couleur de famille
    # (`var(--trait)` ou `var(--fond)`) rouvrirait exactement ce qu'on a retiré.
    if re.search(r'border(-top|-left|-right|-bottom|-color)?\s*:[^;}]*var\(--(trait|fond)\)', styles):
        raise SystemExit('build_plan : une bordure porte une couleur de famille — '
                         'les cartes n\'ont que la bordure neutre de la vitrine.')

    dest = os.path.join(RACINE, 'plan.html')
    io.open(dest, 'w', encoding='utf-8', newline='\n').write(html)
    total = sum(e['n'] for e in entrees)
    print('plan.html écrit : %d rubriques, %d pages comptées, %d cartes, %d icônes de la vitrine'
          % (len(entrees), total, n_cartes, len(_UTILISEES)))
    for cle, nom, _, _ in PROFILS:
        n = sum(1 for e in entrees if cle in e['profils'])
        print('   %-14s %2d rubrique(s)' % (nom, n))
    return 0


if __name__ == '__main__':
    sys.exit(main())
