# -*- coding: utf-8 -*-
"""Les jeux du manuel : grilles, appariements, QCM, cartes mentales.

Un élève de sixième ne relit pas une œuvre parce qu'on le lui demande ; il la
relit pour retrouver un mot dans une grille. Tous les jeux d'ici sont donc
**alimentés par l'œuvre elle-même** — noms des personnages, lieux, objets
relevés dans le texte — et non par un vocabulaire décoratif : chercher
« MVOMO » dans une grille oblige à se rappeler qui est Mvomo.

Chaque fabrique rend deux listes de blocs : ce que l'élève voit, et le corrigé,
qui part en fin de volume. Le tirage est **déterminé par une graine** : deux
constructions successives donnent le même manuel, sans quoi un corrigé imprimé
la veille ne vaudrait plus rien le lendemain.
"""
import random
import unicodedata

ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"


def _cle(mot):
    """La forme d'un mot dans une grille : capitales, sans accent ni signe."""
    s = unicodedata.normalize("NFD", mot.upper())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return "".join(c for c in s if c in ALPHABET)


def _propres(mots, minimum=3):
    """Dédoublonne en gardant l'ordre : deux fois le même mot dans une grille
    donne un mot introuvable et un élève qui cherche pour rien."""
    out, vus = [], set()
    for x in mots:
        m = _cle(x)
        if len(m) >= minimum and m not in vus:
            vus.add(m)
            out.append(m)
    return out


# ------------------------------------------------------------- mots mêlés

_DIRECTIONS = [(0, 1), (1, 0), (1, 1), (1, -1), (0, -1), (-1, 0)]
_SENS = {(0, 1): "→", (1, 0): "↓", (1, 1): "↘", (1, -1): "↙",
         (0, -1): "←", (-1, 0): "↑"}


def mots_meles(titre, mots, consigne=None, taille=None, graine=1):
    """Une grille de lettres où se cachent les mots donnés.

    Les mots sont placés du plus long au plus court : commencer par les courts
    remplit la grille de fragments et laisse le mot de neuf lettres sans place.
    Les cases restantes reçoivent des lettres tirées au hasard, mais
    **pondérées par les mots eux-mêmes** — un remplissage uniforme fait
    ressortir les mots à l'œil, et la grille se résout sans lire l'œuvre.
    """
    rng = random.Random(graine)
    propres = _propres(mots)
    n = taille or max(11, min(16, max(len(m) for m in propres) + 3))
    grille = [[None] * n for _ in range(n)]
    places, refuses = {}, []

    for mot in sorted(propres, key=len, reverse=True):
        essais = [(r, c, d) for r in range(n) for c in range(n) for d in _DIRECTIONS]
        rng.shuffle(essais)
        pose = None
        for r, c, (dr, dc) in essais:
            rf, cf = r + dr * (len(mot) - 1), c + dc * (len(mot) - 1)
            if not (0 <= rf < n and 0 <= cf < n):
                continue
            if all(grille[r + dr * i][c + dc * i] in (None, mot[i])
                   for i in range(len(mot))):
                pose = (r, c, dr, dc)
                break
        if pose is None:
            refuses.append(mot)
            continue
        r, c, dr, dc = pose
        for i, ch in enumerate(mot):
            grille[r + dr * i][c + dc * i] = ch
        places[mot] = (r + 1, c + 1, dr, dc)

    sac = "".join(propres) or ALPHABET
    for r in range(n):
        for c in range(n):
            if grille[r][c] is None:
                grille[r][c] = rng.choice(sac if rng.random() < 0.6 else ALPHABET)

    liste = "  ·  ".join(sorted(places, key=len, reverse=True))
    eleve = [("h3", "🎲 Mots mêlés — " + titre),
             ("p", consigne or "Les mots ci-dessous sont cachés dans la grille : "
                               "horizontalement, verticalement, en diagonale, et "
                               "parfois à l'envers. Entoure-les."),
             ("p", "**Mots à trouver :** " + liste),
             ("grille", [list(ligne) for ligne in grille])]
    if refuses:
        eleve.append(("pi", "(mots écartés faute de place : %s)" % ", ".join(refuses)))

    corrige = [("h3", "Mots mêlés — " + titre),
               ("grille", [["Mot", "Ligne", "Colonne", "Sens"]]
                + [[m, str(v[0]), str(v[1]), _SENS[(v[2], v[3])]]
                   for m, v in sorted(places.items())])]
    return eleve, corrige


