#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
tools/prepare_epub_reader.py — prepare un EPUB pour la LECTURE EN LIGNE gatee
(api/secure_epub.php), sans jamais livrer le fichier .epub au navigateur.

POURQUOI ICI ET PAS EN PHP — l'endpoint doit rester trivial : ni ZipArchive
(indisponibilite possible chez LWS), ni parseur XML, ni assainissement a la
volee. Tout le travail se fait une fois, hors ligne, et le serveur ne fait plus
que verifier le droit d'acces puis servir un fragment HTML deja propre.

USAGE
    python tools/prepare_epub_reader.py <livre.epub> <bookId> [--free-mots 700]

RESULTAT   uploads/protected/books/<bookId>/epub/
    index.json     manifeste (titres, nombres de mots, quel fichier est libre)
    cNN.html       fragment assaini du document NN de la colonne vertebrale
    cNN_free.html  extrait tronque, servi tant que l'acheteur n'a pas paye

Deposer ce dossier par FTP dans uploads/protected/books/<bookId>/ sur le
serveur : uploads/protected/ est interdit en HTTP direct (.htaccess deny).
"""
import json
import os
import re
import sys
import zipfile

BALISES_OK = {'p', 'h1', 'h2', 'h3', 'h4', 'hr', 'br', 'div', 'span',
              'blockquote', 'em', 'i', 'strong', 'b', 'small', 'sup'}


def arg(nom, defaut):
    if nom in sys.argv:
        i = sys.argv.index(nom)
        if i + 1 < len(sys.argv):
            return sys.argv[i + 1]
    return defaut


def opf_path(z):
    """Chemin de l'OPF, lu dans META-INF/container.xml."""
    c = z.read('META-INF/container.xml').decode('utf-8', 'replace')
    m = re.search(r'full-path="([^"]+)"', c)
    if not m:
        raise SystemExit('container.xml sans full-path : EPUB invalide')
    return m.group(1)


def colonne(z):
    """Liste ordonnee des documents XHTML du spine (chemins dans le zip)."""
    opf = opf_path(z)
    base = os.path.dirname(opf)
    src = z.read(opf).decode('utf-8', 'replace')
    manifeste = {}
    for m in re.finditer(r'<item\b([^>]*)/?>', src):
        a = m.group(1)
        i = re.search(r'id="([^"]+)"', a)
        h = re.search(r'href="([^"]+)"', a)
        t = re.search(r'media-type="([^"]+)"', a)
        if i and h:
            manifeste[i.group(1)] = (h.group(1), t.group(1) if t else '')
    ordre = []
    for m in re.finditer(r'<itemref\b[^>]*idref="([^"]+)"', src):
        ref = manifeste.get(m.group(1))
        if not ref:
            continue
        href, mime = ref
        if 'xhtml' not in mime and not href.endswith(('.xhtml', '.html')):
            continue
        ordre.append(base + '/' + href if base else href)
    return ordre


def corps(xhtml):
    m = re.search(r'<body[^>]*>(.*)</body>', xhtml, re.S | re.I)
    return m.group(1) if m else xhtml


def titre_doc(xhtml, frag):
    """Titre affichable : le <h1> du corps si present, sinon le <title>."""
    for motif in (r'<h1[^>]*>(.*?)</h1>', r'<title[^>]*>(.*?)</title>'):
        m = re.search(motif, frag if motif.startswith('<h1') else xhtml, re.S | re.I)
        if m:
            t = re.sub(r'<[^>]+>', ' ', m.group(1))
            t = re.sub(r'\s+', ' ', t).strip()
            if t:
                return t
    return ''


def assainir(frag):
    """Ne garde que des balises de texte, sans aucun attribut sauf class.

    Le fragment part vers innerHTML : tout ce qui pourrait porter un
    comportement (script, style, on*, href, src) doit avoir disparu ici, une
    fois pour toutes, plutot que d'etre filtre a chaque requete.
    """
    frag = re.sub(r'<(script|style)\b.*?</\1>', '', frag, flags=re.S | re.I)
    frag = re.sub(r'<!--.*?-->', '', frag, flags=re.S)

    def remplace(m):
        fermante, nom, attrs = m.group(1), m.group(2).lower(), m.group(3)
        if nom not in BALISES_OK:
            return ''
        if fermante:
            return '</%s>' % nom
        cls = re.search(r'\bclass="([^"]*)"', attrs)
        garde = ' class="%s"' % cls.group(1) if cls else ''
        auto = '/' if nom in ('br', 'hr') else ''
        return '<%s%s%s>' % (nom, garde, auto)

    frag = re.sub(r'<(/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^<>"]|"[^"]*")*?)/?>', remplace, frag)
    frag = re.sub(r'\n{3,}', '\n\n', frag)
    return frag.strip()


