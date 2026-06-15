// Pseudo-vérification PHP (PHP absent en local) : équilibre {} et () hors
// chaînes/commentaires. Ne remplace pas php -l (le garde-fou CI s'en charge)
// mais détecte les grosses casses après édition.
const fs = require('fs');
const file = process.argv[2];
const src = fs.readFileSync(file, 'utf8');
let depth = 0, par = 0, inS = null, esc = false, inLC = false, inBC = false;
for (let i = 0; i < src.length; i++) {
  const ch = src[i], nx = src[i + 1];
  if (inLC) { if (ch === '\n') inLC = false; continue; }
  if (inBC) { if (ch === '*' && nx === '/') { inBC = false; i++; } continue; }
  if (esc) { esc = false; continue; }
  if (inS) {
    if (ch === '\\') esc = true;
    else if (ch === inS) inS = null;
    continue;
  }
  if (ch === "'" || ch === '"') { inS = ch; continue; }
  if (ch === '/' && nx === '/') { inLC = true; i++; continue; }
  if (ch === '#') { inLC = true; continue; }
  if (ch === '/' && nx === '*') { inBC = true; i++; continue; }
  if (ch === '{') depth++; else if (ch === '}') depth--;
  else if (ch === '(') par++; else if (ch === ')') par--;
}
const ok = depth === 0 && par === 0;
console.log(file, '— accolades:', depth === 0 ? 'OK' : 'DESEQUILIBRE ' + depth,
  '| parentheses:', par === 0 ? 'OK' : 'DESEQUILIBRE ' + par);
process.exit(ok ? 0 : 1);
