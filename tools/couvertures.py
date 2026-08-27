#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/couvertures.py — LES COUVERTURES DES CAHIERS, PRÊTES POUR LE WEB

    python tools/couvertures.py                    # traite tout le manifeste
    python tools/couvertures.py --seulement 6e     # un seul ouvrage
    python tools/couvertures.py --controle         # ne produit rien, mesure

CE QUE ÇA FAIT
  Les couvertures livrées par la maquette pèsent ~2 Mo en 1536×2048. Sur la
  connexion visée — un téléphone au Cameroun — neuf cartes de boutique feraient
  18 Mo : la page serait inutilisable, et l'élève partirait avant de voir le
  premier titre. Ce script les ramène à une taille de carte, en JPEG progressif,
  et rend la mesure avant/après.

TROIS AJUSTEMENTS QU'AUCUN REDIMENSIONNEMENT NE FAIT TOUT SEUL
  1. DÉCOUPE D'UNE PLANCHE. « 1ère ST.png » n'est pas une couverture mais
     TROIS, côte à côte (2ⁿᵈᵉ, 1ʳᵉ, Tˡᵉ Scientifique & Technique). Publiée
     telle quelle, chaque cahier S&T aurait porté la même image montrant les
     trois. Les gouttières sont DÉTECTÉES (colonnes claires et uniformes), pas
     codées en dur : une planche recomposée avec des marges différentes se
     découpe encore correctement.
  2. ROGNAGE DES MARGES uniformes autour de la couverture — sinon la vignette
     montre du blanc là où on attend le titre.
  3. APLATISSAGE de la transparence sur blanc : un PNG RGBA converti en JPEG
     sans fond rend un aplat noir.

POURQUOI DU JPEG ET PAS DU WEBP
  Le WebP serait ~25 % plus léger. Mais ces images passent par LiteSpeed, qui
  sert déjà en Brotli, et surtout la boutique doit s'afficher sur des
  navigateurs anciens encore courants sur les téléphones d'occasion. Un format
  que 5 % des visiteurs ne voient pas, sur la vitrine d'un produit payant,
  coûte plus que les kilo-octets qu'il économise.

OÙ ELLES VONT
  uploads/oeuvres/ — dossier DÉJÀ déployé par la CI (allow-list + bloc de
  copie). Créer un dossier neuf aurait demandé de toucher aux deux, et une
  garde `[ -f ]` oubliée échoue en SILENCE : les couvertures seraient restées
  sur le poste de Jacques sans que rien ne le dise.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

for _f in (sys.stdout, sys.stderr):
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

try:
    from PIL import Image, ImageFilter
except ImportError:
    raise SystemExit("✗ Pillow requis :  python -m pip install Pillow")

RACINE = Path(__file__).resolve().parent.parent
SORTIE = RACINE / "uploads" / "oeuvres"
SOURCE = Path.home() / "Desktop" / "Collaboratif"

# DÉFINITION — une couverture n'est pas une vignette : on la regarde de près,
# on y lit « 100 % conforme au programme » en petits caractères, et c'est la
# seule image d'un produit qu'on demande à quelqu'un de payer. 1200×1600 tient
# l'agrandissement plein écran sur un téléphone à densité triple.
LARGEUR_MAX, HAUTEUR_MAX = 1200, 1600
QUALITE = 92

# CE QUI REND UNE COUVERTURE NETTE, ET QUI N'EST PAS LA TAILLE
#  • `subsampling=0` (4:4:4) — par défaut le JPEG divise par deux la résolution
#    des couleurs. Sur une photo, invisible. Sur du TEXTE ROUGE OU BLEU posé sur
#    un aplat — c'est-à-dire sur toute la moitié haute de ces couvertures — les
#    lettres se frangent et bavent. C'est le réglage qui se voit le plus.
#  • Un renforcement léger APRÈS réduction : toute réduction moyenne des pixels,
#    donc adoucit. Sans lui, une couverture réduite de 1536 à 1200 px paraît
#    floue à côté de l'originale, même bien exposée.
SUBSAMPLING = 0                      # 4:4:4 — pas de perte de chroma
RENFORT = dict(radius=0.7, percent=85, threshold=3)

# Vignette de la grille : la carte fait ~280 px de large, 460 px couvre encore
# un écran à densité double sans servir douze fois la pleine définition.
VIGNETTE_L, VIGNETTE_H = 460, 613

