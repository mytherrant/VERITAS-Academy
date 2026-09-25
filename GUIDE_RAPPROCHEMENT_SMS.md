# Rapprochement SMS : les pass livrets et manuels servis sans validation manuelle

> Mise en place : septembre 2026. Code : `api/_rapprochement_lib.php`,
> `api/payment_sms.php`. Banc : `php tests/banc_rapprochement_sms.php`.

## Le principe

Aujourd'hui l'acheteur déclare sa commande, paie sur le code marchand (MTN MoMo
**02681266**, Orange Money **999471**), puis **attend qu'un admin valide**.

Avec le rapprochement, le téléphone qui reçoit les SMS des opérateurs les
transmet au serveur. Quand un SMS de réception correspond à **une seule**
commande déclarée, le code du livret ou le manuel est servi **tout de suite**,
sans humain. Dans tous les autres cas, la commande reste dans la file de
validation manuelle, comme avant.

**Tant que la clé `SMS_WEBHOOK_SECRET` n'est pas posée, rien ne change** : le
point d'entrée répond 503 et tout reste manuel.

## Ce qu'un SMS doit réunir pour servir un pass

1. Il arrive avec la clé secrète (en-tête `X-VRT-Cle`).
2. Son expéditeur est celui de l'opérateur (`SMS_EXPEDITEURS`).
3. **Le solde annoncé est cohérent** : nouveau solde = ancien solde + montant − frais.
   Un faux SMS ne connaît pas le vrai solde du compte marchand. Il casse donc la
   chaîne, et plus rien n'est automatique jusqu'au ré-ancrage par un admin.
4. Son identifiant de transaction n'a jamais servi.
5. Il correspond à **exactement une** commande déclarée. La correspondance se fait
   sur le même montant et le même opérateur, par le numéro payeur ou par
   l'identifiant de transaction, dans une fenêtre de 72 h.
6. Le montant ne dépasse pas `SMS_AUTO_MAX` (25 000 FCFA par défaut).
7. L'achat est un livret, un pack de livrets, un manuel numérique ou un manuel
   (`SMS_AUTO_INTENTS`). Les abonnements, les cours et le reste restent manuels.

Deux cas particuliers :

- **Paiement fait avant la déclaration** : le SMS est gardé « en attente ». Il est
  servi dès que la commande est déclarée.
- **Paiement depuis un autre numéro** : sur la page du livret, l'acheteur saisit
  l'identifiant de transaction reçu par SMS dans « Payé depuis un autre
  numéro ? ».

## Mise en place (à faire une fois)

### 1. Générer et poser la clé

Sur n'importe quel ordinateur :

```bash
openssl rand -hex 24
```

Ajouter ensuite, par FTP, dans `api/payment_config.php` sur le serveur :

```php
define('SMS_WEBHOOK_SECRET', 'la-clé-générée');
// facultatif :
// define('SMS_AUTO_MAX', 25000);
// define('SMS_AUTO_INTENTS', 'livret,livret_pack,digitalbook,book');
```

### 2. Installer le relais sur le téléphone marchand

Installer une application Android de transfert de SMS vers une URL, par exemple
« SMS Forwarder » ou « SMS to URL Forwarder ». Réglages :

- **URL** : `https://veritas-school.com/api/payment_sms.php?action=recu`
- **Méthode** : POST (JSON ou formulaire)
- **En-tête** : `X-VRT-Cle: la-clé-générée`. Si l'application ne gère pas les
  en-têtes, ajouter `&cle=la-clé-générée` à l'URL.
- **Champs** : l'expéditeur dans `from` (ou `sender`) et le texte dans `text` (ou
  `message`).
- **Filtre** : seulement les SMS de MTN MoMo et d'Orange Money.
- Désactiver l'optimisation de batterie pour cette application.

⚠️ **Transférer aussi les SMS de sortie** (retraits, transferts). La chaîne des
soldes les suit. Si un mouvement manque, le solde suivant ne correspond plus :
la chaîne se rompt et tout redevient manuel (sans risque, mais sans
automatisme).

### 3. Ancrer les soldes

Aller dans Admin → Paiements, puis dans le bloc « Rapprochement SMS ». Pour
chaque opérateur, cliquer sur **Ancrer le solde** et saisir le solde exact du
compte marchand à cet instant (celui du dernier SMS ou de `*126#` / `#150#`).

## Quand la chaîne est rompue

Un SMS au solde incohérent rompt la chaîne. Cela peut être un faux SMS, ou un
mouvement non transféré. Dans ce cas :

- plus aucun paiement de cet opérateur n'est servi automatiquement ;
- l'admin reçoit un courriel d'alerte (au plus un par heure) ;
- les commandes attendent la validation manuelle, comme avant.

Pour réparer : vérifier le vrai solde sur le téléphone, puis cliquer à nouveau
sur **Ancrer le solde**. Un SMS ne peut jamais ré-ancrer la chaîne tout seul.

## Suivi

- Dans la liste des commandes, 🤖 indique une commande validée
  automatiquement (`validePar = auto:sms:<opérateur>:<txid>`).
- Le bloc « Rapprochement SMS » affiche l'état de chaque chaîne et les 8
  derniers SMS (numéros masqués).
- Journal serveur : `api/data/payments_manuel/_sms/`.

## Tester sans risque

`POST /api/payment_sms.php?action=analyser` (admin, `{texte, expediteur}`) montre
comment un SMS est lu, sans rien accorder. Si le format des SMS d'un opérateur
change, c'est le premier contrôle à faire.
