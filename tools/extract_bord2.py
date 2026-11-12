# -*- coding: utf-8 -*-
"""extract_bord2.py — ossature des CAHIERS de français du 2nd cycle (2ⁿᵈᵉ, 1ʳᵉ, Tˡᵉ A).

Pendant de `extract_bord.py`, qui ne sait lire que les cahiers du 1er cycle : ceux-là
portent des styles Word nommés (T_Seq, T_Disc, Question…), les cahiers du 2nd cycle non.

    • 2ⁿᵈᵉ    → `cahier_2nde_A.html`, rendu d'impression : la structure est dans le balisage
                (`.opener`/`.op-rom`, `.comp`, `.sem`, `.lh-t`, `.q` = `.qn` + `.qa`, `.exo`).
    • 1ʳᵉ/Tˡᵉ → masters manuscrits Word : aucun style utile (tout est « Normal » ou
                « Texte du corps »), mais un balisage par émojis parfaitement régulier —
                👉 Semaine, 📝/📖/📒/🪶/🎤 en tête de leçon, 🎯 Objectif, 📌 Corpus,
                📖/✏️/💡/🔎/🚀 en tête de rubrique, 🧠 Je retiens pour la leçon.

Sortie : `_bord_extract/{2nde,1ere,tle}.json`, même schéma que `extract_bord.py`
(module → leçon → items, identifiant stable `{niv}-mM-lL-nN` + empreinte du texte),
consommé par `build_corriges.py` (fonction `extract_cahier`). Le « module » est ici la
séquence didactique ; le module 0 est l'évaluation diagnostique de rentrée.

Le texte d'auteur est conservé dans le JSON — il est indispensable pour rédiger les
corrigés — mais n'est JAMAIS publié : seuls l'énoncé et le corrigé le sont.

Usage : python tools/extract_bord2.py
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
FIN2 = r"C:\Users\Mythe Errant\Desktop\Manuels\FINAUX_2nd_cycle"

CAHIERS = OrderedDict([
    ("2nde", "cahier_2nde_A.html"),
    ("1ere", "Bord 1ère A - reponses retirees.docx"),
    ("tle",  "Bord_Tle_A_CORRIGE.docx"),
])

ROMAINS = {"I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6, "VII": 7, "VIII": 8}
DOTS = re.compile(r"[…]{2,}|\.{6,}|…\.{3,}|\.{3,}…")
POINTILLES = re.compile(r"^[\s…\.·_]+$")
NUM = re.compile(r"^(\d{1,2})\s*[°.)\-–]\s*")

# Mots interrogatifs de tête : on compare le premier mot, sans expression
# régulière, pour éviter toute ambiguïté d'échappement.
INTERROGATIFS = {"quel", "quelle", "quels", "quelles", "que", "qu", "qui", "comment",
                 "pourquoi", "combien", "où", "quand", "lequel", "laquelle", "auquel",
                 "duquel"}
MOT = re.compile(r"[^\W\d_]+")


def commence_par_interrogatif(c):
    m = MOT.search(c)
    return bool(m) and m.group(0).lower() in INTERROGATIFS


IMPER = re.compile(
    r"^(relève|relie|souligne|encadre|écris|donne|complète|classe|transforme|recopie|"
    r"conjugue|mets|réécris|indique|justifie|explique|trouve|emploie|remplace|coche|"
    r"choisis|construis|propose|analyse|compare|cite|nomme|précise|ajoute|barre|"
    r"range|utilise|rédige|imagine|raconte|observe|lis|forme|accorde|corrige|associe|"
    r"réponds|identifie|repère|distingue|rappelle|résume|reformule|"
    r"transpose|décris|présente|dresse|établis|montre|démontre|illustre|développe|"
    r"entoure|numérote|ordonne|reconstitue|dis|détermine|dégage|formule|élabore|"
    r"bâtis|commente|discute|apprécie|évalue|vérifie|confronte|recherche|"
    r"relis|note|consigne|sélectionne|hiérarchise|organise|structure|"
    r"caractérise|interprète|explicite|défends|réfute|soutiens|"
    r"étudie|examine|mesure|décompte|réduis|contracte|introduis|conclus)\b",
    re.I)


def sha(s):
    return hashlib.sha1((s or "").encode("utf-8")).hexdigest()[:8]


def propre(t):
    """Retire les pointillés de réponse : l'élève écrit dessus, ils ne servent à rien ici."""
    t = DOTS.sub(" ", t or "")
    t = re.sub(r"[…]+", " ", t)
    t = re.sub(r"\.{3,}", " ", t)
    t = re.sub(r"\s{2,}", " ", t)
    return t.strip(" .·…_-\t\u00a0")


