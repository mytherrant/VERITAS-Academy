#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/philo_livrets.py — LES DEUX LIVRETS DE PHILOSOPHIE, EN HTML FIDÈLE

    python tools/philo_livrets.py --sources <dossier> --charge "~/Desktop/veritas-ftp"
    python tools/philo_livrets.py --sources <dossier> --controle

<dossier> = le contenu de Sources_LaTeX_et_outils_v3.zip (Downloads\\Philo) :
build/ (Terminale A) et p1/build/ (Première ABI), avec leurs fonts/.

CE QUE ÇA FAIT
  1. convertit le LaTeX du livret imprimé en HTML (tools/philo_tex.py) : la
     mise en page d'origine — bandeaux, encadrés, tableaux, copies modèles,
     polices — redessinée par livrets/philo.css ;
  2. range la charge COMPLÈTE dans la charge FTP
     (uploads/protected/livrets/booklet-<slug>.js) — JAMAIS dans le dépôt,
     qui est public ;
  3. écrit l'APERÇU gratuit (livrets/extrait-<slug>.js) : l'avant-propos et
     DEUX leçons entières ; les autres sections n'y ont que leur titre ;
  4. sous-ensemble les polices (livrets/polices-philo/, noms versionnés par
     leur contenu : servies « immutable », une police changée change de nom)
     et réécrit le bloc @font-face de livrets/philo.css ;
  5. écrit la coquille de lecture livrets/cahier-<slug>.html (aucun contenu) ;
  6. CONTRÔLE avant d'écrire : aperçu < 120 Ko (la CI refuse au-delà), aucun
     corrigé dans l'aperçu, deux leçons au plus, charge bien formée.

POURQUOI PAS DES IMAGES DE PAGES
  Jacques a demandé une mise en forme HTML « très proche voire exacte » de
  l'original (28/10/2026). Une image de page se lit mal au téléphone et ne se
  remplit pas ; du HTML se lit à toutes les largeurs, et les lignes d'écriture
  deviennent de vrais champs.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import sys
from pathlib import Path

for _f in (sys.stdout, sys.stderr):          # console Windows en cp1252
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

RACINE = Path(__file__).resolve().parent.parent
LIVRETS = RACINE / "livrets"
POLICES = LIVRETS / "polices-philo"
sys.path.insert(0, str(RACINE / "tools"))
import philo_tex as PT                       # noqa: E402

OUVRAGES = {
    "philo-tle": {
        "build": "build", "niveau": "tle",
        "titre": "Mon livret de philosophie — Terminale A4",
        # Deux leçons offertes, une par épreuve : le commentaire (Towa) et
        # la dissertation (Passion et raison).
        "libres": ["1", "16"],
    },
    "philo-1ere": {
        "build": "p1/build", "niveau": "1ere",
        "titre": "Mon livret de philosophie — Première A4",
        # Les « Rubriques » de la première partie sont aussi des bandeaux de
        # chapitre ; seuls les CHAPITRES (leçons) de la deuxième partie
        # comptent ici.
        "libres": ["1", "5"],
    },
}
PRIX = 1500
PLAFOND_APERCU = 120 * 1024 - 2048           # la CI refuse au-delà de 120 Ko

