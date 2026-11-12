# -*- coding: utf-8 -*-
"""Manques de cahier, débarrassés du bruit d'extraction.

L'extracteur de Bord découpe la mise en page ; il prend donc pour des items
des lignes qui n'en sont pas : fragments du corpus (répliques, extraits de
lettres), encadrés « Le saviez-vous ? », lignes de cours, titres d'exercice
vides. Leur donner un « corrigé » publierait une réponse à une non-question.
Ce filtre a été validé contre la vérité terrain : 91,4 % des items réellement
corrigés par ailleurs sont reconnus « question » par ces règles.
"""
import json, os, glob, re, sys

CONSIGNE = re.compile(r"\b(lis|relève|releve|identifie|justifie|explique|donne|cite|précise|precise|transforme|complète|complete|réécris|reecris|conjugue|souligne|classe|indique|montre|analyse|déduis|deduis|formule|propose|rédige|redige|construis|emploie|choisis|trouve|nomme|décris|decris|compare|distingue|repère|repere|observe|résume|resume|réponds|reponds|remplace|corrige|coche|entoure|recopie|associe|remets|ajoute|encadre|dresse|imagine|invente|raconte|présente|presente|développe|developpe|argumente|relie|vérifie|verifie|mets|utilise|applique|reformule|dégage|degage|ressors|détermine|determine|fais|réalise|realise|prépare|prepare|mène|mene|produis)\b", re.I)
SAVIEZ = re.compile(r"le saviez[- ]vous", re.I)
TITRE_VIDE = re.compile(r"^[\W_]*✍?️?\s*(exercice|exo|épreuve|epreuve|sujet)\s*\d*\s*:?\s*$", re.I)
DIALOGUE = re.compile(r"^\s*[—–\-«\"“]")
REPLIQUE = re.compile(r"^\s*[A-ZÉÈÀÂÎÔÛ][\w'’ ]{1,30}\s*(\(|:)")   # « Sambo Maya : … »
COURS = re.compile(r"^\s*\d+[\.\)°]\s*(la|le|l['’]|les|un|une)\s+\w+.{0,60}\s*:\s*(elle|il|on|c['’]est|cette|ce|ces|les|la|le)\b", re.I)
SEMAINE = re.compile(r"^\s*semaine\s+\d+\s*:", re.I)
AUTO = re.compile(r"(mes points forts|je me fixe|ce que je dois améliorer|j'ai réussi à|compte rendu\s*:|coche la case|au propre|avec l'aide de ton professeur|je m'auto|auto-?évalu)", re.I)

def categorie(it):
    t = (it.get("txt") or "").strip()
    if not t:                                   return "vide"
    if SAVIEZ.search(t):                        return "encadre"
    if TITRE_VIDE.match(t):                     return "titre_vide"
    if SEMAINE.match(t):                        return "titre_vide"
    if AUTO.search(t) or it.get("kind") == "auto": return "metacognitif"
    if COURS.match(t):                          return "cours"
    if REPLIQUE.match(t) and not CONSIGNE.search(t[:60]): return "corpus"
    if DIALOGUE.match(t) and not CONSIGNE.search(t[:80]): return "corpus"
    if len(t) > 300 and not CONSIGNE.search(t[:120]):     return "corpus"
    if CONSIGNE.search(t):                      return "question"
    if re.match(r"^\s*\d+\s*[\.\)°\-–]", t) and len(t) < 400: return "question"
    if t.endswith("?") and len(t) < 200:        return "question"
    if it.get("kind") in ("exo", "prod"):       return "question"
    return "indetermine"

A_TRAITER = {"question", "indetermine", "metacognitif"}

def main():
    niv = sys.argv[1]
    mod_vise = next((int(a) for a in sys.argv[2:] if a.isdigit()), None)
    data = json.load(open("_bord_extract/%s.json" % niv, encoding="utf-8"))
    sols = set()
    d = os.path.join("content", "corriges-cahier", niv)
    if os.path.isdir(d):
        for f in glob.glob(os.path.join(d, "module-*.md")):
            for raw in open(f, encoding="utf-8"):
                if raw.startswith("#SOL::"):
                    p = raw.split("::", 2)
                    if len(p) >= 3:
                        sols.add(p[1].strip())
    for mod in data["modules"]:
        restants = []
        for l in mod["lecons"]:
            for it in l["items"]:
                if it["id"] in sols or any(x for x in it.get("sol", [])):
                    continue
                if categorie(it) in A_TRAITER:
                    restants.append((l, it))
        if not restants:
            continue
        if mod_vise is None or mod["n"] != mod_vise:
            print("M%-2s %-45s %d à rédiger" % (mod["n"], mod["titre"][:45], len(restants)))
            continue
        print("=" * 76)
        print("MODULE %s — %s" % (mod["n"], mod["titre"]))
        print("=" * 76)
        vue = None
        for l, it in restants:
            if l["n"] != vue:
                vue = l["n"]
                print("\n" + "-" * 72)
                print("LEÇON %s · %s" % (l["n"], l["titre"]))
                if l.get("objectif"):
                    print("OBJECTIF : %s" % l["objectif"])
                if l.get("source"):
                    print("SOURCE   : %s" % l["source"])
                if "--texte" in sys.argv and l.get("texte"):
                    print("TEXTE :")
                    for p in l["texte"]:
                        print("   %s" % p)
                if l.get("lexique"):
                    print("LEXIQUE  : %s" % l["lexique"])
                print("-" * 72)
            print("\n[%s] (%s) %s" % (it["id"], it["kind"], it.get("rub") or ""))
            print("   %s" % (it["txt"] or "").replace("\n", "\n   "))

main()
