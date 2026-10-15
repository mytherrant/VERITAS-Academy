# 00 — Rapport d'audit VÉRITAS (15/10/2026)

> **Statut (15/10, soir)** : n°1 à 8 **corrigés, testés et déployés** (commit `e246ddb`, prod en 1.20.27). Preuves : [04-verification](04-verification.md). N°9 à 17 restent ouverts.

Détail : [01-cartographie](01-cartographie.md) · [02-skysoft](02-skysoft.md) · [03-global](03-global.md)

## En bref
- **SkySMS encaisse déjà en réel** (sonde de prod : `provider: skysms, mode: live`). **Il n'existe aucun sandbox SkySoft** : je n'ai lancé **aucune transaction**.
- **Aucun défaut CRITIQUE** trouvé, au sens « exploitable aujourd'hui, sans secret, pour obtenir un accès gratuit ou détourner de l'argent ». Le contrôle du prix côté serveur, l'octroi atomique et idempotent, et le refus des commissions forgées tiennent : les bancs sont verts.
- **4 défauts HAUTS**, tous dans le flux SkySMS. Le plus important : **un rappel SkySMS n'est authentifié que par la clé dans l'URL**. Montant, numéro et `id_operation` ne sont jamais recoupés en pratique.
- L'hébergement est **LWS mutualisé, pas un VPS**. Une partie de la phase 3 (pare-feu, crontab, certificat) dépend donc de LWS, pas de nous.

## Tableau des défauts

