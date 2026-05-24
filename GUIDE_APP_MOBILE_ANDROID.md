# 📱 Guide complet — Publier VÉRITAS sur Google Play Store

> **Durée totale** : 2-3 jours de travail
> **Coût** : 25 USD (Play Store, paiement unique)
> **Pré-requis** : Windows 10/11, 8 Go RAM minimum

---

## 🎯 Vue d'ensemble

On va emballer le site `veritas-school.com` dans une **app Android native** grâce à Capacitor.js. L'app sera téléchargeable depuis Play Store, ouvrable depuis l'écran d'accueil, et bénéficiera des notifications push.

---

## 📦 Étape 1 — Installer les outils (1h)

### 1.1 Node.js
- Télécharger : https://nodejs.org → version LTS (20.x)
- Installer en gardant les options par défaut
- Vérifier : ouvrir PowerShell et taper `node --version` → doit afficher `v20.x.x`

### 1.2 Android Studio
- Télécharger : https://developer.android.com/studio (1 Go)
- Installer en cochant **Android SDK + Android Virtual Device**
- Premier lancement : laisser télécharger les SDKs (15-30 min)
- Définir la variable d'environnement `ANDROID_HOME` :
  - Win+R → `sysdm.cpl` → Avancé → Variables d'environnement
  - Ajouter `ANDROID_HOME` = `C:\Users\Mythe Errant\AppData\Local\Android\Sdk`

### 1.3 Java JDK 17
- Téléchargé automatiquement avec Android Studio. Vérifier dans `Android Studio → Settings → Gradle → JDK Location`.

---

## 🚀 Étape 2 — Initialiser Capacitor (30 min)

Ouvrir **PowerShell** dans le dossier du projet :

```powershell
cd "C:\Users\Mythe Errant\Downloads\Claude code"

# Initialiser un projet Node
npm init -y

# Installer Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android
npm install @capacitor/splash-screen @capacitor/status-bar @capacitor/push-notifications @capacitor/keyboard @capacitor/app

# La config existe déjà dans capacitor.config.json
# Créer le dossier www/ et y copier VERITAS_v1.2.html renommé en index.html
mkdir www
Copy-Item VERITAS_v1.2.html www\index.html
Copy-Item manifest.webmanifest www\
Copy-Item sw.js www\
Copy-Item "Logo détouré.png" www\

# Ajouter la plateforme Android
npx cap add android
npx cap sync
```

---

## 🎨 Étape 3 — Personnaliser l'icône et le splash (30 min)