# ── Manifeste ────────────────────────────────────────────────────────────────
# slug d'ouvrage → fichier source, et pour une planche : la part à découper.
COUVERTURES: dict[str, dict] = {
    "6e":          {"src": "Livret_activites_Francais_6e.png"},
    "5e":          {"src": "Livret_activites_Francais_5e.png"},
    "4e":          {"src": "Livret_activites_Francais_4e.png"},
    "3e":          {"src": "Livret_activites_Francais_3e.png"},
    "2nde":        {"src": "Livret_activites_Francais_2nde.png"},
    # Les slugs du catalogue sont « 1ere » et « tle » depuis le 27/08 : c'est
    # sous ce nom que api/livret.php cherche `livret_<slug>.jpg`. Les deux
    # anciens noms restent produits — des pages déjà en ligne les référencent.
    "1ere":        {"src": "Livret_activites_Francais_1ere.png"},
    "tle":         {"src": "Livret_activites_Francais_Tle.png"},
    "livret-1ere": {"src": "Livret_activites_Francais_1ere.png"},
    "livret-tle":  {"src": "Livret_activites_Francais_Tle.png"},
    "bord-6e":     {"src": "6e.png"},
    "bord-5e":     {"src": "5e.png"},
    # La planche S&T : trois couvertures sur une seule image.
    "est-2nde":    {"src": "1ère ST.png", "part": 0, "parts": 3},
    "est-1ere":    {"src": "ST.png"},          # existe seule, meilleure définition
    "est-tle":     {"src": "1ère ST.png", "part": 2, "parts": 3},
}


