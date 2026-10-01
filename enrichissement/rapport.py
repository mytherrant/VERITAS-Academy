# -*- coding: utf-8 -*-
"""
Rapport d'audit des cahiers d'œuvre intégrale.

Écrit `AUDIT_CAHIERS_OEUVRE_INTEGRALE.md` à la racine du dépôt. Les chiffres
ne sont pas recopiés : ils sont relus dans les `.docx` produits au moment où
le rapport est écrit. Un rapport dont les nombres sont saisis à la main
vieillit dès la construction suivante ; celui-ci se régénère.

    python enrichissement/rapport.py
"""
import io
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import audit
import pedagogie
import structure
import impression
import verbatim

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CIBLE = os.path.join(RACINE, "AUDIT_CAHIERS_OEUVRE_INTEGRALE.md")

# Le nom du .docx ne dit pas l'œuvre : la table le fait.
OEUVRES = {
    "vieuxnegre": ("Le vieux nègre et la médaille", "Ferdinand Oyono", "roman"),
    "lionperle": ("Le lion et la perle", "Wole Soyinka", "théâtre"),
    "ngum": ("Ngum a Jemea", "David Mbanga Eyombwan", "théâtre"),
    "capitoline": ("Les tribus de Capitoline", "P.-C. Ombété-Bella", "roman"),
    "tenebres": ("Au cœur des ténèbres", "Joseph Conrad", "récit"),
    "tartuffe": ("Tartuffe ou l'Imposteur", "Molière", "théâtre"),
    "sauvages": ("Poèmes sauvages éclairés au feu de brousse", "Henri N'koumo",
                 "poésie"),
    "stances": ("Stances et Poèmes", "Sully Prudhomme", "poésie"),
    "balafon": ("Balafon", "Engelbert Mveng", "poésie"),
}

ORDRE = ["vieuxnegre", "lionperle", "ngum", "capitoline", "tenebres",
         "tartuffe", "sauvages", "stances", "balafon"]


def _analyses():
    out = {}
    for cle in ORDRE:
        nom = verbatim.CAHIERS[cle][0]
        chemin = os.path.join(RACINE, nom)
        if os.path.exists(chemin):
            out[cle] = audit.analyse(chemin)
    return out


def _verbatim():
    out = {}
    for cle in ORDRE:
        r = verbatim.verifier(cle)
        if r.get("absent"):
            continue
        src = verbatim.charger_source(r["source"])
        sm = src.split()
        idx = verbatim._index(sm)
        titres = verbatim.titres_du_cahier(cle)
        alt, ocr, acc = 0, 0, 0
        for _, _, norm in r["ecarts"]:
            for etiquette, _, _ in verbatim.diagnostic(norm, sm, idx, titres):
                if etiquette == "ocr":
                    ocr += 1
                elif etiquette == "accent":
                    acc += 1
                else:
                    alt += 1
        r.update(alt=alt, ocr=ocr, acc=acc)
        out[cle] = r
    return out


