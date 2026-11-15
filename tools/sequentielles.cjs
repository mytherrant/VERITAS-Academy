/* Épreuves séquentielles (ressources/sequentielles/*.html) — générateur en deux temps.

   Le dépôt est PUBLIC : le sujet complet et le corrigé n'y entrent jamais.

   1) PUBLIER (sur le poste de Jacques, sources privées) :
        node tools/sequentielles.cjs --publier <sources> <ftp>
      <sources>/<classe>/<matiere>-s<N>.html (hors dépôt, ex. apprendre_prive/sequentielles) :
        <!--meta {"classe":"3e","matiere":"mathematiques","seq":1,"duree":"2 h","coef":4} -->
        <!--sujet--> premier exercice <!--coupe--> suite du sujet <!--/sujet-->
        <!--corrige--> corrigé complet, barème inclus <!--/corrige-->
      Écrit : tools/sequentielles/<id>.html   (méta + PREMIER EXERCICE seulement : public)
              <ftp>/uploads/protected/apprendre/<id>.json   ({sujet, corrige} : à déposer par FTP)
      Le serveur (api/apprendre.php) ne sert le .json qu'à un compte dont la formule est active
      et couvre la classe : l'identifiant commence par la classe (« 3e-… », « 1re-c-… »).

   2) PAGES (ici et en CI) :
        node tools/sequentielles.cjs            → écrit les pages publiques
        node tools/sequentielles.cjs --controle → échoue si une page diffère de sa source
      Lit tools/sequentielles/*.html, écrit ressources/sequentielles/<id>.html + index.html,
      et tools/sequentielles/_liste.json (lu par build_apprendre_ressources.cjs).

   Les leçons couvertes par une séquence viennent de la progression (apprendre/progressions.js)
   découpée par les semaines officielles (tools/sequentielles/_sequences.json, relevé sur la fiche
   MINESEC 2026-2027 : un chiffre de séquence par leçon, dans l'ordre de la progression). */
"use strict";
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const R = path.join(__dirname, ".."), SRC = path.join(__dirname, "sequentielles"), OUT = path.join(R, "ressources/sequentielles");
const GABARIT = "ressources/methode-dictee.html";
const ARGS = process.argv.slice(2), CONTROLE = ARGS.includes("--controle"), PUBLIER = ARGS.includes("--publier");
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
let erreurs = 0; const err = m => { erreurs++; console.error("ERREUR : " + m); };

// Classes d'examen d'abord (demande de Jacques, 15/11/2026). Le préfixe d'identifiant est celui que
// vrt_classe_de_lecon() reconnaît côté serveur : il décide de la classe couverte par la formule.
const CLASSES = { "3e": "3e", "1re A": "1re-a", "1re C": "1re-c", "1re D": "1re-d", "Tle A": "tle-a", "Tle C": "tle-c", "Tle D": "tle-d" };
// matière : [libellé, intitulé de la progression par classe (défaut = premier), matière d'Apprendre]
const MATIERES = {
  // Au 1er cycle, le français s'évalue en trois épreuves séparées, comme au BEPC et dans les sujets de séquence réels.
  etudetexte: ["Français : étude de texte", ["Français"], "francais"],
  orthographe: ["Français : correction orthographique", ["Français"], "francais"],
  expression: ["Français : expression écrite", ["Français"], "francais"],
  francais: ["Français", ["Français"], "francais"],
  mathematiques: ["Mathématiques", ["Mathématiques"], "maths"],
  pct: ["Physique, chimie et technologie", ["PCT"], "pct"],
  physique: ["Physique", ["Physique"], "physique"],
  chimie: ["Chimie", ["Chimie"], "chimie"],
  svt: ["SVTEEHB", ["SVTEEHB"], "svt"],
  anglais: ["Anglais", ["Anglais"], "anglais"],
  histoire: ["Histoire", ["Histoire"], "histoire"],
  geographie: ["Géographie", ["Géographie"], "geo"],
  ecm: ["Éducation à la citoyenneté et à la morale", ["ECM"], "ecm"],
  philosophie: ["Philosophie", ["Philosophie"], "philo"],
  informatique: ["Informatique", ["Informatique", "Informatique TIC", "Informatique Fondamentale"], "info"],
  espagnol: ["Espagnol", ["Espagnol"], "espagnol"],
  allemand: ["Allemand", ["Allemand"], "allemand"],
};
const ORDRE = Object.keys(MATIERES);
const idDe = (classe, mat, seq) => CLASSES[classe] + "-seq" + seq + "-" + mat;
const minutes = d => { const m = /(\d+)\s*h(?:\s*(\d+))?|(\d+)\s*min/.exec(String(d || "")); return m ? (m[1] ? +m[1] * 60 + (+m[2] || 0) : +m[3]) : 120; };

