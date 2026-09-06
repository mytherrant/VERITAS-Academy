#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/lier_oeuvres_cahiers.py — DE LA FICHE D'ŒUVRE AU CAHIER QUI VA AVEC

    python tools/lier_oeuvres_cahiers.py
    python tools/lier_oeuvres_cahiers.py --controle     # ne rien écrire

LE PROBLÈME, EN UNE PHRASE
  Le site publie vingt-et-une fiches d'œuvre — « Tartuffe : résumé, thèmes,
  citation clé » — et neuf cahiers qui étudient précisément ces œuvres. Les
  deux ne se parlaient pas. Pas un lien, pas une mention.

POURQUOI C'EST LE LEVIER LE PLUS RENTABLE
  Ces fiches sont ce qu'un élève tape réellement dans Google : « Tartuffe
  résumé », « Balafon thèmes », « Ngum a Jemea personnages ». Elles sont
  courtes, indexables, et déjà en ligne depuis des mois. Le cahier, lui, est
  neuf et ne connaît personne.

  Un lien depuis la fiche vers le cahier fait deux choses d'un coup :
    · il envoie au cahier l'autorité qu'une page ancienne a accumulée, ce
      qu'aucun mot-clé posé sur la page neuve ne peut faire seul ;
    · il met l'offre exactement là où le besoin s'exprime — quelqu'un qui
      cherche « Tartuffe résumé » la veille d'un devoir est précisément le
      client du cahier.

CE QU'ON N'AJOUTE PAS, ET POURQUOI
  Pas de JSON-LD `Product` sur la fiche : le produit a sa page, avec sa
  canonique. Deux pages qui déclarent le même produit se font concurrence dans
  l'index au lieu de s'additionner.
  Pas de promesse chiffrée non plus (« +30 % de réussite ») : on n'annonce que
  ce que le cahier contient.

IDEMPOTENT
  Le bloc porte une marque. Relancer l'outil le remplace au lieu de l'empiler —
  sans quoi trois exécutions laisseraient trois encadrés identiques.
