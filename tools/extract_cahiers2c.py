# -*- coding: utf-8 -*-
"""extract_cahiers2c.py — ossature des NOUVEAUX cahiers du 2nd cycle (version du 24/09/2026).

Pourquoi un nouvel extracteur, et pas `extract_bord2.py` ?
    `extract_bord2.py` lit les anciens « Bord » (masters manuscrits sans styles, repérés
    par émojis) ; ses identifiants `tle-m1-l1-n1`… alimentent des pages DÉJÀ EN LIGNE
    (`corriges/tle/cahier-*.html`). Les nouveaux cahiers sont d'autres livres : autres
    leçons, autres textes, autre numérotation. Les relire avec l'ancien outil aurait
    décalé tous les identifiants et rattaché les anciens corrigés à de nouvelles
    questions — en silence. On garde donc l'ancien outil intact et on lit les nouveaux
    cahiers ici, sous des clés de niveau NOUVELLES :

        tle-a   Tle_A_Cahier_eleve_FINAL.docx
        tle-cd  Tle_CD_Cahier_eleve_FINAL.docx
        1ere-a  1ere_A_Cahier_eleve_FINAL.docx
        1ere-cd 1ere_CD_Cahier_eleve_FINAL.docx

Ces cahiers portent des styles Word fiables (produits par la chaîne de fabrication) :
T_Part / T_Seq / T_Comp / T_Sem / T_Disc / Objectif / Corpus / Texte_Titre / Texte /
Source / Rubrique / Question / Exercice / VersLeBac / Consigne / Retient_* …

Sortie : `_bord_extract/{niv}.json`, même schéma que `extract_bord2.py` (module →
leçon → items, identifiant stable `{niv}-mM-lL-nN`, module 0 = diagnostic), plus :
    • `ctx`  : le contexte de chaque item (texte support le plus proche), pour rédiger ;
    • `twin` : l'identifiant d'un item IDENTIQUE (même énoncé, même texte support) dans
               un cahier traité avant (ordre : tle-a, tle-cd, 1ere-a, 1ere-cd). La série
               C-D reprend nombre de leçons de la série A : le corrigé n'est rédigé
               qu'une fois, et `build_corriges_2c.py` le réutilise pour le jumeau.

Le texte d'auteur reste dans le JSON (indispensable pour corriger) et n'est JAMAIS publié.

Usage : python tools/extract_cahiers2c.py
"""
import os, re, sys, io, json, hashlib
from collections import OrderedDict, Counter

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

from docx import Document
from docx.oxml.ns import qn
from docx.table import Table
from docx.text.paragraph import Paragraph

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "_bord_extract")
SRC = r"C:\Users\Mythe Errant\Desktop\Manuels\CAHIERS_ELEVE_6e-Tle_VERSIONS_FINALES"

CAHIERS = OrderedDict([
    ("tle-a",   "Tle_A_Cahier_eleve_FINAL.docx"),
    ("tle-cd",  "Tle_CD_Cahier_eleve_FINAL.docx"),
    ("1ere-a",  "1ere_A_Cahier_eleve_FINAL.docx"),
    ("1ere-cd", "1ere_CD_Cahier_eleve_FINAL.docx"),
    # 1er cycle : nouveau « cahier d'activités » (03/10/2026), qui remplace le « Bord ».
    # Clé distincte de « 3e » (anciennes pages corriges/3e/cahier-module-*.html).
    ("3e-cahier", r"C:\Users\Mythe Errant\Desktop\Manuels\CAHIERS_ELEVE_6e-Tle_VERSIONS_FINALES\3e_Cahier_eleve_FINAL.docx"),
])
PREMIER_CYCLE = ("3e-cahier",)

DOTS = re.compile(r"…{2,}|\.{5,}")
NUMQ = re.compile(r"^(\d{1,2})\s*(?:[.)/]|-(?!\d))\s*(?=\D)")
RE_EXO = re.compile(r"^\W*Exercice\s*(\d*)\s*(\([^)]*\))?\s*[:.]?", re.I)
RE_SEQ = re.compile(r"(?:S[ÉE]QUENCE|MODULE)\s+(\d+)", re.I)
RE_SEM = re.compile(r"^\W*Semaine\s*\d+", re.I)
# 1er cycle : tâche de production posée en style « Corps » (expression écrite)
RE_PROD = re.compile(r"^\W*(Raconte|Rédige|Écris|Imagine|Compose|Produis|Décris|Présente|"
                     r"Dramatise|Prépare|Organise|Transforme)\b")