// --- Progression découpée en séquences ---
global.window = {};
eval(fs.readFileSync(path.join(R, "apprendre/progressions.js"), "utf8"));
const PROG = window.VRT_PROG;
const SEQ = JSON.parse(fs.readFileSync(path.join(SRC, "_sequences.json"), "utf8"));
/* Leçons d'une séquence. La fiche en ligne compte parfois quelques lignes de plus que la progression
   (lignes vides filtrées au build) : on rapporte alors chaque leçon à sa place proportionnelle. Une
   fiche datée au trimestre seulement (séquences 1, 3, 5) voit chaque trimestre coupé en deux. */
function leconsDe(classe, mat, seq) {
  const noms = MATIERES[mat][1], nom = noms.find(n => PROG[classe] && PROG[classe][n]);
  if (!nom) return null;
  const L = PROG[classe][nom].flatMap(c => c[1]);
  let s = String((SEQ[classe] || {})[nom] || "").split("").map(Number);
  if (!s.length) return null;
  for (let i = 1; i < s.length; i++) if (s[i] < s[i - 1]) s[i] = s[i - 1];   // dates en désordre : jamais de retour en arrière
  for (const t of [1, 3, 5]) {   // trimestre daté d'un seul bloc → deux séquences
    const ix = s.map((v, i) => v === t || v === t + 1 ? i : -1).filter(i => i >= 0);
    if (ix.length > 1 && ix.every(i => s[i] === t)) ix.slice(Math.ceil(ix.length / 2)).forEach(i => (s[i] = t + 1));
  }
  const de = k => s[Math.min(s.length - 1, Math.floor(k * s.length / L.length))];
  return L.filter((l, k) => de(k) === seq);
}

// Aide à la rédaction : node tools/sequentielles.cjs --lecons "3e" 1 → leçons de chaque matière.
if (ARGS[0] === "--lecons") {
  for (const m of ORDRE) { const L = leconsDe(ARGS[1], m, +ARGS[2]); if (L && L.length) console.log("## " + m + "\n" + L.map(l => "  " + l[0] + ". " + l[1]).join("\n")); }
  process.exit(0);
}

const lireSource = (t, nom) => {
  const m = t.match(/^<!--meta\s*([\s\S]*?)-->/); if (!m) { err(nom + " : méta absente"); return null; }
  let meta; try { meta = JSON.parse(m[1]); } catch (e) { err(nom + " : méta illisible " + e.message); return null; }
  const bloc = k => { const b = t.match(new RegExp("<!--" + k + "-->([\\s\\S]*?)<!--/" + k + "-->")); return b ? b[1].trim() : ""; };
  return { meta, bloc };
};
const equilibre = (h, nom) => {
  const ouv = (h.match(/<(table|p|ul|ol|li|tr|td|th|strong|em|span|sup|sub|div)[\s>]/g) || []).length, fer = (h.match(/<\/(table|p|ul|ol|li|tr|td|th|strong|em|span|sup|sub|div)>/g) || []).length;
  if (ouv !== fer) err(nom + " : balises déséquilibrées (" + ouv + " ouvertes, " + fer + " fermées)");
};
const verifMeta = (meta, nom) => {
  if (!CLASSES[meta.classe]) err(nom + " : classe inconnue " + meta.classe);
  if (!MATIERES[meta.matiere]) err(nom + " : matière inconnue " + meta.matiere);
  if (!(meta.seq >= 1 && meta.seq <= 6)) err(nom + " : séquence hors de 1..6");
  if (!meta.duree) err(nom + " : durée absente");
};

