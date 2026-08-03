# -*- coding: utf-8 -*-
"""
build_corriges.py — génère les pages publiques de corrigés des manuels VÉRITAS.

Sortie : corriges/  (hub + 1 index par niveau + 1 page par séquence + sitemap)

Sources de vérité
-----------------
1er cycle (6e, 5e, 4e, 3e) : Guide pédagogique .docx (styles T_Seq / T_Sem / T_Disc /
    Rubrique / Exercice / Corrige). Le docx est le master édité à la main.
2nd cycle (2nde, 1ere, Tle) : sources balisées pack/content/*.md (#SEQ #SEM #DISC
    #RUB #Q #EXO #SOL #SOLM). La numérotation reproduit EXACTEMENT celle de
    render_pack.py (q_n remis à 0 sur #RUB/#DISC/#SEM/#SEQ, exo_n sur #DISC/#SEM/#SEQ,
    « Leçon N · » sauf épreuve/bilan/évaluation/intégration/banque/diagnostic).

Ce qui est publié : énoncé de l'exercice + corrigé. Ce qui ne l'est PAS : les textes
d'auteur, les leçons (« Je retiens »), les définitions, les notes « Pour l'enseignant »
— ils restent la valeur du cahier imprimé et du Guide.

Usage : python tools/build_corriges.py
"""
import os, re, sys, glob, io, html, datetime
from collections import Counter

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

try:
    from docx import Document
except ImportError:
    print("!! python-docx requis : pip install python-docx"); sys.exit(1)

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "corriges")
DESK = r"C:\Users\Mythe Errant\Desktop\Manuels"
FIN1 = os.path.join(DESK, "FINAUX_1er_cycle")
SITE = "https://veritas-school.com"
TODAY = datetime.date.today().isoformat()

# ─────────────────────────────────────────────────────────────── métadonnées
NIVEAUX = [
    dict(slug="6e",   label="6ᵉ",  long="Classe de 6ᵉ",        cycle="1er", examen=None,
         manuel="Mon Cahier de français 6ᵉ", kw="6eme sixieme"),
    dict(slug="5e",   label="5ᵉ",  long="Classe de 5ᵉ",        cycle="1er", examen=None,
         manuel="Mon Cahier de français 5ᵉ", kw="5eme cinquieme"),
    dict(slug="4e",   label="4ᵉ",  long="Classe de 4ᵉ",        cycle="1er", examen=None,
         manuel="Mon Cahier de français 4ᵉ", kw="4eme quatrieme"),
    dict(slug="3e",   label="3ᵉ",  long="Classe de 3ᵉ",        cycle="1er", examen="BEPC",
         manuel="Mon Cahier de français 3ᵉ", kw="3eme troisieme BEPC"),
    dict(slug="2nde", label="2ⁿᵈᵉ", long="Classe de 2ⁿᵈᵉ A",   cycle="2nd", examen=None,
         manuel="Mon Cahier de français 2ⁿᵈᵉ A", kw="seconde 2nde A"),
    dict(slug="1ere", label="1ʳᵉ", long="Classe de 1ʳᵉ A",     cycle="2nd", examen="Probatoire",
         manuel="Mon Cahier de français 1ʳᵉ A", kw="premiere 1ere A probatoire"),
    dict(slug="tle",  label="Tˡᵉ", long="Terminale A",         cycle="2nd", examen="BAC",
         manuel="Mon Cahier de français Terminale A", kw="terminale Tle A baccalaureat"),
]
SRC2ND = {"2nde": "Manuel_2nde_A", "1ere": "Manuel_1ere_A", "tle": "Manuel_Tle_A"}
# page « niveaux/ » correspondante (maillage interne, pas de doublon d'intention)
NIVEAU_SEO = {"6e": "francais-6eme", "5e": "francais-5eme", "4e": "francais-4eme",
              "3e": "francais-3eme", "2nde": "francais-seconde", "1ere": "francais-premiere",
              "tle": "francais-terminale"}

# ─────────────────────────────────────────────────────────────── utilitaires
INLINE = re.compile(r"(\*[^*]+\*|__[^_]+__|\|[^|]+\|)")

def esc(s):
    return html.escape(s or "", quote=False)

def inline(s):
    """Reproduit add_runs() de render_pack.py : *terme* = mis en avant, __x__ = italique."""
    out = []
    for chunk in INLINE.split(s or ""):
        if not chunk:
            continue
        if chunk.startswith("*") and chunk.endswith("*") and len(chunk) > 1:
            out.append('<b class="k">%s</b>' % esc(chunk[1:-1]))
        elif chunk.startswith("__") and chunk.endswith("__") and len(chunk) > 3:
            out.append("<em>%s</em>" % esc(chunk[2:-2]))
        elif chunk.startswith("|") and chunk.endswith("|") and len(chunk) > 1:
            out.append('<span class="hw">%s</span>' % esc(chunk[1:-1]))
        else:
            out.append(esc(chunk))
    return "".join(out)

