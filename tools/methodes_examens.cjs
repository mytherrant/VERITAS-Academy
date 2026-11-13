/* Pages « Méthodes et examens » (ressources/*.html) — générateur.

   Le contenu de chaque page vit dans tools/methodes/<nom>.html :
     <!--meta {"page":"ressources/x.html","titre":"…","description":"…","badge":"…"} -->
     … corps HTML de l'article (h2 avec id, tableaux, encadrés) …
   Le générateur garde l'habillage du site (barre, pied, scripts) et remplace :
     le <title>, les méta description / Open Graph / canonical, le JSON-LD,
     le contenu de <article class="card">, la feuille <style id="vrt-methode">.
   Une page absente est créée à partir de ressources/methode-dictee.html (gabarit).

   Usage : node tools/methodes_examens.cjs            → écrit les pages
           node tools/methodes_examens.cjs --controle → échoue si une page diffère
   Chaque source doit citer ses sources (section id="sources") et ne rien affirmer
   d'un barème qui n'y soit pas : « à confirmer » plutôt que deviner. */
"use strict";
const fs = require("fs"), path = require("path");
const R = path.join(__dirname, ".."), SRC = path.join(__dirname, "methodes");
const GABARIT = "ressources/methode-dictee.html";
const CONTROLE = process.argv.includes("--controle");

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const CSS = fs.readFileSync(path.join(SRC, "_methode.css"), "utf8").trim();
// Script de la fiche : servi immutable un an, donc son jeton ?v= suit son contenu (LF).
const JS = fs.readFileSync(path.join(SRC, "_methode.js"), "utf8").replace(/\r/g, "");
const JS_V = require("crypto").createHash("sha1").update(JS).digest("hex").slice(0, 8);

let erreurs = 0; const err = m => { erreurs++; console.error("ERREUR : " + m); };

/* Une source peut produire une page PAR EXAMEN (« variantes » : bepc, probatoire, bac…) :
   l'élève de 3e ne voit que le BEPC. Dans le corps, <!--pour bepc probatoire-->…<!--/pour-->
   n'est gardé que pour ces variantes ; le reste est commun. Chaque variante surcharge la méta. */
function lireSources(f) {
  const t = fs.readFileSync(path.join(SRC, f), "utf8");
  const m = t.match(/^<!--meta\s*([\s\S]*?)-->\s*/);
  if (!m) { err(f + " : en-tête <!--meta …--> absent"); return []; }
  let meta; try { meta = JSON.parse(m[1]); } catch (e) { err(f + " : méta illisible " + e.message); return []; }
  const brut = t.slice(m[0].length).trim();
  const ouv = (brut.match(/<!--pour [a-z ]+-->/g) || []).length, fer = (brut.match(/<!--\/pour-->/g) || []).length;
  if (ouv !== fer) err(f + " : " + ouv + " <!--pour…--> pour " + fer + " <!--/pour-->");
  if (!meta.variantes) return [lireSource(f, meta, brut, null)].filter(Boolean);
  const { variantes, ...base } = meta;
  return Object.keys(variantes).map(v => {
    const corps = brut.replace(/<!--pour ([a-z ]+)-->([\s\S]*?)<!--\/pour-->/g, (_, qui, x) => qui.split(" ").includes(v) ? x : "");
    return lireSource(f + "#" + v, Object.assign({}, base, variantes[v]), corps, v);
  }).filter(Boolean);
}

// Annales corrigées (tools/annales.cjs → _liste.json) : liées depuis la fiche de leur matière.
const ANNALES = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, "annales/_liste.json"), "utf8")); } catch (e) { return []; } })();
function avecAnnales(meta, corps) {
  const xs = ANNALES.filter(a => a.fiche === meta.page); if (!xs.length) return corps;
  const parMat = {}; xs.forEach(a => { (parMat[a.matiere] = parMat[a.matiere] || []).push(a); });
  const h = '<h2 id="annales">Les annales corrigées</h2>\n<p>Les derniers sujets officiels, à traiter en temps limité, chacun avec son corrigé :</p>\n<ul>' +
    Object.keys(parMat).map(m => "<li><strong>" + esc(m) + "</strong> : " + parMat[m].map(a => '<a href="' + a.u + '">' + a.annee + "</a>").join(" · ") + "</li>").join("") +
    '</ul>\n<p><a href="/ressources/annales/">Toutes les annales corrigées</a></p>\n';
  return corps.includes('<h2 id="sources">') ? corps.replace('<h2 id="sources">', () => h + '<h2 id="sources">') : corps + h;
}

