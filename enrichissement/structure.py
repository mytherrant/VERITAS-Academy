# -*- coding: utf-8 -*-
"""
Audit de l'organisation et de la structure. Cinquième contrôle.

Les quatre autres regardent le contenu : conforme (`audit`), fidèle
(`verbatim`), imprimable (`impression`), formateur (`pedagogie`). Aucun ne
regarde le **plan** — et un cahier peut être juste partout et illisible
d'un bout à l'autre : titres qui se répètent, numérotation qui saute,
sous-parties orphelines, et surtout la même question posée trois fois dans
trois rubriques différentes.

Six mesures, toutes prises sur le `.docx` produit :

  HIÉRARCHIE    un titre de niveau 3 sous un titre de niveau 1, sans
                niveau 2 entre les deux ; une partie à sous-section unique.
  NUMÉROTATION  « 3.1 » qui contient « 1.1 » ; « Branche 5 » suivie de
                « Branche 8 » ; « 1. », « 3. », « 4. ».
  ÉTIQUETTES    « Devoir n° 1 » employé deux fois pour deux objets qui
                n'ont rien à voir. Le renvoi devient impossible.
  ANNONCES      « Six exercices » suivi de sept.
  REDONDANCE    la même question posée dans le contrôle de lecture, dans
                les devoirs progressifs et dans le QCM. C'est le défaut le
                plus coûteux : l'élève croit avancer et refait le même
                travail.
  UNIFORMITÉ    une rubrique présente dans huit cahiers et absente du
                neuvième — ou placée ailleurs. Une collection se reconnaît
                à son plan.

    python enrichissement/structure.py              # les neuf cahiers
    python enrichissement/structure.py capitoline   # un seul
"""
import os
import re
import sys
import unicodedata
from collections import defaultdict

import docx

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
sys.path.insert(0, ICI)

import verbatim as V                                        # noqa: E402


# ═══════════════════════════════════════════════════════════════ NORMALISATION
_STOP = set("""
au aux avec ce ces dans de des du elle en et eux il ils je la le les leur lui
ma mais me meme mes moi mon ne nos notre nous on ou par pas pour qu que qui sa
se ses son sur ta te tes toi ton tu un une vos votre vous y est sont etre a ete
etait sera cette cet ceux celui celle dont ainsi alors apres avant chaque comme
donc dont encore entre lorsque quand sans si tout tous toute toutes plus moins
tres bien deja aussi meme quel quelle quels quelles quoi dit dire fait faire
ici la-bas puis enfin autre autres selon vers chez sous entre pendant depuis
""".split())

# La formule d'un exercice à trous est la même partout — « Complétez … avec
# les mots suivants : ». Comparée telle quelle, elle rapprochait des exercices
# qui n'ont en commun que leur consigne, et portent sur des citations sans
# rapport. Ces mots-là sont donc du décor, pas du contenu.
_STOP |= set("completez complete completer suivants suivant mots".split())

_MOT = re.compile(r"[A-Za-zÀ-ÿ'’\-]+")


def _plat(s):
    """Minuscule, sans accent, apostrophes unifiées."""
    s = (s or "").replace("’", "'")
    s = unicodedata.normalize("NFD", s)
    return "".join(c for c in s if unicodedata.category(c) != "Mn").lower()


def _radical(m):
    """Troncature à six lettres : « donner » et « donne » se rejoignent.

    Ce n'est pas une lemmatisation, et ce n'est pas prétendu. C'est le
    minimum qui fait qu'une question reformulée au présent est reconnue
    comme la même question. Éprouvé sur les neuf cahiers : aucun faux
    rapprochement au-dessus du seuil.
    """
    return m[:6]


def _contenu(phrase):
    """Les mots qui portent le sens d'une question, réduits à leur radical."""
    out = set()
    for m in _MOT.findall(_plat(phrase)):
        m = m.strip("'-")
        if len(m) < 4 or m in _STOP:
            continue
        out.add(_radical(m))
    return out