"""

import argparse
import io
import re
import sys
from pathlib import Path

for _f in (sys.stdout, sys.stderr):          # console Windows en cp1252
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

RACINE = Path(__file__).resolve().parent.parent
OEUVRES = RACINE / "oeuvres"
MARQUE = "vrt-cahier-oeuvre"

# fiche d'œuvre → (slug du cahier, niveau affiché, prix)
LIENS = {
    "2nde-tartuffe.html":          ("oeuvre-tartuffe",   "2ⁿᵈᵉ", 1000),
    "2nde-tribus-capitoline.html": ("oeuvre-capitoline", "2ⁿᵈᵉ", 1000),
    "2nde-poemes-sauvages.html":   ("oeuvre-poemes",     "2ⁿᵈᵉ", 1000),
    "1ere-balafon.html":           ("oeuvre-balafon",    "1ʳᵉ",  1200),
    "1ere-lion-perle.html":        ("oeuvre-lionperle",  "1ʳᵉ",  1200),
    "1ere-coeur-tenebres.html":    ("oeuvre-tenebres",   "1ʳᵉ",  1200),
    "tle-ngum-jemea.html":         ("oeuvre-ngum",       "Tˡᵉ",  1300),
    "tle-stances-poemes.html":     ("oeuvre-stances",    "Tˡᵉ",  1300),
    "tle-vieux-negro.html":        ("oeuvre-vieuxnegre", "Tˡᵉ",  1300),
}


def bloc(slug, niveau, prix, titre):
    p = format(prix, ",").replace(",", " ")
    return (
        '\n<section class="%s" style="margin:26px 0;padding:18px 20px;'
        'border:1px solid #e6dcc6;border-left:4px solid #d9b44a;border-radius:12px;'
        'background:#fdfaf3">\n'
        '<h2 style="margin:0 0 8px;font-size:19px">Le cahier de l’œuvre — %s</h2>\n'
        '<p style="margin:0 0 10px;line-height:1.65">Tout <em>%s</em> en un cahier '
        'qu’on remplit en ligne : six lectures méthodiques, le texte de l’auteur '
        '<strong>numéroté ligne à ligne</strong>, quatre devoirs entièrement rédigés au '
        'format de l’épreuve, et les questions auxquelles on répond dans la page — '
        'la correction s’ouvre quand on a cherché.</p>\n'
        '<p style="margin:0"><a href="/livrets/%s.html" '
        'style="display:inline-block;padding:9px 16px;border-radius:8px;'
        'background:#A84200;color:#fff;text-decoration:none;font-weight:600">'
        'Ouvrir le cahier — %s FCFA</a>\n'
        '<a href="/livrets/apercu.html?o=%s" '
        'style="display:inline-block;margin-left:12px;padding:9px 4px;'
        'color:#A84200;font-weight:600">Essayer 2 leçons gratuitement →</a></p>\n'
        '</section>\n' % (MARQUE, niveau, titre, slug, p, slug)
    )


def titre_de(html):
    m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S)
    return re.sub(r"<[^>]+>", "", m.group(1)).strip() if m else ""


def raccourcir_titre(t):
    """Un titre que Google coupe perd sa fin — et la fin porte le niveau.

    Les fiches d'œuvre suivent un bon gabarit : « Œuvre — Auteur : analyse,
    résumé & fiche (Niveau) | VÉRITAS ». Il devient trop long dès que l'œuvre
    ou l'auteur l'est : « Ngum a Jemea. La Foi Inébranlable de Rudolph Dualla
    Manga — David Mbanga Eyombwan : … » faisait 129 signes pour 60 affichés.
    Ce qui tombait était « (Terminale) », c'est-à-dire le mot qui qualifie la
    recherche.

    On sacrifie donc dans l'ordre du moins utile au plus utile :
      ① la signature de marque — reconnaissable, mais pas cherchée ;
      ② l'auteur — on cherche « Tartuffe », rarement « Molière » seul ;
      ③ le sous-titre de l'œuvre, après le premier point.
    Le nom de l'œuvre, les mots « analyse, résumé, fiche » et le niveau
    survivent à toutes les coupes : ce sont eux, la requête."""
    if len(t) <= 60:
        return t
    t2 = re.sub(r"\s*\|\s*VÉRITAS\s*$", "", t)                     # ①
    if len(t2) <= 60:
        return t2
    t3 = re.sub(r"^(.*?)\s+—\s+[^:]+:", r"\1 :", t2)                # ②
    if len(t3) <= 60:
        return t3
    m = re.match(r"^([^.:]+)[.:]\s", t3)                            # ③
    if m:
        t4 = m.group(1).strip() + " : " + t3.split(":", 1)[-1].strip()
        if len(t4) <= 60:
            return t4
        t3 = t4
    return t3[:59].rsplit(" ", 1)[0] + "…" if len(t3) > 60 else t3


def main():
    ap = argparse.ArgumentParser(description="Relier fiches d'œuvre et cahiers.")
    ap.add_argument("--controle", action="store_true",
                    help="ne rien écrire ; échouer s'il manque un lien")
    a = ap.parse_args()

    manquants, ecrites, inchangees = [], [], []

    # ── ① Les titres, sur TOUTES les fiches ─────────────────────────────────
    # Le maillage ci-dessous ne concerne que les neuf œuvres qui ont un cahier.
    # La longueur du titre, elle, concerne les vingt-et-une : ce sont toutes des
    # pages qui remontent dans Google, et un titre coupé y perd son niveau.
    longs = []
    for p in sorted(OEUVRES.glob("*.html")):
        html = p.read_text(encoding="utf-8")
        m = re.search(r"<title>([^<]*)</title>", html)
        if not m:
            continue
        court = raccourcir_titre(m.group(1))
        if court == m.group(1):
            continue
        if a.controle:
            longs.append(p.name + " (%d signes)" % len(m.group(1)))
            continue
        p.write_text(html.replace(m.group(0), "<title>%s</title>" % court, 1),
                     encoding="utf-8")
        ecrites.append(p.name + " (titre)")
    manquants.extend(longs)

    # ── ② Le lien vers le cahier, pour les neuf qui en ont un ───────────────
    for fichier, (slug, niveau, prix) in sorted(LIENS.items()):
        p = OEUVRES / fichier
        if not p.is_file():
            manquants.append(fichier + " (fiche absente)")
            continue
        # Le lien ne vaut que si la page de destination existe : un lien vers un
        # 404 coûte plus qu'il ne rapporte, à Google comme au visiteur.
        if not (RACINE / "livrets" / (slug + ".html")).is_file():
            manquants.append(fichier + " → livrets/" + slug + ".html absente")
            continue

        html = p.read_text(encoding="utf-8")
        neuf = bloc(slug, niveau, prix, titre_de(html) or slug)

        # ── L'IDEMPOTENCE SE MESURE SUR LE FICHIER, PAS SUR L'INTENTION ──────
        # Première version : le motif consommait `\n?` de part et d'autre et
        # remplaçait par un `\n`. Or ces pages sont en CRLF. Le `\r` survivait,
        # et chaque exécution ajoutait une ligne vide : le bloc restait bien
        # unique — c'est ce que je vérifiais — mais le FICHIER changeait à
        # chaque passage, si bien que `--controle` réclamait éternellement un
        # lien pourtant présent, et l'aurait fait rougir la CI sans fin.
        # On consomme donc les blancs des deux côtés, quel que soit le style de
        # fin de ligne, et on repose un séparateur unique.
        html_sans = re.sub(
            r'(?:\r?\n)*<section class="%s".*?</section>(?:\r?\n)*' % MARQUE,
            "\n", html, flags=re.S)

        i = html_sans.rfind("<footer")
        if i < 0:
            manquants.append(fichier + " (pas de <footer> où s'ancrer)")
            continue
        sortie = html_sans[:i] + neuf + html_sans[i:]

        if sortie == html:
            inchangees.append(fichier)
            continue
        if a.controle:
            manquants.append(fichier + " (lien absent ou périmé)")
            continue
        p.write_text(sortie, encoding="utf-8")
        ecrites.append(fichier)

    if a.controle:
        if manquants:
            for m in manquants:
                print("::error title=Fiche d'oeuvre sans son cahier::" + m)
            print("\n✗ %d fiche(s) ne mènent pas à leur cahier." % len(manquants))
            return 1
        print("✓ Les %d fiches d'œuvre mènent à leur cahier." % len(LIENS))
        return 0

    for f in ecrites:
        print("  + " + f)
    if manquants:
        for m in manquants:
            print("  ✗ " + m)
    print("\n%d fiche(s) liée(s), %d déjà à jour, %d en défaut."
          % (len(ecrites), len(inchangees), len(manquants)))
    return 1 if manquants else 0


if __name__ == "__main__":
    sys.exit(main())