def est_question(t, style=""):
    """Un énoncé, dans ces masters manuscrits, c'est d'abord une ligne à remplir.

    Les pointillés sont le signal fiable : l'auteur en met sous chaque question. Le « ? »
    seul ne suffit pas — les corpus sont des dialogues, pleins de questions qui ne sont
    pas posées à l'élève. On n'accepte donc une ligne sans pointillés que si elle est
    puisée dans une liste à puces (style « List Paragraph »), là où l'auteur range ses
    consignes, et qu'elle interroge ou commande.
    """
    c = propre(t)
    if len(c) < 8:
        return False
    if DOTS.search(t or ""):
        return True
    if style not in ("List Paragraph", "Liste1", "Liste"):
        return False
    if len(c) < 14:
        return False
    # « Quelle différence peux-tu établir entre le passé simple et l'imparfait » : une
    # question peut n'avoir ni pointillés ni point d'interrogation. Le mot interrogatif
    # de tête suffit alors à la reconnaître.
    return (c.endswith("?") or bool(IMPER.match(NUM.sub("", c)))
            or commence_par_interrogatif(NUM.sub("", c)))


def libelle_competence(t):
    """« À la fin de la séquence l'élève bâtira un plan détaillé » → « Bâtir un plan détaillé ».

    Sert de sous-titre de page : c'est le nom que l'élève reconnaît sur sa séquence.
    """
    c = re.sub(r"^\s*[^\w]*Comp[ée]tence attendue\s*[:\u2014\u2013-]?\s*", "", t or "").strip()
    c = re.sub(r"^(?:À|A)\s+la\s+fin\s+de\s+la\s+(?:séquence|leçon)\s*,?\s*", "", c, flags=re.I)
    c = re.sub(r"^l['\u2019]\s*(?:élève|apprenant)\s+", "", c, flags=re.I)
    c = re.sub(r"^sera capable d['\u2019]e?\s*", "", c, flags=re.I)
    c = c.strip(" .")
    futurs = [(r"^produira\b", "Produire"), (r"^bâtira\b", "Bâtir"), (r"^utilisera\b", "Utiliser"),
              (r"^élaborera\b", "Élaborer"), (r"^rédigera\b", "Rédiger"), (r"^lira\b", "Lire"),
              (r"^analysera\b", "Analyser")]
    for pat, rep in futurs:
        c2 = re.sub(pat, rep, c, flags=re.I)
        if c2 != c:
            c = c2
            break
    return (c[:1].upper() + c[1:]) if c else ""


class Cahier:
    def __init__(self, niv, fichier):
        self.niv, self.fichier = niv, fichier
        self.modules = []
        self.stats = Counter()

    def module(self, n, titre):
        # Le préambule (copyright, page de garde) crée un module 0 par défaut ; quand
        # l'ouverture réelle arrive, elle le remplace au lieu de le doubler.
        if self.modules and not any(l["items"] for l in self.modules[-1]["lecons"]):
            self.modules.pop()
        m = dict(n=n, titre=titre, comp="", lecons=[])
        self.modules.append(m)
        return m

    def cur_module(self):
        if not self.modules:
            self.module(0, "Évaluation diagnostique")
        return self.modules[-1]

    def lecon(self, titre, semaine=None):
        m = self.cur_module()
        l = dict(n=len(m["lecons"]) + 1, titre=titre, objectif="", semaine=semaine,
                 texte=[], source="", lexique="", items=[], corrige_integre=False)
        m["lecons"].append(l)
        return l

    def cur_lecon(self, semaine=None):
        m = self.cur_module()
        if not m["lecons"]:
            self.lecon("Ouverture", semaine)
        return m["lecons"][-1]

    def item(self, txt, kind, rub, semaine=None, num=None):
        l = self.cur_lecon(semaine)
        m = self.cur_module()
        it = dict(id="%s-m%d-l%d-n%d" % (self.niv, m["n"], l["n"], len(l["items"]) + 1),
                  rub=rub or "", kind=kind, txt=txt, sol=[], hash=sha(txt), num=num)
        l["items"].append(it)
        self.stats[kind] += 1
        return it


