# -*- coding: utf-8 -*-
r"""Accès aux textes des douze œuvres, et extraction *prouvable* des citations.

Le dépôt est public : les textes intégraux vivent dans `_sources/`, qui est
ignoré par git. Ils sont reconstruits à la demande depuis la bibliothèque du
poste (`Desktop\Adit manuels`) — d'où `reconstruire()`. Aucune étude ne
dépend donc d'un fichier temporaire : si `_sources/` disparaît, la chaîne le
régénère au lieu d'échouer, contrairement aux cahiers du second cycle.

Toute citation d'auteur passe par `extrait()` : la fonction *découpe* le
fichier source au lieu de laisser retaper le texte, ce qui rend la règle du
verbatim mécaniquement vraie plutôt que promise. `audit.py` la revérifie.
"""
import html
import os
import re
import unicodedata

ICI = os.path.dirname(os.path.abspath(__file__))
SOURCES = os.path.join(ICI, "_sources")
BIBLIO = r"C:\Users\Mythe Errant\Desktop\Adit manuels"

# clé → nom du fichier dans la bibliothèque. Le nom exact importe : deux
# fichiers portent une apostrophe typographique que `os.listdir` seul révèle.
FICHIERS = {
    "chants": "LES CHANTS DE LA FORET.docx",
    "bimanes": "bimanes, Les - Severin Cécile Abega@EpubsFR.epub",
    "korotoumou": "Les contes de Korotoumou.docx",
    "arbre": "Jean Pliya, L'Arbre fétiche.docx",
    "nkumwam": "David Massoma Pandong, N'kum Wam le 8e notable.docx",
    "pereinconnu": "Pabé Mongo, père inconnu.docx",
    "pretendants": "Trois Pretendants",          # préfixe : nom de fichier très long
    "sahel": "Coeur du Sahel - Djaili Amadou Amal.docx",
    "solnatal": "Ernest Alima L'attachement au sol natal.docx",
    "villecruelle": "EZA BOTO, Ville cruelle.docx",
    "marmite": "La marmite de Koka-Mbala suivie - Guy MENGA.docx",
    "gouttes": "René Philombe, petites gouttes de chant pour créer l'homme.docx",
}

_CACHE = {}


# ---------------------------------------------------------------- extraction

def _du_docx(chemin):
    import docx
    return [p.text for p in docx.Document(chemin).paragraphs]


def _de_lepub(chemin):
    from ebooklib import ITEM_DOCUMENT, epub
    lignes = []
    for item in epub.read_epub(chemin).get_items():
        if item.get_type() != ITEM_DOCUMENT:
            continue
        t = item.get_content().decode("utf-8", "ignore")
        t = re.sub(r"(?is)<(script|style).*?</\1>", " ", t)
        t = re.sub(r"(?i)<br\s*/?>", "\n", t)
        t = re.sub(r"(?i)</(p|div|h[1-6]|li)>", "\n", t)
        lignes += [l.strip() for l in html.unescape(re.sub(r"<[^>]+>", "", t)).split("\n")]
    return lignes


def _localiser(nom):
    direct = os.path.join(BIBLIO, nom)
    if os.path.exists(direct):
        return direct
    for f in sorted(os.listdir(BIBLIO)):
        if f.startswith(nom):
            return os.path.join(BIBLIO, f)
    raise FileNotFoundError("œuvre introuvable dans la bibliothèque : %s" % nom)


def reconstruire(cle):
    """Réécrit `_sources/<cle>.txt` depuis la bibliothèque du poste."""
    chemin = _localiser(FICHIERS[cle])
    lignes = _de_lepub(chemin) if chemin.lower().endswith(".epub") else _du_docx(chemin)
    os.makedirs(SOURCES, exist_ok=True)
    cible = os.path.join(SOURCES, cle + ".txt")
    with open(cible, "w", encoding="utf-8") as f:
        f.write("\n".join(lignes))
    return cible


# ------------------------------------------------ réparation des scans

