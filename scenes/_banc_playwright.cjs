// Banc des Scènes vivantes hors navigateur intégré : node scenes/_banc_playwright.cjs [url de base]
// Joue chaque scène du catalogue jusqu'au bilan (avec _banc_scenes.js), ouvre l'onglet « L'œuvre » s'il existe,
// et échoue si une scène n'atteint pas 100 %, rate son quiz ou lève une erreur.
// Base par défaut : http://localhost:8123/scenes/ (serveur PHP de .claude/launch.json, « scenes-vivantes »).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const base = process.argv[2] || 'http://localhost:8123/scenes/';
const banc = fs.readFileSync(path.join(__dirname, '_banc_scenes.js'), 'utf8');
const w = {}; eval(fs.readFileSync(path.join(__dirname, 'catalogue.js'), 'utf8').replace('window.', 'w.'));
// L'atelier « chemin » (itinéraire) ne se joue pas automatiquement : on le teste à la main.
const pages = w.SCENES_CATALOGUE.map(s => s.f).filter(f => f !== 'espagnol-donde-esta.html');
(async () => {
  const nav = await chromium.launch();
  const ko = []; let fiches = 0, suites = 0;
  for(const f of pages){
    const pg = await nav.newPage();
    const errs = [];
    pg.on('pageerror', e => errs.push(e.message));
    await pg.goto(base + f + '?b=' + Date.now());
    await pg.addScriptTag({ content: banc });
    const r = await pg.evaluate(() => window.__bancScene());
    const extra = await pg.evaluate(() => {
      const suite = !!document.getElementById('bVersOeuvre');
      // « Pour aller plus loin » : une ressource gratuite ET une payante, au bilan
      const res = [].map.call(document.querySelectorAll('#bilan .sc-res'), a => (a.classList.contains('payant') ? 'P' : 'G') + (a.getAttribute('href') ? '' : '?')).join('');
      const o = document.querySelector('.sc-onglet[data-vue=oeuvre]');
      if(o){ o.click(); }
      // la bonne réponse ne doit pas être toujours en tête
      const pos = (window.SCENE.etapes || []).filter(e => e.t === 'question').concat(window.SCENE.quiz || []).map(q => q.options.findIndex(o => o.ok));
      const tete = pos.length > 2 && pos.every(p => p === 0);
      return { suite, res, tete, fiche: o ? document.querySelectorAll('.sc-f-perso').length : -1 };
    });
    if(extra.suite){ suites++; }
    if(extra.fiche > 0){ fiches++; }
    const q = (r.quiz || '').split('/').map(x => x.trim());
    const e = r.erreurs.concat(errs);
    if(!r.bilan || r.score !== '100%' || q.length < 2 || q[0] !== q[1] || q[1] !== '5' || e.length || extra.fiche === 0 || extra.res !== 'GP' || extra.tete){
      ko.push(f + ' → ' + r.score + ' · quiz ' + r.quiz + ' · fiche ' + extra.fiche + ' · plus loin ' + extra.res + (extra.tete ? ' · bonne réponse toujours en tête' : '') + (e.length ? ' · ' + e.join(' ; ') : ''));
    }
    await pg.close();
  }
  await nav.close();
  console.log(pages.length + ' scènes jouées · ' + fiches + ' fiches « L’œuvre » · ' + suites + ' bilans « La suite est dans le livre »');
  if(ko.length){ console.log('ÉCHECS :\n  ' + ko.join('\n  ')); process.exit(1); }
  console.log('tout au vert');
})();