# ══════════════════════════════════════════════════════════ 2ⁿᵈᵉ — rendu HTML
BLOCS = re.compile(
    r'<div class="op-kicker(?: op-part)?">(?P<kick>[^<]*)</div>'
    r'|<div class="op-rom">(?P<rom>[^<]*)</div>'
    r'|<div class="comp"[^>]*>(?P<comp>.*?)</div>'
    r'|<div class="sem"[^>]*>(?P<sem>.*?)</div>'
    r'|<span class="lh-t">(?P<lh>.*?)</span>'
    r'|<p class="obj"[^>]*>(?P<obj>.*?)</p>'
    r'|<p class="corpus-tag"[^>]*>(?P<corpus>.*?)</p>'
    r'|<p class="txth"[^>]*>(?P<txth>.*?)</p>'
    r'|<div class="rub"[^>]*>(?P<rub>.*?)</div>'
    r'|<div class="q"><span class="qn"[^>]*>(?P<qn>[^<]*)</span>'
    r'<div class="qa"[^>]*>(?P<qa>.*?)</div></div>'
    r'|<div class="exo"[^>]*><span class="exo-n">(?P<exon>[^<]*)</span>(?P<exo>.*?)</div>'
    r'|<p class="cons"[^>]*>(?P<cons>.*?)</p>'
    r'|<p class="src"[^>]*>(?P<src>.*?)</p>'
    r'|<p class="body"[^>]*>(?P<body>.*?)</p>'
    r'|<div class="corpus"[^>]*>(?P<corp>.*?)</div>'
    r'|<div class="tbl"[^>]*>(?P<tbl>.*?)</div>',
    re.S)

TAGS = re.compile(r"<[^>]+>")
SVG = re.compile(r"<svg.*?</svg>", re.S)


def txt_html(s):
    import html as H
    s = SVG.sub(" ", s or "")
    s = re.sub(r"(?i)<br\s*/?>", " ", s)
    s = re.sub(r"(?is)</(p|div|li|tr)>", " ", s)
    s = TAGS.sub("", s)
    return re.sub(r"\s+", " ", H.unescape(s)).strip()


AUTO = re.compile(r"(j['\u2019]ai réussi|mes points forts|points forts|je dois améliorer|"
                  r"je me fixe un objectif|coche la case)", re.I)


def extract_html(niv, path):
    src = open(path, encoding="utf-8").read()
    src = src[src.find("<body"):] if "<body" in src else src
    c = Cahier(niv, os.path.basename(path))
    semaine = rub = None
    attend_rom = False
    for m in BLOCS.finditer(src):
        g = m.groupdict()
        if g["kick"] is not None:
            k = txt_html(g["kick"])
            if k.lower().startswith("séquence"):
                attend_rom = True
            else:                                   # « Évaluation diagnostique »
                c.module(0, k)
                semaine = rub = None
            continue
        if g["rom"] is not None and attend_rom:
            n = ROMAINS.get(txt_html(g["rom"]).upper().strip(), len(c.modules))
            c.module(n, "SÉQUENCE %d" % n)
            semaine = rub = None
            attend_rom = False
            continue
        if g["comp"] is not None:
            c.cur_module()["comp"] = txt_html(g["comp"])
            continue
        if g["sem"] is not None:
            semaine = txt_html(g["sem"]); rub = None
            continue
        if g["lh"] is not None:
            c.lecon(txt_html(g["lh"]), semaine); rub = None
            continue
        if g["obj"] is not None:
            c.cur_lecon(semaine)["objectif"] = txt_html(g["obj"]); continue
        if g["corpus"] is not None:
            c.cur_lecon(semaine)["texte"].append(txt_html(g["corpus"])); continue
        if g["src"] is not None:
            c.cur_lecon(semaine)["source"] = txt_html(g["src"]); continue
        if g["rub"] is not None:
            rub = txt_html(g["rub"]); continue
        if g["txth"] is not None:
            rub = txt_html(g["txth"]); continue
        if g["qa"] is not None:
            t = txt_html(g["qa"])
            c.item(t, "auto" if AUTO.search(t) else "q", rub, semaine, num=txt_html(g["qn"]))
            continue
        if g["exo"] is not None:
            c.item(txt_html(g["exo"]), "exo", rub, semaine, num=txt_html(g["exon"]))
            continue
        if g["cons"] is not None:
            c.item(txt_html(g["cons"]), "prod", rub, semaine); continue
        for k in ("body", "corp", "tbl"):
            if g[k] is not None:
                c.cur_lecon(semaine)["texte"].append(txt_html(g[k]))
                break
    return c