POL = {
    "play-700": "playfair-display-700-normal.ttf",
    "play-800": "playfair-display-800-normal.ttf",
    "play-400i": "playfair-display-400-italic.ttf",
    "nunito-400": "nunito-400-normal.ttf",
    "nunito-800": "nunito-800-normal.ttf",
    "lato-400": "Lato-400-normal.ttf",
    "lato-700": "Lato-700-normal.ttf",
    "lato-400i": "Lato-400-italic.ttf",
    "lora-400": "Lora-W400.ttf",
    "lora-700": "Lora-W700.ttf",
    "lora-400i": "Lora-Italic-W400.ttf",
    "andika-400": "andika-400-normal.ttf",
    "andika-700": "andika-700-normal.ttf",
    "andika-400i": "andika-400-italic.ttf",
    "literata-400": ("Literata.ttf", 400),
    "literata-700": ("Literata.ttf", 700),
    "literata-400i": ("Literata-Italic.ttf", 400),
    "playpen-400": ("PlaypenSans.ttf", 400),
    "playpen-700": ("PlaypenSans.ttf", 650),
}
# famille CSS, graisse, style — pour chaque fichier
FACES = {
    "play-700": ("VP Playfair", 700, "normal"), "play-800": ("VP Playfair", 800, "normal"),
    "play-400i": ("VP Playfair", 400, "italic"),
    "nunito-400": ("VP Nunito", 400, "normal"), "nunito-800": ("VP Nunito", 800, "normal"),
    "lato-400": ("VP Lato", 400, "normal"), "lato-700": ("VP Lato", 700, "normal"),
    "lato-400i": ("VP Lato", 400, "italic"),
    "lora-400": ("VP Lora", 400, "normal"), "lora-700": ("VP Lora", 700, "normal"),
    "lora-400i": ("VP Lora", 400, "italic"),
    "andika-400": ("VP Andika", 400, "normal"), "andika-700": ("VP Andika", 700, "normal"),
    "andika-400i": ("VP Andika", 400, "italic"),
    "literata-400": ("VP Literata", 400, "normal"), "literata-700": ("VP Literata", 700, "normal"),
    "literata-400i": ("VP Literata", 400, "italic"),
    "playpen-400": ("VP Playpen", 400, "normal"), "playpen-700": ("VP Playpen", 700, "normal"),
    "inter-400": ("VP Inter", 400, "normal"), "inter-700": ("VP Inter", "600 700", "normal"),
    "fa-s": ("VP FA", 900, "normal"),
}
INTER = {"inter-400": "C:/Windows/Fonts/Inter-Regular-slnt=0.ttf",
         "inter-700": "C:/Windows/Fonts/Inter-Bold-slnt=0.ttf"}


class Bloque(Exception):
    pass


def compacter(h: str) -> str:
    """Le HTML part dans une chaîne JSON : chaque guillemet y coûte deux
    octets. Les valeurs d'attribut sans espace ni guillemet perdent leurs
    guillemets (HTML valide), et les couleurs en ligne prennent une forme
    courte que philo.js déplie à l'affichage (k= couleur, kb= fond)."""
    h = re.sub(r' style="color:#([0-9A-F]{6})"', r" k=\1", h)
    h = re.sub(r' style="background:#([0-9A-F]{6})"', r" kb=\1", h)
    h = h.replace(' aria-hidden="true"', "")
    # philo.js repose ces deux attributs à l'affichage (deplier) ; la clé
    # d'enregistrement d'un champ est son rang dans la section, pas data-k.
    h = h.replace(' aria-label="Ta réponse" spellcheck="true"', "")
    h = h.replace(' aria-label="case à cocher"', "")
    h = re.sub(r' data-k="[^"]*"', "", h)
    h = re.sub(r'="([^\s"\'=<>`]+)"', r"=\1", h)
    return h


def ajuster_sections(secs, libres):
    for s in secs:
        s["libre"] = (s["kind"] == "front"
                      or (s["kind"] == "chap" and s.get("genre", "Chapitre") == "Chapitre"
                          and s["num"] in libres))
        s["html"] = compacter(s["html"])
    n = sum(1 for s in secs if s["libre"] and s["kind"] == "chap")
    if n != len(libres):
        raise Bloque(f"{n} leçon(s) offerte(s) trouvée(s) au lieu de {len(libres)} — numéros {libres}")
    return secs


def charge(doc: dict) -> str:
    return "window.PHILO_DOC=" + json.dumps(doc, ensure_ascii=False, separators=(",", ":")) + ";\n"


