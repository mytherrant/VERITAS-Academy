# 📱 GUIDE — Activer MTN MoMo API automatique dans VÉRITAS

> **Version :** v1.2
> **Objectif :** Permettre aux clients de payer leur abonnement / livre / classe virtuelle directement avec leur **MTN Mobile Money**, sans redirection — juste en entrant leur numéro et leur PIN.

---

## ✅ Ce que vous avez déjà

- ✅ Compte MTN MoMo Developer créé sur https://momodeveloper.mtn.com
- ✅ Backend PHP sur veritas-school.com (LWS)
- ✅ VÉRITAS v1.2 avec le module paiement intelligent

---

## 🎯 UX MTN vs Orange — Différence importante

| | Orange Money | MTN MoMo Collection |
|---|---|---|
| **Méthode** | Client redirigé vers la page Orange | Le client tape son numéro dans VÉRITAS |
| **Validation** | Page web Orange + PIN | Prompt USSD push sur le téléphone |
| **Délai** | 5-10 secondes | 30-60 secondes (utilisateur doit décrocher) |
| **Avantage** | UX claire (page officielle) | Reste dans VÉRITAS, plus fluide |

---

## 📋 Étape 1 — Récupérer les 3 credentials MTN

1. Allez sur https://momodeveloper.mtn.com
2. Connectez-vous → **Profile** (en haut à droite)
3. Vous verrez deux clés de souscription : **Primary Key** + **Secondary Key**
   - 📋 **Copiez la Primary Key** → c'est votre `MTN_SUBSCRIPTION_KEY`

### Créer un API User et une API Key (sandbox)

MTN demande deux étapes supplémentaires en sandbox :

#### 1.1 Créer un API User (UUID)

Ouvrez un terminal sur votre PC et exécutez :

```bash
curl -X POST "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser" \
  -H "X-Reference-Id: VOTRE-UUID-V4-ICI" \
  -H "Ocp-Apim-Subscription-Key: VOTRE_PRIMARY_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"providerCallbackHost\":\"veritas-school.com\"}"
```

> **Générer un UUID v4** : utilisez https://www.uuidgenerator.net (un par appel)

Si tout va bien, le serveur répond **HTTP 201**. L'UUID que vous avez généré devient votre **`MTN_API_USER`**.

#### 1.2 Récupérer l'API Key

```bash
curl -X POST "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/VOTRE_API_USER_UUID/apikey" \
  -H "Ocp-Apim-Subscription-Key: VOTRE_PRIMARY_KEY"
```

La réponse contient `{"apiKey":"abcdef..."}` → c'est votre **`MTN_API_KEY`**.

### Pour la production (mtncameroon)

Une fois en production, il faut :
1. Cliquer sur **« Go-Live »** dans le menu en haut du dashboard
2. Soumettre votre dossier de mise en production à MTN Cameroun
3. Recevoir vos credentials de production (API User + API Key séparés)
4. Changer `MTN_TARGET_ENV` de `sandbox` à `mtncameroon` dans `payment_config.php`
5. Changer `MTN_API_BASE` à `https://proxy.momoapi.mtn.com` (URL de prod)

---

## 📋 Étape 2 — Configurer le serveur LWS

1. Connectez-vous sur **LWS Panel** → **Gestionnaire de fichiers**
2. Naviguez vers `/htdocs/api/`
3. **Uploadez le nouveau fichier** : `payment_mtn.php`
4. **Éditez `payment_config.php`** et remplacez les valeurs MTN :

```php
define('MTN_API_USER',         'votre-uuid-v4-de-api-user');
define('MTN_API_KEY',          'la-cle-retournee-par-le-curl');
define('MTN_SUBSCRIPTION_KEY', 'votre-primary-key-du-dashboard');
define('MTN_TARGET_ENV',       'sandbox');                          // ou 'mtncameroon' en prod
define('MTN_API_BASE',         'https://sandbox.momodeveloper.mtn.com');  // ou 'https://proxy.momoapi.mtn.com' en prod
```

5. **Sauvegardez** le fichier.

---

## 📋 Étape 3 — Activer dans VÉRITAS

1. Ouvrez VÉRITAS, connectez-vous en **admin**
2. Allez dans **⚙️ Système → Paramètres école**
3. Descendez jusqu'à la carte **« ⚡ Paiements API automatiques »**
4. Cochez la case **« 📱 Activer le bouton "⚡ Payer maintenant (auto)" pour MTN MoMo »**

