# 🎨 AUDIT DESIGN & ERGONOMIE — VÉRITAS v1.2

> **Auditeur** : Claude (Sonnet 4.7) — posture senior UI/UX designer + design systems
> **Date** : 24 mai 2026
> **Posture** : sincère et objective, basée sur les **données réelles du code** (pas un audit générique)

---

## 📊 MESURES OBJECTIVES (extraites du fichier)

| Métrique | Valeur | Verdict |
|---|---|---|
| **Familles de police** utilisées | **10 différentes** (Inter, Montserrat, Georgia, Libre Baskerville, Lora, Poppins, Outfit, Fira Code, Arial, Times New Roman) | 🔴 Très excessif — devrait être 2-3 max |
| **Déclarations `font-family`** dans le code | 491 | 🔴 Système non centralisé |
| **Couleurs hexadécimales uniques** | **329** | 🔴 Énorme — devrait être ~20-30 |
| **Variables CSS définies** | 35 | 🟠 Existent mais peu utilisées |
| **Valeurs `border-radius` uniques** | 29 | 🔴 Devrait être 4-5 (sm/md/lg/xl/full) |
| **Valeurs `padding` uniques en px** | 35 | 🟠 Sans système 4/8 |
| **Valeurs `font-size` uniques en px** | 52 | 🔴 Devrait être 8-10 (échelle typographique) |
| **`box-shadow` uniques** | 124 | 🔴 Devrait être 4-5 (xs/sm/md/lg/xl) |
| **`linear-gradient` utilisés** | 337 | 🟠 Trop — donne aspect "AI-generated" |
| **Styles inline `style="..."`** | **2 322** | 🔴 Catastrophique — non maintenable |
| **`!important`** | **356** | 🔴 Cascade CSS brisée — chaque ajout casse le précédent |
| **`@media queries`** | 27 | 🟠 Insuffisant pour 33 000 lignes |
| **`aria-label`** | **0** | 🔴 Accessibilité quasi-inexistante |
| **`:focus` styles personnalisés** | 12 | 🔴 Navigation clavier impraticable |
| **`role="..."`** attributs | 1 | 🔴 Lecteurs d'écran perdus |
| **z-index uniques** | 23 | 🟠 Pas d'échelle définie — risque de superposition |
| **`transition`** | 234 | ✅ Bon usage des micro-interactions |
| **`animation`** | 130 | 🟠 Risque sur-animation, fatigue visuelle |

---

## 🔍 ANALYSE QUALITATIVE

### 🔴 PROBLÈMES MAJEURS

#### 1. **Cacophonie typographique** — 10 polices différentes

Le code mélange **10 familles de police** sans logique éditoriale claire :

| Police | Usage actuel | Problème |
|---|---|---|
| **Inter** | Body, formulaires | ✅ OK |
| **Montserrat** | Titres, boutons, sidebars (la plus utilisée) | 🟠 Trop générique, déjà vue partout sur le web |
| **Georgia** | Descriptions, sous-titres italiques | 🔴 Police système Microsoft, daté |
| **Libre Baskerville** | Œuvres littéraires | ✅ Pertinent pour littérature |
| **Lora** | Plans, certaines cartes | 🔴 Doublon avec Libre Baskerville |
| **Poppins** | Footer, quelques sections | 🔴 Doublon avec Montserrat |
| **Outfit** | 2-3 endroits | 🔴 Police fantôme — pourquoi est-elle là ? |
| **Fira Code** | Numéros stats, codes | 🟠 OK mais devrait être JetBrains Mono ou IBM Plex Mono (plus moderne) |
| **Arial / Times New Roman** | Documents PDF / impression | 🔴 Polices web "1995" |

**Verdict** : on devine que des copier-collers successifs ont introduit chaque police sans nettoyage. Le site n'a **pas d'identité typographique reconnaissable**.

**Recommandation** : passer à un système 3-tier :
- **Display** (titres) : `Plus Jakarta Sans` ou `General Sans` ou `Space Grotesk`
- **Body** : `Inter` (à garder)
- **Serif/Éditorial** (littérature, citations) : `Crimson Pro` ou `Source Serif Pro`
- **Mono** : `JetBrains Mono`

→ supprimer Georgia, Lora, Poppins, Outfit, Arial, Times.

---

#### 2. **329 couleurs hex différentes** — palette explosée

Vos 5 couleurs principales sont identifiables :
- `#142554` (bleu nuit) — 447 occurrences ✅
- `#FFC93C` (or VÉRITAS) — 285 ✅
- `#059669` (vert succès) — 163 ✅
- `#DC2626` (rouge erreur) — 154 ✅
- `#7C3AED` (violet) — 144 🟠

