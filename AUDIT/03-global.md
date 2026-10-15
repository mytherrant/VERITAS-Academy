# 03 — Audit global du site

> Passe du 15/10/2026. Preuves : lecture du code (`origin/master` @ 4255317), bancs locaux, et **quelques requêtes GET en lecture seule vers la prod** (moins de 6 par minute, pour ne pas déclencher le bannissement automatique d'IP de LWS).
> Ce qui n'a **pas** été exécuté dans un navigateur est marqué ⚠️. La phase 6 le rejouera.

## 1. Fonctionnel
| Parcours | Verdict | Preuve / remarque |
|---|---|---|
| Inscription / connexion | ✅ (bancs) | `banc_identite_acheteur.php` 26/26 ; vérification bcrypt côté serveur (`_auth_lib.php:147-175`). |
| Mot de passe oublié | ⚠️ | Non exercé dans cette passe. |
| QCM (notation, chronomètre, sauvegarde) | ⚠️ | Non exercé (navigateur requis). |
| Lecture vidéo | ⚠️ | Non exercé. |
| Accès payant par URL directe | ✅ | `/uploads/protected/` → **403** en prod ; les cahiers et livres sont servis par `livret.php` / `secure_pdf.php` après contrôle du code ou du droit. `banc_livre_integre.php` 24/24, `paiements_entitlements.php` 95/95. |
| Achat « livre sans compte » | ✅ (banc) | `banc_octroi_bloque.php` 26/26 (compte créé ou retrouvé par numéro). |
| Page des corrigés philo 1ʳᵉ / Tˡᵉ | ⚠️ | Non exercé. |

## 2. Sécurité (OWASP Top 10)
| Risque | Verdict | Détail |
|---|---|---|
| A01 Contrôle d'accès | ⚠️ | Le contrôle d'accès des endpoints sensibles est correct (admin = Bearer `PAY_API_SECRET` / clé de synchro, comparaison `hash_equals`). Faiblesse : la page `?action=payer` est publique (voir 02 § 5). |
| A02 Cryptographie | ⚠️ | Mots de passe : **bcrypt au repos**, mais les comptes anciens restent en `S256` (SHA-256 avec l'identifiant pour sel), migrés seulement à la connexion suivante (`_auth_lib.php:140-195`). Un banc de migration non suivi par git traîne dans votre dossier (`tests/banc_migration_bcrypt.php`). |
| A03 Injection SQL | ✅ | Seules concaténations trouvées : `$tid` **casté en `(int)`** (`campus/_routes_pedago.php:361`, `campus/index.php:231`) et un nom de table venu d'une liste fixe (`db_sql.php:83`). Pas d'`eval`, `shell_exec`, `system` ni `unserialize`. |
| A03 XSS | ⚠️ | Page de paiement : `htmlspecialchars` + `json_encode(JSON_HEX_*)` ✅. Le `label` d'un paiement vient du client et s'affiche dans l'admin : il faut vérifier que l'écran admin l'échappe avec `_esc()`. |
| CSRF | ✅ | Les API d'écriture exigent un Bearer, et non un cookie : pas de CSRF classique. CORS en liste blanche. |
| Sessions | ✅ | Jetons serveur expirables (voir les audits précédents). |
| En-têtes HTTP | ✅ / ⚠️ | HSTS (`max-age=31536000; preload`), `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` ✅. **Pas d'en-tête `Content-Security-Policy`** sur l'accueil (une CSP peut exister en `<meta>`). |
| Upload | ✅ | Extension + MIME réel via `finfo` ; envoi refusé si `fileinfo` est absent (`upload.php:63-76`). |
| Limitation du débit (login, paiement) | ✅ / ❌ | Login : présente (`student_data`, `compte`, `teacher_access`). Paiement : `init` et `skysms_collect` ✅ ; **`payer` et `status` ❌** (publics et sans limite, ce qui permet d'énumérer les références). |
| Dépendances | ✅ | `npm audit --omit=dev` : **0 vulnérabilité**. Pas de Composer ni de pip côté serveur. |
| Fichiers sensibles | ✅ | `/.git/HEAD`, `/data/veritas_db.json`, `/api/data/payments/`, `/api/payment_config.bak.php` → **403** en prod. |
| Secrets dans le dépôt (public) | ✅ | Aucun fichier de secrets suivi par git. ⚠️ Le mot de passe SkySMS « a circulé en clair » (`POINT_SKYSMS.md`) : il est toujours à changer. |

## 3. Serveur (LWS mutualisé, pas un VPS)
| Point | Verdict | Détail |
|---|---|---|
| HTTPS | ✅ | HSTS actif ; `www` → apex en 301. ⚠️ Je n'ai pas pu lire la date d'expiration du certificat depuis ce poste : l'antivirus Avast intercepte le TLS. À vérifier dans le navigateur (cadenas). LWS renouvelle Let's Encrypt automatiquement. |
| Pare-feu | n/a | Géré par LWS (WAF anti-DDoS, bannissement d'IP). |
| Droits des fichiers | ✅ | Dossiers d'état créés en `0750` + `.htaccess` « Require all denied » + `index.php` 403. |
| Mode debug | ✅ | `display_errors=0` imposé dans `_json_boot.php` et par endpoint. |
| Sauvegardes automatiques | ⚠️ | Seulement **sur le même serveur** : 40 copies tournantes avant chaque octroi et 30 copies à la synchro, dans `data/_backups/`. **Aucune copie hors serveur.** Si LWS perd le compte, tout est perdu. |
| Journaux et rotation | ✅ / ⚠️ | Journal des paiements plafonné à 1 Mo ✅. Contient des numéros clients ❌ (voir 02 § 7). |

## 4. Performance mobile (3G / 4G)
| Mesure (prod, 15/10, depuis ce poste — pas une vraie 3G) | Valeur |
|---|---|
| Accueil `/`, Brotli | 68,6 Ko, 1,13 s |
| Page 403 de LWS | **74,5 Ko** pour une erreur (page d'erreur lourde, sans enjeu) |
| `app.js` (mesure de juin 2026) | 2,98 Mo bruts → ~756 Ko en Brotli, mis en cache 1 an (`immutable`) |
- ⚠️ Lighthouse / Core Web Vitals non relancés dans cette passe (Chrome DevTools nécessaire). À faire en phase 6.
- Le parcours de paiement SkySMS est léger (une page HTML autonome de ~6 Ko, sans dépendance) ✅ : c'est un bon choix pour la 3G.

## 5. Front
- Erreurs console sur l'accueil : 0 au dernier contrôle de prod (15/10, note du projet). ⚠️ Pas relancé ici.
- Responsive : page de paiement prévue mobile (`max-width:440px`, `inputmode=numeric`) ✅.
- Accessibilité : `role=status` + `aria-live` sur l'état du paiement ✅ ; `label for` ✅.
- SEO : `noindex` sur la page de paiement ✅.
- ⚠️ **Produit de test « TEST — Paiement 100 FCFA » (`btest100`) encore visible de tous dans la Librairie** (`POINT_SKYSMS.md` § 5) : à retirer après l'essai réel.
