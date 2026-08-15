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
    /* Router À L'IDENTIQUE DE LA PRODUCTION (index.php + deploy.yml) :
       « / » sert la VITRINE, et la coquille applicative est servie sous
       « /app.html ». Sans cela, ce serveur servait la coquille sur « / » — or
       depuis le correctif « un seul accueil », la coquille chargée sans ancre
       ni session fait `location.replace('/')`. Comme « / » renvoyait ENCORE la
       coquille, on obtenait une BOUCLE DE REDIRECTION infinie : le smoke test
       (`page.goto('/VERITAS_v1.2.html', {waitUntil:'load'})`) n'atteignait
       jamais l'événement `load` → timeout 45 s → CI rouge, déploiement bloqué.
       Repli volontaire, comme index.php : à défaut de vitrine, la coquille. */
    if (p === '/') {
      p = fs.existsSync(path.join(ROOT, 'vitrine.html')) ? '/vitrine.html' : '/VERITAS_v1.2.html';
    } else if (p === '/app.html') {
      p = '/VERITAS_v1.2.html';
    }
    let fp = path.normalize(path.join(ROOT, p));
    // DirectoryIndex comme Apache/LiteSpeed : /niveaux/ → /niveaux/index.html
    try { if (fs.existsSync(fp) && fs.statSync(fp).isDirectory()) fp = path.join(fp, 'index.html'); } catch (e) {}
    if (!fp.startsWith(ROOT) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
      res.writeHead(404); res.end('404'); return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(fp).pipe(res);
  } catch (e) {
    res.writeHead(500); res.end('500');
  }
}).listen(PORT, () => console.log('[serve] VÉRITAS statique sur http://localhost:' + PORT));