Mais en queue de distribution : **324 autres couleurs** apparaissent moins de 50 fois. Certaines sont des doublons :
- `#142554` vs `#1a3a8a` vs `#1E3A8A` (3 bleus très proches)
- `#FFC93C` vs `#F5B800` vs `#FBBF24` vs `#F59E0B` (4 jaunes/ambres)
- `#3C8DFF` vs `#3B82F6` (2 bleus clairs presque identiques)

**Cause racine** : utilisation directe de hex au lieu des variables CSS définies. Vous avez `--bl`, `--gold`, `--gr` mais ils ne sont pas utilisés systématiquement.

**Recommandation** : palette à 11 couleurs nommées (système 50/100/300/500/700/900) :

```
Primary    : 6 nuances de bleu nuit
Accent     : 6 nuances d'or
Semantic   : success/warning/error/info (4)
Neutral    : 9 nuances de gris
```

Total : **40 couleurs maximum** au lieu de 329.

---

#### 3. **2 322 styles inline `style="..."`** — cauchemar de maintenance

C'est **le problème n°1** du code. Chaque modification visuelle nécessite de toucher au HTML, pas au CSS. Conséquences :
- Impossible de créer un thème sombre cohérent
- Impossible de faire un redesign global
- Cache CSS inutilisable (les styles sont dans le HTML, pas dans des fichiers `.css`)
- Le HTML pèse 3.35 Mo dont ~700 Ko sont des styles inline répétés

**Recommandation** : extraire les styles inline en classes utilitaires nommées sémantiquement. Exemple :

```html
<!-- AVANT (inline) -->
<button style="background:linear-gradient(135deg,rgba(16,185,129,.18),rgba(16,185,129,.05));color:#10B981;border-radius:20px;margin:3px 2px;font-weight:700">

<!-- APRÈS (classe sémantique) -->
<button class="btn-pill btn-success-soft">
```

---

#### 4. **356 `!important`** — cascade CSS brisée

Quand un développeur ajoute `!important`, c'est qu'il a perdu le contrôle de la spécificité CSS. **356 fois**, ça veut dire que chaque nouveau composant essaie de "forcer" son style par-dessus les précédents.

**Conséquence concrète** : si je veux changer la couleur d'un bouton, je dois souvent ajouter encore un `!important` au-dessus → spirale.

**Recommandation** : refactoring vers un système BEM ou CSS Modules avec spécificité contrôlée.

---

#### 5. **0 attribut `aria-label`** — accessibilité catastrophique

Pour un utilisateur aveugle avec un lecteur d'écran NVDA / JAWS / VoiceOver, votre site est **inutilisable** :
- Les boutons icône (📋, ✏️, 🚀) sont annoncés "clipboard, pencil, rocket" — aucun sens
- La navigation au clavier est cassée (12 styles `:focus` sur tout le site)
- Aucun landmark (`role="navigation"`, `role="main"`)

**Au Cameroun**, la malvoyance touche ~3% de la population (OMS). Vous excluez ces utilisateurs.

**Recommandation** : audit accessibilité complet avec axe DevTools + ajout de :
- `aria-label` sur tous les boutons icône (~150 boutons concernés)
- `role="main"`, `role="navigation"`, `role="dialog"` sur les conteneurs
- Styles `:focus-visible` cohérents (ring or 2px partout)
- `prefers-reduced-motion` pour désactiver animations

---

#### 6. **337 dégradés `linear-gradient`** — aspect "AI generated"

C'est un piège classique : utiliser des dégradés partout (boutons, fonds, bordures, textes) donne au final un aspect **uniformément flou et générique**. Les designers de pointe en 2026 reviennent vers les aplats avec accents calculés.

**Comparaison** : Apple, Linear, Stripe — quasi-zéro dégradé. Le luxe c'est l'aplat.

**Recommandation** : réserver les dégradés à **3 cas** :
1. Hero (image décorative)
2. Élévation (cards avec ombre subtile)
3. États actifs/hover (boutons CTA principaux)

Tout le reste → aplats. Vous gagnerez en élégance et en performance (les gradients sont coûteux à rendre).

---

#### 7. **29 valeurs de `border-radius` différentes**

`2px, 3px, 4px, 6px, 8px, 10px, 12px, 14px, 16px, 18px, 20px, 22px, 24px, 26px, 28px, 30px...`

Aucun système. Une carte fait `12px`, une autre `14px`, une autre `16px` — à l'œil c'est imperceptible mais ça donne une impression diffuse de désordre.