def strip_prefix(t, *prefixes):
    for p in prefixes:
        if t.startswith(p):
            return t[len(p):].lstrip(" —:·-").strip()
    return t

TITRES_1ER = {
    "methodes": "Démarches méthodologiques officielles (MINESEC — APC-ESV)",
    "vers-le-bepc": "Préparation au BEPC — méthode, sujets zéro et épreuves blanches",
    "vers-le-cap": "Préparation au CAP — épreuves blanches",
}

def page_slug_1er(titre):
    m = re.match(r"S[ÉE]QUENCE\s+(\d+)", titre.strip(), re.I)
    if m:
        return "sequence-%s" % m.group(1)
    up = titre.upper()
    if "DÉMARCHE" in up or "DEMARCHE" in up:
        return "methodes"
    if "BEPC" in up:
        return "vers-le-bepc"
    if "CAP" in up:
        return "vers-le-cap"
    return re.sub(r"[^a-z0-9]+", "-", titre.lower()).strip("-")[:40] or "annexe"

def titre_propre(t):
    """« SÉQUENCE 3 — Citoyenneté… » → « Séquence 3 — Citoyenneté… » (les guides sont en capitales)."""
    t = t.strip()
    m = re.match(r"^S[ÉE]QUENCE\s+(\d+)\s*(.*)$", t)
    if m:
        reste = m.group(2).lstrip(" —–-·:").strip()
        return "Séquence %s — %s" % (m.group(1), reste) if reste else "Séquence %s" % m.group(1)
    if t.isupper() or (sum(c.isupper() for c in t if c.isalpha()) > 0.8 * max(1, sum(c.isalpha() for c in t))):
        # « BANQUE DE SUJETS… » → « Banque de sujets… »
        return t[:1] + t[1:].lower()
    return t

def num(n):
    return format(n, ',').replace(',', ' ')

def court(t, n=58):
    """Tronque proprement au mot (pour la balise <title>)."""
    t = t.strip()
    if len(t) <= n:
        return t
    cut = t[:n].rsplit(" ", 1)[0].rstrip(" ,;:—–-")
    return cut + "…"

def libelle_competence(comp):
    """« À la fin de la séquence, l'élève produira un résumé… » → « Produire un résumé… »"""
    c = re.sub(r"^À la fin de la séquence,?\s*", "", comp or "").strip()
    c = re.sub(r"^l['’](élève|apprenant)\s+", "", c)
    c = re.sub(r"^produira\b", "Produire", c)
    c = re.sub(r"^utilisera\b", "Utiliser", c)
    c = c.rstrip(".")
    return (c[:1].upper() + c[1:]) if c else ""


# ── Icônes vectorielles (sprite /assets/veritas-icons.svg) ────────────────────
# Les cahiers imprimés balisent leurs rubriques par des émojis (🔍 Je repère,
# ✍️ Exercice, 🎯 Objectif…). À l'écran, on les rend par de VRAIES icônes
# vectorielles : même repère visuel, rendu net et homogène sur tous les appareils.
# Règle : on ne convertit QUE l'émoji de tête (marqueur de rubrique). Un émoji au
# milieu d'une phrase appartient au texte de l'exercice — il n'est jamais touché.
ICONES = {
    "🎯": "i-target", "✍": "i-pen", "🔬": "i-flask", "📊": "i-chart", "🔍": "i-search",
    "💡": "i-lightbulb", "📖": "i-book-open", "📝": "i-pen", "✅": "i-check", "🖋": "i-pen",
    "✏": "i-pen", "🔄": "i-refresh", "🪶": "i-feather", "❌": "i-x-circle", "🎙": "i-mic",
    "🧭": "i-compass", "⚖": "i-scale", "🔗": "i-link", "🚀": "i-arrow-right", "💬": "i-message",
    "🔤": "i-type", "🎒": "i-backpack", "🧮": "i-calculator", "📘": "i-book", "🔎": "i-search",
    "👑": "i-award", "🔊": "i-volume", "🔧": "i-tool", "🛠": "i-tool", "🔢": "i-grid",
    "🔁": "i-refresh", "🎲": "i-dice", "👀": "i-eye", "🪜": "i-steps", "🧩": "i-puzzle",
    "📕": "i-book", "🎤": "i-mic", "✂": "i-scissors", "📚": "i-book-open", "📢": "i-megaphone",
    "📣": "i-megaphone", "🎭": "i-users", "📲": "i-scan", "📌": "i-quote", "🌐": "i-globe",
    "🗣": "i-mic", "🧑": "i-teacher", "🏫": "i-school", "⚠": "i-warning", "🎨": "i-image",
    "⚡": "i-sparkle", "🎵": "i-music", "🎼": "i-music", "📈": "i-chart", "🖼": "i-image",
    "🧱": "i-grid", "🌀": "i-refresh", "🧐": "i-eye", "🧾": "i-file-text", "🌳": "i-map",
    "🖊": "i-pen", "📓": "i-notebook", "💻": "i-graduation", "🤖": "i-bot", "🎬": "i-play",
    "🧵": "i-link", "🌍": "i-globe", "🎢": "i-sparkle", "🕐": "i-clock", "🩺": "i-gauge",
    "💪": "i-award", "➕": "i-grid", "❓": "i-lightbulb", "✒": "i-pen", "🖇": "i-link",
    "🌡": "i-gauge", "🔀": "i-refresh", "🎮": "i-gamepad", "🔐": "i-lock", "🔑": "i-key",
    "🗓": "i-calendar", "🔭": "i-eye", "📊": "i-chart", "👩": "i-users", "📗": "i-book", "📒": "i-book", "📐": "i-grid",
    "🌺": "i-quote", "🧠": "i-brain", "👉": "i-arrow-right", "🎓": "i-graduation",
}
EMOJI = re.compile("[🌀-🫿☀-➿⬀-⯿]")