# Items d'auto-évaluation : rien à corriger (l'élève se juge lui-même).
AUTO = re.compile(
    r"(j['’]ai réussi|mes points forts|ce que je dois améliorer|je me fixe|coche la case|"
    r"reprends l['’]exercice qui t['’]a semblé|réécris ta production en corrigeant|"
    r"je m['’]auto-?évalue|auto-évaluation|□|la correction se fait en classe)", re.I)
# Consignes qui ne sont que des lignes d'écriture (la tâche a déjà été posée).
MISE_AU_PROPRE = re.compile(r"(au propre sur les lignes|recopie ton plan détaillé au propre)", re.I)


def n(s):
    return " ".join((s or "").replace("\u00a0", " ").split())


def sha(s):
    return hashlib.sha1((s or "").encode("utf-8")).hexdigest()[:10]


def blocs(doc):
    for child in doc.element.body.iterchildren():
        if child.tag == qn("w:p"):
            yield Paragraph(child, doc)
        elif child.tag == qn("w:tbl"):
            yield Table(child, doc)


def texte_table(t):
    lignes = []
    for row in t.rows:
        vus, cel = set(), []
        for c in row.cells:
            if id(c._tc) in vus:
                continue
            vus.add(id(c._tc))
            cel.append(n(c.text))
        lignes.append(" | ".join(cel))
    return " // ".join(l for l in lignes if l.strip(" |"))


def propre(t):
    t = DOTS.sub(" … ", t or "")
    return re.sub(r"\s{2,}", " ", t).strip()


class Cahier:
    def __init__(self, niv):
        self.niv = niv
        self.modules = []
        self.stats = Counter()

    def module(self, num, titre):
        m = dict(n=num, titre=titre, comp="", lecons=[])
        self.modules.append(m)
        return m

    def cur_module(self):
        if not self.modules:
            self.module(0, "Évaluation diagnostique")
        return self.modules[-1]

    def lecon(self, titre, semaine):
        m = self.cur_module()
        l = dict(n=len(m["lecons"]) + 1, titre=titre, objectif="", semaine=semaine,
                 texte=[], source="", items=[])
        m["lecons"].append(l)
        return l

    def cur_lecon(self, semaine):
        m = self.cur_module()
        if not m["lecons"]:
            self.lecon(m["titre"], semaine)
        return m["lecons"][-1]

    def item(self, l, txt, kind, rub, num, style, mod=None):
        m = mod or self.cur_module()
        it = dict(id="%s-m%d-l%d-n%d" % (self.niv, m["n"], l["n"], len(l["items"]) + 1),
                  rub=rub or "", kind=kind, txt=txt, num=num, style=style,
                  ctx=len(l["texte"]))           # position dans le texte de la leçon
        l["items"].append(it)
        self.stats[kind] += 1
        return it