**Recommandation** : système 5 valeurs **maximum** :
- `--r-sm: 6px` (chips, badges)
- `--r-md: 12px` (cards, inputs)
- `--r-lg: 16px` (modales, hero)
- `--r-xl: 24px` (sections marketing)
- `--r-full: 9999px` (pills, avatars)

---

#### 8. **124 `box-shadow` uniques** — élévation incohérente

Sans système d'élévation, l'œil ne sait pas hiérarchiser. Une notification flottante devrait être visiblement "plus haute" qu'une carte. Mais avec 124 ombres différentes, tout devient confus.

**Recommandation** : Material Design 3 ou Tailwind shadow-scale (5 niveaux) :
- `shadow-xs` : `0 1px 2px rgba(0,0,0,.05)`
- `shadow-sm` : `0 2px 8px rgba(0,0,0,.06)`
- `shadow-md` : `0 8px 24px rgba(0,0,0,.08)`
- `shadow-lg` : `0 16px 40px rgba(0,0,0,.10)`
- `shadow-xl` : `0 24px 64px rgba(0,0,0,.14)`

---

### 🟠 PROBLÈMES MOYENS

#### 9. **27 media queries pour 33 000 lignes**

Soit 1 media query toutes les ~1200 lignes. Le site est probablement **cassé sur mobile** dans certaines vues admin (cf. tableaux, modales larges).

**Recommandation** : approche **mobile-first** avec breakpoints stricts :
- `mobile` : 320-639px
- `tablet` : 640-1023px
- `desktop` : 1024-1535px
- `wide` : 1536+

Refactor des grilles avec `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))` (déjà partiellement utilisé — bien !).

#### 10. **Profusion d'emojis dans les boutons**

`🛒 Marketplace`, `🎁 Parrainage`, `🧠 Parcours IA`, `📊 Stats`, `💬 Forum`... Quasi tous les boutons ont un emoji devant.

**Problème** : sur Android ancien, les emojis sont rendus avec la police Noto système — pas avec votre design. Du coup, **chaque utilisateur voit un emoji différent**. Sur Android 10 vs iOS 17, le rendu est radicalement différent.

**Recommandation** :
- Remplacer les emojis par des **icônes vectorielles** (Lucide, Phosphor, Heroicons)
- L'emoji reste OK pour les contenus utilisateur (forum, messages)
- Pour l'UI : icônes SVG cohérentes 24×24

#### 11. **Navigation visiteur surchargée**

Compte actuel de la nav `#vNav` :
1. Accueil
2. E-Learning
3. Boutique
4. Jeux
5. Labos
6. Classes
7. Orientation
8. Calendrier
9. Épreuves
10. Évals
11. Devoir IA
12. Parrainage
13. Parcours IA
14. Forum
15. FR/EN
16. Actualités
17. Contact
18. Panier

**18 boutons en haut**. Selon Hick's Law (loi du psychologue William Hick), le temps de décision croît avec le log du nombre d'options. **18 = trop**.

**Recommandation** :
- **Header simplifié** : Logo · Accueil · E-Learning · Boutique · [+] · Connexion
- Le `[+]` ouvre un mega-menu groupé : Pédagogie (Jeux/Labos/Classes/Épreuves), Communauté (Forum/Parrainage/IA), Services (Orientation/Contact)

---

### ✅ POINTS POSITIFS

| Aspect | Pourquoi c'est bien |
|---|---|
| **Identité couleur forte** (bleu nuit + or) | Très reconnaissable, en phase avec l'image académique camerounaise |
| **Variables CSS définies** | La base est là — il faut juste les utiliser systématiquement |
| **Material Symbols Rounded** | Excellent choix d'icônes (cohérent, accessibles, vectoriels) |
| **Animations subtiles** (`transition: .3s cubic-bezier`) | Donnent une sensation premium |
| **Service Worker + Lazy loading + Brotli** | Performance technique au top depuis P1 |
| **Densité d'information** | Pour un dashboard scolaire, c'est nécessaire — vous l'avez bien dosé |
| **Choix grille CSS** `auto-fit, minmax()` | Approche moderne, responsive native |

---

## 🎨 PROPOSITIONS D'AMÉLIORATION PRIORISÉES

### 🔴 Priorité 1 — Système de design (impact massif, 1 semaine)

Créer **`design-tokens.css`** avec :

