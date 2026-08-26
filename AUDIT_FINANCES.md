# AUDIT — Chaîne finances → abonnements → déverrouillage

**Périmètre** : Atelier de Français (`plateforme/`) et son backend PHP (`api/`).
**Date** : 25 août 2026 · **Branche** : `atelier-francais`
**Méthode** : lecture du code serveur réel + mesures au banc navigateur (`atelier-banc`, port 3200).

---

## Où vit le projet (étape 0 — résolue)

Rien ne manquait. Tout est dans ce dépôt :

| Élément | Emplacement | État |
|---|---|---|
| Front | `plateforme/index.html` (6 288 lignes) | présent |
| 6 modules | `plateforme/{support,minesec,conformite,exercices,texte,docx}.js` | présents, tous en 200 |
| Backend | `api/plateforme.php`, `api/payment_camerpay.php`, `api/payment_config.php` | présents |
| Logique d'octroi | `api/_auth_lib.php` (partagée par les 4 passerelles) | présente |
| Base | `data/veritas_db.json` (fichier plat, pas MySQL) | présente |
| Déploiement | `.github/workflows/deploy.yml` → FTP LWS, **sans pré-production** | actif |

**React n'est pas absent** : `plateforme/support.js:1142` le charge depuis
`unpkg.com/react@18.3.1` au runtime, avec intégrité SRI. Voir constat M-3.

---

## Verdict d'ensemble

Le backend est **nettement meilleur que ce que le front laissait craindre**. Le contrôle
de prix, l'octroi idempotent, la signature HMAC du webhook, le compteur de quotas
sous verrou : tout cela existe et est bien écrit.

Le problème n'est pas l'absence de garde-fous. **C'est que le front de l'Atelier ne parle
pas le même langage que le backend** : mauvais noms de champs, jeton absent, identifiants
de plans inconnus du catalogue. Les protections sont en place et l'Atelier passe à côté.