# ----------------------------------------------------------- mots croisés

def _croiser(entrees, graine):
    """Une tentative de grille. Rend (cases, poses, restants, définitions).

    L'ordre de présentation des mots change à chaque tirage : c'est lui, bien
    plus que le choix des croisements, qui décide du nombre de mots casés —
    un mot long posé en premier ouvre des lettres à tous les autres, posé en
    dernier il ne trouve plus de place.
    """
    rng = random.Random(graine)
    items, vus = [], set()
    for m, d in entrees:
        k = _cle(m)
        if len(k) >= 3 and k not in vus:
            vus.add(k)
            items.append((k, d))
    if not items:
        return None
    defs = dict(items)
    ordre = sorted(items, key=lambda it: -len(it[0]))
    tete = ordre[0]
    reste = ordre[1:]
    rng.shuffle(reste)
    items = [tete] + reste

    cases, poses = {}, []

    def libre(mot, r, c, hor):
        """Nombre de croisements si le mot tient ici, 0 s'il ne tient pas."""
        dr, dc = (0, 1) if hor else (1, 0)
        if (r - dr, c - dc) in cases or (r + dr * len(mot), c + dc * len(mot)) in cases:
            return 0
        croisements = 0
        for i, ch in enumerate(mot):
            rr, cc = r + dr * i, c + dc * i
            ici = cases.get((rr, cc))
            if ici is not None:
                if ici != ch:
                    return 0
                croisements += 1
            else:
                for sr, sc in (((-1, 0), (1, 0)) if hor else ((0, -1), (0, 1))):
                    if (rr + sr, cc + sc) in cases:
                        return 0
        return croisements

    premier = items[0][0]
    for i, ch in enumerate(premier):
        cases[(0, i)] = ch
    poses.append((premier, 0, 0, True))
    restants = items[1:]

    progres = True
    while restants and progres:
        progres = False
        for item in list(restants):
            mot = item[0]
            candidats = []
            for (r, c), lettre in list(cases.items()):
                for i, ch in enumerate(mot):
                    if ch != lettre:
                        continue
                    for hor in (True, False):
                        rr = r if hor else r - i
                        cc = c - i if hor else c
                        k = libre(mot, rr, cc, hor)
                        if k:
                            candidats.append((k, rr, cc, hor))
            if not candidats:
                continue
            rng.shuffle(candidats)
            candidats.sort(key=lambda x: -x[0])
            _, r, c, hor = candidats[0]
            dr, dc = (0, 1) if hor else (1, 0)
            for i, ch in enumerate(mot):
                cases[(r + dr * i, c + dc * i)] = ch
            poses.append((mot, r, c, hor))
            restants.remove(item)
            progres = True
    return cases, poses, restants, defs


def mots_croises(titre, entrees, graine=1, marge=1, tirages=40):
    """Une grille de mots croisés bâtie par croisements successifs.

    `entrees` est une liste de couples (mot, définition). Un mot qui ne croise
    rien est écarté plutôt que posé isolément : une grille où deux mots
    flottent côte à côte n'est pas une grille de mots croisés. On interdit
    aussi les mots parallèles collés, qui feraient lire verticalement des
    suites de lettres que personne n'a définies.

    Ces deux règles sont strictes, et une seule tentative laisse souvent la
    moitié des mots dehors : on construit donc `tirages` grilles avec des
    ordres de départ différents et l'on garde **celle qui en place le plus**.
    """
    meilleur = None
    for essai in range(max(1, tirages)):
        grille = _croiser(entrees, graine * 1000 + essai)
        if grille and (meilleur is None or len(grille[1]) > len(meilleur[1])):
            meilleur = grille
            if not grille[2]:          # tous les mots placés : inutile d'insister
                break
    if meilleur is None:
        return [], []
    cases, poses, restants, defs = meilleur
    rmin = min(r for r, _ in cases) - marge
    rmax = max(r for r, _ in cases) + marge
    cmin = min(c for _, c in cases) - marge
    cmax = max(c for _, c in cases) + marge

    numeros, prochain = {}, 1
    for mot, r, c, hor in sorted(poses, key=lambda x: (x[1], x[2])):
        if (r, c) not in numeros:
            numeros[(r, c)] = prochain
            prochain += 1

    def dessiner(avec_lettres):
        out = []
        for r in range(rmin, rmax + 1):
            ligne = []
            for c in range(cmin, cmax + 1):
                if (r, c) not in cases:
                    ligne.append("■")
                elif avec_lettres:
                    ligne.append(cases[(r, c)])
                else:
                    ligne.append(str(numeros[(r, c)]) if (r, c) in numeros else "")
            out.append(ligne)
        return out

    hor = sorted((numeros[(r, c)], m) for m, r, c, h in poses if h)
    ver = sorted((numeros[(r, c)], m) for m, r, c, h in poses if not h)
    eleve = [("h3", "🎲 Mots croisés — " + titre),
             ("p", "Les cases noires **■** ne se remplissent pas. Le chiffre "
                   "écrit dans une case annonce le début d'un mot."),
             ("grille", dessiner(False)),
             ("p", "**Horizontalement**")]
    eleve += [("puce", "**%d.** %s" % (n, defs.get(m, ""))) for n, m in hor]
    eleve.append(("p", "**Verticalement**"))
    eleve += [("puce", "**%d.** %s" % (n, defs.get(m, ""))) for n, m in ver]
    if restants:
        eleve.append(("pi", "(mots écartés faute de croisement : %s)"
                      % ", ".join(m for m, _ in restants)))
    corrige = [("h3", "Mots croisés — " + titre), ("grille", dessiner(True))]
    return eleve, corrige


