# -*- coding: utf-8 -*-
"""
docxkit — primitives de rendu DOCX pour les cahiers d'œuvre intégrale VÉRITAS.

Vocabulaire des blocs :
    ("h1", t) ("h2", t) ("h3", t)      titres
    ("p", t) ("pi", t)                 paragraphe justifié / italique
    ("puce", t) ("num", t)             listes
    ("extrait", texte, source[, forme])  encadré d'extrait + légende
                                       forme : "prose" | "scene" | "vers"
    ("encadre", type, titre, corps)    encadré ombré
    ("grille", [[...], ...])           tableau, 1re ligne = en-têtes
    ("saut",)                          saut de page

Le gras s'écrit **ainsi** à l'intérieur des textes.
"""
import re

from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

BLEU = RGBColor(0x1F, 0x38, 0x64)
BLEU_CLAIR = RGBColor(0x2E, 0x54, 0x96)
OR = RGBColor(0x9C, 0x6B, 0x1B)
GRIS = RGBColor(0x3B, 0x3B, 0x3B)
NOIR = RGBColor(0x23, 0x25, 0x2B)

# Les repères récurrents de la collection. Chacun a une fonction et une
# seule : l'élève doit savoir, à la couleur et au pictogramme, ce qu'on
# attend de lui — lire, chercher, retenir, s'entraîner. Ils ne sont jamais
# groupés en fin de cahier : ils ponctuent le parcours là où ils servent.
FILLS = {"astuce": "DCE6F4", "methode": "FBEAD2", "saviez": "DAEEEC",
         "vigilance": "F7E3E3", "objectif": "F3E6C6", "extrait": "F3F1EA",
         "citation": "F4F4F4",
         "lire": "EAF1E6", "observer": "E8EEF6", "retiens": "FDF3D6",
         "entraine": "EDE6F4", "lien": "E6F2F4", "examen": "F6E9DC"}
BADGES = {"astuce": "💡 Astuce.", "methode": "🧰 Boîte à outils.",
          "saviez": "📚 Le saviez-vous ?", "vigilance": "⚠ Attention.",
          "objectif": "🧭 Objectif.", "citation": "❝",
          "lire": "📖 Je lis.", "observer": "🔎 J'observe.",
          "retiens": "🎯 Je retiens.", "entraine": "✍ Je m'entraîne.",
          "lien": "🧠 Je fais le lien.", "examen": "📝 Côté examen."}


# La liste des pictogrammes de tête d'encadré : elle sert à distinguer un
# encadré d'un extrait d'œuvre. Elle est dérivée des badges, jamais recopiée :
# un pictogramme ajouté ici doit être connu de tous les contrôles, faute de
# quoi « Je retiens » serait pris pour un extrait et comparé à l'œuvre.
PICTOS = "".join(sorted({b[0] for b in BADGES.values()}))


def shade(el, fill):
    pr = el.get_or_add_tcPr() if el.tag == qn("w:tc") else el.get_or_add_pPr()
    sh = OxmlElement("w:shd")
    sh.set(qn("w:val"), "clear")
    sh.set(qn("w:color"), "auto")
    sh.set(qn("w:fill"), fill)
    pr.append(sh)


def cell_borders(tc, left=None, box=None):
    pr = tc.get_or_add_tcPr()
    borders = OxmlElement("w:tcBorders")
    for side in ("top", "left", "bottom", "right"):
        e = OxmlElement("w:" + side)
        if left and side == "left":
            e.set(qn("w:val"), "single")
            e.set(qn("w:sz"), "18")
            e.set(qn("w:color"), left)
        elif box:
            e.set(qn("w:val"), "single")
            e.set(qn("w:sz"), "4")
            e.set(qn("w:color"), box)
        else:
            e.set(qn("w:val"), "nil")
        borders.append(e)
    pr.append(borders)


_BALISE = re.compile(r"(\*\*.+?\*\*|\*[^*\n]+?\*)", re.S)


# Espace fine insécable : c'est elle que la typographie française place
# devant la ponctuation double, et l'espace insécable devant les guillemets.
FINE = "\u202f"
INSEC = "\u00a0"

