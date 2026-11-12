# -*- coding: utf-8 -*-
"""
Fabrique `stances_extraits.py` à partir de l'édition numérique du recueil.

Les extraits d'une œuvre sont la seule partie d'un cahier qu'il soit interdit
de retaper : une syllabe déplacée détruit l'octosyllabe, et le cahier prétend
le compter. Les six poèmes sont donc découpés dans le fichier source par ce
script, et le module produit n'est jamais édité à la main.

Le recueil est en vers : chaque poème est reproduit **entier**. C'est l'unité
qui vaut, non la longueur — « Le Vase brisé » fait cent trente mots et se
commente d'un bout à l'autre ; le rallonger en lui accolant le poème voisin
n'aurait aucun sens.

Nettoyages appliqués — et uniquement ceux-là :
  * marqueurs de page du fac-similé (`<span title="Page:…">`) ;
  * lettrine initiale, que le balisage détache du mot qu'elle commence
    (« Q » + « uand » → « Quand ») ;
  * espaces en fin de vers.

Aucun mot de Sully Prudhomme n'est touché ; aucune coupe interne n'est faite.

    python enrichissement/_gen_stances_extraits.py
"""
import io
import os
import unicodedata
import re
import zipfile
from html import unescape

SRC_EPUB = os.path.join(os.path.expanduser("~"), "Desktop", "Adit manuels",
                        "Sully Prudhomme - Stances et poèmes @EpubsFR.epub")
ICI = os.path.dirname(os.path.abspath(__file__))
CIBLE = os.path.join(ICI, "stances_extraits.py")

# (clé, fichier du poème, titre, section du recueil, repère, référence)
POEMES = [
    ("P1", "c7_La_Vie_interieure_Le_Vase_brise", "Le Vase brisé",
     "Stances — La Vie intérieure",
     "Le vase fêlé — l'allégorie du cœur blessé",
     "section « Stances — La Vie intérieure », poème entier (cinq quatrains d'octosyllabes)"),
    ("P2", "c15_La_Vie_interieure_La_Memoire", "La Mémoire",
     "Stances — La Vie intérieure",
     "La mémoire, gardienne et bourreau — le temps retrouvé, le temps perdu",
     "section « Stances — La Vie intérieure », poème entier (parties I et II)"),
    ("P3", "c29_Jeunes_filles_Le_Meilleur_Moment_des_Amours",
     "Le meilleur Moment des Amours", "Stances — Jeunes filles",
     "L'attente préférée à la possession",
     "section « Stances — Jeunes filles », poème entier"),
    ("P4", "c45_Femmes_La_Femme", "La Femme", "Stances — Femmes",
     "Le portrait et l'énigme — le poème liminaire de la section",
     "section « Stances — Femmes », poème entier, en tête de la section"),
    ("P5", "c65_Melanges__Prudhomme__Le_Lever_du_soleil",
     "Le Lever du soleil", "Stances — Mélanges",
     "La science et l'idéal — ce que voit le savant, ce que voit le poète",
     "section « Stances — Mélanges », poème entier"),
    ("P6", "c116_Stances_et_Poemes___Je_me_croyais_poete__",
     "Je me croyais Poète", "Poèmes",
     "L'aveu final — le dernier poème du recueil",
     "partie « Poèmes », poème entier, dernière pièce du recueil"),
    # Les deux suivants ne portent pas de fiche : ils servent de support aux
    # commentaires composés entièrement rédigés de la section 8. Le cahier
    # étudie donc huit poèmes en tout.
    ("P7", "c13_La_Vie_interieure_Les_Berceaux", "Les Berceaux",
     "Stances — La Vie intérieure",
     "Les berceaux et les navires — rester, partir",
     "section « Stances — La Vie intérieure », poème entier"),
    ("P8", "c19_La_Vie_interieure_Intus", "Intus",
     "Stances — La Vie intérieure",
     "Deux voix dans une seule conscience",
     "section « Stances — La Vie intérieure », poème entier"),
    # Supports des deux devoirs au format MINESEC (section 9). Ils ne portent
    # ni fiche ni devoir rédigé : le jour de l'épreuve, l'élève doit découvrir
    # un texte qu'il n'a pas travaillé en classe.
    ("P9", "c23_La_Vie_interieure_La_Poesie", "La Poésie",
     "Stances — La Vie intérieure",
     "Ce que la poésie sait et que la dispute ignore",
     "section « Stances — La Vie intérieure », poème entier"),
    ("P10", "c8_La_Vie_interieure_L_Habitude", "L'Habitude",
     "Stances — La Vie intérieure",
     "La vieille aux yeux baissés qui conduit nos pas",
     "section « Stances — La Vie intérieure », poème entier"),
]