// --- 1) Publier depuis les sources privées ---
if (PUBLIER) {
  const [src, ftp] = ARGS.filter(a => !a.startsWith("--"));
  if (!src || !ftp) { console.error("Usage : node tools/sequentielles.cjs --publier <sources> <ftp>"); process.exit(2); }
  const dFtp = path.join(ftp, "uploads/protected/apprendre"); fs.mkdirSync(dFtp, { recursive: true });
  let n = 0;
  for (const c of fs.readdirSync(src).filter(d => fs.statSync(path.join(src, d)).isDirectory())) {
    for (const f of fs.readdirSync(path.join(src, c)).filter(f => /^[a-z]+-s\d\.html$/.test(f)).sort()) {
      const nom = c + "/" + f, s = lireSource(fs.readFileSync(path.join(src, c, f), "utf8"), nom); if (!s) continue;
      const { meta, bloc } = s; verifMeta(meta, nom);
      const sujet = bloc("sujet"), corrige = bloc("corrige"), k = sujet.indexOf("<!--coupe-->");
      if (k < 0) { err(nom + " : marque <!--coupe--> absente (fin du premier exercice)"); continue; }
      const debut = sujet.slice(0, k).trim(), suite = sujet.slice(k + 12).trim();
      if (debut.length < 200) err(nom + " : premier exercice trop court");
      if (suite.length < 300) err(nom + " : suite du sujet vide ou tronquée");
      if (corrige.length < 400) err(nom + " : corrigé vide ou tronqué");
      [["début", debut], ["suite", suite], ["corrigé", corrige]].forEach(([q, h]) => equilibre(h, nom + " (" + q + ")"));
      const id = idDe(meta.classe, meta.matiere, meta.seq);
      if (f !== meta.matiere + "-s" + meta.seq + ".html" || CLASSES[meta.classe] !== c) err(nom + " : nom de fichier ou dossier ≠ méta");
      // Ce qui reste visible : combien d'exercices et de points attendent derrière le verrou.
      // Langues : « Exercise / Ejercicio / Übung » et « SECTION / Teil » comptent comme exercices et parties.
      const nEx = (suite.match(/<strong>(Exercice|Exercise|Ejercicio|Übung|Aufgabe)\b/g) || []).length;
      const parts = (suite.match(/<h3[^>]*>\s*(PARTIE|SECTION|PARTE|TEIL) [A-Z0-9]+\b/gi) || []).map(x => (/SECTION/i.test(x) ? "la section " : "la partie ") + x.match(/[A-Z0-9]+$/i)[0]);
      // Sans « Exercice » numéroté (histoire, géographie, ECM) : ce qui précède le premier titre de partie est la fin de la partie en cours.
      const finA = !nEx && suite.split(/<h3[\s>]/)[0].replace(/<[^>]+>/g, "").trim().length > 40 ? "la suite de la première partie" : "";
      // Ni exercice numéroté ni partie lettrée (français, langues) : les titres de la suite, tels quels.
      if (!parts.length && !nEx) (suite.match(/<h3[^>]*>[\s\S]*?<\/h3>/g) || []).forEach(h => {
        const t = h.replace(/<[^>]+>/g, "").replace(/\s*[/(].*$/, "").trim();
        if (t) parts.push("« " + t.replace(/^([IVX]+\.\s*)?(.)(.*)$/, (m, r, a, b) => (r || "") + a + b.toLowerCase()) + " »");
      });
      const liste = parts.length > 1 ? parts.slice(0, -1).join(", ") + " et " + parts[parts.length - 1] : parts.join("");
      const reste = [nEx ? nEx + " autre" + (nEx > 1 ? "s exercices" : " exercice") : finA, liste].filter(Boolean).join(", ");
      if (!reste) err(nom + " : impossible de décrire la suite (ni « Exercice », ni « PARTIE »)");
      const pub = "<!--meta " + JSON.stringify(Object.assign({}, meta, { reste })) + " -->\n<!--debut-->\n" + debut + "\n<!--/debut-->\n";
      if (erreurs) continue;
      fs.writeFileSync(path.join(SRC, id + ".html"), pub);
      fs.writeFileSync(path.join(dFtp, id + ".json"), JSON.stringify({ sujet: suite, corrige }));
      n++;
    }
  }
  if (erreurs) { console.error(erreurs + " erreur(s)."); process.exit(1); }
  console.log("Publiées : " + n + " épreuve(s). Fichiers à déposer par FTP : " + dFtp);
}

// --- 2) Pages publiques ---
const AX_JS = fs.readFileSync(path.join(__dirname, "annales/_annales.js"), "utf8").replace(/\r/g, "");
const AX_V = crypto.createHash("sha1").update(AX_JS).digest("hex").slice(0, 8);
const JS_V = crypto.createHash("sha1").update(fs.readFileSync(path.join(R, "tools/methodes/_methode.js"), "utf8").replace(/\r/g, "")).digest("hex").slice(0, 8);
const CSS = fs.readFileSync(path.join(R, "tools/methodes/_methode.css"), "utf8").trim() + "\n" + fs.readFileSync(path.join(__dirname, "annales/_annales.css"), "utf8").trim() + "\n" + fs.readFileSync(path.join(SRC, "_sequentielles.css"), "utf8").trim();

const epreuves = [];
for (const f of fs.readdirSync(SRC).filter(f => /^[a-z0-9-]+-seq\d-[a-z]+\.html$/.test(f)).sort()) {
  const s = lireSource(fs.readFileSync(path.join(SRC, f), "utf8"), f); if (!s) continue;
  const { meta, bloc } = s; verifMeta(meta, f);
  const id = idDe(meta.classe, meta.matiere, meta.seq);
  if (f !== id + ".html") err(f + " : nom ≠ " + id + ".html");
  const debut = bloc("debut"); if (debut.length < 200) err(f + " : premier exercice vide");
  if (/<!--coupe-->|<!--corrige-->|<!--sujet-->/.test(fs.readFileSync(path.join(SRC, f), "utf8"))) err(f + " : la source publique contient la suite ou le corrigé");
  equilibre(debut, f);
  // « lecons » (rangs de la progression) corrige une fiche mal datée, comme celle du français de 3e.
  const toutes = meta.lecons && leconsDe(meta.classe, meta.matiere, 0) !== null ? PROG[meta.classe][MATIERES[meta.matiere][1].find(n => PROG[meta.classe][n])].flatMap(c => c[1]) : null;
  const lecons = toutes ? meta.lecons.map(r => toutes.find(l => l[0] === r) || (err(f + " : rang " + r + " absent de la progression"), null)).filter(Boolean) : leconsDe(meta.classe, meta.matiere, meta.seq);
  if (!lecons || !lecons.length) err(f + " : aucune leçon de la progression pour cette séquence");
  epreuves.push({ id, meta, debut, lecons: lecons || [], page: "ressources/sequentielles/" + id + ".html" });
}

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
  const som = '<aside class="mx-sommaire" aria-label="Sommaire"><p>Sommaire</p><ol class="mx-ol">' + parties.map(([id, ti], k) => '<li><a href="#' + id + '">' + (k + 1) + ". " + ti + "</a></li>").join("") +
    '</ol><div class="mx-lu"><span id="mxLu">Lecture : 0 %</span><div class="mx-barre"><i id="mxBar"></i></div></div></aside>';
  const nav = '<nav class="mx-som" aria-label="Sommaire">' + parties.map(([id, ti]) => '<a href="#' + id + '">' + ti + "</a>").join("") + "</nav>";
  const corps = parties.map(([id, ti, h], k) => '<section class="partie" id="' + id + '"><h2><span class="mx-num">' + (k + 1) + '</span><span class="mx-txt">' + ti + "</span></h2>" + h + "</section>\n").join("");
  return '<div class="mx-grille" id="mx" data-vh-ignore="1">' + som + '<article class="card mx">\n<span class="badge">' + esc(badge) + "</span>\n<h1>" + esc(h1) + "</h1>\n" +
    '<p class="mx-chapo">' + chapo + "</p>\n" + nav + "\n" + corps + cta + "\n</article></div>" + '<script src="/ressources/methode.js?v=' + JS_V + '" defer></script>';
}
const RE_ART = /<div class="mx-grille"[^>]*>[\s\S]*?<\/article><\/div>(?:<script src="\/ressources\/methode\.js\?v=[0-9a-f]+" defer><\/script>)?/;
const GAB = fs.readFileSync(path.join(R, GABARIT), "utf8");
if (!RE_ART.test(GAB)) err(GABARIT + " : article des fiches introuvable");
const ecrites = [], identiques = [];
function ecrire(page, html) {
  const f = path.join(R, page), avant = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null;
  if (avant === html) { identiques.push(page); return; }
  if (CONTROLE) { err(page + " : diffère de sa source (relancer node tools/sequentielles.cjs)"); return; }
  fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); ecrites.push(page);
}
const ICO_PDF = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14"/></svg>';
const ICO_DIR = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg>';
const ICO_CLE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

