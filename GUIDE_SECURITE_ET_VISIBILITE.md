# 🛡️ + 📈 GUIDE SÉCURITÉ & VISIBILITÉ — VÉRITAS Academy

> **Version :** v1.2 — Mai 2026
> **Public cible :** Centre VÉRITAS · Douala · Cameroun

---

# 🔐 PARTIE 1 — AUDIT DE SÉCURITÉ

## A) Failles découvertes et CORRIGÉES dans cette version

| # | Sévérité | Fichier | Faille | Correctif appliqué |
|---|---|---|---|---|
| 1 | 🔴 **CRITIQUE** | `api/db.php` | Aucune authentification — n'importe qui peut dump/écraser la base | Ajout `requireAuth()` Bearer obligatoire + rate-limit 60/min |
| 2 | 🔴 **CRITIQUE** | `api/upload.php` | Aucune auth, accepte SVG/HTML/JS (vecteurs XSS) | Ajout `requireAuth()` + whitelist stricte (PDF/MP4/images uniquement) |
| 3 | 🟠 **MAJEURE** | `api/upload.php` | Pas de blocage exécution PHP dans `uploads/` | `.htaccess` auto-créé avec `Require all denied` sur `.php/.cgi/.pl/.py/.sh` |
| 4 | 🟠 **MAJEURE** | `.htaccess` racine | Pas de HSTS, Permissions-Policy faible | HSTS 1 an, Permissions-Policy complète, COOP/CORP |
| 5 | 🟡 **MOYENNE** | `db.php` | Pas de détection mots de passe en clair | Pattern matching qui rejette tout payload avec `"pwd":"..."` non hashé |
| 6 | 🟡 **MOYENNE** | `VERITAS_v1.2.html` | Mots de passe par défaut hardcodés | Alerte automatique dans la cloche admin si défauts encore actifs |
| 7 | 🟢 **MINEURE** | `.htaccess` | Pas de blocage des scanners de vulnérabilités | Blocklist UA `sqlmap/nikto/nessus/acunetix/...` |
| 8 | 🟢 **MINEURE** | `.htaccess` | Pas de filtrage des QS d'injection | Blocage des patterns `union select`, `<script>`, `../` dans QUERY_STRING |

## B) Ce qui était DÉJÀ bien sécurisé (audit confirmé)

- ✅ **Mots de passe** : SHA-256 + sel unique par utilisateur, migration auto plain → hash au premier login
- ✅ **Anti-brute-force** : verrouillage progressif (3 échecs → 30s, 6 → 2min, 9 → 5min, 12 → 15min)
- ✅ **Session** : token unique généré, expiration 4h, stockée en `sessionStorage`
- ✅ **CSP** : Content-Security-Policy stricte sur les sources externes
- ✅ **Sanitisation** : fonction `_esc()` utilisée partout, `sanitizeInput()` pour les inputs
- ✅ **Audit log** : `DB.loginLog` (200 dernières connexions, échecs inclus)
- ✅ **Paiements** : webhooks vérifiés par signature `notif_token` (Orange) et `X-Reference-Id` (MTN)

## C) Limites résiduelles INHÉRENTES à l'architecture single-file

Ces points **ne peuvent pas être corrigés sans backend complet** (voir CLAUDE.md section 8 — Roadmap v40) :

| Limitation | Risque réel | Mitigation actuelle |
|---|---|---|
| Le code JS est lisible (Ctrl+U) | Un utilisateur curieux peut voir la logique | Aucune information critique (les vrais secrets sont sur LWS) |
| `DB` accessible dans la console DevTools | Un utilisateur connecté peut voir ses propres données | Isolation par origine — il ne voit pas les autres |
| Un élève peut modifier ses notes localement | Visible uniquement par lui dans son navigateur | Sauvegarde cloud écrasée par l'admin à chaque sync |
| Pas de webhook MTN/Orange vérifié côté serveur (sandbox uniquement) | Faible — l'admin valide manuellement | Polling actif + double vérification statut |

## D) Actions URGENTES côté admin

### 🚨 À FAIRE AUJOURD'HUI

1. **Changer les mots de passe par défaut** (Admin → Système → Comptes & Accès)
   - ❌ `directeur` / `Veritas2024!`
   - ❌ `superadmin` / `VERITAS_Super@2024!`
   - → mettre des phrases de 12+ caractères avec chiffres et symboles

