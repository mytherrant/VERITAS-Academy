# 💰 Guide — Système Paiement Partenaires VÉRITAS

> **Version** : v2.8 (2026)
> **Module** : Splits automatiques + versements MoMo/Orange
> **Cible** : admin VÉRITAS (Jacques Miterand TAKOU)

---

## 🎯 Vue d'ensemble

VÉRITAS rémunère automatiquement 3 types de partenaires :

| Partenaire | Sur quoi ? | Part par défaut |
|---|---|---|
| **Parrain** (utilisateur qui invite un ami) | Abonnement du filleul | **10%** |
| **Parrain** | Achat boutique du filleul | **5%** |
| **Auteur** | Vente de son livre/manuel | **60%** |
| **Auteur** | Vente de sa ressource | **60%** |
| **Enseignant marketplace** | Vente de son cours/quiz | **70%** |

VÉRITAS conserve **40%** sur les livres/ressources et **30%** sur la marketplace enseignant.

---

## 🔧 Architecture technique (3 phases)

### Phase 1 — Tracking automatique ✅ ACTIF

Quand un paiement est validé (`_payMarkPaid`), la fonction `_computeSplits` :
1. Détecte le contexte (abonnement / livre / marketplace)
2. Trouve le partenaire concerné (parrain / auteur / enseignant)
3. Calcule sa part selon les % configurés
4. Enregistre dans `DB.splits[]` avec `etat: 'pending'`
5. Cumule dans `DB.partenairesSplit[id].solde`

**Aucune action humaine requise** à ce stade. Tout est automatique au moment du paiement.

### Phase 2 — Versement manuel ✅ ACTIF

L'admin a une page **Finances → Partage revenus partenaires** qui affiche :
- Solde dû à chaque partenaire
- Bouton "💰 Verser" si solde ≥ 500 FCFA (seuil anti-frais)
- Détail des splits par partenaire

**Workflow versement manuel** :
1. Admin clique "Verser" sur un partenaire
2. Modal demande : téléphone MoMo, opérateur, note
3. Admin confirme → l'app :
   - Marque tous les splits du partenaire comme `paid`
   - Ajoute au `totalVerse`
   - Reset le `solde` à 0
   - **Ouvre WhatsApp avec message pré-rempli** : "✅ Versement de X FCFA effectué à votre MoMo. Réf: XXX. Merci !"
4. Admin envoie l'argent via son app MoMo/Orange perso
5. Admin envoie le WhatsApp de confirmation au partenaire

**Avantages** : contrôle, anti-fraude, traçabilité.
**Inconvénient** : nécessite une action manuelle par partenaire.

### Phase 3 — Versement automatique 🚧 SCAFFOLDING

À activer quand Jacques aura souscrit aux **Disbursement APIs**.

#### MTN MoMo Disbursement API

**Inscription** :
1. Aller sur https://momodeveloper.mtn.com
2. Souscrire à **Disbursement** (en plus de Collection)
3. KYC entreprise (compte VÉRITAS Pro)
4. Obtenir `Subscription Key` Disbursement

**Configuration backend** dans `api/payment_config.php` :
```php
// MTN MoMo Disbursement (ajouter ces lignes)
define('MTN_DISBURSEMENT_KEY', 'votre_subscription_key_disbursement');
define('MTN_DISBURSEMENT_USER', 'api_user_id');
define('MTN_DISBURSEMENT_PWD', 'api_key');
define('MTN_DISBURSEMENT_TARGET', 'sandbox'); // ou 'mtncameroon'
```

