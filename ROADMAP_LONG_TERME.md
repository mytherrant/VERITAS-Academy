# 🚀 ROADMAP LONG TERME — VÉRITAS v2.0 et au-delà

> **Auteur** : Claude (Sonnet 4.7) — pour Jacques Miterand TAKOU
> **Date** : 24 mai 2026
> **Statut** : Documents de planification, non implémentés (nécessitent backend + budget)

---

## Vue d'ensemble

VÉRITAS v1.2 est aujourd'hui une PWA complète (Service Worker, manifest, lazy loading, Brotli) avec :
- ✅ Programme de parrainage frontend
- ✅ Stats business pour l'admin
- ✅ Interface bilingue FR/EN
- ✅ Devoir corrigé par IA
- ✅ Tour d'onboarding interactif

Ce qui reste pour passer en mode **"plateforme SaaS scalable"** : 6 chantiers majeurs documentés ci-dessous, chacun avec architecture cible, budget, et délai.

---

## 📦 ITEM #6 — Firebase Auth user-scoped (sécurité)

### Problème actuel
Token statique `VERITAS-CLOUD-2026-xK9m` hardcodé dans le HTML public → visible par tous les visiteurs.

### Solution cible
Migration complète vers **Firebase Authentication** + règles de sécurité Realtime DB.

### Architecture

```javascript
// AVANT (v1.2) — token statique partagé
const CLOUD_TOKEN = 'VERITAS-CLOUD-2026-xK9m';
fetch('https://veritas-school.com/api/sync.php', {
  headers: { 'Authorization': 'Bearer '+CLOUD_TOKEN }
});

// APRÈS (v2.0) — token user-scoped Firebase
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const auth = getAuth();
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const idToken = await userCredential.user.getIdToken();
fetch('https://veritas-school.com/api/sync.php', {
  headers: { 'Authorization': 'Bearer '+idToken }
});
```

### Étapes
1. **Activer Firebase Auth** dans le projet Firebase existant (déjà configuré pour Realtime DB)
2. **Migrer tous les comptes** `DB.visitorAccounts` + `DB.studentAccounts` vers Firebase Auth via script Node
3. **Refactor `_fbFetch`** pour utiliser `auth.currentUser.getIdToken()` au lieu du token statique
4. **Mettre à jour les Realtime DB Security Rules** :
   ```json
   {
     "rules": {
       "users": {
         "$uid": {
           ".read": "$uid === auth.uid",
           ".write": "$uid === auth.uid"
         }
       },
       "admin": {
         ".read": "auth.token.admin === true",
         ".write": "auth.token.admin === true"
       }
     }
   }
   ```
5. **Custom Claims** pour les admins via Firebase Admin SDK (Cloud Function)

### Délai et coût
- **Délai** : 2 semaines (1 dev senior)
- **Coût Firebase** : gratuit jusqu'à 10K utilisateurs/mois (Spark Plan)
- **Risque** : moyen — migration des comptes existants délicate

---

## 💸 ITEM #9 — Webhooks paiements MoMo/Orange (vrais paiements)

### Problème actuel
Validation manuelle dans `mPayAttempts()` — pas scalable au-delà de 50 paiements/mois.

### Solution cible
Webhooks signés depuis MTN MoMo Collection + Orange Money Cameroun API.

### Architecture cible (PHP backend)

```php
// api/webhook_momo.php
<?php
require_once 'db.php';

// 1. Vérifier la signature MTN
$headers = getallheaders();
$signature = $headers['X-Reference-Id'] ?? '';
$apiKey = getenv('MOMO_API_KEY');
$body = file_get_contents('php://input');
$expectedSig = hash_hmac('sha256', $body, $apiKey);
if (!hash_equals($expectedSig, $signature)) {
    http_response_code(401);
    exit(json_encode(['error' => 'Invalid signature']));
}

// 2. Idempotence — vérifier eventId pas déjà traité
$data = json_decode($body, true);
$eventId = $data['externalId'] ?? '';
$stmt = $pdo->prepare("SELECT id FROM payment_webhooks WHERE event_id = ?");
$stmt->execute([$eventId]);
if ($stmt->fetch()) {
    http_response_code(200);
    exit(json_encode(['status' => 'already_processed']));
}

// 3. Mettre à jour le paiement
$ref = $data['payerMessage'] ?? '';
$amount = (int)($data['amount'] ?? 0);
$status = $data['status'] ?? 'PENDING';

if ($status === 'SUCCESSFUL') {
    $stmt = $pdo->prepare("UPDATE payments SET statut = 'paid', webhook_verified = 1, validated_at = NOW() WHERE reference = ? AND montant = ?");
    $stmt->execute([$ref, $amount]);

    // Activer l'abonnement automatiquement
    activateSubscriptionForPayment($ref);
}

// 4. Log webhook
$stmt = $pdo->prepare("INSERT INTO payment_webhooks (provider, event_id, payload, processed, received_at) VALUES ('momo', ?, ?, 1, NOW())");
$stmt->execute([$eventId, $body]);

http_response_code(200);
echo json_encode(['status' => 'ok']);
```

