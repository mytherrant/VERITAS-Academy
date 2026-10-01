# -*- coding: utf-8 -*-
"""
Assembleur des cahiers d'œuvre intégrale VÉRITAS.

Les .docx d'origine ayant été perdus, chaque cahier est reconstruit
intégralement : les sections conservées sont relues depuis la conversion
markdown fidèle produite par graphify (graphify-out/converted/*.md), les
sections enrichies sont rendues depuis les modules de contenu.

Trois sections sont remplacées :
    6 bis  Lectures méthodiques  →  six fiches, extraits ≥ 300 mots
    8/9/10 Plans et modèles      →  deux commentaires + deux dissertations rédigés
    11     Évaluation finale     →  deux devoirs MINESEC, corrigés et grilles OBC
"""
import glob
import os
import re
import sys

import docx
from docx.shared import Cm, Pt

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import apparat
import complements
import augurales
import controles
import contractions
import contractions_corriges
import docxkit as K
import front
import mdsource
import obc
import obc_devoirs
import oeuvres
import vers_examen

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
CONVERTED = os.path.join(RACINE, "graphify-out", "converted")


# ───────────────────────────────────────────────── lecture du markdown source
def lire_markdown(base_docx):
    """Retrouve la conversion markdown d'un cahier et la découpe en blocs."""
    motif = os.path.join(CONVERTED, base_docx.replace(".docx", "") + "_*.md")
    fichiers = glob.glob(motif)
    if not fichiers:
        raise FileNotFoundError("conversion markdown introuvable : %s" % motif)
    texte = open(fichiers[0], encoding="utf8").read()
    return parser_markdown(texte)


def parser_markdown(texte):
    blocs, tableau = [], []
    for ligne in texte.split("\n"):
        s = ligne.rstrip()

        if s.startswith("<!--"):
            continue

        # tableaux markdown : on accumule puis on vide
        if s.strip().startswith("|"):
            cellules = [c.strip() for c in s.strip().strip("|").split("|")]
            if not all(re.fullmatch(r":?-{2,}:?", c or "-") for c in cellules):
                tableau.append(cellules)
            continue
        if tableau:
            blocs.append(("grille", tableau))
            tableau = []

        if not s.strip():
            continue

        m = re.match(r"^(#{1,3})\s+(.*)$", s)
        if m:
            blocs.append(("h%d" % len(m.group(1)), m.group(2).strip()))
        elif s.lstrip().startswith(("- ", "* ")):
            blocs.append(("puce", s.lstrip()[2:].strip()))
        elif re.match(r"^\s*\d+[.)]\s+", s):
            blocs.append(("num", re.sub(r"^\s*\d+[.)]\s+", "", s)))
        else:
            blocs.append(("p", s.strip()))
    if tableau:
        blocs.append(("grille", tableau))
    return blocs


def decouper(blocs, debut, fins):
    """Indices [i, j) de la section qui commence au titre `debut`."""
    def txt(b):
        return b[1].strip().lower() if len(b) > 1 and isinstance(b[1], str) else ""

    i = next((k for k, b in enumerate(blocs)
              if b[0].startswith("h") and txt(b).startswith(debut.lower())), None)
    if i is None:
        raise LookupError("titre introuvable : %r" % debut)
    j = next((k for k in range(i + 1, len(blocs))
              if blocs[k][0].startswith("h")
              and any(txt(blocs[k]).startswith(f.lower()) for f in fins)), len(blocs))
    return i, j


# ───────────────────────────────────────────────── blocs des sections neuves
def _extrait(texte, source, disposition=None):
    """Bloc d'extrait. La forme (prose, scene, vers) est declaree par le cahier
    quand la detection automatique ne peut pas trancher : le verset d'un poeme
    est aussi long qu'une ligne de prose, et se composerait donc en prose."""
    return (("extrait", texte, source, disposition) if disposition
            else ("extrait", texte, source))


def _je_retiens(f):
    """L'essentiel de la séance, tiré des axes de la fiche.

    On ne réécrit rien : le titre de chaque axe EST l'idée à retenir. Une
    synthèse rédigée à part risquerait de dire autre chose que la fiche.
    """
    lignes = ["**Ce que ce texte établit** — %s" % f["repere"]]
    lignes += ["%d. %s" % (i, titre) for i, (titre, _) in enumerate(f["axes"], 1)]
    lignes.append("**La question à savoir reformuler** — %s" % f["synthese"])
    return lignes


def blocs_fiche(f, index, total, outil=None):
    """Une séquence du parcours : lire, comprendre, observer, analyser,
    s'outiller, retenir, s'entraîner.

    L'ordre suit la progression réelle de l'élève, non l'ordre des
    ressources disponibles. Les encadrés propres à la fiche sont posés
    juste après l'analyse, là où ils servent — jamais regroupés en fin de
    cahier.
    """
    # « Séquence 1 — Fiche 1 — … » répéterait deux numérotations pour une
    # seule séance : on ne garde que ce que le titre dit du texte.
    sujet = f["titre"].split("—", 1)[-1].strip()
    b = [("h3", "Séquence %d — %s" % (index, sujet)),
         ("p", "*%s*" % f["repere"])]
    b.append(("encadre", "objectif", "Objectif de la séance", [f["objectif"]]))

    # ── JE LIS
    b.append(("encadre", "lire", "Le texte à lire", [
        "Lisez le passage en entier, sans crayon, une première fois.",
        "Relisez-le en soulignant ce que vous ne comprenez pas : c'est ce "
        "que la séance va éclairer."]))
    b.append(_extrait(f["extrait"], f["source"], f.get("disposition")))
    if f.get("lexique"):
        b.append(("p", "**Les mots du texte**"))
        b.append(front.lexique_extrait(f["lexique"]))
    b.append(("p", "**Situation du passage**"))
    b.append(("p", f["situation"]))

    # ── JE COMPRENDS
    b.append(("p", "**Je comprends**"))
    b += [("num", q) for q in f["comprendre"]]

    # ── J'OBSERVE
    b.append(("encadre", "observer", "Le tableau des quatre colonnes", [
        "Avant d'analyser, remplissez ce tableau au brouillon. Il donne le "
        "plan tout seul : les lignes qui se ressemblent forment un centre "
        "d'intérêt.",
        "**Citation** (courte, exacte) → **Outil d'analyse** (son nom) → "
        "**Effet** (ce qu'il produit ici) → **Interprétation** (ce qu'il "
        "apporte au sens).",
        "Une ligne dont la dernière colonne reste vide n'a pas sa place dans "
        "le devoir : c'est un relevé, pas une analyse."]))
    # Des points de suite plutôt que des cellules vides : une ligne vide dans
    # un tableau imprimé se lit comme un défaut de composition, là où les
    # points disent « à remplir ».
    b.append(("grille", [["Citation", "Outil d'analyse", "Effet",
                          "Interprétation"]]
              + [["…", "…", "…", "…"]] * 5))
    b.append(("p", "**Les mouvements du texte**"))
    b += [("puce", m) for m in f["mouvements"]]

    # ── J'ANALYSE
    b.append(("p", "**J'analyse : le fond et la forme ensemble**"))
    for i, (titre, items) in enumerate(f["axes"], 1):
        b.append(("p", "*Axe %d — %s*" % (i, titre)))
        b += [("puce", it) for it in items]
    b.append(("p", "**La forme au service du sens**"))
    b += [("puce", it) for it in f["forme"]]
    b += [("num", q) for q in f["analyser"]]

    # ── L'OUTIL DE LA SÉANCE, puis les encadrés propres à la fiche
    if outil:
        b.append(("encadre", "methode") + (outil[0], outil[1]))
    for typ, titre, corps in f.get("encadres", []):
        b.append(("encadre", typ, titre, corps))

    # ── LE PLAN, puis JE RETIENS
    b.append(("p", "**Proposition de plan de commentaire composé**"))
    for titre, contenu in f["plan"]:
        if isinstance(contenu, str):
            b.append(("p", "*%s.* %s" % (titre, contenu)))
        else:
            b.append(("p", "*%s*" % titre))
            b += [("puce", s) for s in contenu]
    b.append(("p", "**Conclusion / ouverture** — " + f["ouverture"]))
    b.append(("encadre", "retiens", "L'essentiel de la séance", _je_retiens(f)))

    # ── JE M'ENTRAÎNE
    b.append(("p", "**Différenciation**"))
    b.append(("p", "*Parcours 1 ★*"))
    b += [("puce", q) for q in f["parcours1"]]
    b.append(("p", "*Parcours 2 ★★*"))
    b += [("puce", q) for q in f["parcours2"]]
    b.append(("encadre", "entraine", "Application immédiate", [f["examen"]]))
    if index < total:
        b.append(("saut",))
    return b


