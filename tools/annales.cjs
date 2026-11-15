/* Annales corrigées (ressources/annales/*.html) — générateur.

   Une épreuve = une source tools/annales/<examen>/<matiere>-<annee>.html :
     <!--meta {"examen":"bepc","matiere":"mathematiques","annee":2024,
               "sujet_source":"https://…","corrige":"veritas"|"national","corrige_source":"https://…"} -->
     <!--sujet-->   … énoncé officiel, transcrit tel quel …   <!--/sujet-->
     <!--corrige--> … corrigé …                                <!--/corrige-->
   « national » = corrigé harmonisé national reproduit ; « veritas » = proposition de corrigé
   rédigée par VÉRITAS, toujours annoncée comme telle sur la page.

   Produit : ressources/annales/<examen>-<matiere>-<annee>.html, ressources/annales/index.html,
   et tools/annales/_liste.json (lu par methodes_examens.cjs pour lier les annales depuis
   chaque fiche d'examen). Les images vivent dans ressources/annales/img/.

   Usage : node tools/annales.cjs            → écrit les pages
           node tools/annales.cjs --controle → échoue si une page diffère de sa source */
"use strict";
const fs = require("fs"), path = require("path");
const R = path.join(__dirname, ".."), SRC = path.join(__dirname, "annales"), OUT = path.join(R, "ressources/annales");
const GABARIT = "ressources/methode-dictee.html";
const CONTROLE = process.argv.includes("--controle");
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
let erreurs = 0; const err = m => { erreurs++; console.error("ERREUR : " + m); };

// classes : classes d'Apprendre où l'annale est rangée quand la source ne précise pas sa série.
const EXAMENS = { bepc: { nom: "BEPC", classe: "3e", classes: "3e", org: "MINESEC / DECC" }, probatoire: { nom: "Probatoire", classe: "1re", classes: "1re A,1re C,1re D", org: "OBC" }, bac: { nom: "Baccalauréat", classe: "Tle", classes: "Tle A,Tle C,Tle D", org: "OBC" } };
// Matières : libellé, fiche de méthode liée (par examen), matière d'Apprendre (apprendre/commun.js). L'ordre est celui de l'affichage.
const P = "ressources/";
const MATIERES = {
  "etude-de-texte": ["Étude de texte", { bepc: P + "bepc-francais.html" }, "francais"],
  "correction-orthographique": ["Correction orthographique", { bepc: P + "bepc-francais.html" }, "francais"],
  "expression-ecrite": ["Expression écrite", { bepc: P + "bepc-francais.html" }, "francais"],
  "litterature": ["Littérature", { probatoire: P + "probatoire-francais.html", bac: P + "bac-francais.html" }, "francais"],
  "langue-francaise": ["Langue française", { probatoire: P + "probatoire-francais.html", bac: P + "bac-francais.html" }, "francais"],
  "mathematiques": ["Mathématiques", { bepc: P + "examen-mathematiques-bepc.html", probatoire: P + "examen-mathematiques-probatoire.html", bac: P + "examen-mathematiques-bac.html" }, "maths"],
  "pct": ["Physique, chimie et technologie", { bepc: P + "examen-pct-bepc.html" }, "pct"],
  "physique": ["Physique", { probatoire: P + "examen-physique-chimie-probatoire.html", bac: P + "examen-physique-chimie-bac.html" }, "physique"],
  "chimie": ["Chimie", { probatoire: P + "examen-physique-chimie-probatoire.html", bac: P + "examen-physique-chimie-bac.html" }, "chimie"],
  "svt": ["SVTEEHB", { bepc: P + "examen-svt-bepc.html", probatoire: P + "examen-svt-probatoire.html", bac: P + "examen-svt-bac.html" }, "svt"],
  "histoire": ["Histoire", { bepc: P + "examen-histoire-geographie-bepc.html", probatoire: P + "examen-histoire-geographie-probatoire.html", bac: P + "examen-histoire-geographie-bac.html" }, "histoire"],
  "geographie": ["Géographie", { bepc: P + "examen-histoire-geographie-bepc.html", probatoire: P + "examen-histoire-geographie-probatoire.html", bac: P + "examen-histoire-geographie-bac.html" }, "geo"],
  "ecm": ["Éducation à la citoyenneté et à la morale", { bepc: P + "examen-ecm-bepc.html", probatoire: P + "examen-ecm-probatoire.html", bac: P + "examen-ecm-bac.html" }, "ecm"],
  "philosophie": ["Philosophie", { probatoire: P + "examen-philosophie-probatoire.html", bac: P + "examen-philosophie-bac.html" }, "philo"],
  "anglais": ["Anglais", { bepc: P + "examen-anglais-bepc.html", probatoire: P + "examen-anglais-probatoire.html", bac: P + "examen-anglais-bac.html" }, "anglais"],
  "espagnol": ["Espagnol", { bepc: P + "examen-langues-vivantes-bepc.html", probatoire: P + "examen-langues-vivantes-probatoire.html", bac: P + "examen-langues-vivantes-bac.html" }, "espagnol"],
  "allemand": ["Allemand", { bepc: P + "examen-langues-vivantes-bepc.html", probatoire: P + "examen-langues-vivantes-probatoire.html", bac: P + "examen-langues-vivantes-bac.html" }, "allemand"],
  "informatique": ["Informatique", { bepc: P + "examen-informatique-bepc.html", probatoire: P + "examen-informatique-probatoire.html", bac: P + "examen-informatique-bac.html" }, "info"],
};
// Série (Probatoire, BAC) : « serie » dans la méta, en minuscules (a, c, d, cd, ce, dti…) ; « classes » précise où ranger l'annale.
const nomSerie = s => { const t = s.toUpperCase().match(/TI|ABI|[A-Z]/g) || []; return (t.length > 1 ? "séries " + t.slice(0, -1).join(", ") + " et " + t[t.length - 1] : "série " + t[0]); };
const ORDRE = Object.keys(MATIERES);
const CSS = fs.readFileSync(path.join(R, "tools/methodes/_methode.css"), "utf8").trim() + "\n" + fs.readFileSync(path.join(SRC, "_annales.css"), "utf8").trim();
const AX_JS = fs.readFileSync(path.join(SRC, "_annales.js"), "utf8").replace(/\r/g, "");
const AX_V = require("crypto").createHash("sha1").update(AX_JS).digest("hex").slice(0, 8);
// « 2 h », « 1 h 30 min », « 3 h 30 » → minutes (chronomètre du mode « composer en direct »).
const minutes = d => { const m = /(\d+)\s*h(?:\s*(\d+))?|(\d+)\s*min/.exec(String(d || "")); return m ? (m[1] ? +m[1] * 60 + (+m[2] || 0) : +m[3]) : 120; };
const JS_V = require("crypto").createHash("sha1").update(fs.readFileSync(path.join(R, "tools/methodes/_methode.js"), "utf8").replace(/\r/g, "")).digest("hex").slice(0, 8);

