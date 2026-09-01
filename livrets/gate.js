/* ══════════════════════════════════════════════════════════════════════════
   livrets/gate.js — PORTE CLIENT DES LIVRETS EN LIGNE
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.

   Remplace le verrou d'origine, qui était une illusion : `tryUnlock()` comparait
   la saisie à 'VERITAS2026' écrit en clair dans la page, le calque « Livret
   verrouillé » se supprimait dans l'inspecteur, et les données du livret ET du
   guide partaient en <script src> AVANT toute vérification.

   Ici, la page ne contient AUCUN contenu : elle le demande à api/livret.php
   après déverrouillage. Sans code valide, il n'y a rien à voler.

   Dépendances : aucune. ES5 volontaire (les livrets tournent sur des téléphones
   d'entrée de gamme, et il n'y a pas d'étape de compilation).
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var API   = '/api/livret.php';
  /* ⚠️ LA PASSERELLE NE S'ÉCRIT PLUS EN DUR ICI.
     Ce fichier pointait `payment_camerpay.php` en dur, tandis que
     l'application choisit la sienne à l'exécution (`_payProviderFile`, qui lit
     la sonde `?action=config`). Les deux tombent aujourd'hui sur CamerPay —
     par coïncidence, puisque c'est le fournisseur de lancement et le défaut du
     sélecteur.

     Le jour d'une bascule (`PAY_PROVIDER = 'campay'`), l'application suivrait
     et les livrets NON : ils continueraient d'appeler une passerelle inactive,
     et cesseraient d'encaisser sans que rien ne le dise. C'est un canal de
     paiement à deux vérités, exactement ce qu'on vient de corriger sur les
     catalogues.

     La sonde de CamerPay répond POUR LES DEUX fournisseurs : elle donne le
     fichier réellement actif (`file`). On la lit, et on garde CamerPay en
     repli — si la sonde ne répond pas, mieux vaut tenter le fournisseur de
     lancement que ne rien tenter. */
  var PAY   = '/api/payment_camerpay.php';
  function resoudrePasserelle() {
    return fetch(PAY + '?action=config', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (c) {
        if (c && c.ok && c.file) PAY = '/api/' + String(c.file).replace(/^\/*(api\/)?/, '');
        return PAY;
      })
      .catch(function () { return PAY; });
  }
  // Deux tarifs : le livret ouvre les exercices d'une classe, le GUIDE ouvre les
  // corrigés complets et la console de devoirs. Le serveur garde sa propre
  // référence (vrt_livret_prix) — ces chiffres ne servent qu'à AFFICHER.
  var PRIX  = { livret: 1500, guide: 5000 };
  // Remise de volume d'un pack établissement, par palier.
  var PALIERS = [[50, 20], [25, 15], [10, 10]];
  var WA    = '237697637739';             // WhatsApp du centre (support)

  var cfg   = { classe: '', kind: 'livret', titre: '' };
  var etat  = { ouvert: false, exp: 0, wm: null, jours: null, horsLigne: false };

  function prix(kind, n) {
    var u = PRIX[kind || cfg.kind] || PRIX.livret;
    n = n || 1;
    if (n <= 1) return u;
    var r = 0;
    for (var i = 0; i < PALIERS.length; i++) { if (n >= PALIERS[i][0]) { r = PALIERS[i][1]; break; } }
    return Math.round(u * n * (100 - r) / 100);
  }
  function fmt(v) { return Number(v).toLocaleString('fr-FR'); }

  // ── Utilitaires ──────────────────────────────────────────────────────────
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function cle() { return 'vrt-livret-' + cfg.classe + '-' + cfg.kind; }

  /* ── LA PREUVE D'ACHAT DOIT SURVIVRE À LA FERMETURE DE L'ONGLET ────────────
     La référence était rangée en `sessionStorage`. Elle mourait donc avec
     l'onglet — alors que le jeton d'accès, lui, est en `localStorage` deux
     lignes plus haut. Ce n'était pas une décision, c'était une incohérence, et
     elle a coûté des ventes le 01/09/2026.

     POURQUOI C'EST EXACTEMENT LE MAUVAIS ENDROIT ICI. Le parcours Orange Money
     oblige à QUITTER le navigateur : CamerPay affiche « composez le #150*50# »,
     l'acheteur passe dans son clavier téléphonique, et Android gèle puis
     souvent jette l'onglet resté derrière. Au retour, la référence n'existait
     plus sur l'appareil — elle ne vivait plus que dans le SMS de CamerPay, que
     personne ne pense à rapprocher d'un formulaire de retrait.

     On garde donc la référence ET les 4 derniers chiffres du payeur (jamais le
     numéro entier) : ce sont les deux seules choses qu'il faut pour réclamer
     son code, et elles sont à l'acheteur, sur son propre appareil. */
  var REF_CLE = 'vrt-livret-achat';
  function achatPose(r, tel4) {
    var v = JSON.stringify({ ref: r, t4: String(tel4 || '').slice(-4), q: Date.now() });
    try { localStorage.setItem(REF_CLE, v); } catch (e) {}
    try { sessionStorage.setItem('vrt-livret-ref', r); } catch (e) {}   // compat
  }
  function achatLu() {
    var v = null;
    try { v = JSON.parse(localStorage.getItem(REF_CLE) || 'null'); } catch (e) {}
    if (v && v.ref) {
      /* Un achat en attente se périme : au-delà de 30 jours, une reprise
         silencieuse au chargement interrogerait le serveur pour rien, à chaque
         visite, indéfiniment. */
      if (Date.now() - (v.q || 0) < 30 * 24 * 3600 * 1000) return v;
      achatEfface();
    }
    // Repli sur l'ancienne cle : un acheteur en cours de parcours ne doit pas
    // perdre sa reference parce qu'on a change de rangement.
    try { var r = sessionStorage.getItem('vrt-livret-ref'); if (r) return { ref: r, t4: '' }; } catch (e) {}
    return null;
  }
  function achatEfface() {
    try { localStorage.removeItem(REF_CLE); } catch (e) {}
    try { sessionStorage.removeItem('vrt-livret-ref'); } catch (e) {}
  }
  function jetonLu() { try { return localStorage.getItem(cle()) || ''; } catch (e) { return ''; } }
  function jetonPose(t) { try { localStorage.setItem(cle(), t); } catch (e) {} }
  function jetonEfface() { try { localStorage.removeItem(cle()); } catch (e) {} }

  /** Erreur porteuse du drapeau serveur (`tag`), pour distinguer « code faux »
   *  de « déjà ouvert ailleurs » ou « pas encore déposé sur le serveur ». */
  function ErrPorte(msg, tag) {
    var e = new Error(msg || 'Erreur');
    e.tag = tag || '';
    return e;
  }

  function post(url, corps) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',              // rien à envoyer : la porte est sans cookie
      cache: 'no-store',
      body: JSON.stringify(corps)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok || !j.ok) {
          // Un 200 sans notre JSON = le serveur repond, mais pas nous
          // (PHP en panne, portail wifi, page d'erreur de l'hebergeur).
          throw ErrPorte(j.error || (r.ok ? 'Reponse inattendue du serveur — reessaie dans un instant.'
                                          : 'Le serveur a repondu ' + r.status + '.'), j.code || 'serveur');
        }
        return j;
      });
    }, function () {
      throw ErrPorte('Connexion impossible. Vérifie ton réseau et réessaie.', 'net');
    });
  }

  // ── Filigrane traçable ───────────────────────────────────────────────────
  // Discret mais présent à l'écran ET à l'impression : une capture qui circule
  // désigne le code, donc l'acheteur. C'est la seule protection réellement
  // efficace contre la rediffusion — aucune page web n'empêche une photo.
  function filigrane(wm) {
    if (!wm || !wm.txt) return;
    var vieux = document.getElementById('vrt-wm');
    if (vieux && vieux.parentNode) vieux.parentNode.removeChild(vieux);

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="330" height="200">'
      + '<text x="0" y="115" transform="rotate(-24 0 115)" '
      + 'font-family="Source Sans 3, sans-serif" font-size="15" fill="#1f2b38" '
      + 'fill-opacity="0.055">' + esc(wm.txt) + '</text></svg>';

    var d = document.createElement('div');
    d.id = 'vrt-wm';
    d.setAttribute('aria-hidden', 'true');
    d.style.cssText = 'position:fixed;inset:0;z-index:6;pointer-events:none;'
      + 'background-repeat:repeat;-webkit-print-color-adjust:exact;print-color-adjust:exact;'
      + 'background-image:url("data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '")';
    document.body.appendChild(d);

    // Ligne lisible en pied de page : c'est elle qu'on relit sur une photo.
    var p = document.createElement('div');
    p.id = 'vrt-wm-pied';
    p.textContent = 'Exemplaire personnel — ' + wm.txt + ' — reproduction interdite';
    p.style.cssText = 'text-align:center;font:600 10.5px/1.6 "Source Sans 3",system-ui,sans-serif;'
      + 'color:#98a1aa;letter-spacing:.04em;padding:14px 10px 26px;';
    document.body.appendChild(p);
  }

  /* ══ LIRE SON CAHIER SANS RÉSEAU ═══════════════════════════════════════════
     « La connexion internet reste chère au Cameroun et pas toujours accessible
     à tout moment. » — Jacques, 28/08/2026.

     Jusqu'ici, ouvrir son cahier exigeait le réseau DEUX fois : pour valider la
     session, puis pour recevoir le contenu. Sans barres, un élève qui avait
     payé voyait la porte à code — et pire, `resume()` effaçait son jeton au
     passage, si bien qu'il devait ressaisir un code qu'il n'a pas sur lui.
     Le cahier devenait inutilisable exactement là où il sert le plus : dans un
     taxi, en zone blanche, ou le jour où l'on n'a plus de crédit.

     On garde donc une copie du contenu sur l'appareil, dans IndexedDB —
     pas dans `localStorage` : un cahier pèse de 240 à 650 Ko, le quota y est
     de 5 Mo pour TOUTE l'origine et l'écriture y est synchrone (elle gèlerait
     l'écran d'un téléphone d'entrée de gamme pendant la copie).

     ── CE QUE ÇA COÛTE, ET IL FAUT LE DIRE ────────────────────────────────
     Une copie hors ligne, c'est le produit sur l'appareil. Trois garde-fous,
     et un renoncement assumé :
       · la copie ne vit que le temps du BAIL ci-dessous, puis exige une
         reconnexion — sans quoi un code révoqué continuerait d'ouvrir ;
       · elle est effacée dès que le serveur refuse la session (code révoqué,
         expiré, évincé par un autre appareil) ;
       · le filigrane nominatif est gardé AVEC elle : une capture reste
         traçable hors ligne comme en ligne.
     Le renoncement : la révocation n'est plus instantanée. Elle prend effet au
     prochain contact avec le serveur, et au plus tard au bout du bail. C'est le
     prix de la lecture hors ligne, et il n'y a pas de version de cette
     fonctionnalité qui ne le paie pas.

     BAIL de 7 jours : assez pour une semaine sans crédit, assez court pour
     qu'un code révoqué cesse d'ouvrir dans la semaine. C'est un réglage, pas
     une loi — le descendre resserre la révocation, le monter soulage l'élève. */
  var BAIL_HORS_LIGNE = 7 * 24 * 3600 * 1000;
  var IDB_BASE = 'vrt-livrets', IDB_MAG = 'contenu';

  function idb() {
    return new Promise(function (ok, ko) {
      // `window`, pas `global` : cette IIFE ne prend aucun paramètre (à la
      // différence de cahier.js). Un `global.indexedDB` y aurait levé une
      // ReferenceError au PREMIER appel — c'est-à-dire à la première lecture
      // hors ligne, la seule fois où personne n'est là pour lire la console.
      if (!window.indexedDB) { ko(new Error('indexedDB absent')); return; }
      var r = window.indexedDB.open(IDB_BASE, 1);
      r.onupgradeneeded = function () {
        if (!r.result.objectStoreNames.contains(IDB_MAG)) r.result.createObjectStore(IDB_MAG);
      };
      r.onsuccess = function () { ok(r.result); };
      r.onerror = function () { ko(r.error || new Error('indexedDB refusée')); };
    });
  }
  function idbFaire(mode, faire) {
    return idb().then(function (db) {
      return new Promise(function (ok, ko) {
        var tx = db.transaction(IDB_MAG, mode), rq = faire(tx.objectStore(IDB_MAG));
        tx.oncomplete = function () { ok(rq && rq.result); };
        tx.onerror = function () { ko(tx.error); };
      });
    });
  }
  // Une clé par ouvrage ET par nature : le guide de l'enseignant et le livret
  // de l'élève ne doivent pas se remplacer l'un l'autre sur un poste partagé.
  function cleCache() { return cfg.classe + '|' + cfg.kind; }

  function cacheEcrire(r) {
    return idbFaire('readwrite', function (m) {
      return m.put({ js: r.js || {}, wm: r.wm || null, jours: etat.jours,
                     exp: etat.exp || 0, maj: Date.now() }, cleCache());
    }).catch(function () { /* stockage refusé (navigation privée) : tant pis */ });
  }
  function cacheLire() {
    return idbFaire('readonly', function (m) { return m.get(cleCache()); })
      .catch(function () { return null; });
  }
  function cacheEfface() {
    return idbFaire('readwrite', function (m) { return m.delete(cleCache()); })
      .catch(function () {});
  }

  /* Le bandeau hors ligne. Il DIT ce qui se passe : sans lui, l'élève croit
     que son travail part au serveur alors qu'il attend dans la file, et il
     efface son navigateur en pensant faire le ménage. */
  function bandeauHorsLigne(jusqu) {
    var v = document.getElementById('vrt-horsligne');
    if (v && v.parentNode) v.parentNode.removeChild(v);
    var reste = Math.max(0, Math.ceil((jusqu - Date.now()) / 86400000));
    var d = document.createElement('div');
    d.id = 'vrt-horsligne';
    d.setAttribute('data-ui', '1');
    d.style.cssText = 'position:sticky;top:0;z-index:60;background:#1B2431;color:#fff;'
      + 'font:600 13px/1.45 Poppins,system-ui,sans-serif;padding:9px 14px;text-align:center';
    d.textContent = 'Hors ligne — tu lis la copie enregistrée sur cet appareil. '
      + 'Ce que tu écris est gardé et partira au retour du réseau'
      + (reste ? ' (reconnecte-toi sous ' + reste + ' jour' + (reste > 1 ? 's' : '') + ').' : '.');
    document.body.insertBefore(d, document.body.firstChild);
  }

  // ── Installation du contenu reçu ─────────────────────────────────────────
  // Les fichiers de données sont du JavaScript de la forme « window.X = {…}; ».
  // On les exécute tels quels : aucune hypothèse sur leur structure, donc une
  // régénération des livrets ne casse pas la porte.
  /* ── QUELLE GLOBALE CE FICHIER EST-IL CENSÉ POSER ? ────────────────────────
     On la LIT DANS LE FICHIER, on ne la devine pas. Une première version
     énumérait `window` à la recherche d'un nom commençant par `BOOKLET` ou
     `GUIDE` — les noms des quatre coquilles de collège. C'était une liste
     déguisée en règle, et elle était déjà fausse : les cahiers de 2ⁿᵈᵉ, 1ʳᵉ,
     Tˡᵉ et EST passent par le lecteur générique et installent `MANUEL_DATA`.
     Le jour où on les dépose, la porte les aurait refusés comme « abîmés » —
     quatre cahiers corrects, fermés par le garde-fou censé les protéger.

     Le fichier dit lui-même son nom, en toutes lettres, dans ses cent premiers
     octets : `window.<IDENT> = …`. C'est exact, ça ne coûte rien, et ça marche
     pour un nom qui n'existe pas encore. Le serveur l'annonce aussi
     (`installe`) ; on préfère le sien quand il est là, et on retombe sur la
     lecture directe pour la copie hors ligne, qui garde le fichier mais pas la
     réponse qui l'accompagnait. */
  function identifiantDonnees(src) {
    var m = /^[\s﻿]*window\.([A-Za-z_$][A-Za-z0-9_$]*)\s*=/.exec(String(src || '').slice(0, 400));
    return m ? m[1] : '';
  }

  /* ── UN FICHIER EXÉCUTÉ N'EST PAS UN FICHIER INSTALLÉ ──────────────────────
     LE 01/09/2026, UN CLIENT A PAYÉ ET N'A RIEN VU. Le serveur avait livré son
     cahier, la page avait peint son filigrane nominatif, la porte s'était
     ouverte — et le livre s'arrêtait après le sommaire. `new Function(...)`
     avait buté sur un `SyntaxError` (le fichier était tronqué sur le serveur,
     un dépôt FTP coupé), et CETTE LIGNE-CI l'écrivait dans la console avant de
     passer à la suite comme si de rien n'était.

     Une erreur avalée coûte plus cher que la panne : l'acheteur voit un livre
     vide sous son propre nom, ne comprend pas, et c'est lui qui doit se
     plaindre pour qu'on l'apprenne. On dit désormais ce qui s'est passé — et on
     le fait remonter, pour que l'appelant décide au lieu de continuer à vide.

     On mesure l'INSTALLATION, pas l'exécution : un fichier peut se dérouler
     sans erreur et ne rien définir (mauvais fichier déposé sous le bon nom).
     Ce qui compte est qu'une globale de données soit apparue. */
  function installer(r) {
    var js = r.js || {}, echecs = [], annonce = r.installe || {};
    /* ⚠️ « ESSENTIEL » N'EST PAS TOUJOURS LE LIVRET. Chaque livraison porte
       DEUX fichiers : l'élève reçoit son cahier plus les corrigés (bouton
       « Voir la correction »), l'enseignant reçoit son guide plus le cahier
       pour suivre sa classe. Le fichier joint peut manquer sans que rien ne
       soit cassé — mais lequel est joint dépend de qui demande. Juger
       « booklet » indispensable dans les deux cas fermerait le guide d'un
       enseignant parce que le cahier de l'élève, lui, est abîmé. */
    var essentiel = ((r.kind || cfg.kind) === 'guide') ? 'guide' : 'booklet';
    ['booklet', 'guide'].forEach(function (k) {
      if (typeof js[k] !== 'string' || !js[k]) {
        // Le serveur écarte lui-même ce qu'il ne sait pas ouvrir. Absent ou
        // écarté, c'est pareil ici : ce qui compte est de savoir si c'est
        // CELUI qu'on est venu chercher. L'appelant tranche, pas nous.
        if (k === essentiel) echecs.push(k);
        return;
      }
      var ident = annonce[k] || identifiantDonnees(js[k]);
      try { (new Function(js[k]))(); }
      catch (e) { console.error('[livret] données ' + k + ' illisibles', e); echecs.push(k); return; }
      /* On mesure l'INSTALLATION, pas l'exécution : un fichier peut se dérouler
         sans une erreur et ne rien poser (mauvais fichier déposé sous le bon
         nom). Sans identifiant lisible, on ne peut rien affirmer — et on
         n'invente pas un échec : le serveur, lui, a déjà refusé ce qu'il ne
         savait pas ouvrir. */
      if (ident && window[ident] == null) {
        console.error('[livret] données ' + k + ' n\'installent pas window.' + ident);
        echecs.push(k);
      }
    });
    etat.wm = r.wm || null;
    filigrane(etat.wm);
    bandeauEcheance();
    return { ok: echecs.indexOf(essentiel) === -1, echecs: echecs };
  }

  /* Le bandeau des données abîmées. Il dit trois choses, et la troisième est la
     plus importante : ce n'est pas le code de l'élève qui est en cause. Sans
     elle, il essaie son code, échoue, et croit avoir payé pour rien. */
  function bandeauAbime() {
    var v = document.getElementById('vrt-abime');
    if (v && v.parentNode) v.parentNode.removeChild(v);
    var d = document.createElement('div');
    d.id = 'vrt-abime';
    d.setAttribute('data-ui', '1');
    d.style.cssText = 'position:sticky;top:0;z-index:70;background:#c0453f;color:#fff;'
      + 'font:600 13px/1.5 "Source Sans 3",system-ui,sans-serif;padding:10px 14px;text-align:center';
    d.textContent = 'Ce cahier n’a pas pu être chargé : le fichier déposé sur le serveur '
      + 'est abîmé. Ton code d’accès reste valable — ce n’est pas lui. '
      + 'Réessaie plus tard, ou écris-nous sur WhatsApp au +' + WA + '.';
    document.body.insertBefore(d, document.body.firstChild);
  }

  /* Un abonnement qui s'éteint sans prévenir est une vente perdue qu'on ne voit
     même pas passer : l'élève découvre l'échéance le jour où son code cesse de
     fonctionner, et il est déjà parti. On prévient dans le dernier mois. */
  function bandeauEcheance() {
    var j = etat.jours;
    if (j === null || j === undefined || j < 0 || j > 30) return;
    var v = document.getElementById('vrt-echeance');
    if (v && v.parentNode) v.parentNode.removeChild(v);
    var d = document.createElement('div');
    d.id = 'vrt-echeance';
    d.setAttribute('data-ui', '1');
    d.style.cssText = 'position:sticky;top:0;z-index:60;background:' + (j <= 7 ? '#c0453f' : '#d8b24a')
      + ';color:' + (j <= 7 ? '#fff' : '#3a2f0b') + ';font:600 13px/1.45 "Source Sans 3",system-ui,sans-serif;'
      + 'padding:9px 14px;text-align:center';
    d.innerHTML = (j === 0 ? 'Ton accès expire aujourd’hui. '
                   : 'Ton accès expire dans <strong>' + j + ' jour' + (j > 1 ? 's' : '') + '</strong>. ')
      + '<button type="button" style="border:none;background:rgba(255,255,255,.9);color:#1f2b38;'
      + 'font:inherit;font-weight:800;padding:4px 12px;border-radius:8px;cursor:pointer;margin-left:6px">'
      + 'Renouveler</button>';
    d.querySelector('button').onclick = function () { ouvrirAchat(); };
    document.body.insertBefore(d, document.body.firstChild);
  }

  function charger(token) {
    return post(API, { action: 'content', token: token }).then(function (r) {
      var bilan = installer(r);
      /* ⚠️ NE JAMAIS METTRE DE CÔTÉ CE QUI VIENT D'ÉCHOUER. Le commentaire
         ci-dessous disait déjà la règle — « exactement ce qui vient de
         fonctionner, jamais une supposition » — mais rien ne la vérifiait :
         un fichier tronqué partait en cache comme un autre, et l'élève le
         relisait pendant une semaine hors ligne. Une panne recopiée devient
         une panne qui survit à sa propre correction. */
      if (!bilan.ok) {
        bandeauAbime();
        throw ErrPorte('Le fichier de ce cahier est abîmé sur le serveur.', 'corrupt');
      }
      // On garde la copie APRÈS l'avoir installée : ce qu'on met de côté est
      // exactement ce qui vient de fonctionner, jamais une supposition.
      cacheEcrire(r);
      etat.horsLigne = false;
      return r;
    });
  }

  // ── API publique ─────────────────────────────────────────────────────────
  var VRT = {
    config: function (o) {
      cfg.classe = (o && o.classe) || '';
      cfg.kind   = (o && o.kind) || 'livret';
      cfg.titre  = (o && o.titre) || '';
      /* Les coquilles d'origine passaient leur titre en dur
         (`titre:'Livret 6ᵉ'`). Le moteur générique, lui, ne connaît que le
         slug de l'URL : l'écran de paiement annonçait donc « Livret 1ere » —
         le slug brut — à quelqu'un qui vient de cliquer sur « Mon Cahier de
         français 1ʳᵉ A ». Sur un écran où l'on sort 1 500 F, le doute sur ce
         qu'on achète suffit à faire renoncer.
         On demande donc son titre au serveur, qui l'a déjà : `action=ouvrage`
         est publique et ne livre aucun contenu. Si l'appel échoue, on garde le
         repli — un titre approximatif vaut mieux qu'une porte qui ne s'ouvre
         pas parce que le réseau a toussé. */
      if (!cfg.titre && cfg.classe) {
        post(API, { action: 'ouvrage', o: cfg.classe })
          .then(function (r) {
            if (r && r.ouvrage && r.ouvrage.titre) cfg.titre = r.ouvrage.titre;
          })
          .catch(function () { /* repli : « Livret <classe> » */ });
      }
      return VRT;
    },

    etat: function () { return { ouvert: etat.ouvert, exp: etat.exp, classe: cfg.classe,
                                 kind: cfg.kind, horsLigne: etat.horsLigne }; },

    /** Reprise silencieuse d'une session encore valide (rechargement de page). */
    resume: function () {
      var t = jetonLu();
      if (!t) return Promise.reject(ErrPorte('Aucune session', 'none'));
      return post(API, { action: 'session', token: t })
        .then(function (s) { etat.exp = s.exp; etat.jours = s.joursRestants; return charger(t); })
        .then(function () { etat.ouvert = true; return true; })
        .catch(function (e) {
          /* ── DEUX ÉCHECS QU'IL NE FAUT SURTOUT PAS CONFONDRE ────────────
             Le serveur a REFUSÉ (code révoqué, expiré, évincé) → on efface
             tout, jeton et copie : c'est une décision, elle doit s'appliquer.
             Le serveur est INJOIGNABLE (pas de réseau, plus de crédit, coupure)
             → on ne décide rien. L'ancien code effaçait le jeton dans les deux
             cas : perdre sa session parce qu'on est passé sous un tunnel, et
             devoir ressaisir un code qu'on n'a pas sur soi. */
          /* ── TROIS ÉCHECS, PAS DEUX : le fichier abîmé est le troisième ──
             Un fichier tronqué sur le serveur n'est ni un refus ni une panne de
             réseau. Effacer le jeton reviendrait à punir l'acheteur d'une faute
             qui n'est pas la sienne : il ressaisirait son code, qui marcherait,
             et retomberait sur le même livre vide.
             On garde donc la session — et on tente la copie hors ligne, qui est
             forcément saine puisqu'on ne met plus en cache ce qui a échoué.

             ⚠️ ET ON LIT LE BON CHAMP. Cette garde testait `e.code`, quand
             `ErrPorte()` écrit `e.tag` — la convention de tout le reste du
             dossier (`collab.js`, `liseur.js`). `e.code` valait donc `undefined`
             à CHAQUE échec : la distinction si soigneusement décrite juste
             au-dessus n'a jamais eu lieu, et le passage sous un tunnel effaçait
             le jeton ET la copie hors ligne — précisément ce qu'elle disait
             empêcher. Une garde écrite n'est pas une garde appelée. */
          var motif = (e && e.tag) || '';
          if (motif === 'net' || motif === 'corrupt') {
            return cacheLire().then(function (c) {
              if (!c || !c.js) throw e;
              var perime = Date.now() - (c.maj || 0) > BAIL_HORS_LIGNE;
              var expire = c.exp && (c.exp * 1000) < Date.now();
              if (perime || expire) {
                throw ErrPorte(perime
                  ? 'Ta copie hors ligne a passé une semaine sans contact. '
                    + 'Connecte-toi une fois pour la renouveler.'
                  : 'Ton accès a expiré.', 'bail');
              }
              etat.exp = c.exp; etat.jours = c.jours;
              installer({ js: c.js, wm: c.wm });
              etat.ouvert = true; etat.horsLigne = true;
              /* Le fichier du serveur est abîmé mais la copie de l'appareil est
                 bonne : ce n'est pas « hors ligne », et le dire serait envoyer
                 l'élève vérifier son réseau pour rien. */
              if (motif === 'corrupt') bandeauAbime();
              else bandeauHorsLigne((c.maj || 0) + BAIL_HORS_LIGNE);
              return true;
            }).catch(function (e2) {
              /* Rien à se mettre sous la dent, et la faute est au serveur : on
                 n'affiche SURTOUT pas le calque « Livret verrouillé », qui
                 demanderait son code à quelqu'un dont le code est valable. On
                 ouvre, on explique, et le livre reste vide en attendant le
                 nouveau dépôt — ce qui est l'exacte vérité. */
              if (motif === 'corrupt') { etat.ouvert = true; bandeauAbime(); return true; }
              throw e2;
            });
          }
          jetonEfface();
          cacheEfface();
          throw e;
        });
    },

    /** Déverrouillage par code. Le contenu n'arrive qu'après. */
    unlock: function (code) {
      if (!code || !String(code).trim()) return Promise.reject(ErrPorte('Saisis ton code.', 'empty'));
      return post(API, {
        action: 'unlock', code: String(code), classe: cfg.classe, kind: cfg.kind
      }).then(function (r) {
        jetonPose(r.token);
        etat.exp = r.exp;
        etat.jours = r.joursRestants;
        return charger(r.token);
      }).then(function () { etat.ouvert = true; return true; });
    },

    /* Fermer, c'est ne plus rien laisser de soi sur l'appareil — le poste
       est peut-être celui d'un cybercafé. La copie hors ligne part avec le
       jeton, sinon le suivant rouvrirait le cahier sans code. */
    fermer: function () {
      jetonEfface();
      etat.ouvert = false;
      cacheEfface().then(function () { location.reload(); },
                         function () { location.reload(); });
    },

    /** Retrait du code après paiement (référence + 4 derniers chiffres payeur). */
    reclamer: function (ref, tel) {
      return post(API, { action: 'claim', ref: ref, tel: tel });
    },

    prix: prix,
    joursRestants: function () { return etat.jours; },

    /* Le jeton de la session ouverte. `livrets/cahier.js` en a besoin pour
       enregistrer les réponses de l'élève sur api/cahier.php : c'est le MÊME
       jeton que celui qui a servi à ouvrir le cahier, donc la même identité et
       la même échéance — un second secret aurait fait un second endroit où se
       tromper. Rendu vide tant qu'aucune session n'est ouverte, jamais nul :
       un appelant qui l'oublierait enverrait alors une chaîne vide, que le
       serveur refuse proprement en 401. */
    jeton: function () { return jetonLu() || ''; },
    /** opts.n > 1 → pack établissement. */
    acheter: function (opts) { ouvrirAchat(opts); }
  };

  // ══ TUNNEL D'ACHAT ════════════════════════════════════════════════════════
  // 1 500 F → CamerPay (Orange Money / MTN MoMo / carte) → le serveur confirme
  // → il ÉMET le code → la page le retire et déverrouille toute seule.

  function ref() {
    var d = new Date();
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    var a = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', s = '';
    // 8 caractères aléatoires : une référence courte serait énumérable, et c'est
    // elle qui sert de preuve d'achat au moment de retirer le code.
    var buf = new Uint8Array(8);
    (window.crypto || {}).getRandomValues ? crypto.getRandomValues(buf) : buf.forEach(function (_, i) { buf[i] = Math.random() * 256; });
    for (var i = 0; i < 8; i++) s += a[buf[i] % a.length];
    return 'LV' + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + '-' + s;
  }

  var M = null;
  function modale(html) {
    if (!M) {
      M = document.createElement('div');
      M.id = 'vrt-achat';
      M.style.cssText = 'position:fixed;inset:0;z-index:200;background:rgba(20,26,34,.62);'
        + 'backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;'
        + 'align-items:center;justify-content:center;padding:18px;'
        + 'font-family:"Source Sans 3",system-ui,sans-serif';
      document.body.appendChild(M);
    }
    M.innerHTML = '<div style="background:#fff;border-radius:18px;max-width:430px;width:100%;'
      + 'padding:26px 24px;box-shadow:0 20px 60px -20px rgba(0,0,0,.5);max-height:90vh;overflow:auto">'
      + html + '</div>';
    return M;
  }
  function fermerModale() { if (M && M.parentNode) { M.parentNode.removeChild(M); M = null; } }

  var BTN = 'width:100%;border:none;background:#c0453f;color:#fff;font-family:"Baloo 2",sans-serif;'
    + 'font-weight:800;font-size:16px;padding:12px;border-radius:10px;cursor:pointer;margin-top:10px';
  var BTN2 = 'width:100%;border:1px solid #cfd6dd;background:#fff;color:#5c666f;font-weight:700;'
    + 'font-size:13px;padding:9px;border-radius:10px;cursor:pointer;margin-top:8px';
  var INP = 'width:100%;box-sizing:border-box;margin:10px 0 4px;padding:11px 14px;border:2px solid #cfd6dd;'
    + 'border-radius:10px;font-size:16px;text-align:center;letter-spacing:.06em';
  var TTL = 'font-family:"Baloo 2",sans-serif;font-weight:800;font-size:21px;color:#1f2b38;margin:8px 0 4px';
  var SUB = 'font-size:14px;color:#5c666f;line-height:1.55';

  var qte = 1;   // >1 = pack établissement
  function ouvrirAchat(opts) {
    qte = Math.max(1, Math.min(500, (opts && opts.n) || 1));
    var nom = cfg.titre || ('Livret ' + cfg.classe);
    modale(
      '<div style="text-align:center">'
      + '<div style="font-size:38px">📘</div>'
      + '<div style="' + TTL + '">' + esc(nom) + '</div>'
      + '<div style="' + SUB + '">Accès en ligne pour <strong>toute l\'année scolaire</strong> : '
      + 'tu réponds directement dans le livret, tes réponses sont enregistrées, '
      + 'et chaque exercice a sa correction.</div>'
      + '<div style="font-family:\'Baloo 2\',sans-serif;font-weight:800;font-size:30px;color:#c0453f;margin:14px 0 2px" class="vrt-prix">'
      + fmt(prix(cfg.kind, qte)) + ' FCFA</div>'
      + '<div style="font-size:12px;color:#98a1aa">Orange Money · MTN MoMo · carte bancaire</div>'
      // Pack établissement : un proviseur qui équipe une classe entière ne
      // doit pas avoir à nous écrire. La remise s'affiche dès 10 codes.
      + (cfg.kind === 'livret'
          ? '<label style="display:block;font-size:12.5px;color:#5c666f;margin:12px 0 2px">'
            + 'Nombre de codes (remise dès 10 : établissement)</label>'
            + '<input id="vrt-n" type="number" min="1" max="500" value="' + qte + '" style="' + INP + '">'
          : '')
      + '<input id="vrt-tel" type="tel" inputmode="tel" placeholder="Ton numéro (6XX XX XX XX)" style="' + INP + '">'
      /* L'ADRESSE, ET POURQUOI ELLE EST DEMANDÉE ICI.
         Jusqu'au 01/09/2026, le tunnel ne collectait QUE le numéro. Le code
         n'avait donc aucun chemin vers l'acheteur en dehors de l'onglet resté
         ouvert — et cinq clients l'ont appris à leurs dépens. Une adresse
         change tout : le serveur poste le code dès que le paiement est
         confirmé, que la page soit ouverte ou fermée, sur le bon téléphone ou
         sur un autre.
         Facultative, et dite comme telle : beaucoup paient par Orange Money
         sans adresse sous la main, et un champ obligatoire de plus, c'est une
         vente qui n'aboutit pas. */
      + '<input id="vrt-mail" type="email" inputmode="email" autocomplete="email" '
      + 'placeholder="Ton e-mail (facultatif) — pour recevoir ton code" style="' + INP + '">'
      + '<div style="font-size:11px;color:#98a1aa;margin:-4px 0 2px;line-height:1.45">'
      + 'Avec une adresse, ton code t’est envoyé même si tu fermes cette page.</div>'
      + '<div id="vrt-msg" style="font-size:12.5px;color:#c0453f;min-height:17px;margin-top:2px"></div>'
      + '<button id="vrt-go" style="' + BTN + '">Payer ' + fmt(prix(cfg.kind, qte)) + ' FCFA</button>'
      + '<button id="vrt-deja" style="' + BTN2 + '">J\'ai déjà payé — retrouver mon code</button>'
      + '<button id="vrt-close" style="' + BTN2 + '">Annuler</button>'
      + '<div style="font-size:11px;color:#98a1aa;margin-top:12px;line-height:1.5">'
      + 'Le code d\'accès est envoyé dès que le paiement est confirmé. '
      + 'Un souci ? <a href="https://wa.me/' + WA + '" target="_blank" rel="noopener" '
      + 'style="color:#2b8ac6;font-weight:700">WhatsApp</a></div>'
      + '</div>'
    );
    document.getElementById('vrt-close').onclick = fermerModale;
    document.getElementById('vrt-deja').onclick = ecranReclamation;
    document.getElementById('vrt-go').onclick = lancerPaiement;
    var champN = document.getElementById('vrt-n');
    if (champN) champN.oninput = function () {
      var n = Math.max(1, Math.min(500, parseInt(this.value, 10) || 1));
      var t = prix(cfg.kind, n);
      document.getElementById('vrt-go').textContent = 'Payer ' + fmt(t) + ' FCFA';
      var e = document.querySelector('#vrt-achat .vrt-prix');
      if (e) e.textContent = fmt(t) + ' FCFA';
      msg(n > 1 ? n + ' codes — ' + fmt(Math.round(t / n)) + ' F l’unité' : '', true);
    };
  }

  function msg(t, ok) {
    var e = document.getElementById('vrt-msg');
    if (e) { e.textContent = t || ''; e.style.color = ok ? '#3f7a2c' : '#c0453f'; }
  }

  function lancerPaiement() {
    var tel = (document.getElementById('vrt-tel') || {}).value || '';
    var chiffres = tel.replace(/\D+/g, '');
    if (chiffres.length < 9) { msg('Numéro incomplet — 9 chiffres attendus (6XX XX XX XX).'); return; }
    /* Une adresse mal tapée ne doit pas BLOQUER un paiement — mais elle ne doit
       pas non plus partir en silence : le client croirait recevoir son code par
       courriel et n'aurait rien. On refuse la saisie manifestement fautive, on
       laisse passer le champ vide. */
    var mail = ((document.getElementById('vrt-mail') || {}).value || '').trim();
    if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) {
      msg('Adresse e-mail incomplète — corrige-la, ou laisse le champ vide.'); return;
    }
    var champN = document.getElementById('vrt-n');
    var n = champN ? Math.max(1, Math.min(500, parseInt(champN.value, 10) || 1)) : qte;
    var b = document.getElementById('vrt-go');
    b.disabled = true; b.textContent = 'Ouverture du paiement…';
    msg('');

    var r = ref();
    /* On résout d'abord la passerelle active, PUIS on l'interroge : sans cela
       on paierait toujours chez le fournisseur écrit en dur, quel que soit
       celui que le serveur a activé. */
    resoudrePasserelle()
      .then(function () { return fetch(PAY + '?action=config', { cache: 'no-store' }); })
      .then(function (x) { return x.json(); })
      .then(function (c) {
        if (!c || !c.selfService || !c.publicInitToken) {
          throw ErrPorte('Le paiement en ligne est momentanément indisponible. '
            + 'Écris-nous sur WhatsApp pour obtenir ton code.', 'off');
        }
        if (c.sandbox) msg('Mode TEST : aucun argent réel ne circule.', true);
        return fetch(PAY + '?action=init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + c.publicInitToken },
          body: JSON.stringify({
            montant: prix(cfg.kind, n),
            ref: r,
            label: (cfg.titre || ('Livret ' + cfg.classe)) + ' — accès en ligne',
            // L'intent et la cible disent au serveur QUEL code émettre. Le tarif,
            // lui, est vérifié en base (vrt_prix_catalogue) : envoyer 1 F ici ne
            // débloque rien.
            intent: n > 1 ? 'livret_pack' : 'livret',
            targetId: cfg.classe + ':' + cfg.kind + (n > 1 ? ':' + n : ''),
            clientTel: chiffres,
            // Le serveur s'en sert pour POSTER le code dès la confirmation.
            // Sans elle, la remise n'a que le numéro — et l'onglet.
            clientEmail: mail
          })
        });
      })
      .then(function (x) { return x.json(); })
      .then(function (j) {
        if (!j || (!j.pay_url && !j.success)) throw ErrPorte(j && j.error ? j.error : 'Initiation refusée.', 'init');
        achatPose(r, chiffres);
        if (j.pay_url) window.open(j.pay_url, '_blank', 'noopener');
        ecranAttente(r, chiffres, j.pay_url || '');
      })
      .catch(function (e) {
        b.disabled = false; b.textContent = 'Payer ' + fmt(prix(cfg.kind, n)) + ' FCFA';
        msg(e.message || 'Paiement impossible pour le moment.');
      });
  }

  function ecranAttente(r, tel, url) {
    modale(
      '<div style="text-align:center">'
      + '<div style="font-size:38px">⏳</div>'
      + '<div style="' + TTL + '">Paiement en cours</div>'
      + '<div style="' + SUB + '">Termine le paiement dans l\'onglet qui vient de s\'ouvrir. '
      + 'Cette page se débloque toute seule dès que c\'est confirmé.</div>'
      + (url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener" '
        + 'style="display:block;margin-top:10px;color:#2b8ac6;font-weight:700;font-size:13px">'
        + 'Rouvrir la page de paiement</a>' : '')
      + '<div style="margin:14px 0 4px;font-size:12px;color:#98a1aa">Référence</div>'
      + '<div style="font-family:ui-monospace,monospace;font-weight:700;font-size:15px;color:#1f2b38;'
      + 'background:#f4f6f8;border-radius:8px;padding:8px">' + esc(r) + '</div>'
      + '<div style="font-size:11.5px;color:#98a1aa;margin-top:6px">Note-la : elle permet de retrouver ton code.</div>'
      + '<div id="vrt-msg" style="font-size:12.5px;color:#5c666f;min-height:17px;margin-top:10px">Vérification…</div>'
      + '<button id="vrt-close" style="' + BTN2 + '">Fermer</button>'
      + '</div>'
    );
    document.getElementById('vrt-close').onclick = function () { clearInterval(boucle); arreter(); fermerModale(); };

    var essais = 0, fini = false;
    function arreter() {
      fini = true;
      document.removeEventListener('visibilitychange', auRetour);
    }
    function tenter() {
      if (fini) return;
      VRT.reclamer(r, tel).then(function (c) {
        clearInterval(boucle); arreter();
        ecranCode(c);
      }).catch(function () { /* pas encore payé : on continue */ });
    }
    /* ⚠️ LE SONDAGE NE TOURNE PAS PENDANT QUE L'ACHETEUR PAIE.
       Orange Money passe par « composez le #150*50# » : l'acheteur quitte le
       navigateur pour son clavier téléphonique, et Android gèle les minuteurs
       de l'onglet resté derrière. Les 96 essais de 5 secondes ne s'écoulaient
       donc pas pendant le paiement — ils s'écoulaient APRÈS, si tant est que
       l'onglet ait survécu. On interroge donc à chaque retour sur la page,
       c'est-à-dire au moment exact où le paiement vient d'aboutir. */
    function auRetour() { if (document.visibilityState === 'visible') tenter(); }
    document.addEventListener('visibilitychange', auRetour);

    // Sondage borné : 5 s × 96 ≈ 8 minutes de page RÉELLEMENT ouverte. Au-delà,
    // le code reste réclamable — et la reprise au chargement le retrouvera.
    var boucle = setInterval(function () {
      essais++;
      if (essais > 96) {
        clearInterval(boucle); arreter();
        msg('Toujours rien. Ton code reste disponible : rouvre cette page, il s’affichera tout seul.');
        return;
      }
      tenter();
    }, 5000);
  }

  function ecranReclamation() {
    var enAttente = achatLu() || {};
    var dernier = enAttente.ref || '';
    var t4 = enAttente.t4 || '';
    modale(
      '<div style="text-align:center">'
      + '<div style="font-size:38px">🔎</div>'
      + '<div style="' + TTL + '">Retrouver mon code</div>'
      + '<div style="' + SUB + '">Saisis la référence de ton paiement et les 4 derniers chiffres '
      + 'du numéro qui a payé.</div>'
      + '<input id="vrt-ref" type="text" placeholder="Référence (LV…)" value="' + esc(dernier) + '" style="' + INP + '">'
      + '<input id="vrt-t4" type="tel" inputmode="numeric" maxlength="4" placeholder="4 derniers chiffres" value="' + esc(t4) + '" style="' + INP + '">'
      + '<div id="vrt-msg" style="font-size:12.5px;color:#c0453f;min-height:17px"></div>'
      + '<button id="vrt-go2" style="' + BTN + '">Retrouver mon code</button>'
      + '<button id="vrt-close" style="' + BTN2 + '">Retour</button>'
      + '</div>'
    );
    document.getElementById('vrt-close').onclick = ouvrirAchat;
    document.getElementById('vrt-go2').onclick = function () {
      var r = (document.getElementById('vrt-ref') || {}).value || '';
      var t = (document.getElementById('vrt-t4') || {}).value || '';
      if (!r.trim()) { msg('Référence requise.'); return; }
      var b = this; b.disabled = true; b.textContent = 'Recherche…';
      VRT.reclamer(r.trim(), t).then(function (c) { ecranCode(c); })
        .catch(function (e) {
          b.disabled = false; b.textContent = 'Retrouver mon code';
          msg(e.message || 'Introuvable.');
        });
    };
  }

  function ecranCode(r) {
    // L'achat est honoré : on cesse de le suivre, sinon chaque ouverture de
    // page rejouerait une réclamation pour un code déjà remis.
    achatEfface();
    // Un pack établissement rend TOUT le lot : le proviseur doit pouvoir le
    // distribuer, donc le copier d'un bloc.
    var lot     = (r && r.codes && r.codes.length > 1) ? r.codes : null;
    var code    = (r && r.code) || r;
    var aCopier = lot ? lot.join('\n') : code;
    modale(
      '<div style="text-align:center">'
      + '<div style="font-size:38px">🎉</div>'
      + '<div style="' + TTL + '">' + (lot ? 'Vos ' + lot.length + ' codes' : 'Ton code d\'accès') + '</div>'
      + '<div style="' + SUB + '">' + (lot
          ? 'Un code par élève. Chacun ouvre le livret toute l\'année, sur 3 appareils au plus.'
          : 'Note-le : il ouvre ton livret toute l\'année, sur 3 appareils au plus.') + '</div>'
      + '<div style="font-family:ui-monospace,monospace;font-weight:800;'
      + 'font-size:' + (lot ? '15px' : '22px') + ';color:#1f2b38;'
      + 'background:#f2f8ea;border:2px dashed #57a52c;border-radius:12px;padding:14px;margin:14px 0;'
      + 'letter-spacing:.06em;user-select:all;text-align:' + (lot ? 'left' : 'center') + ';'
      + (lot ? 'max-height:200px;overflow:auto;white-space:pre-line' : '') + '">'
      + esc(aCopier) + '</div>'
      + '<button id="vrt-copy" style="' + BTN2 + '">'
      + (lot ? 'Copier les ' + lot.length + ' codes' : 'Copier le code') + '</button>'
      + '<button id="vrt-open" style="' + BTN + '">Ouvrir mon livret</button>'
      + '<div id="vrt-msg" style="font-size:12.5px;min-height:17px;margin-top:6px"></div>'
      + '</div>'
    );
    document.getElementById('vrt-copy').onclick = function () {
      try { navigator.clipboard.writeText(aCopier); msg(lot ? 'Les ' + lot.length + ' codes sont copiés.' : 'Code copié.', true); }
      catch (e) { msg('Copie impossible — note-les à la main.'); }
    };
    document.getElementById('vrt-open').onclick = function () {
      var b = this; b.disabled = true; b.textContent = 'Ouverture…';
      VRT.unlock(lot ? lot[0] : code).then(function () {
        fermerModale();
        if (typeof VRT.onOuvert === 'function') VRT.onOuvert();
      }).catch(function (e) {
        b.disabled = false; b.textContent = 'Ouvrir mon livret';
        msg(e.message || 'Ouverture impossible.');
      });
    };
  }

  /* ── ON N'IMPRIME PAS LE CAHIER ───────────────────────────────────────────
     `cahier.js` interceptait Ctrl+S / Ctrl+P / Ctrl+U — mais rien n'empêchait
     d'imprimer par le MENU du navigateur, et `livrets/cahier.css` n'avait
     aucune règle `@media print`. Un acheteur ouvrait donc son cahier à 1 500 F
     et sortait l'ouvrage entier en PDF, proprement mis en page : les quatre
     coquilles de collège embarquent même la feuille d'impression de la maquette
     papier, faite pour ça. Le raccourci clavier gardait une porte pendant que
     la voisine restait ouverte.

     ICI PLUTÔT QUE DANS CHAQUE PAGE. Quatre coquilles verrouillées, le lecteur
     générique, le feuilletage : cinq endroits où poser la même règle, donc
     cinq endroits pour l'oublier à la prochaine publication. `gate.js` est le
     seul fichier que toutes chargent.

     LA RÈGLE NE MORD QUE LÀ OÙ IL Y A QUELQUE CHOSE À PROTÉGER : elle vise les
     conteneurs de contenu (`#hote`, `#sheet`, `#lis`). Sur une page de vente,
     aucun n'existe — elle n'a aucun effet, et un parent peut imprimer la fiche
     produit.

     ⚠️ CE QUE ÇA COÛTE, ET C'EST ASSUMÉ : l'élève ne peut plus imprimer sa
     propre copie, ses réponses étant dans le même conteneur. Arbitrage de
     Jacques, 01/09/2026, contre l'avis inscrit jusque-là dans `cahier.js`.

     ET CE QUE ÇA NE VAUT PAS : rien de tout cela ne résiste à une photo
     d'écran. On ferme le geste facile — le menu Imprimer, deux clics — pas
     l'intention déterminée. Le filigrane nominatif reste ce qui rend traçable
     une capture qui circule. */
  (function garderImpression() {
    var poser = function () {
      if (document.getElementById('vrt-noprint')) return;
      var st = document.createElement('style');
      st.id = 'vrt-noprint';
      st.textContent =
        '@media print{'
        + '#hote,#sheet,#lis{display:none !important}'
        + '#vrt-noprint-avis{display:block !important;padding:28px;text-align:center;'
        + 'font-family:system-ui,sans-serif;font-size:15px;line-height:1.7;color:#1f2b38}'
        + '}'
        + '#vrt-noprint-avis{display:none}';
      // Ajouté en dernier : les coquilles portent leur propre feuille
      // d'impression, héritée de la maquette papier, et elle est déclarée
      // avant celle-ci dans le document.
      document.head.appendChild(st);

      if (!document.getElementById('vrt-noprint-avis')) {
        var d = document.createElement('div');
        d.id = 'vrt-noprint-avis';
        d.textContent = 'Ce cahier ne s’imprime pas : il se remplit en ligne, '
          + 'et sa correction s’affiche exercice par exercice. '
          + 'Ton accès vaut toute l’année scolaire, sur 3 appareils. '
          + '— Centre VÉRITAS';
        document.body.appendChild(d);
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', poser);
    } else { poser(); }
  })();

  /* ── UN CODE PAYÉ ET JAMAIS RETIRÉ SE REPRÉSENTE TOUT SEUL ────────────────
     LE 01/09/2026, DEUX CLIENTS ONT PAYÉ SANS RECEVOIR LEUR CODE. Vérifié sur
     le serveur : les deux paiements étaient `COMPLETED` chez Orange, les deux
     codes étaient bien émis et déposés. Rien n'avait échoué côté argent — le
     code attendait, et personne n'est venu le chercher.

     C'est que la remise n'avait qu'UN seul canal : un onglet ouvert, au
     premier plan, pendant les huit minutes du sondage. Or payer par Orange
     Money veut dire quitter le navigateur pour composer `#150*50#`. Le seul
     rattrapage — « J'ai déjà payé », caché derrière le bouton « Obtenir mon
     code d'accès » — demandait de deviner qu'il faut cliquer sur « obtenir »
     pour « retrouver », et de ressaisir une référence que `sessionStorage`
     venait justement d'oublier.

     On tente donc UNE réclamation silencieuse à chaque ouverture de page tant
     qu'un achat reste en attente. Elle ne coûte rien quand il n'y en a pas, et
     quand il y en a un, l'acheteur retrouve son écran de code sans rien
     demander à personne. Silencieuse en cas d'échec : un client dont le
     paiement n'a pas encore abouti n'a pas à lire une erreur à chaque visite. */
  (function repriseAchat() {
    var a = achatLu();
    if (!a || !a.ref || !a.t4) return;      // sans les 4 chiffres, rien à tenter
    var lancer = function () {
      VRT.reclamer(a.ref, a.t4)
        .then(function (c) { if (c && (c.code || c.codes)) ecranCode(c); })
        .catch(function () { /* pas encore confirmé : on réessaiera au prochain passage */ });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', lancer);
    } else { lancer(); }
  })();

  /* ── LE HORS LIGNE NE DOIT PAS DÉPENDRE DE LA PAGE PAR OÙ L'ON ENTRE ───────
     « La connexion reste chère au Cameroun et pas toujours accessible » : c'est
     la phrase qui a fait écrire `sw-cahier.js`. Mais il n'était enregistré que
     par `cahier.html` et `apercu.html`.

     Or depuis l'unification de la boutique (30/08/2026), la carte d'un cahier
     dépose l'acheteur sur la page de SON ouvrage — `/livrets/6e.html` pour un
     cahier de 6ᵉ, `/livrets/bord-6e.html` pour un Bord. Ces pages-là
     n'enregistraient AUCUN service worker : la coquille des quatre cahiers les
     plus vendus (6ᵉ, 5ᵉ, 4ᵉ, 3ᵉ) ne partait donc jamais en cache. Sans réseau,
     la page ne s'ouvrait pas — pendant que son contenu, lui, attendait
     tranquillement dans IndexedDB. C'est mot pour mot la panne que
     `sw-cahier.js` a été écrit pour empêcher : « garder le CONTENU sur
     l'appareil ne sert à rien si la PAGE qui l'affiche ne se charge pas ».

     On enregistre donc ici, dans le seul fichier que TOUTES les surfaces
     chargent — les quatre coquilles, le feuilletage, le lecteur générique, les
     pages d'ouvrage. `register()` avec la même adresse et la même portée est
     idempotent : les deux pages qui le faisaient déjà ne le font pas deux fois.

     Sans blocage et sans bruit : sur un navigateur qui n'en veut pas
     (navigation privée, vieux WebView), tout doit s'ouvrir comme avant — le
     hors ligne est un confort, jamais une condition. */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    var poserSW = function () {
      navigator.serviceWorker.register('/livrets/sw-cahier.js', { scope: '/livrets/' })
        .catch(function () { /* pas de hors ligne, et c'est tout */ });
    };
    if (document.readyState === 'complete') poserSW();
    else window.addEventListener('load', poserSW);
  }

  window.VRTLivret = VRT;
})();
