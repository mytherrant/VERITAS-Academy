# -*- coding: utf-8 -*-
"""Fabrique `corriges/livret-a-completer.html` : les corrigés du LIVRET À COMPLÉTER
(progression nationale), toutes les classes sur UNE page, un ONGLET par classe.

Jacques (06/10/2026) : « mets toutes ces séries de corrigés sur la même page avec les
onglets par classe et tu mets livret à compléter, progression nationale ».

Ce que la page contient.
    Les classes dont le corrigé est COMPLET (build_corriges.cahiers_2026 : audit sans
    item manquant) ; dans chaque onglet, les documents (évaluation diagnostique,
    séquences ou modules) repliés, et dans chacun les leçons au markup EXACT des pages
    détaillées (build_page_unique.bloc_lecon). Jamais un énoncé : seulement le repère
    que l'élève retrouve dans son livret, et le corrigé masqué.

Onglets sans dépendance.
    Le HTML servi porte TOUS les panneaux, visibles les uns sous les autres : sans
    JavaScript la page reste complète et indexable. Un script de quelques lignes
    transforme ensuite la barre en vrais onglets (role="tab", aria-selected, flèches
    gauche/droite), masque les panneaux inactifs et suit l'ancre, au chargement comme
    ensuite (#tle-a ouvre la Terminale A ; #tle-a-cahier-sequence-1 ouvre l'onglet qui
    contient ce document) : un lien du hub peut donc viser une classe précise.

Poids : mêmes leviers que tous-les-corriges.html (content-visibility, <details> fermés).

Usage : python tools/build_page_livret.py   (après build_corriges_2c.py ; build_corriges.py
        l'appelle aussi, comme la page « tous les corrigés »)
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import build_corriges as B          # noqa: E402
import build_page_unique as U       # noqa: E402

NOM = "livret-a-completer.html"
OUT = os.path.join(B.ROOT, "corriges", NOM)
URL = B.SITE + "/corriges/" + NOM
LIBELLE = "Livret à compléter — progression nationale"

STYLE = """<style>
.onglets{display:flex;flex-wrap:wrap;gap:6px;margin:18px 0 6px;padding:0;border-bottom:2px solid var(--line,#e3e6ee)}
.onglets a,.onglets button{font:600 14px/1.2 Poppins,system-ui,sans-serif;padding:10px 14px;border:1px solid var(--line,#e3e6ee);
  border-bottom:none;border-radius:10px 10px 0 0;background:#f6f7fb;color:#001136;text-decoration:none;cursor:pointer}
.onglets [aria-selected="true"]{background:#1e499b;color:#fff;border-color:#1e499b}
.onglets .n{font-weight:400;opacity:.8;margin-left:6px}
.panneau{padding-top:8px;content-visibility:auto;contain-intrinsic-size:auto 900px}
.panneau[hidden]{display:none}
details.doc{border:1px solid var(--line,#e3e6ee);border-radius:12px;margin:10px 0;background:#fff}
details.doc>summary{display:flex;justify-content:space-between;gap:10px;padding:12px 14px;cursor:pointer;font-weight:600}
details.doc>.in{padding:0 14px 12px}
details.doc .n{font-weight:400;color:#5b6275}
.vers{margin-top:10px;font-size:14px}
@media (max-width:520px){.onglets a,.onglets button{flex:1 1 30%;text-align:center;padding:9px 6px;font-size:13px}}
</style>"""

SCRIPT = """<script>
(function(){
  var barre=document.querySelector('.onglets'); if(!barre) return;
  var tabs=[].slice.call(barre.querySelectorAll('a[data-onglet]'));
  var pans=tabs.map(function(t){return document.getElementById(t.getAttribute('data-onglet'));});
  barre.setAttribute('role','tablist');
  function ouvrir(i,focus){
    tabs.forEach(function(t,k){
      var on=k===i; t.setAttribute('aria-selected',on?'true':'false'); t.tabIndex=on?0:-1;
      if(pans[k]) pans[k].hidden=!on;
    });
    if(focus) tabs[i].focus();
  }
  tabs.forEach(function(t,k){
    t.setAttribute('role','tab'); t.setAttribute('aria-controls',t.getAttribute('data-onglet'));
    if(pans[k]){pans[k].setAttribute('role','tabpanel');pans[k].setAttribute('aria-labelledby',t.id);}
    t.addEventListener('click',function(e){e.preventDefault();ouvrir(k,false);
      if(history.replaceState) history.replaceState(null,'','#'+t.getAttribute('data-onglet'));});
    t.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'){e.preventDefault();ouvrir((k+1)%tabs.length,true);}
      if(e.key==='ArrowLeft'){e.preventDefault();ouvrir((k-1+tabs.length)%tabs.length,true);}
    });
  });
  function suivre(){
    var h=(location.hash||'').slice(1), i=-1;
    tabs.forEach(function(t,k){ var p=pans[k];
      if(t.getAttribute('data-onglet')===h || (h && p && document.getElementById(h) && p.contains(document.getElementById(h)))) i=k; });
    return i;
  }
  var i0=suivre(); ouvrir(i0<0?0:i0,false);
  window.addEventListener('hashchange',function(){ var i=suivre(); if(i>=0) ouvrir(i,false); });
})();
</script>"""


def bloc_document(niv, page):
    n = page.n_items
    return ('<details class="doc" id="%s-%s"><summary><span>%s</span>'
            '<span class="n">%s corrigé%s</span></summary><div class="in">%s'
            '<p class="vers">%s<a href="%s/%s.html">Ouvrir la page détaillée de ce document</a></p>'
            '</div></details>'
            % (niv["slug"], page.slug, B.esc(page.titre), B.num(n), "s" if n > 1 else "",
               "".join(U.bloc_lecon(l) for l in page.lecons), B.ico("i-link"), niv["slug"], page.slug))


def classes():
    """[(niv, pages, total)] des classes COMPLÈTES, dans l'ordre 6ᵉ → Terminale."""
    import build_corriges_2c as C
    sols, _ = C.lire_tout()
    out = []
    for niv, n, _pages in B.cahiers_2026():
        pages, _ = C.pages_niveau(niv, sols)
        out.append((niv, pages, sum(p.n_items for p in pages)))
    return out


def main():
    cl = classes()
    if not cl:
        print("  · %s : aucune classe complète, page non générée" % NOM)
        return None
    total = sum(n for _, _, n in cl)
    nf = B.num(total)
    title = "%s : corrigés 6ᵉ → Terminale — %s exercices | VÉRITAS" % (LIBELLE, nf)
    desc = ("Corrigés du livret à compléter du Centre VÉRITAS, conforme à la progression nationale "
            "(MINESEC) : %s exercices corrigés, une classe par onglet. Les énoncés restent dans "
            "ton livret." % nf)
    crumbs = [("Accueil", B.SITE), ("Corrigés des manuels", B.SITE + "/corriges/"), (LIBELLE, URL)]
    h = B.head(title, desc, URL, depth=1, jsonld=B.jsonld_page(title, desc, URL, "6ᵉ à Terminale", crumbs))
    h = h.replace("</head>", STYLE + "\n</head>")

    onglets = "".join('<a id="o-%s" href="#%s" data-onglet="%s">%s<span class="n">%s</span></a>'
                      % (niv["slug"], niv["slug"], niv["slug"], B.esc(niv["label"]), B.num(n))
                      for niv, _, n in cl)
    body = [
        '<header class="top"><span class="badge">Espace Manuels · Corrigés</span>'
        "<h1>%s</h1><p>Les corrigés de ton livret à compléter, conforme à la progression nationale : "
        "%s exercices corrigés, une classe par onglet. Programme MINESEC · Cameroun.</p></header>"
        % (B.esc(LIBELLE), nf),
        '<div class="wrap">',
        '<div class="intro">' + B.ico("i-target", "i lg")
        + " <strong>La règle d'or :</strong> on cherche d'abord dans son livret, on compare ensuite. "
          "Choisis ta classe, déplie ta séquence : chaque corrigé reste masqué tant que tu ne "
          "cliques pas. Les énoncés sont dans ton livret, jamais ici.</div>",
        '<p class="crumb"><a href="%s/">Accueil</a> › <a href="./">Corrigés</a> › %s</p>'
        % (B.SITE, B.esc(LIBELLE)),
        '<nav class="onglets" aria-label="Classes">%s</nav>' % onglets,
    ]
    for niv, pages, n in cl:
        ex = (" · Préparation au <strong>%s</strong>" % B.esc(niv["examen"])) if niv.get("examen") else ""
        body.append('<section class="panneau" id="%s">' % niv["slug"])
        body.append('<h2 class="sec">%s</h2>' % B.esc(niv["long"]))
        body.append('<p class="note">Livret à compléter — progression nationale · <strong>%s</strong> '
                    'corrigés · %d document%s%s · <a href="%s/">page de la classe</a></p>'
                    % (B.num(n), len(pages), "s" if len(pages) > 1 else "", ex, niv["slug"]))
        body.extend(bloc_document(niv, p) for p in pages)
        body.append("</section>")
    body.append('<p class="note">Ces corrigés accompagnent le livret à compléter du Centre VÉRITAS : '
                "ils en donnent les corrections, jamais les énoncés. Les exercices, les textes d'auteur "
                "et les leçons sont dans le livret.</p>")
    body.append("</div>")
    doc = h + "\n".join(body) + SCRIPT + B.foot(depth=1)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(doc)
    print("  ✓ corriges/%s — %d classe(s) en onglets · %s corrigés · %.1f Mo"
          % (NOM, len(cl), nf, os.path.getsize(OUT) / 1048576))
    return OUT


if __name__ == "__main__":
    main()
