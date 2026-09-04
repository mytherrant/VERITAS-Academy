#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/publier_cahiers_oeuvres.py — LES NEUF CAHIERS D'ŒUVRE INTÉGRALE EN VENTE

    python tools/publier_cahiers_oeuvres.py --build <dossier de build>
    python tools/publier_cahiers_oeuvres.py --build ... --seulement tartuffe

CE QUE FAIT CE PILOTE
  Il appelle `tools/publier_livre.py` neuf fois avec les bons arguments, et
  c'est tout son intérêt : ces arguments ne s'inventent pas à chaque fois. Le
  prix dépend du niveau, le niveau se lit sur la couverture imprimée, la teinte
  vient de `oeuvres.js`, et l'identifiant doit rester stable — un `--id` changé
  après une vente rendrait « document introuvable » à un client qui a payé.

CE QU'IL ATTEND EN ENTRÉE  (dossier --build)
    PDF/Cahier-<slug>.pdf     rendu A5 (exporter-pdf.cjs, format vérifié)
    epub/<slug>.epub          mode texte (tools/epub_cahier_oeuvre.py)
    oeuvres.js                titres, auteurs, genres, teintes

LE PRIX EST FIXÉ PAR NIVEAU, ET LE NIVEAU FAIT FOI SUR LA COUVERTURE
  Décision de Jacques (02/09/2026) : 2ⁿᵈᵉ 1 000 F · 1ʳᵉ 1 200 F · Tˡᵉ 1 300 F.
  ⚠️ `oeuvres.js` s'est trompé de classe sur quatre œuvres (lionperle, tenebres,
  ngum, vieuxnegre) : les couvertures imprimées et les pages SEO du dépôt
  disaient toutes autre chose. La table ci-dessous est la référence — elle est
  tenue à la main POUR CETTE RAISON, et ne se déduit pas de `oeuvres.js`.

LA COUVERTURE EST RECOPIÉE AVANT L'APPEL, ET REMISE APRÈS
  `publier_livre.py` fabrique sa propre vignette en 600×900 à l'emplacement
  `uploads/oeuvres/<id>.jpg` — donc PAR-DESSUS la couverture haute définition
  que `couvertures_oeuvres.py` vient d'y poser. On garde donc une copie et on
  la restaure : la boutique doit montrer le 1200×1600 éclairci, pas un
  sous-échantillon fabriqué en passant.
"""
from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path

for _f in (sys.stdout, sys.stderr):
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

RACINE = Path(__file__).resolve().parent.parent
VIGNETTES = RACINE / "uploads" / "oeuvres"

# slug → (niveau affiché, prix FCFA, icône)
NIVEAUX = {
    "tartuffe":   ("Seconde",   1000, "📗"),
    "capitoline": ("Seconde",   1000, "📗"),
    "poemes":     ("Seconde",   1000, "📗"),
    "balafon":    ("Première",  1200, "📘"),
    "lionperle":  ("Première",  1200, "📘"),
    "tenebres":   ("Première",  1200, "📘"),
    "ngum":       ("Terminale", 1300, "📕"),
    "stances":    ("Terminale", 1300, "📕"),
    "vieuxnegre": ("Terminale", 1300, "📕"),
}

AUTEUR_CAHIER = "Jacques Miterand TAKOU & Dominique Ambassa"

# Les pages offertes avant le mur. Dix pages sur ~200, c'est la couverture, le
# mode d'emploi et le début des notions : de quoi juger la marchandise sans
# livrer une séance entière.
PAGES_LIBRES = 10


def lire_oeuvres(build: Path) -> dict:
    """`oeuvres.js` lu sans l'exécuter : un bloc par slug, champs entre quotes."""
    src = (build / "oeuvres.js").read_text(encoding="utf-8")
    bornes = [m.start() for m in re.finditer(r"slug:\s*'", src)] + [len(src)]
    out = {}
    for i in range(len(bornes) - 1):
        bloc = src[bornes[i]:bornes[i + 1]]

        def champ(k, defaut=""):
            m = re.search(k + r":\s*'([^']*)'", bloc)
            return m.group(1).replace("\\'", "'") if m else defaut

        slug = champ("slug")
        if slug:
            out[slug] = {k: champ(k) for k in
                         ("titre", "auteur", "genre", "edition", "teinte")}
    return out


