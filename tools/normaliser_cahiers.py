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
            out.append(B("image", src=txt(x.get("src") or x.get("d")), cap=txt(x.get("cap"))))
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
        b = dict(x)
        b["y"] = TRAD_MANUEL.get(y, y)
        b.pop("t", None)
        out.append(b)
    return out


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
        g = lire_json_js(Path(spec["guide"]))
        if isinstance(g, dict) and est_guide(g):
            prof = depuis_guide(g)
        elif isinstance(g, dict) and "sequences" in g:
            prof = depuis_booklet(g, True)
        elif isinstance(g, dict) and "blocks" in g:
            prof = depuis_manuel(g, True)
        elif isinstance(g, list):
            prof = depuis_bord(g, True)

    apercu = extraire(eleve)
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
    ap.add_argument("--controle", action="store_true", help="ne produit rien")
    ap.add_argument("--catalogue", action="store_true",
                    help="inscrit aussi les ouvrages produits au catalogue serveur")
    ap.add_argument("--prix", type=int, default=PRIX_UNITAIRE,
                    help=f"tarif d'un ouvrage en FCFA (défaut {PRIX_UNITAIRE})")
    a = ap.parse_args()

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
