# 🚀 GUIDE ULTRA-CONCRET — Mise en service Orange + MTN

> **Objectif :** vous accompagner clic par clic, de zéro jusqu'au premier paiement automatique réussi.
> **Temps estimé :** 30 à 45 minutes pour Orange, 30 minutes pour MTN.

---

## 📋 PRÉREQUIS — Récupérer vos identifiants FTP LWS

Vous aurez besoin du **login et mot de passe FTP** de votre hébergement LWS pour uploader les fichiers PHP.

### Où les trouver ?

1. Allez sur **https://panel.lws.fr** → connectez-vous
2. **Mes hébergements** → cliquez sur **veritas-school.com**
3. Section **« Gestion FTP »** (menu de gauche)
4. Vous verrez :
   - **Serveur FTP** : `ftp.veritas-school.com` (ou un IP)
   - **Utilisateur FTP** : `verit2781684` (ou similaire)
   - **Mot de passe** : caché → cliquez sur **« Réinitialiser le mot de passe »** si vous l'avez perdu

✅ Notez les 3 valeurs.

### Configurer `deployer.ps1`

1. Sur votre PC, ouvrez **`C:\Users\Mythe Errant\Downloads\Claude code\deployer.ps1`** avec le Bloc-notes
2. Modifiez les 3 premières lignes :

```powershell
$FTP_HOST = "ftp.veritas-school.com"      # ← votre serveur FTP
$FTP_USER = "verit2781684"                # ← votre login FTP
$FTP_PASS = "votre-mot-de-passe-ftp"      # ← votre mot de passe
```

3. Sauvegardez (Ctrl+S)

---

# 🟠 PARTIE 1 — Activer Orange Money

## ÉTAPE 1.1 — Récupérer les 3 credentials Orange (10 min)

### a) Créer/ouvrir votre application

1. https://developer.orange.com → **Sign in** (connectez-vous)
2. Menu en haut à droite : **Mes applications** (ou "My apps")
3. Si vous n'avez pas encore d'application :
   - Cliquez sur **« + New application »**
   - Nom : `VERITAS Academy`
   - Description : `Application de gestion scolaire avec paiements e-learning`
   - **Create**

### b) Souscrire à Orange Money WebPayment Cameroon

1. Dans votre application → onglet **« APIs »** ou **« Products »**
2. Bouton **« Add API »** ou **« Subscribe »**
3. Dans la liste, cherchez : **`Orange Money WebPayment Cameroon`**
4. Cliquez **« Subscribe »**

> ⚠️ **Si vous ne voyez pas le produit Cameroun** : ce service n'est pas auto-souscrible, il faut faire la demande commerciale à Orange Cameroun.
> 📧 Écrivez à : **orange-developer-cm@orange.com**
> Sujet : `Demande accès API Orange Money WebPayment Cameroon`
> Précisez : votre numéro Orange Money commerçant (+237 697 637 739), votre raison sociale (Centre VÉRITAS).
> Délai : 3-7 jours ouvrés.

### c) Copier les 3 valeurs

Une fois souscrit, sur la page de l'application vous verrez :

```
┌────────────────────────────────────────────┐
│  Application: VERITAS Academy              │
│                                            │
│  Client ID:                                │
│  ┌──────────────────────────────────────┐  │
│  │ ABcdEFgh1234IjkL5678MnoP9012qrSTuvWX │  │  ← COPIEZ
│  └──────────────────────────────────────┘  │
│                                            │
│  Client Secret:                            │
│  ┌──────────────────────────────────────┐  │
│  │ ••••••••••••••• [👁 Show]           │  │  ← Cliquez "Show" et COPIEZ
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

✅ **Notez les 3 valeurs** sur un bout de papier (ou dans Notepad temporairement) :
- `ORANGE_CLIENT_ID` = `____________________`
- `ORANGE_CLIENT_SECRET` = `____________________`
- `ORANGE_MERCHANT_KEY` = `____________________` *(fourni séparément par email d'Orange)*

> 💡 **Si vous ne voyez pas Merchant Key** : c'est normal, il vous est envoyé séparément par Orange après vérification de votre compte commerçant. Patientez quelques jours après votre demande.

---

## ÉTAPE 1.2 — Premier upload des fichiers PHP (5 min)

### Méthode A — via le script PowerShell (recommandé)

1. Sur votre PC, ouvrez `deployer.ps1` avec le Bloc-notes
2. Trouvez cette ligne (vers la ligne 75) :

```powershell
# UploadTo "api/payment_config.php"  "api/payment_config.php"
```

3. **Retirez le `#`** pour décommenter — uniquement pour ce premier upload :

