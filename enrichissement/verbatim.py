# -*- coding: utf-8 -*-
"""
Contrôle verbatim des extraits d'œuvre.

L'audit de conformité (`audit.py`) mesure la forme d'un cahier : volume,
nombre de fiches, barèmes, grilles. Il ne sait rien de ce que valent les
textes. Or la seule faute qui disqualifie un manuel devant la commission est
celle-là : un extrait attribué à un auteur qui n'est pas mot pour mot le sien.

Ce module relit chaque cahier produit, en extrait les passages d'œuvre, et
vérifie chaque phrase — ou chaque vers — contre le fichier source de l'œuvre.
Rien n'est comparé de mémoire : la source est rouverte à chaque exécution.

    python enrichissement/verbatim.py            # tous les cahiers
    python enrichissement/verbatim.py tartuffe   # un seul

Sortie : pour chaque cahier, le nombre d'unités vérifiées et la liste de
celles qui ne se retrouvent pas dans la source, avec le passage de source le
plus proche quand il en existe un.
"""
import difflib
import os
import re
import sys
import unicodedata
import zipfile
from html import unescape

import docx

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
sys.path.insert(0, ICI)
from docxkit import PICTOS
BUREAU = os.path.join(os.path.expanduser("~"), "Desktop", "Adit manuels")

# Chaque cahier, son .docx produit et le fichier de l'œuvre qui fait foi.
CAHIERS = {
    "vieuxnegre":  ("Manuel_VieuxNegreMedaille_Etude_Integrale.docx",
                    "Le vieux nègre et la médaille.docx"),
    "lionperle":   ("Manuel_LionEtLaPerle_Etude_Integrale.docx",
                    "Le lion et la perle.epub"),
    "ngum":        ("Manuel_NgumAJemea_Etude_Integrale.docx",
                    "Ngum a Jemea de D. Mbanga Eyombwan.docx"),
    "capitoline":  ("Manuel_Capitoline_Etude_Integrale.docx",
                    "Les Tribus de Capitoline.docx"),
    "tenebres":    ("Manuel_AuCoeurDesTenebres_Etude_Integrale.docx",
                    "Au coeur des tenebres - Joseph Conrad.epub"),
    "tartuffe":    ("Manuel_Tartuffe_Etude_Integrale.docx",
                    "Molière - Le Tartuffe @EpubsFR.epub"),
    "sauvages":    ("Manuel_PoemesSauvages_Etude_Integrale.docx",
                    "Poèmes sauvages éclairés au feu de brousse.docx"),
    "stances":     ("Manuel_StancesEtPoemes_Etude_Integrale.docx",
                    "Sully Prudhomme - Stances et poèmes @EpubsFR.epub"),
    "balafon":     ("Manuel_Balafon_Etude_Integrale.docx",
                    "Engelbert MVENG, Balafon.docx"),
}

def titres_du_cahier(cle):
    """Les titres des poèmes reproduits, tels que le cahier les déclare.

    Ils servent à reconnaître ce que la source porte en trop devant un
    extrait. Un cahier sans module d'extraits n'en fournit pas : le contrôle
    reste alors strict, ce qui est le bon défaut.
    """
    sys.path.insert(0, ICI)
    try:
        mod = __import__("%s_extraits" % cle)
    except ImportError:
        return set()
    refs = getattr(mod, "REFERENCES", {})
    return set(" ".join(mots(v[0])) for v in refs.values() if v and v[0])


def support_de_contraction(cle):
    """Le texte du support de contraction du cahier, ou None.

    Ce support ne sort pas de l'œuvre : c'est un texte critique — préface,
    postface, dossier pédagogique — qui porte sa propre référence. Le
    chercher dans le roman ne prouverait rien. On ne le devine pas : on le
    lit dans le module qui l'écrit.
    """
    sys.path.insert(0, ICI)
    import contractions
    d = contractions.PAR_CAHIER.get(cle)
    return " ".join(mots(d["texte"])) if d else None

