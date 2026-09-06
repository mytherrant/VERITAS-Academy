#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/cahier_oeuvre_interactif.py — LES NEUF CAHIERS D'ŒUVRE, EN CAHIER QU'ON REMPLIT

    python tools/cahier_oeuvre_interactif.py --charge ~/veritas-ftp
    python tools/cahier_oeuvre_interactif.py --controle          # ne produit rien
    python tools/cahier_oeuvre_interactif.py --seulement tartuffe

CE QUE ÇA FAIT, ET POURQUOI
  Les neuf cahiers d'œuvre intégrale se vendaient en IMAGES de pages : 296 Mo
  pour les neuf, trente mégaoctets par titre à téléverser à la main. Le même
  contenu existe en HTML — 3 Mo — mais en lecture seule : l'élève lisait les
  questions, il n'y répondait pas.

  Ce script les fait entrer dans le moteur des quinze cahiers interactifs, celui
  qui sait déjà tout faire : l'élève écrit dans la page, son travail le suit
  d'un appareil à l'autre, et l'enseignant lit les copies de sa classe
  (api/collab.php). Rien de neuf n'est écrit côté serveur ; on parle sa langue.

LA MISE EN PAGE D'ORIGINE EST CONSERVÉE, PAS APLATIE
  C'est la contrainte principale, et elle décide de tout le parseur. Un cahier
  d'œuvre n'est pas une suite de paragraphes : c'est une architecture — parties,
  fiches de lecture méthodique, encadrés de méthode, tableaux de notions,
  extraits de l'auteur en retrait, lexiques. Aplatir tout cela en `texte`
  donnerait un mur de mots où l'on ne retrouverait rien.

  Chaque forme du HTML garde donc la sienne :
      <h1>              → rubrique      (partie)
      <h2> / <h3>       → lecon {no, title}
      <blockquote>      → corpus (+ source si la dernière ligne est une référence)
      <div class=vtab>  → table rows    (les tableaux restent des tableaux)
      <div class=vlist> → texte à puces, l'un après l'autre
      <p>               → texte
  Le gras et l'italique survivent : le moteur lit des « runs »
  ({t,b,i}) et non du texte nu. Un titre d'œuvre en italique le reste.

CE QUI DEVIENT INTERACTIF, ET CE QUI NE LE DEVIENT PAS
  On n'ajoute un champ de réponse QUE là où le cahier pose une question. Trois
  signes, et rien d'autre :
      · une série « a) … b) … c) … »  → un exercice par lettre ;
      · un verbe de consigne en tête (Relevez, Citez, Justifiez, Rédigez…) ;
      · une phrase courte qui se termine par « ? ».
  Le reste — l'analyse, le contexte, la biographie — reste du texte à lire.
  Semer des champs partout ferait un formulaire, pas un cahier.

  ⚠️ L'ANALYSE N'EST PAS UN CORRIGÉ CACHÉ. Dans les cahiers du 1er cycle,
  chaque exercice porte sa réponse et `normaliser_cahiers.py` doit l'arracher
  avant de livrer l'élève. Ici, non : l'explication de texte EST le produit
  vendu, elle précède les questions et elle est faite pour être lue. On ne
  retire donc rien — mais on ne fabrique pas non plus de `guide`, et le
  catalogue déclare `kinds:["livret"]` : un code « guide » n'ouvrirait rien.

L'EXTRAIT GRATUIT EST UN EXTRAIT
  Deux parties prises LOIN l'une de l'autre — l'entrée dans l'œuvre et une
  lecture méthodique — jamais la suite du début. Deux parties suivies feraient
  un morceau qu'on finit ; deux parties éloignées font un sondage, qui montre
  ce qui manque entre elles. C'est la leçon de « Demo 6e », qui livrait le
  cahier entier en croyant montrer un aperçu.

OÙ VA QUOI
    <charge>/uploads/protected/livrets/booklet-oeuvre-<slug>.js   ÉLÈVE (FTP)
    livrets/extrait-oeuvre-<slug>.js                              APERÇU (dépôt)
    api/data/livrets_catalogue.json                               inscription
