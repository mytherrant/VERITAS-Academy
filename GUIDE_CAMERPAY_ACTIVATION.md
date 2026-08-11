# Activer CamerPay — encaissement et versements automatiques

> Tout le code est en place et branché. Cette page ne décrit **que** les valeurs à poser
> sur le serveur. Aucune modification de code, aucun redéploiement applicatif.

## Pourquoi CamerPay et pas CamPay

CamPay exige un **compte bancaire d'entreprise** et un **historique d'activité** : impossible
en phase de lancement. CamerPay ouvre sans l'un ni l'autre, verse sur un Mobile Money au nom
du gérant, et laisse **tout tester avant le moindre document**.

`api/payment_campay.php` reste **entier et fonctionnel**. Le jour où le compte entreprise
existera, il suffira de poser les identifiants CamPay et de passer `PAY_PROVIDER` sur
`'campay'` : aucune ligne de JavaScript à changer, le frontend suit le serveur.

## Ce qui se passe aujourd'hui (sans les clés)

- `payment_camerpay.php?action=config` répond `configured: false`.
- Le frontend le détecte seul et **n'affiche pas** le bouton « Payer maintenant ».
- Les clients voient les moyens manuels (MoMo, Orange, virement) avec le bandeau
  « validation sous 24 h ». **Aucun parcours mort, aucune erreur affichée.**
- ⚙️ Paramètres → Paiements API : le diagnostic affiche l'état réel du serveur.

## Étape 1 — Créer le compte

1. <https://camerpay.biz/register> — gratuit, **sans KYC**.
2. Tableau de bord : <https://camerpay.biz/client>

## Étape 2 — Récupérer les valeurs

Tableau de bord → **API & webhooks** :

| Champ du tableau de bord | Constante VÉRITAS |
|---|---|
| Token API (« Générer un nouveau token ») | `CAMERPAY_TOKEN` |
| Callback secret | `CAMERPAY_CALLBACK_SECRET` |