PAGE = re.compile(r'<span><span id="id-\d+" title="Page:[^"]*"></span></span>')
# La lettrine est parfois collée au reste du mot (« Q » + « uand »),
# parfois suivie d'une espace (« Ô » puis « Mémoire »). Ne rien consommer
# après la balise : la source dit elle-même lequel des deux cas c'est.
LETTRINE = re.compile(r'<span class="lettrine">([^<]*)</span>')
POEM = re.compile(r'<div class="poem\d*">(.*?)</div>', re.S)
H4 = re.compile(r'<h4[^>]*>(.*?)</h4>', re.S)
BR = re.compile(r'<br[^>]*/?>')


def _nu(brut):
    """Balises retirées sans insérer d'espace : la lettrine est collée au mot
    qu'elle commence, et « Q » + « uand » doit redonner « Quand »."""
    return unescape(re.sub(r"<[^>]+>", "", brut))


def _cle(s):
    """Forme comparable d'un titre : sans casse, sans accents, sans ponctuation."""
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "", s)


def poeme(z, base, titre_attendu, section=""):
    """Le poème entier : parties numérotées, vers, blancs de strophe.

    Deux pièges du balisage. Le titre est parfois coupé en deux `<h4>`
    successifs (« Le meilleur Moment » / « des Amours ») : on ne peut donc pas
    se contenter d'ignorer le premier. On écarte ceux dont le texte est un
    morceau du titre attendu, et on garde les autres — « I », « II »,
    « PROLOGUE » appartiennent au poème et doivent rester à leur place.

    Le second piège est invisible : chaque vers finit par un `<br/>` **suivi**
    d'un vrai retour à la ligne dans le fichier. Convertir les `<br/>` sans
    supprimer d'abord ces retours donnerait un blanc entre chaque vers, et
    ferait disparaître les strophes.
    """
    nom = next(n for n in z.namelist() if os.path.basename(n).startswith(base))
    d = z.read(nom).decode("utf8")
    d = PAGE.sub("", d)
    d = LETTRINE.sub(r"\1", d)
    # Le titre attendu, mot à mot. Comparer par sous-chaîne écarterait « I »
    # — la première partie de « La Mémoire » — parce que la lettre i figure
    # dans « lamemoire ». La partie disparaîtrait sans que rien le dise.
    # On y joint le nom de la section du recueil : l'édition numérique
    # répète « Femmes » en tête du poème liminaire, et ce mot n'est pas un
    # vers.
    mots_titre = set(re.findall(r"[a-z0-9]+", " ".join(
        _cle(x) for x in (titre_attendu + " " + section).split())))

    morceaux = []
    for m in re.finditer(r'<h[2-4][^>]*>(.*?)</h[2-4]>|<div class="poem\d*">(.*?)</div>',
                         d, re.S):
        if m.group(1) is not None:
            morceaux.append(("titre", _nu(m.group(1)).strip()))
        else:
            corps = m.group(2).replace("\n", "")      # d'abord, sinon strophes perdues
            lignes = [_nu(x).rstrip() for x in BR.sub("\n", corps).split("\n")]
            morceaux.append(("vers", lignes))

    out = []
    for typ, v in morceaux:
        if typ == "titre":
            mv = set(re.findall(r"[a-z0-9]+", " ".join(_cle(x) for x in v.split())))
            if mv and mv <= mots_titre:
                continue                              # morceau du titre du poème
            out += ["", v, ""]
        else:
            out += v
    texte = "\n".join(out)
    texte = re.sub(r"[ \t ]+\n", "\n", texte)
    texte = re.sub(r"\n{3,}", "\n\n", texte)
    return texte.strip("\n")


