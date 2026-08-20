// tests/livre_serveur_fictif.cjs — sert le projet ET imite api/secure_pdf.php
// + api/secure_epub.php pour eprouver un livre numerique SANS PHP (absent en local).
// Il rejoue la MEME logique de mur que les endpoints (apercu ouvert, au-dela
// 402) : il eprouve le CLIENT et le contenu prepare, PAS le code PHP.
//
// USAGE : node tests/livre_serveur_fictif.cjs <racine> <port> [<idLivre>]
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = path.resolve(process.argv[2]);
const PORT = parseInt(process.argv[3] || '8123', 10);
const LIVRE = process.argv[4] || 'tubedigestif';
const DIR = path.join(ROOT, 'uploads', 'protected', 'books', LIVRE);
const IDX = JSON.parse(fs.readFileSync(path.join(DIR, 'epub', 'index.json'), 'utf8'));

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };

const FREE_PAGES = 10;
const rangLibre = IDX.chapitres.findIndex(c => !c.liminaire) + 1;

function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}

http.createServer((req, res) => {
  const u = url.parse(req.url, true);
  const q = u.query;

  if (u.pathname === '/api/secure_pdf.php') {
    if (q.meta !== undefined) {
      return json(res, 200, { ok: true, id: LIVRE, pages: 144, freePages: FREE_PAGES,
        hasAccess: false, prepared: true, titre: 'Le Tube digestif' });
    }
    if (q.sign !== undefined) {
      const from = parseInt(q.from || '1', 10), sigs = {};
      const exp = Math.floor(Date.now() / 1000) + 600;
      for (let p = from; p < from + 8 && p <= FREE_PAGES; p++) sigs[p] = 'mock';
      return json(res, 200, { ok: true, exp, ttl: 600, sigs });
    }
    const p = parseInt(q.page || '0', 10);
    if (p > FREE_PAGES) return json(res, 402, { ok: false, error: 'Page reservee' });
    const f = path.join(DIR, 'p' + String(p).padStart(3, '0') + '.jpg');
    if (!fs.existsSync(f)) return json(res, 404, { ok: false, error: 'absente' });
    res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store' });
    return res.end(fs.readFileSync(f));
  }

  if (u.pathname === '/api/secure_epub.php') {
    if (q.meta !== undefined) {
      return json(res, 200, { ok: true, id: LIVRE, titre: 'Le Tube digestif', auteur: 'Mythe Errant',
        chapitres: IDX.chapitres.map((c, i) => ({ i: i + 1, titre: c.titre, mots: c.mots,
          liminaire: !!c.liminaire, libre: !!c.liminaire || (i + 1) === rangLibre })),
        mots: IDX.mots, hasAccess: false, prepared: true, freeUntil: rangLibre });
    }
    const n = parseInt(q.chap || '0', 10);
    const e = IDX.chapitres[n - 1];
    if (!e) return json(res, 400, { ok: false, error: 'chapitre invalide' });
    const libre = !!e.liminaire || n === rangLibre;
    if (!libre) return json(res, 402, { ok: false, error: 'Chapitre reserve — debloquez la version numerique pour lire la suite.' });
    const nom = e.free || e.f;
    let html = fs.readFileSync(path.join(DIR, 'epub', nom), 'utf8');
    html += '\n<p class="sread-sign">« Le Tube digestif » — exemplaire numerique de Apercu gratuit · '
         + new Date().toLocaleDateString('fr-FR') + ' · veritas-school.com · reproduction interdite</p>';
    return json(res, 200, { ok: true, i: n, total: IDX.chapitres.length, titre: e.titre,
      html, tronque: !!e.free, wm: 'Apercu gratuit' });
  }

  // Statique
  let p = decodeURIComponent(u.pathname);
  if (p === '/') p = '/app.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404); return res.end('404 ' + p);
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' });
  res.end(fs.readFileSync(f));
}).listen(PORT, () => console.log('mock sur http://localhost:' + PORT + ' (racine ' + ROOT + ')'));
