#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   tests/banc_sw_cahier.cjs — UN CORRECTIF ATTEINT-IL L'ACHETEUR DÉJÀ VENU ?

       node tests/banc_sw_cahier.cjs                  # le service worker du dépôt
       node tests/banc_sw_cahier.cjs <chemin/sw.js>   # un autre (mutation)

   POURQUOI CE BANC
   Le 21/09/2026, en production : un acheteur qui avait déjà ouvert un cahier
   gardait l'ANCIEN `gate.js` après déploiement — et le nouveau cache du
   service worker contenait lui-même l'ancien fichier. Rien ne le disait : le
   site servait bien la bonne version à qui arrivait pour la première fois.
   Aucun banc ne regardait `livrets/sw-cahier.js`.

   Deux causes, mesurées dans le navigateur, et ce banc reproduit les deux :
     ① la pré-copie lisait le cache HTTP, où `gate.js` est « immutable 1 an »
        même sans `?v=` ;
     ② `match(…, { ignoreSearch: true })` rend la PREMIÈRE copie insérée, et
        le rafraîchissement en ajoutait une seconde que personne ne lisait.

   CE QUI EST SIMULÉ, ET POURQUOI C'EST FIDÈLE
   On ne lance pas de navigateur : on exécute le vrai `sw-cahier.js` dans un
   bac à sable dont les trois pièces reprennent ce que le navigateur FAIT, pas
   ce qu'on voudrait qu'il fasse :
     · un Cache ORDONNÉ (put remplace la même URL exacte, sinon ajoute ;
       match rend la première correspondance) — c'est la cause ② ;
     · un cache HTTP qui garde toute réponse « immutable » et la ressert tant
       que la requête ne dit pas `cache: 'reload'` — c'est la cause ① ;
     · un serveur dont on change la version, comme un déploiement.
   ⚠️ Un bouchon plus indulgent que le navigateur ferait passer le défaut :
   c'est exactement ce qu'il ne faut pas (voir la mémoire « bouchon de test
   plus permissif »). Les deux comportements ci-dessus ont été mesurés sur
   veritas-school.com avant d'être écrits ici.
   ══════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');
const SW = process.argv[2] || path.join(RACINE, 'livrets', 'sw-cahier.js');
const ORIGINE = 'https://veritas-school.com';

const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m) => { b ? ok++ : ko++; console.log('  ' + (b ? V : X) + ' ' + m); };

const abs = (u) => new URL(u, ORIGINE).href;

