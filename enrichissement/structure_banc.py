# -*- coding: utf-8 -*-
"""
Banc de mutation de `structure.py`.

Un contrôle qui n'a jamais rougi ne prouve rien : il peut être au vert
parce que le cahier est sain, ou parce qu'il ne regarde rien. On abîme donc
une copie du cahier, défaut par défaut, et l'on vérifie que chacun remonte.

    python enrichissement/structure_banc.py

Chaque mutation reproduit un défaut RÉELLEMENT trouvé dans les cahiers
avant leur réorganisation : la question du contrôle recopiée du carnet, les
séquences restées au niveau 3, « 1.1 » sous « 3.1 », la branche 6 sautée,
« Devoir n° 1 » employé deux fois, « six exercices » pour sept.
"""
import os
import re
import shutil
import sys

import docx

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
sys.path.insert(0, ICI)

import structure as S                                       # noqa: E402
import verbatim as V                                        # noqa: E402

_SEQ = re.compile(r"^\d+\.\d+\s+Séquence")

SUJET = "capitoline"
COPIE = os.path.join(os.environ.get("TEMP", "."), "_structure_mutant.docx")


def _paras(d):
    return [p for p in d.paragraphs if (p.text or "").strip()]


def _ecrire(p, texte):
    """Remplace le texte d'un paragraphe sans toucher à son style."""
    for r in p.runs[1:]:
        r._element.getparent().remove(r._element)
    if p.runs:
        p.runs[0].text = texte
    else:
        p.add_run(texte)


# ── les mutations ─────────────────────────────────────────────────────────
def m_question_recopiee(d):
    """Une question du contrôle recopiée mot pour mot du carnet."""
    ps = _paras(d)
    i = next(k for k, p in enumerate(ps)
             if p.style.name == "Heading 3" and p.text.startswith("Étape 1"))
    source = next(p.text for p in ps[i + 1:i + 8] if p.text.strip().endswith("?"))
    j = next(k for k, p in enumerate(ps)
             if p.style.name == "Heading 3"
             and p.text.startswith("Contrôle de lecture n° 1"))
    cible = next(p for p in ps[j + 1:j + 8] if p.text.strip().endswith("?"))
    _ecrire(cible, source)
    return "redondance"


def m_sequence_au_niveau_3(d):
    """Les séquences redescendues au niveau 3, sans niveau 2 au-dessus."""
    n = 0
    for p in _paras(d):
        if p.style.name == "Heading 2" and _SEQ.match(p.text.strip()):
            p.style = d.styles["Heading 3"]
            n += 1
    assert n >= 2, "aucune séquence retrogradée (%d)" % n
    return "hiérarchie"


def m_numero_perime(d):
    """« 1.1 » sous « 3.1 » : la numérotation d'avant le changement de plan."""
    for p in _paras(d):
        if p.style.name == "Heading 3" and p.text.strip() == "Le titre":
            _ecrire(p, "1.1 Le titre")
            return "numérotation"
    raise AssertionError("titre du paratexte introuvable")


def m_branche_sautee(d):
    """La branche 6 renumérotée en 8 : la carte saute deux crans."""
    for p in _paras(d):
        if p.style.name == "Heading 3" and p.text.startswith("Branche 6"):
            _ecrire(p, p.text.replace("Branche 6", "Branche 8", 1))
            return "numérotation"
    raise AssertionError("Branche 6 introuvable")


def m_etiquette_reemployee(d):
    """« Devoir n° 1 » pour l'étape du carnet ET pour l'épreuve blanche."""
    for p in _paras(d):
        if p.style.name == "Heading 3" and p.text.startswith("Étape 1"):
            _ecrire(p, p.text.replace("Étape 1", "Devoir n° 1", 1))
            return "étiquettes"
    raise AssertionError("Étape 1 introuvable")


def m_annonce_fausse(d):
    """« Quatre exercices » annoncés, sept imprimés."""
    for p in _paras(d):
        t = p.text.strip()
        if "exercices, à faire sans rouvrir" in t:
            _ecrire(p, t.replace(t.split()[0], "Quatre", 1))
            return "annonces"
    raise AssertionError("annonce des exercices introuvable")


