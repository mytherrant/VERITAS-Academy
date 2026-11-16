/* VÉRITAS · Apprendre — planches en 3D (16/11/2026)
   Un petit moteur SVG, sans bibliothèque : l'élève fait tourner l'objet au doigt ou à la souris,
   écarte les couches (vue éclatée) et lit les légendes qui suivent l'objet.

   Modèle (dans une leçon : partie.planches[i] = { type: "3d", titre, legende, modele: {...} }) :
     { h: 380,                 hauteur du dessin (largeur fixe 640)
       rx: -24, ry: 32,        orientation de départ en degrés (rx = basculer, ry = tourner)
       echelle: 1,             zoom
       eclate: "Écarter les couches",   (facultatif) curseur de vue éclatée
       objets: [ { f: "boite", c:[x,y,z], d:[l,h,p], coul:"#7FB800", ec:[0,40,0] }, ... ],
       etiquettes: [ { p:[x,y,z], t:"Épiderme", cote:"g"|"d", ec:[...] } ] }
   Formes : boite, cylindre (c = centre de la base, r, h, n), sphere (c, r ou [rx,ry,rz]),
            cone (c, r, h), poly (pts, face simple). y vers le haut. ec = déplacement en vue éclatée. */
(function (W) {
  "use strict";
  var NS = "http://www.w3.org/2000/svg", LARG = 720;

  function hex(c) { c = c.replace("#", ""); if (c.length === 3) c = c.replace(/./g, "$&$&"); var n = parseInt(c, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function teinte(rgb, k) { return "rgb(" + rgb.map(function (v) { return Math.max(0, Math.min(255, Math.round(v * k))) }).join(",") + ")"; }
  function sous(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function vect(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] }); }

  /* ── Maillage : chaque forme devient une liste de faces { p:[pts], coul, ferme } ── */
  function faces(o) {
    var F = [], c = o.c || [0, 0, 0], col = hex(o.coul || "#9DB4D8"), op = o.op == null ? 1 : o.op, k, i, j;
    /* axe "x" ou "z" : un cylindre couché (rotation propre, l'orientation des faces est conservée) */
    var rot = o.axe === "x" ? function (q) { return [c[0] + (q[1] - c[1]), c[1] - (q[0] - c[0]), q[2]] }
      : o.axe === "z" ? function (q) { return [q[0], c[1] - (q[2] - c[2]), c[2] + (q[1] - c[1])] } : null;
    function f(pts, ferme, coul) { F.push({ p: rot ? pts.map(rot) : pts, coul: coul || col, ferme: o.double ? false : ferme !== false, op: op, trait: o.trait }); }
    if (o.f === "boite" && o.div !== false && Math.max(o.d[0], o.d[2]) > 70) {
      /* grande boîte : découpée en carreaux, sinon le tri par profondeur (peintre) la place mal
         devant ou derrière les petits objets posés dessus. Seules les faces extérieures sont émises. */
      var D = o.d, nx = Math.ceil(D[0] / 45), nz = Math.ceil(D[2] / 45), sx = D[0] / nx, sz = D[2] / nz,
        X0 = c[0] - D[0] / 2, Z0 = c[2] - D[2] / 2, Y0 = c[1] - D[1] / 2, Y1 = c[1] + D[1] / 2,
        cDes = o.dessus ? hex(o.dessus) : null, cCot = o.cote ? hex(o.cote) : null;
      for (i = 0; i < nx; i++) for (j = 0; j < nz; j++) {
        var a0 = X0 + i * sx, a1 = a0 + sx, b0 = Z0 + j * sz, b1 = b0 + sz;
        f([[a0, Y1, b0], [a0, Y1, b1], [a1, Y1, b1], [a1, Y1, b0]], true, cDes);
        f([[a0, Y0, b0], [a1, Y0, b0], [a1, Y0, b1], [a0, Y0, b1]]);
        if (j === nz - 1) f([[a0, Y0, b1], [a1, Y0, b1], [a1, Y1, b1], [a0, Y1, b1]], true, cCot);
        if (j === 0) f([[a1, Y0, b0], [a0, Y0, b0], [a0, Y1, b0], [a1, Y1, b0]], true, cCot);
        if (i === nx - 1) f([[a1, Y0, b1], [a1, Y0, b0], [a1, Y1, b0], [a1, Y1, b1]], true, cCot);
        if (i === 0) f([[a0, Y0, b0], [a0, Y0, b1], [a0, Y1, b1], [a0, Y1, b0]], true, cCot);
      }
    } else if (o.f === "boite") {
      var d = o.d, x0 = c[0] - d[0] / 2, x1 = c[0] + d[0] / 2, y0 = c[1] - d[1] / 2, y1 = c[1] + d[1] / 2, z0 = c[2] - d[2] / 2, z1 = c[2] + d[2] / 2;
      var dessus = o.dessus ? hex(o.dessus) : null, cote = o.cote ? hex(o.cote) : null;
      f([[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]], true, dessus);          /* dessus */
      f([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]]);                        /* dessous */
      f([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], true, cote);            /* avant */
      f([[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]], true, cote);            /* arrière */
      f([[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]], true, cote);            /* droite */
      f([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], true, cote);            /* gauche */
    } else if (o.f === "cylindre" || o.f === "cone") {
      var n = o.n || 18, r = o.r, h = o.h, r2 = o.f === "cone" ? (o.r2 || 0.001) : (o.r2 == null ? r : o.r2), bas = [], haut = [];
      for (k = 0; k < n; k++) { var a = 2 * Math.PI * k / n; bas.push([c[0] + r * Math.cos(a), c[1], c[2] + r * Math.sin(a)]); haut.push([c[0] + r2 * Math.cos(a), c[1] + h, c[2] + r2 * Math.sin(a)]); }
      for (k = 0; k < n; k++) { var k2 = (k + 1) % n; f([bas[k], haut[k], haut[k2], bas[k2]]); }
      f(haut.slice().reverse(), true, o.dessus ? hex(o.dessus) : null); f(bas.slice());
    } else if (o.f === "sphere") {
      var R = typeof o.r === "number" ? [o.r, o.r, o.r] : o.r, nl = o.n || 14, nm = o.m || 9, P = [];
      for (i = 0; i <= nm; i++) { P.push([]); var t = Math.PI * i / nm; for (j = 0; j < nl; j++) { var u = 2 * Math.PI * j / nl; P[i].push([c[0] + R[0] * Math.sin(t) * Math.cos(u), c[1] + R[1] * Math.cos(t), c[2] + R[2] * Math.sin(t) * Math.sin(u)]); } }
      for (i = 0; i < nm; i++) for (j = 0; j < nl; j++) { var j2 = (j + 1) % nl; f([P[i][j], P[i][j2], P[i + 1][j2], P[i + 1][j]].filter(function (q, x, s) { return x === 0 || q.join() !== s[x - 1].join() })); }
    } else if (o.f === "poly") {
      f(o.pts.map(function (q) { return [q[0], q[1], q[2]] }), false);
    }
    return F;
  }

  function monter(boite, M) {
    var H = M.h || 380, rx = M.rx == null ? -24 : M.rx, ry = M.ry == null ? 32 : M.ry, ech = M.echelle || 1, ecl = 0, auto = false, raf = 0;
    var LUM = norm(M.lumiere || [-0.4, 0.8, -0.6]);
    var objets = M.objets.map(function (o) { return { o: o, F: faces(o), ec: o.ec || [0, 0, 0] } });
    var marge = M.etiquettes && M.etiquettes.length ? 190 : 0, cx = LARG / 2, cy = H / 2 + (M.dy || 0);

    boite.classList.add("p3d-boite");
    boite.innerHTML = '<svg class="p3d-svg" viewBox="0 0 ' + LARG + ' ' + H + '" role="img" tabindex="0" aria-label="' + esc(M.alt || "Planche en trois dimensions") + ' — flèches du clavier pour tourner"></svg>' +
      '<div class="p3d-cmd"><button type="button" data-p3d="auto">Tourner tout seul</button><button type="button" data-p3d="face">Vue de départ</button>' +
      (M.eclate ? '<label class="p3d-ecl"><span>' + esc(M.eclate) + '</span><input type="range" min="0" max="1" step="0.02" value="0"></label>' : '') +
      '<span class="p3d-aide">Fais glisser le dessin pour le tourner</span></div>';
    var svg = boite.querySelector("svg");

    function tourner(p, dec) {
      var x = p[0] + dec[0] * ecl, y = p[1] + dec[1] * ecl, z = p[2] + dec[2] * ecl;
      var a = ry * Math.PI / 180, b = rx * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
      var x1 = x * ca - z * sa, z1 = x * sa + z * ca;          /* autour de y */
      var y2 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;        /* autour de x */
      return [x1, y2, z2];
    }
    function proj(q) { var s = ech * 900 / (900 + q[2]); return [cx + q[0] * s, cy - q[1] * s]; }

    function dessiner() {
      var liste = [];
      objets.forEach(function (ob) {
        ob.F.forEach(function (fc) {
          var R = fc.p.map(function (p) { return tourner(p, ob.ec) });
          if (R.length < 3) return;
          var nrm = norm(vect(sous(R[1], R[0]), sous(R[2], R[0])));
          if (fc.ferme && nrm[2] > 0.02) return;                      /* face cachée (on regarde vers +z) */
          if (!fc.ferme && nrm[2] > 0) nrm = [-nrm[0], -nrm[1], -nrm[2]];
          var l = nrm[0] * LUM[0] + nrm[1] * LUM[1] + nrm[2] * LUM[2];
          var k = 0.62 + 0.48 * Math.max(0, l), z = 0;
          R.forEach(function (q) { z += q[2] }); z /= R.length;
          liste.push({ z: z, d: R.map(proj), c: teinte(fc.coul, k), op: fc.op, tr: fc.trait });
        });
      });
      liste.sort(function (a, b) { return b.z - a.z });
      var h = liste.map(function (P) {
        return '<path d="M' + P.d.map(function (q) { return q[0].toFixed(1) + " " + q[1].toFixed(1) }).join("L") + 'Z" fill="' + P.c + '"' + (P.op < 1 ? ' fill-opacity="' + P.op + '"' : '') +
          ' stroke="' + (P.tr || P.c) + '" stroke-width="' + (P.tr ? 0.8 : 0.6) + '" stroke-linejoin="round"/>';
      }).join("");
      /* légendes : un trait de rappel vers la marge, espacées pour ne jamais se chevaucher */
      if (M.etiquettes && etroit()) {
        /* téléphone : des pastilles numérotées sur l'objet, la légende en clair sous le dessin */
        M.etiquettes.forEach(function (e, i) { var q = proj(tourner(e.p, e.ec || [0, 0, 0]));
          h += '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="15" fill="#001136" stroke="#fff" stroke-width="3"/><text x="' + q[0].toFixed(1) + '" y="' + (q[1] + 6).toFixed(1) + '" text-anchor="middle" font-size="17" font-weight="600" fill="#fff">' + (i + 1) + '</text>'; });
      } else if (M.etiquettes) {
        var cotes = { g: [], d: [] };
        M.etiquettes.forEach(function (e) { var q = proj(tourner(e.p, e.ec || [0, 0, 0])); cotes[e.cote === "d" ? "d" : "g"].push({ x: q[0], y: q[1], t: e.t }); });
        /* chaque légende est collée au bord (jamais rognée) ; un trait la relie à son point */
        ["g", "d"].forEach(function (s) {
          var L = cotes[s].sort(function (a, b) { return a.y - b.y }), pas = 24;
          L.forEach(function (e, i) { e.ty = Math.max(e.y, i ? L[i - 1].ty + pas : 18); });
          for (var i = L.length - 1; i >= 0; i--) { var max = i === L.length - 1 ? H - 8 : L[i + 1].ty - pas; if (L[i].ty > max) L[i].ty = max; }
          L.forEach(function (e) {
            var w = Math.min(marge - 14, e.t.length * 6.5), bx = s === "g" ? 8 : LARG - 8, fin = s === "g" ? bx + w + 6 : bx - w - 6;
            h += '<path d="M' + bx + " " + (e.ty + 5).toFixed(1) + "L" + fin + " " + (e.ty + 5).toFixed(1) + "L" + e.x.toFixed(1) + " " + e.y.toFixed(1) + '" fill="none" stroke="#001136" stroke-width="1" opacity=".7"/>' +
              '<circle cx="' + e.x.toFixed(1) + '" cy="' + e.y.toFixed(1) + '" r="3" fill="#fff" stroke="#001136" stroke-width="1.5"/>' +
              '<text x="' + bx + '" y="' + e.ty.toFixed(1) + '" text-anchor="' + (s === "g" ? "start" : "end") + '" font-size="12" font-weight="600" fill="#001136"' + (e.t.length * 6.5 > w ? ' textLength="' + w + '" lengthAdjust="spacingAndGlyphs"' : '') + '>' + esc(e.t) + '</text>';
          });
        });
      }
      svg.innerHTML = h;
      if (leg) leg.hidden = !etroit();
    }
    function etroit() { return boite.clientWidth > 0 && boite.clientWidth < 520; }
    var leg = null;
    if (M.etiquettes) {
      leg = document.createElement("ol"); leg.className = "p3d-leg";
      leg.innerHTML = M.etiquettes.map(function (e) { return "<li>" + esc(e.t) + "</li>" }).join("");
      boite.insertBefore(leg, boite.querySelector(".p3d-cmd"));
      /* en mode étroit, l'objet occupe toute la largeur : on récupère la place des marges */
      if (etroit()) { cx = LARG / 2; ech *= 1.35; }
    }
    W.addEventListener("resize", function () { dessiner() });

    /* glisser pour tourner (souris, doigt, stylet) */
    var tient = null;
    svg.addEventListener("pointerdown", function (e) { tient = [e.clientX, e.clientY]; arreter(); try { svg.setPointerCapture(e.pointerId) } catch (x) {} });
    svg.addEventListener("pointermove", function (e) {
      if (!tient) return; var k = 360 / Math.max(260, svg.getBoundingClientRect().width);
      ry += (e.clientX - tient[0]) * k; rx = Math.max(-85, Math.min(85, rx - (e.clientY - tient[1]) * k)); tient = [e.clientX, e.clientY]; dessiner();
    });
    ["pointerup", "pointercancel"].forEach(function (t) { svg.addEventListener(t, function () { tient = null }) });
    svg.addEventListener("keydown", function (e) {
      var m = { ArrowLeft: [0, -8], ArrowRight: [0, 8], ArrowUp: [-8, 0], ArrowDown: [8, 0] }[e.key]; if (!m) return;
      e.preventDefault(); arreter(); rx = Math.max(-85, Math.min(85, rx + m[0])); ry += m[1]; dessiner();
    });
    function arreter() { auto = false; cancelAnimationFrame(raf); var b = boite.querySelector('[data-p3d=auto]'); if (b) b.setAttribute("aria-pressed", "false"); }
    function boucle() { ry += 0.35; dessiner(); if (auto) raf = requestAnimationFrame(boucle); }
    boite.querySelector('[data-p3d=auto]').addEventListener("click", function () { if (auto) return arreter(); auto = true; this.setAttribute("aria-pressed", "true"); boucle(); });
    boite.querySelector('[data-p3d=face]').addEventListener("click", function () { arreter(); rx = M.rx == null ? -24 : M.rx; ry = M.ry == null ? 32 : M.ry; dessiner(); });
    var cur = boite.querySelector(".p3d-ecl input");
    if (cur) cur.addEventListener("input", function () { ecl = +cur.value; dessiner(); });
    /* un tour de présentation quand la planche apparaît (sauf « réduire les animations ») */
    if ("IntersectionObserver" in W && !W.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var vu = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { vu.disconnect(); var n = 0, d0 = ry; (function pas() { n++; ry = d0 + 40 * Math.sin(n / 60 * Math.PI); dessiner(); if (n < 60 && !tient) raf = requestAnimationFrame(pas); })(); } }, { threshold: 0.5 });
      vu.observe(boite);
    }
    dessiner();
    return { dessiner: dessiner };
  }

  W.VRT = W.VRT || {}; W.VRT.p3d = { monter: monter, faces: faces };
})(window);
