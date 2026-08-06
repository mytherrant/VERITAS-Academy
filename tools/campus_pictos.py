# -*- coding: utf-8 -*-
"""
campus_pictos.py — remplace les émojis de campus/ par les pictogrammes VÉRITAS.

Une interface de direction d'établissement affiche des émojis système : le
rendu change d'un poste à l'autre (Windows 7 d'un secrétariat ≠ téléphone du
proviseur), et le registre visuel n'est pas celui d'un logiciel de gestion.

Chaque page reçoit un sprite EMBARQUÉ ne contenant que les symboles qu'elle
utilise : campus/ doit pouvoir tourner sur le serveur d'une école, voire sur un
poste hors ligne, sans dépendre de /assets/veritas-icons.svg.

Ce qui n'est PAS touché : les flèches et coches typographiques (→ ← ✓ ✕ ✔ ↺
⬆ ⬇), qui sont de la ponctuation, pas des émojis.

Usage :
    python tools/campus_pictos.py            # rapport
    python tools/campus_pictos.py --appliquer
"""
import io, os, re, sys

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPRITE = os.path.join(RACINE, "assets", "veritas-icons.svg")
CIBLES = ["campus/app.html", "campus/dashboard.html", "campus/documents.html",
          "campus/notes.html", "campus/onboarding.html", "campus/index.html",
          "campus/login.html", "campus/campus.js"]

# émoji → identifiant de pictogramme. Choisi sur le SENS du libellé voisin
# (relevé un par un dans les pages), pas sur une ressemblance de forme.
CARTE = {
    "📊": "i-chart",           "📈": "i-chart",          "📉": "i-gauge",
    "👥": "i-users",           "👤": "i-users",
    "📝": "i-pen",             "🔢": "i-calculator",
    "🟢": "i-check",           "✅": "i-check",
    "🗓": "i-calendar",        "⚖": "i-scale",
    "🛡": "i-shield",          "🚨": "i-warning",        "⚠": "i-warning",
    "🏥": "i-first-aid",       "💳": "i-credit-card",    "💼": "i-briefcase",
    "🧾": "i-receipt",         "📚": "i-book",           "🚌": "i-bus",
    "🚐": "i-bus",             "🛏": "i-bed",            "👔": "i-briefcase",
    "⚙": "i-tool",            "📦": "i-box",            "🎒": "i-backpack",
    "🔒": "i-lock",            "💰": "i-coins",          "🏆": "i-award",
    "📞": "i-phone",           "📲": "i-message",        "🖨": "i-printer",
    "📄": "i-file-text",       "📋": "i-clipboard-check","🛂": "i-clipboard-check",
    "🎓": "i-graduation",      "🏛": "i-school",         "🪪": "i-badge",
    "📰": "i-file-text",       "🤖": "i-bot",            "🎉": "i-sparkle",
    "⚡": "i-sparkle",         "🍽": "i-utensils",       "🎮": "i-gamepad",
    "🛍": "i-box",             "👁": "i-eye",            "💬": "i-message",
    "🔔": "i-megaphone",       "📅": "i-calendar",       "🏫": "i-school",
    "✏": "i-pen",             "🔍": "i-search",         "📤": "i-mail",
}
VARIANTE = "️"   # sélecteur de variante émoji, colle souvent au caractère


def symboles():
    """id → markup complet du <symbol>, lu dans le sprite de référence."""
    src = io.open(SPRITE, encoding="utf-8").read()
    out = {}
    for m in re.finditer(r'<symbol[^>]*id="(i-[^"]+)"[^>]*>.*?</symbol>', src, re.S):
        out[m.group(1)] = m.group(0)
    return out


GUILLEMET = re.compile(r'(?<!\\)"')