// Formules : \( … \) en LaTeX simple (fractions, racines, angles, vecteurs, colonnes) → HTML.
function grp(s, i) { // lit {…} équilibré à partir de s[i]=='{' → [contenu, fin]
  let d = 0, j = i;
  for (; j < s.length; j++) { if (s[j] === '{') d++; else if (s[j] === '}') { d--; if (!d) break; } }
  return [s.slice(i + 1, j), j + 1];
}
function arg(s, i) { while (s[i] === ' ') i++; if (s[i] === '{') return grp(s, i); return [s[i] || '', i + 1]; }
function tex(s) {
  const SYM = { prec: '<', succ: '>', le: '≤', leq: '≤', ge: '≥', geq: '≥', times: '×', pi: 'π', in: '∈', notin: '∉', infty: '∞', cdot: '·', approx: '≈', ne: '≠', neq: '≠', Rightarrow: '⇒', Leftrightarrow: '⇔', rightarrow: '→', to: '→', alpha: 'α', det: 'det ', Gamma: 'Γ', gamma: 'γ', Sigma: 'Σ', Pi: 'Π', phi: 'φ', varphi: 'φ', epsilon: 'ε', varepsilon: 'ε', tau: 'τ', Lambda: 'Λ', Theta: 'Θ', Rightarrow: '⇒', Longrightarrow: '⟹', mapsto: '↦', geqslant: '≥', leqslant: '≤', infty: '∞', prime: '′', ln: 'ln ', exp: 'exp', lim: 'lim', log: 'log ', 'times': '×', beta: 'β', Delta: 'Δ', delta: 'δ', Omega: 'Ω', omega: 'ω', mu: 'µ', theta: 'θ', lambda: 'λ', rho: 'ρ', sigma: 'σ', circ: '°', degree: '°', pm: '±', div: '÷', ldots: '…', cdots: '…', dots: '…', cup: '∪', cap: '∩', subset: '⊂', emptyset: '∅', cos: 'cos ', sin: 'sin ', tan: 'tan ', max: 'max', min: 'min', rm: '', sum: 'Σ', mathop: '', bf: '', it: '', varnothing: '∅', parallel: '//', perp: '⊥', mathbb: '', left: '', right: '', displaystyle: '', quad: ' ', qquad: '  ', ',': ' ', ';': ' ', ':': ' ', '!': '', ' ': ' ', '%': '%', '{': '{', '}': '}', '#': '#', '&': '&amp;', '_': '_', backslash: '\\', lt: '&lt;', gt: '&gt;' };
  let r = '', i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === '\\') {
      const m = s.slice(i + 1).match(/^([A-Za-z]+|.)/); const k = m[1]; i += 1 + k.length;
      if (k === 'frac' || k === 'dfrac' || k === 'tfrac') { const [a, i1] = arg(s, i); const [b, i2] = arg(s, i1); i = i2; r += '<span class="ax-fr"><span>' + tex(a) + '</span><span>' + tex(b) + '</span></span>'; }
      else if (k === 'begin' && /^\{array\}/.test(s.slice(i))) { const e = s.indexOf('\\end{array}', i); const c = s.slice(i + 7, e).replace(/^\{[lcr|]*\}/, ''); i = e + 11; r += '<span class="ax-col">' + c.split('\\\\').map(x => '<span>' + tex(x) + '</span>').join('') + '</span>'; }
      else if (k === 'sqrt') { const [a, i1] = arg(s, i); i = i1; r += '√<span class="ax-rad">' + tex(a) + '</span>'; }
      else if (k === 'widehat' || k === 'hat') { const [a, i1] = arg(s, i); i = i1; r += '<span class="ax-ang">' + tex(a) + '</span>'; }
      else if (k === 'overrightarrow' || k === 'vec' || k === 'overline') { const [a, i1] = arg(s, i); i = i1; r += '<span class="ax-vec">' + tex(a) + '</span>'; }
      else if (k === 'text' || k === 'mathrm' || k === 'textrm' || k === 'mbox' || k === 'mathbf' || k === 'textbf' || k === 'operatorname') { const [a, i1] = arg(s, i); i = i1; r += tex(a); }
      else if (k === 'mathbb') { const [a, i1] = arg(s, i); i = i1; r += ({ R: 'ℝ', N: 'ℕ', Z: 'ℤ', Q: 'ℚ', D: 'ⅅ' })[a.trim()] || a; }
      else if (k in SYM) r += SYM[k];
      else r += '\\' + k; // inconnu : laissé visible pour relecture
    } else if (c === '^' || c === '_') { const [a, i1] = arg(s, i + 1); i = i1; const t = c === '^' ? 'sup' : 'sub'; r += '<' + t + '>' + tex(a) + '</' + t + '>'; }
    else if (c === '{' ) { const [a, i1] = grp(s, i); i = i1; r += tex(a); }
    else if (c === '}') i++;
    else { r += c === '<' ? '&lt;' : c === '>' ? '&gt;' : c; i++; }
  }
  return r;
}
// Schémas redessinés en SVG (tools/annales/_schemas.cjs) : <!--schema:nom--> dans une source.
const SCHEMAS = require("./annales/_schemas.cjs");
const schemas = (h, nom) => h.replace(/<!--schema:([a-z0-9-]+)-->/g, (_, k) => { if (!SCHEMAS[k]) { err(nom + " : schéma inconnu " + k); return ""; } const c = SCHEMAS[k](), larg = +((c.match(/viewBox="0 0 (\d+)/) || [])[1] || 0); return '<figure class="ax-fig' + (larg >= 600 && !c.includes("</svg><svg") ? " ax-large" : "") + '">' + c + "</figure>"; });
const formules = h => h.replace(/\\\(([\s\S]*?)\\\)/g, (_, a) => tex(a));

// --- Lecture et contrôle des sources ---
const sources = [];
for (const ex of fs.readdirSync(SRC).filter(d => EXAMENS[d])) {
  for (const f of fs.readdirSync(path.join(SRC, ex)).filter(f => /^[a-z-]+-\d{4}\.html$/.test(f)).sort()) {
    const nom = ex + "/" + f, t = fs.readFileSync(path.join(SRC, ex, f), "utf8");
    const m = t.match(/^<!--meta\s*([\s\S]*?)-->/); if (!m) { err(nom + " : méta absente"); continue; }
    let meta; try { meta = JSON.parse(m[1]); } catch (e) { err(nom + " : méta illisible " + e.message); continue; }
    const bloc = k => { const b = t.match(new RegExp("<!--" + k + "-->([\\s\\S]*?)<!--/" + k + "-->")); return b ? b[1].trim() : ""; };
    // Les titres (<strong>) sont en couleur ; un <strong> qui ne porte qu'un barème (« 3 pts ») reste sobre.
    const bareme = h => h.replace(/<strong>([^<]{1,40})<\/strong>/g, (m, t) => /\d/.test(t) && /^[\s\d,.×x=+*()\/–-]*$/i.test(t.replace(/\b(pts?|points?|ptos?|puntos?|marks?|P)\b/gi, "")) ?'<strong class="ax-pts">' + t + "</strong>" : m);
    const s = { nom, meta, sujet: schemas(bareme(formules(bloc("sujet"))), nom), corrige: schemas(bareme(formules(bloc("corrige"))), nom) };
    if (meta.examen !== ex) err(nom + " : examen " + meta.examen + " hors de son dossier");
    if (!MATIERES[meta.matiere]) err(nom + " : matière inconnue " + meta.matiere);
    s.cle = meta.matiere + (meta.serie ? "-" + meta.serie : "");
    if (meta.serie && !/^[a-z]+$/.test(meta.serie)) err(nom + " : série illisible " + meta.serie);
    if (f !== s.cle + "-" + meta.annee + ".html") err(nom + " : nom de fichier ≠ matière(-série)-année de la méta");
    s.serie = meta.serie ? nomSerie(meta.serie) : "";
    s.classes = meta.classes || EXAMENS[ex].classes;
    if (s.classes.split(",").some(c => !/^(3e|1re [ACD]|Tle [ACD])$/.test(c))) err(nom + " : classes inconnues " + s.classes);
    if (!/^https:\/\//.test(meta.sujet_source || "")) err(nom + " : sujet_source manquant");
    if (!["veritas", "national"].includes(meta.corrige)) err(nom + " : corrige doit valoir veritas ou national");
    if (meta.corrige === "national" && !/^https:\/\//.test(meta.corrige_source || "")) err(nom + " : corrigé national sans source");
    if (s.sujet.length < 300) err(nom + " : sujet vide ou tronqué");
    if (s.corrige.length < 300) err(nom + " : corrigé vide ou tronqué");
    [["sujet", s.sujet], ["corrigé", s.corrige]].forEach(([k, h]) => {
      const r = h.match(/\\[A-Za-z]+|@@\d+@@|camerecole|Contenus similaires|TikTok/i); if (r) err(nom + " (" + k + ") : reste à nettoyer « " + r[0] + " »");
      (h.match(/<img src="([^"]+)"/g) || []).forEach(x => { const p = x.slice(10, -1); if (!p.startsWith("/ressources/annales/img/") || !fs.existsSync(path.join(R, p))) err(nom + " : image absente " + p); });
      const ouv = (h.match(/<(table|p|ul|ol|li|tr|td|th|strong|em|span|sup|sub)[\s>]/g) || []).length, fer = (h.match(/<\/(table|p|ul|ol|li|tr|td|th|strong|em|span|sup|sub)>/g) || []).length;
      if (ouv !== fer) err(nom + " (" + k + ") : balises déséquilibrées (" + ouv + " ouvertes, " + fer + " fermées)");
    });
    s.page = "ressources/annales/" + ex + "-" + s.cle + "-" + meta.annee + ".html";
    sources.push(s);
  }
}

// --- Habillage commun (repris du gabarit des fiches) ---
function habiller(html, page, titre, description, ld) {
  const url = "https://veritas-school.com/" + page, d = esc(description), t = esc(titre);
  const rep = (re, v, nom) => { if (!re.test(html)) err(page + " : balise introuvable " + nom); html = html.replace(re, () => v); };
  rep(/<title>[\s\S]*?<\/title>/, "<title>" + t + "</title>", "title");
  rep(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + d + '">', "description");
  rep(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + url + '">', "canonical");
  rep(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + t + '">', "og:title");
  rep(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + d + '">', "og:description");
  rep(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + url + '">', "og:url");
  rep(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '<script type="application/ld+json">' + JSON.stringify(Object.assign({ "@context": "https://schema.org", inLanguage: "fr", url, publisher: { "@type": "Organization", name: "Centre VÉRITAS", url: "https://veritas-school.com" } }, ld)) + "</script>", "ld+json");
  rep(/<style id="vrt-methode">[\s\S]*?<\/style>/, '<style id="vrt-methode">' + CSS + "</style>", "style vrt-methode");
  return html;
}
function article(badge, h1, chapo, parties, cta) {
  const ids = parties.map(p => [p[0], p[1]]);
  const som = '<aside class="mx-sommaire" aria-label="Sommaire"><p>Sommaire</p><ol class="mx-ol">' + ids.map(([id, ti], k) => '<li><a href="#' + id + '">' + (k + 1) + ". " + ti + "</a></li>").join("") +
    '</ol><div class="mx-lu"><span id="mxLu">Lecture : 0 %</span><div class="mx-barre"><i id="mxBar"></i></div></div></aside>';
  const nav = '<nav class="mx-som" aria-label="Sommaire">' + ids.map(([id, ti]) => '<a href="#' + id + '">' + ti + "</a>").join("") + "</nav>";
  const corps = parties.map(([id, ti, h], k) => '<section class="partie" id="' + id + '"><h2><span class="mx-num">' + (k + 1) + '</span><span class="mx-txt">' + ti + "</span></h2>" + h + "</section>\n").join("");
  return '<div class="mx-grille" id="mx" data-vh-ignore="1">' + som + '<article class="card mx">\n<span class="badge">' + esc(badge) + "</span>\n<h1>" + esc(h1) + "</h1>\n" +
    '<p class="mx-chapo">' + chapo + "</p>\n" + nav + "\n" + corps + cta + "\n</article></div>" + '<script src="/ressources/methode.js?v=' + JS_V + '" defer></script>';
}
const RE_ART = /<div class="mx-grille"[^>]*>[\s\S]*?<\/article><\/div>(?:<script src="\/ressources\/methode\.js\?v=[0-9a-f]+" defer><\/script>)?/;
const ecrites = [], identiques = [];
function ecrire(page, html) {
  const f = path.join(R, page), avant = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null;
  if (avant === html) { identiques.push(page); return; }
  if (CONTROLE) { err(page + " : diffère de sa source (relancer node tools/annales.cjs)"); return; }
  fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); ecrites.push(page);
}
const GAB = fs.readFileSync(path.join(R, GABARIT), "utf8");
if (!RE_ART.test(GAB)) err(GABARIT + " : article des fiches introuvable");

// --- Une page par épreuve ---
for (const s of sources) {
  const { meta } = s, E = EXAMENS[meta.examen], [lib, fiches] = MATIERES[meta.matiere];
  const soeurs = sources.filter(x => x.meta.examen === meta.examen && x.cle === s.cle).sort((a, b) => b.meta.annee - a.meta.annee);
  const annees = '<div class="ax-annees">' + soeurs.map(x => x === s ? "<span>" + x.meta.annee + "</span>" : '<a href="/' + x.page + '">' + x.meta.annee + "</a>").join("") + "</div>";
  const exa = E.nom + (s.serie ? " " + s.serie.replace(/^séries? /, "") : "");
  const titre = lib + " au " + exa + " " + meta.annee + " : sujet et corrigé";
  const description = "Sujet officiel de " + lib.toLowerCase() + " du " + E.nom + " " + meta.annee + (s.serie ? ", " + s.serie : "") + " (Cameroun, " + s.classes.split(",").join(", ") + ") et " + (meta.corrige === "national" ? "corrigé harmonisé national" : "corrigé détaillé") + ", barème inclus.";
  const national = meta.corrige === "national";
  const epreuve = '<div class="ax-meta"><span><b>Examen</b> ' + E.nom + " " + meta.annee + "</span>" + (s.serie ? "<span><b>Série</b> " + esc(s.serie.replace(/^séries? /, "")) + "</span>" : "") +(meta.duree ? "<span><b>Durée</b> " + esc(meta.duree) + "</span>" : "") + (meta.coef ? "<span><b>Coefficient</b> " + esc(meta.coef) + "</span>" : "") + "</div>" +
    "<p>Traite le sujet dans les conditions de l'examen, montre en main, puis compare ta copie au corrigé. Les autres sessions :</p>" + annees +
    (fiches[meta.examen] ? '<p style="margin-top:14px">La méthode de l\'épreuve, le barème et les erreurs fréquentes : <a href="/' + fiches[meta.examen] + '">voir la fiche</a>.</p>' : "");
  const corrigeTete = national
    ? '<div class="ax-avert"><strong>Corrigé harmonisé national.</strong> Grille officielle utilisée par les correcteurs ; toute réponse pertinente non prévue est prise en compte.</div>'
    : '<div class="ax-avert"><strong>Proposition de corrigé VÉRITAS.</strong> Ce n\'est pas le corrigé officiel : c\'est la réponse attendue, rédigée par nos enseignants selon le barème du sujet. Une autre démarche juste rapporte les mêmes points.</div>';
  const outils = '<div class="ax-outils" data-id="' + esc(meta.examen + "-" + s.cle + "-" + meta.annee) + '" data-titre="' + esc(titre) + '" data-min="' + minutes(meta.duree || (sources.find(o => o.meta.examen === meta.examen && o.cle === s.cle && o.meta.duree) || { meta: {} }).meta.duree) + '" data-meta="' + esc([E.nom + " " + meta.annee, s.serie, meta.duree ? "Durée : " + meta.duree : "", meta.coef ? "Coefficient : " + meta.coef : ""].filter(Boolean).join(" · ")) + '">' +
    '<button type="button" class="ax-btn" data-a="pdf"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14"/></svg><span>Télécharger en PDF</span></button>' +
    '<button type="button" class="ax-btn ax-plein" data-a="direct"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg><span>Composer en direct</span></button>' +
    '<span class="ax-abo">Réservé aux abonnés</span></div>';
  const parties = [
    ["epreuve", "L'épreuve", outils + epreuve],
    ["sujet", "Le sujet", (meta.note ? '<div class="ax-avert">' + meta.note + "</div>" : "") + '<div class="ax-sujet">' + s.sujet + "</div>"],
    ["corrige", "Le corrigé", '<details class="ax-cache"><summary>Afficher le corrigé (après avoir traité le sujet)</summary><div class="ax-corrige">' + corrigeTete + s.corrige + "</div></details>"],
    ["sources", "Sources", "<ul><li>Sujet : épreuve officielle du " + E.nom + " " + meta.annee + (s.serie ? ", " + s.serie : "") + " (" + E.org + ")</li>" +
      "<li>Corrigé : " + (national ? "corrigé harmonisé national" : "les enseignants de VÉRITAS") + "</li></ul>"],
  ];
  const cta = '<a class="cta" href="/ressources/annales/">Toutes les annales corrigées<small>Par examen, par matière et par session</small></a>';
  let html = GAB.replace(RE_ART, () => article("Annales · " + E.nom + " " + meta.annee, titre, "Le sujet officiel de la session " + meta.annee + ", puis son corrigé, à ouvrir une fois ta copie terminée.", parties, cta));
  html = html.replace("</body>", () => '<script src="/ressources/annales/annales.js?v=' + AX_V + '" defer></script>\n</body>');
  html = habiller(html, s.page, titre + " | VÉRITAS", description, { "@type": "LearningResource", name: titre, description, educationalLevel: s.classes, learningResourceType: "Annale d'examen", about: lib });
  ecrire(s.page, html);
}

// --- Script des outils abonnés (PDF, composer en direct) ---
ecrire("ressources/annales/annales.js", AX_JS);

// --- Index des annales ---
(function index() {
  const page = "ressources/annales/index.html";
  const parties = Object.keys(EXAMENS).map(ex => {
    const xs = sources.filter(s => s.meta.examen === ex); if (!xs.length) return null;
    const cles = [...new Set(xs.map(s => s.cle))].sort((a, b) => ORDRE.indexOf(xs.find(s => s.cle === a).meta.matiere) - ORDRE.indexOf(xs.find(s => s.cle === b).meta.matiere) || a.localeCompare(b));
    const lignes = cles.map(k => {
      const ys = xs.filter(s => s.cle === k).sort((a, b) => b.meta.annee - a.meta.annee);
      return "<tr><th>" + esc(MATIERES[ys[0].meta.matiere][0]) + (ys[0].serie ? " <small>(" + esc(ys[0].serie) + ")</small>" : "") + "</th><td>" + ys.map(s => '<a href="/' + s.page + '">' + s.meta.annee + "</a>").join(" · ") + "</td></tr>";
    }).join("");
    return [ex, EXAMENS[ex].nom + " (" + EXAMENS[ex].classe + ")", '<table class="ax-tbl"><thead><tr><th>Matière</th><th>Sessions corrigées</th></tr></thead><tbody>' + lignes + "</tbody></table>"];
  }).filter(Boolean);
  parties.push(["methode", "Comment s'en servir", "<p>Traite chaque sujet en temps limité, sans regarder le corrigé. Corrige-toi ensuite avec le barème, puis relis la fiche de méthode de la matière pour comprendre les points perdus.</p><p>Les corrigés marqués « corrigé harmonisé national » reproduisent la grille officielle ; les autres sont des propositions rédigées par VÉRITAS, signalées comme telles.</p>"]);
  // Le titre ne promet que les examens réellement couverts.
  const noms = Object.keys(EXAMENS).filter(ex => sources.some(s => s.meta.examen === ex)).map(ex => EXAMENS[ex].nom);
  const liste = noms.length > 1 ? noms.slice(0, -1).join(", ") + " et " + noms[noms.length - 1] : noms[0];
  const titre = "Annales corrigées : " + liste;
  const description = "Les derniers sujets officiels (" + liste + ", Cameroun), par matière et par session, avec leurs corrigés : mathématiques, PCT, SVTEEHB, français, histoire-géographie, ECM, langues, informatique.";
  let html = GAB.replace(RE_ART, () => article("Annales", titre, "Les derniers sujets officiels, par examen, par matière et par session, chacun avec son corrigé.", parties, '<a class="cta" href="/ressources/">Méthodes et examens<small>Le format de chaque épreuve et la méthode pas à pas</small></a>'));
  html = habiller(html, page, titre + " | VÉRITAS", description, { "@type": "CollectionPage", name: titre, description });
  ecrire(page, html);
})();

// --- Liste pour les fiches de méthode ---
(function liste() {
  const f = path.join(SRC, "_liste.json");
  // Lue par methodes_examens.cjs (fiches) et apprendre_carte.cjs (classe et matière d'Apprendre).
  const L = sources.slice().sort((a, b) => ORDRE.indexOf(a.meta.matiere) - ORDRE.indexOf(b.meta.matiere) || a.cle.localeCompare(b.cle) || b.meta.annee - a.meta.annee)
    .map(s => ({ id: s.meta.examen + "-" + s.cle + "-" + s.meta.annee, examen: s.meta.examen, m: s.meta.matiere, serie: s.serie, nomExamen: EXAMENS[s.meta.examen].nom, fiche: MATIERES[s.meta.matiere][1][s.meta.examen] || null, matiere: MATIERES[s.meta.matiere][0] + (s.serie ? " (" + s.serie + ")" : ""), mat: MATIERES[s.meta.matiere][2], classes: s.classes, annee: s.meta.annee, national: s.meta.corrige === "national", u: "/" + s.page }));
  const json = JSON.stringify(L, null, 1) + "\n";
  if (fs.existsSync(f) && fs.readFileSync(f, "utf8") === json) return;
  if (CONTROLE) return err("tools/annales/_liste.json : à régénérer");
  fs.writeFileSync(f, json);
})();

// Pages d'annales sans source : retirées.
if (fs.existsSync(OUT)) fs.readdirSync(OUT).filter(x => /\.html$/.test(x) && x !== "index.html").forEach(x => {
  if (sources.some(s => s.page === "ressources/annales/" + x)) return;
  if (CONTROLE) return err("ressources/annales/" + x + " : page sans source");
  fs.unlinkSync(path.join(OUT, x)); console.log("retirée : ressources/annales/" + x);
});

if (erreurs) { console.error(erreurs + " erreur(s)."); process.exit(1); }
console.log("Annales : " + sources.length + " épreuves, " + ecrites.length + " page(s) écrite(s), " + identiques.length + " inchangée(s).");