"""

import argparse
import io
import json
import os
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

for _f in (sys.stdout, sys.stderr):          # console Windows en cp1252
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

RACINE = Path(__file__).resolve().parent.parent
SOURCES = RACINE / "uploads" / "protected" / "books"
CATALOGUE = RACINE / "api" / "data" / "livrets_catalogue.json"
EXTRAITS = RACINE / "livrets"

# Le niveau fait foi sur la couverture imprimée, et `oeuvres.js` s'est trompé
# sur quatre d'entre eux : cette table est tenue à la main POUR CETTE RAISON.
# Elle est la même que dans tools/publier_cahiers_oeuvres.py — mêmes valeurs,
# décision de Jacques du 02/09/2026.
# Le PAS de numérotation suit le genre, comme dans les éditions scolaires :
# on numérote chaque vers d'un poème ou d'une pièce — la question dit « au
# vers 12 » — mais une ligne sur cinq en prose, où numéroter tout ferait un
# quadrillage illisible. Le genre est celui de l'audit de conformité, relu sur
# les .docx ; il ne se devine pas du titre.
OUVRAGES = {
    "tartuffe":   ("2nde", 1000, "Tartuffe ou l’Imposteur", 1),
    "capitoline": ("2nde", 1000, "Les Tribus de Capitoline", 5),
    "poemes":     ("2nde", 1000, "Poèmes sauvages éclairés au feu de brousse", 1),
    "balafon":    ("1ere", 1200, "Balafon", 1),
    "lionperle":  ("1ere", 1200, "Le Lion et la Perle", 1),
    "tenebres":   ("1ere", 1200, "Au cœur des ténèbres", 5),
    "ngum":       ("tle",  1300, "Ngum a Jemea", 1),
    "stances":    ("tle",  1300, "Stances et Poèmes", 1),
    "vieuxnegre": ("tle",  1300, "Le Vieux Nègre et la Médaille", 5),
}

# Un verbe de consigne EN TÊTE de phrase. La liste est fermée volontairement :
# « montre » au fil d'une analyse (« ce vers montre que… ») n'est pas une
# consigne, et un test trop large sèmerait des champs dans l'explication.
VERBES = (r"Relevez|Citez|Expliquez|Justifiez|Montrez|Analysez|Commentez|"
          r"Rédigez|Repérez|Comparez|Résumez|Classez|Complétez|Indiquez|"
          r"Reformulez|Recopiez|Proposez|Imaginez|Discutez|Dégagez|Étudiez")
RE_CONSIGNE = re.compile(r"^\s*(?:%s)\b" % VERBES)
RE_LETTRES = re.compile(r"\b([a-h])\)\s")


# ── Lecture du HTML ────────────────────────────────────────────────────────
class Lecteur(HTMLParser):
    """HTML → blocs, en gardant la forme.

    Un parseur à états plutôt qu'une cascade d'expressions régulières : les
    tableaux s'imbriquent (`vtab > vtr > vtd`) et une regex qui les découpe se
    trompe dès qu'une cellule contient du gras. On suit donc la pile des
    balises ouvertes, et on ferme les blocs sur les balises fermantes.
    """

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocs = []
        self.runs = []            # runs du bloc courant
        self.pile = []            # balises ouvertes
        self.gras = 0
        self.ital = 0
        self.mode = None          # None | 'p' | 'h1' | 'h2' | 'h3' | 'bq' | 'li'
        self.bq = []              # paragraphes du blockquote courant
        self.table = None         # rows en cours
        self.ligne = None
        self.cellule = None
        self.entete = False

    # -- runs ---------------------------------------------------------------
    def _texte(self, data):
        if self.cellule is not None:
            self.cellule.append(self._run(data))
            return
        if self.mode is None:
            return
        self.runs.append(self._run(data))

    def _run(self, data):
        r = {"t": data}
        if self.gras:
            r["b"] = True
        if self.ital:
            r["i"] = True
        return r

    def _vider(self):
        runs = [r for r in self.runs if (r.get("t") or "").strip() or r.get("br")]
        self.runs = []
        return runs

    @staticmethod
    def _simple(runs):
        """Du texte NU se rend mieux qu'une suite de runs — et ce n'est pas
        qu'une question de poids.

        `colorer()` (livrets/cahier.js) commence par `if (b.r) return html;` :
        dès qu'un bloc porte des runs, le moteur RENONCE à sa coloration
        sémantique — les mots-clés, les citations, les répliques ne sont plus
        teintés. Émettre des runs partout aurait donc éteint la couleur sur
        tout l'ouvrage, en croyant préserver la mise en page.

        On ne garde donc les runs que là où ils portent une information :
        un gras, un italique, un saut de ligne. Partout ailleurs, `txt` —
        et le moteur colore. Rendre à `txt` ce qui est nu, c'est gagner les
        deux à la fois."""
        for r in runs:
            if r.get("b") or r.get("i") or r.get("br"):
                return None
        return "".join(r.get("t", "") for r in runs).strip()

    def _poser(self, y, runs, **extra):
        """Ajoute un bloc en choisissant `txt` ou `r` selon ce que le texte
        contient réellement."""
        nu = self._simple(runs)
        b = {"y": y}
        b.update(extra)
        if nu is not None:
            if not nu:
                return
            b["txt"] = nu
        else:
            b["r"] = runs
        self.blocs.append(b)

    # -- balises ------------------------------------------------------------
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class", "")
        self.pile.append(tag)

        if tag == "strong" or tag == "b":
            self.gras += 1
        elif tag == "em" or tag == "i":
            self.ital += 1
        elif tag == "br":
            if self.cellule is not None:
                self.cellule.append({"br": True})
            elif self.mode:
                self.runs.append({"br": True})
        elif tag in ("h1", "h2", "h3"):
            self.mode = tag
        elif tag == "p":
            self.mode = "p"
        elif tag == "blockquote":
            self.mode = "bq"
            self.bq = []
        elif tag == "div" and "vtab" in cls:
            self.table = []
        elif tag == "div" and "vtr" in cls and self.table is not None:
            self.ligne = []
            self.entete = "vth" in cls
        elif tag == "span" and "vtd" in cls and self.ligne is not None:
            self.cellule = []
        elif tag == "div" and "vli" in cls:
            self.mode = "li"

    def handle_endtag(self, tag):
        if self.pile and tag in self.pile:
            # on dépile jusqu'à la balise (le HTML produit est propre, mais on
            # ne suppose pas qu'il l'est toujours)
            while self.pile and self.pile.pop() != tag:
                pass

        if tag in ("strong", "b"):
            self.gras = max(0, self.gras - 1)
        elif tag in ("em", "i"):
            self.ital = max(0, self.ital - 1)
        elif tag in ("h1", "h2", "h3"):
            self._fermer_titre(tag)
        elif tag == "p":
            self._fermer_p()
        elif tag == "blockquote":
            self._fermer_bq()
        elif tag == "span" and self.cellule is not None:
            cel = [r for r in self.cellule if (r.get("t") or "").strip() or r.get("br")]
            self.ligne.append({"r": cel} if cel else {"t": ""})
            self.cellule = None
        elif tag == "div":
            if self.ligne is not None and self.cellule is None and self.table is not None:
                if self.ligne:
                    self.table.append(self.ligne)
                self.ligne = None
            elif self.table is not None and self.ligne is None:
                if self.table:
                    self._fermer_vtab(self.table)
                self.table = None
            elif self.mode == "li":
                self._fermer_p(puce=True)

    def handle_data(self, data):
        if not data:
            return
        self._texte(data)

    # -- fermetures ---------------------------------------------------------
    def _fermer_titre(self, tag):
        runs = self._vider()
        self.mode = None
        txt = "".join(r.get("t", "") for r in runs).strip()
        if not txt:
            return
        if tag == "h1":
            self.blocs.append({"y": "rubrique", "txt": txt})
            return
        # « 7.2 Devoirs rédigés — … » → no = « 7.2 », title = le reste.
        m = re.match(r"^\s*(\d+(?:\.\d+)*)[.)]?\s+(.*)$", txt)
        if m:
            self.blocs.append({"y": "lecon", "no": m.group(1), "title": m.group(2).strip()})
        else:
            self.blocs.append({"y": "lecon", "no": "", "title": txt})

    def _fermer_p(self, puce=False):
        runs = self._vider()
        self.mode = None
        if not runs:
            return
        if self.mode == "bq" or "blockquote" in self.pile:
            self.bq.append(runs)
            return
        txt = "".join(r.get("t", "") for r in runs).strip()
        if not txt:
            return
        if puce:
            runs = [{"t": "• ", "kw": True}] + runs
        self._poser("texte", runs)

    def _fermer_vtab(self, rows):
        """UN `.vtab` N'EST PAS TOUJOURS UN TABLEAU — et s'y tromper coûtait
        la mise en page ET la numérotation.

        Le générateur d'origine se sert de `.vtab` pour trois choses très
        différentes, qu'il faut distinguer ici parce que le moteur du cahier,
        lui, les rend différemment :

          · plusieurs colonnes            → un vrai tableau (notions, lexique) ;
          · UNE cellule, beaucoup de <br> → un EXTRAIT DE L'AUTEUR. C'est ainsi
            que sont composées les répliques de Tartuffe et les vers de Balafon,
            pas en <blockquote> — celui-ci ne porte que la légende (« Acte I,
            scène 1 »). Traités en tableaux, les cent un extraits de chaque
            cahier perdaient leur encadré, leur couleur, et surtout tout espoir
            d'être numérotés : la première version n'en a numéroté aucun ;
          · UNE cellule, deux ou trois lignes → un encadré de méthode
            (« Je lis. Le texte à lire… »), que le moteur sait poser en astuce.

        Le seuil est le même que celui de la numérotation : quatre lignes.
        En dessous, on ne numérote pas et ce n'est pas un extrait."""
        colonnes = max(len(r) for r in rows)
        if colonnes > 1 or len(rows) > 1:
            self.blocs.append({"y": "table", "rows": rows})
            return
        cel = rows[0][0]
        runs = cel.get("r") or ([{"t": cel.get("t", "")}] if cel.get("t") else [])
        if not runs:
            return
        sauts = sum(1 for r in runs if r.get("br"))
        self._poser("corpus" if self._est_extrait(runs, sauts) else "astuce", runs)

    @staticmethod
    def _est_extrait(runs, sauts):
        """Extrait de l'auteur, ou encadré de méthode ?

        Compter les lignes ne suffit pas — c'est ce que faisait la première
        version, et elle a numéroté « Astuce. Comment travailler une séquence »
        comme s'il s'agissait de vers de Molière. Un encadré de méthode long
        reste un encadré ; un quatrain court reste un poème.

        Le signe qui sépare vraiment les deux est en tête de bloc :

          · un ENCADRÉ s'ouvre par son titre en gras, en bas de casse —
            « Astuce. », « Je lis. Le texte à lire », « Boîte à outils. » ;
          · un EXTRAIT s'ouvre soit par une didascalie en italique, soit par un
            nom de personnage en CAPITALES, soit par le texte lui-même.

        La casse tranche donc là où la longueur se trompait : « MADAME
        PERNELLE » est un extrait, « Je lis. » n'en est pas un."""
        premier = next((r for r in runs if (r.get("t") or "").strip()), None)
        if premier is not None and premier.get("b"):
            t = (premier.get("t") or "").strip()
            lettres = [c for c in t if c.isalpha()]
            majuscules = lettres and all(c.isupper() for c in lettres)
            if not majuscules:
                return False          # titre d'encadré : « Astuce. », « Je lis. »
        return sauts >= 3

    def _fermer_bq(self):
        self.mode = None
        paras = self.bq or []
        if self.runs:
            paras.append(self._vider())
        self.bq = []
        if not paras:
            return
        # La dernière ligne d'un extrait est souvent sa référence — courte, et
        # elle nomme l'auteur ou l'acte. On la sort en `source` : le moteur la
        # compose en petit, sous le texte, comme dans le cahier imprimé.
        derniere = "".join(r.get("t", "") for r in paras[-1]).strip()
        source = None
        if len(paras) > 1 and len(derniere) <= 120 and (
                "," in derniere or re.search(r"\b[IVX]+\b", derniere)):
            source = derniere
            paras = paras[:-1]
        corps = []
        for i, p in enumerate(paras):
            if i:
                corps.append({"br": True})
            corps.extend(p)
        if corps:
            self._poser("corpus", corps)
        if source:
            self.blocs.append({"y": "source", "txt": source})


