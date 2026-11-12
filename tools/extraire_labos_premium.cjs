/* tools/extraire_labos_premium.cjs — sort le protocole et le quiz des labos
   PAYANTS de chunks/labo.js (public) vers api/_labos_premium.php (servi par
   api/apprendre.php?action=labo, après contrôle des droits).
   Idempotent : un labo déjà extrait (verrou:true) n'est pas retouché.
     node tools/extraire_labos_premium.cjs
   La théorie reste publique : elle est déjà sur les pages /decouvrir/labos/. */
'use strict';
const fs = require('fs'), path = require('path');
const racine = path.join(__dirname, '..');
const fChunk = path.join(racine, 'chunks/labo.js'), fPhp = path.join(racine, 'api/_labos_premium.php');
global.window = {};
require(fChunk);
const labos = window.LABO_DB.filter(l => !l.gratuit);
let ancien = {};
if (fs.existsSync(fPhp)) {
  const m = /\$VRT_LABOS_JSON = (<<<'JSON'\n)([\s\S]*?)\nJSON;/.exec(fs.readFileSync(fPhp, 'utf8'));
  if (m) ancien = JSON.parse(m[2]);
}
const contenu = Object.assign({}, ancien);
labos.forEach(l => { if (!l.verrou) contenu[l.id] = { experience: l.experience, quiz: l.quiz }; });
const php = `<?php
/**
 * api/_labos_premium.php — protocole et quiz des laboratoires PAYANTS.
 * Généré par tools/extraire_labos_premium.cjs : ne pas éditer à la main.
 * Lu par api/apprendre.php (action « labo ») après contrôle des droits ;
 * appelé directement par HTTP, il ne renvoie rien.
 */
if (basename((string) ($_SERVER['SCRIPT_FILENAME'] ?? '')) === basename(__FILE__)) { http_response_code(404); exit; }
$VRT_LABOS_JSON = <<<'JSON'
${JSON.stringify(contenu)}
JSON;
return json_decode($VRT_LABOS_JSON, true);
`;
fs.writeFileSync(fPhp, php);
// Retrait du chunk public : experience / quiz vidés, compteurs conservés pour les cartes.
let src = fs.readFileSync(fChunk, 'utf8'), n = 0;
labos.forEach(l => {
  if (l.verrou) return;
  const debut = src.indexOf('id:"' + l.id + '"');
  if (debut < 0) throw new Error('labo introuvable dans le chunk : ' + l.id);
  // fin de l'objet : prochain « {id: » ou fin du tableau
  let fin = src.indexOf('{id:"', debut + 5); if (fin < 0) fin = src.lastIndexOf('];');
  let bloc = src.slice(debut, fin);
  const avant = bloc;
  bloc = bloc.replace(/experience:\s*\[[\s\S]*?\],(\s*)quiz:\s*\[[\s\S]*?\](\s*,\s*(?:ressource|pack)\s*:)/,
    (m0, sp, suite) => 'experience:[],' + sp + 'quiz:[], verrou:true, nExp:' + l.experience.length + ', nQuiz:' + l.quiz.length + suite);
  if (bloc === avant) throw new Error('structure inattendue pour ' + l.id);
  src = src.slice(0, debut) + bloc + src.slice(fin); n++;
});
fs.writeFileSync(fChunk, src);
// Vérification : le chunk se recharge et ne contient plus aucun quiz payant.
delete require.cache[require.resolve(fChunk)]; global.window = {}; require(fChunk);
const reste = window.LABO_DB.filter(l => !l.gratuit && (l.quiz.length || l.experience.length));
if (reste.length) throw new Error('contenu payant encore public : ' + reste.map(l => l.id).join(', '));
console.log(n + ' labo(s) extrait(s) ; ' + Object.keys(contenu).length + ' au total dans api/_labos_premium.php');
