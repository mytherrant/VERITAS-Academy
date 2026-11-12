#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   tools/alleger_html.cjs — LES COMMENTAIRES RESTENT DANS LE DÉPÔT
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     npx --yes -p esbuild@0.28.2 -c "node tools/alleger_html.cjs deploy"
     npx --yes -p esbuild@0.28.2 -c "node tools/alleger_html.cjs --fichier vitrine.html"

   POURQUOI (audit 3G du 28/10/2026)
     Les pages les plus lourdes livraient leurs commentaires de développement à
     chaque visiteur : 197 Ko sur l'Atelier, 47 Ko sur l'accueil, 45 Ko sur
     app.html. En 3G c'est du temps de premier affichage — et ces commentaires
     racontent aussi les failles corrigées et la logique de sécurité. app.js est
     minifié au déploiement depuis longtemps ; ses pages ne l'étaient pas.

   CE QUE FAIT L'OUTIL, SUR LES COPIES DE deploy/ SEULEMENT
     ① retire les commentaires HTML — SAUF les marqueurs d'un seul mot
       (`<!--vrt-habillage:barre-->`, `<!-- seo-tete -->`) : le contrôle de
       production du déploiement les cherche dans la page servie, et les outils
       d'habillage s'y repèrent ;
     ② minifie les <script> en ligne (y compris le `text/x-dc` de l'Atelier,
       lu par support.js puis compilé par `new Function`) : espaces et syntaxe,
       JAMAIS les noms — les onclick="fonction()" du HTML en dépendent ;
     ③ minifie les <style> en ligne (espaces seulement).
     Le gabarit <x-dc> de l'Atelier perd ses commentaires mais garde ses <style>
     tels quels : ils sont relus par un moteur, pas par le navigateur.

   SÛRETÉ — tout bloc douteux est gardé tel quel, jamais la page entière perdue :
     un script qui ne se recompile pas après minification, une sortie qui
     contiendrait `</script` ou `<!--`, un esbuild absent (avertissement, rien
     n'est écrit).
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

// Les pages mesurées par l'audit, chemins relatifs au dossier traité.
const PAGES = ['index.html', 'vitrine.html', 'app.html', 'plateforme/index.html'];

function esbuild(code, loader) {
  const args = ['--loader=' + loader, '--charset=utf8', '--legal-comments=none', '--log-level=error',
    '--minify-whitespace'].concat(loader === 'js' ? ['--minify-syntax'] : []);
  const r = spawnSync('esbuild', args, { input: code, encoding: 'utf8', maxBuffer: 64 << 20,
    shell: process.platform === 'win32' });
  if (r.error || r.status !== 0) return null;
  return r.stdout;
}

function compile(code, dc) {
  try {
    if (dc) new Function('DCLogic', 'StreamableLogic', 'React', code);
    else new vm.Script(code);
    return true;
  } catch (e) { return false; }
}

function estJs(attrs) {
  if (/\bsrc\s*=/i.test(attrs)) return null;
  const t = (/\btype\s*=\s*["']?([^"'\s>]+)/i.exec(attrs) || [])[1];
  if (!t || /^(text|application)\/javascript$/i.test(t)) return 'js';
  if (/^text\/x-dc$/i.test(t)) return 'dc';
  return null;
}

function alleger(html, stats) {
  const xdcDebut = html.search(/<x-dc[\s>]/i);
  const xdcFin = html.lastIndexOf('</x-dc>');
  const dansXdc = i => xdcDebut !== -1 && i > xdcDebut && i < xdcFin;
  const garde = (pos, pourquoi) => {
    stats.gardes.push('l.' + html.slice(0, pos).split('\n').length + ' ' + pourquoi);
  };
  const RE = /<!--[\s\S]*?-->|<(script|style|textarea|pre)(?=[\s>])([^>]*)>([\s\S]*?)<\/\1\s*>/gi;
  return html.replace(RE, (bloc, balise, attrs, corps, pos) => {
    if (!balise) {
      if (/^<!--\[if|<!\[endif\]-->$/i.test(bloc)) return bloc;
      if (/^<!--\s*\/?[\w:.-]+\s*-->$/.test(bloc)) return bloc;
      stats.commentaires += bloc.length;
      return '';
    }
    balise = balise.toLowerCase();
    if (balise === 'textarea' || balise === 'pre' || !corps.trim()) return bloc;
    const ouvre = bloc.slice(0, bloc.indexOf('>') + 1);
    const ferme = '</' + balise + '>';
    if (balise === 'style') {
      if (dansXdc(pos)) return bloc;
      const css = esbuild(corps, 'css');
      if (css == null || !css.trim() || /<\/style/i.test(css)) { garde(pos, 'style'); return bloc; }
      stats.css += corps.length - css.length;
      return ouvre + css.trim() + ferme;
    }
    const genre = estJs(attrs);
    if (!genre) return bloc;
    const dc = genre === 'dc';
    if (!compile(corps, dc)) { garde(pos, 'script illisible avant minification'); return bloc; }
    const js = esbuild(corps, 'js');
    // Une sortie VIDE est légitime : un script fait seulement de commentaires.
    if (js == null) { garde(pos, 'esbuild a refusé le script'); return bloc; }
    if (/<\/script/i.test(js) || (js.indexOf('<!--') !== -1 && corps.indexOf('<!--') === -1)) {
      garde(pos, 'la sortie fermerait la balise'); return bloc;
    }
    if (!compile(js, dc)) { garde(pos, 'la sortie ne se recompile pas'); return bloc; }
    stats.js += corps.length - js.length;
    return ouvre + (dc ? '\n' + js : js.trim()) + ferme;
  });
}

function main() {
  const a = process.argv.slice(2);
  let fichiers;
  if (a[0] === '--fichier') fichiers = a.slice(1);
  else {
    const dossier = a[0] || 'deploy';
    fichiers = PAGES.map(p => path.join(dossier, p)).filter(f => fs.existsSync(f));
  }
  if (!esbuild('var a=1', 'js')) {
    console.log('::warning title=Pages non allégées::esbuild introuvable — les pages partent avec leurs commentaires (déploiement sûr).');
    return 0;
  }
  for (const f of fichiers) {
    const avant = fs.readFileSync(f, 'utf8');
    const stats = { commentaires: 0, js: 0, css: 0, gardes: [] };
    const apres = alleger(avant, stats);
    fs.writeFileSync(f, apres);
    const ko = n => Math.round(n / 1024) + ' Ko';
    console.log(`  ✓ ${f} : ${ko(Buffer.byteLength(avant))} → ${ko(Buffer.byteLength(apres))}  `
      + `(commentaires HTML −${ko(stats.commentaires)}, JS −${ko(stats.js)}, CSS −${ko(stats.css)})`);
    stats.gardes.forEach(g => console.log(`      gardé tel quel : ${g}`));
  }
  return 0;
}

if (require.main === module) process.exit(main());
module.exports = { alleger };