# L'apostrophe suit toujours une lettre en français ; ce qui vient après
# peut être un guillemet ou une parenthèse — « d'« assainissement » ».
_APOSTROPHE = re.compile(r"(?<=\w)'")
_PONCT_DOUBLE = re.compile(r"[ ]*([;:!?])")
_GUILL_OUVRANT = re.compile(r"«[ ]*")
_GUILL_FERMANT = re.compile(r"[ ]*»")


def typographie(t):
    """Normalise ce qui se voit à l'impression, jamais ce qui fait sens.

    Quatre corrections, et uniquement celles-là :
      * l'apostrophe droite devient l'apostrophe typographique ;
      * la ponctuation double reçoit son espace fine insécable ;
      * les guillemets français reçoivent leur espace insécable ;
      * les espaces multiples sont réduits.

    Aucune ne change un mot. L'apostrophe et l'espace ne distinguent pas deux
    mots français, et le contrôle verbatim les neutralise de son côté : un
    extrait reste donc conforme à sa source après cette passe.
    """
    if not t:
        return t
    t = _APOSTROPHE.sub("\u2019", t)
    t = _PONCT_DOUBLE.sub(FINE + r"\1", t)
    t = _GUILL_OUVRANT.sub("«" + INSEC, t)
    t = _GUILL_FERMANT.sub(INSEC + "»", t)
    t = re.sub(r"  +", " ", t)
    return t


def _rich(par, texte, *, size=10.5, italic=False, color=GRIS):
    """
    Écrit un texte en gérant le gras **ainsi** et l'italique *ainsi*.

    Les deux balises doivent être traitées ensemble : ne gérer que le gras
    laissait les astérisques d'italique s'imprimer littéralement — une
    centaine par cahier.
    """
    for chunk in _BALISE.split(texte):
        if not chunk:
            continue
        gras = chunk.startswith("**") and chunk.endswith("**") and len(chunk) > 4
        ital = (not gras) and chunk.startswith("*") and chunk.endswith("*") \
            and len(chunk) > 2
        contenu = chunk[2:-2] if gras else (chunk[1:-1] if ital else chunk)
        # Un italique peut être imbriqué dans un gras : « **Première partie —
        # l'affirmation se vérifie dans *Balafon*.** ». Sans ce second
        # découpage, les astérisques intérieures s'impriment telles quelles.
        morceaux = ([(m, m.startswith("*") and m.endswith("*") and len(m) > 2)
                     for m in _BALISE.split(contenu) if m]
                    if gras and "*" in contenu else [(contenu, False)])

        for texte_run, ital_interne in morceaux:
            if ital_interne:
                texte_run = texte_run.strip("*")
            r = par.add_run(typographie(texte_run))
            r.font.size = Pt(size)
            r.font.bold = gras
            r.font.italic = italic or ital or ital_interne
            r.font.color.rgb = color
    return par


def _fmt(par, *, justify=True, after=6, indent=None, hanging=False):
    if justify:
        par.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    par.paragraph_format.space_after = Pt(after)
    if indent is not None:
        par.paragraph_format.left_indent = Cm(indent)
    if hanging:
        par.paragraph_format.first_line_indent = Cm(-0.25)
    return par


def _heading(doc, texte, niveau):
    p = doc.add_paragraph(style="Heading %d" % niveau)
    tailles = {1: 16, 2: 13.5, 3: 11.5}
    couleurs = {1: BLEU, 2: BLEU, 3: BLEU_CLAIR}
    r = p.add_run(typographie(texte))
    r.font.size = Pt(tailles[niveau])
    r.font.bold = True
    r.font.color.rgb = couleurs[niveau]
    p.paragraph_format.space_before = Pt(14 if niveau < 3 else 10)
    p.paragraph_format.space_after = Pt(5)
    if niveau == 1:
        p.paragraph_format.page_break_before = True
    return p


