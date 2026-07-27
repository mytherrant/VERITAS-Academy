// Mini serveur statique zéro-dépendance pour prévisualiser VÉRITAS en local.
// Usage : node tests/static_server.cjs [port]
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = parseInt(process.argv[2] || '3000', 10);
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
  if (urlPath === '/') urlPath = '/VERITAS_v1.2.html';
  const file = path.normalize(path.join(ROOT, urlPath));
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  });
}).listen(PORT, () => console.log('VERITAS static server on http://localhost:' + PORT));
