# -*- coding: utf-8 -*-
"""build_corriges_2c.py — pages de corrigés des NOUVEAUX cahiers du 2nd cycle (24/09/2026).

Entrées
    _bord_extract/{niv}.json            ← tools/extract_cahiers2c.py
    content/corriges-cahier/{niv}/*.md  ← corrigés rédigés à la main :
        #SOL::   <id> :: <texte>   un paragraphe de corrigé (répétable)
        #NOSOL:: <id> :: <raison>  item volontairement sans corrigé (consigne générale,
                                   observation d'un objet que seul l'élève a en main…)
Sortie
    corriges/{niv}/cahier-evaluation-diagnostique.html, cahier-sequence-N.html, index.html

Pourquoi un script à part, et pas une entrée de plus dans `build_corriges.py` ?
    `build_corriges.py` régénère TOUT le dossier corriges/ (39 pages des livrets, hub,
    sitemap, manuels.html, page « tous les corrigés ») à partir de sources dont
    plusieurs sont en cours d'édition par d'autres sessions. Ce script ne touche qu'aux
    quatre dossiers des nouveaux cahiers ; il réutilise le gabarit de `build_corriges`
    (en-tête, pied, rendu des items) pour que les pages soient identiques aux autres.
    Le raccordement au hub et au sitemap est une étape séparée, à faire quand Jacques
    aura décidé si ces pages REMPLACENT les anciennes `corriges/tle/cahier-*` (anciens
    « Bord ») ou s'ajoutent à elles.

Jumeaux : un item de la série C-D identique à un item de la série A (même énoncé, même
texte support) reçoit le corrigé de son jumeau — il n'est rédigé qu'une fois.

Usage : python tools/build_corriges_2c.py [niv ...]
"""
import os, re, sys, io, json, glob
from collections import Counter

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import build_corriges as bc                                   # noqa: E402

ROOT = bc.ROOT
EXTRAIT = os.path.join(ROOT, "_bord_extract")
SRC = os.path.join(ROOT, "content", "corriges-cahier")
OUT = os.path.join(ROOT, "corriges")
SITE = bc.SITE

NIVEAUX_2C = [
    dict(slug="tle-a", label="Tˡᵉ A", long="Terminale A", cycle="2nd", examen="BAC",
         manuel="Mon Cahier de français — Terminale A", seo="francais-terminale"),
    dict(slug="tle-cd", label="Tˡᵉ C-D", long="Terminale C-D", cycle="2nd", examen="BAC",
         manuel="Mon Cahier de français — Terminale C-D", seo="francais-terminale"),
    dict(slug="1ere-a", label="1ʳᵉ A", long="Classe de 1ʳᵉ A", cycle="2nd", examen="Probatoire",
         manuel="Mon Cahier de français — 1ʳᵉ A", seo="francais-premiere"),
    dict(slug="1ere-cd", label="1ʳᵉ C-D", long="Classe de 1ʳᵉ C-D", cycle="2nd", examen="Probatoire",
         manuel="Mon Cahier de français — 1ʳᵉ C-D", seo="francais-premiere"),
    dict(slug="3e-cahier", label="3ᵉ", long="Classe de 3ᵉ", cycle="1er", examen="BEPC",
         manuel="Mon Cahier de français 3ᵉ — cahier d'activités", seo="francais-3eme"),
]
DOTS = re.compile(r"…{2,}|\.{5,}| … ")


def lire_tout():
    """Tous les corrigés des quatre cahiers : les jumeaux traversent les niveaux."""
    sols, nosol = {}, {}
    for niv in NIVEAUX_2C:
        for f in sorted(glob.glob(os.path.join(SRC, niv["slug"], "module-*.md"))):
            for raw in open(f, encoding="utf-8"):
                if raw.startswith("#SOL::"):
                    _, k, t = raw.rstrip("\n").split("::", 2)
                    sols.setdefault(k.strip(), []).append(t.strip())
                elif raw.startswith("#NOSOL::"):
                    _, k, t = raw.rstrip("\n").split("::", 2)
                    nosol[k.strip()] = t.strip()
    return sols, nosol


def charger(slug):
    with open(os.path.join(EXTRAIT, "%s.json" % slug), encoding="utf-8") as f:
        return json.load(f)


def solution(it, sols):
    return sols.get(it["id"]) or (sols.get(it["twin"]) if it.get("twin") else None)