function lireSource(f, meta, corps) {
  corps = avecAnnales(meta, corps);
  ["page", "titre", "description", "badge"].forEach(k => { if (!meta[k]) err(f + " : champ " + k + " manquant"); });
  if (/<!--\/?pour/.test(corps)) err(f + " : marqueur <!--pour--> imbriqué ou mal fermé");
  if (!/id="sources"/.test(corps)) err(f + " : section des sources (id=\"sources\") manquante");
  const ids = []; corps.replace(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g, (_, id, ti) => { ids.push([id, ti.replace(/<[^>]+>/g, "")]); });
  if (ids.length < 3) err(f + " : moins de trois sections <h2 id>");
  const vus = {}; ids.forEach(([id]) => { if (vus[id]) err(f + " : id en double " + id); vus[id] = 1; });
  // Tableaux : nombre de cellules constant par ligne (un tableau bancal s'affiche faux au téléphone).
  corps.replace(/<table[\s\S]*?<\/table>/g, tb => {
    const lignes = tb.match(/<tr[\s\S]*?<\/tr>/g) || [];
    const n = l => (l.match(/<t[hd][\s>]/g) || []).length + (l.match(/colspan="(\d+)"/g) || []).reduce((a, c) => a + (+c.match(/\d+/)[0]) - 1, 0);
    const n0 = n(lignes[0] || "");
    lignes.forEach(l => { if (n(l) !== n0) err(f + " : tableau bancal (" + n(l) + " cellules au lieu de " + n0 + ") → " + l.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 80)); });
  });
  return { meta, corps, ids, src: f };
}

// Même dessin que les leçons d'Apprendre : sommaire latéral + barre de lecture, objectifs,
// parties numérotées (un <h2 id> ouvre une partie), encadrés illustrés.
function article(s) {
  const nav = '<nav class="mx-som" aria-label="Sommaire">' + s.ids.map(([id, ti]) => '<a href="#' + id + '">' + ti + "</a>").join("") + "</nav>";
  const som = '<aside class="mx-sommaire" aria-label="Sommaire"><p>Sommaire</p><ol class="mx-ol">' + s.ids.map(([id, ti], k) => '<li><a href="#' + id + '">' + (k + 1) + ". " + ti + "</a></li>").join("") +
    '</ol><div class="mx-lu"><span id="mxLu">Lecture : 0 %</span><div class="mx-barre"><i id="mxBar"></i></div></div></aside>';
  let n = 0;
  const corps = s.corps.split(/(?=<h2 id=")/).map(p => {
    const m = p.match(/^<h2 id="([^"]+)">([\s\S]*?)<\/h2>/); if (!m) return p;
    n++; return '<section class="partie" id="' + m[1] + '"><h2><span class="mx-num">' + n + '</span><span class="mx-txt">' + m[2] + "</span></h2>" + p.slice(m[0].length).trim() + "</section>\n";
  }).join("");
  const obj = (s.meta.objectifs || []).length ? '<div class="objectifs"><b>À la fin de cette fiche, tu sauras :</b><ul>' + s.meta.objectifs.map(o => "<li>" + esc(o) + "</li>").join("") + "</ul></div>\n" : "";
  return '<div class="mx-grille" id="mx" data-vh-ignore="1">' + som + '<article class="card mx">\n<span class="badge">' + esc(s.meta.badge) + "</span>\n<h1>" + esc(s.meta.titre) + "</h1>\n" +
    (s.meta.chapo ? '<p class="mx-chapo">' + s.meta.chapo + "</p>\n" : "") + nav + "\n" + obj + corps +
    '<a class="cta" href="/apprendre/">Réviser dans Apprendre<small>Leçons, quiz et corrigés rangés par classe et par série</small></a>\n</article></div>' +
    '<script src="/ressources/methode.js?v=' + JS_V + '" defer></script>';
}

function tete(html, s) {
  const url = "https://veritas-school.com/" + s.meta.page;
  const d = esc(s.meta.description), t = esc(s.meta.titre);
  const ld = JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: s.meta.titre, description: s.meta.description, inLanguage: "fr", url, publisher: { "@type": "Organization", name: "Centre VÉRITAS", url: "https://veritas-school.com" }, about: s.meta.about || "Méthode" });
  const rep = (re, v, nom) => { if (!re.test(html)) err(s.meta.page + " : balise introuvable " + nom); html = html.replace(re, v); };
  rep(/<title>[\s\S]*?<\/title>/, "<title>" + t + "</title>", "title");
  rep(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + d + '">', "description");
  rep(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + url + '">', "canonical");
  rep(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + t + '">', "og:title");
  rep(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + d + '">', "og:description");
  rep(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + url + '">', "og:url");
  rep(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '<script type="application/ld+json">' + ld + "</script>", "ld+json");
  if (s.meta.keywords) rep(/<meta name="keywords" content="[^"]*">/, '<meta name="keywords" content="' + esc(s.meta.keywords) + '">', "keywords");
  // Feuille propre aux méthodes : remplacée si elle existe, posée après la première feuille sinon.
  const bloc = '<style id="vrt-methode">' + CSS + "</style>";
  if (/<style id="vrt-methode">[\s\S]*?<\/style>/.test(html)) html = html.replace(/<style id="vrt-methode">[\s\S]*?<\/style>/, () => bloc);
  else html = html.replace(/<\/style>/, () => "</style>" + bloc);
  return html;
}

