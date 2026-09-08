#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/couvertures_oeuvres_1c.py — LES QUATRE COUVERTURES, CORRIGÉES ET AU GABARIT

    python tools/couvertures_oeuvres_1c.py
    python tools/couvertures_oeuvres_1c.py --controle   # mesure, n'écrit rien

CE QUE FAIT CE SCRIPT
  Il prend les quatre couvertures fournies le 08/09/2026 et en fait ce que la
  boutique attend : `uploads/oeuvres/livret_oeuvres-<n>.jpg`, 1 200 × 1 600.

  Il corrige aussi DEUX FAUTES INCRUSTÉES DANS L'IMAGE. Elles ne se réparent
  pas dans un fichier de texte : elles sont peintes dans les pixels, sur la
  couverture d'un cahier de FRANÇAIS.

  ① « Lect·ures » — un caractère parasite entre le « t » et le « u », sur les
     QUATRE couvertures. On ne réécrit pas le mot : on RETIRE la colonne du
     glyphe fautif et on recolle ce qui suit. La police, la graisse, la
     couleur et le crénage restent ceux de l'original — réécrire à côté avec
     une police approchante se verrait plus que la faute.

  ② « 3é » au lieu de « 3ᵉ » sur la pastille de la 3ᵉ. Les trois autres
     couvertures portent bien « 6ᵉ », « 5ᵉ », « 4ᵉ » : c'est un accent aigu de
     trop, posé sur le e en exposant. On l'efface en repeignant sa boîte avec
     le rouge échantillonné autour — le fond est un coup de pinceau texturé,
     un rouge plat s'y verrait.

LE GABARIT, ET POURQUOI ON N'EN ROGNE PAS UN PIXEL
  Les sources sont en 2:3 (1280 × 1920), le site en 3:4 (1200 × 1600) — c'est
  le rapport des 87 autres couvertures, celui qui fait qu'une grille s'aligne.
  Onze pour cent d'écart : `couvertures_oeuvres.py` recadre au centre en deçà
  de six pour cent, et POSE au-delà. Ici, rogner emporterait le titre ou le
  bandeau du bas. On étire donc les bords latéraux — blancs en haut, verts en
  bas — ce qui prolonge la couverture sans rien inventer ni rien couper.

ON ÉCHOUE PLUTÔT QUE DE PRODUIRE
  Chaque correction vérifie d'abord qu'elle a bien trouvé ce qu'elle cherche :
  la signature de trois creux et deux hampes pour le glyphe parasite, une
  tache claire de la bonne taille pour l'accent. Une couverture retouchée au
  mauvais endroit part en production sans que rien ne le dise.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image

for _f in (sys.stdout, sys.stderr):
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

RACINE = Path(__file__).resolve().parent.parent
SOURCE = Path.home() / "Downloads"
SORTIE = RACINE / "uploads" / "oeuvres"

L, H = 1200, 1600

COUVERTURES = {
    "6e": "cameroon_schoolgirl_book_cover.webp",
    "5e": "cameroonian_village_golden_hour.jpg",
    "4e": "book_cover_photoreal_2.webp",
    "3e": "book_cover_photorealistic.jpg",
}


class Retouche(Exception):
    """La retouche n'a pas trouvé ce qu'elle venait corriger."""


def _sombre(px, x: int, y0: int, y1: int, seuil: int = 400) -> int:
    return sum(1 for y in range(y0, y1) if sum(px[x, y][:3]) < seuil)


