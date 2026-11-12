/* Construit apprendre/ressources.js : tout ce que le site offre, rattaché aux
   classes, matières et leçons de la progression MINESEC 2026-2027.
   Carte : tools/apprendre_carte.cjs. Usage : node tools/build_apprendre_ressources.cjs
   Échoue (code 1) si un rattachement ne tient pas ou si une page n'existe pas. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const R = path.join(__dirname, ".."), lire = f => fs.readFileSync(path.join(R, f), "utf8");
const CARTE = require("./apprendre_carte.cjs");
let erreurs = 0; const err = m => { erreurs++; console.error("ERREUR : " + m); };

function charger(f, init) { const w = Object.assign({}, init); const ctx = { window: w, document: { getElementById: () => true, addEventListener() {} }, console, location: { search: "" } }; vm.createContext(ctx); vm.runInContext(lire(f), ctx); return w; }
const PROG = charger("apprendre/progressions.js").VRT_PROG;
const VRT = charger("apprendre/commun.js", { localStorage: null }).VRT.app;
const LABOS = charger("chunks/labo.js").LABO_DB;
const JEUX = charger("chunks/jeux.js", { JEUX_CATALOGUE: [] }).JEUX_CATALOGUE;
const APP = lire("app.js"), LITT = lire("chunks/litt-oeuvres.js");

const leconsDe = (c, m) => { const M = VRT.PAR_ID[m]; if (!M) { err("matière inconnue " + m); return []; } const o = []; M.minesec.forEach(s => ((PROG[c] || {})[s] || []).forEach(ch => ch[1].forEach(l => o.push(l)))); return o; };
const classesDe = s => { const a = s.split(","); a.forEach(c => { if (!PROG[c]) err("classe inconnue " + c); }); return a; };

const items = {}, lec = {}, mat = {};
const ajoute = (t, k, id) => { (t[k] = t[k] || []); if (t[k].indexOf(id) < 0) t[k].push(id); };
function rattacher(id, l) {
  const [cs, m, rangs, mot] = l; let n = 0;
  classesDe(cs).forEach(c => {
    if (l.length === 2) { ajoute(mat, c + "|" + m, id); n++; if (!leconsDe(c, m).length) err(id + " : aucune leçon en " + c + "/" + m); return; }
    const L = leconsDe(c, m), retenues = rangs ? rangs.map(r => L.find(x => x[0] === r)) : L.filter(x => mot.test(x[1]));
    if (!retenues.length) err(id + " : rien en " + c + "/" + m + " pour " + mot);
    retenues.forEach((x, i) => {
      if (!x) return err(id + " : rang " + rangs[i] + " absent en " + c + "/" + m);
      if (!mot.test(x[1])) return err(id + " : " + c + "/" + m + " rang " + x[0] + " ne répond pas à " + mot + " → « " + x[1] + " »");
      ajoute(lec, c + "|" + m + "|" + x[0], id); n++;
    });
  });
  return n;
}

function verifieUrl(id, u) { if (!/^\//.test(u) || u.indexOf('/#') === 0 || /\/app\.html#/.test(u)) return; let f = u.replace(/[#?].*$/, ""); if (f.endsWith("/")) f += "index.html"; if (!fs.existsSync(path.join(R, f))) err(id + " : page absente " + f); }

// Labos
LABOS.forEach(l => {
  const liens = CARTE.labos[l.id]; if (!liens) return;
  items[l.id] = { t: "labo", ti: l.titre, d: l.desc, u: l.gratuit ? "labo.html?id=" + l.id : "/app.html#labo?id=" + l.id, ab: l.gratuit ? 0 : 1 };
  liens.forEach(x => rattacher(l.id, x));
});
Object.keys(CARTE.labos).forEach(i => { if (!items[i]) err("labo inconnu " + i); });

// Jeux
const parId = {}; JEUX.forEach(j => parId[j.id] = j);
Object.keys(CARTE.jeux).forEach(i => {
  const j = parId[i]; if (!j) return err("jeu inconnu " + i);
  items[i] = { t: "jeu", ti: j.titre, d: j.desc || "", u: "/app.html#jeu?id=" + i, ab: j.gratuit ? 0 : 1 };
  CARTE.jeux[i].forEach(x => rattacher(i, x));
});

// Pages publiques
CARTE.pages.forEach(p => { items[p.id] = { t: p.t, ti: p.ti, d: p.d || "", u: p.u, ab: 0 }; verifieUrl(p.id, p.u); p.l.forEach(x => rattacher(p.id, x)); });
CARTE.oeuvres.forEach(([f, ti, cs, mot]) => {
  const id = "oe_" + f; items[id] = { t: "oeuvre", ti, d: "Analyse, résumé et fiche de lecture.", u: "/oeuvres/" + f + ".html", ab: 0 }; verifieUrl(id, items[id].u);
  if (mot) rattacher(id, [cs, "francais", null, mot]); classesDe(cs).forEach(c => ajoute(mat, c + "|francais", id));
  // La version interactive : fiche, carte mentale, QCM, citations.
  const k = f.replace(/-/g, "_");
  if (!LITT.includes('"' + k + '"') && !new RegExp("\\b" + k + "\\s*:").test(LITT)) err("œuvre interactive absente : " + k);
  const idi = "oi_" + k; items[idi] = { t: "oeuvre", ti: ti + " : carte mentale, QCM, citations", d: "La version interactive de l'œuvre.", u: "/app.html#oeuvre?k=" + k, ab: 0 };
  classesDe(cs).forEach(c => ajoute(mat, c + "|francais", idi));
});

// Courants littéraires : frise rattachée aux leçons « contexte »
items.frise = { t: "cours", ti: "La frise des courants littéraires", d: "Situer l'œuvre dans son époque.", u: "/eleve/frise-litteraire.html", ab: 0 };
CARTE.frise.forEach(([mot, ancre, nom]) => { items["fr_" + ancre] = { t: "cours", ti: nom, d: "Le courant littéraire de l'œuvre, sur la frise.", u: "/eleve/frise-litteraire.html#" + ancre, ab: 0 }; });
Object.keys(PROG).forEach(c => leconsDe(c, "francais").forEach(l => {
  if (!/inscription de l.œuvre|bilan de l.étude/i.test(l[1]) || !/^(2nde|1re|Tle)/.test(c)) return;
  const f = CARTE.frise.find(x => x[0].test(l[1]));
  ajoute(lec, c + "|francais|" + l[0], f ? "fr_" + f[1] : "frise");
}));

// Corrigés de français
Object.keys(CARTE.corriges).forEach(c => {
  const dir = CARTE.corriges[c], d = path.join(R, "corriges", dir);
  if (!fs.existsSync(d)) return err("dossier corrigés absent " + dir);
  const seqs = fs.readdirSync(d).filter(f => /^(sequence|module)-\d+\.html$/.test(f)).sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
  seqs.forEach(f => {
    const id = "co_" + dir.replace(/-/g, "_") + "_" + f.replace(/\.html|-/g, "");
    if (!items[id]) {
      const h = fs.readFileSync(path.join(d, f), "utf8"), t = (/<title>([^<]+)/.exec(h) || [])[1] || f, net = t.replace(/&#x27;/g, "'").replace(/&amp;/g, "&").split("|")[0].replace(/^Corrigés[^—-]*[—-]\s*/, "").trim().replace(/…$/, "");
      items[id] = { t: "corrige", ti: net, d: "Corrigé du cahier, exercice par exercice.", u: "/corriges/" + dir + "/" + f, ab: 0 };
    }
    ajoute(mat, c + "|francais", id);
  });
  if (!seqs.length) { items["co_" + dir] = items["co_" + dir] || { t: "corrige", ti: "Corrigés du cahier", d: "Exercice par exercice.", u: "/corriges/" + dir + "/", ab: 0 }; ajoute(mat, c + "|francais", "co_" + dir); }
  const pg = CARTE.programmes[c], idp = "pr_" + pg; items[idp] = { t: "methode", ti: "Mon programme de français", d: "Œuvres, séquences et attendus de la classe.", u: "/niveaux/francais-" + pg + ".html", ab: 0 }; verifieUrl(idp, items[idp].u); ajoute(mat, c + "|francais", idp);
});

