# -*- coding: utf-8 -*-
"""Repères visuels propres au premier cycle, greffés sur `docxkit`.

Les neuf cahiers du second cycle parlent à des candidats au Probatoire ; ici
le lecteur a onze ans. Il lui faut des encadrés qui **appellent** — un animal,
un personnage, un lieu, une blague — et non des rubriques d'appareil critique.
On ajoute donc des types d'encadrés au dictionnaire de `docxkit` au lieu de
modifier ce module : les cahiers du second cycle continuent de se construire
à l'identique, et un type inconnu retomberait de toute façon sur le gris neutre.
"""
import os
import sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if RACINE not in sys.path:
    sys.path.insert(0, RACINE)

from enrichissement import docxkit  # noqa: E402
from enrichissement.docxkit import render, typographie, words  # noqa: F401,E402

# Les couleurs restent celles de la collection (bleu nuit / or) : ce sont des
# fonds pâles, imprimables en noir et blanc sans que le texte devienne illisible.
FILLS_1C = {
    "animal": "E7F0E2",     # vert forêt très clair — les bêtes des contes
    "perso": "EDE7F5",      # parme — qui est qui
    "lieu": "E2EFF4",       # bleu lagune — c'est où sur la carte
    "rire": "FCF0DC",       # sable — le coin du rire
    "mot": "F1F1E8",        # lin — les mots difficiles
    "jeu": "FBE7EF",        # rose pâle — à toi de jouer
    "defi": "E9F3FA",       # ciel — le défi du chapitre
    "culture": "F0EAE0",    # terre — coutume, métier, objet
}
BADGES_1C = {
    "animal": "🐾 Le savais-tu ?",
    "perso": "👤 Qui est qui ?",
    "lieu": "📍 C'est où ?",
    "rire": "😄 Le coin du rire.",
    "mot": "🔑 Les mots difficiles.",
    "jeu": "🎲 À toi de jouer !",
    "defi": "🏆 Défi.",
    "culture": "🌍 Le savais-tu ?",
}
docxkit.FILLS.update(FILLS_1C)
docxkit.BADGES.update(BADGES_1C)
docxkit.PICTOS = "".join(sorted({b[0] for b in docxkit.BADGES.values()}))


# ------------------------------------------------------------- raccourcis

def h1(t): return ("h1", t)
def h2(t): return ("h2", t)
def h3(t): return ("h3", t)
def p(t): return ("p", t)
def pi(t): return ("pi", t)
def puce(t): return ("puce", t)
def num(t): return ("num", t)
def saut(): return ("saut",)
def grille(lignes): return ("grille", lignes)
def extrait(texte, source, forme=None):
    return ("extrait", texte, source) if forme is None else ("extrait", texte, source, forme)
def enc(typ, titre, corps): return ("encadre", typ, titre, corps)


def lignes(n=2, largeur=92):
    """Les pointillés sur lesquels l'élève écrit.

    Un cahier d'activités sans place pour répondre renvoie l'élève à une
    feuille volante, et la réponse se perd : le reproche est documenté.
    """
    return [("p", "." * largeur) for _ in range(n)]


def cases(items):
    """Une liste à cocher, cochée à la main sur le papier."""
    return [("puce", "☐  " + it) for it in items]