**Création endpoint** `api/disbursement_mtn.php` :
```php
<?php
require_once 'payment_config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$tel = preg_replace('/[^0-9]/', '', $data['tel'] ?? '');
$montant = intval($data['montant'] ?? 0);
$ref = $data['ref'] ?? uniqid('vrt_dis_');

// 1. Obtenir token Disbursement
$tokenResp = file_get_contents('https://sandbox.momodeveloper.mtn.com/disbursement/token/', false, stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => [
            'Authorization: Basic ' . base64_encode(MTN_DISBURSEMENT_USER . ':' . MTN_DISBURSEMENT_PWD),
            'Ocp-Apim-Subscription-Key: ' . MTN_DISBURSEMENT_KEY
        ]
    ]
]));
$token = json_decode($tokenResp, true)['access_token'] ?? null;

// 2. Initier le transfert
$transferId = uniqid();
$body = json_encode([
    'amount' => (string)$montant,
    'currency' => 'XAF',
    'externalId' => $ref,
    'payee' => ['partyIdType' => 'MSISDN', 'partyId' => $tel],
    'payerMessage' => 'VERITAS Versement Partenaire',
    'payeeNote' => 'Merci pour votre collaboration VERITAS'
]);

$ctx = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => [
            'Authorization: Bearer ' . $token,
            'X-Reference-Id: ' . $transferId,
            'X-Target-Environment: ' . MTN_DISBURSEMENT_TARGET,
            'Ocp-Apim-Subscription-Key: ' . MTN_DISBURSEMENT_KEY,
            'Content-Type: application/json'
        ],
        'content' => $body
    ]
]);
$result = file_get_contents('https://sandbox.momodeveloper.mtn.com/disbursement/v1_0/transfer', false, $ctx);
echo json_encode(['ok' => true, 'transferId' => $transferId, 'ref' => $ref]);
```

#### Orange Money Web Payment Cashout API

Orange Money n'a pas de Disbursement API publique au Cameroun en 2026. Solution alternative :
- Utiliser **API Orange Money Mobile** (interne, nécessite partenariat Orange CM)
- OU continuer manuel via app Orange Money

**Contact Orange CM** : business@orange.cm

---

## 📊 Workflow complet (Phase 2 — actuel)

### Côté admin (vous)

1. **Configuration initiale** (1 fois)
   - Aller dans Finances → Partage revenus partenaires
   - Vérifier les pourcentages (10% parrain abo, 60% auteur, 70% enseignant)
   - Ajuster si besoin

2. **Quotidien / Hebdomadaire**
   - Les ventes génèrent automatiquement des splits
   - Consulter le tableau de bord pour voir les soldes à verser
   - Quand un partenaire atteint 500+ FCFA → bouton "Verser" devient actif

3. **Versement** (manuel)
   - Cliquer "Verser" → modal s'ouvre
   - Vérifier téléphone MoMo du partenaire
   - Choisir opérateur (MTN ou Orange)
   - Confirmer → WhatsApp s'ouvre avec message pré-rempli
   - **Vous** envoyez l'argent depuis votre app MoMo/Orange perso
   - **Vous** envoyez le WhatsApp au partenaire pour confirmation

### Côté partenaire (parrain/auteur)

1. S'inscrit normalement (compte gratuit suffit)
2. Vente/parrainage → split auto-calculé
3. Reçoit l'argent + WhatsApp confirmation
4. Peut voir son solde dans son compte (à ajouter — Phase 4)

---

## 📋 Modèle de données

### `DB.splits[]`
```javascript
{
  id: 'gid',
  paymentRef: 'VT...',
  type: 'parrainage' | 'auteur_livre' | 'enseignant_cours',
  partenaireId: 'va_...' ou 'tch_...' ou 'aut_...',
  description: 'Vente livre : Mon Œuvre',
  montantBase: 5000,
  pct: 60,
  montant: 3000,
  etat: 'pending' | 'paid',
  createdAt: timestamp,
  versementId: 'gid' (si versé),
  paidAt: timestamp (si versé)
}
```

### `DB.partenairesSplit{}`
```javascript
{
  'va_user123': {
    solde: 4500,           // À verser
    totalVerse: 12000,     // Cumul versé
    splits: ['gid', 'gid'], // IDs des splits en attente
    lastVersement: timestamp
  }
}
```

