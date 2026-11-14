#!/usr/bin/env node
/* Construit les leçons à verrou de l'espace Apprendre.
   Sources : <dossier>/*.js (appels VRT_L), HORS DÉPÔT : le dépôt est public.
   Produit :
     apprendre/apercus-<classe>.js          début public des leçons, leçons gratuites entières
     apprendre/charge.js                    charge le bon fichier selon la classe
     <ftp>/uploads/protected/apprendre/*.json   suite payante, à déposer par FTP
   Usage : node tools/build_apprendre_payant.cjs <dossier_sources> <dossier_ftp> [--ajout=4e,5e]
   --ajout (13/11/2026) : AJOUTE ou met à jour les leçons des classes citées, sans rien effacer.
     Sans lui, le build repart de zéro : il supprime TOUS les apercus-*.js et tous les JSON
     protégés, puis réécrit ceux de ses sources. Avec un lot de sources partiel (une classe
     neuve, un module), il aurait effacé les autres classes. En mode ajout :
       - seules les classes citées sont écrites ; une leçon déjà publiée dans apercus-<classe>.js
         et absente des sources est CONSERVÉE (les lots s'ajoutent les uns aux autres) ;
       - le dossier FTP ne reçoit que les JSON du lot, rien n'y est supprimé ;
       - charge.js garde les empreintes des autres classes.
   Une erreur de contenu arrête tout : mieux vaut pas de build qu'une leçon cassée. */
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const ARGS = process.argv.slice(2), OPT_AJOUT = (ARGS.find(a => a.startsWith("--ajout=")) || "").slice(8);
const [src, ftp] = ARGS.filter(a => !a.startsWith("--"));
const AJOUT = OPT_AJOUT ? new Set(OPT_AJOUT.split(",").map(x => x.trim()).filter(Boolean)) : null;
if (!src || !ftp) { console.error("Usage : node tools/build_apprendre_payant.cjs <sources> <ftp> [--ajout=4e]"); process.exit(2); }
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
/* Banque de QCM au format des examens : 10 questions à 4 choix, chacune [énoncé, bonne réponse,
   leurre, leurre, leurre, explication]. La bonne réponse est rédigée en premier ; sa place tourne
   (a, b, c, d) d'une question à l'autre, pour une répartition équilibrée des lettres. */
const QCM = {};
global.VRT_QCM = (ids, liste) => { for (const id of [].concat(ids)) { if (QCM[id]) err.push(`${id} : QCM en double`); QCM[id] = liste; } };
/* Schéma (13/11/2026) : VRT_ILLUS(id, partie, { legende, svg }) pose un schéma SVG dans une partie
   de la leçon (champ illus, rendu en <figure class="illus"> zoomable). Il voyage dans le JSON
   protégé comme le reste de la partie. Les animations passent par des classes CSS (sv-trace,
   sv-app, sv-puls) : aucune fonction à transporter, et « réduire les animations » est respecté. */
