#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/prepare_livrets.py — met les livrets interactifs en ligne, sous verrou serveur.

CE QUE FAIT CE SCRIPT
  Prend les fichiers de travail de « Mise en page livret activité » (produits par
  l'éditeur, non versionnés) et en tire :

    livrets/<classe>.html          coquille élève  (aucun contenu à l'intérieur)
    livrets/guide-<classe>.html    coquille enseignant
    livrets/demo-6e.html           démo libre (Semaine 1) — volontairement ouverte
    livrets/mode-emploi.html       onboarding
    livrets/support.js             runtime dc, copié tel quel

  et, avec --copie, un dossier prêt à téléverser par FTP dans
    uploads/protected/livrets/    booklet-<classe>.js / guide-<classe>.js

POURQUOI UN SCRIPT ET PAS UNE ÉDITION À LA MAIN
  Les neuf pages sont quasi identiques et Jacques régénère les livrets. Éditer à
  la main, c'est perdre le verrou à la première régénération. Ici, la sécurité
  est un traitement reproductible — et le script ÉCHOUE si une source a changé
  de forme, plutôt que de produire une page silencieusement non protégée.

CE QU'IL RETIRE DES PAGES
  1. <script src="booklet-data*.js"> et <script src="guide-data*.js"> — le produit
     vendu et ses corrigés partaient au navigateur AVANT toute vérification.
  2. Le code en dur ('VERITAS2026' / 'PROF2026') et l'indice qui l'affichait.
  3. Le déverrouillage local (localStorage), remplacé par api/livret.php.

USAGE
  python tools/prepare_livrets.py                       # construit livrets/
  python tools/prepare_livrets.py --copie /tmp/ftp      # + prépare le dépôt FTP
  python tools/prepare_livrets.py --src "<dossier>"     # source explicite
"""
from __future__ import annotations

import argparse
import json
import hashlib
import re
import shutil
import sys
from pathlib import Path

# La console Windows est en cp1252 : sans cela, le premier « ✓ » fait planter
# le script APRÈS avoir écrit les fichiers — un échec trompeur.
for _f in (sys.stdout, sys.stderr):
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

RACINE = Path(__file__).resolve().parent.parent
SRC_DEFAUT = Path.home() / "Downloads" / "Mise en page livret activité new"
SORTIE = RACINE / "livrets"

# classe -> (fichier livret élève, fichier guide, fichier de données livret, fichier de données guide)
CLASSES = {
    "6e": ("Livret 6e En ligne.dc.html", "Guide enseignant 6e.dc.html", "booklet-data.js",     "guide-data-6e.js"),
    "5e": ("Livret 5e En ligne.dc.html", "Guide enseignant 5e.dc.html", "booklet-data-5e.js",  "guide-data-5e.js"),
    "4e": ("Livret 4e En ligne.dc.html", "Guide enseignant 4e.dc.html", "booklet-data-4e.js",  "guide-data-4e.js"),
    "3e": ("Livret 3e En ligne.dc.html", "Guide enseignant 3e.dc.html", "booklet-data-3e.js",  "guide-data-3e.js"),
}
LIBELLE = {"6e": "6ᵉ", "5e": "5ᵉ", "4e": "4ᵉ", "3e": "3ᵉ"}

# Pages libres. ATTENTION : « Demo 6e » et « Feuilletage 4e » chargeaient les
# fichiers de données COMPLETS (457 Ko de livret + 203 Ko de corrigés) et
# n'appliquaient aucun filtre — la « démo » était le produit entier, offert.
# On leur fabrique donc un extrait réel : séquence 1, semaine 1, et les seuls
# corrigés de ces exercices-là.
LIBRES = {
    "Mode d'emploi.dc.html": "mode-emploi.html",
}
EXTRAITS = {
    # page source -> (page produite, données livret, données guide ou None)
    "Demo 6e.dc.html":       ("demo-6e.html",       "booklet-data.js",    "guide-data-6e.js"),
    "Feuilletage 4e.dc.html": ("feuilletage-4e.html", "booklet-data-4e.js", None),
}
# Ce que l'extrait gratuit contient : la première semaine de la première
# séquence. Assez pour juger du cahier, trop peu pour s'en passer.
EXTRAIT_SEQUENCES = 1
EXTRAIT_SEMAINES = 1


class Echec(Exception):
    """Une source a changé de forme : on refuse de produire une page non protégée."""


# ── Découpe par accolades ────────────────────────────────────────────────────
def corps_methode(src: str, nom: str) -> tuple[int, int, str]:
    """Retourne (début, fin, texte) de `nom(){ … }`, accolades équilibrées."""
    m = re.search(r"\b" + re.escape(nom) + r"\s*\(\s*\)\s*\{", src)
    if not m:
        raise Echec(f"méthode `{nom}` introuvable")
    i = m.end() - 1  # sur la '{'
    prof, j = 0, i
    while j < len(src):
        c = src[j]
        if c == "{":
            prof += 1
        elif c == "}":
            prof -= 1
            if prof == 0:
                return m.start(), j + 1, src[m.start():j + 1]
        j += 1
    raise Echec(f"accolades non refermées dans `{nom}`")


def remplacer_methode(src: str, nom: str, neuf: str, doit_contenir: str) -> str:
    a, b, texte = corps_methode(src, nom)
    if doit_contenir not in texte:
        raise Echec(
            f"`{nom}` ne ressemble plus à la version attendue "
            f"(« {doit_contenir} » absent) — vérifier la source avant de reconstruire"
        )
    return src[:a] + neuf + src[b:]


def remplacer_une_fois(src: str, motif: str, neuf: str, quoi: str) -> str:
    n = src.count(motif)
    if n != 1:
        raise Echec(f"{quoi} : {n} occurrence(s) au lieu d'une seule")
    return src.replace(motif, neuf, 1)


# ── Fragments injectés ───────────────────────────────────────────────────────
DIDMOUNT = """componentDidMount(){
    var self=this;
    // Le contenu n'est plus dans la page : il arrive d'api/livret.php après
    // vérification du code. `resume()` reprend une session encore valide
    // (rechargement, retour sur la page) ; sinon le calque de saisie reste.
    VRTLivret.onOuvert=function(){ self.setState({unlocked:true,err:false}); };
    VRTLivret.resume().then(function(){ self.setState({unlocked:true,err:false}); })
                      .catch(function(){ self.setState({unlocked:false}); });
  }"""

TRYUNLOCK = """tryUnlock(){
    var self=this, v=(this._code||'').trim();
    if(!v){ this.setState({err:'Saisis ton code.'}); return; }
    this.setState({err:false,busy:true});
    // Le code part au serveur — il n'est comparé à RIEN dans cette page.
    VRTLivret.unlock(v).then(function(){ self.setState({unlocked:true,err:false,busy:false}); })
                       .catch(function(e){ self.setState({err:(e&&e.message)||'Code incorrect.',busy:false}); });
  }"""

META = """<meta name="robots" content="noindex, nofollow">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data:; connect-src 'self' https://unpkg.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'none'">
"""


def bouton_achat(classe: str, kind: str) -> str:
    if kind == "guide":
        return (
            "h('div',{key:'h',style:{fontSize:'11.5px',color:'#98a1aa',marginTop:'12px',lineHeight:1.5}},"
            "'Le code enseignant est remis avec le spécimen. ',"
            "h('a',{href:'https://veritas-school.com/adopter/',target:'_blank',rel:'noopener',"
            "style:{color:'#2b8ac6',fontWeight:700}},'Adopter le cahier'))"
        )
    return (
        "h('button',{key:'h',onClick:()=>VRTLivret.acheter(),"
        "style:{width:'100%',border:'1px solid #cfd6dd',background:'#fff',color:'#1f2b38',"
        "fontFamily:\"'Baloo 2', sans-serif\",fontWeight:700,fontSize:'13.5px',padding:'10px',"
        "borderRadius:'10px',cursor:'pointer',marginTop:'10px'}},"
        "'Je n\\u2019ai pas de code \\u2014 obtenir l\\u2019acc\\u00e8s (1 500 FCFA)')"
    )


def _charger_donnees(p: Path) -> tuple[str, dict]:
    """Lit un « window.X = {…}; » et rend (nom du global, données)."""
    brut = p.read_text(encoding="utf-8")
    m = re.match(r"\s*window\.([A-Z0-9_]+)\s*=\s*", brut)
    if not m:
        raise Echec(f"{p.name} : ne commence pas par « window.X = »")
    return m.group(1), json.loads(brut[m.end():].rstrip().rstrip(";"))


def _norm(t: str) -> str:
    return re.sub(r"\s+", " ", str(t or "")).strip().lower()


def extraire(src_dir: Path, f_livret: str, f_guide: str | None, sortie: Path, tag: str) -> list[str]:
    """Produit les données de l'extrait GRATUIT : 1 séquence, 1 semaine.

    Le guide est filtré par appariement de consigne : un corrigé n'entre dans
    l'extrait que si son exercice y figure. Sous-inclure est sans danger (le
    bouton « Voir la correction » ne s'affiche pas) ; sur-inclure serait une
    fuite. En cas de doute, on exclut.
    """
    produits = []
    nomB, b = _charger_donnees(src_dir / f_livret)
    seqs = []
    for s in (b.get("sequences") or [])[:EXTRAIT_SEQUENCES]:
        s = dict(s)
        s["weeks"] = (s.get("weeks") or [])[:EXTRAIT_SEMAINES]
        seqs.append(s)
    if not seqs:
        raise Echec(f"{f_livret} : aucune séquence à extraire")
    petit = {"header": b.get("header", {}), "sequences": seqs}
    cible = sortie / f"{tag}-livret.js"
    cible.write_text(f"window.{nomB} = " + json.dumps(petit, ensure_ascii=False) + ";", encoding="utf-8")
    produits.append(cible.name)

    if f_guide:
        nomG, g = _charger_donnees(src_dir / f_guide)
        visible = _norm(json.dumps(seqs, ensure_ascii=False))
        gs = []
        for s in g.get("sequences") or []:
            lecons = []
            for l in s.get("lessons") or []:
                ex = [e for e in (l.get("exercises") or [])
                      if len(_norm(e.get("consigne"))) > 25 and _norm(e.get("consigne"))[:60] in visible]
                if ex:
                    # Les « conseils » sont écrits pour l'enseignant : hors extrait.
                    lecons.append({**l, "exercises": ex, "conseils": []})
            if lecons:
                gs.append({**s, "lessons": lecons})
        cible = sortie / f"{tag}-guide.js"
        cible.write_text(f"window.{nomG} = " + json.dumps({"sequences": gs}, ensure_ascii=False) + ";", encoding="utf-8")
        produits.append(cible.name)
    return produits


def page_extrait(src: str, tag: str, avec_guide: bool) -> str:
    """Réécrit les <script src> d'une page libre vers ses données d'extrait."""
    src, n = re.subn(r'<script src="booklet-data[^"]*"></script>',
                     f'<script src="./{tag}-livret.js"></script>', src)
    if n != 1:
        raise Echec(f"{tag} : {n} référence(s) au livret au lieu d'une")
    src, n = re.subn(r'<script src="guide-data[^"]*"></script>',
                     f'<script src="./{tag}-guide.js"></script>' if avec_guide else "", src)
    src = remplacer_une_fois(src, '<meta charset="utf-8">',
                             '<meta charset="utf-8">' + "\n" + '<meta name="robots" content="index,follow">',
                             "balise charset (extrait)")
    if re.search(r'<script src="(booklet|guide)-data', src):
        raise Echec(f"{tag} : une référence aux données complètes subsiste")

    # Une page GRATUITE ne se verrouille pas. Elle héritait pourtant du calque
    # « Livret verrouillé » et de son `tryUnlock()` codé en dur : le visiteur
    # tombait sur une demande de code pour consulter… l'extrait offert, et la
    # page publiait au passage 'VERITAS2026', qui n'ouvre plus rien.
    # Toutes les pages libres ne sont pas verrouillées : « Feuilletage 4e » est
    # un aperçu commercial, il n'a jamais eu de calque. On neutralise s'il y en
    # a un, on ne l'exige pas — mais AUCUN code de démonstration ne doit rester.
    src = re.sub(
        r"let (unl|u)=false; try\{ \1=localStorage\.getItem\(this\.LU\)==='1'; \}catch\(e\)\{\}",
        r"let \1=true;  /* extrait gratuit : aucun verrou */",
        src,
    )
    if re.search(r"\btryUnlock\s*\(\s*\)\s*\{", src):
        src = remplacer_methode(
            src, "tryUnlock",
            "tryUnlock(){ /* extrait gratuit : rien à déverrouiller */ }",
            "VERITAS2026",
        )
    if "VERITAS2026" in src or "PROF2026" in src:
        raise Echec(f"{tag} : un code de démonstration subsiste dans la page")
    return src


def transformer(src: str, classe: str, kind: str, ver: str) -> str:
    """Applique le verrou serveur à une coquille .dc.html."""
    # 1. Le contenu ne part plus avec la page.
    src, n = re.subn(r'[ \t]*<script src="(?:booklet-data|guide-data)[^"]*"></script>\n?', "", src)
    if n == 0:
        raise Echec("aucune balise de données trouvée — la page a-t-elle déjà été traitée ?")

    # 2. La porte cliente, en tête (avant le bloc dc, qui s'exécute au chargement).
    src = remplacer_une_fois(
        src,
        '<script src="./support.js"></script>',
        f'<script src="/livrets/gate.js?v={ver}"></script>\n<script src="./support.js"></script>',
        "balise support.js",
    )

    # 3. En-têtes de sécurité + interdiction d'indexation (ces pages sont payantes).
    src = remplacer_une_fois(src, '<meta charset="utf-8">', '<meta charset="utf-8">\n' + META, "balise charset")

    # 4. Configuration de la porte : classe et nature sont figées dans la page,
    #    mais le serveur ne s'y fie pas — le jeton porte les siennes.
    titre = f"Livret {LIBELLE[classe]}" if kind == "livret" else f"Guide enseignant {LIBELLE[classe]}"
    src = remplacer_une_fois(
        src,
        "<body>",
        "<body>\n<script>VRTLivret.config({classe:'%s',kind:'%s',titre:'%s'});</script>" % (classe, kind, titre),
        "balise body",
    )

    # 5. Plus de déverrouillage local : un état dans localStorage ne prouve rien.
    avant = src
    src = re.sub(
        r"let (unl|u)=false; try\{ \1=localStorage\.getItem\(this\.LU\)==='1'; \}catch\(e\)\{\}",
        r"let \1=false; /* le déverrouillage est vérifié par le serveur, pas par le navigateur */",
        src,
    )
    if src == avant:
        raise Echec("état de déverrouillage local introuvable (constructeur modifié ?)")

    # 6. Les deux méthodes de la porte.
    src = remplacer_methode(src, "componentDidMount", DIDMOUNT, "forceUpdate")
    src = remplacer_methode(src, "tryUnlock", TRYUNLOCK, "VERITAS2026" if kind == "livret" else "PROF2026")

    # 7. Message d'erreur : celui du serveur (« code expiré », « déjà utilisé
    #    sur un autre appareil »…) plutôt qu'un « Code incorrect » toujours faux.
    for texte in ("'Code incorrect. Réessaie.'", "'Code incorrect.'"):
        if texte in src:
            src = src.replace(
                texte,
                "(typeof this.state.err==='string'?this.state.err:'Code incorrect. Réessaie.')",
                1,
            )
            break
    else:
        raise Echec("message d'erreur du calque introuvable")

    # 8. L'indice publiait le code. On met l'achat à la place.
    indice = re.search(
        r"h\('div',\{key:'h',style:\{fontSize:'11px',color:'#98a1aa',marginTop:'12px'\}\},"
        r"'Démo : tape (?:VERITAS2026|PROF2026)'\)",
        src,
    )
    if not indice:
        raise Echec("l'indice « Démo : tape … » n'a pas la forme attendue")
    src = src[: indice.start()] + bouton_achat(classe, kind) + src[indice.end():]

    # 9. Le lien « Se procurer le livret » ouvre le tunnel d'achat sur place.
    src = re.sub(
        r"h\('a',\{href:'https://www\.veritas-school\.com',style:\{color:'#2b8ac6',fontWeight:700\}\},'Se procurer le livret'\)",
        "h('a',{href:'#',onClick:(e)=>{e.preventDefault();VRTLivret.acheter();},"
        "style:{color:'#2b8ac6',fontWeight:700}},'Se procurer le livret')",
        src,
    )

    # 10. Garde-fous : rien de tout cela ne doit subsister.
    for interdit in ("VERITAS2026", "PROF2026", "booklet-data", "guide-data"):
        if interdit in src:
            raise Echec(f"« {interdit} » subsiste dans la page produite")
    return src


def main() -> int:
    ap = argparse.ArgumentParser(description="Construit livrets/ sous verrou serveur.")
    ap.add_argument("--src", default=str(SRC_DEFAUT), help="dossier des .dc.html")
    ap.add_argument("--copie", default="", help="dossier où préparer le dépôt FTP des données")
    args = ap.parse_args()

    src_dir = Path(args.src)
    if not src_dir.is_dir():
        print(f"✗ Source introuvable : {src_dir}", file=sys.stderr)
        return 2

    SORTIE.mkdir(parents=True, exist_ok=True)

    # Version = empreinte de la porte cliente : une correction de gate.js change
    # l'URL, donc contourne le cache (leçon des assets servis « immutable »).
    gate = RACINE / "livrets" / "gate.js"
    if not gate.is_file():
        print("✗ livrets/gate.js manquant", file=sys.stderr)
        return 2
    ver = hashlib.sha256(gate.read_bytes()).hexdigest()[:8]
    collab = RACINE / "livrets" / "collab.js"
    verc = hashlib.sha256(collab.read_bytes()).hexdigest()[:8] if collab.is_file() else ver

    faits, erreurs = [], []

    for classe, (f_livret, f_guide, _, _) in CLASSES.items():
        for kind, nom_src, nom_out in (
            ("livret", f_livret, f"{classe}.html"),
            ("guide", f_guide, f"guide-{classe}.html"),
        ):
            p = src_dir / nom_src
            if not p.is_file():
                erreurs.append(f"{nom_src} : absent de la source")
                continue
            try:
                out = transformer(p.read_text(encoding="utf-8"), classe, kind, ver)
            except Echec as e:
                erreurs.append(f"{nom_src} : {e}")
                continue
            (SORTIE / nom_out).write_text(out, encoding="utf-8")
            faits.append(f"livrets/{nom_out}")

    # Pages libres sans données : copie telle quelle.
    for nom_src, nom_out in LIBRES.items():
        p = src_dir / nom_src
        if p.is_file():
            shutil.copyfile(p, SORTIE / nom_out)
            faits.append(f"livrets/{nom_out}  (libre)")

    # Pages d'appel (démo, feuilletage) : on leur fabrique un VRAI extrait.
    for nom_src, (nom_out, f_livret, f_guide) in EXTRAITS.items():
        p = src_dir / nom_src
        if not p.is_file():
            erreurs.append(f"{nom_src} : absent de la source")
            continue
        tag = nom_out.replace(".html", "")
        try:
            fichiers = extraire(src_dir, f_livret, f_guide, SORTIE, tag)
            (SORTIE / nom_out).write_text(
                page_extrait(p.read_text(encoding="utf-8"), tag, bool(f_guide)), encoding="utf-8")
        except Exception as e:
            erreurs.append(f"{nom_src} : {e}")
            continue
        poids = sum((SORTIE / f).stat().st_size for f in fichiers)
        entier = (src_dir / f_livret).stat().st_size + ((src_dir / f_guide).stat().st_size if f_guide else 0)
        faits.append(f"livrets/{nom_out}  (extrait libre : {poids // 1024} Ko au lieu de {entier // 1024} Ko)")
        for f in fichiers:
            faits.append(f"livrets/{f}")
    sup = src_dir / "support.js"
    if sup.is_file():
        shutil.copyfile(sup, SORTIE / "support.js")
        faits.append("livrets/support.js")
    else:
        erreurs.append("support.js absent de la source (les pages ne s'afficheront pas)")

    # Dépôt FTP des données : renommage vers la convention attendue par le serveur.
    if args.copie:
        cible = Path(args.copie)
        cible.mkdir(parents=True, exist_ok=True)
        for classe, (_, _, d_livret, d_guide) in CLASSES.items():
            for nom_src, nom_out in ((d_livret, f"booklet-{classe}.js"), (d_guide, f"guide-{classe}.js")):
                p = src_dir / nom_src
                if p.is_file():
                    shutil.copyfile(p, cible / nom_out)
                    faits.append(f"{cible / nom_out}  (à téléverser)")
                else:
                    erreurs.append(f"{nom_src} : absent — {nom_out} ne sera pas déposé")

    # ── Cache-buster des pages ecrites a la main ─────────────────────────────
    # d/index.html et livrets/prof.html referencent gate.js avec un ?v= EN DUR.
    # Sans ce reetiquetage, une correction de la porte cliente ne parvient jamais
    # aux visiteurs de retour : l'URL n'a pas change, le navigateur garde
    # l'ancienne. C'est la lecon des assets servis « immutable » un an.
    for cible in (RACINE / "d" / "index.html", RACINE / "livrets" / "prof.html"):
        if not cible.is_file():
            erreurs.append(f"{cible.name} : absent — gate.js n'y sera pas reetiquete")
            continue
        avant = cible.read_text(encoding="utf-8")
        apres = re.sub(r'(/livrets/gate\.js\?v=)[0-9a-f]+', r"\g<1>" + ver, avant)
        apres = re.sub(r'(/livrets/collab\.js\?v=)[0-9a-f.]+', r"\g<1>" + verc, apres)
        if apres != avant:
            cible.write_text(apres, encoding="utf-8")
            faits.append(f"{cible.relative_to(RACINE).as_posix()}  (cache-buster remis a jour)")

    for f in faits:
        print("  ✓", f)
    if erreurs:
        print("\n✗ ARRÊT — rien n'est publié tant que ceci n'est pas réglé :", file=sys.stderr)
        for e in erreurs:
            print("   -", e, file=sys.stderr)
        return 1
    print(f"\n✓ {len(faits)} fichiers produits — gate.js v{ver}")
    print("  Les données (booklet-*.js / guide-*.js) ne sont JAMAIS versionnées :")
    print("  dépôt FTP dans uploads/protected/livrets/ (voir son LISEZMOI.txt).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
