/* VÉRITAS — cartes mentales dessinées (18/11/2026, « de vraies cartes mentales », « embellis plus »).
   Un nuage au centre, des flèches courbes vers chaque branche, des étiquettes entourées à main levée et numérotées,
   les mots reliés en éventail, en italique, sur fond de cahier pointé.
   Deux dessins dans le même bloc : en étoile (écran large) et en arbre (téléphone), basculés en CSS (.cm-large / .cm-etroit).
   Utilisé par les leçons (VRT_CM_LECON : carte de la leçon tirée des parties et de « à retenir ») et par
   tools/oeuvres_statiques.js (pages d'œuvres), qui charge ce fichier sous Node. Aucune dépendance. */
(function (W) {
  "use strict";
  var NUM = 0, P = "cm", COUL = ["#E0475B", "#0E9AA7", "#7B4FC4", "#E07B1F", "#2E9A5B", "#1E6FD0", "#C2387A"];
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function f1(v) { return Math.round(v * 10) / 10; }
  function couper(s, n) {
    var mots = String(s).replace(/\s+([»:;!?])/g, "\u00a0$1").replace(/«\s+/g, "«\u00a0").split(/[ \t\n\r]+/), l = [], c = "";
    mots.forEach(function (m) { if (c && (c + " " + m).length > n) { l.push(c); c = m; } else c = c ? c + " " + m : m; });
    if (c) l.push(c);
    return l;
  }
  function clair(hex, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    return "rgb(" + [r, g, b].map(function (v) { return Math.round(v + (255 - v) * k); }).join(",") + ")";
  }
  function texte(x, y, lignes, o) {
    var s = "<text x='" + f1(x) + "' y='" + f1(y) + "' text-anchor='" + (o.a || "start") + "' font-size='" + o.t + "' font-style='italic' fill='#2E3445'>";
    lignes.forEach(function (l, i) { s += "<tspan x='" + f1(x) + "' dy='" + (i ? f1(o.t * 1.24) : 0) + "'>" + esc(l) + "</tspan>"; });
    return s + "</text>";
  }
  /* boucle tracée à main levée autour d'une étiquette (ellipse qui déborde un peu de son point de départ) */
  function boucle(cx, cy, rx, ry, col, graine) {
    var d = "", t, k = 0;
    for (t = -0.5; t <= 2 * Math.PI + 0.3; t += 0.16, k++) {
      var j = 1 + 0.045 * Math.sin(3 * t + graine) + 0.02 * Math.cos(5 * t + graine * 2), sp = t > 2 * Math.PI - 0.2 ? 1.06 : 1;
      d += (k ? "L" : "M") + f1(cx + rx * j * sp * Math.cos(t)) + " " + f1(cy + ry * j * sp * Math.sin(t));
    }
    return "<path d='" + d + "' fill='" + clair(col, .9) + "' stroke='" + col + "' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'/>";
  }
  function etiquette(cx, cy, t, col, n, max) {
    var L = t.length > (max || 99) ? couper(t, Math.ceil(t.length / 2) + 2) : [t], ry = L.length > 1 ? 31 : 21;
    var w = Math.round(Math.max.apply(null, L.map(function (l) { return l.length; })) * 9.2 + 40), s = "<g class='cm-h'>" + boucle(cx, cy, w / 2, ry, col, n * 1.7);
    L.forEach(function (l, k) { s += "<text x='" + f1(cx) + "' y='" + f1(cy + 5.5 + (k - (L.length - 1) / 2) * 19) + "' text-anchor='middle' font-size='16' font-weight='800' fill='" + col + "'>" + esc(l) + "</text>"; });
    s += "<circle cx='" + f1(cx - w / 2 + 6) + "' cy='" + f1(cy - ry + 2) + "' r='11.5' fill='" + col + "' stroke='#fff' stroke-width='2'/>" +
      "<text x='" + f1(cx - w / 2 + 6) + "' y='" + f1(cy - ry + 6.5) + "' text-anchor='middle' font-size='13' font-weight='800' fill='#fff'>" + n + "</text></g>";
    return { s: s, w: w, h: ry * 2 };
  }
  /* nuage central : contour en festons autour d'une ellipse */
  function nuage(cx, cy, lignes, w) {
    var h = 26 + lignes.length * 21, a = w / 2 + 16, b = h / 2 + 16, n = 11, pts = [], i, d;
    for (i = 0; i <= n; i++) { var u = -Math.PI / 2 + 2 * Math.PI * i / n; pts.push([cx + a * Math.cos(u), cy + b * Math.sin(u)]); }
    d = "M" + f1(pts[0][0]) + " " + f1(pts[0][1]);
    for (i = 1; i <= n; i++) { var c = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) * 0.62; d += "A" + f1(c) + " " + f1(c) + " 0 0 1 " + f1(pts[i][0]) + " " + f1(pts[i][1]); }
    var s = "<g class='cm-c'><path d='" + d + "Z' fill='#001136' opacity='.12' transform='translate(3 5)'/>" +
      "<path d='" + d + "Z' fill='url(#" + P + "g)' stroke='#fff' stroke-width='2.5'/>";
    lignes.forEach(function (l, k) {
      s += "<text x='" + f1(cx) + "' y='" + f1(cy - h / 2 + 31 + k * 21) + "' text-anchor='middle' font-size='" + (k ? 13.5 : 19) + "' font-weight='" + (k ? 600 : 800) + "' fill='" + (k ? "#FFE08A" : "#fff") + "'>" + esc(l) + "</text>";
    });
    return { s: s + "</g>", h: h, a: a, b: b };
  }
  function largeurC(C, min, max) { return Math.min(max || 999, Math.max(min, Math.round(Math.max.apply(null, C.map(function (l, i) { return l.length * (i ? 7.8 : 11.2); })) + 30))); }
  function defs(B) {
    return "<defs><linearGradient id='" + P + "g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#3D5BD8'/><stop offset='.55' stop-color='#2A2F9E'/><stop offset='1' stop-color='#0C1F55'/></linearGradient>" +
      "<pattern id='" + P + "q' width='18' height='18' patternUnits='userSpaceOnUse'><circle cx='9' cy='9' r='1.1' fill='#DCE3EF'/></pattern>" +
      B.map(function (b, i) { return "<marker id='" + P + "f" + i + "' markerWidth='12' markerHeight='12' refX='8' refY='6' orient='auto' markerUnits='userSpaceOnUse'><path d='M1 1.5L10 6L1 10.5' fill='none' stroke='" + b.color + "' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/></marker>"; }).join("") + "</defs>";
  }
  function fond(Wd, H) { return "<rect width='" + Wd + "' height='" + Math.round(H) + "' rx='18' fill='#FCFDFF'/><rect width='" + Wd + "' height='" + Math.round(H) + "' rx='18' fill='url(#" + P + "q)'/>"; }

  /* écran large : en étoile, branches paires à gauche, impaires à droite */
  function large(C, B, alt) {
    var Wd = 920, cx = 460, T = 15, LH = T * 1.24, NC = 16, cotes = [[], []];
    B.forEach(function (b, i) { b.n = i + 1; b.i = i; cotes[i % 2].push(b); });
    function bloc(b) { var h = 0; b.items.forEach(function (it) { h += couper(it, NC).length * LH + 14; }); return Math.max(h, 70) + 28; }
    var hauts = cotes.map(function (c) { return c.reduce(function (a, b) { return a + bloc(b); }, 0); });
    var cw = largeurC(C, 180, 260), H = Math.max(hauts[0], hauts[1], 300) + 40, cy = H / 2, s = "", dessus = "";
    var cen = nuage(cx, cy, C, cw);
    cotes.forEach(function (liste, cote) {
      var sg = cote ? 1 : -1, col0 = cx + sg * 248, y0 = (H - hauts[cote]) / 2;
      liste.forEach(function (b) {
        var h = bloc(b), hy = y0 + h / 2, col = b.color, ly = y0 + 14, hmax = h / 2;
        var et = etiquette(0, 0, b.label, col, b.n, 17), w = et.w, ox = col0 - sg * 44, hx = ox - sg * w / 2, ix = hx - sg * w / 2;
        /* étiquette qui mordrait sur le nuage : on la monte (ou descend) au-dessus de lui */
        if (Math.abs(ix - cx) < cen.a + 18 && Math.abs(hy - cy) < cen.b + et.h / 2 + 8) hy = cy + (hy > cy + 1 ? 1 : -1) * (cen.b + et.h / 2 + 10);
        var th = Math.atan2((hy - cy) / cen.b, (ix - cx) / cen.a), sx = cx + cen.a * Math.cos(th), sy = cy + cen.b * Math.sin(th), ex = ix - sg * 10;
        s += "<path class='cm-t' d='M" + f1(sx) + " " + f1(sy) + " C" + f1(sx + (ex - sx) * 0.25) + " " + f1(sy + (hy - sy) * 0.85) + " " + f1(ex - sg * 40) + " " + f1(hy) + " " + f1(ex) + " " + f1(hy) + "' fill='none' stroke='" + col + "' stroke-width='3.4' stroke-linecap='round' marker-end='url(#" + P + "f" + b.i + ")'/>";
        b.items.forEach(function (it) {
          var L = couper(it, NC), hh = L.length * LH, my = ly + hh / 2 - 4, d = (my - hy) / hmax, dx = col0 - sg * 26 * d * d;
          s += "<path class='cm-l' d='M" + f1(ox) + " " + f1(hy) + " Q" + f1(ox + (dx - ox) * 0.55) + " " + f1(my) + " " + f1(dx) + " " + f1(my) + "' fill='none' stroke='" + clair(col, .3) + "' stroke-width='1.8' stroke-linecap='round'/>" +
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
    var cen = nuage(200, 0, C, largeurC(C, 240, 330)), haut = cen.h / 2 + cen.b - cen.h / 2 + 22, y = haut + cen.b + 30, s = "", dessus = "", avant = haut + cen.b;
    B.forEach(function (b, i) {
      var col = b.color, et = etiquette(0, 0, b.label, col, i + 1), hy = y + 22, hx = 52 + et.w / 2;
      s += "<path class='cm-t' d='M" + tronc + " " + f1(avant) + " V" + f1(hy) + "' stroke='#C3CBDA' stroke-width='3' stroke-dasharray='2 7' stroke-linecap='round' fill='none'/>" +
        "<path class='cm-t' d='M" + tronc + " " + f1(hy) + " H" + f1(hx - et.w / 2 - 10) + "' stroke='" + col + "' stroke-width='3' fill='none' stroke-linecap='round' marker-end='url(#" + P + "f" + i + ")'/>";
      var ly = hy + 38;
      avant = hy;
      b.items.forEach(function (it) {
        var L = couper(it, NC), hh = L.length * LH, my = ly + 4;
        s += "<path class='cm-l' d='M" + (tronc + 22) + " " + f1(hy + 16) + " Q" + (tronc + 22) + " " + f1(my) + " 58 " + f1(my) + "' fill='none' stroke='" + clair(col, .3) + "' stroke-width='1.8'/>" +
          "<circle class='cm-p' cx='64' cy='" + f1(my) + "' r='5' fill='" + col + "' stroke='#fff' stroke-width='1.6'/>" + texte(78, my + 5, L, { t: T });
        ly += hh + 12;
      });
      dessus += "<circle cx='" + tronc + "' cy='" + f1(hy) + "' r='6' fill='" + col + "'/><g transform='translate(" + f1(hx) + " " + f1(hy) + ")'>" + et.s + "</g>";
      y = ly + 18;
    });
    var cs = "<g transform='translate(0 " + f1(haut) + ")'>" + cen.s + "</g>";
    return "<svg class='cm-etroit' viewBox='0 0 " + Wd + " " + Math.round(y) + "' role='img' aria-label='" + esc(alt) + "' font-family='Poppins,Inter,Roboto,Arial,sans-serif'>" + defs(B) + fond(Wd, y) + s + dessus + cs + "</svg>";
  }

  /* carte = { centre: "Titre\nSous-titre" | [lignes], branches: [{ label, color?, items: [] }] } */
  function VRT_CM(carte) {
    var C = (Array.isArray(carte.centre) ? carte.centre : String(carte.centre || "").split("\n")).map(function (x) { return String(x).trim(); }).filter(Boolean);
    var B = (carte.branches || []).filter(function (b) { return b && (b.items || []).length; }).map(function (b, i) {
      return { label: String(b.label || "").trim(), color: /^#[0-9a-f]{6}$/i.test(b.color || "") ? b.color : COUL[i % COUL.length], items: b.items.map(function (x) { return String(x).replace(/\s+/g, " ").trim(); }).filter(Boolean) };
    }).filter(function (b) { return b.items.length; });
    if (!B.length) return "";
    var alt = "Carte mentale : " + C.join(", ") + ". " + B.map(function (b) { return b.label + " : " + b.items.join(" ; "); }).join(". ");
    var n = ++NUM, h = "";
    P = "cm" + n + "a"; h += large(C, B.map(function (b) { return Object.assign({}, b); }), alt);
    P = "cm" + n + "b"; h += etroit(C, B, alt);
    return "<div class='cm'>" + h + "</div>";
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
    return VRT_CM({ centre: [nu(L.cle || L.titre)].concat(L.c ? [L.c] : []), branches: B.slice(0, 6) });
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
