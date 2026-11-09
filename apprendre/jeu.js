/* VÉRITAS — Apprendre : couche ludique (points, niveaux, badges, objectif du jour, mascotte, confettis).
   07/11/2026. Mémoire LOCALE (ce navigateur) : confort de l'élève, rien n'est envoyé.
   Animations : transform / opacity seulement, déclenchées par un événement ; coupées si
   « réduire les animations » est demandé. Aucun émoji : tout est dessiné en SVG. */
(function (W) {
  "use strict";
  var A = W.VRT && W.VRT.app; if (!A) return;
  var reduit = W.matchMedia && W.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- barème et niveaux ---------- */
  var GAIN = { lecon: 20, etoile: 10, defi: 5, jour: 5 };
  var NIVEAUX = [[0, "Apprenti"], [100, "Explorateur"], [300, "Savant"], [700, "Érudit"], [1500, "Maître VÉRITAS"]];
  function niveau(xp) {
    var i = 0; while (i + 1 < NIVEAUX.length && xp >= NIVEAUX[i + 1][0]) i++;
    var bas = NIVEAUX[i][0], haut = NIVEAUX[i + 1] ? NIVEAUX[i + 1][0] : bas;
    return { rang: i + 1, nom: NIVEAUX[i][1], xp: xp, bas: bas, haut: haut, pct: haut > bas ? (xp - bas) / (haut - bas) : 1, suivant: NIVEAUX[i + 1] ? NIVEAUX[i + 1][1] : null };
  }

  /* ---------- badges (médailles SVG originales) ---------- */
  var BADGES = [
    ["premiere", "Premier pas", "Lire ta première leçon jusqu'au bout", "#1E499B", "#EDF2FB", "livre"],
    ["cinq", "Lecteur assidu", "Lire 5 leçons", "#0E7C86", "#E9F5F6", "livre"],
    ["dix", "Bibliothèque vivante", "Lire 10 leçons", "#5B4FA8", "#F0EDF9", "livre"],
    ["parfait", "Sans faute", "Réussir un quiz à 100 %", "#9A6F00", "#FFF3CC", "etoile"],
    ["trois-parfaits", "Triple étoile", "Trois quiz parfaits", "#C24E00", "#FDF1E8", "etoile"],
    ["serie3", "Régulier", "Apprendre 3 jours de suite", "#C24E00", "#FDF1E8", "flamme"],
    ["serie7", "Inarrêtable", "Apprendre 7 jours de suite", "#B03A6E", "#FBEFF4", "flamme"],
    ["explorateur", "Explorateur", "Lire des leçons dans 5 matières", "#007E11", "#EAF6EC", "boussole"],
    ["scientifique", "Petit scientifique", "Lire 3 leçons de sciences", "#007E11", "#EAF6EC", "fiole"],
    ["polyglotte", "Polyglotte", "Lire des leçons dans 3 langues", "#B03A6E", "#FBEFF4", "bulle"],
    ["defi", "Relève le défi", "Réussir 10 questions du défi express", "#1E499B", "#EDF2FB", "eclair"],
    ["objectif", "Objectif atteint", "Remplir l'objectif du jour", "#0E7C86", "#E9F5F6", "cible"]
  ];
  var PICTO = {
    livre: '<path d="M7 11.5c2.4-.8 4.6-.5 6.6 1v10c-2-1.5-4.2-1.8-6.6-1zM25 11.5c-2.4-.8-4.6-.5-6.6 1v10c2-1.5 4.2-1.8 6.6-1z"/>',
    etoile: '<path d="m16 8.5 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8z"/>',
    flamme: '<path d="M16 24.5c-3.4 0-5.7-2.3-5.7-5.5 0-2.4 1.3-3.8 2.4-5.2.2 1.4.9 2.4 1.9 2.8-.5-3.5 1.2-6.6 3.9-8.4-.3 2.7.9 4.4 2.3 6 1.1 1.3 1.6 2.9 1.6 4.5 0 3.4-2.7 5.8-6.4 5.8z"/><path d="M16 24.5c-1.5 0-2.5-1-2.5-2.4 0-1.6 1.3-2.4 2-3.9 1.2 1.1 3 1.9 3 3.9 0 1.4-1 2.4-2.5 2.4z"/>',
    boussole: '<circle cx="16" cy="16" r="7.5"/><path d="M16 10.5 18 16h-4zM16 21.5 14 16h4z"/>',
    fiole: '<path d="M13.5 8.5h5M14.3 8.5v5l-4.3 7.4A1.5 1.5 0 0 0 11.3 23h9.4a1.5 1.5 0 0 0 1.3-2.1l-4.3-7.4v-5"/>',
    bulle: '<path d="M9 9.5h14a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-7l-4 3v-3H9A1.5 1.5 0 0 1 7.5 18v-7A1.5 1.5 0 0 1 9 9.5z"/>',
    eclair: '<path d="M17.5 7.5 10.5 17h5l-1 7.5 7-9.5h-5z"/>',
    cible: '<circle cx="16" cy="16" r="7.5"/><circle cx="16" cy="16" r="3.8"/><circle cx="16" cy="16" r=".9"/>'
  };
  function medaille(b, acquis, taille) {
    taille = taille || 64;
    var c = acquis ? b[3] : "#C9CFDD", p = acquis ? b[4] : "#F5F7FB";
    return '<svg width="' + taille + '" height="' + (taille * 1.18) + '" viewBox="0 0 32 38" aria-hidden="true">' +
      '<path d="M10 25 7 36l5-2.5L15 37l2-11zM22 25l3 11-5-2.5L17 37l-2-11z" fill="' + (acquis ? "#FFC93C" : "#DCE1EA") + '" stroke="' + (acquis ? "#9A6F00" : "#C9CFDD") + '" stroke-width=".8" stroke-linejoin="round"/>' +
      '<circle cx="16" cy="16" r="13" fill="' + p + '" stroke="' + c + '" stroke-width="2.2"/>' +
      '<circle cx="16" cy="16" r="10.2" fill="#fff" stroke="' + c + '" stroke-width=".8" stroke-dasharray="1.6 1.4"/>' +
      '<g fill="none" stroke="' + c + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + PICTO[b[5]] + '</g></svg>';
  }

  /* ---------- mascotte : Kalao, le calao de VÉRITAS (dessin original, 07/11/2026) ----------
     Ce qui fait un calao : un très long bec courbé SURMONTÉ D'UN CASQUE, un corps sombre avec une
     bande claire, un cercle coloré autour de l'œil. Vu de trois quarts, tourné vers la droite. */
  function mascotte(humeur, taille) {
    taille = taille || 96;
    var oeil = humeur === "bravo"
      ? '<path d="M41.5 34.5q3.2-3.6 6.4 0" fill="none" stroke="#001136" stroke-width="2.4" stroke-linecap="round"/>'
      : '<circle cx="44.7" cy="33.5" r="3.3" fill="#001136"/><circle cx="45.8" cy="32.4" r="1.1" fill="#fff"/>';
    return '<svg class="kalao kalao-' + (humeur || "salut") + '" width="' + taille + '" height="' + taille + '" viewBox="0 0 100 100" aria-hidden="true">' +
      '<ellipse cx="44" cy="94" rx="24" ry="4" fill="#001136" opacity=".08"/>' +
      /* queue */ '<path d="M22 70c-8 4-13 12-14 20 7-2 13-7 17-14z" fill="#0C2A6A"/><path d="M15 84c3-2 5-4 7-7" stroke="#F5F7FB" stroke-width="2.4" stroke-linecap="round"/>' +
      /* pattes */ '<path d="M38 88v5M50 88v5M34 93h8M46 93h8" stroke="#C24E00" stroke-width="3" stroke-linecap="round"/>' +
      /* corps */ '<path d="M44 38c14 0 22 12 22 27 0 14-9 25-22 25S20 79 20 64c0-15 9-26 24-26z" fill="#0C2A6A"/>' +
      /* bande claire du ventre */ '<path d="M44 56c9 0 14 6 14 13 0 9-6 16-14 16-7 0-12-6-12-13 0-9 5-16 12-16z" fill="#F5F7FB"/>' +
      /* aile */ '<g class="kalao-aile"><path d="M24 58c-6 6-7 17-2 24 6-3 9-11 8-20z" fill="#1E499B"/><path d="M23 66c1 4 1 8 0 12" stroke="#9FBEEA" stroke-width="1.6" stroke-linecap="round"/></g>' +
      /* tête */ '<circle cx="45" cy="33" r="15" fill="#0C2A6A"/>' +
      /* cercle autour de l'œil */ '<circle cx="45" cy="33.5" r="6.4" fill="#FFC93C"/><circle cx="45" cy="33.5" r="4.6" fill="#fff"/>' + oeil +
      /* casque sur le bec */ '<path d="M53 24c6-5 16-6 24-3 4 2 6 5 6 8-8-3-18-3-27 0z" fill="#FFC93C" stroke="#C24E00" stroke-width="1.5" stroke-linejoin="round"/>' +
      /* bec : long, courbé vers le bas */ '<path d="M56 30c10-3 22-2 30 3 5 3 7 8 6 13-6-6-16-9-27-9-4 0-7-1-9-3z" fill="#FFC93C" stroke="#C24E00" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M58 34c9-1 18 1 25 5" fill="none" stroke="#C24E00" stroke-width="1.2" stroke-linecap="round"/>' +
      '<path d="M86 34c3 2 5 6 6 12" fill="none" stroke="#C24E00" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>' +
      (humeur === "bravo" ? '<g fill="#FFC93C"><path d="m14 22 1.6 3.4 3.4 1.6-3.4 1.6L14 32l-1.6-3.4L9 27l3.4-1.6z"/><path d="m88 60 1.2 2.6 2.6 1.2-2.6 1.2L88 68l-1.2-2.8-2.6-1.2 2.6-1.2z"/><path d="m30 10 1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/></g>' : '') +
      '</svg>';
  }

  /* ---------- état ---------- */
  function etat() { return { xp: A.lire("xp", 0), badges: A.lire("badges", {}), obj: A.lire("objectif", {}), defi: A.lire("defi_ok", 0) }; }
  function lus() { return A.lire("lus", {}); }

  /* ---------- objectif du jour : 1 leçon + 1 quiz ---------- */
  function objectif() { var o = A.lire("objectif", {}), j = A.jour(); if (o.j !== j) o = { j: j, lecon: 0, quiz: 0, fait: false }; return o; }
  function avancerObjectif(type) {
    var o = objectif(); o[type] = 1; A.ecrire("objectif", o);
    if (o.lecon && o.quiz && !o.fait) { o.fait = true; A.ecrire("objectif", o); gagner(15, "Objectif du jour atteint"); debloquer("objectif"); }
    majChips();
  }

  /* ---------- gains ---------- */
  function gagner(n, raison) {
    var avant = niveau(A.lire("xp", 0)), xp = A.lire("xp", 0) + n; A.ecrire("xp", xp);
    var apres = niveau(xp);
    toast('<b>+' + n + ' points</b><span>' + raison + '</span>', "xp");
    if (apres.rang > avant.rang) setTimeout(function () { celebrer("Nouveau niveau : " + apres.nom, "Continue, " + (apres.suivant ? "prochain palier : " + apres.suivant : "tu as atteint le sommet") + ".", "bravo"); }, 900);
    majChips();
  }
  function debloquer(id) {
    var b = A.lire("badges", {}); if (b[id]) return; b[id] = Date.now(); A.ecrire("badges", b);
    var def = BADGES.filter(function (x) { return x[0] === id; })[0]; if (!def) return;
    setTimeout(function () { celebrer("Badge débloqué : " + def[1], def[2], "bravo", medaille(def, true, 70)); }, 600);
  }
  function verifierBadges() {
    var L = lus(), ids = Object.keys(L), LE = W.VRT_LECONS || {}, q = A.lire("quiz", {}), s = A.serie();
    var mats = {}, sci = 0, lang = {};
    ids.forEach(function (k) { var x = LE[k]; if (!x) return; mats[x.m] = 1; if (/^(maths|pct|svt|sciences|info)$/.test(x.m)) sci++; if (/^(anglais|allemand|espagnol|italien|chinois|arabe|latin|grec)$/.test(x.m)) lang[x.m] = 1; });
    var parfaits = Object.keys(q).filter(function (k) { return q[k][0] === q[k][1]; }).length;
    if (ids.length >= 1) debloquer("premiere"); if (ids.length >= 5) debloquer("cinq"); if (ids.length >= 10) debloquer("dix");
    if (parfaits >= 1) debloquer("parfait"); if (parfaits >= 3) debloquer("trois-parfaits");
    if (s >= 3) debloquer("serie3"); if (s >= 7) debloquer("serie7");
    if (Object.keys(mats).length >= 5) debloquer("explorateur"); if (sci >= 3) debloquer("scientifique"); if (Object.keys(lang).length >= 3) debloquer("polyglotte");
    if (A.lire("defi_ok", 0) >= 10) debloquer("defi");
  }

  /* ---------- événements venant des pages ---------- */
  function leconLue(id) { var deja = A.lire("xp_lecons", {}); if (deja[id]) return; deja[id] = 1; A.ecrire("xp_lecons", deja); gagner(GAIN.lecon, "Leçon lue jusqu'au bout"); avancerObjectif("lecon"); verifierBadges(); }
  function quizFini(id, bons, total) {
    var et = bons === total ? 3 : bons >= Math.ceil(total * .6) ? 2 : bons > 0 ? 1 : 0;
    var meil = A.lire("xp_quiz", {}), avant = meil[id] || 0;
    if (et > avant) { meil[id] = et; A.ecrire("xp_quiz", meil); gagner((et - avant) * GAIN.etoile, et + " étoile" + (et > 1 ? "s" : "") + " au quiz"); }
    if (et >= 1) avancerObjectif("quiz");
    if (et === 3) confettis();
    verifierBadges();
  }
  function defiReussi() { A.ecrire("defi_ok", A.lire("defi_ok", 0) + 1); gagner(GAIN.defi, "Bonne réponse au défi"); verifierBadges(); }
  function jourCompte() { var j = A.lire("xp_jours", {}), a = A.jour(); if (j[a]) return; j[a] = 1; A.ecrire("xp_jours", j); if (A.serie() > 1) gagner(GAIN.jour, A.serie() + " jours de suite"); verifierBadges(); }

  /* ---------- interface : pastille de niveau dans la barre du haut ---------- */
  function anneau(pct, taille, couleur) {
    var r = 15, c = 2 * Math.PI * r;
    return '<svg width="' + taille + '" height="' + taille + '" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="' + r + '" fill="none" stroke="#E6EAF2" stroke-width="4"/><circle cx="18" cy="18" r="' + r + '" fill="none" stroke="' + (couleur || "#1E499B") + '" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + (c * pct).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 18 18)"/></svg>';
  }
  function majChips() {
    var n = niveau(A.lire("xp", 0));
    document.querySelectorAll("[data-niveau]").forEach(function (el) {
      el.innerHTML = '<span class="niv-anneau">' + anneau(n.pct, 30) + '<b>' + n.rang + '</b></span><span class="niv-txt"><b>' + n.nom + '</b><small>' + n.xp + ' pts</small></span>';
      el.title = n.nom + " · " + n.xp + " points" + (n.suivant ? " · encore " + (n.haut - n.xp) + " pour « " + n.suivant + " »" : "");
    });
    var o = objectif(), z = document.getElementById("objectifJour");
    if (z) {
      var f = (o.lecon ? 1 : 0) + (o.quiz ? 1 : 0);
      z.innerHTML = '<div class="obj-anneau">' + anneau(f / 2, 64, f === 2 ? "#007E11" : "#FFC93C") + '<b>' + f + '/2</b></div><div><small>Objectif du jour</small><p><span class="' + (o.lecon ? "ok" : "") + '">' + A.pic(o.lecon ? "coche" : "livre", 16) + ' Lire une leçon</span><span class="' + (o.quiz ? "ok" : "") + '">' + A.pic(o.quiz ? "coche" : "etoile", 16) + ' Réussir un quiz</span></p></div>';
    }
  }

  /* ---------- toasts, célébration, confettis ---------- */
  var pile;
  function toast(html, cls) {
    if (!pile) { pile = document.createElement("div"); pile.className = "jeu-toasts"; pile.setAttribute("role", "status"); document.body.appendChild(pile); }
    var t = document.createElement("div"); t.className = "jeu-toast " + (cls || ""); t.innerHTML = html; pile.appendChild(t);
    setTimeout(function () { t.classList.add("sort"); setTimeout(function () { t.remove(); }, 400); }, 2600);
  }
  /* une célébration à la fois : les suivantes attendent leur tour */
  var fileFete = [], feteOuverte = false;
  function celebrer(titre, texte, humeur, visuel) {
    fileFete.push([titre, texte, humeur, visuel]); if (!feteOuverte) suivanteFete();
  }
  function suivanteFete() {
    var f = fileFete.shift(); if (!f) { feteOuverte = false; return; } feteOuverte = true;
    ouvrirFete(f[0], f[1], f[2], f[3]);
  }
  function ouvrirFete(titre, texte, humeur, visuel) {
    var d = document.createElement("div"); d.className = "jeu-fete"; d.setAttribute("role", "dialog"); d.setAttribute("aria-label", titre);
    d.innerHTML = '<div class="jeu-fete-c">' + (visuel || mascotte(humeur || "bravo", 110)) + '<h3>' + titre + '</h3><p>' + texte + '</p><button type="button">Continuer</button></div>';
    document.body.appendChild(d); confettis();
    var b = d.querySelector("button"); b.focus();
    var ferme = false;
    function fermer() { if (ferme) return; ferme = true; d.classList.add("sort"); setTimeout(function () { d.remove(); suivanteFete(); }, 250); }
    b.addEventListener("click", fermer); d.addEventListener("click", function (e) { if (e.target === d) fermer(); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape") fermer(); });
  }
  function confettis() {
    if (reduit) return;
    var c = document.createElement("div"); c.className = "jeu-confettis"; c.setAttribute("aria-hidden", "true");
    var cols = ["#1E499B", "#FFC93C", "#0E7C86", "#B03A6E", "#007E11", "#C24E00", "#5B4FA8"], h = "";
    for (var i = 0; i < 70; i++) {
      var x = Math.random() * 100, d = 1.6 + Math.random() * 1.4, r = Math.random() * 720 - 360, dx = Math.random() * 30 - 15;
      h += '<i style="left:' + x + '%;background:' + cols[i % cols.length] + ';animation-duration:' + d + 's;animation-delay:' + (Math.random() * .3) + 's;--r:' + r + 'deg;--dx:' + dx + 'vw;' + (i % 3 ? "" : "border-radius:50%;") + '"></i>';
    }
    c.innerHTML = h; document.body.appendChild(c); setTimeout(function () { c.remove(); }, 3400);
  }

  /* ---------- bulle de la mascotte (pages leçon) ---------- */
  function bulle(el, texte, humeur) {
    if (!el) return;
    el.innerHTML = '<div class="kalao-bulle">' + mascotte(humeur || "salut", 78) + '<p>' + texte + '</p></div>';
  }

  W.VRT.jeu = { niveau: niveau, BADGES: BADGES, medaille: medaille, mascotte: mascotte, anneau: anneau, majChips: majChips, leconLue: leconLue, quizFini: quizFini,
    defiReussi: defiReussi, jourCompte: jourCompte, verifierBadges: verifierBadges, confettis: confettis, celebrer: celebrer, toast: toast, bulle: bulle, objectif: objectif };
  document.addEventListener("DOMContentLoaded", function () { jourCompte(); majChips(); });
  if (document.readyState !== "loading") { jourCompte(); majChips(); }
})(window);
