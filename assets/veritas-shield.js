/* ════════════════════════════════════════════════════════════════════
 * VÉRITAS — Bouclier navigateur (v2.0)
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 * Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
 *
 * CE QU'IL FAIT
 * Quand le serveur répond « 429 + X-Veritas-Shield: challenge », ce script
 * résout la preuve de travail, obtient un laissez-passer, et REJOUE la
 * requête d'origine. Pour l'élève, il ne s'est rien passé qu'un court
 * message ; la page qu'il attendait s'affiche.
 *
 * POURQUOI IL NE DEMANDE RIEN À L'UTILISATEUR
 * Un curseur à faire glisser ou des images à cliquer, c'est du temps pris à
 * l'élève et presque rien au robot. Ici c'est la machine qui paie. Aucun
 * geste, aucune image, aucun tiers : ni Google, ni Cloudflare, rien ne
 * quitte veritas-school.com.
 *
 * SANS JAVASCRIPT, SANS RÉSEAU
 * Le défi ne se déclenche jamais sur une première visite : il faut d'abord
 * avoir dépassé un débit. Un élève qui navigue normalement ne rencontre
 * jamais ce fichier.
 * ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  if (window.__VRT_SHIELD__) { return; }
  window.__VRT_SHIELD__ = true;

  var CLE_STOCK = 'vrt_pass';
  var URL_DEFI  = '/api/challenge.php';

  /* ──────────────────────────────────────────────────────────────────
   * 1. SHA-256 — implémentation autonome
   * ──────────────────────────────────────────────────────────────────
   * crypto.subtle.digest() serait plus rapide par appel, mais il est
   * asynchrone : 65 000 promesses à la file coûtent bien plus cher que le
   * calcul lui-même. Une boucle synchrone est ici l'option rapide.
   * ────────────────────────────────────────────────────────────────── */
  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  function sha256hex(msg) {
    /* UTF-8 : nos défis sont hexadécimaux, mais on reste correct par principe. */
    var octets = [], i, c;
    for (i = 0; i < msg.length; i++) {
      c = msg.charCodeAt(i);
      if (c < 0x80) { octets.push(c); }
      else if (c < 0x800) { octets.push(0xc0 | (c >> 6), 0x80 | (c & 63)); }
      else { octets.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63)); }
    }

    var lBits = octets.length * 8;
    octets.push(0x80);
    while (octets.length % 64 !== 56) { octets.push(0); }
    /* Longueur sur 64 bits : nos messages sont courts, les 4 octets hauts
       restent à zéro. */
    octets.push(0, 0, 0, 0,
      (lBits >>> 24) & 255, (lBits >>> 16) & 255, (lBits >>> 8) & 255, lBits & 255);

    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
             0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var w = new Array(64), bloc, t, a, b, cc, d, e, f, g, h, S0, S1, ch, maj, t1, t2;

    for (bloc = 0; bloc < octets.length; bloc += 64) {
      for (t = 0; t < 16; t++) {
        w[t] = (octets[bloc + t * 4] << 24) | (octets[bloc + t * 4 + 1] << 16)
             | (octets[bloc + t * 4 + 2] << 8) | octets[bloc + t * 4 + 3];
      }
      for (t = 16; t < 64; t++) {
        var g0 = w[t - 15], g1 = w[t - 2];
        S0 = ((g0 >>> 7) | (g0 << 25)) ^ ((g0 >>> 18) | (g0 << 14)) ^ (g0 >>> 3);
        S1 = ((g1 >>> 17) | (g1 << 15)) ^ ((g1 >>> 19) | (g1 << 13)) ^ (g1 >>> 10);
        w[t] = (w[t - 16] + S0 + w[t - 7] + S1) | 0;
      }

      a = H[0]; b = H[1]; cc = H[2]; d = H[3]; e = H[4]; f = H[5]; g = H[6]; h = H[7];

      for (t = 0; t < 64; t++) {
        S1  = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        ch  = (e & f) ^ (~e & g);
        t1  = (h + S1 + ch + K[t] + w[t]) | 0;
        S0  = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        maj = (a & b) ^ (a & cc) ^ (b & cc);
        t2  = (S0 + maj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0;
        d = cc; cc = b; b = a; a = (t1 + t2) | 0;
      }

      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + cc) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }

    var out = '';
    for (i = 0; i < 8; i++) { out += ('00000000' + (H[i] >>> 0).toString(16)).slice(-8); }
    return out;
  }
  window.__vrtSha256 = sha256hex;   // exposé pour les tests

  /* ──────────────────────────────────────────────────────────────────
   * 2. L'ÉCRAN D'ATTENTE
   * ──────────────────────────────────────────────────────────────────
   * Sans un mot, l'élève croit que le site est en panne et recharge — ce
   * qui aggrave précisément le débit qui a déclenché le défi. On explique,
   * brièvement, aux couleurs de VÉRITAS.
   * ────────────────────────────────────────────────────────────────── */
  var voile = null;

  function montreVoile() {
    if (voile || !document.body) { return; }
    voile = document.createElement('div');
    voile.setAttribute('role', 'status');
    voile.setAttribute('aria-live', 'polite');
    voile.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:2147483000',
      'display:flex', 'align-items:center', 'justify-content:center',
      'background:rgba(20,37,84,.93)', 'backdrop-filter:blur(3px)',
      'font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif'
    ].join(';');

    var carte = document.createElement('div');
    carte.style.cssText = [
      'max-width:min(420px,88vw)', 'padding:28px 30px', 'border-radius:16px',
      'background:#fff', 'color:#142554', 'text-align:center',
      'box-shadow:0 24px 60px rgba(0,0,0,.35)'
    ].join(';');
    carte.innerHTML =
      '<div style="font-size:30px;line-height:1;margin-bottom:14px">🛡️</div>'
      + '<div style="font-weight:700;font-size:17px;margin-bottom:8px">Vérification de votre navigateur</div>'
      + '<div id="vrtShieldTxt" style="font-size:14px;line-height:1.5;color:#4a5878">'
      + 'Quelques instants, le temps de confirmer que vous n’êtes pas un robot. '
      + 'Rien à faire de votre côté.</div>'
      + '<div style="margin-top:18px;height:5px;border-radius:99px;background:#e8ecf5;overflow:hidden">'
      + '<div id="vrtShieldBar" style="height:100%;width:6%;border-radius:99px;background:#FFC93C;'
      + 'transition:width .25s ease"></div></div>';

    voile.appendChild(carte);
    document.body.appendChild(voile);
  }

  function avance(pct) {
    var b = document.getElementById('vrtShieldBar');
    if (b) { b.style.width = Math.max(6, Math.min(100, pct)) + '%'; }
  }

  function cacheVoile() {
    if (voile && voile.parentNode) { voile.parentNode.removeChild(voile); }
    voile = null;
  }

  /* ──────────────────────────────────────────────────────────────────
   * 3. RÉSOUDRE
   * ──────────────────────────────────────────────────────────────────
   * Par tranches, pour que l'onglet ne se fige pas : un navigateur qui ne
   * répond plus, c'est un élève qui ferme la page.
   * ────────────────────────────────────────────────────────────────── */
  function resous(defi, difficulte, surAvance) {
    return new Promise(function (resolve, reject) {
      var cible  = new Array(difficulte + 1).join('0');
      var nonce  = 0;
      var essais = 0;
      var plafond = 40000000;   // garde-fou : on n'immobilise pas un téléphone sans fin
      var attendus = Math.pow(16, difficulte);

      function tranche() {
        var fin = essais + 6000;
        for (; essais < fin; essais++, nonce++) {
          if (sha256hex(defi + nonce).lastIndexOf(cible, 0) === 0) {
            surAvance(100);
            resolve(String(nonce));
            return;
          }
        }
        if (essais > plafond) { reject(new Error('trop long')); return; }
        surAvance(Math.min(97, (essais / attendus) * 90));
        setTimeout(tranche, 0);
      }
      tranche();
    });
  }

  /* ──────────────────────────────────────────────────────────────────
   * 4. LE LAISSEZ-PASSER
   * ────────────────────────────────────────────────────────────────── */
  function jetonEnMemoire() {
    try {
      var j = sessionStorage.getItem(CLE_STOCK);
      if (j) { return j; }
    } catch (e) { /* navigation privée : on se rabat sur le cookie */ }
    var m = document.cookie.match(/(?:^|;\s*)vrt_pass=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function retiensJeton(j) {
    try { sessionStorage.setItem(CLE_STOCK, j); } catch (e) { /* sans importance */ }
  }

  var enCours = null;   // une seule résolution à la fois, même si 10 appels échouent ensemble

  function obtiensLaissezPasser() {
    if (enCours) { return enCours; }

    enCours = (function () {
      montreVoile();
      return fetch(URL_DEFI, { credentials: 'same-origin', headers: { 'Accept': 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d || !d.defi) { throw new Error('défi illisible'); }
          return resous(d.defi, d.difficulte, avance).then(function (nonce) {
            return fetch(URL_DEFI, {
              method: 'POST',
              credentials: 'same-origin',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                defi: d.defi, difficulte: d.difficulte, exp: d.exp, sig: d.sig, nonce: nonce
              })
            });
          });
        })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d || !d.ok || !d.jeton) { throw new Error('laissez-passer refusé'); }
          retiensJeton(d.jeton);
          cacheVoile();
          return d.jeton;
        })
        .catch(function (err) {
          var t = document.getElementById('vrtShieldTxt');
          if (t) {
            t.textContent = 'La vérification n’a pas abouti. Rechargez la page ; '
                          + 'si cela persiste, écrivez à contact@veritas-school.com.';
          }
          setTimeout(cacheVoile, 6000);
          throw err;
        })
        .then(function (j) { enCours = null; return j; },
              function (e) { enCours = null; throw e; });
    })();

    return enCours;
  }

  /* ──────────────────────────────────────────────────────────────────
   * 5. L'INTERPOSITION
   * ──────────────────────────────────────────────────────────────────
   * On enveloppe fetch : le reste de VÉRITAS (app.js, les pages statiques)
   * n'a pas une ligne à changer. Un appel qui se heurte au défi est rejoué
   * tout seul une fois le laissez-passer obtenu.
   * ────────────────────────────────────────────────────────────────── */
  var fetchOrigine = window.fetch ? window.fetch.bind(window) : null;
  if (!fetchOrigine) { return; }

  function memeOrigine(entree) {
    try {
      var u = new URL(typeof entree === 'string' ? entree : (entree && entree.url) || '',
                      location.href);
      return u.origin === location.origin;
    } catch (e) { return false; }
  }

  window.fetch = function (entree, options) {
    options = options || {};

    /* On ne touche qu'à nos propres appels : le jeton n'a rien à faire
       chez un tiers, et une API externe n'a que faire de notre en-tête. */
    if (memeOrigine(entree)) {
      var j = jetonEnMemoire();
      if (j) {
        var h = new Headers(options.headers || (entree && entree.headers) || {});
        h.set('X-Veritas-Pass', j);
        options = Object.assign({}, options, { headers: h });
      }
    }

    return fetchOrigine(entree, options).then(function (rep) {
      if (rep.status !== 429 || rep.headers.get('X-Veritas-Shield') !== 'challenge') {
        return rep;
      }
      /* Le serveur demande une preuve : on la fournit et on rejoue. */
      return obtiensLaissezPasser().then(function (jeton) {
        var h2 = new Headers(options.headers || {});
        h2.set('X-Veritas-Pass', jeton);
        return fetchOrigine(entree, Object.assign({}, options, { headers: h2 }));
      }).catch(function () { return rep; });   // échec → on rend la réponse d'origine
    });
  };
})();
