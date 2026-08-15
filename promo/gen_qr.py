# -*- coding: utf-8 -*-
"""
gen_qr.py — QR codes des affiches de campagne.

Un QR par affiche, pointant vers la page qui tient la promesse de cette affiche.
Le paramètre `?src=` sert uniquement à mesurer quelle affiche ramène du monde
(cf. PLAN_CAMPAGNE.md §4) ; les pages statiques ignorent les paramètres inconnus.

Correction d'erreur Q : une affiche collée dehors se salit et se déchire.
Sortie : promo/affiches/qr/<nom>.svg — inclus tel quel dans les affiches HTML.

Usage : python promo/gen_qr.py
"""
import os
import segno

NAVY = "#001136"

CIBLES = {
    "corriges":   "https://veritas-school.com/corriges/?src=affiche-eleve",
    "enseignant": "https://veritas-school.com/enseignant/?src=affiche-prof",
    "parcours":   "https://veritas-school.com/parcours/?src=affiche-parent",
    "accueil":    "https://veritas-school.com/?src=affiche",
}

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "affiches", "qr")


def main():
    os.makedirs(OUT, exist_ok=True)
    for nom, url in CIBLES.items():
        qr = segno.make(url, error="Q")
        chemin = os.path.join(OUT, nom + ".svg")
        # svgclass/lineclass à None : pas de classes CSS parasites une fois inliné.
        qr.save(chemin, kind="svg", scale=10, border=2,
                dark=NAVY, light=None, svgclass=None, lineclass=None)
        print("  {:<12} {}".format(nom + ".svg", url))
    print("\n{} QR codes ecrits dans {}".format(len(CIBLES), OUT))


if __name__ == "__main__":
    main()