def gouttieres(im: Image.Image) -> list[tuple[int, int]]:
    """Colonnes claires ET uniformes qui séparent deux couvertures d'une planche."""
    px = im.convert("RGB").load()
    w, h = im.size
    pas = max(1, h // 120)                      # échantillonnage : inutile de tout lire
    creux, bloc, debut = [], False, 0
    for x in range(w):
        vals = []
        for y in range(0, h, pas):
            r, g, b = px[x, y]
            vals.append((r + g + b) / 3)
        moy = sum(vals) / len(vals)
        ecart = (sum((v - moy) ** 2 for v in vals) / len(vals)) ** 0.5
        vide = ecart < 12 and moy > 235
        if vide and not bloc:
            bloc, debut = True, x
        elif not vide and bloc:
            bloc = False
            if x - debut >= 3:
                creux.append((debut, x - 1))
    if bloc and w - debut >= 3:
        creux.append((debut, w - 1))
    return creux


def decouper(im: Image.Image, part: int, parts: int) -> Image.Image:
    """Extrait la part n° `part` d'une planche, en s'appuyant sur les gouttières
    réellement présentes. Repli sur un découpage régulier si la détection ne
    trouve pas le bon nombre de séparateurs — mieux vaut une découpe approximative
    qu'un échec, mais on le DIT."""
    w, h = im.size
    creux = [c for c in gouttieres(im) if c[0] > w * 0.05 and c[1] < w * 0.95]
    if len(creux) == parts - 1:
        bornes = [0]
        for a, b in creux:
            bornes.append(a)
            bornes.append(b + 1)
        bornes.append(w)
        x0, x1 = bornes[part * 2], bornes[part * 2 + 1]
    else:
        print(f"    ⚠ {len(creux)} gouttière(s) pour {parts} parts — découpage régulier")
        larg = w // parts
        x0, x1 = part * larg, (part + 1) * larg
    return im.crop((x0, 0, x1, h))


def rogner(im: Image.Image, tol: int = 12) -> Image.Image:
    """Retire les marges uniformes. On compare au pixel du coin : une couverture
    a un fond, pas forcément blanc."""
    rgb = im.convert("RGB")
    fond = rgb.getpixel((0, 0))
    w, h = rgb.size
    px = rgb.load()

    def uniforme_ligne(y):
        return all(abs(px[x, y][c] - fond[c]) <= tol for x in range(0, w, max(1, w // 60)) for c in range(3))

    def uniforme_col(x):
        return all(abs(px[x, y][c] - fond[c]) <= tol for y in range(0, h, max(1, h // 60)) for c in range(3))

    haut = 0
    while haut < h - 1 and uniforme_ligne(haut):
        haut += 1
    bas = h - 1
    while bas > haut + 1 and uniforme_ligne(bas):
        bas -= 1
    gauche = 0
    while gauche < w - 1 and uniforme_col(gauche):
        gauche += 1
    droite = w - 1
    while droite > gauche + 1 and uniforme_col(droite):
        droite -= 1
    if (gauche, haut, droite, bas) == (0, 0, w - 1, h - 1):
        return im
    return im.crop((gauche, haut, droite + 1, bas + 1))


def traiter(slug: str, spec: dict, controle: bool) -> tuple[bool, str]:
    src = SOURCE / spec["src"]
    if not src.is_file():
        return False, f"source absente : {spec['src']}"

    poids_avant = src.stat().st_size
    im = Image.open(src)

    if "part" in spec:
        im = decouper(im, spec["part"], spec["parts"])

    # Aplatir la transparence AVANT tout : sans fond, un RGBA vire au noir en JPEG.
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        fond = Image.new("RGB", im.size, (255, 255, 255))
        fond.paste(im, mask=im.split()[-1])
        im = fond
    else:
        im = im.convert("RGB")

    im = rogner(im)
    avant_dim = im.size

    # On ne rétrécit que ce qui dépasse. Agrandir une source plus petite que la
    # cible n'ajoute aucun détail : cela ne ferait que peser plus lourd en
    # affichant les mêmes pixels, flous.
    if im.width > LARGEUR_MAX or im.height > HAUTEUR_MAX:
        im.thumbnail((LARGEUR_MAX, HAUTEUR_MAX), Image.LANCZOS)
        im = im.filter(ImageFilter.UnsharpMask(**RENFORT))

    cible = SORTIE / f"livret_{slug}.jpg"
    vign  = SORTIE / f"livret_{slug}_v.jpg"
    if controle:
        return True, (f"{avant_dim[0]}×{avant_dim[1]} → {im.size[0]}×{im.size[1]} "
                      f"({poids_avant // 1024} Ko → estimé)")

    SORTIE.mkdir(parents=True, exist_ok=True)
    im.save(cible, "JPEG", quality=QUALITE, optimize=True, progressive=True,
            subsampling=SUBSAMPLING)
    poids_apres = cible.stat().st_size

    # ── VIGNETTE ────────────────────────────────────────────────────────────
    # La grille de la boutique affiche une carte de ~280 px de large. Y servir
    # la pleine définition ferait douze fois 380 Ko : 4,5 Mo pour une page de
    # catalogue, sur la connexion la plus lente de la chaîne. La vignette tient
    # cette place ; la pleine définition reste disponible pour qui regarde de
    # près (srcset le choisit tout seul sur un écran à forte densité).
    v = im.copy()
    v.thumbnail((VIGNETTE_L, VIGNETTE_H), Image.LANCZOS)
    v = v.filter(ImageFilter.UnsharpMask(**RENFORT))
    # La vignette, elle, peut sous-échantillonner sa chroma (4:2:0) : à 460 px
    # affichés sur 280, le franges de couleur ne se voient plus, et cela fait
    # 94 → 62 Ko par carte. Mesuré, pas supposé. La pleine définition au-dessus
    # garde le 4:4:4, parce que c'est ELLE qu'on regarde de près.
    v.save(vign, "JPEG", quality=80, optimize=True, progressive=True, subsampling=2)
    poids_v = vign.stat().st_size

    # Une couverture qui GROSSIT signale une erreur de traitement, pas une
    # optimisation : on le dit au lieu de la laisser passer.
    if poids_apres >= poids_avant:
        return False, f"⚠ {poids_avant // 1024} Ko → {poids_apres // 1024} Ko (aucun gain)"
    return True, (f"{im.size[0]}×{im.size[1]} {poids_apres // 1024} Ko  +  "
                  f"vignette {v.size[0]}×{v.size[1]} {poids_v // 1024} Ko"
                  f"   (source {poids_avant // 1024} Ko)")


def main() -> int:
    ap = argparse.ArgumentParser(description="Prépare les couvertures des cahiers pour le web.")
    ap.add_argument("--seulement", help="ne traiter qu'un slug")
    ap.add_argument("--controle", action="store_true", help="mesurer sans produire")
    ap.add_argument("--source", help="dossier des couvertures d'origine")
    a = ap.parse_args()

    global SOURCE
    if a.source:
        SOURCE = Path(a.source).expanduser()

    print(f"Source : {SOURCE}")
    print(f"Sortie : {SORTIE}\n")

    items = COUVERTURES.items()
    if a.seulement:
        items = [(k, v) for k, v in COUVERTURES.items() if k == a.seulement]
        if not items:
            print(f"✗ slug inconnu : {a.seulement}")
            return 1

    faits, rates = 0, 0
    for slug, spec in items:
        ok, msg = traiter(slug, spec, a.controle)
        marque = "✓" if ok else "✗"
        print(f"  {marque} {slug:<14} {msg}")
        faits += ok
        rates += (not ok)

    print(f"\n{faits} couverture(s) prête(s)" + (f", {rates} en échec" if rates else ""))
    return 1 if rates else 0


if __name__ == "__main__":
    raise SystemExit(main())
