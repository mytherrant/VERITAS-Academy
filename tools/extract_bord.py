# -*- coding: utf-8 -*-
"""extract_bord.py — extrait la structure des CAHIERS de français du 1er cycle.

Les « Bord » (Mon Cahier de français 6ᵉ→3ᵉ) sont les cahiers de l'élève : ils ne
contiennent QUE des énoncés, sans corrigés (à l'exception des évaluations
diagnostiques, déjà corrigées dans le cahier). Les corrigés en ligne existants
(`corriges/{niv}/sequence-N.html`) viennent des **Guides** et portent sur les
**livrets d'activités** : recouvrement mesuré avec les cahiers = 0 %.

Ce script produit l'ossature qui sert (1) à rédiger les corrigés du cahier et
(2) à générer les pages publiques :

    _bord_extract/{niv}.json   module → semaine → leçon → rubrique → items

Chaque item reçoit un identifiant stable `{niv}-mM-lL-nN` et une empreinte du
texte : si le cahier est réédité, l'empreinte change et le corrigé rédigé pour
cet item est signalé comme « à revoir » plutôt que réattribué en silence.

Le texte d'auteur est conservé dans le JSON (il est indispensable pour rédiger les
corrigés) mais n'est JAMAIS publié : cf. tools/build_corriges.py.

Usage : python tools/extract_bord.py
"""
import os, re, sys, io, json, hashlib
from collections import OrderedDict, Counter

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

try:
    from docx import Document
except ImportError:
    print("!! python-docx requis : pip install python-docx"); sys.exit(1)

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "_bord_extract")
FIN1 = r"C:\Users\Mythe Errant\Desktop\Manuels\FINAUX_1er_cycle"

CAHIERS = OrderedDict([
    ("6e", "6e_Bord_cahier_de_francais.docx"),
    ("5e", "5e_Bord_cahier_de_francais.docx"),
    ("4e", "BORD 4e vrai.docx"),
    ("3e", "3e_Bord_cahier_de_francais.docx"),
])

# ─────────────────────────────────────────────────────── reconnaissance des lignes
POINTILLES = re.compile(r"^[\s…\.·_]+$")
DOTS = re.compile(r"[…]{2,}|\.{6,}")
NUM = re.compile(r"^(\d{1,2})\s*[°.)\-–]\s*")
PUCE = re.compile(r"^[-•‣–]\s*")
SEMAINE = re.compile(r"^\s*(?:👉\s*)?Semaine\s*(\d+)", re.I)
LECON_N = re.compile(r"^\s*Leçon\s*:?\s*(\d+)?", re.I)
# une ligne de Normal/Corps qui introduit une leçon dans le cahier de 4ᵉ
LECON_LIB = re.compile(r"(Lecture\s+(?:suivie|méthodique)|Grammaire|Orthographe|Conjugaison|"
                       r"Vocabulaire|Expression\s+(?:écrite|orale)|Production\s+(?:écrite|orale)|"
                       r"Évaluation|Integration|Intégration|Auto-évaluation)", re.I)
RUB_LIB = re.compile(r"^\s*(?:[^\w\s]{1,3}\s*)?(Découverte|Traitement|Confrontation|Synthèse|"
                     r"Observation|Analyse|Bilan|Prolongement|Consolidation|Évaluation|Retenons|"
                     r"Application|Exercice)", re.I)
CORRIGE_TITRE = re.compile(r"corrig[ée]", re.I)
AUTO = re.compile(r"(auto[- ]?évaluation|j'ai réussi|mes points forts|je dois améliorer|"
                  r"je me fixe un objectif|coche la case)", re.I)
PROD = re.compile(r"^\s*(?:🔹\s*)?(Sujet\s*\d|Consigne|Rédige|Raconte|Imagine|Écris|Produis|"
                  r"Compose|Présente|Décris|Rédaction)", re.I)
AXE = re.compile(r"^\s*Axe\s*\d", re.I)
CORPUS = re.compile(r"^\s*(?:[^\w\s]{1,3}\s*)?Corpus\b", re.I)
# Un énoncé non interrogatif commence par un verbe à l'impératif (2e pers. du sing.) :
# c'est ce qui sépare « 2. Relève les verbes… » (exercice) de « 2. La phrase impérative :
# elle contient… » (contenu de leçon numéroté, à ne pas prendre pour une question).
IMPER = re.compile(
    r"^(relève|relie|souligne|encadre|écris|écrit|donne|complète|classe|transforme|recopie|"
    r"conjugue|mets|met|réécris|indique|justifie|explique|trouve|emploie|remplace|coche|"
    r"choisis|construis|propose|analyse|compare|cite|nomme|précise|ajoute|barre|sépare|"
    r"range|utilise|rédige|imagine|raconte|observe|lis|dis|forme|accorde|corrige|associe|"
    r"remets|réponds|identifie|repère|distingue|rappelle|résume|reformule|traduis|"
    r"transpose|décris|présente|dresse|établis|montre|démontre|illustre|développe|"
    r"rature|entoure|numérote|complete|ordonne|reconstitue|schématise|joue|mime|débats?)\b",
    re.I)

