# -*- coding: utf-8 -*-
"""Le banc qui éprouve `audit1c.py` — en cassant volontairement le contenu.

    python premier_cycle/audit_banc.py          # sur la 3ᵉ
    python premier_cycle/audit_banc.py 6e 5e    # sur d'autres volumes

`audit1c.py` promet huit contrôles. Tant qu'aucun n'a **rougi**, on n'a
aucune preuve qu'il en exerce un seul : un contrôle toujours vert et un
contrôle débranché rendent exactement la même sortie. Ce banc introduit donc
une avarie à la fois — un mot changé dans un extrait, une lecture suivie
raccourcie, un point retiré du barème, un corrigé de jeu supprimé — et exige
que l'audit la signale, **avec la bonne étiquette**.

Rien n'est écrit sur le disque : chaque avarie est posée en mémoire, le temps
d'un contrôle, puis retirée. Le dépôt ressort intact, et `audit1c.py` doit
retomber à zéro problème à la fin du banc — c'est le neuvième contrôle, et il
porte sur le banc lui-même.
"""
import os
import re
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
if ICI not in sys.path:
    sys.path.insert(0, ICI)

import audit1c
import source
from build_1c import MANUELS


# ------------------------------------------------------------- outillage

def _module(cle):
    return __import__(MANUELS[cle]["module"])


def _sous_modules(mod):
    """Les modules d'œuvre importés par un volume, dans l'ordre du fichier."""
    vus = []
    for nom in dir(mod):
        sous = getattr(mod, nom)
        if hasattr(sous, "CLE") and getattr(sous, "CLE") in source.FICHIERS:
            vus.append(sous)
    return vus


def _greffer(mod, transforme):
    """Fait passer les blocs du volume par `transforme` avant l'audit.

    On enveloppe `manuel()` au lieu de réécrire un module : l'avarie ne
    touche jamais un fichier, et la remise en état ne peut pas être oubliée.

    La transformation est d'abord **essayée à blanc**. Un volume sans poésie
    n'a pas de référence à abîmer, et il vaut mieux le dire — « avarie
    impossible à poser » — que de laisser l'audit trébucher sur une erreur
    de construction, qu'on prendrait pour un contrôle qui a réagi.
    """
    origine = mod.manuel
    blocs, corriges = origine()
    if transforme(list(blocs), list(corriges)) is None:
        return None

    def manuel():
        b, c = origine()
        return transforme(list(b), list(c))

    mod.manuel = manuel
    return lambda: setattr(mod, "manuel", origine)


def _lectures(blocs):
    """Les extraits de lecture suivie, avec leur rang dans la liste."""
    out, titre = [], ""
    for i, b in enumerate(blocs):
        if b[0] == "h3":
            titre = b[1]
        elif b[0] == "extrait" and titre.startswith("Lecture suivie"):
            out.append(i)
    return out


def _premiere_lecture(blocs, poesie):
    """Le premier extrait de lecture suivie pris dans une œuvre en vers —
    ou hors des vers, selon `poesie`. Les deux contrôles de longueur ne
    portent pas sur les mêmes extraits : il faut savoir viser."""
    for i in _lectures(blocs):
        legende = blocs[i][2]
        en_vers = re.search(r"(?i)poème|poèmes", legende) is not None
        if en_vers == poesie:
            return i
    return None


# ---------------------------------------------------------- les avaries

def _avarie_verbatim(blocs, corriges):
    i = _premiere_lecture(blocs, poesie=False)
    if i is None:
        return None
    b = blocs[i]
    texte = b[1].replace(" et ", " ainsi que ", 1)
    blocs[i] = ("extrait", texte) + tuple(b[2:])
    return blocs, corriges


def _avarie_court(blocs, corriges):
    i = _premiere_lecture(blocs, poesie=False)
    if i is None:
        return None
    b = blocs[i]
    court = " ".join(b[1].split()[:60])
    blocs[i] = ("extrait", court) + tuple(b[2:])
    return blocs, corriges


def _avarie_unite(blocs, corriges):
    i = _premiere_lecture(blocs, poesie=True)
    if i is None:
        return None
    b = blocs[i]
    legende = re.sub(r"(?i)poèmes? entiers?", "extrait", b[2])
    blocs[i] = ("extrait", b[1], legende) + tuple(b[3:])
    return blocs, corriges


def _avarie_corrige(blocs, corriges):
    """On retire le corrigé du premier jeu — l'élève garde la grille, et
    plus personne ne peut la vérifier."""
    for i, b in enumerate(corriges):
        if b[0] == "h3" and b[1].startswith("Mots mêlés"):
            del corriges[i]
            return blocs, corriges
    return None


