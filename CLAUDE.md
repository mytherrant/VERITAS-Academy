# VÉRITAS — Guide Claude Code

> **Projet** : Centre VÉRITAS — application de gestion scolaire single-file HTML/JS
> **Propriétaire** : Jacques Miterand TAKOU, Yaoundé, Cameroun
> **Version courante** : v39.2 (fichier `VERITAS_v39_2.html`)
> **Architecture** : HTML/CSS/JS vanilla dans un seul fichier, stockage `localStorage` + `IndexedDB` pour les fichiers binaires
> **Dernière mise à jour** : avril 2026

---

## 1. Vue d'ensemble

VÉRITAS est une application web autonome (pas de backend, pas d'installation) qui tient **dans un seul fichier HTML de ~1,2 Mo**. Elle gère un centre de tutorat/répétition : élèves, enseignants, notes, paiements, bulletins APC, boutique de manuels, e-learning avec abonnements, jeux éducatifs, cartes mentales littéraires, et un espace visiteur public avec authentification.

**Design** : palette bleu nuit + or (`#142554` / `#FFC93C`), typographie Space Grotesk + Libre Baskerville + Inter. Thème "cream/ivory" pour les bulletins imprimables.

### Ce qui distingue ce projet des templates habituels

- **Zéro dépendance serveur** — tout tourne dans le navigateur. Trois CDN externes seulement : html2canvas, jsPDF, xlsx (SheetJS).
- **Un seul fichier** — toute modification se fait directement dans `VERITAS_v39_2.html`. Pas de build, pas de bundler, pas de framework.
- **Persistance hybride** — les données relationnelles (élèves, notes, paiements) sont dans `localStorage` sous la clé `VERITAS_DB`. Les fichiers binaires volumineux (vidéos, PDFs) sont dans IndexedDB via des helpers `idbSaveFile` / `idbGetFile`.
- **Un gros script** — le bloc `<script>` principal commence à la ligne ~1152 et contient ~20 000 lignes. Tout le reste du fichier est du CSS (~1000 lignes) et la coquille HTML.

---

## 2. Démarrage rapide

```bash
# Ouvrir le fichier — c'est tout
open VERITAS_v39_2.html
# ou double-cliquer depuis l'explorateur de fichiers
```

Pour développer :

```bash
# Lancer un serveur local pour éviter les restrictions file://
python3 -m http.server 8000
# puis http://localhost:8000/VERITAS_v39_2.html
```

**Comptes par défaut** (à changer — voir section Sécurité) :
- Super-admin : `jacques` / `veritas2026`
- Admin : `admin` / `admin123`
- Visiteur : inscription libre depuis la page d'accueil

---

## 3. Architecture

### 3.1 Structure du fichier

```
VERITAS_v39_2.html
├─ <head>
│  ├─ Meta + favicon inline
│  ├─ CDN scripts (html2canvas, jsPDF, xlsx)
│  ├─ <script> de chargement QR code (~ligne 11)
│  └─ <style> CSS principal (~lignes 25-1025)
├─ <body>
│  ├─ Header visiteur + navigation
│  ├─ #vContent (zone de rendu dynamique)
│  ├─ #login, #app (espaces admin/enseignant/élève)
│  ├─ Modales réutilisables
│  └─ <script> principal (lignes 1152-14200)
│     ├─ Constantes & helpers (~1152-1700)
│     ├─ Base de données par défaut (defaultDB)
│     ├─ Fonctions de rendu par page (pg*)
│     ├─ Fonctions modales (m*)
│     ├─ JEUX_CATALOGUE + LITT_OEUVRES
│     └─ Module paiements (fin de fichier)
└─ </html>
```

### 3.2 L'objet `DB` (état global)

`DB` est une variable JavaScript globale synchronisée avec `localStorage`. Sa forme complète est visible dans `defaultDB()` (~ligne 1196). Principaux champs :

```js
DB = {
  school: { nom, ville, slogan, logo, ... },     // identité de l'établissement
  publicInfo: { slogan, description, ... },      // affichage page visiteur
  students: [...],                                // { id, mat, nom, pre, cls, ... }
  teachers: [...],                                // { id, nom, pre, mat2, sal, ... }
  grades: [...],                                  // { id, eid, sub, n1, n2, coef, tri }
  payments: [...],                                // { id, eid, mnt, date, tri, stat }
  absences: [...],                                // { id, eid, date, matiere, motif }
  books: [...],                                   // boutique de manuels
  bookPurchases: [...],                           // historique achats élèves
  bookReviews: [...],                             // notations par les élèves
  devoirs: [...],                                 // devoirs proposés par enseignants
  submissions: [...],                             // soumissions des élèves
  elearning: {
    plans: [],                                    // packs d'abonnement (prix, avantages)
    categories: [],
    contenus: [],                                 // épreuves, cours, vidéos
    abonnements: [],                              // souscriptions actives
    commandes: []
  },
  visitorAccounts: [],                            // comptes visiteurs inscrits
  visitorOrders: [],                              // commandes boutique visiteur
  packs: [],                                      // packs personnalisés admin
  promoCodes: [],                                 // codes de réduction
  introVideo: { src, mime, ... },                 // vidéo d'accueil (data: ou YouTube)
  tickerItems: [...],                             // messages défilants
  calendrier: [...],                              // événements
  partenaires: [],
  payAttempts: [],                                // NOUVEAU v39.2 : tentatives de paiement
  notifications: [...]
}
```

**Persistance** : `save()` sérialise `DB` en JSON et le stocke dans `localStorage.VERITAS_DB`. Au chargement, `loadDB()` restaure. `defaultDB()` fournit les valeurs initiales pour un premier lancement.

### 3.3 La session `SES`

```js
SES = {
  type: 'admin' | 'superadmin' | 'enseignant' | 'eleve' | 'visiteur' | 'visiteur_inscrit',
  id: 'user_id',
  nom, pre, ...
}
```

Stockée dans `sessionStorage.VERITAS_SES`. Utilisée partout pour le contrôle d'accès via :
- `iA()` → est admin/superadmin
- `isSA()` → est superadmin
- `isEleve()` → est élève
- `isEnseignant()` → est enseignant

---

## 4. Conventions et helpers

### 4.1 Helpers de rendu et DOM

Ces helpers null-safe ont été introduits progressivement et sont **à utiliser systématiquement** :

| Helper | Rôle | Exemple |
|---|---|---|
| `_ge(id)` | `document.getElementById` null-safe | `var el = _ge('vContent');` |
| `_vc(html)` | Inject dans `#vContent` (page visiteur) | `_vc('<div class="vsec">...</div>');` |
| `_si(id, html)` | `innerHTML` null-safe sur un élément | `_si('stats', '<b>100</b>');` |
| `_st(id, txt)` | `textContent` null-safe | `_st('vName', 'VÉRITAS');` |
| `$(id)` | Alias court de `_ge` | identique à `_ge` |
| `fmt(n)` | Formate en FCFA | `fmt(12500)` → `"12 500 FCFA"` |
| `fmtN(n)` | Formate un nombre fr-FR | `fmtN(12500)` → `"12 500"` |
| `gid()` | Génère un ID aléatoire court | `'k3f9a2pq'` |
| `today()` | Date du jour fr-FR | `"07/04/2026"` |
| `toast(msg, type)` | Notification flash | `toast('Enregistré', 'ok')` |
| `M(titre, sous, body, footer, large)` | Ouvre une modale | voir exemples partout |
| `cm()` | Ferme la modale courante | `onclick="cm()"` |
| `re()` | Re-rend la page courante | après une mise à jour |
| `save()` | Sérialise `DB` dans `localStorage` | à appeler après toute mutation |
| `_esc(s)` | Échappement HTML/XML | `_esc(user.nom)` |

### 4.2 Navigation

- **Côté visiteur** : `vShowSec('sectionName', btn)` met à jour `#vContent`. Sections connues : `presentation`, `elearning`, `boutique`, `jeux`, `orientation`, `contact`, etc.
- **Côté admin** : `goTo('pageName')` route vers `pg*`. Voir le switch dans `render()` ~ligne 4361.

### 4.3 Accès restreint et fallback

```js
function pgTruc(){
  if(!iA()) return na();   // na() = page "Accès restreint"
  // ... code normal
}
```

### 4.4 Style des fonctions

Code majoritairement en **ES5** (var, concatenation de strings) **avec des touches ES6** (template literals, arrow functions dans les `.map()`, `const/let` ponctuels). Éviter les modules ES6 (`import/export`) — le fichier est chargé en `<script>` simple, pas en `type="module"`.

**Règle de pouce** : pour les nouvelles fonctions, suivre le style du voisinage immédiat. Ne pas introduire de transpilation.

---

## 5. Sections clés du code (repères de lignes approximatifs pour v39.2)

| Zone | Lignes | Notes |
|---|---|---|
| CSS principal | 25–1025 | Variables CSS dans `:root` (`--r`, `--r2`, `--ink*`, `--bl`, `--gr`, `--gold`, etc.) |
| CSS `.vhero-video-wrap` | 958–1055 | **Réécrit en v39.2** — supprime `max-height`, ajoute overlay + bouton son |
| Coquille HTML visiteur | 1027–1150 | Header, navigation, zone `#vContent` |
| `defaultDB()` | ~1196 | Base de données initiale (à modifier si ajout de champs globaux) |
| Helpers généraux | ~1587–1605 | `gid`, `fmt`, `S`, `T`, `iA`, etc. |
| Catalogue livres par défaut | ~1250 | `DB.books` seed |
| Catalogue e-learning par défaut | ~1390 | `DB.elearning.contenus` seed |
| `initVisitor` / `vShowSec` | ~1870 | Rendu section visiteur |
| `acheterManuel` / `confirmerAchat` | ~4729 | Achat boutique — **branché sur `openPaymentModal` en v39.2** |
| `pgElearningMgmt` | ~3282 | Admin e-learning |
| `validerAbonnement` | ~3916 | Souscription plan — **branché sur `openPaymentModal` en v39.2** |
| `buildIntroVideoHtml` | ~7028 | **Réécrit en v39.2** — vidéo 100% + overlay + bouton son |
| `_vheroToggleSound` | ~7180 | Toggle audio YouTube (postMessage) / vidéo locale |
| `LITT_OEUVRES` | ~8884 | Base d'œuvres littéraires avec cartes mentales |
| `_showLittCarte` | ~9329 | **Réécrit en v39.2** — SVG 960×640, animations, géométrie corrigée |
| `_mmDownload` | ~9450 | Export PNG de la carte mentale |
| `JEUX_CATALOGUE` | ~9886 | Catalogue de jeux — **10 nouveaux jeux en v39.2** |
| `showJeuxEdu` | ~10057 | Rendu page jeux |
| `_lancerCustomQuiz` | ~10200 | Moteur générique QCM/VF/Pendu/Texte à trous |
| **Module paiements v39.2** | fin de fichier | `VERITAS_PAYMENTS`, `openPaymentModal`, `mPayAttempts`, `_payCopy` |
| Handler `window.onerror` | début script | Journalise dans `localStorage._veritasErrors` |

---

## 6. Module Paiements (v39.2)

### 6.1 Configuration

Tout est centralisé dans `window.VERITAS_PAYMENTS` (défini à la fin du gros script). **Toutes les valeurs sont des placeholders** marqués `← À REMPLACER` :

```js
window.VERITAS_PAYMENTS = {
  momo:   { numero: "+237 6XX XX XX XX", nomCompte, code, couleur, ico },
  orange: { numero: "+237 6XX XX XX XX", nomCompte, code, couleur, ico },
  paypal: { url: "https://paypal.me/Votre...", email, couleur, ico },
  stripe: { url: "https://buy.stripe.com/...", couleur, ico },
  bank:   { titulaire, banque, iban, swift, couleur, ico },
  whatsapp: "+237 697 637 739",
  email: "contact@veritas.cm"
};
```

**Action immédiate pour Jacques** : remplacer ces 5 placeholders par les vraies coordonnées de Centre VÉRITAS avant mise en production.

### 6.2 API

```js
openPaymentModal({
  montant: 5000,                    // en FCFA
  label: '🎓 Pack Premium',         // description affichée
  ref: 'VT250407-XYZ12',            // optionnel : référence forcée
  refPrefix: 'ELRN'                 // optionnel : préfixe pour auto-ref (défaut 'VT')
});
```

Comportement :
1. Génère une référence unique `VT{YYMMDD}-{RAND4}` si non fournie.
2. Enregistre une tentative dans `DB.payAttempts[]` avec `status: 'pending'`.
3. Affiche un modal avec 5 méthodes de paiement (MoMo, OM, PayPal, Stripe, virement).
4. Les numéros sont cliquables → copie dans le presse-papier.
5. Un bouton WhatsApp à la fin envoie automatiquement au centre un message pré-rempli avec le montant, la référence et l'option de paiement à préciser.

### 6.3 Suivi admin

`mPayAttempts()` ouvre un mini-dashboard avec toutes les tentatives, permet de marquer payé / supprimer. Accessible depuis la barre « 🛠️ Gestion avancée → 💰 Paiements » du dashboard admin.

### 6.4 ⚠️ Limite fondamentale — LIRE AVANT DE PROMETTRE UNE SÉCURITÉ

Ce module est **purement déclaratif** côté client. Il **ne vérifie pas** qu'un paiement a réellement été effectué. Concrètement :

- Un utilisateur peut cliquer « J'ai payé → Envoyer ma confirmation » sans jamais payer.
- L'URL Stripe ouvre une page hébergée par Stripe qui, elle, est sécurisée, mais le retour à VÉRITAS n'est pas vérifié (pas de webhook).
- PayPal pareil.
- MoMo / Orange Money = purement manuel : l'admin doit vérifier sur son téléphone ou son relevé.

**Conséquence** : le workflow actuel exige qu'un humain chez VÉRITAS valide chaque paiement manuellement dans `mPayAttempts()` après vérification externe. C'est viable pour un faible volume mais devient ingérable à l'échelle.

**Pour un vrai encaissement automatique → voir section 8 "Roadmap v40"**.

---

## 7. Sécurité — état actuel et limitations

### 7.1 Le problème fondamental

VÉRITAS est une application **single-file HTML/JS 100% côté client**. Cela implique qu'**absolument tout** ce que le navigateur exécute est lisible par n'importe qui via :
- `Ctrl+U` (Voir la source)
- F12 → DevTools → Sources
- `Ctrl+S` pour enregistrer le HTML

**Aucune** technique d'obfuscation, de hash, de base64, de "protection par mot de passe du code source" ne résiste à quelqu'un de motivé avec les DevTools ouverts. C'est mathématique : si le code doit s'exécuter sur la machine de l'utilisateur, la machine de l'utilisateur peut le lire.

### 7.2 Ce qui est PROTÉGÉ par l'architecture actuelle

- Les fichiers binaires lourds (vidéos, PDFs) stockés dans IndexedDB ne sont pas sérialisés dans le HTML — ils sont propres à chaque navigateur.
- Le `localStorage` d'un utilisateur n'est pas accessible aux autres utilisateurs (isolation par origine).
- Les CDN externes (html2canvas, jsPDF, xlsx) sont chargés depuis cloudflare avec HTTPS.

### 7.3 Ce qui N'EST PAS protégé (et ne peut pas l'être sans backend)

1. **Les identifiants admin** — Ils sont dans le code source. Même s'ils étaient hashés avec SHA-256, un attaquant peut simplement **modifier le HTML localement** pour contourner la vérification (`if(password === hash)` → remplacer par `if(true)`). L'obfuscation ne protège rien.

2. **Les données de `DB`** — N'importe qui ouvrant la console peut faire `console.log(DB)` et voir tous les élèves, notes, paiements. Dans un déploiement où chaque utilisateur a sa propre copie du fichier, ce n'est pas grave (ils ne voient que leurs données). Mais si le fichier est hébergé sur un serveur web, **toute personne qui charge la page charge aussi la totalité de la base par défaut**.

3. **Les paiements** — Impossible à sécuriser sans serveur (voir 6.4).

4. **La falsification** — Un élève peut ouvrir la console et faire `DB.grades.find(g => g.eid === 'moi').n1 = 20; save();` pour se donner 20/20. Détectable seulement si on compare avec une sauvegarde externe.

### 7.4 Recommandations immédiates (à faire dans v39.2)

- [ ] **Changer le mot de passe superadmin par défaut** (`jacques` / `veritas2026`) — ne pas utiliser ce qui est publié.
- [ ] **Ne jamais héberger le fichier en public** avec des vraies données dedans. Si hébergement web, partir du fichier "vide" (defaultDB uniquement) et laisser les utilisateurs importer leurs propres données via `mImportDB()`.
- [ ] **Sauvegardes régulières** — utiliser la fonction d'export SQL/JSON déjà présente (`exportSQL()`, ~ligne 1555).
- [ ] **Isoler physiquement les postes admin** — pas de navigateur partagé, session verrouillée.

### 7.5 La vraie solution = backend (roadmap v40)

Voir section 8.

---

## 8. Roadmap v40 — Architecture backend cible

Pour passer d'un prototype à une application vraiment sécurisée et scalable, un backend minimal est nécessaire. Voici l'architecture cible proposée.

### 8.1 Stack recommandée (optimisée pour le Cameroun)

| Composant | Choix recommandé | Pourquoi |
|---|---|---|
| **Hébergement** | VPS Hetzner/OVH/Contabo (5-10 €/mois) ou hébergement mutualisé PHP chez un fournisseur camerounais | Latence acceptable, coût modéré |
| **Runtime backend** | Node.js 20 + Express OU PHP 8.2 + Slim | Node si vous visez une SPA moderne ; PHP si vous voulez un hébergement low-cost mutualisé |
| **Base de données** | PostgreSQL 16 (VPS) OU MySQL 8 (mutualisé) | Remplace `localStorage` |
| **Auth** | JWT court (15 min) + refresh token en cookie httpOnly | Évite XSS de voler les sessions |
| **Mots de passe** | `bcrypt` avec cost 12 | Standard actuel |
| **Paiements** | Webhooks Stripe + API Orange Money CI/CM + API MTN MoMo Collection | Vraie vérification |
| **Fichiers** | S3 compatible (Scaleway, Wasabi) OU stockage local avec backups | Vidéos/PDFs hors DB |
| **Frontend** | Garder le single-file HTML mais remplacer `localStorage` par des `fetch('/api/...')` | Migration progressive |

### 8.2 Schéma SQL de base

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,        -- bcrypt
  role VARCHAR(20) NOT NULL,                  -- 'admin', 'teacher', 'student', 'visitor'
  nom VARCHAR(100),
  prenom VARCHAR(100),
  tel VARCHAR(30),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  matricule VARCHAR(20) UNIQUE,
  classe VARCHAR(20),
  date_naissance DATE,
  parent_nom VARCHAR(200),
  parent_tel VARCHAR(30),
  frais_scolarite INTEGER,
  statut VARCHAR(30)
);

