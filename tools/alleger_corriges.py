# -*- coding: utf-8 -*-
"""Allège `corriges/tous-les-corriges.html` et `corriges/livret-a-completer.html`.

Pourquoi (16/10/2026, mesuré en production)
    tous-les-corriges.html : 11 Mo bruts, 2,1 Mo compressés, 5,6 s ; le livret à
    compléter : 3,2 Mo bruts, 543 Ko compressés. Sur un téléphone en 3G, c'est
    une page qui ne s'ouvre pas. Or ces deux pages RÉPÈTENT mot pour mot les
    pages détaillées de corriges/ : chaque document y porte déjà le lien
    « Ouvrir la page détaillée », et l'audit du 16/10 a vérifié que les 125
    documents ont, dans leur page détaillée, exactement les mêmes leçons et le
    même nombre de corrigés.

Ce que fait l'outil
    Chaque <details class="doc"> garde son titre, son nombre de corrigés et son
    lien vers la page détaillée ; son contenu (les leçons) est retiré du HTML
    servi et CHARGÉ À L'OUVERTURE depuis la page détaillée — les mêmes
    <section class="lec">, donc le même rendu, les mêmes corrigés masqués, et
    jamais un énoncé (règle des corrigés en ligne). Sans JavaScript, ou si le
    chargement échoue, le lien vers la page détaillée reste là.

    Le contrôle d'intégrité est fait AVANT toute écriture : si une page
    détaillée manque ou ne porte pas le même nombre de corrigés que le bloc
    qu'elle remplace, l'outil refuse et n'écrit rien.

    Idempotent : une page déjà allégée est laissée telle quelle.

Usage : python tools/alleger_corriges.py   (après build_page_unique.py et
        build_page_livret.py, qui l'appellent eux-mêmes)
"""
import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ["corriges/tous-les-corriges.html", "corriges/livret-a-completer.html"]

DOC = re.compile(
    r'<details class="doc" id="(?P<id>[^"]+)">(?P<sum><summary>.*?</summary>)'
    r'<div class="in">(?P<corps>.*?)(?P<vers><p class="vers">.*?<a href="(?P<lien>[^"]+)">.*?</p>)'
    r'</div></details>', re.S)

MARQUE = "<!--vrt-corriges-a-la-demande-->"

SCRIPT = MARQUE + """<script>
/* Corrigés chargés à l'ouverture depuis la page détaillée (tools/alleger_corriges.py). */
(function(){
  function charger(d){
    if(d.getAttribute('data-ok'))return;
    d.setAttribute('data-ok','1');
    var vers=d.querySelector('p.vers'),att=d.querySelector('p.vrt-att');
    if(!att){att=document.createElement('p');att.className='note vrt-att';vers.parentNode.insertBefore(att,vers);}
    att.textContent='Chargement des corrigés…';
    fetch(d.getAttribute('data-src'),{credentials:'same-origin'})
      .then(function(r){if(!r.ok)throw new Error(r.status);return r.text();})
      .then(function(t){
        var page=new DOMParser().parseFromString(t,'text/html');
        var lecons=page.querySelectorAll('section.lec');
        if(!lecons.length)throw new Error('vide');
        var fr=document.createDocumentFragment();
        for(var i=0;i<lecons.length;i++)fr.appendChild(document.importNode(lecons[i],true));
        att.parentNode.replaceChild(fr,att);
      })
      .catch(function(){
        att.textContent='Les corrigés n’ont pas pu être chargés ici : ouvre la page détaillée juste en dessous.';
        d.removeAttribute('data-ok');
      });
  }
  document.addEventListener('toggle',function(e){
    var d=e.target;
    if(d&&d.matches&&d.matches('details.doc[data-src]')&&d.open)charger(d);
  },true);
  var ouverts=document.querySelectorAll('details.doc[data-src][open]');
  for(var i=0;i<ouverts.length;i++)charger(ouverts[i]);
})();
</script>
"""


def alleger(rel):
    chemin = os.path.join(ROOT, rel)
    s = io.open(chemin, encoding="utf-8").read()
    if MARQUE in s:
        print("  = %s déjà allégée" % rel)
        return True
    base = os.path.dirname(chemin)
    blocs = list(DOC.finditer(s))
    if not blocs:
        print("  ✗ %s : aucun document reconnu — rien écrit" % rel)
        return False
    erreurs = []
    for m in blocs:
        cible = os.path.join(base, m.group("lien"))
        if not os.path.isfile(cible):
            erreurs.append("page détaillée absente : " + m.group("lien"))
            continue
        d = io.open(cible, encoding="utf-8").read()
        for motif in ('<details class="sol"', '<section class="lec"'):
            if m.group("corps").count(motif) != d.count(motif):
                erreurs.append("écart %s dans %s" % (motif, m.group("lien")))
    if erreurs:
        print("  ✗ %s : %d écart(s), rien écrit" % (rel, len(erreurs)))
        for e in erreurs[:10]:
            print("      " + e)
        return False

    def remplace(m):
        return ('<details class="doc" id="%s" data-src="%s">%s<div class="in">%s</div></details>'
                % (m.group("id"), m.group("lien"), m.group("sum"), m.group("vers")))

    neuf = DOC.sub(remplace, s)
    neuf = neuf.replace("</body>", SCRIPT + "</body>", 1)
    io.open(chemin, "w", encoding="utf-8", newline="").write(neuf)
    print("  ✓ %s : %d documents à la demande · %.1f Mo → %.2f Mo"
          % (rel, len(blocs), len(s.encode("utf-8")) / 1048576, len(neuf.encode("utf-8")) / 1048576))
    return True


def main():
    # Console Windows (cp1252) : « ✓ » et « → » faisaient planter l'affichage
    # APRÈS l'écriture d'une page, avant de traiter la suivante.
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ok = all([alleger(p) for p in PAGES])
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
