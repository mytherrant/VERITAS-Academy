# VÉRITAS Gestion — gestion.veritas-school.com

Application des centres de répétition (Ndog-passi III, Ndog-passi II, et ceux qu'on ouvrira) :
rôles par centre, emploi du temps et jours/horaires, inscriptions ; puis appel, exports, caisse, enseignants.

> Ce fichier n'est pas déployé (la CI copie une liste fermée de fichiers).

## Architecture

| Couche | Fichiers | Rôle |
|---|---|---|
| Coquille PWA | `index.html`, `app.css`, `app.js`, `sw.js`, `manifest.webmanifest`, `polices/` | JavaScript simple, sans compilation ; s'ouvre hors ligne |
| Données locales | IndexedDB `veritas-gestion` | copie des données lisibles + file « sortie » des modifications |
| API | `api/index.php` (routes `?r=`), `api/install.php` | PHP 8.2 sans dépendance |
| Socle | `api/_boot.php`, `api/_auth.php`, `api/_schema.php` | PDO, sessions révocables, rôles, journal, schéma |
| Base | MySQL `verit2781684` en ligne (tables `g_*`), SQLite sur le poste | même schéma, décrit une fois dans `_schema.php` |

**Le serveur seul décide des droits.** Chaque lecture et chaque écriture est filtrée sur les
centres du compte (`g_acces`). Le téléphone applique ses modifications tout de suite, les range
dans une file et les envoie dès que le réseau le permet ; une opération refusée est retirée et
l'écran revient à la version du serveur. Chaque opération a un identifiant : un envoi répété
n'est jamais appliqué deux fois.

**Rôles :** admin global (les deux centres) · responsable · actionnaire (consultation des
finances + emploi du temps) · secrétaire/surveillant · enseignant. Voir `g_capacites()`.

## Mise en service (une fois)

1. **Sous-domaine** — panneau LWS › Domaines › Sous-domaines : créer `gestion.veritas-school.com`
   pointant vers le dossier **`gestion`** de l'hébergement (là où la CI dépose les fichiers),
   puis activer le certificat SSL du sous-domaine.
2. **Jeton d'installation** — ajouter dans `api/payment_config.php` (sur le serveur, gitignoré) :
   `define('G_INSTALL_TOKEN', '<64 caractères aléatoires>');`
   (à défaut, `CAMPUS_INSTALL_TOKEN` est accepté). `MYSQL_PASS` y est déjà.
3. **Déployer** la branche (voir la procédure du dépôt).
4. Ouvrir `https://gestion.veritas-school.com` : l'écran d'installation demande le jeton,
   crée les tables, les deux centres d'après les affiches 2026-2027 (adresses, téléphones,
   classes, jours et horaires — dont ceux des 3e à Germinal), l'année 2026-2027 (rentrée le
   16 septembre, septembre gratuit), les matières, et le compte administrateur.
5. Créer les comptes (Comptes et accès) et transmettre les identifiants par WhatsApp.

Réinstaller est sans risque : `install.php` est idempotent et ajoute seulement ce qui manque
(tables, colonnes, index).

## Développement local

```bash
# gestion/api/_config.php (gitignoré) : define('G_DB_DRIVER','sqlite'); define('G_INSTALL_TOKEN','…');
php -d extension=pdo_sqlite -S 127.0.0.1:8000 -t gestion
python tests/banc_gestion_api.py                 # isolement des centres, rôles, règles, synchro
node tests/banc_gestion_versions.cjs             # ?v= identique partout
node tests/banc_gestion_horsligne.cjs <dossier>  # vrai hors ligne (Playwright)
node tests/banc_gestion_emploi.cjs <dossier>     # emploi du temps (Playwright)
node tests/banc_gestion_eleves.cjs <dossier>     # inscriptions, homonymes, import, horaires (Playwright)
```

**Noms fictifs uniquement** dans le code et les bancs : le dépôt est public, les élèves sont mineurs.

**Chaque livraison change la version** dans `index.html`, `sw.js` et `app.js` (`VERSION`) :
le `.htaccess` racine sert CSS et JS « immutable » un an.
