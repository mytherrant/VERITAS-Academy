# VÉRITAS Gestion — gestion.veritas-school.com

Application des centres de répétition (Ndog-passi III, Ndog-passi II, et ceux qu'on ouvrira) :
rôles par centre, emploi du temps et jours/horaires, inscriptions, appel et assiduité, feuille du jour (image/PDF) et messages aux parents, caisse et bilan, enseignants (heures, paie) : les six étapes.

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

**Appel :** une feuille par classe et par jour (id déterministe « sa » + date + classe), un pointage
par élève (id déterministe). Le serveur recalcule le retard (arrivée − début, tolérance du centre),
refuse un jour à venir, limite l'enseignant à ses classes du jour, et verrouille l'appel après
2 jours (sauf responsable/admin ; une absence reste justifiable).

**Feuille du jour :** dessinée sur un canvas (Poppins, logo, filigrane de la classe) → PNG d'un seul
tenant pour WhatsApp, ou PDF A4 écrit à la main (JPEG par page, DCTDecode) : aucune bibliothèque,
marche hors ligne. Partage natif du téléphone (navigator.share), sinon téléchargement.

**Finances :** l'échéancier se calcule sur le téléphone (inscription, puis une mensualité par mois
facturé dès le mois d'inscription, échue le N du mois ; versements imputés du plus ancien au plus
récent). Le serveur garde les règles d'argent : numéro de reçu séquentiel par centre, versement
jamais modifié ni supprimé (annulation motivée par un responsable), remise réservée au responsable,
tarifs des classes fixés par le responsable, dépense validée par un autre que son auteur.

**Reçus hors ligne :** chaque téléphone réserve en ligne des tranches de 20 numéros (`recus/tranche`) ;
hors ligne, le reçu prend le suivant de sa tranche, définitif. Le serveur vérifie la propriété et
l'unicité ; sa propre numérotation saute les tranches réservées.

**Justificatifs :** photo compressée sur le téléphone (JPEG ≤ 1 280 px), gardée en IndexedDB jusqu'à
l'envoi (`justificatif/deposer`), stockée dans `api/data/justificatifs/` (verrouillé, gitignoré),
servie aux seuls comptes qui voient les dépenses du centre.

**Enseignants :** le centre pointe l'enseignant de chaque créneau (présent, absent, remplacé) ; heures
faites, dû selon le contrat (heure, séance, forfait avec retenue), paies (annulables, jamais
modifiées) comptées en charges dans le bilan. L'enseignant voit SES heures, SON contrat, SES paies.

**Rôles :** admin global (les deux centres) · responsable · actionnaire (consultation des
finances + emploi du temps) · secrétaire/surveillant · enseignant. Voir `g_capacites()`.

## Mise en service (une fois)

1. **Sous-domaine** — panneau LWS › Domaines › Sous-domaines : créer `gestion.veritas-school.com`
   pointant vers le dossier **`gestion`** de l'hébergement (là où la CI dépose les fichiers),
   puis activer le certificat SSL du sous-domaine.
2. **Jeton d'installation** — ajouter dans `api/payment_config.php` (sur le serveur, gitignoré) :
   `define('G_INSTALL_TOKEN', '<64 caractères aléatoires>');`
   Jeton **dédié** (celui de Campus n'est plus accepté : sa fuite ouvrirait la comptabilité
   des centres). `MYSQL_PASS` y est déjà.
3. **Déployer** la branche (voir la procédure du dépôt).
4. Ouvrir `https://gestion.veritas-school.com` : l'écran d'installation demande le jeton,
   crée les tables, les deux centres d'après les affiches 2026-2027 (adresses, téléphones,
   classes, jours et horaires — dont ceux des 3e à Germinal), l'année 2026-2027 (rentrée le
   16 septembre, septembre gratuit), les matières, et le compte administrateur.
5. Créer les comptes (Comptes et accès) et transmettre les identifiants par WhatsApp.

Une fois l'administrateur créé, l'installation ne peut plus en créer un autre (409). Pour
le recréer (mot de passe perdu), déposer par FTP un fichier vide `gestion/api/data/.install_ouverte`,
refaire l'étape 4, puis **supprimer ce fichier**. Cinq jetons faux en 15 min bloquent l'IP.

**Panneau d'administration** : caché. L'admin tape **4 fois sur le logo** (en haut à gauche) ;
il se referme seul au bout de 15 min. Il y règle, compte par compte, les droits retirés à
chaque partenaire (le serveur les applique : un droit retiré est refusé même par l'API).

Réinstaller est sans risque : `install.php` est idempotent et ajoute seulement ce qui manque
(tables, colonnes, index).

## Application Android (APK pour les partenaires)

Projet Capacitor hors dépôt : `Documentseritas-gestion-app` (appId `cm.veritas.gestion`).
La coquille (HTML, CSS, JS, polices) est **embarquée** dans l'APK : l'appli s'ouvre sans réseau,
et seules les données passent par `https://gestion.veritas-school.com/api/` (adresse posée
par `www/config.js`, origine `https://localhost` admise par le CORS de `_boot.php`).
Partage des reçus et feuilles : modules natifs `@capacitor/share` + `@capacitor/filesystem`
(la WebView d'Android ne sait ni partager ni télécharger un Blob).

```bash
node preparer-www.cjs <dépôt>/gestion        # recopie la coquille du dépôt dans www/
npx cap sync android
cd android && gradlew assembleDebug          # JAVA_HOME = JDK d'Android Studio (jbr)
```

Une nouvelle version de `app.js` ne parvient à l'APK qu'en la **reconstruisant** (le web,
lui, se met à jour seul) : garder l'API compatible avec les APK déjà distribuées.

## Développement local

```bash
# gestion/api/_config.php (gitignoré) : define('G_DB_DRIVER','sqlite'); define('G_INSTALL_TOKEN','…');
php -d extension=pdo_sqlite -S 127.0.0.1:8000 -t gestion
python tests/banc_gestion_api.py                 # isolement des centres, rôles, règles, synchro
node tests/banc_gestion_versions.cjs             # ?v= identique partout
node tests/banc_gestion_horsligne.cjs <dossier>  # vrai hors ligne (Playwright)
node tests/banc_gestion_emploi.cjs <dossier>     # emploi du temps (Playwright)
node tests/banc_gestion_eleves.cjs <dossier>     # inscriptions, homonymes, import, horaires (Playwright)
node tests/banc_gestion_appel.cjs <dossier>      # appel, retards, clôture, alertes, hors ligne (Playwright)
node tests/banc_gestion_exports.cjs <dossier>    # feuille PNG/PDF (structure vérifiée), messages WhatsApp/SMS (Playwright)
node tests/banc_gestion_caisse.cjs <dossier>     # échéancier, encaissement, reçu, relances, dépenses, bilan (Playwright)
node tests/banc_gestion_enseignants.cjs <dossier> # enseignants, « Mes heures », reçu hors ligne, photo de justificatif (Playwright)
```

**Noms fictifs uniquement** dans le code et les bancs : le dépôt est public, les élèves sont mineurs.

**Chaque livraison change la version** dans `index.html`, `sw.js` et `app.js` (`VERSION`) :
le `.htaccess` racine sert CSS et JS « immutable » un an.
