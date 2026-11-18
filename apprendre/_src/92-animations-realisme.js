/* Animations — réalisme, lot 20 (18/11/2026) : l'explorateur de cellules en haute définition remplace l'animation simple
   « Clique sur un organite » de 90-animations-sciences.js (ce fichier est chargé APRÈS 90 et 91). Dessins : 28-realisme-premiers-lots.js. */
(function () {
  "use strict";
  var C = window.VRT_CELLULES, VERT = "#17784D";
  if (!C) return;
  VRT_A("tle-sc-organites", 1, "Explore les deux cellules : clique sur un organite", function (el) {
    var type = "ani", choix = null;
    el.innerHTML = "<div style='display:flex;gap:6px;flex-wrap:wrap'><button type='button' class='btn-l' data-t='ani'>Cellule animale</button><button type='button' class='btn-l' data-t='veg'>Cellule végétale</button></div><div data-g style='margin:8px 0'></div><div data-b style='display:flex;gap:5px;flex-wrap:wrap'></div><p class='labo-r' data-r>Choisis un organite.</p>";
    var LISTE = { ani: ["membrane", "noyau", "nucleole", "mito", "rer", "rel", "golgi", "vesicule", "lysosome", "centrosome", "ribosomes"], veg: ["paroi", "plasmodesme", "membrane", "vacuole", "chloroplaste", "noyau", "nucleole", "mito", "rer", "golgi", "ribosomes"] };
    function maj() {
      el.querySelector("[data-g]").innerHTML = "<svg viewBox='130 20 380 400' style='max-width:520px;width:100%' role='img' aria-label='Cellule interactive'><defs>" + C.DEFC + "</defs>" + (type === "ani" ? C.animale(true) : C.vegetale(true)) + "</svg>";
      el.querySelector("[data-b]").innerHTML = LISTE[type].map(function (o) { return "<button type='button' class='btn-l' data-o='" + o + "' style='" + (o === choix ? "background:#1E499B;color:#fff" : "") + "'>" + C.ORG[o][0].replace(/ \(.*\)/, "") + "</button>"; }).join("");
      if (choix) el.querySelectorAll("[data-g] [data-o]").forEach(function (g) { g.style.opacity = g.getAttribute("data-o") === choix || (choix === "noyau" && g.getAttribute("data-o") === "nucleole") ? "1" : "0.18"; });
      el.querySelectorAll("[data-b] [data-o]").forEach(function (b) { b.addEventListener("click", function () { choix = b.dataset.o; el.querySelector("[data-r]").innerHTML = "<b>" + C.ORG[choix][0] + "</b> : " + C.ORG[choix][1]; maj(); }); });
    }
    el.querySelectorAll("[data-t]").forEach(function (b) { b.addEventListener("click", function () { type = b.dataset.t; choix = null; el.querySelector("[data-r]").textContent = "Choisis un organite."; maj(); }); });
    maj();
  });
})();

