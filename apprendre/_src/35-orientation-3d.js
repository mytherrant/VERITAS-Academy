/* Planches 3D (18/11/2026) : les deux leçons d'orientation de Tle avaient perdu leur 3D au lot 20 (blocs illisibles remplacés par
   des plannings 2D) ; deux modèles 3D lisibles et légendés les remplacent. AJOUTS SEULEMENT. */
(function () {
  "use strict";
  var NUIT = "#001136", BLEU = "#1E499B", GRIS = "#4D5163", VERT = "#17784D", ROUGE = "#C62828", TERRE = "#C46A2B";

  function txt(x, y, t, o) {
    o = o || {};
    return "<text x='" + x + "' y='" + y + "' text-anchor='" + (o.a || "middle") + "' font-size='" + (o.s || 12) + "' font-weight='" + (o.w || 700) + "' fill='" + (o.c || NUIT) + "'" + (o.i ? " font-style='italic'" : "") + (o.halo ? " stroke='#fff' stroke-width='3' paint-order='stroke'" : "") + ">" + t + "</text>";
  }
  function lin(id, cs, vertical) {
    var s = "<linearGradient id='" + id + "'" + (vertical ? " x1='0' y1='0' x2='0' y2='1'" : "") + ">";
    cs.forEach(function (c, i) { s += "<stop offset='" + (i / (cs.length - 1)).toFixed(2) + "' stop-color='" + c + "'/>"; });
    return s + "</linearGradient>";
  }
  function rad(id, cs) {
    var s = "<radialGradient id='" + id + "' cx='35%' cy='30%' r='75%'>";
    cs.forEach(function (c, i) { s += "<stop offset='" + (i / (cs.length - 1)).toFixed(2) + "' stop-color='" + c + "'/>"; });
    return s + "</radialGradient>";
  }
  function fleche(id, c) { return "<marker id='" + id + "' markerWidth='10' markerHeight='10' refX='7' refY='5' orient='auto'><path d='M0 1L8 5L0 9Z' fill='" + c + "'/></marker>"; }
  function svg(w, h, alt, defs, corps) {
    return "<svg viewBox='0 0 " + w + " " + h + "' role='img' aria-label='" + alt + "' font-family='Inter,Arial,sans-serif'><rect width='" + w + "' height='" + h + "' fill='#fff'/><defs>" + defs + "</defs>" + corps +
      "<text x='" + (w - 6) + "' y='" + (h - 5) + "' font-size='8' text-anchor='end' fill='#8A93A6'>Planche VÉRITAS</text></svg>";
  }
  function ancien(id) { return window.VRT_LECONS[id]; }
  function remplacer(id, o) {
    var a = ancien(id);
    if (a) ["apc", "examen", "rang", "cle", "scenes"].forEach(function (k) { if (a[k] != null && o[k] == null) o[k] = a[k]; });
    VRT_L(id, o);
    if (a) o.ordre = a.ordre;
  }
  function q(qq, bonne, f1, f2, e) { return { q: qq, r: [bonne, f1, f2], b: 0, e: e }; }
  function partie(old, i) { return old && old.parties[i] ? old.parties[i].html : ""; }
  function bulle(x, y, w, t, c) { return "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='30' rx='12' fill='#fff' stroke='" + (c || "#C9D2E3") + "'/>" + txt(x + w / 2, y + 20, t, { s: 11.5 }); }
  function perso(x, y, peau, habit, bas) {
    bas = bas || "#2E3445";
    return "<g transform='translate(" + x + " " + y + ")'><ellipse cx='0' cy='84' rx='18' ry='4' fill='#001136' opacity='.18'/>" +
      "<rect x='-9' y='44' width='8' height='36' rx='3' fill='" + bas + "'/><rect x='1' y='44' width='8' height='36' rx='3' fill='" + bas + "'/>" +
      "<ellipse cx='-6' cy='81' rx='7' ry='3.5' fill='#1F2328'/><ellipse cx='6' cy='81' rx='7' ry='3.5' fill='#1F2328'/>" +
      "<path d='M-13 46L-16 18C-16 13 -12 11 -6 10H6C12 11 16 13 16 18L13 46Z' fill='" + habit + "'/>" +
      "<path d='M-15 16L-20 40' stroke='" + habit + "' stroke-width='7' stroke-linecap='round'/><path d='M15 16L20 40' stroke='" + habit + "' stroke-width='7' stroke-linecap='round'/>" +
      "<circle cx='-20' cy='42' r='3.6' fill='" + peau + "'/><circle cx='20' cy='42' r='3.6' fill='" + peau + "'/>" +
      "<rect x='-3.5' y='5' width='7' height='7' fill='" + peau + "'/><ellipse cx='0' cy='-2' rx='9' ry='10.5' fill='" + peau + "'/>" +
      "<path d='M-9 -4C-10 -14 -4 -13.5 0 -13.5S10 -14 9 -4C7 -9 -7 -9 -9 -4Z' fill='#1B1410'/><ellipse cx='-9' cy='-1' rx='1.8' ry='3' fill='" + peau + "'/><ellipse cx='9' cy='-1' rx='1.8' ry='3' fill='" + peau + "'/></g>";
  }
  /* portrait en buste (arbre généalogique) */
  function portrait(x, y, peau, habit, cheveux, age) {
    var s = "<g transform='translate(" + x + " " + y + ")'><circle r='30' fill='#F4EFE4' stroke='#C9A576' stroke-width='3'/><clipPath id='pc" + x + "_" + y + "'><circle r='28'/></clipPath><g clip-path='url(#pc" + x + "_" + y + ")'>";
    s += "<path d='M-26 32C-26 14 -14 10 0 10S26 14 26 32Z' fill='" + habit + "'/><rect x='-4' y='2' width='8' height='10' fill='" + peau + "'/><ellipse cy='-6' rx='11' ry='13' fill='" + peau + "'/>";
    s += age === "vieux" ? "<path d='M-11 -10C-12 -20 -4 -21 0 -21S12 -20 11 -10C9 -14 -9 -14 -11 -10Z' fill='#D8D8D8'/>" : age === "femme" ? "<path d='M-13 -6C-15 -24 15 -24 13 -6C12 -14 -12 -14 -13 -6Z' fill='" + cheveux + "'/><path d='M-13 -14h26v-6c-6 -6 -20 -6 -26 0Z' fill='" + habit + "'/>" : "<path d='M-11 -10C-12 -20 -4 -21 0 -21S12 -20 11 -10C9 -14 -9 -14 -11 -10Z' fill='" + cheveux + "'/>";
    s += "<circle cx='-4' cy='-6' r='1.4' fill='#1B1410'/><circle cx='4' cy='-6' r='1.4' fill='#1B1410'/><path d='M-3 2q3 2 6 0' stroke='#1B1410' fill='none'/></g></g>";
    return s;
  }
  /* boucle d'exercice générique : [phrase avec ___, [bonne, autres…], explication] */
  function exercice(el, C, suivant, lib) {
    var i = 0, ok = 0;
    el.innerHTML = "<p class='labo-r' data-q style='font-size:16px'></p><div style='display:flex;gap:8px;flex-wrap:wrap' data-c></div><p class='an-note' data-e></p><p class='labo-r' data-s></p>";
    function $(s) { return el.querySelector(s); }
    function poser() {
      var c = C[i];
      $("[data-q]").innerHTML = (i + 1) + ". " + c[0].replace("___", "<b style='border-bottom:2px dashed #1E499B;padding:0 14px'>?</b>");
      $("[data-e]").textContent = ""; $("[data-s]").innerHTML = lib + " " + (i + 1) + " / " + C.length + " · score : <b>" + ok + "</b>";
      $("[data-c]").innerHTML = c[1].slice().sort().map(function (x) { return "<button type='button' class='btn-l' data-v='" + x + "'>" + x + "</button>"; }).join("");
      el.querySelectorAll("[data-v]").forEach(function (b) {
        b.addEventListener("click", function () {
          var bon = b.dataset.v === c[1][0]; if (bon) ok++;
          $("[data-q]").innerHTML = (i + 1) + ". " + c[0].replace("___", "<b style='color:" + (bon ? VERT : ROUGE) + "'>" + c[1][0] + "</b>");
          $("[data-e]").innerHTML = (bon ? "✔ " : "✘ ") + c[2];
          el.querySelectorAll("[data-v]").forEach(function (x) { x.disabled = true; });
          var nx = document.createElement("button"); nx.type = "button"; nx.className = "btn-l"; nx.textContent = i + 1 < C.length ? suivant : "↺";
          nx.addEventListener("click", function () { i = (i + 1) % C.length; if (!i) ok = 0; poser(); });
          $("[data-c]").appendChild(nx);
          $("[data-s]").innerHTML = lib + " " + (i + 1) + " / " + C.length + " · score : <b>" + ok + "</b>";
        });
      });
    }
    poser();
  }

  function decaler(pl, dy) { pl.modele.objets.forEach(function (o) { o.c[1] -= dy; }); (pl.modele.etiquettes || []).forEach(function (e) { e.p[1] -= dy; }); return pl; }
  function ajouter3D(id, partie, planche) { var L = ancien(id); if (L && L.parties[partie]) L.parties[partie].planches = (L.parties[partie].planches || []).concat([planche]); }
  function bureau3D() {
    var o = [], k;
    o.push({ f: "boite", c: [0, -6, 0], d: [460, 6, 300], coul: "#B88A5A", dessus: "#C9A06E" });
    o.push({ f: "boite", c: [0, 120, 110], d: [460, 260, 10], coul: "#EFE6D6", dessus: "#EFE6D6", div: false });
    o.push({ f: "boite", c: [0, 70, 20], d: [260, 8, 120], coul: "#8B5A2B", dessus: "#A06A38" });
    [[-120, -30], [120, -30], [-120, 70], [120, 70]].forEach(function (p) { o.push({ f: "boite", c: [p[0], 33, p[1] + 20], d: [8, 66, 8], coul: "#6B4423" }); });
    o.push({ f: "boite", c: [0, 170, 103], d: [200, 110, 2], coul: "#FBF8F2", div: false });
    var C = ["#3A4E8C", "#1E88E5", "#2E7D32", "#F2994A"];
    for (k = 0; k < 7; k++) [0, 1, 2, 3].forEach(function (j) { o.push({ f: "boite", c: [-84 + k * 28, 205 - j * 22, 101], d: [22, 18, 1], coul: C[j], div: false }); });
    o.push({ f: "boite", c: [-60, 80, 10], d: [70, 10, 50], coul: "#C62828", dessus: "#F4F1EA" });
    o.push({ f: "boite", c: [-60, 90, 10], d: [66, 8, 46], coul: "#1E499B", dessus: "#F4F1EA" });
    o.push({ f: "cylindre", c: [40, 74, 0], r: 14, h: 4, n: 16, coul: "#F7C948" });
    o.push({ f: "cylindre", c: [40, 78, 0], r: 12, h: 2, n: 16, coul: "#FBF8F2" });
    o.push({ f: "sphere", c: [100, 92, 30], r: 16, coul: "#C62828" });
    o.push({ f: "sphere", c: [100, 92, 14], r: 12, coul: "#F4F1EA" });
    o.push({ f: "boite", c: [180, 20, -60], d: [60, 40, 50], coul: "#8B6B4A", dessus: "#A68A5E" });
    o.push({ f: "boite", c: [180, 42, -60], d: [20, 2, 36], coul: "#1F2328", dessus: "#2A2F36", div: false });
    o.push({ f: "cylindre", c: [-110, 74, 60], r: 10, h: 4, n: 12, coul: "#3A3F47" });
    o.push({ f: "cylindre", c: [-110, 78, 60], r: 2, h: 60, n: 6, coul: "#3A3F47" });
    o.push({ f: "cone", c: [-110, 128, 46], r: 18, h: 16, n: 14, coul: "#F7C948" });
    return o;
  }
  ajouter3D("tle-orient-temps", 2, decaler({ type: "3d", titre: "Le bureau de révision d'Aïcha", legende: "Tourne le coin de révision d'Aïcha : son planning de la semaine punaisé au mur (bleu nuit : sommeil, bleu : cours, vert : révisions, orange : sport), ses cahiers ouverts, un minuteur réglé sur 45 minutes, le réveil qui rappelle l'heure du coucher, et le téléphone rangé dans une boîte, hors de portée pendant la séance.",
    modele: { h: 360, rx: -14, ry: 26, echelle: 0.85, alt: "Bureau de révision : planning au mur, cahiers, minuteur, réveil, lampe, téléphone rangé dans une boîte", objets: bureau3D(),
      etiquettes: [{ p: [0, 225, 100], t: "planning de la semaine", cote: "g" }, { p: [40, 80, 0], t: "minuteur : 45 min", cote: "d" }, { p: [100, 104, 30], t: "réveil : coucher à 22 h", cote: "d" }, { p: [180, 44, -60], t: "téléphone rangé", cote: "d" }, { p: [-60, 96, 10], t: "cahiers et fiches", cote: "g" }] } }, 110));
  function escalier3D() {
    var o = [], M = [["T1", 8.6, "#C62828"], ["T2", 9.4, "#E8A33D"], ["T3", 10.4, "#2E7D32"]], k;
    o.push({ f: "boite", c: [0, -6, 0], d: [460, 6, 200], coul: "#C9B28A", dessus: "#E9DFCF" });
    M.forEach(function (m, i) { var h = (m[1] - 7) * 40; o.push({ f: "boite", c: [-150 + i * 110, h / 2, 0], d: [100, h, 120], coul: m[2], dessus: m[2] }); });
    o.push({ f: "boite", c: [180, 70, 0], d: [100, 140, 120], coul: "#1E499B", dessus: "#2F6DB5" });
    o.push({ f: "cylindre", c: [180, 140, 0], r: 2, h: 60, n: 6, coul: "#9AA3AF" });
    o.push({ f: "boite", c: [200, 190, 0], d: [40, 22, 2], coul: "#F7C948", div: false });
    o.push({ f: "boite", c: [0, 120, -62], d: [420, 1.5, 1.5], coul: "#1F2328", div: false });
    o.push({ f: "cylindre", c: [-40, 70, 0], r: 8, r2: 6, h: 30, n: 10, coul: "#F4F1EA" });
    o.push({ f: "sphere", c: [-40, 108, 0], r: 8, coul: "#5A3A1E" });
    return o;
  }
  ajouter3D("tle-orient-bac", 0, decaler({ type: "3d", titre: "L'escalier de Kevin, trimestre par trimestre", legende: "Tourne l'escalier : chaque marche est une moyenne trimestrielle visée (8,6 au premier trimestre, environ 9,4 au deuxième, 10,4 au troisième), puis la marche bleue du bac, en juin. Le fil noir marque la barre des 10 : on la franchit marche après marche, grâce aux progrès ciblés sur les forts coefficients.",
    modele: { h: 340, rx: -18, ry: 28, echelle: 0.85, alt: "Escalier de trois marches de couleur pour les moyennes trimestrielles et une marche bleue avec un drapeau pour le bac", objets: escalier3D(),
      etiquettes: [{ p: [-150, 66, -60], t: "1ᵉʳ trimestre : 8,6", cote: "g" }, { p: [-40, 98, -60], t: "2ᵉ trimestre : ≈ 9,4", cote: "g" }, { p: [70, 138, -60], t: "3ᵉ trimestre : 10,4", cote: "d" }, { p: [200, 200, 0], t: "juin : le bac", cote: "d" }, { p: [-200, 121, -62], t: "barre des 10", cote: "g" }] } }, 90));
})();
