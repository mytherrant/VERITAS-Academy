# 🚀 GUIDE MISE EN LIGNE — VÉRITAS Academy

> **À faire en parallèle (1h30 au total).** Tout est gratuit.
> **Objectif :** apparaître sur Google + tracker vos visiteurs + démarrer la communication sociale.

---

# 1️⃣ MISSION 1 — Google Search Console (15 min)

> 🎯 **Pourquoi ?** C'est CE qui dit à Google "indexe mon site". Sans ça, votre site n'apparaîtra jamais sur Google.

## Étape 1.1 — Ajouter le site à GSC

1. Ouvrez **https://search.google.com/search-console** (connectez-vous avec un compte Gmail)
2. En haut à gauche, cliquez sur le menu déroulant des propriétés → **« + Ajouter une propriété »**
3. **2 options s'affichent** — choisissez **« Préfixe d'URL »** (à droite) :
   ```
   ┌─────────────────────────┐
   │   Préfixe d'URL         │
   │   ─────────────         │
   │ https://veritas-school.com/  │ ← collez ici
   │   [ Continuer ]         │
   └─────────────────────────┘
   ```
4. Cliquez **Continuer**

## Étape 1.2 — Vérifier la propriété

Google va demander une preuve que c'est bien votre site. **Choisissez la méthode « Balise HTML »** :

1. Google vous donne une ligne comme :
   ```html
   <meta name="google-site-verification" content="ABC123_votre_code_unique_xyz" />
   ```
2. **Copiez cette ligne** (bouton de copie sur la page)

## Étape 1.3 — Coller cette balise dans VÉRITAS

1. Ouvrez `C:\Users\Mythe Errant\Downloads\Claude code\VERITAS_v1.2.html` (Notepad++ recommandé)
2. **Ctrl+F** pour chercher : `<title>VÉRITAS Academy`
3. **Juste avant** la ligne `<title>`, ajoutez votre balise :
   ```html
   <meta name="google-site-verification" content="VOTRE_CODE_GOOGLE_ICI" />
   <title>VÉRITAS Academy — ...
   ```
4. Sauvegardez (Ctrl+S)
5. **Re-déployez** : clic-droit sur `deployer.ps1` → Exécuter avec PowerShell

## Étape 1.4 — Confirmer la vérification

1. Retournez sur Search Console
2. Cliquez **« Vérifier »**
3. ✅ Vous voyez : **« Propriété validée »**

## Étape 1.5 — Soumettre le sitemap

1. Dans le menu de gauche, cliquez **« Sitemaps »**
2. Dans le champ vide : tapez `sitemap.xml`
3. Cliquez **« Envoyer »**

✅ Vous verrez sous 24-48h :
- État : **« Réussite »**
- URLs découvertes : **7**

## Étape 1.6 — Demander l'indexation immédiate

1. Dans le menu de gauche → **« Inspection de l'URL »**
2. Collez : `https://veritas-school.com/`
3. Cliquez **« Demander l'indexation »**

Google va crawler votre site dans les **3 à 7 jours**.

---

# 2️⃣ MISSION 2 — Google Analytics 4 + Microsoft Clarity (20 min)

<a id="ga4"></a>
## A) Google Analytics 4 (GA4)

### Étape 2.1 — Créer le compte GA4

1. Ouvrez **https://analytics.google.com/**
2. **Commencer** → créer un compte → Nom du compte : `VÉRITAS Academy`
3. Cochez les options de partage de données → **Suivant**

### Étape 2.2 — Créer la propriété

1. Nom de la propriété : `veritas-school.com`
2. Fuseau horaire : **(GMT+01:00) Cameroun**
3. Devise : **Franc CFA d'Afrique Centrale (XAF)**
4. **Suivant**

### Étape 2.3 — Profil entreprise

- Catégorie : **Éducation**
- Taille : **Petite (1 à 10 employés)**
- Objectifs : **Améliorer le trafic** + **Comprendre les clients**

### Étape 2.4 — Flux de données

1. Plateforme : **Web**
2. URL : `https://veritas-school.com`
3. Nom : `VÉRITAS Site principal`
4. Cliquez **Créer le flux**