def ico(name, cls="i"):
    return ('<svg class="%s" aria-hidden="true" focusable="false">'
            '<use href="/assets/veritas-icons.svg#%s"/></svg>' % (cls, name))

def pull_icon(t, defaut=None, fenetre=26):
    """Extrait l'émoji-marqueur de tête → (html d'icône, texte nettoyé).

    `fenetre` : on ne cherche que dans les premiers caractères, pour ne jamais
    toucher à un émoji qui appartient au contenu (leçons sur le langage SMS…).
    """
    t = t or ""
    m = EMOJI.search(t[:fenetre])
    if not m:
        return (ico(defaut) if defaut else ""), t
    nom = ICONES.get(m.group(0))
    if not nom:
        return (ico(defaut) if defaut else ""), t
    reste = (t[:m.start()] + t[m.end():]).replace("️", "")
    reste = re.sub(r"\s{2,}", " ", reste).strip(" ·—-").strip()
    # « Leçon 1 ·  Grammaire » → « Leçon 1 · Grammaire »
    reste = reste.replace(" · ·", " ·").replace("·  ", "· ")
    return ico(nom), reste

class Page:
    def __init__(self, slug, titre):
        self.slug, self.titre, self.lecons = slug, titre, []
        self.comp = ""
    @property
    def n_items(self):
        return sum(len(l["items"]) for l in self.lecons)

class Lecon:
    @staticmethod
    def new(titre, objectif=None, semaine=None):
        return dict(titre=titre, objectif=objectif, semaine=semaine, items=[])

# ───────────────────────────────────────────────── extraction 1er cycle (docx)
def extract_1er(niv):
    path = os.path.join(FIN1, "%s_Guide_pedagogique.docx" % niv["slug"])
    doc = Document(path)
    pages, by_slug = [], {}
    page = lec = rub = item = None
    semaine = None
    stats = Counter()
    for p in doc.paragraphs:
        st = p.style.name if p.style is not None else ""
        t = p.text.strip()
        if not t:
            continue
        if st == "T_Seq":
            slug = page_slug_1er(t)
            t = TITRES_1ER.get(slug, titre_propre(t))
            if slug in by_slug:
                page = by_slug[slug]
            else:
                page = Page(slug, t); by_slug[slug] = page; pages.append(page)
            lec = rub = item = None; semaine = None
        elif st == "T_Sem":
            semaine = strip_prefix(t, "👉")
        elif st == "T_Disc":
            if page is None:
                continue
            lec = Lecon.new(t, semaine=semaine)
            page.lecons.append(lec); rub = item = None
        elif st == "Objectif" and lec is not None and not lec["objectif"]:
            lec["objectif"] = strip_prefix(t, "🎯")
        elif st == "Rubrique":
            rub = t; item = None
        elif st == "Exercice":
            if lec is None:
                continue
            item = dict(rub=rub, q=strip_prefix(t, "✍️").strip(), sub=[], sol=[])
            lec["items"].append(item); stats["exos"] += 1
        elif st in ("Liste", "Liste1") and item is not None and not item["sol"]:
            item["sub"].append(strip_prefix(t, "•"))
        elif st == "Corrige" and item is not None:
            item["sol"].append(strip_prefix(t, "✅ Corrigé —", "✅ Corrigé", "✅"))
            stats["corriges"] += 1
    # nettoyage : on ne publie que ce qui a un corrigé
    for pg in pages:
        for l in pg.lecons:
            l["items"] = [i for i in l["items"] if i["sol"]]
        pg.lecons = [l for l in pg.lecons if l["items"]]
    pages = [pg for pg in pages if pg.lecons]
    return pages, stats

# ───────────────────────────────────────────────── extraction 2nd cycle (md)
TAG = re.compile(r"^#([A-Z_0-9]+)::\s?(.*)$")
NO_LECON = re.compile(r"épreuve|remédiation|bilan|évaluation|intégration|banque de sujets|sujet d'entra", re.I)

