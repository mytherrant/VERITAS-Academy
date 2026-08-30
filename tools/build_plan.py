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
"""
import io
import os
import re
import sys
from datetime import date

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ── Ce que chaque zone du site contient, et QUI elle concerne ───────────────
#    Un service peut viser plusieurs profils : c'est le principe même de cette
#    page. « eleve » et « enseignant » sur les corrigés n'est pas une
#    redondance, c'est la raison d'être du classement.
ZONES = [
    # dossier        libellé                      description                                                     profils
    ('corriges',    'Corrigés des cahiers',      'Chaque exercice des cahiers VÉRITAS, corrigé et expliqué. Accès libre, sans compte.',        ['eleve', 'enseignant', 'parent']),
    ('oeuvres',     'Œuvres au programme',       'Analyse, résumé, personnages, mouvement littéraire et citations des œuvres étudiées.',       ['eleve', 'enseignant']),
    ('niveaux',     'Le programme par niveau',   'Ce qu\'il faut savoir en fin d\'année, classe par classe, de la 6ᵉ à la Terminale.',         ['eleve', 'parent', 'enseignant']),
    ('evaluations', 'Évaluations',               'De quoi situer son niveau et repérer ce qui manque avant l\'examen.',                        ['eleve', 'parent']),
    ('livrets',     'Livrets interactifs',       'Le cahier qu\'on remplit à l\'écran, avec correction immédiate.',                            ['eleve', 'parent']),
    ('cours',       'Cours rédigés',             'La leçon écrite, pour reprendre ce qui n\'a pas été compris en classe.',                     ['eleve', 'enseignant']),
    ('outils',      'Outils',                    'Calculs, conversions et aides de travail.',                                                  ['eleve', 'enseignant']),
    ('parcours',    'Parcours',                  'Un chemin de révision ordonné, plutôt qu\'une pile de documents.',                           ['eleve', 'parent']),
    ('decouvrir',   'Découvrir VÉRITAS',         'Ce que fait le centre, comment il travaille, ce qu\'il propose.',                            ['visiteur', 'parent', 'partenaire']),
    ('flash',       'Flash — accès par QR',      'Le code imprimé dans un cahier ouvre directement sa correction.',                             ['eleve', 'enseignant']),
    ('adopter',     'Adopter les cahiers',       'Pour un établissement qui veut équiper ses classes.',                                        ['enseignant', 'partenaire']),
]

# ── Les destinations qui ne sont pas des dossiers de pages ─────────────────
FIXES = [
    ('/plateforme/',        'Atelier de Français',        'Composer épreuves et leçons conformes au programme, à partir d\'un corpus vérifié.', ['enseignant']),
    ('/constellation.html', 'La Constellation VÉRITAS',   'Tout ce que le centre publie, réuni sur une seule carte.',                            ['visiteur', 'enseignant', 'parent']),
    ('/manuels.html',       'Les manuels',                'Les ouvrages du centre, leur sommaire et leur usage en classe.',                      ['enseignant', 'parent', 'partenaire']),
    ('/#tarifs',            'Abonnements et tarifs',      'Ce qui est gratuit, ce qui est payant, et ce que chaque formule ouvre.',              ['visiteur', 'parent', 'eleve', 'enseignant']),
    ('/app.html#boutique',  'Boutique',                   'Commander les cahiers et les manuels imprimés.',                                      ['parent', 'enseignant', 'partenaire']),
    ('/app.html#cagnotte',  'Cagnotte de scolarité',      'Réunir la scolarité à plusieurs, et suivre ce qui a été réglé.',                     ['parent', 'eleve']),
    ('/app.html#partenariat', 'Devenir partenaire',       'Libraires, inspecteurs, établissements : les façons de travailler avec le centre.',   ['partenaire']),
]

PROFILS = [
    ('eleve',      'Élèves',      'Réviser, s\'entraîner, comprendre'),
    ('parent',     'Parents',     'Suivre son enfant et l\'accompagner'),
    ('enseignant', 'Enseignants', 'Préparer, composer, publier'),
    ('partenaire', 'Partenaires', 'Diffuser, équiper, collaborer'),
    ('visiteur',   'Tout le monde', 'Ce que fait VÉRITAS'),
]


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
    for dossier, titre, desc, profils in ZONES:
        n = compter(dossier)
        if n == 0:
            # Une zone vide n'est pas annoncée : mieux vaut une rubrique
            # absente qu'un lien vers une page qui n'existe pas.
            continue
        e = {'url': '/' + dossier + '/', 'titre': titre,
             'desc': desc, 'profils': profils, 'n': n}
        # ── SANS INDEX, UNE ZONE EST UN CUL-DE-SAC ─────────────────────────
        # /corriges/ mène à ses sept niveaux, qui mènent chacun à leurs pages :
        # les 89 corrigés sont donc atteignables en trois clics. Mais
        # /evaluations/ et /cours/ n'ont AUCUN index — ouvrir le dossier ne
        # donne rien, et leurs pages restent hors d'atteinte quoi qu'on
        # clique. Pour ces zones-là, le plan liste les pages UNE À UNE.
        if not os.path.isfile(os.path.join(RACINE, dossier, 'index.html')):
            e['pages'] = pages_suivies(dossier)
        entrees.append(e)
    for url, titre, desc, profils in FIXES:
        entrees.append({'url': url, 'titre': titre, 'desc': desc,
                        'profils': profils, 'n': 0})
    return entrees


def carte(e):
    compteur = ('<span class="pl-n">' + str(e['n']) + ' page'
                + ('s' if e['n'] > 1 else '') + '</span>') if e['n'] else ''
    # Les zones sans index déplient leurs pages : sans cela, cliquer sur la
    # rubrique ouvrirait un dossier qui ne répond rien.
    detail = ''
    if e.get('pages'):
        detail = ('<span class="pl-l">'
                  + ''.join('<a href="' + esc(p['url']) + '">' + esc(p['titre']) + '</a>'
                            for p in e['pages'])
                  + '</span>')
        return ('<div class="pl-c pl-c-o">'
                '<span class="pl-t">' + esc(e['titre']) + compteur + '</span>'
                '<span class="pl-d">' + esc(e['desc']) + '</span>'
                + detail + '</div>')
    return (
        '<a class="pl-c" href="' + esc(e['url']) + '">'
        '<span class="pl-t">' + esc(e['titre']) + compteur + '</span>'
        '<span class="pl-d">' + esc(e['desc']) + '</span>'
        '<span class="pl-go">Ouvrir &rarr;</span>'
        '</a>'
    )


def page(entrees):
    total = sum(e['n'] for e in entrees)
    blocs = []
    for cle, nom, sous in PROFILS:
        lot = [e for e in entrees if cle in e['profils']]
        if not lot:
            continue
        blocs.append(
            '<section class="pl-s" id="' + cle + '">'
            '<h2>' + esc(nom) + '</h2>'
            '<p class="pl-sub">' + esc(sous) + '</p>'
            '<div class="pl-g">' + ''.join(carte(e) for e in lot) + '</div>'
            '</section>')

    nav = ''.join('<a href="#' + c + '">' + esc(n) + '</a>'
                  for c, n, _ in PROFILS
                  if any(c in e['profils'] for e in entrees))

    return """<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Plan du site — tout VÉRITAS, classé par profil</title>