const sources = fs.readdirSync(SRC).filter(f => /^[a-z0-9-]+\.html$/.test(f)).sort();
const pages = {}; let ecrites = 0, identiques = 0;
for (const s of [].concat(...sources.map(lireSources))) {
  const f = s.src;
  if (pages[s.meta.page]) { err(f + " : page déjà produite par " + pages[s.meta.page]); continue; }
  pages[s.meta.page] = f;
  const cible = path.join(R, s.meta.page);
  const existe = fs.existsSync(cible);
  let html = fs.readFileSync(existe ? cible : path.join(R, GABARIT), "utf8");
  html = tete(html, s);
  const re = /<div class="mx-grille"[^>]*>[\s\S]*?<\/article><\/div>(?:<script src="\/ressources\/methode\.js\?v=[0-9a-f]+" defer><\/script>)?|<article class="card[^"]*">[\s\S]*?<\/article>/;
  if (!re.test(html)) { err(s.meta.page + " : <article class=\"card\"> introuvable"); continue; }
  html = html.replace(re, () => article(s));
  const avant = existe ? fs.readFileSync(cible, "utf8") : "";
  if (avant === html) { identiques++; continue; }
  if (CONTROLE) { err(s.meta.page + " : diffère de sa source " + f + " (relancer node tools/methodes_examens.cjs)"); continue; }
  fs.writeFileSync(cible, html); ecrites++;
}
// Pages de méthode orphelines (une source renommée ou découpée par examen) : retirées.
fs.readdirSync(path.join(R, "ressources")).filter(x => /\.html$/.test(x)).forEach(x => {
  const p = "ressources/" + x; if (pages[p]) return;
  if (!/<div class="mx-grille"/.test(fs.readFileSync(path.join(R, p), "utf8"))) return;
  if (CONTROLE) return err(p + " : page de méthode sans source");
  fs.unlinkSync(path.join(R, p)); console.log("retirée : " + p);
});
// Le script des fiches.
(function script() {
  const f = path.join(R, "ressources/methode.js");
  if (fs.existsSync(f) && fs.readFileSync(f, "utf8").replace(/\r/g, "") === JS) { identiques++; return; }
  if (CONTROLE) { err("ressources/methode.js : à régénérer"); return; }
  fs.writeFileSync(f, JS); ecrites++;
})();