def repere(it):
    """Le repère que l'élève retrouve dans son cahier — jamais l'énoncé."""
    k, num = it["kind"], it.get("num")
    t = re.sub(r"^\W+", "", it.get("txt") or "")
    m = re.match(r"(Parcours \d+)", t)
    if m:
        return m.group(1)
    if k == "exo" and t.startswith("Production"):
        return "Production"
    if k == "q" and not num and t.startswith("Tâche"):
        return "Tâche"
    if k == "exo":
        return num or "Exercice"
    if k == "bac":
        return num or "Vers le BAC"
    if k == "sujet":
        return "Sujet de l'épreuve"
    if k == "trou":
        return "Canevas à compléter"
    if k == "grille":                       # 1er cycle : ligne de la grille de lecture
        return "Grille d'analyse — %s" % (num or "relevé")
    if k == "prod":
        return "Production écrite"
    return ("Question %s" % num) if num else "Question"


def titre_page(mod):
    if mod["n"] == 0:
        return "cahier-evaluation-diagnostique", "Évaluation diagnostique de rentrée"
    if mod["titre"].upper().startswith("MODULE"):            # 1er cycle
        t = re.sub(r"^MODULE\s+\d+\s*[:—–-]?\s*", "", mod["titre"], flags=re.I).strip()
        return ("cahier-module-%d" % mod["n"],
                ("Module %d — %s" % (mod["n"], t)) if t else "Module %d" % mod["n"])
    t = re.sub(r"^SÉQUENCE\s+\d+\s*—?\s*", "", mod["titre"]).strip()
    return ("cahier-sequence-%d" % mod["n"],
            ("Séquence %d — %s" % (mod["n"], t)) if t else "Séquence %d" % mod["n"])


def pages_niveau(niv, sols):
    data = charger(niv["slug"])
    pages, stats = [], Counter()
    for mod in data["modules"]:
        slug, titre = titre_page(mod)
        page = bc.Page(slug, titre)
        page.rang = mod["n"]
        for l in mod["lecons"]:
            obj = (l.get("objectif") or "").strip()
            obj = "" if DOTS.search(obj) else bc.strip_prefix(obj, "🎯")
            lec = bc.Lecon.new(l["titre"], objectif=obj or None, semaine=l["semaine"])
            sans_num = Counter()
            for it in l["items"]:
                if it["kind"] == "auto":
                    continue
                sol = solution(it, sols)
                if not sol:
                    stats["sans"] += 1
                    continue
                lab = repere(it)
                if lab == "Question":                # énoncé imprimé sans numéro
                    sans_num[it["rub"]] += 1
                    lab = "Question %d" % sans_num[it["rub"]]
                lec["items"].append(dict(rub=it["rub"], q="", sub=[], sol=sol, lab=lab))
                stats["corriges"] += 1
                if it.get("twin") and it["id"] not in sols:
                    stats["jumeaux"] += 1
            if lec["items"]:
                page.lecons.append(lec)
        if page.lecons:
            pages.append(page)
    return pages, stats


