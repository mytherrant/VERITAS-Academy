#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/pages_ouvrages.py — UNE PAGE D'ATTERRISSAGE PAR CAHIER

    python tools/pages_ouvrages.py            # écrit les pages manquantes
    python tools/pages_ouvrages.py --controle # ne rien écrire, vérifier

POURQUOI CE FICHIER EXISTE
  Quinze cahiers sont au catalogue et se vendent. Cinq seulement avaient leur
  page : `livrets/6e.html`, `5e.html`, `4e.html`, `3e.html`, `bord-6e.html`.
  Les dix autres se vendaient par le lecteur générique `cahier.html?o=<slug>`
  — ce qui FONCTIONNE (vérifié en production le 31/08/2026 sur `?o=tle` : la
  page s'ouvre et demande le code), mais ne laisse aucune entrée dans les
  moteurs de recherche. Un parent qui cherche « cahier de français 2nde
  Cameroun » ne pouvait pas tomber sur le nôtre : il n'existait aucune page à
  indexer pour lui.

CE QUE CES PAGES SONT, ET NE SONT PAS
  Ce ne sont PAS les coquilles verrouillées produites par `publier.py` — celles
  d'un cahier interactif exigent la source `.dc.html`, que la CI n'a pas et que
  ce script ne doit pas supposer. Ce sont des pages de PRÉSENTATION : elles
  nomment l'ouvrage, montrent sa couverture, disent son prix et comment le code
  fonctionne, puis mènent au lecteur.

  ⚠️ ELLES NE DÉCRIVENT PAS LE CONTENU DE L'OUVRAGE. Le catalogue ne porte que
  le titre, le niveau, le mode et le prix : tout ce qu'on écrirait de plus
  serait inventé, et un cahier de 2ⁿᵈᵉ n'a pas les mêmes séquences qu'un cahier
  de Tˡᵉ. Ce qui est dit ici est vrai de TOUS les cahiers de la famille — la
  forme, le fonctionnement, le prix — et rien d'autre. Le jour où quelqu'un
  rédige un sommaire réel par ouvrage, il remplace `resume` ci-dessous.

STYLE
  Aucune feuille nouvelle, aucune classe nouvelle : la page emprunte celles de
  `assets/veritas-pages.css` (`header.top`, `.badge`, `.wrap`, `.intro`,
  `.duo .bloc`, `.card`, `.dl`, `.pill`, `.note`). C'est ce qui garantit
  qu'elle ne « décale » pas visuellement par rapport au reste du site.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
CATALOGUE = RACINE / "api" / "data" / "livrets_catalogue.json"
SORTIE = RACINE / "livrets"
COUVERTURES = RACINE / "uploads" / "oeuvres"
SITE = "https://veritas-school.com"

# ── Ce qu'on peut dire de vrai, par famille ────────────────────────────────
# Les deux textes viennent de `livrets/index.html`, où ils décrivent déjà ces
# deux produits. Les répéter ici garde une seule version de la vérité.
FAMILLES = {
    "livret": {
        "etiquette": "Livret d'activités",
        "phrase": "Le livret d'activités, tel quel, mais dans le navigateur : "
                  "l'élève écrit ses réponses, coche, relie, remplit les grilles.",
        "resume": [
            ("Pour l'apprenant",
             "son travail est gardé et le suit d'un appareil à l'autre ; la correction "
             "s'ouvre dès qu'il a répondu, sans attendre le cours suivant pour savoir "
             "s'il avait juste."),
            ("Pour l'enseignant",
             "avec le code du Guide pédagogique, il lit les copies de sa classe, annote "
             "l'exercice qu'il vient de lire et met une note."),
        ],
    },
    "bord": {
        "etiquette": "Le Bord — cahier complet",
        "phrase": "Le cahier complet : les leçons, les textes d'auteur, les exercices "
                  "et les corrigés modèles. C'est la référence, pas le cahier de brouillon.",
        "resume": [
            ("Pour l'apprenant",
             "il y retrouve la règle expliquée et voit à quoi ressemble une réponse "
             "attendue, ce qu'un exercice corrigé seul ne montre jamais."),
            ("Pour l'enseignant",
             "la progression entière sous les yeux pour préparer sa séquence, avec les "
             "corrigés déjà rédigés."),
        ],
    },
}


def famille(slug: str) -> dict:
    return FAMILLES["bord"] if slug.startswith("bord-") else FAMILLES["livret"]


_SPRITE = None


def ico(nom: str) -> str:
    """⚠️ UNE ICÔNE ABSENTE NE FAIT PAS D'ERREUR : elle ne dessine RIEN.
    `<use href="…#i-cart">` sur un identifiant qui n'existe pas laisse un carré
    vide, sans un mot dans la console. La première version de ce script
    employait `i-cart`, qui n'est pas dans le sprite — dix pages seraient
    parties avec un bouton d'achat sans pictogramme. On vérifie donc à la
    production, là où l'erreur est encore réparable."""
    global _SPRITE
    if _SPRITE is None:
        p = RACINE / "assets" / "veritas-icons.svg"
        _SPRITE = p.read_text(encoding="utf-8", errors="replace") if p.is_file() else ""
    if _SPRITE and f'id="{nom}"' not in _SPRITE:
        raise SystemExit(f"✗ icône « {nom} » absente de assets/veritas-icons.svg — "
                         f"elle ne dessinerait rien. Choisis-en une qui existe.")
    return (f'<svg class="i" aria-hidden="true" focusable="false">'
            f'<use href="/assets/veritas-icons.svg#{nom}"/></svg>')


def sans_accents_titre(titre: str) -> str:
    """Le titre porte des exposants (6ᵉ, 2ⁿᵈᵉ, Tˡᵉ). Ils sont justes à l'écran
    mais illisibles pour un moteur de recherche, qui n'indexe pas « 2ⁿᵈᵉ »
    comme « 2nde ». On ajoute donc la forme simple dans la description."""
    remp = {"ᵉ": "e", "ʳ": "r", "ⁿ": "n", "ᵈ": "d", "ˡ": "l", "—": "-"}
    for a, b in remp.items():
        titre = titre.replace(a, b)
    return re.sub(r"\s+", " ", titre).strip()


def page(slug: str, o: dict) -> str:
    f = famille(slug)
    titre = str(o.get("titre") or slug)
    prix = int(o.get("prix") or 0)
    niveau = str(o.get("niveau") or "")
    couv_rel = f"/uploads/oeuvres/livret_{slug}.jpg"
    a_couv = (COUVERTURES / f"livret_{slug}.jpg").is_file()
    simple = sans_accents_titre(titre)
    # Le titre part dans du JavaScript, pas dans du HTML : `html.escape` y
    # écrirait « &#39; » que le visiteur lirait tel quel sur l'écran de
    # paiement. json.dumps produit un littéral JS correct, apostrophes et
    # exposants compris ; `</` est coupé pour qu'un titre ne puisse jamais
    # fermer la balise <script> qui le porte.
    titre_js = json.dumps(titre, ensure_ascii=False).replace("</", "<\\/")

    desc = (f"{simple} — cahier interactif du Centre VÉRITAS, à remplir en ligne. "
            f"{prix} FCFA pour l'année scolaire, code d'accès délivré après paiement "
            f"par Orange Money, MTN MoMo ou carte bancaire.")

    resume = "".join(
        f'<p><b>{html.escape(qui)}</b> — {html.escape(quoi)}</p>'
        for qui, quoi in f["resume"]
    )

    couverture = (
        f'<img src="{couv_rel}" alt="Couverture — {html.escape(titre)}" '
        f'width="620" height="877" loading="lazy" decoding="async" '
        f'style="width:100%;height:auto;border-radius:10px;display:block">'
        if a_couv else
        f'<p class="note">Couverture à venir.</p>'
    )

    # Le produit structuré : ce qui permet à Google d'afficher le prix. On ne
    # déclare que ce qu'on sait — pas d'avis, pas de note, pas de stock.
    jsonld = json.dumps({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": titre,
        "description": desc,
        "brand": {"@type": "Brand", "name": "Centre VÉRITAS"},
        "image": f"{SITE}{couv_rel}" if a_couv else None,
        "offers": {
            "@type": "Offer",
            "price": str(prix),
            "priceCurrency": "XAF",
            "url": f"{SITE}/livrets/{slug}.html",
            "availability": "https://schema.org/InStock",
        },
    }, ensure_ascii=False)
    jsonld = json.dumps(json.loads(jsonld.replace('"image": null,', '')), ensure_ascii=False)

    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(titre)} — cahier interactif | Centre VÉRITAS</title>
