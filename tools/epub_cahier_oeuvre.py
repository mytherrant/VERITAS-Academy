#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/epub_cahier_oeuvre.py — UN CAHIER D'ŒUVRE INTÉGRALE → EPUB (mode texte)

    python tools/epub_cahier_oeuvre.py --source "<dossier maquette>" \\
        --slug tartuffe --sortie build/tartuffe.epub

POURQUOI UN EPUB ALORS QUE LE PDF EXISTE DÉJÀ
  Le lecteur de VÉRITAS a deux modes (api/secure_pdf.php et api/secure_epub.php)
  et le mode TEXTE est celui par défaut sous 720 px — c'est-à-dire ce que voit
  la majorité des clients, qui lisent au téléphone. Le mode pages leur servirait
  une image de 150 Ko par page à agrandir au doigt. Le mode texte se recompose à
  la taille de l'écran et pèse quelques kilo-octets.

  Les deux sortent de la MÊME source (`content-<slug>.json`) : le papier et
  l'écran ne peuvent donc pas diverger. C'est la raison d'être de ce script —
  reconstruire le texte à partir des blocs, jamais le ré-extraire du PDF.

CE QUE LE MODE TEXTE NE PEUT PAS PORTER, ET POURQUOI IL FAUT LE SAVOIR
  `tools/prepare_epub_reader.py` n'accepte qu'une liste courte de balises
  (p, h1-h4, hr, br, div, span, blockquote, em/i, strong/b, small, sup) et
  supprime tout attribut sauf `class`. Ce n'est pas une limite à contourner :
  le fragment part vers `innerHTML`, et l'assainir une fois hors ligne vaut
  mieux que de le filtrer à chaque requête. Conséquences assumées :
    · AUCUNE IMAGE. Les 40 cartes mentales, frises et schémas actanciels ne
      sont pas dans le mode texte. Ils restent dans le mode pages, et ce sont
      eux qu'on met en avant sur la page de démonstration.
    · PAS DE <table>. Les tableaux sont recomposés en `div`/`span` porteurs de
      classes (`vtab`, `vtr`, `vtd`), stylées dans app.css sous `.sread-chbody`.
      Sans CSS ils restent lisibles, ligne par ligne : c'est le repli voulu.

