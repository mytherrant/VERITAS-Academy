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
Un numéro en conflit (même compte sur deux appareils, tranche d'un autre compte restée sur le
téléphone) ne fait **jamais** refuser le versement : le serveur lui donne le numéro suivant et le note
(« reçu renuméroté ») — l'argent a été reçu, il ne doit pas disparaître (0.13.3).

**Justificatifs :** photo compressée sur le téléphone (JPEG ≤ 1 280 px), gardée en IndexedDB jusqu'à
l'envoi (`justificatif/deposer`), stockée dans `api/data/justificatifs/` (verrouillé, gitignoré),
servie aux seuls comptes qui voient les dépenses du centre.

**Enseignants :** le centre pointe l'enseignant de chaque créneau (présent, absent, remplacé) ; heures
faites, dû selon le contrat (heure, séance, forfait avec retenue), paies (annulables, jamais
modifiées) comptées en charges dans le bilan. L'enseignant voit SES heures, SON contrat, SES paies.

**Espace Équipe (partenaires) :** réservé à qui voit la caisse (responsable, actionnaire, secrétaire,
admin) — pas aux enseignants. Discussion du centre et commentaires attachés à une dépense, une
remise, un point du jour, un bilan, une tâche ou une réunion (table `g_messages`, un « fil » par
sujet ; l'auteur, posé par le serveur, est seul à pouvoir corriger ou supprimer). Réunions à dates
proposées (`g_sondages`) : chacun répond Oui / Peut-être / Non (`g_dispos`, une réponse par
personne, la sienne seulement) ; la date retenue part dans l'agenda. Tâches réparties (`g_taches`) :
assignée à un partenaire, échéance, À faire → En cours → Fait. La cloche signale les nouveaux
messages (non-lus par fil, sur le téléphone), les réunions sans réponse et les tâches proches ou
en retard.

**Paie des enseignants après le cours :** sans contrat particulier, un enseignant est payé
**1 500 F de l'heure** (`G_TAUX_HORAIRE_DEFAUT` / `TAUX_HORAIRE_DEFAUT`). Dès le cours fini (départ
pointé ou heure de fin passée), le partenaire présent qui a encaissé touche « Payer » dans
Appel › Enseignants du jour : une paie rattachée au pointage (`g_paies.presence_id`), une seule par
cours, jamais plus que durée faite × taux (à la séance : le taux ; au forfait : paie du mois). Elle
sort de sa caisse (« dépenses et paies » dans Remises), figure dans Caisse › Dépenses, le point du
jour et le bilan, et l'enseignant la voit dans « Mes heures ». La paie du mois reste au responsable.

**Cahier de textes :** saisi dans la feuille d'appel de chaque séance (« Ce qui a été fait »,
« Travail donné » → `g_seances.contenu` / `travail`), relu dans Plus › Cahier de textes : par centre et
par classe, du plus récent au plus ancien, avec l'horaire, la matière et l'enseignant du jour ; exports
PDF (texte jamais coupé), Excel, WhatsApp. L'enseignant ne voit que ses classes. Vue « Par enseignant » : la
progression d'un enseignant (ses cours du jour, ses remplacements, les séances qu'il a ouvertes) et
« À reprendre » (dernier cours, dernier travail donné) pour la continuité.

**Appel par les enseignants :** un enseignant fait l'appel de toute classe de son centre (ses cours en
tête de liste), même sans emploi du temps rempli, dans la même limite de 2 jours que les autres.

**Création d'un compte :** l'identifiant se déduit du nom (« ESSOMBA Paul » → `paul.essomba`, unique,
`g_identifiant_libre`) ; on peut le choisir soi-même (« Choisir l'identifiant moi-même »).

**Repartir de zéro (début des comptes) :** `g_centres.debut_comptes` (AAAA-MM-JJ, admin). Ce qui a été
encaissé, dépensé, payé ou remis avant cette date ne compte plus pour les partenaires : caisse « chez vous »,
remises au trésorier, bilan, clôture et partage, rapport du trésorier. Les versements d'avant restent
enregistrés et servent seulement à calculer ce que chaque élève doit encore (reliquats, insolvables). Le serveur
refuse toute écriture datée d'avant (sauf l'admin qui corrige) et toute clôture d'un mois d'avant. Réglage :
Bilan › mois passé › « Retirer <mois> des comptes », ou fiche du centre › « Début des comptes » (vide = tout compte).