const ILLUS = [];
global.VRT_ILLUS = (id, k, o) => { ILLUS.push([id, k, o]); };
const crc = s => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
function poserQcm(id, liste) {
  if (!Array.isArray(liste) || liste.length !== 10) { err.push(`${id} : il faut exactement 10 QCM (${liste && liste.length})`); return null; }
  const vus = new Set(), dep = crc(id) % 4;
  return liste.map((x, i) => {
    const [q, bonne, f1, f2, f3, e] = x || [];
    const opts = [bonne, f1, f2, f3];
    if (!q || opts.some(o => !String(o || "").trim())) err.push(`${id} : QCM ${i + 1} incomplet`);
    if (new Set(opts.map(o => String(o).trim().toLowerCase())).size !== 4) err.push(`${id} : QCM ${i + 1} a deux choix identiques`);
    if (!e || String(e).length < 15) err.push(`${id} : QCM ${i + 1} sans explication suffisante`);
    if (vus.has(q)) err.push(`${id} : QCM ${i + 1} en double`); vus.add(q);
    const b = (dep + i) % 4, r = [f1, f2, f3]; r.splice(b, 0, bonne);
    return { q, r, b, e };
  });
}
for (const f of fs.readdirSync(src).filter(x => x.endsWith(".js")).sort()) {
  try { eval(fs.readFileSync(path.join(src, f), "utf8")); } catch (e) { err.push(`${f} : ${e.message}`); }
}
for (const [id, liste] of Object.entries(QCM)) { if (!L[id]) { err.push(`${id} : QCM pour une leçon inconnue`); continue; } const q = poserQcm(id, liste); if (q) L[id].quiz = q; }
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
  const sci = ["pct", "physique", "chimie"].includes(l.m), svt = l.m === "svt" || l.m === "sciences", q0 = (l.quiz || [])[0] || { q: "", r: [], b: 0, e: "" };
  const ex = EXAM[id];
  const lib1 = svt ? "Évaluation des savoirs (QCM)" : sci ? "Vérification des savoirs" : "Question de cours";
  const lib2 = svt ? "Évaluation des savoir-faire" : sci ? "Application directe des savoirs" : "Exercice";
  const mE = /<em>([\s\S]*?)<\/em>/.exec(l.exo || ""), enonce = String(l.exo || "").replace(/\s*<em>[\s\S]*?<\/em>/, "");
  const cons = l.m === "maths" ? "Tâche" : "Consigne", phrase = l.m === "maths" ? "À l'aide de tes connaissances mathématiques, résous cette tâche." : (svt && /^(Tle|1re)/.test(l.c) ? "Rédige un texte argumenté d'une dizaine de lignes, puis propose un slogan." : "Appuie-toi sur tes connaissances du cours et sur une démarche scientifique : observer, formuler une hypothèse, la vérifier, conclure.");
  /* Matières littéraires : pas de « Partie A / Partie B » (format APC des épreuves de sciences).
     Chaque discipline reprend la forme de SON épreuve (plateforme/minesec.js pour le français ;
     annales du dépôt pour l'anglais et la philosophie). L'histoire et la géographie GARDENT
     « évaluation des ressources / évaluation des compétences » : c'est le format de leurs épreuves
     APC (Probatoire de géographie 2023, BEPC blancs d'histoire). */
  const LETTRES = { francais: 1, anglais: 1, espagnol: 1, allemand: 1 };
  if (LETTRES[l.m]) {
    const exam = /^3e/.test(l.c) ? "BEPC" : /^1re/.test(l.c) ? "Probatoire" : /^Tle/.test(l.c) ? "Baccalauréat" : "examen";
    const pre = exam === "examen" ? "Vers l'examen" : "Vers le " + exam;
    const T = {
      francais: exam === "BEPC" ? ["Je vérifie mes acquis", "Connaissance et maniement de la langue (format du BEPC)", "Expression écrite (format du BEPC)", "Situation-problème", "Consigne"]
        : ["Je vérifie mes acquis", "Exercice de langue (format de l'épreuve : a. identification, b. analyse)", "Sujet d'entraînement (format de l'épreuve)", "Sujet", "Consigne"],
      /* Espagnol : intitulés des sujets officiels (BEPC 2025, Probatoire A4 2025, Bac A4 2024). */
      espagnol: exam === "BEPC" ? ["Compruebo mis conocimientos", "Estructuras o comunicación (formato del BEPC)", "Comprensión y redacción (formato del BEPC)", "Texto", "Consigna"]
        : exam === "Probatoire" ? ["Compruebo mis conocimientos", "Competencias lingüísticas (formato del Probatoire)", "Comentario dirigido y producción de textos (formato del Probatoire)", "Texto", "Consigna"]
        : ["Compruebo mis conocimientos", "Producción de textos : traducción (formato del Bac)", "Recepción y producción de textos (formato del Bac)", "Texto", "Consigna"],
      /* Allemand LV II : intitulés des sujets officiels (BEPC 2025 : Leseverstehen, Schriftlicher Ausdruck, Strukturen und
         Kommunikation ; Probatoire A4 2025 et Bac A4 2024-2025 : + Mediation). Tutoiement au BEPC, vouvoiement ensuite. */
      allemand: exam === "BEPC" ? ["Überprüfe dein Wissen", "Strukturen und Kommunikation (BEPC-Format)", "Leseverstehen, Mediation und Schriftlicher Ausdruck (BEPC-Format)", "Text", "Aufgabe"]
        : exam === "Probatoire" ? ["Überprüfen Sie Ihr Wissen", "Strukturen und Kommunikation (Format des Probatoire)", "Leseverstehen, Mediation und Schriftlicher Ausdruck (Format des Probatoire)", "Text", "Aufgabe"]
        : ["Überprüfen Sie Ihr Wissen", "Strukturen und Kommunikation (Format des Bac)", "Leseverstehen, Mediation und Schriftlicher Ausdruck (Format des Bac)", "Text", "Aufgabe"],
      anglais: ["Check your knowledge", "Section A: Grammar (" + (exam === "BEPC" ? "BEPC" : exam === "Probatoire" ? "Probatoire" : "Bac") + " format)", "Section D: Composition (" + (exam === "BEPC" ? "BEPC" : exam === "Probatoire" ? "Probatoire" : "Bac") + " format)", "Situation", "Task"]
    }[l.m];
    l.parties = l.parties.concat([{ t: pre, html: "<div class='integ'><h3>" + T[0] + "</h3><p>" + esc(q0.q) + "</p><ol type='a'>" + q0.r.map(x => "<li>" + esc(x) + "</li>").join("") + "</ol><details><summary>Voir la réponse</summary><p><strong>" + esc(q0.r[q0.b] || "") + "</strong>. " + esc(q0.e) + "</p></details><h3>" + T[1] + "</h3>" + enonce + (mE ? "<details><summary>Voir la réponse</summary><p>" + mE[1] + "</p></details>" : "") + (ex ? "<h3>" + (ex.titre || T[2]) + "</h3><p><strong>" + (ex.etiquette || T[3]) + ".</strong> " + ex.situation + "</p>" + ex.consignes.map((c, k) => "<p><strong>" + T[4] + (ex.consignes.length > 1 ? " " + (k + 1) : "") + ".</strong> " + c + "</p>").join("") + "<details><summary>Voir une réponse attendue</summary><p>" + ex.reponse + "</p></details>" : "") + "</div>", retenir: "Savoir-être mobilisé : " + a.etre + "." }]);
  } else if (["histoire", "geo", "ecm", "philo"].includes(l.m)) {
    /* Histoire, géographie, ECM : intitulés des épreuves APC officielles (MINESEC-OBC : Probatoire
       2023 de géographie et d'ECM ; BEPC blancs d'histoire ; Bac A4 2024 de philosophie) : « L'évaluation des ressources »
       (savoirs, savoir-faire) puis « L'évaluation de l'agir compétent », présentation sur 2 points. */
    const bepc = /^3e/.test(l.c);
    /* Sujet complet fourni par la source (documents sourcés, trois tâches, corrigé au barème) :
       affiché tel quel. */
    if (ex && ex.sujet) l.parties = l.parties.concat([{ t: "Entraînement au format de l'examen", html: "<div class='integ'>" + ex.sujet + "</div>", retenir: "Savoir-être mobilisé : " + a.etre + "." }]);
    else
    l.parties = l.parties.concat([{ t: "Entraînement au format de l'examen", html: "<div class='integ'><h3>" + (bepc ? "Partie A : la vérification des ressources" : "Première partie : l'évaluation des ressources") + "</h3><p><strong>" + (l.m === "philo" ? "Question de cours." : bepc ? "A1. Vérification des savoirs." : "Vérification des savoirs.") + "</strong> " + esc(q0.q) + "</p><ol type='a'>" + q0.r.map(x => "<li>" + esc(x) + "</li>").join("") + "</ol><details><summary>Voir la réponse</summary><p><strong>" + esc(q0.r[q0.b] || "") + "</strong>. " + esc(q0.e) + "</p></details><p><strong>" + (l.m === "philo" ? "Exercice." : bepc ? "A2. Vérification des savoir-faire." : "Vérification des savoir-faire.") + "</strong></p>" + enonce + (mE ? "<details><summary>Voir la réponse</summary><p>" + mE[1] + "</p></details>" : "") + (ex ? "<h3>" + (bepc ? "Partie B : la vérification de l'agir compétent" : "Deuxième partie : l'évaluation de l'agir compétent") + "</h3><p><strong>" + (ex.etiquette || (l.m === "philo" ? "Sujet" : "Situation-problème")) + ".</strong> " + ex.situation + "</p>" + ex.consignes.map((c, k) => "<p><strong>" + (ex.consignes.length > 1 ? "Tâche " + (k + 1) : "Consigne") + ".</strong> " + c + "</p>").join("") + "<p><em>Présentation : 2 points.</em></p><details><summary>Voir une réponse attendue</summary><p>" + ex.reponse + "</p></details>" : "") + "</div>", retenir: "Savoir-être mobilisé : " + a.etre + "." }]);
  } else
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

