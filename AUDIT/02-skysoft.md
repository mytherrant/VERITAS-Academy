# 02 — Audit SkySoft (SkySMS), point par point

> Code audité : `origin/master` @ 4255317 (= prod). Références `fichier:ligne` dans cette version.
> **Constat préalable, mesuré en prod le 15/10** : `GET /api/payment_camerpay.php?action=config` → `"provider":"skysms","mode":"live","canCollect":true`. **SkySMS encaisse déjà de l'argent réel.**
> **Aucun sandbox SkySoft n'existe** (rien dans la doc). Comme vous l'avez demandé (règle 4), **aucune transaction n'a été lancée**. Tout ce qui suit vient de la lecture du code et des tests locaux.

Légende : ✅ OK · ❌ KO · ⚠️ À VÉRIFIER

## 1. Initiation

| Point | Verdict | Détail |
|---|---|---|
| Montant calculé côté serveur | ✅ (avec réserve) | Le montant vient du client, mais `init` le **confronte au tarif de la base** avant tout débit (`vrt_verifier_prix`, `payment_camerpay.php:593-608`), et l'octroi le recontrôle (`_auth_lib.php:1375`). Un montant modifié dans l'inspecteur → 409 « le montant ne correspond plus au tarif ». **Réserve** : si la base est illisible, le contrôle d'`init` est sauté (`:560-561`) ; seul celui de l'octroi joue, **après** le débit (paiement « underpaid » à régler à la main). |
| Devise XAF | ✅ | SkySMS n'a pas de paramètre devise ; le montant est un entier (`intval`), sans décimales. |
| Référence unique | ❌ | La référence est **fabriquée par le navigateur**. Si elle existe déjà, `init` renvoie l'état existant **sans vérifier qu'il s'agit du même achat** (`:639-652`). Le chemin « acheter un manuel » de l'élève fabrique `'BOOK-'+5 chiffres` (`app.js:12439`) : 90 000 valeurs à vie, **sans date**. Après quelques centaines d'achats, une collision devient probable : le second acheteur reçoit la page de paiement du premier (libellé, montant, **numéro de téléphone prérempli**). `_payRef` (`app.js:32246`) est meilleur (date + 4 caractères base 36) mais reste devinable. |
| Numéro validé (6XXXXXXXX / +237) | ✅ | `vrt_skysms_tel_local` (`_skysms_lib.php:81-85`) puis `camerpayGuessMethod` (préfixes MTN / Orange) au moment de la collecte (`:958-961`). À l'`init`, la validation est plus lâche (`:540-543`, 12 chiffres quelconques), sans conséquence puisque la collecte revalide. |
| Identifiant envoyé à SkySMS (`id_client`) | ❌ | `date('ymdHis') . 3 chiffres` (`_skysms_lib.php:88-90`) : **devinable**. Or c'est la clé qui relie le rappel à notre commande. |

## 2. Webhook / rappel (`?action=skysms_notify`, `:1017-1055`)

