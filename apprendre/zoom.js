/* Apprendre — agrandir un schéma ou une carte en plein écran.
   Clic (ou Entrée) sur la figure : visionneuse avec zoom (molette, pincement, boutons, double-clic)
   et déplacement (glisser). Échap ou × pour fermer. Délégation : marche aussi pour les parties
   injectées après coup (verrou.js).
   25/11/2026 « rends aussi les cartes mentales zoomables » : les cartes mentales (div.cm, dessinées par
   apprendre/_src/00-carte-mentale.js) s'agrandissent aussi, dans les leçons, les pages d'œuvres et
   l'application. Le script est AUTONOME (il pose son propre style) : les pages d'œuvres n'ont pas
   apprendre.css. Une carte porte deux dessins (étoile .cm-large, arbre .cm-etroit au téléphone) :
   la visionneuse agrandit celui qui est affiché. La copie est posée hors de .cm : les animations de
   tracé ne s'y rejouent pas et rien n'y est caché. */
(function () {
  "use strict";
  if (window.VRT_ZOOM) return;   /* chargé deux fois (application) : une seule délégation */
  window.VRT_ZOOM = true;
  var CIBLE = "figure.illus, .cm", ouvert = null;
  var ICO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23142554' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7'/%3E%3C/svg%3E";
  function style() {
    if (document.getElementById("zoomCss")) return;
    var s = document.createElement("style"); s.id = "zoomCss";
    s.textContent = "html.zoom-actif{overflow:hidden}" +
      ".zoom-voile{position:fixed;inset:0;z-index:9999;background:rgba(10,16,38,.92);display:flex;flex-direction:column;padding:10px;font-family:inherit}" +
      ".zoom-barre{display:flex;gap:8px;justify-content:flex-end}" +
      ".zoom-barre button{min-width:44px;height:44px;border-radius:12px;border:0;background:#fff;color:#142554;font:700 18px/1 system-ui,sans-serif;cursor:pointer}" +
      ".zoom-barre .zoom-x{background:#FFC93C}" +
      ".zoom-scene{flex:1;overflow:hidden;display:flex;align-items:center;justify-content:center;touch-action:none;cursor:zoom-in;border-radius:14px;background:#FBFAF7;margin-top:8px}" +
      ".zoom-plan{width:100%;height:100%;display:flex;align-items:center;justify-content:center;transform-origin:center center}" +
      ".zoom-plan svg{display:block!important;width:100%;height:100%;max-width:none;max-height:none}" +
      ".zoom-leg{color:#fff;text-align:center;font-size:14px;margin:8px 0 0}" +
      ".zoom-aide{color:#C9D6E2;text-align:center;font-size:12px;margin:4px 0 0}" +
      /* la carte mentale annonce qu'elle s'agrandit : curseur et pastille « Agrandir » */
      ".cm[data-zoom]{position:relative;cursor:zoom-in}" +
      ".cm[data-zoom]::after{content:'Agrandir';position:absolute;top:8px;right:8px;padding:5px 10px 5px 28px;border-radius:999px;background:#fff url(\"" + ICO + "\") 9px center/14px no-repeat;" +
      "color:#142554;font:600 12.5px/1.2 system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,17,54,.16);pointer-events:none}" +
      ".cm[data-zoom]:focus-visible{outline:3px solid #FFC93C;outline-offset:3px}" +
      "@media print{.cm[data-zoom]::after{display:none}}";
    document.head.appendChild(s);
  }
  function estCarte(fig) { return fig.classList && fig.classList.contains("cm"); }
  function preparer(fig) {
    if (fig.getAttribute("data-zoom")) return;
    fig.setAttribute("data-zoom", "1"); fig.setAttribute("tabindex", "0"); fig.setAttribute("role", "button");
    var cap = fig.querySelector("figcaption");
    fig.setAttribute("aria-label", estCarte(fig) ? "Agrandir la carte mentale" : "Agrandir le schéma" + (cap ? " : " + cap.textContent.slice(0, 120) : ""));
  }
  function tout() { style(); var f = document.querySelectorAll(CIBLE); for (var i = 0; i < f.length; i++) preparer(f[i]); }
  /* le dessin à agrandir : celui qu'on voit (carte mentale : étoile sur grand écran, arbre au téléphone,
     qui remplit la hauteur de la visionneuse), sinon le premier */
  function dessin(fig) {
    var t = fig.querySelectorAll("svg");
    for (var i = 0; i < t.length; i++) if (t[i].getBoundingClientRect().width > 0) return t[i];
    return t[0] || null;
  }
  function ouvrir(fig) {
    var svg = dessin(fig); if (!svg || ouvert) return;
    style();
    var cap = fig.querySelector("figcaption"), carte = estCarte(fig);
    var o = document.createElement("div"); o.className = "zoom-voile"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", carte ? "Carte mentale agrandie" : "Schéma agrandi");
    o.innerHTML = '<div class="zoom-barre"><button type="button" data-z="moins" aria-label="Dézoomer">−</button><button type="button" data-z="raz" aria-label="Taille initiale">1:1</button><button type="button" data-z="plus" aria-label="Zoomer">+</button><button type="button" data-z="fermer" class="zoom-x" aria-label="Fermer">×</button></div>' +
      '<div class="zoom-scene"><div class="zoom-plan"></div></div>' + (cap ? '<p class="zoom-leg"></p>' : "") + '<p class="zoom-aide">Molette ou pincement pour zoomer · glisser pour déplacer · double-clic pour agrandir</p>';
    var plan = o.querySelector(".zoom-plan"), scene = o.querySelector(".zoom-scene");
    var copie = svg.cloneNode(true); copie.removeAttribute("width"); copie.removeAttribute("height"); copie.removeAttribute("style"); plan.appendChild(copie);
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
  document.addEventListener("click", function (e) { var f = e.target.closest && e.target.closest(CIBLE); if (f && !e.target.closest("a,button,input,label,select,textarea")) { preparer(f); ouvrir(f); } });
  document.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches("figure.illus[data-zoom], .cm[data-zoom]")) { e.preventDefault(); ouvrir(e.target); } });
  if (window.MutationObserver) new MutationObserver(tout).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState !== "loading") tout(); else document.addEventListener("DOMContentLoaded", tout);
})();