// Évaluations en direct
const RE_EV = /\{id:"(eval_[a-z0-9_]+)",titre:"([^"]+)",matiere:"[^"]+",classe:"[^"]+",duree:(\d+)/g; let m;
const vus = {};
while ((m = RE_EV.exec(APP))) {
  const cible = CARTE.evaluations[m[1]]; if (!cible) { err("évaluation sans rattachement " + m[1]); continue; }
  vus[m[1]] = 1; items[m[1]] = { t: "direct", ti: m[2], d: m[3] + " minutes, corrigée dès la remise.", u: "/app.html#evaluations?id=" + m[1], ab: 0, compte: 1 };
  classesDe(cible[0]).forEach(c => cible[1].forEach(x => { ajoute(mat, c + "|" + x, m[1]); if (!leconsDe(c, x).length) err(m[1] + " : rien en " + c + "/" + x); }));
}
Object.keys(CARTE.evaluations).forEach(i => { if (!vus[i]) err("évaluation inconnue " + i); });

// Annales (EPREUVES_DB) : filtrées dans l'application, par classe et matière
const a = APP.indexOf("window.EPREUVES_DB=["), b = APP.indexOf("];", a), RE_EP = /\{id:"([^"]+)",titre:"([^"]+)",matiere:"([^"]+)",classe:"([^"]+)",seq:"[^"]*",cat:"[^"]*",gratuit:(true|false)/g;
const ep = APP.slice(a, b), exclus = [];
const CL = { "6ème":["6e"], "5ème":["5e"], "4ème":["4e"], "3ème":["3e"], "1ère":["1re A","1re C","1re D"], "1ère C":["1re C"], "1ère D":["1re D"], "Tle A":["Tle A"], "Tle C":["Tle C"], "Tle D":["Tle D"] };
while ((m = RE_EP.exec(ep))) {
  const cls = CL[m[4]], ms = CARTE.matEpreuve[m[3]];
  if (!cls || !ms) { exclus.push(m[1]); continue; }
  items[m[1]] = { t: "epreuve", ti: m[2], d: "", u: "/app.html#epreuves?classe=" + encodeURIComponent(m[4]) + "&matiere=" + encodeURIComponent(m[3]) + "&id=" + encodeURIComponent(m[1]), ab: m[5] === "true" ? 0 : 1 };
  cls.forEach(c => ms.forEach(x => { if (leconsDe(c, x).length) ajoute(mat, c + "|" + x, m[1]); }));
}

// Outils
const cl = {};
CARTE.outils.forEach(o => {
  items[o.id] = { t: o.t, ti: o.ti, d: o.d, u: o.u, ab: 0 }; if (o.compte) items[o.id].compte = 1; verifieUrl(o.id, o.u);
  const cs = o.c ? classesDe(o.c) : Object.keys(PROG); cs.forEach(c => { ajoute(cl, c, o.id); if (o.t === "orientation" || o.t === "notes") if (leconsDe(c, "orientation").length) ajoute(mat, c + "|orientation", o.id); });
});

// Coefficients : une seule source, le tableau de parcours/index.html (arrêté 92/22/MINESEC)
const pc = lire("parcours/index.html"), dbt = pc.indexOf("var SERIES = {"), fin = pc.indexOf("var GCE", dbt);
if (dbt < 0 || fin < 0) err("tableau SERIES introuvable dans parcours/index.html");
const coefs = vm.runInNewContext("(function(){" + pc.slice(dbt, fin) + ";return {A4:SERIES.A4,C:SERIES.C,D:SERIES.D,college:SERIES.college}})()");
const nbLec = Object.values(lec).reduce((n, v) => n + v.length, 0);
const sortie = "/* Ressources du site rattachées à la progression MINESEC 2026-2027.\n   Fichier GÉNÉRÉ par tools/build_apprendre_ressources.cjs : ne pas modifier à la main. */\n" +
  "window.VRT_RES=" + JSON.stringify({ items, lec, mat, cl, coefs }) + ";\n";
if (erreurs) { console.error(erreurs + " erreur(s) : ressources.js non écrit."); process.exit(1); }
fs.writeFileSync(path.join(R, "apprendre/ressources.js"), sortie);
const nb = {}; Object.values(items).forEach(i => nb[i.t] = (nb[i.t] || 0) + 1);
console.log("ressources.js :", Object.keys(items).length, "ressources", JSON.stringify(nb), "—", Object.keys(lec).length, "leçons reliées,", nbLec, "liens,", (sortie.length / 1024 | 0), "Ko");
console.log("Épreuves hors de ces progressions :", exclus.join(", "));
