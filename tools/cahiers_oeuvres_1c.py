#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/cahiers_oeuvres_1c.py — LES QUATRE CAHIERS D'ŒUVRES DU 1er CYCLE EN VENTE

    python tools/cahiers_oeuvres_1c.py --charge ~/veritas-ftp
    python tools/cahiers_oeuvres_1c.py --controle      # ne produit rien, mesure
    python tools/cahiers_oeuvres_1c.py --seulement 6e

CE QUE C'EST
  Quatre cahiers d'étude des œuvres intégrales, un par niveau du collège
  (6ᵉ, 5ᵉ, 4ᵉ, 3ᵉ), trois œuvres chacun, 1 000 FCFA le niveau. Ils arrivent
  sous une forme que le dépôt ne connaissait pas : une page autonome
  `Veritas <n>.dc.html` + son moteur `support.js` + un contenu chiffré
  `content/<n>.enc` téléchargé en clair par la page.

  Ce script les fait entrer dans le circuit de vente qui existe déjà — celui
  des vingt-quatre autres ouvrages : paiement CamerPay, code émis à la
  confirmation, envoi par SMS / WhatsApp / courriel, jeton lié au poste, quota
  d'appareils, filigrane traçable, révocation. Rien de tout cela n'est
  reconstruit ici.

POURQUOI ON NE GARDE PAS LEUR VERROU
  Le brief demandait de reprendre côté serveur l'algorithme de codes des
  cahiers (`mint`, `readCode`, somme de contrôle FNV-1a + PEPPER). On ne le
  fait pas, et la raison tient en trois lignes :

    · ce verrou-là n'en est pas un — `mint()` est DANS la page, et deux
      boutons « Code élève démo » / « Code enseignant » fabriquaient un code
      valide en un clic. Personne n'avait à payer ;
    · aucun code de ce format n'a jamais été vendu (les cahiers ne sont pas
      encore en ligne) : la contrainte « ne pas casser les codes déjà émis »
      tombe d'elle-même ;
    · un second format de codes voudrait dire un second registre, une seconde
      révocation, un second quota d'appareils, un second espace
      d'administration. C'est la décision déjà prise le 17/08/2026 pour les
      livrets, et pour le même motif.

  Le contenu ne se télécharge donc plus en statique : il sort de
  `api/livret.php?action=content`, sous jeton, après code valide — ce que le
  brief appelle lui-même « le point clé du durcissement ».

CE QUI NE PART PAS CHEZ L'ÉLÈVE
  Chaque cahier porte une partie `corriges` — les corrigés rédigés des
  questions ouvertes — et une partie `notes` (note aux enseignants). Dans la
  page d'origine, elles étaient DANS le fichier que le navigateur télécharge :
  le sommaire affichait un cadenas, et c'était tout. L'élève payait 1 000 F un
  cahier dont les réponses voyageaient avec.

  Deux charges distinctes, donc, tirées du même bois :
    booklet-oeuvres-<n>.js   ÉLÈVE      — `corriges` et `notes` retirées
    guide-oeuvres-<n>.js     ENSEIGNANT — le document entier
  Les deux posent la MÊME globale (`window.OI_DOC`), comme l'exige
  api/livret.php : il n'en envoie qu'une, celle qu'on est venu chercher.

  Les réponses des exercices AUTO-CORRIGÉS (`sol`, `sols`, `ans`, `after`)
  restent dans la charge élève : c'est ce qui permet au cahier de dire « juste »
  ou « essaie encore » sans réseau. Un mot croisé qui ne connaît pas sa grille
  ne se corrige pas. Ce n'est pas la même chose qu'un corrigé rédigé.

