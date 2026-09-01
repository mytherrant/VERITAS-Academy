#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/publier.py — MISE EN LIGNE DES OUVRAGES VÉRITAS, PILOTÉE PAR MANIFESTE

    python tools/publier.py                  # publie tout ce qui est actif
    python tools/publier.py --seulement 6e   # un seul ouvrage
    python tools/publier.py --charge ~/ftp   # + prépare la charge à téléverser
    python tools/publier.py --controle       # ne produit rien, contrôle seulement

CE QUE ÇA FAIT
  Lit tools/ouvrages.yml et, pour CHAQUE ouvrage déclaré actif :
    1. produit la coquille verrouillée (aucun contenu dedans) ;
    2. produit l'extrait gratuit quand l'ouvrage en a un ;
    3. range les données du produit dans la charge FTP, jamais dans le dépôt ;
    4. inscrit l'ouvrage au catalogue serveur (api/data/livrets_catalogue.json),
       d'où api/livret.php tire ses classes, ses natures et ses tarifs ;
    5. passe les CONTRÔLES ANTI-FUITE — et refuse de publier s'ils échouent.

POURQUOI UN MANIFESTE
  Ajouter un ouvrage ne doit pas demander de toucher au code. Avant, publier une
  classe de plus supposait d'éditer un dictionnaire Python, une liste PHP, une
  table de tarifs et une page d'accueil — quatre endroits, donc au moins un
  oubli. Ici, huit lignes de YAML.

LES DEUX MODES
  interactif  l'élève répond DANS la page (source .dc.html + données .js).
              C'est le circuit éprouvé des livrets 6ᵉ→3ᵉ.
  lecture     l'ouvrage se feuillette page par page, filigrané, sans jamais
              livrer le fichier d'origine. Les pages sont des images
              pré-rendues déposées par FTP — le .docx ou le PDF ne quitte
              jamais le poste de Jacques.

CE QU'IL NE FAIT PAS, ET POURQUOI
  Il ne convertit pas les .docx en images : cela demande LibreOffice ou Word, que
  la CI n'a pas et que ce script ne doit pas supposer. Il DÉTECTE les pages déjà
  rendues, les compte, et signale précisément ce qui manque.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

for _f in (sys.stdout, sys.stderr):          # console Windows en cp1252
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

RACINE = Path(__file__).resolve().parent.parent
SORTIE = RACINE / "livrets"
CATALOGUE = RACINE / "api" / "data" / "livrets_catalogue.json"

sys.path.insert(0, str(RACINE / "tools"))
import prepare_livrets as PL          # noqa: E402  — on réutilise le circuit éprouvé


class Bloque(Exception):
    """L'ouvrage ne peut pas être publié : on le dit, on continue les autres."""


# ── Manifeste ────────────────────────────────────────────────────────────────
def charger_manifeste(chemin: Path) -> dict:
    import yaml
    m = yaml.safe_load(chemin.read_text(encoding="utf-8"))
    if not isinstance(m, dict) or "ouvrages" not in m:
        raise SystemExit(f"✗ {chemin} : manifeste illisible (clé « ouvrages » absente)")
    m["racines"] = {k: Path(v).expanduser() for k, v in (m.get("racines") or {}).items()}
    return m


def racine_de(man: dict, source: dict) -> Path:
    nom = str(source.get("racine", ""))
    r = man["racines"].get(nom)
    if r is None:
        raise Bloque(f"racine « {nom} » inconnue du manifeste")
    if not r.is_dir():
        raise Bloque(f"racine « {nom} » introuvable sur ce poste : {r}")
    return r


