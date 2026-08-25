/* Réaligne les jetons `?v=` des modules de l'Atelier sur leur contenu.
 *
 * Pourquoi ce fichier existe, et pourquoi il vit DANS le dépôt
 * ------------------------------------------------------------
 * Les modules de `plateforme/` sont servis `immutable` pendant un an. Un
 * module corrigé mais dont l'URL n'a pas changé n'atteint JAMAIS un visiteur
 * déjà venu : il garde sa copie en cache. Le jeton `?v=<sha1>` est ce qui
 * change l'URL, et il doit donc suivre le CONTENU du fichier.
 *
 * `deploy.yml` en fait un garde-fou bloquant : il recalcule l'empreinte de
 * chaque module et refuse le déploiement si `index.html` en demande une
 * autre. Un module modifié sans repasser ici arrête donc la chaîne — ce qui
 * est le comportement voulu, mais encore faut-il avoir l'outil sous la main.
 * Les passes précédentes le gardaient dans un scratchpad de session, qui
 * disparaît : il a fallu le réécrire plus d'une fois.
 *
 * FINS DE LIGNE. L'empreinte est calculée sur le contenu NORMALISÉ en LF,
 * exactement comme le fait la CI (`tr -d '\r'`). Une copie de travail
 * Windows est en CRLF tandis que git stocke du LF : sans cette
 * normalisation, le même fichier donne deux empreintes différentes et le
 * garde-fou refuse un déploiement parfaitement sain. C'est arrivé le
 * 21/08/2026.
 *
 *   node tools/versionner_atelier.cjs          (réécrit index.html)
 *   node tools/versionner_atelier.cjs --verifie (contrôle seulement)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const RACINE = path.resolve(__dirname, '..');
const HTML = path.join(RACINE, 'plateforme/index.html');
const MODULES = ['support', 'minesec', 'conformite', 'exercices', 'texte', 'docx'];
const VERIFIE = process.argv.includes('--verifie');

const empreinte = f => crypto.createHash('sha1')
  .update(fs.readFileSync(f, 'utf8').replace(/\r/g, ''), 'utf8')
  .digest('hex').slice(0, 8);

let html = fs.readFileSync(HTML, 'utf8');
let change = 0, manque = 0;

MODULES.forEach(m => {
  const f = path.join(RACINE, 'plateforme', m + '.js');
  if (!fs.existsSync(f)) { console.log('  [ KO ] ' + m + '.js : absent'); manque++; return; }
  const reel = empreinte(f);
  const motif = new RegExp('(' + m + '\\.js\\?v=)([0-9a-f]+)', 'g');
  const trouve = html.match(motif);
  if (!trouve) { console.log('  [ KO ] ' + m + '.js : aucun jeton dans index.html'); manque++; return; }
  const actuel = trouve[0].split('v=')[1];
  if (actuel === reel) { console.log('  [ OK ] ' + m + '.js  v=' + reel); return; }
  if (VERIFIE) {
    console.log('  [ KO ] ' + m + '.js : index.html demande v=' + actuel + ', le fichier vaut ' + reel);
    manque++;
    return;
  }
  html = html.replace(motif, '$1' + reel);
  console.log('  [ MAJ ] ' + m + '.js : ' + actuel + ' -> ' + reel);
  change++;
});

if (!VERIFIE && change) {
  fs.writeFileSync(HTML, html, 'utf8');
  console.log('\n  ' + change + ' jeton(s) réalignés dans plateforme/index.html\n');
} else if (!manque) {
  console.log('\n  Tous les jetons suivent leur contenu\n');
}
process.exit(manque ? 1 : 0);
