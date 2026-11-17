# -*- coding: utf-8 -*-
"""
corriges_lecons.py — habille les pages de séquence de corriges/ au dessin des leçons d'Apprendre.

Demande de Jacques (17/11/2026) : « Enrichis aussi les pages de corrigés ». Les sources des corrigés
(Guides pédagogiques .docx, pack/content/*.md) ne sont pas dans le dépôt : ce script retravaille les
pages publiées, de façon idempotente (blocs entre marqueurs, relançable à volonté). build_corriges.py
le rappelle à la fin de sa génération.

Sur chaque page de séquence (une page qui porte <section class="lec">) :
  · en-tête carte (marqueurs cr-ent) à la place du bandeau bleu : médaille, pastille, classe et ouvrage,
    titre, « L'essentiel », puces (exercices corrigés, leçons, semaines, énoncés dans l'ouvrage, gratuit),
    barre « corrigés consultés » ;
  · leçons numérotées au cercle magenta à point or, objectifs en encadré à cible, rubriques bleu-vert,
    exercices en cartes, « Voir le corrigé » en pastille ; police Roboto (feuille cr-style) ;
  · suivi local des corrigés ouverts (localStorage, script cr-js) : chaque exercice ouvert est coché,
    la barre de l'en-tête avance ;
  · séquence précédente / suivante (cr-suite), d'après la barre des séquences de la page.

Usage : python tools/corriges_lecons.py             → écrit
        python tools/corriges_lecons.py --controle  → code 1 si une page changerait
"""
import os, re, sys, glob, html, io

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTROLE = "--controle" in sys.argv
SPRITE = "/assets/veritas-matieres.svg?v=20261110g"

PIC = {
    "ex": '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    "lecons": '<path d="M2 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"/>',
    "sem": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    "livre": '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    "libre": '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
    "bref": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
}
def pic(k, t=15):
    return ('<svg width="%d" height="%d" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>') % (t, t, PIC[k])

STYLE = open(os.path.join(ROOT, "tools", "corriges_lecons.css"), encoding="utf-8").read()
STYLE = re.sub(r"/\*.*?\*/", "", STYLE, flags=re.S)
STYLE = re.sub(r"\n\s*\n", "\n", STYLE).strip()

JS = r"""(function(){var k="vrt_corr_"+location.pathname,v={};try{v=JSON.parse(localStorage.getItem(k)||"{}")}catch(e){}
var ex=[].slice.call(document.querySelectorAll("section.lec .ex")),bar=document.getElementById("crBar"),lu=document.getElementById("crLu");
function maj(){var n=0;ex.forEach(function(e,i){var o=!!v[i];e.classList.toggle("vu",o);if(o)n++});
if(bar)bar.style.width=(ex.length?Math.round(n*100/ex.length):0)+"%";if(lu)lu.textContent="Corrigés consultés : "+n+" / "+ex.length;}
ex.forEach(function(e,i){var d=e.querySelector("details");if(d)d.addEventListener("toggle",function(){if(d.open&&!v[i]){v[i]=1;try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}maj()}})});
var r=document.querySelector("[data-cr-raz]");if(r)r.addEventListener("click",function(){v={};try{localStorage.removeItem(k)}catch(e){}maj()});maj();})();"""

RE_ENT = re.compile(r'<!--cr-ent-->.*?<!--/cr-ent-->|<header class="top">.*?</header>', re.S)
RE_STYLE = re.compile(r'<!--cr-style-->.*?<!--/cr-style-->\n?', re.S)
RE_JS = re.compile(r'<!--cr-js-->.*?<!--/cr-js-->\n?', re.S)
RE_SUITE = re.compile(r'\n<!--cr-suite-->.*?<!--/cr-suite-->', re.S)

def texte(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s)).strip()

