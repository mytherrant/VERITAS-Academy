# 🟠 GUIDE — Activer Orange Money API automatique dans VÉRITAS

> **Version :** v1.2
> **Objectif :** Permettre aux clients de payer leur abonnement / livre / classe virtuelle directement avec leur Orange Money, et que **VÉRITAS active l'accès automatiquement** sans intervention de l'admin.

---

## ✅ Ce que vous avez déjà

- ✅ Compte Orange Developer créé sur https://developer.orange.com
- ✅ Backend PHP sur veritas-school.com (LWS)
- ✅ VÉRITAS v1.2 avec le module paiement intelligent

---

## 📋 Étape 1 — Récupérer les 3 credentials Orange

1. Allez sur https://developer.orange.com
2. Connectez-vous → **Mes applications**
3. Cliquez sur **« Créer une application »** (ou ouvrez celle existante)
   - **Nom** : `VERITAS Academy`
   - **Description** : `Application de gestion scolaire et paiements e-learning`
4. **Souscrire au produit** : dans le catalogue, cherchez **« Orange Money WebPayment Cameroon »** et cliquez **« Subscribe »**
   - ⚠️ Si vous ne voyez pas le produit : il faut peut-être demander un accès commercial à Orange Cameroun (`orange-developer-cm@orange.com`)
5. Une fois souscrit, sur la page de l'application vous verrez :
   - **Client ID** (long, type `bC2Xy...`)
   - **Client Secret** (long, type `Lk9pZ...`)
6. Pour le **Merchant Key** : Orange vous le fournit séparément après vérification de votre compte commerçant. C'est lié au numéro **+237 697 637 739** que vous utilisez.

---

## 📋 Étape 2 — Configurer le serveur LWS

1. Connectez-vous sur **LWS Panel** → **Gestionnaire de fichiers**
2. Naviguez vers `/htdocs/api/` (ou le dossier où sont vos PHP)
3. **Uploadez les 2 nouveaux fichiers** :
   - `payment_orange.php`
   - `payment_config.php`
4. **Modifiez `payment_config.php`** : double-cliquez pour l'éditer
5. Remplacez ces valeurs :

```php
define('ORANGE_CLIENT_ID',     'COLLEZ_VOTRE_CLIENT_ID_ICI');
define('ORANGE_CLIENT_SECRET', 'COLLEZ_VOTRE_CLIENT_SECRET_ICI');
define('ORANGE_MERCHANT_KEY',  'COLLEZ_VOTRE_MERCHANT_KEY_ICI');

define('PUBLIC_BASE_URL',      'https://veritas-school.com');     // ⚠️ sans / final
define('PUBLIC_FRONTEND_URL',  'https://veritas-school.com');

// En PROD : passer en XAF
define('ORANGE_CURRENCY',      'XAF');   // 'OUV' = sandbox, 'XAF' = production
```

6. Le **token API** doit correspondre au secret que vous avez configuré dans VÉRITAS (Paramètres → Cloud) :

```php
define('PAY_API_SECRET',       'VERITAS-CLOUD-2026-xK9m');  // ← identique à DB.cloudConfig.secret
```

7. **Sauvegardez** le fichier.

---

## 📋 Étape 3 — Déclarer le Webhook chez Orange

C'est l'étape **la plus importante** : sans webhook, Orange ne peut pas notifier votre serveur quand un paiement est validé.

1. Retournez sur https://developer.orange.com → votre application
2. Onglet **« Notification settings »** ou **« Webhooks »**
3. Renseignez l'URL :
   ```
   https://veritas-school.com/api/payment_orange.php?action=notify
   ```
4. Sauvegardez.

---

## 📋 Étape 4 — Activer le bouton dans VÉRITAS

1. Ouvrez VÉRITAS, connectez-vous en **admin**
2. Allez dans **⚙️ Système → Paramètres école**
3. Descendez jusqu'à la carte **« ⚡ Paiements API automatiques »**
4. Cochez la case **« 🟠 Activer le bouton "⚡ Payer maintenant (auto)" pour Orange Money »**
5. Cliquez sur **« 🔌 Tester la connexion serveur »** pour vérifier que tout est OK
6. Tout est prêt ! 🎉