def convertit(txt, dispo):
    """Remplace les émojis connus. Renvoie (texte, ids utilisés, nb, refusés).

    Le markup inséré contient des guillemets DOUBLES. Une occurrence située à
    l'intérieur d'une chaîne double-quotée (JS) ou d'un attribut HTML la
    couperait en deux : on la laisse en place et on la signale plutôt que de
    produire un fichier cassé — c'est exactement le piège qui avait corrompu
    app.js lors d'une conversion précédente.
    """
    utilises, n, refuses = set(), 0, []

    def rempl(m):
        nonlocal n
        ident = CARTE[m.group(1)]
        if ident not in dispo:
            return m.group(0)
        debut_ligne = txt.rfind("\n", 0, m.start()) + 1
        if len(GUILLEMET.findall(txt[debut_ligne:m.start()])) % 2 == 1:
            refuses.append(txt.count("\n", 0, m.start()) + 1)
            return m.group(0)
        utilises.add(ident)
        n += 1
        return '<svg class="cico" aria-hidden="true"><use href="#%s"/></svg>' % ident

    motif = re.compile("(" + "|".join(re.escape(e) for e in CARTE) + ")" + VARIANTE + "?")
    return motif.sub(rempl, txt), utilises, n, refuses


def pose_sprite(html, utilises, dispo):
    """Insère (ou remplace) le sprite embarqué juste après <body>."""
    if not utilises:
        return html
    bloc = ('<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true" id="cmpSprite">'
            + "".join(dispo[i] for i in sorted(utilises)) + "</svg>")
    if 'id="cmpSprite"' in html:
        return re.sub(r'<svg[^>]*id="cmpSprite".*?</svg>\s*(?=<)', bloc, html, count=1, flags=re.S)
    m = re.search(r"<body[^>]*>", html)
    if not m:
        return bloc + html
    return html[:m.end()] + "\n" + bloc + html[m.end():]


CSS = """
/* Pictogrammes VÉRITAS (remplacent les émojis système) */
.cico{width:1.05em;height:1.05em;flex:0 0 auto;vertical-align:-.14em;
  fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
.ic .cico,.ti .cico{width:1.15em;height:1.15em}
"""


def main():
    appliquer = "--appliquer" in sys.argv
    dispo = symboles()
    total = 0
    tous = set()

    # campus.js émet du markup mais n'a pas de <body> : ses pictogrammes doivent
    # figurer dans le sprite des pages qui le chargent, sinon <use> pointe dans
    # le vide et l'icône disparaît sans erreur.
    js = os.path.join(RACINE, "campus", "campus.js")
    ids_js = set()
    if os.path.isfile(js):
        _, ids_js, _, _ = convertit(io.open(js, encoding="utf-8").read(), dispo)
    hotes_js = set()
    for nom in os.listdir(os.path.join(RACINE, "campus")):
        if nom.endswith(".html"):
            if "campus.js" in io.open(os.path.join(RACINE, "campus", nom), encoding="utf-8").read():
                hotes_js.add("campus/" + nom)

    for rel in CIBLES:
        chemin = os.path.join(RACINE, rel)
        if not os.path.isfile(chemin):
            continue
        src = io.open(chemin, encoding="utf-8").read()
        neuf, utilises, n, refuses = convertit(src, dispo)
        if rel in hotes_js:
            utilises |= ids_js
        if refuses:
            print("  !! %-21s %d occurrence(s) en contexte double-quote, laissees telles quelles : lignes %s"
                  % (rel, len(refuses), refuses[:8]))
        if not n and not (rel in hotes_js and ids_js):
            continue
        if rel.endswith(".html"):
            neuf = pose_sprite(neuf, utilises, dispo)
        tous |= utilises
        if appliquer:
            io.open(chemin, "w", encoding="utf-8", newline="").write(neuf)
        print("  %-24s %3d émojis → %2d pictogrammes" % (rel, n, len(utilises)))
        total += n

    # campus.js ne porte pas de <body> : ses symboles doivent exister dans les
    # pages qui l'incluent. On les ajoute au sprite de app.html, son hôte.
    css = os.path.join(RACINE, "campus", "campus.css")
    if appliquer and os.path.isfile(css):
        s = io.open(css, encoding="utf-8").read()
        if ".cico{" not in s:
            io.open(css, "w", encoding="utf-8", newline="").write(s + CSS)
            print("  campus.css              règle .cico ajoutée")
    print("TOTAL : %d émojis remplacés, %d pictogrammes distincts" % (total, len(tous)))
    print("-> écrit." if appliquer else "-> rapport seulement (--appliquer pour écrire).")


if __name__ == "__main__":
    main()
