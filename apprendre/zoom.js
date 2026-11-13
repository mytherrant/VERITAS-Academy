/* Apprendre — agrandir un schéma ou une carte (figure.illus) en plein écran.
   Clic (ou Entrée) sur la figure : visionneuse avec zoom (molette, pincement, boutons, double-clic)
   et déplacement (glisser). Échap ou × pour fermer. Délégation : marche aussi pour les parties
   injectées après coup (verrou.js). */
(function () {
  "use strict";
  var ouvert = null;
  function preparer(fig) {
    if (fig.getAttribute("data-zoom")) return;
    fig.setAttribute("data-zoom", "1"); fig.setAttribute("tabindex", "0"); fig.setAttribute("role", "button");
    var cap = fig.querySelector("figcaption"); fig.setAttribute("aria-label", "Agrandir le schéma" + (cap ? " : " + cap.textContent.slice(0, 120) : ""));
  }
  function tout() { var f = document.querySelectorAll("figure.illus"); for (var i = 0; i < f.length; i++) preparer(f[i]); }
  function ouvrir(fig) {
    var svg = fig.querySelector("svg"); if (!svg || ouvert) return;
    var cap = fig.querySelector("figcaption");
    var o = document.createElement("div"); o.className = "zoom-voile"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Schéma agrandi");
    o.innerHTML = '<div class="zoom-barre"><button type="button" data-z="moins" aria-label="Dézoomer">−</button><button type="button" data-z="raz" aria-label="Taille initiale">1:1</button><button type="button" data-z="plus" aria-label="Zoomer">+</button><button type="button" data-z="fermer" class="zoom-x" aria-label="Fermer">×</button></div>' +
      '<div class="zoom-scene"><div class="zoom-plan"></div></div>' + (cap ? '<p class="zoom-leg"></p>' : "") + '<p class="zoom-aide">Molette ou pincement pour zoomer · glisser pour déplacer · double-clic pour agrandir</p>';
    var plan = o.querySelector(".zoom-plan"), scene = o.querySelector(".zoom-scene");
    var copie = svg.cloneNode(true); copie.removeAttribute("width"); copie.removeAttribute("height"); plan.appendChild(copie);
    if (cap) o.querySelector(".zoom-leg").textContent = cap.textContent;
    document.body.appendChild(o); document.documentElement.classList.add("zoom-actif");
    var k = 1, tx = 0, ty = 0, pts = {}, d0 = 0, k0 = 1, glisse = null;
    function poser() { k = Math.max(1, Math.min(8, k)); if (k === 1) { tx = 0; ty = 0; } plan.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + k + ")"; scene.style.cursor = k > 1 ? "grab" : "zoom-in"; }
    function zoomVers(nk, cx, cy) { var r = scene.getBoundingClientRect(), px = cx - r.left - r.width / 2, py = cy - r.top - r.height / 2; nk = Math.max(1, Math.min(8, nk));
      tx = px - (px - tx) * nk / k; ty = py - (py - ty) * nk / k; k = nk; poser(); }
    function centre() { var r = scene.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
    scene.addEventListener("wheel", function (e) { e.preventDefault(); zoomVers(k * (e.deltaY < 0 ? 1.2 : 1 / 1.2), e.clientX, e.clientY); }, { passive: false });
    scene.addEventListener("dblclick", function (e) { zoomVers(k < 2.5 ? k * 2 : 1, e.clientX, e.clientY); });
    scene.addEventListener("pointerdown", function (e) { scene.setPointerCapture(e.pointerId); pts[e.pointerId] = [e.clientX, e.clientY];
      var ids = Object.keys(pts); if (ids.length === 2) { var a = pts[ids[0]], b = pts[ids[1]]; d0 = Math.hypot(a[0] - b[0], a[1] - b[1]); k0 = k; glisse = null; } else glisse = [e.clientX - tx, e.clientY - ty]; });
    scene.addEventListener("pointermove", function (e) { if (!pts[e.pointerId]) return; pts[e.pointerId] = [e.clientX, e.clientY]; var ids = Object.keys(pts);
      if (ids.length === 2 && d0) { var a = pts[ids[0]], b = pts[ids[1]]; zoomVers(k0 * Math.hypot(a[0] - b[0], a[1] - b[1]) / d0, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); }
      else if (glisse && k > 1) { tx = e.clientX - glisse[0]; ty = e.clientY - glisse[1]; poser(); } });
    function lacher(e) { delete pts[e.pointerId]; if (Object.keys(pts).length < 2) d0 = 0; glisse = null; }
    scene.addEventListener("pointerup", lacher); scene.addEventListener("pointercancel", lacher);
    o.addEventListener("click", function (e) { var b = e.target.closest("[data-z]"); if (b) { var z = b.getAttribute("data-z"), c = centre();
        if (z === "fermer") fermer(); else if (z === "raz") { k = 1; poser(); } else zoomVers(k * (z === "plus" ? 1.5 : 1 / 1.5), c[0], c[1]); return; }
      if (e.target === o) fermer(); });
    function clavier(e) { if (e.key === "Escape") fermer(); else if (e.key === "+" || e.key === "=") { var c = centre(); zoomVers(k * 1.5, c[0], c[1]); } else if (e.key === "-") { var c2 = centre(); zoomVers(k / 1.5, c2[0], c2[1]); } }
    document.addEventListener("keydown", clavier);
    function fermer() { document.removeEventListener("keydown", clavier); o.remove(); document.documentElement.classList.remove("zoom-actif"); ouvert = null; fig.focus(); }
    ouvert = o; poser(); o.querySelector(".zoom-x").focus();
  }
  document.addEventListener("click", function (e) { var f = e.target.closest && e.target.closest("figure.illus"); if (f && !e.target.closest("a,button,input,label")) { preparer(f); ouvrir(f); } });
  document.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches("figure.illus[data-zoom]")) { e.preventDefault(); ouvrir(e.target); } });
  if (window.MutationObserver) new MutationObserver(tout).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState !== "loading") tout(); else document.addEventListener("DOMContentLoaded", tout);
})();