### Étapes
1. **S'inscrire** sur https://momodeveloper.mtn.com → obtenir API User + API Key (sandbox puis production)
2. **S'inscrire** sur https://developer.orange.com → Orange Money Web Payment
3. **Implémenter** 2 endpoints :
   - `POST /api/webhook_momo.php` (callback MTN)
   - `POST /api/webhook_orange.php` (callback Orange)
4. **Modifier** `openPaymentModal` :
   - MoMo : appeler `requesttopay` API → renvoyer ID au frontend → utilisateur reçoit notif sur téléphone → webhook arrive
   - Orange : créer transaction → rediriger sur page Orange → callback
5. **Dashboard admin** `mPayAttempts` enrichi : badge "✅ Webhook vérifié" vs "⏳ En attente"

### Délai et coût
- **Délai** : 3 semaines
- **Coût** : ~1% par transaction MoMo + ~1% Orange (vs 2.9% Stripe)
- **Pré-requis** : enregistrement KYC des comptes pro Centre VÉRITAS chez MTN et Orange (~2 semaines admin)

---

## 🎓 ITEM #11 — Marketplace enseignants

### Concept
Plateforme où des enseignants externes (vérifiés) peuvent publier leurs cours/épreuves/livres et recevoir un pourcentage des ventes (modèle Udemy/Skillshare).

### Architecture
- **Table `teachers_marketplace`** : teacher_id, statut (pending/approved/banned), commission %, payout_method
- **Table `content_external`** : teacher_id, type (cours/quiz/livre), prix, ventes, revenue
- **Workflow validation** : admin VÉRITAS approuve chaque contenu avant publication
- **Payout mensuel** automatique via MoMo/Orange
- **Pourcentage** : 70/30 (70% enseignant, 30% VÉRITAS)

### Délai et coût
- **Délai** : 6 semaines (MVP)
- **Bénéfice** : passage de modèle "centre" à modèle "plateforme" — explosion du catalogue

---

## 📱 ITEM #12 — App mobile native (Android)

### Solution recommandée : **Capacitor.js**
- Wrapper Android (et iOS si budget) du HTML existant
- Accès natif aux notifs push, partage, camera
- Publication Play Store (25 $US une fois) + App Store (99 $US/an)

### Étapes
```bash
npm install -g @capacitor/cli @capacitor/core
npx cap init "VERITAS" "cm.veritas.app"
npx cap add android
# Copier VERITAS_v1.2.html dans www/
npx cap copy android
npx cap open android
# Builder l'APK via Android Studio
```

### Délai et coût
- **Délai** : 2 semaines
- **Coût** : 25 $US (Play Store) — gratuit ensuite
- **Bonus** : badges "Installer l'app" sur Google Play Store renforcent la crédibilité

---

## 🧠 ITEM #13 — IA Adaptative (parcours personnalisé)

### Concept
Algorithme qui analyse les performances de l'élève (notes, devoirs IA, quiz) et propose **dynamiquement** :
- Les chapitres à renforcer
- Les exercices au bon niveau
- Une planification de révisions optimisée (algorithme SM-2 — Anki)

