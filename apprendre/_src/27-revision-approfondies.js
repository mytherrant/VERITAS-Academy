/* Leçons APPROFONDIES — révision, lot 19 (18/11/2026) : mise à niveau des leçons déjà approfondies auxquelles il manquait
   une planche 3D, une simulation, une planche 2D ou des questions de quiz (audit sur les 91 leçons). AJOUTS SEULEMENT (completer) :
   rien n'est retiré. Dénombrement 2nde A (r26, r27, r28), Kamerun et mangrove (3e), bac (Tle), piste (6e), production (2nde C). */
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
  function bloc(x, y, w, h, c, l1, l2) {
    return "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='" + h + "' rx='10' fill='" + c + "'/>" + txt(x + w / 2, y + h / 2 - (l2 ? 3 : -5), l1, { s: 14, c: "#fff" }) + (l2 ? txt(x + w / 2, y + h / 2 + 14, l2, { s: 10, c: "#fff", w: 500 }) : "");
  }
  /* ajoute des planches à une partie et des questions au quiz, sans rien retirer */
  function completer(id, ajouts, questions) {
    var L = ancien(id); if (!L) return;
    (ajouts || []).forEach(function (a) { var p = L.parties[a[0]]; if (p) p.planches = (p.planches || []).concat(a[1]); });
    if (questions) { var vus = {}; (L.quiz || []).forEach(function (x) { vus[x.q] = 1; }); L.quiz = (L.quiz || []).concat(questions.filter(function (x) { return !vus[x.q]; })).slice(0, 10); }
  }
  function pion(o, x, z, coul, peau) { o.push({ f: "cylindre", c: [x, 0, z], r: 4.5, r2: 3.2, h: 16, n: 8, coul: coul }); o.push({ f: "sphere", c: [x, 20, z], r: 4, coul: peau || "#5A3A1E" }); }

  /* ═══════════ 2nde A — DIAGRAMME DE VENN ET TABLEAU À DOUBLE ENTRÉE ═══════════ */
  function classeTriee3D() {
    var o = [], R = alea(9), Z = [["lecture et danse", 7, -70, -60, "#7B3F99"], ["lecture seulement", 13, 70, -60, "#1E499B"], ["danse seulement", 11, -70, 60, "#C2540A"], ["aucun club", 17, 70, 60, "#6F737C"]];
    o.push({ f: "boite", c: [0, -6, 0], d: [340, 6, 290], coul: "#8B6B4A", dessus: "#C9B28A" });
    Z.forEach(function (z) {
      o.push({ f: "boite", c: [z[2], -2, z[3]], d: [130, 2, 110], coul: z[4], dessus: z[4], div: false });
      var k; for (k = 0; k < z[1]; k++) pion(o, z[2] - 48 + (k % 5) * 24 + (R() - 0.5) * 3, z[3] - 36 + Math.floor(k / 5) * 22, ["#F4F1EA", "#DCE6F2", "#F7C948"][k % 3], ["#5A3A1E", "#6B4423", "#4A2E1A"][k % 3]);
    });
    return o;
  }
  completer("2nde-a-maths-r26", [[1, [{ type: "3d", titre: "La classe rangée dans le tableau", legende: "Tourne la cour : les 48 élèves se sont rangés sur quatre tapis, comme dans les quatre cases du tableau à double entrée. Violet : lecture et danse (7) ; bleu : lecture seulement (13) ; orange : danse seulement (11) ; gris : aucun club (17). Chaque élève est sur un seul tapis.",
    modele: { h: 360, rx: -40, ry: 18, echelle: 0.85, alt: "Quatre tapis de couleur avec 7, 13, 11 et 17 élèves debout", objets: classeTriee3D(),
      etiquettes: [{ p: [-70, 24, -60], t: "lecture et danse : 7", cote: "g" }, { p: [70, 24, -60], t: "lecture seulement : 13", cote: "d" }, { p: [-70, 24, 60], t: "danse seulement : 11", cote: "g" }, { p: [70, 24, 60], t: "aucun club : 17", cote: "d" }] } }]]],
    [q("Dans le tableau à double entrée, le total général vaut…", "l'effectif de la classe, 48", "20 + 18 = 38", "7", "Chaque élève est compté une seule fois."), q("La case « lecture : non ; danse : non » contient…", "les élèves sans club", "les élèves des deux clubs", "les élèves de danse", "48 − 31 = 17.")]);

  /* ═══════════ 2nde A — ARBRE DE CHOIX ET ARBRE DES PARTIES ═══════════ */
  var PAGNES = [["ndop", "#1F2A5A"], ["kaba", "#E8A33D"], ["wax", "#C62828"]];
  function tenues3D() {
    var o = [];
    o.push({ f: "boite", c: [0, -6, 0], d: [420, 6, 260], coul: "#8B5A2B", dessus: "#A06A38" });
    PAGNES.forEach(function (p, i) {
      var z = -80 + i * 80;
      [0, 1, 2, 3].forEach(function (j) {
        var x = -135 + j * 90, robe = j < 2, coiffe = j % 2 === 0;
        if (robe) o.push({ f: "cylindre", c: [x, 0, z], r: 18, r2: 8, h: 44, n: 14, coul: p[1] });
        else { o.push({ f: "cylindre", c: [x, 0, z], r: 11, r2: 10, h: 24, n: 12, coul: p[1] }); o.push({ f: "cylindre", c: [x, 24, z], r: 9, r2: 8, h: 20, n: 12, coul: p[1] }); o.push({ f: "boite", c: [x, 25, z], d: [20, 3, 20], coul: "#F4F1EA", div: false }); }
        o.push({ f: "cylindre", c: [x, 44, z], r: 3, h: 6, n: 8, coul: "#6B4423" });
        o.push({ f: "sphere", c: [x, 56, z], r: 8, coul: "#6B4423" });
        if (coiffe) o.push({ f: "sphere", c: [x, 64, z], r: [11, 7, 10], coul: p[1] });
      });
    });
    return o;
  }
  completer("2nde-a-maths-r27", [[1, [{ type: "3d", titre: "Les 12 tenues sur leurs mannequins", legende: "Tourne le défilé : trois rangées de pagnes (ndop indigo, kaba orange, wax rouge) ; dans chaque rangée, deux robes puis deux ensembles, chacun avec ou sans coiffe. 3 rangées × 4 colonnes = 12 tenues, toutes différentes : une par fille.",
    modele: { h: 360, rx: -30, ry: 24, echelle: 0.85, alt: "Douze mannequins en trois rangées de pagnes, robes et ensembles, avec ou sans coiffe", objets: tenues3D(),
      etiquettes: [{ p: [-180, 30, -80], t: "ndop", cote: "g" }, { p: [-180, 30, 0], t: "kaba", cote: "g" }, { p: [-180, 30, 80], t: "wax", cote: "g" }, { p: [-135, 70, -80], t: "robe + coiffe", cote: "d" }, { p: [135, 50, -80], t: "ensemble sans coiffe", cote: "d" }] } }]]],
    [q("Avec 3 pagnes, 2 modèles et une coiffe obligatoire (1 option) :", "6 tenues", "12 tenues", "5 tenues", "3 × 2 × 1 = 6."), q("Un arbre de choix à 3 étapes de 2 branches chacune a…", "8 chemins", "6 chemins", "3 chemins", "2 × 2 × 2 = 8.")]);

  /* ═══════════ 2nde A — INTÉGRATION : LA KERMESSE ═══════════ */
  completer("2nde-a-maths-r28", null, [q("75 au stand, 50 aux dames, 30 aux deux : dames seulement ?", "20", "50", "45", "50 − 30 = 20."), q("Pour 30 tickets et 4 × 3 × 2 plateaux :", "les tickets suffisent (24 ≤ 30)", "il en manque 6", "il faut 9 tickets", "4 × 3 × 2 = 24.")]);

  /* ═══════════ 3e HISTOIRE — LE KAMERUN ═══════════ */
  completer("3e-hist-kamerun", null, null);

  /* ═══════════ 3e GÉOGRAPHIE — LA MANGROVE ═══════════ */
  completer("3e-geo-mangrove", null, null);

  /* ═══════════ Tle — PRÉPARER LE BAC ═══════════ */
  completer("tle-orient-bac", [[2, [{ type: "2D", titre: "Une journée d'élève de Terminale équilibrée", legende: "Une journée de 24 heures en période de cours : environ 8 heures de sommeil, les cours, deux heures de travail personnel, du sport ou de la marche, des repas réguliers et un temps libre. Le sommeil n'est pas du temps perdu : c'est pendant la nuit que la mémoire fixe ce qu'on a appris.", svg: (function () {
    var P = [["sommeil", 8, "#2F3E73"], ["toilette, repas", 2, "#E8A33D"], ["trajet", 1, "#9AA3AF"], ["cours", 7, "#4A90C2"], ["sport / marche", 1, VERT], ["travail perso", 2, "#7B3F99"], ["détente, famille", 2, "#C2540A"], ["repas du soir", 1, "#D9B77A"]], s = "<rect width='640' height='260' fill='#FBF8F2'/>", a = -Math.PI / 2, cx = 150, cy = 130, R = 105;
    P.forEach(function (p) { var b = a + p[1] / 24 * 2 * Math.PI, x1 = cx + R * Math.cos(a), y1 = cy + R * Math.sin(a), x2 = cx + R * Math.cos(b), y2 = cy + R * Math.sin(b); s += "<path d='M" + cx + " " + cy + "L" + x1.toFixed(1) + " " + y1.toFixed(1) + "A" + R + " " + R + " 0 " + (b - a > Math.PI ? 1 : 0) + " 1 " + x2.toFixed(1) + " " + y2.toFixed(1) + "Z' fill='" + p[2] + "' stroke='#fff' stroke-width='2'/>"; a = b; });
    s += "<circle cx='" + cx + "' cy='" + cy + "' r='34' fill='#fff'/>" + txt(cx, cy + 5, "24 h", { s: 16 });
    P.forEach(function (p, i) { s += "<rect x='300' y='" + (24 + i * 28) + "' width='18' height='18' rx='4' fill='" + p[2] + "'/>" + txt(328, 38 + i * 28, p[0] + " : " + p[1] + " h", { s: 13, a: "start", w: 600 }); });
    return svg(640, 260, "Diagramme circulaire d’une journée de 24 heures : 8 h de sommeil, 7 h de cours, 2 h de travail personnel, sport, repas, détente", "", s);
  })() }]]], null);

  /* ═══════════ 6e EPS — LA PISTE ═══════════ */
  completer("6e-eps-piste", [[2, [{ type: "2D", titre: "Le relais 4 × 100 m et sa zone de transmission", legende: "Au relais, le témoin passe de main en main à l'intérieur de la zone de transmission (30 m depuis 2018 : elle commence 10 m avant la ligne des 100 m et finit 20 m après). Un témoin passé hors de la zone entraîne la disqualification de l'équipe.", svg: (function () {
    var s = "<rect width='640' height='200' fill='#6E9B45'/><rect y='60' width='640' height='90' fill='#B5442C'/><path d='M0 60H640M0 90H640M0 120H640M0 150H640' stroke='#F4F1EA' stroke-width='2'/>";
    s += "<rect x='200' y='90' width='300' height='30' fill='#F7C948' opacity='.45'/><path d='M200 84V126M500 84V126' stroke='#F7C948' stroke-width='4'/><path d='M300 84V126' stroke='#fff' stroke-width='3' stroke-dasharray='4 3'/>";
    s += txt(350, 40, "zone de transmission : 30 m", { s: 13, c: "#fff" }) + "<path d='M200 50H500' stroke='#fff' stroke-width='2'/><path d='M200 44V56M500 44V56' stroke='#fff' stroke-width='2'/>" + txt(250, 176, "10 m", { s: 12, c: "#fff" }) + txt(400, 176, "20 m", { s: 12, c: "#fff" }) + txt(300, 192, "ligne des 100 m", { s: 11, c: "#fff", w: 500 });
    s += "<g transform='translate(250 105)'><circle cx='0' cy='-24' r='6' fill='#5A3A1E'/><path d='M0 -18V2M0 2l-8 14M0 2l8 14M0 -12l12 4' stroke='#1E499B' stroke-width='4' fill='none'/><rect x='12' y='-12' width='12' height='4' fill='#F7C948'/></g><g transform='translate(282 105)'><circle cx='0' cy='-24' r='6' fill='#6B4423'/><path d='M0 -18V2M0 2l-8 14M0 2l8 14M0 -12l-12 4' stroke='#C62828' stroke-width='4' fill='none'/></g>";
    s += "<path d='M60 105H170' stroke='#fff' stroke-width='3' marker-end='url(#rlF)'/>" + txt(115, 100, "sens de course", { s: 11, c: "#fff" });
    return svg(640, 200, "Couloir de piste avec la zone de transmission de 30 m en jaune et deux relayeurs qui se passent le témoin", fleche("rlF", "#fff"), s);
  })() }]]], null);

  /* ═══════════ 2nde C ECM — LA PRODUCTION ═══════════ */
  completer("2nde-c-ecm-production", [[1, [{ type: "2D", titre: "Les trois facteurs de production de la chocolaterie", legende: "Pour fabriquer des tablettes, Nadège combine la nature (fèves, eau, énergie), le travail (planteurs, ouvrières, vendeuse) et le capital (séchoir, broyeur, moules, argent investi). Sans l'un des trois, pas de production.", svg: (function () {
    var s = "<rect width='640' height='250' fill='#FBF8F2'/>";
    [[30, VERT, "NATURE", ["fèves de cacao", "eau, terre", "énergie (bois, électricité)"]], [236, BLEU, "TRAVAIL", ["planteurs", "ouvrières de l'atelier", "vendeuse, comptable"]], [442, "#7A4A1E", "CAPITAL", ["séchoir, broyeur", "moules, emballages", "argent investi"]]].forEach(function (c) {
      s += "<rect x='" + c[0] + "' y='20' width='170' height='170' rx='14' fill='#fff' stroke='" + c[1] + "' stroke-width='2.5'/><rect x='" + c[0] + "' y='20' width='170' height='34' rx='12' fill='" + c[1] + "'/>" + txt(c[0] + 85, 43, c[2], { s: 14, c: "#fff" });
      c[3].forEach(function (t, i) { s += txt(c[0] + 14, 84 + i * 30, "• " + t, { s: 12, a: "start", w: 500 }); });
    });
    s += "<path d='M115 196V214H527V196M321 196V214' stroke='" + NUIT + "' stroke-width='2' fill='none'/><path d='M321 214V226' stroke='" + NUIT + "' stroke-width='2' marker-end='url(#pfF)'/>" + txt(321, 246, "tablettes de chocolat (biens) vendues à Yaoundé (service)", { s: 12, c: NUIT });
    return svg(640, 255, "Trois colonnes : nature, travail, capital, qui se combinent pour produire des tablettes de chocolat", fleche("pfF", NUIT), s);
  })() }]]], null);

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  VRT_A("2nde-a-maths-r26", 0, "Règle les effectifs, le diagramme se met à jour", function (el) {
    var V = { n: 48, a: 20, b: 18, ab: 7 };
    el.innerHTML = [["n", "Élèves de la classe", 20, 80], ["a", "Club de lecture", 0, 60], ["b", "Club de danse", 0, 60], ["ab", "Aux deux clubs", 0, 40]].map(function (c) { return "<label class='labo-c'><span>" + c[1] + " : <b data-v" + c[0] + ">" + V[c[0]] + "</b></span><input type='range' min='" + c[2] + "' max='" + c[3] + "' value='" + V[c[0]] + "' data-" + c[0] + "></label>"; }).join("") + "<div data-g style='margin:8px 0'></div><p class='labo-r' data-r></p>";
    function maj() {
      ["n", "a", "b", "ab"].forEach(function (k) { V[k] = +el.querySelector("[data-" + k + "]").value; el.querySelector("[data-v" + k + "]").textContent = V[k]; });
      var ok = V.ab <= Math.min(V.a, V.b) && V.a + V.b - V.ab <= V.n, u = V.a + V.b - V.ab, s = "<rect width='480' height='220' fill='#FBF8F2'/><rect x='10' y='10' width='460' height='200' rx='12' fill='#fff' stroke='#9AA3AF'/>" + txt(30, 34, "E (" + V.n + ")", { s: 13, a: "start", c: GRIS });
      s += "<circle cx='190' cy='115' r='80' fill='#1E499B' fill-opacity='.18' stroke='#1E499B' stroke-width='2'/><circle cx='290' cy='115' r='80' fill='#C2540A' fill-opacity='.18' stroke='#C2540A' stroke-width='2'/>" + txt(150, 50, "Lecture", { s: 12, c: BLEU }) + txt(330, 50, "Danse", { s: 12, c: "#C2540A" });
      if (ok) s += txt(160, 122, String(V.a - V.ab), { s: 22, c: BLEU }) + txt(240, 122, String(V.ab), { s: 22, c: "#7B3F99" }) + txt(320, 122, String(V.b - V.ab), { s: 22, c: "#C2540A" }) + txt(420, 196, String(V.n - u), { s: 20, c: GRIS });
      el.querySelector("[data-g]").innerHTML = "<svg viewBox='0 0 480 220' style='max-width:520px;width:100%' role='img' aria-label='Diagramme de Venn avec les effectifs de chaque zone'>" + s + "</svg>";
      el.querySelector("[data-r]").innerHTML = ok ? "Au moins un club : " + V.a + " + " + V.b + " − " + V.ab + " = <b>" + u + "</b> · sans club : " + V.n + " − " + u + " = <b>" + (V.n - u) + "</b> · " + (V.n - u >= 15 ? "<b style='color:" + VERT + "'>le troisième club ouvre (≥ 15)</b>" : "<b style='color:" + ROUGE + "'>pas assez pour un troisième club</b>") : "<b style='color:" + ROUGE + "'>Impossible</b> : l'intersection ne peut dépasser aucun des deux clubs, et la réunion ne peut dépasser la classe.";
    }
    el.querySelectorAll("input").forEach(function (i) { i.addEventListener("input", maj); }); maj();
  });
  VRT_A("2nde-a-maths-r27", 1, "Construis l'arbre des tenues", function (el) {
    var V = { p: 3, m: 2, o: 2, f: 12 };
    el.innerHTML = [["p", "Pagnes", 1, 5], ["m", "Modèles", 1, 3], ["o", "Options (coiffe ou non…)", 1, 3], ["f", "Filles qui défilent", 1, 40]].map(function (c) { return "<label class='labo-c'><span>" + c[1] + " : <b data-v" + c[0] + ">" + V[c[0]] + "</b></span><input type='range' min='" + c[2] + "' max='" + c[3] + "' value='" + V[c[0]] + "' data-" + c[0] + "></label>"; }).join("") + "<div data-g style='margin:8px 0'></div><p class='labo-r' data-r></p>";
    var COUL = ["#1F2A5A", "#E8A33D", "#C62828", "#2E7D32", "#7B3F99"];
    function maj() {
      ["p", "m", "o", "f"].forEach(function (k) { V[k] = +el.querySelector("[data-" + k + "]").value; el.querySelector("[data-v" + k + "]").textContent = V[k]; });
      var N = V.p * V.m * V.o, H = 260, s = "<rect width='480' height='" + H + "' fill='#FBF8F2'/>", i, j, k, feu = 0;
      var Y = function (idx, tot) { return 14 + (idx + 0.5) * (H - 28) / tot; };
      for (i = 0; i < V.p; i++) { var yp = Y(i, V.p); s += "<path d='M20 " + H / 2 + "L140 " + yp + "' stroke='" + COUL[i] + "' stroke-width='2.5'/><circle cx='140' cy='" + yp + "' r='5' fill='" + COUL[i] + "'/>";
        for (j = 0; j < V.m; j++) { var ym = Y(i * V.m + j, V.p * V.m); s += "<path d='M140 " + yp + "L280 " + ym + "' stroke='" + COUL[i] + "' stroke-width='1.8'/><circle cx='280' cy='" + ym + "' r='4' fill='" + COUL[i] + "'/>";
          for (k = 0; k < V.o; k++) { var yo = Y(feu, N); s += "<path d='M280 " + ym + "L420 " + yo + "' stroke='" + COUL[i] + "' stroke-width='1.2'/><circle cx='420' cy='" + yo + "' r='3' fill='" + (feu < V.f ? VERT : "#9AA3AF") + "'/>"; feu++; } } }
      s += txt(140, H - 2, "pagne", { s: 10, c: GRIS }) + txt(280, H - 2, "modèle", { s: 10, c: GRIS }) + txt(420, H - 2, "option", { s: 10, c: GRIS });
      el.querySelector("[data-g]").innerHTML = "<svg viewBox='0 0 480 " + H + "' style='max-width:520px;width:100%' role='img' aria-label='Arbre de choix des tenues'>" + s + "</svg>";
      el.querySelector("[data-r]").innerHTML = V.p + " × " + V.m + " × " + V.o + " = <b>" + N + "</b> tenues différentes · " + (N >= V.f ? "<b style='color:" + VERT + "'>assez pour les " + V.f + " filles</b>" : "<b style='color:" + ROUGE + "'>il manque " + (V.f - N) + " tenue" + (V.f - N > 1 ? "s" : "") + "</b>");
    }
    el.querySelectorAll("input").forEach(function (i) { i.addEventListener("input", maj); }); maj();
  });
  VRT_A("2nde-a-maths-r28", 2, "Le tableau de bord du comité de la kermesse", function (el) {
    var V = { e: 120, s: 75, d: 50, sd: 30, b: 4, p: 3, de: 2, t: 25 };
    var C = [["e", "Élèves de 2nde", 50, 200], ["s", "Tiennent un stand", 0, 150], ["d", "Tournoi de dames", 0, 150], ["sd", "Les deux", 0, 100], ["b", "Boissons", 1, 6], ["p", "Plats", 1, 5], ["de", "Desserts", 1, 4], ["t", "Modèles de tickets", 1, 60]];
    el.innerHTML = "<div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:4px 14px'>" + C.map(function (c) { return "<label class='labo-c'><span>" + c[1] + " : <b data-v" + c[0] + ">" + V[c[0]] + "</b></span><input type='range' min='" + c[2] + "' max='" + c[3] + "' value='" + V[c[0]] + "' data-" + c[0] + "></label>"; }).join("") + "</div><p class='labo-r' data-r></p>";
    function maj() {
      C.forEach(function (c) { V[c[0]] = +el.querySelector("[data-" + c[0] + "]").value; el.querySelector("[data-v" + c[0] + "]").textContent = V[c[0]]; });
      var ok = V.sd <= Math.min(V.s, V.d) && V.s + V.d - V.sd <= V.e, u = V.s + V.d - V.sd, P = V.b * V.p * V.de;
      el.querySelector("[data-r]").innerHTML = (ok ? "<b>Participants</b> (Venn) : " + V.s + " + " + V.d + " − " + V.sd + " = <b>" + u + "</b> ; sans activité : <b>" + (V.e - u) + "</b>" : "<b style='color:" + ROUGE + "'>Effectifs impossibles</b> (vérifie « les deux » et le total)") + "<br><b>Plateaux</b> (arbre) : " + V.b + " × " + V.p + " × " + V.de + " = <b>" + P + "</b> ; tickets : " + V.t + " → " + (P <= V.t ? "<b style='color:" + VERT + "'>suffisants</b>" : "<b style='color:" + ROUGE + "'>il en manque " + (P - V.t) + "</b>");
    }
    el.querySelectorAll("input").forEach(function (i) { i.addEventListener("input", maj); }); maj();
  });
  VRT_A("3e-hist-kamerun", 2, "Remets les événements du Kamerun à leur date", function (el) {
    exercice(el, [["Traité germano-douala : le Cameroun devient protectorat allemand : ___", ["1884", "1914", "1916"], "12 juillet 1884, avec les chefs douala."], ["Les Bakweri de Kuva Likenye repoussent une colonne allemande à Buea : ___", ["1891", "1884", "1910"], "Victoire bakweri, avant la conquête de 1894."], ["Révolte des Bulu dans le Sud : ___", ["1899-1901", "1884", "1914"], "Contre la mainmise allemande sur le commerce."], ["Les Douala sont expropriés du plateau Joss : ___", ["1910-1914", "1891", "1884"], "Rudolf Duala Manga Bell conteste l'expropriation."], ["Rudolf Duala Manga Bell et Ngoso Din sont pendus ; Martin-Paul Samba est fusillé : ___", ["août 1914", "1916", "1884"], "Le 8 août 1914, au début de la Première Guerre mondiale."], ["Les dernières troupes allemandes capitulent à Mora : fin du Kamerun : ___", ["1916", "1914", "1919"], "Février 1916 ; le territoire est ensuite partagé."]], "Événement suivant", "Événement");
  });
  VRT_A("3e-geo-mangrove", 3, "Modèle simplifié : que se passe-t-il quand on coupe la mangrove ?", function (el) {
    el.innerHTML = "<label class='labo-c'><span>Mangrove coupée : <b data-cv>30</b> %</span><input type='range' min='0' max='90' step='5' value='30' data-c style='width:240px'></label><label class='labo-c' style='flex-direction:row;align-items:center;gap:6px'><input type='checkbox' data-f> <span>foyers améliorés et reboisement des berges</span></label><div data-g style='margin:8px 0'></div><p class='labo-r' data-r></p>";
    function maj() {
      var c = +el.querySelector("[data-c]").value / 100, f = el.querySelector("[data-f]").checked, reste = Math.min(1, (1 - c) + (f ? 0.15 : 0)), crev = Math.round(100 * Math.pow(reste, 1.3)), inond = Math.round(20 + 80 * Math.pow(1 - reste, 1.2)), bois = Math.round((f ? 55 : 100) * (0.4 + 0.6 * reste));
      el.querySelector("[data-cv]").textContent = Math.round(c * 100);
      var B = [["crevettes pêchées", crev, VERT], ["risque d'inondation", inond, ROUGE], ["bois de fumage disponible", bois, "#8B5A2B"]], s = "<rect width='480' height='160' fill='#FBF8F2'/>";
      B.forEach(function (b, i) { s += txt(16, 34 + i * 46, b[0], { s: 12, a: "start" }) + "<rect x='200' y='" + (20 + i * 46) + "' width='260' height='20' rx='6' fill='#E3E7EF'/><rect x='200' y='" + (20 + i * 46) + "' width='" + (2.6 * b[1]).toFixed(0) + "' height='20' rx='6' fill='" + b[2] + "'/>" + txt(456, 35 + i * 46, b[1] + " / 100", { s: 11, a: "end", c: NUIT }); });
      el.querySelector("[data-g]").innerHTML = "<svg viewBox='0 0 480 160' style='max-width:520px;width:100%' role='img' aria-label='Barres : crevettes, risque d’inondation, bois disponible'>" + s + "</svg>";
      el.querySelector("[data-r]").innerHTML = "Indices sur 100, pour comparer (modèle simplifié, pas des mesures réelles). " + (c >= 0.5 ? "La mangrove ne joue plus son rôle de frayère et de digue : moins de crevettes, plus d'eau dans les maisons." : "La mangrove protège encore la côte et abrite les jeunes crevettes.") + (f ? " Les foyers améliorés consomment moins de bois et le reboisement reconstitue la forêt : on concilie besoins et protection." : "");
    }
    el.querySelector("[data-c]").addEventListener("input", maj); el.querySelector("[data-f]").addEventListener("change", maj); maj();
  });
})();