# Les fichiers de la bibliothèque sont des numérisations : la reconnaissance
# de caractères perd régulièrement une espace (« petites.Sur », « l'autreTanga
# desa substance »). Reproduire ces soudures dans un manuel scolaire est
# indéfendable ; les corriger à la main romprait la garantie de verbatim.
#
# D'où ce compromis, qui garde la garantie : la réparation **ne peut
# qu'insérer une espace**. Jamais changer, ajouter ni retirer une lettre.
# `_reparer` le vérifie mécaniquement en comparant les deux textes privés de
# tout blanc ; si l'égalité tombe, elle lève. Une soudure que l'espace seule
# ne répare pas (« pla¬ ceS ») n'est donc pas réparée du tout : on choisit
# alors un autre passage.
# Trois dégâts de numérisation que **toutes** les œuvres partagent : une
# tabulation lâchée au milieu d'une réplique, une espace avant la virgule ou
# le point, une apostrophe suivie d'un blanc (« si' le client »). Ils ne
# touchent que du blanc : ils se réparent partout, sans déclaration.
_UNIVERSEL = [(re.compile("\t+"), " "),
              (re.compile("[ \u00a0]+(?=[,.])"), ""),
              (re.compile("(?<=[A-Za-z\u00e0-\u00ff]')[ \u00a0]+(?=[a-z\u00e0-\u00ff])"), "")]

_REGLES = {
    # une ponctuation collée au mot suivant
    "ponct": re.compile(r"(?<=[.;:!?,])(?=[A-ZÉÈÀÂÎÔÛÇ])"),
    # une virgule, un point-virgule ou deux-points collés à une minuscule
    "virgule": re.compile(r"(?<=[,;:])(?=[a-zàâçéèêëîïôûùü])"),
    # deux mots soudés que la casse trahit : « demandaKoumé »
    "casse": re.compile(r"(?<=[a-zàâçéèêëîïôûùü])(?=[A-ZÉÈÀÂÎÔÛÇ])"),
}

# Quelles règles s'appliquent à quelle œuvre. La règle « casse » est refusée
# là où une majuscule interne est légitime (« iPhone » dans *Cœur du Sahel*)
# ou là où le scan a gardé une adresse d'archive et un sommaire soudé
# (*Trois prétendants*).
REPARATIONS = {
    "chants": ("ponct", "virgule"),
    "bimanes": ("ponct", "virgule"),
    "korotoumou": (),
    "arbre": ("ponct",),
    "nkumwam": ("ponct",),
    "pereinconnu": ("ponct",),
    "pretendants": (),
    "sahel": ("ponct", "virgule"),
    "solnatal": ("ponct", "virgule"),
    "villecruelle": ("ponct", "virgule", "casse"),
    "marmite": ("ponct", "virgule", "casse"),
    "gouttes": ("ponct", "virgule"),
}