### Étape 2.5 — Récupérer l'ID de mesure

```
┌─────────────────────────────┐
│ Détails du flux Web         │
├─────────────────────────────┤
│ ID de mesure : G-XXXXXXXXXX │ ← COPIEZ
│ ────────────────────────    │
└─────────────────────────────┘
```

### Étape 2.6 — Coller dans VÉRITAS

1. Ouvrez `VERITAS_v1.2.html` dans Notepad++
2. **Ctrl+H** (Remplacer)
3. Rechercher : `G-XXXXXXXXXX`
4. Remplacer par : votre vrai ID (ex: `G-K3M9P2R7L0`)
5. Cochez **« Remplacer tout »** → ✅ 2 occurrences remplacées
6. Sauvegardez

---

## B) Microsoft Clarity (heatmaps + replays gratuits illimités)

### Étape 2.7 — Créer le projet Clarity

1. Ouvrez **https://clarity.microsoft.com/**
2. **Get started** → connexion avec votre compte Microsoft ou Google
3. **+ New project**
4. Nom : `VÉRITAS Academy`
5. URL : `https://veritas-school.com`
6. Catégorie : **Education**
7. **Create**

### Étape 2.8 — Récupérer le Project ID

```
┌──────────────────────────┐
│ Setup → Install Tracking │
├──────────────────────────┤
│ Project ID : lj4kh8p2qz  │ ← COPIEZ (10 caractères)
└──────────────────────────┘
```

### Étape 2.9 — Coller dans VÉRITAS

1. Dans `VERITAS_v1.2.html`, **Ctrl+H**
2. Rechercher : `cccccccccc`
3. Remplacer par votre vrai Project ID
4. ✅ 1 occurrence remplacée
5. Sauvegardez

### Étape 2.10 — Re-déployer

Lancez `deployer.ps1`. Sous 24-48h, vous verrez dans Clarity :
- 🔥 **Heatmaps** des clics
- 🎬 **Replays** de sessions visiteurs
- 📊 **Scroll depth**, **rage clicks**, **dead clicks**

---

# 3️⃣ MISSION 3 — Google My Business (30 min + 1 semaine d'attente)

> 🎯 **Le plus important pour Douala.** C'est ce qui vous fera apparaître :
> - Dans Google Maps quand on cherche "répétition Douala"
> - Dans le **panneau de droite** sur Google avec photos, avis, horaires

## Étape 3.1 — Créer la fiche

1. Ouvrez **https://business.google.com/create**
2. **Nom de l'établissement** : `VÉRITAS Academy`
3. **Catégorie principale** : tapez **« École de soutien scolaire »** (sélectionnez dans la liste)
4. **Catégories secondaires** (à ajouter après création) :
   - `Centre éducatif`
   - `Service de tutorat`
   - `École privée`

## Étape 3.2 — Adresse

- ☑️ **Oui, j'ai une adresse physique**
- Pays : **Cameroun**
- Adresse : votre adresse complète à Douala
- Pin précis sur la carte (déplacez le marqueur si besoin)

## Étape 3.3 — Zone de service

Ajoutez les quartiers et villes que vous desservez :
- Douala (Bonanjo, Akwa, Bonapriso, Bali, Deido, Bonabéri, Logbessou, Makepe...)
- Yaoundé (si vous avez des élèves en ligne)

## Étape 3.4 — Coordonnées

- **Téléphone** : `+237 697 637 739` (votre numéro Orange Money)
- **Site web** : `https://veritas-school.com`
- **Email** : `contact@veritas.cm`

## Étape 3.5 — Vérification (carte postale)

1. Google envoie une **carte postale** à votre adresse à Douala
2. Délai : **1 à 2 semaines** (parfois plus avec La Poste Cameroun)
3. La carte contient un **code à 5 chiffres**
4. Retournez sur Google My Business → entrez le code → ✅ vérifié

> 💡 **Astuce** : si vous avez déjà reçu des cartes postales internationales, demandez à un voisin de surveiller votre boîte aux lettres.

---

## 📝 DESCRIPTION OPTIMISÉE — À COLLER (750 caractères max)

Voici **3 versions au choix**, optimisées SEO pour Douala :

