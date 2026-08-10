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

### Extension flux preuve sociale (08/08/2026) — quiz + paiement
- `_vtProofEvents` (app.js ~l.39495) gagne **2 sources RÉELLES** en plus des 4 existantes (inscription 🎓 / abonnement ⭐ / manuel 📘 / certificat 🏅) : **quiz réussi 🎯** (`DB.evaluations[].reponses[]`, seuil ≥ 12/20 via `noteSur20` ou `score/total`, nom anonymisé « Awa N. » par `_vtProofName`) et **paiement reçu 💳** (`DB.payments`, date `dt||date`, statut testé `~ /pay|paid|régl|confirm|succ/i`, **générique** sans nom ni montant).
- **Aucun doublon** : réutilise le rendu `_vtProofFeed` + le CSS `.vfx-proof`/`@keyframes vfxProofIn` déjà présents (v1.13). Rien ajouté en CSS.
- **Toujours real-only** : plafond 60 j → le seed 2024 (`DB.payments`, évals de démo) est écarté ; base sans activité récente ⇒ **rien ne s'affiche** (c'est pourquoi le flux semblait « pas installé »). Feed = desktop ≥ 1000 px, ≥ 2 événements, 2 cycles puis stop, fermable.
- **Vérifié** : `node --check app.js` OK ; test unitaire des 2 branches `scratchpad/proof_test.js` (réussite/échec, récence, statut payé/pending, fallback `date`, statut EN `paid`) → 2 quiz + 2 paiements attendus obtenus. **Non commité / non déployé.**
- **Réglages « instant + continu » (08/08, demande Jacques)** : lancement `_vtProofFeed` 6000 → **1500 ms**, seuil `evs.length < 2` → **< 1**, et **suppression de l'arrêt après 2 cycles**. Reste **desktop ≥ 1000 px** et **real-only** : refus explicite de scripter des événements (règle `feedback_preuve_sociale_reelle_uniquement`). Aperçu local éphémère via snippet console (injecte dans `DB` en mémoire, **sans `save()`**, effacé au rechargement).
- **Ruban oblique « GRATUIT » (08/08, 3e demande — cf. capture démo)** : composant réutilisable `.vt-rib-wrap` + `.vt-rib` dans app.css (coin haut-droit, wrapper auto-clippant → la carte n'a besoin que de `position:relative`, statique donc GPU-safe). Posé sur les **cartes e-learning gratuites** (`.rc.elItem`, render ~l.4951) : `if(isFree)` injecte le ruban et l'ancien tag inline `✅ GRATUIT` (rc-tag) est retiré. Choix de périmètre : PAS de ruban sur les tuiles `.vp-tool` de `pgParents` (déjà sous un titre « gratuitement » → clutter), ni sur les badges inline/tableau/modale (un ruban d'angle y casserait). Aperçu visuel envoyé (`scratchpad/apercu_ruban_gratuit.html`). `node --check` OK. **Non commité / non déployé.**
- **Rendu « live » (08/08, 2e demande — cf. capture démo)** : remplacement de la carte unique dont l'`innerHTML` était **remplacé sur place** par un **flux empilé auto-dismiss** : chaque événement réel `appendChild` une `.vfx-proof-card` (entrée `vfxProofIn`), vit **LIFE=5200 ms**, sort via `.vfx-out` (nouveau `@keyframes vfxProofOut`, glisse à gauche + fondu) puis est retirée ; nouvelle carte toutes les **GAP=3400 ms**, pile plafonnée à **MAX=3**. CSS `.vfx-proof` passe en `flex-direction:column;gap:10px` (`display:flex` quand `.on`), `pointer-events:none` sur le conteneur / `auto` sur la carte. `_vtProofStop` (✕) vide tout. `node --check` OK + CSS vérifiée (keyframe/règle/pile). **Non commité / non déployé.**
- **Mobile (08/08)** : flux activé sur mobile — garde JS `innerWidth < 1000` → `< 360`, `MAX` = 2 sur mobile (3 desktop), et CSS `@media (max-width:999px){ .vfx-proof{left:10px;bottom:84px;max-width:calc(100vw - 20px)} }` pour passer AU-DESSUS du FAB WhatsApp (bas-droite, bottom:18px) et du bandeau `.lx-sticky-cta` (centré, bottom:14px, ~60px). **À contrôler sur un vrai téléphone** (le volet ne compose pas de frame ici). 
- **Commit (08/08, sur demande « commite tout »)** : `050fce3` sur `deploy/campay-securite` — app.js + app.css + VERITAS_v1.2.html (+400/−254), consolide le WIP front antérieur + les ajouts de session. Le **ruban `.vt-rib`** était déjà dans le WIP antérieur (CSS app.css ~l.5748, appliqué cartes e-learning gratuites l.4952, tag `✅ GRATUIT` inline retiré l.4958 — pas de doublon). **Exclus volontairement** : `STATE.md` (notes d'audit internes + repo public) et les **1084 fichiers non-suivis** non ignorés (manuscrits `.docx`, drafts, `Manuel_*/`, `.agents/` — hors périmètre app ; NB : `corriges/`, `outils/` en font peut-être partie et restent à décider, cf. audit 29/07). **DÉPLOYÉ (08/08)** : bump cache-buster `1.15.3→1.15.4` (VERITAS_v1.2.html app.js?v=/app.css?v= ×4 + sw.js CACHE_VERSION, garde-fou CI aligné) → commit `b422e00` ; `git push origin deploy/campay-securite` (fast-forward, 10 commits) ; `gh workflow run deploy.yml --ref deploy/campay-securite` (run 31253531239, ✓ 24s, FTP LWS). **Vérifié en prod par le navigateur** (curl KO en local = interception TLS Avast, exit 35 — utiliser le navigateur ou `curl -k`) : la coquille référence `app.js?v=1.15.4`, et app.js/app.css servis contiennent quiz/paiement/`vfx-out`/`innerWidth<360`/MAX2/`vt-rib-wrap`/`vfxProofOut`. ⚠️ Marqueurs à chercher en forme MINIFIÉE (esbuild échappe les non-ASCII (`é`→`é`) et retire les espaces (`< 360`→`<360`)). `STATE.md` + 1084 non-suivis restent hors dépôt. **push master toujours interdit**.

### Bascule CamerPay (08/08/2026) — CamPay mis de côté, encaissement + répartition automatisés
- **Décision (Jacques)** : CamPay refusé faute de **compte bancaire d'entreprise + historique d'activité** (impossible en lancement). CamerPay ouvre à KYC-1 avec **CNI du gérant OU RCCM**, verse sur un MoMo au nom du gérant, et se teste en **sandbox sans aucun document**. CamPay **conservé intact** — `PAY_PROVIDER` (`auto`/`camerpay`/`campay`) rebascule sans toucher une ligne de JS.
- **Backend** `api/payment_camerpay.php` (1 376 l., non commité) — **vérifié contre la doc officielle lue au navigateur le 08/08** (`camerpay.biz/docs/endpoints`, `/webhooks`, `/mass-payout`). Il n'existe que **5 endpoints** : `POST /api/payment/initiate`, `GET /api/payment/{uuid}/status`, `POST /api/payment/{uuid}/refund`, `POST /api/payouts/batch`, `GET /api/payouts/batch/{uuid}`. Base `https://camerpay.biz/api`, `Authorization: Bearer`.
- **⚠️ 5 différences avec CamPay à ne JAMAIS « harmoniser » à l'aveugle** : (1) **redirection** vers `pay_url` (page hébergée), pas de prompt USSD ; (2) webhook en **form-urlencoded**, pas JSON ; (3) HMAC sur la **chaîne `uuid|invoice_id|status|amount`**, PAS sur le corps brut — `amount` à 2 décimales, **signer la chaîne REÇUE** (`10000.00` ≠ `10000`) ; (4) **aucun rejeu sur 4xx/5xx** (réseau seulement, 3 essais) → le polling `?action=status` et `?action=list` sont le vrai filet ; (5) **pas d'endpoint solde ni titulaire de numéro** → réponses `unsupported:true` traitées côté front au lieu d'un « numéro inconnu » mensonger.
- **HMAC vérifié contre le vecteur de test officiel** (`scratchpad/hmac_test.js`) : `test_secret_key_123` + `5add2319-…|FACT-001|completed|10000.00` → `feab3068…bc37` **identique** à la doc ; le piège du montant reformaté est reproduit (signature différente).
- **Frontend (app.js)** : la sonde `?action=config` fait foi (`provider`/`file`/`flow`) → `_payProviderFile()`, `_payFlowIsRedirect()`, `_payProviderName()`. **13 appels `payment_campay.php` codés en dur** ont été routés (init, status, withdraw ×2, payouts, masspayout, masspayout_status, holder ×2, fund_get/create/list). Il n'en reste **qu'un, volontaire** : le repli de la sonde (l.28964).
- **Parcours redirection** : popup ouvert **pendant le clic** (différé = bloqué par le navigateur), `pay_url` posée au retour, bouton de repli dans la modale si blocage ; polling porté de 3 → **12 min** ; téléphone rendu **facultatif** (carte/PayPal n'en ont pas) ; textes du bouton factorisés (`_payTileTitre/Texte/Placeholder/Bandeau`) pour ne pas corriger un seul des deux écrans.
- **🐞 Deux bugs d'argent trouvés en câblant** (ils ne se voyaient pas en lisant) : (1) `_payMaybeAutoPayout` était gardé par `cfg.campayEnabled` — une case qui ne parle que de CamPay → avec CamerPay **aucun bonus ne serait jamais parti** ; remplacé par `_payPayoutReady()` (sonde serveur d'abord). (2) `_versementFinalise` testait `mode==='campay'` en dur → avec `'camerpay'` le versement passait **« effectué » et le solde partenaire à zéro AVANT que l'argent ne bouge** (perdu si le lot était refusé) ; remplacé par `_payModeEstPasserelle()`.
- **Répartition automatique** — les 5 sources convergent déjà vers le même solde `DB.partenairesSplit`, donc un seul canal à brancher : parrains / auteurs / enseignants (`_computeSplits`), codes promo (`confirmCommissionsForSale`→`_payDistributeCommission`), bonus de palier (`calculatePartnerLevel`→ idem). `methode` (`mtn_momo`/`orange_money`) est désormais **envoyée explicitement** : CamerPay **refuse** une ligne de payout sans opérateur résolu. `_payGuessOperator()` reproduit à l'identique la table ARPT du PHP (67/68/650-654 = MTN · 69/655-659/640 = Orange) — l'ancienne regex classait **67 en Orange**.
- **⚠️ Versement CamerPay ≠ CamPay** : un lot est **soumis** puis **approuvé manuellement par CamerPay** (< 4 h ouvrées) avant exécution. Dit dans le dialogue de confirmation, le toast et le guide — sinon l'admin croit à un échec en ne voyant rien arriver.
- **Admin** : bloc de mise en service CamerPay (ouvert par défaut) + CamPay replié « mis de côté », champ `camerpayPublicToken`, boutons liste/solde/versements routés, bandeau **🧪 mode TEST** tant que `CAMERPAY_MODE='sandbox'`.
- **Vérifié** : `node --check app.js` OK ; `scratchpad/routage_test.js` (28 assertions sur les helpers purs extraits du fichier : choix de fournisseur, bascule CamPay, table d'opérateurs, garde-fou de versement, textes) → **tout passe**. **PHP absent en local** → `php -l` non rejouable ici, c'est le garde-fou CI de `deploy.yml` qui le fera.
- **3 derniers garde-fous `campayEnabled` trouvés au balayage final** (même famille que le bug #1, mais côté *écrans*, donc invisibles aux tests de routage) : le bouton **« Verser à tous »** de `pgPartenairesSplits` (l.~29963) ne s'affichait pas sous CamerPay ; l'option **« ⚡ Automatique »** de `mVerserPartenaire` s'annonçait « (CamPay non activé) » alors que CamerPay l'était ; le bandeau de `mPartnerSettings` disait d'activer CamPay avant les versements. Les trois passent par `_payPayoutReady()` / `_payProviderName()`. Reste `campayEnabled` **uniquement** là où c'est légitime : la case CamPay elle-même (l.13861), le repli pré-sonde de `_payCampayReady()` (l.28977) et la branche CamPay de `_payPayoutReady()`.
- **Livré aussi** : `GUIDE_CAMERPAY_ACTIVATION.md` (7 étapes, paliers KYC, tarifs, ce que CamerPay ne fait pas — la génération du jeton public donne une commande **node**, PHP n'étant pas installé sur le poste) ; `deploy.yml` porte déjà `payment_camerpay.php` + `_pay_funds_lib.php`, et son lint CI `php -l api/*.php` couvre le nouveau fichier par glob. **Non commité / non déployé.**
- **🕳️ Trou trouvé le 09/08 en regardant la page « Intégrations » de CamerPay** : le serveur fixe `merchant_return_url` à `…/#paiement?ref=XXX` (`camerpayReturnUrl`) **mais rien ne lisait ce hash au chargement** — le payeur revenait sur une application muette, sans confirmation ni suivi, alors que le paiement était passé. Le routeur d'ancres v1.13.1 (fin de fichier) ne le couvre pas : sa liste blanche ne contient que des sections visiteur. Ajouté `window._payResumeFromHash()` + `_payReturnBoot` **en fin d'app.js** (à côté du routeur existant) : rouvre l'écran de suivi et relance le polling ; regex **stricte** `/^#?paiement\?(.+)$/` pour ne pas capter `#mes-paiements?ref=…` ; `history.replaceState` pour que le hash ne rouvre pas la modale à chaque re-rendu. Il ne fait que MONTRER l'issue — l'autorité sur l'argent reste le webhook.
- **Repli même-fenêtre** : si aucun onglet n'est ouvrable (**webview Capacitor de l'app Android**, où `_blank` ne donne rien ; blocage de popup), le bouton de la modale navigue **dans la fenêtre courante** au lieu de `target="_blank"` — parcours normal d'une passerelle par redirection, et le retour est désormais géré. Détection durcie : `window.open()` peut renvoyer un objet inutile, on teste `.closed === false`. Posé aux **deux** endroits (`_payInitCampay` l.~29116 `lienAttrs`, cagnotte l.~40762 `_cagAttrs`).
- **⚠️ Piège de session (09/08)** : `app.js` était édité **en parallèle par une autre session** — une de mes modifications a été annulée en laissant `lienAttrs` **utilisé mais plus déclaré** (`node --check` passe : c'est une `ReferenceError` à l'exécution, pas une erreur de syntaxe, et elle aurait cassé tout le parcours de paiement). Leçon : après un `Edit` signalé « file modified since read », **re-grep déclaration ET usage** de chaque variable introduite ; `node --check` ne suffit pas.
- **Sur les « Intégrations » CamerPay** (WHMCS, WooCommerce, PrestaShop, Magento, Shopify, SDK Flutter) : aucune ne s'applique. VÉRITAS utilise l'**API REST 2.0**, ce qui est déjà fait. Le SDK Flutter ne concerne pas l'app Android, qui est un **wrapper Capacitor**. Le SDK PHP (`composer require camerpay/php-sdk`) est écarté volontairement : pas de composer sur LWS mutualisé, et l'implémentation native suit l'exemple officiel « sans SDK », vecteur de test à l'appui.
- **Où en est Jacques (09/08)** : compte CamerPay **créé**, **token obtenu**. Reste **côté serveur uniquement** (aucun code à écrire) : poser `CAMERPAY_TOKEN` + `CAMERPAY_CALLBACK_SECRET` + `CAMERPAY_PUBLIC_INIT` dans `api/payment_config.php` sur LWS (**gitignoré, jamais déployé par la CI** → l'édition se fait au gestionnaire de fichiers LWS), déclarer le webhook `…/api/payment_camerpay.php?action=notify`, tester en sandbox.

### Audit du travail CamerPay + déploiement (10/08/2026) — commit `42c6ffa`, run 31359421839
- **Le blocage n'était pas un réglage : rien n'était commité.** `api/payment_camerpay.php` (1 376 l.) et `api/_pay_funds_lib.php` étaient **non suivis**, et `app.js` en HEAD contenait **zéro** occurrence de « camerpay ». Le `[ -f ] && cp` de `deploy.yml` sautait les deux en silence — **4e incident** de cette famille (cf. [[feedback_ci_fichiers_non_suivis]]). La boucle de copie des endpoints **échoue maintenant bruyamment** (`::error` + `exit 1`) si un chemin listé manque du dépôt.
- **🕳️ Cul-de-sac du self-service (le plus coûteux fonctionnellement)** : `_payInitToken()` lisait le jeton public dans `DB.payApiConfig` — qui **ne quitte jamais le poste de l'admin** (`public_data.php` expose 6 champs, pas celui-là ; la base complète exige le secret de synchro ; `vrt10_cc` n'existe que sur un appareil déjà configuré). Un visiteur voyait donc la tuile « ⚡ Payer maintenant » (le serveur disait `canCollect:true`) puis « libre-service indisponible ». **Le guide et STATE affirmaient le contraire.** Corrigé : `?action=config` renvoie `publicInitToken`. Le jeton est **public par construction** — tout navigateur qui paie le détient ; ses barrières réelles sont l'origine, le débit/IP et `CAMERPAY_COLLECT_MAX`. Cache de sonde versionné `_vrtCampayCap` → `_vrtCampayCap2`, sinon 10 min d'impossibilité de payer après la mise à jour.
- **🔴 Faille d'argent — commissions forgeables (la plus grave de l'audit).** `vrt_grant_entitlement_to_file` recopiait **telle quelle** la liste `commissions` envoyée par le navigateur et la marquait `validated`. `?action=init` étant ouvert aux clients, il suffisait de payer 100 FCFA en joignant `{partnerId:<le sien>, commissionAmount:2000000}` pour se créditer le solde de versement — et le **versement automatique** l'aurait fait sortir. Distribuer le jeton public (ci-dessus) élargissait la fenêtre : les deux corrections devaient partir **ensemble**. Nouveau `vrt_commissions_verifiees()` : partenaire existant **et** actif, taux repris du **palier en base** (`DB.partnerLevels`), assiette bornée à l'encaissé réel, valeur du client réduite au rang de **plafond**, cumul ≤ 50 % de la vente, 10 lignes max, recopie par **liste blanche**, refus journalisés dans `api/data/_commissions_log.txt`.
- **Quatre autres trous** : (1) webhook **fail-open** — sans `CAMERPAY_CALLBACK_SECRET` toute notification passait (`$sigOk === false` seul rejetait, `null` non) → fail-closed + `webhookSecret` remonté dans la sonde et affiché en ⚙️ Paramètres ; (2) **cagnotte** — `granted=true` posé même quand `cagRecordContribution` échouait : argent encaissé, contribution perdue, réconciliation neutralisée à jamais ; (3) **montant non confronté** — si CamerPay omet `amount`, `$paye=0` désactivait la garde de sous-paiement *en silence* → 3 noms de champ lus, absence tracée (`montant_verifie`) ; (4) **`?action=holder`** consommait le quota d'initiation (10/h) : quelques numéros tapés dans le formulaire de cagnotte et le paiement partait en **429**.
- **Toutes les surfaces payantes branchées** : `_echPay` (tranche de scolarité) partait **sans `intent`** → le parent payait et la tranche restait due (ni le navigateur ni le serveur ne savaient quoi marquer) ; ajout de `intent:'echeance'` + `targetId:"<plan>:<rang>"`, cas client (réutilise `_echMarkPaid`, aucune règle dupliquée) et cas serveur (recette idempotente par ref, élève soldé quand `reste===0`). Le **panier** partait sans son détail : `openPaymentModal` met les lignes de côté dans `window._VRT_PAYX[ref]` (l'`onclick` est une chaîne, il ne transporte que des scalaires), `_payInitCampay` les joint, le serveur les assainit (`camerpaySanitizeLignes`) et **récurse** sur `vrt_grant_entitlement` avec `ref#rang` pour que l'idempotence joue ligne par ligne. Les lignes sont **plafonnées au montant réellement payé** — le client dit QUOI débloquer, pas COMBIEN.
- **Reçus automatiques** : `_recuEmettre()` appelé depuis `_payFinalizePaid`, donc par les **cinq** chemins de confirmation. Numérotation **annuelle continue** `VR-2026-0001` (un trou dans la série est ce qu'un contrôleur cherche), **idempotente par `payRef`** (rejeu webhook + polling + validation manuelle = un seul numéro), montant **en toutes lettres** (`_recuLettres`, 26 cas vérifiés — pièges : « soixante et onze », « quatre-vingts » mais « quatre-vingt mille », « deux cents » mais « cinq cent mille » ; `cent` s'accorde devant *millions*, jamais devant *mille*). Rendu via `printDoc` (Imprimer / PDF / Image + QR). Bouton 🧾 dans `mPayAttempts` pour rééditer sans jamais créer un 2e numéro. Bandeau **SPÉCIMEN** si sandbox.
- **Plan réel = Entreprise** (capture Jacques 10/08) : **500 XAF/mois, 1,5 %, transactions ILLIMITÉES**. Le guide annonçait « Business 1 500 F » — faux. `CAMERPAY_FEE_RATE` par défaut 0.03 → **0.015**, message `transaction_limit_reached` reformulé (le plafond de 100/mois ne vise que Démarreur), et le coupe-circuit `CAMERPAY_INIT_MAX_PER_DAY` **re-justifié** : il ne protège plus un quota fournisseur inexistant mais le serveur (un fichier d'état par initiation, relu en entier par `?action=list`).
- **Méthode, PHP absent du poste** : `scratchpad/php_check.cjs` (équilibrage `{}()[]" hors chaînes/commentaires + « toute fonction appelée est-elle définie ? »). Il attrape la **fatale d'exécution** que `php -l` ne voit pas ; le lint de syntaxe reste celui de la CI (passé : étape « 🧪 Vérifier la syntaxe » ✓). Vérification navigateur avec `scratchpad/mock_server.cjs` (sert VÉRITAS **et** simule les 3 actions CamerPay) : visiteur neuf → jeton reçu de la sonde, `init` porté par le **jeton public**, 2 lignes de panier transmises, tranche 2/3 marquée « Payé » sans toucher la 1/3.
- **En prod (vérifié au navigateur)** : `…/api/payment_camerpay.php?action=config` répond `{"ok":true,…,"configured":false,"reason":"En attente des identifiants CamerPay…"}` — le fichier **existe enfin**, et la dégradation est propre. `app.js?v=1.15.6` servi contient `publicInitToken`, `_recuEmettre`, `_VRT_PAYX`, `echeance`, `webhookSecret`. ⚠️ `curl` local inutilisable (interception TLS Avast, exit 35) → passer par le navigateur.
- **Reste à faire, côté serveur uniquement** : poser les 3 constantes dans `api/payment_config.php` sur LWS + déclarer le webhook. **`CAMERPAY_CALLBACK_SECRET` n'est plus optionnel** : sans lui les notifications sont rejetées (les paiements aboutissent quand même par polling/réconciliation, mais l'activation n'est plus instantanée) — le bandeau ⚙️ Paramètres le dit.

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

## « L'essentiel pour réviser » à l'accueil + accents de l'Orientation (06/08)
- **Constat** : l'accueil présentait le CENTRE (vidéo, palmarès, IA, photos, résultats) et **aucun**
  des outils qu'un apprenant vient chercher. Calendrier, corrigés, laboratoires, outils de calcul
  dormaient à deux ou trois niveaux dans les menus déroulants — le défaut déjà corrigé pour
  l'orientation, resté entier pour tout le reste.
- **8 portes** (`_ACC_ESSENTIEL` / `_accEssentiel()`), placées **juste sous la vidéo**, 2ᵉ section de
  la page : calendrier, corrigés, épreuves & annales, laboratoires, jeux & œuvres, orientation,
  outils de calcul, Prof. Ambassa. Pastille « Gratuit » là où c'est vrai — c'est l'information qui
  décide du clic, pas un argument de vente. Lien final vers le hub élève.
- **Aucun chiffre affiché** : les catalogues sont chargés à la demande ; un compteur ici serait soit
  faux, soit payé par le téléchargement qu'on cherche à éviter.
- **DEUX DESTINATIONS ÉTAIENT FAUSSES, trouvées en cliquant vraiment** :
  1. `vShowSec('calendrier')` **n'existe pas** — l'appel retombait EN SILENCE sur l'accueil, en
     laissant `_vCurrentSec='calendrier'` (d'où l'illusion que ça marchait). Le vrai point d'entrée
     est `showCalendrier()`. **Les clés valides de vShowSec** : actualites, boutique, cagnotte,
     contact, elearning, epreuves, histoire, labos, leaderboard-junior, mes-partenariats,
     nos-partenaires, orientation, parents, partenariat, photos, presentation, resultats, trophees,
     verifier-certificat. Tout le reste retombe sur l'accueil sans rien dire.
  2. `elearning` (3 200 car.) au lieu d'`epreuves` (8 400 car., filtres section/matière/niveau).
  **Méthode** : ne jamais valider une carte sur « la fonction existe » — cliquer et comparer
  l'empreinte du contenu à celle de l'accueil.
- **Accents rétablis dans toute la section Orientation** (83 mots) : « filiere », « ecole »,
  « Medecine », « Superieure », « RECOMMANDEES »… sur la page d'orientation d'un centre de français.
- **DEUX PIÈGES du script d'accentuation**, à connaître avant d'en rejouer un :
  1. Les libellés des centres d'intérêt servent aussi de **valeur comparée**
     (`interests.indexOf("Medecine")`). Ici tableau et comparaison étaient dans la même plage de
     lignes, donc renommés ensemble — le hasard, pas la méthode. Protéger `value=/id=/name=`.
  2. Le script a renommé la **variable** `ecoles` en `écoles` (identifiant JS accepté par
     `node --check`). Remis en ASCII ; ne remplacer que hors identifiants.
  3. La sentinelle de protection doit être impossible dans le source : un ` 14 ` entouré d'espaces
     existe (attributs `min`/`max`), un octet nul non.
- Vérifié au navigateur : les 8 cartes atteignent leur destination (2 onglets, 1 modale, 5 sections),
  2 colonnes à 375 px sans débordement, 3 à 654 px ; formulaire d'orientation rempli → recommandations
  générées citant Médecine/FMSB/Polytechnique (donc `indexOf` et la variable `ecoles` intacts) ;
  0 mot sans accent dans la sortie ; 0 erreur console.

## Campus audité + demandes entrantes (06/08) — déployé 1.15.1, commits fa75dd9 / afc832c / aeadcb4
- **AUDIT_CAMPUS.md** : socle sain (jetons opaques hachés, bcrypt 12, zéro injection SQL, isolation
  tenant fail-closed, portail élève borné). Corrigés : anti-force-brute des deux connexions
  (`cmp_login_guard`, 10/IP + 5/e-mail sur 15 min, comptés dans `cmp_audit_log`, fail-open assumé),
  journalisation des échecs sur le compte ÉDITEUR (absente), jeton retiré de l'URL, débit limité sur
  `verify.php`, `str_shuffle` → Fisher-Yates.
- **PIÈGE n°1 — le module n'était pas déployé** (`campus/**` et `api/campus/**` hors deploy.yml).
  Ajoutés + lint `php -l` étendu à `api/campus/*.php` + échec du déploiement si `.htaccess` manque.
- **PIÈGE n°2 — `_config.php` mis au gitignore** alors qu'il définissait SEUL `CAMPUS_DB_HOST` & co :
  au premier déploiement, `cmp_pdo()` aurait levé une Error sur constante inconnue → 500 partout.
  Défauts déplacés dans `_defaults.php` (suivi) ; `_config.php` = surcharges serveur. Même repli
  pour les seuils anti-force-brute, dans `_auth.php`.
- **PIÈGE n°3 (nouveau, 4e variante) — `api/demandes.php` jamais committé.** Le chemin figurait
  bien dans deploy.yml, mais `[ -f ]` saute en silence sur un fichier absent du dépôt. Détecté en
  SONDANT la prod (404), pas en relisant le workflow. Vérifier `git ls-files <chemin>` avant de
  déclarer un endpoint déployé.
- **`save()` ne pousse au serveur que pour admin/enseignant** : toute demande déposée par un
  visiteur restait dans SON navigateur (« demande reçue » mensonger). D'où `api/demandes.php` :
  écriture serveur, débit limité, empreinte d'IP au lieu de l'IP (ces fiches portent une adresse
  de domicile), repli WhatsApp si le réseau lâche.
- Entrées : hub Établissement (`_PV_PUBLICS.etablissement` + carte d'accueil rebranchée), bloc
  Campus sur le programme partenaire `chef_etab`, 3 boutons « accompagnement à domicile » (hub
  parent + bandeau et pied de la page Parents), raccourci `?demande=campus|domicile`.
- Suivi centre : `pgDemandes()` (menu Communication) + devis (calculette séances×heures×tarif,
  envoi WhatsApp, impression). Aucun tarif public : le devis se construit côté centre.
- 121 émojis de `campus/` → pictogrammes, **sprite embarqué page par page** (une install d'école
  hors ligne ne peut pas dépendre de `/assets/`). Jeu commun porté à 75 icônes.
- Vérifié en prod : 422 « Type de demande inconnu », 422 « Le nom est requis », 401 sans jeton,
  `campus/index.html` 200, `api/campus` 400 fail-closed (donc bootstrap OK), app.js 1.15.1.

## Audit cohérence / doublons / pages muettes / abonnements (07/08)
- **PAGES MUETTES : aucune.** Balayage réel des **40 portes** du portail visiteur (nav, menus
  déroulants, tuiles d'accueil, cartes de rôle) — chacune déclenchée puis comparée à l'empreinte de
  l'accueil : 28 sections rendues (249 → 8 825 car.), 9 modales, 2 onglets, **0 erreur JS, 0 dialogue
  natif**. Le seul « muet » est `vShowSec('presentation')` depuis le bouton Accueil = comportement
  correct. Harnais : neutraliser `alert/confirm/prompt` AVANT le balayage — un `confirm()` gèle le
  rendu entier et fait passer l'audit pour bloqué.
- **PIÈGE CORRIGÉ AU PASSAGE** : `vShowSec('calendrier')` **n'existe pas** — le calendrier a sa propre
  fonction `showCalendrier()`. Un `vShowSec()` sur une clé inconnue **retombe en silence sur
  l'accueil** : aucune erreur, aucune trace. Sections valides : presentation, elearning, boutique,
  parents, orientation, actualites, epreuves, labos, jeux, photos, resultats, contact, cagnotte,
  trophees, partenariat, leaderboard-junior, nos-partenaires, mes-partenariats, verifier-certificat,
  histoire. Vérifier une clé avant de l'écrire dans une carte.
- **DOUBLONS = motif d'override V2, pas des accidents.** 13 captures `var _origX = …` ; **9 ne sont
  jamais rappelées** (`_origRe`, `_origInitTicker`, `_origVShowSecEl`, `_origShowCoaching`,
  `_orig_dlFile`, `_origCvEleveViewSujet`, `_origCvAdminCreate`, `_origCvChatOpen`,
  `_origOpenPaymentModal`). Trois V1 sont masquées par une V2 homonyme et **pèsent 4,3 Ko de code
  mort** : `_dlFile` (8934, V2 27091), `cvAdminCreate` (25774, V2 27393), `_cvChatOpen` (26576,
  V2 27566). **Conséquence à retenir : éditer une V1 n'a aucun effet** (déjà constaté sur
  `openPaymentModal`). Suppression préparée, NON appliquée — un autre agent éditait `app.js`.
- **Code mort** : 75 définitions racine sans aucune référence ailleurs. Beaucoup sont des crochets
  volontaires (`startOnboarding` = relance manuelle jamais câblée, `clearVeritasErrors` = outil de
  console documenté). À trier, pas à supprimer en bloc. **`_st` (l.665) n'est utilisé nulle part**
  alors que le CLAUDE.md le présente comme un helper « à utiliser systématiquement » — doc à corriger.
- **PIÈGE D'AUDIT** : un scan « jamais référencé » qui exclut le point dans sa lookbehind ne compte
  pas les définitions `window.X = function` et déclare mortes des fonctions bien vivantes (238 faux
  positifs au premier jet). Retirer les LIGNES de définition du corpus, puis compter.
- **ABONNEMENTS — la chaîne est saine.** `validerAbonnement` crée en `statut:'En attente'` ; seul
  `_payFinalizePaid` active, et ses 4 appelants sont MTN / CamPay / Orange (statut relu côté serveur)
  + validation manuelle admin. `_statutActif` n'accepte pas « en attente ». Prix cohérents :
  `_pvOffre` et `_relancePremium` lisent `DB.elearning.plans`, et le « dès 3 000 FCFA » de
  `_requirePlan` correspond bien au plan2.
- **ABONNEMENTS — la faille est ailleurs : `chunks/labo.js` est public et contient les 30 labos,
  dont les 9 premium** avec leurs étapes et leurs quiz complets (183 Ko). Le « Pack Sciences » se lit
  intégralement en ouvrant l'URL du module. Le verrou `_planAccess` est purement client. **Ce n'est
  pas une régression du découpage** — tout était déjà dans app.js, public lui aussi ; le module rend
  seulement la lecture plus commode. Vrai correctif = servir les labos premium par `content.php`
  (jeton), comme les PDF. Les fichiers vendus, eux, restent protégés côté serveur.
- Corrigé : la visite guidée annonçait « en 8 étapes » pour 9 étapes réelles (le compteur affichait
  « Étape 1 / 9 »). Le nombre est désormais dérivé de `_ONBOARDING_STEPS.length`.

## L'« effet bordure incurvée » gauche/droite — cause racine, enfin (07/08)
- **Symptôme** : deux bandes sombres verticales collées aux bords gauche et droit, sur **toutes** les
  pages visiteur, **uniquement sous 900px**. Signalé au moins 3 fois ; les correctifs (k), (k-bis),
  (k-ter) de `app.css` traitaient des symptômes **sur l'accueil seulement** (`.acc-head`,
  `.acc-hero-video`, `.acc-news`) et la passe « 237 bordures gauches retirées » cherchait des
  `border-left` : la cause n'était ni l'un ni l'autre, d'où l'impression de bug immortel.
- **Cause** : `@media(max-width:899px){ #VISITOR>div:last-of-type{ …position:static!important } }`
  (app.css ~2974), écrite « pour le footer ». Mais `:last-of-type` = dernier enfant **de type DIV** ;
  or le footer est un `<footer>`. Enfants de #VISITOR : `.vlogin-bar`, `.vhero`, `script`,
  **`#tickerBar`**, `main#vBody`, `footer` → la règle visait le **bandeau défilant**.
  Son `position:static!important` lui retirait son rôle de bloc conteneur, donc ses fondus de bord
  `#tickerBar::before/::after` (absolute, `top:0;bottom:0`, 60px, `#0F172A`) se rattachaient à
  **`#VISITOR` (position:fixed)** → 60px × toute la hauteur de l'écran, fixes au défilement.
  `overflow:hidden` sur le bandeau n'y pouvait rien : il ne coupe pas un absolu dont le bloc
  conteneur est un ancêtre.
- **Correctif** : règle supprimée (le `<footer>` se met en forme en inline, coquille ~l.924 → aucun
  changement pour lui, vérifié : padding/gap/justify identiques avant-après) + `top:auto` ajouté sur
  `#tickerBar`. **Piège du correctif** : `top:48px` traînait des règles `sticky` (l.1146/1655) ; en
  `static` il était ignoré, en `relative` il décalait le bandeau de 48px **sous la nav**. Le
  `top:0!important` du `@media(min-width:900px)` garde le collant du bureau intact.
- **MÉTHODE qui a marché, là où lire le CSS a échoué 3 fois** : ne pas chercher la déclaration
  fautive, **mesurer les pixels**. Playwright + Chrome local (`node_modules/playwright-core`,
  `executablePath` Chrome, `NODE_PATH` vers le dossier projet sinon `MODULE_NOT_FOUND`), capture →
  `<canvas>` dans la page → luminance par colonne. Bords à 50, centre à 238 = preuve. Puis
  **dichotomie sur les 1 639 éléments** (`.__np::before,.__np::after{display:none}`) → coupable en
  11 essais. Les scans DOM par style ne le voyaient pas : le pseudo est `fixed`/`absolute`, il
  **s'échappe de la boîte de son parent**, donc filtrer sur le rect de l'élément le rate.
  `CSS.getMatchedStylesForNode` (CDP) donne la règle gagnante et sa ligne — à utiliser d'emblée
  quand un `getComputedStyle` contredit le CSS lu.
- **À retenir** : `:last-of-type` / `:last-child` sur un conteneur au balisage mixte est un piège ;
  et un `position:static` imposé de loin transforme silencieusement tout enfant `absolute` en calque
  plein écran.

## Chrome visiteur : trois bandeaux → un seul (07/08)
- **79px d'en-tête récupérés** : `.vlogin-bar` (36) + `.vhero` (7, écrasé sur mobile — sa citation
  débordait PAR-DESSUS le ticker, d'où le chevauchement visible sur les captures) + `#tickerBar` (36).
  Le contenu commence désormais à y=0. Aplatissement en CSS, pas de restructuration HTML : la
  coquille était éditée en parallèle par une autre session.
- **PIÈGE — `#vLoginBtns` est réécrit EN ENTIER** par `_updateVisitorHeader()` (connexion) et
  `deconnecter()`. Y laisser panier / langue / contact / `#adminAccessPoint`, c'est les perdre à la
  première connexion — l'accès admin compris (bug préexistant). D'où `#vNavUtils`, conteneur à nous
  créé par `_vChromeCompact()`, qu'aucune de ces réécritures ne touche. `#vLoginBtns` est déplacé
  dans la nav malgré tout : connecté, c'est lui qui porte « Mon compte » et « Déco ».
- **PIÈGE — `min-height` CLAMPE `height`, même en `!important`.** `.btn{min-height:44px}` rendait les
  icônes ovales (40 de large, 44 de haut) : `height:40px!important` ne pouvait pas gagner, ce n'est
  pas une déclaration concurrente mais une contrainte. Il faut neutraliser `min-height`.
  La cible tactile de 44px reste garantie par `@media(pointer:coarse)` — règle d'accessibilité
  volontaire (l.199), à respecter, pas à contourner.
- **PIÈGE — un calque décoratif n'est pas une modale.** `.v-scroll-progress` (4px,
  `pointer-events:none`, z-index:10001) faisait passer ma détection « modale ouverte » pour vraie et
  la citation ne paraissait jamais. Une vraie modale CAPTE le pointeur ET couvre l'écran : tester les
  trois conditions, pas seulement le z-index.
- **PIÈGE — `#vtWaFab` CHANGE de place en cours de route** : `bottom:18px` à 9s, `bottom:82px` à 10,5s
  (repositionné, pas seulement animé). Toute mesure ponctuelle est fausse quel que soit l'instant.
  La carte de citation maintient donc sa position tant qu'elle est affichée (700ms).
- Citations : 20 entrées (motivation + développement personnel, voix africaines), carte flottante
  13s toutes les 4 min, refermable pour la session, jamais par-dessus une modale, 12px au-dessus du
  bouton WhatsApp. Elles ne reprennent aucune hauteur.
- Sélecteur de langue enrichi : nom natif, sous-système, état courant, périmètre exact de la
  traduction, passerelle GCE. **Deux langues seulement** — celles réellement traduites ; en annoncer
  une troisième serait une promesse creuse.
- **Coordination multi-agents (2e fois)** : `app.js` et la coquille étaient édités en parallèle.
  Méthode qui a marché : construire le blob à committer = `git show HEAD:fichier` + MON seul
  changement, puis `git hash-object -w` + `git update-index --cacheinfo`. La copie de travail de
  l'autre session n'est jamais touchée. Ne JAMAIS faire `git commit <chemin>` ensuite : les chemins
  explicites recommittent la copie de travail et écrasent l'index.

---

## v1.15.5 — Thème clair / sombre (visiteur + admin)

- **Où** : `app.css` (couche finale, blocs 1 à 12 après le repère `THÈME CLAIR / SOMBRE — v1.15.5`),
  script inline dans le `<head>` de `VERITAS_v1.2.html`, bouton dans `.vlogin-btns` (+ `#sbTheme`
  dans la barre latérale admin, ligne du bloc `$("sbu").innerHTML`).
- **Pilotage** : `data-theme` sur `<html>`, posé par un script **inline et synchrone** — le mettre
  dans `app.js` (3,4 Mo, defer) produirait 2 s d'écran clair avant bascule. Trois états dans
  `localStorage.vrt_theme` : `auto` (défaut, suit l'OS) / `light` / `dark`. Clic = bascule épinglée,
  clic droit (ou appui long) = retour à `auto`. API : `vrtToggleTheme()`, `vrtThemeAuto()`,
  `vrtThemeCurrent()`, `vrtThemeSync()` (à rappeler après tout rendu qui recrée un bouton).
- **PIÈGE — il y a QUATRE systèmes de couleurs, pas trois.** Aux `--ds-*`, legacy et `--lx-*`
  s'ajoutent DEUX rampes de gris : `--neutral-*` (l.89) et `--n*/--o*/--vert-*/--viol-*` (l.6372,
  dupliquée dans `assets/veritas-pages.css`). Les rampes sont **retournées** bout à bout en sombre
  (50 ↔ 900), pas assombries : le code qui écrit `var(--n50)` en fond et `var(--n800)` en texte
  continue de marcher sans être touché. Basculer les seuls `--ds-*` ne change RIEN au visiteur :
  c'est la couche `--lx-*` (ivoire, `!important`) qui gagnait.
- **PIÈGE — `*/` dans un commentaire CSS.** Écrire `--n*/--o*` dans un commentaire ferme le
  commentaire et TUE le bloc suivant en silence. Symptôme : le token ne bascule pas alors que la
  règle est bien dans le fichier. Contrôle : le script d'équilibrage accolades/commentaires (voir
  plus bas) — il ne détecte pas ce cas, seule la mesure dans le navigateur l'a révélé.
- **PIÈGE — spécificité des chaînes `:not()`.** Chaque `:not([style*=…])` ajoute (0,1,0). Une règle
  « répare le texte sur fond or » à 4 sélecteurs perdait contre une règle « éclaircis le navy » à 5.
  Corriger par EXCLUSION dans la règle fautive, pas en empilant une règle de réparation.
- **~400 couleurs sont posées en ligne par `app.js`** : seules des règles `[style*="…"] !important`
  peuvent les battre. Toute nouvelle couleur doit passer par `var(--ink)`/`var(--sur)`, jamais par
  du hex en ligne, sinon elle restera claire en mode sombre.
- **Méthode de contrôle** (la seule fiable ici — relire le CSS ne suffit pas) : dans la console,
  calculer le rapport de contraste réel de chaque nœud de texte de `#vContent`, en SOMBRE puis en
  CLAIR, et ne garder que la différence — sinon on « corrige » des défauts qui existent déjà en
  clair. Deux prérequis : neutraliser les transitions (`*{transition:none!important}`) car
  `getComputedStyle` renvoie la valeur ANIMÉE, et remonter les ancêtres pour le fond effectif en
  abandonnant dès qu'un dégradé apparaît (non mesurable).
- **Résultat mesuré** : 0 écart propre au sombre sur les 7 sections visiteur (accueil, boutique,
  parents, e-learning, orientation, contact, jeux) ; 0 surface claire résiduelle sur l'accueil.
  Restent 12 défauts **préexistants en clair** (bouton WhatsApp blanc sur vert, badge OM, étoiles
  or sur blanc) — hors sujet, non touchés.
- Impression forcée en clair. Les images ne sont PAS inversées (un scan de manuel inversé est
  illisible) : seule la luminosité est calmée. Les logos restent sur pastille blanche.