# Les soudures que la ponctuation et la casse ne trahissent pas : deux mots
# en minuscules collés l'un à l'autre. Elles se relèvent à la lecture, une
# par une, et se déclarent ici. La garantie tient toujours : chaque entrée
# n'ajoute qu'une espace, et `_reparer` le contrôle.
JOINTURES = {
    "bimanes": [
        ("doncjamais", "donc jamais"),
        ("unpalmier", "un palmier"),
        ("protectiondouloureuse", "protection douloureuse"),
        ("quepouvait", "que pouvait"),
    ],
    "marmite": [
        ("enfinque", "enfin que"),
    ],
    "nkumwam": [
        ("koumEssoua", "koum Essoua"),
    ],
    "villecruelle": [
        ("accouraientavec", "accouraient avec"),
        ("actifplusieurs", "actif plusieurs"),
        ("annéesacheterlamienne", "années acheter la mienne"),
        ("attendraslongtemps", "attendras longtemps"),
        ("autresfaisaient", "autres faisaient"),
        ("autresspectateurs", "autres spectateurs"),
        ("aveccompassion", "avec compassion"),
        ("avoircontraint", "avoir contraint"),
        ("barragesurtout", "barrage surtout"),
        ("blancheurindécise", "blancheur indécise"),
        ("bégayait-elleentre", "bégayait-elle entre"),
        ("certainementce", "certainement ce"),
        ("certainssignes", "certains signes"),
        ("cetteéchappatoire", "cette échappatoire"),
        ("commissairedepolice", "commissaire de police"),
        ("conduisaientau", "conduisaient au"),
        ("connaissentmêmepas", "connaissent même pas"),
        ("constantsouvenir", "constant souvenir"),
        ("demandeseulement", "demande seulement"),
        ("desregards", "des regards"),
        ("devoirmourir", "devoir mourir"),
        ("disaitrien", "disait rien"),
        ("desa substance humaine", "de sa substance humaine"),
        ("discutaientgravement", "discutaient gravement"),
        ("découvertefaillit", "découverte faillit"),
        ("entréeinterdite", "entrée interdite"),
        ("faisaientensuite", "faisaient ensuite"),
        ("fixaitobstinément", "fixait obstinément"),
        ("fortsévèrement", "fort sévèrement"),
        ("gardesrégionaux", "gardes régionaux"),
        ("geignanttandis", "geignant tandis"),
        ("horriblementmal", "horriblement mal"),
        ("Ilsavaient", "Ils avaient"),
        ("hurlementsterribles", "hurlements terribles"),
        ("ignoraitpourtant", "ignorait pourtant"),
        ("indifférentespour", "indifférentes pour"),
        ("jamaissupporté", "jamais supporté"),
        ("lepaysdecesdeux", "le pays de ces deux"),
        ("lescontrôleurs", "les contrôleurs"),
        ("lesjeunes", "les jeunes"),
        ("leurturbulente", "leur turbulente"),
        ("longuesjambesnoires", "longues jambes noires"),
        ("lacaisse des missionnaires", "la caisse des missionnaires"),
        ("luirépondaient", "lui répondaient"),
        ("mauvaisevalise", "mauvaise valise"),
        ("meilleuremarchandise", "meilleure marchandise"),
        ("noirsbrillaient", "noirs brillaient"),
        ("nouscommencions", "nous commencions"),
        ("n'avaisque toi", "n'avais que toi"),
        ("n'enfaisait plus beaucoup", "n'en faisait plus beaucoup"),
        ("objurgationsdu", "objurgations du"),
        ("oubliaitparfois", "oubliait parfois"),
        ("perdreconnaissance", "perdre connaissance"),
        ("pirogueglissait", "pirogue glissait"),
        ("pleurerimpuissant", "pleurer impuissant"),
        ("plongeaitmécaniquement", "plongeait mécaniquement"),
        ("pourtantfaire", "pourtant faire"),
        ("pouvaitarriver", "pouvait arriver"),
        ("privilègesparmi", "privilèges parmi"),
        ("quittercommeça", "quitter comme ça"),
        ("raconteraitjuste", "raconterait juste"),
        ("renvoyaientquelqu", "renvoyaient quelqu"),
        ("restaitallongé", "restait allongé"),
        ("retournesdemain", "retournes demain"),
        ("rigoristesauparavant", "rigoristes auparavant"),
        ("répandaitcomme", "répandait comme"),
        ("savoirquiassurait", "savoir qui assurait"),
        ("siaimable,", "si aimable,"),
        ("simplementconfisqué", "simplement confisqué"),
        ("sonconsentement", "son consentement"),
        ("sontempérament", "son tempérament"),
        ("spectaculairede", "spectaculaire de"),
        ("totalementindifférente", "totalement indifférente"),
        ("Tangaauquel", "Tanga auquel"),
        ("touteconfiance", "toute confiance"),
        ("Toutjusqu", "Tout jusqu"),
        ("imprimait unfrisson", "imprimait un frisson"),
        ("transportéhors", "transporté hors"),
        ("vieillardinoffensif", "vieillard inoffensif"),
        ("voyageurétonné", "voyageur étonné"),
        ("étaisréveillée", "étais réveillée"),
    ],
}


def _sans_blanc(s):
    return re.sub(r"\s+", "", s)


def _reparer(cle, t):
    """Rend le texte débarrassé des soudures du scan — espaces seulement."""
    origine = t
    for rx, par in _UNIVERSEL:
        t = rx.sub(par, t)
    for nom in REPARATIONS.get(cle, ()):
        t = _REGLES[nom].sub(" ", t)
    for avant, apres in JOINTURES.get(cle, []):
        t = t.replace(avant, apres)
    if _sans_blanc(t) != _sans_blanc(origine):
        raise ValueError(
            "la réparation de %s a modifié une lettre : elle n'a le droit "
            "que d'insérer une espace" % cle)
    return t


def texte(cle):
    if cle not in _CACHE:
        chemin = os.path.join(SOURCES, cle + ".txt")
        if not os.path.exists(chemin):
            reconstruire(cle)
        _CACHE[cle] = _reparer(cle, open(chemin, encoding="utf-8").read())
    return _CACHE[cle]


# ------------------------------------------------------------ normalisation

