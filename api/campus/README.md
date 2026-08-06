# VÉRITAS Campus — Backend multi-tenant white-label

Backend SQL **neuf**, isolé de l'app mono-établissement VÉRITAS Academy. Permet à
**plusieurs établissements** d'utiliser la plateforme, **chacun avec sa propre
marque** (logo, couleurs, nom), ses modules et sa **structure académique
camerounaise configurable** (francophone / anglophone × enseignement général /
technique).

Toutes les tables sont préfixées **`cmp_`** → aucune collision avec les tables
existantes (`students`, `payments`, `grades`…) de la base `verit2781684`.

---

## 1. Installation (une fois)

1. **Poser les secrets** dans `api/payment_config.php` (gitignoré) :
   ```php
   define('MYSQL_PASS', '<mot de passe MySQL>');          // déjà présent (db_sql.php)
   define('CAMPUS_INSTALL_TOKEN', '<openssl rand -hex 32>'); // verrou de migrate.php
   ```
   Sans `CAMPUS_INSTALL_TOKEN`, `migrate.php` est **verrouillé** (fail-closed).

2. **Créer les tables** :
   `POST /api/campus/migrate.php?action=install&token=<jeton>`

3. **Créer le 1er admin plateforme** (éditeur VÉRITAS) :
   `POST /api/campus/migrate.php?action=seed_admin&token=<jeton>` body `email`,`password` (≥ 10 car.)

4. *(facultatif)* **Établissement de démo** bilingue :
   `POST /api/campus/migrate.php?action=demo_tenant&token=<jeton>`
   → slug `demo`, admin `admin@demo.cm` / `Demo@12345`.

> ⚠️ **Déploiement** : `api/campus/**` doit être ajouté à l'allow-list de
> `deploy.yml` (sinon les fichiers ne partent pas en prod). Voir mémoire
> *Contraintes déploiement*.

---

## 2. Résolution de l'établissement (tenant)

Tout appel « tenant » identifie l'établissement par (1er trouvé) :
1. En-tête `X-Tenant: <slug>`
2. `?tenant=<slug>`
3. Sous-domaine `<slug>.veritas-campus.com`

Fail-closed : slug absent → 400 · inconnu → 404 · suspendu → 403.

---

## 3. Endpoints

### Public (thème white-label avant login)
| Méthode | Route | Rôle |
|---|---|---|
| GET | `/tenant/config` | Renvoie `branding` + `modules` + `academics` (sections actives). Aucun secret. |

### Authentification établissement
| Méthode | Route | Corps |
|---|---|---|
| POST | `/auth/login` | `{ email, password }` (+ tenant) → `{ token, expires_at, user }` |
| POST | `/auth/logout` | (Bearer) révoque le jeton |
| GET | `/me` | (Bearer) utilisateur + config de son établissement |

### Administration de l'établissement (rôle `admin`)
| Méthode | Route | Effet |
|---|---|---|
| PUT | `/tenant/branding` | logo/couleurs/nom/contacts → **white-label** |
| PUT | `/tenant/modules` | `{ modules: { frais:true, rh:false, … } }` |
| GET | `/academics` | structure académique (sections FR/EN × gén./tech.) |
| PUT | `/academics/section` | `{ section_key, enabled, bareme, cycles, … }` |
| GET | `/students` | liste (toujours filtrée `tenant_id`) |
| POST | `/students` | crée un élève (plafond forfait appliqué) |

### Pédagogie & notes (rôles `professeur` / `admin`)
| Méthode | Route | Effet |
|---|---|---|
| GET/POST | `/subjects` | matières configurables |
| GET/POST | `/grade-sheets` | feuilles de notes (classe × matière × période × séquence) |
| GET | `/grade-sheet?id=` | feuille + **liste élèves (avec photo)** + notes saisies |
| POST | `/grades/batch` | **saisie groupée** `{ sheet_id, grades:[{student_id,note,coefficient,appreciation}] }` |
| POST | `/grades/submit` | **soumet → VERROUILLE** (le prof ne peut plus modifier) |
| POST | `/grades/admin-edit` | **admin uniquement** : corrige une note verrouillée (`reason` requis, tracé) |
| POST | `/grades/unlock` | **admin** : rouvre une feuille (`reason` requis) |
| GET | `/export/sheet?id=` | données prêtes pour export **PDF/Excel** (client SheetJS/jsPDF) |

