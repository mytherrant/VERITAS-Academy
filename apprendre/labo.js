/* VÉRITAS — Apprendre : labos manipulables.
   Chaque leçon déclare seulement des réglages ({type:"droites", a:1, b:2}) ; le code est ici,
   ce qui permet aux réglages d'une leçon payante de voyager avec sa suite depuis le serveur. */
(function (W) {
  "use strict";
  var BL = "#1E499B", OR = "#C24E00", NU = "#001136", GR = "#8A94A6", CL = "#DBE8FE", VE = "#0E7C86";
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function nb(x, d) { if (!isFinite(x)) return "—"; var v = Math.round(x * Math.pow(10, d == null ? 2 : d)) / Math.pow(10, d == null ? 2 : d); return String(v).replace(".", ",").replace("-", "−"); }
  function pgcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function curseur(p, lib, min, max, pas, val, cb) {
    var w = el("label", "labo-c", '<span>' + lib + ' : <b></b></span>'), i = el("input"), b = w.querySelector("b");
    i.type = "range"; i.min = min; i.max = max; i.step = pas; i.value = val; i.setAttribute("aria-label", lib);
    function maj() { b.textContent = nb(+i.value); cb(+i.value); }
    i.addEventListener("input", maj); w.appendChild(i); p.appendChild(w); b.textContent = nb(val); return i;
  }
  function plan(boite, largeur, hauteur) { var s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("viewBox", "0 0 " + largeur + " " + hauteur); s.setAttribute("role", "img"); s.setAttribute("class", "labo-s"); boite.appendChild(s); return s; }
  function txt(x, y, t, c, ta) { return '<text x="' + x + '" y="' + y + '" fill="' + (c || NU) + '" font-size="14"' + (ta ? ' text-anchor="' + ta + '"' : '') + '>' + t + '</text>'; }
  function trait(a, b, c, d, co, ep, tir) { return '<line x1="' + a + '" y1="' + b + '" x2="' + c + '" y2="' + d + '" stroke="' + (co || NU) + '" stroke-width="' + (ep || 2) + '"' + (tir ? ' stroke-dasharray="6 5"' : '') + '/>'; }
  function point(x, y, c) { return '<circle cx="' + x + '" cy="' + y + '" r="4.5" fill="' + (c || OR) + '"/>'; }
  /* Structure commune : curseurs au-dessus, dessin, puis lecture du résultat. */
  function cadre(b) { var c = el("div", "labo-cs"), z = el("div", "labo-z"), r = el("p", "labo-r"); b.appendChild(c); b.appendChild(z); b.appendChild(r); return { c: c, z: z, r: r }; }

  function repere(s, L, H, xm, xM, ym, yM) {
    var sx = function (x) { return 34 + (x - xm) / (xM - xm) * (L - 48); }, sy = function (y) { return H - 26 - (y - ym) / (yM - ym) * (H - 42); }, h = "";
    h += trait(sx(xm), sy(Math.max(ym, 0)), sx(xM), sy(Math.max(ym, 0)), NU, 1.5);
    h += trait(sx(Math.max(xm, 0)), sy(ym), sx(Math.max(xm, 0)), sy(yM), NU, 1.5);
    return { x: sx, y: sy, base: h };
  }

  var T = {
    pgcd: function (b, o) {
      var f = cadre(b), a = o.a || 84, d = o.b || 36;
      function etapes() {
        var x = Math.max(a, d), y = Math.min(a, d), l = [];
        if (o.mode === "euclide") { while (y) { var q = Math.floor(x / y), r = x % y; l.push(x + " = " + y + " × " + q + " + " + r); x = y; y = r; } return { l: l, v: x }; }
        while (y) { var e = x - y; l.push(x + " − " + y + " = " + e); var t = [y, e].sort(function (m, n) { return n - m; }); x = t[0]; y = t[1]; }
        return { l: l, v: x };
      }
      var n = 0;
      curseur(f.c, "a", 2, 400, 1, a, function (v) { a = v; n = 0; dess(); });
      curseur(f.c, "b", 2, 400, 1, d, function (v) { d = v; n = 0; dess(); });
      var bt = el("button", "btn-l", "Étape suivante"); bt.type = "button"; f.c.appendChild(bt);
      function dess() { var e = etapes(); f.z.innerHTML = '<ol class="labo-l">' + e.l.slice(0, n).map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ol>"; f.r.innerHTML = n >= e.l.length ? "PGCD(" + a + " ; " + d + ") = <b>" + e.v + "</b>. PPCM = <b>" + (a * d / e.v) + "</b>." : "Étape " + n + " sur " + e.l.length + "."; bt.disabled = n >= e.l.length; }
      bt.addEventListener("click", function () { n++; dess(); }); dess();
    },
    rdv: function (b, o) {
      var f = cadre(b), a = o.a || 12, d = o.b || 18;
      curseur(f.c, o.la || "Bus A : toutes les (min)", 2, 40, 1, a, function (v) { a = v; dess(); });
      curseur(f.c, o.lb || "Bus B : toutes les (min)", 2, 40, 1, d, function (v) { d = v; dess(); });
      var s = plan(f.z, 520, 110);
      function dess() {
        var p = a * d / pgcd(a, d), M = Math.max(p * 1.2, 40), X = function (t) { return 20 + t / M * 480; }, h = trait(20, 55, 500, 55, GR, 1.5);
        for (var t = 0; t <= M; t += a) h += trait(X(t), 30, X(t), 55, BL, 3);
        for (t = 0; t <= M; t += d) h += trait(X(t), 55, X(t), 80, VE, 3);
        h += point(X(p), 55) + txt(X(p), 102, p + " min", OR, "middle");
        s.innerHTML = h; f.r.innerHTML = "Prochain départ commun après <b>" + p + " minutes</b> : c'est PPCM(" + a + " ; " + d + ").";
      } dess();
    },
    thales: function (b) {
      var f = cadre(b), k = 0.5, s = plan(f.z, 420, 240);
      curseur(f.c, "Position de M sur [AB]", 0.15, 0.9, 0.05, k, function (v) { k = v; dess(); });
      function dess() {
        var A = [150, 22], B = [40, 215], C = [370, 215], M = [A[0] + k * (B[0] - A[0]), A[1] + k * (B[1] - A[1])], N = [A[0] + k * (C[0] - A[0]), A[1] + k * (C[1] - A[1])];
        s.innerHTML = '<path d="M' + A + ' L' + B + ' L' + C + ' Z" fill="' + CL + '" stroke="' + NU + '" stroke-width="2"/>' + trait(M[0], M[1], N[0], N[1], OR, 3) + txt(A[0] - 5, 16, "A") + txt(B[0] - 18, 228, "B") + txt(C[0] + 6, 228, "C") + txt(M[0] - 20, M[1], "M") + txt(N[0] + 8, N[1], "N");
        f.r.innerHTML = "AM/AB = AN/AC = MN/BC = <b>" + nb(k) + "</b> : les trois rapports restent égaux tant que (MN) // (BC).";
      } dess();
    },
    ensembles: function (b) {
      var f = cadre(b), L = [["7", 0], ["−4", 1], ["2,5", 2], ["1/3", 3], ["√2", 4], ["√16 = 4", 0], ["π", 4]], N = ["ℕ", "ℤ", "𝔻", "ℚ", "ℝ"];
      L.forEach(function (x) { var c = el("button", "btn-l", x[0]); c.type = "button"; c.addEventListener("click", function () { f.z.innerHTML = '<div class="labo-en">' + N.map(function (n, i) { return '<span class="' + (i >= x[1] ? "oui" : "") + '">' + n + "</span>"; }).join("") + "</div>"; f.r.innerHTML = "<b>" + x[0] + "</b> appartient à : " + N.slice(x[1]).join(", ") + "."; }); f.c.appendChild(c); });
      f.r.textContent = "Choisis un nombre pour voir les ensembles qui le contiennent.";
    },
    carre: function (b, o) {
      var f = cadre(b), A = o.aire || 180, pr = o.prixRouleau || 6500, lg = o.rouleau || 10, s = plan(f.z, 300, 210);
      curseur(f.c, "Aire du terrain (m²)", 25, 900, 5, A, function (v) { A = v; dess(); });
      function dess() { var c = Math.sqrt(A), C = 40 + c / 30 * 130; s.innerHTML = '<rect x="20" y="20" width="' + C + '" height="' + C + '" fill="' + CL + '" stroke="' + NU + '" stroke-width="2"/>' + txt(26 + C / 2, 16, nb(c) + " m", NU, "middle"); var P = 4 * c, n = Math.ceil(P / lg); f.r.innerHTML = "Côté √" + A + " ≈ <b>" + nb(c) + " m</b> · Périmètre ≈ <b>" + nb(P) + " m</b> · " + n + " rouleaux soit <b>" + (n * pr).toLocaleString("fr-FR") + " F</b>."; } dess();
    },
    radical: function (b, o) {
      var f = cadre(b), a = 9, d = 16;
      curseur(f.c, "a", 1, 100, 1, a, function (v) { a = v; dess(); }); curseur(f.c, "b", 1, 100, 1, d, function (v) { d = v; dess(); });
      function dess() {
        var m = o.mode;
        f.r.innerHTML = m === "quotient" ? "√" + a + " / √" + d + " = √(" + a + "/" + d + ") ≈ <b>" + nb(Math.sqrt(a / d), 3) + "</b>" :
          m === "compare" ? "(a√2)² = " + 2 * a * a + " ; (b√3)² = " + 3 * d * d + " ⇒ a√2 " + (2 * a * a > 3 * d * d ? "&gt;" : 2 * a * a < 3 * d * d ? "&lt;" : "=") + " b√3" :
          "√a + √b ≈ <b>" + nb(Math.sqrt(a) + Math.sqrt(d), 3) + "</b> ; √(a + b) ≈ <b>" + nb(Math.sqrt(a + d), 3) + "</b> ; √a × √b = √(ab) ≈ <b>" + nb(Math.sqrt(a * d), 3) + "</b>";
      } dess();
    },
    puissance: function (b) {
      var f = cadre(b), a = 10, n = 3;
      curseur(f.c, "Base", 2, 10, 1, a, function (v) { a = v; dess(); }); curseur(f.c, "Exposant", -6, 8, 1, n, function (v) { n = v; dess(); });
      function dess() { var v = Math.pow(a, n), e = Math.floor(Math.log10(v) + 1e-9), m = v / Math.pow(10, e); f.r.innerHTML = a + "<sup>" + String(n).replace("-", "−") + "</sup> = <b>" + (v >= 1 ? v.toLocaleString("fr-FR") : v.toPrecision(3).replace(".", ",")) + "</b> · notation scientifique : <b>" + nb(m, 3) + " × 10<sup>" + String(e).replace("-", "−") + "</sup></b>"; } dess();
    },
    encadre: function (b, o) {
      var f = cadre(b), v = o.val || Math.sqrt(5), n = 1;
      curseur(f.c, "Nombre de décimales", 0, 5, 1, n, function (x) { n = x; dess(); });
      function dess() { var p = Math.pow(10, n), i = Math.floor(v * p) / p, s = i + 1 / p; f.r.innerHTML = "<b>" + nb(i, n) + "</b> &lt; " + (o.nom || "√5") + " &lt; <b>" + nb(s, n) + "</b> · amplitude " + nb(1 / p, n); } dess();
    },
    droitegrad: function () { },
    intervalle: function (b) {
      var f = cadre(b), a = -2, d = 3, g = true, r = false, s = plan(f.z, 460, 70);
      curseur(f.c, "Borne gauche", -8, 8, 1, a, function (v) { a = v; dess(); }); curseur(f.c, "Borne droite", -8, 8, 1, d, function (v) { d = v; dess(); });
      var c1 = el("button", "btn-l", "Inclure / exclure à gauche"), c2 = el("button", "btn-l", "Inclure / exclure à droite"); c1.type = c2.type = "button"; f.c.appendChild(c1); f.c.appendChild(c2);
      c1.onclick = function () { g = !g; dess(); }; c2.onclick = function () { r = !r; dess(); };
      function dess() { var A = Math.min(a, d), B = Math.max(a, d), X = function (x) { return 30 + (x + 9) / 18 * 400; }; s.innerHTML = trait(20, 35, 440, 35, GR, 2) + trait(X(A), 35, X(B), 35, BL, 6) + txt(X(A), 60, nb(A), NU, "middle") + txt(X(B), 60, nb(B), NU, "middle") + txt(X(A), 26, g ? "[" : "]", OR, "middle") + txt(X(B), 26, r ? "]" : "[", OR, "middle"); f.r.innerHTML = "x ∈ <b>" + (g ? "[" : "]") + nb(A) + " ; " + nb(B) + (r ? "]" : "[") + "</b> ⇔ " + nb(A) + (g ? " ≤ " : " &lt; ") + "x" + (r ? " ≤ " : " &lt; ") + nb(B); } dess();
    },
    trigo: function (b, o) {
      var f = cadre(b), an = o.angle || 35, H = o.base || 20, s = plan(f.z, 420, 240);
      curseur(f.c, o.lib || "Angle (°)", 5, 85, 1, an, function (v) { an = v; dess(); });
      if (!o.securite) curseur(f.c, o.libB || "Distance au pied (m)", 1, 50, 1, H, function (v) { H = v; dess(); });
      function dess() {
        var r = an * Math.PI / 180, L = o.securite ? o.long : H / Math.cos(r), ad = o.securite ? o.long * Math.cos(r) : H, op = L * Math.sin(r), K = 300 / Math.max(ad, op * 1.4), x1 = 60 + ad * K, y1 = 210 - op * K;
        s.innerHTML = '<path d="M60 210 L' + x1 + ' 210 L' + x1 + " " + y1 + ' Z" fill="' + CL + '" stroke="' + NU + '" stroke-width="2"/>' + txt(70, 202, an + "°", OR) + txt((60 + x1) / 2, 228, nb(ad) + " m", NU, "middle") + txt(x1 + 8, (210 + y1) / 2, nb(op) + " m");
        var ok = o.securite ? (an >= o.securite[0] && an <= o.securite[1]) : null;
        f.r.innerHTML = "sin = <b>" + nb(Math.sin(r), 3) + "</b> · cos = <b>" + nb(Math.cos(r), 3) + "</b> · tan = <b>" + nb(Math.tan(r), 3) + "</b>" + (ok === null ? "" : ok ? " · <b style=\"color:" + VE + "\">Position sûre</b>" : " · <b style=\"color:" + OR + "\">Position dangereuse</b>");
      } dess();
    },
    valeur: function (b, o) {
      var f = cadre(b), x = o.x == null ? 2 : o.x;
      function ev(c, v) { return c.reduce(function (s, a) { return s * v + a; }, 0); }
      function ec(c) { var d = c.length - 1, t = []; c.forEach(function (a, i) { if (!a) return; var p = d - i, ab = Math.abs(a); t.push((a < 0 ? "− " : t.length ? "+ " : "") + ((ab === 1 && p) ? "" : nb(ab)) + (p ? "x" + (p > 1 ? "<sup>" + p + "</sup>" : "") : "")); }); return t.join(" ") || "0"; }
      curseur(f.c, "x", o.min == null ? -6 : o.min, o.max == null ? 6 : o.max, o.pas || 0.5, x, function (v) { x = v; dess(); });
      function dess() { var n = ev(o.num, x), d = o.den ? ev(o.den, x) : 1; f.r.innerHTML = (o.den ? "(" + ec(o.num) + ") / (" + ec(o.den) + ")" : ec(o.num)) + " pour x = " + nb(x) + " : " + (d === 0 ? '<b style="color:' + OR + '">valeur interdite</b>' : "<b>" + nb(n / d) + "</b>"); } dess();
    },
    identite: function (b) {
      var f = cadre(b), a = 5, c = 3, s = plan(f.z, 260, 240);
      curseur(f.c, "a", 1, 10, 1, a, function (v) { a = v; dess(); }); curseur(f.c, "b", 1, 10, 1, c, function (v) { c = v; dess(); });
      function dess() { var K = 200 / (a + c), A = a * K, C = c * K; s.innerHTML = '<rect x="20" y="20" width="' + A + '" height="' + A + '" fill="' + CL + '"/><rect x="' + (20 + A) + '" y="20" width="' + C + '" height="' + A + '" fill="#FFE9A8"/><rect x="20" y="' + (20 + A) + '" width="' + A + '" height="' + C + '" fill="#FFE9A8"/><rect x="' + (20 + A) + '" y="' + (20 + A) + '" width="' + C + '" height="' + C + '" fill="#CDEBE5"/><rect x="20" y="20" width="200" height="200" fill="none" stroke="' + NU + '" stroke-width="2"/>' + txt(20 + A / 2, 20 + A / 2, "a²", NU, "middle") + txt(20 + A + C / 2, 20 + A / 2, "ab", NU, "middle") + txt(20 + A / 2, 20 + A + C / 2 + 4, "ab", NU, "middle") + txt(20 + A + C / 2, 20 + A + C / 2 + 4, "b²", NU, "middle"); f.r.innerHTML = "(" + a + " + " + c + ")² = " + a * a + " + 2 × " + a + " × " + c + " + " + c * c + " = <b>" + (a + c) * (a + c) + "</b>"; } dess();
    },
    cone: function (b, o) {
      var f = cadre(b), hh = o.h || 12, r = o.r || 6, c = o.coupe || hh / 2, py = o.forme === "pyramide", s = plan(f.z, 300, 240);
      curseur(f.c, o.lib || "Hauteur de coupe depuis le sommet", 0.5, hh, 0.5, c, function (v) { c = v; dess(); });
      function dess() {
        var k = c / hh, S = [150, 20], Yb = 215, R = 110, y = S[1] + k * (Yb - S[1]), Rc = R * k, h = py
          ? '<path d="M150 20 L40 215 L260 215 Z" fill="' + CL + '" stroke="' + NU + '" stroke-width="2"/>'
          : '<path d="M150 20 L40 215 A110 18 0 0 0 260 215 Z" fill="' + CL + '" stroke="' + NU + '" stroke-width="2"/>';
        h += py ? trait(150 - Rc, y, 150 + Rc, y, OR, 4) : '<ellipse cx="150" cy="' + y + '" rx="' + Rc + '" ry="' + (18 * k) + '" fill="#FFE9A8" stroke="' + OR + '" stroke-width="2"/>';
        s.innerHTML = h;
        f.r.innerHTML = "k = <b>" + nb(k) + "</b> · " + (py ? "côté" : "rayon") + " de la section : <b>" + nb(r * k) + "</b> · aire × <b>" + nb(k * k, 3) + "</b> · volume × <b>" + nb(k * k * k, 3) + "</b>" + (o.eau ? " · soit <b>" + nb(k * k * k * 100, 1) + " %</b> du récipient" : "");
      } dess();
    },
    vecteur: function (b) {
      var f = cadre(b), k = 2, s = plan(f.z, 420, 200);
      curseur(f.c, "k", -3, 3, 0.5, k, function (v) { k = v; dess(); });
      function fl(x0, y0, x1, y1, c) { return trait(x0, y0, x1, y1, c, 3) + point(x1, y1, c); }
      function dess() { s.innerHTML = fl(210, 100, 270, 70, BL) + txt(274, 66, "u", BL) + fl(210, 130, 210 + 60 * k, 130 - 30 * k, OR) + txt(214 + 60 * k, 126 - 30 * k, nb(k) + "·u", OR); f.r.innerHTML = "k·u a la même direction que u, " + (k > 0 ? "<b>le même sens</b>" : k < 0 ? "<b>le sens contraire</b>" : "et c'est le vecteur nul") + " ; longueur multipliée par <b>" + nb(Math.abs(k)) + "</b>."; } dess();
    },
    repere: function (b, o) {
      var f = cadre(b), P = { xa: 1, ya: 2, xb: 4, yb: -2, xc: o.mode ? 3 : 0, yc: o.mode ? 4 : 0, xd: o.mode ? 6 : 0, yd: o.mode ? 6 : 0 }, s = plan(f.z, 360, 300);
      ["xa", "ya", "xb", "yb"].concat(o.mode ? ["xc", "yc"] : []).forEach(function (n) { curseur(f.c, n === "xc" ? "x de v" : n === "yc" ? "y de v" : n.toUpperCase().replace("XA", "x de A").replace("YA", "y de A").replace("XB", "x de B").replace("YB", "y de B"), -6, 6, 1, P[n], function (v) { P[n] = v; dess(); }); });
      function dess() {
        var R = repere(s, 360, 300, -7, 7, -7, 7), ux = P.xb - P.xa, uy = P.yb - P.ya, h = R.base;
        h += trait(R.x(P.xa), R.y(P.ya), R.x(P.xb), R.y(P.yb), BL, 3) + point(R.x(P.xa), R.y(P.ya), BL) + point(R.x(P.xb), R.y(P.yb), OR) + txt(R.x(P.xa) + 8, R.y(P.ya) - 6, "A") + txt(R.x(P.xb) + 8, R.y(P.yb) - 6, "B");
        if (o.mode) {
          h += trait(R.x(0), R.y(0), R.x(P.xc), R.y(P.yc), OR, 3); var val = o.mode === "colineaire" ? ux * P.yc - P.xc * uy : ux * P.xc + uy * P.yc;
          f.r.innerHTML = o.mode === "colineaire" ? "xy' − x'y = <b>" + val + "</b> : " + (val === 0 ? "<b>colinéaires</b>" : "non colinéaires") : "xx' + yy' = <b>" + val + "</b> : " + (val === 0 ? "<b>orthogonaux</b>" : "non orthogonaux");
        } else f.r.innerHTML = "Vecteur AB (<b>" + ux + " ; " + uy + "</b>) · AB = <b>" + nb(Math.sqrt(ux * ux + uy * uy)) + "</b> · Milieu (<b>" + nb((P.xa + P.xb) / 2) + " ; " + nb((P.ya + P.yb) / 2) + "</b>)";
        s.innerHTML = h;
      } dess();
    },
    inscrit: function (b) {
      var f = cadre(b), ar = 80, m = 240, s = plan(f.z, 300, 280);
      curseur(f.c, "Angle au centre (°)", 20, 170, 5, ar, function (v) { ar = v; dess(); }); curseur(f.c, "Position du sommet M", 150, 340, 5, m, function (v) { m = v; dess(); });
      function pt(d) { var r = (d - 90) * Math.PI / 180; return [150 + 110 * Math.cos(r), 140 + 110 * Math.sin(r)]; }
      function dess() { var A = pt(-ar / 2), B = pt(ar / 2), M = pt(m); s.innerHTML = '<circle cx="150" cy="140" r="110" fill="none" stroke="' + NU + '" stroke-width="2"/>' + trait(150, 140, A[0], A[1], BL, 2) + trait(150, 140, B[0], B[1], BL, 2) + trait(M[0], M[1], A[0], A[1], OR, 2) + trait(M[0], M[1], B[0], B[1], OR, 2) + point(M[0], M[1]) + txt(M[0] + 8, M[1] + 14, "M", OR) + txt(A[0] - 14, A[1] - 6, "A") + txt(B[0] + 6, B[1] - 6, "B") + point(150, 140, BL); f.r.innerHTML = "Angle au centre : <b>" + ar + "°</b> · angle inscrit en M : <b>" + nb(ar / 2) + "°</b>, où que soit M sur le grand arc."; } dess();
    },
    polygone: function (b, o) {
      var f = cadre(b), n = o.n || 6, R = o.r || 4, s = plan(f.z, 260, 260);
      curseur(f.c, "Nombre de côtés", 3, 12, 1, n, function (v) { n = v; dess(); }); curseur(f.c, "Rayon (cm)", 1, 30, 1, R, function (v) { R = v; dess(); });
      function dess() { var p = []; for (var i = 0; i < n; i++) { var a = 2 * Math.PI * i / n - Math.PI / 2; p.push((130 + 105 * Math.cos(a)) + "," + (130 + 105 * Math.sin(a))); } s.innerHTML = '<circle cx="130" cy="130" r="105" fill="none" stroke="' + GR + '" stroke-width="1.5"/><polygon points="' + p.join(" ") + '" fill="' + CL + '" stroke="' + NU + '" stroke-width="2"/>'; var t = Math.PI / n, c = 2 * R * Math.sin(t), ap = R * Math.cos(t); f.r.innerHTML = "Angle au centre : <b>" + nb(360 / n) + "°</b> · côté ≈ <b>" + nb(c) + "</b> · apothème ≈ <b>" + nb(ap) + "</b> · aire ≈ <b>" + nb(n * c * ap / 2) + "</b>."; } dess();
    },
    stats: function (b, o) {
      var f = cadre(b), cl = o.classes, ef = o.eff.slice(), s = plan(f.z, 420, 200), L = o.amplitude;
      ef.forEach(function (e, i) { curseur(f.c, "[" + cl[i] + " ; " + (cl[i] + L) + "[", 0, 40, 1, e, function (v) { ef[i] = v; dess(); }); });
      function dess() { var M = Math.max.apply(null, ef.concat(1)), N = ef.reduce(function (a, c) { return a + c; }, 0), lg = 340 / ef.length, h = "", im = ef.indexOf(M), so = 0; ef.forEach(function (e, i) { var H = e / M * 150; so += e * (cl[i] + L / 2); h += '<rect x="' + (40 + i * lg) + '" y="' + (175 - H) + '" width="' + lg + '" height="' + H + '" fill="' + (i === im ? "#FFC93C" : CL) + '" stroke="' + BL + '" stroke-width="1.5"/>' + txt(40 + i * lg, 195, cl[i], NU, "middle"); }); s.innerHTML = h + txt(40 + ef.length * lg, 195, cl[ef.length - 1] + L, NU, "middle"); f.r.innerHTML = N ? "Effectif total : <b>" + N + "</b> · classe modale : <b>[" + cl[im] + " ; " + (cl[im] + L) + "[</b> · fréquence : <b>" + nb(ef[im] / N * 100, 1) + " %</b> · moyenne ≈ <b>" + nb(so / N) + "</b>" : "Aucune valeur."; } dess();
    },
    homothetie: function (b) {
      var f = cadre(b), k = 2, s = plan(f.z, 420, 280);
      curseur(f.c, "Rapport k", -2, 3, 0.25, k, function (v) { k = v; dess(); });
      function dess() { var O = [210, 140], P = [[30, -30], [70, -20], [40, 20]], h = point(O[0], O[1], NU) + txt(O[0] - 16, O[1] + 4, "O"); h += '<polygon points="' + P.map(function (p) { return (O[0] + p[0]) + "," + (O[1] + p[1]); }).join(" ") + '" fill="' + CL + '" stroke="' + BL + '" stroke-width="2"/><polygon points="' + P.map(function (p) { return (O[0] + k * p[0]) + "," + (O[1] + k * p[1]); }).join(" ") + '" fill="#FFE9A8" fill-opacity=".7" stroke="' + OR + '" stroke-width="2"/>'; s.innerHTML = h; var a = Math.abs(k); f.r.innerHTML = (a > 1 ? "<b>Agrandissement</b>" : a < 1 && a > 0 ? "<b>Réduction</b>" : k === 0 ? "Figure réduite au point O" : "<b>Même taille</b>") + " · longueurs × <b>" + nb(a) + "</b> · aires × <b>" + nb(k * k) + "</b>" + (k < 0 ? " · figure de l'autre côté de O" : ""); } dess();
    },
    inequation: function (b) {
      var f = cadre(b), a = 2, c = -6, s = plan(f.z, 460, 70);
      curseur(f.c, "a", -5, 5, 1, a, function (v) { a = v; dess(); }); curseur(f.c, "b", -10, 10, 1, c, function (v) { c = v; dess(); });
      function dess() { var X = function (x) { return 230 + x * 20; }; if (a === 0) { s.innerHTML = ""; f.r.innerHTML = c > 0 ? "0x + " + c + " &gt; 0 est toujours vraie : S = ℝ." : "Aucune solution : S = ∅."; return; } var z = -c / a, h = trait(10, 35, 450, 35, GR, 2), d = Math.max(0, Math.min(460, X(z))); h += a > 0 ? trait(d, 35, 450, 35, BL, 6) : trait(10, 35, d, 35, BL, 6); h += txt(d, 60, nb(z), OR, "middle"); s.innerHTML = h; f.r.innerHTML = nb(a) + "x " + (c < 0 ? "− " + nb(-c) : "+ " + nb(c)) + " &gt; 0 ⇒ x " + (a > 0 ? "&gt;" : "&lt;") + " " + nb(z) + (a < 0 ? " <b>(sens changé : a est négatif)</b>" : "") + " · S = <b>" + (a > 0 ? "]" + nb(z) + " ; +∞[" : "]−∞ ; " + nb(z) + "[") + "</b>"; } dess();
    },
    droites: function (b, o) {
      var f = cadre(b), a = o.a, c = o.b, a2 = o.a2, c2 = o.b2, deux = o.a2 != null, s = plan(f.z, 440, 300), xM = o.xmax || 8, yM = o.ymax || 10, xm = o.xmin == null ? -xM : o.xmin, ym = o.ymin == null ? -yM : o.ymin;
      var pa = o.pasA || (Math.abs(a) > 20 ? 5 : 0.5), pb = o.pasB || (Math.abs(c) > 100 ? 100 : 1);
      curseur(f.c, o.la || "a", o.minA == null ? -5 : o.minA, o.maxA == null ? 5 : o.maxA, pa, a, function (v) { a = v; dess(); });
      curseur(f.c, o.lb || "b", o.minB == null ? -10 : o.minB, o.maxB == null ? 10 : o.maxB, pb, c, function (v) { c = v; dess(); });
      function dess() {
        var R = repere(s, 440, 300, xm, xM, ym, yM), h = R.base;
        function ld(p, q, col) { return trait(R.x(xm), R.y(p * xm + q), R.x(xM), R.y(p * xM + q), col, 3); }
        h += ld(a, c, BL); if (deux) h += ld(a2, c2, OR);
        var t = "y = " + nb(a) + "x " + (c < 0 ? "− " + nb(-c) : "+ " + nb(c));
        if (deux) {
          if (a === a2) t += c === c2 ? " · droites <b>confondues</b>" : " · droites <b>parallèles</b>, pas de point commun";
          else { var x = (c2 - c) / (a - a2), y = a * x + c; h += point(R.x(x), R.y(y)); t += " · intersection : <b>x = " + nb(x) + "</b>, <b>y = " + nb(y) + "</b>" + (o.conclu ? ". " + o.conclu : ""); }
        } else t += " · " + (a > 0 ? "<b>croissante</b>" : a < 0 ? "<b>décroissante</b>" : "<b>constante</b>") + " · coupe l'axe des ordonnées en <b>" + nb(c) + "</b>";
        s.innerHTML = h + txt(R.x(xM) - 8, R.y(Math.max(ym, 0)) - 8, "x") + txt(R.x(Math.max(xm, 0)) + 8, R.y(yM) + 12, "y"); f.r.innerHTML = t;
      } dess();
    },
    paliers: function (b, o) {
      var f = cadre(b), x = o.x || 15, s = plan(f.z, 440, 240);
      curseur(f.c, o.lib || "Consommation (m³)", 0, o.max || 30, 1, x, function (v) { x = v; dess(); });
      function P(v) { return v <= o.seuil ? o.p1 * v : o.p1 * o.seuil + o.p2 * (v - o.seuil); }
      function dess() { var M = o.max || 30, yM = P(M), X = function (v) { return 40 + v / M * 380; }, Y = function (v) { return 210 - v / yM * 190; }; s.innerHTML = trait(40, 210, 430, 210, NU, 1.5) + trait(40, 210, 40, 15, NU, 1.5) + trait(X(0), Y(0), X(o.seuil), Y(P(o.seuil)), BL, 3) + trait(X(o.seuil), Y(P(o.seuil)), X(M), Y(P(M)), OR, 3) + point(X(x), Y(P(x))) + txt(X(o.seuil), 228, o.seuil, NU, "middle"); f.r.innerHTML = "Pour " + x + " m³ : <b>" + P(x).toLocaleString("fr-FR") + " F</b>."; } dess();
    },
    atome: function (b, o) {
      var ELS = ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca"], f = cadre(b), z = o.z || 11, q = o.q || 0, s = plan(f.z, 300, 240);
      curseur(f.c, "Numéro atomique Z", 1, 20, 1, z, function (v) { z = v; dess(); }); curseur(f.c, "Charge de l'ion", -3, 3, 1, q, function (v) { q = v; dess(); });
      function dess() {
        var e = z - q, cap = [2, 8, 8, 8], h = '<circle cx="150" cy="120" r="15" fill="' + OR + '"/>' + txt(150, 125, z + "+", "#fff", "middle"), reste = e, couches = [];
        for (var i = 0; i < 4 && reste > 0; i++) { var n = Math.min(cap[i], reste); couches.push(n); reste -= n; var R = 36 + i * 26; h += '<circle cx="150" cy="120" r="' + R + '" fill="none" stroke="' + GR + '" stroke-width="1.2"/>'; for (var j = 0; j < n; j++) { var a = 2 * Math.PI * j / n; h += '<circle cx="' + (150 + R * Math.cos(a)) + '" cy="' + (120 + R * Math.sin(a)) + '" r="4.5" fill="' + BL + '"/>'; } }
        s.innerHTML = h; var c = q === 0 ? "" : (Math.abs(q) > 1 ? Math.abs(q) : "") + (q > 0 ? "+" : "−");
        f.r.innerHTML = "<b>" + ELS[z - 1] + "<sup>" + c + "</sup></b> : " + z + " protons, " + e + " électrons · couches : <b>" + couches.join(", ") + "</b>" + (q === 0 ? " · atome neutre · ligne " + couches.length + ", colonne " + (couches[couches.length - 1]) : q > 0 ? " · cation (a perdu " + q + " e⁻)" : " · anion (a gagné " + (-q) + " e⁻)");
      } dess();
    },
    calcul: function (b, o) {
      var FORM = {
        mole: { v: [["m", "Masse m (g)", 1, 200, 0.1, 21.6], ["M", "Masse molaire M (g/mol)", 1, 200, 1, 46]], r: function (x) { return "n = m / M = <b>" + nb(x.m / x.M, 3) + " mol</b>, soit environ <b>" + nb(x.m / x.M * 6.02, 2) + " × 10²³</b> entités."; } },
        conc: { v: [["n", "Quantité de soluté (mol)", 0.05, 2, 0.05, 0.5], ["V", "Volume de solution (L)", 0.1, 5, 0.1, 2]], r: function (x) { return "C = n / V = <b>" + nb(x.n / x.V, 3) + " mol/L</b>."; } },
        electrolyse: { v: [["t", "Durée (min)", 1, 60, 1, 10], ["d", "Dihydrogène par minute (cm³)", 1, 10, 1, 2]], r: function (x) { return "Dihydrogène : <b>" + nb(x.t * x.d) + " cm³</b> · dioxygène : <b>" + nb(x.t * x.d / 2) + " cm³</b>, deux fois moins."; } },
        levier: { v: [["P", "Charge (N)", 100, 2000, 50, 900], ["c", "Bras de la charge (m)", 0.1, 2, 0.1, 0.5], ["m", "Bras de l'effort (m)", 0.5, 4, 0.1, 1.5]], r: function (x) { return "Effort nécessaire : F = P × d₁ / d₂ = <b>" + nb(x.P * x.c / x.m) + " N</b>."; } },
        incline: { v: [["P", "Poids (N)", 100, 2000, 50, 800], ["h", "Hauteur (m)", 0.2, 3, 0.1, 1], ["L", "Longueur de la rampe (m)", 1, 10, 0.5, 4]], r: function (x) { return "Effort sans frottement : F = P × h / L = <b>" + nb(x.P * x.h / x.L) + " N</b>, au lieu de " + nb(x.P) + " N en soulevant."; } },
        energie: { v: [["P", "Puissance (W)", 5, 2500, 5, 1000], ["h", "Durée (h)", 0.5, 24, 0.5, 2], ["t", "Prix du kWh (F, exemple)", 50, 150, 5, 80]], r: function (x) { var e = x.P * x.h / 1000; return "E = P × t = <b>" + nb(e, 3) + " kWh</b>, soit <b>" + nb(e * 3.6, 2) + " × 10⁶ J</b> · coût : <b>" + nb(e * x.t, 0) + " F</b>."; } },
        resistor: { v: [["R", "Résistance (Ω)", 5, 200, 1, 44], ["U", "Tension (V)", 6, 230, 1, 220]], r: function (x) { var I = x.U / x.R; return "I = U / R = <b>" + nb(I) + " A</b> · P = U × I = <b>" + nb(x.U * I, 0) + " W</b>."; } },
        gravit: { v: [["m", "Masse du satellite (kg)", 100, 5000, 100, 1000], ["h", "Altitude (km)", 200, 40000, 100, 400]], r: function (x) { var d = (6371 + x.h) * 1e3; return "F = G M m / d² = <b>" + nb(6.67e-11 * 5.97e24 * x.m / (d * d), 0) + " N</b>."; } },
        champg: { v: [["h", "Altitude (km)", 0, 40000, 100, 400]], r: function (x) { var q = 6371 / (6371 + x.h); return "g = g₀ (R/(R + h))² = <b>" + nb(9.8 * q * q, 2) + " m/s²</b>."; } },
        coulomb: { v: [["a", "q₁ (µC)", 0.1, 10, 0.1, 1], ["c", "q₂ (µC)", 0.1, 10, 0.1, 1], ["d", "Distance (cm)", 1, 50, 1, 1]], r: function (x) { var d = x.d / 100; return "F = k |q₁q₂| / d² = <b>" + nb(9e9 * x.a * x.c * 1e-12 / (d * d), 2) + " N</b>."; } },
        conde: { v: [["U", "Tension (V)", 10, 2000, 10, 100], ["d", "Distance entre plaques (mm)", 1, 50, 1, 10]], r: function (x) { return "E = U / d = <b>" + nb(x.U / (x.d / 1000), 0) + " V/m</b>."; } },
        filb: { v: [["I", "Intensité (A)", 1, 50, 1, 10], ["d", "Distance au fil (cm)", 1, 50, 1, 2]], r: function (x) { return "B = 2 × 10⁻⁷ I / d = <b>" + nb(2e-7 * x.I / (x.d / 100) * 1e6, 1) + " µT</b>."; } },
        rayon: { v: [["U", "Tension accélératrice (V)", 100, 5000, 100, 1000], ["B", "Champ B (mT)", 1, 500, 1, 100]], r: function (x) { var q = 1.6e-19, m = 1.31e-25, v = Math.sqrt(2 * q * x.U / m); return "v = √(2|q|U/m) = <b>" + nb(v, 0) + " m/s</b> · R = mv / (|q|B) = <b>" + nb(m * v / (q * x.B * 1e-3), 3) + " m</b> (ion de masse 1,31 × 10⁻²⁵ kg)."; } },
        satellite: { v: [["h", "Altitude (km)", 200, 40000, 100, 35786]], r: function (x) { var r = (6371 + x.h) * 1e3, v = 6371e3 * Math.sqrt(9.8 / r), T = 2 * Math.PI * r / v; return "v = R√(g₀/(R + h)) = <b>" + nb(v, 0) + " m/s</b> · T = <b>" + nb(T / 3600, 2) + " h</b>" + (Math.abs(x.h - 35786) < 100 ? " : orbite géostationnaire." : "."); } },
        photo: { v: [["l", "Longueur d'onde (nm)", 200, 800, 5, 633], ["w", "Travail d'extraction (eV)", 1, 6, 0.1, 1.8]], r: function (x) { var E = 1240 / x.l, c = E - x.w; return "E = hc/λ = <b>" + nb(E, 3) + " eV</b> · Ec max = <b>" + nb(Math.max(c, 0), 3) + " eV</b>" + (c <= 0 ? " : pas d'émission." : "."); } },
        young: { v: [["l", "λ (nm)", 400, 800, 10, 600], ["D", "D (m)", 0.5, 3, 0.1, 1.5], ["a", "a (mm)", 0.1, 2, 0.1, 0.2]], r: function (x) { return "i = λD / a = <b>" + nb(x.l * 1e-9 * x.D / (x.a * 1e-3) * 1e3, 3) + " mm</b>."; } },
        hydrogene: { v: [["p", "Niveau de départ p", 2, 7, 1, 3], ["n", "Niveau d'arrivée n", 1, 6, 1, 2]], r: function (x) { if (x.p <= x.n) return "Pour une émission, il faut p > n."; var E = 13.6 * (1 / (x.n * x.n) - 1 / (x.p * x.p)); return "ΔE = <b>" + nb(E, 3) + " eV</b> · λ = <b>" + nb(1240 / E, 1) + " nm</b>."; } },
        incert: { v: [["x", "Mesure x", 1, 100, 1, 20], ["d", "Incertitude Δx", 0.1, 5, 0.1, 0.5]], r: function (x) { return "x = " + nb(x.x) + " ± " + nb(x.d) + " · incertitude relative : <b>" + nb(x.d / x.x * 100, 2) + " %</b>."; } },
        fort: { v: [["c", "Concentration (mol/L)", 0.0001, 0.5, 0.0001, 0.01]], r: function (x) { return "Acide fort : pH = −log C = <b>" + nb(-Math.log10(x.c), 2) + "</b> · base forte : pH = 14 + log C = <b>" + nb(14 + Math.log10(x.c), 2) + "</b> (à 25 °C)."; } },
        pka: { v: [["p", "pKa", 2, 11, 0.1, 4.8], ["b", "[base]", 0.01, 1, 0.01, 0.1], ["a", "[acide]", 0.01, 1, 0.01, 0.1]], r: function (x) { return "pH = pKa + log([base]/[acide]) = <b>" + nb(x.p + Math.log10(x.b / x.a), 2) + "</b>."; } },
        ester: { v: [["a", "Acide (mol)", 0.1, 2, 0.1, 0.6], ["l", "Alcool (mol)", 0.1, 2, 0.1, 0.6], ["r", "Rendement (%)", 5, 100, 1, 67]], r: function (x) { return "Ester obtenu : <b>" + nb(Math.min(x.a, x.l) * x.r / 100, 3) + " mol</b>."; } },
        doppler: { v: [["f", "Fréquence émise (Hz)", 100, 2000, 10, 700], ["v", "Vitesse de la source (m/s)", -60, 60, 2, 30]], r: function (x) { return "f' = f × c / (c − v) = <b>" + nb(x.f * 340 / (340 - x.v), 1) + " Hz</b> (c = 340 m/s, v > 0 si la source se rapproche)."; } },
        liaison: { v: [["z", "Protons Z", 1, 92, 1, 2], ["n", "Neutrons N", 0, 146, 1, 2], ["m", "Masse du noyau (u)", 1, 240, 0.0001, 4.0015]], r: function (x) { var d = x.z * 1.00728 + x.n * 1.00866 - x.m, A = x.z + x.n; return "Δm = <b>" + nb(d, 4) + " u</b> · El = <b>" + nb(d * 931.5, 2) + " MeV</b> · El/A = <b>" + nb(d * 931.5 / A, 2) + " MeV/nucléon</b>."; } },
        transfo: { v: [["U", "Tension primaire (V)", 110, 240, 10, 220], ["a", "Spires au primaire", 500, 4000, 100, 2200], ["c", "Spires au secondaire", 20, 1000, 10, 120]], r: function (x) { return "U₂ = U₁ × N₂ / N₁ = <b>" + nb(x.U * x.c / x.a) + " V</b>."; } }
      }, F = FORM[o.f], f = cadre(b), x = {};
      F.v.forEach(function (v) { var k = v[0], d = o.vals && o.vals[k] != null ? o.vals[k] : v[5]; x[k] = d; curseur(f.c, v[1], v[2], v[3], v[4], d, function (n) { x[k] = n; f.r.innerHTML = F.r(x); }); });
      f.r.innerHTML = F.r(x);
    },
    poulies: function (b, o) {
      var f = cadre(b), eng = o.mode === "engrenage", d1 = o.d1, d2 = o.d2, n1 = o.n1, s = plan(f.z, 440, 210), red = W.matchMedia && W.matchMedia("(prefers-reduced-motion: reduce)").matches;
      curseur(f.c, eng ? "Dents Z₁ (moteur)" : "Diamètre moteur (cm)", 8, 60, 1, d1, function (v) { d1 = v; dess(); });
      curseur(f.c, eng ? "Dents Z₂ (récepteur)" : "Diamètre récepteur (cm)", 8, 60, 1, d2, function (v) { d2 = v; dess(); });
      curseur(f.c, "Vitesse du moteur (tr/min)", 100, 3000, 50, n1, function (v) { n1 = v; dess(); });
      function roue(cx, r, dur, sens) { return '<circle cx="' + cx + '" cy="105" r="' + r + '" fill="' + CL + '" stroke="' + NU + '" stroke-width="2"/><g>' + trait(cx - r, 105, cx + r, 105, BL, 3) + trait(cx, 105 - r, cx, 105 + r, BL, 3) + (red ? "" : '<animateTransform attributeName="transform" type="rotate" from="0 ' + cx + ' 105" to="' + (sens * 360) + " " + cx + ' 105" dur="' + dur + 's" repeatCount="indefinite"/>') + "</g>"; }
      function dess() {
        var n2 = n1 * d1 / d2, K = 75 / Math.max(d1, d2), r1 = d1 * K, r2 = d2 * K, c1 = 110, c2 = eng ? c1 + r1 + r2 : 330, h = "", du = function (n) { return Math.max(0.25, Math.min(6, 400 / n)).toFixed(2); };
        if (!eng) h += trait(c1, 105 - r1, c2, 105 - r2, GR, 3) + trait(c1, 105 + r1, c2, 105 + r2, GR, 3);
        h += roue(c1, r1, du(n1), 1) + roue(c2, r2, du(n2), eng ? -1 : 1); s.innerHTML = h;
        f.r.innerHTML = "Vitesse du récepteur : <b>" + nb(n2, 0) + " tr/min</b> · rapport : <b>" + nb(d1 / d2) + "</b> · sens " + (eng ? "<b>inversé</b>" : "<b>conservé</b>") + (n2 > n1 ? " · la machine accélère" : n2 < n1 ? " · la machine ralentit" : "");
      } dess();
    },
    sinus: function (b, o) {
      var f = cadre(b), U = o.u || 311, fq = o.f || 50, s = plan(f.z, 440, 200);
      curseur(f.c, "Tension maximale (V)", 10, 400, 1, U, function (v) { U = v; dess(); }); curseur(f.c, "Fréquence (Hz)", 10, 100, 5, fq, function (v) { fq = v; dess(); });
      function dess() { var d = "", A = U / 400 * 80, cycles = fq * 0.04; for (var x = 0; x <= 400; x += 2) d += (x ? " L" : "M") + (20 + x) + " " + (100 - A * Math.sin(2 * Math.PI * cycles * x / 400)).toFixed(1); s.innerHTML = trait(20, 100, 420, 100, GR, 1.5) + trait(20, 15, 20, 185, GR, 1.5) + '<path d="' + d + '" fill="none" stroke="' + BL + '" stroke-width="3"/>' + txt(415, 118, "t", NU, "end"); f.r.innerHTML = "T = 1 / f = <b>" + nb(1 / fq, 3) + " s</b> · U efficace = Umax / √2 = <b>" + nb(U / Math.SQRT2) + " V</b>"; } dess();
    },
    ph: function (b) {
      var P = [["Citron", 2], ["Vinaigre", 3], ["Eau pure", 7], ["Savon", 10], ["Eau de Javel", 12]], f = cadre(b), v = 7, s = plan(f.z, 460, 70);
      var i = curseur(f.c, "pH", 0, 14, 0.5, v, function (x) { v = x; dess(); });
      P.forEach(function (p) { var c = el("button", "btn-l", p[0]); c.type = "button"; c.onclick = function () { v = p[1]; i.value = v; dess(); }; f.c.appendChild(c); });
      function dess() { var h = "", X = function (a) { return 20 + a / 14 * 420; }; for (var a = 0; a < 14; a++) h += '<rect x="' + X(a) + '" y="16" width="30" height="20" fill="hsl(' + (a / 14 * 250) + ',70%,62%)"/>'; h += point(X(v), 26, NU) + txt(X(v), 58, nb(v), NU, "middle"); s.innerHTML = h; f.r.innerHTML = "pH " + nb(v) + " : solution <b>" + (v < 7 ? "acide" : v > 7 ? "basique" : "neutre") + "</b>."; } dess();
    },
    moteur: function (b, o) {
      var Tp = [["Admission", 130, "Le piston descend, la soupape d'admission est ouverte : " + (o.diesel ? "de l'air seul entre." : "le mélange air-essence entre.")], ["Compression", 40, "Le piston remonte, les deux soupapes sont fermées : le contenu du cylindre est comprimé."], ["Combustion et détente", 130, o.diesel ? "Le gazole est injecté dans l'air très chaud : il s'enflamme seul et repousse le piston. C'est le temps moteur." : "La bougie produit une étincelle : le mélange brûle et repousse le piston. C'est le temps moteur."], ["Échappement", 40, "Le piston remonte, la soupape d'échappement est ouverte : les gaz brûlés sortent."]], f = cadre(b), k = 0, s = plan(f.z, 240, 230);
      var bt = el("button", "btn-l", "Temps suivant"); bt.type = "button"; f.c.appendChild(bt); bt.onclick = function () { k = (k + 1) % 4; dess(); };
      function dess() { var t = Tp[k], y = t[1], br = k === 2; s.innerHTML = '<rect x="70" y="20" width="100" height="150" fill="' + (br ? "#FFE9A8" : "#F4F8FF") + '" stroke="' + NU + '" stroke-width="3"/><rect x="72" y="' + y + '" width="96" height="30" fill="' + GR + '"/>' + trait(120, y + 30, 120, 215, NU, 6) + trait(85, 12, 85, 20, k === 0 ? VE : NU, 5) + trait(155, 12, 155, 20, k === 3 ? OR : NU, 5); f.r.innerHTML = "<b>" + (k + 1) + ". " + t[0] + "</b> : " + t[2]; } dess();
    },
    circuit: function (b, o) {
      var f = cadre(b), va = o.mode === "vaetvient", s1 = false, s2 = false, s = plan(f.z, 420, 120);
      function bouton(l, cb) { var c = el("button", "btn-l", l); c.type = "button"; c.onclick = cb; f.c.appendChild(c); }
      bouton(va ? "Interrupteur du bas" : "Interrupteur", function () { s1 = !s1; dess(); }); if (va) bouton("Interrupteur du haut", function () { s2 = !s2; dess(); });
      function dess() { var on = va ? s1 !== s2 : s1, h = trait(20, 60, 120, 60, OR, 3) + trait(120, 60, 165, s1 ? 60 : 32, NU, 4); if (va) h += trait(205, 60, 250, s2 ? 60 : 32, NU, 4) + trait(165, 60, 205, 60, on ? OR : GR, 3) + trait(250, 60, 310, 60, on ? OR : GR, 3); else h += trait(165, 60, 310, 60, on ? OR : GR, 3); h += '<circle cx="340" cy="60" r="28" fill="' + (on ? "#FFC93C" : "#EEF1F6") + '" stroke="' + NU + '" stroke-width="2"/>' + trait(368, 60, 410, 60, BL, 3) + txt(22, 50, "Phase", OR) + txt(412, 50, "Neutre", BL, "end"); s.innerHTML = h; f.r.innerHTML = "La lampe est <b>" + (on ? "allumée" : "éteinte") + "</b>." + (va ? " Chaque interrupteur inverse l'état de la lampe." : ""); } dess();
    },
    equilibre: function (b, o) {
      var f = cadre(b), T0 = o.reactifs.concat(o.produits), co = T0.map(function () { return 1; }), R = o.reactifs.length;
      T0.forEach(function (c, i) { curseur(f.c, "Coefficient de " + c.f, 1, 8, 1, 1, function (v) { co[i] = v; dess(); }); });
      function dess() { var g = {}, d = {}; T0.forEach(function (c, i) { var t = i < R ? g : d; Object.keys(c.at).forEach(function (a) { t[a] = (t[a] || 0) + co[i] * c.at[a]; }); }); var ok = Object.keys(g).every(function (a) { return g[a] === d[a]; }); function ec(l, dep) { return l.map(function (c, i) { var n = co[dep + i]; return (n > 1 ? n + " " : "") + c.f; }).join(" + "); } f.z.innerHTML = '<div class="labo-en"><span class="oui">' + ec(o.reactifs, 0) + " → " + ec(o.produits, R) + "</span></div>"; f.r.innerHTML = Object.keys(g).map(function (a) { return a + " : " + g[a] + " à gauche, " + (d[a] || 0) + " à droite"; }).join(" · ") + " — " + (ok ? '<b style="color:' + VE + '">équation équilibrée</b>' : '<b style="color:' + OR + '">pas encore équilibrée</b>'); } dess();
    },
    distillation: function (b) {
      var C = [["Gaz (butane, propane)", 0, 30], ["Essence", 30, 180], ["Kérosène", 180, 250], ["Gazole", 250, 350], ["Résidus (fioul lourd, bitume)", 350, 500]], f = cadre(b), t = 120, s = plan(f.z, 300, 240);
      curseur(f.c, "Température (°C)", 0, 450, 5, t, function (v) { t = v; dess(); });
      function dess() { var a = 0, h = ""; C.forEach(function (c, i) { var y = 15 + i * 42, on = t >= c[1] && t < c[2]; if (on) a = i; h += '<rect x="30" y="' + y + '" width="240" height="38" fill="' + (on ? "#FFC93C" : CL) + '" stroke="' + NU + '"/>' + txt(150, y + 24, c[0], NU, "middle"); }); s.innerHTML = h; f.r.innerHTML = "À " + t + " °C, on recueille surtout : <b>" + C[a][0] + "</b> (repères scolaires, à titre indicatif)."; } dess();
    },
    coupe: function (b) {
      var f = cadre(b), y = 60, c = false, s = plan(f.z, 420, 180);
      var bt = el("button", "btn-l", "Couper la pièce"); bt.type = "button"; f.c.appendChild(bt); bt.onclick = function () { c = !c; bt.textContent = c ? "Voir la pièce entière" : "Couper la pièce"; dess(); };
      function dess() { var def = '<defs><pattern id="hach" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="9" stroke="' + NU + '" stroke-width="1.2"/></pattern></defs>'; s.innerHTML = def + (c ? '<rect x="110" y="30" width="200" height="120" fill="url(#hach)" stroke="' + NU + '" stroke-width="3"/><rect x="185" y="30" width="50" height="120" fill="#fff" stroke="' + NU + '" stroke-width="2"/>' : '<rect x="110" y="30" width="200" height="120" fill="' + CL + '" stroke="' + NU + '" stroke-width="3"/>' + trait(185, 30, 185, 150, GR, 1.5, true) + trait(235, 30, 235, 150, GR, 1.5, true)); f.r.innerHTML = c ? "Les parties pleines coupées sont <b>hachurées</b>. Le trou, vide, reste blanc." : "Vue extérieure : le trou intérieur n'apparaît qu'en <b>traits interrompus</b>."; } dess();
    },
    trier: function (b, o) {
      var f = cadre(b); o.items.forEach(function (x) { var c = el("button", "btn-l", x[0]); c.type = "button"; c.onclick = function () { f.r.innerHTML = "<b>" + x[0] + "</b> : " + x[1]; }; f.c.appendChild(c); });
      f.r.textContent = o.invite || "Choisis un élément.";
    },
    courant: function (b) {
      var S = [[0, "à peine perceptible"], [1, "picotements"], [10, "contraction des muscles : on ne peut plus lâcher"], [30, "paralysie respiratoire possible"], [75, "fibrillation cardiaque, risque mortel"]], f = cadre(b), v = 5;
      curseur(f.c, "Intensité traversant le corps (mA)", 0, 150, 1, v, function (x) { v = x; dess(); });
      function dess() { var t = S[0][1]; S.forEach(function (s) { if (v >= s[0]) t = s[1]; }); f.r.innerHTML = v + " mA : <b>" + t + "</b> (repères indicatifs)." + (v >= 30 ? ' Un disjoncteur différentiel de 30 mA coupe le circuit.' : ""); } dess();
    },
    etapes: function (b, o) {
      var f = cadre(b), k = 0, n = o.items.length, s = plan(f.z, 440, 58), bt = el("button", "btn-l", "Étape suivante"), av = el("button", "btn-l", "Étape précédente"); bt.type = av.type = "button"; f.c.appendChild(av); f.c.appendChild(bt);
      bt.onclick = function () { k = Math.min(n - 1, k + 1); dess(); }; av.onclick = function () { k = Math.max(0, k - 1); dess(); };
      function dess() { var h = trait(30, 28, 410, 28, GR, 2), X = function (i) { return n > 1 ? 30 + i * 380 / (n - 1) : 220; }; for (var i = 0; i < n; i++) h += '<circle cx="' + X(i) + '" cy="28" r="' + (i === k ? 15 : 11) + '" fill="' + (i <= k ? BL : "#EEF1F6") + '"/>' + txt(X(i), 33, i + 1, i <= k ? "#fff" : NU, "middle"); s.innerHTML = h; f.r.innerHTML = "<b>" + o.items[k][0] + "</b> : " + o.items[k][1]; bt.disabled = k === n - 1; av.disabled = k === 0; } dess();
    },
    bacteries: function (b, o) {
      var f = cadre(b), t = 2, d = o.doublement || 20, s = plan(f.z, 440, 180);
      curseur(f.c, "Durée (h)", 0, 8, 0.5, t, function (v) { t = v; dess(); });
      function N(h) { return Math.pow(2, h * 60 / d); }
      function dess() { var h = "", M = Math.log10(N(8)); for (var i = 0; i <= 16; i++) { var x = i / 2, on = x <= t, H = Math.log10(N(x)) / M * 140 + 2; h += '<rect x="' + (26 + i * 24) + '" y="' + (160 - H) + '" width="19" height="' + H + '" fill="' + (on ? BL : "#EEF1F6") + '"/>'; } s.innerHTML = h + trait(20, 160, 430, 160, NU, 1.5) + txt(430, 176, "temps", NU, "end"); var v = N(t); f.r.innerHTML = "Une bactérie qui se divise toutes les " + d + " min donne, après " + nb(t) + " h : <b>" + (v < 1e9 ? Math.round(v).toLocaleString("fr-FR") : nb(v / Math.pow(10, Math.floor(Math.log10(v))), 2) + " × 10<sup>" + Math.floor(Math.log10(v)) + "</sup>") + "</b> bactéries (échelle du graphique compressée, conditions idéales)."; } dess();
    },
    abo: function (b) {
      var G = ["AA", "AO", "BB", "BO", "AB", "OO"], f = cadre(b), p = "AO", m = "BO";
      function liste(l, v, cb) { var w = el("label", "labo-c", "<span>" + l + "</span>"), s = el("select", "labo-sel"); G.forEach(function (g) { var o = el("option", null, g); o.value = g; s.appendChild(o); }); s.value = v; s.onchange = function () { cb(s.value); }; w.appendChild(s); f.c.appendChild(w); }
      liste("Génotype du père", p, function (v) { p = v; dess(); }); liste("Génotype de la mère", m, function (v) { m = v; dess(); });
      function gr(a, c) { var s = [a, c].sort().join(""); return s === "AB" ? "AB" : (a === "A" || c === "A") ? "A" : (a === "B" || c === "B") ? "B" : "O"; }
      function dess() { var R = {}; [p[0], p[1]].forEach(function (a) { [m[0], m[1]].forEach(function (c) { var g = gr(a, c); R[g] = (R[g] || 0) + 25; }); }); f.z.innerHTML = '<div class="labo-en">' + Object.keys(R).sort().map(function (g) { return '<span class="oui">Groupe ' + g + " : " + R[g] + " %</span>"; }).join("") + "</div>"; f.r.innerHTML = "Le groupe de l'enfant dépend de l'allèle reçu de chaque parent. A et B sont codominants, O est récessif."; } dess();
    },
    caryotype: function (b) {
      var f = cadre(b), m = "f", s = plan(f.z, 460, 190);
      [["f", "Fille"], ["g", "Garçon"], ["t", "Trisomie 21"]].forEach(function (x) { var c = el("button", "btn-l", x[1]); c.type = "button"; c.onclick = function () { m = x[0]; dess(); }; f.c.appendChild(c); });
      function dess() { var h = "", tot = 0; for (var i = 1; i <= 23; i++) { var n = (i === 21 && m === "t") ? 3 : 2, col = (i - 1) % 8, li = Math.floor((i - 1) / 8), x = 18 + col * 55, y = 10 + li * 60, H = 34 - i * 0.7; tot += n; for (var j = 0; j < n; j++) { var sex = i === 23, court = sex && m === "g" && j === 1; h += '<rect x="' + (x + j * 12) + '" y="' + (y + (court ? 12 : 0)) + '" width="8" height="' + (court ? 16 : H) + '" rx="4" fill="' + (sex ? OR : i === 21 && m === "t" ? VE : BL) + '"/>'; } h += txt(x + 8, y + 50, i === 23 ? (m === "g" ? "XY" : "XX") : i, NU, "start"); } s.innerHTML = h; f.r.innerHTML = "<b>" + tot + " chromosomes</b>" + (m === "t" ? " : un chromosome 21 supplémentaire." : m === "g" ? ", avec la paire sexuelle XY." : ", avec la paire sexuelle XX."); } dess();
    },
    coeur: function (b) {
      var f = cadre(b), n = 70, v = 70, s = plan(f.z, 240, 170), red = W.matchMedia && W.matchMedia("(prefers-reduced-motion: reduce)").matches;
      curseur(f.c, "Battements par minute", 40, 180, 5, n, function (x) { n = x; dess(); }); curseur(f.c, "Volume éjecté (mL)", 40, 120, 5, v, function (x) { v = x; dess(); });
      function dess() { var d = (60 / n).toFixed(2); s.innerHTML = '<path d="M120 150 C30 95 30 28 85 28 C105 28 116 40 120 52 C124 40 135 28 155 28 C210 28 210 95 120 150Z" fill="#C24E00">' + (red ? "" : '<animateTransform attributeName="transform" type="scale" values="1;1.05;1" dur="' + d + 's" repeatCount="indefinite" additive="sum"/>') + "</path>"; f.r.innerHTML = "Débit cardiaque : <b>" + nb(n * v / 1000, 1) + " L/min</b>." + (n > 100 ? " Rythme rapide, comme après un effort." : n < 60 ? " Rythme lent." : " Rythme habituel au repos."); } dess();
    },
    oeil: function (b) {
      var f = cadre(b), m = "n", c = false, s = plan(f.z, 440, 190);
      [["n", "Œil normal"], ["m", "Myope"], ["h", "Hypermétrope"]].forEach(function (x) { var d = el("button", "btn-l", x[1]); d.type = "button"; d.onclick = function () { m = x[0]; c = false; dess(); }; f.c.appendChild(d); });
      var co = el("button", "btn-l", "Avec ou sans verre correcteur"); co.type = "button"; co.onclick = function () { c = !c; dess(); }; f.c.appendChild(co);
      function dess() { var xf = (m === "n" || c) ? 370 : m === "m" ? 335 : 405, h = '<circle cx="310" cy="95" r="70" fill="#F4F8FF" stroke="' + NU + '" stroke-width="2.5"/><path d="M370 45 A70 70 0 0 1 370 145" fill="none" stroke="' + OR + '" stroke-width="5"/>' + '<ellipse cx="256" cy="95" rx="8" ry="30" fill="' + CL + '" stroke="' + BL + '" stroke-width="2"/>'; [-22, 0, 22].forEach(function (y) { h += trait(20, 95 + y, 256, 95 + y, BL, 2) + trait(256, 95 + y, xf, 95, BL, 2); }); if (c && m !== "n") h += '<rect x="196" y="55" width="7" height="80" fill="' + VE + '"/>'; h += txt(370, 182, "rétine", OR, "middle"); s.innerHTML = h; f.r.innerHTML = c && m !== "n" ? "Le verre " + (m === "m" ? "<b>divergent</b>" : "<b>convergent</b>") + " ramène l'image sur la rétine." : m === "n" ? "L'image se forme <b>sur la rétine</b> : la vision est nette." : m === "m" ? "L'image se forme <b>devant la rétine</b> : les objets éloignés sont flous." : "L'image se forme <b>derrière la rétine</b> : les objets proches sont flous."; } dess();
    },
    seisme: function (b) {
      var f = cadre(b), M = 5, s = plan(f.z, 440, 140);
      curseur(f.c, "Magnitude", 1, 9, 0.5, M, function (v) { M = v; dess(); });
      function dess() { var d = "", A = Math.min(55, Math.pow(1.72, M)); for (var x = 0; x <= 400; x += 2) { var e = Math.exp(-Math.pow((x - 200) / 90, 2)); d += (x ? " L" : "M") + (20 + x) + " " + (70 - A * e * Math.sin(x / 5)).toFixed(1); } s.innerHTML = '<path d="' + d + '" fill="none" stroke="' + OR + '" stroke-width="2"/>'; var E = Math.pow(10, 1.5 * (M - 5)); f.r.innerHTML = "Magnitude " + nb(M) + " : énergie " + (M >= 5 ? "<b>" + nb(E, E < 10 ? 1 : 0) + " fois</b> celle d'un séisme de magnitude 5" : "bien inférieure à celle d'un séisme de magnitude 5") + ". Chaque degré entier multiplie l'énergie libérée par environ 32."; } dess();
    },
    pente: function (b) {
      var f = cadre(b), p = 35, r = 60, v = 30, s = plan(f.z, 300, 170);
      curseur(f.c, "Pente (°)", 0, 60, 5, p, function (x) { p = x; dess(); }); curseur(f.c, "Pluie (%)", 0, 100, 5, r, function (x) { r = x; dess(); }); curseur(f.c, "Végétation (%)", 0, 100, 5, v, function (x) { v = x; dess(); });
      function dess() { var q = Math.max(0, Math.min(100, p * 1.2 + r * 0.5 - v * 0.5)), y = 150 - Math.tan(p * Math.PI / 180) * 110; s.innerHTML = '<path d="M20 150 L280 150 L280 ' + Math.max(10, y) + ' Z" fill="#CDB892"/><rect x="20" y="160" width="' + (q * 2.6) + '" height="9" fill="' + (q > 66 ? OR : q > 33 ? "#E5A100" : VE) + '"/>'; f.r.innerHTML = "Risque estimé : <b>" + (q > 66 ? "élevé" : q > 33 ? "moyen" : "faible") + "</b> (modèle scolaire simplifié, qui ne remplace pas une étude de terrain)."; } dess();
    },
    chaine: function (b, o) {
      var f = cadre(b), m = o.maillons, i0 = -1;
      m.forEach(function (x, i) { var c = el("button", "btn-l", "Retirer : " + x); c.type = "button"; c.onclick = function () { i0 = i; dess(); }; f.c.appendChild(c); });
      function dess() { f.z.innerHTML = '<div class="labo-en">' + m.map(function (x, i) { return '<span class="' + (i !== i0 ? "oui" : "") + '">' + x + "</span>"; }).join(" ") + "</div>"; if (i0 < 0) { f.r.textContent = "Retire un maillon pour voir les conséquences."; return; } var av = i0 > 0 ? m[i0 - 1] : null, ap = i0 < m.length - 1 ? m[i0 + 1] : null; f.r.innerHTML = "Sans <b>" + m[i0] + "</b> : " + (ap ? ap + " manque de nourriture et diminue" : "aucun maillon au-dessus n'en dépend directement") + (av ? " ; " + av + ", moins consommé, se multiplie d'abord" : "") + ". Tout l'écosystème est déséquilibré."; } dess();
    },
    epidemie: function (b, o) {
      var f = cadre(b), R = o.r || 2.5, p = 0, s = plan(f.z, 440, 180);
      curseur(f.c, "Personnes contaminées par chaque malade", 0.5, 5, 0.1, R, function (v) { R = v; dess(); }); curseur(f.c, "Personnes protégées (%)", 0, 95, 5, p, function (v) { p = v; dess(); });
      function dess() { var e = R * (1 - p / 100), L = [], x = 10; for (var i = 0; i < 7; i++) { L.push(x); x *= e; } var M = Math.max.apply(null, L.concat(10)), h = ""; L.forEach(function (v, i) { var H = v / M * 140; h += '<rect x="' + (30 + i * 56) + '" y="' + (160 - H) + '" width="40" height="' + H + '" fill="' + (e > 1 ? OR : VE) + '"/>' + txt(50 + i * 56, 176, i + 1, NU, "middle"); }); s.innerHTML = h; f.r.innerHTML = "Chaque malade contamine en moyenne <b>" + nb(e) + "</b> personne(s) : l'épidémie " + (e > 1 ? "<b>progresse</b>" : e < 1 ? "<b>recule</b>" : "<b>stagne</b>") + ". Dernière génération : environ <b>" + Math.round(L[6]).toLocaleString("fr-FR") + "</b> cas (modèle simplifié)."; } dess();
    },
    courbe: function (b, o) {
      var FN = { ln: [Math.log, function (x) { return 1 / x; }, "ln x"], exp: [Math.exp, Math.exp, "eˣ"], sin: [Math.sin, Math.cos, "sin x"], cos: [Math.cos, function (x) { return -Math.sin(x); }, "cos x"], x2: [function (x) { return x * x; }, function (x) { return 2 * x; }, "x²"], x3: [function (x) { return x * x * x; }, function (x) { return 3 * x * x; }, "x³"], inv: [function (x) { return 1 / x; }, function (x) { return -1 / (x * x); }, "1/x"], racine: [Math.sqrt, function (x) { return 1 / (2 * Math.sqrt(x)); }, "√x"] };
      var F = FN[o.fn], f = cadre(b), xm = o.xmin, xM = o.xmax, ym = o.ymin, yM = o.ymax, x0 = o.x0 == null ? (xm + xM) / 2 : o.x0, s = plan(f.z, 440, 300), debut = o.debut == null ? xm : o.debut;
      curseur(f.c, "x₀", debut, xM, (xM - xm) / 100, x0, function (v) { x0 = v; dess(); });
      function dess() { var R = repere(s, 440, 300, xm, xM, ym, yM), h = R.base, d = "", n = 0, B = function (y) { return Math.max(ym - 1, Math.min(yM + 1, y)); }; for (var i = 0; i <= 200; i++) { var x = debut + i * (xM - debut) / 200, y = F[0](x); if (isFinite(y)) d += (n++ ? " L" : "M") + R.x(x).toFixed(1) + " " + R.y(B(y)).toFixed(1); } h += '<path d="' + d + '" fill="none" stroke="' + BL + '" stroke-width="3"/>'; if (o.reciproque) { var e = "", k = 0; for (i = 0; i <= 200; i++) { x = debut + i * (xM - debut) / 200; y = F[0](x); if (isFinite(y) && y >= xm && y <= xM) e += (k++ ? " L" : "M") + R.x(y).toFixed(1) + " " + R.y(x).toFixed(1); } h += '<path d="' + e + '" fill="none" stroke="' + OR + '" stroke-width="2.5"/>' + trait(R.x(Math.max(xm, ym)), R.y(Math.max(xm, ym)), R.x(Math.min(xM, yM)), R.y(Math.min(xM, yM)), GR, 1.5, true); } var y0 = F[0](x0), p = F[1](x0); if (isFinite(y0) && isFinite(p)) { h += trait(R.x(xm), R.y(B(y0 + p * (xm - x0))), R.x(xM), R.y(B(y0 + p * (xM - x0))), OR, 1.5, true) + point(R.x(x0), R.y(B(y0))); } s.innerHTML = h; f.r.innerHTML = "f(x) = " + F[2] + " · f(x₀) = <b>" + nb(y0, 3) + "</b> · coefficient directeur de la tangente : <b>" + nb(p, 3) + "</b>" + (o.reciproque ? " · en orange, la courbe réciproque" : ""); } dess();
    },
    integrale: function (b, o) {
      var F = { x2: [function (x) { return x * x; }, function (x) { return x * x * x / 3; }, "x²"], inv: [function (x) { return 1 / x; }, Math.log, "1/x"], exp: [Math.exp, Math.exp, "eˣ"], racine: [Math.sqrt, function (x) { return 2 / 3 * Math.pow(x, 1.5); }, "√x"] }[o.fn], f = cadre(b), a = o.a, c = o.b, n = o.n || 8, s = plan(f.z, 440, 280), xM = o.xmax, yM = o.ymax;
      curseur(f.c, "Borne a", o.amin, xM, 0.1, a, function (v) { a = v; dess(); }); curseur(f.c, "Borne b", o.amin, xM, 0.1, c, function (v) { c = v; dess(); }); curseur(f.c, "Nombre de rectangles", 2, 60, 1, n, function (v) { n = v; dess(); });
      function dess() { var R = repere(s, 440, 280, 0, xM, 0, yM), h = R.base, A = Math.min(a, c), B = Math.max(a, c), l = (B - A) / n, so = 0; for (var i = 0; i < n; i++) { var x = A + i * l, y = F[0](x); so += y * l; h += '<rect x="' + R.x(x).toFixed(1) + '" y="' + R.y(y).toFixed(1) + '" width="' + (R.x(x + l) - R.x(x)).toFixed(1) + '" height="' + (R.y(0) - R.y(y)).toFixed(1) + '" fill="' + CL + '" stroke="' + BL + '" stroke-width=".8"/>'; } var d = ""; for (i = 0; i <= 120; i++) { x = o.amin + i * (xM - o.amin) / 120; d += (i ? " L" : "M") + R.x(x).toFixed(1) + " " + R.y(Math.min(yM + 1, F[0](x))).toFixed(1); } h += '<path d="' + d + '" fill="none" stroke="' + OR + '" stroke-width="3"/>'; s.innerHTML = h; f.r.innerHTML = "f(x) = " + F[2] + " · somme des rectangles : <b>" + nb(so, 3) + "</b> · valeur exacte de l'intégrale : <b>" + nb(F[1](B) - F[1](A), 3) + "</b>"; } dess();
    },
    complexe: function (b, o) {
      var f = cadre(b), x = o.a == null ? 2 : o.a, y = o.b == null ? 1 : o.b, t = o.angle || 90, k = o.k || 1, s = plan(f.z, 360, 300), sim = o.mode === "similitude";
      curseur(f.c, "Partie réelle a", -5, 5, 0.5, x, function (v) { x = v; dess(); }); curseur(f.c, "Partie imaginaire b", -5, 5, 0.5, y, function (v) { y = v; dess(); });
      if (sim) { curseur(f.c, "Angle (°)", -180, 180, 15, t, function (v) { t = v; dess(); }); curseur(f.c, "Rapport k", 0.5, 2.5, 0.25, k, function (v) { k = v; dess(); }); }
      function dess() { var R = repere(s, 360, 300, -7, 7, -7, 7), h = R.base + trait(R.x(0), R.y(0), R.x(x), R.y(y), BL, 3) + point(R.x(x), R.y(y), BL) + txt(R.x(x) + 8, R.y(y) - 6, "M(z)"), m = Math.sqrt(x * x + y * y), g = Math.atan2(y, x) * 180 / Math.PI; if (sim) { var a = t * Math.PI / 180, X = k * (x * Math.cos(a) - y * Math.sin(a)), Y = k * (x * Math.sin(a) + y * Math.cos(a)); h += trait(R.x(0), R.y(0), R.x(X), R.y(Y), OR, 3) + point(R.x(X), R.y(Y)) + txt(R.x(X) + 8, R.y(Y) - 6, "M'", OR); f.r.innerHTML = "z' = a·z avec |a| = <b>" + nb(k) + "</b>, arg a = <b>" + t + "°</b> · z' ≈ <b>" + nb(X) + " + " + nb(Y) + "i</b> · |z'| = <b>" + nb(k * m) + "</b>"; } else { h += trait(R.x(0), R.y(0), R.x(x), R.y(-y), OR, 2, true) + point(R.x(x), R.y(-y)) + txt(R.x(x) + 8, R.y(-y) + 14, "conjugué", OR); f.r.innerHTML = "z = " + nb(x) + (y < 0 ? " − " + nb(-y) : " + " + nb(y)) + "i · |z| = <b>" + nb(m) + "</b> · arg z ≈ <b>" + nb(g, 1) + "°</b> · z z̄ = <b>" + nb(x * x + y * y) + "</b>"; } s.innerHTML = h; } dess();
    },
    suite: function (b, o) {
      var f = cadre(b), a = o.a, c = o.b, u = o.u0, s = plan(f.z, 440, 240);
      curseur(f.c, "a", -1.5, 1.5, 0.05, a, function (v) { a = v; dess(); }); curseur(f.c, "b", -5, 5, 0.5, c, function (v) { c = v; dess(); }); curseur(f.c, "u₀", -8, 8, 0.5, u, function (v) { u = v; dess(); });
      function dess() { var L = [u], i, h = ""; for (i = 0; i < 14; i++) L.push(a * L[i] + c); var M = Math.max.apply(null, L.map(Math.abs).concat(1)); h += trait(20, 120, 430, 120, GR, 1.5); L.forEach(function (v, k) { h += point(26 + k * 28, 120 - v / M * 100, k === 0 ? OR : BL); }); s.innerHTML = h; var lim = Math.abs(a) < 1 ? c / (1 - a) : null; f.r.innerHTML = "uₙ₊₁ = " + nb(a) + " uₙ " + (c < 0 ? "− " + nb(-c) : "+ " + nb(c)) + (lim === null ? " · la suite ne converge pas en général (|a| ≥ 1)" : " · la suite converge vers <b>" + nb(lim, 3) + "</b>") + " · u₁₄ ≈ <b>" + nb(L[14], 3) + "</b>"; } dess();
    },
    binomiale: function (b, o) {
      var f = cadre(b), n = o.n || 10, p = o.p || 0.3, s = plan(f.z, 440, 210);
      curseur(f.c, "n (épreuves)", 1, 30, 1, n, function (v) { n = v; dess(); }); curseur(f.c, "p (succès)", 0.05, 0.95, 0.05, p, function (v) { p = v; dess(); });
      function C(a, k) { var r = 1; for (var i = 1; i <= k; i++) r = r * (a - k + i) / i; return r; }
      function dess() { var L = [], M = 0, k, h = ""; for (k = 0; k <= n; k++) { var v = C(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k); L.push(v); M = Math.max(M, v); } var w = 400 / (n + 1); L.forEach(function (v, i) { var H = v / M * 160; h += '<rect x="' + (20 + i * w) + '" y="' + (185 - H) + '" width="' + Math.max(2, w - 2) + '" height="' + H + '" fill="' + BL + '"/>'; if (n <= 15 || i % 5 === 0) h += txt(20 + i * w + w / 2, 202, i, NU, "middle"); }); s.innerHTML = h; f.r.innerHTML = "E(X) = np = <b>" + nb(n * p) + "</b> · V(X) = np(1 − p) = <b>" + nb(n * p * (1 - p), 3) + "</b> · P(X = 0) = <b>" + nb(L[0], 4) + "</b>"; } dess();
    },
    arbre: function (b, o) {
      var f = cadre(b), a = o.a, x = o.x, y = o.y;
      curseur(f.c, "P(A)", 0.05, 0.95, 0.05, a, function (v) { a = v; dess(); }); curseur(f.c, "P sachant A de B", 0, 1, 0.05, x, function (v) { x = v; dess(); }); curseur(f.c, "P sachant non-A de B", 0, 1, 0.05, y, function (v) { y = v; dess(); });
      function dess() { var t = a * x + (1 - a) * y; f.r.innerHTML = "P(A ∩ B) = <b>" + nb(a * x, 4) + "</b> · P(B) = <b>" + nb(t, 4) + "</b> (probabilités totales) · P<sub>B</sub>(A) = <b>" + nb(t ? a * x / t : 0, 4) + "</b>"; } dess();
    },
    nuage: function (b, o) {
      var f = cadre(b), P = o.pts.map(function (p) { return p.slice(); }), s = plan(f.z, 440, 270);
      P.forEach(function (p, i) { curseur(f.c, "y" + (i + 1) + " (x = " + p[0] + ")", 0, o.ymax, 0.5, p[1], function (v) { p[1] = v; dess(); }); });
      function dess() { var n = P.length, sx = 0, sy = 0, sxy = 0, sxx = 0, syy = 0; P.forEach(function (p) { sx += p[0]; sy += p[1]; sxy += p[0] * p[1]; sxx += p[0] * p[0]; syy += p[1] * p[1]; }); var mx = sx / n, my = sy / n, cv = sxy / n - mx * my, vx = sxx / n - mx * mx, vy = syy / n - my * my, a = cv / vx, c = my - a * mx, r = cv / Math.sqrt(vx * vy || 1), xM = o.xmax, R = repere(s, 440, 270, 0, xM, 0, o.ymax), h = R.base + trait(R.x(0), R.y(c), R.x(xM), R.y(a * xM + c), OR, 2.5) + point(R.x(mx), R.y(my), VE); P.forEach(function (p) { h += point(R.x(p[0]), R.y(p[1]), BL); }); s.innerHTML = h; f.r.innerHTML = "G(<b>" + nb(mx) + " ; " + nb(my) + "</b>) · droite : y = <b>" + nb(a, 3) + "</b>x " + (c < 0 ? "− " + nb(-c, 3) : "+ " + nb(c, 3)) + " · r ≈ <b>" + nb(r, 3) + "</b>"; } dess();
    },
    graphe: function (b, o) {
      var f = cadre(b), n = o.n, A = o.aretes.map(function (a) { return a.concat([true]); }), s = plan(f.z, 320, 260);
      A.forEach(function (a, i) { var c = el("button", "btn-l", "Arête " + o.noms[a[0]] + o.noms[a[1]]); c.type = "button"; c.onclick = function () { a[2] = !a[2]; dess(); }; f.c.appendChild(c); });
      function pt(i) { var t = 2 * Math.PI * i / n - Math.PI / 2; return [160 + 95 * Math.cos(t), 125 + 95 * Math.sin(t)]; }
      function dess() { var d = []; for (var i = 0; i < n; i++) d.push(0); var h = "", m = 0; A.forEach(function (a) { if (!a[2]) return; m++; d[a[0]]++; d[a[1]]++; var p = pt(a[0]), q = pt(a[1]); h += trait(p[0], p[1], q[0], q[1], BL, 2.5); }); for (i = 0; i < n; i++) { var p = pt(i); h += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="15" fill="' + (d[i] % 2 ? "#FFE9A8" : CL) + '" stroke="' + NU + '"/>' + txt(p[0], p[1] + 5, o.noms[i], NU, "middle"); } s.innerHTML = h; var imp = d.filter(function (x) { return x % 2; }).length; f.r.innerHTML = "Degrés : " + d.join(", ") + " · somme = <b>" + d.reduce(function (x, y) { return x + y; }, 0) + "</b> = 2 × " + m + " arêtes · " + imp + " sommet(s) de degré impair : " + (imp === 0 ? "<b>cycle eulérien possible</b> si le graphe est connexe" : imp === 2 ? "<b>chaîne eulérienne possible</b> si le graphe est connexe" : "<b>pas de chaîne eulérienne</b>"); } dess();
    },
    dichotomie: function (b, o) {
      var f = cadre(b), a = o.a, c = o.b, k = 0, s = plan(f.z, 440, 80), g = function (x) { return x * x * x + x - 1; }, bt = el("button", "btn-l", "Couper l'intervalle en deux"); bt.type = "button"; f.c.appendChild(bt);
      bt.onclick = function () { var m = (a + c) / 2; if (g(a) * g(m) <= 0) c = m; else a = m; k++; dess(); };
      function dess() { var X = function (x) { return 30 + (x - o.a) / (o.b - o.a) * 380; }; s.innerHTML = trait(20, 35, 420, 35, GR, 2) + trait(X(a), 35, X(c), 35, OR, 7) + txt(X(a), 62, nb(a, 3), NU, "middle") + txt(X(c), 62, nb(c, 3), NU, "middle"); f.r.innerHTML = "f(x) = x³ + x − 1 : la solution α est dans <b>[" + nb(a, 4) + " ; " + nb(c, 4) + "]</b> après " + k + " étape(s), amplitude " + nb(c - a, 4) + "."; bt.disabled = k >= 14; } dess();
    },
    conique: function (b) {
      var f = cadre(b), e = 0.6, p = 2, s = plan(f.z, 440, 300);
      curseur(f.c, "Excentricité e", 0.1, 2.5, 0.05, e, function (v) { e = v; dess(); }); curseur(f.c, "Paramètre p", 0.5, 4, 0.25, p, function (v) { p = v; dess(); });
      function dess() { var R = repere(s, 440, 300, -10, 10, -8, 8), h = R.base, d = "", ouvert = false; for (var i = -179; i <= 179; i += 1) { var t = i * Math.PI / 180, q = 1 + e * Math.cos(t); if (q < 0.02) { ouvert = false; continue; } var r = e * p / q, x = r * Math.cos(t), y = r * Math.sin(t); if (Math.abs(x) > 10 || Math.abs(y) > 8) { ouvert = false; continue; } d += (ouvert ? " L" : "M") + R.x(x).toFixed(1) + " " + R.y(y).toFixed(1); ouvert = true; } h += '<path d="' + d + '" fill="none" stroke="' + BL + '" stroke-width="3"/>' + point(R.x(0), R.y(0)) + txt(R.x(0) + 8, R.y(0) - 8, "F", OR) + trait(R.x(p), R.y(-8), R.x(p), R.y(8), GR, 1.5, true) + txt(R.x(p) + 6, R.y(7), "D", NU); s.innerHTML = h; f.r.innerHTML = "e = <b>" + nb(e) + "</b> : c'est " + (Math.abs(e - 1) < 0.001 ? "une <b>parabole</b>" : e < 1 ? "une <b>ellipse</b>" : "une <b>hyperbole</b>") + " (MF = e × distance de M à D)."; } dess();
    },
    projectile: function (b, o) {
      var f = cadre(b), v = o.v || 20, a = o.angle || 45, s = plan(f.z, 440, 240), g = 10;
      curseur(f.c, "Vitesse initiale (m/s)", 5, 40, 1, v, function (x) { v = x; dess(); }); curseur(f.c, "Angle de tir (°)", 5, 85, 5, a, function (x) { a = x; dess(); });
      function dess() { var r = a * Math.PI / 180, P = v * v * Math.sin(2 * r) / g, H = Math.pow(v * Math.sin(r), 2) / (2 * g), K = Math.min(4, 400 / 160), K2 = 200 / 90, d = ""; for (var i = 0; i <= 80; i++) { var x = P * i / 80, y = x * Math.tan(r) - g * x * x / (2 * v * v * Math.cos(r) * Math.cos(r)); d += (i ? " L" : "M") + (20 + x * K).toFixed(1) + " " + (225 - y * K2).toFixed(1); } s.innerHTML = trait(20, 225, 430, 225, NU, 1.5) + '<path d="' + d + '" fill="none" stroke="' + BL + '" stroke-width="3"/>' + point(20 + P * K, 225); f.r.innerHTML = "Portée = v₀² sin 2α / g = <b>" + nb(P) + " m</b> · flèche = <b>" + nb(H) + " m</b> · durée du vol = <b>" + nb(2 * v * Math.sin(r) / g) + " s</b> (g = 10 m/s²)."; } dess();
    },
    pendule: function (b, o) {
      var f = cadre(b), L = o.l || 1, g = o.g || 9.8, s = plan(f.z, 300, 210), red = W.matchMedia && W.matchMedia("(prefers-reduced-motion: reduce)").matches;
      curseur(f.c, "Longueur L (m)", 0.1, 3, 0.1, L, function (x) { L = x; dess(); }); curseur(f.c, "g (m/s²)", 1.6, 25, 0.2, g, function (x) { g = x; dess(); });
      function dess() { var T = 2 * Math.PI * Math.sqrt(L / g), l = 50 + L * 40; s.innerHTML = trait(100, 12, 200, 12, NU, 3) + '<g>' + trait(150, 12, 150, 12 + l, NU, 2) + '<circle cx="150" cy="' + (12 + l) + '" r="11" fill="' + OR + '"/>' + (red ? "" : '<animateTransform attributeName="transform" type="rotate" values="-22 150 12;22 150 12;-22 150 12" dur="' + T.toFixed(2) + 's" repeatCount="indefinite"/>') + "</g>"; f.r.innerHTML = "T = 2π√(L/g) = <b>" + nb(T) + " s</b>. La masse n'intervient pas."; } dess();
    },
    rc: function (b, o) {
      var f = cadre(b), R = o.r || 1000, C = o.c || 100, E = o.e || 12, s = plan(f.z, 440, 220);
      curseur(f.c, "R (Ω)", 100, 10000, 100, R, function (x) { R = x; dess(); }); curseur(f.c, "C (µF)", 10, 1000, 10, C, function (x) { C = x; dess(); });
      function dess() { var t = R * C * 1e-6, d = ""; for (var i = 0; i <= 120; i++) { var x = i / 120 * 5; d += (i ? " L" : "M") + (30 + x * 78).toFixed(1) + " " + (195 - 170 * (1 - Math.exp(-x))).toFixed(1); } var yt = 195 - 170 * 0.63; s.innerHTML = trait(30, 195, 430, 195, NU, 1.5) + trait(30, 20, 30, 195, NU, 1.5) + '<path d="' + d + '" fill="none" stroke="' + BL + '" stroke-width="3"/>' + trait(30, yt, 108, yt, OR, 1.5, true) + trait(108, yt, 108, 195, OR, 1.5, true) + txt(108, 212, "τ", OR, "middle"); f.r.innerHTML = "τ = RC = <b>" + nb(t, 3) + " s</b> · à t = τ, le condensateur est chargé à <b>63 %</b> · charge quasi complète après 5τ, soit <b>" + nb(5 * t, 3) + " s</b>."; } dess();
    },
    resonance: function (b, o) {
      var f = cadre(b), R = o.r || 20, L = o.l || 0.1, C = o.c || 10, U = o.u || 10, s = plan(f.z, 440, 220);
      curseur(f.c, "R (Ω)", 5, 200, 5, R, function (x) { R = x; dess(); }); curseur(f.c, "L (H)", 0.02, 1, 0.02, L, function (x) { L = x; dess(); }); curseur(f.c, "C (µF)", 1, 100, 1, C, function (x) { C = x; dess(); });
      function dess() { var c = C * 1e-6, f0 = 1 / (2 * Math.PI * Math.sqrt(L * c)), fM = f0 * 2, d = "", Im = U / R; for (var i = 1; i <= 200; i++) { var v = fM * i / 200, w = 2 * Math.PI * v, Z = Math.sqrt(R * R + Math.pow(L * w - 1 / (c * w), 2)), I = U / Z; d += (i > 1 ? " L" : "M") + (30 + i * 2).toFixed(1) + " " + (195 - I / Im * 170).toFixed(1); } s.innerHTML = trait(30, 195, 430, 195, NU, 1.5) + trait(30, 20, 30, 195, NU, 1.5) + '<path d="' + d + '" fill="none" stroke="' + BL + '" stroke-width="3"/>' + trait(230, 25, 230, 195, OR, 1.5, true) + txt(230, 212, "f₀", OR, "middle"); f.r.innerHTML = "Résonance d'intensité à f₀ = 1 / (2π√(LC)) = <b>" + nb(f0, 1) + " Hz</b> · I max = U/R = <b>" + nb(Im, 3) + " A</b> pour U = " + U + " V."; } dess();
    },
    onde: function (b, o) {
      var f = cadre(b), F = o.f || 200, v = o.v || 0.4, k = 0, s = plan(f.z, 440, 130), bt = el("button", "btn-l", "Avancer d'un quart de période"); bt.type = "button";
      curseur(f.c, "Fréquence (Hz)", 10, 500, 10, F, function (x) { F = x; dess(); }); curseur(f.c, "Célérité (m/s)", 0.1, 340, 0.1, v, function (x) { v = x; dess(); }); f.c.appendChild(bt); bt.onclick = function () { k += Math.PI / 2; dess(); };
      function dess() { var d = ""; for (var x = 0; x <= 400; x += 2) d += (x ? " L" : "M") + (20 + x) + " " + (65 - 45 * Math.sin(x / 400 * 6 * Math.PI - k)).toFixed(1); s.innerHTML = trait(20, 65, 420, 65, GR, 1.5) + '<path d="' + d + '" fill="none" stroke="' + BL + '" stroke-width="3"/>'; f.r.innerHTML = "λ = v / f = <b>" + nb(v / F, 4) + " m</b> · T = 1 / f = <b>" + nb(1 / F, 4) + " s</b>."; } dess();
    },
    decroissance: function (b, o) {
      var f = cadre(b), T = o.t || 138, t = o.date || T, s = plan(f.z, 440, 220);
      curseur(f.c, "Demi-vie", 1, 500, 1, T, function (x) { T = x; dess(); }); curseur(f.c, "Date", 0, 1000, 5, t, function (x) { t = x; dess(); });
      function dess() { var M = Math.max(4 * T, t * 1.05), d = "", X = function (u) { return 30 + u / M * 400; }, r = Math.pow(2, -t / T); for (var i = 0; i <= 120; i++) { var u = M * i / 120; d += (i ? " L" : "M") + X(u).toFixed(1) + " " + (195 - 170 * Math.pow(2, -u / T)).toFixed(1); } s.innerHTML = trait(30, 195, 430, 195, NU, 1.5) + trait(30, 20, 30, 195, NU, 1.5) + '<path d="' + d + '" fill="none" stroke="' + BL + '" stroke-width="3"/>' + point(X(t), 195 - 170 * r); f.r.innerHTML = "λ = ln 2 / T = <b>" + nb(Math.LN2 / T, 5) + "</b> · il reste <b>" + nb(r * 100, 1) + " %</b> des noyaux à la date t."; } dess();
    },
    dosage: function (b, o) {
      var f = cadre(b), mode = o.mode || "fort", Ca = o.ca || 0.1, Va = o.va || 20, Cb = o.cb || 0.1, pKa = o.pka || 4.8, s = plan(f.z, 440, 250), V = 5;
      function ph(v) { var ve = Ca * Va / Cb, n = Ca * Va, x = Cb * v, W_ = Va + v; if (mode === "base") { if (v === 0) return 7 + 0.5 * (pKa + Math.log10(Ca)); if (x < n * 0.999) return pKa + Math.log10((n - x) / x); if (x <= n * 1.001) return 0.5 * (pKa - Math.log10(n / W_)); return -Math.log10((x - n) / W_); } if (x > n * 1.001) return 14 + Math.log10((x - n) / W_); if (mode === "fort") { if (x >= n * 0.999) return 7; return -Math.log10((n - x) / W_); } if (x >= n * 0.999) return 7 + 0.5 * (pKa + Math.log10(n / W_)); if (v === 0) return 0.5 * (pKa - Math.log10(Ca)); return pKa + Math.log10(x / (n - x)); }
      curseur(f.c, "Volume versé (mL)", 0, 40, 0.5, V, function (x) { V = x; dess(); }); if (mode !== "fort") curseur(f.c, "pKa", 2, 11, 0.1, pKa, function (x) { pKa = x; dess(); });
      function dess() { var ve = Ca * Va / Cb, X = function (v) { return 34 + v / 40 * 395; }, Y = function (p) { return 225 - p / 14 * 205; }, d = ""; for (var i = 0; i <= 400; i++) { var v = i / 10; d += (i ? " L" : "M") + X(v).toFixed(1) + " " + Y(Math.max(0, Math.min(14, ph(v)))).toFixed(1); } s.innerHTML = trait(34, 225, 430, 225, NU, 1.5) + trait(34, 20, 34, 225, NU, 1.5) + '<path d="' + d + '" fill="none" stroke="' + BL + '" stroke-width="3"/>' + trait(X(ve), 20, X(ve), 225, OR, 1.5, true) + point(X(V), Y(Math.max(0, Math.min(14, ph(V))))); f.r.innerHTML = "Vₑ = <b>" + nb(ve) + " mL</b> · pH à V = " + nb(V) + " mL : <b>" + nb(ph(V)) + "</b>" + (mode === "fort" ? " · à l'équivalence, pH = 7" : " · à la demi-équivalence, pH = pKa"); } dess();
    },
    cinetique: function (b, o) {
      var f = cadre(b), k = o.k || 0.2, n = o.n0 || 0.6, t = 5, s = plan(f.z, 440, 220);
      curseur(f.c, "Facteur de vitesse", 0.05, 1, 0.05, k, function (x) { k = x; dess(); }); curseur(f.c, "Date t (min)", 0, 30, 1, t, function (x) { t = x; dess(); });
      function dess() { var d = "", X = function (u) { return 30 + u / 30 * 400; }, g = function (u) { return n * (1 - Math.exp(-k * u)); }; for (var i = 0; i <= 120; i++) { var u = i / 4; d += (i ? " L" : "M") + X(u).toFixed(1) + " " + (195 - g(u) / n * 170).toFixed(1); } s.innerHTML = trait(30, 195, 430, 195, NU, 1.5) + trait(30, 20, 30, 195, NU, 1.5) + '<path d="' + d + '" fill="none" stroke="' + BL + '" stroke-width="3"/>' + point(X(t), 195 - g(t) / n * 170); f.r.innerHTML = "Produit formé à t = " + t + " min : <b>" + nb(g(t), 3) + " mol</b> · vitesse instantanée : <b>" + nb(k * n * Math.exp(-k * t), 4) + " mol/min</b>. Elle diminue au cours du temps."; } dess();
    },
    osmose: function (b, o) {
      var f = cadre(b), c = o.c || 20, veg = o.veg, s = plan(f.z, 300, 180), iso = o.iso || 9;
      curseur(f.c, "Concentration du milieu (g/L)", 0, 40, 1, c, function (x) { c = x; dess(); });
      var bt = el("button", "btn-l", "Cellule animale ou végétale"); bt.type = "button"; bt.onclick = function () { veg = !veg; dess(); }; f.c.appendChild(bt);
      function dess() { var hypo = c < iso, hyper = c > iso, R = 55 + (iso - c) * 1.1, h = ""; R = Math.max(26, Math.min(veg ? 62 : 80, R)); if (veg) h += '<rect x="82" y="30" width="136" height="120" rx="10" fill="none" stroke="' + VE + '" stroke-width="5"/>'; h += '<circle cx="150" cy="90" r="' + R + '" fill="' + CL + '" stroke="' + BL + '" stroke-width="2.5"/>'; s.innerHTML = h; f.r.innerHTML = "Milieu " + (hypo ? "<b>hypotonique</b> : l'eau entre, " + (veg ? "turgescence." : "gonflement puis hémolyse pour un globule rouge.") : hyper ? "<b>hypertonique</b> : l'eau sort, " + (veg ? "plasmolyse." : "aspect crénelé.") : "<b>isotonique</b> : pas de flux net d'eau."); } dess();
    },
    croisement: function (b, o) {
      var f = cadre(b), D = o.dom || "A", r = o.rec || "a", G = [D + D, D + r, r + r], p = o.p || (D + r), m = o.m || (D + r), mode = o.mode || "dominance";
      function liste(l, v, cb) { var w = el("label", "labo-c", "<span>" + l + "</span>"), s = el("select", "labo-sel"); G.forEach(function (g) { var q = el("option", null, g); q.value = g; s.appendChild(q); }); s.value = v; s.onchange = function () { cb(s.value); }; w.appendChild(s); f.c.appendChild(w); }
      liste("Parent 1", p, function (v) { p = v; dess(); }); liste("Parent 2", m, function (v) { m = v; dess(); });
      function phe(g) { var d = g.indexOf(D) >= 0, n = g.split(D).length - 1; return mode === "intermediaire" ? (n === 2 ? "phénotype " + D : n === 1 ? "intermédiaire" : "phénotype " + r) : d ? "[" + D + "]" : "[" + r + "]"; }
      function dess() { var R = {}, c = ""; c += "<tr><th></th><th>" + m[0] + "</th><th>" + m[1] + "</th></tr>"; [p[0], p[1]].forEach(function (a) { c += "<tr><th>" + a + "</th>"; [m[0], m[1]].forEach(function (e) { var g = (a === r && e === D) ? e + a : a + e; R[phe(g)] = (R[phe(g)] || 0) + 25; c += "<td>" + g + "</td>"; }); c += "</tr>"; }); f.z.innerHTML = '<div class="tab-scroll"><table>' + c + "</table></div>"; f.r.innerHTML = Object.keys(R).map(function (k) { return k + " : <b>" + R[k] + " %</b>"; }).join(" · "); } dess();
    },
    potentiel: function (b) {
      var f = cadre(b), I = 25, s = plan(f.z, 440, 230);
      curseur(f.c, "Intensité de la stimulation", 0, 40, 1, I, function (x) { I = x; dess(); });
      function V(t) { if (I < 20) return -70 + I * 0.8 * Math.exp(-Math.pow((t - 2) / 0.7, 2)); if (t < 1.4) return -70; if (t < 2.1) return -70 + 100 * Math.sin((t - 1.4) / 0.7 * Math.PI / 2); if (t < 3.2) return 30 - 110 * (t - 2.1) / 1.1; if (t < 5) return -80 + 10 * (t - 3.2) / 1.8; return -70; }
      function dess() { var Y = function (v) { return 215 - (v + 90) / 130 * 195; }, X = function (t) { return 34 + t / 8 * 395; }, d = ""; for (var i = 0; i <= 160; i++) { var t = i / 20; d += (i ? " L" : "M") + X(t).toFixed(1) + " " + Y(V(t)).toFixed(1); } s.innerHTML = trait(34, Y(-70), 430, Y(-70), GR, 1, true) + trait(34, Y(-50), 430, Y(-50), OR, 1, true) + '<path d="' + d + '" fill="none" stroke="' + BL + '" stroke-width="3"/>' + txt(428, Y(-50) - 6, "seuil", OR, "end"); f.r.innerHTML = I < 20 ? "Stimulation <b>infraliminaire</b> : réponse locale, pas de potentiel d'action." : "Seuil atteint : <b>potentiel d'action</b> d'amplitude constante, quelle que soit l'intensité (loi du tout ou rien)."; } dess();
    },
    glycemie: function (b) {
      var f = cadre(b), g = 60, i = 100, s = plan(f.z, 440, 220);
      curseur(f.c, "Glucides du repas (g)", 0, 120, 5, g, function (x) { g = x; dess(); }); curseur(f.c, "Efficacité de l'insuline (%)", 10, 120, 5, i, function (x) { i = x; dess(); });
      function G(t) { var pic = g / 75, rate = 0.5 * i / 100; return 1 + (t < 1 ? pic * t : pic * Math.exp(-rate * (t - 1) * 2)) + (i < 60 ? (60 - i) / 60 * 0.8 * Math.min(1, t) : 0); }
      function dess() { var X = function (t) { return 34 + t / 6 * 395; }, Y = function (v) { return 205 - (v - 0.5) / 2.6 * 190; }, d = "", mx = 0; for (var k = 0; k <= 120; k++) { var t = k / 20, v = G(t); mx = Math.max(mx, v); d += (k ? " L" : "M") + X(t).toFixed(1) + " " + Y(v).toFixed(1); } s.innerHTML = trait(34, Y(1.26), 430, Y(1.26), OR, 1, true) + txt(428, Y(1.26) - 6, "1,26 g/L", OR, "end") + '<path d="' + d + '" fill="none" stroke="' + BL + '" stroke-width="3"/>'; f.r.innerHTML = "Glycémie maximale ≈ <b>" + nb(mx) + " g/L</b> · retour : <b>" + nb(G(6)) + " g/L</b> après 6 h" + (G(6) >= 1.26 ? " : <b>hyperglycémie persistante</b>." : ".") + " (Modèle scolaire simplifié.)"; } dess();
    },
    parabole: function (b, o) {
      var f = cadre(b), a = o.a == null ? 1 : o.a, d = o.b == null ? -3 : o.b, c = o.c == null ? 2 : o.c, s = plan(f.z, 440, 300);
      curseur(f.c, "a", -3, 3, 0.5, a, function (v) { a = v; dess(); }); curseur(f.c, "b", -6, 6, 0.5, d, function (v) { d = v; dess(); }); curseur(f.c, "c", -6, 6, 0.5, c, function (v) { c = v; dess(); });
      function dess() { var R = repere(s, 440, 300, -6, 6, -8, 8), h = R.base, t = "", n = 0; if (a === 0) { s.innerHTML = h; f.r.innerHTML = "Avec a = 0, ce n'est plus un polynôme du second degré."; return; } for (var i = 0; i <= 200; i++) { var x = -6 + i * 12 / 200, y = a * x * x + d * x + c; if (y >= -8 && y <= 8) t += (n++ ? " L" : "M") + R.x(x).toFixed(1) + " " + R.y(y).toFixed(1); else n = 0; } h += '<path d="' + t + '" fill="none" stroke="' + BL + '" stroke-width="3"/>'; var D = d * d - 4 * a * c, m = ""; if (D > 0) { var x1 = (-d - Math.sqrt(D)) / (2 * a), x2 = (-d + Math.sqrt(D)) / (2 * a), p = Math.min(x1, x2), q = Math.max(x1, x2); if (Math.abs(p) <= 6) h += point(R.x(p), R.y(0)); if (Math.abs(q) <= 6) h += point(R.x(q), R.y(0)); m = "Deux racines : x₁ = <b>" + nb(p) + "</b> et x₂ = <b>" + nb(q) + "</b>. Le trinôme a le signe de a à l'extérieur des racines."; } else if (D === 0) { var r = -d / (2 * a); h += point(R.x(r), R.y(0)); m = "Une racine double : <b>" + nb(r) + "</b>. Le trinôme a le signe de a."; } else m = "Pas de racine réelle : le trinôme garde le signe de a."; s.innerHTML = h; f.r.innerHTML = "Δ = <b>" + nb(D) + "</b>. " + m; } dess();
    },
    barycentre: function (b, o) {
      var f = cadre(b), p = [o.a == null ? 1 : o.a, o.b == null ? 1 : o.b, o.c == null ? 1 : o.c], A = [[90, 210], [350, 210], [200, 50]], N = ["A", "B", "C"], s = plan(f.z, 440, 270);
      N.forEach(function (n, i) { curseur(f.c, "Coefficient de " + n, -3, 5, 1, p[i], function (v) { p[i] = v; dess(); }); });
      function dess() { var h = trait(A[0][0], A[0][1], A[1][0], A[1][1], GR, 1.5) + trait(A[1][0], A[1][1], A[2][0], A[2][1], GR, 1.5) + trait(A[2][0], A[2][1], A[0][0], A[0][1], GR, 1.5); A.forEach(function (P, i) { h += point(P[0], P[1], BL) + txt(P[0] + 8, P[1] - 8, N[i] + " (" + p[i] + ")"); }); var S = p[0] + p[1] + p[2]; if (S === 0) { s.innerHTML = h; f.r.innerHTML = "La somme des coefficients est nulle : <b>le barycentre n'existe pas</b>."; return; } var X = (p[0] * A[0][0] + p[1] * A[1][0] + p[2] * A[2][0]) / S, Y = (p[0] * A[0][1] + p[1] * A[1][1] + p[2] * A[2][1]) / S, v = X >= 8 && X <= 432 && Y >= 12 && Y <= 262; if (v) h += point(X, Y) + txt(X + 8, Y + 18, "G", OR); s.innerHTML = h; f.r.innerHTML = "Somme des coefficients : <b>" + S + "</b>. " + (v ? "G se déplace vers les points de plus fort coefficient." : "G sort du cadre : il existe, mais loin du triangle."); } dess();
    },
    denombre: function (b, o) {
      var f = cadre(b), n = o.n || 8, p = o.p || 3;
      curseur(f.c, "n (éléments disponibles)", 1, 12, 1, n, function (v) { n = v; if (p > n) p = n; dess(); }); curseur(f.c, "p (éléments choisis)", 1, 12, 1, p, function (v) { p = v; dess(); });
      function dess() { var A = 1, C = 1, q = Math.min(p, n); for (var i = 0; i < q; i++) { A *= n - i; C = C * (n - i) / (i + 1); } f.z.innerHTML = '<div class="tab-scroll"><table><tr><th>Situation</th><th>Formule</th><th>Nombre</th></tr><tr><td>Ordre, répétition permise</td><td>n<sup>p</sup></td><td>' + Math.pow(n, p).toLocaleString("fr-FR") + "</td></tr><tr><td>Ordre, sans répétition</td><td>Arrangements</td><td>" + (p > n ? "0" : A.toLocaleString("fr-FR")) + "</td></tr><tr><td>Sans ordre, sans répétition</td><td>Combinaisons</td><td>" + (p > n ? "0" : Math.round(C).toLocaleString("fr-FR")) + "</td></tr></table></div>"; f.r.innerHTML = p > n ? "Sans répétition, on ne peut pas choisir plus d'éléments qu'il n'y en a." : "Ordre compte ? Répétition permise ? Ces deux questions désignent la formule."; } dess();
    },
    composee: function (b, o) {
      var f = cadre(b), t = o.angle == null ? 30 : o.angle, s = plan(f.z, 360, 300), par = o.mode === "translation", d = o.d == null ? 1.5 : o.d;
      if (par) curseur(f.c, "Distance entre les axes", 0, 3, 0.5, d, function (v) { d = v; dess(); }); else curseur(f.c, "Angle entre les axes (°)", 0, 90, 5, t, function (v) { t = v; dess(); });
      function sym(P, a, x0) { var u = [Math.cos(a), Math.sin(a)], q = [P[0] - x0, P[1]], k = q[0] * u[0] + q[1] * u[1]; return [2 * k * u[0] - q[0] + x0, 2 * k * u[1] - q[1]]; }
      function dess() { var R = repere(s, 360, 300, -6, 6, -5, 5), h = R.base, M = [2.5, 1], a1 = par ? Math.PI / 2 : 0, a2 = par ? Math.PI / 2 : t * Math.PI / 180, x2 = par ? d : 0, M1 = sym(M, a1, 0), M2 = sym(M1, a2, x2), pr = function (P, c, n) { return point(R.x(P[0]), R.y(P[1]), c) + txt(R.x(P[0]) + 7, R.y(P[1]) - 7, n, c); }, ax = function (a, x0, c) { var u = [Math.cos(a) * 9, Math.sin(a) * 9]; return trait(R.x(x0 - u[0]), R.y(-u[1]), R.x(x0 + u[0]), R.y(u[1]), c, 1.5, true); }; h += '<defs><clipPath id="cpc"><rect x="34" y="16" width="312" height="258"/></clipPath></defs><g clip-path="url(#cpc)">' + ax(a1, 0, VE) + ax(a2, x2, GR) + "</g>" + pr(M, BL, "M") + pr(M1, GR, "M₁") + pr(M2, OR, "M₂"); s.innerHTML = h; f.r.innerHTML = par ? "Axes parallèles à distance " + nb(d) + " : la composée est une <b>translation</b> de longueur " + nb(2 * d) + "." : "Axes sécants formant " + t + "° : la composée est une <b>rotation</b> de centre O et d'angle " + 2 * t + "°."; } dess();
    },
    lentille: function (b, o) {
      var f = cadre(b), F = o.f == null ? 10 : o.f, A = o.oa == null ? -30 : o.oa, s = plan(f.z, 460, 220);
      curseur(f.c, "Distance focale f' (cm)", -20, 20, 1, F, function (v) { F = v; dess(); }); curseur(f.c, "Position de l'objet OA (cm)", -60, -2, 1, A, function (v) { A = v; dess(); });
      function dess() { var X = function (x) { return 230 + x * 3.5; }, Y = function (y) { return 110 - y * 6; }, h = trait(0, 110, 460, 110, GR, 1.5) + trait(230, 20, 230, 200, BL, 3), y0 = 6; if (F === 0) { s.innerHTML = h; f.r.innerHTML = "Une lentille a une distance focale non nulle."; return; } h += point(X(F), 110, VE) + point(X(-F), 110, VE) + txt(X(F), 130, "F'", VE, "middle") + trait(X(A), 110, X(A), Y(y0), NU, 3) + txt(X(A), 130, "A", NU, "middle"); var inv = 1 / F + 1 / A; if (Math.abs(inv) < 1e-9) { s.innerHTML = h; f.r.innerHTML = "Objet au foyer objet : l'image est rejetée à l'infini."; return; } var Ai = 1 / inv, g = Ai / A, yi = g * y0; h += trait(X(A), Y(y0), 230, Y(y0), OR, 1.5); if (Math.abs(Ai) < 70 && Math.abs(yi) < 16) { h += trait(X(Ai), 110, X(Ai), Y(yi), OR, 3, Ai < 0) + txt(X(Ai), 130, "A'", OR, "middle") + trait(230, Y(y0), X(Ai), Y(yi), OR, 1.5, Ai < 0) + trait(X(A), Y(y0), X(Ai), Y(yi), GR, 1, true); } s.innerHTML = h; f.r.innerHTML = "1/OA' − 1/OA = 1/f' donne OA' = <b>" + nb(Ai, 1) + " cm</b> ; γ = <b>" + nb(g, 2) + "</b> : image " + (Ai > 0 ? "réelle" : "virtuelle") + ", " + (g < 0 ? "renversée" : "droite") + (Math.abs(g) > 1 ? ", agrandie." : ", réduite.") + " Vergence C = " + nb(100 / F, 1) + " δ."; } dess();
    },
    calorimetre: function (b, o) {
      var f = cadre(b), m1 = o.m1 || 200, T1 = o.t1 == null ? 90 : o.t1, c1 = o.c1 || 450, m2 = o.m2 || 300, T2 = o.t2 == null ? 20 : o.t2, C = o.cal == null ? 80 : o.cal;
      curseur(f.c, "Masse du corps chaud (g)", 20, 1000, 10, m1, function (v) { m1 = v; dess(); }); curseur(f.c, "Température du corps chaud (°C)", 30, 400, 5, T1, function (v) { T1 = v; dess(); }); curseur(f.c, "Masse d'eau (g)", 50, 1000, 10, m2, function (v) { m2 = v; dess(); }); curseur(f.c, "Capacité du calorimètre (J/°C)", 0, 300, 10, C, function (v) { C = v; dess(); });
      function dess() { var a = m1 / 1000 * c1, e = m2 / 1000 * 4190 + C, T = (a * T1 + e * T2) / (a + e); f.z.innerHTML = '<div class="tab-scroll"><table><tr><th>Corps</th><th>Capacité (J/°C)</th><th>Température initiale</th></tr><tr><td>Corps chaud (c = ' + c1 + ' J/kg/°C)</td><td>' + nb(a, 1) + "</td><td>" + T1 + " °C</td></tr><tr><td>Eau et calorimètre</td><td>" + nb(e, 1) + "</td><td>" + T2 + " °C</td></tr></table></div>"; f.r.innerHTML = "Équilibre : chaleur cédée = chaleur reçue, θₑ = <b>" + nb(T, 1) + " °C</b>."; } dess();
    },
    fonctionnement: function (b, o) {
      var f = cadre(b), E = o.e || 12, r = o.r == null ? 2 : o.r, R = o.rc || 10, s = plan(f.z, 440, 260);
      curseur(f.c, "f.é.m. E (V)", 1, 24, 0.5, E, function (v) { E = v; dess(); }); curseur(f.c, "Résistance interne r (Ω)", 0, 10, 0.5, r, function (v) { r = v; dess(); }); curseur(f.c, "Résistance du résistor R (Ω)", 1, 50, 1, R, function (v) { R = v; dess(); });
      function dess() { var Im = E / Math.max(r, 0.5), Rr = repere(s, 440, 260, 0, Math.max(Im, 1) * 1.05, 0, 25), I = E / (R + r), U = R * I; s.innerHTML = Rr.base + trait(Rr.x(0), Rr.y(E), Rr.x(Math.min(Im, E / Math.max(r, 0.01))), Rr.y(Math.max(0, E - r * Math.min(Im, E / Math.max(r, 0.01)))), BL, 3) + trait(Rr.x(0), Rr.y(0), Rr.x(Math.min(Im, 25 / R)), Rr.y(R * Math.min(Im, 25 / R)), VE, 3) + point(Rr.x(I), Rr.y(U)); f.r.innerHTML = "Loi de Pouillet : I = E / (R + r) = <b>" + nb(I) + " A</b> ; U = <b>" + nb(U) + " V</b>. Rendement du générateur : " + nb(100 * U / E, 0) + " %."; } dess();
    },
    pile: function (b, o) {
      var f = cadre(b), C = [["Mg²⁺/Mg", -2.37], ["Al³⁺/Al", -1.66], ["Zn²⁺/Zn", -0.76], ["Fe²⁺/Fe", -0.44], ["Pb²⁺/Pb", -0.13], ["H⁺/H₂", 0], ["Cu²⁺/Cu", 0.34], ["Ag⁺/Ag", 0.8]], a = o.a == null ? 2 : o.a, c = o.c == null ? 6 : o.c;
      function liste(l, v, cb) { var w = el("label", "labo-c", "<span>" + l + "</span>"), s = el("select", "labo-sel"); C.forEach(function (k, i) { var q = el("option", null, k[0] + " (" + nb(k[1]) + " V)"); q.value = i; s.appendChild(q); }); s.value = v; s.onchange = function () { cb(+s.value); }; w.appendChild(s); f.c.appendChild(w); }
      liste("Premier couple", a, function (v) { a = v; dess(); }); liste("Second couple", c, function (v) { c = v; dess(); });
      function dess() { if (a === c) { f.z.innerHTML = ""; f.r.innerHTML = "Choisis deux couples différents."; return; } var n = C[a][1] < C[c][1] ? C[a] : C[c], p = C[a][1] < C[c][1] ? C[c] : C[a], m = function (x) { return x[0].split("/")[1]; }; f.z.innerHTML = '<p class="formule">⊖ ' + m(n) + " | " + n[0].split("/")[0] + " ‖ " + p[0].split("/")[0] + " | " + m(p) + " ⊕</p>"; f.r.innerHTML = "Pôle négatif : " + m(n) + " (oxydation). f.é.m. E = E°(+) − E°(−) = <b>" + nb(p[1] - n[1]) + " V</b>."; } dess();
    },
    travail: function (b, o) {
      var f = cadre(b), F = o.f || 50, d = o.d || 10, a = o.a == null ? 30 : o.a, s = plan(f.z, 380, 170);
      curseur(f.c, "Force F (N)", 1, 200, 1, F, function (v) { F = v; dess(); }); curseur(f.c, "Déplacement (m)", 1, 50, 1, d, function (v) { d = v; dess(); }); curseur(f.c, "Angle entre F et le déplacement (°)", 0, 180, 5, a, function (v) { a = v; dess(); });
      function dess() { var W = F * d * Math.cos(a * Math.PI / 180), k = a * Math.PI / 180; s.innerHTML = '<rect x="150" y="95" width="70" height="40" fill="' + CL + '" stroke="' + BL + '" stroke-width="2"/>' + trait(20, 135, 360, 135, GR, 2) + trait(185, 115, 185 + 90 * Math.cos(k), 115 - 90 * Math.sin(k), OR, 4) + txt(185 + 96 * Math.cos(k), 110 - 96 * Math.sin(k), "F", OR) + trait(240, 155, 340, 155, VE, 2) + txt(345, 160, "AB", VE); f.r.innerHTML = "W = F × AB × cos α = <b>" + nb(W, 1) + " J</b> : travail " + (Math.abs(W) < 1e-6 ? "nul." : W > 0 ? "moteur." : "résistant."); } dess();
    },
    piste: function (b, o) {
      var f = cadre(b), h = o.h || 2, m = o.m || 0.5, fr = o.fr == null ? 0 : o.fr, L = o.l || 4, s = plan(f.z, 420, 200);
      curseur(f.c, "Hauteur de départ h (m)", 0.5, 10, 0.5, h, function (v) { h = v; dess(); }); curseur(f.c, "Masse m (kg)", 0.1, 5, 0.1, m, function (v) { m = v; dess(); }); curseur(f.c, "Force de frottement (N)", 0, 5, 0.1, fr, function (v) { fr = v; dess(); });
      function dess() { var Ep = m * 9.8 * h, Wf = fr * L, Ec = Ep - Wf, H = 20 + h * 14; s.innerHTML = '<path d="M30 ' + (180 - H) + ' Q150 180 260 180 L400 180" fill="none" stroke="' + NU + '" stroke-width="3"/>' + point(30, 180 - H, BL) + txt(36, 172 - H, "départ", BL) + point(330, 180, OR) + txt(330, 196, "arrivée", OR, "middle"); f.r.innerHTML = Ec <= 0 ? "Les frottements absorbent toute l'énergie : le solide s'arrête avant le bas de la piste." : "Énergie potentielle : " + nb(Ep, 1) + " J ; frottements : " + nb(Wf, 1) + " J ; vitesse en bas : <b>" + nb(Math.sqrt(2 * Ec / m), 2) + " m/s</b>" + (fr === 0 ? " (énergie mécanique conservée)." : " (énergie mécanique non conservée)."); } dess();
    },
    enzyme: function (b, o) {
      var f = cadre(b), T = o.t == null ? 37 : o.t, p = o.ph == null ? 7 : o.ph, po = o.opt == null ? 7 : o.opt, s = plan(f.z, 420, 120);
      curseur(f.c, "Température (°C)", 0, 80, 1, T, function (v) { T = v; dess(); }); curseur(f.c, "pH", 1, 12, 0.5, p, function (v) { p = v; dess(); });
      function dess() { var aT = T <= 37 ? Math.exp(-Math.pow((T - 37) / 15, 2)) : T >= 60 ? 0 : 1 - (T - 37) / 23, aP = Math.exp(-Math.pow((p - po) / 1.8, 2)), a = Math.max(0, aT * aP), w = 360 * a; s.innerHTML = '<rect x="30" y="40" width="360" height="40" fill="none" stroke="' + GR + '" stroke-width="2"/><rect x="30" y="40" width="' + w.toFixed(1) + '" height="40" fill="' + VE + '"/>' + txt(30, 30, "Activité de l'enzyme : " + nb(100 * a, 0) + " %"); f.r.innerHTML = T >= 60 ? "Au-delà de 60 °C, l'enzyme est <b>dénaturée</b> : l'activité ne reprend pas au refroidissement." : T < 10 ? "Le froid <b>ralentit</b> l'enzyme sans la détruire." : Math.abs(p - po) > 3 ? "Ce pH est trop éloigné de l'optimum (" + nb(po) + ") : la protéine change de forme." : "Activité proche de l'optimum : environ 37 °C et pH " + nb(po) + "."; } dess();
    },
    photosynthese: function (b, o) {
      var f = cadre(b), L = o.l == null ? 40 : o.l, C = o.co2 == null ? 0.04 : o.co2, s = plan(f.z, 420, 120);
      curseur(f.c, "Éclairement (klux)", 0, 100, 1, L, function (v) { L = v; dess(); }); curseur(f.c, "CO₂ dans l'air (%)", 0, 0.3, 0.01, C, function (v) { C = v; dess(); });
      function dess() { var r = 100 * (L / (L + 15)) * (C / (C + 0.05)), w = 360 * r / 100; s.innerHTML = '<rect x="30" y="40" width="360" height="40" fill="none" stroke="' + GR + '" stroke-width="2"/><rect x="30" y="40" width="' + w.toFixed(1) + '" height="40" fill="' + VE + '"/>' + txt(30, 30, "Dégagement de dioxygène : " + nb(r, 0) + " unités"); var lim = L / (L + 15) < C / (C + 0.05) ? "l'éclairement" : "le CO₂"; f.r.innerHTML = L === 0 ? "Sans lumière, pas de photosynthèse : la plante ne fait que respirer." : C === 0 ? "Sans CO₂, la phase chimique s'arrête." : "Le facteur le plus limitant est ici <b>" + lim + "</b>."; } dess();
    },
    depense: function (b, o) {
      var f = cadre(b), O = o.o2 == null ? 18 : o.o2, Q = o.qr == null ? 0.85 : o.qr;
      curseur(f.c, "Dioxygène consommé (L/h)", 5, 150, 1, O, function (v) { O = v; dess(); }); curseur(f.c, "Quotient respiratoire QR", 0.7, 1, 0.01, Q, function (v) { Q = v; dess(); });
      function dess() { var E = O * 20.1, P = E * 1000 / 3600, n = Q > 0.95 ? "surtout des glucides" : Q < 0.75 ? "surtout des lipides" : "un mélange de nutriments"; f.z.innerHTML = '<p class="formule">Énergie = V(O₂) × 20,1 kJ/L</p>'; f.r.innerHTML = "Dépense : <b>" + nb(E, 0) + " kJ/h</b>, soit <b>" + nb(P, 0) + " W</b>. CO₂ rejeté : " + nb(O * Q, 1) + " L/h ; QR = " + nb(Q) + " : l'organisme oxyde " + n + "."; } dess();
    },
    menu: function (b, o) {
      var f = cadre(b), g = o.g == null ? 300 : o.g, l = o.l == null ? 70 : o.l, p = o.p == null ? 80 : o.p, B = o.besoin || 10000;
      curseur(f.c, "Glucides (g/jour)", 0, 600, 10, g, function (v) { g = v; dess(); }); curseur(f.c, "Lipides (g/jour)", 0, 200, 5, l, function (v) { l = v; dess(); }); curseur(f.c, "Protides (g/jour)", 0, 200, 5, p, function (v) { p = v; dess(); });
      function dess() { var Eg = 17 * g, El = 38 * l, Ep = 17 * p, E = Eg + El + Ep || 1; f.z.innerHTML = '<div class="tab-scroll"><table><tr><th>Nutriment</th><th>Énergie (kJ)</th><th>Part</th><th>Repère</th></tr><tr><td>Glucides</td><td>' + nb(Eg, 0) + "</td><td>" + nb(100 * Eg / E, 0) + " %</td><td>50 à 55 %</td></tr><tr><td>Lipides</td><td>" + nb(El, 0) + "</td><td>" + nb(100 * El / E, 0) + " %</td><td>30 à 35 %</td></tr><tr><td>Protides</td><td>" + nb(Ep, 0) + "</td><td>" + nb(100 * Ep / E, 0) + " %</td><td>12 à 15 %</td></tr></table></div>"; var t = Eg + El + Ep; f.r.innerHTML = "Apport total : <b>" + nb(t, 0) + " kJ</b> pour un besoin d'environ " + nb(B, 0) + " kJ : " + (t > B * 1.1 ? "apport excessif, risque de surpoids." : t < B * 0.9 ? "apport insuffisant." : "apport équilibré en quantité.") + " (Glucides et protides : 17 kJ/g ; lipides : 38 kJ/g.)"; } dess();
    },
    sismo: function (b, o) {
      var f = cadre(b), d = o.d == null ? 60 : o.d, s = plan(f.z, 300, 300);
      curseur(f.c, "Distance épicentrale (°)", 0, 180, 1, d, function (v) { d = v; dess(); });
      function dess() { var a = d * Math.PI / 180, X = 150 + 120 * Math.sin(a), Y = 150 - 120 * Math.cos(a), h = '<circle cx="150" cy="150" r="120" fill="' + CL + '" stroke="' + NU + '" stroke-width="2"/><circle cx="150" cy="150" r="66" fill="#F6E3C8" stroke="' + OR + '" stroke-width="1.5"/>' + point(150, 30, OR) + txt(156, 24, "foyer", OR) + point(X, Y, BL) + txt(X + 6, Y + 14, "station", BL); s.innerHTML = h; var P = d < 103 || d > 142, Sw = d < 103; f.r.innerHTML = (P ? "Ondes P reçues" : "Ondes P directes <b>non reçues</b> : zone d'ombre (103° à 142°), due au noyau qui dévie les ondes P") + " · " + (Sw ? "ondes S reçues." : "ondes S <b>absentes</b> : elles ne traversent pas le noyau externe liquide."); } dess();
    }
  };
  delete T.droitegrad;

  function monter(boite, o) { if (!o || !T[o.type]) throw new Error("Labo inconnu : " + (o && o.type)); boite.classList.add("labo"); T[o.type](boite, o); }
  W.VRT = W.VRT || {}; W.VRT.labo = { monter: monter, types: Object.keys(T) };
})(window);