# --------------------------------------------------------------- relier

_LETTRES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"


def _derange(liste, rng, essais=60):
    """Mélange sans point fixe : une ligne restée en face de sa réponse
    donne un point gratuit et gâche l'exercice."""
    melange = list(liste)
    for _ in range(essais):
        rng.shuffle(melange)
        if all(a != b for a, b in zip(liste, melange)):
            break
    return melange


def relier(titre, couples, consigne=None, graine=1):
    """Deux colonnes à relier d'un trait."""
    rng = random.Random(graine)
    gauche = [g for g, _ in couples]
    droite = [d for _, d in couples]
    melange = _derange(droite, rng)
    eleve = [("h3", "🔗 Relie — " + titre),
             ("p", consigne or "Relie chaque élément de la colonne A à ce qui lui "
                               "correspond dans la colonne B. Écris la lettre dans "
                               "la case du milieu."),
             ("grille", [["Colonne A", "Ma réponse", "Colonne B"]]
              + [["**%d.** %s" % (i + 1, g), "……",
                  "**%s.** %s" % (_LETTRES[i], melange[i])]
                 for i, g in enumerate(gauche)])]
    corrige = [("h3", "Relie — " + titre),
               ("p", "  ·  ".join("%d → %s" % (i + 1, _LETTRES[melange.index(d)])
                                  for i, d in enumerate(droite)))]
    return eleve, corrige


# ------------------------------------------------------------------ QCM

def qcm(titre, questions, consigne=None):
    """Questions à choix multiple : (énoncé, [choix], index de la bonne)."""
    lettres = "abcde"
    eleve = [("h3", "❓ QCM — " + titre),
             ("p", consigne or "Une seule réponse est exacte. Entoure la lettre.")]
    for i, (enonce, choix, _) in enumerate(questions, 1):
        eleve.append(("p", "**%d.** %s" % (i, enonce)))
        eleve.append(("p", "    " + "    ".join(
            "**%s)** %s" % (lettres[j], c) for j, c in enumerate(choix))))
    corrige = [("h3", "QCM — " + titre),
               ("p", "  ·  ".join("**%d.** %s" % (i, lettres[bon])
                                  for i, (_, _, bon) in enumerate(questions, 1)))]
    return eleve, corrige


# ------------------------------------------------------------- vrai / faux

def vrai_faux(titre, items, consigne=None):
    """(affirmation, vrai ?, justification) — la justification part au corrigé."""
    eleve = [("h3", "✅ Vrai ou faux ? — " + titre),
             ("p", consigne or "Coche la bonne case, puis dis en une ligne "
                               "pourquoi. C'est la justification qui rapporte les "
                               "points, pas la croix."),
             ("grille", [["N°", "Affirmation", "V", "F", "Parce que…"]]
              + [[str(i), a, "☐", "☐", ""] for i, (a, _, _) in enumerate(items, 1)])]
    corrige = [("h3", "Vrai ou faux ? — " + titre),
               ("grille", [["N°", "Réponse", "Justification"]]
                + [[str(i), "VRAI" if v else "FAUX", j]
                   for i, (_, v, j) in enumerate(items, 1)])]
    return eleve, corrige


