# Audit final — VÉRITAS v1.20.26 (15/10/2026)

Périmètre : tout le site hors SkySMS (audité le même jour, voir `STATE.md`).
Méthode : les 70 bancs de la CI rejoués en local ; un parcours au navigateur
(Chromium) de 34 pages clés, à 390 px et à 1 280 px ; un examen du backend
PHP ; le contrôle des 235 URL des sitemaps et des liens internes des 338 pages
HTML ; le poids des fichiers publics. Le conteneur de travail n'atteint pas
veritas-school.com : la production est vérifiée par les sondes du déploiement
(vertes le 15/10 à 16:49 UTC).

## Corrigé dans ce lot

| Domaine | Constat | Correctif |
|---|---|---|
| Fiabilité | L'Atelier (`/plateforme/`), le mode d'emploi, la démo 6ᵉ et le feuilletage 4ᵉ chargeaient React depuis **unpkg.com**, sans repli. Si le CDN est lent ou bloqué (réseaux mobiles), la page reste blanche. C'est ce que montrait le parcours au navigateur ici. | React 18.3.1 est désormais servi par le site (`assets/vendor/`), avec des fichiers identiques et les mêmes empreintes SRI. Les trois chargeurs `support.js` sont repointés, et `tools/prepare_livrets.py` applique la même réécriture à chaque régénération. |
| SEO | `livrets/mode-emploi.html`, qui figure au sitemap, n'avait ni `<title>`, ni description, ni langue, ni canonical. | Les balises sont ajoutées, et le générateur (`TETES_LIBRES`) les repose à chaque régénération. |
| Accessibilité | Les champs de connexion (identifiant, mot de passe) et le formulaire d'orientation avaient des libellés non rattachés : un lecteur d'écran les annonçait sans nom. Le bouton « 👁 » n'avait pas de nom non plus. | `<label for>`, `autocomplete` et `aria-label` ajoutés. |
| Cache | Mise à jour de `app.js`. | Version 1.20.26 (`VERITAS_v1.2.html`, `sw.js`) ; habillage régénéré (23 pages). |

## Vérifié, conforme

- **Bancs** : 69/70 au vert. `banc_cahiers_reels` exige un dossier de charge local et n'est volontairement pas dans la CI.
- **Navigateur** : 68 vues sur 68 (34 pages × 2 largeurs), sans erreur JS, sans ressource locale manquante et sans débordement horizontal.
- **Liens** : 235 URL de sitemap, toutes présentes. Aucun lien interne cassé. Les seules alertes visent des fichiers produits au déploiement (`app.html`, `seo/`) ou des maquettes non publiées.
- **Backend** :
  - aucun secret dans le dépôt ;
  - aucun appel système ni `eval` ;
  - authentification et comparaisons à temps constant sur les routes d'administration ;
  - plafonds de débit sur les routes publiques ;
  - `api/data/` et `api/campus/` verrouillés au déploiement ;
  - CORS par liste blanche.
- **En-têtes** : HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP/CORP, CSP sur la vitrine et l'application.
- **Accessibilité** : les 34 pages ont toutes une langue déclarée. Aucune image sans `alt` et aucun bouton sans nom, hors les points corrigés ci-dessus.

## À décider (non corrigé, choix de contenu ou de produit)

1. **Corrigés 3ᵉ en double.**
   - `corriges/3e/cahier-*` (ancienne version : 168 exercices au module 1) et `corriges/3e-cahier/cahier-*` (170) sont tous deux indexables, avec le même titre. Google risque de les traiter comme du contenu dupliqué.
   - Le JSON-LD de `3e-cahier/` annonce l'URL de `3e/`.
   - Choisir la version de référence, puis rediriger ou passer l'autre en `noindex`.
2. **`corriges/tous-les-corriges.html` pèse 10,8 Mo** (2,4 Mo compressé) et figure au sitemap. Sur un téléphone en 3G, c'est inutilisable. Il faudrait le découper par classe ou le retirer du sitemap au profit des pages de classe.
3. **Couvertures d'œuvres** (`uploads/oeuvres/*.jpg`) : 1 200 × 1 600 px, jusqu'à 909 Ko chacune, et chaque image existe en double (`oeuvre-*` et `livret_oeuvre-*`). Une version WebP de 800 px de large ferait environ 100 Ko.
4. **Guide enseignant : visibilité des copies.**
   - Un code « guide » donne accès, par `api/cahier.php`, aux copies de tous les élèves du même ouvrage, quel que soit l'établissement.
   - Les élèves n'y figurent que par une empreinte, sans nom. Le défaut tient au périmètre : la vue n'est pas limitée à la classe de l'enseignant.
   - À cadrer si plusieurs établissements utilisent le même cahier.
5. **Descriptions trop longues** : 29 pages dépassent 170 caractères (Google les tronque) et 14 titres dépassent 70 caractères. 38 pages n'ont pas d'`og:image`. Impact faible.

## Hygiène des bancs

Plusieurs bancs existants écrivent des remises de test dans `api/data/notify/`
du dépôt local. Le dossier est ignoré par git et n'est jamais déployé : il n'y a
aucun risque pour la production, mais il faudrait les rediriger vers un dossier
temporaire, comme le fait `banc_skysms_rappel.cjs`.