def publier(slug: str, build: Path, info: dict, largeur: int, qualite: int,
            refaire: bool) -> bool:
    niveau, prix, ico = NIVEAUX[slug]
    ident = "oeuvre-" + slug
    pdf = build / "PDF" / ("Cahier-%s.pdf" % slug)
    epub = build / "epub" / ("%s.epub" % slug)
    couv = VIGNETTES / (ident + ".jpg")

    for f, quoi in ((pdf, "PDF"), (epub, "EPUB"), (couv, "couverture")):
        if not f.is_file():
            print("  ✗ %-12s %s manquant : %s" % (slug, quoi, f))
            return False

    # Sauvegarde de la couverture HD (voir l'en-tête : publier_livre l'écrase).
    garde = couv.with_suffix(".hd.jpg")
    shutil.copy2(couv, garde)

    annee = re.search(r"\b(1[5-9]\d\d|20\d\d)\b", info.get("edition", "") or "")
    desc = ("Cahier d'étude intégrale de « %s » de %s%s. Six lectures méthodiques, "
            "commentaires composés et dissertations rédigés, devoirs au format MINESEC "
            "avec grilles OBC, fiches de révision et boîte à outils. "
            "Conforme au programme officiel — classe de %s."
            % (info.get("titre", slug), info.get("auteur", ""),
               (" (%s)" % annee.group(1)) if annee else "", niveau))

    cmd = [sys.executable, str(RACINE / "tools" / "publier_livre.py"),
           "--id", ident,
           "--titre", "%s — Cahier de l'œuvre intégrale" % info.get("titre", slug),
           "--auteur", AUTEUR_CAHIER,
           "--prix", str(prix),
           "--cls", niveau,
           "--matiere", "Français",
           "--desc", desc,
           "--ico", ico,
           "--couleur", info.get("teinte") or "#142554",
           "--editeur", "Éditions VÉRITAS",
           "--pdf", str(pdf),
           "--epub", str(epub),
           "--couverture", str(garde),
           "--pages-libres", str(PAGES_LIBRES),
           "--largeur", str(largeur),
           "--qualite", str(qualite)]
    if refaire:
        cmd.append("--refaire")

    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8",
                       errors="replace")
    sortie = (r.stdout or "") + (r.stderr or "")
    if r.returncode != 0:
        print("  ✗ %-12s échec :\n%s" % (slug, sortie[-700:]))
        garde.unlink(missing_ok=True)
        return False

    # On remet la couverture haute définition à sa place.
    shutil.move(str(garde), str(couv))

    pages = re.search(r"(\d+) pages,\s*([\d.]+) Mo", sortie)
    chap = re.search(r"(\d+) chapitres", sortie)
    print("  ✓ %-12s %-10s %4d F · %s pages, %s Mo · %s chapitres"
          % (slug, niveau, prix,
             pages.group(1) if pages else "?", pages.group(2) if pages else "?",
             chap.group(1) if chap else "?"))
    return True


def main() -> int:
    a = argparse.ArgumentParser(description="Publie les neuf cahiers d'œuvre intégrale.")
    a.add_argument("--build", required=True, help="dossier contenant PDF/, epub/ et oeuvres.js")
    a.add_argument("--seulement", default="", help="un seul slug")
    a.add_argument("--largeur", type=int, default=1000)
    a.add_argument("--qualite", type=int, default=76)
    a.add_argument("--refaire", action="store_true")
    o = a.parse_args()

    build = Path(o.build)
    infos = lire_oeuvres(build)
    slugs = [o.seulement] if o.seulement else list(NIVEAUX)

    print("\nPUBLICATION DES CAHIERS D'ŒUVRE INTÉGRALE  (%d px, q%d)\n"
          % (o.largeur, o.qualite))
    faits = 0
    for s in slugs:
        if s not in NIVEAUX:
            print("  ✗ %s : slug inconnu" % s)
            continue
        if s not in infos:
            print("  ✗ %s : absent de oeuvres.js" % s)
            continue
        faits += publier(s, build, infos[s], o.largeur, o.qualite, o.refaire)

    print("\n%d/%d cahier(s) publié(s).\n" % (faits, len(slugs)))
    return 0 if faits == len(slugs) else 1


if __name__ == "__main__":
    raise SystemExit(main())
