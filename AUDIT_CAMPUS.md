# Audit de VÉRITAS Campus — 6 août 2026

Portée : `api/campus/` (23 fichiers, ~3 600 lignes PHP) et `campus/` (7 pages,
`campus.js`, `campus.css`). Méthode : lecture du code, pas de test d'intrusion —
PHP n'est pas exécutable sur le poste de développement, le lint tourne en CI.

Verdict : **le socle est sain**. Les jetons, les mots de passe, l'isolation entre
établissements et les requêtes SQL sont correctement faits. Les défauts trouvés
sont d'un autre ordre : des portes laissées ouvertes faute de compteur, et
surtout un module **qui n'était pas déployé du tout**.

---

## 1. Ce qui bloquait tout : le module n'existait pas en production

`campus/**` et `api/campus/**` étaient absents de `deploy.yml` — ni dans les
chemins déclencheurs, ni dans la boucle de copie FTP. Le code vivait dans le
dépôt et nulle part ailleurs. C'est la **quatrième fois** que ce piège se
referme sur ce projet (cf. `feedback_ci_fichiers_non_suivis`) : les gardes
`[ -f ]` sautent en silence, et rien ne signale l'absence.

**Corrigé.** `deploy.yml` déclenche sur `campus/**`, copie les pages publiques
(`*.html`, `*.js`, `*.css` — les `.md` d'offre restent internes), copie
**l'intégralité** de `api/campus/*.php` + `schema.sql`, et **échoue** si
`api/campus/.htaccess` manque : sans ce verrou, `_auth.php` et le schéma de la
base seraient lisibles en ligne. Le lint `php -l` de la CI couvre désormais
`api/campus/*.php` (il s'arrêtait à `api/*.php`).

### Le piège du fichier de configuration gitignoré

En mettant `api/campus/_config.php` au `.gitignore` (bonne intention : il porte
les réglages propres à chaque installation), on a fait disparaître le **seul**
fichier qui définissait `CAMPUS_DB_HOST`, `CAMPUS_DB_NAME`, `CAMPUS_ROOT_DOMAIN`,
`CAMPUS_TOKEN_TTL_HOURS`, `CAMPUS_BCRYPT_COST`… Sur un serveur qui ne l'a pas
encore — c'est-à-dire au premier déploiement — `cmp_pdo()` aurait levé une
`Error` sur une constante inconnue : **500 sur tous les appels Campus**, sans
autre indice qu'un « Erreur serveur interne ».

**Corrigé.** Les valeurs par défaut vivent maintenant dans
`api/campus/_defaults.php`, suivi et déployé. `_bootstrap.php` charge
`_config.php` s'il existe (surcharges du serveur), puis `_defaults.php` qui ne
pose que ce qui manque. Même logique pour les seuils anti-force-brute, dupliqués
en repli dans `_auth.php` : une garde de sécurité qui dépend d'un fichier absent
ne garde rien.

---

## 2. Sécurité

| # | Constat | Gravité | État |
|---|---|---|---|
| 1 | Aucune limite sur `POST /auth/login` ni `POST /platform/login` : un mot de passe d'établissement se force à la vitesse du réseau. Le reste du projet (`teacher_access.php`, `db.php`) a pourtant ses compteurs. | **Élevée** | Corrigé |
| 2 | Les échecs sur le compte **éditeur** (`platform/login`) n'étaient pas journalisés. C'est le compte qui voit tous les établissements : une attaque ne laissait aucune trace. | **Élevée** | Corrigé |
| 3 | `cmp_bearer()` acceptait le jeton en paramètre d'URL (`?_token=`). Un jeton dans une URL se retrouve dans les journaux du serveur, l'historique du navigateur et l'en-tête `Referer`. | Moyenne | Corrigé |
| 4 | `verify.php` (vérification publique d'un document par QR) sans limite : robinet à moissonner des noms d'élèves. | Moyenne | Corrigé |
| 5 | `cmp_generate_password()` finissait par `str_shuffle`, qui s'appuie sur le générateur **non cryptographique** de PHP : la position des trois caractères imposés devenait devinable. | Faible | Corrigé |

**Comment le compteur de connexion fonctionne** — `cmp_login_guard()` compte les
échecs déjà consignés dans `cmp_audit_log` (aucune table à migrer). Deux
compteurs sur 15 minutes : **10 par IP** (l'attaquant qui balaie les comptes) et
**5 par e-mail** (l'attaquant distribué qui vise un compte). En cas de panne du
journal, il **laisse passer** et log l'incident : verrouiller tout un
établissement dehors parce qu'une table répond mal serait un déni de service
auto-infligé — le mot de passe reste exigé dans tous les cas.

### Ce qui était déjà correct (et qu'il ne faut pas défaire)

- **Jetons opaques** aléatoires (32 octets), stockés **hachés** en SHA-256,
  révocables, expirant (12 h), liés au couple `scope` + `tenant_id`. Pas de JWT
  auto-signé : ni confusion d'algorithme, ni secret de signature à protéger.
- **bcrypt cost 12** pour les mots de passe.
- **Zéro injection SQL.** Toutes les requêtes passent par PDO préparé,
  `ATTR_EMULATE_PREPARES => false`. Les rares SQL assemblés le sont à partir
  d'allow-lists de noms de colonnes (`tenant/branding`, `academics/sections`)
  ou de placeholders générés (`IN (?,?,?)`) ; deux endroits interpolent un
  entier déjà casté (`WHERE id = ' . $tid`) — sûr, mais à uniformiser.
- **Isolation des établissements fail-closed** : slug normalisé `[a-z0-9-]`,
  absent → 400, inconnu → 404, suspendu → 403 ; `cmp_require_auth()` vérifie que
  le jeton appartient bien au tenant visé.
- **Portail élève/parent strictement borné** au `student_id` rattaché au
  compte, et les notes non publiées (`status = 'draft'`) restent invisibles.
- **CORS en allow-list** + sous-domaines de la racine seulement.
- `display_errors` à 0, gestionnaire d'exception qui renvoie un JSON générique :
  aucune trace d'exécution ne fuit.
- `migrate.php` **verrouillé** par `CAMPUS_INSTALL_TOKEN` comparé en
  `hash_equals`, et fail-closed si le jeton n'est pas posé côté serveur.
- Rôles et capacités calqués sur l'organigramme réel d'un établissement
  camerounais (proviseur, censeur, préfet des études, surveillant général,
  intendant, économe…), la source de vérité du rôle étant la table `cmp_users`,
  jamais le jeton.

---

## 3. Défauts fonctionnels

**« Créer mon école » ne pouvait pas fonctionner.** La page de connexion Campus
proposait `onboarding.html`, qui appelle `POST /platform/tenants` — une route
réservée à l'éditeur. Un chef d'établissement y récoltait un 401 sans
explication. Le lien mène maintenant à la demande d'ouverture
(`veritas-school.com/?demande=campus`), et `onboarding.html` annonce en clair
qu'il est réservé à l'équipe VÉRITAS.

**121 émojis système dans l'interface de direction.** Le rendu changeait d'un
poste à l'autre (Windows 7 d'un secrétariat ≠ téléphone du proviseur), et le
registre visuel n'était pas celui d'un logiciel de gestion. Remplacés par les
pictogrammes VÉRITAS, avec un sprite **embarqué page par page** : `campus/` doit
pouvoir tourner sur le serveur d'une école ou un poste hors ligne, sans
dépendre de `/assets/`. Dix pictogrammes manquants ont été dessinés
(`i-bus`, `i-bed`, `i-utensils`, `i-badge`, `i-credit-card`, `i-receipt`,
`i-first-aid`, `i-briefcase`, `i-coins`, `i-phone`) et ajoutés au jeu commun,
qui passe de 64 à 74.

**Les demandes venues du site n'arrivaient nulle part.** Défaut hors Campus mais
découvert en le branchant : les candidatures partenaires étaient rangées dans
`DB.partnerApplications`, or `save()` ne pousse vers le serveur que pour une
session admin ou enseignant. Une demande déposée par un visiteur restait dans
**son** navigateur — l'écran affichait « demande reçue » pendant que personne ne
la recevait. `api/demandes.php` écrit désormais côté serveur.

---

## 4. Reste à faire — hors code

1. Poser dans `api/payment_config.php` (gitignoré) : `MYSQL_PASS` (déjà là) et
   `CAMPUS_INSTALL_TOKEN` (`openssl rand -hex 32`).
2. Créer les tables : `POST /api/campus/migrate.php?action=install&token=…`
   puis `action=seed_admin` (e-mail + mot de passe ≥ 10 caractères).
3. Décider du mode : sous-domaine `ecole.veritas-campus.com` (multi-établissement)
   ou `CAMPUS_FIXED_TENANT` (mono-établissement, sans domaine dédié).
4. Facultatif : `DEMANDES_NOTIFY_EMAIL` pour recevoir un courriel à chaque
   demande — le tableau de bord reste de toute façon la source de vérité.
5. Surveillance : le compteur anti-force-brute lit `cmp_audit_log`. Si le
   journal grossit beaucoup, prévoir une purge des lignes `login_failed` de plus
   de 30 jours (l'index `idx_audit_action` existe déjà).

## 5. Non vérifié

- Aucune exécution réelle : PHP n'est pas installé sur le poste. Le premier
  `migrate.php?action=install` sur le serveur reste le vrai test.
- Les envois WhatsApp/SMS de `_notify.php` (dépendent d'un fournisseur non
  configuré à ce jour).
- Le rendu des bulletins Campus sur des données réelles d'établissement.