def m_section_unique(d):
    """Une partie ramenée à une seule sous-section numérotée."""
    ps = _paras(d)
    vus = 0
    for p in ps:
        if p.style.name == "Heading 2" and p.text.startswith("4."):
            vus += 1
            if vus > 1:
                p.style = d.styles["Heading 3"]
    assert vus > 1, "la partie 4 n'a pas plusieurs sections"
    return "hiérarchie"


def m_entree_pour_le_professeur(d):
    """L'entrée dans l'œuvre revenue à sa version destinée à l'enseignant."""
    for p in _paras(d):
        if (p.style.name == "Heading 2"
                and "Avant de lire" in p.text):
            _ecrire(p, "3.2 Activités augurales et engagement de lecture")
            return "collection"
    raise AssertionError("section « Avant de lire » introuvable")


def m_contrat_sans_cases(d):
    """Le contrat de lecture rendu sans ses cases : plus rien à cocher."""
    n = 0
    for p in _paras(d):
        if "☐" in p.text:
            _ecrire(p, p.text.replace("☐", "-"))
            n += 1
    assert n >= 3, "aucune case a cocher trouvee (%d)" % n
    return "collection"


MUTATIONS = [
    ("question du contrôle recopiée du carnet", m_question_recopiee),
    ("entrée revenue au professeur", m_entree_pour_le_professeur),
    ("contrat de lecture sans ses cases", m_contrat_sans_cases),
    ("séquences laissées au niveau 3", m_sequence_au_niveau_3),
    ("numéro périmé « 1.1 » sous « 3.1 »", m_numero_perime),
    ("branche 6 renumérotée 8", m_branche_sautee),
    ("« Devoir n° 1 » employé deux fois", m_etiquette_reemployee),
    ("« Quatre exercices » pour sept", m_annonce_fausse),
    ("partie réduite à une section unique", m_section_unique),
]


def _rubrique(r, nom):
    if nom == "redondance":
        return ["doublon"] * len(r["doublons"])
    return r[{"hiérarchie": "hierarchie", "numérotation": "numerotation",
              "étiquettes": "etiquettes", "annonces": "annonces",
              "collection": "collection"}[nom]]


def main():
    source = os.path.join(RACINE, V.CAHIERS[SUJET][0])
    base = S.analyser(SUJET, source)
    depart = {n: len(_rubrique(base, n)) for n in
              ("redondance", "hiérarchie", "numérotation", "étiquettes",
               "annonces", "collection")}
    print("=" * 78)
    print("  BANC DE MUTATION — %s" % os.path.basename(source))
    print("=" * 78)
    print("\n  Départ : " + ", ".join("%s %d" % (k, v)
                                      for k, v in sorted(depart.items())))
    print("  Un cahier sain doit être à zéro partout ; chaque mutation doit")
    print("  faire monter la rubrique qu'elle vise.\n")

    echecs = 0
    for libelle, muter in MUTATIONS:
        shutil.copyfile(source, COPIE)
        d = docx.Document(COPIE)
        rubrique = muter(d)
        d.save(COPIE)
        r = S.analyser(SUJET, COPIE)
        n = len(_rubrique(r, rubrique))
        ok = n > depart[rubrique]
        echecs += 0 if ok else 1
        print("  %s %-38s %-13s %d → %d"
              % ("✓" if ok else "✗", libelle, rubrique, depart[rubrique], n))
    if os.path.exists(COPIE):
        os.remove(COPIE)

    print("\n" + "=" * 78)
    if echecs:
        print("  %d mutation(s) NON DÉTECTÉE(S) : le contrôle ne contrôle pas."
              % echecs)
    else:
        print("  Les %d mutations sont détectées. Le contrôle mord."
              % len(MUTATIONS))
    return echecs


if __name__ == "__main__":
    sys.exit(1 if main() else 0)
