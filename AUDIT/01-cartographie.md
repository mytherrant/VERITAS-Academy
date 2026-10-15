# 01 — Cartographie de VÉRITAS (lecture seule)

> Audit du 15/10/2026, fait sur **`origin/master` @ 4255317** : c'est la version en production (la sonde de prod répond `provider: "skysms"`, comme ce commit).
> ⚠️ Votre dossier de travail est sur `paiements-skysms` @ 831fb62, **en retard de 11 commits** sur `origin/master`. Ses fichiers non commités diffèrent de la prod sur 4 fichiers PHP (`_notify_lib`, `_skysms_lib`, `livret`, `payment_camerpay` : 288 lignes). L'audit porte sur la prod, pas sur ce dossier.

## 1. Stack réelle

| Couche | Ce qui tourne | Écart avec la mission |
|---|---|---|
| Hébergement | **LWS mutualisé** (LiteSpeed, PHP 8.x), domaine `veritas-school.com` | La mission parle d'un **VPS** : il n'y en a pas. Vous n'avez ni SSH, ni pare-feu, ni crontab, ni systemd. Les points « serveur VPS » de la phase 3 dépendent donc de LWS. |
| Backend | **PHP nu**, sans framework ni Composer : 45 fichiers `api/*.php` + `api/campus/` (SaaS, PDO MySQL) | — |
| Données | **Fichier JSON unique** `data/veritas_db.json`, écrit sous `flock`, plus des fichiers d'état par paiement dans `api/data/payments/`. MySQL ne sert que de **miroir** (`db_sql.php`), de campus et de cache IA. | Il n'y a pas de « dump de base » au sens SQL : il faut une copie FTP de `data/` et `api/data/`. |
| Frontend | `VERITAS_v1.2.html` (coquille, servie comme `app.html`) + `app.js` (~3,4 Mo, ~44 000 lignes) + `app.css`, pages statiques `livrets/*.html` + `livrets/gate.js`, vitrine `assets/vitrine.js`, Atelier `plateforme/` | — |
| Process | Aucun. Pas de file d'attente ni de tâche planifiée : tout s'exécute **pendant une requête HTTP**. | Il n'existe **aucune tâche de réconciliation automatique** (voir 02). |
| Déploiement | `.github/workflows/deploy.yml` : un **push sur `master`** déclenche le **FTP vers la prod**, sans préproduction. Garde-fous CI : `php -l`, `node --check`, une vingtaine de bancs. | Le « push en prod » est un simple `git push origin master` : c'est l'action à ne pas faire sans votre accord. |
| Secrets | `api/payment_config.php` et `api/config.php` (ignorés par git ; vérifié avec `git check-ignore`), posés sur le serveur par FTP. **Pas de `.env`.** | La règle « secrets dans `.env` » est respectée **dans l'esprit** : aucun secret n'est suivi par git (vérifié avec `git ls-files`). |

## 2. Endpoints (routes)

### Paiement et abonnements
| Fichier | Rôle | Statut |
|---|---|---|
| `api/payment_camerpay.php` (2 722 l.) | **Point d'entrée unique des 4 tunnels** (app, vitrine, cahiers, Atelier). CamerPay est résilié en dur (`camerpayResilie()`, l.2023). Il porte la **collecte SkySMS**, l'octroi, le suivi, la réconciliation et les cagnottes. | **ACTIF, SkySMS en live** |
| `api/_skysms_lib.php` | Client HTTP SkySMS : collecte MoMo/Orange, SMS, accusés de réception, page de paiement | **ACTIF** |
| `api/payment_manuel.php` + `_manuel_lib.php` | Paiement par **code marchand** (MTN 02681266 / Orange 999471) : déclaration publique, validation par l'admin | ACTIF (repli) |
| `api/payment_sms.php` + `_rapprochement_lib.php` | Relais SMS du téléphone marchand : rapprochement automatique des codes marchands | Actif si `SMS_WEBHOOK_SECRET` est posé |
| `api/payment_mtn.php`, `payment_orange.php` | Anciennes intégrations directes MTN et Orange (OAuth + webhook `notif_token`) | Code présent ; non branché aux tunnels actuels |
| `api/payment_campay.php` | Ancien fournisseur CamPay | Code présent, inactif |
| `api/_auth_lib.php` | **Octroi** (`vrt_grant_entitlement*`), **contrôle de prix** (`vrt_verifier_prix`), comptes, commissions vérifiées | Cœur |
| `api/_parrainage_lib.php`, `parrainage.php` | Code ami et commissions | ACTIF |
| `api/_pay_funds_lib.php` | Cagnottes de scolarité | ACTIF |
| `api/_notify_lib.php` | File de remise des codes (SMS SkySMS, WhatsApp, e-mail) | ACTIF |

