## Audit final avant production (19/08/2026) — v1.19.47

Troisième passage, en revérifiant tout par la mesure plutôt qu'en relisant les
rapports. Deux affirmations des sessions précédentes se sont révélées fausses.

**Ce qui était annoncé corrigé et l'est vraiment** : le tableau de bord est
atteignable sur desktop (≥900 px) pour les cinq rôles — `#VISITOR display:block
!important` a bien disparu ; `#connexion` affiche le formulaire ; le webhook
CamerPay est fail-closed (401 sans secret, 401 signature forgée) ; les fichiers
sensibles sont en 403 en production ; Ambassa est bien sur 143/143 pages
publiques ; `npm audit` est vide ; mobile 375 px sans débordement.

**Ce qui était annoncé corrigé et ne l'était pas** :

1. *« L'expiration d'abonnement s'applique réellement côté serveur. »* Faux.
   `vrt_account_active_plans` acceptait comme abonnement du compte toute ligne
   au propriétaire vide — ce qu'écrit `validerAbonnement` hors session visiteur,
   et toute saisie manuelle. Un seul orphelin actif = expiration inopérante pour
   TOUS les abonnés du plan. Mesuré : abonné expiré → 200 + les octets du
   fichier payant. Corrigé, et couvert par la section 9 du test (éprouvée par
   mutation : le code d'origine fait rougir).

2. *« Les vraies pages d'administration sont gardées. »* Vrai, mais insuffisant.
   Le repli `P[p]||pgDash` de `render()` servait le tableau de bord de la
   direction (recettes, impayés, masse salariale) à tout rôle non-élève/
   non-enseignant sur n'importe quelle route inconnue — 8 routes sur 14
   essayées avec un compte visiteur gratuit. Corrigé à deux niveaux.

**Autres correctifs** : la barre de filtres de la boutique filtre enfin (elle
repeignait ses pastilles depuis le début, et 3 catégories sur 7 ne pouvaient
rien montrer) ; « Manuels vendus NaN » sur le tableau de bord ; le jeton
d'administration n'est plus accepté en paramètre d'URL ; `data/` (base
synchronisée, données personnelles réelles) était versionnable sur un dépôt
PUBLIC ; le test des surfaces payantes vit maintenant DANS le workflow qui
déploie — il était dans un workflow séparé, rouge, et n'empêchait rien.

**Pièges retenus** :
- `open(fichier,'w')` tronque AVANT d'écrire : une erreur d'encodage en cours
  d'écriture a vidé `app.js` (3,4 Mo). Récupéré depuis le cache HTTP du
  navigateur (`fetch(url,{cache:'force-cache'})` → POST vers le serveur de dev).
  Toujours écrire dans un `.tmp` puis `os.replace`.
- Un banc de test mal formé ment dans les deux sens : mon premier banc utilisait
  `compte` au lieu de `accountId` et « prouvait » une faille inexistante. Lire
  la forme canonique dans le code AVANT de conclure.
- Une mutation qui ne fait pas rougir n'a peut-être rien muté : ma première
  mutation était neutre (deux gardes redondantes). Vérifier que la mutation
  change vraiment le comportement.