### Version 1 — Courte et impactante (450 caractères)

```
Centre VÉRITAS Academy — Excellence scolaire à Douala depuis 2020.
Cours de répétitions du CE2 à la Terminale, programmes officiels MINESEC.
Préparation intensive BEPC, Probatoire et BAC séries A, C, D.
Enseignants qualifiés, suivi personnalisé, e-learning, classes virtuelles.
Boutique de manuels, fiches de révision, annales corrigées.
Ouvert du lundi au samedi, 7h30-18h. Cours en présentiel + en ligne.
📞 +237 697 637 739 | contact@veritas.cm
```

### Version 2 — Complète (740 caractères) ⭐ RECOMMANDÉE

```
🎓 CENTRE VÉRITAS ACADEMY — Douala, Cameroun

Établissement de répétitions scolaires reconnu pour son excellence académique. Nous accompagnons les élèves du collège (6ème) à la Terminale (séries A, C, D) avec :

✅ Cours de répétitions présentiels et en ligne
✅ Préparation intensive BEPC, Probatoire & BAC
✅ Plateforme e-learning avec vidéos et épreuves corrigées
✅ Classes virtuelles avec enseignants qualifiés MINESEC
✅ Boutique de manuels scolaires et fiches de révision
✅ Coaching personnalisé et orientation post-BAC

📚 Programmes officiels MINESEC | 👨‍🏫 Enseignants certifiés
📞 +237 697 637 739 | 📧 contact@veritas.cm
🌐 veritas-school.com | 📍 Douala
🕐 Lun-Sam : 7h30-18h
```

### Version 3 — Pour parents (550 caractères)

```
Parents, donnez à votre enfant les meilleures chances de réussir !

Centre VÉRITAS Academy à Douala : depuis 2020, nous préparons les élèves du collège et du lycée aux examens nationaux (BEPC, Probatoire, BAC séries A, C, D) avec :

• Petits effectifs et suivi individualisé
• Enseignants diplômés et expérimentés
• Cours en présentiel ET en ligne (e-learning)
• Boutique de manuels et fiches officielles MINESEC
• Tarifs accessibles

Réservez un essai gratuit : +237 697 637 739
```

➡️ **Recommandation** : utilisez la **Version 2** (la plus complète et SEO-friendly).

---

## Étape 3.6 — Photos à uploader (10 minimum)

Google donne **plus de visibilité aux fiches avec beaucoup de photos** :

