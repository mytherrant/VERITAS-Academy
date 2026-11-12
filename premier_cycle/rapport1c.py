# -*- coding: utf-8 -*-
"""Régénère `AUDIT_MANUELS_OEUVRES_1ER_CYCLE.md` depuis les volumes construits.

    python premier_cycle/rapport1c.py

Tous les nombres du rapport sont **relus dans les blocs au moment de
l'écriture** : aucun n'est saisi à la main, et le rapport ne peut donc pas
dériver du contenu. C'est la règle déjà suivie par `enrichissement/rapport.py`
pour les neuf cahiers du second cycle.
"""
import os
import re
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
if ICI not in sys.path:
    sys.path.insert(0, ICI)

import audit1c
import audit_banc
import kit
import source
from build_1c import MANUELS

SORTIE = os.path.join(os.path.dirname(ICI),
                      "AUDIT_MANUELS_OEUVRES_1ER_CYCLE.md")

JEU = re.compile(r"^[^\w]*(🎲|🔗|❓|✅|✏️|🔢|🕵️)")

# Ce que le contrôle ne peut pas voir, et qu'il faut donc dire. Chaque entrée
# est vérifiée à l'exécution : si le défaut a disparu de la source, la ligne
# disparaît du rapport — on ne laisse pas traîner un avertissement périmé.
RESERVES = [
    ("villecruelle", "sur-la chaussée poussiéreuse",
     "un tiret parasite au milieu d'une phrase"),
    ("villecruelle", "la-qualité",
     "un tiret parasite dans « examinait la-qualité »"),
    ("villecruelle", "Que diable 1",
     "un « 1 » à la place du point d'exclamation"),
    ("korotoumou", "c'est- à-dire",
     "une espace tombée au milieu de « c'est-à-dire »"),
    ("arbre", "Au voleur 1",
     "un « 1 » à la place du point d'exclamation"),
    ("gouttes", "ayant été calculé dans une case",
     "« calculé » là où le livre imprime vraisemblablement « capturé »"),
    ("gouttes", "Something went wrong",
     "une ligne étrangère à l'auteur, au milieu du poème XII"),
]


def releve(cle):
    """Tout ce qu'on peut compter dans un volume, compté une seule fois."""
    mod = __import__(MANUELS[cle]["module"])
    blocs, corriges = mod.manuel()
    titres = [b[1] for b in blocs if b[0] == "h3"]
    extraits = [b for b in blocs if b[0] == "extrait"]
    composes = [b for b in extraits if audit1c.COMPOSE.search(b[2])]

    lectures, courant = [], ""
    for b in blocs:
        if b[0] == "h3":
            courant = b[1]
        elif b[0] == "extrait" and courant.startswith("Lecture suivie"):
            lectures.append(b)

    return {
        "oeuvres": audit1c._sources_du_manuel(cle),
        "mots": kit.words(blocs),
        "mots_corriges": kit.words(corriges),
        "extraits": len(extraits),
        "composes": len(composes),
        "lectures": lectures,
        "ateliers": sum(1 for t in titres if t.startswith("J'écris")),
        "jeux": sum(1 for t in titres if JEU.match(t)),
        "cartes": sum(1 for t in titres if t.startswith("🧠")),
        "epreuves": sum(1 for t in titres if t.startswith("Épreuve n°")),
        "encadres": sum(1 for b in blocs if b[0] == "encadre"),
        "grilles": sum(1 for b in blocs if b[0] == "grille"),
        "ecartes": [b[1] for b in blocs
                    if b[0] == "pi" and "écarté" in b[1]],
        "ennuis": audit1c.controler(cle)["ennuis"],
    }