# --------------------------------------------------------- texte à trous

def texte_a_trous(titre, phrases, mots, consigne=None, graine=1):
    """Un résumé troué ; la banque de mots arrive en désordre sous le texte."""
    rng = random.Random(graine)
    banque = list(mots)
    rng.shuffle(banque)
    eleve = [("h3", "✏️ Texte à trous — " + titre),
             ("p", consigne or "Complète le résumé avec les mots de la banque. "
                               "Attention : ils sont en désordre, et il n'y a pas "
                               "d'intrus.")]
    eleve += [("p", ph) for ph in phrases]
    eleve.append(("encadre", "mot", "Banque de mots", ["  ·  ".join(banque)]))
    corrige = [("h3", "Texte à trous — " + titre),
               ("p", "  ·  ".join("(%d) %s" % (i, m) for i, m in enumerate(mots, 1)))]
    return eleve, corrige


# --------------------------------------------------------- remise en ordre

def remise_en_ordre(titre, evenements, consigne=None, graine=1):
    """Les moments de l'histoire, mélangés, à renuméroter."""
    rng = random.Random(graine)
    indices = _derange(list(range(len(evenements))), rng)
    eleve = [("h3", "🔢 Remets dans l'ordre — " + titre),
             ("p", consigne or "Ces moments de l'histoire ont été mélangés. "
                               "Numérote-les de 1 à %d." % len(evenements)),
             ("grille", [["Lettre", "N°", "Ce qui se passe"]]
              + [[_LETTRES[rang], "……", evenements[k]]
                 for rang, k in enumerate(indices)])]
    corrige = [("h3", "Remets dans l'ordre — " + titre),
               ("p", "  ·  ".join("%s → %d" % (_LETTRES[rang], k + 1)
                                  for rang, k in enumerate(indices)))]
    return eleve, corrige


# ------------------------------------------------------------ qui suis-je

def qui_suis_je(titre, devinettes, consigne=None):
    """(présentation à la première personne, réponse)."""
    eleve = [("h3", "🕵️ Qui suis-je ? — " + titre),
             ("p", consigne or "Chaque personnage se présente sans dire son nom. "
                               "À toi de le démasquer.")]
    for i, (txt, _) in enumerate(devinettes, 1):
        eleve.append(("p", "**%d.** « %s »" % (i, txt)))
        eleve.append(("p", "Je suis : ……………………………………………………………"))
    corrige = [("h3", "Qui suis-je ? — " + titre),
               ("p", "  ·  ".join("**%d.** %s" % (i, r)
                                  for i, (_, r) in enumerate(devinettes, 1)))]
    return eleve, corrige


# ---------------------------------------------------------- carte mentale

def carte_mentale(titre, centre, branches, a_completer=True):
    """Une carte à lire d'un coup d'œil : le cœur, puis les branches autour.

    Word ne dessine pas de rayons ; on obtient la même lecture avec un tableau
    dont la colonne du milieu porte le cœur de la carte et les colonnes
    latérales les branches. La dernière branche reste **à écrire** : une carte
    livrée complète se regarde, une carte à finir se travaille.
    """
    gauche, droite = branches[::2], branches[1::2]
    hauteur = max(len(gauche), len(droite))
    milieu = (hauteur - 1) // 2
    lignes = [["◄ Branche", "◆  " + centre + "  ◆", "Branche ►"]]
    for i in range(hauteur):
        g = gauche[i] if i < len(gauche) else None
        d = droite[i] if i < len(droite) else None
        cg = "**%s**\n%s" % (g[0], "\n".join("· " + x for x in g[1])) if g else ""
        cd = "**%s**\n%s" % (d[0], "\n".join("· " + x for x in d[1])) if d else ""
        cc = "◄────┼────►" if i == milieu else "│"
        lignes.append([cg, cc, cd])
    blocs = [("h3", "🧠 Ma carte mentale — " + titre), ("grille", lignes)]
    if a_completer:
        blocs.append(("encadre", "jeu", "Ajoute ta branche", [
            "Cette carte n'est pas finie : il y manque **la tienne**.",
            "Trouve un lien que personne n'a écrit — un mot qui revient, une "
            "image, une scène qui ressemble à une autre — et dessine-le sur une "
            "feuille libre.",
            "Titre de ma branche : ………………………………………………………………",
            "Ce que j'y mets : ……………………………………………………………………"]))
    return blocs