# ═════════════════════════════════════════════════════ 1ʳᵉ / Tˡᵉ — masters Word
E = r"[\U0001F300-\U0001FAFF\u2190-\u27BF\u2B00-\u2BFF\uFE0F\u2600-\u26FF]"
RE_COMP = re.compile(r"^\s*%s*\s*Comp[ée]tence attendue" % E, re.I)
RE_SEM = re.compile(r"^\s*%s*\s*Semaine\s*(\d+)\s*[:;.\u2013\u2014-]?\s*(.*)$" % E, re.I)
RE_OBJ = re.compile(r"^\s*%s*\s*Objectif\s*:?\s*(.*)$" % E, re.I)
RE_CORPUS = re.compile(r"^\s*%s*\s*(Corpus|Texte|Sujet|Grille d['\u2019]observation)\s*:?" % E, re.I)
RE_EXO = re.compile(r"^\s*%s*\s*(Exercice|Épreuve|Epreuve)\s*(\d+)\s*[:.\u2013\u2014-]?\s*(.*)$" % E, re.I)
RE_RETIENS = re.compile(r"^\s*%s*\s*(Je retiens|Retenons)" % E, re.I)
# En-têtes de leçon : la discipline de la séance. Liste fermée — tout le reste qui
# commence par un émoji est une rubrique de déroulement (Découverte, Traitement…).
RE_LECON = re.compile(
    r"^\s*%s*\s*("
    r"Langue française|[ÉE]tude de l['\u2019]œuvre intégrale|"
    r"Groupement de textes|Méthodologie|Production Orale|Production orale|"
    r"Production écrite|Lecture méthodique|Lecture suivie|Intégration|"
    r"VERS LE PROBATOIRE|VERS LE BAC|Évaluation|Auto-évaluation)"
    r"\s*:?\s*(.*)$" % E, re.I)
RE_RUB = re.compile(
    r"^\s*%s+\s*(Découverte|Traitement|Confrontations?|Synthèse|Bilan|Prolongement|"
    r"Consolidation|Mise en contexte|Observations?|Analyse des paratextes|"
    r"Impressions|Lectures et hypothèses|Choix des axes|Vérification|Titre et justification|"
    r"Présentation|Mobilisation|Production de la tâche|Débat|1[\u00e8e]re Séance|"
    r"\d+e Séance|Inscription de l['\u2019]œuvre)" % E, re.I)