def entete(bloc, page):
    badge = re.search(r'<span class="badge">(.*?)</span>', bloc, re.S).group(1)
    h1 = re.search(r"<h1>(.*?)</h1>", bloc, re.S).group(1)
    m = re.search(r'<p(?: class="mx-chapo")?>(.*?)</p>', bloc[bloc.find("</h1>"):], re.S)
    chapo = m.group(1) if m else ""
    n_ex = len(re.findall(r'<div class="ex">', page))
    n_lec = len(re.findall(r'<section class="lec">\s*(?:<p class="sem">.*?</p>\s*)?<h3>', page, re.S))
    n_sem = len(re.findall(r'<p class="sem">', page))
    parts = [p.strip() for p in texte(badge).split("·")]
    classe = parts[1] if len(parts) > 1 else ""
    ouvrage = " · ".join(parts[2:]) if len(parts) > 2 else ""
    support = "livret" if "livret" in ouvrage.lower() else "cahier"
    puces = ['<span>%s%d exercice%s corrigé%s</span>' % (pic("ex"), n_ex, "s" if n_ex > 1 else "", "s" if n_ex > 1 else "")]
    if n_lec: puces.append('<span>%s%d leçon%s</span>' % (pic("lecons"), n_lec, "s" if n_lec > 1 else ""))
    if n_sem: puces.append('<span>%s%d semaine%s</span>' % (pic("sem"), n_sem, "s" if n_sem > 1 else ""))
    puces.append('<span>%sÉnoncés dans ton %s</span>' % (pic("livre"), support))
    puces.append('<span>%sGratuit</span>' % pic("libre"))
    return ('<!--cr-ent-->\n<div class="wrap cr-tete"><header class="cr-ent">'
            '<div class="cr-ent-haut"><div class="cr-med"><svg width="44" height="44" aria-hidden="true"><use href="%s#m-francais"/></svg></div>'
            '<div class="cr-tags"><span class="badge">%s</span><span class="cr-mat"><b>Français</b>%s%s</span></div></div>\n'
            '<h1>%s</h1>\n'
            '<div class="cr-bref"><p class="cr-bref-t">%sL\'essentiel</p><p class="mx-chapo">%s</p></div>\n'
            '<div class="cr-puces">%s</div>\n'
            '<div class="cr-prog"><div class="cr-prog-t"><span id="crLu">Corrigés consultés : 0 / %d</span><button type="button" data-cr-raz>Remettre à zéro</button></div>'
            '<div class="cr-barre"><i id="crBar"></i></div></div>'
            '</header></div>\n<!--/cr-ent-->') % (SPRITE, badge, (" · " + html.escape(classe)) if classe else "",
                                                 (" · " + html.escape(ouvrage)) if ouvrage else "", h1, pic("bref", 14), chapo, "".join(puces), n_ex)

def suite(page):
    nav = re.search(r'<nav class="seqnav">(.*?)</nav>', page, re.S)
    if not nav: return ""
    liens = re.findall(r'<a href="([^"]+)"( aria-current="page")?>(.*?)</a>', nav.group(1), re.S)
    k = next((i for i, l in enumerate(liens) if l[1]), -1)
    if k < 0: return ""
    def nom(t):
        t = texte(t)
        return re.sub(r"^Séq\. ?", "Séquence ", t)
    out = ""
    if k > 0:
        out += '<a href="%s"><span class="cr-fl">‹</span><span><small>Séquence précédente</small>%s</span></a>' % (liens[k - 1][0], html.escape(nom(liens[k - 1][2])))
    if k + 1 < len(liens):
        out += '<a class="cr-suiv" href="%s"><span><small>Séquence suivante</small>%s</span><span class="cr-fl">›</span></a>' % (liens[k + 1][0], html.escape(nom(liens[k + 1][2])))
    return '\n<!--cr-suite-->\n<nav class="cr-suite" aria-label="Séquences voisines">%s</nav>\n<!--/cr-suite-->' % out if out else ""

def traiter(page):
    if '<section class="lec">' not in page: return page
    m = RE_ENT.search(page)
    if not m: return page
    page = page[:m.start()] + entete(m.group(0), page) + page[m.end():]
    page = RE_STYLE.sub("", page)
    # Avant les blocs de l'habillage (habiller_pages.py les veut en dernier dans <head> et <body>).
    ancre = "<!--vrt-habillage:tete-->" if "<!--vrt-habillage:tete-->" in page else "</head>"
    page = page.replace(ancre, "<!--cr-style-->\n<style>%s</style>\n<!--/cr-style-->\n" % STYLE + ancre, 1)
    page = RE_SUITE.sub("", page)
    i = page.rfind("</section>")
    page = page[:i + 10] + suite(page) + page[i + 10:]
    page = RE_JS.sub("", page)
    ancre = "<!--vrt-habillage:pied-->" if "<!--vrt-habillage:pied-->" in page else "</body>"
    page = page.replace(ancre, "<!--cr-js-->\n<script>%s</script>\n<!--/cr-js-->\n" % JS + ancre, 1)
    return page

changees = vues = 0
for f in sorted(glob.glob(os.path.join(ROOT, "corriges", "**", "*.html"), recursive=True)):
    avant = open(f, encoding="utf-8").read()
    apres = traiter(avant)
    if '<section class="lec">' in avant: vues += 1
    if apres != avant:
        changees += 1
        if not CONTROLE:
            open(f, "w", encoding="utf-8", newline="").write(apres)
if CONTROLE and changees:
    print("corriges_lecons : %d page(s) périmée(s) — lancer python tools/corriges_lecons.py" % changees); sys.exit(1)
print("corriges_lecons : %d pages de séquence %s" % (vues, "à jour" if CONTROLE else "(%d écrite(s))" % changees))