CREATE TABLE grades (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  teacher_id INTEGER REFERENCES users(id),
  matiere VARCHAR(50),
  trimestre VARCHAR(20),
  note_1 DECIMAL(4,2),
  note_2 DECIMAL(4,2),
  coefficient INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  montant INTEGER NOT NULL,
  devise VARCHAR(5) DEFAULT 'XAF',
  moyen VARCHAR(20),                          -- 'momo', 'orange', 'paypal', 'stripe', 'bank', 'cash'
  reference VARCHAR(50) UNIQUE,
  provider_ref VARCHAR(100),                  -- ID transaction chez le provider
  statut VARCHAR(20) DEFAULT 'pending',       -- pending, confirmed, failed, refunded
  webhook_verified BOOLEAN DEFAULT FALSE,
  date_paiement TIMESTAMPTZ DEFAULT NOW(),
  validated_by INTEGER REFERENCES users(id),
  validated_at TIMESTAMPTZ
);

CREATE TABLE payment_webhooks (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(20),                       -- 'stripe', 'orange', 'mtn'
  event_id VARCHAR(100) UNIQUE,               -- idempotence
  payload JSONB,
  signature VARCHAR(500),
  processed BOOLEAN DEFAULT FALSE,
  received_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(statut);
```

### 8.3 Endpoints API minimaux

```
POST   /api/auth/login              { email, password } → { token, user }
POST   /api/auth/refresh            → { token }
POST   /api/auth/logout
GET    /api/me                      → current user info
GET    /api/students                (admin/teacher) → liste
POST   /api/students                (admin)
PUT    /api/students/:id            (admin)
DELETE /api/students/:id            (admin)
GET    /api/students/:id/grades     (admin/teacher/student-self)
POST   /api/grades                  (teacher)
PUT    /api/grades/:id              (teacher)

POST   /api/payments/initiate       { student_id, montant, moyen } → { ref, redirect_url? }
GET    /api/payments/:ref           → statut du paiement
POST   /api/webhooks/stripe         (Stripe signature verification)
POST   /api/webhooks/orange         (Orange Money callback)
POST   /api/webhooks/mtn            (MTN MoMo callback)

GET    /api/elearning/plans
GET    /api/elearning/contenus      (avec filtrage plan)
POST   /api/elearning/subscribe     { plan_id } → { payment_ref }
```

### 8.4 Plan de migration progressif

La migration ne doit **pas** tout casser d'un coup. Voici l'ordre recommandé :

**Phase 1 — Mise en place du backend (2-3 semaines)**
1. Setup VPS + PostgreSQL + Node/PHP + HTTPS (Let's Encrypt via Caddy).
2. Schéma SQL ci-dessus + migration depuis un export SQL du fichier HTML actuel (`exportSQL()` existe déjà, ligne ~1555).
3. Endpoints d'auth (`/api/auth/*`) + hash bcrypt des mots de passe existants.
4. Test : connexion depuis Postman/curl.

**Phase 2 — Migration de l'auth (1 semaine)**
1. Dans le HTML : remplacer la fonction `login()` pour faire `fetch('/api/auth/login', ...)` au lieu de vérifier contre `DB.visitorAccounts` et les hashes locaux.
2. Stocker le JWT en `sessionStorage` (pas localStorage) + cookie httpOnly pour le refresh.
3. Garder temporairement un mode "offline/local" pour continuer à travailler sans backend (feature flag `USE_BACKEND`).

**Phase 3 — Migration des données lecture (1-2 semaines)**
1. Remplacer `DB.students`, `DB.grades`, etc. par des caches alimentés par `fetch`.
2. Ajouter une fonction `api.get('/students')` qui cache en mémoire (Map) et fait `If-Modified-Since`.
3. Les fonctions de rendu (`pgStudents`, `pgGrades`, etc.) n'ont rien à changer si on maintient l'API de `DB` identique en surface.

**Phase 4 — Migration des écritures (1 semaine)**
1. Chaque `save()` qui suit une mutation doit déclencher un `fetch POST/PUT/DELETE`.
2. Ajouter un système de **queue offline** : si le fetch échoue, stocker dans `localStorage._pendingOps` et retenter.
3. Confirmer chaque écriture avec un toast et un indicateur de sync.

**Phase 5 — Vrais paiements (2 semaines)**
1. Stripe : créer les Products/Prices, implémenter le webhook `/api/webhooks/stripe` avec vérification de signature.
2. Orange Money Cameroun : s'inscrire sur https://developer.orange.com → obtenir les clés API → endpoint de création de transaction + webhook de callback.
3. MTN MoMo : https://momodeveloper.mtn.com/ → API Collection → similar flow.
4. Remplacer `openPaymentModal()` par un flow qui appelle `/api/payments/initiate` et redirige vers l'URL de paiement provider.
5. `mPayAttempts()` devient un vrai dashboard de paiements confirmés par webhooks.

**Phase 6 — Isolation multi-tenant (optionnel, 1 semaine)**
1. Ajouter une colonne `centre_id` sur toutes les tables.
2. Permet à plusieurs centres d'utiliser la même instance VÉRITAS.
3. URL `https://app.veritas.cm/yaounde`, `.../douala`, etc.

### 8.5 Estimations de coût (FCFA/mois)

| Poste | Coût |
|---|---|
| VPS Hetzner CX22 (2 vCPU, 4 Go RAM, 40 Go) | ~4 € = ~2 600 FCFA |
| Nom de domaine `.cm` | ~60 €/an = ~3 300 FCFA/mois |
| Stockage S3 (Scaleway 100 Go) | ~3 € = ~2 000 FCFA |
| **Total technique** | **~8 000 FCFA/mois** |
| Stripe (2.9% + 0.25€ par transaction) | variable |
| Orange Money API | ~1% par transaction |
| MTN MoMo API | ~1% par transaction |

Pour un volume de 100 paiements/mois à 5 000 FCFA en moyenne, les frais de paiement seraient ~5 000-8 000 FCFA, soit un total de ~15 000 FCFA/mois tout compris.

---

## 9. Tâches connues / TODO v40

### Urgent (sécurité et stabilité)
- [ ] Résoudre le `SyntaxError: Illegal return statement` s'il persiste (voir section 10 — probablement un cache navigateur)
- [ ] Remplacer les 5 placeholders dans `VERITAS_PAYMENTS` par les vraies coordonnées
- [ ] Changer les mots de passe admin par défaut
- [ ] Vérifier que la fonction d'export SQL couvre bien toutes les tables v39.2 (dont `payAttempts`)

### Court terme (qualité de vie)
- [ ] Bouton « Test de la vidéo hero » dans l'admin pour prévisualiser avant publication
- [ ] Le bouton son de la vidéo hero doit persister son état dans `sessionStorage` (pour ne pas redemander à chaque re-render)
- [ ] Ajouter un indicateur « Dernière sauvegarde » dans le header (la date du dernier export)
- [ ] Fonction de diff entre deux sauvegardes (quelles notes ont changé depuis hier)

### Moyen terme (fonctionnalités)
- [ ] Ajouter 5 œuvres supplémentaires à `LITT_OEUVRES` (programme 2nde, 1ère)
- [ ] Ajouter des jeux de sciences physiques interactifs (schémas cliquables)
- [ ] Mode sombre (la variable CSS existe déjà mais n'est pas branchée)
- [ ] PWA avec manifest + service worker pour installation sur smartphone

### Long terme (architecture)
- [ ] Migration backend (voir section 8)
- [ ] Paiements vérifiés par webhooks
- [ ] Multi-tenant (plusieurs centres)
- [ ] App mobile React Native partageant l'API

---

## 10. Debugging — le `SyntaxError: Illegal return statement`

Lors de la session d'avril 2026, Jacques a signalé cette erreur. **Résultat du diagnostic** :

- Le fichier `VERITAS_v39_1_fixed.html` reçu en entrée a été analysé avec `node --check` sur le bloc script principal → **syntaxe valide**.
- Recherche exhaustive d'`eval`, `new Function`, `setTimeout(string)`, `innerHTML` avec `<script>` → rien de suspect.
- Vérification équilibrage des accolades avec tokenizer → équilibré.
- Structure HTML → propre (les 4 occurrences de `<html>` sont des faux positifs dans des `document.write()` pour les exports d'impression).

**Hypothèses retenues** :
1. **Cache navigateur** (le plus probable) — l'utilisateur voit une ancienne version. Solution : `Ctrl+Shift+R` ou vider le cache, ou changer le nom du fichier pour forcer le rechargement.
2. **Handler inline généré dynamiquement** — si une donnée dans `DB` contient un guillemet mal échappé qui casse un `onclick="..."`. À vérifier avec `showVeritasErrors()` en console une fois que l'erreur se reproduit.

En v39.2, un handler amélioré `window.onerror` stocke les 50 dernières erreurs dans `localStorage._veritasErrors`. Pour consulter :

```js
// Dans la console DevTools du navigateur :
window.showVeritasErrors()   // table des erreurs
window.clearVeritasErrors()  // effacer le log
```

Si l'erreur se reproduit, copier la sortie de `showVeritasErrors()` et la fournir pour un diagnostic précis.

---

## 11. Guide de contribution pour Claude Code

Quand vous (Claude) travaillez sur ce fichier, suivez ces règles :

### 11.1 Avant toute modification

```bash
# 1. Toujours travailler sur une copie
cp VERITAS_v39_2.html VERITAS_work.html
chmod u+w VERITAS_work.html

# 2. Vérifier la syntaxe AVANT de commencer
node -e "
const fs=require('fs');
const html=fs.readFileSync('VERITAS_work.html','utf8');
const m=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
fs.writeFileSync('/tmp/check.js', m[4][2]);
" && node --check /tmp/check.js && echo "✓ baseline OK"
```

### 11.2 Après chaque modification

**RE-VÉRIFIER LA SYNTAXE.** Le fichier est trop gros pour être débogué à l'œil nu. Un `node --check` prend 200ms et évite des heures de galère.

### 11.3 Règles de style

- **Pas de build step** — tout doit être du JS exécutable directement par le navigateur.
- **Pas d'`import/export`** — c'est un `<script>` classique.
- **Pas de `localStorage` dans les artifacts** (règle Claude en général, mais ici on DOIT l'utiliser — c'est l'exception : VÉRITAS est une vraie application, pas un artifact Claude).
- **Utiliser les helpers null-safe** `_ge`, `_vc`, `_si`, `_st`, `_esc` au lieu de `document.getElementById` et `innerHTML` bruts.
- **Échapper les chaînes utilisateur** avec `_esc()` avant injection HTML.
- **Toujours appeler `save()`** après toute mutation de `DB`.
- **Toujours appeler `re()`** pour re-rendre après une mutation visible.

### 11.4 Structure type d'une nouvelle fonctionnalité

```js
// 1. Fonction de rendu de page
function pgMaFonctionnalite(){
  if(!iA()) return na();   // ou isEnseignant(), isEleve()...
  // Construire le HTML
  return `<div class="pgt">Ma Fonctionnalité</div>
    <div class="card">
      <button class="btn bi" onclick="mMaAction()">Action</button>
    </div>`;
}

// 2. Modale d'action
function mMaAction(){
  M('Titre', 'Sous-titre',
    '<div class="fg"><span class="fl">Champ</span><input class="fi" id="maF"></div>',
    '<button class="btn bo" onclick="cm()">Annuler</button>'
    +'<button class="btn bi" onclick="saveMaAction()">✓ Valider</button>'
  );
}

// 3. Logique de sauvegarde
function saveMaAction(){
  var val = (_ge('maF')?.value || '').trim();
  if(!val){ toast('Champ requis','warn'); return; }
  DB.maCollection = DB.maCollection || [];
  DB.maCollection.push({ id: gid(), val: val, date: today() });
  save();
  cm();
  re();
  toast('✓ Enregistré');
}

// 4. Enregistrer dans le routeur si c'est une page admin
// Chercher `pageName:pgPageName` dans le switch ~ligne 4361
```

### 11.5 Anti-patterns à éviter

- ❌ `document.getElementById('x').innerHTML = ...` → utiliser `_si('x', ...)` (null-safe)
- ❌ Interpoler des données utilisateur sans `_esc()` dans un template string → XSS
- ❌ Créer un `<script>` dynamique avec `innerHTML` → ne s'exécute pas + dangereux
- ❌ Oublier `save()` après mutation → perte des modifications au rechargement
- ❌ Hard-coder des URLs absolues → casser le mode `file://`
- ❌ Utiliser `fetch()` vers des origines externes sans CORS proxy → CORS errors

---

## 12. Historique des versions

| Version | Date | Changements |
|---|---|---|
| v6 | ~2024 | Première version livrée pour une école d'Abidjan |
| v13 | mars 2026 | Debug CSS responsive, missing `display:flex` sur `#LS` |
| v32 | mars 2026 | Système de comptes visiteurs + accès par plans, admin CRUD, évaluations en ligne, layout PC amélioré. Helpers `_vc`, `_si`, `_st`, `_ge` introduits. |
| v39.1 | avril 2026 | Version précédente, reçue avec bug `SyntaxError: Illegal return statement` (probablement cache) |
| **v39.2** | **avril 2026** | **Version actuelle** — vidéo hero agrandie (dimension égale au panneau gauche) avec overlay transparent intégré et bouton son (autoplay muet + toggle), rendu des cartes mentales entièrement réécrit (SVG 960×640, animations, pas de chevauchement, export PNG), 10 nouveaux jeux éducatifs (verbes anglais, capitales d'Afrique, histoire du Cameroun, formules physique, équations 2nd degré, anatomie, participe passé, tables, auteurs camerounais, vocabulaire SVT), module de paiements complet (MoMo, Orange Money, PayPal, Stripe, virement) avec placeholders clairs, branché sur l'achat de manuels et les souscriptions e-learning, dashboard admin `mPayAttempts`, handler d'erreurs amélioré avec journalisation `localStorage` |

---

## 13. Contact et support

- **Propriétaire du projet** : Jacques Miterand TAKOU
- **Centre** : Centre VÉRITAS, Yaoundé, Cameroun
- **Copyright** : © Mythe Errant 2026 · VÉRITAS

Pour toute question sur ce CLAUDE.md ou le code, rouvrir une session Claude Code dans le dossier contenant `VERITAS_v39_2.html` et `CLAUDE.md` — ce guide sera automatiquement lu au démarrage.

---

*Ce document est vivant : mettez-le à jour à chaque session de modification significative. L'état à jour de l'architecture est plus précieux qu'un historique figé.*

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