def polices(sources: Path, textes: set, fa: set) -> dict:
    """woff2 sous-ensemblés → {nom: fichier versionné}."""
    from fontTools import subset
    from fontTools.ttLib import TTFont
    fd = sources / "build" / "fonts"
    base = (" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`"
            "abcdefghijklmnopqrstuvwxyz{|}~«»’‘“”–—…·•éèêëàâäîïôöùûüçœæÉÈÊËÀÂÎÏÔÙÛÇŒÆ€°"
            "ᵉʳⁿᵈˡ\u00a0\u202f")
    uni = sorted({ord(c) for c in (textes | set(base))
                  if ord(c) >= 32 and not (0xF000 <= ord(c) <= 0xF8FF)})
    POLICES.mkdir(parents=True, exist_ok=True)
    for vieux in POLICES.glob("*.woff2"):
        vieux.unlink()
    sortie = {}

    def ecrire(nom, font):
        import io
        # Sans cela, fontTools réécrit la date du fichier à chaque passe : le
        # même sous-ensemble changeait de nom, donc d'adresse, à chaque
        # fabrication — un cache « immutable » vidé pour rien.
        font.recalcTimestamp = False
        font.flavor = "woff2"
        b = io.BytesIO()
        font.save(b)
        data = b.getvalue()
        h = hashlib.sha1(data).hexdigest()[:8]
        fichier = f"{nom}.{h}.woff2"
        (POLICES / fichier).write_bytes(data)
        sortie[nom] = fichier

    def sous(font, codes, features):
        o = subset.Options()
        o.flavor = "woff2"
        o.layout_features = features
        o.name_IDs = ["*"]
        s = subset.Subsetter(o)
        s.populate(unicodes=codes)
        s.subset(font)
        return font

    for nom, f in POL.items():
        w = None
        if isinstance(f, tuple):
            f, w = f
        font = TTFont(fd / f)
        if w is not None:
            from fontTools.varLib import instancer
            loc = {"wght": w}
            if any(a.axisTag == "opsz" for a in font["fvar"].axes):
                loc["opsz"] = 12
            font = instancer.instantiateVariableFont(font, loc)
        ecrire(nom, sous(font, uni, ["kern", "liga", "calt"]))
    for nom, chemin in INTER.items():
        if not Path(chemin).is_file():
            raise Bloque(f"police Inter absente : {chemin}")
        ecrire(nom, sous(TTFont(chemin), uni, ["kern", "liga", "calt"]))
    ecrire("fa-s", sous(TTFont(fd / "fa-solid-900.ttf"), sorted(fa), []))
    return sortie


def ecrire_fontfaces(fichiers: dict):
    css = LIVRETS / "philo.css"
    t = css.read_text(encoding="utf-8")
    lignes = []
    for nom, fichier in fichiers.items():
        fam, poids, style = FACES[nom]
        disp = "block" if nom == "fa-s" else "swap"
        lignes.append(f'@font-face{{font-family:"{fam}";font-weight:{poids};font-style:{style};'
                      f'src:url(polices-philo/{fichier}) format("woff2");font-display:{disp}}}')
    lignes.append('@font-face{font-family:"VP Poppins";font-weight:700;'
                  'src:url(/assets/polices/poppins-700-latin.woff2) format("woff2");font-display:swap}')
    bloc = "/* @polices — écrit par tools/philo_livrets.py */\n" + "\n".join(lignes) + "\n/* /polices */"
    t2, n = re.subn(r"/\* @polices.*?/\* /polices \*/", lambda m: bloc, t, flags=re.S)
    if n != 1:
        raise Bloque("livrets/philo.css : bloc /* @polices */ … /* /polices */ introuvable")
    css.write_text(t2, encoding="utf-8", newline="\n")


def sha8(p: Path) -> str:
    return hashlib.sha1(p.read_bytes().replace(b"\r\n", b"\n")).hexdigest()[:8]


