#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/carte_narrative_svg.py — LE SCHÉMA NARRATIF D'UN CAHIER, EN SVG

    python tools/carte_narrative_svg.py --build <dossier> --slug tartuffe \\
        --sortie <dossier>/img/tartuffe/narratif.svg

POURQUOI CE SCRIPT PLUTÔT QU'UNE IMAGE DE PLUS
  Trois cahiers sur neuf n'avaient pas de schéma narratif : Tartuffe, Au cœur
  des ténèbres et Poèmes sauvages. Les six autres en ont un, et l'élève qui
  passe d'un cahier à l'autre attend la même figure au même endroit.

  Mais la figure manquante NE S'INVENTE PAS. Chacun de ces trois cahiers
  contient DÉJÀ son schéma, rédigé par l'auteur, sous la forme d'un tableau
  « étape / contenu » à la section 5.3. Ce script lit ce tableau et le met en
  forme : le texte de la figure est celui du cahier, mot pour mot. Dessiner
  autre chose reviendrait à prêter à l'auteur une analyse qu'il n'a pas écrite.

  ⚠️ Corollaire : là où l'auteur n'a rien écrit, on ne produit rien. Poèmes
  sauvages n'a pas de schéma actanciel parce qu'un recueil poétique n'a pas
  d'actants — le cahier ne prononce jamais le mot. Ce vide est une décision
  pédagogique, pas un oubli à combler.

POURQUOI DU SVG, ET POURQUOI PAS DE POLICE DE MARQUE
  La figure est affichée par `<img src="…">`. Un document SVG chargé ainsi est
  ISOLÉ : il ne voit ni le CSS de la page, ni les polices Google qu'elle
  charge. Écrire `font-family: 'Baloo 2'` y produirait un repli silencieux —
  et, la police de repli étant plus large, du texte débordant de ses cadres.
  On s'en tient donc à une pile système, et on VÉRIFIE le rendu sur le PDF.

  Le retour à la ligne est fait ici, à la main : SVG 1.1 ne sait pas envelopper
  du texte. La largeur d'un caractère est estimée par classe (les « i » et les
  « l » ne pèsent pas un « m ») ; la marge de sécurité est prise sur la largeur
  du cadre, jamais sur la taille du texte.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

for _f in (sys.stdout, sys.stderr):
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

LARGEUR = 960                       # px de dessin ; le SVG est mis à l'échelle
MARGE = 28
PASTILLE = 30                       # rayon du rond numéroté
GOUTTIERE = 22                      # entre la pastille et le texte
CORPS_TITRE, CORPS_TEXTE = 22, 18
INTERLIGNE = 25

# Largeur moyenne d'un caractère, en fraction du corps. Mesuré grossièrement
# sur une pile système : les capitales et les chiffres tirent la moyenne vers
# le haut, les espaces et la ponctuation vers le bas.
ETROITS = set("iljItfr.,;:!'’\"()[]| ")
LARGES = set("mwMWQ@%")


def largeur_texte(t: str, corps: int) -> float:
    u = 0.0
    for c in t:
        u += 0.30 if c in ETROITS else 0.72 if c in LARGES else 0.52
    return u * corps


def envelopper(t: str, corps: int, largeur: float) -> list[str]:
    """Découpe au mot près, sans jamais couper un mot en deux."""
    lignes, courante = [], ""
    for mot in t.split():
        essai = (courante + " " + mot).strip()
        if courante and largeur_texte(essai, corps) > largeur:
            lignes.append(courante)
            courante = mot
        else:
            courante = essai
    if courante:
        lignes.append(courante)
    return lignes or [""]


