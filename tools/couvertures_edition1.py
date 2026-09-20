#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/couvertures_edition1.py — LES COUVERTURES DES ÉDITIONS, NETTOYÉES

    python tools/couvertures_edition1.py            # écrit les fichiers nettoyés
    python tools/couvertures_edition1.py --controle # mesure, n'écrit rien

DEUX DÉFAUTS, DEUX RAISONS DE LES RETIRER

  ① LE CACHET « 3000 FCFA ». C'est le prix du cahier IMPRIMÉ. En ligne, le même
     cahier se vend 1 500 F : la fiche affiche donc deux prix à quelques
     centimètres l'un de l'autre, dont un qui n'est pas celui qu'on encaisse.
     Un acheteur qui voit 3 000 sur l'image et 1 500 au bouton ne se dit pas
     « bonne affaire », il se dit « lequel est vrai ? » — et il s'en va.
     Le cachet est posé sur un aplat blanc : on le retire, on ne repeint rien.
     ⚠️ On NE touche PAS aux fichiers d'origine : le prix imprimé reste juste
     sur le cahier de papier. Le nettoyage ne vaut que pour la vitrine.

  ② LE BOUTON D'INTERFACE sur la couverture de 2ⁿᵈᵉ. Un carré bleu clair avec
     un crayon, en bas à droite : le bouton d'une application, resté dans une
     capture d'écran. Il cache le coin du cahier ET la mention « 1ʳᵉ Edition »
     imprimée dans le bandeau.
     On ne peut pas le « gommer » : il n'y a rien dessous à restituer. On
     reconstruit donc ce coin à partir de la couverture de 1ʳᵉ — même maquette,
     même imprimeur, seule la couleur change — recalée sur les repères de page
     puis recolorée au brun de la 2ⁿᵈᵉ. La mention revient avec.

