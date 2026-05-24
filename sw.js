// ═══════════════════════════════════════════════════════════════════
// VÉRITAS Academy — Service Worker v1.2
// Stratégie : Cache First pour assets statiques, Network First pour
// les données dynamiques. Permet le fonctionnement hors-ligne basique.
// ═══════════════════════════════════════════════════════════════════

const CACHE_VERSION = 'veritas-v1.2.4';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Assets critiques pré-cachés à l'installation
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/app.html',
  '/manifest.webmanifest',
  '/Logo détouré.png'
];

// Domaines à mettre en cache runtime (CDN images/pictos)
const RUNTIME_DOMAINS = [
  'em-content.zobj.net',          // pictos 3D Microsoft Fluent
  'images.unsplash.com',           // illustrations
  'fonts.googleapis.com',          // CSS fonts
  'fonts.gstatic.com',             // fichiers fonts
  'cdnjs.cloudflare.com',          // libs (html2canvas, jspdf, xlsx)
  'cdn.jsdelivr.net'
];

// ═══════════════════════════════════════════════════════════════════
// INSTALLATION : pré-cache les assets critiques
// ═══════════════════════════════════════════════════════════════════
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS).catch(err => {
        console.warn('[SW] Pré-cache partiel:', err);
      }))
      .then(() => self.skipWaiting())
  );
});

// ═══════════════════════════════════════════════════════════════════
// ACTIVATION : nettoyage des vieux caches
// ═══════════════════════════════════════════════════════════════════
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => !k.startsWith(CACHE_VERSION))
            .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ═══════════════════════════════════════════════════════════════════
// FETCH : stratégie hybride
// ═══════════════════════════════════════════════════════════════════
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Ne PAS intercepter :
  if (req.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  if (url.pathname.includes('/api/')) return;        // toujours réseau pour API
  if (url.hostname.includes('firebasedatabase.app')) return; // jamais cacher Firebase
  if (url.hostname.includes('googletagmanager')) return;     // jamais cacher analytics
  if (url.hostname.includes('clarity.ms')) return;
  if (url.hostname.includes('google-analytics')) return;

  // Stratégie 1 : NETWORK FIRST pour HTML (toujours version fraîche si possible)
  if (req.destination === 'document' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(STATIC_CACHE).then(c => c.put(req, clone));
          }
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // Stratégie 2 : CACHE FIRST pour assets statiques (CSS, JS, fonts, images)
  if (RUNTIME_DOMAINS.some(d => url.hostname.includes(d)) ||
      req.destination === 'image' ||
      req.destination === 'font' ||
      req.destination === 'style' ||
      req.destination === 'script') {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(RUNTIME_CACHE).then(c => c.put(req, clone));
          }
          return res;
        }).catch(() => cached || new Response('', { status: 504 }));
      })
    );
    return;
  }

  // Stratégie 3 : DEFAULT — network fallback cache
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});

// ═══════════════════════════════════════════════════════════════════
// MESSAGE : permet à l'app de forcer un skipWaiting / clear cache
// ═══════════════════════════════════════════════════════════════════
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'CLEAR_CACHE') {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
  }
});
