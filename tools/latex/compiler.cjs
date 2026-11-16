#!/usr/bin/env node
// Compile une épreuve LaTeX VÉRITAS en deux PDF vectoriels : <nom>-enonce.pdf et <nom>-corrige.pdf.
//   node tools/latex/compiler.cjs <source.tex> [dossier-sortie]
// Ou depuis un script : require('./compiler.cjs').compiler(texte, nom, sortie[, dossierImages]).
// Compilateur : Tectonic (XeTeX). Cherché dans TECTONIC, puis dans
// %LOCALAPPDATA%\Programs\tectonic\tectonic.exe, puis dans le PATH.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const RACINE = path.resolve(__dirname, '..', '..');
const GABARIT = __dirname;                       // veritas-epreuve.cls, veritas-logo-hd.png
const IMAGES = path.join(RACINE, 'assets');

function tectonic() {
  if (process.env.TECTONIC) return process.env.TECTONIC;
  const local = path.join(process.env.LOCALAPPDATA || '', 'Programs', 'tectonic', 'tectonic.exe');
  if (fs.existsSync(local)) return local;
  return 'tectonic';
}

/** Compile `texte` (source LaTeX complète) en <nom>-enonce.pdf et <nom>-corrige.pdf.
 *  Renvoie le nombre d'échecs (0 = les deux PDF sont écrits). */
function compiler(texte, nom, sortie, dossierImages) {
  fs.mkdirSync(sortie, { recursive: true });
  let echecs = 0;
  for (const mode of ['enonce', 'corrige']) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-tex-'));
    const fichier = path.join(tmp, `${nom}-${mode}.tex`);
    fs.writeFileSync(fichier, `\\def\\VRTmode{${mode}}\n` + texte);
    const args = [fichier, '--outdir', sortie, '--keep-logs',
      '-Z', `search-path=${GABARIT}`, '-Z', `search-path=${IMAGES}`];
    if (dossierImages) args.push('-Z', `search-path=${dossierImages}`);
    const r = spawnSync(tectonic(), args, { encoding: 'utf8' });
    const journal = (r.stdout || '') + (r.stderr || '');
    const log = path.join(sortie, `${nom}-${mode}.log`);
    if (r.status !== 0) {
      echecs++;
      console.error(`✗ ${nom}-${mode}.pdf\n` + journal.split('\n').filter(l => /error|^!/.test(l)).slice(0, 20).join('\n'));
      fs.copyFileSync(fichier, path.join(sortie, `${nom}-${mode}.tex`));   // pour le diagnostic
    } else {
      // Un caractère absent de la police s'imprimerait en blanc : c'est une erreur, pas un détail.
      const manque = fs.existsSync(log) ? (fs.readFileSync(log, 'utf8').match(/Missing character: There is no .*/g) || []) : [];
      const avert = journal.split('\n').filter(l => /^warning: .*Overfull/.test(l));
      if (manque.length) { echecs++; console.error(`✗ ${nom}-${mode}.pdf : caractères absents de la police\n   ` + [...new Set(manque)].slice(0, 8).join('\n   ')); }
      else console.log(`✓ ${path.join(sortie, nom + '-' + mode + '.pdf')}` + (avert.length ? `  (${avert.length} ligne(s) trop longue(s))` : ''));
      if (!manque.length && fs.existsSync(log)) fs.unlinkSync(log);
    }
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  return echecs;
}

module.exports = { compiler };

if (require.main === module) {
  const [src, sortieArg] = process.argv.slice(2);
  if (!src) { console.error('usage : node tools/latex/compiler.cjs <source.tex> [dossier-sortie]'); process.exit(2); }
  const source = path.resolve(src);
  const nom = path.basename(source, '.tex');
  const echecs = compiler(fs.readFileSync(source, 'utf8'), nom, path.resolve(sortieArg || path.dirname(source)), path.dirname(source));
  process.exit(echecs ? 1 : 0);
}
