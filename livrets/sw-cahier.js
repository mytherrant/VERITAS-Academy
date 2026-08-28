/* ════════════════════════════════════════════════════════════════════════════
   livrets/sw-cahier.js — LE CAHIER S'OUVRE MÊME SANS RÉSEAU
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.

   « La connexion internet reste chère au Cameroun et pas toujours accessible à
   tout moment. » Garder le CONTENU sur l'appareil (gate.js le fait, dans
   IndexedDB) ne sert à rien si la PAGE qui l'affiche ne se charge pas : sans
   réseau, `cahier.html` et ses trois fichiers reviennent en erreur, et l'élève
   voit le dinosaure du navigateur. Ce service worker garde la coquille.

   CE QU'IL MET DE CÔTÉ, ET CE QU'IL REFUSE DE METTRE DE CÔTÉ

     ✓ la coquille — cahier.html, apercu.html, gate.js, cahier.js, cahier.css.
       Ce sont des fichiers PUBLICS : ils ne contiennent aucun contenu de
       cahier, c'est tout l'objet de l'architecture. Les cacher n'expose rien.

     ✓ les aperçus gratuits (`extrait-*.js`), au fil des visites. Ils sont
       gratuits par destination — les mettre de côté, c'est offrir la démo à
       quelqu'un qui n'a plus de crédit, exactement le moment où il hésite.

     ✗ JAMAIS `api/livret.php` ni `api/cahier.php`. Une réponse d'API mise en
       cache, c'est une session qui survit à sa révocation et des réponses
       d'élève rejouées par-dessus les vraies. Le contenu vendu, lui, ne passe
       pas par ici : il arrive en POST (que le cache ignore) et se range dans
       IndexedDB, sous le bail de sept jours géré par gate.js.

   STRATÉGIE
     coquille  cache d'abord, réseau ensuite pour rafraîchir en silence. La
               page s'ouvre instantanément, y compris sur une ligne à 2G, et la
               version suivante arrive pour la fois d'après.
     API       réseau seulement. Hors ligne, l'échec est RENDU tel quel : c'est
               lui qui déclenche la lecture de la copie locale dans gate.js.
               L'intercepter ici pour « faire joli » masquerait la panne.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';

/* Le nom porte la version. Changer ce nombre suffit à jeter l'ancien cache :
   sans cela, une correction déployée resterait invisible pour qui a déjà
   ouvert le cahier une fois — la panne la plus difficile à croire, puisque le
   fichier EST corrigé sur le serveur. */
const CACHE = 'vrt-cahier-v1.20.3';

const COQUILLE = [
  '/livrets/cahier.html',
  '/livrets/apercu.html',
  '/livrets/gate.js',
  '/livrets/cahier.js',
  '/livrets/cahier.css',
];

self.addEventListener('install', (e) => {
  /* `addAll` échoue en bloc si UN seul fichier manque, et l'installation
     entière est perdue — donc plus de hors ligne du tout, pour un fichier
     renommé. On met de côté un par un, et on continue. */
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(
    COQUILLE.map((u) => c.add(u).catch(() => null))
  )).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((noms) => Promise.all(noms
      .filter((n) => n.startsWith('vrt-cahier-') && n !== CACHE)
      .map((n) => caches.delete(n))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;                 // les POST d'API : jamais
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;  // rien des autres domaines
  if (url.pathname.startsWith('/api/')) return;     // l'API va au réseau, point

  const estCoquille = COQUILLE.some((u) => url.pathname === u);
  const estApercu = /^\/livrets\/extrait-[a-z0-9_-]+\.js$/.test(url.pathname);
  if (!estCoquille && !estApercu) return;

  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cache) => {
      /* Le rafraîchissement passe par le réseau SANS bloquer la réponse : la
         page s'affiche depuis le cache, la version neuve arrive pour la
         prochaine ouverture. `ignoreSearch` parce que la CI réécrit les `?v=`
         à chaque déploiement — sans lui, chaque déploiement rendrait le cache
         inutile et le hors ligne cesserait de fonctionner en silence. */
      const frais = fetch(req).then((rep) => {
        if (rep && rep.ok) {
          const copie = rep.clone();
          caches.open(CACHE).then((c) => c.put(req, copie)).catch(() => {});
        }
        return rep;
      }).catch(() => null);

      return cache || frais.then((r) => r || Response.error());
    })
  );
});