| Point | Verdict | Détail |
|---|---|---|
| Signature / secret partagé | ⚠️ | SkySMS ne signe rien. L'authentification repose sur une **clé de ≥ 24 caractères dans l'URL** (`skysmsCleValide`, `:2080-2097`, comparaison `hash_equals`, refus par défaut si la clé est absente : bon point). Mais une clé dans une URL finit dans les journaux d'accès de LWS et chez SKYSOFT. **Si elle fuit, elle suffit à elle seule à valider n'importe quel paiement en attente.** |
| Recoupement montant / numéro | ❌ | Le code recoupe le numéro et le montant **s'ils sont présents** (`:1043`, `skysmsAppliquer :2118`). Or le **rappel officiel n'en contient aucun** (`id_operation, id_operateur, id_client, statut`). En pratique : `montant_verifie=false`, montant retenu = montant attendu, numéro jamais comparé. **Aucun contrôle hors de la clé.** |
| Recoupement `id_operation` | ❌ | La réponse de collecte nous donne un `id_operation` connu seulement de SkySMS et de nous (`:994-998`), mais le rappel **ne le compare pas** (`:1038` : il le recopie seulement s'il est vide). C'est le contrôle le moins coûteux à ajouter. |
| Idempotence | ✅ / ⚠️ | ✅ Un rappel rejoué **après coup** n'accorde rien de plus : `skysmsAppliquer` n'agit que sur `pending/failed`, `camerpayGrant` s'arrête sur `granted`, et l'octroi est idempotent **par référence dans la base**, sous `flock` (abonnement `:1397`, crédits IA `:1900`, codes de cahier `:1612`, commissions par `id`). ⚠️ Mais le **fichier d'état n'est pas verrouillé** : deux rappels **simultanés** lisent tous deux `pending`. La base reste juste (verrou + idempotence par référence), mais les SMS et les journaux peuvent partir en double. |
| Re-vérification auprès de l'API | ❌ (limite fournisseur) | Impossible : SkySMS n'expose aucune route de statut (`list` le dit, `:1327-1329`). C'est la raison pour laquelle les deux contrôles ci-dessus (clé + `id_operation`) doivent être stricts. |
| Réponse HTTP rapide et correcte | ⚠️ | Le rappel déclenche l'octroi **de façon synchrone** : sauvegarde complète de la base (plusieurs Mo) puis **envoi de jusqu'à 3 SMS** (`vrt_notify_vider(3)`, timeout de 20 s chacun) **avant** de répondre `OK`. Si SKYSOFT coupe avant, il renverra le rappel. On répond aussi 404/409 (référence inconnue, numéro différent) : selon sa politique de renvoi, SKYSOFT peut insister sans fin. Le corps attendu (`OK` ou `1`) n'est pas confirmé pour les paiements (il l'est pour les accusés SMS). |
| URL en HTTPS joignable de l'extérieur | ✅ (partiel) | `https://veritas-school.com/api/payment_camerpay.php?action=skysms_notify&cle=…` : le domaine répond en HTTPS (HSTS actif). Sans la clé, je n'ai pas testé l'URL, et je ne l'ai pas cherchée. |

## 3. États de transaction

| Point | Verdict | Détail |
|---|---|---|
| pending → paid / failed | ✅ | `skysmsAppliquer` (`:2113-2142`) ; `underpaid` si un montant inférieur arrive. |
| failed → nouvel essai | ✅ | `skysms_collect` repasse `failed` → `pending` (`:981`). |
| Expiré / annulé | ❌ | **Un paiement SkySMS en attente ne se clôt jamais** : la réconciliation fait `continue` quand la vérification rend `null`, ce qui est toujours le cas avec SkySMS (`:1358-1366`). Ces lignes restent « en attente » à vie. |
| Tâche de réconciliation | ❌ | Aucune tâche planifiée ; la passe ne tourne qu'à l'ouverture du tableau de bord, et ne peut rien vérifier chez SkySMS. Un rappel perdu = un client qui a payé sans accès, jusqu'à validation manuelle (`skysms_confirmer`). |
| Course collecte ↔ rappel | ⚠️ | `skysms_collect` relit l'état après l'appel (`:990`), puis le réécrit (`:1012`). Un rappel qui écrit `paid` **entre ces deux lignes** est écrasé par `pending`. La base reste octroyée (idempotente), mais la page de paiement attendra en vain. Fenêtre courte mais réelle, car le rappel arrive justement quand SkySMS rend la main. |