2. **Changer le `API_SECRET`** dans `api/config_sync.php` :
   ```php
   define('API_SECRET', 'VOTRE_SECRET_DE_SYNC');   // ← REMPLACER par votre propre clé aléatoire
   ```
   → Générez une chaîne aléatoire de 32 caractères sur https://www.random.org/strings/
   → **Mettre à jour aussi** `DB.cloudConfig.secret` dans VÉRITAS (Paramètres → Cloud)

3. **Vérifier que `payment_config.php` n'est PAS sur GitHub** (contient credentials Orange/MTN)
   ```bash
   echo "api/payment_config.php" >> .gitignore
   git rm --cached api/payment_config.php 2>/dev/null
   ```

4. **Uploader les fichiers PHP corrigés** sur LWS :
   - `api/db.php` (nouveau, sécurisé)
   - `api/upload.php` (nouveau, sécurisé)
   - `.htaccess` (renforcé)

### 📅 À FAIRE CETTE SEMAINE

5. **Activer les sauvegardes LWS** dans le panel (sauvegarde quotidienne automatique de MySQL + fichiers)
6. **Tester l'audit log** : essayez de vous connecter avec un mauvais mot de passe 3 fois — devrait verrouiller votre compte 30s
7. **Configurer Cloudflare** (gratuit) devant veritas-school.com pour DDoS protection + CDN

---

# 📈 PARTIE 2 — VISIBILITÉ ET RÉFÉRENCEMENT SEO

## A) Ce qui a été AJOUTÉ dans cette version

| Élément | Fichier | Effet attendu |
|---|---|---|
| Meta description, keywords, geo | `VERITAS_v1.2.html` <head> | Google affiche un snippet attrayant |
| OpenGraph (Facebook, WhatsApp, LinkedIn) | `<meta property="og:*">` | Partage social avec image + titre |
| Twitter Cards | `<meta name="twitter:*">` | Aperçu riche sur Twitter/X |
| Schema.org JSON-LD | `<script type="application/ld+json">` | Eligibilité aux "rich results" Google (étoiles, horaires, etc.) |
| Sitemap.xml | `/sitemap.xml` | Soumission à Google Search Console |
| Robots.txt | `/robots.txt` | Contrôle des bots, blocage scrapers |
| Manifest PWA | `/manifest.webmanifest` | App installable sur smartphone, +SEO mobile |
| Google Analytics 4 | `<script gtag>` dans le head | Stats sessions / pages / conversion |
| Microsoft Clarity | `<script clarity>` dans le head | Heatmaps + session replays gratuits |

## B) 🚀 Plan de référencement en 7 étapes

### Étape 1 — Google Search Console (CRITIQUE — fait gagner 80% du trafic SEO)

1. Allez sur **https://search.google.com/search-console**
2. Connectez-vous avec un compte Google → **Ajouter une propriété**
3. Choisissez **Préfixe d'URL** : `https://veritas-school.com/`
4. **Vérifier la propriété** : choisissez **« Balise HTML »** (méthode la plus simple)
   - Copiez le code fourni (ex: `<meta name="google-site-verification" content="ABC123...">`)
   - Ajoutez-le dans `VERITAS_v1.2.html` juste après `<title>`
   - Re-déployez avec `deployer.ps1`
   - Cliquez **Vérifier**
5. ✅ Une fois vérifié → **Sitemaps** dans le menu de gauche
6. Saisissez : `sitemap.xml` → **Envoyer**
7. Google crawlera votre site dans les **3-7 jours** suivants

### Étape 2 — Google Analytics 4 (GA4)

1. https://analytics.google.com → **Commencer** → créer un compte `VERITAS Academy`
2. Créer une propriété **`veritas-school.com`** → Cameroun → XAF
3. Configurez un flux de données **Web** : `https://veritas-school.com`
4. Récupérez votre **ID de mesure** : `G-XXXXXXXXXX`
5. **Remplacer** dans `VERITAS_v1.2.html` les **2 occurrences** de `G-XXXXXXXXXX` par votre vrai ID
6. Re-déployez. Les stats commencent à 0 et se remplissent en temps réel.

### Étape 3 — Microsoft Clarity (heatmaps gratuits, illimités)

1. https://clarity.microsoft.com → **Get started** → connexion Microsoft / Google
2. Créer un projet `VERITAS Academy`
3. Récupérez votre **Project ID** (10 caractères, ex: `lj4kh8p2qz`)
4. **Remplacer** dans `VERITAS_v1.2.html` le placeholder `cccccccccc` par votre vrai ID
5. Re-déployez. Sous 24h vous verrez :
   - Carte de chaleur des clics
   - Replays de sessions visiteur
   - Pages les plus consultées
   - Taux de rage-click / scroll depth

