/* Briques communes des annales et des épreuves séquentielles (17/11/2026, « enrichis aussi les annales
   et les séquences ») : même dessin que l'en-tête des fiches de méthode (methodes_examens.cjs) et des leçons.
   Styles : tools/methodes/_methode.css (.mx-ent, .mx-puces, .mx-temps, .mx-suite, .mx-voisins). */
"use strict";
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Teinte et icône d'Apprendre (apprendre/commun.js) par matière d'Apprendre.
const TEINTE = { francais: ["Français", "m-francais", "#1E499B", "#DBE8FE"], anglais: ["Anglais", "m-anglais", "#B03A6E", "#FBE4EE"], maths: ["Mathématiques", "m-maths", "#0E7C86", "#DDF2F4"], pct: ["PCT", "m-pct-violet", "#5B4FA8", "#EAE7F7"], physique: ["Physique", "m-pct-violet", "#5B4FA8", "#EAE7F7"], chimie: ["Chimie", "m-pct-orange", "#C24E00", "#FDEBDD"], svt: ["SVTEEHB", "m-svt", "#007E11", "#E0F5E5"], histoire: ["Histoire", "m-histoire", "#A84200", "#FFF3E4"], geo: ["Géographie", "m-geo", "#1E499B", "#DBE8FE"], ecm: ["ECM", "m-ecm", "#9A6F00", "#FFF6DA"], philo: ["Philosophie", "m-philo", "#5B4FA8", "#EAE7F7"], info: ["Informatique", "m-info", "#0C2A6A", "#E4E9F2"], espagnol: ["Espagnol", "m-langues-orange", "#C24E00", "#FDEBDD"], allemand: ["Allemand", "m-langues-bleu", "#1E499B", "#DBE8FE"] };
const SPRITE = "/assets/veritas-matieres.svg?v=20261110g";
const PIC = {
  horloge: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  coef: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  classe: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
  sceau: '<circle cx="12" cy="9" r="6"/><path d="m9 14-2 7 5-3 5 3-2-7"/>',
  crayon: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  liste: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  libre: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
  chrono: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
  bref: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  lire: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  relire: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
};
const pic = (k, t) => '<svg width="' + (t || 15) + '" height="' + (t || 15) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + PIC[k] + "</svg>";
const icoMat = (id, t) => '<svg width="' + t + '" height="' + t + '" aria-hidden="true"><use href="' + SPRITE + "#" + id + '"/></svg>';
const teinte = m => TEINTE[m] || TEINTE.francais;

/* En-tête carte : médaille de la matière, pastille, ligne « Matière · … », titre, encadré « L'essentiel »,
   puces [[icône, texte, lien facultatif]]. */
function entete({ mat, badge, ligne, titre, chapo, puces }) {
  const T = teinte(mat);
  return '<header class="mx-ent" style="--mt:' + T[2] + ";--mt-pale:" + T[3] + '"><div class="mx-ent-haut"><div class="mx-med">' + icoMat(T[1], 44) +
    '</div><div class="mx-tags"><span class="badge">' + esc(badge) + '</span><span class="mx-mat">' + ligne + "</span></div></div>\n<h1>" + esc(titre) + "</h1>\n" +
    (chapo ? '<div class="mx-bref"><p class="mx-bref-t">' + pic("bref", 14) + 'L\'essentiel</p><p class="mx-chapo">' + chapo + "</p></div>\n" : "") +
    '<div class="mx-puces">' + puces.filter(Boolean).map(([k, t, u]) => u ? '<a href="' + u + '">' + pic(k) + t + "</a>" : "<span>" + pic(k) + t + "</span>").join("") + "</div></header>\n";
}

/* Plan de temps illustré : lecture du sujet, traitement, relecture (arrondis à 5 min). */
const hm = m => m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + String(m % 60).padStart(2, "0") : "") : m + " min";
function planTemps(min) {
  if (!(min >= 30)) return "";
  const r5 = x => Math.max(5, Math.round(x / 5) * 5);
  const lire = r5(min * 0.1), relire = r5(min * 0.12), faire = min - lire - relire;
  const P = [["t-lire", "lire", "Lire le sujet", lire, "En entier, consignes soulignées, barème repéré."], ["t-faire", "crayon", "Traiter", faire, "Commence par ce que tu maîtrises, garde le barème en tête."], ["t-relire", "relire", "Relire", relire, "Unités, accords, réponses encadrées, nom sur chaque copie."]];
  return '<div class="mx-temps"><p class="mx-temps-t">' + pic("chrono", 16) + "Ton plan de temps pour " + hm(min) + '</p><div class="mx-temps-barre" aria-hidden="true">' +
    P.map(p => '<i class="' + p[0] + '" style="flex:' + p[3] + '"></i>').join("") + '</div><ol class="mx-temps-l">' +
    P.map(p => '<li class="' + p[0] + '"><b>' + pic(p[1], 15) + p[2] + " · " + hm(p[3]) + "</b><span>" + p[4] + "</span></li>").join("") + "</ol></div>";
}

// Précédent / suivant (boutons des leçons) et pastilles « les autres épreuves ».
function suite(prec, suiv) {
  if (!prec && !suiv) return "";
  return '<nav class="mx-suite" aria-label="Épreuves voisines">' +
    (prec ? '<a href="' + prec.u + '"><span class="mx-fl">‹</span><span><small>' + esc(prec.mot) + "</small>" + esc(prec.ti) + "</span></a>" : "") +
    (suiv ? '<a class="mx-suiv" href="' + suiv.u + '"><span><small>' + esc(suiv.mot) + "</small>" + esc(suiv.ti) + '</span><span class="mx-fl">›</span></a>' : "") + "</nav>\n";
}
function voisins(titre, liens) {
  if (!liens.length) return "";
  return '<div class="mx-voisins"><p>' + esc(titre) + "</p><div>" + liens.map(l => { const T = teinte(l.mat); return '<a href="' + l.u + '" style="--c:' + T[2] + '">' + icoMat(T[1], 24) + esc(l.ti) + "</a>"; }).join("") + "</div></div>\n";
}

module.exports = { esc, TEINTE, teinte, pic, icoMat, entete, planTemps, suite, voisins, hm };