---

## 🧪 Étape 4 — Tester avec un numéro MTN sandbox

MTN fournit des **numéros de test sandbox** :

| Numéro | Comportement attendu |
|---|---|
| 46733123450 | ✅ SUCCESSFUL |
| 46733123451 | ❌ REJECTED |
| 46733123452 | ❌ TIMEOUT |
| 46733123453 | ❌ APPROVED_PENDING |
| 46733123454 | ❌ INTERNAL_PROCESSING_ERROR |
| 46733123455 | ❌ NOT_ENOUGH_FUNDS |

### Scénario de test

1. Sur VÉRITAS, allez dans **🛒 Boutique** et créez un produit test à **1 EUR** (en sandbox la devise est EUR)
2. Connectez-vous en visiteur et cliquez **« Acheter »**
3. Dans le modal de paiement, sur la carte **📱 MTN Mobile Money** (badge ⚡ AUTO vert)
4. Entrez `46733123450` dans l'input
5. Cliquez **« ⚡ Payer avec mon MTN MoMo »**
6. Le serveur envoie le prompt → MTN simule un succès en ~5s
7. ✅ VÉRITAS détecte le statut **PAID** via polling et active l'accès

### Pour un vrai test en prod (Cameroun)

1. Mettez `MTN_TARGET_ENV = 'mtncameroon'`
2. Devise = `XAF` (déjà automatique dans `payment_mtn.php`)
3. Entrez **votre vrai numéro MTN MoMo** (ex: 650 435 106)
4. Vérifiez votre téléphone → un USSD MoMo apparaît
5. Tapez votre **PIN MoMo** pour confirmer
6. ✅ Paiement confirmé en quelques secondes

---

## 🔍 Vérifier que ça fonctionne

### Côté admin (VÉRITAS)
- Allez dans **💰 Finances → Tentatives de paiement**
- La transaction MTN apparaît avec :
  - Le badge intent (📚 Livre / 🎓 Abonnement)
  - Statut **PAID** (vert)
  - `providerAuto: 'mtn_api'` dans les détails

### Côté serveur
- Bouton **« 📊 Voir les paiements API serveur »** dans Paramètres ouvre la liste JSON
- Le fichier `api/data/payments/_webhook_mtn_log.txt` contient les webhooks MTN

---

## ❓ Problèmes fréquents

| Erreur | Cause | Solution |
|---|---|---|
| `OAuth MTN échoué` | API User / Key / Subscription Key invalides | Recréez l'API User + récupérez la clé via curl |
| `HTTP 401 Unauthorized` | Subscription Key incorrecte ou expirée | Re-souscrivez au produit "Collection" |
| `HTTP 400 Bad request` | Numéro mal formaté | Le numéro doit être au format international : `2376XXXXXXXX` (sans le +) |
| Prompt jamais reçu sur le tel | Numéro pas MTN ou compte MoMo inactif | Tester d'abord avec un numéro sandbox |
| `TIMEOUT` après 60s | Client n'a pas validé son PIN | Réessayer ou utiliser un autre moyen |

---

## 💡 Avantage UX comparé à Orange

Avec **MTN MoMo Collection**, l'utilisateur **n'a aucune redirection** :
1. Il reste sur la page VÉRITAS
2. Tape son numéro MTN
3. Clique "Payer"
4. Sort son téléphone, tape son PIN
5. ✅ La page passe automatiquement au vert "Paiement confirmé"

C'est plus fluide qu'Orange (qui ouvre une nouvelle fenêtre vers webpayment.orange-money.com).

---

## 📞 Support

- **MTN MoMo Developer** : https://momodeveloper.mtn.com (Support → Contact)
- **Documentation Collection** : https://momodeveloper.mtn.com/docs/services/collection

---

## ✅ État final attendu

Une fois Orange + MTN configurés, votre client a **3 options** :
1. 📱 **MTN MoMo** : entre son numéro → reçoit prompt → confirme avec PIN (~30s)
2. 🟠 **Orange Money** : clique "Payer maintenant" → redirection vers Orange → PIN (~10s)
3. 💳 **Manuel** : copie le numéro et paie via USSD `*126#` ou `#150*1#`, puis WhatsApp à l'admin

L'option 1 et 2 sont **100% automatiques** (aucune validation admin nécessaire).
L'option 3 reste manuelle (validation admin requise).

---

*© 2026 Mythe Errant · Centre VÉRITAS · Douala, Cameroun*