// Index des ressources : les méthodes classées par classe et série (même classement qu'Apprendre).
(function index() {
  const f = path.join(R, "ressources/index.html");
  const CL = JSON.parse(fs.readFileSync(path.join(SRC, "_classement.json"), "utf8"));
  CL.forEach(e => { const p = e.u.replace(/^\//, "").replace(/#.*$/, ""); if (!fs.existsSync(path.join(R, p))) err("classement " + e.id + " : page absente " + p); });
  const MAT = { francais: "Français", maths: "Mathématiques", pct: "PCT", physique: "Physique-chimie", chimie: "Physique-chimie", svt: "SVTEEHB", sciences: "Sciences", histoire: "Histoire", geo: "Géographie", ecm: "ECM", philo: "Philosophie", anglais: "Anglais", info: "Informatique", espagnol: "Espagnol", allemand: "Allemand" };
  const GROUPES = [["6e, 5e, 4e", ["6e", "5e", "4e"], ""], ["3e", ["3e"], "BEPC"], ["2nde A et 2nde C", ["2nde A", "2nde C"], ""], ["1re A", ["1re A"], "Probatoire"], ["1re C et 1re D", ["1re C", "1re D"], "Probatoire"], ["Tle A", ["Tle A"], "Baccalauréat"], ["Tle C et Tle D", ["Tle C", "Tle D"], "Baccalauréat"]];
  const slug = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  let h = '<!--mx-index--><h1>Méthodes et examens, par classe et par matière</h1>\n<p>Pour chaque classe et chaque série : le format exact des épreuves (durée, coefficient, barème), la méthode pas à pas, un exemple traité et les critères des corrigés harmonisés de l\'Office du Baccalauréat. Chaque page cite ses sources.</p>\n';
  h += '<p class="rel">' + GROUPES.map(g => '<a href="#' + slug(g[0]) + '">' + g[0] + "</a>").join(" · ") + "</p>\n";
  GROUPES.forEach(([nom, classes, examen]) => {
    const parU = {}, ordre = [];
    CL.forEach(e => {
      const mats = []; e.l.forEach(([cs, m]) => { if (cs.split(",").some(c => classes.includes(c)) && mats.indexOf(MAT[m]) < 0) mats.push(MAT[m]); });
      if (!mats.length) return;
      const u = e.u.replace(/#.*$/, "") === e.u ? e.u : e.u; // une page = une tuile, ses matières réunies
      if (!parU[u]) { parU[u] = { e, mats: [] }; ordre.push(u); }
      mats.forEach(m => { if (parU[u].mats.indexOf(m) < 0) parU[u].mats.push(m); });
    });
    const tuiles = ordre.map(u => { const { e, mats } = parU[u]; return '<a class="tile" href="' + e.u + '"><strong>' + esc(mats.join(", ")) + " · " + esc(e.ti) + "</strong><span>" + esc(e.d) + "</span></a>"; });
    if (!tuiles.length) return;
    h += '<h2 id="' + slug(nom) + '">' + nom + (examen ? " · " + examen : "") + '</h2><div class="grid">' + tuiles.join("") + "</div>\n";
  });
  h += '<h2>Autres examens</h2><div class="grid">' + (ANNALES.length ? '<a class="tile" href="/ressources/annales/"><strong>Annales corrigées</strong><span>Les derniers sujets officiels et leurs corrigés</span></a>' : '') + '<a class="tile" href="/ressources/gce-francais-anglais.html"><strong>GCE O/A Level</strong><span>Le sous-système anglophone</span></a><a class="tile" href="/ressources/programme-francais-minesec.html"><strong>Programme de français</strong><span>De la 6e à la Terminale</span></a></div>\n<!--/mx-index-->';
  let html = fs.readFileSync(f, "utf8");
  if (/<!--mx-index-->[\s\S]*?<!--\/mx-index-->/.test(html)) html = html.replace(/<!--mx-index-->[\s\S]*?<!--\/mx-index-->/, () => h);
  else {
    const re = /(<div class="wrap">)<h1>[\s\S]*?(?=<h2>Leçons interactives<\/h2>)/;
    if (!re.test(html)) { err("ressources/index.html : bloc des méthodes introuvable"); return; }
    html = html.replace(re, (_, a) => a + h + "\n");
    html = html.replace(/<h2>Ressources<\/h2><div class="grid"><a class="tile" href="\/ressources\/programme-francais-minesec.html">[\s\S]*?<\/div>\n?/, "");
  }
  html = html.replace(/<title>[\s\S]*?<\/title>/, "<title>Méthodes et examens par classe et par matière | VÉRITAS</title>");
  const dIdx = "Méthodes d'examen du BEPC, du Probatoire et du BAC (Cameroun), par classe, série et matière : français, mathématiques, physique-chimie, SVTEEHB, histoire-géographie, ECM, philosophie, anglais, informatique, langues. Barèmes officiels et exemples traités.";
  html = html.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + esc(dIdx) + '">').replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + esc(dIdx) + '">');
  const avant = fs.readFileSync(f, "utf8");
  if (avant === html) { identiques++; return; }
  if (CONTROLE) { err("ressources/index.html : diffère du classement (relancer node tools/methodes_examens.cjs)"); return; }
  fs.writeFileSync(f, html); ecrites++;
})();

// Sitemap des ressources : toutes les pages du dossier, sans en oublier une nouvelle.
(function sitemap() {
  const f = path.join(R, "ressources/sitemap-ressources.xml");
  const pagesDossier = fs.readdirSync(path.join(R, "ressources")).filter(x => /\.html$/.test(x) && x !== "index.html").sort();
  const dA = path.join(R, "ressources/annales");
  const pagesAnnales = fs.existsSync(dA) ? [""].concat(fs.readdirSync(dA).filter(x => /\.html$/.test(x) && x !== "index.html").sort()) : [];
  const u = (loc, fr, pr) => "<url><loc>https://veritas-school.com/ressources/" + loc + "</loc><changefreq>" + fr + "</changefreq><priority>" + pr + "</priority></url>";
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + [u("", "weekly", "0.8")].concat(pagesDossier.map(x => u(x, "monthly", "0.7")), pagesAnnales.map(x => u("annales/" + x, "monthly", "0.7"))).join("\n") + "\n</urlset>\n";
  if (fs.existsSync(f) && fs.readFileSync(f, "utf8") === xml) { identiques++; return; }
  if (CONTROLE) { err("ressources/sitemap-ressources.xml : à régénérer"); return; }
  fs.writeFileSync(f, xml); ecrites++;
})();

if (erreurs) { console.error(erreurs + " erreur(s)."); process.exit(1); }
console.log("Méthodes d'examen : " + sources.length + " sources, " + ecrites + " page(s) écrite(s), " + identiques + " inchangée(s).");
