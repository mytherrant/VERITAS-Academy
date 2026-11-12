"""Construit apprendre/progressions.js et apprendre/lecons.js.

progressions.js : progressions harmonisées MINESEC 2026-2027 (sous-système francophone, général),
  collectées sur minesec-ige.com/progression-sheets (voir le script de collecte du 06/11/2026).
  Format : VRT_PROG[classe][matière] = [[chapitre, [[rang, titre], ...], trimestre], ...]
  Le rang est la position dans la progression (1, 2, 3…), car les fiches numérotent de façons
  différentes (Leçon 1, Séance 1, TP, Leçon N°1, numérotation qui repart à chaque unité).
lecons.js : concaténation de apprendre/_src/*.js (ordre alphabétique).

Usage : python tools/build_apprendre.py <prog_minesec.json>"""
import json, re, sys, glob, os

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(RACINE, "apprendre")

def chap_net(c):
    c = re.sub(r"\s+", " ", c or "").strip().strip('"“”')
    c = re.sub(r"\s*\((?:suite(?: et fin)?|fin)\)", "", c, flags=re.I)
    c = re.sub(r"^(?:Chap(?:itre)?\.?\s*[IVX\d]+\s*[:.\-–]\s*|S[ÉE]Q\.?\s*\d+\s*[:.\-–]\s*|Mod(?:ule)?\s*\d+\s*,?\s*)", "", c, flags=re.I)
    c = re.sub(r"^[IVX]+\s*[.\-–]\s*", "", c)          # « I. L'impérialisme… » = « L'impérialisme… »
    return c.strip(" :")

TRIM = {"first term": "Premier trimestre", "second term": "Deuxième trimestre", "third term": "Troisième trimestre"}
def trim_net(t):
    t = (t or "").strip()
    return TRIM.get(t.lower(), t)

def cle(c):
    return re.sub(r"[^a-z0-9]", "", c.lower().replace("’", "'"))

def titre_net(t):
    t = re.sub(r"\s+", " ", t or "").strip()
    t = re.sub(r"^Le[çc]on\s*N[O°º]?\s*\d+\s*[:.\-–]\s*", "", t, flags=re.I)
    return t

def modules_francais(lecons):
    """Français : la fiche MINESEC intercale les intitulés de module (cellules fusionnées).
    Une leçon « remédiation » (ou un « compte rendu » isolé) ferme chaque module ; le module prend
    l'intitulé le plus fréquent parmi ses propres lignes (hors « Chapitres » vides)."""
    def est_cr(t): return re.search(r"compte[ -]rendu", t, re.I) and not re.search(r"oral|lecture|contr[ôo]le", t, re.I)
    def est_rem(t): return re.search(r"rem[ée]diation[\s.]*$", t, re.I)
    L = [(titre_net(l["t"]), chap_net(l.get("chap")), trim_net(l.get("trim"))) for l in lecons if titre_net(l["t"])]
    mods, cur = [], []
    for i, x in enumerate(L):
        cur.append((i + 1,) + x)
        suiv = L[i + 1][0] if i + 1 < len(L) else ""
        if est_rem(x[0]) or (est_cr(x[0]) and not est_rem(suiv) and not est_cr(suiv)):
            mods.append(cur); cur = []
    if cur:
        if mods and len(cur) < 3: mods[-1] += cur
        else: mods.append(cur)
    # Les intitulés et trimestres de la fiche en ligne sont intercalés de façon peu fiable :
    # on n'affiche que le numéro, plutôt qu'un nom de module faux.
    lycee = any(re.match(r"S[ée]quence", (c or ""), re.I) for _, c, _ in L)
    return [[("Séquence " if lycee else "Module ") + str(k + 1), [[r, t] for r, t, _, _ in m], ""] for k, m in enumerate(mods)]

def progressions(src):
    d = json.load(open(src, encoding="utf-8"))
    out = {}
    for classe, mats in d.items():
        out[classe] = {}
        for mat, lecons in mats.items():
            chaps, rang = [], 0
            for l in lecons:
                t = titre_net(l["t"])
                if not t: continue
                rang += 1
                c = chap_net(l.get("chap"))
                # un chapitre qui revient (suite au trimestre suivant, variante de libellé) reste le même chapitre
                if not chaps or (c and cle(c) != cle(chaps[-1][0])):
                    deja = [ch for ch in chaps if c and cle(ch[0]) == cle(c)]
                    if deja and deja[-1] is chaps[-1]: pass
                    else: chaps.append([c or (chaps[-1][0] if chaps else ""), [], trim_net(l.get("trim"))])
                chaps[-1][1].append([rang, t])
            if rang and mat == "Français": chaps = modules_francais(lecons)
            if rang: out[classe][mat] = chaps
    entete = ("/* Progressions harmonisées MINESEC 2026-2027 — sous-système francophone, enseignement général.\n"
              "   Source : minesec-ige.com/progression-sheets. Fichier GÉNÉRÉ par tools/build_apprendre.py. */\n")
    open(os.path.join(APP, "progressions.js"), "w", encoding="utf-8").write(
        entete + "window.VRT_PROG=" + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n")
    n = sum(len(ch[1]) for m in out.values() for v in m.values() for ch in v)
    print(f"progressions.js : {len(out)} classes, {sum(len(m) for m in out.values())} matières, {n} leçons")

def lecons():
    parts = sorted(glob.glob(os.path.join(APP, "_src", "*.js")))
    corps = "\n".join(open(p, encoding="utf-8").read() for p in parts)
    open(os.path.join(APP, "lecons.js"), "w", encoding="utf-8").write(corps)
    print(f"lecons.js : {len(parts)} fichiers sources, {corps.count('VRT_L(')} leçons, {corps.count('VRT_A(')} animations")

if __name__ == "__main__":
    if len(sys.argv) > 1: progressions(sys.argv[1])
    lecons()