def corriger_lectures(im: Image.Image) -> tuple[Image.Image, str]:
    """Retire le glyphe parasite de « Lect·ures ».

    Le bandeau du bas porte quatre entrées ; la première commence par ce mot.
    On le trouve par sa SIGNATURE et non par des coordonnées écrites en dur :
    trois hampes verticales pleines (le t, le glyphe fautif, le u) séparées par
    deux creux. Les quatre couvertures ont la même mise en page mais pas la
    même ligne de base — 1340, 1341, 1344 et 1352 — et des coordonnées fixes
    auraient donc retouché trois images à côté.
    """
    px = im.load()
    # La ligne la plus dense du bandeau : c'est celle du titre de la rubrique.
    y0 = max(range(1300, 1385),
             key=lambda y: sum(1 for x in range(220, 620) if sum(px[x, y][:3]) < 400))

    haut, bas = y0 - 16, y0 + 18

    # ── ON S'ANCRE SUR LE « t », PAS SUR UN RANG ────────────────────────────
    # Une première version prenait « le deuxième et le troisième creux » de la
    # fenêtre. Sur la 4ᵉ, un creux de plus apparaissait à gauche et tout le
    # comptage glissait d'un cran : la coupe tombait sur le « t » lui-même, et
    # rien ne l'aurait dit. Une seconde comptait les hampes « pleines », mais
    # la courbe d'un « c » atteint la même hauteur qu'une hampe et rentrait
    # dans le compte.
    #
    # Ce qui distingue vraiment le « t », c'est qu'il MONTE PLUS HAUT que le
    # reste du mot : avec le « L », ce sont les deux seules colonnes à
    # dépasser quinze pixels — vérifié identique sur les quatre couvertures.
    # On prend donc la dernière de ces colonnes hautes, et le glyphe fautif est
    # ce qui la suit, isolé par du blanc de part et d'autre.
    hautes = [x for x in range(220, 315) if _sombre(px, x, haut, bas) >= 15]
    if not hautes:
        raise Retouche("aucune hampe haute : ce n'est pas le mot attendu")
    t_fin = max(hautes)

    def creux_apres(a: int) -> int:
        for x in range(a, a + 40):
            if all(sum(px[x, y][:3]) >= 400 for y in range(haut, bas)):
                return x
        raise Retouche("pas de blanc après la hampe : lettres collées ?")

    debut = creux_apres(t_fin + 1)             # blanc entre le t et le glyphe
    # Le glyphe fautif : une hampe, forcément, entre ce blanc et le suivant.
    g = debut
    while _sombre(px, g, haut, bas) == 0:
        g += 1
    if _sombre(px, g, haut, bas) < 8 and max(
            _sombre(px, x, haut, bas) for x in range(g, g + 12)) < 8:
        raise Retouche("rien de plein après le t — le mot est peut-être déjà juste")
    fin = creux_apres(g + 4)                   # blanc entre le glyphe et le u

    largeur = fin - debut
    if not (8 <= largeur <= 20):
        raise Retouche(f"le glyphe fautif ferait {largeur} px — invraisemblable")

    # On ne décale QUE la ligne du titre. Le sous-titre, deux lignes plus bas,
    # est correct et ne doit pas bouger d'un pixel.
    y_haut, y_bas = y0 - 15, y0 + 16
    bande = im.crop((fin, y_haut, im.width, y_bas))
    im.paste(bande, (debut, y_haut))
    # La queue libérée reprend la couleur du fond, relevée juste à droite du
    # texte — le bandeau n'est pas d'un blanc pur.
    fond = im.getpixel((im.width - 40, y0))[:3]
    im.paste(fond, (im.width - largeur, y_haut, im.width, y_bas))
    return im, f"ligne {y0}, glyphe retiré en x[{debut},{fin}[ ({largeur} px)"


