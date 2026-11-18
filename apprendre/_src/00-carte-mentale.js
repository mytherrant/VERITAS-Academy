/* VÉRITAS — cartes mentales dessinées (18/11/2026, « de vraies cartes mentales », « embellis plus »).
   Un nuage au centre, des flèches courbes vers chaque branche, des étiquettes entourées à main levée et numérotées,
   les mots reliés en éventail, en italique, sur fond de cahier pointé.
   Deux dessins dans le même bloc : en étoile (écran large) et en arbre (téléphone), basculés en CSS (.cm-large / .cm-etroit).
   Utilisé par les leçons (VRT_CM_LECON : carte de la leçon tirée des parties et de « à retenir ») et par
   tools/oeuvres_statiques.js (pages d'œuvres), qui charge ce fichier sous Node. Aucune dépendance. */
(function (W) {
  "use strict";
  var PALETTES = [["#D7263D", "#F46036", "#1B998B", "#2E86AB", "#7B2CBF", "#C2185B"], ["#E76F51", "#2A9D8F", "#D4891A", "#3A86FF", "#9C27B0", "#264653"], ["#EF476F", "#118AB2", "#06A77D", "#F78C1F", "#6A4C93", "#D62828"], ["#FF5A5F", "#00A6A6", "#F29E4C", "#5465FF", "#B5179E", "#2B9348"]];
  var NUM = 0, P = "cm", STYLE = "main", COUL = ["#E0475B", "#0E9AA7", "#7B4FC4", "#E07B1F", "#2E9A5B", "#1E6FD0", "#C2387A"];
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function f1(v) { return Math.round(v * 10) / 10; }
  function couper(s, n) {
    var mots = String(s).replace(/\s+([»:;!?])/g, "\u00a0$1").replace(/«\s+/g, "«\u00a0").split(/[ \t\n\r]+/), l = [], c = "";
    mots.forEach(function (m) { if (c && (c + " " + m).length > n) { l.push(c); c = m; } else c = c ? c + " " + m : m; });
    if (c) l.push(c);
    return l;
  }
  /* styles fantaisie (18/11/2026, « trop classique, mets de la fantaisie ») : post-it et ardoise */
  var ARD = function () { return STYLE === "ardoise"; }, PIT = function () { return STYLE === "postit"; }, MAINL = function () { return STYLE === "main" || STYLE === "ardoise" || STYLE === "postit"; };
  function encre(c) { return STYLE === "ardoise" ? "#F3EFE4" : STYLE === "postit" ? "#2B2B2B" : c; }
  function alpha(hex, a) { var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")"; }
  function teinte(col, k) { return STYLE === "ardoise" ? "rgba(255,255,255,.07)" : STYLE === "postit" ? clair(col, Math.min(k, .7)) : clair(col, k); }
  function clair(hex, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    return "rgb(" + [r, g, b].map(function (v) { return Math.round(v + (255 - v) * k); }).join(",") + ")";
  }
  function texte(x, y, lignes, o) {
    var s = "<text x='" + f1(x) + "' y='" + f1(y) + "' text-anchor='" + (o.a || "start") + "' font-size='" + o.t + "'" + (MAINL() ? " font-style='italic'" : "") + (o.g ? " font-weight='" + o.g + "'" : "") + " fill='" + (o.c || (STYLE === "sobre" ? encre("#3B4456") : encre("#2E3445"))) + "'>";
    lignes.forEach(function (l, i) { s += "<tspan x='" + f1(x) + "' dy='" + (i ? f1(o.t * 1.24) : 0) + "'>" + esc(l) + "</tspan>"; });
    return s + "</text>";
  }
  /* boucle tracée à main levée autour d'une étiquette (ellipse qui déborde un peu de son point de départ) */
  function boucle(cx, cy, rx, ry, col, graine) {
    var d = "", t, k = 0;
    for (t = -0.5; t <= 2 * Math.PI + 0.3; t += 0.16, k++) {
      var j = 1 + 0.045 * Math.sin(3 * t + graine) + 0.02 * Math.cos(5 * t + graine * 2), sp = t > 2 * Math.PI - 0.2 ? 1 + 6 / Math.max(rx, ry) : 1;
      d += (k ? "L" : "M") + f1(cx + rx * j * sp * Math.cos(t)) + " " + f1(cy + ry * j * sp * Math.sin(t));
    }
    return "<path d='" + d + "' fill='" + teinte(col, .9) + "' stroke='" + col + "' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'/>";
  }
  function etiquette(cx, cy, t, col, n, max) {
    var L = t.length > (max || 99) ? couper(t, Math.ceil(t.length / 2) + 2) : [t], ry = L.length > 1 ? 31 : 21;
    var w = Math.round(Math.max.apply(null, L.map(function (l) { return l.length; })) * 9.2 + 40), s = "<g class='cm-h'>", tc = col;
    if (PIT()) { var rot = (n % 2 ? -2.2 : 1.8); s = "<g class='cm-h' transform='rotate(" + rot + " " + f1(cx) + " " + f1(cy) + ")'><rect x='" + f1(cx - w / 2 + 3) + "' y='" + f1(cy - ry + 6) + "' width='" + w + "' height='" + (ry * 2 - 2) + "' fill='#000' opacity='.12'/><rect x='" + f1(cx - w / 2) + "' y='" + f1(cy - ry + 2) + "' width='" + w + "' height='" + (ry * 2 - 2) + "' fill='" + clair(col, .62) + "'/><rect x='" + f1(cx - 22) + "' y='" + f1(cy - ry - 5) + "' width='44' height='13' fill='rgba(255,255,255,.65)' transform='rotate(-4 " + f1(cx) + " " + f1(cy - ry) + ")'/>"; tc = "#2B2B2B"; }
    else if (STYLE === "main" || ARD()) s += boucle(cx, cy, w / 2, ry, col, n * 1.7);
    else if (STYLE === "colore") { s += "<rect x='" + f1(cx - w / 2) + "' y='" + f1(cy - ry + 2) + "' width='" + w + "' height='" + (ry * 2 - 4) + "' rx='" + (ry - 2) + "' fill='" + col + "'/>"; tc = "#fff"; }
    else { s += "<rect x='" + f1(cx - w / 2) + "' y='" + f1(cy - ry + 3) + "' width='" + w + "' height='" + (ry * 2 - 6) + "' rx='8' fill='#fff' stroke='#AEB6C6' stroke-width='1.3'/><rect x='" + f1(cx - w / 2) + "' y='" + f1(cy - ry + 3) + "' width='5' height='" + (ry * 2 - 6) + "' rx='2' fill='" + col + "'/>"; tc = encre("#1D2330"); }
    L.forEach(function (l, k) { s += "<text x='" + f1(cx) + "' y='" + f1(cy + 5.5 + (k - (L.length - 1) / 2) * 19) + "' text-anchor='middle' font-size='16' font-weight='" + (STYLE === "sobre" ? 700 : 800) + "' fill='" + tc + "'>" + esc(l) + "</text>"; });
    s += "<circle cx='" + f1(cx - w / 2 + 6) + "' cy='" + f1(cy - ry + 2) + "' r='11.5' fill='" + (STYLE === "colore" ? "#fff" : col) + "' stroke='" + (STYLE === "colore" ? col : "#fff") + "' stroke-width='2'/>" +
      "<text x='" + f1(cx - w / 2 + 6) + "' y='" + f1(cy - ry + 6.5) + "' text-anchor='middle' font-size='13' font-weight='800' fill='" + (STYLE === "colore" ? col : "#fff") + "'>" + n + "</text></g>";
    return { s: s, w: w, h: ry * 2 };
  }
  /* nuage central : contour en festons autour d'une ellipse */
  function nuage(cx, cy, lignes, w) {
    var h = 26 + lignes.length * 21, a = w / 2 + 16, b = h / 2 + 16, n = 11, pts = [], i, d;
    for (i = 0; i <= n; i++) { var u = -Math.PI / 2 + 2 * Math.PI * i / n; pts.push([cx + a * Math.cos(u), cy + b * Math.sin(u)]); }
    d = "M" + f1(pts[0][0]) + " " + f1(pts[0][1]);
    for (i = 1; i <= n; i++) { var c = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) * 0.62; d += "A" + f1(c) + " " + f1(c) + " 0 0 1 " + f1(pts[i][0]) + " " + f1(pts[i][1]); }
    var s = "<g class='cm-c'><path d='" + d + "Z' fill='#001136' opacity='.12' transform='translate(3 5)'/>" +
      "<path d='" + d + "Z' fill='" + (ARD() ? "rgba(255,255,255,.1)" : "url(#" + P + "g)") + "' stroke='" + (ARD() ? "#FFE08A" : "#fff") + "' stroke-width='" + (ARD() ? 3 : 2.5) + "'" + (ARD() ? " stroke-dasharray='14 4'" : "") + "/>";
    lignes.forEach(function (l, k) {
      var sub = k >= (lignes.nt || 1);
      s += "<text x='" + f1(cx) + "' y='" + f1(cy - h / 2 + 31 + k * 21) + "' text-anchor='middle' font-size='" + (sub ? 13.5 : 19) + "' font-weight='" + (sub ? 600 : 800) + "' fill='" + (sub ? "#FFE08A" : "#fff") + "'>" + esc(l) + "</text>";
    });
    return { s: s + "</g>", h: h, a: a, b: b };
  }
  function largeurC(C, min, max) { return Math.min(max || 999, Math.max(min, Math.round(Math.max.apply(null, C.map(function (l, i) { return l.length * (i ? 7.8 : 11.2); })) + 30))); }
  function defs(B) {
    return "<defs><linearGradient id='" + P + "g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#3D5BD8'/><stop offset='.55' stop-color='#2A2F9E'/><stop offset='1' stop-color='#0C1F55'/></linearGradient>" +
      "<pattern id='" + P + "q' width='18' height='18' patternUnits='userSpaceOnUse'><circle cx='9' cy='9' r='1.1' fill='" + (ARD() ? "rgba(255,255,255,.08)" : PIT() ? "#D2B482" : "#DCE3EF") + "'/></pattern>" +
      "<linearGradient id='" + P + "p' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#FFF6E8'/><stop offset='.5' stop-color='#FDF2FA'/><stop offset='1' stop-color='#EAF3FF'/></linearGradient>" +
      B.map(function (b, i) { return "<marker id='" + P + "f" + i + "' markerWidth='18' markerHeight='18' refX='11' refY='9' orient='auto' markerUnits='userSpaceOnUse'><path d='M2 2.5L14 9L2 15.5' fill='none' stroke='" + trait(b.color) + "' stroke-width='3.4' stroke-linecap='round' stroke-linejoin='round'/></marker>"; }).join("") + "</defs>";
  }
  function fond(Wd, H) {
    if (ARD()) return "<rect width='" + Wd + "' height='" + Math.round(H) + "' rx='18' fill='#6B4423'/><rect x='9' y='9' width='" + (Wd - 18) + "' height='" + Math.round(H - 18) + "' rx='10' fill='#24453B'/><rect x='9' y='9' width='" + (Wd - 18) + "' height='" + Math.round(H - 18) + "' rx='10' fill='url(#" + P + "q)'/>";
    if (PIT()) return "<rect width='" + Wd + "' height='" + Math.round(H) + "' rx='18' fill='#EFD9B0'/><rect width='" + Wd + "' height='" + Math.round(H) + "' rx='18' fill='url(#" + P + "q)'/>";
    if (STYLE === "sobre") return "<rect x='.5' y='.5' width='" + (Wd - 1) + "' height='" + Math.round(H - 1) + "' rx='14' fill='#fff' stroke='#E3E8F1'/>";
    if (STYLE === "colore") return "<rect width='" + Wd + "' height='" + Math.round(H) + "' rx='18' fill='url(#" + P + "p)'/>";
    return "<rect width='" + Wd + "' height='" + Math.round(H) + "' rx='18' fill='#FCFDFF'/><rect width='" + Wd + "' height='" + Math.round(H) + "' rx='18' fill='url(#" + P + "q)'/>";
  }
  /* centre selon le style : nuage (main levée), cartouche dégradé (coloré), cartouche sobre */
  function centre(cx, cy, lignes, w) {
    /* titre trop long pour la place : il passe à la ligne au lieu de déborder */
    var lim = cx < 300 ? Math.max(200, 2 * cx - 40) : 420, L2 = [];
    lignes.forEach(function (l, k) { couper(l, Math.floor((lim - 40) / (k ? 7.8 : 11.2))).forEach(function (x) { L2.push(k && !L2.length ? x : x); }); if (!k && L2.length > 1) L2.titre = L2.length; });
    L2.nt = L2.titre || 1; lignes = L2;
    w = Math.min(lim, Math.max(w, largeurC(lignes, 0, lim)));
    if (STYLE === "main" || ARD()) return nuage(cx, cy, lignes, w);
    if (PIT()) {
      var hp = 30 + lignes.length * 21, sp = "<g class='cm-c' transform='rotate(-2 " + f1(cx) + " " + f1(cy) + ")'><rect x='" + f1(cx - w / 2 + 5) + "' y='" + f1(cy - hp / 2 + 7) + "' width='" + w + "' height='" + hp + "' fill='#000' opacity='.15'/><rect x='" + f1(cx - w / 2) + "' y='" + f1(cy - hp / 2) + "' width='" + w + "' height='" + hp + "' fill='#FFE066'/><path d='M" + f1(cx + w / 2 - 22) + " " + f1(cy + hp / 2) + " L" + f1(cx + w / 2) + " " + f1(cy + hp / 2 - 22) + " V" + f1(cy + hp / 2) + "Z' fill='#E8C53A'/><rect x='" + f1(cx - 34) + "' y='" + f1(cy - hp / 2 - 8) + "' width='68' height='16' fill='rgba(255,255,255,.7)' transform='rotate(3 " + f1(cx) + " " + f1(cy - hp / 2) + ")'/>";
      lignes.forEach(function (l, k) { var sub = k >= (lignes.nt || 1); sp += "<text x='" + f1(cx) + "' y='" + f1(cy - hp / 2 + 34 + k * 21) + "' text-anchor='middle' font-size='" + (sub ? 13.5 : 19) + "' font-weight='" + (sub ? 600 : 800) + "' fill='" + (sub ? "#8A5A00" : "#142554") + "'>" + esc(l) + "</text>"; });
      return { s: sp + "</g>", h: hp, a: w / 2, b: hp / 2 };
    }
    var h = 26 + lignes.length * 21, sob = STYLE === "sobre", s = "<g class='cm-c'>" + (sob ? "" : "<rect x='" + f1(cx - w / 2 + 3) + "' y='" + f1(cy - h / 2 + 5) + "' width='" + w + "' height='" + h + "' rx='" + (h / 2) + "' fill='#001136' opacity='.12'/>") +
      "<rect x='" + f1(cx - w / 2) + "' y='" + f1(cy - h / 2) + "' width='" + w + "' height='" + h + "' rx='" + (sob ? 10 : h / 2) + "' fill='" + (sob ? "#1D2B53" : "url(#" + P + "g)") + "'" + (sob ? "" : " stroke='#FFC93C' stroke-width='3'") + "/>";
    lignes.forEach(function (l, k) { var sub = k >= (lignes.nt || 1); s += "<text x='" + f1(cx) + "' y='" + f1(cy - h / 2 + 31 + k * 21) + "' text-anchor='middle' font-size='" + (sub ? 13.5 : 19) + "' font-weight='" + (sub ? 600 : 800) + "' fill='" + (sub ? (sob ? "#C9D3EA" : "#FFE08A") : "#fff") + "'>" + esc(l) + "</text>"; });
    return { s: s + "</g>", h: h, a: w / 2, b: h / 2 };
  }
  function trait(col) { return STYLE === "sobre" ? "#8A93A6" : col; }

  /* écran large : en étoile, branches paires à gauche, impaires à droite */
  function large(C, B, alt) {
    var Wd = 920, cx = 460, T = 15, LH = T * 1.24, NC = 16, cotes = [[], []];
    B.forEach(function (b, i) { b.n = i + 1; b.i = i; cotes[i % 2].push(b); });
    function bloc(b) { var h = 0; b.items.forEach(function (it) { h += couper(it, NC).length * LH + 14; }); return Math.max(h, 70) + 28; }
    var hauts = cotes.map(function (c) { return c.reduce(function (a, b) { return a + bloc(b); }, 0); });
    var cw = largeurC(C, 180, 260), H = Math.max(hauts[0], hauts[1], 300) + 40, cy = H / 2, s = "", dessus = "";
    var cen = centre(cx, cy, C, cw);
    cotes.forEach(function (liste, cote) {
      var sg = cote ? 1 : -1, col0 = cx + sg * 248, y0 = (H - hauts[cote]) / 2;
      liste.forEach(function (b) {
        var h = bloc(b), hy = y0 + h / 2, col = b.color, ly = y0 + 14, hmax = h / 2;
        var et = etiquette(0, 0, b.label, col, b.n, 17), w = et.w, ox = col0 - sg * 44, hx = ox - sg * w / 2, ix = hx - sg * w / 2;
        /* étiquette qui mordrait sur le nuage : on la monte (ou descend) au-dessus de lui */
        if (Math.abs(ix - cx) < cen.a + 18 && Math.abs(hy - cy) < cen.b + et.h / 2 + 8) hy = cy + (hy > cy + 1 ? 1 : -1) * (cen.b + et.h / 2 + 10);
        var th = Math.atan2((hy - cy) / cen.b, (ix - cx) / cen.a), sx = cx + cen.a * Math.cos(th), sy = cy + cen.b * Math.sin(th), ex = ix - sg * 10;
        s += "<path class='cm-t' d='M" + f1(sx) + " " + f1(sy) + " C" + f1(sx + (ex - sx) * 0.25) + " " + f1(sy + (hy - sy) * 0.85) + " " + f1(ex - sg * 40) + " " + f1(hy) + " " + f1(ex) + " " + f1(hy) + "' fill='none' stroke='" + trait(col) + "' stroke-width='" + (STYLE === "sobre" ? 3 : 5) + "' stroke-linecap='round' marker-end='url(#" + P + "f" + b.i + ")'/>";
        b.items.forEach(function (it) {
          var L = couper(it, NC), hh = L.length * LH, my = ly + hh / 2 - 4, d = (my - hy) / hmax, dx = col0 - sg * 26 * d * d;
          s += "<path class='cm-l' d='M" + f1(ox) + " " + f1(hy) + " Q" + f1(ox + (dx - ox) * 0.55) + " " + f1(my) + " " + f1(dx) + " " + f1(my) + "' fill='none' stroke='" + clair(col, .3) + "' stroke-width='2.6' stroke-linecap='round'/>" +
            "<circle class='cm-p' cx='" + f1(dx) + "' cy='" + f1(my) + "' r='5' fill='" + col + "' stroke='#fff' stroke-width='1.6'/>" +
            texte(dx + sg * 11, my + 5 - (L.length - 1) * LH / 2, L, { t: T, a: cote ? "start" : "end" });
          ly += hh + 14;
        });
        dessus += "<g transform='translate(" + f1(hx) + " " + f1(hy) + ")'>" + et.s + "</g>";
        y0 += h;
      });
    });
    return "<svg class='cm-large' viewBox='0 0 " + Wd + " " + Math.round(H) + "' role='img' aria-label='" + esc(alt) + "' font-family='Poppins,Inter,Roboto,Arial,sans-serif'>" + defs(B) + fond(Wd, H) + s + dessus + cen.s + "</svg>";
  }

  /* téléphone : en arbre, tronc pointillé à gauche, mots en éventail sous chaque étiquette */
  function etroit(C, B, alt) {
    var Wd = 400, T = 15, LH = T * 1.24, NC = 32, tronc = 30;
    var cen = centre(200, 0, C, largeurC(C, 240, 330)), haut = cen.h / 2 + cen.b - cen.h / 2 + 22, y = haut + cen.b + 30, s = "", dessus = "", avant = haut + cen.b;
    B.forEach(function (b, i) {
      var col = b.color, et = etiquette(0, 0, b.label, col, i + 1), hy = y + 22, hx = 52 + et.w / 2;
      s += "<path class='cm-t' d='M" + tronc + " " + f1(avant) + " V" + f1(hy) + "' stroke='#C3CBDA' stroke-width='3' stroke-dasharray='2 7' stroke-linecap='round' fill='none'/>" +
        "<path class='cm-t' d='M" + tronc + " " + f1(hy) + " H" + f1(hx - et.w / 2 - 10) + "' stroke='" + trait(col) + "' stroke-width='4.6' fill='none' stroke-linecap='round' marker-end='url(#" + P + "f" + i + ")'/>";
      var ly = hy + 38;
      avant = hy;
      b.items.forEach(function (it) {
        var L = couper(it, NC), hh = L.length * LH, my = ly + 4;
        s += "<path class='cm-l' d='M" + (tronc + 22) + " " + f1(hy + 16) + " Q" + (tronc + 22) + " " + f1(my) + " 58 " + f1(my) + "' fill='none' stroke='" + clair(col, .3) + "' stroke-width='2.6'/>" +
          "<circle class='cm-p' cx='64' cy='" + f1(my) + "' r='5' fill='" + col + "' stroke='#fff' stroke-width='1.6'/>" + texte(78, my + 5, L, { t: T });
        ly += hh + 12;
      });
      dessus += "<circle cx='" + tronc + "' cy='" + f1(hy) + "' r='6' fill='" + col + "'/><g transform='translate(" + f1(hx) + " " + f1(hy) + ")'>" + et.s + "</g>";
      y = ly + 18;
    });
    var cs = "<g transform='translate(0 " + f1(haut) + ")'>" + cen.s + "</g>";
    return "<svg class='cm-etroit' viewBox='0 0 " + Wd + " " + Math.round(y) + "' role='img' aria-label='" + esc(alt) + "' font-family='Poppins,Inter,Roboto,Arial,sans-serif'>" + defs(B) + fond(Wd, y) + s + dessus + cs + "</svg>";
  }

  /* ════════ AUTRES FORMES (18/11/2026, « varie les styles de cartes ») ════════ */
  var T2 = 15, LH2 = T2 * 1.24;
  function puce(x, y, col) {
    if (STYLE === "sobre") return "<rect class='cm-p' x='" + f1(x - 4) + "' y='" + f1(y - 1) + "' width='8' height='2.2' rx='1' fill='#8A93A6'/>";
    return "<circle class='cm-p' cx='" + f1(x) + "' cy='" + f1(y) + "' r='" + (STYLE === "colore" ? 5 : 4) + "' fill='" + col + "'" + (STYLE === "colore" ? " stroke='#fff' stroke-width='1.5'" : "") + "/>";
  }
  function hListe(items, NC) { return items.reduce(function (a, it) { return a + couper(it, NC).length * LH2 + 8; }, 0) - 8; }
  /* liste à puces : y = ligne de base du premier élément */
  function liste(items, x, y, NC, col, centre) {
    var s = "", yy = y;
    items.forEach(function (it) {
      var L = couper(it, NC);
      s += centre ? texte(x, yy, L, { t: T2, a: "middle" }) : puce(x + 5, yy - 5, col) + texte(x + 17, yy, L, { t: T2 });
      yy += L.length * LH2 + 8;
    });
    return s;
  }
  /* cadre : bords à main levée, coloré (bandeau) ou sobre */
  function cadre(x, y, w, h, col, coupe) {
    if (PIT()) { var r = ((x + y) % 3) - 1; return "<g transform='rotate(" + (r * 1.2) + " " + f1(x + w / 2) + " " + f1(y + h / 2) + ")'><rect x='" + (x + 4) + "' y='" + (y + 6) + "' width='" + w + "' height='" + h + "' fill='#000' opacity='.12'/><rect x='" + x + "' y='" + y + "' width='" + w + "' height='" + h + "' fill='" + clair(col, .72) + "'/><path d='M" + (x + w - 26) + " " + (y + h) + " L" + (x + w) + " " + (y + h - 26) + " V" + (y + h) + "Z' fill='" + clair(col, .45) + "'/><rect x='" + (x + w / 2 - 36) + "' y='" + (y - 8) + "' width='72' height='16' fill='rgba(255,255,255,.7)' transform='rotate(" + (-r * 3) + " " + (x + w / 2) + " " + y + ")'/></g>"; }
    if (STYLE === "main" || ARD()) {
      var d = "", k = 0, pts = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y + 1]];
      for (var i = 0; i < 4; i++) for (var t = 0; t <= 1; t += 0.1, k++) {
        var px = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, py = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t, j = 1.4 * Math.sin(k * 1.7 + x);
        d += (k ? "L" : "M") + f1(px + (i % 2 ? j : 0)) + " " + f1(py + (i % 2 ? 0 : j));
      }
      return "<path d='" + d + "' fill='" + teinte(col, .93) + "' stroke='" + col + "' stroke-width='2.2' stroke-linejoin='round'/>";
    }
    if (coupe) { var c = 16; return "<path d='M" + (x + c) + " " + y + "H" + (x + w - c) + "L" + (x + w) + " " + (y + c) + "V" + (y + h - c) + "L" + (x + w - c) + " " + (y + h) + "H" + (x + c) + "L" + x + " " + (y + h - c) + "V" + (y + c) + "Z' fill='" + (STYLE === "colore" ? clair(col, .9) : "#fff") + "' stroke='" + (STYLE === "colore" ? col : "#AEB6C6") + "' stroke-width='" + (STYLE === "colore" ? 2 : 1.2) + "'/>"; }
    if (STYLE === "colore") return "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='" + h + "' rx='16' fill='#fff' stroke='" + col + "' stroke-width='2'/><path d='M" + x + " " + (y + 16) + "a16 16 0 0 1 16 -16H" + (x + w - 16) + "a16 16 0 0 1 16 16V" + (y + 46) + "H" + x + "Z' fill='" + col + "'/>";
    return "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='" + h + "' rx='10' fill='#fff' stroke='#C9D0DC' stroke-width='1.2'/><rect x='" + x + "' y='" + y + "' width='" + w + "' height='4' rx='2' fill='" + col + "'/>";
  }
  /* boîte de branche : numéro, titre, liste ; retourne { s, h } */
  function hBoite(b, w) { var NC = Math.floor((w - 44) / 8.2); return 52 + couper(b.label, Math.floor((w - 60) / 9.4)).length * 19 + hListe(b.items, NC) + 18; }
  function boite(x, y, w, b, n, hex, hImpose) {
    var NC = Math.floor((w - 44) / 8.2), Lt = couper(b.label, Math.floor((w - 60) / 9.4)), h = hImpose || hBoite(b, w), col = b.color, s = "<g class='cm-h'>" + cadre(x, y, w, h, col, hex);
    var badge = hex ? "<path d='" + hexa(x + 26, y + 26, 14) + "' fill='" + col + "'/>" : "<circle cx='" + (x + 26) + "' cy='" + (y + 25) + "' r='13' fill='" + (STYLE === "colore" ? "#fff" : col) + "'/>";
    s += badge + "<text x='" + (x + 26) + "' y='" + (y + 30) + "' text-anchor='middle' font-size='14' font-weight='800' fill='" + (STYLE === "colore" && !hex ? col : "#fff") + "'>" + n + "</text>";
    Lt.forEach(function (l, k) { s += "<text x='" + (x + 48) + "' y='" + (y + 30 + k * 19) + "' font-size='16' font-weight='800' fill='" + (STYLE === "colore" && !hex ? "#fff" : STYLE === "sobre" ? encre("#1D2330") : col) + "'>" + esc(l) + "</text>"; });
    return { s: s + "</g>" + liste(b.items, x + 16, y + 38 + Lt.length * 19 + 14, NC, col), h: h };
  }
  function hexa(cx, cy, r) { var d = ""; for (var i = 0; i < 6; i++) { var a = Math.PI / 3 * i; d += (i ? "L" : "M") + f1(cx + r * Math.cos(a)) + " " + f1(cy + r * Math.sin(a)); } return d + "Z"; }
  function fleche(x1, y1, x2, y2, col, i, courbe) {
    var d = courbe ? "M" + f1(x1) + " " + f1(y1) + " C" + f1(x1) + " " + f1((y1 + y2) / 2) + " " + f1(x2) + " " + f1((y1 + y2) / 2) + " " + f1(x2) + " " + f1(y2) : "M" + f1(x1) + " " + f1(y1) + " L" + f1(x2) + " " + f1(y2);
    return "<path class='cm-t' d='" + d + "' fill='none' stroke='" + trait(col) + "' stroke-width='" + (STYLE === "sobre" ? 2.8 : 4.6) + "' stroke-linecap='round'" + (i == null ? "" : " marker-end='url(#" + P + "f" + i + ")'") + "/>";
  }
  function svgDe(cls, Wd, H, alt, B, corps) {
    return "<svg class='" + cls + "' viewBox='0 0 " + Wd + " " + Math.round(H) + "' role='img' aria-label='" + esc(alt) + "' font-family='Poppins,Inter,Roboto,Arial,sans-serif'>" + defs(B) + fond(Wd, H) + corps + "</svg>";
  }
  function placerCentre(cx, C, w) { var c0 = centre(cx, 0, C, w); return { c: c0, y: c0.b + 20, s: "<g transform='translate(0 " + f1(c0.b + 20) + ")'>" + c0.s + "</g>" }; }

  /* ARBORESCENTE : organigramme de haut en bas */
  function arbre(C, B, alt) {
    var Wd = 920, n = B.length, colW = (Wd - 40) / n, NC = Math.max(12, Math.floor((colW - 44) / 8.2)), pc = placerCentre(460, C, largeurC(C, 220, 460)), s = "", dessus = "", bas = 0;
    var bus = pc.y + pc.c.b + 30, labY = bus + 56;
    s += fleche(460, pc.y + pc.c.b, 460, bus, "#8A93A6") + "<path class='cm-t' d='M" + f1(20 + colW / 2) + " " + bus + " H" + f1(20 + colW * (n - .5)) + "' stroke='" + (STYLE === "sobre" ? "#8A93A6" : "#9AA4B6") + "' stroke-width='" + (STYLE === "sobre" ? 2.8 : 4.6) + "' fill='none' stroke-linecap='round'/>";
    B.forEach(function (b, i) {
      var x = 20 + colW * (i + .5), et = etiquette(x, labY, b.label, b.color, i + 1, Math.max(8, Math.floor((colW - 50) / 9.2))), y0 = labY + et.h / 2 + 30, hl = hListe(b.items, NC);
      s += fleche(x, bus, x, labY - et.h / 2 - 8, b.color, i) + "<path class='cm-l' d='M" + f1(x - colW / 2 + 24) + " " + f1(labY + et.h / 2 + 2) + " V" + f1(y0 + hl - 6) + "' stroke='" + clair(trait(b.color), .45) + "' stroke-width='2' fill='none'/>" + liste(b.items, x - colW / 2 + 20, y0, NC, b.color);
      dessus += et.s; bas = Math.max(bas, y0 + hl);
    });
    return svgDe("cm-large", Wd, bas + 24, alt, B, s + dessus + pc.s);
  }

  /* EN BULLES / EN TOILE : bulles ovales reliées souplement autour du centre (deux colonnes) */
  function bulle(cx, cy, rx, ry, b, n, NC) {
    var col = b.color, Lt = couper(b.label, NC - 6), s = "<g class='cm-h'>";
    if (STYLE === "main") s += boucle(cx, cy, rx, ry, col, n * 2.3).replace("stroke-width='2.6'", "stroke-width='2.4'");
    else s += "<ellipse cx='" + f1(cx) + "' cy='" + f1(cy) + "' rx='" + f1(rx) + "' ry='" + f1(ry) + "' fill='" + (STYLE === "colore" ? clair(col, .86) : teinte(col, .9)) + "' stroke='" + (STYLE === "sobre" ? "#AEB6C6" : col) + "' stroke-width='" + (STYLE === "sobre" ? 1.3 : 2.4) + "'/>";
    var h = Lt.length * 19 + 10 + hListe(b.items, NC), y = cy - h / 2 + 14;
    Lt.forEach(function (l, k) { s += "<text x='" + f1(cx) + "' y='" + f1(y + k * 19) + "' text-anchor='middle' font-size='16' font-weight='800' fill='" + (STYLE === "sobre" ? encre("#1D2330") : col) + "'>" + esc(l) + "</text>"; });
    var bx = cx - rx * .78, by = cy - ry * .66;
    s += "<circle cx='" + f1(bx) + "' cy='" + f1(by) + "' r='13' fill='" + col + "' stroke='#fff' stroke-width='2'/><text x='" + f1(bx) + "' y='" + f1(by + 5) + "' text-anchor='middle' font-size='13' font-weight='800' fill='#fff'>" + n + "</text></g>";
    return s + liste(b.items, cx, y + Lt.length * 19 + 10, NC, col, true);
  }
  function tBulle(b, NC, w) { var h = couper(b.label, NC - 6).length * 19 + 10 + hListe(b.items, NC); return { rx: w / 2, ry: h / 2 + 52 }; }
  function bulles(C, B, alt) {
    var Wd = 920, cx = 460, W0 = 290, NC = 26, cotes = [[], []], s = "", dessus = "", cw = largeurC(C, 170, 240);
    B.forEach(function (b, i) { b.i = i; b.t = tBulle(b, NC, W0); cotes[i % 2].push(b); });
    var hauts = cotes.map(function (c) { return c.reduce(function (a, b) { return a + b.t.ry * 2 + 26; }, 0); }), H = Math.max(hauts[0], hauts[1], 320) + 20, cy = H / 2, cen = centre(cx, cy, C, cw);
    cotes.forEach(function (liste, cote) {
      var sg = cote ? 1 : -1, bx = cx + sg * (450 - W0 / 2 - 14), y = (H - hauts[cote]) / 2 + 13, prev = null;
      liste.forEach(function (b) {
        var by = y + b.t.ry, ex = bx - sg * b.t.rx * .92, ey = by + (cy - by) * .15, sx = cx + sg * cen.a * .8, sy = cy + (by - cy) * .12;
        s += "<path class='cm-t' d='M" + f1(sx) + " " + f1(sy) + " C" + f1(sx + sg * 40) + " " + f1(sy) + " " + f1(ex - sg * 50) + " " + f1(ey) + " " + f1(ex) + " " + f1(ey) + "' fill='none' stroke='" + trait(b.color) + "' stroke-width='" + (STYLE === "sobre" ? 2.8 : 4.6) + "' stroke-linecap='round' marker-end='url(#" + P + "f" + b.i + ")'/>";
        if (prev) s += "<path class='cm-l' d='M" + f1(bx + sg * 30) + " " + f1(prev) + " Q" + f1(bx + sg * 110) + " " + f1((prev + by) / 2) + " " + f1(bx + sg * 30) + " " + f1(by - b.t.ry + 4) + "' fill='none' stroke='#C9D0DC' stroke-width='1.5' stroke-dasharray='3 6'/>";
        dessus += bulle(bx, by, b.t.rx, b.t.ry, b, b.i + 1, NC); prev = by + b.t.ry - 4; y += b.t.ry * 2 + 26;
      });
    });
    return svgDe("cm-large", Wd, H, alt, B, s + dessus + cen.s);
  }
  function bullesEtroit(C, B, alt) {
    var Wd = 400, NC = 32, pc = placerCentre(200, C, largeurC(C, 240, 340)), y = pc.y + pc.c.b + 34, s = "", dessus = "", prev = [200, pc.y + pc.c.b];
    B.forEach(function (b, i) {
      var t = tBulle(b, NC, 330), bx = 200 + (i % 2 ? 14 : -14), by = y + t.ry;
      s += "<path class='cm-t' d='M" + f1(prev[0]) + " " + f1(prev[1]) + " Q" + f1(prev[0] + (i % 2 ? -50 : 50)) + " " + f1((prev[1] + by - t.ry) / 2) + " " + f1(bx) + " " + f1(by - t.ry - 4) + "' fill='none' stroke='" + trait(b.color) + "' stroke-width='4.6' marker-end='url(#" + P + "f" + i + ")'/>";
      dessus += bulle(bx, by, t.rx, t.ry, b, i + 1, NC); prev = [bx, by + t.ry]; y = by + t.ry + 36;
    });
    return svgDe("cm-etroit", Wd, y - 10, alt, B, s + dessus + pc.s);
  }

  /* EN ACCOLADE : le tout et ses parties */
  function accol(x, y1, y2, col, w) {
    /* « { » : pointe en x (vers le tout, à gauche), bras en x + 2w (vers les parties) */
    w = w || 12; var ym = (y1 + y2) / 2, r = Math.min(16, (y2 - y1) / 4), xa = x + 2 * w, xm = x + w;
    return "<path class='cm-t' d='M" + f1(xa) + " " + f1(y1) + " C" + f1(xm) + " " + f1(y1) + " " + f1(xm) + " " + f1(y1 + r * .4) + " " + f1(xm) + " " + f1(y1 + r) + " V" + f1(ym - r) + " C" + f1(xm) + " " + f1(ym - r * .3) + " " + f1(x + w * .4) + " " + f1(ym) + " " + f1(x) + " " + f1(ym) +
      " C" + f1(x + w * .4) + " " + f1(ym) + " " + f1(xm) + " " + f1(ym + r * .3) + " " + f1(xm) + " " + f1(ym + r) + " V" + f1(y2 - r) + " C" + f1(xm) + " " + f1(y2 - r * .4) + " " + f1(xm) + " " + f1(y2) + " " + f1(xa) + " " + f1(y2) + "' fill='none' stroke='" + trait(col) + "' stroke-width='" + (STYLE === "sobre" ? 2.8 : 4.6) + "' stroke-linecap='round' stroke-linejoin='round'/>";
  }
  function accolade(C, B, alt) {
    var Wd = 920, cw = largeurC(C, 170, 250), xb = 20 + cw + 30, xl = xb + 40, lw = 190, xs = xl + lw + 14, xi = xs + 34, NC = Math.floor((Wd - xi - 30) / 8.2);
    var blocs = B.map(function (b) { return Math.max(70, hListe(b.items, NC) + 16) + 22; }), H = blocs.reduce(function (a, b) { return a + b; }, 0) + 40, y = 20, s = "", dessus = "";
    var cen = centre(20 + cw / 2 + (STYLE === "main" ? 14 : 0), H / 2, C, cw);
    s += accol(xb, 24, H - 24, encre("#5B6478"), 14);
    B.forEach(function (b, i) {
      var h = blocs[i] - 22, ym = y + h / 2, et = etiquette(xl + lw / 2, ym, b.label, b.color, i + 1, 15), hl = hListe(b.items, NC);
      s += accol(xs, ym - hl / 2 - 8, ym + hl / 2 + 8, b.color, 10) + liste(b.items, xi, ym - hl / 2 + 11, NC, b.color);
      dessus += et.s; y += blocs[i];
    });
    return svgDe("cm-large", Wd, H, alt, B, s + dessus + cen.s);
  }
  function accoladeEtroit(C, B, alt) {
    var Wd = 400, NC = 34, pc = placerCentre(200, C, largeurC(C, 240, 340)), y = pc.y + pc.c.b + 24, s = "", dessus = "";
    B.forEach(function (b, i) {
      var et = etiquette(0, 0, b.label, b.color, i + 1), ly = y + et.h / 2 + 4, hl = hListe(b.items, NC), y1 = ly + et.h / 2 + 12;
      dessus += "<g transform='translate(" + f1(24 + et.w / 2) + " " + f1(ly) + ")'>" + et.s + "</g>";
      s += accol(22, y1, y1 + hl + 10, b.color, 9) + liste(b.items, 50, y1 + 15, NC, b.color);
      y = y1 + hl + 34;
    });
    return svgDe("cm-etroit", Wd, y, alt, B, s + dessus + pc.s);
  }

  /* MODULAIRE EN ALVÉOLES : centre hexagonal, cellules à pans coupés */
  function alveoles(C, B, alt, Wd) {
    var n = B.length, cols = Wd < 500 ? 1 : (n === 4 || n === 2 ? 2 : 3), g = 18, w = (Wd - 40 - (cols - 1) * g) / cols, pc0 = centre(0, 0, C, largeurC(C, 220, Wd - 60));
    var hy = pc0.b + 30, s = "", dessus = "", top = hy * 2 + 34, y = top;
    var r6 = Math.min(Wd / 2 - 20, pc0.a + 34), cen = "<g class='cm-c'><path d='" + hexa(Wd / 2, hy, r6).replace(/(\d+(\.\d+)?) (\d+(\.\d+)?)/g, function (m, a, _, b) { return f1(Wd / 2 + (a - Wd / 2)) + " " + f1(hy + (b - hy) * (pc0.b + 18) / r6); }) + "' fill='" + (STYLE === "sobre" ? "#1D2B53" : "url(#" + P + "g)") + "' stroke='" + (STYLE === "sobre" ? "#1D2B53" : "#FFC93C") + "' stroke-width='3'/>";
    C.forEach(function (l, k) { cen += "<text x='" + Wd / 2 + "' y='" + f1(hy - (C.length - 1) * 10.5 + 6 + k * 21) + "' text-anchor='middle' font-size='" + (k ? 13.5 : 19) + "' font-weight='" + (k ? 600 : 800) + "' fill='" + (k ? "#FFE08A" : "#fff") + "'>" + esc(l) + "</text>"; });
    cen += "</g>";
    for (var r0 = 0; r0 < n; r0 += cols) {
      var rang = B.slice(r0, r0 + cols), hr = Math.max.apply(null, rang.map(function (b) { return hBoite(b, w); }));
      rang.forEach(function (b, k) {
        var x = 20 + k * (w + g), bx = boite(x, y, w, b, r0 + k + 1, true, hr);
        if (r0 === 0) s += fleche(Wd / 2, hy + pc0.b + 18, x + w / 2, y - 6, b.color, r0 + k, true);
        dessus += bx.s;
      });
      y += hr + g;
    }
    return svgDe(Wd < 500 ? "cm-etroit" : "cm-large", Wd, y + 2, alt, B, s + dessus + cen);
  }

  /* EN FLUX : étapes enchaînées par des flèches (serpentin) */
  function flux(C, B, alt, Wd) {
    var n = B.length, cols = Wd < 500 ? 1 : Math.min(n, 3), g = 46, w = (Wd - 40 - (cols - 1) * g) / cols, pc = placerCentre(Wd / 2, C, largeurC(C, 220, Wd - 60)), y = pc.y + pc.c.b + 30, s = "", dessus = "", prev = null;
    for (var r0 = 0, rg = 0; r0 < n; r0 += cols, rg++) {
      var rang = B.slice(r0, r0 + cols), hr = Math.max.apply(null, rang.map(function (b) { return hBoite(b, w); }));
      rang.forEach(function (b, k) {
        var kk = rg % 2 ? cols - 1 - k : k, x = 20 + kk * (w + g), bx = boite(x, y, w, b, r0 + k + 1, false, hr);
        if (prev) s += prev.y === y ? fleche(prev.x + (kk > prev.k ? w + 4 : -4), y + 30, x + (kk > prev.k ? -8 : w + 8), y + 30, b.color, r0 + k) : fleche(prev.x + w / 2, prev.y + prev.h + 4, x + w / 2, y - 8, b.color, r0 + k, true);
        dessus += bx.s; prev = { x: x, y: y, h: hr, k: kk };
      });
      y += hr + 40;
    }
    return svgDe(Wd < 500 ? "cm-etroit" : "cm-large", Wd, y - 14, alt, B, s + dessus + pc.s);
  }

  /* CAUSES ET CONSÉQUENCES (multi-flux) */
  function causes(C, B, alt, Wd, gauche) {
    var g0 = B.filter(function (b, i) { return gauche[i]; }), d0 = B.filter(function (b, i) { return !gauche[i]; }), s = "", dessus = "";
    if (Wd < 500) {
      var w1 = Wd - 40, y = 18, out = "";
      g0.forEach(function (b) { var bx = boite(20, y, w1, b, B.indexOf(b) + 1, false); out += bx.s; y += bx.h + 14; });
      out += fleche(Wd / 2, y - 4, Wd / 2, y + 24, g0[0].color, B.indexOf(g0[0])); y += 34;
      var c = centre(Wd / 2, 0, C, largeurC(C, 240, Wd - 40)); dessus += "<g transform='translate(0 " + f1(y + c.b) + ")'>" + c.s + "</g>"; y += c.b * 2 + 14;
      out += fleche(Wd / 2, y - 6, Wd / 2, y + 22, d0[0].color, B.indexOf(d0[0])); y += 32;
      d0.forEach(function (b) { var bx = boite(20, y, w1, b, B.indexOf(b) + 1, false); out += bx.s; y += bx.h + 14; });
      return svgDe("cm-etroit", Wd, y + 6, alt, B, out + dessus);
    }
    var w = 290, hg = g0.reduce(function (a, b) { return a + hBoite(b, w) + 16; }, 0), hd = d0.reduce(function (a, b) { return a + hBoite(b, w) + 16; }, 0), H = Math.max(hg, hd, 240) + 30, cy = H / 2;
    var cen = centre(Wd / 2, cy, C, 250), yg = (H - hg) / 2 + 8, yd = (H - hd) / 2 + 8;
    g0.forEach(function (b) { var i = B.indexOf(b), bx = boite(20, yg, w, b, i + 1, false); s += fleche(20 + w + 4, yg + bx.h / 2, Wd / 2 - cen.a - 10, cy, b.color, i, false); dessus += bx.s; yg += bx.h + 16; });
    d0.forEach(function (b) { var i = B.indexOf(b), bx = boite(Wd - 20 - w, yd, w, b, i + 1, false); s += fleche(Wd / 2 + cen.a + 4, cy, Wd - 20 - w - 10, yd + bx.h / 2, b.color, i, false); dessus += bx.s; yd += bx.h + 16; });
    return svgDe("cm-large", Wd, H, alt, B, s + dessus + cen.s);
  }

  /* ════════ ROUE, ARÊTE DE POISSON, ARBRE DESSINÉ, FRISE (18/11/2026, « varie les formes : roue, poisson, arbre, frise ») ════════ */
  function secteur(cx, cy, r0, r1, a0, a1) {
    var g = a1 - a0 > Math.PI ? 1 : 0, c = Math.cos, s = Math.sin;
    return "M" + f1(cx + r1 * c(a0)) + " " + f1(cy + r1 * s(a0)) + " A" + r1 + " " + r1 + " 0 " + g + " 1 " + f1(cx + r1 * c(a1)) + " " + f1(cy + r1 * s(a1)) + " L" + f1(cx + r0 * c(a1)) + " " + f1(cy + r0 * s(a1)) + " A" + r0 + " " + r0 + " 0 " + g + " 0 " + f1(cx + r0 * c(a0)) + " " + f1(cy + r0 * s(a0)) + "Z";
  }
  function moyeu(cx, cy, r, C) {
    var s = "<g class='cm-c'><circle cx='" + f1(cx) + "' cy='" + f1(cy) + "' r='" + r + "' fill='" + (STYLE === "sobre" ? "#1D2B53" : "url(#" + P + "g)") + "' stroke='" + (STYLE === "sobre" ? "#fff" : "#FFC93C") + "' stroke-width='3'/>", L = [];
    C.forEach(function (l, k) { couper(l, k ? 16 : 13).forEach(function (x) { L.push([x, k]); }); });
    L.forEach(function (x, k) { s += "<text x='" + f1(cx) + "' y='" + f1(cy - (L.length - 1) * 8.5 + 5 + k * 17) + "' text-anchor='middle' font-size='" + (x[1] ? 11.5 : 14.5) + "' font-weight='" + (x[1] ? 600 : 800) + "' fill='" + (x[1] ? "#FFE08A" : "#fff") + "'>" + esc(x[0]) + "</text>"; });
    return s + "</g>";
  }
  function roueSvg(cx, cy, R, r0, B) {
    var n = B.length, s = "", dA = 2 * Math.PI / n;
    B.forEach(function (b, i) {
      var a0 = -Math.PI / 2 + i * dA + .015, a1 = a0 + dA - .03, am = (a0 + a1) / 2, rm = (r0 + R) / 2, L = couper(b.label, 11).slice(0, 3);
      s += "<path class='cm-h' d='" + secteur(cx, cy, r0, R, a0, a1) + "' fill='" + (STYLE === "sobre" ? clair(b.color, .82) : STYLE === "colore" ? b.color : ARD() ? alpha(b.color, .45) : clair(b.color, .55)) + "' stroke='#fff' stroke-width='3'/>";
      L.forEach(function (l, k) { s += "<text x='" + f1(cx + rm * Math.cos(am)) + "' y='" + f1(cy + rm * Math.sin(am) - (L.length - 1) * 7.5 + 4 + k * 15) + "' text-anchor='middle' font-size='12.5' font-weight='800' fill='" + (STYLE === "colore" ? "#fff" : encre("#1D2330")) + "'>" + esc(l) + "</text>"; });
      s += "<circle cx='" + f1(cx + (R + 14) * Math.cos(am)) + "' cy='" + f1(cy + (R + 14) * Math.sin(am)) + "' r='12' fill='" + b.color + "' stroke='#fff' stroke-width='2.5'/><text x='" + f1(cx + (R + 14) * Math.cos(am)) + "' y='" + f1(cy + (R + 14) * Math.sin(am) + 4.5) + "' text-anchor='middle' font-size='12' font-weight='800' fill='#fff'>" + (i + 1) + "</text>";
    });
    return s;
  }
  function blocTexte(x, y, w, b, n, anc) {
    var NC = Math.floor((w - 20) / 8.2), Lt = couper(b.label, NC), s = "";
    Lt.forEach(function (l, k) { s += "<text x='" + f1(x) + "' y='" + f1(y + k * 19) + "' font-size='16' font-weight='800' fill='" + (STYLE === "sobre" ? encre("#1D2330") : b.color) + "'>" + (k ? "" : n + ". ") + esc(l) + "</text>"; });
    return { s: s + liste(b.items, x, y + Lt.length * 19 + 8, NC - 2, b.color), h: Lt.length * 19 + 8 + hListe(b.items, NC - 2) };
  }
  function roue(C, B, alt, Wd) {
    var n = B.length, dA = 2 * Math.PI / n, s = "", etr = Wd < 500;
    if (etr) {
      var R = 156, r0 = 66, cy = R + 32, y = cy + R + 46;
      s += roueSvg(200, cy, R, r0, B) + moyeu(200, cy, r0 - 6, C);
      B.forEach(function (b, i) { var bt = blocTexte(24, y, 360, b, i + 1); s += "<rect x='14' y='" + f1(y - 22) + "' width='6' height='" + f1(bt.h + 14) + "' rx='3' fill='" + b.color + "'/>" + bt.s; y += bt.h + 30; });
      return svgDe("cm-etroit", Wd, y - 6, alt, B, s);
    }
    var R = 165, r0 = 72, cx = 460, cols = [[], []];
    B.forEach(function (b, i) { var am = -Math.PI / 2 + (i + .5) * dA; cols[Math.cos(am) < -1e-6 ? 0 : 1].push({ b: b, i: i, am: am }); });
    cols[0].sort(function (p, q) { return Math.sin(p.am) - Math.sin(q.am); }); cols[1].sort(function (p, q) { return Math.sin(p.am) - Math.sin(q.am); });
    var bw = 230, hs = cols.map(function (c) { return c.reduce(function (a, e) { return a + blocTexte(0, 0, bw, e.b, 1).h + 34; }, 0); }), H = Math.max(hs[0], hs[1], 2 * R + 60) + 20, cy = H / 2;
    cols.forEach(function (c, cote) {
      var y = (H - hs[cote]) / 2 + 26, x = cote ? cx + R + 50 : 20;
      c.forEach(function (e) {
        var bt = blocTexte(x, y, bw, e.b, e.i + 1), ax = cx + (R + 28) * Math.cos(e.am), ay = cy + (R + 28) * Math.sin(e.am), tx = cote ? x - 10 : x + bw - 6, ty = y - 6;
        s += "<path class='cm-l' d='M" + f1(ax) + " " + f1(ay) + " Q" + f1((ax + tx) / 2) + " " + f1(ty) + " " + f1(tx) + " " + f1(ty) + "' fill='none' stroke='" + trait(e.b.color) + "' stroke-width='2' stroke-dasharray='1 5' stroke-linecap='round'/>" + bt.s;
        y += bt.h + 34;
      });
    });
    return svgDe("cm-large", Wd, H, alt, B, roueSvg(cx, cy, R, r0, B) + moyeu(cx, cy, r0 - 6, C) + s);
  }

  /* ARÊTE DE POISSON : la tête porte le sujet, chaque arête une branche, les mots en arêtes secondaires */
  function poisson(C, B, alt, Wd) {
    var s = "", etr = Wd < 500, enc = encre("#2E3A55");
    if (etr) {
      var y = 26, sx = 34, out = "", dessus = "";
      B.forEach(function (b, i) {
        var Lt = couper(b.label, 24), by = y + 10, hl = hListe(b.items, 30);
        out += "<path class='cm-t' d='M" + sx + " " + f1(by + 46) + " L" + (sx + 46) + " " + f1(by + 6) + "' stroke='" + trait(b.color) + "' stroke-width='3.5' stroke-linecap='round'/>";
        dessus += "<circle cx='" + (sx + 58) + "' cy='" + f1(by) + "' r='12' fill='" + b.color + "'/><text x='" + (sx + 58) + "' y='" + f1(by + 4.5) + "' text-anchor='middle' font-size='12.5' font-weight='800' fill='#fff'>" + (i + 1) + "</text>";
        Lt.forEach(function (l, k) { dessus += "<text x='" + (sx + 78) + "' y='" + f1(by + 5 + k * 19) + "' font-size='16' font-weight='800' fill='" + (STYLE === "sobre" ? encre("#1D2330") : b.color) + "'>" + esc(l) + "</text>"; });
        out += liste(b.items, sx + 74, by + Lt.length * 19 + 22, 30, b.color);
        y = by + Lt.length * 19 + 22 + hl + 22;
      });
      var hy = y + 10, hh = 44 + C.length * 18;
      out = "<path class='cm-t' d='M" + sx + " 14 V" + f1(hy) + "' stroke='" + enc + "' stroke-width='6' stroke-linecap='round'/><path d='M" + (sx - 16) + " 4 L" + sx + " 22 L" + (sx + 16) + " 4' fill='none' stroke='" + enc + "' stroke-width='4' stroke-linejoin='round'/>" + out;
      var head = "<path class='cm-c' d='M16 " + f1(hy) + " H384 Q384 " + f1(hy + hh) + " 200 " + f1(hy + hh + 26) + " Q16 " + f1(hy + hh) + " 16 " + f1(hy) + "Z' fill='" + (STYLE === "sobre" ? "#1D2B53" : "url(#" + P + "g)") + "' stroke='#FFC93C' stroke-width='3'/>";
      C.forEach(function (l, k) { head += "<text x='200' y='" + f1(hy + 32 + k * 19) + "' text-anchor='middle' font-size='" + (k ? 13 : 17) + "' font-weight='" + (k ? 600 : 800) + "' fill='" + (k ? "#FFE08A" : "#fff") + "'>" + esc(l) + "</text>"; });
      head += "<circle cx='364' cy='" + f1(hy + 16) + "' r='6' fill='#fff'/><circle cx='365' cy='" + f1(hy + 17) + "' r='3' fill='#001136'/>";
      return svgDe("cm-etroit", Wd, hy + hh + 40, alt, B, out + dessus + head);
    }
    var haut = B.filter(function (b, i) { return i % 2 === 0; }), bas = B.filter(function (b, i) { return i % 2 === 1; }), m = Math.max(haut.length, bas.length), x0 = 40, xh = 680, S = (xh - x0) / m, NC = Math.max(14, Math.floor((S - 130) / 8.2));
    function hBras(b) { return couper(b.label, NC + 2).length * 19 + 22 + hListe(b.items, NC) + 26; }
    var Ht = Math.max.apply(null, haut.map(hBras).concat([90])), Hb = bas.length ? Math.max.apply(null, bas.map(hBras).concat([90])) : 60, cy = Ht + 30, H = cy + Hb + 30, dessus = "";
    function bras(b, j, sg) {
      var i = B.indexOf(b), bx = x0 + S * (j + 1) - 12, Lb = hBras(b) - 6, ex = bx - .42 * Lb, ey = cy - sg * Lb, Lt = couper(b.label, NC + 2), col = b.color;
      s += "<path class='cm-t' d='M" + f1(bx) + " " + f1(cy) + " L" + f1(ex) + " " + f1(ey + sg * 8) + "' stroke='" + trait(col) + "' stroke-width='5.5' stroke-linecap='round'/>";
      var tw = Math.max.apply(null, Lt.map(function (l) { return l.length; })) * 9 + 30, lx = ex - tw / 2, ly = ey - (sg > 0 ? Lt.length * 19 + 2 : -8);
      dessus += "<g class='cm-h'><rect x='" + f1(lx) + "' y='" + f1(ly - 4) + "' width='" + f1(tw) + "' height='" + f1(Lt.length * 19 + 10) + "' rx='9' fill='" + (STYLE === "colore" ? col : "#fff") + "' stroke='" + col + "' stroke-width='2'/>";
      Lt.forEach(function (l, k) { dessus += "<text x='" + f1(ex) + "' y='" + f1(ly + 14 + k * 19) + "' text-anchor='middle' font-size='15' font-weight='800' fill='" + (STYLE === "colore" ? "#fff" : col) + "'>" + (k ? "" : (i + 1) + ". ") + esc(l) + "</text>"; });
      dessus += "</g>";
      var yy = sg > 0 ? ey + Lt.length * 19 + 30 : ey - Lt.length * 19 - 22 - hListe(b.items, NC) + 4;
      b.items.forEach(function (it) {
        var L = couper(it, NC), xb = bx - .42 * Math.abs(cy - (yy - 5));
        s += "<path class='cm-l' d='M" + f1(xb - 2) + " " + f1(yy - 5) + " H" + f1(xb - 18) + "' stroke='" + clair(trait(col), .3) + "' stroke-width='2'/>" + texte(xb - 24, yy, L, { t: T2, a: "end" });
        yy += L.length * LH2 + 8;
      });
    }
    haut.forEach(function (b, j) { bras(b, j, 1); }); bas.forEach(function (b, j) { bras(b, j, -1); });
    var head = "<path class='cm-c' d='M" + (xh - 10) + " " + f1(cy - 64) + " Q" + (xh + 190) + " " + f1(cy - 70) + " 906 " + f1(cy) + " Q" + (xh + 190) + " " + f1(cy + 70) + " " + (xh - 10) + " " + f1(cy + 64) + " Q" + (xh + 14) + " " + f1(cy) + " " + (xh - 10) + " " + f1(cy - 64) + "Z' fill='" + (STYLE === "sobre" ? "#1D2B53" : "url(#" + P + "g)") + "' stroke='#FFC93C' stroke-width='3'/>";
    var LC = []; C.forEach(function (l, k) { couper(l, k ? 22 : 16).forEach(function (x) { LC.push([x, k]); }); });
    LC.forEach(function (x, k) { head += "<text x='" + (xh + 98) + "' y='" + f1(cy - (LC.length - 1) * 9 + 5 + k * 18) + "' text-anchor='middle' font-size='" + (x[1] ? 12.5 : 16) + "' font-weight='" + (x[1] ? 600 : 800) + "' fill='" + (x[1] ? "#FFE08A" : "#fff") + "'>" + esc(x[0]) + "</text>"; });
    head += "<circle cx='" + (xh + 176) + "' cy='" + f1(cy - 22) + "' r='7' fill='#fff'/><circle cx='" + (xh + 178) + "' cy='" + f1(cy - 21) + "' r='3.5' fill='#001136'/>";
    var dos = "<path class='cm-t' d='M" + (x0 - 6) + " " + f1(cy) + " H" + (xh + 4) + "' stroke='" + enc + "' stroke-width='7' stroke-linecap='round'/><path d='M" + (x0 + 12) + " " + f1(cy) + " L" + (x0 - 22) + " " + f1(cy - 30) + " M" + (x0 + 12) + " " + f1(cy) + " L" + (x0 - 22) + " " + f1(cy + 30) + "' stroke='" + enc + "' stroke-width='5' stroke-linecap='round'/>";
    return svgDe("cm-large", Wd, H, alt, B, dos + s + dessus + head);
  }

  /* ARBRE DESSINÉ : un tronc qui porte le sujet, des branches qui montent vers des feuillages (une idée chacun) */
  function feuillage(cx, cy, rx, ry, b, n, NC) {
    var col = b.color, s = "<g class='cm-h'>", k, d = "";
    for (k = 0; k <= 72; k++) { var u = 2 * Math.PI * k / 72, j = 1 + .045 * Math.sin(7 * u + n) + .02 * Math.sin(13 * u); d += (k ? "L" : "M") + f1(cx + rx * j * Math.cos(u)) + " " + f1(cy + ry * j * Math.sin(u)); }
    var fill = STYLE === "sobre" ? "#F4F8F2" : STYLE === "colore" ? clair(col, .78) : teinte(col, .88);
    s += "<path d='" + d + "Z' fill='" + fill + "' stroke='" + (STYLE === "sobre" ? "#9DB59A" : col) + "' stroke-width='" + (STYLE === "sobre" ? 1.4 : 2.4) + "' stroke-linejoin='round'/>";
    for (k = 0; k < 5; k++) { var a = -2.6 + k * .45, lx = cx + rx * .98 * Math.cos(a), ly = cy + ry * .98 * Math.sin(a); s += "<path d='M" + f1(lx) + " " + f1(ly) + " q6 -10 14 -4 q-4 9 -14 4z' fill='" + (STYLE === "sobre" ? "#9DB59A" : col) + "' opacity='.75'/>"; }
    var Lt = couper(b.label, NC - 4), h = Lt.length * 19 + 10 + hListe(b.items, NC), y = cy - h / 2 + 14;
    Lt.forEach(function (l, q) { s += "<text x='" + f1(cx) + "' y='" + f1(y + q * 19) + "' text-anchor='middle' font-size='16' font-weight='800' fill='" + (STYLE === "sobre" ? encre("#1D2330") : col) + "'>" + (q ? "" : n + ". ") + esc(l) + "</text>"; });
    return s + "</g>" + liste(b.items, cx, y + Lt.length * 19 + 10, NC, col, true);
  }
  function tronc(cx, yTop, yBas, C) {
    var bois = STYLE === "sobre" ? "#8B7B6B" : "#8A5A2D", s = "<path d='M" + (cx - 34) + " " + yBas + " C" + (cx - 26) + " " + (yBas - 40) + " " + (cx - 22) + " " + (yTop + 40) + " " + (cx - 16) + " " + yTop + " H" + (cx + 16) + " C" + (cx + 22) + " " + (yTop + 40) + " " + (cx + 26) + " " + (yBas - 40) + " " + (cx + 34) + " " + yBas + " Q" + (cx + 60) + " " + (yBas + 4) + " " + (cx + 76) + " " + (yBas + 10) + " H" + (cx - 76) + " Q" + (cx - 60) + " " + (yBas + 4) + " " + (cx - 34) + " " + yBas + "Z' fill='" + bois + "'/>";
    s += "<path d='M" + (cx - 8) + " " + (yTop + 30) + " q6 40 -2 80 M" + (cx + 9) + " " + (yTop + 60) + " q-5 30 3 60' stroke='#6B4423' stroke-width='2' fill='none' opacity='.6'/><rect x='" + (cx - 200) + "' y='" + (yBas + 10) + "' width='400' height='6' rx='3' fill='#7FB069' opacity='.5'/>";
    var LC = []; C.forEach(function (l, k) { couper(l, k ? 26 : 22).forEach(function (x) { LC.push([x, k]); }); });
    var ph = LC.length * 19 + 18, pw = Math.min(380, Math.max.apply(null, LC.map(function (x) { return x[0].length * (x[1] ? 7.8 : 10.4); })) + 40), py = (yTop + yBas) / 2 - ph / 2;
    s += "<g class='cm-c'><rect x='" + f1(cx - pw / 2) + "' y='" + f1(py) + "' width='" + f1(pw) + "' height='" + f1(ph) + "' rx='8' fill='" + (STYLE === "sobre" ? "#1D2B53" : "url(#" + P + "g)") + "' stroke='#FFC93C' stroke-width='2.5'/>";
    LC.forEach(function (x, k) { s += "<text x='" + cx + "' y='" + f1(py + 24 + k * 19) + "' text-anchor='middle' font-size='" + (x[1] ? 12.5 : 16) + "' font-weight='" + (x[1] ? 600 : 800) + "' fill='" + (x[1] ? "#FFE08A" : "#fff") + "'>" + esc(x[0]) + "</text>"; });
    return s + "</g>";
  }
  function arbreDessin(C, B, alt, Wd) {
    var etr = Wd < 500, n = B.length, cols = etr ? 1 : (n <= 2 ? n : n === 4 ? 2 : 3), g = 22, w = (Wd - 30 - (cols - 1) * g) / cols, NC = Math.floor((w - 96) / 8), rangs = [], y = 18;
    for (var r0 = 0; r0 < n; r0 += cols) rangs.push(B.slice(r0, r0 + cols));
    var pos = [];
    rangs.forEach(function (rg, ri) {
      var hs = rg.map(function (b) { return couper(b.label, NC - 4).length * 19 + 10 + hListe(b.items, NC) + 70; }), hr = Math.max.apply(null, hs), dec = cols > 1 && rg.length < cols ? (cols - rg.length) * (w + g) / 2 : 0;
      rg.forEach(function (b, k) { pos.push({ b: b, cx: 15 + dec + k * (w + g) + w / 2, cy: y + hr / 2, rx: w / 2, ry: hs[k] / 2 }); });
      y += hr + (etr ? 26 : 30);
    });
    var yTop = y + 10, yBas = yTop + 150, cx = Wd / 2, bois = STYLE === "sobre" ? "#8B7B6B" : "#8A5A2D", s = "", dessus = "";
    pos.forEach(function (p, i) {
      var ex = etr ? cx : p.cx, ey = p.cy + p.ry * .6, sw = etr ? 9 : 12 - Math.min(5, (yTop - ey) / 90);
      s += "<path class='cm-t' d='M" + f1(cx + (etr ? 0 : (p.cx - cx) * .04)) + " " + f1(yTop + 4) + " C" + f1(cx + (p.cx - cx) * .1) + " " + f1(yTop - 60) + " " + f1(ex - (ex - cx) * .2) + " " + f1(ey + 70) + " " + f1(ex) + " " + f1(ey) + "' fill='none' stroke='" + bois + "' stroke-width='" + f1(sw) + "' stroke-linecap='round'/>";
      dessus += feuillage(p.cx, p.cy, p.rx, p.ry, p.b, i + 1, NC);
    });
    return svgDe(etr ? "cm-etroit" : "cm-large", Wd, yBas + 24, alt, B, s + dessus + tronc(cx, yTop, yBas, C));
  }

  /* FRISE CHRONOLOGIQUE : un axe fléché, les moments en cartes, alternées dessus / dessous */
  function frise(C, B, alt, Wd) {
    var n = B.length, s = "", dessus = "", col0 = encre("#2E3A55");
    if (Wd < 500) {
      var pc = placerCentre(200, C, largeurC(C, 240, 360)), y = pc.y + pc.c.b + 30, x = 30, d0 = y;
      B.forEach(function (b, i) { var bx = boite(56, y, 326, b, i + 1, false); dessus += "<circle cx='" + x + "' cy='" + f1(y + 25) + "' r='9' fill='#fff' stroke='" + b.color + "' stroke-width='4'/><path d='M" + (x + 10) + " " + f1(y + 25) + " H54' stroke='" + trait(b.color) + "' stroke-width='2.5'/>" + bx.s; y += bx.h + 22; });
      s += "<path class='cm-t' d='M" + x + " " + f1(d0 - 6) + " V" + f1(y + 4) + "' stroke='" + col0 + "' stroke-width='4' stroke-linecap='round' marker-end='url(#" + P + "fx)'/>";
      return svgDe("cm-etroit", Wd, y + 22, alt, B, s.replace("#" + P + "fx", "#" + P + "f0") + dessus + pc.s);
    }
    var pc2 = placerCentre(Wd / 2, C, largeurC(C, 240, 600)), x0 = 60, x1 = Wd - 70, pas = n > 1 ? (x1 - x0) / (n - 1) : 0, cw = Math.min(268, n > 1 ? pas * 2 - 24 : 300);
    var hs = B.map(function (b) { return hBoite(b, cw); }), Hh = Math.max.apply(null, hs.filter(function (h, i) { return i % 2 === 0; }).concat([60])), Hb = Math.max.apply(null, hs.filter(function (h, i) { return i % 2 === 1; }).concat([40]));
    var top = pc2.y + pc2.c.b + 24, ay = top + Hh + 40, H = ay + 40 + Hb + 20;
    s += "<path class='cm-t' d='M24 " + f1(ay) + " H" + (Wd - 26) + "' stroke='" + col0 + "' stroke-width='5' stroke-linecap='round'/><path d='M" + (Wd - 40) + " " + f1(ay - 12) + " L" + (Wd - 20) + " " + f1(ay) + " L" + (Wd - 40) + " " + f1(ay + 12) + "' fill='none' stroke='" + col0 + "' stroke-width='5' stroke-linejoin='round' stroke-linecap='round'/>";
    B.forEach(function (b, i) {
      var x = x0 + i * pas, haut = i % 2 === 0, bx0 = Math.max(16, Math.min(Wd - 16 - cw, x - cw / 2)), by = haut ? ay - 40 - hs[i] : ay + 40, bx = boite(bx0, by, cw, b, i + 1, false, hs[i]);
      s += "<path class='cm-l' d='M" + f1(x) + " " + f1(ay + (haut ? -12 : 12)) + " V" + f1(haut ? ay - 40 : ay + 40) + "' stroke='" + trait(b.color) + "' stroke-width='2.5' stroke-dasharray='2 5' stroke-linecap='round'/>";
      dessus += "<circle cx='" + f1(x) + "' cy='" + f1(ay) + "' r='11' fill='#fff' stroke='" + b.color + "' stroke-width='5'/>" + bx.s;
    });
    return svgDe("cm-large", Wd, H, alt, B, s + dessus + pc2.s);
  }

  var FORMES = ["radiale", "organigramme", "bulles", "accolade", "alveoles", "roue", "poisson", "arbre"], STYLES = ["main", "colore", "postit", "ardoise"];
  function hache(t) { var h = 7; for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) % 100003; return h; }

  /* carte = { centre: "Titre\nSous-titre" | [lignes], branches: [{ label, color?, items: [] }] } */
  function VRT_CM(carte) {
    var C = (Array.isArray(carte.centre) ? carte.centre : String(carte.centre || "").split("\n")).map(function (x) { return String(x).trim(); }).filter(Boolean);
    var B = (carte.branches || []).filter(function (b) { return b && (b.items || []).length; }).map(function (b, i) {
      return { label: String(b.label || "").trim(), color: /^#[0-9a-f]{6}$/i.test(b.color || "") ? b.color : COUL[i % COUL.length], items: b.items.map(function (x) { return String(x).replace(/\s+/g, " ").trim(); }).filter(Boolean) };
    }).filter(function (b) { return b.items.length; });
    if (!B.length) return "";
    var alt = "Carte mentale : " + C.join(", ") + ". " + B.map(function (b) { return b.label + " : " + b.items.join(" ; "); }).join(". ");
    /* forme et style : imposés par la carte, sinon tirés du titre (stables d'une génération à l'autre et variés d'une carte à l'autre) */
    var hh = hache(C.join(" ")), pal = PALETTES[Math.floor(hh / 13) % PALETTES.length];
    if (!carte.garderCouleurs) B.forEach(function (b, i) { b.color = pal[i % pal.length]; });
    var forme = carte.forme || FORMES[hh % FORMES.length], st = carte.style || STYLES[Math.floor(hh / 7) % STYLES.length];
    var gauche = B.map(function (b) { return /cause|origine|facteur|pourquoi/i.test(b.label) && !/conséquence|effet|impact/i.test(b.label); });
    if (forme === "causes" && (gauche.indexOf(true) < 0 || gauche.indexOf(false) < 0)) forme = "radiale";
    if (forme === "organigramme" && B.length > 5) forme = "radiale";
    var n = ++NUM, h = "", cp = function () { return B.map(function (b) { return Object.assign({}, b); }); };
    if (st === "ardoise" && !carte.garderCouleurs) B.forEach(function (b, i) { b.color = ["#FFD166", "#FF8FA3", "#8BE9FD", "#B9F18C", "#FFB86B", "#D0A9FF"][i % 6]; });
    STYLE = st;
    P = "cm" + n + "a";
    h += forme === "organigramme" ? arbre(C, cp(), alt) : forme === "roue" ? roue(C, cp(), alt, 920) : forme === "poisson" ? poisson(C, cp(), alt, 920) : forme === "arbre" ? arbreDessin(C, cp(), alt, 920) : forme === "frise" ? frise(C, cp(), alt, 920) : forme === "bulles" ? bulles(C, cp(), alt) : forme === "accolade" ? accolade(C, cp(), alt) : forme === "alveoles" ? alveoles(C, cp(), alt, 920) : forme === "flux" ? flux(C, cp(), alt, 920) : forme === "causes" ? causes(C, cp(), alt, 920, gauche) : large(C, cp(), alt);
    P = "cm" + n + "b";
    h += forme === "roue" ? roue(C, cp(), alt, 400) : forme === "poisson" ? poisson(C, cp(), alt, 400) : forme === "arbre" ? arbreDessin(C, cp(), alt, 400) : forme === "frise" ? frise(C, cp(), alt, 400) : forme === "bulles" ? bullesEtroit(C, cp(), alt) : forme === "accolade" ? accoladeEtroit(C, cp(), alt) : forme === "alveoles" ? alveoles(C, cp(), alt, 400) : forme === "flux" ? flux(C, cp(), alt, 400) : forme === "causes" ? causes(C, cp(), alt, 400, gauche) : etroit(C, cp(), alt);
    STYLE = "main";
    return "<div class='cm cm-" + forme + " cm-s-" + st + "' data-forme='" + forme + "'>" + h + "</div>";
  }

  /* carte d'une leçon : une branche par partie (hors entraînement), les mots tirés de « à retenir »
     (coupé aux « ; » et aux phrases), à défaut des titres en gras de la partie. */
  function nu(h) { return String(h || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;|&rsquo;/g, "’").replace(/&quot;/g, "\"").replace(/\s+/g, " ").trim(); }
  function morceaux(r) {
    var t = nu(r).replace(/^Savoir-être[^:]*:\s*/i, ""), m = t.replace(/([.!?])\s+(?=[A-ZÀ-Ý«])/g, "$1\u0001").split(/\s*;\s*|\u0001/).map(function (x) { return x.replace(/[.]\s*$/, "").trim(); }).filter(function (x) { return x.length > 1; });
    return m.length ? m : (t ? [t] : []);
  }
  function VRT_CM_LECON(L) {
    if (!L || !L.parties) return "";
    var B = [];
    L.parties.forEach(function (p) {
      if (p.verrou || /entraînement|entrainement|intégration|exercices?\b/i.test(p.t || "")) return;
      var it = p.retenir ? morceaux(p.retenir) : [];
      if (it.length < 2) {
        var g = (String(p.html || "").match(/<(?:strong|b)>([^<]{3,60})<\/(?:strong|b)>/g) || []).map(nu).filter(function (x, i, a) { return a.indexOf(x) === i && x.split(" ").length <= 4 && it.indexOf(x) < 0 && !/^(Définition|Exemple|Attention|Astuce|Le savais-tu|Remarque|Méthode|Retiens|Comparer|À retenir)/i.test(x) && !/^(que|qui|dont|où|et|le|la|les|un|une|de|des)\s/i.test(x); });
        it = it.concat(g.slice(0, 5 - it.length));
      }
      if (it.length) B.push({ label: nu(p.t).replace(/^\d+\.\s*/, "").slice(0, 42), items: it.slice(0, 6) });
    });
    if (B.length < 2) return "";
    /* forme selon le contenu : étapes → flux ; causes et conséquences → multi-flux ; sinon variée selon le titre */
    var lab = B.map(function (b) { return b.label; }).join(" | "), forme = /étape|méthode|démarche|procédure|phase/i.test(lab) ? "flux" : (B.some(function (b) { return /cause|origine/i.test(b.label) && !/conséquence|effet|impact/i.test(b.label); }) && B.some(function (b) { return /conséquence|effet|impact/i.test(b.label) && !/cause|origine/i.test(b.label); })) ? "causes" : /hist/i.test(L.m || "") || /\b1[0-9]{3}\b|siècle/.test(lab) ? "frise" : null;
    return VRT_CM({ centre: [nu(L.cle || L.titre)].concat(L.c ? [L.c] : []), branches: B.slice(0, 6), forme: forme });
  }
  VRT_CM.lecon = VRT_CM_LECON;
  VRT_CM.css = ".cm{margin:6px 0}.cm svg{display:block;width:100%;height:auto;border-radius:18px}.cm .cm-etroit{display:none}" +
    "@media (max-width:640px){.cm .cm-large{display:none}.cm .cm-etroit{display:block}}" +
    "@media (prefers-reduced-motion:no-preference){.cm .cm-t,.cm .cm-l{stroke-dasharray:1200;stroke-dashoffset:1200;animation:cmTrace 1.2s ease-out forwards}" +
    ".cm .cm-etroit .cm-t[stroke-dasharray='2 7']{stroke-dasharray:2 7;stroke-dashoffset:0;animation:none}" +
    ".cm .cm-l{animation-delay:.4s}.cm .cm-p,.cm text,.cm .cm-h{opacity:0;animation:cmVoir .5s ease-out .75s forwards}.cm .cm-c,.cm .cm-c text{opacity:1;animation:none}" +
    ".cm .cm-c{transform-box:fill-box;transform-origin:center;animation:cmGonfle .7s cubic-bezier(.34,1.56,.64,1) both}}" +
    "@keyframes cmTrace{to{stroke-dashoffset:0}}@keyframes cmVoir{to{opacity:1}}@keyframes cmGonfle{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}" +
    "@media print{.cm .cm-large{display:block!important}.cm .cm-etroit{display:none!important}}";
  W.VRT_CM = VRT_CM;
  if (typeof module !== "undefined" && module.exports) module.exports = VRT_CM;
})(typeof window !== "undefined" ? window : globalThis);
