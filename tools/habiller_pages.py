#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VÉRITAS — habillage de la vitrine sur toutes les pages statiques
================================================================

Jacques : « finalise le reskin », puis « les mêmes icônes dans le rond
centré, l'alternance de couleurs, les effets exactement comme sur la
vitrine ».

plan.html et constellation.html ont servi de pilote (commit 498ed99) : barre
de la vitrine (logo, rubriques, Plus, Connexion, burger), bandeau d'annonce,
bulles flottantes (thème, traducteur, Prof. Ambassa) et pied complet. Ce
script étend ce même habillage aux ~200 pages statiques qui portent
veritas-pages.css ou veritas-refonte.css (corrigés, livrets, niveaux, œuvres,
ressources, outils, cours, légal, espaces élève / enseignant…).

UNE SEULE SOURCE. Les blocs d'habillage ne sont PAS recopiés ici : ils sont
lus dans tools/build_plan.py (NAV_VITRINE, PROMO_VITRINE, FOOTER_VITRINE,
WIDGETS_VITRINE, CSS_CHROME), eux-mêmes recopiés de vitrine.html. Les
symboles d'icônes viennent de vitrine.html.

POURQUOI UNE PASSE APRÈS COUP, ET PAS DANS CHAQUE GÉNÉRATEUR. Ces pages
sortent de cinq générateurs différents et de pages écrites à la main (voir
l'en-tête de assets/veritas-medaillons.js). Une passe idempotente les couvre
toutes, et la CI la rejoue sur deploy/ : une page régénérée sans habillage
ne peut pas partir en production nue.

CE QUE FAIT LA PASSE, page par page (idempotente — balises
<!--vrt-habillage:…--> … <!--/vrt-habillage:…-->) :
  · <head>  : feuille assets/veritas-habillage.css + VRT_DATA minimal
              (citations, thème sombre) lu dans vitrine.html ;
  · début   : barre + bandeau de la vitrine ;
  · en-tête : la simple barre de marque (« Centre VÉRITAS », sans titre) est
              retirée — la barre de la vitrine la remplace. Un en-tête qui
              porte le <h1> de la page est GARDÉ : c'est son titre ;
  · fin     : l'ancien pied est remplacé par celui de la vitrine, puis les
              bulles flottantes et assets/vitrine.js ;
  · assets/veritas-medaillons.js est ajouté s'il manque (médaillons ronds).

Produit aussi :
  · assets/veritas-habillage.css (CSS de la barre + cartes « vitrine ») ;
  · les symboles lc-* ajoutés à assets/veritas-icons.svg.

Usage :
    python tools/habiller_pages.py            # dépôt
    python tools/habiller_pages.py deploy     # dossier de déploiement (CI)
    python tools/habiller_pages.py --controle # échoue si une page n'est pas à jour
"""
import importlib.util
import json
import os
import re
import subprocess
import sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Pages qui portent DÉJÀ l'habillage, écrit par leur propre générateur.
DEJA_HABILLEES = {'vitrine.html', 'index.html', 'plan.html', 'constellation.html'}

# Familles concernées : on reconnaît une page statique du site à sa feuille.
FEUILLES = ('veritas-pages.css', 'veritas-refonte.css')

# Dossiers jamais touchés (maquette, sources, tests, outils internes).
EXCLUS = ('Refonte site', 'chunks/', 'tests/', 'Manuel_EST/', 'graphify',
          'promo/', 'node_modules/', '.claude/', 'campus/', 'deploy/')


def charger_build_plan():
    chemin = os.path.join(RACINE, 'tools', 'build_plan.py')
    spec = importlib.util.spec_from_file_location('build_plan', chemin)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


BP = charger_build_plan()


# ── Icônes ──────────────────────────────────────────────────────────────────
SPRITE = os.path.join(RACINE, 'assets', 'veritas-icons.svg')
SPRITE_DEB = '<!-- vrt-habillage:lucide — recopié de vitrine.html par tools/habiller_pages.py -->'
SPRITE_FIN = '<!-- /vrt-habillage:lucide -->'


def symboles_vitrine(vitrine):
    """Tous les <symbol> lc-* et pay-* de la vitrine, dans leur ordre."""
    return re.findall(r'<symbol id="(?:lc|pay)-[a-z0-9-]+"[\s\S]*?</symbol>', vitrine)


def maj_sprite(vitrine, ecrire=True):
    """Recopie les symboles de la vitrine dans le sprite externe partagé.

    Les blocs d'habillage référencent `#lc-…` en LOCAL ; on les pointe sur
    /assets/veritas-icons.svg plutôt que de coller ~80 symboles dans chacune
    des 200 pages : un seul fichier, mis en cache une fois."""
    s = open(SPRITE, encoding='utf-8').read()
    s = re.sub(re.escape(SPRITE_DEB) + r'[\s\S]*?' + re.escape(SPRITE_FIN) + r'\n?', '', s)
    bloc = SPRITE_DEB + '\n' + '\n'.join(symboles_vitrine(vitrine)) + '\n' + SPRITE_FIN + '\n'
    i = s.rstrip().rfind('</svg>')
    neuf = s[:i] + bloc + s[i:]
    if neuf != open(SPRITE, encoding='utf-8').read():
        if ecrire:
            open(SPRITE, 'w', encoding='utf-8', newline='\n').write(neuf)
        return True
    return False


# ── Blocs ───────────────────────────────────────────────────────────────────
def absolu(html):
    """Les blocs recopiés visent des chemins RELATIFS à la racine
    (assets/…, corriges/, app.html#…) : justes sur plan.html, faux depuis
    /corriges/3e/. On les rend absolus, et les icônes locales pointent sur
    le sprite partagé."""
    def rep(m):
        attr, url = m.group(1), m.group(2)
        if re.match(r'^(/|#|https?:|mailto:|tel:|data:|javascript:|$)', url):
            return m.group(0)
        return '%s="/%s"' % (attr, url)
    html = re.sub(r'\b(href|src)="([^"]*)"', rep, html)
    html = re.sub(r'href="#((?:lc|pay)-[a-z0-9-]+)"', r'href="/assets/veritas-icons.svg#\1"', html)
    return html


def marquer(html, balise):
    """Ajoute la classe vrt-hab à la PREMIÈRE balise ouvrante `balise`.
    Elle sert d'ancrage aux exemptions de veritas-habillage.css (graisses,
    pied des pages « refonte »)."""
    def rep(m):
        ouv = m.group(0)
        if 'class="' in ouv:
            return ouv.replace('class="', 'class="vrt-hab ', 1)
        return ouv[:-1] + ' class="vrt-hab">'
    return re.sub(r'<' + balise + r'\b[^>]*>', rep, html, count=1)


NAV = marquer(absolu(BP.NAV_VITRINE), 'nav')
PROMO = marquer(absolu(BP.PROMO_VITRINE), 'div')
PIED = marquer(absolu(BP.FOOTER_VITRINE), 'footer')
BULLES = marquer(absolu(BP.WIDGETS_VITRINE), 'div')


def donnees_vitrine(vitrine):
    """Les seules clés de VRT_DATA dont vitrine.js a besoin hors de
    l'accueil : les citations (bulle) et la feuille du thème sombre
    (bouton lune). Sans elles, deux boutons de la colonne flottante
    seraient muets."""
    i = vitrine.find('window.VRT_DATA=')
    j = vitrine.find('</script>', i)
    src = vitrine[i:j]
    js = ("var window={};" + src + ";process.stdout.write(JSON.stringify("
          "{citations:window.VRT_DATA.citations,themeSombre:window.VRT_DATA.themeSombre}))")
    out = subprocess.check_output(['node', '-e', js])
    d = json.loads(out.decode('utf-8'))
    # `</` ne doit jamais apparaître dans un <script> en ligne.
    return json.dumps(d, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')


# ── Feuille partagée ────────────────────────────────────────────────────────
CSS_CARTES = r"""
/* ════════════════════════════════════════════════════════════════════════
   EXEMPTIONS — l'habillage garde ses graisses et sa mise en page
   ════════════════════════════════════════════════════════════════════════
   veritas-pages.css pose `font-weight:400 !important` sur tous les span, div
   et a : la barre et le pied recopiés de la vitrine perdaient leurs 500/600
   (règle exemptée des blocs .vrt-hab dans veritas-pages.css). veritas-refonte.css
   habille TOUT <footer> (centré, 13 px, fond, rayon) : on rend au pied de la
   vitrine sa propre mise en page. */
footer.vrt-hab{padding:0;text-align:left;font-size:16px;border:0;border-radius:0;
  box-shadow:none;animation:none}
footer.vrt-hab a{text-decoration:none}
footer.vrt-hab a:hover{text-decoration:none}
footer.vrt-hab p{color:inherit}
nav.vrt-hab{animation:none;border-radius:0;padding:0}
nav.vrt-hab a:hover{text-decoration:none}
.vrt-hab svg{vertical-align:initial}
.vrt-hab h2,.vrt-hab h3{color:inherit}
nav.vrt-hab a,div.vrt-hab a,footer.vrt-hab a{text-decoration:none}

/* Un tableau large (tarifs, cookies, calendrier) faisait glisser TOUTE la
   page sous le pouce — mesuré à 405 et 451 px sur un écran de 390, déjà avant
   l'habillage. Il défile désormais seul, dans sa largeur. */
@media (max-width:700px){
  body table:not(.vrt-hab table){display:block;max-width:100%;overflow-x:auto}
}

/* ════════════════════════════════════════════════════════════════════════
   CARTES — la carte de la vitrine, cote pour cote
   ════════════════════════════════════════════════════════════════════════
   Relevé sur vitrine.html (« Quelqu'un suit votre enfant ») : fond blanc,
   filet #E4E9F2, rayon 14, ombre 0 4px 14px, médaillon ROND de 42 px centré
   au-dessus du titre (fond pâle, icône Lucide de la teinte), six teintes en
   rotation. Survol : la carte se soulève de 4 px, l'ombre s'élargit — sans
   trait coloré (ni barre latérale, ni bordure teintée).
   Les deux familles de pages sont couvertes : .card + <h3> (veritas-pages)
   et .tile + <strong> (veritas-refonte). Le médaillon est posé par
   assets/veritas-medaillons.js, qui écrit la teinte dans data-vm. */
/* Fond blanc en !important : veritas-refonte.css teinte une tuile sur deux
   (`.grid > .tile:nth-child(even)`) — la vitrine alterne la couleur des
   MÉDAILLONS, pas celle des cartes. Une carte dont le fond est écrit en ligne
   (tuile d'appel sombre) garde le sien. */
:root body .card:not([style*="background"]),:root body .tile:not([style*="background"]){
  background:#fff!important}
:root body .card,:root body .tile{
  border:1px solid #E4E9F2;border-radius:14px;
  box-shadow:0 4px 14px rgba(0,17,54,.05);
  transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
:root body .card::before,:root body .card::after,
:root body .tile::before,:root body .tile::after{display:none}
/* Le soulèvement va aux cartes qu'on CLIQUE (lien, ou carte courte à
   médaillon). Une carte qui porte une liste de téléchargements ou un
   formulaire est un panneau de travail : elle ne bouge pas sous la souris. */
:root body a.card:hover,:root body a.tile:hover,
:root body :is(.card,.tile):has(.ico):not(:has(ul,ol,table,details,.dl,form,input)):hover{
  transform:translateY(-4px);box-shadow:0 12px 26px rgba(0,17,54,.09);
  border-color:#E4E9F2;text-decoration:none}
:root body :is(.card,.tile):has(.ico){text-align:center}
:root body :is(.card,.tile):has(.ico) :is(ul,ol,table,details,pre,.dl){text-align:left}
:root body :is(.card,.tile) > :is(h3,h2,h4,strong){color:#001136}

/* `!important` imposé : veritas-pages.css fixe l'ANCIEN médaillon (rond blanc
   cerclé de couleur) en !important. À importance égale, c'est la spécificité
   qui tranche — celle-ci l'emporte. */
:root body :is(.card,.tile) .ico{
  display:flex!important;align-items:center;justify-content:center;
  width:42px!important;height:42px!important;border-radius:50%!important;border:0!important;
  margin:0 auto 13px!important;
  background:var(--vm-fond,#DBE8FE)!important;color:var(--vm-trait,#1E499B)!important;
  box-shadow:none!important;transition:transform .18s cubic-bezier(.34,1.56,.64,1)}
:root body :is(.card,.tile) .ico svg{width:20px!important;height:20px!important;vertical-align:0;color:inherit!important}
:root body :is(a.card,a.tile,.card:has(.ico):not(:has(ul,ol,table,details,.dl,form,input)),.tile:has(.ico):not(:has(ul,ol,table,details,.dl,form,input))):hover .ico{transform:scale(1.08) rotate(-4deg)}
.ico[data-vm="bleu"]    {--vm-fond:#DBE8FE;--vm-trait:#1E499B}
.ico[data-vm="sarcelle"]{--vm-fond:#E3F1EE;--vm-trait:#0E7C86}
.ico[data-vm="vert"]    {--vm-fond:#E7F7EC;--vm-trait:#007E11}
.ico[data-vm="violet"]  {--vm-fond:#EEE9F8;--vm-trait:#5B4FA8}
.ico[data-vm="rose"]    {--vm-fond:#FBE9F1;--vm-trait:#B03A6E}
.ico[data-vm="brique"]  {--vm-fond:#FFF3E4;--vm-trait:#A84200}
:root body :is(.card,.tile) .ico.sur-sombre{--vm-fond:rgba(255,255,255,.14);--vm-trait:#fff}
@media (prefers-reduced-motion:reduce){
  :root body .card,:root body .tile,:root body :is(.card,.tile) .ico{transition:none}
  :root body :is(.card,.tile):hover,:root body :is(.card,.tile):hover .ico{transform:none}
}

/* ════════════════════════════════════════════════════════════════════════
   THÈME SOMBRE — le bouton lune de la colonne flottante
   ════════════════════════════════════════════════════════════════════════
   vitrine.js pose data-vrt-theme="sombre" sur <html> et injecte la feuille
   sombre de la vitrine, qui ne connaît que les styles EN LIGNE : elle
   assombrit la barre et le pied, pas le corps des pages. Sans ces règles le
   bouton rendait une page à moitié sombre. */
html[data-vrt-theme="sombre"] body{background:#0B1530;color:#DCE3F2}
html[data-vrt-theme="sombre"] body :is(main,.wrap,section,article){background-color:transparent}
html[data-vrt-theme="sombre"] body :is(h1,h2,h3,h4,strong,b){color:#F2F5FC}
html[data-vrt-theme="sombre"] body :is(p,li,td,th,dd,small,.note){color:#C4CDE0}
html[data-vrt-theme="sombre"] body :is(.card,.tile):not([style*="background"]){background:#14224A!important}
html[data-vrt-theme="sombre"] body :is(.card,.tile){border-color:#24345F;box-shadow:0 4px 14px rgba(0,0,0,.25)}
html[data-vrt-theme="sombre"] body :is(.card,.tile) :is(a.dl,.dl){background:transparent;border-color:#24345F}
html[data-vrt-theme="sombre"] body :is(.card,.tile) > :is(h3,h2,h4,strong){color:#F2F5FC}
html[data-vrt-theme="sombre"] body a:not(.vrt-hab a){color:#9CC0FF}
"""


def ecrire_css(ecrire=True):
    entete = ("/* VÉRITAS — habillage de la vitrine pour les pages statiques.\n"
              "   FICHIER GÉNÉRÉ par tools/habiller_pages.py : ne pas éditer à la main.\n"
              "   Barre, bandeau, bulles et pied : CSS_CHROME de tools/build_plan.py,\n"
              "   recopié de vitrine.html. Cartes et médaillons : voir plus bas. */\n")
    css = entete + BP.CSS_CHROME + '\n' + CSS_CARTES
    chemin = os.path.join(RACINE, 'assets', 'veritas-habillage.css')
    ancien = open(chemin, encoding='utf-8').read() if os.path.exists(chemin) else ''
    if css != ancien:
        if ecrire:
            open(chemin, 'w', encoding='utf-8', newline='\n').write(css)
        return True
    return False


# ── Pages ───────────────────────────────────────────────────────────────────
def bloc(nom, contenu):
    return '<!--vrt-habillage:%s-->\n%s\n<!--/vrt-habillage:%s-->' % (nom, contenu, nom)


def retirer_blocs(s):
    # Chaque bloc est inséré suivi d'UN saut de ligne, et retiré avec lui :
    # c'est ce qui rend la passe idempotente octet pour octet.
    return re.sub(r'<!--vrt-habillage:([a-z]+)-->[\s\S]*?<!--/vrt-habillage:\1-->\n', '', s)


def version(s):
    m = re.search(r'/assets/veritas-(?:pages|refonte)\.css\?v=([0-9.]+)', s)
    return m.group(1) if m else BP.VER


def entete_de_marque(h):
    """Un <header> qui n'est qu'une barre de marque : pas de titre, un lien
    vers l'accueil. La barre de la vitrine le remplace."""
    return (not re.search(r'<h[1-3]\b', h)) and len(re.sub(r'<[^>]+>', '', h).strip()) < 60 \
        and re.search(r'<a\b', h)


def habiller(s, donnees):
    s = retirer_blocs(s)
    v = version(s)

    # <head>
    tete = ('<link rel="stylesheet" href="/assets/veritas-habillage.css?v=%s">\n'
            '<script>window.VRT_DATA=window.VRT_DATA||%s;</script>') % (v, donnees)
    s = s.replace('</head>', bloc('tete', tete) + '\n</head>', 1)

    # Barre de marque seule → retirée (la barre de la vitrine la remplace).
    m = re.search(r'<header\b[^>]*>[\s\S]*?</header>', s)
    if m and entete_de_marque(m.group(0)):
        s = s[:m.start()] + s[m.end():]

    # Début du corps : après le sprite en ligne de la page s'il ouvre le body.
    mb = re.search(r'<body\b[^>]*>', s)
    pos = mb.end()
    ms = re.match(r'\s*<svg\b[^>]*>[\s\S]*?</svg>', s[pos:])
    if ms and 'position:absolute' in ms.group(0)[:300]:
        pos += ms.end()
    s = s[:pos] + bloc('barre', NAV + '\n' + PROMO) + '\n' + s[pos:]

    # Ancien pied → retiré (le dernier <footer> hors de nos blocs).
    pieds = list(re.finditer(r'<footer\b[^>]*>[\s\S]*?</footer>', s))
    pieds = [p for p in pieds if 'vrt-hab' not in p.group(0)[:200]]
    if pieds:
        p = pieds[-1]
        # Les scripts des pages visent parfois un élément de l'ancien pied :
        # `document.getElementById('y').textContent = …` (l'année) ouvre le
        # script principal de d/index.html et de livrets/prof.html — sans
        # cible, TOUT le script s'arrête sur la première ligne. On laisse à
        # la place un élément caché par identifiant. Hors des balises
        # vrt-habillage : il doit survivre aux passes suivantes.
        ids = re.findall(r'\bid="([^"]+)"', p.group(0))
        garde = ''.join('<span id="%s" hidden></span>' % i for i in ids)
        s = s[:p.start()] + garde + s[p.end():]

    # Fin du corps : pied, bulles, scripts.
    scripts = ''
    if 'veritas-medaillons.js' not in s:
        scripts += '<script src="/assets/veritas-medaillons.js?v=%s" defer></script>\n' % v
    scripts += '<script src="/assets/vitrine.js?v=%s" defer></script>' % v
    fin = PIED + '\n' + BULLES + '\n' + scripts
    i = s.rfind('</body>')
    s = s[:i] + bloc('pied', fin) + '\n' + s[i:]
    return s


def pages(base):
    liste = subprocess.check_output(
        ['git', '-c', 'core.quotepath=off', 'ls-files', '-z', '*.html'], cwd=RACINE
    ).decode('utf-8').split('\0') if base == RACINE else [
        os.path.relpath(os.path.join(d, f), base)
        for d, _, fs in os.walk(base) for f in fs if f.endswith('.html')]
    for rel in sorted(liste):
        if not rel or rel.replace(os.sep, '/').startswith(EXCLUS):
            continue
        if os.path.basename(rel) in DEJA_HABILLEES and os.path.dirname(rel) == '':
            continue
        chemin = os.path.join(base, rel)
        s = open(chemin, encoding='utf-8').read()
        if not any(f in s for f in FEUILLES) or '</body>' not in s:
            continue
        # Une page qui porte sa PROPRE barre de la vitrine (générateur) n'est pas retouchée.
        if 'id="vrtNav"' in retirer_blocs(s):
            continue
        yield rel, chemin, s


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    controle = '--controle' in sys.argv
    base = os.path.abspath(args[0]) if args else RACINE
    vitrine = open(os.path.join(RACINE, 'vitrine.html'), encoding='utf-8').read()
    donnees = donnees_vitrine(vitrine)

    a_jour = []
    if base == RACINE:
        if maj_sprite(vitrine, not controle):
            a_jour.append('assets/veritas-icons.svg')
        if ecrire_css(not controle):
            a_jour.append('assets/veritas-habillage.css')

    n = 0
    for rel, chemin, s in pages(base):
        neuf = habiller(s, donnees)
        n += 1
        # Garde : le corps de la page est intact, hormis ce qu'on remplace.
        if neuf.count('<h1') != s.count('<h1'):
            raise SystemExit('habiller_pages : %s — le nombre de <h1> a changé.' % rel)
        if neuf != s:
            a_jour.append(rel)
            if not controle:
                open(chemin, 'w', encoding='utf-8', newline='\n').write(neuf)

    if controle and a_jour:
        raise SystemExit('habiller_pages --controle : %d fichier(s) sans l\'habillage à jour, '
                         'dont %s. Lancer : python tools/habiller_pages.py'
                         % (len(a_jour), ', '.join(a_jour[:5])))
    print('habiller_pages : %d page(s) habillée(s), %d fichier(s) modifié(s).' % (n, len(a_jour)))


if __name__ == '__main__':
    main()
