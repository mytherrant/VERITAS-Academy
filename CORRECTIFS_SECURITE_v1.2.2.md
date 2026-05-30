# 🔐 Correctifs de sécurité v1.2.2 — Runbook de déploiement

> **Date** : mai 2026
> **Périmètre** : durcissement CORS, retrait du secret de sync du HTML public, invite admin, fusion des balises robots.
> **Important** : les correctifs de code sont faits et vérifiables. **4 actions serveur restent à votre charge** (fichiers gitignorés + rotation de secret + redéploiement). Tant qu'elles ne sont pas faites, le durcissement n'est que partiel.

---

## 1. Ce qui est déjà corrigé dans le code (versionné)

| Fichier | Correctif |
|---|---|
| `VERITAS_v1.2.html` | Secret de sync **retiré du HTML** (n'est plus lisible via `Ctrl+U`). Invite admin unique `_ensureCloudSecret()` / `_saveCloudSecret()`. Balises `robots`/`googlebot` dédupliquées (fin du conflit `noindex` vs `index,follow`). Shim d'accessibilité clavier (Entrée/Espace + focus) pour les `[onclick]`. |
| `api/config_sync.php` | CORS `*` → **allowlist** ; `API_SECRET` lu depuis `payment_config.php` (gitignoré) avec repli legacy. |
| `api/ia_proxy.php` | CORS : fin du reflet aveugle d'origine → allowlist. |
| `api/admin_validate.php` | CORS endpoint admin → allowlist. |
| `api/public_data.php` | CORS → allowlist. |
| `api/rag.php` | CORS : reflétait toute origine malgré son commentaire → corrigé. |
| `api/news_proxy.php`, `api/_bot_log.php` | CORS `*` → allowlist. |
| `api/payment_config.php.exemple` | CORS aligné + `API_SECRET` documenté + consigne de rotation. |

**Allowlist CORS** appliquée partout :
`https://veritas-school.com`, `https://www.veritas-school.com`, `http://localhost:8000` (dev), `https://localhost`, `capacitor://localhost`.
L'app mobile Capacitor étant servie depuis `veritas-school.com` (même origine), **elle n'est pas impactée**.

---

## 2. ⚠️ Actions serveur à faire (je ne peux pas : fichiers gitignorés / déploiement)

### Étape 1 — `api/config.php` (gitignoré, sur le serveur)
Supprimer la ligne CORS qui écrase le durcissement des autres endpoints :
```php
// SUPPRIMER cette ligne (un fichier de config ne doit pas émettre de CORS) :
header('Access-Control-Allow-Origin: *');
```

### Étape 2 — `api/payment_config.php` (gitignoré, sur le serveur)
a) Remplacer le bloc CORS `*` par l'allowlist (copier celui de `payment_config.php.exemple`).
b) Ajouter le secret de sync (nouvelle valeur, voir étape 3) :
```php
define('API_SECRET',     'COLLEZ_ICI_LE_NOUVEAU_SECRET');
define('PAY_API_SECRET', 'COLLEZ_ICI_LE_NOUVEAU_SECRET'); // peut être identique
```

### Étape 3 — Générer et roter le secret
L'ancien `VERITAS-CLOUD-2026-xK9m` a **fuité** (il était dans le HTML public) → à abandonner.
```bash
openssl rand -hex 24      # ex. 3f9a...e7  (48 caractères)
```
- Coller cette valeur dans `payment_config.php` (étape 2b).
- Une fois `API_SECRET` défini dans `payment_config.php`, **supprimer le repli legacy** dans `config_sync.php` :
  ```php
  // dans api/config_sync.php, retirer ce bloc une fois la rotation faite :
  if (!defined('API_SECRET')) { define('API_SECRET', 'VERITAS-CLOUD-2026-xK9m'); }
  ```

### Étape 4 — Mettre à jour les appareils admin
- **Nouveaux appareils / cache vidé** : à la connexion admin, l'invite « Clé de synchronisation Cloud » apparaît → coller le nouveau secret (une fois).
- **Appareils déjà utilisés** (ils ont encore l'ancien secret en cache → erreur 401) :
  VÉRITAS → **Paramètres → Cloud** → mettre à jour la clé avec la nouvelle valeur, puis tester la connexion.

---

## 2bis. 🔑 Mots de passe par défaut (action admin obligatoire)

Le `defaultDB()` embarque des mots de passe de démarrage **lisibles dans le source** (ex. `directeur` / `Veritas2024!`, super-admin `VERITAS_Super@2024!`, comptes enseignants de démo). Ils sont hachés (`S256$`) au premier login, mais **si vous ne les avez jamais changés, ils restent valides**.

- Connectez-vous, allez dans **Admin → Comptes & Accès**, et changez **au minimum** : le **Super Admin** et le compte **directeur**.
- Depuis v1.2.2, l'app **détecte ces défauts même après hachage** (corrigé : l'ancienne vérification comparait au clair et ne se déclenchait jamais) et affiche une **bannière rouge `role="alert"` + un toast** à l'admin connecté tant qu'un défaut est actif.
- Supprimez ou renommez les comptes de **démonstration** (enseignants `*2024!`, auteurs `Author2024!`) s'ils ne servent pas en production.

---

## 3. Vérification après déploiement

```bash
# (a) Le secret n'est plus dans le HTML servi
curl -s https://veritas-school.com/ | grep -c "VERITAS-CLOUD-2026-xK9m"   # → 0

# (b) CORS : une origine étrangère ne reçoit PAS d'en-tête Allow-Origin
curl -s -I -H "Origin: https://evil.example" https://veritas-school.com/api/public_data.php \
  | grep -i "access-control-allow-origin"   # → aucune ligne

# (c) CORS : l'origine légitime est autorisée
curl -s -I -H "Origin: https://veritas-school.com" https://veritas-school.com/api/public_data.php \
  | grep -i "access-control-allow-origin"   # → access-control-allow-origin: https://veritas-school.com

# (d) db.php sans token reste refusé
curl -s -o /dev/null -w "%{http_code}\n" https://veritas-school.com/api/db.php   # → 401

# (e) db.php avec l'ANCIEN secret doit désormais être refusé (rotation OK)
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "Authorization: Bearer VERITAS-CLOUD-2026-xK9m" https://veritas-school.com/api/db.php   # → 401
```

Côté navigateur : se connecter en admin → vérifier que le pastille de sync passe au vert (sync OK) après saisie de la nouvelle clé.

---

## 4. Rollback

- **Code** : `git revert` du commit de durcissement (ou restaurer les fichiers `api/*.php` et `VERITAS_v1.2.html` à la version précédente).
- **Secret** : si la sync casse, remettre l'ancien secret partout (`payment_config.php` + appareils admin) restaure le comportement — mais réexpose la fuite. Préférer corriger la cohérence des clés.

---

## 5. Limite assumée (non résolue par ces correctifs)

Le retrait du secret du HTML est une **mitigation proportionnée**, pas une auth serveur complète. Quiconque détient le secret (ancien admin, accès au dépôt) peut toujours appeler `db.php` et tirer toute la base. La correction de fond = **authentification de session serveur** (login admin → bcrypt → cookie httpOnly) avec **filtrage par rôle** dans `db.php` (un élève ne reçoit que ses données). À planifier comme chantier dédié.
