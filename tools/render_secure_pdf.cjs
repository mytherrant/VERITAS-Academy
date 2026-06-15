#!/usr/bin/env node
/**
 * tools/render_secure_pdf.cjs — Pré-rendu PDF → images de pages pour le lecteur
 * sécurisé VÉRITAS (api/secure_pdf.php). © 2026 Mythe Errant.
 *
 * POURQUOI — secure_pdf.php sert des IMAGES de pages (le PDF ne quitte jamais le
 * serveur). Si LWS n'a pas Imagick (rendu à la volée), pré-générez les images ici,
 * puis déposez le dossier produit dans  uploads/protected/books/<id>/  sur le serveur.
 *
 * INSTALLATION (une fois, dans ce dossier tools/) :
 *     npm install pdfjs-dist@4 @napi-rs/canvas
 *   (@napi-rs/canvas = binaires précompilés, AUCUN compilateur requis — Windows OK.)
 *
 * USAGE :
 *     node tools/render_secure_pdf.cjs <fichier.pdf> <bookId> [--dpi 120] [--quality 80] [--out <dossier>]
 *   Exemples :
 *     node tools/render_secure_pdf.cjs "Maths_3e.pdf" b1
 *     node tools/render_secure_pdf.cjs "GCE_Bio.pdf" elgce03 --dpi 140
 *
 * RÉSULTAT :  <out>/<bookId>/p001.jpg, p002.jpg, …   (out par défaut : uploads/protected/books)
 *   → uploadez ce dossier <bookId>/ dans  uploads/protected/books/  sur LWS.
 *   secure_pdf.php sert alors chaque page gated + filigrane, sans jamais exposer le PDF.
 */
'use strict';
const fs = require('fs');
const path = require('path');

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  return (i >= 0 && process.argv[i + 1]) ? process.argv[i + 1] : def;
}

async function main() {
  const input = process.argv[2];
  const bookId = (process.argv[3] || '').replace(/[^a-zA-Z0-9_\-]/g, '');
  if (!input || !bookId) {
    console.error('Usage : node tools/render_secure_pdf.cjs <fichier.pdf> <bookId> [--dpi 120] [--quality 80] [--out dossier]');
    process.exit(1);
  }
  if (!fs.existsSync(input)) { console.error('✗ Fichier introuvable : ' + input); process.exit(1); }

  const dpi = parseInt(arg('dpi', '120'), 10);
  const quality = parseInt(arg('quality', '80'), 10);
  const outRoot = arg('out', path.join(__dirname, '..', 'uploads', 'protected', 'books'));
  const scale = dpi / 72; // pdf.js : 72 dpi = échelle 1

  let pdfjs, canvasLib;
  try {
    pdfjs = require('pdfjs-dist/legacy/build/pdf.mjs');
  } catch (e) {
    try { pdfjs = require('pdfjs-dist/legacy/build/pdf.js'); }
    catch (e2) { console.error('✗ pdfjs-dist manquant. Lancez :  npm install pdfjs-dist@4 @napi-rs/canvas  (dans tools/)'); process.exit(1); }
  }
  try { canvasLib = require('@napi-rs/canvas'); }
  catch (e) { console.error('✗ @napi-rs/canvas manquant. Lancez :  npm install pdfjs-dist@4 @napi-rs/canvas  (dans tools/)'); process.exit(1); }

  const data = new Uint8Array(fs.readFileSync(input));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  const total = doc.numPages;
  const outDir = path.join(outRoot, bookId);
  fs.mkdirSync(outDir, { recursive: true });

  console.log('📄 ' + path.basename(input) + ' — ' + total + ' pages → ' + outDir + '  (dpi=' + dpi + ', q=' + quality + ')');
  for (let n = 1; n <= total; n++) {
    const page = await doc.getPage(n);
    let vp = page.getViewport({ scale });
    // Borne la largeur à 1240 px (lisible + léger)
    if (vp.width > 1240) vp = page.getViewport({ scale: scale * (1240 / vp.width) });
    const cv = canvasLib.createCanvas(Math.ceil(vp.width), Math.ceil(vp.height));
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cv.width, cv.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    const jpg = cv.toBuffer('image/jpeg', quality / 100);
    const f = path.join(outDir, 'p' + String(n).padStart(3, '0') + '.jpg');
    fs.writeFileSync(f, jpg);
    process.stdout.write('\r  ✓ page ' + n + '/' + total + ' (' + Math.round(jpg.length / 1024) + ' Ko)   ');
  }
  console.log('\n✅ Terminé. Déposez le dossier  ' + bookId + '/  dans  uploads/protected/books/  sur LWS.');
  console.log('   Pensez à régler  securePages=' + total + '  et  freePages  sur le livre/contenu (admin).');
}
main().catch(function (e) { console.error('\n✗ Erreur :', e.message); process.exit(1); });