def _recouvrement(a, b):
    """Part de la plus courte des deux questions qui se retrouve dans l'autre.

    On mesure l'inclusion, non la ressemblance : le défaut cherché est
    « cette question est déjà posée ailleurs », et une question courte
    entièrement contenue dans une longue est un doublon parfait, quand
    bien même la longue dirait davantage.
    """
    if not a or not b:
        return 0.0
    return len(a & b) / float(min(len(a), len(b)))


# ═══════════════════════════════════════════════════════════════════════ PLAN
def _paras(chemin):
    d = docx.Document(chemin)
    return [p for p in d.paragraphs if (p.text or "").strip()]


def _texte_complet(chemin):
    """Tout le texte du cahier, tableaux compris."""
    d = docx.Document(chemin)
    bouts = [p.text for p in d.paragraphs]
    for t in d.tables:
        for r in t.rows:
            for c in r.cells:
                bouts.append(c.text)
    return "\n".join(bouts)


def _niveau(p):
    s = p.style.name or ""
    return int(s.split()[-1]) if s.startswith("Heading") else 0


def plan(ps):
    """(rang, niveau, titre) pour chaque titre du document."""
    return [(i, _niveau(p), p.text.strip())
            for i, p in enumerate(ps) if _niveau(p)]


def _sections(ps):
    """Chaque titre avec les paragraphes qui le suivent jusqu'au titre suivant.

    Renvoie une liste de dicts : rang, niveau, titre, chemin (la pile des
    titres englobants), corps (les paragraphes de texte).
    """
    tetes = plan(ps)
    out, pile = [], []
    for k, (i, n, t) in enumerate(tetes):
        j = tetes[k + 1][0] if k + 1 < len(tetes) else len(ps)
        pile = pile[:n - 1] + [t]
        out.append(dict(rang=i, niveau=n, titre=t, chemin=list(pile),
                        corps=[p.text.strip() for p in ps[i + 1:j]
                               if p.text.strip()]))
    return out


# ══════════════════════════════════════════════════════════════════ HIÉRARCHIE
def hierarchie(secs):
    """Titres de niveau 3 sans niveau 2 au-dessus, et parties à enfant unique."""
    m = []
    dernier2 = None
    partie = None
    enfants = defaultdict(list)
    for s in secs:
        if s["niveau"] == 1:
            partie, dernier2 = s["titre"], None
        elif s["niveau"] == 2:
            dernier2 = s["titre"]
            if partie:
                enfants[partie].append(s["titre"])
        elif s["niveau"] == 3 and partie and dernier2 is None:
            m.append("« %s » (niveau 3) suit directement « %s » (niveau 1) : "
                     "aucun niveau 2 entre les deux"
                     % (s["titre"][:52], partie[:40]))
    for t, ens in enfants.items():
        if len(ens) == 1 and re.match(r"^\d+\.\d+\s", ens[0]):
            m.append("« %s » n'a qu'une sous-section numérotée, « %s » : "
                     "un numéro pour un enfant unique n'ordonne rien"
                     % (t[:40], ens[0][:44]))
    return m


# ════════════════════════════════════════════════════════════════ NUMÉROTATION
_PARTIE = re.compile(r"^Partie\s+(\d+)\b")
_SOUS = re.compile(r"^(\d+)\.(\d+)\b")
_SOUSSOUS = re.compile(r"^(\d+)\.(\d+)(?:\.(\d+))?\s")
_ETIQ = re.compile(r"^(Branche|Exercice|Séquence|Devoir|Contrôle de lecture|"
                   r"Commentaire composé|Dissertation|Étape|Fiche)\s*n?°?\s*(\d+)")