```powershell
UploadTo "api/payment_config.php"  "api/payment_config.php"
```

4. Sauvegardez le fichier
5. **Clic-droit sur `deployer.ps1` → Exécuter avec PowerShell**
6. Vous devriez voir :

```
🚀 VÉRITAS — Déploiement FTP
  ✓ VERITAS_v1.2.html → app.html
  ✓ VERITAS_v1.2.html → index.html
  ✓ index.php → index.php
  🔌 API PHP — paiements & sync...
  ✓ api/payment_orange.php → api/payment_orange.php
  ✓ api/payment_mtn.php → api/payment_mtn.php
  ✓ api/payment_config.php → api/payment_config.php
  ✅ Terminé
```

7. **IMPORTANT** : remettez le `#` devant la ligne `UploadTo "api/payment_config.php"` pour ne pas écraser vos credentials lors des prochains déploiements.

### Méthode B — via le gestionnaire de fichiers LWS (alternative)

1. https://panel.lws.fr → Mes hébergements → **veritas-school.com**
2. **Gestionnaire de fichiers** → naviguez vers `/htdocs/api/`
3. Cliquez **« Téléverser »** (icône ⬆️)
4. Sélectionnez les 3 fichiers de votre PC :
   - `C:\Users\Mythe Errant\Downloads\Claude code\api\payment_orange.php`
   - `C:\Users\Mythe Errant\Downloads\Claude code\api\payment_mtn.php`
   - `C:\Users\Mythe Errant\Downloads\Claude code\api\payment_config.php`
5. Validez l'upload

---

## ÉTAPE 1.3 — Éditer `payment_config.php` sur le serveur (5 min)

⚠️ **TRÈS IMPORTANT** : on édite la version qui est sur LWS, **pas** celle de votre PC (elle resterait avec les placeholders pour ne pas exposer les secrets).

1. https://panel.lws.fr → **Gestionnaire de fichiers** → `/htdocs/api/`
2. Clic-droit sur **`payment_config.php`** → **Éditer**
3. Trouvez les 3 lignes Orange et remplacez :

```php
// AVANT
define('ORANGE_CLIENT_ID',     'À_REMPLIR_DEPUIS_DEVELOPER_ORANGE');
define('ORANGE_CLIENT_SECRET', 'À_REMPLIR_DEPUIS_DEVELOPER_ORANGE');
define('ORANGE_MERCHANT_KEY',  'À_REMPLIR_DEPUIS_DEVELOPER_ORANGE');

// APRÈS (collez vos valeurs)
define('ORANGE_CLIENT_ID',     'ABcdEFgh1234IjkL5678MnoP9012qrSTuvWX');
define('ORANGE_CLIENT_SECRET', 'votre-vrai-client-secret-ici');
define('ORANGE_MERCHANT_KEY',  'votre-merchant-key-fourni-par-orange');
```

4. Vérifiez que ces lignes sont correctes :

```php
define('PUBLIC_BASE_URL',      'https://veritas-school.com');   // ← votre domaine
define('PUBLIC_FRONTEND_URL',  'https://veritas-school.com');
define('ORANGE_CURRENCY',      'OUV');   // ← OUV en test, XAF en production
```

5. **Sauvegardez** le fichier (Ctrl+S ou bouton "Save")

---

## ÉTAPE 1.4 — Déclarer le webhook chez Orange (3 min)

C'est l'URL qu'Orange va appeler quand un paiement est validé.

1. Retournez sur https://developer.orange.com → votre application
2. Cherchez l'onglet **« Notification settings »**, **« Webhooks »**, ou **« Callback URL »**
3. Renseignez :

```
https://veritas-school.com/api/payment_orange.php?action=notify
```

4. Sauvegardez

> 💡 Si vous ne trouvez pas cet onglet : c'est qu'Orange utilise le `notif_url` envoyé à chaque appel `init`. Dans ce cas, **rien à configurer** — c'est déjà fait dans le code `payment_orange.php`.

---