def section_fiches(fiches, genre=""):
    """Le cœur du cahier : six séquences de lecture méthodique.

    Chaque séquence porte son outil, ses encadrés et son entraînement. Rien
    n'est renvoyé à la fin : l'élève lit, comprend, observe, analyse,
    s'outille, retient et s'exerce dans le même mouvement.
    """
    b = [("h2", "6 bis. Lectures méthodiques — six séquences complètes"),
         ("p", "Chaque séquence suit le même chemin : **je lis, je comprends, "
               "j'observe, j'analyse**, puis l'outil dont la séance a besoin, "
               "ce qu'il faut retenir, et une application immédiate. L'extrait "
               "est relevé sur le texte intégral ; les coupes à l'intérieur "
               "d'un passage sont signalées par […] et aucune phrase n'a été "
               "reformulée."),
         ("encadre", "astuce", "Comment travailler une séquence", [
             "**Une séance = une séquence.** N'essayez pas d'en faire deux : "
             "le tableau des quatre colonnes prend à lui seul vingt minutes, "
             "et c'est lui qui fait le travail.",
             "**Ne sautez pas « Je comprends ».** Analyser un texte qu'on n'a "
             "pas compris produit des phrases justes sur un contresens.",
             "**L'outil de la séance est à employer le jour même**, sur ce "
             "texte-ci. Le relire trois semaines plus tard ne l'apprend pas."])]
    outils = apparat.outils_de_seance(genre) if genre else []
    for i, f in enumerate(fiches, 1):
        outil = outils[i - 1] if i - 1 < len(outils) else None
        b += blocs_fiche(f, i, len(fiches), outil)
        # Une première carte mentale dès la deuxième séquence : l'élève la
        # complète au fur et à mesure au lieu de la découvrir à la dernière
        # page, quand elle ne lui sert plus à rien.
        if i == 2:
            b += apparat.carte_amorce(fiches[:2])
    return b


# « centre d'intérêt » est masculin, « partie » est féminin : deux séries,
# faute de quoi le cahier imprime « Premier partie ».
ORDINAUX_M = ("Premier", "Deuxième", "Troisième", "Quatrième")
ORDINAUX_F = ("Première", "Deuxième", "Troisième", "Quatrième")


def _normaliser_obc(d, cle, kind, index):
    """Met un devoir rédigé au format du corrigé harmonisé national.

    Trois opérations, et aucune ne touche au texte des paragraphes :
      • l'introduction reçoit les rubriques du corrigé national — idée
        générale et problématique pour un commentaire, thème, reformulation,
        problématique et type de plan pour une dissertation ;
      • les parties « I. », « II. », « III. » sont renommées en centres
        d'intérêt (commentaire) ou en parties (dissertation) ;
      • le commentaire reçoit sa rubrique finale « Intérêts du texte », que la
        grille note 1,5 point.

    Un devoir déjà rédigé sur la maquette — ceux du cahier « stances » — n'a
    pas d'entrée dans `obc_devoirs` et ressort inchangé.
    """
    sup = (obc_devoirs.commentaire(cle, index) if kind == "cc"
           else obc_devoirs.dissertation(cle, index))
    if not sup:
        return d

    corps = []
    for titre, paras in d["corps"]:
        t = titre.strip()
        if t == "Introduction":
            # Un commentaire composé ne porte pas de problématique : la
            # charpente du corrigé national est situation, idée générale,
            # plan possible, parties, intérêts du texte. La problématique
            # appartient à la dissertation.
            ajout = ([("**Idée générale.** " + sup["idee"]),
                      ("**Plan possible.** " + sup["annonce"])]
                     if kind == "cc" else
                     [("**Thème.** " + sup["theme"]),
                      ("**Reformulation.** " + sup["reformulation"]),
                      ("**Problématique.** " + sup["problematique"]),
                      ("**Type de plan.** " + sup["type_plan"]),
                      ("**Plan possible.** " + sup["annonce"])])
            corps.append((titre, list(paras) + ajout))
            continue

        m = re.match(r"^([IVX]+)\.\s*(.*)$", t)
        if m:
            rang = {"I": 1, "II": 2, "III": 3, "IV": 4}.get(m.group(1), 1)
            libelle = ("%s centre d'intérêt" % ORDINAUX_M[rang - 1]
                       if kind == "cc" else
                       "%s partie" % ORDINAUX_F[rang - 1])
            corps.append(("%s — %s" % (libelle, m.group(2)), paras))
            continue

        if kind == "diss" and t == "Conclusion":
            corps.append(("Synthèse", paras))
            continue
        corps.append((titre, paras))

    if kind == "cc" and sup.get("interets"):
        corps.append(("Intérêts du texte", list(sup["interets"])))

    d = dict(d)
    d["corps"] = corps
    return d


def blocs_devoir_redige(d):
    b = [("h3", d["numero"])]
    b.append(("encadre", "objectif", "Sujet", [d["sujet"]]))
    # Un commentaire composé porte sur un texte. Quand ce texte n'est pas déjà
    # reproduit par une fiche, le devoir doit le porter lui-même : un modèle
    # rédigé que l'élève ne peut pas confronter au texte ne lui apprend rien.
    if d.get("support"):
        b.append(_extrait(d["support"], d["source_support"],
                          d.get("disposition")))
    b.append(("pi", d["avertissement"]))
    for titre, paras in d["corps"]:
        b.append(("p", "**%s**" % titre))
        b += [("p", p) for p in paras]
    typ, titre, corps = d["encadre"]
    b.append(("encadre", typ, titre, corps))
    b.append(("saut",))
    return b