---

## 🧪 Étape 5 — Tester avec 100 FCFA

1. Connectez-vous comme **visiteur** sur VÉRITAS
2. Allez dans **🛒 Boutique** et choisissez un livre à petit prix (ou créez un produit test à 100 FCFA)
3. Cliquez **« Acheter »** → le modal de paiement s'ouvre
4. Sur la carte **🟠 Orange Money**, vous voyez maintenant le bouton vert **« ⚡ Payer maintenant (auto) »**
5. Cliquez dessus → une nouvelle fenêtre s'ouvre sur la page Orange Money
6. Entrez votre numéro Orange et votre PIN
7. Validez le paiement
8. VÉRITAS détecte automatiquement la confirmation (polling toutes les 5s)
9. ✅ Le bandeau passe au vert **« Paiement confirmé ! Activation en cours... »**
10. ✅ L'admin reçoit une notification **« ✅ Paiement Orange auto-confirmé »**
11. ✅ La commande est marquée payée, l'accès est activé, le stock est décrémenté

---

## 🔍 Vérifier que ça fonctionne

### Côté admin (VÉRITAS)
- Allez dans **💰 Finances → Tentatives de paiement**
- La transaction apparaît avec :
  - Statut **PAID** (vert)
  - Badge **📚 Livre** ou **🎓 Abonnement** selon l'intent
  - Mention **« ✓ Commande activée »** dans la colonne description

### Côté serveur (debug)
- Bouton **« 📊 Voir les paiements API serveur »** dans Paramètres → ouvre la liste JSON de toutes les transactions reçues
- Le fichier `api/data/payments/_webhook_log.txt` contient le log brut de chaque webhook Orange (consultable via le gestionnaire LWS)

---

## ❓ Problèmes fréquents

| Erreur | Cause probable | Solution |
|---|---|---|
| `OAuth Orange échoué` | Client ID / Secret invalides | Vérifiez les valeurs dans `payment_config.php` |
| `Orange n'a pas renvoyé d'URL` | Merchant Key incorrect ou pas de souscription au produit | Re-vérifier dans developer.orange.com |
| `Token API requis ou invalide` | `PAY_API_SECRET` ≠ `DB.cloudConfig.secret` | Alignez les 2 valeurs |
| Webhook jamais reçu | URL webhook mal configurée chez Orange | Re-vérifier l'URL exacte dans le dashboard Orange |
| `HTTP 500` au moment du `init` | Erreur PHP serveur | Activez les logs LWS, consultez `/api/data/payments/_webhook_log.txt` |
| Paiement validé mais accès non activé | Bug dans `_payAutoActivate` | Vérifier `att.intent` et `att.targetId` dans `DB.payAttempts` |

---

## 🔐 Sécurité

- ✅ **Client Secret** n'est JAMAIS exposé au navigateur — il reste sur le serveur
- ✅ **Webhook signature** : Orange envoie un `notif_token` que VÉRITAS vérifie contre le `notif_token` retourné lors du `init`
- ✅ **HTTPS obligatoire** pour les webhooks (Orange refusera HTTP)
- ✅ **Token API** entre VÉRITAS et le backend (Bearer)
- ⚠️ Ne committez **jamais** `payment_config.php` sur GitHub — ajoutez-le à `.gitignore`

---

## 📞 Support

- **Orange Developer Cameroun** : `orange-developer-cm@orange.com`
- **Documentation OM WebPay CM** : https://developer.orange.com/apis/om-webpay-cm/

---

## 🚀 Prochaines étapes (v1.3)

- [ ] Intégration MTN MoMo Collection API (similaire à Orange mais sur https://momodeveloper.mtn.com)
- [ ] Webhook PayPal pour les paiements internationaux
- [ ] Webhook Stripe pour les cartes bancaires
- [ ] Auto-désactivation des abonnements expirés (cron)

---

*© 2026 Mythe Errant · Centre VÉRITAS · Douala, Cameroun*