### Étape 4 — Google My Business (référencement LOCAL)

🎯 **Le plus important pour Douala** : apparaître dans Google Maps + le panneau de droite quand on cherche "répétition Douala"

1. https://business.google.com/create → **Ajouter votre établissement**
2. Nom : `VÉRITAS Academy`
3. Catégorie principale : **« École de soutien scolaire »**
4. Catégories secondaires : **« Centre éducatif »**, **« Service de tutorat »**
5. Adresse : votre adresse réelle à Douala
6. Téléphone : `+237 697 637 739`
7. Site web : `https://veritas-school.com`
8. **Vérification** : Google envoie une carte postale (1-2 semaines) avec un code à saisir
9. Une fois vérifié :
   - ✅ Photos (10 minimum : façade, classes, élèves en cours, enseignants, événements)
   - ✅ Horaires précis
   - ✅ Description (750 caractères max — utilisez vos mots-clés !)
   - ✅ Demandez des **avis Google** à vos parents satisfaits (le facteur #1 du SEO local)

### Étape 5 — Réseaux sociaux Cameroun

#### a) Facebook (priorité #1 au Cameroun)
- Page : `facebook.com/VeritasAcademyCM`
- Cover photo : votre logo + slogan
- **Postez 3x/semaine** :
  - Lundi : un cours/fiche (exemple : "Comment réussir le commentaire au BAC")
  - Mercredi : un témoignage élève / résultat
  - Vendredi : un événement / inscription en cours
- Boostez les posts à **2 000 FCFA** ciblant Douala, parents 25-55 ans → conversion x10

#### b) Instagram + TikTok (lycéens)
- `@veritas.academy.cm`
- Reels courts (15-30s) :
  - "1 astuce maths/jour pour le BAC C"
  - Tour de classe
  - Coulisses des enseignants

#### c) WhatsApp Business (le canal le plus consulté au Cameroun)
- Convertir votre numéro `+237 697 637 739` en **WhatsApp Business** (gratuit)
- Catalogue : ajoutez vos packs, manuels avec prix
- Réponses automatiques : "Bonjour, merci de nous contacter. Un conseiller vous répondra sous 1h."
- Statut WhatsApp quotidien (15s = puissant)

### Étape 6 — Mots-clés SEO à viser

| Catégorie | Mots-clés à intégrer naturellement |
|---|---|
| **Local** | "répétition Douala", "soutien scolaire Cameroun", "centre scolaire Douala" |
| **Examens** | "préparation BEPC 2026", "préparation BAC Cameroun", "épreuves BAC corrigées" |
| **Programmes** | "MINESEC programme", "français 6ème Cameroun", "maths Terminale C" |
| **Long-tail** | "meilleur centre de répétition à Douala", "cours en ligne BAC séries A C D Cameroun" |

➡️ **Action** : créez régulièrement du contenu (annonces, articles) avec ces mots-clés dans les titres.

### Étape 7 — Backlinks (liens entrants = facteur SEO #2 après le contenu)

| Source | Comment l'obtenir |
|---|---|
| **CamerEcole** (annuaire camerounais) | Inscription gratuite + lien vers votre site |
| **MINESEC** | Demander à être listé comme centre privé homologué |
| **Forums parents** (par ex. CamerLove, CameroonInfo) | Répondre aux questions de parents avec des conseils + lien |
| **Bloggeurs camerounais** | Proposer un article invité (par ex. "5 conseils pour réussir le BAC") |
| **Partenariats** | Échangez des liens avec d'autres centres complémentaires (langues, informatique) |
| **Wikipedia** | Si vous avez de la presse, créer une page Wikipedia VÉRITAS Academy |

---

## C) 🎯 KPIs à suivre (audimètres)

### Dans Google Analytics 4

| KPI | Objectif 3 mois | Objectif 12 mois |
|---|---|---|
| Sessions / mois | 500 | 5 000 |
| Utilisateurs uniques / mois | 350 | 3 500 |
| Pages vues / session | > 3 | > 5 |
| Durée session moyenne | > 2 min | > 4 min |
| Taux de rebond | < 60% | < 40% |
| Conversions (inscriptions visiteurs) | 20/mois | 200/mois |

### Dans Google Search Console

| KPI | Objectif 3 mois | Objectif 12 mois |
|---|---|---|
| Pages indexées | 5+ | 20+ |
| Impressions Google | 1 000/mois | 50 000/mois |
| Clics depuis Google | 100/mois | 5 000/mois |
| Position moyenne | < 20 | < 5 |
| Mots-clés en top 10 | 5 | 50 |

### Dans Microsoft Clarity

| KPI | Objectif |
|---|---|
| Scroll depth moyen | > 75% |
| Taux de rage-click | < 2% |
| Sessions avec clic sur "S'inscrire" | > 10% |

### Dans Google My Business

| KPI | Objectif 6 mois |
|---|---|
| Vues du profil | 500/mois |
| Avis Google | 30+ avec note ≥ 4.5⭐ |
| Appels téléphoniques depuis Google | 20/mois |
| Demandes d'itinéraire | 10/mois |

---

## D) Calendrier d'actions (90 jours)

### Semaine 1
- [ ] Changer les mots de passe par défaut
- [ ] Uploader les fichiers de sécurité (db.php, upload.php, .htaccess)
- [ ] Soumettre sitemap.xml à Google Search Console
- [ ] Créer le compte Google My Business

### Semaine 2
- [ ] Créer / réactiver Google Analytics 4 et Clarity
- [ ] Créer la page Facebook + Instagram
- [ ] Convertir le numéro WhatsApp en WhatsApp Business
- [ ] Demander 5 premiers avis Google à des parents satisfaits

### Semaines 3-4
- [ ] 10 publications Facebook ciblées (boost 2 000 FCFA chacune)
- [ ] 5 reels Instagram / TikTok
- [ ] Inscription à 3 annuaires camerounais (CamerEcole, etc.)
- [ ] Premier article de blog SEO ("Comment se préparer au BEPC 2026")

### Mois 2
- [ ] 4 articles de blog par mois minimum
- [ ] Campagne Facebook Ads ciblée Douala (budget 20 000 FCFA/mois)
- [ ] Atteindre 10 avis Google ≥ 4.5⭐
- [ ] Mettre en place WhatsApp Business catalogue

### Mois 3
- [ ] Analyser GA4 / Search Console — identifier les mots-clés qui marchent
- [ ] Doubler le contenu sur les pages qui montent (effet boule de neige SEO)
- [ ] Partenariat avec 2 blogueurs / influenceurs éducatifs camerounais
- [ ] Première vidéo YouTube présentation du centre (avec liens vers site)

---

## E) 💰 Budget mensuel recommandé pour la visibilité

| Poste | Coût mensuel |
|---|---|
| Facebook Ads (Douala ciblé) | 20 000 FCFA |
| Google Ads (mots-clés "répétition Douala") | 15 000 FCFA |
| Création contenu (graphiste + freelance) | 25 000 FCFA |
| **TOTAL** | **60 000 FCFA / mois** |

ROI attendu : avec un abonnement annuel à 49 000 FCFA, il suffit de **2 nouveaux abonnés/mois** générés par la publicité pour amortir l'investissement.

---

## F) 📚 Outils gratuits indispensables

| Outil | Usage |
|---|---|
| **Google Search Console** | Suivre les requêtes Google et erreurs SEO |
| **Google Analytics 4** | Stats détaillées du trafic |
| **Microsoft Clarity** | Heatmaps + replays gratuits illimités |
| **Google My Business** | Fiche locale + Maps |
| **Google Trends** | Identifier les recherches en hausse au Cameroun |
| **Ubersuggest** (3 recherches/jour gratuites) | Idées de mots-clés |
| **AnswerThePublic** | Questions que se posent les internautes |
| **Canva** | Création visuels Facebook/Instagram |
| **Meta Business Suite** | Gérer Facebook + Instagram en un endroit |

---

## G) 🆘 Si vous êtes attaqué (réponse à incident)

1. **Détecter** : la cloche admin doit afficher des notifications d'activité suspecte. Vérifiez aussi `api/data/_security_log.txt` sur LWS.
2. **Isoler** : si compromission, désactiver temporairement le site en renommant `index.html` → `_index.html`
3. **Sauvegarder** : copier `api/data/veritas_db_backup.json` localement (preuve)
4. **Restaurer** : importer la dernière sauvegarde propre (Admin → Système → Paramètres → Importer JSON)
5. **Changer TOUS les secrets** : `API_SECRET`, mots de passe admin, credentials Orange/MTN
6. **Bloquer l'IP** dans `.htaccess` :
   ```
   <RequireAll>
     Require all granted
     Require not ip 1.2.3.4
   </RequireAll>
   ```
7. **Notifier** : Orange Money + MTN MoMo si paiements compromis

---

*© 2026 Mythe Errant · Centre VÉRITAS · Douala, Cameroun*
*Document généré automatiquement par Claude Code. Mises à jour régulières recommandées.*