# Rappel du format officiel, placé en tête des devoirs rédigés. Un modèle
# qui ne dit pas à quelle épreuve il répond laisse l'élève deviner ce qu'on
# attend de lui — et il devine mal.
CADRE_MINESEC = ("methode", "L'épreuve de français du second cycle, en bref", [
    "**Une épreuve, quatre heures, trois sujets au choix.** Le candidat n'en "
    "traite qu'un seul. Choisir prend cinq minutes et se joue sur un critère : "
    "sur quel sujet ai-je des exemples précis à citer ?",
    "- **Sujet I — contraction et discussion.** Résumer un texte au quart de sa "
    "longueur (marge de ± 10 %), indiquer le nombre de mots, puis discuter une "
    "question qu'il pose. Noté 10 et 10.",
    "- **Sujet II — dissertation littéraire.** Discuter un jugement. Le corrigé "
    "national attend, dans cet ordre : thème, reformulation, problématique, "
    "type de plan, plan possible, puis les parties séparées par une "
    "transition, et une synthèse.",
    "- **Sujet III — commentaire composé.** Étudier un texte par **centres "
    "d'intérêt**, jamais ligne à ligne. Le corrigé national attend : situation "
    "du texte, idée générale, plan possible, première partie, transition, "
    "deuxième partie, et une rubrique **Intérêts du texte**.",
    "**Le barème réel, celui de la grille harmonisée** — et non celui qu'on "
    "imagine. Quatre critères, vingt points : **6 / 6 / 6 / 2**.",
    "- **Compréhension : 6 pts.** Au commentaire, ils se partagent ainsi : "
    "originalité du travail 1,5 ; **intérêts du texte 1,5** ; lecture "
    "pertinente du texte 3. La rubrique « Intérêts du texte » vaut donc à elle "
    "seule un point et demi : l'omettre coûte plus qu'une sous-partie "
    "manquante.",
    "- **Organisation des idées : 6 pts** — qualité des observations 3, "
    "précision et illustrations 3.",
    "- **Langue et style : 6 pts** — richesse et précision du vocabulaire 3 ; "
    "syntaxe, orthographe, emploi des temps 3.",
    "- **Présentation de la copie : 2 pts** — mise en page, lisibilité, "
    "propreté. Ces deux points se gagnent sans écrire une ligne de plus.",
    "**Le vocabulaire du correcteur.** Le corrigé national dit *centre "
    "d'intérêt* et non « axe », *sous-centre* et non « sous-partie », *outil "
    "d'analyse* et non « procédé ». Employer ces mots-là fait gagner du temps "
    "à celui qui vous lit.",
    "**La consigne que les correcteurs appliquent.** « On insistera tout "
    "particulièrement sur l'exploitation par le candidat des procédés de style, "
    "les éléments du vocabulaire, la syntaxe, etc. » Autrement dit : citer ne "
    "rapporte rien, analyser rapporte tout.",
])


def section_modeles(commentaires, dissertations, cle=None):
    b = [("h2", "8. Devoirs rédigés — commentaires composés et dissertations"),
         ("p", "Cette section ne propose pas des plans mais des devoirs entièrement "
               "rédigés, au format et à la longueur attendus le jour de l'épreuve. Ils "
               "sont donnés pour être lus et discutés en classe — non recopiés. Les "
               "intertitres en gras ne figureraient pas sur une copie de candidat : ils "
               "rendent la construction visible."),
         ("encadre",) + CADRE_MINESEC,
         ("encadre",) + obc.MAQUETTE_CC,
         ("encadre",) + obc.MAQUETTE_DISS,
         ("encadre",) + obc.LEXIQUE_OUTILS,
         ("encadre",) + obc.INTERETS_TEXTE]
    for i, d in enumerate(commentaires):
        b += blocs_devoir_redige(_normaliser_obc(d, cle, "cc", i))
    for i, d in enumerate(dissertations):
        b += blocs_devoir_redige(_normaliser_obc(d, cle, "diss", i))
    return b


def section_devoirs(d1, c1, d2, c2, encadres):
    b = [("h2", "9. Devoirs conformes au format MINESEC, corrigés et grilles"),
         ("p", "Deux devoirs conformes au format officiel de l'épreuve de français du "
               "second cycle, avec corrigés et grilles d'évaluation harmonisées de "
               "l'Office du Baccalauréat (quatre critères, vingt points).")]

    b.append(("h3", d1["titre"]))
    b.append(("grille", [["Rubrique", "Indication"]] + d1["entete"]))
    b.append(("pi", d1["consigne_generale"]))
    for s in d1["sujets"]:
        b.append(("p", "**%s**" % s["num"]))
        b.append(("pi", "Barème — " + s["bareme"]))
        if s["support"]:
            b.append(_extrait(s["support"], s["source_support"], s.get("disposition")))
        b += [("p", c) for c in s["consignes"]]
    b.append(("saut",))

    b.append(("h3", c1["titre"]))
    b.append(("pi", c1["intro"]))
    for s in c1["sujets"]:
        b.append(("p", "**%s**" % s["num"]))
        for titre, contenu in s["blocs"]:
            if contenu is None:
                b.append(("p", "*%s*" % titre))
            elif isinstance(contenu, str):
                b.append(("p", "*%s.* %s" % (titre, contenu)))
            else:
                b.append(("p", "*%s*" % titre))
                b += [("puce", it) for it in contenu]
        b.append(("grille", obc.grille_pour(s["num"], s["grille"])))
        b.append(("pi", obc.cloture_pour(s["num"], s["cloture"])))
        b.append(("saut",))

    b.append(("h3", d2["titre"]))
    b.append(("grille", [["Rubrique", "Indication"]] + d2["entete"]))
    b.append(("pi", d2["consigne_generale"]))
    b.append(("p", "**Texte support**"))
    b.append(_extrait(d2["support"], d2["source_support"], d2.get("disposition")))
    for titre, qs in d2["questions"]:
        b.append(("p", "**%s**" % titre))
        b += [("p", q) for q in qs]
    b.append(("saut",))

    b.append(("h3", c2["titre"]))
    for titre, contenu in c2["reponses"]:
        b.append(("p", "*%s*" % titre if contenu is None
                  else "*%s* — %s" % (titre, contenu)))
    b.append(("grille", c2["grille_prod"]))
    b.append(("pi", c2["cloture"]))
    for typ, titre, corps in encadres:
        b.append(("encadre", typ, titre, corps))
    return b


def section_vers_examen(cle, fiches):
    """Rubrique finale : deux entraînements complets, au format des deux examens visés."""
    v = vers_examen.PAR_CAHIER[cle]
    bar_cc, bar_diss = vers_examen.baremes(cle)
    b = [("saut",),
         ("h2", vers_examen.titre_rubrique(cle)),
         ("p", vers_examen.chapeau(cle))]

    for niveau, titre, rappel in vers_examen.parcours(cle):
        e = v[niveau]
        b.append(("h3", titre))
        b.append(("encadre", "objectif", "Format de l'épreuve", [rappel]))

        c = e["commentaire"]
        f = fiches[c["fiche"] - 1]
        b.append(("p", "**Sujet A — Commentaire composé**"))
        b.append(("pi", bar_cc))
        b.append(_extrait(f["extrait"], f["source"], f.get("disposition")))
        b.append(("p", c["consigne"]))
        b.append(("p", "*Pistes d'exploitation*"))
        b += [("puce", p) for p in c["pistes"]]

        d = e["dissertation"]
        b.append(("p", "**Sujet B — Dissertation littéraire**"))
        b.append(("pi", bar_diss))
        b.append(("p", d["sujet"]))
        b.append(("p", "*Pistes d'exploitation*"))
        b += [("puce", p) for p in d["pistes"]]
        b.append(("saut",))
    return b


# Identité des cinq cahiers relus : leur paratexte vient d'un markdown, non
# d'un module `front`, et ne porte donc pas de champ `titre`/`auteur`/`genre`.
# L'appareil pédagogique en a besoin pour se décliner selon le genre.
IDENTITE = {
    "vieuxnegre": ("Le vieux nègre et la médaille", "Ferdinand Oyono", "roman"),
    "lionperle": ("Le lion et la perle", "Wole Soyinka", "théâtre"),
    "ngum": ("Ngum a Jemea", "David Mbanga Eyombwan", "théâtre"),
    "capitoline": ("Les tribus de Capitoline", "P.-C. Ombété-Bella", "roman"),
    "tenebres": ("Au cœur des ténèbres", "Joseph Conrad", "roman"),
}


