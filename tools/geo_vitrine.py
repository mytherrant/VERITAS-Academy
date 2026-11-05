#!/usr/bin/env python3
"""Données structurées « GEO » de la vitrine (vitrine.html).

POURQUOI (05/11/2026)
Un moteur de réponse IA (ChatGPT, Claude, Perplexity, Gemini, les Aperçus IA
de Google) ne lit presque jamais le JavaScript : il lit le HTML et, surtout,
le JSON-LD, qui lui dit sans ambiguïté QUI parle, OÙ, COMMENT payer et
répond déjà aux questions qu'il va se faire poser. La vitrine n'avait qu'un
bloc EducationalOrganization minimal (ville seule, aucun moyen de paiement,
aucun canal WhatsApp) et sa FAQ de sept questions n'était balisée nulle part.

CE QUE FAIT LE SCRIPT (idempotent)
Il pose ou remplace, juste avant </head>, un bloc balisé
<!-- geo-ld --> … <!-- /geo-ld --> qui contient :
  · WebSite (nom, langue, éditeur) ;
  · LocalBusiness/EducationalOrganization du centre : adresse complète,
    WhatsApp, moyens de paiement (MTN MoMo, Orange Money), zone desservie ;
  · FAQPage, tirée MOT POUR MOT des questions fréquentes affichées sur la
    page (aucune réponse rédigée ici : si la FAQ change, le bloc suit au
    prochain passage, et --controle le signale en CI).

Il ne touche pas au bloc JSON-LD d'origine, qui vient de la maquette
(« Refonte site Véritas/Refonte VERITAS.dc.html ») via build_vitrine.js.
À relancer après chaque build_vitrine.js.

    python3 tools/geo_vitrine.py            # écrit
    python3 tools/geo_vitrine.py --controle # code 1 si la page changerait
"""
import html
import io
import json
import os
import re
import sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(RACINE, 'vitrine.html')
BASE = 'https://veritas-school.com/'

DEBUT, FIN = '<!-- geo-ld -->', '<!-- /geo-ld -->'

CENTRE = {
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': BASE + '#centre',
    'name': 'Centre VÉRITAS',
    'legalName': 'VERITAS EDUCATION SARL',
    'url': BASE,
    'logo': BASE + 'assets/veritas-logo.png',
    'image': BASE + 'og-image.jpg',
    'description': ("Centre d'excellence scolaire à Douala : répétitions au centre et à domicile, "
                    "cours en ligne, exercices corrigés, annales BEPC, Probatoire, BAC et GCE, "
                    "conformes au programme MINESEC, de la 6ᵉ à la Terminale."),
    'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Ndogpassi 14e, lieu-dit Carrefour Mbouda',
        'addressLocality': 'Douala',
        'addressRegion': 'Littoral',
        'addressCountry': 'CM',
    },
    'areaServed': [{'@type': 'City', 'name': 'Douala'}, {'@type': 'Country', 'name': 'Cameroun'}],
    'telephone': '+237697637739',
    'email': 'contact@veritas-school.com',
    'contactPoint': [{
        '@type': 'ContactPoint',
        'contactType': 'customer service',
        'telephone': '+237697637739',
        'url': 'https://wa.me/237697637739',
        'availableLanguage': ['fr', 'en'],
    }],
    'currenciesAccepted': 'XAF',
    'paymentAccepted': 'MTN Mobile Money, Orange Money',
    'knowsAbout': ['Programme MINESEC', 'BEPC', 'Probatoire', 'Baccalauréat', 'GCE O Level',
                   'GCE A Level', 'Soutien scolaire', 'Répétitions à domicile',
                   'Dissertation littéraire', 'Commentaire composé'],
}


def lire():
    with io.open(PAGE, encoding='utf-8') as f:
        return f.read()


def texte(fragment):
    t = re.sub(r'<[^>]+>', '', fragment)
    return re.sub(r'\s+', ' ', html.unescape(t)).strip()


def faq(page):
    i = page.find('Questions fréquentes</h2>')
    if i < 0:
        sys.exit('geo_vitrine : section « Questions fréquentes » introuvable dans vitrine.html')
    seg = page[i:page.find('</section>', i)]
    paires = re.findall(r'<h3[^>]*>(.*?)</h3>\s*<p[^>]*>(.*?)</p>', seg, re.S)
    if len(paires) < 3:
        sys.exit('geo_vitrine : moins de 3 questions lues dans la FAQ (%d) — gabarit changé ?' % len(paires))
    return [{'@type': 'Question', 'name': texte(q),
             'acceptedAnswer': {'@type': 'Answer', 'text': texte(r)}} for q, r in paires]


def bloc(page):
    graphe = {
        '@context': 'https://schema.org',
        '@graph': [
            {'@type': 'WebSite', '@id': BASE + '#site', 'url': BASE, 'name': 'VÉRITAS',
             'inLanguage': 'fr-CM', 'publisher': {'@id': BASE + '#centre'}},
            CENTRE,
            {'@type': 'FAQPage', '@id': BASE + '#faq', 'inLanguage': 'fr-CM',
             'mainEntity': faq(page)},
        ],
    }
    js = json.dumps(graphe, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    return '%s\n<script type="application/ld+json">%s</script>\n%s' % (DEBUT, js, FIN)


def appliquer(page):
    neuf = bloc(page)
    if DEBUT in page:
        return re.sub(re.escape(DEBUT) + r'.*?' + re.escape(FIN), lambda m: neuf, page, count=1, flags=re.S)
    return page.replace('</head>', neuf + '\n</head>', 1)


def main():
    page = lire()
    apres = appliquer(page)
    if '--controle' in sys.argv:
        if apres != page:
            print('vitrine.html : bloc geo-ld absent ou périmé — lancer python3 tools/geo_vitrine.py')
            sys.exit(1)
        print('vitrine.html : bloc geo-ld à jour')
        return
    with io.open(PAGE, 'w', encoding='utf-8', newline='') as f:
        f.write(apres)
    print('vitrine.html : bloc geo-ld %s' % ('inchangé' if apres == page else 'écrit'))


if __name__ == '__main__':
    main()
