# -*- coding: utf-8 -*-
"""Fabrique `corriges/tous-les-corriges.html` : UNE page portant l'intégralité
des corrigés publiés, 6ᵉ → Terminale, livrets et cahiers réunis.

Habillage — pourquoi la feuille du site et non un CSS propre.
    Première version : CSS inline maison, pour éviter une requête et une police
    distante sur une page déjà lourde. Corrigé à la demande de Jacques : la page
    doit être HABILLÉE COMME LE RESTE DU SITE. On reprend donc `head()` et
    `foot()` de build_corriges, donc `/assets/veritas-pages.css` — déjà remappée
    sur les tokens LWS (Poppins, bleu corporate) — et les mêmes classes que les
    87 pages de corrigés : `header.top`, `.badge`, `.wrap`, `.intro`, `.crumb`,
    `h2.sec`, `section.lec`, `.rub`, `.ex`, `details.sol`, `.i`. Conséquence
    heureuse : les icônes, l'espacement et la typographie sont ceux du site sans
    une ligne de style à maintenir ici. Le `<style>` inline ne garde que ce que
    la feuille commune ne connaît pas : le repli par document et le levier de
    performance.

Pourquoi une page et pas un portail — et ce que cela coûte.
    Le choix est celui de Jacques, formulé après réserve. Il faut donc l'assumer
    techniquement, car le contenu réuni pèse ~5,7 Mo de texte (≈ 1 million de
    mots) : sans précaution, la page serait injouable sur un téléphone en 3G.
    Trois leviers sont employés, et ils suffisent :
      1. `content-visibility:auto` + `contain-intrinsic-size` sur chaque section
         de niveau : le navigateur ne calcule la mise en page que de ce qui
         approche l'écran. C'est le levier décisif — mesuré sans lui, le premier
         rendu d'un million de mots bloque le fil principal plusieurs secondes.
      2. Chaque corrigé reste dans un `<details>` fermé : le texte est PRÉSENT
         dans le HTML servi — donc indexable, ce qui est tout l'objet de la
         page — mais il n'est ni peint ni mis en page tant qu'on ne l'ouvre pas.
      3. Chaque document (module ou séquence) est lui aussi replié.
    Mesuré en navigateur : 9,2 Mo bruts → 2,05 Mo en gzip (~1,7 Mo en Brotli,
    que LiteSpeed sert), DOM interactif à 2,5 s sur poste de bureau, ouverture
    d'un document en 241 ms, aucun débordement horizontal à 375 px. Le poids du
    transfert demeure : c'est le prix du format demandé, et il est irréductible.

Duplication interne — le point à connaître.
    Cette page reprend le contenu des 87 pages de `corriges/`. Google peut donc
    y voir du contenu dupliqué et arbitrer entre les deux. On limite le risque :
    la page se déclare canonique d'elle-même, chaque bloc renvoie en lien direct
    vers sa page détaillée (maillage descendant), et le sitemap lui donne une
    priorité inférieure au hub. Si le référencement des pages fines venait à
    baisser, c'est ici qu'il faudrait revenir.

Usage : python tools/build_page_unique.py   (après build_corriges.py)
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import build_corriges as B          # noqa: E402  (réutilise toute la chaîne)

OUT = os.path.join(B.ROOT, "corriges", "tous-les-corriges.html")
URL = B.SITE + "/corriges/tous-les-corriges.html"

# Hauteur estimée d'une section de niveau repliée, pour `contain-intrinsic-size`.
# Trop basse, la barre de défilement sauterait à chaque section qui entre dans
# l'écran ; trop haute, elle laisserait de grands blancs. 900 px correspond à
# l'ordre de grandeur mesuré d'un niveau dont tous les documents sont fermés.
INTRINSIC = 900

# Ce que la feuille commune ne connaît pas : le repli par document, et le levier
# de performance propre à cette page. Tout le reste vient de veritas-pages.css.
STYLE = """<style>
section.niv{content-visibility:auto;contain-intrinsic-size:auto %dpx;margin:2.4rem 0}
details.doc{border:1px solid var(--line,#e3e7ef);border-radius:10px;margin:0 0 .6rem;
  background:#fff}
details.doc>summary{cursor:pointer;padding:.8rem 1rem;font-weight:600;list-style:none;
  display:flex;justify-content:space-between;gap:.8rem;align-items:baseline;
  color:var(--navy)}
details.doc>summary::-webkit-details-marker{display:none}
details.doc>summary::after{content:"\\25BE";color:#7a8398;font-size:.9em}
details.doc[open]>summary{border-bottom:1px solid var(--line,#e3e7ef)}
details.doc[open]>summary::after{content:"\\25B4"}
details.doc>summary .n{color:#7a8398;font-weight:400;font-size:.86em}
details.doc .in{padding:.2rem 1rem 1rem}
details.doc section.lec{margin-top:1rem}
nav.niveaux{display:flex;flex-wrap:wrap;gap:.5rem;margin:1.2rem 0 1.6rem}
nav.niveaux a{border:1px solid var(--line,#e3e7ef);border-radius:8px;padding:.5rem .9rem;
  text-decoration:none;font-weight:600;background:#fff;color:var(--navy)}
nav.niveaux a:hover{border-color:var(--gold);background:#fffdf5}
nav.niveaux a .n{color:#7a8398;font-weight:400}
p.vers{margin:.9rem 0 .2rem;font-size:.9rem}
a.haut{display:inline-block;margin:.6rem 0 0;font-size:.85rem}
</style>""" % INTRINSIC


def bloc_lecon(lec):
    """Une leçon, dans le markup EXACT des pages de séquence (section.lec)."""
    o = ['<section class="lec">']
    icn, titre = B.pull_icon(lec["titre"], "i-book-open")
    o.append("<h3>%s<span>%s</span></h3>" % (icn, B.inline(titre)))
    if lec.get("objectif"):
        o.append('<p class="obj">%s<span>%s</span></p>'
                 % (B.ico("i-target"), B.inline(lec["objectif"])))
    o.append(B.render_items(lec))
    o.append("</section>")
    return "".join(o)


def bloc_document(niv, page, axe):
    """Un document (séquence de livret, module de cahier) = un <details> replié."""
    n = page.n_items
    lib = "Livret d'activités" if axe == "livret" else "Cahier de français"
    return (
        '<details class="doc" id="%s-%s">'
        '<summary><span>%s <span class="n">— %s</span></span>'
        '<span class="n">%s corrigé%s</span></summary>'
        '<div class="in">%s'
        '<p class="vers">%s<a href="%s/%s.html">Ouvrir la page détaillée de ce document</a></p>'
        "</div></details>"
        % (niv["slug"], page.slug, B.esc(page.titre), lib,
           B.num(n), "s" if n > 1 else "",
           "".join(bloc_lecon(l) for l in page.lecons),
           B.ico("i-link"), niv["slug"], page.slug))


def main():
    niveaux = []
    total = 0
    for niv in B.NIVEAUX:
        pages, _ = (B.extract_1er(niv) if niv["cycle"] == "1er" else B.extract_2nd(niv))
        cahier, _ = B.extract_cahier(niv)
        n = sum(p.n_items for p in pages) + sum(p.n_items for p in cahier)
        if not n:
            continue                      # un niveau sans corrigé n'a pas de section
        total += n
        niveaux.append((niv, pages, cahier, n))

    n_docs = sum(len(p) + len(c) for _, p, c, _ in niveaux)
    n_fmt = B.num(total)

    title = ("Tous les corrigés de français 6ᵉ à Terminale — %s exercices | VÉRITAS" % n_fmt)
    desc = ("L'intégralité des corrigés de français du programme MINESEC, de la 6ᵉ à la "
            "Terminale, réunis sur une seule page : %s exercices corrigés, %d documents, "
            "cahiers et livrets d'activités. Gratuit, sans inscription." % (n_fmt, n_docs))
    crumbs = [("Accueil", B.SITE), ("Corrigés des manuels", B.SITE + "/corriges/"),
              ("Tous les corrigés", URL)]
    h = B.head(title, desc, URL, depth=1,
               jsonld=B.jsonld_page(title, desc, URL, "6ᵉ à Terminale", crumbs))

    # Le <style> propre à la page se glisse juste avant </head>.
    h = h.replace("</head>", STYLE + "\n</head>")

    som = "".join('<a href="#%s">%s <span class="n">%s</span></a>'
                  % (niv["slug"], B.esc(niv["label"]), B.num(n))
                  for niv, _, _, n in niveaux)

    body = [
        '<header class="top"><span class="badge">Espace Manuels · Corrigés</span>'
        "<h1>Tous les corrigés de français — 6ᵉ à Terminale</h1>"
        "<p>%s exercices corrigés, %d documents, %d niveaux : l'intégralité des corrigés "
        "des cahiers et livrets du Centre VÉRITAS, réunis sur une seule page. "
        "Programme MINESEC.</p></header>" % (n_fmt, n_docs, len(niveaux)),
        '<div class="wrap">',
        # Même ordre que les pages de séquence et les index de niveau :
        # l'encadré d'abord, le fil d'Ariane ensuite.
        '<div class="intro">' + B.ico("i-target", "i lg")
        + " <strong>La règle d'or :</strong> on cherche d'abord, on compare ensuite. "
          "Chaque document se déplie d'un clic, et chaque corrigé reste masqué tant que "
          "tu ne cliques pas — c'est fait exprès. Pour consulter un document seul, "
          'suis le lien « page détaillée » en bas de son bloc.</div>',
        '<p class="crumb"><a href="%s/">Accueil</a> › <a href="./">Corrigés</a> › '
        "Tous les corrigés</p>" % B.SITE,
        '<nav class="niveaux">%s</nav>' % som,
    ]

    for niv, pages, cahier, n in niveaux:
        ex = (" · Préparation au <strong>%s</strong>" % B.esc(niv["examen"])) if niv["examen"] else ""
        body.append('<section class="niv" id="%s">' % niv["slug"])
        body.append('<h2 class="sec">%s</h2>' % B.esc(niv["long"]))
        body.append('<p class="note">%s · <strong>%s</strong> corrigés · %d document%s%s</p>'
                    % (B.esc(niv["manuel"]), B.num(n), len(pages) + len(cahier),
                       "s" if len(pages) + len(cahier) > 1 else "", ex))
        for p in cahier:
            body.append(bloc_document(niv, p, "cahier"))
        for p in pages:
            body.append(bloc_document(niv, p, "livret"))
        body.append('<a class="haut" href="#">↑ Revenir au sommaire</a>')
        body.append("</section>")

    body.append('<p class="note">Ces corrigés accompagnent les cahiers et livrets du Centre '
                "VÉRITAS : ils en donnent les corrections, jamais les énoncés. Les exercices, "
                "les textes d'auteur et les leçons sont dans les ouvrages — vendus en librairie "
                "ou accessibles par abonnement ; la conduite de classe et les barèmes détaillés, "
                "dans le Guide pédagogique de l'enseignant.</p>")
    body.append("</div>")

    doc = h + "\n".join(body) + B.foot(depth=1)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(doc)

    print("  ✓ corriges/tous-les-corriges.html")
    print("    %s corrigés · %d documents · %d niveaux · %.1f Mo"
          % (n_fmt, n_docs, len(niveaux), os.path.getsize(OUT) / 1048576))
    return OUT


if __name__ == "__main__":
    main()