def extract_2nd(niv):
    cdir = os.path.join(DESK, SRC2ND[niv["slug"]], "pack", "content")
    files = sorted(glob.glob(os.path.join(cdir, "*.md")))
    pages, by_slug = [], {}
    stats = Counter()
    page = lec = rub = item = None
    semaine = None
    lecon_n = q_n = exo_n = 0
    diag = False

    def get_page(slug, titre):
        nonlocal page
        if slug in by_slug:
            page = by_slug[slug]
        else:
            page = Page(slug, titre); by_slug[slug] = page; pages.append(page)
        return page

    for f in files:
        for raw in open(f, encoding="utf-8"):
            m = TAG.match(raw.rstrip("\n"))
            if not m:
                continue
            tag, val = m.group(1), m.group(2).strip()
            if tag == "PART":
                low = val.lower()
                if "diagnost" in low:
                    get_page("diagnostic", "Évaluation diagnostique")
                elif "sujet" in low or "banque" in low:
                    get_page("sujets-examen", "Sujets d'examen — banque corrigée et entraînement")
                else:
                    get_page(re.sub(r"[^a-z0-9]+", "-", low).strip("-")[:32] or "annexe", val)
                lec = rub = item = None
                lecon_n = q_n = exo_n = 0
            elif tag == "SEQ":
                num = val.split("::", 1)[0].strip()
                comp = val.split("::", 1)[1].strip() if "::" in val else ""
                lib = libelle_competence(comp)
                get_page("sequence-%s" % num, "Séquence %s — %s" % (num, lib) if lib else "Séquence %s" % num)
                page.comp = comp
                lec = rub = item = None; semaine = None
                lecon_n = q_n = exo_n = 0; diag = False
            elif tag == "SEM":
                parts = [x.strip() for x in val.split("::", 1)]
                semaine = ("Semaine %s — %s" % (parts[0], parts[1])) if len(parts) > 1 else ("Semaine %s" % parts[0])
                lecon_n = q_n = exo_n = 0; diag = False
            elif tag == "DISC":
                if page is None:
                    get_page("diagnostic", "Évaluation diagnostique")
                q_n = exo_n = 0
                label = val
                if re.search(r"diagnost", val, re.I):
                    diag = True
                if not diag and not NO_LECON.search(val):
                    lecon_n += 1
                    label = "Leçon %d · %s" % (lecon_n, val)
                lec = Lecon.new(label, semaine=semaine)
                page.lecons.append(lec); rub = item = None
            elif tag == "OBJ" and lec is not None and not lec["objectif"]:
                lec["objectif"] = val
            elif tag == "RUB":
                rub = val; q_n = 0; item = None
            elif tag in ("Q", "QW", "QN"):
                if lec is None:
                    continue
                q_n += 1
                # Les épreuves d'examen numérotent déjà leurs questions dans la source
                # (« #Q:: 1. a) … ») : ne pas préfixer une seconde fois, sinon « 1. 1. a) ».
                deja_num = re.match(r"^\d+\s*[.)]\s", val) is not None
                item = dict(rub=rub, q=(val if deja_num else "%d. %s" % (q_n, val)), sub=[], sol=[])
                lec["items"].append(item); stats["questions"] += 1
            elif tag == "EXO":
                if lec is None:
                    continue
                parts = [x.strip() for x in val.split("::", 1)]
                cons = parts[1] if len(parts) > 1 else parts[0]
                exo_n += 1
                item = dict(rub=rub, q="Exercice %d : %s" % (exo_n, cons), sub=[], sol=[])
                lec["items"].append(item); stats["exos"] += 1
            elif tag == "LI" and item is not None and not item["sol"]:
                item["sub"].append(val)
            elif tag in ("SOL", "SOLM"):
                if item is None:
                    continue
                item["sol"].append(val); stats["corriges"] += 1
    for pg in pages:
        for l in pg.lecons:
            l["items"] = [i for i in l["items"] if i["sol"]]
        pg.lecons = [l for l in pg.lecons if l["items"]]
    pages = [pg for pg in pages if pg.lecons]
    # ordre : diagnostic, séquences, annexes
    def order(pg):
        if pg.slug == "diagnostic":
            return (0, 0)
        m = re.match(r"sequence-(\d+)", pg.slug)
        return (1, int(m.group(1))) if m else (2, 0)
    pages.sort(key=order)
    return pages, stats

# ─────────────────────────────────────────────────────────────── gabarit HTML
# CSS et JS : /assets/veritas-pages.css et /assets/veritas-ui.js (versionnés, communs au site).

def head(title, desc, canonical, depth=1, jsonld=""):
    # depth = profondeur SOUS corriges/ (0 = hub, 1 = pages de niveau)
    up = "../" * max(0, depth - 1)
    return """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(title)s</title>
<meta name="description" content="%(desc)s">
<meta name="robots" content="index,follow">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Centre VÉRITAS">
<meta property="og:title" content="%(title)s">
<meta property="og:description" content="%(desc)s">
<meta property="og:url" content="%(can)s">
<meta property="og:image" content="%(site)s/uploads/logo-veritas.png">
<link rel="canonical" href="%(can)s">
<link rel="stylesheet" href="/assets/veritas-pages.css">
%(jsonld)s
</head>
<body>
""" % dict(title=esc(title), desc=esc(desc), can=canonical, site=SITE, jsonld=jsonld)

