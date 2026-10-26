#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/docx_vers_manuel.py — UN CAHIER EST (DOCX) → window.MANUEL_DATA

    python tools/docx_vers_manuel.py Manuel_EST/cahiers/Cahier_2nde_ST_CORRIGE.docx \
        "~/Desktop/Collaboratif/Livrets 2nde -Tle/livret2ndest-data.js"
    python tools/docx_vers_manuel.py <docx> --controle     # mesure, n'écrit rien

POURQUOI CE SCRIPT
  Le livret de Tˡᵉ S&T s'est vendu dès le 27/08/2026 parce qu'il avait sa source
  `livrettlest-data.js` (format MANUEL_DATA, celui que lit
  tools/normaliser_cahiers.py). La 2ⁿᵈᵉ et la 1ʳᵉ S&T n'en ont jamais eu : leurs
  `content/*.md` et leur `render.py` sont perdus (cf. Manuel_EST, 04/09/2026), il
  ne reste que les DOCX. Ce script lit les DOCX par leurs STYLES NOMMÉS — c'est la
  seule structure qui a survécu — et rend les blocs que le normaliseur sait lire.

LA SOURCE EST LE DOCX « CORRIGE », PAS LE « LIVRET_ACTIVITES »
  Le livret d'activités met les objectifs et les règles à trous (« je serai
  capable de ……… »). Le cahier en ligne, comme celui de Tˡᵉ S&T, porte la leçon
  ENTIÈRE et laisse les lignes vides là où l'élève répond : c'est le « CORRIGE »
  (le nom désigne la version relue, pas des corrigés d'exercices — il n'en
  contient aucun, les paragraphes `Reponse` y sont vides).

CE QUI NE DOIT PAS SE PERDRE
  `depuis_manuel()` ignore EN SILENCE tout type qu'il ne connaît pas. On n'émet
  donc que des types de sa table TRAD_MANUEL, et le contrôle final compte les
  caractères : tout le texte du DOCX doit se retrouver dans les blocs.