**Versements saisis en retard :** Bilan › mois en cours › « Versements saisis en retard ? » (admin). Les
versements du mois sont cochés, groupés par jour ; on décoche ceux vraiment encaissés ce mois-ci, puis on les
rattache au dernier jour du mois passé (date modifiable). Le serveur n'accepte ce changement que de l'admin et
pour la seule date : montant, reçu, élève et encaisseur restent les mêmes. La feuille a une recherche par nom et
rappelle « Restent en <mois> » (aussi dans la confirmation). Un versement rattaché par erreur se corrige depuis son
reçu (Caisse ou fiche de l'élève) : « Changer la date » (admin).

**Détail des sorties (Bilan) :** sous les totaux de chaque centre, la liste des paies et des dépenses du mois,
avec qui les a saisies. Une dépense touchée s'ouvre : valider, refuser (en attente) ou, pour l'admin seul,
**annuler une dépense validée** (doublon, erreur) avec un motif ; le serveur n'accepte que statut « refusée » +
motif. Une paie s'annule avec « Annuler cette paie » (qui gère les enseignants).

**Pièces de caisse des sorties :** reçu de paie d'un enseignant (« Reçu de paiement · enseignant », réf. PA-…)
et bon de sortie d'une dépense (« Bon de sortie de caisse », réf. DE-…), avec la somme en lettres, qui a payé ou
saisi, qui a validé, et deux cadres de signature (le bénéficiaire, la Direction). « ANNULÉ » ou « À VALIDER » en
filigrane selon l'état. Image, PDF, WhatsApp. Le reçu s'ouvre tout seul après « Payer » (cours) ou la paie du mois ;
le bouton « Reçu » est sur chaque paie (Caisse, Bilan, fiche enseignant), « Bon de sortie » sur chaque dépense.
L'enseignant voit « Mes paies » et leurs reçus dans « Mes heures ». La catégorie de dépense « Salaires » est réservée
à qui gère les enseignants (serveur et formulaire) : sinon la paie passe par « Payer », plafonnée et sans doublon.

**Justificatif et validation :** à partir de 10 000 F, une dépense ne se valide qu'avec la photo du justificatif,
sauf par l'**administrateur**, après confirmation (« Valider sans justificatif »), son nom restant comme valideur.
Si la photo n'arrive pas au serveur (erreur réseau ou serveur), la fiche de la dépense le dit sur le téléphone qui l'a prise.

**Centres indépendants :** un compte (hors administrateur) n'a accès qu'à **un seul centre** ; le serveur
refuse le reste (`comptes/enregistrer`, 422). Une personne présente dans les deux centres a deux comptes
(identifiants différents : le second reçoit le suffixe du centre, ex. `paul.essomba.ndogpassi2`). La fiche
d'un compte propose « Son compte pour <autre centre> », pré-rempli. Les anciens comptes à deux centres
portent le badge « 2 centres : à séparer » et ne gardent que le centre choisi au prochain enregistrement.

**Rapports (Plus › Rapports, ou depuis Caisse › Impayés et le Bilan) :** pour qui voit la caisse.
Insolvables (classe, échéances impayées, montant dû, téléphone, sous-totaux), paiements par mois et
par classe (cases du cahier : ce qui couvre chaque échéance, payé, doit), rapport du trésorier pour un
mois (par partenaire : encaissé, dépenses et paies, remis reçu, à confirmer, pas reçu, non versé ;
fonds chez le trésorier ; détail des remises). Exports : PDF A4 (paysage pour les tableaux larges,
paginé entre deux lignes), Excel (CSV « ; » avec BOM), image, texte WhatsApp.

**Cycle mensuel et clôture :** chaque mois est un cycle. Les compteurs des partenaires (encaissé,
dépenses et paies, remis, à remettre) et les fonds du centre portent sur le mois en cours. Le 30 ou
le 31, un responsable ou l'admin clôture le mois dans le Bilan (`g_clotures`, id
`clo-<centre>-<AAAA-MM>`) : le serveur recalcule recettes, dépenses validées, paies et résultat, et
la part de chaque actionnaire ; les comptes partent par WhatsApp. Le mois est alors verrouillé : plus
aucun versement, dépense, paie ou remise ne peut y être daté ou modifié (seule exception : le
trésorier tranche encore une remise). Seul l'admin rouvre un mois. Rappels : agenda (dernier jour)
et cloche (veille de fin de mois, mois précédent non clôturé).

