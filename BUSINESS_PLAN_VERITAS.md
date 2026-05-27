# 📊 BUSINESS PLAN — VÉRITAS ACADEMY

> **Plateforme éducative numérique de référence pour le système MINESEC camerounais**
>
> Préparé par : **Jacques Miterand TAKOU** — Fondateur & CEO
> Centre VÉRITAS Academy · Douala, Cameroun
> Version 1.0 · Mai 2026

---

## 📑 SOMMAIRE

1. [Executive Summary](#1-executive-summary)
2. [Le problème adressé](#2-le-problème-adressé)
3. [La solution VÉRITAS](#3-la-solution-véritas)
4. [Marché cible](#4-marché-cible-tam-sam-som)
5. [Analyse concurrentielle](#5-analyse-concurrentielle)
6. [Modèle économique](#6-modèle-économique)
7. [Stratégie marketing & acquisition](#7-stratégie-marketing--acquisition)
8. [Roadmap produit](#8-roadmap-produit-3-ans)
9. [Équipe](#9-équipe)
10. [Projections financières 5 ans](#10-projections-financières-2026-2030)
11. [Plan de financement](#11-plan-de-financement)
12. [Valorisation et sortie](#12-valorisation-et-sortie)
13. [Risques et mitigation](#13-risques-et-mitigation)
14. [KPIs de pilotage](#14-kpis-de-pilotage)
15. [Annexes](#15-annexes)

---

## 1. EXECUTIVE SUMMARY

### 🎯 La vision

**VÉRITAS Academy devient la plateforme éducative numérique de référence en Afrique francophone**, en commençant par dominer le marché secondaire camerounais (MINESEC) avant l'expansion régionale (CEMAC + Afrique de l'Ouest francophone).

### 💡 La proposition de valeur

> **Une seule application** qui réunit cours interactifs, annales BEPC/BAC corrigées, IA pédagogique spécialisée MINESEC, classes virtuelles, boutique de manuels officiels et système de parrainage rémunéré — accessible à 5 000 FCFA/mois (vs cours particuliers 25 000-50 000 FCFA/mois).

### 📈 Les chiffres-clés (cibles 5 ans)

| Indicateur | Année 1 (2026) | Année 3 (2028) | Année 5 (2030) |
|---|---|---|---|
| **Utilisateurs actifs** | 5 000 | 100 000 | 500 000 |
| **Abonnés payants** | 300 | 8 000 | 60 000 |
| **Revenu annuel (FCFA)** | 22 M | 480 M | 3,6 milliards |
| **Bénéfice net (FCFA)** | 14 M | 400 M | 3,1 milliards |
| **Marge nette** | 64 % | 83 % | 86 % |

### 💰 Besoin en investissement

**Levée Pre-seed actuelle : 30 000 000 FCFA (~45 000 €)**
→ Validation marché + premiers 1 000 abonnés payants

Valorisation pré-money pré-seed : **150 000 000 FCFA (~230 000 €)**

### 🚀 État actuel (atouts)

- ✅ **Produit fonctionnel** déployé à veritas-school.com (12 modules, 3,6 Mo)
- ✅ **Stack technique complet** : Frontend (HTML/JS) + Backend (PHP/LWS) + Firebase Auth + Anthropic API ready
- ✅ **22 œuvres MINESEC** intégrées avec analyses littéraires + 134 manuels officiels référencés
- ✅ **Système de paiement multi-canaux** : MoMo, Orange Money, PayPal, Stripe, virement
- ✅ **IA Ambassa** opérationnelle (proxy sécurisé + RAG + cache validé)
- ✅ **Partenariats partenaires structurés** : parrains 10-20%, auteurs 60%, enseignants 70%

---

## 2. LE PROBLÈME ADRESSÉ

### 2.1 Trois failles du système éducatif camerounais

#### A. Accès inéquitable aux ressources de qualité

- **3 millions d'élèves** dans le secondaire camerounais
- Seuls **20 % en zone urbaine** ont accès à des cours particuliers de qualité (Douala, Yaoundé)
- **80 % en zone rurale ou semi-urbaine** dépendent des enseignants de classe surchargés (50-100 élèves/classe)
- Coût des cours particuliers : **25 000-50 000 FCFA/mois** par matière → inaccessibles à la majorité

#### B. Annales et corrigés dispersés, qualité variable

- Sites concurrents (sujetexa, camerschool, etc.) : **PDF non structurés**, pas d'aide à la compréhension
- Pas d'**interactivité** (le PDF ne corrige pas votre dissertation)
- Pas de **personnalisation** (même corrigé pour tous, ne s'adapte pas au niveau)
- Qualité parfois douteuse (corrigés faits par étudiants, sans validation enseignant)

#### C. Pas d'IA pédagogique adaptée au contexte camerounais

- ChatGPT et autres IA généralistes ne connaissent **pas le programme MINESEC officiel**
- Inventent des œuvres qui ne sont pas au programme
- Donnent des grilles d'évaluation hors-norme (pas les grilles OBC)
- **Aucun acteur local** ne fournit une IA spécialisée MINESEC

### 2.2 Impact économique du problème

- **Taux d'échec au BEPC** : 45-55 % chaque année (~100 000 échecs / 200 000 candidats)
- **Taux d'échec au BAC** : 40-50 % (~50 000 échecs / 120 000 candidats)
- Coût social : ~150 000 élèves rallongent leur parcours d'un an → **perte économique nationale estimée à 50 milliards FCFA/an**
- Coût familial : ~2 000 milliards FCFA/an investis par les familles dans le secondaire

### 2.3 Pourquoi maintenant ?

| Tendance | Impact pour VÉRITAS |
|---|---|
| **Pénétration smartphone CM** : 75 % en 2026 (45 % en 2020) | Marché adressable triplé en 5 ans |
| **Couverture 4G** : 85 % zones urbaines | Streaming vidéo + IA viable |
| **MoMo/OM** : 60 % de la population CM | Paiements digitaux normalisés |
| **Démocratisation IA** : Claude/GPT accessibles depuis API | Spécialisation MINESEC possible |
| **Pression PISA/UNESCO** : Cameroun classé bas → MINESEC cherche solutions | Vente B2B aux établissements possible |

---

## 3. LA SOLUTION VÉRITAS

### 3.1 Une plateforme tout-en-un

```
┌─────────────────────────────────────────────────────────────┐
│  VÉRITAS Academy — 1 app, 12 services intégrés              │
├─────────────────────────────────────────────────────────────┤
│  🎓 Cours interactifs vidéo (BEPC, Probatoire, BAC)         │
│  📝 Annales 2009-2026 + corrigés OBC validés                │
│  🤖 IA Ambassa (Claude Sonnet + RAG MINESEC)                │
│  📚 Bibliothèque 2 484 œuvres africaines indexées           │
│  🛒 Boutique manuels MINESEC officiels (livraison Douala)   │
│  🎮 Jeux éducatifs (QCM, pendu, cartes mentales)            │
│  🔬 Labos virtuels (physique, chimie, SVT)                  │
│  👥 Classes virtuelles + Étude en groupe (rooms 6 chiffres) │
│  🏆 Gamification : streaks, XP, 30+ badges, leaderboard     │
│  💰 Système de parrainage rémunéré (10-20%)                 │
│  📊 Suivi personnalisé : Genome académique + courbe progrès │
│  💳 Paiements MoMo / Orange / PayPal / Stripe               │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Différenciateurs concurrentiels

| Capacité | VÉRITAS | Sujetexa / Camerschool | Didactia (CI) | Khan Academy |
|---|---|---|---|---|
| Annales + corrigés MINESEC | ✅ 2 484 ressources | ✅ | ❌ | ❌ |
| Cours vidéo MINESEC | ✅ | ❌ | ⚠️ Limité | ⚠️ FR/EN seulement |
| **IA pédagogique CM** | ✅ Ambassa | ❌ | ⚠️ Générique | ❌ |
| Boutique manuels | ✅ | ❌ | ❌ | ❌ |
| Paiement MoMo/Orange | ✅ | ⚠️ | ✅ | ❌ |
| Système parrainage | ✅ 10-20% | ❌ | ❌ | ❌ |
| Marketplace enseignants | ✅ 70% pour auteur | ❌ | ❌ | ❌ |
| Mobile-first | ✅ PWA | ⚠️ PDF | ✅ App native | ⚠️ Web lourd |
| **Prix** | 1 000-10 000 F/mois | Gratuit (pub) | 15 000 F/mois | Gratuit |

**Notre avantage unique** : seule plateforme à combiner **annales + IA spécialisée + commerce + communauté + paiement local** dans une expérience unifiée.

### 3.3 Stack technique (état actuel — déployé)

- **Frontend** : HTML5/CSS/JavaScript vanilla, single-file 3,6 Mo, PWA-compatible
- **Backend** : PHP 8.2 sur LWS France (sécurité Cloudflare)
- **Base** : MySQL (cache validé) + SQLite FTS5 (bibliothèque 1,4 M passages)
- **IA** : Anthropic Claude Sonnet/Haiku via proxy sécurisé `api/ia_proxy.php`
- **Auth** : Firebase Anonymous (visiteur) + LWS Session (inscrit)
- **CDN** : Cloudflare Pro
- **Service Worker** : v2.9.14 (mode hors-ligne, mise à jour auto)
- **CI/CD** : GitHub Actions → FTP automatique vers LWS

---

## 4. MARCHÉ CIBLE (TAM / SAM / SOM)

### 4.1 TAM — Total Addressable Market

**Marché total adressable : 4 800 milliards FCFA/an**

| Segment | Population | Dépense moyenne/an | Marché annuel |
|---|---|---|---|
| Élèves secondaire CM | 3 000 000 | 200 000 F (cours, manuels, particuliers) | **600 Mds F** |
| Élèves secondaire CEMAC (Gabon, Congo, Tchad, RCA, GE) | 2 500 000 | 250 000 F | **625 Mds F** |
| Afrique de l'Ouest francophone (CI, Sénégal, Mali...) | 12 000 000 | 300 000 F | **3 600 Mds F** |
| **TOTAL** | **17 500 000** | | **4 825 Mds F** (~7,4 Md €) |

### 4.2 SAM — Serviceable Available Market

**Marché serviceable (smartphones + paiement digital) : 1 200 milliards FCFA/an**

- 50 % de pénétration smartphone parmi élèves CM = 1 500 000 actifs digitaux
- 40 % capacité de paiement régulier (parents en milieu urbain) = 600 000 prospects payants
- Dépense moyenne edtech : 60 000 F/an
- **SAM Cameroun : 600 000 × 60 000 = 36 milliards FCFA/an**

Extension CEMAC + Afrique de l'Ouest francophone (5 ans) : **× 30 = ~1 200 milliards FCFA/an**

### 4.3 SOM — Serviceable Obtainable Market

**Objectif réaliste à 5 ans : 5 % du SAM Cameroun + 1 % SAM régional**

- Cameroun : 30 000 abonnés payants × 60 000 F = **1,8 milliard F/an**
- CEMAC : 12 000 abonnés × 60 000 F = **0,7 milliard F/an**
- **SOM 5 ans = ~2,5 milliards F/an**

### 4.4 Personae cibles

#### 👨‍🎓 Persona 1 — Élève terminale Douala
- 17 ans, Tle A4 ABI au Lycée Bilingue Joss
- Smartphone Android, accès 4G/wifi
- Pression BAC dans 6 mois
- Budget familial cours particuliers : 30 000 F/mois (math + français)
- **Comportement** : 2h/jour sur Facebook/TikTok, peu sur ressources scolaires
- **Besoin** : corrigés rapides, fiches révision, IA qui explique
- **Plan visé** : Pro 3 000 F/mois (10× moins cher que cours particuliers)

#### 👩‍👧 Persona 2 — Mère de famille classe moyenne Yaoundé
- 38 ans, fonctionnaire, 2 enfants en collège et lycée
- Préoccupée par l'avenir scolaire
- Possède smartphone, paie via MoMo
- **Comportement** : achète 10-15 manuels neufs par an, hésite sur les "bons"
- **Besoin** : avoir les manuels officiels MINESEC sans courir les librairies, suivre les notes de ses enfants
- **Plan visé** : Boutique (achats ponctuels) + Starter 1 000 F/mois × 2 enfants

#### 👨‍🏫 Persona 3 — Enseignant de français Bafoussam
- 42 ans, agrégé MINESEC, 25 ans d'expérience
- Cherche revenus complémentaires
- Possède PC + smartphone
- **Comportement** : prépare ses cours à la main, photocopie des annales
- **Besoin** : reconnaissance, revenus, accès à ressources d'autres profs
- **Plan visé** : Marketplace enseignant (vendre ses corrigés, recevoir 70 %)

#### 🏫 Persona 4 — Établissement privé Garoua
- Lycée privé 800 élèves
- Cherche se différencier des concurrents
- Budget IT annuel : 2-5 millions F
- **Besoin** : équiper ses élèves d'outil moderne, montrer aux parents
- **Plan visé** : licence B2B 500 000 F/an (×800 élèves) = 625 F/élève/an (5× moins que B2C)

---

## 5. ANALYSE CONCURRENTIELLE

### 5.1 Concurrents directs (Afrique francophone)

| Concurrent | Pays | Modèle | Forces | Faiblesses | Part marché CM |
|---|---|---|---|---|---|
| **Sujetexa** | CM | Free + pub | Volume annales | Pas d'IA, PDFs | ~25 % audience CM (free) |
| **Camerschool** | CM | Free + manuels | Liens libraires | Pas d'app | ~15 % |
| **Camerecole** | CM | Free + concours | Concours grandes écoles | Pas mobile-first | ~10 % |
| **Grandprof** | CM | Free + abos | Suivi enseignants | UX vieillissante | ~8 % |
| **E-school237** | CM | Freemium | 2 398 sujets | Limité 5e/Tle, dépend Pollinations | ~5 % |
| **Didactia (Leopold)** | CI | Premium 15 000 F | App native, IA générique | Pas spécifique MINESEC | < 1 % CM |

**Diagnostic** : marché atomisé, aucun acteur dominant. **Place pour un leader intégré**.

### 5.2 Concurrents indirects

- **Cours particuliers physiques** : 25 000-50 000 F/mois → cher, géographiquement limité
- **Centres de soutien** (Bonamoussadi, Bonanjo) : 80 000-200 000 F/an → premium uniquement
- **WhatsApp d'enseignants** : gratuit mais désorganisé, qualité variable
- **YouTube** : gratuit, contenu non spécifique CM, distractions

### 5.3 Pourquoi VÉRITAS va gagner

| Levier | Avantage différenciant |
|---|---|
| **Couverture intégrée** | Seul acteur à offrir 12 services unifiés en 1 app |
| **IA Ambassa spécialisée** | Premier modèle IA RAG MINESEC en Afrique francophone |
| **Communauté économique** | Système parrainage 10-20% → croissance virale + revenu pour utilisateurs |
| **Marketplace enseignants** | Aucun concurrent ne paie 70% aux profs camerounais (Leopold paie 0) |
| **Prix accessibles** | Plan Starter 1 000 F/mois (3× moins cher que Leopold) |
| **Made in Cameroun** | Légitimité culturelle vs Leopold (Côte d'Ivoire) ou Khan Academy (USA) |

---

## 6. MODÈLE ÉCONOMIQUE

### 6.1 Sources de revenu (4 piliers)

#### Pilier 1 — Abonnements freemium (60 % du CA prévu)

| Plan | Prix mensuel FCFA | Quota IA | Cible |
|---|---|---|---|
| **Anonyme** | 0 | 2 essais lifetime | Acquisition |
| **Free (inscrit)** | 0 | 3/semaine | Top of funnel |
| **Starter** | 1 000 | 5/jour | Élève moyen |
| **Pro** | 3 000 | 30/jour | Élève préparant examen |
| **Élite** | 10 000 | Illimité + Claude Sonnet + Cache validé | Élève premium |
| **Enseignant** | 2 500 | 50/jour | Profs validateurs |

**Mix de revenus prévu** (à 30 000 abonnés payants) :
- 60 % Starter : 18 000 × 1 000 = 18 M F/mois
- 30 % Pro : 9 000 × 3 000 = 27 M F/mois
- 8 % Élite : 2 400 × 10 000 = 24 M F/mois
- 2 % Enseignant : 600 × 2 500 = 1,5 M F/mois
- **Total abonnements : ~70 M F/mois = 840 M F/an**

#### Pilier 2 — Boutique de manuels (20 % du CA prévu)

- **134 manuels MINESEC** au catalogue (intégral programme 6e à Tle)
- Prix moyen manuel : 4 000 F · Marge VÉRITAS : 30 % = 1 200 F/manuel
- Élève moyen achète 6 manuels/an → 7 200 F de marge/élève/an
- **À 30 000 abonnés : 7 200 × 30 000 = 216 M F/an**

#### Pilier 3 — Marketplace enseignants/auteurs (15 % du CA prévu)

- 200 enseignants validateurs vendant cours/corrigés en moyenne 2 000 F
- Commission VÉRITAS : 30 % (vs 70 % reversés au prof)
- Volume estimé : 50 ventes/prof/mois × 200 profs × 2 000 F × 30 % = 6 M F/mois
- **À pleine maturité : 72 M F/an**

#### Pilier 4 — B2B Établissements (5 % du CA prévu)

- Licence annuelle école : 500 000 F (jusqu'à 1 000 élèves)
- Licence Pack Excellence : 2 000 000 F (1 000+ élèves + dashboard prof + reporting)
- Cible : 30 établissements en 5 ans = 30 × 1 M F moyen = **30 M F/an**

### 6.2 Structure de coûts

| Catégorie | % CA |
|---|---|
| Anthropic API (IA Sonnet/Haiku) | 8-12 % |
| Infrastructure (LWS + Cloudflare + GPU) | 3-5 % |
| Salaires équipe technique | 10-15 % |
| Salaires enseignants validateurs (cache curation) | 5-7 % |
| Marketing & acquisition utilisateurs | 15-20 % |
| Frais paiement (MoMo, Orange : 1-3 %) | 2-3 % |
| Reversement parrains (10-20 % parrainages) | 5-8 % |
| Reversement auteurs/enseignants (60-70 % marketplace) | 7-10 % |
| Frais bancaires + administratifs | 2 % |
| **TOTAL coûts** | **55-75 %** |
| **MARGE NETTE** | **25-45 %** |

### 6.3 Économie unitaire (Unit Economics)

#### Pour 1 abonné Pro à 3 000 F/mois sur 12 mois :

| Métrique | Valeur |
|---|---|
| **LTV** (Lifetime Value, retention 60 % an 2) | 3 000 × 12 + 3 000 × 7,2 = 57 600 F |
| **CAC** (Customer Acquisition Cost moyen Facebook ads + parrainage) | 4 500 F |
| **LTV/CAC ratio** | **12,8** (objectif > 3, excellent > 5) |
| Marge brute par abonné | 70 % = 40 320 F |
| **Payback period** | 1,5 mois |

**Conclusion** : modèle ultra-rentable dès l'acquisition.

---

## 7. STRATÉGIE MARKETING & ACQUISITION

### 7.1 Canaux d'acquisition (ordre de priorité)

#### Canal 1 — Parrainage viral (40 % des nouveaux users)
- Système intégré : parrain gagne 10-20 % du paiement de son filleul
- Code unique par utilisateur (déjà implémenté)
- Récompense automatique via MoMo
- **CAC = 0 F** (recommandation organique)

#### Canal 2 — Réseaux sociaux Cameroun (30 %)
- **Facebook Ads CM** : très efficace, CPM bas (~500 F/1000 vues)
- **TikTok** : démographique 13-19 ans très active
- **WhatsApp Status** : enseignants influenceurs
- **Instagram** : parents urbains (35-50 ans)
- Budget : 1-3 M F/mois selon phase
- CAC estimé : 4 000-6 000 F par abonné

#### Canal 3 — Partenariats établissements (15 %)
- 30 lycées privés ciblés en priorité (Douala, Yaoundé, Bafoussam)
- Démonstration gratuite 1 mois pour l'établissement
- Avantage : décideur unique (proviseur) → 800 élèves d'un coup
- CAC très bas en volume

#### Canal 4 — Influence enseignants (10 %)
- 50 enseignants ambassadeurs (sélectionnés par excellence)
- Compensation : abonnement gratuit + commission 70 % sur marketplace
- Effet de levier : 1 prof recommande à 30-50 élèves

#### Canal 5 — Communication officielle (5 %)
- TV : passages 5e Étoile, CRTV en partenariat éducation
- Radio : Sweet FM, RFI Cameroun
- Presse : Cameroon Tribune, Mutations, Le Messager
- PR à coût modéré (relations presse)

### 7.2 Calendrier d'acquisition

```
Mois 1-3    : Lancement Douala + Yaoundé (parrainage organique)
Mois 4-6    : Expansion régionale CM + premières pubs FB
Mois 7-12   : Campagne TV/radio + 1ère vague B2B
Année 2     : 100% CM + tests CEMAC (Gabon, Tchad)
Année 3     : Domination CM + ouverture officielle Gabon, Tchad
Année 4-5   : Côte d'Ivoire, Sénégal, Mali (Afrique de l'Ouest francophone)
```

---

## 8. ROADMAP PRODUIT (3 ANS)

### Trimestre 1-2 (2026 S2) — Consolidation MVP
- ✅ Activer Plan Élite (Claude Sonnet + RAG + Cache validé)
- ✅ Système paiement récurrent automatique (Stripe + MoMo recurrent)
- 🟡 App mobile native iOS/Android (Capacitor)
- 🟡 Vidéos pédagogiques pré-enregistrées (50 cours BEPC + 50 BAC)

### Trimestre 3-4 (2026 S2) — Curation
- 🔲 Recrutement 5 enseignants validateurs
- 🔲 1 000 réponses validées en cache → hit rate 50 %
- 🔲 Marketplace ouverte aux profs externes (système de candidature)
- 🔲 Lancement officiel public Cameroun (RP, TV)

### Année 2 (2027) — Croissance
- 🔲 Live classes enseignant-élèves (visio intégrée)
- 🔲 Système d'examens blancs nationaux mensuel (battle à 10 000 participants)
- 🔲 Fine-tuning Mistral 7B-Cameroun (modèle propre)
- 🔲 Partenariat MINESEC officiel (proposition de pilote dans 3 régions)
- 🔲 Expansion Gabon

### Année 3 (2028) — Domination
- 🔲 Plateforme blanche pour écoles privées (white-label)
- 🔲 Application parents (suivi notes, paiements scolarité)
- 🔲 Programme primaire (CM1-CM2) pour examen entrée 6e
- 🔲 Expansion Tchad, RCA, RDC

---

## 9. ÉQUIPE

### 9.1 Équipe actuelle (mai 2026)

| Rôle | Personne | Compétences |
|---|---|---|
| **CEO & Fondateur** | Jacques Miterand TAKOU | Enseignant français, 15 ans d'expérience, dirige Centre VÉRITAS depuis 2018 |
| **CTO** (à recruter) | À pourvoir | Stack JS/PHP, IA, Firebase |
| **Lead Pédagogique** | Jacques (cumul) | Connaissance MINESEC, programmes officiels |

### 9.2 Recrutements prioritaires (financement pre-seed)

| Poste | Profil | Salaire mensuel FCFA |
|---|---|---|
| **CTO** | Senior dev fullstack JS/PHP, 5+ ans | 800 000 F |
| **Marketing Manager** | Digital marketer CM, agences locales | 400 000 F |
| **Community Manager** | Réseaux sociaux + WhatsApp + influence | 200 000 F |
| **2 Enseignants validateurs** (mi-temps) | Agrégés français/maths MINESEC | 75 000 F × 2 = 150 000 F |
| **TOTAL salaires/mois** | | **1 550 000 F** |

### 9.3 Conseil d'administration cible

- 1 président indépendant (ancien proviseur ou universitaire reconnu CM)
- 1 représentant investisseurs (à venir)
- 1 expert tech (ex-Andela, Jumia, etc.)
- 1 expert éducation africaine (UNESCO, AFD)

---

## 10. PROJECTIONS FINANCIÈRES (2026-2030)

### 10.1 Compte de résultat prévisionnel (en millions FCFA)

| Poste | 2026 | 2027 | 2028 | 2029 | 2030 |
|---|---|---|---|---|---|
| **Utilisateurs totaux** | 5 000 | 25 000 | 100 000 | 250 000 | 500 000 |
| **Abonnés payants** | 300 | 1 500 | 8 000 | 25 000 | 60 000 |
| **Revenu abonnements** | 13,5 | 70 | 360 | 1 050 | 2 400 |
| **Revenu boutique manuels** | 2,4 | 12 | 60 | 180 | 432 |
| **Revenu marketplace** | 0,6 | 4 | 30 | 90 | 240 |
| **Revenu B2B écoles** | 1 | 4 | 30 | 180 | 540 |
| **TOTAL REVENUS** | **22** | **90** | **480** | **1 500** | **3 612** |
| Coûts variables (IA, frais paiement) | 3 | 15 | 65 | 200 | 480 |
| Salaires équipe | 20 | 50 | 110 | 200 | 350 |
| Marketing & acquisition | 5 | 15 | 60 | 175 | 350 |
| Reversement partenaires | 1,5 | 8 | 50 | 150 | 360 |
| Infrastructure tech | 1,5 | 4 | 15 | 30 | 70 |
| Frais administratifs | 1 | 2 | 5 | 15 | 30 |
| **TOTAL COÛTS** | **32** | **94** | **305** | **770** | **1 640** |
| **EBITDA** | **−10** | **−4** | **+175** | **+730** | **+1 972** |
| **EBITDA margin** | −45 % | −4 % | 36 % | 49 % | 55 % |
| Amortissements | 2 | 3 | 5 | 10 | 20 |
| Impôts sociétés (33 % au CM) | 0 | 0 | 56 | 237 | 644 |
| **RÉSULTAT NET** | **−12** | **−7** | **+114** | **+483** | **+1 308** |

### 10.2 Cash flow prévisionnel

| | 2026 | 2027 | 2028 | 2029 | 2030 |
|---|---|---|---|---|---|
| Trésorerie début | 0 | 18 | 11 | 125 | 608 |
| Investissement levé | 30 | 0 | 0 | 0 | 0 |
| Résultat net | −12 | −7 | +114 | +483 | +1 308 |
| Cash flow opérationnel | −12 | −7 | +114 | +483 | +1 308 |
| **Trésorerie fin (M FCFA)** | **18** | **11** | **125** | **608** | **1 916** |

### 10.3 Hypothèses-clés

| Hypothèse | Valeur conservatrice | Source |
|---|---|---|
| Taux de conversion free → payant | 6 % | Moyenne edtech freemium = 5-10 % |
| Churn mensuel payants | 7 % | Moyenne edtech CM = 8-10 % |
| ARPU (Average Revenue Per User payant) | 4 500 F/mois | Mix Starter/Pro/Élite |
| Croissance utilisateurs | 5×/an | Comparable Eskuela CI an 1-2 |
| Coût IA / requête | 15 F moyen | Mix Haiku/Sonnet/Cache |

---

## 11. PLAN DE FINANCEMENT

### 11.1 Levée Pre-Seed (en cours)

**Montant demandé : 30 000 000 FCFA (~45 000 €)**
**Valorisation pre-money : 150 000 000 FCFA (~230 000 €)**
**Dilution offerte : 16,7 %**

### 11.2 Usage des fonds (12 mois)

| Poste | Montant FCFA | % |
|---|---|---|
| Recrutement CTO + Marketing Manager | 13 000 000 | 43 % |
| Marketing & acquisition (FB ads, TV, RP) | 8 000 000 | 27 % |
| Anthropic API Claude (15 mois de réserve) | 3 000 000 | 10 % |
| Infrastructure premium (Hetzner GPU + Cloudflare) | 2 000 000 | 7 % |
| Création contenu (50 vidéos cours + production studio) | 2 500 000 | 8 % |
| Frais juridiques + comptabilité | 1 000 000 | 3 % |
| Trésorerie de sécurité | 500 000 | 2 % |
| **TOTAL** | **30 000 000** | **100 %** |

### 11.3 Levées suivantes prévues

| Tour | Année | Montant FCFA | Valorisation post-money | Dilution cumulée |
|---|---|---|---|---|
| Pre-seed | 2026 S2 | 30 M | 180 M | 16,7 % |
| **Seed** | 2027 S1 | **200 M** | **1,2 Md** | ~28 % |
| **Series A** | 2028 S2 | **1 500 M** | **8 Md** | ~36 % |
| **Series B (optionnelle)** | 2030 | 5 Md | 30 Md | ~42 % |

### 11.4 Retour pour investisseur Pre-Seed

| Scénario | Valorisation an 5 (FCFA) | Multiple sur 30 M F | IRR |
|---|---|---|---|
| Conservateur | 5 milliards | 28× | **95 %/an** |
| Réaliste | 15 milliards | 83× | **140 %/an** |
| Optimiste (sortie Series B) | 30 milliards | 167× | **170 %/an** |

---

## 12. VALORISATION ET SORTIE

### 12.1 Méthodes de valorisation appliquées

#### A. Multiple de revenu (méthode SaaS edtech)
- Multiple sectoriel edtech Afrique : **6-12× le revenu annuel**
- Revenu 2030 : 3,6 milliards F
- **Valorisation : 21-43 milliards F**

#### B. Multiple EBITDA
- Multiple EBITDA edtech : **15-25×**
- EBITDA 2030 : 1,97 milliard F
- **Valorisation : 30-49 milliards F**

#### C. Comparables transactions
- Sortie Ubiq (Maroc edtech) 2024 : 6× ARR
- Acquisition Olive (Sénégal) 2025 : 8× ARR
- **Médiane = 7× ARR → 25 milliards F en 2030**

**Fourchette de valorisation 2030 : 25-49 milliards F (~38-75 M €)**

### 12.2 Stratégies de sortie possibles

| Option | Probabilité | Acquéreur potentiel | Timing |
|---|---|---|---|
| **Acquisition stratégique** | 60 % | Groupe télécom CM (Orange, MTN) en quête de services digitaux | An 4-5 |
| **Acquisition edtech panafricaine** | 25 % | uLesson (Nigéria), Snapplify (SA), AfricaCode | An 5 |
| **IPO Bourse régionale (BVMAC, BRVM)** | 10 % | Cotation Douala ou Abidjan | An 6-7 |
| **Continuer en croissance** | 5 % | Dividendes pour actionnaires | An 5+ |

### 12.3 Plus-values prévues

Pour un investisseur Pre-Seed à 30 M F :

| Sortie | Multiple récupéré | Plus-value brute | IRR |
|---|---|---|---|
| Acquisition an 5 à 25 Mds F | 28× | 810 M F | 95 %/an |
| Acquisition an 5 à 49 Mds F | 54× | 1 590 M F | 122 %/an |
| Continuation + dividendes | n/a (revenus annuels) | 200-500 M F cumulé sur 5 ans | 60-80 % |

---

## 13. RISQUES ET MITIGATION

### 13.1 Risques identifiés

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| **Faible adoption initiale** | Moyenne | Élevé | Gratuité 2 essais + parrainage rémunéré + offre lancement 50 % |
| **Concurrent international entre au CM** (Khan, Coursera) | Faible | Très élevé | Différenciation MINESEC + langue + paiement local + équipe CM |
| **Coûts Anthropic API explosent** | Faible | Moyen | Architecture hybride (cache 85 % + Mistral self-hosted 10 % + Sonnet 5 %) |
| **Coupures internet/électricité CM** | Élevée | Moyen | PWA mode offline + sync automatique au retour |
| **Régulation MINESEC restrictive** | Faible | Élevé | Partenariat officiel ministère dès an 2 |
| **Piratage / clonage contenu** | Moyenne | Faible | Anti-clonage IA + watermarking + login serveur |
| **Départ équipe technique** | Moyenne | Moyen | Documentation exhaustive + actionnariat employé |
| **Mobile money block transfrontalier (expansion)** | Moyenne | Moyen | Multi-provider (MoMo + Orange + Stripe + Flutterwave) |

### 13.2 Risques macroéconomiques

- **Dévaluation FCFA** : neutre (recettes et coûts en FCFA, sauf Anthropic en USD)
- **Instabilité politique CM** : modérée (élections présidentielles 2025 passées)
- **Inflation papier (boutique manuels)** : transmission au prix consommateur

---

## 14. KPIs DE PILOTAGE

### 14.1 KPIs mensuels

| KPI | Objectif An 1 | Objectif An 3 | Objectif An 5 |
|---|---|---|---|
| **MAU** (Monthly Active Users) | 5 000 | 100 000 | 500 000 |
| **DAU** (Daily Active) | 1 500 | 30 000 | 150 000 |
| **Abonnés payants** | 300 | 8 000 | 60 000 |
| **Taux conversion free→paid** | 4 % | 8 % | 12 % |
| **Churn mensuel payants** | 10 % | 7 % | 5 % |
| **MRR** (Monthly Recurring Revenue) | 1,5 M F | 30 M F | 270 M F |
| **CAC moyen** | 5 000 F | 4 000 F | 3 000 F |
| **LTV moyen** | 20 000 F | 50 000 F | 80 000 F |
| **LTV/CAC** | 4× | 12× | 27× |
| **NPS** (Net Promoter Score) | 30 | 50 | 60 |

### 14.2 KPIs produit

- Temps moyen passé/jour : 25-40 min
- Nombre de questions IA / session : 3-5
- Taux de complétion d'un cours : 60 %+
- Cache hit rate IA : 50 % an 1 → 85 % an 3

---

## 15. ANNEXES

### Annexe A — Stack technique détaillée

[Voir documentation `/CLAUDE.md` et `/GUIDE_ELITE_DEPLOIEMENT.md`]

### Annexe B — Captures d'écran produit

- Interface visiteur (accueil + nav)
- Modal Ambassa (IA pédagogique)
- Mode QCM interactif (exercice → correction)
- Page admin validation (cache curation)
- Système paiement multi-canaux

### Annexe C — Partenaires identifiés

- **Anthropic** : API Claude Sonnet (contrat Enterprise possible >$10K/mois)
- **LWS Hosting** : hébergement infrastructure
- **MTN MoMo** : intégration paiements
- **Orange Money** : intégration paiements
- **MINESEC** : partenariat institutionnel en cours
- **Éditions CLÉ, NEA-Edicef, Proximité, AFREDIT** : fournisseurs manuels boutique

### Annexe D — Lettres d'intention

- *[À compléter avec les soutiens reçus]*

### Annexe E — État financier audité

- *[À fournir par expert-comptable agréé CM]*

### Annexe F — CV équipe fondatrice

- Jacques Miterand TAKOU — Fondateur & CEO

---

## 📞 CONTACT INVESTISSEUR

**Jacques Miterand TAKOU** — Fondateur & CEO VÉRITAS Academy

- 📧 contact@veritas-school.com
- 📱 WhatsApp : +237 697 637 739
- 🌐 https://veritas-school.com
- 📍 Centre VÉRITAS Academy, Douala — Cameroun
- 💼 LinkedIn : [profil à compléter]

---

*Document confidentiel — Mai 2026. Reproduction interdite sans autorisation écrite.*

*Toutes les projections financières sont indicatives et basées sur des hypothèses raisonnables ; les performances réelles peuvent varier.*