| # | Point soulevé | Verdict | Sévérité | État |
|---|---|---|---|---|
| — | **BLOQUANT découvert** : le paiement ne peut pas aboutir | — | **Critique** | OK **corrigé** |
| 1 | `_confirmPayLocal` fonction morte | **Confirmé** (nuance sur l'accessibilité) | Majeur | OK **corrigé** |
| 2 | Quotas de confiance client | **Confirmé — pire que décrit** | **Critique** | OK **corrigé** |
| 3 | Prix falsifiable | **Confirmé** (par un chemin inattendu) | **Critique** | OK **corrigé** |
| 4 | `action=status` non cloisonné | Confirmé, mais **risque déjà traité** | Mineur | OK référence allongée |
| 5 | Contenu payant présent puis masqué | **Infirmé** — le serveur fait ce qu'il faut | — | rien à faire |
| 6 | Essai revérifié côté serveur | **Confirmé bon** sur le corpus, absent ailleurs | Majeur | OK couvert par le point 2 |
| 7 | Tarifs dupliqués | Partiellement infirmé, **cause racine ailleurs** | Majeur | en attente |
| 8 | Pas d'expiration serveur | **Confirmé** | Majeur | en attente |

> Tout ce qui est marqué **corrigé** l’a été **et éprouvé au banc** — voir
> « Correctifs appliqués » en fin de document. **Rien n’est déployé.**

---

## C-0 — BLOQUANT non listé : l'abonnement de l'Atelier ne peut pas être payé

**Sévérité : Critique.** Découvert en comparant `_payerCamerpay` au contrat serveur.

`plateforme/index.html:4319` envoie ceci à `payment_camerpay.php?action=init` :

```js
body: JSON.stringify({intent:'subscription', targetId:plan.id, reference:ref,
    montant:…, devise:'XAF', tel:tel, nom:…, description:…})
// aucun en-tête Authorization
```

Le serveur (`api/payment_camerpay.php:327-345`) lit d'autres noms :

| Envoyé par l'Atelier | Attendu par le serveur | Conséquence |
|---|---|---|
| `reference` | `ref` (ligne 333) | `$ref` vide → **HTTP 400 « montant et ref requis »** |
| `tel` | `clientTel` | téléphone perdu |
| `nom` | `clientNom` | nom perdu |
| `description` | `label` | libellé perdu |
| *(rien)* | `accountId` | **l'abonnement ne serait rattaché à aucun compte** |
| *(aucun en-tête)* | `Authorization: Bearer` (ligne 328, `camerpayInitGuard`) | **HTTP 401** |

Deux murs successifs : 401 d'abord, 400 ensuite. Le paiement s'arrête net et l'utilisateur
lit « L'encaissement n'a pas pu être initié » sans savoir pourquoi.

Le contrat correct est déjà écrit ailleurs — `app.js:31422` le respecte scrupuleusement,
jeton public compris (obtenu via `?action=config` → `publicInitToken`).

**Aggravant** : `_sondeCamerpay` (`index.html:4308`) lit `j.message`, or le serveur renvoie
`reason` (`payment_camerpay.php:317`). Le diagnostic que le serveur prend soin de formuler
n'est donc jamais affiché.

**Correctif** : aligner `_payerCamerpay` sur `app.js:31422` — renommer les quatre champs,
transmettre `accountId`, lire et envoyer `publicInitToken`, et lire `reason`.

---

## 1 — `_confirmPayLocal` : fonction morte

**Verdict : confirmé.** **Sévérité : Majeur** (et non Critique — voir la nuance).

`plateforme/index.html:5595`. Recherche sur tout le dépôt (`*.js`, `*.html`, `*.php`,
`*.cjs`, `*.json`) : **une seule occurrence, sa propre définition**. Aucun
`{{ _confirmPayLocal }}` dans les gabarits, aucun autre fichier ne la nomme. Le bouton
« Payer » est bien câblé sur `confirmPay` → `_payerCamerpay`.

**Nuance sur l'accessibilité.** Elle n'est pas exposée sur `window` : c'est une propriété
d'un objet de props recréé à chaque rendu, dans une fermeture. On y accède seulement par
la fiber React du nœud DOM. Plus important : elle **n'accorde aucun pouvoir supplémentaire**,
puisque `team.plan` et `quota.limit` vivent de toute façon dans `localStorage`, éditables
directement (voir point 2). Elle ne crée pas la faille, elle la reflète.

Le vrai danger est ailleurs : c'est un **piège pour la prochaine personne** qui touchera cet
écran. La fonction est nommée comme une jumelle légitime de `confirmPay`, et un
`onClick="{{ _confirmPayLocal }}"` posé par inadvertance donnerait un bouton
« je me déclare payé » indétectable en relecture.

**Correctif** : suppression pure. Elle ne sert pas au mode démo — aucun mode démo ne la
référence.

---

## 2 — Quotas : le serveur ne compte jamais rien

**Verdict : confirmé, et la réalité est pire que l'hypothèse.** **Sévérité : Critique.**

L'hypothèse était « le serveur fait peut-être confiance au client ». La réalité :
**le serveur n'est jamais consulté**.

`api/plateforme.php:744` implémente `action=quota` de façon exemplaire — clé
`accountId|genre`, remise à zéro mensuelle, plafond déduit du droit serveur, refus 402
sans consommer, le tout sous verrou (`plat_muter`).

**Cet endpoint n'a aucun appelant.** Inventaire exhaustif des appels du front :

```
plateforme.php?action=config      ✓
plateforme.php?action=session     ✓
plateforme.php?action=corpus      ✓  (index et mode=complet)
plateforme.php?action=quota       ✗  JAMAIS APPELÉ
plateforme.php?action=etat        ✗  JAMAIS APPELÉ
```

Ce qui compte réellement les droits consommés :

| Action | Décompte | Verrou serveur |
|---|---|---|
| Créer une épreuve | `index.html:5741`, state local | **aucun** |
| Exporter en .docx | *(rien du tout)* | **aucun** — `docx.js` génère dans le navigateur |
| Ouvrir un texte MINESEC | — | ✅ `plateforme.php:496`, 402 si non-ayant droit |
| Analyse IA | `index.html:3677`, state local | ✅ partiel — `ia_proxy.php` borne par compte et par jour |

Un utilisateur qui écrit `used:0, limit:9999` dans `minesec_v3` obtient donc épreuves et
exports illimités. Le corpus, lui, résiste — c'est la seule chose réellement vendue qui
tienne.

**Correctif** : appeler `action=quota` **avant** chaque génération d'épreuve et chaque
export, et n'exécuter l'action que sur `ok:true`. Le compteur local devient un simple
affichage alimenté par la réponse serveur (`utilise`/`plafond`), jamais la source de vérité.

---

## 3 — Prix recalculé côté serveur : le contrôle existe, mais il est aveugle pour l'Atelier

**Verdict : confirmé.** **Sévérité : Critique.** Le chemin d'exploitation n'est pas celui
qui était supposé.

Le serveur **ne recalcule pas** le montant : il prend celui du client
(`payment_camerpay.php:332`, `intval($input['montant'])`). Mais ce n'est pas la faille,
car le contrôle est fait **plus tard, à l'octroi** — endroit judicieux, puisque les quatre
passerelles y convergent :

`api/_auth_lib.php:710` → `vrt_verifier_prix()` → `vrt_prix_catalogue()` compare le montant
encaissé au tarif du catalogue serveur, avec un plancher tolérant les remises
(`vrt_prix_plancher`, plafonné à 50 %). Sous-paiement → octroi refusé et journalisé.

**La faille est dans un angle mort documenté du mécanisme lui-même** :

```php
// _auth_lib.php:634
if ($attendu === null) return ['ok' => true, …, 'motif' => 'tarif indéterminable'];
```

Tarif inconnu ⇒ **on accepte n'importe quel montant**. Or pour `intent:'subscription'`,
le tarif est cherché dans `$db['elearning']['plans']` par `targetId`. Et les identifiants
ne se rencontrent jamais :

| Source | Identifiants |
|---|---|
| `index.html:2967` (envoyés) | `essai`, `ens`, `etab`, `pro` |
| `data/veritas_db.json` (catalogue) | `plan1` … `plan15` |

**Aucune correspondance.** `vrt_prix_catalogue` renvoie `null`, le contrôle s'abstient, et
**payer 100 FCFA octroie l'abonnement Bassin à 70 000 FCFA**.

Le mécanisme fonctionne pourtant côté droits : `plat_plans_atelier()`
(`api/plateforme.php:202`) attend exactement `['ens','etab','pro']`, et
`vrt_grant_entitlement` pousse `targetId` dans `acc.plans`. Le droit s'ouvre — seul le
prix n'est pas vérifié.

Le commentaire de `_auth_lib.php:424` avait anticipé ce scénario mot pour mot, à propos
des frais d'inscription : *« sans cette entrée … n'importe qui s'inscrirait en payant
1 franc »*. Les trois plans de l'Atelier n'ont simplement jamais reçu la leur.

**Correctif** — dans `vrt_prix_catalogue`, avant le repli générique :

```php
// Tarifs de l'Atelier de Français. Ses plans (ens/etab/pro) ne sont PAS dans
// elearning.plans : sans cette entrée, le tarif est « indéterminable » et
// vrt_verifier_prix accepte n'importe quel montant — 100 F pour un plan à 70 000.
if ($intent === 'subscription' && isset(['ens'=>1,'etab'=>1,'pro'=>1][$targetId])) {
    $def = ['ens' => 5000, 'etab' => 30000, 'pro' => 70000];
    $v = (int) ($db['plateforme']['tarifs'][$targetId] ?? 0);
    return $v > 0 ? $v : $def[$targetId];
}
```

Réglable en base pour que l'administration change un prix sans redéploiement, avec un
défaut sûr — même motif que les frais d'inscription.

**À vérifier au passage** : `vrt_abo_duree_ms($plan['duree'] ?? '')` reçoit `null`, aucun
plan ne correspondant. La durée par défaut décide donc de l'échéance d'un abonnement
annuel. À confirmer avant de facturer.

---

## 4 — `action=status` : non authentifié, mais délibérément et proprement

**Verdict : confirmé sur le fait, mais le risque a déjà été traité.** **Sévérité : Mineur.**

`payment_camerpay.php:625` n'exige aucun jeton, et c'est assumé : le payeur revient de
CamerPay sans session. La référence (`Date.now().toString(36)`) n'a effectivement pas
l'entropie d'un secret.

Mais quelqu'un y a déjà pensé (commentaire lignes 651-655) : `targetId` et `accountId`
**ont été retirés de la réponse** précisément parce qu'une référence est énumérable et
que ces champs désignent un élève et un compte. Reste exposé : statut, horodatage,
opérateur, `intent`, `pay_url`, motif d'échec. Aucune donnée nominative.

Une amplification par sondage est également bornée (re-vérification limitée à une fois
toutes les 4 secondes **par référence**, pas par IP).

**Ce qui reste** : un tiers qui devine une référence apprend qu'une transaction existe,
son montant implicite et son `pay_url`. Fuite d'existence, pas de fuite de données.

**Correctif proposé (optionnel)** : allonger la référence côté client
(`Date.now().toString(36)` + 6 caractères aléatoires via `crypto.getRandomValues`). Peu
coûteux, et ferme l'énumération sans toucher au parcours de paiement.

---

## 5 — Déverrouillage des ressources : le serveur fait exactement ce qu'il faut

**Verdict : infirmé.** Le contenu payant **n'est pas** envoyé puis masqué.

`api/plateforme.php:496-575`, vérifié ligne à ligne :

- `mode=index` — ne renvoie que des métadonnées et `extrait` **tronqué à 180 caractères**
  (`mb_substr($t['text'], 0, 180)`), 70 pour les citations. Le texte intégral, les
  questions et les faits de langue n'y sont pas. Le champ `faits` est explicitement vidé
  pour un texte verrouillé.
- `mode=complet` — le seul chemin vers le contenu entier. Si le texte n'est pas offert,
  le serveur répond **402 sans le texte**, avec le motif.
- Le répertoire libre de droits (1 014 textes) est servi entier, sans condition : c'est
  du domaine public, il n'y a personne à payer.

`_libre` et `corpusDroit` sont donc des indicateurs d'affichage adossés à un vrai verrou
serveur. Rien à corriger.

---

## 6 — Essai gratuit : solide sur le corpus, inexistant ailleurs

**Verdict : confirmé bon là où il s'applique.** **Sévérité : Majeur** pour les trous.

`plat_droit()` (`api/plateforme.php:279`) est bien réévalué **à chaque requête** de corpus
et de quota. Le point de départ de l'essai est horodaté **côté serveur** dans un registre
dédié, avec cette précision explicite : compter depuis le navigateur laisserait relancer
l'essai en vidant son stockage local. Vider `localStorage` ne rouvre donc rien.

**Le trou n'est pas dans l'essai, il est dans son périmètre.** Comme `action=quota` n'est
jamais appelé (point 2), un essai expiré continue de permettre la création d'épreuves et
les exports .docx. Seul l'accès au corpus se referme.

**Correctif** : couvert par celui du point 2.

---

## 7 — Cohérence des tarifs

**Verdict : partiellement infirmé.** **Sévérité : Majeur**, mais pas pour la raison
supposée.

`admTarifs` n'est **pas** une copie : `index.html:5224` le dérive de `this.plans`
(`this.plans.map(...)`). Les deux tableaux ne peuvent pas diverger.

La vraie divergence est plus grave, et c'est celle du point 3 : `this.plans` (client) et
`elearning.plans` (base) sont **deux mondes sans point de contact**. Un administrateur qui
change un prix dans l'espace d'administration VÉRITAS ne change rien pour l'Atelier, dont
les prix sont figés dans `index.html:2967`.

`api/payment_config.php` ne contient **aucun tarif** — uniquement les identifiants du
fournisseur. Ce n'est donc pas la source à interroger.

**Correctif** : servir les trois tarifs par `plateforme.php?action=config` (lus dans
`DB.plateforme.tarifs`, mêmes valeurs par défaut que le correctif du point 3), et faire
lire `this.plans` depuis cette réponse. Une seule source, celle qui décide déjà de
l'octroi.

---

## 8 — Réconciliation : aucune expiration côté serveur

**Verdict : confirmé.** **Sévérité : Majeur** — et l'enjeu n'est pas le ménage.

Le client abandonne une référence après 24 h (`_ajouterAttente` / `_reconcilierPaiements`,
`index.html:3636`). Côté serveur :

- Aucune tâche planifiée (`grep cron` sur `payment_camerpay.php` : rien).
- Aucun statut « expiré » ou « abandonné » n'est jamais posé.
- `action=list` (ligne 689) réconcilie les `pending`, mais **saute** ceux de plus de 24 h :
  `if ($age > 86400 || $age < 60) continue;`

Une transaction `pending` de plus de 24 h n'est donc **plus jamais** examinée, et son
fichier reste indéfiniment dans `api/data/payments/`.

**La conséquence n'est pas cosmétique.** Le scénario suivant prend l'argent sans rien
donner : le webhook se perd (CamerPay ne le rejoue pas — c'est écrit ligne 682), le client
ferme son onglet, personne n'ouvre le tableau de bord dans les 24 h. Le paiement a
abouti chez CamerPay, l'Atelier n'en saura jamais rien, et le client a payé pour rien.

C'est exactement le symptôme que `_auth_lib.php` décrit ailleurs : *« argent pris, rien
remis, et le client n'apprenait rien »*.

**Correctif** : à l'ouverture du tableau de bord, traiter les `pending` de plus de 24 h
au lieu de les sauter — une dernière vérification auprès de CamerPay, puis octroi si payé,
sinon marquage `expired` (et purge à 30 jours). Le seuil de 24 h doit **déclencher** un
traitement, pas l'interrompre.

---

## Affichage mobile — audit et correctifs appliqués

Mesuré au banc, viewport 375×812 puis 360 px (l'Android le plus courant).

### Ce qui va bien

- **Aucun débordement horizontal**, à 360 comme à 375 px : `scrollWidth == clientWidth`.
- Les grilles sont en `auto-fit/minmax` et se replient correctement.
- La barre de navigation du bas fait **47 px** de haut — conforme.
- `preconnect` Google Fonts et `display=swap` **existent déjà** (`index.html:16-18`) :
  ce point de l'audit initial est infirmé.

### M-1 — Le relèvement des polices mobiles était mort *(corrigé)*

Un bloc CSS existait pour relever les tailles écrites en ligne. **Il ne relevait rien**, et
le symptôme était l'absence de symptôme : la page s'affichait, simplement en petit.

Il visait `[style*="font-size:11px"]`, sans espace, comme dans le gabarit. Mais React
réécrit l'attribut au montage et le resérialise **avec** une espace : `font-size: 11px`.

Mesure décisive, à 375 px sur l'écran Corpus :

| Sélecteur | Éléments atteints |
|---|---|
| `main [style*="font-size:11px"]` (ancien) | **0** |
| `main [style*="font-size: 11px"]` | **150** |
| toutes tailles confondues, forme avec espace | **762** |

**Corrigé** : les deux formes sont désormais visées (sans espace = gabarit avant montage,
avec espace = DOM après React), la couverture descend à 9,5 px, et la barre de navigation
comme le pied de page — tous deux hors de `<main>` — sont inclus.

Le nouveau bloc est en `@media **screen** and (max-width:820px)`, et ce mot n'est pas
décoratif : une page A4 mesure ~794 px à 96 dpi. Sans lui, réparer ces règles aurait
grossi le texte des épreuves imprimées et fait déborder la mise en page — on aurait
corrigé l'écran en cassant le tirage.

**Résultat mesuré** (écran Corpus, 375 px) :

| | Avant | Après |
|---|---|---|
| Textes sous 12 px | **456** | **5** |
| Plus petite taille | 9,5 px | 11,5 px (libellés de la nav) |
| Pied de page | 11,5 px | 13 px |
| Débordements | 0 | **0** |

### M-2 — L'alternance des lignes était invisible *(corrigé)*

Le zébrage **existait** : une fiche sur deux reçoit `--cfbfcfe`. Mais en thème clair il
valait `#fbfcfe` contre `#ffffff` — environ **1 % d'écart de luminance**, c'est-à-dire rien
à l'œil. La liste du corpus, qui empile 150 fiches, se lisait comme un bloc continu.

**Corrigé** : `#eaf1fa` en thème clair, `#1e2938` en thème sombre (contre `#161f2b` pour les
cartes) — vérifié dans les deux thèmes.

La variable elle-même n'a **pas** été touchée : elle sert aussi de fond à des panneaux
entiers qu'un ton plus marqué salirait. Seuls les éléments qui portent ce fond dans une
liste sont visés. La règle est hors requête de média : la lecture du corpus est longue sur
grand écran aussi.

### M-3 — React est chargé depuis unpkg.com *(non corrigé — décision requise)*

**Sévérité : Majeur.** `support.js:1142-1147` charge React, React-DOM et Babel depuis
`unpkg.com` au runtime (avec SRI — l'intégrité est correcte).

Si unpkg est lent ou bloqué — connexion mobile camerounaise, réseau d'établissement,
filtrage — **l'application entière ne monte pas**. Et la dégradation est laide : je l'ai
observée par accident au banc, la page affiche le gabarit brut, avec les `{{ topIcPlus }}`
et `{{ c.label }}` en clair à l'écran.

Trois options, à trancher :

| Option | Coût | Effet |
|---|---|---|
| Héberger React en local (`assets/`) | ~140 Ko, une entrée CI | supprime la dépendance externe |
| Garder unpkg + écran de repli explicite | faible | l'utilisateur comprend au lieu de voir `{{ }}` |
| Statu quo | nul | panne totale et illisible si unpkg tombe |

Recommandation : la première. Le site sert déjà ses propres assets, et un `?v=` géré par
la CI existe déjà pour les six modules.

### M-4 — Cibles tactiles sous 44 px *(non corrigé — demande arbitrage)*

Sur l'écran d'accueil, **20 cibles sur 32 (63 %)** sont sous 44×44 px (référence WCAG 2.5.5
et Apple HIG ; Material recommande 48 dp) :

| Élément | Taille |
|---|---|
| bouton sans libellé | 34×24 px |
| flèches `‹` `›` du calendrier | 26 px de haut |
| liens « Voir › », « Détails › » | 28 px de haut |
| onglets « Explorer » | 29 px de haut |

La navigation principale est conforme ; ce sont les actions secondaires qui sont trop
petites. Corriger demande d'ajouter du rembourrage cible par cible, ce qui déplace la mise
en page — je préfère votre arbitrage avant d'y toucher.

### M-5 — Contraste du texte secondaire *(constat)*

`#9aa5b5` sur fond clair donne ≈ **2,1:1**, loin des 4,5:1 exigés par WCAG AA (3:1 pour du
grand texte). Cela concerne les métadonnées de fiches (« Module 1 — … », « · 109 mots · »).
Ce n'est **pas** une régression de mon changement — le ratio était de 2,2:1 sur blanc.
`#6b7a8d` corrigerait sans dénaturer la hiérarchie visuelle.

### M-6 — `<head>` incomplet *(corrigé)*

`lang="fr"`, `<title>`, `<meta name="description">`, 7 balises Open Graph, `twitter:card`
et favicon ajoutés. Le favicon pointe en **relatif** (`../assets/veritas-logo.png`) pour
fonctionner en production comme au banc ; `og:image` est en absolu car les réseaux sociaux
ne résolvent pas le relatif. Les deux fichiers ont été vérifiés comme réellement déployés
par la CI — `assets/` est copié en entier, `og-image.jpg` explicitement (`deploy.yml:286`).

Contrôlé après coup : titre présent, `lang=fr`, favicon en **200**, application toujours
montée.

---

## Points de l'audit initial qui s'avèrent infirmés

À la décharge du projet :

- **Cache-busting** — non seulement les `?v=` sont des empreintes de contenu, mais
  `deploy.yml:584-590` **bloque le déploiement** si le `?v=` ne correspond plus au sha1 du
  fichier, fins de ligne normalisées. Meilleur que ce qui était demandé.
- **Modules manquants** — `deploy.yml:569-574` interrompt le déploiement si l'un des sept
  fichiers manque, plutôt que de livrer une page amputée.
- **Secrets côté client** — aucune clé en dur. `ia_proxy.php` garde la clé IA côté serveur ;
  `publicInitToken` est public **par construction** (un navigateur doit le détenir pour
  initier un paiement) et n'ouvre aucune lecture : ni liste, ni relevé, ni versement.
- **Webhook** — signature HMAC-SHA256 vérifiée en **fail-closed** : secret absent = refus,
  au même titre qu'une signature fausse.
- **Corpus en clair** — `_corpus_source.js` (2,8 Mo) est **délibérément exclu** du
  déploiement : le déployer rendrait la marchandise téléchargeable.

---

## Correctifs appliqués (26/08) — et comment ils ont été prouvés

Aucun n'a été déclaré bon sur simple lecture : chacun a d'abord été mis en échec.

### C-0 · Contrat de paiement — `plateforme/index.html:4463`

`_payerCamerpay` envoie désormais le contrat réel du serveur : `ref` (et non
`reference`), `clientTel`, `clientNom`, `label`, `accountId`, plus l'en-tête
`Authorization: Bearer` dont la valeur vient de `?action=config`
(`publicInitToken`, lu par `_sondeCamerpay` — `index.html:4421`). Un 401 déclenche
une re-sonde et **un seul** rejeu, pour absorber une rotation du jeton sans
cul-de-sac. `_sondeCamerpay` lit aussi `reason` au lieu de `message` : le
diagnostic que le serveur prend soin de formuler atteint enfin l'écran.

**Preuve.** `tests/banc_atelier.cjs` reproduit maintenant le contrat serveur, refus
compris — un banc qui accepterait n'importe quel corps ne prouverait rien. Les trois
cas, au curl :

| Requête | Réponse |
|---|---|
| ancien corps, sans Bearer | **401** « Authentification requise » |
| ancien corps (`reference`), avec Bearer | **400** « montant et ref requis » |
| nouveau corps (`ref`), avec Bearer | **201**, `pay_url` renvoyée |

Puis le parcours complet au navigateur — écran d'abonnement, plan Collège, numéro
saisi, clic sur « Payer 30 000 FCFA ». Corps effectivement reçu par le serveur :

```json
{"intent":"subscription","targetId":"etab","ref":"PLATMT9H9X0YASA5","montant":30000,
 "clientTel":"697637739","clientNom":"Jacques Takou","accountId":"acc_banc_001",
 "label":"Abonnement Collège — Corpus & Épreuves"}
```

Le banc passé en `success`, le front a activé le plan « Collège » avec son quota de
120. La chaîne tient de bout en bout.

`accountId` méritait son propre maillon : `_authSubmit` retient l'`id` du compte
renvoyé par `?action=session`, `_persist` l'enregistre, et l'état initial le relit —
sans quoi un simple rechargement de page l'aurait perdu, et l'abonnement suivant
aurait été encaissé sans être rattaché à personne.

### Point 3 · Tarifs de l'Atelier — `api/_auth_lib.php:510`

Entrée explicite dans `vrt_prix_catalogue` pour `ens` / `etab` / `pro`,
surchargeable par `DB.plateforme.tarifs`, avec 5 000 / 30 000 / 70 000 par défaut.

**Preuve, exécutée en PHP 8.2 :**

```
FRAUDE   : 100 F pour un plan a 5 000    attendu=5000   => REFUSE  (sous-paiement)
LEGITIME : 5 000 F                        attendu=5000   => ACCEPTE
FRAUDE   : 100 F pour un plan a 30 000   attendu=30000  => REFUSE  (sous-paiement)
FRAUDE   : 100 F pour un plan a 70 000   attendu=70000  => REFUSE  (sous-paiement)
```

Et la mutation qui donne sa valeur au test — un identifiant hors de la liste retombe
dans l'ancien comportement, ce qui montre que c'est bien cette entrée qui protège :

```
100 F pour 'ens_inconnu' => ACCEPTE (tarif indéterminable)
```

La surcharge en base a été vérifiée séparément : tarif porté à 7 500, un paiement de
5 000 est alors refusé.

### Point 2 · Quotas — `plateforme/index.html:3765`

Nouvelle méthode `_consommerQuota(genre, suite)` : seul chemin autorisé pour
consommer un droit. Elle appelle `plateforme.php?action=quota` et n'exécute `suite()`
que si le serveur a **effectivement** décrémenté. Le compteur local n'est plus qu'un
reflet (`_majQuotaLocal`), jamais une autorisation. Elle est branchée sur les deux
actions qui ne comptaient rien : la génération d'épreuve, et l'export Word — pour
lequel `_exporterWord` a été scindé, la fabrication passant dans `_fabriquerWord`
(`index.html:4300`), qui n'est plus atteignable sans accord du serveur.

**Fermé en cas de panne, délibérément.** Laisser passer quand le serveur ne répond
pas rendrait la protection contournable en coupant le réseau — un geste à la portée
de tout le monde. Le coût est nul en pratique : le corpus lui-même descend du
serveur, donc composer hors ligne n'était de toute façon pas possible.

**Preuve — les cinq chemins, au navigateur :**

| Situation | Résultat observé |
|---|---|
| sans jeton | « Reconnectez-vous pour continuer », reste sur `#composeur` |
| quota disponible | passe à `#apercu`, **et le serveur compte** (`{"epreuve":1}`) |
| export autorisé | document produit, **serveur** (`{"epreuve":1,"export":1}`) |
| quota épuisé (402) | « Quota d'exports épuisé (0 ce mois) », rien n'est produit |
| serveur muet | après 12 s : « Le serveur n'a pas répondu à temps », rien n'est produit |

Le dernier cas a révélé un manque au passage : l'appel n'avait aucun délai de garde.
Un serveur qui ne répond rien laissait la promesse en suspens pour toujours — bouton
sans effet, aucun message. Un `AbortController` à 12 s a été ajouté.

### Point 1 · `_confirmPayLocal` — supprimée

Zéro référence restante dans tout le dépôt. `tests/verif_liaisons_atelier.cjs` passe :
**623 liaisons du gabarit, toutes résolues**, aucun gestionnaire orphelin.

### Point 4 · Référence de paiement — `index.html:4338`

`_alea4()` ajoute quatre caractères tirés au sort (`crypto.getRandomValues`, repli
`Math.random`). La référence passe de `PLATMT9H7R6B` à `PLATMT9H9X0YASA5` : l'horloge
seule ne suffit plus à la deviner, ce qui ferme l'énumération sur `?action=status`,
non authentifié par conception.

### Bonus · Un stockage corrompu tuait l'application

Découvert en cours de test, et **préexistant** : `users:store?store.users:seedUsers`
(idem `team`, `epreuves`). Un `minesec_v3` partiel — écriture interrompue, quota de
stockage atteint, format antérieur — passait le test `store?` puis rendait
`undefined`, et le premier `.find()` tuait le rendu. L'écran devenait blanc, portant
« Cannot read properties of undefined », **sans aucun recours** : vider son stockage
n'est pas une manœuvre qu'on demande à un enseignant.

Reproduit, corrigé en `(store && store.users) || seedUsers`, puis re-vérifié :
l'application se relève et affiche l'accueil.

### Contrôles de non-régression

- `php -l` : `_auth_lib.php`, `plateforme.php`, `payment_camerpay.php` — propres.
- `node --check` : les 6 modules + le banc + le bloc logique extrait — propres.
- `verif_liaisons_atelier.cjs` : 623 liaisons, 650 clés, tout est relié.
- Mobile (375 px) après tous les changements : **0 débordement**, alternance active,
  5 textes sous 12 px (les libellés de la nav), `lang`/`title` en place.
- Console d'un onglet neuf : **aucune erreur**.


---

## Ce qui reste à faire

**Les quatre bloquants sont levés** (C-0, points 1, 2, 3), plus le point 4 et un
défaut de robustesse trouvé en chemin. Reste ceci :

| # | Sujet | Pourquoi ce n'est pas fait |
|---|---|---|
| 8 | Expiration serveur des paiements `pending` | Touche la réconciliation d'argent réel. `action=list` doit **traiter** les transactions de plus de 24 h au lieu de les sauter : dernière vérification chez CamerPay, octroi si payé, sinon `expired`. À faire avant d'ouvrir l'encaissement en volume. |
| 7 | Servir les tarifs depuis le serveur | Les prix restent écrits dans `index.html:2967`. Le contrôle serveur les connaît désormais (point 3), donc un écart ne coûte plus d'argent — mais il ferait afficher un prix et en encaisser un autre. À traiter avec le point 8. |
| M-3 | Dépendance unpkg pour React | Décision à prendre : héberger React dans `assets/` (~140 Ko, une entrée CI) ou garder le CDN avec un écran de repli. Aujourd'hui, si unpkg tombe, la page affiche `{{ c.label }}` en clair. |
| M-4 | Cibles tactiles sous 44 px | 63 % des cibles de l'accueil. Corriger déplace la mise en page : je préfère votre arbitrage. |
| M-5 | Contraste du texte secondaire | `#9aa5b5` donne 2,1:1 (AA en demande 4,5:1). `#6b7a8d` corrigerait sans dénaturer la hiérarchie. |

## État du dépôt

**Rien n'est déployé.** Fichiers modifiés :

| Fichier | Nature |
|---|---|
| `plateforme/index.html` | paiement, quotas, robustesse du stockage, polices, alternance, `<head>` |
| `api/_auth_lib.php` | tarifs de l'Atelier dans `vrt_prix_catalogue` |
| `tests/banc_atelier.cjs` | miroir du contrat CamerPay + `action=quota`, commutateurs `/__pay` et `/__quota` |
| `AUDIT_FINANCES.md` | ce rapport |

`tests/` n'est pas déployé ; `plateforme/**` et `api/**` le sont. Les empreintes `?v=`
des six modules sont inchangées — aucun module n'a été touché, donc le garde-fou CI
qui compare le sha1 au jeton du HTML passera.

**Avant de déployer**, deux choses à savoir :

1. Le déploiement se fait par `workflow_dispatch` sur `deploy/campay-securite`, jamais
   par un push sur `master`, et il part **directement en production** — il n'y a pas de
   pré-production.
2. `CAMERPAY_PUBLIC_INIT` doit être renseigné dans `api/payment_config.php` **sur le
   serveur** (ce fichier n'est jamais déployé par la CI, il se pose en FTP). Sans lui,
   `?action=config` renvoie `publicInitToken` vide et l'initiation répond 401 — le
   correctif C-0 serait alors sans effet visible. `?action=config` le dit explicitement
   dans son champ `reason`, que le front affiche désormais.