if (AJOUT) for (const [id, l] of Object.entries(L)) if (!AJOUT.has(l.c)) err.push(`${id} : classe ${l.c} hors du lot --ajout=${OPT_AJOUT}`);
for (const [id, k, o] of ILLUS) {
  const l = L[id], p = l && (l.parties || [])[k];
  if (!p) { err.push(`${id} : schéma pour une partie inconnue (${k})`); continue; }
  if (p.illus) { err.push(`${id} : la partie ${k} a déjà un schéma`); continue; }
  const svg = String((o || {}).svg || "");
  if (!(o && String(o.legende || "").length >= 15)) err.push(`${id} : schéma ${k} sans légende suffisante`);
  if (!/^<svg [^>]*viewBox='[^']+'[^>]*role='img'[^>]*aria-label='[^']{10,}'/.test(svg)) err.push(`${id} : schéma ${k} sans viewBox, role='img' ou aria-label`);
  if (/<svg[^>]*\swidth=/.test(svg) || /<script|\son[a-z]+=/i.test(svg)) err.push(`${id} : schéma ${k} à largeur fixe ou avec du script`);
  for (const m of svg.matchAll(/<[a-z]+ [^>]*class='[^']*sv-trace[^>]*>/g)) if (!/pathLength='1'/.test(m[0])) err.push(`${id} : schéma ${k}, tracé animé sans pathLength='1'`);
  balise(id, svg);
  p.illus = { legende: o.legende, svg };
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
if (!AJOUT) {
  for (const f of fs.readdirSync(dest)) if (f.endsWith(".json")) fs.unlinkSync(path.join(dest, f));
  for (const f of fs.readdirSync(APP)) if (/^apercus-.*\.js$/.test(f)) fs.unlinkSync(path.join(APP, f));
}