def foot(depth=1):
    return """<footer class="bot">© <span id="y"></span> Centre VÉRITAS · Mythe Errant — Douala, Cameroun ·
<a href="%(site)s">veritas-school.com</a> · <a href="%(site)s/manuels.html">Espace Manuels</a></footer>
<script src="/assets/veritas-ui.js" defer></script>
</body>
</html>
""" % dict(site=SITE)

def jsonld_page(name, desc, url, level, crumbs):
    items = "".join(
        '{"@type":"ListItem","position":%d,"name":"%s","item":"%s"}%s' % (i + 1, esc(n), u, "," if i < len(crumbs) - 1 else "")
        for i, (n, u) in enumerate(crumbs))
    return ('<script type="application/ld+json">{"@context":"https://schema.org","@graph":['
            '{"@type":"LearningResource","name":"%s","description":"%s","url":"%s",'
            '"inLanguage":"fr","learningResourceType":"Corrigé d\'exercices",'
            '"educationalLevel":"%s","educationalUse":"self-study",'
            '"isAccessibleForFree":true,'
            '"provider":{"@type":"EducationalOrganization","name":"Centre VÉRITAS",'
            '"url":"%s","address":{"@type":"PostalAddress","addressLocality":"Douala","addressCountry":"CM"}}},'
            '{"@type":"BreadcrumbList","itemListElement":[%s]}]}</script>'
            % (esc(name), esc(desc), url, esc(level), SITE, items))

CTA = """
  <h2 class="sec">%(ar)sContinuer</h2>
  <div class="cta">
    <a href="/eleve/">%(sac)sMon espace élève<small>Toutes mes ressources au même endroit</small></a>
    <a href="%(site)s">%(bot)sProf. Ambassa (IA)<small>Poser une question sur un corrigé</small></a>
    <a href="/outils/">%(calc)sOutils gratuits<small>Moyenne, points manquants, planning</small></a>
    <a href="/constellation.html">%(comp)sLa Constellation VÉRITAS<small>Tout ce qui accompagne le cahier</small></a>
  </div>
""" % dict(site=SITE, ar=ico("i-arrow-right"), sac=ico("i-backpack"), bot=ico("i-bot"),
           calc=ico("i-calculator"), comp=ico("i-compass"))

# ─────────────────────────────────────────────────────────────── rendu pages
def repere(q):
    """Renvoie le SEUL repère de l'exercice : « Exercice 3 », « Question 2 »…

    Le cahier est vendu ; les corrigés sont offerts. On ne republie donc JAMAIS
    l'énoncé en ligne — l'élève le lit dans son cahier et vient chercher ici la
    correction correspondante. Ne sort de cette fonction qu'un numéro.
    """
    q = (q or "").strip()
    m = re.match(r"^(Exercice|Exo|Devoir|Tâche)\s*(\d+)", q, re.I)
    if m:
        return "Exercice %s" % m.group(2)
    m = re.match(r"^(\d+)\s*[.)]", q)
    if m:
        return "Question %s" % m.group(1)
    return "Question"

def render_items(lec):
    out = []
    last_rub = None
    n_sans_num = 0
    for it in lec["items"]:
        if it["rub"] and it["rub"] != last_rub:
            icn, rub = pull_icon(it["rub"], "i-quote")
            out.append('<p class="rub">%s<span>%s</span></p>' % (icn, inline(rub)))
            last_rub = it["rub"]
            n_sans_num = 0
        sol = ""
        for stxt in it["sol"]:
            # « 📊 Barème — … », « 💡 Astuce — … » en tête de paragraphe : même
            # traitement que les rubriques (icône), le reste du texte est intact.
            icn_s, corps = pull_icon(stxt)
            sol += "<p>%s%s</p>" % (icn_s, inline(corps))
        lab = repere(it["q"])
        if lab == "Question":                      # énoncé sans numéro : on en pose un
            n_sans_num += 1
            lab = "Question %d" % n_sans_num
        # L'énoncé (it["q"]) et ses options (it["sub"]) restent dans le cahier.
        out.append(
            '<div class="ex"><p class="q"><b>%s</b></p>'
            '<details class="sol"><summary>%sVoir le corrigé</summary>'
            '<div class="body">%s</div></details></div>'
            % (esc(lab), ico("i-check"), sol))
    return "\n".join(out)

