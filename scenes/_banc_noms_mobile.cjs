// Mesure, au format téléphone (375 px), les étiquettes de noms qui passent sur plus de deux lignes sous les personnages.
// node scenes/_banc_noms_mobile.cjs [url de base] — sort en code 1 s'il en reste.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const base = process.argv[2] || 'http://localhost:8123/scenes/';
const w = {}; eval(fs.readFileSync(path.join(__dirname, 'catalogue.js'), 'utf8').replace('window.', 'w.'));
(async () => {
  const nav = await chromium.launch();
  const pg = await nav.newPage({ viewport: { width: 375, height: 812 } });
  const trop = [];
  for(const s of w.SCENES_CATALOGUE){
    await pg.goto(base + s.f + '?n=' + Date.now());
    const r = await pg.evaluate(() => [...document.querySelectorAll('.sc-troupe .sc-nom')].map(n => {
      const lh = parseFloat(getComputedStyle(n).lineHeight) || 16;
      return { nom: n.textContent, lignes: Math.round(n.scrollHeight / lh) };
    }).filter(x => x.lignes > 2));
    r.forEach(x => trop.push(s.f + ' : « ' + x.nom + ' » sur ' + x.lignes + ' lignes'));
  }
  await nav.close();
  console.log(trop.length ? trop.join('\n') : 'aucun nom sur plus de deux lignes');
  process.exit(trop.length ? 1 : 0);
})();