# ── Mode INTERACTIF : le circuit des livrets ─────────────────────────────────
def publier_interactif(slug: str, o: dict, man: dict, ver: str, charge: Path | None) -> list[str]:
    src = racine_de(man, o.get("source") or {})
    s = o["source"]
    faits = []

    def page(nom_src: str, kind: str, nom_out: str) -> None:
        p = src / nom_src
        if not p.is_file():
            raise Bloque(f"page source absente : {nom_src}")
        try:
            out = PL.transformer(p.read_text(encoding="utf-8"), slug, kind, ver)
        except PL.Echec as e:
            raise Bloque(f"{nom_src} : {e}")
        (SORTIE / nom_out).write_text(out, encoding="utf-8")
        faits.append(f"livrets/{nom_out}")

    if "livret" in (o.get("kinds") or ["livret"]):
        page(s["page"], "livret", f"{slug}.html")
    if "guide" in (o.get("kinds") or []) and s.get("page_guide"):
        page(s["page_guide"], "guide", f"guide-{slug}.html")

    # Extrait gratuit, s'il y en a un.
    if o.get("extrait_public"):
        p = src / o["extrait_public"]
        if not p.is_file():
            raise Bloque(f"page d'extrait absente : {o['extrait_public']}")
        # Un extrait deja publie garde son nom : le renommer casserait les
        # liens deja imprimes et partages.
        tag = str(o.get("extrait_nom") or f"extrait-{slug}")
        fichiers = PL.extraire(src, s["donnees"], s.get("donnees_guide"), SORTIE, tag)
        (SORTIE / f"{tag}.html").write_text(
            PL.page_extrait(p.read_text(encoding="utf-8"), tag, bool(s.get("donnees_guide"))),
            encoding="utf-8")
        faits += [f"livrets/{tag}.html"] + [f"livrets/{f}" for f in fichiers]

    # Données du produit → charge FTP, JAMAIS le dépôt.
    if charge:
        dst = charge / "uploads" / "protected" / "livrets"
        dst.mkdir(parents=True, exist_ok=True)
        for nom_src, nom_out in ((s.get("donnees"), f"booklet-{slug}.js"),
                                 (s.get("donnees_guide"), f"guide-{slug}.js")):
            if not nom_src:
                continue
            p = src / nom_src
            if not p.is_file():
                raise Bloque(f"données absentes : {nom_src}")
            shutil.copyfile(p, dst / nom_out)
            faits.append(f"[FTP] {nom_out}  ({p.stat().st_size // 1024} Ko)")
    return faits


# ── Mode LECTURE : feuilletage page à page ───────────────────────────────────
def publier_lecture(slug: str, o: dict, man: dict, ver: str, charge: Path | None) -> tuple[list[str], int]:
    """Compte les pages déjà rendues et pose la coquille du liseur."""
    faits = []
    pages = 0
    if charge:
        dossier = charge / "uploads" / "protected" / "livrets" / slug
        if dossier.is_dir():
            pages = len(list(dossier.glob("p[0-9][0-9][0-9].jpg")))
    if pages == 0:
        # Peut-être déjà déposées sur le serveur : on ne peut pas le savoir d'ici.
        raise Bloque("aucune page rendue trouvée dans la charge "
                     "(attendu : uploads/protected/livrets/%s/p001.jpg …)" % slug)

    (SORTIE / f"{slug}.html").write_text(coquille_lecture(slug, o, ver), encoding="utf-8")
    faits.append(f"livrets/{slug}.html  ({pages} pages)")
    return faits, pages


def coquille_lecture(slug: str, o: dict, ver: str) -> str:
    """Page de feuilletage : elle ne contient QUE l'appel au liseur."""
    titre = o.get("titre", slug)
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titre} — Centre VÉRITAS</title>
<meta name="robots" content="noindex, nofollow">
<link rel="stylesheet" href="/assets/veritas-tokens.css?v=1.19.25">
<link rel="stylesheet" href="/assets/veritas-pages.css?v=1.19.25">
</head>
<body>
<script src="/livrets/gate.js?v={ver}"></script>
<script src="/livrets/liseur.js?v={ver}"></script>
<script>VRTLiseur.ouvrir({json.dumps(slug)}, {json.dumps(titre)},
  {int(o.get("pages_libres") or 0)});</script>