OÙ VA QUOI
  --charge <dossier>  →  <dossier>/uploads/protected/livrets/*.js   (dépôt FTP)
                         <dossier>/uploads/oeuvres/1c/*.webp        (dépôt FTP)
  dépôt git           →  livrets/cahier-oeuvres-<n>.html   la porte
                         livrets/extrait-oeuvres-<n>.js     l'aperçu gratuit
                         livrets/support-oi.js              le moteur de rendu
                         api/data/livrets_catalogue.json    les quatre fiches

  Les charges vendues n'entrent JAMAIS dans le dépôt : il est public.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from pathlib import Path

from PIL import Image

for _f in (sys.stdout, sys.stderr):          # la console Windows est en cp1252
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

RACINE = Path(__file__).resolve().parent.parent
SOURCE = Path.home() / "Downloads" / "Ouvrages interactifs collaboratifs"
CATALOGUE = RACINE / "api" / "data" / "livrets_catalogue.json"
PUBLIC = RACINE / "livrets"

# « 1 000 FCFA le niveau » — brief du 08/09/2026.
PRIX = 1000

# La globale que posent les deux charges. Le nom compte : `api/livret.php` le
# relit dans le fichier (`vrt_livret_donnees_identifiant`) et le renvoie au
# client, qui vérifie qu'elle est bien apparue. Il ne doit ressembler ni à
# BOOKLET* ni à GUIDE* — la CI refuse ces deux-là dans une coquille publique,
# et c'est exactement ce qu'on veut : que la garde reste vraie.
GLOBALE = "OI_DOC"

# Le préfixe public des illustrations. Elles partent par FTP, hors dépôt : ce
# sont ~10 Mo qui font partie du produit vendu, et le dépôt est public.
IMG_URL = "/uploads/oeuvres/1c/"

# Le dossier des originaux, fourni le 08/09/2026. On y puise les illustrations
# que la maquette n'avait pas retenues — et on y vérifie qu'aucune de celles
# qu'elle sert n'est plus lourde qu'il ne faut.
ORIGINAUX = Path.home() / "Downloads" / "Oeuvres de la 6e en 4e"

# Le cadre d'affichage du cahier : `aspect-ratio: 3/2`, `object-fit: contain`.
# Rien n'est donc jamais rogné — mais une image de rapport différent s'affiche
# entre deux bandes grises. Neuf des soixante-huit sont en 16:9 (les cartes
# mentales et les frises) : elles perdaient 11 % de leur hauteur en vide.
# On les ramène au 3:2 en AJOUTANT de la marge, jamais en coupant : sur une
# carte mentale, ce qu'on couperait est précisément ce qu'on vient y lire.
CADRE = 3 / 2
LARGEUR_MAX = 1200
QUALITE = 78

# ── LES IMAGES QUE LA MAQUETTE N'AVAIT PAS PRISES ───────────────────────────
# Le dossier des originaux en contient dix-sept que le cahier n'utilise pas.
# Trois seulement méritent d'entrer, et pour une raison chacune ; les autres
# sont des variantes de ce qui est déjà là, ou hors sujet — la frise
# « Father Kwame Mensah » est en anglais et raconte la vie d'un auteur
# ghanéen qui ne figure dans aucun des quatre cahiers.
#
# ⚠️ CHAQUE ENTRÉE REMPLACE UNE RÉPÉTITION. La 6ᵉ servait deux fois la même
# image : la carte mentale des Chants en tête du chapitre « Qui est qui » ET
# des corrigés, la photo de classe en tête de « Qui est qui » ET de la note aux
# enseignants. Une image revue trois pages plus loin donne l'impression que le
# cahier n'avance pas.
INEDITES = {
    # nom dans le cahier          fichier d'origine                      ce qu'elle montre
    "w1-qui-est-qui": ("chien_chimpanze_scene.webp",
                       "Chien, Kulu, le Chimpanzé, la jeune fille et Zee le juge"),
    "w1-mindmap-foret": ("qui_chante_foret_mindmap_1.webp",
                         "Qui chante dans la forêt : les voix des dix-huit contes"),
    "w2-themes-bimanes": ("les_bimanes_themes_vrais.webp",
                          "Les Bimanes : les thèmes des sept nouvelles"),
}

NIVEAUX = {
    "6e": {"slug": "oeuvres-6e", "src": "Veritas 6e.dc.html", "json": "content/6e.json",
           "titre": "Étude des œuvres intégrales — 6ᵉ", "ls": "oi6."},
    "5e": {"slug": "oeuvres-5e", "src": "Veritas 5e.dc.html", "json": "content/5e.json",
           "titre": "Étude des œuvres intégrales — 5ᵉ", "ls": "oi5."},
    "4e": {"slug": "oeuvres-4e", "src": "Veritas 4e.dc.html", "json": "content/4e.json",
           "titre": "Étude des œuvres intégrales — 4ᵉ", "ls": "oi4."},
    "3e": {"slug": "oeuvres-3e", "src": "Veritas 3e.dc.html", "json": "content/3e.json",
           "titre": "Étude des œuvres intégrales — 3ᵉ", "ls": "oi3."},
}

# Les parties réservées à l'enseignant. `corriges` porte les corrigés rédigés ;
# `notes` est la note pédagogique qui dit comment mener la séquence — elle
# donne aussi les attendus, et n'a rien à faire dans la charge de l'élève.
PARTIES_ENSEIGNANT = {"corriges", "notes"}

# ⚠️ ET LA NOTE À L'ENSEIGNANT NE TIENT PAS TOUJOURS DANS SA PARTIE.
# Huit panneaux « Côté enseignant — conduite de la séquence » sont posés au
# milieu des chapitres, dans le fil que l'élève lit : trois en 6ᵉ, deux en 5ᵉ,
# deux en 4ᵉ, un en 3ᵉ. Ils disent comment mener la séance — et, dans le cahier
# de 5ᵉ, sur quel chapitre portera l'épreuve d'étude de texte. Retirer la
# partie « notes » et laisser ceux-là, c'était fermer la porte en laissant la
# fenêtre ouverte. Trouvé par le contrôle final, pas par la lecture.
PANNEAU_ENSEIGNANT = re.compile(r"^\s*côté\s+enseignant\b", re.I)


class Ancre(Exception):
    """Un repère du fichier source a bougé.

    On ÉCHOUE plutôt que de produire. Une coquille dont le verrou n'a pas été
    posé s'ouvre toute seule : elle irait en ligne sans que rien ne le dise, et
    le cahier serait gratuit pour qui connaît l'URL. Même règle que
    tools/prepare_livrets.py, et pour la même raison.
    """


# ── Découpe du document ──────────────────────────────────────────────────────
def _sans_panneaux(blocs: list) -> list:
    """Les blocs, moins ceux qui s'adressent au professeur."""
    return [b for b in blocs
            if not (str(b.get("k") or "") == "panel"
                    and PANNEAU_ENSEIGNANT.match(str(b.get("title") or "")))]


def separer(doc: dict) -> tuple[dict, dict]:
    """Le document de l'élève, et celui de l'enseignant.

    L'enseignant reçoit tout. L'élève reçoit tout SAUF ce qui lui est réservé —
    on le retire, on ne le cache pas : ce qui est caché côté client se lit dans
    l'inspecteur en trois clics. C'est très exactement ce que faisait la page
    d'origine, qui affichait un cadenas sur le sommaire des corrigés tout en
    les téléchargeant avec le reste.

    On recopie en profondeur ce qu'on modifie, et rien de plus : le document de
    l'enseignant est le document d'origine, et il ne doit pas se retrouver
    amputé parce qu'on a filtré une liste qu'il partageait.
    """
    parts = []
    for p in doc.get("parts", []):
        if str(p.get("kind") or "") in PARTIES_ENSEIGNANT:
            continue
        q = dict(p)
        if q.get("blocks"):
            q["blocks"] = _sans_panneaux(list(q["blocks"]))
        if q.get("chapters"):
            q["chapters"] = [dict(c, blocks=_sans_panneaux(list(c.get("blocks") or [])))
                             for c in q["chapters"]]
        parts.append(q)
    eleve = dict(doc)
    eleve["parts"] = parts
    return eleve, doc


def reserves(doc: dict):
    """Tout ce qui ne doit PAS se retrouver chez l'élève, en texte.

    Deux gisements, et le second a failli être oublié : les parties réservées,
    et les panneaux « Côté enseignant » posés au milieu des chapitres.

    Deux précautions, apprises l'une après l'autre en faisant crier ce contrôle
    sur des blocs parfaitement en règle :

    ⚠️ ON NE COMPARE PAS LES TITRES. La partie « corrigés » reprend, mot pour
    mot, les intertitres du cahier (« Mots croisés — Le vocabulaire du conte ») :
    c'est ainsi qu'on s'y retrouve. Les chercher dans la charge élève les
    trouve forcément — douze titres légitimes dénoncés d'un coup.

    ⚠️ ET ON COMPARE LE BLOC ENTIER, pas son début. Un corrigé s'ouvre souvent
    sur la citation qu'il commente — « Les jours de fête sont jours de salut
    pour les orphelins », en 5ᵉ — et cette citation est dans le texte d'auteur,
    donc dans le cahier de l'élève. Les soixante premiers caractères d'un
    corrigé ne prouvent rien ; le corrigé complet, lui, ne peut se retrouver
    dans la charge élève que si le filtre a laissé passer le bloc.
    """
    for p in doc.get("parts", []):
        reserve = str(p.get("kind") or "") in PARTIES_ENSEIGNANT
        groupes = [(None, list(p.get("blocks") or []))]
        for ch in p.get("chapters") or []:
            groupes.append((ch.get("id"), list(ch.get("blocks") or [])))
        for _, blocs in groupes:
            for b in blocs:
                k = str(b.get("k") or "")
                panneau = (k == "panel"
                           and PANNEAU_ENSEIGNANT.match(str(b.get("title") or "")))
                if not reserve and not panneau:
                    continue
                if k in ("h1", "h2", "h3"):
                    continue
                corps = b.get("x") if b.get("x") else " ".join(
                    str(x) for x in (b.get("body") or []) if isinstance(x, str))
                t = str(corps or "")
                if len(t) > 40:
                    quoi = ("le panneau « " + str(b.get("title"))[:40] + " »") if panneau \
                        else ("un bloc de « " + str(p.get("kind")) + " »")
                    yield quoi, t


def compter(doc: dict) -> dict:
    """De quoi le contrôle final parle : parties, chapitres, blocs, exercices."""
    n_ch = n_bl = n_ex = 0
    for p in doc.get("parts", []):
        blocs = list(p.get("blocks") or [])
        for ch in p.get("chapters") or []:
            n_ch += 1
            blocs += list(ch.get("blocks") or [])
        for b in blocs:
            n_bl += 1
            if b.get("k") in ("q", "gridfill", "qcm", "vf", "match", "order",
                              "riddle", "wordsearch", "crossword", "lines"):
                n_ex += 1
    return {"parts": len(doc.get("parts", [])), "chapitres": n_ch,
            "blocs": n_bl, "exercices": n_ex}


def extrait(doc: dict) -> dict:
    """DEUX chapitres, pris loin l'un de l'autre — un sondage, pas un morceau.

    Deux chapitres qui se suivent forment un début qu'on finit ; deux chapitres
    éloignés montrent surtout ce qui manque entre eux. C'est la leçon de
    « Demo 6e », qui chargeait le cahier entier et offrait donc la 6ᵉ.

    L'ouverture (`front`) part avec : elle situe l'ouvrage et ne contient aucun
    exercice — c'est la page qu'un visiteur doit voir en premier.
    """
    oeuvres = [p for p in doc.get("parts", []) if p.get("chapters")]
    if len(oeuvres) < 2:
        raise Ancre("moins de deux œuvres dans ce cahier : l'extrait n'a pas de sens")

    def taille(ch: dict) -> tuple:
        return (ch.get("id"), len(json.dumps(ch, ensure_ascii=False)))

    # Le premier chapitre de la PREMIÈRE œuvre, et le premier de la DERNIÈRE :
    # aussi loin que le cahier le permet, et tous deux des chapitres d'entrée,
    # donc lisibles sans ce qui précède.
    pris = []
    for p in (oeuvres[0], oeuvres[-1]):
        ch = list(p.get("chapters") or [])
        if not ch:
            raise Ancre(f"l'œuvre « {p.get('title')} » n'a aucun chapitre")
        pris.append((p, ch[0]))

    parts = []
    for p in doc.get("parts", []):
        if str(p.get("kind") or "") == "front":
            parts.append(p)
    for p, ch in pris:
        q = {k: v for k, v in p.items() if k != "chapters"}
        q["chapters"] = [ch]
        parts.append(q)

    out = dict(doc)
    out["parts"] = parts
    out["_extrait"] = True
    return out


# ── Fabrication de la coquille ───────────────────────────────────────────────
def patcher(html: str, niveau: str, cfg: dict) -> str:
    """La page d'origine, dont on remplace la porte et le chargement.

    On ne touche NI à la mise en page, NI au rendu des blocs, NI aux exercices :
    le brief est explicite là-dessus, et c'est aussi ce qui fait la valeur du
    produit — les mots croisés, les grilles de mots mêlés, les cartes mentales
    et les appariements n'existent dans aucun autre moteur du site.

    Quatre remplacements, tous ancrés sur un texte exact. Une ancre absente
    lève `Ancre` et rien n'est écrit.
    """
    slug = cfg["slug"]
    n = 0

    # ① Le bloc de cryptographie maison. Il ne verrouillait rien — `mint()` est
    #    dans la page — mais il décide encore de ce qu'est un « code valide »,
    #    et il refuserait les codes VÉRITAS (format `VRT-<CLASSE>-XXXX-XXXX`).
    #    On garde `norm()`, `expLabel()` et les constantes de dessin qui
    #    suivent : elles servent au rendu, pas à la porte.
    debut = "const ALPH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';"
    fin = "function expLabel(m)"
    i, j = html.find(debut), html.find(fin)
    if i < 0 or j < 0 or j < i:
        raise Ancre("le bloc des codes maison est introuvable")
    html = html[:i] + PORTE_JS.replace("@LS@", cfg["ls"]).replace("@SLUG@", slug) + html[j:]
    n += 1

    # ② `load()` — le contenu ne se télécharge plus en clair.
    i = html.find("  async load() {")
    if i < 0:
        raise Ancre("load() est introuvable")
    j = html.find("\n  }\n", i)
    if j < 0:
        raise Ancre("la fin de load() est introuvable")
    html = html[:i] + LOAD_JS + html[j + 4:]
    n += 1

    # ③ `unlock()` — la vérification passe au serveur.
    i = html.find("  unlock(rawCode) {")
    if i < 0:
        raise Ancre("unlock() est introuvable")
    j = html.find("\n  }\n", i)
    if j < 0:
        raise Ancre("la fin de unlock() est introuvable")
    html = html[:i] + UNLOCK_JS + html[j + 4:]
    n += 1

    # ④ `componentDidMount()` — la reprise de session passe par le jeton.
    i = html.find("  componentDidMount() {")
    if i < 0:
        raise Ancre("componentDidMount() est introuvable")
    j = html.find("\n  }\n", i)
    if j < 0:
        raise Ancre("la fin de componentDidMount() est introuvable")
    html = html[:i] + MOUNT_JS + html[j + 4:]
    n += 1

    # ⑤ Les deux boutons de démonstration. `onDemo` fabriquait un code élève
    #    valide, `onDemoT` un code enseignant : la caisse était ouverte, et le
    #    bouton était sur la porte. Ils deviennent « lire un extrait » et
    #    « obtenir mon code ».
    for cle, remplacement in (("onDemo:", DEMO_JS), ("onDemoT:", DEMOT_JS)):
        i = html.find("      " + cle)
        if i < 0:
            raise Ancre(f"{cle} est introuvable")
        j = html.find("\n", i)
        html = html[:i] + remplacement + html[j:]
        n += 1
    for avant, apres in (("<span>Code élève démo</span>", "<span>Lire un extrait gratuit</span>"),
                         ("<span>Code enseignant</span>", "<span>Obtenir mon code — 1 000 F</span>")):
        if avant not in html:
            raise Ancre(f"le libellé « {avant} » est introuvable")
        html = html.replace(avant, apres)
        n += 1

    # ⑥ Les illustrations ne sont plus à côté de la page.
    if "'img/'" not in html:
        raise Ancre("le préfixe des images est introuvable")
    html = html.replace("'img/'", f"'{IMG_URL}'")
    n += 1

    # ⑦ Le moteur de rendu, et la porte du site.
    if '<script src="./support.js"></script>' not in html:
        raise Ancre("l'appel à support.js est introuvable")
    html = html.replace(
        '<script src="./support.js"></script>',
        '<script src="/livrets/gate.js?v=1.20.21"></script>\n'
        '<script src="/livrets/support-oi.js?v=1.20.21"></script>')
    n += 1

    # ⑧ CE QUE LA PAGE PROMETTAIT ET QUE PERSONNE NE TENAIT.
    #    « Envoyé au salon C6-A3K7. Votre enseignant verra vos réponses et
    #    pourra les commenter. » Ce message s'affichait au clic, et c'était
    #    tout : aucun envoi, aucun salon, aucun serveur. Le panneau de
    #    l'enseignant disait de même que les copies « remontent ici ».
    #    L'élève croyait avoir rendu son travail.
    #
    #    Le salon de classe existe côté VÉRITAS (`api/cahier.php`,
    #    `api/collab.php`) mais il range les réponses sous une clé dérivée de
    #    la CONSIGNE, pour qu'un cahier corrigé entre deux rentrées ne décale
    #    pas les copies. Ce cahier-ci numérote ses champs dans l'ordre où il
    #    les dessine (« n0, n1, n2… ») : les brancher tels quels importerait
    #    le défaut dans la base. C'est un chantier, pas une ligne — et en
    #    attendant, ce qui marche vraiment, c'est l'export, qui part par
    #    WhatsApp. On le dit, et on ne promet rien d'autre.
    #    Le bouton part, et sa fonction avec : un bouton grisé ou muet pose la
    #    même question à chaque page (« pourquoi ça ne marche pas ? »). Reste
    #    « Exporter mes réponses », qui, lui, produit vraiment un fichier.
    i = html.find('<button onClick="{{ onShare }}"')
    if i < 0:
        raise Ancre("le bouton du salon est introuvable")
    j = html.find("</button>", i)
    if j < 0:
        raise Ancre("la fin du bouton du salon est introuvable")
    html = html[:i] + html[j + len("</button>\n          "):]
    n += 1

    i = html.find("      onShare: () =>")
    if i < 0:
        raise Ancre("onShare est introuvable")
    j = html.find("\n", i)
    html = html[:i] + html[j + 1:]
    n += 1

    remplacements_texte = [
        ("shareMsg: 'Ton cahier est enregistré sur cet appareil. Envoie-le au salon "
         "pour que ton enseignant le voie.'",
         "shareMsg: 'Ton cahier est enregistré sur cet appareil. Récupère tes réponses "
         "en un fichier, puis envoie-le à ton enseignant par WhatsApp.'"),
        (">Exporter mes réponses<", ">Récupérer mes réponses<"),
        # ── ET LA PORTE DISAIT DEUX CHOSES INEXACTES ─────────────────────────
        # « Le cahier est chiffré » : il l'était — d'un chiffrement dont la clé
        # était trois lignes plus haut dans la même page. Ce qui protège
        # vraiment est plus simple à dire : le contenu n'est pas dans la page,
        # il vient du serveur après vérification. « 2 appareils » était le
        # quota de l'ancien verrou ; celui du site en donne 3 à l'élève et 2 à
        # l'enseignant (LIVRET_MAX_APPAREILS). Une promesse fausse en moins
        # sur l'écran où l'on demande 1 000 F.
        ("Le cahier est chiffré : sans code valide, aucun texte n'est lisible. "
         "Un code fonctionne sur <b>2 appareils</b> et reste valable jusqu'à la fin "
         "de l'année scolaire.",
         "Le contenu de ce cahier n'est pas dans cette page : il est envoyé par le "
         "serveur, une fois le code vérifié. Un code fonctionne sur "
         "<b>3 appareils</b> et reste valable jusqu'à la fin de l'année scolaire."),
        ("Les réponses de vos élèves remontent ici dès qu'ils rejoignent le salon avec "
         "le code de classe <b>{{ classCode }}</b>.",
         "Vos élèves vous envoient le fichier de leurs réponses depuis le bouton "
         "« Récupérer mes réponses », en bas de leur cahier."),
    ]
    for avant, apres in remplacements_texte:
        if avant not in html:
            raise Ancre(f"le texte du salon est introuvable : {avant[:60]}…")
        html = html.replace(avant, apres)
        n += 1

    # ⑨ L'ÉCHÉANCE VENAIT DU CODE, QUI NE LA PORTE PLUS.
    #    `expLabel(sess.exp)` lisait les deux caractères d'échéance encodés
    #    dans le code maison. Sans eux, `Math.floor(undefined / 12)` donne NaN,
    #    et le pied de page annonçait « valable jusqu'au undefined NaN » sur
    #    chaque écran d'un cahier payé. C'est le serveur qui tient l'échéance
    #    maintenant, et `gate.js` la connaît : on la lui demande.
    ancien_exp = ("      codeShort: sess ? sess.code : '', "
                  "expLabel: sess ? expLabel(sess.exp) : ''")
    if ancien_exp not in html:
        raise Ancre("la mention d'échéance du pied de page est introuvable")
    html = html.replace(ancien_exp, EXP_JS)
    n += 1
    ancienne_fn = html.find("function expLabel(m)")
    if ancienne_fn < 0:
        raise Ancre("expLabel() est introuvable")
    fin_fn = html.find("\n", ancienne_fn)
    html = html[:ancienne_fn] + EXP_FN + html[fin_fn:]
    n += 1

    # ⑫ TROIS IMAGES QUI REVENAIENT, ET UNE QUI MANQUAIT.
    #    Le cahier de 6ᵉ servait la carte mentale des Chants EN TÊTE du
    #    chapitre « Qui est qui dans la forêt » et, cent pages plus loin, en
    #    tête des corrigés ; la photo de classe ouvrait « Qui est qui dans les
    #    sept nouvelles » et la note aux enseignants. Une image qu'on revoit
    #    donne l'impression de tourner en rond — et, sur « Qui est qui », une
    #    carte mentale ne montre justement pas qui est qui.
    #    Les trois remplaçantes viennent du dossier des originaux et sont
    #    conformes à ce qu'elles annoncent : les personnages nommés, la carte
    #    des voix de la forêt, la carte des thèmes des Bimanes.
    if niveau == "6e":
        for avant, apres in (
            ("'w1c3': ['w1-carte-mentale', 'Les dix-huit contes beti et leurs personnages']",
             "'w1c3': ['w1-qui-est-qui', 'Chien, Kulu, le Chimpanzé, la jeune fille et Zee le juge']"),
            ("'notes': ['w2-classe-lecon', 'Le cahier en classe']",
             "'notes': ['w2-themes-bimanes', 'Les thèmes des sept nouvelles']"),
            ("'corriges': ['w1-carte-mentale', 'Les corrigés des trois œuvres']",
             "'corriges': ['w1-mindmap-foret', 'Qui chante dans la forêt : les voix des contes']"),
        ):
            if avant not in html:
                raise Ancre(f"l'entrée d'image « {avant[:26]}… » est introuvable")
            html = html.replace(avant, apres)
            n += 1

    # ⑩ LE CONFORT DE LECTURE — MESURÉ, PAS DEVINÉ.
    #    La colonne de texte faisait 1 180 px. Sur l'écran d'un ordinateur, une
    #    ligne portait donc jusqu'à 140 signes ; mesuré à 900 px de large, elle
    #    en portait encore 106. La typographie donne 45 à 75 signes pour lire
    #    sans effort, 80 comme limite haute : au-delà, l'œil revenant à gauche
    #    ne retrouve plus sa ligne, et il faut relire. C'est le défaut de
    #    confort le plus coûteux de la page, et le moins visible : rien n'a
    #    l'air cassé.
    #
    #    680 px de colonne donnent 78 signes à 18 px. Tout le contenu de ce
    #    cahier est composé pour un téléphone (la maquette d'origine est en
    #    420 px de large) : les grilles, les tableaux et les cartes y tiennent
    #    sans défilement. On ne perd donc rien à rétrécir, et on gagne la ligne.
    for avant, apres, combien in (
        ("max-width: 1180px", "max-width: 680px", 3),
        # Le corps passe de 17,5 à 18 px : ces cahiers s'adressent à des élèves
        # de sixième, souvent sur un écran de 5 pouces tenu à bout de bras.
        ("font-size: 17.5px; line-height: 1.72;", "font-size: 18px; line-height: 1.72;", 1),
        # La consigne d'un exercice se lit deux fois : une fois pour comprendre,
        # une fois en écrivant. Elle était plus serrée que le texte courant.
        ("font-size: 16.5px; font-weight: 600; line-height: 1.45;",
         "font-size: 17px; font-weight: 600; line-height: 1.56;", 1),
        # Une image qui n'est pas encore arrivée ne doit pas retenir le texte.
        ('<img src="{{ b.imgSrc }}"', '<img src="{{ b.imgSrc }}" loading="lazy" decoding="async"', 1),
        ('<img src="{{ b.mapSrc }}"', '<img src="{{ b.mapSrc }}" loading="lazy" decoding="async"', 1),
    ):
        vus = html.count(avant)
        if vus != combien:
            raise Ancre(f"« {avant[:40]}… » apparaît {vus} fois, {combien} attendues")
        html = html.replace(avant, apres)
        n += 1

    # ⑪ LES DEUX ICÔNES DE LA PORTE NE DISENT PLUS CE QUE FONT LEURS BOUTONS.
    #    Elles ont été dessinées pour « Code élève démo » (une silhouette) et
    #    « Code enseignant » (un chapeau de diplômé). Les boutons sont devenus
    #    « Lire un extrait gratuit » et « Obtenir mon code » : un œil, et une
    #    carte de paiement. Une icône qui contredit son libellé fait hésiter
    #    juste avant le clic qui compte.
    for avant, apres in (
        ('<path d="M18 21a8 8 0 0 0-12 0"></path><path d="M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z">'
         '</path><path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z"></path>',
         '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"></path>'
         '<path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>'),
        ('<path d="M22 10 12 5 2 10l10 5 10-5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>',
         '<path d="M2 7h20v12H2z"></path><path d="M2 11h20"></path><path d="M6 15h4"></path>'),
    ):
        if avant not in html:
            raise Ancre("l'icône d'un bouton de la porte est introuvable")
        html = html.replace(avant, apres)
        n += 1

    # ⑩ Un titre, et l'interdiction d'indexer LA PORTE (pas la page de vente,
    #    qui, elle, doit être trouvée). Une porte indexée n'apporte que des
    #    visiteurs à qui l'on demande un code.
    if "<head>" not in html:
        raise Ancre("<head> est introuvable")
    tete = (f'<head>\n<title>{cfg["titre"]} — Centre VÉRITAS</title>\n'
            f'<meta name="robots" content="noindex, nofollow">\n'
            f'<link rel="canonical" href="https://veritas-school.com/livrets/{slug}.html">')
    html = html.replace("<head>", tete, 1)
    n += 1

    # Trois remplacements de plus pour la 6ᵉ, qui est le seul des quatre
    # cahiers à servir deux fois la même illustration.
    attendus = 29 if niveau == "6e" else 26
    if n != attendus:
        raise Ancre(f"{n} remplacements au lieu de {attendus}")
    # Une dernière vérification, sur le produit fini : aucune trace du verrou
    # d'origine ne doit subsister. C'est ce qui distingue « j'ai remplacé le
    # texte » de « la page ne contient plus de porte dérobée ».
    for interdit in ("VRTS-", "PEPPER", "function mint(", "content/" + niveau + ".enc"):
        if interdit in html:
            raise Ancre(f"« {interdit} » subsiste dans la coquille")
    return html


# ── Les morceaux de JavaScript posés dans la coquille ────────────────────────
PORTE_JS = """/* ── LA PORTE EST CELLE DU SITE, PLUS CELLE DE LA PAGE ────────────────────
   Ce qui était ici — un alphabet, un grain de sel, une somme de contrôle et
   une fabrique de codes, une trentaine de lignes en tout — jugeait les
   codes DANS le navigateur. Un code n'y était pas « acheté », il était
   « bien formé » : somme de contrôle juste, échéance non dépassée, bon
   préfixe de niveau. Tout cela se calcule sans rien acheter, et deux boutons
   de la porte le faisaient en un clic.

   La vérification est maintenant au serveur (`api/livret.php?action=unlock`),
   qui seul tient le registre : à qui le code a été émis, s'il est révoqué,
   sur combien d'appareils il tourne. Et le contenu ne part qu'après — il
   n'est plus téléchargeable en statique.

   `gate.js` fait tout cela pour les vingt-quatre autres ouvrages du site ;
   il n'y a pas de raison d'en écrire une seconde version ici. */