def corriger_accent(im: Image.Image) -> tuple[Image.Image, str]:
    """Efface l'accent aigu de « 3é » sur la pastille du niveau.

    L'accent est une tache CLAIRE isolée dans la pastille rouge, juste
    au-dessus du e. On la cherche par sa couleur et par le vide qui la sépare
    du e — et on refuse d'agir si l'on trouve autre chose qu'une petite tache.
    """
    px = im.load()
    # ⚠️ LA FENÊTRE SEULE NE SUFFIT PAS À ISOLER L'ACCENT. Prendre tous les
    # pixels clairs d'un rectangle donnait une « tache » de 119 × 39 px : le
    # blanc de la page, hors du coup de pinceau, y entrait avec l'accent. On
    # ne garde donc que les pixels clairs ENTOURÉS DE ROUGE — c'est ce qui
    # définit un signe posé dans la pastille — puis on en extrait la
    # composante connexe, qui est l'accent et rien d'autre.
    # La fenêtre s'arrête AVANT le e (qui commence vers y = 65) et avant le
    # bord droit du coup de pinceau : ce qu'elle contient de clair ne peut
    # être que l'accent. La première version portait jusqu'à y = 70 et x =
    # 1240, et ramassait le blanc de la page avec — « une tache de 119 × 39 ».
    zone = (1150, 40, 1205, 63)
    clairs = {(x, y) for x in range(zone[0], zone[2]) for y in range(zone[1], zone[3])
              if px[x, y][0] > 200 and px[x, y][1] > 195 and px[x, y][2] > 190}
    if not clairs:
        raise Retouche("aucun signe clair au-dessus du e : pas d'accent ?")

    # Composante connexe la plus grande — l'accent est d'un seul tenant.
    vus, meilleure = set(), set()
    for depart in clairs:
        if depart in vus:
            continue
        pile, comp = [depart], set()
        while pile:
            p = pile.pop()
            if p in vus:
                continue
            vus.add(p); comp.add(p)
            x, y = p
            for q in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
                if q in clairs and q not in vus:
                    pile.append(q)
        if len(comp) > len(meilleure):
            meilleure = comp

    xs = [p[0] for p in meilleure]
    ys = [p[1] for p in meilleure]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    if not (8 <= x1 - x0 <= 30 and 6 <= y1 - y0 <= 24):
        raise Retouche(f"tache de {x1-x0}×{y1-y0} px — ce n'est pas un accent")

    # Le rouge du pinceau, relevé À CÔTÉ de la tache : un rouge plat pris dans
    # une table se verrait sur un fond texturé au pinceau.
    autour = [px[x, y][:3] for x in range(x0 - 14, x1 + 15)
              for y in range(y0 - 8, y1 + 9)
              if not (x0 - 2 <= x <= x1 + 2 and y0 - 2 <= y <= y1 + 2)
              and px[x, y][0] > 120 and px[x, y][1] < 120]
    if len(autour) < 40:
        raise Retouche("pas assez de rouge autour de l'accent pour le recouvrir")
    med = tuple(sorted(c[i] for c in autour)[len(autour) // 2] for i in range(3))

    for x in range(x0 - 2, x1 + 3):
        for y in range(y0 - 2, y1 + 3):
            px[x, y] = med
    return im, f"accent effacé en x[{x0},{x1}] y[{y0},{y1}], rouge {med}"


def au_gabarit(im: Image.Image) -> Image.Image:
    """1 200 × 1 600, sans rien rogner.

    On met à l'échelle sur la HAUTEUR (rien ne sort en haut ni en bas), puis on
    complète les côtés en répliquant la colonne de bord. Les bords de ces
    couvertures sont unis — blanc en haut, vert en bas — et l'extension est
    invisible ; une bande de couleur plate, elle, ferait un cadre.
    """
    r = H / im.height
    im = im.resize((max(1, int(round(im.width * r))), H), Image.LANCZOS)
    if im.width == L:
        return im
    if im.width > L:                       # trop large : on centre et on rogne
        g = (im.width - L) // 2            # (cas théorique, jamais atteint ici)
        return im.crop((g, 0, g + L, H))

    fond = Image.new("RGB", (L, H))
    g = (L - im.width) // 2
    base = im.convert("RGB")
    fond.paste(base, (g, 0))

    # ⚠️ RÉPLIQUER LA COLONNE DE BORD FAIT DES STRIES. La première version
    # étirait le dernier pixel de chaque côté : sur le bandeau vert et sur le
    # blanc, invisible — mais en face de la photo, chaque pixel devenait une
    # raie horizontale de soixante-six de long. On voyait le procédé.
    # Un miroir du bord, flouté, ne montre rien de tout cela : les couleurs
    # sont les bonnes à chaque hauteur, et le flou efface le motif.
    from PIL import ImageFilter
    dg, dd = g, L - g - base.width
    if dg > 0:
        b = base.crop((0, 0, dg, H)).transpose(Image.FLIP_LEFT_RIGHT)
        fond.paste(b.filter(ImageFilter.GaussianBlur(14)), (0, 0))
    if dd > 0:
        b = base.crop((base.width - dd, 0, base.width, H)).transpose(Image.FLIP_LEFT_RIGHT)
        fond.paste(b.filter(ImageFilter.GaussianBlur(14)), (g + base.width, 0))
    return fond


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--controle", action="store_true", help="mesurer sans écrire")
    a = ap.parse_args()

    SORTIE.mkdir(parents=True, exist_ok=True)
    print("COUVERTURES DES CAHIERS D'ŒUVRES — correction et mise au gabarit\n")

    for niveau, fichier in COUVERTURES.items():
        src = SOURCE / fichier
        if not src.is_file():
            print(f"[X] {fichier} introuvable dans {SOURCE}", file=sys.stderr)
            return 1
        im = Image.open(src).convert("RGB")
        avant = im.size

        try:
            im, note1 = corriger_lectures(im)
        except Retouche as e:
            print(f"[X] {niveau} : {e}", file=sys.stderr)
            return 1

        note2 = "—"
        if niveau == "3e":
            try:
                im, note2 = corriger_accent(im)
            except Retouche as e:
                print(f"[X] {niveau} : {e}", file=sys.stderr)
                return 1

        im = au_gabarit(im)
        dest = SORTIE / f"livret_oeuvres-{niveau}.jpg"
        print(f"  {niveau}  {avant[0]}×{avant[1]} → {im.width}×{im.height}")
        print(f"       « Lectures » : {note1}")
        print(f"       accent      : {note2}")
        if not a.controle:
            im.save(dest, "JPEG", quality=88, optimize=True, progressive=True)
            print(f"       → {dest.relative_to(RACINE)}  {dest.stat().st_size // 1024} Ko")

    if a.controle:
        print("\n  (contrôle : rien n'a été écrit)")
    else:
        print("\n  Ensuite :")
        print("    python tools/cahiers_oeuvres_1c.py --charge ~/veritas-ftp")
        print("    python tools/pages_ouvrages.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