> 🔒 **Intégrité des notes** : un enseignant saisit en brouillon puis **soumet**.
> Après soumission, la feuille est verrouillée (`423 Locked` si le prof réessaie) ;
> **seule l'administration** peut corriger, avec motif obligatoire et trace d'audit
> (`modified_by_admin`). C'est l'exigence « pas de modification après saisie ».

### Vie scolaire & discipline (rôles `vie_scolaire` / `admin`)
| Méthode | Route | Effet |
|---|---|---|
| GET/POST | `/absences` | absences en **heures** (justifiées/non) + totaux |
| GET/POST | `/sanctions` | sanctions **et** récompenses (avertissement → exclusion, félicitations…) |
| GET/POST | `/pv` | **procès-verbaux** (conseil de classe, délibération, conseil de discipline) |
| POST | `/import/students` | **import groupé** `{ rows:[…] }` (Excel/CSV parsé côté client, plafond appliqué) |

### Personnel & messagerie
| Méthode | Route | Effet |
|---|---|---|
| GET/POST | `/staff` · `/roles` | comptes du personnel (mdp auto + envoi des identifiants), rôles |
| POST | `/staff/reset-password` · `/staff/status` | réinitialiser / (dés)activer |
| POST/GET | `/notify/send` · `/notify/log` | WhatsApp/SMS (auto sur absence, reçu) |

### Documents & vérification QR
| Méthode | Route | Effet |
|---|---|---|
| POST | `/documents/issue` | enregistre bulletin/certificat/attestation → `code` + `verify_url` |
| POST | `/students/card` | **carte scolaire** vérifiable (code + QR) |
| GET/POST | `/documents` · `/documents/revoke` | registre / annulation |
| GET | **`/verify.php?code=`** | **page PUBLIQUE** d'authentification (cible du QR) — HTML ou `?format=json` |

### Emploi du temps · Bibliothèque · Transport
| Méthode | Route | Effet |
|---|---|---|
| GET/POST | `/timetable` (+`/timetable/delete`) | emploi du temps par classe |
| GET/POST | `/books` · `/loans` (+`/loans/return`) | bibliothèque : ouvrages & prêts (stock transactionnel) |
| GET/POST | `/transport/routes` · `/transport/stops` · `/transport/assign` | lignes, arrêts, affectation élèves |

### Finances & paiement en ligne
| Méthode | Route | Effet |
|---|---|---|
| GET/POST | `/payments` | encaissement + **reçu enregistré** (code QR) + notif parent |
| POST | `/payments/initiate` | paiement **Mobile Money** (MoMo/Orange) → `reference` `pending` |
| GET | `/payments/status?reference=` | statut |
| POST | `/webhooks/momo` · `/webhooks/orange` | **callbacks PUBLICS** (idempotents, jeton tenant) → confirme + reçu |

### Ressources humaines (rôle `intendant`/`econome` = `hr.manage`)
| Méthode | Route | Effet |
|---|---|---|
| GET/POST | `/hr/leaves` (+`/hr/leaves/decide`) | congés (demande → approbation) |
| GET/POST | `/hr/payroll` (+`/hr/payroll/pay`) | paie (net calculé, marquer payé) |
| GET/POST | `/hr/hours` | **comptabilité des heures** (relevé + total par enseignant) |
| GET/POST | `/hr/teacher-pay` | **paie aux heures** (heures × taux → fiche de paie) |

### Moteur de bulletin (rôle `grades.enter`)
| Méthode | Route | Effet |
|---|---|---|
| GET | `/bulletin/compute?class_id=&periode=` | agrège les notes saisies (composantes **pondérées** via `grading` : Devoir 1/2 ou CC/DS/SN) → note trim. par matière, **rang**, **max/min/moyenne de classe**, moyenne générale, rang général, mention. Les feuilles portent `eval_key` (composante). |

