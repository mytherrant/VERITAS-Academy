#!/usr/bin/env node
/**
 * tools/build_seo.cjs — Générateur de PAGES SEO STATIQUES (v1.9, #7)
 * © 2026 Mythe Errant.
 *
 * POURQUOI — l'app VÉRITAS est une SPA (une seule URL) : Google ne voit qu'une
 * page. Or « sujet BEPC corrigé pdf », « épreuve maths 3ème Cameroun » sont des
 * requêtes massives. Ce script génère UNE page HTML indexable par épreuve
 * GRATUITE (contenu réel + balises SEO) qui pointe vers l'app → trafic organique
 * gratuit et durable, sans toucher au SPA.
 *
 * USAGE :  node tools/build_seo.cjs [--base https://veritas-school.com] [--out seo]
 * RÉSULTAT :  seo/<id>.html (1 par épreuve), seo/index.html, seo/sitemap.xml
 *   → déployez le dossier seo/ à la racine du site + référencez sitemap.xml.
 */
'use strict';
const fs = require('fs');
const path = require('path');

function arg(n, d){ const i = process.argv.indexOf('--' + n); return (i>=0&&process.argv[i+1])?process.argv[i+1]:d; }
const BASE = (arg('base', 'https://veritas-school.com')).replace(/\/$/, '');
const OUT = path.join(__dirname, '..', arg('out', 'seo'));
const APPJS = path.join(__dirname, '..', 'app.js');

function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ── Extraire le tableau EPREUVES_DB (données pures) depuis app.js ──
function extractEpreuves(){
  const src = fs.readFileSync(APPJS, 'utf8');
  const start = src.indexOf('window.EPREUVES_DB=[');
  if (start < 0) throw new Error('window.EPREUVES_DB introuvable dans app.js');
  const arrStart = src.indexOf('[', start);
  // Trouver le ] correspondant (équilibrage des crochets, en ignorant les chaînes)
  let depth = 0, inS = null, esc2 = false, end = -1;
  for (let i = arrStart; i < src.length; i++){
    const c = src[i];
    if (esc2){ esc2 = false; continue; }
    if (inS){ if (c === '\\') esc2 = true; else if (c === inS) inS = null; continue; }
    if (c === '"' || c === "'" || c === '`'){ inS = c; continue; }
    if (c === '[') depth++;
    else if (c === ']'){ depth--; if (depth === 0){ end = i; break; } }
  }
  if (end < 0) throw new Error('Fin de EPREUVES_DB introuvable');
  const arrText = src.slice(arrStart, end + 1);
  // Données-only → eval contrôlé (aucune fonction dans ces littéraux)
  // eslint-disable-next-line no-eval
  const arr = eval('(' + arrText + ')');
  if (!Array.isArray(arr)) throw new Error('EPREUVES_DB n\'est pas un tableau');
  return arr;
}