const parClasse = {}; let libres = 0, payantes = 0;
/* Mode ajout : les leçons déjà publiées de la classe sont reprises telles quelles, À LEUR PLACE ;
   une leçon re-livrée remplace sa ligne au même endroit, une leçon neuve s'ajoute à la fin. */
const ordreExistant = {};
if (AJOUT) for (const c of AJOUT) {
  const f = path.join(APP, `apercus-${slug(c)}.js`);
  if (!fs.existsSync(f)) continue;
  for (const ligne of fs.readFileSync(f, "utf8").split("\n")) {
    const m = /^VRT_L\(("[a-z0-9-]+"),/.exec(ligne);
    if (m) (ordreExistant[c] = ordreExistant[c] || []).push({ id: JSON.parse(m[1]), ligne });
  }
}
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
if (AJOUT) for (const c of Object.keys(ordreExistant)) {
  const neuves = new Map((parClasse[c] || []).map(x => [JSON.parse(/^VRT_L\(("[a-z0-9-]+"),/.exec(x)[1]), x]));
  const fusion = ordreExistant[c].map(e => neuves.has(e.id) ? neuves.get(e.id) : e.ligne);
  const vues = new Set(ordreExistant[c].map(e => e.id));
  for (const [id, x] of neuves) if (!vues.has(id)) fusion.push(x);
  parClasse[c] = fusion;
}

const empreintes = {};
if (AJOUT) {   // les empreintes des autres classes restent celles de charge.js
  const m = /var D=(\{[^}]*\})/.exec(fs.existsSync(path.join(APP, "charge.js")) ? fs.readFileSync(path.join(APP, "charge.js"), "utf8") : "");
  if (m) Object.assign(empreintes, JSON.parse(m[1]));
}
for (const [c, lignes] of Object.entries(parClasse)) {
  const corps = "/* Fichier GÉNÉRÉ par tools/build_apprendre_payant.cjs : début public des leçons. */\n" + lignes.join("\n") + "\n";
  fs.writeFileSync(path.join(APP, `apercus-${slug(c)}.js`), corps);
  empreintes[c] = crypto.createHash("sha1").update(corps).digest("hex").slice(0, 8);
}
const charge = `/* Fichier GÉNÉRÉ par tools/build_apprendre_payant.cjs. Charge les leçons de la classe affichée. */
(function(){var D=${JSON.stringify(empreintes)},q=new URLSearchParams(location.search),c=q.get("c"),i=q.get("id")||"",m=/^(6e|5e|4e|3e|2nde-[ac]|1re-[acd]|tle-[acd])-/.exec(i);
if(m&&!c){c=m[1].replace(/^(2nde|1re|tle)-(.)/,function(x,a,b){return (a==="tle"?"Tle":a)+" "+b.toUpperCase()})}
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
console.log(`${Object.keys(L).length} leçons${AJOUT ? " ajoutées ou mises à jour (mode --ajout)" : ""} : ${libres} gratuites, ${payantes} à verrou.`);
for (const c of Object.keys(parClasse)) console.log(`  ${c} : ${parClasse[c].length}`);
console.log(`Dépôt FTP : ${dest}`);
