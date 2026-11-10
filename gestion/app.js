/* VÉRITAS Gestion — application des centres (gestion.veritas-school.com)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * JavaScript simple, sans compilation. Hors ligne d'abord :
 *   - les données lisibles par le compte sont copiées dans IndexedDB ;
 *   - chaque modification est appliquée tout de suite à l'écran ET rangée dans
 *     une file « sortie » ; elle part au serveur dès que le réseau le permet ;
 *   - le serveur reste seul juge des droits : une opération refusée est retirée
 *     et l'écran revient à la version du serveur.
 * Aucune donnée ne vit dans le code : tout vient de l'API (api/index.php).
 * Ni onclick ni style en ligne (CSP) : actions par data-a, formulaires par data-f.
 */
(function () {
  'use strict';

  var VERSION = '0.13.5';
  var BASE = window.VERITAS_GESTION_BASE || '';
  var API = BASE + 'api/index.php';
  /** Dans l'application Android (Capacitor) : partage et fichiers passent par les modules natifs. */
  var NATIF = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  var INTERVALLE_SYNC = 25000;
  var VERROU_APRES_MS = 5 * 60 * 1000;

  var ROLES = {
    responsable: 'Responsable',
    actionnaire: 'Actionnaire',
    secretaire: 'Secrétaire / surveillant',
    enseignant: 'Enseignant'
  };
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  // ───────────────────────────── Outils ─────────────────────────────
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function $(sel, racine) { return (racine || document).querySelector(sel); }
  /** Icône du sprite de index.html (jeu « lc- » de VÉRITAS). */
  function ico(nom, cls) {
    return '<svg class="ico' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#lc-' + nom + '"/></svg>';
  }
  function nouvelId() {
    var o = new Uint8Array(10);
    crypto.getRandomValues(o);
    return Array.prototype.map.call(o, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  function initiales(nom) {
    return String(nom || '?').trim().split(/\s+/).slice(0, 2).map(function (m) { return m.charAt(0); }).join('').toUpperCase();
  }
  function maintenantSql() {
    var d = new Date();
    function p(n) { return ('0' + n).slice(-2); }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  }
  /** « 2026-11-02 08:05:00 » → « 02/11/2026 à 08 h 05 » */
  function dateLisible(sql, sansHeure) {
    if (!sql) return '—';
    var m = String(sql).match(/^(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2}))?/);
    if (!m) return esc(sql);
    var j = m[3] + '/' + m[2] + '/' + m[1];
    return sansHeure || !m[4] ? j : j + ' à ' + m[4] + ' h ' + m[5];
  }
  function jourLisible(sql) {
    var m = String(sql).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return '';
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    var auj = new Date(); auj.setHours(0, 0, 0, 0);
    var diff = Math.round((auj - d) / 86400000);
    if (diff === 0) return 'Aujourd\'hui';
    if (diff === 1) return 'Hier';
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  function pourcent(centiemes) {
    var v = (Number(centiemes) || 0) / 100;
    return v.toLocaleString('fr-FR', { maximumFractionDigits: 2 }) + ' %';
  }
  function toast(msg, erreur) {
    var t = document.createElement('div');
    t.className = 'toast' + (erreur ? ' erreur-t' : '');
    t.textContent = msg;
    $('#toasts').appendChild(t);
    setTimeout(function () { t.remove(); }, erreur ? 6000 : 3200);
  }
  function copier(texte) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(texte).then(function () { toast('Copié.'); }, function () { toast('Copie impossible : sélectionnez le texte.', true); });
    }
    toast('Copie impossible : sélectionnez le texte.', true);
    return Promise.resolve();
  }

  // ───────────────────────────── IndexedDB ─────────────────────────────
  var idb = null;
  function ouvrirIdb() {
    return new Promise(function (ok, ko) {
      var r = indexedDB.open('veritas-gestion', 2);
      r.onupgradeneeded = function () {
        var db = r.result;
        if (!db.objectStoreNames.contains('lignes')) {
          var l = db.createObjectStore('lignes', { keyPath: 'k' });
          l.createIndex('t', 't');
        }
        if (!db.objectStoreNames.contains('sortie')) db.createObjectStore('sortie', { keyPath: 'op' });
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'cle' });
        // v2 : photos de justificatifs prises hors ligne, envoyées au retour du réseau.
        if (!db.objectStoreNames.contains('fichiers')) db.createObjectStore('fichiers', { keyPath: 'id' });
      };
      r.onsuccess = function () { idb = r.result; ok(); };
      r.onerror = function () { ko(r.error); };
    });
  }
  function magasin(nom, mode) { return idb.transaction(nom, mode || 'readonly').objectStore(nom); }
  function promesse(req) {
    return new Promise(function (ok, ko) { req.onsuccess = function () { ok(req.result); }; req.onerror = function () { ko(req.error); }; });
  }
  function idbTout(nom) { return promesse(magasin(nom).getAll()); }
  function idbMettre(nom, val) { return promesse(magasin(nom, 'readwrite').put(val)); }
  function idbSuppr(nom, cle) { return promesse(magasin(nom, 'readwrite').delete(cle)); }
  function idbVider(nom) { return promesse(magasin(nom, 'readwrite').clear()); }
  function metaLire(cle) { return promesse(magasin('meta').get(cle)).then(function (r) { return r ? r.v : null; }); }
  function metaEcrire(cle, v) { return idbMettre('meta', { cle: cle, v: v }); }

  // ───────────────────────────── État ─────────────────────────────
  var E = {
    jeton: null,
    profil: null,         // { utilisateur, acces, capacites }
    centre: '',           // id du centre choisi, '*' = tous mes centres
    donnees: {},          // table → { id → ligne }
    sortie: [],           // opérations en attente d'envoi
    rejets: [],           // opérations refusées par le serveur (affichées)
    rev: 0,
    equipe: [],           // [{ id, nom, matieres, centre_id, role }] — pour l'emploi du temps hors ligne
    enLigne: navigator.onLine,
    syncEnCours: false,
    derniereSync: null,
    verrouille: false,
    cache: {}             // réponses des écrans en ligne (comptes, journal…)
  };

  // ───────────────────────────── Droits (miroir du serveur) ─────────────────────────────
  function estAdmin() { return !!(E.profil && E.profil.utilisateur.admin); }
  function roleDans(centreId) { return E.profil && E.profil.acces ? E.profil.acces[centreId] || null : null; }
  function peut(cap, centreId) {
    if (estAdmin()) return true;
    if ((E.profil.restrictions || []).indexOf(cap) >= 0) return false;
    var r = roleDans(centreId);
    return !!(r && (E.profil.capacites[r] || []).indexOf(cap) >= 0);
  }
  function peutQuelquePart(cap) {
    if (estAdmin()) return true;
    if ((E.profil.restrictions || []).indexOf(cap) >= 0) return false;
    return Object.keys(E.profil.acces || {}).some(function (c) { return peut(cap, c); });
  }
  /** Centres concernés par le sélecteur (« * » = tous ceux du compte). */
  function centresChoisis() {
    var tous = lignes('centres');
    return E.centre === '*' ? tous : tous.filter(function (c) { return c.id === E.centre; });
  }

  // ───────────────────────────── API ─────────────────────────────
  function api(route, corps, params) {
    var url = API + '?r=' + encodeURIComponent(route);
    Object.keys(params || {}).forEach(function (k) { url += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); });
    var opts = { method: corps ? 'POST' : 'GET', headers: {}, cache: 'no-store' };
    if (corps) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(corps); }
    if (E.jeton && route !== 'auth/connexion') opts.headers.Authorization = 'Bearer ' + E.jeton;
    return fetch(url, opts).then(function (rep) {
      return rep.json().catch(function () { return { ok: false, error: 'Réponse illisible du serveur (' + rep.status + ').' }; })
        .then(function (j) {
          if (rep.status === 401 && E.jeton && route !== 'auth/connexion') {
            finSession(j.error || 'Session expirée.');
          }
          if (!rep.ok || !j.ok) { var e = new Error(j.error || 'Erreur ' + rep.status); e.code = rep.status; throw e; }
          return j;
        });
    }, function () {
      var e = new Error('Pas de connexion internet.');
      e.reseau = true;
      throw e;
    });
  }

  // ───────────────────────────── Données locales ─────────────────────────────
  function lignes(t) {
    var m = E.donnees[t] || {};
    return Object.keys(m).map(function (id) { return m[id]; })
      .filter(function (l) { return !Number(l.supprime); })
      .sort(function (a, b) { return (Number(a.ordre) || 0) - (Number(b.ordre) || 0) || String(a.nom || a.libelle || '').localeCompare(String(b.nom || b.libelle || ''), 'fr'); });
  }
  function ligne(t, id) { return (E.donnees[t] || {})[id] || null; }
  function poserLigne(t, l) {
    (E.donnees[t] = E.donnees[t] || {})[l.id] = l;
    return idbMettre('lignes', { k: t + '/' + l.id, t: t, l: l });
  }
  function chargerLocal() {
    return Promise.all([idbTout('lignes'), idbTout('sortie')]).then(function (r) {
      E.donnees = {};
      r[0].forEach(function (x) { (E.donnees[x.t] = E.donnees[x.t] || {})[x.l.id] = x.l; });
      E.sortie = r[1].sort(function (a, b) { return a.n - b.n; });
    });
  }

  /** Modification locale immédiate + mise en file d'envoi. */
  function muter(t, id, champs, suppr) {
    var op = { op: nouvelId(), t: t, id: id, champs: champs || {}, suppr: !!suppr, n: Date.now(), uid: E.profil.utilisateur.id };
    var avant = ligne(t, id);
    var l = Object.assign({}, avant || { id: id, _nouveau: true }, champs || {}, { _attente: true, maj_le: maintenantSql() });
    l.supprime = suppr ? 1 : 0;
    E.sortie.push(op);
    return Promise.all([poserLigne(t, l), idbMettre('sortie', op)]).then(function () {
      majPuce();
      synchroniser();
    });
  }

  // ───────────────────────────── Synchronisation ─────────────────────────────
  /**
   * Un seul échange à la fois. Appelée pendant un échange, elle ATTEND sa fin, puis
   * repart si des modifications sont arrivées entre-temps : qui attend un résultat
   * (le numéro d'un reçu) l'obtient, au lieu d'un « fini » prématuré.
   */
  function synchroniser() {
    if (!E.jeton || E.verrouille) return Promise.resolve();
    if (E.syncEnCours) {
      return E.syncPromesse.then(function () { return E.sortie.length && E.enLigne ? synchroniser() : null; });
    }
    E.syncEnCours = true;
    majPuce();
    var uid = E.profil.utilisateur.id;
    var change = false;

    function pousser() {
      var lot = E.sortie.filter(function (o) { return o.uid === uid; }).slice(0, 200);
      if (!lot.length) return Promise.resolve();
      return api('sync/pousser', { ops: lot.map(function (o) { return { op: o.op, t: o.t, id: o.id, champs: o.champs, suppr: o.suppr }; }) })
        .then(function (r) {
          var faits = [];
          r.resultats.forEach(function (res) {
            var o = lot.filter(function (x) { return x.op === res.op; })[0];
            if (!o) return;
            faits.push(o.op);
            if (!res.ok) {
              E.rejets.unshift({ t: o.t, id: o.id, champs: o.champs, erreur: res.erreur, le: maintenantSql() });
              toast('Refusé par le serveur : ' + res.erreur, true);
              // Une création refusée n'existe pas côté serveur : on la retire de l'écran.
              var l = ligne(o.t, o.id);
              var autres = E.sortie.some(function (x) { return x.op !== o.op && x.t === o.t && x.id === o.id; });
              if (l && l._nouveau && !autres) {
                delete E.donnees[o.t][o.id]; idbSuppr('lignes', o.t + '/' + o.id);
                // Sa fiche est peut-être encore ouverte (reçu affiché aussitôt après « Encaisser ») : on la ferme.
                var fe = $('#feuille');
                if (fe && !fe.hidden && fe.querySelector('[data-id="' + o.id + '"]')) fermerFeuille();
              }
              change = true;
            }
          });
          E.sortie = E.sortie.filter(function (o) { return faits.indexOf(o.op) < 0; });
          return Promise.all(faits.map(function (op) { return idbSuppr('sortie', op); })).then(pousser);
        });
    }

    function tirer() {
      return api('sync/tirer', null, { depuis: E.rev }).then(function (r) {
        var ecritures = [];
        Object.keys(r.lignes).forEach(function (t) {
          r.lignes[t].forEach(function (srv) {
            // Une modification locale encore en file garde la main sur ses champs.
            var enAttente = E.sortie.filter(function (o) { return o.t === t && o.id === srv.id; });
            var l = srv;
            if (enAttente.length) {
              l = Object.assign({}, srv, { _attente: true });
              enAttente.forEach(function (o) { Object.assign(l, o.champs); if (o.suppr) l.supprime = 1; });
            }
            var avant = ligne(t, srv.id);
            if (!avant || avant.rev !== l.rev || avant._attente !== l._attente) { change = true; ecritures.push(poserLigne(t, l)); }
          });
        });
        E.rev = r.rev;
        ecritures.push(metaEcrire('rev', r.rev));
        if (r.equipe && JSON.stringify(r.equipe) !== JSON.stringify(E.equipe)) {
          E.equipe = r.equipe; change = true;
          ecritures.push(metaEcrire('equipe', r.equipe));
        }
        return Promise.all(ecritures);
      });
    }

    E.syncPromesse = pousser().then(tirer).then(envoyerJustificatifs).then(reserverTranches).then(function () {
      E.enLigne = true;
      E.derniereSync = Date.now();
    }, function (e) {
      if (e.reseau) { E.enLigne = false; }
      else if (e.code !== 401) { toast('Synchronisation : ' + e.message, true); }
    }).then(function () {
      E.syncEnCours = false;
      majPuce();
      if (change) rendre(); else majCloche();
      if (change && E.cache.filOuvert && $('#zone-fil')) { var fo = E.cache.filOuvert; $('#zone-fil').innerHTML = bullesFil(fo.cid, fo.fil); marquerLu(fo.cid, fo.fil); }
      verifierRappels();
    });
    return E.syncPromesse;
  }

  // ── Tranches de numéros de reçu : réservées en ligne, consommées hors ligne ──
  function prefixeAnnee() {
    var an = anneeActive();
    var m = an && String(an.libelle).match(/^\d{2}(\d{2})-\d{2}(\d{2})$/);
    return m ? m[1] + m[2] : '';
  }
  function numerosLibres(cid) {
    var pre = prefixeAnnee();
    var pris = {};
    lignes('paiements').forEach(function (p) { if (p.numero) pris[p.numero] = 1; });
    var libres = [];
    ((E.tranches || {})[cid] || []).forEach(function (t) {
      if (t.prefixe !== pre) return;
      for (var n = t.debut; n <= t.fin; n++) { var num = t.prefixe + '-' + ('000' + n).slice(-4); if (!pris[num]) libres.push(num); }
    });
    return libres;
  }
  function reserverTranches() {
    if (!E.profil) return Promise.resolve();
    var centres = lignes('centres').filter(function (c) { return peut('paiements.encaisser', c.id) && numerosLibres(c.id).length < 10; });
    return centres.reduce(function (suite, c) {
      return suite.then(function () {
        return api('recus/tranche', { centre: c.id }).then(function (r) {
          E.tranches = E.tranches || {};
          E.tranches[c.id] = r.tranches || [];
          return metaEcrire('tranches', E.tranches);
        }, function () {});
      });
    }, Promise.resolve());
  }

  // ── Photos de justificatifs : gardées sur le téléphone jusqu'à l'envoi ──
  function envoyerJustificatifs() {
    return idbTout('fichiers').then(function (fichiers) {
      return fichiers.reduce(function (suite, f) {
        return suite.then(function () {
          // La dépense doit d'abord exister au serveur.
          if (E.sortie.some(function (o) { return o.t === 'depenses' && o.id === f.id; })) return;
          return api('justificatif/deposer', { id: f.id, jpeg: f.jpeg }).then(function (r) {
            var d = ligne('depenses', f.id);
            if (d) { d.justificatif = r.justificatif; poserLigne('depenses', d); }
            if (E.cache.erreurPhoto) delete E.cache.erreurPhoto[f.id];
            if (E.cache.photosEnAttente) delete E.cache.photosEnAttente[f.id];
            return idbSuppr('fichiers', f.id);
          }, function (e) {
            if (e.code === 409 || e.code === 422 || e.code === 403) { toast('Justificatif non envoyé : ' + e.message, true); return idbSuppr('fichiers', f.id); }
            // Autre échec (serveur, dépense pas encore arrivée…) : on réessaiera, mais on le dit dans la fiche de la dépense.
            (E.cache.erreurPhoto = E.cache.erreurPhoto || {})[f.id] = (e && e.message) || 'envoi impossible pour l\'instant';
          });
        });
      }, Promise.resolve());
    });
  }
  /** Photo → JPEG d'au plus 1 280 px (≈ 150 Ko), en base64. */
  function compresserPhoto(fichier) {
    return new Promise(function (ok, ko) {
      var url = URL.createObjectURL(fichier);
      var img = new Image();
      img.onload = function () {
        var k = Math.min(1, 1280 / Math.max(img.naturalWidth, img.naturalHeight));
        var cv = document.createElement('canvas');
        cv.width = Math.round(img.naturalWidth * k); cv.height = Math.round(img.naturalHeight * k);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(url);
        ok(cv.toDataURL('image/jpeg', 0.75).split(',')[1]);
      };
      img.onerror = function () { URL.revokeObjectURL(url); ko(new Error('Image illisible.')); };
      img.src = url;
    });
  }

  function majPuce() {
    var p = $('#puce-sync');
    if (!p) return;
    var n = E.sortie.length;
    p.className = 'puce-sync' + (!E.enLigne ? ' horsligne' : n ? ' attente' : '');
    p.textContent = E.syncEnCours ? 'Envoi…' : !E.enLigne ? (n ? 'Hors ligne · ' + n : 'Hors ligne') : n ? n + ' en attente' : 'À jour';
  }

  // ───────────────────────────── Session ─────────────────────────────
  function ouvrirSession(r) {
    var ancienUid = null;
    return metaLire('uid').then(function (u) {
      ancienUid = u;
      // Téléphone partagé : les données d'un autre compte ne restent jamais visibles.
      if (ancienUid && ancienUid !== r.utilisateur.id) return Promise.all([idbVider('lignes'), idbVider('sortie'), metaEcrire('rev', 0)]);
    }).then(function () {
      E.jeton = r.session.jeton;
      E.profil = { utilisateur: r.utilisateur, acces: r.acces || {}, capacites: r.capacites, restrictions: r.restrictions || [], retirables: r.retirables || [] };
      E.rev = ancienUid === r.utilisateur.id ? E.rev : 0;
      return Promise.all([metaEcrire('jeton', E.jeton), metaEcrire('profil', E.profil), metaEcrire('uid', r.utilisateur.id)]);
    }).then(chargerLocal).then(function () {
      choisirCentreParDefaut();
      location.hash = '#/accueil';
      rendre();
      return synchroniser();
    });
  }
  function choisirCentreParDefaut() {
    var ids = estAdmin() ? null : Object.keys(E.profil.acces || {});
    if (E.centre && (E.centre === '*' || !ids || ids.indexOf(E.centre) >= 0)) return;
    E.centre = !ids || ids.length !== 1 ? '*' : ids[0];
  }
  /** Session refusée par le serveur : on garde les données locales, on redemande la connexion. */
  function finSession(message) {
    E.jeton = null;
    metaEcrire('jeton', null);
    E.cache = {};
    rendre(message);
  }
  function deconnexion() {
    var n = E.sortie.length;
    var fin = function () {
      E.jeton = null; E.profil = null; E.donnees = {}; E.sortie = []; E.rejets = []; E.rev = 0; E.cache = {}; E.tranches = {};
      Promise.all([idbVider('lignes'), idbVider('sortie'), idbVider('meta'), idbVider('fichiers')]).then(function () { rendre(); });
    };
    var sortir = function () { api('auth/deconnexion', {}).then(fin, fin); };
    if (n) confirmer(n + ' modification(s) pas encore envoyée(s) seront perdues. Se déconnecter quand même ?', 'Se déconnecter', sortir);
    else sortir();
  }

  // ───────────────────────────── Code PIN (verrou de l'appareil) ─────────────────────────────
  // Le PIN protège un téléphone posé sur une table ; il ne remplace pas le mot de
  // passe : la session reste révocable à distance depuis « Comptes ».
  function hacherPin(pin, sel) {
    var enc = new TextEncoder();
    return crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveBits']).then(function (cle) {
      return crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(sel), iterations: 150000, hash: 'SHA-256' }, cle, 256);
    }).then(function (bits) {
      return Array.prototype.map.call(new Uint8Array(bits), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }
  var saisiePin = '';

  // Administration : INVISIBLE (demande de Jacques, 03/11/2026). Elle s'ouvre par un
  // appui long de 2 s sur le logo — impossible à déclencher en tapotant — et se
  // referme seule après 15 min, ou par le même appui long. Aucune tuile ni aucun lien
  // ne la signale tant qu'elle est fermée. (Le serveur reste seul juge des droits.)
  var PANNEAU_MS = 15 * 60 * 1000, APPUI_LONG_MS = 2000;
  function panneauOuvert() { return estAdmin() && !!E.panneauJusqua && Date.now() < E.panneauJusqua; }
  function basculerPanneau() {
    if (!estAdmin()) return;
    if (panneauOuvert()) { E.panneauJusqua = 0; toast('Administration refermée.'); location.hash = '#/accueil'; rendre(); return; }
    E.panneauJusqua = Date.now() + PANNEAU_MS;
    toast('Administration ouverte.');
    location.hash = '#/admin';
    rendre();
  }
  /** Écrans réservés : pour l'admin, seulement administration ouverte ; pour un responsable, selon ses droits. */
  function accesGestion(cap) { return estAdmin() ? panneauOuvert() : peutQuelquePart(cap); }
  /** Raccourcis de l'admin (« Ajouter un enseignant ») : ouvrent l'administration sans changer d'écran. */
  function ouvrirPanneauDiscret() { if (estAdmin() && !panneauOuvert()) E.panneauJusqua = Date.now() + PANNEAU_MS; }
  // Appui long sur le logo : pointeur (doigt ou souris) tenu 2 s sans bouger.
  (function () {
    var minuterie = null, x0 = 0, y0 = 0, declenche = false;
    var annuler = function () { if (minuterie) { clearTimeout(minuterie); minuterie = null; } };
    document.addEventListener('pointerdown', function (ev) {
      if (!ev.target.closest || !ev.target.closest('.entete .marque') || !estAdmin()) return;
      declenche = false; x0 = ev.clientX; y0 = ev.clientY; annuler();
      minuterie = setTimeout(function () {
        minuterie = null; declenche = true;
        if (navigator.vibrate) { try { navigator.vibrate(30); } catch (e) {} }
        basculerPanneau();
      }, APPUI_LONG_MS);
    });
    document.addEventListener('pointermove', function (ev) { if (minuterie && Math.abs(ev.clientX - x0) + Math.abs(ev.clientY - y0) > 12) annuler(); });
    ['pointerup', 'pointercancel'].forEach(function (t) { document.addEventListener(t, annuler); });
    // Après un appui long, le « clic » qui suit ne doit pas ramener à l'accueil ; et pas de menu du navigateur.
    document.addEventListener('click', function (ev) { if (declenche && ev.target.closest && ev.target.closest('.entete .marque')) { declenche = false; ev.preventDefault(); ev.stopImmediatePropagation(); } }, true);
    document.addEventListener('contextmenu', function (ev) { if (ev.target.closest && ev.target.closest('.entete .marque')) ev.preventDefault(); });
  })();
  function peutCreerEnseignant(cid) { return estAdmin() || peut('comptes.gerer', cid); }
  function boutonAjoutEnseignant(cid) {
    return peutCreerEnseignant(cid) ? '<button class="btn or" type="button" data-a="ajouter-enseignant" data-centre="' + esc(cid) + '">' + ico('plus', 'p') + 'Ajouter un enseignant</button>' : '';
  }
  var masqueLe = 0;

  // ───────────────────────────── Feuille (modale) ─────────────────────────────
  function ouvrirFeuille(html) {
    var f = $('#feuille');
    f.innerHTML = '<div class="panneau" role="dialog" aria-modal="true"><div class="poignee"></div>' + html + '</div>';
    f.hidden = false;
    var premier = f.querySelector('input, select, textarea');
    if (premier && window.innerWidth > 700) premier.focus();
  }
  function fermerFeuille() { var f = $('#feuille'); f.hidden = true; f.innerHTML = ''; }
  /** Feuille par-dessus une autre : le formulaire du dessous reste intact (homonyme). */
  function ouvrirFeuilleSecondaire(html) {
    var f = $('#feuille');
    var p = f.querySelector('.panneau');
    if (p) p.hidden = true;
    var d = document.createElement('div');
    d.className = 'panneau secondaire';
    d.setAttribute('role', 'dialog');
    d.innerHTML = '<div class="poignee"></div>' + html;
    f.appendChild(d);
  }
  function fermerFeuilleSecondaire() {
    var f = $('#feuille');
    var d = f.querySelector('.panneau.secondaire');
    if (d) d.remove();
    var p = f.querySelector('.panneau');
    if (p) p.hidden = false;
  }
  /** Confirmation dans une feuille (window.confirm bloque certains navigateurs intégrés). */
  var confirmationEnCours = null;
  function confirmer(message, libelleOk, suite) {
    confirmationEnCours = suite;
    ouvrirFeuille('<h2>Confirmer</h2><p>' + esc(message) + '</p><div class="actions"><button class="btn danger" type="button" data-a="confirme-oui">' + esc(libelleOk) + '</button><button class="btn clair" type="button" data-a="fermer">Annuler</button></div>');
  }

  // ───────────────────────────── Rendu ─────────────────────────────
  function route() {
    var h = (location.hash || '#/accueil').replace(/^#\/?/, '').split('/');
    return { nom: h[0] || 'accueil', arg: h.slice(1).map(decodeURIComponent).join('/') };
  }

  function rendre(messageConnexion) {
    var app = $('#app');
    if (!E.jeton) { ecranConnexion(app, messageConnexion); return; }
    if (E.verrouille) { ecranPin(app); return; }
    var r = route();
    var page = PAGES[r.nom] || PAGES.accueil;
    if (page.droit && !page.droit()) page = PAGES.accueil;
    app.innerHTML = entete() + '<main class="page" id="page">' + page.html(r.arg) + '</main>' + navBasse(r.nom) + '<p class="sr">VÉRITAS Gestion</p>';
    majPuce();
    if (page.apres) page.apres(r.arg);
  }

  function entete() {
    var centres = lignes('centres');
    var sel = '';
    if (centres.length > 1) {
      sel = '<label class="sr" for="choix-centre">Centre</label><select id="choix-centre" class="selecteur-centre" data-change="centre">' +
        '<option value="*"' + (E.centre === '*' ? ' selected' : '') + '>' + (estAdmin() ? 'Les deux centres' : 'Tous mes centres') + '</option>' +
        centres.map(function (c) { return '<option value="' + esc(c.id) + '"' + (E.centre === c.id ? ' selected' : '') + '>' + esc(c.nom_court || c.nom) + '</option>'; }).join('') +
        '</select>';
    } else if (centres.length === 1) {
      sel = '<span class="doux">' + esc(centres[0].nom_court || centres[0].nom) + '</span>';
    }
    return '<header class="entete"><button type="button" class="marque" data-a="aller-accueil" aria-label="Accueil"><span class="logo" aria-hidden="true"></span><span class="nom">VÉRITAS</span></button>' +
      '<span class="espace"></span>' + sel + boutonCloche() + '<button id="puce-sync" class="puce-sync" data-a="sync" type="button">À jour</button></header>';
  }

  function navBasse(actif) {
    var items = [['accueil', 'home', 'Accueil']];
    if (peutQuelquePart('appel.faire')) items.push(['appel', 'checkcircle', 'Appel']);
    items.push(['eleves', 'graduation', 'Élèves']);
    var caisse = peutQuelquePart('paiements.voir');
    items.push(caisse ? ['caisse', 'wallet', 'Caisse'] : ['emploi', 'calendar', 'Planning']);
    items.push(['moi', 'list', 'Plus']);
    var sousPlus = ['cahier', 'rapports', 'equipe', 'agenda', 'roles', 'admin', 'comptes', 'compte', 'journal', 'centres', 'actionnaires', 'assiduite', 'bilan', 'enseignants', 'mesheures'].concat(caisse ? ['emploi'] : []);
    return '<nav class="nav-basse" aria-label="Navigation">' + items.map(function (i) {
      var on = i[0] === actif || (i[0] === 'moi' && sousPlus.indexOf(actif) >= 0) || (i[0] === 'appel' && actif === 'pointage') || (i[0] === 'caisse' && actif === 'jour');
      return '<a href="#/' + i[0] + '" class="' + (on ? 'actif' : '') + '"' + (on ? ' aria-current="page"' : '') + '>' + ico(i[1]) + i[2] + '</a>';
    }).join('') + '</nav>';
  }

  // ───────────────────────────── Connexion / installation ─────────────────────────────
  function ecranConnexion(app, message) {
    app.innerHTML = '<div class="connexion"><div class="boite"><div class="logo"><img src="icone-512.png" alt=""><div><b>VÉRITAS Gestion</b><small>Centres de répétition</small></div></div><div id="zone-connexion"><p class="doux">Chargement…</p></div></div></div>';
    fetch(BASE + 'api/install.php', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (etat) {
      if (!etat.installe || !etat.admin) formulaireInstallation(etat);
      else formulaireConnexion(message);
    }, function () { formulaireConnexion(message || (navigator.onLine ? 'Serveur injoignable.' : 'Pas de connexion internet. La première connexion demande du réseau.')); });
  }
  /** Même règle que le serveur : prénom.nom, minuscules sans accents (NOM en capitales = nom de famille). */
  function identifiantDepuisNom(nom) {
    var mots = String(nom || '').trim().split(/\s+/).filter(Boolean), fam = [], pre = [];
    mots.forEach(function (m) { if (m === m.toUpperCase() && /[A-Za-zÀ-ÿ]/.test(m)) fam.push(m); else pre.push(m); });
    var ordre = pre.length && fam.length ? [pre[0], fam[0]] : mots.slice(0, 2);
    var b = ordre.map(function (m) { return m.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/œ/g, 'oe').replace(/æ/g, 'ae').replace(/[^a-z0-9]+/g, ''); }).filter(Boolean).join('.');
    if (!b) return '';
    if (b.length < 3) b = 'compte' + b;
    var pris = (E.cache.comptes || []).map(function (u) { return u.identifiant; }), essai = b.slice(0, 50), i = 1;
    while (pris.indexOf(essai) >= 0) { i++; essai = b.slice(0, 50) + i; }
    return essai;
  }
  function dernierIdentifiant() { try { return localStorage.getItem('vg-ident') || ''; } catch (e) { return ''; } }
  function formulaireConnexion(message, identifiant, code) {
    var ident = identifiant != null ? identifiant : dernierIdentifiant();
    $('#zone-connexion').innerHTML = (message ? '<div class="erreur">' + esc(message) + '</div>' : '') +
      (code === 401 ? '<div class="note info aide-connexion"><b>Vérifiez :</b><ul>' +
        '<li>l\'<b>identifiant</b> exact reçu par WhatsApp, en minuscules (ex. : <i>jacques</i>, <i>marie.ndogpassi3</i>) — pas votre nom complet ;</li>' +
        '<li>le <b>mot de passe</b> : majuscules et minuscules comptent ; touchez l\'œil pour le voir ;</li>' +
        '<li>après 5 essais ratés, attendez 15 minutes.</li></ul>Toujours bloqué ? L\'administrateur crée un nouveau mot de passe (Comptes et accès › votre compte › Nouveau mot de passe).</div>' : '') +
      '<div id="zone-version"></div>' +
      '<form data-f="connexion" autocomplete="on">' +
      '<label class="champ"><span>Identifiant</span><input type="text" name="identifiant" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" required value="' + esc(ident) + '"></label>' +
      '<label class="champ"><span>Mot de passe</span><span class="mdp-ligne"><input type="password" name="mdp" id="champ-mdp" autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false" required>' +
      '<button type="button" class="oeil" data-a="voir-mdp" aria-label="Afficher le mot de passe" aria-pressed="false">' + ico('eye') + '</button></span></label>' +
      '<button class="btn plein" type="submit">Se connecter</button></form>' +
      '<p class="pied">v' + VERSION + ' · mot de passe oublié : demandez-le à l\'administrateur</p>';
    var champ = ident ? $('#champ-mdp') : $('#zone-connexion input[name=identifiant]');
    if (champ && message) champ.focus();
    verifierVersion();
  }
  /** Compare la version de ce téléphone à celle en ligne ; prévient s'il est en retard. */
  function verifierVersion() {
    api('version').then(function (r) {
      var enLigne = String(r.version || ''), cmp = function (a, b) {
        var x = a.split('.').map(Number), y = b.split('.').map(Number);
        for (var i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0); }
        return 0;
      };
      E.cache.versionEnLigne = enLigne && cmp(enLigne, VERSION) > 0 ? enLigne : '';
      var z = $('#zone-version') || $('#bandeau-version');
      if (z) z.innerHTML = htmlVersion();
    }, function () {});
  }
  function htmlVersion() {
    var enLigne = E.cache.versionEnLigne;
    if (!enLigne) return '';
    return '<div class="note maj-dispo">' + ico('alert', 'p') + ' <b>Version ' + esc(enLigne) + ' disponible</b> — ce téléphone est en ' + esc(VERSION) + '. ' +
        (NATIF ? 'Installez la nouvelle application, ou utilisez directement <b>gestion.veritas-school.com</b> dans Chrome : elle y est toujours à jour.'
          : '<button type="button" class="btn or petit" data-a="mettre-a-jour">Mettre à jour maintenant</button>') + '</div>';
  }
  function formulaireInstallation(etat) {
    $('#zone-connexion').innerHTML = '<div class="note info">Première mise en service : créez le compte administrateur. Le jeton d\'installation se trouve dans <b>api/payment_config.php</b> (G_INSTALL_TOKEN).</div>' +
      '<form data-f="installation" data-installe="' + (etat.installe ? '1' : '0') + '">' +
      '<label class="champ"><span>Jeton d\'installation</span><span class="mdp-ligne"><input type="password" name="jeton" required autocomplete="off"><button type="button" class="oeil" data-a="voir-mdp" aria-label="Afficher le mot de passe" aria-pressed="false">' + ico('eye') + '</button></span></label>' +
      '<label class="champ"><span>Votre nom</span><input type="text" name="nom" required value="Jacques Miterand TAKOU"></label>' +
      '<label class="champ"><span>Identifiant</span><input type="text" name="identifiant" required autocapitalize="none" spellcheck="false" placeholder="jacques"></label>' +
      '<label class="champ"><span>Mot de passe</span><span class="mdp-ligne"><input type="password" name="mdp" required minlength="10" autocomplete="new-password"><button type="button" class="oeil" data-a="voir-mdp" aria-label="Afficher le mot de passe" aria-pressed="false">' + ico('eye') + '</button></span><small>10 caractères minimum.</small></label>' +
      '<button class="btn plein" type="submit">Installer et me connecter</button></form>';
  }

  function ecranPin(app) {
    app.innerHTML = '<div class="connexion"><div class="boite"><div class="logo"><img src="icone-512.png" alt=""><div><b>' + esc(E.profil.utilisateur.nom) + '</b><small>Saisissez votre code</small></div></div>' +
      '<div class="pin-points" id="pin-points">' + '<i></i><i></i><i></i><i></i>' + '</div>' +
      '<div class="clavier">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) { return '<button type="button" data-a="pin" data-v="' + n + '">' + n + '</button>'; }).join('') +
      '<button type="button" class="vide-btn" data-a="pin-oubli">Oublié</button><button type="button" data-a="pin" data-v="0">0</button><button type="button" data-a="pin" data-v="x" aria-label="Effacer">⌫</button></div></div></div>';
    saisiePin = '';
  }

  // ───────────────────────────── Pages ─────────────────────────────
  // Modules encore à venir (vide : les 6 étapes sont livrées).
  var A_VENIR = [];

  var PAGES = {
    accueil: {
      html: function () {
        var u = E.profil.utilisateur;
        var auj = new Date();
        var h = '<h1>Bonjour ' + esc(String(u.nom).split(' ')[0]) + '</h1><p class="sous-titre">' +
          esc(auj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })) + '</p>' +
          '<div id="bandeau-version">' + htmlVersion() + '</div>' + bandeauEspace() + blocMesCours() + blocProchainsRdv();
        if (estEnseignantQuelquePart() && centresChoisis().length) h += '<h2>Mes centres</h2>';

        var centres = centresChoisis();
        if (!centres.length) {
          h += '<div class="carte vide">' + (E.syncEnCours || !E.derniereSync ? 'Chargement des centres…' : 'Aucun centre accessible avec ce compte.') + '</div>';
        }
        centres.forEach(function (c) {
          var role = estAdmin() ? 'Administrateur' : ROLES[roleDans(c.id)] || '';
          h += '<div class="carte centre"><span class="pastille">' + ico('building') + '</span><div class="corps"><h3>' + esc(c.nom) + (c._attente ? ' <span class="badge alerte">en attente</span>' : '') + '</h3><p class="doux">' + esc(c.adresse || '') + '</p>' +
            '<p class="doux">' + ico('clock', 'p') + ' ' + (function () {
              var d = new Date().getDay(); var pl = horairesDuJour(c.id, d === 0 ? 7 : d);
              return pl.length ? 'Cours aujourd\'hui : ' + pl.map(function (x) { return heureLisible(x.debut) + ' – ' + heureLisible(x.fin) + (x.niveaux ? ' (' + x.niveaux.split(',').join(', ') + ')' : ''); }).join(' ; ') : 'Pas de cours aujourd\'hui';
            })() + '</p>' +
            (function () {
              var prevues = seancesPrevues(c.id, isoLocal(new Date()));
              if (!prevues.length) return '';
              var faites = prevues.filter(function (x) { return etatSeance(x).pointes > 0; }).length;
              var enRetard = prevues.filter(function (x) { return retardAppel(x, c) > 0; }).length;
              return '<p><a class="lien-appel" href="#/appel">' + ico('checkcircle', 'p') + ' Appels du jour : <b>' + faites + ' / ' + prevues.length + '</b>' +
                (enRetard ? ' <span class="badge danger">' + enRetard + ' en retard</span>' : '') + '</a></p>';
            })() +
            (function () {
              if (!peut('paiements.voir', c.id)) return '';
              var auj = isoLocal(new Date());
              var jour = lignes('paiements').filter(function (p) { return p.centre_id === c.id && p.date === auj && !Number(p.annule); }).reduce(function (s, p) { return s + Number(p.montant); }, 0);
              var imp = impayes(c.id);
              return '<p><a class="lien-appel" href="#/caisse">' + ico('wallet', 'p') + ' Encaissé aujourd\'hui : <b>' + fcfa(jour) + '</b></a>' +
                (imp.length ? ' · <a class="lien-appel" href="#/caisse" data-a="caisse-onglet" data-v="impayes"><b>' + imp.length + '</b> impayé' + (imp.length > 1 ? 's' : '') + '</a>' : '') + '</p>';
            })() +
            (function () { var n = alertesAssiduite(c.id).length; return n ? '<p><a class="lien-appel" href="#/assiduite">' + ico('alert', 'p') + ' <b>' + n + '</b> alerte' + (n > 1 ? 's' : '') + ' d\'assiduité</a></p>' : ''; })() +
            '<p class="chiffres"><span><b>' + elevesActifs(c.id).length + '</b> élèves</span><span><b>' + lignes('classes').filter(function (k) { return k.centre_id === c.id; }).length + '</b> classes</span><span><b>' + lignes('creneaux').filter(function (k) { return k.centre_id === c.id; }).length + '</b> cours/semaine</span></p>' +
            '<p><span class="badge or">' + esc(role) + '</span><span class="badge">Échéance le ' + esc(c.jour_echeance) + ' du mois</span><span class="badge">Retard au-delà de ' + esc(c.tolerance_retard_min) + ' min</span></p></div></div>';
        });
        if (panneauOuvert()) h += '<div class="actions"><button class="btn clair" type="button" data-a="editer-centre" data-id="">' + ico('plus', 'p') + 'Ouvrir un nouveau centre</button></div>';

        var tuiles = [];
        if (peutQuelquePart('appel.faire')) tuiles.push(['#/appel', 'checkcircle', 'Appel du jour', 'Arrivées, départs, retards']);
        if (peutQuelquePart('paiements.voir')) tuiles.push(['#/caisse', 'coins', 'Caisse', 'Encaisser, reçus, impayés, dépenses']);
        if (peutQuelquePart('paiements.voir')) tuiles.push(['#/jour', 'clipboard', 'Point du jour', 'Entrées, sorties, solde à partager']);
        if (peutQuelquePart('finances.voir')) tuiles.push(['#/bilan', 'trending', 'Bilan', 'Recettes, dépenses, parts']);
        if (peutQuelquePart('paiements.voir')) tuiles.push(['#/rapports', 'doc', 'Rapports', 'Insolvables, paiements par classe, trésorier']);
        if (peutQuelquePart('finances.voir') || peutQuelquePart('enseignants.gerer')) tuiles.push(['#/enseignants', 'presentation', 'Enseignants', 'Heures, dû, paies']);
        if (Object.keys(E.profil.acces || {}).some(function (c) { return E.profil.acces[c] === 'enseignant'; })) tuiles.push(['#/mesheures', 'clock', 'Mes heures', 'Cours faits, rémunération']);
        tuiles.push(['#/assiduite', 'activity', 'Assiduité', 'Taux, retards, alertes']);
        tuiles.push(['#/eleves', 'graduation', 'Élèves', peutQuelquePart('eleves.gerer') ? 'Inscrire, rechercher, importer' : 'Fiches et contacts des parents']);
        tuiles.push(['#/agenda', 'agenda', 'Agenda', 'Rendez-vous, rencontres, échéances']);
        tuiles.push(['#/cahier', 'bookopen', 'Cahier de textes', 'Ce qui a été fait, travail donné']);
        if (peutEquipeQuelquePart()) tuiles.push(['#/equipe', 'message', 'Équipe', 'Messages, réunions, tâches']);
        tuiles.push(['#/emploi', 'calendar', 'Emploi du temps', peutQuelquePart('emploi.gerer') ? 'Classes, créneaux, enseignants' : 'Les cours de la semaine']);
        if (panneauOuvert()) tuiles.push(['#/admin', 'shield', 'Administration', 'Comptes, identifiants, partenaires et droits']);
        if (peutQuelquePart('finances.voir')) tuiles.push(['#/actionnaires', 'handshake', 'Actionnaires', 'Parts de chaque centre']);
        if (!estAdmin() && accesGestion('comptes.gerer')) tuiles.push(['#/comptes', 'users', 'Comptes et accès', 'Qui peut faire quoi']);
        if (!estAdmin() && accesGestion('journal.voir')) tuiles.push(['#/journal', 'clock', 'Journal', 'Qui a modifié quoi']);
        h += '<h2>Disponible</h2><div class="grille">' + tuiles.map(function (t) {
          return '<a class="tuile" href="' + t[0] + '"' + (t[4] ? ' data-a="' + t[4] + '"' : '') + '><span class="pastille">' + ico(t[1]) + '</span><b>' + t[2] + '</b><small>' + t[3] + '</small></a>';
        }).join('') + '<a class="tuile" href="#/moi"><span class="pastille">' + ico('lock') + '</span><b>Mon compte</b><small>Mot de passe, code, appareils</small></a></div>';

        if (A_VENIR.length) h += '<h2>En construction</h2><div class="grille">' + A_VENIR.map(function (t) {
          return '<div class="tuile inactive"><span class="pastille">' + ico(t[0]) + '</span><b>' + t[1] + '</b><small>' + t[2] + ' · étape ' + t[3] + '</small></div>';
        }).join('') + '</div>';
        return h;
      },
      apres: function () { if (!E.cache.versionVue || Date.now() - E.cache.versionVue > 3600000) { E.cache.versionVue = Date.now(); verifierVersion(); } }
    },

    centres: {
      droit: panneauOuvert,
      html: function () {
        var annees = lignes('annees');
        var h = '<h1>Centres et année</h1><p class="sous-titre">Coordonnées imprimées sur les reçus, règles de retard et d\'échéance.</p><div class="liste">';
        lignes('centres').forEach(function (c) {
          h += '<button class="ligne" type="button" data-a="editer-centre" data-id="' + esc(c.id) + '"><span class="pastille">' + ico('building') + '</span>' +
            '<span class="corps"><b>' + esc(c.nom) + '</b><small>' + esc(c.telephones || 'Téléphones non renseignés') + '</small></span>' +
            (c._attente ? '<span class="badge alerte">en attente</span>' : '') + '<span class="fin">›</span></button>';
        });
        h += '</div><div class="actions"><button class="btn or" type="button" data-a="editer-centre" data-id="">' + ico('plus', 'p') + 'Ouvrir un nouveau centre</button></div>';
        h += '<h2>Année scolaire</h2><div class="liste">';
        annees.forEach(function (a) {
          h += '<button class="ligne" type="button" data-a="editer-annee" data-id="' + esc(a.id) + '"><span class="corps"><b>' + esc(a.libelle) + (Number(a.active) ? ' <span class="badge ok">en cours</span>' : '') + '</b>' +
            '<small>Mois facturés : ' + esc(moisLisibles(a.mois_factures)) + '</small></span><span class="fin">›</span></button>';
        });
        if (!annees.length) h += '<div class="vide">Aucune année.</div>';
        h += '</div><div class="actions"><button class="btn clair" type="button" data-a="editer-annee" data-id="">' + ico('calendar', 'p') + 'Nouvelle année</button></div>';
        h += '<h2>Matières</h2><p class="sous-titre">Communes aux centres ; chaque enseignant indique les siennes dans sa fiche.</p><div class="liste">' +
          lignes('matieres').map(function (m) {
            var n = E.equipe.filter(function (e, i, t) { return e.role === 'enseignant' && String(e.matieres || '').split(',').indexOf(m.id) >= 0 && t.findIndex(function (x) { return x.id === e.id; }) === i; }).length;
            return '<button class="ligne" type="button" data-a="editer-matiere" data-id="' + esc(m.id) + '"><span class="corps"><b>' + esc(m.nom) + '</b><small>' + (n ? n + ' enseignant' + (n > 1 ? 's' : '') : 'aucun enseignant') + '</small></span><span class="fin">›</span></button>';
          }).join('') + '</div><div class="actions"><button class="btn clair" type="button" data-a="editer-matiere" data-id="">' + ico('plus', 'p') + 'Ajouter une matière</button></div>';
        return h;
      }
    },

    actionnaires: {
      droit: function () { return peutQuelquePart('finances.voir'); },
      html: function () {
        var h = '<h1>Actionnaires</h1><p class="sous-titre">Les parts servent au partage du résultat dans le bilan de chaque centre (étape 5).</p>';
        centresChoisis().forEach(function (c) {
          if (!peut('finances.voir', c.id)) return;
          var acts = lignes('actionnaires').filter(function (a) { return a.centre_id === c.id; });
          var total = acts.reduce(function (s, a) { return s + (Number(a.part_centiemes) || 0); }, 0);
          h += '<h2>' + esc(c.nom) + '</h2><div class="carte"><b>' + pourcent(total) + '</b> réparti' + (total < 10000 ? ' · reste ' + pourcent(10000 - total) : '') +
            '<progress class="parts" max="10000" value="' + Math.min(total, 10000) + '" aria-label="Parts réparties"></progress></div><div class="liste">';
          acts.forEach(function (a) {
            h += '<button class="ligne" type="button" data-a="editer-actionnaire" data-id="' + esc(a.id) + '" data-centre="' + esc(c.id) + '"' + (estAdmin() ? '' : ' disabled') + '>' +
              '<span class="avatar">' + esc(initiales(a.nom)) + '</span><span class="corps"><b>' + esc(a.nom) + '</b><small>' + esc(a.tel || '') + '</small></span>' +
              (a._attente ? '<span class="badge alerte">en attente</span>' : '') + '<span class="fin"><b>' + pourcent(a.part_centiemes) + '</b></span></button>';
          });
          if (!acts.length) h += '<div class="vide">Aucun actionnaire enregistré.</div>';
          h += '</div>';
          if (estAdmin()) h += '<div class="actions"><button class="btn clair" type="button" data-a="editer-actionnaire" data-id="" data-centre="' + esc(c.id) + '">' + ico('plus', 'p') + 'Ajouter un actionnaire</button></div>';
        });
        return h;
      }
    },

    emploi: {
      html: function () { return pageEmploi(); }
    },
    admin: {
      droit: panneauOuvert,
      html: function () {
        var reste = Math.max(1, Math.round((E.panneauJusqua - Date.now()) / 60000));
        return '<h1>Administration</h1><p class="sous-titre">Comptes et identifiants, droits des partenaires, centres et journal. Se referme seule dans ' + reste + ' min.</p>' +
          '<div class="liste">' +
          [['#/centres', 'building', 'Centres, année et matières', 'Ouvrir un centre, horaires, tarifs, messages'], ['#/comptes', 'users', 'Comptes et accès', 'Créer, désactiver, mots de passe, appareils'],
           ['#/journal', 'clock', 'Journal', 'Qui a modifié quoi, partout']].map(function (l) {
            return '<a class="ligne" href="' + l[0] + '"><span class="pastille">' + ico(l[1]) + '</span><span class="corps"><b>' + l[2] + '</b><small>' + l[3] + '</small></span><span class="fin">›</span></a>';
          }).join('') + '</div>' +
          '<h2>Partenaires et droits</h2><p class="sous-titre">Retirez à un partenaire les pouvoirs que vous voulez garder pour vous. Le serveur les lui refuse aussitôt.</p>' +
          '<div id="zone-droits"><div class="carte vide">Chargement…</div></div>' +
          '<div class="actions"><button class="btn clair" type="button" data-a="fermer-panneau">' + ico('lock', 'p') + 'Refermer l\'administration</button></div>';
      },
      apres: function () { chargerDroits(); }
    },

    appel: {
      droit: function () { return peutQuelquePart('appel.faire'); },
      html: function () { return pageAppel(); }
    },
    pointage: {
      html: function (arg) { return pagePointage(arg); }
    },
    assiduite: {
      html: function () { return pageAssiduite(); }
    },
    caisse: {
      droit: function () { return peutQuelquePart('paiements.voir'); },
      html: function () { return pageCaisse(); },
      apres: function () { if (CAI.onglet === 'encaisser') dessinerRechercheCaisse(); }
    },
    jour: {
      droit: function () { return peutQuelquePart('paiements.voir'); },
      html: function () { return pageJour(); }
    },
    bilan: {
      droit: function () { return peutQuelquePart('finances.voir'); },
      html: function () { return pageBilan(); }
    },
    enseignants: {
      droit: function () { return peutQuelquePart('finances.voir') || peutQuelquePart('enseignants.gerer'); },
      html: function () { return pageEnseignants(); }
    },
    mesheures: {
      droit: function () { return Object.keys(E.profil.acces || {}).some(function (c) { return E.profil.acces[c] === 'enseignant'; }); },
      html: function () { return pageMesHeures(); }
    },

    eleves: {
      html: function () { return pageEleves(); },
      apres: function () { dessinerListeEleves(); }
    },

    comptes: {
      droit: function () { return accesGestion('comptes.gerer'); },
      html: function () {
        return '<h1>Comptes et accès</h1><p class="sous-titre">Chaque personne a son identifiant : le journal sait qui a fait quoi.</p>' +
          '<div id="zone-comptes"><div class="carte vide">Chargement…</div></div>' +
          '<button class="fab" type="button" data-a="editer-compte" data-id="">' + ico('plus') + 'Compte</button>';
      },
      apres: function () { chargerComptes(); }
    },

    journal: {
      droit: function () { return accesGestion('journal.voir'); },
      html: function () {
        return '<h1>Journal</h1><p class="sous-titre">Toutes les modifications, avec leur auteur. Rien ne s\'efface.</p><div id="zone-journal"><div class="carte vide">Chargement…</div></div>';
      },
      apres: function () { chargerJournal(false); }
    },

    roles: {
      html: function () { return pageRoles(); }
    },
    agenda: {
      html: function () { return pageAgenda(); }
    },
    cahier: {
      html: function () { return pageCahier(); }
    },
    rapports: {
      droit: function () { return peutQuelquePart('paiements.voir'); },
      html: function () { return pageRapports(); }
    },
    equipe: {
      droit: function () { return peutEquipeQuelquePart(); },
      html: function () { return pageEquipe(); }
    },

    moi: {
      html: function () {
        var u = E.profil.utilisateur;
        var acces = Object.keys(E.profil.acces || {}).map(function (cid) {
          var c = ligne('centres', cid);
          return '<span class="badge">' + esc(ROLES[E.profil.acces[cid]]) + ' · ' + esc(c ? c.nom_court || c.nom : 'centre') + '</span>';
        }).join('');
        var h = '<h1>Mon compte</h1><div class="carte"><h3>' + esc(u.nom) + '</h3><p class="doux">Identifiant : ' + esc(u.identifiant) + '</p><p>' +
          (u.admin ? '<span class="badge or">Administrateur des deux centres</span>' : '') + acces + '</p></div>' + carteMonRole();
        var liens = [['#/cahier', 'bookopen', 'Cahier de textes', 'Ce qui a été fait et le travail donné, par classe'], ['#/agenda', 'agenda', 'Agenda', 'Rendez-vous, rencontres, échéances, rappels']].concat(peutQuelquePart('paiements.voir') ? [['#/rapports', 'doc', 'Rapports', 'Insolvables, paiements par mois et classe, trésorier — PDF, Excel']] : []).concat(peutEquipeQuelquePart() ? [['#/equipe', 'message', 'Équipe', 'Messages entre partenaires, commentaires, réunions, tâches']] : []).concat([ ['#/roles', 'info', estAdmin() ? 'Rôles et droits' : 'Mon rôle', estAdmin() ? 'Qui fait quoi : administrateur, partenaires, secrétariat, enseignants' : 'Ce que votre compte permet'], ['#/emploi', 'calendar', 'Planning', 'Emploi du temps, horaires, classes'], ['#/assiduite', 'activity', 'Assiduité et ponctualité', 'Taux, retards, classement, alertes']]);
        if (peutQuelquePart('finances.voir')) liens.push(['#/bilan', 'trending', 'Bilan financier', 'Recettes, dépenses, parts des actionnaires']);
        if (peutQuelquePart('finances.voir') || peutQuelquePart('enseignants.gerer')) liens.push(['#/enseignants', 'presentation', 'Enseignants', 'Heures faites, dû, paies']);
        if (Object.keys(E.profil.acces || {}).some(function (c) { return E.profil.acces[c] === 'enseignant'; })) liens.push(['#/mesheures', 'clock', 'Mes heures', 'Cours faits, rémunération']);
        if (panneauOuvert()) liens.push(['#/admin', 'shield', 'Administration', 'Comptes et identifiants, partenaires et droits, centres, journal']);
        if (!estAdmin() && accesGestion('comptes.gerer')) liens.push(['#/comptes', 'users', 'Comptes et accès', 'Qui peut faire quoi']);
        if (!estAdmin() && accesGestion('journal.voir')) liens.push(['#/journal', 'clock', 'Journal', 'Qui a modifié quoi']);
        if (peutQuelquePart('finances.voir')) liens.push(['#/actionnaires', 'handshake', 'Actionnaires', 'Parts de chaque centre']);
        if (liens.length) {
          h += '<h2>Gestion</h2><div class="liste">' + liens.map(function (l) {
            return '<a class="ligne" href="' + l[0] + '"' + (l[4] ? ' data-a="' + l[4] + '"' : '') + '><span class="pastille">' + ico(l[1]) + '</span><span class="corps"><b>' + l[2] + '</b><small>' + l[3] + '</small></span><span class="fin">›</span></a>';
          }).join('') + '</div><h2>Mon compte</h2>';
        }
        h += '<div class="liste">' +
          '<button class="ligne" type="button" data-a="changer-mdp"><span class="pastille">' + ico('lock') + '</span><span class="corps"><b>Changer mon mot de passe</b><small>Déconnecte vos autres appareils</small></span><span class="fin">›</span></button>' +
          '<button class="ligne" type="button" data-a="code-pin"><span class="pastille">' + ico('shield') + '</span><span class="corps"><b>Code de verrouillage</b><small id="etat-pin">…</small></span><span class="fin">›</span></button>' +
          '<button class="ligne" type="button" data-a="mes-appareils"><span class="pastille">' + ico('smartphone') + '</span><span class="corps"><b>Mes appareils connectés</b><small>Déconnecter un téléphone perdu</small></span><span class="fin">›</span></button>' +
          '</div>';
        h += '<h2>Synchronisation</h2><div class="carte"><p>' + (E.enLigne ? 'En ligne' : 'Hors ligne') + ' · ' + E.sortie.length + ' modification(s) en attente</p>' +
          '<p class="doux">Dernier échange : ' + (E.derniereSync ? new Date(E.derniereSync).toLocaleTimeString('fr-FR') : 'pas encore') + '</p>' +
          (E.rejets.length ? '<h3>Refusées par le serveur</h3>' + E.rejets.slice(0, 10).map(function (r) {
            return '<p class="diff"><b>' + esc(r.t) + '</b> · ' + esc(r.erreur) + ' <span class="doux">(' + dateLisible(r.le) + ')</span></p>';
          }).join('') : '') +
          '<div class="actions"><button class="btn clair petit" type="button" data-a="sync">' + ico('refresh', 'p') + 'Synchroniser maintenant</button></div></div>';
        h += '<div class="actions"><button class="btn danger" type="button" data-a="deconnexion">Se déconnecter</button></div>' +
          '<p class="pied">VÉRITAS Gestion v' + VERSION + ' · © Jacques Miterand TAKOU</p>';
        return h;
      },
      apres: function () {
        metaLire('pin').then(function (p) { var e = $('#etat-pin'); if (e) e.textContent = p ? 'Activé : demandé après 5 min d\'absence' : 'Désactivé'; });
      }
    }
  };

  // ───────────────────────────── Appel ─────────────────────────────
  var APL = { centre: '', date: '' };
  var LIB_STATUT = { present: 'Présent', retard: 'En retard', absent: 'Absent', justifie: 'Absence justifiée' };

  function isoLocal(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function heureMaintenant() { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function jourDe(iso) { var d = new Date(iso + 'T12:00:00'); var j = d.getDay(); return j === 0 ? 7 : j; }
  function dateLongue(iso) { return new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }); }
  function decalerJour(iso, n) { var d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return isoLocal(d); }
  /** Identifiants déterministes : deux téléphones hors ligne ouvrent la MÊME feuille, le MÊME pointage. */
  function idSeance(iso, classeId) { return 'sa' + iso.replace(/-/g, '') + classeId; }
  function hache(t, graine) { var h = graine >>> 0; for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); }
  function idPresence(seanceId, eleveId) { var t = seanceId + '|' + eleveId; return 'pr' + hache(t, 2166136261) + hache(t, 3355443) + hache(t, 1234567); }

  /**
   * Feuilles prévues un jour donné : une par classe qui a cours ce jour-là, d'après
   * l'emploi du temps (créneaux) ou, à défaut, les horaires du centre pour son niveau.
   * Les feuilles déjà ouvertes ce jour s'y ajoutent (cours de rattrapage).
   */
  function seancesPrevues(cid, iso) {
    var j = jourDe(iso);
    var out = [];
    lignes('classes').filter(function (k) { return k.centre_id === cid; }).forEach(function (k) {
      var id = idSeance(iso, k.id);
      var existante = ligne('seances', id);
      var crs = lignes('creneaux').filter(function (c) { return c.classe_id === k.id && Number(c.jour) === j; });
      var pl = crs.length ? crs : horairesPour(cid, k.niveau).filter(function (h) { return Number(h.jour) === j; });
      if (!pl.length && !(existante && !Number(existante.supprime))) return;
      var debut = existante ? existante.debut : pl.map(function (x) { return x.debut; }).sort()[0];
      var fin = existante ? existante.fin : pl.map(function (x) { return x.fin; }).sort().slice(-1)[0];
      out.push({ id: id, centre_id: cid, classe: k, date: iso, debut: debut, fin: fin, creneaux: crs, existante: existante });
    });
    return out.sort(function (a, b) { return a.debut < b.debut ? -1 : a.debut > b.debut ? 1 : String(a.classe.nom).localeCompare(b.classe.nom, 'fr'); });
  }
  function presencesDe(seanceId) { return lignes('presences').filter(function (p) { return p.seance_id === seanceId; }); }
  function etatSeance(x) {
    var pr = presencesDe(x.id);
    var c = { present: 0, retard: 0, absent: 0, justifie: 0, pointes: pr.length, inscrits: elevesActifs(x.centre_id).filter(function (e) { return e.classe_id === x.classe.id; }).length };
    pr.forEach(function (p) { c[p.statut] = (c[p.statut] || 0) + 1; });
    return c;
  }
  /** Minutes de retard de l'APPEL (0 si fait, pas encore dû, ou pas aujourd'hui). */
  function retardAppel(x, centre) {
    if (x.date !== isoLocal(new Date()) || etatSeance(x).pointes) return 0;
    var m = minutes(heureMaintenant()) - minutes(x.debut) - (Number(centre.alerte_appel_min) || 15);
    return m > 0 ? m : 0;
  }
  function statutCalcule(arrivee, debut, cid) {
    var tol = Number((ligne('centres', cid) || {}).tolerance_retard_min) || 0;
    var r = Math.max(0, minutes(arrivee) - minutes(debut));
    return { statut: r > tol ? 'retard' : 'present', retard_min: r > tol ? r : 0 };
  }
  function peutPointer(cid, classeId, iso) {
    if (!peut('appel.faire', cid)) return false;
    // L'enseignant fait l'appel de toute classe de son centre (ses cours restent en tête de liste).
    return true;
  }
  function correcteur(cid) { return peut('appel.corriger', cid); }
  function trop_ancien(iso) { return iso < decalerJour(isoLocal(new Date()), -2); }

  function pageAppel() {
    var auj = isoLocal(new Date());
    if (!APL.date) APL.date = auj;
    var dispo = centresChoisis().filter(function (c) { return peut('appel.faire', c.id); });
    if (!dispo.some(function (c) { return c.id === APL.centre; })) APL.centre = dispo.length ? dispo[0].id : '';
    var cid = APL.centre;
    var centre = ligne('centres', cid) || {};
    var h = '<h1>Appel</h1><div class="nav-date"><button type="button" class="btn clair petit" data-a="appel-date" data-v="-1" aria-label="Jour précédent">‹</button>' +
      '<b>' + esc(APL.date === auj ? 'Aujourd\'hui' : dateLongue(APL.date)) + '</b>' +
      '<button type="button" class="btn clair petit" data-a="appel-date" data-v="1" aria-label="Jour suivant"' + (APL.date >= auj ? ' disabled' : '') + '>›</button></div>' +
      (APL.date === auj ? '<p class="sous-titre">' + esc(dateLongue(auj)) + '</p>' : '<p class="sous-titre"><a href="#/appel" data-a="appel-auj">Revenir à aujourd\'hui</a></p>');
    if (dispo.length > 1) {
      h += '<div class="puces">' + dispo.map(function (c) { return '<button type="button" class="puce' + (c.id === cid ? ' on' : '') + '" data-a="appel-centre" data-v="' + esc(c.id) + '">' + esc(c.nom_court || c.nom) + '</button>'; }).join('') + '</div>';
    }
    if (!cid) return h + '<div class="carte vide">Aucun centre.</div>';
    var liste = seancesPrevues(cid, APL.date).filter(function (x) { return peutPointer(cid, x.classe.id, APL.date) || estAdmin(); });
    if (!estAdmin() && roleDans(cid) === 'enseignant') {
      var moiE = E.profil.utilisateur.id, sien = function (x) { return x.creneaux.some(function (c) { return c.enseignant_id === moiE; }) ? 0 : 1; };
      liste = liste.slice().sort(function (a, b) { return sien(a) - sien(b) || (a.debut < b.debut ? -1 : 1); });
    }
    if (!liste.length) {
      return h + '<div class="carte vide">Pas de cours prévu ' + (APL.date === auj ? 'aujourd\'hui' : 'ce jour-là') + '.<br><small>Les cours viennent de l\'emploi du temps ou des horaires du centre (Planning).</small></div>';
    }
    E.cache.blocEnseignants = blocEnseignantsDuJour(cid, APL.date);
    var manquants = liste.filter(function (x) { return retardAppel(x, centre) > 0; });
    if (manquants.length) {
      h += '<div class="carte alerte-appel"><b>' + ico('alert', 'p') + ' Appels non faits</b><p class="doux">au-delà de ' + esc(centre.alerte_appel_min) + ' min après le début du cours</p>' +
        manquants.map(function (x) { var r = retardAppel(x, centre) + Number(centre.alerte_appel_min); return '<p>' + esc(x.classe.nom) + ' · depuis ' + heureLisible(x.debut) + (r >= Number(centre.alerte_direction_min) ? ' <span class="badge danger">direction alertée</span>' : '') + '</p>'; }).join('') + '</div>';
    }
    var pointees = liste.filter(function (x) { return etatSeance(x).pointes; });
    if (pointees.length > 1) h += '<div class="actions"><button class="btn clair" type="button" data-a="export-jour">' + ico('download', 'p') + 'Partager les ' + pointees.length + ' feuilles du jour</button></div>';
    E.cache.appelsJour = pointees;
    h += '<div class="liste">' + liste.map(function (x) {
      var e = etatSeance(x);
      var close = x.existante && x.existante.statut === 'close';
      var etat = close ? '<span class="badge ok">close</span>' : e.pointes ? '<span class="badge">en cours</span>' : retardAppel(x, centre) ? '<span class="badge danger">en retard</span>' : '<span class="badge alerte">à faire</span>';
      var profs = x.creneaux.map(function (c) { return nomDe('matieres', c.matiere_id) + (c.enseignant_id ? ' (' + nomPersonne(c.enseignant_id) + ')' : ''); }).filter(Boolean).join(', ');
      return '<a class="ligne creneau" href="#/pointage/' + encodeURIComponent(x.classe.id) + '/' + x.date + '"><span class="horaire"><b>' + esc(x.debut) + '</b><small>' + esc(x.fin) + '</small></span>' +
        '<span class="corps"><b>' + esc(x.classe.nom) + '</b><small>' + (e.pointes ? e.present + ' présents · ' + e.retard + ' retards · ' + (e.absent + e.justifie) + ' absents' : e.inscrits + ' inscrits') + (profs ? ' · ' + esc(profs) : '') + '</small></span>' + etat + '</a>';
    }).join('') + '</div>';
    return h + E.cache.blocEnseignants;
  }

  // Présence des enseignants : un créneau = une ligne ; le centre pointe, pas l'enseignant.
  function idPresenceEns(iso, creneauId) { return 'pe' + iso.replace(/-/g, '') + creneauId; }
  var LIB_ENS = { present: 'Présent', retard: 'En retard', absent: 'Absent', remplace: 'Remplacé' };
  function blocEnseignantsDuJour(cid, iso) {
    if (!peut('appel.faire', cid) || (!estAdmin() && roleDans(cid) === 'enseignant')) return '';
    var crs = lignes('creneaux').filter(function (c) { return c.centre_id === cid && Number(c.jour) === jourDe(iso); })
      .sort(function (a, b) { return a.debut < b.debut ? -1 : 1; });
    if (!crs.length) return '';
    var modifiable = !trop_ancien(iso) || correcteur(cid);
    return '<h2>Enseignants du jour</h2><div class="liste pointage">' + crs.map(function (c) {
      var p = ligne('presences_ens', idPresenceEns(iso, c.id));
      var qui = nomPersonne(c.enseignant_id) || 'à désigner';
      var etat = !p ? '<small class="a-pointer">à pointer</small>' : '<small class="st-' + (p.statut === 'remplace' ? 'justifie' : p.statut) + '">' + LIB_ENS[p.statut] +
        (p.statut === 'remplace' ? ' par ' + esc(nomPersonne(p.remplacant_id)) : '') + (p.arrivee ? ' · ' + p.arrivee : '') + (Number(p.retard_min) ? ' (+' + p.retard_min + ' min)' : '') + (p.depart ? ' → ' + p.depart : '') + '</small>';
      var b = '';
      if (modifiable && c.enseignant_id) {
        if (!p || p.statut === 'absent') b += '<button type="button" class="rond ok" data-a="pointer-ens" data-v="arrive" data-cr="' + esc(c.id) + '" aria-label="Arrivé maintenant">' + ico('check') + '</button>';
        else if (!p.depart) b += '<button type="button" class="rond" data-a="pointer-ens" data-v="depart" data-cr="' + esc(c.id) + '" aria-label="Parti maintenant">' + ico('download') + '</button>';
        if (!p || p.statut !== 'absent') b += '<button type="button" class="rond abs" data-a="pointer-ens" data-v="absent" data-cr="' + esc(c.id) + '" aria-label="Absent">' + ico('x') + '</button>';
      }
      // Payer l'enseignant juste après le cours : départ pointé, ou fin du cours passée.
      var mc = montantCours(p), fini = p && (p.depart || iso < isoLocal(new Date()) || heureMaintenant() >= c.fin), payer = '';
      if (mc && fini && peut('paiements.encaisser', cid)) {
        var paie = paieDuCours(p.id);
        if (paie) etat += '<small class="st-present">' + ico('check', 'p') + ' Payé ' + fcfa(paie.montant) + ' par ' + esc(nomCompte(paie.paye_par)) + '</small>';
        else payer = '<button type="button" class="btn or petit payer" data-a="payer-cours" data-pe="' + esc(p.id) + '" data-cr="' + esc(c.id) + '">' + ico('wallet', 'p') + 'Payer ' + fcfa(mc.montant) + '</button>';
      }
      return '<div class="ligne' + (p ? ' pt-' + (p.statut === 'remplace' ? 'justifie' : p.statut) : '') + '"><button type="button" class="corps nom-eleve" data-a="detail-ens" data-cr="' + esc(c.id) + '"' + (modifiable && c.enseignant_id ? '' : ' disabled') + '><b>' + esc(qui) + '</b><small>' + esc(heureLisible(c.debut) + ' – ' + heureLisible(c.fin) + ' · ' + nomDe('classes', c.classe_id) + ' · ' + nomDe('matieres', c.matiere_id)) + '</small>' + etat + '</button>' +
        (p && p._attente ? '<span class="badge alerte">en attente</span>' : '') + '<span class="boutons">' + payer + b + '</span></div>';
    }).join('') + '</div>';
  }
  function minutesEns(c, arrivee, depart) {
    var a = Math.max(minutes(arrivee || c.debut), minutes(c.debut));
    return Math.max(0, minutes(depart || c.fin) - a);
  }
  function pointerEns(c, iso, champs) {
    var id = idPresenceEns(iso, c.id);
    var avant = ligne('presences_ens', id);
    var x = Object.assign({ centre_id: c.centre_id, creneau_id: c.id, date: iso, enseignant_id: c.enseignant_id }, champs);
    if (x.statut === 'absent') { x.arrivee = ''; x.depart = ''; x.retard_min = 0; x.minutes = 0; }
    else {
      var tol = Number((ligne('centres', c.centre_id) || {}).tolerance_retard_min) || 0;
      var r = Math.max(0, minutes(x.arrivee || c.debut) - minutes(c.debut));
      if (x.statut !== 'remplace') x.statut = r > tol ? 'retard' : 'present';
      x.retard_min = r > tol ? r : 0;
      x.minutes = minutesEns(c, x.arrivee, x.depart);
    }
    if (avant) { delete x.centre_id; delete x.creneau_id; delete x.date; }
    return muter('presences_ens', id, x);
  }
  function feuilleEns(creneauId) {
    var c = ligne('creneaux', creneauId);
    var iso = APL.date || isoLocal(new Date());
    var p = ligne('presences_ens', idPresenceEns(iso, c.id)) || {};
    var autres = enseignantsDu(c.centre_id).filter(function (e) { return e.id !== c.enseignant_id; });
    ouvrirFeuille('<h2>' + esc(nomPersonne(c.enseignant_id)) + '</h2><p class="doux">' + esc(dateLongue(iso) + ' · ' + heureLisible(c.debut) + ' – ' + heureLisible(c.fin) + ' · ' + nomDe('classes', c.classe_id)) + '</p>' +
      '<form data-f="presence-ens" data-cr="' + esc(c.id) + '"><label class="champ"><span>Statut</span><select name="statut" data-change="statut-ens">' +
      ['present', 'absent', 'remplace'].map(function (o) { return '<option value="' + o + '"' + ((p.statut === 'retard' ? 'present' : p.statut || 'present') === o ? ' selected' : '') + '>' + (o === 'present' ? 'Présent (retard calculé)' : LIB_ENS[o]) + '</option>'; }).join('') + '</select></label>' +
      '<label class="champ" id="champ-remplacant"' + (p.statut === 'remplace' ? '' : ' hidden') + '><span>Remplaçant</span><select name="remplacant_id"><option value="">—</option>' + autres.map(function (e) { return '<option value="' + esc(e.id) + '"' + (p.remplacant_id === e.id ? ' selected' : '') + '>' + esc(e.nom) + '</option>'; }).join('') + '</select></label>' +
      '<div class="deux"><label class="champ"><span>Arrivée</span><input type="time" name="arrivee" value="' + esc(p.arrivee || heureMaintenant()) + '"></label><label class="champ"><span>Départ</span><input type="time" name="depart" value="' + esc(p.depart || '') + '"></label></div>' +
      '<label class="champ"><span>Note</span><input type="text" name="note" value="' + esc(p.note || '') + '"></label>' +
      '<div class="actions"><button class="btn" type="submit">Enregistrer</button><button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
  }

  // ───────────── Enseignants : heures, dû, paies ─────────────
  var ENS = { centre: '', mois: '' };
  function bornesMois(am) {
    var a = am + '-01';
    var d = new Date(a + 'T12:00:00'); d.setMonth(d.getMonth() + 1); d.setDate(0);
    return [a, isoLocal(d)];
  }
  /** Heures d'un enseignant dans un centre pour un mois : prévues (créneaux), faites (pointages), dû selon son contrat. */
  function bilanEnseignant(uid, cid, am) {
    var b = bornesMois(am);
    var fin = b[1] < isoLocal(new Date()) ? b[1] : isoLocal(new Date());
    var crs = lignes('creneaux').filter(function (c) { return c.centre_id === cid && c.enseignant_id === uid; });
    var prevues = 0, seancesPrevues = 0;
    for (var d = b[0]; d <= fin; d = decalerJour(d, 1)) {
      crs.forEach(function (c) { if (Number(c.jour) === jourDe(d)) { prevues += minutes(c.fin) - minutes(c.debut); seancesPrevues++; } });
    }
    var pres = lignes('presences_ens').filter(function (p) { return p.centre_id === cid && p.date >= b[0] && p.date <= b[1] && (p.enseignant_id === uid || p.remplacant_id === uid); });
    var faites = 0, seances = 0, absences = 0, retards = 0, minRetard = 0, remplacements = 0;
    pres.forEach(function (p) {
      var pourLui = p.statut === 'remplace' ? p.remplacant_id === uid : p.enseignant_id === uid;
      if (p.statut === 'absent' && p.enseignant_id === uid) { absences++; return; }
      if (p.statut === 'remplace' && p.enseignant_id === uid) { absences++; return; }
      if (!pourLui) return;
      if (p.statut === 'remplace') remplacements++;
      faites += Number(p.minutes) || 0; seances++;
      if (p.statut === 'retard') { retards++; minRetard += Number(p.retard_min) || 0; }
    });
    var contrat = contratDe(uid, cid);
    var du = 0;
    if (contrat) {
      var t = Number(contrat.taux) || 0;
      du = contrat.mode === 'heure' ? Math.round(faites / 60 * t) : contrat.mode === 'seance' ? seances * t : Math.max(0, t - absences * (Number(contrat.retenue_absence) || 0));
    }
    var paies = lignes('paies').filter(function (p) { return p.centre_id === cid && p.enseignant_id === uid && p.mois === am; });
    var verse = paies.filter(function (p) { return !Number(p.annule); }).reduce(function (s, p) { return s + Number(p.montant); }, 0);
    return { prevues: prevues, seancesPrevues: seancesPrevues, faites: faites, seances: seances, absences: absences, retards: retards, minRetard: minRetard,
      remplacements: remplacements, contrat: contrat, du: du, verse: verse, reste: Math.max(0, du - verse), paies: paies, pres: pres, crs: crs };
  }
  var LIB_MODE_REM = { heure: 'à l\'heure', seance: 'à la séance', forfait: 'au forfait mensuel' };
  // Sans contrat particulier, un enseignant est payé 1 500 F de l'heure (même valeur côté serveur).
  var TAUX_HORAIRE_DEFAUT = 1500;
  function contratDe(uid, cid) {
    return lignes('contrats').filter(function (c) { return c.centre_id === cid && c.utilisateur_id === uid && Number(c.actif); })[0] ||
      { mode: 'heure', taux: TAUX_HORAIRE_DEFAUT, defaut: true };
  }
  function idPaieCours(presenceId) { return 'pp' + presenceId; }
  function paieDuCours(presenceId) { return lignes('paies').filter(function (x) { return x.presence_id === presenceId && !Number(x.annule); })[0] || null; }
  /** Ce que rapporte un cours pointé : à qui, combien, selon quel calcul. null s'il n'y a rien à payer. */
  function montantCours(p) {
    if (!p || ['present', 'retard', 'remplace'].indexOf(p.statut) < 0 || !(Number(p.minutes) > 0)) return null;
    var prof = p.statut === 'remplace' ? p.remplacant_id : p.enseignant_id;
    var k = contratDe(prof, p.centre_id);
    if (k.mode === 'forfait') return null;
    var t = Number(k.taux) || 0;
    var m = k.mode === 'seance' ? t : Math.round(Number(p.minutes) / 60 * t);
    return { prof: prof, montant: m, calcul: k.mode === 'seance' ? 'séance · ' + fcfa(t) : dureeLisible(Number(p.minutes)) + ' × ' + fcfa(t) + '/h' };
  }
  function enteteMois(etat, action) {
    var auj = isoLocal(new Date()).slice(0, 7);
    if (!etat.mois) etat.mois = auj;
    var lib = MOIS[Number(etat.mois.slice(5, 7)) - 1].replace(/^./, function (c) { return c.toUpperCase(); }) + ' ' + etat.mois.slice(0, 4);
    return '<div class="nav-date"><button type="button" class="btn clair petit" data-a="' + action + '" data-v="-1" aria-label="Mois précédent">‹</button><b>' + esc(lib) + '</b>' +
      '<button type="button" class="btn clair petit" data-a="' + action + '" data-v="1"' + (etat.mois >= auj ? ' disabled' : '') + ' aria-label="Mois suivant">›</button></div>';
  }
  function decalerMois(am, n) { var d = new Date(am + '-15T12:00:00'); d.setMonth(d.getMonth() + n); return isoLocal(d).slice(0, 7); }
  function pageEnseignants() {
    var dispo = centresChoisis().filter(function (c) { return peut('finances.voir', c.id) || peut('enseignants.gerer', c.id); });
    if (!dispo.some(function (c) { return c.id === ENS.centre; })) ENS.centre = dispo.length ? dispo[0].id : '';
    var cid = ENS.centre;
    var h = '<h1>Enseignants</h1>' + enteteMois(ENS, 'ens-mois');
    if (dispo.length > 1) h += '<div class="puces">' + dispo.map(function (c) { return '<button type="button" class="puce' + (c.id === cid ? ' on' : '') + '" data-a="ens-centre" data-v="' + esc(c.id) + '">' + esc(c.nom_court || c.nom) + '</button>'; }).join('') + '</div>';
    if (!cid) return h + '<div class="carte vide">Aucun centre.</div>';
    var profs = enseignantsDu(cid);
    if (!profs.length) return h + '<div class="carte vide">Aucun enseignant dans ce centre pour l\'instant.' + (peutCreerEnseignant(cid) ? '' : ' Demandez à l\'administrateur de créer leurs comptes.') + '</div>' +
      '<div class="actions">' + boutonAjoutEnseignant(cid) + '</div>';
    h += '<div class="actions">' + boutonAjoutEnseignant(cid) + '</div>';
    var tot = { du: 0, verse: 0 };
    var rows = profs.map(function (t) {
      var b = bilanEnseignant(t.id, cid, ENS.mois);
      tot.du += b.du; tot.verse += b.verse;
      var classes = {}; b.crs.forEach(function (c) { classes[nomDe('classes', c.classe_id)] = 1; });
      var mats = String(t.matieres || '').split(',').filter(Boolean).map(function (m) { return nomDe('matieres', m); }).filter(Boolean);
      return '<button class="ligne" type="button" data-a="voir-ens" data-id="' + esc(t.id) + '"><span class="avatar">' + esc(initiales(t.nom)) + '</span><span class="corps"><b>' + esc(t.nom) + '</b>' +
        '<small>' + esc([mats.join(', '), Object.keys(classes).join(', ')].filter(Boolean).join(' · ') || 'aucun cours') + '</small>' +
        '<small>' + dureeLisible(b.faites) + ' faites / ' + dureeLisible(b.prevues) + ' prévues' + (b.absences ? ' · ' + b.absences + ' abs.' : '') + (b.retards ? ' · ' + b.retards + ' retard' + (b.retards > 1 ? 's' : '') : '') + '</small>' +
        (b.contrat.defaut ? '<small>' + fcfa(TAUX_HORAIRE_DEFAUT) + '/h · taux par défaut</small>' : '') + '</span>' +
        '<span class="fin">' + (b.contrat ? '<b>' + fcfa(b.du) + '</b>' + (b.reste ? '<span class="badge alerte">reste ' + fcfa(b.reste) + '</span>' : b.du ? '<span class="badge ok">payé</span>' : '') : '<span class="badge">sans contrat</span>') + '</span></button>';
    });
    h += '<div class="stats"><div><b>' + fcfa(tot.du) + '</b><small>dû ce mois</small></div><div><b>' + fcfa(tot.verse) + '</b><small>versé</small></div></div><div class="liste">' + rows.join('') + '</div>';
    return h;
  }
  function feuilleEnseignant(uid) {
    var cid = ENS.centre;
    var t = enseignantsDu(cid).filter(function (e) { return e.id === uid; })[0] || { nom: '' };
    var b = bilanEnseignant(uid, cid, ENS.mois);
    var gere = peut('enseignants.gerer', cid);
    var c = b.contrat;
    ouvrirFeuille('<h2>' + esc(t.nom) + '</h2><p class="doux">' + esc((ligne('centres', cid) || {}).nom || '') + ' · ' + esc(MOIS[Number(ENS.mois.slice(5)) - 1] + ' ' + ENS.mois.slice(0, 4)) + '</p>' +
      '<div class="stats petites"><div><b>' + dureeLisible(b.faites) + '</b><small>faites (' + b.seances + ' séance' + (b.seances > 1 ? 's' : '') + ')</small></div><div><b>' + dureeLisible(b.prevues) + '</b><small>prévues</small></div><div><b>' + b.absences + '</b><small>absences</small></div></div>' +
      '<div class="infos"><div class="info"><span>Retards</span><b>' + b.retards + (b.minRetard ? ' (' + b.minRetard + ' min)' : '') + '</b></div>' + (b.remplacements ? '<div class="info"><span>Remplacements assurés</span><b>' + b.remplacements + '</b></div>' : '') +
      '<div class="info"><span>Rémunération</span><b>' + esc(LIB_MODE_REM[b.contrat.mode]) + ' · ' + fcfa(b.contrat.taux) + (b.contrat.defaut ? ' (taux par défaut)' : '') + '</b></div>' +
      '<div class="info"><span>Dû ce mois</span><b>' + fcfa(b.du) + '</b></div><div class="info"><span>Versé</span><b>' + fcfa(b.verse) + '</b></div><div class="info"><span>Reste</span><b class="' + (b.reste ? 'st-absent' : 'st-present') + '">' + fcfa(b.reste) + '</b></div></div>' +
      (b.paies.length ? '<h3>Paies du mois</h3><div class="liste">' + b.paies.map(function (p) {
        return '<div class="ligne"><span class="corps"><b' + (Number(p.annule) ? ' class="barre-txt"' : '') + '>' + fcfa(p.montant) + '</b><small>' + esc(dateLisible(p.date, true) + ' · ' + MODES[p.mode] + (Number(p.annule) ? ' · annulée : ' + (p.motif_annulation || '') : '')) + '</small></span>' +
          (gere && !Number(p.annule) ? '<button class="btn clair petit" type="button" data-a="annuler-paie" data-id="' + esc(p.id) + '">Annuler</button>' : '') + '</div>';
      }).join('') + '</div>' : '') +
      (gere ? '<form data-f="paie" data-ens="' + esc(uid) + '"><h3>Verser la paie</h3><div class="deux"><label class="champ"><span>Montant (F)</span><input type="number" name="montant" min="1" value="' + (b.reste || '') + '" required></label>' +
        '<label class="champ"><span>Mode</span><select name="mode">' + Object.keys(MODES).map(function (m) { return '<option value="' + m + '">' + MODES[m] + '</option>'; }).join('') + '</select></label></div>' +
        '<div class="actions"><button class="btn or" type="submit">' + ico('wallet', 'p') + 'Verser</button></div></form>' +
        '<form data-f="contrat" data-ens="' + esc(uid) + '" data-id="' + esc(b.contrat.defaut ? '' : b.contrat.id) + '"><h3>Contrat</h3><div class="deux"><label class="champ"><span>Rémunéré</span><select name="mode">' +
        Object.keys(LIB_MODE_REM).map(function (m) { return '<option value="' + m + '"' + (c.mode === m ? ' selected' : '') + '>' + LIB_MODE_REM[m] + '</option>'; }).join('') + '</select></label>' +
        '<label class="champ"><span>Taux (F)</span><input type="number" name="taux" min="0" required value="' + esc(c.taux) + '"></label></div>' +
        '<label class="champ"><span>Retenue par absence (forfait)</span><input type="number" name="retenue_absence" min="0" value="' + esc(c.retenue_absence || '') + '"></label>' +
        '<div class="actions"><button class="btn clair" type="submit">Enregistrer le contrat</button></div></form>' : '') +
      '<div class="actions"><button class="btn clair" type="button" data-a="progression-ens" data-id="' + esc(uid) + '">' + ico('bookopen', 'p') + 'Sa progression</button><button class="btn clair" type="button" data-a="bulletin-ens" data-id="' + esc(uid) + '">' + ico('camera', 'p') + 'Bulletin du mois</button><button class="btn clair" type="button" data-a="fermer">Fermer</button></div>');
  }
  /** Bulletin de rémunération (image) : à remettre ou à envoyer à l'enseignant. */
  function bulletinEnseignant(uid, cid, am) {
    return Promise.all([chargerLogo(), document.fonts ? document.fonts.load('600 24px Poppins') : null, chargerLogoDetoure()]).then(function (r) {
      var b = bilanEnseignant(uid, cid, am);
      var t = enseignantsDu(cid).filter(function (e) { return e.id === uid; })[0] || { nom: '' };
      var c = ligne('centres', cid) || {};
      var L = 1240, H = 1240, M = 70;
      var cv = document.createElement('canvas'); cv.width = L; cv.height = H;
      var g = cv.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, L, H);
      g.fillStyle = '#0C2A6A'; g.fillRect(0, 0, L, 170);
      if (r[0]) g.drawImage(r[0], M, 30, 110, 110);
      g.fillStyle = '#fff'; g.font = '600 40px Poppins, sans-serif'; g.fillText(texteCoupe(g, c.nom || 'VÉRITAS', L - 2 * M - 140), M + 135, 90);
      g.font = '400 22px Poppins, sans-serif'; g.fillStyle = '#C9D6F2'; g.fillText(texteCoupe(g, c.adresse || '', L - 2 * M - 140), M + 135, 130);
      g.fillStyle = '#FFC93C'; g.fillRect(0, 170, L, 6);
      g.fillStyle = '#001136'; g.font = '600 40px Poppins, sans-serif'; g.fillText('Bulletin de rémunération', M, 250);
      g.font = '400 26px Poppins, sans-serif'; g.fillStyle = '#4D5163'; g.fillText(MOIS[Number(am.slice(5)) - 1].replace(/^./, function (x) { return x.toUpperCase(); }) + ' ' + am.slice(0, 4), M, 292);
      if (r[2]) { var lf = 520; g.save(); g.globalAlpha = 0.06; g.drawImage(r[2], L / 2 - lf / 2, 360, lf, Math.round(lf * r[2].naturalHeight / r[2].naturalWidth)); g.restore(); }
      var y = 370;
      var ligneB = function (lib, val, gras) {
        g.font = '400 25px Poppins, sans-serif'; g.fillStyle = '#6B7185'; g.fillText(lib, M, y);
        g.font = (gras ? '600' : '500') + ' 27px Poppins, sans-serif'; g.fillStyle = '#001136'; g.fillText(texteCoupe(g, val, L - 2 * M - 420), M + 420, y);
        g.fillStyle = '#E1E6F0'; g.fillRect(M, y + 18, L - 2 * M, 1); y += 62;
      };
      ligneB('Enseignant', t.nom, true);
      ligneB('Heures faites', dureeLisible(b.faites) + ' (' + b.seances + ' séance' + (b.seances > 1 ? 's' : '') + ') sur ' + dureeLisible(b.prevues) + ' prévues');
      ligneB('Absences · retards', b.absences + ' · ' + b.retards + (b.minRetard ? ' (' + b.minRetard + ' min)' : ''));
      ligneB('Rémunération', b.contrat ? LIB_MODE_REM[b.contrat.mode] + ' · ' + fcfa(b.contrat.taux) : '—');
      ligneB('Montant dû', fcfa(b.du) + ' (' + enLettres(b.du) + ' francs CFA)', true);
      ligneB('Déjà versé', fcfa(b.verse));
      ligneB('Reste à verser', fcfa(b.reste), true);
      y += 60;
      g.font = '400 22px Poppins, sans-serif'; g.fillStyle = '#6B7185';
      g.fillText('Signature de l\'enseignant', M, y); g.textAlign = 'right'; g.fillText('La Direction', L - M, y); g.textAlign = 'left';
      g.font = '400 18px Poppins, sans-serif'; g.fillText('VÉRITAS Gestion · édité le ' + new Date().toLocaleDateString('fr-FR'), M, H - 40);
      return versBlob(cv, 'image/png').then(function (bl) {
        var nom = ('bulletin-' + am + '-' + t.nom).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9-]+/g, '-');
        return new File([bl], nom + '.png', { type: 'image/png' });
      });
    });
  }

  // « Mes heures » : l'enseignant voit ses cours, ses heures, son dû et ses paies.
  var MES = { mois: '' };
  function pageMesHeures() {
    var u = E.profil.utilisateur;
    var h = '<h1>Mes heures</h1>' + enteteMois(MES, 'mes-mois');
    var centres = lignes('centres').filter(function (c) { return roleDans(c.id) === 'enseignant'; });
    if (!centres.length) return h + '<div class="carte vide">Aucun centre où vous enseignez.</div>';
    centres.forEach(function (c) {
      var b = bilanEnseignant(u.id, c.id, MES.mois);
      h += '<h2>' + esc(c.nom) + '</h2><div class="stats"><div><b>' + dureeLisible(b.faites) + '</b><small>faites · ' + b.seances + ' séance' + (b.seances > 1 ? 's' : '') + '</small></div><div><b>' + dureeLisible(b.prevues) + '</b><small>prévues</small></div>' +
        (b.contrat ? '<div><b>' + fcfa(b.du) + '</b><small>dû (' + esc(LIB_MODE_REM[b.contrat.mode]) + ')</small></div><div><b>' + fcfa(b.verse) + '</b><small>reçu</small></div>' : '') + '</div>';
      if (b.paies.length) h += '<h3>Mes paies</h3><div class="liste">' + b.paies.slice().sort(function (a, z) { return a.date < z.date ? 1 : -1; }).map(lignePaie).join('') + '</div>';
      var l = b.pres.slice().sort(function (a, z) { return a.date < z.date ? 1 : -1; });
      h += l.length ? '<h3>Mes cours</h3><div class="liste">' + l.map(function (p) {
        var cr = ligne('creneaux', p.creneau_id) || {};
        var lui = p.statut === 'remplace' ? (p.remplacant_id === u.id ? 'Remplacement assuré' : 'Remplacé') : LIB_ENS[p.statut];
        return '<div class="ligne"><span class="corps"><b>' + esc(dateLisible(p.date, true) + ' · ' + nomDe('classes', cr.classe_id)) + '</b><small>' + esc(lui + (p.arrivee ? ' · ' + p.arrivee : '') + (p.depart ? ' → ' + p.depart : '') + (Number(p.retard_min) ? ' (+' + p.retard_min + ' min)' : '')) + '</small>' + (function () { var pc = paieDuCours(p.id); return pc ? '<span class="badge ok">payé ' + fcfa(pc.montant) + ' le ' + esc(dateLisible(pc.date, true)) + '</span>' : ''; })() + '</span><span class="fin"><b>' + dureeLisible(Number(p.minutes) || 0) + '</b></span></div>';
      }).join('') + '</div>' : '<div class="carte vide">Aucun cours pointé ce mois-ci.</div>';
    });
    return h;
  }

  function pagePointage(arg) {
    var parts = String(arg).split('/');
    var classe = ligne('classes', parts[0]);
    var iso = parts[1] || isoLocal(new Date());
    if (!classe) return '<div class="carte vide">Classe introuvable.</div>';
    var cid = classe.centre_id;
    var x = seancesPrevues(cid, iso).filter(function (s) { return s.classe.id === classe.id; })[0] ||
      { id: idSeance(iso, classe.id), centre_id: cid, classe: classe, date: iso, debut: '16:00', fin: '18:00', creneaux: [], existante: ligne('seances', idSeance(iso, classe.id)) };
    var modifiable = peutPointer(cid, classe.id, iso) && (!trop_ancien(iso) || correcteur(cid));
    var justifiable = peut('eleves.gerer', cid) || correcteur(cid);
    var e = etatSeance(x);
    var eleves = elevesActifs(cid).filter(function (el) { return el.classe_id === classe.id; }).sort(function (a, b) { return nomComplet(a).localeCompare(nomComplet(b), 'fr'); });
    // Les élèves partis depuis gardent leur ligne s'ils ont été pointés.
    presencesDe(x.id).forEach(function (p) { if (!eleves.some(function (el) { return el.id === p.eleve_id; })) { var el = ligne('eleves', p.eleve_id); if (el) eleves.push(el); } });
    var close = x.existante && x.existante.statut === 'close';
    var h = '<p class="retour"><a href="#/appel">‹ Appel</a></p><h1>' + esc(classe.nom) + '</h1><p class="sous-titre">' + esc(dateLongue(iso)) + ' · ' + heureLisible(x.debut) + ' – ' + heureLisible(x.fin) +
      (x.creneaux.length ? ' · ' + esc(x.creneaux.map(function (c) { return nomDe('matieres', c.matiere_id); }).join(', ')) : '') + (close ? ' · <span class="badge ok">appel clos</span>' : '') + '</p>';
    h += '<div class="compteurs"><span class="c-ok"><b>' + e.present + '</b>présents</span><span class="c-retard"><b>' + e.retard + '</b>retards</span><span class="c-abs"><b>' + (e.absent + e.justifie) + '</b>absents</span><span><b>' + Math.max(0, eleves.length - e.pointes) + '</b>à pointer</span></div>';
    if (!modifiable) h += '<p class="note">' + (trop_ancien(iso) && peut('appel.faire', cid) ? 'Appel de plus de 2 jours : seul un responsable peut le corriger.' + (justifiable ? ' Vous pouvez encore justifier une absence.' : '') : 'Consultation seule.') + '</p>';
    if (modifiable && eleves.length) {
      h += '<div class="actions">' + (eleves.length > e.pointes ? '<button class="btn or" type="button" data-a="tous-presents" data-seance="' + esc(x.id) + '">' + ico('check', 'p') + 'Tous présents à l\'heure</button>' : '') +
        '<button class="btn clair" type="button" data-a="fin-cours" data-seance="' + esc(x.id) + '">' + ico('clock', 'p') + 'Fin du cours</button></div>';
    }
    if (!eleves.length) h += '<div class="carte vide">Aucun élève inscrit dans cette classe.</div>';
    h += '<div class="liste pointage">' + eleves.map(function (el) {
      var p = ligne('presences', idPresence(x.id, el.id)) || presencesDe(x.id).filter(function (q) { return q.eleve_id === el.id; })[0];
      var etat = !p ? '<small class="a-pointer">à pointer</small>'
        : '<small class="st-' + p.statut + '">' + LIB_STATUT[p.statut] + (p.arrivee ? ' · ' + p.arrivee : '') + (Number(p.retard_min) ? ' (+' + p.retard_min + ' min)' : '') + (p.depart ? ' → ' + p.depart : '') + (p.motif ? ' · ' + esc(p.motif) : '') + '</small>';
      var boutons = '';
      if (modifiable) {
        if (!p || p.statut === 'absent' || p.statut === 'justifie') boutons += '<button type="button" class="rond ok" data-a="pointer" data-v="arrive" data-seance="' + esc(x.id) + '" data-eleve="' + esc(el.id) + '" aria-label="Arrivé maintenant">' + ico('check') + '</button>';
        else if (!p.depart) boutons += '<button type="button" class="rond" data-a="pointer" data-v="depart" data-seance="' + esc(x.id) + '" data-eleve="' + esc(el.id) + '" aria-label="Parti maintenant">' + ico('download') + '</button>';
        if (!p || p.statut === 'present' || p.statut === 'retard') boutons += '<button type="button" class="rond abs" data-a="pointer" data-v="absent" data-seance="' + esc(x.id) + '" data-eleve="' + esc(el.id) + '" aria-label="Absent">' + ico('x') + '</button>';
      } else if (justifiable && p && p.statut === 'absent') {
        boutons += '<button type="button" class="btn clair petit" data-a="detail-presence" data-seance="' + esc(x.id) + '" data-eleve="' + esc(el.id) + '">Justifier</button>';
      }
      var impaye = peut('paiements.voir', cid) ? echeancier(el).impaye : 0;
      return '<div class="ligne' + (p ? ' pt-' + p.statut : '') + '"><button type="button" class="corps nom-eleve" data-a="detail-presence" data-seance="' + esc(x.id) + '" data-eleve="' + esc(el.id) + '"' + (modifiable || (justifiable && p) ? '' : ' disabled') + '><b>' + (impaye ? '<i class="marque-doit" title="Doit ' + esc(fcfa(impaye)) + '"></i>' : '') + esc(nomComplet(el)) + (impaye ? ' <span class="badge danger" title="Impayé échu">doit ' + fcfa(impaye) + '</span>' : '') + '</b>' + etat + '</button>' +
        (p && p._attente ? '<span class="badge alerte">en attente</span>' : '') + '<span class="boutons">' + boutons + '</span></div>';
    }).join('') + '</div>';
    if (modifiable && eleves.length && !close) h += '<div class="actions"><button class="btn" type="button" data-a="clore-appel" data-seance="' + esc(x.id) + '">' + ico('checkcircle', 'p') + 'Clore l\'appel</button></div>';
    if (e.pointes) h += '<div class="actions"><button class="btn or" type="button" data-a="ouvrir-export">' + ico('download', 'p') + 'Partager la feuille du jour</button></div>';
    if (modifiable || justifiable) h += blocMessages(x);
    var se = x.existante || {};
    h += '<h2>Cahier de textes</h2><form data-f="cahier" data-seance="' + esc(x.id) + '"><label class="champ"><span>Ce qui a été fait</span><textarea name="contenu" rows="2"' + (modifiable ? '' : ' disabled') + '>' + esc(se.contenu || '') + '</textarea></label>' +
      '<label class="champ"><span>Travail donné</span><textarea name="travail" rows="2"' + (modifiable ? '' : ' disabled') + '>' + esc(se.travail || '') + '</textarea></label>' +
      (modifiable ? '<div class="actions"><button class="btn clair" type="submit">Enregistrer</button></div>' : '') + '</form>';
    E.cache.pointage = x;
    return h;
  }

  /** La feuille existe-t-elle ? Sinon on l'ouvre (une fois) avant le premier pointage. */
  function assurerSeance(x) {
    if (ligne('seances', x.id) && !Number(ligne('seances', x.id).supprime)) return Promise.resolve();
    x.existante = { debut: x.debut, fin: x.fin, statut: 'ouverte' };
    return muter('seances', x.id, { centre_id: x.centre_id, classe_id: x.classe.id, date: x.date, debut: x.debut, fin: x.fin, statut: 'ouverte', ouverte_par: E.profil.utilisateur.id });
  }
  function pointer(x, eleveId, champs) {
    var pid = idPresence(x.id, eleveId);
    var avant = ligne('presences', pid);
    var c = Object.assign({ centre_id: x.centre_id, seance_id: x.id, eleve_id: eleveId, date: x.date }, champs);
    if ((c.statut === 'present' || c.statut === 'retard') && c.arrivee) Object.assign(c, statutCalcule(c.arrivee, x.debut, x.centre_id));
    if (c.statut === 'absent') { c.arrivee = ''; c.depart = ''; c.retard_min = 0; }
    if (avant) { delete c.centre_id; delete c.seance_id; delete c.eleve_id; delete c.date; }
    return assurerSeance(x).then(function () { return muter('presences', pid, c); });
  }
  function feuillePresence(x, eleveId) {
    var el = ligne('eleves', eleveId);
    var p = ligne('presences', idPresence(x.id, eleveId)) || {};
    var modifiable = peutPointer(x.centre_id, x.classe.id, x.date) && (!trop_ancien(x.date) || correcteur(x.centre_id));
    var opts = modifiable ? ['present', 'retard', 'absent', 'justifie'] : ['absent', 'justifie'];
    ouvrirFeuille('<h2>' + esc(nomComplet(el)) + '</h2><p class="doux">' + esc(x.classe.nom) + ' · ' + esc(dateLongue(x.date)) + ' · début ' + heureLisible(x.debut) + '</p>' +
      '<form data-f="presence" data-eleve="' + esc(eleveId) + '">' +
      '<label class="champ"><span>Statut</span><select name="statut">' + opts.map(function (o) { return '<option value="' + o + '"' + ((p.statut || 'present') === o ? ' selected' : '') + '>' + LIB_STATUT[o] + '</option>'; }).join('') + '</select><small>Présent ou en retard : décidé par l\'heure d\'arrivée (tolérance ' + esc((ligne('centres', x.centre_id) || {}).tolerance_retard_min) + ' min).</small></label>' +
      (modifiable ? '<div class="deux"><label class="champ"><span>Arrivée</span><input type="time" name="arrivee" value="' + esc(p.arrivee || heureMaintenant()) + '"></label>' +
        '<label class="champ"><span>Départ</span><input type="time" name="depart" value="' + esc(p.depart || '') + '"></label></div>' : '') +
      '<label class="champ"><span>Motif ou justificatif</span><input type="text" name="motif" value="' + esc(p.motif || '') + '" placeholder="ex. : maladie, certificat médical"></label>' +
      '<div class="actions"><button class="btn" type="submit">Enregistrer</button>' + (p.id && correcteur(x.centre_id) ? '<button class="btn danger" type="button" data-a="suppr-presence" data-id="' + esc(p.id) + '">Effacer le pointage</button>' : '') +
      '<button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
  }

  // ───────────────────────────── Feuille du jour : image et PDF ─────────────────────────────
  // Dessinée sur un canvas (Poppins, logo, couleurs du site), puis :
  //  - PNG d'un seul tenant : ce qui passe le mieux dans un groupe WhatsApp ;
  //  - PDF A4 : le JPEG de chaque page enveloppé dans un PDF écrit à la main.
  // Aucune bibliothèque : marche hors ligne et sans CDN (la CSP n'autorise que 'self').
  var LOGO = null, LOGO_DETOURE = null;
  /** Logo détouré (fond transparent, sans cadre) : pour les filigranes. */
  function chargerLogoDetoure() {
    if (LOGO_DETOURE) return Promise.resolve(LOGO_DETOURE);
    return new Promise(function (ok) {
      var i = new Image();
      i.onload = function () { LOGO_DETOURE = i; ok(i); };
      i.onerror = function () { ok(null); };
      i.src = 'logo.png';
    });
  }
  function chargerLogo() {
    if (LOGO) return Promise.resolve(LOGO);
    return new Promise(function (ok) {
      var i = new Image();
      i.onload = function () { LOGO = i; ok(i); };
      i.onerror = function () { ok(null); };
      i.src = 'icone-512.png';
    });
  }
  function lignesFeuille(x) {
    var eleves = elevesActifs(x.centre_id).filter(function (e) { return e.classe_id === x.classe.id; });
    presencesDe(x.id).forEach(function (p) { if (!eleves.some(function (e) { return e.id === p.eleve_id; })) { var e = ligne('eleves', p.eleve_id); if (e) eleves.push(e); } });
    return eleves.sort(function (a, b) { return nomComplet(a).localeCompare(nomComplet(b), 'fr'); }).map(function (e) {
      return { eleve: e, p: ligne('presences', idPresence(x.id, e.id)) || presencesDe(x.id).filter(function (q) { return q.eleve_id === e.id; })[0] || null };
    });
  }
  var COUL = { present: '#17803D', retard: '#9A5B00', absent: '#B42318', justifie: '#6B7185' };

  /** Dessine la feuille. hauteurMax : pour paginer en A4 ; sinon une seule grande image. */
  function dessinerFeuillePresence(x, logo, debutLigne, maxLignes) {
    var L = 1240, M = 70, H_LIGNE = 54;
    var rows = lignesFeuille(x);
    var tranche = rows.slice(debutLigne || 0, maxLignes ? (debutLigne || 0) + maxLignes : undefined);
    var derniere = !maxLignes || (debutLigne || 0) + maxLignes >= rows.length;
    var haut = maxLignes ? 1754 : 360 + tranche.length * H_LIGNE + 230;
    var cv = document.createElement('canvas');
    cv.width = L; cv.height = haut;
    var g = cv.getContext('2d');
    var centre = ligne('centres', x.centre_id) || {};
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, L, haut);
    // En-tête : bande bleue profonde, logo, identité du centre.
    g.fillStyle = '#0C2A6A'; g.fillRect(0, 0, L, 150);
    if (logo) g.drawImage(logo, M, 25, 100, 100);
    g.fillStyle = '#ffffff'; g.font = '600 38px Poppins, sans-serif'; g.fillText(centre.nom || 'VÉRITAS', M + 125, 70);
    g.font = '400 22px Poppins, sans-serif'; g.fillStyle = '#C9D6F2';
    var tels = String(centre.telephones || '').split('/').map(function (t) { return telLisible(t.replace(/\D+/g, '')); }).filter(Boolean).join(' / ');
    g.fillText(texteCoupe(g, [centre.adresse, tels].filter(Boolean).join(' · '), L - M * 2 - 125), M + 125, 108);
    g.fillStyle = '#FFC93C'; g.fillRect(0, 150, L, 6);
    // Titre.
    g.fillStyle = '#001136'; g.font = '600 34px Poppins, sans-serif';
    g.fillText('Feuille de présence — ' + x.classe.nom, M, 220);
    g.font = '400 24px Poppins, sans-serif'; g.fillStyle = '#4D5163';
    var mat = x.creneaux.map(function (c) { return nomDe('matieres', c.matiere_id); }).filter(Boolean).join(', ');
    g.fillText(texteCoupe(g, dateLongue(x.date).replace(/^./, function (c) { return c.toUpperCase(); }) + ' · cours de ' + heureLisible(x.debut) + ' à ' + heureLisible(x.fin) + (mat ? ' · ' + mat : ''), L - M * 2), M, 262);
    if (maxLignes && rows.length > maxLignes) { g.textAlign = 'right'; g.fillText('page ' + (Math.floor((debutLigne || 0) / maxLignes) + 1) + ' / ' + Math.ceil(rows.length / maxLignes), L - M, 220); g.textAlign = 'left'; }
    // Tableau.
    var cols = [M, M + 70, M + 540, M + 690, M + 830];
    var y = 310;
    g.fillStyle = '#EEF3FC'; g.fillRect(M - 10, y, L - 2 * M + 20, 46);
    g.fillStyle = '#0C2A6A'; g.font = '600 21px Poppins, sans-serif';
    ['N°', 'Élève', 'Arrivée', 'Départ', 'Statut'].forEach(function (t, i) { g.fillText(t, cols[i], y + 31); });
    y += 46;
    tranche.forEach(function (r, i) {
      var n = (debutLigne || 0) + i + 1;
      if (i % 2) { g.fillStyle = '#F7F9FC'; g.fillRect(M - 10, y, L - 2 * M + 20, H_LIGNE); }
      g.fillStyle = '#E1E6F0'; g.fillRect(M - 10, y + H_LIGNE - 1, L - 2 * M + 20, 1);
      var p = r.p;
      g.font = '400 22px Poppins, sans-serif'; g.fillStyle = '#6B7185'; g.fillText(String(n), cols[0], y + 35);
      g.fillStyle = '#001136'; g.font = '500 23px Poppins, sans-serif'; g.fillText(texteCoupe(g, nomComplet(r.eleve), cols[2] - cols[1] - 20), cols[1], y + 35);
      g.font = '400 23px Poppins, sans-serif';
      g.fillText(p && p.arrivee ? p.arrivee.replace(':', ' h ') : '—', cols[2], y + 35);
      g.fillText(p && p.depart ? p.depart.replace(':', ' h ') : '—', cols[3], y + 35);
      var st = !p ? 'Non pointé' : LIB_STATUT[p.statut] + (Number(p.retard_min) ? ' (+' + p.retard_min + ' min)' : '');
      g.fillStyle = p ? COUL[p.statut] : '#6B7185'; g.font = '600 22px Poppins, sans-serif';
      g.fillText(texteCoupe(g, st, L - M - cols[4]), cols[4], y + 35);
      y += H_LIGNE;
    });
    if (derniere) {
      var e = etatSeance(x);
      y += 40;
      g.fillStyle = '#001136'; g.font = '600 24px Poppins, sans-serif';
      g.fillText('Présents : ' + e.present + '    Retards : ' + e.retard + '    Absents : ' + (e.absent + e.justifie) + (e.justifie ? ' (dont ' + e.justifie + ' justifié' + (e.justifie > 1 ? 's' : '') + ')' : '') + '    Effectif : ' + rows.length, M, y);
      var se = ligne('seances', x.id) || {};
      if (se.travail) { y += 40; g.font = '400 22px Poppins, sans-serif'; g.fillStyle = '#4D5163'; g.fillText(texteCoupe(g, 'Travail donné : ' + se.travail, L - 2 * M), M, y); }
    }
    filigrane(g, x.classe.nom, L, haut);
    g.font = '400 18px Poppins, sans-serif'; g.fillStyle = '#6B7185';
    g.fillText('Édité le ' + new Date().toLocaleDateString('fr-FR') + ' à ' + heureLisible(heureMaintenant()) + ' par ' + E.profil.utilisateur.nom + ' · VÉRITAS Gestion', M, haut - 40);
    return cv;
  }
  /**
   * Filigrane : le nom de la classe en grand, en diagonale, très pâle, répété sur
   * toute la hauteur. Une feuille partagée dans un groupe WhatsApp reste identifiable
   * même recadrée, et ne se confond pas avec celle d'une autre classe.
   */
  function filigrane(g, texte, L, haut) {
    g.save();
    g.globalAlpha = 0.07;
    g.fillStyle = '#0C2A6A';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    var taille = 150;
    g.font = '600 ' + taille + 'px Poppins, sans-serif';
    while (taille > 60 && g.measureText(texte).width > L * 1.05) { taille -= 10; g.font = '600 ' + taille + 'px Poppins, sans-serif'; }
    for (var y = 620; y < haut - 120; y += 820) {
      g.save(); g.translate(L / 2, y); g.rotate(-Math.PI / 7); g.fillText(texte, 0, 0); g.restore();
    }
    g.restore();
  }
  function texteCoupe(g, t, largeur) {
    t = String(t || '');
    if (g.measureText(t).width <= largeur) return t;
    while (t.length > 1 && g.measureText(t + '…').width > largeur) t = t.slice(0, -1);
    return t + '…';
  }
  function versBlob(cv, type, qualite) { return new Promise(function (ok) { cv.toBlob(ok, type, qualite); }); }
  function nomFichier(x, ext) {
    var base = ('presence-' + x.classe.nom + '-' + x.date).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9-]+/g, '-').replace(/-+/g, '-');
    return base + '.' + ext;
  }
  function imageFeuille(x) {
    return Promise.all([chargerLogo(), document.fonts ? document.fonts.load('600 24px Poppins') : null]).then(function (r) {
      return versBlob(dessinerFeuillePresence(x, r[0]), 'image/png');
    }).then(function (b) { return new File([b], nomFichier(x, 'png'), { type: 'image/png' }); });
  }
  /** PDF minimal : une page A4 par tranche de 24 élèves, chaque page = une image JPEG. */
  function pdfFeuille(x) {
    var PAR_PAGE = 24;
    return Promise.all([chargerLogo(), document.fonts ? document.fonts.load('600 24px Poppins') : null]).then(function (r) {
      var n = Math.max(1, Math.ceil(lignesFeuille(x).length / PAR_PAGE));
      var pages = [];
      for (var i = 0; i < n; i++) pages.push(dessinerFeuillePresence(x, r[0], i * PAR_PAGE, PAR_PAGE));
      return Promise.all(pages.map(function (cv) { return versBlob(cv, 'image/jpeg', 0.9).then(function (b) { return b.arrayBuffer(); }).then(function (a) { return { cv: cv, jpeg: new Uint8Array(a) }; }); }));
    }).then(function (pages) { return new File([pdfDepuisJpeg(pages, 595.28, 841.89)], nomFichier(x, 'pdf'), { type: 'application/pdf' }); });
  }
  /** PDF minimal : une page par image JPEG (largeur × hauteur en points). */
  function pdfDepuisJpeg(pages, largeur, hauteur) {
    {
      var morceaux = [], pos = 0, offsets = [];
      var ecrire = function (t) { var b = typeof t === 'string' ? new TextEncoder().encode(t) : t; morceaux.push(b); pos += b.length; };
      var objet = function (num, corps) { offsets[num] = pos; ecrire(num + ' 0 obj\n'); corps(); ecrire('\nendobj\n'); };
      ecrire('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
      var kids = pages.map(function (_, i) { return (3 + i * 3) + ' 0 R'; }).join(' ');
      objet(1, function () { ecrire('<< /Type /Catalog /Pages 2 0 R >>'); });
      objet(2, function () { ecrire('<< /Type /Pages /Kids [' + kids + '] /Count ' + pages.length + ' >>'); });
      pages.forEach(function (pg, i) {
        var nP = 3 + i * 3, nC = nP + 1, nI = nP + 2;
        var contenu = 'q ' + largeur + ' 0 0 ' + hauteur + ' 0 0 cm /Im' + i + ' Do Q';
        objet(nP, function () { ecrire('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + largeur + ' ' + hauteur + '] /Resources << /XObject << /Im' + i + ' ' + nI + ' 0 R >> >> /Contents ' + nC + ' 0 R >>'); });
        objet(nC, function () { ecrire('<< /Length ' + contenu.length + ' >>\nstream\n' + contenu + '\nendstream'); });
        objet(nI, function () {
          ecrire('<< /Type /XObject /Subtype /Image /Width ' + pg.cv.width + ' /Height ' + pg.cv.height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + pg.jpeg.length + ' >>\nstream\n');
          ecrire(pg.jpeg); ecrire('\nendstream');
        });
      });
      var nb = 3 + pages.length * 3;
      var xref = pos;
      var t = 'xref\n0 ' + nb + '\n0000000000 65535 f \n';
      for (var k = 1; k < nb; k++) t += ('000000000' + offsets[k]).slice(-10) + ' 00000 n \n';
      ecrire(t + 'trailer\n<< /Size ' + nb + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n');
      return new Blob(morceaux, { type: 'application/pdf' });
    }
  }
  /** Partage natif (WhatsApp, etc.) si le téléphone sait partager des fichiers ; sinon téléchargement. */
  function partagerFichiers(fichiers, titre) {
    if (NATIF) return partagerNatif(fichiers, titre);
    if (navigator.canShare && navigator.share && navigator.canShare({ files: fichiers })) {
      return navigator.share({ files: fichiers, title: titre }).catch(function (e) { if (e && e.name !== 'AbortError') telecharger(fichiers); });
    }
    telecharger(fichiers);
    return Promise.resolve();
  }
  /** APK : la WebView d'Android ne sait ni partager ni télécharger un Blob. On écrit les
   *  fichiers dans le cache de l'application, puis on ouvre la feuille de partage d'Android. */
  function partagerNatif(fichiers, titre) {
    var P = window.Capacitor.Plugins;
    return Promise.all(fichiers.map(function (f) {
      return new Promise(function (ok, ko) {
        var lr = new FileReader();
        lr.onload = function () { ok(String(lr.result).split(',')[1]); };
        lr.onerror = ko;
        lr.readAsDataURL(f);
      }).then(function (b64) {
        return P.Filesystem.writeFile({ path: f.name, data: b64, directory: 'CACHE' });
      }).then(function (r) { return r.uri; });
    })).then(function (uris) {
      return P.Share.share({ title: titre, files: uris, dialogTitle: titre });
    }).catch(function (e) {
      if (!/cancel/i.test(String(e && e.message))) toast('Partage impossible : ' + (e && e.message || 'erreur'), 'alerte');
    });
  }
  function partagerTexte(texte) {
    if (NATIF) return window.Capacitor.Plugins.Share.share({ text: texte }).catch(function () {});
    return navigator.share({ text: texte }).catch(function () {});
  }
  function telecharger(fichiers) {
    fichiers.forEach(function (f, i) {
      setTimeout(function () {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(f); a.download = f.name;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      }, i * 400);
    });
    toast(fichiers.length > 1 ? fichiers.length + ' fichiers enregistrés dans Téléchargements.' : 'Fichier enregistré dans Téléchargements.');
  }
  function feuilleExport(x) {
    ouvrirFeuille('<h2>Partager la feuille du jour</h2><p class="doux">' + esc(x.classe.nom) + ' · ' + esc(dateLongue(x.date)) + '</p>' +
      '<div class="liste"><button class="ligne" type="button" data-a="export" data-v="png"><span class="pastille">' + ico('camera') + '</span><span class="corps"><b>Image</b><small>Idéale pour le groupe WhatsApp des parents</small></span></button>' +
      '<button class="ligne" type="button" data-a="export" data-v="pdf"><span class="pastille">' + ico('doc') + '</span><span class="corps"><b>PDF (A4)</b><small>À imprimer ou archiver</small></span></button></div>' +
      '<div id="apercu-export"></div><div class="actions"><button class="btn clair" type="button" data-a="fermer">Fermer</button></div>');
  }

  // ───────────────────────────── Messages aux parents ─────────────────────────────
  var MODELES = {
    absence: 'Bonjour {parent}, le centre {centre} vous informe que {eleve} ({classe}) était absent(e) au cours du {date} ({horaire}). Merci de nous en indiquer le motif au {tel_centre}.',
    retard: 'Bonjour {parent}, {eleve} ({classe}) est arrivé(e) à {arrivee} au cours du {date}, soit {minutes} min après le début ({debut}). Merci de veiller à sa ponctualité. {centre} — {tel_centre}'
  };
  function messageParent(x, p) {
    var el = ligne('eleves', p.eleve_id) || {};
    var c = ligne('centres', x.centre_id) || {};
    var modele = (p.statut === 'retard' ? c.msg_retard : c.msg_absence) || MODELES[p.statut === 'retard' ? 'retard' : 'absence'];
    var v = {
      eleve: nomComplet(el), parent: el.parent_nom || 'cher parent', classe: x.classe.nom, date: dateLongue(x.date), horaire: heureLisible(x.debut) + ' – ' + heureLisible(x.fin),
      debut: heureLisible(x.debut), arrivee: heureLisible(p.arrivee), minutes: String(p.retard_min || 0), centre: c.nom || 'VÉRITAS',
      tel_centre: telLisible(String(c.telephones || '').split('/')[0].replace(/\D+/g, ''))
    };
    return modele.replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; });
  }
  function blocMessages(x) {
    var l = presencesDe(x.id).filter(function (p) { return p.statut === 'absent' || p.statut === 'retard'; })
      .map(function (p) { return { p: p, el: ligne('eleves', p.eleve_id) }; }).filter(function (r) { return r.el; })
      .sort(function (a, b) { return nomComplet(a.el).localeCompare(nomComplet(b.el), 'fr'); });
    if (!l.length) return '';
    var nonFaits = l.filter(function (r) { return !r.p.notifie; }).length;
    return '<h2>Messages aux parents</h2><p class="sous-titre">' + l.length + ' absent' + (l.length > 1 ? 's ou retardataires' : ' ou retardataire') + (nonFaits ? ' · ' + nonFaits + ' message' + (nonFaits > 1 ? 's' : '') + ' à envoyer' : ' · tous préparés') + '</p><div class="liste">' +
      l.map(function (r) {
        var tel = r.el.parent_whatsapp || r.el.parent_tel;
        var sms = r.el.parent_tel || r.el.parent_whatsapp;
        var txt = messageParent(x, r.p);
        var trace = r.p.notifie ? '<small class="st-present">' + ico('check', 'p') + ' préparé à ' + esc(String(r.p.notifie).slice(11, 16).replace(':', ' h ')) + ' (' + (/sms$/.test(r.p.notifie) ? 'SMS' : 'WhatsApp') + ')</small>' : '';
        return '<div class="ligne message"><span class="corps"><b>' + esc(nomComplet(r.el)) + '</b><small class="st-' + r.p.statut + '">' + (r.p.statut === 'retard' ? 'retard de ' + r.p.retard_min + ' min' : 'absent(e)') + '</small>' + trace + '</span>' +
          (tel || sms ? '<span class="boutons">' +
            (tel ? '<a class="btn clair petit" target="_blank" rel="noopener" data-a="msg-parent" data-canal="whatsapp" data-id="' + esc(r.p.id) + '" href="https://wa.me/237' + esc(tel) + '?text=' + encodeURIComponent(txt) + '">' + ico('message', 'p') + 'WhatsApp</a>' : '') +
            (sms ? '<a class="btn clair petit" data-a="msg-parent" data-canal="sms" data-id="' + esc(r.p.id) + '" href="sms:+237' + esc(sms) + '?body=' + encodeURIComponent(txt) + '">SMS</a>' : '') + '</span>'
            : '<span class="doux">pas de numéro</span>') + '</div>';
      }).join('') + '</div>';
  }

  // ───────────────────────────── Finances ─────────────────────────────
  var MOIS_COURTS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  var MODES = { especes: 'Espèces', momo: 'MTN MoMo', om: 'Orange Money', virement: 'Virement', autre: 'Autre' };
  var CATEGORIES = { loyer: 'Loyer', salaires: 'Salaires', fournitures: 'Fournitures', electricite: 'Électricité / eau', transport: 'Transport', communication: 'Communication', autre: 'Autre' };
  /** « 12 500 F » — espace insécable simple (le canvas n'a pas toujours l'espace fine). */
  function fcfa(n) { return String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0F'; }
  function anneeActive() { return lignes('annees').filter(function (a) { return Number(a.active); })[0] || null; }

  /**
   * Échéancier d'un élève pour l'année en cours : inscription, puis une mensualité par
   * mois facturé à partir de son mois d'inscription (septembre gratuit), échue le N du mois.
   * Les versements (non annulés) s'imputent dans l'ordre : du plus ancien dû au plus récent.
   */
  function echeancier(e) {
    var an = anneeActive();
    var classe = ligne('classes', e.classe_id) || {};
    var centre = ligne('centres', e.centre_id) || {};
    var jourEch = Number(centre.jour_echeance) || 10;
    var insc = Number(e.inscription_due) || Number(classe.inscription) || 0;
    var mens = Number(e.mensualite_due) || Number(classe.mensualite) || 0;
    var items = [];
    var dInsc = e.date_inscription || (an && an.debut) || isoLocal(new Date());
    if (insc) items.push({ cle: 'insc', libelle: 'Inscription', court: 'inscription', montant: insc, echeance: dInsc });
    if (an && mens) {
      var y0 = Number(String(an.libelle).slice(0, 4)) || Number(String(an.debut).slice(0, 4));
      var m0 = Number(String(an.debut).slice(5, 7)) || 9;
      var debutAm = dInsc.slice(0, 7);
      var finAm = e.statut === 'parti' && e.date_depart ? e.date_depart.slice(0, 7) : '9999-99';
      String(an.mois_factures || '').split(',').filter(Boolean).forEach(function (mm) {
        var m = Number(mm);
        var y = m >= m0 ? y0 : y0 + 1;
        var am = y + '-' + ('0' + m).slice(-2);
        if (am < debutAm || am > finAm) return;
        items.push({ cle: am, libelle: MOIS[m - 1].replace(/^./, function (c) { return c.toUpperCase(); }) + ' ' + y, court: MOIS_COURTS[m - 1], montant: mens, echeance: am + '-' + ('0' + jourEch).slice(-2), mois: am });
      });
    }
    var vers = lignes('paiements').filter(function (p) { return p.eleve_id === e.id && !Number(p.annule); })
      .sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : String(a.numero || 'zz') < String(b.numero || 'zz') ? -1 : 1; });
    var paye = vers.reduce(function (s, p) { return s + Number(p.montant); }, 0);
    var reste = paye;
    items.forEach(function (it) { it.paye = Math.min(it.montant, reste); reste -= it.paye; });
    var auj = isoLocal(new Date());
    var moisCourant = auj.slice(0, 7);
    var du = items.filter(function (it) { return !it.mois || it.mois <= moisCourant; });
    var echus = items.filter(function (it) { return it.echeance < auj && it.paye < it.montant; });
    return {
      items: items, versements: vers, mensualite: mens, inscription: insc, paye: paye, credit: reste,
      duAcejour: du.reduce(function (s, it) { return s + it.montant; }, 0),
      resteAcejour: du.reduce(function (s, it) { return s + it.montant - it.paye; }, 0),
      impaye: echus.reduce(function (s, it) { return s + it.montant - it.paye; }, 0),
      moisImpayes: echus, totalAnnee: items.reduce(function (s, it) { return s + it.montant; }, 0)
    };
  }
  /** Ce que couvre UN versement : on rejoue l'imputation jusqu'à lui. */
  function couverture(p) {
    var e = ligne('eleves', p.eleve_id);
    if (!e) return { lignes: [], reste: 0 };
    var ech = echeancier(e);
    var avant = 0;
    ech.versements.some(function (v) { if (v.id === p.id) return true; avant += Number(v.montant); return false; });
    var lignesC = [], a = avant, b = avant + (Number(p.annule) ? 0 : Number(p.montant));
    var cumul = 0;
    ech.items.forEach(function (it) {
      var d = cumul, f = cumul + it.montant;
      var pris = Math.max(0, Math.min(f, b) - Math.max(d, a));
      if (pris > 0) lignesC.push({ libelle: it.libelle, court: it.court, pris: pris, complet: Math.min(f, b) >= f, resteItem: f - Math.min(f, b), montant: it.montant });
      cumul = f;
    });
    if (b > cumul) lignesC.push({ libelle: 'Avance', court: 'avance', pris: b - Math.max(a, cumul), complet: true, resteItem: 0 });
    return { lignes: lignesC, reste: ech.resteAcejour, ech: ech };
  }
  function impayes(cid) {
    return lignes('eleves').filter(function (e) { return e.centre_id === cid && e.statut !== 'suspendu'; })
      .map(function (e) { return { e: e, ech: echeancier(e) }; }).filter(function (x) { return x.ech.impaye > 0; })
      .sort(function (a, b) { return b.ech.impaye - a.ech.impaye; });
  }

  /** Où en est un élève : ce qu'il doit (échu, non payé) ou son avance (versé au-delà de ce qui est échu).
   *  Les versements s'imputent du plus ancien dû au plus récent : un trop-versé avance le mois suivant. */
  function soldeEleve(e) {
    if (!e || !peut('paiements.voir', e.centre_id)) return null;
    var ech = echeancier(e), auj = isoLocal(new Date());
    var echu = ech.items.filter(function (it) { return it.echeance < auj; }).reduce(function (s, it) { return s + it.montant; }, 0);
    return { doit: ech.impaye, avance: Math.max(0, ech.paye - echu) };
  }
  /** Pastille rouge devant le nom quand l'élève doit ; rien sinon (affiché seulement à qui voit la caisse). */
  function marqueDevantNom(e) {
    var s = soldeEleve(e);
    return s && s.doit > 0 ? '<i class="marque-doit" title="Doit ' + esc(fcfa(s.doit)) + '" aria-label="Doit ' + esc(fcfa(s.doit)) + '"></i>' : '';
  }
  /** « doit 2 500 F » en rouge, ou « avance 1 500 F » en vert, à droite de la ligne. */
  function badgeSolde(e) {
    var s = soldeEleve(e);
    if (!s) return '';
    if (s.doit > 0) return '<span class="badge danger">doit ' + fcfa(s.doit) + '</span>';
    if (s.avance > 0) return '<span class="badge ok">avance ' + fcfa(s.avance) + '</span>';
    return '';
  }

  /** Échéances des prochains jours pas encore payées : à rappeler AVANT qu'elles tombent. */
  var JOURS_RAPPEL = 5;
  function aEchoir(cid) {
    var auj = isoLocal(new Date()), lim = decalerJour(auj, JOURS_RAPPEL);
    return lignes('eleves').filter(function (e) { return e.centre_id === cid && (e.statut || 'actif') === 'actif'; }).map(function (e) {
      var ech = echeancier(e);
      var its = ech.items.filter(function (it) { return it.echeance >= auj && it.echeance <= lim && it.paye < it.montant; });
      return its.length ? { e: e, ech: ech, items: its, montant: its.reduce(function (s, it) { return s + it.montant - it.paye; }, 0) } : null;
    }).filter(Boolean).sort(function (a, b) { return a.items[0].echeance < b.items[0].echeance ? -1 : 1; });
  }
  function messageRappelEcheance(e, x, pourEleve) {
    var c = ligne('centres', e.centre_id) || {};
    var it = x.items[0];
    return 'Bonjour ' + (pourEleve ? (e.prenoms || nomComplet(e)) : (e.parent_nom || 'cher parent')) + ', petit rappel du centre ' + (c.nom || 'VÉRITAS') + ' : ' +
      fcfa(x.montant).replace(/\u00a0/g, ' ') + ' sont à régler ' + (pourEleve ? '' : 'pour ' + nomComplet(e) + ' ') + 'au plus tard le ' + dateLisible(it.echeance, true) + ' (' +
      x.items.map(function (i) { return i.libelle.toLowerCase(); }).join(', ') + '). Merci ! Contact : ' + telLisible(String(c.telephones || '').split('/')[0].replace(/\D+/g, '')) + '.';
  }
  /** Boutons d'envoi : parent (WhatsApp, SMS) et, si son numéro est connu, l'élève lui-même. */
  function boutonsEnvoi(e, txtParent, txtEleve) {
    var tel = e.parent_whatsapp || e.parent_tel, sms = e.parent_tel || e.parent_whatsapp, el = e.tel_eleve;
    var lien = function (canal, num, txt, lib, cls) {
      return '<a class="btn ' + (cls || 'clair') + ' petit" ' + (canal === 'whatsapp' ? 'target="_blank" rel="noopener" ' : '') + 'data-a="relancer" data-canal="' + canal + '" data-id="' + esc(e.id) + '" href="' +
        (canal === 'whatsapp' ? 'https://wa.me/237' + esc(num) + '?text=' : 'sms:+237' + esc(num) + '?body=') + encodeURIComponent(txt) + '">' + lib + '</a>';
    };
    return (tel ? lien('whatsapp', tel, txtParent, ico('message', 'p') + 'Parent') : '') + (sms ? lien('sms', sms, txtParent, 'SMS parent') : '') +
      (el ? lien('whatsapp', el, txtEleve || txtParent, ico('user', 'p') + 'Élève') : '') + (!tel && !sms && !el ? '<span class="doux">pas de numéro</span>' : '');
  }

  /** Nombre en toutes lettres (règles de 1990 : traits d'union partout), pour la ligne « Somme de ». */
  function enLettres(n) {
    n = Math.floor(Number(n) || 0);
    if (n === 0) return 'zéro';
    var U = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
    var D = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];
    function c99(x) {
      if (x < 17) return U[x];
      if (x < 20) return 'dix-' + U[x - 10];
      var d = Math.floor(x / 10), u = x % 10;
      if (d === 7 || d === 9) return D[d] + (u === 1 && d === 7 ? '-et-' : '-') + U[10 + u];
      if (d === 8) return u ? 'quatre-vingt-' + U[u] : 'quatre-vingts';
      return D[d] + (u === 1 ? '-et-un' : u ? '-' + U[u] : '');
    }
    function c999(x) {
      var c = Math.floor(x / 100), r = x % 100;
      var t = c === 0 ? '' : c === 1 ? 'cent' : U[c] + '-cent' + (r === 0 ? 's' : '');
      return t + (t && r ? '-' : '') + (r ? c99(r) : '');
    }
    var mil = Math.floor(n / 1000000), mille = Math.floor((n % 1000000) / 1000), reste = n % 1000;
    var out = [];
    if (mil) out.push((mil === 1 ? 'un' : c999(mil)) + '-million' + (mil > 1 ? 's' : ''));
    if (mille) out.push(mille === 1 ? 'mille' : c999(mille).replace(/(cent|vingt)s$/, '$1') + '-mille');
    if (reste) out.push(c999(reste));
    return out.join('-');
  }

  var CAI = { centre: '', onglet: 'encaisser', q: '' };
  function centreCaisse() {
    var dispo = centresChoisis().filter(function (c) { return peut('paiements.voir', c.id); });
    if (!dispo.some(function (c) { return c.id === CAI.centre; })) CAI.centre = dispo.length ? dispo[0].id : '';
    return { cid: CAI.centre, dispo: dispo };
  }
  function pageCaisse() {
    var cc = centreCaisse(), cid = cc.cid;
    var encaisse = peut('paiements.encaisser', cid);
    if (!encaisse && CAI.onglet === 'encaisser') CAI.onglet = 'jour';
    var h = '<h1>Caisse</h1>';
    if (cc.dispo.length > 1) h += '<div class="puces">' + cc.dispo.map(function (c) { return '<button type="button" class="puce' + (c.id === cid ? ' on' : '') + '" data-a="caisse-centre" data-v="' + esc(c.id) + '">' + esc(c.nom_court || c.nom) + '</button>'; }).join('') + '</div>';
    if (!cid) return h + '<div class="carte vide">Aucun centre.</div>';
    var imp = impayes(cid);
    var onglets = (encaisse ? [['encaisser', 'Encaisser']] : []).concat([['jour', 'Journal'], ['impayes', 'Impayés' + (imp.length ? ' · ' + imp.length : '')]]);
    var aConf = (estTresorier(cid) || estAdmin()) ? remisesDu(cid).filter(function (r) { return (r.statut || 'en_attente') === 'en_attente' && r.remis_par !== E.profil.utilisateur.id; }).length : 0;
    onglets.push(['remises', 'Remises' + (aConf ? ' · ' + aConf : '')]);
    if (peut('depenses.voir', cid)) onglets.push(['depenses', 'Dépenses']);
    h += '<div class="onglets">' + onglets.map(function (o) { return '<button type="button" class="' + (CAI.onglet === o[0] ? 'on' : '') + '" data-a="caisse-onglet" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';

    if (CAI.onglet === 'encaisser') {
      h += '<label class="recherche"><span class="sr">Rechercher un élève</span>' + ico('search') + '<input type="search" data-input="recherche-caisse" placeholder="Élève, matricule, téléphone du parent" value="' + esc(CAI.q) + '" autocomplete="off"></label><div id="zone-caisse"></div>';
    } else if (CAI.onglet === 'jour') {
      var auj = isoLocal(new Date());
      CAI.date = CAI.date || auj;
      var du = lignes('paiements').filter(function (p) { return p.centre_id === cid && p.date === CAI.date; }).sort(function (a, b) { return String(b.numero || 'zz').localeCompare(String(a.numero || 'zz')); });
      var valides = du.filter(function (p) { return !Number(p.annule); });
      var parMode = {};
      valides.forEach(function (p) { parMode[p.mode] = (parMode[p.mode] || 0) + Number(p.montant); });
      h += '<div class="nav-date"><button type="button" class="btn clair petit" data-a="caisse-date" data-v="-1" aria-label="Jour précédent">‹</button><b>' + esc(CAI.date === auj ? 'Aujourd\'hui' : dateLongue(CAI.date)) + '</b><button type="button" class="btn clair petit" data-a="caisse-date" data-v="1"' + (CAI.date >= auj ? ' disabled' : '') + ' aria-label="Jour suivant">›</button></div>';
      h += '<div class="stats"><div><b>' + fcfa(valides.reduce(function (s, p) { return s + Number(p.montant); }, 0)) + '</b><small>' + valides.length + ' versement' + (valides.length > 1 ? 's' : '') + '</small></div>' +
        Object.keys(MODES).filter(function (m) { return parMode[m]; }).map(function (m) { return '<div><b>' + fcfa(parMode[m]) + '</b><small>' + MODES[m] + '</small></div>'; }).join('') + '</div>';
      h += '<a class="ligne carte-lien" href="#/jour"><span class="pastille">' + ico('chart') + '</span><span class="corps"><b>Point du jour</b><small>Entrées, sorties, solde : fiche à envoyer aux actionnaires</small></span><span class="fin">›</span></a>';
      h += du.length ? '<div class="liste">' + du.map(ligneVersement).join('') + '</div>' : '<div class="carte vide">Aucun versement ce jour-là.</div>';
    } else if (CAI.onglet === 'remises') {
      h += ongletRemises(cid);
    } else if (CAI.onglet === 'impayes') {
      var total = imp.reduce(function (s, x) { return s + x.ech.impaye; }, 0);
      var c = ligne('centres', cid) || {};
      h += '<p class="sous-titre">Échéance le ' + esc(c.jour_echeance || 10) + ' du mois · <b>' + imp.length + '</b> élève' + (imp.length > 1 ? 's' : '') + ' · <b>' + fcfa(total) + '</b> à recouvrer</p>' +
        '<div class="actions"><a class="btn clair petit" href="#/rapports" data-a="aller-rapport" data-v="insolvables" data-centre="' + esc(cid) + '">' + ico('doc', 'p') + 'Exporter la liste des insolvables</a></div>';
      var proche = aEchoir(cid);
      if (proche.length) h += '<h2>Échéance proche · ' + proche.length + '</h2><p class="sous-titre">À régler dans les ' + JOURS_RAPPEL + ' jours : un rappel aimable, avant le retard.</p><div class="liste">' + proche.map(function (x) {
        var e = x.e, trace = e.relance_le ? '<small class="st-present">' + ico('check', 'p') + ' prévenu le ' + esc(dateLisible(e.relance_le)) + '</small>' : '';
        return '<div class="ligne message proche"><button type="button" class="corps nom-eleve" data-a="voir-eleve" data-id="' + esc(e.id) + '"><b>' + esc(nomComplet(e)) + '</b><small>' + esc(nomDe('classes', e.classe_id) + ' · ' + fcfa(x.montant) + ' pour le ' + dateLisible(x.items[0].echeance, true)) + '</small>' + trace + '</button>' +
          '<span class="boutons">' + boutonsEnvoi(e, messageRappelEcheance(e, x, false), messageRappelEcheance(e, x, true)) + '</span></div>';
      }).join('') + '</div><h2>Échus, à relancer · ' + imp.length + '</h2>';
      h += imp.length ? '<div class="liste">' + imp.map(function (x) {
        var e = x.e, tel = e.parent_whatsapp || e.parent_tel, sms = e.parent_tel || e.parent_whatsapp;
        var txt = messageRelance(e, x.ech);
        var trace = e.relance_le ? '<small class="st-present">' + ico('check', 'p') + ' relancé le ' + esc(dateLisible(e.relance_le)) + '</small>' : '';
        return '<div class="ligne message echu"><button type="button" class="corps nom-eleve" data-a="voir-eleve" data-id="' + esc(e.id) + '"><b>' + esc(nomComplet(e)) + (e.statut === 'parti' ? ' <span class="badge">parti</span>' : '') + '</b><small>' + esc(nomDe('classes', e.classe_id)) + ' · ' + esc(x.ech.moisImpayes.map(function (it) { return it.court; }).join(', ')) + '</small><small class="st-absent"><b class="st-absent">' + fcfa(x.ech.impaye) + '</b></small>' + trace + '</button>' +
          '<span class="boutons">' + boutonsEnvoi(e, txt, txt.replace(/^Bonjour [^,]*,/, 'Bonjour ' + (e.prenoms || nomComplet(e)) + ',')) + '</span></div>';
      }).join('') + '</div>' : '<div class="carte vide">Aucun impayé échu. </div>';
    } else {
      var deps = lignes('depenses').filter(function (d) { return d.centre_id === cid; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      if (!E.cache.photosEnAttente) idbTout('fichiers').then(function (f) { E.cache.photosEnAttente = {}; f.forEach(function (x) { E.cache.photosEnAttente[x.id] = 1; }); if (f.length) rendre(); });
      var att = deps.filter(function (d) { return d.statut === 'en_attente'; });
      h += '<p class="sous-titre">' + (att.length ? '<b>' + att.length + '</b> en attente de validation (badge orange « en attente » : touchez-la pour la valider) · ' : '<b>Aucune dépense en attente : rien à valider.</b> ') + 'Une dépense validée ne se modifie plus.</p>';
      var paiesC = peut('paiements.voir', cid) ? lignes('paies').filter(function (x) { return x.centre_id === cid; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; }) : [];
      if (paiesC.length) {
        var moisCourant = isoLocal(new Date()).slice(0, 7);
        var totP = paiesC.filter(function (x) { return !Number(x.annule) && String(x.date).slice(0, 7) === moisCourant; }).reduce(function (s, x) { return s + Number(x.montant); }, 0);
        h += '<h2>Paies des enseignants</h2><p class="sous-titre">' + fcfa(totP) + ' ce mois · 1 500 F de l\'heure sauf contrat particulier. Une paie compte dans le bilan dès qu\'elle est versée : pas de validation.</p><div class="liste">' + paiesC.slice(0, 40).map(function (x) {
          return lignePaie(x);
        }).join('') + '</div><h2>Autres dépenses</h2>';
      }
      h += deps.length ? '<div class="liste">' + deps.slice(0, 80).map(function (d) {
        return ligneDepense(d);
      }).join('') + '</div>' : '<div class="carte vide">Aucune dépense.</div>';
      if (peut('depenses.saisir', cid)) h += '<button class="fab" type="button" data-a="editer-depense" data-id="">' + ico('plus') + 'Dépense</button>';
    }
    return h;
  }
  /** Une dépense (Caisse, Bilan) : touchée, elle s'ouvre (voir, valider, refuser, annuler). */
  function ligneDepense(d) {
    var st = d.statut === 'validee' ? '<span class="badge ok">validée</span>' : d.statut === 'refusee' ? '<span class="badge danger">refusée</span>' : '<span class="badge alerte">en attente</span>';
    var sansJ = (d.statut || 'en_attente') === 'en_attente' && justificatifExige(d) && !d.justificatif && !(E.cache.photosEnAttente || {})[d.id] ? ' <span class="badge alerte">justificatif manquant</span>' : '';
    return '<button class="ligne" type="button" data-a="voir-depense" data-id="' + esc(d.id) + '"><span class="corps"><b>' + esc(d.libelle) + '</b> ' + st + sansJ + '<small>' + esc(dateLisible(d.date, true) + ' · ' + (CATEGORIES[d.categorie] || d.categorie) + (d.beneficiaire ? ' · ' + d.beneficiaire : '') + ' · saisie par ' + (nomPersonne(d.saisie_par) || (d.saisie_par === E.profil.utilisateur.id ? 'vous' : '—'))) + '</small></span><span class="fin"><b>' + fcfa(d.montant) + '</b></span></button>';
  }
  /** Une paie d'enseignant ; « Annuler » pour qui gère les enseignants. */
  function lignePaie(x) {
    var gere = peut('enseignants.gerer', x.centre_id) && !Number(x.annule);
    return '<div class="ligne"><span class="pastille">' + ico('presentation') + '</span><span class="corps"><b' + (Number(x.annule) ? ' class="barre-txt"' : '') + '>' + esc(nomPersonne(x.enseignant_id) || 'Enseignant') + '</b>' + (Number(x.annule) ? '' : ' <span class="badge ok">comptée</span>') + '<small>' +
      esc(dateLisible(x.date, true) + ' · ' + (x.note || 'Paie du mois') + ' · payé par ' + nomCompte(x.paye_par) + (Number(x.annule) ? ' · annulée' : '')) + '</small>' +
      '<span class="boutons"><button class="btn clair petit" type="button" data-a="voir-bon" data-t="paie" data-id="' + esc(x.id) + '">' + ico('doc', 'p') + 'Reçu</button>' +
      (gere ? '<button class="btn clair petit" type="button" data-a="annuler-paie" data-id="' + esc(x.id) + '">Annuler cette paie</button>' : '') + '</span>' +
      '</span><span class="fin"><b>− ' + fcfa(x.montant) + '</b></span></div>';
  }
  function ligneVersement(p) {
    var e = ligne('eleves', p.eleve_id) || {};
    return '<button class="ligne" type="button" data-a="voir-recu" data-id="' + esc(p.id) + '"><span class="corps"><b>' + esc(nomComplet(e)) + (Number(p.annule) ? ' <span class="badge danger">annulé</span>' : '') + '</b><small>' +
      esc((p.numero ? 'Reçu n° ' + p.numero : 'n° à la synchro') + ' · ' + MODES[p.mode] + ' · ' + nomDe('classes', e.classe_id)) + '</small></span><span class="fin"><b' + (Number(p.annule) ? ' class="barre-txt"' : '') + '>' + fcfa(p.montant) + '</b>' + (p._attente ? '<span class="badge alerte">en attente</span>' : '') + '</span></button>';
  }
  function dessinerRechercheCaisse() {
    var z = $('#zone-caisse');
    if (!z) return;
    var cid = CAI.centre;
    var q = cleNom(CAI.q), qTel = String(CAI.q).replace(/\D+/g, '');
    var l = lignes('eleves').filter(function (e) {
      if (e.centre_id !== cid || e.statut === 'parti') return false;
      if (!q && !qTel) return true;
      var cle = cleNom(e.nom + ' ' + e.prenoms + ' ' + (e.matricule || ''));
      return (q && q.split(' ').every(function (m) { return cle.indexOf(m) >= 0; })) || (qTel.length >= 3 && [e.parent_tel, e.parent_whatsapp].some(function (t) { return t && String(t).indexOf(qTel) >= 0; }));
    }).map(function (e) { return { e: e, ech: echeancier(e) }; })
      .sort(function (a, b) { return CAI.q ? nomComplet(a.e).localeCompare(nomComplet(b.e), 'fr') : b.ech.impaye - a.ech.impaye || nomComplet(a.e).localeCompare(nomComplet(b.e), 'fr'); });
    if (!l.length) { z.innerHTML = '<div class="carte vide">Aucun élève.</div>'; return; }
    z.innerHTML = '<div class="liste">' + l.slice(0, 60).map(function (x) {
      var etat = x.ech.impaye ? '<span class="badge danger">' + fcfa(x.ech.impaye) + ' en retard</span>' : x.ech.resteAcejour ? '<span class="badge alerte">' + fcfa(x.ech.resteAcejour) + ' à payer</span>' : '<span class="badge ok">à jour</span>';
      return '<button class="ligne" type="button" data-a="encaisser" data-id="' + esc(x.e.id) + '"><span class="avatar' + (x.e.sexe === 'F' ? ' f' : '') + '">' + esc(initiales(nomComplet(x.e))) + '</span><span class="corps"><b>' + marqueDevantNom(x.e) + esc(nomComplet(x.e)) + '</b><small>' + esc(nomDe('classes', x.e.classe_id) + ' · mensualité ' + fcfa(x.ech.mensualite)) + '</small></span>' + etat + '</button>';
    }).join('') + '</div>';
  }

  function feuillePaiement(eleveId) {
    var e = ligne('eleves', eleveId);
    var ech = echeancier(e);
    var cid = e.centre_id;
    var prochain = ech.items.filter(function (it) { return it.paye < it.montant; })[0];
    var choix = [];
    if (ech.impaye) choix.push([ech.impaye, 'Tout le retard']);
    if (prochain && prochain.montant - prochain.paye !== ech.impaye) choix.push([prochain.montant - prochain.paye, prochain.libelle]);
    if (ech.resteAcejour && choix.every(function (c) { return c[0] !== ech.resteAcejour; })) choix.push([ech.resteAcejour, 'Tout le dû à ce jour']);
    if (ech.mensualite && choix.every(function (c) { return c[0] !== ech.mensualite; })) choix.push([ech.mensualite, 'Une mensualité']);
    var correct = peut('caisse.corriger', cid);
    ouvrirFeuille('<h2>Encaisser</h2><p><b>' + esc(nomComplet(e)) + '</b> · ' + esc(nomDe('classes', e.classe_id)) + '</p>' +
      '<div class="stats petites"><div><b>' + fcfa(ech.resteAcejour) + '</b><small>reste à ce jour</small></div><div><b class="' + (ech.impaye ? 'st-absent' : '') + '">' + fcfa(ech.impaye) + '</b><small>en retard</small></div><div><b>' + fcfa(ech.paye) + '</b><small>déjà versé</small></div></div>' +
      '<form data-f="paiement" data-eleve="' + esc(e.id) + '">' +
      (choix.length ? '<div class="puces">' + choix.map(function (c) { return '<button type="button" class="puce" data-a="montant-rapide" data-v="' + c[0] + '">' + esc(c[1]) + ' · ' + fcfa(c[0]) + '</button>'; }).join('') + '</div>' : '') +
      '<label class="champ"><span>Montant (FCFA)</span><input type="number" name="montant" id="montant-paiement" inputmode="numeric" min="1" step="1" required value="' + (choix.length ? choix[0][0] : '') + '"></label>' +
      '<div class="deux"><label class="champ"><span>Mode</span><select name="mode" data-change="mode-paiement">' + Object.keys(MODES).map(function (m) { return '<option value="' + m + '">' + MODES[m] + '</option>'; }).join('') + '</select></label>' +
      '<label class="champ"><span>Date</span><input type="date" name="date" value="' + isoLocal(new Date()) + '" max="' + isoLocal(new Date()) + '"' + (correct ? '' : ' min="' + decalerJour(isoLocal(new Date()), -2) + '"') + '></label></div>' +
      '<label class="champ" id="champ-reference" hidden><span>Référence de la transaction</span><input type="text" name="reference" placeholder="ex. : MP261102.1543.A12345"></label>' +
      '<label class="champ"><span>Note</span><input type="text" name="note" placeholder="facultatif"></label>' +
      '<p class="doux">Un versement ne se modifie plus : en cas d\'erreur, un responsable l\'annule avec un motif.</p>' +
      '<div class="actions"><button class="btn or" type="submit">' + ico('check', 'p') + 'Encaisser</button><button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
  }

  // Reçu : même gabarit que les carnets papier, en image (WhatsApp) ou en PDF.
  function dessinerRecu(p, logo, filigraneLogo) {
    var L = 1240, H = 1240, M = 70;
    var e = ligne('eleves', p.eleve_id) || {};
    var c = ligne('centres', p.centre_id) || {};
    var cv = couverture(p);
    var cvs = document.createElement('canvas'); cvs.width = L; cvs.height = H;
    var g = cvs.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, L, H);
    g.fillStyle = '#0C2A6A'; g.fillRect(0, 0, L, 170);
    if (logo) g.drawImage(logo, M, 30, 110, 110);
    g.fillStyle = '#fff'; g.font = '600 40px Poppins, sans-serif'; g.fillText(texteCoupe(g, c.nom || 'VÉRITAS', L - M * 2 - 140), M + 135, 78);
    g.font = '400 22px Poppins, sans-serif'; g.fillStyle = '#C9D6F2';
    g.fillText(texteCoupe(g, c.devise || '', L - M * 2 - 140), M + 135, 112);
    var tels = String(c.telephones || '').split('/').map(function (t) { return telLisible(t.replace(/\D+/g, '')); }).filter(Boolean).join(' / ');
    g.fillText(texteCoupe(g, [c.adresse, tels].filter(Boolean).join(' · '), L - M * 2 - 140), M + 135, 144);
    g.fillStyle = '#FFC93C'; g.fillRect(0, 170, L, 6);
    var an = anneeActive();
    g.fillStyle = '#001136'; g.font = '600 42px Poppins, sans-serif'; g.fillText('Reçu n° ' + (p.numero || '— (en attente)'), M, 250);
    g.textAlign = 'right'; g.font = '400 24px Poppins, sans-serif'; g.fillStyle = '#4D5163'; g.fillText('Année scolaire ' + (an ? an.libelle.replace('-', ' - ') : ''), L - M, 250); g.textAlign = 'left';
    var y = 320;
    var champ = function (lib, val, gras) {
      g.font = '400 25px Poppins, sans-serif'; g.fillStyle = '#6B7185'; g.fillText(lib, M, y);
      g.font = (gras ? '600' : '500') + ' 27px Poppins, sans-serif'; g.fillStyle = '#001136'; g.fillText(texteCoupe(g, val, L - M * 2 - 300), M + 300, y);
      g.fillStyle = '#E1E6F0'; g.fillRect(M, y + 18, L - 2 * M, 1);
      y += 66;
    };
    champ('Nom', String(e.nom || '').toUpperCase(), true);
    champ('Prénoms', e.prenoms || '');
    champ('Classe', nomDe('classes', e.classe_id) + (e.matricule ? '   ·   matricule ' + e.matricule : ''));
    champ('Somme de', fcfa(p.montant) + ' (' + enLettres(p.montant) + ' francs CFA)', true);
    champ('Mois', cv.lignes.map(function (l) { return l.libelle + (l.complet ? '' : ' (partiel)'); }).join(', ') || '—');
    var partiel = cv.lignes.filter(function (l) { return !l.complet; })[0];
    champ('Avance / Reste', partiel ? 'Avance ' + fcfa(partiel.pris) + ' · Reste ' + fcfa(partiel.resteItem) + ' sur ' + partiel.libelle.toLowerCase() : 'Mois soldé' + (cv.lignes.length > 1 ? 's' : ''));
    champ('Reste dû à ce jour', fcfa(cv.reste), true);
    champ('Mode', MODES[p.mode] + (p.reference ? ' · réf. ' + p.reference : ''));
    champ('Élaboré par', 'M. ' + (nomPersonne(p.encaisse_par) || (p.encaisse_par === E.profil.utilisateur.id ? E.profil.utilisateur.nom : '—')));
    champ('Fait à Douala le', dateLisible(p.date, true));
    g.fillStyle = '#FFF4DB'; g.fillRect(M, y + 4, L - 2 * M, 64);
    g.fillStyle = '#6A4200'; g.font = '500 24px Poppins, sans-serif';
    g.fillText('NB : les paiements se font au plus tard le ' + (c.jour_echeance || 10) + ' du mois.', M + 20, y + 45);
    g.textAlign = 'right'; g.fillStyle = '#001136'; g.font = 'italic 500 26px Poppins, sans-serif'; g.fillText('La Direction', L - M, H - 70); g.textAlign = 'left';
    g.font = '400 18px Poppins, sans-serif'; g.fillStyle = '#6B7185'; g.fillText('VÉRITAS Gestion · reçu édité le ' + new Date().toLocaleDateString('fr-FR'), M, H - 40);
    if (Number(p.annule)) {
      g.save(); g.globalAlpha = 0.18; g.fillStyle = '#B42318'; g.font = '600 200px Poppins, sans-serif'; g.textAlign = 'center';
      g.translate(L / 2, H / 2); g.rotate(-Math.PI / 7); g.fillText('ANNULÉ', 0, 0); g.restore();
    } else if (filigraneLogo) {
      // Filigrane sans cadre : le logo détouré, centré, très pâle.
      var lf = 560, hf = Math.round(lf * filigraneLogo.naturalHeight / filigraneLogo.naturalWidth);
      g.save(); g.globalAlpha = 0.07; g.drawImage(filigraneLogo, L / 2 - lf / 2, 340 + (560 - hf) / 2, lf, hf); g.restore();
    }
    return cvs;
  }
  // ── Pièce de caisse d'une sortie : reçu de paie d'un enseignant, bon de sortie d'une dépense ──
  // Même habillage que le reçu des élèves ; le bénéficiaire signe (argent reçu), la Direction aussi.
  function infosBon(type, x) {
    if (type === 'paie') {
      return { titre: 'Reçu de paiement · enseignant', ref: 'PA-' + String(x.id).slice(-6).toUpperCase(), benef: nomPersonne(x.enseignant_id) || 'Enseignant',
        objet: x.note || ('Paie de ' + (x.mois ? libMoisAnnee(x.mois) : 'mois')), par: nomCompte(x.paye_par), valide: '',
        etat: Number(x.annule) ? 'ANNULÉ' : '', motif: Number(x.annule) ? (x.motif_annulation || '') : '' };
    }
    return { titre: 'Bon de sortie de caisse', ref: 'DE-' + String(x.id).slice(-6).toUpperCase(), benef: x.beneficiaire || '—',
      objet: (x.libelle || '') + ' · ' + (CATEGORIES[x.categorie] || x.categorie || ''), par: nomPersonne(x.saisie_par) || nomCompte(x.saisie_par),
      valide: x.statut === 'validee' && x.valide_par ? nomCompte(x.valide_par) : '',
      etat: x.statut === 'refusee' ? 'ANNULÉ' : x.statut === 'validee' ? '' : 'À VALIDER', motif: x.statut === 'refusee' ? (x.motif_refus || '') : '' };
  }
  function dessinerBon(type, x, logo, filigraneLogo) {
    var L = 1240, H = 1240, M = 70, c = ligne('centres', x.centre_id) || {}, b = infosBon(type, x);
    var cvs = document.createElement('canvas'); cvs.width = L; cvs.height = H;
    var g = cvs.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, L, H);
    g.fillStyle = '#0C2A6A'; g.fillRect(0, 0, L, 170);
    if (logo) g.drawImage(logo, M, 30, 110, 110);
    g.fillStyle = '#fff'; g.font = '600 40px Poppins, sans-serif'; g.fillText(texteCoupe(g, c.nom || 'VÉRITAS', L - M * 2 - 140), M + 135, 78);
    g.font = '400 22px Poppins, sans-serif'; g.fillStyle = '#C9D6F2';
    g.fillText(texteCoupe(g, c.devise || '', L - M * 2 - 140), M + 135, 112);
    var tels = String(c.telephones || '').split('/').map(function (t) { return telLisible(t.replace(/\D+/g, '')); }).filter(Boolean).join(' / ');
    g.fillText(texteCoupe(g, [c.adresse, tels].filter(Boolean).join(' · '), L - M * 2 - 140), M + 135, 144);
    g.fillStyle = '#FFC93C'; g.fillRect(0, 170, L, 6);
    g.fillStyle = '#001136'; g.font = '600 40px Poppins, sans-serif'; g.fillText(texteCoupe(g, b.titre, L - 2 * M - 300), M, 250);
    g.textAlign = 'right'; g.font = '500 26px Poppins, sans-serif'; g.fillStyle = '#4D5163'; g.fillText('Réf. ' + b.ref, L - M, 250); g.textAlign = 'left';
    var y = 330;
    var champ = function (lib, val, gras) {
      g.font = '400 25px Poppins, sans-serif'; g.fillStyle = '#6B7185'; g.fillText(lib, M, y);
      g.font = (gras ? '600' : '500') + ' 27px Poppins, sans-serif'; g.fillStyle = '#001136'; g.fillText(texteCoupe(g, val, L - M * 2 - 300), M + 300, y);
      g.fillStyle = '#E1E6F0'; g.fillRect(M, y + 18, L - 2 * M, 1);
      y += 66;
    };
    champ('Bénéficiaire', b.benef, true);
    champ('Objet', b.objet);
    champ('Somme de', fcfa(x.montant) + ' (' + enLettres(Number(x.montant) || 0) + ' francs CFA)', true);
    champ('Mode', MODES[x.mode || 'especes'] || x.mode);
    champ(type === 'paie' ? 'Payé par' : 'Saisi par', b.par);
    if (b.valide) champ('Validé par', b.valide);
    champ('Fait à Douala le', dateLisible(x.date, true));
    if (b.motif) champ('Motif d\'annulation', b.motif);
    // Signatures : le bénéficiaire reconnaît avoir reçu la somme.
    var ys = H - 250;
    g.font = '500 24px Poppins, sans-serif'; g.fillStyle = '#4D5163';
    g.fillText('Le bénéficiaire', M, ys); g.textAlign = 'right'; g.fillText('La Direction', L - M, ys); g.textAlign = 'left';
    g.strokeStyle = '#C3CADB'; g.setLineDash([8, 8]); g.lineWidth = 2;
    g.strokeRect(M, ys + 20, 420, 120); g.strokeRect(L - M - 420, ys + 20, 420, 120); g.setLineDash([]);
    g.font = '400 18px Poppins, sans-serif'; g.fillStyle = '#6B7185'; g.fillText('VÉRITAS Gestion · pièce de caisse éditée le ' + new Date().toLocaleDateString('fr-FR'), M, H - 40);
    if (b.etat) {
      g.save(); g.globalAlpha = 0.18; g.fillStyle = b.etat === 'ANNULÉ' ? '#B42318' : '#B54708'; g.font = '600 ' + (b.etat === 'ANNULÉ' ? 200 : 150) + 'px Poppins, sans-serif'; g.textAlign = 'center';
      g.translate(L / 2, H / 2); g.rotate(-Math.PI / 7); g.fillText(b.etat, 0, 0); g.restore();
    } else if (filigraneLogo) {
      var lf = 560, hf = Math.round(lf * filigraneLogo.naturalHeight / filigraneLogo.naturalWidth);
      g.save(); g.globalAlpha = 0.07; g.drawImage(filigraneLogo, L / 2 - lf / 2, 340 + (560 - hf) / 2, lf, hf); g.restore();
    }
    return cvs;
  }
  function fichierBon(type, x, format) {
    return Promise.all([chargerLogo(), document.fonts ? document.fonts.load('600 24px Poppins') : null, chargerLogoDetoure()]).then(function (r) {
      var cv = dessinerBon(type, x, r[0], r[2]), b = infosBon(type, x);
      var base = (b.ref + '-' + b.benef).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9-]+/g, '-');
      if (format !== 'pdf') return versBlob(cv, 'image/png').then(function (bl) { return new File([bl], base + '.png', { type: 'image/png' }); });
      return versBlob(cv, 'image/jpeg', 0.92).then(function (bl) { return bl.arrayBuffer(); }).then(function (a) { return new File([pdfDepuisJpeg([{ cv: cv, jpeg: new Uint8Array(a) }], 595.28, 595.28)], base + '.pdf', { type: 'application/pdf' }); });
    });
  }
  function messageBon(type, x) {
    var b = infosBon(type, x), c = ligne('centres', x.centre_id) || {};
    return ('Bonjour ' + (b.benef !== '—' ? b.benef : '') + ', ' + (type === 'paie' ? 'reçu de votre paie' : 'pièce de caisse') + ' ' + (c.nom || 'VÉRITAS') + ' : ' + fcfa(x.montant) +
      ' (' + (MODES[x.mode || 'especes'] || 'espèces').toLowerCase() + ') le ' + dateLisible(x.date, true) + ' — ' + b.objet + '. Réf. ' + b.ref + (b.etat ? ' [' + b.etat + ']' : '') + '. Merci !').replace(/ | /g, ' ');
  }
  function telBeneficiaire(type, x) {
    if (type !== 'paie') return '';
    var u = (E.cache.comptes || []).filter(function (k) { return k.id === x.enseignant_id; })[0];
    return u && u.tel ? String(u.tel).replace(/\D+/g, '').slice(-9) : '';
  }
  function feuilleBon(type, id) {
    var x = ligne(type === 'paie' ? 'paies' : 'depenses', id);
    if (!x) return;
    var b = infosBon(type, x), tel = telBeneficiaire(type, x);
    ouvrirFeuille('<h2>' + esc(b.titre) + '</h2><p class="doux">' + esc(b.benef) + ' · ' + fcfa(x.montant) + ' · ' + esc(dateLisible(x.date, true)) + ' · réf. ' + esc(b.ref) + '</p>' +
      (b.etat === 'À VALIDER' ? '<p class="note">Dépense pas encore validée : la pièce porte « À VALIDER ».</p>' : '') +
      '<div id="apercu-bon" class="apercu-recu"><p class="doux">Préparation de l\'aperçu…</p></div>' +
      '<div class="actions"><a class="btn or" target="_blank" rel="noopener" data-a="envoyer-bon" href="https://wa.me/' + (tel ? '237' + esc(tel) : '') + '?text=' + encodeURIComponent(messageBon(type, x)) + '">' + ico('message', 'p') + 'WhatsApp</a>' +
      '<button class="btn clair" type="button" data-a="partager-bon" data-t="' + type + '" data-v="png" data-id="' + esc(id) + '">' + ico('camera', 'p') + 'Image</button>' +
      '<button class="btn clair" type="button" data-a="partager-bon" data-t="' + type + '" data-v="pdf" data-id="' + esc(id) + '">' + ico('doc', 'p') + 'PDF</button></div>' +
      '<div class="actions"><button class="btn clair" type="button" data-a="fermer">Fermer</button></div>');
    Promise.all([chargerLogo(), document.fonts ? document.fonts.load('600 24px Poppins') : null, chargerLogoDetoure()]).then(function (r) {
      var z = $('#apercu-bon');
      if (!z) return;
      var img = new Image(); img.alt = 'Aperçu de la pièce de caisse'; img.src = dessinerBon(type, x, r[0], r[2]).toDataURL('image/png');
      z.innerHTML = ''; z.appendChild(img);
    });
  }
  function fichierRecu(p, format) {
    return Promise.all([chargerLogo(), document.fonts ? document.fonts.load('600 24px Poppins') : null, chargerLogoDetoure()]).then(function (r) {
      var cv = dessinerRecu(p, r[0], r[2]);
      var e = ligne('eleves', p.eleve_id) || {};
      var base = ('recu-' + (p.numero || 'provisoire') + '-' + (e.nom || '')).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9-]+/g, '-');
      if (format !== 'pdf') return versBlob(cv, 'image/png').then(function (b) { return new File([b], base + '.png', { type: 'image/png' }); });
      return versBlob(cv, 'image/jpeg', 0.92).then(function (b) { return b.arrayBuffer(); }).then(function (a) { return new File([pdfDepuisJpeg([{ cv: cv, jpeg: new Uint8Array(a) }], 595.28, 595.28)], base + '.pdf', { type: 'application/pdf' }); });
    });
  }
  function messageRecu(p) {
    var e = ligne('eleves', p.eleve_id) || {};
    var c = ligne('centres', p.centre_id) || {};
    var cv = couverture(p);
    var modele = c.msg_recu || 'Bonjour {parent}, nous accusons réception de {montant} pour {eleve} ({classe}), reçu n° {numero} du {date} : {couvre}. Reste à payer à ce jour : {reste}. Merci ! {centre}';
    var v = { parent: e.parent_nom || 'cher parent', montant: fcfa(p.montant), eleve: nomComplet(e), classe: nomDe('classes', e.classe_id), numero: p.numero || '', date: dateLisible(p.date, true),
      couvre: cv.lignes.map(function (l) { return l.libelle.toLowerCase() + (l.complet ? '' : ' (partiel)'); }).join(', '), reste: fcfa(cv.reste), centre: c.nom || 'VÉRITAS' };
    return modele.replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; });
  }
  function messageRelance(e, ech) {
    var c = ligne('centres', e.centre_id) || {};
    var modele = c.msg_relance || 'Bonjour {parent}, sauf erreur de notre part, il reste {montant} à régler pour {eleve} ({classe}) : {mois}. Les paiements se font au plus tard le {jour} du mois. Merci de votre compréhension. {centre} — {tel_centre}';
    var v = { parent: e.parent_nom || 'cher parent', montant: fcfa(ech.impaye), eleve: nomComplet(e), classe: nomDe('classes', e.classe_id),
      mois: ech.moisImpayes.map(function (it) { return it.libelle.toLowerCase() + (it.paye ? ' (reste ' + fcfa(it.montant - it.paye) + ')' : ''); }).join(', '),
      jour: c.jour_echeance || 10, centre: c.nom || 'VÉRITAS', tel_centre: telLisible(String(c.telephones || '').split('/')[0].replace(/\D+/g, '')) };
    return modele.replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; });
  }
  function feuilleRecu(pid) {
    var p = ligne('paiements', pid);
    if (!p) return;
    var e = ligne('eleves', p.eleve_id) || {};
    var tel = e.parent_whatsapp || e.parent_tel;
    var pret = !!p.numero;
    ouvrirFeuille('<h2>Reçu ' + (p.numero ? 'n° ' + esc(p.numero) : '') + (Number(p.annule) ? ' <span class="badge danger">annulé</span>' : '') + '</h2>' +
      '<p class="doux">' + esc(nomComplet(e)) + ' · ' + fcfa(p.montant) + ' · ' + esc(MODES[p.mode]) + ' · ' + esc(dateLisible(p.date, true)) + (p.envoye_le ? ' · envoyé le ' + esc(dateLisible(p.envoye_le)) : '') + '</p>' +
      (Number(p.annule) ? '<p class="note">Annulé : ' + esc(p.motif_annulation || '') + '</p>' : '') +
      (pret ? '' : '<p class="note">Le numéro du reçu est attribué par le serveur dès la synchronisation (il faut du réseau).</p>') +
      '<div id="apercu-recu" class="apercu-recu"><p class="doux">Préparation de l\'aperçu…</p></div>' +
      '<div class="actions">' + (tel && pret && !Number(p.annule) ? '<a class="btn or" target="_blank" rel="noopener" data-a="envoyer-recu" data-canal="whatsapp" data-id="' + esc(p.id) + '" href="https://wa.me/237' + esc(tel) + '?text=' + encodeURIComponent(messageRecu(p)) + '">' + ico('message', 'p') + 'Message au parent</a>' : '') +
      (pret ? '<button class="btn clair" type="button" data-a="partager-recu" data-v="png" data-id="' + esc(p.id) + '">' + ico('camera', 'p') + 'Image du reçu</button><button class="btn clair" type="button" data-a="partager-recu" data-v="pdf" data-id="' + esc(p.id) + '">' + ico('doc', 'p') + 'PDF</button>' : '') + '</div>' +
      // Admin : date d'un versement saisi en retard (ou rattaché par erreur au mauvais mois) ; rien d'autre ne change.
      (estAdmin() && pret && !Number(p.annule) ? '<form data-f="date-versement" data-id="' + esc(p.id) + '" class="date-versement"><label class="champ"><span>Date du versement</span>' +
        '<input type="date" name="date" required max="' + isoLocal(new Date()) + '" value="' + esc(p.date) + '"></label><button class="btn clair" type="submit">' + ico('calendar', 'p') + 'Changer la date</button></form>' : '') +
      '<div class="actions">' + (peut('caisse.corriger', p.centre_id) && !Number(p.annule) ? '<button class="btn danger" type="button" data-a="annuler-versement" data-id="' + esc(p.id) + '">Annuler ce versement</button>' : '') + '<button class="btn clair" type="button" data-a="fermer">Fermer</button></div>');
    Promise.all([chargerLogo(), document.fonts ? document.fonts.load('600 24px Poppins') : null, chargerLogoDetoure()]).then(function (r) {
      var z = $('#apercu-recu');
      if (!z) return;
      var img = new Image();
      img.alt = 'Aperçu du reçu';
      img.src = dessinerRecu(p, r[0], r[2]).toDataURL('image/png');
      z.innerHTML = ''; z.appendChild(img);
    });
  }

  // Justificatif (photo de la facture ou du reçu) : facultatif en dessous du seuil,
  // obligatoire à partir du seuil pour VALIDER la dépense (le serveur l'exige aussi).
  var SEUIL_JUSTIFICATIF = 10000;
  function justificatifExige(d) { return (Number(d && d.montant) || 0) >= SEUIL_JUSTIFICATIF; }
  function feuilleDepense(id) {
    var cid = id ? ligne('depenses', id).centre_id : CAI.centre;
    var d = id ? ligne('depenses', id) : { date: isoLocal(new Date()), categorie: 'fournitures', mode: 'especes', statut: 'en_attente' };
    var modifiable = d.statut === 'en_attente' && peut('depenses.saisir', cid);
    var moi = E.profil.utilisateur.id;
    var valideur = d.statut === 'en_attente' && id && (estAdmin() || (estTresorier(cid) && d.saisie_par !== moi));
    var dis = modifiable ? '' : ' disabled';
    ouvrirFeuille('<h2>' + (id ? 'Dépense' : 'Nouvelle dépense') + '</h2>' + (id ? '<p class="doux">Saisie par ' + esc(nomPersonne(d.saisie_par) || (d.saisie_par === moi ? 'vous' : '—')) + (d.valide_par ? ' · ' + (d.statut === 'validee' ? 'validée' : 'refusée') + ' par ' + esc(nomPersonne(d.valide_par) || (d.valide_par === moi ? 'vous' : '—')) + ' le ' + esc(dateLisible(d.valide_le)) : '') + '</p>' : '') +
      (d.statut === 'refusee' ? '<p class="note">Refusée : ' + esc(d.motif_refus || '') + '</p>' : '') +
      '<form data-f="depense" data-id="' + esc(id || '') + '" data-centre="' + esc(cid) + '">' +
      '<label class="champ"><span>Libellé</span><input type="text" name="libelle" required value="' + esc(d.libelle || '') + '"' + dis + ' placeholder="ex. : Loyer de novembre"></label>' +
      '<div class="deux"><label class="champ"><span>Montant (FCFA)</span><input type="number" name="montant" min="1" required value="' + esc(d.montant || '') + '"' + dis + '></label>' +
      '<label class="champ"><span>Date</span><input type="date" name="date" max="' + isoLocal(new Date()) + '" value="' + esc(d.date) + '"' + dis + '></label></div>' +
      '<div class="deux"><label class="champ"><span>Catégorie</span><select name="categorie"' + dis + '>' + Object.keys(CATEGORIES).filter(function (k) { return k !== 'salaires' || d.categorie === k || peut('enseignants.gerer', cid); }).map(function (k) { return '<option value="' + k + '"' + (d.categorie === k ? ' selected' : '') + '>' + CATEGORIES[k] + '</option>'; }).join('') + '</select></label>' +
      '<label class="champ"><span>Payé en</span><select name="mode"' + dis + '>' + Object.keys(MODES).map(function (k) { return '<option value="' + k + '"' + (d.mode === k ? ' selected' : '') + '>' + MODES[k] + '</option>'; }).join('') + '</select></label></div>' +
      '<label class="champ"><span>Bénéficiaire</span><input type="text" name="beneficiaire" value="' + esc(d.beneficiaire || '') + '"' + dis + '></label>' +
      (modifiable ? '<p class="doux">' + ico('info', 'p') + ' Pour payer un enseignant, utilisez plutôt « Payer » dans l\'appel (après le cours) ou la paie du mois (Enseignants) : le reçu de paie est fait tout seul et le cours n\'est pas payé deux fois.' +
        (peut('enseignants.gerer', cid) ? '' : ' La catégorie « Salaires » est réservée à qui gère les enseignants.') + '</p>' : '') +
      '<div id="zone-justificatif" class="justificatif"></div>' +
      (modifiable ? '<label class="champ"><span>' + (d.justificatif ? 'Remplacer la photo du justificatif' : 'Photo du justificatif (facture, reçu)') + '</span><small>Obligatoire à partir de ' + fcfa(SEUIL_JUSTIFICATIF) + ', facultative en dessous.</small><input type="file" name="photo" accept="image/*" capture="environment"></label>' : '') +
      (modifiable ? '<div class="actions"><button class="btn" type="submit">Enregistrer</button></div>' : '') + '</form>' +
      // Pas de bouton « Valider » : on dit pourquoi (deux personnes par dépense) et qu'elle ne compte pas encore.
      (id && d.statut === 'en_attente' && !valideur ? '<p class="note qui-valide">' + ico('info', 'p') + ' ' + (d.saisie_par === moi && estTresorier(cid)
        ? 'Vous avez saisi cette dépense : vous ne pouvez pas la valider vous-même. L\'administrateur la valide.'
        : 'En attente de validation par le trésorier du centre' + (tresorierDe(cid) && nomPersonne(tresorierDe(cid)) ? ' (' + esc(nomPersonne(tresorierDe(cid))) + ')' : '') + ' ou l\'administrateur.') + ' Elle n\'entre dans le bilan et le solde qu\'une fois validée.</p>' : '') +
      (valideur ? '<div class="actions"><button class="btn or" type="button" data-a="valider-depense" data-id="' + esc(id) + '">' + ico('check', 'p') + 'Valider</button><button class="btn danger" type="button" data-a="refuser-depense" data-id="' + esc(id) + '">Refuser</button></div>' : '') +
      (id ? '<div class="actions"><button class="btn clair" type="button" data-a="voir-bon" data-t="depense" data-id="' + esc(id) + '">' + ico('doc', 'p') + 'Bon de sortie (image, PDF, WhatsApp)</button></div>' : '') +
      (id && estAdmin() && d.statut === 'validee' ? '<div class="actions"><button class="btn danger" type="button" data-a="refuser-depense" data-v="annuler" data-id="' + esc(id) + '">Annuler cette dépense</button></div>' +
        '<p class="doux">Annuler (doublon, erreur) : elle reste visible, barrée, avec le motif, et ne compte plus dans le bilan.</p>' : '') +
      '<div class="actions">' + (id && modifiable ? '<button class="btn danger" type="button" data-a="suppr-depense" data-id="' + esc(id) + '">Retirer</button>' : '') + '<button class="btn clair" type="button" data-a="fermer">Fermer</button></div>');
    if (id && peutEquipe(cid)) { var zc = document.createElement('div'); zc.className = 'actions'; zc.innerHTML = boutonCommentaires(cid, 'depense:' + id, 'Dépense · ' + d.libelle); var pf = $('#feuille .panneau'); if (pf) pf.appendChild(zc); }
    if (id) afficherJustificatif(id, valideur);
  }
  function afficherJustificatif(id, valideur) {
    var z = $('#zone-justificatif');
    var d = ligne('depenses', id);
    if (!z || !d) return;
    var montrer = function (src, legende) {
      z.innerHTML = '<p class="doux">' + esc(legende) + '</p>';
      var img = new Image(); img.alt = 'Justificatif'; img.src = src; z.appendChild(img);
    };
    promesse(magasin('fichiers').get(id)).then(function (f) {
      if (f) {
        montrer('data:image/jpeg;base64,' + f.jpeg, 'Justificatif pris sur ce téléphone · envoi au retour du réseau');
        var err = (E.cache.erreurPhoto || {})[id];
        if (err) z.insertAdjacentHTML('beforeend', '<p class="note">' + ico('alert', 'p') + ' La photo n\'arrive pas au serveur : ' + esc(err) + '. Elle reste sur ce téléphone et repart à la prochaine synchronisation.</p>');
        return;
      }
      if (!d.justificatif) {
        z.innerHTML = justificatifExige(d)
          ? '<p class="note">' + ico('alert', 'p') + ' Justificatif obligatoire à partir de ' + fcfa(SEUIL_JUSTIFICATIF) + (valideur && estAdmin() ? ' : ajoutez la photo ci-dessous (« Enregistrer »), ou validez quand même : en tant qu\'administrateur, « Valider » vous demandera confirmation.'
            : valideur ? ' : demandez la photo, la dépense ne peut pas être validée sans elle.' : ' : ajoutez la photo de la facture ou du reçu.') + '</p>'
          : '<p class="doux">Sans justificatif (facultatif en dessous de ' + fcfa(SEUIL_JUSTIFICATIF) + ').</p>';
        return;
      }
      z.innerHTML = '<p class="doux">Chargement du justificatif…</p>';
      fetch(API + '?r=justificatif/lire&id=' + encodeURIComponent(id), { headers: { Authorization: 'Bearer ' + E.jeton } })
        .then(function (rep) { if (!rep.ok) throw new Error(); return rep.blob(); })
        .then(function (b) { montrer(URL.createObjectURL(b), 'Justificatif déposé le ' + dateLisible(d.justificatif)); })
        .catch(function () { z.innerHTML = '<p class="doux">Justificatif déposé (consultable en ligne).</p>'; });
    });
  }

  // ───────────────────────────── Point de caisse du jour ─────────────────────────────
  // Entrées (versements), sorties (dépenses non refusées, paies des enseignants), solde,
  // espèces à remettre, cumul du mois. À l'écran, puis en image (WhatsApp), PDF A4 ou texte
  // pour les actionnaires. Même centre et même jour que l'onglet Journal de la caisse.
  function pointDuJour(cid, iso) {
    var somme = function (l) { return l.reduce(function (s, x) { return s + (Number(x.montant) || 0); }, 0); };
    var voitDep = peut('depenses.voir', cid), voitPaies = peut('depenses.voir', cid);
    var pay = lignes('paiements').filter(function (p) { return p.centre_id === cid && p.date === iso; })
      .sort(function (a, b) { return String(a.numero || 'zz').localeCompare(String(b.numero || 'zz')); });
    var entrees = pay.filter(function (p) { return !Number(p.annule); });
    var annules = pay.filter(function (p) { return Number(p.annule); });
    var deps = voitDep ? lignes('depenses').filter(function (d) { return d.centre_id === cid && d.date === iso && d.statut !== 'refusee'; }) : [];
    var paies = voitPaies ? lignes('paies').filter(function (p) { return p.centre_id === cid && p.date === iso && !Number(p.annule); }) : [];
    var sorties = deps.map(function (d) {
      return { lib: d.libelle, detail: [CATEGORIES[d.categorie] || d.categorie, d.beneficiaire].filter(Boolean).join(' · '), mode: d.mode || 'especes', montant: Number(d.montant) || 0, attente: d.statut === 'en_attente' };
    }).concat(paies.map(function (p) {
      return { lib: 'Paie · ' + (nomPersonne(p.enseignant_id) || 'enseignant'), detail: 'Enseignant' + (p.mois ? ' · ' + MOIS[Number(p.mois.slice(5)) - 1] : ''), mode: p.mode || 'especes', montant: Number(p.montant) || 0 };
    }));
    var parMode = {}, sortiesParMode = {};
    entrees.forEach(function (p) { parMode[p.mode] = (parMode[p.mode] || 0) + Number(p.montant); });
    sorties.forEach(function (s) { sortiesParMode[s.mode] = (sortiesParMode[s.mode] || 0) + s.montant; });
    var debutMois = iso.slice(0, 8) + '01';
    var dansMois = function (d) { return d >= debutMois && d <= iso; };
    var moisE = somme(lignes('paiements').filter(function (p) { return p.centre_id === cid && !Number(p.annule) && dansMois(p.date) && enCompte(p); }));
    var moisS = (voitDep ? somme(lignes('depenses').filter(function (d) { return d.centre_id === cid && d.statut !== 'refusee' && dansMois(d.date) && enCompte(d); })) : 0) +
      (voitPaies ? somme(lignes('paies').filter(function (p) { return p.centre_id === cid && !Number(p.annule) && dansMois(p.date) && enCompte(p); })) : 0);
    var totE = somme(entrees), totS = somme(sorties);
    return {
      centre: ligne('centres', cid) || {}, date: iso, entrees: entrees, annules: annules, sorties: sorties, voitDep: voitDep,
      parMode: parMode, totE: totE, totS: totS, solde: totE - totS, attente: sorties.filter(function (s) { return s.attente; }).length,
      especes: (parMode.especes || 0) - (sortiesParMode.especes || 0), mois: { e: moisE, s: moisS }
    };
  }
  function libMois(iso) { return MOIS[Number(iso.slice(5, 7)) - 1]; }
  /** « Espèces à remettre : X » ou, si la caisse a plus payé en espèces qu'elle n'a reçu, le manque. */
  function libEspeces(j) { return j.especes >= 0 ? ['Espèces à remettre', fcfa(j.especes)] : ['Espèces sorties en plus des entrées', '− ' + fcfa(-j.especes)]; }

  function pageJour() {
    var cc = centreCaisse(), cid = cc.cid;
    var auj = isoLocal(new Date());
    CAI.date = CAI.date || auj;
    var h = '<p class="retour"><a href="#/caisse">‹ Caisse</a></p><h1>Point du jour</h1><p class="sous-titre">Entrées, sorties et solde de la journée, à envoyer aux actionnaires.</p>';
    if (cc.dispo.length > 1) h += '<div class="puces">' + cc.dispo.map(function (c) { return '<button type="button" class="puce' + (c.id === cid ? ' on' : '') + '" data-a="caisse-centre" data-v="' + esc(c.id) + '">' + esc(c.nom_court || c.nom) + '</button>'; }).join('') + '</div>';
    if (!cid) return h + '<div class="carte vide">Aucun centre.</div>';
    h += '<div class="nav-date"><button type="button" class="btn clair petit" data-a="caisse-date" data-v="-1" aria-label="Jour précédent">‹</button><b>' + esc(CAI.date === auj ? 'Aujourd\'hui' : dateLongue(CAI.date)) + '</b><button type="button" class="btn clair petit" data-a="caisse-date" data-v="1"' + (CAI.date >= auj ? ' disabled' : '') + ' aria-label="Jour suivant">›</button></div>';
    var j = pointDuJour(cid, CAI.date);
    h += '<div class="point-jour"><div class="pj-entrees"><small>Entrées</small><b>' + fcfa(j.totE) + '</b><span>' + j.entrees.length + ' versement' + (j.entrees.length > 1 ? 's' : '') + '</span></div>' +
      '<div class="pj-sorties"><small>Sorties</small><b>' + fcfa(j.totS) + '</b><span>' + j.sorties.length + ' dépense' + (j.sorties.length > 1 ? 's' : '') + '</span></div>' +
      '<div class="pj-solde' + (j.solde < 0 ? ' negatif' : '') + '"><small>Solde du jour</small><b>' + fcfa(j.solde) + '</b><span>' + libEspeces(j)[0] + ' : ' + libEspeces(j)[1] + '</span></div></div>';
    h += '<div class="actions export-jour"><button class="btn or" type="button" data-a="export-caisse-jour" data-v="png">' + ico('camera', 'p') + 'Image (WhatsApp)</button>' +
      '<button class="btn clair" type="button" data-a="export-caisse-jour" data-v="pdf">' + ico('doc', 'p') + 'PDF</button><button class="btn clair" type="button" data-a="export-caisse-jour" data-v="texte">' + ico('message', 'p') + 'Résumé texte</button></div>';
    h += '<h2>Entrées</h2>' + (j.entrees.length || j.annules.length ? '<div class="liste">' + j.entrees.concat(j.annules).map(ligneVersement).join('') + '</div>' : '<div class="carte vide">Aucun versement ce jour-là.</div>');
    if (Object.keys(j.parMode).length) h += '<div class="infos">' + Object.keys(MODES).filter(function (m) { return j.parMode[m]; }).map(function (m) { return '<div class="info"><span>' + MODES[m] + '</span><b>' + fcfa(j.parMode[m]) + '</b></div>'; }).join('') + '</div>';
    if (j.voitDep) {
      h += '<h2>Sorties</h2>' + (j.sorties.length ? '<div class="liste">' + j.sorties.map(function (s) {
        return '<div class="ligne"><span class="corps"><b>' + esc(s.lib) + (s.attente ? ' <span class="badge alerte">en attente</span>' : '') + '</b><small>' + esc(s.detail + ' · ' + (MODES[s.mode] || s.mode)) + '</small></span><span class="fin"><b>− ' + fcfa(s.montant) + '</b></span></div>';
      }).join('') + '</div>' : '<div class="carte vide">Aucune sortie ce jour-là.</div>');
    }
    h += '<div class="infos"><div class="info"><span>Depuis le 1er ' + esc(libMois(CAI.date)) + ' · entrées</span><b>' + fcfa(j.mois.e) + '</b></div><div class="info"><span>Sorties</span><b>− ' + fcfa(j.mois.s) + '</b></div><div class="info"><span>Solde du mois</span><b>' + fcfa(j.mois.e - j.mois.s) + '</b></div></div>';
    h += '<div class="actions">' + boutonCommentaires(cid, 'jour:' + CAI.date.replace(/-/g, ''), 'Point du jour · ' + dateLisible(CAI.date, true)) + '</div>';
    if (j.attente) h += '<p class="doux">Les dépenses « en attente » sont comptées dans les sorties (l\'argent est sorti) ; le bilan officiel ne compte que les dépenses validées.</p>';
    return h;
  }

  function texteJour(j) {
    var c = j.centre;
    var l = ['*Point de caisse — ' + (c.nom || 'VÉRITAS') + '*', dateLongue(j.date).replace(/^./, function (x) { return x.toUpperCase(); }) + ' ' + j.date.slice(0, 4), '',
      '*Entrées : ' + fcfa(j.totE) + '* (' + j.entrees.length + ' versement' + (j.entrees.length > 1 ? 's' : '') + ')'];
    Object.keys(MODES).forEach(function (m) { if (j.parMode[m]) l.push('• ' + MODES[m] + ' : ' + fcfa(j.parMode[m])); });
    if (j.annules.length) l.push('• Annulés (non comptés) : ' + j.annules.length);
    if (j.voitDep) {
      l.push('', '*Sorties : ' + fcfa(j.totS) + '*');
      j.sorties.forEach(function (s) { l.push('• ' + s.lib + ' : ' + fcfa(s.montant) + (s.attente ? ' (en attente de validation)' : '')); });
      if (!j.sorties.length) l.push('• Aucune');
    }
    l.push('', '*Solde du jour : ' + fcfa(j.solde) + '*', libEspeces(j)[0] + ' : ' + libEspeces(j)[1], '',
      'Depuis le 1er ' + libMois(j.date) + ' : entrées ' + fcfa(j.mois.e) + ' · sorties ' + fcfa(j.mois.s) + ' · solde ' + fcfa(j.mois.e - j.mois.s),
      '— ' + E.profil.utilisateur.nom + ', VÉRITAS Gestion');
    return l.join('\n').replace(/ /g, ' ');
  }

  /** Dessine la fiche sur une grande toile, puis la recadre à sa hauteur réelle. coupures : y sûrs pour paginer. */
  function dessinerFicheJour(j, logo, filigrane) {
    var L = 1240, M = 70, H0 = 8000;
    var cv = document.createElement('canvas'); cv.width = L; cv.height = H0;
    var g = cv.getContext('2d');
    var c = j.centre, coupures = [];
    g.fillStyle = '#fff'; g.fillRect(0, 0, L, H0);
    g.fillStyle = '#0C2A6A'; g.fillRect(0, 0, L, 170);
    if (logo) g.drawImage(logo, M, 30, 110, 110);
    g.fillStyle = '#fff'; g.font = '600 40px Poppins, sans-serif'; g.fillText(texteCoupe(g, c.nom || 'VÉRITAS', L - 2 * M - 140), M + 135, 90);
    g.font = '400 22px Poppins, sans-serif'; g.fillStyle = '#C9D6F2'; g.fillText(texteCoupe(g, c.adresse || '', L - 2 * M - 140), M + 135, 130);
    g.fillStyle = '#FFC93C'; g.fillRect(0, 170, L, 6);
    g.fillStyle = '#001136'; g.font = '600 42px Poppins, sans-serif'; g.fillText('Point de caisse du jour', M, 252);
    g.font = '400 26px Poppins, sans-serif'; g.fillStyle = '#4D5163';
    g.fillText(dateLongue(j.date).replace(/^./, function (x) { return x.toUpperCase(); }) + ' ' + j.date.slice(0, 4), M, 296);
    var now = new Date();
    g.textAlign = 'right'; g.font = '400 20px Poppins, sans-serif'; g.fillStyle = '#6B7185';
    g.fillText('Établi par ' + texteCoupe(g, E.profil.utilisateur.nom, 360), L - M, 252);
    g.fillText('le ' + now.toLocaleDateString('fr-FR') + ' à ' + ('0' + now.getHours()).slice(-2) + ' h ' + ('0' + now.getMinutes()).slice(-2), L - M, 284);
    g.textAlign = 'left';
    if (filigrane) { var lf = 560; g.save(); g.globalAlpha = 0.05; g.drawImage(filigrane, L / 2 - lf / 2, 520, lf, Math.round(lf * filigrane.naturalHeight / filigrane.naturalWidth)); g.restore(); }

    // Trois cases : entrées, sorties, solde.
    var y = 340, lc = (L - 2 * M - 40) / 3;
    [['ENTRÉES', j.totE, '#17803D', '#E7F5EC', j.entrees.length + ' versement' + (j.entrees.length > 1 ? 's' : '')],
     ['SORTIES', j.totS, '#B42318', '#FDECEA', j.sorties.length + ' dépense' + (j.sorties.length > 1 ? 's' : '')],
     ['SOLDE DU JOUR', j.solde, j.solde < 0 ? '#B42318' : '#1E499B', '#EEF3FC', 'Espèces : ' + (j.especes < 0 ? '− ' + fcfa(-j.especes) : fcfa(j.especes))]].forEach(function (b, i) {
      var x = M + i * (lc + 20);
      g.fillStyle = b[3]; g.fillRect(x, y, lc, 150);
      g.fillStyle = b[2]; g.fillRect(x, y, 6, 150);
      g.font = '600 19px Poppins, sans-serif'; g.fillText(b[0], x + 26, y + 40);
      g.font = '600 38px Poppins, sans-serif'; g.fillStyle = '#001136'; g.fillText(texteCoupe(g, fcfa(b[1]), lc - 40), x + 26, y + 92);
      g.font = '400 19px Poppins, sans-serif'; g.fillStyle = '#4D5163'; g.fillText(texteCoupe(g, b[4], lc - 40), x + 26, y + 128);
    });
    y += 210; coupures.push(y - 30);

    var titre = function (t, coul) {
      g.fillStyle = coul; g.fillRect(M, y - 26, 6, 32);
      g.font = '600 28px Poppins, sans-serif'; g.fillStyle = '#001136'; g.fillText(t, M + 20, y);
      y += 24; g.fillStyle = '#E1E6F0'; g.fillRect(M, y, L - 2 * M, 2); y += 44;
    };
    var rangee = function (gauche, sous, milieu, droite, opts) {
      opts = opts || {};
      g.font = '500 24px Poppins, sans-serif'; g.fillStyle = opts.gris ? '#9AA0B1' : '#001136';
      g.fillText(texteCoupe(g, gauche, 640), M, y);
      if (opts.gris) { var lw = Math.min(g.measureText(texteCoupe(g, gauche, 640)).width, 640); g.fillRect(M, y - 8, lw, 2); }
      g.font = '400 20px Poppins, sans-serif'; g.fillStyle = '#6B7185';
      if (sous) g.fillText(texteCoupe(g, sous, 640), M, y + 30);
      g.fillText(texteCoupe(g, milieu, 220), M + 680, y);
      g.textAlign = 'right'; g.font = '600 24px Poppins, sans-serif'; g.fillStyle = opts.gris ? '#9AA0B1' : opts.coul || '#001136';
      g.fillText(droite, L - M, y); g.textAlign = 'left';
      y += sous ? 52 : 34;
      g.fillStyle = '#EEF1F6'; g.fillRect(M, y - 14, L - 2 * M, 1);
      y += 22; coupures.push(y - 30);
    };
    var total = function (lib, val, coul) {
      g.font = '600 24px Poppins, sans-serif'; g.fillStyle = '#4D5163'; g.fillText(lib, M, y);
      g.textAlign = 'right'; g.fillStyle = coul; g.fillText(val, L - M, y); g.textAlign = 'left'; y += 56; coupures.push(y - 30);
    };

    titre('Entrées', '#17803D');
    if (!j.entrees.length && !j.annules.length) { g.font = '400 22px Poppins, sans-serif'; g.fillStyle = '#6B7185'; g.fillText('Aucun versement ce jour-là.', M, y); y += 56; }
    j.entrees.concat(j.annules).forEach(function (p) {
      var e = ligne('eleves', p.eleve_id) || {};
      var annule = Number(p.annule);
      rangee(nomComplet(e) || 'Élève', (p.numero ? 'Reçu n° ' + p.numero : 'Reçu en attente de numéro') + ' · ' + nomDe('classes', e.classe_id) + (annule ? ' · ANNULÉ' : ''), MODES[p.mode] || p.mode, fcfa(p.montant), { gris: annule });
    });
    Object.keys(MODES).forEach(function (m) { if (j.parMode[m]) total('  dont ' + MODES[m], fcfa(j.parMode[m]), '#4D5163'); });
    total('Total des entrées', fcfa(j.totE), '#17803D');
    y += 20;

    if (j.voitDep) {
      titre('Sorties', '#B42318');
      if (!j.sorties.length) { g.font = '400 22px Poppins, sans-serif'; g.fillStyle = '#6B7185'; g.fillText('Aucune sortie ce jour-là.', M, y); y += 56; }
      j.sorties.forEach(function (s) { rangee(s.lib, s.detail + (s.attente ? ' · en attente de validation' : ''), MODES[s.mode] || s.mode, '− ' + fcfa(s.montant), { coul: '#B42318' }); });
      total('Total des sorties', '− ' + fcfa(j.totS), '#B42318');
      y += 20;
    }

    // Bandeau de synthèse.
    g.fillStyle = '#0C2A6A'; g.fillRect(M, y, L - 2 * M, 170);
    g.fillStyle = '#FFC93C'; g.fillRect(M, y, 8, 170);
    g.font = '400 22px Poppins, sans-serif'; g.fillStyle = '#C9D6F2'; g.fillText('Solde du jour (entrées − sorties)', M + 36, y + 52);
    g.fillText(libEspeces(j)[0], M + 36, y + 120);
    g.textAlign = 'right'; g.font = '600 40px Poppins, sans-serif'; g.fillStyle = '#fff';
    g.fillText(fcfa(j.solde), L - M - 30, y + 60);
    g.font = '600 30px Poppins, sans-serif'; g.fillText(libEspeces(j)[1], L - M - 30, y + 124); g.textAlign = 'left';
    y += 230; coupures.push(y - 40);

    g.font = '400 22px Poppins, sans-serif'; g.fillStyle = '#4D5163';
    g.fillText('Depuis le 1er ' + libMois(j.date) + ' : entrées ' + fcfa(j.mois.e) + ' · sorties ' + fcfa(j.mois.s) + ' · solde ' + fcfa(j.mois.e - j.mois.s), M, y);
    y += 40;
    if (j.attente) { g.font = '400 19px Poppins, sans-serif'; g.fillStyle = '#9A5B00'; g.fillText('Les dépenses en attente sont comptées (argent sorti) ; le bilan officiel ne compte que les dépenses validées.', M, y); y += 34; }
    y += 70; coupures.push(y - 50);
    g.font = '400 22px Poppins, sans-serif'; g.fillStyle = '#6B7185';
    g.fillText('La caisse', M, y); g.textAlign = 'right'; g.fillText('Le responsable', L - M, y); g.textAlign = 'left';
    y += 120;
    g.font = '400 18px Poppins, sans-serif'; g.fillText('VÉRITAS Gestion · document interne destiné aux actionnaires', M, y);
    y += 40;
    var fin = document.createElement('canvas'); fin.width = L; fin.height = y;
    fin.getContext('2d').drawImage(cv, 0, 0);
    return { cv: fin, coupures: coupures };
  }
  function nomFichierJour(j, ext) {
    return ('point-caisse-' + (j.centre.nom_court || j.centre.nom || 'centre') + '-' + j.date).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9-]+/g, '-').replace(/-+/g, '-') + '.' + ext;
  }
  function fichierJour(j, format) {
    return Promise.all([chargerLogo(), chargerLogoDetoure(), document.fonts ? document.fonts.load('600 24px Poppins') : null]).then(function (r) {
      var d = dessinerFicheJour(j, r[0], r[1]);
      if (format === 'png') return versBlob(d.cv, 'image/png').then(function (b) { return new File([b], nomFichierJour(j, 'png'), { type: 'image/png' }); });
      // PDF A4 : pages de 1240 × 1754, coupées entre deux lignes.
      var HP = 1754, pages = [], haut = 0;
      while (haut < d.cv.height) {
        var bas = haut + HP;
        if (bas < d.cv.height) { var sures = d.coupures.filter(function (y) { return y > haut + 400 && y <= bas; }); if (sures.length) bas = sures[sures.length - 1]; }
        var pg = document.createElement('canvas'); pg.width = 1240; pg.height = HP;
        var gp = pg.getContext('2d'); gp.fillStyle = '#fff'; gp.fillRect(0, 0, 1240, HP);
        gp.drawImage(d.cv, 0, haut, 1240, Math.min(bas, d.cv.height) - haut, 0, 0, 1240, Math.min(bas, d.cv.height) - haut);
        pages.push(pg); haut = bas;
      }
      return Promise.all(pages.map(function (cv) { return versBlob(cv, 'image/jpeg', 0.9).then(function (b) { return b.arrayBuffer(); }).then(function (a) { return { cv: cv, jpeg: new Uint8Array(a) }; }); }))
        .then(function (p) { return new File([pdfDepuisJpeg(p, 595.28, 841.89)], nomFichierJour(j, 'pdf'), { type: 'application/pdf' }); });
    });
  }

  var BIL = { mois: '' };
  function pageBilan() {
    var auj = isoLocal(new Date());
    if (!BIL.mois) BIL.mois = auj.slice(0, 7);
    var centres = centresChoisis().filter(function (c) { return peut('finances.voir', c.id); });
    var an = anneeActive();
    var annee = BIL.mois === 'annee';
    var lib = annee ? 'Année ' + (an ? an.libelle : '') : MOIS[Number(BIL.mois.slice(5, 7)) - 1].replace(/^./, function (c) { return c.toUpperCase(); }) + ' ' + BIL.mois.slice(0, 4);
    var dans = function (date) { return annee ? (!an || (date >= an.debut && date <= an.fin)) : String(date).slice(0, 7) === BIL.mois; };
    var h = '<h1>Bilan financier</h1><div class="nav-date"><button type="button" class="btn clair petit" data-a="bilan-mois" data-v="-1"' + (annee ? ' disabled' : '') + ' aria-label="Mois précédent">‹</button><b>' + esc(lib) + '</b>' +
      '<button type="button" class="btn clair petit" data-a="bilan-mois" data-v="1"' + (annee || BIL.mois >= auj.slice(0, 7) ? ' disabled' : '') + ' aria-label="Mois suivant">›</button></div>' +
      '<div class="onglets"><button type="button" class="' + (annee ? '' : 'on') + '" data-a="bilan-mois" data-v="mois">Mois</button><button type="button" class="' + (annee ? 'on' : '') + '" data-a="bilan-mois" data-v="annee">Année scolaire</button></div>';
    h += '<a class="ligne carte-lien" href="#/rapports" data-a="aller-rapport" data-v="tresorier"><span class="pastille">' + ico('doc') + '</span><span class="corps"><b>Rapports</b><small>Insolvables, paiements par classe, rapport du trésorier — PDF, Excel</small></span><span class="fin">›</span></a>';
    h += '<a class="ligne carte-lien" href="#/jour"><span class="pastille">' + ico('clipboard') + '</span><span class="corps"><b>Point du jour</b><small>Entrées et sorties d\'une journée, en image ou PDF</small></span><span class="fin">›</span></a>';
    var tot = { rec: 0, dep: 0 };
    centres.forEach(function (c) {
      var deb = debutComptes(c.id);
      if (!annee && avantComptes(c.id, BIL.mois)) {
        h += '<h2>' + esc(c.nom) + '</h2><div class="carte note-carte hors-comptes">' + ico('lock', 'p') + ' <b>' + esc(lib) + ' ne compte plus.</b> Les comptes de ce centre repartent de zéro le ' + esc(dateLisible(deb, true)) + '. ' +
          'Ce qui a été encaissé, dépensé ou remis avant n\'entre ni dans la caisse des partenaires, ni dans les remises au trésorier, ni dans le partage. ' +
          'Il sert seulement à calculer ce que chaque élève doit encore : les reliquats et les insolvables restent dus.</div>' +
          '<a class="ligne carte-lien" href="#/rapports" data-a="aller-rapport" data-v="insolvables"><span class="pastille">' + ico('alert') + '</span><span class="corps"><b>Insolvables et reliquats</b><small>Ce qui reste dû, avec les montants</small></span></a>';
        return;
      }
      var pay = lignes('paiements').filter(function (p) { return p.centre_id === c.id && !Number(p.annule) && dans(p.date) && enCompte(p); });
      var deps = lignes('depenses').filter(function (d) { return d.centre_id === c.id && dans(d.date) && enCompte(d); });
      var depV = deps.filter(function (d) { return d.statut === 'validee'; });
      var rec = pay.reduce(function (s, p) { return s + Number(p.montant); }, 0);
      var paiesP = lignes('paies').filter(function (p) { return p.centre_id === c.id && !Number(p.annule) && dans(p.date) && enCompte(p); });
      var totPaies = paiesP.reduce(function (s, p) { return s + Number(p.montant); }, 0);
      var dep = depV.reduce(function (s, d) { return s + Number(d.montant); }, 0) + totPaies;
      tot.rec += rec; tot.dep += dep;
      var res = rec - dep;
      // Attendu de la période : échéances des élèves tombant dans la période.
      var attendu = 0;
      lignes('eleves').filter(function (e) { return e.centre_id === c.id; }).forEach(function (e) {
        echeancier(e).items.forEach(function (it) { var d = it.mois ? it.mois + '-01' : it.echeance; if (dans(d) && (!deb || d >= deb.slice(0, 8) + '01')) attendu += it.montant; });
      });
      var parMode = {}; pay.forEach(function (p) { parMode[p.mode] = (parMode[p.mode] || 0) + Number(p.montant); });
      var parCat = {}; depV.forEach(function (d) { parCat[d.categorie] = (parCat[d.categorie] || 0) + Number(d.montant); });
      var acts = lignes('actionnaires').filter(function (a) { return a.centre_id === c.id; });
      h += '<h2>' + esc(c.nom) + '</h2><div class="stats"><div><b>' + fcfa(rec) + '</b><small>recettes</small></div><div><b>' + fcfa(dep) + '</b><small>dépenses validées</small></div>' +
        '<div><b class="' + (res < 0 ? 'st-absent' : 'st-present') + '">' + fcfa(res) + '</b><small>résultat</small></div><div><b>' + (attendu ? Math.round(100 * rec / attendu) + ' %' : '—') + '</b><small>recouvrement (' + fcfa(attendu) + ' attendus)</small></div></div>';
      h += '<div class="infos">' + Object.keys(parMode).map(function (m) { return '<div class="info"><span>' + MODES[m] + '</span><b>' + fcfa(parMode[m]) + '</b></div>'; }).join('') +
        Object.keys(parCat).map(function (k) { return '<div class="info"><span>Dépenses · ' + CATEGORIES[k] + '</span><b>− ' + fcfa(parCat[k]) + '</b></div>'; }).join('') +
        (totPaies ? '<div class="info"><span>Paies des enseignants</span><b>− ' + fcfa(totPaies) + '</b></div>' : '') +
        (deps.some(function (d) { return d.statut === 'en_attente'; }) ? '<div class="info"><span>Dépenses en attente (non comptées)</span><b>' + fcfa(deps.filter(function (d) { return d.statut === 'en_attente'; }).reduce(function (s, d) { return s + Number(d.montant); }, 0)) + '</b></div>' : '') + '</div>';
      // Détail des sorties : d'où vient chaque montant ; toucher une dépense l'ouvre (valider, refuser, annuler).
      if (peut('depenses.voir', c.id)) {
        var depsD = deps.filter(function (d) { return d.statut !== 'refusee'; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
        var paiesD = paiesP.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
        if (depsD.length || paiesD.length) {
          h += '<h3>Détail des sorties</h3><div class="liste">' + paiesD.map(lignePaie).join('') + depsD.map(ligneDepense).join('') + '</div>' +
            '<p class="doux">Touchez une dépense pour voir qui l\'a saisie et le justificatif, puis la valider, la refuser' + (estAdmin() ? ' ou l\'annuler' : '') + '.</p>';
        }
      }
      if (deb && (annee || BIL.mois === deb.slice(0, 7))) h += '<p class="doux">' + ico('info', 'p') + ' Comptes repartis de zéro le ' + esc(dateLisible(deb, true)) + ' : rien d\'avant n\'est compté ici.</p>';
      h += infosFondsBilan(c.id, annee ? moisCycle() : BIL.mois);
      if (!annee) h += blocCloture(c, BIL.mois);
      if (!annee) h += blocRepartirZero(c, BIL.mois);
      if (!annee) h += blocRedater(c, BIL.mois);
      if (!annee) h += '<div class="actions">' + boutonCommentaires(c.id, 'bilan:' + BIL.mois.replace('-', ''), 'Bilan · ' + lib + ' · ' + (c.nom_court || c.nom)) + '</div>';
      if (acts.length) {
        h += '<h3>Part des actionnaires</h3><div class="liste">' + acts.map(function (a) {
          return '<div class="ligne"><span class="corps"><b>' + esc(a.nom) + '</b><small>' + pourcent(a.part_centiemes) + '</small></span><span class="fin"><b>' + fcfa(Math.round(res * Number(a.part_centiemes) / 10000)) + '</b></span></div>';
        }).join('') + '</div>';
      }
    });
    if (centres.length > 1) h += '<h2>Ensemble des centres</h2><div class="stats"><div><b>' + fcfa(tot.rec) + '</b><small>recettes</small></div><div><b>' + fcfa(tot.dep) + '</b><small>dépenses</small></div><div><b>' + fcfa(tot.rec - tot.dep) + '</b><small>résultat</small></div></div>';
    if (!centres.length) h += '<div class="carte vide">Aucun centre.</div>';
    return h;
  }

  // ───────────────────────────── Assiduité ─────────────────────────────
  var ASD = { centre: '', periode: '30' };
  function bilan(pres) {
    var b = { present: 0, retard: 0, absent: 0, justifie: 0, minutes: 0, total: 0 };
    pres.forEach(function (p) { b[p.statut] = (b[p.statut] || 0) + 1; b.minutes += Number(p.retard_min) || 0; b.total++; });
    b.taux = b.total ? Math.round(100 * (b.present + b.retard) / b.total) : null;
    b.ponctualite = (b.present + b.retard) ? Math.round(100 * b.present / (b.present + b.retard)) : null;
    return b;
  }
  /** 3 absences (non justifiées) ou 3 retards aux 3 DERNIERS pointages de l'élève. */
  function alertesAssiduite(cid) {
    var parEleve = {};
    lignes('presences').forEach(function (p) { if (p.centre_id === cid) (parEleve[p.eleve_id] = parEleve[p.eleve_id] || []).push(p); });
    var out = [];
    elevesActifs(cid).forEach(function (el) {
      var l = (parEleve[el.id] || []).sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 3);
      if (l.length < 3) return;
      if (l.every(function (p) { return p.statut === 'absent'; })) out.push({ eleve: el, type: 'absences', depuis: l[2].date });
      else if (l.every(function (p) { return p.statut === 'retard'; })) out.push({ eleve: el, type: 'retards', depuis: l[2].date, minutes: l.reduce(function (s, p) { return s + (Number(p.retard_min) || 0); }, 0) });
    });
    return out;
  }
  function messageAlerte(a) {
    var c = ligne('centres', a.eleve.centre_id) || {};
    return 'Bonjour' + (a.eleve.parent_nom ? ' ' + a.eleve.parent_nom : '') + ', le centre ' + (c.nom || 'VÉRITAS') + ' vous informe que ' + nomComplet(a.eleve) +
      (a.type === 'absences' ? ' a été absent(e) aux 3 dernières séances (depuis le ' + dateLisible(a.depuis, true) + ').' : ' est arrivé(e) en retard aux 3 dernières séances (' + a.minutes + ' min au total).') +
      ' Merci de nous contacter au ' + telLisible(String(c.telephones || '').split('/')[0].replace(/\D+/g, '')) + '.';
  }
  function pageAssiduite() {
    var dispo = centresChoisis();
    if (!dispo.some(function (c) { return c.id === ASD.centre; })) ASD.centre = dispo.length ? dispo[0].id : '';
    var cid = ASD.centre;
    var h = '<h1>Assiduité et ponctualité</h1>';
    if (dispo.length > 1) h += '<div class="puces">' + dispo.map(function (c) { return '<button type="button" class="puce' + (c.id === cid ? ' on' : '') + '" data-a="asd-centre" data-v="' + esc(c.id) + '">' + esc(c.nom_court || c.nom) + '</button>'; }).join('') + '</div>';
    if (!cid) return h + '<div class="carte vide">Aucun centre.</div>';
    h += '<div class="onglets">' + [['7', '7 jours'], ['30', '30 jours'], ['an', 'Année']].map(function (o) { return '<button type="button" class="' + (ASD.periode === o[0] ? 'on' : '') + '" data-a="asd-periode" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';
    var debut = ASD.periode === 'an' ? ((lignes('annees').filter(function (a) { return Number(a.active); })[0] || {}).debut || '2000-01-01') : decalerJour(isoLocal(new Date()), -Number(ASD.periode));
    var pres = lignes('presences').filter(function (p) { return p.centre_id === cid && p.date >= debut; });
    var b = bilan(pres);
    h += '<div class="stats"><div><b>' + (b.taux == null ? '—' : b.taux + ' %') + '</b><small>assiduité</small></div><div><b>' + (b.ponctualite == null ? '—' : b.ponctualite + ' %') + '</b><small>ponctualité</small></div>' +
      '<div><b>' + b.retard + '</b><small>retards · ' + dureeLisible(b.minutes) + '</small></div><div><b>' + b.absent + '</b><small>absences non justifiées</small></div></div>';
    var al = alertesAssiduite(cid);
    if (al.length) {
      h += '<h2>' + ico('alert', 'p') + ' Alertes</h2><div class="liste">' + al.map(function (a) {
        var tel = a.eleve.parent_whatsapp || a.eleve.parent_tel;
        return '<div class="ligne"><span class="corps"><b>' + esc(nomComplet(a.eleve)) + '</b><small>' + (a.type === 'absences' ? '3 absences de suite' : '3 retards de suite (' + a.minutes + ' min)') + ' · ' + esc(nomDe('classes', a.eleve.classe_id)) + '</small></span>' +
          (tel ? '<a class="btn clair petit" target="_blank" rel="noopener" href="https://wa.me/237' + esc(tel) + '?text=' + encodeURIComponent(messageAlerte(a)) + '">' + ico('message', 'p') + 'Parent</a>' : '<span class="doux">pas de numéro</span>') + '</div>';
      }).join('') + '</div>';
    }
    var classes = lignes('classes').filter(function (k) { return k.centre_id === cid; });
    h += '<h2>Par classe</h2><div class="liste">' + classes.map(function (k) {
      var ids = {}; lignes('eleves').forEach(function (el) { if (el.classe_id === k.id) ids[el.id] = 1; });
      var bk = bilan(pres.filter(function (p) { return ids[p.eleve_id]; }));
      return '<div class="ligne"><span class="corps"><b>' + esc(k.nom) + '</b><small>' + bk.total + ' pointages · ' + bk.retard + ' retards · ' + bk.absent + ' absences</small></span><span class="fin"><b>' + (bk.taux == null ? '—' : bk.taux + ' %') + '</b></span></div>';
    }).join('') + '</div>';
    var parEleve = elevesActifs(cid).map(function (el) { return { el: el, b: bilan(pres.filter(function (p) { return p.eleve_id === el.id; })) }; }).filter(function (x) { return x.b.total; });
    if (parEleve.length) {
      var ligneEl = function (x) {
        return '<button class="ligne" type="button" data-a="voir-eleve" data-id="' + esc(x.el.id) + '"><span class="corps"><b>' + esc(nomComplet(x.el)) + '</b><small>' + esc(nomDe('classes', x.el.classe_id)) + ' · ' + x.b.retard + ' retard' + (x.b.retard > 1 ? 's' : '') + (x.b.minutes ? ' (' + dureeLisible(x.b.minutes) + ')' : '') + ' · ' + (x.b.absent + x.b.justifie) + ' absence' + (x.b.absent + x.b.justifie > 1 ? 's' : '') + '</small></span><span class="fin"><b>' + x.b.taux + ' %</b></span></button>';
      };
      var aSuivre = parEleve.slice().sort(function (a, b) { return a.b.taux - b.b.taux || b.b.minutes - a.b.minutes; }).filter(function (x) { return x.b.taux < 100 || x.b.retard; }).slice(0, 10);
      var modeles = parEleve.slice().sort(function (a, b) { return b.b.taux - a.b.taux || a.b.minutes - b.b.minutes; }).filter(function (x) { return x.b.taux === 100 && !x.b.retard; }).slice(0, 10);
      if (aSuivre.length) h += '<h2>À suivre</h2><div class="liste">' + aSuivre.map(ligneEl).join('') + '</div>';
      if (modeles.length) h += '<h2>Assidus et ponctuels</h2><div class="liste">' + modeles.map(ligneEl).join('') + '</div>';
    } else {
      h += '<div class="carte vide">Aucun pointage sur la période.</div>';
    }
    return h;
  }

  // ───────────────────────────── Élèves ─────────────────────────────
  var ELV = { centre: '', classe: '', q: '', tous: false };
  var LIENS = ['Père', 'Mère', 'Tuteur', 'Tutrice', 'Frère / sœur', 'Autre'];
  var NIVEAUX_ORDRE = ['Primaire', '6e', '5e', '4e', '3e', '2nde', '1ère', 'Tle', 'Autre'];

  /** Même règle que g_cle_nom() côté serveur : accents, casse et ordre des mots ignorés. */
  function cleNom(s) {
    return String(s || '').replace(/œ/gi, 'oe').replace(/æ/gi, 'ae').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).sort().join(' ');
  }
  /** Même règle que g_tel() : 9 chiffres ; '' si vide ; null si invalide. */
  function telNormal(t) {
    var d = String(t || '').replace(/\D+/g, '');
    if (!d) return '';
    if (d.length === 12 && d.indexOf('237') === 0) d = d.slice(3);
    if (d.length === 14 && d.indexOf('00237') === 0) d = d.slice(5);
    return /^[26]\d{8}$/.test(d) ? d : null;
  }
  function telLisible(t) { return t ? String(t).replace(/^(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5') : ''; }
  function nomComplet(e) { return (String(e.nom || '').toUpperCase() + ' ' + (e.prenoms || '')).trim(); }
  function elevesActifs(cid) { return lignes('eleves').filter(function (e) { return e.centre_id === cid && (e.statut || 'actif') === 'actif'; }); }
  function homonyme(e) {
    var cle = cleNom(e.nom + ' ' + e.prenoms);
    return lignes('eleves').filter(function (x) { return x.id !== e.id && x.centre_id === e.centre_id && x.statut !== 'parti' && cleNom(x.nom + ' ' + x.prenoms) === cle; })[0] || null;
  }
  function centreEleves() {
    var dispo = centresChoisis();
    if (!dispo.some(function (c) { return c.id === ELV.centre; })) { ELV.centre = dispo.length ? dispo[0].id : ''; ELV.classe = ''; }
    return ELV.centre;
  }

  function pageEleves() {
    var cid = centreEleves();
    var gere = cid && peut('eleves.gerer', cid);
    var h = '<h1>Élèves</h1>';
    if (!cid) return h + '<div class="carte vide">Aucun centre.</div>';
    var centres = centresChoisis();
    if (centres.length > 1) {
      h += '<div class="puces">' + centres.map(function (c) {
        return '<button type="button" class="puce' + (c.id === cid ? ' on' : '') + '" data-a="eleves-centre" data-v="' + esc(c.id) + '">' + esc(c.nom_court || c.nom) + ' · ' + elevesActifs(c.id).length + '</button>';
      }).join('') + '</div>';
    }
    var classes = lignes('classes').filter(function (k) { return k.centre_id === cid; });
    var actifs = elevesActifs(cid);
    h += '<p class="sous-titre">' + actifs.length + ' élève' + (actifs.length > 1 ? 's' : '') + ' inscrit' + (actifs.length > 1 ? 's' : '') + ' · ' + esc((ligne('centres', cid) || {}).nom || '') + '</p>';
    h += '<label class="recherche"><span class="sr">Rechercher</span>' + ico('search') + '<input type="search" data-input="recherche-eleve" placeholder="Nom, prénom, matricule, téléphone" value="' + esc(ELV.q) + '" autocomplete="off"></label>';
    h += '<div class="puces defile"><button type="button" class="puce' + (!ELV.classe ? ' on' : '') + '" data-a="eleves-classe" data-v="">Toutes</button>' +
      classes.map(function (k) {
        return '<button type="button" class="puce' + (ELV.classe === k.id ? ' on' : '') + '" data-a="eleves-classe" data-v="' + esc(k.id) + '">' + esc(k.nom) + ' · ' + actifs.filter(function (e) { return e.classe_id === k.id; }).length + '</button>';
      }).join('') + '</div>';
    h += '<div id="zone-eleves"></div>';
    h += '<label class="case"><input type="checkbox" data-change="eleves-tous"' + (ELV.tous ? ' checked' : '') + '> Afficher aussi les élèves partis ou suspendus</label>';
    if (gere) {
      h += '<div class="actions"><button class="btn clair" type="button" data-a="importer-eleves">' + ico('upload', 'p') + 'Importer une liste</button></div>';
      h += '<button class="fab" type="button" data-a="editer-eleve" data-id="">' + ico('plus') + 'Inscrire</button>';
    }
    if (!classes.length) h += '<p class="note info">Créez d\'abord les classes du centre dans « Planning ».</p>';
    return h;
  }

  function dessinerListeEleves() {
    var z = $('#zone-eleves');
    if (!z) return;
    var cid = centreEleves();
    var q = cleNom(ELV.q);
    var qTel = String(ELV.q).replace(/\D+/g, '');
    var liste = lignes('eleves').filter(function (e) {
      if (e.centre_id !== cid) return false;
      if (!ELV.tous && (e.statut || 'actif') !== 'actif') return false;
      if (ELV.classe && e.classe_id !== ELV.classe) return false;
      if (!q && !qTel) return true;
      var cle = cleNom(e.nom + ' ' + e.prenoms + ' ' + (e.matricule || ''));
      return (q && q.split(' ').every(function (m) { return cle.indexOf(m) >= 0; })) ||
        (qTel.length >= 3 && [e.parent_tel, e.parent_whatsapp, e.parent2_tel, e.tel_eleve].some(function (t) { return t && String(t).indexOf(qTel) >= 0; }));
    }).sort(function (a, b) { return nomComplet(a).localeCompare(nomComplet(b), 'fr'); });
    if (!liste.length) { z.innerHTML = '<div class="carte vide">' + (ELV.q ? 'Aucun élève ne correspond.' : 'Aucun élève inscrit.') + '</div>'; return; }
    z.innerHTML = '<div class="liste">' + liste.map(function (e) {
      var statut = (e.statut || 'actif') !== 'actif' ? ' <span class="badge danger">' + esc(e.statut) + '</span>' : '';
      return '<button class="ligne" type="button" data-a="voir-eleve" data-id="' + esc(e.id) + '"><span class="avatar' + (e.sexe === 'F' ? ' f' : '') + '">' + esc(initiales(nomComplet(e))) + '</span>' +
        '<span class="corps"><b>' + marqueDevantNom(e) + esc(nomComplet(e)) + statut + '</b><small>' + esc([nomDe('classes', e.classe_id), e.matricule || 'matricule à la synchro', telLisible(e.parent_tel)].filter(Boolean).join(' · ')) + '</small></span>' +
        badgeSolde(e) + (e._attente ? '<span class="badge alerte">en attente</span>' : '') + '</button>';
    }).join('') + '</div><p class="doux">' + liste.length + ' affiché' + (liste.length > 1 ? 's' : '') + '</p>';
  }

  function feuilleVoirEleve(id) {
    var e = ligne('eleves', id);
    if (!e) return;
    var gere = peut('eleves.gerer', e.centre_id);
    var mat = String(e.matieres || '').split(',').filter(Boolean).map(function (m) { return nomDe('matieres', m); }).filter(Boolean);
    var ligneInfo = function (k, v) { return v ? '<div class="info"><span>' + k + '</span><b>' + esc(v) + '</b></div>' : ''; };
    var contact = function (nom, lien, tel, wa) {
      if (!tel && !wa) return '';
      var w = wa || tel;
      return '<div class="carte contact"><b>' + esc(nom || 'Parent') + '</b>' + (lien ? ' <span class="doux">(' + esc(lien) + ')</span>' : '') + '<p class="doux">' + esc(telLisible(tel)) + '</p><div class="actions">' +
        (tel ? '<a class="btn clair petit" href="tel:+237' + esc(tel) + '">' + ico('phone', 'p') + 'Appeler</a>' : '') +
        (w ? '<a class="btn clair petit" href="https://wa.me/237' + esc(w) + '" target="_blank" rel="noopener">' + ico('message', 'p') + 'WhatsApp</a>' : '') + '</div></div>';
    };
    ouvrirFeuille('<h2>' + esc(nomComplet(e)) + '</h2><p class="doux">' + esc([e.matricule || 'matricule attribué à la synchronisation', nomDe('classes', e.classe_id), (ligne('centres', e.centre_id) || {}).nom_court].filter(Boolean).join(' · ')) + '</p>' +
      ((e.statut || 'actif') !== 'actif' ? '<p class="note">Statut : ' + esc(e.statut) + '</p>' : '') +
      contact(e.parent_nom, e.parent_lien, e.parent_tel, e.parent_whatsapp) + contact(e.parent2_nom, '', e.parent2_tel, '') +
      '<div class="infos">' + ligneInfo('Sexe', e.sexe === 'F' ? 'Fille' : e.sexe === 'M' ? 'Garçon' : '') + ligneInfo('Né(e) le', e.date_naissance ? dateLisible(e.date_naissance, true) : '') +
      ligneInfo('Établissement', e.etablissement) + ligneInfo('Matières suivies', mat.join(', ')) + ligneInfo('Téléphone de l\'élève', telLisible(e.tel_eleve)) +
      ligneInfo('Quartier', e.quartier) + ligneInfo('Inscrit le', e.date_inscription ? dateLisible(e.date_inscription, true) : '') + ligneInfo('Observations', e.observations) + '</div>' +
      (function () {
        var pr = lignes('presences').filter(function (p) { return p.eleve_id === e.id; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
        if (!pr.length) return '';
        var b = bilan(pr);
        return '<h3>Assiduité</h3><div class="stats petites"><div><b>' + b.taux + ' %</b><small>présent</small></div><div><b>' + b.retard + '</b><small>retards · ' + dureeLisible(b.minutes) + '</small></div><div><b>' + (b.absent + b.justifie) + '</b><small>absences' + (b.justifie ? ' (' + b.justifie + ' just.)' : '') + '</small></div></div>' +
          '<div class="infos">' + pr.slice(0, 8).map(function (p) { return '<div class="info"><span>' + esc(dateLisible(p.date, true)) + '</span><b class="st-' + p.statut + '">' + LIB_STATUT[p.statut] + (p.arrivee ? ' · ' + p.arrivee : '') + (Number(p.retard_min) ? ' (+' + p.retard_min + ')' : '') + (p.depart ? ' → ' + p.depart : '') + '</b></div>'; }).join('') + '</div>';
      })() +
      (function () {
        if (!peut('paiements.voir', e.centre_id)) return '';
        var ech = echeancier(e);
        return '<h3>Scolarité ' + (anneeActive() ? esc(anneeActive().libelle) : '') + '</h3><div class="stats petites"><div><b>' + fcfa(ech.paye) + '</b><small>versé</small></div><div><b>' + fcfa(ech.resteAcejour) + '</b><small>reste à ce jour</small></div><div><b class="' + (ech.impaye ? 'st-absent' : 'st-present') + '">' + fcfa(ech.impaye) + '</b><small>en retard</small></div></div>' +
          (e.mensualite_due || e.inscription_due ? '<p class="doux">Tarif particulier : ' + (e.inscription_due ? 'inscription ' + fcfa(e.inscription_due) + ' ' : '') + (e.mensualite_due ? 'mensualité ' + fcfa(e.mensualite_due) : '') + (e.remise_motif ? ' (' + esc(e.remise_motif) + ')' : '') + '</p>' : '') +
          '<div class="echeancier">' + ech.items.map(function (it) {
            var etat = it.paye >= it.montant ? 'ok' : it.echeance < isoLocal(new Date()) ? 'danger' : it.paye ? 'alerte' : '';
            return '<span class="badge ' + etat + '" title="' + esc(it.libelle + ' : ' + fcfa(it.paye) + ' / ' + fcfa(it.montant)) + '">' + esc(it.court) + (it.paye && it.paye < it.montant ? ' ' + Math.round(100 * it.paye / it.montant) + ' %' : '') + '</span>';
          }).join('') + '</div>' +
          (ech.versements.length ? '<div class="liste">' + lignes('paiements').filter(function (p) { return p.eleve_id === e.id; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; }).map(ligneVersement).join('') + '</div>' : '<p class="doux">Aucun versement.</p>');
      })() +
      '<div class="actions">' + (peut('paiements.encaisser', e.centre_id) && e.statut !== 'parti' ? '<button class="btn or" type="button" data-a="encaisser" data-id="' + esc(e.id) + '">' + ico('wallet', 'p') + 'Encaisser</button>' : '') + (gere ? '<button class="btn" type="button" data-a="editer-eleve" data-id="' + esc(e.id) + '">' + ico('edit', 'p') + 'Modifier</button>' +
        ((e.statut || 'actif') === 'actif' ? '<button class="btn danger" type="button" data-a="statut-eleve" data-id="' + esc(e.id) + '" data-v="parti">A quitté le centre</button>'
          : '<button class="btn clair" type="button" data-a="statut-eleve" data-id="' + esc(e.id) + '" data-v="actif">Réinscrire</button>') : '') +
      '<button class="btn clair" type="button" data-a="fermer">Fermer</button></div>');
  }

  function feuilleEleve(id) {
    var cid = id ? ligne('eleves', id).centre_id : centreEleves();
    var e = id ? ligne('eleves', id) : { classe_id: ELV.classe, date_inscription: new Date().toISOString().slice(0, 10), parent_lien: 'Mère', matieres: '' };
    var classes = lignes('classes').filter(function (k) { return k.centre_id === cid; });
    if (!classes.length) { toast('Créez d\'abord les classes du centre dans « Planning ».', true); return; }
    var mats = String(e.matieres || '').split(',');
    var v = function (k) { return esc(e[k] == null ? '' : e[k]); };
    var opt = function (val, txt, sel) { return '<option value="' + esc(val) + '"' + (val === sel ? ' selected' : '') + '>' + esc(txt) + '</option>'; };
    ouvrirFeuille('<h2>' + (id ? 'Modifier la fiche' : 'Inscrire un élève') + '</h2><p class="doux">' + esc((ligne('centres', cid) || {}).nom || '') + '</p>' +
      '<form data-f="eleve" data-id="' + esc(id || '') + '" data-centre="' + esc(cid) + '">' +
      '<h3>Élève</h3><div class="deux"><label class="champ"><span>Nom</span><input type="text" name="nom" required autocapitalize="characters" value="' + v('nom') + '"></label>' +
      '<label class="champ"><span>Prénoms</span><input type="text" name="prenoms" autocapitalize="words" value="' + v('prenoms') + '"></label></div>' +
      '<div class="deux"><label class="champ"><span>Classe</span><select name="classe_id" required>' + classes.map(function (k) { return opt(k.id, k.nom, e.classe_id); }).join('') + '</select></label>' +
      '<label class="champ"><span>Sexe</span><select name="sexe">' + opt('', '—', e.sexe || '') + opt('F', 'Fille', e.sexe) + opt('M', 'Garçon', e.sexe) + '</select></label></div>' +
      '<div class="deux"><label class="champ"><span>Date de naissance</span><input type="date" name="date_naissance" value="' + v('date_naissance') + '"></label>' +
      '<label class="champ"><span>Inscrit le</span><input type="date" name="date_inscription" value="' + v('date_inscription') + '"></label></div>' +
      '<label class="champ"><span>Établissement fréquenté</span><input type="text" name="etablissement" value="' + v('etablissement') + '" placeholder="ex. : Lycée de Nylon Ndogpassi"></label>' +
      '<div class="deux"><label class="champ"><span>Téléphone de l\'élève</span><input type="tel" name="tel_eleve" value="' + esc(telLisible(e.tel_eleve)) + '"></label>' +
      '<label class="champ"><span>Quartier</span><input type="text" name="quartier" value="' + v('quartier') + '"></label></div>' +
      '<h3>Parent ou tuteur</h3><div class="deux"><label class="champ"><span>Nom</span><input type="text" name="parent_nom" value="' + v('parent_nom') + '"></label>' +
      '<label class="champ"><span>Lien</span><select name="parent_lien">' + LIENS.map(function (l) { return opt(l, l, e.parent_lien); }).join('') + '</select></label></div>' +
      '<div class="deux"><label class="champ"><span>Téléphone</span><input type="tel" name="parent_tel" inputmode="tel" value="' + esc(telLisible(e.parent_tel)) + '" placeholder="6XX XX XX XX"></label>' +
      '<label class="champ"><span>WhatsApp, s\'il diffère</span><input type="tel" name="parent_whatsapp" inputmode="tel" value="' + esc(telLisible(e.parent_whatsapp)) + '"></label></div>' +
      '<div class="deux"><label class="champ"><span>Second contact</span><input type="text" name="parent2_nom" value="' + v('parent2_nom') + '"></label>' +
      '<label class="champ"><span>Son téléphone</span><input type="tel" name="parent2_tel" inputmode="tel" value="' + esc(telLisible(e.parent2_tel)) + '"></label></div>' +
      (function () {
        var centre = ligne('centres', cid) || {};
        var opt = Number(centre.inscription_option) || 0;
        var h2 = '';
        if (opt) {
          h2 += '<label class="champ"><span>Inscription</span><select name="inscription_due"><option value="0">Tarif de la classe</option><option value="' + opt + '"' + (Number(e.inscription_due) === opt ? ' selected' : '') + '>' + fcfa(opt) + ' ' + esc(centre.inscription_option_libelle || '') + '</option>' +
            (Number(e.inscription_due) && Number(e.inscription_due) !== opt ? '<option value="' + Number(e.inscription_due) + '" selected>' + fcfa(e.inscription_due) + ' (particulier)</option>' : '') + '</select></label>';
        }
        if (peut('remises.accorder', cid)) {
          h2 += '<div class="deux"><label class="champ"><span>Mensualité particulière</span><input type="number" name="mensualite_due" min="0" value="' + (Number(e.mensualite_due) || '') + '" placeholder="tarif de la classe"></label>' +
            '<label class="champ"><span>Motif de la remise</span><input type="text" name="remise_motif" value="' + v('remise_motif') + '" placeholder="ex. : fratrie, bourse"></label></div>';
        }
        return h2 ? '<h3>Tarif</h3>' + h2 : '';
      })() +
      '<h3>Matières suivies</h3><div class="deux">' + lignes('matieres').map(function (m) { return '<label class="case"><input type="checkbox" name="matiere" value="' + esc(m.id) + '"' + (mats.indexOf(m.id) >= 0 ? ' checked' : '') + '> ' + esc(m.nom) + '</label>'; }).join('') + '</div>' +
      '<label class="champ"><span>Observations</span><textarea name="observations" rows="2">' + v('observations') + '</textarea></label>' +
      '<div class="actions"><button class="btn or" type="submit">' + (id ? 'Enregistrer' : 'Inscrire') + '</button><button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
  }

  /** « NOM Prénoms ; 697 63 77 39 » ou « NOM Prénoms » — les mots en capitales de tête forment le nom. */
  /** Montant écrit dans un cahier : « 2500 », « 7 500 », « 10.000 », « 10 000 F ». Vide ou « - » : rien. */
  function lireMontant(t) {
    t = String(t || '').replace(/f(cfa)?\.?$/i, '').replace(/[\s.\u00a0]/g, '').trim();
    return /^\d{3,6}$/.test(t) ? Number(t) : null;
  }
  /** Ligne d'import « NOM Prénoms ; inscription ; octobre ; novembre … » (montants facultatifs, « - » pour vide). */
  function lireLigneImport(l) {
    var morceaux = String(l).split(/\s*[;|\t]\s*/);
    if (morceaux.length > 1) {
      var e = lireLigneImportNom(morceaux[0]);
      if (!e) return null;
      e.montants = [];
      morceaux.slice(1).forEach(function (x) {
        var tel = telNormal(String(x).replace(/\D/g, '').replace(/^237/, ''));
        if (/^\s*\+?(237)?[\s.]*[26](?:[\s.]*\d){8}\s*$/.test(x) && tel) { e.parent_tel = tel; return; }
        e.montants.push(lireMontant(x));
      });
      while (e.montants.length && e.montants[e.montants.length - 1] == null) e.montants.pop();
      return e;
    }
    return lireLigneImportNom(l);
  }
  function lireLigneImportNom(l) {
    var tel = '';
    var m = l.match(/(?:\+?237)?[\s.]*([26](?:[\s.]*\d){8})\s*$/);
    if (m) { tel = telNormal(m[1]) || ''; l = l.slice(0, m.index); }
    l = l.replace(/^\s*\d+[.)\-\s]+/, '').replace(/[;,\t|]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (!l) return null;
    var mots = l.split(' ');
    var n = 0;
    while (n < mots.length - 1 && mots[n] === mots[n].toUpperCase() && /[A-ZÀ-Ý]/.test(mots[n])) n++;
    if (n === 0) n = 1;
    return { nom: mots.slice(0, n).join(' ').toUpperCase(), prenoms: mots.slice(n).join(' '), parent_tel: tel };
  }

  /** Mois facturés de l'année active, dans l'ordre (« 2026-10 », « 2026-11 », …). */
  function moisDeLAnnee() {
    var an = anneeActive(); if (!an) return [];
    var y0 = Number(String(an.libelle).slice(0, 4)) || Number(String(an.debut).slice(0, 4)), m0 = Number(String(an.debut).slice(5, 7)) || 9;
    return String(an.mois_factures || '').split(',').filter(Boolean).map(function (mm) { var m = Number(mm); return (m >= m0 ? y0 : y0 + 1) + '-' + ('0' + m).slice(-2); }).sort();
  }
  function feuilleImport(cidChoisi, texte) {
    // Le centre est choisi ICI, visiblement : une liste ne part jamais dans un autre centre par mégarde.
    var possibles = lignes('centres').filter(function (c) { return peut('eleves.gerer', c.id); });
    var cid = cidChoisi || centreEleves();
    if (!possibles.some(function (c) { return c.id === cid; })) cid = (possibles[0] || {}).id;
    var classes = lignes('classes').filter(function (k) { return k.centre_id === cid; });
    var choixCentre = '<label class="champ"><span>Centre</span><select name="centre_import" data-change="import-centre">' + possibles.map(function (c) {
      return '<option value="' + esc(c.id) + '"' + (c.id === cid ? ' selected' : '') + '>' + esc(c.nom) + '</option>'; }).join('') + '</select></label>';
    if (!classes.length) {
      ouvrirFeuille('<h2>Importer une liste</h2>' + choixCentre + '<div class="carte note-carte">' + ico('alert', 'p') + ' Ce centre n\'a encore aucune classe : créez-les d\'abord (Planning › Classes), avec leurs tarifs.</div>' +
        '<div class="actions"><a class="btn or" href="#/emploi" data-a="fermer-et-aller">Créer les classes</a><button class="btn clair" type="button" data-a="fermer">Fermer</button></div>');
      return;
    }
    ouvrirFeuille('<h2>Importer une liste</h2>' + choixCentre + '<p class="doux">Copiez la liste d\'un cahier ou d\'un tableau : un élève par ligne, le nom en capitales puis les prénoms, et si vous l\'avez le téléphone du parent à la fin.</p>' +
      '<form data-f="import" data-centre="' + esc(cid) + '"><label class="champ"><span>Classe</span><select name="classe_id">' + classes.map(function (k) { return '<option value="' + esc(k.id) + '"' + (k.id === ELV.classe ? ' selected' : '') + '>' + esc(k.nom) + '</option>'; }).join('') + '</select></label>' +
      '<label class="champ"><span>Liste</span><textarea name="liste" rows="8" data-input="apercu-import" placeholder="NGONO ESSOMBA Marie\nTAMO Paul ; 690 00 00 00\nBELLA Grâce ; 2500 ; 7500\nAMBASSA ; - ; 7500"></textarea>' +
      '<small>Avec les montants du cahier : <b>NOM Prénoms ; inscription ; ' + esc(moisDeLAnnee().slice(0, 2).map(function (am) { return MOIS[Number(am.slice(5)) - 1]; }).join(' ; ')) + ' …</b> — « - » pour une case vide. Chaque montant devient un versement avec son reçu.</small></label>' +
      (function () {
        var an = anneeActive(), deb = an && an.debut ? an.debut : isoLocal(new Date());
        return '<div class="deux"><label class="champ"><span>Inscrits depuis le</span><input type="date" name="date_inscription" value="' + esc(deb) + '"><small>La rentrée : les mois depuis la rentrée sont dus.</small></label>' +
          '<label class="champ"><span>Date des versements repris</span><select name="date_versements"><option value="auj">Aujourd\'hui</option>' +
          (peut('caisse.corriger', cid) ? '<option value="mois" selected>Le mois concerné (inscription : date d\'inscription)</option>' : '') + '</select>' +
          (peut('caisse.corriger', cid) ? '' : '<small>Dater dans le passé est réservé au responsable.</small>') + '</label></div>';
      })() +
      '<div id="apercu-import" class="doux">Rien à importer pour l\'instant.</div>' +
      '<div class="actions"><button class="btn or" type="submit">Inscrire ces élèves</button><button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
  }
  function analyseImport(form) {
    var cid = form.dataset.centre;
    var vus = {};
    return String(form.querySelector('[name=liste]').value || '').split(/\r?\n/).map(lireLigneImport).filter(Boolean).map(function (e) {
      e.centre_id = cid;
      var cle = cleNom(e.nom + ' ' + e.prenoms);
      var deja = homonyme(e);
      e.motif = deja ? 'déjà inscrit (' + (deja.matricule || nomDe('classes', deja.classe_id)) + ')' : vus[cle] ? 'en double dans la liste' : '';
      vus[cle] = 1;
      return e;
    });
  }
  function apercuImport(form) {
    var l = analyseImport(form);
    var z = $('#apercu-import');
    if (!z) return;
    if (!l.length) { z.innerHTML = 'Rien à importer pour l\'instant.'; return; }
    var ok = l.filter(function (e) { return !e.motif; });
    var totVers = ok.reduce(function (s, e) { return s + (e.montants || []).reduce(function (a, v) { return a + (v || 0); }, 0); }, 0);
    var nbVers = ok.reduce(function (s, e) { return s + (e.montants || []).filter(Boolean).length; }, 0);
    z.innerHTML = '<p><b>' + ok.length + '</b> élève' + (ok.length > 1 ? 's' : '') + ' à inscrire' + (nbVers ? ' · <b>' + nbVers + '</b> versement' + (nbVers > 1 ? 's' : '') + ' (' + fcfa(totVers) + ')' : '') + (l.length > ok.length ? ', <b>' + (l.length - ok.length) + '</b> écarté' + (l.length - ok.length > 1 ? 's' : '') : '') + '</p><div class="liste">' +
      l.slice(0, 60).map(function (e) {
        var mois = moisDeLAnnee(), m = (e.montants || []).map(function (v, i) { return v ? (i === 0 ? 'Insc.' : MOIS_COURTS[Number((mois[i - 1] || '0000-01').slice(5)) - 1]) + ' ' + fcfa(v) : ''; }).filter(Boolean);
        return '<div class="ligne"><span class="corps"><b>' + esc(nomComplet(e)) + '</b><small>' + esc((e.parent_tel ? telLisible(e.parent_tel) : 'sans téléphone') + (m.length ? ' · ' + m.join(' · ') : '')) + '</small></span>' +
          (e.motif ? '<span class="badge alerte">' + esc(e.motif) + '</span>' : '<span class="badge ok">nouveau</span>') + '</div>';
      }).join('') + '</div>';
  }

  // ───────────────────────────── Emploi du temps ─────────────────────────────
  var JOURS = ['', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  var JOURS_COURTS = ['', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  var EMP = { centre: '', mode: '', jour: 0, filtre: '' };   // mode : jour | classe | enseignant

  function nomDe(t, id) { var l = ligne(t, id); return l ? l.nom || l.libelle || '' : ''; }
  function nomPersonne(id) { var e = E.equipe.filter(function (x) { return x.id === id; })[0]; return e ? e.nom : ''; }
  function enseignantsDu(centreId) {
    var vus = {};
    return E.equipe.filter(function (e) { if (e.centre_id !== centreId || e.role !== 'enseignant' || vus[e.id]) return false; vus[e.id] = 1; return true; });
  }
  function centreEmploi() {
    var dispo = centresChoisis();
    if (!dispo.some(function (c) { return c.id === EMP.centre; })) EMP.centre = dispo.length ? dispo[0].id : '';
    return EMP.centre;
  }
  /** Chevauchement côté téléphone : prévient tout de suite, même hors ligne. Le serveur tranche. */
  function conflitLocal(c) {
    var autres = lignes('creneaux').filter(function (x) {
      return x.id !== c.id && Number(x.jour) === Number(c.jour) && x.debut < c.fin && x.fin > c.debut &&
        (x.classe_id === c.classe_id || (c.enseignant_id && x.enseignant_id === c.enseignant_id));
    });
    if (!autres.length) return '';
    var x = autres[0];
    return x.classe_id === c.classe_id
      ? 'La classe ' + nomDe('classes', c.classe_id) + ' a déjà cours de ' + x.debut + ' à ' + x.fin + '.'
      : nomPersonne(c.enseignant_id) + ' est déjà pris de ' + x.debut + ' à ' + x.fin + ' (' + nomDe('classes', x.classe_id) + ', ' + (ligne('centres', x.centre_id) || {}).nom_court + ').';
  }
  function carteCreneau(c, peutModifier, contexte) {
    var details = [contexte !== 'classe' ? nomDe('classes', c.classe_id) : '', contexte !== 'enseignant' ? (nomPersonne(c.enseignant_id) || 'enseignant à désigner') : '', c.salle].filter(Boolean).join(' · ');
    return '<button class="ligne creneau" type="button" data-a="editer-creneau" data-id="' + esc(c.id) + '"' + (peutModifier ? '' : ' disabled') + '>' +
      '<span class="horaire"><b>' + esc(c.debut) + '</b><small>' + esc(c.fin) + '</small></span>' +
      '<span class="corps"><b>' + esc(nomDe('matieres', c.matiere_id) || 'Matière') + '</b><small>' + esc(details) + '</small></span>' +
      (c._attente ? '<span class="badge alerte">en attente</span>' : '') + '</button>';
  }

  function pageEmploi() {
    var cid = centreEmploi();
    var u = E.profil.utilisateur;
    var role = estAdmin() ? 'admin' : roleDans(cid);
    var gere = cid && peut('emploi.gerer', cid);
    if (!EMP.mode) EMP.mode = role === 'enseignant' ? 'enseignant' : 'jour';
    if (EMP.mode === 'enseignant' && !EMP.filtre && role === 'enseignant') EMP.filtre = u.id;
    if (!EMP.jour) { var d = new Date().getDay(); EMP.jour = d === 0 ? 1 : d; }

    var h = '<h1>Emploi du temps</h1><p class="sous-titre">' + (gere ? 'Vous pouvez modifier l\'emploi du temps de ce centre.' : 'Consultation.') + '</p>';
    var centres = centresChoisis();
    if (centres.length > 1) {
      h += '<div class="puces">' + centres.map(function (c) {
        return '<button type="button" class="puce' + (c.id === cid ? ' on' : '') + '" data-a="emploi-centre" data-v="' + esc(c.id) + '">' + esc(c.nom_court || c.nom) + '</button>';
      }).join('') + '</div>';
    }
    if (!cid) return h + '<div class="carte vide">Aucun centre.</div>';

    var classes = lignes('classes').filter(function (k) { return k.centre_id === cid; });
    var crs = lignes('creneaux').filter(function (c) { return c.centre_id === cid; })
      .sort(function (a, b) { return a.jour - b.jour || (a.debut < b.debut ? -1 : 1); });

    var plages = lignes('horaires').filter(function (x) { return x.centre_id === cid; }).sort(function (a, b) { return a.jour - b.jour || (a.debut < b.debut ? -1 : 1); });
    var groupes = {};
    plages.forEach(function (x) { var k = x.niveaux || ''; (groupes[k] = groupes[k] || []).push(x); });
    h += '<div class="carte horaires"><h3>' + ico('clock', 'p') + ' Jours et horaires des cours</h3>' + (plages.length ? Object.keys(groupes).sort().map(function (k) {
      return (Object.keys(groupes).length > 1 || k ? '<p class="titre-niveau">' + (k ? 'En ' + esc(k.split(',').join(', ')) : 'Autres niveaux') + '</p>' : '') +
        groupes[k].map(function (x) {
          return '<button type="button" class="plage" data-a="editer-horaire" data-id="' + esc(x.id) + '"' + (gere ? '' : ' disabled') + '><span>' + JOURS[x.jour] + '</span><b>' + heureLisible(x.debut) + ' – ' + heureLisible(x.fin) + '</b>' +
            (x._attente ? '<span class="badge alerte">en attente</span>' : '') + '</button>';
        }).join('');
    }).join('') : '<p class="doux">Aucun horaire saisi.</p>') +
      (gere ? '<div class="actions"><button class="btn clair petit" type="button" data-a="editer-horaire" data-id="">' + ico('plus', 'p') + 'Ajouter une plage</button></div>' : '') + '</div>';

    h += '<div class="onglets" role="tablist">' + [['jour', 'Par jour'], ['classe', 'Par classe'], ['enseignant', role === 'enseignant' ? 'Mes cours' : 'Par enseignant']].map(function (m) {
      return '<button type="button" role="tab" class="' + (EMP.mode === m[0] ? 'on' : '') + '" aria-selected="' + (EMP.mode === m[0]) + '" data-a="emploi-mode" data-v="' + m[0] + '">' + m[1] + '</button>';
    }).join('') + '</div>';

    if (EMP.mode === 'jour') {
      h += '<div class="jours">' + [1, 2, 3, 4, 5, 6, 7].map(function (j) {
        var n = crs.filter(function (c) { return Number(c.jour) === j; }).length;
        return '<button type="button" class="' + (EMP.jour === j ? 'on' : '') + '" data-a="emploi-jour" data-v="' + j + '"><b>' + JOURS_COURTS[j] + '</b><small>' + (n || '·') + '</small></button>';
      }).join('') + '</div>';
      var duJour = crs.filter(function (c) { return Number(c.jour) === EMP.jour; });
      h += '<h2>' + JOURS[EMP.jour] + '</h2>' + (duJour.length ? '<div class="liste">' + duJour.map(function (c) { return carteCreneau(c, gere, 'jour'); }).join('') + '</div>'
        : '<div class="carte vide">Aucun cours le ' + JOURS[EMP.jour].toLowerCase() + '.</div>');
    } else {
      var choix = EMP.mode === 'classe' ? classes.map(function (k) { return [k.id, k.nom]; })
        : (role === 'enseignant' ? [[u.id, u.nom]] : enseignantsDu(cid).map(function (e) { return [e.id, e.nom]; }));
      if (!choix.some(function (x) { return x[0] === EMP.filtre; })) EMP.filtre = choix.length ? choix[0][0] : '';
      if (choix.length > 1) {
        h += '<label class="champ"><span>' + (EMP.mode === 'classe' ? 'Classe' : 'Enseignant') + '</span><select data-change="emploi-filtre">' +
          choix.map(function (x) { return '<option value="' + esc(x[0]) + '"' + (x[0] === EMP.filtre ? ' selected' : '') + '>' + esc(x[1]) + '</option>'; }).join('') + '</select></label>';
      }
      var cle = EMP.mode === 'classe' ? 'classe_id' : 'enseignant_id';
      // Un enseignant voit aussi ses cours dans l'autre centre : son vrai emploi du temps.
      var source = EMP.mode === 'enseignant' ? lignes('creneaux') : crs;
      var siens = source.filter(function (c) { return c[cle] === EMP.filtre; }).sort(function (a, b) { return a.jour - b.jour || (a.debut < b.debut ? -1 : 1); });
      if (!choix.length) h += '<div class="carte vide">' + (EMP.mode === 'classe' ? 'Aucune classe : créez-en une ci-dessous.' : 'Aucun enseignant dans ce centre.') + '</div>' + (EMP.mode === 'classe' ? '' : '<div class="actions">' + boutonAjoutEnseignant(cid) + '</div>');
      else if (!siens.length) h += '<div class="carte vide">Aucun cours.</div>';
      var total = 0;
      [1, 2, 3, 4, 5, 6, 7].forEach(function (j) {
        var l = siens.filter(function (c) { return Number(c.jour) === j; });
        if (!l.length) return;
        l.forEach(function (c) { total += minutes(c.fin) - minutes(c.debut); });
        h += '<p class="jour">' + JOURS[j] + '</p><div class="liste">' + l.map(function (c) {
          var ailleurs = c.centre_id !== cid ? ' (' + ((ligne('centres', c.centre_id) || {}).nom_court || '') + ')' : '';
          return carteCreneau(Object.assign({}, c, { salle: [c.salle, ailleurs.trim()].filter(Boolean).join(' ') }), gere && c.centre_id === cid, EMP.mode);
        }).join('') + '</div>';
      });
      if (total) h += '<p class="doux">Total : ' + dureeLisible(total) + ' par semaine.</p>';
    }
    if (gere) h += '<button class="fab" type="button" data-a="editer-creneau" data-id="">' + ico('plus') + 'Créneau</button>';

    h += '<h2>Classes du centre</h2><div class="liste">' + (classes.length ? classes.map(function (k) {
      var n = crs.filter(function (c) { return c.classe_id === k.id; }).length;
      return '<button class="ligne" type="button" data-a="editer-classe" data-id="' + esc(k.id) + '"' + (gere ? '' : ' disabled') + '><span class="corps"><b>' + esc(k.nom) + '</b><small>' + esc([k.niveau, elevesActifs(cid).filter(function (e) { return e.classe_id === k.id; }).length + ' élèves', n + ' cours par semaine', Number(k.mensualite) ? fcfa(k.mensualite) + '/mois' : ''].filter(Boolean).join(' · ')) + '</small></span>' +
        (k._attente ? '<span class="badge alerte">en attente</span>' : '') + '</button>';
    }).join('') : '<div class="vide">Aucune classe.</div>') + '</div>';
    if (gere) h += '<div class="actions"><button class="btn clair" type="button" data-a="editer-classe" data-id="">' + ico('plus', 'p') + 'Ajouter une classe</button></div>';
    return h;
  }
  /** Plages qui s'appliquent à un niveau : les siennes s'il en a, sinon celles « tous niveaux ». */
  function horairesPour(cid, niveau) {
    var toutes = lignes('horaires').filter(function (h) { return h.centre_id === cid; });
    var propres = toutes.filter(function (h) { return niveau && String(h.niveaux || '').split(',').indexOf(niveau) >= 0; });
    return (propres.length ? propres : toutes.filter(function (h) { return !h.niveaux; }))
      .sort(function (a, b) { return a.jour - b.jour || (a.debut < b.debut ? -1 : 1); });
  }
  function heureLisible(hhmm) { return String(hhmm || '').replace(':', ' h '); }
  function horairesDuJour(cid, jour) {
    return lignes('horaires').filter(function (h) { return h.centre_id === cid && Number(h.jour) === jour; })
      .sort(function (a, b) { return a.debut < b.debut ? -1 : 1; });
  }
  function feuilleHoraire(id) {
    var cid = centreEmploi();
    var h = id ? ligne('horaires', id) : { jour: EMP.jour || 1, debut: '16:00', fin: '18:00', niveaux: '' };
    var niv = String(h.niveaux || '').split(',');
    ouvrirFeuille('<h2>' + (id ? 'Modifier la plage' : 'Nouvelle plage de cours') + '</h2><p class="doux">' + esc((ligne('centres', id ? h.centre_id : cid) || {}).nom || '') + '</p>' +
      '<form data-f="horaire" data-id="' + esc(id || '') + '" data-centre="' + esc(id ? h.centre_id : cid) + '">' +
      '<label class="champ"><span>Jour</span><select name="jour">' + [1, 2, 3, 4, 5, 6, 7].map(function (j) { return '<option value="' + j + '"' + (Number(h.jour) === j ? ' selected' : '') + '>' + JOURS[j] + '</option>'; }).join('') + '</select></label>' +
      '<div class="deux"><label class="champ"><span>De</span><input type="time" name="debut" required value="' + esc(h.debut) + '"></label>' +
      '<label class="champ"><span>À</span><input type="time" name="fin" required value="' + esc(h.fin) + '"></label></div>' +
      '<p><b>Pour quels niveaux ?</b> <span class="doux">Rien de coché : tous les niveaux qui n\'ont pas de plage propre.</span></p><div class="deux">' +
      NIVEAUX_ORDRE.map(function (n) { return '<label class="case"><input type="checkbox" name="niveau" value="' + esc(n) + '"' + (niv.indexOf(n) >= 0 ? ' checked' : '') + '> ' + esc(n) + '</label>'; }).join('') + '</div>' +
      '<div class="actions"><button class="btn" type="submit">Enregistrer</button>' + (id ? '<button class="btn danger" type="button" data-a="suppr-horaire" data-id="' + esc(id) + '">Supprimer</button>' : '') +
      '<button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
  }
  function minutes(hhmm) { var m = String(hhmm).split(':'); return (+m[0]) * 60 + (+m[1] || 0); }
  function dureeLisible(min) { var h = Math.floor(min / 60), m = min % 60; return h + ' h' + (m ? ' ' + ('0' + m).slice(-2) : ''); }

  function feuilleCreneau(id) {
    var cid = centreEmploi();
    var c = id ? ligne('creneaux', id) : { jour: EMP.mode === 'jour' ? EMP.jour : 1, debut: '16:00', fin: '18:00', classe_id: EMP.mode === 'classe' ? EMP.filtre : '', enseignant_id: EMP.mode === 'enseignant' ? EMP.filtre : '' };
    if (!id) {
      var pl = horairesDuJour(cid, Number(c.jour))[0];
      if (pl) { c.debut = pl.debut; c.fin = pl.fin; }
    }
    if (id) cid = c.centre_id;
    var classes = lignes('classes').filter(function (k) { return k.centre_id === cid; });
    if (!classes.length) { toast('Créez d\'abord une classe (en bas de l\'écran).', true); return; }
    var profs = enseignantsDu(cid);
    var opt = function (v, t, sel) { return '<option value="' + esc(v) + '"' + (v === sel ? ' selected' : '') + '>' + esc(t) + '</option>'; };
    ouvrirFeuille('<h2>' + (id ? 'Modifier le créneau' : 'Nouveau créneau') + '</h2><p class="doux">' + esc((ligne('centres', cid) || {}).nom || '') + '</p>' +
      '<form data-f="creneau" data-id="' + esc(id || '') + '" data-centre="' + esc(cid) + '">' +
      '<label class="champ"><span>Classe</span><select name="classe_id" required>' + classes.map(function (k) { return opt(k.id, k.nom, c.classe_id); }).join('') + '</select></label>' +
      '<label class="champ"><span>Matière</span><select name="matiere_id" required data-change="creneau-matiere">' + lignes('matieres').map(function (m) { return opt(m.id, m.nom, c.matiere_id); }).join('') + '</select></label>' +
      '<label class="champ"><span>Enseignant</span><select name="enseignant_id" id="choix-prof">' + optionsProfs(profs, c.matiere_id || (lignes('matieres')[0] || {}).id, c.enseignant_id) + '</select>' +
      (profs.length ? '' : '<small>Aucun enseignant dans ce centre : donnez le rôle « Enseignant » dans Comptes et accès.</small>') + '</label>' +
      '<label class="champ"><span>Jour</span><select name="jour">' + [1, 2, 3, 4, 5, 6, 7].map(function (j) { return opt(String(j), JOURS[j], String(c.jour)); }).join('') + '</select></label>' +
      '<div class="deux"><label class="champ"><span>Début</span><input type="time" name="debut" required value="' + esc(c.debut) + '"></label>' +
      '<label class="champ"><span>Fin</span><input type="time" name="fin" required value="' + esc(c.fin) + '"></label></div>' +
      '<label class="champ"><span>Salle</span><input type="text" name="salle" value="' + esc(c.salle || '') + '" placeholder="facultatif"></label>' +
      '<div class="actions"><button class="btn" type="submit">Enregistrer</button>' + (id ? '<button class="btn danger" type="button" data-a="suppr-creneau" data-id="' + esc(id) + '">Supprimer</button>' : '') +
      '<button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
  }
  /** Les enseignants de la matière d'abord ; les autres restent possibles (remplacement). */
  function optionsProfs(profs, matiereId, sel) {
    var de = profs.filter(function (e) { return String(e.matieres || '').split(',').indexOf(matiereId) >= 0; });
    var autres = profs.filter(function (e) { return de.indexOf(e) < 0; });
    var o = function (e) { return '<option value="' + esc(e.id) + '"' + (e.id === sel ? ' selected' : '') + '>' + esc(e.nom) + '</option>'; };
    return '<option value="">À désigner</option>' + (de.length ? '<optgroup label="Enseignent cette matière">' + de.map(o).join('') + '</optgroup>' : '') +
      (autres.length ? '<optgroup label="Autres enseignants">' + autres.map(o).join('') + '</optgroup>' : '');
  }
  function feuilleClasse(id) {
    var k = id ? ligne('classes', id) : { nom: '', niveau: '' };
    var niveaux = ['6e', '5e', '4e', '3e', '2nde', '1ère', 'Tle', 'Primaire', 'Autre'];
    ouvrirFeuille('<h2>' + (id ? esc(k.nom) : 'Nouvelle classe') + '</h2><form data-f="classe" data-id="' + esc(id || '') + '" data-centre="' + esc(id ? k.centre_id : centreEmploi()) + '">' +
      '<label class="champ"><span>Nom</span><input type="text" name="nom" required value="' + esc(k.nom) + '" placeholder="ex. : 1ère C, Tle D, 3e"></label>' +
      '<label class="champ"><span>Niveau</span><select name="niveau">' + niveaux.map(function (n) { return '<option' + (n === k.niveau ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label>' +
      '<div class="deux"><label class="champ"><span>Inscription (F)</span><input type="number" name="inscription" min="0" value="' + (Number(k.inscription) || '') + '"' + (peut('tarifs.fixer', id ? k.centre_id : centreEmploi()) ? '' : ' disabled') + '></label>' +
      '<label class="champ"><span>Mensualité (F)</span><input type="number" name="mensualite" min="0" value="' + (Number(k.mensualite) || '') + '"' + (peut('tarifs.fixer', id ? k.centre_id : centreEmploi()) ? '' : ' disabled') + '></label></div>' +
      (peut('tarifs.fixer', id ? k.centre_id : centreEmploi()) ? '' : '<p class="doux">Les tarifs sont fixés par le responsable du centre.</p>') +
      '<div class="actions"><button class="btn" type="submit">Enregistrer</button>' + (id ? '<button class="btn danger" type="button" data-a="suppr-classe" data-id="' + esc(id) + '">Supprimer</button>' : '') +
      '<button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
  }
  function feuilleMatiere(id) {
    var m = id ? ligne('matieres', id) : { nom: '' };
    ouvrirFeuille('<h2>' + (id ? esc(m.nom) : 'Nouvelle matière') + '</h2><form data-f="matiere" data-id="' + esc(id || '') + '">' +
      '<label class="champ"><span>Nom</span><input type="text" name="nom" required value="' + esc(m.nom) + '"></label>' +
      '<div class="actions"><button class="btn" type="submit">Enregistrer</button>' + (id ? '<button class="btn danger" type="button" data-a="suppr-matiere" data-id="' + esc(id) + '">Supprimer</button>' : '') +
      '<button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
  }

  function moisLisibles(liste) {
    return String(liste || '').split(',').filter(Boolean).map(function (m) { return MOIS[(+m - 1)] || m; }).join(', ') || '—';
  }

  // ───────────────────────────── Équipe : messages, commentaires, réunions, tâches ─────────────────────────────
  // Réservé aux partenaires (qui voient la caisse). Un « fil » regroupe des messages : « general »
  // (la discussion du centre) ou un commentaire attaché à une dépense, une remise, une journée,
  // un bilan, une tâche, une réunion. Les non-lus se comptent par fil (dernière lecture gardée sur
  // ce téléphone). Les réunions se fixent en proposant des dates : chacun répond, la date retenue
  // part dans l'agenda. Les tâches sont réparties et avancées par chacun.
  var EQ = { onglet: 'discussion' };
  var LIB_TACHE = { a_faire: ['À faire', 'alerte'], en_cours: ['En cours', ''], fait: ['Fait', 'ok'] };
  var LIB_DISPO = { oui: ['Oui', 'ok'], peut: ['Peut-être', 'alerte'], non: ['Non', 'danger'] };
  function peutEquipe(cid) { return peut('paiements.voir', cid); }
  function peutEquipeQuelquePart() { return peutQuelquePart('paiements.voir'); }
  function centreEquipe() {
    var dispo = centresChoisis().filter(function (c) { return peutEquipe(c.id); });
    if (!dispo.some(function (c) { return c.id === EQ.centre; })) EQ.centre = dispo.length ? dispo[0].id : '';
    return { cid: EQ.centre, dispo: dispo };
  }
  function messagesDu(cid, fil) {
    return lignes('messages').filter(function (m) { return m.centre_id === cid && m.fil === fil; })
      .sort(function (a, b) { return String(a.cree_le || a.maj_le || '').localeCompare(String(b.cree_le || b.maj_le || '')); });
  }
  function luLe() { try { return JSON.parse(localStorage.getItem('vg-lu') || '{}'); } catch (e) { return {}; } }
  function marquerLu(cid, fil) { var l = luLe(); l[cid + '|' + fil] = maintenantSql(); try { localStorage.setItem('vg-lu', JSON.stringify(l)); } catch (e) {} }
  function nonLus(cid, fil) {
    var l = luLe(), moi = E.profil.utilisateur.id;
    return lignes('messages').filter(function (m) {
      return m.centre_id === cid && (!fil || m.fil === fil) && m.auteur && m.auteur !== moi && String(m.cree_le || m.maj_le || '') > (l[cid + '|' + m.fil] || '');
    });
  }
  /** Bouton « Commentaires (n) » à poser sous une dépense, une remise, une journée, un bilan… */
  function boutonCommentaires(cid, fil, titre) {
    if (!peutEquipe(cid)) return '';
    var n = messagesDu(cid, fil).length, nl = nonLus(cid, fil).length;
    return '<button class="btn clair petit commentaires" type="button" data-a="ouvrir-fil" data-centre="' + esc(cid) + '" data-fil="' + esc(fil) + '" data-titre="' + esc(titre) + '">' +
      ico('message', 'p') + (n ? n + ' commentaire' + (n > 1 ? 's' : '') : 'Commenter') + (nl ? ' <span class="pastille-n">' + nl + '</span>' : '') + '</button>';
  }
  function bullesFil(cid, fil) {
    var moi = E.profil.utilisateur.id, l = messagesDu(cid, fil);
    if (!l.length) return '<div class="carte vide">Aucun message pour l\'instant.</div>';
    return '<div class="fil">' + l.map(function (m) {
      var mien = m.auteur === moi || (!m.auteur && m._attente);
      return '<div class="bulle' + (mien ? ' mienne' : '') + '"><small>' + esc(mien ? 'Vous' : nomCompte(m.auteur)) + ' · ' + esc(dateLisible(m.cree_le || m.maj_le)) + (m._attente ? ' · en attente' : '') + '</small>' +
        '<p>' + esc(m.texte).replace(/\n/g, '<br>') + '</p>' + (mien ? '<button class="lien-discret" type="button" data-a="suppr-message" data-id="' + esc(m.id) + '">Supprimer</button>' : '') + '</div>';
    }).join('') + '</div>';
  }
  function formMessage(cid, fil) {
    return '<form data-f="message" data-centre="' + esc(cid) + '" data-fil="' + esc(fil) + '" class="form-message"><label class="sr" for="msg-' + esc(fil) + '">Message</label>' +
      '<textarea id="msg-' + esc(fil) + '" name="texte" rows="2" maxlength="1000" required placeholder="Votre message…"></textarea><button class="btn or" type="submit">' + ico('message', 'p') + 'Envoyer</button></form>';
  }
  function feuilleFil(cid, fil, titre) {
    E.cache.filOuvert = { cid: cid, fil: fil, titre: titre };
    marquerLu(cid, fil);
    ouvrirFeuille('<h2>' + esc(titre || 'Commentaires') + '</h2><p class="doux">' + esc((ligne('centres', cid) || {}).nom || '') + ' · visible des partenaires du centre</p>' +
      '<div id="zone-fil">' + bullesFil(cid, fil) + '</div>' + formMessage(cid, fil) +
      '<div class="actions"><button class="btn clair" type="button" data-a="fermer">Fermer</button></div>');
    var z = $('#zone-fil .fil'); if (z) z.scrollTop = z.scrollHeight;
  }

  // ── Page Équipe ──
  function pageEquipe() {
    var cc = centreEquipe(), cid = cc.cid;
    var h = '<h1>Équipe</h1><p class="sous-titre">Entre partenaires : messages, commentaires, dates de réunion, tâches.</p>';
    if (cc.dispo.length > 1) h += '<div class="puces">' + cc.dispo.map(function (c) { return '<button type="button" class="puce' + (c.id === cid ? ' on' : '') + '" data-a="eq-centre" data-v="' + esc(c.id) + '">' + esc(c.nom_court || c.nom) + '</button>'; }).join('') + '</div>';
    if (!cid) return h + '<div class="carte vide">Aucun centre.</div>';
    var nl = nonLus(cid).length, ouverts = sondagesOuvertsSansReponse(cid).length, mesT = mesTachesUrgentes(cid).length;
    h += '<div class="onglets">' + [['discussion', 'Discussion' + (nl ? ' · ' + nl : '')], ['reunions', 'Réunions' + (ouverts ? ' · ' + ouverts : '')], ['taches', 'Tâches' + (mesT ? ' · ' + mesT : '')]].map(function (o) {
      return '<button type="button" class="' + (EQ.onglet === o[0] ? 'on' : '') + '" data-a="eq-onglet" data-v="' + o[0] + '">' + o[1] + '</button>';
    }).join('') + '</div>';
    if (EQ.onglet === 'reunions') return h + ongletReunions(cid);
    if (EQ.onglet === 'taches') return h + ongletTaches(cid);
    // Discussion générale + commentaires récents ailleurs.
    marquerLu(cid, 'general');
    h += bullesFil(cid, 'general') + formMessage(cid, 'general');
    var autres = {};
    lignes('messages').forEach(function (m) { if (m.centre_id === cid && m.fil !== 'general') { var a = autres[m.fil]; if (!a || String(m.cree_le || '') > String(a.cree_le || '')) autres[m.fil] = m; } });
    var fils = Object.keys(autres).sort(function (a, b) { return String(autres[b].cree_le || '').localeCompare(String(autres[a].cree_le || '')); }).slice(0, 15);
    if (fils.length) h += '<h2>Commentaires récents</h2><div class="liste">' + fils.map(function (f) {
      var m = autres[f], n = nonLus(cid, f).length, t = titreFil(cid, f);
      return '<button class="ligne" type="button" data-a="ouvrir-fil" data-centre="' + esc(cid) + '" data-fil="' + esc(f) + '" data-titre="' + esc(t) + '"><span class="pastille">' + ico('message') + '</span><span class="corps"><b>' + esc(t) + '</b><small>' +
        esc(nomCompte(m.auteur) + ' : ' + String(m.texte).slice(0, 80)) + '</small></span>' + (n ? '<span class="badge alerte">' + n + ' nouveau' + (n > 1 ? 'x' : '') + '</span>' : '') + '</button>';
    }).join('') + '</div>';
    return h;
  }
  function titreFil(cid, f) {
    var k = f.split(':'), x = k[1] || '';
    if (k[0] === 'depense') { var d = ligne('depenses', x); return 'Dépense · ' + (d ? d.libelle + ' (' + fcfa(d.montant) + ')' : '—'); }
    if (k[0] === 'remise') { var r = ligne('remises', x); return 'Remise · ' + (r ? nomCompte(r.remis_par) + ' ' + fcfa(r.montant) : '—'); }
    if (k[0] === 'paie') { var p = ligne('paies', x); return 'Paie · ' + (p ? (nomPersonne(p.enseignant_id) || 'enseignant') + ' ' + fcfa(p.montant) : '—'); }
    if (k[0] === 'jour') return 'Point du jour · ' + dateLisible(x.slice(0, 4) + '-' + x.slice(4, 6) + '-' + x.slice(6, 8), true);
    if (k[0] === 'bilan') return 'Bilan · ' + MOIS[Number(x.slice(4, 6)) - 1] + ' ' + x.slice(0, 4);
    if (k[0] === 'tache') { var t = ligne('taches', x); return 'Tâche · ' + (t ? t.titre : '—'); }
    if (k[0] === 'reunion') { var s = ligne('sondages', x); return 'Réunion · ' + (s ? s.titre : '—'); }
    return 'Discussion';
  }

  // ── Réunions : dates proposées, disponibilités ──
  function optionsSondage(s) { try { var o = JSON.parse(s.options || '[]'); return Array.isArray(o) ? o : []; } catch (e) { return []; } }
  function dispoDe(s, uid) { return lignes('dispos').filter(function (d) { return d.sondage_id === s.id && d.utilisateur_id === uid; })[0] || null; }
  function reponsesDe(d) { try { return JSON.parse(d && d.reponses || '{}') || {}; } catch (e) { return {}; } }
  function libOption(o) { var d = o.slice(0, 10), h = o.slice(11); return dateLongue(d).replace(/^./, function (c) { return c.toUpperCase(); }) + (h ? ' à ' + heureLisible(h) : ''); }
  function sondagesDu(cid) { return lignes('sondages').filter(function (s) { return s.centre_id === cid; }).sort(function (a, b) { return a.statut === b.statut ? String(b.cree_le || '').localeCompare(String(a.cree_le || '')) : a.statut === 'ouvert' ? -1 : 1; }); }
  function sondagesOuvertsSansReponse(cid) { var moi = E.profil.utilisateur.id; return sondagesDu(cid).filter(function (s) { return s.statut === 'ouvert' && !dispoDe(s, moi); }); }
  function decompte(s, o) {
    var c = { oui: [], peut: [], non: [] };
    lignes('dispos').filter(function (d) { return d.sondage_id === s.id; }).forEach(function (d) { var v = reponsesDe(d)[o]; if (c[v]) c[v].push(nomCompte(d.utilisateur_id)); });
    return c;
  }
  function ongletReunions(cid) {
    var l = sondagesDu(cid), moi = E.profil.utilisateur.id;
    var h = l.length ? '<div class="liste">' + l.map(function (s) {
      var opts = optionsSondage(s), repondu = !!dispoDe(s, moi);
      var meilleure = opts.map(function (o) { return [o, decompte(s, o).oui.length]; }).sort(function (a, b) { return b[1] - a[1]; })[0];
      return '<button class="ligne" type="button" data-a="voir-sondage" data-id="' + esc(s.id) + '"><span class="pastille">' + ico('agenda') + '</span><span class="corps"><b>' + esc(s.titre) + '</b><small>' +
        esc(s.statut === 'clos' ? 'Fixée : ' + libOption(s.choix) : opts.length + ' date' + (opts.length > 1 ? 's' : '') + ' proposée' + (opts.length > 1 ? 's' : '') + (meilleure && meilleure[1] ? ' · en tête : ' + libOption(meilleure[0]) + ' (' + meilleure[1] + ' oui)' : '')) + '</small></span>' +
        (s.statut === 'clos' ? '<span class="badge ok">fixée</span>' : repondu ? '<span class="badge">répondu</span>' : '<span class="badge alerte">à répondre</span>') + '</button>';
    }).join('') + '</div>' : '<div class="carte vide">Aucune réunion en préparation. Proposez des dates : chacun dit s\'il est disponible.</div>';
    return h + '<button class="fab" type="button" data-a="nouveau-sondage">' + ico('plus') + 'Proposer des dates</button>';
  }
  function feuilleNouveauSondage() {
    var demain = decalerJour(isoLocal(new Date()), 1);
    var ligneDate = function (i) { return '<div class="deux"><label class="champ"><span>Date ' + (i + 1) + '</span><input type="date" name="d' + i + '"' + (i === 0 ? ' required value="' + demain + '"' : '') + '></label><label class="champ"><span>Heure</span><input type="time" name="h' + i + '"' + (i === 0 ? ' value="16:00"' : '') + '></label></div>'; };
    ouvrirFeuille('<h2>Proposer des dates</h2><p class="doux">Chaque partenaire indique ses disponibilités ; vous retenez ensuite la meilleure date, qui part dans l\'agenda.</p>' +
      '<form data-f="sondage"><label class="champ"><span>Objet</span><input type="text" name="titre" required maxlength="160" placeholder="ex. : Réunion des partenaires, bilan d\'octobre"></label>' +
      '<label class="champ"><span>Lieu</span><input type="text" name="lieu" maxlength="160" placeholder="ex. : au centre, ou en ligne"></label>' +
      [0, 1, 2, 3].map(ligneDate).join('') +
      '<label class="champ"><span>Note</span><textarea name="note" rows="2" maxlength="400"></textarea></label>' +
      '<div class="actions"><button class="btn or" type="submit">Envoyer la proposition</button><button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
  }
  function feuilleSondage(id) {
    var s = ligne('sondages', id); if (!s) return;
    var moi = E.profil.utilisateur.id, mes = reponsesDe(dispoDe(s, moi)), ouvert = s.statut === 'ouvert';
    var decideur = s.auteur === moi || estAdmin() || peut('agenda.gerer', s.centre_id);
    var h = '<h2>' + esc(s.titre) + '</h2><p class="doux">Proposée par ' + esc(nomCompte(s.auteur)) + (s.lieu ? ' · ' + esc(s.lieu) : '') + '</p>' + (s.note ? '<p>' + esc(s.note) + '</p>' : '');
    if (!ouvert) h += '<div class="carte a-remettre"><span>Date retenue</span><b>' + esc(libOption(s.choix)) + '</b></div>';
    h += '<div class="liste">' + optionsSondage(s).map(function (o) {
      var c = decompte(s, o), moiV = mes[o] || '';
      return '<div class="ligne option-date' + (s.choix === o ? ' retenue' : '') + '"><span class="corps"><b>' + esc(libOption(o)) + '</b><small>' +
        ['oui', 'peut', 'non'].filter(function (k) { return c[k].length; }).map(function (k) { return LIB_DISPO[k][0] + ' : ' + esc(c[k].join(', ')); }).join(' · ') + '</small>' +
        (ouvert ? '<span class="choix-dispo">' + ['oui', 'peut', 'non'].map(function (k) {
          return '<button type="button" class="puce' + (moiV === k ? ' on ' + LIB_DISPO[k][1] : '') + '" data-a="dispo" data-id="' + esc(s.id) + '" data-o="' + esc(o) + '" data-v="' + k + '">' + LIB_DISPO[k][0] + '</button>';
        }).join('') + '</span>' : '') + '</span><span class="fin"><b>' + c.oui.length + '</b><small>oui</small></span>' +
        (ouvert && decideur ? '<button class="btn clair petit" type="button" data-a="fixer-sondage" data-id="' + esc(s.id) + '" data-o="' + esc(o) + '">Retenir</button>' : '') + '</div>';
    }).join('') + '</div>';
    h += '<div class="actions">' + boutonCommentaires(s.centre_id, 'reunion:' + s.id, 'Réunion · ' + s.titre) +
      (!ouvert && s.evenement_id ? '<a class="btn clair petit" href="#/agenda" data-a="fermer-et-aller">' + ico('agenda', 'p') + 'Voir dans l\'agenda</a>' : '') + '</div>';
    if (s.auteur === moi || estAdmin()) h += '<div class="actions"><button class="btn danger petit" type="button" data-a="suppr-sondage" data-id="' + esc(s.id) + '">Supprimer la réunion</button></div>';
    ouvrirFeuille(h + '<div class="actions"><button class="btn clair" type="button" data-a="fermer">Fermer</button></div>');
  }

  // ── Tâches ──
  function partenairesDu(cid) {
    var vus = {};
    return E.equipe.filter(function (e) { if (e.centre_id !== cid || e.role === 'enseignant' || vus[e.id]) return false; vus[e.id] = 1; return true; });
  }
  function tachesDu(cid) { return lignes('taches').filter(function (t) { return t.centre_id === cid; }); }
  function mesTachesUrgentes(cid) {
    var moi = E.profil.utilisateur.id, limite = decalerJour(isoLocal(new Date()), 2);
    return tachesDu(cid).filter(function (t) { return t.assigne_a === moi && t.statut !== 'fait' && (!t.echeance || t.echeance <= limite); });
  }
  function ligneTache(t) {
    var auj = isoLocal(new Date()), retard = t.statut !== 'fait' && t.echeance && t.echeance < auj, st = LIB_TACHE[t.statut || 'a_faire'];
    var suivant = t.statut === 'a_faire' ? 'en_cours' : t.statut === 'en_cours' ? 'fait' : '';
    var n = messagesDu(t.centre_id, 'tache:' + t.id).length;
    return '<div class="ligne tache' + (t.statut === 'fait' ? ' faite' : '') + '"><button class="corps" type="button" data-a="editer-tache" data-id="' + esc(t.id) + '"><b>' + esc(t.titre) + '</b><small>' +
      esc([t.assigne_a ? nomCompte(t.assigne_a) : 'Personne', t.echeance ? 'pour le ' + dateLisible(t.echeance, true) : ''].filter(Boolean).join(' · ')) + (n ? ' · ' + n + ' commentaire' + (n > 1 ? 's' : '') : '') + '</small>' +
      '<span><span class="badge ' + st[1] + '">' + st[0] + '</span>' + (retard ? '<span class="badge danger">en retard</span>' : '') + '</span></button>' +
      (suivant ? '<button class="btn clair petit" type="button" data-a="avancer-tache" data-id="' + esc(t.id) + '" data-v="' + suivant + '">' + (suivant === 'fait' ? ico('check', 'p') + 'Fait' : 'Commencer') + '</button>' : '') + '</div>';
  }
  function ongletTaches(cid) {
    var l = tachesDu(cid).sort(function (a, b) { return (a.echeance || '9999') < (b.echeance || '9999') ? -1 : 1; });
    var h = '';
    ['a_faire', 'en_cours', 'fait'].forEach(function (k) {
      var g = l.filter(function (t) { return (t.statut || 'a_faire') === k; });
      if (k === 'fait') g = g.sort(function (a, b) { return String(b.fait_le || '').localeCompare(String(a.fait_le || '')); }).slice(0, 15);
      h += '<h2>' + LIB_TACHE[k][0] + ' · ' + g.length + '</h2>' + (g.length ? '<div class="liste">' + g.map(ligneTache).join('') + '</div>' : '<div class="carte vide">Rien ici.</div>');
    });
    return h + '<button class="fab" type="button" data-a="editer-tache" data-id="">' + ico('plus') + 'Tâche</button>';
  }
  function feuilleTache(id) {
    var cid = EQ.centre, t = id ? ligne('taches', id) : null;
    var d = t || { titre: '', note: '', assigne_a: '', echeance: '', statut: 'a_faire' };
    ouvrirFeuille('<h2>' + (t ? 'Tâche' : 'Nouvelle tâche') + '</h2>' + (t ? '<p class="doux">Créée par ' + esc(nomCompte(t.auteur)) + (t.fait_le ? ' · faite le ' + esc(dateLisible(t.fait_le, true)) : '') + '</p>' : '') +
      '<form data-f="tache" data-id="' + esc(id || '') + '" data-centre="' + esc(t ? t.centre_id : cid) + '"><label class="champ"><span>Tâche</span><input type="text" name="titre" required maxlength="160" value="' + esc(d.titre) + '" placeholder="ex. : Relancer les impayés de 3e"></label>' +
      '<div class="deux"><label class="champ"><span>Qui s\'en charge</span><select name="assigne_a"><option value="">— Personne —</option>' + partenairesDu(t ? t.centre_id : cid).map(function (e) {
        return '<option value="' + esc(e.id) + '"' + (d.assigne_a === e.id ? ' selected' : '') + '>' + esc(e.id === E.profil.utilisateur.id ? e.nom + ' (vous)' : e.nom) + '</option>';
      }).join('') + '</select></label><label class="champ"><span>Pour le</span><input type="date" name="echeance" value="' + esc(d.echeance || '') + '"></label></div>' +
      '<label class="champ"><span>Statut</span><select name="statut">' + Object.keys(LIB_TACHE).map(function (k) { return '<option value="' + k + '"' + ((d.statut || 'a_faire') === k ? ' selected' : '') + '>' + LIB_TACHE[k][0] + '</option>'; }).join('') + '</select></label>' +
      '<label class="champ"><span>Détails</span><textarea name="note" rows="3" maxlength="400">' + esc(d.note || '') + '</textarea></label>' +
      '<div class="actions"><button class="btn or" type="submit">Enregistrer</button><button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>' +
      (t ? '<div class="actions">' + boutonCommentaires(t.centre_id, 'tache:' + t.id, 'Tâche · ' + t.titre) + (t.auteur === E.profil.utilisateur.id || estAdmin() ? '<button class="btn danger petit" type="button" data-a="suppr-tache" data-id="' + esc(t.id) + '">Supprimer</button>' : '') + '</div>' : ''));
  }

  // ───────────────────────────── Remises de fonds au trésorier ─────────────────────────────
  // Chaque partenaire encaisse selon ses jours au centre et sa proximité avec les parents,
  // envoie le reçu, puis REMET l'argent au trésorier du centre avant la fin du mois. Le
  // trésorier confirme la réception (« Reçu ») ou la conteste (« Pas reçu », avec motif).
  // Ce qu'un partenaire garde en main = ses encaissements − ses dépenses saisies − ses remises.
  function tresorierDe(cid) { return (ligne('centres', cid) || {}).tresorier_id || ''; }
  function estTresorier(cid) { return !!E.profil && tresorierDe(cid) === E.profil.utilisateur.id; }
  function estTresorierQuelquePart() { return lignes('centres').some(function (c) { return estTresorier(c.id); }); }
  function nomCompte(id) { return id === E.profil.utilisateur.id ? E.profil.utilisateur.nom : (nomPersonne(id) || 'Ancien compte'); }
  /** « 12 000 F » à remettre, ou « 0 F » quand il a déjà remis plus que ses encaissements enregistrés. */
  function libReste(x) { return x.reste >= 0 ? fcfa(x.reste) : fcfa(0); }
  function remisesDu(cid) { return lignes('remises').filter(function (r) { return r.centre_id === cid; }).sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : String(b.maj_le || '').localeCompare(String(a.maj_le || '')); }); }
  /** Fonds d'un compte dans un centre (cumul), et ce qui reste en main. */
  /** Chaque mois est un cycle : comptes et partage le 30 ou le 31, puis tout repart de zéro. */
  function moisCycle() { return isoLocal(new Date()).slice(0, 7); }
  /** Début des comptes du centre : l'argent d'avant ne compte plus pour les partenaires (il sert seulement aux reliquats des élèves). */
  function debutComptes(cid) { var c = ligne('centres', cid); return (c && c.debut_comptes) || ''; }
  function enCompte(x, cid) { var d = debutComptes(cid || x.centre_id); return !d || String(x.date || '') >= d; }
  function avantComptes(cid, am) { var d = debutComptes(cid); return !!d && am < d.slice(0, 7); }
  function dansMois(x, am) { return String(x.date || '').slice(0, 7) === am && enCompte(x); }
  function soldeFonds(uid, cid, am) {
    am = am || moisCycle();
    var somme = function (l) { return l.reduce(function (s, x) { return s + (Number(x.montant) || 0); }, 0); };
    var enc = somme(lignes('paiements').filter(function (p) { return p.centre_id === cid && p.encaisse_par === uid && !Number(p.annule) && dansMois(p, am); }));
    var dep = somme(lignes('depenses').filter(function (d) { return d.centre_id === cid && d.saisie_par === uid && d.statut !== 'refusee' && dansMois(d, am); })) +
      somme(lignes('paies').filter(function (x) { return x.centre_id === cid && x.paye_par === uid && !Number(x.annule) && dansMois(x, am); }));
    var rs = remisesDu(cid).filter(function (r) { return r.remis_par === uid && dansMois(r, am); });
    var conf = somme(rs.filter(function (r) { return r.statut === 'confirmee'; }));
    var att = somme(rs.filter(function (r) { return (r.statut || 'en_attente') === 'en_attente'; }));
    return { encaisse: enc, depenses: dep, confirme: conf, attente: att, reste: enc - dep - conf - att };
  }
  /** Comptes qui ont manié de l'argent dans ce centre (encaissé, dépensé ou remis). */
  function comptesFonds(cid, am) {
    am = am || moisCycle();
    var ids = {};
    lignes('paiements').forEach(function (p) { if (p.centre_id === cid && p.encaisse_par && dansMois(p, am)) ids[p.encaisse_par] = 1; });
    lignes('depenses').forEach(function (d) { if (d.centre_id === cid && d.saisie_par && dansMois(d, am)) ids[d.saisie_par] = 1; });
    lignes('paies').forEach(function (x) { if (x.centre_id === cid && x.paye_par && !Number(x.annule) && dansMois(x, am)) ids[x.paye_par] = 1; });
    remisesDu(cid).forEach(function (r) { if (r.remis_par && dansMois(r, am)) ids[r.remis_par] = 1; });
    return Object.keys(ids);
  }
  function finDuMois(iso) { return decalerJour(moisSuivantIso(iso.slice(0, 7)) + '-01', -1); }
  var LIB_STATUT_REMISE = { en_attente: ['en attente du trésorier', 'alerte'], confirmee: ['reçue par le trésorier', 'ok'], contestee: ['pas reçue', 'danger'] };

  function ligneRemise(r, cid) {
    var moi = E.profil.utilisateur.id, st = LIB_STATUT_REMISE[r.statut || 'en_attente'];
    var attente = (r.statut || 'en_attente') === 'en_attente';
    var tresorier = (estTresorier(cid) || estAdmin()) && attente && r.remis_par !== moi;
    var auteur = attente && r.remis_par === moi;
    return '<div class="ligne remise"><span class="avatar">' + esc(initiales(nomCompte(r.remis_par))) + '</span><span class="corps"><b>' + esc(nomCompte(r.remis_par)) + ' · ' + fcfa(r.montant) + '</b>' +
      '<small>' + esc(dateLisible(r.date, true) + ' · ' + (MODES[r.mode] || r.mode || 'Espèces') + (r.note ? ' · ' + r.note : '')) + '</small>' +
      (r.statut === 'contestee' && r.motif ? '<small class="motif">Motif : ' + esc(r.motif) + '</small>' : '') +
      (r.confirme_par && !attente ? '<small>' + (r.statut === 'confirmee' ? 'Confirmée' : 'Contestée') + ' par ' + esc(nomCompte(r.confirme_par)) + (r.confirme_le ? ' le ' + esc(dateLisible(r.confirme_le, true)) : '') + '</small>' : '') +
      '<span><span class="badge ' + st[1] + '">' + esc(st[0]) + '</span>' + (r._attente ? '<span class="badge">à envoyer</span>' : '') + '</span>' +
      '<span class="boutons">' + boutonCommentaires(cid, 'remise:' + r.id, 'Remise · ' + nomCompte(r.remis_par) + ' ' + fcfa(r.montant)) + '</span>' +
      (tresorier ? '<span class="boutons"><button class="btn or petit" type="button" data-a="remise-recue" data-id="' + esc(r.id) + '">' + ico('check', 'p') + 'Reçu</button><button class="btn danger petit" type="button" data-a="remise-contester" data-id="' + esc(r.id) + '">Pas reçu</button></span>' : '') +
      (auteur ? '<span class="boutons"><button class="btn clair petit" type="button" data-a="remise-prevenir" data-id="' + esc(r.id) + '">' + ico('message', 'p') + 'Prévenir le trésorier</button><button class="btn clair petit" type="button" data-a="editer-remise" data-id="' + esc(r.id) + '">Modifier</button></span>' : '') +
      '</span></div>';
  }

  /** Onglet « Remises » de la caisse. */
  function ongletRemises(cid) {
    var moi = E.profil.utilisateur.id, tres = tresorierDe(cid), h = '';
    var c = ligne('centres', cid) || {};
    if (!tres) h += '<p class="sous-titre">Cycle de <b>' + esc(libMoisAnnee(moisCycle())) + '</b> : comptes et partage le ' + esc(dateLisible(finDuMois(isoLocal(new Date())), true)) + ', puis un nouveau cycle commence.</p>';
    if (!tres) {
      h += '<div class="carte note-carte">' + ico('alert', 'p') + ' <b>Aucun trésorier désigné</b> pour ' + esc(c.nom_court || c.nom || 'ce centre') + '. ' +
        (estAdmin() ? 'Choisissez-le dans la fiche du centre.</div><div class="actions"><button class="btn or" type="button" data-a="editer-centre" data-id="' + esc(cid) + '">Choisir le trésorier</button></div>' : 'L\'administrateur doit le choisir.</div>');
    } else {
      h += '<p class="sous-titre">Trésorier : <b>' + esc(nomCompte(tres)) + '</b>' + (estTresorier(cid) ? ' (vous)' : '') + ' · cycle de <b>' + esc(libMoisAnnee(moisCycle())) + '</b> : fonds à remettre avant le ' + esc(dateLisible(finDuMois(isoLocal(new Date())), true)) + ', puis comptes et partage.</p>';
      var prec = decalerMois(moisCycle(), -1), sp = soldeFonds(moi, cid, prec);
      if (!estTresorier(cid) && sp.reste > 0 && !clotureDe(cid, prec)) h += '<div class="carte note-carte">' + ico('alert', 'p') + ' ' + esc(libMoisAnnee(prec)) + ' n\'est pas encore clôturé : il vous reste <b>' + fcfa(sp.reste) + '</b> de ce mois à remettre au trésorier.</div>';
    }
    // Ce que j'ai en main.
    if (peut('paiements.encaisser', cid) && !estTresorier(cid)) {
      var s = soldeFonds(moi, cid);
      h += '<h2>Chez vous</h2><div class="stats petites"><div><b>' + fcfa(s.encaisse) + '</b><small>encaissé</small></div><div><b>' + fcfa(s.depenses) + '</b><small>dépenses et paies</small></div><div><b>' + fcfa(s.confirme + s.attente) + '</b><small>remis' + (s.attente ? ' (dont ' + fcfa(s.attente) + ' à confirmer)' : '') + '</small></div></div>' +
        '<div class="carte a-remettre' + (s.reste > 0 ? ' du' : '') + '"><span>À remettre au trésorier' + (s.reste < 0 ? '<small>Vous avez remis ' + fcfa(-s.reste) + ' de plus que vos encaissements enregistrés.</small>' : '') + '</span><b>' + libReste(s) + '</b></div>' +
        (tres ? '<div class="actions"><button class="btn or" type="button" data-a="editer-remise" data-id="" data-montant="' + Math.max(0, s.reste) + '">' + ico('wallet', 'p') + 'Remettre au trésorier</button></div>' : '');
    }
    // Le trésorier (ou l'admin) tranche.
    var aConfirmer = remisesDu(cid).filter(function (r) { return (r.statut || 'en_attente') === 'en_attente' && r.remis_par !== moi; });
    if (estTresorier(cid) || estAdmin()) {
      h += '<h2>À confirmer' + (aConfirmer.length ? ' · ' + aConfirmer.length : '') + '</h2>' + (aConfirmer.length ? '<div class="liste">' + aConfirmer.map(function (r) { return ligneRemise(r, cid); }).join('') + '</div>' : '<div class="carte vide">Aucune remise en attente.</div>');
    }
    // Vue d'ensemble pour le trésorier et ceux qui voient le bilan.
    if (estTresorier(cid) || peut('finances.voir', cid)) {
      var gens = comptesFonds(cid), totMain = 0, totConf = 0;
      var lignesP = gens.map(function (uid) {
        var x = soldeFonds(uid, cid);
        if (uid === tres) { totConf += x.encaisse - x.depenses; return ''; }
        totMain += Math.max(0, x.reste); totConf += x.confirme;
        return '<div class="ligne"><span class="avatar">' + esc(initiales(nomCompte(uid))) + '</span><span class="corps"><b>' + esc(nomCompte(uid)) + '</b><small>Encaissé ' + fcfa(x.encaisse) + ' · dépenses et paies ' + fcfa(x.depenses) + ' · remis ' + fcfa(x.confirme) + (x.attente ? ' (+ ' + fcfa(x.attente) + ' à confirmer)' : '') + '</small></span>' +
          '<span class="fin"><b' + (x.reste > 0 ? ' class="st-retard"' : '') + '>' + libReste(x) + '</b><small>' + (x.reste < 0 ? 'remis en plus : ' + fcfa(-x.reste) : 'en main') + '</small></span></div>';
      }).join('');
      h += '<h2>Fonds du centre</h2><div class="stats"><div><b>' + fcfa(totConf) + '</b><small>chez le trésorier (confirmé)</small></div><div><b>' + fcfa(totMain) + '</b><small>encore chez les partenaires</small></div></div>' +
        (lignesP ? '<div class="liste">' + lignesP + '</div>' : '');
    }
    var hist = remisesDu(cid).filter(function (r) { return aConfirmer.indexOf(r) < 0 || !(estTresorier(cid) || estAdmin()); });
    h += '<h2>Historique des remises</h2>' + (hist.length ? '<div class="liste">' + hist.slice(0, 60).map(function (r) { return ligneRemise(r, cid); }).join('') + '</div>' : '<div class="carte vide">Aucune remise pour l\'instant.</div>');
    return h;
  }

  function feuilleRemise(id, cid, montantDefaut) {
    var r = id ? ligne('remises', id) : null;
    cid = r ? r.centre_id : cid;
    var d = r || { montant: montantDefaut || '', date: isoLocal(new Date()), mode: 'especes', note: '' };
    ouvrirFeuille('<h2>' + (r ? 'Modifier la remise' : 'Remettre au trésorier') + '</h2><p class="doux">' + esc((ligne('centres', cid) || {}).nom || '') + ' · trésorier : ' + esc(nomCompte(tresorierDe(cid))) + '</p>' +
      '<form data-f="remise" data-id="' + esc(id || '') + '" data-centre="' + esc(cid) + '">' +
      '<div class="deux"><label class="champ"><span>Montant (FCFA)</span><input type="number" name="montant" min="1" required value="' + esc(d.montant) + '"></label>' +
      '<label class="champ"><span>Date</span><input type="date" name="date" required max="' + isoLocal(new Date()) + '" value="' + esc(d.date) + '"></label></div>' +
      '<label class="champ"><span>Remis en</span><select name="mode">' + Object.keys(MODES).map(function (k) { return '<option value="' + k + '"' + (d.mode === k ? ' selected' : '') + '>' + MODES[k] + '</option>'; }).join('') + '</select></label>' +
      '<label class="champ"><span>Note</span><input type="text" name="note" maxlength="200" value="' + esc(d.note || '') + '" placeholder="ex. : versements de la semaine, réf. MoMo…"></label>' +
      '<p class="doux">Le trésorier confirmera la réception. Tant qu\'il ne l\'a pas fait, vous pouvez corriger ou retirer la remise.</p>' +
      '<div class="actions"><button class="btn or" type="submit">' + (r ? 'Enregistrer' : 'Enregistrer la remise') + '</button><button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>' +
      (r ? '<div class="actions"><button class="btn danger" type="button" data-a="suppr-remise" data-id="' + esc(id) + '">Retirer la remise</button></div>' : ''));
  }
  function messageRemise(r) {
    var c = ligne('centres', r.centre_id) || {};
    return 'Bonjour ' + nomCompte(tresorierDe(r.centre_id)) + ', je vous ai remis ' + fcfa(r.montant).replace(/ /g, ' ') + ' (' + (MODES[r.mode] || 'espèces') + ') le ' + dateLisible(r.date, true) +
      ' pour ' + (c.nom || 'le centre') + (r.note ? ' — ' + r.note : '') + '. Merci de confirmer la réception dans VÉRITAS Gestion (Caisse › Remises). ' + E.profil.utilisateur.nom;
  }

  /** Bilan : où est l'argent du centre. */
  function infosFondsBilan(cid, am) {
    am = am || moisCycle();
    if (!lignes('remises').some(function (r) { return r.centre_id === cid; }) && !tresorierDe(cid)) return '';
    var tres = tresorierDe(cid), main = 0, chezT = 0;
    comptesFonds(cid, am).forEach(function (uid) { var x = soldeFonds(uid, cid, am); if (uid === tres) chezT += x.encaisse - x.depenses; else { main += Math.max(0, x.reste); chezT += x.confirme; } });
    var att = remisesDu(cid).filter(function (r) { return (r.statut || 'en_attente') === 'en_attente' && dansMois(r, am); }).reduce(function (s, r) { return s + Number(r.montant); }, 0);
    return '<div class="infos"><div class="info"><span>Fonds chez le trésorier' + (tres ? ' (' + esc(nomCompte(tres)) + ')' : '') + '</span><b>' + fcfa(chezT) + '</b></div>' +
      (att ? '<div class="info"><span>Remises à confirmer</span><b>' + fcfa(att) + '</b></div>' : '') +
      '<div class="info"><span>Encore chez les partenaires</span><b>' + fcfa(main) + '</b></div></div>';
  }

  // ── Clôture mensuelle : comptes arrêtés, partage, mois verrouillé ──
  function libMoisAnnee(am) { return MOIS[Number(am.slice(5, 7)) - 1] + ' ' + am.slice(0, 4); }
  function idCloture(cid, am) { return 'clo-' + cid + '-' + am; }
  function clotureDe(cid, am) { var c = ligne('clotures', idCloture(cid, am)); return c && !Number(c.supprime) ? c : null; }
  function partsCloture(k) { try { var p = JSON.parse(k.parts || '[]'); return Array.isArray(p) ? p : []; } catch (e) { return []; } }
  function texteCloture(c, k) {
    var l = ['*Comptes de ' + libMoisAnnee(k.mois) + ' — ' + (c.nom || 'VÉRITAS') + '*', '',
      'Recettes : ' + fcfa(k.recettes), 'Dépenses : − ' + fcfa(k.depenses), 'Paies des enseignants : − ' + fcfa(k.paies), '*Résultat : ' + fcfa(k.resultat) + '*', ''];
    var p = partsCloture(k);
    if (p.length) { l.push('*Partage*'); p.forEach(function (x) { l.push('• ' + x.nom + ' (' + pourcent(x.part) + ') : ' + fcfa(x.montant)); }); l.push(''); }
    l.push('Clôturé le ' + dateLisible(k.clos_le) + ' par ' + nomCompte(k.clos_par) + '. Nouveau cycle : ' + libMoisAnnee(decalerMois(k.mois, 1)) + '.');
    return l.join('\n').replace(/\u00a0/g, ' ');
  }
  function blocCloture(c, am) {
    if (!peut('paiements.voir', c.id)) return '';
    var k = clotureDe(c.id, am);
    if (k) {
      return '<div class="carte cloture faite"><h3>' + ico('lock', 'p') + ' ' + esc(libMoisAnnee(am)) + ' clôturé</h3><p class="doux">Le ' + esc(dateLisible(k.clos_le)) + ' par ' + esc(nomCompte(k.clos_par)) + (k._attente ? ' · en attente d\'envoi' : '') + '</p>' +
        '<div class="infos"><div class="info"><span>Résultat arrêté</span><b>' + fcfa(k.resultat) + '</b></div>' + partsCloture(k).map(function (x) { return '<div class="info"><span>' + esc(x.nom) + ' (' + pourcent(x.part) + ')</span><b>' + fcfa(x.montant) + '</b></div>'; }).join('') + '</div>' +
        '<div class="actions"><button class="btn or petit" type="button" data-a="partager-cloture" data-centre="' + esc(c.id) + '" data-mois="' + esc(am) + '">' + ico('message', 'p') + 'Envoyer les comptes</button>' +
        (estAdmin() ? '<button class="btn clair petit" type="button" data-a="rouvrir-mois" data-centre="' + esc(c.id) + '" data-mois="' + esc(am) + '">Rouvrir le mois</button>' : '') + '</div></div>';
    }
    if (am > moisCycle()) return '';
    var fin = finDuMois(am + '-01'), auj = isoLocal(new Date());
    return '<div class="carte cloture"><h3>' + ico('lock', 'p') + ' Clôture de ' + esc(libMoisAnnee(am)) + '</h3><p class="doux">Le ' + esc(dateLisible(fin, true)) + ' : comptes arrêtés, part de chaque actionnaire, puis un nouveau cycle commence. ' +
      'Après la clôture, plus aucun versement, dépense, paie ou remise ne peut être daté de ' + esc(MOIS[Number(am.slice(5)) - 1]) + '.</p>' +
      (peut('caisse.corriger', c.id) ? '<div class="actions"><button class="btn ' + (auj >= decalerJour(fin, -1) || am < moisCycle() ? 'or' : 'clair') + '" type="button" data-a="cloturer-mois" data-centre="' + esc(c.id) + '" data-mois="' + esc(am) + '">' + ico('lock', 'p') + 'Clôturer et partager</button></div>'
        : '<p class="doux">La clôture revient au responsable ou à l\'administrateur.</p>') + '</div>';
  }

  /** Admin : retirer un mois passé des comptes (ex. octobre mal tenu) ; tout repart de zéro le 1er du mois suivant. */
  function blocRepartirZero(c, am) {
    if (!estAdmin() || am >= moisCycle() || clotureDe(c.id, am)) return '';
    var dep = moisSuivantIso(am) + '-01';
    if (debutComptes(c.id) >= dep) return '';
    return '<div class="carte repartir-zero"><h3>' + ico('refresh', 'p') + ' Repartir de zéro</h3><p class="doux">Si les comptes de ' + esc(libMoisAnnee(am)) + ' n\'ont pas été tenus (tout le monde encaissait sans verser au trésorier), ' +
      'retirez ce mois et ceux d\'avant des comptes des partenaires. Tout repart de zéro le ' + esc(dateLisible(dep, true)) + '. Les dettes des élèves (reliquats, insolvables) restent dues.</p>' +
      '<div class="actions"><button class="btn clair" type="button" data-a="repartir-zero" data-centre="' + esc(c.id) + '" data-v="' + esc(dep) + '">Retirer ' + esc(libMoisAnnee(am)) + ' des comptes</button></div></div>';
  }

  /** Admin : versements saisis en retard (cahier du mois passé entré ce mois-ci) → rattachés au mois passé. */
  function versementsRedatables(cid, am) {
    return lignes('paiements').filter(function (p) { return p.centre_id === cid && !Number(p.annule) && String(p.date || '').slice(0, 7) === am; })
      .sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : String(a.numero || '').localeCompare(String(b.numero || '')); });
  }
  function blocRedater(c, am) {
    if (!estAdmin() || am !== moisCycle() || !versementsRedatables(c.id, am).length) return '';
    var prec = decalerMois(am, -1);
    if (clotureDe(c.id, prec)) return '';
    return '<div class="carte redater"><h3>' + ico('calendar', 'p') + ' Versements saisis en retard ?</h3><p class="doux">Si des versements de ' + esc(libMoisAnnee(prec)) +
      ' ont été saisis ce mois-ci (cahier recopié en retard), rattachez-les à ' + esc(libMoisAnnee(prec)) + '. Vous décochez ceux qui sont vraiment de ' + esc(libMoisAnnee(am)) + '. ' +
      'Un versement rattaché par erreur : ouvrez son reçu (Caisse, ou fiche de l\'élève) et « Changer la date ».</p>' +
      '<div class="actions"><button class="btn clair" type="button" data-a="redater-versements" data-centre="' + esc(c.id) + '">Choisir les versements</button></div></div>';
  }
  function feuilleRedater(cid) {
    var am = moisCycle(), prec = decalerMois(am, -1), cible = finDuMois(prec + '-01');
    var l = versementsRedatables(cid, am), parJour = {};
    l.forEach(function (p) { (parJour[p.date] = parJour[p.date] || []).push(p); });
    var h = '<h2>Rattacher à ' + esc(libMoisAnnee(prec)) + '</h2><p class="doux">' + esc((ligne('centres', cid) || {}).nom || '') + ' · cochés : les versements de ' + esc(libMoisAnnee(prec)) +
      ' saisis en retard. <b>Décochez</b> ceux encaissés en ' + esc(libMoisAnnee(am)) + '. Rien d\'autre ne change (montant, reçu, élève) : ce que l\'élève doit reste exact.</p>' +
      '<form data-f="redater" data-centre="' + esc(cid) + '"><label class="champ"><span>Nouvelle date</span><input type="date" name="date" required min="' + esc(prec) + '-01" max="' + esc(cible) + '" value="' + esc(cible) + '"></label>' +
      '<label class="recherche"><span class="sr">Chercher un élève</span>' + ico('search') + '<input type="search" data-input="redater-filtre" placeholder="Chercher un élève (ex. : EWE)"></label>' +
      '<p class="actions"><button class="btn clair petit" type="button" data-a="redater-tout" data-v="1">Tout cocher</button><button class="btn clair petit" type="button" data-a="redater-tout" data-v="0">Tout décocher</button></p>';
    Object.keys(parJour).sort().forEach(function (j) {
      h += '<h3>' + esc(dateLisible(j, true)) + '</h3><div class="liste">' + parJour[j].map(function (p) {
        var e = ligne('eleves', p.eleve_id);
        return '<label class="case ligne-redater" data-nom="' + esc((e ? nomComplet(e) : '').toLowerCase()) + '"><input type="checkbox" name="pa" value="' + esc(p.id) + '" data-montant="' + esc(p.montant) + '" checked data-input="redater-total"> <span><b>' + esc(e ? nomComplet(e) : 'Élève') + '</b> · ' +
          fcfa(p.montant) + (p.numero ? ' <small>reçu ' + esc(p.numero) + '</small>' : '') + '</span></label>';
      }).join('') + '</div>';
    });
    h += '<div class="carte note-carte" id="restent"></div><div class="actions"><button class="btn or" type="submit" id="redater-ok">Rattacher</button><button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>';
    ouvrirFeuille(h);
    majTotalRedater();
  }
  function majTotalRedater() {
    var cases = Array.prototype.filter.call(document.querySelectorAll('#feuille input[name=pa]'), function (i) { return i.checked; });
    var tot = cases.reduce(function (s, i) { return s + Number(i.dataset.montant); }, 0), b = $('#redater-ok');
    if (b) b.textContent = 'Rattacher ' + cases.length + ' versement' + (cases.length > 1 ? 's' : '') + ' (' + fcfa(tot) + ')';
    var r = $('#restent');
    if (r) {
      var restent = restentRedater();
      r.innerHTML = '<b>Restent en ' + esc(libMoisAnnee(moisCycle())) + ' (' + restent.length + ')</b>' + (restent.length ? ' : ' + restent.map(function (x) { return esc(x.nom) + ' ' + fcfa(x.montant); }).join(', ') : ' : aucun. Décochez les versements vraiment encaissés ce mois-ci.');
    }
  }
  function restentRedater() {
    return Array.prototype.filter.call(document.querySelectorAll('#feuille input[name=pa]'), function (i) { return !i.checked; }).map(function (i) {
      var l = i.closest('label'); return { nom: l.querySelector('b').textContent, montant: Number(i.dataset.montant) };
    });
  }

  // ───────────────────────────── Rapports exportables ─────────────────────────────
  // Trois rapports, chacun à l'écran puis en PDF (A4, paginé entre deux lignes), en Excel (CSV
  // « ; » lisible par Excel et LibreOffice) ou en texte WhatsApp : insolvables, paiements par
  // mois et par classe (comme le cahier), rapport du trésorier (sommes perçues des partenaires,
  // sommes non versées). Un rapport = { titre, sous, colonnes, lignes, totaux, notes, paysage }.
  var RAP = { onglet: 'insolvables', centre: '', mois: '' };
  function centreRapports() {
    var dispo = centresChoisis().filter(function (c) { return peut('paiements.voir', c.id); });
    if (!dispo.some(function (c) { return c.id === RAP.centre; })) RAP.centre = dispo.length ? dispo[0].id : '';
    return { cid: RAP.centre, dispo: dispo };
  }
  function peutRapportTresorier(cid) { return estAdmin() || estTresorier(cid) || peut('finances.voir', cid); }

  function rapportInsolvables(cid) {
    var c = ligne('centres', cid) || {}, l = impayes(cid).slice().sort(function (a, b) {
      return nomDe('classes', a.e.classe_id).localeCompare(nomDe('classes', b.e.classe_id), 'fr') || b.ech.impaye - a.ech.impaye; });
    var lignesR = [], classeCour = null, sousTot = 0, total = 0;
    var fermer = function () { if (classeCour !== null) lignesR.push({ total: true, cellules: ['Sous-total ' + classeCour, '', '', fcfa(sousTot), ''] }); };
    l.forEach(function (x) {
      var k = nomDe('classes', x.e.classe_id) || '—';
      if (k !== classeCour) { fermer(); classeCour = k; sousTot = 0; lignesR.push({ groupe: k }); }
      sousTot += x.ech.impaye; total += x.ech.impaye;
      lignesR.push({ cellules: [nomComplet(x.e), k, x.ech.moisImpayes.map(function (it) { return it.court + (it.paye ? ' (reste ' + fcfa(it.montant - it.paye) + ')' : ''); }).join(', '),
        fcfa(x.ech.impaye), telLisible(x.e.parent_whatsapp || x.e.parent_tel) || '—'], danger: true });
    });
    fermer();
    return { cle: 'insolvables', titre: 'Liste des insolvables', sous: (c.nom || '') + ' · au ' + dateLisible(isoLocal(new Date()), true), paysage: false,
      colonnes: [{ lib: 'Élève', l: 30 }, { lib: 'Classe', l: 14 }, { lib: 'Échéances impayées', l: 28 }, { lib: 'Montant dû', l: 13, d: true }, { lib: 'Téléphone', l: 15 }],
      lignes: lignesR, totaux: ['Total · ' + l.length + ' élève' + (l.length > 1 ? 's' : ''), '', '', fcfa(total), ''],
      notes: ['Impayé = échéances passées non couvertes. Les versements s\'imputent du plus ancien dû au plus récent : un trop-versé avance le mois suivant.'] };
  }

  function rapportPaiementsClasses(cid) {
    var c = ligne('centres', cid) || {}, mois = moisDeLAnnee();
    var cols = [{ lib: 'Élève', l: 22 }, { lib: 'Insc.', l: 7, d: true }].concat(mois.map(function (am) { return { lib: MOIS_COURTS[Number(am.slice(5)) - 1].replace('.', ''), l: 6.5, d: true }; }))
      .concat([{ lib: 'Payé', l: 9, d: true }, { lib: 'Doit', l: 8, d: true }]);
    var lignesR = [], totG = { paye: 0, doit: 0, cols: [] };
    lignes('classes').filter(function (k) { return k.centre_id === cid; }).sort(function (a, b) { return String(a.nom).localeCompare(String(b.nom), 'fr'); }).forEach(function (k) {
      var els = elevesActifs(cid).filter(function (e) { return e.classe_id === k.id; }).sort(function (a, b) { return nomComplet(a).localeCompare(nomComplet(b), 'fr'); });
      if (!els.length) return;
      lignesR.push({ groupe: k.nom + ' · ' + els.length + ' élève' + (els.length > 1 ? 's' : '') + (k.mensualite ? ' · ' + fcfa(k.mensualite) + '/mois' : '') });
      var totC = { paye: 0, doit: 0, cols: [] };
      els.forEach(function (e) {
        var ech = echeancier(e), parCle = {};
        ech.items.forEach(function (it) { parCle[it.cle] = it; });
        var cells = ['insc'].concat(mois).map(function (cle, i) {
          var it = parCle[cle]; var v = it ? it.paye : 0;
          totC.cols[i] = (totC.cols[i] || 0) + v; totG.cols[i] = (totG.cols[i] || 0) + v;
          return !it ? '' : v ? fcfa(v).replace(/ F$/, '') : (it.echeance < isoLocal(new Date()) ? '0' : '');
        });
        totC.paye += ech.paye; totC.doit += ech.impaye; totG.paye += ech.paye; totG.doit += ech.impaye;
        lignesR.push({ cellules: [nomComplet(e)].concat(cells).concat([fcfa(ech.paye).replace(/ F$/, ''), ech.impaye ? fcfa(ech.impaye).replace(/ F$/, '') : '']), danger: ech.impaye > 0 });
      });
      lignesR.push({ total: true, cellules: ['Total ' + k.nom].concat(totC.cols.map(function (v) { return v ? fcfa(v).replace(/ F$/, '') : ''; })).concat([fcfa(totC.paye).replace(/ F$/, ''), totC.doit ? fcfa(totC.doit).replace(/ F$/, '') : '']) });
    });
    return { cle: 'paiements', titre: 'Paiements par mois et par classe', sous: (c.nom || '') + ' · année ' + ((anneeActive() || {}).libelle || '') + ' · montants en F CFA', paysage: true,
      colonnes: cols, lignes: lignesR,
      totaux: ['Total du centre'].concat(totG.cols.map(function (v) { return v ? fcfa(v).replace(/ F$/, '') : ''; })).concat([fcfa(totG.paye).replace(/ F$/, ''), fcfa(totG.doit).replace(/ F$/, '')]),
      notes: ['Chaque case montre ce qui couvre l\'échéance (inscription, puis chaque mois, dans l\'ordre). « 0 » : échéance passée, rien de payé. Vide : pas encore due. En rouge : l\'élève doit.'].concat(debutComptes(cid) ? ['Les comptes des partenaires repartent de zéro le ' + dateLisible(debutComptes(cid), true) +
        ' : les versements d\'avant ne servent ici qu\'à calculer ce que chaque élève doit encore.'] : []) };
  }

  function rapportTresorier(cid, am) {
    var c = ligne('centres', cid) || {}, tres = tresorierDe(cid), lignesR = [], t = { enc: 0, dep: 0, conf: 0, att: 0, cont: 0, reste: 0 };
    comptesFonds(cid, am).forEach(function (uid) {
      var x = soldeFonds(uid, cid, am), estT = uid === tres;
      var cont = remisesDu(cid).filter(function (r) { return r.remis_par === uid && r.statut === 'contestee' && dansMois(r, am); }).reduce(function (s, r) { return s + Number(r.montant); }, 0);
      t.enc += x.encaisse; t.dep += x.depenses;
      if (!estT) { t.conf += x.confirme; t.att += x.attente; t.cont += cont; t.reste += Math.max(0, x.reste); }
      lignesR.push({ cellules: [nomCompte(uid) + (estT ? ' (trésorier)' : ''), fcfa(x.encaisse), fcfa(x.depenses), estT ? '—' : fcfa(x.confirme), estT ? '—' : (x.attente ? fcfa(x.attente) : ''), estT ? '—' : (cont ? fcfa(cont) : ''),
        estT ? 'garde ' + fcfa(x.encaisse - x.depenses) : fcfa(Math.max(0, x.reste))], danger: !estT && x.reste > 0 });
    });
    var chezT = t.conf + (tres ? (function () { var x = soldeFonds(tres, cid, am); return x.encaisse - x.depenses; })() : 0);
    var detail = remisesDu(cid).filter(function (r) { return dansMois(r, am); }).map(function (r) {
      return { cellules: [nomCompte(r.remis_par), dateLisible(r.date, true), (MODES[r.mode] || r.mode || '') + (r.note ? ' · ' + r.note : ''), fcfa(r.montant), '', '', (LIB_STATUT_REMISE[r.statut || 'en_attente'] || ['?'])[0] + (r.motif ? ' : ' + r.motif : '')], danger: r.statut === 'contestee' };
    });
    if (detail.length) lignesR = lignesR.concat([{ groupe: 'Détail des remises du mois' }]).concat(detail);
    var k = clotureDe(cid, am);
    return { cle: 'tresorier', titre: 'Rapport du trésorier · ' + libMoisAnnee(am), sous: (c.nom || '') + ' · trésorier : ' + (tres ? nomCompte(tres) : 'non désigné') + (k ? ' · mois clôturé' : ' · mois en cours'), paysage: true,
      colonnes: [{ lib: 'Partenaire', l: 22 }, { lib: 'Encaissé', l: 12, d: true }, { lib: 'Dépenses et paies', l: 13, d: true }, { lib: 'Remis (reçu)', l: 12, d: true }, { lib: 'À confirmer', l: 12, d: true }, { lib: 'Pas reçu', l: 11, d: true }, { lib: 'Non versé', l: 18, d: true }],
      lignes: lignesR, totaux: ['Total', fcfa(t.enc), fcfa(t.dep), fcfa(t.conf), fcfa(t.att), fcfa(t.cont), fcfa(t.reste)],
      notes: ['Fonds chez le trésorier : ' + fcfa(chezT) + ' (remises reçues + ses propres encaissements nets).', 'Encore chez les partenaires (non versé) : ' + fcfa(t.reste) + (t.att ? ' · remises en attente de confirmation : ' + fcfa(t.att) : '') + '.',
        'Non versé = encaissé − dépenses et paies − remises (reçues ou à confirmer), pour le mois.'].concat(debutComptes(cid) && am <= debutComptes(cid).slice(0, 7)
        ? ['Les comptes repartent de zéro le ' + dateLisible(debutComptes(cid), true) + ' : rien d\'avant n\'est compté.'] : []) };
  }

  /** Tableau HTML d'un rapport (écran). */
  function htmlRapport(r) {
    return '<div class="tableau-defile"><table class="rapport"><thead><tr>' + r.colonnes.map(function (c) { return '<th' + (c.d ? ' class="d"' : '') + '>' + esc(c.lib) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      (r.lignes.length ? r.lignes.map(function (l) {
        if (l.groupe) return '<tr class="groupe"><td colspan="' + r.colonnes.length + '">' + esc(l.groupe) + '</td></tr>';
        return '<tr class="' + (l.total ? 'sous-total' : '') + (l.danger ? ' doit' : '') + '">' + l.cellules.map(function (v, i) { return '<td' + (r.colonnes[i] && r.colonnes[i].d ? ' class="d"' : '') + '>' + esc(v) + '</td>'; }).join('') + '</tr>';
      }).join('') : '<tr><td colspan="' + r.colonnes.length + '" class="vide">Rien à signaler.</td></tr>') +
      '</tbody><tfoot><tr>' + r.totaux.map(function (v, i) { return '<td' + (r.colonnes[i] && r.colonnes[i].d ? ' class="d"' : '') + '>' + esc(v) + '</td>'; }).join('') + '</tr></tfoot></table></div>' +
      (r.notes || []).map(function (n) { return '<p class="doux">' + esc(n) + '</p>'; }).join('');
  }

  /** Dessin du rapport sur toile (même habillage que les reçus) ; coupures = lignes où paginer. */
  function dessinerRapport(r, logo) {
    var L = r.paysage ? 1754 : 1240, M = 56, H0 = 200 + 52 * (r.lignes.length + 8) + 60 * (r.notes || []).length + 200;
    var cv = document.createElement('canvas'); cv.width = L; cv.height = H0;
    var g = cv.getContext('2d'), c = ligne('centres', RAP.centre) || {}, coupures = [];
    g.fillStyle = '#fff'; g.fillRect(0, 0, L, H0);
    g.fillStyle = '#0C2A6A'; g.fillRect(0, 0, L, 150);
    if (logo) g.drawImage(logo, M, 25, 100, 100);
    g.fillStyle = '#fff'; g.font = '600 38px Poppins, sans-serif'; g.fillText(texteCoupe(g, r.titre, L - 2 * M - 130), M + 125, 72);
    g.font = '400 22px Poppins, sans-serif'; g.fillStyle = '#C9D6F2'; g.fillText(texteCoupe(g, r.sous, L - 2 * M - 130), M + 125, 112);
    g.fillStyle = '#FFC93C'; g.fillRect(0, 150, L, 6);
    var total = r.colonnes.reduce(function (s, x) { return s + x.l; }, 0), xs = [], x = M, largeurs = r.colonnes.map(function (col) { return (L - 2 * M) * col.l / total; });
    largeurs.forEach(function (w) { xs.push(x); x += w; });
    var y = 200, fs = r.paysage ? 19 : 20;
    var rangee = function (cells, style) {
      if (style.fond) { g.fillStyle = style.fond; g.fillRect(M, y - 32, L - 2 * M, 46); }
      g.font = (style.gras ? '600 ' : '400 ') + fs + 'px Poppins, sans-serif';
      cells.forEach(function (v, i) {
        g.fillStyle = style.coul || (style.danger && i === 0 ? '#B42318' : '#001136');
        var w = largeurs[i] - 12, t = texteCoupe(g, String(v == null ? '' : v), w);
        if (r.colonnes[i] && r.colonnes[i].d) { g.textAlign = 'right'; g.fillText(t, xs[i] + largeurs[i] - 6, y); g.textAlign = 'left'; } else g.fillText(t, xs[i] + 6, y);
      });
      g.fillStyle = '#E1E6F0'; g.fillRect(M, y + 14, L - 2 * M, 1);
      y += 46; coupures.push(y - 34);
    };
    rangee(r.colonnes.map(function (c2) { return c2.lib; }), { gras: true, fond: '#EEF3FC', coul: '#0C2A6A' });
    var zebre = false;
    r.lignes.forEach(function (l) {
      if (l.groupe) { g.fillStyle = '#0C2A6A'; g.font = '600 ' + (fs + 2) + 'px Poppins, sans-serif'; y += 10; g.fillText(texteCoupe(g, l.groupe, L - 2 * M), M + 6, y); y += 40; coupures.push(y - 34); zebre = false; return; }
      rangee(l.cellules, { gras: l.total, fond: l.total ? '#FFF6DA' : (zebre ? '#F7F9FC' : null), danger: l.danger });
      zebre = !zebre;
    });
    rangee(r.totaux, { gras: true, fond: '#0C2A6A', coul: '#fff' });
    y += 20;
    g.font = '400 18px Poppins, sans-serif'; g.fillStyle = '#4D5163';
    (r.notes || []).forEach(function (n) { g.fillText(texteCoupe(g, n, L - 2 * M), M, y); y += 34; coupures.push(y - 20); });
    y += 30; g.fillStyle = '#6B7185'; g.font = '400 17px Poppins, sans-serif';
    g.fillText('VÉRITAS Gestion · ' + (c.nom || '') + ' · édité le ' + new Date().toLocaleDateString('fr-FR') + ' par ' + E.profil.utilisateur.nom, M, y); y += 30;
    var fin = document.createElement('canvas'); fin.width = L; fin.height = Math.min(y, H0);
    fin.getContext('2d').drawImage(cv, 0, 0);
    return { cv: fin, coupures: coupures };
  }
  function nomFichierRapport(r, ext) {
    var c = ligne('centres', RAP.centre) || {};
    return (r.cle + '-' + (c.nom_court || c.nom || 'centre') + '-' + isoLocal(new Date())).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9-]+/g, '-').replace(/-+/g, '-') + '.' + ext;
  }
  function fichierRapport(r, format) {
    if (format === 'csv') {
      var q = function (v) { v = String(v == null ? '' : v).replace(/ /g, ' '); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
      var lignesCsv = [[r.titre], [r.sous], [], r.colonnes.map(function (c) { return c.lib; })]
        .concat(r.lignes.map(function (l) { return l.groupe ? [l.groupe] : l.cellules; })).concat([r.totaux, []]).concat((r.notes || []).map(function (n) { return [n]; }));
      var txt = '﻿' + lignesCsv.map(function (l) { return l.map(q).join(';'); }).join('\r\n');
      return Promise.resolve(new File([txt], nomFichierRapport(r, 'csv'), { type: 'text/csv' }));
    }
    return Promise.all([chargerLogo(), document.fonts ? document.fonts.load('600 24px Poppins') : null]).then(function (res) {
      var d = dessinerRapport(r, res[0]);
      if (format === 'png') return versBlob(d.cv, 'image/png').then(function (b) { return new File([b], nomFichierRapport(r, 'png'), { type: 'image/png' }); });
      var LP = d.cv.width, HP = r.paysage ? 1240 : 1754, pages = [], haut = 0;
      while (haut < d.cv.height) {
        var bas = haut + HP;
        if (bas < d.cv.height) { var sures = d.coupures.filter(function (y) { return y > haut + 300 && y <= bas; }); if (sures.length) bas = sures[sures.length - 1]; }
        var pg = document.createElement('canvas'); pg.width = LP; pg.height = HP;
        var gp = pg.getContext('2d'); gp.fillStyle = '#fff'; gp.fillRect(0, 0, LP, HP);
        var h = Math.min(bas, d.cv.height) - haut;
        gp.drawImage(d.cv, 0, haut, LP, h, 0, 0, LP, h);
        pages.push(pg); haut = bas;
      }
      return Promise.all(pages.map(function (cv) { return versBlob(cv, 'image/jpeg', 0.9).then(function (b) { return b.arrayBuffer(); }).then(function (a) { return { cv: cv, jpeg: new Uint8Array(a) }; }); }))
        .then(function (p) { return new File([pdfDepuisJpeg(p, r.paysage ? 841.89 : 595.28, r.paysage ? 595.28 : 841.89)], nomFichierRapport(r, 'pdf'), { type: 'application/pdf' }); });
    });
  }
  function texteRapport(r) {
    var l = ['*' + r.titre + '*', r.sous, ''];
    r.lignes.forEach(function (x) { if (x.groupe) l.push('', '*' + x.groupe + '*'); else l.push('• ' + x.cellules.filter(function (v) { return v !== '' && v !== '—'; }).join(' · ')); });
    l.push('', '*' + r.totaux.filter(Boolean).join(' · ') + '*');
    return l.join('\n').replace(/ /g, ' ');
  }
  function rapportCourant(cid) {
    if (RAP.onglet === 'paiements') return rapportPaiementsClasses(cid);
    if (RAP.onglet === 'tresorier') return rapportTresorier(cid, RAP.mois || moisCycle());
    return rapportInsolvables(cid);
  }

  function pageRapports() {
    var cc = centreRapports(), cid = cc.cid;
    var h = '<h1>Rapports</h1><p class="sous-titre">À l\'écran, puis en PDF, en Excel ou par WhatsApp.</p>';
    if (cc.dispo.length > 1) h += '<div class="puces">' + cc.dispo.map(function (c) { return '<button type="button" class="puce' + (c.id === cid ? ' on' : '') + '" data-a="rap-centre" data-v="' + esc(c.id) + '">' + esc(c.nom_court || c.nom) + '</button>'; }).join('') + '</div>';
    if (!cid) return h + '<div class="carte vide">Aucun centre.</div>';
    var onglets = [['insolvables', 'Insolvables'], ['paiements', 'Par mois et classe']];
    if (peutRapportTresorier(cid)) onglets.push(['tresorier', 'Trésorier']);
    if (!onglets.some(function (o) { return o[0] === RAP.onglet; })) RAP.onglet = 'insolvables';
    h += '<div class="onglets">' + onglets.map(function (o) { return '<button type="button" class="' + (RAP.onglet === o[0] ? 'on' : '') + '" data-a="rap-onglet" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';
    if (RAP.onglet === 'tresorier') {
      RAP.mois = RAP.mois || moisCycle();
      h += '<div class="nav-date"><button type="button" class="btn clair petit" data-a="rap-mois" data-v="-1" aria-label="Mois précédent">‹</button><b>' + esc(libMoisAnnee(RAP.mois).replace(/^./, function (x) { return x.toUpperCase(); })) + '</b>' +
        '<button type="button" class="btn clair petit" data-a="rap-mois" data-v="1"' + (RAP.mois >= moisCycle() ? ' disabled' : '') + ' aria-label="Mois suivant">›</button></div>';
    }
    var r = rapportCourant(cid);
    h += '<div class="actions export-rapport"><button class="btn or" type="button" data-a="export-rapport" data-v="pdf">' + ico('doc', 'p') + 'PDF</button>' +
      '<button class="btn clair" type="button" data-a="export-rapport" data-v="csv">' + ico('download', 'p') + 'Excel</button>' +
      '<button class="btn clair" type="button" data-a="export-rapport" data-v="png">' + ico('camera', 'p') + 'Image</button>' +
      '<button class="btn clair" type="button" data-a="export-rapport" data-v="texte">' + ico('message', 'p') + 'WhatsApp</button></div>';
    return h + '<h2>' + esc(r.titre) + '</h2><p class="doux">' + esc(r.sous) + '</p>' + htmlRapport(r);
  }

  // ───────────────────────────── Cahier de textes (consultation) ─────────────────────────────
  // Ce qui a été fait et le travail donné sont saisis dans la feuille d'appel de chaque séance
  // (table « seances » : contenu, travail). Ici on les relit, classe par classe, du plus récent au
  // plus ancien, et on les exporte (PDF paginé, Excel, WhatsApp). L'enseignant ne voit que ses classes.
  var CDT = { centre: '', classe: '', mode: 'classe', enseignant: '' };
  function classesVisiblesCahier(cid) {
    var l = lignes('classes').filter(function (k) { return k.centre_id === cid; });
    if (!estAdmin() && roleDans(cid) === 'enseignant') {
      var moi = E.profil.utilisateur.id;
      l = l.filter(function (k) { return lignes('creneaux').some(function (c) { return c.classe_id === k.id && c.enseignant_id === moi; }) || lignes('seances').some(function (se) { return se.classe_id === k.id && se.ouverte_par === moi; }); });
    }
    return l.sort(function (a, b) { return String(a.nom).localeCompare(String(b.nom), 'fr'); });
  }
  function entreesCahier(cid, classeId) {
    var ids = classesVisiblesCahier(cid).map(function (k) { return k.id; });
    return lignes('seances').filter(function (s) {
      return s.centre_id === cid && ids.indexOf(s.classe_id) >= 0 && (!classeId || s.classe_id === classeId) && (String(s.contenu || '').trim() || String(s.travail || '').trim());
    }).sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : String(a.debut || '').localeCompare(String(b.debut || '')); }).map(function (s) {
      var crs = lignes('creneaux').filter(function (c) { return c.classe_id === s.classe_id && Number(c.jour) === jourDe(s.date); });
      var ens = {};
      crs.forEach(function (c) {
        var pe = ligne('presences_ens', idPresenceEns(s.date, c.id));
        if (pe && pe.statut === 'remplace' && pe.remplacant_id) ens[pe.remplacant_id] = 1; else if (c.enseignant_id) ens[c.enseignant_id] = 1;
      });
      // Celui qui a ouvert la séance, s'il est enseignant du centre (appel hors emploi du temps).
      if (s.ouverte_par && enseignantsDu(s.centre_id).some(function (e) { return e.id === s.ouverte_par; })) ens[s.ouverte_par] = 1;
      return { s: s, ens: Object.keys(ens), classe: nomDe('classes', s.classe_id), matieres: crs.map(function (c) { return nomDe('matieres', c.matiere_id); }).filter(Boolean).join(', '),
        profs: crs.map(function (c) { return nomPersonne(c.enseignant_id); }).filter(Boolean).filter(function (v, i, t) { return t.indexOf(v) === i; }).join(', ') };
    });
  }
  /** Progression d'un enseignant : ses séances écrites (cours du jour ou remplacement), récentes d'abord. */
  function entreesEnseignant(cid, uid) { return entreesCahier(cid, '').filter(function (x) { return x.ens.indexOf(uid) >= 0; }); }
  /** « À reprendre » : la dernière séance écrite (fait + travail donné), pour la continuité. */
  function blocAReprendre(l, quoi) {
    if (!l.length) return '';
    var d = l[0], dt = l.filter(function (x) { return String(x.s.travail || '').trim(); })[0];
    return '<div class="carte a-reprendre"><h3>' + ico('bookopen', 'p') + ' À reprendre' + (quoi ? ' · ' + esc(quoi) : '') + '</h3>' +
      '<p><span class="etiquette">Dernier cours</span>' + esc(dateLisible(d.s.date, true) + ' · ' + d.classe + (d.matieres ? ' · ' + d.matieres : '')) + '</p>' +
      (d.s.contenu ? '<p class="doux">' + esc(d.s.contenu) + '</p>' : '') +
      (dt ? '<p><span class="etiquette travail">Travail donné</span>' + esc(dateLisible(dt.s.date, true) + ' · ' + dt.classe) + '</p><p class="doux">' + esc(dt.s.travail) + '</p>' : '<p class="doux">Aucun travail donné noté.</p>') + '</div>';
  }
  function pageCahier() {
    var dispo = centresChoisis();
    if (!dispo.some(function (c) { return c.id === CDT.centre; })) CDT.centre = dispo.length ? dispo[0].id : '';
    var cid = CDT.centre;
    var h = '<h1>Cahier de textes</h1><p class="sous-titre">Ce qui a été fait et le travail donné, séance par séance. Saisie : dans la feuille d\'appel de la séance.</p>';
    if (dispo.length > 1) h += '<div class="puces">' + dispo.map(function (c) { return '<button type="button" class="puce' + (c.id === cid ? ' on' : '') + '" data-a="cdt-centre" data-v="' + esc(c.id) + '">' + esc(c.nom_court || c.nom) + '</button>'; }).join('') + '</div>';
    if (!cid) return h + '<div class="carte vide">Aucun centre.</div>';
    var classes = classesVisiblesCahier(cid);
    if (CDT.classe && !classes.some(function (k) { return k.id === CDT.classe; })) CDT.classe = '';
    var estProf = !estAdmin() && roleDans(cid) === 'enseignant';
    if (!estProf) h += '<div class="onglets"><button type="button" class="' + (CDT.mode !== 'enseignant' ? 'on' : '') + '" data-a="cdt-mode" data-v="classe">Par classe</button><button type="button" class="' + (CDT.mode === 'enseignant' ? 'on' : '') + '" data-a="cdt-mode" data-v="enseignant">Par enseignant</button></div>';
    if (estProf || CDT.mode === 'enseignant') {
      var profsC = estProf ? [{ id: E.profil.utilisateur.id, nom: E.profil.utilisateur.nom }] : enseignantsDu(cid);
      if (!profsC.some(function (e) { return e.id === CDT.enseignant; })) CDT.enseignant = profsC.length ? profsC[0].id : '';
      if (!estProf) h += '<div class="puces">' + profsC.map(function (e) {
        return '<button type="button" class="puce' + (CDT.enseignant === e.id ? ' on' : '') + '" data-a="cdt-enseignant" data-v="' + esc(e.id) + '">' + esc(e.nom) + ' · ' + entreesEnseignant(cid, e.id).length + '</button>';
      }).join('') + '</div>';
      if (!CDT.enseignant) return h + '<div class="carte vide">Aucun enseignant dans ce centre.</div>';
      var le = entreesEnseignant(cid, CDT.enseignant), nomE = estProf ? 'Ma progression' : 'Progression de ' + (nomPersonne(CDT.enseignant) || 'l\'enseignant');
      h += '<h2>' + esc(nomE) + ' · ' + le.length + ' séance' + (le.length > 1 ? 's' : '') + ' écrite' + (le.length > 1 ? 's' : '') + '</h2>' + blocAReprendre(le, '');
      if (le.length) h += '<div class="actions export-rapport"><button class="btn or" type="button" data-a="export-cahier" data-v="pdf">' + ico('doc', 'p') + 'PDF</button><button class="btn clair" type="button" data-a="export-cahier" data-v="csv">' + ico('download', 'p') + 'Excel</button><button class="btn clair" type="button" data-a="export-cahier" data-v="texte">' + ico('message', 'p') + 'WhatsApp</button></div>';
      return h + (le.length ? '<div class="cahier">' + le.map(carteCahier).join('') + '</div>' : '<div class="carte vide">Rien d\'écrit pour cet enseignant. Le cahier se remplit dans la feuille d\'appel de ses cours.</div>');
    }
    // Seules les classes qui ont déjà une séance écrite (et celle choisie) : pas de rangée de « · 0 ».
    h += '<div class="puces">' + [['', 'Toutes']].concat(classes.map(function (k) { return [k.id, k.nom]; })).map(function (k) {
      var n = entreesCahier(cid, k[0]).length;
      if (k[0] && !n && CDT.classe !== k[0]) return '';
      return '<button type="button" class="puce' + (CDT.classe === k[0] ? ' on' : '') + '" data-a="cdt-classe" data-v="' + esc(k[0]) + '">' + esc(k[1]) + ' · ' + n + '</button>';
    }).join('') + '</div>';
    var l = entreesCahier(cid, CDT.classe);
    if (CDT.classe) h += blocAReprendre(l, nomDe('classes', CDT.classe));
    if (l.length) h += '<div class="actions export-rapport"><button class="btn or" type="button" data-a="export-cahier" data-v="pdf">' + ico('doc', 'p') + 'PDF</button>' +
      '<button class="btn clair" type="button" data-a="export-cahier" data-v="csv">' + ico('download', 'p') + 'Excel</button>' +
      '<button class="btn clair" type="button" data-a="export-cahier" data-v="texte">' + ico('message', 'p') + 'WhatsApp</button></div>';
    h += l.length ? '<div class="cahier">' + l.map(carteCahier).join('') + '</div>' : '<div class="carte vide">Rien d\'écrit pour l\'instant. Ouvrez la feuille d\'appel d\'une séance (Appel) : en bas, « Cahier de textes ».</div>';
    return h;
  }
  function carteCahier(x) {
    return '<a class="carte entree-cahier" href="#/pointage/' + encodeURIComponent(x.s.classe_id) + '/' + esc(x.s.date) + '">' +
      '<div class="haut"><b>' + esc(dateLongue(x.s.date).replace(/^./, function (c) { return c.toUpperCase(); }) + ' ' + x.s.date.slice(0, 4)) + '</b><span class="badge">' + esc(x.classe) + '</span></div>' +
      '<small>' + esc([x.s.debut && x.s.fin ? heureLisible(x.s.debut) + ' – ' + heureLisible(x.s.fin) : '', x.matieres, x.profs].filter(Boolean).join(' · ')) + '</small>' +
      (x.s.contenu ? '<p><span class="etiquette">Fait</span>' + esc(x.s.contenu).replace(/\n/g, '<br>') + '</p>' : '') +
      (x.s.travail ? '<p><span class="etiquette travail">Travail</span>' + esc(x.s.travail).replace(/\n/g, '<br>') + '</p>' : '') + '</a>';
  }
  function texteCahier(l, titre) {
    return ['*' + titre + '*'].concat(l.map(function (x) {
      return '\n*' + dateLisible(x.s.date, true) + ' · ' + x.classe + (x.matieres ? ' · ' + x.matieres : '') + '*' + (x.s.contenu ? '\nFait : ' + x.s.contenu : '') + (x.s.travail ? '\nTravail : ' + x.s.travail : '');
    })).join('\n');
  }
  /** PDF A4 : paragraphes avec retour à la ligne (le texte n'est jamais coupé). */
  function pdfCahier(l, titre, sous) {
    return Promise.all([chargerLogo(), document.fonts ? document.fonts.load('600 24px Poppins') : null]).then(function (res) {
      var L = 1240, HP = 1754, M = 70, larg = L - 2 * M, pages = [], cv, g, y;
      var nouvelle = function (premiere) {
        cv = document.createElement('canvas'); cv.width = L; cv.height = HP; g = cv.getContext('2d');
        g.fillStyle = '#fff'; g.fillRect(0, 0, L, HP);
        if (premiere) {
          g.fillStyle = '#0C2A6A'; g.fillRect(0, 0, L, 150); if (res[0]) g.drawImage(res[0], M, 25, 100, 100);
          g.fillStyle = '#fff'; g.font = '600 38px Poppins, sans-serif'; g.fillText(texteCoupe(g, titre, larg - 130), M + 125, 72);
          g.font = '400 22px Poppins, sans-serif'; g.fillStyle = '#C9D6F2'; g.fillText(texteCoupe(g, sous, larg - 130), M + 125, 112);
          g.fillStyle = '#FFC93C'; g.fillRect(0, 150, L, 6); y = 210;
        } else y = 80;
        pages.push(cv);
      };
      var lignesDe = function (t, police) {
        g.font = police; var out = [];
        String(t || '').split(/\n/).forEach(function (par) {
          var mots = par.split(' '), cour = '';
          mots.forEach(function (m) { var essai = cour ? cour + ' ' + m : m; if (g.measureText(essai).width > larg - 20 && cour) { out.push(cour); cour = m; } else cour = essai; });
          out.push(cour);
        });
        return out;
      };
      nouvelle(true);
      l.forEach(function (x) {
        var tete = dateLisible(x.s.date, true) + ' · ' + x.classe + (x.matieres ? ' · ' + x.matieres : '') + (x.profs ? ' · ' + x.profs : '');
        var fait = x.s.contenu ? lignesDe('Fait : ' + x.s.contenu, '400 22px Poppins, sans-serif') : [];
        var trav = x.s.travail ? lignesDe('Travail : ' + x.s.travail, '400 22px Poppins, sans-serif') : [];
        var haut = 44 + 32 * (fait.length + trav.length) + 30;
        if (y + haut > HP - 60) nouvelle(false);
        g.fillStyle = '#EEF3FC'; g.fillRect(M, y - 30, larg, 42);
        g.fillStyle = '#0C2A6A'; g.font = '600 22px Poppins, sans-serif'; g.fillText(texteCoupe(g, tete, larg - 20), M + 10, y); y += 44;
        g.font = '400 22px Poppins, sans-serif'; g.fillStyle = '#001136';
        fait.forEach(function (t) { g.fillText(t, M + 10, y); y += 32; });
        g.fillStyle = '#9A5B00'; trav.forEach(function (t) { g.fillText(t, M + 10, y); y += 32; });
        y += 30;
      });
      pages.forEach(function (p, i) { var gp = p.getContext('2d'); gp.font = '400 16px Poppins, sans-serif'; gp.fillStyle = '#6B7185'; gp.fillText('VÉRITAS Gestion · cahier de textes · page ' + (i + 1) + '/' + pages.length, M, HP - 30); });
      return Promise.all(pages.map(function (c) { return versBlob(c, 'image/jpeg', 0.9).then(function (b) { return b.arrayBuffer(); }).then(function (a) { return { cv: c, jpeg: new Uint8Array(a) }; }); }));
    }).then(function (p) { return new File([pdfDepuisJpeg(p, 595.28, 841.89)], 'cahier-de-textes-' + isoLocal(new Date()) + '.pdf', { type: 'application/pdf' }); });
  }

  // ───────────────────────────── Agenda, rappels et notifications ─────────────────────────────
  // Rendez-vous et rencontres saisis par le centre (table « evenements »), plus ce que le
  // téléphone DÉDUIT : l'échéance des mensualités (jour d'échéance du centre, mois facturés),
  // la rentrée et la fin de l'année. La cloche de l'en-tête rassemble ce qui demande
  // attention ; les rappels du téléphone partent quand l'appli est ouverte, et l'export
  // « Ajouter au calendrier du téléphone » (.ics avec alarme) rappelle même appli fermée.
  var TYPES_EV = {
    rencontre: ['Rencontre', 'handshake'], rendez_vous: ['Rendez-vous', 'clock'], reunion_parents: ['Réunion des parents', 'users'],
    echeance: ['Échéance', 'wallet'], autre: ['Autre', 'agenda']
  };
  var RAPPELS = [[0, 'Aucun rappel'], [15, '15 minutes avant'], [60, '1 heure avant'], [180, '3 heures avant'], [1440, 'La veille'], [2880, '2 jours avant']];
  var AG = { mois: '', jour: '' };
  function peutAgenda(cid) { return peut('agenda.gerer', cid); }
  function centresAgendaGeres() { return lignes('centres').filter(function (c) { return peutAgenda(c.id); }); }
  function moisSuivantIso(am) { return decalerMois(am, 1); }

  /** Tout ce que l'agenda montre entre deux dates (incluses), pour les centres choisis. */
  function elementsAgenda(debut, fin) {
    var ids = centresChoisis().map(function (c) { return c.id; });
    var out = lignes('evenements').filter(function (e) { return ids.indexOf(e.centre_id) >= 0 && e.date >= debut && e.date <= fin; }).map(function (e) {
      return { id: e.id, type: e.type || 'rencontre', titre: e.titre, date: e.date, heure: e.heure || '', fin: e.fin || '', lieu: e.lieu || '', note: e.note || '',
        rappel_min: Number(e.rappel_min) || 0, centre_id: e.centre_id, attente: !!e._attente };
    });
    var an = anneeActive();
    var factures = an ? String(an.mois_factures || '').split(',').filter(Boolean).map(Number) : [];
    centresChoisis().forEach(function (c) {
      if (!peut('paiements.voir', c.id)) return;
      var j = ('0' + (Number(c.jour_echeance) || 10)).slice(-2);
      for (var am = debut.slice(0, 7); am <= fin.slice(0, 7); am = moisSuivantIso(am)) {
        var d = am + '-' + j;
        if (d < debut || d > fin) continue;
        if (factures.length && factures.indexOf(Number(am.slice(5))) < 0) continue;
        if (an && an.debut && an.fin && (d < an.debut || d > an.fin)) continue;
        out.push({ id: 'ech-' + c.id + '-' + am, auto: true, type: 'echeance', titre: 'Échéance des mensualités', date: d, heure: '', lieu: '', rappel_min: 1440, centre_id: c.id, lien: '#/caisse',
          note: 'Les paiements du mois de ' + MOIS[Number(am.slice(5)) - 1] + ' se font au plus tard ce jour.' });
      }
    });
    centresChoisis().forEach(function (c) {
      if (!peut('finances.voir', c.id)) return;
      for (var am2 = debut.slice(0, 7); am2 <= fin.slice(0, 7); am2 = moisSuivantIso(am2)) {
        var d2 = finDuMois(am2 + '-01');
        if (d2 < debut || d2 > fin || clotureDe(c.id, am2)) continue;
        out.push({ id: 'clo-' + c.id + '-' + am2, auto: true, type: 'echeance', titre: 'Comptes et partage du mois', date: d2, heure: '', lieu: '', rappel_min: 1440, centre_id: c.id, lien: '#/bilan',
          note: 'Clôture de ' + libMoisAnnee(am2) + ' : résultat, part de chaque actionnaire ; un nouveau cycle commence le lendemain.' });
      }
    });
    centresChoisis().forEach(function (c) {
      if (!tresorierDe(c.id) || !peut('paiements.encaisser', c.id) || estTresorier(c.id)) return;
      for (var am = debut.slice(0, 7); am <= fin.slice(0, 7); am = moisSuivantIso(am)) {
        var d = finDuMois(am + '-01');
        if (d < debut || d > fin) continue;
        out.push({ id: 'rem-' + c.id + '-' + am, auto: true, type: 'echeance', titre: 'Remise des fonds au trésorier', date: d, heure: '', lieu: '', rappel_min: 2880, centre_id: c.id, lien: '#/caisse',
          note: 'Remettez à ' + nomCompte(tresorierDe(c.id)) + ' l\'argent encaissé ce mois, pour le bilan.' });
      }
    });
    if (an) [[an.debut, 'Rentrée scolaire ' + an.libelle], [an.fin, 'Fin de l\'année scolaire ' + an.libelle]].forEach(function (x) {
      if (x[0] && x[0] >= debut && x[0] <= fin) out.push({ id: 'an-' + x[0], auto: true, type: 'autre', titre: x[1], date: x[0], heure: '', lieu: '', rappel_min: 1440, centre_id: '' });
    });
    return out.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : (a.heure || '99') < (b.heure || '99') ? -1 : 1; });
  }
  function ligneAgenda(x, avecDate) {
    var c = ligne('centres', x.centre_id) || {};
    var quand = (avecDate ? dateLongue(x.date).replace(/^./, function (m) { return m.toUpperCase(); }) + (x.heure ? ' · ' : '') : '') + (x.heure ? heureLisible(x.heure) + (x.fin ? ' – ' + heureLisible(x.fin) : '') : (avecDate ? '' : 'Toute la journée'));
    var sous = [quand, x.lieu, centresChoisis().length > 1 ? (c.nom_court || c.nom) : ''].filter(Boolean).join(' · ');
    return '<button class="ligne ev t-' + esc(x.type) + '" type="button" data-a="voir-evenement" data-id="' + esc(x.id) + '" data-date="' + esc(x.date) + '">' +
      '<span class="pastille">' + ico((TYPES_EV[x.type] || TYPES_EV.autre)[1]) + '</span><span class="corps"><b>' + esc(x.titre) + '</b><small>' + esc(sous) + '</small></span>' +
      (x.attente ? '<span class="badge alerte">en attente</span>' : '<span class="badge type">' + esc((TYPES_EV[x.type] || TYPES_EV.autre)[0]) + '</span>') + '</button>';
  }

  function pageAgenda() {
    var auj = isoLocal(new Date());
    if (!AG.mois) AG.mois = auj.slice(0, 7);
    var lib = MOIS[Number(AG.mois.slice(5)) - 1].replace(/^./, function (c) { return c.toUpperCase(); }) + ' ' + AG.mois.slice(0, 4);
    var h = '<h1>Agenda</h1><p class="sous-titre">Rendez-vous, rencontres, échéances. La cloche en haut vous rappelle ce qui approche.</p>';
    h += '<div class="nav-date"><button type="button" class="btn clair petit" data-a="ag-mois" data-v="-1" aria-label="Mois précédent">‹</button><b>' + esc(lib) + '</b><button type="button" class="btn clair petit" data-a="ag-mois" data-v="1" aria-label="Mois suivant">›</button></div>';
    // Grille du mois, semaines du lundi au dimanche.
    var premier = AG.mois + '-01', decal = jourDe(premier) - 1;
    var dernier = decalerJour(moisSuivantIso(AG.mois) + '-01', -1);
    var elts = elementsAgenda(premier, dernier), parJour = {};
    elts.forEach(function (x) { (parJour[x.date] = parJour[x.date] || []).push(x); });
    h += '<div class="calendrier" role="grid" aria-label="' + esc(lib) + '"><div class="cal-tete">' + ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(function (j) { return '<span>' + j + '</span>'; }).join('') + '</div><div class="cal-jours">';
    for (var i = 0; i < decal; i++) h += '<span class="cal-vide"></span>';
    for (var d = premier; d <= dernier; d = decalerJour(d, 1)) {
      var l = parJour[d] || [];
      h += '<button type="button" class="cal-jour' + (d === auj ? ' auj' : '') + (d === AG.jour ? ' choisi' : '') + (l.length ? ' plein' : '') + '" data-a="ag-jour" data-v="' + d + '" aria-label="' + esc(dateLongue(d) + (l.length ? ', ' + l.length + ' rendez-vous' : '')) + '">' +
        '<b>' + Number(d.slice(8)) + '</b><span class="points">' + l.slice(0, 3).map(function (x) { return '<i class="t-' + esc(x.type) + '"></i>'; }).join('') + '</span></button>';
    }
    h += '</div></div><div class="legende-agenda">' + Object.keys(TYPES_EV).map(function (k) { return '<span class="t-' + k + '"><i></i>' + esc(TYPES_EV[k][0]) + '</span>'; }).join('') + '</div>';
    if (AG.jour) {
      var duJour = elementsAgenda(AG.jour, AG.jour);
      h += '<h2>' + esc(dateLongue(AG.jour).replace(/^./, function (c) { return c.toUpperCase(); })) + '</h2>' +
        (duJour.length ? '<div class="liste">' + duJour.map(function (x) { return ligneAgenda(x, false); }).join('') + '</div>' : '<div class="carte vide">Rien ce jour-là.</div>');
    }
    var avenir = elementsAgenda(auj, decalerJour(auj, 45));
    h += '<h2>À venir</h2>' + (avenir.length ? '<div class="liste">' + avenir.slice(0, 30).map(function (x) { return ligneAgenda(x, true); }).join('') + '</div>' : '<div class="carte vide">Rien de prévu dans les 45 prochains jours.</div>');
    h += '<div class="actions empile">' + (avenir.length ? '<button class="btn clair" type="button" data-a="ag-ics-tout">' + ico('download', 'p') + 'Tout ajouter au calendrier du téléphone</button>' : '') +
      '<button class="btn clair" type="button" data-a="notifications">' + ico('bell', 'p') + 'Notifications</button></div>';
    if (centresAgendaGeres().length) h += '<button class="fab" type="button" data-a="editer-evenement" data-id="" data-date="' + esc(AG.jour || auj) + '">' + ico('plus') + 'Rendez-vous</button>';
    return h;
  }

  function feuilleEvenement(id, dateDefaut) {
    var e = id ? ligne('evenements', id) : null;
    var geres = centresAgendaGeres();
    var cidDefaut = e ? e.centre_id : (geres.some(function (c) { return c.id === E.centre; }) ? E.centre : (geres[0] || {}).id);
    var d = e || { type: 'rencontre', date: dateDefaut || isoLocal(new Date()), heure: '', fin: '', lieu: '', note: '', rappel_min: 60, centre_id: cidDefaut };
    var opt = function (v, t, cour) { return '<option value="' + esc(v) + '"' + (String(v) === String(cour) ? ' selected' : '') + '>' + esc(t) + '</option>'; };
    ouvrirFeuille('<h2>' + (e ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous') + '</h2>' +
      '<form data-f="evenement" data-id="' + esc(id || '') + '">' +
      '<label class="champ"><span>Titre</span><input type="text" name="titre" required maxlength="160" value="' + esc(d.titre || '') + '" placeholder="ex. : Rencontre avec les parents de 3e"></label>' +
      '<div class="deux"><label class="champ"><span>Type</span><select name="type">' + Object.keys(TYPES_EV).map(function (k) { return opt(k, TYPES_EV[k][0], d.type); }).join('') + '</select></label>' +
      '<label class="champ"><span>Centre</span><select name="centre_id">' + geres.map(function (c) { return opt(c.id, c.nom_court || c.nom, d.centre_id); }).join('') + '</select></label></div>' +
      '<label class="champ"><span>Date</span><input type="date" name="date" required value="' + esc(d.date) + '"></label>' +
      '<div class="deux"><label class="champ"><span>Début</span><input type="time" name="heure" value="' + esc(d.heure || '') + '"></label>' +
      '<label class="champ"><span>Fin</span><input type="time" name="fin" value="' + esc(d.fin || '') + '"></label></div>' +
      '<label class="champ"><span>Lieu</span><input type="text" name="lieu" maxlength="160" value="' + esc(d.lieu || '') + '" placeholder="ex. : salle 2, ou au centre"></label>' +
      '<label class="champ"><span>Rappel</span><select name="rappel_min">' + RAPPELS.map(function (r) { return opt(r[0], r[1], d.rappel_min); }).join('') + '</select></label>' +
      '<label class="champ"><span>Note</span><textarea name="note" rows="3" maxlength="400">' + esc(d.note || '') + '</textarea></label>' +
      '<div class="actions"><button class="btn" type="submit">Enregistrer</button><button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>' +
      (e ? '<div class="actions"><button class="btn danger" type="button" data-a="suppr-evenement" data-id="' + esc(id) + '">Supprimer</button></div>' : ''));
  }
  function feuilleVoirEvenement(id, date) {
    var x = elementsAgenda(date, date).filter(function (y) { return y.id === id; })[0];
    if (!x) return;
    var c = ligne('centres', x.centre_id) || {};
    var modifiable = !x.auto && peutAgenda(x.centre_id);
    ouvrirFeuille('<div class="ev-tete t-' + esc(x.type) + '"><span class="pastille">' + ico((TYPES_EV[x.type] || TYPES_EV.autre)[1]) + '</span><div><small>' + esc((TYPES_EV[x.type] || TYPES_EV.autre)[0]) + '</small><h2>' + esc(x.titre) + '</h2></div></div>' +
      '<div class="infos">' +
      '<div class="info"><span>Quand</span><b>' + esc(dateLongue(x.date) + ' ' + x.date.slice(0, 4) + (x.heure ? ' · ' + heureLisible(x.heure) + (x.fin ? ' – ' + heureLisible(x.fin) : '') : '')) + '</b></div>' +
      (x.lieu ? '<div class="info"><span>Lieu</span><b>' + esc(x.lieu) + '</b></div>' : '') +
      (c.nom ? '<div class="info"><span>Centre</span><b>' + esc(c.nom) + '</b></div>' : '') +
      '<div class="info"><span>Rappel</span><b>' + esc(((RAPPELS.filter(function (r) { return r[0] === x.rappel_min; })[0]) || [0, x.rappel_min + ' min avant'])[1]) + '</b></div></div>' +
      (x.note ? '<p>' + esc(x.note) + '</p>' : '') +
      '<div class="actions"><button class="btn or" type="button" data-a="ag-ics" data-id="' + esc(x.id) + '" data-date="' + esc(x.date) + '">' + ico('download', 'p') + 'Ajouter au calendrier du téléphone</button>' +
      (x.lien ? '<a class="btn clair" href="' + esc(x.lien) + '" data-a="fermer-et-aller">Ouvrir la caisse</a>' : '') +
      (modifiable ? '<button class="btn clair" type="button" data-a="editer-evenement" data-id="' + esc(x.id) + '">' + ico('edit', 'p') + 'Modifier</button>' : '') +
      '<button class="btn clair" type="button" data-a="fermer">Fermer</button></div>');
  }

  // Fichier .ics : le calendrier du téléphone l'importe et sonne au rappel, appli fermée.
  function icsTexte(elts) {
    var esc2 = function (t) { return String(t || '').replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n'); };
    var compact = function (iso, hhmm) { return iso.replace(/-/g, '') + (hhmm ? 'T' + hhmm.replace(':', '') + '00' : ''); };
    var maintenant = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    var l = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//VERITAS//Gestion//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
    elts.forEach(function (x) {
      var c = ligne('centres', x.centre_id) || {};
      l.push('BEGIN:VEVENT', 'UID:' + x.id + '@gestion.veritas-school.com', 'DTSTAMP:' + maintenant);
      if (x.heure) {
        l.push('DTSTART:' + compact(x.date, x.heure));
        var fin = x.fin && x.fin > x.heure ? x.fin : ('0' + Math.min(23, Number(x.heure.slice(0, 2)) + 1)).slice(-2) + x.heure.slice(2);
        l.push('DTEND:' + compact(x.date, fin));
      } else {
        l.push('DTSTART;VALUE=DATE:' + compact(x.date), 'DTEND;VALUE=DATE:' + compact(decalerJour(x.date, 1)));
      }
      l.push('SUMMARY:' + esc2(x.titre + (c.nom_court ? ' — ' + c.nom_court : '')));
      if (x.lieu || c.adresse) l.push('LOCATION:' + esc2(x.lieu || c.adresse));
      if (x.note) l.push('DESCRIPTION:' + esc2(x.note));
      if (x.rappel_min > 0) l.push('BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc2(x.titre), 'TRIGGER:-PT' + x.rappel_min + 'M', 'END:VALARM');
      l.push('END:VEVENT');
    });
    l.push('END:VCALENDAR');
    return l.join('\r\n') + '\r\n';
  }
  function partagerIcs(elts, nom) {
    var f = new File([icsTexte(elts)], nom.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9-]+/g, '-').replace(/-+/g, '-') + '.ics', { type: 'text/calendar' });
    return partagerFichiers([f], 'Agenda VÉRITAS');
  }

  // ── Notifications : ce qui demande attention, maintenant ──
  function notificationsDuJour() {
    var auj = isoLocal(new Date()), demain = decalerJour(auj, 1), out = [];
    elementsAgenda(auj, decalerJour(auj, 3)).forEach(function (x) {
      if (x.type === 'echeance') {
        var n = impayes(x.centre_id).length;
        out.push({ ico: 'wallet', niveau: x.date === auj ? 'alerte' : '', titre: (x.date === auj ? 'Échéance aujourd\'hui' : 'Échéance ' + (x.date === demain ? 'demain' : 'le ' + dateLisible(x.date, true))) + ' · ' + ((ligne('centres', x.centre_id) || {}).nom_court || ''),
          detail: n ? n + ' élève' + (n > 1 ? 's' : '') + ' en impayé à relancer' : 'Aucun impayé pour l\'instant', lien: '#/caisse', id: x.id });
      } else if (x.date <= demain) {
        out.push({ ico: (TYPES_EV[x.type] || TYPES_EV.autre)[1], niveau: 't-' + x.type, titre: (x.date === auj ? 'Aujourd\'hui' : 'Demain') + (x.heure ? ' à ' + heureLisible(x.heure) : '') + ' · ' + x.titre,
          detail: [x.lieu, (ligne('centres', x.centre_id) || {}).nom_court].filter(Boolean).join(' · ') || (TYPES_EV[x.type] || TYPES_EV.autre)[0], lien: '#/agenda', id: x.id });
      }
    });
    var moi = E.profil.utilisateur.id;
    centresChoisis().forEach(function (c) {
      var nom = c.nom_court || c.nom;
      if (estAdmin() || estTresorier(c.id)) {
        var dv = lignes('depenses').filter(function (d) { return d.centre_id === c.id && d.statut === 'en_attente' && (estAdmin() || d.saisie_par !== moi); }).length;
        if (dv) out.push({ ico: 'clipboard', niveau: 'alerte', titre: dv + ' dépense' + (dv > 1 ? 's' : '') + ' à valider · ' + nom, detail: 'Caisse › Dépenses', lien: '#/caisse', onglet: 'depenses' });
      }
      if (peut('appel.faire', c.id) && !estEnseignantQuelquePart()) {
        var ret = seancesPrevues(c.id, auj).filter(function (x) { return retardAppel(x, c) > 0; }).length;
        if (ret) out.push({ ico: 'alert', niveau: 'danger', titre: ret + ' appel' + (ret > 1 ? 's' : '') + ' en retard · ' + nom, detail: 'Faites l\'appel des classes concernées', lien: '#/appel' });
      }
      if (peut('eleves.gerer', c.id)) {
        var al = alertesAssiduite(c.id).length;
        if (al) out.push({ ico: 'activity', niveau: '', titre: al + ' alerte' + (al > 1 ? 's' : '') + ' d\'assiduité · ' + nom, detail: 'Absences ou retards répétés', lien: '#/assiduite' });
      }
    });
    lignes('centres').forEach(function (c) {
      var nom = c.nom_court || c.nom, rs = remisesDu(c.id);
      if (estTresorier(c.id)) {
        var ac = rs.filter(function (r) { return (r.statut || 'en_attente') === 'en_attente' && r.remis_par !== moi; });
        if (ac.length) out.push({ ico: 'wallet', niveau: 'alerte', titre: ac.length + ' remise' + (ac.length > 1 ? 's' : '') + ' à confirmer · ' + nom, detail: fcfa(ac.reduce(function (s, r) { return s + Number(r.montant); }, 0)).replace(/\u00a0/g, ' ') + ' déclarés remis : reçu ou pas ?', lien: '#/caisse', onglet: 'remises' });
      }
      rs.filter(function (r) { return r.remis_par === moi && r.statut === 'contestee' && String(r.confirme_le || '').slice(0, 10) >= decalerJour(auj, -30); }).forEach(function (r) {
        out.push({ ico: 'alert', niveau: 'danger', titre: 'Remise de ' + fcfa(r.montant).replace(/\u00a0/g, ' ') + ' non reçue par le trésorier', detail: r.motif || nom, lien: '#/caisse', onglet: 'remises' });
      });
      if (tresorierDe(c.id) && !estTresorier(c.id) && peut('paiements.encaisser', c.id) && auj >= decalerJour(finDuMois(auj), -4)) {
        var reste = soldeFonds(moi, c.id).reste;
        if (reste > 0) out.push({ ico: 'wallet', niveau: 'alerte', titre: fcfa(reste).replace(/\u00a0/g, ' ') + ' à remettre au trésorier · ' + nom, detail: 'Avant le ' + dateLisible(finDuMois(auj), true) + ', pour le bilan du mois', lien: '#/caisse', onglet: 'remises' });
      }
    });
    lignes('centres').forEach(function (c) {
      if (!peut('caisse.corriger', c.id)) return;
      var prec = decalerMois(moisCycle(), -1), fin = finDuMois(auj);
      if (auj >= decalerJour(fin, -1) && !clotureDe(c.id, moisCycle())) out.push({ ico: 'lock', niveau: 'alerte', titre: 'Comptes et partage de ' + libMoisAnnee(moisCycle()) + ' · ' + (c.nom_court || c.nom), detail: 'Clôture le ' + dateLisible(fin, true) + ' (Bilan)', lien: '#/bilan' });
      if (!clotureDe(c.id, prec) && lignes('paiements').some(function (p) { return p.centre_id === c.id && dansMois(p, prec); })) out.push({ ico: 'lock', niveau: 'danger', titre: libMoisAnnee(prec) + ' pas encore clôturé · ' + (c.nom_court || c.nom), detail: 'Faites les comptes et le partage (Bilan)', lien: '#/bilan' });
    });
    lignes('centres').forEach(function (c) {
      if (!peutEquipe(c.id)) return;
      var nom = c.nom_court || c.nom, nl = nonLus(c.id).length, so = sondagesOuvertsSansReponse(c.id), mt = mesTachesUrgentes(c.id);
      if (nl) out.push({ ico: 'message', niveau: 'ok', titre: nl + ' nouveau' + (nl > 1 ? 'x' : '') + ' message' + (nl > 1 ? 's' : '') + ' · ' + nom, detail: 'Discussion et commentaires des partenaires', lien: '#/equipe', eq: 'discussion', centre: c.id });
      so.forEach(function (x) { out.push({ ico: 'agenda', niveau: 'alerte', titre: 'Réunion : ' + x.titre, detail: 'Donnez vos disponibilités (' + nomCompte(x.auteur) + ' propose des dates)', lien: '#/equipe', eq: 'reunions', centre: c.id }); });
      mt.forEach(function (t) { var r = t.echeance && t.echeance < auj; out.push({ ico: 'clipboard', niveau: r ? 'danger' : 'alerte', titre: (r ? 'Tâche en retard : ' : 'Tâche : ') + t.titre, detail: t.echeance ? 'Pour le ' + dateLisible(t.echeance, true) : 'Sans échéance', lien: '#/equipe', eq: 'taches', centre: c.id }); });
    });
    if (estEnseignantQuelquePart()) {
      var aFaire = mesCoursDu(auj).filter(function (cr) { return !etatSeance({ id: idSeance(auj, cr.classe_id), centre_id: cr.centre_id, classe: { id: cr.classe_id } }).pointes; }).length;
      if (aFaire) out.push({ ico: 'checkcircle', niveau: 'alerte', titre: aFaire + ' appel' + (aFaire > 1 ? 's' : '') + ' à faire aujourd\'hui', detail: 'Mes cours aujourd\'hui', lien: '#/accueil' });
    }
    return out;
  }
  function boutonCloche() {
    var n = notificationsDuJour().length;
    return '<button id="cloche" class="cloche" type="button" data-a="notifications" aria-label="Notifications' + (n ? ' : ' + n : '') + '">' + ico('bell') + (n ? '<span class="pastille-n">' + (n > 9 ? '9+' : n) + '</span>' : '') + '</button>';
  }
  function majCloche() { var b = $('#cloche'); if (b) b.outerHTML = boutonCloche(); }
  function notifSystemePossible() { return !NATIF && 'Notification' in window; }
  function feuilleNotifications() {
    var l = notificationsDuJour();
    var h = '<h2>Notifications</h2>' + (l.length ? '<div class="liste">' + l.map(function (x) {
      return '<a class="ligne notif ' + esc(x.niveau || '') + '" href="' + esc(x.lien) + '" data-a="fermer-et-aller"' + (x.onglet ? ' data-onglet="' + esc(x.onglet) + '"' : '') + (x.eq ? ' data-eq="' + esc(x.eq) + '" data-centre="' + esc(x.centre) + '"' : '') + '><span class="pastille">' + ico(x.ico) + '</span><span class="corps"><b>' + esc(x.titre) + '</b><small>' + esc(x.detail) + '</small></span><span class="fin">›</span></a>';
    }).join('') + '</div>' : '<div class="carte vide">Rien à signaler pour le moment.</div>');
    if (notifSystemePossible()) {
      h += Notification.permission === 'granted'
        ? '<p class="doux">' + ico('check', 'p') + ' Les rappels du téléphone sont activés : ils sonnent quand l\'appli est ouverte ou vient de l\'être. Pour un rappel sûr appli fermée, ajoutez le rendez-vous au calendrier du téléphone.</p>'
        : Notification.permission === 'denied'
          ? '<p class="doux">Les notifications sont bloquées pour ce site : réautorisez-les dans les réglages du navigateur (cadenas › Notifications).</p>'
          : '<div class="actions"><button class="btn or" type="button" data-a="activer-notifs">' + ico('bell', 'p') + 'Activer les rappels du téléphone</button></div>';
    }
    h += '<div class="actions"><a class="btn clair" href="#/agenda" data-a="fermer-et-aller">' + ico('agenda', 'p') + 'Ouvrir l\'agenda</a><button class="btn clair" type="button" data-a="fermer">Fermer</button></div>';
    ouvrirFeuille(h);
  }
  /** Rappels système : rendez-vous à l'heure de leur rappel, échéance la veille et le jour. Une fois chacun. */
  function verifierRappels() {
    if (!E.profil || !notifSystemePossible() || Notification.permission !== 'granted') return;
    var deja = {};
    try { deja = JSON.parse(localStorage.getItem('vg-rappels') || '{}'); } catch (e) { deja = {}; }
    var maintenant = Date.now(), auj = isoLocal(new Date()), envoyes = 0;
    elementsAgenda(auj, decalerJour(auj, 15)).forEach(function (x) {
      var debut = new Date(x.date + 'T' + (x.heure || '08:00') + ':00').getTime();
      var quand = debut - (x.rappel_min || 0) * 60000;
      var cle = x.id + '@' + x.date + (x.heure || '');
      if (deja[cle] || maintenant < quand || maintenant > debut + 3600000 || (!x.rappel_min && x.type !== 'echeance')) return;
      deja[cle] = maintenant; envoyes++;
      var corps = [x.heure ? dateLongue(x.date) + ' à ' + heureLisible(x.heure) : dateLongue(x.date), x.lieu].filter(Boolean).join(' · ');
      var ouvrir = { body: corps, icon: 'icone-512.png', badge: 'icone-512.png', tag: cle, data: { url: x.type === 'echeance' ? '#/caisse' : '#/agenda' } };
      var titre = (x.type === 'echeance' ? 'Échéance des mensualités' : x.titre) + ' — VÉRITAS';
      if (navigator.serviceWorker && navigator.serviceWorker.controller) navigator.serviceWorker.ready.then(function (r) { r.showNotification(titre, ouvrir); }).catch(function () {});
      else { try { new Notification(titre, ouvrir); } catch (e) {} }
    });
    if (envoyes) { try { localStorage.setItem('vg-rappels', JSON.stringify(deja)); } catch (e) {} }
  }
  setInterval(function () { verifierRappels(); majCloche(); }, 60000);

  /** Accueil : les trois prochains rendez-vous des 14 jours. */
  function blocProchainsRdv() {
    var auj = isoLocal(new Date());
    var l = elementsAgenda(auj, decalerJour(auj, 14)).slice(0, 3);
    if (!l.length) return '';
    return '<h2>Prochains rendez-vous</h2><div class="liste">' + l.map(function (x) { return ligneAgenda(x, true); }).join('') + '</div>' +
      '<p class="lien-suite"><a href="#/agenda">Tout l\'agenda ›</a></p>';
  }

  // ───────────────────────────── Espaces et rôles ─────────────────────────────
  // Quatre espaces, un par famille de rôles : chacun a sa couleur, sa mission et
  // ses chiffres clés. Le serveur reste seul juge des droits (g_capacites).
  var ESPACES = {
    admin: { titre: 'Espace administrateur', ico: 'shield', mission: 'Vous pilotez tous les centres : comptes et identifiants, droits des partenaires, réglages, finances consolidées.' },
    partenaire: { titre: 'Espace partenaire', ico: 'handshake', mission: 'Vous suivez la marche de votre centre : élèves, caisse, bilan et parts, emploi du temps.' },
    secretariat: { titre: 'Espace secrétariat', ico: 'clipboard', mission: 'Vous tenez l\'accueil : inscriptions, appel, encaissements et reçus, dépenses du jour.' },
    enseignant: { titre: 'Espace enseignant', ico: 'graduation', mission: 'Vos cours du jour, l\'appel de vos classes, vos heures et votre rémunération.' }
  };
  /** Fiches des rôles : ce que chacun fait, et ce qui lui est fermé. */
  var FICHES_ROLES = [
    { cle: 'admin', espace: 'admin', nom: 'Administrateur', famille: 'Direction',
      resume: 'Le propriétaire de l\'application. Voit et règle tout, dans tous les centres.',
      peut: ['Créer les comptes et transmettre les identifiants', 'Retirer des droits à un partenaire, désactiver un compte', 'Ouvrir un centre, fixer l\'année, les matières, les tarifs', 'Voir les finances consolidées et le journal complet',
        'Annuler une dépense validée, redater un versement, retirer un mois des comptes', 'Éditer les reçus de paie et les bons de sortie'],
      pas: [] },
    { cle: 'responsable', espace: 'partenaire', nom: 'Responsable', famille: 'Partenaire',
      resume: 'Dirige un centre au quotidien, avec presque tous les pouvoirs sur ce centre.',
      peut: ['Inscrire les élèves, faire et corriger l\'appel', 'Encaisser, annuler un versement, accorder une remise', 'Remettre les fonds au trésorier', 'Fixer les tarifs', 'Gérer les contrats et paies des enseignants', 'Créer des comptes secrétaires et enseignants', 'Tenir l\'agenda : rendez-vous, rencontres, réunions', 'Échanger dans l\'espace Équipe : messages, commentaires, réunions, tâches'],
      pas: ['Les réglages des centres et de l\'année', 'Les comptes responsables, actionnaires et admin', 'Valider les dépenses (trésorier ou administrateur), annuler une dépense déjà validée, changer la date d\'un versement (administrateur seul)'] },
    { cle: 'actionnaire', espace: 'partenaire', nom: 'Actionnaire', famille: 'Partenaire',
      resume: 'Associé du centre : quand il est présent, il fait l\'appel, relance, inscrit, encaisse, gère et paie les enseignants ; il suit les chiffres.',
      peut: ['Faire l\'appel des classes, prévenir les parents des absences et retards', 'Rappeler les échéances et relancer les impayés (parents ou élèves)',
        'Inscrire les élèves et modifier leurs fiches', 'Encaisser inscriptions et mensualités, envoyer le reçu', 'Créer les comptes des enseignants, fixer leur contrat',
        'Payer l\'enseignant après son cours, verser la paie du mois, lui envoyer son reçu', 'Saisir les dépenses, éditer le bon de sortie', 'Remettre les fonds au trésorier', 'Voir le bilan, les statistiques et les parts',
        'Modifier l\'emploi du temps, tenir l\'agenda', 'Échanger dans l\'espace Équipe : messages, commentaires, réunions, tâches'],
      pas: ['Fixer les tarifs, accorder une remise', 'Valider ou annuler une dépense (trésorier ou administrateur)', 'Clôturer le mois'] },
    { cle: 'secretaire', espace: 'secretariat', nom: 'Secrétaire / surveillant', famille: 'Équipe',
      resume: 'Tient l\'accueil et la caisse du centre.',
      peut: ['Inscrire et modifier les élèves', 'Faire l\'appel de toutes les classes', 'Encaisser et remettre les reçus', 'Payer l\'enseignant juste après son cours (1 500 F/h) et lui envoyer son reçu', 'Remettre les fonds au trésorier', 'Saisir les dépenses (avec photo du justificatif)', 'Noter les rendez-vous dans l\'agenda', 'Échanger dans l\'espace Équipe : messages, commentaires, réunions, tâches'],
      pas: ['Voir le bilan', 'Annuler un versement, accorder une remise', 'Valider une dépense', 'Gérer les enseignants, verser la paie du mois',
        'Saisir une dépense « Salaires » (la paie passe par « Payer » après le cours)'] },
    { cle: 'enseignant', espace: 'enseignant', nom: 'Enseignant', famille: 'Équipe',
      resume: 'Fait l\'appel, tient le cahier de textes et suit ses heures et ses paies.',
      peut: ['Faire l\'appel des classes de son centre (ses cours en premier), dans les 2 jours', 'Écrire le cahier de textes : ce qui a été fait, le travail donné',
        'Voir son emploi du temps, sa progression et l\'agenda du centre', 'Voir ses heures, son contrat, ses paies et leurs reçus'],
      pas: ['La caisse et les finances', 'Les paies des autres enseignants', 'Les comptes', 'L\'espace Équipe des partenaires', 'Un autre centre que le sien'] }
  ];
  function ficheRole(cle) { return FICHES_ROLES.filter(function (f) { return f.cle === cle; })[0]; }
  var ORDRE_ROLES = ['responsable', 'actionnaire', 'secretaire', 'enseignant'];
  /** Rôles du compte, du plus large au plus étroit. */
  function mesRoles() {
    var acces = (E.profil && E.profil.acces) || {};
    var vus = {};
    Object.keys(acces).forEach(function (c) { vus[acces[c]] = 1; });
    return ORDRE_ROLES.filter(function (r) { return vus[r]; });
  }
  function monEspace() {
    if (estAdmin()) return 'admin';
    var r = mesRoles()[0];
    return r ? ficheRole(r).espace : 'enseignant';
  }
  function estEnseignantQuelquePart() { return mesRoles().indexOf('enseignant') >= 0; }
  /** Cours de l'enseignant connecté un jour donné, tous centres confondus. */
  function mesCoursDu(iso) {
    var uid = E.profil.utilisateur.id, j = jourDe(iso);
    return lignes('creneaux').filter(function (c) { return c.enseignant_id === uid && Number(c.jour) === j; })
      .sort(function (a, b) { return a.debut < b.debut ? -1 : 1; });
  }

  function bandeauEspace() {
    var cle = monEspace(), es = ESPACES[cle];
    var roles = estAdmin() ? ['Administrateur'] : mesRoles().map(function (r) { return ficheRole(r).nom; });
    var chiffres = chiffresCles(cle);
    return '<section class="bandeau-espace espace-' + cle + '"><div class="haut"><span class="pastille">' + ico(es.ico, 'g') + '</span><div>' +
      '<small>' + esc(roles.join(' · ')) + '</small><h2>' + esc(es.titre) + '</h2></div></div><p>' + esc(es.mission) + '</p>' +
      (chiffres.length ? '<div class="chiffres-cles">' + chiffres.map(function (c) {
        return (c[2] ? '<a href="' + c[2] + '">' : '<div>') + '<b>' + c[0] + '</b><small>' + esc(c[1]) + '</small>' + (c[2] ? '</a>' : '</div>');
      }).join('') + '</div>' : '') +
      '<a class="lien-roles" href="#/roles">' + ico('info', 'p') + (estAdmin() ? ' Rôles et droits' : ' Mon rôle et mes droits') + '</a></section>';
  }
  /** [valeur (HTML sûr), libellé, lien?] selon l'espace. */
  function chiffresCles(cle) {
    var auj = isoLocal(new Date()), am = auj.slice(0, 7);
    var centres = centresChoisis();
    var out = [];
    if (cle === 'enseignant') {
      var cours = mesCoursDu(auj);
      out.push([String(cours.length), cours.length > 1 ? 'cours aujourd\'hui' : 'cours aujourd\'hui', '#/emploi']);
      var faites = 0, du = 0, contrat = false;
      lignes('centres').filter(function (c) { return roleDans(c.id) === 'enseignant'; }).forEach(function (c) {
        var b = bilanEnseignant(E.profil.utilisateur.id, c.id, am);
        faites += b.faites; du += b.du; if (b.contrat) contrat = true;
      });
      out.push([esc(dureeLisible(faites)), 'faites ce mois', '#/mesheures']);
      if (contrat) out.push([esc(fcfa(du)), 'dû ce mois', '#/mesheures']);
      return out;
    }
    var eleves = 0, appels = 0, prevus = 0, mois = 0, jour = 0, imp = 0, voitCaisse = false, voitSorties = false, sorties = 0, attente = 0;
    centres.forEach(function (c) {
      eleves += elevesActifs(c.id).length;
      if (peut('appel.faire', c.id) || peut('centre.voir', c.id)) {
        var p = seancesPrevues(c.id, auj);
        prevus += p.length; appels += p.filter(function (x) { return etatSeance(x).pointes > 0; }).length;
      }
      if (peut('paiements.voir', c.id)) {
        voitCaisse = true;
        lignes('paiements').forEach(function (p) {
          if (p.centre_id !== c.id || Number(p.annule)) return;
          if (p.date === auj) jour += Number(p.montant) || 0;
          if (String(p.date).slice(0, 7) === am && enCompte(p)) mois += Number(p.montant) || 0;
        });
        imp += impayes(c.id).length;
      }
      // Sorties du mois (paies des enseignants, craie, loyer…) : comme le Bilan, dépenses validées + paies.
      if (peut('depenses.voir', c.id)) {
        voitSorties = true;
        var duMois = function (x) { return x.centre_id === c.id && String(x.date).slice(0, 7) === am && enCompte(x); };
        lignes('depenses').forEach(function (d) {
          if (!duMois(d)) return;
          if (d.statut === 'validee') sorties += Number(d.montant) || 0;
          else if ((d.statut || 'en_attente') === 'en_attente') attente += Number(d.montant) || 0;
        });
        lignes('paies').forEach(function (x) { if (duMois(x) && !Number(x.annule)) sorties += Number(x.montant) || 0; });
      }
    });
    out.push([String(eleves), 'élèves inscrits', '#/eleves']);
    if (prevus) out.push([appels + '/' + prevus, 'appels du jour', '#/appel']);
    if (voitCaisse) {
      out.push(cle === 'secretariat' ? [esc(fcfa(jour)), 'encaissé aujourd\'hui', '#/caisse'] : [esc(fcfa(mois)), 'encaissé ce mois', '#/caisse']);
      if (voitSorties && cle !== 'secretariat') {
        var lienB = peutQuelquePart('finances.voir') ? '#/bilan' : '#/caisse';
        out.push([esc(fcfa(sorties)), 'sorties ce mois (profs, craie, loyer…)', lienB]);
        out.push([(mois - sorties < 0 ? '− ' : '') + esc(fcfa(Math.abs(mois - sorties))), 'solde restant ce mois', lienB]);
        if (attente) out.push([esc(fcfa(attente)), 'dépenses à valider (non comptées)', '#/caisse']);
      }
      out.push([String(imp), imp > 1 ? 'impayés' : 'impayé', '#/caisse']);
    }
    return out;
  }

  /** Accueil de l'enseignant : ses cours du jour, avec l'accès direct à l'appel. */
  function blocMesCours() {
    if (!estEnseignantQuelquePart()) return '';
    var auj = isoLocal(new Date());
    var cours = mesCoursDu(auj);
    var h = '<h2>Mes cours aujourd\'hui</h2>';
    if (!cours.length) return h + '<div class="carte vide">Pas de cours pour vous aujourd\'hui.</div>';
    return h + '<div class="liste">' + cours.map(function (c) {
      var x = { id: idSeance(auj, c.classe_id), centre_id: c.centre_id, classe: ligne('classes', c.classe_id) || { id: c.classe_id } };
      var fait = etatSeance(x).pointes > 0;
      var centre = ligne('centres', c.centre_id) || {};
      return '<a class="ligne creneau" href="#/pointage/' + encodeURIComponent(c.classe_id) + '/' + auj + '"><span class="horaire"><b>' + esc(c.debut) + '</b><small>' + esc(c.fin) + '</small></span>' +
        '<span class="corps"><b>' + esc(nomDe('classes', c.classe_id) + ' · ' + nomDe('matieres', c.matiere_id)) + '</b><small>' + esc(centre.nom_court || centre.nom || '') + '</small></span>' +
        (fait ? '<span class="badge ok">appel fait</span>' : '<span class="badge alerte">appel à faire</span>') + '</a>';
    }).join('') + '</div>';
  }

  /** « Mon rôle » : ce que le compte peut faire, réellement (droits retirés compris). */
  function carteMonRole() {
    var cle = monEspace();
    var h = '<div class="carte mon-role espace-' + cle + '"><h3>' + ico(ESPACES[cle].ico, 'p') + ' ' + esc(ESPACES[cle].titre) + '</h3>';
    if (estAdmin()) return h + '<p class="doux">Tous les droits, dans tous les centres.</p></div>';
    var caps = capsDuCompte(E.profil);
    var retires = E.profil.restrictions || [];
    h += '<ul class="droits">' + caps.map(function (k) {
      var non = retires.indexOf(k) >= 0;
      return '<li class="' + (non ? 'non' : 'oui') + '">' + ico(non ? 'x' : 'check', 'p') + ' ' + esc(LIB_CAP[k] || k) + (non ? ' <small>(réservé à l\'administrateur)</small>' : '') + '</li>';
    }).join('') + lignes('centres').filter(function (c) { return estTresorier(c.id); }).map(function (c) {
      return '<li class="oui">' + ico('wallet', 'p') + ' <b>Trésorier de ' + esc(c.nom_court || c.nom) + '</b> : vous gardez les fonds et confirmez les remises</li>';
    }).join('') + '</ul></div>';
    return h;
  }

  function pageRoles() {
    // Chacun ne voit que SON rôle ; l'administrateur voit tous les rôles pour les attribuer.
    var h = estAdmin() ? '<h1>Rôles et droits</h1><p class="sous-titre">Chaque personne a son compte et son rôle, centre par centre. Le serveur refuse ce que le rôle n\'autorise pas.</p>'
      : '<h1>Mon rôle</h1><p class="sous-titre">Ce que votre compte permet, centre par centre. Une question : demandez à l\'administrateur.</p>';
    var moi = estAdmin() ? ['admin'] : mesRoles();
    h += '<div class="fiches-roles">' + FICHES_ROLES.filter(function (f) { return estAdmin() || moi.indexOf(f.cle) >= 0; }).map(function (f) {
      return '<article class="fiche-role espace-' + f.espace + (moi.indexOf(f.cle) >= 0 ? ' a-moi' : '') + '"><div class="haut"><span class="pastille">' + ico(ESPACES[f.espace].ico) + '</span><div><small>' + esc(f.famille) + '</small><h3>' + esc(f.nom) + '</h3></div>' +
        (moi.indexOf(f.cle) >= 0 ? '<span class="badge or">Vous</span>' : '') + '</div><p>' + esc(f.resume) + '</p>' +
        '<ul class="droits">' + f.peut.map(function (t) { return '<li class="oui">' + ico('check', 'p') + ' ' + esc(t) + '</li>'; }).join('') +
        f.pas.map(function (t) { return '<li class="non">' + ico('x', 'p') + ' ' + esc(t) + '</li>'; }).join('') + '</ul></article>';
    }).join('') + '</div>';
    if (estAdmin() && E.profil.capacites) {
      h += '<h2>Tableau des droits</h2><p class="sous-titre">Droits par défaut de chaque rôle. Vous pouvez en retirer à un partenaire dans Administration › Partenaires et droits.</p>' +
        '<div class="tableau-defile"><table class="matrice"><thead><tr><th>Droit</th>' + ORDRE_ROLES.map(function (r) { return '<th><abbr title="' + esc(ficheRole(r).nom) + '">' + esc({ responsable: 'Resp.', actionnaire: 'Action.', secretaire: 'Secr.', enseignant: 'Ens.' }[r]) + '</abbr></th>'; }).join('') + '</tr></thead><tbody>' +
        Object.keys(LIB_CAP).map(function (k) {
          return '<tr><td>' + esc(LIB_CAP[k]) + '</td>' + ORDRE_ROLES.map(function (r) {
            var oui = (E.profil.capacites[r] || []).indexOf(k) >= 0;
            return '<td class="' + (oui ? 'oui' : 'non') + '">' + (oui ? ico('check', 'p') + '<span class="sr">oui</span>' : '<span aria-label="non">–</span>') + '</td>';
          }).join('') + '</tr>';
        }).join('') + '</tbody></table></div>';
    }
    if (accesGestion('comptes.gerer')) h += '<div class="actions"><a class="btn or" href="#/comptes" data-a="ouvrir-comptes">' + ico('users', 'p') + 'Gérer les comptes</a></div>';
    return h;
  }

  // ───────────────────────────── Écrans en ligne : comptes ─────────────────────────────
  function horsLigne(zone, e) {
    var z = $(zone);
    if (z) z.innerHTML = '<div class="carte vide">' + esc(e.reseau ? 'Cet écran demande une connexion internet.' : e.message) + '</div>';
  }
  function chargerComptes() {
    api('comptes').then(function (r) {
      E.cache.comptes = r.comptes;
      dessinerComptes();
    }, function (e) { horsLigne('#zone-comptes', e); });
  }
  function dessinerComptes() {
    var z = $('#zone-comptes');
    if (!z) return;
    var ids = centresChoisis().map(function (c) { return c.id; });
    var liste = (E.cache.comptes || []).filter(function (u) {
      return E.centre === '*' || u.admin_global || Object.keys(u.acces).some(function (c) { return ids.indexOf(c) >= 0; });
    });
    if (!liste.length) { z.innerHTML = '<div class="carte vide">Aucun compte pour ce centre.</div>'; return; }
    z.innerHTML = '<div class="liste">' + liste.map(function (u) {
      var badges = (u.admin_global ? '<span class="badge or">Administrateur</span>' : '') + lignes('centres').filter(function (c) { return tresorierDe(c.id) === u.id; }).map(function (c) {
        return '<span class="badge ok">Trésorier' + (lignes('centres').length > 1 ? ' · ' + esc(c.nom_court || c.nom) : '') + '</span>';
      }).join('') + Object.keys(u.acces).map(function (cid) {
        var c = ligne('centres', cid);
        return '<span class="badge">' + esc(ROLES[u.acces[cid]] || u.acces[cid]) + (lignes('centres').length > 1 && c ? ' · ' + esc(c.nom_court || c.nom) : '') + '</span>';
      }).join('') + (!u.admin_global && Object.keys(u.acces).length > 1 ? '<span class="badge danger">2 centres : à séparer</span>' : '');
      return '<button class="ligne" type="button" data-a="editer-compte" data-id="' + esc(u.id) + '"' + (u.gerable ? '' : ' disabled') + '><span class="avatar">' + esc(initiales(u.nom)) + '</span>' +
        '<span class="corps"><b>' + esc(u.nom) + (u.actif ? '' : ' <span class="badge danger">désactivé</span>') + '</b><small>' + esc(u.identifiant) + ' · ' +
        (u.vu_le ? 'vu le ' + dateLisible(u.vu_le) : 'jamais connecté') + '</small>' +
        ((u.matieres || []).length ? '<small>' + esc(u.matieres.map(function (m) { return nomDe('matieres', m); }).filter(Boolean).join(', ')) + '</small>' : '') +
        '<span>' + badges + '</span></span></button>';
    }).join('') + '</div>';
  }

  // ── Droits des partenaires (panneau admin) ──
  var LIB_CAP = {
    'eleves.gerer': 'Inscrire et modifier les élèves', 'appel.faire': 'Faire l\'appel', 'appel.corriger': 'Corriger un appel de plus de 2 jours',
    'paiements.encaisser': 'Encaisser', 'paiements.voir': 'Voir les versements', 'caisse.corriger': 'Corriger la caisse (annuler, antidater)',
    'finances.voir': 'Voir le bilan', 'depenses.saisir': 'Saisir des dépenses', 'depenses.voir': 'Voir les dépenses',
    'enseignants.gerer': 'Contrats et paies des enseignants', 'comptes.gerer': 'Créer des comptes (secrétaires, enseignants)', 'journal.voir': 'Lire le journal',
    'stats.voir': 'Voir les statistiques', 'emploi.gerer': 'Modifier l\'emploi du temps', 'tarifs.fixer': 'Fixer les tarifs', 'remises.accorder': 'Accorder des remises',
    'agenda.gerer': 'Gérer l\'agenda (rendez-vous, rencontres)'
  };
  var CAP_ECRITURE = ['eleves.gerer', 'appel.faire', 'appel.corriger', 'paiements.encaisser', 'caisse.corriger', 'depenses.saisir',
    'enseignants.gerer', 'comptes.gerer', 'emploi.gerer', 'tarifs.fixer', 'remises.accorder', 'agenda.gerer'];
  function capsDuCompte(u) {
    var caps = {};
    Object.keys(u.acces || {}).forEach(function (c) { (E.profil.capacites[u.acces[c]] || []).forEach(function (k) { if (k !== 'centre.voir') caps[k] = 1; }); });
    return Object.keys(caps).sort(function (a, b) { return Object.keys(LIB_CAP).indexOf(a) - Object.keys(LIB_CAP).indexOf(b); });
  }
  function chargerDroits() {
    api('comptes').then(function (r) {
      E.cache.comptes = r.comptes;
      var z = $('#zone-droits');
      if (!z) return;
      var parts = r.comptes.filter(function (u) { return !u.admin_global && Object.keys(u.acces).some(function (c) { return ['responsable', 'actionnaire', 'secretaire'].indexOf(u.acces[c]) >= 0; }); });
      z.innerHTML = parts.length ? '<div class="liste">' + parts.map(function (u) {
        var caps = capsDuCompte(u);
        var retires = (u.restrictions || []).filter(function (k) { return caps.indexOf(k) >= 0; });
        var etat = !u.actif ? '<span class="badge danger">désactivé</span>' : retires.length === 0 ? '<span class="badge ok">tous ses droits</span>'
          : caps.every(function (k) { return CAP_ECRITURE.indexOf(k) < 0 || retires.indexOf(k) >= 0; }) ? '<span class="badge danger">lecture seule</span>'
          : '<span class="badge alerte">' + retires.length + ' droit' + (retires.length > 1 ? 's' : '') + ' retiré' + (retires.length > 1 ? 's' : '') + '</span>';
        var roles = Object.keys(u.acces).map(function (c) { return ROLES[u.acces[c]] + ' · ' + ((ligne('centres', c) || {}).nom_court || ''); }).join(', ');
        return '<button class="ligne" type="button" data-a="droits" data-id="' + esc(u.id) + '"><span class="avatar">' + esc(initiales(u.nom)) + '</span><span class="corps"><b>' + esc(u.nom) + '</b><small>' + esc(roles) + '</small></span>' + etat + '</button>';
      }).join('') + '</div>' : '<div class="carte vide">Aucun partenaire pour l\'instant.</div>';
    }, function (e) { horsLigne('#zone-droits', e); });
  }
  function feuilleDroits(uid) {
    var u = (E.cache.comptes || []).filter(function (x) { return x.id === uid; })[0];
    if (!u) return;
    var caps = capsDuCompte(u);
    ouvrirFeuille('<h2>Droits de ' + esc(u.nom) + '</h2><p class="doux">Décochez ce que ce compte ne doit plus faire, dans tous ses centres.</p>' +
      '<div class="actions"><button class="btn clair petit" type="button" data-a="droits-preset" data-v="lecture">Lecture seule</button><button class="btn clair petit" type="button" data-a="droits-preset" data-v="tout">Tout autoriser</button></div>' +
      '<form data-f="droits" data-id="' + esc(uid) + '">' + caps.map(function (k) {
        return '<label class="case"><input type="checkbox" name="cap" value="' + esc(k) + '"' + ((u.restrictions || []).indexOf(k) < 0 ? ' checked' : '') + (CAP_ECRITURE.indexOf(k) >= 0 ? ' data-ecriture="1"' : '') + '> ' + esc(LIB_CAP[k] || k) + '</label>';
      }).join('') +
      '<label class="case"><input type="checkbox" name="actif"' + (u.actif ? ' checked' : '') + '> Compte actif (décocher le déconnecte partout)</label>' +
      '<div class="actions"><button class="btn" type="submit">Enregistrer les droits</button><button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
  }

  function feuilleCompte(id, preset) {
    var u = id ? (E.cache.comptes || []).filter(function (x) { return x.id === id; })[0] : null;
    var centres = lignes('centres');
    var rolesPermis = function (cid) {
      if (estAdmin()) return Object.keys(ROLES);
      return peut('comptes.gerer', cid) ? ['secretaire', 'enseignant'] : [];
    };
    var h = '<h2>' + (u ? 'Modifier le compte' : preset && preset.role === 'enseignant' ? 'Nouvel enseignant' : 'Nouveau compte') + '</h2>' +
      (u ? '' : '<p class="doux">Un mot de passe sera créé et affiché une seule fois, à transmettre par WhatsApp.</p>') + '<form data-f="compte" data-id="' + esc(id || '') + '">' +
      '<label class="champ"><span>Nom et prénom</span><input type="text" name="nom" required value="' + esc(u ? u.nom : (preset && preset.nom) || '') + '"' + (u ? '' : ' data-input="apercu-ident" placeholder="ex. : ESSOMBA Paul"') + '></label>' +
      (u ? '<div class="deux"><label class="champ"><span>Identifiant</span><input type="text" name="identifiant" required autocapitalize="none" spellcheck="false" pattern="[a-z0-9._\\-]{3,60}" value="' + esc(u.identifiant) + '"><small>ex. : marie.ndogpassi3</small></label>' +
          '<label class="champ"><span>Téléphone</span><input type="tel" name="tel" value="' + esc(u.tel || '') + '"></label></div>'
        // Nouveau compte : l'identifiant se fait tout seul à partir du nom ; on peut le choisir si on veut.
        : '<label class="champ"><span>Téléphone</span><input type="tel" name="tel" inputmode="tel" value="' + esc((preset && preset.tel) || '') + '"></label>' +
          '<p class="doux ident-auto">' + ico('user', 'p') + ' Identifiant créé automatiquement : <b id="apercu-ident">à partir du nom</b></p>' +
          '<details class="ident-perso"><summary>Choisir l\'identifiant moi-même</summary><label class="champ"><span>Identifiant</span><input type="text" name="identifiant" autocapitalize="none" spellcheck="false" pattern="[a-z0-9._\\-]{3,60}" placeholder="ex. : marie.ndogpassi3"></label></details>') +
      '<h3>Centre et rôle</h3><p class="doux">' + ico('building', 'p') + ' Les centres sont <b>indépendants</b> : un compte ne travaille que dans un centre. ' +
      'Une personne présente dans les deux centres a <b>un compte dans chacun</b> (identifiants différents) : rien n\'est mélangé.</p>';
    var accesU = u ? Object.keys(u.acces || {}) : [];
    var centresVus = centres.filter(function (c) { return rolesPermis(c.id).length || accesU.indexOf(c.id) >= 0; });
    var centreActuel = accesU[0] || (preset && preset.centre) || (centresVus[0] || {}).id || '';
    if (accesU.length > 1) {
      h += '<div class="carte note-carte">' + ico('alert', 'p') + ' Ce compte a encore accès à plusieurs centres (ancien réglage). En enregistrant, il ne garde que le centre choisi ci-dessous. ' +
        'Pour l\'autre centre, créez son compte séparé avec le bouton plus bas.</div>';
    }
    var roleActuel = u ? (u.acces || {})[centreActuel] || '' : (preset && preset.role) || '';
    var rolesVus = Object.keys(ROLES).filter(function (r) { return r === roleActuel || centresVus.some(function (c) { return rolesPermis(c.id).indexOf(r) >= 0; }); });
    h += '<div class="deux"><label class="champ"><span>Centre</span><select name="centre_id">' +
      (estAdmin() ? '<option value=""' + (u && !accesU.length ? ' selected' : '') + '>Aucun (administrateur seulement)</option>' : '') +
      centresVus.map(function (c) { return '<option value="' + esc(c.id) + '"' + (c.id === centreActuel && !(u && !accesU.length) ? ' selected' : '') + '>' + esc(c.nom) + '</option>'; }).join('') + '</select></label>' +
      '<label class="champ"><span>Rôle</span><select name="role">' + rolesVus.map(function (r) {
        return '<option value="' + r + '"' + (r === (roleActuel || 'enseignant') ? ' selected' : '') + '>' + esc(ROLES[r]) + '</option>';
      }).join('') + '</select></label></div>' +
      // Trésorier : désigné par l'admin, un par centre (il garde les fonds et confirme les remises).
      (estAdmin() ? '<label class="case tresorier"><input type="checkbox" name="tresorier"' + (u && accesU.some(function (cid) { return tresorierDe(cid) === u.id; }) ? ' checked' : '') + '> ' +
        ico('wallet', 'p') + ' Trésorier de ce centre <small>(remplace le trésorier actuel s\'il y en a un)</small></label>' : '');
    var siennes = u ? u.matieres || [] : (preset && preset.matieres) || [];
    h += '<h3>Matières enseignées</h3><p class="doux">Pour les enseignants : elles les proposent en premier dans l\'emploi du temps.</p><div class="deux">' +
      lignes('matieres').map(function (m) { return '<label class="case"><input type="checkbox" name="matiere" value="' + esc(m.id) + '"' + (siennes.indexOf(m.id) >= 0 ? ' checked' : '') + '> ' + esc(m.nom) + '</label>'; }).join('') + '</div>';
    if (estAdmin()) h += '<label class="case"><input type="checkbox" name="admin_global"' + (u && u.admin_global ? ' checked' : '') + '> Administrateur des deux centres (vue consolidée, finances, tous les réglages)</label>';
    if (u) h += '<label class="case"><input type="checkbox" name="actif"' + (u.actif ? ' checked' : '') + '> Compte actif (décocher coupe immédiatement ses sessions)</label>';
    h += (estAdmin() ? '<p class="doux">' + ico('wallet', 'p') + ' <b>Trésorier</b> : cochez la case sous le centre. Il garde les fonds du centre et confirme chaque remise des partenaires.</p>' : '') +
      '<div class="legende-roles">' + ORDRE_ROLES.filter(function (r) { return estAdmin() || centres.some(function (c) { return rolesPermis(c.id).indexOf(r) >= 0; }); }).map(function (r) {
      var f = ficheRole(r);
      return '<div class="espace-' + f.espace + '">' + ico(ESPACES[f.espace].ico, 'p') + '<span><b>' + esc(f.nom) + '</b> ' + esc(f.resume) + '</span></div>';
    }).join('') + '</div>' +
      '<div class="actions"><button class="btn" type="submit">' + (u ? 'Enregistrer' : 'Créer le compte') + '</button><button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>';
    if (u) {
      h += '<div class="actions"><button class="btn clair petit" type="button" data-a="reinit-mdp" data-id="' + esc(u.id) + '">Nouveau mot de passe</button>' +
        '<button class="btn clair petit" type="button" data-a="envoyer-guide" data-id="' + esc(u.id) + '">Renvoyer le mode d\'emploi</button>' +
        '<button class="btn clair petit" type="button" data-a="appareils" data-id="' + esc(u.id) + '">Appareils connectés</button>' +
        // La même personne dans l'autre centre : un compte séparé, pré-rempli.
        centresVus.filter(function (c) { return c.id !== centreActuel; }).map(function (c) {
          return '<button class="btn clair petit" type="button" data-a="compte-autre-centre" data-id="' + esc(u.id) + '" data-v="' + esc(c.id) + '">' + ico('plus', 'p') + ' Son compte pour ' + esc(c.nom_court || c.nom) + '</button>';
        }).join('') + '</div>';
    }
    ouvrirFeuille(h);
  }

  // ── Mode d'emploi envoyé avec les identifiants (texte WhatsApp : *gras*) ──
  var GUIDE_ROLE = {
    admin: ['Accueil : les chiffres clés de tous les centres.', 'Plus › Administration : comptes et identifiants, droits des partenaires, centres, journal.', 'Plus › Rôles et droits : qui peut faire quoi.'],
    responsable: ['*Accueil* : élèves, appels du jour, encaissé du mois, impayés de votre centre.', '*Élèves › +* : inscrire un élève (classe, matières, tarif).',
      '*Caisse › Encaisser* : cherchez l\'élève, saisissez le montant, envoyez le reçu au parent par WhatsApp.', '*Caisse › Impayés* : relancez les parents en un geste.',
      '*Caisse › Dépenses* : saisissez les dépenses. Photo du justificatif *obligatoire dès 10 000 F*. Vous validez les dépenses saisies par les autres.',
      '*Appel › Enseignants du jour* : après le cours, touchez *Payer* (1 500 F de l\'heure sauf contrat) ; l\'argent sort de votre caisse.',
      '*Caisse › Remises* : remettez au trésorier l\'argent encaissé, *avant la fin du mois* ; il confirme la réception.',
      '*Plus › Enseignants* : pointage des cours, contrats, paies.', '*Plus › Comptes et accès* : créez les comptes de vos secrétaires et enseignants.', '*Plus › Agenda* : rendez-vous, rencontres, échéances ; la cloche en haut rappelle ce qui approche.', '*Plus › Équipe* : messages entre partenaires, commentaires, dates de réunion, tâches.'],
    actionnaire: ['*Accueil* : les chiffres clés de votre centre (élèves, appels, encaissé, impayés).', '*Plus › Bilan* : recettes, dépenses, résultat du mois et votre part.',
      '*Appel* : choisissez la classe, touchez chaque élève (présent, retard, absent) ; prévenez les parents des absences.',
      '*Caisse › Impayés* : « Échéance proche » pour un rappel avant la date, puis les impayés à relancer — au parent ou à l\'élève.',
      '*Élèves › +* : inscrivez un élève (classe, matières, tarif de la classe).',
      '*Caisse › Encaisser* : quand vous êtes au centre ou qu\'un parent vous paie, encaissez inscription ou mensualité et envoyez-lui le reçu par WhatsApp.',
      '*Plus › Enseignants* : « Ajouter un enseignant », son contrat, sa paie du mois.',
      '*Appel › Enseignants du jour* : si vous êtes présent, payez l\'enseignant juste après son cours (*Payer*, 1 500 F de l\'heure).',
      '*Caisse › Remises* : remettez cet argent au trésorier *avant la fin du mois* ; il confirme la réception.', '*Plus › Planning* : vous tenez l\'emploi du temps du centre (classes, créneaux, enseignants).', '*Plus › Agenda* : rendez-vous et rencontres ; la cloche en haut rappelle ce qui approche.', '*Plus › Équipe* : messages entre partenaires, commentaires, dates de réunion, tâches.'],
    secretaire: ['*Appel* : choisissez la classe, touchez chaque élève (présent, retard, absent), au début du cours.', '*Élèves › +* : inscrire un élève.',
      '*Caisse › Encaisser* : un reçu numéroté part au parent par WhatsApp. Un versement ne se modifie pas : en cas d\'erreur, prévenez le responsable.',
      '*Caisse › Dépenses* : photo du justificatif *obligatoire dès 10 000 F*.', '*Appel › Enseignants du jour* : après le cours, touchez *Payer* (1 500 F de l\'heure).', '*Caisse › Remises* : remettez l\'argent encaissé au trésorier avant la fin du mois.', '*Plus › Agenda* : notez les rendez-vous ; la cloche en haut rappelle échéances et rencontres.', '*Plus › Équipe* : messages entre partenaires, commentaires, réunions, tâches.'],
    enseignant: ['*Accueil › Mes cours aujourd\'hui* : touchez votre cours pour faire l\'appel, au début du cours.', '*Planning* : votre emploi du temps de la semaine.',
      '*Paie* : 1 500 F de l\'heure (sauf contrat), versés juste après le cours par le partenaire présent.', '*Plus › Mes heures* : heures faites, montant dû, paies reçues.']
  };
  /** acces : { centre_id: rôle } ; renvoie le texte du mode d'emploi pour ce compte. */
  function modeEmploi(nom, acces, admin) {
    var roles = Object.keys(acces || {}).map(function (c) { return acces[c]; });
    var principal = admin ? 'admin' : ORDRE_ROLES.filter(function (r) { return roles.indexOf(r) >= 0; })[0] || 'enseignant';
    var ou = admin ? 'tous les centres' : Object.keys(acces || {}).map(function (c) { var k = ligne('centres', c) || {}; return (ROLES[acces[c]] || acces[c]) + ' · ' + (k.nom_court || k.nom || 'centre'); }).join(', ');
    return '*Mode d\'emploi*\n' +
      '1. Ouvrez l\'adresse dans Chrome et connectez-vous.\n' +
      '2. Menu ⋮ › « Ajouter à l\'écran d\'accueil » : l\'appli s\'ouvre comme une application, même sans réseau.\n' +
      '3. Plus › *Changer mon mot de passe*, puis Plus › *Code de verrouillage* (4 chiffres).\n\n' +
      '*Votre rôle : ' + (admin ? 'Administrateur' : ou) + '*\n' + GUIDE_ROLE[principal].map(function (l) { return '• ' + l; }).join('\n') + '\n\n' +
      'Sans réseau, tout continue : vos saisies partent dès le retour de la connexion (pastille « À jour » en haut).\n' +
      'Trésorier du centre : vous confirmez chaque remise dans *Caisse › Remises* (« Reçu » ou « Pas reçu »).\n' +
      'Plus › *Mon rôle* explique ce que votre compte permet. Une question : appelez l\'administrateur.';
  }
  function feuilleSecret(titre, nom, identifiant, mdp, acces, admin) {
    var guide = modeEmploi(nom, acces, admin);
    var message = '*VÉRITAS Gestion* — Bienvenue ' + nom + ' !\nAdresse : https://gestion.veritas-school.com\nIdentifiant : ' + identifiant + '\nMot de passe : ' + mdp +
      '\n(changez-le dès la première connexion)\n\n' + guide;
    E.cache.messageSecret = message;
    ouvrirFeuille('<h2>' + esc(titre) + '</h2><p>Transmettez ces informations à <b>' + esc(nom) + '</b>, avec son mode d\'emploi. Le mot de passe ne sera <b>plus jamais affiché</b>.</p>' +
      '<p class="doux">Identifiant</p><div class="secret">' + esc(identifiant) + '</div><p class="doux">Mot de passe</p><div class="secret">' + esc(mdp) + '</div>' +
      '<details class="apercu-guide"><summary>Voir le message envoyé (identifiants + mode d\'emploi)</summary><pre>' + esc(message) + '</pre></details>' +
      '<div class="actions">' + (NATIF || navigator.share ? '<button class="btn or" type="button" data-a="partager-secret">Envoyer (WhatsApp, SMS…)</button>' :
        '<a class="btn or" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(message) + '">Envoyer par WhatsApp</a>') +
      '<button class="btn clair" type="button" data-a="copier-secret">Copier</button><button class="btn" type="button" data-a="fermer">J\'ai transmis</button></div>');
  }
  /** Renvoyer le mode d'emploi seul (sans mot de passe) à un compte existant. */
  function envoyerGuide(u) {
    var message = '*VÉRITAS Gestion* — ' + u.nom + '\nAdresse : https://gestion.veritas-school.com\nIdentifiant : ' + u.identifiant + '\n\n' + modeEmploi(u.nom, u.acces, u.admin_global);
    if (NATIF || navigator.share) partagerTexte(message);
    else window.open('https://wa.me/?text=' + encodeURIComponent(message), '_blank', 'noopener');
  }

  function feuilleAppareils(uid) {
    ouvrirFeuille('<h2>Appareils connectés</h2><div id="zone-appareils"><p class="doux">Chargement…</p></div><div class="actions"><button class="btn clair" type="button" data-a="fermer">Fermer</button></div>');
    api('sessions', null, uid ? { id: uid } : {}).then(function (r) {
      var z = $('#zone-appareils');
      if (!z) return;
      z.innerHTML = r.sessions.length ? '<div class="liste">' + r.sessions.map(function (s) {
        return '<div class="ligne"><span class="corps"><b>' + esc(s.appareil || 'Appareil') + (s.courante ? ' <span class="badge ok">celui-ci</span>' : '') + '</b><small>Connecté le ' + dateLisible(s.cree_le) + ' · vu le ' + dateLisible(s.vu_le) + '</small></span>' +
          (s.courante ? '' : '<button class="btn danger petit" type="button" data-a="revoquer" data-id="' + esc(s.id) + '" data-uid="' + esc(uid || '') + '">Déconnecter</button>') + '</div>';
      }).join('') + '</div>' : '<p class="vide">Aucun appareil connecté.</p>';
    }, function (e) { var z = $('#zone-appareils'); if (z) z.innerHTML = '<p class="erreur">' + esc(e.message) + '</p>'; });
  }

  // ───────────────────────────── Écrans en ligne : journal ─────────────────────────────
  var LIBELLES_JOURNAL = {
    connexion: 'Connexion', deconnexion: 'Déconnexion', connexion_echec: 'Connexion refusée (mauvais mot de passe)',
    creation: 'Création', modification: 'Modification', suppression: 'Suppression',
    compte_cree: 'Compte créé', compte_modifie: 'Compte modifié', mdp_reinitialise: 'Mot de passe réinitialisé',
    mdp_change: 'Mot de passe changé', session_revoquee: 'Appareil déconnecté', installation: 'Installation', admin_installe: 'Administrateur installé'
  };
  var LIBELLES_ENTITE = { g_centres: 'centre', g_annees: 'année', g_actionnaires: 'actionnaire', utilisateur: 'compte' };

  function chargerJournal(suite) {
    var params = { limite: 50 };
    if (E.centre !== '*') params.centre = E.centre;
    if (suite && E.cache.journal && E.cache.journal.length) { var der = E.cache.journal[E.cache.journal.length - 1]; params.avant = der.le; params.avant_id = der.id; }
    api('journal', null, params).then(function (r) {
      E.cache.journal = suite ? (E.cache.journal || []).concat(r.lignes) : r.lignes;
      E.cache.journalFini = r.lignes.length < 50;
      dessinerJournal();
    }, function (e) { horsLigne('#zone-journal', e); });
  }
  function resumeDiff(l) {
    var av = {}, ap = {};
    try { av = l.avant ? JSON.parse(l.avant) : {}; } catch (e) { av = {}; }
    try { ap = l.apres ? JSON.parse(l.apres) : {}; } catch (e) { ap = {}; }
    var cles = Object.keys(ap).concat(Object.keys(av).filter(function (k) { return !(k in ap); }))
      .filter(function (k) { return ['rev', 'maj_par', 'maj_le', 'id'].indexOf(k) < 0; }).slice(0, 6);
    return cles.map(function (k) {
      var a = av[k], b = ap[k];
      var f = function (v) { return typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v); };
      return esc(k) + ' : ' + (a !== undefined && a !== null ? '<del>' + esc(f(a)) + '</del> ' : '') + (b !== undefined ? '<ins>' + esc(f(b)) + '</ins>' : '');
    }).join(' · ');
  }
  function dessinerJournal() {
    var z = $('#zone-journal');
    if (!z) return;
    var lignesJ = E.cache.journal || [];
    if (!lignesJ.length) { z.innerHTML = '<div class="carte vide">Rien pour l\'instant.</div>'; return; }
    var h = '', jour = '';
    lignesJ.forEach(function (l) {
      var j = String(l.le).slice(0, 10);
      if (j !== jour) { if (jour) h += '</div>'; jour = j; h += '<p class="jour">' + esc(jourLisible(l.le)) + '</p><div class="liste">'; }
      var c = l.centre_id ? ligne('centres', l.centre_id) : null;
      var d = resumeDiff(l);
      h += '<div class="ligne"><span class="corps"><b>' + esc(LIBELLES_JOURNAL[l.action] || l.action) + (l.entite ? ' · ' + esc(LIBELLES_ENTITE[l.entite] || l.entite) : '') + '</b>' +
        '<small>' + esc(l.identifiant || (l.action === 'connexion_echec' ? l.entite_id : 'système')) + ' · ' + esc(String(l.le).slice(11, 16).replace(':', ' h ')) + (c ? ' · ' + esc(c.nom_court || c.nom) : '') + '</small>' +
        (d ? '<div class="diff">' + d + '</div>' : '') + '</span></div>';
    });
    h += '</div>';
    if (!E.cache.journalFini) h += '<div class="actions"><button class="btn clair" type="button" data-a="journal-suite">Voir plus ancien</button></div>';
    z.innerHTML = h;
  }

  // ───────────────────────────── Feuilles de réglages ─────────────────────────────
  function feuilleCentre(id) {
    var c = id ? ligne('centres', id) : { tolerance_retard_min: 5, alerte_appel_min: 15, alerte_direction_min: 30, jour_echeance: 10, devise: 'Compétence - Rigueur - Réussite' };
    var n = function (k) { return esc(c[k] == null ? '' : c[k]); };
    ouvrirFeuille('<h2>' + (id ? esc(c.nom) : 'Nouveau centre') + '</h2><form data-f="centre" data-id="' + esc(id || '') + '">' +
      '<label class="champ"><span>Nom complet</span><input type="text" name="nom" required value="' + n('nom') + '"></label>' +
      '<label class="champ"><span>Nom court</span><input type="text" name="nom_court" required value="' + n('nom_court') + '"><small>Affiché dans le sélecteur, ex. : Ndog-passi III</small></label>' +
      '<label class="champ"><span>Adresse (imprimée sur les reçus)</span><input type="text" name="adresse" value="' + n('adresse') + '"></label>' +
      '<label class="champ"><span>Téléphones</span><input type="text" name="telephones" value="' + n('telephones') + '"></label>' +
      (id ? (function () {
        var vus = {}, choix = E.equipe.filter(function (e) { if (e.centre_id !== id || vus[e.id] || e.role === 'enseignant') return false; vus[e.id] = 1; return true; });
        if (!vus[E.profil.utilisateur.id]) choix.unshift({ id: E.profil.utilisateur.id, nom: E.profil.utilisateur.nom + ' (vous)' });
        return '<label class="champ"><span>Trésorier du centre</span><select name="tresorier_id"><option value="">— Aucun —</option>' + choix.map(function (e) {
          return '<option value="' + esc(e.id) + '"' + (c.tresorier_id === e.id ? ' selected' : '') + '>' + esc(e.nom) + (e.role ? ' · ' + esc(e.role === 'admin' ? 'Administrateur' : ROLES[e.role] || e.role) : '') + '</option>';
        }).join('') + '</select><small>Il garde les fonds et confirme chaque remise des partenaires.</small></label>';
      })() : '') +
      (id && estAdmin() ? '<label class="champ"><span>Début des comptes</span><input type="date" name="debut_comptes" value="' + n('debut_comptes') + '"><small>Ce qui a été encaissé, dépensé ou remis avant cette date ne compte plus pour les partenaires (caisse, remises, partage). ' +
        'Les dettes des élèves restent dues. Vide : tout compte.</small></label>' : '') +
      '<label class="champ"><span>Devise</span><input type="text" name="devise" value="' + n('devise') + '"></label>' +
      '<div class="deux"><label class="champ"><span>Retard au-delà de (min)</span><input type="number" name="tolerance_retard_min" min="0" max="60" required value="' + n('tolerance_retard_min') + '"></label>' +
      '<label class="champ"><span>Échéance : le … du mois</span><input type="number" name="jour_echeance" min="1" max="28" required value="' + n('jour_echeance') + '"></label></div>' +
      '<div class="deux"><label class="champ"><span>Appel non fait : alerte responsable après (min)</span><input type="number" name="alerte_appel_min" min="5" max="120" required value="' + n('alerte_appel_min') + '"></label>' +
      '<label class="champ"><span>Puis alerte administrateur après (min)</span><input type="number" name="alerte_direction_min" min="5" max="240" required value="' + n('alerte_direction_min') + '"></label></div>' +
      '<h3>Messages aux parents</h3><p class="doux">Variables : {eleve} {parent} {classe} {date} {horaire} {debut} {arrivee} {minutes} {centre} {tel_centre}. Laisser vide pour le modèle par défaut.</p>' +
      '<label class="champ"><span>Absence</span><textarea name="msg_absence" rows="3" placeholder="' + esc(MODELES.absence) + '">' + n('msg_absence') + '</textarea></label>' +
      '<label class="champ"><span>Retard</span><textarea name="msg_retard" rows="3" placeholder="' + esc(MODELES.retard) + '">' + n('msg_retard') + '</textarea></label>' +
      '<label class="champ"><span>Relance d\'impayé</span><textarea name="msg_relance" rows="3" placeholder="Variables : {parent} {eleve} {classe} {montant} {mois} {jour} {centre} {tel_centre}">' + n('msg_relance') + '</textarea></label>' +
      '<label class="champ"><span>Accusé de réception d\'un versement</span><textarea name="msg_recu" rows="3" placeholder="Variables : {parent} {eleve} {classe} {montant} {numero} {date} {couvre} {reste} {centre}">' + n('msg_recu') + '</textarea></label>' +
      '<h3>Option d\'inscription</h3><div class="deux"><label class="champ"><span>Montant (F)</span><input type="number" name="inscription_option" min="0" value="' + (Number(c.inscription_option) || '') + '" placeholder="aucune"></label>' +
      '<label class="champ"><span>Libellé</span><input type="text" name="inscription_option_libelle" value="' + n('inscription_option_libelle') + '" placeholder="avec Mon cahier de français"></label></div>' +
      '<div class="actions"><button class="btn" type="submit">Enregistrer</button><button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
  }

  function feuilleAnnee(id) {
    var a = id ? ligne('annees', id) : { libelle: '', debut: '', fin: '', mois_factures: '10,11,12,1,2,3,4,5', active: 1 };
    var factures = String(a.mois_factures || '').split(',');
    var ordre = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8];
    ouvrirFeuille('<h2>' + (id ? 'Année ' + esc(a.libelle) : 'Nouvelle année') + '</h2><form data-f="annee" data-id="' + esc(id || '') + '">' +
      '<label class="champ"><span>Libellé</span><input type="text" name="libelle" required pattern="\\d{4}-\\d{4}" placeholder="2027-2028" value="' + esc(a.libelle) + '"></label>' +
      '<div class="deux"><label class="champ"><span>Début</span><input type="date" name="debut" value="' + esc(a.debut) + '"></label><label class="champ"><span>Fin</span><input type="date" name="fin" value="' + esc(a.fin) + '"></label></div>' +
      '<p><b>Mois facturés</b> <span class="doux">(la mensualité est due pour chacun)</span></p><div class="deux">' +
      ordre.map(function (m) { return '<label class="case"><input type="checkbox" name="mois" value="' + m + '"' + (factures.indexOf(String(m)) >= 0 ? ' checked' : '') + '> ' + MOIS[m - 1] + '</label>'; }).join('') +
      '</div><label class="case"><input type="checkbox" name="active"' + (Number(a.active) ? ' checked' : '') + '> Année en cours</label>' +
      '<div class="actions"><button class="btn" type="submit">Enregistrer</button><button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
  }

  function feuilleActionnaire(id, centreId) {
    var a = id ? ligne('actionnaires', id) : { nom: '', tel: '', part_centiemes: 0 };
    var c = ligne('centres', centreId);
    ouvrirFeuille('<h2>' + (id ? esc(a.nom) : 'Nouvel actionnaire') + '</h2><p class="doux">' + esc(c ? c.nom : '') + '</p><form data-f="actionnaire" data-id="' + esc(id || '') + '" data-centre="' + esc(centreId) + '">' +
      '<label class="champ"><span>Nom</span><input type="text" name="nom" required value="' + esc(a.nom) + '"></label>' +
      '<label class="champ"><span>Téléphone</span><input type="tel" name="tel" value="' + esc(a.tel || '') + '"></label>' +
      '<label class="champ"><span>Part (%)</span><input type="number" name="part" min="0" max="100" step="0.01" required value="' + ((Number(a.part_centiemes) || 0) / 100) + '"></label>' +
      '<p class="doux">Pour lui donner un accès en lecture, créez-lui un compte « Actionnaire » dans Comptes et accès.</p>' +
      '<div class="actions"><button class="btn" type="submit">Enregistrer</button>' + (id ? '<button class="btn danger" type="button" data-a="suppr-actionnaire" data-id="' + esc(id) + '">Retirer</button>' : '') +
      '<button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
  }

  // ───────────────────────────── Actions (clics) ─────────────────────────────
  var ACTIONS = {
    fermer: fermerFeuille,
    'homonyme-oui': function () { var f = E.cache.formEleve; fermerFeuilleSecondaire(); if (f) FORMULAIRES.eleve(f, true); },
    'homonyme-non': function () { fermerFeuilleSecondaire(); toast('Recherchez l\'élève dans la liste : sa fiche existe déjà.'); },
    'confirme-oui': function () { var s = confirmationEnCours; confirmationEnCours = null; fermerFeuille(); if (s) s(); },
    sync: function () { synchroniser().then(function () { if (E.enLigne) toast(E.sortie.length ? E.sortie.length + ' modification(s) encore en attente.' : 'Tout est à jour.'); else toast('Hors ligne : les modifications partiront au retour du réseau.', true); }); },
    deconnexion: deconnexion,
    'editer-centre': function (el) { feuilleCentre(el.dataset.id); },
    'editer-annee': function (el) { feuilleAnnee(el.dataset.id); },
    'editer-actionnaire': function (el) { if (estAdmin()) feuilleActionnaire(el.dataset.id, el.dataset.centre); },
    'suppr-actionnaire': function (el) {
      var a = ligne('actionnaires', el.dataset.id);
      if (a) confirmer('Retirer ' + a.nom + ' des actionnaires ?', 'Retirer', function () { muter('actionnaires', a.id, {}, true).then(rendre); });
    },
    // Le logo n'est ni un lien ni une image : l'appui long n'ouvre aucun menu du navigateur.
    'cdt-centre': function (el) { CDT.centre = el.dataset.v; CDT.classe = ''; rendre(); },
    'cdt-classe': function (el) { CDT.classe = el.dataset.v; rendre(); },
    'cdt-mode': function (el) { CDT.mode = el.dataset.v; rendre(); },
    'cdt-enseignant': function (el) { CDT.enseignant = el.dataset.v; rendre(); },
    'progression-ens': function (el) { fermerFeuille(); CDT.centre = ENS.centre; CDT.mode = 'enseignant'; CDT.enseignant = el.dataset.id; location.hash = '#/cahier'; },
    'export-cahier': function (el) {
      var parProf = CDT.enseignant && (CDT.mode === 'enseignant' || (!estAdmin() && roleDans(CDT.centre) === 'enseignant'));
      var l = parProf ? entreesEnseignant(CDT.centre, CDT.enseignant) : entreesCahier(CDT.centre, CDT.classe), c = ligne('centres', CDT.centre) || {};
      var titre = parProf ? 'Progression · ' + (nomPersonne(CDT.enseignant) || E.profil.utilisateur.nom) : 'Cahier de textes' + (CDT.classe ? ' · ' + nomDe('classes', CDT.classe) : ''), sous = (c.nom || '') + ' · au ' + dateLisible(isoLocal(new Date()), true);
      if (el.dataset.v === 'texte') { var t = texteCahier(l, titre); if (NATIF || navigator.share) partagerTexte(t); else window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener'); return; }
      el.disabled = true;
      var f = el.dataset.v === 'csv' ? fichierRapport({ cle: 'cahier-de-textes', titre: titre, sous: sous, colonnes: [{ lib: 'Date' }, { lib: 'Classe' }, { lib: 'Horaire' }, { lib: 'Matière' }, { lib: 'Enseignant' }, { lib: 'Ce qui a été fait' }, { lib: 'Travail donné' }],
          lignes: l.map(function (x) { return { cellules: [dateLisible(x.s.date, true), x.classe, (x.s.debut || '') + (x.s.fin ? '–' + x.s.fin : ''), x.matieres, x.profs, x.s.contenu || '', x.s.travail || ''] }; }), totaux: [l.length + ' séance(s)'], notes: [] }, 'csv')
        : pdfCahier(l, titre, sous);
      f.then(function (fi) { return partagerFichiers([fi], titre); }).catch(function (e) { toast('Export impossible : ' + (e && e.message), true); }).then(function () { el.disabled = false; });
    },
    'rap-centre': function (el) { RAP.centre = el.dataset.v; rendre(); },
    'rap-onglet': function (el) { RAP.onglet = el.dataset.v; rendre(); },
    'rap-mois': function (el) { RAP.mois = decalerMois(RAP.mois || moisCycle(), +el.dataset.v); rendre(); },
    'aller-rapport': function (el) { RAP.onglet = el.dataset.v; if (el.dataset.centre) RAP.centre = el.dataset.centre; if (location.hash === '#/rapports') rendre(); else location.hash = '#/rapports'; },
    'export-rapport': function (el) {
      var r = rapportCourant(RAP.centre);
      if (el.dataset.v === 'texte') { var t = texteRapport(r); if (NATIF || navigator.share) partagerTexte(t); else window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener'); return; }
      el.disabled = true;
      fichierRapport(r, el.dataset.v).then(function (f) { E.cache.dernierExport = f; return partagerFichiers([f], r.titre); })
        .catch(function (e) { toast('Export impossible : ' + (e && e.message), true); }).then(function () { el.disabled = false; });
    },
    'cloturer-mois': function (el) {
      var cid = el.dataset.centre, am = el.dataset.mois, c = ligne('centres', cid) || {};
      confirmer('Clôturer ' + libMoisAnnee(am) + ' pour ' + (c.nom_court || c.nom) + ' ? Les comptes et le partage sont arrêtés ; plus rien ne pourra être daté de ce mois. Un nouveau cycle commence.', 'Clôturer', function () {
        muter('clotures', idCloture(cid, am), { centre_id: cid, mois: am, parts: '[]', clos_par: E.profil.utilisateur.id, clos_le: maintenantSql() }).then(function () {
          return synchroniser();
        }).then(function () {
          var k = clotureDe(cid, am);
          rendre();
          if (k && !k._attente) confirmer('Mois clôturé. Envoyer les comptes et le partage aux partenaires ?', 'Envoyer', function () { var t = texteCloture(c, k); if (NATIF || navigator.share) partagerTexte(t); else window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener'); });
          else toast('Clôture enregistrée ; elle partira au retour du réseau.');
        });
      });
    },
    'partager-cloture': function (el) {
      var c = ligne('centres', el.dataset.centre) || {}, k = clotureDe(el.dataset.centre, el.dataset.mois);
      if (!k) return;
      var t = texteCloture(c, k);
      if (NATIF || navigator.share) partagerTexte(t); else window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener');
    },
    'rouvrir-mois': function (el) {
      var k = clotureDe(el.dataset.centre, el.dataset.mois);
      if (k) confirmer('Rouvrir ' + libMoisAnnee(el.dataset.mois) + ' ? Les écritures de ce mois redeviennent possibles ; pensez à clôturer de nouveau.', 'Rouvrir', function () {
        muter('clotures', k.id, {}, true).then(function () { toast('Mois rouvert.'); rendre(); });
      });
    },
    'eq-centre': function (el) { EQ.centre = el.dataset.v; rendre(); },
    'eq-onglet': function (el) { EQ.onglet = el.dataset.v; rendre(); },
    'ouvrir-fil': function (el) { feuilleFil(el.dataset.centre, el.dataset.fil, el.dataset.titre); },
    'suppr-message': function (el) {
      var m = ligne('messages', el.dataset.id);
      if (m) confirmer('Supprimer ce message ?', 'Supprimer', function () {
        muter('messages', m.id, {}, true).then(function () { var fo = E.cache.filOuvert; if (fo && $('#zone-fil')) $('#zone-fil').innerHTML = bullesFil(fo.cid, fo.fil); else rendre(); });
      });
    },
    'nouveau-sondage': function () { feuilleNouveauSondage(); },
    'voir-sondage': function (el) { feuilleSondage(el.dataset.id); },
    dispo: function (el) {
      var s = ligne('sondages', el.dataset.id); if (!s || s.statut !== 'ouvert') return;
      var moi = E.profil.utilisateur.id, d = dispoDe(s, moi), r = reponsesDe(d);
      r[el.dataset.o] = el.dataset.v;
      muter('dispos', d ? d.id : nouvelId(), { centre_id: s.centre_id, sondage_id: s.id, reponses: JSON.stringify(r), utilisateur_id: moi }).then(function () { feuilleSondage(s.id); majCloche(); });
    },
    'fixer-sondage': function (el) {
      var s = ligne('sondages', el.dataset.id), o = el.dataset.o; if (!s) return;
      confirmer('Retenir ' + libOption(o) + ' pour « ' + s.titre + ' » ? La réunion part dans l\'agenda du centre.', 'Retenir', function () {
        var suite = Promise.resolve(''), evId = '';
        if (peutAgenda(s.centre_id)) {
          evId = nouvelId();
          suite = muter('evenements', evId, { centre_id: s.centre_id, titre: s.titre, type: 'rencontre', date: o.slice(0, 10), heure: o.slice(11, 16), fin: '', lieu: s.lieu || '', note: s.note || '', rappel_min: 1440 });
        }
        suite.then(function () { return muter('sondages', s.id, { statut: 'clos', choix: o, evenement_id: evId }); })
          .then(function () { fermerFeuille(); toast('Réunion fixée' + (evId ? ' et ajoutée à l\'agenda.' : '.')); rendre(); });
      });
    },
    'suppr-sondage': function (el) {
      var s = ligne('sondages', el.dataset.id);
      if (s) confirmer('Supprimer la réunion « ' + s.titre + ' » ?', 'Supprimer', function () { muter('sondages', s.id, {}, true).then(function () { fermerFeuille(); rendre(); }); });
    },
    'editer-tache': function (el) { feuilleTache(el.dataset.id); },
    'avancer-tache': function (el) {
      var t = ligne('taches', el.dataset.id);
      if (t) muter('taches', t.id, { statut: el.dataset.v }).then(function () { toast(el.dataset.v === 'fait' ? 'Tâche faite.' : 'Tâche commencée.'); rendre(); });
    },
    'suppr-tache': function (el) {
      var t = ligne('taches', el.dataset.id);
      if (t) confirmer('Supprimer la tâche « ' + t.titre + ' » ?', 'Supprimer', function () { muter('taches', t.id, {}, true).then(function () { fermerFeuille(); rendre(); }); });
    },
    'payer-cours': function (el) {
      var p = ligne('presences_ens', el.dataset.pe), c = ligne('creneaux', el.dataset.cr);
      var mc = montantCours(p);
      if (!p || !c || !mc) return;
      if (paieDuCours(p.id)) { toast('Ce cours est déjà payé.', true); return; }
      var nom = nomPersonne(mc.prof) || 'l\'enseignant';
      confirmer('Payer ' + fcfa(mc.montant) + ' à ' + nom + ' pour le cours de ' + nomDe('classes', c.classe_id) + ' (' + mc.calcul + ') ? L\'argent sort de votre caisse.', 'Payer', function () {
        var auj = isoLocal(new Date());
        muter('paies', idPaieCours(p.id), { centre_id: p.centre_id, enseignant_id: mc.prof, mois: p.date.slice(0, 7), montant: mc.montant, date: auj < p.date ? p.date : auj, mode: 'especes',
          note: 'Cours du ' + dateLisible(p.date, true) + ' · ' + nomDe('classes', c.classe_id) + ' · ' + mc.calcul, presence_id: p.id }).then(function () {
          rendre();
          // Le reçu de paie, prêt à envoyer (WhatsApp, image, PDF) : l'enseignant signe qu'il a reçu la somme.
          feuilleBon('paie', idPaieCours(p.id));
        });
      });
    },
    'editer-remise': function (el) {
      if (!E.enLigne && !el.dataset.id) { /* hors ligne : la remise part au retour du réseau */ }
      feuilleRemise(el.dataset.id || '', CAI.centre, el.dataset.montant);
    },
    'suppr-remise': function (el) {
      var r = ligne('remises', el.dataset.id);
      if (r) confirmer('Retirer la remise de ' + fcfa(r.montant) + ' ?', 'Retirer', function () { muter('remises', r.id, {}, true).then(function () { toast('Remise retirée.'); rendre(); }); });
    },
    'remise-recue': function (el) {
      var r = ligne('remises', el.dataset.id);
      if (r) confirmer('Confirmer avoir reçu ' + fcfa(r.montant) + ' de ' + nomCompte(r.remis_par) + ' ?', 'Oui, reçu', function () {
        muter('remises', r.id, { statut: 'confirmee' }).then(function () { toast('Réception confirmée.'); rendre(); });
      });
    },
    'remise-contester': function (el) {
      var r = ligne('remises', el.dataset.id);
      if (!r) return;
      ouvrirFeuille('<h2>Remise non reçue</h2><p>' + esc(nomCompte(r.remis_par)) + ' déclare vous avoir remis <b>' + fcfa(r.montant) + '</b> le ' + esc(dateLisible(r.date, true)) + '.</p>' +
        '<form data-f="contestation" data-id="' + esc(r.id) + '"><label class="champ"><span>Motif</span><input type="text" name="motif" required minlength="4" maxlength="200" placeholder="ex. : rien reçu, montant différent (reçu 20 000 F)"></label>' +
        '<div class="actions"><button class="btn danger" type="submit">Signaler « pas reçu »</button><button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
    },
    'remise-prevenir': function (el) {
      var r = ligne('remises', el.dataset.id);
      if (!r) return;
      var t = messageRemise(r);
      if (NATIF || navigator.share) partagerTexte(t); else window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener');
    },
    'ag-mois': function (el) { AG.mois = decalerMois(AG.mois, +el.dataset.v); AG.jour = ''; rendre(); },
    'ag-jour': function (el) { AG.jour = AG.jour === el.dataset.v ? '' : el.dataset.v; rendre(); },
    'voir-evenement': function (el) { feuilleVoirEvenement(el.dataset.id, el.dataset.date); },
    'editer-evenement': function (el) { feuilleEvenement(el.dataset.id || '', el.dataset.date); },
    'suppr-evenement': function (el) {
      var e = ligne('evenements', el.dataset.id);
      if (e) confirmer('Supprimer « ' + e.titre + ' » ?', 'Supprimer', function () { muter('evenements', e.id, {}, true).then(function () { toast('Rendez-vous supprimé.'); rendre(); }); });
    },
    'ag-ics': function (el) {
      var x = elementsAgenda(el.dataset.date, el.dataset.date).filter(function (y) { return y.id === el.dataset.id; })[0];
      if (x) partagerIcs([x], 'rdv-' + x.date + '-' + x.titre);
    },
    'ag-ics-tout': function () { var auj = isoLocal(new Date()); partagerIcs(elementsAgenda(auj, decalerJour(auj, 45)), 'agenda-veritas-' + auj); },
    notifications: function () { feuilleNotifications(); },
    'activer-notifs': function () {
      Notification.requestPermission().then(function (p) {
        if (p === 'granted') { toast('Rappels activés.'); verifierRappels(); } else toast('Rappels non autorisés.', true);
        feuilleNotifications();
      });
    },
    'fermer-et-aller': function (el) { fermerFeuille(); if (el.dataset.onglet) CAI.onglet = el.dataset.onglet; if (el.dataset.eq) { EQ.onglet = el.dataset.eq; EQ.centre = el.dataset.centre; } var h = el.getAttribute('href'); if (location.hash === h) rendre(); else location.hash = h; },
    'voir-mdp': function (el) {
      // Chaque champ secret (mot de passe, jeton, code) a son œil : il bascule le champ voisin.
      var c = el.closest('.mdp-ligne') && el.closest('.mdp-ligne').querySelector('input'); if (!c) return;
      var voir = c.type === 'password'; c.type = voir ? 'text' : 'password';
      el.setAttribute('aria-pressed', voir ? 'true' : 'false'); el.setAttribute('aria-label', voir ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
      el.classList.toggle('on', voir); c.focus();
    },
    'mettre-a-jour': function () {
      // Vide les copies gardées par le téléphone, puis recharge depuis le serveur.
      var vider = window.caches ? caches.keys().then(function (k) { return Promise.all(k.map(function (x) { return caches.delete(x); })); }) : Promise.resolve();
      var sw = navigator.serviceWorker ? navigator.serviceWorker.getRegistrations().then(function (l) { return Promise.all(l.map(function (r) { return r.update(); })); }) : Promise.resolve();
      Promise.all([vider, sw]).catch(function () {}).then(function () { location.reload(); });
    },
    'aller-accueil': function () { if (location.hash === '#/accueil') rendre(); else location.hash = '#/accueil'; },
    'fermer-panneau': function () { if (panneauOuvert()) basculerPanneau(); },
    'ouvrir-comptes': function () {
      ouvrirPanneauDiscret();
      if (location.hash === '#/comptes') rendre(); else location.hash = '#/comptes';
    },
    'ouvrir-admin': function () {
      if (!estAdmin()) return;
      ouvrirPanneauDiscret();
      if (location.hash === '#/admin') rendre(); else location.hash = '#/admin';
    },
    'ajouter-enseignant': function (el) {
      var cid = el.dataset.centre;
      if (!peutCreerEnseignant(cid)) return;
      if (!E.enLigne) { toast('Créer un compte demande une connexion internet.', true); return; }
      ouvrirPanneauDiscret();
      feuilleCompte('', { role: 'enseignant', centre: cid });
    },
    // Même personne dans l'autre centre : compte séparé, pré-rempli (nom, téléphone, rôle, matières).
    'compte-autre-centre': function (el) {
      var u = (E.cache.comptes || []).filter(function (x) { return x.id === el.dataset.id; })[0];
      if (!u) return;
      var r = (u.acces || {})[el.dataset.v] || u.acces[Object.keys(u.acces || {})[0]] || 'enseignant';
      feuilleCompte('', { centre: el.dataset.v, role: r, nom: u.nom, tel: u.tel, matieres: u.matieres || [] });
    },
    'redater-versements': function (el) { if (estAdmin()) feuilleRedater(el.dataset.centre); },
    'redater-tout': function (el) { Array.prototype.forEach.call(document.querySelectorAll('#feuille input[name=pa]'), function (i) { i.checked = el.dataset.v === '1'; }); majTotalRedater(); },
    'repartir-zero': function (el) {
      var cid = el.dataset.centre, dep = el.dataset.v, c = ligne('centres', cid) || {};
      if (!estAdmin()) return;
      if (!confirm('Retirer des comptes de ' + (c.nom_court || c.nom) + ' tout ce qui précède le ' + dateLisible(dep, true) + ' ?\n\nLes partenaires repartent de zéro (caisse, remises, partage). Les dettes des élèves restent dues. ' +
        'Vous pourrez revenir en arrière dans la fiche du centre (Début des comptes).')) return;
      muter('centres', cid, { debut_comptes: dep }).then(function () { toast('Les comptes repartent de zéro le ' + dateLisible(dep, true) + '.'); rendre(); });
    },
    'editer-compte': function (el) {
      if (!E.enLigne) { toast('La gestion des comptes demande une connexion internet.', true); return; }
      feuilleCompte(el.dataset.id);
    },
    'reinit-mdp': function (el) {
      var u = (E.cache.comptes || []).filter(function (x) { return x.id === el.dataset.id; })[0];
      if (!u) return;
      confirmer('Créer un nouveau mot de passe pour ' + u.nom + ' ? Ses appareils seront déconnectés.', 'Créer', function () { api('comptes/mdp', { id: u.id }).then(function (r) { feuilleSecret('Nouveau mot de passe', u.nom, u.identifiant, r.mdp, u.acces, u.admin_global); }, function (e) { toast(e.message, true); }); });
    },
    appareils: function (el) { feuilleAppareils(el.dataset.id); },
    'mes-appareils': function () { feuilleAppareils(''); },
    revoquer: function (el) {
      api('sessions/revoquer', { id: el.dataset.id }).then(function () { toast('Appareil déconnecté.'); feuilleAppareils(el.dataset.uid); }, function (e) { toast(e.message, true); });
    },
    'envoyer-guide': function (el) {
      var u = (E.cache.comptes || []).filter(function (x) { return x.id === el.dataset.id; })[0];
      if (u) envoyerGuide(u);
    },
    'copier-secret': function () { copier(E.cache.messageSecret || ''); },
    'partager-secret': function () { partagerTexte(E.cache.messageSecret); },
    'journal-suite': function () { chargerJournal(true); },
    'appel-centre': function (el) { APL.centre = el.dataset.v; rendre(); },
    'appel-date': function (el) { APL.date = decalerJour(APL.date, +el.dataset.v); rendre(); },
    'appel-auj': function () { APL.date = ''; rendre(); },
    'asd-centre': function (el) { ASD.centre = el.dataset.v; rendre(); },
    'asd-periode': function (el) { ASD.periode = el.dataset.v; rendre(); },
    pointer: function (el) {
      var x = E.cache.pointage;
      var v = el.dataset.v;
      var p = ligne('presences', idPresence(x.id, el.dataset.eleve));
      var champs = v === 'arrive' ? { statut: 'present', arrivee: heureMaintenant(), depart: '', motif: '' }
        : v === 'depart' ? { depart: heureMaintenant(), statut: p.statut, arrivee: p.arrivee }
        : { statut: 'absent', motif: '' };
      pointer(x, el.dataset.eleve, champs).then(rendre);
    },
    droits: function (el) { feuilleDroits(el.dataset.id); },
    'droits-preset': function (el) {
      Array.prototype.forEach.call(document.querySelectorAll('#feuille input[name=cap]'), function (i) { i.checked = el.dataset.v === 'tout' || !i.dataset.ecriture; });
    },
    'pointer-ens': function (el) {
      var c = ligne('creneaux', el.dataset.cr);
      var iso = APL.date || isoLocal(new Date());
      var p = ligne('presences_ens', idPresenceEns(iso, c.id));
      var v = el.dataset.v;
      var champs = v === 'arrive' ? { statut: 'present', arrivee: heureMaintenant(), depart: '', remplacant_id: '' }
        : v === 'depart' ? { statut: p.statut, arrivee: p.arrivee, depart: heureMaintenant(), remplacant_id: p.remplacant_id || '' }
        : { statut: 'absent', remplacant_id: '' };
      pointerEns(c, iso, champs).then(rendre);
    },
    'detail-ens': function (el) { feuilleEns(el.dataset.cr); },
    'ens-centre': function (el) { ENS.centre = el.dataset.v; rendre(); },
    'ens-mois': function (el) { ENS.mois = decalerMois(ENS.mois, +el.dataset.v); rendre(); },
    'mes-mois': function (el) { MES.mois = decalerMois(MES.mois, +el.dataset.v); rendre(); },
    'voir-ens': function (el) { feuilleEnseignant(el.dataset.id); },
    'bulletin-ens': function (el) {
      bulletinEnseignant(el.dataset.id, ENS.centre, ENS.mois).then(function (f) { E.cache.dernierExport = f; return partagerFichiers([f], 'Bulletin de rémunération'); })
        .catch(function (e) { toast('Export impossible : ' + (e && e.message), true); });
    },
    'annuler-paie': function (el) {
      ouvrirFeuille('<h2>Annuler la paie</h2><form data-f="annul-paie" data-id="' + esc(el.dataset.id) + '"><label class="champ"><span>Motif</span><input type="text" name="motif" required minlength="5"></label>' +
        '<div class="actions"><button class="btn danger" type="submit">Annuler la paie</button><button class="btn clair" type="button" data-a="fermer">Retour</button></div></form>');
    },
    'caisse-centre': function (el) { CAI.centre = el.dataset.v; rendre(); },
    'caisse-onglet': function (el) { CAI.onglet = el.dataset.v; if (location.hash !== '#/caisse') location.hash = '#/caisse'; else rendre(); },
    'caisse-date': function (el) { CAI.date = decalerJour(CAI.date, +el.dataset.v); rendre(); },
    encaisser: function (el) { feuillePaiement(el.dataset.id); },
    'montant-rapide': function (el) { var i = $('#montant-paiement'); if (i) { i.value = el.dataset.v; i.focus(); } },
    'voir-recu': function (el) { feuilleRecu(el.dataset.id); },
    'voir-bon': function (el) { feuilleBon(el.dataset.t, el.dataset.id); },
    'envoyer-bon': function (el) { window.open(el.getAttribute('href'), '_blank', 'noopener'); },
    'partager-bon': function (el) {
      var t = el.dataset.t, x = ligne(t === 'paie' ? 'paies' : 'depenses', el.dataset.id);
      if (!x) return;
      el.disabled = true;
      fichierBon(t, x, el.dataset.v).then(function (f) { E.cache.dernierExport = f; return partagerFichiers([f], infosBon(t, x).titre); })
        .catch(function (e) { toast('Export impossible : ' + (e && e.message), true); }).then(function () { el.disabled = false; });
    },
    'export-caisse-jour': function (el) {
      var j = pointDuJour(CAI.centre, CAI.date || isoLocal(new Date()));
      var titre = 'Point de caisse du ' + dateLisible(j.date, true);
      if (el.dataset.v === 'texte') {
        var t = texteJour(j);
        if (NATIF || navigator.share) partagerTexte(t); else window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener');
        return;
      }
      el.disabled = true;
      fichierJour(j, el.dataset.v).then(function (f) { E.cache.dernierExport = f; return partagerFichiers([f], titre); })
        .catch(function (e) { toast('Export impossible : ' + (e && e.message), true); })
        .then(function () { el.disabled = false; });
    },
    'partager-recu': function (el) {
      var p = ligne('paiements', el.dataset.id);
      if (!p) { fermerFeuille(); toast('Ce versement n\'existe plus sur ce téléphone (refusé par le serveur) : voyez Mon compte › Synchronisation.', true); return; }
      fichierRecu(p, el.dataset.v).then(function (f) {
        E.cache.dernierExport = f;
        return partagerFichiers([f], 'Reçu n° ' + p.numero).then(function () { return muter('paiements', p.id, { envoye_le: maintenantSql() + ' partage' }); });
      }).catch(function (e) { toast('Export impossible : ' + (e && e.message), true); });
    },
    'envoyer-recu': function (el) {
      window.open(el.getAttribute('href'), '_blank', 'noopener');
      muter('paiements', el.dataset.id, { envoye_le: maintenantSql() + ' ' + el.dataset.canal });
    },
    'annuler-versement': function (el) {
      var p = ligne('paiements', el.dataset.id);
      if (!p) { fermerFeuille(); toast('Ce versement n\'existe plus sur ce téléphone (refusé par le serveur) : voyez Mon compte › Synchronisation.', true); return; }
      ouvrirFeuille('<h2>Annuler le versement</h2><p>' + fcfa(p.montant) + ' · reçu n° ' + esc(p.numero || '') + '</p><p class="doux">Le versement reste visible, barré, avec le motif et votre nom.</p>' +
        '<form data-f="annulation" data-id="' + esc(p.id) + '"><label class="champ"><span>Motif</span><input type="text" name="motif" required minlength="5" placeholder="ex. : erreur de montant, doublon"></label>' +
        '<div class="actions"><button class="btn danger" type="submit">Annuler le versement</button><button class="btn clair" type="button" data-a="fermer">Retour</button></div></form>');
    },
    relancer: function (el) {
      var href = el.getAttribute('href');
      if (el.dataset.canal === 'whatsapp') window.open(href, '_blank', 'noopener'); else location.href = href;
      muter('eleves', el.dataset.id, { relance_le: maintenantSql() + ' ' + el.dataset.canal }).then(rendre);
    },
    'voir-depense': function (el) { feuilleDepense(el.dataset.id); },
    'editer-depense': function (el) { feuilleDepense(el.dataset.id); },
    'valider-depense': function (el) {
      var d = ligne('depenses', el.dataset.id);
      if (d && justificatifExige(d) && !d.justificatif && estAdmin()) {
        confirmer('Cette dépense de ' + fcfa(d.montant) + ' n\'a pas de justificatif' + ((E.cache.photosEnAttente || {})[d.id] ? ' arrivé au serveur' : '') + '. La valider quand même ? (vous seul, administrateur, le pouvez ; votre nom reste comme valideur)', 'Valider sans justificatif', function () {
          fermerFeuille(); muter('depenses', d.id, { statut: 'validee' }).then(function () { toast('Dépense validée.'); rendre(); });
        });
        return;
      }
      if (d && justificatifExige(d) && !d.justificatif) {
        toast((E.cache.photosEnAttente || {})[d.id] ? 'La photo du justificatif n\'est pas encore arrivée au serveur : validez après la synchronisation.' : 'Justificatif obligatoire à partir de ' + fcfa(SEUIL_JUSTIFICATIF) + ' : demandez la photo avant de valider.', true);
        return;
      }
      fermerFeuille(); muter('depenses', el.dataset.id, { statut: 'validee' }).then(function () { toast('Dépense validée.'); rendre(); }); },
    'refuser-depense': function (el) {
      var annul = el.dataset.v === 'annuler';
      ouvrirFeuille('<h2>' + (annul ? 'Annuler la dépense' : 'Refuser la dépense') + '</h2><form data-f="refus" data-id="' + esc(el.dataset.id) + '"><label class="champ"><span>Motif</span><input type="text" name="motif" required' +
        (annul ? ' placeholder="ex. : doublon de la paie de M. …"' : '') + '></label>' +
        '<div class="actions"><button class="btn danger" type="submit">' + (annul ? 'Annuler la dépense' : 'Refuser') + '</button><button class="btn clair" type="button" data-a="fermer">Retour</button></div></form>');
    },
    'suppr-depense': function (el) { confirmer('Retirer cette dépense ?', 'Retirer', function () { muter('depenses', el.dataset.id, {}, true).then(rendre); }); },
    'bilan-mois': function (el) {
      var v = el.dataset.v;
      if (v === 'annee') BIL.mois = 'annee';
      else if (v === 'mois') BIL.mois = '';
      else { var d = new Date(BIL.mois + '-15T12:00:00'); d.setMonth(d.getMonth() + Number(v)); BIL.mois = isoLocal(d).slice(0, 7); }
      rendre();
    },
    'ouvrir-export': function () { feuilleExport(E.cache.pointage); },
    export: function (el) {
      var x = E.cache.pointage;
      el.disabled = true;
      (el.dataset.v === 'pdf' ? pdfFeuille(x) : imageFeuille(x)).then(function (f) {
        el.disabled = false;
        E.cache.dernierExport = f;
        return partagerFichiers([f], 'Feuille de présence — ' + x.classe.nom);
      }).catch(function (e) { el.disabled = false; toast('Export impossible : ' + (e && e.message), true); });
    },
    'export-jour': function (el) {
      var l = E.cache.appelsJour || [];
      el.disabled = true;
      toast('Préparation de ' + l.length + ' feuilles…');
      Promise.all(l.map(imageFeuille)).then(function (fichiers) {
        el.disabled = false;
        E.cache.dernierExport = fichiers;
        return partagerFichiers(fichiers, 'Feuilles de présence du ' + dateLongue(APL.date));
      }).catch(function (e) { el.disabled = false; toast('Export impossible : ' + (e && e.message), true); });
    },
    'msg-parent': function (el, ev) {
      // Le lien s'ouvre (WhatsApp, SMS) ; on note seulement qu'un message a été préparé.
      var href = el.getAttribute('href');
      if (el.dataset.canal === 'whatsapp') window.open(href, '_blank', 'noopener'); else location.href = href;
      var p = ligne('presences', el.dataset.id);
      if (p) muter('presences', p.id, { notifie: maintenantSql() + ' ' + el.dataset.canal, statut: p.statut }).then(rendre);
    },
    'detail-presence': function (el) { feuillePresence(E.cache.pointage, el.dataset.eleve); },
    'suppr-presence': function (el) { confirmer('Effacer ce pointage ?', 'Effacer', function () { muter('presences', el.dataset.id, {}, true).then(rendre); }); },
    'tous-presents': function () {
      var x = E.cache.pointage;
      var suite = Promise.resolve();
      var n = 0;
      elevesActifs(x.centre_id).filter(function (e) { return e.classe_id === x.classe.id; }).forEach(function (e) {
        if (ligne('presences', idPresence(x.id, e.id))) return;
        n++;
        suite = suite.then(function () { return pointer(x, e.id, { statut: 'present', arrivee: x.debut }); });
      });
      suite.then(function () { toast(n + ' élève' + (n > 1 ? 's' : '') + ' pointé' + (n > 1 ? 's' : '') + ' présent' + (n > 1 ? 's' : '') + '.'); rendre(); });
    },
    'fin-cours': function () {
      var x = E.cache.pointage;
      var h = heureMaintenant() < x.fin ? heureMaintenant() : x.fin;
      var l = presencesDe(x.id).filter(function (p) { return (p.statut === 'present' || p.statut === 'retard') && !p.depart; });
      if (!l.length) { toast('Aucun élève présent sans heure de départ.'); return; }
      var suite = Promise.resolve();
      l.forEach(function (p) { suite = suite.then(function () { return pointer(x, p.eleve_id, { depart: h, statut: p.statut, arrivee: p.arrivee }); }); });
      suite.then(function () { toast('Départ ' + heureLisible(h) + ' noté pour ' + l.length + ' élève' + (l.length > 1 ? 's' : '') + '.'); rendre(); });
    },
    'clore-appel': function () {
      var x = E.cache.pointage;
      var restants = elevesActifs(x.centre_id).filter(function (e) { return e.classe_id === x.classe.id && !ligne('presences', idPresence(x.id, e.id)); });
      var faire = function () {
        var suite = Promise.resolve();
        restants.forEach(function (e) { suite = suite.then(function () { return pointer(x, e.id, { statut: 'absent' }); }); });
        suite.then(function () { return assurerSeance(x); }).then(function () { return muter('seances', x.id, { statut: 'close', close_le: maintenantSql() }); })
          .then(function () { toast('Appel clos.'); rendre(); });
      };
      if (restants.length) confirmer(restants.length + ' élève' + (restants.length > 1 ? 's' : '') + ' non pointé' + (restants.length > 1 ? 's seront marqués' : ' sera marqué') + ' absent' + (restants.length > 1 ? 's' : '') + '.', 'Clore l\'appel', faire);
      else faire();
    },
    'eleves-centre': function (el) { ELV.centre = el.dataset.v; ELV.classe = ''; rendre(); },
    'eleves-classe': function (el) { ELV.classe = el.dataset.v; rendre(); },
    'voir-eleve': function (el) { feuilleVoirEleve(el.dataset.id); },
    'editer-eleve': function (el) { feuilleEleve(el.dataset.id); },
    'importer-eleves': function () { feuilleImport(); },
    'statut-eleve': function (el) {
      var e = ligne('eleves', el.dataset.id);
      var v = el.dataset.v;
      var faire = function () { muter('eleves', e.id, { statut: v, date_depart: v === 'parti' ? isoLocal(new Date()) : '' }).then(function () { toast(v === 'actif' ? 'Élève réinscrit.' : 'Élève retiré des effectifs.'); rendre(); }); };
      if (v === 'parti') confirmer(nomComplet(e) + ' a quitté le centre ? Sa fiche est conservée (historique, paiements).', 'Confirmer', faire);
      else { fermerFeuille(); faire(); }
    },
    'emploi-centre': function (el) { EMP.centre = el.dataset.v; EMP.filtre = ''; rendre(); },
    'emploi-mode': function (el) { EMP.mode = el.dataset.v; EMP.filtre = ''; rendre(); },
    'emploi-jour': function (el) { EMP.jour = +el.dataset.v; rendre(); },
    'editer-creneau': function (el) { feuilleCreneau(el.dataset.id); },
    'editer-horaire': function (el) { feuilleHoraire(el.dataset.id); },
    'suppr-horaire': function (el) { confirmer('Supprimer cette plage horaire ?', 'Supprimer', function () { muter('horaires', el.dataset.id, {}, true).then(rendre); }); },
    'editer-classe': function (el) { feuilleClasse(el.dataset.id); },
    'editer-matiere': function (el) { feuilleMatiere(el.dataset.id); },
    'suppr-creneau': function (el) { confirmer('Supprimer ce créneau ?', 'Supprimer', function () { muter('creneaux', el.dataset.id, {}, true).then(rendre); }); },
    'suppr-classe': function (el) {
      var n = lignes('creneaux').filter(function (c) { return c.classe_id === el.dataset.id; }).length;
      confirmer('Supprimer cette classe' + (n ? ' et ses ' + n + ' créneau(x)' : '') + ' ?', 'Supprimer', function () {
        var suite = Promise.resolve();
        lignes('creneaux').forEach(function (c) { if (c.classe_id === el.dataset.id) suite = suite.then(function () { return muter('creneaux', c.id, {}, true); }); });
        suite.then(function () { return muter('classes', el.dataset.id, {}, true); }).then(rendre);
      });
    },
    'suppr-matiere': function (el) {
      var n = lignes('creneaux').filter(function (c) { return c.matiere_id === el.dataset.id; }).length;
      if (n) { toast('Matière utilisée dans ' + n + ' créneau(x) : modifiez-les d\'abord.', true); return; }
      confirmer('Supprimer cette matière ?', 'Supprimer', function () { muter('matieres', el.dataset.id, {}, true).then(rendre); });
    },
    'changer-mdp': function () {
      ouvrirFeuille('<h2>Changer mon mot de passe</h2><form data-f="mdp">' +
        '<label class="champ"><span>Mot de passe actuel</span><span class="mdp-ligne"><input type="password" name="ancien" required autocomplete="current-password"><button type="button" class="oeil" data-a="voir-mdp" aria-label="Afficher le mot de passe" aria-pressed="false">' + ico('eye') + '</button></span></label>' +
        '<label class="champ"><span>Nouveau mot de passe</span><span class="mdp-ligne"><input type="password" name="nouveau" required minlength="8" autocomplete="new-password"><button type="button" class="oeil" data-a="voir-mdp" aria-label="Afficher le mot de passe" aria-pressed="false">' + ico('eye') + '</button></span><small>8 caractères minimum.</small></label>' +
        '<label class="champ"><span>Confirmer</span><span class="mdp-ligne"><input type="password" name="confirme" required minlength="8" autocomplete="new-password"><button type="button" class="oeil" data-a="voir-mdp" aria-label="Afficher le mot de passe" aria-pressed="false">' + ico('eye') + '</button></span></label>' +
        '<div class="actions"><button class="btn" type="submit">Changer</button><button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
    },
    'code-pin': function () {
      metaLire('pin').then(function (p) {
        ouvrirFeuille('<h2>Code de verrouillage</h2><p class="doux">Après 5 minutes hors de l\'application, ce code est demandé avant d\'afficher les données. Il reste sur ce téléphone.</p>' +
          '<form data-f="pin"><label class="champ"><span>Nouveau code (4 chiffres)</span><span class="mdp-ligne"><input type="password" name="pin" inputmode="numeric" pattern="\\d{4}" maxlength="4" required autocomplete="off"><button type="button" class="oeil" data-a="voir-mdp" aria-label="Afficher le mot de passe" aria-pressed="false">' + ico('eye') + '</button></span></label>' +
          '<div class="actions"><button class="btn" type="submit">' + (p ? 'Changer le code' : 'Activer') + '</button>' + (p ? '<button class="btn danger" type="button" data-a="pin-retirer">Désactiver</button>' : '') +
          '<button class="btn clair" type="button" data-a="fermer">Annuler</button></div></form>');
      });
    },
    'pin-retirer': function () { metaEcrire('pin', null).then(function () { fermerFeuille(); toast('Code désactivé.'); rendre(); }); },
    pin: function (el) {
      var v = el.dataset.v;
      if (v === 'x') saisiePin = saisiePin.slice(0, -1);
      else if (saisiePin.length < 4) saisiePin += v;
      var pts = document.querySelectorAll('#pin-points i');
      Array.prototype.forEach.call(pts, function (p, i) { p.className = i < saisiePin.length ? 'plein' : ''; });
      if (saisiePin.length === 4) {
        var essai = saisiePin;
        metaLire('pin').then(function (p) {
          if (!p) { E.verrouille = false; rendre(); return; }
          return hacherPin(essai, p.sel).then(function (h) {
            if (h === p.hash) { E.verrouille = false; rendre(); synchroniser(); }
            else { toast('Code incorrect.', true); ecranPin($('#app')); }
          });
        });
      }
    },
    'pin-oubli': function () {
      confirmer('Code oublié : vous allez être déconnecté de ce téléphone.', 'Me déconnecter', function () { E.verrouille = false; deconnexion(); });
    }
  };

  // ───────────────────────────── Formulaires ─────────────────────────────
  function valeurs(form) {
    var o = {};
    new FormData(form).forEach(function (v, k) { o[k] = typeof v === 'string' ? v.trim() : v; });
    return o;
  }
  function occupe(form, oui) {
    var b = form.querySelector('[type=submit]');
    if (b) { b.disabled = oui; if (oui) { b.dataset.t = b.textContent; b.textContent = 'Un instant…'; } else if (b.dataset.t) b.textContent = b.dataset.t; }
  }

  var FORMULAIRES = {
    connexion: function (form) {
      var v = valeurs(form);
      occupe(form, true);
      var ident = String(v.identifiant || '').toLowerCase().replace(/\s+/g, '');
      api('auth/connexion', { identifiant: ident, mdp: v.mdp, appareil: nomAppareil() }).then(function (r) {
        try { localStorage.setItem('vg-ident', ident); } catch (e) {}
        return ouvrirSession(r);
      }, function (e) {
        occupe(form, false);
        formulaireConnexion(e.message, ident, e.code);
      });
    },
    installation: function (form) {
      var v = valeurs(form);
      occupe(form, true);
      var poster = function (corps) {
        return fetch(BASE + 'api/install.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corps) })
          .then(function (r) { return r.json(); }).then(function (j) { if (!j.ok) throw new Error(j.error); return j; });
      };
      poster({ jeton: v.jeton, action: 'installer' })
        .then(function () { return poster({ jeton: v.jeton, action: 'admin', identifiant: v.identifiant, mdp: v.mdp, nom: v.nom }); })
        .then(function () { return api('auth/connexion', { identifiant: v.identifiant, mdp: v.mdp, appareil: nomAppareil() }); })
        .then(ouvrirSession, function (e) { occupe(form, false); toast(e.message, true); });
    },
    'date-versement': function (form) {
      var p = ligne('paiements', form.dataset.id), date = valeurs(form).date;
      if (!p || !date || date === p.date) { fermerFeuille(); return; }
      fermerFeuille();
      muter('paiements', p.id, { date: date }).then(function () { toast('Versement daté du ' + dateLisible(date, true) + '.'); rendre(); });
    },
    redater: function (form) {
      var date = valeurs(form).date, ids = Array.prototype.filter.call(form.querySelectorAll('input[name=pa]'), function (i) { return i.checked; }).map(function (i) { return i.value; });
      if (!ids.length) { toast('Cochez au moins un versement.', true); return; }
      if (!date) { toast('Choisissez la date.', true); return; }
      var restent = restentRedater();
      if (!confirm(ids.length + ' versement(s) passent au ' + dateLisible(date, true) + '.\n\nRestent en ' + libMoisAnnee(moisCycle()) + ' : ' +
        (restent.length ? restent.map(function (x) { return x.nom + ' ' + fcfa(x.montant).replace(/\u00a0|\u202f/g, ' '); }).join(', ') : 'aucun') + '.\n\nC\'est bien ça ?')) return;
      fermerFeuille();
      ids.reduce(function (pr, id) { return pr.then(function () { return muter('paiements', id, { date: date }); }); }, Promise.resolve()).then(function () {
        toast(ids.length + ' versement' + (ids.length > 1 ? 's' : '') + ' rattaché' + (ids.length > 1 ? 's' : '') + ' au ' + dateLisible(date, true) + '.'); rendre();
      });
    },
    centre: function (form) {
      var v = valeurs(form);
      var id = form.dataset.id || nouvelId();
      var champs = {
        nom: v.nom, nom_court: v.nom_court, adresse: v.adresse, telephones: v.telephones, devise: v.devise,
        tolerance_retard_min: +v.tolerance_retard_min, jour_echeance: +v.jour_echeance, msg_absence: v.msg_absence, msg_retard: v.msg_retard,
        msg_relance: v.msg_relance, msg_recu: v.msg_recu, inscription_option: Number(v.inscription_option) || 0, inscription_option_libelle: v.inscription_option_libelle,
        alerte_appel_min: +v.alerte_appel_min, alerte_direction_min: +v.alerte_direction_min
      };
      if (form.querySelector('[name=tresorier_id]')) champs.tresorier_id = v.tresorier_id || '';
      if (form.querySelector('[name=debut_comptes]')) champs.debut_comptes = v.debut_comptes || '';
      if (!form.dataset.id) champs.ordre = lignes('centres').length + 1;
      if (champs.alerte_direction_min < champs.alerte_appel_min) { toast('L\'alerte administrateur doit venir après celle du responsable.', true); return; }
      fermerFeuille();
      muter('centres', id, champs).then(function () { toast('Enregistré.'); rendre(); });
    },
    annee: function (form) {
      var mois = Array.prototype.map.call(form.querySelectorAll('input[name=mois]:checked'), function (i) { return i.value; });
      var v = valeurs(form);
      var id = form.dataset.id || nouvelId();
      var active = form.querySelector('[name=active]').checked;
      fermerFeuille();
      var suite = Promise.resolve();
      // Une seule année « en cours » à la fois.
      if (active) lignes('annees').forEach(function (a) { if (a.id !== id && Number(a.active)) suite = suite.then(function () { return muter('annees', a.id, { active: 0 }); }); });
      suite.then(function () { return muter('annees', id, { libelle: v.libelle, debut: v.debut, fin: v.fin, mois_factures: mois.join(','), active: active ? 1 : 0 }); })
        .then(function () { toast('Enregistré.'); rendre(); });
    },
    message: function (form) {
      var v = valeurs(form), cid = form.dataset.centre, fil = form.dataset.fil;
      if (!v.texte) return;
      muter('messages', nouvelId(), { centre_id: cid, fil: fil, texte: v.texte, auteur: E.profil.utilisateur.id, cree_le: maintenantSql() }).then(function () {
        marquerLu(cid, fil);
        var fo = E.cache.filOuvert;
        if (fo && fo.fil === fil && $('#zone-fil')) { $('#zone-fil').innerHTML = bullesFil(cid, fil); form.reset(); var z = $('#zone-fil .fil'); if (z) z.scrollTop = z.scrollHeight; }
        else rendre();
      });
    },
    sondage: function (form) {
      var v = valeurs(form), opts = [];
      [0, 1, 2, 3].forEach(function (i) { if (v['d' + i]) { var o = v['d' + i] + (v['h' + i] ? ' ' + v['h' + i] : ''); if (opts.indexOf(o) < 0) opts.push(o); } });
      if (!opts.length) { toast('Proposez au moins une date.', true); return; }
      opts.sort();
      var id = nouvelId();
      fermerFeuille();
      muter('sondages', id, { centre_id: EQ.centre, titre: v.titre, lieu: v.lieu, note: v.note, options: JSON.stringify(opts), statut: 'ouvert', choix: '', auteur: E.profil.utilisateur.id, cree_le: maintenantSql() })
        .then(function () { EQ.onglet = 'reunions'; rendre(); feuilleSondage(id); toast('Proposition envoyée aux partenaires.'); });
    },
    tache: function (form) {
      var v = valeurs(form), id = form.dataset.id || nouvelId();
      var champs = { centre_id: form.dataset.centre, titre: v.titre, note: v.note, assigne_a: v.assigne_a || '', echeance: v.echeance || '', statut: v.statut || 'a_faire' };
      if (!form.dataset.id) { champs.auteur = E.profil.utilisateur.id; champs.cree_le = maintenantSql(); }
      fermerFeuille();
      muter('taches', id, champs).then(function () { EQ.onglet = 'taches'; toast('Tâche enregistrée.'); rendre(); });
    },
    remise: function (form) {
      var v = valeurs(form);
      var id = form.dataset.id || nouvelId(), cid = form.dataset.centre;
      var montant = Math.round(Number(v.montant));
      if (!(montant > 0)) { toast('Montant invalide.', true); return; }
      fermerFeuille();
      muter('remises', id, { centre_id: cid, montant: montant, date: v.date, mode: v.mode, note: v.note, statut: 'en_attente' }).then(function () {
        CAI.onglet = 'remises'; rendre();
        var r = ligne('remises', id);
        if (!form.dataset.id && r) confirmer('Remise enregistrée. Prévenir ' + nomCompte(tresorierDe(cid)) + ' pour qu\'il confirme la réception ?', 'Prévenir', function () {
          var t = messageRemise(r);
          if (NATIF || navigator.share) partagerTexte(t); else window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener');
        });
        else toast('Remise enregistrée.');
      });
    },
    contestation: function (form) {
      var v = valeurs(form);
      fermerFeuille();
      muter('remises', form.dataset.id, { statut: 'contestee', motif: v.motif }).then(function () { toast('Remise signalée « pas reçue ».'); rendre(); });
    },
    evenement: function (form) {
      var v = valeurs(form);
      if (v.fin && v.heure && v.fin <= v.heure) { toast('L\'heure de fin doit suivre l\'heure de début.', true); return; }
      if (!peutAgenda(v.centre_id)) { toast('Vous ne pouvez pas modifier l\'agenda de ce centre.', true); return; }
      var id = form.dataset.id || nouvelId();
      fermerFeuille();
      muter('evenements', id, { centre_id: v.centre_id, titre: v.titre.trim(), type: v.type, date: v.date, heure: v.heure || '', fin: v.heure ? v.fin || '' : '', lieu: v.lieu.trim(), note: v.note.trim(), rappel_min: Number(v.rappel_min) || 0 })
        .then(function () { AG.mois = v.date.slice(0, 7); AG.jour = v.date; toast('Rendez-vous enregistré.'); rendre(); });
    },
    actionnaire: function (form) {
      var v = valeurs(form);
      var id = form.dataset.id || nouvelId();
      var centre = form.dataset.centre;
      var part = Math.round(parseFloat(String(v.part).replace(',', '.')) * 100);
      var autres = lignes('actionnaires').filter(function (a) { return a.centre_id === centre && a.id !== id; })
        .reduce(function (s, a) { return s + (Number(a.part_centiemes) || 0); }, 0);
      if (isNaN(part) || part < 0 || part > 10000) { toast('Part entre 0 et 100 %.', true); return; }
      if (autres + part > 10000) { toast('Le total dépasserait 100 % (déjà ' + pourcent(autres) + ' réparti).', true); return; }
      fermerFeuille();
      muter('actionnaires', id, { centre_id: centre, nom: v.nom, tel: v.tel, part_centiemes: part }).then(function () { toast('Enregistré.'); rendre(); });
    },
    compte: function (form) {
      var v = valeurs(form);
      var id = form.dataset.id;
      // Un compte = un centre (centres indépendants).
      var acces = v.centre_id && v.role ? [{ centre_id: v.centre_id, role: v.role }] : [];
      var adminCase = form.querySelector('[name=admin_global]');
      var actifCase = form.querySelector('[name=actif]');
      var matieres = Array.prototype.map.call(form.querySelectorAll('input[name=matiere]:checked'), function (i) { return i.value; });
      var corps = { id: id || '', identifiant: String(v.identifiant || '').toLowerCase().replace(/\s+/g, ''), nom: v.nom, tel: v.tel, acces: acces, matieres: matieres,
        admin_global: adminCase ? adminCase.checked : false, actif: actifCase ? actifCase.checked : true };
      if (!corps.admin_global && !acces.length) { toast('Choisissez le centre et le rôle.', true); return; }
      occupe(form, true);
      api('comptes/enregistrer', corps).then(function (r) {
        // Trésorier coché / décoché : la fiche du centre suit (l'admin seul écrit les centres).
        var uidC = r.id || id;
        var caseT = form.querySelector('[name=tresorier]');
        if (estAdmin() && uidC && caseT) lignes('centres').forEach(function (c) {
          var veut = caseT.checked && c.id === v.centre_id;
          if (veut && tresorierDe(c.id) !== uidC) muter('centres', c.id, { tresorier_id: uidC });
          else if (!veut && tresorierDe(c.id) === uidC) muter('centres', c.id, { tresorier_id: '' });
        });
        chargerComptes();
        // L'équipe (enseignants de chaque centre) arrive avec la synchro : écran Enseignants à jour.
        synchroniser();
        var accesMap = {};
        corps.acces.forEach(function (a) { accesMap[a.centre_id] = a.role; });
        if (r.mdp) feuilleSecret('Compte créé', corps.nom, r.identifiant || corps.identifiant, r.mdp, accesMap, corps.admin_global);
        else { fermerFeuille(); toast('Compte enregistré.'); }
      }, function (e) { occupe(form, false); toast(e.message, true); });
    },
    eleve: function (form, forcer) {
      var v = valeurs(form);
      var id = form.dataset.id || nouvelId();
      var champs = {
        centre_id: form.dataset.centre, classe_id: v.classe_id, nom: v.nom.toUpperCase(), prenoms: v.prenoms, sexe: v.sexe,
        date_naissance: v.date_naissance, date_inscription: v.date_inscription, etablissement: v.etablissement, quartier: v.quartier,
        parent_nom: v.parent_nom, parent_lien: v.parent_lien, parent2_nom: v.parent2_nom, observations: v.observations,
        matieres: Array.prototype.map.call(form.querySelectorAll('input[name=matiere]:checked'), function (i) { return i.value; }).join(',')
      };
      if (v.inscription_due !== undefined) champs.inscription_due = Number(v.inscription_due) || 0;
      if (v.mensualite_due !== undefined) { champs.mensualite_due = Number(v.mensualite_due) || 0; champs.remise_motif = v.remise_motif; }
      var erreurTel = '';
      ['tel_eleve', 'parent_tel', 'parent_whatsapp', 'parent2_tel'].forEach(function (k) {
        var t = telNormal(v[k]);
        if (t === null) erreurTel = 'Téléphone invalide : ' + v[k] + ' (9 chiffres, ex. 697 63 77 39).';
        else champs[k] = t;
      });
      if (erreurTel) { toast(erreurTel, true); return; }
      var avant = form.dataset.id ? ligne('eleves', id) : null;
      var double = homonyme(Object.assign({ id: id }, champs));
      if (double && !forcer && !(avant && Number(avant.doublon_ok))) {
        var autreForm = form;
        E.cache.formEleve = autreForm;
        ouvrirFeuilleSecondaire('<h2>Déjà inscrit ?</h2><p><b>' + esc(nomComplet(double)) + '</b> est déjà inscrit (' + esc([double.matricule, nomDe('classes', double.classe_id), telLisible(double.parent_tel)].filter(Boolean).join(' · ')) + ').</p>' +
          '<p class="doux">S\'il s\'agit d\'un vrai homonyme (frère, sœur, autre famille), confirmez. Sinon, annulez : la fiche existe déjà.</p>' +
          '<div class="actions"><button class="btn clair" type="button" data-a="homonyme-non">C\'est le même élève</button><button class="btn or" type="button" data-a="homonyme-oui">Homonyme : inscrire</button></div>');
        return;
      }
      if (double || forcer) champs.doublon_ok = 1;
      fermerFeuille();
      ELV.classe = ELV.classe && ELV.classe !== champs.classe_id ? champs.classe_id : ELV.classe;
      muter('eleves', id, champs).then(function () { toast(form.dataset.id ? 'Fiche enregistrée.' : nomComplet(champs) + ' est inscrit.'); rendre(); });
    },
    import: function (form) {
      var l = analyseImport(form).filter(function (e) { return !e.motif; });
      if (!l.length) { toast('Aucun nouvel élève à inscrire.', true); return; }
      var classe = form.querySelector('[name=classe_id]').value;
      var auj = isoLocal(new Date());
      var dInsc = (form.querySelector('[name=date_inscription]') || {}).value || auj;
      var parMois = (form.querySelector('[name=date_versements]') || {}).value === 'mois';
      var mois = moisDeLAnnee(), cid = form.dataset.centre, jourEch = ('0' + (Number((ligne('centres', cid) || {}).jour_echeance) || 10)).slice(-2);
      var peutEnc = peut('paiements.encaisser', cid), nbVers = 0;
      fermerFeuille();
      var suite = Promise.resolve();
      l.forEach(function (e) {
        var eid = nouvelId();
        suite = suite.then(function () {
          return muter('eleves', eid, { centre_id: e.centre_id, classe_id: classe, nom: e.nom, prenoms: e.prenoms, parent_tel: e.parent_tel, date_inscription: dInsc > auj ? auj : dInsc });
        });
        if (!peutEnc) return;
        (e.montants || []).forEach(function (v, i) {
          if (!v) return;
          var quoi = i === 0 ? 'inscription' : MOIS[Number((mois[i - 1] || auj.slice(0, 7)).slice(5)) - 1];
          var date = !parMois ? auj : i === 0 ? dInsc : (mois[i - 1] || auj.slice(0, 7)) + '-' + jourEch;
          if (date > auj) date = auj;
          nbVers++;
          suite = suite.then(function () {
            return muter('paiements', 'pa' + nouvelId(), { centre_id: e.centre_id, eleve_id: eid, montant: v, date: date, mode: 'especes', reference: '', note: 'Repris du cahier : ' + quoi });
          });
        });
      });
      suite.then(function () { ELV.classe = classe; toast(l.length + ' élève' + (l.length > 1 ? 's' : '') + ' inscrit' + (l.length > 1 ? 's' : '') + (nbVers ? ', ' + nbVers + ' versement' + (nbVers > 1 ? 's' : '') + ' repris' : '') + '.'); rendre(); });
    },
    paiement: function (form) {
      var v = valeurs(form);
      var montant = Math.round(Number(v.montant));
      if (!(montant > 0)) { toast('Montant invalide.', true); return; }
      var e = ligne('eleves', form.dataset.eleve);
      var id = 'pa' + nouvelId();
      var champs = { centre_id: e.centre_id, eleve_id: e.id, montant: montant, date: v.date || isoLocal(new Date()), mode: v.mode, reference: v.reference || '', note: v.note || '' };
      var numero = numerosLibres(e.centre_id)[0];
      if (numero) champs.numero = numero;
      fermerFeuille();
      muter('paiements', id, champs)
        .then(function () {
          toast(fcfa(montant) + ' encaissés.');
          rendre();
          // Numéro déjà connu : le reçu s'ouvre tout de suite, réseau ou pas.
          if (numero) { feuilleRecu(id); return synchroniser(); }
          return synchroniser().then(function () { feuilleRecu(id); });
        });
    },
    droits: function (form) {
      var u = (E.cache.comptes || []).filter(function (x) { return x.id === form.dataset.id; })[0];
      var coches = Array.prototype.map.call(form.querySelectorAll('input[name=cap]:checked'), function (i) { return i.value; });
      var retires = capsDuCompte(u).filter(function (k) { return coches.indexOf(k) < 0; });
      // Les restrictions déjà posées sur des capacités hors de ses rôles actuels sont conservées.
      (u.restrictions || []).forEach(function (k) { if (capsDuCompte(u).indexOf(k) < 0 && retires.indexOf(k) < 0) retires.push(k); });
      occupe(form, true);
      api('comptes/enregistrer', { id: u.id, identifiant: u.identifiant, nom: u.nom, tel: u.tel || '', actif: form.querySelector('[name=actif]').checked,
        acces: Object.keys(u.acces).map(function (c) { return { centre_id: c, role: u.acces[c] }; }), matieres: u.matieres || [], restrictions: retires })
        .then(function () { fermerFeuille(); toast('Droits enregistrés : appliqués immédiatement.'); chargerDroits(); }, function (e) { occupe(form, false); toast(e.message, true); });
    },
    'presence-ens': function (form) {
      var v = valeurs(form);
      var c = ligne('creneaux', form.dataset.cr);
      if (v.statut === 'remplace' && !v.remplacant_id) { toast('Choisissez le remplaçant.', true); return; }
      if (v.depart && v.arrivee && v.depart < v.arrivee) { toast('Le départ ne peut pas précéder l\'arrivée.', true); return; }
      fermerFeuille();
      pointerEns(c, APL.date || isoLocal(new Date()), { statut: v.statut, arrivee: v.statut === 'absent' ? '' : v.arrivee, depart: v.statut === 'absent' ? '' : v.depart, remplacant_id: v.statut === 'remplace' ? v.remplacant_id : '', note: v.note }).then(rendre);
    },
    paie: function (form) {
      var v = valeurs(form);
      var montant = Math.round(Number(v.montant));
      if (!(montant > 0)) { toast('Montant invalide.', true); return; }
      fermerFeuille();
      var idP = 'py' + nouvelId();
      muter('paies', idP, { centre_id: ENS.centre, enseignant_id: form.dataset.ens, mois: ENS.mois, montant: montant, date: isoLocal(new Date()), mode: v.mode })
        .then(function () { toast('Paie de ' + fcfa(montant) + ' enregistrée.'); rendre(); feuilleBon('paie', idP); });
    },
    contrat: function (form) {
      var v = valeurs(form);
      fermerFeuille();
      muter('contrats', form.dataset.id || 'co' + nouvelId(), { centre_id: ENS.centre, utilisateur_id: form.dataset.ens, mode: v.mode, taux: Math.round(Number(v.taux)) || 0, retenue_absence: Math.round(Number(v.retenue_absence)) || 0, actif: 1 })
        .then(function () { toast('Contrat enregistré.'); rendre(); });
    },
    'annul-paie': function (form) {
      var v = valeurs(form);
      fermerFeuille();
      muter('paies', form.dataset.id, { annule: 1, motif_annulation: v.motif }).then(function () { toast('Paie annulée.'); rendre(); });
    },
    annulation: function (form) {
      var v = valeurs(form);
      fermerFeuille();
      muter('paiements', form.dataset.id, { annule: 1, motif_annulation: v.motif }).then(function () { toast('Versement annulé.'); rendre(); });
    },
    depense: function (form) {
      var v = valeurs(form);
      var id = form.dataset.id || 'de' + nouvelId();
      var champs = { centre_id: form.dataset.centre, libelle: v.libelle, montant: Math.round(Number(v.montant)), date: v.date, categorie: v.categorie, mode: v.mode, beneficiaire: v.beneficiaire };
      if (!form.dataset.id) champs.statut = 'en_attente';
      var photo = form.querySelector('input[name=photo]');
      var fichier = photo && photo.files && photo.files[0];
      occupe(form, true);
      (fichier ? compresserPhoto(fichier).then(function (jpeg) { return idbMettre('fichiers', { id: id, jpeg: jpeg, ajoute: maintenantSql() }); }) : Promise.resolve())
        .then(function () { fermerFeuille(); return muter('depenses', id, champs); })
        .then(function () { toast('Dépense enregistrée' + (fichier ? ' avec sa photo' : '') + ' : en attente de validation.'); rendre(); })
        .catch(function (e) { occupe(form, false); toast(e.message, true); });
    },
    refus: function (form) {
      var v = valeurs(form);
      fermerFeuille();
      var avant = ligne('depenses', form.dataset.id) || {};
      muter('depenses', form.dataset.id, { statut: 'refusee', motif_refus: v.motif }).then(function () { toast(avant.statut === 'validee' ? 'Dépense annulée.' : 'Dépense refusée.'); rendre(); });
    },
    presence: function (form) {
      var x = E.cache.pointage;
      var v = valeurs(form);
      var champs = { statut: v.statut, motif: v.motif };
      if (v.arrivee !== undefined) { champs.arrivee = v.statut === 'absent' || v.statut === 'justifie' ? '' : v.arrivee; champs.depart = champs.arrivee ? v.depart : ''; }
      if (champs.depart && champs.arrivee && champs.depart < champs.arrivee) { toast('Le départ ne peut pas précéder l\'arrivée.', true); return; }
      fermerFeuille();
      pointer(x, form.dataset.eleve, champs).then(rendre);
    },
    cahier: function (form) {
      var x = E.cache.pointage;
      var v = valeurs(form);
      assurerSeance(x).then(function () { return muter('seances', x.id, { contenu: v.contenu, travail: v.travail }); }).then(function () { toast('Cahier de textes enregistré — à relire dans Plus › Cahier de textes.'); rendre(); });
    },
    creneau: function (form) {
      var v = valeurs(form);
      var c = { id: form.dataset.id || nouvelId(), centre_id: form.dataset.centre, classe_id: v.classe_id, matiere_id: v.matiere_id,
        enseignant_id: v.enseignant_id || '', jour: +v.jour, debut: v.debut, fin: v.fin, salle: v.salle };
      if (!c.debut || !c.fin || c.debut >= c.fin) { toast('La fin doit venir après le début.', true); return; }
      var conflit = conflitLocal(c);
      if (conflit) { toast(conflit, true); return; }
      var id = c.id; delete c.id;
      var enregistrer = function () {
        fermerFeuille();
        EMP.jour = c.jour;
        muter('creneaux', id, c).then(function () { toast('Créneau enregistré.'); rendre(); });
      };
      var niveau = (ligne('classes', c.classe_id) || {}).niveau;
      var pl = horairesPour(c.centre_id, niveau);
      var dedans = pl.some(function (x) { return Number(x.jour) === c.jour && x.debut <= c.debut && x.fin >= c.fin; });
      if (pl.length && !dedans) {
        var duJour = pl.filter(function (x) { return Number(x.jour) === c.jour; });
        confirmer('Ce cours est en dehors des horaires du centre' + (niveau ? ' pour les ' + niveau : '') + ' (' + JOURS[c.jour].toLowerCase() + ' : ' +
          (duJour.length ? duJour.map(function (x) { return heureLisible(x.debut) + ' – ' + heureLisible(x.fin); }).join(', ') : 'pas de cours') + '). L\'enregistrer quand même ?', 'Enregistrer', enregistrer);
        return;
      }
      enregistrer();
    },
    horaire: function (form) {
      var v = valeurs(form);
      if (!v.debut || !v.fin || v.debut >= v.fin) { toast('La fin doit venir après le début.', true); return; }
      var niveaux = Array.prototype.map.call(form.querySelectorAll('input[name=niveau]:checked'), function (i) { return i.value; }).join(',');
      fermerFeuille();
      muter('horaires', form.dataset.id || nouvelId(), { centre_id: form.dataset.centre, jour: +v.jour, debut: v.debut, fin: v.fin, niveaux: niveaux })
        .then(function () { toast('Horaire enregistré.'); rendre(); });
    },
    classe: function (form) {
      var v = valeurs(form);
      var id = form.dataset.id || nouvelId();
      var champs = { centre_id: form.dataset.centre, nom: v.nom, niveau: v.niveau };
      if (v.inscription !== undefined) { champs.inscription = Number(v.inscription) || 0; champs.mensualite = Number(v.mensualite) || 0; }
      if (!form.dataset.id) champs.ordre = lignes('classes').filter(function (k) { return k.centre_id === form.dataset.centre; }).length + 1;
      fermerFeuille();
      muter('classes', id, champs).then(function () { toast('Classe enregistrée.'); rendre(); });
    },
    matiere: function (form) {
      var v = valeurs(form);
      var id = form.dataset.id || nouvelId();
      var champs = { nom: v.nom };
      if (!form.dataset.id) champs.ordre = lignes('matieres').length + 1;
      fermerFeuille();
      muter('matieres', id, champs).then(function () { toast('Matière enregistrée.'); rendre(); });
    },
    mdp: function (form) {
      var v = valeurs(form);
      if (v.nouveau !== v.confirme) { toast('Les deux saisies ne correspondent pas.', true); return; }
      occupe(form, true);
      api('moi/mdp', { ancien: v.ancien, nouveau: v.nouveau }).then(function () { fermerFeuille(); toast('Mot de passe changé.'); }, function (e) { occupe(form, false); toast(e.message, true); });
    },
    pin: function (form) {
      var pin = valeurs(form).pin;
      if (!/^\d{4}$/.test(pin)) { toast('Le code fait 4 chiffres.', true); return; }
      var sel = nouvelId();
      hacherPin(pin, sel).then(function (h) { return metaEcrire('pin', { sel: sel, hash: h }); })
        .then(function () { fermerFeuille(); toast('Code activé.'); rendre(); });
    }
  };

  function nomAppareil() {
    var ua = navigator.userAgent;
    var m = ua.match(/Android[^;)]*;\s*([^;)]+)/) || ua.match(/(iPhone|iPad)/) || ua.match(/(Windows|Macintosh|Linux)/);
    var nav = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Navigateur';
    return ((m ? m[1].trim() : 'Appareil') + ' · ' + nav).slice(0, 120);
  }

  // ───────────────────────────── Branchements ─────────────────────────────
  document.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-a]');
    if (el && !el.disabled && ACTIONS[el.dataset.a]) { ev.preventDefault(); ACTIONS[el.dataset.a](el, ev); return; }
    if (ev.target.id === 'feuille') fermerFeuille();
  });
  document.addEventListener('submit', function (ev) {
    var f = ev.target.closest('form[data-f]');
    if (f && FORMULAIRES[f.dataset.f]) { ev.preventDefault(); FORMULAIRES[f.dataset.f](f); }
  });
  document.addEventListener('change', function (ev) {
    if (ev.target.dataset && ev.target.dataset.change === 'statut-ens') { var cr = $('#champ-remplacant'); if (cr) cr.hidden = ev.target.value !== 'remplace'; return; }
    if (ev.target.dataset && ev.target.dataset.change === 'mode-paiement') { var c = $('#champ-reference'); if (c) c.hidden = !/^(momo|om|virement)$/.test(ev.target.value); return; }
    if (ev.target.dataset && ev.target.dataset.change === 'eleves-tous') { ELV.tous = ev.target.checked; dessinerListeEleves(); return; }
    if (ev.target.dataset && ev.target.dataset.change === 'emploi-filtre') { EMP.filtre = ev.target.value; rendre(); return; }
    if (ev.target.dataset && ev.target.dataset.change === 'creneau-matiere') {
      var f = ev.target.form;
      var s = f.querySelector('#choix-prof');
      s.innerHTML = optionsProfs(enseignantsDu(f.dataset.centre), ev.target.value, s.value);
      return;
    }
    if (ev.target.dataset && ev.target.dataset.change === 'import-centre') {
      var zone = $('#feuille textarea[name=liste]'), garde = zone ? zone.value : '';
      ELV.centre = ev.target.value; ELV.classe = '';
      feuilleImport(ev.target.value);
      var z2 = $('#feuille textarea[name=liste]'); if (z2 && garde) { z2.value = garde; apercuImport(z2.form); }
      return;
    }
    if (ev.target.dataset && ev.target.dataset.change === 'centre') {
      E.centre = ev.target.value;
      metaEcrire('centre', E.centre);
      rendre();
    }
  });
  document.addEventListener('input', function (ev) {
    var k = ev.target.dataset && ev.target.dataset.input;
    if (k === 'recherche-eleve') { ELV.q = ev.target.value; dessinerListeEleves(); }
    if (k === 'apercu-import') apercuImport(ev.target.form);
    if (k === 'redater-total') majTotalRedater();
    if (k === 'redater-filtre') {
      var q = ev.target.value.trim().toLowerCase();
      Array.prototype.forEach.call(document.querySelectorAll('#feuille .ligne-redater'), function (l) { l.hidden = !!q && l.dataset.nom.indexOf(q) < 0; });
    }
    if (k === 'apercu-ident') { var a = $('#apercu-ident'); if (a) a.textContent = identifiantDepuisNom(ev.target.value) || 'à partir du nom'; }
    if (k === 'recherche-caisse') { CAI.q = ev.target.value; dessinerRechercheCaisse(); }
  });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !$('#feuille').hidden) fermerFeuille(); });
  window.addEventListener('hashchange', function () { fermerFeuille(); rendre(); window.scrollTo(0, 0); });
  window.addEventListener('online', function () { E.enLigne = true; synchroniser(); });
  window.addEventListener('offline', function () { E.enLigne = false; majPuce(); });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { masqueLe = Date.now(); return; }
    if (!E.jeton) return;
    metaLire('pin').then(function (p) {
      if (p && masqueLe && Date.now() - masqueLe > VERROU_APRES_MS) { E.verrouille = true; rendre(); }
      else synchroniser();
    });
  });
  setInterval(function () { if (!document.hidden && E.jeton) synchroniser(); }, INTERVALLE_SYNC);

  // ───────────────────────────── Démarrage ─────────────────────────────
  ouvrirIdb().then(function () {
    return Promise.all([metaLire('jeton'), metaLire('profil'), metaLire('rev'), metaLire('centre'), metaLire('pin'), metaLire('equipe'), metaLire('tranches')]);
  }).then(function (m) {
    E.jeton = m[0]; E.profil = m[1]; E.rev = m[2] || 0; E.centre = m[3] || ''; E.equipe = m[5] || []; E.tranches = m[6] || {};
    if (E.jeton && !E.profil) E.jeton = null;
    if (E.jeton && m[4]) E.verrouille = true;
    return chargerLocal();
  }).then(function () {
    if (E.jeton) {
      choisirCentreParDefaut();
      // Le profil (rôles) peut avoir changé depuis la dernière ouverture.
      api('moi').then(function (r) {
        E.profil = { utilisateur: r.utilisateur, acces: r.acces || {}, capacites: r.capacites, restrictions: r.restrictions || [], retirables: r.retirables || [] };
        metaEcrire('profil', E.profil);
        choisirCentreParDefaut();
        if (!E.verrouille) rendre();
      }, function () {});
      synchroniser();
    }
    rendre();
  }, function (e) {
    $('#app').innerHTML = '<div class="connexion"><div class="boite"><div class="erreur">Stockage local indisponible (' + esc(e && e.message) + '). Navigation privée ? Ouvrez l\'application dans un onglet normal.</div></div></div>';
  });

  if (!NATIF && 'serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
})();
