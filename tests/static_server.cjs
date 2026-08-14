// Mini serveur statique zéro-dépendance pour prévisualiser VÉRITAS en local.
// Usage : node tests/static_server.cjs [port]
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
// Priorité : argument explicite > variable PORT > 3000. Sans la lecture de
// process.env.PORT, l'attribution automatique de port du harnais ne servait à
// rien : le script écoutait toujours 3000 et refusait de démarrer si un
// serveur y traînait déjà (EADDRINUSE).
const PORT = parseInt(process.argv[2] || process.env.PORT || '3000', 10);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json',
};

http.createServer((req, res) => {
  // Dépôt d'un asset généré dans le navigateur (ex. bannière OG rendue en
  // canvas). Outil de DÉVELOPPEMENT uniquement : ce serveur n'est jamais
  // déployé. Écriture confinée à la racine du dépôt, nom de fichier assaini.
  if (req.method === 'POST' && (req.url || '').split('?')[0] === '/__save') {
    const name = (new URL(req.url, 'http://x').searchParams.get('name') || '').replace(/[^\w.\-]/g, '');
    if (!name) { res.writeHead(400); res.end('nom manquant'); return; }
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const dest = path.join(ROOT, name);
        if (!dest.startsWith(ROOT)) { res.writeHead(403); res.end('hors racine'); return; }
        fs.writeFileSync(dest, Buffer.concat(chunks));
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('ok ' + Buffer.concat(chunks).length);
      } catch (e) { res.writeHead(500); res.end(String(e && e.message)); }
    });
    return;
  }

  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  /* ── Ce que sert la racine, à l'identique de la production ───────────────
     index.php sert vitrine.html sur « / » depuis la refonte d'août 2026, et
     deploy.yml copie VERITAS_v1.2.html sous le nom app.html. Ce serveur, lui,
     servait encore la coquille sur « / » et rien du tout sur /app.html.
     Conséquence : on ne pouvait tester EN LOCAL ni la vitrine à sa vraie
     adresse, ni la garde anti-double-accueil, ni un seul des liens de la
     vitrine vers l'application — ils répondaient tous 404. Un banc d'essai
     qui ne reproduit pas la production fabrique de faux diagnostics dans les
     deux sens : des pannes qu'on ne voit pas, et des pannes qui n'existent
     qu'ici. Même repli volontaire qu'index.php : à défaut de vitrine, la
     coquille. */
  if (urlPath === '/') {
    urlPath = fs.existsSync(path.join(ROOT, 'vitrine.html')) ? '/vitrine.html' : '/VERITAS_v1.2.html';
  } else if (urlPath === '/app.html') {
    urlPath = '/VERITAS_v1.2.html';
  }
  let file = path.normalize(path.join(ROOT, urlPath));
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  // DirectoryIndex, comme Apache/LiteSpeed en production. Sans cela, /niveaux/,
  // /corriges/ et /outils/ renvoyaient 404 EN LOCAL SEULEMENT — un faux bug très
  // coûteux : on cherche la panne dans le lien alors qu'elle est dans le serveur
  // de dev. Le site en ligne, lui, sert index.html tout seul.
  try {
    if (fs.statSync(file).isDirectory()) {
      const idx = path.join(file, 'index.html');
      if (fs.existsSync(idx)) file = idx;
      else { res.writeHead(404); res.end('404 — dossier sans index.html'); return; }
    }
  } catch (e) { /* inexistant : le readFile ci-dessous répondra 404 */ }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  });
}).listen(PORT, () => console.log('VERITAS static server on http://localhost:' + PORT));