const LS = '@LS@';
const SLUG = '@SLUG@';
function norm(s) { return (s || '').toString().toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }

"""

LOAD_JS = """  /* ── LE CONTENU ARRIVE DU SERVEUR, PAS D'UN FICHIER À CÔTÉ ──────────────
     `load()` téléchargeait `content/<niveau>.enc` et le déchiffrait avec une
     graine écrite trois lignes plus haut. N'importe qui pouvait faire les deux.

     Désormais : `gate.js` obtient le jeton, demande la charge à
     `api/livret.php?action=content`, l'exécute — et le fichier pose
     `window.OI_DOC`. On le lit ici. Si la globale n'est pas là, ce n'est pas
     à nous de le dire : `gate.js` a déjà affiché pourquoi (code refusé,
     fichier abîmé, réseau coupé), et inventer un second message par-dessus
     ferait douter d'un diagnostic juste. */
  load() {
    if (this.state.doc) return;
    const d = window.OI_DOC;
    if (d && d.parts) this.setState({ doc: d, extrait: !!d._extrait });
  }
"""

UNLOCK_JS = """  /* ── LE SERVEUR TRANCHE, LA PAGE AFFICHE ────────────────────────────────
     Ce que la page peut encore juger seule : qu'un nom a été saisi (il ira sur
     le filigrane) et que le champ n'est pas vide. Le reste — le code est-il
     réel, payé, vivant, dans son quota d'appareils — n'appartient qu'au
     serveur, et il répond en français. */
  unlock(rawCode) {
    const code = (rawCode || '').trim();
    if (!code) { this.setState({ gateErr: 'Saisis le code reçu après ton paiement.' }); return; }
    if (!this.state.name.trim()) { this.setState({ gateErr: 'Écris ton nom : il figurera sur chaque page de ton cahier.' }); return; }
    if (!window.VRTLivret) { this.setState({ gateErr: 'La page n\\u2019a pas fini de charger. Attends un instant, puis réessaie.' }); return; }
    this.setState({ gateErr: '', gateBusy: true });
    window.VRTLivret.unlock(code)
      .then(() => {
        const sess = { code: code, name: this.state.name.trim(), classe: this.state.classe.trim() || SLUG,
                       role: window.VRTLivret.etat().kind === 'guide' ? 'teacher' : 'student' };
        try { localStorage.setItem(LS + 'moi', JSON.stringify({ name: sess.name, classe: sess.classe })); } catch (e) { /* quota */ }
        this.setState({ sess, gateErr: '', gateBusy: false, pi: 0 });
        this.load();
      })
      .catch(e => this.setState({ gateBusy: false, gateErr: (e && e.message) || 'Code refusé. Vérifie que tu l\\u2019as recopié exactement.' }));
  }