_PARTICULES = {"de", "du", "des", "la", "le", "les", "d'", "von", "van"}


def _capitales(t):
    """L'édition compose les dédicaces en petites capitales, que l'extraction
    rend en minuscules : « à henri schneider ». On restitue la casse du nom
    propre, sans toucher à la particule."""
    if not t:
        return t
    out = []
    for i, mot in enumerate(t.split()):
        out.append(mot if i == 0 or mot.lower() in _PARTICULES
                   else mot[:1].upper() + mot[1:])
    return " ".join(out)


def dedicace(z, base):
    """La dédicace du poème, si le recueil en porte une.

    Elle n'est pas un vers : elle vit hors du bloc de poème et n'entre donc
    pas dans l'extrait. Mais elle éclaire souvent le texte — « Le Lever du
    soleil » est dédié au maître de forges chez qui le poète a travaillé —
    et la référence doit la mentionner plutôt que de la laisser tomber.
    """
    nom = next(n for n in z.namelist() if os.path.basename(n).startswith(base))
    d = PAGE.sub("", z.read(nom).decode("utf8"))
    avant = d.split('<div class="poem', 1)[0]
    # Les blocs s'imbriquent : chercher « <div>…</div> » attraperait tout le
    # document jusqu'au premier </div>. On lit les segments de texte nus.
    for brut in re.split(r"<[^>]+>", avant):
        t = re.sub(r"\s+", " ", unescape(brut)).strip()
        if re.match(r"^à\s+\S", t, re.I) and 1 < len(t.split()) <= 8:
            return t
    return ""


def main():
    z = zipfile.ZipFile(SRC_EPUB)
    lignes = ['# -*- coding: utf-8 -*-',
              '"""',
              "Les six poèmes du cahier « Stances et Poèmes », relevés sur",
              "l'édition numérique du recueil.",
              "",
              "**Ce fichier est produit par `_gen_stances_extraits.py` ; ne pas",
              "l'éditer.** Toute retouche à la main d'un vers serait invisible et",
              "fausserait l'analyse qui s'appuie dessus — le décompte des syllabes",
              "le premier. Pour changer un poème, changer son entrée dans le",
              "générateur et le relancer.",
              "",
              "Sully Prudhomme, Stances et Poèmes, Paris, Alphonse Lemerre, 1865.",
              "Chaque poème est reproduit **entier** : aucune coupe, donc aucun",
              "[…]. Les six pièces couvrent les cinq sections du recueil.",
              '"""',
              "",
              'SRC = "Sully Prudhomme, Stances et Poèmes, Paris, Alphonse Lemerre, 1865, "',
              ""]
    fiches = []
    for cle, base, titre, section, repere, ref in POEMES:
        t = poeme(z, base, titre, section)
        d = _capitales(dedicace(z, base))
        if d:
            ref = ref + ", dédicace « %s »" % d
        n = len(t.split())
        v = sum(1 for l in t.split("\n") if l.strip())
        lignes.append("# %s — %s — %s (%d vers, %d mots)"
                      % (cle, titre, repere, v, n))
        lignes.append('%s = """%s"""' % (cle, t.replace('\\', '\\\\')))
        lignes.append("")
        fiches.append((cle, titre, section, repere, ref, v, n))
        print("  %-3s %-32s %3d vers %5d mots" % (cle, titre, v, n))

    lignes.append("# Le titre, la section et la référence de chaque poème. La référence")
    lignes.append("# nomme l'unité reproduite : l'audit le vérifie.")
    lignes.append("REFERENCES = {")
    for cle, titre, section, repere, ref, v, n in fiches:
        lignes.append('    "%s": ("%s", "%s",' % (cle, titre, section))
        lignes.append('           "%s"),' % ref)
    lignes.append("}")
    lignes.append("")
    lignes.append("REPERES = {")
    for cle, titre, section, repere, ref, v, n in fiches:
        lignes.append('    "%s": "%s",' % (cle, repere.replace('"', "'")))
    lignes.append("}")
    lignes.append("")

    io.open(CIBLE, "w", encoding="utf8").write("\n".join(lignes))
    print("\nstances_extraits.py écrit — %d poèmes." % len(fiches))


if __name__ == "__main__":
    main()