DÉCOUPE EN CHAPITRES
  Un `h1` ouvre un chapitre. Les cahiers en portent seize : trois liminaires
  (mode d'emploi, sommaire, note aux enseignants) puis les treize parties.
  `prepare_epub_reader.py` place l'extrait gratuit sur le PREMIER chapitre
  non liminaire — donc jamais sur la page de titre, et jamais au milieu du
  cours. Le seuil qu'il applique est « moins de 120 mots = liminaire ».
"""
from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys
import zipfile
from pathlib import Path

for _f in (sys.stdout, sys.stderr):
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Les blocs qui ouvrent un chapitre, et ceux qui portent du texte enrichi.
TITRES = ("h1", "h2", "h3")
LISTES = ("ul", "ol")


def ech(t: str) -> str:
    """Échappe pour du XHTML. `html.escape` laisse les apostrophes typographiques
    intactes, ce qui est voulu : ce sont celles du texte de l'auteur."""
    return html.escape(t or "", quote=False)


def runs(bloc: dict) -> str:
    """Les fragments `{x, b, i}` d'un bloc, rendus en gras/italique."""
    out = []
    for r in bloc.get("r") or []:
        t = ech(r.get("x", ""))
        if not t:
            continue
        if r.get("b"):
            t = "<strong>%s</strong>" % t
        if r.get("i"):
            t = "<em>%s</em>" % t
        out.append(t)
    return "".join(out).strip()


def cellule(c: dict) -> str:
    """Une cellule : plusieurs paragraphes, chacun une liste de fragments."""
    morceaux = []
    for para in c.get("paras") or []:
        t = "".join(
            ("<strong>%s</strong>" % ech(r.get("x", ""))) if r.get("b")
            else ("<em>%s</em>" % ech(r.get("x", ""))) if r.get("i")
            else ech(r.get("x", ""))
            for r in para
        ).strip()
        if t:
            morceaux.append(t)
    return "<br/>".join(morceaux)


def tableau(bloc: dict) -> str:
    """Un tableau en div/span. La première ligne est traitée en en-tête quand
    toutes ses cellules sont en gras — c'est la convention de la maquette."""
    lignes = bloc.get("rows") or []
    if not lignes:
        return ""
    def toute_en_gras(row):
        frags = [r for c in row for p in (c.get("paras") or []) for r in p]
        return bool(frags) and all(r.get("b") for r in frags)

    out = ['<div class="vtab">']
    for i, row in enumerate(lignes):
        cls = "vtr vth" if (i == 0 and len(lignes) > 1 and toute_en_gras(row)) else "vtr"
        cells = "".join('<span class="vtd">%s</span>' % (cellule(c) or "&#160;") for c in row)
        out.append('<div class="%s">%s</div>' % (cls, cells))
    out.append("</div>")
    return "\n".join(out)


def chapitres(blocs: list) -> list:
    """Découpe la liste plate de blocs en chapitres ouverts par un `h1`.

    Tout ce qui précède le premier `h1` (la page de titre) forme un chapitre
    d'ouverture sans titre : le perdre effacerait les mentions d'édition et
    l'avertissement de droits, qui sont justement ce qu'on veut voir figurer.
    """
    chaps, courant = [], {"titre": "", "blocs": []}
    for b in blocs:
        if b.get("t") == "h1":
            if courant["blocs"]:
                chaps.append(courant)
            courant = {"titre": b.get("x", ""), "blocs": []}
        else:
            courant["blocs"].append(b)
    if courant["blocs"]:
        chaps.append(courant)
    return chaps


def corps_xhtml(chap: dict) -> str:
    """Les blocs d'un chapitre en XHTML. Les items de liste consécutifs sont
    regroupés : la source les livre à plat, un bloc `ul` par puce."""
    out, liste, type_liste = [], [], None

    def vider():
        nonlocal liste, type_liste
        if liste:
            out.append("<div class=\"vlist v%s\">%s</div>"
                       % (type_liste, "".join('<p class="vli">%s</p>' % i for i in liste)))
            liste, type_liste = [], None

    for b in chap["blocs"]:
        t = b.get("t")
        if t in LISTES:
            item = runs(b)
            if item:
                if type_liste and type_liste != t:
                    vider()
                type_liste = t
                liste.append(item)
            continue
        vider()
        if t in ("h2", "h3"):
            out.append("<%s>%s</%s>" % (t, ech(b.get("x", "")), t))
        elif t == "quote":
            c = runs(b)
            if c:
                out.append("<blockquote>%s</blockquote>" % c)
        elif t == "table":
            c = tableau(b)
            if c:
                out.append(c)
        elif t == "p":
            c = runs(b)
            if c:
                out.append("<p>%s</p>" % c)
    vider()
    return "\n".join(out)


GABARIT = ('<?xml version="1.0" encoding="utf-8"?>\n'
           '<!DOCTYPE html>\n'
           '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">\n'
           '<head><meta charset="utf-8"/><title>%s</title></head>\n'
           '<body>\n%s\n</body>\n</html>\n')


def construire(source: Path, slug: str, sortie: Path, meta: dict) -> dict:
    contenu = source / ("content-%s.json" % slug)
    if not contenu.is_file():
        raise SystemExit("contenu introuvable : %s" % contenu)
    blocs = json.loads(contenu.read_text(encoding="utf-8"))
    chaps = chapitres(blocs)

    docs = []
    for i, c in enumerate(chaps, start=1):
        titre = c["titre"] or meta["titre"]
        corps = corps_xhtml(c)
        if not corps.strip():
            continue
        entete = "<h1>%s</h1>\n" % ech(c["titre"]) if c["titre"] else ""
        docs.append(("ch%02d.xhtml" % len(docs), titre, GABARIT % (ech(titre), entete + corps)))

    if not docs:
        raise SystemExit("aucun chapitre produit pour %s" % slug)

    sortie.parent.mkdir(parents=True, exist_ok=True)
    uid = "urn:veritas:cahier:%s" % slug
    manifeste = "\n".join(
        '  <item id="c%d" href="%s" media-type="application/xhtml+xml"/>' % (i, n)
        for i, (n, _t, _x) in enumerate(docs))
    colonne = "\n".join('  <itemref idref="c%d"/>' % i for i in range(len(docs)))
    nav_items = "\n".join('   <li><a href="%s">%s</a></li>' % (n, ech(t))
                          for n, t, _x in docs)

    opf = ('<?xml version="1.0" encoding="utf-8"?>\n'
           '<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">\n'
           ' <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">\n'
           '  <dc:identifier id="uid">%s</dc:identifier>\n'
           '  <dc:title>%s</dc:title>\n'
           '  <dc:creator>%s</dc:creator>\n'
           '  <dc:language>fr</dc:language>\n'
           ' </metadata>\n'
           ' <manifest>\n'
           '  <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>\n'
           '%s\n'
           ' </manifest>\n'
           ' <spine>\n%s\n </spine>\n'
           '</package>\n') % (uid, ech(meta["titre"]), ech(meta["auteur"]), manifeste, colonne)

    nav = GABARIT % ("Sommaire",
                     '<nav epub:type="toc" xmlns:epub="http://www.idpf.org/2007/ops">\n'
                     '  <h1>Sommaire</h1>\n  <ol>\n%s\n  </ol>\n</nav>' % nav_items)

    with zipfile.ZipFile(sortie, "w") as z:
        # `mimetype` en premier et NON compressé : c'est la seule contrainte de
        # format que le zip d'un EPUB doit respecter à la lettre.
        z.writestr(zipfile.ZipInfo("mimetype"), "application/epub+zip",
                   compress_type=zipfile.ZIP_STORED)
        z.writestr("META-INF/container.xml",
                   '<?xml version="1.0" encoding="utf-8"?>\n'
                   '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n'
                   ' <rootfiles><rootfile full-path="OEBPS/content.opf" '
                   'media-type="application/oebps-package+xml"/></rootfiles>\n</container>\n')
        z.writestr("OEBPS/content.opf", opf)
        z.writestr("OEBPS/nav.xhtml", nav)
        for nom, _t, xhtml in docs:
            z.writestr("OEBPS/" + nom, xhtml)

    mots = sum(len(re.sub(r"<[^>]+>", " ", x).split()) for _n, _t, x in docs)
    return {"chapitres": len(docs), "mots": mots, "octets": sortie.stat().st_size}


def lire_oeuvres(source: Path) -> dict:
    """Les métadonnées de `oeuvres.js`, lues sans exécuter le fichier."""
    src = (source / "oeuvres.js").read_text(encoding="utf-8")
    out, cle = {}, None
    for m in re.finditer(r"(slug|titre|auteur|classe|genre)\s*:\s*'((?:[^'\\]|\\.)*)'", src):
        champ, val = m.group(1), m.group(2).replace("\\'", "'")
        if champ == "slug":
            cle = val
            out[cle] = {"slug": val}
        elif cle:
            out[cle][champ] = val
    return out


def main() -> int:
    a = argparse.ArgumentParser(description="Cahier d'œuvre intégrale → EPUB")
    a.add_argument("--source", required=True, help="dossier de la maquette (content-*.json, oeuvres.js)")
    a.add_argument("--slug", default="", help="un seul cahier ; vide = les neuf")
    a.add_argument("--sortie", default="", help="fichier .epub ; vide = <source>/epub/<slug>.epub")
    o = a.parse_args()

    source = Path(o.source)
    infos = lire_oeuvres(source)
    slugs = [o.slug] if o.slug else list(infos)

    print("\nCAHIERS → EPUB (mode texte)\n")
    for s in slugs:
        i = infos.get(s)
        if not i:
            print("  ✗ %-12s inconnu dans oeuvres.js" % s)
            continue
        meta = {"titre": i.get("titre", s),
                "auteur": "Jacques Miterand TAKOU & Dominique Ambassa"}
        cible = Path(o.sortie) if o.sortie else (source / "epub" / (s + ".epub"))
        r = construire(source, s, cible, meta)
        print("  ✓ %-12s %2d chapitres · %6d mots · %4d Ko"
              % (s, r["chapitres"], r["mots"], r["octets"] // 1024))
    print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
