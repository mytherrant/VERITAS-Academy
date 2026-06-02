// Utilitaire de diagnostic visuel (NON un test). Lance Chromium, AUTORISE les
// polices Google (Material Symbols) mais coupe l'API prod + analytics, ferme le
// tutoriel d'onboarding, puis capture plusieurs sections pour auditer la charte.
//   node tests/screens.cjs
const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');

(async () => {
  const srv = spawn('node', ['tests/serve.cjs'], { cwd: process.cwd(), stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 1200));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  // Couper SEULEMENT la prod + analytics ; laisser passer les polices/icônes.
  await page.route('**/api/**', (r) => r.abort());
  await page.route(/googletagmanager|google-analytics|generativelanguage|anthropic|pollinations/i, (r) => r.abort());

  await page.goto('http://localhost:8099/VERITAS_v1.2.html', { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(3500);
  await page.screenshot({ path: 'test-results/01-accueil-modal.png' });

  // Fermer le tutoriel d'onboarding (plusieurs libellés possibles)
  for (const sel of ['text=Passer', 'text=close', 'text=Plus tard', '[aria-label="Fermer"]', '.modal-close']) {
    try { await page.click(sel, { timeout: 1200 }); break; } catch (e) {}
  }
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-results/02-accueil.png', fullPage: true });

  // Capture ciblée du panneau "Tu es..." (.vgz-roles) — avant refonte
  try {
    const roles = page.locator('.vgz-roles').first();
    if (await roles.count()) {
      await roles.scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await roles.screenshot({ path: 'test-results/roles-before.png' });
      console.log('roles capturé');
    } else { console.log('.vgz-roles absent du rendu'); }
  } catch (e) { console.log('roles capture skip:', e.message); }

  // Naviguer dans quelques sections visiteur
  const sections = [['E-learning', '03-elearning'], ['Boutique', '04-boutique'], ['IA', '05-ia'], ['Pratiquer', '06-pratiquer']];
  for (const [label, file] of sections) {
    try {
      await page.click(`text=${label}`, { timeout: 2000 });
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `test-results/${file}.png`, fullPage: true });
    } catch (e) { console.log('skip', label, e.message); }
  }

  await browser.close();
  srv.kill();
  console.log('Captures écrites dans test-results/');
})();
