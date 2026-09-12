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
  /* ⚠️ CES DEUX CHIFFRES NE SERVENT PAS QU'À AFFICHER — ils partaient aussi
     comme `montant` à `?action=init`. Le commentaire qui prétendait le
     contraire a masqué le vrai risque : le serveur annonce ses tarifs
     réglables en base (`DB.tarifs.livret` / `livretGuide`), et le jour où
     l'administration passe le cahier à 2 000 F, ce fichier continue d'envoyer
     1 500. Le contrôle de sous-paiement — celui qui protège si bien contre les
     requêtes forgées — refuse alors CHAQUE VENTE LÉGITIME, après encaissement,
     et le refus ne s'affiche que dans le tableau de bord.

     Le catalogue publie désormais le tarif EFFECTIF (celui que l'octroi ira
     chercher). On le lit, et on garde ces valeurs en repli : si la sonde ne
     répond pas, mieux vaut proposer le prix habituel que bloquer la vente. */
  var PRIX  = { livret: 1500, guide: 5000 };
  var tarifsLus = false;
  function resoudreTarifs() {
    if (tarifsLus) return Promise.resolve(PRIX);
    return fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"action":"catalogue"}',
      cache: 'no-store'
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j.ok || !Array.isArray(j.ouvrages)) return PRIX;
        var slug = String(cfg.classe || '').toLowerCase();
        for (var i = 0; i < j.ouvrages.length; i++) {
          var o = j.ouvrages[i];
          if (String(o.slug || '').toLowerCase() !== slug) continue;
          // Un tarif nul n'est pas un tarif : on ne remplace que ce qui est chiffré.
          if (parseInt(o.prix, 10) > 0)      PRIX.livret = parseInt(o.prix, 10);
          if (parseInt(o.prixGuide, 10) > 0) PRIX.guide  = parseInt(o.prixGuide, 10);
          break;
        }
        tarifsLus = true;
        return PRIX;
      })
      .catch(function () { return PRIX; });
  }
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
    var motif = 'url("data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '")';
    d.style.cssText = 'position:fixed;inset:0;z-index:6;pointer-events:none;'
      + 'background-repeat:repeat;-webkit-print-color-adjust:exact;print-color-adjust:exact;'
      + 'background-image:' + motif;
    document.body.appendChild(d);

    /* ⚠️ `position:fixed` NE COUVRE QUE LA PREMIÈRE PAGE À L'IMPRESSION.
       Ce filigrane est présenté comme « présent à l'écran ET à l'impression »,
       et il l'est — sur la feuille 1. Les suivantes sortaient nues : sur un
       cahier qui fait deux cents pages, cela veut dire un PDF propre, sans
       nom, prêt à circuler. Or c'est le seul recours réel contre la
       rediffusion : aucune page web n'empêche une photo, mais un exemplaire
       signé désigne celui qui l'a fait circuler.

       On expose donc le motif au CSS, qui le repose sur `html` en impression :
       un fond d'élément racine SE RÉPÈTE sur toutes les pages, là où un
       élément fixe ne le fait pas. */
    try {
      document.documentElement.style.setProperty('--vrt-wm', motif);
    } catch (_) {}

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
  // `veut` en fait partie : la console des devoirs demande le CAHIER avec un
  // jeton d'enseignant (voir `config`). Sans ce troisième terme, elle rangerait
  // le cahier sous la clé du guide, et l'enseignant qui rouvre son guide hors
  // ligne y trouverait le cahier de l'élève — sans un seul corrigé.
  function cleCache() {
    return cfg.classe + '|' + cfg.kind + (cfg.veut ? '|' + cfg.veut : '');
  }

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
    /* ── UN OUVRAGE QU'ON FEUILLETTE N'INSTALLE RIEN, ET C'EST NORMAL ────────
       Tout ce qui suit juge une CHARGE : un fichier de blocs qui doit se
       dérouler et poser sa globale. Un ouvrage en mode lecture n'en a pas — son
       contenu est une suite d'images que le serveur sert page par page, sous ce
       même jeton. La boucle concluait donc « rien n'est installé », donc
       « abîmé », et `charger()` jetait `corrupt` : bandeau rouge « le fichier
       de ce cahier est abîmé sur le serveur » sur un ouvrage parfaitement sain,
       et le lecteur ne s'ouvrait pas.
       Le serveur annonce le mode ; on le croit sur parole, puisque c'est lui
       qui décide de ce qu'il envoie. Le filigrane, lui, se pose comme partout :
       c'est le même, et il sert autant sur une page feuilletée. */
    if (r.mode === 'lecture') {
      etat.wm = r.wm || null;
      filigrane(etat.wm);
      bandeauEcheance();
      return { ok: true, echecs: [] };
    }
    /* ⚠️ « ESSENTIEL » N'EST PAS TOUJOURS LE LIVRET. Chaque livraison porte
       DEUX fichiers : l'élève reçoit son cahier plus les corrigés (bouton
       « Voir la correction »), l'enseignant reçoit son guide plus le cahier
       pour suivre sa classe. Le fichier joint peut manquer sans que rien ne
       soit cassé — mais lequel est joint dépend de qui demande. Juger
       « booklet » indispensable dans les deux cas fermerait le guide d'un
       enseignant parce que le cahier de l'élève, lui, est abîmé. */
    /* Ce qu'on est venu chercher — et la console des devoirs, avec un jeton
       d'enseignant, vient chercher le CAHIER. Juger le guide indispensable
       dans son cas déclarerait la livraison manquée alors qu'elle est
       exactement celle qui a été demandée. */
    var essentiel = (cfg.veut === 'booklet') ? 'booklet'
                  : (((r.kind || cfg.kind) === 'guide') ? 'guide' : 'booklet');
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
    return post(API, { action: 'content', token: token, veut: cfg.veut || undefined }).then(function (r) {
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
      // Sauf un feuilletage : il n'a pas de charge, et sa copie ne contiendrait
      // qu'un filigrane. Rangée quand même, elle ferait croire à `resume()`
      // qu'un ouvrage est lisible hors ligne alors que chacune de ses pages
      // vient du réseau — porte ouverte sur un livre vide, sans un mot.
      if (r.mode !== 'lecture') cacheEcrire(r);
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
      /* `veut:'booklet'` — la console des devoirs, seule, demande le CAHIER avec
         un jeton d'enseignant : elle y choisit les exercices à donner, et un
         exercice doit être désigné sous la clé que le cahier de l'ÉLÈVE lui
         donne. Composé depuis le guide, le devoir renverrait à des exercices
         que l'élève ne retrouverait pas (mesuré : zéro clé commune sur 467).
         Le serveur reste seul juge : il n'honore ce souhait que pour un jeton
         d'enseignant, et n'envoie jamais qu'une charge à la fois. */
      cfg.veut   = (o && o.veut === 'booklet') ? 'booklet' : '';
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

    /** Recevoir une copie du code par e-mail (apres coup, depuis l'ecran de
     *  code). Meme garde que `reclamer` cote serveur : reference + numero. */
    copie: function (ref, tel, mail) {
      return post(API, { action: 'copie', ref: ref, tel: tel, mail: mail });
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

  /* ⚠️ LES GUILLEMETS DE LA POLICE FERMAIENT L'ATTRIBUT. Cette constante est
     posée dans `style="' + BTN + '"` : le `"` de `"Baloo 2"` y terminait
     l'attribut, et TOUT ce qui suit — graisse, taille, remplissage, rayon,
     curseur — était jeté par l'analyseur. Mesuré au navigateur le
     12/09/2026 : le bouton rendait 17 px de haut, en Arial 13 px, sans
     remplissage. Les trois boutons concernés sont ceux du tunnel d'achat —
     « Payer N FCFA », « Retrouver mon code », « Ouvrir mon livret ». Le plus
     visible des défauts, et invisible à la lecture : la feuille est correcte,
     c'est sa POSE qui ne l'était pas.
     Apostrophes échappées : `'Baloo 2'` est valide dans un attribut délimité
     par des guillemets doubles, et ne le referme pas. */
  var BTN = 'width:100%;border:none;background:#c0453f;color:#fff;font-family:\'Baloo 2\',sans-serif;'
    + 'font-weight:800;font-size:16px;padding:12px;border-radius:10px;cursor:pointer;margin-top:10px';
  var BTN2 = 'width:100%;border:1px solid #cfd6dd;background:#fff;color:#5c666f;font-weight:700;'
    + 'font-size:13px;padding:9px;border-radius:10px;cursor:pointer;margin-top:8px';
  var INP = 'width:100%;box-sizing:border-box;margin:10px 0 4px;padding:11px 14px;border:2px solid #cfd6dd;'
    + 'border-radius:10px;font-size:16px;text-align:center;letter-spacing:.06em';
  /* Le vert de WhatsApp, et pas celui de la maquette : ce bouton doit se
     reconnaitre AVANT d'etre lu. C'est le seul endroit du tunnel ou l'on
     emprunte la couleur d'un tiers, et c'est justifie — l'acheteur cherche
     l'icone qu'il connait, pas un bouton de plus. */
  var BTNWA = 'width:100%;border:none;background:#25D366;color:#fff;font-weight:800;'
    + 'font-size:14px;padding:11px;border-radius:10px;cursor:pointer;margin-top:8px;'
    + 'display:flex;align-items:center;justify-content:center;gap:8px';
  /* Même défaut que BTN, et trouvé par le banc et non à l'œil : ce titre est
     posé dans `style="' + TTL + '"`, le guillemet de la police y refermait
     l'attribut, et « Ton code d'accès » sortait en Arial 13 px au lieu de
     Baloo 2 en 21 gras. */
  var TTL = 'font-family:\'Baloo 2\',sans-serif;font-weight:800;font-size:21px;color:#1f2b38;margin:8px 0 4px';
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
      /* ══ ESSAYER AVANT D'ACHETER ═══════════════════════════════════════════
         `livrets/apercu.html` existe depuis longtemps — deux leçons entières,
         gratuites, avec leurs corrections. `livrets/index.html` y mène 23 fois.
         Mais depuis l'unification de la boutique (30/08), la carte d'un cahier
         dépose l'acheteur sur la page de SON ouvrage — /livrets/6e.html — et
         ces pages-là n'y mènent PAS une seule fois : vérifié, 0 occurrence dans
         6e.html, 4e.html, 2nde.html. Le seul chemin réel vers l'achat était
         donc le seul d'où l'essai gratuit avait disparu.

         On le remet ICI plutôt que dans chaque coquille : gate.js est le seul
         fichier que toutes chargent, et c'est la leçon déjà tirée pour la règle
         d'impression — cinq endroits où poser la même chose, c'est cinq endroits
         pour l'oublier à la prochaine publication.

         SOUS le bouton de paiement, pas au-dessus : celui qui est décidé ne doit
         pas être détourné. C'est l'hésitant qu'on rattrape, et l'aperçu ramène
         vers l'achat par ses propres boutons (« Obtenir mon code — 1 500 FCFA »). */
      /* ⚠️ L'APERÇU EST PROPRE À L'OUVRAGE : apercu.html lit `?o=<slug>` et
         retombe sur « 6e » quand le paramètre manque. Un lien nu y envoyait
         donc TOUT LE MONDE sur l'aperçu de sixième — un enseignant de
         Terminale compris, qui en aurait conclu que le cahier n'est pas le
         sien. On passe `cfg.classe`, le slug que le tunnel connaît déjà. */
      + '<a id="vrt-essai" href="/livrets/apercu.html?o='
        + encodeURIComponent(cfg.classe || '6e') + '" style="' + BTN2
        + ';display:block;text-align:center;text-decoration:none;box-sizing:border-box">'
        + 'Lire deux leçons gratuitement, sans payer</a>'
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

    /* ── LE PRIX AFFICHÉ ET LE PRIX ENCAISSÉ ÉTAIENT DEUX CHIFFRES ─────────
       `resoudreTarifs()` n'était appelée qu'au CLIC sur « Payer ». Le montant
       envoyé à `?action=init` était donc juste — il est calculé après elle —
       mais la modale, elle, s'était ouverte avec le repli écrit en tête de
       fichier : 1 500 F.

       Tant que tous les cahiers valaient 1 500 F, personne ne pouvait le
       voir. Les quatre cahiers d'œuvres du collège en valent 1 000 : leur
       écran de paiement annonçait « 1 500 FCFA » et « Payer 1 500 FCFA »
       pour un débit de 1 000. Ni l'un ni l'autre chiffre n'était faux tout
       seul — c'est leur écart qui l'était, sur le seul écran où quelqu'un
       sort de l'argent.

       On lance donc la sonde à l'OUVERTURE, et on redessine dès qu'elle
       répond. La modale ne l'attend pas : elle s'ouvre tout de suite avec le
       repli, puis se corrige — mieux vaut un prix qui s'ajuste en un clin
       d'œil qu'un tunnel qui met une seconde à s'ouvrir sur une connexion
       camerounaise. */
    var majPrix = function () {
      var n = qte;
      var champ = document.getElementById('vrt-n');
      if (champ) n = Math.max(1, Math.min(500, parseInt(champ.value, 10) || 1));
      var t = prix(cfg.kind, n);
      var b = document.getElementById('vrt-go');
      /* Le bouton peut être en cours de paiement (« Ouverture du paiement… ») :
         on ne réécrit que s'il porte encore son libellé de prix, sinon on
         effacerait l'état sous les yeux de l'acheteur. */
      if (b && /^Payer /.test(b.textContent)) b.textContent = 'Payer ' + fmt(t) + ' FCFA';
      var e = document.querySelector('#vrt-achat .vrt-prix');
      if (e) e.textContent = fmt(t) + ' FCFA';
      return { n: n, t: t };
    };

    resoudreTarifs().then(function () {
      // La modale a pu être fermée entre-temps : on ne ressuscite rien.
      if (document.getElementById('vrt-achat')) majPrix();
    });

    var champN = document.getElementById('vrt-n');
    if (champN) champN.oninput = function () {
      var r = majPrix();
      msg(r.n > 1 ? r.n + ' codes — ' + fmt(Math.round(r.t / r.n)) + ' F l’unité' : '', true);
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
    resoudreTarifs()
      .then(resoudrePasserelle)
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
        ecranCode(c, { ref: r, tel: tel });
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
      VRT.reclamer(r.trim(), t).then(function (c) { ecranCode(c, { ref: r.trim(), tel: t }); })
        .catch(function (e) {
          b.disabled = false; b.textContent = 'Retrouver mon code';
          msg(e.message || 'Introuvable.');
        });
    };
  }

  /* ══ « JE M'ENVOIE LE CODE » ═══════════════════════════════════════════════
     La reference d'achat vit dans le localStorage de l'appareil qui a paye.
     Telephone perdu, cache vide, achat depuis un cybercafe : l'acheteur n'a
     plus AUCUN chemin vers son code. Les canaux de remise automatique
     existent (api/_notify_lib.php sait faire mail, WhatsApp Cloud API et SMS)
     mais aucun n'est active, et celui qui l'est par defaut — le courriel —
     demande une adresse que l'acheteur ne laisse presque jamais : on paie ici
     avec un telephone.

     Ce bouton ne demande NI compte, NI API, NI abonnement, NI un franc. Il
     ouvre WhatsApp avec le message deja ecrit ; l'acheteur choisit son propre
     fil (« Message a moi-meme ») et l'envoie. Le code atterrit dans une
     conversation qu'il retrouvera dans six mois, sur n'importe quel appareil
     ou il se reconnecte — ce qu'aucun localStorage ne sait faire.

     Ce n'est PAS un remplacant de la remise automatique : elle part du serveur
     sans rien demander, lui exige un geste. C'est le filet qu'on peut poser
     aujourd'hui, en attendant qu'un canal soit configure. */
  function messageWhatsApp(codes, classe) {
    var url = location.origin + location.pathname;
    var quoi = classe ? ('Cahier ' + String(classe).toUpperCase()) : 'Mon cahier VÉRITAS';
    return 'VÉRITAS — mon code d’accès\n'
         + quoi + '\n\n'
         + codes + '\n\n'
         + 'Ouvrir : ' + url + '\n'
         + 'À garder : ce code ouvre ton cahier toute l’année.';
  }
  /* wa.me SANS numero = WhatsApp demande a QUI envoyer, et c'est exactement ce
     qu'on veut : l'acheteur se choisit lui-meme. Un numero code en dur
     enverrait le code au centre, ce qui n'aide personne.
     Plafond de longueur : au-dela, certains navigateurs Android tronquent
     l'URL en silence — et un code tronque est pire qu'un bouton absent. */
  function lienWhatsApp(texte) {
    var u = 'https://wa.me/?text=' + encodeURIComponent(texte);
    return u.length > 1800 ? '' : u;
  }

  /* `ctx` porte la reference et le numero du payeur — les deux seuls elements
     qui autorisent l'envoi d'une copie. Ils sont connus des trois appelants
     (sondage apres paiement, saisie manuelle, reprise au chargement) mais
     `ecranCode` les ignorait : on les lui passe plutot que de les relire dans
     le localStorage, qu'`achatEfface()` vient justement de vider deux lignes
     plus bas. Absent, le champ e-mail ne s'affiche pas — on ne propose pas un
     geste qu'on ne saurait pas verifier. */
  function ecranCode(r, ctx) {
    // L'achat est honoré : on cesse de le suivre, sinon chaque ouverture de
    // page rejouerait une réclamation pour un code déjà remis.
    achatEfface();
    // Un pack établissement rend TOUT le lot : le proviseur doit pouvoir le
    // distribuer, donc le copier d'un bloc.
    var lot     = (r && r.codes && r.codes.length > 1) ? r.codes : null;
    var code    = (r && r.code) || r;
    var aCopier = lot ? lot.join('\n') : code;
    /* Un pack etablissement peut porter des centaines de codes : le message
       depasserait la longueur d'URL tenable et partirait tronque. Le bouton
       disparait alors, et « Copier » reste — un proviseur distribue depuis un
       ordinateur, pas depuis WhatsApp. */
    var lienWA = lienWhatsApp(messageWhatsApp(aCopier, r && r.classe));
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
      + (lienWA
          ? '<button id="vrt-wa" style="' + BTNWA + '">'
            + '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z"/></svg>'
            + "M'envoyer le code sur WhatsApp</button>"
          : '')
      + '<button id="vrt-open" style="' + BTN + '">Ouvrir mon livret</button>'
      + (ctx && ctx.ref
          ? '<div style="margin-top:14px;padding-top:13px;border-top:1px solid #eef1f4">'
            + '<div style="font-size:12.5px;color:#5c666f;margin-bottom:7px">'
            + 'Recevoir une copie par e-mail — pour le retrouver si tu changes de téléphone.'
            + '</div>'
            + '<input id="vrt-mail" type="email" inputmode="email" autocomplete="email" '
            + 'placeholder="ton@email.com" style="' + INP + '">'
            + '<button id="vrt-mail-go" style="' + BTN2 + '">M’envoyer une copie</button>'
            + '</div>'
          : '')
      + '<div id="vrt-msg" style="font-size:12.5px;min-height:17px;margin-top:6px"></div>'
      + '</div>'
    );
    document.getElementById('vrt-copy').onclick = function () {
      try { navigator.clipboard.writeText(aCopier); msg(lot ? 'Les ' + lot.length + ' codes sont copiés.' : 'Code copié.', true); }
      catch (e) { msg('Copie impossible — note-les à la main.'); }
    };
    if (lienWA) {
      document.getElementById('vrt-wa').onclick = function () {
        /* `noopener` : la page qui s'ouvre ne doit pas pouvoir manipuler
           celle-ci, qui porte le code a l'ecran. */
        window.open(lienWA, '_blank', 'noopener');
        msg("WhatsApp s’ouvre — choisis ton propre nom pour te l’envoyer.", true);
      };
    }
    /* L'envoi d'une copie : le serveur re-verifie la reference ET le numero
       (meme garde que `claim`). Le bouton se verrouille pendant l'appel —
       deux appuis rapides feraient deux remises pour le meme code. */
    var champMail = document.getElementById('vrt-mail-go');
    if (champMail) {
      champMail.onclick = function () {
        var m = (document.getElementById('vrt-mail') || {}).value || '';
        if (!m.trim()) { msg('Écris ton adresse e-mail.'); return; }
        var b = this; b.disabled = true; b.textContent = 'Envoi…';
        VRT.copie(ctx.ref, ctx.tel || '', m.trim())
          .then(function (d) {
            b.textContent = 'Copie demandée';
            /* On ne PROMET pas la reception : la remise part en file et peut
               echouer chez l'operateur. Dire « envoye » puis ne rien livrer
               est exactement ce qu'on essaie d'arreter. */
            msg(d && d.etat === 'deja_envoye'
                ? 'Cette adresse a déjà reçu le code.'
                : 'C’est noté — la copie part à cette adresse.', true);
          })
          .catch(function (e) {
            b.disabled = false; b.textContent = 'M’envoyer une copie';
            msg((e && e.message) || 'Envoi impossible.');
          });
      };
    }
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
        .then(function (c) { if (c && (c.code || c.codes)) ecranCode(c, { ref: a.ref, tel: a.t4 }); })
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
