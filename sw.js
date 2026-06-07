// ═══════════════════════════════════════════════════════════════════
// VÉRITAS Academy — Service Worker v2.9.11  ·  sw.js
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
//
// Œuvre originale protégée par le droit d'auteur (Loi camerounaise
// n° 2000/011 du 19 déc. 2000 et Convention de Berne).
// Reproduction, modification, distribution interdites sans accord écrit.
// Contrefaçon : 5-10 ans prison + 500 000 à 10 000 000 FCFA d'amende.
// Contact : contact@veritas-school.com  ·  https://veritas-school.com
//
// Stratégie : Network First pour HTML, Cache First pour assets.
// CORRECTION v2.9.11 : robustesse maximale — jamais de respondWith(undefined)
// (cause du bug "Failed to convert value to 'Response'" en v2.9.7-v2.9.10)
// ═══════════════════════════════════════════════════════════════════

// 🔄 v1.2.2 : INCRÉMENTER ce numéro à CHAQUE déploiement de contenu.
// Changer la version force le SW à se réinstaller, à purger les anciens caches
// et à recharger le nouveau code sur tous les appareils (corrige "le site ne change pas").
const CACHE_VERSION = 'veritas-v1.2.36';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
// v1.2.14 (P2) : cache fournisseurs INDÉPENDANT de la version de l'app — polices
// Google, libs CDN (jsPDF/xlsx/html2canvas/qrcode), emojis. Ces URLs sont stables :
// elles SURVIVENT aux déploiements (plus de re-téléchargement à chaque bump de version).
const VENDOR_CACHE  = 'veritas-vendor';

// v1.2.14 (P2) : version d'asset déduite de CACHE_VERSION → app.js / app.css sont
// précachés à leur URL versionnée (aucun numéro supplémentaire à maintenir).
const ASSET_VER = CACHE_VERSION.replace('veritas-v', '');

// Assets critiques pré-cachés à l'installation.
// v1.2.14 : app.css + app.js inclus → après une mise à jour du SW, le nouveau code est
// mis en cache EN ARRIÈRE-PLAN avant la prochaine navigation = chargement quasi instantané
// (au lieu de re-télécharger ~0,75 Mo au prochain affichage).
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/app.html',
  '/manifest.webmanifest',
  '/app.css?v=' + ASSET_VER,
  '/app.js?v='  + ASSET_VER
];

// Domaines à mettre en cache runtime (CDN images/pictos)
const RUNTIME_DOMAINS = [
  'em-content.zobj.net',
  'images.unsplash.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com',
  'cdn.jsdelivr.net'
];

// ═══════════════════════════════════════════════════════════════════
// HELPER : retourne TOUJOURS une Response valide (jamais undefined)
// ═══════════════════════════════════════════════════════════════════
function emptyResponse(status) {
  return new Response('', {
    status: status || 504,
    statusText: 'Service Worker fallback',
    headers: { 'Content-Type': 'text/plain' }
  });
}

// v2.9.17 : PNG transparent 1×1 — fallback pour les images qui échouent
// (ex: emojis 3D em-content.zobj.net inaccessibles/lents depuis le Cameroun).
// Évite l'icône "cassée" disgracieuse → affiche un pixel transparent à la place.
function transparentPng() {
  // PNG 1×1 transparent en base64
  const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  return new Response(bytes, {
    status: 200,
    statusText: 'OK (transparent fallback)',
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' }
  });
}

// ═══════════════════════════════════════════════════════════════════
// INSTALLATION : pré-cache + skipWaiting agressif
// ═══════════════════════════════════════════════════════════════════
self.addEventListener('install', event => {
  console.log('[SW v2.9.11] Installation...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        // Pré-cache chaque URL individuellement (ne pas tout casser si une fail)
        return Promise.all(PRECACHE_URLS.map(url =>
          cache.add(url).catch(err => {
            console.warn('[SW] Skip pre-cache', url, ':', err.message);
          })
        ));
      })
      .then(() => self.skipWaiting()) // IMPORTANT : prendre la main immédiatement
      .catch(err => {
        console.warn('[SW] Install error (non-bloquant):', err);
        return self.skipWaiting();
      })
  );
});

