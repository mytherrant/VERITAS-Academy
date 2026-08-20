#!/usr/bin/env node
/**
 * tools/render_livre_pdf.cjs — maquette HTML (composant doc-page) → PDF vectoriel.
 * © 2026 Mythe Errant.
 *
 * Appelé par tools/publier_livre.py quand on part d'une maquette plutôt que
 * d'un PDF déjà fabriqué. Deux règles qui ne se négocient pas :
 *   · scale 1.0 — toute réduction fausse les millimètres du format ;
 *   · preferCSSPageSize — le composant doc-page injecte son propre @page
 *     (148×210 mm pour un A5) ; l'écraser produirait un A4 avec des marges.
 *
 * Il attend que le composant soit défini ET que les polices soient chargées :
 * sans cela, le PDF sort avec des pages vides ou des polices de repli.
 *
 * USAGE :  node tools/render_livre_pdf.cjs <maquette.html> <sortie.pdf>
 * REQUIS :  npm i playwright   (utilise le Chrome installé du poste)
 */
'use strict';
const { chromium } = require('playwright');
const { pathToFileURL } = require('url');

(async () => {
  const src = process.argv[2], out = process.argv[3];
  if (!src || !out) {
    console.error('Usage : node tools/render_livre_pdf.cjs <maquette.html> <sortie.pdf>');
    process.exit(1);
  }
  const navigateur = await chromium.launch({ channel: 'chrome' });
  const page = await navigateur.newPage();
  const soucis = [];
  page.on('pageerror', e => soucis.push(String(e.message || e)));
  await page.goto(pathToFileURL(src).href, { waitUntil: 'load', timeout: 120000 });
  await page.waitForFunction(() => !!customElements.get('doc-page'), null, { timeout: 30000 })
    .catch(() => soucis.push('composant doc-page non défini — maquette sans pagination ?'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2500);
  await page.pdf({
    path: out, printBackground: true, preferCSSPageSize: true, scale: 1.0,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  await navigateur.close();
  if (soucis.length) console.error('⚠️ ' + soucis.slice(0, 3).join(' | '));
  console.log('PDF rendu : ' + out);
})().catch(e => { console.error('✗ ' + (e && e.message)); process.exit(1); });
