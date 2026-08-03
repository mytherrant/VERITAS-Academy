# -*- coding: utf-8 -*-
"""
qr_flash.py — génère les QR codes « VÉRITAS Flash » à imprimer dans les cahiers.

Un QR par niveau et par séquence :
    https://veritas-school.com/flash/?c=<niveau>&s=<n>
+ un QR « couverture » par niveau (toutes les ressources du niveau) :
    https://veritas-school.com/flash/?c=<niveau>

Sortie : Desktop/Manuels/_qr_flash/<niveau>/flash-<niveau>-s<N>.png  (+ .svg)
Ce sont des ASSETS D'IMPRESSION : ils ne sont pas déployés sur le site.

Réglages d'impression : 900 px de côté (≈ 3 cm à 300 dpi minimum recommandé),
correction d'erreur Q (résiste à 25 % de salissure/pliure — un cahier vit mal),
bleu nuit VÉRITAS sur fond blanc (contraste garanti pour les scanners).

Usage : python tools/qr_flash.py
"""
import os, sys, io

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

try:
    import qrcode
    from qrcode.constants import ERROR_CORRECT_Q
except ImportError:
    print("!! pip install qrcode pillow"); sys.exit(1)

SITE = "https://veritas-school.com"
NAVY = "#142554"
OUT = os.path.join(os.path.expanduser("~"), "Desktop", "Manuels", "_qr_flash")

NIVEAUX = [
    ("6e", "6e", 6), ("5e", "5e", 6), ("4e", "4e", 6), ("3e", "3e", 6),
    ("2nde", "2nde A", 6), ("1ere", "1ere A", 6), ("tle", "Terminale A", 6),
]

def make(url, path, box=12):
    qr = qrcode.QRCode(version=None, error_correction=ERROR_CORRECT_Q, box_size=box, border=3)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color=NAVY, back_color="white")
    img.save(path)
    return img.size

def main():
    total = 0
    for slug, lab, nseq in NIVEAUX:
        d = os.path.join(OUT, slug)
        os.makedirs(d, exist_ok=True)
        # QR de couverture / préface : toutes les ressources du niveau
        u = "%s/flash/?c=%s" % (SITE, slug)
        size = make(u, os.path.join(d, "flash-%s-couverture.png" % slug))
        total += 1
        # QR par séquence
        for s in range(1, nseq + 1):
            u = "%s/flash/?c=%s&s=%d" % (SITE, slug, s)
            make(u, os.path.join(d, "flash-%s-s%d.png" % (slug, s)))
            total += 1
        print("  ✓ %-5s %d QR (%dx%d px)" % (slug, nseq + 1, size[0], size[1]))
    # QR générique (affiche, flyer, 4e de couverture)
    os.makedirs(OUT, exist_ok=True)
    make(SITE + "/constellation.html", os.path.join(OUT, "flash-constellation.png"))
    make(SITE + "/manuels.html", os.path.join(OUT, "flash-manuels.png"))
    make(SITE + "/enseignant/", os.path.join(OUT, "flash-enseignant.png"))
    total += 3
    print("\n%d QR codes écrits dans %s" % (total, OUT))
    print("À placer : le QR « couverture » en 4ᵉ de couverture et en préface ;")
    print("le QR « s<N> » dans l'encadré 🌐 Espace VÉRITAS de la séquence N.")

if __name__ == "__main__":
    main()
