// Filet anti-régression VÉRITAS — smoke test du démarrage.
// Hermétique : aucun appel à la prod ni aux CDN (offline forcé) → on teste le
// BOOT pur du client. Détecte l'« écran blanc » (exception JS au démarrage,
// fonction manquante, etc.) — exactement la classe de bug que peut introduire
// un refactoring (découpage/lazy-load, changement de charte, etc.).
const { test, expect } = require('@playwright/test');

async function gotoOffline(page, collector) {
  page.on('pageerror', (e) => collector.push(String(e.message || e)));
  // Couper tout réseau externe : API (prod), CDN, analytics.
  await page.route('**/api/**', (r) => r.abort());
  await page.route(/cloudflare|googletagmanager|google-analytics|generativelanguage|anthropic|pollinations|gstatic|googleapis/i, (r) => r.abort());
  await page.goto('/VERITAS_v1.2.html', { waitUntil: 'load' });
  await page.waitForTimeout(2500); // laisser le boot + DOMContentLoaded s'exécuter
}

test.describe('VÉRITAS — démarrage (anti écran blanc)', () => {
  test('le portail visiteur démarre sans exception fatale', async ({ page }) => {
    const pageErrors = [];
    await gotoOffline(page, pageErrors);

    // 1) Aucune exception JS non capturée au démarrage.
    expect(pageErrors.join('\n')).toBe('');
    // 2) Le handler d'erreur global de l'app (#_errBox) ne doit PAS être apparu.
    await expect(page.locator('#_errBox')).toHaveCount(0);
    // 3) Le titre est bien celui de l'app.
    await expect(page).toHaveTitle(/V[ÉE]RITAS/i);
    // 4) Du contenu a été rendu (sinon = écran blanc).
    const text = (await page.locator('body').innerText()).trim();
    expect(text.length, 'la page semble vide (écran blanc)').toBeGreaterThan(150);

    // Capture pour diagnostic visuel (charte graphique).
    await page.screenshot({ path: 'test-results/portail-accueil.png', fullPage: true });
  });

  test('la barre de navigation visiteur est présente et cliquable', async ({ page }) => {
    const pageErrors = [];
    await gotoOffline(page, pageErrors);
    // Au moins quelques éléments interactifs présents (boutons/liens de nav).
    const clickables = await page.locator('button, a, [onclick]').count();
    expect(clickables, 'aucun élément interactif rendu').toBeGreaterThan(3);
    expect(pageErrors.join('\n')).toBe('');
  });
});