"""

MOUNT_JS = """  componentDidMount() {
    /* ── TROIS FAÇONS D'ARRIVER SUR CETTE PAGE ──────────────────────────────
       ① avec une session encore ouverte (on a déjà déverrouillé, ici, hier) :
          `resume()` la reprend sans redemander le code, et retombe sur la copie
          hors ligne si le réseau manque — au Cameroun, ce cas est la règle et
          non l'exception ;
       ② avec un lien d'aperçu (`?extrait=1`) : on charge les deux chapitres
          publics, et la porte reste fermée sur le reste ;
       ③ sans rien : la porte demande un code, et propose de l'acheter. */
    try {
      const m = JSON.parse(localStorage.getItem(LS + 'moi') || '{}');
      if (m.name) this.setState({ name: m.name, classe: m.classe || '' });
    } catch (e) { /* pas de nom retenu */ }
    try { this.setState({ ans: JSON.parse(localStorage.getItem(LS + 'ans') || '{}') }); } catch (e) { /* vide */ }

    if (window.VRTLivret) {
      window.VRTLivret.config({ classe: SLUG, kind: 'livret' });
      window.VRTLivret.resume()
        .then(() => {
          const m = (() => { try { return JSON.parse(localStorage.getItem(LS + 'moi') || '{}'); } catch (e) { return {}; } })();
          this.setState({ sess: { code: '', name: m.name || 'Élève', classe: m.classe || SLUG, role: window.VRTLivret.etat().kind === 'guide' ? 'teacher' : 'student' } });
          this.load();
        })
        .catch(() => { if (/[?&]extrait=1/.test(location.search)) this.chargerExtrait(); });
    } else if (/[?&]extrait=1/.test(location.search)) {
      this.chargerExtrait();
    }

    this._tick = setInterval(() => {
      if (this.state.tRun && this.state.tLeft > 0) this.setState(s => ({ tLeft: s.tLeft - 1, tRun: s.tLeft - 1 > 0 }));
    }, 1000);
    this._block = e => { if (!e.target.closest || !e.target.closest('input, textarea')) e.preventDefault(); };
    document.addEventListener('copy', this._block);
    document.addEventListener('cut', this._block);
    document.addEventListener('contextmenu', this._block);
    this.setState({ booted: true });
  }

  /* L'aperçu gratuit : deux chapitres, pris aux deux bouts du cahier, sans un
     seul corrigé. Il est PUBLIC — c'est le seul contenu de cet ouvrage qui le
     soit — et il se charge sans code, comme une vitrine s'ouvre sans clé. */
  chargerExtrait() {
    if (this._ex) return;
    this._ex = true;
    const s = document.createElement('script');
    s.src = '/livrets/extrait-' + SLUG + '.js?v=1.20.21';
    s.onload = () => {
      const d = window.OI_DOC;
      if (d && d.parts) {
        this.setState({ doc: d, extrait: true,
                        sess: { code: '', name: 'Aperçu gratuit', classe: '', role: 'student' } });
      }
    };
    s.onerror = () => this.setState({ gateErr: 'L\\u2019aperçu n\\u2019a pas pu être chargé. Vérifie ta connexion.' });
    document.head.appendChild(s);
  }
