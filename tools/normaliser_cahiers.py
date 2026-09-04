#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/normaliser_cahiers.py — TOUS LES CAHIERS, UN SEUL FORMAT

    python tools/normaliser_cahiers.py --charge ~/veritas-ftp
    python tools/normaliser_cahiers.py --controle          # ne produit rien, mesure
    python tools/normaliser_cahiers.py --seulement 1ere

CE QUE ÇA FAIT
  Les sources de Jacques ne parlent pas la même langue. Trois formats coexistent
  dans ~/Desktop/Collaboratif, et aucun n'est celui que lit le moteur du cahier :

    BOOKLET*      1er cycle — {header, sequences[].weeks[].items[].flow[]}
    MANUEL_DATA   2nd cycle — {blocks:[{t,txt,…}]}
    export default  Bords   — [{y,r:[…]}]  (module ES, non exécutable en <script>)

  Ce script les ramène TOUS à une liste de blocs plate — `window.CAHIER_BLOCS` —
  celle que `livrets/cahier.js` sait rendre. Un format à l'exécution, trois à
  l'édition : la différence se règle ici, une fois, hors ligne.

LE POINT LE PLUS IMPORTANT — LES CORRIGÉS NE PARTENT PAS CHEZ L'ÉLÈVE
  Dans le 1er cycle, CHACUN des 492 exercices porte sa réponse : `"answer": …`.
  Servir la source telle quelle au livret de l'élève, c'est livrer le corrigé
  complet avec le cahier qu'on lui vend — et il n'a même pas à chercher : c'est
  dans le fichier que son navigateur télécharge.

  Donc deux charges distinctes, produites du même bois :
    booklet-<slug>.js   ÉLÈVE     — `answer` et `raw` retirés, bloc par bloc.
    guide-<slug>.js     ENSEIGNANT — les corrigés, et eux seuls, en regard.
  Le contrôle final RELIT le fichier élève et échoue si une réponse a survécu.

L'EXTRAIT GRATUIT EST UN EXTRAIT, PAS LE PRODUIT
  `extrait-<slug>.js` contient DEUX LEÇONS, prises loin l'une de l'autre, sans
  les corrigés — 3 à 13 Ko contre 240 à 650 Ko pour le cahier. Deux leçons
  suivies formeraient un morceau qu'on finit ; deux leçons éloignées font un
  sondage, qui montre ce qui manque entre elles.
  C'est la leçon retenue de « Demo 6e », qui chargeait le cahier entier.