### Architecture
```javascript
// Spaced Repetition (SM-2)
function nextReviewDate(card) {
  // Quality 0-5 selon réussite quiz
  let quality = card.lastQuiz.score / 20 * 5;
  if (quality < 3) {
    card.repetition = 0;
    card.interval = 1;
  } else {
    if (card.repetition === 0) card.interval = 1;
    else if (card.repetition === 1) card.interval = 6;
    else card.interval = Math.ceil(card.interval * card.easiness);
    card.repetition++;
    card.easiness = Math.max(1.3, card.easiness + (0.1 - (5-quality)*(0.08+(5-quality)*0.02)));
  }
  return Date.now() + card.interval * 24*60*60*1000;
}
```

### Délai et coût
- **Délai** : 4 semaines
- **Bonus** : différenciation forte vs concurrents camerounais

---

## 💬 ITEM #14 — Forum / Communauté

### Concept
Espace où élèves et enseignants posent des questions, partagent des fiches.

### Stack recommandée
- **Backend** : Discourse (open source, déployable sur le même VPS LWS) OU custom PHP simple
- **Intégration** : Single Sign-On avec les comptes VÉRITAS existants
- **Modération** : règles strictes + IA filtre messages inappropriés (Pollinations.ai déjà disponible)

### Délai et coût
- **Délai** : 3 semaines (avec Discourse) ou 6 semaines (custom)
- **Coût** : 0 € si auto-hébergé sur le VPS

---

## 🏢 ITEM #15 — Multi-tenant SaaS

### Concept
Héberger plusieurs centres scolaires sur la même infrastructure VÉRITAS, chacun avec :
- Sous-domaine dédié (`douala.veritas.cm`, `yaounde.veritas.cm`)
- Branding personnalisé (logo, couleurs)
- Comptabilité isolée
- Tarification mensuelle (10 000 - 50 000 FCFA selon volume)

### Architecture
- Ajout colonne `centre_id` sur toutes les tables SQL
- Middleware résolution sous-domaine → centre_id
- Panel super-admin VÉRITAS qui gère les centres clients

### Délai et coût
- **Délai** : 8-10 semaines (refactor majeur)
- **Bénéfice** : revenu récurrent SaaS — viser 20 centres clients = 600 000 FCFA/mois

---

## 📊 Tableau récapitulatif

| Item | Priorité | Délai | Coût | Bénéfice |
|---|---|---|---|---|
| #6 Firebase Auth | 🔴 Haute | 2 sem | Gratuit | Sécurité critique |
| #9 Webhooks paiements | 🔴 Haute | 3 sem | ~1% TX | Scalabilité paiements |
| #11 Marketplace enseignants | 🟠 Moyenne | 6 sem | Dev only | +50% catalogue |
| #12 App mobile | 🟠 Moyenne | 2 sem | 25 $US | +30% engagement |
| #13 IA adaptative | 🟢 Basse | 4 sem | Dev only | Différenciation |
| #14 Forum | 🟢 Basse | 3 sem | Gratuit | Engagement |
| #15 Multi-tenant SaaS | 🔵 Stratégique | 8-10 sem | Dev only | Revenu récurrent |

**Total budget développement** : ~28 semaines de dev (~7 mois solo, ~3 mois avec équipe de 2)
**Total coût infrastructure** : ~15 000 FCFA/mois (VPS + domaines + S3)

---

## 🎯 Recommandations finales

### Ordre d'exécution suggéré
1. **#6 Firebase Auth** (sécurité d'abord — semaines 1-2)
2. **#9 Webhooks paiements** (scaler les revenus — semaines 3-5)
3. **#12 App mobile Android** (visibilité Play Store — semaines 6-7)
4. **#15 Multi-tenant SaaS** (refactor pour le revenu récurrent — semaines 8-17)
5. **#11 Marketplace** + **#13 IA adaptative** + **#14 Forum** (croissance — semaines 18-28)

### Quand commencer
- **Maintenant** : valider que la v1.2 fonctionne en production (au moins 1 mois de stabilité)
- **Mois +1** : démarrer #6 Firebase Auth si plus de 100 utilisateurs actifs
- **Mois +2** : démarrer #9 Webhooks dès que les revenus dépassent 100 000 FCFA/mois
- **Mois +3 et après** : les autres items selon priorités business

---

*© 2026 Mythe Errant · Centre VÉRITAS · Douala, Cameroun*
*Roadmap rédigée par Claude (Anthropic) — Sonnet 4.7 — 24 mai 2026*
