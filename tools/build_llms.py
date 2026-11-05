#!/usr/bin/env python3
"""Construit llms.txt — le résumé du site destiné aux moteurs de réponse IA.

POURQUOI (05/11/2026, GEO)
Les parents ne cherchent plus seulement sur Google : ils demandent à
ChatGPT, Claude, Perplexity ou Le Chat « soutien scolaire Douala » ou
« corrigé BEPC français ». Ces moteurs lisent quelques pages, puis CITENT.
llms.txt (https://llmstxt.org) leur donne en un seul fichier ce qu'est
VÉRITAS, ce qui est gratuit, comment payer et où se trouve chaque ressource,
au lieu de les laisser deviner à partir d'une page de 500 Ko.

D'OÙ VIENNENT LES LIGNES
Aucune n'est écrite à la main page par page : chaque lien est tiré des
sitemaps déployés, et sa description de la balise <meta name="description">
de la page elle-même. Une page retirée du sitemap disparaît d'ici au
prochain passage. Seuls les faits de l'en-tête (FAITS) sont rédigés : ils
reprennent mot pour mot ce que la vitrine affiche déjà.

LES PRIX N'Y SONT PAS, À DESSEIN
La grille est en cours de changement (STATE.md, 29/10/2026 : la base de
production facture 1 000 F, la vitrine annonce 1 200 F). Un prix faux dans un
fichier que les IA citent serait pire qu'aucun prix : on renvoie à la page
des tarifs, repeinte depuis le serveur.

    python3 tools/build_llms.py            # écrit llms.txt
    python3 tools/build_llms.py --controle # code 1 si llms.txt est périmé
"""
import html
import io
import os
import re
import sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = 'https://veritas-school.com/'
SORTIE = os.path.join(RACINE, 'llms.txt')

FAITS = """\
# Centre VÉRITAS

> Centre d'excellence scolaire à Douala (Cameroun) et plateforme en ligne :
> cours par séquence, exercices corrigés, annales BEPC, Probatoire, BAC et
> GCE, œuvres littéraires au programme et tuteur IA (Professeur Ambassa),
> conformes au programme officiel du MINESEC, de la 6ᵉ à la Terminale.

## L'essentiel

- Établissement : VERITAS EDUCATION SARL — Douala, Ndogpassi 14e, lieu-dit Carrefour Mbouda, Cameroun.
- Public : élèves de la 6ᵉ à la Terminale (sous-systèmes francophone et anglophone), parents, enseignants.
- Gratuit, sans carte : 14 049 exercices corrigés, les corrigés des cahiers imprimés, les jeux éducatifs, les outils (calcul de moyenne, planning de révision) et quelques questions par semaine au tuteur IA.
- Abonnements Starter, Pro, Élite et Famille (jusqu'à 4 enfants), au mois ou à l'année (2 mois offerts), sans engagement ni frais de résiliation. Compte parent gratuit. Tarifs à jour : https://veritas-school.com/#tarifs
- Paiement : MTN Mobile Money et Orange Money. Aucune carte bancaire nécessaire. Reçu numéroté avec QR de vérification, envoyé aussi par WhatsApp.
- Au centre ou à domicile : répétitions et soutien scolaire à Douala, devis en ligne.
- Œuvres au programme : 21 analyses complètes en accès libre (axes de lecture, personnages, citations expliquées, procédés, questions corrigées) : https://veritas-school.com/oeuvres/
- Enseignants : l'Atelier de Français compose avec l'IA des épreuves conformes aux 23 structures officielles du MINESEC : https://veritas-school.com/decouvrir/atelier-de-francais.html
- Simulations : examen blanc chronométré (BEPC, Probatoire, BAC) et 30 laboratoires virtuels de sciences : https://veritas-school.com/decouvrir/examen-blanc-en-ligne.html · https://veritas-school.com/decouvrir/laboratoires-virtuels.html
- Contact : WhatsApp +237 697 637 739 (https://wa.me/237697637739) · contact@veritas-school.com
"""

# Sitemap → (titre de section, nombre maximal de liens). Les corrigés
# comptent 144 pages : on n'en garde que les carrefours, sinon le fichier
# noie l'essentiel.
SECTIONS = [
    ('sitemap.xml', 'Pages principales', 40),
    ('decouvrir/sitemap-decouvrir.xml', 'Services, Atelier de Français et examen blanc', 40),
    ('decouvrir/sitemap-decouvrir.xml#labos', 'Laboratoires virtuels (TP en ligne)', 40),
    ('niveaux/sitemap-niveaux.xml', 'Programmes de français par classe', 40),
    ('ressources/sitemap-ressources.xml', 'Méthodes et examens', 40),
    ('oeuvres/sitemap-oeuvres.xml', 'Œuvres au programme', 40),
    ('outils/sitemap-outils.xml', 'Outils gratuits', 40),
    ('livrets/sitemap-livrets.xml', 'Cahiers en ligne', 15),
    ('corriges/sitemap-corriges.xml', 'Corrigés', 15),
]


