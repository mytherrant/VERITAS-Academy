#!/usr/bin/env node
/* Banc du 13/11/2026 : les schémas, cartes et labos de l'espace Apprendre sont branchés
   au bon endroit et peuvent s'agrandir.
     - chaque animation VRT_A vise une leçon et une partie qui existent ;
     - chaque illustration SVG a une viewBox (sans elle, ni agrandissement ni zoom) ;
     - aucune illustration n'impose une largeur fixe (width="…") qui l'empêcherait de suivre l'écran ;
     - chaque labo visible est d'un type réellement codé dans labo.js ;
     - commun.js porte bien la mise à l'échelle lisible et le bouton « Agrandir ».
   La lisibilité réelle (texte ≥ 11 px sur 390 px) a été mesurée au navigateur le 13/11/2026.
     node tests/banc_apprendre_schemas.cjs */
const fs = require("fs"), path = require("path");
const APP = path.join(path.dirname(__dirname), "apprendre");
let ok = 0, ko = 0;
const verifie = (c, nom, detail) => { if (c) { ok++; console.log("  \x1b[32m✓\x1b[0m " + nom); } else { ko++; console.log("  \x1b[31m✗ " + nom + "\x1b[0m" + (detail ? "\n      " + detail : "")); } };

global.window = {}; global.document = {};
let code = fs.readFileSync(path.join(APP, "lecons.js"), "utf8")
  .replace(/function VRT_A\(id, i, titre, fn\) \{/, "function VRT_A(id, i, titre, fn) { (window.__VA = window.__VA || []).push([id, i, titre]);");
for (const f of fs.readdirSync(APP).filter(f => /^apercus-.*\.js$/.test(f))) code += ";\n" + fs.readFileSync(path.join(APP, f), "utf8");
(new Function("window", "document", code))(window, document);
const L = window.VRT_LECONS;
window.VRT = {}; eval(fs.readFileSync(path.join(APP, "labo.js"), "utf8"));
const TYPES = new Set(window.VRT.labo.types);

const anims = window.__VA || [];
const orph = anims.filter(([id, i]) => !L[id] || !L[id].parties[i]);
verifie(anims.length > 0 && orph.length === 0, `${anims.length} animations, toutes rattachées à une leçon et une partie existantes`, orph.map(a => a.join(" #")).join(" ; "));

let svgs = 0; const sansVB = [], fixe = [], labos = [], inconnus = [];
for (const [id, x] of Object.entries(L)) x.parties.forEach((p, k) => {
  for (const s of ((p.html || "") + (p.illus ? p.illus.svg : "")).match(/<svg[^>]*>/g) || []) {
    svgs++;
    if (!/viewBox/i.test(s)) sansVB.push(id + " #" + k);
    if (/\swidth=['"]\d+/.test(s) && !/aria-hidden/.test(s)) fixe.push(id + " #" + k);
  }
  if (p.labo) { labos.push(id); if (!TYPES.has(p.labo.type)) inconnus.push(id + " : " + p.labo.type); }
});
verifie(svgs > 0 && sansVB.length === 0, `${svgs} illustrations SVG, toutes avec une viewBox`, sansVB.slice(0, 10).join(" ; "));
verifie(fixe.length === 0, "aucune illustration à largeur fixe", fixe.slice(0, 10).join(" ; "));
verifie(labos.length > 0 && inconnus.length === 0, `${labos.length} labos visibles, tous d'un type codé`, inconnus.join(" ; "));

const commun = fs.readFileSync(path.join(APP, "commun.js"), "utf8"), css = fs.readFileSync(path.join(APP, "apprendre.css"), "utf8");
verifie(/function lisible\(/.test(commun) && /LISIBLE_PX = 11/.test(commun), "mise à l'échelle lisible des schémas (texte ≥ 11 px)");
verifie(/function agrandir\(/.test(commun) && /btn-zoom/.test(css), "bouton « Agrandir » et fenêtre de zoom");
verifie(/\.illus \.sv-trace\{[^}]*backwards/.test(css) && /\.illus \.sv-app\{[^}]*backwards/.test(css), "schémas animés : l'état final est l'état par défaut (rien de caché sans animation)");
verifie(/\.carte pre\{[^}]*overflow-x:auto/.test(css), "les blocs de code défilent dans la carte (pas de débordement de page)");

console.log("\n" + (ko ? `\x1b[31m${ko} échec(s) sur ${ok + ko}\x1b[0m` : `\x1b[32m${ok} vérification(s) au vert\x1b[0m`));
process.exit(ko ? 1 : 0);