def _avarie_scan(cle):
    """Une soudure de numérisation, posée dans le texte de l'œuvre.

    Elle est posée **dans le cache de `source`**, avant que le volume ne soit
    construit : l'extrait la reprendra en se découpant, et le texte de
    référence l'aura aussi. Sans cela, l'extrait ne se retrouverait plus dans
    l'œuvre et c'est le contrôle du verbatim qui rougirait — on n'aurait rien
    prouvé du contrôle de scan.
    """
    mod = _module(cle)
    blocs, _ = mod.manuel()
    i = _premiere_lecture(blocs, poesie=False)
    if i is None:
        return None
    voc = audit1c.vocabulaire()
    mots = re.findall(r"[\w'-]+|\s+|[^\w\s]", blocs[i][1])
    paires = [(a, b) for a, b in zip(mots, mots[2:])
              if a.isalpha() and b.isalpha() and len(a) >= 6 and len(b) >= 6
              and voc[a.lower()] >= 5 and voc[b.lower()] >= 5
              and voc[(a + b).lower()] == 0]

    # On soude **dans le passage de cet extrait**, et non à la première
    # occurrence venue. Et l'on essaie les paires l'une après l'autre : deux
    # mots pris au hasard dans un extrait peuvent former l'amorce d'un autre
    # extrait du volume, et la découpe échouerait alors au lieu de produire
    # la soudure qu'on veut faire voir au contrôle.
    tete = blocs[i][1][:60]
    cles = [s.CLE for s in _sous_modules(mod)]
    for a, b in paires:
        cible, soudure = "%s %s" % (a, b), a + b
        for k in cles:
            entier = source.texte(k)
            depart = entier.find(tete)
            pose = entier.find(cible, depart) if depart >= 0 else -1
            if pose < 0:
                continue
            source._CACHE[k] = (entier[:pose] + soudure
                                + entier[pose + len(cible):])
            try:
                mod.manuel()
            except Exception:                             # noqa: BLE001
                source._CACHE[k] = entier
                break
            return lambda: source._CACHE.__setitem__(k, entier)
    return None


def _avarie_ortho(cle, quoi):
    """Barème faussé, entrée manquante, ou faute annoncée qui n'est pas dans
    le texte. On mute la table du dernier module d'œuvre du volume."""
    sous = _sous_modules(_module(cle))
    for mod in reversed(sous):
        table = getattr(mod, "ORTHO_CORRIGE", None)
        if not table:
            continue
        origine = list(table)
        neuve = [list(l) for l in origine]
        if quoi == "bareme":
            neuve[0][-1] = "1,5"
        elif quoi == "fautes":
            neuve.pop()
        else:                                    # absente
            neuve[0][1] = "**un mot qui n'y est pas**"
        mod.ORTHO_CORRIGE = neuve
        return lambda: setattr(mod, "ORTHO_CORRIGE", origine)
    return None


AVARIES = [
    ("un mot changé dans une lecture suivie", "VERBATIM",
     lambda cle: _greffer(_module(cle), _avarie_verbatim)),
    ("une lecture suivie ramenée à 60 mots", "COURT",
     lambda cle: _greffer(_module(cle), _avarie_court)),
    ("la référence d'un poème qui ne dit plus « poème entier »", "UNITE",
     lambda cle: _greffer(_module(cle), _avarie_unite)),
    ("deux mots soudés par le scan", "SCAN", _avarie_scan),
    ("un barème qui ne fait plus vingt points", "BAREME",
     lambda cle: _avarie_ortho(cle, "bareme")),
    ("une quinzième faute disparue", "FAUTES",
     lambda cle: _avarie_ortho(cle, "fautes")),
    ("une faute annoncée qui n'est pas dans le texte", "ABSENTE",
     lambda cle: _avarie_ortho(cle, "absente")),
    ("le corrigé d'un jeu supprimé", "CORRIGE",
     lambda cle: _greffer(_module(cle), _avarie_corrige)),
]


# ------------------------------------------------------------- le banc

def _etiquettes(cle):
    try:
        return [e.split()[0] for e in audit1c.controler(cle)["ennuis"]]
    except Exception as exc:                              # noqa: BLE001
        return ["ERREUR(%s)" % exc]


def eprouver(cle):
    print("== %s ==" % cle)
    rouges = _etiquettes(cle)
    if rouges:
        print("   ! le volume n'est pas propre au départ : %s"
              % ", ".join(sorted(set(rouges))))
        return 1, 0

    echecs, sautees = 0, 0
    for libelle, attendu, poser in AVARIES:
        retirer = poser(cle)
        if retirer is None:
            print("   --  %-52s  sans objet dans ce volume" % libelle)
            sautees += 1
            continue
        try:
            vu = _etiquettes(cle)
        finally:
            retirer()
        ok = attendu in vu
        echecs += 0 if ok else 1
        print("   %-3s %-52s  %-9s %s"
              % ("ok" if ok else "!!", libelle, attendu,
                 "attrapée" if ok else "PASSÉE INAPERÇUE (%s)"
                 % (", ".join(sorted(set(vu))) or "aucun signalement")))

    reste = _etiquettes(cle)
    if reste:
        print("   !!  le banc n'a pas tout remis en place : %s"
              % ", ".join(sorted(set(reste))))
        echecs += 1
    else:
        print("   ok  volume rendu intact après les avaries")
    return echecs, sautees


def main(cibles):
    total = sansobjet = 0
    for cle in cibles:
        echecs, sautees = eprouver(cle)
        total += echecs
        sansobjet += sautees
    if total:
        print("\n%d contrôle(s) sans preuve." % total)
    else:
        print("\nChaque contrôle rougit quand il le faut%s."
              % (" (%d avarie(s) sans objet : pas de poésie au programme)"
                 % sansobjet if sansobjet else ""))
    return total


if __name__ == "__main__":
    sys.exit(1 if main(sys.argv[1:] or ["3e"]) else 0)