⚠️ **Le token ne s'affiche qu'une seule fois.** Copiez-le immédiatement ; s'il est perdu,
il faut en générer un nouveau (l'ancien est révoqué).

## Étape 3 — Poser les valeurs dans `api/payment_config.php`

Sur le serveur LWS (gestionnaire de fichiers), dans `api/payment_config.php` :

```php
define('PAY_PROVIDER', 'auto');                    // CamerPay s'il est configuré
define('CAMERPAY_TOKEN', 'le_token_copie');
define('CAMERPAY_CALLBACK_SECRET', 'le_callback_secret');
define('CAMERPAY_MODE', 'sandbox');                // 'live' après le KYC
define('CAMERPAY_PUBLIC_INIT', 'pub_...');         // voir étape 4
```

Ce fichier est **gitignoré** : il ne part jamais sur GitHub et n'est jamais écrasé par un
déploiement. `api/payment_config.php.exemple` documente chaque constante.

## Étape 4 — Le jeton public (self-service client)

Sans lui, **seul l'administrateur** peut lancer un encaissement : un visiteur qui clique
« Payer maintenant » n'a pas le secret d'administration.

Générez une valeur au hasard. Sur votre poste (PHP n'y est pas installé, Node si) :

```bash
node -e "console.log('pub_'+require('crypto').randomBytes(16).toString('hex'))"
```

Ou directement sur le serveur LWS, si vous y avez un terminal PHP :

```bash
php -r "echo 'pub_' . bin2hex(random_bytes(16)), PHP_EOL;"
```

Puis une seule chose : `define('CAMERPAY_PUBLIC_INIT', 'pub_...')` dans
`api/payment_config.php`. **Rien à recopier dans l'application.**

> **Ce point a changé (v1.15.6) — et c'était un parcours mort.** Le guide demandait de
> recopier ce jeton dans ⚙️ Paramètres. Or ce champ vit dans la base de l'administrateur,
> que le navigateur d'un visiteur **ne télécharge jamais** : le client voyait le bouton
> « Payer maintenant », cliquait, et tombait sur « libre-service indisponible ». C'est
> désormais le serveur qui transmet le jeton au navigateur via `?action=config`. Le champ
> de l'écran d'administration ne sert plus que de repli.

⚠️ **Jamais** la même valeur que le secret de synchronisation ni que `CAMERPAY_TOKEN`.
Ce jeton est **public par construction** — tout navigateur qui paie doit le détenir. Il ne
donne accès à aucune lecture (ni liste, ni relevé, ni versement) et ne peut *que* créer une
demande de paiement, bridé par origine (`CAMERPAY_INIT_ALLOWED_ORIGINS`), par débit
(`CAMERPAY_INIT_RATE_PER_HOUR`) et par montant (`CAMERPAY_COLLECT_MAX`).

## Étape 5 — Déclarer le webhook

Tableau de bord CamerPay → **API & webhooks** → URL de callback :

```
https://veritas-school.com/api/payment_camerpay.php?action=notify
```

Le serveur vérifie la signature HMAC-SHA256 de chaque notification, **puis relit le statut
auprès de CamerPay** avant d'ouvrir le moindre accès : une notification falsifiée ne donne
rien. Si le webhook se perd, le polling (`?action=status`) et la réconciliation
(`?action=list`) rattrapent la confirmation — CamerPay ne rejoue pas sur une erreur HTTP.

⚠️ **`CAMERPAY_CALLBACK_SECRET` n'est pas optionnel.** S'il manque, le serveur **rejette**
toutes les notifications (401) plutôt que de croire un expéditeur qu'il ne peut pas
identifier. Les paiements aboutissent quand même — l'écran de suivi du payeur et
« Encaissements » réconcilient — mais l'activation prend quelques secondes au lieu d'être
instantanée. Le bandeau de ⚙️ Paramètres → Paiements API le dit tant que le secret manque.

## Étape 6 — Tester en sandbox (aucun argent réel)

1. `CAMERPAY_MODE = 'sandbox'`.
2. Achetez un manuel à 500 FCFA depuis un compte de test.
3. La page de paiement CamerPay s'ouvre dans un nouvel onglet — c'est **normal** :
   CamerPay fonctionne par **redirection**, pas par prompt USSD comme CamPay.
4. Validez la simulation, revenez : l'accès doit s'activer tout seul.
5. Vérifiez ⚙️ Paramètres → « Encaissements (liste + net) ».

Le bandeau **🧪 mode TEST** est affiché partout tant que `CAMERPAY_MODE = 'sandbox'` :
personne ne peut croire que l'argent est arrivé.

## Étape 7 — Passer en réel

Validez le KYC sur <https://camerpay.biz/client>, puis `CAMERPAY_MODE = 'live'`.

> ### ⚠️ `CAMERPAY_MODE` ne fait PAS passer en réel — il ne fait que l'annoncer
>
> Ce réglage est **purement local**. Il n'est jamais transmis à CamerPay :
> l'appel d'initiation ne porte aucun champ de mode, seulement votre jeton.
> Le mettre à `live` sans avoir validé le KYC donne une sonde `?action=config`
> qui affiche fièrement `mode:live` pendant que CamerPay continue de renvoyer
> ses pages `/sandbox/simulate/`. **On croit encaisser, et aucun franc n'arrive.**
>
> **Ce qui décide se trouve chez CamerPay, dans cet ordre :**
> 1. le **KYC validé** (sans lui, le compte reste en test quoi qu'on fasse) ;
> 2. le **jeton** employé — après validation, prenez le jeton de production sur
>    `camerpay.biz/client/api` et remplacez `CAMERPAY_TOKEN` **sur le serveur**.
>
> **Le seul test qui fasse foi** — lancez un paiement et regardez la page qui
> s'ouvre : une URL contenant `/sandbox/simulate/`, ou le bandeau
> « 🧪 MODE TEST » dans le modal, signifie que **CamerPay** vous répond en test.
> Ce bandeau n'est pas déclaratif : le serveur le calcule à partir de l'URL
> renvoyée par le fournisseur, pas à partir de `CAMERPAY_MODE`.
>
> **Piège de configuration à écarter d'abord** : le bloc `CAMERPAY` protège
> chaque constante par `if (!defined('X')) define('X', …)`. La **première**
> définition gagne et les suivantes sont ignorées **en silence** — si
> `CAMERPAY_TOKEN` apparaît deux fois dans le fichier, votre nouveau jeton n'est
> jamais pris en compte. Cherchez `CAMERPAY_TOKEN` dans `payment_config.php` :
> il ne doit y avoir **qu'une seule** ligne `define`. Une fois la mise à jour
> déployée, `?action=hooklog` (admin) fait ce comptage tout seul et publie une
> empreinte du jeton actif, pour confirmer que c'est bien le nouveau qui sert.

| Palier | Pièces | Plafond mensuel |
|---|---|---|
| KYC-1 | CNI du gérant **ou** extrait RCCM | 200 000 FCFA |
| KYC-2 | + attestation NIU | 1 000 000 FCFA |
| KYC-3 | RCCM + NIU + justificatif de siège | illimité |

Un dépassement renvoie une erreur qui **nomme la pièce à fournir**.

Faites ensuite un vrai test à **100 FCFA**.

## Répartition automatique des gains

Une fois CamerPay configuré, **quatre sources** créditent le même solde de versement
(`DB.partenairesSplit`) et sont payées par le même canal :

| Source | Calculée par | Quand |
|---|---|---|
| Parrains (%, forfait) | `_computeSplits` | à la confirmation du paiement |
| Auteurs de manuels | `_computeSplits` | idem |
| Enseignants marketplace | `_computeSplits` | idem |
| Codes promo partenaires | `confirmCommissionsForSale` → `_payDistributeCommission` | à la validation de la vente |
| Bonus de palier | `calculatePartnerLevel` → `_payDistributeCommission` | à l'atteinte du palier |

Pour que l'argent **parte tout seul**, cochez ⚙️ Paramètres → Paiements API →
**⚡ Versement AUTOMATIQUE des gains**, et fixez le seuil (défaut 1 000 FCFA : sous ce
montant les gains s'accumulent, ce qui évite des micro-versements facturés chacun).

Ce qu'il faut savoir sur les versements CamerPay :

- Un lot est **soumis**, puis **approuvé manuellement par CamerPay** (généralement moins de
  4 h ouvrées) avant exécution. VÉRITAS le dit dans le dialogue de confirmation.
- Tant que l'arrivée n'est pas confirmée, le montant est **réservé** (`soldeEnCours`) et non
  soldé : un échec le recrédite automatiquement au partenaire.
- Utilisez **🔍 Vérifier les versements** pour réconcilier.
- Frais de versement : ~2 % (Orange) / ~3,75 % (MTN), minimum 1 000 FCFA.
- Limites BEAC : 100 bénéficiaires et 2 000 000 FCFA par lot, 1 000 000 FCFA par bénéficiaire.

## Ce que CamerPay ne fait pas

- **Pas d'endpoint solde** : consultez-le sur <https://camerpay.biz/client>.
- **Pas de vérification du titulaire** d'un numéro : l'application affiche l'opérateur
  détecté et vous demande de vérifier le numéro avant de verser.
- **Remboursement Orange/MTN non réversible par API** : passez par le support CamerPay
  (le remboursement carte, lui, fonctionne par API).

## Tarifs (relevés sur le tableau de bord, août 2026)

| Plan | Abonnement | Commission | Volume |
|---|---|---|---|
| Démarreur | gratuit | 3 % | 100 transactions/mois |
| **Entreprise** ← plan de VÉRITAS | **500 XAF/mois** | **1,5 %** | **illimité** |
| Pro | 2 500 XAF/mois | 1 % | illimité |

`CAMERPAY_FEE_RATE` est donc à **0.015**. C'est déjà la valeur par défaut : le « net estimé »
de l'écran d'administration est juste sans rien toucher. (0.03 = Démarreur, 0.01 = Pro.)

Deux conséquences du plan Entreprise, utiles à connaître :

- **Aucun plafond de transactions.** L'erreur `transaction_limit_reached` ne peut plus
  survenir ; si elle apparaît, c'est que l'abonnement a expiré.
- Sur 100 paiements de 5 000 FCFA, la commission passe de 15 000 à **7 500 FCFA** —
  l'abonnement de 500 XAF est remboursé dès la **deuxième** transaction de 5 000 FCFA.

## En cas de problème

- Journal serveur : `api/data/payments/_webhook_camerpay_log.txt`
- Diagnostic dans l'application : ⚙️ Paramètres → Paiements API (bandeau d'état)
- `?action=config` en GET : dit quel fournisseur est actif et pourquoi
- Codes d'échec (`failure_code`) documentés : <https://camerpay.biz/docs/webhooks>
