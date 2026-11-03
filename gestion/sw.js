/* VÉRITAS Gestion — service worker : l'application s'ouvre même sans réseau.
 * Coquille : réseau d'abord (toujours la dernière version en ligne), cache en secours.
 * API : jamais mise en cache (les données passent par IndexedDB côté page).
 * La pré-copie force cache:'reload' : elle ne doit pas recopier une vieille
 * version gardée par le cache HTTP du navigateur.
 */
var VERSION = 'vg-0.9.0';
var COQUILLE = ['./', 'index.html', 'app.css?v=0.9.0', 'app.js?v=0.9.0', 'manifest.webmanifest', 'icone-512.png', 'logo.png', 'polices/poppins-400.woff2', 'polices/poppins-500.woff2', 'polices/poppins-600.woff2'];

self.addEventListener('install', function (ev) {
  ev.waitUntil(caches.open(VERSION).then(function (c) {
    return Promise.all(COQUILLE.map(function (u) {
      return fetch(new Request(u, { cache: 'reload' })).then(function (r) { if (r.ok) return c.put(u, r); });
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (ev) {
  ev.waitUntil(caches.keys().then(function (cles) {
    return Promise.all(cles.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (ev) {
  var url = new URL(ev.request.url);
  if (ev.request.method !== 'GET' || url.origin !== location.origin || url.pathname.indexOf('/api/') >= 0) return;
  ev.respondWith(fetch(ev.request).then(function (r) {
    if (r.ok) { var copie = r.clone(); caches.open(VERSION).then(function (c) { c.put(ev.request, copie); }); }
    return r;
  }).catch(function () {
    return caches.match(ev.request).then(function (r) {
      return r || (ev.request.mode === 'navigate' ? caches.match('index.html') : Response.error());
    });
  }));
});