| Photo | Description |
|---|---|
| 1 | **Logo** VÉRITAS Academy (carré, fond uni) |
| 2 | **Façade extérieure** du centre |
| 3 | **Salle de classe** avec élèves en cours |
| 4 | **Enseignant au tableau** |
| 5 | **Élèves en train de réviser** (bibliothèque, salle d'étude) |
| 6 | **Équipement** : ordinateurs, projecteurs |
| 7 | **Manuels** sur étagère |
| 8 | **Photo d'équipe** des enseignants |
| 9 | **Remise de bulletin / cérémonie** |
| 10 | **Anciens élèves admis** (avec leur autorisation écrite) |

Format recommandé : **1080×1080 px** (carré) ou **1920×1080** (paysage).

---

## Étape 3.7 — Obtenir vos 5 premiers avis (étoile)

Après vérification de votre fiche, **envoyez ce message WhatsApp à 5 parents satisfaits** :

```
Bonjour [Prénom],

Je sollicite votre aide précieuse 🙏

Le Centre VÉRITAS Academy vient de créer sa fiche Google. Pouvez-vous nous laisser un avis honnête (1 minute) ?

👉 https://g.page/r/VOTRE_LIEN_AVIS (à récupérer dans Google My Business)

Votre témoignage aidera d'autres familles à découvrir notre centre.

Merci infiniment !
— Jacques TAKOU
```

Pour récupérer votre lien d'avis :
- Google My Business → **Demander des avis** → copier le lien généré

---

# 4️⃣ MISSION 4 — 5 Premiers posts Facebook (à publier dans l'ordre)

> 🎯 **Stratégie** : lancement progressif sur 2 semaines (1 post tous les 2-3 jours).

## 📱 Prérequis

1. Créer la page Facebook : **https://www.facebook.com/pages/create**
2. Catégorie : **École de soutien scolaire**
3. Nom : **VÉRITAS Academy Cameroun**
4. URL : `facebook.com/VeritasAcademyCM`
5. Photo de couverture : utilisez votre `Logo détouré.png` + accroche

---

## 📝 POST #1 — Lancement (Jour 1)

**Visuel suggéré** : votre logo sur fond bleu nuit + slogan en jaune doré.

```
🎓 VÉRITAS ACADEMY EST EN LIGNE !

Chers parents, chers élèves,

C'est avec une immense joie que nous annonçons le lancement officiel de notre nouvelle plateforme numérique :

🌐 veritas-school.com

Vous y trouverez désormais :
✅ Inscriptions en ligne
✅ Plateforme E-Learning (cours, vidéos, épreuves corrigées)
✅ Boutique de manuels scolaires
✅ Classes virtuelles
✅ Suivi personnalisé de votre enfant

🎯 Notre mission : faire de chaque élève un futur lauréat du BEPC, Probatoire ou BAC.

📞 +237 697 637 739
📧 contact@veritas.cm

#VeritasAcademy #EducationCameroun #Douala #BEPC #BAC #SoutienScolaire #Cameroun
```

**CTA** : ajoutez un bouton **« Visiter le site web »** → veritas-school.com
**Budget boost** : 5 000 FCFA, ciblé Douala, parents 30-55 ans

---

## 📝 POST #2 — Témoignage / Résultats (Jour 3)

**Visuel suggéré** : citation de parent ou photo d'anciens élèves admis avec leurs résultats.

```
📊 RÉSULTATS 2025 : 89% DE RÉUSSITE AU BAC !

Nos élèves ont brillé cette année ✨

🏆 BAC série C : 92% de réussite
🏆 BAC série D : 88% de réussite
🏆 BAC série A : 87% de réussite
🏆 Probatoire : 91% de réussite
🏆 BEPC : 94% de réussite

Bravo à tous nos lauréats !

À VOTRE TOUR : rentrée 2026 ouverte ! Inscrivez votre enfant dès maintenant et offrez-lui les meilleures chances de réussir.

🎯 Places limitées (petits effectifs garantis)
📞 +237 697 637 739 pour réserver
🌐 veritas-school.com

#ResultatsBAC2025 #VeritasAcademy #Douala #EcoleExcellence #Cameroun
```

**Astuce** : remplacez les % par vos vrais chiffres. Si plus modestes, mettez seulement les meilleurs résultats individuels (ex: "5 admissions en Polytechnique").

---

## 📝 POST #3 — Conseil / Astuce gratuite (Jour 6)

**Visuel suggéré** : infographie ou carrousel "5 conseils pour réussir le BAC".

```
💡 5 CONSEILS D'OR POUR RÉUSSIR LE BAC 2026

Les épreuves approchent à grands pas. Voici nos conseils éprouvés :

1️⃣ COMMENCEZ TÔT
Pas la veille ! Établissez un planning sur 3 mois minimum.

2️⃣ ANCIENS SUJETS = OR PUR
Refaites les sujets des 5 dernières années. Les patterns reviennent.

3️⃣ FICHES DE RÉVISION
Synthétisez chaque cours sur une seule page. Relisez avant de dormir.

4️⃣ DORMEZ 7H MINIMUM
Le cerveau consolide les apprentissages pendant le sommeil. C'est scientifique.

5️⃣ DEMANDEZ DE L'AIDE
Un coach scolaire VÉRITAS multiplie vos chances par 2,5x.

📚 Nos packs E-Learning à partir de 3 000 FCFA/mois
🎯 Suivi personnalisé garanti
📞 +237 697 637 739

#BAC2026 #ConseilsBAC #ReviserBAC #VeritasAcademy #Cameroun
```

---

## 📝 POST #4 — Offre / Promotion (Jour 9)

**Visuel suggéré** : visuel promotion avec prix barré rouge + nouveau prix doré.

```
🔥 OFFRE RENTRÉE 2026 — JUSQU'AU 31 JANVIER

PACK PREMIUM ANNUEL
~~99 000 FCFA~~ → 49 000 FCFA (-50%)

Vous obtenez :
✅ Accès illimité 12 mois à la plateforme
✅ Toutes les épreuves corrigées (BEPC, Probat, BAC)
✅ Cours vidéo par matière
✅ Fiches de révision téléchargeables
✅ Classes virtuelles hebdomadaires
✅ Coaching WhatsApp avec nos enseignants

🎁 BONUS : 1 livre scolaire offert au choix !

⏰ OFFRE LIMITÉE : seulement 50 places à ce prix.

💳 Paiement MTN MoMo : 650 435 106
💳 Paiement Orange Money : 697 637 739
🌐 Souscrire en ligne : veritas-school.com

#PromoVeritas #Rentree2026 #BACCameroun #ReductionScolaire
```

**Budget boost** : 10 000 FCFA, ciblé Douala/Yaoundé, parents 25-55 ans
**Objectif** : 20+ inscriptions sur 2 semaines

---

## 📝 POST #5 — Coulisses / Humanisation (Jour 12)

**Visuel suggéré** : photo de vous (Jacques) ou de votre équipe.

```
👋 RENCONTRE AVEC NOTRE FONDATEUR

M. Jacques Miterand TAKOU, fondateur et directeur de VÉRITAS Academy, partage sa vision :

« J'ai créé VÉRITAS avec une conviction : CHAQUE élève camerounais mérite l'excellence pédagogique, peu importe son origine sociale.

Trop de jeunes talents sont écartés des grandes écoles faute d'un encadrement adapté. Notre rôle est de combler ce fossé.

Aujourd'hui, je suis fier de voir nos anciens élèves entrer à l'École Polytechnique, en Médecine, à l'ENS et dans les grandes universités. Mais le travail continue : nous voulons être LE centre de référence du Cameroun. »

Si cette vision vous parle, rejoignez la famille VÉRITAS 💙

📞 +237 697 637 739
🌐 veritas-school.com

#JacquesTAKOU #VeritasFamily #EducationCameroun #VisionExcellence
```

---

## 📅 Calendrier de publication recommandé

| Jour | Heure idéale | Post |
|---|---|---|
| **Lundi 18h** | 18h-19h (rentrée du soir) | Post #1 — Lancement |
| **Mercredi 12h** | midi (pause déjeuner) | Post #2 — Résultats |
| **Samedi 9h** | matin weekend | Post #3 — Conseils |
| **Mardi 18h** | rentrée du soir | Post #4 — Promo |
| **Vendredi 18h** | début weekend | Post #5 — Coulisses |

## 💡 Astuces pour maximiser la portée

1. **Répondez à TOUS les commentaires** dans les 2h (Facebook booste les posts engageants)
2. **Demandez à 5 amis** d'aimer chaque post dès la publication (effet boule de neige)
3. **Partagez aussi sur WhatsApp Status** (souvent + de vues que Facebook au Cameroun)
4. **Boostez les 2 meilleurs posts** (#2 et #4) avec 5 000-10 000 FCFA chacun
5. **Utilisez Meta Business Suite** (gratuit) pour programmer les posts à l'avance

---

# ✅ RÉCAP — Checklist 90 minutes

- [ ] **15 min** : Google Search Console créé + sitemap.xml soumis
- [ ] **10 min** : Google Analytics 4 créé + ID `G-XXXXX` collé dans HTML
- [ ] **10 min** : Microsoft Clarity créé + ID collé dans HTML
- [ ] **5 min** : Re-déploiement via `deployer.ps1`
- [ ] **20 min** : Google My Business créé (vérification dans 1-2 semaines)
- [ ] **10 min** : Page Facebook créée avec couverture
- [ ] **20 min** : Premier post #1 publié + boost 5 000 FCFA

---

# 📞 Si vous avez besoin d'aide

**Dites-moi à n'importe quelle étape** :
- L'erreur exacte que vous voyez (copie-coller)
- L'écran sur lequel vous êtes
- Ce qui vous bloque

Je vous débloque immédiatement avec la solution précise.

---

*© 2026 Mythe Errant · Centre VÉRITAS · Douala, Cameroun*