<meta name="description" content="{html.escape(desc)}">
<meta name="robots" content="index,follow">
<meta property="og:title" content="{html.escape(titre)} — Centre VÉRITAS">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:type" content="product">
<meta property="og:url" content="{SITE}/livrets/{slug}.html">
{f'<meta property="og:image" content="{SITE}{couv_rel}">' if a_couv else ''}
<link rel="canonical" href="{SITE}/livrets/{slug}.html">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"></noscript>
<link rel="stylesheet" href="/assets/veritas-tokens.css?v=1.20.14">
<link rel="stylesheet" href="/assets/veritas-pages.css?v=1.20.14">
<script type="application/ld+json">{jsonld}</script>
</head>
<body>
<header class="top">
  <span class="badge">Centre VÉRITAS · {html.escape(f['etiquette'])}</span>
  <h1>{html.escape(titre)}</h1>
  <p>{html.escape(f['phrase'])}</p>
</header>
<div class="wrap">

  <div class="intro">
    <strong>{ico('i-key')}Comment ça marche ?</strong>
    Un code d'accès par cahier, valable <strong>toute l'année scolaire</strong>,
    utilisable sur <strong>3 appareils</strong>. Le code est délivré après le
    paiement — Orange Money, MTN MoMo ou carte bancaire.
  </div>

  <p class="note"><a href="/livrets/">Tous les cahiers</a> ›
     {html.escape(simple)}</p>

  <div class="duo">
    <div class="bloc">
      {couverture}
    </div>
    <div class="bloc">
      <h3>{ico('i-book-open')}{html.escape(titre)}</h3>
      <p><span class="pill or">{prix} FCFA</span> pour l'année scolaire{
        f', classe de {html.escape(niveau)}' if niveau else ''}.</p>
      {resume}
      <a class="dl" href="cahier.html?o={slug}">
        <span>{ico('i-key')}Ouvrir mon cahier</span><span class="pill">j'ai un code</span></a>
      <a class="dl" id="vrt-acheter" href="cahier.html?o={slug}" data-o="{slug}">
        <span>{ico('i-credit-card')}Obtenir mon code d'accès</span><span class="pill or">{prix} F</span></a>
    </div>
  </div>

  <div class="card" style="margin-top:1rem">
    <h3>{ico('i-book')}Livret ou Bord ?</h3>
    <p>Ce sont deux ouvrages distincts, au même prix : le <strong>Livret</strong>
       pour travailler — l'élève y écrit — et le <strong>Bord</strong> pour
       comprendre et réviser, avec les leçons et les corrigés modèles.
       Beaucoup d'élèves n'en prennent qu'un.</p>
    <a class="dl" href="/livrets/"><span>{ico('i-book-open')}Comparer et choisir</span>
      <span class="pill gris">tous les cahiers</span></a>
  </div>

  <p class="note">Les corrigés des cahiers restent gratuits et sans compte sur
     <a href="/corriges/">la page des corrigés</a>. Ce cahier-ci est l'ouvrage
     lui-même, à remplir en ligne.</p>