# Certains fichiers sources portent, à la suite de l'œuvre, un texte qui ne
# lui appartient pas. Les comparer dans leur totalité fausse deux choses :
# le contrôle verbatim, qui pourrait valider une citation venue de l'intrus,
# et l'audit pédagogique, qui mesure où tombe un extrait dans l'œuvre.
BORNES = {
    # Après le texte de Soyinka vient une seconde pièce (Gbêhanzin, Migan,
    # Mèhou, le Danhomè), sans rapport avec « Le lion et la perle ».
    "Le lion et la perle.epub": 22556,
}

MOTS_MIN = 150      # au-dessous, un passage de prose n'est pas un extrait
UNITE_MIN = 6       # une unité de moins de six mots ne prouve rien

# En poésie, le seuil de la prose écarterait du contrôle les poèmes les
# plus célèbres : « Le Vase brisé » fait cent vingt-deux mots, « Intus »
# cent huit. Ils seraient reproduits dans le cahier sans qu'un seul de
# leurs vers soit vérifié. Le plancher descend donc pour ces cahiers-là.
POESIE = {"sauvages", "stances", "balafon"}
MOTS_MIN_VERS = 40


# ────────────────────────────────────────────────────────── normalisation
def normaliser(t):
    """Rend deux graphies comparables sans toucher aux mots.

    L'apostrophe droite et la courbe, l'espace insécable et l'espace fine,
    les guillemets, les tirets : la typographie d'un epub et celle d'un docx
    ne coïncident jamais. Aucun de ces caractères ne distingue deux mots
    différents ; les neutraliser ne masque donc aucune faute réelle.
    """
    t = unicodedata.normalize("NFC", t)
    for a, b in (("’", "'"), ("‘", "'"), ("ʼ", "'"),
                 (" ", " "), (" ", " "), (" ", " "),
                 ("–", "-"), ("—", "-"), ("‒", "-"),
                 ("«", '"'), ("»", '"'),
                 ("“", '"'), ("”", '"'), ("„", '"'),
                 ("…", "..."), ("œ", "oe"), ("Œ", "OE"),
                 ("æ", "ae"), ("Æ", "AE")):
        t = t.replace(a, b)
    t = re.sub(r"\*\*(.*?)\*\*", r"\1", t)        # gras du rendu
    return re.sub(r"[ \t]+", " ", t)


def mots(t):
    """Suite de mots nus. La comparaison porte sur les mots, jamais sur la
    mise en page : un vers replié par le rendu reste égal à lui-même."""
    return re.findall(r"[0-9A-Za-zÀ-ÖØ-öø-ÿ']+",
                      normaliser(t).lower())


# ─────────────────────────────────────────────────────── lecture des sources
def source_docx(chemin):
    d = docx.Document(chemin)
    out = [p.text for p in d.paragraphs]
    for t in d.tables:
        for r in t.rows:
            for c in r.cells:
                out.append(c.text)
    return "\n".join(out)


# Balises de bloc : elles séparent le texte. Toutes les autres sont dans le
# fil du mot — une lettrine s'écrit <span>Q</span>uand, et couper là ferait
# lire « q uand », donc accuser le cahier d'avoir changé le mot.
BLOC = re.compile(r"</?(p|div|br|h[1-6]|li|tr|td|th|blockquote|section)\b[^>]*>",
                  re.I)


def source_epub(chemin):
    z = zipfile.ZipFile(chemin)
    noms = [n for n in z.namelist()
            if n.lower().endswith((".xhtml", ".html", ".htm"))]
    out = []
    # Tri NUMÉRIQUE, non alphabétique : « c10 » vient après « c9 », et un tri
    # de chaînes le place avant « c2 ». L'ordre du texte s'en trouvait
    # bouleversé — sans conséquence pour le contrôle verbatim, qui ne cherche
    # qu'une présence, mais fatal pour l'audit pédagogique, qui mesure OÙ
    # tombe chaque extrait dans l'œuvre.
    def _rang(nom):
        m = re.search(r"/c(\d+)[_.]", "/" + nom)
        return (0, int(m.group(1))) if m else (1, 0), nom

    for n in sorted(noms, key=_rang):
        d = z.read(n).decode("utf8", "replace")
        d = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", d, flags=re.S | re.I)
        d = re.sub(r'<a class="apnb".*?</a>', "", d, flags=re.S)
        d = BLOC.sub("\n", d)
        d = re.sub(r"<[^>]+>", "", d)
        out.append(unescape(d))
    return "\n".join(out)