# Un nom de personnage : soit balisé **AINSI**, soit une ligne entièrement en
# capitales. Les deux écritures coexistent dans les cahiers ; les deux doivent
# être composées en gras, sans quoi le nom se noie dans la réplique.
_PERSO = re.compile(
    "^(?:[*][*])?[A-ZÀ-ÜŒ][A-ZÀ-ÜŒ’', .—-]{1,58}(?:[*][*])?$")


def forme_extrait(texte):
    """Prose, scène de théâtre ou vers ? La question se tranche par bloc.

    Un extrait porte une disposition ; la conserver dans les données ne suffit
    pas, il faut la composer — sans quoi le nom du personnage se noie dans sa
    réplique et le lecteur ne voit plus où finit le vers.
    """
    lignes = [x.strip() for x in texte.split("\n") if x.strip()]
    if len(lignes) < 4:
        return "prose"
    if sum(1 for x in lignes if _PERSO.match(x)) >= 3:
        return "scene"
    corps = [x for x in lignes if not x.startswith("(")]
    if corps and sum(len(x.split()) for x in corps) / float(len(corps)) <= 11:
        return "vers"
    return "prose"


def _vers(cellule, texte, premier):
    """Un vers : une ligne, repli en retrait négatif, jamais justifié."""
    par = cellule.paragraphs[0] if premier else cellule.add_paragraph()
    _rich(par, texte, size=10, color=NOIR)
    par.alignment = WD_ALIGN_PARAGRAPH.LEFT
    pf = par.paragraph_format
    pf.space_after = Pt(0)
    pf.left_indent = Cm(0.5)
    pf.first_line_indent = Cm(-0.5)
    return par


def _rendre_extrait(tc, texte, forme):
    """Écrit l'extrait dans sa cellule, composé selon sa forme.

    prose : justifié, en italique, comme les cinq premiers cahiers.
    scene : nom du personnage en gras bleu nuit, didascalie en italique grise,
            réplique en romain, un vers par ligne.
    vers  : un vers par ligne, blancs de strophe conservés.
    """
    lignes = texte.split("\n") if forme == "vers" else         [x for x in texte.split("\n") if x.strip()]
    premier = True
    for brut in lignes:
        nu = brut.strip()

        if forme == "prose":
            par = tc.paragraphs[0] if premier else tc.add_paragraph()
            _fmt(_rich(par, nu, size=10, italic=True, color=NOIR), after=5)

        elif forme == "scene":
            if _PERSO.match(nu):
                par = tc.paragraphs[0] if premier else tc.add_paragraph()
                r = par.add_run(typographie(nu.strip("*")))
                r.font.size = Pt(9.5)
                r.font.bold = True
                r.font.color.rgb = BLEU
                par.alignment = WD_ALIGN_PARAGRAPH.LEFT
                par.paragraph_format.space_before = Pt(0 if premier else 7)
                par.paragraph_format.space_after = Pt(1)
            elif nu.startswith("(") and nu.endswith(")"):
                par = tc.paragraphs[0] if premier else tc.add_paragraph()
                r = par.add_run(typographie(nu))
                r.font.size = Pt(9)
                r.font.italic = True
                r.font.color.rgb = GRIS
                par.alignment = WD_ALIGN_PARAGRAPH.LEFT
                par.paragraph_format.space_after = Pt(2)
            else:
                _vers(tc, nu, premier)

        else:
            if not nu:
                if not premier:
                    blanc = tc.add_paragraph()
                    blanc.paragraph_format.space_before = Pt(0)
                    blanc.paragraph_format.space_after = Pt(5)
                continue
            _vers(tc, nu, premier)

        premier = False