def extract(niv, path):
    doc = Document(path)
    c = Cahier(niv)
    semaine = rub = None
    dans_retiens = False
    for b in blocs(doc):
        if isinstance(b, Table):
            t = texte_table(b)
            if t and c.modules:
                l = c.cur_lecon(semaine)
                l["texte"].append("[TABLEAU] " + t)
                # 1er cycle : grille de lecture méthodique (Axes | Outils | Passages |
                # Interprétation). Chaque ligne dont l'interprétation est à écrire est un
                # item ; on ne corrige que cette colonne.
                if niv in PREMIER_CYCLE:
                    lignes = [[n(x.text) for x in row.cells] for row in b.rows]
                    if lignes and "interpr" in " ".join(lignes[0]).lower():
                        k = 0
                        for cel in lignes[1:]:
                            if cel and (not cel[-1] or not re.sub(r"[…\.\s]", "", cel[-1])):
                                k += 1
                                c.item(l, " | ".join(cel[:-1]), "grille", rub,
                                       "Relevé %d" % k, "Table")
            continue
        st = b.style.name if b.style is not None else ""
        t = n(b.text)
        if not t or st in ("Reponse", "Cahier") or st.startswith("toc") \
                or st in ("T_Title", "T_Sub"):
            continue
        if st == "T_Part":
            if "diagnostique" in t.lower():
                c.module(0, "Évaluation diagnostique")
                semaine = rub = None
            continue
        if st == "T_Seq":
            # Tle : « SÉQUENCE 1 » puis T_Comp. 1ʳᵉ A : le T_Seq porte directement la
            # compétence, sans numéro — on compte les séquences.
            m = RE_SEQ.search(t)
            k = int(m.group(1)) if m else 1 + sum(1 for x in c.modules if x["n"] > 0)
            c.module(k, t if t.upper().startswith("MODULE") else "SÉQUENCE %d" % k)
            if not m:
                c.cur_module()["comp"] = t
            semaine = rub = None
            continue
        if st == "T_Comp":
            c.cur_module()["comp"] = t
            continue
        if st == "T_Sem":
            semaine = re.sub(r"^\W+", "", t).strip()
            rub = None
            continue
        if st == "T_Disc" and RE_SEM.match(t):           # 1er cycle : « Semaine 5 : Évaluation… »
            semaine = re.sub(r"^\W+", "", t).strip()
            rub = None
            continue
        if st == "T_Disc":
            # Texte du diagnostic imprimé AVANT la première rubrique (1ʳᵉ A) : la leçon
            # ouverte pour le recueillir prend le nom de cette rubrique, sans décaler les ids.
            m0 = c.modules[-1] if c.modules else None
            if m0 and len(m0["lecons"]) == 1 and m0["lecons"][0].get("_pre")                     and not m0["lecons"][0]["items"]:
                m0["lecons"][0]["titre"] = t
                m0["lecons"][0].pop("_pre")
            else:
                c.lecon(t, semaine)
            rub = None; dans_retiens = False
            continue
        if not c.modules:
            # Diagnostic dont le titre « Évaluation diagnostique » est dans une zone de
            # texte (invisible ici) : l'objectif de la page signale le début du cahier.
            if st == "Objectif" and "capable" in t:
                c.module(0, "Évaluation diagnostique")
                c.cur_lecon(semaine)["_pre"] = True
            else:
                continue                                 # page de garde, sommaire
        if st == "Corps" and RE_SEM.match(t) and niv in PREMIER_CYCLE:
            semaine = re.sub(r"^\W+", "", t).strip()
            rub = None
            continue
        l = c.cur_lecon(semaine)
        if niv in PREMIER_CYCLE:
            # Le 1er cycle range des consignes hors du style « Question » :
            # — productions écrites (« ✍️ Production écrite : … », bilan de lecture à
            #   rédiger, « Raconte… ») — même au milieu d'un « Je retiens » ;
            if re.match(r"^\W*(Production écrite|Je rédige)\b", t) or \
                    (st == "Corps" and RE_PROD.match(t) and not dans_retiens):
                c.item(l, propre(t), "prod", rub, None, st)
                continue
            # — questions numérotées « 3- … » ou à tiret « - Lis… », « Selon toi… ».
            if st == "Corps" and not dans_retiens and (
                    re.match(r"^\d+\s*[-.]\s*[A-ZÀ-Ý]", t) or
                    re.match(r"^-\s*(Lis|Que|Qu['’]|Quels?|Quelles?|Comment|Pourquoi|Relève|Dis|"
                             r"Sers-toi|Donne|Cite|Explique|Précise|Identifie|Observe|Définis)\b", t) or
                    re.match(r"^Selon toi\b", t)):
                mm = re.match(r"^(\d+)", t)
                c.item(l, propre(t), "q", rub, mm.group(1) if mm else None, st)
                continue
        if st == "Objectif":
            l["objectif"] = t
            continue
        if st == "Rubrique":
            rub = t; dans_retiens = False
            continue
        if st == "Retient_Titre":
            dans_retiens = True
            l["texte"].append("[JE RETIENS] " + t)
            continue
        if st == "Source":
            l["source"] = t
            l["texte"].append("[SOURCE] " + t)
            continue
        if st == "Corpus":
            dans_retiens = False
            l["texte"].append("[CORPUS] " + t)
            continue
        if st == "Question":
            num = None
            m = NUMQ.match(t)
            if m:
                num = m.group(1)
            kind = "auto" if AUTO.search(t) else "q"
            c.item(l, propre(t), kind, rub, num, st)
            continue
        if st == "Exercice":
            m = RE_EXO.match(t)
            num = ("Exercice %s" % m.group(1)) if (m and m.group(1)) else "Exercice"
            if m and m.group(2):
                num += " " + m.group(2)
            kind = "auto" if AUTO.search(t) else "exo"
            c.item(l, propre(t), kind, rub, num, st)
            continue
        if st == "VersLeBac":
            haut = t.upper()[:40]
            c.item(l, propre(t), "bac", rub, "Vers le BAC" if "BAC" in haut else
                   "Vers le BEPC" if "BEPC" in haut else "Vers le Probatoire", st)
            continue
        if st == "Consigne":
            if MISE_AU_PROPRE.search(t):
                l["texte"].append("[CONSIGNE-PROPRE] " + t)
                continue
            l["texte"].append("[CONSIGNE] " + t)
            l.setdefault("consignes", []).append((t, rub, len(l["texte"]) - 1))
            continue
        # Lignes à trous hors « Je retiens » (canevas guidés, sous-centres à compléter)
        if not dans_retiens and DOTS.search(t) and len(propre(t).strip(" …•")) > 12 \
                and st in ("Liste1", "Corps", "List Paragraph", "Normal", "Body Text",
                           "Texte du corps"):
            c.item(l, propre(t), "trou", rub, None, st)
            continue
        if dans_retiens or st in ("Retient_Corps", "Definition"):
            l["texte"].append("[RETIENS] " + t)
            continue
        tag = {"Texte": "", "Texte_Titre": "[TITRE] ", "Corps": "[CORPS] ",
               "Outil": "[OUTIL] ", "Astuce": "[ASTUCE] ", "Savais": "[SAVAIS] ",
               "Lexique": "[LEXIQUE] ", "Liste1": "[LISTE] "}.get(st, "[%s] " % st)
        l["texte"].append(tag + t)

    # Épreuves et sujets sans question numérotée : la consigne EST l'item.
    for m in c.modules:
        for l in m["lecons"]:
            reel = [i for i in l["items"] if i["kind"] != "auto"]
            if reel:
                # Consigne de contraction posée À CÔTÉ d'une question (épreuve « résumé +
                # discussion ») : c'est une tâche à part entière, elle reçoit son item.
                for t, rub, pos in l.get("consignes", []):
                    if re.search(r"Résume-le|Analyse-le|Résumez|Analysez", t):
                        it = c.item(l, propre(t), "sujet", rub, "Sujet", "Consigne", mod=m)
                        it["ctx"] = pos
                continue
            for t, rub, pos in l.get("consignes", []):
                if re.match(r"^\W*(Sujet|Consigne|Texte\s*:)", t) and not t.startswith("Texte :"):
                    it = c.item(l, propre(t), "sujet", rub, "Sujet", "Consigne", mod=m)
                    it["ctx"] = pos
            # Épreuve dont le sujet est imprimé dans un autre style (Retient_Corps,
            # Corps…) : on le reconnaît à son verbe de consigne.
            if not [i for i in l["items"] if i["kind"] != "auto"] and \
                    re.search(r"Épreuve|Sujet|Tâche|Production", l["titre"]):
                for pos, t in enumerate(l["texte"]):
                    corps = re.sub(r"^\[[A-Z -]+\]\s*", "", t)
                    if re.search(r"(Justifiez|Discutez|Commentez|Partagez-vous|pensez-vous|"
                                 r"Vous ferez|Vous répondrez|Vous expliquerez|Vous résumerez|"
                                 r"Résumez|Expliquez|Montrez|Qu['’]en pensez-vous|"
                                 r"Recopie-le en corrigeant)", corps, re.I):
                        it = c.item(l, propre(corps), "sujet", None, "Sujet", "texte", mod=m)
                        it["ctx"] = pos
            # 1er cycle : grille de lecture suivie imprimée dans le style « Texte »
            # (« 1- Indique la position de ce texte… ») — leçon sans aucun item sinon.
            if c.niv in PREMIER_CYCLE and not l["items"]:
                for pos, t in enumerate(l["texte"]):
                    mm = re.match(r"^(\d+)\s*-\s*(?=[A-ZÀ-Ý])", t)
                    if mm:
                        it = c.item(l, propre(t), "q", None, mm.group(1), "Texte", mod=m)
                        it["ctx"] = pos
            l.pop("consignes", None)
        for l in m["lecons"]:
            l.pop("consignes", None)
    return c


