#!/usr/bin/env node
/* Construit les leçons à verrou de l'espace Apprendre.
   Sources : <dossier>/*.js (appels VRT_L), HORS DÉPÔT : le dépôt est public.
   Produit :
     apprendre/apercus-<classe>.js          début public des leçons, leçons gratuites entières
     apprendre/charge.js                    charge le bon fichier selon la classe
     <ftp>/uploads/protected/apprendre/*.json   suite payante, à déposer par FTP
   Usage : node tools/build_apprendre_payant.cjs <dossier_sources> <dossier_ftp>
   Une erreur de contenu arrête tout : mieux vaut pas de build qu'une leçon cassée. */
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const [src, ftp] = process.argv.slice(2);
if (!src || !ftp) { console.error("Usage : node tools/build_apprendre_payant.cjs <sources> <ftp>"); process.exit(2); }
const RAC = path.dirname(__dirname), APP = path.join(RAC, "apprendre");

global.window = {};
eval(fs.readFileSync(path.join(APP, "progressions.js"), "utf8"));
const PROG = window.VRT_PROG;
const CARTE = {};
{ // correspondance id de matière -> intitulés MINESEC, relue dans commun.js
  const t = fs.readFileSync(path.join(APP, "commun.js"), "utf8");
  for (const m of t.matchAll(/\["([a-z]+)",\s*"[^"]+",\s*"[^"]+",\s*\[[^\]]*\],\s*(\[[^\]]*\])/g)) CARTE[m[1]] = JSON.parse(m[2]);
}

const slug = c => c.toLowerCase().replace(/\s+/g, "-");
const L = {}, err = [], APC = {}, MODULES = {};
global.VRT_L = (id, o) => { if (L[id]) err.push(`${id} : doublon`); L[id] = o; };
global.VRT_APC = (id, o) => { APC[id] = o; };
global.VRT_MODULES = (k, v) => { MODULES[k] = v; };
/* Exercice d'examen propre à chaque leçon (partie B) : situation chiffrée, consignes, réponse. */
const EXAM = {};
global.VRT_EXAM = (ids, o) => { for (const id of [].concat(ids)) { if (EXAM[id]) err.push(`${id} : exercice d'examen en double`); EXAM[id] = o; } };
/* Situation de vie réécrite (situation, tâche, résolution) : remplace celle de la fiche APC,
   quel que soit l'ordre de lecture des fichiers. Une situation doit donner à l'élève des données
   à exploiter : jamais « un document montre… » sans le document. */
const SIT = {};
global.VRT_SIT = (ids, o) => { for (const id of [].concat(ids)) { if (SIT[id]) err.push(`${id} : situation réécrite en double`); SIT[id] = o; } };
for (const f of fs.readdirSync(src).filter(x => x.endsWith(".js")).sort()) {
  try { eval(fs.readFileSync(path.join(src, f), "utf8")); } catch (e) { err.push(`${f} : ${e.message}`); }
}
for (const [id, o] of Object.entries(SIT)) {
  if (!APC[id]) { err.push(`${id} : situation réécrite pour une leçon sans fiche APC`); continue; }
  for (const k of ["situation", "tache", "resolution"]) if (!o[k]) err.push(`${id} : situation réécrite sans ${k}`);
  Object.assign(APC[id], o);
}

/* Types de labos réellement codés dans apprendre/labo.js */
global.window.VRT = {}; global.document = {};
eval(fs.readFileSync(path.join(APP, "labo.js"), "utf8"));
const TYPES_LABO = new Set(window.VRT.labo.types);
/* Partie B : on ne répète pas la situation de vie de la leçon. On reprend celle de la
   leçon précédente de la même classe et de la même matière (révision) ; pour la première
   leçon, celle de la suivante. Une situation identique (leçons partagées) est sautée. */