def _genre_du_cahier(cle, infos):
    """Le genre déclaré du cahier, quelle que soit sa provenance.

    Les cahiers neufs le portent dans `INFOS` ; les cinq relus n'ont que la
    table `IDENTITE`. Sans genre, la séquence se passe d'outil plutôt que
    d'en servir un qui ne conviendrait pas au texte.
    """
    if infos:
        return infos.get("genre", "")
    return IDENTITE[cle][2] if cle in IDENTITE else ""


def _identite(cle, infos):
    """(titre, auteur, genre, axes, thèmes) du cahier, ou None."""
    if infos:
        return (infos.get("titre", ""), infos.get("auteur", ""),
                infos.get("genre", ""), infos.get("axes"), infos.get("themes"))
    if cle in IDENTITE:
        titre, auteur, genre = IDENTITE[cle]
        return titre, auteur, genre, None, None
    return None


def _inserer_avant(blocs, debut, nouveaux):
    """Glisse `nouveaux` juste avant le premier titre qui commence par `debut`.

    Si le titre n'est pas trouvé, on n'insère rien et on le dit : une section
    posée au hasard désoriente plus qu'elle n'aide.
    """
    if not nouveaux:
        return blocs
    for i, b in enumerate(blocs):
        if (b[0].startswith("h") and isinstance(b[1], str)
                and b[1].strip().startswith(debut)):
            return blocs[:i] + nouveaux + blocs[i:]
    print("   !! titre %r introuvable : section non inseree" % debut)
    return blocs


def _grille_apres(blocs, debut):
    """Le premier tableau qui suit un titre, sans sa ligne d'en-tête.

    Les cahiers relus portent leurs thèmes et leurs axes dans des tableaux
    du markdown d'origine : les relire là plutôt que les redemander évite
    qu'une carte mentale contredise le cahier qui la contient.
    """
    i = _index_titre(blocs, debut)
    if i is None:
        return None
    for b in blocs[i + 1:]:
        if b[0] == "grille" and len(b[1]) > 1:
            return [list(l) for l in b[1][1:]]
        if b[0] in ("h1", "h2"):
            return None
    return None


def _recolter(blocs, axes, themes):
    """Complète ce que le cahier n'a pas déclaré, avec ce qu'il contient.

    Sans cela, la carte mentale d'un cahier relu s'arrêtait aux textes
    étudiés : les branches « axes » et « thèmes » ne se rendaient pas, et
    la numérotation sautait de cinq à huit.
    """
    if themes is None:
        themes = _grille_apres(blocs, "IV.")
    if axes is None:
        lignes = _grille_apres(blocs, "6. Axes")
        if lignes:
            # (titre, [texte]) : la forme qu'attend `apparat.carte_mentale`,
            # celle que les cahiers neufs fournissent directement.
            axes = [(l[0], [" — ".join(x for x in l[1:] if x)])
                    for l in lignes if l and l[0]]
    return axes, themes


def section_apparat(blocs, cle, fiches, infos=None):
    """Range chaque partie de l'appareil pedagogique a sa place.

    Elles etaient toutes empilees en fin de cahier. Trois d'entre elles
    servent avant : on outille l'eleve avant qu'il analyse, il fiche l'oeuvre
    quand il vient de la lire, et il synthetise quand il vient d'etudier les
    six textes. Seule la derniere revision reste a la fin.
    """
    ident = _identite(cle, infos)
    if not ident:
        return blocs
    titre, auteur, genre, axes, themes = ident
    axes, themes = _recolter(blocs, axes, themes)
    donnees = oeuvres.donnees(cle)

    # La boîte à outils complète ne s'ouvre plus le cahier : ses six outils
    # sont servis un par séquence, là où ils travaillent. Elle reste à la fin
    # comme mémento de révision — deux niveaux, et c'est voulu.
    # Le mémento se consulte : il précède les annexes (thèmes, lexique,
    # bibliographie) au lieu de les suivre.
    blocs = _inserer_avant(blocs, "IV.", apparat.grande_boite(genre))
    blocs = _inserer_avant(blocs, "4. N\u00e9gociation",
                           apparat.fiche_lecture(titre, auteur, genre))
    synthese = (apparat.carte_mentale(titre, fiches, axes, themes, donnees)
                + apparat.exercices_bilan(titre, fiches, themes, donnees))
    return _inserer_avant(blocs, "7. Expos\u00e9s", synthese)


def section_revision(cle, fiches):
    """Dernière page du cahier : ce qu'un candidat révise la veille.

    Elle n'apporte aucun contenu neuf — c'est le principe d'une révision. Elle
    rassemble ce qui est déjà dans le cahier et que l'élève ne retrouverait
    pas en feuilletant trois cents pages la veille de l'épreuve : les textes
    étudiés, les dates, et la liste des fautes qui coûtent le plus cher.
    """
    b = [("saut",),
         ("h2", "11. Avant l'épreuve — la dernière révision"),
         ("p", "Cette page ne s'apprend pas : elle se relit. Elle rassemble ce que "
               "le cahier a établi, dans l'ordre où un candidat en a besoin.")]

    b.append(("h3", "Les textes étudiés"))
    b.append(("p", "Pour chacun, savoir le situer dans l'œuvre en une phrase et "
                   "citer deux passages de mémoire. Un devoir sans citation exacte "
                   "ne dépasse pas la moyenne."))
    b.append(("grille", [["Fiche", "Ce qu'elle établit"]]
              + [[f["titre"], f["repere"]] for f in fiches]))

    c = complements.PAR_CAHIER.get(cle)
    if c:
        b.append(("h3", "Les dates à connaître"))
        b.append(("p", "Trois ou quatre suffisent, et elles doivent être exactes. "
                       "Une date fausse dans une introduction coûte plus qu'une "
                       "date absente."))
        b.append(("grille", [["Date", "Fait"]] + [list(l) for l in c["chrono"]]))

    b.append(("h3", "Les six gestes qui rapportent des points"))
    b += [("num", x) for x in [
        "**Lire le sujet deux fois et l'écrire en haut du brouillon.** La moitié "
        "des hors-sujets viennent d'une consigne lue une seule fois.",
        "**Rédiger l'introduction entièrement au brouillon.** C'est le seul "
        "paragraphe que le correcteur lit avec une attention totale.",
        "**Poser une problématique sous forme de question.** Une étiquette "
        "thématique — « le temps qui passe » — n'en est pas une.",
        "**Citer court et analyser long.** Une citation de deux lignes suivie de "
        "rien vaut moins qu'un seul mot cité suivi de trois phrases.",
        "**Nommer le procédé, puis dire son effet.** « Il y a une anaphore » ne "
        "rapporte rien ; « la reprise de… donne l'impression que… » rapporte.",
        "**Garder dix minutes pour se relire.** Accords, temps verbaux, "
        "majuscules des citations : deux points de langue se gagnent là.",
    ]]

    b.append(("h3", "Les cinq fautes qui coûtent le plus cher"))
    b += [("puce", x) for x in [
        "**Paraphraser.** Raconter le texte n'est pas le commenter. Le test : si "
        "la phrase pourrait figurer dans un résumé, elle n'a rien à faire dans un "
        "commentaire.",
        "**Le plan linéaire déguisé.** Trois axes qui suivent l'ordre du texte "
        "font un commentaire linéaire avec des titres. Un axe doit traverser le "
        "texte d'un bout à l'autre.",
        "**Séparer le fond de la forme.** Un axe sur le sens, un axe sur le "
        "style : deux devoirs juxtaposés. Chaque procédé s'analyse là où il sert "
        "le sens.",
        "**Réciter la biographie de l'auteur.** Elle ne vaut que si elle éclaire "
        "le texte à commenter. Sinon, deux lignes suffisent.",
        "**Bâcler la conclusion.** Elle vaut trois points sur vingt, autant que "
        "l'introduction. Qui se sait lent la rédige au brouillon avant de "
        "commencer le développement.",
    ]]

    b.append(("encadre", "objectif", "Le quart d'heure qui précède", [
        "Ne rien lire de nouveau. Relire ce tableau, deux citations par texte, "
        "et les dates.",
        "Vérifier son matériel : deux stylos, une règle, une montre.",
        "Se rappeler qu'on ne traite **qu'un seul** des trois sujets, et que le "
        "choix se fait sur les exemples qu'on a en tête — non sur le sujet qui "
        "paraît le plus facile.",
    ]))
    return b


