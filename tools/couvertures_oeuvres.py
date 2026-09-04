#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/couvertures_oeuvres.py — LES COUVERTURES D'ŒUVRES, ÉCLAIRCIES ET AU MÊME GABARIT

    python tools/couvertures_oeuvres.py                 # traite les 21 œuvres
    python tools/couvertures_oeuvres.py --controle      # mesure sans rien écrire
    python tools/couvertures_oeuvres.py --seulement 1ere_balafon

CE QUE FAIT CE SCRIPT, ET EN QUOI IL DIFFÈRE DE tools/couvertures.py
  `couvertures.py` part d'un fichier de maquette livré sur le bureau et fabrique
  la couverture d'un LIVRET. Celui-ci travaille sur ce qui est DÉJÀ dans
  `uploads/oeuvres/` : les couvertures des œuvres au programme, ramassées une à
  une au fil des mois, jamais passées par une chaîne commune. Elles vont de
  118×178 à 930×1395, avec des rapports de 0,55 à 0,83 et des luminosités
  moyennes de 37 à 233. Dans une grille de boutique, cela donne des cartes qui
  ne s'alignent pas et, une carte sur trois, une image si sombre qu'on ne lit
  pas le titre sur un téléphone en plein jour.

TROIS TRAITEMENTS, ET LA RAISON DE CHACUN

  1. ÉCLAIRCISSEMENT MESURÉ, JAMAIS FORFAITAIRE. Un +20 % de luminosité
     uniforme brûlerait « Chants de la forêt » (déjà à 233) en délavant à peine
     « Au cœur des ténèbres » (37). Le réglage se calcule sur l'histogramme de
     CHAQUE image : d'abord un point blanc (le 99,5ᵉ centile monte vers 247),
     ensuite un gamma qui amène la MÉDIANE vers la cible. Les deux sont bridés
     et ne peuvent qu'éclaircir — une couverture correctement exposée ressort
     inchangée, ce qui est le comportement voulu.

  2. RAPPORT UNIQUE 3:4. C'est le rapport qui fait qu'une grille s'aligne ; la
     taille en pixels, elle, n'est qu'une affaire de netteté. Deux façons d'y
     arriver, choisies par la mesure : un rapport déjà proche (±6 %) se RECADRE
     au centre — on perd quelques pour cent de marge et rien d'autre ; un
     rapport éloigné se POSE sur un fond échantillonné au bord de l'image. On ne
     recadre jamais une couverture étroite : la coupe emporterait le titre, or
     c'est la seule image d'un produit qu'on demande à quelqu'un de payer.

  3. TAILLE COMMUNE 1200×1600. Les sources plus petites sont agrandies. C'est
     un choix assumé et il a une limite : au-delà d'environ 3× l'agrandissement
     n'ajoute aucun détail, il en invente. Le script ne le cache pas — il
     imprime le facteur pour chaque couverture et récapitule celles qui passent
     sous la barre. Le remède n'est pas dans le code : c'est un meilleur fichier
     source, ou une couverture composée (tools/rendu_couvertures.cjs).

CE QU'IL NE FAIT PAS
  · Il ne change aucun nom de fichier et aucune extension. `5e_arbre_fetiche`
    est le seul .png du dossier et une page le cherche en .png : renommer en
    .jpg afficherait l'image de partage du site à sa place. Le banc
    tests/banc_couvertures.cjs garde cette leçon.
  · Il ne touche pas aux couvertures de livrets (`livret_*`), qui ont déjà leur
    chaîne et leur source de meilleure qualité.

OÙ ÇA VA
  Sur place, dans `uploads/oeuvres/` — dossier déjà versionné et déjà déployé
  par la CI. Chaque couverture reçoit en plus une vignette `<nom>_v.jpg` de
  460 px pour les grilles, sur le modèle des livrets : servir 1200 px dans une
  carte de 280 px coûte douze fois le poids utile sur la connexion visée.