def numeroter(blocs, pas):
    """Marque pour numérotation les corpus qui en valent la peine.

    Un extrait de deux lignes n'a rien à numéroter : le numéro y coûterait une
    gouttière et n'aiderait personne. Le seuil est à quatre lignes, c'est-à-dire
    trois retours — en dessous, la question désigne l'extrait entier."""
    for b in blocs:
        if b.get("y") != "corpus":
            continue
        runs = b.get("r") or []
        sauts = sum(1 for r in runs if r.get("br"))
        if sauts >= 3:
            b["num"] = pas
    return blocs


# ── Des questions naissent les champs ──────────────────────────────────────
def interactif(blocs):
    """Transforme les blocs qui POSENT une question en exercices à remplir.

    Trois signes seulement (voir l'en-tête). Le compteur d'exercices court sur
    tout l'ouvrage : c'est ce numéro que l'enseignant verra en face d'une
    réponse dans sa console, et il doit donc être unique et stable.
    """
    sortie, no = [], 0
    for b in blocs:
        if b.get("y") != "texte":
            sortie.append(b)
            continue
        # ⚠️ Un bloc porte SOIT `txt` (texte nu, que le moteur colore) SOIT `r`
        #    (runs, quand il y a du gras ou de l'italique à préserver). Lire les
        #    seuls runs faisait chuter la détection de 113 exercices à 33 : les
        #    quatre cinquièmes des questions sont en texte nu, et passaient au
        #    travers sans un mot. On lit donc les deux, ici et partout.
        txt = (b.get("txt") or
               "".join(r.get("t", "") for r in b.get("r", []))).strip()

        # ① Série « a) … b) … c) … » — un exercice par lettre, dans l'ordre.
        lettres = list(RE_LETTRES.finditer(txt))
        if len(lettres) >= 2:
            debut = txt[:lettres[0].start()].strip()
            if debut:
                sortie.append({"y": "texte", "txt": debut})
            for i, m in enumerate(lettres):
                fin = lettres[i + 1].start() if i + 1 < len(lettres) else len(txt)
                q = txt[m.start():fin].strip()
                if not q:
                    continue
                no += 1
                sortie.append({"y": "exercice", "no": str(no), "txt": q})
                sortie.append({"y": "lines", "n": 2})
            continue

        # ② Verbe de consigne en tête. ③ Question courte.
        est_consigne = bool(RE_CONSIGNE.match(txt))
        est_question = txt.endswith("?") and len(txt) <= 260
        if est_consigne or est_question:
            no += 1
            ex = {"y": "exercice", "no": str(no)}
            if "txt" in b:
                ex["txt"] = b["txt"]
            else:
                ex["r"] = b.get("r", [])
            sortie.append(ex)
            sortie.append({"y": "lines", "n": 3 if est_consigne else 2})
            continue

        sortie.append(b)
    return sortie, no