def numerotation(secs):
    m = []
    partie_n = None
    sous_n = None
    for s in secs:
        t = s["titre"]
        if s["niveau"] == 1:
            g = _PARTIE.match(t)
            partie_n = int(g.group(1)) if g else None
            sous_n = None
            continue
        if s["niveau"] == 2:
            g = _SOUS.match(t)
            if g:
                sous_n = int(g.group(2))
                if partie_n and int(g.group(1)) != partie_n:
                    m.append("« %s » est dans la partie %d : le premier "
                             "chiffre ne suit pas" % (t[:46], partie_n))
            else:
                sous_n = None
            continue
        if s["niveau"] == 3 and partie_n:
            g = _SOUSSOUS.match(t)
            if g and g.group(3) is None:
                # « 1.1 » sous « 3.1 » : la numérotation d'origine du
                # markdown, jamais reprise après le changement de plan.
                if int(g.group(1)) != partie_n:
                    m.append("« %s » porte le numéro %s.%s, mais se trouve "
                             "dans la partie %d%s"
                             % (t[:44], g.group(1), g.group(2), partie_n,
                                (", section %d.%d" % (partie_n, sous_n))
                                if sous_n else ""))

    # Séries interrompues : Branche 1..5 puis 8, ou 1. 3. 4.
    series = defaultdict(list)
    for s in secs:
        g = _ETIQ.match(s["titre"])
        if g:
            series[(g.group(1), tuple(s["chemin"][:-1]))].append(int(g.group(2)))
        else:
            g2 = re.match(r"^(\d+)\.\s+\S", s["titre"])
            if g2 and s["niveau"] == 3:
                series[("§", tuple(s["chemin"][:-1]))].append(int(g2.group(1)))
    for (nom, _), nums in sorted(series.items()):
        vus = sorted(set(nums))
        if len(vus) < 2:
            continue
        manque = [n for n in range(vus[0], vus[-1] + 1) if n not in vus]
        if manque:
            m.append("série « %s » : %s — il manque %s"
                     % (nom, ", ".join(str(x) for x in vus),
                        ", ".join(str(x) for x in manque)))
    return m


def etiquettes(secs):
    """Une même étiquette portée par deux objets sans rapport."""
    m = []
    vus = defaultdict(list)
    for s in secs:
        g = _ETIQ.match(s["titre"])
        if not g:
            continue
        cle = "%s n° %s" % (g.group(1), g.group(2))
        vus[cle].append((s["titre"], s["chemin"][0] if s["chemin"] else "?"))
    for cle, occ in sorted(vus.items()):
        # Un corrigé porte légitimement le numéro de son devoir.
        utiles = [(t, p) for t, p in occ if "orrigé" not in t]
        parties = sorted({p for _, p in utiles})
        if len(utiles) > 1 and len(parties) > 1:
            m.append("« %s » désigne %d objets différents, dans %s"
                     % (cle, len(utiles),
                        " et ".join("« %s »" % p[:34] for p in parties)))
    return m


# ═══════════════════════════════════════════════════════════════════ ANNONCES
_NOMBRES = {"deux": 2, "trois": 3, "quatre": 4, "cinq": 5, "six": 6,
            "sept": 7, "huit": 8, "neuf": 9, "dix": 10, "onze": 11,
            "douze": 12}
# annonce → étiquette des titres à compter dans la même section
_COMPTABLES = {"exercices": "Exercice", "branches": "Branche",
               "séquences": "Séquence", "devoirs": "Devoir",
               "étapes": "Étape"}
_ANNONCE = re.compile(
    r"\b(deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze)\s+"
    r"(exercices|branches|séquences|devoirs|étapes)\b", re.I)


def annonces(secs, ps):
    """« Six exercices » suivi de sept."""
    m = []
    tetes = plan(ps)
    for k, s in enumerate(secs):
        for para in s["corps"][:3]:
            g = _ANNONCE.search(para)
            if not g:
                continue
            attendu = _NOMBRES[g.group(1).lower()]
            etiq = _COMPTABLES[g.group(2).lower()]
            # compter les titres de cette étiquette jusqu'au titre de même
            # niveau ou plus haut qui suit
            fin = len(ps)
            for i, n, _ in tetes:
                if i > s["rang"] and n <= s["niveau"]:
                    fin = i
                    break
            # Un corrigé porte le numéro de son devoir sans être un devoir de
            # plus : « Devoir n° 1 » et « Devoir n° 1 — Corrigé » font un.
            reels = sum(1 for i, n, t in tetes
                        if s["rang"] < i < fin and t.startswith(etiq)
                        and "orrigé" not in t)
            if reels and reels != attendu:
                m.append("« %s » annonce %d %s, la section en contient %d"
                         % (s["titre"][:40], attendu, g.group(2).lower(), reels))
    return m