</body>
</html>
"""


# ── Contrôles anti-fuite ─────────────────────────────────────────────────────
INTERDITS = [
    ("VERITAS2026", "un code de démonstration est publié dans la page"),
    ("PROF2026", "un code enseignant de démonstration est publié dans la page"),
    ('src="booklet-data', "la page charge les données COMPLÈTES du livret"),
    ('src="guide-data', "la page charge les corrigés COMPLETS"),
]


def controles(charge: Path | None) -> list[str]:
    """Ce qui, s'il passait, coûterait de l'argent. Bloquant."""
    fautes = []

    # 1. Aucune page publiée ne doit contenir le produit ni un code.
    for page in sorted(SORTIE.glob("*.html")) + sorted((RACINE / "d").glob("*.html")):
        t = page.read_text(encoding="utf-8", errors="replace")
        for motif, pourquoi in INTERDITS:
            if motif in t:
                fautes.append(f"{page.relative_to(RACINE).as_posix()} : {pourquoi} ({motif})")

    # 2. Aucun fichier de données du produit ne doit être DANS le dépôt.
    #    L'extrait gratuit, lui, est légitime — on le reconnaît à son nom.
    #
    #    ⚠️ UNE LISTE DE NOMS SE PÉRIME, ET ELLE MENT DANS LES DEUX SENS.
    #    Le 31/08/2026 elle bloquait le déploiement sur `cahier.js` (le moteur
    #    du cahier) et `sw-cahier.js` (le service worker hors ligne), deux
    #    fichiers de CODE ajoutés après l'écriture de la liste. Inversement,
    #    un fichier nommé `extrait-truc.js` bourré de corrigés passerait sans
    #    un mot, uniquement grâce à son nom.
    #    On garde donc la liste — elle dit l'intention — mais on la double
    #    d'une mesure du CONTENU. Un moteur est du code : des lignes courtes,
    #    pas de données encapsulées. Un ouvrage, lui, arrive en longues lignes
    #    de texte ou en `data:` encapsulé. La mesure attrape ce que le nom
    #    laisse passer, et le nom explique ce que la mesure ne saurait dire.
    #    La mesure ne s'applique QU'AUX MOTEURS. Les fichiers `extrait-`,
    #    `demo-` et `feuilletage-` sont des données par conception : ce sont
    #    les pages offertes, et elles ont le droit d'être dans le dépôt. Leur
    #    appliquer la mesure produisait 21 fautes pour zéro fuite.
    MOTEURS = {"gate.js", "collab.js", "support.js", "liseur.js",
               "cahier.js", "sw-cahier.js"}
    #    Seuil relevé au-dessus du plus long littéral constaté dans un moteur
    #    (support.js : 968 caractères) et très en dessous des vraies données
    #    (feuilletage-4e-livret.js : 24 825). Entre les deux, il n'y a rien.
    LIGNE_MAX = 2000
    for js in SORTIE.glob("*.js"):
        if js.name.startswith(("extrait-", "demo-", "feuilletage-")):
            continue
        if js.name in MOTEURS:
            # Un moteur qui se met à porter un ouvrage : c'est ainsi qu'une
            # fuite entrerait sans bruit, sous un nom déjà approuvé.
            plus_longue = max((len(l) for l in js.read_text(
                encoding="utf-8", errors="replace").splitlines()), default=0)
            if plus_longue > LIGNE_MAX:
                fautes.append(
                    f"livrets/{js.name} : moteur autorisé, mais il porte "
                    f"maintenant une ligne de {plus_longue} caractères — "
                    f"cela ressemble à des DONNÉES, et le dépôt est PUBLIC")
            continue

        fautes.append(f"livrets/{js.name} : données d'ouvrage dans le dépôt — "
                      f"le dépôt GitHub est PUBLIC, ce fichier doit aller en FTP")

    # 3. Tout script de /livrets doit porter un ?v= — sinon une correction
    #    déployée n'atteint jamais les visiteurs de retour (cache immutable).
    for page in sorted(SORTIE.glob("*.html")) + sorted((RACINE / "d").glob("*.html")):
        t = page.read_text(encoding="utf-8", errors="replace")
        for m in re.finditer(r'src="(/livrets/[a-z]+\.js)(\?v=[0-9a-f.]+)?"', t):
            if not m.group(2):
                fautes.append(f"{page.relative_to(RACINE).as_posix()} : {m.group(1)} sans ?v=")

    # 4. Un script référencé mais absent = une page morte. Le navigateur ne dit
    #    rien, la page reste blanche, et on ne s'en aperçoit qu'en production.
    for page in sorted(SORTIE.glob("*.html")) + sorted((RACINE / "d").glob("*.html")):
        t = page.read_text(encoding="utf-8", errors="replace")
        for m in re.finditer(r'src="/livrets/([a-z0-9_-]+\.js)', t):
            if not (SORTIE / m.group(1)).is_file():
                fautes.append(f"{page.relative_to(RACINE).as_posix()} : "
                              f"livrets/{m.group(1)} référencé mais ABSENT")

    # 5. Ce que la CI ne voit pas, elle ne le déploie pas — en silence.
    suivis = set()
    try:
        suivis = set(subprocess.run(["git", "ls-files"], cwd=RACINE, capture_output=True,
                                    text=True, check=True).stdout.split("\n"))
    except Exception:
        fautes.append("git indisponible : impossible de vérifier ce qui sera déployé")
    if suivis:
        for f in ["api/livret.php", "api/collab.php", "api/_livret_lib.php",
                  "api/_notify_lib.php",
                  "livrets/gate.js", "livrets/collab.js", "d/index.html",
                  "uploads/protected/livrets/.htaccess"]:
            if f not in suivis:
                fautes.append(f"{f} : NON SUIVI par git → la CI le sautera sans le dire")

    # 6. Le verrou du dossier protégé doit accompagner les données.
    if charge:
        d = charge / "uploads" / "protected" / "livrets"
        if d.is_dir() and any(d.iterdir()) and not (d / ".htaccess").is_file():
            fautes.append("charge FTP : uploads/protected/livrets/.htaccess manquant — "
                          "les données seraient téléchargeables par leur URL")
    return fautes


# ── Orchestration ────────────────────────────────────────────────────────────
def main() -> int:
    ap = argparse.ArgumentParser(description="Met les ouvrages VÉRITAS en ligne.")
    ap.add_argument("--manifeste", default=str(RACINE / "tools" / "ouvrages.yml"))
    ap.add_argument("--seulement", default="", help="ne traiter que cet ouvrage")
    ap.add_argument("--charge", default="", help="dossier où préparer la charge FTP")
    ap.add_argument("--controle", action="store_true", help="ne rien produire, contrôler")
    args = ap.parse_args()

    man = charger_manifeste(Path(args.manifeste))
    SORTIE.mkdir(parents=True, exist_ok=True)
    charge = Path(args.charge).expanduser() if args.charge else None

    gate = SORTIE / "gate.js"
    if not gate.is_file():
        print("✗ livrets/gate.js manquant", file=sys.stderr)
        return 2
    ver = hashlib.sha256(gate.read_bytes()).hexdigest()[:8]

    if args.controle:
        fautes = controles(charge)
        for f in fautes:
            print("  ✗", f)
        print(("\n✗ %d contrôle(s) en échec." % len(fautes)) if fautes
              else "\n✓ Contrôles anti-fuite : tout est propre.")
        return 1 if fautes else 0

    faits, bloques, catalogue = [], [], {}

    for slug, o in (man["ouvrages"] or {}).items():
        if args.seulement and slug != args.seulement:
            continue
        if not o.get("actif"):
            bloques.append((slug, o.get("bloque") or "déclaré inactif dans le manifeste"))
            continue
        mode = o.get("mode", "interactif")
        try:
            pages = 0
            if mode == "lecture":
                f, pages = publier_lecture(slug, o, man, ver, charge)
            else:
                f = publier_interactif(slug, o, man, ver, charge)
            faits += f
        except Bloque as e:
            bloques.append((slug, str(e)))
            continue

        catalogue[slug] = {
            "titre": o.get("titre", slug), "niveau": o.get("niveau", ""),
            "mode": mode, "kinds": o.get("kinds") or ["livret"],
            "prix": int(o.get("prix") or 0), "prixGuide": int(o.get("prixGuide") or 0),
            "pages": pages, "pagesLibres": int(o.get("pages_libres") or 0),
        }

    # Le catalogue serveur : la source unique de ce qui est en vente.
    if catalogue:
        CATALOGUE.parent.mkdir(parents=True, exist_ok=True)
        CATALOGUE.write_text(json.dumps({"version": 1, "ouvrages": catalogue},
                                        ensure_ascii=False, indent=2), encoding="utf-8")
        faits.append(f"api/data/livrets_catalogue.json  ({len(catalogue)} ouvrages)")

    # Le verrou voyage avec les données.
    if charge:
        d = charge / "uploads" / "protected" / "livrets"
        d.mkdir(parents=True, exist_ok=True)
        for nom in (".htaccess", "LISEZMOI.txt"):
            src = RACINE / "uploads" / "protected" / "livrets" / nom
            if src.is_file():
                shutil.copyfile(src, d / nom)
        faits.append(f"[FTP] {d}")

    for f in faits:
        print("  ✓", f)
    if bloques:
        print("\n  En attente — déclarés mais pas publiés :")
        for slug, why in bloques:
            print(f"    · {slug:14} {why}")

    fautes = controles(charge)
    if fautes:
        print("\n✗ CONTRÔLES ANTI-FUITE EN ÉCHEC — ne pas déployer :", file=sys.stderr)
        for f in fautes:
            print("   -", f, file=sys.stderr)
        return 1

    print(f"\n✓ {len(catalogue)} ouvrage(s) en ligne, {len(bloques)} en attente — contrôles OK.")
    if not charge:
        print("  (--charge <dossier> pour préparer aussi les données à téléverser)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