def convertir(slug):
    """Un cahier entier → (blocs, index des parties)."""
    dossier = SOURCES / ("oeuvre-" + slug) / "epub"
    index = json.loads((dossier / "index.json").read_text(encoding="utf-8"))
    blocs, parties = [], []
    niveau, prix, titre, pas = OUVRAGES[slug]
    blocs.append({"y": "rubrique", "txt": titre + " — Cahier de l’œuvre intégrale"})
    for ch in index.get("chapitres", []):
        f = dossier / ch["f"]
        if not f.is_file():
            continue
        parties.append((len(blocs), ch.get("titre", "")))
        lec = Lecteur()
        lec.feed(f.read_text(encoding="utf-8"))
        lec.close()
        blocs.extend(numeroter(lec.blocs, pas))
    return interactif(blocs) + (parties,)


def js(nom, blocs):
    """Le fichier que le moteur charge en <script>. `window.CAHIER_BLOCS`, et
    rien d'autre : pas de module ES, la page n'est pas en type="module"."""
    return ("window.CAHIER_BLOCS=" +
            json.dumps(blocs, ensure_ascii=False, separators=(",", ":")) + ";\n")


def extrait(blocs, parties):
    """Deux parties ÉLOIGNÉES, jamais le début suivi.

    ⚠️ DEUX LEÇONS, PAS DEUX TRANCHES. La première version prenait deux
    fenêtres de 70 blocs. Une fenêtre de cette taille traverse plusieurs
    sous-titres : l'aperçu de Balafon en contenait TROIS, et le déploiement a
    été refusé — deploy.yml compte les blocs `lecon` et n'en tolère que deux.

    La garde a raison, et elle est commerciale avant d'être technique : un
    aperçu qui donne trois leçons ne fait plus envie d'acheter, il commence à
    remplacer le produit. On coupe donc sur le CONTENU (au troisième
    sous-titre rencontré), pas sur un nombre de blocs qui ne veut rien dire.

    Les deux morceaux restent éloignés : deux leçons qui se suivent forment un
    ensemble qu'on finit, deux leçons distantes montrent ce qui manque entre
    elles."""
    if len(parties) < 4:
        return blocs[:60]

    def jusqu_a_n_lecons(debut, fin, reste):
        """Coupe la tranche dès qu'on a vu `reste` sous-titres."""
        out, vus = [], 0
        for b in blocs[debut:fin]:
            if b.get("y") == "lecon":
                vus += 1
                if vus > reste:
                    break
            out.append(b)
        return out

    # « J'entre dans l'œuvre » (~1/3) et une lecture méthodique (~1/2).
    i1 = parties[min(4, len(parties) - 1)][0]
    i2 = parties[min(7, len(parties) - 1)][0]
    fin1 = parties[min(5, len(parties) - 1)][0]
    lot = (jusqu_a_n_lecons(i1, fin1, 1)
           + [{"y": "texte", "txt": "…"}]
           + jusqu_a_n_lecons(i2, i2 + 120, 1))
    return [blocs[0]] + lot


