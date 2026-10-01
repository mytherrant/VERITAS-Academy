# -*- coding: utf-8 -*-
"""Les contrôles des manuels du premier cycle.

    python premier_cycle/audit1c.py          # les quatre
    python premier_cycle/audit1c.py 6e

Cinq contrôles, dans cet ordre. Ils portent sur ce qui peut faire échouer le
volume devant une commission, pas sur des détails de forme :

1. **Verbatim** — tout encadré attribué à un auteur se retrouve mot pour mot
   dans le fichier de l'œuvre. C'est la règle inviolable du projet : un
   extrait paraphrasé est disqualifiant.
2. **Longueur des lectures suivies** — au moins cinq cents mots par extrait.
3. **Débordement** — aucun extrait ne mord sur le chapitre voisin, faute de
   quoi l'élève lirait deux histoires en croyant n'en lire qu'une.
4. **Correction orthographique** — le texte fautif porte exactement le nombre
   de fautes annoncé, et le barème fait bien vingt points.
5. **Corrigés** — chaque jeu et chaque épreuve a sa réponse en fin de volume.

Un contrôle qui passe toujours ne prouve rien : `audit_banc.py` éprouve
celui-ci en cassant volontairement le contenu.
"""
import os
import re
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
if ICI not in sys.path:
    sys.path.insert(0, ICI)

import source
from build_1c import MANUELS

# Les encadrés composés pour le manuel portent leur étiquette : ils ne sont
# pas contrôlés contre les œuvres, puisqu'ils n'en viennent pas.
COMPOSE = re.compile(r"(?i)texte compos|pour l'épreuve|pour la leçon")
SEUIL_LECTURE = 500

# Les recueils de poésie échappent au seuil de cinq cents mots : un poème se
# commente **entier**, et l'atteindre en collant deux poèmes détruirait
# précisément l'objet qu'on étudie. La contrepartie est stricte — la référence
# doit **nommer l'unité reproduite**, faute de quoi on ne saurait plus si l'on
# tient le poème ou un fragment. C'est cette contrepartie que le contrôle
# vérifie ici, à la place du quota.
POESIE = {"solnatal", "gouttes"}
UNITE = re.compile(r"(?i)poème entier|poèmes entiers|section entière|"
                   r"sections entières|strophes? \d|parties? [IVX]+")

# ------------------------------------------------------- santé du scan
#
# Les œuvres viennent de numérisations, et la reconnaissance de caractères
# soude des mots (« attendraslongtemps ») ou mange la lettre initiale d'un
# mot en début de ligne (« nstinctivement »). `source._reparer` recolle ce
# qu'une espace suffit à séparer ; le reste doit être **repéré**, car un
# manuel scolaire qui imprime « pourtantfaire » se disqualifie tout seul.
#
# On ne dispose pas d'un dictionnaire : le corpus des douze œuvres en tient
# lieu. Un mot vu une seule fois dans tout le corpus, assez long, et qui se
# coupe en deux mots fréquents, est une soudure. Un mot vu une seule fois
# dont une lettre en tête donne un mot fréquent est une lettre perdue.
MOT = re.compile(r"[a-zàâçéèêëîïôûùüœ]+")
_VOCAB = None


def vocabulaire():
    """Compte les mots des douze œuvres — le dictionnaire du pauvre."""
    global _VOCAB
    if _VOCAB is None:
        from collections import Counter
        _VOCAB = Counter()
        for k in source.FICHIERS:
            _VOCAB.update(MOT.findall(source.texte(k).lower()))
    return _VOCAB


# Ce que la réparation de `source` n'a pas pu recoller : un tiret parasite
# collé au mot suivant, une soudure que les espaces seules ne séparent pas.
# On ne les corrige pas — corriger demanderait de toucher aux lettres, et la
# règle du verbatim l'interdit. On les **signale**, pour choisir un autre
# passage.
TYPO = [(re.compile("[  ]-[a-zà-ÿ]"), "tiret collé au mot suivant")]