OÙ VA QUOI
  --charge <dossier>  →  <dossier>/uploads/protected/livrets/*.js   (dépôt FTP)
                         <dossier>/livrets/extrait-<slug>.js        (public)
  Rien n'entre dans le dépôt git : booklet-* et guide-* sont le produit vendu.
"""
from __future__ import annotations

import argparse
import base64
import io
import json
import re
import sys
from pathlib import Path
from pathlib import Path as pathlib_Path

for _f in (sys.stdout, sys.stderr):          # la console Windows est en cp1252
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

RACINE = Path(__file__).resolve().parent.parent
SOURCE = Path.home() / "Desktop" / "Collaboratif"

DC = SOURCE / "Mise en page livret activité new"
L2 = SOURCE / "Livrets 2nde -Tle"
BO = SOURCE / "Bords de 6e en Tle"

# Le catalogue serveur : ce qui se vend, à quel prix, sous quelle nature.
CATALOGUE = RACINE / "api" / "data" / "livrets_catalogue.json"
# « Chaque livre c'est 1 500 frs » — Jacques, 27/08/2026.
PRIX_UNITAIRE = 1500


# ── Le manifeste : quel fichier, pour quel ouvrage, sous quel nom ────────────
# Un slug = un produit vendu = un code. « Sépare bien les classes » : le livret
# d'activités de 2ⁿᵈᵉ et le Bord de 2ⁿᵈᵉ sont DEUX ouvrages, deux codes, deux
# fois 1 500 F — ils n'ont ni le même contenu ni le même usage.
CAHIERS: dict[str, dict] = {
    # ── Livrets d'activités, 1er cycle (l'élève écrit) ──────────────────────
    "6e":   {"titre": "Mon Cahier de français 6ᵉ",        "niveau": "6e",
             "src": DC / "booklet-data.js",     "guide": DC / "guide-data-6e.js"},
    "5e":   {"titre": "Mon Cahier de français 5ᵉ",        "niveau": "5e",
             "src": DC / "booklet-data-5e.js",  "guide": DC / "guide-data-5e.js"},
    "4e":   {"titre": "Mon Cahier de français 4ᵉ",        "niveau": "4e",
             "src": DC / "booklet-data-4e.js",  "guide": DC / "guide-data-4e.js"},
    "3e":   {"titre": "Mon Cahier de français 3ᵉ (BEPC)", "niveau": "3e",
             "src": DC / "booklet-data-3e.js",  "guide": DC / "guide-data-3e.js"},
    "2nde": {"titre": "Mon Cahier de français 2ⁿᵈᵉ",      "niveau": "2nde",
             "src": DC / "booklet-data-2nde.js"},

    # ── Livrets d'activités, 2nd cycle ──────────────────────────────────────
    "1ere": {"titre": "Mon Cahier de français 1ʳᵉ A", "niveau": "1ere",
             "src": L2 / "livret1e-data.js"},
    "tle":  {"titre": "Mon Cahier de français Tˡᵉ A", "niveau": "tle",
             "src": L2 / "livret-data.js"},
    "est-tle": {"titre": "Cahier de français Tˡᵉ S&T", "niveau": "tle",
                "src": L2 / "livrettlest-data.js"},

    # ── Bords : le cahier complet, leçons et corrigés modèles ───────────────
    "bord-6e":   {"titre": "Bord — Cahier de français 6ᵉ",  "niveau": "6e",
                  "src": BO / "content.js"},
    "bord-5e":   {"titre": "Bord — Cahier de français 5ᵉ",  "niveau": "5e",
                  "src": BO / "content5e.js"},
    "bord-4e":   {"titre": "Bord — Cahier de français 4ᵉ",  "niveau": "4e",
                  "src": BO / "content4e.js"},
    "bord-3e":   {"titre": "Bord — Cahier de français 3ᵉ",  "niveau": "3e",
                  "src": BO / "content3e.js"},
    "bord-2nde": {"titre": "Bord — Cahier de français 2ⁿᵈᵉ", "niveau": "2nde",
                  "src": BO / "content2nde.js"},
    "bord-1ere": {"titre": "Bord — Cahier de français 1ʳᵉ", "niveau": "1ere",
                  "src": BO / "content1e.js"},
    "bord-tle":  {"titre": "Bord — Cahier de français Tˡᵉ", "niveau": "tle",
                  "src": BO / "contentTle.js"},
}


# ── Lecture des sources ─────────────────────────────────────────────────────
def lire_json_js(chemin: Path) -> object:
    """Un fichier de données est du JS, mais son corps est du JSON.

    On ne l'exécute pas : `json.loads` sur ce qui suit le premier « = » (ou le
    « export default »). Exécuter du JS pour lire des données demanderait un
    moteur, et donnerait à un fichier de contenu le droit de faire tourner du
    code sur le poste qui publie.
    """
    s = chemin.read_text(encoding="utf-8")
    s = s.lstrip("﻿").strip()
    if s.startswith("export default"):
        corps = s[len("export default"):]
    else:
        i = s.find("=")
        if i < 0:
            raise ValueError(f"{chemin.name} : ni « export default » ni « = »")
        corps = s[i + 1:]
    corps = corps.strip().rstrip(";").strip()
    return json.loads(corps)


def txt(v) -> str:
    """Le texte d'un champ, quelle que soit sa forme (str, {text}, [runs])."""
    if v is None:
        return ""
    if isinstance(v, str):
        return v.strip()
    if isinstance(v, dict):
        return txt(v.get("text") or v.get("txt") or v.get("t") or "")
    if isinstance(v, list):
        return " ".join(x for x in (txt(i) for i in v) if x).strip()
    return str(v).strip()


# ── L'EMPREINTE D'UNE CONSIGNE — miroir exact de livrets/cahier.js ──────────
# Le corrigé ne voyage plus avec l'exercice : il attend sur le serveur, rangé
# sous l'empreinte de la consigne à laquelle il répond. Le navigateur calcule
# cette empreinte de son côté (`empreinte()` dans cahier.js) ; ce code-ci doit
# rendre EXACTEMENT la même chaîne, sinon aucun corrigé ne se retrouve — et la
# panne serait muette : l'élève verrait « pas de correction pour cet exercice »
# sans que rien ne signale l'écart. `tests/banc_empreintes.cjs` compare les deux
# implémentations sur les 40 000 consignes réelles.
#
# FNV-1a 32 bits, en base 36. Deux pièges : le décalage de 24 bits déborde en
# Python (entiers illimités) et il faut donc masquer à chaque tour ; et
# `charCodeAt` rend des unités UTF-16, pas des points de code — sur un caractère
# hors du plan de base, itérer sur les caractères Python donnerait autre chose.
CHIFFRES36 = "0123456789abcdefghijklmnopqrstuvwxyz"


def base36(n: int) -> str:
    if n == 0:
        return "0"
    out = ""
    while n:
        n, r = divmod(n, 36)
        out = CHIFFRES36[r] + out
    return out


def empreinte(texte: str) -> str:
    t = re.sub(r"\s+", " ", str(texte or "")).strip().lower()
    # La coupe à 400 se fait en UNITÉS UTF-16, comme `slice()` en JavaScript,
    # pas en points de code comme le ferait `t[:400]`. Un emoji vaut deux
    # unités et un seul point de code : après lui, les deux troncatures ne
    # tombent plus au même endroit. Mesuré sur la charge réelle — 58 consignes
    # sur 40 720, toutes marquées d'un pictogramme, et toutes des exercices
    # dont le corrigé serait devenu introuvable.
    octets = t.encode("utf-16-le", "surrogatepass")[:800]
    unites = [int.from_bytes(octets[i:i + 2], "little") for i in range(0, len(octets), 2)]
    h = 0x811C9DC5
    for c in unites:
        h ^= c
        h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) & 0xFFFFFFFF
    return base36(h)


# ── Les blocs canoniques ────────────────────────────────────────────────────
# Vocabulaire tenu par livrets/cahier.js. Tout ce qui sort d'ici parle CETTE
# langue-là et rien d'autre : c'est le contrat entre la publication et le moteur.
def B(y: str, **kw) -> dict:
    b = {"y": y}
    b.update({k: v for k, v in kw.items() if v not in (None, "", [], {})})
    return b


def lignes(n) -> dict | None:
    """L'espace où l'élève écrit. `n` lignes du cahier imprimé deviennent un
    champ de saisie de `n` lignes — sans lui, le cahier se lit mais ne se
    remplit pas, et ce n'est plus un cahier."""
    try:
        n = int(n)
    except (TypeError, ValueError):
        n = 3
    return B("lines", n=max(1, min(40, n)))


# ══════════════════════════════════════════════════════════════════════════════
# LES DOCUMENTS ICONOGRAPHIQUES, EMBARQUÉS DANS LA CHARGE
# ══════════════════════════════════════════════════════════════════════════════
# 37 blocs `image` dans les quinze cahiers, et aucun ne s'affichait : les Bords
# nomment leur fichier dans `img` (« image4 ») et pas dans `src`, et les cahiers
# du lycée portent un chemin RELATIF (« images/1e-image-tele.jpg ») qui, servi
# depuis /livrets/cahier.html, pointe sur un dossier qui n'existe pas en ligne.
#
# POURQUOI ON LES EMBARQUE PLUTÔT QUE DE LES SERVIR
#   ① Le cahier doit s'ouvrir SANS RÉSEAU — c'est l'argument du produit, et la
#     charge est déjà gardée sept jours dans IndexedDB. Une image servie par une
#     URL ne suit pas : hors ligne, la consigne « observe le document » retombe
#     sur un carré vide.
#   ② Il n'y a aucun chemin où les poser. Les mettre dans `livrets/` les rendrait
#     PUBLIQUES (le dépôt est public, la CI copie le dossier entier) ; les servir
#     depuis le dossier protégé demanderait un endpoint PHP de plus, sur un site
#     qui part en production sans pré-production.
#   ③ Embarquées, elles suivent exactement le même verrou que le reste du
#     cahier : servies après validation du code, jamais avant.
#
# LE PRIX, ET COMMENT ON LE TIENT
#   Les photos sont recompressées à 820 px de large et qualité 62 — au-delà,
#   on paie des pixels qu'un téléphone n'affiche pas. Les SVG partent tels
#   quels : ce sont quelques kilo-octets de texte, et ils restent nets au zoom,
#   ce qui compte pour une carte mentale qu'on agrandit du doigt.
#   L'EXTRAIT GRATUIT, lui, n'embarque rien (voir `extraire`) : il doit rester
#   sous les 120 Ko du garde-fou de déploiement.
LARGEUR_IMG = 720
QUALITE_IMG = 60
# Plafond par photo. Une image de 250 Ko embarquée en base64 en coûte 330, et
# le Bord de 6ᵉ en porte huit : la charge doublait. On redescend en qualité,
# puis en largeur, jusqu'à passer sous ce plafond — une photo de document se lit
# très bien à 70 Ko, et l'élève peut l'agrandir puisqu'elle est dans la page.
PLAFOND_IMG = 90 * 1024
# Mis à True par `--sans-images` : produit des charges légères, sans les photos
# (les légendes restent). Les cartes mentales, elles, sont toujours embarquées —
# quelques kilo-octets de SVG, et c'est le cœur pédagogique.
SANS_IMAGES = False

# Où trouver les images des Bords : le nom du fichier source dit le dossier.
DOSSIERS_BORD = {
    "content.js": "images", "content5e.js": "images5e", "content4e.js": "images4e",
    "content3e.js": "images3e", "content1e.js": "images1e", "contentTle.js": "imagesTle",
}


def _chemin_image(bloc: dict, source: Path) -> Path | None:
    """Le fichier que désigne un bloc `image`, quel que soit le format d'origine."""
    if txt(bloc.get("src")):
        p = source.parent / txt(bloc["src"])
        return p if p.is_file() else None
    nom = txt(bloc.get("img"))
    if not nom:
        return None
    dossier = DOSSIERS_BORD.get(source.name)
    if not dossier:
        return None
    for ext in (".jpg", ".jpeg", ".png", ".svg"):
        p = source.parent / dossier / (nom + ext)
        if p.is_file():
            return p
    return None


def dimensions_image(chemin: Path) -> tuple[int, int]:
    """Les proportions du fichier — et il FAUT les transmettre.

    Ces SVG portent un `viewBox` mais ni `width` ni `height`. Dans une balise
    `<img>`, un tel fichier n'a AUCUNE taille intrinsèque : avec `height:auto`,
    le navigateur lui donne zéro pixel de haut. Et comme l'image est chargée en
    différé, une image de zéro pixel n'entre jamais dans l'écran, donc ne se
    charge jamais, donc garde zéro pixel — la carte mentale n'apparaissait pas
    du tout sur téléphone, sans une erreur nulle part.
    En donnant `width`/`height` à la balise, le navigateur réserve la bonne
    boîte avant même d'avoir lu le fichier : la carte s'affiche, et la page ne
    sursaute pas au chargement (ce qui compte autant sur une ligne lente).
    """
    try:
        if chemin.suffix.lower() == ".svg":
            tete = chemin.read_text(encoding="utf-8", errors="replace")[:800]
            m = re.search(r'viewBox\s*=\s*"[\d.\-]+\s+[\d.\-]+\s+([\d.]+)\s+([\d.]+)"',
                          tete, re.I)
            if m:
                return int(float(m.group(1))), int(float(m.group(2)))
            return 0, 0
        from PIL import Image
        with Image.open(chemin) as im:
            l, h = im.size
        if l > LARGEUR_IMG:
            h = round(h * LARGEUR_IMG / l)
            l = LARGEUR_IMG
        return int(l), int(h)
    except Exception:                                        # noqa: BLE001
        return 0, 0


def embarquer_image(chemin: Path) -> str:
    """Le fichier en `data:` — vide si on ne sait pas le lire, jamais une
    exception : une image illisible ne doit pas faire échouer la publication
    d'un cahier de six cents pages."""
    try:
        if chemin.suffix.lower() == ".svg":
            # Un SVG est du texte. On l'encode en base64 malgré tout : un `#`
            # ou un `%` dans une URL `data:` non encodée coupe l'attribut en
            # deux, et l'image disparaît sans que rien ne le signale.
            brut = chemin.read_bytes()
            return "data:image/svg+xml;base64," + base64.b64encode(brut).decode("ascii")
        from PIL import Image           # importé ici : le contrôle n'en a pas besoin
        im = Image.open(chemin)
        if im.mode in ("RGBA", "P", "LA"):
            fond = Image.new("RGB", im.size, "white")
            im = im.convert("RGBA")
            fond.paste(im, mask=im.split()[-1])
            im = fond
        else:
            im = im.convert("RGB")
        if im.width > LARGEUR_IMG:
            im = im.resize((LARGEUR_IMG, round(im.height * LARGEUR_IMG / im.width)),
                           Image.LANCZOS)
        # On descend jusqu'à passer sous le plafond : d'abord la qualité (l'œil
        # la remarque peu sur une photo de document), la largeur en dernier.
        octets = b""
        for larg, qual in ((im.width, QUALITE_IMG), (im.width, 50), (im.width, 42),
                           (560, 48), (460, 45)):
            copie = im if larg == im.width else im.resize(
                (larg, round(im.height * larg / im.width)), Image.LANCZOS)
            tampon = io.BytesIO()
            copie.save(tampon, "JPEG", quality=qual, optimize=True, progressive=True)
            octets = tampon.getvalue()
            if len(octets) <= PLAFOND_IMG:
                break
        return "data:image/jpeg;base64," + base64.b64encode(octets).decode("ascii")
    except Exception as e:                                   # noqa: BLE001
        print(f"  ⚠ image illisible, ignorée : {chemin.name} ({e})")
        return ""


# ── LES CARTES MENTALES ─────────────────────────────────────────────────────
# Treize schémas SVG dorment dans `Livrets 2nde -Tle/images/` : douze cartes
# mentales et le schéma de la communication de Jakobson. Ils sont référencés
# par `livret2nde-data.js` — un fichier qui n'est la source d'AUCUN des quinze
# ouvrages vendus. Du contenu produit, payé, et que personne ne peut voir.
#
# On les rattache donc aux leçons qui ENSEIGNENT la notion, dans tous les
# cahiers où cette leçon existe. La table est écrite à la main et vérifiable :
# une carte mentale posée sur la mauvaise leçon serait pire que pas de carte
# du tout.
#
# DEUX PRÉCAUTIONS, APPRISES EN LES MESURANT
#   ① Les motifs sont ancrés sur des frontières de mot. Sans `\b`,
#     « énonciation » s'accrochait à « La DÉnonciation des contre-valeurs »
#     dans le Bord de 6ᵉ — la carte de l'énonciation sur une leçon de lecture
#     suivie.
#   ② On écarte les titres d'ÉPREUVE et de PRODUCTION : « Épreuve 1 — Langue
#     française (texte narratif) » n'est pas une leçon sur le texte narratif,
#     et « Produire un texte narratif complet » demande d'écrire, pas
#     d'apprendre. La carte va où l'on découvre la notion.
CARTES_MENTALES: list[tuple[str, str, str]] = [
    # (fichier SVG, motif du titre de leçon, légende)
    ("2nde-jakobson.svg",
     r"\bfacteurs de la communication\b|\bsch[ée]ma de la communication\b",
     "Le schéma de la communication selon Jakobson : six facteurs, six fonctions du langage."),
    ("2nde-mm-valeurs-indicatif.svg",
     r"\bvaleurs du mode indicatif\b|\bvaleurs de l'indicatif\b",
     "Carte mentale — les valeurs du mode indicatif."),
    ("2nde-mm-texte-narratif.svg",
     r"\ble texte narratif\b",
     "Carte mentale — les composantes du texte narratif."),
    ("2nde-mm-progression-thematique.svg",
     r"\bprogressions? th[ée]matiques?\b",
     "Carte mentale — les trois types de progression thématique."),
    ("2nde-mm-figures-analogie.svg",
     r"\bfigures d'analogie\b",
     "Carte mentale — les figures d'analogie."),
    ("2nde-mm-texte-theatral.svg",
     r"\btexte th[ée][âa]tral\b",
     "Carte mentale — les caractéristiques du texte théâtral."),
    ("2nde-mm-formation-mots.svg",
     r"\bformation des mots\b",
     "Carte mentale — la formation des mots : dérivation et composition."),
    ("2nde-mm-connecteurs-logiques.svg",
     r"\bconnecteurs logiques\b",
     "Carte mentale — les connecteurs logiques."),
    ("2nde-mm-figures-insistance.svg",
     r"\bfigures d'insistance\b",
     "Carte mentale — les figures d'insistance."),
    ("2nde-mm-enonciation.svg",
     r"\b[ée]nonciation\b",
     "Carte mentale — les indices de l'énonciation."),
    ("2nde-mm-discours-recit.svg",
     r"\bdiscours et (?:le )?r[ée]cit\b",
     "Carte mentale — discours et récit."),
    ("2nde-mm-tonalite-lyrique.svg",
     r"\btonalit[ée] lyrique\b",
     "Carte mentale — la tonalité lyrique."),
    ("2nde-mm-homonymes-paronymes.svg",
     r"\bhomonymes\b.{0,20}\bparonymes\b",
     "Carte mentale — homonymes et paronymes."),
]

# Un titre qui contient l'un de ces mots n'est pas une leçon sur la notion :
# c'est une épreuve qui l'évalue, ou une tâche qui la réinvestit.
PAS_UNE_LECON = re.compile(
    r"\b[ée]preuve\b|\b[ée]valuation\b|\bproduire\b|\bproduction\b|\br[ée]diger\b"
    r"|\bbilan\b|\bsujet\b|\bcorrig[ée]\b|\baxe\s*\d", re.I)

_CACHE_CARTES: dict[str, str] = {}
_CACHE_DIMS: dict[str, tuple[int, int]] = {}

# Le fichier source en cours de conversion. Les blocs `image` désignent leur
# fichier RELATIVEMENT à lui (« images/… » chez le lycée, un simple nom chez les
# Bords) : sans savoir d'où l'on part, on ne peut pas les retrouver.
SRC_COURANTE: Path | None = None


def bloc_image(x: dict) -> dict | None:
    """Un bloc `image` de n'importe quelle source, fichier embarqué."""
    if SRC_COURANTE is None:
        return None
    p = _chemin_image(x, SRC_COURANTE)
    cap = txt(x.get("cap") or x.get("legende"))
    if p is None or SANS_IMAGES:
        # On garde la légende : la consigne qui renvoie au document doit au
        # moins dire de quoi elle parle. Le moteur l'affiche telle quelle.
        return B("image", cap=cap) if cap else None
    l, h = dimensions_image(p)
    return B("image", src=embarquer_image(p), cap=cap, w=l or None, h=h or None)


def carte_mentale_pour(titre: str) -> dict | None:
    """La carte mentale qui éclaire cette leçon, embarquée — ou rien."""
    t = txt(titre)
    if not t or PAS_UNE_LECON.search(t):
        return None
    for fichier, motif, legende in CARTES_MENTALES:
        if not re.search(motif, t, re.I):
            continue
        if fichier not in _CACHE_CARTES:
            p = L2 / "images" / fichier
            _CACHE_CARTES[fichier] = embarquer_image(p) if p.is_file() else ""
            _CACHE_DIMS[fichier] = dimensions_image(p) if p.is_file() else (0, 0)
        src = _CACHE_CARTES[fichier]
        if not src:
            return None
        l, h = _CACHE_DIMS.get(fichier, (0, 0))
        return B("carte", src=src, cap=legende, w=l or None, h=h or None)
    return None


# ── LA TABLE DES CORRIGÉS ───────────────────────────────────────────────────
# « L'apprenant peut travailler de manière autonome puis voir les corrigés sans
# avoir besoin de l'enseignant » (Jacques, 27/08/2026). C'est le premier des
# trois modes que prévoyait le cahier des charges : déverrouillage à la
# complétion, exercice par exercice.
#
# Mais l'impératif de sécurité du même document tient toujours : « le corrigé
# ne doit JAMAIS être envoyé au navigateur avant déverrouillage. Pas de
# display:none, pas de classe CSS masquante. » Autonome ne veut pas dire livré
# d'avance — sinon l'élève lit la réponse avant d'avoir cherché, et le cahier
# ne sert plus à rien.
#
# D'où cette table à part, `corrige-<slug>.js`, qui reste dans le dossier
# protégé. Elle est indexée par l'EMPREINTE de la consigne, pas par un rang :
# api/cahier.php n'a pas à connaître le document pour retrouver le bon corrigé,
# et corriger une coquille dans un exercice déplace son corrigé avec lui.
CORRIGES: dict[str, str] = {}


PREFIXE_EXO = re.compile(r"^Exercice\s+\d+\s*[—–-]\s*")

# ── CE QUI N'EST PAS UN CORRIGÉ, MÊME SI ÇA S'APPELLE `answer` ──────────────
# Dans les sources du 1er cycle, `answer` ne porte pas la réponse : il porte la
# FORME de l'exercice — « lines » (des lignes à remplir), « options » (un QCM),
# « relier », « crossword », « wordsearch ». La réponse, elle, est ailleurs ou
# n'existe pas.
#
# Pris pour des corrigés, ces mots-clés partaient dans la table. Mesuré sur la
# charge du 01/09/2026, AVANT correction :
#     2ⁿᵈᵉ  319 corrigés annoncés — 319 valaient le mot « lines », soit 100 %
#     6ᵉ    953 —  466 (49 %)   ·   5ᵉ  884 — 441 (50 %)
#     4ᵉ    800 —  440 (55 %)   ·   3ᵉ 1021 — 460 (45 %)
# soit 2 126 des 3 977 « corrigés en libre-service » vendus avec les cahiers.
#
# Concrètement : l'élève cherchait, répondait, cliquait « Voir la correction »
# — et lisait « lines ». Le cahier de 2ⁿᵈᵉ ne pouvait rien répondre d'autre.
# Rien ne plantait, aucune erreur nulle part : la fonctionnalité payée
# répondait, et ce qu'elle répondait n'avait aucun sens.
#
# On refuse donc ces mots. Un exercice sans vrai corrigé n'entre plus dans la
# table, et api/cahier.php répond alors « aucune correction type » (404) — ce
# que le moteur sait dire. Mieux vaut l'absence annoncée qu'une réponse fausse.
FORMES_EXERCICE = {"lines", "options", "relier", "crossword", "wordsearch", "wordbank"}


def noter_corrige(consigne: str, corrige: str) -> None:
    """Range un corrigé sous l'empreinte de sa consigne — et sous sa variante
    sans numéro.

    Le livret nomme l'exercice par son `body` (« Indique le type… »), le guide
    par sa `consigne` complète (« Exercice 1 — Indique le type… »). Ce sont
    deux chaînes, donc deux empreintes, donc deux corrigés qui ne se
    retrouveraient jamais. On enregistre les deux clés : la table grossit d'une
    entrée, et le corrigé du guide — plus détaillé que la réponse brute du
    livret — devient atteignable depuis le cahier de l'élève."""
    c, r = txt(consigne), txt(corrige)
    if not c or not r:
        return
    if r.strip().lower() in FORMES_EXERCICE:
        return
    CORRIGES[empreinte(c)] = r
    nu = PREFIXE_EXO.sub("", c)
    if nu != c:
        CORRIGES.setdefault(empreinte(nu), r)


# ── Format 1 : BOOKLET (1er cycle) ──────────────────────────────────────────
def depuis_booklet(d: dict, avec_corriges: bool) -> list[dict]:
    out: list[dict] = []
    h = d.get("header") or {}
    if txt(h.get("subtitle") or h.get("title")):
        out.append(B("rubrique", txt=txt(h.get("subtitle") or h.get("title"))))

    def flot(flow: list, corrige_ok: bool) -> None:
        for f in flow or []:
            if not isinstance(f, dict):
                continue
            t = f.get("t")
            if t == "section":
                out.append(B("rubrique", txt=txt(f.get("label"))))
            elif t == "objective":
                out.append(B("objectif", txt=txt(f.get("text"))))
            elif t in ("plain", "critere", "lexique", "corpus", "sit", "integration"):
                y = {"corpus": "corpus", "critere": "def", "lexique": "def"}.get(t, "texte")
                titre = txt(f.get("title"))
                if titre:
                    out.append(B("rubrique", txt=titre))
                out.append(B(y, txt=txt(f.get("text") or f.get("body"))))
                if t == "sit":
                    out.append(lignes(14))
            elif t == "consigne":
                out.append(B("consigne", txt=txt(f.get("text"))))
            elif t == "passage":
                if txt(f.get("title")):
                    out.append(B("rubrique", txt=txt(f.get("title"))))
                out.append(B("texte", txt=txt(f.get("lines"))))
            elif t == "production":
                out.append(B("rubrique", txt=txt(f.get("title")) or "Ta production"))
                out.append(lignes(f.get("lines") or 14))
            elif t == "exercise":
                exercice(f, corrige_ok)
            # ── CE QUI TOMBAIT PAR TERRE ─────────────────────────────────────
            # Cinq types de blocs traversaient ce `for` sans qu'aucun `elif` ne
            # les prenne : la boucle passait à la suivante, en silence. Compté
            # sur les cinq cahiers du 1er cycle : 123 questions, 91 sources,
            # 19 sous-titres, 8 astuces, 6 sujets — 247 blocs.
            # Le livret de 2ⁿᵈᵉ portait à lui seul 123 questions et 66 sources :
            # l'acheteur payait un cahier dont un bloc sur huit n'existait pas.
            # Rien ne le disait — un `elif` manquant ne lève pas d'erreur.
            elif t == "question":
                out.append(B("question", no=txt(f.get("num")),
                             txt=txt(f.get("body") or f.get("text"))))
                if f.get("lines"):
                    out.append(lignes(f.get("lines")))
            elif t == "source":
                out.append(B("source", txt=txt(f.get("text") or f.get("raw"))))
            elif t == "subhead":
                out.append(B("rubrique", txt=txt(f.get("text"))))
            elif t == "astuce":
                out.append(B("astuce", txt=txt(f.get("text"))))
            elif t == "sujet":
                out.append(B("sujet", txt=txt(f.get("text"))))
                out.append(lignes(f.get("cahierH") or 14))

    def exercice(f: dict, corrige_ok: bool) -> None:
        """Un exercice, et — pour le guide seulement — sa réponse.

        `raw` répète la consigne préfixée du numéro : on garde `body`, sinon la
        consigne s'affiche deux fois. `answer` ne sort JAMAIS d'ici vers l'élève.
        """
        no = txt(f.get("num"))
        corps = txt(f.get("body")) or txt(f.get("raw"))
        if txt(f.get("consigne")):
            out.append(B("consigne", txt=txt(f.get("consigne"))))
        out.append(B("exercice", no=no, txt=corps))

        opts = f.get("options")
        if isinstance(opts, list) and opts:
            out.append(B("qcm", options=[txt(o) for o in opts if txt(o)]))
        g, dr = f.get("relLeft"), f.get("relRight")
        if isinstance(g, list) and isinstance(dr, list) and g and dr:
            out.append(B("appariement",
                         gauche=[txt(x) for x in g], droite=[txt(x) for x in dr]))

        # ── LES JEUX : MOTS CROISÉS ET MOTS MÊLÉS ───────────────────────────
        # « Des jeux (mots croisés, mots mêlés) […] invitent l'élève à
        # réinvestir ses acquis de façon vivante » — avant-propos du livret
        # imprimé. Il y en a 86 dans les quatre cahiers du 1er cycle : 31
        # grilles de mots croisés et 55 de mots mêlés.
        #
        # Aucune ne franchissait cette fonction. La consigne passait
        # (« Complète la grille de mots croisés à l'aide des définitions
        # ci-dessous »), la grille et les définitions restaient dans la source.
        # L'acheteur lisait donc une consigne qui renvoyait à des définitions
        # absentes, sous un espace vide. C'est le genre de trou qu'aucune
        # erreur ne signale : la page s'affiche, complète, et il manque
        # l'exercice.
        #
        # RIEN DE CE QU'ON TRANSMET N'EST UNE RÉPONSE : la grille de mots
        # croisés ne porte que les cases et leurs numéros (`cell`), jamais les
        # lettres ; celle des mots mêlés porte les lettres, mais trouver les
        # mots dedans EST l'exercice. On peut donc les servir à l'élève.
        cw = f.get("crossword")
        if isinstance(cw, dict) and cw.get("cell"):
            cl = cw.get("clues") or {}
            out.append(B("motscroises",
                         cases=cw.get("cell"),
                         horiz=[{"n": txt(d.get("num")), "d": txt(d.get("def"))}
                                for d in (cl.get("A") or []) if isinstance(d, dict)],
                         verti=[{"n": txt(d.get("num")), "d": txt(d.get("def"))}
                                for d in (cl.get("D") or []) if isinstance(d, dict)]))
        ws = f.get("wordsearch")
        if isinstance(ws, dict) and ws.get("grid"):
            # Une ligne de grille est une chaîne (« IODLABREMFSUC ») ou une
            # liste de lettres selon la source : on ramène à la chaîne, qui est
            # ce que le moteur découpe.
            lignes_ws = []
            for r in ws.get("grid") or []:
                r = "".join(str(c) for c in r) if isinstance(r, list) else txt(r)
                if r:
                    lignes_ws.append(r)
            out.append(B("motsmeles",
                         grille=lignes_ws,
                         mots=[txt(w) for w in (ws.get("words") or []) if txt(w)]))

        if f.get("lines"):
            out.append(lignes(f.get("lines")))
        if txt(f.get("answer")):
            # Noté pour la table, servi par le serveur — jamais posé dans le
            # cahier de l'élève, même quand on produit celui de l'enseignant.
            noter_corrige(corps, f.get("answer"))
            if corrige_ok:
                out.append(B("corrige", txt=txt(f.get("answer"))))

    for sq in d.get("sequences") or []:
        out.append(B("sequence", no=txt(sq.get("num")), title=txt(sq.get("title"))))
        if txt(sq.get("competence")):
            out.append(B("competence", txt=txt(sq.get("competence"))))
        if txt(sq.get("intro")):
            out.append(B("texte", txt=txt(sq.get("intro"))))
        for w in sq.get("weeks") or []:
            out.append(B("semaine", no=txt(w.get("num")), title=txt(w.get("title"))))
            for it in w.get("items") or []:
                out.append(B("lecon", no=txt(it.get("label")), title=txt(it.get("title"))))
                # La carte mentale de la notion, si elle existe : posée juste
                # après le titre, là où l'élève ouvre la leçon.
                carte = carte_mentale_pour(it.get("title"))
                if carte:
                    out.append(carte)
                if txt(it.get("disc")):
                    out.append(B("rubrique", txt=txt(it.get("disc"))))
                for o in it.get("objectives") or []:
                    out.append(B("objectif", txt=txt(o)))
                te = it.get("texte")
                if isinstance(te, dict) and txt(te.get("text")):
                    out.append(B("texte", txt=txt(te.get("text"))))
                    if txt(te.get("attr")):
                        out.append(B("source", txt=txt(te.get("attr"))))
                for r in it.get("retiens") or []:
                    y = {"astuce": "astuce", "example": "def", "rule": "retC"}.get(r.get("t"), "retC")
                    if r.get("t") == "plain" and not out[-1:] or r.get("t") == "rule":
                        pass
                    out.append(B(y, txt=txt(r.get("text"))))
                flot(it.get("flow"), avec_corriges)
    return out


# ── Format 1 bis : le GUIDE de l'enseignant ─────────────────────────────────
# Même mot-clé de tête que le livret (`sequences`), structure entièrement
# différente : ni `weeks` ni `flow`, mais `lessons[].exercises[{consigne,corrige}]`.
# Le convertisseur du livret n'y trouvait donc que les titres de séquence et
# rendait un guide de 417 octets — un fichier qui s'ouvre, qui ne dit rien, et
# dont l'enseignant n'a aucun moyen de savoir qu'il devrait contenir 467
# corrigés. C'est le genre de vide qu'on ne remarque qu'en pesant le résultat.
def est_guide(d: dict) -> bool:
    for sq in d.get("sequences") or []:
        if isinstance(sq, dict) and "lessons" in sq:
            return True
    return False


def depuis_guide(d: dict) -> list[dict]:
    out: list[dict] = []
    for sq in d.get("sequences") or []:
        out.append(B("sequence", title=txt(sq.get("title"))))
        for L in sq.get("lessons") or []:
            out.append(B("lecon", title=txt(L.get("title"))))
            for r in L.get("retiens") or []:
                if not isinstance(r, dict):
                    continue
                # `t` vaut « corrige » quand l'encadré EST un corrigé de texte.
                y = "corrige" if r.get("t") == "corrige" else "retC"
                out.append(B(y, txt=txt(r.get("x"))))
            for e in L.get("exercises") or []:
                out.append(B("exercice", txt=txt(e.get("consigne"))))
                if txt(e.get("corrige")):
                    noter_corrige(e.get("consigne"), e.get("corrige"))
                    out.append(B("corrige", txt=txt(e.get("corrige"))))
            if txt(L.get("conseils")):
                out.append(B("outilT", txt="Conseils de classe"))
                out.append(B("outilC", txt=txt(L.get("conseils"))))
    return out


# ── Format 2 : MANUEL_DATA (2nd cycle) ──────────────────────────────────────
# Les blocs y sont déjà plats ; il reste à traduire le vocabulaire et à rendre
# `lines` visible — c'est là que l'élève écrit, et le moteur l'ignorait.
TRAD_MANUEL = {
    "part": "sequence", "seq": "sequence", "sem": "semaine", "disc": "lecon",
    "objectif": "objectif", "rubrique": "rubrique", "texte": "texte",
    "texteT": "rubrique", "corpus": "corpus", "corps": "texte", "source": "source",
    "question": "question", "exercice": "exercice", "consigne": "consigne",
    "retT": "retT", "retC": "retC", "astuce": "astuce", "def": "def",
    "outilT": "outilT", "outilC": "outilC", "bac": "def", "liste": "texte",
    "savais": "def", "image": "image", "autoeval": "rubrique", "lines": "lines",
    "textelabel": "rubrique", "textelabel2": "rubrique",
}


def depuis_manuel(d: dict, avec_corriges: bool) -> list[dict]:
    out: list[dict] = []
    for x in d.get("blocks") or []:
        if not isinstance(x, dict):
            continue
        t = x.get("t") or x.get("y")
        if t == "lines":
            out.append(lignes(x.get("n")))
            continue
        y = TRAD_MANUEL.get(t)
        if y is None:
            continue
        if y == "lecon":
            # `disc` porte la leçon : titre d'un côté, domaine de l'autre.
            out.append(B("lecon", no=txt(x.get("lecon")), title=txt(x.get("titre"))))
            carte = carte_mentale_pour(x.get("titre"))
            if carte:
                out.append(carte)
            if txt(x.get("dom")):
                out.append(B("rubrique", txt=txt(x.get("dom"))))
            continue
        if y == "sequence":
            out.append(B("sequence", no=txt(x.get("n") or x.get("num")), title=txt(x.get("txt"))))
            if txt(x.get("comp")):
                out.append(B("competence", txt=txt(x.get("comp"))))
            continue
        if y == "semaine":
            out.append(B("semaine", no=txt(x.get("num") or x.get("n")), title=txt(x.get("txt"))))
            continue
        if y == "image":
            # `d` n'est PAS une source : c'est le numéro de séquence du bloc
            # dans ce format. Le lire comme une image donnait `src="1"`, donc
            # une balise <img> vers un fichier nommé « 1 ».
            im = bloc_image(x)
            if im:
                out.append(im)
            continue
        out.append(B(y, txt=txt(x.get("txt"))))
    return out


# ── Format 3 : les Bords (export default [{y,r}]) ───────────────────────────
# Ce format EST déjà le vocabulaire du moteur — c'est de là qu'il vient. On le
# recopie tel quel, en retirant seulement la couverture et les mentions légales
# (le cahier en ligne a les siennes) et en normalisant le nom du type.
BORD_IGNORE = {"cover", "coverauth", "legal", "toc", "tocitem", "pagebreak"}


def depuis_bord(blocs: list, avec_corriges: bool) -> list[dict]:
    out: list[dict] = []
    for x in blocs or []:
        if not isinstance(x, dict):
            continue
        y = x.get("y") or x.get("t") or ""
        if y in BORD_IGNORE:
            continue
        if y in ("lines", "ligne"):
            out.append(lignes(x.get("n")))
            continue
        # ATTENTION — `retientC` n'est PAS un corrigé : c'est le contenu de
        # l'encadré « Je retiens », donc de la leçon. Le retirer viderait le
        # cahier de ce qu'il enseigne. Mesuré sur le Bord de 1ʳᵉ : 209 blocs.
        # Le Bord se vend d'ailleurs AVEC ses corrigés modèles — c'est le
        # produit. Seul un bloc explicitement `corrige` est réservé au guide.
        if not avec_corriges and y in ("corrige", "reponse"):
            continue
        # Les Bords nomment leur illustration dans `img` (« image4 ») et le
        # fichier vit dans un dossier frère (`images4e/image4.jpg`). Recopié
        # tel quel, ce nom ne désignait rien pour le navigateur : trente et une
        # illustrations n'ont jamais été affichées.
        if y == "image":
            im = bloc_image(x)
            if im:
                out.append(im)
            continue
        b = dict(x)
        b["y"] = TRAD_MANUEL.get(y, y)
        b.pop("t", None)
        out.append(b)
        # Le titre d'une leçon de Bord vit dans ses `runs` : `txt()` sait les
        # lire, et c'est lui qui décide s'il existe une carte mentale.
        if b["y"] in ("lecon", "disc"):
            carte = carte_mentale_pour(txt(b.get("title") or b.get("titre") or b.get("r")))
            if carte:
                out.append(carte)
    return out


def alleger(blocs: list[dict]) -> list[dict]:
    """L'APERÇU GRATUIT NE PORTE PAS LES FICHIERS EMBARQUÉS.

    Une photo embarquée pèse 40 à 250 Ko à elle seule ; l'extrait, lui, tient
    entre 3 et 13 Ko et la CI REFUSE de déployer un `livrets/*.js` de plus de
    120 Ko — c'est le garde-fou qui empêche de publier par accident un cahier
    entier en clair. Deux leçons tirées au bon endroit auraient suffi à le
    faire sauter, et le déploiement se serait arrêté sans qu'on comprenne
    pourquoi : rien dans le message n'aurait parlé d'images.

    On garde la LÉGENDE : le visiteur voit qu'il y a un document, et de quoi il
    parle. C'est même honnête — l'aperçu montre la forme, le cahier livre le
    contenu.
    """
    net: list[dict] = []
    for b in blocs:
        if isinstance(b, dict) and b.get("y") in ("image", "carte") and b.get("src"):
            b = {k: v for k, v in b.items() if k != "src"}
            if not b.get("cap"):
                continue
        net.append(b)
    return net


# ── Extrait gratuit ─────────────────────────────────────────────────────────
def extraire(blocs: list[dict]) -> list[dict]:
    """DEUX LEÇONS, PRISES LOIN L'UNE DE L'AUTRE.

    Règle arrêtée par Jacques le 27/08 : « l'aperçu gratuit est trop long :
    2 leçons maximum et non suivies. » Elle corrige deux défauts d'un coup.

      TROP LONG. La première version donnait la séquence entière — jusqu'à
      87 Ko, un huitième du cahier. Assez pour travailler une semaine sans
      payer, donc assez pour ne pas payer.

      SUIVIES. Deux leçons consécutives, c'est un morceau du cahier : on le
      finit et on s'arrête. Deux leçons prises à des endroits éloignés, c'est
      un sondage : on voit que le cahier tient sur toute l'année, et il manque
      tout ce qu'il y a entre les deux.

    Le choix est DÉTERMINISTE (premier quart, dernier tiers) et non tiré au
    sort : un aperçu qui change à chaque publication ne se vérifie pas, et un
    banc qui mesure une valeur tirée au hasard rougit un jour sur deux.
    """
    DIVISIONS = ("sequence", "module", "part", "seq")
    ENTETES = DIVISIONS + ("semaine", "sem", "section")
    LECONS = ("lecon", "epreuve")

    # ── Découpage en leçons, chacune avec l'en-tête qui l'introduit ──────────
    lecons: list[dict] = []
    entete: list[dict] = []
    courante: dict | None = None
    for b in blocs:
        y = b.get("y")
        if y in ENTETES:
            # On garde la dernière division de tête et la dernière semaine :
            # une leçon servie sans son titre de séquence tombe de nulle part.
            entete = [x for x in entete if x.get("y") not in (y,)] + [b]
            entete = entete[-2:]
            continue
        if y in LECONS:
            courante = {"entete": list(entete), "titre": titre_de(b), "blocs": [b]}
            lecons.append(courante)
            continue
        if courante is not None:
            courante["blocs"].append(b)

    # Une leçon de corrigé n'est pas un échantillon : c'est la réponse.
    # Une leçon trop courte ne montre rien du cahier.
    utiles = [l for l in lecons
              if "corrigé" not in l["titre"].lower() and len(l["blocs"]) >= 8]
    if len(utiles) < 2:
        utiles = [l for l in lecons if "corrigé" not in l["titre"].lower()]
    if not utiles:
        return blocs[:120]

    if len(utiles) == 1:
        choisies = utiles
    else:
        a = utiles[max(0, len(utiles) // 4)]
        b2 = utiles[min(len(utiles) - 1, (len(utiles) * 2) // 3)]
        # « non suivies » : si le calcul tombe sur deux voisines, on écarte.
        if utiles.index(b2) - utiles.index(a) < 2:
            b2 = utiles[-1]
        choisies = [a, b2] if utiles.index(a) != utiles.index(b2) else [a]

    out: list[dict] = []
    for n, l in enumerate(choisies):
        if n:
            out.append(B("rubrique", txt="⋯ plus loin dans le cahier ⋯"))
        for e in l["entete"]:
            out.append(e)
        for b in l["blocs"]:
            if b.get("y") in ("corrige", "reponse"):
                continue
            out.append(b)
    return out


def titre_de(b: dict) -> str:
    """Le texte d'un bloc de titre, quelle que soit la source."""
    bout = txt(b.get("title") or b.get("titre") or b.get("txt") or b.get("disc"))
    if not bout and isinstance(b.get("r"), list):
        bout = " ".join(txt(r.get("t")) for r in b["r"] if isinstance(r, dict))
    return bout


# ── Contrôles ───────────────────────────────────────────────────────────────
INTERDITS_ELEVE = ("\"answer\"", "'answer'", "\"y\":\"corrige\"", "\"y\": \"corrige\"")


def controler_eleve(js: str, slug: str) -> list[str]:
    """On RELIT ce qu'on vient d'écrire. Un corrigé retiré au bon endroit dans
    le code mais présent dans le fichier produit reste un corrigé livré."""
    fautes = [m for m in INTERDITS_ELEVE if m in js]
    return [f"{slug} : « {m} » présent dans la charge de l'ÉLÈVE" for m in fautes]


def compter(blocs: list[dict]) -> dict:
    n = {}
    for b in blocs:
        n[b.get("y")] = n.get(b.get("y"), 0) + 1
    champs = n.get("lines", 0) + n.get("exercice", 0) + n.get("question", 0) + n.get("consigne", 0)
    return {"blocs": len(blocs), "champs": champs, "types": n}


# ── Production ──────────────────────────────────────────────────────────────
def produire(slug: str, spec: dict, charge: Path | None, controle: bool) -> dict:
    src: Path = spec["src"]
    if not src.is_file():
        return {"slug": slug, "erreur": f"source absente : {src.name}"}

    CORRIGES.clear()          # une table par ouvrage, jamais mélangées
    global SRC_COURANTE
    SRC_COURANTE = src        # d'où partent les chemins d'image de CE cahier
    brut = lire_json_js(src)
    if isinstance(brut, list):
        eleve = depuis_bord(brut, False)
        prof = depuis_bord(brut, True)
    elif isinstance(brut, dict) and est_guide(brut):
        eleve = prof = depuis_guide(brut)
    elif isinstance(brut, dict) and "sequences" in brut:
        eleve = depuis_booklet(brut, False)
        prof = depuis_booklet(brut, True)
    elif isinstance(brut, dict) and "blocks" in brut:
        eleve = depuis_manuel(brut, False)
        prof = depuis_manuel(brut, True)
    else:
        return {"slug": slug, "erreur": "format de source non reconnu"}

    # Le guide de l'enseignant vient d'un fichier à part quand il existe.
    if spec.get("guide") and Path(spec["guide"]).is_file():
        SRC_COURANTE = Path(spec["guide"])
        g = lire_json_js(Path(spec["guide"]))
        if isinstance(g, dict) and est_guide(g):
            prof = depuis_guide(g)
        elif isinstance(g, dict) and "sequences" in g:
            prof = depuis_booklet(g, True)
        elif isinstance(g, dict) and "blocks" in g:
            prof = depuis_manuel(g, True)
        elif isinstance(g, list):
            prof = depuis_bord(g, True)

    apercu = alleger(extraire(eleve))
    corriges = dict(CORRIGES)
    js_eleve = "window.CAHIER_BLOCS=" + json.dumps(eleve, ensure_ascii=False, separators=(",", ":")) + ";"
    js_prof = "window.CAHIER_BLOCS=" + json.dumps(prof, ensure_ascii=False, separators=(",", ":")) + ";"
    js_ext = "window.CAHIER_BLOCS=" + json.dumps(apercu, ensure_ascii=False, separators=(",", ":")) + ";"

    fautes = controler_eleve(js_eleve, slug) + controler_eleve(js_ext, slug + " (extrait)")
    res = {"slug": slug, "titre": spec["titre"], "niveau": spec["niveau"],
           "eleve": compter(eleve), "prof": compter(prof), "extrait": compter(apercu),
           "poids": len(js_eleve.encode()), "poidsExtrait": len(js_ext.encode()),
           "poidsGuide": len(js_prof.encode()) if spec.get("guide") else 0,
           "corriges": len(corriges),
           "fautes": fautes, "guide": bool(spec.get("guide"))}

    # Un guide déclaré mais vide est pire qu'un guide absent : il se vend.
    if spec.get("guide") and res["prof"]["blocs"] < 50:
        res["fautes"].append(
            f"{slug} : le guide ne rend que {res['prof']['blocs']} blocs — "
            "format de source non reconnu, il partirait vide")

    if controle or fautes or not charge:
        return res

    d1 = charge / "uploads" / "protected" / "livrets"
    # L'EXTRAIT VA DANS LE DÉPÔT, pas seulement dans la charge FTP.
    # C'est le seul fichier de cette chaîne qui soit délibérément public : il
    # est fait pour être lu sans code, par quelqu'un qui hésite à acheter.
    # Le laisser en dépôt FTP l'aurait rendu tributaire d'un téléversement à la
    # main — et la page d'aperçu aurait affiché « contenu non déposé » à chaque
    # ouvrage oublié, sans que rien ne le signale. La CI le déploie donc avec
    # le reste de `livrets/`, où son garde-fou des 120 Ko le surveille.
    d2 = RACINE / "livrets"
    d1.mkdir(parents=True, exist_ok=True)
    d2.mkdir(parents=True, exist_ok=True)
    (d1 / f"booklet-{slug}.js").write_text(js_eleve, encoding="utf-8")
    # La table des corrigés reste dans le dossier protégé : elle ne se sert que
    # par api/cahier.php, exercice par exercice, une fois l'élève passé.
    if corriges:
        (d1 / f"corrige-{slug}.js").write_text(
            "window.CAHIER_CORRIGES=" + json.dumps(corriges, ensure_ascii=False,
                                                   separators=(",", ":")) + ";",
            encoding="utf-8")
    if spec.get("guide"):
        (d1 / f"guide-{slug}.js").write_text(js_prof, encoding="utf-8")
    (d2 / f"extrait-{slug}.js").write_text(js_ext, encoding="utf-8")
    res["ecrit"] = True
    return res


# ── Le catalogue serveur ────────────────────────────────────────────────────
def ecrire_catalogue(faits: list[dict], prix: int) -> pathlib_Path:
    """Inscrit au catalogue les ouvrages RÉELLEMENT produits, et eux seuls.

    Le catalogue est ce qui décide, côté serveur, de ce qui se vend, à quel
    tarif, et sous quelle nature de code. L'écrire à la main revenait à tenir
    quatre listes en parallèle (le manifeste, le catalogue, la boutique, les
    tarifs) : au moins une finissait en retard sur les autres, et un ouvrage
    absent du catalogue se vendait « au prix que le client veut » — le tarif
    devenant indéterminable, le contrôle de sous-paiement était sauté.

    On ne déclare donc QUE ce qu'on vient de produire. Un ouvrage dont la
    source a disparu sort du catalogue plutôt que d'y rester en promesse.
    Les cinq classes historiques restent servies par le repli de
    `_livret_lib.php` : aucun code déjà vendu ne se referme.
    """
    # Ce que le catalogue dit DÉJÀ. On ne le jette pas : « bord-6e » y est en
    # mode lecture, avec ses 135 pages rendues et ses 8 pages d'aperçu — un
    # produit vendu, dont la coquille appelle le liseur et non le moteur du
    # cahier. Le réécrire en « interactif, 0 page » lui aurait retiré son
    # aperçu gratuit et fait mentir sa fiche, sans que rien ne le signale.
    ancien = {}
    if CATALOGUE.is_file():
        try:
            d = json.loads(CATALOGUE.read_text(encoding="utf-8"))
            ancien = d.get("ouvrages") or {}
        except (OSError, ValueError):
            ancien = {}

    cat = {"version": 1, "ouvrages": {}}
    for r in faits:
        a = ancien.get(r["slug"]) or {}
        lecture = str(a.get("mode") or "") == "lecture"
        cat["ouvrages"][r["slug"]] = {
            "titre": r["titre"],
            "niveau": r["niveau"],
            # Les nouveaux passent par le moteur du cahier ; ceux qui se
            # feuillettent déjà gardent leur liseur.
            "mode": "lecture" if lecture else "interactif",
            "kinds": ["livret", "guide"] if r["guide"] else ["livret"],
            "prix": prix,
            "prixGuide": 0,             # 0 = tarif général enseignant du serveur
            "pages": int(a.get("pages") or 0),
            "pagesLibres": int(a.get("pagesLibres") or 0),
        }
    # Un ouvrage déjà au catalogue mais absent de cette passe reste inscrit :
    # des codes ont pu être vendus dessus, et le retirer les fermerait.
    for slug, a in ancien.items():
        cat["ouvrages"].setdefault(slug, a)
    CATALOGUE.parent.mkdir(parents=True, exist_ok=True)
    CATALOGUE.write_text(json.dumps(cat, ensure_ascii=False, indent=1) + chr(10), encoding="utf-8")
    return CATALOGUE


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--charge", type=Path, help="dossier de la charge à téléverser")
    ap.add_argument("--seulement", action="append", default=[], help="un slug (répétable)")
    ap.add_argument("--sans-images", action="store_true",
                    help="ne pas embarquer les photos (les légendes restent) ; "
                         "les cartes mentales, elles, sont toujours embarquées")
    ap.add_argument("--controle", action="store_true", help="ne produit rien")
    ap.add_argument("--catalogue", action="store_true",
                    help="inscrit aussi les ouvrages produits au catalogue serveur")
    ap.add_argument("--prix", type=int, default=PRIX_UNITAIRE,
                    help=f"tarif d'un ouvrage en FCFA (défaut {PRIX_UNITAIRE})")
    a = ap.parse_args()

    global SANS_IMAGES
    SANS_IMAGES = bool(a.sans_images)

    slugs = a.seulement or list(CAHIERS)
    inconnus = [s for s in slugs if s not in CAHIERS]
    if inconnus:
        print("✗ slug inconnu :", ", ".join(inconnus))
        return 2

    print(f"Source : {SOURCE}")
    print(f"{'ouvrage':14} {'blocs':>7} {'champs':>7} {'poids':>9}  {'extrait':>8}"
          f"  {'guide':>8}  {'corrigés':>8}")
    print("─" * 80)
    fautes: list[str] = []
    produits: list[dict] = []
    ok = 0
    for slug in slugs:
        r = produire(slug, CAHIERS[slug], a.charge, a.controle)
        if r.get("erreur"):
            print(f"{slug:14} ✗ {r['erreur']}")
            fautes.append(f"{slug} : {r['erreur']}")
            continue
        e = r["eleve"]
        g = f"{r['poidsGuide']/1024:.0f} Ko" if r["guide"] else "—"
        print(f"{slug:14} {e['blocs']:7} {e['champs']:7} {r['poids']/1024:8.0f} Ko"
              f"  {r['poidsExtrait']/1024:6.0f} Ko  {g:>8}  {r['corriges']:>8}")
        fautes += r["fautes"]
        if not r["fautes"]:
            produits.append(r)
        ok += 1

    print("─" * 80)
    if a.catalogue and not a.controle and not fautes:
        f = ecrire_catalogue(produits, a.prix)
        print(f"✓ catalogue : {len(produits)} ouvrages à {a.prix} FCFA → {f}")
    print("─" * 80)
    if fautes:
        print(f"✗ {len(fautes)} problème(s) — RIEN n'a été écrit pour les ouvrages en faute :")
        for f in fautes:
            print("   ", f)
        return 1
    print(f"✓ {ok} ouvrage(s) normalisé(s), aucun corrigé dans les charges élève.")
    if a.charge and not a.controle:
        print(f"  Charge FTP : {a.charge}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