**Remises au trésorier :** chaque centre a un trésorier (fiche du centre, choisi par l'admin parmi
les comptes du centre). Tout partenaire qui encaisse (responsable, secrétaire, et désormais
actionnaire, selon ses jours au centre et sa proximité avec les parents) envoie le reçu puis
remet l'argent au trésorier avant la fin du mois (table `g_remises`). En main = encaissements −
dépenses saisies − remises. Seul le trésorier du centre (ou l'admin) confirme « Reçu » ou
conteste « Pas reçu » (motif obligatoire) ; jamais l'auteur ; une remise tranchée est figée.
Le bilan montre les fonds chez le trésorier et ceux encore chez les partenaires.

**Agenda :** rendez-vous, rencontres, réunions de parents (table `g_evenements`, droit `agenda.gerer` :
responsable, actionnaire, secrétaire ; tout le centre les voit). Le téléphone y ajoute ce qu'il déduit :
l'échéance des mensualités (jour d'échéance du centre, mois facturés), la rentrée et la fin d'année.
La cloche de l'en-tête rassemble ce qui demande attention (rendez-vous du jour et du lendemain,
échéance à 3 jours, dépenses à valider, appels en retard, alertes d'assiduité). Rappels du
téléphone (Notification API) quand l'appli est ouverte ; pour un rappel sûr appli fermée,
« Ajouter au calendrier du téléphone » exporte un .ics avec alarme.

**Migration automatique :** une table ou une colonne ajoutée à `_schema.php` est créée au premier
appel de l'API après le déploiement (`g_schema_a_jour`, empreinte dans `api/data/.schema`) ;
plus besoin de relancer `install.php` pour cela.

**Rôles :** admin global (les deux centres) · responsable · actionnaire (partenaire : inscrit,
encaisse, crée les comptes enseignants, fixe leur contrat et les paie, saisit les dépenses, suit
les chiffres ; ni appel, ni tarifs, ni remises, ni validation) · secrétaire/surveillant · enseignant.
Voir `g_capacites()`. Chacun ne voit que son rôle (« Mon rôle ») ; l'admin les voit tous.

## Mise en service (une fois)

1. **Sous-domaine** — panneau LWS › Domaines › Sous-domaines : créer `gestion.veritas-school.com`
   LWS le fait pointer vers un dossier du **même nom**, `gestion.veritas-school.com/`, à la
   racine (à côté de `api/`) : c'est là que la CI dépose les fichiers ;
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

**Administration** : invisible. L'admin la fait apparaître par un **appui long de 2 s sur le
logo** (en haut à gauche) ; elle se referme seule au bout de 15 min, par le même appui long ou
par « Refermer l'administration ». Tant qu'elle est fermée, aucune tuile ni aucun lien ne la
signale. L'admin y règle, compte par compte, les droits retirés à
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

La route publique `?r=version` donne la version en ligne : un téléphone en retard (APK, copie en cache) affiche « Version X disponible » à la connexion et sur l'accueil.

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
node tests/banc_gestion_agenda.cjs <dossier>     # agenda, échéances, .ics, cloche, droits par rôle (Playwright)
node tests/banc_gestion_remises.cjs <dossier>    # remises au trésorier : confirmation, contestation, refus serveur (Playwright)
node tests/banc_gestion_paie_cours.cjs <dossier> # paie de l'enseignant après le cours : 1 500 F/h, unicité, plafond (Playwright)
node tests/banc_gestion_equipe.cjs <dossier>     # Équipe : discussion, commentaires, réunions, tâches, refus serveur (Playwright)
node tests/banc_gestion_connexion.cjs <dossier>  # connexion : aide après échec, œil, identifiant toléré, version en retard (Playwright)
node tests/banc_gestion_partenaire.cjs <dossier> # actionnaire : inscrit, encaisse, crée et paie un enseignant ; ne voit que son rôle (Playwright)
node tests/banc_gestion_cloture.cjs <dossier>    # clôture du mois : comptes du serveur, partage, verrou, droits (Playwright)
node tests/banc_gestion_rapports.cjs <dossier>   # rapports : insolvables, paiements par classe, trésorier, exports (Playwright)
node tests/banc_gestion_cahier.cjs <dossier>     # cahier de textes : saisie, serveur, relecture par classe, exports (Playwright)
node tests/banc_gestion_debut_comptes.cjs <dossier> # repartir de zéro : mois retiré des comptes, dettes des élèves gardées (Playwright)
node tests/banc_gestion_redater.cjs <dossier>    # versements saisis en retard rattachés au mois passé (Playwright)
node tests/banc_gestion_detail_sorties.cjs <dossier> # Bilan : détail des sorties, annulation d'une dépense validée par l'admin (Playwright)
node tests/banc_gestion_recus_sorties.cjs <dossier> # reçu de paie, bon de sortie, « Mes paies », « Salaires » réservé (Playwright)
node tests/banc_gestion_centres.cjs <dossier>    # centres indépendants : un compte = un centre, compte séparé pour l'autre (Playwright)
```

**Noms fictifs uniquement** dans le code et les bancs : le dépôt est public, les élèves sont mineurs.

**Chaque livraison change la version** dans `index.html`, `sw.js` et `app.js` (`VERSION`) :
le `.htaccess` racine sert CSS et JS « immutable » un an.