</div>
<!-- ⚠️ LE BOUTON D'ACHAT DOIT OUVRIR LE TUNNEL, PAS RENVOYER A LA BOUTIQUE.
     La premiere version de ces pages pointait « Obtenir mon code d'acces » sur
     `/#boutique`. Or c'est de la boutique qu'on ARRIVE : la carte du cahier y
     mene ici (api/public_data.php pose `url` depuis vrt_livret_etat). Le
     visiteur qui voulait payer repartait donc d'ou il venait, en boucle, et les
     dix cahiers pourvus d'une page neuve perdaient le tunnel qu'ils avaient
     avant elle — `cahier.html?o=<slug>`, qui marche.
     Deux niveaux, dans cet ordre :
       · sans JavaScript, le lien reste `cahier.html?o=<slug>` — le lecteur y
         propose « Je n'ai pas de code », donc on n'envoie jamais dans le vide ;
       · avec JavaScript, gate.js ouvre la modale de paiement SUR PLACE.
     C'est le meme gate.js que les coquilles completes et que liseur.js : un
     seul tunnel, un seul endroit ou se tromper. -->
<script src="/livrets/gate.js?v=1.20.14"></script>
<script>
(function () {{
  var a = document.getElementById('vrt-acheter');
  if (!a || !window.VRTLivret) return;   // repli : le lien mene au lecteur
  a.addEventListener('click', function (e) {{
    e.preventDefault();
    window.VRTLivret.config({{ classe: a.dataset.o, kind: 'livret',
                              titre: {titre_js} }}).acheter();
  }});
}})();
</script>
</body>
</html>
"""


def main() -> int:
    ap = argparse.ArgumentParser(description="Pages d'atterrissage des cahiers.")
    ap.add_argument("--controle", action="store_true",
                    help="ne rien écrire ; échouer s'il manque une page")
    ap.add_argument("--tout", action="store_true",
                    help="réécrire même les pages déjà présentes (ne touche PAS "
                         "les coquilles interactives de publier.py)")
    a = ap.parse_args()

    if not CATALOGUE.is_file():
        print("✗ catalogue introuvable :", CATALOGUE)
        return 1
    ouvrages = json.loads(CATALOGUE.read_text(encoding="utf-8")).get("ouvrages") or {}

    # Les pages produites par `publier.py` sont des coquilles VERROUILLÉES : on
    # ne les écrase jamais. On les reconnaît à leur poids — une page de
    # présentation fait quelques kilo-octets, une coquille en fait des dizaines.
    ecrites, gardees, manquantes = [], [], []
    for slug, o in sorted(ouvrages.items()):
        cible = SORTIE / f"{slug}.html"
        if cible.is_file():
            # ⚠️ LE POIDS NE SUFFIT PAS À RECONNAÎTRE UNE COQUILLE.
            # `--tout` ne réécrit que les pages « légères », en supposant qu'une
            # coquille de publier.py pèse des dizaines de kilo-octets. C'est
            # vrai des quatre coquilles interactives (~95 Ko) — et faux du
            # lecteur en mode feuilletage : `livrets/bord-6e.html` fait
            # 637 octets, deux balises et un appel à `VRTLiseur.ouvrir`. Il
            # passait donc sous le seuil, et `--tout` l'aurait remplacé par une
            # page de présentation : le seul cahier vendu en mode lecture
            # aurait perdu son lecteur, sans qu'aucun contrôle ne le dise.
            # On regarde ce que le fichier EST, plus seulement ce qu'il pèse.
            deja = cible.read_text(encoding="utf-8", errors="replace")
            coquille = ("VRTLiseur" in deja or "VRTCahier" in deja
                        or cible.stat().st_size > 30_000)
            if not a.tout or coquille:
                gardees.append(slug)
                continue
        if a.controle:
            if not cible.is_file():
                manquantes.append(slug)
            continue
        cible.write_text(page(slug, o), encoding="utf-8")
        ecrites.append(slug)

    if a.controle:
        if manquantes:
            for s in manquantes:
                print(f"::error title=Cahier sans page::{s} → livrets/{s}.html absente")
            print(f"\n✗ {len(manquantes)} cahier(s) sans page d'atterrissage.")
            return 1
        print(f"✓ Les {len(ouvrages)} cahiers du catalogue ont leur page.")
        return 0

    for s in ecrites:
        print(f"  + livrets/{s}.html")
    print(f"\n{len(ecrites)} page(s) écrite(s), {len(gardees)} conservée(s) "
          f"(coquilles existantes, jamais écrasées).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