_CACHE = {}


def charger_source(nom_fichier):
    if nom_fichier in _CACHE:
        return _CACHE[nom_fichier]
    chemin = os.path.join(BUREAU, nom_fichier)
    if not os.path.exists(chemin):
        raise IOError("source introuvable : %s" % chemin)
    brut = (source_epub(chemin) if chemin.lower().endswith(".epub")
            else source_docx(chemin))
    t = " ".join(mots(brut))
    borne = BORNES.get(nom_fichier)
    if borne:
        t = " ".join(t.split()[:borne])
    _CACHE[nom_fichier] = t
    return _CACHE[nom_fichier]


# ──────────────────────────────────────────────────────── lecture du cahier
def extraits_du_cahier(chemin, plancher=MOTS_MIN):
    """Les cellules 1×1 assez longues pour être des extraits d'œuvre."""
    doc = docx.Document(chemin)
    out = []
    for t in doc.tables:
        if len(t.rows) == 1 and len(t.columns) == 1:
            txt = t.rows[0].cells[0].text.strip()
            if not txt or txt[0] in PICTOS:
                continue
            if len(txt.split()) < plancher:
                continue
            out.append(txt)
    return out


def unites(extrait):
    """Découpe un extrait en unités vérifiables.

    Les coupes […] bornent : deux fragments séparés ne sont jamais recollés.
    Les lignes courtes — nom de personnage, didascalie, vers isolé — sont
    fondues dans l'unité voisine, sans quoi le contrôle se réduirait à
    chercher « ORGON » dans la pièce, ce qui ne prouve rien.
    """
    out = []
    for bloc in re.split(r"\[\s*[….]{1,3}\s*\]", extrait):
        for phrase in re.split(r"(?<=[.!?])\s+|\n{2,}", bloc):
            m = mots(phrase)
            if len(m) >= UNITE_MIN:
                out.append([" ".join(m), phrase.strip()])
            elif m and out:
                out[-1][0] += " " + " ".join(m)
    return [tuple(u) for u in out]


# ───────────────────────────────────────────────────────────────── contrôle
def verifier(cle):
    nom_docx, nom_src = CAHIERS[cle]
    chemin = os.path.join(RACINE, nom_docx)
    if not os.path.exists(chemin):
        return dict(cle=cle, absent=True)

    src = charger_source(nom_src)
    support = support_de_contraction(cle)
    titres = titres_du_cahier(cle)
    ecarts, total, nb_ex, hors = [], 0, 0, 0
    plancher = MOTS_MIN_VERS if cle in POESIE else MOTS_MIN
    for i, ex in enumerate(extraits_du_cahier(chemin, plancher), 1):
        tete = " ".join(mots(ex)[:12])
        if support and tete and tete in support:
            hors += 1
            continue
        nb_ex += 1
        for norm, brut in unites(ex):
            total += 1
            if norm in src:
                continue
            # Dernier recours : la source peut couper le passage sur une page
            # et y insérer un numéro. On réessaie sur les deux moitiés.
            m = norm.split()
            k = len(m) // 2
            if " ".join(m[:k]) in src and " ".join(m[k:]) in src:
                continue
            ecarts.append((i, brut, norm))
    return dict(cle=cle, docx=nom_docx, source=nom_src, extraits=nb_ex,
                hors=hors, total=total, ecarts=ecarts, absent=False)