## ÉTAPE 1.5 — Activer Orange API dans VÉRITAS (1 min)

1. Ouvrez https://veritas-school.com (ou votre app locale)
2. Connectez-vous en **admin** (jacques / veritas2026 par défaut)
3. Menu de gauche : **⚙️ Système → Paramètres école**
4. Descendez jusqu'à la carte **« ⚡ Paiements API automatiques »**
5. **Cochez** la case :
   - ☑️ 🟠 Activer le bouton "⚡ Payer maintenant (auto)" pour Orange Money
6. Toast vert : `🟠 Orange API activée`

---

## ÉTAPE 1.6 — Test avec 100 FCFA (5 min)

### a) Tester la connexion serveur

Dans **Paramètres → ⚡ Paiements API automatiques**, cliquez sur **« 🔌 Tester Orange »**.

✅ **Toast attendu** : `🟠 Orange : {"status":"unknown","ref":"TEST"}`
→ ça signifie que le serveur PHP répond. Parfait.

❌ **Si erreur** : vérifiez que :
- `payment_config.php` est bien sur LWS dans `/htdocs/api/`
- Le fichier a les bonnes permissions (chmod 644 ou 755)
- L'URL `DB.cloudConfig.url` est bien définie dans VÉRITAS (Paramètres → Cloud)

### b) Premier paiement sandbox

1. Déconnectez-vous (mode visiteur)
2. **Inscrivez-vous** comme visiteur ou utilisez un compte existant
3. **Boutique** → choisissez un livre OU créez un produit test à **100 FCFA**
4. Cliquez **« Acheter »**
5. Dans le modal de paiement, sur la carte **🟠 Orange Money** :
   - Vous voyez le badge vert **⚡ AUTO**
   - Cliquez sur **« ⚡ Payer maintenant (auto) »**
6. Une nouvelle fenêtre s'ouvre sur **webpayment.orange-money.com**
7. En sandbox, utilisez le numéro de test fourni par Orange (généralement `0000` ou `123456`)
8. Validez

### c) Vérification

- Retour dans VÉRITAS : le bandeau passe au vert **« ✅ Paiement confirmé ! »**
- **Notification admin** : 🔔 cloche en haut à droite avec **« ✅ Paiement Orange auto-confirmé »**
- **Admin → 💰 Finances → Tentatives de paiement** : la transaction est en vert **PAID**

🎉 **Bravo !** Vous avez votre premier paiement automatique fonctionnel.

---

## ÉTAPE 1.7 — Passer en production (quand prêt)

1. Sur **payment_config.php** (LWS), changez :

```php
define('ORANGE_CURRENCY',      'XAF');   // ← passe de OUV à XAF
```

2. Confirmez que vos credentials Orange sont bien ceux de **production** (pas sandbox)
3. Testez avec un vrai paiement de **100 FCFA** depuis votre propre Orange Money
4. C'est tout — vous êtes en prod ! 🚀

---

# 📱 PARTIE 2 — Activer MTN MoMo (après Orange)

## ÉTAPE 2.1 — Récupérer la Subscription Key MTN

1. https://momodeveloper.mtn.com → connectez-vous → **Profile** (en haut à droite)
2. Vous verrez **Primary Key** et **Secondary Key**
3. **Copiez la Primary Key** (= `MTN_SUBSCRIPTION_KEY`)

## ÉTAPE 2.2 — Souscrire au produit Collection

1. Menu **« Produits »** → **Collection**
2. Cliquez **« Subscribe »**

## ÉTAPE 2.3 — Créer un API User + API Key (sandbox)

> 💡 Cette étape se fait avec `curl` ou Postman. Si vous n'avez pas curl, installez-le ou utilisez **https://reqbin.com** (interface web).

### a) Générer un UUID v4

Allez sur **https://www.uuidgenerator.net** → copiez l'UUID affiché (ex: `8d8e4f8c-1a2b-3c4d-5e6f-7g8h9i0j1k2l`).

### b) Créer l'API User (Powershell ou Bash)

**Sous Windows PowerShell** :

```powershell
$uuid = "8d8e4f8c-1a2b-3c4d-5e6f-7g8h9i0j1k2l"    # ← VOTRE UUID v4
$key  = "votre-primary-key-de-mtn"                  # ← VOTRE Subscription Key

curl -X POST "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser" `
  -H "X-Reference-Id: $uuid" `
  -H "Ocp-Apim-Subscription-Key: $key" `
  -H "Content-Type: application/json" `
  -d '{\"providerCallbackHost\":\"veritas-school.com\"}'
```