### Actions de `payment_camerpay.php` liées à SkySMS
| Action | Auth | Rôle |
|---|---|---|
| `GET/POST ?action=config` | publique | Sonde : renvoie `provider`, `publicInitToken` (public par construction) |
| `POST ?action=init` | jeton public ou admin, origine contrôlée, débit par IP + quota/jour | Crée l'état `pending` et renvoie `pay_url` |
| `GET ?action=payer&ref=` | **aucune** | Page HTML de paiement (saisie du numéro, suivi) |
| `POST ?action=skysms_collect` | **aucune** (bornée : 6 demandes par réf., 30 s d'écart, débit par IP) | Pousse la demande sur le téléphone |
| `GET/POST ?action=skysms_notify&cle=` | **clé secrète dans l'URL** | Rappel SkySMS : seul chemin automatique vers `paid` |
| `POST ?action=skysms_confirmer` | admin | Validation manuelle |
| `?action=skysms_dlr&cle=` | clé dans l'URL | Accusés de réception des SMS |
| `GET ?action=status&ref=` | **aucune** | Suivi du paiement (champs limités) |
| `GET ?action=list` | admin | Liste + « réconciliation » des paiements en attente |
| `skysms_suivi`, `skysms_diag`, `skysms_test_sms`, `skysms_sms_*` | admin | Supervision |

### Autres endpoints
- **Comptes / auth** : `compte.php`, `student_data.php`, `teacher_access.php` (limitation du débit présente), `db.php` / `sync.php` / `config_sync.php` (synchro de la base, Bearer admin), `db_sql.php` (miroir MySQL).
- **Contenu payant** : `livret.php` + `_livret_lib.php` (cahiers, codes d'accès), `secure_pdf.php` / `secure_epub.php` (pages servies en images), `content.php`, `cahier.php`, `files.php`, `uploads/protected/` (403 en prod, vérifié).
- **IA** : `ia_proxy.php` (clé côté serveur, plafond de dépense), `rag.php`, `admin_validate.php`.
- **Divers** : `upload*.php` (extension + MIME via `finfo`), `public_data.php`, `news_proxy.php`, `stats.php`, `challenge.php`, `collab.php`, `demandes.php`, `plateforme.php` (Atelier), `_sentinel.php` (anti-robots).
- **Campus** : `api/campus/index.php` + `_routes_*.php` (PDO MySQL, multi-tenant).

## 3. Tâches planifiées et webhooks
- **Tâches planifiées : aucune** (`grep cron` ne trouve rien). La « réconciliation » ne tourne que lorsqu'un admin ouvre la liste des paiements (`?action=list`).
- **Webhooks entrants** : `skysms_notify`, `skysms_dlr` (SkySMS) ; `notify` (CamerPay, résilié) ; `payment_sms.php` (relais SMS marchand) ; `payment_mtn.php` / `payment_orange.php` `notify` (anciens).

## 4. Documentation SkySoft disponible
- **Lue sur place** : commentaires d'en-tête de `api/_skysms_lib.php`, `POINT_SKYSMS.md`, `MESSAGE_SKYSOFT.md`, `SMS_SKYSOFT.txt` (racine, non suivis par git) et la note de projet du 15/10.
- **Ce qui est documenté** (d'après ces notes : la doc publique `https://skysms.cm/v2/api-docs` et le PDF SMS V2023) :
  - collecte : `GET /api/public/collecte_momo/v2/output=json?uid&amount&phone&id_client` ;
  - rappel officiel (communiqué par SKYSOFT le 15/10) : `id_operation, id_operateur, id_client, statut` (1 réussi, 0 échec, -1 en attente).
- **Ce qui MANQUE**, et que je ne devine pas :
  1. **aucun mode sandbox / test** documenté ;
  2. **aucune route publique de statut** d'une collecte (re-vérification impossible) ;
  3. **aucune signature** du rappel, aucune liste d'IP d'origine ;
  4. **ni montant ni numéro dans le rappel officiel** ;
  5. la politique de renvoi du rappel (combien de fois, sur quels codes HTTP) et la réponse attendue (`OK` ? `1` ?) ;
  6. le délai d'expiration d'une demande non validée.
  → Ces six points sont à demander à SKYSOFT (voir 02, § Questions).

## 5. Tests existants (référence, tous verts sur `origin/master`)
`paiements_entitlements.php` 95/95 · `banc_rapprochement_sms.php` 39/39 · `banc_identite_acheteur.php` 26/26 · `banc_livre_integre.php` 24/24 · `parrainage.php` 100/100 · `banc_octroi_bloque.php` 26/26 · `php -l` sur les 45 endpoints : 0 erreur.
**Aucun banc n'exerce les actions HTTP SkySMS** (`skysms_collect`, `skysms_notify`, `payer`).
