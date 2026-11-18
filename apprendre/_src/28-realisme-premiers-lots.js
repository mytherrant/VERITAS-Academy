/* Leçons APPROFONDIES — réalisme, lot 20 (18/11/2026) : illustrations des premiers lots redessinées (personnages complets,
   chromosomes en X, grenouilles, verrerie de laboratoire, poules, chimpanzé), plannings d'orientation lisibles (jours et mois
   écrits) et cellules animale et végétale en haute définition (ultrastructure ; explorateur dans 92-animations-realisme.js).
   Remplace SEULEMENT des dessins (enquete.svg, planche.svg ou planche entière par son titre) ou en AJOUTE ; aucun texte retiré. */
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

  function alea(g) { return function () { g = (g * 16807) % 2147483647; return (g - 1) / 2147483646; }; }
  /* remplace seulement le dessin : la situation de départ ou une planche 2D repérée par son titre */
  function dessinEnquete(id, s) { var L = ancien(id); if (L && L.enquete) L.enquete.svg = s; }
  function dessinPlanche(id, titre, s) { var L = ancien(id); if (!L) return; L.parties.forEach(function (p) { (p.planches || []).forEach(function (x) { if (String(x.titre).replace(/[\u00a0\u202f]/g, " ") === titre.replace(/[\u00a0\u202f]/g, " ") && !/3d/i.test(x.type)) { x.svg = s; delete x.ref; } }); }); }
  /* décor : mur, sol, fenêtre */
  function piece(w, h, mur, sol) { return "<rect width='" + w + "' height='" + h + "' fill='" + mur + "'/><rect y='" + (h - 46) + "' width='" + w + "' height='46' fill='" + sol + "'/><path d='M0 " + (h - 46) + "H" + w + "' stroke='#00000022' stroke-width='3'/>"; }
  function poule(x, y, s, plume) {
    return "<g transform='translate(" + x + " " + y + ") scale(" + s + ")'><path d='M-14 -6q-10 -10 -6 -22q6 6 8 14z' fill='#3B2A1A'/><ellipse cx='0' cy='0' rx='16' ry='12' fill='" + plume + "'/><path d='M-6 -2q6 8 14 2' stroke='#00000033' stroke-width='2' fill='none'/><circle cx='12' cy='-12' r='6.5' fill='" + plume + "'/><path d='M9 -18q2 -6 4 -1q2 -5 4 0q2 -4 3 1z' fill='#D7261E'/><path d='M18 -12l6 2l-6 2z' fill='#E8A33D'/><path d='M16 -8q2 5 -1 6' fill='#D7261E'/><circle cx='14' cy='-13' r='1.2' fill='#111'/><path d='M-3 11v9M4 11v9M-3 20l-4 2M-3 20l3 2M4 20l-3 2M4 20l4 2' stroke='#E8A33D' stroke-width='1.8'/></g>";
  }
  function bebeBras(x, y) { return "<g transform='translate(" + x + " " + y + ")'><ellipse rx='15' ry='9' fill='#F4E7C8' stroke='#D9C49C'/><circle cx='11' cy='-4' r='6' fill='#6B4423'/><path d='M-12 -2q10 -6 18 2' stroke='#E8A33D' stroke-width='3' fill='none'/></g>"; }

  /* ═══════════ 3e SVT — CHROMOSOMES ET ADN ═══════════ */
  var LONG = [249, 242, 198, 190, 181, 171, 159, 145, 138, 134, 135, 133, 114, 107, 102, 90, 83, 80, 59, 64, 47, 51], CENT = [0.48, 0.39, 0.46, 0.27, 0.27, 0.35, 0.36, 0.31, 0.32, 0.30, 0.40, 0.27, 0.15, 0.15, 0.17, 0.41, 0.33, 0.24, 0.45, 0.45, 0.25, 0.25];
  function chromosome(x, yb, len, cpos, graine, couleur) {
    var h = len * 0.36, top = yb - h, yc = top + h * cpos, R = alea(graine), s = "", w = 6.5, i;
    [x - w - 0.6, x + 0.6].forEach(function (cx) {
      s += "<path d='M" + cx + " " + (top + 3) + "q0 -3 " + (w / 2) + " -3q" + (w / 2) + " 0 " + (w / 2) + " 3V" + (yc - 2) + "q0 2 -" + (w * 0.18) + " 2q" + (w * 0.18) + " 0 " + (w * 0.18) + " 2V" + (yb - 3) + "q0 3 -" + (w / 2) + " 3q-" + (w / 2) + " 0 -" + (w / 2) + " -3V" + (yc + 2) + "q0 -2 " + (w * 0.18) + " -2q-" + (w * 0.18) + " 0 -" + (w * 0.18) + " -2Z' fill='" + couleur + "' stroke='#5E4A78' stroke-width='0.6'/>";
      for (i = 0; i < Math.round(h / 9); i++) { var yy = top + 4 + R() * (h - 8), hh = 1.5 + R() * 3.5; if (Math.abs(yy - yc) > 3) s += "<rect x='" + cx + "' y='" + yy.toFixed(1) + "' width='" + w + "' height='" + hh.toFixed(1) + "' fill='#3B2A52' opacity='" + (0.55 + R() * 0.4).toFixed(2) + "'/>"; }
    });
    return s;
  }
  function caryotype(sexe) {
    var s = "<rect width='640' height='330' fill='#F7F5F2'/>", rangs = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11, 12], [13, 14, 15, 16, 17, 18], [19, 20, 21, 22, "S"]], bases = [104, 186, 252, 312];
    rangs.forEach(function (r, ri) {
      var pas = 600 / r.length;
      r.forEach(function (n, k) {
        var cx = 20 + pas * (k + 0.5), yb = bases[ri];
        if (n === "S") {
          s += chromosome(cx - 9, yb, 156, 0.39, 777, "#C7B5DA") + chromosome(cx + 9, yb, sexe === "XX" ? 156 : 57, sexe === "XX" ? 0.39 : 0.22, sexe === "XX" ? 778 : 779, sexe === "XX" ? "#C7B5DA" : "#E9B8B8");
          s += txt(cx, yb + 14, sexe, { s: 11, c: ROUGE });
        } else {
          s += chromosome(cx - 9, yb, LONG[n - 1], CENT[n - 1], n * 31, "#C7B5DA") + chromosome(cx + 9, yb, LONG[n - 1], CENT[n - 1], n * 31 + 1, "#C7B5DA");
          s += txt(cx, yb + 14, String(n), { s: 10, c: GRIS, w: 600 });
        }
      });
    });
    return svg(640, 330, "Caryotype " + (sexe === "XX" ? "d’une fille : 22 paires et XX" : "d’un garçon : 22 paires et XY") + " ; chromosomes en X avec leurs bandes sombres, rangés du plus grand au plus petit", "", s);
  }
  dessinPlanche("3e-svt-adn", "Caryotype d'une fille (simplifié)", caryotype("XX"));
  dessinPlanche("3e-svt-adn", "Caryotype d'un garçon (simplifié)", caryotype("XY"));
  function grenouille(x, y, s, peau, tache, oeil) {
    var g = "<g transform='translate(" + x + " " + y + ") scale(" + s + ")'>";
    g += "<path d='M-14 8q-26 4 -30 18q8 4 20 -2q-6 10 -18 12q10 4 22 -4M14 8q26 4 30 18q-8 4 -20 -2q6 10 18 12q-10 4 -22 -4' fill='" + peau + "' stroke='#00000033'/>";
    g += "<path d='M-10 -6q-14 6 -18 16l6 1M10 -6q14 6 18 16l-6 1' stroke='" + peau + "' stroke-width='5' fill='none' stroke-linecap='round'/>";
    g += "<ellipse cx='0' cy='4' rx='18' ry='22' fill='" + peau + "' stroke='#00000033'/><ellipse cx='0' cy='-14' rx='14' ry='10' fill='" + peau + "'/>";
    if (tache) g += "<ellipse cx='-6' cy='6' rx='4' ry='3' fill='" + tache + "'/><ellipse cx='7' cy='12' rx='3.5' ry='2.5' fill='" + tache + "'/><ellipse cx='2' cy='-2' rx='3' ry='2' fill='" + tache + "'/>";
    g += "<circle cx='-8' cy='-20' r='5' fill='" + peau + "' stroke='#00000033'/><circle cx='8' cy='-20' r='5' fill='" + peau + "' stroke='#00000033'/><circle cx='-8' cy='-21' r='2.6' fill='" + oeil + "'/><circle cx='8' cy='-21' r='2.6' fill='" + oeil + "'/></g>";
    return g;
  }
  dessinPlanche("3e-svt-adn", "Le transfert de noyau", (function () {
    var s = "<rect width='640' height='250' fill='#F2F7F1'/>";
    s += grenouille(60, 70, 1.1, "#4E8B2E", "#2E5A1A", "#111") + txt(60, 128, "grenouille verte", { s: 11 });
    s += "<circle cx='60' cy='190' r='26' fill='#E6F0D8' stroke='#7FA06A' stroke-width='2'/><circle cx='60' cy='190' r='10' fill='#6A4C93'/>" + txt(60, 236, "une cellule de son intestin", { s: 10, c: GRIS, w: 600 });
    s += "<path d='M86 186Q190 120 296 118' stroke='#6A4C93' stroke-width='2.5' stroke-dasharray='6 4' fill='none' marker-end='url(#gnF)'/>" + txt(190, 132, "on prélève le noyau", { s: 11, c: "#6A4C93" });
    s += grenouille(320, 50, 0.9, "#F1E3D8", null, "#C0392B") + txt(320, 100, "grenouille albinos", { s: 11 });
    s += "<circle cx='320' cy='160' r='34' fill='#F7EFD8' stroke='#C9B28A' stroke-width='2'/><circle cx='320' cy='160' r='34' fill='url(#gnO)'/><path d='M346 130l40 -30' stroke='#9AA3AF' stroke-width='4'/><path d='M340 136l6 -6' stroke='#6A4C93' stroke-width='3'/>" + txt(320, 216, "son ovule, noyau détruit,", { s: 10, c: GRIS, w: 600 }) + txt(320, 230, "reçoit le noyau de la verte", { s: 10, c: GRIS, w: 600 });
    s += "<path d='M362 160H440' stroke='" + NUIT + "' stroke-width='2.5' marker-end='url(#gnF2)'/>" + txt(400, 150, "développement", { s: 11 });
    s += "<g transform='translate(470 160)'><ellipse rx='12' ry='9' fill='#4E8B2E'/><path d='M10 0q16 -8 26 4q-12 -2 -26 2z' fill='#4E8B2E'/></g>" + txt(478, 188, "têtard", { s: 10, c: GRIS });
    s += grenouille(575, 120, 1.15, "#4E8B2E", "#2E5A1A", "#111") + txt(575, 182, "grenouille VERTE", { s: 12, c: VERT });
    return svg(640, 250, "Expérience : le noyau d’une cellule de grenouille verte est placé dans l’ovule d’une grenouille albinos ; il en naît une grenouille verte", fleche("gnF", "#6A4C93") + fleche("gnF2", NUIT) + "<radialGradient id='gnO' cx='35%' cy='30%' r='70%'><stop offset='0' stop-color='#fff' stop-opacity='.7'/><stop offset='1' stop-color='#fff' stop-opacity='0'/></radialGradient>", s);
  })());
  dessinEnquete("3e-svt-adn", svg(640, 220, "Salon familial à Ebolowa : la grand-mère au foulard parle à Tonton Essomba ; Tata Ngo Bassong tient le bébé ; trois fillettes", "",
    piece(640, 220, "#F2E3C6", "#B88A5A") + "<rect x='30' y='26' width='110' height='76' fill='#BFE0F7' stroke='#8B5A2B' stroke-width='6'/><path d='M85 26V102M30 64H140' stroke='#8B5A2B' stroke-width='4'/><rect x='470' y='20' width='70' height='50' fill='#C9A06E' stroke='#6B4423' stroke-width='3'/><path d='M478 60l14 -18l10 10l12 -16l16 24z' fill='#2E7D32'/>" +
    "<rect x='420' y='120' width='200' height='54' rx='12' fill='#7A2E2E'/><rect x='420' y='104' width='200' height='26' rx='10' fill='#8E3A3A'/>" +
    perso(170, 82, "#5A3A1E", "#1E499B", "#2E3445") + perso(250, 86, "#6B4423", "#2E7D32", "#2E7D32") + bebeBras(254, 126) + "<g transform='translate(220 140) scale(.62)'>" + perso(0, 0, "#6B4423", "#E8A33D", "#C62828") + "</g><g transform='translate(300 142) scale(.6)'>" + perso(0, 0, "#5A3A1E", "#D7261E", "#7B3F99") + "</g><g transform='translate(330 150) scale(.5)'>" + perso(0, 0, "#6B4423", "#F7C948", "#1E499B") + "</g>" +
    perso(520, 72, "#4A2E1A", "#7B3F99", "#7B3F99") + "<path d='M509 66q11 -14 22 0q-11 -4 -22 0z' fill='#E8A33D'/>" + bulle(400, 10, 230, "« Ta femme ne te donne que des filles ! »", "#F7C948") +
    txt(170, 214, "Tonton Essomba", { s: 10, c: "#fff" }) + txt(254, 214, "Tata et Manuela", { s: 10, c: "#fff" }) + txt(520, 214, "la grand-mère", { s: 10, c: "#fff" })));

  /* ═══════════ 3e SVT — RESSEMBLANCES ═══════════ */
  function chimpanze(x, y, s) {
    var g = "<g transform='translate(" + x + " " + y + ") scale(" + s + ")'>";
    g += "<ellipse cx='0' cy='34' rx='30' ry='34' fill='#2B211B'/><path d='M-26 20q-22 30 -14 58l10 0q-4 -26 10 -46z' fill='#2B211B'/><path d='M26 20q22 30 14 58l-10 0q4 -26 -10 -46z' fill='#2B211B'/>";
    g += "<ellipse cx='-16' cy='66' rx='16' ry='8' fill='#2B211B'/><ellipse cx='16' cy='66' rx='16' ry='8' fill='#2B211B'/><ellipse cx='-34' cy='78' rx='7' ry='4' fill='#8A6B55'/><ellipse cx='34' cy='78' rx='7' ry='4' fill='#8A6B55'/>";
    g += "<circle cx='0' cy='-6' r='20' fill='#2B211B'/><circle cx='-20' cy='-6' r='7' fill='#8A6B55'/><circle cx='20' cy='-6' r='7' fill='#8A6B55'/><path d='M-13 -10q13 -10 26 0q4 14 -4 24q-9 6 -18 0q-8 -10 -4 -24z' fill='#B08A6E'/><path d='M-10 -8q5 -3 8 0M2 -8q5 -3 8 0' stroke='#2B211B' stroke-width='2' fill='none'/><circle cx='-6' cy='-4' r='1.8' fill='#111'/><circle cx='6' cy='-4' r='1.8' fill='#111'/><path d='M-6 8q6 4 12 0' stroke='#5A3A2A' stroke-width='1.6' fill='none'/><ellipse cx='0' cy='3' rx='5' ry='2.4' fill='#8A6B55'/></g>";
    return g;
  }
  dessinEnquete("3e-svt-ressemblances", svg(640, 220, "Centre de faune de Limbé : un chimpanzé assis derrière un grillage ; les jumelles Awa et Aïssa en tenue de handball et deux camarades", lin("rsC", ["#CFE3F2", "#EAF4E6"], true),
    "<rect width='640' height='220' fill='url(#rsC)'/><ellipse cx='470' cy='70' rx='120' ry='56' fill='#2E6B2A'/><ellipse cx='580' cy='80' rx='80' ry='46' fill='#3E7D32'/><rect x='466' y='96' width='14' height='80' fill='#5D3A1E'/><rect y='160' width='640' height='60' fill='#6E9B45'/>" +
    chimpanze(510, 104, 0.82) + (function () { var s = "", k; for (k = 0; k <= 16; k++) s += "<path d='M" + (380 + k * 16) + " 60V178' stroke='#9AA3AF' stroke-width='1.5'/>"; for (k = 0; k < 8; k++) s += "<path d='M380 " + (60 + k * 16) + "H636' stroke='#9AA3AF' stroke-width='1' opacity='.7'/>"; return s + "<path d='M376 56V180M636 56V180' stroke='#6E737C' stroke-width='5'/>"; })() +
    perso(70, 98, "#5A3A1E", "#1E499B", "#F4F1EA") + perso(110, 98, "#5A3A1E", "#1E499B", "#F4F1EA") + perso(220, 96, "#6B4423", "#F4F1EA", "#2E3445") + perso(270, 98, "#4A2E1A", "#F4F1EA", "#2E3445") + bulle(170, 12, 200, "« Il est presque humain ! »", "#F7C948") +
    txt(90, 212, "Awa et Aïssa (handball)", { s: 10, c: "#fff" }) + txt(245, 212, "Christelle, Ndi", { s: 10, c: "#fff" }) + txt(510, 212, "chimpanzé", { s: 10, c: "#fff" })));

  /* ═══════════ 3e PCT — L'ATOME ═══════════ */
  dessinEnquete("3e-pct-atome", svg(640, 220, "À Ngaoundéré, Ibrahim dénude un fil électrique où brillent des brins de cuivre orange ; à côté, une chaîne en or ; sa petite sœur tient une pince", "",
    piece(640, 220, "#EFE6D6", "#C9A06E") + "<rect x='120' y='118' width='400' height='14' rx='3' fill='#8B5A2B'/><rect x='136' y='132' width='12' height='70' fill='#6B4423'/><rect x='492' y='132' width='12' height='70' fill='#6B4423'/>" +
    "<path d='M190 110H330' stroke='#1F2328' stroke-width='9' stroke-linecap='round'/><path d='M330 110H350' stroke='#E8E8E8' stroke-width='7'/>" + [0, 1, 2, 3, 4].map(function (k) { return "<path d='M350 110q" + (14 + k * 2) + " " + (k - 2) * 3 + " " + (28 + k * 4) + " " + (k - 2) * 5 + "' stroke='#C8742E' stroke-width='1.6' fill='none'/>"; }).join("") + txt(270, 98, "fil électrique : brins de cuivre", { s: 11, c: "#8B4513" }) +
    (function () { var s = "", k; for (k = 0; k < 18; k++) { var a = Math.PI * k / 17, x = 440 - 34 * Math.cos(a), y = 112 - 10 * Math.sin(a); s += "<ellipse cx='" + x.toFixed(1) + "' cy='" + y.toFixed(1) + "' rx='3.2' ry='2.2' fill='none' stroke='#D4A017' stroke-width='1.8'/>"; } return s; })() + "<circle cx='440' cy='116' r='5' fill='#D4A017'/>" + txt(440, 92, "chaîne en or", { s: 11, c: "#8A6A10" }) +
    perso(70, 70, "#5A3A1E", "#1E499B", "#2E3445") + perso(580, 86, "#6B4423", "#C62828", "#7B3F99") + "<path d='M560 130l-22 -6M560 130l-22 2' stroke='#C62828' stroke-width='4'/>" + bulle(20, 10, 210, "« Or, cuivre : même matière ! »", "#9FC5E8") + bulle(410, 10, 220, "« Et si je coupe sans fin ? »", "#F7C948")));

  /* ═══════════ 3e MATHS — RACINES CARRÉES ═══════════ */
  dessinEnquete("3e-maths-racines", svg(640, 220, "Derrière une maison de Bafang : Papa Fotso tient un mètre ruban près d’un carré tracé à la ficelle entre quatre piquets ; des poules picorent", lin("rcC", ["#CFE3F2", "#F4F1EA"], true),
    "<rect width='640' height='220' fill='url(#rcC)'/><rect y='120' width='640' height='100' fill='#9C7A4E'/><path d='M0 120Q200 112 640 124' stroke='#7A5A3A' stroke-width='3' fill='none'/>" +
    "<rect x='470' y='40' width='130' height='82' fill='#E9DFCF' stroke='#B8AE9C'/><path d='M456 44L535 6L614 44Z' fill='#9AA3AF' stroke='#6E737C'/><rect x='520' y='74' width='26' height='48' fill='#6B4423'/><rect x='484' y='64' width='24' height='20' fill='#8FB2E3' stroke='#6B4423' stroke-width='2'/>" +
    "<path d='M190 150L330 150L370 196L150 196Z' fill='#B88A5A' opacity='.35'/><path d='M190 150L330 150L370 196L150 196Z' fill='none' stroke='#F4F1EA' stroke-width='2' stroke-dasharray='6 4'/>" + [[190, 150], [330, 150], [370, 196], [150, 196]].map(function (p) { return "<path d='M" + p[0] + " " + p[1] + "v-16' stroke='#6B4423' stroke-width='4'/>"; }).join("") + txt(260, 182, "50 m² ?", { s: 15, c: "#fff" }) +
    perso(90, 92, "#5A3A1E", "#2E7D32", "#2E3445") + "<path d='M110 132L190 140' stroke='#F7C948' stroke-width='3'/>" + poule(420, 176, 0.9, "#B5532A") + poule(460, 196, 0.8, "#F4F1EA") + poule(400, 204, 0.75, "#3B2A1A") + bulle(20, 14, 230, "« 200 poules, 4 par m² : 50 m². »", "#F7C948") + txt(90, 214, "Papa Fotso", { s: 10, c: "#fff" })));

  /* ═══════════ 3e PCT — CONCENTRATION ET pH ═══════════ */
  dessinEnquete("3e-pct-ph", svg(640, 220, "Cour à Obala : Tata Mbarga, gants et tablier, remue une cuvette de solution de soude ; bidon d’huile de palme, sac de soude, pains de savon qui sèchent ; Junior approche la main", lin("phC", ["#CFE3F2", "#F4F1EA"], true),
    "<rect width='640' height='220' fill='url(#phC)'/><rect y='150' width='640' height='70' fill='#B88A5A'/><path d='M430 40L520 10L610 40V150H430Z' fill='#C9A06E' stroke='#8B5A2B' stroke-width='2'/><path d='M420 44L520 6L620 44' stroke='#8B4513' stroke-width='8' fill='none'/><rect x='500' y='96' width='34' height='54' fill='#5D3A1E'/>" +
    "<ellipse cx='210' cy='160' rx='62' ry='14' fill='#2F6DB5'/><path d='M148 160q4 34 62 34q58 0 62 -34' fill='#2F6DB5'/><ellipse cx='210' cy='160' rx='56' ry='10' fill='#E6EEF4'/><path d='M240 120L210 158' stroke='#8B5A2B' stroke-width='5'/>" +
    "<rect x='300' y='150' width='34' height='44' rx='4' fill='#F4F1EA' stroke='#9AA3AF'/><rect x='300' y='160' width='34' height='14' fill='#C62828'/>" + txt(317, 171, "SOUDE", { s: 7, c: "#fff" }) + "<rect x='345' y='140' width='30' height='54' rx='6' fill='#D2691E'/><rect x='352' y='132' width='16' height='10' fill='#B5532A'/>" + txt(360, 172, "huile", { s: 8, c: "#fff" }) +
    "<rect x='390' y='182' width='150' height='8' fill='#8B5A2B'/>" + [0, 1, 2, 3, 4].map(function (k) { return "<rect x='" + (396 + k * 28) + "' y='166' width='22' height='16' rx='3' fill='#E8D27A' stroke='#C9B26A'/>"; }).join("") +
    perso(110, 82, "#5A3A1E", "#2E7D32", "#2E7D32") + "<rect x='97' y='108' width='26' height='34' fill='#F4F1EA' opacity='.85'/><circle cx='90' cy='124' r='5' fill='#F7C948'/><circle cx='130' cy='124' r='5' fill='#F7C948'/>" + "<g transform='translate(280 112) scale(.62)'>" + perso(0, 0, "#6B4423", "#1E499B", "#2E3445") + "</g>" +
    bulle(170, 14, 240, "« Ne touche pas, ça brûle même froid ! »", "#F7C948") + txt(110, 212, "Tata Mbarga (gants)", { s: 10, c: "#fff" }) + txt(280, 212, "Junior", { s: 10, c: "#fff" }) + txt(465, 212, "pains de savon", { s: 10, c: "#fff" })));
  var VERRE = "<linearGradient id='vrG' x1='0' x2='1'><stop offset='0' stop-color='#DDEFF8'/><stop offset='.3' stop-color='#F8FCFF'/><stop offset='1' stop-color='#C9E1EE'/></linearGradient>";
  dessinPlanche("3e-pct-ph", "Préparer 500 mL de solution, en quatre gestes", svg(640, 250, "Quatre gestes : peser 40 g de soude sur une balance, dissoudre dans un bécher, verser dans une fiole jaugée et compléter au trait avec la pissette, boucher et retourner", VERRE + fleche("phF", BLEU),
    "<rect width='640' height='250' fill='#F7F5F2'/><rect y='196' width='640' height='54' fill='#DCD3C4'/>" +
    "<g transform='translate(80 0)'><rect x='-52' y='150' width='104' height='46' rx='6' fill='#3A3F47'/><rect x='-34' y='160' width='68' height='20' rx='3' fill='#B8D8A8'/>" + txt(0, 175, "40,00 g", { s: 13, c: "#1F2328" }) + "<rect x='-36' y='140' width='72' height='8' rx='2' fill='#C9CED6'/><ellipse cx='0' cy='138' rx='26' ry='5' fill='#E9E2D2'/>" + [[-8, 134], [0, 132], [8, 134], [-3, 130], [5, 130]].map(function (p) { return "<ellipse cx='" + p[0] + "' cy='" + p[1] + "' rx='3.5' ry='2' fill='#fff' stroke='#C9CED6'/>"; }).join("") + "</g>" + txt(80, 222, "1. Peser 40 g de NaOH", { s: 11 }) +
    "<g transform='translate(240 0)'><path d='M-34 90V188q0 8 8 8H26q8 0 8 -8V90' fill='url(#vrG)' stroke='#8AA6B8' stroke-width='2'/><path d='M-33 130V188q0 7 7 7H26q7 0 7 -7V130Z' fill='#D6ECF8' opacity='.9'/><path d='M-38 90H-30M30 90H38' stroke='#8AA6B8' stroke-width='2'/><path d='M8 70L-6 186' stroke='#9AA3AF' stroke-width='4' stroke-linecap='round'/>" + [130, 150, 170].map(function (y) { return "<path d='M-34 " + y + "h8' stroke='#8AA6B8'/>"; }).join("") + "</g>" + txt(240, 222, "2. Dissoudre dans l'eau", { s: 11 }) +
    "<g transform='translate(400 0)'><path d='M-6 40V120q-36 10 -36 46q0 30 42 30q42 0 42 -30q0 -36 -36 -46V40Z' fill='url(#vrG)' stroke='#8AA6B8' stroke-width='2'/><path d='M-40 160q0 36 40 36q40 0 40 -36q-2 -16 -14 -26H-26q-12 10 -14 26Z' fill='#D6ECF8'/><path d='M-6 70h12' stroke='" + ROUGE + "' stroke-width='2.5'/><path d='M-6 76V118' stroke='#D6ECF8' stroke-width='10'/><path d='M-20 28h40l-14 14h-12Z' fill='url(#vrG)' stroke='#8AA6B8'/><path d='M40 30q20 -14 26 6v40h-12v-40q-4 -10 -14 -6Z' fill='#F4F1EA' stroke='#9AA3AF'/></g>" + txt(400, 222, "3. Compléter au trait (pissette)", { s: 11 }) +
    "<g transform='translate(560 120) rotate(150)'><path d='M-6 -80V0q-36 10 -36 46q0 30 42 30q42 0 42 -30q0 -36 -36 -46V-80Z' fill='url(#vrG)' stroke='#8AA6B8' stroke-width='2'/><path d='M-40 40q0 36 40 36q40 0 40 -36q-2 -16 -14 -26H-26q-12 10 -14 26Z' fill='#D6ECF8'/><rect x='-8' y='-92' width='16' height='14' rx='3' fill='#1F2328'/></g><path d='M520 70q40 -30 80 0' stroke='" + BLEU + "' stroke-width='2.5' fill='none' marker-end='url(#phF)'/>" + txt(560, 222, "4. Boucher, retourner", { s: 11 })));
  dessinPlanche("3e-pct-ph", "Diluer dix fois la solution de Tata", svg(640, 250, "Dilution : on prélève 50 mL de solution à 2 mol par litre avec une pipette jaugée munie d’une poire, puis on complète à 500 mL d’eau dans une fiole jaugée : 0,2 mol par litre", VERRE + fleche("dlF", NUIT),
    "<rect width='640' height='250' fill='#F7F5F2'/><rect y='204' width='640' height='46' fill='#DCD3C4'/>" +
    "<g transform='translate(110 0)'><path d='M-50 90V196q0 8 8 8H42q8 0 8 -8V90' fill='url(#vrG)' stroke='#8AA6B8' stroke-width='2'/><path d='M-49 110V196q0 7 7 7H42q7 0 7 -7V110Z' fill='#9EC2DE'/>" + (function () { var R = alea(5), s = "", k; for (k = 0; k < 26; k++) s += "<circle cx='" + (-40 + R() * 80).toFixed(1) + "' cy='" + (118 + R() * 80).toFixed(1) + "' r='2.6' fill='#2F3E73'/>"; return s; })() + "</g>" + txt(110, 226, "2 mol/L (pH > 13)", { s: 12 }) +
    "<g transform='translate(250 0)'><path d='M-3 40V100h-8v30h8v60l3 6l3 -6v-60h8v-30h-8V40Z' fill='url(#vrG)' stroke='#8AA6B8' stroke-width='1.5'/><path d='M-3 70h6' stroke='" + ROUGE + "' stroke-width='2'/><ellipse cx='0' cy='30' rx='12' ry='16' fill='#C62828'/><path d='M-2 104h4v84h-4z' fill='#9EC2DE'/></g>" + txt(250, 226, "pipette : 50 mL", { s: 12 }) + txt(250, 240, "= 0,1 mol de soude", { s: 10, c: GRIS, w: 600 }) +
    "<path d='M300 140H380' stroke='" + NUIT + "' stroke-width='3' marker-end='url(#dlF)'/>" + txt(340, 130, "+ eau jusqu'au trait", { s: 11 }) +
    "<g transform='translate(480 0)'><path d='M-8 40V112q-48 12 -48 52q0 40 56 40q56 0 56 -40q0 -40 -48 -52V40Z' fill='url(#vrG)' stroke='#8AA6B8' stroke-width='2'/><path d='M-54 160q0 44 54 44q54 0 54 -44q-2 -20 -18 -32H-36q-16 12 -18 32Z' fill='#D6ECF8'/><path d='M-8 70h16' stroke='" + ROUGE + "' stroke-width='2.5'/><path d='M-8 76V110' stroke='#D6ECF8' stroke-width='14'/>" + (function () { var R = alea(9), s = "", k; for (k = 0; k < 6; k++) s += "<circle cx='" + (-36 + R() * 72).toFixed(1) + "' cy='" + (140 + R() * 50).toFixed(1) + "' r='2.6' fill='#2F3E73'/>"; return s; })() + "</g>" + txt(480, 226, "500 mL : 0,2 mol/L", { s: 12 }) + txt(480, 240, "10 fois moins concentrée", { s: 10, c: GRIS, w: 600 })));
  /* ═══════════ Tle ORIENTATION — LA SEMAINE ET L'ANNÉE, EN CLAIR ═══════════ */
  function remplacerPlanche(id, titre, nouvelle) { var L = ancien(id); if (!L) return; L.parties.forEach(function (p) { (p.planches || []).forEach(function (x, i) { if (String(x.titre).replace(/[\u00a0\u202f]/g, " ") === titre.replace(/[\u00a0\u202f]/g, " ")) p.planches[i] = nouvelle; }); }); }
  function liege(w, h) { var s = "<rect width='" + w + "' height='" + h + "' fill='#8B5A2B'/><rect x='8' y='8' width='" + (w - 16) + "' height='" + (h - 16) + "' fill='#C89B63'/>", R = alea(3), k; for (k = 0; k < 160; k++) s += "<circle cx='" + (10 + R() * (w - 20)).toFixed(0) + "' cy='" + (10 + R() * (h - 20)).toFixed(0) + "' r='" + (0.8 + R() * 1.4).toFixed(1) + "' fill='#A97B45' opacity='.6'/>"; return s; }
  function punaise(x, y, c) { return "<circle cx='" + x + "' cy='" + y + "' r='6' fill='" + c + "'/><circle cx='" + (x - 2) + "' cy='" + (y - 2) + "' r='2' fill='#fff' opacity='.6'/>"; }
  var ACT = { som: ["sommeil", "#3A4E8C"], cours: ["cours", "#1E88E5"], rev: ["révisions", "#2E7D32"], sport: ["sport", "#F2994A"], repas: ["repas, toilette", "#D9B77A"], repos: ["détente, famille", "#E0E3E8"], ecran: ["téléphone", "#C62828"] };
  var JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  var SEMAINE = [
    [["som", 6], ["repas", 1], ["cours", 7], ["repas", 1], ["repos", 1], ["rev", 2], ["repos", 1], ["repas", 1], ["ecran", 1], ["repos", 1], ["som", 2]],
    [["som", 6], ["repas", 1], ["cours", 7], ["repas", 1], ["repos", 1], ["rev", 2], ["sport", 1], ["repas", 1], ["ecran", 1], ["repos", 1], ["som", 2]],
    [["som", 6], ["repas", 1], ["cours", 5], ["repas", 1], ["repos", 3], ["rev", 2], ["repas", 1], ["ecran", 1], ["repos", 2], ["som", 2]],
    [["som", 6], ["repas", 1], ["cours", 7], ["repas", 1], ["repos", 1], ["rev", 2], ["sport", 1], ["repas", 1], ["ecran", 1], ["repos", 1], ["som", 2]],
    [["som", 6], ["repas", 1], ["cours", 7], ["repas", 1], ["repos", 1.5], ["rev", 1.5], ["repos", 1], ["repas", 1], ["ecran", 1.5], ["repos", 0.5], ["som", 2.5]],
    [["som", 7.5], ["repas", 1.5], ["rev", 4], ["repas", 1], ["repos", 2], ["sport", 2], ["repos", 1], ["repas", 1], ["ecran", 1.5], ["repos", 1], ["som", 1.5]],
    [["som", 8], ["repas", 1.5], ["repos", 4], ["repas", 1.5], ["repos", 1], ["rev", 2], ["repos", 2], ["repas", 1], ["ecran", 1], ["repos", 0.5], ["som", 1.5]]];
  remplacerPlanche("tle-orient-temps", "La semaine type d'Aïcha", { type: "2D", titre: "La semaine type d'Aïcha", legende: "Le planning qu'Aïcha a punaisé au-dessus de son bureau : une colonne par jour, de minuit (en haut) à minuit (en bas). Sommeil en bleu nuit (8 h chaque nuit), cours en bleu, révisions en vert (2 h chaque soir de semaine, 4 h le samedi, 2 h le dimanche : 15 h 30), téléphone limité à 1 h à 1 h 30 (rouge).", svg: (function () {
    var W = 640, H = 486, x0 = 74, cw = 76, y0 = 86, ph = 13, s = liege(W, H) + "<rect x='28' y='22' width='" + (W - 56) + "' height='" + (H - 44) + "' fill='#FBF8F2' stroke='#D9C49C'/>" + punaise(40, 34, "#C62828") + punaise(W - 40, 34, "#1E499B") + punaise(40, H - 34, "#2E7D32") + punaise(W - 40, H - 34, "#F7C948");
    s += txt(W / 2, 46, "Ma semaine de révisions — Aïcha, Tle A", { s: 13, c: BLEU, i: true });
    [0, 6, 12, 18, 24].forEach(function (hh) { var y = y0 + hh * ph; s += "<path d='M" + x0 + " " + y + "H" + (x0 + 7 * cw) + "' stroke='#C9D2E3' stroke-dasharray='3 3'/>" + txt(x0 - 6, y + 4, hh + " h", { s: 9, a: "end", c: GRIS, w: 600 }); });
    SEMAINE.forEach(function (j, i) {
      var x = x0 + i * cw, y = y0, rv = 0;
      s += "<rect x='" + (x + 3) + "' y='" + (y0 - 18) + "' width='" + (cw - 6) + "' height='16' rx='4' fill='" + (i > 4 ? "#7B3F99" : NUIT) + "'/>" + txt(x + cw / 2, y0 - 6, JOURS[i], { s: 10, c: "#fff" });
      j.forEach(function (b) { var h = b[1] * ph; s += "<rect x='" + (x + 3) + "' y='" + y.toFixed(1) + "' width='" + (cw - 6) + "' height='" + (h - 1).toFixed(1) + "' rx='3' fill='" + ACT[b[0]][1] + "'/>"; if (b[0] === "rev") { rv += b[1]; s += txt(x + cw / 2, y + h / 2 + 4, String(b[1]).replace(".", ",") + " h", { s: 10, c: "#fff" }); } y += h; });
    });
    var lx = 30; Object.keys(ACT).forEach(function (k, i) { var xx = 36 + i * 82; s += "<rect x='" + xx + "' y='" + (H - 58) + "' width='12' height='12' rx='3' fill='" + ACT[k][1] + "' stroke='#9AA3AF'/>" + txt(xx + 16, H - 48, ACT[k][0], { s: 9.5, a: "start", w: 600 }); });
    return svg(W, H, "Planning d’une semaine punaisé sur un tableau en liège : sept colonnes Lundi à Dimanche, heures de 0 à 24 h, blocs de couleur pour sommeil, cours, révisions, sport, repas, détente et téléphone", "", s);
  })() });
  var MOISK = [["Septembre", ["cours"]], ["Octobre", ["cours", "sujet"]], ["Novembre", ["cours", "sujet"]], ["Décembre", ["cours", "sujet", "conge"]], ["Janvier", ["cours", "sujet"]], ["Février", ["cours", "sujet"]], ["Mars", ["cours", "sujet", "conge"]], ["Avril", ["cours", "blanc"]], ["Mai", ["blanc", "revision"]], ["Juin", ["bac"]]];
  var ETQ = { cours: ["cours + fiches", "#1E88E5"], sujet: ["1 sujet / matière", "#C62828"], conge: ["congés : révisions", "#F2C94C"], blanc: ["examen blanc", "#7B3F99"], revision: ["sujets chronométrés", "#2F6DB5"], bac: ["LE BAC", "#2E7D32"] };
  remplacerPlanche("tle-orient-bac", "L'année de Kevin, mois par mois", { type: "2D", titre: "L'année de Kevin, mois par mois", legende: "Le calendrier mural de Kevin, de septembre à juin : une case par mois. Bleu : cours et fiches ; rouge : un sujet d'examen par matière ; jaune : congés de Noël et de Pâques consacrés aux révisions ; violet : examens blancs en conditions réelles ; puis le bac, en juin.", svg: (function () {
    var W = 640, H = 330, s = liege(W, H) + "<rect x='26' y='20' width='" + (W - 52) + "' height='" + (H - 40) + "' fill='#FBF8F2' stroke='#D9C49C'/>" + punaise(40, 32, "#1E499B") + punaise(W - 40, 32, "#C62828");
    s += txt(W / 2, 44, "Objectif BAC — Kevin, Tle A, Bertoua", { s: 13, c: BLEU, i: true });
    MOISK.forEach(function (m, i) {
      var c = i % 5, r = Math.floor(i / 5), x = 40 + c * 114, y = 58 + r * 120, w = 106, h = 110;
      s += "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='" + h + "' rx='6' fill='#fff' stroke='#C9D2E3'/><rect x='" + x + "' y='" + y + "' width='" + w + "' height='22' rx='6' fill='" + (m[0] === "Juin" ? VERT : NUIT) + "'/>" + txt(x + w / 2, y + 15, m[0], { s: 11, c: "#fff" });
      m[1].forEach(function (b, k) { s += "<rect x='" + (x + 6) + "' y='" + (y + 28 + k * 26) + "' width='" + (w - 12) + "' height='22' rx='5' fill='" + ETQ[b][1] + "'/>" + txt(x + w / 2, y + 43 + k * 26, ETQ[b][0], { s: 9.5, c: b === "conge" ? NUIT : "#fff" }); });
      if (m[0] === "Juin") s += "<path d='M" + (x + 30) + " " + (y + 80) + "l10 12l26 -26' stroke='" + VERT + "' stroke-width='5' fill='none'/>";
    });
    return svg(W, H, "Calendrier mural de septembre à juin sur un tableau en liège : chaque mois porte ses étiquettes de couleur, cours, sujets d’examen, congés de révision, examens blancs, et le bac en juin", "", s);
  })() });

  /* ═══════════ CELLULE ANIMALE ET CELLULE VÉGÉTALE EN HAUTE DÉFINITION (ultrastructure) ═══════════ */
  var DEFC = "<radialGradient id='cyA' cx='45%' cy='40%' r='65%'><stop offset='0' stop-color='#FFF4F2'/><stop offset='.7' stop-color='#FBE1E4'/><stop offset='1' stop-color='#F2C6CF'/></radialGradient>" +
    "<radialGradient id='cyV' cx='50%' cy='45%' r='70%'><stop offset='0' stop-color='#F8FBEA'/><stop offset='1' stop-color='#E6F0C8'/></radialGradient>" +
    "<radialGradient id='noy' cx='40%' cy='35%' r='70%'><stop offset='0' stop-color='#E6DAF4'/><stop offset='.75' stop-color='#C3ABE2'/><stop offset='1' stop-color='#9C7BC9'/></radialGradient>" +
    "<radialGradient id='nuc' cx='35%' cy='35%' r='70%'><stop offset='0' stop-color='#7E5BB0'/><stop offset='1' stop-color='#3F2669'/></radialGradient>" +
    "<radialGradient id='mit' cx='40%' cy='35%' r='75%'><stop offset='0' stop-color='#FBC98E'/><stop offset='1' stop-color='#D9773A'/></radialGradient>" +
    "<radialGradient id='chl' cx='40%' cy='35%' r='75%'><stop offset='0' stop-color='#9CD27A'/><stop offset='1' stop-color='#3C8A2E'/></radialGradient>" +
    "<radialGradient id='vac' cx='45%' cy='40%' r='70%'><stop offset='0' stop-color='#F4FAFE'/><stop offset='1' stop-color='#CFE6F4'/></radialGradient>" +
    "<radialGradient id='lys' cx='35%' cy='35%' r='70%'><stop offset='0' stop-color='#D7F0C8'/><stop offset='1' stop-color='#7DB86A'/></radialGradient>";
  function mito(x, y, r, s) {
    var g = "<g transform='translate(" + x + " " + y + ") rotate(" + r + ") scale(" + (s || 1) + ")'><ellipse rx='26' ry='12' fill='url(#mit)' stroke='#A2511F' stroke-width='1.6'/><ellipse rx='22.5' ry='8.8' fill='none' stroke='#B5602A' stroke-width='1'/>", k;
    for (k = -3; k <= 3; k++) g += "<path d='M" + (k * 6.4) + " " + (k % 2 ? -8.6 : 8.6) + "q" + (k % 2 ? 2 : -2) + " " + (k % 2 ? 9 : -9) + " 0 " + (k % 2 ? 12 : -12) + "' stroke='#A2511F' stroke-width='1.3' fill='none'/>";
    return g + "</g>";
  }
  function chloro(x, y, r, s) {
    var g = "<g transform='translate(" + x + " " + y + ") rotate(" + r + ") scale(" + (s || 1) + ")'><ellipse rx='30' ry='14' fill='url(#chl)' stroke='#2B6420' stroke-width='1.6'/><ellipse rx='26.5' ry='10.8' fill='none' stroke='#3C7A2C' stroke-width='.8'/>", k, j;
    for (k = -2; k <= 2; k++) { for (j = 0; j < 4; j++) g += "<rect x='" + (k * 10 - 3.5) + "' y='" + (-6 + j * 3.2) + "' width='7' height='2.4' rx='1' fill='#1F5A1A'/>"; if (k < 2) g += "<path d='M" + (k * 10 + 3.5) + " " + (k % 2 ? -1 : 2) + "h3' stroke='#1F5A1A' stroke-width='.9'/>"; }
    return g + "<ellipse cx='14' cy='-6' rx='4' ry='2.6' fill='#F4F1EA' stroke='#C9C0AE' stroke-width='.6'/></g>";
  }
  function golgi(x, y, r, s, coul) {
    var g = "<g transform='translate(" + x + " " + y + ") rotate(" + r + ") scale(" + (s || 1) + ")'>", k;
    for (k = 0; k < 5; k++) { var L = 34 - Math.abs(k - 2) * 4; g += "<path d='M" + (-L) + " " + (k * 6) + "q" + L + " -12 " + (2 * L) + " 0' stroke='" + (coul || "#E0A52A") + "' stroke-width='4.2' fill='none' stroke-linecap='round'/>"; }
    [[-36, 8], [38, 14], [-32, 26], [34, 30], [42, -2]].forEach(function (v) { g += "<circle cx='" + v[0] + "' cy='" + v[1] + "' r='3.2' fill='#F7D774' stroke='#C9902A' stroke-width='.8'/>"; });
    return g + "</g>";
  }
  function rer(x, y, r, s) {
    var g = "<g transform='translate(" + x + " " + y + ") rotate(" + r + ") scale(" + (s || 1) + ")'>", k, R = alea(61);
    for (k = 0; k < 4; k++) { var d = "M-40 " + (k * 9) + "q10 -8 20 0t20 0t20 0t20 0"; g += "<path d='" + d + "' stroke='#5E9CC8' stroke-width='4.5' fill='none' stroke-linecap='round'/><path d='" + d + "' stroke='#CFE6F4' stroke-width='1.6' fill='none'/>"; var j; for (j = 0; j < 12; j++) g += "<circle cx='" + (-40 + j * 7 + R() * 2).toFixed(1) + "' cy='" + (k * 9 - 3.2 + (j % 2) * 6.4 + Math.sin(j) * 1.5).toFixed(1) + "' r='1.25' fill='#1F3F6B'/>"; }
    return g + "</g>";
  }
  function rel(x, y, r) { return "<g transform='translate(" + x + " " + y + ") rotate(" + r + ")'><path d='M-30 0q8 -12 18 -2t18 2t20 -6M-24 10q10 6 20 -2t22 4' stroke='#8CC6DE' stroke-width='4' fill='none' stroke-linecap='round'/></g>"; }
  function etiq(x1, y1, x2, y2, t, cote) { return "<path d='M" + x1 + " " + y1 + "L" + x2 + " " + y2 + "' stroke='#3D4A5C' stroke-width='1'/><circle cx='" + x1 + "' cy='" + y1 + "' r='2.2' fill='#3D4A5C'/>" + txt(x2 + (cote === "g" ? -4 : 4), y2 + 4, t, { s: 11, a: cote === "g" ? "end" : "start", w: 650, c: "#1F2A3D" }); }
  function noyauHD(x, y, rx, ry) {
    var g = "<g data-o='noyau'><ellipse cx='" + x + "' cy='" + y + "' rx='" + (rx + 4) + "' ry='" + (ry + 4) + "' fill='#B49ADB' stroke='#6D4FA0' stroke-width='1.6'/><ellipse cx='" + x + "' cy='" + y + "' rx='" + rx + "' ry='" + ry + "' fill='url(#noy)' stroke='#6D4FA0' stroke-width='1'/>", k, R = alea(17);
    for (k = 0; k < 12; k++) { var a = k / 12 * 6.283; g += "<circle cx='" + (x + (rx + 2) * Math.cos(a)).toFixed(1) + "' cy='" + (y + (ry + 2) * Math.sin(a)).toFixed(1) + "' r='1.8' fill='#F8F4FC'/>"; }
    for (k = 0; k < 18; k++) g += "<path d='M" + (x - rx * 0.7 + R() * rx * 1.4).toFixed(1) + " " + (y - ry * 0.6 + R() * ry * 1.2).toFixed(1) + "q" + (R() * 8 - 4).toFixed(1) + " " + (R() * 8 - 4).toFixed(1) + " " + (R() * 10 - 5).toFixed(1) + " " + (R() * 6 - 3).toFixed(1) + "' stroke='#7A5BA8' stroke-width='1.4' fill='none' opacity='.75'/>";
    return g + "</g><g data-o='nucleole'><circle cx='" + (x + rx * 0.2) + "' cy='" + (y - ry * 0.1) + "' r='" + (rx * 0.3) + "' fill='url(#nuc)'/></g>";
  }
  function celluleAnimale(interactif) {
    var s = "<rect width='640' height='440' fill='#FBFAF8'/>", R = alea(29), k;
    var forme = "M322 52C410 50 486 92 500 168C514 244 486 330 410 370C334 410 236 402 182 352C128 302 118 214 150 148C182 82 246 54 322 52Z";
    s += "<g data-o='membrane'><path d='" + forme + "' fill='#E9A7B6' transform='translate(0 0)'/><path d='" + forme + "' fill='url(#cyA)' stroke='#B03A5B' stroke-width='3.2'/><path d='" + forme + "' fill='none' stroke='#F6D3DB' stroke-width='1' transform='translate(1.5 1.5) scale(.995)'/></g>";
    for (k = 0; k < 26; k++) s += "<path d='M" + (180 + R() * 300).toFixed(0) + " " + (90 + R() * 260).toFixed(0) + "l" + (R() * 50 - 25).toFixed(0) + " " + (R() * 50 - 25).toFixed(0) + "' stroke='#E7B9C4' stroke-width='.8' opacity='.7'/>";
    s += "<g data-o='rer'>" + rer(250, 140, -20, 1) + rer(388, 268, 30, 0.9) + "</g>";
    s += noyauHD(310, 214, 62, 52);
    s += "<g data-o='rel'>" + rel(224, 300, 10) + rel(420, 140, -30) + "</g>";
    s += "<g data-o='mito'>" + mito(206, 210, 70, 1) + mito(430, 210, -20, 1) + mito(300, 330, 10, 0.95) + mito(372, 96, 15, 0.85) + "</g>";
    s += "<g data-o='golgi'>" + golgi(402, 330, -20, 0.9) + "</g>";
    s += "<g data-o='lysosome'><circle cx='238' cy='96' r='11' fill='url(#lys)' stroke='#4E8A3E'/><circle cx='466' cy='272' r='9' fill='url(#lys)' stroke='#4E8A3E'/>" + [[234, 93], [241, 99], [237, 101], [464, 270], [469, 275]].map(function (p) { return "<circle cx='" + p[0] + "' cy='" + p[1] + "' r='1.4' fill='#2F5A26'/>"; }).join("") + "</g>";
    s += "<g data-o='centrosome'><g transform='translate(262 362) rotate(-10)'><rect x='-10' y='-4' width='20' height='8' rx='2' fill='#9A8FC0' stroke='#5E5390'/><path d='M-6 -4v8M-2 -4v8M2 -4v8M6 -4v8' stroke='#5E5390' stroke-width='.8'/></g><g transform='translate(276 350) rotate(80)'><rect x='-10' y='-4' width='20' height='8' rx='2' fill='#9A8FC0' stroke='#5E5390'/><path d='M-6 -4v8M-2 -4v8M2 -4v8M6 -4v8' stroke='#5E5390' stroke-width='.8'/></g></g>";
    s += "<g data-o='vesicule'>" + [[452, 312], [462, 330], [440, 352], [178, 260]].map(function (p) { return "<circle cx='" + p[0] + "' cy='" + p[1] + "' r='5' fill='#FFF7D6' stroke='#C9A04A'/>"; }).join("") + "</g>";
    s += "<g data-o='ribosomes'>"; for (k = 0; k < 40; k++) { var px = 175 + R() * 310, py = 80 + R() * 280; if (Math.hypot((px - 310) / 70, (py - 214) / 60) > 1) s += "<circle cx='" + px.toFixed(1) + "' cy='" + py.toFixed(1) + "' r='1.3' fill='#1F3F6B'/>"; } s += "</g>";
    if (!interactif) {
      s += etiq(322, 53, 120, 40, "membrane plasmique", "g") + etiq(200, 168, 120, 92, "cytoplasme", "g") + etiq(206, 210, 120, 150, "mitochondrie", "g") + etiq(232, 128, 120, 120, "réticulum rugueux", "g") + etiq(238, 96, 120, 64, "lysosome", "g") + etiq(214, 300, 120, 300, "réticulum lisse", "g") + etiq(266, 360, 120, 360, "centrosome", "g");
      s += etiq(310, 214, 540, 214, "noyau (ADN)", "d") + etiq(322, 209, 540, 186, "nucléole", "d") + etiq(372, 170, 540, 150, "enveloppe à pores", "d") + etiq(402, 330, 540, 330, "appareil de Golgi", "d") + etiq(462, 330, 540, 360, "vésicules", "d") + etiq(430, 120, 540, 110, "ribosomes libres", "d");
      s += "<path d='M520 394h60' stroke='#1F2A3D' stroke-width='3'/>" + txt(550, 410, "≈ 5 µm", { s: 11 }) + txt(130, 432, "Cellule animale vue au microscope électronique (schéma d'ultrastructure)", { s: 11, a: "start", c: GRIS, w: 600 });
    }
    return s;
  }
  function celluleVegetale(interactif) {
    var s = "<rect width='640' height='440' fill='#FBFAF8'/>", R = alea(43), k;
    s += "<g data-o='paroi'><rect x='150' y='40' width='340' height='350' rx='18' fill='#A9C978' stroke='#5F8A33' stroke-width='2'/><rect x='136' y='26' width='368' height='378' rx='24' fill='none' stroke='#C7DCA0' stroke-width='10' opacity='.6'/>";
    [[150, 140], [150, 290], [490, 110], [490, 260], [260, 40], [380, 390]].forEach(function (p) { var v = p[0] === 150 || p[0] === 490; s += "<rect x='" + (v ? p[0] - 6 : p[0] - 3) + "' y='" + (v ? p[1] - 3 : p[1] - 6) + "' width='" + (v ? 12 : 6) + "' height='" + (v ? 6 : 12) + "' fill='#F1F7DA'/><path d='" + (v ? "M" + (p[0] - 8) + " " + p[1] + "h16" : "M" + p[0] + " " + (p[1] - 8) + "v16") + "' stroke='#5F8A33' stroke-width='1.2' data-o='plasmodesme'/>"; });
    s += "</g><g data-o='membrane'><rect x='162' y='52' width='316' height='326' rx='12' fill='url(#cyV)' stroke='#3C6E2E' stroke-width='1.6'/></g>";
    s += "<g data-o='vacuole'><path d='M232 108C300 92 400 96 432 132C462 168 458 260 430 300C402 340 300 346 252 320C206 294 196 220 204 170C210 134 214 112 232 108Z' fill='url(#vac)' stroke='#4F8FB8' stroke-width='2'/>";
    for (k = 0; k < 10; k++) s += "<circle cx='" + (240 + R() * 180).toFixed(0) + "' cy='" + (130 + R() * 170).toFixed(0) + "' r='" + (1 + R() * 2).toFixed(1) + "' fill='#9EC5DE' opacity='.7'/>";
    s += "</g>";
    s += "<g data-o='chloroplaste'>" + chloro(196, 86, 20, 0.95) + chloro(456, 92, -30, 0.9) + chloro(186, 250, 80, 0.95) + chloro(462, 214, 95, 0.95) + chloro(300, 360, 5, 0.95) + chloro(410, 356, -10, 0.85) + "</g>";
    s += noyauHD(220, 336, 30, 24).replace(/data-o='noyau'/, "data-o='noyau'");
    s += "<g data-o='mito'>" + mito(452, 300, 70, 0.7) + mito(186, 176, 90, 0.7) + mito(338, 72, 0, 0.7) + "</g>";
    s += "<g data-o='golgi'>" + golgi(458, 150, 80, 0.55, "#E0A52A") + "</g><g data-o='rer'>" + rer(270, 70, 0, 0.6) + "</g>";
    s += "<g data-o='ribosomes'>"; for (k = 0; k < 30; k++) { var px = 168 + R() * 300, py = 58 + R() * 314; var inV = px > 210 && px < 450 && py > 100 && py < 330; if (!inV) s += "<circle cx='" + px.toFixed(1) + "' cy='" + py.toFixed(1) + "' r='1.2' fill='#1F3F6B'/>"; } s += "</g>";
    if (!interactif) {
      s += etiq(150, 200, 110, 200, "paroi (cellulose)", "g") + etiq(163, 120, 110, 120, "membrane plasmique", "g") + etiq(196, 86, 110, 70, "chloroplaste", "g") + etiq(204, 82, 110, 44, "grana (thylakoïdes)", "g") + etiq(186, 176, 110, 160, "mitochondrie", "g") + etiq(150, 290, 110, 290, "plasmodesme", "g") + etiq(220, 336, 110, 340, "noyau", "g") + etiq(226, 334, 110, 372, "nucléole", "g");
      s += etiq(330, 210, 530, 210, "vacuole", "d") + etiq(432, 132, 530, 128, "tonoplaste", "d") + etiq(458, 150, 530, 160, "appareil de Golgi", "d") + etiq(270, 70, 530, 60, "réticulum", "d") + etiq(470, 360, 530, 330, "cytoplasme", "d") + etiq(314, 354, 530, 380, "grain d'amidon", "d");
      s += "<path d='M520 400h60' stroke='#1F2A3D' stroke-width='3'/>" + txt(550, 416, "≈ 10 µm", { s: 11 }) + txt(130, 434, "Cellule végétale (feuille) au microscope électronique (schéma d'ultrastructure)", { s: 11, a: "start", c: GRIS, w: 600 });
    }
    return s;
  }
  var PL_ANI = { type: "2D", titre: "La cellule animale en haute définition", legende: "Une cellule animale telle que la révèle le microscope électronique : membrane plasmique, cytoplasme, noyau à double enveloppe percée de pores, nucléole, mitochondries à crêtes, réticulum rugueux couvert de ribosomes, réticulum lisse, appareil de Golgi et ses vésicules, lysosomes, centrosome. Couleurs conventionnelles : en réalité, les organites sont incolores.", svg: svg(760, 444, "Schéma détaillé d’une cellule animale avec ses organites légendés : membrane, noyau, nucléole, mitochondries, réticulum, Golgi, lysosomes, centrosome, ribosomes", DEFC, "<g transform='translate(60 0)'>" + celluleAnimale(false) + "</g>") };
  var PL_VEG = { type: "2D", titre: "La cellule végétale en haute définition", legende: "Une cellule de feuille au microscope électronique : la paroi de cellulose, percée de plasmodesmes, entoure la membrane plasmique ; une grande vacuole occupe le centre et repousse le noyau et les chloroplastes (avec leurs grana et leurs grains d'amidon) contre la paroi ; mitochondries, réticulum et appareil de Golgi sont aussi présents. Couleurs conventionnelles.", svg: svg(760, 444, "Schéma détaillé d’une cellule végétale : paroi, plasmodesmes, membrane, grande vacuole, chloroplastes à grana, noyau, mitochondries, Golgi", DEFC, "<g transform='translate(60 0)'>" + celluleVegetale(false) + "</g>") };
  (function () { var L = ancien("tle-sc-microscopie"); if (L && L.parties[3]) L.parties[3].planches = [PL_ANI, PL_VEG].concat(L.parties[3].planches || []); })();
  (function () { var L = ancien("tle-sc-organites"); if (L && L.parties[1]) L.parties[1].planches = (L.parties[1].planches || []).concat([PL_ANI, PL_VEG]); })();
  var ORG = {
    membrane: ["Membrane plasmique", "Fine enveloppe qui limite la cellule et contrôle les échanges avec le milieu (eau, ions, nutriments)."],
    noyau: ["Noyau", "Contient l'ADN (la chromatine) : il commande la cellule. Son enveloppe double est percée de pores."],
    nucleole: ["Nucléole", "Zone dense du noyau où sont fabriqués les ribosomes."],
    mito: ["Mitochondrie", "Centrale énergétique : la respiration cellulaire y produit l'énergie (ATP). Double membrane, la membrane interne forme des crêtes."],
    rer: ["Réticulum endoplasmique rugueux", "Sacs aplatis couverts de ribosomes : fabrication des protéines destinées à être exportées."],
    rel: ["Réticulum lisse", "Tubes sans ribosomes : fabrication des lipides, détoxification."],
    golgi: ["Appareil de Golgi", "Saccules empilés qui modifient, trient et emballent les protéines dans des vésicules."],
    lysosome: ["Lysosome (cellule animale)", "Petite vésicule pleine d'enzymes : digestion à l'intérieur de la cellule."],
    centrosome: ["Centrosome (cellule animale)", "Deux centrioles perpendiculaires : ils organisent le fuseau lors de la division cellulaire."],
    vesicule: ["Vésicules", "Petits sacs qui transportent des substances d'un organite à l'autre ou vers l'extérieur."],
    ribosomes: ["Ribosomes", "Minuscules grains (libres ou fixés au réticulum) qui assemblent les protéines."],
    paroi: ["Paroi (cellule végétale)", "Enveloppe rigide de cellulose, à l'extérieur de la membrane : elle soutient et protège la cellule."],
    plasmodesme: ["Plasmodesmes", "Fins canaux à travers la paroi qui relient le cytoplasme des cellules voisines."],
    vacuole: ["Vacuole (cellule végétale)", "Grande poche d'eau et de substances dissoutes : réserve, et turgescence qui maintient la plante droite."],
    chloroplaste: ["Chloroplaste (cellule végétale)", "Siège de la photosynthèse : ses thylakoïdes, empilés en grana, captent la lumière ; il stocke l'amidon."]
  };
  window.VRT_CELLULES = { DEFC: DEFC, animale: celluleAnimale, vegetale: celluleVegetale, ORG: ORG, chromosome: chromosome, LONG: LONG, CENT: CENT };

})();
