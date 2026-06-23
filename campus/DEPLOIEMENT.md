# VÉRITAS Campus — Déploiement (3 modes d'hébergement)

Un **seul code**, trois façons de l'héberger. On change uniquement `campus/config.js` (frontend) et `api/payment_config.php` (backend, gitignoré).

| | **1. Local** (PC du proviseur) | **2. En ligne (école)** | **3. Hébergé VÉRITAS** |
|---|---|---|---|
| Données | sur place, réseau interne | sur l'hébergement de l'école | cloud VÉRITAS (managé) |
| Établissements | 1 (mono) | 1 (mono) | plusieurs (multi-tenant) |
| Résolution école | `fixedTenant` | `fixedTenant` | sous-domaine |
| Hors-ligne | ✅ oui | non | non |
| Mises à jour / sauvegardes | l'école | l'école | **VÉRITAS** |
| Idéal pour | petites écoles, connexion faible | écoles autonomes | clé en main, réseaux |

---

## Mode 1 — Serveur LOCAL (PC du proviseur)

1. Installer un stack PHP+MySQL portable (**Laragon** ou **XAMPP**) sur le PC serveur.
2. Copier `api/` et `campus/` dans `www/` (ou `htdocs/`).
3. `api/payment_config.php` :
   ```php
   define('CAMPUS_MODE', 'local');
   define('CAMPUS_FIXED_TENANT', 'mon-ecole');   // slug de l'établissement
   define('CAMPUS_DB_HOST', '127.0.0.1');
   define('MYSQL_PASS', '<mdp local>');
   define('CAMPUS_INSTALL_TOKEN', '<openssl rand -hex 32>');
   ```
4. `campus/config.js` : `mode:'local'`, `apiBase:'http://192.168.1.10'` (IP du PC sur le réseau), `fixedTenant:'mon-ecole'`.
5. Installer : `migrate.php?action=install&token=…`, `seed_admin`, créer le tenant `mon-ecole`.
6. Les autres postes (salle des profs, secrétariat) accèdent via `http://192.168.1.10/campus/login.html`.

## Mode 2 — Serveur EN LIGNE de l'établissement

1. Hébergement mutualisé (cPanel/LWS) ou VPS avec PHP 8 + MySQL.
2. Déposer `api/` et `campus/` ; créer la base ; importer via `migrate.php`.
3. `payment_config.php` : `CAMPUS_MODE='self'`, `CAMPUS_FIXED_TENANT='mon-ecole'`, creds MySQL de l'hébergeur.
4. `config.js` : `mode:'self'`, `apiBase:''` (même domaine), `fixedTenant:'mon-ecole'`.
5. HTTPS (Let's Encrypt). L'école garde et sauvegarde ses données.

## Mode 3 — Hébergé par VÉRITAS Campus (SaaS managé)

1. Multi-tenant déjà en place : `CAMPUS_MODE='managed'`, `CAMPUS_FIXED_TENANT=''`.
2. Chaque école = un **sous-domaine** `ecole.veritas-campus.com` (résolu automatiquement).
3. Provisioning d'une école : `POST /platform/tenants` (console éditeur) → tenant + admin + marque + structure académique.
4. `config.js` par défaut (`mode:'managed'`, `apiBase:''`). Mises à jour, sauvegardes, supervision : **VÉRITAS**.

---

## Interconnexion (commune aux 3 modes)
`config.js` (frontend) ↔ `_config.php`/`_tenant.php` (backend) partagent **le même `mode` + `fixedTenant`** : le frontend envoie l'en-tête `X-Tenant`, le backend l'impose en mono-établissement → toutes les pages (login, dashboard, notes, documents…) et tous les modules fonctionnent à l'identique, quel que soit l'hébergement. Les **profils/rôles** et leurs **accès restreints** sont identiques partout.