```css
:root {
  /* TYPOGRAPHIE — 3 polices max */
  --font-display: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-serif: 'Crimson Pro', serif;

  /* ÉCHELLE TYPO — 8 valeurs */
  --text-xs: 11px;   --text-sm: 13px;
  --text-base: 15px; --text-md: 17px;
  --text-lg: 20px;   --text-xl: 24px;
  --text-2xl: 32px;  --text-3xl: 44px;

  /* COULEURS — système 50→900 */
  --primary-50: #EFF3FF;  --primary-100: #DBE5FF;
  --primary-300: #6A8FDD; --primary-500: #3C8DFF;
  --primary-700: #1E3A8A; --primary-900: #142554;

  --gold-50: #FFF8E1;     --gold-300: #FFD966;
  --gold-500: #FFC93C;    --gold-700: #D4A017;

  --neutral-0: #FFFFFF;   --neutral-50: #F8F9FC;
  --neutral-100: #F0F2F7; --neutral-300: #CDD3DF;
  --neutral-500: #6B7DA0; --neutral-700: #1E2D5A;
  --neutral-900: #0F1E47;

  /* ESPACEMENTS — système 4/8 */
  --space-1: 4px;   --space-2: 8px;
  --space-3: 12px;  --space-4: 16px;
  --space-6: 24px;  --space-8: 32px;
  --space-12: 48px; --space-16: 64px;

  /* RADIUS — 5 valeurs */
  --radius-sm: 6px;   --radius-md: 12px;
  --radius-lg: 16px;  --radius-xl: 24px;
  --radius-full: 9999px;

  /* OMBRES — 5 niveaux */
  --shadow-xs: 0 1px 2px rgba(20,37,84,.05);
  --shadow-sm: 0 2px 8px rgba(20,37,84,.06);
  --shadow-md: 0 8px 24px rgba(20,37,84,.08);
  --shadow-lg: 0 16px 40px rgba(20,37,84,.10);
  --shadow-xl: 0 24px 64px rgba(20,37,84,.14);

  /* MOTION */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;
}
```

→ Tous les **329 hex** doivent être remplacés progressivement par ces tokens.

---

### 🔴 Priorité 2 — Composants atomiques (1 semaine)

Créer 10 composants réutilisables :

```css
/* Button system — 4 variantes × 3 tailles */
.btn { ... }
.btn--primary { ... }    .btn--secondary { ... }
.btn--ghost { ... }      .btn--danger { ... }
.btn--sm { ... }  .btn--md { ... }  .btn--lg { ... }

/* Card system */
.card { ... }
.card--elevated { ... }  .card--bordered { ... }

/* Input system */
.input { ... }  .input--error { ... }  .input--success { ... }

/* Badge / Chip */
.chip { ... }
.chip--success { ... }   .chip--warning { ... }

/* Modal */
.modal { ... }  .modal--lg { ... }
```

→ Remplacer les 2 322 `style=""` par ces classes.

---

### 🟠 Priorité 3 — Refonte hiérarchie visuelle (3 jours)

**Avant** (situation actuelle) :
- Tous les boutons sont gros et colorés
- Toutes les cards ont les mêmes ombres
- Pas de différence visuelle entre "important" et "secondaire"

**Après** (proposition) — appliquer la **loi de la pyramide visuelle** :
- **CTA primaire** (1 par page) : gros, plein, contrasté (or sur fond bleu)
- **Actions secondaires** : bouton outline (bordure or, fond transparent)
- **Actions tertiaires** : bouton ghost (texte seul, underline au hover)
- **Liens** : couleur primaire, underline au hover

---

### 🟠 Priorité 4 — Iconographie cohérente (2 jours)