def render_sequence_page(niv, page, pages):
    n_ex = page.n_items
    exam = (" · préparation au %s" % niv["examen"]) if niv["examen"] else ""
    title = "Corrigés %s — %s | Cahier de français VÉRITAS" % (niv["label"], court(page.titre, 58))
    desc = ("Corrigés détaillés des %s exercices de « %s » du cahier de français %s "
            "du Centre VÉRITAS (programme MINESEC, Cameroun%s). Corrigés gratuits ; les énoncés sont dans le cahier."
            % (num(n_ex), page.titre, niv["long"], exam))
    url = "%s/corriges/%s/%s.html" % (SITE, niv["slug"], page.slug)
    crumbs = [("Accueil", SITE), ("Corrigés des manuels", SITE + "/corriges/"),
              (niv["long"], "%s/corriges/%s/" % (SITE, niv["slug"])), (page.titre, url)]
    h = head(title, desc, url, depth=2, jsonld=jsonld_page(title, desc, url, niv["long"], crumbs))
    nav = "".join(
        '<a href="%s.html"%s>%s</a>' % (p.slug, ' aria-current="page"' if p is page else "", esc(short_title(p.titre)))
        for p in pages)
    body = ['<header class="top"><span class="badge">Corrigés · %s</span>'
            "<h1>%s — %s</h1><p>%s exercices corrigés du cahier « %s ». "
            "Les énoncés restent dans ton cahier ; ici, les corrections — et elles sont gratuites.</p></header>"
            % (esc(niv["long"]), esc(niv["long"]), esc(page.titre), num(n_ex), esc(niv["manuel"])),
            '<div class="wrap">',
            '<div class="intro">' + ico("i-notebook", "i lg") + ' <strong>Comment t\'en servir ?</strong> Ouvre ton cahier '
            "à la leçon, fais l'exercice, puis retrouve ici son numéro et clique sur « Voir le corrigé ». "
            "<strong>Les énoncés ne sont pas recopiés en ligne</strong> — ils sont dans ton cahier. "
            "Ici, tu trouves les corrections, et elles sont gratuites.</div>",
            '<p class="crumb"><a href="%s/">Accueil</a> › <a href="../">Corrigés</a> › '
            '<a href="./">%s</a> › %s</p>' % (SITE, esc(niv["long"]), esc(page.titre)),
            '<nav class="seqnav">%s</nav>' % nav,
            '<div class="tools"><button data-all="open">Tout ouvrir</button>'
            '<button data-all="close">Tout fermer</button><span class="sep"></span>'
            '<button data-a11y aria-pressed="false">' + ico("i-type") + 'Lecture facilitée</button>'
            '<button data-speak="page" aria-pressed="false">' + ico("i-volume")
            + 'Écouter les corrigés</button>'
            '<button data-share>' + ico("i-link") + 'Partager cette page</button></div>']
    cur_sem = object()
    for lec in page.lecons:
        body.append('<section class="lec">')
        if lec["semaine"] and lec["semaine"] != cur_sem:
            cur_sem = lec["semaine"]
            body.append('<p class="sem">%s</p>' % esc(lec["semaine"]))
        icn, titre = pull_icon(lec["titre"], "i-book-open")
        body.append("<h3>%s<span>%s</span></h3>" % (icn, inline(titre)))
        if lec["objectif"]:
            body.append('<p class="obj">%s<span>%s</span></p>'
                        % (ico("i-target"), inline(lec["objectif"])))
        body.append(render_items(lec))
        body.append("</section>")
    body.append(CTA)
    body.append('<p class="note">Ces corrigés accompagnent le cahier du Centre VÉRITAS : ils en donnent les '
                'corrections, jamais les énoncés. Les exercices, les textes d\'auteur et les leçons sont dans '
                'le cahier — vendu en librairie ou accessible par abonnement ; la conduite de classe et les '
                'barèmes détaillés, dans le Guide pédagogique de l\'enseignant.</p>')
    body.append("</div>")
    return h + "\n".join(body) + foot(depth=2)

def short_title(t):
    m = re.match(r"S[ée]quence\s+(\d+)", t, re.I) or re.match(r"S[ÉE]QUENCE\s+(\d+)", t)
    if m:
        return "Séq. %s" % m.group(1)
    if "diagnost" in t.lower():
        return "Diagnostic"
    if "BEPC" in t.upper():
        return "Vers le BEPC"
    if "CAP" in t.upper():
        return "Vers le CAP"
    if "démarche" in t.lower() or "DÉMARCHE" in t:
        return "Méthodes"
    if "sujet" in t.lower():
        return "Sujets d'examen"
    return t[:26]

