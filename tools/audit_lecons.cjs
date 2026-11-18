#!/usr/bin/env node
/* Audit des leçons d'Apprendre (18/11/2026, consignes de Jacques) :
   « Toutes les leçons doivent résoudre la situation-problème de départ, avec les formules et les étapes de la leçon,
     illustrer par des exemples, donner les formules, les détails précis, les astuces, et des planches animées en 2D et 3D. »
   Pour chaque leçon de lecons.js : situation de départ, situation résolue (étapes + réponse rédigée), formules, exemples,
   astuces (astuce, attention, le savais-tu, méthode), planches 2D et 3D, simulations.
   Usage : node tools/audit_lecons.cjs            # tableau des leçons incomplètes
           node tools/audit_lecons.cjs --tout     # toutes les leçons
           node tools/audit_lecons.cjs --json     # sortie JSON */
const fs = require("fs"), path = require("path");
global.window = global; global.document = { addEventListener() {}, querySelector() { return null; } };
require(path.join(__dirname, "..", "apprendre", "lecons.js"));
const L = window.VRT_LECONS, tout = process.argv.includes("--tout"), json = process.argv.includes("--json");
function compte(h, re) { return (h.match(re) || []).length; }
const lignes = [];
for (const [id, l] of Object.entries(L)) {
  const parties = l.parties || [], html = parties.map(p => p.html || "").join(" ") + " " + JSON.stringify(l.denouement || {}) + " " + (l.intro || "");
  const pl = parties.flatMap(p => p.planches || []);
  const D = l.denouement || {};
  const r = {
    id, classe: l.c, matiere: l.m, titre: l.titre,
    situation: !!l.enquete || !!l.apc,
    resolue: !!(D.reponse && (D.etapes || []).length >= 2),
    formules: compte(html, /class=['"]formule['"]/g) + compte(html, /class=['"]def['"]/g),
    exemples: compte(html, /class=['"]ex['"]/g),
    astuces: compte(html, /class=['"](astuce|attention|savais|methode|retiens)['"]/g),
    p2d: pl.filter(p => (p.type || "2D").toLowerCase() !== "3d").length,
    p3d: pl.filter(p => (p.type || "").toLowerCase() === "3d").length,
    anim: parties.filter(p => p.anim).length
  };
  r.manque = [];
  if (!r.situation) r.manque.push("situation de départ");
  if (!r.resolue) r.manque.push("situation résolue (étapes + réponse)");
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
for (const r of aff) console.log(r.id.padEnd(40), "F" + r.formules, "E" + r.exemples, "A" + r.astuces, "2D" + r.p2d, "3D" + r.p3d, "S" + r.anim, r.resolue ? "résolue" : "NON RÉSOLUE", "|", r.manque.join(", "));
console.log("\n" + lignes.length + " leçons ; " + lignes.filter(r => !r.manque.length).length + " complètes ; " + lignes.filter(r => r.manque.length).length + " à enrichir.");