"""

EXP_FN = """function expLabel() {
  /* L'échéance n'est plus dans le code : elle est au registre, et le serveur
     la donne en JOURS restants. On dit donc une date quand on la connaît, et
     on se tait quand on ne la connaît pas — « valable jusqu'au undefined NaN »
     en bas de chaque page valait moins que rien. */
  var j = window.VRTLivret && window.VRTLivret.joursRestants();
  if (j === null || j === undefined || j < 0) return 'la fin de l\\u2019année scolaire';
  var d = new Date(Date.now() + j * 86400000);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}"""

EXP_JS = """      codeShort: (window.VRTLivret && window.VRTLivret.etat().ouvert) ? 'vérifié' : '—',
      expLabel: expLabel()"""

DEMO_JS = """      onDemo: () => { this.chargerExtrait(); },"""

DEMOT_JS = """      onDemoT: () => { if (window.VRTLivret) window.VRTLivret.config({ classe: SLUG, kind: 'livret' }).acheter(); else location.href = '/livrets/' + SLUG + '.html'; },"""


# ── Écriture ─────────────────────────────────────────────────────────────────
def marge_de_bord(im: Image.Image) -> tuple:
    """La couleur des bords de l'image, pour que la marge ne se voie pas.

    Un blanc franc autour d'une carte mentale au fond crème dessine un cadre.
    On échantillonne les quatre bords et on prend la médiane : sur un fond uni
    c'est ce fond, sur une photo c'est la teinte dominante du pourtour.
    """
    p = im.convert("RGB")
    l, h = p.size
    pts = ([p.getpixel((x, 0)) for x in range(0, l, max(1, l // 40))]
           + [p.getpixel((x, h - 1)) for x in range(0, l, max(1, l // 40))]
           + [p.getpixel((0, y)) for y in range(0, h, max(1, h // 40))]
           + [p.getpixel((l - 1, y)) for y in range(0, h, max(1, h // 40))])
    return tuple(sorted(c[i] for c in pts)[len(pts) // 2] for i in range(3))


def traiter_image(src: Path, dest: Path) -> tuple[int, int, str]:
    """Une image, au cadre du cahier, au poids d'une connexion camerounaise.

    Trois gestes, dans cet ordre :
      · ramener au rapport 3:2 en ajoutant de la marge — JAMAIS en rognant.
        Le cahier affiche en `object-fit: contain` : ce qu'on rognerait ici
        serait perdu, alors que la marge, elle, ne se voit pas ;
      · plafonner à 1 200 px de large. Le cahier est composé pour 420 px et
        s'affiche dans une colonne de 680 px : au-delà, on paie des octets
        pour des pixels que personne ne voit ;
      · encoder en WebP. Les quatre JPEG du lot pèsent 560 à 678 Ko à eux
        seuls, pour 750 × 400 pixels.
    """
    im = Image.open(src)
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGB")
    avant = src.stat().st_size

    l, h = im.size
    r = l / h
    if abs(r - CADRE) > 0.02:
        if r > CADRE:                       # trop large : marge en haut et en bas
            nh, nl = int(round(l / CADRE)), l
        else:                               # trop haute : marge à gauche et à droite
            nl, nh = int(round(h * CADRE)), h
        fond = Image.new("RGB", (nl, nh), marge_de_bord(im))
        base = im.convert("RGB") if im.mode == "RGBA" else im
        fond.paste(base, ((nl - l) // 2, (nh - h) // 2))
        im = fond

    if im.width > LARGEUR_MAX:
        im = im.resize((LARGEUR_MAX, int(round(LARGEUR_MAX / CADRE))), Image.LANCZOS)

    dest.parent.mkdir(parents=True, exist_ok=True)
    im.convert("RGB").save(dest, "WEBP", quality=QUALITE, method=6)
    return avant, dest.stat().st_size, f"{im.width}x{im.height}"


def noms_cites(coquilles: list[Path], documents: list[dict]) -> set:
    """Les images que les quatre cahiers demandent RÉELLEMENT.

    Quatre fichiers du lot — `_v3a.jpg` à `_v5b.jpg`, 2,5 Mo à eux seuls sur
    9,9 — ne sont cités nulle part. Ils partaient quand même par FTP : un quart
    de la charge d'images, pour rien. On ne copie donc que ce qui est demandé,
    et le lot maigrit tout seul le jour où une image cesse de servir.

    ⚠️ DEUX SOURCES, ET OUBLIER LA SECONDE ÉCARTE QUARANTE IMAGES SAINES.
    Les tables `CHAP_IMG` / `H3_IMG` / `MAP_IMG` vivent dans la coquille, mais
    la couverture d'une œuvre (`cover`) et l'image d'ouverture (`hero`) vivent
    dans le DOCUMENT. Ne lire que la coquille laissait dehors les trente-cinq
    illustrations des 5ᵉ, 4ᵉ et 3ᵉ ainsi que six de la 6ᵉ : les cahiers
    seraient partis avec des cadres vides, et rien ne l'aurait dit avant la
    production.

    ⚠️ ET LES DEUX SORTES DE GUILLEMETS. La coquille de 6ᵉ écrit ses tables en
    apostrophes, celles des trois autres en guillemets doubles — même
    générateur, deux mises en forme. Un motif qui n'accepte que l'une écarte
    silencieusement les trois quarts du lot.
    """
    besoin = set()
    motif = re.compile(r"['\"]([a-z0-9][a-z0-9_-]{3,})['\"]")
    for f in coquilles:
        besoin |= set(motif.findall(f.read_text(encoding="utf-8")))
    for doc in documents:
        besoin |= set(motif.findall(json.dumps(doc, ensure_ascii=False)))
    return besoin


def js_globale(doc: dict) -> str:
    """Le fichier de données : `window.OI_DOC = {…};`, et rien d'autre.

    `api/livret.php` relit ce nom dans les quatre cents premiers octets pour
    l'annoncer au client — il doit donc être en tête, et écrit tel quel.
    """
    return ("window." + GLOBALE + " = "
            + json.dumps(doc, ensure_ascii=False, separators=(",", ":")) + ";\n")


def catalogue_ecrire(fiches: dict[str, dict]) -> None:
    """Les quatre fiches, posées à côté des vingt-quatre autres.

    On ne réécrit pas le catalogue : on y ajoute. Chaque ouvrage déjà inscrit a
    pu être vendu, et le retirer refermerait les codes de ses acheteurs.
    """
    cat = {"version": 1, "ouvrages": {}}
    if CATALOGUE.is_file():
        try:
            cat = json.loads(CATALOGUE.read_text(encoding="utf-8"))
        except Exception:
            pass
    cat.setdefault("ouvrages", {})
    for slug, fiche in fiches.items():
        cat["ouvrages"][slug] = fiche
    CATALOGUE.write_text(
        json.dumps(cat, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--charge", help="dossier de dépôt FTP (uploads/protected/livrets)")
    ap.add_argument("--source", default=str(SOURCE), help="dossier des quatre cahiers")
    ap.add_argument("--controle", action="store_true", help="ne rien écrire")
    ap.add_argument("--seulement", help="un seul niveau (6e, 5e, 4e, 3e)")
    a = ap.parse_args()

    src = Path(a.source).expanduser()
    if not src.is_dir():
        print(f"[X] Source introuvable : {src}", file=sys.stderr)
        return 1

    charge = Path(a.charge).expanduser() if a.charge else None
    if charge:
        (charge / "uploads" / "protected" / "livrets").mkdir(parents=True, exist_ok=True)
        (charge / "uploads" / "oeuvres" / "1c").mkdir(parents=True, exist_ok=True)

    voulus = [a.seulement] if a.seulement else list(NIVEAUX)
    fiches: dict[str, dict] = {}
    documents: list[dict] = []
    total = {"booklet": 0, "guide": 0, "extrait": 0}

    print("CAHIERS D'ŒUVRES DU 1er CYCLE — mise en vente\n")

    for niveau in voulus:
        cfg = NIVEAUX.get(niveau)
        if not cfg:
            print(f"[X] Niveau inconnu : {niveau}", file=sys.stderr)
            return 1
        slug = cfg["slug"]

        fjson = src / cfg["json"]
        fhtml = src / cfg["src"]
        for f in (fjson, fhtml):
            if not f.is_file():
                print(f"[X] {f.name} introuvable dans {src}", file=sys.stderr)
                return 1

        doc = json.loads(fjson.read_text(encoding="utf-8"))
        eleve, prof = separer(doc)
        documents.append(doc)
        ex = extrait(eleve)
        ce, cp, cx = compter(eleve), compter(prof), compter(ex)

        # ── LE CONTRÔLE QUI COMPTE : rien de réservé dans la charge élève ────
        # On relit le PRODUIT, pas l'intention. Un filtre qui ne filtre pas se
        # voit ici, et nulle part ailleurs — surtout pas en production.
        #
        # ⚠️ ON NE COMPARE PAS LES TITRES. La partie « corrigés » reprend, mot
        # pour mot, les intertitres du cahier (« Mots croisés — Le vocabulaire
        # du conte ») : c'est ainsi qu'on s'y retrouve. Les chercher dans la
        # charge élève les trouve forcément, et le contrôle criait au vol sur
        # douze titres parfaitement légitimes. Ce qu'on traque est le CORPS du
        # corrigé — la phrase qui donne la réponse.
        sortie_eleve = js_globale(eleve)
        for quoi, t in reserves(doc):
            if t in sortie_eleve:
                print(f"[X] {slug} : {quoi} a survécu dans la charge élève : {t!r}",
                      file=sys.stderr)
                return 1

        print(f"  {slug}")
        print(f"    élève      {ce['parts']} parties · {ce['chapitres']} chapitres · "
              f"{ce['blocs']} blocs · {ce['exercices']} exercices · "
              f"{len(sortie_eleve) // 1024} Ko")
        print(f"    enseignant {cp['parts']} parties · {cp['blocs']} blocs "
              f"(dont {cp['blocs'] - ce['blocs']} réservés)")
        print(f"    aperçu     {cx['chapitres']} chapitres · {cx['blocs']} blocs")

        coquille = patcher(fhtml.read_text(encoding="utf-8"), niveau, cfg)

        if not a.controle:
            PUBLIC.mkdir(parents=True, exist_ok=True)
            (PUBLIC / f"cahier-{slug}.html").write_text(coquille, encoding="utf-8")
            (PUBLIC / f"extrait-{slug}.js").write_text(js_globale(ex), encoding="utf-8")
            if charge:
                d = charge / "uploads" / "protected" / "livrets"
                (d / f"booklet-{slug}.js").write_text(sortie_eleve, encoding="utf-8")
                (d / f"guide-{slug}.js").write_text(js_globale(prof), encoding="utf-8")
                total["booklet"] += len(sortie_eleve)
                total["guide"] += len(js_globale(prof))
            total["extrait"] += len(js_globale(ex))

        fiches[slug] = {
            "titre": cfg["titre"],
            "niveau": niveau,
            # Un troisième mode : la page EST le cahier, avec son propre moteur.
            # `interactif` enverrait sur cahier.html, qui lit CAHIER_BLOCS et ne
            # saurait rien faire de ce document-ci ; `lecture` enverrait sur le
            # liseur, qui réclamerait des images de pages qui n'existent pas.
            "mode": "autonome",
            "kinds": ["livret", "guide"],
            "prix": PRIX,
            "prixGuide": 0,
            "pages": 0,
            "pagesLibres": 0,
        }

    # ── Le moteur de rendu, et les illustrations ─────────────────────────────
    if not a.controle:
        moteur = src / "support.js"
        if not moteur.is_file():
            print("[X] support.js introuvable : la page ne saurait pas se dessiner.",
                  file=sys.stderr)
            return 1
        shutil.copyfile(moteur, PUBLIC / "support-oi.js")
        print(f"\n  livrets/support-oi.js  {moteur.stat().st_size // 1024} Ko")

        if charge:
            dest = charge / "uploads" / "oeuvres" / "1c"
            # ⚠️ ON VIDE AVANT DE DÉPOSER. Une passe précédente a pu y laisser
            # des images qu'aucun cahier ne demande plus — quatre doublons
            # traînaient déjà de la version d'avant. Le dépôt FTP est un
            # miroir : ce qu'on n'efface pas ici part sur le serveur et y
            # reste, sans que rien ne dise à quoi il sert.
            for vieux in dest.glob("*"):
                if vieux.is_file():
                    vieux.unlink()
            coquilles = sorted(PUBLIC.glob("cahier-oeuvres-*.html"))
            besoin = noms_cites(coquilles, documents)
            av = ap = 0
            garde = ecarte = neuves = 0
            for f in sorted((src / "img").iterdir()):
                if f.suffix.lower() not in (".webp", ".jpg", ".jpeg", ".png"):
                    continue
                if f.stem not in besoin:
                    ecarte += 1
                    continue
                a_, p_, _ = traiter_image(f, dest / (f.stem + ".webp"))
                av += a_; ap += p_; garde += 1
            for nom, (fichier, _legende) in INEDITES.items():
                o = ORIGINAUX / fichier
                if not o.is_file():
                    print(f"  [!] {fichier} introuvable dans {ORIGINAUX.name} — "
                          f"« {nom} » ne sera pas illustrée.", file=sys.stderr)
                    continue
                a_, p_, _ = traiter_image(o, dest / (nom + ".webp"))
                av += a_; ap += p_; neuves += 1
            print(f"  uploads/oeuvres/1c/    {garde + neuves} illustrations "
                  f"({neuves} nouvelles, {ecarte} écartées faute d'emploi) — "
                  f"{av // 1024} Ko → {ap // 1024} Ko")

        # ── UN CAHIER SANS COUVERTURE N'ENTRE PAS AU CATALOGUE ──────────────
        # Le catalogue est ce qui MET EN VENTE : dès qu'un ouvrage y figure et
        # que sa charge est déposée, la boutique affiche sa carte et la caisse
        # accepte son paiement. Une carte sans couverture est un trou dans la
        # grille, à l'endroit précis où l'on choisit — et `banc_boutique_unifiee`
        # le refuse, à raison.
        #
        # On ne triche donc pas avec une image d'attente : on n'inscrit pas.
        # Tout le reste est prêt et déployé ; il suffira de redéposer les
        # couvertures et de relancer ce script pour ouvrir la vente.
        couv = RACINE / "uploads" / "oeuvres"
        sans = [s for s in fiches if not (couv / f"livret_{s}.jpg").is_file()]
        if sans:
            print(f"\n  ⚠️  Catalogue NON modifié : {len(sans)} cahier(s) sans couverture.")
            for s_ in sans:
                print(f"        manque  uploads/oeuvres/livret_{s_}.jpg")
            print("      Déposez-les, puis relancez ce script et "
                  "`python tools/pages_ouvrages.py`.")
        else:
            catalogue_ecrire(fiches)
            print(f"  api/data/livrets_catalogue.json  +{len(fiches)} fiches à {PRIX} F")

    if a.controle:
        print("\n  (contrôle : rien n'a été écrit)")
    else:
        print(f"\n  charge élève {total['booklet'] // 1024} Ko · "
              f"enseignant {total['guide'] // 1024} Ko · "
              f"aperçus {total['extrait'] // 1024} Ko")
        if not charge:
            print("\n  ⚠️  Sans --charge, les fichiers VENDUS n'ont pas été produits.")
            print("      Le catalogue les annonce, le serveur ne peut pas les livrer.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
