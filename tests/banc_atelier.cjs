/* Banc d'essai de l'ecran de chargement de l'Atelier de Francais.
 *
 * Sert plateforme/ tel quel et simule api/plateforme.php. Le mode se change a
 * chaud par /__mode?m=..., sans redemarrer ni recharger le serveur :
 *
 *   ok      index reel bati sur api/data/corpus_minesec.json (1040 textes)
 *   auth    401 tant qu'aucun jeton n'a ete emis, 200 ensuite  <-- PROD
 *   bloque  en-tetes + quelques Ko, puis PLUS RIEN (la panne signalee)
 *   vide    200 avec textes: []
 *   muet    la requete n'obtient jamais de reponse
 *
 * Le mode `auth` rejoue la sequence REELLE de la production : un visiteur non
 * authentifie recoit 401, l'ecran de connexion s'affiche, il se connecte, et
 * le repertoire doit alors descendre. C'est ce parcours-la qui restait bloque
 * sur « Chargement du repertoire… » le 21/08 ; aucun autre mode ne
 * l'exerce, puisque tous les autres repondent des la premiere requete.
 *
 * `/__journal` rend la liste horodatee des requetes vues : c'est ce qui
 * permet de trancher « la requete n'est jamais partie » sans supposer.
 *
 * Il valide le RENDU des ecrans, pas la securite : aucun droit n'est verifie.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

/* path.resolve : un chemin donne avec des barres obliques ne se compare
   sinon plus a ce que path.join produit sous Windows, et TOUT le statique
   repartait en 403. */
const RACINE = path.resolve(process.argv[3] || process.cwd());
const PORT = Number(process.argv[2] || process.env.PORT || 3200);
let MODE = 'ok';
let JETON = '';                 // jeton emis par ?action=session
const JOURNAL = [];             // horodatage de chaque requete d'API vue
const T0 = Date.now();
const noter = (quoi) => { JOURNAL.push({ t: Date.now() - T0, quoi: quoi });
  console.log('[banc] +' + (Date.now() - T0) + 'ms ' + quoi); };

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

let INDEX = null;
function indexCorpus() {
  if (INDEX) return INDEX;
  const items = JSON.parse(fs.readFileSync(path.join(RACINE, 'api/data/corpus_minesec.json'), 'utf8'));
  INDEX = JSON.stringify({
    ok: true, total: items.length, libres: 20, palier: 'ens',
    plafonds: { textes: -1, citations: -1, exports: 30, ia: 30 },
    droit: { ok: true, motif: 'abonnement' },
    textes: items.map(t => ({
      n: t.n | 0, type: t.type || '', words: t.words | 0, level: t.level || '',
      cycle: t.cycle || '', group: t.group || '', groupKind: t.groupKind || '',
      subkind: t.subkind || '', usage: t.usage || '', author: t.author || '',
      title: t.title || '', reference: t.reference || '', faits: t.faits || '',
      libre: true, extrait: String(t.text || '').slice(0, 180)
    }))
  });
  return INDEX;
}

const serveur = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');

  if (u.pathname === '/__mode') {
    MODE = u.searchParams.get('m') || 'ok';
    if (u.searchParams.get('raz')) JETON = '';
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('mode=' + MODE + (JETON ? ' (jeton emis)' : ' (sans jeton)'));
  }
  if (u.pathname === '/__journal') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ mode: MODE, jeton: !!JETON, journal: JOURNAL }));
  }

  if (u.pathname.indexOf('/api/') === 0) {
    const action = u.searchParams.get('action') || '';
    res.setHeader('Access-Control-Allow-Origin', '*');

    /* Connexion : on emet un jeton, comme le fait api/plateforme.php. */
    if (u.pathname.indexOf('plateforme.php') >= 0 && action === 'session') {
      noter('session (connexion)');
      JETON = 'BANC-' + Date.now().toString(36);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, token: JETON,
        compte: { nom: 'Enseignant du banc', role: 'ens' },
        droit: { ok: true, motif: 'abonnement' } }));
    }

    if (u.pathname.indexOf('plateforme.php') >= 0 && action === 'corpus') {
      const porte = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
      if (MODE === 'auth' && (!JETON || porte !== JETON)) {
        noter('corpus -> 401 (pas de jeton valide)');
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ ok: false, error: 'Authentification requise' }));
      }
      if (MODE === 'muet') { noter('corpus -> MUET'); return; }
      if (MODE === 'vide') {
        noter('corpus -> VIDE');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ ok: true, total: 0, libres: 0, palier: 'ens', textes: [] }));
      }
      if (MODE === 'bloque') {
        noter('corpus -> BLOQUE (en-tetes + 40 Ko puis silence)');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8',
          'Transfer-Encoding': 'chunked' });
        res.write(indexCorpus().slice(0, 40000));
        return; // ni fin, ni erreur : la connexion reste ouverte
      }
      noter('corpus -> OK');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(indexCorpus());
    }
    noter('api ' + (action || u.pathname));
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ ok: true, configured: false, essai: { jours: 7, cadeau: 0 },
      service: 'banc', message: 'banc d’essai local' }));
  }

  let p = decodeURIComponent(u.pathname);
  if (p === '/' || p === '/plateforme' || p === '/plateforme/') p = '/plateforme/index.html';
  const f = path.join(RACINE, p.replace(/^\/+/, ''));
  if (!f.startsWith(RACINE)) { res.writeHead(403); return res.end('non'); }
  fs.readFile(f, (e, buf) => {
    if (e) { res.writeHead(404); return res.end('introuvable : ' + p); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream',
      'Cache-Control': 'no-store' });
    res.end(buf);
  });
});

serveur.listen(PORT, () => console.log('[banc] http://localhost:' + PORT + '/plateforme/  (mode=' + MODE + ')'));