# Les fichiers de la bibliothèque ont été assemblés à la main, parfois avec
# l'aide d'un outil : celui de *Petites gouttes de chant* porte, entre deux
# poèmes, la trace d'une génération ratée (« Something went wrong… »). Ces
# lignes ne sont pas de l'auteur ; un extrait qui en avale une imprimerait
# dans le manuel une phrase que le poète n'a jamais écrite.
INTRUS = re.compile(r"(?i)something went wrong|an AI response|archive\.org|"
                    r"www\.[a-z]|[a-z]@[a-z]+\.(?:com|fr)|scanned by")


def defauts_de_scan(texte):
    """Rend la liste des dégâts que le scan a probablement laissés.

    Trois familles : les mots soudés, les mots amputés de leur lettre
    initiale, et un tiret parasite. Le contrôle est volontairement prudent :
    en français, la plupart des mots se coupent en deux mots courants
    (« pour|boire », « bras|sait »), et un contrôle trop zélé noierait les
    vraies soudures sous les fausses. On n'accuse donc qu'un mot long, vu une
    seule fois dans les douze œuvres, et dont les deux moitiés sont, elles,
    des mots vus plusieurs fois.
    """
    v = vocabulaire()
    trouves = []
    for mot in MOT.findall(texte.lower()):
        if v[mot] > 1:
            continue
        # Une queue de moins de six lettres est le plus souvent une
        # terminaison verbale (« consent|aient ») : on ne l'accepte comme
        # second mot que si elle est elle-même très fréquente.
        if len(mot) >= 12 and any(
                v[mot[:i]] >= 5 and (v[mot[i:]] >= 5 if len(mot[i:]) >= 6
                                     else v[mot[i:]] >= 50)
                for i in range(5, len(mot) - 4)):
            trouves.append("soudure « %s »" % mot)
        elif len(mot) >= 8 and any(v[c + mot] >= 3 for c in "abcdefghijlmnprstv"):
            trouves.append("lettre perdue « %s »" % mot)
    for rx, nom in TYPO:
        if rx.search(texte):
            trouves.append(nom)
    m = INTRUS.search(texte)
    if m:
        trouves.append("texte étranger à l'œuvre : « %s »" % m.group(0))
    return trouves


def _sources_du_manuel(cle):
    """Quelles œuvres ce manuel cite-t-il ? On le lit dans le module."""
    mod = __import__(MANUELS[cle]["module"])
    cles = []
    for nom in dir(mod):
        sous = getattr(mod, nom)
        if hasattr(sous, "CLE") and getattr(sous, "CLE") in source.FICHIERS:
            if sous.CLE not in cles:
                cles.append(sous.CLE)
    return cles


