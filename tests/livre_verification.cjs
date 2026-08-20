// tests/livre_verification.cjs — un livre numerique publie est-il vendable ?
// Fiche, mode texte, mode pages, mur de paiement, telephone.
//
// USAGE (deux terminaux, ou l'un en arriere-plan) :
//   node tests/livre_serveur_fictif.cjs . 8124
//   node tests/livre_verification.cjs http://localhost:8124 ./captures
// Sortie : 26 controles, code de sortie non nul au moindre echec.
// Chrome reel (rendu effectif) — les IntersectionObserver ne se declenchent que
// dans une page qui compose des images.
const { chromium } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:8124';
const SORTIE = process.argv[3] || '.';

const ok = [], ko = [];
function verifie(nom, condition, detail) {
  (condition ? ok : ko).push(nom + (detail ? '  [' + detail + ']' : ''));
}

(async () => {
  const navigateur = await chromium.launch({ channel: 'chrome' });
  const page = await navigateur.newPage({ viewport: { width: 1280, height: 900 } });
  const erreurs = [];
  page.on('pageerror', e => erreurs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') erreurs.push('console: ' + m.text()); });

  await page.goto(BASE + '/app.html#livre?id=tubedigestif', { waitUntil: 'load' });
  await page.waitForFunction(() => typeof window.openSecureBook === 'function', null, { timeout: 20000 });
  // Harnais local : les endpoints sont imites par le serveur de test.
  await page.evaluate(() => { window._secureApiBase = function () { return '/api'; }; });
  // Le livre n'est plus ecrit dans app.js : il arrive du catalogue deploye,
  // fusionne dans DB au demarrage. On attend cette fusion.
  await page.waitForFunction(
    () => { try { return !!eval('DB').books.find(b => b.id === 'tubedigestif'); } catch (e) { return false; } },
    null, { timeout: 20000 });
  await page.waitForTimeout(400);

  // ── 1. La fiche du livre ────────────────────────────────────────────────
  await page.evaluate(() => { window.viewBookDetail('tubedigestif'); });
  await page.waitForTimeout(600);
  const fiche = await page.evaluate(() => document.getElementById('vContent').innerText);
  verifie('fiche : prix 1 000 FCFA', /1.000 FCFA/.test(fiche));
  verifie('fiche : lecture en ligne annoncee', /Lire en ligne · 10 pages gratuites/.test(fiche));
  verifie('fiche : aucune mention MINESEC', !/MINESEC/.test(fiche));
  verifie('fiche : aucune promesse de corriges gratuits', !/corrigés en ligne restent gratuits/.test(fiche));
  verifie('fiche : aucune rupture de stock', !/Rupture/.test(fiche));
  verifie('fiche : parcours numerique', /Comment lire mon exemplaire/.test(fiche));
  verifie('fiche : ISBN affiche', /978-2-38299-047-6/.test(fiche));
  const origine = await page.evaluate(() => {
    const b = eval('DB').books.find(x => x.id === 'tubedigestif');
    return { pages: b.pages, prix: b.prix, epub: b.epub, chaps: (b.chaps || []).length,
             extrait: (b.extrait || '').split(/\s+/).length };
  });
  verifie('catalogue : fiche fusionnee depuis catalogue_livres.json',
    origine.pages === 144 && origine.prix === 1000 && origine.epub === true && origine.chaps === 8,
    JSON.stringify(origine));

  // ── 2. Le lecteur, mode TEXTE ───────────────────────────────────────────
  await page.evaluate(() => { try { window.closeSecureBook(); } catch (e) {} localStorage.setItem('vrt_sread_mode', 'texte'); });
  await page.evaluate(() => window.openSecureBook('tubedigestif'));
  await page.waitForSelector('#secureReader .sread-ch', { timeout: 15000 });
  await page.waitForFunction(() => {
    const s = document.querySelector('#secureReader .sread-ch[data-ch="4"] .sread-chbody');
    return s && s.innerText.length > 1000;
  }, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1200);

  const texte = await page.evaluate(() => {
    const st = window._secureState, stage = document.getElementById('sreadStage');
    return {
      mode: st.mode, chapitres: (st.chaps || []).length,
      libres: (st.chaps || []).filter(c => c.libre).length,
      sections: stage.querySelectorAll('.sread-ch').length,
      charges: [...stage.querySelectorAll('.sread-chbody')].map(b => b.innerText.trim().length),
      coupe: (stage.querySelector('.sread-cut') || {}).textContent || '',
      signature: (stage.querySelector('.sread-sign') || {}).textContent || '',
      paywall: (stage.querySelector('.sread-pay-t') || {}).textContent || '',
      prix: (stage.querySelector('.sread-pay-price') || {}).textContent || '',
      police: getComputedStyle(stage.querySelector('.sread-text')).fontSize,
      largeur: stage.querySelector('.sread-text').getBoundingClientRect().width,
      selection: getComputedStyle(document.querySelector('.sread')).userSelect,
    };
  });
  verifie('texte : 11 documents au sommaire', texte.chapitres === 11, 'recu ' + texte.chapitres);
  verifie('texte : 4 libres (3 liminaires + chapitre I)', texte.libres === 4, 'recu ' + texte.libres);
  verifie('texte : les sections libres se chargent',
    texte.charges.filter(n => n > 200).length >= 1, JSON.stringify(texte.charges));
  verifie('texte : marque de fin d\'extrait', /fin de l.extrait gratuit/.test(texte.coupe), texte.coupe);
  verifie('texte : exemplaire signe (tracabilite)', /reproduction interdite/.test(texte.signature));
  verifie('texte : mur de paiement', /extrait gratuit/i.test(texte.paywall), texte.paywall);
  verifie('texte : prix au mur', /1.000/.test(texte.prix), texte.prix);
  verifie('texte : colonne bornee (<=700 px)', texte.largeur <= 700, Math.round(texte.largeur) + 'px');
  verifie('texte : selection coupee', texte.selection === 'none', texte.selection);
  await page.screenshot({ path: SORTIE + '/lecteur-texte.png', fullPage: false });

  // Zoom : la police change, pas la largeur
  const avant = await page.evaluate(() => getComputedStyle(document.querySelector('.sread-text')).fontSize);
  await page.evaluate(() => { window._secureZoom(1); window._secureZoom(1); });
  const apres = await page.evaluate(() => getComputedStyle(document.querySelector('.sread-text')).fontSize);
  verifie('texte : le zoom agit sur la police', parseFloat(apres) > parseFloat(avant), avant + ' -> ' + apres);
  await page.evaluate(() => { window._secureZoom(-1); window._secureZoom(-1); });

  // Un chapitre paye est refuse par le serveur
  const refus = await page.evaluate(async () => {
    const r = await fetch('/api/secure_epub.php?id=tubedigestif&chap=6', { cache: 'no-store' });
    return r.status;
  });
  verifie('texte : chapitre paye refuse (402)', refus === 402, 'HTTP ' + refus);

  // ── 3. Le lecteur, mode PAGES ───────────────────────────────────────────
  await page.evaluate(() => window._secureMode('pages'));
  await page.waitForTimeout(2500);
  const pages = await page.evaluate(() => {
    const stage = document.getElementById('sreadStage'), st = window._secureState;
    const toiles = [...stage.querySelectorAll('.sread-img')];
    return {
      mode: st.mode, nbToiles: toiles.length,
      peintes: toiles.filter(c => c._painted).length,
      paywall: (stage.querySelector('.sread-pay-t') || {}).textContent || '',
      label: document.getElementById('sreadPageLbl').textContent,
    };
  });
  verifie('pages : 10 pages d\'apercu', pages.nbToiles === 10, 'recu ' + pages.nbToiles);
  verifie('pages : les premieres pages sont peintes', pages.peintes >= 1, pages.peintes + ' peinte(s)');
  verifie('pages : mur apres l\'apercu', /10 pages gratuites/.test(pages.paywall), pages.paywall);
  await page.screenshot({ path: SORTIE + '/lecteur-pages.png', fullPage: false });

  // Page payante refusee par le serveur
  const refusPage = await page.evaluate(async () => {
    const r = await fetch('/api/secure_pdf.php?id=tubedigestif&page=11', { cache: 'no-store' });
    return r.status;
  });
  verifie('pages : page 11 refusee (402)', refusPage === 402, 'HTTP ' + refusPage);

  // ── 4. Telephone : le mode texte doit s'imposer par defaut ──────────────
  const tel = await navigateur.newPage({ viewport: { width: 390, height: 780 }, isMobile: true, hasTouch: true });
  await tel.goto(BASE + '/app.html#livre?id=tubedigestif', { waitUntil: 'load' });
  await tel.waitForFunction(() => typeof window.openSecureBook === 'function', null, { timeout: 20000 });
  await tel.evaluate(() => { window._secureApiBase = function () { return '/api'; }; localStorage.removeItem('vrt_sread_mode'); });
  await tel.waitForFunction(
    () => { try { return !!eval('DB').books.find(b => b.id === 'tubedigestif'); } catch (e) { return false; } },
    null, { timeout: 20000 });
  await tel.evaluate(() => window.openSecureBook('tubedigestif'));
  await tel.waitForSelector('#secureReader .sread-ch', { timeout: 15000 });
  await tel.waitForTimeout(2500);
  const surTel = await tel.evaluate(() => {
    const st = window._secureState, t = document.querySelector('.sread-text');
    return { mode: st.mode, align: getComputedStyle(t).textAlign,
             police: getComputedStyle(t).fontSize,
             debordement: document.documentElement.scrollWidth > window.innerWidth };
  });
  verifie('telephone : mode texte par defaut', surTel.mode === 'texte', surTel.mode);
  verifie('telephone : texte aligne a gauche', surTel.align === 'left', surTel.align);
  verifie('telephone : pas de debordement horizontal', !surTel.debordement);
  await tel.screenshot({ path: SORTIE + '/lecteur-mobile.png' });

  // Les appels vers veritas-school.com (public_data, camerpay) echouent en CORS
  // depuis localhost : c'est le harnais, pas le code. On ne retient que le reste.
  const propres = erreurs.filter(e => !/CORS|ERR_FAILED|veritas-school\.com/.test(e));
  verifie('aucune erreur JavaScript (hors CORS du harnais)', propres.length === 0, propres.slice(0, 3).join(' | '));

  await navigateur.close();
  console.log('\n=== REUSSIS (' + ok.length + ') ===');
  ok.forEach(t => console.log('  OK  ' + t));
  if (ko.length) {
    console.log('\n=== ECHECS (' + ko.length + ') ===');
    ko.forEach(t => console.log('  KO  ' + t));
  }
  process.exit(ko.length ? 1 : 0);
})();