# ─────────────────────────────────────────────────────────────── assemblage
# Préfixes de numérotation à remplacer : chiffres romains, arabes, et les
# suffixes latins hérités de l'ancienne structure.
_NUM = re.compile(
    r"^\s*(?:[IVX]{1,5}|\d{1,2})\s*"
    r"(?:bis|ter|quater|quinquies|sexies)?\s*[\.\u2014-]?\s+")


# Les liminaires : ils ouvrent le volume mais ne sont pas des étapes.
_LIMINAIRES = ("Comment utiliser ce cahier", "Sommaire",
               "Note aux enseignant")

# Les sections qui ouvrent une grande partie. Le titre de la partie nomme le
# geste demandé à l'élève ; la section, elle, garde son propre intitulé et
# devient la première sous-partie. Promouvoir la section faisait disparaître
# son nom — « Exposés » devenait « Je m'entraîne » — et laissait la partie
# avec un seul enfant numéroté, ce qui n'ordonne rien.
_PARTIES = [
    ("6 bis. Lectures méthodiques", "Je lis et j'analyse"),
    ("6. Axes", "J'interprète l'œuvre"),
    ("7. Exposés", "Je m'entraîne"),
    ("9. Devoirs conformes", "Je me prépare à l'examen"),
    ("11. Avant l'épreuve", "Je révise"),
]

# Seule celle-ci devient la partie elle-même : son intitulé est déjà le nom
# du geste, et la dédoubler produirait « 10.1 Grande boîte à outils » sous
# « Partie 10 — La grande boîte à outils ».
_PARTIE_UNIQUE = ("Grande boîte à outils",
                  "La grande boîte à outils — mémento du lecteur")

# Le bloc de synthèse à déplacer : du premier de ces titres jusqu'au titre
# qui suit les axes.
_SYNTHESE_DEBUT = "5 bis."
_SYNTHESE_FIN = "6 bis. Lectures méthodiques"

# Les séries dont le numéro fait partie du nom : « Séquence 3 » se cite, se
# renvoie, se cherche dans le sommaire. Tout autre chiffre en tête d'un titre
# de niveau 3 est un reliquat de l'ancienne numérotation et disparaît.
_SERIES = ("Séquence", "Exercice", "Branche", "Axe", "Étape", "Devoir",
           "Contrôle", "Commentaire composé", "Dissertation", "Fiche",
           "Vers ", "À mi-parcours")

_NUM_H3 = re.compile("^\\s*\\d+(?:\\.\\d+)*\\s*[.)\u2014\\-]?\\s+")


# Un cahier relu peut n'avoir jamais eu la section de synthèse — étude des
# personnages, des lieux, schéma. Sans elle, `_deplacer_synthese` n'a rien à
# déplacer : les axes restent devant les six séquences, et le cahier demande
# d'interpréter l'œuvre avant de l'avoir lue. On la fournit plutôt que de
# laisser le plan diverger du reste de la collection.
def _completer_synthese(blocs, cle):
    manquant = oeuvres.SYNTHESE_ABSENTE.get(cle) if cle else None
    if not manquant or _index_titre(blocs, _SYNTHESE_DEBUT) is not None:
        return blocs
    i = _index_titre(blocs, "6. Axes")
    if i is None:
        print("   !! %s : « 6. Axes » introuvable, synthese non inseree" % cle)
        return blocs
    return blocs[:i] + manquant() + blocs[i:]


def _index_titre(blocs, debut, depuis=0):
    for i in range(depuis, len(blocs)):
        b = blocs[i]
        if (b[0] in ("h1", "h2") and isinstance(b[1], str)
                and b[1].strip().startswith(debut)):
            return i
    return None


def _deplacer_synthese(blocs):
    """L'étude des personnages, des lieux, du schéma et les axes passent
    après les six séquences : on ne donne pas les conclusions d'une œuvre
    avant d'en avoir lu les textes."""
    i = _index_titre(blocs, _SYNTHESE_DEBUT)
    j = _index_titre(blocs, _SYNTHESE_FIN, i or 0)
    if i is None or j is None or j <= i:
        return blocs
    # fin du bloc des séquences : le titre de niveau 1 ou 2 qui les suit
    k = None
    for x in range(j + 1, len(blocs)):
        b = blocs[x]
        if (b[0] in ("h1", "h2") and isinstance(b[1], str)
                and not b[1].strip().startswith("6 bis")):
            k = x
            break
    if k is None:
        return blocs
    synthese, sequences = blocs[i:j], blocs[j:k]
    return blocs[:i] + sequences + synthese + blocs[k:]


def _ordre_entree(blocs):
    """Le carnet de bord accompagne la lecture : il précède le contrôle.

    L'ordre hérité posait le contrôle de lecture avant les devoirs qui
    accompagnent la lecture, et l'élève retrouvait donc en devoir les
    questions auxquelles il venait de répondre en classe. On lit d'abord,
    on est contrôlé ensuite.
    """
    i = _index_titre(blocs, "5. Devoirs progressifs")
    if i is None:
        i = _index_titre(blocs, "5. Carnet de bord")
    cible = _index_titre(blocs, "3. Contrôle de lecture")
    if i is None or cible is None or cible >= i:
        return blocs
    fin = next((x for x in range(i + 1, len(blocs))
                if blocs[x][0] in ("h1", "h2")
                and isinstance(blocs[x][1], str)), len(blocs))
    carnet = blocs[i:fin]
    return blocs[:cible] + carnet + blocs[cible:i] + blocs[fin:]


def _ouvrir_partie(blocs, debut, titre):
    """Insère un titre de grande partie devant une section, sans l'effacer."""
    i = _index_titre(blocs, debut)
    if i is None:
        return blocs
    return blocs[:i] + [("saut",), ("h1", titre)] + blocs[i:]


def _promouvoir(blocs):
    """La seule section dont l'intitulé est déjà celui d'une grande partie."""
    debut, titre = _PARTIE_UNIQUE
    out = []
    for b in blocs:
        if (b[0] == "h2" and isinstance(b[1], str)
                and b[1].strip().startswith(debut)):
            out.append(("h1", titre))
        else:
            out.append(b)
    return out