/* Zoom HD de la cellule jusqu'au gène (remplace la version simple de 90-animations-sciences.js) */
(function () {
  "use strict";
  var C = window.VRT_CELLULES;
  if (!C || !C.chromosome) return;
  function T(x, y, t, o) { o = o || {}; return "<text x='" + x + "' y='" + y + "' text-anchor='" + (o.a || "middle") + "' font-size='" + (o.s || 13) + "' font-weight='" + (o.w || 700) + "' fill='" + (o.c || "#001136") + "' stroke='#fff' stroke-width='3' paint-order='stroke'>" + t + "</text>"; }
  var BASES = { A: "#E8A33D", T: "#2F6DB5", G: "#2E9E5B", C: "#C0392B" }, PAIRE = { A: "T", T: "A", G: "C", C: "G" };
  var SEQ = "ATGCGTACCGATTACGGCTAAGCTTGCAAT";
  var ET = [
    ["Cellule", "Une cellule du corps humain au microscope électronique : le noyau (en violet) contient l'information héréditaire.", function () {
      return "<svg viewBox='130 30 400 380' role='img' aria-label='Cellule animale avec le noyau encadré'><defs>" + C.DEFC + "</defs>" + C.animale(true) + "<ellipse cx='310' cy='214' rx='78' ry='68' fill='none' stroke='#F7C948' stroke-width='4' stroke-dasharray='10 6'/>" + T(310, 304, "noyau", { s: 16 }) + "</svg>";
    }],
    ["Noyau", "Au moment de la division, l'ADN du noyau se condense : on voit alors 46 chromosomes (23 paires), l'enveloppe du noyau disparaît.", function () {
      var s = "<svg viewBox='0 0 640 380' role='img' aria-label='Noyau en division avec 46 chromosomes'><defs>" + C.DEFC + "</defs><rect width='640' height='380' fill='#FBFAF8'/><ellipse cx='320' cy='190' rx='250' ry='170' fill='url(#noy)' opacity='.55'/><ellipse cx='320' cy='190' rx='250' ry='170' fill='none' stroke='#6D4FA0' stroke-width='2' stroke-dasharray='8 8'/>", k, n = 0;
      for (k = 0; k < 46; k++) {
        var i = k % 23, num = Math.min(i, 21), a = k * 2.399, r = 26 + 132 * Math.sqrt((k + 0.5) / 46), x = 320 + r * Math.cos(a) * 1.35, y = 190 + r * Math.sin(a) * 0.85, len = i === 22 ? 156 : C.LONG[num];
        s += "<g transform='translate(" + x.toFixed(0) + " " + y.toFixed(0) + ") rotate(" + ((k * 47) % 180 - 90) + ") scale(.95)'>" + C.chromosome(0, len * 0.18, len, i === 22 ? 0.39 : C.CENT[num], 500 + k, "#C7B5DA") + "</g>";
      }
      return s + T(320, 370, "46 chromosomes condensés", { s: 15 }) + "</svg>";
    }],
    ["Chromosome", "Un chromosome condensé : deux chromatides identiques, reliées par le centromère. Chacune est un long filament d'ADN très enroulé.", function () {
      var s = "<svg viewBox='0 0 640 380' role='img' aria-label='Un chromosome agrandi avec ses deux chromatides, son centromère et un filament d’ADN qui se déroule'><rect width='640' height='380' fill='#FBFAF8'/><g transform='translate(320 362) scale(3.6)'>" + C.chromosome(0, 0, 249 * 0.92, 0.46, 77, "#C7B5DA") + "</g>";
      var d = "M362 74", k; for (k = 0; k < 40; k++) d += "q" + (6 + k * 0.3) + " " + (k % 2 ? 8 : -8) + " " + (10 + k * 0.4) + " " + (k % 2 ? -2 : 2);
      s += "<path d='" + d + "' stroke='#5E4A78' stroke-width='2' fill='none'/>" + T(560, 60, "filament d'ADN", { s: 13, c: "#5E4A78" });
      s += "<path d='M268 120H200' stroke='#3D4A5C'/>" + T(196, 124, "chromatide", { a: "end" }) + "<path d='M334 202H420' stroke='#3D4A5C'/>" + T(424, 206, "centromère", { a: "start" }) + "<path d='M272 300H200' stroke='#3D4A5C'/>" + T(196, 304, "bandes (régions de l'ADN)", { a: "end", s: 12 });
      return s + "</svg>";
    }],
    ["ADN et gène", "Déroulé, l'ADN est une double hélice : deux brins reliés par des paires de bases (A avec T, G avec C). Un gène est un segment de cette molécule.", function () {
      var s = "<svg viewBox='0 0 640 300' role='img' aria-label='Double hélice d’ADN avec ses paires de bases colorées et un gène encadré'><rect width='640' height='300' fill='#FBFAF8'/>", k, N = SEQ.length, X = function (i) { return 30 + i * 19.5; };
      s += "<rect x='" + (X(9) - 10) + "' y='40' width='" + (X(20) - X(9) + 20) + "' height='200' rx='12' fill='#F7C948' opacity='.22'/>" + T((X(9) + X(20)) / 2, 30, "un gène", { s: 15, c: "#8A6A10" });
      for (k = 0; k < N; k++) {
        var x = X(k), ph = k * 0.55, y1 = 140 + 70 * Math.sin(ph), y2 = 140 - 70 * Math.sin(ph), b = SEQ[k], p = PAIRE[b], ym = (y1 + y2) / 2, avant = Math.cos(ph) > 0;
        s += "<line x1='" + x + "' y1='" + y1.toFixed(1) + "' x2='" + x + "' y2='" + ym.toFixed(1) + "' stroke='" + BASES[b] + "' stroke-width='5' opacity='" + (avant ? 1 : 0.55) + "'/><line x1='" + x + "' y1='" + ym.toFixed(1) + "' x2='" + x + "' y2='" + y2.toFixed(1) + "' stroke='" + BASES[p] + "' stroke-width='5' opacity='" + (avant ? 1 : 0.55) + "'/>";
      }
      ["1", "2"].forEach(function (br, j) { var d = "", t; for (t = 0; t <= (N - 1) * 4; t++) { var i = t / 4, ph = i * 0.55, y = 140 + (j ? -1 : 1) * 70 * Math.sin(ph); d += (t ? "L" : "M") + X(i).toFixed(1) + " " + y.toFixed(1); } s += "<path d='" + d + "' stroke='" + (j ? "#1E3F7A" : "#4A2E7A") + "' stroke-width='7' fill='none' stroke-linecap='round'/>"; });
      for (k = 0; k < N; k += 3) s += T(X(k), 270, SEQ[k], { s: 12, c: BASES[SEQ[k]] });
      s += Object.keys(BASES).map(function (b, i) { return "<rect x='" + (430 + i * 50) + "' y='278' width='12' height='12' rx='3' fill='" + BASES[b] + "'/>" + T(452 + i * 50, 289, b, { s: 12, a: "start" }); }).join("");
      return s + T(140, 292, "A-T et G-C : bases complémentaires", { s: 11, w: 600 }) + "</svg>";
    }]
  ];
  VRT_A("3e-svt-adn", 3, "Zoome de la cellule jusqu'au gène", function (el) {
    el.innerHTML = "<div style='display:flex;gap:6px;flex-wrap:wrap'>" + ET.map(function (e, i) { return "<button type='button' class='btn-l' data-i='" + i + "'>" + (i + 1) + ". " + e[0] + "</button>"; }).join("") + "</div><div data-g style='margin:8px 0;max-width:620px'></div><p class='labo-r' data-t></p>";
    function aff(i) {
      el.querySelector("[data-g]").innerHTML = ET[i][2]().replace("<svg ", "<svg style='width:100%' ");
      el.querySelector("[data-t]").textContent = ET[i][1];
      el.querySelectorAll("[data-i]").forEach(function (b, k) { b.style.background = k === i ? "#1E499B" : ""; b.style.color = k === i ? "#fff" : ""; });
    }
    el.querySelectorAll("[data-i]").forEach(function (b) { b.addEventListener("click", function () { aff(+b.dataset.i); }); });
    aff(0);
  });
})();
