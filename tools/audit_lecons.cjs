#!/usr/bin/env node
/* Audit des leçons d'Apprendre (18/11/2026, consignes de Jacques) :
   « Toutes les leçons doivent résoudre la situation-problème de départ, avec les formules et les étapes de la leçon,
     illustrer par des exemples, donner les formules, les détails précis, les astuces, et des planches animées en 2D et 3D. »
   Pour chaque leçon de lecons.js : situation de départ, situation résolue (étapes + réponse rédigée), formules, exemples,
   astuces (astuce, attention, le savais-tu, méthode), planches 2D et 3D, simulations.
   Usage : node tools/audit_lecons.cjs            # tableau des leçons incomplètes
           node tools/audit_lecons.cjs --tout     # toutes les leçons
           node tools/audit_lecons.cjs --json     # sortie JSON
           node tools/audit_lecons.cjs --payant <dossier des .json> [--classe "Tle D"] [--matiere svt]
             (19/11/2026) leçons à verrou : début public (apprendre/apercus-*.js) + suite payante (.json déposés par FTP,
             fusionnés comme verrou.js) ; un labo compte comme simulation ; une leçon sans .json n'est jugée que sur son début. */
const fs = require("fs"), path = require("path");
global.window = global; global.document = { addEventListener() {}, querySelector() { return null; } };
const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const PAY = arg("--payant"), CL = arg("--classe"), MAT = arg("--matiere");
let L;
if (PAY) {
  L = {}; global.VRT_L = (id, o) => { L[id] = Object.assign({ id }, o); };
  const app = path.join(__dirname, "..", "apprendre");
  for (const f of fs.readdirSync(app).filter(f => /^apercus-.*\.js$/.test(f))) require(path.join(app, f));
  for (const [id, l] of Object.entries(L)) {
    if ((CL && l.c !== CL) || (MAT && l.m !== MAT)) { delete L[id]; continue; }
    const j = path.join(PAY, id + ".json");
    if (l.verrou && fs.existsSync(j)) { const s = JSON.parse(fs.readFileSync(j, "utf8")); l.parties = [l.parties[0]].concat(s.parties || []); if (s.denouement) l.denouement = s.denouement; l.verrou = false; }
  }
} else { require(path.join(__dirname, "..", "apprendre", "lecons.js")); L = window.VRT_LECONS; }
const tout = process.argv.includes("--tout"), json = process.argv.includes("--json");
function compte(h, re) { return (h.match(re) || []).length; }
const lignes = [];
for (const [id, l] of Object.entries(L)) {
  const parties = l.parties || [], html = parties.map(p => p.html || "").join(" ") + " " + JSON.stringify(l.denouement || {}) + " " + (l.intro || "");
  /* seules les planches affichables comptent : un objet avec un titre et un dessin (svg, modele 3D ou ref) */
  const pl = parties.flatMap(p => p.planches || []).filter(x => x && typeof x === "object" && x.titre && (x.svg || x.modele || x.ref));
  const D = l.denouement || {};
  const r = {
    id, classe: l.c, matiere: l.m, titre: l.titre,
    situation: !!l.enquete || !!l.apc,
    resolue: !!(D.reponse && (D.etapes || []).length >= 2),
    etapesFormules: (D.formules || []).length,
    formules: compte(html, /class=['"]formule['"]/g) + compte(html, /class=['"]def['"]/g),
    exemples: compte(html, /class=['"]ex['"]/g),
    astuces: compte(html, /class=['"](astuce|attention|savais|methode|retiens)['"]/g),
    p2d: pl.filter(p => (p.type || "2D").toLowerCase() !== "3d").length,
    p3d: pl.filter(p => (p.type || "").toLowerCase() === "3d").length,
    anim: parties.filter(p => p.anim || p.labo).length, suite: !l.verrou
  };
  r.manque = [];
  if (!r.situation) r.manque.push("situation de départ");
  if (!r.resolue) r.manque.push("situation résolue (étapes + réponse)");
  if (r.etapesFormules < 2) r.manque.push("résolution par formules étape par étape");
  if (r.formules < 2) r.manque.push("formules/définitions");
  if (r.exemples < 2) r.manque.push("exemples");
  if (r.astuces < 2) r.manque.push("astuces");
  if (r.p2d < 2) r.manque.push("planches 2D");
  if (r.p3d < 1) r.manque.push("planche 3D");
  if (r.anim < 1) r.manque.push("simulation");
  lignes.push(r);
}
const aff = tout ? lignes : lignes.filter(r => r.manque.length);
if (json) { console.log(JSON.stringify(aff, null, 1)); process.exit(0); }
aff.sort((a, b) => b.manque.length - a.manque.length || a.id.localeCompare(b.id));
for (const r of aff) console.log(r.id.padEnd(40), PAY ? (r.suite ? "suite lue " : "début seul") : "", "F" + r.formules, "E" + r.exemples, "A" + r.astuces, "2D" + r.p2d, "3D" + r.p3d, "S" + r.anim, "R" + r.etapesFormules, r.resolue ? "résolue" : "NON RÉSOLUE", "|", r.manque.join(", "));
console.log("\n" + lignes.length + " leçons ; " + lignes.filter(r => !r.manque.length).length + " complètes ; " + lignes.filter(r => r.manque.length).length + " à enrichir.");
