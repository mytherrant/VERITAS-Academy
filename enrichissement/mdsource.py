# -*- coding: utf-8 -*-
"""
Reconstitution des sections conservées d'un cahier, à partir de deux sources
complémentaires laissées par la session précédente :

  • `scratchpad/dx/<cahier>.txt` — extraction linéaire du .docx d'origine.
    Le parcours descendait dans les cellules de tableau : l'ORDRE réel du
    document y est donc respecté, mais tout est aplati en paragraphes.

  • `graphify-out/converted/<cahier>_*.md` — conversion markdown. Elle donne
    les NIVEAUX DE TITRE et la STRUCTURE DES TABLEAUX, mais rejette tous les
    tableaux à la fin du fichier : son ordre est inutilisable.

On croise les deux : l'ordre vient du .txt, la structure vient du .md.
"""
import glob
import os
import re

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
CONVERTED = os.path.join(RACINE, "graphify-out", "converted")
DX = os.path.join(os.environ.get("TEMP", ""), "claude",
                  "C--Users-Mythe-Errant-Downloads-Claude-code")

BADGES = {"💡": "astuce", "🔎": "saviez", "⚠": "vigilance", "🧰": "methode",
          "🎯": "objectif"}


def _dx_path(base):
    motif = os.path.join(DX, "*", "scratchpad", "dx", base.replace(".docx", ".txt"))
    trouves = glob.glob(motif)
    if not trouves:
        raise FileNotFoundError("extraction linéaire introuvable : %s" % motif)
    return max(trouves, key=os.path.getmtime)


def _md_path(base):
    motif = os.path.join(CONVERTED, base.replace(".docx", "") + "_*.md")
    trouves = glob.glob(motif)
    if not trouves:
        raise FileNotFoundError("conversion markdown introuvable : %s" % motif)
    return trouves[0]


def _titres(md):
    """{texte normalisé: niveau} d'après les titres markdown."""
    out = {}
    for ligne in md.split("\n"):
        m = re.match(r"^(#{1,3})\s+(.*)$", ligne.rstrip())
        if m:
            out[_norm(m.group(2))] = len(m.group(1))
    return out


def _grilles(md):
    """Tableaux markdown, sous forme de listes de lignes de cellules."""
    grilles, courant = [], []
    for ligne in md.split("\n"):
        s = ligne.strip()
        if s.startswith("|"):
            cells = [c.strip() for c in s.strip("|").split("|")]
            if not all(re.fullmatch(r":?-{2,}:?", c or "-") for c in cells):
                courant.append(cells)
            continue
        if courant:
            grilles.append(courant)
            courant = []
    if courant:
        grilles.append(courant)
    # on ne garde que les vraies grilles : au moins 2 lignes et 2 colonnes
    return [g for g in grilles if len(g) >= 2 and max(len(r) for r in g) >= 2]


def _norm(s):
    return re.sub(r"\s+", " ", (s or "")).strip().lower()


def lire(base_docx):
    """Renvoie la liste de blocs des sections d'origine, dans l'ordre réel."""
    lignes = [l.rstrip() for l in
              open(_dx_path(base_docx), encoding="utf8").read().split("\n")]
    lignes = [l for l in lignes if l.strip()]
    md = open(_md_path(base_docx), encoding="utf8").read()
    titres = _titres(md)
    grilles = _grilles(md)

    # Index des cellules de grille, pour repérer les suites de lignes aplaties.
    # `bornes[r]` retient combien de cellules non vides comptent les r+1
    # premières lignes : c'est ce qui permet, plus bas, de n'accepter qu'un
    # nombre entier de lignes quand la fin du tableau ne correspond pas.
    attendus = []
    for g in grilles:
        plat, bornes = [], []
        for r in g:
            plat += [_norm(c) for c in r if _norm(c)]
            bornes.append(len(plat))
        if plat:
            attendus.append((plat, bornes, g))

    # Chaque intitulé de section figure deux fois : d'abord dans le sommaire,
    # puis comme titre réel. Seule la dernière occurrence est un vrai titre.
    derniere = {}
    for k, l in enumerate(lignes):
        n = _norm(l)
        if n in titres:
            derniere[n] = k

    blocs, i = [], 0
    while i < len(lignes):
        ligne = lignes[i]
        n = _norm(ligne)

        # 1. titre ? (uniquement la dernière occurrence : voir plus haut)
        # Le test passe AVANT celui des grilles : un vrai titre n'est jamais
        # une cellule de tableau, et le laisser absorber ferait disparaître
        # une section entière du document.
        if n in titres and derniere.get(n) == i:
            blocs.append(("h%d" % titres[n], ligne.strip()))
            i += 1
            continue

        # 2. une grille commence-t-elle ici ?
        #
        # La conversion markdown colle parfois au tableau une cellule qui n'en
        # est pas une — une citation qui le suit, le plus souvent. Exiger la
        # correspondance de TOUTES les cellules faisait alors échouer la
        # reconstruction, et le tableau s'imprimait en autant de paragraphes
        # que de cellules : quarante-cinq tableaux ainsi aplatis sur les cinq
        # cahiers relus, dont les listes de personnages et les tableaux d'axes.
        #
        # On accepte donc le plus long préfixe qui forme des LIGNES ENTIÈRES.
        # Ce qui reste sort en paragraphes, comme avant, mais le tableau, lui,
        # est un tableau.
        pris = False
        for plat, bornes, g in attendus:
            if not plat or n != plat[0]:
                continue
            k, j = 0, i
            while (k < len(plat) and j < len(lignes)
                   and _norm(lignes[j]) == plat[k]
                   and derniere.get(_norm(lignes[j])) != j):   # jamais un titre
                k += 1
                j += 1
            if k < 4:
                continue
            # dernière ligne du tableau entièrement retrouvée
            r = max((x for x, borne in enumerate(bornes) if borne <= k),
                    default=-1)
            if r < 1:                       # moins de deux lignes : ce n'en est pas un
                continue
            blocs.append(("grille", g[:r + 1]))
            i += bornes[r]
            pris = True
            break
        if pris:
            continue

        # 3. encadré signalé par un pictogramme ?
        if ligne.strip()[:1] in BADGES:
            typ = BADGES[ligne.strip()[:1]]
            corps = ligne.strip()[1:].lstrip()
            titre, _, reste = corps.partition(".")
            blocs.append(("encadre", typ, titre.strip(),
                          [reste.strip()] if reste.strip() else [corps]))
            i += 1
            continue

        # 4. citation ou extrait entre guillemets français ?
        if ligne.strip().startswith("«") and len(ligne.split()) >= 40:
            source = ""
            suivante = lignes[i + 1].strip() if i + 1 < len(lignes) else ""
            # La légende ne doit jamais être un titre : l'absorber ferait
            # disparaître une section entière.
            if (suivante and len(suivante.split()) <= 25
                    and not suivante.startswith("«")
                    and derniere.get(_norm(suivante)) != i + 1):
                source = suivante
            blocs.append(("extrait", ligne.strip(), source))
            i += 2 if source else 1
            continue

        blocs.append(("p", ligne.strip()))
        i += 1

    return blocs