for (const e of epreuves) {
  const { meta } = e, lib = MATIERES[meta.matiere][0];
  const soeurs = epreuves.filter(x => x.meta.classe === meta.classe && x.meta.matiere === meta.matiere).sort((a, b) => a.meta.seq - b.meta.seq);
  const seqs = '<div class="ax-annees">' + soeurs.map(x => x === e ? "<span>Séquence " + x.meta.seq + "</span>" : '<a href="/' + x.page + '">Séquence ' + x.meta.seq + "</a>").join("") + "</div>";
  const titre = lib + ", " + meta.classe + " : épreuve de la séquence " + meta.seq;
  const description = "Épreuve séquentielle de " + lib.toLowerCase() + " en " + meta.classe + " (Cameroun, séquence " + meta.seq + ", progression MINESEC 2026-2027) au format APC, avec corrigé et barème.";
  const outils = '<div class="ax-outils" data-suite="1" data-id="' + esc(e.id) + '" data-titre="' + esc(titre) + '" data-min="' + minutes(meta.duree) + '" data-meta="' + esc(["Évaluation de la séquence " + meta.seq, meta.classe, "Durée : " + meta.duree, meta.coef ? "Coefficient : " + meta.coef : ""].filter(Boolean).join(" · ")) + '">' +
    '<button type="button" class="ax-btn" data-a="pdf">' + ICO_PDF + "<span>Télécharger en PDF</span></button>" +
    '<button type="button" class="ax-btn ax-plein" data-a="direct">' + ICO_DIR + "<span>Composer en direct</span></button>" +
    '<span class="ax-abo">Réservé aux abonnés</span></div>';
  const fiche = '<div class="ax-meta"><span><b>Classe</b> ' + esc(meta.classe) + "</span><span><b>Séquence</b> " + meta.seq + "</span><span><b>Durée</b> " + esc(meta.duree) + "</span>" + (meta.coef ? "<span><b>Coefficient</b> " + esc(meta.coef) + "</span>" : "") + "</div>" +
    "<p>Les leçons évaluées, dans l'ordre de la progression nationale 2026-2027 :</p><ul class=\"sq-lecons\">" + e.lecons.map(l => "<li>" + esc(l[1]) + "</li>").join("") + "</ul>" +
    (soeurs.length > 1 ? "<p>Les autres séquences de l'année :</p>" + seqs : "");
  const reste = meta.reste || "la suite du sujet";
  const verrou = '<div class="sq-verrou"><p><b>La suite est réservée aux abonnés :</b> ' + reste + ", le corrigé détaillé avec son barème, le téléchargement en PDF et la composition en direct.</p>" +
    '<div class="sq-verrou-act"><button type="button" class="ax-btn ax-plein" data-a="suite">' + ICO_CLE + '<span>Voir la suite (abonnés)</span></button><a class="ax-btn" href="/app.html#abonnement">Choisir une formule</a></div></div>';
  const parties = [
    ["epreuve", "L'épreuve", outils + fiche],
    ["sujet", "Le sujet", (meta.note ? '<div class="ax-avert">' + meta.note + "</div>" : "") + '<div class="ax-sujet">' + e.debut + "</div>" + verrou],
    ["corrige", "Le corrigé", '<div id="sqCorrige"><p class="sq-cadenas">Le corrigé s\'affiche ici dès que la suite du sujet est ouverte.</p></div>'],
    ["sources", "Sources", "<ul><li>Leçons : progression harmonisée MINESEC 2026-2027, sous-système francophone</li><li>Sujet et corrigé : les enseignants de VÉRITAS, au format des évaluations APC</li></ul>"],
  ];
  const cta = '<a class="cta" href="/ressources/sequentielles/">Toutes les épreuves séquentielles<small>Par classe, par matière et par séquence</small></a>';
  let html = GAB.replace(RE_ART, () => article("Épreuve séquentielle · " + meta.classe + " · Séquence " + meta.seq, titre, "Une épreuve de séquence sur les leçons de la progression nationale, au format des évaluations APC. Le premier exercice est ouvert à tous.", parties, cta));
  html = html.replace(/(<script src="\/ressources\/methode\.js\?v=[0-9a-f]+" defer><\/script>)/, m => m + '<script src="/ressources/annales/annales.js?v=' + AX_V + '" defer></script>');
  html = habiller(html, e.page, titre + " | VÉRITAS", description, { "@type": "LearningResource", name: titre, description, educationalLevel: meta.classe, learningResourceType: "Évaluation séquentielle", about: lib, isAccessibleForFree: false });
  ecrire(e.page, html);
}