def ech(t: str) -> str:
    return (t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def cellule(c: dict) -> str:
    return " ".join("".join(r.get("x", "") for r in p)
                    for p in (c.get("paras") or [])).strip()


def paires_aplaties(paras: list) -> list:
    """(étape, contenu) reconstitués depuis des paragraphes qui alternent.

    Une étape est courte et ne se termine pas par un point ; son contenu est
    plus long qu'elle. Les deux premiers paragraphes sont l'en-tête du tableau
    perdu (« Étape… » / « Contenu… ») et se reconnaissent au même critère : on
    les écarte quand le second est, lui aussi, court.
    """
    p = list(paras)
    if len(p) >= 2 and len(p[0]) < 60 and len(p[1]) < 60:
        p = p[2:]
    out = []
    for i in range(0, len(p) - 1, 2):
        etape, contenu = p[i], p[i + 1]
        if len(etape) >= 60 or etape.endswith(".") or len(contenu) <= len(etape):
            break
        out.append((etape, contenu))
    return out


def etapes_de(blocs: list, section: str) -> tuple[str, list[tuple[str, str]]]:
    """Le tableau « étape / contenu » de la section demandée (ex. « 5.3 »).

    On prend le PREMIER tableau à deux colonnes qui suit le titre : c'est la
    forme que les neuf cahiers partagent. Sa ligne d'en-tête est écartée.
    """
    titre, dedans, table, paras = "", False, None, []
    for b in blocs:
        t = b.get("t")
        if t == "h2":
            x = b.get("x", "").strip()
            dedans = x.startswith(section)
            if dedans:
                titre = x
            continue
        if not dedans:
            continue
        if t == "table" and table is None:
            rows = b.get("rows") or []
            if rows and len(rows[0]) >= 2:
                table = rows
        elif t == "p":
            v = "".join(r.get("x", "") for r in b.get("r") or []).strip()
            if v:
                paras.append(v)
    if not table:
        # REPLI — LE TABLEAU APLATI. « Au cœur des ténèbres » écrit son schéma
        # non pas en tableau mais en paragraphes qui alternent : deux lignes
        # d'en-tete, puis (etape courte, contenu long) a repetition. La
        # structure existe, elle a seulement perdu sa grille en chemin.
        # On la reconnait a l'alternance, et on s'arrete des qu'elle se rompt —
        # ce qui ecarte d'office la remarque finale, qui suit un contenu long.
        return titre, paires_aplaties(paras)
    lignes = [(cellule(r[0]), cellule(r[1])) for r in table if len(r) >= 2]
    # L'en-tête ne porte pas d'étape : « Étape », « Moment », « Temps »…
    if lignes and len(lignes[0][1]) < 24 and lignes[0][1].lower() in (
            "contenu", "contenu dans le récit", "ce qu’il apporte au poème"):
        lignes = lignes[1:]
    return titre, [(a, b) for a, b in lignes if a and b]


def dessiner(titre: str, etapes: list, teinte: str, pale: str, oeuvre: str) -> str:
    x_texte = MARGE + PASTILLE * 2 + GOUTTIERE
    largeur_dispo = LARGEUR - x_texte - MARGE - 18

    # PAS DE TITRE DANS LA FIGURE. Elle est posée juste sous « 5.3 Schéma
    # dramatique » et suivie de sa légende : un titre interne répéterait deux
    # fois la même chose sur la même page. Le nom reste dans l'aria-label,
    # pour qui lit la figure hors de son cahier.
    blocs, y = [], MARGE
    for i, (nom, contenu) in enumerate(etapes, 1):
        l_nom = envelopper(nom, CORPS_TITRE, largeur_dispo)
        l_txt = envelopper(contenu, CORPS_TEXTE, largeur_dispo)
        h = 16 + len(l_nom) * (CORPS_TITRE + 6) + 6 + len(l_txt) * INTERLIGNE + 16
        h = max(h, PASTILLE * 2 + 12)
        blocs.append((i, l_nom, l_txt, y, h))
        y += h + 14

    hauteur = y + MARGE - 14
    o = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
         'width="%d" height="%d" role="img" aria-label="%s">'
         % (LARGEUR, hauteur, LARGEUR, hauteur, ech(titre + " — " + oeuvre)),
         '<style>'
         'text{font-family:"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}'
         '.n{font-weight:700;fill:#ffffff}'
         '.t{font-weight:700;fill:%s}' % teinte,
         '.c{fill:#23282D}'
         '.h{font-weight:700;fill:%s}' % teinte,
         '</style>',
         '<rect width="%d" height="%d" rx="18" fill="#ffffff"/>' % (LARGEUR, hauteur)]

    # Le fil qui relie les étapes, tracé sous les pastilles.
    if blocs:
        cx = MARGE + PASTILLE
        o.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" '
                 'stroke-width="3" stroke-linecap="round"/>'
                 % (cx, blocs[0][3] + PASTILLE, cx,
                    blocs[-1][3] + min(blocs[-1][4], PASTILLE * 2) - PASTILLE, pale))

    for i, l_nom, l_txt, y0, h in blocs:
        o.append('<rect x="%d" y="%d" width="%d" height="%d" rx="12" fill="%s"/>'
                 % (x_texte - 16, y0, LARGEUR - (x_texte - 16) - MARGE, h, pale))
        cy = y0 + min(h, PASTILLE * 2 + 12) / 2 + 2
        o.append('<circle cx="%d" cy="%d" r="%d" fill="%s"/>'
                 % (MARGE + PASTILLE, cy, PASTILLE, teinte))
        o.append('<text class="n" x="%d" y="%d" font-size="24" text-anchor="middle">%d</text>'
                 % (MARGE + PASTILLE, cy + 8, i))
        yy = y0 + 16 + CORPS_TITRE
        for l in l_nom:
            o.append('<text class="t" x="%d" y="%d" font-size="%d">%s</text>'
                     % (x_texte, yy, CORPS_TITRE, ech(l)))
            yy += CORPS_TITRE + 6
        yy += 4
        for l in l_txt:
            o.append('<text class="c" x="%d" y="%d" font-size="%d">%s</text>'
                     % (x_texte, yy, CORPS_TEXTE, ech(l)))
            yy += INTERLIGNE
    o.append('</svg>')
    return "\n".join(o)