def render_level_index(niv, pages):
    total = sum(p.n_items for p in pages)
    exam = (" Préparation au %s." % niv["examen"]) if niv["examen"] else ""
    title = "Corrigés du cahier de français %s — %s exercices corrigés | VÉRITAS" % (niv["long"], num(total))
    desc = ("Tous les corrigés du cahier de français %s du Centre VÉRITAS : %s exercices corrigés, "
            "séquence par séquence, conformes au programme MINESEC du Cameroun.%s"
            % (niv["long"], num(total), exam))
    url = "%s/corriges/%s/" % (SITE, niv["slug"])
    crumbs = [("Accueil", SITE), ("Corrigés des manuels", SITE + "/corriges/"), (niv["long"], url)]
    h = head(title, desc, url, depth=2, jsonld=jsonld_page(title, desc, url, niv["long"], crumbs))
    cards = []
    for p in pages:
        cards.append('<div class="card"><h3>%s</h3><p class="note">%s exercices corrigés</p>'
                     '<a class="dl" href="%s.html"><span>Voir les corrigés</span>'
                     '<span class="pill">%s</span></a></div>'
                     % (esc(p.titre), num(p.n_items), p.slug, short_title(p.titre)))
    body = ['<header class="top"><span class="badge">Espace Manuels · Corrigés</span>'
            "<h1>Corrigés — %s</h1><p>%s exercices corrigés du cahier « %s », "
            "séquence par séquence. Programme MINESEC.%s</p></header>"
            % (esc(niv["long"]), num(total), esc(niv["manuel"]), esc(exam)),
            '<div class="wrap">',
            '<div class="intro">' + ico("i-target", "i lg") + ' <strong>La règle d\'or :</strong> on cherche d\'abord, on compare ensuite. '
            "Chaque corrigé est masqué tant que tu ne cliques pas — c'est fait exprès.</div>",
            '<p class="crumb"><a href="%s/">Accueil</a> › <a href="../">Corrigés des manuels</a> › %s</p>'
            % (SITE, esc(niv["long"])),
            '<h2 class="sec">' + ico("i-book") + 'Corrigés par séquence</h2>',
            '<div class="grid">%s</div>' % "".join(cards),
            '<h2 class="sec">' + ico("i-compass") + 'Pour aller plus loin</h2>',
            '<div class="grid"><div class="card"><h3>Le programme de %s</h3>'
            '<p class="note">Notions, œuvres et examen du niveau.</p>'
            '<a class="dl" href="%s/niveaux/%s.html"><span>Voir le programme</span><span class="pill">MINESEC</span></a></div>'
            '<div class="card"><h3>Méthodes &amp; annales</h3>'
            '<p class="note">Résumé, commentaire, dissertation, dictée, épreuves corrigées.</p>'
            '<a class="dl" href="%s/ressources/"><span>Voir les méthodes</span><span class="pill">Fiches</span></a></div>'
            '<div class="card"><h3>Œuvres au programme</h3>'
            '<p class="note">Résumés, analyses et citations vérifiées.</p>'
            '<a class="dl" href="%s/oeuvres/"><span>Voir les œuvres</span><span class="pill">21 fiches</span></a></div></div>'
            % (esc(niv["label"]), SITE, NIVEAU_SEO[niv["slug"]], SITE, SITE),
            CTA, "</div>"]
    return h + "\n".join(body) + foot(depth=2)

def render_hub(levels, est):
    total = sum(sum(p.n_items for p in pages) for _, pages in levels)
    title = "Corrigés des cahiers de français VÉRITAS — 6ᵉ à Terminale | %s exercices corrigés" % num(total)
    desc = ("Tous les corrigés des cahiers de français du Centre VÉRITAS, de la 6ᵉ à la Terminale : "
            "%s exercices corrigés, séquence par séquence, programme MINESEC du Cameroun. "
            "Séries A, scientifiques et techniques." % num(total))
    url = SITE + "/corriges/"
    crumbs = [("Accueil", SITE), ("Corrigés des manuels", url)]
    h = head(title, desc, url, depth=1, jsonld=jsonld_page(title, desc, url, "Secondaire", crumbs))
    def group(items):
        out = []
        for niv, pages in items:
            tot = sum(p.n_items for p in pages)
            ex = ' <small class="note">(%s)</small>' % niv["examen"] if niv["examen"] else ""
            out.append('<div class="card"><h3>%s%s</h3><p class="note">%s exercices corrigés · %d séquences</p>'
                       '<a class="dl" href="%s/"><span>Voir les corrigés</span><span class="pill">%s exos</span></a></div>'
                       % (esc(niv["long"]), ex, num(tot), len(pages), niv["slug"], num(tot)))
        return "".join(out)
    c1 = group([x for x in levels if x[0]["cycle"] == "1er"])
    c2 = group([x for x in levels if x[0]["cycle"] == "2nd"])
    ce = "".join('<div class="card"><h3>%s</h3><p class="note">%s</p>'
                 '<a class="dl" href="%s"><span>Voir les corrigés</span><span class="pill">EN LIGNE</span></a></div>'
                 % (esc(t), esc(s), f) for f, t, s in est)
    body = ['<header class="top"><span class="badge">Centre VÉRITAS · Espace Manuels</span>'
            "<h1>Corrigés des cahiers de français — 6ᵉ à Terminale</h1>"
            "<p>%s exercices corrigés, séquence par séquence, pour les cahiers du Centre VÉRITAS. "
            "Programme MINESEC · Cameroun.</p></header>" % num(total),
            '<div class="wrap">',
            '<div class="intro">' + ico("i-book-open", "i lg") + ' <strong>C\'est la page annoncée dans ton cahier</strong> (encadré '
            + ico("i-globe") + ' Espace VÉRITAS '
            "et QR code de la couverture). Choisis ta classe, puis ta séquence. Les corrigés sont masqués "
            "tant que tu ne cliques pas : <strong>cherche d'abord, compare ensuite</strong>.</div>",
            '<p class="crumb"><a href="%s/">Accueil</a> › Corrigés des manuels</p>' % SITE,
            '<h2 class="sec">' + ico("i-book") + 'Premier cycle (6ᵉ → 3ᵉ)</h2><div class="grid">%s</div>' % c1,
            '<h2 class="sec">' + ico("i-book") + 'Second cycle — séries A (2ⁿᵈᵉ → Terminale)</h2>'
            '<div class="grid">%s</div>' % c2,
            '<h2 class="sec">' + ico("i-flask") + 'Séries scientifiques &amp; techniques (Cahiers EST)</h2>'
            '<p class="note">Corrigés des évaluations et des tâches d\'intégration : langue (méthode R.A.I.), '
            'résumés-modèles au décompte exact, plans d\'analyse et de dissertation.</p>'
            '<div class="grid">%s</div>' % ce,
            '<h2 class="sec">' + ico("i-compass") + 'Autres ressources VÉRITAS</h2>'
            '<div class="grid">'
            '<div class="card"><h3>Programmes par classe</h3><p class="note">Notions et œuvres, 6ᵉ → Tˡᵉ.</p>'
            '<a class="dl" href="%s/niveaux/"><span>Voir</span><span class="pill">7 pages</span></a></div>'
            '<div class="card"><h3>Méthodes &amp; examens</h3><p class="note">BEPC, Probatoire, BAC, GCE.</p>'
            '<a class="dl" href="%s/ressources/"><span>Voir</span><span class="pill">11 fiches</span></a></div>'
            '<div class="card"><h3>Œuvres au programme</h3><p class="note">Analyses et citations vérifiées.</p>'
            '<a class="dl" href="%s/oeuvres/"><span>Voir</span><span class="pill">21 œuvres</span></a></div>'
            '<div class="card"><h3>Espace Manuels</h3><p class="note">La page des manuels et de leurs ressources.</p>'
            '<a class="dl" href="%s/manuels.html"><span>Voir</span><span class="pill">Hub</span></a></div>'
            '</div>' % (SITE, SITE, SITE, SITE),
            CTA, "</div>"]
    return h + "\n".join(body) + foot(depth=1)

