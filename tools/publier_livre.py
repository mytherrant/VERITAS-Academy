#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
tools/publier_livre.py — METTRE UN LIVRE EN VENTE SUR VERITAS, EN UNE COMMANDE.

Ce que fait cette commande, et qu'il fallait faire a la main jusqu'ici :
  1. rend le PDF depuis la maquette HTML (facultatif, si --html) ;
  2. rasterise le PDF en images de pages filigranables (api/secure_pdf.php) ;
  3. remplace la page 1 par la couverture HD si on en fournit une ;
  4. prepare l'EPUB en fragments assainis pour le mode texte (api/secure_epub.php) ;
  5. fabrique la vignette de couverture du site (uploads/oeuvres/) ;
  6. lit dans l'EPUB les titres de chapitres et l'incipit, mot pour mot ;
  7. inscrit la fiche dans catalogue_livres.json — le seul fichier a deployer.

CE QU'ELLE NE FAIT PAS, ET POURQUOI
  · Elle ne televerse rien. Le contenu paye vit dans uploads/protected/, qui
    n'est NI dans Git (le depot est public) NI accessible en HTTP. Il se depose
    par FTP. La commande imprime la liste exacte des dossiers a envoyer.
  · Elle ne synchronise pas la base. Le serveur apprend le titre quand un admin
    ouvre l'application (le prix de reference doit venir de la base, pas d'un
    fichier statique deposable sans authentification).

USAGE MINIMAL (un EPUB et un PDF deja prets)
    python tools/publier_livre.py --id monlivre --titre "Mon livre" \\
        --auteur "Mythe Errant" --prix 1000 \\
        --pdf "chemin/Mon livre.pdf" --epub "chemin/Mon livre.epub" \\
        --couverture "chemin/Couverture.png"

DEPUIS UNE MAQUETTE HTML (pipeline doc-page A5)
    ... --html "chemin/Mon livre.html"     (rend le PDF, exige node + playwright)

OPTIONS UTILES
    --pages-libres 10     pages offertes avant le mur de paiement (defaut 10)
    --extrait-mots 700    longueur de l'extrait libre en mode texte (defaut 700)
    --genre roman         'roman' retire les mentions scolaires de la fiche
    --papier              le livre existe aussi en papier (garde stock/commande)
    --refaire             refait les images meme si le dossier existe deja
