// VÉRITAS — build de app.min.js (le fichier réellement chargé en prod).
//
//   Prérequis (une fois) :  npm i -D terser
//   Utilisation          :  node tools/minify.cjs
//
// IMPORTANT : minification SANS mangle ni compression. Les handlers inline
// (onclick="maFonction()") référencent des noms de fonctions GLOBAUX — les
// renommer (mangle) casserait toute l'app. On ne retire que commentaires et
// espaces. La bannière légale est préservée. Lancer ce script après CHAQUE
// modification de app.js, sinon le correctif n'atteint pas la production.
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'app.js');
const OUT = path.join(ROOT, 'app.min.js');

(async () => {
  const src = fs.readFileSync(SRC, 'utf8');
  const before = Buffer.byteLength(src);
  const res = await minify(src, {
    compress: false,
    mangle: false,
    format: {
      comments: (node, c) => /droits réservés|Mythe Errant|©|VÉRITAS Academy/i.test(c.value),
      beautify: false,
    },
  });
  if (res.error) { console.error('ERREUR terser:', res.error); process.exit(1); }
  if (!res.code || res.code.length < 1000000) { console.error('Sortie anormalement courte — abandon (app.min.js non écrit)'); process.exit(1); }
  fs.writeFileSync(OUT, res.code);
  const after = Buffer.byteLength(res.code);
  console.log('✓ app.min.js régénéré : ' + (before / 1048576).toFixed(2) + ' Mo → ' + (after / 1048576).toFixed(2) + ' Mo (-' + (((before - after) / before) * 100).toFixed(1) + '%)');
  console.log('  Pense à bumper la version ?v=… dans VERITAS_v1.2.html (anti-cache).');
})();
