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
