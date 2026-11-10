/* Apprendre lisible par les moteurs et les IA — apprendre/programme/ et apprendre/cours/
 *
 * POURQUOI (10/11/2026, référencement)
 * « Apprendre » couvre tout le programme MINESEC 2026-2027 (12 classes, toutes
 * les matières, des milliers de leçons), mais ses pages sont dessinées par
 * JavaScript et portent « noindex » : un moteur ou une IA n'en voyait rien.
 * Jacques : « ajoute Apprendre dans le référencement : tous les cours dans
 * toutes les classes ».
 *
 * CE QUE PRODUIT LE SCRIPT (idempotent, sources : progressions.js et lecons.js)
 *   apprendre/programme/index.html                 les 12 classes
 *   apprendre/programme/<classe>/index.html        les matières d'une classe
 *   apprendre/programme/<classe>/<matiere>.html    chapitres et leçons officiels
 *   apprendre/cours/<id>.html                      chaque leçon GRATUITE rédigée
 *   apprendre/sitemap-apprendre.xml
 * Seules les leçons de lecons.js (gratuites, déjà publiques) sont publiées en
 * texte. La suite payante reste sur le serveur (api/apprendre.php) : ce script
 * n'y touche pas. Les pages renvoient vers l'application pour travailler.
 * habiller_pages.py ajoute ensuite l'en-tête et le pied du site ; le contrôle
 * compare donc les pages SANS ces blocs.
 *
 *    node tools/apprendre_statique.js            # écrit
 *    node tools/apprendre_statique.js --controle # code 1 si un fichier changerait
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.join(__dirname, '..');
const A = path.join(RACINE, 'apprendre');
const BASE = 'https://veritas-school.com/';
const CONTROLE = process.argv.includes('--controle');
const IMAGE = BASE + 'og-image.jpg';

const lire = f => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const net = s => String(s == null ? '' : s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const jsonLd = o => JSON.stringify(o).replace(/</g, '\\u003c');
const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
const slug = s => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ── Données ──────────────────────────────────────────────────────────────
const ctx = { window: {} };
vm.runInNewContext(lire(path.join(A, 'progressions.js')), ctx);
vm.runInNewContext(lire(path.join(A, 'lecons.js')), ctx);
const PROG = ctx.window.VRT_PROG, LECONS = ctx.window.VRT_LECONS;
const com = lire(path.join(A, 'commun.js'));
const mm = com.match(/var MATIERES = (\[[\s\S]*?\n\s*\])\.map/);
if (!mm) throw new Error('apprendre_statique : MATIERES introuvable dans commun.js');
const MATIERES = vm.runInNewContext(mm[1]).map(a => ({ id: a[0], nom: a[1], minesec: a[4] }));
const cm = com.match(/var CLASSES = (\[[^\]]*\])/);
const CLASSES = vm.runInNewContext(cm[1]);

const NOM_CLASSE = c => c.replace(/^(\d)e$/, '$1ᵉ').replace(/^1re/, '1ʳᵉ').replace(/^Tle/, 'Terminale').replace(/^2nde/, 'Seconde');
const LONG_CLASSE = c => ({ '6e': 'Sixième', '5e': 'Cinquième', '4e': 'Quatrième', '3e': 'Troisième' }[c]
  || c.replace(/^2nde/, 'Seconde').replace(/^1re/, 'Première').replace(/^Tle/, 'Terminale'));
const EXAMEN = c => /^3e$/.test(c) ? 'BEPC' : /^1re/.test(c) ? 'Probatoire' : /^Tle/.test(c) ? 'Baccalauréat' : '';

// Rattachement leçon rédigée → rang de la progression (même règle que commun.js).
const REDIGEES = {}; // classe|matiere|rang -> id
Object.keys(LECONS).forEach(id => {
  const L = LECONS[id], m = MATIERES.find(x => x.id === L.m);
  if (!m || !(L.cle || L.rang)) return;
  const p = PROG[L.c] || {};
  let trouve = false;
  m.minesec.forEach(s => (p[s] || []).forEach(ch => ch[1].forEach(l => {
    if (!trouve && (L.rang ? l[0] === L.rang : norm(l[1]).indexOf(norm(L.cle)) >= 0)) {
      trouve = true; REDIGEES[L.c + '|' + L.m + '|' + l[0]] = id; L._chap = ch[0];
    }
  })));
});

// Programme par classe et matière de l'application (une matière peut réunir plusieurs intitulés).
function programme(c, m) {
  const p = PROG[c] || {}, chaps = [];
  m.minesec.forEach(s => (p[s] || []).forEach(ch => chaps.push({ titre: ch[0], tri: ch[2] || '', lecons: ch[1], sous: m.minesec.length > 1 ? s : '' })));
  return chaps;
}

// ── Gabarit ──────────────────────────────────────────────────────────────
const STYLE = `<style>
:root{--t:#001136;--c:#4D5163;--b:#1E499B;--or:#FFC93C;--l:#E6EAF2}
*{box-sizing:border-box}
body{margin:0;background:#fff;color:var(--c);font:400 16px/1.7 Poppins,system-ui,sans-serif}
.ap-wrap{max-width:900px;margin:0 auto;padding:28px 18px 48px}
.ap-fil{font-size:13px;margin:0 0 14px}.ap-fil a{color:var(--b);text-decoration:none}
h1{color:var(--t);font-weight:600;font-size:28px;line-height:1.25;margin:0 0 10px;text-wrap:balance}
h2{color:var(--t);font-weight:600;font-size:20px;margin:28px 0 8px}
h3{color:var(--t);font-weight:600;font-size:17px;margin:20px 0 6px}
.ap-chapo{font-size:17px;margin:0 0 18px}
.ap-grille{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr));gap:12px;padding:0;list-style:none}
.ap-grille a{display:block;padding:14px 16px;border:1px solid var(--l);border-radius:10px;color:var(--t);text-decoration:none;font-weight:500}
.ap-grille a small{display:block;color:var(--c);font-weight:400;font-size:13px}
.ap-chap{border:1px solid var(--l);border-radius:10px;padding:6px 18px 12px;margin:14px 0}
.ap-chap ol{margin:6px 0 0;padding-left:22px}.ap-chap li{margin:3px 0}
.ap-tri{display:inline-block;font-size:12px;color:var(--b);background:#EEF3FD;border-radius:100px;padding:2px 10px;margin-left:6px;vertical-align:middle}
.ap-ok{font-size:12px;color:#007E11;margin-left:6px}
.ap-cta{display:inline-block;background:var(--or);color:var(--t);font-weight:600;text-decoration:none;padding:12px 20px;border-radius:10px;margin:8px 8px 0 0}
.ap-encart{background:#F7F9FC;border-radius:10px;padding:14px 18px;margin:16px 0}
.ap-quiz li{margin:10px 0}.ap-quiz .bonne{color:#007E11;font-weight:600}
.ap-wrap img,.ap-wrap svg{max-width:100%;height:auto}
a{color:var(--b)}
</style>`;

function page({ url, titre, desc, h1, fil, corps, ld }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titre)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(titre)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${IMAGE}">
<meta property="og:site_name" content="Centre VÉRITAS">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/VERITAS_favicon_512.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap">
${STYLE}
<link rel="stylesheet" href="/assets/veritas-refonte.css?v=1.19.25">
${ld.map(o => '<script type="application/ld+json">' + jsonLd(o) + '</script>').join('\n')}
</head>
<body>
<main class="ap-wrap">
<p class="ap-fil">${fil.map(([n, u]) => u ? `<a href="${u}">${esc(n)}</a>` : esc(n)).join(' › ')}</p>
<h1>${esc(h1)}</h1>
${corps}
</main>
</body>
</html>
`;
}
const fil = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: u ? BASE + u.replace(/^\//, '') : undefined })) });
const ORG = { '@type': 'EducationalOrganization', name: 'Centre VÉRITAS', url: BASE };

// ── Construction ─────────────────────────────────────────────────────────
const sorties = new Map(); // chemin relatif -> contenu
const sm = [];
const FIL0 = [['Accueil', '/'], ['Apprendre', '/apprendre/programme/']];
const csl = c => slug(c);

const resume = [];
CLASSES.forEach(c => {
  const mats = MATIERES.map(m => ({ m, chaps: programme(c, m) })).filter(x => x.chaps.length);
  if (!mats.length) return;
  let totC = 0;
  mats.forEach(({ m, chaps }) => {
    const nb = chaps.reduce((s, ch) => s + ch.lecons.length, 0); totC += nb;
    const u = `apprendre/programme/${csl(c)}/${m.id}.html`, url = BASE + u;
    const ex = EXAMEN(c), nbRed = chaps.reduce((s, ch) => s + ch.lecons.filter(l => REDIGEES[c + '|' + m.id + '|' + l[0]]).length, 0);
    const titre = `${m.nom} ${NOM_CLASSE(c)} : programme officiel et cours | VÉRITAS`;
    const desc = `Programme de ${m.nom} en ${LONG_CLASSE(c)} (MINESEC 2026-2027) : ${chaps.length} chapitre${chaps.length > 1 ? 's' : ''}, ${nb} leçon${nb > 1 ? 's' : ''} dans l'ordre de la progression harmonisée${ex ? ', préparation au ' + ex : ''}. Cours, quiz et schémas animés sur VÉRITAS.`;
    let corps = `<p class="ap-chapo">${esc(m.nom)} en ${esc(LONG_CLASSE(c))}, selon la progression harmonisée du MINESEC 2026-2027 (sous-système francophone, enseignement général) : ${chaps.length} chapitre${chaps.length > 1 ? 's' : ''} et ${nb} leçon${nb > 1 ? 's' : ''}${ex ? ', jusqu’au ' + ex : ''}.${nbRed ? ` ${nbRed} leçon${nbRed > 1 ? 's' : ''} rédigée${nbRed > 1 ? 's' : ''} en accès libre ci-dessous.` : ''}</p>
<p><a class="ap-cta" href="/apprendre/matiere.html?c=${encodeURIComponent(c)}&amp;m=${m.id}">Ouvrir ${esc(m.nom)} ${esc(NOM_CLASSE(c))} dans Apprendre</a></p>
<h2>Le programme, chapitre par chapitre</h2>\n`;
    chaps.forEach(ch => {
      corps += `<section class="ap-chap"><h3>${esc(ch.titre)}${ch.tri ? `<span class="ap-tri">${esc(ch.tri)}</span>` : ''}</h3>${ch.sous ? `<p><small>${esc(ch.sous)}</small></p>` : ''}<ol>`;
      ch.lecons.forEach(l => {
        const id = REDIGEES[c + '|' + m.id + '|' + l[0]];
        corps += id ? `<li value="${l[0]}"><a href="/apprendre/cours/${id}.html">${esc(net(l[1]))}</a><span class="ap-ok">cours en libre accès</span></li>` : `<li value="${l[0]}">${esc(net(l[1]))}</li>`;
      });
      corps += `</ol></section>\n`;
    });
    corps += `<div class="ap-encart"><p>Dans Apprendre, chaque leçon de ${esc(m.nom)} ${esc(NOM_CLASSE(c))} se travaille avec un cours illustré, une fiche de révision, un quiz et, selon la matière, un schéma animé ou un laboratoire.</p><p><a href="/apprendre/programme/${csl(c)}/">Toutes les matières de ${esc(LONG_CLASSE(c))}</a></p></div>`;
    const filM = [...FIL0, [NOM_CLASSE(c), `/apprendre/programme/${csl(c)}/`], [m.nom, null]];
    sorties.set(u, page({ url, titre, desc, h1: `${m.nom} — ${LONG_CLASSE(c)} : le programme officiel`, fil: filM, corps, ld: [
      { '@context': 'https://schema.org', '@type': 'Course', name: `${m.nom} — ${LONG_CLASSE(c)}`, description: desc, url, inLanguage: 'fr',
        educationalLevel: LONG_CLASSE(c), provider: ORG, isAccessibleForFree: true,
        hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: `${nb} leçons` },
        syllabusSections: chaps.map(ch => ({ '@type': 'Syllabus', name: net(ch.titre), description: ch.lecons.map(l => net(l[1])).join(' ; ').slice(0, 500) })) },
      fil(filM.slice(0, -1).concat([[m.nom, '/' + u]])) ] }));
    sm.push([u, 'monthly', '0.6']);
  });
  // Page de classe
  const u = `apprendre/programme/${csl(c)}/`, url = BASE + u;
  const titre = `Programme de ${LONG_CLASSE(c)} : toutes les matières | VÉRITAS`;
  const desc = `Toutes les matières de ${LONG_CLASSE(c)} selon la progression MINESEC 2026-2027 : ${mats.length} matières, ${totC} leçons, chapitre par chapitre${EXAMEN(c) ? ', préparation au ' + EXAMEN(c) : ''}.`;
  const corps = `<p class="ap-chapo">${esc(desc)}</p><ul class="ap-grille">${mats.map(({ m, chaps }) => {
    const nb = chaps.reduce((s, ch) => s + ch.lecons.length, 0);
    return `<li><a href="/apprendre/programme/${csl(c)}/${m.id}.html">${esc(m.nom)}<small>${chaps.length} chapitre${chaps.length > 1 ? 's' : ''} · ${nb} leçon${nb > 1 ? 's' : ''}</small></a></li>`;
  }).join('')}</ul><p><a class="ap-cta" href="/apprendre/">Ouvrir Apprendre</a></p>`;
  const filC = [...FIL0, [NOM_CLASSE(c), null]];
  sorties.set(u + 'index.html', page({ url, titre, desc, h1: `${LONG_CLASSE(c)} : le programme de toutes les matières`, fil: filC, corps, ld: [
    { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `Programme de ${LONG_CLASSE(c)}`, url, description: desc, inLanguage: 'fr', provider: ORG,
      mainEntity: { '@type': 'ItemList', numberOfItems: mats.length, itemListElement: mats.map(({ m }, i) => ({ '@type': 'ListItem', position: i + 1, url: `${BASE}apprendre/programme/${csl(c)}/${m.id}.html`, name: m.nom })) } },
    fil(filC.slice(0, -1).concat([[NOM_CLASSE(c), '/' + u]])) ] }));
  sm.push([u, 'weekly', '0.7']);
  resume.push({ c, mats: mats.length, nb: totC });
});

// Leçons gratuites rédigées
const coursListe = [];
Object.keys(LECONS).forEach(id => {
  const L = LECONS[id], m = MATIERES.find(x => x.id === L.m);
  if (!m) return;
  const u = `apprendre/cours/${id}.html`, url = BASE + u;
  const titre = `${L.titre} — ${m.nom} ${NOM_CLASSE(L.c)} : cours | VÉRITAS`;
  const desc = net(L.accroche || L.intro).slice(0, 155);
  let corps = `<p class="ap-chapo">${esc(net(L.intro))}</p>`;
  if ((L.objectifs || []).length) corps += `<div class="ap-encart"><b>Objectifs</b><ul>${L.objectifs.map(o => `<li>${esc(net(o))}</li>`).join('')}</ul></div>`;
  (L.parties || []).forEach(p => {
    corps += `<h2>${esc(net(p.t))}</h2>\n${p.html || ''}\n`;
    if (p.retenir) corps += `<div class="ap-encart"><b>À retenir</b> : ${typeof p.retenir === 'string' ? p.retenir : esc(net(p.retenir))}</div>\n`;
  });
  if ((L.revision || []).length) corps += `<h2>Fiche de révision</h2><ul>${L.revision.map(r => `<li>${r}</li>`).join('')}</ul>`;
  if (L.exo) corps += `<h2>Exercice</h2>${L.exo}`;
  if ((L.quiz || []).length) corps += `<h2>Quiz</h2><ol class="ap-quiz">${L.quiz.map(q => `<li>${q.q}<br><span class="bonne">Réponse : ${(q.r || [])[q.b] || ''}</span>${q.e ? ' — ' + q.e : ''}</li>`).join('')}</ol>`;
  corps += `<p><a class="ap-cta" href="/apprendre/lecon.html?id=${encodeURIComponent(id)}">Faire cette leçon dans Apprendre (quiz, schémas animés)</a></p>`;
  corps += `<p><a href="/apprendre/programme/${csl(L.c)}/${m.id}.html">Tout le programme de ${esc(m.nom)} ${esc(NOM_CLASSE(L.c))}</a>${L.examen && L.examen.href ? ` · <a href="${esc(L.examen.href)}">${esc(L.examen.t)}</a>` : ''}</p>`;
  const filL = [...FIL0, [NOM_CLASSE(L.c), `/apprendre/programme/${csl(L.c)}/`], [m.nom, `/apprendre/programme/${csl(L.c)}/${m.id}.html`], [L.titre, null]];
  sorties.set(u, page({ url, titre, desc, h1: L.titre, fil: filL, corps, ld: [
    { '@context': 'https://schema.org', '@type': 'LearningResource', name: L.titre, description: desc, url, inLanguage: 'fr',
      learningResourceType: 'Cours', educationalLevel: LONG_CLASSE(L.c), about: m.nom, teaches: (L.objectifs || []).map(net).join(' ; '),
      timeRequired: L.duree ? `PT${L.duree}M` : undefined, isAccessibleForFree: true, provider: ORG,
      isPartOf: { '@type': 'Course', name: `${m.nom} — ${LONG_CLASSE(L.c)}`, url: `${BASE}apprendre/programme/${csl(L.c)}/${m.id}.html` } },
    fil(filL.slice(0, -1).concat([[L.titre, '/' + u]])) ] }));
  sm.push([u, 'monthly', '0.6']);
  coursListe.push({ id, L, m });
});

// Accueil du programme
{
  const u = 'apprendre/programme/', url = BASE + u;
  const tot = resume.reduce((s, r) => s + r.nb, 0);
  const desc = `Tout le programme du secondaire camerounais de la 6ᵉ à la Terminale (progression harmonisée MINESEC 2026-2027) : 12 classes, ${tot} leçons, toutes les matières, chapitre par chapitre, avec cours, quiz et schémas animés.`;
  let corps = `<p class="ap-chapo">${esc(desc)}</p><h2>Choisir sa classe</h2><ul class="ap-grille">${resume.map(r =>
    `<li><a href="/apprendre/programme/${csl(r.c)}/">${esc(LONG_CLASSE(r.c))}<small>${r.mats} matières · ${r.nb} leçons</small></a></li>`).join('')}</ul>`;
  corps += `<h2>Cours en libre accès</h2><ul>${coursListe.map(({ id, L, m }) => `<li><a href="/apprendre/cours/${id}.html">${esc(L.titre)}</a> — ${esc(m.nom)}, ${esc(NOM_CLASSE(L.c))}</li>`).join('')}</ul>`;
  corps += `<p><a class="ap-cta" href="/apprendre/">Ouvrir Apprendre</a></p>`;
  sorties.set(u + 'index.html', page({ url, titre: 'Apprendre : le programme de la 6ᵉ à la Terminale, toutes matières | VÉRITAS', desc,
    h1: 'Apprendre : tout le programme, de la 6ᵉ à la Terminale', fil: [['Accueil', '/'], ['Apprendre', null]], corps, ld: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Apprendre — programme du secondaire camerounais', url, description: desc, inLanguage: 'fr', provider: ORG,
        mainEntity: { '@type': 'ItemList', numberOfItems: resume.length, itemListElement: resume.map((r, i) => ({ '@type': 'ListItem', position: i + 1, url: `${BASE}apprendre/programme/${csl(r.c)}/`, name: LONG_CLASSE(r.c) })) } }] }));
  sm.unshift([u, 'weekly', '0.8']);
}

sorties.set('apprendre/sitemap-apprendre.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + sm.map(([u, f, p]) => `<url><loc>${BASE}${u}</loc><changefreq>${f}</changefreq><priority>${p}</priority></url>`).join('\n') + '\n</urlset>\n');

// ── Écriture / contrôle ──────────────────────────────────────────────────
const sansHabillage = s => s.replace(/\r\n/g, '\n').replace(/<!--vrt-habillage:([a-z]+)-->[\s\S]*?<!--\/vrt-habillage:\1-->\n/g, '');
const differents = [];
for (const [rel, neuf] of sorties) {
  const abs = path.join(RACINE, rel);
  const ancien = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
  if (ancien !== null && sansHabillage(ancien) === neuf) continue;
  differents.push(rel);
  if (!CONTROLE) { fs.mkdirSync(path.dirname(abs), { recursive: true }); fs.writeFileSync(abs, neuf); }
}
// Pages orphelines (classe ou matière disparue de la progression)
const attendus = new Set([...sorties.keys()].map(r => path.join(RACINE, r)));
const orphelins = [];
for (const d of ['programme', 'cours']) {
  const racine = path.join(A, d);
  if (!fs.existsSync(racine)) continue;
  (function parcourir(x) { for (const f of fs.readdirSync(x)) { const p = path.join(x, f); if (fs.statSync(p).isDirectory()) parcourir(p); else if (!attendus.has(p)) orphelins.push(path.relative(RACINE, p)); } })(racine);
}
if (!CONTROLE) orphelins.forEach(o => fs.unlinkSync(path.join(RACINE, o)));
const nbPages = sorties.size - 1;
if (CONTROLE) {
  if (differents.length || orphelins.length) {
    console.log(`apprendre_statique : ${differents.length} page(s) périmée(s), ${orphelins.length} orpheline(s) — lancer node tools/apprendre_statique.js puis python tools/habiller_pages.py`);
    differents.concat(orphelins).slice(0, 5).forEach(x => console.log('  ', x));
    process.exit(1);
  }
  console.log(`apprendre_statique : ${nbPages} pages à jour`);
} else {
  console.log(`apprendre_statique : ${nbPages} pages (${differents.length} écrites, ${orphelins.length} orphelines retirées), ${coursListe.length} cours libres, ${resume.reduce((s, r) => s + r.nb, 0)} leçons au programme`);
}