def libelle(comp):
    """« Compétence attendue : À la fin de la séquence, l'élève bâtira un plan… » → « Bâtir un plan… »."""
    c = re.sub(r"^\W*Comp[ée]tence attendue\s*:\s*", "", comp or "")
    c = re.sub(r"^(?:À|A)\s+la\s+fin\s+de\s+la\s+séquence\s*,?\s*", "", c, flags=re.I)
    c = re.sub(r"^l['’]\s*(?:élève|apprenant)\s+", "", c, flags=re.I).strip(" .")
    for fut, inf in (("produira", "Produire"), ("bâtira", "Bâtir"), ("élaborera", "Élaborer"),
                     ("rédigera", "Rédiger"), ("lira", "Lire"), ("analysera", "Analyser")):
        if c.lower().startswith(fut):
            c = inf + c[len(fut):]
            break
    return c[:1].upper() + c[1:]


def cle(it, l):
    """Empreinte d'un item : énoncé + titre de leçon (sans son numéro) + texte support.

    Le titre compte : « Écris la règle que tu dois retenir de cette séquence » se répète
    mot pour mot dans chaque remédiation, sans texte support — mais la règle attendue
    n'est pas la même d'une séquence à l'autre."""
    texte = "\n".join(l["texte"])
    # Le titre ne départage que les leçons sans texte support (remédiations, contrôles) :
    # ailleurs le texte suffit, et la série C-D renumérote ou rebaptise ses leçons.
    titre = re.sub(r"^\s*Leçon\s+\d+\s*·\s*", "", l["titre"]) if len(texte) < 200 else ""
    return sha(it["txt"] + "§" + titre + "§" + texte)


