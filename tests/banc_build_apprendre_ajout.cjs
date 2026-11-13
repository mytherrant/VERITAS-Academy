#!/usr/bin/env node
/* Banc du 13/11/2026 : le mode --ajout de tools/build_apprendre_payant.cjs n'efface rien.
   Sans lui, un build repart de zéro et supprime tous les apercus-*.js : lancé avec les
   seules sources d'une classe neuve, il aurait fait disparaître les leçons de 3e, 1re et Tle.
   On travaille sur une COPIE jetable (tools/ + apprendre/), avec des leçons fictives.
     node tests/banc_build_apprendre_ajout.cjs */
const fs = require("fs"), path = require("path"), os = require("os"), { execFileSync } = require("child_process");
const RAC = path.dirname(__dirname);
let ok = 0, ko = 0;
const verifie = (c, nom, detail) => { if (c) { ok++; console.log("  \x1b[32m✓\x1b[0m " + nom); } else { ko++; console.log("  \x1b[31m✗ " + nom + "\x1b[0m" + (detail ? "\n      " + detail : "")); } };

const T = fs.mkdtempSync(path.join(os.tmpdir(), "vrt-ajout-"));
fs.cpSync(path.join(RAC, "tools", "build_apprendre_payant.cjs"), path.join(T, "tools", "build_apprendre_payant.cjs"));
fs.cpSync(path.join(RAC, "apprendre"), path.join(T, "apprendre"), { recursive: true });
const APP = path.join(T, "apprendre"), FTP = path.join(T, "ftp");
const lire = f => fs.readFileSync(path.join(APP, f), "utf8");
const autres = fs.readdirSync(APP).filter(f => /^apercus-.*\.js$/.test(f) && f !== "apercus-4e.js");
const avant = Object.fromEntries(autres.map(f => [f, lire(f)]));
const chargeAvant = /var D=(\{[^}]*\})/.exec(lire("charge.js"))[1];

/* Une leçon fictive de 4e, conforme au contrôle du build (rang réel de la progression). */
function lecon(id, rang, titre) {
  const q = Array.from({ length: 10 }, (_, i) => [`Question ${i + 1} de ${id} ?`, "bonne", "leurre un", "leurre deux", "leurre trois", "Explication suffisamment longue."]);
  return `VRT_L(${JSON.stringify(id)}, { c: "4e", m: "maths", rang: ${rang}, duree: 15, titre: ${JSON.stringify(titre)}, accroche: "Accroche.", intro: "Intro.",
  objectifs: ["un objectif"], parties: [{ t: "Définition", html: "<div class='def'><b>Définition</b>Texte.</div>" }, { t: "Deux", html: "<p>Deux.</p>" }, { t: "Trois", html: "<p>Trois.</p>" }],
  revision: ["à retenir"], exo: "<p>Exercice. <em>(Réponse : 1.)</em></p>" });
VRT_APC(${JSON.stringify(id)}, { situation: "Situation.", tache: "Tâche.", resolution: "Résolution.", etre: "la rigueur", labo: { type: "trier", items: [["A", "a"]] }, partieLabo: 1 });
VRT_QCM(${JSON.stringify(id)}, ${JSON.stringify(q)});\n`;
}
const MOD = `VRT_MODULES("4e/maths", [{ module: "M", famille: "F", agir: "A", rangs: [[1, 53]] }]);\n`;
function build(sources, ajout) {
  const src = fs.mkdtempSync(path.join(T, "src-"));
  fs.writeFileSync(path.join(src, "00.js"), MOD + sources);
  return execFileSync(process.execPath, [path.join(T, "tools", "build_apprendre_payant.cjs"), src, FTP].concat(ajout ? ["--ajout=" + ajout] : []), { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

console.log("\n\x1b[1m① Premier lot de 4e\x1b[0m");
fs.writeFileSync(path.join(APP, "apercus-4e.js"), "/* vide */\n");
build(lecon("4e-maths-zz02", 2, "Leçon A"), "4e");
verifie(autres.every(f => lire(f) === avant[f]), `les ${autres.length} autres apercus-*.js sont intacts`);
verifie(/"4e-maths-zz02"/.test(lire("apercus-4e.js")), "la leçon du lot est publiée dans apercus-4e.js");
const D1 = JSON.parse(/var D=(\{[^}]*\})/.exec(lire("charge.js"))[1]);
verifie(Object.entries(JSON.parse(chargeAvant)).every(([c, h]) => c === "4e" || D1[c] === h), "charge.js garde les empreintes des autres classes");
verifie(!!D1["4e"], "charge.js connaît la 4e");
verifie(fs.existsSync(path.join(FTP, "uploads/protected/apprendre/4e-maths-zz02.json")), "la suite protégée part dans le dossier FTP");

console.log("\n\x1b[1m② Second lot : le premier est conservé\x1b[0m");
build(lecon("4e-maths-zz03", 3, "Leçon B"), "4e");
const a4 = lire("apercus-4e.js");
verifie(/"4e-maths-zz02"/.test(a4) && /"4e-maths-zz03"/.test(a4), "les deux lots sont présents");
verifie(fs.existsSync(path.join(FTP, "uploads/protected/apprendre/4e-maths-zz02.json")), "le JSON du premier lot n'est pas supprimé");
build(lecon("4e-maths-zz03", 3, "Leçon B corrigée"), "4e");
verifie((lire("apercus-4e.js").match(/"4e-maths-zz03"/g) || []).length === 1 && /Leçon B corrigée/.test(lire("apercus-4e.js")), "une leçon re-livrée est mise à jour, sans doublon");

console.log("\n\x1b[1m③ Garde-fous\x1b[0m");
let refus = "";
try { build(lecon("4e-maths-zz04", 4, "Hors lot"), "5e"); } catch (e) { refus = String(e.stderr || e.message); }
verifie(/hors du lot/.test(refus), "une leçon d'une classe absente de --ajout est refusée");
verifie(/2nde-\[ac\]/.test(lire("charge.js")) && /\(6e\|5e\|4e\|3e/.test(lire("charge.js")), "charge.js reconnaît les identifiants de 6e à la 2nde");

fs.rmSync(T, { recursive: true, force: true });
console.log("\n" + (ko ? `\x1b[31m${ko} échec(s) sur ${ok + ko}\x1b[0m` : `\x1b[32m${ok} vérification(s) au vert\x1b[0m`));
process.exit(ko ? 1 : 0);