/* ── Le navigateur : caches, cache HTTP, réseau ────────────────────────────── */
function navigateur() {
  const serveur = { version: 1, enLigne: true };
  const contenu = (u) => {
    const p = new URL(u).pathname;
    return `/* ${p} version ${serveur.version} */`;
  };

  // Cache HTTP : ce que « immutable, max-age=31536000 » fait réellement.
  const http = new Map();
  async function fetchNav(entree) {
    const req = entree instanceof Request ? entree : new Request(abs(entree));
    if (!serveur.enLigne) {
      // Hors ligne, le cache HTTP répond encore — sauf `reload`.
      if (req.cache !== 'reload' && http.has(req.url)) return http.get(req.url).clone();
      throw new TypeError('Failed to fetch (hors ligne)');
    }
    if (req.cache !== 'reload' && req.cache !== 'no-store' && http.has(req.url)) {
      return http.get(req.url).clone();
    }
    const rep = new Response(contenu(req.url), {
      status: 200,
      headers: { 'Content-Type': 'application/javascript',
                 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
    if (req.cache !== 'no-store') http.set(req.url, rep.clone());
    return rep;
  }

  // Cache Storage : ordonné, comme dans le navigateur.
  class Cache {
    constructor() { this.entrees = []; }            // [{ url, rep }]
    async match(r, o) {
      const u = abs(r instanceof Request ? r.url : r);
      const sans = (x) => x.split('?')[0];
      const e = this.entrees.find((x) => (o && o.ignoreSearch) ? sans(x.url) === sans(u) : x.url === u);
      return e ? e.rep.clone() : undefined;
    }
    async put(r, rep) {
      const u = abs(r instanceof Request ? r.url : r);
      const i = this.entrees.findIndex((x) => x.url === u);
      const e = { url: u, rep: rep.clone() };
      if (i >= 0) this.entrees[i] = e; else this.entrees.push(e);
    }
    async add(r) {
      const rep = await fetchNav(r);                  // passe par le cache HTTP
      if (!rep.ok) throw new TypeError('add: ' + rep.status);
      await this.put(r, rep);
    }
  }
  const stockage = new Map();
  const caches = {
    async open(n) { if (!stockage.has(n)) stockage.set(n, new Cache()); return stockage.get(n); },
    async keys() { return [...stockage.keys()]; },
    async delete(n) { return stockage.delete(n); },
    async match(r, o) {
      for (const c of stockage.values()) { const m = await c.match(r, o); if (m) return m; }
      return undefined;
    },
  };
  return { serveur, fetchNav, caches, stockage };
}

/* ── Installer une version du service worker, comme le fait la CI ────────── */
function installer(nav, source, version) {
  const code = source.replace(/(const CACHE = 'vrt-cahier-v)[0-9.]+(')/, `$1${version}$2`);
  const ecouteurs = {};
  const self = {
    location: { origin: ORIGINE, href: ORIGINE + '/livrets/sw-cahier.js' },
    addEventListener: (t, f) => { ecouteurs[t] = f; },
    skipWaiting: () => Promise.resolve(),
    clients: { claim: () => Promise.resolve() },
  };
  // `Request` relatif : dans un service worker, il se résout contre sa propre adresse.
  const RequestSW = function (u, o) { return new Request(abs(u instanceof Request ? u.url : u), o); };
  new Function('self', 'caches', 'fetch', 'Request', 'Response', 'Headers', 'URL', code)(
    self, nav.caches, nav.fetchNav, RequestSW, Response, Headers, URL);
  return ecouteurs;
}

async function evenement(f, extra) {
  const attentes = [];
  let reponse = null;
  const e = Object.assign({
    waitUntil: (p) => attentes.push(Promise.resolve(p).catch(() => {})),
    respondWith: (p) => { reponse = p; },
  }, extra);
  f(e);
  const r = reponse ? await reponse : null;
  await Promise.all(attentes);
  // Les attentes ajoutées pendant la résolution.
  await Promise.all(attentes);
  return r;
}

async function demander(ec, url) {
  const req = new Request(abs(url));
  const r = await evenement(ec.fetch, { request: req });
  return r ? (r.type === 'error' ? 'ERREUR' : await r.text()) : 'NON INTERCEPTÉ';
}

async function deployer(nav, source, version) {
  nav.serveur.version = version;
  const ec = installer(nav, source, '1.20.' + version);
  await evenement(ec.install, {});
  await evenement(ec.activate, {});
  return ec;
}

(async () => {
  const source = fs.readFileSync(SW, 'utf8');
  console.log(`\n${G}UN CORRECTIF ATTEINT-IL L'ACHETEUR DÉJÀ VENU ?${R}`);
  console.log(`  service worker : ${path.relative(RACINE, SW) || SW}\n`);

  const nav = navigateur();
  const GATE = (v) => `/livrets/gate.js?v=1.20.${v}`;

  // ── Première visite, version 1 ──
  let ec = await deployer(nav, source, 1);
  const v1 = await demander(ec, GATE(1));
  dire(/version 1/.test(v1), `première visite : gate.js version 1 servi (${v1.trim()})`);

  // ── Déploiement de la version 2 ; l'acheteur revient ──
  ec = await deployer(nav, source, 2);
  const cacheNeuf = [...nav.stockage.entries()].find(([n]) => /1\.20\.2$/.test(n));
  const precopie = cacheNeuf
    ? await cacheNeuf[1].match('/livrets/gate.js', { ignoreSearch: true }) : null;
  const texteP = precopie ? await precopie.text() : '(aucune)';
  dire(/version 2/.test(texteP),
    `① la pré-copie du NOUVEAU service worker est la version 2, pas celle du cache HTTP (${texteP.trim()})`);

  const retour1 = await demander(ec, GATE(2));
  dire(/version 2/.test(retour1),
    `② dès la PREMIÈRE ouverture après déploiement, l'acheteur reçoit la version 2 (${retour1.trim()})`);
  const retour2 = await demander(ec, GATE(2));
  dire(/version 2/.test(retour2), `   et à la suivante aussi (${retour2.trim()})`);

  // ── Une seule copie par fichier ──
  const c = cacheNeuf ? cacheNeuf[1] : { entrees: [] };
  const copies = c.entrees.filter((x) => x.url.split('?')[0] === ORIGINE + '/livrets/gate.js').length;
  dire(copies === 1, `une seule copie de gate.js dans le cache (${copies})`);

  // ── Hors ligne : le cahier doit toujours s'ouvrir ──
  nav.serveur.enLigne = false;
  const horsLigne = await demander(ec, GATE(2));
  dire(/version 2/.test(horsLigne), `hors ligne, la copie gardée répond (${horsLigne.trim()})`);
  // Hors ligne ET une version plus récente demandée (page servie par le cache
  // HTML plus neuve que le JS) : on rend ce qu'on a plutôt qu'une erreur.
  const horsLigne3 = await demander(ec, GATE(3));
  dire(/version 2/.test(horsLigne3),
    `hors ligne, une version inconnue retombe sur la copie gardée (${horsLigne3.trim()})`);
  nav.serveur.enLigne = true;

  // ── Les autres fichiers de la coquille suivent la même règle ──
  const moteur = await demander(ec, '/livrets/cahier.js?v=1.20.2');
  dire(/version 2/.test(moteur), `le moteur (cahier.js) suit aussi (${moteur.trim()})`);

  // ── Ce que ce service worker ne doit JAMAIS toucher ──
  const api = await demander(ec, '/api/livret.php');
  dire(api === 'NON INTERCEPTÉ', `l'API n'est jamais interceptée (${api})`);

  console.log('\n' + '─'.repeat(68));
  if (ko) {
    console.log(`\x1b[31m${G}  ${X} ${ko} contrôle(s) en échec sur ${ok + ko}${R}`);
    process.exit(1);
  }
  console.log(`\x1b[32m${G}  ✓ ${ok}/${ok} — le correctif atteint l'acheteur déjà venu.${R}`);
})().catch((e) => { console.error(e); process.exit(2); });