function pageHtml(e){
  const titre = e.titre || 'Épreuve';
  const matiere = e.matiere || '';
  const classe = e.classe || '';
  const seq = e.seq || '';
  const apercu = (e.apercu || e.desc || '').slice(0, 1400);
  const desc = (e.desc || (titre + ' — ' + matiere + ' ' + classe + '. Sujet corrigé conforme MINESEC, à consulter gratuitement sur VÉRITAS.')).slice(0, 300);
  const url = BASE + '/seo/' + e.id + '.html';
  const appUrl = BASE + '/?epreuve=' + encodeURIComponent(e.id);
  const kw = [titre, matiere, classe, seq, 'épreuve corrigée', 'sujet', 'MINESEC', 'Cameroun', 'BEPC', 'Probatoire', 'BAC', 'GCE'].filter(Boolean).join(', ');
  const ld = {
    "@context":"https://schema.org","@type":"LearningResource",
    "name":titre,"educationalLevel":classe,"about":matiere,
    "learningResourceType":"Exam/Quiz","inLanguage":"fr",
    "description":desc,"url":url,"isAccessibleForFree":true,
    "provider":{"@type":"Organization","name":"VÉRITAS Academy","url":BASE}
  };
  return `<!DOCTYPE html><html lang="fr"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titre)} — Corrigé ${esc(matiere)} ${esc(classe)} | VÉRITAS</title>
<meta name="description" content="${esc(desc)}">
<meta name="keywords" content="${esc(kw)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(titre)} — VÉRITAS">
<meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${esc(url)}">
<meta property="og:site_name" content="VÉRITAS Academy">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>body{font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:760px;margin:0 auto;padding:24px;color:#142554;line-height:1.7}
header{background:linear-gradient(135deg,#142554,#1E3A7A);color:#fff;padding:22px;border-radius:14px;margin-bottom:20px}
h1{font-size:22px;margin:0 0 6px}.tags span{display:inline-block;background:#EEF2FF;color:#1E3A8A;border-radius:99px;padding:3px 12px;font-size:12px;font-weight:700;margin:3px 4px 0 0}
.excerpt{background:#F8FAFF;border:1px solid #E0EAFF;border-left:4px solid #FFC93C;border-radius:10px;padding:16px;white-space:pre-wrap;font-size:14px}
.cta{display:block;text-align:center;background:#FFC93C;color:#142554;font-weight:800;text-decoration:none;padding:15px;border-radius:12px;margin:20px 0;font-size:15px}
footer{font-size:12px;color:#8895AA;text-align:center;border-top:1px solid #eee;padding-top:14px;margin-top:24px}</style>
</head><body>
<header><h1>${esc(titre)}</h1><div style="opacity:.85;font-size:14px">${esc(matiere)} · ${esc(classe)} · ${esc(seq)} — Sujet corrigé conforme MINESEC</div></header>
<div class="tags"><span>${esc(matiere)}</span><span>${esc(classe)}</span>${seq?`<span>${esc(seq)}</span>`:''}<span>✅ Gratuit</span></div>
<h2 style="font-size:16px;margin-top:20px">Aperçu du sujet</h2>
<div class="excerpt">${esc(apercu)}</div>
<a class="cta" href="${esc(appUrl)}">📖 Voir le corrigé complet et s'entraîner sur VÉRITAS →</a>
<p style="font-size:13px;color:#475882">Cette épreuve de <strong>${esc(matiere)}</strong> pour la classe de <strong>${esc(classe)}</strong> est proposée gratuitement par VÉRITAS Academy (Cameroun). Retrouvez des milliers d'épreuves corrigées, des cours, des quiz et un tuteur IA sur la plateforme.</p>
<footer>© VÉRITAS Academy · <a href="${esc(BASE)}">veritas-school.com</a> · Préparation BEPC · Probatoire · BAC · GCE</footer>
</body></html>`;
}

function main(){
  const all = extractEpreuves();
  const free = all.filter(e => e && e.gratuit && (e.apercu || e.desc) && e.id);
  if (!free.length){ console.error('Aucune épreuve gratuite avec aperçu trouvée.'); process.exit(1); }
  fs.mkdirSync(OUT, { recursive: true });
  const urls = [];
  free.forEach(e => {
    fs.writeFileSync(path.join(OUT, e.id + '.html'), pageHtml(e));
    urls.push(BASE + '/seo/' + e.id + '.html');
  });
  // index.html
  const list = free.map(e => `<li><a href="${e.id}.html">${esc(e.titre)} — ${esc(e.matiere)} ${esc(e.classe)}</a></li>`).join('\n');
  fs.writeFileSync(path.join(OUT, 'index.html'),
    `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Épreuves corrigées gratuites — VÉRITAS</title>
<meta name="description" content="Épreuves et sujets corrigés gratuits (BEPC, Probatoire, BAC, GCE) — programme MINESEC Cameroun.">
<link rel="canonical" href="${BASE}/seo/"></head><body style="font-family:system-ui,Arial;max-width:760px;margin:0 auto;padding:24px">
<h1>📝 Épreuves corrigées gratuites — VÉRITAS Academy</h1>
<p>Sujets MINESEC (Cameroun) à consulter gratuitement. <a href="${BASE}">Accéder à la plateforme →</a></p>
<ul style="line-height:2">${list}</ul></body></html>`);
  // sitemap.xml
  const now = new Date().toISOString().slice(0, 10);
  const sm = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${BASE}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
<url><loc>${BASE}/seo/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
${urls.map(u => `<url><loc>${u}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sm);
  console.log('✅ ' + free.length + ' pages SEO générées dans ' + OUT);
  console.log('   + index.html + sitemap.xml');
  console.log('   Déployez seo/ à la racine et ajoutez à robots.txt :  Sitemap: ' + BASE + '/seo/sitemap.xml');
}
try { main(); } catch (e) { console.error('✗ ' + e.message); process.exit(1); }
