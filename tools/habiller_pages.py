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
    python tools/habiller_pages.py --app      # la coquille de l'application seule
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

# Pages publiques SANS feuille partagée, habillées elles aussi (« habille
# tout sauf les cahiers », Jacques, 25/09/2026). Les cahiers — coquilles
# verrouillées, aperçus, feuilletages, guides de livrets — n'y sont PAS :
# leur écran appartient au cahier.
EN_PLUS = [re.compile(x) for x in (
    r'^(403|404|reset|admin-validation)\.html$',
    r'^evaluations/[^/]+\.html$',
    r'^campus/[^/]+\.html$',
    r'^plateforme/index\.html$',
    r'^livrets/mode-emploi\.html$',
    r'^seo/.+\.html$',
)]

# OUTILS DE TRAVAIL : l'écran appartient à la planche. Barre de la vitrine
# COMPACTE (58 px au lieu de 76) et NON collante — elle s'en va au premier
# défilement et rend toute la hauteur au travail ; ni bandeau d'annonce, ni
# bulles flottantes posées sur la planche (l'Atelier a déjà son thème et son
# Ambassa dans sa barre d'outils) ; le pied de la page n'est pas retiré.
OUTILS = [re.compile(x) for x in (
    r'^plateforme/index\.html$',
    r'^campus/(app|dashboard|documents|notes|onboarding)\.html$',
    r'^livrets/prof\.html$',
    r'^d/index\.html$',
    r'^admin-validation\.html$',
)]

# Dossiers jamais touchés (maquette, sources, tests, outils internes).
EXCLUS = ('Refonte site', 'chunks/', 'tests/', 'Manuel_EST/', 'graphify',
          'promo/', 'node_modules/', '.claude/', 'deploy/')


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
NAV_OUTIL = NAV.replace('class="vrt-hab"', 'class="vrt-hab vrt-outil"', 1)
assert NAV_OUTIL != NAV

# L'Atelier portait son propre bandeau de retour (« vrt-pont », collant,
# 44 px — 76 sur deux lignes au téléphone). La barre de la vitrine le
# remplace : deux barres empilées, c'est la planche qui rétrécit.
PONT_ATELIER = re.compile(r'<nav class="vrt-pont"[\s\S]*?</nav>\n?')
# 403, 404, reset.html : le <body> est une boîte FLEXIBLE qui centre un
# encadré. La barre et le pied y devenaient des voisins en ligne — la page
# faisait 622 px de large sur un écran de 390. On empile en colonne :
# barre en haut, encadré centré dans l'espace qui reste, pied en bas.
CSS_CORPS_FLEX = ('<style>'
                  'body{flex-direction:column!important;flex-wrap:nowrap!important;'
                  'align-items:center!important;padding:0 16px!important}'
                  'body>.vrt-hab{align-self:stretch;width:auto;max-width:none;flex:none;'
                  'margin-left:-16px;margin-right:-16px}'
                  'body>:not(.vrt-hab):not(script):not(style):not(svg){margin-top:auto;'
                  'margin-bottom:auto}'
                  'body>footer.vrt-hab{margin-top:48px}'
                  'body>div.vrt-hab:not([style*="position:fixed"]){margin-bottom:32px}'
                  '</style>')

# Pages seo/ (tools/build_seo.cjs) : le <body> lui-même est la colonne de
# lecture (max-width:760px, padding:24px). La barre et le pied y restaient
# encadrés, en retrait des bords. Ils sortent de la colonne jusqu'aux bords
# de l'écran ; le texte, lui, garde sa largeur de lecture.
CSS_CORPS_ETROIT = ('<style>'
                    'body{padding-top:0!important}'
                    'body>.vrt-hab:not([style*="position:fixed"]){'
                    'margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw)}'
                    'body>div.vrt-hab:not([style*="position:fixed"]){margin-bottom:24px}'
                    'body>footer.vrt-hab{margin-bottom:-24px}'
                    '</style>')

CSS_ATELIER = ('<style>'
               # Son petit pied (CGV, Support…) double celui de la vitrine.
               'footer[data-noprint="1"]:not(.vrt-hab){display:none!important}'
               # Le moteur fixe son hôte à la hauteur de l'écran, et la planche
               # déborde dessous : le pied posé après s'affichait PAR-DESSUS
               # le travail (mesuré : hôte 800 px, planche 1 708 px). L'hôte
               # prend désormais la hauteur de son contenu.
               '.sc-host,div:has(>.sc-host){height:auto!important;min-height:100vh}'
               '</style>')


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
    # Le programme passe par l'entrée standard, pas par `node -e` : sous Windows,
    # une ligne de commande plafonne à 32 767 caractères (WinError 206), et les
    # données de la vitrine les dépassent. Même résultat sur le runner Linux.
    out = subprocess.check_output(['node'], input=js.encode('utf-8'))
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

/* Les pages hors des deux familles ont leurs propres règles GÉNÉRIQUES :
   reset.html pose `button{padding:14px 24px}` sur tout bouton — la bulle de
   46 px du thème n'avait plus de place, et son icône tombait à 0 px de large.
   Un bouton de l'habillage qui n'écrit pas son padding n'en a aucun, et une
   icône ne se laisse jamais comprimer. */
.vrt-hab button:not([style*="padding"]){padding:0}
/* …sauf les rubriques du menu, qui tiennent leur padding de `.vmn-i` : les
   entrées en <button> (« Catalogue e-learning ») collaient au bord, 13 px
   plus à gauche que leurs voisines en <a> (mesuré le 27/10/2026). */