# ─────────────────────────────────────────────────────────────────── main
def main():
    os.makedirs(OUT, exist_ok=True)
    # La feuille de style et le JS sont communs à tout le site : /assets/veritas-pages.css
    # et /assets/veritas-ui.js (écrits à la main, versionnés). Rien à générer ici.

    levels, urls, report = [], [], []
    for niv in NIVEAUX:
        pages, stats = (extract_1er(niv) if niv["cycle"] == "1er" else extract_2nd(niv))
        d = os.path.join(OUT, niv["slug"])
        os.makedirs(d, exist_ok=True)
        for p in pages:
            with open(os.path.join(d, p.slug + ".html"), "w", encoding="utf-8") as f:
                f.write(render_sequence_page(niv, p, pages))
            urls.append("%s/corriges/%s/%s.html" % (SITE, niv["slug"], p.slug))
        with open(os.path.join(d, "index.html"), "w", encoding="utf-8") as f:
            f.write(render_level_index(niv, pages))
        urls.append("%s/corriges/%s/" % (SITE, niv["slug"]))
        levels.append((niv, pages))
        tot = sum(p.n_items for p in pages)
        report.append((niv["slug"], tot, len(pages), dict(stats)))
        print("  ✓ %-5s %3d pages · %4d exercices publiés  %s" % (niv["slug"], len(pages) + 1, tot, dict(stats)))

    est = [("est-2nde.html", "2ⁿᵈᵉ scientifique & technique", "Les Tribus de Capitoline · Le Tartuffe"),
           ("est-1ere.html", "1ʳᵉ scientifique & technique (Probatoire)", "Au cœur des ténèbres · Le Lion et la Perle"),
           ("est-tle.html", "Terminale scientifique & technique (BAC)", "Ngum a Jemea · Le Vieux Nègre et la Médaille")]
    with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8") as f:
        f.write(render_hub(levels, est))
    urls.insert(0, SITE + "/corriges/")
    for f_, _, _ in est:
        urls.append("%s/corriges/%s" % (SITE, f_))

    with open(os.path.join(OUT, "sitemap-corriges.xml"), "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n'
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for u in dict.fromkeys(urls):
            prio = "0.9" if u.endswith("/corriges/") else ("0.8" if u.endswith("/") else "0.7")
            f.write("  <url><loc>%s</loc><lastmod>%s</lastmod>"
                    "<changefreq>monthly</changefreq><priority>%s</priority></url>\n" % (u, TODAY, prio))
        f.write("</urlset>\n")
    print("  ✓ hub + sitemap (%d URL)" % len(dict.fromkeys(urls)))
    print("\nTOTAL exercices publiés : %d" % sum(r[1] for r in report))

if __name__ == "__main__":
    main()