def voisin(norm, src):
    """Le passage de source le plus ressemblant, pour situer l'écart."""
    m = norm.split()
    if not m:
        return ""
    for n in (5, 4, 3):
        k = src.find(" ".join(m[:n]))
        if k >= 0:
            return src[k:k + len(norm) + 40]
    s = src.split()
    pas = max(1, len(m) // 2)
    cand = [" ".join(s[i:i + len(m)]) for i in range(0, len(s), pas)]
    proche = difflib.get_close_matches(norm, cand, n=1, cutoff=0.55)
    return proche[0] if proche else ""


# ──────────────────────────────────────────── diagnostic mot à mot des écarts
def _index(src_mots):
    """Positions de chaque mot dans la source, pour ancrer la recherche."""
    idx = {}
    for i, w in enumerate(src_mots):
        idx.setdefault(w, []).append(i)
    return idx


def fenetre(unite, src_mots, idx):
    """La portion de source qui ressemble le plus à l'unité.

    On ancre sur les mots les moins fréquents de l'unité — un nom propre, un
    mot rare — puis on garde la fenêtre où le plus de mots coïncident. Ancrer
    sur « de » ou « la » ferait chercher partout et ne trouverait rien.
    """
    m = unite.split()
    if not m:
        return []
    rares = sorted(set(m), key=lambda w: len(idx.get(w, [])) or 10 ** 6)
    candidats = []
    for w in rares[:8]:
        for p in idx.get(w, [])[:400]:
            candidats.append(p - m.index(w))
    if not candidats:
        return []
    marge = max(4, len(m) // 4)
    best, score = [], -1
    vus = set()
    for d0 in candidats:
        # Le mot d'ancrage peut apparaître deux fois dans l'unité, ou la source
        # porter un mot de plus : on essaie les décalages voisins et on garde
        # le meilleur, faute de quoi la fenêtre commence un mot trop tôt et
        # tout l'alignement se décale.
        for d in (d0 - 1, d0, d0 + 1):
            d = max(0, d)
            if d in vus:
                continue
            vus.add(d)
            f = src_mots[d:d + len(m) + marge]
            s = difflib.SequenceMatcher(None, m, f).ratio()
            if s > score:
                best, score = f, s
    return best


# Confusions de reconnaissance de caractères : le scan a lu un chiffre là où
# le livre imprime une lettre — « Il naît » devenu « 11 naît », « on » devenu
# « 0n ». La table ne s'applique qu'aux endroits où la source porte un
# chiffre et le cahier n'en porte aucun ; deux mots français ne peuvent donc
# jamais se confondre par elle.
_SCAN = str.maketrans("10589", "ioseg")
_SCAN_LETTRES = str.maketrans("l", "i")


def _chiffre_pour_lettre(ca, cb):
    if not any(c.isdigit() for c in cb) or any(c.isdigit() for c in ca):
        return False
    return (ca.translate(_SCAN_LETTRES)
            == cb.translate(_SCAN).translate(_SCAN_LETTRES))


_VOYELLES = set("aeiouyàâäéèêëîïôöùûüœæ")


def _sans_voyelle(b):
    """Le mot que porte la source est-il seulement prononçable ?

    « fds » pour « fils », « ht » pour « lit » : le scan a fondu deux lettres
    en une. Un mot français d'au moins deux lettres a toujours une voyelle ;
    un groupe qui n'en a pas n'est pas un mot, et le cahier ne peut donc pas
    avoir remplacé un mot par un autre à cet endroit — il a restitué.
    """
    if len(b) != 1:
        return False
    m = b[0]
    return len(m) >= 1 and not (set(m) & _VOYELLES)


def _bord_de_fenetre(ca, cb, a, b):
    """La fenêtre de comparaison déborde-t-elle simplement l'unité ?

    La fenêtre est prise plus longue que le passage à vérifier, et la source
    n'a pas les mêmes coupes de ligne que le cahier : elle ramène parfois un
    mot voisin. Si toutes les lettres du cahier se retrouvent, dans l'ordre et
    d'un seul tenant, au début ou à la fin de ce que porte la source, le
    cahier n'a rien changé : c'est la fenêtre qui est trop large. On ne
    l'admet que pour deux mots d'écart au plus, faute de quoi la règle
    couvrirait une véritable suppression.
    """
    if not ca or len(b) - len(a) > 2 or len(b) <= len(a):
        return False
    return cb.startswith(ca) or cb.endswith(ca)


def _est_un_titre(b, titres):
    """Le texte que la source porte en trop est-il un titre du recueil ?

    Les titres sont ceux que le cahier déclare lui-même (`REFERENCES` du
    module d'extraits). On tolère l'année de composition, que le volume
    imprime souvent à côté du titre : « adamawa 1959 ».
    """
    if not titres or not b:
        return False
    nu = " ".join(x for x in b if not x.isdigit())
    if not nu:
        return False
    # Sans accents : le volume imprime « Epiphanie », le cahier « Épiphanie ».
    return _sans_accents(nu) in {_sans_accents(t) for t in titres}


def _sans_accents(t):
    return "".join(c for c in unicodedata.normalize("NFD", t)
                   if not unicodedata.combining(c))


def _classer(a, b):
    """Étiquette une divergence.

    Trois cas, et un seul disqualifie :
      'ocr'        le scan a déformé la lettre — « la porté », « kapotier ».
                   Le cahier rétablit le mot du livre.
      'accent'     les deux graphies ne diffèrent que par un accent que la
                   source ne porte pas. Un scan perd les accents en masse ;
                   il ne permet donc pas de trancher « fût » contre « fut ».
                   Compté à part, à confirmer sur le volume imprimé.
      'ALTERATION' deux mots différents. C'est la faute qui disqualifie.
    """
    ta, tb = " ".join(a), " ".join(b)
    if not ta or not tb:
        return "ALTERATION"
    ca, cb = ta.replace(" ", ""), tb.replace(" ", "")
    if ca == cb:
        return "ocr"                     # mots collés ou coupés par le scan
    if _chiffre_pour_lettre(ca, cb):
        return "ocr"                     # chiffre lu à la place d'une lettre
    if _sans_voyelle(b):
        return "ocr"                     # « fds » pour « fils » : pas un mot
    if _bord_de_fenetre(ca, cb, a, b):
        return "ocr"                     # la fenêtre déborde, le cahier non
    if _sans_accents(ca) == _sans_accents(cb):
        return "accent"
    if difflib.SequenceMatcher(None, ta, tb).ratio() >= 0.72:
        return "ocr"
    return "ALTERATION"


def diagnostic(unite, src_mots, idx, titres=None):
    """Liste des divergences d'une unité, chacune étiquetée.

    Retourne (etiquette, texte_cahier, texte_source) où l'étiquette vaut
    'ocr' — restitution admise — ou 'ALTERATION' — mot de l'auteur changé.
    """
    m = unite.split()
    f = fenetre(unite, src_mots, idx)
    if not f:
        return [("ALTERATION", unite, "(passage introuvable dans la source)")]
    sm = difflib.SequenceMatcher(None, m, f)
    out = []
    ops = sm.get_opcodes()
    marge_tete = max(4, len(m) // 4)
    for k, (op, i1, i2, j1, j2) in enumerate(ops):
        if op == "equal":
            continue
        a, b = m[i1:i2], f[j1:j2]
        # La fenêtre est volontairement plus longue que l'unité, et elle peut
        # déborder des deux côtés : l'ancrage se fait sur un mot rare, pas sur
        # le premier. Ce qui dépasse à ses extrémités est de la marge, non une
        # divergence — sans ce filtre, « Il prit son front » aligné sur « puis
        # prit son front » ferait accuser le cahier d'avoir changé « il ».
        # La fenêtre déborde en tête comme en queue : elle est ancrée sur un mot
        # rare, et la source ne coupe pas ses lignes où le cahier les coupe.
        # Elle ramène donc régulièrement, avant le premier vers, le titre du
        # poème, sa date ou le nom du personnage — que la fiche affiche à part.
        # Ce qui tombe dans la marge de tête n'est pas une divergence.
        #
        # LIMITE à connaître, et qui ne vient pas de ce filtre : une coupe en
        # DEBUT de phrase n'est de toute façon pas détectable unité par unité,
        # puisque le fragment restant existe tel quel dans la source et passe
        # dès le premier test. Seule une relecture humaine, ou une comparaison
        # de l'extrait entier, la verrait.
        # Deux cas s'écartent : ce qui tombe dans la marge de tête, et le titre
        # du poème lui-même, que la source imprime avant le premier vers et que
        # la fiche affiche à part. Le second se vérifie : le texte en trop doit
        # être un titre que le cahier déclare.
        if op == "insert" and (j1 <= marge_tete or _est_un_titre(b, titres)):
            continue
        if k == len(ops) - 1 and j2 >= len(f):
            if op == "insert":
                continue
            if "".join(b).startswith("".join(a)):
                out.append(("ocr", " ".join(a), " ".join(b)))
                continue
        out.append((_classer(a, b),
                    " ".join(a) or "(rien)", " ".join(b) or "(rien)"))
    return out


def rapport(cle, detail=False):
    """Classe les écarts d'un cahier et les affiche.

    Renvoie le nombre d'altérations — les seules qui comptent. Une coquille
    de scan restituée est signalée mais ne met pas le cahier en défaut :
    c'est le texte de l'auteur qu'elle rétablit, pas qu'elle trahit.
    """
    r = verifier(cle)
    if r.get("absent"):
        print("\n  %-12s cahier non construit" % cle)
        return 0
    src = charger_source(r["source"])
    src_mots = src.split()
    idx = _index(src_mots)
    titres = titres_du_cahier(cle)

    alterations, ocr, accents = [], 0, []
    for num, brut, norm in r["ecarts"]:
        for etiquette, a, b in diagnostic(norm, src_mots, idx, titres):
            if etiquette == "ocr":
                ocr += 1
            elif etiquette == "accent":
                accents.append((num, a, b))
            else:
                alterations.append((num, brut, a, b))

    etat = ("conforme" if not alterations
            else "%d ALTERATION(S)" % len(alterations))
    print("\n  %-12s %2d extraits, %4d unités  →  %s"
          % (cle, r["extraits"], r["total"], etat))
    print("  %-12s source : %s" % ("", r["source"]))
    print("  %-12s %d coquille(s) de scan restituée(s), %d accent(s) rétabli(s)"
          "%s" % ("", ocr, len(accents),
                  ", %d support(s) hors œuvre écarté(s)" % r["hors"]
                  if r["hors"] else ""))
    if accents and detail:
        for num, a, b in accents[:20]:
            print("     ~ extrait %d : cahier « %s » / source sans accent « %s »"
                  % (num, a[:60], b[:60]))
    seuil = len(alterations) if detail else 12
    for num, brut, a, b in alterations[:seuil]:
        print("     x extrait %d : cahier « %s »" % (num, a[:90]))
        print("                    source « %s »" % b[:90])
        if detail:
            print("       contexte : %s" % brut[:150].replace("\n", " / "))
    if len(alterations) > seuil:
        print("     ... et %d autre(s) — relancer avec --detail"
              % (len(alterations) - seuil))
    return len(alterations)


def main():
    args = sys.argv[1:]
    detail = "--detail" in args
    cibles = [a for a in args if a in CAHIERS] or list(CAHIERS)
    print("=" * 78)
    print("  CONTRÔLE VERBATIM — extraits d'œuvre des cahiers VÉRITAS")
    print("=" * 78)
    faux = sum(rapport(c, detail) for c in cibles)
    print("\n" + "=" * 78)
    print("  %d alteration(s) au total." % faux)
    return faux


if __name__ == "__main__":
    sys.exit(1 if main() else 0)
