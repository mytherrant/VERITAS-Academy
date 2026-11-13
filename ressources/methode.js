/* Fiches de méthode (ressources/*.html) : sommaire actif et barre de lecture,
   comme dans les leçons d'Apprendre. Copié en ressources/methode.js par
   tools/methodes_examens.cjs (jeton ?v= = empreinte du contenu). */
(function () {
  "use strict";
  var art = document.querySelector(".card.mx"), bar = document.getElementById("mxBar"), lu = document.getElementById("mxLu");
  if (!art) return;
  var liens = [].slice.call(document.querySelectorAll(".mx-sommaire a"));
  var parties = liens.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
  function maj() {
    var r = art.getBoundingClientRect(), h = art.offsetHeight - window.innerHeight;
    var p = h > 0 ? Math.max(0, Math.min(100, Math.round(-r.top / h * 100))) : 100;
    if (bar) bar.style.width = p + "%";
    if (lu) lu.textContent = p >= 95 ? "Fiche lue" : "Lecture : " + p + " %";
    var k = -1;
    parties.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < 200) k = i; });
    liens.forEach(function (a, i) { a.classList.toggle("actif", i === (k < 0 ? 0 : k)); });
  }
  var t = 0;
  window.addEventListener("scroll", function () { if (!t) t = requestAnimationFrame(function () { t = 0; maj(); }); }, { passive: true });
  window.addEventListener("resize", maj);
  maj();
})();