def mots(frag):
    t = re.sub(r'<[^>]+>', ' ', frag)
    t = t.replace('&nbsp;', ' ').replace('&#160;', ' ')
    return len([w for w in re.split(r'\s+', t) if w.strip()])


def tronquer(frag, budget):
    """Coupe au bloc pres : on ne laisse jamais une phrase a moitie servie."""
    blocs = re.findall(r'<(?:p|h1|h2|h3|h4|div|blockquote|hr)\b(?:[^<>"]|"[^"]*")*/?>.*?'
                       r'(?:</(?:p|h1|h2|h3|h4|div|blockquote)>|(?<=/>))', frag, re.S)
    if not blocs:
        return frag, mots(frag)
    out, total = [], 0
    for b in blocs:
        m = mots(b)
        if total and total + m > budget:
            break
        out.append(b)
        total += m
        if total >= budget:
            break
    return '\n'.join(out), total


def main():
    if len(sys.argv) < 3:
        raise SystemExit('Usage : python tools/prepare_epub_reader.py <livre.epub> <bookId> '
                         '[--free-mots 700]')
    src, book_id = sys.argv[1], re.sub(r'[^A-Za-z0-9_-]', '', sys.argv[2])
    free_mots = int(arg('--free-mots', '700'))
    racine = arg('--out', os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                       '..', 'uploads', 'protected', 'books'))
    out_dir = os.path.join(racine, book_id, 'epub')
    os.makedirs(out_dir, exist_ok=True)

    z = zipfile.ZipFile(src)
    docs = colonne(z)
    chapitres, total_mots, libre_pose = [], 0, False

    for n, chemin in enumerate(docs, start=1):
        xhtml = z.read(chemin).decode('utf-8', 'replace')
        # La table des matieres (nav) n'a rien a faire dans le flux de lecture :
        # le lecteur construit son sommaire depuis index.json.
        if '<nav' in xhtml.lower():
            continue
        frag = assainir(corps(xhtml))
        nb = mots(frag)
        if nb == 0:                      # page de couverture : une image, pas de texte
            continue
        titre = titre_doc(xhtml, frag)
        # Liminaire = page de titre, copyright, dedicace : court et sans chapitre.
        liminaire = nb < 120 and not re.search(r'chap-title|chap-num', frag)
        nom = 'c%02d.html' % (len(chapitres) + 1)
        with open(os.path.join(out_dir, nom), 'w', encoding='utf-8') as f:
            f.write(frag)
        entree = {'f': nom, 'titre': titre, 'mots': nb, 'liminaire': liminaire}
        # Le premier document NON liminaire porte l'extrait gratuit : au-dela,
        # le mur de paiement. Un seul fichier tronque, calcule ici.
        if not liminaire and not libre_pose:
            extrait, pris = tronquer(frag, free_mots)
            nom_free = nom.replace('.html', '_free.html')
            with open(os.path.join(out_dir, nom_free), 'w', encoding='utf-8') as f:
                f.write(extrait)
            entree['free'] = nom_free
            entree['free_mots'] = pris
            libre_pose = True
        chapitres.append(entree)
        total_mots += nb

    index = {'bookId': book_id, 'chapitres': chapitres, 'mots': total_mots,
             'freeMots': free_mots, 'version': 1}
    with open(os.path.join(out_dir, 'index.json'), 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=1)

    print('OK %s : %d documents, %d mots' % (book_id, len(chapitres), total_mots))
    for c in chapitres:
        marque = 'liminaire' if c['liminaire'] else 'chapitre '
        extra = (' + extrait libre de %d mots' % c['free_mots']) if 'free' in c else ''
        print('  %s %-6s %5d mots  %s%s' % (marque, c['f'], c['mots'],
                                            c['titre'][:40], extra))
    print('-> ' + os.path.normpath(out_dir))


if __name__ == '__main__':
    main()