// --- Index ---
(function index() {
  if (!epreuves.length) return;
  const page = "ressources/sequentielles/index.html";
  const parties = Object.keys(CLASSES).map(c => {
    const xs = epreuves.filter(e => e.meta.classe === c); if (!xs.length) return null;
    const mats = [...new Set(xs.map(e => e.meta.matiere))].sort((a, b) => ORDRE.indexOf(a) - ORDRE.indexOf(b));
    const lignes = mats.map(m => "<tr><th>" + esc(MATIERES[m][0]) + "</th><td>" + xs.filter(e => e.meta.matiere === m).sort((a, b) => a.meta.seq - b.meta.seq).map(e => '<a href="/' + e.page + '">Séq. ' + e.meta.seq + "</a>").join(" · ") + "</td></tr>").join("");
    return [CLASSES[c], c, '<table class="ax-tbl"><thead><tr><th>Matière</th><th>Séquences</th></tr></thead><tbody>' + lignes + "</tbody></table>"];
  }).filter(Boolean);
  parties.push(["methode", "Comment s'en servir", "<p>Chaque épreuve porte sur les leçons de la séquence, dans l'ordre de la progression nationale. Le premier exercice est ouvert à tous ; les abonnés ouvrent la suite, le corrigé avec son barème, le PDF à imprimer et la composition en direct, chronomètre à la durée de l'épreuve.</p>"]);
  const titre = "Épreuves séquentielles corrigées";
  const description = "Épreuves de séquence 1 à 6 au format APC (Cameroun, progression MINESEC 2026-2027) pour les classes d'examen : 3e, 1re et Tle, avec corrigé et barème.";
  let html = GAB.replace(RE_ART, () => article("Épreuves séquentielles", titre, "Une épreuve par séquence, par classe et par matière, sur les leçons de la progression nationale.", parties, '<a class="cta" href="/ressources/annales/">Annales corrigées<small>Les derniers sujets officiels du BEPC, du Probatoire et du BAC</small></a>'));
  html = habiller(html, page, titre + " | VÉRITAS", description, { "@type": "CollectionPage", name: titre, description });
  ecrire(page, html);
})();