**Sentinelle v2.0 — le blocage est levé (19/08/2026).** Le chantier était
écarté parce qu'il fermait la porte du contenu payant. **Cause trouvée et
corrigée** : ce n'était pas le barème de suspicion, mais le profil
`telechargement` plafonné à 20 appels/minute. Or `secure_pdf.php` sert un
livret **une image par page** : l'élève était arrêté à la **page 21** d'un
livret qu'il avait payé. Le plafond passe à **120/min** — exactement ce que
`secure_pdf.php` s'accorde déjà (`vrt_rate_exceeded('spdf', 120)`) ; sa vraie
défense y est plus fine (pages DISTINCTES sur une heure glissante).
Mesuré, pas supposé : `tests/sentinelle.php` épingle le score des **9 formes
réelles de client** (Chrome, Safari iPhone, Capacitor, Opera Mini, service
worker, balise `<img>`…). **Aucune n'atteint 70**, le seuil de refus sec —
pire cas 55 (service worker sans Sec-Fetch ni Accept-Language), tandis que
`curl` atteint 125. Le 403 n'était donc jamais servi à un navigateur.
Ajouté depuis : **application serveur du refus des moissonneuses d'IA**
(`robots.txt` les interdisait déjà, mais rien ne l'appliquait), avec trois
listes séparées — entraînement / IA à la demande / aspirateurs SEO. La
deuxième est une **décision commerciale** : la vider rouvre VÉRITAS aux
réponses de ChatGPT et Perplexity.
58 contrôles au vert, éprouvés **par mutation** (une mutation restée verte a
révélé un test qui ne testait rien : l'exclusion `Bingbot(?!-AI)` était
couverte par accident, elle a désormais son test direct).
`tests/sentinelle.php` **tourne maintenant dans la CI**, au même titre que les
surfaces payantes. `api/_imagick_check.php` reste également dehors : sonde de diagnostic
qui publie sans authentification les versions d'Imagick et Ghostscript.

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

## Essais & mur d'abonnement (12/08/2026) — v1.16, tout le contenu devient payant
- **Demande Jacques** : « mets les différents contenus en mode payant sauf une ressource gratuite pour inciter à l'abonnement ; pour les œuvres au programme, seule l'analyse littéraire gratuite ; pour l'orientation, quelques essais puis payant ; **tout cela éditable dans le panneau admin** ».
- **Moteur `_pw*`** (fin d'app.js, ~230 l.) : `PAYWALL_DEFAUT` + `_pwCfg()` (fusion profonde avec `DB.paywall`, donc une surface ajoutée plus tard apparaît même chez un admin qui a déjà sauvé), `_pwLimit` (par tier, `-1`=illimité `0`=rien), `_pwGate(surface,label,item)`, `_pwEtat`, `_pwBadge`, `_pwModal`, `_pwEstGratuit`, `_pwLibreIds`, `_pwEssaisCatalogue`, `_pwResPedagoOk`. Tiers réutilisés de `_aiTier()` — **pas de 2e notion d'abonné**.
- **Décision de conception qui compte** : un essai ouvre **un ITEM**, pas un clic. Sans ça, consulter la fiche d'une œuvre puis sa carte mentale brûlait 2 essais pour un seul livre. Fenêtre : anonyme = à vie (localStorage), inscrit gratuit = semaine (`DB.userTrials[uid]`), payant/enseignant/admin = illimité.
- **Surfaces branchées** : œuvres (9 gardes — fiche, carte, contrôle, citations, techniques, QCM, corrigés, IA ; **`_showLittAnalyse` JAMAIS gardée**), jeux (`vLaunchJeu`), quiz (`startQuiz`), labo (`lancerLabo`, avant la relance premium), catalogue (`consulterGratuit` + rendu). Orientation = quotas IA (`orient`/`correct`) désormais surchargeables par `DB.paywall.quotasIA`, lus dans `_aiLimit`.
- **« Une seule ressource gratuite »** : on ne touche PAS au champ `item.gratuit` des fiches (l'admin l'édite déjà, l'écraser serait irréversible) — `_pwEstGratuit` filtre à l'affichage. Vérifié sur les vraies données : **10 contenus marqués gratuits → 1 seul réellement offert**.
- **🐞 Deux fuites trouvées en câblant** (invisibles à la lecture) : (1) `isUnlocked=…||(free2<2)` ouvrait **2 ressources payantes par catégorie à tout le monde**, codé en dur ; (2) `lancerRessourcePedago(key,false)` ouvrait le document **entier sans aucun contrôle** — une « Ressource BAC » payante était gratuite pour tous via `consulterGratuit` ET via les résultats de recherche. Garde posée **dans le lanceur** (entrée unique) pour couvrir tous les appelants. Corrigé aussi : `locked=!j.gratuit&&!SES` (jeux) — n'importe quel compte gratuit ouvrait tous les jeux premium.
- **Admin** : `pgPaywall()` — interrupteur général, tableau **5 surfaces × 7 profils** (35 champs), tableau **5 services IA × 7 profils** (35 champs), choix de la ressource offerte (select multiple sur le catalogue), + « remettre à zéro les essais consommés ». Entrées ajoutées aux 2 menus, au routeur (`paywall:pgPaywall`) et aux titres.
- **Vérifié** : `node --check` OK ; `scratchpad/pw_test.js` **44 assertions vertes sur le vrai code extrait d'app.js** — et surtout **rougi par 4 mutations** (portée par item retirée, plafond retiré, limitation de gratuits retirée, interrupteur ignoré). La mutation 4 est passée au vert du premier coup → le test était trop faible (1 seul appel ne peut pas dépasser une limite de 1), **corrigé** en appelant la garde 5 fois. Navigateur (serveur statique local) : menu d'œuvre affiche « GRATUIT » sur l'analyse et « 1 ESSAI » sur les 3 autres cartes ; analyse consomme 0 ; fiche consomme 1 ; carte de la même œuvre consomme 0 ; fiche d'une 2e œuvre → mur. Aller-retour admin testé (4 essais / 5 orientation IA / max=2 → effet réel + persistance). 0 erreur JS (les erreurs console sont les CORS habituels vers l'API de prod, PHP absent en local).
- **PAS touché, volontairement** : `corriges/` (56 pages SEO) et `outils/` (4 aimants) restent gratuits — c'est le tunnel d'acquisition documenté (cahier → QR → corrigés → abonnement) ; les verrouiller casserait le référencement et la promesse imprimée dans les manuels. **À trancher par Jacques.**
- **🔴 Trou d'argent trouvé en vérifiant la chaîne de paiement** : `_pwGate`/`_pwEtat` ne lisaient PAS `_aDroitUnitaire()`. Un élève ayant **acheté** une œuvre ou un labo à l'unité (tiroirs `unlockedOeuvres`/`unlockedLabos`) retrouvait le cadenas une fois ses essais épuisés — exactement le bug que la v1.2.4 avait déjà corrigé sur le catalogue. Le droit acheté prime maintenant, et ne consomme pas d'essai.
- **Chaîne de paiement vérifiée de bout en bout** : mur → `#elPlans` → `validerAbonnement` → `openPaymentModal({intent:'subscription',targetId,customerAccountId})` → `_payFinalizePaid` → `_payAutoActivate` case `subscription` (abonnement `statut:'Activé'` + `acc.plans.push`) → `_aiTier()` = pro → `_pwLimit` = -1 → **toutes les gardes s'ouvrent**. Prouvé au navigateur : free→pro fait passer œuvres 2→∞, catalogue 1→∞, orientation IA 2→10/j, labos/classes ouverts.
- **CamerPay est LIVE en prod** (`?action=config` : `configured:true, mode:"live", canCollect:true, selfService:true, webhookSecret:true`, opérateurs MTN/ORANGE/CARTE/PAYPAL). Les identifiants ont bien été posés sur LWS — la ligne « reste à faire côté serveur » du 10/08 est **soldée**.
- **DÉPLOYÉ (12/08)** : commit `222f9b9` sur `deploy/campay-securite`, cache-buster **1.18.9 → 1.19.0** (VERITAS_v1.2.html ×7 + sw.js), run 31634643018 ✓ (lint PHP+JS, minification, FTP LWS). Prod sert `app.js?v=1.19.0.042929` (2 542 Ko) contenant les 8 marqueurs du moteur ; SW aligné. **Vérifié en ligne sur veritas-school.com** : menu d'œuvre = analyse « GRATUIT » + 3 cartes « 1 ESSAI » ; analyse consomme 0 ; fiche consomme 1 ; carte+contrôle de la même œuvre consomment 0 ; 2ᵉ œuvre → mur « Votre essai offert est utilisé ». Jeux : 47 au catalogue dont 6 premium, 2 essais, le 3ᵉ bloqué et le 1ᵉʳ rejouable. Quiz : 1 essai, le 2ᵉ bloqué.
- **⚠️ Édition concurrente (leçon)** : un autre agent travaillait dans le même dossier et avait **déjà commité mon moteur** (`141aacd`) en y balayant `app.js` en entier. Son travail non commité (refonte CSS +896 l., déplacement de la vidéo d'accueil dans app.js/html) a été **laissé intact** : commit par **hunks sélectifs** (`git diff` → découpe Python par `@@` → `git apply --cached`), puis `node --check` **et** la suite de tests rejoués sur `git show :app.js` — la version stagée n'est pas la copie de travail. Sans cela j'aurais déployé un accueil référençant `lws-social-video`, classe CSS qui n'existe **ni dans HEAD ni en prod** → accueil cassé.
### Vitrine du catalogue ouverte au public (12/08, commit `f989dda`, v1.19.1)
- **Le problème** : `public_data.php` n'exposait que `elearning_plans`. Le visiteur non inscrit voyait **cinq tarifs devant une étagère vide** — le catalogue ne lui était jamais envoyé, donc le mur d'essais ne gardait rien. (Jacques : « oui » pour l'ouvrir.)
- **Ce qui sort maintenant** : `elearning_categories`, `elearning_contenus` (**liste blanche stricte** de 12 champs d'affichage) et `paywall`. Ce qui ne sort JAMAIS : `htmlContent`/`fichierData`/`fichier`/`idbKey` (la marchandise) et `blockedFor`/`unlockedFor` (**des identifiants de comptes**). Liste blanche et non liste noire : un champ ajouté demain à une fiche est invisible par défaut.
- `externalUrl` et `resPedago` **ouvrent réellement** le contenu → envoyés uniquement pour la ressource OFFERTE, calculée côté serveur par `vrt_pd_offertes()`, **miroir exact de `_pwLibreIds()`**. `paywall` voyage aussi, sinon la vitrine obéirait aux défauts du code et pas au panneau admin.
- `vrt_pd_coupe()` : `mb_substr` n'est pas garanti et une fatale ici viderait **toute** la réponse publique (école, ticker, partenaires compris).
- **🐞 Trouvé en testant** : `plan.avantages.forEach` n'était pas gardé → un plan créé sans avantages faisait tomber **toute** la section e-learning (plans + catalogue + quiz) sur un TypeError. Page blanche pour une liste à puces manquante, sur ce qui devient la vitrine principale. Gardé.
- **Méthode, PHP absent du poste** : parsé avec `node_modules/php-parser` (vrai analyseur syntaxique PHP, pas un compteur d'accolades) + `tests/php_balance_check.cjs`. La moitié client a été éprouvée en injectant une charge utile de la forme exacte du PHP via un `fetch` stubbé.
- **Vérifié EN PROD** (visiteur anonyme, localStorage vidé) : réponse 200, **44 Ko**, 82 fiches, 6 catégories ; audit de fuite sur les 8 champs interdits → **0 occurrence dans le corps de la réponse** ; champs exposés = les 12 prévus. Rendu : catégorie « Épreuves séquentielles » → **24 cartes, 23 verrouillées, 1 ruban « Gratuit »**, 5 cartes de plans, 0 erreur JS. Sur 18 fiches marquées gratuites en base, **une seule** est réellement offerte (« Épreuves Séq.1 — Mathématiques 3ème »).
- `DB.paywall` est **absent de la base de prod** (Jacques n'a pas encore enregistré depuis l'admin) → le client applique `PAYWALL_DEFAUT`. Dès qu'il enregistre une fois, ses réglages gouvernent la vitrine.
- Rappel : le mur est un garde-fou de vitrine ; le verrou d'un document payé reste serveur (`vrt_grant_entitlement`, `secure_pdf.php`).

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

## Chemins d'argent : payer sans rien recevoir (10/08) — commits e65ebd1 → a889d53
- **Le motif, constant sur 4 bugs** : `VERITAS_MONETISATION` est JUSTE, ce sont les **appelants
  qui se trompent d'`intent`**. Le paiement aboutit, l'argent rentre, et rien ne se débloque —
  aucune erreur, aucune trace. C'est indétectable sans dérouler la chaîne complète
  `bouton → openPaymentModal → _payFinalizePaid → droit écrit sur le compte`.
  1. `commanderContenu` ouvrait le paiement en `intent:'product'` — dont le `droit` est **null**.
     L'élève payait son contenu e-learning, rien ne s'ouvrait. → `intent:'contenu'` (unlockedContenus).
  2. Le modal « quota dépassé » proposait `_microBuyBtn('epreuve','ambassa')` : 200 FCFA contre un
     droit `micro_epreuve:ambassa`, une épreuve fantôme, zéro crédit IA. → `acheterCreditsIA()`,
     intent `ia` (unlockedIA), 500 FCFA / 20 questions.
  3. `MICRO_PRIX_DEFAULT` (épreuve 200, chapitre 500, fiche 300), `acheterUnite()`, l'intent
     `micro_epreuve`, le droit `unlockedUnits` et jusqu'au miroir serveur `_aDroitUnitaire()`
     existaient **entièrement** — mais n'étaient posés sur **aucune vitrine**. Fonctionnalité
     complète, invendable. Bouton « À l'unité » ajouté aux cartes d'épreuves premium.
  4. Une session parallèle a trouvé les six équivalents **côté serveur** (commit a889d53).
- **À faire** : un test qui parcourt chaque surface payante et vérifie qu'un droit est écrit après
  confirmation. Un audit de plus ne suffira pas — le symptôme est l'absence de symptôme.
- **Étiquettes** : « Commander » sur des boutons qui ouvrent le paiement. Le câblage était bon
  depuis toujours, seule l'étiquette mentait. Renommés « Payer ». Épargnés : les 6 « Commander »
  qui n'encaissent rien (titres de modale, lien WhatsApp, missions partenaires).
- **Un écran de moins avant de payer** : le parcours faisait fiche → formulaire → paiement, or
  l'étape ① du modal (« Vos coordonnées ») collecte DÉJÀ `payNom`, `payTel`, `payEmail` et le code
  promo (`promoInput` + `appliquerPromo`). L'écran intermédiaire ne faisait que dupliquer la
  saisie, juste avant l'encaissement. Retiré pour le produit numérique et le contenu e-learning.
  **CONSERVÉ pour le manuel papier** : lui seul collecte une **adresse de livraison**, que le modal
  ne demande nulle part — mais prérempli depuis le compte.

## Le cache-buster qui ne bustait rien (10/08)
- **Symptôme** : la prod renvoyait `_VRT_ASSET_VER = 1.15.3` alors que `app.js?v=` était à 1.15.8.
- **Ce n'était PAS le cache** : coquille fraîche, `no-cache` correct sur index.php, ETag à jour.
  C'était un **littéral saisi à la main** dans la coquille, resté figé pendant que le reste montait
  (les `sed` de bump cherchaient `1.15.6` puis `1.15.7` — jamais `1.15.3`).
- **Ce n'était pas cosmétique** : cette variable versionne les **chunks chargés à la demande**
  (`app.js` ~l.41938, `chunks/<nom>.js?v=`). Bloquée, chaque module paresseux était réclamé sous
  une vieille URL → servi depuis le cache après CHAQUE déploiement.
- **Correctif** : littéral **supprimé**, valeur DÉRIVÉE du `?v=` d'app.js (seule version que la CI
  vérifie déjà contre `sw.js`). Un seul endroit à bumper, dérive impossible. Preuve immédiate :
  une session parallèle a bumpé en 1.15.9 pendant le travail, `_VRT_ASSET_VER` a suivi seul.
- **Règle** : une version d'asset recopiée à la main dérive toujours. La dériver, ou la garder.

## Produit de test à 100 FCFA (10/08) — À RETIRER
- `btest100` en tête de `DB.books`, 100 FCFA, stock 999, pour éprouver MTN / Orange / CamerPay en
  réel sans engager 5 000 F par essai. **Visible de tous les visiteurs.**
- Inséré dans **`_migrateDB()`** et pas seulement dans `defaultDB()` : une base déjà créée ne
  rejoue jamais le seed — le produit n'apparaîtrait pas chez celui qui en a besoin. Idempotent
  (vérifié en rejouant la migration 2×).
- Retrait : `DB.books = DB.books.filter(b=>b.id!=='btest100'); DB._testProduitRetire = 1; save();`
  Le drapeau empêche la réinsertion au rechargement.

## Coordination multi-agents — ce qui s'est réellement passé (10/08)
- Une session parallèle travaillait dans le MÊME dossier et committait avec `-a` : **mes
  modifications ont été absorbées dans ses commits** (a889d53, d8b39c9…), une fois après avoir été
  **écrasées** (la tuile Ambassa en double est revenue).
- L'arbre bougeait entre deux commandes : `sw.js` est passé de 1.15.4 à 1.15.6 pendant la
  construction d'un commit, `_ACC_ESSENTIEL` a doublé de taille entre deux exécutions du même
  script. Un commit construit sur une lecture de HEAD vieille de 3 minutes est déjà faux.
- **Technique qui a marché** : rejouer SES SEULS changements sur `git show HEAD:fichier`, region par
  region délimitée par des marqueurs uniques, puis stager le blob via `git hash-object -w` +
  `git update-index --cacheinfo` — la copie de travail de l'autre agent reste intacte.
  ⚠️ `git commit <chemin>` commiterait la copie de TRAVAIL et écraserait ce blob : committer **sans
  argument de chemin**.
- **Garde-fou scopé** : un contrôle « la tuile doublon est-elle partie ? » en regex globale a donné
  un faux positif — une autre tuile Ambassa légitime vit dans le hub élève. Scoper le contrôle à la
  région éditée, jamais au fichier entier.

## Le test des surfaces payantes + le trou de tarification (10/08, suite)
- **LA faille, jamais vue par les onze audits précédents** : le serveur n'avait AUCUN prix de
  référence. `?action=init` reçoit `montant`, `intent` et `targetId` du NAVIGATEUR, et le jeton
  public d'initiation est servi à tous par `?action=config` (il le doit — sans lui personne ne
  peut payer). `camerpayApplyVerified` confrontait le montant encaissé au montant **déclaré**,
  jamais au tarif. Une requête forgée à **100 FCFA** (minimum CamerPay) sur l'abonnement annuel à
  25 000 traversait toute la chaîne : paiement réel, signature HMAC valide, montant « vérifié »,
  accès complet ouvert. Les QUATRE passerelles (CamerPay, CamPay, MTN, Orange) partageaient le
  défaut, puisqu'elles partagent `vrt_grant_entitlement`.
- **Correctif** : `vrt_prix_catalogue()` + `vrt_prix_plancher()` + `vrt_verifier_prix()` dans
  `_auth_lib.php`, appelés **une seule fois**, en tête de `vrt_grant_entitlement` — le point de
  passage unique des quatre passerelles. Le prix vient de la base, jamais de la requête.
  - Prix inconnu (objet hors catalogue, `product`, panier, cagnotte) → **on accorde et on
    journalise**. Refuser sur une ignorance ferait payer au client un trou de NOS données.
  - Remises : le plancher = catalogue − meilleure remise ACTIVE de `DB.promoCodes`, elle-même
    plafonnée par `VRT_REMISE_MAX_PCT` (50 %). Un code désactivé n'ouvre aucune tolérance.
  - Panier : chaque ligne repasse par la même porte. `montant_paye` est **réécrit par ligne** —
    sans cela il portait le total du panier et une ligne à 0 FCFA passait pour payée.
  - Refus = échec BRUYANT : `underpaid` + `grant_msg` dans le fichier d'état, visible au tableau
    de bord. L'inverse exact du symptôme d'origine.
- **`tests/paiements_entitlements.php` — le test qui manquait.** 54 contrôles : octroi réel de
  chaque surface (on LIT le droit en base, jamais `changed=true`), idempotence du rejeu, refus de
  sous-paiement, remises légitimes, panier ligne à ligne, commissions recalculées, et **parité
  client ↔ serveur lue dans app.js** (tout intent vendu a un miroir serveur ; tout intent passé au
  modal existe dans la table ; toute surface déclarée est couverte par le test).
  - **Éprouvé par mutation** — trois régressions injectées volontairement, trois rougissements :
    retirer `contenu` du tableau des tiroirs (= le bug n°1 de la session) → 4 échecs dont
    « aucun intent vendu n'est ignoré » ; désactiver le contrôle de prix → 10 échecs ; retirer le
    préfixe de `unlockedUnits` → 4 échecs. Un test vert qui n'a jamais rougi ne prouve rien.
  - Branché dans `.github/workflows/test.yml` (job `paiements`, avant le smoke) + `api/**` ajouté
    aux `paths`. PHP absent de la machine : exécuté ici via un PHP 8.2.33 portable (empreinte
    SHA-256 vérifiée contre le sha256sum officiel), dans le scratchpad, rien d'installé.
- **Deux bugs d'argent de plus, même motif (l'appelant se trompe, rien ne le signale)** :
  1. `validerCommandeContenu` ouvrait encore le paiement d'un contenu e-learning en
     `intent:'product'` (droit null) et **sans `customerAccountId`** — le neuvième du genre.
  2. **Le code promo n'atteignait jamais le montant encaissé.** Le montant part figé dans
     l'`onclick` du bouton, au rendu ; `appliquerPromo` ne touchait que du texte. Le client lisait
     « Nouveau total : 20 000 FCFA » et était débité de 25 000. Le montant remisé transite
     désormais par `_VRT_PAYX[ref].montantFinal`, relu par `_payInitCampay` avant l'envoi.
  3. Corollaire : `appliquerPromo` lit `DB.promoCodes` et non plus `window.VERITAS_PROMOS`.
     Cette dernière n'était **jamais persistée** (`_saveNewPromo` sans `save()`) : un code créé
     par l'admin disparaissait au rechargement pendant que l'écran affichait « ACTIF ». Et surtout
     le serveur ne connaît que `DB.promoCodes` — appliquer une remise qu'il ignore ferait refuser
     l'accès après un paiement accepté, soit pire que le bug corrigé.
- **Sécurité, corrections annexes** : `targetId`/`accountId` retirés de `?action=status` (non
  authentifiée, référence énumérable) sur MTN, Orange et CamPay — CamerPay l'avait déjà ;
  anti-amplification sur `?action=status` (re-vérification bornée à 1 / 4 s **par référence**, pas
  par IP : les adresses tournent, la référence non) ; compteurs de débit et quota journalier
  passés sous `flock` (lire puis écrire sans verrou laissait une rafale parallèle franchir le
  plafond autant de fois qu'elle avait de requêtes en vol).
- **À décider (pas un bug)** : `whatsapp_group` et `classroom` sont déclarés, implémentés des deux
  côtés… et n'ont **aucun bouton d'achat**. Même situation que les micro-achats avant leur mise en
  vitrine : fonctionnalité complète, invendable.

---

## v1.16.1 — Trois reprises de CamerPay + reprise des portes « matières »

### 1. Checklist d'activation (admin)
`_vrtChecklistSteps()` / `_checklistHTML()` en tête de `pgDash()`. Neuf étapes **dérivées de
`DB`**, jamais stockées : logo, identité, classe active, matières, 5 élèves, 1 enseignant,
coordonnées MoMo/OM, WhatsApp, premier encaissement. Disparaît seule à 100 %, masquable
(`DB.school._chkHide`, `_checklistShow()` pour revenir). **Ne pas confondre avec
`maybeShowOnboarding()`** : celui-là est une visite guidée visiteur en 8 écrans jouée une fois.

### 2. Tendances sur les cartes chiffrées
`_serieMensuelle()` → 12 mois glissants ; `_sparkline()` ; `_deltaHTML()` ; `_kpiTrend()`.
Posées sur Élèves inscrits, Recettes, Impayés.
- **Les entrées sans date exploitable sont IGNORÉES**, jamais rangées dans le mois courant :
  les y mettre gonflerait le dernier point, donc le delta.
- **Moins de 2 mois réels → aucun pourcentage.** Mois précédent à 0 → « nouveau », pas « +100 % ».
  Base vide → `_kpiTrend` rend une chaîne vide. C'est la règle « pas de données, pas d'indicateur »
  déjà appliquée à la preuve sociale.
- La courbe des recettes ne couvre que les frais de scolarité (les ventes de manuels ne sont pas
  datées en base) — c'est écrit sous la carte, pas masqué.
- **PIÈGE `_dFR`** : `new Date('02/10/2024')` lit le 10 FÉVRIER. Le format d'écriture du projet est
  fr-FR (`today()`), il faut découper à la main, sinon toutes les séries sont fausses.

### 3. Échéancier de scolarité (paiement fractionné)
`DB.echeanciers[]`, `mEcheancierNew()` / `mEcheanciers()` (bouton dans `pgPayments`),
`_echStudentHTML()` dans `pgMonPaiement`. C'est le « carnet quotidien » de CamerPay appliqué à
NOTRE facture : **aucun argent de tiers ne transite** — la tontine (djangui, carnet collectif,
association) a été écartée pour cette raison, pas par manque de temps.
- **Jonction obligatoire avec la compta** : `_echMarkPaid` crée un vrai `DB.payments` → recettes,
  impayés et reçus (`printRec`) fonctionnent sans une règle métier dupliquée. Sans cette jonction
  l'échéancier serait un silo qui ment au tableau de bord.
- Deux modes de découpe, et le reste ne tombe pas au même endroit : en `'unit'` (« 300 F/jour »)
  la mensualité est respectée à l'unité près et c'est le DERNIER versement qui rétrécit ; en `'nb'`
  (« en 10 fois ») c'est le PREMIER qui absorbe, pour que tous les suivants soient annoncés exacts.
- **PIÈGE corrigé — `setMonth` déborde** : 31/01 + 1 mois donnait le 3 mars. Butée en fin de mois
  ajoutée (31/01 → 28/02 → 31/03). Un échéancier ouvert le 31 sautait un mois sur deux.
- « En retard » se DÉDUIT de la date (`_echEtat`), jamais stocké : un statut figé est faux dès
  le lendemain.
- Vérifié par 11 cas de découpe : somme exacte, aucun versement ≤ 0, `nb` cohérent.

### 4. Portes « matières » remises d'aplomb
- La tuile **« Mes matières »** a quitté `_ACC_ESSENTIEL` : elle pointait vers `/niveaux/`, qui ne
  contient que des `francais-*.html`. Sous un titre promettant toutes les disciplines, l'élève venu
  pour ses maths ne trouvait que du français. Elle vit désormais **en tête de `/corriges/`**, où la
  promesse est exacte (et l'ancienne carte « Programmes par classe », enterrée dans « Autres
  ressources », a été retirée — deux portes identiques font douter que ce soit la même chose).
- « Coefficients & orientation » → **« Mes matières, coefficients et orientation »** : c'est
  `/parcours/` qui couvre réellement toutes les disciplines et leur poids.
- `/parcours/` n'avait **qu'un seul** appel à l'abonnement, au tiers de la page, pour douze
  sections. Ajout de trois relances **contextuelles** (`.vabo-inline`, posées juste après le
  passage qu'elles prolongent) + une relance **persistante** (`.vabo-sticky`) qui ne paraît qu'après
  40 % de défilement et se referme pour la session. Un bandeau qu'on ne peut pas fermer se fait
  ignorer, puis détester. Le défilement est lu dans un `rAF` (sinon la page saccade sur mobile
  d'entrée de gamme). 2 → 10 liens d'abonnement sur la page.

### Environnement
- **`.claude/launch.json` est partagé avec une autre session** qui y a figé le port 3000.
  Entrée `veritas-static-b` ajoutée à côté (port auto) plutôt que de modifier la sienne.
- Le volet navigateur de cette session rend un viewport 0×0 : ni capture, ni `requestAnimationFrame`,
  ni mesure de géométrie réelle. Ce qui reste vérifiable : le CSSOM (valeurs des règles), les
  fonctions pures, et les rapports de contraste calculés. **Le rendu visuel reste à contrôler à
  l'œil sur un vrai écran.**

## Déploiement du 11/08 (v1.16.2) — ce qui est en prod
- Déployé par **`gh workflow run deploy.yml --ref deploy/campay-securite`** (workflow_dispatch),
  PAS par un merge master : master reste 60 commits en arrière, c'est le mode opératoire établi.
- CI verte avant déploiement : job `paiements` (54/54 sur PHP 8.2 Linux) + smoke Playwright.
- Vérifié en prod avec cache-buster : coquille en `app.js?v=1.16.2`, marqueurs `unlockedBooks`,
  `_coordConnues`, `montantFinal` présents dans l'app.js servi, et `?action=config` répond
  `provider:camerpay, mode:LIVE, webhookSecret:true, selfService:true`.
- ⚠️ **CamerPay est passé en LIVE** (plus de sandbox) : le contrôle de prix arrive juste à temps —
  sans lui, les 100 FCFA contre un abonnement annuel étaient exploitables en argent réel.
  Corollaire : le produit de test `btest100` (100 FCFA, visible de tous) encaisse maintenant pour
  de vrai. Retrait conseillé — voir la commande dans la section « Produit de test ».
- **Manuel papier = lecture immédiate.** `vrt_ouvrir_lecture_immediate()` + miroir client :
  un achat `book` inscrit le livre dans `acc.unlockedBooks`, donc `secure_pdf.php` l'ouvre à la
  seconde (images page par page, filigranées, jamais le PDF). Le papier se retire ensuite.
  Sans effet si le livre n'a pas de `secureId`/`securePages`/`digital` — on ne promet pas une
  lecture qui n'existe pas. Exigé par le test, vérifié par mutation.
- **Tunnel raccourci** : les coordonnées étaient redemandées à vide alors que `confirmerAchat` les
  transmet déjà. Champs préremplis + étape ① sautée quand nom et téléphone sont connus (retour
  possible d'un clic). Vérifié au navigateur dans les deux cas (connu → ②, `SES=null` → ①).
- **Faux positif écarté** : le bandeau rouge « accès activé sous 24 h » vu en test venait d'un
  appel manuel à `openPaymentModal` sur le serveur local, sans configuration de passerelle. En
  prod, `_campayTile` existe et c'est le bandeau vert « activation immédiate » qui s'affiche.
  Le message des 24 h est déjà conditionnel depuis un commit antérieur.

## Passage en LIVE de CamerPay — trois pièges silencieux (11/08)
- **`CAMERPAY_MODE` ne pilote RIEN chez le fournisseur.** Réglage purement local : `camerpayApi()`
  n'ajoute que le Bearer, le payload d'initiation ne porte aucun champ de mode. Basculer sur
  « live » donne une sonde qui annonce `mode:live` pendant que CamerPay sert toujours ses pages
  `/sandbox/simulate/` — on croit encaisser, aucun franc n'arrive. **Seul le JETON décide** (test
  vs live) avec l'état du KYC. Le remplacer dans `api/payment_config.php` SUR LE SERVEUR (fichier
  gitignoré ET exclu de la copie CI : il se pose en FTP). Désormais détecté : log `[MODE_MISMATCH]`
  à l'initiation + phrase explicite dans `?action=config`.
- **Deux étages de webhook, à ne jamais confondre.** (a) Orange/MTN/Stripe/PayPal → CamerPay :
  `camerpay.biz/webhook/{camerpay,stripe,paypal}`, à déclarer chez les OPÉRATEURS ; (b) CamerPay →
  VÉRITAS : `veritas-school.com/api/payment_camerpay.php?action=notify`. Mettre (a) à la place de
  (b) couperait toute notification vers VÉRITAS.
- **Sandbox et live ont souvent DEUX secrets HMAC distincts.** Basculer sans reporter le nouveau
  casse tous les webhooks, et CamerPay affiche « votre serveur n'a pas pu être notifié » alors
  qu'il a parfaitement répondu — **401, il a REFUSÉ** (fail-closed). Nouveau `?action=hooklog`
  (admin) : N dernières lignes, compte par motif, UNE phrase de diagnostic, et une **empreinte
  SHA-256 salée (12 caractères) du secret posé** + la commande pour calculer la même sur le secret
  du tableau de bord — comparaison sans jamais exposer la valeur. Rappel : un webhook refusé ne
  perd AUCUN paiement (polling `?action=status` + réconciliation `?action=list`).
- **`customer_phone` : la doc se contredit.** Courriel officiel = `+237 6XX XXX XXX` « avec
  indicatif » ; exemple du tableau de bord = `699123456` nu. On envoie l'international, validé par
  une transaction réelle (CamerPay normalise et réaffiche 9 chiffres). Figé en commentaire : ne pas
  « aligner sur l'exemple » sans reproduire ce test.
- **Notre payload d'initiation est conforme** champ pour champ à l'exemple officiel. L'initiation
  n'est donc PAS en cause : il ne reste que le jeton et le secret.
- **PHP exécutable en local depuis le 11/08** : 8.2.33 portable (scratchpad, empreinte SHA-256
  vérifiée) + `php.ini` activant `mbstring` et `curl`. Sans `mbstring`, les libs `api/` plantent sur
  `mb_substr()`. Permet de LANCER le test au lieu d'attendre la CI.

## Bumper une version par remplacement GLOBAL casse des choses (11/08)
- `sed 's/1.17.0/1.17.1/g'` sur la coquille a modifié un **tracé SVG** : la chaîne de version se
  retrouve telle quelle dans les paramètres d'un arc du symbole `lc-shield`. Le bouclier s'est
  déformé, et rien ne le signalait — ni `node --check`, ni la CI, qui ne comparent que les versions
  d'assets entre elles. Corrigé par la session parallèle (commit 731eeae).
- **Règle** : cibler le motif qui porte la version, jamais le nombre nu.
  `sed "s/?v=$V/?v=$NV/g"` pour la coquille, `sed "s/veritas-v$V/veritas-v$NV/"` pour `sw.js`.
  Et **regarder le diff avant de committer** : un bump ne doit toucher que des lignes `?v=`.
- Le contrôle CI existant (coquille vs `sw.js`) ne protège de rien ici : les deux versions restent
  parfaitement alignées pendant que le SVG est cassé. Un garde-fou qui vérifie la cohérence de deux
  valeurs ne dit rien sur ce que le remplacement a détruit ailleurs.

## Le déploiement coûte ~7 minutes d'indisponibilité (11/08)
- Constaté **trois fois** : après chaque `workflow_dispatch`, le site renvoie 500 sur TOUT — y
  compris les pages statiques de 9 Ko, qui ne s'exécutent pas. Puis il revient seul (~400 s).
- Ce n'est donc ni `app.js`, ni le PHP : c'est le serveur pendant l'écriture FTP (`app.js` fait
  3,7 Mo, minifié juste avant l'envoi). Page d'erreur générique d'Hebergeur-Discount, sans détail.
- **À vérifier chez l'hébergeur** : le quota disque d'abord (un disque plein donne exactement ce
  symptôme). Piste d'accumulation trouvée et corrigée : `api/data/_backups/` recevait une copie
  COMPLÈTE de la base avant chaque octroi de droit, et **rien ne l'effaçait** — rotation à 40
  fichiers posée dans `vrt_grant_entitlement_to_file`.
- Si le quota est sain, le correctif est un déploiement en deux temps (envoi sous nom temporaire
  puis renommage atomique) dans `deploy.yml`. Tant que ce n'est pas fait : **éviter de déployer aux
  heures de vente**, et grouper les correctifs non urgents en un seul lot.

## Session « refonte de la vitrine publique » (13/08/2026)
- **Origine** : refonte livrée dans `Refonte site Véritas/` (index.html 245 Ko + support.js 69 Ko + 10 images).
  Décision de Jacques : la refonte devient **l'accueil public**, l'application reste sur `app.html`, et son
  design se propage aux autres pages.
- **Blocage trouvé à la lecture** : la maquette n'était pas une page HTML mais un export d'outil de design.
  `support.js` est un runtime `dc-runtime` qui exige **React 18 + ReactDOM + @babel/standalone** depuis
  unpkg.com — ~3 Mo, compilation JSX **dans le navigateur à chaque visite**, et contenu inexistant tant que
  Babel n'a pas tourné. Sur un site dont toute l'acquisition passe par le SEO, et pour un public en données
  mobiles, c'était inacceptable. Le balisage, lui, était du HTML réel (1 425 lignes, styles inline) piloté par
  quatre directives (`{{ }}`, `<sc-if>`, `<sc-for>`, `style-hover`).
- **Solution** : transpileur `tools/build_vitrine.js` (Node, sans dépendance). Il évalue la logique du
  composant pour en extraire les VRAIES données (aucune ressaisie à la main, donc aucune dérive), développe
  les directives, convertit les 65 `style-hover` en classes CSS, et écrit `vitrine.html` — **les 7 écrans
  pré-rendus dans le document**, donc indexables et lisibles sans JS. Le seul JS embarqué est
  `assets/vitrine.js` (~11 Ko) : navigation, onglets, thème, langue, tunnel de paiement.
  Régénérer : `node tools/build_vitrine.js "Refonte site Véritas/index.html" vitrine.html`.
- **Défauts de la maquette corrigés, mesurés et non estimés** :
  · mots tournants du titre — les 4 s'affichaient EN MÊME TEMPS (opacité pleine de 12 % à 88 % d'un cycle
    partagé) ; un quart de cycle chacun ;
  · **aucune media query** hors `prefers-reduced-motion` : à 390 px la page faisait 738 px de large.
    Couche responsive par sélecteur d'attribut (technique déjà employée par son thème sombre) → 390/390 ;
  · images : 5,99 Mo de PNG photographiques → **598 Ko en WebP** (−90 %), logo laissé en PNG (favicon) ;
  · domaine : la maquette pointait `www.veritas-school.com`, qui ne répond pas — canonical, og:url et les
    deux images corrigés ; og:image renvoyait une image de 1,75 Mo, remplacé par `og-image.jpg` ;
  · JSON-LD : exposait le Gmail personnel de Jacques → `contact@veritas-school.com`.
- **Données réelles injectées** : taux de réussite depuis `DB.statsVitrine` (app.js:700) — BEPC 100 %,
  Probatoire 69 %, BAC 61 % — **avec recalcul de l'angle de l'anneau** (la maquette affichait 300° sous un
  « __ % »). Les 22 ancres provisoires sont branchées sur les hash reconnus par `_vtHashRouter` (app.js) et
  les pages statiques ; garde-fou : la construction ÉCHOUE si le nombre d'ancres ne correspond plus.
- **Trous laissés volontairement (données inexistantes dans le dépôt)** : taux **GCE** (anneau vidé, pas
  laissé aux trois quarts plein), **3 témoignages** (`DB.temoignages` est vide et le code refuse déjà
  d'afficher sous 3 avis), **vidéo de témoignage** (un MP4 traînait dans le dossier livré, non identifié —
  Jacques le visionnera), et **#mentions / #cgv / #charte** : aucune page légale n'existe dans le dépôt.
- **Service** : `index.php` sert `vitrine.html` (repli sur `app.html` s'il manque) ; `deploy.yml` copie la
  vitrine vers `index.html` ET `vitrine.html`, et **n'écrase plus** `index.html` avec l'application.
  Retour arrière = une ligne dans `index.php` ; l'ancienne page reste servie telle quelle sur `/app.html`
  (pas de copie `index-ancien.html` : 440 Ko dupliqués pour un rollback déjà trivial).
- **Propagation du design** : le levier est `assets/veritas-pages.css`, partagé par les **64 pages
  statiques**. Trois polices y coexistaient (Poppins, Plus Jakarta Sans, Inter) — le commentaire justifiait
  Inter par « la même famille que l'application », ce qui n'était plus vrai depuis que l'app est passée à
  Poppins : la règle produisait l'écart qu'elle prétendait corriger. Unifié sur Poppins (déjà chargée, zéro
  requête ajoutée) + jetons de rayons/ombres/transition de la vitrine. **Largeur de conteneur volontairement
  NON reprise** : 1170 px sert une grille marketing, ces pages portent de la prose.
- **Vérifié dans le navigateur** (serveur statique local) : 7 écrans atteignables et exclusifs, 30 images
  chargées, 0 débordement à 390/753/1000/1265 px, burger sous 1000 px, thème sombre aller-retour, citations,
  traducteur FR/EN aller-retour, et tunnel de paiement recalculé (3 articles + Yaoundé = 17 500 F, formulaire
  carte à 4 champs). `node --check` OK sur `assets/vitrine.js` et `tools/build_vitrine.js`.
- **Reste à faire** : taux GCE, témoignages, vidéo, pages légales ; `payer()` est encore inerte — le tunnel
  affiche mais n'encaisse pas, il faudra le brancher sur `openPaymentModal` / CamerPay.

## Audit « la refonte a cassé le site » (14/08/2026)

### Le vrai bug de la « double interface » — deux écrans plein écran empilés
`#LS` (connexion, z-index 9999) et `#VISITOR` (espace visiteur, 9000) étaient affichés
**en même temps**, tous deux en 1280×840 : `showLogin()` montre `#LS`, et **rien ne le
refermait**. Dès qu'un visiteur avait ouvert « Connexion », toute navigation continuait
d'écrire dans `#vContent`… sous un panneau opaque. Symptôme rapporté : « je clique et la
page ne change pas », « il y a deux sites superposés ». Corrigé dans `vShowSec` — le seul
passage obligé de la navigation visiteur — et **seulement si `#LS` est réellement visible**,
pour ne pas éjecter un utilisateur connecté. Reproduit avant, vérifié après.

### Les quatre portes d'entrée étaient avalées au premier clic
« Connexion » ×2, « Mon compte » et la loupe pointaient vers `app.html` **nu**. Or la garde
anti-double-accueil renvoie à « / » tout visiteur anonyme demandant /app.html sans ancre ni
paramètre : premier clic → retour à la vitrine, second clic → ça marche (le drapeau de
session est posé). Intermittent en apparence, déterministe en fait.
→ `ANCRES` pointe désormais sur `app.html#connexion` / `#inscription`, et `_vtHashRouter`
gagne les routes `connexion`, `compte`, `inscription`. La loupe va sur `/corriges/`, avec
son intitulé accessible corrigé.

### Le retour de paiement n'était lu par personne
`camerpayReturnUrl()` renvoie `<site>/#paiement?ref=…`. Le lecteur (`_payResumeFromHash`)
vit dans **app.js** ; depuis que « / » sert la vitrine, le payeur revenait sur l'accueil
sans un mot. **Tous** les paiements du site, pas seulement ceux du panier. Rejoué en
autonome dans `assets/vitrine.js` (polling `?action=status`, panneau d'issue, hash nettoyé).

### Le tunnel demandait un numéro de carte et n'envoyait rien
1. « Numéro de carte » et « Cryptogramme » étaient de vrais `<input>` sur une page non
   certifiée — CamerPay est une passerelle par REDIRECTION, la carte se saisit chez lui.
2. Aucun champ ne portait d'identifiant : `clientNom`/`clientTel` partaient **vides**.
3. On facturait 1 000 / 2 500 F de livraison sans jamais demander l'adresse.
→ Champs carte retirés, nom/téléphone/e-mail/adresse identifiés et envoyés, validation
(numéro camerounais, confirmation, adresse si livraison) avec message sous le champ fautif.
**Piège** : le tunnel est PRÉ-RENDU avec les champs de la maquette (sans id) — `majPaiement()`
est donc appelé au démarrage, sinon le payeur remplit des champs que personne ne lit.

### Ce qui reste figé un an : un asset sans `?v=`
`build_corriges.py` émettait `/assets/veritas-pages.css` **sans** cache-buster, et supprimait
le `<link>` Google Fonts. `.htaccess` sert les CSS en `immutable, max-age=1 an` : l'étape CI
« Aligner les cache-busters » ne réécrit que les URLs qui portent DÉJÀ `?v=`. Les 56 pages de
corrigés étaient donc figées, et demandaient Poppins sans jamais la télécharger.
→ Générateur corrigé (version lue dans la coquille) + **garde-fou CI** qui refuse de déployer
tout `/assets/*.css|js` appelé sans `?v=`.

### Typographie : mesurée, pas estimée
`/app.html#partenariat` avant : **68 % du texte sous 15 px**, médiane 13, minimum 11.
Après `assets/veritas-refonte-app.css` (dernière feuille de la coquille, identifiant doublé) :
**6 %**, médiane 15,5, minimum 13,5. Les tailles posées EN LIGNE par le rendu JS ne sont
atteignables que par sélecteur d'attribut (`[style*="font-size:12px"]`) — même procédé que le
thème sombre. Corrigés : 8 % → 1 % après huit règles ciblées, relevées une par une dans le DOM.

### Accueil : les mêmes chiffres trois fois
3 854 / 56 / 134 / 7 affichés **trois fois**, la ressource offerte proposée trois fois, une
seconde accroche complète, un palmarès et un panneau de gamification aux données **inventées**
(« Série de 12 jours », « Terminale A4 · Douala 2 480 pts », « abonnement le plus choisi »), et
trois témoignages vides affichant « témoignage à recueillir ». 48 Ko retirés, en huit
suppressions nommées dans le générateur. Bloc des publics remonté juste après l'accroche,
carte **Partenaires** ajoutée (4ᵉ public) + onglet dans la barre ; la section « Travailler avec
VÉRITAS » du bas, devenue son doublon, est retirée.

### Répétitions : on ne dénigre pas un service qu'on rend
« Un répétiteur coûte 25 000 F et rate des séances », « Moins cher qu'un répétiteur »,
« 25× moins qu'un répétiteur » — alors que le centre PROPOSE les répétitions et
l'accompagnement à domicile. Trois formulations remplacées par la complémentarité.

### Pièges d'outillage rencontrés
- **`tools/build_vitrine.js` prend `Refonte VERITAS.dc.html`, PAS `index.html`.** La commande
  documentée dans la session précédente pointait `index.html` → sortie de 394 Ko au lieu de
  431, tout le travail des trois derniers commits perdu, sans erreur.
- **Les sept ÉCRANS sont des `<section>`** : un découpage au premier niveau renvoie l'écran
  entier. « Supprimer la frise de chiffres » a effacé 164 Ko avant que le garde-fou de taille
  (> 60 Ko = c'est un écran, pas un bloc) ne soit posé.
- **`tests/static_server.cjs` ne reproduisait pas la production** : « / » servait la coquille
  et /app.html répondait 404. On ne pouvait tester en local ni la vitrine à sa vraie adresse,
  ni la garde anti-double-accueil, ni un seul lien vers l'application.
- **Le service worker sert les scripts par URL** : sans bump de version, `node --check` passe,
  le fichier est modifié sur le disque, et le navigateur exécute toujours l'ancien code.
  Purger SW + caches avant chaque vérification, ou bumper.

### Fait aussi
- Pages légales créées (`legal/mentions-legales.html`, `cgv.html`, `charte-pedagogique.html`) —
  `#mentions`, `#cgv`, `#charte` étaient des ancres mortes. Identité de la **personne morale**
  d'après le RCCM `CM-DLA-03-2026-B12-00729` et le NIU `M072618875274L` fournis le 14/08 ;
  **aucun nom d'associé, aucune CNI, aucune date de naissance** (consigne explicite).
  Ajoutées à `deploy.yml` avec échec bruyant si moins de 3 pages.
- Vitrine : CSP stricte (la page qui encaisse était la seule sans politique), `<link manifest>`,
  enregistrement du service worker, `referrer` policy.
- Menu « Plus » : 4 → **27 entrées** en 3 groupes, dérivées d'un modèle unique (bureau + mobile).
  « Corrigés des cahiers » pointait vers l'écran e-learning.
- Barre de recherche dans les 56 pages de corrigés (numéro d'exercice ou mot de leçon, sans
  accents, `?q=` depuis le hub). Script EN LIGNE : 18 des 128 pages statiques ne chargent aucun JS.
- Effets et animations sur les pages secondaires via `animation-timeline: view()` — zéro JS,
  `@supports` en garde : on ne cache jamais un contenu en pariant qu'un script le révélera.
- Panneau bleu de l'écran de connexion retiré, carte recentrée, champs à 16 px (sous 16 px iOS
  zoome au focus).

### Non fait / à décider
- **Rien n'est commité ni déployé.** `master` reste en arrière ; le déploiement se fait par
  `gh workflow run deploy.yml --ref deploy/campay-securite`.
- Les 64 fichiers de `corriges/` ont été régénérés alors qu'une **autre session** les avait déjà
  modifiés dans l'arbre de travail. Le générateur est le leur ; seul l'en-tête a été corrigé.
- `assets/temoignage.mp4` toujours absent : la section témoignage vidéo se retire d'elle-même et
  reviendra le jour où le fichier sera déposé.
- Taux GCE toujours vide (donnée inexistante), témoignages toujours absents (aucun avis réel).

## Déployé le 14/08 (v1.19.10) — ce qui est en prod
- Deux exécutions de `deploy.yml` sur `deploy/campay-securite` (workflow_dispatch),
  vertes toutes les deux : 1m37s et ~1m30s, sans indisponibilité observée cette fois.
- Cache-busters réalignés par la CI sur **1.19.10.339083** (version + empreinte du contenu)
  dans **160 fichiers**, et le nouveau garde-fou confirme : « Aucun asset servi sans ?v= ».
- Vérifié **sur la production**, pas sur le dépôt : accueil 397 Ko, `/app.html`, les trois
  pages de `legal/`, `/corriges/` et une page de séquence, `assets/veritas-refonte-app.css`,
  `?action=config`. Menu Plus à 27 entrées, onglet Partenaires, CGV branchées, CSP présente,
  chiffres inventés et témoignages vides absents, dénigrement des répétiteurs absent.
- **Un défaut n'a été vu QUE sur la production** : le partage Facebook renvoyait encore vers
  `veritas-centre.cm`. La correction ne portait que sur le corps de la page ; les boutons de
  partage sont une région DYNAMIQUE, leurs URLs vivent dans `VRT_DATA`. Règle : après un
  déploiement, relire ce que le visiteur reçoit — le JSON sérialisé compris, pas seulement
  le balisage. Corrigé et redéployé.

## Session « câblage et charte » (14/08/2026) — v1.19.11, déployée

### La « double interface » ne venait ni du style ni du service de « / »
Trois portes rouvraient l'ancienne interface, et aucune n'était un problème de CSS :
- **`app.html#presentation`**, dans le menu Plus. Vérifié dans `vShowSec` puis en production :
  cette ancre ne rend pas une page « qui nous sommes », elle rend **l'accueil de l'application**
  (6 223 caractères : pastille de marque, promesse, quatre portes de rôle, vidéo, actualités).
  → pointe désormais sur `decouvrir/`.
- **La loupe** n'a jamais cherché : elle ouvrait `app.html`, puis `/corriges/` après un premier
  correctif — c'était encore de la navigation. `mRecherche()` EXISTE et fait une vraie recherche de
  site ; elle était enterrée derrière le panneau « Naviguer ». Rendue adressable : `#recherche`.
- **Le calendrier scolaire** : même cas, `showCalendrier()` n'existait que comme tuile de l'accueil
  connecté. Rendu adressable : `#calendrier`.
> Règle : avant de rebrancher un lien, OUVRIR sa destination. Un intitulé juste ne garantit rien.

### Un composant peut exister en DEUX exemplaires — coquille ET maquette
La bande utilitaire a été retirée de `VERITAS_v1.2.html`… sans que rien ne change à l'écran : la
vitrine a **sa propre copie**, issue de la maquette. C'est celle-là que voit un visiteur sur « / ».
> Avant de retirer un élément visible sur la vitrine, chercher le motif dans **les deux** sources.

### Un `<a>` non fermé rendait un tiers de la page orange
Le bloc calendrier s'affichait sur un aplat #C24E00. L'ancêtre coupable : le bouton « Voir les
9 formules », dont la conversion `<button>` → `<a>` réécrivait l'ouvrant et laissait le `</button>`.
Le rattrapage visait un motif ancré en fin de chaîne qui ne correspondait pas — échec **silencieux**.
Et la garde ne pouvait pas le voir : elle cherchait le texte d'origine, bel et bien disparu — elle
**vérifiait la moitié faite du travail**.
- Contrôle d'équilibre `<a>/<button>/<section>/<ul>` ajouté en fin de construction ; il a
  immédiatement trouvé un second défaut, hérité de l'export de la maquette (7 `<ul>` / 8 `</ul>`).
- Les fermetures orphelines sont retirées à la construction, pas dans la maquette : ce fichier
  n'est pas à nous et peut être remplacé.
> Une balise ouverte ne produit AUCUNE erreur. Il faut une machine pour la voir.

### Régression de plancher typographique (la mienne)
Le plancher posé au déploiement précédent agrandissait aussi les intitulés de navigation, qui
vivent dans une piste de largeur fixe en `overflow:hidden` : les sept étaient coupés en production
(« E-Lear », « Corrig »). `E-Learning` réclamait 132 px, en recevait 88. On ne rétrécit pas le
texte : la piste devient défilable et les liens ne se compriment plus.
> Un plancher typographique global doit exempter toute piste à largeur contrainte.

### Vitrine : deux blocs retirés, un bloc utile à la place
Retirés (captures mobiles) : la bande « corrigés par niveau » (sept cartes empilées pour un nombre,
déjà atteignables par le menu et le pied de page) et la grille « Ce que chaque plan débloque »
(cinq colonnes disloquées sous 420 px). Remplacés par les **six dates clés** de l'année, lues à la
source dans `CALENDRIER_SCOLAIRE` (arrêté conjoint MINEDUB/MINESEC) plutôt que recopiées, prochaine
échéance mise en avant au chargement, plus un lien vers le calendrier complet ; et les
**actualités MINESEC / bourses / concours** servies par `api/news_proxy.php`, qui existait déjà.
Le bloc d'actualités naît masqué et ne s'ouvre que si le flux renvoie un titre.

### Deux pièges d'extraction, tous deux muets
- Compter les accolades pour lire `CALENDRIER_SCOLAIRE` s'arrêtait au milieu du tableau : les
  commentaires du calendrier contiennent des **apostrophes françaises** (« fixées par l'arrêté »)
  que le compteur lisait comme des ouvertures de chaîne. → retirer les commentaires AVANT de compter.
- Le filtre des jours de semaine mordait sur le « Mar » de « **Mar**s » : « 25 Mars 2027 » perdait
  sa date pivot. → exiger le point (`Lun.`, `Ven.`), que les mois n'ont jamais.

### `node --check` ne voit pas un renommage incomplet
`marquerSequence()` renommée, son appel non : ReferenceError au démarrage qui aurait coupé tout ce
qui suit dans `demarrer()` (anneaux, actualités, thème, écouteurs). Trouvé par un contrôle de
résolution des 39 fonctions du fichier — commentaires et chaînes retirés d'abord, sinon la prose
française produit des dizaines de faux positifs.

### PDF sécurisé — la chaîne est bonne, le contenu manque
`api/secure_pdf.php` répond, la recherche du document fonctionne, la porte tient
(`?meta=1&id=b2` → `hasAccess:false` hors session, bail signé, budget horaire, mur d'aperçu).
Mais **`prepared:false` partout** : aucun livre n'a ses images de pages dans
`uploads/protected/books/<secureId>/`. Un acheteur ouvrirait un lecteur vide. Ce n'est pas un
correctif de code — il faut déposer les pages. `b1` et `btest100` ne sont plus dans le catalogue
serveur ; `b2` (« Français Tle A », 320 pages) y est.
Accessoire : `/uploads/protected/` répond **500** au lieu de 403 — l'accès est bien refusé, mais
une directive du `.htaccess` n'est pas digérée par l'hébergeur. Non corrigé : `.htaccess` est
fragile ici et a déjà coûté une panne totale.

## Suppression de la double interface (15/08/2026) — v1.19.15, déployée

Cinq écrans publics existaient **en double** depuis que « / » sert la vitrine :
`presentation`, `tarifs`, `boutique`, `elearning`, `parents`. Ils ne sont plus une
destination publique — `_renvoyerVersVitrine()` (app.js, en tête de `vShowSec`) envoie le
visiteur ANONYME sur l'écran correspondant de la vitrine. Quatre garde-fous :
- **seulement si personne n'est connecté** — un élève ou un enseignant au travail garde sa
  boutique et son e-learning ;
- **seulement depuis `/app.html`** — sinon rebond infini le jour où `index.php` retombe sur
  l'application ;
- `replace` et non `assign` ;
- **`presentation` est VOLONTAIREMENT hors de la table.** L'accueil visiteur se re-rend
  plusieurs fois sans passer le marqueur d'amorçage : sa redirection vers « / » gagnait la
  course contre celle de `#tarifs`, et le visiteur atterrissait sur l'accueil. Vérifié après
  correction : `/app.html#tarifs` → `/#tarifs`, écran `tarifs` affiché.

> **Règle** : `initVisitor()` rend « presentation » par défaut **avec un bouton** — on ne peut
> pas distinguer l'amorçage d'un clic par les arguments. Tout comportement conditionnel dans
> `vShowSec` a besoin d'un marqueur explicite (3ᵉ argument), et doit encore résister aux
> re-rendus qui, eux, ne le passent pas.

### Comptes admin : « Identifiants incorrects » mentait
`DB.admins` / `DB.superAdmin` ne vivent que dans localStorage. Sur un appareil neuf, c'est le
jeu de démonstration (`directeur`, `secretaire`) — le vrai compte est côté serveur. Le message
d'erreur envoyait donc chercher l'erreur là où elle n'est pas, et `cloudRestoreDB()` exige
`isSA()` : il fallait être connecté pour récupérer de quoi se connecter. Une porte de
récupération est posée AVANT toute session (clé de synchronisation), et ne rapatrie **que les
listes de comptes**.

### Justification : le point d'arrêt sur la largeur d'écran ne protège rien
Déployée sur tout le texte, elle a disloqué les panneaux d'abonnement — quatre colonnes de
250 px sur un écran large. Une ligne de moins de ~45 caractères ne se justifie pas. Exclusion
par CONTENEUR (grilles, cartes, panneaux), pas par largeur de fenêtre.

### Reste à faire (demandé, non fait)
Inscription à 100 FCFA câblée au paiement · vérification du mur d'abonnement existant (`_pw*`,
`pgPaywall`) · extrait du jour à agrandir et relier à l'IA · panneau Actualités à réduire et
colorer (icônes, puces) · onglet « Répétitions » vide · FAQ vue dans e-learning (localisée dans
`tarifs` côté code, cause réelle non trouvée) · **refonte de l'habillage du Dashboard et des
espaces connectés**, qui restent sur l'ancienne charte.

## Mur d'abonnement vérifié + socle « inscription 100 F » (15/08/2026)

### Mur d'abonnement : RIEN À ÉCRIRE, il fonctionne
Vérifié **en production**, pas relu : `_pwCfg().actif = true`, les 5 surfaces `on`
(oeuvres, jeux, quiz, labo, elearning), profil `anon` détecté, œuvres = 1 essai, jeux = 2.
Séquence réelle sur `_pwGate('jeux',…)` : `ouvert → ouvert → BLOQUÉ → BLOQUÉ`, et rejouer un
item déjà entamé reste gratuit (règle voulue). `pgPaywall` est câblée au routeur admin.
> Ne pas réécrire ce moteur. Il est en place et il mord.

### Inscription à 100 FCFA — socle serveur posé, client à faire
`api/_auth_lib.php`, deux ajouts, **inertes tant qu'aucun client n'envoie l'intent** :
- **prix de référence** (`vrt_prix_catalogue`) : sans lui la fonction rend `null`, et son
  contrat est que `null` = tarif inconnu = **contrôle de prix sauté**. L'inscription se serait
  achetée à 1 franc. Réglable en base : `DB.tarifs.inscription`, défaut 100 ;
- **octroi à part** (`vrt_grant_entitlement`) : ce n'est pas un « tiroir » (liste de droits)
  mais un changement d'ÉTAT du compte (`statut → actif` + `inscriptionPayee`). Idempotent.

5 contrôles ajoutés (54 → **59**), **éprouvés par mutation** :
retirer le prix → 2 rouges dont « 1 FCFA → REFUSÉE » qui rapporte `statut=actif` ;
désactiver l'idempotence → 1 rouge. Restauration : 59/59, et vert en CI sur PHP 8.2 Linux.

**Reste côté client** : créer le compte en `en_attente_paiement`, lancer le paiement de
100 FCFA avec l'`accountId`, sonder `?action=status`, activer à la confirmation, et une vue
admin des inscriptions en attente.

## Accueil de l'application supprimé (15/08/2026) — v1.19.16
Le chemin de retour vers l'ancienne page d'accueil était **le bouton de marque de la barre**,
qui appelait `vShowSec('presentation')`. Il est devenu un vrai `<a href="/">` (vérifié dans la
coquille servie), et `presentation` est réintégré à `_VITRINE_COUVRE`.

La course qui l'en avait fait sortir est réglée par une **fenêtre de temps** et non par un
booléen : `window._vBootJusqua` = 3 s après l'amorçage, pendant lesquelles aucune redirection ne
part. Un booléen d'argument ne pouvait pas suffire — les re-rendus déclenchés par le retour de
`public_data.php` ne le passent pas. Vérifié : `/app.html#epreuves` survit, `/app.html#tarifs`
part sur `/#tarifs`.

### `#epreuves` n'affichait pas les épreuves — RÉSOLU (v1.19.17)
Le coupable était bien un rendu postérieur : l'accueil de l'application. Son bloc « Essentiel »
porte un bouton vers `pour-eleve`, et le re-rendu de l'accueil (déclenché par le retour de
`public_data.php`) écrasait la section placée par le routeur.

**La correction n'est pas une redirection mais une SUPPRESSION.** Première tentative :
rediriger `presentation` avec une fenêtre de 3 s pour épargner l'amorçage — mauvaise, et
vérifiée comme telle : passé la fenêtre, un visiteur tranquille sur `/app.html?ref=…` était
éjecté vers la vitrine. *Une minuterie ne règle pas une course, elle la déplace.*

Règle déterministe retenue, dans `initVisitor` :
- **pas d'ancre** → départ vers la vitrine, requête conservée (parrainage, retour de paiement) ;
- **une ancre** → le routeur place la section, et **rien** n'est rendu en attendant. Afficher
  l'accueil « en attendant » revenait exactement à le garder ;
- filet : si `#vContent` est resté VIDE après 1,6 s, départ vers la vitrine. Il ne peut jamais
  concurrencer un rendu réussi, puisqu'il ne se déclenche que sur le vide.

Vérifié en production : `#epreuves` → « Épreuves & Annales BEPC, Probatoire, BAC » (8 925 car.),
et `#partenariat`, `#cagnotte`, `#trophees`, `#evaluations`, `#verifier-certificat` rendent tous
leur propre section. Le bouton de marque est un `<a href="/">`.

## v1.19.17 (15/08) — le transpileur décidait à la place de la maquette

- **« Répétitions », l'onglet muet.** `for (let t = 1; t <= 4; t++)` dans
  `build_vitrine.js` : la maquette propose CINQ onglets (variantes indexées 1→5) et la
  cinquième n'était jamais extraite. Ce sont de vraies prestations avec leurs tarifs —
  répétitions au centre (dès 15 000 F/mois) et à domicile (dès 25 000 F/mois), rattrapage,
  préparation aux examens.
  > **Erreur de jugement à retenir** : j'ai d'abord RETIRÉ l'onglet en concluant qu'il n'avait
  > rien à montrer, et en invoquant la règle de marque sur le mot « répétition ». Jacques a
  > corrigé : les répétitions font partie des activités, un lien existait déjà côté parents.
  > **Un vide côté sortie ne prouve pas un vide côté source** — vérifier la MAQUETTE avant de
  > conclure qu'un contenu n'existe pas. Le nombre d'onglets se lit maintenant, et la
  > construction ÉCHOUE si un onglet n'a pas de cartes.

- **« Questions fréquentes » sur tous les écrans.** Chaîne d'ancêtres mesurée au navigateur :
  `h2 < div < section < body` — la section est un FRÈRE des écrans. Tentative écartée :
  retirer les `</div>` orphelins rééquilibre le compte, déplace l'imbrication, et ne règle
  rien. **Un compte de balises équilibré ne dit rien de l'arborescence réelle.**
  Retenu : déclarer l'appartenance (`data-vp="tarifs"` sur la section orpheline) — `aller()`
  bascule TOUTES les balises portant le data-vp demandé. Vérifié dans les deux sens en prod.

- Le déséquilibre `<div>` de la maquette (332/334) est signalé, non bloquant.

### Reste à faire
Inscription 100 F : **serveur prêt** (prix de référence + octroi idempotent dans
`_auth_lib.php`, inerte tant que le client n'envoie pas `intent:'inscription'`), **client à
écrire**. Puis : extrait du jour à agrandir et relier à l'IA · panneau Actualités à réduire et
colorer · habillage du Dashboard et des espaces connectés · `#epreuves` qui rend `pour-eleve`.

## Audit complet (15/08/2026) — v1.19.25, déployé et vérifié en production

**Le tableau de bord était inatteignable, et la synchro serveur muette.** Une seule
cause : `SES` n'était jamais réhydraté depuis `sessionStorage`, et `go2SES` —
porte d'entrée admin/enseignant/élève — n'y écrivait rien. Or `save()` et
`_fbFetch` y lisent le droit de synchroniser : `_fbFetch` court-circuitait
`/api/db.php` en fabriquant une **fausse réponse 200 {}**. Le voyant passait au
vert et rien ne partait — notes, paiements et élèves ne vivaient que dans le
localStorage du navigateur. Corrigé, avec échéance d'origine conservée (recharger
ne prolonge plus une session de 4 h).

**Les liens profonds rebondissaient.** Le filet de `_plusDAccueilIci` repartait
sur la vitrine quand `#vContent` était vide 1,6 s après l'amorçage. Or les écrans
de `FONCTIONS` (recherche, calendrier, connexion, compte, inscription) ouvrent une
MODALE et ne remplissent jamais `#vContent` : leur succès passait pour un échec.
Garde ajoutée sur `_vCurrentSec`, et routage rejoué APRÈS le rendu du portail
(l'ordre, pas une minuterie de plus).

### Trois leçons de méthode, chèrement acquises
1. **Ne jamais juger un thème sur le premier `:root`.** `veritas-pages.css` porte
   déjà un remappage LWS en fin de feuille : les 69 pages rendaient DÉJÀ dans le
   système de la refonte. J'ai annoncé « 133 pages sur l'ancien thème » — chiffre
   gonflé par `.claude/worktrees/`, non déployé. Voir la mémoire
   `feedback_veritas_pages_deja_remappe`.
2. **Le contraste ne se mesure PAS sur le `background-color` des ancêtres.** Un
   panneau à `background-image` seul fait remonter le scan jusqu'au `<body>` blanc :
   j'ai annoncé 5-6 textes illisibles, il n'y en avait qu'UN (`h2.vrtc-t`, #1E499B
   sur dégradé #142554→#1E3A8A = 1,22:1 → blanc, 10,36:1).
3. **Un « bouton mort » se prouve, il ne se déduit pas d'un grep.** 4 actions
   annoncées mortes étaient définies plus loin dans le fichier. Bilan réel : zéro
   handler mort dans app.js (810 vérifiés), 2 `VRT.act('rien')` corrigés.

### Autres correctifs déployés
- CSP de l'app : jokers `https:` retirés de `script-src`/`connect-src` (ils
  autorisaient tout script HTTPS et l'exfiltration vers n'importe quel hôte).
- `assets/veritas-tokens.css` = origine UNIQUE des couleurs, chargée par les 157
  pages ET par la coquille ; 204 valeurs de l'ancienne charte remappées dans
  app.css (contrastes AAA revérifiés).
- Espace Partenaire : `var SES = window.SES||null` masquait la globale (SES est un
  `let`, donc absent de window) → verrouillé pour tout le monde.
- `api/_bot_log.php` absent de la liste de déploiement alors qu'app.js lui envoie
  des beacons : 404 silencieux.
- Barre de recherche rendue à l'accueil (posée depuis `assets/vitrine.js`, car
  `vitrine.html` est régénéré) ; `#recherche?q=` prérempli.
- « Découvrir » menait TOUJOURS à `#boutique` : `rendre()` clone le gabarit de la
  première carte. Routage par le sens du titre, en délégation de clic.
- Panneau d'actualités : ne s'efface plus au premier échec (le flux MINESEC est
  sain — 12 titres au contrôle).
- Prix des abonnements INVISIBLE : `-webkit-text-fill-color:transparent` hérité
  sans dégradé dessous.

### Reste à faire
Justification des textes (⚠️ un commit passé s'intitule « Ma justification cassait
les colonnes » — mesurer avant de généraliser) · puces et numérotations colorées ·
alternance gras/couleurs · animations sur les autres pages · orbite de
`constellation` alignée sur la vitrine (elle a déjà `vtOrbit` 90 s, anneaux dorés)
· dédoublonnage et cohérence du discours marketing.

### À faire côté Jacques
Mots de passe par défaut encore actifs (`directeur` ET `superadmin` — l'app le
signale au démarrage) · MTN MoMo en **sandbox** (`MTN_TARGET_ENV='sandbox'`, clés
`À_REMPLIR_DEPUIS_MOMODEVELOPER`) : aucun paiement MTN réel possible.

## Professeur Ambassa CÂBLÉ sur l'accueil (v1.19.30) — vérifié en live

**Manque comblé (signalé par Jacques : « câble et connecte l'IA Ambassa et mets-le
sur l'accueil »).** Le widget « Professeur Ambassa · en ligne » de la VITRINE était
une **maquette morte** : le bouton d'envoi appelait `VRT.act('rien')`, le champ
n'avait pas d'identifiant, les suggestions n'étaient pas cliquables. Le backend
(`api/ia_proxy.php`) était pourtant prêt et déjà utilisé par l'application.

**Câblé (assets/vitrine.js + source DC + régénération) :**
- `ambassaEnvoyer()` : POST `api/ia_proxy.php` `{prompt, plan:'anon', userId:''}` (le
  MÊME endpoint que l'app ; clé IA jamais exposée). Réponse rendue en `white-space:
  pre-wrap` via **textContent** (jamais innerHTML → aucune injection depuis le texte IA).
- États couverts : attente (bulle « … », bouton désactivé), succès, erreur réseau,
  HTTP 429 (message dédié), hors-ligne/`file://` (apiBase vide → message clair).
- Quota d'INTERFACE hebdomadaire (`localStorage`, 3/sem, aligné sur la copie) :
  décrémenté **uniquement sur succès** ; épuisement → bulle mur d'abonnement avec
  CTA `goTarifs`. L'anti-abus RÉEL reste serveur (rate-limit IP 15/min·300/j + plafond
  global). Un utilisateur qui vide son localStorage retombe sur les bornes serveur.
- Entrée = envoyer (écouteur `keydown` délégué au document). Suggestions cliquables
  (`ambassaSuggestion` → préremplit + envoie). Focus auto à l'ouverture.
- A11y : `#vrtIAMsgs` role=log + aria-live=polite ; input aria-label + enterkeyhint ;
  suggestions role=button + tabindex ; bouton envoi aria-label.
- Source DC (`Refonte site Véritas/Refonte VERITAS.dc.html`) éditée PUIS régénérée par
  `node tools/build_vitrine.js "Refonte site Véritas/Refonte VERITAS.dc.html" vitrine.html`.
  Cache-buster auto : `vitrine.js?v=` passé de 1.19.20 → 1.19.29 (dérivé du shell).

**Vérifié EN LIVE (serveur statique local, fetch simulée pour le chemin succès) :**
- Ouverture → input/send/msgs présents, quota « 3 questions ».
- Envoi → POST réel vers `/api/ia_proxy.php`, body correct ; succès rendu (sauts de
  ligne préservés), quota 3→2 ; échec → message gracieux, quota NON consommé, bouton
  réactivé ; 429 géré ; épuisement → mur d'abonnement + CTA.
- Entrée déclenche l'envoi ; panneau contenu dans le viewport mobile (326px, 0 débordement).
- Gates rejoués : `node --check` OK (app.js, sw.js, assets/*.js), versions alignées
  (1.19.29 shell⇄sw), Playwright smoke 2/2.

**Revérif dashboard (contre-expertise précédente) : CONFIRMÉE.** À 1280px, avant login
`LS=flex`/`VISITOR=none` (connexion atteignable) ; session admin → `APP=flex` (129 191
car. rendus), `VISITOR=none`, `LS=none`. Le correctif racine `#VISITOR` (garde
`:not([style*=display:none])` dans theme-lws.css) tient : plus de double interface.

**NON déployé** : changements locaux sur `deploy/campay-securite`. La prod reste
inchangée jusqu'à un merge/push sur `master` (déclencheur FTP).

## Méga-menu pleine largeur + routage parent (v1.19.31) — vérifié en live

**Demandes (Jacques, en direct) :** (1) étaler le méga-menu « Plus » sur toute la
largeur, ouvrir chaque onglet pour vérifier qu'il est branché, harmoniser
icônes/animations ; (2) « Créer mon compte parent » ne mène pas au compte parent
— corriger + cas similaires + responsive + confort typographique.

**Audit des 27 liens du méga-menu : TOUS branchés** (vérifié en live).
- 3 écrans vitrine (elearning, tarifs, boutique) · 10 pages statiques
  (corriges/, oeuvres/, niveaux/, ressources/, parcours/, outils/, decouvrir/,
  campus/, manuels.html, constellation.html — index.html présents) · 14 ancres
  app.html (#epreuves…#partenariat) qui rendent toutes du contenu réel.

**Méga-menu refondu (build_vitrine.js, .vmn) :** barre FIXÉE pleine largeur sous
#vrtNav (fond pleine largeur via padding-inline, contenu centré 1160px, 3 colonnes
ÉGALES minmax(0,1fr)). Ancrage `top:100%` — #vrtNav a un backdrop-filter, donc il
est le bloc contenant du fixed → 100% = bas du nav, auto-ajusté au compactage ;
repli @supports 76px sans backdrop-filter. Descriptions NON tronquées (fini
l'ellipsis qui coupait à droite). Icônes = tuiles pastel par entrée (déjà en place),
+ animation d'entrée vmnDown, hover translateX + tuile scale/rotate, focus-visible,
prefers-reduced-motion. Vérifié 1280px : panneau 0→1265px, collé au nav (gap −1px),
0 débordement horizontal, 3×9 items.

**« Créer mon compte parent » réparé.** Le bouton pointait vers `#compte-parent`,
ancre inexistante → mort. Corrigé : `app.html#inscription-parent`. Nouveau routage
dans app.js `_vtHashRouter` : `inscription-<role>` (parent/enseignant/eleve/auteur/
partenaire/mecene) → `showRegisterForm(role)`. Vérifié EN LIVE : `#inscription-parent`
→ `_regRole=parent`, titre « Créer mon compte parent », champ matricule enfant présent.

**Confort typographique / contraste (bandeau parent).** Le titre « coûte rien.
Jamais. » apparaissait en bleu clair illisible EN PROD (bicolore) : déjà neutralisé
en local (garde `color:#fff`), et amélioré → « coûte rien. Jamais. » en OR (#FFC93C,
lisible sur fond sombre), mots-clés (notes/absences/tranches) en gras blanc. Le
bouton passe en encre navy (#0C2A6A) gras sur fond blanc (contraste AAA).

**Aucun lien mort dans le DOM rendu (`DEAD: []`).** Les placeholders de la SOURCE
DC (`#mentions`, `#cgv`, `#charte`, `#candidature`, `#bareme`…) sont réécrits au BUILD
en vraies destinations (legal/mentions-legales.html, legal/cgv.html,
legal/charte-pedagogique.html, app.html#partenariat, corriges/…). NE PAS conclure à
un lien mort depuis un grep de la source — mesurer le DOM.

**RESTE — chantier substantiel, NON fait (à cadrer) :** ~14 sections publiques
(partenariat, epreuves, evaluations, actualites, resultats, photos, orientation,
contact, inscription, nos-partenaires, verifier-certificat, cagnotte, trophees,
leaderboard-junior, calendrier) vivent dans app.js et rendent dans le VIEUX shell
applicatif (nav « E-Learning / Mes matières… » via vShowSec) — c'est « l'ancienne
interface » signalée. Les harmoniser = reskin du shell visiteur de l'app (37 000
lignes, déploiement direct en prod) : à faire méthodiquement, pas d'un bloc.

Versions bumpées 1.19.29 → 1.19.31 (shell app.js/app.css ⇄ sw alignés, CI OK).
node --check OK (app.js, sw.js, vitrine.js). NON déployé (branche deploy/campay-securite).

## Gate d'inscription 100 F (v1.19.32) — cœur câblé + vérifié, SÛR (OFF par défaut)

**Demande Jacques :** toutes les inscriptions payantes à 100 F ; le visiteur non
inscrit ne voit que les démos de l'accueil + les pages SEO publiques ; l'inscription
100 F ouvre l'accès aux ressources GRATUITES (le premium reste payant/abonnement) ;
paiement via CamerPay (tous réseaux). Décisions actées : (a) gate = ressources
INTERNES seulement (corriges/ oeuvres/ publics restent libres → SEO préservé) ;
(b) DRAPEAU ADMIN, OFF par défaut ; (c) TOUS les rôles paient, parent inclus.

**Câblé dans app.js (tout défensif, OFF par défaut) :**
- `_gateActif()` lit `DB.accessGate.actif` (undefined = OFF). `_GATE_SECTIONS` =
  {elearning, jeux, quiz, labo, labos}. `_estMembreInscrit()` : personnel du centre
  (admin/enseignant/élève) OU visiteur `inscriptionPayee:true`. `_gateBloque(sec)` =
  actif ∧ section verrouillée ∧ non-membre.
- Hook dans `vShowSec` : `if(_gateBloque(sec)){ c.innerHTML=_gateWallHtml(sec); return; }`
  → mur d'inscription (CTA « Créer mon compte — 100 FCFA », lien connexion).
- `doRegister` : gate actif → compte `statut:'en_attente_paiement'`,
  `inscriptionPayee:false`, puis `openPaymentModal({intent:'inscription', montant:_gatePrix(),
  targetId/customerAccountId:acc.id})` (route CamerPay `_payInitCampay`). Gate OFF →
  comportement historique (actif + membre tout de suite).
- `_payAutoActivate` : nouveau `case 'inscription'` → pose `inscriptionPayee:true`,
  `statut:'actif'` à la confirmation (miroir client de `vrt_grant_entitlement`,
  api/_auth_lib.php intent 'inscription'). Idempotent.
- Admin toggle dans `pgPaywall` (Essais & abonnements) : case `gate_actif` (save
  immédiat) + champ montant `DB.tarifs.inscription` + avertissement « n'activer
  qu'après un vrai paiement test CamerPay réussi ».
- Bandeau parent : « ne coûte rien. Jamais. » retiré (contredisait « tous paient
  100 ») → message neutre « tout au même endroit » (exact quel que soit l'état du gate).

**Vérifié EN LIVE (logique pure `_gateBloque`, SW purgé pour charger l'app.js frais) :**
OFF+anon→libre ✓ · ON+anon→elearning/jeux BLOQUÉS, contact/boutique LIBRES ✓ ·
ON+inscrit non payé→bloqué ✓ · ON+inscrit payé→accès ✓ · ON+élève→accès ✓ ·
mur affiche 100 FCFA ✓ · activation post-paiement présente ✓.

**Deux gates distincts, comme demandé :** inscription 100 F = ouvre l'ACCÈS aux
sections (niveau gratuit). Le PREMIUM reste derrière le mur d'essais/abonnement `_pw*`.

Versions 1.19.31→1.19.32 (shell⇄sw alignés). node --check OK, smoke 2/2. NON déployé.

### RESTE de la demande (NON fait — chantiers à part, à mener proprement)
- Classer les entrées du menu PAR RÔLE (élève/parent/enseignant/partenaire) — restructure du MENU.
- Restaurer l'Ambassa COMPLÈTE (chat + quiz + évals + fiches) sur l'accueil.
- Aligner l'EN-TÊTE de l'app sur la vitrine + uniformiser/colorer/agrandir tous les contenus.
- Le flux de paiement 100 F n'est testable qu'avec CamerPay en prod (PHP absent en local).

## Panneau IA réduit + outils Ambassa + « design fade » RÉSOLU (v1.19.32)

### ★ CAUSE RACINE du « design fade, aucune icône, aucune couleur » — TROUVÉE
Mesuré au navigateur sur `#orientation` : les cartes ONT leurs icônes et leurs
teintes dans le HTML (`.vori-ico.t-or/.t-bleu/…`, dégradé `var(--o1),var(--o2)`,
glyphe `color:#fff`). Mais `assets/theme-lws.css:1298` applique
`#VISITOR#VISITOR *{ background-image:none !important }` — un balayage volontaire
pour aplatir la vitrine. EFFET DE BORD : le dégradé de la TUILE saute, il reste
une **icône blanche sur fond transparent → invisible**. Idem pour l'ombre
(`box-shadow:none`, l.1326) qui supprimait le relief et le survol.
> **Leçon : « il n'y a pas d'icône » ne veut pas dire qu'elle est absente du HTML.**
> Ici elle était rendue, peinte en blanc, sur un fond effacé par un balayage à
> double identifiant. Mesurer le style CALCULÉ, pas le markup.

**Correctif (fin de theme-lws.css, exception ciblée)** : ré-affirmation du dégradé
+ ombre + couleur UNIQUEMENT sur les surfaces qui portent un pictogramme
(`.vori-ico`, `.vsec-ico`, `.acc-news-ic`, `.pgt-ico`) et du survol de
`.vori-card`. Ce sont des éléments de taille fixe, jamais des panneaux de contenu :
l'aplat voulu par la refonte n'est pas touché.
**Vérifié EN LIVE** : 7/7 tuiles peintes (or/bleu/vert/violet/cyan/rose), icône de
section peinte, titre centré. Capture avant/après sans appel.
⚠️ Cache-buster `theme-lws.css?v=` bumpé 1.19.29 → 1.19.32, SINON le correctif
n'atteint jamais un visiteur de retour (piège déjà consigné).

### Panneau Ambassa réduit + ses fonctionnalités rendues
- Largeur **326 → `min(290px, 100vw-96px)`**, en-tête compacté (avatar 46→34,
  titre 15→13.5, paddings resserrés). Vérifié : 290 px, tient dans le viewport.
- **Barre de 4 OUTILS** (Quiz · Fiche · Corriger · Méthode) : chacun CADRE le
  prompt (`IA_OUTILS[k].p + question`) — l'élève ne tape que son sujet. Le mode
  actif est marqué (fond violet, `aria-pressed`), le placeholder change, et une
  bulle annonce le mode. Même proxy, même quota, aucune clé exposée.
- Vérifié EN LIVE : les 4 outils présents ; clic « Quiz » → placeholder « Sur quel
  chapitre… », annonce affichée, fond actif ; envoi → prompt réellement transmis
  = « Prépare un QUIZ de 5 questions (QCM…) conforme au programme MINESEC sur :
  Le théorème de Pythagore, 4e ». Cadrage CONFIRMÉ.

Gates : node --check OK (app.js, sw.js, vitrine.js) · versions 1.19.32 alignées ·
Playwright 2/2 (un premier run rouge = flake de port, vert au re-run).

### RESTE (non fait, cadré pour la suite)
- Classer les entrées du menu PAR RÔLE (élève/parent/enseignant/partenaire).
- Câbler l'accueil au panneau ADMIN (ajouter/modifier ressources et infos depuis l'admin).
- Aligner l'EN-TÊTE de l'app sur la vitrine + uniformiser TOUTES les pages.

## DÉPLOYÉ EN PRODUCTION (15/08/2026) — v1.19.33

`master` : 143295d → c0dab4e → **9532361**. Workflow « 🚀 Déployer sur
veritas-school.com » **success** (1 m 33), « 🧪 Tests E2E » **success**.

### ★ Le garde-fou de l'argent a attrapé MON oubli — et il avait raison
Premier push : déploiement OK mais tests E2E ROUGES. Un seul échec sur 59 :
> `✗ tout intent passé au paiement existe dans la table`
> `intents inconnus de VERITAS_MONETISATION : inscription`

J'avais ouvert le paiement des frais d'inscription (`openPaymentModal({intent:
'inscription'})` dans `doRegister`) **sans déclarer la surface** dans
`window.VERITAS_MONETISATION`, qui se présente comme l'inventaire COMPLET de ce
qui se vend. Le serveur, lui, gérait déjà l'intent (section 8 : 5/5 verts).
C'était donc bien un trou CLIENT, exactement l'angle mort que ce test existe pour
fermer. **Ne jamais ajouter un `intent:` à openPaymentModal sans l'inscrire dans
la table** — le test le verra, mais autant le savoir avant.

**Correctif** : entrée `inscription` avec `droit:null, collection:null` (comme
`echeance`). Ces deux nuls ne sont pas décoratifs : ils font retourner `null` à
`_monetBeneficiaire` → **aucune commission calculée sur des frais d'inscription**
(vérifié en lisant la garde `if(!cfg||!cfg.part||!cfg.collection||!targetId)`).

**Piège du contrôle de couverture (c)** : `$intentsTestes` n'est alimenté que par
la boucle de la SECTION 1, et le contrôle s'exécute en SECTION 7 — donc AVANT la
section 8 qui teste réellement l'inscription. Sans `$intentsTestes[]='inscription'`
(l.240, après la boucle), déclarer la surface aurait fait tomber un AUTRE contrôle.
Ce n'est pas une exemption : retirer la section 8 fait retomber le rouge.

### Non vérifiable depuis cette machine
Le réseau sortant est coupé (curl → erreur TLS 35 ; WebFetch → ECONNRESET). Le
succès du workflow FTP est la preuve du dépôt des fichiers ; le RENDU en prod
reste à confirmer côté Jacques (Ctrl+Shift+R, puis vérifier : le tuteur de
l'accueil répond, les icônes d'orientation sont colorées, le menu « Plus » prend
toute la largeur).

### Rappel — le gate 100 F est DÉSACTIVÉ en production
`DB.accessGate.actif` est absent ⇒ OFF. Rien n'est verrouillé, aucune inscription
n'est bloquée. Activation : Admin → Essais & abonnements, APRÈS un vrai paiement
test CamerPay réussi.

## Menu rangé par rôle (v1.19.34, déployé 16/08 — CI verte)

`tools/build_vitrine.js`, constante `MENU`. Le classement THÉMATIQUE (Apprendre /
Le centre / Boutique) est remplacé par un classement par DESTINATAIRE :

| Colonne | Sous-titre | Entrées | Cadenas |
|---|---|---|---|
| Élève | Apprendre et réviser | 7 | 3 |
| Parent | Suivre et soutenir | 6 | 0 |
| Enseignant | Enseigner et publier | 5 | 0 |
| Partenaire | Diffuser et représenter | 4 | 0 |
| Le centre | Nous connaître | 5 | 0 |

27 entrées au total — aucune perdue, 0 lien mort (vérifié en live à 1 400 px :
panneau 1 385 px, aucun débordement, aucun libellé coupé).

- `g:1` sur une entrée = cadenas. **Indication de lisibilité, PAS une sécurité** :
  le contrôle réel est `_gateActif()` (app.js) + serveur. Les pages SEO publiques
  (corrigés, œuvres, niveaux, outils, découvrir, manuels, constellation, campus)
  n'en portent JAMAIS — les murer couperait l'acquisition Google.
- Paliers : 5 colonnes > 1 240 px · 3 colonnes ≤ 1 239 px · 2 colonnes ≤ 1 023 px.

### Deux pièges rencontrés
1. **Backticks dans un commentaire CSS** placé à l'intérieur du littéral de gabarit
   `cssBascule` (l.1585) → `SyntaxError: Unexpected identifier`. Le build s'arrête
   AVANT d'écrire : vitrine.html reste intact, mais on croit avoir régénéré.
   **Ne jamais écrire de backtick dans les commentaires de ce fichier.**
2. **Les colonnes sont rendues à DEUX endroits** (bureau l.745, mobile l.778). Un
   `sed` sur une seule occurrence fait diverger les deux menus en silence.
3. Rappel : `stat -c%s` pour la taille — `ls -l | awk '{print $5}'` renvoie le GID,
   le nom d'utilisateur « Mythe Errant » contenant une espace.

## Modèle économique + double commission (v1.19.40, déployé 16/08 — CI verte)

### ★ Bug de DOUBLE COMMISSION — trouvé, reproduit, corrigé
`_computeSplits` (app.js) : la garde d'idempotence s'écrivait
`if(payAttempt.ref && DB.splits.some(...))`. **Sans référence, elle était sautée.**
Mesuré : 10 000 F rejoué 3× → solde partenaire 1 000 → 2 000 → 3 000 F.
Cas réels concernés : encaissement manuel, espèces, reprise après incident.
**Correctif** : clé de repli `sig:accountId|intent|targetId|montant|jour`, portée
par chaque part (`s.cleIdem`) ; doublon journalisé + toast admin (plus de retour
silencieux). Vérifié 4 cas dont 2 de non-régression (2 refs distinctes → 2 parts ;
2 montants différents → 2 parts).

### Grille de commission révisée (contre-proposition appliquée)
- Paliers **10/12/15/18 %** (au lieu de 10/15/20/25 proposés). À 25 % sur un annuel
  à 7 000, VÉRITAS ne gardait que 5 250 pour porter hébergement + IA + support +
  contenu, que l'apporteur ne supporte pas.
- **Dégressivité** : `VERITAS_COMMISSION_DEGRESSIVE {apresMois:12, facteur:0.5}` →
  18 % jusqu'au 12ᵉ mois, 9 % ensuite.
- **Échelonnement** `_echelonnerCommission(part, mois, debut)` : un annuel se
  commissionne mois par mois, pas d'avance (sinon on paie sur du CA remboursable).
  Reliquat sur la PREMIÈRE échéance → somme exacte (1 261 → 106 + 11×105).
- `_dureeCommission()` : annuel 12 mois, mensuel/manuel 1.
- Tarifs par rôle : `_tarifInscription()` — enseignant 500, famille 100 ; le rôle
  est lu SUR LE COMPTE en base (jamais le targetId client, sinon on s'annonce
  « parent » pour payer 100 au lieu de 500).

### ⚠️ NON FAIT — « Apprendre en jouant » affiche des chiffres INVENTÉS
`Refonte VERITAS.dc.html` contient en dur : `Terminale A4 · Douala', pts: '2 480 pts'`,
« Série de 12 jours », « 780/1 000 XP », classement Yaoundé/Bafoussam.
**C'est de la preuve sociale fabriquée** — contraire à la règle de Jacques
([[feedback_preuve_sociale_reelle_uniquement]]). Avant de câbler : il faut une
source de vérité (XP, séries, battles) + un endpoint public, puis le mécanisme de
recouvrement déjà posé (`chargerPublic` / `appliquerPublic` dans vitrine.js).
Tant que la donnée n'existe pas : afficher une invitation à jouer, PAS un classement.

### Non fait aussi
Réinsertion des 2 images sur l'accueil · bascule SERVEUR des paliers (le serveur
plafonne encore à 12 % — `vrt_paliers_partenaires`, api/_auth_lib.php:906) ·
grilles de partage par produit (70/20/10 à domicile) · offres B2B établissement.

## Accueil : photos, icônes, extrait du jour branché, boutons audités (17/08)

### ★ L'extrait du jour ne changeait pas — deux causes, pas une
Constat de Jacques : « depuis que c'est en ligne, rien n'a changé ». Exact, et
pour deux raisons indépendantes :
1. la **date** (`{{ dateDuJour }}`) est évaluée par le transpileur : elle se fige
   au jour du build et ne repart qu'au déploiement suivant ;
2. le **passage** vient de la maquette — un extrait unique du *Tube Digestif*,
   écrit en dur, FR et EN.

L'application avait pourtant déjà le moteur : `_pdjLoad` (app.js) sur
`api/rag.php?src=oeuvres&daily=1`, tirage **déterministe par jour de l'année**
(le même extrait pour tous). La vitrine ne le lisait pas. Elle y est branchée :
`chargerPassageDuJour()` dans `assets/vitrine.js`.

- **Amélioration progressive** : le passage de la maquette reste dans le HTML.
  Testé rag.php coupé → l'encart garde Le Tube Digestif intact. Une panne réseau
  ne vide pas l'accueil.
- **Le nettoyage est REPRIS de app.js** (`_pdjCleanExtract`), garde-fou compris :
  un extrait qui commence en cours de phrase est recadré, mais si le recadrage
  ampute le texte on garde l'original préfixé de « […] ». Plancher 70 mots.
- **Ce qui se masque quand le serveur répond**, et pourquoi : la bascule
  Français/English (le corpus ne sert que du français — le bouton promettrait une
  traduction inexistante) et le décryptage d'Ambassa (il commente Le Tube
  Digestif ; l'afficher sous un autre extrait serait une analyse fausse signée
  d'un enseignant). Le bouton « Demander à Ambassa » reste : analyse à la demande.
- **La couverture perd sa mention « Étude d'œuvre … VÉRITAS »** quand l'œuvre
  vient du corpus : le centre publie un cahier pour QUATRE œuvres, pas pour les
  116 de l'index. Elle affiche « Œuvre au programme ».
- `copierPassage` et les liens de partage citaient Le Tube Digestif en dur →
  régénérés depuis le passage réellement affiché.

**Preuve par mutation** (banc local, horloge avancée de 40 jours) : la date
affichée passe de « 16 août » (valeur du build) à « 25 septembre ». Sans le
crochet, elle serait restée figée — un test qui reste vert le même jour ne prouve
rien.

### ★ « Découvrir » : 20 cartes, une seule destination, et la mauvaise
Les cartes de « Tout ce dont l'élève a besoin » portaient toutes
`href="#detail"`, traduit globalement en `#boutique`. Mesuré au navigateur :

- les **4 cartes du premier onglet** menaient à la librairie — y compris
  « Labos virtuels » et « Jeux pédagogiques », qui ne s'y vendent pas ;
- les **16 autres** gardaient `#detail` **tel quel**, parce qu'elles sont
  reconstruites au clic **depuis le gabarit**, pas depuis le HTML rendu. Aucun
  écran ne porte `data-vp="detail"` → le routeur ignore l'ancre, la page ne bouge
  pas. Seize boutons « Découvrir » qui ne découvraient rien.

> **Leçon à retenir** : corriger le HTML rendu ne corrige que ce qui est visible
> au CHARGEMENT. Tout ce qu'un gabarit reconstruit au clic doit être corrigé DANS
> LE GABARIT. D'où les deux passes de `DEST_SERVICES` (build_vitrine.js) : l'une
> remplit les cartes déjà écrites, l'autre pose `dest` dans les données.

Table indexée par **titre** ; une carte inconnue **arrête la construction**
(mieux vaut ne pas déployer qu'un lien mort), et deux garde-fous refusent un
`#detail` résiduel ou un « Découvrir » sans adresse. Vérifié onglet par onglet :
20/20 destinations distinctes, 0 lien mort.

> **Piège de mesure rencontré** : ma première boucle de vérification donnait les
> mêmes 4 cartes pour les 5 onglets. Les ONGLETS EUX-MÊMES sont re-rendus au
> clic : `tabs[i]` capturé avant la boucle pointait sur des nœuds détachés. Il
> faut re-interroger le DOM à chaque tour.

### Le reste de l'audit des boutons (accueil)
40 éléments : 26 boutons + 14 liens. Après correctifs : **0 anomalie**.
- Les 6 « sans handler » détectés au premier passage sont la barre de recherche
  injectée par vitrine.js (`addEventListener`, pas d'`onclick`) — vivants. Un
  détecteur qui ne lit que les attributs inline produit des faux positifs.
- `reparerBoutonsMorts()` neutralise déjà tout `VRT.act('rien')` résiduel.
- **2 liens sortants sans `target`** (dont « Écrire sur WhatsApp ») : le visiteur
  quittait le site pour de bon. Passe générique ajoutée au build → `target=_blank`
  + `rel=noopener` sur tout lien externe qui n'en a pas.

### Les 2 photos, remises sans leurs panneaux
`assets/photo-classe.webp` et `photo-eleve.webp` étaient déployées mais
référencées **nulle part** depuis la coupe des « blocs alternés » : un accueil
sans un seul visage. Demande explicite : « insère les photos et non les anciens
panneaux supprimés ». Bande `.vphotos` (tools/vitrine-bloc.css) posée juste après
« Un centre à Douala, une plateforme dans sa poche », dont elles illustrent les
deux moitiés. Libellés repris de cette section — aucun chiffre, aucun témoignage.
Mesuré à 1 280 px : deux panneaux de 549 px, 72 → 1 194, zoom lent coupé sous
`prefers-reduced-motion`.

### Icônes centrées + marges du cadre crème
- Icônes des 4 cartes de services : `align-self:center` → 111 px de chaque côté
  (mesuré). Les cartes publics (photo + bandeau coloré) n'ont PAS été touchées :
  composition différente, non visée par la capture de Jacques.
- Cadre de la citation : `padding 46/58/40` → `26/30/24`, colonnes de texte
  33ch/37ch → 56ch/60ch, guillemet ouvrant rapproché. Le texte passe de ~219 px
  du bord à **85 px**. Les 56ch restants tiennent la longueur de ligne lisible.

### Vérifications
`node --check` sur vitrine.js et build_vitrine.js · build vert · Playwright 2/2 ·
audit boutons 0 anomalie · geométrie mesurée à 1 280 px.
**Non rejouable ici** : `php -l` et `tests/paiements_entitlements.php` (PHP absent
en local) — aucun fichier PHP ni chemin d'argent touché dans cette session.

### Pas de bump de version nécessaire
La CI suffixe déjà le `?v=` d'une **empreinte du contenu servi** (deploy.yml,
« Aligner les cache-busters ») : `assets/vitrine.js` modifié ⇒ URL neuve
automatiquement. Bumper la coquille à la main était inutile — et le remplacement
global reste proscrit (cf. 11/08).

### Reste à faire
Abonnement en tranches / par cagnotte · harmonisation des 64 pages statiques
(seuls l'accueil et l'écran de connexion ont été mesurés) · bascule SERVEUR des
paliers de commission (plafond 12 % dans `api/_auth_lib.php`) · grilles de partage
par produit · offres B2B établissement.

## Ambassa permanent + décryptage écrit par l'IA (17/08, suite)

### ★ Le piège qui m'a eu DEUX FOIS : le service worker sert l'ancien asset
Deux vérifications locales ont donné un faux « ça ne marche pas » alors que le
correctif était bon sur le disque : `sw.js` est enregistré sur `localhost:3000`
et met en cache **par URL**. `assets/vitrine.js?v=1.19.44` et
`assets/ambassa.js?v=1.19.44` ne changent pas d'URL quand on édite le fichier —
le navigateur exécutait donc le code de la veille.

Symptômes vus, et ce qu'ils voulaient dire :
- le décryptage restait masqué alors que `zd.hidden` n'existait plus dans le
  fichier → **le fichier lu n'était pas le fichier écrit** ;
- `f.getAttribute('style')` renvoyait `null` après un correctif qui posait un
  style en ligne → même cause.

**Réflexe à prendre avant toute mesure locale** :
```js
navigator.serviceWorker.getRegistrations().then(r => r.forEach(x => x.unregister()));
caches.keys().then(n => n.forEach(c => caches.delete(c)));
```
puis recharger. En production le problème n'existe pas : la CI suffixe le `?v=`
d'une empreinte du contenu (deploy.yml, « Aligner les cache-busters »).
**Un test local qui contredit le code source est suspect avant d'être vrai.**

### Le décryptage est écrit par Ambassa, plus masqué
Première version : je masquais le décryptage quand le passage tournait, pour ne
pas publier sous le nom d'un enseignant une analyse qui parlait d'une AUTRE
œuvre. Jacques : « câble à l'IA ». C'est mieux, et c'est possible sans coût :

`chargerDecryptage()` (assets/vitrine.js) appelle `ia_proxy.php` avec la clé
**`shared:'pdj'`** — reprise telle quelle de `_pdjLoadExpl` (app.js). Le serveur
génère l'analyse **une fois par jour** et la sert à tout le monde **sans
décompter le moindre quota**. Sans cette clé, une IA sur page publique = un appel
payant par visiteur ; avec elle = un appel par jour. Plus : cache localStorage
par jour + titre, délai maximal 22 s, nœuds re-cherchés dans les callbacks.
Si l'IA ne répond pas, le bloc se retire — jamais d'analyse hors sujet.

Vérifié dans les deux sens : avec l'IA, le décryptage parle d'*Assèze
l'Africaine* (le passage affiché) et se met en cache ; sans API, l'encart entier
reste celui du build (Tube Digestif + son décryptage d'origine), cohérent.

### Marges du cadre crème, deuxième passe
`padding 26/30/24 → 18/20/16`, et surtout les brides `max-width` retirées
(56ch/60ch → `none`). Le texte passe de **85 px à 21 px** du bord du cadre.
Les deux paragraphes font désormais la même largeur (782 px) — avant, le second
était bridé 120 px plus étroit que le premier, ce qui donnait un bloc bancal.
> Contrepartie assumée : ~90 caractères par ligne, au-delà des 65-75 confortables.
> C'est la demande, formulée deux fois.

### Ambassa, présent sur toute surface — `assets/ambassa.js` (NOUVEAU)
Le tuteur complet (avatar, 8 tâches, historique) vivait dans `mAgentAmbassa`
(app.js) : il fallait être DANS l'application. La vitrine avait un panneau, sur
l'accueil seulement, replié. **Les 115 pages statiques — là où Google dépose la
majorité des visiteurs — n'avaient rien.**

Fichier **autonome** (aucune dépendance à vitrine.js ni app.js, puisqu'aucun des
deux n'est chargé partout) : lanceur flottant avec l'avatar `ambassa-avatar.png`,
panneau reprenant les **8 tâches d'`AMBASSA_TACHES`** (mêmes intitulés, mêmes
couleurs, même ordre), chat, quota d'interface, `ia_proxy.php`.

- **Règle centrale** : si `window.mAgentAmbassa` existe (donc dans l'application),
  le lanceur ouvre **le tuteur d'origine**, avec son historique et ses
  formulaires. On ne pose pas un second tuteur plus pauvre par-dessus.
  Vérifié : `mAgentAmbassa` appelé 1×, aucun panneau de repli créé.
- Posé sur **115/115 pages statiques** + coquille app + 7 écrans de la vitrine.
  `build_corriges.py` émet la balise, donc une régénération ne la perd pas.
- `?v=` obligatoire : la CI **annule le déploiement** pour tout `/assets/*.js` nu.

### ★ Deux pastilles flottantes au même endroit
`elementsFromPoint` au centre du lanceur renvoyait `A.vrt-wa-fab` : le bouton
WhatsApp des pages statiques occupe déjà `right:16px; bottom:18px; z-index:9000`
(et `.vfx-fab` fait pareil dans l'application). Les deux se superposaient
exactement.

**Ambassa monte d'un cran** plutôt que de déplacer un bouton présent sur 62 pages
et dans l'app : `ajusterPosition()` mesure la pastille existante et décale.
Second passage à 700 ms — `veritas-ui.js` injecte la sienne au DOMContentLoaded
lui aussi, et l'ordre entre deux scripts `defer` n'est pas garanti.
Mesuré à 375 px : Ambassa à 78 px du bas, WhatsApp à 14 px, 16 px d'écart,
plus aucun chevauchement. Sur la vitrine (pas de concurrent) il garde le coin.

### Vérifications
`node --check` sur app.js, sw.js et les 5 `assets/*.js` · build vitrine vert ·
Playwright 2/2 · lanceur présent sur les 7 écrans de la vitrine (position fixe,
`aller()` ne touche qu'aux `data-vp`) · outil → prompt cadré → réponse → quota
3 → 2 · Échap ferme · avatar chargé (naturalWidth 320) · 115/115 pages portent
la balise avec `?v=`.
**Non vérifié au navigateur** : le lanceur DANS l'application — `/app.html` sans
ancre renvoie un visiteur anonyme vers « / » (garde anti-double-accueil). Le
chemin de délégation est testé isolément, pas en session connectée.

### Point à trancher par Jacques
Le tuteur est désormais joignable depuis **toutes** les pages publiques, y compris
par un visiteur anonyme. Les garde-fous serveur (15/min et 300/jour par IP,
plafond global de dépense dans `ia_proxy.php`) sont inchangés — c'est la surface
d'appel qui s'élargit, pas la limite. À surveiller sur la première semaine.

## Livrets interactifs en ligne — verrou serveur + code au paiement (17/08)

### ★ Le verrou d'origine n'en était pas un — trois trous, pas un
Le brief (`DEPLOY_PROMPT.md`) demandait de « remplacer le verrou local ». Mesuré
sur les sources : il n'y avait rien à remplacer, il fallait tout poser.
1. `tryUnlock()` comparait la saisie à `'VERITAS2026'` **écrit dans la page**, et
   l'indice « Démo : tape VERITAS2026 » s'affichait sous le champ.
2. Le calque « Livret verrouillé » n'était **qu'un calque** : le contenu était
   déjà rendu derrière. Le supprimer dans l'inspecteur suffisait.
3. Surtout : `booklet-data-*.js` **et** `guide-data-*.js` (450 + 200 Ko : le
   livret vendu ET tous les corrigés) partaient en `<script src>` **avant toute
   vérification**, à une URL stable. Inutile même d'ouvrir la page.

### Ce qui a été posé
- `api/_livret_lib.php` — registre des codes. Index = **HMAC-SHA256(code, VRT_HMAC_KEY)** :
  recherche en O(1) (un bcrypt par code obligerait à tester toute la base) et un
  registre volé sans la clé ne se force pas hors ligne. Le code en clair n'est
  jamais stocké.
- `api/livret.php` — la porte. `unlock` / `session` / `content` / `claim` + admin
  (`admin_gen|list|revoke|reset_devices`, Bearer API_SECRET). Jeton HMAC lié au
  poste (IP+agent), 12 h élève / 8 h enseignant ; **la classe et la nature sont
  DANS le jeton** (un jeton de 6ᵉ n'ouvre pas la 3ᵉ) ; quota 3 appareils (2 prof) ;
  **session unique** (un nouveau déverrouillage évince le précédent) ; plafond de
  12 livraisons par session ; 5 échecs = 15 min de porte fermée *même avec le bon
  code* ; révocation à effet immédiat sur les sessions ouvertes ; filigrane
  traçable (id du code + date) peint à l'écran et à l'impression ; fail-closed.
- Données déplacées dans `uploads/protected/livrets/` (.htaccess deny + LISEZMOI).
  **Jamais commitées** : le dépôt GitHub est public. Dépôt FTP.

### Le paiement émet le code, sans intervention humaine
- `vrt_grant_entitlement` : branche `livret` → `vrt_livret_emettre()`. **Idempotent
  deux fois** (par `ref` dans `DB.livretVentes` ET dans le registre) — les
  passerelles mobiles rejouent leur notification jusqu'au 200.
- Prix de référence SERVEUR : `vrt_prix_catalogue` rend `vrt_livret_prix($db)` =
  `DB.tarifs.livret` ou **1 500**. Sans cette entrée le contrôle de sous-paiement
  aurait été *sauté* (comportement de la fonction quand elle ignore un tarif) et
  on débloquait un manuel à 1 franc.
- `VERITAS_MONETISATION.livret` déclaré (sinon `tests/paiements_entitlements.php`
  échoue) ; `VERITAS_TARIFS.livret = 1500` pour l'affichage.
- **Le code ne transite PAS par `payment_*.php?action=status`** : cette action est
  non authentifiée et les références y sont énumérables. Il est déposé dans un bon
  de livraison par référence, réclamé par `claim` avec **ref + 4 derniers chiffres
  du numéro payeur**. D'où des références à 8 caractères aléatoires (`LV260817-…`).

### ★ « Demo 6e » n'était pas une démo : c'était le produit entier
Elle chargeait `booklet-data.js` + `guide-data-6e.js` **complets** et ne filtrait
rien (`this.build(window.BOOKLET)`). Publiée telle quelle, elle offrait la 6ᵉ.
`tools/prepare_livrets.py` fabrique désormais un extrait réel : séquence 1,
semaine 1, et **seuls les corrigés de ces exercices-là** (appariement par consigne ;
sous-inclure est sans danger, sur-inclure serait une fuite). Mesuré :
**645 Ko → 40 Ko, 4 % des exercices, 5,6 % des corrigés**, 0 conseil enseignant.

### Le verrou est un traitement reproductible, pas une édition à la main
`tools/prepare_livrets.py` régénère les 9 coquilles depuis
`Downloads/Mise en page livret activité new/`. Il **échoue** si une source change
de forme plutôt que de produire une page silencieusement ouverte (7 ancres
vérifiées + 4 interdits en sortie). Jacques régénère ses livrets : une édition
manuelle aurait perdu le verrou à la première régénération.

### Preuves (mesurées au navigateur, pas déduites)
- Page verrouillée : `window.BOOKLET`/`GUIDE_6E` **undefined**, 0 exercice, 0 champ.
- **Les deux contournements d'origine échouent** : `localStorage['veritas-unlock-6e']='1'`
  laisse la page fermée au rechargement ; supprimer le calque laisse **0 caractère**
  à l'écran — il n'y a rien derrière.
- Réseau : `6e.html`, `gate.js`, `support.js`, `POST api/livret.php`. **Aucune
  requête vers une donnée de livret.**
- 3 garde-fous CI ajoutés (code en dur / données embarquées / .js > 120 Ko),
  **éprouvés par mutation** : 3/3 déclenchent.

### Reste à faire
- **Page admin dans l'app** pour émettre/révoquer les codes (aujourd'hui : `curl`,
  documenté dans le LISEZMOI). C'est le manque le plus gênant au quotidien.
- **Volet collaboratif** du brief actualisé (classes, devoirs partageables `/d/<token>`,
  soumissions, appréciations, parrainage, tableau de bord) : **non construit**,
  chantier distinct. Le socle (codes, entitlements, comptes) est en place pour lui.
- `php -l` et le test end-to-end du paiement : non rejouables en local (PHP absent,
  CamerPay notifie la prod). La CI est l'autorité.

## Session « Le Tube digestif en vente » (18/08/2026) — v1.18, lecture en ligne PDF + EPUB
- **Demande** : mettre le roman en ligne à **1 000 FCFA**, en PDF et EPUB, **lecture sur le site uniquement**.
- **Contenu préparé** (hors dépôt, FTP) : maquette A5 `Pack Le Tube digestif/Livre a imprimer (PDF)` → PDF vectoriel (Playwright, scale 1.0, `preferCSSPageSize`) → **144 pages JPEG 1240 px** dans `uploads/protected/books/tubedigestif/` ; **EPUB → 11 fragments assainis** dans `…/tubedigestif/epub/` + extrait libre de 624 mots ; `tubedigestif.epub` déposé à côté. 28 Mo au total.
- **Deux corrections d'édition en ligne** (le master imprimé n'est PAS touché) : page 1 remplacée par la **couverture HD seule** (la maquette fait courir son titre courant par-dessus la couverture) ; **page 145 supprimée** (la 4ᵉ de couverture déborde d'une page, bandeau éditeur orphelin). ⚠️ Ces deux défauts existent toujours dans le PDF prêt-au-tirage.
- **`api/secure_epub.php` (NOUVEAU)** — pendant texte de `secure_pdf.php`. Même auth, même entitlement (`unlockedBooks`), même mur : liminaires + début du chapitre I libres, au-delà **402**. Quota 24 chapitres/h/livre, anti-hotlink, signature de l'exemplaire (nom + id + date) incrustée dans le texte servi. **Aucune dépendance** : ni ZipArchive ni DOM — tout est préparé hors ligne par `tools/prepare_epub_reader.py`. Ajouté à l'allow-list `deploy.yml`.
- **Lecteur : mode 📄 pages / 📱 texte** (app.js `_secureMode`, `_secureRenderTexte`, `_secureLoadChap`, `_secureInstallLazyTexte` + CSS `.sread-text`). Le mode texte se recompose, garde thèmes/zoom/gardes anti-copie, charge un chapitre à l'approche de l'écran. **Défaut : texte sous 720 px**, pages au-dessus ; choix mémorisé (`vrt_sread_mode`).
- **Honnêteté** : un texte recomposé est du texte remis au navigateur — récupérable dans l'onglet réseau. Le mode pages reste le plus dur à extraire. Retirer `"epub": true` d'une fiche désactive le mode texte. Dit tel quel dans WORKFLOW_LIVRES.md et l'en-tête de l'endpoint.
- **Fiche produit honnête** : `genre:'roman'` + `numeriqueSeul:true` retirent « conforme au programme MINESEC », « corrigés gratuits à vie », le badge MINESEC de la grille, « Rupture de stock » (4 surfaces) et le parcours d'expédition — remplacé par « Comment lire mon exemplaire ? » en 3 étapes. Corrigé au passage : les étapes 1 et 2 du parcours papier s'appelaient toutes deux « Vous payez ».
- **WORKFLOW (demande de Jacques)** : plus une ligne de JS pour publier. `catalogue_livres.json` (fiches seulement, aucun contenu) est déployé et **fusionné dans DB au démarrage** (`_catalogueLivresCharger`, créneau `requestIdleCallback`, idempotent, ne touche ni `vendu` ni `stock`, respecte `DB._livresRetires`). Le seed en dur du roman a été **retiré** : une seule mécanique. Commande unique : `python tools/publier_livre.py --id … --titre … --prix … --pdf/--html --epub --couverture`. Restent **3 gestes non automatisables** : ① FTP du dossier protégé, ② commit du catalogue + vignette, ③ **ouvrir l'admin une fois** (le serveur ne lit un prix de référence que dans la base synchronisée, jamais dans un fichier statique déposable sans authentification).
- **`.gitignore` — trou bouché** : `uploads/protected/**` n'était couvert que **par hasard** par la règle `*.jpg`. Un `.epub` ou un fragment `.html` serait parti **en clair dans le dépôt PUBLIC**. Désormais tout y est exclu sauf `.htaccess` et `LISEZMOI.txt`.
- **Vérifié dans Chrome réel** (`tests/livre_serveur_fictif.cjs` + `tests/livre_verification.cjs`, 26 contrôles verts, profil neuf) : fiche sans promesse fausse, catalogue fusionné (144 p / 1 000 F / 8 chapitres / incipit 307 mots **verbatim**), aperçu 10 pages puis mur, extrait texte tronqué + signature, chapitre 6 et page 11 refusés **402**, téléphone en mode texte sans débordement. **Éprouvé par mutation** : mur retiré côté serveur → les 2 contrôles passent au rouge.
- **Barre du lecteur sur téléphone — régression trouvée et corrigée** : elle débordait de **137 px** à 390 px (croix de fermeture ET bouton Débloquer hors écran ; elle débordait déjà d'environ 30 px avant la bascule de mode). Les commandes portent toutes `min-width:44px` (cible tactile a11y) : on ne les rapetisse pas, on **retire** — titre, plein écran, repère de chapitre, libellé « Débloquer » (aria-label conservé). Remesuré : **0 px de débordement**.
- **Cache-buster** bumpé `1.19.44 → 1.19.45` (`VERITAS_v1.2.html` ×9, `app.html`, `sw.js` CACHE_VERSION) — app.js et app.css ont changé.
- **Non commité, non déployé.** Le contenu de `uploads/protected/books/tubedigestif/` (28 Mo) attend un dépôt FTP ; sans lui le lecteur répond « document non préparé ».
- **Vitrine publique (suite, même session)** : le roman a sa carte au rayon boutique. Le gabarit refusait un livre non scolaire — corrigé en le rendant piloté par les données : **étoiles conditionnées à une note réelle** (elles étaient dessinées 4/5 EN DUR sous les 8 cartes, sans un seul avis derrière — elles disparaissent donc partout, conformément à la règle « preuve sociale réelle uniquement »), **mention sous le prix** portée par `m.mention` (« corrigés en ligne inclus » reste aux cahiers), **bouton `Commander` OU lien `Lire en ligne`** selon `m.papier` / `m.lien`. Ligne de détail (`m.exos`) conditionnée et vidée sur 7 cahiers où elle répétait la ligne `type`. `nbManuels` 8 → 9. Source `Refonte VERITAS.dc.html` éditée puis `node tools/build_vitrine.js` (garde-fous verts : 5 onglets/5 jeux, balises équilibrées). **Vérifié dans Chrome** : 14/14 — carte présente, lien `app.html#livre?id=tubedigestif`, 0 étoile inventée, compteur à 9, pas de débordement à 390 px (carte 358 px). ⚠️ La vitrine annonce toujours « 134 titres au catalogue » (chiffre en dur, non vérifié) et la carte « Le Tube Digestif — étude intégrale » (2 500 F) voisine désormais le roman (1 000 F) : deux produits distincts, à départager dans les intitulés si la confusion se voit.
- **Reste** : `tools/render_secure_pdf.cjs` reste bloqué sur `page.render()` avec pdf.js sous Node 26 (contourné par PyMuPDF dans `publier_livre.py`) ; dépôt FTP des 28 Mo à faire ; rien n'est commité.

## Les 15 cahiers interactifs 6ᵉ→Tˡᵉ, à 1 500 F (27/08/2026) — NON DÉPLOYÉ

Demande : « finalise la mise en ligne de mes ouvrages… tous les niveaux et tous
les documents… chaque livre c'est 1 500 frs et le pass ou code est unique…
un fichier test pour donner un aperçu… l'apprenant peut travailler de manière
autonome puis voir les corrigés sans avoir besoin de l'enseignant. »

### Ce que la vérification a trouvé — trois trous, pas un
1. **Le moteur du cahier n'ouvrait AUCUN des cahiers vendus.** `livrets/cahier.js`
   attendait `CAHIER_BLOCS` ou un `BOOKLET` en tableau ; les sources réelles sont
   `{header,sequences}` (1er cycle), `MANUEL_DATA{blocks}` (2ⁿᵈ cycle) et
   `export default [{y,r}]` (Bords, module ES non exécutable en `<script>`).
2. **`lines` — l'espace d'écriture — n'était pas rendu.** C'est le bloc le PLUS
   fréquent du 2ⁿᵈ cycle (361 en 1ʳᵉ). La question se lisait, il n'y avait nulle
   part où répondre : un PDF en couleurs, pas un cahier.
3. **`retientC`/`retC` étaient pris pour des corrigés** et repliés derrière
   « Voir la correction » : la règle à retenir était escamotée (209 blocs sur le
   seul Bord de 1ʳᵉ).

Et un quatrième, silencieux : **les 492 exercices du 1er cycle portent leur
`answer`**. Servir la source telle quelle livrait le corrigé complet avec le
cahier vendu.

### Ce qui a été construit
- `tools/normaliser_cahiers.py` — 4 formats → `window.CAHIER_BLOCS`, + la table
  `corrige-<slug>.js` séparée, + l'aperçu gratuit, + le catalogue serveur.
  Garde-fou : il REFUSE d'écrire une charge élève où subsiste un corrigé.
- `api/cahier.php?action=corrige` — la correction s'ouvre **après avoir cherché**
  (réponse non vide enregistrée), sans l'enseignant. 403 « cherche » AVANT le
  404 « aucun » : l'ordre importe, l'inverse donnerait la carte des corrigés.
- `livrets/apercu.html` — même moteur, sans jeton : **2 leçons non suivies**
  (1 à 4 % du cahier), un onglet par classe, et l'offre en pied de page.
- `tools/rendu_couvertures.cjs` — compose les 5 couvertures de Bord qui
  n'existaient nulle part, depuis le titre/sous-titre/auteurs du document.
- `disponible` se constate sur le CONTENU (`booklet-<slug>.js` présent), plus
  sur la coquille ; le serveur rend aussi le `lien` de la carte.

### Mesures
15 ouvrages · 1 500 F · 30 000 blocs · **13 700 endroits où l'élève écrit** ·
3 977 corrigés en libre-service (6ᵉ→2ⁿᵈᵉ) · 15/15 couvertures · aperçus 3–13 Ko
contre 240–650 Ko pour le produit.

**382 contrôles verts**, tous éprouvés par mutation :
`banc_cahiers_reels` 153 · `paiements_entitlements` 87 · `banc_cahier` 43 ·
`ouvrages_en_vente` 41 (neuf) · `banc_livret_codes` 29 · `banc_empreintes` 18
(neuf) · `banc_cles_cahier` 11.

### Deux pièges payés d'avance
- **L'empreinte Python ≠ JavaScript sur 58 consignes / 40 720** — toutes à
  emoji : `slice(400)` compte des unités UTF-16, `t[:400]` des points de code.
  Sans `banc_empreintes.cjs`, aucun corrigé ne se serait retrouvé sur ces
  exercices, avec le message exact d'un exercice qui n'en a pas.
- **Le contrôle « ≥ 100 champs » restait VERT** quand on débranchait `lines` :
  les consignes en fournissaient assez à elles seules. Remplacé par « autant
  d'espaces rendus que de blocs `lines` » — mutation : 9 rouges.

### Boutique (livrets/index.html)
Cartes pilotées par le catalogue : 15 couvertures, prix, lien, essai gratuit.
Corrigé à la demande de Jacques : filets d'or retirés, icônes à la couleur de
leur titre, **bouton d'achat orange** (il était blanc sur blanc — `var(--vp-cta)`
existe dans la feuille partagée avec un autre sens, le repli n'a jamais servi),
comparaison **Bord / Livret**, et le parcours du code en **animation CSS pure**
(3 écrans, 15 s, `opacity`/`transform` seuls, `prefers-reduced-motion` respecté).
⚠️ L'animation d'entrée des cartes (`animation-timeline:view()`, feuille
partagée) laissait les couvertures à `opacity:0` : désactivée sur cette page.

### RESTE — rien n'est en ligne
1. **FTP** de `~/Desktop/veritas-ftp/uploads/protected/livrets/` (~11 Mo :
   15 `booklet-*`, 4 `guide-*`, 5 `corrige-*`). Sans lui les 11 ouvrages neufs
   restent `disponible:false` — **fail-closed voulu : rien ne se vend qui ne
   s'ouvre**.
2. `git add` + push + `gh workflow run deploy.yml`.
3. Paiement réel CamerPay sur un slug neuf : non rejouable en local
   (`mode:live`, `sandbox:false`, `selfService:true` vérifiés en production).
4. Une copie des données a été laissée dans `uploads/protected/livrets/` du
   dépôt de travail pour permettre la vérification locale ; c'est gitignoré
   (`uploads/protected/**`, vérifié par `git check-ignore`).
