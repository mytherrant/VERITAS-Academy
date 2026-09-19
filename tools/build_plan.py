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
</head>
<body>
__SPRITE__
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
  <footer class="bot">
    Page mise à jour le __DATE__ — les compteurs se recomptent depuis les pages
    publiées. &nbsp;·&nbsp; <a href="/">Accueil</a> &nbsp;·&nbsp;
    <a href="/plateforme/">Atelier de Français</a> &nbsp;·&nbsp;
    <a href="__SITE__/#tarifs">Abonnements</a>
  </footer>
</div>
</body>
</html>
""".replace('__CSS__', CSS_CARTES) \
   .replace('__FAMILLES__', familles) \
   .replace('__SPRITE__', lutins) \
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