def main():
    ap = argparse.ArgumentParser(description="Cahiers d'œuvre → cahier interactif.")
    ap.add_argument("--charge", help="dossier de charge FTP (reçoit les booklets)")
    ap.add_argument("--controle", action="store_true", help="ne rien écrire")
    ap.add_argument("--seulement", help="un seul slug")
    a = ap.parse_args()

    slugs = [a.seulement] if a.seulement else sorted(OUVRAGES)
    inconnus = [s for s in slugs if s not in OUVRAGES]
    if inconnus:
        print("✗ slug inconnu :", ", ".join(inconnus))
        return 1

    sortie = None
    if a.charge:
        sortie = Path(a.charge) / "uploads" / "protected" / "livrets"
        if not a.controle:
            sortie.mkdir(parents=True, exist_ok=True)

    cat = json.loads(CATALOGUE.read_text(encoding="utf-8")) if CATALOGUE.is_file() else {"ouvrages": {}}
    cat.setdefault("ouvrages", {})
    total = 0

    for slug in slugs:
        d = SOURCES / ("oeuvre-" + slug) / "epub"
        if not (d / "index.json").is_file():
            print("  ✗ %-12s source absente (%s)" % (slug, d))
            continue
        blocs, nb_ex, parties = convertir(slug)
        niveau, prix, titre, pas = OUVRAGES[slug]
        cle = "oeuvre-" + slug
        contenu = js(cle, blocs)
        ext = js(cle, extrait(blocs, parties))

        print("  %-12s %5d blocs · %3d exercices · %3d parties · %5.0f Ko"
              % (slug, len(blocs), nb_ex, len(parties), len(contenu) / 1000))

        if not a.controle:
            if sortie:
                (sortie / ("booklet-%s.js" % cle)).write_text(contenu, encoding="utf-8")
            (EXTRAITS / ("extrait-%s.js" % cle)).write_text(ext, encoding="utf-8")
            cat["ouvrages"][cle] = {
                "titre": titre + " — Cahier de l’œuvre intégrale",
                "niveau": niveau, "prix": prix,
                # Un cahier d'œuvre se vend SANS guide de l'enseignant : émettre
                # un code « guide » produirait un code valide qui n'ouvre rien.
                "kinds": ["livret"], "mode": "interactif",
                "pages": 0, "pagesLibres": 0,
            }
        total += 1

    if not a.controle and total:
        CATALOGUE.write_text(
            json.dumps(cat, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("\n  catalogue : %d ouvrages au total" % len(cat["ouvrages"]))
        if not sortie:
            print("  ⚠️  --charge non fourni : les booklets ÉLÈVE n'ont pas été écrits.")

    print("\n%d cahier(s) traité(s)." % total)
    return 0


if __name__ == "__main__":
    sys.exit(main())