def lire(chemin):
    with io.open(chemin, encoding='utf-8') as f:
        return f.read()


def fichier_local(url):
    rel = url[len(BASE):] if url.startswith(BASE) else url
    rel = rel.split('#')[0].split('?')[0]
    if rel == '':
        return os.path.join(RACINE, 'vitrine.html')
    if rel.endswith('/'):
        rel += 'index.html'
    return os.path.join(RACINE, rel)


def attribut(tete, nom):
    m = re.search(r'<meta\s+name="%s"\s+content="([^"]*)"' % nom, tete, re.I)
    return html.unescape(m.group(1)).strip() if m else ''


def fiche(url):
    chemin = fichier_local(url)
    if not os.path.isfile(chemin):
        return None
    page = lire(chemin)
    tete = page[:page.find('</head>')] if '</head>' in page else page[:20000]
    m = re.search(r'<title>([^<]*)</title>', tete, re.I)
    titre = html.unescape(m.group(1)).strip() if m else ''
    titre = re.sub(r'\s*[|·—-]\s*VÉRITAS\s*$', '', titre)
    if not titre:
        return None
    return titre, attribut(tete, 'description')


def urls(sitemap):
    # « fichier.xml#labos » : seulement les adresses qui contiennent /labos/ ;
    # le même sitemap sans suffixe les exclut. Les 30 TP ont ainsi leur
    # propre rubrique au lieu de noyer les services.
    sitemap, _, filtre = sitemap.partition('#')
    tout = _urls(sitemap)
    if filtre:
        return [u for u in tout if '/%s/' % filtre in u]
    if sitemap.startswith('decouvrir/'):
        return [u for u in tout if '/labos/' not in u]
    return tout


def _urls(sitemap):
    chemin = os.path.join(RACINE, sitemap)
    if not os.path.isfile(chemin):
        return []
    xml = re.sub(r'<!--.*?-->', '', lire(chemin), flags=re.S)
    return [u.strip() for u in re.findall(r'<loc>([^<]+)</loc>', xml)]


def construire():
    sortie = [FAITS]
    vues = set()
    for sitemap, titre_section, maxi in SECTIONS:
        lignes = []
        for url in urls(sitemap):
            if url in vues:
                continue
            # Pour les corrigés et cahiers : seulement les carrefours
            # (adresse en / ou page de classe), pas chaque séquence.
            if sitemap.startswith('corriges/') and not url.endswith('/'):
                continue
            if maxi < 40 and re.search(r'/sequence-\d+\.html$', url):
                continue
            f = fiche(url)
            if not f:
                continue
            vues.add(url)
            titre, desc = f
            # L'accueil porte un prix dans sa description : il est déjà
            # présenté dans l'en-tête, sans montant (voir plus haut).
            if url == BASE:
                desc = "Page d'accueil : présentation, tarifs, boutique, questions fréquentes."
            lignes.append('- [%s](%s)%s' % (titre, url, (': ' + desc) if desc else ''))
            if len(lignes) >= maxi:
                break
        if lignes:
            sortie.append('## %s\n\n%s\n' % (titre_section, '\n'.join(lignes)))
    sortie.append('## Utilisation\n\n'
                  "Lecture, indexation et citation par les assistants IA : bienvenues, avec un lien "
                  "vers la page source. Republier le contenu ailleurs : interdit "
                  "(voir https://veritas-school.com/ai.txt). "
                  "© Mythe Errant — VERITAS EDUCATION SARL.\n")
    return '\n'.join(sortie)


def main():
    neuf = construire()
    ancien = lire(SORTIE) if os.path.isfile(SORTIE) else ''
    if '--controle' in sys.argv:
        if neuf != ancien:
            print('llms.txt est périmé : lancer python3 tools/build_llms.py')
            sys.exit(1)
        print('llms.txt à jour')
        return
    with io.open(SORTIE, 'w', encoding='utf-8', newline='\n') as f:
        f.write(neuf)
    print('écrit llms.txt —', neuf.count('\n- ['), 'liens,', len(neuf.encode('utf-8')), 'octets')


if __name__ == '__main__':
    main()