const PAR_CM = {};
for (const [id, l] of Object.entries(L)) (PAR_CM[l.c + "/" + l.m] = PAR_CM[l.c + "/" + l.m] || []).push(id);
for (const k in PAR_CM) PAR_CM[k].sort((x, y) => L[x].rang - L[y].rang);
function autreSituation(id) {
  const l = L[id], a = APC[id], ids = PAR_CM[l.c + "/" + l.m], i = ids.indexOf(id);
  const ok = j => { const b = APC[ids[j]]; return b && b.situation !== a.situation && b.tache !== a.tache; };
  for (let j = i - 1; j >= 0; j--) if (ok(j)) return { b: APC[ids[j]], t: L[ids[j]].titre, avant: true };
  for (let j = i + 1; j < ids.length; j++) if (ok(j)) return { b: APC[ids[j]], t: L[ids[j]].titre, avant: false };
  return null;
}
for (const [id, l] of Object.entries(L)) {
  const a = APC[id];
  if (!a) { err.push(`${id} : pas de fiche APC (situation de vie, tâche, labo)`); continue; }
  for (const k of ["situation", "tache", "resolution", "etre", "labo"]) if (!a[k]) err.push(`${id} : APC ${k} manquant`);
  if (EXAM[id] && (!EXAM[id].situation || !Array.isArray(EXAM[id].consignes) || !EXAM[id].consignes.length || !EXAM[id].reponse)) err.push(`${id} : exercice d'examen incomplet`);
  if (a.labo && !TYPES_LABO.has(a.labo.type)) err.push(`${id} : labo inconnu ${a.labo.type}`);
  const m = (MODULES[l.c + "/" + l.m] || []).find(x => x.rangs.some(([d, f]) => l.rang >= d && l.rang <= f));
  if (!m) { err.push(`${id} : rang ${l.rang} sans module APC`); continue; }
  l.apc = { module: m.module, famille: m.famille, agir: m.agir, situation: a.situation, tache: a.tache };
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const sci = ["pct", "physique", "chimie"].includes(l.m), svt = l.m === "svt", q0 = (l.quiz || [])[0] || { q: "", r: [], b: 0, e: "" };
  const ex = EXAM[id];
  const lib1 = svt ? "Évaluation des savoirs (QCM)" : sci ? "Vérification des savoirs" : "Question de cours";
  const lib2 = svt ? "Évaluation des savoir-faire" : sci ? "Application directe des savoirs" : "Exercice";
  const mE = /<em>([\s\S]*?)<\/em>/.exec(l.exo || ""), enonce = String(l.exo || "").replace(/\s*<em>[\s\S]*?<\/em>/, "");
  const cons = l.m === "maths" ? "Tâche" : "Consigne", phrase = l.m === "maths" ? "À l'aide de tes connaissances mathématiques, résous cette tâche." : (svt && /^(Tle|1re)/.test(l.c) ? "Rédige un texte argumenté d'une dizaine de lignes, puis propose un slogan." : "Appuie-toi sur tes connaissances du cours et sur une démarche scientifique : observer, formuler une hypothèse, la vérifier, conclure.");
  l.parties = l.parties.concat([{ t: "Entraînement au format de l'examen", html: "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>" + lib1 + ".</strong> " + esc(q0.q) + "</p><ol type='a'>" + q0.r.map(x => "<li>" + esc(x) + "</li>").join("") + "</ol><details><summary>Voir la réponse</summary><p><strong>" + esc(q0.r[q0.b] || "") + "</strong>. " + esc(q0.e) + "</p></details><p><strong>" + lib2 + ".</strong></p>" + enonce + (mE ? "<details><summary>Voir la réponse</summary><p>" + mE[1] + "</p></details>" : "") + (ex ? "<h3>Partie B : évaluation des compétences</h3>" + (svt ? "<p><strong>Compétence visée.</strong> " + m.agir + ".</p>" : "") + "<p><strong>Situation.</strong> " + ex.situation + "</p>" + ex.consignes.map((c, k) => "<p><strong>" + cons + (ex.consignes.length > 1 ? " " + (k + 1) : "") + ".</strong> " + c + "</p>").join("") + "<details><summary>Voir une réponse attendue</summary><p>" + ex.reponse + "</p></details>" : "") + "</div>", retenir: "Savoir-être mobilisé : " + a.etre + "." }]);
  const q = Math.min(a.partieLabo, l.parties.length - 1);
  if (a.partieLabo === 0) err.push(`${id} : un labo ne va pas dans la partie gratuite`);
  l.parties[q].labo = a.labo;
}

function ligneProg(l) {
  for (const s of CARTE[l.m] || []) for (const ch of ((PROG[l.c] || {})[s] || [])) for (const x of ch[1]) if (x[0] === l.rang) return { officiel: x[1], chap: ch, s };
  return null;
}
function premierDuTrimestre(l) {
  const vus = new Set();
  for (const s of CARTE[l.m] || []) for (const ch of ((PROG[l.c] || {})[s] || [])) {
    if (!vus.has(ch[2])) { vus.add(ch[2]); if (ch[1][0] && ch[1][0][0] === l.rang) return true; }
  }
  return false;
}
function balise(id, html) {
  const pile = [];
  for (const m of html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g)) {
    const n = m[2].toLowerCase();
    if (["br", "img", "hr", "path", "circle", "line", "rect", "polyline", "polygon", "ellipse", "use"].includes(n) || m[3]) continue;
    if (m[1]) { if (pile.pop() !== n) { err.push(`${id} : balise mal fermée </${n}>`); return; } }
    else pile.push(n);
  }
  if (pile.length) err.push(`${id} : balise non fermée <${pile.pop()}>`);
}

