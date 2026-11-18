#!/usr/bin/env node
/* Ajoute aux apercus-<classe>.js du DÉPÔT le début public des leçons produites par build_apprendre_payant.cjs dans une copie,
   dans un bloc balisé (remplacé à chaque passage), puis met à jour les empreintes de charge.js. Les 2 000 leçons existantes
   ne sont pas touchées. Usage : node integrer.cjs <copie/apprendre> <depot/apprendre> <nom du lot> */
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const [copie, depot, lot] = process.argv.slice(2);
const DEB = `/* ═══ AJOUT ${lot} (hors build principal : source à verser dans le dossier des sources) ═══ */`, FIN = `/* ═══ FIN ${lot} ═══ */`;
const touchees = [];
for (const f of fs.readdirSync(copie).filter(f => /^apercus-.*\.js$/.test(f))) {
  const L = []; global.window = global; global.VRT_L = (id, o) => L.push([id, o]);
  eval(fs.readFileSync(path.join(copie, f), "utf8"));
  const cible = path.join(depot, f); if (!fs.existsSync(cible)) { console.error("absent du dépôt :", f); process.exit(1); }
  let t = fs.readFileSync(cible, "utf8");
  const re = new RegExp("\\n?" + DEB.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?" + FIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\n?");
  t = t.replace(re, "\n");
  const ids = new Set(L.map(x => x[0]));
  for (const id of ids) if (t.includes(`VRT_L(${JSON.stringify(id)},`)) { console.error("déjà présent dans le build principal :", id); process.exit(1); }
  t = t.replace(/\n*$/, "\n") + DEB + "\n" + L.map(([id, o]) => `VRT_L(${JSON.stringify(id)},${JSON.stringify(o)});`).join("\n") + "\n" + FIN + "\n";
  fs.writeFileSync(cible, t); touchees.push(f); console.log(f, "+", L.length, "leçons");
}
/* empreintes de charge.js */
const ch = path.join(depot, "charge.js"); let c = fs.readFileSync(ch, "utf8");
const D = JSON.parse(/var D=(\{[^}]*\})/.exec(c)[1]);
for (const f of touchees) {
  const corps = fs.readFileSync(path.join(depot, f), "utf8");
  const cl = Object.keys(D).find(k => "apercus-" + k.toLowerCase().replace(/\s+/g, "-") + ".js" === f);
  if (cl) D[cl] = crypto.createHash("sha1").update(corps).digest("hex").slice(0, 8);
}
c = c.replace(/var D=\{[^}]*\}/, "var D=" + JSON.stringify(D)); fs.writeFileSync(ch, c);
const v = crypto.createHash("sha1").update(c).digest("hex").slice(0, 8);
for (const p of ["index.html", "matiere.html", "lecon.html"]) { const f = path.join(depot, p); fs.writeFileSync(f, fs.readFileSync(f, "utf8").replace(/charge\.js\?v=[0-9a-z]+/, "charge.js?v=" + v)); }
console.log("charge.js?v=" + v);