### `DB.versements[]`
```javascript
{
  id: 'gid',
  partenaireId: 'va_...',
  nom: 'Jean Mballa',
  tel: '+237 670 12 34 56',
  operateur: 'mtn' | 'orange',
  montant: 4500,
  note: 'Janvier 2026',
  mode: 'manuel' | 'auto',
  splitIds: ['gid', 'gid'],
  date: timestamp,
  statut: 'effectue' | 'echec'
}
```

### `DB._splitConfig` (configuration des %)
```javascript
{
  parrain_abo: 10,
  parrain_boutique: 5,
  auteur_livre: 60,
  auteur_ressource: 60,
  enseignant_cours: 70
}
```

---

## 🚀 Étapes activation (à faire par Jacques)

### ✅ Aujourd'hui (Phase 1 + 2 — gratuit)

- [x] **Vérifier la page admin** : Finances → Partage revenus partenaires
- [x] **Ajuster les % si besoin** (10/60/70 par défaut)
- [ ] **Tester un parrainage** : créer 2 comptes test, l'un parraine l'autre, faire un achat → vérifier que le split apparaît
- [ ] **Faire le 1er versement** (quand un partenaire atteint 500 FCFA)
- [ ] **Communiquer aux partenaires** : leur dire qu'ils seront payés par MoMo/Orange chaque [semaine/mois]

### 🚧 D'ici 1-2 mois (Phase 3 — automatique)

- [ ] Souscrire MTN MoMo Disbursement API (https://momodeveloper.mtn.com)
- [ ] Compléter KYC entreprise
- [ ] Ajouter les credentials Disbursement dans `payment_config.php`
- [ ] Créer endpoint `api/disbursement_mtn.php` (code template fourni ci-dessus)
- [ ] Tester en sandbox d'abord
- [ ] Activer le mode "auto" dans le modal versement
- [ ] (Optionnel) Configurer un cron qui verse automatiquement tous les soldes ≥ 500 FCFA chaque dimanche

### 💼 Long terme (Phase 4)

- [ ] **Espace partenaire** : page dédiée pour chaque partenaire pour voir ses splits/versements
- [ ] **Demande de versement** : partenaire peut demander un versement (au lieu d'attendre que admin le fasse)
- [ ] **Statistiques avancées** : top 10 parrains, top 10 auteurs, courbe revenus
- [ ] **Reporting fiscal** : export Excel mensuel pour déclaration impôts

---

## 💡 Conseils stratégiques

1. **Communiquer la rémunération** : afficher sur la page parrainage "Gagnez 10% sur chaque abonnement de votre filleul". Sur la page auteur : "Touchez 60% sur vos ventes". Cela motive énormément.

2. **Versements réguliers** : payer tous les **dimanches** ou **fin de mois** crée confiance. Le partenaire attend ce jour-là.

3. **Notification WhatsApp obligatoire** : un message du type "✅ VÉRITAS a versé X FCFA sur votre MoMo" est plus puissant qu'une simple notification in-app. Le bouche-à-oreille suivra.

4. **Seuil minimum** : 500 FCFA évite de payer des frais MoMo (1%) sur de très petits montants. Pour un partenaire qui gagne 50 FCFA, attendre qu'il accumule à 500 FCFA est plus rentable pour tout le monde.

5. **Transparence totale** : permettre au partenaire de voir son historique = confiance long terme.

---

## ⚠️ Limitations actuelles à connaître

1. **Pas de split natif** : on encaisse tout puis on redistribue (pas de vraie transaction parallèle comme Stripe Connect)
2. **Versement manuel pour démarrer** : nécessite l'action de Jacques (Phase 2)
3. **Frais MoMo sortants** : ~1% par versement (à anticiper dans le calcul)
4. **Délais** : versement manuel en quelques minutes vs auto en ~30 secondes

Avec une centaine de partenaires actifs, **manuel devient long** → c'est le signal pour passer à Phase 3 (Disbursement automatique).

---

*© 2026 Mythe Errant · Centre VÉRITAS Academy · Douala, Cameroun*
*Document interne — Système v2.8 partage revenus partenaires*