def coquille(slug: str, o: dict) -> str:
    titre = html.escape(o["titre"])
    v_css = sha8(LIVRETS / "philo.css")
    v_js = sha8(LIVRETS / "philo.js")
    v_ext = sha8(LIVRETS / f"extrait-{slug}.js")
    return f'''<!DOCTYPE html>
<html lang="fr" data-ouvrage="{slug}" data-titre="{titre}" data-prix="{PRIX}" data-v="{v_ext}">
<head>
<meta charset="utf-8">
<title>{titre} — Centre VÉRITAS</title>
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="https://veritas-school.com/livrets/{slug}.html">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#142554">
<link rel="stylesheet" href="/livrets/philo.css?v={v_css}">
<script src="/livrets/gate.js?v=1.20.31"></script>
<script src="/livrets/philo.js?v={v_js}" defer></script>
</head>
<body>
<noscript><p style="padding:20px;font:16px/1.5 system-ui">Ce livret s'affiche avec JavaScript. Active-le, puis recharge la page.</p></noscript>
</body>
</html>
'''


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sources", required=True, help="dossier décompressé de Sources_LaTeX_et_outils_v3.zip")
    ap.add_argument("--charge", help="dossier FTP (ex. ~/Desktop/veritas-ftp) : y range les charges complètes")
    ap.add_argument("--controle", action="store_true", help="ne rien écrire, contrôler seulement")
    a = ap.parse_args()
    src = Path(a.sources).expanduser()
    docs, textes, fa = {}, set(), set()
    try:
        for slug, o in OUVRAGES.items():
            PT.FA.clear()
            r, secs = PT.convertir(str(src / o["build"]), o["niveau"])
            if r.unknown:
                raise Bloque(f"{slug} : macros inconnues {r.unknown}")
            fa |= set(PT.FA.get("s", set()))
            if PT.FA.get("r"):
                raise Bloque(f"{slug} : icônes « regular » non prévues {sorted(PT.FA['r'])}")
            secs = ajuster_sections(secs, o["libres"])
            for s in secs:
                textes |= set(html.unescape(re.sub(r"<[^>]+>", " ", s["html"])))
            for t in r.toc:
                textes |= set(t["titre"])
            base = {"v": 1, "slug": slug, "titre": o["titre"], "toc": r.toc, "labels": r.labels}
            complet = dict(base, sections=secs)
            apercu = dict(base, _extrait=True, sections=[
                (s if s["libre"] else {k: s[k] for k in ("id", "kind", "num", "titre", "sous", "couleur", "genre")} | {"html": ""})
                for s in secs])
            js_c, js_a = charge(complet), charge(apercu)
            # ── contrôles anti-fuite ───────────────────────────────────────
            if len(js_a.encode()) > PLAFOND_APERCU:
                raise Bloque(f"{slug} : aperçu de {len(js_a.encode()) // 1024} Ko (plafond 118 Ko)")
            for s in apercu["sections"]:
                if s["kind"] == "corrige" and s["html"]:
                    raise Bloque(f"{slug} : la section des corrigés est dans l'aperçu")
                if s["html"] and 'class=corriges' in s["html"]:
                    raise Bloque(f"{slug} : des corrigés sont dans l'aperçu ({s['titre']})")
            ouvertes = [s for s in apercu["sections"] if s["html"] and s["kind"] == "chap"]
            if len(ouvertes) > 2:
                raise Bloque(f"{slug} : {len(ouvertes)} leçons ouvertes dans l'aperçu (2 au plus)")
            if not re.match(r"^window\.PHILO_DOC=\{", js_c) or not js_c.rstrip().endswith("};"):
                raise Bloque(f"{slug} : charge mal formée")
            docs[slug] = (js_c, js_a, o)
            print(f"  {slug} : {len(secs)} sections, aperçu {len(js_a.encode()) // 1024} Ko "
                  f"({', '.join(s['titre'] for s in ouvertes)}), complet {len(js_c.encode()) // 1024} Ko")
    except Bloque as e:
        print(f"✗ {e}")
        return 1
    if a.controle:
        print("✓ contrôle seul : rien n'a été écrit")
        return 0
    try:
        ecrire_fontfaces(polices(src, textes, fa))
    except Bloque as e:
        print(f"✗ {e}")
        return 1
    for slug, (js_c, js_a, o) in docs.items():
        (LIVRETS / f"extrait-{slug}.js").write_text(js_a, encoding="utf-8", newline="\n")
        if a.charge:
            d = Path(a.charge).expanduser() / "uploads" / "protected" / "livrets"
            d.mkdir(parents=True, exist_ok=True)
            (d / f"booklet-{slug}.js").write_text(js_c, encoding="utf-8", newline="\n")
            print(f"  → charge FTP : {d / f'booklet-{slug}.js'}")
    # les coquilles en dernier : elles portent l'empreinte des fichiers écrits
    for slug, (_, _, o) in docs.items():
        (LIVRETS / f"cahier-{slug}.html").write_text(coquille(slug, o), encoding="utf-8", newline="\n")
    print("✓ livrets/philo.css (polices), extrait-*.js, cahier-*.html écrits")
    if not a.charge:
        print("  (aucune charge FTP : passer --charge pour produire booklet-*.js)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