STYLES_TEXTE = {"Texte", "Texte_Titre", "Source", "Corpus", "Lexique"}
STYLES_LECON = {"Retient_Titre", "Retient_Corps", "Outil", "Astuce", "Savais", "Definition",
                "Repere", "Jouer", "T_Comp", "Objectif", "Bilan", "VersLeBac"}
STYLES_ITEM = {"Question", "Exercice", "Reponse", "Consigne"}
STYLES_SOL = {"Liste1", "List Paragraph"}


def sha(s):
    return hashlib.sha1((s or "").encode("utf-8")).hexdigest()[:8]


def propre(t):
    """Retire les pointillés de réponse : l'élève écrit dessus, ils ne servent à rien ici."""
    t = DOTS.sub(" ", t or "")
    t = re.sub(r"\s{2,}", " ", t)
    return t.strip(" .·…_-\t")


def est_question(t):
    """Une ligne de Corps/Normal est-elle un énoncé ?

    Trois signaux, et eux seuls : l'élève doit écrire dessous (pointillés), la ligne
    interroge (« ? »), ou elle commande (verbe à l'impératif, éventuellement précédé
    d'un numéro). Une ligne seulement numérotée ne suffit pas : les leçons « Je
    retiens » numérotent elles aussi leurs paragraphes.
    """
    c = propre(t)
    if len(c) < 8:
        return False
    if DOTS.search(t or "") or "?" in c:
        return True
    if PROD.match(c):
        return True
    return bool(IMPER.match(NUM.sub("", c)))


class Cahier:
    def __init__(self, niv, fichier):
        self.niv, self.fichier = niv, fichier
        self.modules = []          # [{n, titre, comp, lecons:[...]}]
        self.stats = Counter()

    # ── ossature
    def module(self, titre):
        n = len(self.modules) + (0 if self.modules and self.modules[0]["n"] == 0 else 1)
        m = dict(n=n, titre=titre, comp="", lecons=[])
        self.modules.append(m)
        return m

    def cur_module(self):
        if not self.modules:
            m = dict(n=0, titre="Évaluation diagnostique", comp="", lecons=[])
            self.modules.append(m)
        return self.modules[-1]

    def lecon(self, titre, semaine=None, corrige=False):
        m = self.cur_module()
        l = dict(n=len(m["lecons"]) + 1, titre=titre, objectif="", semaine=semaine,
                 texte=[], source="", lexique="", items=[], corrige_integre=corrige)
        m["lecons"].append(l)
        return l

    def cur_lecon(self, semaine=None):
        m = self.cur_module()
        if not m["lecons"]:
            self.lecon("Ouverture", semaine)
        return m["lecons"][-1]