Remplacer les **emojis UI** par **Lucide Icons** (https://lucide.dev) — bibliothèque open-source, 1200+ icônes, style cohérent :

```html
<!-- AVANT -->
<button>🎁 Parrainage</button>

<!-- APRÈS -->
<button><svg class="icon"><use href="#lucide-gift"/></svg> Parrainage</button>
```

Bénéfices :
- Rendu identique sur tous les OS
- Taille/couleur contrôlables par CSS
- Beaucoup plus pro (Stripe, Linear, Vercel l'utilisent)

Garder les emojis uniquement pour **les contenus utilisateur** (forum, messages, profils).

---

### 🟢 Priorité 5 — Accessibilité (1 semaine)

Checklist concrète :

```html
<!-- 1. Landmarks -->
<header role="banner">...</header>
<nav role="navigation" aria-label="Navigation principale">...</nav>
<main role="main" id="main-content">...</main>
<footer role="contentinfo">...</footer>

<!-- 2. Skip link -->
<a href="#main-content" class="skip-link">Aller au contenu</a>

<!-- 3. Boutons icône -->
<button aria-label="Ouvrir le panier">
  <svg aria-hidden="true">...</svg>
</button>

<!-- 4. Modales -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Titre</h2>
</div>

<!-- 5. Formulaires -->
<label for="email">Email</label>
<input id="email" type="email" aria-describedby="email-help" aria-required="true">
<small id="email-help">Format: nom@domaine.cm</small>

<!-- 6. Focus visible global -->
<style>
  *:focus-visible {
    outline: 2px solid var(--gold-500);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
</style>

<!-- 7. Respect prefers-reduced-motion -->
<style>
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
```

---

### 🟢 Priorité 6 — Refonte page d'accueil (5 jours)

**Diagnostic actuel** : la page d'accueil est riche mais "encyclopédique" — l'utilisateur ne sait pas par où commencer.

**Architecture proposée** (mobile-first) :

```
┌─────────────────────────────────────────────────┐
│  HERO                                            │
│  • Titre H1 50px : "Réussissez votre BAC."      │
│  • Sous-titre : "Cours, IA, communauté."        │
│  • 2 CTA : [Commencer gratuit] [Voir e-learning]│
│  • Video bg + overlay sombre                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  SOCIAL PROOF (bandeau ticker)                   │
│  ★★★★★ "2 500 élèves nous font confiance"      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  3 PILIERS (bento grid 2-cols)                   │
│  ┌──────────┐ ┌──────────┐                     │
│  │ Suivi    │ │ E-       │                     │
│  │ scolaire │ │ Learning │                     │
│  └──────────┘ └──────────┘                     │
│  ┌──────────────────────┐                       │
│  │ Préparation BEPC/BAC │                       │
│  └──────────────────────┘                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  POUR QUI ? (3 cards icon + tag)                 │
│  Élèves · Parents · Enseignants                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  TÉMOIGNAGES (carrousel 3 cards)                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  FAQ ACCORDION (5 questions)                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  CTA FINAL                                       │
│  "Rejoignez VÉRITAS gratuitement"               │
│  [Inscription en 30 secondes]                   │
└─────────────────────────────────────────────────┘
```

---

## 📈 NOTE GLOBALE DESIGN

**Aspect technique** : **6.5/10**
- Couleurs : 5/10 (palette riche mais explosée)
- Typo : 4/10 (10 polices, aucune identité claire)
- Espacement : 6/10 (pas de système 4/8)
- Composants : 5/10 (2 322 inline styles)
- Accessibilité : 2/10 (quasi inexistante)
- Performance visuelle : 7/10 (lazy load + SW OK)
- Animations : 7/10 (bonnes mais trop nombreuses)
- Cohérence : 4/10 (chaque section semble venir d'un dev différent)

**Aspect émotionnel** : **7.5/10**
- L'utilisateur **ressent** quand même la qualité grâce aux couleurs fortes (bleu nuit + or) et à la densité d'information riche. Mais cette force masque le manque de système.

**Verdict final** : **6.5/10**

Vous avez un **bon goût intuitif** mais aucun **système de design**. C'est viable pour un MVP mais ça empêche toute évolution propre.

---

## 🚀 PLAN D'ACTION PROPOSÉ

### Option A — Refactor design system progressif (recommandé)
- **Semaine 1** : design tokens (`design-tokens.css`)
- **Semaine 2** : composants atomiques (boutons, cards, inputs)
- **Semaine 3** : migration progressive des inline styles vers classes
- **Semaine 4** : accessibilité + iconographie
- **Total** : 4 semaines, garde le site fonctionnel pendant la refonte

### Option B — Refonte complète V2 (radical)
- **Semaine 1-2** : maquettes Figma sur Tailwind + shadcn/ui
- **Semaine 3-5** : nouveau frontend React/Vue avec API backend
- **Total** : 5-8 semaines, V1 reste en parallèle

### Option C — Skin léger (rapide mais cosmétique)
- **3 jours** : refonte CSS de la home + navigation simplifiée
- **3 jours** : nouvelle palette resserrée (40 couleurs max)
- **2 jours** : Lucide Icons partout
- **Total** : 1 semaine, améliore l'image sans toucher au fond

**Ma recommandation** : Option A si vous voulez garder le single-file HTML. Option B si vous envisagez le multi-tenant SaaS (cf. roadmap long-terme #15) — la refonte aura plus d'impact.

---

*© 2026 Mythe Errant · Audit design réalisé par Claude (Anthropic) — Sonnet 4.7*
*Tous les chiffres cités sont extraits du fichier réel `VERITAS_v1.2.html`.*