## 4. Activation de l'abonnement / de l'accès
| Point | Verdict | Détail |
|---|---|---|
| Atomicité | ✅ | `vrt_grant_entitlement_to_file` : verrou exclusif sur la base, sauvegarde horodatée avant écriture, une seule écriture (`_auth_lib.php:2185-2270`). |
| Durée et expiration | ✅ (couverte par les bancs) | `vrt_abo_duree_ms` + plans de l'Atelier en miroir ; `paiements_entitlements.php` 95/95. |
| Renouvellement / cumul | ⚠️ | Non re-testé dans cette passe (règle du cumul à confirmer avec vous : prolonge-t-on depuis la date de fin, ou depuis aujourd'hui ?). |
| Montant vs plan | ✅ | Abonnement inconnu au catalogue refusé (`_auth_lib.php:1033`). |

## 5. Cas limites
| Cas | Verdict | Comportement actuel |
|---|---|---|
| Page fermée pendant le paiement | ✅ | `ignore_user_abort(true)` ; l'accès s'ouvre au rappel, que la page soit ouverte ou non. |
| Réseau coupé côté client | ✅ | La page interroge `status` toutes les 5 s et reprend ; `init` est idempotent par référence. |
| Double clic sur « Payer » | ✅ | Bouton désactivé, puis côté serveur 30 s d'écart minimum et 6 demandes au plus par référence (`:968-972`). |
| Solde insuffisant / PIN faux | ⚠️ | Dépend du rappel `statut=0` et de son `description`, affiché tel quel. Non observé sur un vrai paiement. |
| Timeout opérateur | ⚠️ | SkySMS garde la connexion ouverte jusqu'à 75 s (`_skysms_lib.php:127`). Sur LWS mutualisé, si PHP ou LiteSpeed coupe avant, le navigateur reçoit une erreur 5xx et affiche « La demande n'a pas pu être envoyée » **alors que la demande est partie**. À mesurer dans les journaux LWS. |
| Montant modifié dans l'inspecteur | ✅ | Refusé à l'`init` (409) et à l'octroi. |
| Page de paiement ouverte par un tiers | ❌ | `?action=payer&ref=` est **public et sans débit** : quiconque connaît ou devine une référence voit le **numéro du client** prérempli (`_skysms_lib.php:312, 333`). Si aucune demande n'est encore partie, la page **déclenche seule une demande de paiement sur ce téléphone** (`auto`, `:314`). |

## 6. Coexistence avec Orange Money / MoMo
- ✅ Un seul point d'entrée : SkySMS **remplace** l'ancien flux dans `payment_camerpay.php`, avec le même octroi, le même suivi et les mêmes états. Le paiement par code marchand reste le repli si une pièce de configuration manque (`camerpaySkysmsPret`, `:2044`).
- ✅ Les anciens `payment_mtn.php` / `payment_orange.php` ne sont plus appelés par les tunnels. Aucune régression constatée : les 6 bancs PHP sont verts.
- ⚠️ La factorisation reste partielle : la liste `commissions` reçue du client est recopiée dans **5 fichiers** (`payment_camerpay:680,791`, `campay:314`, `mtn:151`, `orange:126`). Elle est ensuite **re-vérifiée** côté serveur (`vrt_commissions_verifiees`), donc ce n'est pas une faille, mais c'est du code mort à nettoyer.

## 7. Journalisation
| Point | Verdict | Détail |
|---|---|---|
| Chaque transaction tracée | ✅ | `[SKYSMS_INIT]`, `[SKYSMS_COLLECT]`, `[SKYSMS_PAYE]`, `[SKYSMS_ECHEC]`, `[GRANT]` ; journal plafonné à 1 Mo (`:158-164`). |
| Pas de secrets | ✅ | La clé du rappel n'est jamais écrite (seule sa longueur l'est), les URL d'appel ne sont jamais journalisées, et la description SMS qui recopie login + mot de passe est caviardée. |
| **Pas de numéros clients** | ❌ | Votre règle 3 n'est pas respectée : `[SKYSMS_COLLECT]` écrit la réponse brute, qui contient `"telephone"` (`:992-993`) ; `[SKYSMS_RAPPEL]` écrit le corps du rappel (`:2070`) ; `[SKYSMS_TEL_DIFFERENT]` écrit deux numéros (`:1046`). |

## 8. UX
| Point | Verdict |
|---|---|
| Messages en français, clairs | ✅ |
| Écran d'attente pendant la validation | ✅ « Demande envoyée au … Regardez votre téléphone… » + suivi toutes les 5 s |
| Confirmation | ✅ « Paiement confirmé. Votre accès s'ouvre… » puis retour vers la page d'origine (même domaine seulement) |
| Échec + « Réessayer » | ✅ (bouton réactivé ; le message dit « Vous pouvez réessayer ») |
| Attente sans fin | ❌ Aucune limite de temps côté page : si le rappel se perd, le client attend sans savoir quoi faire. Proposer au bout de 3 min : « Pas de confirmation ? Envoyez la référence sur WhatsApp ». |

## Questions à poser à SKYSOFT (bloquantes pour 4 correctifs)
1. Existe-t-il un **environnement de test** ? À défaut, accepteriez-vous des collectes réelles de 100 F remboursées ?
2. Une **route de statut** par `id_operation` ou `id_client` ?
3. Le rappel peut-il porter le **montant** et le **numéro payeur** ? Une **signature** HMAC, ou une **liste d'IP** d'origine ?
4. **Politique de renvoi** : combien de tentatives, sur quels codes HTTP, et quel corps de réponse attendez-vous (`OK` ou `1`) ?
5. **Délai d'expiration** d'une demande non validée par le payeur ?