def render_index(niv, pages):
    total = sum(p.n_items for p in pages)
    exam = (" Préparation au %s." % niv["examen"]) if niv["examen"] else ""
    title = "Corrigés du cahier de français %s — %s exercices | VÉRITAS" % (niv["long"], bc.num(total))
    desc = ("%s exercices corrigés du cahier de français %s, séquence par séquence. "
            "Programme MINESEC.%s Les énoncés restent dans ton cahier."
            % (bc.num(total), niv["long"], exam))
    url = "%s/corriges/%s/" % (SITE, niv["slug"])
    crumbs = [("Accueil", SITE), ("Corrigés des manuels", SITE + "/corriges/"), (niv["long"], url)]
    h = bc.head(title, desc, url, depth=2,
                jsonld=bc.jsonld_page(title, desc, url, niv["long"], crumbs))
    cartes = "".join(
        '<div class="card"><h3>%s</h3><p class="note">%s exercices corrigés</p>'
        '<a class="dl" href="%s.html"><span>Voir les corrigés</span>'
        '<span class="pill">%s</span></a></div>'
        % (bc.esc(p.titre), bc.num(p.n_items), p.slug, bc.short_title(p.titre)) for p in pages)
    body = ['<header class="top"><span class="badge">Espace Manuels · Corrigés</span>'
            "<h1>Corrigés — %s</h1><p>%s exercices corrigés du cahier « %s ». Programme MINESEC.%s</p></header>"
            % (bc.esc(niv["long"]), bc.num(total), bc.esc(niv["manuel"]), bc.esc(exam)),
            '<div class="wrap">',
            '<div class="intro">' + bc.ico("i-target", "i lg")
            + ' <strong>La règle d\'or :</strong> on cherche d\'abord, on compare ensuite. '
            "Chaque corrigé est masqué tant que tu ne cliques pas — c'est fait exprès. "
            "<strong>Les énoncés ne sont pas recopiés en ligne</strong> : ils sont dans ton cahier.</div>",
            '<p class="crumb"><a href="%s/">Accueil</a> › <a href="../">Corrigés des manuels</a> › %s</p>'
            % (SITE, bc.esc(niv["long"])),
            '<h2 class="sec">' + bc.ico("i-notebook") + 'Le cahier de français, séquence par séquence</h2>',
            '<div class="grid">%s</div>' % cartes,
            '<h2 class="sec">' + bc.ico("i-compass") + 'Pour aller plus loin</h2>',
            '<div class="grid"><div class="card"><h3>Le programme de %s</h3>'
            '<p class="note">Notions, œuvres et examen du niveau.</p>'
            '<a class="dl" href="%s/niveaux/%s.html"><span>Voir le programme</span><span class="pill">MINESEC</span></a></div>'
            '<div class="card"><h3>Méthodes &amp; annales</h3>'
            '<p class="note">Résumé, commentaire, dissertation, épreuves corrigées.</p>'
            '<a class="dl" href="%s/ressources/"><span>Voir les méthodes</span><span class="pill">Fiches</span></a></div></div>'
            % (bc.esc(niv["label"]), SITE, niv["seo"], SITE),
            bc.CTA, "</div>"]
    return h + "\n".join(body) + bc.foot(depth=2)


def table_alignement(niv, sols, nosol):
    """_bord_extract/table_alignement_{niv}.tsv : question du cahier → corrigé.

    Les cahiers vont encore changer (consignes « mots en gras » reformulées, questions
    ajoutées aux lectures méthodiques) : les identifiants `-lL-nN` bougeront. Cette table
    garde, pour chaque corrigé, l'énoncé EXACT auquel il répond ; `realigner_corriges_2c.py`
    s'en sert pour rattacher chaque corrigé à la nouvelle question. Fichier de travail,
    rangé à côté des extractions : il contient les ÉNONCÉS, il ne doit être ni déployé
    ni versionné (le dépôt est public).
    """
    data = charger(niv["slug"])
    out = ["id\trepere\tstatut\tjumeau\tlecon\tenonce"]
    for mod in data["modules"]:
        for l in mod["lecons"]:
            for it in l["items"]:
                if it["kind"] == "auto":
                    st = "auto-évaluation"
                elif it["id"] in sols:
                    st = "SOL"
                elif it.get("twin") and it["twin"] in sols:
                    st = "SOL-jumeau"
                elif it["id"] in nosol or it.get("twin") in nosol:
                    st = "NOSOL"
                else:
                    st = "MANQUE"
                out.append("\t".join([it["id"], repere(it), st, it.get("twin") or "",
                                      l["titre"].replace("\t", " "), it["txt"].replace("\t", " ")]))
    with open(os.path.join(EXTRAIT, "table_alignement_%s.tsv" % niv["slug"]), "w",
              encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")


def main():
    voulus = sys.argv[1:]
    sols, nosol = lire_tout()
    for niv in NIVEAUX_2C:
        if voulus and niv["slug"] not in voulus:
            continue
        if not os.path.exists(os.path.join(EXTRAIT, "%s.json" % niv["slug"])):
            print("!! %s : lancer d'abord tools/extract_cahiers2c.py" % niv["slug"]); continue
        bc.NIVEAU_SEO.setdefault(niv["slug"], niv["seo"])
        pages, st = pages_niveau(niv, sols)
        d = os.path.join(OUT, niv["slug"])
        os.makedirs(d, exist_ok=True)
        for p in pages:
            with open(os.path.join(d, p.slug + ".html"), "w", encoding="utf-8") as f:
                f.write(bc.render_sequence_page(niv, p, pages, axe="cahier"))
        with open(os.path.join(d, "index.html"), "w", encoding="utf-8") as f:
            f.write(render_index(niv, pages))
        table_alignement(niv, sols, nosol)
        print("  ✓ %-7s %2d pages · %4d corrigés publiés (%d par jumeau) · %d items sans corrigé"
              % (niv["slug"], len(pages), st["corriges"], st["jumeaux"], st["sans"]))


if __name__ == "__main__":
    main()