def extract_docx(niv, path):
    doc = Document(path)
    c = Cahier(niv, os.path.basename(path))
    semaine = rub = None
    n_seq = 0
    dans_retiens = False

    for p in doc.paragraphs:
        raw = (p.text or "").replace("\n", " ").replace("\r", " ").strip()
        if not raw or POINTILLES.match(raw):
            continue
        style = p.style.name if p.style is not None else ""
        t = re.sub(r"\s{2,}", " ", raw)

        # « Compétence attendue » ouvre une séquence (sauf la reprise 🎯 de la semaine 4)
        if RE_COMP.match(t):
            if not t.lstrip()[:1].isalpha():          # rappel 🎯 en tête d'intégration
                c.cur_lecon(semaine)["texte"].append(t)
                continue
            n_seq += 1
            c.module(n_seq, "SÉQUENCE %d" % n_seq)
            c.modules[-1]["comp"] = t
            semaine = rub = None; dans_retiens = False
            continue
        m = RE_SEM.match(t)
        if m and len(t) < 130:
            semaine = "Semaine %s%s" % (m.group(1),
                                        (" · " + m.group(2).strip()) if m.group(2).strip() else "")
            rub = None; dans_retiens = False
            continue
        m = RE_LECON.match(t)
        if m and len(t) < 120:
            c.lecon(re.sub(r"\s*:\s*$", "", t.strip()), semaine)
            rub = None; dans_retiens = False
            continue
        m = RE_OBJ.match(t)
        if m and len(t) < 300:
            c.cur_lecon(semaine)["objectif"] = m.group(1).strip()
            dans_retiens = False
            continue
        if RE_RETIENS.match(t) and len(t) < 60:
            dans_retiens = True                      # contenu de leçon : jamais publié
            continue
        if RE_CORPUS.match(t) and len(t) < 200:
            rub = None; dans_retiens = False
            c.cur_lecon(semaine)["texte"].append(t)
            continue
        m = RE_EXO.match(t)
        if m:
            dans_retiens = False
            c.item(propre(t), "exo", rub, semaine,
                   num="%s %s" % (m.group(1).capitalize(), m.group(2)))
            continue
        if RE_RUB.match(t) and len(t) < 90:
            rub = re.sub(r"^\s*%s+\s*" % E, "", t).strip()
            dans_retiens = False
            continue
        if dans_retiens:
            continue
        if est_question(t, style):
            cl = propre(t)
            if len(cl) < 8:
                continue
            kind = "q"
            if AUTO.search(cl):
                kind = "auto"
            elif re.match(r"^(Rédige|Produis|Écris|Compose|Raconte|Imagine)\b", cl, re.I):
                kind = "prod"
            c.item(cl, kind, rub, semaine)
            continue
        c.cur_lecon(semaine)["texte"].append(t)
    return c


# ═══════════════════════════════════════════════════════════════════════ main
def main():
    os.makedirs(OUT, exist_ok=True)
    print("Inventaire des CAHIERS de français — 2nd cycle\n")
    grand = Counter()
    for niv, fn in CAHIERS.items():
        path = os.path.join(FIN2, fn)
        if not os.path.exists(path):
            print("!! absent : %s" % path); continue
        c = extract_html(niv, path) if fn.endswith(".html") else extract_docx(niv, path)
        for m in c.modules:
            m["lecons"] = [l for l in m["lecons"] if l["items"] or l["texte"]]
            if m["comp"] and m["n"]:
                m["titre"] = "%s — %s" % (m["titre"], libelle_competence(m["comp"]))
        c.modules = [m for m in c.modules if m["lecons"]]
        with open(os.path.join(OUT, "%s.json" % niv), "w", encoding="utf-8") as f:
            json.dump(dict(niveau=niv, fichier=fn, modules=c.modules), f,
                      ensure_ascii=False, indent=1)
        aq = sum(1 for m in c.modules for l in m["lecons"] for i in l["items"]
                 if i["kind"] in ("q", "exo", "prod"))
        print("── %s  (%s)" % (niv, fn))
        for m in c.modules:
            n_items = sum(len(l["items"]) for l in m["lecons"])
            n_auto = sum(1 for l in m["lecons"] for i in l["items"] if i["kind"] == "auto")
            print("   M%d %-54s %3d leçons %4d items (%d auto-éval)"
                  % (m["n"], m["titre"][:54], len(m["lecons"]), n_items, n_auto))
        print("   → %s : %d items à corriger  %s\n" % (niv, aq, dict(c.stats)))
        grand[niv] = aq
    print("TOTAL à rédiger : %d corrigés  (%s)"
          % (sum(grand.values()), " · ".join("%s %d" % (k, v) for k, v in grand.items())))


if __name__ == "__main__":
    main()
