// Génère scenes/catalogue.js à partir des scènes elles-mêmes : node scenes/_catalogue.js
// À relancer après l'ajout ou la modification d'une scène (titre, niveau, discipline, personnages, description).
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = __dirname;
const ECARTER = /^(narrateur|narratrice|prof|moderatrice|geographe|urbaniste)$/;
const out = [];
for(const f of fs.readdirSync(dir).filter(f => f.endsWith('.html') && !/^(index|personnages)\.html$/.test(f)).sort()){
  const h = fs.readFileSync(path.join(dir, f), 'utf8');
  const m = h.match(/<script>\s*(window\.SCENE[\s\S]*?)<\/script>/);
  if(!m){ continue; }
  const ctx = { window: {} };
  vm.runInNewContext(m[1], ctx);
  const S = ctx.window.SCENE, P = S.personnages || {};
  const cle = Object.keys(P).find(k => !ECARTER.test(k) && P[k].look) || Object.keys(P)[0];
  const meta = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  let desc = meta.includes(' : ') ? meta.slice(meta.indexOf(' : ') + 3) : meta;
  desc = desc.replace(/&amp;/g, '&');
  if(desc.length > 120){ desc = desc.slice(0, 117).replace(/[\s,;:]+\S*$/, '') + '…'; }
  desc = desc.charAt(0).toUpperCase() + desc.slice(1);
  out.push({
    f, titre: S.titre, niveau: S.niveau, discipline: S.discipline,
    oeuvre: S.oeuvre ? S.oeuvre + (S.auteur ? ', ' + S.auteur : '') : '',
    desc, couleur: (P[cle] && P[cle].couleur) || '#1E499B', look: (P[cle] && P[cle].look) || {}
  });
}
fs.writeFileSync(path.join(dir, 'catalogue.js'),
  '// Fichier généré par _catalogue.js — ne pas modifier à la main.\nwindow.SCENES_CATALOGUE = ' + JSON.stringify(out, null, 0).replace(/\},\{/g, '},\n{') + ';\n');
// Même liste, en liens statiques dans index.html : la page reste parcourable sans JavaScript, par les moteurs
// de recherche et par tests/banc_plan_site.cjs (qui vérifie que l'index mène à chaque page du dossier).
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const idx = path.join(dir, 'index.html');
let page = fs.readFileSync(idx, 'utf8');
const DEB = '<!--catalogue-->', FIN = '<!--/catalogue-->';
if(page.indexOf(DEB) < 0 || page.indexOf(FIN) < 0){ throw new Error('index.html : marqueurs ' + DEB + ' / ' + FIN + ' introuvables'); }
const liste = '<ul class="hub-plan">' + out.map(s => '<li><a href="' + esc(s.f) + '">' + esc(s.titre) + '</a> — ' + esc(s.niveau + ' · ' + s.discipline) + '</li>').join('') + '</ul>';
page = page.slice(0, page.indexOf(DEB) + DEB.length) + liste + page.slice(page.indexOf(FIN));
fs.writeFileSync(idx, page);
console.log(out.length + ' scènes au catalogue (catalogue.js et liens statiques de index.html)');
