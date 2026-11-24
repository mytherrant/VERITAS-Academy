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
  /* fond blanc pour tous les styles (18/11/2026, « arrière-fond en blanc pour plus de lisibilité ») ; l'ardoise garde son tableau si on la demande */
  function fond(Wd, H) {
    if (ARD()) return "<rect width='" + Wd + "' height='" + Math.round(H) + "' rx='18' fill='#6B4423'/><rect x='9' y='9' width='" + (Wd - 18) + "' height='" + Math.round(H - 18) + "' rx='10' fill='#24453B'/>";
    return "<rect x='.5' y='.5' width='" + (Wd - 1) + "' height='" + Math.round(H - 1) + "' rx='16' fill='#fff' stroke='#EEF1F6'/>";
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
    var cw = largeurC(C, 180, 260), cen0 = centre(cx, 0, C, cw), trou = cen0.h + 56;
    var hauts = cotes.map(function (c) { return c.reduce(function (a, b) { return a + bloc(b); }, 0) + (c.length >= 2 ? trou : 0); });
    var H = Math.max(hauts[0], hauts[1], 300) + 40, cy = H / 2, s = "", dessus = "";
    var cen = centre(cx, cy, C, cw);
    cotes.forEach(function (liste, cote) {
      var sg = cote ? 1 : -1, col0 = cx + sg * 248, y0 = (H - hauts[cote]) / 2;
      liste.forEach(function (b, kb) {
        if (liste.length >= 2 && kb === Math.ceil(liste.length / 2)) y0 += trou;
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
      s += (b.items.length ? accol(xs, ym - hl / 2 - 8, ym + hl / 2 + 8, b.color, 10) : "") + liste(b.items, xi, ym - hl / 2 + 11, NC, b.color);
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

  /* ════════ AMPOULE (22/11/2026, « varie les cartes mentales », modèle de Jacques : une ampoule au centre,
     des branches numérotées 01, 02… dans des pastilles, soulignées, reliées à l'ampoule par des flèches courbes) ════════ */
  function ampouleDessin(cx, cy, k) {
    /* position sur un groupe extérieur : l'animation CSS de .cm-c redéfinit transform et écraserait l'attribut */
    var s = "<g transform='translate(" + f1(cx) + " " + f1(cy) + ") scale(" + k + ")'><g class='cm-c'>", i, a;
    for (i = 0; i < 12; i++) { a = -Math.PI + i * Math.PI / 11; s += "<line x1='" + f1(70 * Math.cos(a)) + "' y1='" + f1(70 * Math.sin(a) - 6) + "' x2='" + f1(88 * Math.cos(a)) + "' y2='" + f1(88 * Math.sin(a) - 6) + "' stroke='#F7C948' stroke-width='5' stroke-linecap='round'/>"; }
    s += "<circle cx='0' cy='-6' r='58' fill='#FFF6C9' stroke='#7B2CBF' stroke-width='4'/><path d='M-30 40 Q-34 58 -24 66 H24 Q34 58 30 40Z' fill='#FFF6C9' stroke='#7B2CBF' stroke-width='4' stroke-linejoin='round'/>";
    s += "<path d='M-14 52 V8 Q-14 -8 0 -8 Q14 -8 14 8 V52' fill='none' stroke='#C24E00' stroke-width='3.5' stroke-linecap='round'/><path d='M-14 8 Q-7 -2 0 8 T14 8' fill='none' stroke='#F46036' stroke-width='3'/>";
    for (i = 0; i < 3; i++) s += "<rect x='-24' y='" + (66 + i * 10) + "' width='48' height='8' rx='4' fill='" + (i % 2 ? "#5A6378" : "#8A93A6") + "'/>";
    return s + "<path d='M-10 96 H10 L4 104 H-4Z' fill='#3B4456'/></g></g>";
  }
  function pastilleNum(x, y, n, col) {
    var t = (n < 10 ? "0" : "") + n;
    return "<rect x='" + f1(x) + "' y='" + f1(y) + "' width='46' height='26' rx='13' fill='#fff' stroke='" + col + "' stroke-width='2.5'/><text x='" + f1(x + 23) + "' y='" + f1(y + 18) + "' text-anchor='middle' font-size='14' font-weight='800' fill='" + col + "'>" + t + "</text>";
  }
  function hBlocAmp(b, w) { var NC = Math.floor((w - 24) / 8.2); return 36 + couper(b.label, Math.floor(w / 9.6)).length * 20 + 14 + hListe(b.items, NC) + 16; }
  function blocAmp(x, y, w, b, n) {
    var NC = Math.floor((w - 24) / 8.2), Lt = couper(b.label, Math.floor(w / 9.6)), s = "<g class='cm-h'>" + pastilleNum(x, y, n, b.color), yy = y + 50;
    Lt.forEach(function (l, k) { s += "<text x='" + f1(x) + "' y='" + f1(yy + k * 20) + "' font-size='17' font-weight='800' fill='" + encre("#1D2330") + "'>" + esc(l) + "</text>"; });
    yy += (Lt.length - 1) * 20 + 10;
    s += "<rect x='" + f1(x) + "' y='" + f1(yy) + "' width='" + f1(Math.min(w, 70 + Math.max.apply(null, Lt.map(function (l) { return l.length; })) * 8.6)) + "' height='5' rx='2.5' fill='" + b.color + "' opacity='.85'/></g>";
    return { s: s + liste(b.items, x, yy + 26, NC, b.color), h: hBlocAmp(b, w) };
  }
  function titresAmp(cx, y, C, w) {
    var s = "", L0 = [], L1 = [];
    couper(C[0] || "", Math.floor(w / 10.4)).forEach(function (l) { L0.push(l); });
    if (C[1]) couper(C[1], Math.floor(w / 9)).forEach(function (l) { L1.push(l); });
    var h0 = 18 + L0.length * 20, h1 = L1.length ? 14 + L1.length * 18 : 0;
    s += "<g class='cm-c'><rect x='" + f1(cx - w / 2) + "' y='" + f1(y) + "' width='" + w + "' height='" + h0 + "' rx='8' fill='#fff' stroke='#0E9AA7' stroke-width='3'/>";
    L0.forEach(function (l, k) { s += "<text x='" + f1(cx) + "' y='" + f1(y + 24 + k * 20) + "' text-anchor='middle' font-size='16' font-weight='800' fill='#0B6E78'>" + esc(l) + "</text>"; });
    if (L1.length) {
      var w1 = Math.min(w, 60 + Math.max.apply(null, L1.map(function (l) { return l.length; })) * 9.4), y1 = y + h0 + 8;
      s += "<rect x='" + f1(cx - w1 / 2) + "' y='" + f1(y1) + "' width='" + f1(w1) + "' height='" + h1 + "' rx='8' fill='#F3E8FB' stroke='#7B2CBF' stroke-width='2.5'/>";
      L1.forEach(function (l, k) { s += "<text x='" + f1(cx) + "' y='" + f1(y1 + 22 + k * 18) + "' text-anchor='middle' font-size='14.5' font-weight='800' fill='#5B1E91'>" + esc(l) + "</text>"; });
    }
    return { s: s + "</g>", h: h0 + (h1 ? h1 + 8 : 0) };
  }
  function ampoule(C, B, alt, Wd) {
    var s = "", dessus = "";
    if (Wd < 600) {
      var w = Wd - 60, y = 20, am = ampouleDessin(Wd / 2, y + 90, 0.9), tt = titresAmp(Wd / 2, y + 196, C, Wd - 80);
      s += am + tt.s; y += 196 + tt.h + 30;
      B.forEach(function (b, i) {
        var bl = blocAmp(40, y, w - 10, b, i + 1);
        s += "<path class='cm-l' d='M22 " + f1(y - 18) + " V" + f1(y + bl.h - 6) + "' stroke='" + b.color + "' stroke-width='3' stroke-dasharray='2 6' stroke-linecap='round'/>" + bl.s; y += bl.h + 22;
      });
      return svgDe("cm-etroit", Wd, y, alt, B, s);
    }
    var cx = Wd / 2, bw = 288, cotes = [[], []];
    B.forEach(function (b, i) { b.i = i; b.h = hBlocAmp(b, bw); cotes[i % 2].push(b); });
    var hauts = cotes.map(function (c) { return c.reduce(function (a, b) { return a + b.h + 28; }, 0) - 28; });
    var tt0 = titresAmp(cx, 0, C, 216), hc = 196 + tt0.h, H = Math.max(hauts[0], hauts[1], hc) + 60, by = (H - hc) / 2 + 100;
    s += ampouleDessin(cx, by, 1);
    cotes.forEach(function (liste0, cote) {
      var sg = cote ? 1 : -1, x = cote ? Wd - 24 - bw : 24, y = (H - hauts[cote]) / 2;
      liste0.forEach(function (b, k) {
        /* la flèche part du bord de l'ampoule et arrive à l'horizontale sur la pastille numérotée, sans traverser le texte */
        var bl = blocAmp(x, y, bw, b, b.i + 1), ty = y + 13;
        var sx = cx + sg * 66, sy = by - 6 + (k - (liste0.length - 1) / 2) * 30;
        /* virage dans l'espace libre entre le bloc et l'ampoule, puis droite le long de la rangée de la pastille (vide) */
        var gx = cote ? x - 14 : x + bw + 14, ex = cote ? x - 10 : x + 46 + 10, d = Math.abs(gx - sx) * 0.55;
        s += "<path class='cm-t' d='M" + f1(sx) + " " + f1(sy) + " C" + f1(sx + sg * d) + " " + f1(sy) + " " + f1(gx - sg * d) + " " + f1(ty) + " " + f1(gx) + " " + f1(ty) + " H" + f1(ex) + "' fill='none' stroke='" + b.color + "' stroke-width='9' stroke-linecap='round' opacity='.75' marker-end='url(#" + P + "f" + b.i + ")'/>";
        dessus += bl.s; y += b.h + 28;
      });
    });
    return svgDe("cm-large", Wd, H, alt, B, s + dessus + titresAmp(cx, by + 120, C, 216).s);
  }

  /* ════════ LIVRE (24/11/2026, « enrichis et varie », modèle de Jacques : un livre ouvert au centre portant le titre,
     des bandeaux en forme de nuage en capitales, des listes soulignées, des flèches qui convergent vers le livre,
     de petites icônes) ════════ */
  function livreDessin(cx, cy, w, C) {
    var h = w * 0.56, s = "<g transform='translate(" + f1(cx) + " " + f1(cy) + ")'><g class='cm-c'>", L = [];
    couper((C[0] || "").toUpperCase(), Math.max(10, Math.floor(w / 15))).forEach(function (l) { L.push(l); });
    s += "<path d='M" + f1(-w / 2 - 8) + " " + f1(-h / 2 + 10) + " L0 " + f1(-h / 2 + 22) + " L" + f1(w / 2 + 8) + " " + f1(-h / 2 + 10) + " V" + f1(h / 2 + 12) + " L0 " + f1(h / 2 + 24) + " L" + f1(-w / 2 - 8) + " " + f1(h / 2 + 12) + "Z' fill='#1D2B53'/>";
    for (var k = 3; k >= 0; k--) s += "<path d='M" + f1(-w / 2 + k * 2) + " " + f1(-h / 2 + k * 3) + " Q" + f1(-w / 4) + " " + f1(-h / 2 - 12 + k * 3) + " 0 " + f1(-h / 2 + 6 + k * 3) + " Q" + f1(w / 4) + " " + f1(-h / 2 - 12 + k * 3) + " " + f1(w / 2 - k * 2) + " " + f1(-h / 2 + k * 3) + " V" + f1(h / 2 + k * 2) + " Q" + f1(w / 4) + " " + f1(h / 2 - 10 + k * 2) + " 0 " + f1(h / 2 + 8 + k * 2) + " Q" + f1(-w / 4) + " " + f1(h / 2 - 10 + k * 2) + " " + f1(-w / 2 + k * 2) + " " + f1(h / 2 + k * 2) + "Z' fill='" + (k ? "#EFE3C8" : "#FBF4E2") + "' stroke='#B89B67' stroke-width='1.2'/>";
    s += "<path d='M0 " + f1(-h / 2 + 6) + " V" + f1(h / 2 + 8) + "' stroke='#B89B67' stroke-width='2'/>";
    var bh = 18 + L.length * 24, bw = Math.min(w - 30, 40 + Math.max.apply(null, L.map(function (l) { return l.length; })) * 13.5);
    s += "<rect x='" + f1(-bw / 2) + "' y='" + f1(-bh / 2) + "' width='" + f1(bw) + "' height='" + bh + "' rx='6' fill='#1D2B53'/>";
    L.forEach(function (l, k) { s += "<text x='0' y='" + f1(-bh / 2 + 30 + k * 24) + "' text-anchor='middle' font-size='20' font-weight='900' fill='#FFD43B' letter-spacing='.5'>" + esc(l) + "</text>"; });
    if (C[1]) s += "<rect x='-34' y='" + f1(h / 2 + 32) + "' width='68' height='24' rx='12' fill='#FFD43B' stroke='#1D2B53' stroke-width='2'/><text x='0' y='" + f1(h / 2 + 49) + "' text-anchor='middle' font-size='13' font-weight='800' fill='#1D2B53'>" + esc(C[1]) + "</text>";
    return s + "</g></g>";
  }
  /* bandeau en nuage : rectangle arrondi et bosses de la même couleur */
  function nuageTitre(cx, cy, w, t, col, NC) {
    var L = couper(String(t).toUpperCase(), NC), h = 20 + L.length * 19, s = "<g class='cm-h'>", i;
    for (i = 0; i < 5; i++) s += "<circle cx='" + f1(cx - w / 2 + 22 + i * (w - 44) / 4) + "' cy='" + f1(cy - h / 2 + 4 + (i % 2) * 3) + "' r='" + (14 + (i % 2) * 4) + "' fill='" + col + "'/>";
    s += "<circle cx='" + f1(cx - w / 2 + 6) + "' cy='" + f1(cy) + "' r='" + f1(h / 2) + "' fill='" + col + "'/><circle cx='" + f1(cx + w / 2 - 6) + "' cy='" + f1(cy) + "' r='" + f1(h / 2) + "' fill='" + col + "'/>";
    s += "<rect x='" + f1(cx - w / 2 + 4) + "' y='" + f1(cy - h / 2) + "' width='" + f1(w - 8) + "' height='" + h + "' rx='" + f1(h / 2) + "' fill='" + col + "'/>";
    L.forEach(function (l, k) { s += "<text x='" + f1(cx) + "' y='" + f1(cy - (L.length - 1) * 9.5 + 6 + k * 19) + "' text-anchor='middle' font-size='16.5' font-weight='900' fill='#fff' stroke='" + col + "' stroke-width='.6' letter-spacing='.4'>" + esc(l) + "</text>"; });
    return { s: s + "</g>", h: h + 12 };
  }
  /* petites icônes, une par branche, dans l'ordre : crayon, ampoule, loupe, document, cible, livre */
  function icone(x, y, k, col) {
    var s = "<g transform='translate(" + f1(x) + " " + f1(y) + ")' opacity='.95'>";
    if (k === 0) s += "<path d='M-12 10 L8 -10 L13 -5 L-7 15 L-14 17Z' fill='#F7C948' stroke='#5A3A1E' stroke-width='1.5'/><path d='M8 -10 L13 -5' stroke='" + col + "' stroke-width='4'/>";
    else if (k === 1) s += "<circle cx='0' cy='-4' r='10' fill='#FFE066' stroke='#C24E00' stroke-width='1.6'/><rect x='-5' y='6' width='10' height='7' rx='2' fill='#8A93A6'/><path d='M-16 -12l-5 -4M16 -12l5 -4M0 -19v-5' stroke='#F7C948' stroke-width='2.4' stroke-linecap='round'/>";
    else if (k === 2) s += "<circle cx='-3' cy='-3' r='9' fill='#E8F1FB' stroke='" + col + "' stroke-width='3'/><path d='M4 4 L13 13' stroke='#5A3A1E' stroke-width='4' stroke-linecap='round'/>";
    else if (k === 3) s += "<path d='M-10 -13 H5 L11 -7 V13 H-10Z' fill='#fff' stroke='#4D5163' stroke-width='1.6'/><path d='M-6 -5 H6 M-6 0 H6 M-6 5 H2' stroke='" + col + "' stroke-width='1.8'/>";
    else if (k === 4) s += "<circle r='12' fill='#fff' stroke='" + col + "' stroke-width='2.4'/><circle r='7' fill='none' stroke='" + col + "' stroke-width='2.4'/><circle r='2.5' fill='" + col + "'/>";
    else s += "<path d='M-14 -8 Q-7 -12 0 -8 Q7 -12 14 -8 V10 Q7 6 0 10 Q-7 6 -14 10Z' fill='#FBF4E2' stroke='" + col + "' stroke-width='1.8'/><path d='M0 -8 V10' stroke='" + col + "' stroke-width='1.4'/>";
    return s + "</g>";
  }
  function listeSoulignee(items, x, y, w, col) {
    var NC = Math.floor((w - 24) / 8.3), s = "", yy = y;
    items.forEach(function (it) {
      var L = couper(it, NC);
      s += "<circle class='cm-p' cx='" + f1(x + 5) + "' cy='" + f1(yy - 5) + "' r='3.6' fill='" + col + "'/>" + texte(x + 16, yy, L, { t: 15, c: encre("#1D2330"), g: 600 });
      yy += (L.length - 1) * LH2 + 9;
      s += "<path class='cm-l' d='M" + f1(x) + " " + f1(yy) + " H" + f1(x + w) + "' stroke='" + col + "' stroke-width='1.6' opacity='.55'/>";
      yy += 20;
    });
    return { s: s, h: yy - y };
  }
  function hLivre(b, w) { var NC = Math.floor((w - 24) / 8.3), n = couper(b.label, Math.floor(w / 12)).length; return 20 + n * 19 + 12 + 14 + b.items.reduce(function (a, it) { return a + (couper(it, NC).length - 1) * LH2 + 29; }, 0); }
  function brancheLivre(x, y, w, b, k) {
    var nt = nuageTitre(x + w / 2, y + (20 + couper(b.label, Math.floor(w / 12)).length * 19) / 2 + 6, w, b.label, b.color, Math.floor(w / 12));
    var li = listeSoulignee(b.items, x + 8, y + nt.h + 24, w - 16, b.color);
    return { s: nt.s + li.s + icone(x + w - 4, y + nt.h + 6 + li.h, k % 6, b.color), h: nt.h + li.h + 24 };
  }
  function livre(C, B, alt, Wd) {
    var s = "", dessus = "";
    if (Wd < 600) {
      var w = Wd - 40, y = 24;
      s += livreDessin(Wd / 2, y + 80, 300, C); y += 190;
      B.forEach(function (b, i) { var br = brancheLivre(20, y, w, b, i); s += br.s; y += br.h + 26; });
      return svgDe("cm-etroit", Wd, y, alt, B, s);
    }
    var bw = 262, n = B.length, bas = n % 2 === 1 && n > 2 ? B[n - 1] : null, cote = bas ? B.slice(0, n - 1) : B, cols = [[], []];
    cote.forEach(function (b, i) { b.i = i; b.h = hLivre(b, bw); cols[i % 2].push(b); });
    var hs = cols.map(function (c) { return c.reduce(function (a, b) { return a + b.h + 30; }, 0) - 30; }), Hc = Math.max(hs[0], hs[1], 260), cx = Wd / 2, cy = 30 + Hc / 2;
    var bwBas = 420, hBas = bas ? hLivre(bas, bwBas) : 0, H = 30 + Hc + (bas ? 60 + hBas : 0) + 30;
    var livreS = livreDessin(cx, cy, 232, C);
    cols.forEach(function (c, ct) {
      var x = ct ? Wd - 20 - bw : 20, y = 30 + (Hc - hs[ct]) / 2;
      c.forEach(function (b) {
        var br = brancheLivre(x, y, bw, b, b.i), ny = y + 22, sx = ct ? x - 6 : x + bw + 6, ex = cx + (ct ? 132 : -132), ey = cy + (ny - cy) * 0.3;
        s += "<path class='cm-t' d='M" + f1(sx) + " " + f1(ny) + " C" + f1(sx + (ct ? -50 : 50)) + " " + f1(ny) + " " + f1(ex + (ct ? 40 : -40)) + " " + f1(ey) + " " + f1(ex) + " " + f1(ey) + "' fill='none' stroke='" + b.color + "' stroke-width='10' stroke-linecap='round' opacity='.85' marker-end='url(#" + P + "f" + b.i + ")'/>";
        dessus += br.s; y += b.h + 30;
      });
    });
    if (bas) {
      bas.i = n - 1; var yb = 30 + Hc + 60, xb = cx - bwBas / 2, brb = brancheLivre(xb, yb, bwBas, bas, n - 1);
      s += "<path class='cm-t' d='M" + f1(cx) + " " + f1(yb - 8) + " V" + f1(cy + 232 * 0.28 + 66) + "' stroke='" + bas.color + "' stroke-width='10' stroke-linecap='round' opacity='.85' marker-end='url(#" + P + "f" + (n - 1) + ")'/>";
      dessus += brb.s;
    }
    return svgDe("cm-large", Wd, H, alt, B, s + livreS + dessus);
  }

  /* ════════ ESCALIER, FLEUR, TABLEAU DE LIÈGE (24/11/2026, « la diversité continue en variant le plus possible
     les types et formes de cartes mentales ») ════════ */
  /* escalier : les branches descendent marche après marche, chacune posée sur sa contremarche colorée */
  function escalier(C, B, alt, Wd) {
    var pc = placerCentre(Wd / 2, C, largeurC(C, 240, Wd < 600 ? 340 : 560)), y = pc.y + pc.c.b + 30, s = "", dessus = "", n = B.length;
    var w = Wd < 600 ? Wd - 64 : 340, dx = Wd < 600 ? 14 : (n > 1 ? (Wd - 40 - w) / (n - 1) : 0);
    B.forEach(function (b, i) {
      var x = Wd < 600 ? 20 + (i % 2) * dx : 20 + i * dx, h = hBoite(b, w), bx = boite(x, y, w, b, i + 1, false, h);
      s += "<rect x='" + f1(x - 6) + "' y='" + f1(y + h + 6) + "' width='" + f1(w + 12) + "' height='10' rx='3' fill='" + b.color + "' opacity='.85'/>";
      if (i < n - 1) { var nx = Wd < 600 ? 20 + ((i + 1) % 2) * dx : 20 + (i + 1) * dx; s += "<path class='cm-l' d='M" + f1(x + w + 6) + " " + f1(y + h + 16) + " V" + f1(y + h + 34) + " H" + f1(Math.max(nx + w + 6, x + w + 6)) + "' fill='none' stroke='#C9D0DC' stroke-width='3' stroke-linejoin='round'/>"; }
      dessus += bx.s; y += h + 40;
    });
    return svgDe(Wd < 600 ? "cm-etroit" : "cm-large", Wd, y, alt, B, s + dessus + pc.s);
  }
  /* fleur : un pétale numéroté par branche autour du cœur, une tige courbe du pétale à la branche */
  function fleurDessin(cx, cy, B, angles) {
    var s = "<g transform='translate(" + f1(cx) + " " + f1(cy) + ")'><g class='cm-c'>";
    B.forEach(function (b, i) {
      var a = angles[i] * 180 / Math.PI;
      s += "<g transform='rotate(" + f1(a) + ")'><ellipse cx='52' cy='0' rx='40' ry='20' fill='" + clair(b.color, .55) + "' stroke='" + b.color + "' stroke-width='2.5'/></g>";
      s += "<text x='" + f1(56 * Math.cos(angles[i])) + "' y='" + f1(56 * Math.sin(angles[i]) + 5) + "' text-anchor='middle' font-size='15' font-weight='900' fill='" + b.color + "'>" + (i + 1) + "</text>";
    });
    return s + "<circle r='26' fill='#FFD43B' stroke='#C24E00' stroke-width='3'/><circle r='9' fill='#C24E00' opacity='.35'/></g></g>";
  }
  function fleur(C, B, alt, Wd) {
    var s = "", dessus = "", n = B.length;
    if (Wd < 600) {
      var ang0 = B.map(function (b, i) { return -Math.PI / 2 + i * 2 * Math.PI / n; }), y0 = 110;
      var tt = titresAmp(Wd / 2, y0 + 100, C, Wd - 80);
      s += "<path d='M" + f1(Wd / 2) + " " + f1(y0 + 26) + " V" + f1(y0 + 100) + "' stroke='#5E8C31' stroke-width='5'/>" + fleurDessin(Wd / 2, y0, B, ang0) + tt.s;
      var y = y0 + 100 + tt.h + 30, w = Wd - 40;
      B.forEach(function (b, i) { var h = hBoite(b, w), bx = boite(20, y, w, b, i + 1, false, h); dessus += bx.s; y += h + 22; });
      return svgDe("cm-etroit", Wd, y, alt, B, s + dessus);
    }
    var bw = 280, cotes = [[], []];
    B.forEach(function (b, i) { b.i = i; b.h = hBoite(b, bw); cotes[i % 2].push(b); });
    var hauts = cotes.map(function (c) { return c.reduce(function (a, b) { return a + b.h + 26; }, 0) - 26; }), tt0 = titresAmp(0, 0, C, 216);
    var H = Math.max(hauts[0], hauts[1], 250 + tt0.h) + 50, cx = Wd / 2, cy = (H - tt0.h - 120) / 2 + 10, pos = [], angles = [];
    cotes.forEach(function (liste0, ct) {
      var x = ct ? Wd - 20 - bw : 20, y = (H - hauts[ct]) / 2;
      liste0.forEach(function (b, k) { var ex = ct ? x - 8 : x + bw + 8, ey = y + 26, m = liste0.length, a = m > 1 ? -1 + k * 2 / (m - 1) : 0; pos[b.i] = { x: x, y: y, ex: ex, ey: ey }; angles[b.i] = ct ? a : Math.PI - a; y += b.h + 26; });
    });
    B.forEach(function (b, i) {
      var p = pos[i], px = cx + 96 * Math.cos(angles[i]), py = cy + 96 * Math.sin(angles[i]), sg = p.ex > cx ? 1 : -1, d = Math.abs(p.ex - px) * .5;
      s += "<path class='cm-t' d='M" + f1(px) + " " + f1(py) + " C" + f1(px + sg * d) + " " + f1(py) + " " + f1(p.ex - sg * d) + " " + f1(p.ey) + " " + f1(p.ex) + " " + f1(p.ey) + "' fill='none' stroke='#5E8C31' stroke-width='4' stroke-linecap='round' marker-end='url(#" + P + "f" + i + ")'/>";
      dessus += boite(p.x, p.y, bw, b, i + 1, false, b.h).s;
    });
    return svgDe("cm-large", Wd, H, alt, B, s + "<path d='M" + f1(cx) + " " + f1(cy + 26) + " V" + f1(cy + 112) + "' stroke='#5E8C31' stroke-width='6' stroke-linecap='round'/>" + fleurDessin(cx, cy, B, angles) + dessus + titresAmp(cx, cy + 112, C, 216).s);
  }
  /* tableau de liège : la fiche-titre et les notes punaisées, légèrement de travers */
  function hNote(b, w) { var NC = Math.floor((w - 40) / 8.2); return 50 + couper(b.label, Math.floor((w - 50) / 9.4)).length * 19 + hListe(b.items, NC) + 20; }
  function note(x, y, w, h, b, n) {
    var NC = Math.floor((w - 40) / 8.2), Lt = couper(b.label, Math.floor((w - 50) / 9.4)), r = (n % 3) - 1, s = "<g class='cm-h' transform='rotate(" + (r * 1.4) + " " + f1(x + w / 2) + " " + f1(y + h / 2) + ")'>";
    s += "<rect x='" + f1(x + 4) + "' y='" + f1(y + 6) + "' width='" + w + "' height='" + h + "' fill='#000' opacity='.18'/><rect x='" + f1(x) + "' y='" + f1(y) + "' width='" + w + "' height='" + h + "' fill='" + clair(b.color, .8) + "'/>";
    s += "<circle cx='" + f1(x + w / 2) + "' cy='" + f1(y + 10) + "' r='7' fill='" + b.color + "' stroke='#fff' stroke-width='2'/>";
    s += "<text x='" + f1(x + 16) + "' y='" + f1(y + 40) + "' font-size='15' font-weight='900' fill='" + b.color + "'>" + n + ".</text>";
    Lt.forEach(function (l, k) { s += "<text x='" + f1(x + 36) + "' y='" + f1(y + 40 + k * 19) + "' font-size='16' font-weight='800' fill='#1D2330'>" + esc(l) + "</text>"; });
    return s + liste(b.items, x + 14, y + 40 + Lt.length * 19 + 16, NC, b.color) + "</g>";
  }
  function liege(C, B, alt, Wd) {
    var cols = Wd < 600 ? 1 : 3, g = 26, w = (Wd - 60 - (cols - 1) * g) / cols, s = "", y, L = [];
    C.forEach(function (l, k) { couper(l, k ? 34 : 30).forEach(function (x) { L.push([x, k]); }); });
    var tw = Math.min(Wd - 80, 60 + Math.max.apply(null, L.map(function (x) { return x[0].length * (x[1] ? 8 : 11); }))), th = 26 + L.length * 22;
    var titre = "<g class='cm-c'><rect x='" + f1(Wd / 2 - tw / 2 + 4) + "' y='34' width='" + f1(tw) + "' height='" + th + "' fill='#000' opacity='.2'/><rect x='" + f1(Wd / 2 - tw / 2) + "' y='30' width='" + f1(tw) + "' height='" + th + "' fill='#fff'/><rect x='" + f1(Wd / 2 - tw / 2) + "' y='30' width='" + f1(tw) + "' height='6' fill='#C62828'/><circle cx='" + f1(Wd / 2) + "' cy='33' r='8' fill='#C62828' stroke='#fff' stroke-width='2'/>";
    L.forEach(function (x, k) { titre += "<text x='" + f1(Wd / 2) + "' y='" + f1(30 + 30 + k * 22) + "' text-anchor='middle' font-size='" + (x[1] ? 14 : 19) + "' font-weight='" + (x[1] ? 700 : 900) + "' fill='" + (x[1] ? "#8A5A2D" : "#142554") + "'>" + esc(x[0]) + "</text>"; });
    titre += "</g>"; y = 30 + th + 40;
    for (var r0 = 0; r0 < B.length; r0 += cols) {
      var rang = B.slice(r0, r0 + cols), hr = Math.max.apply(null, rang.map(function (b) { return hNote(b, w); })), dec = (cols - rang.length) * (w + g) / 2;
      rang.forEach(function (b, k) { s += note(30 + dec + k * (w + g), y, w, hr, b, r0 + k + 1); });
      y += hr + 34;
    }
    var H = y + 6, fondL = "<rect x='4' y='4' width='" + (Wd - 8) + "' height='" + f1(H - 8) + "' rx='12' fill='#C79A62' stroke='#7A5230' stroke-width='8'/>";
    for (var k = 0; k < 160; k++) { var px = 14 + (k * 97) % (Wd - 28), py = 14 + (k * 53) % Math.max(20, H - 28); fondL += "<circle cx='" + px + "' cy='" + f1(py) + "' r='" + (1 + k % 3) + "' fill='#A97B45' opacity='.5'/>"; }
    return svgDe(Wd < 600 ? "cm-etroit" : "cm-large", Wd, H, alt, B, fondL + titre + s);
  }

  /* ════════ HUIT MODÈLES DE JACQUES (24/11/2026, « varie davantage ») : arbre infographique, tige, frise verticale,
     route sinueuse, pilule à fourches, doodle, formes libres (blobs), arc de cercle ════════ */
  function hTxt(b, w) { var NC = Math.floor((w - 20) / 8.2); return couper(b.label, Math.floor(w / 9.6)).length * 20 + 10 + hListe(b.items, NC); }
  function blanc(s) { return s.replace(/fill='(#2E3445|#3B4456|#F3EFE4|#2B2B2B)'/g, "fill='#fff'"); }
  function fonce(hex, k) { var n = parseInt(hex.slice(1), 16); return "rgb(" + [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (v) { return Math.round(v * (1 - k)); }).join(",") + ")"; }
  function n2(i) { return (i < 9 ? "0" : "") + (i + 1); }
  /* carte à cadre épais coloré, bandeau titre numéroté (modèle « timeline tige ») */
  function hCarte(b, w) { return 16 + couper(b.label, Math.floor((w - 70) / 9.4)).length * 19 + 20 + hListe(b.items, Math.floor((w - 50) / 8.2)) + 24; }
  function carteCadre(x, y, w, b, n, col) {
    col = col || b.color; var Lt = couper(b.label, Math.floor((w - 70) / 9.4)), hb = 16 + Lt.length * 19, h = hCarte(b, w), s = "<g class='cm-h'>";
    s += "<rect x='" + f1(x + 3) + "' y='" + f1(y + 5) + "' width='" + f1(w) + "' height='" + f1(h) + "' rx='14' fill='#0B1A33' opacity='.10'/>";
    s += "<rect x='" + f1(x) + "' y='" + f1(y) + "' width='" + f1(w) + "' height='" + f1(h) + "' rx='14' fill='" + col + "'/>";
    s += "<rect x='" + f1(x + 7) + "' y='" + f1(y + hb) + "' width='" + f1(w - 14) + "' height='" + f1(h - hb - 7) + "' rx='9' fill='#fff'/>";
    s += "<rect x='" + f1(x + 10) + "' y='" + f1(y + 7) + "' width='40' height='" + f1(hb - 12) + "' rx='5' fill='" + fonce(col, .28) + "'/><text x='" + f1(x + 30) + "' y='" + f1(y + 7 + (hb - 12) / 2 + 5) + "' text-anchor='middle' font-size='14' font-weight='900' fill='#fff'>" + n + "</text>";
    Lt.forEach(function (l, k) { s += "<text x='" + f1(x + 60) + "' y='" + f1(y + 22 + k * 19) + "' font-size='15.5' font-weight='800' fill='#fff'>" + esc(l) + "</text>"; });
    return { s: s + "</g>" + liste(b.items, x + 20, y + hb + 24, Math.floor((w - 50) / 8.2), col), h: h };
  }
  function blocTxt(x, y, w, b, n, o) {
    o = o || {}; var NC = Math.floor((w - 20) / 8.2), Lt = couper(b.label, Math.floor(w / 9.6)), s = "<g class='cm-h'>", col = o.col || b.color;
    Lt.forEach(function (l, k) { s += "<text x='" + f1(x) + "' y='" + f1(y + 16 + k * 20) + "' font-size='16.5' font-weight='800' fill='" + col + "'>" + (k || !n ? "" : n + ". ") + esc(l) + "</text>"; });
    if (o.vague) { var yy = y + 22 + (Lt.length - 1) * 20, d = "M" + f1(x) + " " + f1(yy); for (var k = 1; k <= 8; k++) d += " q" + 6 + " " + (k % 2 ? -4 : 4) + " 12 0"; s += "<path d='" + d + "' fill='none' stroke='" + col + "' stroke-width='2.2'/>"; }
    return { s: s + "</g>" + liste(b.items, x, y + 16 + Lt.length * 20 + 14, NC, o.puce || b.color), h: hTxt(b, w) };
  }
  /* disposition alternée le long d'un axe vertical : renvoie les positions et la hauteur totale */
  function alterne(B, Wd, y0, cw, gap) {
    var etroit = Wd < 600, pos = [], cols = [y0, y0], yPrev = y0 - 60;
    B.forEach(function (b, i) {
      var cote = etroit ? 1 : i % 2, h = b.hh, y = etroit ? Math.max(cols[1], yPrev + 10) : Math.max(cols[cote], yPrev + 56);
      pos.push({ cote: cote, y: y, h: h }); cols[cote] = y + h + gap; if (etroit) cols[1] = y + h + gap; yPrev = y;
    });
    return { pos: pos, H: Math.max(cols[0], cols[1]) };
  }
  function tige(C, B, alt, Wd) {
    var et = Wd < 600, ax = et ? 30 : Wd / 2, cw = et ? Wd - 76 : Wd / 2 - 70, tt = titresAmp(Wd / 2, 18, C, et ? Wd - 60 : 300), s = "", dessus = "", V = "#4CAF50";
    B.forEach(function (b) { b.hh = hCarte(b, cw); });
    var A = alterne(B, Wd, 18 + tt.h + 40, cw, 26), H = A.H + 40, top = 18 + tt.h + 14;
    s += "<path d='M" + f1(ax) + " " + f1(H - 14) + " C" + f1(ax - 8) + " " + f1(H * .7) + " " + f1(ax + 8) + " " + f1(H * .4) + " " + f1(ax) + " " + f1(top) + "' fill='none' stroke='" + V + "' stroke-width='9' stroke-linecap='round'/>";
    s += "<ellipse cx='" + f1(ax) + "' cy='" + f1(H - 10) + "' rx='60' ry='6' fill='#000' opacity='.08'/>";
    A.pos.forEach(function (p, i) {
      var b = B[i], x = p.cote ? ax + 40 : ax - 40 - cw, cy = p.y + 22, sg = p.cote ? 1 : -1, ly = p.y + p.h + 8;
      s += "<path d='M" + f1(ax) + " " + f1(cy + 30) + " Q" + f1(ax + sg * 20) + " " + f1(cy + 26) + " " + f1(ax + sg * 40) + " " + f1(cy) + "' fill='none' stroke='" + V + "' stroke-width='6' stroke-linecap='round'/>";
      if (!et) s += "<path d='M" + f1(ax) + " " + f1(ly) + " q" + f1(-sg * 14) + " -18 " + f1(-sg * 40) + " -10 q" + f1(sg * 10) + " 18 " + f1(sg * 40) + " 10Z' fill='#7CC456' stroke='#3E8E2E' stroke-width='1.5'/>";
      dessus += carteCadre(x, p.y, cw, b, n2(i), b.color).s;
    });
    return svgDe(et ? "cm-etroit" : "cm-large", Wd, H, alt, B, tt.s + s + dessus);
  }
  function frisev(C, B, alt, Wd) {
    var et = Wd < 600, ax = et ? 30 : Wd / 2, cw = et ? Wd - 80 : Wd / 2 - 80, tt = titresAmp(Wd / 2, 18, C, et ? Wd - 60 : 300), s = "", dessus = "";
    function hB(b) { return 14 + couper(b.label, Math.floor((cw - 70) / 9.2)).length * 19 + 16 + hListe(b.items, Math.floor((cw - 44) / 8.2)) + 20; }
    B.forEach(function (b) { b.hh = hB(b); });
    var A = alterne(B, Wd, 18 + tt.h + 40, cw, 28), H = A.H + 30, top = 18 + tt.h + 14;
    s += "<path d='M" + f1(ax) + " " + f1(top) + " V" + f1(H - 14) + "' stroke='#1D2330' stroke-width='2' stroke-dasharray='5 6'/>";
    for (var yy = top + 20; yy < H - 20; yy += 46) s += "<circle cx='" + f1(ax) + "' cy='" + f1(yy) + "' r='3.6' fill='#1D2330'/>";
    A.pos.forEach(function (p, i) {
      var b = B[i], x = p.cote ? ax + 44 : ax - 44 - cw, Lt = couper(b.label, Math.floor((cw - 70) / 9.2)), hb = 14 + Lt.length * 19, cy = p.y + hb / 2, h = b.hh;
      s += "<path d='M" + f1(ax) + " " + f1(cy) + " H" + f1(p.cote ? x : x + cw) + "' stroke='" + b.color + "' stroke-width='2' stroke-dasharray='5 4'/>";
      dessus += "<g class='cm-h'><rect x='" + f1(x + 3) + "' y='" + f1(p.y + 4) + "' width='" + f1(cw) + "' height='" + f1(h) + "' fill='#0B1A33' opacity='.08'/><rect x='" + f1(x) + "' y='" + f1(p.y) + "' width='" + f1(cw) + "' height='" + f1(h) + "' fill='#fff' stroke='#E1E6EE'/>";
      dessus += "<rect x='" + f1(x) + "' y='" + f1(p.y) + "' width='" + f1(cw) + "' height='" + f1(hb) + "' fill='" + b.color + "'/><rect x='" + f1(x) + "' y='" + f1(p.y) + "' width='44' height='" + f1(hb) + "' fill='" + fonce(b.color, .22) + "'/><text x='" + f1(x + 22) + "' y='" + f1(p.y + hb / 2 + 5) + "' text-anchor='middle' font-size='14' font-weight='900' fill='#fff'>" + n2(i) + "</text>";
      Lt.forEach(function (l, k) { dessus += "<text x='" + f1(x + 56) + "' y='" + f1(p.y + 21 + k * 19) + "' font-size='15' font-weight='800' fill='#fff' letter-spacing='.3'>" + esc(l.toUpperCase()) + "</text>"; });
      dessus += "</g>" + liste(b.items, x + 16, p.y + hb + 22, Math.floor((cw - 44) / 8.2), b.color);
      dessus += "<path d='" + hexa(ax, cy, 15) + "' fill='" + b.color + "' stroke='#fff' stroke-width='3'/><circle cx='" + f1(ax) + "' cy='" + f1(cy) + "' r='4.5' fill='#fff'/>";
    });
    return svgDe(et ? "cm-etroit" : "cm-large", Wd, H, alt, B, tt.s + s + dessus);
  }
  function arbreInfo(C, B, alt, Wd) {
    var et = Wd < 600, ax = et ? 34 : Wd / 2, cw = et ? Wd - 84 : Wd / 2 - 74, tt = titresAmp(Wd / 2, 18, C, et ? Wd - 60 : 300), s = "", dessus = "", bois = "#6D4424";
    var VERTS = ["#1B5E20", "#2E7D32", "#388E3C", "#00695C", "#33691E", "#00796B", "#2E7D32"];
    function hL(b) { return 18 + couper(b.label, Math.floor((cw - 80) / 9.4)).length * 19 + 8 + hListe(b.items, Math.floor((cw - 80) / 8.2)) + 22; }
    B.forEach(function (b) { b.hh = hL(b); });
    var A = alterne(B, Wd, 18 + tt.h + 40, cw, 24), H = A.H + 70, top = 18 + tt.h + 24;
    s += "<path d='M" + f1(ax - 18) + " " + f1(H - 34) + " C" + f1(ax - 8) + " " + f1(H * .6) + " " + f1(ax - 5) + " " + f1(top + 60) + " " + f1(ax - 2) + " " + f1(top) + " H" + f1(ax + 2) + " C" + f1(ax + 5) + " " + f1(top + 60) + " " + f1(ax + 8) + " " + f1(H * .6) + " " + f1(ax + 18) + " " + f1(H - 34) + "Z' fill='" + bois + "'/>";
    s += "<path d='M" + f1(ax - 120) + " " + f1(H - 32) + " H" + f1(ax + 120) + "' stroke='" + bois + "' stroke-width='3' stroke-linecap='round'/>";
    A.pos.forEach(function (p, i) {
      var b = B[i], sg = p.cote ? 1 : -1, x = p.cote ? ax + 44 : ax - 44 - cw, h = p.h, v = VERTS[i % VERTS.length], cy = p.y + h / 2, xi = p.cote ? x : x + cw, xo = p.cote ? x + cw : x;
      s += "<path d='M" + f1(ax) + " " + f1(cy + 40) + " Q" + f1(ax + sg * 10) + " " + f1(cy + 6) + " " + f1(xi) + " " + f1(cy) + "' stroke='" + bois + "' stroke-width='6' fill='none' stroke-linecap='round'/>";
      var d = "M" + f1(xi) + " " + f1(p.y + 12) + " Q" + f1(xi) + " " + f1(p.y) + " " + f1(xi + sg * 12) + " " + f1(p.y) + " H" + f1(xo) + " C" + f1(xo) + " " + f1(p.y + h * .75) + " " + f1(xo - sg * 24) + " " + f1(p.y + h) + " " + f1(xo - sg * 70) + " " + f1(p.y + h) + " H" + f1(xi + sg * 12) + " Q" + f1(xi) + " " + f1(p.y + h) + " " + f1(xi) + " " + f1(p.y + h - 12) + "Z";
      var tx = p.cote ? x + 50 : x + 18;
      dessus += "<g class='cm-h'><path d='" + d + "' fill='" + v + "'/><path d='M" + f1(xo - sg * 70) + " " + f1(p.y + h - 4) + " Q" + f1(xo - sg * 10) + " " + f1(p.y + h * .5) + " " + f1(xo - sg * 4) + " " + f1(p.y + 6) + "' fill='none' stroke='#fff' stroke-opacity='.35' stroke-width='2'/>";
      dessus += "<circle cx='" + f1(xi) + "' cy='" + f1(cy) + "' r='22' fill='#fff' stroke='" + v + "' stroke-width='4'/><text x='" + f1(xi) + "' y='" + f1(cy + 6) + "' text-anchor='middle' font-size='16' font-weight='900' fill='" + v + "'>" + n2(i) + "</text></g>";
      dessus += blanc(blocTxt(tx, p.y + 6, cw - 80, b, 0, { col: "#fff", puce: "#C8F0B0" }).s);
    });
    return svgDe(et ? "cm-etroit" : "cm-large", Wd, H, alt, B, tt.s + s + dessus);
  }
  function route(C, B, alt, Wd) {
    var n = B.length, s = "", dessus = "", tt = titresAmp(Wd / 2, 18, C, Wd < 600 ? Wd - 60 : 360);
    if (Wd < 600) {
      var y = 18 + tt.h + 40, w = Wd - 110, pts = [];
      B.forEach(function (b) { var h = hTxt(b, w); pts.push({ y: y, h: h }); y += Math.max(h, 50) + 30; });
      var d = "M40 " + f1(18 + tt.h + 20); pts.forEach(function (p, i) { d += " Q" + (i % 2 ? 10 : 70) + " " + f1(p.y - 10) + " 40 " + f1(p.y + 18); });
      d += " V" + f1(y - 10);
      s += "<path d='" + d + "' fill='none' stroke='#5A6378' stroke-width='22' stroke-linecap='round'/><path d='" + d + "' fill='none' stroke='#fff' stroke-width='2.5' stroke-dasharray='10 9'/>";
      pts.forEach(function (p, i) { var b = B[i]; dessus += epingle(40, p.y + 18, b.color, i + 1) + blocTxt(84, p.y, w, b, 0).s; });
      return svgDe("cm-etroit", Wd, y, alt, B, tt.s + s + dessus);
    }
    var step = n > 1 ? (Wd - 160) / (n - 1) : 0, cw = Math.min(250, step * 1.75), hs = B.map(function (b) { return hTxt(b, cw); });
    var hHaut = Math.max.apply(null, hs.filter(function (h, i) { return i % 2 === 0; }).concat([40])), hBas = Math.max.apply(null, hs.filter(function (h, i) { return i % 2 === 1; }).concat([40]));
    var ry = 18 + tt.h + 40 + hHaut + 70, H = ry + 70 + hBas + 30, P2 = B.map(function (b, i) { return [80 + i * step, ry + (i % 2 ? 28 : -28)]; });
    var d = "M20 " + f1(ry); P2.forEach(function (p, i) { var q = i ? P2[i - 1] : [20, ry]; d += " C" + f1(q[0] + step * .45) + " " + f1(q[1]) + " " + f1(p[0] - step * .45) + " " + f1(p[1]) + " " + f1(p[0]) + " " + f1(p[1]); });
    d += " C" + f1(P2[n - 1][0] + 40) + " " + f1(P2[n - 1][1]) + " " + (Wd - 60) + " " + f1(ry) + " " + (Wd - 20) + " " + f1(ry);
    s += "<path d='" + d + "' fill='none' stroke='#5A6378' stroke-width='30' stroke-linecap='round'/><path d='" + d + "' fill='none' stroke='#fff' stroke-width='3' stroke-dasharray='12 10'/>";
    P2.forEach(function (p, i) {
      var b = B[i], haut = i % 2 === 0, x = Math.max(16, Math.min(Wd - 16 - cw, p[0] - cw / 2)), y = haut ? p[1] - 60 - hs[i] : p[1] + 46;
      s += "<path d='M" + f1(p[0]) + " " + f1(haut ? p[1] - 40 : p[1] + 26) + " V" + f1(haut ? y + hs[i] + 6 : y - 6) + "' stroke='" + b.color + "' stroke-width='2.5' stroke-dasharray='3 4'/>";
      dessus += epingle(p[0], p[1], b.color, i + 1) + blocTxt(x, y, cw, b, 0).s;
    });
    return svgDe("cm-large", Wd, H, alt, B, tt.s + s + dessus);
  }
  function epingle(x, y, col, n) { return "<g class='cm-h'><path d='M" + f1(x) + " " + f1(y) + " C" + f1(x - 4) + " " + f1(y - 10) + " " + f1(x - 18) + " " + f1(y - 18) + " " + f1(x - 18) + " " + f1(y - 32) + " A18 18 0 1 1 " + f1(x + 18) + " " + f1(y - 32) + " C" + f1(x + 18) + " " + f1(y - 18) + " " + f1(x + 4) + " " + f1(y - 10) + " " + f1(x) + " " + f1(y) + "Z' fill='" + col + "' stroke='#fff' stroke-width='2.5'/><text x='" + f1(x) + "' y='" + f1(y - 27) + "' text-anchor='middle' font-size='15' font-weight='900' fill='#fff'>" + n + "</text></g>"; }
  function fourche(C, B, alt, Wd) {
    var et = Wd < 600, s = "", dessus = "", L = [];
    C.forEach(function (l, k) { couper(l, k ? 22 : 18).forEach(function (x) { L.push([x, k]); }); });
    var pw = Math.min(et ? Wd - 60 : 240, 50 + Math.max.apply(null, L.map(function (x) { return x[0].length * (x[1] ? 8 : 10.6); }))), ph = 26 + L.length * 21;
    function pilule(cx, cy) { var p = "<g class='cm-c'><rect x='" + f1(cx - pw / 2) + "' y='" + f1(cy - ph / 2) + "' width='" + f1(pw) + "' height='" + f1(ph) + "' rx='" + f1(ph / 2) + "' fill='#1D2B53'/>"; L.forEach(function (x, k) { p += "<text x='" + f1(cx) + "' y='" + f1(cy - ph / 2 + 30 + k * 21) + "' text-anchor='middle' font-size='" + (x[1] ? 13.5 : 18) + "' font-weight='" + (x[1] ? 700 : 900) + "' fill='" + (x[1] ? "#9FC5E8" : "#fff") + "'>" + esc(x[0]) + "</text>"; }); return p + "</g>"; }
    function hF(b, w) { var NC = Math.floor(w / 8.4); return Math.max(54, couper(b.label.toUpperCase(), Math.floor(w / 9)).length * 18 + 8 + b.items.reduce(function (a, it) { return a + couper(it, NC).length * 18 + 10; }, 0)) + 26; }
    function branche(dx, dy, x0, y0, b, sg, w) {
      var NC = Math.floor(w / 8.4), hh = hF(b, w) - 26, r = "", Ll = couper(b.label.toUpperCase(), Math.floor(w / 9)), yt = dy - hh / 2, yi = yt + Ll.length * 18 + 8, tx = dx + sg * 40, an = sg > 0 ? "start" : "end";
      r += "<path class='cm-t' d='M" + f1(x0) + " " + f1(y0) + " C" + f1(x0 + sg * 50) + " " + f1(y0) + " " + f1(dx - sg * 50) + " " + f1(dy) + " " + f1(dx) + " " + f1(dy) + "' fill='none' stroke='" + b.color + "' stroke-width='5' stroke-linecap='round'/>";
      Ll.forEach(function (l, k) { r += "<text x='" + f1(tx) + "' y='" + f1(yt + 13 + k * 18) + "' text-anchor='" + an + "' font-size='14' font-weight='900' letter-spacing='.4' fill='" + b.color + "'>" + esc(l) + "</text>"; });
      b.items.forEach(function (it) { var Li = couper(it, NC), ty = yi + Li.length * 9 - 4; r += "<path class='cm-l' d='M" + f1(dx) + " " + f1(dy) + " C" + f1(dx + sg * 18) + " " + f1(dy) + " " + f1(dx + sg * 14) + " " + f1(ty) + " " + f1(dx + sg * 32) + " " + f1(ty) + "' fill='none' stroke='" + b.color + "' stroke-width='2.2'/>"; r += texte(tx, yi + 13, Li, { t: 14.5, a: an, c: "#2E3445" }); yi += Li.length * 18 + 10; });
      return r + "<circle cx='" + f1(dx) + "' cy='" + f1(dy) + "' r='9' fill='" + b.color + "' stroke='#fff' stroke-width='2.5'/>";
    }
    if (et) {
      var y = 30 + ph + 30, w = Wd - 110;
      s += pilule(Wd / 2, 30 + ph / 2);
      var y0 = y; B.forEach(function (b) { var h = hF(b, w); s += branche(44, y + h / 2, 20, y + h / 2 - 20, b, 1, w); b.yl = y + h / 2 - 20; y += h + 16; });
      s = "<path d='M" + f1(Wd / 2) + " " + f1(30 + ph) + " V" + f1(y0 - 14) + " H20 V" + f1(B[B.length - 1].yl) + "' fill='none' stroke='#1D2B53' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/>" + s;
      return svgDe("cm-etroit", Wd, y, alt, B, s);
    }
    var cw = 210, cols = [[], []]; B.forEach(function (b, i) { b.i = i; b.hf = hF(b, cw); cols[i % 2].push(b); });
    var hs = cols.map(function (c) { return c.reduce(function (a, b) { return a + b.hf + 18; }, 0); }), H = Math.max(hs[0], hs[1], ph + 60) + 30, cy = H / 2;
    cols.forEach(function (c, ct) { var y = (H - hs[ct]) / 2 + 9, sg = ct ? 1 : -1, dx = ct ? Wd - 24 - cw - 40 : 24 + cw + 40; c.forEach(function (b) { s += branche(dx, y + b.hf / 2, Wd / 2 + sg * pw / 2, cy + (y + b.hf / 2 - cy) * .2, b, sg, cw); y += b.hf + 18; }); });
    return svgDe("cm-large", Wd, H, alt, B, s + pilule(Wd / 2, cy));
  }
  function mainLevee(x1, y1, x2, y2, k) { var mx = (x1 + x2) / 2 + (k % 2 ? 30 : -30), my = (y1 + y2) / 2 + (k % 2 ? -20 : 20); return "M" + f1(x1) + " " + f1(y1) + " Q" + f1(mx) + " " + f1(my) + " " + f1(x2) + " " + f1(y2); }
  function etoileBD(cx, cy, rx, ry) { var d = ""; for (var i = 0; i < 28; i++) { var a = i / 28 * 2 * Math.PI, k = i % 2 ? .78 : 1.08; d += (i ? "L" : "M") + f1(cx + rx * k * Math.cos(a)) + " " + f1(cy + ry * k * Math.sin(a)); } return d + "Z"; }
  function bouclee(x1, y1, x2, y2, sg) { var mx = (x1 + x2) / 2, my = (y1 + y2) / 2; return "M" + f1(x1) + " " + f1(y1) + " C" + f1(mx + sg * 10) + " " + f1(y1) + " " + f1(mx + sg * 34) + " " + f1(my - 30) + " " + f1(mx) + " " + f1(my - 18) + " C" + f1(mx - sg * 22) + " " + f1(my - 8) + " " + f1(mx - sg * 6) + " " + f1(my + 22) + " " + f1(mx + sg * 14) + " " + f1(my + 8) + " S" + f1(x2 - sg * 20) + " " + f1(y2) + " " + f1(x2) + " " + f1(y2); }
  function doodle(C, B, alt, Wd) {
    var et = Wd < 600, s = "", dessus = "", cw = et ? Wd - 70 : 280, L = [];
    C.forEach(function (l, k) { couper(k ? l : l.toUpperCase(), k ? 16 : 13).forEach(function (x) { L.push([x, k]); }); });
    function hD(b) { return 20 + couper(b.label, Math.floor((cw - 30) / 9.4)).length * 20 + 10 + hListe(b.items, Math.floor((cw - 40) / 8.2)) + 18; }
    function boiteBD(x, y, b, i) {
      var Lt = couper(b.label, Math.floor((cw - 30) / 9.4)), h = hD(b), r = "<g class='cm-h'><rect x='" + f1(x + 6) + "' y='" + f1(y + 6) + "' width='" + f1(cw) + "' height='" + f1(h) + "' rx='14' fill='#1B1B1B'/><rect x='" + f1(x) + "' y='" + f1(y) + "' width='" + f1(cw) + "' height='" + f1(h) + "' rx='14' fill='" + clair(b.color, .62) + "' stroke='#1B1B1B' stroke-width='2.5'/>";
      Lt.forEach(function (l, k) { r += "<text x='" + f1(x + cw / 2) + "' y='" + f1(y + 26 + k * 20) + "' text-anchor='middle' font-size='16.5' font-weight='900' fill='#1B1B1B'>" + esc(l) + "</text>"; });
      return r + "</g>" + liste(b.items, x + 14, y + 26 + Lt.length * 20 + 14, Math.floor((cw - 40) / 8.2), "#1B1B1B").replace(/fill='(#2E3445|#3B4456)'/g, "fill='#1B1B1B'");
    }
    function grille(W, H) { var g = "<g stroke='#E9E3CF' stroke-width='1'>"; for (var x = 20; x < W; x += 22) g += "<path d='M" + x + " 0V" + Math.round(H) + "'/>"; for (var y = 20; y < H; y += 22) g += "<path d='M0 " + y + "H" + W + "'/>"; return "<rect width='" + W + "' height='" + Math.round(H) + "' fill='#FFFBEF'/>" + g + "</g>"; }
    function centreD(cx, cy) { var w = Math.min(et ? Wd - 20 : 280, Math.max.apply(null, L.map(function (x) { return x[0].length; })) * 15 + 110), h = L.length * 25 + 90, r = "<g class='cm-c'><path d='" + etoileBD(cx, cy, w / 2, h / 2) + "' fill='#F48FC6' stroke='#1B1B1B' stroke-width='3' stroke-linejoin='round'/>"; L.forEach(function (x, k) { r += "<text x='" + f1(cx) + "' y='" + f1(cy - (L.length - 1) * 12.5 + 7 + k * 25) + "' text-anchor='middle' font-size='" + (x[1] ? 14 : 18) + "' font-weight='900' letter-spacing='.6' fill='#1B1B1B'>" + esc(x[0]) + "</text>"; }); return { s: r + "</g>", w: w, h: h }; }
    var noir = B.map(function (b) { return Object.assign({}, b, { color: "#1B1B1B" }); });
    if (et) {
      var hc = L.length * 25 + 90, cd = centreD(Wd / 2, hc * .55 + 8), y = hc * 1.1 + 40;
      B.forEach(function (b, i) { var h = hD(b); s += "<path d='M" + f1(Wd / 2 + (i % 2 ? 30 : -30)) + " " + f1(y - 34) + " q" + (i % 2 ? 14 : -14) + " 12 0 24' fill='none' stroke='#1B1B1B' stroke-width='2.6' stroke-linecap='round' marker-end='url(#" + P + "f" + i + ")'/>"; dessus += boiteBD(28, y, b, i); y += h + 46; });
      return svgDe("cm-etroit", Wd, y, alt, noir, grille(Wd, y) + cd.s + s + dessus);
    }
    var cols = [[], []]; B.forEach(function (b, i) { b.i = i; b.hd = hD(b); cols[i % 2].push(b); });
    var hs = cols.map(function (c) { return c.reduce(function (a, b) { return a + b.hd + 40; }, 0); }), H = Math.max(hs[0], hs[1], 320) + 40, cx = Wd / 2, cy = H / 2, cd2 = centreD(cx, cy);
    cols.forEach(function (c, ct) { var y = (H - hs[ct]) / 2 + 20, x = ct ? Wd - 34 - cw : 28, sg = ct ? 1 : -1; c.forEach(function (b) {
      var ty = y + b.hd / 2, sx = cx + sg * cd2.w * .42, sy = cy + (ty - cy) * .3;
      s += "<path d='" + bouclee(sx, sy, ct ? x - 12 : x + cw + 14, ty, sg) + "' fill='none' stroke='#1B1B1B' stroke-width='2.6' stroke-linecap='round' marker-end='url(#" + P + "f" + b.i + ")'/>";
      dessus += boiteBD(x, y, b, b.i); y += b.hd + 40; }); });
    return svgDe("cm-large", Wd, H, alt, noir, grille(Wd, H) + s + dessus + cd2.s + icone(Wd / 2, 30, 1, "#1B1B1B") + icone(Wd / 2, H - 24, 2, "#1B1B1B"));
  }
  function blob(x, y, w, h, col, k) {
    var x0 = x - 16, y0 = y - 14, x1 = x + w + 16, y1 = y + h + 14, r = 30, b1 = 7 + 4 * Math.sin(k * 1.7), b2 = 7 + 4 * Math.cos(k * 2.3), mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    var d = "M" + f1(x0 + r) + " " + f1(y0) + " Q" + f1(mx) + " " + f1(y0 - b1) + " " + f1(x1 - r) + " " + f1(y0) + " Q" + f1(x1) + " " + f1(y0) + " " + f1(x1) + " " + f1(y0 + r) + " Q" + f1(x1 + b2) + " " + f1(my) + " " + f1(x1) + " " + f1(y1 - r) + " Q" + f1(x1) + " " + f1(y1) + " " + f1(x1 - r) + " " + f1(y1) + " Q" + f1(mx) + " " + f1(y1 + b2) + " " + f1(x0 + r) + " " + f1(y1) + " Q" + f1(x0) + " " + f1(y1) + " " + f1(x0) + " " + f1(y1 - r) + " Q" + f1(x0 - b1) + " " + f1(my) + " " + f1(x0) + " " + f1(y0 + r) + " Q" + f1(x0) + " " + f1(y0) + " " + f1(x0 + r) + " " + f1(y0) + "Z";
    return "<path d='" + d + "' fill='" + col + "'/>";
  }
  function blobs(C, B, alt, Wd) {
    var et = Wd < 600, s = "", dessus = "", cw = et ? Wd - 80 : 270;
    function tab(b) { return couper(b.label, Math.floor((cw - 60) / 9)); }
    B.forEach(function (b) { b.hb = 24 + tab(b).length * 19 + 14 + hListe(b.items, Math.floor((cw - 30) / 8.2)) + 16; });
    function blocB(x, y, b, i) {
      var L = tab(b), th = 12 + L.length * 19, tw = Math.min(cw - 20, 60 + Math.max.apply(null, L.map(function (l) { return l.length; })) * 8.8), r = "<g class='cm-h'>" + blob(x, y + th / 2, cw, b.hb - th / 2, clair(b.color, .84), i);
      r += "<rect x='" + f1(x + cw / 2 - tw / 2) + "' y='" + f1(y - 6) + "' width='" + f1(tw) + "' height='" + f1(th) + "' rx='9' fill='" + b.color + "'/>";
      L.forEach(function (l, k) { r += "<text x='" + f1(x + cw / 2) + "' y='" + f1(y + 13 + k * 19) + "' text-anchor='middle' font-size='15.5' font-weight='800' fill='#fff'>" + esc(l) + "</text>"; });
      return r + "</g>" + liste(b.items, x + 4, y + th + 26, Math.floor((cw - 30) / 8.2), fonce(b.color, .2)).replace(/fill='(#2E3445|#3B4456)'/g, "fill='" + fonce(b.color, .38) + "'");
    }
    function centreB(cx, cy, w) { var L = []; C.forEach(function (l, k) { couper(k ? l : l.toUpperCase(), k ? 22 : 18).forEach(function (x) { L.push([x, k]); }); }); var h = 26 + L.length * 22, r = "<g class='cm-c'>" + blob(cx - w / 2 + 16, cy - h / 2 + 14, w - 32, h - 28, "#E4E6EA", 3); L.forEach(function (x, k) { r += "<text x='" + f1(cx) + "' y='" + f1(cy - h / 2 + 30 + k * 22) + "' text-anchor='middle' font-size='" + (x[1] ? 14 : 18.5) + "' font-weight='" + (x[1] ? 700 : 900) + "' letter-spacing='.6' fill='" + (x[1] ? "#5B6275" : "#111") + "'>" + esc(x[0]) + "</text>"; }); return { s: r + "</g>", h: h }; }
    if (et) {
      var c0 = centreB(Wd / 2, 0, Wd - 80), y = c0.h + 40;
      s += "<g transform='translate(0 " + f1(c0.h / 2 + 20) + ")'>" + c0.s + "</g>";
      B.forEach(function (b, i) { dessus += blocB(40, y, b, i); y += b.hb + 44; });
      return svgDe("cm-etroit", Wd, y, alt, B, s + dessus);
    }
    var cols = [[], []]; B.forEach(function (b, i) { b.i = i; cols[i % 2].push(b); });
    var hs = cols.map(function (c) { return c.reduce(function (a, b) { return a + b.hb + 50; }, 0); }), H = Math.max(hs[0], hs[1], 260) + 30, cx = Wd / 2, cy = H / 2, c1 = centreB(cx, cy, 250);
    cols.forEach(function (c, ct) { var y = (H - hs[ct]) / 2 + 34, x = ct ? Wd - 40 - cw : 40, sg = ct ? 1 : -1; c.forEach(function (b) {
      var ty = y + b.hb / 2, ay = cy + Math.max(-1, Math.min(1, (ty - cy) / 140)) * (c1.h / 2 + 10), ax = cx + sg * (Math.abs(ty - cy) > 90 ? 70 : 140);
      if (Math.abs(ty - cy) <= 90) ay = cy;
      var ex = ax + sg * 42, ey = ay + (ty > cy + 90 ? 30 : ty < cy - 90 ? -30 : 0);
      s += "<path d='M" + f1(ax) + " " + f1(ay) + " Q" + f1(ax + sg * 30) + " " + f1(ay) + " " + f1(ex) + " " + f1(ey) + "' fill='none' stroke='" + b.color + "' stroke-width='3.2' stroke-linecap='round' marker-end='url(#" + P + "f" + b.i + ")'/>";
      dessus += blocB(x, y, b, b.i); y += b.hb + 50; }); });
    return svgDe("cm-large", Wd, H, alt, B, s + dessus + c1.s);
  }
  function arc(C, B, alt, Wd) {
    var et = Wd < 600, s = "", dessus = "", L = [];
    C.forEach(function (l, k) { couper(l, k ? 18 : 14).forEach(function (x) { L.push([x, k]); }); });
    function rond(cx, cy, r) { var p = "<g class='cm-c'><circle cx='" + f1(cx) + "' cy='" + f1(cy) + "' r='" + r + "' fill='url(#" + P + "g)' stroke='#FFC93C' stroke-width='4'/>"; L.forEach(function (x, k) { p += "<text x='" + f1(cx) + "' y='" + f1(cy - (L.length - 1) * 10.5 + 6 + k * 21) + "' text-anchor='middle' font-size='" + (x[1] ? 13.5 : 18) + "' font-weight='" + (x[1] ? 700 : 900) + "' fill='" + (x[1] ? "#FFE08A" : "#fff") + "'>" + esc(x[0]) + "</text>"; }); return p + "</g>"; }
    function hP(b, w) { var NC = Math.floor((w - 40) / 8); return couper(b.label, Math.floor((w - 40) / 9.4)).length * 19 + couper(b.items.join(" · "), NC).length * 18 + 30; }
    function pil(x, y, w, h, b, n) { var NC = Math.floor((w - 40) / 8), Lt = couper(b.label, Math.floor((w - 40) / 9.4)), Li = couper(b.items.join(" · "), NC), p = "<g class='cm-h'><rect x='" + f1(x) + "' y='" + f1(y) + "' width='" + f1(w) + "' height='" + f1(h) + "' rx='" + f1(Math.min(h / 2, 30)) + "' fill='" + clair(b.color, .88) + "' stroke='" + b.color + "' stroke-width='2'/>"; Lt.forEach(function (l, k) { p += "<text x='" + f1(x + 24) + "' y='" + f1(y + 24 + k * 19) + "' font-size='16' font-weight='800' fill='" + b.color + "'>" + esc(l) + "</text>"; }); return p + "</g>" + texte(x + 24, y + 24 + Lt.length * 19 + 2, Li, { t: 14, c: encre("#2E3445") }); }
    if (et) {
      var rr = 84, y = 30 + 2 * rr + 30, w = Wd - 90;
      s += rond(Wd / 2, 30 + rr, rr);
      B.forEach(function (b, i) { var h = hP(b, w); dessus += "<circle cx='34' cy='" + f1(y + h / 2) + "' r='16' fill='" + b.color + "'/><text x='34' y='" + f1(y + h / 2 + 5) + "' text-anchor='middle' font-size='14' font-weight='900' fill='#fff'>" + (i + 1) + "</text>" + pil(60, y, w, h, b, i + 1); y += h + 16; });
      return svgDe("cm-etroit", Wd, y, alt, B, s + dessus);
    }
    var cw = 480, x0 = Wd - 20 - cw, hs = B.map(function (b) { return hP(b, cw); }), tot = hs.reduce(function (a, h) { return a + h + 16; }, -16), H = Math.max(tot + 40, 340), cy = H / 2, R = 150, rc = 120, cx0 = 40 + rc, R2 = Math.max(R + 40, tot / 2 + 10);
    s += "<path d='M" + f1(cx0 + R * Math.cos(-1.2)) + " " + f1(cy + R * Math.sin(-1.2)) + " A" + R + " " + R + " 0 0 1 " + f1(cx0 + R * Math.cos(1.2)) + " " + f1(cy + R * Math.sin(1.2)) + "' fill='none' stroke='#E3E7EF' stroke-width='16' stroke-linecap='round'/>";
    var y = (H - tot) / 2;
    B.forEach(function (b, i) {
      var ym = y + hs[i] / 2, a = B.length > 1 ? -1.15 + 2.3 * i / (B.length - 1) : 0, dx = cx0 + R * Math.cos(a), dy = cy + R * Math.sin(a);
      s += "<path d='M" + f1(dx) + " " + f1(dy) + " C" + f1(dx + 60) + " " + f1(dy) + " " + f1(x0 - 60) + " " + f1(ym) + " " + f1(x0) + " " + f1(ym) + "' fill='none' stroke='" + b.color + "' stroke-width='3'/>";
      dessus += "<circle cx='" + f1(dx) + "' cy='" + f1(dy) + "' r='17' fill='" + b.color + "' stroke='#fff' stroke-width='3'/><text x='" + f1(dx) + "' y='" + f1(dy + 5) + "' text-anchor='middle' font-size='14' font-weight='900' fill='#fff'>" + (i + 1) + "</text>" + pil(x0, y, cw, hs[i], b, i + 1);
      y += hs[i] + 16;
    });
    return svgDe("cm-large", Wd, H, alt, B, s + rond(cx0, cy, rc) + dessus);
  }

  /* ════════ MODÈLES « TIMELINE » ENVOYÉS PAR JACQUES (24/11/2026) : onglets sur tube, capsules, zigzag, gouttes, rameaux ════════ */
  function onglets(C, B, alt, Wd) {
    var et = Wd < 600, ax = et ? 26 : Wd / 2, tw = 96, cw = et ? Wd - 64 - tw : Wd / 2 - 40 - tw, tt = titresAmp(Wd / 2, 18, C, et ? Wd - 60 : 300), s = "", dessus = "";
    B.forEach(function (b) { b.hh = Math.max(76, hTxt(b, cw) + 10); });
    var A = alterne(B, Wd, 18 + tt.h + 40, cw, 22), H = A.H + 30, top = 18 + tt.h + 16;
    s += "<rect x='" + f1(ax - 11) + "' y='" + f1(top) + "' width='22' height='" + f1(H - top - 12) + "' rx='11' fill='#EEF1F6' stroke='#C9D0DC' stroke-width='2'/><rect x='" + f1(ax - 5) + "' y='" + f1(top + 8) + "' width='4' height='" + f1(H - top - 28) + "' rx='2' fill='#fff'/>";
    A.pos.forEach(function (p, i) {
      var b = B[i], sg = p.cote ? 1 : -1, x0 = p.cote ? ax + 18 : ax - 18 - tw, y = p.y, ix = p.cote ? x0 : x0 + tw, tx = p.cote ? x0 + tw + 16 : x0 - 16 - cw;
      dessus += "<g class='cm-h'><path d='M" + f1(ix) + " " + f1(y + 44) + " L" + f1(ix - sg * 12) + " " + f1(y + 76) + " L" + f1(ix + sg * 30) + " " + f1(y + 56) + "Z' fill='" + fonce(b.color, .25) + "'/><rect x='" + f1(x0) + "' y='" + f1(y) + "' width='" + tw + "' height='58' rx='18' fill='" + b.color + "'/><rect x='" + f1(x0 + 4) + "' y='" + f1(y + 4) + "' width='" + (tw - 8) + "' height='22' rx='12' fill='#fff' opacity='.18'/><text x='" + f1(x0 + tw / 2) + "' y='" + f1(y + 39) + "' text-anchor='middle' font-size='26' font-weight='900' fill='#fff'>" + n2(i) + "</text></g>";
      dessus += "<circle cx='" + f1(ax) + "' cy='" + f1(y + 66) + "' r='6' fill='" + b.color + "' stroke='#fff' stroke-width='2'/>";
      dessus += blocTxt(tx, y + 2, cw, b, 0).s + "<path d='M" + f1(tx) + " " + f1(y + 4 + couper(b.label, Math.floor(cw / 9.6)).length * 20) + " h" + f1(Math.min(cw, 220)) + "' stroke='#C9D0DC' stroke-width='1.5'/>";
    });
    return svgDe(et ? "cm-etroit" : "cm-large", Wd, H, alt, B, tt.s + s + dessus);
  }
  function capsules(C, B, alt, Wd) {
    var n = B.length, s = "", dessus = "", tt = titresAmp(Wd / 2, 18, C, Wd < 600 ? Wd - 60 : 360);
    function hC(b, w) { var NC = Math.floor((w - 36) / 8); return 70 + couper(b.label, Math.floor((w - 30) / 9.2)).length * 19 + 10 + hListe(b.items, NC) + 26; }
    function caps(x, y, w, h, b, i, bas) {
      var NC = Math.floor((w - 36) / 8), Lt = couper(b.label, Math.floor((w - 30) / 9.2)), r = Math.min(w / 2, 60), cy0 = bas ? y + h - 34 : y + 34, ty = bas ? y + 26 : y + 72, g = "<g class='cm-h'>";
      g += "<rect x='" + f1(x) + "' y='" + f1(y) + "' width='" + f1(w) + "' height='" + f1(h) + "' rx='" + f1(r) + "' fill='" + b.color + "'/><rect x='" + f1(x + 6) + "' y='" + f1(y + 6) + "' width='" + f1(w - 12) + "' height='" + f1(h - 12) + "' rx='" + f1(r - 6) + "' fill='#fff'/>";
      g += "<circle cx='" + f1(x + w / 2) + "' cy='" + f1(cy0) + "' r='22' fill='" + b.color + "'/><text x='" + f1(x + w / 2) + "' y='" + f1(cy0 + 6) + "' text-anchor='middle' font-size='17' font-weight='900' fill='#fff'>" + n2(i) + "</text>";
      Lt.forEach(function (l, k) { g += "<text x='" + f1(x + w / 2) + "' y='" + f1(ty + k * 19) + "' text-anchor='middle' font-size='15' font-weight='800' fill='" + b.color + "'>" + esc(l) + "</text>"; });
      return g + "</g>" + liste(b.items, x + w / 2, ty + Lt.length * 19 + 12, NC, b.color, true);
    }
    if (Wd < 600) {
      var y = 18 + tt.h + 30, w = Wd - 60;
      B.forEach(function (b, i) { var h = hC(b, w); dessus += caps(30, y, w, h, b, i, false); y += h + 18; });
      return svgDe("cm-etroit", Wd, y, alt, B, tt.s + dessus);
    }
    var step = (Wd - 60) / n, w = Math.min(2 * step - 18, 250), hs = B.map(function (b) { return hC(b, w); });
    var hH = Math.max.apply(null, hs.filter(function (h, i) { return i % 2 === 0; })), hB = Math.max.apply(null, hs.filter(function (h, i) { return i % 2 === 1; }).concat([0]));
    var ly = 18 + tt.h + 30 + hH + 40, H = ly + 40 + hB + 20, d = "M20 " + f1(ly);
    for (var k = 0; k < n; k++) d += " Q" + f1(30 + step * k + step / 2) + " " + f1(ly + (k % 2 ? 16 : -16)) + " " + f1(30 + step * (k + 1)) + " " + f1(ly);
    s += "<path d='" + d + "' fill='none' stroke='#DDE2EA' stroke-width='8' stroke-linecap='round'/>";
    B.forEach(function (b, i) {
      var cx = 30 + step * (i + .5), x = Math.max(14, Math.min(Wd - 14 - w, cx - w / 2)), haut = i % 2 === 0, y = haut ? ly - 40 - hs[i] : ly + 40;
      s += "<path d='M" + f1(cx) + " " + f1(haut ? ly - 40 : ly + 40) + " V" + f1(ly) + "' stroke='" + b.color + "' stroke-width='2.5'/>";
      dessus += "<circle cx='" + f1(cx) + "' cy='" + f1(ly) + "' r='7' fill='#fff' stroke='" + b.color + "' stroke-width='4'/>" + caps(x, y, w, hs[i], b, i, haut);
    });
    return svgDe("cm-large", Wd, H, alt, B, tt.s + s + dessus);
  }
  function zigzag(C, B, alt, Wd) {
    var et = Wd < 600, ax = et ? 46 : Wd / 2, dz = et ? 16 : 44, cw = et ? Wd - 110 : Wd / 2 - 110, tt = titresAmp(Wd / 2, 18, C, et ? Wd - 60 : 300), s = "", dessus = "", pts = [];
    B.forEach(function (b) { b.hh = Math.max(84, hTxt(b, cw - 40)); });
    var A = alterne(B, Wd, 18 + tt.h + 40, cw, 18), H = A.H + 30;
    A.pos.forEach(function (p, i) { pts.push([ax + (i % 2 ? dz : -dz), p.y + 20]); });
    s += "<path d='M" + pts.map(function (q) { return f1(q[0]) + " " + f1(q[1]); }).join(" L") + "' fill='none' stroke='#7A8296' stroke-width='3.5' stroke-linejoin='round'/>";
    A.pos.forEach(function (p, i) {
      var b = B[i], q = pts[i], tx = et ? ax + 50 : p.cote ? ax + 80 : ax - 80 - cw + 40;
      if (i) { var r = pts[i - 1], mx = (q[0] + r[0]) / 2, my = (q[1] + r[1]) / 2, ang = Math.atan2(q[1] - r[1], q[0] - r[0]) * 180 / Math.PI; if (ang > 90) ang -= 180; if (ang < -90) ang += 180; s += "<text x='" + f1(mx) + "' y='" + f1(my - 6) + "' text-anchor='middle' font-size='12.5' font-weight='900' fill='" + b.color + "' transform='rotate(" + f1(ang) + " " + f1(mx) + " " + f1(my) + ")'>ÉTAPE " + (i + 1) + "</text>"; }
      dessus += "<circle cx='" + f1(q[0]) + "' cy='" + f1(q[1]) + "' r='17' fill='#fff' stroke='" + b.color + "' stroke-width='6'/><text x='" + f1(q[0]) + "' y='" + f1(q[1] + 5) + "' text-anchor='middle' font-size='13' font-weight='900' fill='" + b.color + "'>" + (i + 1) + "</text>";
      dessus += icone(et ? tx - 0 : p.cote ? tx + 14 : ax - 96, p.y + 22, i % 6, b.color) + blocTxt(et ? tx + 30 : p.cote ? tx + 40 : tx - 40 + 0, p.y + 4, cw - 40, b, 0).s;
    });
    return svgDe(et ? "cm-etroit" : "cm-large", Wd, H, alt, B, tt.s + s + dessus);
  }
  function gouttes(C, B, alt, Wd) {
    var et = Wd < 600, ax = et ? 26 : Wd / 2, cw = et ? Wd - 64 : Wd / 2 - 54, tt = titresAmp(Wd / 2, 18, C, et ? Wd - 60 : 300), s = "", dessus = "";
    var G = ["#C9D86B", "#A5CF5E", "#74BF63", "#45A866", "#228C63", "#0F6E58", "#0B5A4A"];
    B.forEach(function (b) { b.hh = hTxt(b, cw - 50) + 30; });
    var A = alterne(B, Wd, 18 + tt.h + 40, cw, 20), H = A.H + 40, top = 18 + tt.h + 14;
    for (var y = top, k = 0; y < H - 30; y += 30, k++) s += "<path d='M" + f1(ax - 13) + " " + f1(y) + " L" + f1(ax) + " " + f1(y + 10) + " L" + f1(ax + 13) + " " + f1(y) + " V" + f1(y + 24) + " L" + f1(ax) + " " + f1(y + 34) + " L" + f1(ax - 13) + " " + f1(y + 24) + "Z' fill='" + G[Math.min(G.length - 1, Math.floor(k / Math.max(1, (H - top) / 30 / G.length)))] + "'/>";
    A.pos.forEach(function (p, i) {
      var b = B[i], v = G[Math.min(G.length - 1, i)], x = et ? ax + 22 : p.cote ? ax + 26 : ax - 26 - cw, y = p.y, h = p.h, r = Math.min(h / 2, 46), clairT = i < 2;
      var d = p.cote || et ? "M" + f1(x) + " " + f1(y + h) + " V" + f1(y + r) + " Q" + f1(x) + " " + f1(y) + " " + f1(x + r) + " " + f1(y) + " H" + f1(x + cw - r) + " Q" + f1(x + cw) + " " + f1(y) + " " + f1(x + cw) + " " + f1(y + r) + " V" + f1(y + h - r) + " Q" + f1(x + cw) + " " + f1(y + h) + " " + f1(x + cw - r) + " " + f1(y + h) + "Z"
        : "M" + f1(x + cw) + " " + f1(y + h) + " V" + f1(y + r) + " Q" + f1(x + cw) + " " + f1(y) + " " + f1(x + cw - r) + " " + f1(y) + " H" + f1(x + r) + " Q" + f1(x) + " " + f1(y) + " " + f1(x) + " " + f1(y + r) + " V" + f1(y + h - r) + " Q" + f1(x) + " " + f1(y + h) + " " + f1(x + r) + " " + f1(y + h) + "Z";
      var bx = p.cote || et ? x : x + cw;
      s += "<path d='M" + f1(ax) + " " + f1(y + h - 4) + " q" + f1((p.cote || et ? 1 : -1) * 6) + " -14 " + f1(bx - ax) + " -6' fill='none' stroke='" + v + "' stroke-width='3'/><path d='M" + f1(ax) + " " + f1(y + h) + " q" + f1((p.cote || et ? 1 : -1) * 16) + " -16 " + f1((p.cote || et ? 1 : -1) * 28) + " -4 q" + f1((p.cote || et ? -1 : 1) * 12) + " 10 " + f1((p.cote || et ? -1 : 1) * 28) + " 4Z' fill='#8CC152'/>";
      var bl = blocTxt(x + 26, y + 14, cw - 50, b, i + 1, { col: clairT ? "#22361A" : "#fff", puce: clairT ? "#3E6B1F" : "#E4F6D2" }).s;
      dessus += "<g class='cm-h'><path d='" + d + "' fill='" + v + "'/></g>" + (clairT ? bl.replace(/fill='(#2E3445|#3B4456)'/g, "fill='#22361A'") : blanc(bl));
    });
    return svgDe(et ? "cm-etroit" : "cm-large", Wd, H, alt, B, tt.s + s + dessus);
  }
  function rameaux(C, B, alt, Wd) {
    var et = Wd < 600, ax = et ? 24 : Wd / 2, cw = et ? Wd - 54 : Wd / 2 - 60, tt = titresAmp(Wd / 2, 18, C, et ? Wd - 60 : 300), s = "", dessus = "", T = "#8A94A6";
    B.forEach(function (b) { b.hh = Math.max(86, hTxt(b, cw - 110) + 24); });
    var A = alterne(B, Wd, 18 + tt.h + 50, cw, 20), H = A.H + 60, top = 18 + tt.h + 18;
    s += "<path d='M" + f1(ax) + " " + f1(top) + " V" + f1(H - 30) + "' stroke='" + T + "' stroke-width='5' stroke-linecap='round'/>";
    if (!et) [-1, -.5, .5, 1].forEach(function (k) { s += "<path d='M" + f1(ax) + " " + f1(H - 30) + " q" + f1(k * 40) + " 0 " + f1(k * 70) + " 22' fill='none' stroke='" + T + "' stroke-width='3'/><circle cx='" + f1(ax + k * 70) + "' cy='" + f1(H - 6) + "' r='5' fill='#fff' stroke='" + T + "' stroke-width='3'/>"; });
    A.pos.forEach(function (p, i) {
      var b = B[i], sg = et || p.cote ? 1 : -1, x = et ? ax + 18 : p.cote ? ax + 40 : ax - 40 - cw, y = p.y, h = p.h, r = Math.min(h / 2, 46), cy = y + h / 2, ix = sg > 0 ? x : x + cw;
      s += "<path d='M" + f1(ax) + " " + f1(cy + 40) + " C" + f1(ax) + " " + f1(cy) + " " + f1(ix - sg * 20) + " " + f1(cy) + " " + f1(ix) + " " + f1(cy) + "' fill='none' stroke='" + b.color + "' stroke-width='4.5'/>";
      if (!et) s += "<path d='M" + f1(ax) + " " + f1(cy + 10) + " C" + f1(ax) + " " + f1(cy - 20) + " " + f1(ax - sg * 30) + " " + f1(y - 6) + " " + f1(ax - sg * 46) + " " + f1(y - 6) + "' fill='none' stroke='" + b.color + "' stroke-width='3' opacity='.7'/><circle cx='" + f1(ax - sg * 52) + "' cy='" + f1(y - 6) + "' r='6' fill='#fff' stroke='" + b.color + "' stroke-width='3'/>";
      var wc = 76, xw = sg > 0 ? x + wc : x;
      dessus += "<g class='cm-h'><rect x='" + f1(x + 4) + "' y='" + f1(y + 6) + "' width='" + f1(cw) + "' height='" + f1(h) + "' rx='" + f1(r) + "' fill='#0B1A33' opacity='.09'/><rect x='" + f1(x) + "' y='" + f1(y) + "' width='" + f1(cw) + "' height='" + f1(h) + "' rx='" + f1(r) + "' fill='" + b.color + "'/>";
      dessus += sg > 0 ? "<path d='M" + f1(xw) + " " + f1(y) + " H" + f1(x + cw - r) + " A" + f1(r) + " " + f1(r) + " 0 0 1 " + f1(x + cw) + " " + f1(y + r) + " V" + f1(y + h - r) + " A" + f1(r) + " " + f1(r) + " 0 0 1 " + f1(x + cw - r) + " " + f1(y + h) + " H" + f1(xw) + "Z' fill='#fff'/>" : "<path d='M" + f1(x + cw - wc) + " " + f1(y) + " H" + f1(x + r) + " A" + f1(r) + " " + f1(r) + " 0 0 0 " + f1(x) + " " + f1(y + r) + " V" + f1(y + h - r) + " A" + f1(r) + " " + f1(r) + " 0 0 0 " + f1(x + r) + " " + f1(y + h) + " H" + f1(x + cw - wc) + "Z' fill='#fff'/>";
      dessus += "<circle cx='" + f1(sg > 0 ? x + wc : x + cw - wc) + "' cy='" + f1(cy) + "' r='9' fill='" + b.color + "'/><text x='" + f1(sg > 0 ? x + wc / 2 - 4 : x + cw - wc / 2 + 4) + "' y='" + f1(cy + 10) + "' text-anchor='middle' font-size='28' font-weight='800' fill='#fff'>" + n2(i) + "</text></g>";
      dessus += blocTxt(sg > 0 ? x + wc + 18 : x + 26, y + 12, cw - wc - 44, b, 0).s;
    });
    return svgDe(et ? "cm-etroit" : "cm-large", Wd, H, alt, B, tt.s + s + dessus);
  }

  /* ════════ CINQ MODÈLES DE PLUS (24/11/2026) : diagonale montante, médaillons, pont en arc, bouquet de disques, serpentin de bulles ════════ */
  function hUnite(b, w) { var NC = Math.floor((w - 24) / 7.8); return 14 + couper(b.label.toUpperCase(), Math.floor((w - 20) / 8.6)).length * 17 + 8 + hListe(b.items, NC) + 16 + 52; }
  function unite(cx, top, w, b, i, cercleHaut) {
    var NC = Math.floor((w - 24) / 7.8), Lt = couper(b.label.toUpperCase(), Math.floor((w - 20) / 8.6)), hb = 14 + Lt.length * 17 + 8 + hListe(b.items, NC) + 16, r = 30;
    var yb = cercleHaut ? top + 2 * r - 8 : top, cy = cercleHaut ? top + r : top + hb + r - 8, x = cx - w / 2, g = "<g class='cm-h'>";
    g += "<rect x='" + f1(x + 3) + "' y='" + f1(yb + 4) + "' width='" + f1(w) + "' height='" + f1(hb) + "' rx='6' fill='#000' opacity='.25'/><rect x='" + f1(x) + "' y='" + f1(yb) + "' width='" + f1(w) + "' height='" + f1(hb) + "' rx='6' fill='#fff'/>";
    Lt.forEach(function (l, k) { g += "<text x='" + f1(cx) + "' y='" + f1(yb + (cercleHaut ? 30 : 22) + k * 17) + "' text-anchor='middle' font-size='13.5' font-weight='900' letter-spacing='.4' fill='" + fonce(b.color, .1) + "'>" + esc(l) + "</text>"; });
    g += "<circle cx='" + f1(cx) + "' cy='" + f1(cy) + "' r='" + r + "' fill='" + b.color + "'/><path d='M" + f1(cx - r) + " " + f1(cy) + " A" + r + " " + r + " 0 0 1 " + f1(cx + r) + " " + f1(cy) + "Z' fill='#fff' opacity='.16'/><text x='" + f1(cx) + "' y='" + f1(cy + 8) + "' text-anchor='middle' font-size='22' font-weight='800' fill='#fff'>" + n2(i) + "</text></g>";
    return { s: g + liste(b.items, x + 12, yb + (cercleHaut ? 30 : 22) + Lt.length * 17 + 14, NC, b.color), h: hb + 2 * r - 8 };
  }
  function diagonale(C, B, alt, Wd) {
    var et = Wd < 600, n = B.length, s = "", dessus = "", tt = titresAmp(Wd / 2, 18, C, et ? Wd - 60 : 360), BG = "#2A2D34", top0 = 18 + tt.h + 24;
    function fondN(H) { return "<rect width='" + Wd + "' height='" + Math.round(H) + "' fill='" + BG + "'/>"; }
    if (et) {
      var w = Wd - 92, y = top0, ys = [];
      B.forEach(function (b, i) { var u = unite(66 + w / 2, y, w, b, i, true); dessus += u.s; ys.push(y + 30); s += "<path d='M30 " + f1(y + 30) + " H" + f1(66 + w / 2 - 30) + "' stroke='" + b.color + "' stroke-width='3'/>"; y += u.h + 22; });
      s = "<path d='M30 " + f1(top0 - 6) + " V" + f1(y - 10) + "' stroke='#5C6270' stroke-width='4' stroke-linecap='round'/>" + s + ys.map(function (v, i) { return "<circle cx='30' cy='" + f1(v) + "' r='7' fill='#fff' stroke='" + B[i].color + "' stroke-width='3'/>"; }).join("");
      return svgDe("cm-etroit", Wd, y, alt, B, fondN(y) + tt.s + s + dessus);
    }
    var D = 220, w = Math.min(190, 2 * (Wd - 80) / (n + 1) - 16), hs = B.map(function (b) { return hUnite(b, w); }), ts = B.map(function (b, i) { return (i + 1) / (n + 1); }), Y0 = 0, H = 0;
    B.forEach(function (b, i) { if (i % 2 === 0) Y0 = Math.max(Y0, top0 + hs[i] + 26 + D * ts[i]); });
    Y0 = Math.max(Y0, top0 + D + 20);
    var P2 = ts.map(function (t) { return [40 + (Wd - 80) * t, Y0 - D * t]; }), pts = [[40, Y0]].concat(P2, [[Wd - 40, Y0 - D]]);
    for (var k = 0; k < pts.length - 1; k++) s += "<path d='M" + f1(pts[k][0]) + " " + f1(pts[k][1]) + " L" + f1(pts[k + 1][0]) + " " + f1(pts[k + 1][1]) + "' stroke='" + B[Math.min(k, n - 1)].color + "' stroke-width='5' stroke-linecap='round'/>";
    s += "<circle cx='40' cy='" + f1(Y0) + "' r='10' fill='#fff'/><circle cx='" + (Wd - 40) + "' cy='" + f1(Y0 - D) + "' r='8' fill='#fff'/>";
    B.forEach(function (b, i) {
      var p = P2[i], haut = i % 2 === 0, topU = haut ? p[1] - 26 - hs[i] : p[1] + 26;
      s += "<path d='M" + f1(p[0]) + " " + f1(p[1]) + " V" + f1(haut ? p[1] - 26 : p[1] + 26) + "' stroke='" + b.color + "' stroke-width='3'/>";
      dessus += "<circle cx='" + f1(p[0]) + "' cy='" + f1(p[1]) + "' r='7' fill='#fff' stroke='" + b.color + "' stroke-width='3'/>" + unite(Math.max(20 + w / 2, Math.min(Wd - 20 - w / 2, p[0])), topU, w, b, i, haut).s;
      H = Math.max(H, haut ? Y0 + 30 : topU + hs[i] + 24);
    });
    return svgDe("cm-large", Wd, H, alt, B, fondN(H) + tt.s + s + dessus);
  }
  function anneau(cx, cy, b, i) { return "<g class='cm-h'><circle cx='" + f1(cx) + "' cy='" + f1(cy) + "' r='47' fill='#fff' stroke='" + clair(b.color, .6) + "' stroke-width='2'/><circle cx='" + f1(cx) + "' cy='" + f1(cy) + "' r='36' fill='#fff' stroke='" + b.color + "' stroke-width='9'/></g>" + icone(cx, cy, i % 6, b.color); }
  function medaillons(C, B, alt, Wd) {
    var et = Wd < 600, n = B.length, s = "", dessus = "", tt = titresAmp(Wd / 2, 18, C, et ? Wd - 60 : 360), top0 = 18 + tt.h + 24;
    function pastille(cx, cy, b, i) { return "<circle cx='" + f1(cx) + "' cy='" + f1(cy) + "' r='15' fill='" + fonce(b.color, .15) + "' stroke='#fff' stroke-width='3'/><text x='" + f1(cx) + "' y='" + f1(cy + 5) + "' text-anchor='middle' font-size='13' font-weight='900' fill='#fff'>" + (i + 1) + "</text>"; }
    if (et) {
      var w = Wd - 176, y = top0, last = top0;
      B.forEach(function (b, i) { var h = Math.max(104, hTxt(b, w) + 10); s += "<path d='M40 " + f1(y + 48) + " H74' stroke='" + b.color + "' stroke-width='3'/>"; dessus += pastille(40, y + 48, b, i) + anneau(110, y + 48, b, i) + blocTxt(166, y + 4, w, b, 0).s; last = y + 48; y += h + 18; });
      return svgDe("cm-etroit", Wd, y, alt, B, tt.s + "<path d='M40 " + f1(top0) + " V" + f1(last) + "' stroke='#3A4256' stroke-width='4'/>" + s + dessus);
    }
    var step = (Wd - 60) / n, w = Math.min(2 * step - 24, 250), hs = B.map(function (b) { return hTxt(b, w); });
    var hH = Math.max.apply(null, hs.filter(function (h, i) { return i % 2 === 0; })), hB = Math.max.apply(null, hs.filter(function (h, i) { return i % 2 === 1; }).concat([0]));
    var ly = top0 + hH + 14 + 122, H = ly + 122 + 14 + hB + 20;
    s += "<path d='M20 " + f1(ly) + " H" + (Wd - 20) + "' stroke='#3A4256' stroke-width='4' stroke-linecap='round'/>";
    B.forEach(function (b, i) {
      var cx = 30 + step * (i + .5), haut = i % 2 === 0, ry = haut ? ly - 70 : ly + 70, x = Math.max(16, Math.min(Wd - 16 - w, cx - w / 2)), ty = haut ? ry - 52 - hs[i] : ry + 52;
      s += "<path d='M" + f1(cx) + " " + f1(ly) + " V" + f1(ry) + "' stroke='" + b.color + "' stroke-width='3'/><path d='M" + f1(30 + step * i) + " " + f1(ly) + " H" + f1(30 + step * (i + 1)) + "' stroke='" + b.color + "' stroke-width='4'/>";
      dessus += anneau(cx, ry, b, i) + pastille(cx, ly, b, i) + blocTxt(x, ty, w, b, 0).s;
    });
    return svgDe("cm-large", Wd, H, alt, B, tt.s + s + dessus);
  }
  function pont(C, B, alt, Wd) {
    var et = Wd < 600, n = B.length, s = "", dessus = "", tt = titresAmp(Wd / 2, 18, C, et ? Wd - 60 : 360), top0 = 18 + tt.h + 24;
    var grad = "<defs><linearGradient id='" + P + "pt' x1='0' y1='0' x2='1' y2='0'>" + B.map(function (b, i) { return "<stop offset='" + (n > 1 ? i / (n - 1) : 0) + "' stop-color='" + b.color + "'/>"; }).join("") + "</linearGradient></defs>";
    function onglet(x, y, w, b) { var L = couper(b.label, Math.floor((w - 16) / 8.4)), h = 10 + L.length * 17, g = "<g class='cm-h'><rect x='" + f1(x) + "' y='" + f1(y) + "' width='" + f1(w) + "' height='" + f1(h) + "' rx='8' fill='" + b.color + "'/>"; L.forEach(function (l, k) { g += "<text x='" + f1(x + w / 2) + "' y='" + f1(y + 18 + k * 17) + "' text-anchor='middle' font-size='14' font-weight='800' fill='#fff'>" + esc(l) + "</text>"; }); return { s: g + "</g>", h: h }; }
    function hOng(b, w) { return 10 + couper(b.label, Math.floor((w - 16) / 8.4)).length * 17; }
    function carre(x, y, w, b, i, fl) { var NC = Math.floor((w - 30) / 7.9), h = 52 + hListe(b.items, NC) + 14, g = "<g class='cm-h'><rect x='" + f1(x) + "' y='" + f1(y) + "' width='" + f1(w) + "' height='" + f1(h) + "' rx='10' fill='" + b.color + "'/>" + (fl === "h" ? "<path d='M" + f1(x + w / 2 - 12) + " " + f1(y + 1) + " L" + f1(x + w / 2) + " " + f1(y - 12) + " L" + f1(x + w / 2 + 12) + " " + f1(y + 1) + "Z' fill='" + b.color + "'/>" : "<path d='M" + f1(x + 1) + " " + f1(y + 18) + " L" + f1(x - 12) + " " + f1(y + 30) + " L" + f1(x + 1) + " " + f1(y + 42) + "Z' fill='" + b.color + "'/>") + "<circle cx='" + f1(x + w / 2) + "' cy='" + f1(y + 26) + "' r='19' fill='#fff' opacity='.95'/></g>" + icone(x + w / 2, y + 26, i % 6, b.color); return { s: g + blanc(liste(b.items, x + 12, y + 66, NC, "#fff")), h: h }; }
    function hCar(b, w) { return 52 + hListe(b.items, Math.floor((w - 30) / 7.9)) + 14; }
    function rond(cx, cy, b, i) { return "<circle cx='" + f1(cx) + "' cy='" + f1(cy) + "' r='25' fill='#fff' stroke='" + b.color + "' stroke-width='5'/><text x='" + f1(cx) + "' y='" + f1(cy + 6) + "' text-anchor='middle' font-size='16' font-weight='900' fill='" + b.color + "'>" + n2(i) + "</text>"; }
    if (et) {
      var w = Wd - 96, y = top0, ys = [];
      B.forEach(function (b, i) { var o = onglet(76, y, w, b), c = carre(76, y + o.h + 8, w, b, i, "g"); dessus += o.s + c.s + rond(34, y + o.h + 8 + 30, b, i); ys.push(y + o.h + 38); y += o.h + 8 + c.h + 22; });
      return svgDe("cm-etroit", Wd, y, alt, B, grad + tt.s + "<path d='M34 " + f1(top0) + " V" + f1(ys[ys.length - 1]) + "' stroke='url(#" + P + "pt)' stroke-width='6' stroke-linecap='round'/>" + dessus);
    }
    var step = (Wd - 40) / n, w = step - 14, f = function (t) { return (1 - t) * (1 - t) * 40 + 2 * t * (1 - t) * (-50) + t * t * 40; }, ay = 0, H = 0;
    var ts = B.map(function (b, i) { return (20 + step * (i + .5) - 20) / (Wd - 40); });
    B.forEach(function (b, i) { ay = Math.max(ay, top0 + hOng(b, w) + 40 - f(ts[i])); });
    s += "<path d='M20 " + f1(ay + 40) + " Q" + f1(Wd / 2) + " " + f1(ay - 50) + " " + f1(Wd - 30) + " " + f1(ay + 40) + "' fill='none' stroke='url(#" + P + "pt)' stroke-width='6' stroke-linecap='round'/><circle cx='20' cy='" + f1(ay + 40) + "' r='6' fill='" + B[0].color + "'/><path d='M" + (Wd - 30) + " " + f1(ay + 32) + " l14 14 l-18 2Z' fill='" + B[n - 1].color + "'/>";
    B.forEach(function (b, i) {
      var cx = 20 + step * (i + .5), py = ay + f(ts[i]), o = onglet(cx - w / 2, py - 34 - hOng(b, w), w, b), c = carre(cx - w / 2, py + 44, w, b, i, "h");
      dessus += o.s + c.s + rond(cx, py, b, i); H = Math.max(H, py + 44 + c.h + 24);
    });
    return svgDe("cm-large", Wd, H, alt, B, grad + tt.s + s + dessus);
  }
  function bouquet(C, B, alt, Wd) {
    var et = Wd < 600, n = B.length, s = "", dessus = "", tt = titresAmp(Wd / 2, 18, C, et ? Wd - 60 : 300), top0 = 18 + tt.h + 30;
    var G = ["#5D4037", "#1B5E20", "#2E7D32", "#388E3C", "#33691E", "#43A047", "#558B2F", "#2E7D32"];
    function hT(b, tw) { return couper(b.label, Math.floor(tw / 9.4)).length * 19 + 8 + hListe(b.items, Math.floor(tw / 7.8)); }
    function rayon(b, max) { var r = 100; for (var k = 0; k < 5; k++) r = Math.min(max, Math.max(96, hT(b, r * 1.4) * .62 + 30)); return r; }
    function disque(cx, cy, r, b, i, col, sg) {
      var tw = r * 1.4, Lt = couper(b.label, Math.floor(tw / 9.4)), ht = hT(b, tw), y = cy - ht / 2 + 14, g = "<g class='cm-h'><circle cx='" + f1(cx) + "' cy='" + f1(cy) + "' r='" + f1(r) + "' fill='" + col + "'/>";
      var ix = cx + sg * r * .74, iy = cy - r * .74; g += "<circle cx='" + f1(ix) + "' cy='" + f1(iy) + "' r='22' fill='#fff' stroke='" + col + "' stroke-width='4'/></g>" + icone(ix, iy, i % 6, col);
      Lt.forEach(function (l, k) { g += "<text x='" + f1(cx) + "' y='" + f1(y + k * 19) + "' text-anchor='middle' font-size='16' font-weight='900' fill='#fff'>" + esc(l) + "</text>"; });
      return g + blanc(liste(b.items, cx, y + Lt.length * 19 + 10, Math.floor(tw / 7.8), "#fff", true));
    }
    var cols = B.map(function (b, i) { return G[(n - 1 - i) % G.length]; });
    if (et) {
      var y = top0, cs = [];
      B.forEach(function (b, i) { var r = rayon(b, (Wd - 70) / 2), cx = Wd / 2 + 16, cy = y + r; s += "<path d='M24 " + f1(cy + r * .6) + " C24 " + f1(cy) + " 40 " + f1(cy) + " " + f1(cx - r + 4) + " " + f1(cy) + "' fill='none' stroke='" + cols[i] + "' stroke-width='10' stroke-linecap='round'/>"; dessus += disque(cx, cy, r, b, i, cols[i], 1); cs.push(cy); y += 2 * r + 16; });
      return svgDe("cm-etroit", Wd, y + 10, alt, B, tt.s + "<path d='M24 " + f1(cs[0]) + " V" + f1(y) + "' stroke='#5D4037' stroke-width='12' stroke-linecap='round'/>" + s + dessus);
    }
    var ax = Wd / 2, rs = B.map(function (b) { return rayon(b, 175); });
    B.forEach(function (b, i) { b.hh = 2 * rs[i]; });
    var A = alterne(B, Wd, top0, 300, 10), H = A.H + 60;
    s += "<path d='M" + f1(ax) + " " + f1(H - 26) + " V" + f1(A.pos[0].y + rs[0]) + "' stroke='#2E7D32' stroke-width='14' stroke-linecap='round'/><path d='M" + f1(ax) + " " + f1(H - 26) + " V" + f1(H - 160) + "' stroke='#5D4037' stroke-width='16' stroke-linecap='round'/><path d='M" + f1(ax - 140) + " " + f1(H - 24) + " H" + f1(ax + 140) + "' stroke='#5D4037' stroke-width='3'/>";
    A.pos.forEach(function (p, i) {
      var b = B[i], r = rs[i], sg = p.cote ? 1 : -1, cx = ax + sg * (46 + r), cy = p.y + r;
      s += "<path d='M" + f1(ax) + " " + f1(Math.min(H - 40, cy + r * .9)) + " C" + f1(ax) + " " + f1(cy + 10) + " " + f1(ax + sg * 14) + " " + f1(cy) + " " + f1(cx - sg * r + sg * 6) + " " + f1(cy) + "' fill='none' stroke='" + cols[i] + "' stroke-width='12' stroke-linecap='round'/>";
      dessus += disque(cx, cy, r, b, i, cols[i], sg);
    });
    return svgDe("cm-large", Wd, H, alt, B, tt.s + s + dessus);
  }
  function serpentin(C, B, alt, Wd) {
    var et = Wd < 600, n = B.length, s = "", dessus = "", tt = titresAmp(Wd / 2, 18, C, et ? Wd - 60 : 300), top0 = 18 + tt.h + 34, V = "#5DAE3A", R = "#F2456E";
    function bulle(x, y, w, h, b, i, cote) {
      var g = "<g class='cm-h'><rect x='" + f1(x + 3) + "' y='" + f1(y + 5) + "' width='" + f1(w) + "' height='" + f1(h) + "' rx='18' fill='#000' opacity='.08'/><rect x='" + f1(x) + "' y='" + f1(y) + "' width='" + f1(w) + "' height='" + f1(h) + "' rx='18' fill='" + V + "'/>";
      var ty = y + Math.min(h / 2, 46), tx = cote === "d" ? x + w : x;
      g += "<path d='M" + f1(tx) + " " + f1(ty - 12) + " L" + f1(tx + (cote === "d" ? 16 : -16)) + " " + f1(ty) + " L" + f1(tx) + " " + f1(ty + 12) + "Z' fill='" + V + "'/>";
      g += "<circle cx='" + f1(x + w / 2) + "' cy='" + f1(y) + "' r='15' fill='#fff' stroke='" + V + "' stroke-width='3'/><text x='" + f1(x + w / 2) + "' y='" + f1(y + 5) + "' text-anchor='middle' font-size='13' font-weight='900' fill='" + V + "'>" + (i + 1) + "</text></g>";
      return g + blanc(blocTxt(x + 18, y + 18, w - 36, b, 0, { col: "#fff", puce: "#E8F8DC" }).s);
    }
    function rose(x, y, i) { return "<circle cx='" + f1(x) + "' cy='" + f1(y) + "' r='17' fill='" + R + "'/><path d='M" + f1(x - 6) + " " + f1(y + 14) + " L" + f1(x) + " " + f1(y + 24) + " L" + f1(x + 6) + " " + f1(y + 14) + "Z' fill='" + R + "'/><path d='M" + f1(x - 8) + " " + f1(y - 5) + " h16 M" + f1(x - 8) + " " + f1(y) + " h16 M" + f1(x - 8) + " " + f1(y + 5) + " h10' stroke='#fff' stroke-width='2' stroke-linecap='round'/>"; }
    if (et) {
      var w = Wd - 84, y = top0, ys = [];
      B.forEach(function (b, i) { var h = hTxt(b, w - 36) + 30; dessus += bulle(64, y, w, h, b, i, "g") + rose(26, y + Math.min(h / 2, 46) - 4, i); ys.push(y); y += h + 30; });
      return svgDe("cm-etroit", Wd, y, alt, B, tt.s + "<path d='M26 " + f1(top0 - 10) + " V" + f1(y - 20) + "' stroke='#B8C0CC' stroke-width='3' stroke-dasharray='6 5'/>" + dessus);
    }
    var cw = 300;
    B.forEach(function (b) { b.hh = hTxt(b, cw - 36) + 30; });
    var A = alterne(B, Wd, top0, cw, 26), H = A.H + 20, pts = [];
    A.pos.forEach(function (p, i) { var x = p.cote ? Wd - 30 - cw : 30, ty = p.y + Math.min(p.h / 2, 46); pts.push([p.cote ? x - 16 : x + cw + 16, ty]); dessus += bulle(x, p.y, cw, p.h, B[i], i, p.cote ? "g" : "d"); });
    var d = "M" + f1(Wd / 2) + " " + f1(top0 - 24) + " C" + f1(Wd / 2) + " " + f1(pts[0][1]) + " " + f1(Wd / 2) + " " + f1(pts[0][1]) + " " + f1(pts[0][0]) + " " + f1(pts[0][1]);
    for (var k = 1; k < pts.length; k++) d += " C" + f1(Wd / 2 + (pts[k - 1][0] < Wd / 2 ? 120 : -120)) + " " + f1(pts[k - 1][1]) + " " + f1(Wd / 2 + (pts[k][0] < Wd / 2 ? 120 : -120)) + " " + f1(pts[k][1]) + " " + f1(pts[k][0]) + " " + f1(pts[k][1]);
    s += "<path d='" + d + "' fill='none' stroke='#B8C0CC' stroke-width='3' stroke-dasharray='6 5'/>";
    pts.forEach(function (q, i) { s += "<circle cx='" + f1(q[0]) + "' cy='" + f1(q[1]) + "' r='7' fill='#fff' stroke='#9AA4B6' stroke-width='3'/>"; if (i) { var my = (pts[i - 1][1] + q[1]) / 2; dessus += rose(Wd / 2, my - 6, i - 1 + 1 > 0 ? i : i); } });
    return svgDe("cm-large", Wd, H, alt, B, tt.s + s + dessus);
  }

  /* Tirage d'origine INCHANGÉ (8 formes) : les cartes existantes gardent leur forme. Les formes ajoutées le 24/11/2026
     (« diversifier et enrichir, sans changer ce qui a été fait ») ne remplacent que la radiale tirée au hasard, en alternance. */
  var FORMES = ["radiale", "organigramme", "bulles", "accolade", "alveoles", "roue", "poisson", "arbre"], NOUVELLES = ["ampoule", "livre", "escalier", "fleur", "liege", "tige", "frisev", "arbreinfo", "route", "fourche", "doodle", "blobs", "arc", "onglets", "capsules", "zigzag", "gouttes", "rameaux", "diagonale", "medaillons", "pont", "bouquet", "serpentin"], TOUTES = FORMES.concat(NOUVELLES), STYLES = ["main", "colore", "postit"];
  function hache(t) { var h = 7; for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) % 100003; return h; }

  /* carte = { centre: "Titre\nSous-titre" | [lignes], branches: [{ label, color?, items: [] }] } */
  function VRT_CM(carte) {
    var C = (Array.isArray(carte.centre) ? carte.centre : String(carte.centre || "").split("\n")).map(function (x) { return String(x).trim(); }).filter(Boolean);
    var B = (carte.branches || []).filter(function (b) { return b && ((b.items || []).length || (carte.depuisSchema && b.label)); }).map(function (b, i) {
      return { label: String(b.label || "").trim(), color: /^#[0-9a-f]{6}$/i.test(b.color || "") ? b.color : COUL[i % COUL.length], items: b.items.map(function (x) { return String(x).replace(/\s+/g, " ").trim(); }).filter(Boolean) };
    }).filter(function (b) { return b.items.length || (carte.depuisSchema && b.label); });
    if (!B.length) return "";
    var alt = "Carte mentale : " + C.join(", ") + ". " + B.map(function (b) { return b.label + " : " + b.items.join(" ; "); }).join(". ");
    /* forme et style : imposés par la carte, sinon tirés du titre (stables d'une génération à l'autre et variés d'une carte à l'autre) */
    var hh = hache(C.join(" ")), pal = PALETTES[Math.floor(hh / 13) % PALETTES.length];
    if (!carte.garderCouleurs) B.forEach(function (b, i) { b.color = pal[i % pal.length]; });
    /* « adopte aussi les nouveaux styles » (24/11/2026) : une carte sans rang (schéma converti, carte libre) tire sa forme
       parmi TOUTES les formes, plus seulement les 8 d'origine. */
    var forme = carte.forme || TOUTES[hh % TOUTES.length];
    /* « la diversité continue » (24/11/2026) : une carte qui donne son rang dans une suite (leçons d'une classe et
       d'une matière) tourne sur TOUTES les formes : deux cartes voisines n'ont jamais la même. */
    if (!carte.forme && carte.rang != null && isFinite(carte.rang)) forme = TOUTES[(hache(carte.serie || "") + Math.round(carte.rang)) % TOUTES.length];
    var st = carte.style || STYLES[Math.floor(hh / 7) % STYLES.length];
    var gauche = B.map(function (b) { return /cause|origine|facteur|pourquoi/i.test(b.label) && !/conséquence|effet|impact/i.test(b.label); });
    if (forme === "causes" && (gauche.indexOf(true) < 0 || gauche.indexOf(false) < 0)) forme = "radiale";
    if (forme === "organigramme" && B.length > 5) forme = "radiale";
    var n = ++NUM, h = "", cp = function () { return B.map(function (b) { return Object.assign({}, b); }); };
    if (st === "ardoise" && !carte.garderCouleurs) B.forEach(function (b, i) { b.color = ["#FFD166", "#FF8FA3", "#8BE9FD", "#B9F18C", "#FFB86B", "#D0A9FF"][i % 6]; });
    STYLE = st;
    P = "cm" + n + "a";
    h += forme === "organigramme" ? arbre(C, cp(), alt) : forme === "diagonale" ? diagonale(C, cp(), alt, 920) : forme === "medaillons" ? medaillons(C, cp(), alt, 920) : forme === "pont" ? pont(C, cp(), alt, 920) : forme === "bouquet" ? bouquet(C, cp(), alt, 920) : forme === "serpentin" ? serpentin(C, cp(), alt, 920) : forme === "onglets" ? onglets(C, cp(), alt, 920) : forme === "capsules" ? capsules(C, cp(), alt, 920) : forme === "zigzag" ? zigzag(C, cp(), alt, 920) : forme === "gouttes" ? gouttes(C, cp(), alt, 920) : forme === "rameaux" ? rameaux(C, cp(), alt, 920) : forme === "tige" ? tige(C, cp(), alt, 920) : forme === "frisev" ? frisev(C, cp(), alt, 920) : forme === "arbreinfo" ? arbreInfo(C, cp(), alt, 920) : forme === "route" ? route(C, cp(), alt, 920) : forme === "fourche" ? fourche(C, cp(), alt, 920) : forme === "doodle" ? doodle(C, cp(), alt, 920) : forme === "blobs" ? blobs(C, cp(), alt, 920) : forme === "arc" ? arc(C, cp(), alt, 920) : forme === "livre" ? livre(C, cp(), alt, 920) : forme === "escalier" ? escalier(C, cp(), alt, 920) : forme === "fleur" ? fleur(C, cp(), alt, 920) : forme === "liege" ? liege(C, cp(), alt, 920) : forme === "ampoule" ? ampoule(C, cp(), alt, 920) : forme === "roue" ? roue(C, cp(), alt, 920) : forme === "poisson" ? poisson(C, cp(), alt, 920) : forme === "arbre" ? arbreDessin(C, cp(), alt, 920) : forme === "frise" ? frise(C, cp(), alt, 920) : forme === "bulles" ? bulles(C, cp(), alt) : forme === "accolade" ? accolade(C, cp(), alt) : forme === "alveoles" ? alveoles(C, cp(), alt, 920) : forme === "flux" ? flux(C, cp(), alt, 920) : forme === "causes" ? causes(C, cp(), alt, 920, gauche) : large(C, cp(), alt);
    P = "cm" + n + "b";
    h += forme === "diagonale" ? diagonale(C, cp(), alt, 400) : forme === "medaillons" ? medaillons(C, cp(), alt, 400) : forme === "pont" ? pont(C, cp(), alt, 400) : forme === "bouquet" ? bouquet(C, cp(), alt, 400) : forme === "serpentin" ? serpentin(C, cp(), alt, 400) : forme === "onglets" ? onglets(C, cp(), alt, 400) : forme === "capsules" ? capsules(C, cp(), alt, 400) : forme === "zigzag" ? zigzag(C, cp(), alt, 400) : forme === "gouttes" ? gouttes(C, cp(), alt, 400) : forme === "rameaux" ? rameaux(C, cp(), alt, 400) : forme === "tige" ? tige(C, cp(), alt, 400) : forme === "frisev" ? frisev(C, cp(), alt, 400) : forme === "arbreinfo" ? arbreInfo(C, cp(), alt, 400) : forme === "route" ? route(C, cp(), alt, 400) : forme === "fourche" ? fourche(C, cp(), alt, 400) : forme === "doodle" ? doodle(C, cp(), alt, 400) : forme === "blobs" ? blobs(C, cp(), alt, 400) : forme === "arc" ? arc(C, cp(), alt, 400) : forme === "livre" ? livre(C, cp(), alt, 400) : forme === "escalier" ? escalier(C, cp(), alt, 400) : forme === "fleur" ? fleur(C, cp(), alt, 400) : forme === "liege" ? liege(C, cp(), alt, 400) : forme === "ampoule" ? ampoule(C, cp(), alt, 400) : forme === "roue" ? roue(C, cp(), alt, 400) : forme === "poisson" ? poisson(C, cp(), alt, 400) : forme === "arbre" ? arbreDessin(C, cp(), alt, 400) : forme === "frise" ? frise(C, cp(), alt, 400) : forme === "bulles" ? bullesEtroit(C, cp(), alt) : forme === "accolade" ? accoladeEtroit(C, cp(), alt) : forme === "alveoles" ? alveoles(C, cp(), alt, 400) : forme === "flux" ? flux(C, cp(), alt, 400) : forme === "causes" ? causes(C, cp(), alt, 400, gauche) : etroit(C, cp(), alt);
    STYLE = "main";
    return "<div class='cm cm-" + forme + " cm-s-" + st + "' data-forme='" + forme + "'>" + h + "</div>";
  }

  /* carte d'une leçon : une branche par partie (hors entraînement), les mots tirés de « à retenir »
     (coupé aux « ; » et aux phrases), à défaut des titres en gras de la partie. */
  function nu(h) { return String(h || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;|&rsquo;/g, "’").replace(/&quot;/g, "\"").replace(/\s+/g, " ").trim(); }
  /* « av. J.-C. », « apr. J.-C. », « env. », « ex. » : le point d'une abréviation n'est pas une fin de phrase */
  function abrev(t) { return String(t).replace(/(^|[\s(])(av|apr|env|ex|cf|vol|chap|fig|doc|M)\.(?=\s)/g, "$1$2\u0002"); }
  function rabrev(t) { return String(t).replace(/\u0002/g, "."); }
  function morceaux(r) {
    var t = abrev(nu(r).replace(/^Savoir-être[^:]*:\s*/i, "")), m = t.replace(/([.!?])\s+(?=[A-ZÀ-Ý«]|\d+ (?:et|ou|à) \d)/g, "$1\u0001").split(/\s*;\s*|\u0001/).map(function (x) { return rabrev(x).replace(/([^C])[.]\s*$/, "$1").trim(); }).filter(function (x) { return x.length > 1; });
    return m.length ? m : (t ? [t] : []);
  }
  /* 19/11/2026 « carte mentale mal sortie » : une branche ne gardait qu'un mot en gras (« effet photoélectrique »).
     Chaque branche reçoit maintenant 2 à 4 idées tirées de la partie, dans cet ordre : formules encadrées,
     définitions « terme : sens », « à retenir », puis les premières phrases du cours, raccourcies à la virgule. */
  var ETIQ = /^(Définitions?|Propriétés?|Théorèmes?|Méthodes?|Exemples?|Remarques?|Retiens|Attention|Astuces?|Le savais-tu|À retenir|Règles?|Formules?|Vocabulaire|Rappels?|Conseils?)\b/i;
  function court(t, n) {
    t = t.replace(/([A-Za-zλν])_(?=[a-z0-9])/g, "$1").replace(/[.;:]\s*$/, function (m, i, ch) { return /J\.-C$/.test(ch.slice(0, i)) ? "." : ""; }).replace(/\s+/g, " ").trim(); n = n || 92;
    /* guillemets orphelins laissés par la coupe des phrases (« … ». « … ») */
    t = t.replace(/^[»\s;,]+/, "").replace(/[«\s;,]+$/, "").trim();
    if ((t.match(/«/g) || []).length > (t.match(/»/g) || []).length) t = t.replace(/«\s*(?!.*«)/, "");
    if ((t.match(/»/g) || []).length > (t.match(/«/g) || []).length) t = t.replace(/\s*»(?!.*»)/, "");
    if (t.length <= n) return t;
    var v = t.lastIndexOf(", ", n); if (v >= 32) return t.slice(0, v);
    var e = t.lastIndexOf(" ", n - 1), c = t.slice(0, e > 20 ? e : n - 1);
    /* pas de coupe sur un petit mot (« …diviseurs et », « …vaincre la ») */
    for (var k = 0; k < 3; k++) c = c.replace(/[\s,;:]+(et|ou|de|du|des|la|le|les|l['’]|d['’]|à|au|aux|en|par|pour|sur|un|une|que|qui)$/i, "");
    /* parenthèse ouverte par la coupe : on coupe avant elle */
    var po = c.lastIndexOf("(");
    if (po > 20 && c.indexOf(")", po) < 0) c = c.slice(0, po).replace(/[\s,;:]+$/, "");
    return c + "…";
  }
  function idees(p) {
    var h = String(p.html || "").replace(/<(details|table|svg|figure|script|style)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<(b|strong)>\s*([^<]{0,30})<\/\1>/gi, function (m, t, x) { return ETIQ.test(x.trim()) ? " " : m; });
    var forms = [], defs = [], autres = [];
    h = h.replace(/<(p|div|span)\b[^>]*class=['"][^'"]*\bformule\b[^'"]*['"][^>]*>([\s\S]*?)<\/\1>/gi, function (m, t, x) { var f = nu(x); if (f.length > 2 && f.length <= 70) forms.push(court(f)); return " \u0002 "; });
    /* une phrase par bloc : on coupe aux fins de blocs et aux fins de phrases */
    var blocs = h.replace(/<\/(p|li|div|h[1-6]|dd|dt)>|<br\s*\/?>/gi, "\u0002").split("\u0002");
    blocs.forEach(function (bl) {
      var gras = (bl.match(/<(?:strong|b)>([^<]{3,60})<\/(?:strong|b)>/g) || []).map(nu).filter(function (x) { return x.split(" ").length <= 5 && !ETIQ.test(x); });
      var tx = nu(bl);
      /* intertitre en gras collé au texte (« Raisonnement L'ovule… ») : c'est une étiquette, pas une idée */
      gras.forEach(function (x) { if (tx.indexOf(x) === 0 && /^\s+[A-ZÀ-Ý«0-9]/.test(tx.slice(x.length))) { tx = tx.slice(x.length).trim(); gras = gras.filter(function (y) { return y !== x; }); } });
      abrev(tx).replace(/([.!?])\s+(?=[A-ZÀ-Ý«]|\d+ (?:et|ou|à) \d)/g, "$1\u0001").split("\u0001").forEach(function (ph) {
        ph = rabrev(ph);
        ph = ph.trim(); if (ph.length < 12 || /\?$/.test(ph) || /^(le |les )?(documents?|doc\.?|figure|tableau|planche|schéma)\s*\d/i.test(ph)) return;
        /* « terme : sens » seulement si le mot en gras ouvre la phrase et qu'elle le définit */
        var g = gras.filter(function (x) { var i = ph.indexOf(x); return i >= 0 && /^(l['’]|les?|la|une?|des|du)?$/i.test(ph.slice(0, i).trim()); })[0];
        var reste = g ? ph.slice(ph.indexOf(g) + g.length) : "", m = /^\s*(?:\([^)]*\)\s*|[^\s,:]{1,4}\s+(?=vérifie|est\b|vaut|mesure))?(?::|–|—|,?\s*(?:est|sont|désignent?|signifie|correspond à|consiste à|vérifie|vaut|permet de|sert à|mesure|représente)\b)\s*/i.exec(reste);
        if (g && m && reste.length - m[0].length > 6) {
          var verbe = /vérifie|vaut|permet|sert|mesure|représente/i.test(m[0]) ? m[0].trim().replace(/^[,:\s]+/, "") + " " : "";
          defs.push(court(g.charAt(0).toUpperCase() + g.slice(1) + " : " + verbe + reste.slice(m[0].length), 110));
        } else if (ph.split(" ").length >= 5 || /[=≈]/.test(ph)) autres.push({ t: court(ph), eq: /[=≈<>≤≥→]/.test(ph) });
      });
    });
    var ret = p.retenir ? morceaux(p.retenir).map(function (x) { return court(x); }) : [];
    autres.sort(function (x, y) { return (y.eq ? 1 : 0) - (x.eq ? 1 : 0); });
    var tout = ret.length >= 3 ? ret : forms.concat(defs, ret, autres.slice(0, 3).map(function (o) { return o.t; })), it = [], vus = [];
    tout.forEach(function (x) {
      var k = x.toLowerCase().replace(/[^a-z0-9à-ÿ=]+/g, "");
      if (!k || it.length >= 4 || vus.some(function (v) { return v.indexOf(k) >= 0 || k.indexOf(v) >= 0; })) return;
      vus.push(k); it.push(x);
    });
    return it;
  }
  function VRT_CM_LECON(L) {
    if (!L || !L.parties) return "";
    var B = [];
    L.parties.forEach(function (p) {
      if (p.verrou || /entraînement|entrainement|intégration|exercices?\b/i.test(p.t || "")) return;
      var it = idees(p);
      if (it.length) B.push({ label: court(nu(p.t).replace(/^\d+\.\s*/, ""), 60).replace(/…$/, ""), items: it });
    });
    if (B.length < 2) return "";
    /* forme selon le contenu : étapes → flux ; causes et conséquences → multi-flux ; sinon variée selon le titre */
    var lab = B.map(function (b) { return b.label; }).join(" | "), forme = /étape|méthode|démarche|procédure|phase/i.test(lab) ? "flux" : (B.some(function (b) { return /cause|origine/i.test(b.label) && !/conséquence|effet|impact/i.test(b.label); }) && B.some(function (b) { return /conséquence|effet|impact/i.test(b.label) && !/cause|origine/i.test(b.label); })) ? "causes" : /hist/i.test(L.m || "") || /\b1[0-9]{3}\b|siècle/.test(lab) ? "frise" : null;
    var rg = L.ordre != null ? L.ordre : L.rang;
    /* rang = position de la leçon dans sa série (classe/matière) quand le catalogue est chargé : deux voisines ne tombent jamais sur la même forme, même si leurs numéros d'ordre sont éloignés */
    var CAT = typeof window !== "undefined" && window.VRT_LECONS;
    if (CAT && rg != null && isFinite(rg)) { var pos = 0; for (var k in CAT) { var Q = CAT[k]; if (Q && Q.c === L.c && Q.m === L.m) { var q = Q.ordre != null ? Q.ordre : Q.rang; if (q != null && isFinite(q) && (q < rg || (q === rg && k < (L.id || "")))) pos++; } } rg = pos; }
    /* histoire : la frise une leçon sur deux, la rotation sur les autres (« la diversité continue ») */
    if (forme === "frise" && rg != null && isFinite(rg) && Math.round(rg) % 2 === 1) forme = null;
    return VRT_CM({ centre: [nu(L.titre || L.cle)].concat(L.c ? [L.c] : []), branches: B.slice(0, 6), forme: forme, rang: rg, serie: (L.c || "") + "/" + (L.m || "") });
  }
  VRT_CM.lecon = VRT_CM_LECON;
  /* ════════ SCHÉMAS EN CARTES MENTALES (18/11/2026, « change en vraies cartes mentales esthétiques ») ════════
     Les schémas des leçons (p.illus.svg, générés hors dépôt : titre, cadres, titres en gras, listes à puces, notes,
     flèches) sont relus dans le navigateur et redessinés en carte mentale. Un schéma non reconnu reste tel quel. */
  function depuisSvg(src) {
    if (typeof DOMParser === "undefined" || !src) return "";
    try {
      var doc = new DOMParser().parseFromString(src, "image/svg+xml"), root = doc.documentElement;
      if (!root || root.nodeName.toLowerCase() !== "svg" || doc.getElementsByTagName("parsererror").length) return "";
      var vb = (root.getAttribute("viewBox") || "0 0 480 312").split(/[\s,]+/).map(Number), Wv = vb[2] || 480, Hv = vb[3] || 312;
      function n(e, a) { return +(e.getAttribute(a) || 0); }
      var boites = [].slice.call(root.getElementsByTagName("rect")).map(function (r) { return { x: n(r, "x"), y: n(r, "y"), w: n(r, "width"), h: n(r, "height"), t: [] }; })
        .filter(function (r) { return r.w > 24 && r.h > 12 && r.w < Wv * .96; });
      /* seulement les schémas en cadres : pas de courbe, de tracé, de quadrillage, d'ellipse ni de dessin */
      var chemins = [].slice.call(root.getElementsByTagName("path")).map(function (e) { return e.getAttribute("d") || ""; });
      if (chemins.some(function (d) { return /[CcQqAaSsTt]/.test(d) || (d.match(/[LlHhVv]/g) || []).length > 3; })) return "";
      if (chemins.length > boites.length * 2 + 6) return "";
      if (["ellipse", "polygon", "polyline", "image", "use"].some(function (t) { return root.getElementsByTagName(t).length; })) return "";
      var grandsRonds = [].slice.call(root.getElementsByTagName("circle")).filter(function (c) { return n(c, "r") >= 18; }).length;
      if ((root.getElementsByTagName("line").length > 4 && !grandsRonds) || root.getElementsByTagName("circle").length > 1) return "";
      /* tableaux, échelles et grilles : leurs lignes et colonnes ont un sens, on les garde */
      if (/^(Tableau|Table |Échiquier|Échelle|Les \d+ premiers éléments|Comparaison entre)/i.test(root.getAttribute("aria-label") || "")) return "";
      /* grille de pixels (≥ 6 petits carrés) ou tableau (≥ 6 lignes de même taille empilées dans une même colonne) */
      var tous = [].slice.call(root.getElementsByTagName("rect")).map(function (r) { return { x: n(r, "x"), w: n(r, "width"), h: n(r, "height") }; });
      if (tous.filter(function (b) { return b.w < 24 && b.h < 24 && b.w > 0; }).length >= 6) return "";
      var formats = {}; tous.filter(function (b) { return b.w >= 24 && b.w < Wv * .96; }).forEach(function (b) { var k = Math.round(b.x) + ":" + Math.round(b.w) + "x" + Math.round(b.h); formats[k] = (formats[k] || 0) + 1; });
      if (Object.keys(formats).some(function (k) { return formats[k] >= 5; })) return "";
      var ronds = [].slice.call(root.getElementsByTagName("circle")).map(function (c) { return { cx: n(c, "cx"), cy: n(c, "cy"), r: n(c, "r"), t: [] }; }).filter(function (c) { return c.r >= 18; });
      var titre = "", libres = [], textes = [].slice.call(root.getElementsByTagName("text"));
      if (textes.length < 4) return "";
      textes.forEach(function (t) {
        var x = n(t, "x"), y = n(t, "y"), fs = +(t.getAttribute("font-size") || 10), g = /600|700|800|900|bold/.test(t.getAttribute("font-weight") || ""), an = t.getAttribute("text-anchor") || "start", lignes = [];
        var propre = ""; [].slice.call(t.childNodes).forEach(function (c) { if (c.nodeType === 3) propre += c.nodeValue; });
        var brutes = []; if (propre.trim()) brutes.push(propre.trim());
        [].slice.call(t.getElementsByTagName("tspan")).forEach(function (s) { var v = (s.textContent || "").trim(); if (v) brutes.push(v); });
        /* une ligne coupée continue la précédente ; seule une puce (•, –) ouvre un nouvel élément */
        brutes.forEach(function (v, k) { if (k && !/^[•·–\-]\s/.test(v)) lignes[lignes.length - 1] += " " + v; else lignes.push(v); });
        if (!lignes.length || fs < 7.6 || /^Schéma VÉRITAS$/.test(lignes[0])) return;
        var lg = Math.max.apply(null, brutes.map(function (l) { return l.length; })) * fs * .5, cx = an === "middle" ? x : an === "end" ? x - lg / 2 : x + lg / 2;
        var T = { x: cx, y: y, g: g, fs: fs, l: lignes, br: brutes, lmax: Math.max.apply(null, brutes.map(function (v) { return v.length; })) };
        if (!titre && y < 28 && g) { titre = lignes.join(" "); return; }
        if (/^[\d\s,.\-−+%°]+$/.test(lignes.join(" "))) return;
        var rd = ronds.filter(function (c) { return Math.hypot(cx - c.cx, y - 3 - c.cy) < c.r; })[0];
        if (rd) { rd.t.push(T); return; }
        var dans = boites.filter(function (b) { return cx >= b.x - 2 && cx <= b.x + b.w + 2 && y - 3 >= b.y && y - 3 <= b.y + b.h; }).sort(function (a, b) { return a.w * a.h - b.w * b.h; })[0];
        if (dans) dans.t.push(T); else libres.push(T);
      });
      var net = function (s) { return String(s).replace(/^[•·\-–]\s*/, "").replace(/\s+/g, " ").trim(); };
      var B = [];
      boites.filter(function (b) { return b.t.length; }).forEach(function (b) {
        b.t.sort(function (p, q) { return p.y - q.y; });
        var tout = [].concat.apply([], b.t.map(function (t) { return t.l.map(function (l) { return { v: l, g: t.g }; }); })), label, items;
        if (b.t.length === 1 && b.t[0].g) { label = net(b.t[0].br.join(" ")); items = []; }
        else if (b.t.length === 1 && b.t[0].br.length >= 2 && !/^[•·–\-]/.test(b.t[0].br[1])) {
          /* texte normal sur plusieurs lignes : une ligne terminée par « : » appelle la suivante */
          var L2 = []; b.t[0].br.forEach(function (v) { if (L2.length && /:\s*$/.test(L2[L2.length - 1])) L2[L2.length - 1] += " " + v; else L2.push(v); });
          var m0 = L2[0].match(/^(.{3,40}?)\s*:\s*(.+)$/);
          if (m0) { label = net(m0[1]); items = [net(m0[2])].concat(L2.slice(1).map(net)); } else { label = net(L2[0]); items = L2.slice(1).map(net); }
        }
        else if (tout.length === 1) { label = net(tout[0].v); items = []; }
        else if (b.t[0].g || b.t.length > 1) { label = net(b.t[0].l.join(" ")); items = [].concat.apply([], b.t.slice(1).map(function (t) { return t.l; })).map(net); }
        else { label = net(tout[0].v); items = tout.slice(1).map(function (o) { return net(o.v); }); }
        B.push({ label: label, items: items, x: b.x + b.w / 2, y: b.y, bas: b.y + b.h, b: b });
      });
      /* textes libres sous un cadre : ses explications ; les autres : à retenir */
      var notes = [];
      libres.sort(function (p, q) { return p.y - q.y; }).forEach(function (t) {
        var lt = t.lmax * t.fs * .5;
        var br = B.filter(function (o) { return o.b && t.y > o.bas && t.y - o.bas < 64 && Math.abs(t.x - o.x) < o.b.w * .35 + 6 && lt < o.b.w * 1.4; }).sort(function (p, q) { return (t.y - p.bas) - (t.y - q.bas); })[0];
        if (br) br.items = br.items.concat(t.l.map(net)); else notes.push(t.l.map(net).join(" "));
      });
      B.forEach(function (o) {
        if (o.items.length) return;
        var m = o.label.match(/^(.{3,40}?)\s*:\s*(.{3,})$/), p = o.label.match(/^(.{2,40}?)\s*\(([^)]{2,40})\)$/);
        if (m) { o.label = m[1]; o.items = [m[2]]; } else if (p) { o.label = p[1]; o.items = [p[2]]; }
      });
      if (notes.length) B.push({ label: "À retenir", items: notes });
      if (B.length < 2) return "";
      var C = [titre || (ronds[0] && ronds[0].t.length ? [].concat.apply([], ronds[0].t.map(function (t) { return t.l; })).join(" ") : "Schéma")];
      /* forme : une suite de cadres alignés reliés par des flèches → flux ; un rond central → radiale */
      var avecB = B.filter(function (o) { return o.b; }), lig = [];
      avecB.forEach(function (o) { var g = avecB.filter(function (q) { return Math.abs(q.y - o.y) < 8; }); if (g.length > lig.length) lig = g; });
      lig.sort(function (p, q) { return p.x - q.x; });
      var segs = [].slice.call(root.getElementsByTagName("path")).map(function (e) { var m = (e.getAttribute("d") || "").match(/^M\s*([\d.]+)[\s,]+([\d.]+)\s*L\s*([\d.]+)[\s,]+([\d.]+)/); return m ? m.slice(1).map(Number) : null; }).filter(Boolean);
      var liens = 0;
      for (var q = 0; q + 1 < lig.length; q++) { var A = lig[q].b, Bq = lig[q + 1].b; if (segs.some(function (g) { return Math.abs(g[1] - g[3]) < 4 && g[0] >= A.x + A.w - 12 && g[2] <= Bq.x + 12; })) liens++; }
      var memeLigne = lig.length >= 3 && liens >= Math.ceil((lig.length - 1) / 2);
      var fleches = root.getElementsByTagName("path").length >= lig.length - 1, forme = memeLigne && fleches ? "flux" : ronds.length ? "radiale" : null;
      if (memeLigne) B = lig.sort(function (p, q) { return p.x - q.x; }).concat(B.filter(function (o) { return lig.indexOf(o) < 0; }));
      if (typeof document !== "undefined" && !document.getElementById("cmCss")) { var st = document.createElement("style"); st.id = "cmCss"; st.textContent = VRT_CM.css; document.head.appendChild(st); }
      return VRT_CM({ centre: C, branches: B.map(function (o) { return { label: o.label, items: o.items }; }), forme: forme, depuisSchema: true });
    } catch (e) { return ""; }
  }
  VRT_CM.depuisSvg = depuisSvg;

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