def teintes(build: Path, slug: str) -> tuple[str, str, str]:
    src = (build / "oeuvres.js").read_text(encoding="utf-8")
    i = src.find("slug: '%s'" % slug)
    bloc = src[i:i + 900]

    def champ(k, d):
        m = re.search(k + r":\s*'([^']*)'", bloc)
        return m.group(1) if m else d
    return champ("teinte", "#142554"), champ("teintePale", "#EAF6F8"), champ("titre", slug)


def main() -> int:
    a = argparse.ArgumentParser(description="Schéma narratif d'un cahier, en SVG.")
    a.add_argument("--build", required=True)
    a.add_argument("--slug", required=True)
    a.add_argument("--section", default="5.3")
    a.add_argument("--sortie", default="")
    o = a.parse_args()

    build = Path(o.build)
    blocs = json.loads((build / ("content-%s.json" % o.slug)).read_text(encoding="utf-8"))
    titre, etapes = etapes_de(blocs, o.section)
    if not etapes:
        print("  ✗ %s : aucun tableau « étape / contenu » en %s — rien à dessiner"
              % (o.slug, o.section))
        return 1

    teinte, pale, oeuvre = teintes(build, o.slug)
    svg = dessiner(titre, etapes, teinte, pale, oeuvre)
    cible = Path(o.sortie) if o.sortie else (build / "img" / o.slug / "narratif.svg")
    cible.parent.mkdir(parents=True, exist_ok=True)
    cible.write_text(svg, encoding="utf-8")
    print("  ✓ %-11s %d étapes · %s · %d Ko"
          % (o.slug, len(etapes), titre[:34], len(svg.encode("utf-8")) // 1024))
    for n, (nom, _c) in enumerate(etapes, 1):
        print("        %d. %s" % (n, nom[:60]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