// ═══════════════════════════════════════════════════════════════════
// ACTIVATION : nettoyage caches anciens + clients.claim
// ═══════════════════════════════════════════════════════════════════
self.addEventListener('activate', event => {
  console.log('[SW v2.9.11] Activation...');
  event.waitUntil(
    Promise.all([
      // 1. Supprimer TOUS les anciens caches (même partiels d'autres versions)
      caches.keys().then(keys => Promise.all(
        // v1.2.14 (P2) : conserver VENDOR_CACHE (polices/CDN stables) entre déploiements.
        keys.filter(k => !k.startsWith(CACHE_VERSION) && k !== VENDOR_CACHE)
            .map(k => { console.log('[SW] Suppression cache:', k); return caches.delete(k); })
      )),
      // 2. Prendre le contrôle de tous les clients IMMÉDIATEMENT
      self.clients.claim(),
      // 3. Notifier les clients
      self.clients.matchAll({ includeUncontrolled: true }).then(clients =>
        clients.forEach(c => c.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION }))
      )
    ]).catch(err => console.warn('[SW] Activate error:', err))
  );
});

// ═══════════════════════════════════════════════════════════════════
// FETCH : stratégie hybride avec FALLBACK ROBUSTE (jamais undefined)
// ═══════════════════════════════════════════════════════════════════
self.addEventListener('fetch', event => {
  const req = event.request;

  // Filtres : NE PAS intercepter
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch(e) { return; }
  if (url.protocol === 'chrome-extension:') return;
  if (url.protocol === 'data:') return;
  if (url.protocol === 'blob:') return;
  if (url.pathname.includes('/api/')) return;
  if (url.hostname.includes('firebasedatabase.app')) return;
  if (url.hostname.includes('googletagmanager')) return;
  if (url.hostname.includes('clarity.ms')) return;
  if (url.hostname.includes('google-analytics')) return;
  if (url.hostname.includes('pollinations.ai')) return;  // jamais intercepter l'IA
  if (url.hostname.includes('openrouter.ai')) return;    // jamais intercepter l'IA
  if (url.hostname.includes('anthropic.com')) return;
  if (url.hostname.includes('identitytoolkit.googleapis')) return; // Firebase Auth
  if (url.hostname.includes('securetoken.googleapis')) return;

  // ── Stratégie 1 : NETWORK FIRST pour HTML ──
  const acceptHeader = req.headers.get('accept') || '';
  if (req.destination === 'document' || acceptHeader.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.ok && res.status === 200 && res.type !== 'error') {
            const clone = res.clone();
            caches.open(STATIC_CACHE).then(c => c.put(req, clone)).catch(()=>{});
          }
          return res || emptyResponse(504);
        })
        .catch(() =>
          caches.match(req)
            .then(r => r || caches.match('/index.html'))
            .then(r => r || caches.match('/'))
            .then(r => r || emptyResponse(504))  // ⚠️ FALLBACK ULTIME — jamais undefined
            .catch(() => emptyResponse(504))
        )
    );
    return;
  }

  // ── Stratégie 2 : CACHE FIRST pour assets statiques ──
  // v1.2.14 (P2) : assets tiers (polices/CDN, URLs stables) → VENDOR_CACHE (conservé
  // entre versions) ; assets same-origin (app.js/css versionnés, images) → RUNTIME_CACHE
  // (purgé à chaque déploiement, car app.js change de contenu sous une nouvelle ?v).
  const isVendor = RUNTIME_DOMAINS.some(d => url.hostname.includes(d));
  const isCacheable = isVendor ||
                      req.destination === 'image' ||
                      req.destination === 'font' ||
                      req.destination === 'style' ||
                      req.destination === 'script';
  if (isCacheable) {
    const targetCache = isVendor ? VENDOR_CACHE : RUNTIME_CACHE;
    event.respondWith(
      caches.match(req)
        .then(cached => {
          if (cached) return cached;
          return fetch(req)
            .then(res => {
              if (res && res.ok) {
                const clone = res.clone();
                caches.open(targetCache).then(c => c.put(req, clone)).catch(()=>{});
              }
              return res || emptyResponse(504);
            })
            .catch(() => emptyResponse(504));  // ⚠️ FALLBACK ULTIME
        })
        .catch(() => emptyResponse(504))
    );
    return;
  }

  // ── Stratégie 3 : DEFAULT — pass-through réseau, fallback cache ──
  event.respondWith(
    fetch(req)
      .then(res => res || emptyResponse(504))
      .catch(() =>
        caches.match(req).then(r => r || emptyResponse(504))
      )
  );
});

// ═══════════════════════════════════════════════════════════════════
// MESSAGE : commandes depuis l'app (skipWaiting, clear cache)
// ═══════════════════════════════════════════════════════════════════
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING' || (event.data && event.data.type === 'SKIP_WAITING')) {
    self.skipWaiting();
  }
  if (event.data === 'CLEAR_CACHE' || (event.data && event.data.type === 'CLEAR_CACHE')) {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
  }
  // v2.9.12 : permet à la page de vérifier la version active
  if (event.data && event.data.type === 'GET_VERSION') {
    const port = event.ports && event.ports[0];
    if (port) port.postMessage({ version: CACHE_VERSION });
  }
});
