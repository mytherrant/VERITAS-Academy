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
.ap-sit{border:2px solid #F2DFA6;background:#FFFBEF;border-radius:14px;padding:6px 20px 14px;margin:20px 0}
.ap-sit h2{margin-top:14px}.ap-sit .ap-q{font-weight:600;color:var(--t)}
.ap-fig{margin:18px 0;padding:12px;border:1px solid var(--l);border-radius:12px;background:#fff}
.ap-fig figcaption{font-size:14px;margin-top:8px}.ap-fig .ap-tag{display:inline-block;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--b);margin-bottom:6px}
.ap-indice{border-left:4px solid var(--b);background:#F2F6FD;border-radius:0 10px 10px 0;padding:10px 16px;margin:16px 0}
.ap-indice ul{margin:6px 0 0;padding-left:20px}.ap-v-ok{color:#007E11;font-weight:600}.ap-v-ko{color:#A31238;font-weight:600}
.ap-resolue{border:2px solid #9FD3B3;background:#F2FBF5;border-radius:14px;padding:6px 20px 14px;margin:24px 0}
.def,.ex,.prop,.methode,.astuce,.attention,.savais,.retiens{border-radius:10px;padding:12px 16px;margin:14px 0;background:#F7F9FC}
.def b,.ex b,.prop b,.methode b,.astuce b,.attention b,.savais b,.retiens b{display:block;color:var(--t)}
.attention{background:#FDF0EE}.astuce,.savais{background:#FFF8E6}.prop,.retiens{background:#EEF8F1}
.formule{text-align:center;font-weight:600;color:var(--t)}
table.donnees,.tab-scroll table{border-collapse:collapse;margin:8px 0;display:block;overflow-x:auto}
table.donnees td,table.donnees th,.tab-scroll td,.tab-scroll th{border:1px solid var(--l);padding:4px 10px}
a{color:var(--b)}
</style>`;

/* Pages de cours : même habit que les leçons d'Apprendre (24/11/2026, « continue les autres leçons »).
   Les icônes sont LUES dans les feuilles des leçons (une seule source) : illustrations d'origine de
   modele.css (livre ouvert, médaille, deux engrenages, bloc-notes, ampoule…), puis les dernières
   valeurs de lecon-epure.css (fusée, loupe, clé, feuille de document, bulle « ? »). */
function icone(nom, ...fichiers) {
  let v = '';
  fichiers.forEach(f => {
    const t = lire(path.join(A, f)), re = new RegExp('--' + nom + ':(url\\("data:image/svg\\+xml,[^"]*"\\))', 'g');
    let m; while ((m = re.exec(t))) v = m[1];
  });
  if (!v) throw new Error('apprendre_statique : icône --' + nom + ' introuvable');
  return v;
}
const ICO = {
  def: icone('vm-ill-def', 'modele.css'), prop: icone('vm-ill-prop', 'modele.css'), methode: icone('vm-ill-methode', 'modele.css'),
  ex: icone('vm-ill-ex', 'modele.css'), astuce: icone('vm-ill-astuce', 'modele.css'), attention: icone('vm-ill-attention', 'modele.css'),
  savais: icone('vm-ill-savais', 'modele.css'), retiens: icone('vm-ill-retiens', 'modele.css'), cible: icone('vm-target', 'lecon-modele.css'),
  fusee: icone('ic-fusee', 'lecon-epure.css'), loupe: icone('ic-loupe', 'lecon-epure.css'), cle: icone('ic-cle', 'lecon-epure.css'),
  doc: icone('ic-doc', 'lecon-epure.css'), question: icone('ep-question', 'lecon-epure.css'), pin: icone('ep2-pin', 'lecon-epure.css'),
};
const STYLE_COURS = `<style>
.ap-cours{font-size:15.5px;line-height:1.5}
.ap-cours p,.ap-cours li{text-align:justify;hyphens:auto;-webkit-hyphens:auto}
.ap-cours h2{font-size:21px;line-height:1.3;color:#B2316E;margin:30px 0 10px}
/* bloc illustré : icône d'origine dans la marge + petit rail pointillé de sa couleur */
.ap-cours .ap-b,.ap-cours .def,.ap-cours .prop,.ap-cours .methode,.ap-cours .ex{position:relative;background:none;border:0;border-radius:0;padding:2px 0 4px 44px;margin:20px 0}
.ap-cours .ap-b::before,.ap-cours .def::before,.ap-cours .prop::before,.ap-cours .methode::before,.ap-cours .ex::before{content:"";position:absolute;left:0;top:0;width:32px;height:32px;background:var(--i) center/contain no-repeat}
.ap-cours .ap-b::after,.ap-cours .def::after,.ap-cours .prop::after,.ap-cours .methode::after,.ap-cours .ex::after{content:"";position:absolute;left:15px;top:40px;bottom:4px;width:3px;background:radial-gradient(circle,var(--rl) 1.1px,transparent 1.5px) 0 0/3px 7px repeat-y;-webkit-mask:linear-gradient(#000 60%,transparent);mask:linear-gradient(#000 60%,transparent);opacity:.7}
.ap-cours .ap-b>b:first-child,.ap-cours .def>b:first-child,.ap-cours .prop>b:first-child,.ap-cours .methode>b:first-child,.ap-cours .ex>b:first-child{display:block;font-size:17px;line-height:1.35;margin:4px 0 6px;color:var(--rl)}
.ap-cours .def{--i:${ICO.def};--rl:#1E499B}.ap-cours .prop{--i:${ICO.prop};--rl:#6A3DB8}.ap-cours .methode{--i:${ICO.methode};--rl:#0B7A84}.ap-cours .ex{--i:${ICO.ex};--rl:#C2540A}
.ap-cours .ap-commencer{--i:${ICO.fusee};--rl:#1E499B}.ap-cours .ap-commencer .ap-acc{font-style:italic;color:#0C1F55;margin:0 0 6px}
.ap-cours .ap-obj{--i:${ICO.cible};--rl:#B2316E}.ap-cours .ap-obj ul{margin:4px 0 0;padding-left:18px}
.ap-cours .ap-indice{--i:${ICO.cle};--rl:#B07A00;border-left:0;background:none;border-radius:0}
.ap-cours .ap-indice ul{padding-left:18px}
/* situation-problème : un chapitre de récit, sans cadre ; documents sans tableau ni cadre */
.ap-cours .ap-sit{border:0;background:none;border-radius:0;padding:0;margin:26px 0}
.ap-cours .ap-sit-t{position:relative;padding-left:44px;margin:0 0 12px}
.ap-cours .ap-sit-t::before{content:"";position:absolute;left:0;top:2px;width:32px;height:32px;background:${ICO.loupe} center/contain no-repeat}
.ap-cours .ap-sit-t small{display:block;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5B6B8C}
.ap-cours .ap-sit-t h2{margin:0;color:#1E499B;font-size:21px}
.ap-cours .ap-doc{margin:16px 0}.ap-cours .ap-doc>b{display:flex;align-items:center;gap:10px;color:#1E499B;margin:0 0 6px}
.ap-cours .ap-doc>b::before{content:"";flex:0 0 26px;height:26px;background:${ICO.doc} center/contain no-repeat}
.ap-cours .ap-doc:nth-of-type(2n)>b{color:#B2316E}
.ap-cours .ap-doc small{display:block;font-size:12.5px;font-style:italic;color:#8A90A2}
.ap-cours .ap-q{position:relative;padding-left:44px;font-style:italic;font-weight:500;color:#0C1F55;font-size:17px;line-height:1.45}
.ap-cours .ap-q::before{content:"";position:absolute;left:0;top:0;width:32px;height:32px;background:${ICO.question} center/contain no-repeat}
.ap-cours .ap-tache{position:relative;padding-left:44px;font-style:italic}
.ap-cours .ap-tache::before{content:"";position:absolute;left:0;top:0;width:30px;height:30px;background:${ICO.ex} center/contain no-repeat}
.ap-cours .ap-resolue{border:1px solid #CFE9D8;background:#F6FCF8;border-radius:16px}
/* notes collées : une couleur par type (jaune astuce, rose attention, menthe retiens, lavande savais, bleu à retenir) */
.ap-cours .astuce,.ap-cours .attention,.ap-cours .savais,.ap-cours .retiens,.ap-cours .ap-retenir{position:relative;max-width:640px;margin:40px auto 24px;padding:30px 18px 14px;border:1px solid #F0DC7A;border-radius:2px 2px 16px 2px;background:linear-gradient(#FFF7B8,#FFF1A0);box-shadow:0 10px 16px -10px rgba(80,60,0,.5);transform:rotate(-.8deg);font-weight:600;color:#3B3520}
.ap-cours .astuce>b:first-child,.ap-cours .attention>b:first-child,.ap-cours .savais>b:first-child,.ap-cours .retiens>b:first-child,.ap-cours .ap-retenir>b:first-child{display:table;margin:-46px auto 12px;padding:5px 14px 5px 40px;transform:rotate(2deg);background:var(--i) 10px 50%/22px no-repeat,rgba(255,255,255,.92);border:1px solid rgba(0,0,0,.07);box-shadow:0 2px 4px rgba(0,0,0,.06);font-size:16px;font-weight:700;color:var(--tc,#6B5300)}
.ap-cours .astuce{--i:${ICO.astuce}}
.ap-cours .attention{--i:${ICO.attention};--tc:#8D1D52;border-color:#EFA9C8;background:linear-gradient(#FFE2EF,#FFD3E6);color:#4A2235}
.ap-cours .retiens{--i:${ICO.retiens};--tc:#0B6A55;border-color:#A8DCCB;background:linear-gradient(#DFF5EF,#CDEEE5);color:#173B31}
.ap-cours .savais{--i:${ICO.savais};--tc:#5B3FA0;border-color:#CDBDF0;background:linear-gradient(#EFE7FC,#E4D8FA);color:#2E2350}
.ap-cours .ap-retenir{--i:${ICO.pin};--tc:#1E499B;border-color:#A9C6F0;background:linear-gradient(#E6F0FF,#D5E5FD);color:#10284F;transform:rotate(.8deg)}
.ap-cours .ap-retenir>b:first-child{transform:rotate(-2.5deg)}
@media (max-width:560px){.ap-cours .ap-b,.ap-cours .def,.ap-cours .prop,.ap-cours .methode,.ap-cours .ex,.ap-cours .ap-sit-t,.ap-cours .ap-q,.ap-cours .ap-tache{padding-left:38px}.ap-cours .ap-b::before,.ap-cours .def::before,.ap-cours .prop::before,.ap-cours .methode::before,.ap-cours .ex::before,.ap-cours .ap-sit-t::before,.ap-cours .ap-q::before{width:28px;height:28px}.ap-cours .ap-b::after,.ap-cours .def::after,.ap-cours .prop::after,.ap-cours .methode::after,.ap-cours .ex::after{left:13px;top:36px}}
@media (prefers-reduced-motion:reduce){.ap-cours [class]{transform:none}}
@media print{.ap-cours [class]{transform:none;box-shadow:none}}
</style>`;

function page({ url, titre, desc, h1, fil, corps, ld, style = '' }) {
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
${STYLE}${style}
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
  // « Pour commencer » : l'accroche (ancienne « situation de départ ») puis le fil rouge, comme dans lecon.html
  let corps = (L.intro || L.accroche) ? `<div class="ap-b ap-commencer"><b>Pour commencer</b>${L.accroche ? `<p class="ap-acc">${esc(net(L.accroche))}</p>` : ''}${L.intro ? `<p>${esc(net(L.intro))}</p>` : ''}</div>` : '';
  if ((L.objectifs || []).length) corps += `<div class="ap-b ap-obj"><b>À la fin de la leçon, tu sauras :</b><ul>${L.objectifs.map(o => `<li>${esc(net(o))}</li>`).join('')}</ul></div>`;
  const E = L.enquete;
  const fig = (svg, leg, tag) => svg ? `<figure class="ap-fig">${tag ? `<span class="ap-tag">${esc(tag)}</span>` : ''}${svg}${leg ? `<figcaption>${leg}</figcaption>` : ''}</figure>\n` : '';
  if (E) {
    corps += `<section class="ap-sit"><div class="ap-sit-t"><small>Situation-problème</small><h2>${esc(net(E.titre || ''))}</h2></div>${fig(E.svg, E.legende)}${E.contexte || ''}`;
    (E.documents || []).forEach((d, i) => { corps += `<div class="ap-doc"><b>Document ${i + 1} · ${esc(net(d.t || ''))}</b>${d.html || ''}${d.source ? `<small>${esc(d.source)}</small>` : ''}</div>`; });
    if (E.question) corps += `<p class="ap-q">${E.question}</p>`;
    if (E.tache) corps += `<p class="ap-tache"><b>Ta tâche</b> : ${E.tache}</p>`;
    if ((E.hypotheses || []).length) corps += `<p><b>Les hypothèses à trancher</b></p><ol>${E.hypotheses.map(h => `<li>${h}</li>`).join('')}</ol>`;
    corps += `</section>\n`;
  }
  (L.parties || []).forEach((p, ip) => {
    corps += `<h2>${esc(net(p.t))}</h2>\n${p.html || ''}\n`;
    if (p.illus && p.illus.svg) corps += fig(p.illus.svg, p.illus.legende);
    (p.planches || []).forEach(pl => {
      if (pl.svg) corps += fig(pl.svg, pl.legende, `Planche · ${pl.titre || '2D'}`);
      else if (pl.modele) corps += `<div class="ap-encart"><b>Planche 3D : ${esc(net(pl.titre || ''))}</b>${pl.legende || ''} <a href="/apprendre/lecon.html?id=${encodeURIComponent(id)}">La manipuler dans Apprendre</a>.</div>\n`;
    });
    if (p.anim || p.labo) corps += `<p><a href="/apprendre/lecon.html?id=${encodeURIComponent(id)}">${p.labo ? 'Laboratoire' : 'Simulation'} interactive${p.animT ? ' : ' + esc(p.animT) : ''} (dans Apprendre)</a></p>\n`;
    if (p.fil && p.fil.html) {
      const V = (p.fil.verdicts || []).map(v => `<li><span class="${v[1] === 'validee' ? 'ap-v-ok' : 'ap-v-ko'}">Hypothèse ${v[0] + 1} ${v[1] === 'validee' ? 'validée' : 'rejetée'}</span> : ${v[2] || ''}</li>`).join('');
      corps += `<div class="ap-b ap-indice"><b>Indice ${ip + 1}</b>${p.fil.html}${V ? `<ul>${V}</ul>` : ''}</div>\n`;
    }
    if (p.retenir) corps += `<div class="ap-retenir"><b>À retenir</b>${typeof p.retenir === 'string' ? p.retenir : esc(net(p.retenir))}</div>\n`;
  });
  const D = L.denouement;
  if (D) {
    corps += `<section class="ap-resolue"><h2>Situation résolue : ${esc(net(D.titre || ''))}</h2>`;
    if ((D.etapes || []).length) corps += `<ol>${D.etapes.map(e => `<li>${e}</li>`).join('')}</ol>`;
    corps += `${D.reponse || ''}${D.transfert ? `<p><b>À toi de transférer</b></p>${D.transfert}` : ''}</section>\n`;
  }
  if ((L.revision || []).length) corps += `<h2>Fiche de révision</h2><ul>${L.revision.map(r => `<li>${r}</li>`).join('')}</ul>`;
  if (L.exo) corps += `<h2>Exercice</h2>${L.exo}`;
  if ((L.quiz || []).length) corps += `<h2>Quiz</h2><ol class="ap-quiz">${L.quiz.map(q => `<li>${q.q}<br><span class="bonne">Réponse : ${(q.r || [])[q.b] || ''}</span>${q.e ? ' — ' + q.e : ''}</li>`).join('')}</ol>`;
  corps += `<p><a class="ap-cta" href="/apprendre/lecon.html?id=${encodeURIComponent(id)}">Faire cette leçon dans Apprendre (quiz, schémas animés)</a></p>`;
  corps += `<p><a href="/apprendre/programme/${csl(L.c)}/${m.id}.html">Tout le programme de ${esc(m.nom)} ${esc(NOM_CLASSE(L.c))}</a>${L.examen && L.examen.href ? ` · <a href="${esc(L.examen.href)}">${esc(L.examen.t)}</a>` : ''}</p>`;
  const filL = [...FIL0, [NOM_CLASSE(L.c), `/apprendre/programme/${csl(L.c)}/`], [m.nom, `/apprendre/programme/${csl(L.c)}/${m.id}.html`], [L.titre, null]];
  sorties.set(u, page({ url, titre, desc, h1: L.titre, fil: filL, corps: `<div class="ap-cours">${corps}</div>`, style: STYLE_COURS, ld: [
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