# ═════════════════════════════════════════════════════════════════ REDONDANCE
# Les batteries de questions, repérées par le titre qui les porte. L'ordre
# compte : c'est celui du cahier, et le doublon est imputé au second.
ZONES = (
    ("carnet",   re.compile(r"Devoirs? progressifs|Carnet de bord|"
                            r"Je lis l['’]œuvre", re.I)),
    ("contrôle", re.compile(r"Contrôle de lecture", re.I)),
    ("qcm",      re.compile(r"Avez-vous lu l['’]œuvre", re.I)),
    ("vrai/faux", re.compile(r"Vrai ou faux", re.I)),
    ("compléter", re.compile(r"Exercice \d+ — Compléter", re.I)),
)

_CONSIGNE = re.compile(
    r"^(relevez|citez|recopiez|classez|comparez|montrez|expliquez|racontez|"
    r"rédigez|écrivez|justifiez|comptez|analysez|dites|cherchez|complétez|"
    r"dressez|reformulez|choisissez|proposez|résumez|indiquez|nommez)\b", re.I)

# Une question de pure méthode n'est pas un doublon de contenu : elle porte
# sur le cahier, non sur l'œuvre, et se répète légitimement.
_METHODE = re.compile(r"\b(axe|procédé|citation|commentaire|dissertation|"
                      r"introduction|conclusion|barème|grille|copie)\b", re.I)


def _questions(secs):
    """Les questions posées, par zone, avec leur titre d'origine."""
    out = []
    for s in secs:
        zone = None
        for nom, rx in ZONES:
            if any(rx.search(t) for t in s["chemin"]):
                zone = nom
                break
        if not zone:
            continue
        for k, para in enumerate(s["corps"]):
            t = re.sub(r"^\d+[.)]\s*", "", para).strip()
            if len(t) < 25:
                continue
            if not (t.endswith("?") or t.endswith(":") or _CONSIGNE.match(t)):
                continue
            if t.startswith(("Barème", "Une réponse", "Conformément")):
                continue
            t = re.sub(r"^Question d['’]interprétation\.\s*", "", t)
            # « Complétez la réplique de X avec les mots suivants : » — la
            # consigne est la même d'un exercice à l'autre, le texte à
            # compléter ne l'est pas. Comparer les seules consignes déclarait
            # doublons des exercices qui n'ont rien de commun : c'est la
            # suite qui porte le contenu, et c'est elle qu'on mesure.
            appui = t
            if t.endswith(":") and k + 1 < len(s["corps"]):
                appui = t + " " + s["corps"][k + 1]
            out.append(dict(zone=zone, titre=s["titre"], texte=t,
                            mots=_contenu(appui)))
    return out


SEUIL_RECOUVREMENT = 0.60
# Le QCM final est un test de reconnaissance sur l'œuvre entière : il a le
# droit de revenir sur un fait capital que le parcours a étudié — c'est même
# son métier. Il n'a pas le droit de recopier une question. On lui applique
# donc un seuil plus haut : un simple recouvrement de vocabulaire sur le même
# épisode ne compte pas, une quasi-copie compte.
SEUIL_QCM = 0.75
MOTS_PARTAGES_MIN = 3