def extract(niv, fichier):
    doc = Document(os.path.join(FIN1, fichier))
    c = Cahier(niv, fichier)
    semaine = None
    rub = None
    dans_corrige = False        # on traverse un bloc « ✅ Corrigé » déjà présent dans le cahier
    dans_corpus = False         # on traverse le corpus d'observation (des exemples, pas des questions)
    dernier_item = None

    for p in doc.paragraphs:
        st = p.style.name if p.style is not None else "?"
        raw = p.text.strip()
        if not raw or POINTILLES.match(raw):
            continue
        t = re.sub(r"\s{2,}", " ", raw)

        # ── titres de module
        if st in ("T_Seq", "T_Part"):
            c.module(t)
            semaine = rub = None; dans_corrige = dans_corpus = False; dernier_item = None
            continue
        if st == "T_Comp":
            c.cur_module()["comp"] = t
            continue
        # ── semaines
        if st == "T_Sem" or (st in ("Corps", "Normal", "Body Text") and SEMAINE.match(propre(t))):
            semaine = re.sub(r"^\s*👉\s*", "", t)
            continue
        # ── leçons
        if st == "T_Disc" or (st in ("Normal", "Corps") and LECON_LIB.search(t)
                              and len(t) < 110 and not est_question(t) and not PUCE.match(t)):
            if CORRIGE_TITRE.search(t) and len(t) < 70:
                dans_corrige = True
                c.lecon(t, semaine, corrige=True)
            else:
                dans_corrige = False
                c.lecon(t, semaine)
            rub = None; dans_corpus = False; dernier_item = None
            continue
        if st == "Objectif":
            c.cur_lecon(semaine)["objectif"] = t
            continue
        # ── texte d'auteur et encadrés (jamais publiés, mais nécessaires à la rédaction)
        if st in STYLES_TEXTE:
            l = c.cur_lecon(semaine)
            if st == "Source":
                l["source"] = t
            elif st == "Lexique":
                l["lexique"] = t
            else:
                l["texte"].append(t)
            continue
        if st in STYLES_LECON:
            continue
        # ── corpus d'observation : ce sont les exemples que l'élève observe.
        # Ils sont souvent interrogatifs (répliques de dialogue) — sans ce garde-fou,
        # « Et pourquoi tu ne veux pas que je reste ? » passerait pour une question posée.
        if st in ("Corps", "Normal", "Body Text") and CORPUS.match(t):
            dans_corpus = True
            c.cur_lecon(semaine)["texte"].append(t)
            continue
        if dans_corpus and st in ("Corps", "Normal", "Body Text", "standard"):
            c.cur_lecon(semaine)["texte"].append(t)
            continue
        # ── rubriques
        if st == "Rubrique" or (st in ("Normal", "Corps") and RUB_LIB.match(t) and len(t) < 70
                                and not est_question(t)):
            if CORRIGE_TITRE.search(t) and len(t) < 60:
                dans_corrige = True
            rub = t
            dans_corpus = False
            dernier_item = None
            continue

        # ── corrigés déjà présents dans le cahier (évaluations diagnostiques)
        if dans_corrige and st in STYLES_SOL | {"Normal", "Corps", "Liste"}:
            l = c.cur_lecon(semaine)
            if dernier_item is None:
                dernier_item = dict(id="%s-m%d-l%d-n%d" % (niv, c.cur_module()["n"],
                                                           l["n"], len(l["items"]) + 1),
                                    rub=rub, kind="sol", txt="", sol=[], hash="")
                l["items"].append(dernier_item)
            dernier_item["sol"].append(propre(t))
            c.stats["sol_integres"] += 1
            continue

        # ── items (énoncés)
        cand = st in STYLES_ITEM or (st in ("Corps", "Normal", "Body Text", "List Paragraph",
                                            "Liste1", "standard") and est_question(t))
        if not cand:
            # Prose non classée : support d'exercice, consigne filée, texte d'évaluation…
            # On la garde comme contexte de rédaction (jamais publiée) plutôt que de la
            # perdre : sans elle, le conte de l'évaluation diagnostique disparaîtrait.
            c.cur_lecon(semaine)["texte"].append(t)
            continue
        cl = propre(t)
        if len(cl) < 8 or AXE.match(cl):
            continue
        kind = "q"
        if st == "Exercice" or re.match(r"^Exercice", cl, re.I):
            kind = "exo"
        if AUTO.search(cl):
            kind = "auto"
        elif PROD.match(cl) or st == "Consigne":
            kind = "prod"
        l = c.cur_lecon(semaine)
        item = dict(id="%s-m%d-l%d-n%d" % (niv, c.cur_module()["n"], l["n"], len(l["items"]) + 1),
                    rub=rub, kind=kind, txt=cl, sol=[], hash=sha(cl))
        l["items"].append(item)
        dernier_item = item
        c.stats[kind] += 1

    # ── nettoyage : leçons vides
    for m in c.modules:
        m["lecons"] = [l for l in m["lecons"] if l["items"] or l["texte"]]
    c.modules = [m for m in c.modules if m["lecons"]]
    return c


def main():
    os.makedirs(OUT, exist_ok=True)
    grand = Counter()
    print("Inventaire des CAHIERS de français (Bord) — 1er cycle\n")
    for niv, fn in CAHIERS.items():
        c = extract(niv, fn)
        data = dict(niveau=niv, fichier=fn, modules=c.modules)
        with open(os.path.join(OUT, "%s.json" % niv), "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        aq = sum(1 for m in c.modules for l in m["lecons"] for i in l["items"]
                 if i["kind"] in ("q", "exo", "prod"))
        print("── %s  (%s)" % (niv, fn))
        for m in c.modules:
            n_items = sum(len(l["items"]) for l in m["lecons"])
            n_sol = sum(1 for l in m["lecons"] for i in l["items"] if i["kind"] == "sol")
            n_auto = sum(1 for l in m["lecons"] for i in l["items"] if i["kind"] == "auto")
            print("   M%d %-46s %3d leçons %4d items (%d déjà corrigés, %d auto-éval)"
                  % (m["n"], m["titre"][:46], len(m["lecons"]), n_items, n_sol, n_auto))
        print("   → %s : %d items à corriger  %s\n" % (niv, aq, dict(c.stats)))
        grand[niv] = aq
    print("TOTAL à rédiger : %d corrigés  (%s)"
          % (sum(grand.values()), " · ".join("%s %d" % (k, v) for k, v in grand.items())))


if __name__ == "__main__":
    main()