| # | Gravité | Zone | Problème | Fichier:ligne | Correctif proposé |
|---|---|---|---|---|---|
| 1 | **HAUTE** | SkySMS rappel | La clé dans l'URL est le **seul** contrôle : le rappel officiel ne porte ni montant ni numéro, et `id_operation` (connu de nous seuls par la réponse de collecte) **n'est pas comparé**. Une clé qui fuit (journaux LWS, côté SKYSOFT) suffit à valider n'importe quel paiement en attente. | `payment_camerpay.php:1038-1052`, `:2113-2129` | Si l'état connaît un `id_operation` et que le rappel en porte un autre, **refuser** (409 + `a_regler`). Si l'état n'en connaît aucun (collecte coupée), garder la validation par clé et marquer `montant_verifie=false` pour l'admin. Rendre `id_client` imprévisible (n° 2). |
| 2 | **HAUTE** | SkySMS collecte | `id_client` = date + 3 chiffres : **devinable**. C'est lui qui relie le rappel à la commande. | `_skysms_lib.php:88-90` | 9 chiffres aléatoires `random_int` (le format numérique reste celui de l'exemple SkySMS). |
| 3 | **HAUTE** | Init (4 tunnels) | Une référence déjà connue renvoie l'état existant **sans vérifier que c'est le même achat**. Le tunnel « acheter un manuel » fabrique `BOOK-` + 5 chiffres, sans date : avec le temps, un acheteur tombe sur la commande d'un autre (libellé, montant, numéro prérempli). | `payment_camerpay.php:639-652` ; `app.js:12439` | Serveur : si `intent`, `targetId` ou `montant` diffèrent → **409 « référence déjà utilisée »**. Client : `confirmerAchat` passe à `_payRef('BOOK')`. |
| 4 | **HAUTE** | Page de paiement | `?action=payer&ref=` est public : n'importe qui ayant la référence voit **le numéro du client en clair**, et la page **déclenche seule une demande de paiement** sur ce téléphone. Les références sont courtes et `payer` / `status` n'ont aucune limite de débit. | `payment_camerpay.php:926-943` ; `_skysms_lib.php:312-314, 333` | Ajouter à `pay_url` un **jeton aléatoire** (`&t=`), stocké dans l'état et exigé par `payer` et `skysms_collect`. Afficher le numéro **masqué** (`6•• •• •7 39`). |
| 5 | MOYENNE | SkySMS états | Le fichier d'état n'est **pas verrouillé** : un rappel `paid` arrivé pendant la fin de `skysms_collect` peut être écrasé par `pending`. Deux rappels simultanés lisent tous deux `pending` (la base reste juste, mais les SMS peuvent partir en double). | `payment_camerpay.php:984-1013`, `:1017-1055` | Verrou `flock` par référence autour de chaque lecture-modification-écriture (collecte, rappel, confirmation admin). |
| 6 | MOYENNE | SkySMS rappel | La réponse au rappel attend l'octroi complet : copie de la base de plusieurs Mo, puis **jusqu'à 3 SMS de 20 s chacun**. Risque de délai dépassé chez SKYSOFT, donc de rappels renvoyés. | `payment_camerpay.php:1051` → `_auth_lib.php` (`vrt_notify_vider(3)`) | Écrire `paid`, **répondre**, puis octroyer (`litespeed_finish_request()` / `fastcgi_finish_request()` s'ils existent), sinon ramener le budget SMS à 0 dans le rappel (la file part au prochain passage). |
| 7 | MOYENNE | SkySMS états / UX | Un paiement SkySMS en attente **ne se clôt jamais**, aucune tâche ne le reprend, et la page attend sans fin : si le rappel se perd, le client a payé sans le savoir confirmé. | `payment_camerpay.php:1358-1366` ; `_skysms_lib.php:345-352` | (a) Au bout de 3 min sans verdict, la page affiche « Pas de confirmation ? Envoyez la référence sur WhatsApp ». (b) Les lignes SkySMS en attente depuis plus de 24 h passent en « à vérifier » (`a_regler`) dans l'admin, **sans être closes** : on ne peut pas savoir si elles ont été payées. |
| 8 | MOYENNE | Journaux | **Numéros clients en clair** dans le journal des paiements (contraire à votre règle 3). | `payment_camerpay.php:992-993`, `:1046`, `:2070` | Masquer les numéros (`6XXXXXX39`) avant écriture : champs `telephone`, `phone`, `tel`, `numero`. |
| 9 | MOYENNE | SkySMS collecte | SkySMS garde la connexion ouverte jusqu'à 75 s. Si LWS coupe le script avant, le client voit « La demande n'a pas pu être envoyée » **alors qu'elle est partie**. | `_skysms_lib.php:127-128` | D'abord **mesurer** (`max_execution_time` sur LWS, journaux `[SKYSMS_COLLECT]`). Ensuite, si la coupure est confirmée, la page traite une erreur 5xx comme « demande probablement partie, regardez votre téléphone ». |
| 10 | MOYENNE | Sauvegardes | Les sauvegardes de la base restent **sur le même serveur** (`data/_backups/`). Aucune copie ailleurs. | — | Script de copie FTP hebdomadaire vers votre PC ou un stockage privé. **Jamais dans le dépôt GitHub, qui est public.** |
| 11 | BASSE | Init | Base illisible → le contrôle de prix d'`init` est sauté (celui de l'octroi reste). | `payment_camerpay.php:560-561` | Base illisible → 503 « réessayez dans un instant » plutôt que de débiter. |
| 12 | BASSE | En-têtes | Pas d'en-tête `Content-Security-Policy` sur l'accueil. | `.htaccess` | ⚠️ `.htaccess` est sensible sur LWS (incident 500 passé) : CSP en mode `Report-Only` d'abord, ou ne rien faire. |
| 13 | BASSE | Mots de passe | Comptes anciens encore en `S256` (SHA-256 salé par l'identifiant), migrés vers bcrypt seulement à la connexion suivante. | `_auth_lib.php:140-195` | Laisser la migration progressive se faire ; possibilité de forcer une réinitialisation des comptes inactifs. |
| 14 | BASSE | Init | `commissions` du client recopiée dans 5 fichiers. C'est sans risque, car le serveur la recalcule, mais c'est du code mort. | `payment_camerpay.php:680,791` + 3 autres | Ne plus la stocker quand `parrainage` est posé. |
| 15 | BASSE | Init | Validation du numéro plus lâche à l'`init` qu'à la collecte. | `payment_camerpay.php:540-543` | Réutiliser `vrt_skysms_tel_local`. |
| 16 | BASSE | Catalogue | Produit « TEST — Paiement 100 FCFA » (`btest100`) visible de tous. | catalogue | Le retirer après l'essai réel. |
| 17 | BASSE | Admin | Le `label` d'un paiement vient du client : l'échappement à l'affichage admin reste à vérifier. | `app.js` (écran Suivi SkySMS) | Vérifier `_esc()` ; corriger si besoin. |

**Non audités dans cette passe** (marqués ⚠️ dans 03) : mot de passe oublié, QCM, vidéo, corrigés, Lighthouse. Ils seront rejoués au navigateur en phase 6. `api/payment_monetbil.php`, présent dans votre dossier mais ni suivi par git ni en prod, n'a pas été audité.

## Ce que je ferai en phase 5 (après votre accord)
Ordre HAUTE → MOYENNE → BASSE, un commit par correctif sur `fix/audit-prod`, chacun avec un **banc HTTP neuf** `tests/banc_skysms.php`. Le banc démarre `php -S`, simule SkySMS et les rappels **sans aucun appel réel**, et je le vérifie d'abord **rouge sans le correctif**. Rien n'est poussé sur `master` (= FTP prod) sans votre feu vert.
Les n° 9 et 12 attendent une mesure ou votre décision. Le n° 1 gagnera en solidité si SKYSOFT répond aux questions de [02](02-skysoft.md#questions-à-poser-à-skysoft-bloquantes-pour-4-correctifs).

## Sauvegarde faite avant l'audit
- **Code** : branche `audit-backup-2026-10-15` = votre état de travail **non commité** (fichiers suivis), figé sans rien modifier dans votre dossier. Branche de travail `fix/audit-prod` = `origin/master` (la prod), dans un worktree séparé.
- Restaurer le code non commité dans votre dossier :
```bash
git stash apply audit-backup-2026-10-15
```
- Revenir exactement à la prod sur la branche de correction :
```bash
git checkout fix/audit-prod && git reset --hard origin/master
```
- **Base de données** : je n'ai **pas** accès au FTP depuis ce poste (les identifiants sont dans les secrets GitHub). Avant la phase 5, faites une copie par FileZilla des dossiers `/data/` et `/api/data/` du serveur LWS vers `C:\VERITAS_backup_2026-10-15\`. Ou en ligne de commande (le mot de passe FTP vous sera demandé) :
```bash
curl --ssl-reqd --ssl-no-revoke -u VOTRE_LOGIN_FTP "ftp://ftp.veritas-school.com/data/veritas_db.json" -o veritas_db_2026-10-15.json
```
- Restaurer la base : renvoyer ce fichier au même emplacement par FTP. Le serveur garde aussi ses propres copies dans `data/_backups/`.