"""
from __future__ import annotations

import json
import re
import sys
import unicodedata
from pathlib import Path

import docx

for _f in (sys.stdout, sys.stderr):
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Lignes d'écriture laissées après un exercice : le DOCX n'en porte pas (il
# laisse la page blanche), le cahier en ligne doit en donner. Trois, comme le
# livret de Tˡᵉ S&T déjà vendu.
LIGNES_EXERCICE = 3


def nettoie_tete(s: str) -> str:
    """Retire puces et pictogrammes de tête (« 🎯 », « • 📌 », « ✍️ »)."""
    s = s.strip()
    while s:
        c = s[0]
        cat = unicodedata.category(c)
        if c in "•·-–‍️" or cat in ("So", "Sk", "Cn") or ord(c) >= 0x1F000:
            s = s[1:].lstrip()
            continue
        break
    return s


def sans_prefixe(s: str, *prefixes: str) -> str:
    s = nettoie_tete(s)
    for p in prefixes:
        m = re.match(p, s, re.I)
        if m:
            return s[m.end():].strip()
    return s


RX_SEQ = re.compile(r"^(S[ÉE]QUENCE|ANNEXE)\s+(\S+)", re.I)
RX_SEM = re.compile(r"^Semaine\s+(\S+)\s*[—–-]\s*(.*)$", re.I)
RX_DISC = re.compile(r"^(Leçon\s+\S+)\s*·\s*(.*?)\s*[—–]\s*(.*)$")


def convertir(chemin: Path) -> dict:
    d = docx.Document(str(chemin))
    blocs: list[dict] = []
    titre, subs = "", []
    seq = "0"
    tid = 0
    lignes = 0
    outil_titre = None     # « Boîte à outils » : un paragraphe titre, puis son contenu

    def B(t: str, **kw) -> None:
        b = {"t": t, "d": seq}
        b.update(kw)
        blocs.append(b)

    def vide_lignes() -> None:
        nonlocal lignes
        if lignes:
            B("lines", n=lignes)
            lignes = 0

    paras = [p for p in d.paragraphs]
    for i, p in enumerate(paras):
        st = p.style.name if p.style is not None else ""
        brut = p.text
        if st == "Reponse":
            lignes += 1
            continue
        vide_lignes()
        t = brut.strip()
        if not t:
            continue

        if st == "T_Title":
            titre = t
        elif st == "T_Sub":
            subs.append(t)
        elif st == "T_Seq":
            m = RX_SEQ.match(t)
            seq = m.group(2) if m else str(len([b for b in blocs if b["t"] == "seq"]))
            # Les ANNEXES (contenus que le plan national ne demande pas, gardés en
            # fin de cahier) portent une lettre : « Annexe A », pas « Séquence A ».
            mot = "Annexe" if m and m.group(1).upper() == "ANNEXE" else "Séquence"
            B("seq", n=seq, txt=f"{mot} {seq}", comp="")
        elif st == "T_Comp":
            comp = sans_prefixe(t, r"Compétence attendue\s*:\s*")
            for b in reversed(blocs):
                if b["t"] == "seq":
                    b["comp"] = comp
                    break
        elif st == "T_Sem":
            m = RX_SEM.match(nettoie_tete(t))
            if m:
                B("sem", num=m.group(1), txt=m.group(2).strip())
            else:
                B("sem", num="", txt=nettoie_tete(t))
        elif st == "T_Disc":
            m = RX_DISC.match(t)
            if m:
                B("disc", lecon=m.group(1), dom=nettoie_tete(m.group(2)), titre=m.group(3).strip())
            else:
                # Intégration, épreuves, remédiation, consolidation : pas de
                # « Leçon N ». Sans titre, l'extrait gratuit ne savait plus les
                # distinguer et le banc les confondait (« rangs 0 et 0 »).
                B("disc", lecon="", dom=nettoie_tete(t), titre=nettoie_tete(t))
        elif st == "Objectif":
            B("objectif", txt=nettoie_tete(t))
        elif st == "Corpus":
            B("corpus", txt=sans_prefixe(t, r"Corpus\s*:\s*"))
        elif st == "Texte_Titre":
            tid += 1
            B("texteT", txt=nettoie_tete(t), tid=tid)
        elif st == "Texte":
            B("texte", txt=t, tid=tid)
        elif st == "Source":
            B("source", txt=t, tid=tid)
        elif st == "Rubrique":
            B("rubrique", txt=nettoie_tete(t))
        elif st == "Question":
            B("question", txt=t)
        elif st == "Retient_Titre":
            B("retT", txt=nettoie_tete(t))
        elif st == "Retient_Corps":
            B("retC", txt=t)
        elif st == "Definition":
            B("def", txt=nettoie_tete(t))
        elif st == "Repere":
            B("def", txt=nettoie_tete(t))
        elif st == "VersLeBac":
            B("bac", txt=sans_prefixe(t, r"Vers le (?:BAC|Baccalauréat|Probatoire)\s*[—–-]\s*"))
        elif st == "Astuce":
            B("astuce", txt=nettoie_tete(t))
        elif st == "Savais":
            B("savais", txt=sans_prefixe(t, r"Le savais-tu\s*\?\s*[—–-]\s*"))
        elif st == "Consigne":
            B("consigne", txt=t)
        elif st == "Exercice":
            B("exercice", txt=nettoie_tete(t))
            B("lines", n=LIGNES_EXERCICE)
        elif st == "Liste":
            B("liste", txt=nettoie_tete(t))
        elif st == "Corps":
            B("corps", txt=t)
        elif st == "Outil":
            n = nettoie_tete(t)
            m = re.match(r"Boîte à outils\s*[—–-]\s*(.*)$", n, re.I)
            if m:
                outil_titre = m.group(1).strip()
                B("outilT", txt=outil_titre)
            else:
                B("outilC", txt=t)
        else:
            raise SystemExit(f"style inconnu « {st} » au paragraphe {i} : {t[:80]!r}")
    vide_lignes()
    return {"title": titre, "subs": subs, "copyright": {"txt": ""}, "blocks": blocs}


def lettres(s: str) -> str:
    return re.sub(r"[^0-9A-Za-zÀ-ÿœŒ]", "", s)


def controle(chemin: Path, data: dict) -> tuple[int, dict]:
    """Rien du texte n'a-t-il disparu ? Chaque paragraphe non vide du DOCX doit
    se retrouver, dans l'ordre, dans un bloc dont le texte est sa FIN exacte
    (aux pictogrammes près) : seul un préfixe de tête peut avoir été retiré.
    Rend (paragraphes non retrouvés, compte des préfixes retirés) — les
    préfixes se relisent à l'œil : ils ne doivent être que des étiquettes."""
    from collections import Counter
    d = docx.Document(str(chemin))
    sorties = []
    for b in data["blocks"]:
        if b["t"] == "lines":
            continue
        if b["t"] == "disc":
            titre = b.get("titre", "") if b.get("titre") != b.get("dom") else ""
            sorties.append(lettres(b.get("lecon", "") + b.get("dom", "") + titre))
        elif b["t"] == "sem":
            sorties.append(lettres(b.get("num", "") + b.get("txt", "")))
        elif b["t"] == "seq":
            sorties.append(lettres(b.get("n", "")))
            sorties.append(lettres(b.get("comp", "")))
        else:
            sorties.append(lettres(b.get("txt", "")))
    sorties = [lettres(data["title"])] + [lettres(s) for s in data["subs"]] + sorties
    sorties = [s for s in sorties if s]
    manques, prefixes, j = 0, Counter(), 0
    for p in d.paragraphs:
        if p.style.name == "Reponse" or not p.text.strip():
            continue
        L = lettres(p.text)
        if not L:
            continue
        if j < len(sorties) and L.endswith(sorties[j]):
            if len(L) > len(sorties[j]):
                prefixes[L[: len(L) - len(sorties[j])]] += 1
            j += 1
        else:
            manques += 1
            print("  ✗ non retrouvé :", p.style.name, repr(p.text[:90]))
    if j != len(sorties):
        print(f"  ✗ {len(sorties) - j} blocs en trop en sortie")
        manques += len(sorties) - j
    return manques, prefixes


def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    src = Path(sys.argv[1]).expanduser()
    data = convertir(src)
    from collections import Counter
    c = Counter(b["t"] for b in data["blocks"])
    print(f"{src.name} : {len(data['blocks'])} blocs — " + ", ".join(f"{k} {v}" for k, v in c.most_common()))
    manques, prefixes = controle(src, data)
    print("  préfixes retirés :", ", ".join(f"{k}×{v}" for k, v in prefixes.most_common()))
    if manques:
        print(f"  ✗ {manques} paragraphe(s) perdu(s) — rien n'est écrit")
        return 1
    print("  ✓ tout le texte du DOCX est dans les blocs")
    if sys.argv[2] == "--controle":
        return 0
    dst = Path(sys.argv[2]).expanduser()
    dst.write_text("window.MANUEL_DATA=" + json.dumps(data, ensure_ascii=False) + ";\n", encoding="utf-8")
    print(f"→ {dst} ({dst.stat().st_size // 1024} Ko)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