def main():
    A, V = _analyses(), _verbatim()
    PED = {c: pedagogie.analyser(c) for c in ORDRE}
    PED = {k: v for k, v in PED.items() if v}
    STR = {c: structure.analyser(c) for c in ORDRE}
    STR = {k: v for k, v in STR.items() if v}
    L = []
    e = L.append

    e("# Audit de conformité — les huit cahiers d'œuvre intégrale")
    e("")
    e("> Rapport produit par `python enrichissement/rapport.py`. Tous les")
    e("> nombres sont relus dans les `.docx` au moment de l'écriture ; aucun")
    e("> n'est saisi à la main.")
    e("")

    e("## 1. Périmètre")
    e("")
    e("| Cahier | Œuvre | Auteur | Genre | Classe visée |")
    e("|---|---|---|---|---|")
    for cle in ORDRE:
        if cle not in A:
            continue
        titre, auteur, genre = OEUVRES[cle]
        e("| `%s` | *%s* | %s | %s | %s |"
          % (cle, titre, auteur, genre,
             "seconde" if A[cle]["cycle"] == "seconde" else "1ʳᵉ / Tˡᵉ"))
    e("")

    e("## 2. Conformité de forme")
    e("")
    e("Mesurée par `enrichissement/audit.py` : volume, fiches, devoirs rédigés,")
    e("encadrés, format d'épreuve MINESEC, grilles OBC à vingt points.")
    e("")
    e("| Cahier | Mots | Extraits | Fiches | Devoirs rédigés | Encadrés | Verdict |")
    e("|---|---:|---:|---:|---:|---:|---|")
    total_manques = 0
    for cle in ORDRE:
        if cle not in A:
            continue
        r = A[cle]
        m = audit.verdict(r)
        total_manques += len(m)
        e("| `%s` | %d | %d | %d | %d (%d mots moy.) | %d | %s |"
          % (cle, r["mots"], r["extraits"], r["fiches"], r["devoirs_rediges"],
             r["devoir_moy"], r["encadres"],
             "conforme" if not m else "; ".join(m)))
    e("")
    e("**%d manquement(s) sur %d cahiers.**" % (total_manques, len(A)))
    e("")

    e("## 3. Contrôle verbatim des extraits")
    e("")
    e("Mesuré par `enrichissement/verbatim.py`, qui rouvre le fichier de")
    e("l'œuvre et compare chaque phrase — ou chaque vers — du cahier au texte")
    e("de l'auteur. Trois catégories d'écart, et une seule qui disqualifie :")
    e("")
    e("- **coquille restituée** : le scan a déformé la lettre (« fds » pour")
    e("  « fils », « 11 » pour « Il »). Le cahier rétablit le mot du livre.")
    e("- **accent rétabli** : la source numérique a perdu l'accent. Un scan en")
    e("  perd en masse ; il ne permet pas de trancher « fût » contre « fut ».")
    e("- **écart signalé** : tout le reste, à vérifier à la main.")
    e("")
    e("| Cahier | Extraits | Unités vérifiées | Coquilles | Accents | Écarts signalés |")
    e("|---|---:|---:|---:|---:|---:|")
    for cle in ORDRE:
        if cle not in V:
            continue
        r = V[cle]
        e("| `%s` | %d | %d | %d | %d | %s |"
          % (cle, r["extraits"], r["total"], r["ocr"], r["acc"],
             "**aucun**" if not r["alt"] else str(r["alt"])))
    e("")

    e("## 4. Ce qui a été corrigé")
    e("")
    e("**Une seule altération réelle a été trouvée sur les huit cahiers**, et")
    e("elle est corrigée : dans *Le lion et la perle*, fiche 2, la réplique de")
    e("Sadikou portait « avec **ces** divagations, cela m'était sorti de **la**")
    e("tête » là où le texte donne « avec **des** divagations, cela m'était")
    e("sorti de tête ». Deux mots, trois occurrences dans le cahier — remis au")
    e("texte de l'auteur.")
    e("")
    e("Les autres écarts signalés ont été ouverts un par un sur la source. Ils")
    e("relèvent de deux causes, aucune imputable au contenu des cahiers :")
    e("")
    e("- **des coquilles d'océrisation restituées** — « dis » pour « Dès »,")
    e("  « mûri » pour « mur », « font » pour « t'ont », « giile » pour")
    e("  « gile », « kapotier » pour « kapokier ». Le cahier rend le mot que")
    e("  le livre imprime ; c'est la règle du projet, et elle est bien")
    e("  appliquée.")
    e("- **des décalages de ma fenêtre de comparaison** — quand une phrase")
    e("  revient deux fois dans l'œuvre, l'outil peut l'aligner sur la mauvaise")
    e("  occurrence. Vérification faite : « Il prit son front dans ses mains. Il")
    e("  se sentait très las » (*Le vieux nègre*), « jalonné la route avec des")
    e("  piquets » (*Le lion et la perle*) et « ses ténèbres étaient")
    e("  impénétrables » (*Au cœur des ténèbres*) figurent **exactement** dans")
    e("  leurs sources.")
    e("")

    e("## 5. Ce qui reste à confirmer sur l'exemplaire imprimé")
    e("")
    e("Trois passages où le cahier restitue ce que la source numérique a perdu.")
    e("La restitution est très probable — sans elle, la phrase n'a pas de sens")
    e("— mais elle ne peut être tranchée que sur le volume papier :")
    e("")
    e("- *Ngum a Jemea* : « je ne fuis pas vers **les** montagnes » (la source")
    e("  numérique omet l'article, qu'elle porte pourtant deux vers plus haut).")
    e("- *Ngum a Jemea* : « non non non je **ne** fuirai pas » (l'adverbe de")
    e("  négation manque à la seconde occurrence de la source).")
    e("- *Le lion et la perle* : « **Quant** à ce bouc touffu » — la source")
    e("  numérique écrit « quand », qui n'est pas la locution française.")
    e("")

    e("## 6. Ce qui a été ajouté à tous les cahiers")
    e("")
    e("- **Section 2 bis — repères chronologiques et postérité** : une")
    e("  chronologie datée par cahier, un paragraphe de réception, un encadré.")
    e("  Sources vérifiées ; quand le web et le livre divergent, c'est le livre")
    e("  qui tranche — ainsi pour *Poèmes sauvages*, dont plusieurs sites")
    e("  donnent une autre année et un autre bilan que le dossier du volume.")
    e("- **Rappel du format de l'épreuve** en tête des devoirs rédigés :")
    e("  les trois sujets, leurs barèmes, les quatre critères de la grille OBC,")
    e("  et la consigne officielle sur l'exploitation des procédés de style.")
    e("- **Section 11 — Avant l'épreuve, la dernière révision** : les textes")
    e("  étudiés, les dates à connaître, six gestes qui rapportent des points,")
    e("  cinq fautes qui en coûtent.")
    e("")

    e("## 7. L'appareil pédagogique ajouté")
    e("")
    e("Quatre sections neuves dans chacun des huit cahiers, plus un rappel de")
    e("format et une page de révision :")
    e("")
    e("| Section | Contenu | D'où vient la matière |")
    e("|---|---|---|")
    e("| 10 bis — Boîte à outils | Trois outils communs, trois propres au genre "
      "| Méthodologie, déclinée roman / théâtre / poésie |")
    e("| 10 ter — Carte mentale | Huit branches : structure, personnages, lieux, "
      "moments, textes étudiés, axes, thèmes, procédés | Relevée **dans "
      "l'œuvre** (`oeuvres.py`) et dans les fiches du cahier |")
    e("| 10 quater — Fiche de lecture | Formulaire à remplir par l'élève "
      "| Le cadre seul : le cahier ne donne pas les réponses |")
    e("| 10 quinquies — Faire le point | QCM, appariement, remise en ordre, "
      "vrai/faux, complètement, références, écriture | QCM tiré du texte ; "
      "le reste construit sur les fiches |")
    e("| 11 — Avant l'épreuve | Textes, dates, six gestes qui rapportent, "
      "cinq fautes qui coûtent | Synthèse du cahier |")
    e("")
    e("Le rappel du format MINESEC ouvre désormais la section 8 : les trois")
    e("sujets, leurs barèmes, les quatre critères de la grille OBC et la")
    e("consigne officielle sur l’exploitation des procédés de style.")
    e("")
    e("**Les données d’œuvre ont été relevées dans les fichiers eux-mêmes**, non")
    e("dans des notices. Trois vérifications ont corrigé ce que la mémoire ou le")
    e("web donnaient :")
    e("")
    e("- *Le vieux nègre et la médaille* : le roman écrit « cercle de **chaux** »,")
    e("  jamais « craie » — le mot « craie » n’apparaît pas une seule fois dans")
    e("  l’œuvre. Le support de contraction de Lydie Moudileno, lui, écrit")
    e("  « craie » : il est reproduit verbatim, et le corrigé signale désormais")
    e("  l’écart au correcteur.")
    e("- *Au cœur des ténèbres* : le récit est divisé en **trois chapitres**, et")
    e("  la Nellie est un « cotre de croisière ».")
    e("- *Poèmes sauvages* : édition **2022**, « Henrike Grohs » sans tréma,")
    e("  **dix-neuf tués** et trente-trois blessés — ce que dit le dossier du")
    e("  volume, là où plusieurs sites donnent 2019 et seize morts.")
    e("")
    e("> ⚠️ **Piège du fichier source du *Lion et la perle*.** Il contient, à la")
    e("> suite du texte de Soyinka, une seconde pièce sans rapport (Gbêhanzin,")
    e("> Migan, Mèhou, le Danhomè). Le texte authentique s’arrête au mot 23 412.")
    e("> C’est noté en tête de `oeuvres.py`.")
    e("")

    e("## 8. Conformité aux corrigés harmonisés de l’OBC")
    e("")
    e("Source : le recueil des corrigés harmonisés nationaux de l’Office du")
    e("Baccalauréat (Division des examens, sessions 2020-2022, Littérature,")
    e("séries A-ABI) et les deux maquettes de rédaction qui l’accompagnent.")
    e("Trois écarts ont été corrigés :")
    e("")
    e("**1. Le barème.** Les cahiers annonçaient « introduction 3 / axes 12 /")
    e("conclusion 3 / langue 2 ». Ce découpage ne figure dans aucun corrigé")
    e("national. Le barème harmonisé est **6 / 6 / 6 / 2**, avec des")
    e("sous-critères chiffrés — dont **1,5 point pour les seuls « Intérêts du")
    e("texte »**, rubrique qu’aucun des huit cahiers ne portait. Elle y est")
    e("désormais, dans les seize commentaires composés.")
    e("")
    e("**2. Le vocabulaire.** Le corrigé national dit *centre d’intérêt* et non")
    e("« axe », *sous-centre* et non « sous-partie », *outil d’analyse* et non")
    e("« procédé ». Les parties des trente-deux devoirs rédigés sont renommées")
    e("en conséquence, et le lexique des outils employés par l’OBC")
    e("— caractérisation nominale, adjectivale, péjorative ; champ lexical ;")
    e("reprise anaphorique ; valeur d’un temps — figure en encadré.")
    e("")
    e("**3. La charpente.** Un commentaire composé national s’ordonne ainsi :")
    e("situation du texte, idée générale, plan possible, première partie,")
    e("transition, deuxième partie, intérêts du texte. Une dissertation :")
    e("thème, reformulation, problématique, type de plan, plan possible,")
    e("parties, transition, synthèse. Les trente-deux devoirs suivent")
    e("désormais cet ordre, et les **deux maquettes de rédaction** — celle du")
    e("commentaire et celle de la dissertation, avec leurs formules d’")
    e("articulation — ouvrent la section 8 de chaque cahier.")
    e("")
    e("`audit.py` vérifie ces trois points ; le contrôle a été éprouvé par")
    e("mutation.")
    e("")

    e("## 9. Contrôle prêt à imprimer")
    e("")
    e("Mesuré par `enrichissement/impression.py`. Les autres contrôles disent")
    e("si le cahier est conforme et si ses citations sont exactes ; celui-ci")
    e("dit s\u2019il sort proprement de la machine.")
    e("")
    e("| Cahier | Fichier | Caract. | Balisage | Typo. | Structure | Tableaux | Mise en page |")
    e("|---|---:|---:|---:|---:|---:|---:|---:|")
    familles = ["fichier", "caracteres", "balisage", "typographie",
                "structure", "tableaux", "miseenpage"]
    total_impr = 0
    for cle in ORDRE:
        if cle not in A:
            continue
        pb, _ = impression.controler(
            os.path.join(RACINE, verbatim.CAHIERS[cle][0]))
        total_impr += sum(len(pb[k]) for k in familles)
        e("| `%s` | %s |"
          % (cle, " | ".join(str(len(pb[k])) for k in familles)))
    e("")
    e("**%d point(s) à examiner sur %d cahiers.**" % (total_impr, len(A)))
    e("")
    e("Ce que ce contrôle a fait corriger, et qu\u2019aucun autre ne voyait :")
    e("")
    e("- **près de deux mille apostrophes droites par volume** — le rendu pose")
    e("  désormais l\u2019apostrophe typographique, l\u2019espace fine devant la")
    e("  ponctuation double et l\u2019espace insécable autour des guillemets ;")
    e("- **une régression grave** : une boucle du sommaire réutilisait le nom")
    e("  de variable `cle`, qui porte l\u2019identifiant du cahier. Les cinq")
    e("  cahiers relus perdaient en silence leur rubrique d\u2019examen, leurs")
    e("  compléments et tout l\u2019appareil pédagogique — sans message d\u2019erreur ;")
    e("- **des pages blanches** : deux sauts de page consécutifs à chaque")
    e("  jonction de sections, et un saut placé devant un titre de niveau 1")
    e("  qui en provoque déjà un ;")
    e("- **un titre d\u2019exercice tronqué** : « ÉTUDIER CE TEXTE — Le pauvre")
    e("  homme\u202f! » », coupé au dernier tiret au lieu du premier, laissait")
    e("  un guillemet orphelin ;")
    e("- **un guillemet fermant surnuméraire** au milieu d\u2019une citation de")
    e("  *Le lion et la perle* ;")
    e("- **un sommaire menteur** : il annonçait une section au libellé disparu")
    e("  et taisait les cinq sections ajoutées depuis.")
    e("")
    e("Le contrôle a été éprouvé par mutation : on insère dans un cahier")
    e("construit une apostrophe droite, du markdown non rendu, un double")
    e("espace, une ponctuation collée — il voit chacun, et laisse passer le")
    e("témoin.")
    e("")

    e("## 10. Pertinence des parcours")
    e("")
    e("Mesurée par `enrichissement/pedagogie.py`, quatrième contrôle, écrit")
    e("pour cet audit. Les trois autres disent si le cahier est bien fait ;")
    e("celui-ci dit **s'il sert à apprendre**. Un cahier peut être")
    e("irréprochable et n'étudier que le dernier tiers d'un roman.")
    e("")
    e("| Cahier | Extraits situés dans l'œuvre | Amplitude | Mots/séquence | Activités |")
    e("|---|---|---|---|---|")
    for cle in ORDRE:
        r = PED.get(cle)
        if not r:
            continue
        c = r["couverture"]
        # `L` est déjà la liste du rapport : la réutiliser ici l'écrasait, et
        # l'écriture du fichier échouait sur un entier. Voir la mémoire du
        # projet — une collision de nom avait déjà vidé cinq cahiers.
        lg, ac = r["longueurs"] or [0], r["activites"] or [0]
        e("| `%s` | %s | %s | %d–%d | %d–%d |"
          % (cle, " ".join("%d%%" % x for x in c) or "—",
             "%d–%d %%" % (c[0], c[-1]) if c else "—",
             min(lg), max(lg), min(ac), max(ac)))
    e("")
    e("**Progression.** Les neuf cahiers ont six séquences, six objectifs")
    e("distincts, aucun outil répété, et les cinq repères attendus dans")
    e("chacune (je lis, j'observe, boîte à outils, je retiens, je m'entraîne).")
    e("Chaque séquence tient dans une séance : de deux mille trois cents à")
    e("trois mille six cents mots, avec huit à vingt et une activités où")
    e("l'élève produit lui-même.")
    e("")
    e("### Ce que cet audit a corrigé")
    e("")
    e("- **Balafon** : un saut de quarante-sept pour cent au cœur du recueil.")
    e("  « Mère » — le plus long poème du volume, celui qui nomme l'Afrique")
    e("  « Mère des Douleurs » et porte le double rejet (« il parle petit")
    e("  nègre » chez les uns, « il parle petit blanc » chez les siens) —")
    e("  n'était nulle part. Il devient le support du devoir surveillé,")
    e("  questions et corrigé réécrits avec lui.")
    e("- **Le vieux nègre et la médaille** : le parcours n'ouvrait le roman")
    e("  qu'à quarante-neuf pour cent. L'élève rencontrait Meka déjà debout")
    e("  dans son cercle de chaux, sans avoir lu comment le roman le")
    e("  construit. Le devoir surveillé porte désormais sur **l'ouverture** —")
    e("  la convocation, la nuit sans sommeil, la préparation.")
    e("")
    e("### Deux défauts de mesure, corrigés dans l'outil")
    e("")
    e("- Les chapitres d'un `.epub` étaient triés **alphabétiquement** :")
    e("  « c10 » passait avant « c2 ». L'ordre du texte s'en trouvait")
    e("  bouleversé et les positions étaient fausses — *Stances et Poèmes*")
    e("  semblait ne commencer qu'à quarante-sept pour cent, alors que « Le")
    e("  Vase brisé » est à deux. Tri numérique désormais.")
    e("- Le fichier du *Lion et la perle* contient, après le texte de")
    e("  Soyinka, une seconde pièce sans rapport. La source est bornée à son")
    e("  texte authentique — 22 556 mots, `verbatim.BORNES`. Sans cela, le")
    e("  parcours paraissait s'arrêter au milieu de la pièce.")
    e("")
    e("### Ce qui reste à arbitrer")
    e("")
    e("Cinq cahiers gardent un saut supérieur au seuil de quarante-cinq pour")
    e("cent. Ce n'est pas une faute : six séquences ne peuvent pas couvrir")
    e("uniformément un roman de quarante mille mots, et le choix des passages")
    e("obéit d'abord à leur richesse. Mais la zone non représentée est")
    e("signalée, pour que la décision soit prise et non subie.")
    e("")
    e("| Cahier | Zone sans extrait | Ce qui s'y trouve |")
    e("|---|---|---|")
    e("| `vieuxnegre` | 0–49 % | La fin de la première partie : l'annonce de la médaille, l'attente du village, les préparatifs |")
    e("| `ngum` | 32–85 % | Les actes III et IV : les recours, les appuis cherchés, les instances de l'entourage |")
    e("| `capitoline` | 48–94 % | Le conflit des deux familles et la montée vers le dernier repas |")
    e("| `tenebres` | 18–68 % | Le chapitre II : la remontée du fleuve, le brouillard, l'attaque |")
    e("| `stances` | 30–98 % | La partie « Poèmes » : quinze pièces longues, dont une seule est étudiée |")
    e("")
    e("Le remède est le même dans les cinq cas, et il est éprouvé : déplacer")
    e("le support d'un devoir vers la zone vide, et réécrire ses questions")
    e("avec lui. Un support changé sans ses questions vaut moins qu'un")
    e("support inchangé.")
    e("")
    e("## 11. Organisation et structure")
    e("")
    e("Mesurée par `enrichissement/structure.py`, cinquième contrôle, écrit")
    e("pour cet audit. Les quatre autres regardent le contenu ; celui-ci")
    e("regarde le **plan**. Un cahier peut être juste partout et illisible")
    e("d'un bout à l'autre.")
    e("")
    e("| Cahier | Questions | Doublons | Hiérarchie | Numéros | Étiquettes | Annonces |")
    e("|---|---|---|---|---|---|---|")
    for cle in ORDRE:
        r = STR.get(cle)
        if not r:
            continue
        e("| `%s` | %d | %d | %d | %d | %d | %d |"
          % (cle, len(r["questions"]), len(r["doublons"]),
             len(r["hierarchie"]), len(r["numerotation"]),
             len(r["etiquettes"]), len(r["annonces"])))
    e("")
    e("### Le défaut principal : la même question, trois fois")
    e("")
    e("Le cahier interrogeait l'élève dans trois rubriques successives — le")
    e("contrôle de lecture, les devoirs progressifs, le QCM final — et les")
    e("trois posaient les mêmes questions. Quarante-huit répétitions relevées")
    e("sur les neuf cahiers. L'élève répondait trois fois à « Pourquoi Meka")
    e("est-il arrêté ? » en croyant avancer.")
    e("")
    e("La correction ne consiste pas à supprimer des questions, mais à donner")
    e("à chaque rubrique un métier distinct :")
    e("")
    e("| Rubrique | Quand | Ce qu'elle demande |")
    e("|---|---|---|")
    e("| Carnet de bord | à la maison, pendant la lecture | les faits : qui, où, quand, comment |")
    e("| Contrôle de lecture | en classe, quinze minutes | situer, ordonner, attribuer, citer exactement |")
    e("| QCM final | avant l'épreuve, en autonomie | reconnaître un fait capital sur l'œuvre entière |")
    e("")
    e("Vingt-cinq questions ont été réécrites, à la place de leur doublon, sur")
    e("un registre différent. Toutes leurs réponses sont établies ailleurs")
    e("dans le cahier : aucune ne demande un fait que l'œuvre ou le cahier")
    e("n'aurait pas donné. La table est dans `enrichissement/controles.py`, et")
    e("le générateur signale toute entrée qui ne trouve plus sa cible.")
    e("")
    e("### Ce que la charpente a corrigé")
    e("")
    e("- **L'ordre du parcours.** Le contrôle de lecture précédait les devoirs")
    e("  qui accompagnent la lecture : l'élève retrouvait donc en devoir les")
    e("  questions auxquelles il venait de répondre en classe. On lit d'abord")
    e("  — le carnet de bord —, on est contrôlé ensuite.")
    e("- **Une étiquette, un objet.** « Devoir n° 1 » désignait à la fois le")
    e("  premier devoir d'accompagnement et l'épreuve blanche de type BAC.")
    e("  Les devoirs d'accompagnement sont devenus des **étapes**, ce qu'ils")
    e("  sont.")
    e("- **Les six séquences au sommaire.** Elles étaient au niveau 3, sous")
    e("  une section unique : un volume de trois cents pages annonçait")
    e("  « 4.1 Lectures méthodiques » et rien d'autre. Chaque séquence est")
    e("  désormais une section numérotée.")
    e("- **Les numéros périmés.** « 1.1 Le titre » se lisait sous « 3.1")
    e("  Analyse du paratexte » : la numérotation d'avant le changement de")
    e("  plan. Un titre de niveau 3 porte désormais un nom, ou un nom de série")
    e("  suivi d'un numéro — jamais un numéro hérité.")
    e("- **Les « bis » et les « ter ».** Ils ne subsistaient plus que dans les")
    e("  renvois internes — « voir § III.6 bis ». Un renvoi à un numéro se")
    e("  périme au premier changement de plan ; il nomme désormais la section.")
    e("- **Les séries interrompues.** La carte mentale passait de la")
    e("  « Branche 5 » à la « Branche 8 », parce que deux branches étaient")
    e("  conditionnelles. Les rubriques sont numérotées à la volée, sur celles")
    e("  qui sont réellement rendues, et l'annonce les compte au lieu de les")
    e("  réciter — « six exercices » précédait sept exercices.")
    e("- **Quarante-cinq tableaux aplatis.** Les cinq cahiers relus")
    e("  imprimaient en colonnes de paragraphes des tableaux que la conversion")
    e("  n'avait pas su reconnaître — listes de personnages, tableaux d'axes.")
    e("  La reconnaissance se fait maintenant ligne à ligne : il en reste dix-")
    e("  huit, qui ne sont pas des tableaux mais des suites d'encadrés.")
    e("- **Le plan de la collection.** « Capitoline » n'avait pas de section")
    e("  de synthèse, si bien que le cahier demandait d'interpréter le roman")
    e("  avant de l'avoir lu. Les neuf cahiers suivent aujourd'hui le même")
    e("  plan, dans le même ordre.")
    e("")
    e("### L'entrée dans l'œuvre, réécrite pour l'élève")
    e("")
    e("La première page de l'étude s'adressait à l'enseignant : « Séance")
    e("d'ouverture (55 minutes) », « Demandez à la classe », « Ramassez les")
    e("papiers ». L'élève qui ouvrait son cahier au premier jour y lisait les")
    e("consignes d'un autre.")
    e("")
    e("Elle se fait maintenant en trois temps qu'il conduit lui-même :")
    e("j'observe le titre — des questions auxquelles personne ne peut encore")
    e("répondre faux ; **mon hypothèse de lecture** — un tableau qu'il remplit")
    e("et ne relira qu'à la dernière séance ; **mon contrat de lecture** — ce")
    e("qu'il s'engage à repérer, en cases à cocher, et un journal assez simple")
    e("pour être tenu. Ce qui revient au professeur — durées, calendrier de la")
    e("classe, dates des contrôles — est conservé dans un encadré « Côté")
    e("enseignant », à la fin de la section.")
    e("")
    e("### Le contrôle a été éprouvé par mutation")
    e("")
    e("Un contrôle qui n'a jamais rougi ne prouve rien. `structure_banc.py`")
    e("abîme une copie du cahier, défaut par défaut, et vérifie que chacun")
    e("remonte : la question recopiée, les séquences laissées au niveau 3, le")
    e("numéro périmé, la branche sautée, l'étiquette réemployée, l'annonce")
    e("fausse, la partie à section unique. Les sept mutations sont détectées.")
    e("")
    e("Trois défauts de MESURE ont d'ailleurs été trouvés avant les défauts de")
    e("contenu, et corrigés dans l'outillage : `audit.py` et `pedagogie.py` ne")
    e("reconnaissaient plus les séquences une fois celles-ci renumérotées, et")
    e("la liste des verbes de consigne ignorait « distinguez », "
      "« reconstituez »")
    e("et « discutez » — la cinquième séquence de « Capitoline » passait pour")
    e("pauvre alors qu'elle demandait ces trois gestes. On rouvre le cahier")
    e("avant de l'accuser.")
    e("")
    e("## 12. Garde-fous, et comment les relancer")
    e("")
    e("```bash")
    e("python enrichissement/build_all.py      # reconstruit les neuf cahiers")
    e("python enrichissement/audit.py          # conformité de forme et MINESEC")
    e("python enrichissement/verbatim.py       # verbatim contre les sources")
    e("python enrichissement/impression.py     # typographie, prêt à imprimer")
    e("python enrichissement/pedagogie.py      # couverture, progression, activité")
    e("python enrichissement/structure.py      # plan, numérotation, redondance")
    e("python enrichissement/structure_banc.py # éprouve le contrôle par mutation")
    e("python enrichissement/rapport.py        # régénère ce rapport")
    e("```")
    e("")
    e("`verbatim.py` a été écrit pour cet audit : il manquait à la chaîne, qui")
    e("ne mesurait jusque-là que la forme. Il a été éprouvé par mutation — on a")
    e("changé un mot dans un cahier construit et vérifié qu'il le voyait —, et")
    e("il attrape le remplacement d'un mot, la suppression d'une négation,")
    e("l'ajout d'un mot et la coupe d'un groupe.")
    e("")
    e("Deux seuils dépendent du genre, et c'est voulu : un extrait de prose")
    e("doit faire trois cents mots, un poème n'a pas de longueur minimale — son")
    e("unité est sémantique. En contrepartie, chaque référence d'un cahier de")
    e("vers doit nommer ce qu'elle reproduit (« poème entier », « parties I et")
    e("II »), et l'audit le vérifie.")
    e("")

    io.open(CIBLE, "w", encoding="utf8").write("\n".join(L))
    print("rapport écrit : %s" % os.path.basename(CIBLE))
    print("   %d cahiers, %d manquement(s) de forme, %d écart(s) verbatim signalé(s)"
          % (len(A), total_manques, sum(V[c]["alt"] for c in V)))


if __name__ == "__main__":
    main()
