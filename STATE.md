## Dernière session (11/07/2026) — 1ère harmonisée + sujets d'examen + GT
- 1ère alignée sur la Tle : 0 question creuse/théorique, hypothèses+validation études, 35 #SOLM, méthodos uniformisées.
- Sujets d'examen des compilations : Banque 📗 (Bord, corrigés modèles) ≠ Entraînement 📘 (Livret, vierge), aiguillage dest() + anti-doublon ; contraction 500-700 mots vérifiée au décompte (Djarmaila 2022, Nug 2010) ; Kaufmann 2013 au diagnostic ; nouchi/Bourges/Villemot/Fallé dans les leçons de variations (notes satirico-didactiques).
- GT 1ère+Tle : titres-problèmes conformes (modèle officiel), 21 leçons « GT « motif » — Texte N », anachronisme Defoe et genre Bâ réglés.
- Docx : Livret 0 corrigé / Guide 489 / Bord 74 modèles + 32 renvois 🌐, 0 mojibake, rendus 3×OK ×2 packs.
- Harmonisation TERMINÉE sur les 3 packs (vérif finale) : 0 creuse, 0 théorique, 0 rubrique générique, 0 épreuve sans grille, labels 4 rubriques unifiés partout (2nde comprise), étude 42 1ère (Conrad, visite du docteur) portée au canon complet, GT 52 1ère (Marmite T1 + Querelle dot T2) canoniques avec SOLM ; paratexte Soyinka 51 corrigé. Résidus légitimes documentés : 2nde 33/40/43 (contexte, augurales, lecture commentée) ; applications 4-rubriques (Tle 30/47/51, 1ère 30/53/62).
- FAIT : Ateliers des techniques de réduction (99 2nde / 99f 1ère / 99z Tle → Livret ; dest() 2nde patché banque/entraînement) sur le modèle du Corpus 2nd cycle : 6 techniques progressives (synonymie, hyperonymie, pronominalisation, nominalisation, exemples/répétitions, combiné au quart) + volet « de la réduction à l'argumentation » (thèse reformulée → plan de discussion) ; supports verbatim frais du corpus (2nde : Djarmaila corruption 208 mots 2022, note satirique gombo/tchoko ; 1ère : Winsavi dépigmentation 2013 ; Tle : Tagne TIC 2022) ; grille /20 (10+6+4) ; SOLM démarche, corrigés complets au Guide.
- LIVRABLES : Desktop/Manuels/FINAUX_2nd_cycle/ (9 docx du 10/07 + LISEZMOI) ; nettoyage fait : 13 docx/pdf/html obsolètes supprimés (anciens Bord racine + BAK + sorties PDF juin) + ~70 temporaires (_verif/_report/_dbg/_zones/_src…) ; sources et scripts conservés.
- FAIT : 11 supports de contraction 1ère/Tle (auparavant tronqués à 97-136 mots ou vides, avec décomptes faux) remplacés par des textes frais Abdoulaye Ngom (Migration clandestine sénégalaise / Mobilisations familiales, L'Harmattan 2019-2020), calibrés 500-700 mots au décompte réel : chômage des jeunes, imaginaire migratoire, clandestinité, travail des enfants, secteur informel, réussite/figures, rituels de la pirogue, politiques migratoires. Consignes recalculées (résumé 1/4 ou analyse 1/3 + distanciation), discussions adaptées au thème. Blocs extraits dans Claude code/_ngom/. → 11/11 épreuves 1ère+Tle dans la norme MINESEC 500-700. 2nde AUSSI faite : épreuves 14-E2 (Ki-Zerbo tronqué 239m) et 15-éval (Arturo 242m) remplacées par Ngom 400-500 (départ des côtes 457m ; exode rural 475m) ; diagnostic 00 (réseaux sociaux/jeunesse 203m en #P) conservé comme positionnement. → contraction conforme sur les 3 niveaux. Finaux (9 docx) régénérés dans FINAUX_2nd_cycle/. Reste : 12 corpus de langue courts Tle (~80 mots) + page corrigés manuels.html.
- Reste : page corrigés manuels.html (3 niveaux) ; corpus Tle ~80 mots ; audit GT 2nde.

## Session « relation client / Espace Parents » (27/07/2026) — v1.13
- **Origine** : audit du site lefisk.cm. Livré côté frontend (branche `deploy/campay-securite`, **non commité, non déployé**) :
  (1) pack d'effets `.vfx-*` dans app.css (float, orbes, reflet or, anneau live, verre, CTA or, FAB, flux) — **transform/opacity uniquement**, les originaux de lefisk animent `background-position`/`box-shadow` ;
  (2) **FAB WhatsApp** avec promesse « réponse sous 2 h · jours ouvrés », message pré-rempli selon la section, clic tracé (`wa_click` + méta page) ;
  (3) **flux de preuve sociale RÉEL** (`_vtProofEvents`) : inscriptions, abonnements activés, achats de manuels, certificats — plafond 60 j, anonymisé « Awa T. », desktop ≥1000 px, 2 cycles puis arrêt ; **base vide → rien ne s'affiche** (aucun message scripté, contrairement à lefisk) ;
  (4) **Espace Parents** `pgParents()` — entrée nav de 1er niveau, 3 onglets (Parent au Cameroun **par défaut**, Parent à l'étranger, Élève), tableau inquiétude→réponse, bloc confiance, bloc « 🚧 en préparation » qui dit ce qui n'existe PAS encore ;
  (5) **1er outil gratuit** `_vtMoyenne()` : moyenne pondérée + situation + matières qui coûtent le plus, verdict INDICATIF, CTA abonnement.
- **Backend** : `api/stats.php` accepte 3 événements de plus (`wa_click`, `tool_use`, `parents_view`) ; `_track(ev, meta)` prend une méta (dédup journalière par ev+méta) ; `mStatsFunnel` gagne 2 colonnes.
- **Décision produit (Jacques, 27/07)** : la page s'adresse **aux parents en général**, pas uniquement à la diaspora — les parents au Cameroun sont la cible première, « à l'étranger » n'est qu'un onglet.
- **Vérifié dans le navigateur** (serveur statique local, 0 erreur console) : FAB (46 px, remonte à 82 px quand le bandeau sticky est là), orbes/reflet/anneau animés, tableau qui passe en 1 colonne < 720 px, flux masqué sur mobile, moyenne 142/13 = 10,92 → « passage probable », h1 présent sur la page Parents, aucun débordement horizontal.
- **NON fait / suite** : P0 **lien de facture partageable `payer/{token}`** (le chantier qui débloque le paiement par un tiers), P1 paiement en tranches, P3 Stripe EUR, P4 rapport mensuel au parent, P5 vitrines manuels. Le blocage réel n'est pas le code : c'est le **dossier entité + credentials CamPay/Stripe**.
- **Gotcha** : `graphify-out/JS_FUNCTION_INDEX.md` est indexé sur `VERITAS_v1.2.html` → **retirer 3197** pour obtenir la ligne dans app.js (section v1.13 de l'index déjà en lignes app.js).

## Outils gratuits publics `outils/` (27/07/2026) — aimants SEO
- **4 pages autonomes** (CSS+JS en ligne, elles ne chargent JAMAIS app.js) : `index.html` (hub), `calcul-moyenne.html`, `points-manquants.html`, `planning-revision.html` + `sitemap-outils.xml`. Ajoutées à `sitemap-index.xml`, au trigger `outils/**` et à l'étape de copie de `deploy.yml` (`_style.txt` = note de travail, exclue du déploiement).
- Chaque page : JSON-LD `WebApplication` + `FAQPage`, formules visibles, bloc **double public « Pour l'élève » / « Pour le parent »**, CTA app + CTA WhatsApp « réponse sous 2 h ». Mêmes blocs ajoutés dans `pgParents()`.
- **Maths vérifiées en navigateur** : moyenne 203/17 = 11,94 ; perte (10−8)×4/17 = 0,47 pt ; note nécessaire (10×28 − 9,25×24)/4 = 14,50 ; cas impossible 70/20 → plafond + « 6 évaluations à 20/20 » ; planning 8 h répartis par poids coef×niveau (Français 12/38 → 2 h 32) et phases 5+3+2 sur 10 semaines.
- **FACTUEL — correction de Jacques (27/07)** : il n'existe **PAS** d'exigence de 10/20 par matière du premier groupe. La règle est **10/20 de MOYENNE GÉNÉRALE** ; ce qui a changé en 2024, c'est son **application stricte sans délibération** (fin du repêchage des 8-10). Chiffres OBC utilisables : BAC général **37,26 %** en 2024 (49 521/132 920) contre **75,73 %** en 2023 ; A4 Allemand **6,35 %** (1 496/23 564) ; A4 Espagnol **6,90 %** (2 802/40 633). L'affirmation fausse et l'exemple « 13 en philo / 8 en anglais → échec » ont été retirés des 4 pages + app.js (vérifié : 0 occurrence).
- **PIÈGE JS coûteux** : dans `_vtMoyenneCalc`, un `h += …` placé AVANT la déclaration `var h = …` est **silencieusement effacé** par l'affectation (hoisting, aucune erreur console). Le bloc a été reconstruit dans `ruleHtml` puis concaténé après. À vérifier systématiquement quand un ajout HTML « n'apparaît pas » sans erreur.

## Corrigés en ligne `corriges/` (29/07/2026) — la cible des astuces imprimées
- **Audit** (`tools/audit_corriges.py` → `AUDIT_CORRIGES.md`, tout recompté depuis les sources) :
  1er cycle 6e 463/467, 5e 443/443, 4e 364/364, 3e 476/495 — les seuls « sans corrigé » sont des
  productions orale/écrite accompagnées d'une consigne enseignant (0 exercice nu). 2nd cycle :
  2nde 709/736 (96,3 %), 1ère 664/1007 (65,9 %), Tle 738/1055 (70,0 %).
- **Trous réels à combler** : les 3 évaluations diagnostiques (85 Q, 0 corrigé aux 3 niveaux) ;
  **12 blocs « ⚖️ Épreuve — Langue française » en Tle (124 Q sans corrigé)** alors que la 1ère les a ;
  1ère : études d'œuvre (134 Q), GT (37 Q), méthodo (49 Q). Les « 📘 Sujet d'entraînement » sans
  corrigé sont **voulus** (vierges au Livret).
- **56 pages publiées** dans `corriges/` (hub + 7 index de niveau + 46 pages de séquence + 3 pages EST
  déplacées depuis la racine — elles n'étaient **ni suivies par git ni dans deploy.yml** = 404 en prod,
  alors que manuels.html les annonçait « EN LIGNE »). **3 854 exercices** énoncé + corrigé masqué
  (`<details>`), généré par `tools/build_corriges.py`.
- **Périmètre publié** : énoncé + corrigé seulement. Textes d'auteur, « Je retiens », définitions et
  notes « 🧑‍🏫 Pour l'enseignant » restent dans le cahier imprimé et le Guide (vérifié : 0 occurrence).
- Câblé : `manuels.html` (14 liens morts `href="#"` → liens réels), `deploy.yml` (trigger `corriges/**`
  + copie), `sitemap-index.xml`, `robots.txt` (+ `outils` qui manquait). **Non commité, non déployé.**
- **Écart imprimé/web** : les Bords 5e et 6e n'ont PAS le renvoi de préface avec l'URL `manuels.html`
  (seulement 6 renvois génériques de fin de séquence) ; aucun Bord du 2nd cycle n'a de renvoi web
  (le rendu « effort d'abord » qui le portait a été remplacé le 18/07 par les Bord COMPLETS).
- Vérifié en navigateur (serveur statique local) : 0 erreur console, CSS chargée, 510 liens internes
  valides, `<details>` 96/96 et 182/182 sur les pages testées, pas de débordement horizontal en 375 px.

## Audit profond du site en production (29/07/2026)
- **CRITIQUE — `corriges/` jamais déployé** : 58 fichiers réels, **0 suivi par git** (`git ls-files corriges/` = 0, et rien dans .gitignore). Le `if [ -d corriges ]` du CI est donc faux sur le runner. Conséquence vérifiée : `manuels.html` est en ligne (200) mais **ses 11 liens sont tous en 404** (`/corriges/`, `/corriges/{6e,5e,4e,3e,2nde,1ere,tle}/`, `est-{2nde,1ere,tle}.html`) → tout élève qui scanne le QR imprimé de son manuel tombe sur une page dont chaque lien est mort. Le correctif `corriges/**` est **déjà écrit en local** dans deploy.yml (non commité) mais restera **sans effet** sans `git add corriges/`.
- **CRITIQUE — cache figé, utilisateurs bloqués sur l'ancien JS** : le HTML demande `app.js?v=1.11.3` (l.638/940) et l'asset est servi `Cache-Control: public, max-age=31536000, immutable` (.htaccess l.120-122). Le `?v=` n'a **pas été incrémenté** pour v1.12/v1.13 → un visiteur venu avant le 27/07 peut rester **jusqu'à un an** sur le JS v1.11.3. Le SW ne le sauve pas : `ASSET_VER` est dérivé de `CACHE_VERSION` (sw.js l.29 → **1.13.0**), donc il précache `app.js?v=1.13.0` — **une URL que la page ne demande jamais** — et son fetch est cache-first sur l'URL exacte (l.185 `caches.match(req)`, sans `ignoreSearch`). Double dégât : (a) mises à jour non reçues, (b) ~880 Ko téléchargés pour rien à chaque installation du SW.
- **CRITIQUE — master est un piège** : la prod tourne le contenu de `deploy/campay-securite` (déployé par `workflow_dispatch` ; marqueurs v1.13 présents dans le app.js de prod : `pgParents`, `_vtMoyenne`, `_certVeritasHTML`, `_payDistributeCommission` ; « Répétitions Scolaire » = 0). Mais `git rev-list master...HEAD` = **0/10** : master ignore ces 10 commits, et le workflow se déclenche sur push master → **le prochain push sur master écraserait la prod avec la version d'avant v1.13**.
- **ÉLEVÉ — CamPay non opérationnel en prod** : `?action=config` renvoie `configured:false, mode:"demo", canCollect:false`. Tout encaissement reste manuel, et `CAMPAY_API_BASE` pointe sur le bac à sable. Le `payment_config.php` local n'a **aucun** define `CAMPAY_*` ; 6 placeholders `À_REMPLIR` restants (MTN_API_KEY/USER/SUBSCRIPTION_KEY, ORANGE_CLIENT_ID/SECRET/MERCHANT_KEY).
- **ÉLEVÉ — poids du 1er chargement** : 951 Ko transférés, `DOMContentLoaded` ≈ **7,9 s** (app.js 881 Ko brotli en 6,2 s ; TTFB 1,3 s ; 9 requêtes, 0 tierce).
- **MOYEN** : `corriges/sitemap-corriges.xml` annoncé dans sitemap-index + robots (diff local) mais **404** ; `ErrorDocument 404 /index.html` → chaque 404 renvoie **444 Ko** et un soft-404 ; meta description 260 car. (tronquée ~160) ; h1 « VERITAS Academy » sans accent vs title « VÉRITAS » ; 4 fichiers suivis modifiés non commités (deploy.yml, robots.txt, sitemap-index.xml, manuels.html) → prod ≠ local.
- **Jugé SAIN (vérifié)** : aucune fuite de source (`content.php` → JSON propre) ; 403 sur `config.php`, `payment_config.php`, `/data/veritas_db.json`, `/api/data/*`, `database_mysql.sql`, `/.git/config` ; 401/403/405 corrects sur db.php, db_sql.php, migrate_protected.php, admin_validate.php, student_data.php, upload.php, ia_proxy.php ; en-têtes complets (HSTS preload, COOP/CORP, Permissions-Policy) ; 0 erreur console ; RAG actif ; SW aligné local/prod (v1.13.0) ; `node --check` OK sur app.js + sw.js.
- **Webhook CamPay** : signature JWT HS256 `hash_equals`, **fail-open si `CAMPAY_WEBHOOK_KEY` absente** (l.824-827) — mais **non exploitable** : le payload n'est jamais l'autorité, le statut est relu chez CamPay (l.380-386) et un statut non vérifiable renvoie 202 sans rien accorder. À durcir par confort, pas en urgence.
- **FAUX POSITIFS écartés (ne pas les re-signaler)** : (1) les 7 `+237 6XX XX XX XX` d'app.js sont des attributs `placeholder=` de champs de saisie, pas des numéros de paiement non configurés → **le §6.1 du CLAUDE.md est périmé** (les coordonnées sont éditables par l'admin via `pc_momo_num`) ; (2) les doublons `render/renderQ/scan/start/_step` sont des fonctions **imbriquées** (une seule définition globale : `render` l.10107) ; (3) `Logo détouré.png` répond 200 (93 Ko) — l'échec initial venait de mon curl avec espace littéral ; (4) `sitemap-outils.xml` vit dans `outils/`, pas à la racine.
- **NON VÉRIFIABLE dans cet environnement** : les animations de révélation (`.v-reveal.visible`, `vgzRoleIn`). Le volet navigateur masqué **ne compose aucune frame** → `requestAnimationFrame` gelé, `animation.currentTime` bloqué à 0, opacité mesurée à 0. L'observateur fonctionne (classes `.visible`/`.is-visible` bien posées). **Piège de méthode** : ne jamais conclure « élément invisible » depuis `innerText`/`opacity` quand le volet est masqué — vérifier d'abord `framesEn900ms`.

## Verified facts
<!-- Vérifié contre la réalité (commande, test, doc). Inclure COMMENT ça a été vérifié. -->
- Outils dispo en local : git 2.54, node v26.3, npm/npx 11.16. **`claude` CLI ABSENT du PATH** —
  vérifié `claude --version` → command not found (18/06/2026). ⇒ les `/plugin install` ne peuvent
  pas être lancés depuis une session ; l'utilisateur doit les faire dans un terminal `claude`.
- **PHP absent en local** (per CLAUDE.md + mémoire) → tester les endpoints via le garde-fou CI
  `php -l` de `deploy.yml`, pas en local.
- Le JS applicatif vit dans `app.js` (~3,4 Mo, ~37 000 lignes), PAS dans `VERITAS_v1.2.html`
  (coquille ~440 Ko). `graphify update` ne couvre PAS le JS inline. (per CLAUDE.md, juin 2026)
- `push master` = déploiement FTP prod direct, sans staging. (mémoire `project_deploy_constraints`)

## General rules
<!-- Leçons distillées qui généralisent. Consulter avant de re-dériver. -->
- Avant tout `Read`/`Grep` du frontend : lire `graphify-out/JS_FUNCTION_INDEX.md` puis
  `Read(app.js, offset, limit)`. Ne jamais charger un fichier > ~1 500 lignes en entier.
- Après CHAQUE édition JS → `node --check` ; après endpoint PHP touché → `php -l` (CI).
- Recherche en éventail → sous-agent **Explore** (renvoie la conclusion, pas les dumps).
- Skills : à la demande (`find-skills`), jamais en masse — chaque skill coûte du contexte
  à chaque session.
- Commit/push **uniquement sur demande explicite** (FTP prod sans filet).

## Open failures
<!-- Échecs documentés en attente d'investigation. Hypothèse + repro. -->
- (aucun ouvert au 18/06/2026)

## Lessons learned
<!-- Distillations post-mortem à garder. Promouvoir les générales en skills/règles. -->
- 18/06/2026 : `npx skills add mattpocock/skills` a copié ~30 skills d'un coup, dont ~25 hors-sujet
  (writing / cours TypeScript). Mass-install = gaspillage de contexte récurrent → toujours élaguer
  au sous-ensemble pertinent après ce type de commande.

## Last session
<!-- Pointeur de reprise : horodatage, ce qui s'est passé, prochaine étape. Écraser à chaque fois. -->
2026-06-28 — **CHANTIER pack 2nde A (nouveau programme MINESEC) — TRÈS AVANCÉ.** Détail complet → **`_chantier_2nde.md`**.
FAIT (rendu 3× OK) : **Séq 3** (GT condition de la femme : Miano/Djaïli/Ange De Bana + Capitoline contexte ; langue dérivation-composition, figures d'opposition Louise Labé, texte théâtral Oyono Mbia) ; **Séq 4** (***Poèmes sauvages* de N'koumo — ŒUVRE FOURNIE, vrais extraits E1-E6** ; +phrase complexe) ; **Séq 5-6** (Tartuffe réel, textes allongés III,2/III,6/I,4/V,7 ; +tons comiques, tonalité lyrique/pathétique ; GT hypocrisie 16e = charpenté, verbatim `[À COMPLÉTER]`) ; diagnostic → Bord ; GT négritude retiré ; **Séq 1** +types de phrase. Démarche 6 temps + méthodo qui produit + corrigés partout.
RESTE : upgrade démarche 6-temps des 4 études Capitoline **Séq 2** (`20-23`, actuellement format valide mais non-6-temps) ; polish longueur (GT condition femme, Cléante, Poèmes E3/E5 → 20-30 lignes) ; verbatim GT hypocrisie 16e (Rabelais/Montaigne/La Boétie) ; **évals = sujets de Jacques**. Ressources : `scratchpad/poemes_sauvages.txt`, `scratchpad/tartuffe.txt`, `_capitoline_text.txt`, `_corpus2ndcycle.txt`. Gotcha : fermer les .docx dans Word avant rendu.

2026-06-27 — CHANTIER lancé (voir ci-dessus). Décisions Jacques : tout d'un coup ; retirer GT négritude ; questions PROFONDES conformes aux démarches ; méthodo qui produit ; Livret = même ossature.

2026-06-26 — **PACK 1ère A (français) TERMINÉ et AUDITÉ** (`Desktop/Manuels/Manuel_1ere_A/pack/`).
6 séquences complètes (dissertation ×2 Conrad, contraction actualité, discussion Soyinka, commentaire
composé ×2 Mveng) : leçons de langue déductives + corrigés, lecture de synthèse `Ny`, fiche-méthode `Nz`,
intégration, évaluations (16 #SOL/éval). Rendu : 3× `OK ->` (Livret 133 Ko / Guide 181 Ko / Bord 86 Ko).
Règles Jacques appliquées : intro de commentaire SANS problématique ; développer l'idée AVANT d'illustrer ;
UNE idée / sous-centre / argument = UN paragraphe (commentaire, dissertation, discussion, productions) ;
discussion = exemples du quotidien/actualité ; « Vers le Probatoire » (#PROB), jamais « BAC » en 1ère ;
Abega « Le sein t'est pris » banni (vérifié 0 occurrence). Ressources clés : `_commentaire_modele.txt`,
`_exemple_dissertation.txt`, `_exos_methodo.txt`, `_corriges_nationaux.txt`. Détails → mémoire
`project_methode_enrichissement_packs` (§6quater commentaire, §7 état).
**PROCHAINE ÉTAPE : PACK Tle A.** Dériver le pack (copier `render_pack.py` + `content/`, sed `1ere_A`→`Tle_A`),
identifier les 3 œuvres au programme Tle, rejouer la méthode ; en Tle la rubrique devient « Vers le BAC »
(balise `#BAC::` déjà gérée par le render ; durée 4 h). Mêmes seuils (textes ≥70, évals ≥220).
2026-06-18 — **Démarrage produit « VÉRITAS Campus »** (SaaS multi-tenant white-label pour vendre la
plateforme à d'autres établissements, face à Futuria/Sikolo/Bokeland — cf. analyse concurrentielle).
Décisions Jacques : (1) backend **SQL neuf** ; (2) **nouvelle marque produit** (VÉRITAS Campus, nom de
travail) ; (3) commencer par le **backend**. Construit `api/campus/` (préfixe `cmp_` → zéro collision
avec la base mono-tenant existante) : `schema.sql` (tenants, branding white-label, modules, **structure
académique configurable FR/EN × général/technique** via `_seed_academics.php` selon MINESEC), socle PHP
(`_bootstrap`/`_config`/`_tenant`/`_auth`/`_audit`), front-controller `index.php` (login tenant+plateforme,
`/tenant/config` thème white-label, branding, modules, academics, students, **provisioning** d'école),
`migrate.php` (installateur idempotent verrouillé par `CAMPUS_INSTALL_TOKEN`). Auth = jetons opaques
hachés + bcrypt12 + rôles. `deploy.yml` mis à jour (lint + copie de `api/campus/**`, secrets exclus).
**Non poussé** (FTP prod sans staging). **Prochaines étapes** : (a) poser `CAMPUS_INSTALL_TOKEN` dans
`payment_config.php` puis `migrate.php?action=install/seed_admin/demo_tenant` ; (b) brancher le frontend
(`applyTenantTheme` injectant `--ds-*` depuis `/tenant/config`, écran d'onboarding) ; (c) modules métier
scopés (notes/bulletins QR, emploi du temps, RH) ; (d) confirmer le **nom de marque** définitif.

## Session sujets d'examen (09/07/2026) — banque Bord ≠ entraînement Livret
- **Mécanisme** : dest() aiguille `📗 Banque de sujets` → Bord (correction modèle #SOLM + renvoi web), `📘 Sujet d'entraînement` → Livret (vierge #CAHIER). Testé AVANT le filtre « épreuve ». Numérotation « Leçon » neutralisée pour ces blocs. Porté aux 2 renders (Tle + 1ère).
- **Anti-doublon** : inventaire systématique avant injection (incipits vs pack). Tle : 7 textes des compils déjà présents écartés. 1ère : 8 écartés (Tadjo, Césaire, Tchatchoua-ethnies, Jeune Afrique, Conrad ch1, Soyinka A1-dot, Mveng New York/Moscou).
- **1ère (complet)** : appendice 99* — langue Bord (Khadra, Menga Oracle, Hugo, Mveng, **Bourges nouchi 2013 frais**) + Livret (Menga palabre, Beyala, Tchatchoua, Soyinka) ; commentaire Bord (Conrad Kurtz, Soyinka orgueil) + Livret (Conrad jungle, Soyinka Lakounlé) ; dissertation 4 Bord + 3 Livret ; contraction Bord **Djarmaila « discipline scolaire » 2022 (580 mots, frais)** + Livret Nug hymne (525). Diagnostic contraction actualisé : « La table et la faim » (1997) → **Kaufmann bobaraba 2013** (partie analytique 271 mots, propre) + note explicative.
- **VIGILANCE MOTS MINESEC** : contraction 1ère/Tle = 500-700 mots (2nde 400-500). Convention scolaire = apostrophe séparée (l'homme=2). Djarmaila 580/616 ✅, Nug 495/532 (annonce officielle 525). Toujours recompter la transcription, jamais se fier au chiffre OCR.
- **Textes frais du corpus** : `_corpus2ndcycle_docx.txt` (docx > OCR). Écartés : textes « Presse camerounaise 2024-2026 » à attribution vague + méta-commentaires (non vérifiables = risque verbatim). Retenus = sources précises (Djarmaila Cameroon Tribune n°12580).
- **Choix éditorial (visée satirique/didactique assumée par Jacques)** : conserver les mots (nouchi, bobaraba, cube Maggi) + note explicative/glossaire. Passages les plus crus (voie anale/seringue de Musabyimana/Kaufmann-p1) élidés/évités pour un manuel officiel MINESEC.
- **RESTE** : finir l'appendice **Tle** (seulement 2 épreuves langue Bord faites : Verlaine « L'enterrement », Diabaté « Une Hyène à jeun » ; manque langue Livret, commentaire, dissertation, contraction). Textes fournis non encore exploités : Musabyimana 2016 + Masdoua 2021 (bobaraba) — écartés provisoirement pour redondance thématique + crudité.

## Session Castanou + fix mojibake ✍️ (11/07/2026)
- **Leçon « Les modes de raisonnement » (Tle 55_seq5_sem2.md)** : corpus court Régine Poussin (88 mots, rue/Net) **remplacé** par un extrait **verbatim** d'Yvan Castanou, *4 secrets d'un mariage réussi* (Métanoia & Vie, 2024) — analogie **mariage / armée / présidence** (source `_textes_argu_frais.txt` l.86-93). **204 mots** (norme corpus de langue ~200-250 ✅). Nettoyage OCR unique : « est train » → « est en train ». Exercices 1-4 + 6 réécrits autour de l'analogie (repérage « De même que… », déduction institution→mariage, production/contraction ≈35 mots). EXO 5 (Besson « L'écrivain est un lâche ») + EXO 7 (syllogisme) conservés.
- **BUG mojibake ✍️ (Tle uniquement)** : `render_pack.py` du pack Tle avait l'emoji ✍️ du préfixe « Exercice N : » **double-encodé** (`c3 a2 c5 93 c2 8d…` au lieu de `e2 9c 8d ef b8 8f`) → tous les labels d'exercices Tle sortaient `âœ\x8dï¸`. 1ère et 2nde intacts. Corrigé par remplacement byte-level (1 occurrence unique). **Piège d'audit** : le scan mojibake classique cherche `Ã` — celui-ci commençait par `âœ`, donc invisible ; élargir les marqueurs (`âœ`, `ðŸ`, `Å`, `â€`) pour les emojis.
- **Rendu** : 3× OK Tle + copie FINAUX_2nd_cycle/. Sweep final tous marqueurs sur les 9 docx = **0 mojibake**.

## Session « Constellation VÉRITAS » (29-30/07/2026) — corrigés en ligne + écosystème + parcours
- **Audit des corrigés (tools/audit_corriges.py → AUDIT_CORRIGES.md)** : 1er cycle ≈100 % (6e 463/467, 5e 443/443, 4e 364/364, 3e 476/495 — les manquants = productions orale/écrite avec note enseignant) ; 2nd cycle : 2nde 96,3 %, 1ère 65,9 %, Tle 70,0 %. **Trous réels** : diagnostics (0 corrigé aux 3 niveaux), **12 blocs « Épreuve — Langue française » Tle sans corrigé (~98 Q)**, GT/études d'œuvre 1ère. Les « sujets d'entraînement 📘 » vides sont **voulus** (Livret vierge).
- **corriges/ = 57 pages** générées par `tools/build_corriges.py` (1er cycle : Guides .docx par styles ; 2nd cycle : sources md des packs, numérotation identique à render_pack.py). **3 854 exercices publiés** (énoncé + corrigé masqué). Les 3 pages EST, jamais suivies par git, étaient **404 en prod** → déplacées dans `corriges/est-*.html`.
- **Écosystème « Constellation VÉRITAS »** (modèle Galaxie Nathan) : `constellation.html` (carte), `eleve/` (libre), `enseignant/` (réservé, code), `flash/` (résolveur QR `?c=<niv>&s=<n>`), `parcours/` (notes + orientation). Assets communs `assets/veritas-pages.css` + `veritas-ui.js` + **sprite `veritas-icons.svg` (56 icônes)**.
- **api/teacher_access.php** : porte enseignant (code bcrypt `TEACHER_CODE_HASH`/`TEACHER_CODES` dans payment_config.php, **fail-closed**), jeton HMAC 8 h, fichiers servis depuis `uploads/protected/enseignant/`, journal `api/data/_teacher_log.txt`. Les Guides ne sont **pas** commités (dépôt public) → dépôt FTP manuel.
- **Émojis → icônes vectorielles** : tout le chrome + les marqueurs de rubrique convertis (5 127 → 7 restants, tous **dans le texte** d'exercices sur le langage SMS/émoticônes : à conserver).
- **COEFFICIENTS OFFICIELS VÉRIFIÉS** — source `arrêté n° 92/22/MINESEC du 17 mars 2022` (officedubac.cm/textes, PDF scanné → images extraites et lues) : A4 31/31/33, C 30/29/33, D 30/31, TI 32/33 — **chaque total recalculé = total imprimé**. Piège résolu : Informatique Tle C = **4** (et non 2), sinon le groupe 1 ne fait pas 17.
- **GCE** : pas de moyenne générale — matières capitalisées (A–E, U), pas de compensation ; presets O/L, A/L Science, A/L Arts sans coefficient + avertissement dédié.
- **Discours excellence/abonnement** : bloc « cette prévision n'est vraie qu'à une condition » (travail personnel, sans triche), échelle des mentions + mention calculée, bandeau d'abonnement (évaluations, challenges, battles, Ambassa), blocs « Aux parents » / « Aux apprenants ».
- **Déploiement** : `corriges/**`, `assets/**`, `constellation.html`, `eleve|enseignant|flash|parcours/**` ajoutés au trigger ET aux copies de deploy.yml ; lint CI étendu à `assets/*.js` ; sitemaps + robots.txt à jour. **Rien n'est commité ni poussé.**
- Vérifié en navigateur : 10 011 liens internes / 0 cassé, 0 erreur console, aucun débordement mobile, simulateur recalculé (130/12 = 10,83 ; 178/16 = 11,13 ; impacts pondérés justes), QR `?c=3e&s=4` → bonne page.
- **RESTE** : écrire les corrigés manquants (Tle langue, diagnostics, 1ère) ; déposer les PDF du Guide dans `uploads/protected/enseignant/` + poser `TEACHER_CODE_HASH` ; réinsérer le renvoi 🌐 avec l'URL dans les Bords 5e/6e (absent) et dans les Bords 2nd cycle (aucun) ; imprimer les QR `Desktop/Manuels/_qr_flash/` ; commit + push.

## Corrigés manquants + acquisition (30/07/2026)
- **77 corrigés écrits** dans les sources md du pack Tle (add-only, script `scratchpad/injecte_sol.py`, sauvegardes `*_bak.md`) :
  épreuves de langue **6 (Verlaine « Mon rêve familier »)** et **7 (Philombe « Hymne des révolutionnaires »)** ;
  **1 (Soyinka) + 2 (Corneille)** de la séq. 3 + **contrôle de lecture Le Vieux Nègre (11 Q)** ;
  **1 (Menga) + 2 (Mouangassa)** séq. 4 ; **1 (Prévert) + 2 (Verlaine « Sonnet boiteux »)** séq. 2.
  → Tle **70,0 % → 77,3 %** ; total publié **3 854 → 3 931 exercices**.
- **PIÈGE RENDER** : une ligne non balisée est de type `RAW` et **silencieusement ignorée** par render_pack.py →
  un corrigé de 2 paragraphes doit s'écrire en **deux lignes `#SOL::`**, jamais avec un saut de ligne interne.
- Faits du contrôle de lecture vérifiés dans `Manuel_VieuxNegre/content/*.js` (3 parties, focalisation interne,
  Kelara lucide avant Meka, M. Fouconi commandant, terres données à la Mission).
- **Défaut source repéré** : Tle séq. 4, épreuve 1 (Menga) — la question 6 porte sur « dévorés par le feu de la
  violence », expression **absente de l'extrait imprimé**. À corriger côté cahier (rallonger l'extrait ou changer la question).
- Correctif web : les questions déjà numérotées dans la source (« #Q:: 1. a) … ») ne sont plus re-préfixées
  (« 1. 1. a) »). Le **Guide imprimé garde le doublon** — à corriger dans render_pack.py si Jacques le souhaite.
- **STRATEGIE_ACQUISITION.md** : playbook 3 publics (apprenant / enseignant / parent), calendrier de l'année
  scolaire, boucle cahier→QR→corrigés→abonnement, 10 actions classées impact/coût, 6 KPI, erreurs à éviter.
- **`adopter/`** : page publique d'adoption (enseignants et chefs d'établissement) — spécimen + code, conformité
  MINESEC point par point, « vos corrigés restent les vôtres », 3 étapes, FAQ, CTA WhatsApp/courriel.
  Reliée depuis constellation (orbite), enseignant, manuels ; déclarée dans deploy.yml + sitemap.xml.
- **Bouton « Partager cette page »** sur les pages de séquence (`navigator.share` → presse-papier → WhatsApp).
- Vérifié : 10 205 liens internes / 0 cassé, icônes rendues, 0 erreur console, pas de débordement mobile.
- **RESTE côté corrigés** : Tle séq. 5 et 6 (6 blocs de langue : Mamba, Nganang, Goïta, Tchatchoua, Ngugi, Tagne),
  les **diagnostics** des 3 niveaux, et la 1ère (études d'œuvre, GT, méthodologie).

## Règle produit (30/07/2026) — manuel vendu ≠ corrigés gratuits
- Les pages `corriges/` ne publient **que la correction**, précédée du seul repère « Exercice N » /
  « Question N » : `repere()` dans `tools/build_corriges.py` ; l'énoncé et les options de QCM ne sortent plus.
- Textes d'interface alignés partout (manuels, éleve, flash, constellation, adopter) ; le bouton audio lit
  désormais **les corrigés** en ouvrant chaque bloc.
- Corrigés Tˡᵉ écrits cette session : 12 blocs « Épreuve — Langue française » (Verlaine, Philombe, Prévert,
  Soyinka, Corneille, Menga, Mouangassa, Mamba, Nganang, Tchatchoua, Ngugi) + contrôle de lecture
  (Le Vieux Nègre) + **diagnostic complet** (langue, contraction avec résumé au décompte, commentaire
  « Rosées », dissertation Musset). Tˡᵉ : 70,0 % → **82,7 %**. Publiés : 3 854 → **3 989**.
- Défauts d'énoncés relevés au passage (à corriger dans les sources) : Nganang — la question demande des
  verbes « au conditionnel » alors que l'extrait n'en contient aucun (le corrigé le dit) ; Tchatchoua — la
  question cite « ils ont une histoire » là où le texte porte « ils procèdent d'une tuméfaction du moi » ;
  1ʳᵉ dissertation — la question renvoie à « un texte de Pascal Boroto » absent du bloc.
- **RESTE côté corrigés** : diagnostics 1ʳᵉ et 2ⁿᵈᵉ, études d'œuvre et GT de 1ʳᵉ (65,9 %).
- Diagnostics **1ʳᵉ et 2ⁿᵈᵉ écrits** (30/07, suite) : 1ʳᵉ — langue (Capitoline, dialogue Mathieu/tante),
  contraction + discussion (Kaufmann, résumé 73 mots au quart), commentaire (Soyinka, querelle de la dot),
  dissertation (Stendhal, miroir) ; 2ⁿᵈᵉ — langue (Capitoline, départ de Mathieu : anaphore « Elle ne lui… »,
  catimini), contraction + discussion (réseaux sociaux, résumé 73 mots au tiers), production écrite (récit
  modèle), théâtre (Soyinka acte II, « donné à voir / donné à penser »).
- Couverture : **2ⁿᵈᵉ 98,5 % · 1ʳᵉ 68,5 % · Tˡᵉ 82,7 %** ; pages publiées **59**, exercices corrigés **4 031**.
- Les 3 pages `corriges/<niv>/diagnostic.html` existent désormais ; compteurs des pastilles et totaux
  actualisés partout (manuels, constellation, éleve, adopter). 9 362 liens internes, 0 cassé, 0 énoncé publié.
- Suite 1ʳᵉ (30/07) : contrôle de lecture *Le Lion et la Perle*, la ruse de Baroka, GT « L'image de la
  femme » T3 (Mariama Bâ), méthodologie de la lecture méthodique, entrée dans l'œuvre *Balafon*, GT
  « L'ailleurs » T4 (Conrad), paratexte de *Au cœur des ténèbres*, présentation du groupement.
  **1ʳᵉ : 65,9 % → 75,5 %** ; total publié **4 101** exercices sur 59 pages.
- **BUG D'INJECTION CORRIGÉ** (`scratchpad/injecte_sol.py`) : quand une question portait déjà un `#SOL::`,
  le compteur `q` était incrémenté quand même → tous les corrigés suivants du bloc étaient décalés d'un
  cran. Deux blocs de `00_seq0-1_sem1.md` (1ʳᵉ) ont été nettoyés puis réinjectés ; alignement revérifié
  question par question. Vérifier ce point à chaque nouvelle campagne d'injection.
- Lots 4-6 de 1ʳᵉ (30/07) : la file enchaînée, des comptoirs, la conversation du Directeur, le mémoire de
  Kurtz, bilan de *Au cœur des ténèbres*, bilan du *Lion et la Perle*, paratexte de *Balafon*.
  **1ʳᵉ : 75,5 % → 80,8 %** ; total publié **4 155**. Commit 998e798 poussé sur `deploy/campay-securite`
  (aucun déploiement : deploy.yml ne se déclenche que sur master).
- Lots 7-9 de 1ʳᵉ : banques de sujets de langue (Khadra « Ce que le jour doit à la nuit » 16 Q, Menga
  *L'Oracle* 16 Q), expression orale (l'exposé) et méthodologie de la discussion (introduction/conclusion
  rédigées). **1ʳᵉ : 80,8 % → 84,4 %** — elle passe devant la Tˡᵉ. Total publié **4 191**.
- Lots 10-11 de 1ʳᵉ : entrée dans *Balafon* (axes de lecture négociés), entrée dans *Au cœur des ténèbres*,
  méthodologie du commentaire — le corps du devoir (paragraphe complété) et l'introduction/conclusion
  (modèles rédigés sur « Lettre collective » et sur la compagnie coloniale). **1ʳᵉ : 84,4 % → 86,5 %**,
  total publié **4 212**.

## Sécurisation de l'espace enseignant (04/08) — « l'exclusivité des corrigés »
- `uploads/protected/enseignant/` créé avec son **.htaccess « Require all denied »** + LISEZMOI
  (noms de fichiers attendus, génération du hash bcrypt, rappel : ne jamais committer les PDF).
- **deploy.yml** crée `deploy/uploads/protected/enseignant` ET copie les deux `.htaccess` : sans cela un
  Guide déposé par FTP aurait été téléchargeable par son URL, la porte PHP ne servant à rien.
- `api/teacher_access.php` durci : verrouillage après **5 échecs / 15 min par IP** (porte fermée même avec
  le bon code, pour ne pas révéler qu'on a trouvé) ; **jeton lié au poste** (empreinte IP+agent hachée
  HMAC → une URL de téléchargement partagée dans un groupe WhatsApp ne vaut rien) ;
  en-têtes `X-Robots-Tag: noindex` et `X-Frame-Options: DENY`.
- `/parcours/` enrichi : **glossaire de l'orientation** (filière sélective/non sélective, arrêté
  d'ouverture, dossier, quotas, capacité d'accueil) et **temps forts de l'année** (rentrée / au fil de
  l'année / mai-octobre), avec la règle « jamais un seul dossier ».
- Frise des mouvements littéraires : **abandonnée sur demande de Jacques** (page et CSS retirés).

## Classement par interface + icônes + lisibilité (04/08)
- **Classement parent/élève** : l'onglet « Élève » est retiré de `_VT_PARENT_TABS` (app.js) — un parent y lisait
  des arguments écrits pour son enfant. Contenu porté dans `/eleve/` (section « Ce que tu y gagnes »), et un
  renvoi « Vous êtes l'élève ? → votre espace » ajouté sur la page Parents. Audit : 15 « vous » contre 2 « tu »,
  ces deux-là dans les cartes explicitement étiquetées « Pour l'élève » (paire assumée, on la garde).
- **Icônes** : l'app avait DÉJÀ un sprite `lc-*` (38 symboles, défini dans `VERITAS_v1.2.html`, 40 usages).
  Ajout d'un helper `window.ICO(nom)` + sprite `i-*` (56 symboles) embarqué dans app.js et injecté au boot —
  embarqué et non chargé depuis /assets, car l'app tourne aussi depuis capacitor://localhost et hors ligne.
  Espace Parents converti : 23 émojis → 0. **Reste ~4 339 émojis ailleurs dans app.js.**
- **Lisibilité (demandes Jacques)** : bandes latérales supprimées (4 `border-left` d'accent → 0) ; titres
  centrés avec un trait or centré à la place du soulignement pleine largeur ; textes justifiés avec
  `hyphens:auto` (sans césure, la justification ouvre des rivières sur 375 px) ; gras ramené à 600 sous
  600 px, et les `font-weight:800/900` EN LIGNE de l'app tempérés par `!important` scopé à `.vsec`.
- **RESTE design** : entêtes, puces modernes, nuanciers et dégradés (le gros pass, non fait).

## Espace élève — habillage « jeune » (04/08) + durcissement de l'accès enseignant
- `assets/veritas-eleve.css` (chargé par /eleve/ seulement) : héros dégradé navy→violet avec orbes
  animées (transform/opacity), onglets **collants** qui suivent la lecture, tuiles de classe teintées
  par niveau avec lift au survol, cartes à médaillon et liseré animé, bande d'appel finale.
- `assets/veritas-ui.js` : `reveals()` (IntersectionObserver + **filet 1,2 s**), `onglets()`
  (aria-current au scroll + décalage anti-barre-collante), `compteurs()` (count-up).
- **PIÈGE ÉVITÉ ×2** : (1) le masquage `.rv` n'existe que sous `body.has-js` — sans JS rien n'est
  caché ; (2) le compteur écrit la valeur finale AVANT d'animer, car `requestAnimationFrame` ne
  s'exécute pas dans un onglet d'arrière-plan (constaté : `visibilityState=hidden`, rAF jamais appelé,
  compteur figé à 0).
- **Vérification en onglet non composité** : mesurer l'ÉTAT DOM (classes, textContent), jamais
  l'opacité calculée — sans compositing les transitions n'avancent pas et tout paraît invisible.
- Sécurité de l'espace enseignant : `X-Robots-Tag: noindex`, `X-Frame-Options: DENY`, verrouillage
  après 5 échecs / 15 min, jeton lié à l'empreinte poste (IP+agent) — une URL de téléchargement
  partagée ne vaut rien —, `uploads/protected/enseignant/` avec `.htaccess` + LISEZMOI, et deploy.yml
  qui **échoue** si un verrou `.htaccess` manque.

## Palette apaisée + fin des barres verticales (06/08) — commit c9faa7f
- **237 barres gauches** retirées sur 80 fichiers (app.js, app.css, coquille, chunks, corrigés,
  cours, évaluations, œuvres, outils, seo, campus). Outil rejouable : `tools/sans_bordure_gauche.py`.
  Épargnés : `border-left:7px solid transparent` (**triangle CSS**, pas une bordure) et les 1-2 px
  de structure. Traités aussi les traits dessinés autrement : `box-shadow:inset 3px 0 0`,
  `.sbit.on::before`, `.cl::before` (5 px à gauche → filet 3 px en bas), `.kpi::before` (Campus).
- **PIÈGE regex** : la couleur peut être une concaténation JS (`'+o.color+'`). Ne pas l'avaler avec
  la déclaration laisse un fragment orphelin dans l'attribut style
  (`border:1px solid #E6EAF2;'+o.color+';`) — invisible à `node --check`. Motif corrigé, puis
  contrôle automatique « fragments orphelins = 0 » avant commit.
- **712 teintes tempérées** (`tools/temperer_couleurs.py`) : saturation ÷ 2 **à clarté constante**,
  donc le contraste ne baisse pas (vérifié sur blanc ET #142554 ; #10B981 sur blanc 2,54 → 3,92).
  Or #FFC93C et ambre #F59E0B **jamais touchés** = la marque. Jaunes et violets réglés à la main
  (la formule les rendait kaki / trop clairs).
- `tile()` de l'accueil : la couleur passe par un fond lavé (`color-mix` 10 %) + pastille + flèche,
  et les 5 tuiles utilisent le pictogramme vectoriel (plus d'émoji en repli).
- **Coordination multi-agents** : un autre agent travaillait dans le même dossier. Sa version de
  app.js a écrasé une édition en cours ; l'arbre est reparti de HEAD (son travail, déjà committé).
  Avant d'éditer un gros fichier partagé : `git status` + `git diff HEAD` d'abord.

## Démarrage allégé + chrome sans émoji (06/08, suite) — sessions parallèles
- **app.js 3 030 → 2 930 Ko** en trois coups, sans rien retirer au produit :
  1. **105 littéraux SVG en apostrophes** (−14 Ko) que la première passe, calée sur les guillemets
     doubles, avait laissés. Même bascule vers `svg.vico` en CSS. Reste 1 occurrence légitime :
     le gabarit dynamique de `_calIco`.
  2. **`_initLaboSim` déplacé dans `chunks/labo.js`** (−90 Ko). 1 514 lignes, **un seul appelant**,
     **zéro dépendance** vers app.js (vérifié par extraction des symboles) ; il ne pose que
     `window._sim`, que personne ne lit ailleurs. On ne l'atteint que par `lancerLabo()`, qui charge
     déjà le module → aucune attente nouvelle. Le simulateur et sa donnée voyagent ensemble.
  3. Repli défensif au point d'appel (charge le module si un appel direct court-circuitait la porte).
- Vérifié au navigateur : au démarrage `_initLaboSim` = `undefined` et 0 chunk ; après ouverture d'un
  labo, canvas rendu, 3 curseurs, `_sim.params` {U:6,R1:100,R2:100,mode:'serie'}, boutons
  Pause/Reset/Mode, 0 erreur. Démarrage : 9 requêtes, 3 305 Ko.
- **Chrome 100 % pictogrammes** : 24 émojis restants convertis dans la coquille — barre de connexion
  (marque, S'inscrire, Se connecter, Enseignant), label INFO du bandeau, 5 onglets de connexion,
  18 entrées des menus déroulants. 41 `<use>` résolus, 0 symbole cassé.
  **PIÈGE** : le nom de l'école est réécrit par `textContent` sur le span parent (2 endroits) —
  ça effaçait le pictogramme à chaque rendu. Le nom vit maintenant dans `#vBrandName`, le
  pictogramme dans le parent. Même précaution pour tout libellé piloté par la base.
- Les émojis **restants sont volontaires** : le bandeau déroulant (`.t-item`) est de la DONNÉE
  éditable par l'admin, et les `★` sont de la typographie. Ne pas les convertir.