// --- Liste pour Apprendre ---
(function liste() {
  const f = path.join(SRC, "_liste.json");
  const L = epreuves.slice().sort((a, b) => ORDRE.indexOf(a.meta.matiere) - ORDRE.indexOf(b.meta.matiere) || a.meta.seq - b.meta.seq)
    .map(e => ({ id: e.id, classe: e.meta.classe, m: e.meta.matiere, mat: MATIERES[e.meta.matiere][2], matiere: MATIERES[e.meta.matiere][0], seq: e.meta.seq, rangs: e.lecons.map(l => l[0]), u: "/" + e.page }));
  const json = JSON.stringify(L, null, 1) + "\n";
  if (fs.existsSync(f) && fs.readFileSync(f, "utf8") === json) return;
  if (CONTROLE) return err("tools/sequentielles/_liste.json : à régénérer");
  fs.writeFileSync(f, json);
})();

if (fs.existsSync(OUT)) fs.readdirSync(OUT).filter(x => /\.html$/.test(x) && x !== "index.html").forEach(x => {
  if (epreuves.some(e => e.page === "ressources/sequentielles/" + x)) return;
  if (CONTROLE) return err("ressources/sequentielles/" + x + " : page sans source");
  fs.unlinkSync(path.join(OUT, x)); console.log("retirée : ressources/sequentielles/" + x);
});

if (erreurs) { console.error(erreurs + " erreur(s)."); process.exit(1); }
console.log("Séquentielles : " + epreuves.length + " épreuves, " + ecrites.length + " page(s) écrite(s), " + identiques.length + " inchangée(s).");