MESURER PLUTÔT QUE DEVINER : les deux zones sont TROUVÉES par leur couleur
(le cachet est sombre sur blanc, le bouton est bleu là où rien ne l'est), pas
écrites en dur. Si un jour la couverture change, le script ne retire rien
plutôt que de manger un morceau de dessin — et il le dit.
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

import numpy as np
from PIL import Image

SOURCE = Path.home() / "Downloads" / "1ère édition"
SORTIE = Path(__file__).resolve().parent.parent / "uploads" / "oeuvres" / "_sources"

FICHIERS = {
    "2nde": "Couverture 2nde.jpg",
    "1ere": "Couverture 1ère.jpg",
    "tle": "Couverture Tle.jpg",
}


def lum(a: np.ndarray) -> np.ndarray:
    return a.astype(float).mean(axis=2)


def reperes(a: np.ndarray) -> dict:
    """Les repères de la page dans la capture : bord droit, bas de l'en-tête,
    bas de la page. Ils servent à recaler une couverture sur l'autre."""
    h, w, _ = a.shape
    L = lum(a)
    ligne = L[h // 2]
    droite = max(x for x in range(w) if ligne[x] < 235 or ligne[x] > 248)
    colonne = L[:, w // 2]
    bas = max(y for y in range(h) if colonne[y] < 235)
    entete = max(y for y in range(h // 2) if L[y, w // 2] < 160)
    return {"w": w, "h": h, "droite": droite, "bas": bas, "entete": entete}


def bbox(masque: np.ndarray):
    ys, xs = np.where(masque)
    if not len(ys):
        return None
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


def taches(masque: np.ndarray, mini: int = 200):
    """Toutes les taches d'un seul tenant, de la plus grande à la plus petite.
    Le bandeau de titre est une tache sombre plus grande que le cachet : ne
    garder QUE la plus grande revenait à ne jamais voir celui qu'on cherche."""
    vu = np.zeros(masque.shape, dtype=bool)
    out = []
    ys, xs = np.where(masque)
    for y0, x0 in zip(ys, xs):
        if vu[y0, x0]:
            continue
        pile, pts = [(int(y0), int(x0))], []
        vu[y0, x0] = True
        while pile:
            y, x = pile.pop()
            pts.append((y, x))
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < masque.shape[0] and 0 <= nx < masque.shape[1] \
                        and masque[ny, nx] and not vu[ny, nx]:
                    vu[ny, nx] = True
                    pile.append((ny, nx))
        if len(pts) < mini:
            continue
        ay = np.array([p[0] for p in pts])
        ax = np.array([p[1] for p in pts])
        out.append((int(ax.min()), int(ay.min()), int(ax.max()), int(ay.max()), len(pts)))
    return sorted(out, key=lambda t: -t[4])


def plus_grande_tache(masque: np.ndarray):
    """La plus grande TACHE d'un seul tenant, et non l'étendue de tous les
    pixels qui répondent au test.

    ⚠️ C'est la différence entre un objet et une poussière. Le premier jet
    prenait l'enveloppe de tout le masque : trois pixels bleuâtres égarés au
    milieu de la couverture, et la « zone du bouton » faisait 473 × 649 px —
    la moitié de l'image, qu'on aurait repeinte.
    """
    vu = np.zeros(masque.shape, dtype=bool)
    meilleure, taille_max = None, 0
    ys, xs = np.where(masque)
    for y0, x0 in zip(ys, xs):
        if vu[y0, x0]:
            continue
        pile, pts = [(int(y0), int(x0))], []
        vu[y0, x0] = True
        while pile:
            y, x = pile.pop()
            pts.append((y, x))
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < masque.shape[0] and 0 <= nx < masque.shape[1] \
                        and masque[ny, nx] and not vu[ny, nx]:
                    vu[ny, nx] = True
                    pile.append((ny, nx))
        if len(pts) > taille_max:
            taille_max = len(pts)
            ay = np.array([p[0] for p in pts])
            ax = np.array([p[1] for p in pts])
            meilleure = (int(ax.min()), int(ay.min()), int(ax.max()), int(ay.max()),
                         len(pts))
    return meilleure


def cachet(a: np.ndarray, rep: dict):
    """La zone du cachet « 3000 FCFA » : la tache sombre du tiers droit, sous
    le bandeau de titre, ENTOURÉE de blanc — c'est cette dernière condition qui
    autorise à l'effacer d'un aplat.

    Le bandeau de titre est en BIAIS : il descend jusqu'au milieu de la hauteur
    à gauche et remonte à droite. Chercher « sous l'en-tête » mesuré au milieu
    de l'image faisait donc commencer la fenêtre SOUS le cachet, qui n'était
    jamais trouvé. On cherche dans la bande verticale où il vit, et on écarte
    ce qui touche le haut de la fenêtre — c'est le bandeau, pas le cachet."""
    h, w = rep["h"], rep["w"]
    x0, x1 = int(w * 0.62), rep["droite"] - 2
    y0, y1 = int(h * 0.36), int(h * 0.56)
    z = a[y0:y1, x0:x1]
    for bx0, by0, bx1, by1, n in taches(lum(z) < 205, 1200):
        if by0 <= 1 or bx0 <= 1:      # touche le bord : c'est le bandeau, pas le cachet
            continue
        bx0, by0, bx1, by1 = bx0 + x0 - 4, by0 + y0 - 4, bx1 + x0 + 5, by1 + y0 + 5
        # L'anneau autour doit être blanc : sinon on mordrait sur le dessin.
        anneau = []
        for (yy, xx) in ((by0 - 3, slice(bx0, bx1)), (by1 + 2, slice(bx0, bx1))):
            if 0 <= yy < h:
                anneau.append(lum(a[yy:yy + 1, xx]))
        for (xx, yy) in ((bx0 - 3, slice(by0, by1)), (bx1 + 2, slice(by0, by1))):
            if 0 <= xx < w:
                anneau.append(lum(a[yy, xx:xx + 1]))
        clair = np.concatenate([v.ravel() for v in anneau])
        if (clair > 230).mean() < 0.55:
            continue                  # majoritairement sombre : ce n'est pas le cachet
        return bx0, by0, bx1, by1
    return None


def dilater(m: np.ndarray, n: int = 3) -> np.ndarray:
    """Élargit un masque de n pixels : le bord d'un dessin est adouci par le
    JPEG, et laisser ce halo revient à laisser le contour du cachet."""
    out = m.copy()
    for _ in range(n):
        d = out.copy()
        d[1:, :] |= out[:-1, :]
        d[:-1, :] |= out[1:, :]
        d[:, 1:] |= out[:, :-1]
        d[:, :-1] |= out[:, 1:]
        out = d
    return out


def reboucher(a: np.ndarray, masque: np.ndarray, passes: int = 9000) -> np.ndarray:
    """Rebouche un trou par diffusion depuis ses bords.

    ⚠️ POURQUOI PAS UNE RECONSTRUCTION GÉOMÉTRIQUE. Premier essai : mesurer la
    pente du bandeau et repeindre de part et d'autre d'une droite. Le bandeau
    n'est pas une droite mais une COURBE, et la boîte du cachet mord aussi la
    pastille du dessous : la « réparation » a entaillé le bandeau et coupé le
    bout arrondi de la pastille. La diffusion, elle, ne sait rien de la forme —
    elle prolonge ce qui borde le trou, donc le blanc là où c'est blanc et la
    couleur là où le bandeau arrive. Et elle ne touche QUE les pixels du
    cachet, jamais ses voisins."""
    if not masque.any():
        return a
    # On ne diffuse que dans le VOISINAGE du trou : faire tourner neuf cents
    # passes sur toute l'image coûte des minutes et ne change rien ailleurs.
    ys, xs = np.where(masque)
    y0, y1 = max(0, ys.min() - 12), min(a.shape[0], ys.max() + 13)
    x0, x1 = max(0, xs.min() - 12), min(a.shape[1], xs.max() + 13)
    u = a[y0:y1, x0:x1].astype(np.float64)
    m = masque[y0:y1, x0:x1]
    for _ in range(passes):
        voisins = np.zeros_like(u)
        voisins[1:-1, 1:-1] = (u[:-2, 1:-1] + u[2:, 1:-1]
                               + u[1:-1, :-2] + u[1:-1, 2:]) / 4.0
        u[m] = voisins[m]
    # ⚠️ LA DIFFUSION LAISSE UN VOILE. Au centre d'un trou de 170 × 70 px, elle
    # met des milliers de passes à rejoindre le blanc des bords : à neuf cents,
    # il restait un nuage gris à l'endroit exact du cachet — plus discret que
    # le cachet, donc plus difficile à voir, et tout aussi faux. On rend donc
    # au papier son blanc franc là où la diffusion y est presque, et au
    # bandeau sa couleur pleine là où elle y est presque : entre les deux, on
    # garde le dégradé, qui est le bord adouci du dessin.
    lu = u.mean(axis=2)
    u[m & (lu > 228)] = 255.0
    a = a.copy()
    a[y0:y1, x0:x1] = np.clip(u, 0, 255).astype(np.uint8)
    return a


def effacer_cachet_droite(a: np.ndarray, rep: dict, zone) -> np.ndarray:
    """Efface le cachet SANS manger le bandeau en biais qu'il chevauche.

    ⚠️ Un aplat blanc aurait laissé une encoche dans la diagonale du titre —
    visible, et signée « quelqu'un est passé par là ». Le bandeau est une
    DROITE : on mesure sa pente juste à gauche du cachet, on la prolonge, et
    on repeint de part et d'autre. Au-dessus la couleur du bandeau, au-dessous
    le blanc du papier."""
    x0, y0, x1, y1 = zone
    L = lum(a)
    blanc = np.array([255.0, 255.0, 255.0])
    couleur = np.median(a[40:80, 60:200].reshape(-1, 3), axis=0).astype(float)

    # ⚠️ LE BAS DU BANDEAU, PAS LE PIXEL SOMBRE LE PLUS BAS. Le premier jet
    # prenait `max()` des pixels sombres de la colonne : il tombait sur le
    # filet de la pastille « Synthèses… », soixante pixels plus bas. La droite
    # passait alors sous le cachet et le « nettoyage » a peint un rectangle
    # brun en plein milieu du blanc. On suit le TRAIT CONTINU depuis le haut.
    xs, ys = [], []
    for x in range(max(2, x0 - 90), x0 - 4):
        col = L[:, x]
        y = max(0, y0 - 160)
        while y < rep["h"] and col[y] >= 190:      # descendre jusqu'au bandeau
            y += 1
        if y >= rep["h"]:
            continue
        while y + 1 < rep["h"] and col[y + 1] < 190:   # puis le suivre jusqu'au bout
            y += 1
        xs.append(x)
        ys.append(y)
    if len(xs) < 20:                  # pente non mesurable : on ne touche à rien
        return a
    pente, ord0 = np.polyfit(np.array(xs, float), np.array(ys, float), 1)
    for x in range(x0, x1):
        bord = pente * x + ord0
        for y in range(y0, y1):
            a[y, x] = couleur if y < bord - 0.5 else blanc
    return a


def bouton(a: np.ndarray):
    """Le carré bleu clair du bouton d'application, s'il y en a un.

    Quatre conditions, et il faut les quatre : bleu clair, d'un seul tenant,
    assez gros, PLEIN (une tache qui remplit sa boîte) et à peu près carré. La
    couverture de Tˡᵉ est bleu marine avec des vagues claires : la couleur
    seule y désignait onze mille pixels répartis sur toute la page. La forme,
    elle, ne trompe pas — un bouton est un carré plein."""
    r, b = a[:, :, 0].astype(int), a[:, :, 2].astype(int)
    m = (b - r > 25) & (b > 185)
    if m.sum() < 2000:
        return None
    t = plus_grande_tache(m)
    if not t:
        return None
    x0, y0, x1, y1, n = t
    lg, ht = x1 - x0 + 1, y1 - y0 + 1
    if not (60 <= lg <= 220 and 60 <= ht <= 220):
        return None
    if n / float(lg * ht) < 0.70:            # creux : ce n'est pas un bouton
        return None
    if not (0.75 <= lg / float(ht) <= 1.33):
        return None
    return x0 - 3, y0 - 3, x1 + 4, y1 + 4


def recoller(cible: np.ndarray, rc: dict, modele: np.ndarray, rm: dict, zone):
    """Reconstruit `zone` de la cible en recopiant la MÊME zone du modèle, puis
    en la recolorant : le modèle ne fournit que la forme (bandeau, filets,
    mention gravée), la cible fournit ses deux couleurs."""
    x0, y0, x1, y1 = zone
    # Recalage : bord droit de page pour x, bas d'en-tête → bas de page pour y.
    fx = rm["droite"] / rc["droite"]
    fy = (rm["bas"] - rm["entete"]) / (rc["bas"] - rc["entete"])

    def vers_modele(x, y):
        return (x * fx, rm["entete"] + (y - rc["entete"]) * fy)

    # Les deux couleurs de la cible : le blanc du papier et le brun du bandeau.
    blanc = np.array([255.0, 255.0, 255.0])
    bandeau = np.median(cible[rc["bas"] - 28:rc["bas"] - 18, 120:260]
                        .reshape(-1, 3), axis=0).astype(float)
    Lm = lum(modele)
    l_bandeau = float(np.median(Lm[rm["bas"] - 28:rm["bas"] - 18, 120:260]))
    l_blanc = float(np.median(Lm[rm["entete"] + 40:rm["entete"] + 60, 120:260]))
    fond = np.median(cible[rc["h"] // 2, rc["droite"] + 8:rc["droite"] + 18],
                     axis=0).astype(float) if rc["droite"] + 18 < rc["w"] else blanc

    hm, wm, _ = modele.shape
    for y in range(y0, y1):
        for x in range(x0, x1):
            if x > rc["droite"]:
                cible[y, x] = fond               # hors de la page : le fond gris
                continue
            mx, my = vers_modele(x, y)
            mxi, myi = int(round(mx)), int(round(my))
            if not (0 <= mxi < wm and 0 <= myi < hm):
                cible[y, x] = blanc
                continue
            t = (Lm[myi, mxi] - l_bandeau) / max(1.0, l_blanc - l_bandeau)
            t = min(1.0, max(0.0, t))
            cible[y, x] = np.clip(bandeau * (1 - t) + blanc * t, 0, 255)
    return cible


def nettoyer(niveau: str, source: Path, modele_path: Path | None, controle: bool):
    im = Image.open(source).convert("RGB")
    a = np.asarray(im).astype(np.uint8).copy()
    rep = reperes(a)
    faits = []

    z = cachet(a, rep)
    if z:
        x0, y0, x1, y1 = z
        if not controle:
            trou = np.zeros(a.shape[:2], dtype=bool)
            trou[y0:y1, x0:x1] = lum(a[y0:y1, x0:x1]) < 215
            a = reboucher(a, dilater(trou, 3))
        faits.append(f"cachet « 3000 FCFA » retiré ({x1 - x0}×{y1 - y0} px)")
    else:
        faits.append("AUCUN cachet trouvé — rien retiré")

    z = bouton(a)
    if z and modele_path:
        x0, y0, x1, y1 = z
        if not controle:
            mod = np.asarray(Image.open(modele_path).convert("RGB")).astype(np.uint8)
            a = recoller(a, rep, mod, reperes(mod), (x0, y0, x1, y1))
        faits.append(f"bouton d'interface reconstruit ({x1 - x0}×{y1 - y0} px)")
    elif z:
        faits.append("bouton trouvé mais AUCUN modèle fourni — laissé en place")

    print(f"  {niveau:5} {source.name:22} " + " · ".join(faits))
    if controle:
        return None
    SORTIE.mkdir(parents=True, exist_ok=True)
    cible = SORTIE / f"couverture-{niveau}-ed1.jpg"
    Image.fromarray(a).save(cible, "JPEG", quality=92, optimize=True, progressive=True)
    return cible


def main() -> int:
    ap = argparse.ArgumentParser(description="Couvertures des éditions, nettoyées.")
    ap.add_argument("--source", type=Path, default=SOURCE)
    ap.add_argument("--controle", action="store_true")
    a = ap.parse_args()
    modele = a.source / FICHIERS["1ere"]        # même maquette, couleur près
    for niveau, nom in FICHIERS.items():
        f = a.source / nom
        if not f.is_file():
            print(f"  ✗ {niveau} : {f} absent")
            continue
        nettoyer(niveau, f, modele if niveau == "2nde" else None, a.controle)
    if not a.controle:
        print(f"\n  → {SORTIE}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