<meta name="description" content="Corrigés, œuvres au programme, cours, évaluations, livrets et outils du Centre VÉRITAS, rangés selon que vous êtes élève, parent, enseignant ou partenaire.">
<link rel="canonical" href="https://veritas-school.com/plan.html">
<meta property="og:title" content="Plan du site — tout VÉRITAS, classé par profil">
<meta property="og:description" content="Tout ce que publie le Centre VÉRITAS, rangé par profil : élève, parent, enseignant, partenaire.">
<meta property="og:url" content="https://veritas-school.com/plan.html">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root{ --bleu:#1E499B; --profond:#001136; --encre:#4D5163;
         --ligne:#E4E9F2; --fond:#FAFBFE; --or:#C2410C; }
  *{box-sizing:border-box}
  body{margin:0;background:#fff;color:var(--encre);
       font-family:Poppins,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
       font-size:16px;line-height:1.62;-webkit-font-smoothing:antialiased}
  .pl-w{max-width:1080px;margin:0 auto;padding:0 20px}
  header.pl-h{padding:46px 0 10px}
  header.pl-h a.pl-logo{color:var(--bleu);font-weight:700;text-decoration:none;font-size:15px}
  h1{font-size:34px;line-height:1.22;color:var(--profond);font-weight:600;margin:18px 0 10px}
  .pl-intro{font-size:16.5px;max-width:66ch}
  .pl-nav{display:flex;gap:9px;flex-wrap:wrap;margin:24px 0 8px}
  .pl-nav a{font-size:13px;font-weight:600;color:var(--bleu);text-decoration:none;
            border:1px solid var(--ligne);border-radius:100px;padding:8px 15px;background:#fff}
  .pl-nav a:hover{border-color:var(--bleu)}
  .pl-s{padding:34px 0 6px;border-top:1px solid var(--ligne);margin-top:30px}
  .pl-s h2{font-size:23px;color:var(--profond);font-weight:600;margin:0}
  .pl-sub{margin:4px 0 18px;font-size:14.5px;color:#6B7A99}
  .pl-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(272px,1fr));gap:14px}
  .pl-c{display:flex;flex-direction:column;gap:6px;padding:17px 18px;background:var(--fond);
        border:1px solid var(--ligne);border-radius:12px;text-decoration:none;
        transition:box-shadow .16s,transform .16s}
  .pl-c:hover{box-shadow:0 12px 26px rgba(0,17,54,.09);transform:translateY(-2px)}
  .pl-t{font-weight:600;color:var(--profond);font-size:15.5px;display:flex;
        align-items:baseline;gap:8px;flex-wrap:wrap}
  .pl-n{font-size:11.5px;font-weight:600;color:var(--bleu);background:#EAF0FA;
        border-radius:100px;padding:2px 9px}
  .pl-d{font-size:14px;color:var(--encre);line-height:1.55}
  .pl-go{margin-top:auto;padding-top:8px;font-size:13px;font-weight:600;color:var(--or)}
  .pl-c-o{cursor:default}
  .pl-c-o:hover{box-shadow:none;transform:none}
  .pl-l{display:flex;flex-direction:column;gap:5px;margin-top:8px;padding-top:9px;
        border-top:1px solid var(--ligne)}
  .pl-l a{font-size:13.5px;color:var(--bleu);text-decoration:none;line-height:1.45}
  .pl-l a:hover{text-decoration:underline}
  footer.pl-f{margin:46px 0 34px;padding-top:20px;border-top:1px solid var(--ligne);
              font-size:13.5px;color:#6B7A99}
  footer.pl-f a{color:var(--bleu)}
  @media (max-width:620px){ h1{font-size:27px} .pl-g{grid-template-columns:1fr} }
</style>
</head>
<body>
<div class="pl-w">
  <header class="pl-h">
    <a class="pl-logo" href="/">&larr; Centre VÉRITAS</a>
    <h1>Tout VÉRITAS, rangé selon qui vous êtes</h1>
    <p class="pl-intro">Le centre publie __TOTAL__ pages en accès libre : corrigés,
      œuvres au programme, cours, évaluations et outils. Elles sont ici classées
      par profil — un même service peut vous concerner à plusieurs titres, et
      il apparaît alors sous chacun.</p>
    <nav class="pl-nav">__NAV__</nav>
  </header>
  __BLOCS__
  <footer class="pl-f">
    Page mise à jour le __DATE__ — les compteurs se recomptent depuis les pages
    publiées. &nbsp;·&nbsp; <a href="/">Accueil</a> &nbsp;·&nbsp;
    <a href="/plateforme/">Atelier de Français</a>
  </footer>
</div>
</body>
</html>
""".replace('__TOTAL__', str(total)) \
   .replace('__NAV__', nav) \
   .replace('__BLOCS__', ''.join(blocs)) \
   .replace('__DATE__', date.today().strftime('%d/%m/%Y'))


def main():
    entrees = construire()
    html = page(entrees)
    dest = os.path.join(RACINE, 'plan.html')
    io.open(dest, 'w', encoding='utf-8', newline='\n').write(html)
    total = sum(e['n'] for e in entrees)
    print('plan.html écrit : %d rubriques, %d pages comptées' % (len(entrees), total))
    for cle, nom, _ in PROFILS:
        n = sum(1 for e in entrees if cle in e['profils'])
        print('   %-14s %2d rubrique(s)' % (nom, n))
    return 0


if __name__ == '__main__':
    sys.exit(main())