def _etiquettes_h3(blocs):
    """Une étiquette, un objet.

    « Devoir n° 1 » désignait à la fois le premier devoir d'accompagnement
    de la lecture et l'épreuve blanche de type BAC : deux objets sans
    rapport, dans deux parties différentes, sous le même nom. Les devoirs
    d'accompagnement deviennent des **étapes** — ce qu'ils sont : des
    jalons de la lecture, pas des notes.

    Le contrôle de lecture porte aussi deux noms selon la famille de
    cahiers (« Contrôle n° 1 » / « Contrôle de lecture n° 1 ») ; une
    collection n'a qu'un nom par objet.
    """
    out, dans_carnet = [], False
    for b in blocs:
        if b[0] in ("h1", "h2") and isinstance(b[1], str):
            t = b[1].strip()
            dans_carnet = t.startswith(("5. Devoirs progressifs",
                                        "5. Carnet de bord"))
            if dans_carnet:
                b = (b[0], "5. Carnet de bord — je lis l'œuvre étape par étape")
            out.append(b)
            continue
        if b[0] == "h3" and isinstance(b[1], str):
            t = b[1].strip()
            if dans_carnet and t.startswith("Devoir n°"):
                b = ("h3", re.sub(r"^Devoir n°\s*(\d+)", r"Étape \1", t))
            elif re.match(r"^Contrôle n°", t):
                b = ("h3", t.replace("Contrôle n°", "Contrôle de lecture n°", 1))
        out.append(b)
    return out


def _denumeroter_h3(blocs):
    """Un titre de niveau 3 porte un nom, ou un nom de série suivi d'un numéro.

    « 1.1 Le titre » se lisait sous « 3.1 Analyse du paratexte » : le numéro
    venait de la structure d'origine, que le changement de plan a rendue
    caduque. Le supprimer vaut mieux que le corriger, car il ne sert à rien
    qu'à se périmer une fois de plus.
    """
    out = []
    for b in blocs:
        if b[0] == "h3" and isinstance(b[1], str):
            t = b[1].strip()
            if not t.startswith(_SERIES):
                nu = _NUM_H3.sub("", t).strip()
                if nu and nu != t:
                    b = ("h3", nu)
        out.append(b)
    return out


# Les renvois internes hérités du markdown pointent vers une numérotation
# qui n'existe plus : « § III.6 bis » désignait les lectures méthodiques du
# temps où le cahier avait des parties en chiffres romains et des sections
# « bis ». Un renvoi à un numéro se périme au premier changement de plan ;
# un renvoi à un NOM ne se périme pas. On remplace donc les uns par les autres.
#
# Les références au Guide pédagogique du MINESEC — « § III.2 », « § IV.1 »,
# « § VI », « § VII » — désignent le texte officiel, pas le cahier : elles ne
# sont pas touchées. La table est donc explicite, et le contrôle de fin
# signale tout renvoi interne qu'elle n'aurait pas prévu.
_RENVOIS = [
    ("§ III.6 bis", "« Lectures méthodiques »"),
    ("§ III.6 ter", "« Lecture analytique — l'exercice oral »"),
    ("§ III.6, fiche", "« Lectures méthodiques », séquence"),
    ("§ III.1", "« Analyse du paratexte »"),
    ("§ III.4", "« Négociation du projet d'étude »"),
    ("§ III.7", "« Exposés »"),
    ("§ III.8", "« Devoirs rédigés »"),
    ("(§ 4)", "(voir « Négociation du projet d'étude »)"),
]

# Ce qui ressemble à un renvoi interne resté en place après la substitution.
_RENVOI_MORT = re.compile(r"§ ?III\.(?!2)|§ ?V\.|\(§ ?\d\)")


def _reecrire(txt):
    for vieux, neuf in _RENVOIS:
        txt = txt.replace(vieux, neuf)
    return txt


def _renvois(blocs, cle=None):
    """Applique la table à tout le texte du cahier, tableaux compris."""
    out, morts = [], 0
    for b in blocs:
        neuf = []
        for x in b:
            if isinstance(x, str):
                x = _reecrire(x)
                morts += len(_RENVOI_MORT.findall(x))
            elif isinstance(x, list):
                x = [[_reecrire(c) if isinstance(c, str) else c for c in l]
                     if isinstance(l, list) else
                     (_reecrire(l) if isinstance(l, str) else l) for l in x]
                morts += sum(len(_RENVOI_MORT.findall(c))
                             for l in x for c in (l if isinstance(l, list) else [l])
                             if isinstance(c, str))
            neuf.append(x)
        out.append(tuple(neuf))
    if morts:
        print("   !! %s : %d renvoi(s) interne(s) sans equivalent"
              % (cle or "?", morts))
    return out


# Deux parties n'avaient qu'une seule section numérotée, dont le titre
# redisait celui de la partie : « Partie 4 — Je lis et j'analyse » ne
# contenait que « 4.1 Lectures méthodiques », et les six séquences restaient
# au niveau 3 — donc absentes du sommaire d'un volume de trois cents pages.
# La section est absorbée : son texte passe sous le titre de partie, et ses
# sous-titres montent d'un cran. Le sommaire annonce enfin les six séquences.
_ABSORBER = {
    "Je lis et j'analyse": "Je lis et j'analyse — six lectures méthodiques",
    "Je révise": "Je révise — la dernière révision avant l'épreuve",
}


def _absorber_section_unique(blocs):
    out = list(blocs)
    # repérer chaque partie et ses sections
    parties = []
    for i, b in enumerate(out):
        if b[0] == "h1" and isinstance(b[1], str):
            parties.append([i, b[1].strip(), []])
        elif b[0] == "h2" and isinstance(b[1], str) and parties:
            parties[-1][2].append(i)

    a_couper = set()
    for k, (i, titre, sections) in enumerate(parties):
        if titre not in _ABSORBER or len(sections) != 1:
            continue
        fin = parties[k + 1][0] if k + 1 < len(parties) else len(out)
        out[i] = ("h1", _ABSORBER[titre])
        a_couper.add(sections[0])
        for j in range(sections[0] + 1, fin):
            if out[j][0] == "h3" and isinstance(out[j][1], str):
                out[j] = ("h2", out[j][1])
    return [b for j, b in enumerate(out) if j not in a_couper]


def _cle_question(t):
    """Une question, ramenée à ce qui l'identifie.

    Les deux familles de cahiers n'écrivent pas l'apostrophe de la même
    façon — droite dans les modules `front`, typographique dans le markdown
    relu — et les espaces insécables varient. Comparer les chaînes brutes
    rendait la table muette pour cinq cahiers sur neuf.
    """
    t = (t or "").replace("\u2019", "'").replace("\u00a0", " ")
    return re.sub(r"\s+", " ", t).strip().lower()


def _reecrire_questions(blocs, cle):
    """Remplace les questions qui en répétaient une autre.

    Voir `controles.py` pour la table et le principe. Toute entrée qui ne
    trouve plus sa cible est signalée : une table de réécriture qui ne
    s'applique plus est pire qu'une absence de table, car elle laisse croire
    que le défaut est corrigé.
    """
    table = {_cle_question(a): b for a, b in
             controles.REECRITURES.get(cle or "", [])}
    if not table:
        return blocs
    vus, out = set(), []
    for b in blocs:
        if b[0] in ("p", "pi", "num", "puce") and isinstance(b[1], str):
            k = _cle_question(b[1])
            if k in table:
                vus.add(k)
                b = (b[0], table[k])
        out.append(b)
    manquantes = [k for k in table if k not in vus]
    if manquantes:
        print("   !! %s : %d question(s) a reecrire introuvable(s)"
              % (cle, len(manquantes)))
        for k in manquantes:
            print("      - %s" % k[:88])
    return out


def _refaire_augurales(blocs, cle):
    """Remplace l'entrée dans l'œuvre par une version adressée à l'élève.

    L'ancienne section parlait à l'enseignant — « Séance d'ouverture
    (55 minutes) », « Demandez à la classe », « Ramassez les papiers ». Un
    élève qui ouvrait son cahier au premier jour y lisait les consignes d'un
    autre. Voir `augurales.py` : ce qui revient au professeur y est conservé,
    dans un encadré, à la fin de la section.
    """
    neuf = augurales.blocs(cle)
    if not neuf:
        return blocs
    i = _index_titre(blocs, "2. Activités augurales")
    if i is None:
        print("   !! %s : section augurale introuvable, non remplacee" % cle)
        return blocs
    fin = next((x for x in range(i + 1, len(blocs))
                if blocs[x][0] in ("h1", "h2")
                and isinstance(blocs[x][1], str)), len(blocs))
    return blocs[:i] + neuf + blocs[fin:]