### Icône
1. Aller sur https://icon.kitchen ou https://easyappicon.com
2. Uploader `Logo détouré.png` (recommandé : version 1024x1024 sur fond bleu nuit #142554)
3. Télécharger le pack Android
4. Copier les dossiers `mipmap-*` dans `android/app/src/main/res/`

### Splash screen
1. Créer une image 2732x2732 px (carrée) :
   - Fond : `#142554`
   - Centre : logo VÉRITAS doré
2. Aller sur https://www.appicon.co → Splash Screen
3. Uploader, télécharger le pack Android
4. Copier les fichiers `drawable-*` dans `android/app/src/main/res/`

---

## ⚙️ Étape 4 — Configurer Android Studio (1h)

```powershell
npx cap open android
```

Android Studio s'ouvre.

### 4.1 Identité de l'app
- Ouvrir `app/build.gradle`
- Vérifier :
  ```gradle
  android {
    namespace "cm.veritas.app"
    defaultConfig {
      applicationId "cm.veritas.app"
      versionCode 1
      versionName "1.2.4"
      minSdkVersion 22
      targetSdkVersion 34
    }
  }
  ```

### 4.2 Permissions
- Ouvrir `app/src/main/AndroidManifest.xml`
- Vérifier la présence de :
  ```xml
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  <uses-permission android:name="android.permission.WAKE_LOCK" />
  <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
  ```

### 4.3 Tester sur émulateur
- Menu Tools → Device Manager → Create Device → Pixel 6 + Android 14
- Cliquer "Run" (▶️) → l'émulateur lance VÉRITAS
- Tester : connexion, navigation, e-learning

---

## 🔐 Étape 5 — Créer la clé de signature (15 min)

```powershell
cd android
keytool -genkey -v -keystore release.keystore -alias veritas -keyalg RSA -keysize 2048 -validity 10000
```

Répondre aux questions :
- **Password** : choisir un mot de passe fort, **NE PAS PERDRE** (sans lui, impossible de publier des mises à jour)
- **Nom** : Jacques Miterand TAKOU
- **Organisation** : Centre VÉRITAS Academy
- **Ville** : Douala
- **Pays** : CM

⚠️ **CRITIQUE** : sauvegarder `release.keystore` et le mot de passe dans un endroit ULTRA SÛR (gestionnaire de mots de passe + clé USB + cloud chiffré).

Créer `android/keystore.properties` :
```properties
storeFile=../release.keystore
storePassword=VOTRE_MOT_DE_PASSE
keyAlias=veritas
keyPassword=VOTRE_MOT_DE_PASSE
```

Ajouter `keystore.properties` et `release.keystore` au `.gitignore`.

---

## 📦 Étape 6 — Builder l'AAB de production (10 min)

```powershell
cd "C:\Users\Mythe Errant\Downloads\Claude code\android"
.\gradlew bundleRelease
```

Le fichier généré est dans :
`android/app/build/outputs/bundle/release/app-release.aab`

Ce fichier `.aab` (Android App Bundle) est ce qu'on uploade sur Play Store.

---

## 🏪 Étape 7 — Publier sur Google Play Store (2h + délais de validation)

### 7.1 Créer un compte développeur (25 USD)
- Aller sur https://play.google.com/console
- Se connecter avec un compte Google (de préférence professionnel : `contact@veritas-school.com`)
- Payer 25 USD une fois (carte ou MoMo via wise.com)
- Compléter le profil développeur (24h de validation)

### 7.2 Créer l'app
- Console → Créer une application
- Remplir :
  - **Nom** : VÉRITAS Academy
  - **Langue par défaut** : Français
  - **Type** : Application
  - **Gratuit ou payant** : Gratuit
  - Cocher les déclarations (politique de contenu, exportation)

### 7.3 Fiche du Play Store
- **Titre** : VÉRITAS Academy
- **Description courte** (80 car.) : « Centre de répétitions Cameroun — Cours, BEPC/BAC, e-learning »
- **Description complète** (4000 car.) : voir `GUIDE_GOOGLE_MY_BUSINESS.md` ou
  > Préparez le BEPC et le BAC avec VÉRITAS Academy, le centre de répétitions n°1 à Douala. Cours en ligne, manuels, jeux éducatifs, classes virtuelles, IA tuteur. Conforme programme MINESEC. 6ème à Terminale. Activez votre compte gratuit en 30 secondes.
- **Catégorie** : Éducation
- **Email contact** : contact@veritas-school.com
- **Site web** : https://veritas-school.com
- **Politique de confidentialité** : créer une page `https://veritas-school.com/privacy.html`

### 7.4 Captures d'écran
Préparer 8 captures (5 phone + 3 tablet) :
- Page d'accueil
- E-learning
- Boutique
- Devoir IA
- Forum
- Bulletins
- Calendrier
- Parrainage

Format : 1080x1920 (phone) ou 1200x1920 (tablet).

### 7.5 Upload AAB
- Production → Créer une release
- Uploader `app-release.aab`
- Notes de version (français) :
  > Version 1.2.4 — Lancement officiel. PWA + offline + IA tuteur + 22 œuvres au programme.

### 7.6 Validation et publication
- Google valide en 1-7 jours
- L'app apparaît sur https://play.google.com/store/apps/details?id=cm.veritas.app

---

## 🚀 Étape 8 — Mises à jour futures

À chaque nouvelle version de VÉRITAS :

```powershell
# 1. Mettre à jour le HTML
Copy-Item VERITAS_v1.2.html www\index.html -Force

# 2. Incrémenter le versionCode dans android/app/build.gradle
#    versionCode 2 (était 1)
#    versionName "1.2.5"

# 3. Rebuild
npx cap sync
cd android
.\gradlew bundleRelease

# 4. Re-uploader l'AAB sur Play Console
```

---

## 📊 Estimations

| Tâche | Temps | Coût |
|---|---|---|
| Installation outils | 1h | 0 |
| Setup Capacitor | 30 min | 0 |
| Icône + splash | 30 min | 0 |
| Test émulateur | 1h | 0 |
| Build production | 10 min | 0 |
| Compte Play Store | 30 min | 25 USD |
| Fiche + captures | 2h | 0 |
| **TOTAL setup initial** | **~6h** | **25 USD** |
| Mises à jour mensuelles | ~30 min | 0 |

---

## ✅ Check-list avant publication

- [ ] L'app fonctionne offline (Service Worker actif)
- [ ] Toutes les permissions justifiées
- [ ] Politique de confidentialité publiée sur veritas-school.com
- [ ] Icône et splash conformes (pas de pixels)
- [ ] Mot de passe keystore sauvegardé en 3 endroits
- [ ] Captures d'écran propres (pas de données test)
- [ ] Test sur 2 vrais appareils (un récent, un plus ancien)

---

*Guide rédigé par Claude — VÉRITAS v1.2 → app mobile native*
*Pour toute question : ce guide vous accompagne pas-à-pas*