.vrt-hab button.vmn-i.vmn-i{padding:9px 12px}
.vrt-hab .vmn-mob button.vmn-i.vmn-i{padding:9px 13px}
.vrt-hab svg{flex-shrink:0}
/* Police de la vitrine sur tout l'habillage : sans elle, les liens du pied
   prenaient la police de la page (Times sur les épreuves imprimables). */
.vrt-hab{font-family:Poppins,system-ui,sans-serif}

/* Une épreuve, une fiche ou une évaluation qu'on imprime : le papier ne
   porte ni la barre, ni le pied, ni les bulles. */
@media print{.vrt-hab{display:none!important}}

/* ── OUTIL DE TRAVAIL (Atelier, Campus, console enseignant) ───────────────
   L'écran appartient à la planche. La barre de la vitrine y est compacte
   (58 px au lieu de 76) et NON collante : elle s'en va au premier
   défilement, et la barre d'outils de l'application reprend le haut de
   l'écran. Mesuré sur l'Atelier : l'ancien bandeau collant retenait 44 px
   en permanence sur ordinateur, 76 px sur téléphone (deux lignes). */
nav.vrt-outil{position:relative!important;height:58px!important;
  box-shadow:0 1px 0 #E6EAF2!important;z-index:60}
nav.vrt-outil img{width:36px!important;height:36px!important}
nav.vrt-outil a[href*="#connexion"]{padding:8px 18px!important}
nav.vrt-outil [aria-controls="vrtBurger"]{width:42px!important;height:42px!important}

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
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .card:not([style*="background"]),:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .tile:not([style*="background"]){
  background:#fff!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .card,:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .tile{
  border:1px solid #E4E9F2;border-radius:14px;
  box-shadow:0 4px 14px rgba(0,17,54,.05);
  transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .card::before,:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .card::after,
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .tile::before,:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .tile::after{display:none}
/* Le soulèvement va aux cartes qu'on CLIQUE (lien, ou carte courte à
   médaillon). Une carte qui porte une liste de téléchargements ou un
   formulaire est un panneau de travail : elle ne bouge pas sous la souris. */
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) a.card:hover,:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) a.tile:hover,
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile):has(.ico):not(:has(ul,ol,table,details,.dl,form,input)):hover{
  transform:translateY(-4px);box-shadow:0 12px 26px rgba(0,17,54,.09);
  border-color:#E4E9F2;text-decoration:none}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile):has(.ico){text-align:center}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile):has(.ico) :is(ul,ol,table,details,pre,.dl){text-align:left}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile) > :is(h3,h2,h4,strong){color:#001136}

/* `!important` imposé : veritas-pages.css fixe l'ANCIEN médaillon (rond blanc
   cerclé de couleur) en !important. À importance égale, c'est la spécificité
   qui tranche — celle-ci l'emporte. */
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile) .ico{
  display:flex!important;align-items:center;justify-content:center;
  width:42px!important;height:42px!important;border-radius:50%!important;border:0!important;
  margin:0 auto 13px!important;
  background:var(--vm-fond,#DBE8FE)!important;color:var(--vm-trait,#1E499B)!important;
  box-shadow:none!important;transition:transform .18s cubic-bezier(.34,1.56,.64,1)}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile) .ico svg{width:20px!important;height:20px!important;vertical-align:0;color:inherit!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(a.card,a.tile,.card:has(.ico):not(:has(ul,ol,table,details,.dl,form,input)),.tile:has(.ico):not(:has(ul,ol,table,details,.dl,form,input))):hover .ico{transform:scale(1.08) rotate(-4deg)}
.ico[data-vm="bleu"]    {--vm-fond:#DBE8FE;--vm-trait:#1E499B}
.ico[data-vm="sarcelle"]{--vm-fond:#E3F1EE;--vm-trait:#0E7C86}
.ico[data-vm="vert"]    {--vm-fond:#E7F7EC;--vm-trait:#007E11}
.ico[data-vm="violet"]  {--vm-fond:#EEE9F8;--vm-trait:#5B4FA8}
.ico[data-vm="rose"]    {--vm-fond:#FBE9F1;--vm-trait:#B03A6E}
.ico[data-vm="brique"]  {--vm-fond:#FFF3E4;--vm-trait:#A84200}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile) .ico.sur-sombre{--vm-fond:rgba(255,255,255,.14);--vm-trait:#fff}
@media (prefers-reduced-motion:reduce){
  :root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .card,:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .tile,:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile) .ico{transition:none}
  :root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile):hover,:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile):hover .ico{transform:none}
}

/* ════════════════════════════════════════════════════════════════════════
   THÈME SOMBRE — le bouton lune de la colonne flottante
   ════════════════════════════════════════════════════════════════════════
   vitrine.js pose data-vrt-theme="sombre" sur <html> et injecte la feuille
   sombre de la vitrine, qui ne connaît que les styles EN LIGNE : elle
   assombrit la barre et le pied, pas le corps des pages. Sans ces règles le
   bouton rendait une page à moitié sombre. */
:root[data-vrt-theme="sombre"]:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)){background:#0B1530;color:#DCE3F2}
:root[data-vrt-theme="sombre"]:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(main,.wrap,section,article){background-color:transparent}
:root[data-vrt-theme="sombre"]:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(h1,h2,h3,h4,strong,b){color:#F2F5FC}
:root[data-vrt-theme="sombre"]:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(p,li,td,th,dd,small,.note){color:#C4CDE0}
:root[data-vrt-theme="sombre"]:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile):not([style*="background"]){background:#14224A!important}
:root[data-vrt-theme="sombre"]:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile){border-color:#24345F;box-shadow:0 4px 14px rgba(0,0,0,.25)}
:root[data-vrt-theme="sombre"]:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile) :is(a.dl,.dl){background:transparent;border-color:#24345F}
:root[data-vrt-theme="sombre"]:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile) > :is(h3,h2,h4,strong){color:#F2F5FC}
:root[data-vrt-theme="sombre"]:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) a:not(.vrt-hab a){color:#9CC0FF}

/* ════════════════════════════════════════════════════════════════════════
   PUCES ET NUMÉROS — ceux de la vitrine (18/10/2026)
   ════════════════════════════════════════════════════════════════════════
   « Applique la même chose partout » (Jacques). Les pages statiques avaient
   une pastille de 7 px cerclée d'un halo, et des numéros qui ne tournaient
   que sur trois teintes. La vitrine coche ses listes d'un DISQUE PLEIN de
   22 px (coche blanche) et fait tourner six teintes. Une liste d'encadré
   garde la teinte de son encadré.
   25/10/2026 — « la même mise en forme professionnelle que lws.fr, en
   augmentant la police et en éclaircissant » (Jacques). La coche devient
   un trait vert SANS disque (masque SVG teinté par --vl), le texte passe à
   18 px (17 px au téléphone) en gris #5B6170, le gras en #3A4150, avec
   18 px entre deux éléments. Les encadrés gardent leur teinte (--vl) ; le
   thème sombre et l'encadré sombre .upsell gardent leurs couleurs. */
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ul:not([class]) > li{
  padding-left:40px;margin:0 0 20px;font-size:19px;line-height:1.8;letter-spacing:.005em}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ul:not([class]) > li:last-child{margin-bottom:0}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ul:not([class]){margin:18px 0 22px}
:root:not([data-vrt-theme="sombre"]):has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ul:not([class]) > li{color:#5B6170}
:root:not([data-vrt-theme="sombre"]):has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ul:not([class]) > li :is(strong,b){color:#1E499B;font-weight:600}
:root:not([data-vrt-theme="sombre"]):has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.upsell,.vabo-inline) ul:not([class]) > li{color:inherit}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ul:not([class]) > li::before{
  width:24px!important;height:24px!important;left:0!important;top:.2em!important;border-radius:0!important;
  background:var(--vl,#1FA53A)!important;box-shadow:none!important;
  -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='3.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E") center/24px 24px no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='3.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E") center/24px 24px no-repeat}
/* Thème sombre : les cartes d'œuvres (.works, fond blanc en ligne) et les
   bandeaux de titres pastel gardaient leur fond clair sous un texte devenu
   blanc — illisibles (relevé le 25/10/2026, antérieur à cette retouche). */
:root[data-vrt-theme="sombre"]:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .works a{background:#14224A!important;border-color:#24345F!important}
:root[data-vrt-theme="sombre"]:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .works span{color:#9FB0CF!important}
:root[data-vrt-theme="sombre"]:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) h2{background-color:rgba(255,255,255,.06)!important;color:#F2F5FC!important}
@media (max-width:600px){
  :root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ul:not([class]) > li{font-size:18px;padding-left:36px;margin-bottom:16px}
  :root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ul:not([class]) > li::before{width:22px!important;height:22px!important;-webkit-mask-size:22px 22px;mask-size:22px 22px}}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .retenir-box ul:not([class]) > li::before{--vl:#007E11}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .obj-box ul:not([class]) > li::before{--vl:#0E7C86}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .corpus-box ul:not([class]) > li::before{--vl:#5B4FA8}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.upsell,.vabo-inline) ul:not([class]) > li::before{--vl:#A84200}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ol:not([class]) > li::before{
  background-color:#1E499B!important;font-weight:600!important;box-shadow:none!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ol:not([class]) > li:nth-child(6n+2)::before{background-color:#0E7C86!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ol:not([class]) > li:nth-child(6n+3)::before{background-color:#007E11!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ol:not([class]) > li:nth-child(6n+4)::before{background-color:#5B4FA8!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ol:not([class]) > li:nth-child(6n+5)::before{background-color:#B03A6E!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ol:not([class]) > li:nth-child(6n+6)::before{background-color:#A84200!important}

/* ════════════════════════════════════════════════════════════════════════
   LECTURE « LWS » — fond blanc, texte plus grand, téléphone rempli (25/10/2026)
   ════════════════════════════════════════════════════════════════════════
   « Fond blanc, taille de police augmentée, plus captivant, écran téléphone
   bien rempli et équilibré » (Jacques, captures de lws.fr). Le corps des
   pages passe en blanc ; le texte courant à 18 px (17,5 px au téléphone) en
   gris #5B6170, les titres plus grands. Au téléphone, les cartes perdent
   cadre et marge intérieure : la colonne de texte gagne ~50 px de large au
   lieu de flotter dans trois cadres emboîtés. Thème sombre inchangé. */
:root:not([data-vrt-theme="sombre"]):has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)){background:#fff}
:root:not([data-vrt-theme="sombre"]):has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(main,.wrap){background:transparent}
:root:not([data-vrt-theme="sombre"]):has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) > p{font-size:19px;line-height:1.85;color:#5B6170;margin:0 0 20px}
:root:not([data-vrt-theme="sombre"]):has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) > p :is(strong,b){color:#1E499B;font-weight:600}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) h1{font-size:clamp(28px,4.2vw,36px);line-height:1.22;letter-spacing:-.01em}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) h2{font-size:clamp(22px,3vw,26px);line-height:1.3;margin-top:34px}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) h3{font-size:clamp(19px,2.4vw,21px);line-height:1.35}
@media (max-width:600px){
  :root:not([data-vrt-theme="sombre"]):has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .wrap{padding-left:18px!important;padding-right:18px!important}
  :root:not([data-vrt-theme="sombre"]):has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .wrap .card{background:transparent!important;border:0!important;box-shadow:none!important;padding:6px 0 18px!important;border-radius:0!important}
  :root:not([data-vrt-theme="sombre"]):has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) > p{font-size:18px}
  :root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) h2{margin-top:30px}
}

/* 25/10/2026, suite — « Justifie les textes, centre les icônes, augmente la
   police. Utilise les gras, les couleurs, les puces, pastilles, numérotation
   colorées » (Jacques). Texte justifié AVEC césure (pages en lang="fr") :
   sans elle, une colonne de 354 px se trouait de grands blancs. Les titres
   de section posent leur icône centrée AU-DESSUS du titre, comme les blocs
   de lws.fr. Les coches d'une liste de premier niveau tournent sur les six
   teintes de la vitrine ; une liste d'encadré garde la teinte de son encadré. */
/* 25/10/2026, suite : « si la justification dérange, tu laisses » (Jacques).
   Elle reste sur les PARAGRAPHES d'écran large, où la ligne est assez longue
   pour ne pas se trouer ; listes et téléphone restent alignés à gauche. */
@media (min-width:601px){
  :root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) > p{text-align:justify;-webkit-hyphens:auto;hyphens:auto;hyphenate-limit-chars:7 3 3}}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) :is(ul,ol):not([class]) > li{text-align:left}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) h2{flex-direction:column!important;align-items:center!important;justify-content:center!important;text-align:center!important;gap:10px!important;padding-top:18px!important;padding-bottom:16px!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) h2 > svg.vi{box-sizing:border-box!important;width:60px!important;height:60px!important;padding:14px!important;margin:0!important;flex:none;border-radius:50%!important;border:3px solid var(--vh,#1E499B)!important;background:#fff!important;color:#001136!important;stroke-width:1.6}
:root[data-vrt-theme="sombre"]:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) h2 > svg.vi{background:transparent!important;color:#F2F5FC!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) h2:nth-of-type(6n+2) > svg.vi{--vh:#A84200}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) h2:nth-of-type(6n+3) > svg.vi{--vh:#007E11}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) h2:nth-of-type(6n+4) > svg.vi{--vh:#5B4FA8}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) h2:nth-of-type(6n+5) > svg.vi{--vh:#B03A6E}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) h2:nth-of-type(6n+6) > svg.vi{--vh:#0E7C86}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) > ul:not([class]) > li:nth-child(6n+2)::before{--vl:#1E499B}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) > ul:not([class]) > li:nth-child(6n+3)::before{--vl:#0E7C86}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) > ul:not([class]) > li:nth-child(6n+4)::before{--vl:#5B4FA8}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) > ul:not([class]) > li:nth-child(6n+5)::before{--vl:#B03A6E}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) > ul:not([class]) > li:nth-child(6n+6)::before{--vl:#A84200}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ol:not([class]) > li{font-size:19px;line-height:1.8;margin:0 0 20px;padding-left:46px}
:root:not([data-vrt-theme="sombre"]):has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ol:not([class]) > li{color:#5B6170}
:root:not([data-vrt-theme="sombre"]):has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ol:not([class]) > li :is(strong,b){color:#1E499B;font-weight:600}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ol:not([class]) > li::before{width:30px!important;height:30px!important;line-height:30px!important;font-size:15px!important;top:.05em!important;color:#fff!important;border-radius:50%!important;text-align:center!important}
@media (max-width:600px){
  :root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ol:not([class]) > li{font-size:18px;padding-left:42px}
  :root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) ol:not([class]) > li::before{width:28px!important;height:28px!important;line-height:28px!important;font-size:14px!important}
}

/* 25/10/2026 — « Harmonise le système des icônes et pictogrammes, centre-
   les, et augmente un peu la taille des textes secondaires » (Jacques,
   capture de la vitrine). UN SEUL SYSTÈME : l'anneau de la vitrine — rond
   blanc, filet de 3 px dans la teinte en rotation, icône bleu nuit, centré.
   Il remplace la pastille pâle de 42 px des cartes (.ico) et l'icône nue des
   titres de section. 60 px (54 au téléphone). Sur fond sombre : anneau blanc. */
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile) .ico{width:60px!important;height:60px!important;margin:0 auto 14px!important;
  background:#fff!important;border:3px solid var(--vm-trait,#1E499B)!important;color:#001136!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile) .ico svg{width:27px!important;height:27px!important;stroke-width:1.6}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile) .ico.sur-sombre{background:transparent!important;border-color:#fff!important;color:#fff!important}
/* Le médaillon que veritas-medaillons.js pose devant le premier titre d'une
   carte DOUBLAIT l'anneau du titre de section qui suit : deux ronds empilés. */
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile) .ico:has(+ h2 > svg.vi){display:none!important}
:root[data-vrt-theme="sombre"]:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile) .ico{background:transparent!important;color:#F2F5FC!important}
/* Textes secondaires : auteurs sous les œuvres, liens de bas de page,
   mentions, légendes. Ils tombaient à 12-14 px sous un texte de 19 px. */
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .works span{font-size:15.5px!important;margin-top:2px}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .works a{padding:13px 16px!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .works a strong{font-size:17.5px}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.rel,.note,figcaption,.meta,.sub,.vcal-note){font-size:16px!important;line-height:1.65}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) small{font-size:max(15px,.88em)}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile) > p{font-size:17px}
@media (max-width:600px){
  :root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile) .ico{width:54px!important;height:54px!important}
  :root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.card,.tile) .ico svg{width:25px!important;height:25px!important}
  :root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.wrap,.card,article) h2 > svg.vi{width:54px!important;height:54px!important;padding:12px!important}
}

/* ════════════════════════════════════════════════════════════════════════
   TUILES .cta ET ENCADRÉ .upsell — ceux de la vitrine (18/10/2026)
   ════════════════════════════════════════════════════════════════════════
   Mesuré sur /adopter/ : le titre de l'encadré sombre était #153A80 sur un
   dégradé bleu nuit (illisible), et le bouton « Demander par WhatsApp »
   portait un texte #1E499B sur un fond #1E499B — il paraissait VIDE. Les
   tuiles .cta (198 pages) étaient des aplats bleus à filet gauche ; la
   vitrine pose des cartes blanches à médaillon, teintes en rotation. */
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .upsell :is(h2,h3,h4,p,strong,b){color:#fff!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .upsell small{color:rgba(255,255,255,.78)!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .upsell h3 svg{color:#FFC93C!important;stroke:#FFC93C!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .upsell .btns a:not(.ghost){background:#FFC93C!important;border-color:#FFC93C!important;color:#001136!important;font-weight:600!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .upsell .btns a:not(.ghost) svg{color:#001136!important;stroke:#001136!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .upsell .btns a.ghost{background:transparent!important;border:1.5px solid rgba(255,255,255,.55)!important;color:#fff!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .upsell .btns a.ghost svg{color:#fff!important;stroke:#fff!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .cta > a{
  background:#fff!important;color:#001136!important;border:1px solid #E4E9F2!important;
  border-radius:14px!important;box-shadow:0 4px 14px rgba(0,17,54,.05)!important;
  display:flex!important;flex-direction:column;align-items:center;justify-content:flex-start;
  text-align:center;gap:4px;padding:18px 16px!important;font:600 15.5px/1.35 Poppins,sans-serif!important;
  text-decoration:none!important;transition:transform .18s ease,box-shadow .18s ease}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .cta > a:hover{background:#fff!important;transform:translateY(-4px);box-shadow:0 12px 26px rgba(0,17,54,.09)!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .cta > a small{color:#6E7385!important;font:400 13px/1.5 Poppins,sans-serif!important;margin-top:2px!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .cta > a > svg{
  width:42px!important;height:42px!important;padding:11px;box-sizing:border-box;margin:0 0 8px!important;
  border-radius:50%;background:var(--vm-fond,#DBE8FE);color:var(--vm-trait,#1E499B)!important;
  stroke:currentColor!important;transition:transform .18s cubic-bezier(.34,1.56,.64,1)}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .cta > a:hover > svg{transform:scale(1.08) rotate(-4deg)}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .cta > a:nth-child(6n+1){--vm-fond:#DBE8FE;--vm-trait:#1E499B}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .cta > a:nth-child(6n+2){--vm-fond:#E3F1EE;--vm-trait:#0E7C86}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .cta > a:nth-child(6n+3){--vm-fond:#E7F7EC;--vm-trait:#007E11}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .cta > a:nth-child(6n+4){--vm-fond:#EEE9F8;--vm-trait:#5B4FA8}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .cta > a:nth-child(6n+5){--vm-fond:#FBE9F1;--vm-trait:#B03A6E}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .cta > a:nth-child(6n+6){--vm-fond:#FFF3E4;--vm-trait:#A84200}
:root[data-vrt-theme="sombre"]:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .cta > a{background:#14224A!important;border-color:#24345F!important;color:#F2F5FC!important}

/* ════════════════════════════════════════════════════════════════════════
   FAQ NUMÉROTÉE — celle de la vitrine (18/10/2026)
   ════════════════════════════════════════════════════════════════════════
   La vitrine numérote ses questions d'un disque plein, teintes en rotation.
   Une suite de .loupe.faq reçoit le même disque, avec un filet de la
   teinte de la question. */
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .wrap{counter-reset:vq}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .loupe.faq{counter-increment:vq}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .loupe.faq > h3::before{
  content:counter(vq);display:inline-flex;align-items:center;justify-content:center;
  width:30px;height:30px;margin-right:10px;border-radius:50%;vertical-align:middle;
  background:var(--vq,#1E499B);color:#fff;font:600 14px/1 Poppins,sans-serif}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .loupe.faq > h3{color:#001136!important}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .loupe.faq > p strong{color:var(--vq,#1E499B)}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .loupe.faq{--vq:#1E499B}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .loupe.faq + .loupe.faq{--vq:#0E7C86}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .loupe.faq + .loupe.faq + .loupe.faq{--vq:#007E11}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .loupe.faq + .loupe.faq + .loupe.faq + .loupe.faq{--vq:#5B4FA8}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .loupe.faq + .loupe.faq + .loupe.faq + .loupe.faq + .loupe.faq{--vq:#B03A6E}
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .loupe.faq + .loupe.faq + .loupe.faq + .loupe.faq + .loupe.faq + .loupe.faq{--vq:#A84200}

/* ════════════════════════════════════════════════════════════════════════
   ATELIER : ENCRES DE LA VITRINE (19/10/2026)
   ════════════════════════════════════════════════════════════════════════
   Mesuré en production, session enseignant, huit vues : les légendes de
   l'Atelier (#8B97A8, #9AA5B5, #7A8598) tombaient entre 2,2 et 3,7:1, les
   pastilles orange #C26A12 et vertes #1F9D55 à 3,2-3,9:1 — et aucune de ces
   teintes n'est celle de la vitrine. Ses couleurs passent par des variables
   posées sur :root : les redéfinir suffit, sans toucher au code React.
   Thème clair seulement : le sombre a ses propres valeurs. Après : 0 texte
   sous 4,5:1 (3:1 en grand corps) sur les huit vues. */
html:not([data-theme="sombre"]):has(#dc-root){
  --sb-fg-dim:#5F6475;--c8b97a8:#5F6475;--c9aa5b5:#5F6475;--c7a8598:#4D5163;
  --cc26a12:#A84200;--c1f9d55:#007E11;--c0e8a9c:#0E7C86}

/* ════════════════════════════════════════════════════════════════════════
   SUJETS D'EXAMEN — la police et les encres de la vitrine (19/10/2026)
   ════════════════════════════════════════════════════════════════════════
   Dix pages (evaluations/*) à feuille propre : trois palettes « papier »
   (encre #12100E, fond crème #F4F0E6, gris #6B5C40, filets #D6CBB5) et
   quatre polices (Playfair Display, Source Serif 4, Libre Baskerville,
   Times). Leurs variables prennent les valeurs de la vitrine ; l'or reste
   celui de chaque page (fond d'un bouton ici, encre d'un filet là) —
   veritas-medaillons.js relève ce qui manquerait de contraste. */
:root:has(link[data-vrt-epreuve]){--ink:#001136;--bg:#F4F5F8;--cream:#FFFFFF;--teal:#0E7C86;--blue:#1E499B;--violet:#5B4FA8;
  --muted:#5F6475;--border:#E4E9F2;--navy:#001136;--success-b:#007E11}
:root:has(link[data-vrt-epreuve]) body{background:#F4F5F8!important}
:root:has(link[data-vrt-epreuve]) body :not(.vrt-hab):not(.vrt-hab *):not(svg):not(svg *):not(code):not(pre){font-family:Poppins,system-ui,sans-serif!important}
:root:has(link[data-vrt-epreuve]) body :is(h1,h2,h3,h4):not(.vrt-hab *){font-weight:600!important;letter-spacing:normal!important}

/* Pictogrammes posés par veritas-medaillons.js (pictos) à la place des
   émojis de tête : le trait de la vitrine, à la taille et à la couleur du texte. */
.vm-pic{display:inline-block;width:1em;height:1em;vertical-align:-.14em;flex:0 0 auto;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}

/* CITATIONS EN POPPINS (19/10/2026) — les fiches d'œuvre citaient en Georgia
   (.hook, .cit blockquote) ; la vitrine cite en Poppins italique. */
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :is(.hook,blockquote){font-family:Poppins,system-ui,sans-serif!important}
/* Une scansion de vers d'un seul tenant (« Hom-me-li-bre-tou-jours… ») sortait
   de l'écran à 375 px : elle peut se couper n'importe où. */
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) .k{overflow-wrap:anywhere}

/* UNE SEULE POLICE (19/10/2026) — les cours posaient Nunito, Baloo 2 et
   Playfair Display, l'index des cahiers Klee One : la vitrine n'a que Poppins. */
:root:has(link[href*="veritas-pages.css"],link[href*="veritas-refonte.css"]) body:not(:has(nav.vrt-outil)) :not(.vrt-hab):not(.vrt-hab *):not(svg):not(svg *):not(code):not(pre):not(kbd){font-family:Poppins,system-ui,sans-serif!important}
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


def habiller(s, donnees, rel=''):
    s = retirer_blocs(s)
    v = version(s)
    outil = any(r.search(rel) for r in OUTILS)
    atelier = rel == 'plateforme/index.html'
    # 19/10/2026 — Les sujets d'examen ont chacun leur feuille en ligne (papier
    # crème, Playfair / Source Serif / Times, émojis en couleur) et aucune des
    # feuilles partagées : rien de la vitrine ne les atteignait. Un marqueur
    # sur NOTRE lien les désigne à veritas-habillage.css (« :has() ») sans
    # script ni flash au chargement ; veritas-medaillons.js y passe ses
    # corrections (filets, contraste, pictogrammes).
    # Les pages d'erreur et de service (403, 404, validation admin,
    # réinitialisation) sont dans le même cas : feuille propre, police système.
    epreuve = (rel.startswith('evaluations/') and not rel.endswith('index.html')) or rel in (
        '403.html', '404.html', 'admin-validation.html', 'reset.html')

    # <head>
    tete = ('<link rel="stylesheet" href="/assets/veritas-habillage.css?v=%s"%s>\n'
            '<script>window.VRT_DATA=window.VRT_DATA||%s;</script>') % (
        v, ' data-vrt-epreuve' if epreuve else '', donnees)
    # La barre est dessinée en Poppins : une page qui ne la charge pas
    # (évaluations, Campus, Atelier…) la recevrait en police système.
    if not re.search(r'fonts\.googleapis\.com/css2\?family=[^"]*Poppins', s):
        tete = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
                'family=Poppins:wght@400;500;600&display=swap">\n') + tete
    if atelier:
        tete += '\n' + CSS_ATELIER
    if re.search(r'body\s*\{[^}]*display\s*:\s*flex', s):
        tete += '\n' + CSS_CORPS_FLEX
    elif re.search(r'body\s*\{[^}]*max-width\s*:', s):
        tete += '\n' + CSS_CORPS_ETROIT
    s = s.replace('</head>', bloc('tete', tete) + '\n</head>', 1)
    if atelier:
        s = PONT_ATELIER.sub('', s, count=1)

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
    barre = NAV_OUTIL if outil else NAV + '\n' + PROMO
    s = s[:pos] + bloc('barre', barre) + '\n' + s[pos:]

    # Ancien pied → retiré (le dernier <footer> hors de nos blocs). Pas dans un
    # outil de travail : son pied fait partie de l'application.
    pieds = [] if outil else list(re.finditer(r'<footer\b[^>]*>[\s\S]*?</footer>', s))
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
    if 'veritas-medaillons.js' not in s and not outil and (epreuve or any(f in s for f in FEUILLES)):
        scripts += '<script src="/assets/veritas-medaillons.js?v=%s" defer></script>\n' % v
    # 25/10/2026 — même lecture partout (textes ≥ 15 px, anneaux) : voir
    # l'en-tête de assets/veritas-harmonie.js.
    scripts += '<script src="/assets/veritas-harmonie.js?v=%s" defer></script>\n' % v
    scripts += '<script src="/assets/vitrine.js?v=%s" defer></script>' % v
    fin = PIED + '\n' + ('' if outil else BULLES + '\n') + scripts
    i = s.rfind('</body>')
    s = s[:i] + bloc('pied', fin) + '\n' + s[i:]
    return s


# ── L'application (VERITAS_v1.2.html → app.html) ───────────────────────────
# 17/10/2026 — « harmonise exactement comme sur la vitrine pour que
# l'utilisateur ne sente pas le déphasage » (Jacques). Chaque bouton
# « Connexion », « Rechercher », « Choisir » de la vitrine mène ici : c'était
# la SEULE page publique encore sans l'habillage, avec sa propre barre (logo,
# globe, soleil, burger), un pied réduit à « VÉRITAS v1.19 » et ses propres
# bulles. On y pose les MÊMES blocs, mais DANS #VISITOR — c'est lui qui
# défile (position:fixed, overflow:auto) : la barre y reste collante, et rien
# ne déborde sur l'administration (#APP) ni sur l'écran de connexion (#LS).
APP_SHELLS = ('VERITAS_v1.2.html', 'app.html')

# L'ancienne barre et l'ancien pied restent dans le document (app.js écrit
# dans #vLoginBtns, #vNav sert d'ancre à plusieurs scripts) : on les masque.
# Les boutons flottants de l'application (Ambassa à gauche, WhatsApp « Besoin
# d'aide ? », citation) doublaient les bulles de la vitrine : ils cèdent la
# place — la bulle Ambassa de la vitrine ouvre l'Ambassa de l'application
# (pont dans app.js, _vrtPontApp).
# Sans :has() : ces règles ne sont posées QUE si l'habillage l'est, et
# certains WebView Android anciens ne connaissent pas :has().
CSS_APP = ('<style>'
           '#VISITOR > .vlogin-bar,#vNav,#VISITOR > footer:not(.vrt-hab),'
           '#vAmbassaFab,#vtWaFab,#vCitFloat'
           '{display:none!important}'
           # #VISITOR est le conteneur qui défile : la barre colle à SON haut.
           # Ce que les blocs HÉRITENT du <body> de la vitrine : son encre et
           # sa pile de polices (#VISITOR transmettait #16233F).
           '#VISITOR > .vrt-hab{color:#4D5163;font-family:Poppins,system-ui,-apple-system,'
           '"Segoe UI",Roboto,Helvetica,Arial,sans-serif}'
           '#VISITOR > nav.vrt-hab{flex:none;width:100%}'
           '#VISITOR > footer.vrt-hab{flex:none;width:100%}'
           '</style>')


# ── Les panneaux de formules de la vitrine, dans l'application ──────────────
# « Mets les mêmes panneaux que sur la vitrine » (Jacques, 17/10/2026).
# L'application dessinait ses propres cartes Starter / Pro / Élite / Famille
# (_formulesGrille, app.js) : même offre, autre dessin. On recopie la grille
# de vitrine.html TELLE QUELLE dans un <template> de la coquille ; app.js
# l'affiche et y pose les prix réglés par l'administration. Une seule source :
# changer un panneau sur la vitrine le change dans l'application.
def _bloc_div(html, debut):
    """Le <div> qui commence à `debut`, balises équilibrées."""
    prof = 0
    for m in re.finditer(r'<div\b|</div>', html[debut:]):
        prof += 1 if m.group(0) != '</div>' else -1
        if prof == 0:
            return html[debut:debut + m.end()]
    raise SystemExit('habiller_pages : grille des formules non refermée dans vitrine.html.')


def _regle_css(css, motif):
    """Toutes les règles (ou @keyframes) dont l'en-tête correspond à `motif`."""
    out = []
    for m in re.finditer(motif, css):
        i = css.find('{', m.start())
        prof, j = 0, i
        while j < len(css):
            if css[j] == '{':
                prof += 1
            elif css[j] == '}':
                prof -= 1
                if prof == 0:
                    break
            j += 1
        out.append(css[m.start():j + 1])
    return out


def formules_vitrine(vitrine):
    i = vitrine.find('data-vrt-formule=')
    if i < 0:
        raise SystemExit('habiller_pages : aucune carte data-vrt-formule dans vitrine.html.')
    j = vitrine.rfind('<div style="display:grid', 0, i)
    grille = _bloc_div(vitrine, j)
    # data-reveal : l'apparition au défilement est pilotée par la vitrine
    # seule ; dans l'application la carte resterait invisible.
    grille = re.sub(r'\sdata-reveal\b', '', grille)
    css = '\n'.join(re.findall(r'<style[^>]*>([\s\S]*?)</style>', vitrine))
    regles = []
    for cl in sorted(set(re.findall(r'class="(vh\d+)"', grille)), key=lambda c: int(c[2:])):
        regles += _regle_css(css, r'\.' + cl + r'\b[^{,]*\{')
    for nom in sorted(set(re.findall(r'animation:\s*([a-zA-Z][\w-]*)', grille))):
        k = _regle_css(css, r'@keyframes\s+' + re.escape(nom) + r'\s*\{')
        if k:
            regles.append(k[-1])        # la vitrine en redéfinit : la dernière gagne
    regles.append('.vrt-formules{color:#4D5163;font:400 16px/1.6 Poppins,system-ui,-apple-system,'
                  '"Segoe UI",Roboto,Helvetica,Arial,sans-serif;text-align:left;margin:8px 0 24px}')
    regles.append('@media (max-width:999.98px){.vrt-formules>[style*="grid-template-columns"]'
                  '{grid-template-columns:repeat(2,minmax(0,1fr))!important}}')
    regles.append('@media (max-width:700px){.vrt-formules>[style*="grid-template-columns"]'
                  '{grid-template-columns:minmax(0,1fr)!important}}')
    regles.append('@media (prefers-reduced-motion:reduce){.vrt-formules *{animation:none!important}}')
    return ('<style>' + '\n'.join(regles) + '</style>\n'
            '<template id="vrtFormulesVitrine">' + absolu(grille) + '</template>')


def habiller_app(s, donnees, vitrine):
    """Pose l'habillage de la vitrine sur la coquille de l'application."""
    s = retirer_blocs(s)
    m = re.search(r'app\.js\?v=([0-9.]+)', s)
    v = m.group(1) if m else BP.VER
    tete = ('<link rel="stylesheet" href="/assets/veritas-habillage.css?v=%s">\n'
            '<script>window.VRT_DATA=window.VRT_DATA||%s;</script>\n%s') % (v, donnees, CSS_APP)
    s = s.replace('</head>', bloc('tete', tete) + '\n</head>', 1)

    mv = re.search(r'<div id="VISITOR"[^>]*>\n', s)
    if not mv:
        raise SystemExit('habiller_pages : #VISITOR introuvable dans la coquille de l\'application.')
    s = s[:mv.end()] + bloc('barre', NAV + '\n' + PROMO) + '\n' + s[mv.end():]

    # Pied + bulles DANS #VISITOR, juste avant sa fermeture : le pied défile
    # avec le contenu, les bulles (position:fixed) suivent son empilement.
    mf = re.search(r'<footer role="contentinfo"[\s\S]*?</footer>\n</div>\n', s)
    if not mf:
        raise SystemExit('habiller_pages : pied de #VISITOR introuvable dans la coquille de l\'application.')
    i = mf.end() - len('</div>\n')
    s = s[:i] + bloc('pied', PIED + '\n' + BULLES) + '\n' + s[i:]

    j = s.rfind('</body>')
    s = s[:j] + bloc('formules', formules_vitrine(vitrine)) + '\n' + s[j:]
    j = s.rfind('</body>')
    s = s[:j] + bloc('script', '<script src="/assets/veritas-harmonie.js?v=%s" defer></script>\n<script src="/assets/vitrine.js?v=%s" defer></script>' % (v, v)) + '\n' + s[j:]
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
        r = rel.replace(os.sep, '/')
        if '</body>' not in s:
            continue
        if not (any(f in s for f in FEUILLES) or any(x.search(r) for x in EN_PLUS)):
            continue
        # Une page qui porte sa PROPRE barre de la vitrine (générateur) n'est pas retouchée.
        if 'id="vrtNav"' in retirer_blocs(s):
            continue
        yield r, chemin, s


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    controle = '--controle' in sys.argv
    base = os.path.abspath(args[0]) if args else RACINE
    vitrine = open(os.path.join(RACINE, 'vitrine.html'), encoding='utf-8').read()
    donnees = donnees_vitrine(vitrine)

    a_jour = []
    if base == RACINE and '--app' not in sys.argv:
        if maj_sprite(vitrine, not controle):
            a_jour.append('assets/veritas-icons.svg')
        if ecrire_css(not controle):
            a_jour.append('assets/veritas-habillage.css')

    n = 0
    # --app : la seule coquille de l'application (essais locaux sans toucher
    # aux ~260 pages statiques).
    seule_app = '--app' in sys.argv
    for rel, chemin, s in ([] if seule_app else pages(base)):
        neuf = habiller(s, donnees, rel)
        n += 1
        # Garde : le corps de la page est intact, hormis ce qu'on remplace.
        if neuf.count('<h1') != s.count('<h1'):
            raise SystemExit('habiller_pages : %s — le nombre de <h1> a changé.' % rel)
        if neuf != s:
            a_jour.append(rel)
            if not controle:
                open(chemin, 'w', encoding='utf-8', newline='\n').write(neuf)

    for nom in APP_SHELLS:
        chemin = os.path.join(base, nom)
        # Dans le dépôt, app.html n'est pas suivi (la CI le copie depuis
        # VERITAS_v1.2.html) : on ne touche qu'à la coquille réellement servie.
        if not os.path.exists(chemin) or (base == RACINE and nom == 'app.html'):
            continue
        s = open(chemin, encoding='utf-8', newline='').read()
        # Un poste Windows extrait la coquille en CRLF (core.autocrlf) : les
        # motifs ci-dessus s'écrivent en LF. On travaille en LF et on rend
        # au fichier ses fins de ligne d'origine.
        crlf = '\r\n' in s
        neuf = habiller_app(s.replace('\r\n', '\n'), donnees, vitrine)
        if crlf:
            neuf = neuf.replace('\n', '\r\n')
        n += 1
        if neuf.count('<h1') != s.count('<h1') or neuf.count('id="vContent"') != 1:
            raise SystemExit('habiller_pages : %s — le corps de l\'application a changé.' % nom)
        if neuf != s:
            a_jour.append(nom)
            if not controle:
                open(chemin, 'w', encoding='utf-8', newline='').write(neuf)

    if controle and a_jour:
        raise SystemExit('habiller_pages --controle : %d fichier(s) sans l\'habillage à jour, '
                         'dont %s. Lancer : python tools/habiller_pages.py'
                         % (len(a_jour), ', '.join(a_jour[:5])))
    print('habiller_pages : %d page(s) habillée(s), %d fichier(s) modifié(s).' % (n, len(a_jour)))


if __name__ == '__main__':
    main()