def _ouvrir_carnet(blocs, cle):
    """Remplace ce qui suit le titre du carnet de bord, avant la première
    étape, par une consigne écrite pour l'élève.

    Sept cahiers sur neuf n'avaient rien entre le titre de la rubrique et la
    première question. Les deux autres avaient une note d'auteur — dont un
    renvoi « au cahier précédent », que l'élève n'a pas.
    """
    i = _index_titre(blocs, "5. Carnet de bord")
    if i is None:
        return blocs
    fin = next((x for x in range(i + 1, len(blocs))
                if blocs[x][0] in ("h1", "h2", "h3")
                and isinstance(blocs[x][1], str)), len(blocs))
    return blocs[:i + 1] + augurales.carnet(cle) + blocs[fin:]


def architecture(blocs, cle=None):
    """Les opérations, dans l'ordre."""
    blocs = _refaire_augurales(blocs, cle)
    blocs = _completer_synthese(blocs, cle)
    blocs = _deplacer_synthese(blocs)
    blocs = _ordre_entree(blocs)
    blocs = _ouvrir_partie(blocs, "5 bis.", "Je reconstruis l'œuvre")
    # Le titre relu dans le markdown porte l'apostrophe typographique, celui
    # de `front` l'apostrophe droite : comparer sans elle.
    def _est_etude(b):
        return (b[0] == "h1" and isinstance(b[1], str)
                and b[1].strip().replace("\u2019", "'").startswith(
                    "III. Étude de l'œuvre"))

    blocs = [("h1", "J'entre dans l'œuvre") if _est_etude(b) else b
             for b in blocs]
    for debut, titre in _PARTIES:
        blocs = _ouvrir_partie(blocs, debut, titre)
    blocs = _promouvoir(blocs)
    blocs = _etiquettes_h3(blocs)
    blocs = _ouvrir_carnet(blocs, cle)
    blocs = _denumeroter_h3(blocs)
    blocs = _absorber_section_unique(blocs)
    blocs = _reecrire_questions(blocs, cle)
    return _renvois(blocs, cle)


def _refaire_sommaire(blocs):
    """Réécrit le sommaire à partir des titres réellement présents.

    Toute autre méthode suppose de renommer au même endroit le titre et son
    entrée de sommaire ; dès qu'une section est déplacée ou renumerétée,
    l'un des deux est oublié et le sommaire ment. Ici il est reconstruit en
    dernier, donc il ne peut annoncer que ce qui existe.
    """
    debut = next((i for i, b in enumerate(blocs)
                  if b[0] == "h1" and isinstance(b[1], str)
                  and b[1].strip() == "Sommaire"), None)
    if debut is None:
        return blocs
    fin = next((i for i in range(debut + 1, len(blocs))
                if blocs[i][0] == "h1"), len(blocs))

    entrees = []
    for b in blocs[fin:]:
        if b[0] == "h1" and isinstance(b[1], str):
            entrees.append(("p", b[1].strip()))
        elif b[0] == "h2" and isinstance(b[1], str):
            entrees.append(("p", "   " + b[1].strip()))

    garde = [b for b in blocs[debut + 1:fin]
             if b[0] == "saut" or (b[0] == "pi")]
    return blocs[:debut + 1] + entrees + garde + blocs[fin:]


def _renumeroter(blocs):
    """Donne aux titres une numérotation suivie, sans « bis » ni « ter ».

    Les grandes parties deviennent « Partie N — … », leurs sections « N.M … ».
    On construit d'abord la table complète, puis on l'applique aux titres ET
    aux entrées de sommaire : ainsi le sommaire annonce exactement ce que le
    corps contient, ce qu'un renommage fait à deux endroits ne garantit pas.
    """
    table, partie, section = {}, 0, 0
    for b in blocs:
        if b[0] not in ("h1", "h2") or not isinstance(b[1], str):
            continue
        brut = b[1].strip()
        nu = _NUM.sub("", brut).strip()
        if not nu:
            continue
        if b[0] == "h1":
            if nu.startswith(_LIMINAIRES):
                continue          # un liminaire n'est pas une étape du parcours
            partie += 1
            section = 0
            table[brut] = "Partie %d — %s" % (partie, nu)
        else:
            section += 1
            table[brut] = "%d.%d %s" % (partie, section, nu)
    if not table:
        return blocs

    out = []
    for b in blocs:
        if b[0] in ("h1", "h2") and isinstance(b[1], str):
            out.append((b[0], table.get(b[1].strip(), b[1])))
        elif b[0] == "p" and isinstance(b[1], str):
            # Les entrées de sommaire sont des paragraphes qui reprennent le
            # titre mot pour mot, parfois indentés de trois espaces.
            t = b[1].strip()
            if t in table:
                indent = "   " if b[1].startswith("   ") else ""
                out.append(("p", indent + table[t]))
            else:
                out.append(b)
        else:
            out.append(b)
    return out


def nouveau_document():
    doc = docx.Document()
    s = doc.sections[0]
    s.page_width, s.page_height = Cm(14.8), Cm(21)     # A5
    s.top_margin = s.bottom_margin = Cm(1.7)
    s.left_margin = s.right_margin = Cm(1.5)
    st = doc.styles["Normal"]
    st.font.name = "Cambria"
    st.font.size = Pt(10.5)
    return doc


def _greffer_contraction(cle, devoir1, corrige1):
    """Remplace le sujet I du devoir type examen par le support verbatim.

    Le texte inventé de la première version, et son corrigé, sont ignorés :
    voir enrichissement/README.md, « Règles de contenu ».
    """
    if not cle or cle not in contractions.PAR_CAHIER:
        return devoir1, corrige1
    devoir1 = dict(devoir1)
    devoir1["sujets"] = ([contractions.sujet_contraction(cle)]
                         + list(devoir1["sujets"])[1:])
    corrige1 = dict(corrige1)
    corrige1["sujets"] = ([contractions_corriges.corrige_contraction(cle)]
                          + list(corrige1["sujets"])[1:])
    return devoir1, corrige1