### Portail élève / parent (rôle `eleve`/`parent`)
| Méthode | Route | Effet |
|---|---|---|
| GET | `/portal/me` · `/portal/grades` · `/portal/absences` · `/portal/payments` | self-service scopé à l'élève lié (notes **soumises** uniquement) |

### Plateforme (éditeur VÉRITAS)
| Méthode | Route | Effet |
|---|---|---|
| POST | `/platform/login` | `{ email, password }` → jeton plateforme |
| GET | `/platform/tenants` | liste des établissements |
| POST | `/platform/tenants` | **provisionne** une école : `{ slug, name, plan, admin_email, admin_password, product_name?, sections?[] }` |

---

## 4. Contrat de thème white-label (frontend `applyTenantTheme`)

`GET /tenant/config` renvoie :
```json
{
  "ok": true,
  "tenant":   { "slug": "...", "name": "...", "plan": "pro", "currency": "XAF" },
  "branding": {
    "product_name": "Collège X", "slogan": "...",
    "logo_url": "...", "favicon_url": "...", "login_bg_url": "...",
    "primary_color": "#142554", "accent_color": "#FFC93C",
    "header_mode": "sombre", "font_family": "",
    "contact_tel": "...", "contact_whatsapp": "...", "contact_email": "...", "address": "..."
  },
  "modules":  { "frais": true, "rh": false, "...": true },
  "academics": {
    "sous_systemes": ["francophone","anglophone"],
    "filieres": ["general","technique"],
    "sections": [ { "section_key":"fr_general","sous_systeme":"francophone","filiere":"general",
                    "label":"...","langue":"fr","bareme":20,"grading_scale":"sur_20",
                    "periodes":"trimestre","cycles":[…],"enabled":true }, … ]
  }
}
```

Côté frontend, `applyTenantTheme(cfg)` doit :
- injecter `primary_color`/`accent_color` dans les variables CSS `--ds-*` ;
- remplacer logo, `<title>`, favicon, slogan ;
- masquer les modules désactivés (`modules[x] === false`) ;
- piloter les écrans de scolarité selon `academics.sections` actives
  (FR/EN, général/technique, barème, périodes, classes/séries).

---

## 5. Sécurité (par conception)

- **Isolation tenant stricte** : toute requête métier est filtrée `WHERE tenant_id = ?` ; les jetons sont liés à un `tenant_id` (anti-rejeu cross-tenant via `cmp_require_auth('tenant', $tid)`).
- **Mots de passe** : bcrypt cost 12. **Sessions** : jetons opaques aléatoires, stockés **hachés** (SHA-256), révocables, expirants.
- **Rôles** : `admin · comptable · professeur · vie_scolaire · eleve · parent` (« qui voit quoi »).
- **Traçabilité** : `cmp_audit_log` journalise qui a modifié quoi et quand (best-effort, n'interrompt jamais l'action).
- **Surface durcie** : `display_errors` OFF, erreurs → JSON 500 sans stack, CORS allowlist, secrets jamais renvoyés au client, fichiers internes (`_*.php`, `schema.sql`) bloqués par `.htaccess`.

---

## 6. Fichiers

```
api/campus/
├── schema.sql           Schéma multi-tenant (cmp_*)
├── _config.php          Coordonnées DB + jetons (depuis payment_config.php)
├── _bootstrap.php       CORS, erreurs JSON, PDO, helpers réponse
├── _tenant.php          Résolution établissement (fail-closed)
├── _auth.php            Jetons opaques + bcrypt + gardes de rôle
├── _audit.php           Journal de traçabilité
├── _seed_academics.php  Structure camerounaise standard (FR/EN × gén./tech.)
├── _routes_pedago.php   Notes (verrou), absences, discipline, PV, import
├── index.php            Front controller (routes cœur + include pédago)
├── migrate.php          Installateur idempotent (protégé par jeton)
├── .htaccess            Routage PATH_INFO + protection fichiers internes
└── README.md            Ce fichier
```