"""
import argparse
import io
import json
import os
import re
import subprocess
import sys

# La console Windows est en cp1252 : sans cette ligne, un accent ou une emoji
# dans un titre fait planter la commande au lieu de publier le livre.
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

RACINE = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
PROTEGE = os.path.join(RACINE, 'uploads', 'protected', 'books')
VIGNETTES = os.path.join(RACINE, 'uploads', 'oeuvres')
CATALOGUE = os.path.join(RACINE, 'catalogue_livres.json')
LARGEUR_PAGE = 1240          # convention du lecteur (api/secure_pdf.php)


def dire(etape, texte):
    print('  %-12s %s' % (etape, texte))


# ══ 1. Maquette HTML → PDF ═════════════════════════════════════════════════
def rendre_pdf(html, sortie):
    outil = os.path.join(RACINE, 'tools', 'render_livre_pdf.cjs')
    if not os.path.isfile(outil):
        raise SystemExit('outil manquant : ' + outil)
    env = dict(os.environ, NODE_PATH=os.path.join(RACINE, 'node_modules'))
    r = subprocess.run(['node', outil, html, sortie], env=env,
                       stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    sortie_txt = r.stdout.decode('utf-8', 'replace').strip()
    if r.returncode != 0:
        raise SystemExit('rendu PDF echoue :\n' + sortie_txt)
    dire('PDF', sortie_txt.splitlines()[-1] if sortie_txt else sortie)
    return sortie


# ══ 2. PDF → images de pages ═══════════════════════════════════════════════
def rasteriser(pdf, dossier, qualite=82, largeur=LARGEUR_PAGE):
    """PDF → une image par page.

    LA DEFINITION EST UN ARBITRAGE, PAS UN DETAIL. Ces images se deposent par
    FTP a la main, depuis Douala, et se retelechargent une par une par des
    eleves sur donnees mobiles. Mesure faite sur un cahier d'oeuvre integrale
    (214 pages A5, aplats de couleur et texte colore) :

        1240 px q82  ->  234 Ko/page   (~50 Mo le cahier)
        1000 px q76  ->  151 Ko/page   (~32 Mo le cahier)

    1000 px pour un A5 de 148 mm fait 171 dpi : deux fois et demie la densite
    d'un telephone qui affiche la page sur 400 px de large. On ne gagne donc
    rien de VISIBLE au-dessus, et on paie chaque kilo-octet deux fois — une
    fois a l'envoi, une fois a chaque lecture. `subsampling=0` (4:4:4) n'est en
    revanche pas negociable : ces pages portent du texte de couleur sur aplat,
    et la chroma divisee par deux le frange.
    """
    try:
        import fitz
    except ImportError:
        raise SystemExit('PyMuPDF manquant :  pip install pymupdf')
    os.makedirs(dossier, exist_ok=True)
    doc = fitz.open(pdf)
    total, octets = doc.page_count, 0
    for n in range(total):
        page = doc.load_page(n)
        zoom = largeur / page.rect.width
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), colorspace=fitz.csRGB, alpha=False)
        chemin = os.path.join(dossier, 'p%03d.jpg' % (n + 1))
        pix.pil_save(chemin, format='JPEG', quality=qualite, optimize=True,
                     progressive=True, subsampling=0)
        octets += os.path.getsize(chemin)
    dire('pages', '%d pages, %.1f Mo (%d px, q%d)'
         % (total, octets / 1048576.0, largeur, qualite))
    return total


# ══ 3. Couverture : page 1 propre + vignette du site ═══════════════════════
def poser_couverture(couverture, dossier, id_livre, hauteur_page, LARGEUR_PAGE=LARGEUR_PAGE):
    """La maquette imprimee fait courir son titre courant par-dessus la
    couverture ; l'edition en ligne merite la couverture seule. « Contain » sur
    un fond echantillonne sur l'oeuvre : aucun recadrage, aucune bande visible."""
    from PIL import Image
    im = Image.open(couverture).convert('RGB')
    fond = im.getpixel((3, 3))
    r = min(LARGEUR_PAGE / im.width, hauteur_page / im.height)
    nl, nh = int(round(im.width * r)), int(round(im.height * r))
    toile = Image.new('RGB', (LARGEUR_PAGE, hauteur_page), fond)
    toile.paste(im.resize((nl, nh), Image.LANCZOS), ((LARGEUR_PAGE - nl) // 2, (hauteur_page - nh) // 2))
    toile.save(os.path.join(dossier, 'p001.jpg'), format='JPEG', quality=88,
               optimize=True, progressive=True)
    os.makedirs(VIGNETTES, exist_ok=True)
    vignette = os.path.join(VIGNETTES, id_livre + '.jpg')
    v = im.copy()
    v.thumbnail((600, 900), Image.LANCZOS)
    v.save(vignette, format='JPEG', quality=85, optimize=True, progressive=True)
    dire('couverture', 'page 1 remplacee + vignette %s' % os.path.relpath(vignette, RACINE))
    return 'uploads/oeuvres/' + id_livre + '.jpg'


# ══ 4. EPUB → fragments + titres + incipit ═════════════════════════════════
def preparer_epub(epub, id_livre, mots_libres):
    sys.path.insert(0, os.path.join(RACINE, 'tools'))
    import prepare_epub_reader as pe
    argv = sys.argv
    sys.argv = ['prepare_epub_reader.py', epub, id_livre, '--free-mots', str(mots_libres)]
    try:
        pe.main()
    finally:
        sys.argv = argv
    index = os.path.join(PROTEGE, id_livre, 'epub', 'index.json')
    manifeste = json.load(io.open(index, encoding='utf-8'))
    chapitres = [c for c in manifeste['chapitres'] if not c['liminaire']]
    titres = [c['titre'] for c in chapitres if c['titre']]
    incipit = ''
    if chapitres:
        frag = io.open(os.path.join(PROTEGE, id_livre, 'epub', chapitres[0]['f']),
                       encoding='utf-8').read()
        blocs = []
        for p in re.findall(r'<p[^>]*>(.*?)</p>', frag, re.S):
            t = re.sub(r'<[^>]+>', '', p).replace('&nbsp;', ' ').replace('&amp;', '&')
            t = re.sub(r'\s+', ' ', t).strip()
            if t:
                blocs.append(t)
        # Les deux premiers paragraphes d'un chapitre sont ses epigraphes.
        incipit = '\n\n'.join(blocs[2:5]) if len(blocs) > 4 else '\n\n'.join(blocs[:3])
    dire('epub', '%d chapitres, incipit de %d mots' % (len(chapitres), len(incipit.split())))
    return titres, incipit, manifeste['mots']


# ══ 5. Le catalogue ════════════════════════════════════════════════════════
def inscrire(fiche):
    cat = {'version': 1, 'livres': []}
    if os.path.isfile(CATALOGUE):
        try:
            cat = json.load(io.open(CATALOGUE, encoding='utf-8'))
        except ValueError:
            raise SystemExit('catalogue_livres.json illisible — corrigez-le avant de republier')
    livres = [l for l in cat.get('livres', []) if l.get('id') != fiche['id']]
    remplace = len(livres) != len(cat.get('livres', []))
    livres.append(fiche)
    livres.sort(key=lambda l: l.get('titre', ''))
    cat['livres'] = livres
    cat['version'] = 1
    with io.open(CATALOGUE, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(cat, f, ensure_ascii=False, indent=1)
        f.write('\n')
    dire('catalogue', ('fiche remplacee' if remplace else 'fiche ajoutee')
         + ' — %d livre(s) au catalogue' % len(livres))


def main():
    a = argparse.ArgumentParser(description='Met un livre en vente sur VERITAS.')
    a.add_argument('--id', required=True, help='identifiant court, sans espace ni accent')
    a.add_argument('--titre', required=True)
    a.add_argument('--auteur', default='Centre VÉRITAS')
    a.add_argument('--prix', type=int, required=True, help='prix de la lecture en ligne, en FCFA')
    a.add_argument('--pdf'), a.add_argument('--epub'), a.add_argument('--html')
    a.add_argument('--couverture')
    a.add_argument('--pages-libres', type=int, default=10)
    a.add_argument('--extrait-mots', type=int, default=700)
    a.add_argument('--desc', default='')
    a.add_argument('--isbn', default=''), a.add_argument('--editeur', default='')
    a.add_argument('--annee', type=int, default=0)
    a.add_argument('--genre', default=''), a.add_argument('--cls', default='Toutes classes')
    a.add_argument('--matiere', default=''), a.add_argument('--ico', default='📕')
    a.add_argument('--couleur', default='#142554')
    a.add_argument('--papier', action='store_true', help='le livre existe aussi en papier')
    a.add_argument('--refaire', action='store_true')
    # Voir la raison du reglage dans la docstring de `rasteriser`.
    a.add_argument('--largeur', type=int, default=LARGEUR_PAGE,
                   help='largeur des images de page en px (defaut %d)' % LARGEUR_PAGE)
    a.add_argument('--qualite', type=int, default=82,
                   help='qualite JPEG des images de page (defaut 82)')
    o = a.parse_args()

    id_livre = re.sub(r'[^A-Za-z0-9_-]', '', o.id)
    if not id_livre:
        raise SystemExit('--id doit contenir des lettres ou des chiffres')
    if not (o.pdf or o.html or o.epub):
        raise SystemExit('donnez au moins --pdf, --html ou --epub')
    dossier = os.path.join(PROTEGE, id_livre)

    print('\n📕 %s — %s\n' % (o.titre, id_livre))

    # PDF (rendu si besoin) → pages
    pages = 0
    pdf = o.pdf
    if o.html and not pdf:
        pdf = os.path.join(dossier + '_source.pdf')
        os.makedirs(dossier, exist_ok=True)
        rendre_pdf(o.html, pdf)
    deja = 0
    if os.path.isdir(dossier):
        deja = len([f for f in os.listdir(dossier) if re.match(r'^p\d{3}\.jpg$', f)])
    if pdf and (o.refaire or not deja):
        pages = rasteriser(pdf, dossier, o.qualite, o.largeur)
    elif deja:
        # Republier sans --pdf (pour corriger un prix, un resume) ne doit pas
        # perdre le nombre de pages : il se relit sur le disque.
        pages = deja
        dire('pages', '%d deja presentes — --refaire (avec --pdf) pour les regenerer' % pages)
    elif not o.epub:
        raise SystemExit('aucune page et aucun EPUB : rien a vendre')

    # Couverture
    vignette = ''
    if o.couverture:
        from PIL import Image
        h = o.largeur * 1757 // 1240
        if pages:
            h = Image.open(os.path.join(dossier, 'p002.jpg')
                           if os.path.isfile(os.path.join(dossier, 'p002.jpg'))
                           else os.path.join(dossier, 'p001.jpg')).height
        vignette = poser_couverture(o.couverture, dossier, id_livre, h, o.largeur)

    # EPUB
    chaps, incipit, mots = [], '', 0
    if o.epub:
        chaps, incipit, mots = preparer_epub(o.epub, id_livre, o.extrait_mots)

    fiche = {
        'id': id_livre, 'titre': o.titre, 'auteur': o.auteur,
        'cls': o.cls, 'matiere': o.matiere, 'genre': o.genre,
        'editeur': o.editeur, 'isbn': o.isbn, 'annee': o.annee,
        'prix': o.prix, 'prixDigital': o.prix,
        'pages': pages, 'securePages': pages, 'freePages': o.pages_libres,
        'epub': bool(o.epub), 'numeriqueSeul': not o.papier,
        'ico': o.ico, 'coverColor': o.couleur, 'coverImg': vignette,
        'desc': o.desc, 'chaps': chaps, 'extrait': incipit,
    }
    fiche = {k: v for k, v in fiche.items() if v not in ('', 0, [], None) or k in ('freePages',)}
    fiche['id'] = id_livre
    inscrire(fiche)

    # ── Ce qu'il reste a faire, et personne d'autre ne peut le faire ────────
    print('\n── Il reste trois gestes ─────────────────────────────────────────')
    print(' 1. FTP  → deposer  uploads/protected/books/%s/' % id_livre)
    if o.epub:
        print('           (dont le sous-dossier epub/ : le mode texte en depend)')
    print('           sur le serveur, au meme chemin. Ce dossier n\'est PAS')
    print('           dans Git : le depot GitHub est public.')
    print(' 2. GIT  → commiter  catalogue_livres.json'
          + ('  +  ' + vignette if vignette else '') + '  puis pousser.')
    print('           La CI deploie ; le cache-buster ?v= doit etre bumpe si')
    print('           app.js ou app.css ont change (garde-fou CI).')
    print(' 3. ADMIN→ ouvrir l\'application connecte en admin UNE fois : la')
    print('           fiche entre en base et la synchro l\'envoie au serveur.')
    print('           Sans ce passage, le lecteur repond « document introuvable ».')
    print('\n Verifier ensuite :  https://veritas-school.com/app.html#livre?id=%s\n' % id_livre)


if __name__ == '__main__':
    main()