def build(nom_fichier, fiches, commentaires, dissertations,
          devoir1, corrige1, devoir2, corrige2, encadres_devoirs, cle=None):
    blocs = mdsource.lire(nom_fichier)
    # Le mode d'emploi ouvre les neuf volumes : c'est le propre d'une
    # collection que ses repères s'expliquent une fois pour toutes.
    blocs = front.mode_emploi() + blocs

    devoir1, corrige1 = _greffer_contraction(cle, devoir1, corrige1)

    # Le sommaire d'origine liste les anciens intitulés : on le met à jour.
    remplacements = {
        "6 bis. Lectures méthodiques (six fiches)":
            "6 bis. Lectures méthodiques — six fiches complètes",
        "8. Plans de commentaire composé":
            "8. Devoirs rédigés — commentaires composés et dissertations",
        "9. Devoir rédigé — un commentaire composé modèle":
            "9. Devoirs conformes au format MINESEC, corrigés et grilles",
        "10. Dissertation rédigée — un modèle":
            "10. Vers le Probatoire — Vers le BAC",
    }
    supprimes = ("10. Dissertation rédigée", "11. Évaluation finale")

    # Les sections ajoutées depuis la première version du cahier : le
    # sommaire d'origine les ignore, et il faut les y glisser à leur place.
    # La clé est l'entrée après laquelle insérer.
    insertions = {
        "III. Étude de l'œuvre":
            ["   Grande boîte à outils — le mémento du lecteur (à la fin)"],
        "   3. Contrôle de lecture":
            ["   3 bis. Fiche de lecture globale"],
        "   6 ter. Lecture analytique — l'exercice oral":
            ["   6 quater. Carte mentale de l'œuvre",
             "   6 quinquies. Faire le point sur l'œuvre entière"],
    }

    sommaire = []
    for b in blocs:
        if b[0] == "p" and isinstance(b[1], str):
            t = b[1].strip()
            if t in remplacements:
                sommaire.append(("p", remplacements[t]))
                continue
            if t.startswith(supprimes):
                continue
            sommaire.append(b)
            # `entree` et non `cle` : le paramètre `cle` de build() porte le
            # nom du cahier, et l'écraser ici faisait sauter en silence la
            # rubrique d'examen, les compléments et l'appareil pédagogique.
            for entree, ajouts in insertions.items():
                if t == entree.strip():
                    sommaire += [("p", x) for x in ajouts]
            # La dernière révision se glisse après la rubrique d'examen, quel
            # que soit le libellé exact de celle-ci.
            if t.startswith("10. Vers"):
                sommaire.append(("p", "   11. Avant l'épreuve — la dernière révision"))
            continue
        sommaire.append(b)
    blocs = sommaire

    # Les trois plages sont repérées sur la liste d'origine AVANT toute coupe :
    # sinon le deuxième remplacement chercherait un titre que le premier a
    # déjà supprimé, et emporterait toute la fin du document.
    plan = [
        ("6 bis. Lectures méthodiques", ["6 ter. Lecture analytique"],
         lambda: section_fiches(fiches, _genre_du_cahier(cle, None))),
        ("8. Plans de commentaire composé", ["11. Évaluation finale"],
         lambda: section_modeles(commentaires, dissertations, cle)),
        ("11. Évaluation finale", ["IV. Relevé synthétique"],
         lambda: section_devoirs(devoir1, corrige1, devoir2, corrige2,
                                 encadres_devoirs)
         + (section_vers_examen(cle, fiches)
            if cle and cle in vers_examen.PAR_CAHIER else [])
         + section_revision(cle, fiches)),
    ]
    plages = [(decouper(blocs, debut, fins), fabrique)
              for debut, fins, fabrique in plan]

    neufs = 0
    for (i, j), fabrique in reversed(plages):      # de la fin vers le début
        nouveaux = fabrique()
        neufs += K.words(nouveaux)
        blocs = blocs[:i] + nouveaux + blocs[j:]

    # Les compléments et l'appareil pédagogique viennent après les trois
    # remplacements : insérés avant, ils décaleraient les indices repérés par
    # `decouper`.
    blocs = _inserer_complements(blocs, cle)
    blocs = section_apparat(blocs, cle, fiches)

    blocs = _refaire_sommaire(_renumeroter(architecture(blocs, cle)))
    doc = nouveau_document()
    K.render(doc, blocs)
    cible = os.path.join(RACINE, nom_fichier)
    doc.save(cible)
    print("OK — %s" % nom_fichier)
    print("   contenu neuf ~%d mots  |  document %d blocs" % (neufs, len(blocs)))
    return cible


def _inserer_complements(blocs, cle):
    """Glisse la chronologie et la postérité à la fin de la section II.

    Le repère est le titre de la section III, présent dans les huit cahiers,
    qu'ils viennent d'un markdown relu ou du module `front`. Si ce titre
    n'était pas trouvé, on n'insérerait rien plutôt que de placer le bloc au
    hasard : un complément mal placé vaut moins que pas de complément.
    """
    ajout = complements.blocs(cle)
    if not ajout:
        return blocs
    for i, b in enumerate(blocs):
        if (b[0].startswith("h") and isinstance(b[1], str)
                and b[1].strip().startswith("III.")):
            return blocs[:i] + ajout + blocs[i:]
    print("   !! %s : section III introuvable, complements non inseres" % cle)
    return blocs


def build_neuf(nom_fichier, infos, fiches, commentaires, dissertations,
               devoir1, corrige1, devoir2, corrige2, encadres_devoirs, cle):
    """Assemble un cahier qui n'a pas de version antérieure.

    Les cinq premiers cahiers relisaient leur paratexte dans la conversion
    markdown du .docx d'origine (`mdsource.lire`). Une œuvre étudiée pour la
    première fois n'a rien à relire : son paratexte est rendu par `front`, à
    partir du dictionnaire `INFOS` de son module `<cahier>_front.py`. Les
    sections 6 bis à 10 sont fabriquées par les mêmes fonctions que pour les
    cinq autres — c'est la seule façon de garantir le même gabarit.
    """
    devoir1, corrige1 = _greffer_contraction(cle, devoir1, corrige1)

    blocs = front.page_titre(infos)
    blocs += front.mode_emploi()
    blocs += front.sommaire(infos)
    blocs += front.avant_fiches(infos)
    blocs += section_fiches(fiches, infos.get("genre", ""))
    blocs += front.apres_devoirs(infos)
    blocs += section_modeles(commentaires, dissertations, cle)
    blocs += section_devoirs(devoir1, corrige1, devoir2, corrige2, encadres_devoirs)
    if cle in vers_examen.PAR_CAHIER:
        blocs += section_vers_examen(cle, fiches)
    blocs += section_revision(cle, fiches)
    blocs += front.fin(infos)
    blocs = section_apparat(blocs, cle, fiches, infos)
    blocs = _inserer_complements(blocs, cle)

    blocs = _refaire_sommaire(_renumeroter(architecture(blocs, cle)))
    doc = nouveau_document()
    K.render(doc, blocs)
    cible = os.path.join(RACINE, nom_fichier)
    doc.save(cible)
    print("OK — %s" % nom_fichier)
    print("   contenu %d blocs  |  ~%d mots" % (len(blocs), K.words(blocs)))
    return cible


def controle_extraits(nom_fichier, minimum=300):
    """Longueur des extraits d'œuvre.

    Le seuil de 300 mots vaut pour la prose et le théâtre : au-dessous, un
    passage de roman est trop court pour qu'on en fasse une lecture
    méthodique. Un poème ne se mesure pas ainsi. « Ici-bas » fait
    cinquante-neuf mots et se commente entier ; le découper pour atteindre
    un quota le détruirait. Pour un cahier de poésie, l'unité qui compte
    est sémantique — poème entier, section numérotée entiere — et le seuil
    est porté à zéro par `build_all`.
    """
    doc = docx.Document(os.path.join(RACINE, nom_fichier))
    # Ce qui compte comme extrait : au-dessus de 150 mots en prose, au-dessus
    # de 40 en vers. Descendre le plancher pour tout ferait entrer dans le
    # compte les citations du guide pédagogique et les encadrés longs.
    plancher = 40 if minimum == 0 else 150
    faibles, total = [], 0
    for t in doc.tables:
        if len(t.rows) == 1 and len(t.columns) == 1:
            txt = t.rows[0].cells[0].text.strip()
            n = len(txt.split())
            if n > plancher and txt[0] not in K.PICTOS:
                total += 1
                if minimum and n < minimum:
                    faibles.append((n, txt[:58]))
    if minimum:
        print("   %d extraits ; %d sous %d mots" % (total, len(faibles), minimum))
    else:
        print("   %d extraits ; longueur libre (poésie : unité sémantique)" % total)
    for n, t in faibles:
        print("     !! %d — %s…" % (n, t))
    return not faibles