for (const [id, l] of Object.entries(L)) {
  if (!/^[a-z0-9][a-z0-9-]{2,80}$/.test(id)) err.push(`${id} : identifiant invalide`);
  for (const k of ["c", "m", "rang", "titre", "accroche", "intro", "objectifs", "parties", "revision", "exo", "quiz"]) if (!l[k]) err.push(`${id} : ${k} manquant`);
  if (err.length && !l.parties) continue;
  if (!ligneProg(l)) err.push(`${id} : rang ${l.rang} absent de ${l.c}/${l.m}`);
  if ((l.parties || []).length < 3) err.push(`${id} : il faut au moins 3 parties`);
  if ((l.quiz || []).length < 4) err.push(`${id} : il faut au moins 4 questions`);
  (l.quiz || []).forEach((q, i) => { if (!(q.b >= 0 && q.b < q.r.length)) err.push(`${id} : quiz ${i} bonne réponse hors liste`); if (!q.e) err.push(`${id} : quiz ${i} sans explication`); });
  (l.parties || []).forEach(p => { balise(id, p.html || ""); if (p.retenir) balise(id, p.retenir); });
  balise(id, l.exo || "");
  if (!/class='def'/.test((l.parties || [{}])[0].html || "")) err.push(`${id} : la 1re partie (visible gratuitement) doit porter la définition`);
  if (!l.apc) err.push(`${id} : fiche APC absente`);
}
if (err.length) { console.error(err.join("\n")); console.error(`\n${err.length} erreur(s) : rien n'a été écrit.`); process.exit(1); }

const dest = path.join(ftp, "uploads", "protected", "apprendre");
fs.mkdirSync(dest, { recursive: true });
for (const f of fs.readdirSync(dest)) if (f.endsWith(".json")) fs.unlinkSync(path.join(dest, f));
for (const f of fs.readdirSync(APP)) if (/^apercus-.*\.js$/.test(f)) fs.unlinkSync(path.join(APP, f));

const parClasse = {}; let libres = 0, payantes = 0;
for (const [id, l] of Object.entries(L)) {
  const gratuit = !!l.gratuit || premierDuTrimestre(l);
  let pub;
  if (gratuit) { pub = { ...l, gratuit: true }; libres++; }
  else {
    pub = { ...l, verrou: true, nq: l.quiz.length, revision: [], exo: "", quiz: [],
      labo: l.parties.some(p => p.labo), parties: [l.parties[0]].concat(l.parties.slice(1).map(p => ({ t: p.t, verrou: true }))) };
    fs.writeFileSync(path.join(dest, id + ".json"), JSON.stringify({ parties: l.parties.slice(1), revision: l.revision, exo: l.exo, quiz: l.quiz }));
    payantes++;
  }
  (parClasse[l.c] = parClasse[l.c] || []).push(`VRT_L(${JSON.stringify(id)},${JSON.stringify(pub)});`);
}

const empreintes = {};
for (const [c, lignes] of Object.entries(parClasse)) {
  const corps = "/* Fichier GÉNÉRÉ par tools/build_apprendre_payant.cjs : début public des leçons. */\n" + lignes.join("\n") + "\n";
  fs.writeFileSync(path.join(APP, `apercus-${slug(c)}.js`), corps);
  empreintes[c] = crypto.createHash("sha1").update(corps).digest("hex").slice(0, 8);
}
const charge = `/* Fichier GÉNÉRÉ par tools/build_apprendre_payant.cjs. Charge les leçons de la classe affichée. */
(function(){var D=${JSON.stringify(empreintes)},q=new URLSearchParams(location.search),c=q.get("c"),i=q.get("id")||"",m=/^(3e|1re-[acd]|tle-[acd])-/.exec(i);
if(m&&!c){c=m[1].replace(/^(1re|tle)-(.)/,function(x,a,b){return (a==="tle"?"Tle":"1re")+" "+b.toUpperCase()})}
if(!c){try{c=JSON.parse(localStorage.getItem("vrt_app_classe")||"null")}catch(e){}}
if(!c&&!i)c="3e";
if(c&&D[c])document.write('<script src="apercus-'+c.toLowerCase().replace(/\\s+/g,"-")+'.js?v='+D[c]+'"><\\/script>');})();
`;
fs.writeFileSync(path.join(APP, "charge.js"), charge);
const v = crypto.createHash("sha1").update(charge).digest("hex").slice(0, 8);
for (const p of ["index.html", "matiere.html", "lecon.html"]) {
  const f = path.join(APP, p), t = fs.readFileSync(f, "utf8"), n = t.replace(/charge\.js\?v=[0-9a-z]+/, "charge.js?v=" + v);
  if (!/charge\.js\?v=/.test(t)) { console.error(`${p} ne charge pas charge.js`); process.exit(1); }
  fs.writeFileSync(f, n);
}
console.log(`${Object.keys(L).length} leçons : ${libres} gratuites, ${payantes} à verrou.`);
for (const c of Object.keys(parClasse)) console.log(`  ${c} : ${parClasse[c].length}`);
console.log(`Dépôt FTP : ${dest}`);
