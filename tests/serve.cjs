// Serveur statique minimal (zéro dépendance) pour servir VÉRITAS en test.
// Racine = dossier du projet → les chemins absolus /app.js, /app.css résolvent.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 8099;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.mp4': 'video/mp4',
};

http.createServer((req, res) => {
  try {
    let p = decodeURIComponent((req.url || '/').split('?')[0]);
    if (p === '/') p = '/VERITAS_v1.2.html';
    const fp = path.normalize(path.join(ROOT, p));
    if (!fp.startsWith(ROOT) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
      res.writeHead(404); res.end('404'); return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(fp).pipe(res);
  } catch (e) {
    res.writeHead(500); res.end('500');
  }
}).listen(PORT, () => console.log('[serve] VÉRITAS statique sur http://localhost:' + PORT));
