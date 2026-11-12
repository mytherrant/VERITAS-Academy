// Banc VÉRITAS Gestion — cohérence des versions (gestion/).
// Les CSS/JS sont servis « immutable » un an par le .htaccess racine : une
// modification n'atteint les téléphones que si le ?v= change partout à la fois
// (index.html, pré-copie du service worker, constante VERSION d'app.js).
'use strict';
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'gestion');
const lire = (f) => fs.readFileSync(path.join(dir, f), 'utf8');

const html = lire('index.html');
const sw = lire('sw.js');
const js = lire('app.js');
const v = new Set();
for (const m of html.matchAll(/(?:app\.css|app\.js)\?v=([\d.]+)/g)) v.add(m[1]);
for (const m of sw.matchAll(/(?:app\.css|app\.js)\?v=([\d.]+)/g)) v.add(m[1]);
const swVer = (sw.match(/var VERSION = 'vg-([\d.]+)'/) || [])[1];
const jsVer = (js.match(/var VERSION = '([\d.]+)'/) || [])[1];
const htmlCachet = (html.match(/<small>v([\d.]+)<\/small>/) || [])[1];
[swVer, jsVer, htmlCachet].forEach((x) => v.add(x));

if (v.size !== 1 || v.has(undefined)) {
  console.error('✗ Versions incohérentes dans gestion/ :', [...v]);
  process.exit(1);
}
console.log('✓ gestion/ en version ' + [...v][0] + ' partout (index.html, sw.js, app.js)');