def controler(cle):
    mod = __import__(MANUELS[cle]["module"])
    blocs, corriges = mod.manuel()
    oeuvres = _sources_du_manuel(cle)
    textes = {k: source.plat(source.texte(k)) for k in oeuvres}
    ennuis = []

    # ------------------------------------------------ 1, 2 et 3 : les extraits
    #
    # Le seuil de cinq cents mots ne vaut que pour les **lectures suivies**.
    # Les supports d'épreuve (250-350 mots par norme) et les citations courtes
    # ne s'y comparent pas : on reconnaît une lecture suivie au titre qui la
    # précède, et non à la longueur — sans quoi le contrôle réclamerait cinq
    # cents mots à une épreuve d'étude de texte, qui n'en veut pas.
    extraits, longs, titre_courant = [], 0, ""
    for b in blocs:
        if b[0] == "h3":
            titre_courant = b[1]
            continue
        if b[0] != "extrait":
            continue
        extraits.append(b)
        texte, legende = b[1], b[2]
        if COMPOSE.search(legende):
            continue
        plat = source.plat(texte)
        # Les coupes marquées […] se comparent morceau par morceau.
        morceaux = [m.strip() for m in plat.split("[…]") if len(m.strip()) > 40]
        trouve = None
        for k, entier in textes.items():
            if all(m in entier for m in morceaux):
                trouve = k
                break
        if trouve is None:
            ennuis.append("VERBATIM  %-58s  introuvable dans les œuvres"
                          % (texte[:55].replace("\n", " ") + "…"))
            continue
        for defaut in defauts_de_scan(texte):
            ennuis.append("SCAN      %-58s  %s" % (titre_courant[:55], defaut))
        if titre_courant.startswith("Lecture suivie"):
            longs += 1
            if trouve in POESIE:
                if not UNITE.search(legende):
                    ennuis.append("UNITE     %-58s  la référence ne nomme pas "
                                  "l'unité reproduite" % titre_courant[:55])
                continue
            n = source.compte_mots(texte)
            if n < SEUIL_LECTURE:
                ennuis.append("COURT     %-58s  %d mots (< %d)"
                              % (titre_courant[:55], n, SEUIL_LECTURE))

    # ------------------------------------------- 4 : correction orthographique
    for nom in dir(mod):
        sous = getattr(mod, nom)
        fautif = getattr(sous, "ORTHO_FAUTIF", None)
        table = getattr(sous, "ORTHO_CORRIGE", None)
        if not fautif or not table:
            continue
        total = 0.0
        for ligne in table:
            total += float(ligne[-1].replace(",", "."))
        if abs(total - 20.0) > 0.01:
            ennuis.append("BAREME    %-58s  %s points au lieu de 20"
                          % (nom, total))
        if len(table) != 15:
            ennuis.append("FAUTES    %-58s  %d entrées au lieu de 15"
                          % (nom, len(table)))
        # Chaque forme fautive annoncée doit réellement figurer dans le texte.
        # Le blanc est normalisé : une faute de ponctuation s'écrit dans la
        # table « francs **_** les cartons », où le souligné marque le signe
        # absent — après nettoyage il reste deux espaces, que le texte n'a pas.
        propre = re.sub(r"\s+", " ", fautif)
        for ligne in table:
            mot = re.sub(r"\*\*|_", "", ligne[1])
            mot = re.sub(r"\s+", " ", mot).split("…")[0].strip()
            if mot and mot not in propre:
                ennuis.append("ABSENTE   %-58s  « %s » n'est pas dans le texte"
                              % (nom, mot[:40]))

    # --------------------------------------------------------- 5 : corrigés
    titres_jeux = [b[1] for b in blocs
                   if b[0] == "h3" and re.match(r"^[^\w]*(🎲|🔗|❓|✅|✏️|🔢|🕵️)",
                                                b[1])]
    titres_cor = set()
    for b in corriges:
        if b[0] == "h3":
            titres_cor.add(re.sub(r"^[^\w]*", "", b[1]).strip())
    for t in titres_jeux:
        nu = re.sub(r"^[^\w]*", "", t).strip()
        if nu not in titres_cor:
            ennuis.append("CORRIGE   %-58s  jeu sans corrigé" % nu[:55])

    return {"oeuvres": oeuvres, "extraits": len(extraits), "lectures": longs,
            "blocs": len(blocs), "ennuis": ennuis}


def main(cibles):
    total = 0
    for cle in cibles:
        try:
            r = controler(cle)
        except Exception as exc:                        # noqa: BLE001
            print("%-3s  ERREUR DE CONSTRUCTION : %s" % (cle, exc))
            total += 1
            continue
        print("%-3s  %d blocs · %d extraits dont %d lectures suivies · œuvres : %s"
              % (cle, r["blocs"], r["extraits"], r["lectures"],
                 ", ".join(r["oeuvres"])))
        for e in r["ennuis"]:
            print("     ! " + e)
        total += len(r["ennuis"])
        if not r["ennuis"]:
            print("     tout est conforme")
    print("\n%d problème(s)." % total)
    return total


if __name__ == "__main__":
    sys.exit(1 if main(sys.argv[1:] or list(MANUELS)) else 0)