_TIRETS = {"\u2010": "-", "\u2011": "-", "\u2012": "-", "\u2013": "-", "\u2014": "-"}
_QUOTES = {"\u2018": "'", "\u2019": "'", "\u201c": '"', "\u201d": '"',
           "\u00ab": '"', "\u00bb": '"'}


def plat(s):
    """Forme comparable : accents conservés, mais apostrophes, tirets,
    guillemets et blancs uniformisés. Les scans de la bibliothèque mêlent
    ’ et ', – et - ; sans cela un extrait pourtant exact serait déclaré faux.
    """
    s = unicodedata.normalize("NFC", s)
    for d in (_TIRETS, _QUOTES):
        for k, v in d.items():
            s = s.replace(k, v)
    s = s.replace("\u00a0", " ").replace("\u202f", " ")
    return re.sub(r"\s+", " ", s).strip()


# ------------------------------------------------------------------ découpe

def extrait(cle, depart, arrivee=None, mots=None, coupes=(), arret=()):
    """Rend un passage **découpé dans le fichier source**, jamais retapé.

    `depart` et `arrivee` sont de courtes amorces cherchées dans le texte
    aplati ; `mots` borne la longueur quand aucune fin n'est donnée. Chaque
    élément de `coupes` est un couple (début, fin) remplacé par « […] » —
    c'est la seule modification autorisée, et elle reste visible.

    `arret` est la garde qui empêche un extrait long de mordre sur le texte
    voisin : le passage s'arrête avant la première de ces chaînes rencontrée.
    Sans elle, une lecture suivie de cinq cents mots prise dans un conte de
    quatre cent quatre-vingts emporte le titre du conte suivant et ses
    premières lignes, et l'élève lit deux histoires en croyant n'en lire
    qu'une.
    """
    brut = texte(cle)
    # On travaille sur le texte aplati, puis on rapatrie les bornes sur le brut
    # via une table de correspondance des positions : découper directement le
    # brut garde les retours à la ligne, qui portent les vers et les répliques.
    positions, aplati = [], []
    precedent_blanc = True
    for i, ch in enumerate(brut):
        c = unicodedata.normalize("NFC", ch)
        c = _TIRETS.get(c, _QUOTES.get(c, c))
        if c in ("\u00a0", "\u202f"):
            c = " "
        if c.isspace():
            if precedent_blanc:
                continue
            c, precedent_blanc = " ", True
        else:
            precedent_blanc = False
        aplati.append(c)
        positions.append(i)
    aplati = "".join(aplati)

    d = aplati.find(plat(depart))
    if d < 0:
        raise ValueError("amorce absente de %s : %r" % (cle, depart[:60]))

    # La borne dure : la fin du morceau de texte dans lequel on a le droit
    # de découper. Elle est calculée avant tout le reste, et rabote aussi
    # bien une fin explicite qu'une longueur en mots.
    limite = len(aplati)
    for marque in arret:
        m = aplati.find(plat(marque), d + 1)
        if 0 <= m < limite:
            limite = m

    if arrivee:
        f = aplati.find(plat(arrivee), d)
        if f < 0:
            raise ValueError("fin absente de %s : %r" % (cle, arrivee[:60]))
        f += len(plat(arrivee))
    else:
        f = d
        for _ in range(mots or 120):
            g = aplati.find(" ", f + 1)
            if g < 0 or g >= limite:
                f = min(limite, len(aplati)) - 1
                break
            f = g

    # On termine toujours sur une phrase finie : un extrait coupé au milieu
    # d'une proposition se lit comme une faute d'impression.
    f = min(f, limite - 1)
    point = max(aplati.rfind(". ", d, f + 1), aplati.rfind("! ", d, f + 1),
                aplati.rfind("? ", d, f + 1), aplati.rfind("» ", d, f + 1))
    if point > d and not arrivee:
        f = point + 1

    morceau = brut[positions[d]:positions[min(f, len(positions) - 1)] + 1]
    for c_debut, c_fin in coupes:
        i = morceau.find(c_debut)
        j = morceau.find(c_fin, i + 1) if i >= 0 else -1
        if i < 0 or j < 0:
            raise ValueError("coupe introuvable dans l'extrait de %s" % cle)
        morceau = morceau[:i] + "[…]" + morceau[j + len(c_fin):]
    return re.sub(r"[ \t]+\n", "\n", morceau).strip()


def compte_mots(t):
    return len(re.findall(r"\w+", t))