def redondance(secs):
    """Questions qui en répètent une autre, ailleurs dans le cahier."""
    qs = _questions(secs)
    # Un mot présent partout ne prouve rien : le nom du héros revient dans
    # toutes les questions. On ne retient un rapprochement que s'il repose
    # sur au moins un mot rare à l'échelle du cahier.
    freq = defaultdict(int)
    for q in qs:
        for w in q["mots"]:
            freq[w] += 1
    seuil_rare = max(2, len(qs) // 5)

    paires = []
    for i, a in enumerate(qs):
        for b in qs[i + 1:]:
            if a["zone"] == b["zone"] and a["titre"] == b["titre"]:
                continue
            partages = a["mots"] & b["mots"]
            if len(partages) < MOTS_PARTAGES_MIN:
                continue
            r = _recouvrement(a["mots"], b["mots"])
            seuil = (SEUIL_QCM if "qcm" in (a["zone"], b["zone"])
                     else SEUIL_RECOUVREMENT)
            if r < seuil:
                continue
            if not any(freq[w] <= seuil_rare for w in partages):
                continue
            if _METHODE.search(a["texte"]) and _METHODE.search(b["texte"]):
                continue
            paires.append((a, b, r))
    return qs, sorted(paires, key=lambda x: -x[2])


# ═══════════════════════════════════════════════════ MARQUES DE LA COLLECTION
# Ce qu'un cahier doit porter pour appartenir à la collection. Chaque marque
# correspond à une correction faite une fois et qui doit tenir : sans cette
# garde, un cahier reconstruit après une modification du générateur pourrait
# perdre en silence l'entrée écrite pour l'élève ou le carnet de bord, et
# personne ne le verrait avant l'impression.
MARQUES = (
    ("l'entrée dans l'œuvre parle à l'élève",
     lambda t, h: any("Avant de lire" in x for x in h)),
    ("l'élève écrit son hypothèse de lecture",
     lambda t, h: "Mon hypothèse de lecture" in t),
    ("le contrat de lecture se coche",
     lambda t, h: "Mon contrat de lecture" in t and "☐" in t),
    ("le journal de lecture est fourni",
     lambda t, h: "Mon journal de lecture" in t),
    ("les consignes du professeur sont à part",
     lambda t, h: "Côté enseignant" in t),
    ("le carnet de bord accompagne la lecture",
     lambda t, h: any("Carnet de bord" in x for x in h)),
    ("le carnet avance par étapes, non par devoirs",
     lambda t, h: sum(1 for x in h if x.startswith("Étape ")) >= 3),
    ("le contrôle de lecture suit le carnet",
     lambda t, h: _rang(h, "Carnet de bord") < _rang(h, "Contrôle de lecture")),
    ("les six séquences sont au sommaire",
     lambda t, h: sum(1 for x in h
                      if "Séquence " in x and x[:1].isdigit()) == 6),
    ("plus aucun « bis » ni « ter »",
     lambda t, h: not _BIS.search(t)),
)

# « biscuit » contient « bis » : sans borne de mot, le contrôle accusait
# « Au cœur des ténèbres » à cause du biscuit offert par Marlow.
_BIS = re.compile(r"\b(bis|ter|quater|quinquies|sexies)\b")


def _rang(titres, motif):
    for i, x in enumerate(titres):
        if motif in x:
            return i
    return 10 ** 6


def collection(plein, secs):
    """Les marques de la collection qui manquent à ce cahier.

    `plein` doit contenir le texte des TABLEAUX : l'hypothèse de lecture et
    le journal sont des grilles, l'encadré du professeur une cellule. Un
    contrôle qui ne lirait que les paragraphes les déclarerait tous absents.
    """
    titres = [s["titre"] for s in secs]
    return [nom for nom, test in MARQUES if not test(plein, titres)]


# ════════════════════════════════════════════════════════════════ UNIFORMITÉ
def _squelette(secs):
    """Les titres de partie, débarrassés de leur numéro."""
    return [re.sub(r"^Partie\s+\d+\s+—\s+", "", s["titre"])
            for s in secs if s["niveau"] == 1]


def uniformite(plans):
    """Une rubrique présente presque partout, absente ou déplacée ailleurs."""
    m = []
    present = defaultdict(set)
    for cle, sq in plans.items():
        for t in sq:
            present[t].add(cle)
    n = len(plans)
    for titre, ou in sorted(present.items()):
        if len(ou) >= n - 1 and len(ou) < n:
            manque = sorted(set(plans) - ou)
            m.append(("absente", titre, manque))
    # ordre : rang moyen de chaque partie
    rangs = defaultdict(dict)
    for cle, sq in plans.items():
        for i, t in enumerate(sq):
            rangs[t][cle] = i
    for titre, par_cahier in sorted(rangs.items()):
        if len(par_cahier) < n - 1:
            continue
        vals = sorted(par_cahier.values())
        median = vals[len(vals) // 2]
        for cle, r in sorted(par_cahier.items()):
            if abs(r - median) >= 2:
                m.append(("déplacée", titre, [
                    "%s : rang %d au lieu de %d" % (cle, r + 1, median + 1)]))
    return m


# ══════════════════════════════════════════════════════════════════ ANALYSE
def analyser(cle, chemin=None):
    """`chemin` sert au banc de mutation : on analyse une copie abîmée
    exprès, et l'on vérifie que chaque défaut remonte bien."""
    chemin = chemin or os.path.join(RACINE, V.CAHIERS[cle][0])
    if not os.path.exists(chemin):
        return None
    ps = _paras(chemin)
    secs = _sections(ps)
    qs, paires = redondance(secs)
    return dict(cle=cle, ps=ps, secs=secs,
                hierarchie=hierarchie(secs),
                numerotation=numerotation(secs),
                etiquettes=etiquettes(secs),
                annonces=annonces(secs, ps),
                collection=collection(_texte_complet(chemin), secs),
                questions=qs, doublons=paires,
                squelette=_squelette(secs))


def verdict(r):
    return (r["hierarchie"] + r["numerotation"] + r["etiquettes"]
            + r["annonces"]
            + ["marque de la collection absente : %s" % x
               for x in r["collection"]]
            + ["question déjà posée : « %s » (%s) ≈ « %s » (%s)"
               % (a["texte"][:58], a["zone"], b["texte"][:58], b["zone"])
               for a, b, _ in r["doublons"]])


def main():
    cibles = [a for a in sys.argv[1:] if a in V.CAHIERS] or list(V.CAHIERS)
    print("=" * 78)
    print("  AUDIT DE STRUCTURE — organisation, numérotation, redondance")
    print("=" * 78)
    res = [x for x in (analyser(c) for c in cibles) if x]

    print("\n── REDONDANCE DES QUESTIONS ──────────────────────────────────────────────")
    print("  %-12s %8s %10s %s" % ("cahier", "questions", "doublons", "zones"))
    for r in res:
        z = defaultdict(int)
        for q in r["questions"]:
            z[q["zone"]] += 1
        print("  %-12s %8d %10d  %s"
              % (r["cle"], len(r["questions"]), len(r["doublons"]),
                 ", ".join("%s %d" % (k, v) for k, v in sorted(z.items()))))

    print("\n── ORGANISATION ──────────────────────────────────────────────────────────")
    print("  %-12s %10s %8s %8s %8s %12s"
          % ("cahier", "hiérarchie", "numéros", "étiq.", "annonces",
             "collection"))
    for r in res:
        print("  %-12s %10d %8d %8d %8d %12s"
              % (r["cle"], len(r["hierarchie"]), len(r["numerotation"]),
                 len(r["etiquettes"]), len(r["annonces"]),
                 "%d/%d" % (len(MARQUES) - len(r["collection"]), len(MARQUES))))

    if len(res) > 2:
        print("\n── UNIFORMITÉ DE LA COLLECTION ───────────────────────────────────────────")
        ecarts = uniformite({r["cle"]: r["squelette"] for r in res})
        if not ecarts:
            print("  ✓ les %d cahiers suivent le même plan" % len(res))
        for genre, titre, detail in ecarts:
            print("  ✗ « %s » %s — %s" % (titre[:44], genre, "; ".join(detail)))

    print("\n── VERDICT ───────────────────────────────────────────────────────────────")
    total = 0
    for r in res:
        m = verdict(r)
        total += len(m)
        if m:
            print("\n  %s (%d)" % (r["cle"], len(m)))
            for x in m:
                print("     ✗ %s" % x)
        else:
            print("  ✓ %-12s plan cohérent, aucune question répétée" % r["cle"])
    print("\n" + "=" * 78)
    print("  %d remarque(s) sur %d cahier(s)." % (total, len(res)))
    return total


if __name__ == "__main__":
    sys.exit(1 if main() else 0)