"""
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

for _f in (sys.stdout, sys.stderr):
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

try:
    from PIL import Image, ImageEnhance, ImageFilter, ImageStat
except ImportError:
    raise SystemExit("✗ Pillow requis :  python -m pip install Pillow")

sys.path.insert(0, str(Path(__file__).resolve().parent))
from couvertures import rogner  # noqa: E402  — même définition des marges

RACINE = Path(__file__).resolve().parent.parent
DOSSIER = RACINE / "uploads" / "oeuvres"

LARGEUR, HAUTEUR = 1200, 1600
RAPPORT = LARGEUR / HAUTEUR                  # 0,75
QUALITE = 92
SUBSAMPLING = 0                              # 4:4:4 — le texte des couvertures
RENFORT = dict(radius=0.7, percent=85, threshold=3)
VIGNETTE_L, VIGNETTE_H = 460, 613

# ── Les bornes de l'éclaircissement ──────────────────────────────────────────
# MEDIANE_CIBLE : une couverture lisible sur un écran de téléphone en extérieur
# se situe vers 150. Au-dessus, les aplats de couleur perdent leur densité.
MEDIANE_CIBLE = 150
GAMMA_MIN = 0.60          # bride basse : au-delà, le noir devient gris sale
GAIN_MAX = 1.35           # bride du point blanc
BLANC_CIBLE = 247         # on laisse une réserve : 255 écrête
ECRETAGE_MAX = 2.0        # % de pixels à 255 tolérés après traitement
SATURATION = 1.06         # un gamma qui éclaircit délave : on rend la couleur
TOLERANCE_RECADRAGE = 0.06  # ±6 % du rapport 3:4 → recadrage plutôt que fond

# Au-delà de ce facteur, l'agrandissement n'ajoute plus de détail.
AGRANDISSEMENT_HONNETE = 3.0


def centile(im: Image.Image, part: float) -> int:
    """Valeur de luminance sous laquelle se trouve `part` des pixels."""
    h = im.convert("L").histogram()
    total = sum(h) or 1
    seuil, cumul = part * total, 0
    for i, v in enumerate(h):
        cumul += v
        if cumul >= seuil:
            return i
    return 255


def ecretage(im: Image.Image) -> float:
    """Part des pixels de luminance 255, en pourcentage."""
    h = im.convert("L").histogram()
    return 100.0 * h[255] / (sum(h) or 1)


def eclaircir(im: Image.Image) -> tuple[Image.Image, str]:
    """Point blanc puis gamma, tous deux calculés sur l'image et bridés.

    L'ordre compte : étirer d'abord vers le blanc récupère la dynamique
    perdue au scan, et le gamma travaille ensuite sur une image déjà étalée,
    donc il a moins à forcer. L'inverse écraserait les hautes lumières.
    """
    notes = []
    # L'écrêtage se mesure en ÉCART, jamais en absolu. Une couverture sur fond
    # blanc arrive avec 12 % de pixels déjà à 255 : une tolérance absolue la
    # déclarerait brûlée avant qu'on y touche, et la garde reculerait sur une
    # image qu'elle n'a pas abîmée. Mesuré sur « La Marmite de Koka Mbala ».
    ecr_depart = ecretage(im)

    # ── Point blanc ─────────────────────────────────────────────────────────
    p_hi = centile(im, 0.995)
    gain = 1.0
    if 0 < p_hi < BLANC_CIBLE:
        gain = min(GAIN_MAX, BLANC_CIBLE / p_hi)
        im = im.point(lambda v, g=gain: min(255, int(v * g + 0.5)))
        notes.append("blanc ×%.2f" % gain)

    # ── Gamma sur la médiane ────────────────────────────────────────────────
    med = centile(im, 0.5)
    gamma = 1.0
    if 0 < med < MEDIANE_CIBLE:
        import math
        gamma = math.log(MEDIANE_CIBLE / 255.0) / math.log(med / 255.0)
        gamma = max(GAMMA_MIN, min(1.0, gamma))
        if gamma < 0.999:
            table = [min(255, int(255.0 * ((v / 255.0) ** gamma) + 0.5)) for v in range(256)]
            im = im.point(table * 3)
            notes.append("γ %.2f" % gamma)

    # ── Filet de sécurité : on ne brûle pas une couverture pour l'éclaircir ──
    # Une garde qui n'est jamais mesurée n'est pas une garde. On regarde le
    # résultat, et on recule si l'écrêtage dépasse la tolérance.
    ajout = ecretage(im) - ecr_depart
    if ajout > ECRETAGE_MAX and gamma < 1.0:
        recul = min(1.0, gamma + 0.12)
        table = [min(255, int(255.0 * ((v / 255.0) ** (recul / gamma)) + 0.5)) for v in range(256)]
        im = im.point(table * 3)
        notes.append("recul, +%.1f %% de blanc" % ajout)

    if notes:
        im = ImageEnhance.Color(im).enhance(SATURATION)
    return im, (", ".join(notes) or "exposition correcte, inchangée")


def fond_du_bord(im: Image.Image) -> tuple[int, int, int]:
    """Couleur dominante du pourtour — le fond sur lequel poser une image
    trop étroite. Prise sur le bord et non au coin : un coin peut tomber sur
    un détail de l'illustration et teinter toute la marge."""
    rgb = im.convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    ech = []
    for x in range(0, w, max(1, w // 40)):
        ech.append(px[x, 0])
        ech.append(px[x, h - 1])
    for y in range(0, h, max(1, h // 40)):
        ech.append(px[0, y])
        ech.append(px[w - 1, y])
    ech.sort(key=lambda c: c[0] + c[1] + c[2])
    return ech[len(ech) // 2]


def au_gabarit(im: Image.Image) -> tuple[Image.Image, str]:
    """Ramène au rapport 3:4 : recadrage si le rapport est proche, fond sinon."""
    r = im.width / im.height
    ecart = abs(r - RAPPORT) / RAPPORT
    if ecart <= TOLERANCE_RECADRAGE:
        if r > RAPPORT:                       # trop large → on rogne les côtés
            nw = int(round(im.height * RAPPORT))
            x = (im.width - nw) // 2
            im = im.crop((x, 0, x + nw, im.height))
        elif r < RAPPORT:                     # trop haute → on rogne en bas
            nh = int(round(im.width / RAPPORT))
            im = im.crop((0, 0, im.width, nh))
        return im, "recadré (%.0f %% d'écart)" % (ecart * 100)

    if r < RAPPORT:                           # étroite → marges latérales
        nw, nh = int(round(im.height * RAPPORT)), im.height
    else:                                     # large → marges haut/bas
        nw, nh = im.width, int(round(im.width / RAPPORT))

    # PROLONGEMENT FLOU plutôt que bande de couleur plate. Une couverture de
    # rapport 0,55 posée sur un aplat reçoit deux barres unies qui occupent un
    # quart de la carte : l'œil les lit comme un défaut d'affichage. Le même
    # écart rempli par l'image elle-même, agrandie pour couvrir puis floutée et
    # assombrie, se lit comme un passe-partout. Le fond plat reste le repli
    # pour une image trop uniforme, où le flou ne produirait rien de plus.
    ecart_type = ImageStat.Stat(im.convert("L")).stddev[0]
    if ecart_type < 12:
        toile = Image.new("RGB", (nw, nh), fond_du_bord(im))
        note = "fond uni (image sans relief)"
    else:
        k = max(nw / im.width, nh / im.height)
        cov = im.resize((max(1, int(im.width * k + 1)), max(1, int(im.height * k + 1))),
                        Image.LANCZOS)
        x = (cov.width - nw) // 2
        y = (cov.height - nh) // 2
        toile = cov.crop((x, y, x + nw, y + nh))
        toile = toile.filter(ImageFilter.GaussianBlur(radius=max(6, nw * 0.045)))
        toile = ImageEnhance.Brightness(toile).enhance(0.55)
        note = "prolongement flou"

    # Un filet clair détache l'image nette de son passe-partout : sans lui, une
    # couverture sombre se fond dans son propre flou et perd son contour.
    x0, y0 = (nw - im.width) // 2, (nh - im.height) // 2
    filet = Image.new("RGB", (im.width + 4, im.height + 4), (255, 255, 255))
    toile.paste(filet, (x0 - 2, y0 - 2))
    toile.paste(im, (x0, y0))
    return toile, "%s (%.0f %% d'écart)" % (note, ecart * 100)


def traiter(chemin: Path, controle: bool) -> tuple[bool, str, float]:
    avant = chemin.stat().st_size
    src = Image.open(chemin)
    dim_avant = src.size

    if src.mode in ("RGBA", "LA", "P"):
        src = src.convert("RGBA")
        fond = Image.new("RGB", src.size, (255, 255, 255))
        fond.paste(src, mask=src.split()[-1])
        im = fond
    else:
        im = src.convert("RGB")

    lum_avant = ImageStat.Stat(im.convert("L")).mean[0]
    im = rogner(im)
    im, note_lum = eclaircir(im)
    # La luminosité se relève AVANT le passe-partout : mesurée après, elle
    # mélangerait la couverture et le cadre volontairement assombri, et
    # afficherait une baisse là où l'image a été éclaircie.
    lum_apres = ImageStat.Stat(im.convert("L")).mean[0]
    im, note_cadre = au_gabarit(im)

    facteur = LARGEUR / im.width
    im = im.resize((LARGEUR, HAUTEUR), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(**RENFORT))

    resume = ("%d×%d → %d×%d (×%.1f) · lum %.0f → %.0f · %s · %s"
              % (dim_avant[0], dim_avant[1], LARGEUR, HAUTEUR, facteur,
                 lum_avant, lum_apres, note_lum, note_cadre))
    if controle:
        return True, resume, facteur

    # Écriture par fichier temporaire puis remplacement : `open(f,'w')` tronque
    # AVANT d'écrire, et une erreur en cours de route laisserait une couverture
    # vide à la place de l'originale.
    tmp = chemin.with_suffix(chemin.suffix + ".tmp")
    if chemin.suffix.lower() == ".png":
        im.save(tmp, "PNG", optimize=True)
    else:
        im.save(tmp, "JPEG", quality=QUALITE, optimize=True, progressive=True,
                subsampling=SUBSAMPLING)
    shutil.move(str(tmp), str(chemin))

    v = im.copy()
    v.thumbnail((VIGNETTE_L, VIGNETTE_H), Image.LANCZOS)
    v = v.filter(ImageFilter.UnsharpMask(**RENFORT))
    vign = chemin.with_name(chemin.stem + "_v.jpg")
    vtmp = vign.with_suffix(".jpg.tmp")
    v.save(vtmp, "JPEG", quality=80, optimize=True, progressive=True, subsampling=2)
    shutil.move(str(vtmp), str(vign))

    return True, resume + "  ·  %d Ko → %d Ko + vignette %d Ko" % (
        avant // 1024, chemin.stat().st_size // 1024, vign.stat().st_size // 1024), facteur


def oeuvres() -> list[Path]:
    """Les couvertures d'œuvres : tout sauf les livrets et leurs vignettes."""
    return sorted(p for p in DOSSIER.iterdir()
                  if p.suffix.lower() in (".jpg", ".jpeg", ".png")
                  and not p.name.startswith("livret_")
                  and not p.stem.endswith("_v"))


def main() -> int:
    a = argparse.ArgumentParser(description=__doc__.split("\n")[1])
    a.add_argument("--controle", action="store_true", help="mesure sans écrire")
    a.add_argument("--seulement", default="", help="un seul fichier, par son nom sans extension")
    o = a.parse_args()

    cibles = oeuvres()
    if o.seulement:
        cibles = [p for p in cibles if p.stem == o.seulement]
        if not cibles:
            print("✗ aucune couverture nommée « %s »" % o.seulement)
            return 1

    print("\nCOUVERTURES D'ŒUVRES — %d fichier(s)%s\n"
          % (len(cibles), "  [contrôle, rien n'est écrit]" if o.controle else ""))

    faibles, rates = [], []
    for p in cibles:
        try:
            ok, resume, facteur = traiter(p, o.controle)
        except Exception as e:                      # une couverture illisible
            rates.append(p.name)                    # ne doit pas arrêter les 20
            print("  ✗ %-28s %s" % (p.name, e))
            continue
        print("  %s %-28s %s" % ("✓" if ok else "✗", p.name, resume))
        if facteur > AGRANDISSEMENT_HONNETE:
            faibles.append((p.name, facteur))

    if faibles:
        print("\n⚠ DÉFINITION SOURCE INSUFFISANTE — agrandissement au-delà de ×%.0f :"
              % AGRANDISSEMENT_HONNETE)
        for nom, f in sorted(faibles, key=lambda t: -t[1]):
            print("    ×%-5.1f %s" % (f, nom))
        print("  Ces images sont au bon gabarit mais leurs pixels sont inventés.")
        print("  Remède : un meilleur fichier source, ou une couverture composée")
        print("  (tools/rendu_couvertures.cjs), pas un réglage de ce script.")

    print("\n%d traitée(s), %d en échec.\n" % (len(cibles) - len(rates), len(rates)))
    return 1 if rates else 0


if __name__ == "__main__":
    raise SystemExit(main())