def main():
    os.makedirs(OUT, exist_ok=True)
    vus = {}                     # empreinte → id du premier item rencontré
    total = Counter()
    for niv, fn in CAHIERS.items():
        path = os.path.join(SRC, fn)
        c = extract(niv, path)
        for m in c.modules:
            m["lecons"] = [l for l in m["lecons"] if l["items"] or l["texte"]]
            if m["comp"] and not m["titre"].upper().startswith("MODULE"):
                m["titre"] = "%s — %s" % (m["titre"], libelle(m["comp"]))
        jum = 0
        for m in c.modules:
            for l in m["lecons"]:
                for it in l["items"]:
                    k = cle(it, l)
                    it["hash"] = k
                    if k in vus and vus[k] != it["id"]:
                        it["twin"] = vus[k]; jum += 1
                    else:
                        vus.setdefault(k, it["id"])
        with open(os.path.join(OUT, "%s.json" % niv), "w", encoding="utf-8") as f:
            json.dump(dict(niveau=niv, fichier=fn, modules=c.modules), f,
                      ensure_ascii=False, indent=1)
        a_corriger = sum(1 for m in c.modules for l in m["lecons"] for i in l["items"]
                         if i["kind"] != "auto")
        print("── %s (%s)" % (niv, fn))
        for m in c.modules:
            ni = sum(len(l["items"]) for l in m["lecons"])
            na = sum(1 for l in m["lecons"] for i in l["items"] if i["kind"] == "auto")
            nt = sum(1 for l in m["lecons"] for i in l["items"] if i.get("twin"))
            print("   M%d %3d leçons %4d items (%d auto, %d jumeaux)  %s"
                  % (m["n"], len(m["lecons"]), ni, na, nt, m["titre"][:60]))
        print("   → %d items à corriger, dont %d jumeaux déjà traités ailleurs  %s\n"
              % (a_corriger, jum, dict(c.stats)))
        total[niv] = a_corriger


if __name__ == "__main__":
    main()