✅ Si tout va bien : **HTTP 201 Created** (pas de corps de réponse — c'est normal)

### c) Récupérer l'API Key

```powershell
curl -X POST "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/$uuid/apikey" `
  -H "Ocp-Apim-Subscription-Key: $key"
```

✅ Vous recevez : `{"apiKey":"abc123def456..."}`

## ÉTAPE 2.4 — Éditer `payment_config.php` (sur LWS)

```php
define('MTN_API_USER',         '8d8e4f8c-1a2b-3c4d-5e6f-7g8h9i0j1k2l');  // votre UUID
define('MTN_API_KEY',          'abc123def456...');                       // depuis le curl
define('MTN_SUBSCRIPTION_KEY', 'votre-primary-key-de-mtn');               // Profile MTN
define('MTN_TARGET_ENV',       'sandbox');                                 // 'mtncameroon' en prod
define('MTN_API_BASE',         'https://sandbox.momodeveloper.mtn.com');  // production: 'https://proxy.momoapi.mtn.com'
```

## ÉTAPE 2.5 — Activer dans VÉRITAS

Paramètres → ⚡ Paiements API → ☑️ **Activer MTN MoMo**

## ÉTAPE 2.6 — Test avec numéro sandbox

Numéros de test MTN sandbox :
- `46733123450` → ✅ Succès simulé
- `46733123451` → ❌ Rejeté

1. Boutique → choisissez un produit
2. Modal de paiement → carte **📱 MTN Mobile Money** → badge **⚡ AUTO**
3. Tapez `46733123450` dans l'input
4. Cliquez **« ⚡ Payer avec mon MTN MoMo »**
5. Au bout de ~5s, le statut passe à **✅ Paiement confirmé**

---

# 🆘 EN CAS DE PROBLÈME

## Le bouton "⚡ Payer maintenant" n'apparaît pas

→ Vérifiez que vous avez bien **coché la case** dans Paramètres → Paiements API.

## Erreur "Configuration cloud manquante"

→ Allez dans **Paramètres → ☁️ VÉRITAS Cloud — Synchronisation en ligne** et renseignez :
- URL du serveur API : `https://veritas-school.com/api`
- Clé API : `VOTRE_SECRET_DE_SYNC` (la même que `PAY_API_SECRET` dans payment_config.php)

## Erreur "OAuth Orange échoué"

→ Vos credentials Orange dans `payment_config.php` sur LWS sont incorrects.
Vérifiez bien Client ID, Client Secret, Merchant Key.

## Erreur "HTTP 401 Unauthorized" en consultant `?action=list`

→ Le `PAY_API_SECRET` dans `payment_config.php` ≠ `DB.cloudConfig.secret` dans VÉRITAS.
Alignez les 2 valeurs.

## Webhook jamais reçu / paiement reste "pending"

→ 2 causes possibles :
1. L'URL webhook n'est pas accessible publiquement (testez en l'ouvrant dans un navigateur)
2. Le firewall LWS bloque les requêtes entrantes d'Orange/MTN
→ **Solution** : le polling côté frontend récupère quand même le statut en interrogeant directement Orange/MTN toutes les 5s, donc ce n'est pas bloquant pour vous.

## Voir les logs détaillés

- **Webhooks Orange reçus** : LWS → `/htdocs/api/data/payments/_webhook_log.txt`
- **Webhooks MTN reçus** : LWS → `/htdocs/api/data/payments/_webhook_mtn_log.txt`
- **Tous les paiements** : bouton "Voir les paiements API serveur" dans VÉRITAS

---

# 📞 Contacts utiles

| Service | Contact |
|---|---|
| Orange Developer Cameroun | orange-developer-cm@orange.com |
| MTN MoMo Support | https://momodeveloper.mtn.com → menu Support |
| LWS Support | https://aide.lws.fr · 03 66 88 03 88 |

---

*© 2026 Mythe Errant · Centre VÉRITAS · Douala, Cameroun*
*Pour toute question, ouvrez Claude Code dans ce dossier — la doc est lue automatiquement.*