def render(doc, blocs):
    """Écrit la liste de blocs à la fin du document.

    Deux précautions d'impression sont prises ici, et nulle part ailleurs :
    aucun saut de page n'est rendu s'il en suit un autre ou s'il précède un
    titre de niveau 1 — qui en provoque déjà un —, faute de quoi le volume
    contiendrait des pages blanches ; et les espaces de fin de paragraphe
    sont retirées, car elles faussent la justification de la dernière ligne.
    """
    blocs = list(blocs)
    for i, blk in enumerate(blocs):
        kind = blk[0]

        if kind == "saut":
            suivant = blocs[i + 1][0] if i + 1 < len(blocs) else None
            precedent = blocs[i - 1][0] if i else None
            if suivant in ("saut", "h1") or precedent == "saut":
                continue

        if kind in ("h1", "h2", "h3"):
            _heading(doc, blk[1], int(kind[1]))

        elif kind in ("p", "pi"):
            _fmt(_rich(doc.add_paragraph(), blk[1].rstrip(),
                       italic=(kind == "pi")))

        elif kind == "puce":
            _fmt(_rich(doc.add_paragraph(style="List Bullet"), blk[1].rstrip()),
                 after=3)

        elif kind == "num":
            _fmt(_rich(doc.add_paragraph(style="List Number"), blk[1].rstrip()),
                 after=3)

        elif kind == "extrait":
            texte, source = blk[1], blk[2]
            forme = blk[3] if len(blk) > 3 else forme_extrait(texte)
            t = doc.add_table(rows=1, cols=1)
            t.alignment = WD_TABLE_ALIGNMENT.CENTER
            tc = t.rows[0].cells[0]
            shade(tc._tc, FILLS["extrait"])
            cell_borders(tc._tc, left="9C6B1B")
            _rendre_extrait(tc, texte, forme)
            leg = doc.add_paragraph()
            r = leg.add_run(typographie(source))
            r.font.size = Pt(8.5)
            r.font.italic = True
            r.font.color.rgb = OR
            leg.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            leg.paragraph_format.space_after = Pt(10)

        elif kind == "encadre":
            typ, titre, corps = blk[1], blk[2], blk[3]
            t = doc.add_table(rows=1, cols=1)
            tc = t.rows[0].cells[0]
            shade(tc._tc, FILLS.get(typ, "F4F4F4"))
            cell_borders(tc._tc, box="9C6B1B")
            head = tc.paragraphs[0]
            # Le badge est écrit hors du chemin de `_rich` : sans cet appel, les
            # apostrophes de « J'observe » et « Je m'entraîne » s'impriment droites.
            rb = head.add_run(typographie(BADGES.get(typ, "") + " "))
            rb.font.size = Pt(10)
            rb.font.bold = True
            rb.font.color.rgb = OR
            rt = head.add_run(typographie(titre))
            rt.font.size = Pt(10)
            rt.font.bold = True
            rt.font.color.rgb = BLEU
            head.paragraph_format.space_after = Pt(4)
            for para in (corps if isinstance(corps, list) else [corps]):
                puce = para.startswith("- ")
                par = tc.add_paragraph()
                _rich(par, (para[2:] if puce else para).rstrip(), size=10)
                _fmt(par, after=4, indent=0.4 if puce else None, hanging=puce)
            doc.add_paragraph().paragraph_format.space_after = Pt(6)

        elif kind == "grille":
            data = [r for r in blk[1] if r]
            if not data:
                continue
            largeur = max(len(r) for r in data)
            t = doc.add_table(rows=len(data), cols=largeur)
            try:
                t.style = "Table Grid"
            except KeyError:
                pass
            for ri, row in enumerate(data):
                for ci in range(largeur):
                    val = row[ci] if ci < len(row) else ""
                    tc = t.rows[ri].cells[ci]
                    par = tc.paragraphs[0]
                    _rich(par, (val or "").rstrip(), size=9.5)
                    par.paragraph_format.space_after = Pt(2)
                    if ri == 0:
                        shade(tc._tc, "E8EDF5")
                        for r in par.runs:
                            r.font.bold = True
                            r.font.color.rgb = BLEU
            doc.add_paragraph().paragraph_format.space_after = Pt(6)

        elif kind == "saut":
            doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)

        else:
            raise ValueError("bloc inconnu : %r" % (kind,))


def words(blocs):
    n = 0
    for b in blocs:
        for part in b[1:]:
            if isinstance(part, str):
                n += len(part.split())
            elif isinstance(part, list):
                for x in part:
                    n += len(" ".join(map(str, x)).split()) if isinstance(x, list) \
                        else len(str(x).split())
    return n