def main():
    releves = {}
    for cle in MANUELS:
        releves[cle] = releve(cle)

    out = []
    w = out.append
    w("# Audit du cycle — les quatre manuels d'étude d'œuvres intégrales\n")
    w("> Rapport produit par `python premier_cycle/rapport1c.py`. Tous les")
    w("> nombres sont relus dans les volumes construits au moment de")
    w("> l'écriture ; aucun n'est saisi à la main.\n")

    # ------------------------------------------------------------ périmètre
    w("## 1. Périmètre\n")
    w("| Classe | Les trois œuvres | Genres |")
    w("|---|---|---|")
    for cle in MANUELS:
        mod = __import__(MANUELS[cle]["module"])
        titres = " · ".join("*%s*" % t for t, _ in mod.OEUVRES)
        genres = " · ".join(a.split("—")[-1].strip() for _, a in mod.OEUVRES)
        w("| **%s** | %s | %s |" % (MANUELS[cle]["classe"], titres, genres))
    w("")

    # -------------------------------------------------------- forme mesurée
    w("## 2. Conformité de forme\n")
    w("Mesurée sur les blocs eux-mêmes : volume, lectures suivies, ateliers")
    w("d'écriture, jeux corrigés, épreuves au format MINESEC.\n")
    w("| Volume | Mots | dont corrigés | Lectures suivies | Ateliers | "
      "Jeux | Cartes | Épreuves | Encadrés | Tableaux |")
    w("|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|")
    for cle, r in releves.items():
        w("| `%s` | %d | %d | %d | %d | %d | %d | %d | %d | %d |"
          % (cle, r["mots"], r["mots_corriges"], len(r["lectures"]),
             r["ateliers"], r["jeux"], r["cartes"], r["epreuves"],
             r["encadres"], r["grilles"]))
    w("")

    # ------------------------------------------------ longueur des extraits
    w("## 3. Longueur des lectures suivies\n")
    w("La prose doit dépasser **cinq cents mots** ; la poésie en est")
    w("dispensée — un poème se commente entier — mais sa référence doit")
    w("**nommer l'unité reproduite**, et le contrôle le vérifie.\n")
    w("| Volume | Prose : le plus court | Poésie | Supports composés |")
    w("|---|---|---|---:|")
    for cle, r in releves.items():
        prose = [source.compte_mots(b[1]) for b in r["lectures"]
                 if not re.search(r"(?i)poème", b[2])]
        vers = [b for b in r["lectures"] if re.search(r"(?i)poème", b[2])]
        w("| `%s` | %s | %s | %d |"
          % (cle,
             "%d mots (sur %d)" % (min(prose), len(prose)) if prose else "—",
             ("%d poèmes entiers" % len(vers)) if vers else "aucune",
             r["composes"]))
    w("")

    # ------------------------------------------------------- les contrôles
    w("## 4. Les huit contrôles\n")
    w("`python premier_cycle/audit1c.py`\n")
    w("| Volume | Extraits contrôlés | Manquements |")
    w("|---|---:|---|")
    for cle, r in releves.items():
        w("| `%s` | %d | %s |"
          % (cle, r["extraits"],
             "**aucun**" if not r["ennuis"] else "%d" % len(r["ennuis"])))
    total = sum(len(r["ennuis"]) for r in releves.values())
    w("")
    w("**%d manquement(s) sur %d volumes.**\n" % (total, len(releves)))
    for cle, r in releves.items():
        for e in r["ennuis"]:
            w("- `%s` — %s" % (cle, e))
    if total:
        w("")

    ecartes = sum(len(r["ecartes"]) for r in releves.values())
    w("Grilles de jeu dont un mot n'a pas pu être placé : **%d**. Une seule"
      % ecartes)
    w("suffirait à imprimer, dans un cahier d'élève, une note technique")
    w("(« mots écartés faute de place ») qui n'a rien à y faire.\n")

    w("## 5. Ce que les contrôles ne peuvent pas voir\n")
    w("`audit1c.py` compare les extraits au fichier de l'œuvre, et")
    w("`source.extrait()` les **découpe** au lieu de les laisser retaper :")
    w("le verbatim est donc mécaniquement vrai, non promis. La réparation")
    w("des numérisations, elle, **ne peut qu'insérer une espace** — elle le")
    w("vérifie en comparant les deux textes privés de tout blanc. Ce qui")
    w("demanderait de toucher une lettre reste donc dans le texte :\n")
    restant = []
    for cle, motif, quoi in RESERVES:
        if motif in source.texte(cle):
            restant.append("- **%s** — %s (« %s »)" % (cle, quoi, motif))
    if restant:
        w("\n".join(restant))
        w("")
        w("Le remède n'est pas dans la chaîne : c'est **une meilleure")
        w("numérisation de l'œuvre**, ou la coupe marquée `[…]` là où le")
        w("passage peut s'en passer.\n")
    else:
        w("Aucune réserve : les sources sont saines.\n")

    w("## 6. Éprouver l'audit lui-même\n")
    w("`python premier_cycle/audit_banc.py 6e 5e 4e 3e` pose **%d avaries**"
      % len(audit_banc.AVARIES))
    w("en mémoire, une à la fois — un mot changé dans une lecture suivie, un")
    w("extrait ramené à soixante mots, une référence de poème qui ne dit plus")
    w("« poème entier », deux mots soudés par le scan, un barème qui ne fait")
    w("plus vingt points, une quinzième faute disparue, une faute annoncée")
    w("absente du texte, le corrigé d'un jeu supprimé — et exige que l'audit")
    w("les signale **avec la bonne étiquette**. Un contrôle qui n'a jamais")
    w("rougi ne prouve rien.\n")

    with open(SORTIE, "w", encoding="utf-8") as f:
        f.write("\n".join(out))
    return SORTIE, total


if __name__ == "__main__":
    chemin, n = main()
    print("%s  (%d manquement(s))" % (chemin, n))
