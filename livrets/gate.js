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
  var PAY   = '/api/payment_camerpay.php';
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
  function installer(r) {
    var js = r.js || {};
    ['booklet', 'guide'].forEach(function (k) {
      if (typeof js[k] === 'string' && js[k]) {
        try { (new Function(js[k]))(); }
        catch (e) { console.error('[livret] données ' + k + ' illisibles', e); }
      }
    });
    etat.wm = r.wm || null;
    filigrane(etat.wm);
    bandeauEcheance();
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
      installer(r);
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
          if (e && e.code === 'net') {
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
              bandeauHorsLigne((c.maj || 0) + BAIL_HORS_LIGNE);
              return true;
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
    var champN = document.getElementById('vrt-n');
    var n = champN ? Math.max(1, Math.min(500, parseInt(champN.value, 10) || 1)) : qte;
    var b = document.getElementById('vrt-go');
    b.disabled = true; b.textContent = 'Ouverture du paiement…';
    msg('');

    var r = ref();
    fetch(PAY + '?action=config', { cache: 'no-store' })
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
            clientTel: chiffres
          })
        });
      })
      .then(function (x) { return x.json(); })
      .then(function (j) {
        if (!j || (!j.pay_url && !j.success)) throw ErrPorte(j && j.error ? j.error : 'Initiation refusée.', 'init');
        try { sessionStorage.setItem('vrt-livret-ref', r); } catch (e) {}
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
    document.getElementById('vrt-close').onclick = function () { clearInterval(boucle); fermerModale(); };

    var essais = 0;
    // Sondage borné : 5 s × 96 ≈ 8 minutes. Au-delà, le paiement n'aboutira
    // probablement plus dans cette session — le code reste réclamable plus tard.
    var boucle = setInterval(function () {
      essais++;
      if (essais > 96) { clearInterval(boucle); msg('Toujours rien. Utilise « J\'ai déjà payé » quand le paiement sera confirmé.'); return; }
      VRT.reclamer(r, tel).then(function (c) {
        clearInterval(boucle);
        ecranCode(c);
      }).catch(function () { /* pas encore payé : on continue */ });
    }, 5000);
  }

  function ecranReclamation() {
    var dernier = '';
    try { dernier = sessionStorage.getItem('vrt-livret-ref') || ''; } catch (e) {}
    modale(
      '<div style="text-align:center">'
      + '<div style="font-size:38px">🔎</div>'
      + '<div style="' + TTL + '">Retrouver mon code</div>'
      + '<div style="' + SUB + '">Saisis la référence de ton paiement et les 4 derniers chiffres '
      + 'du numéro qui a payé.</div>'
      + '<input id="vrt-ref" type="text" placeholder="Référence (LV…)" value="' + esc(dernier) + '" style="' + INP + '">'
      + '<input id="vrt-t4" type="tel" inputmode="numeric" maxlength="4" placeholder="4 derniers chiffres" style="' + INP + '">'
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

  window.VRTLivret = VRT;
})();
