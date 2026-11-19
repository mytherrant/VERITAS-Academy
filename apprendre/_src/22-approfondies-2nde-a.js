/* Leçons APPROFONDIES — lot 14, 2nde A (18/11/2026) : ℝ et ses sous-ensembles, disciplines affinitaires de l'histoire,
   définitions de la philosophie, lecture des cartes. Même gabarit et même mécanisme que 11-approfondies-lot4.js (remplacement
   EN PLACE ; ordre, clé, fiche APC, examen et scènes conservés ; partie « Entraînement au format de l'examen » et quiz
   d'origine repris). Simulations VRT_A en fin de fichier. */
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
  function pgcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function facteurs(n) { var f = [], d = 2; while (n > 1) { while (n % d === 0) { f.push(d); n /= d; } d++; } return f; }
  function developpe(p, q) { var ent = Math.floor(Math.abs(p) / q), r = Math.abs(p) % q, vus = {}, ch = "", i = 0; while (r && !(r in vus) && i < 40) { vus[r] = i++; r *= 10; ch += Math.floor(r / q); r %= q; } var e = String(ent).replace(/\B(?=(\d{3})+(?!\d))/g, " "); if (!r) return (p < 0 ? "−" : "") + e + (ch ? "," + ch : ""); var k = vus[r]; return (p < 0 ? "−" : "") + e + "," + ch.slice(0, k) + "<span style='text-decoration:overline'>" + ch.slice(k) + "</span>…"; }
  function milliers(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  /* motif de pagne wax */
  function wax(id, fond, a, b) { return "<pattern id='" + id + "' width='22' height='22' patternUnits='userSpaceOnUse'><rect width='22' height='22' fill='" + fond + "'/><circle cx='11' cy='11' r='7' fill='" + a + "'/><circle cx='11' cy='11' r='3' fill='" + b + "'/><path d='M0 0l5 5M22 0l-5 5M0 22l5 -5M22 22l-5 -5' stroke='" + a + "' stroke-width='2'/></pattern>"; }

  /* ═══════════════════════ 2nde A MATHS — ℝ ET SES SOUS-ENSEMBLES ═══════════════════════ */
  var AR_OLD = ancien("2nde-a-maths-reels");
  function pagne3D() {
    var o = [], k, C = ["#E8A33D", "#1E499B", "#C62828", "#2E7D32"];
    o.push({ f: "boite", c: [0, -20, 0], d: [300, 20, 300], coul: "#8B5A2B", dessus: "#A06A38" });
    [[-130, -130], [130, -130], [130, 130], [-130, 130]].forEach(function (p) { o.push({ f: "cylindre", c: [p[0], -130, p[1]], r: 7, h: 100, n: 10, coul: "#6B4423" }); });
    for (k = 0; k < 25; k++) { var i = k % 5, j = Math.floor(k / 5); o.push({ f: "boite", c: [-80 + i * 40, -9, -80 + j * 40], d: [40, 2, 40], coul: C[(i + j) % 4], dessus: C[(i + 2 * j) % 4], div: false }); }
    for (k = 0; k <= 28; k++) { var t = k / 28; o.push({ f: "sphere", c: [-100 + 200 * t, -5, -100 + 200 * t], r: 2.6, coul: "#FBF8F2" }); }
    o.push({ f: "boite", c: [60, -6, -130], d: [120, 1, 12], coul: "#F7C948", dessus: "#F7C948", div: false });
    for (k = 0; k < 7; k++) o.push({ f: "boite", c: [6 + k * 18, -5, -126], d: [1.5, 1, 6], coul: "#1F2328", div: false });
    o.push({ f: "boite", c: [-118, -6, 60], d: [6, 2, 60], coul: "#9AA3AF", dessus: "#C9CED6", div: false });
    o.push({ f: "boite", c: [-108, -6, 60], d: [6, 2, 60], coul: "#9AA3AF", dessus: "#C9CED6", div: false });
    o.push({ f: "cylindre", c: [-122, -7, 100], r: 9, r2: 9, h: 3, n: 14, coul: "#1F2328" });
    o.push({ f: "cylindre", c: [-104, -7, 100], r: 9, r2: 9, h: 3, n: 14, coul: "#1F2328" });
    return o;
  }
  remplacer("2nde-a-maths-reels", {
    c: "2nde A", m: "maths", titre: "ℝ et ses sous-ensembles", duree: 35,
    accroche: "« Chacune aura 16 666,66 F tout rond ! » annonce la trésorière de la tontine. Une dette de 3 000 F, est-ce « moins que rien » ? Et la diagonale du pagne, combien mesure-t-elle exactement ?",
    intro: "La tontine d'un atelier de couture de Bafoussam te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois affirmations.",
    objectifs: ["nommer les ensembles ℕ, ℤ, 𝔻, ℚ, ℝ et leurs inclusions", "reconnaître un décimal, un rationnel, un irrationnel", "placer un nombre dans le plus petit ensemble qui le contient", "arrondir un partage de façon juste"],
    enquete: {
      titre: "La tontine des couturières de Bafoussam",
      svg: svg(640, 220, "Atelier de couture : une trésorière tient un cahier et une calculatrice affichant 16666,66667, des pagnes wax sur la table", wax("arW", "#E8A33D", "#1E499B", "#C62828") + wax("arW2", "#2E7D32", "#F7C948", "#C62828") + lin("arM", ["#F4EDE1", "#E9DFCF"], true),
        "<rect width='640' height='220' fill='url(#arM)'/><rect y='170' width='640' height='50' fill='#B88A5A'/><rect x='30' y='130' width='300' height='14' rx='3' fill='#8B5A2B'/><rect x='40' y='144' width='10' height='40' fill='#6B4423'/><rect x='310' y='144' width='10' height='40' fill='#6B4423'/>" +
        "<path d='M50 130l20 -38h110l20 38Z' fill='url(#arW)' stroke='#8A5A20'/><path d='M190 130l12 -26h90l14 26Z' fill='url(#arW2)' stroke='#2E5D22'/>" +
        "<rect x='400' y='26' width='200' height='76' rx='10' fill='#1F2328'/><rect x='410' y='36' width='180' height='40' fill='#B8D8A8'/>" + txt(582, 66, "16666,66667", { s: 22, a: "end", c: "#1F2328" }) + txt(500, 94, "100 000 ÷ 6", { s: 11, c: "#B8D8A8", w: 500 }) +
        perso(380, 90, "#5A3A1E", "#7B3F99", "#2E3445") + "<rect x='392' y='118' width='26' height='32' rx='2' fill='#FBF8F2' stroke='#9AA3AF'/>" + perso(560, 96, "#6B4423", "#C62828", "#1E499B") + bulle(420, 150, 200, "16 666,66 F tout rond !", "#F7C948")),
      legende: "À Bafoussam, six couturières cotisent chaque mois ; ce mois-ci, la caisse contient 100 000 F à partager à parts égales.",
      contexte: "<p>La trésorière tape 100 000 ÷ 6 et annonce : « Chacune aura 16 666,66 F tout rond. » Une couturière, qui doit encore <strong>3 000 F</strong> à la caisse, plaisante : « Mon solde est moins que rien, ce n'est même pas un nombre ! » Enfin, pour un foulard, l'atelier coupe un pagne carré de <strong>1 m</strong> de côté le long de sa diagonale : « Elle mesure 1,41 m, c'est exact », dit l'apprentie.</p>",
      documents: [{ t: "Le cahier de la trésorière", html: "<table class='donnees'><tr><th>Ligne</th><th>Nombre</th><th>Commentaire</th></tr><tr><td>Part de chacune</td><td>100 000 ÷ 6</td><td>« 16 666,66 F tout rond »</td></tr><tr><td>Solde de Mama Ngo</td><td>−3 000 F</td><td>« moins que rien »</td></tr><tr><td>Biais du pagne</td><td>diagonale d'un carré de 1 m</td><td>« 1,41 m exactement »</td></tr></table>" }],
      question: "Ces trois nombres sont-ils bien décrits ? Dans quel ensemble les ranger, et comment payer chacune justement ?",
      tache: "Range 100 000/6, −3 000 et la diagonale dans le plus petit ensemble possible, en justifiant, puis propose un partage réel en francs.",
      hypotheses: ["100 000 ÷ 6 = 16 666,66 exactement : c'est un décimal.", "−3 000 n'est pas un nombre : on ne peut pas avoir moins que rien.", "−3 000 ∈ ℤ ; 100 000/6 ∈ ℚ mais ∉ 𝔻 ; la diagonale √2 m est irrationnelle : on paie et on mesure avec des arrondis."]
    },
    parties: [
      { t: "Des entiers aux réels", html: partie(AR_OLD, 0),
        planches: [{ type: "2D", titre: "Chaque nombre a sa place sur la droite", legende: "Sur la droite graduée, tous les nombres de la tontine ont une place : la dette −3 (milliers de francs) est un entier relatif, 1/4 est décimal, 2/3 est rationnel non décimal, √2 et π sont irrationnels. Tous sont des réels.", svg: (function () {
          var X = function (v) { return 320 + v * 80; }, s = "<rect width='640' height='210' fill='#FBF8F2'/><path d='M30 105H612' stroke='" + NUIT + "' stroke-width='2.5' marker-end='url(#arF)'/>", v;
          for (v = -3; v <= 3; v++) s += "<path d='M" + X(v) + " 98V112' stroke='" + NUIT + "' stroke-width='2'/>" + txt(X(v), 128, v < 0 ? "−" + (-v) : String(v), { s: 12, c: GRIS, w: 600 });
          [[-3, ROUGE, "−3 ∈ ℤ (dette de 3 000 F)", 60, "start", 30], [0.25, "#C2540A", "1/4 = 0,25 ∈ 𝔻", 168, "middle"], [2 / 3, "#7B3F99", "2/3 = 0,666… ∈ ℚ", 46, "middle"], [Math.SQRT2, VERT, "√2 ≈ 1,414… ∈ ℝ", 192, "middle"], [3, BLEU, "3 ∈ ℕ", 60, "middle"], [Math.PI, VERT, "π ≈ 3,14… ∈ ℝ", 168, "middle"]].forEach(function (p) {
            var x = X(p[0]); s += "<path d='M" + x + " 105V" + (p[3] < 105 ? p[3] + 6 : p[3] - 14) + "' stroke='" + p[1] + "' stroke-dasharray='3 3'/><circle cx='" + x + "' cy='105' r='6' fill='" + p[1] + "' stroke='#fff' stroke-width='2'/>" + txt(p[5] || x, p[3], p[2], { s: 12, c: p[1], a: p[4], halo: true });
          });
          return svg(640, 210, "Droite graduée de −3 à 3 avec les nombres −3, 1/4, 2/3, racine de 2, 3 et pi et leur ensemble", fleche("arF", NUIT), s);
        })() }],
        labo: { type: "ensembles" },
        fil: { html: "<p>Une dette se note avec un signe moins : −3 000 est un <strong>entier relatif</strong>, élément de ℤ (et donc de 𝔻, ℚ, ℝ). Sur la droite graduée, il est à gauche de 0. Les nombres négatifs servent tous les jours : soldes, températures en altitude, étages en sous-sol.</p>", verdicts: [[1, "rejetee", "−3 000 est un nombre : un entier relatif, élément de ℤ."]] },
        retenir: "ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ." },
      { t: "Reconnaître un décimal", html: partie(AR_OLD, 1),
        fil: { html: "<p>100 000/6 = 50 000/3 : le dénominateur 3 n'est ni 2 ni 5, donc l'écriture décimale ne s'arrête pas : 16 666,666… La calculatrice affiche un arrondi (16 666,66667) et la trésorière tronque à 16 666,66. Ce nombre est <strong>rationnel</strong>, pas décimal ; et de toute façon, aucune pièce ne vaut 0,66 F.</p>", verdicts: [[0, "rejetee", "100 000/6 = 16 666,666… : rationnel non décimal ; 16 666,66 n'est qu'un arrondi."]] },
        retenir: "Fraction irréductible décimale ⟺ dénominateur fait seulement de 2 et de 5." },
      { t: "Des nombres qui ne sont pas des fractions", html: partie(AR_OLD, 2),
        planches: [{ type: "3d", titre: "Le pagne carré et son biais", legende: "Tourne la table de coupe : un pagne wax carré de 1 m de côté, le mètre ruban jaune et les ciseaux. Le fil blanc suit la diagonale (le biais) : sa longueur est √2 m. On coupe à 1,41 m ou 1,414 m, mais aucune de ces valeurs n'est exacte.",
          modele: { h: 340, rx: -40, ry: 28, echelle: 0.95, alt: "Table de couture avec un pagne carré à carreaux colorés, un fil blanc en diagonale, un mètre ruban et des ciseaux", objets: pagne3D(),
            etiquettes: [{ p: [0, 0, 0], t: "biais : √2 m ≈ 1,414 m" }, { p: [100, -4, -100], t: "côté : 1 m", cote: "d" }, { p: [-113, -4, 100], t: "ciseaux", cote: "g" }] } }],
        fil: { html: "<p>D'après Pythagore, diagonale² = 1² + 1² = 2, donc la diagonale vaut <strong>√2 m</strong>. Or √2 n'est pas une fraction : c'est un <strong>irrationnel</strong>, son écriture décimale (1,41421356…) est infinie et non périodique. « 1,41 m » est une valeur approchée au centimètre, suffisante pour couper, mais pas exacte.</p>", verdicts: [[2, "validee", "−3 000 ∈ ℤ, 100 000/6 ∈ ℚ \\ 𝔻, √2 irrationnel : arrondis nécessaires."]] },
        retenir: "Irrationnel : ni décimal ni fraction (√2, π)." },
      AR_OLD && AR_OLD.parties[3] ? AR_OLD.parties[3] : { t: "Entraînement", html: "" }
    ],
    denouement: {
      titre: "Le cahier corrigé",
      etapes: ["−3 000 : entier relatif, ∈ ℤ (indice 1).", "100 000/6 = 50 000/3 : facteur 3, rationnel non décimal (indice 2).", "Diagonale √2 m : irrationnelle (indice 3)."],
      reponse: "<p>Le solde de −3 000 F est un nombre tout à fait correct : c'est un entier relatif négatif, élément de ℤ (et donc de 𝔻, ℚ et ℝ). La part de chacune vaut 100 000/6 = 50 000/3 ; le dénominateur 3 n'est fait ni de 2 ni de 5, donc l'écriture décimale est infinie : 16 666,666… C'est un rationnel non décimal, et « 16 666,66 » n'en est qu'une valeur tronquée. En pratique, on verse 16 666 F à chacune (6 × 16 666 = 99 996 F) et les 4 F restants restent dans la caisse commune, ce qui est juste et transparent. Enfin, la diagonale du pagne mesure √2 m d'après Pythagore : c'est un irrationnel ; 1,41 m est une valeur approchée au centimètre près, suffisante pour couper le foulard.</p>",
      transfert: "<p>Une tontine de 7 membres partage 50 000 F. Calcule 50 000/7, dis dans quel plus petit ensemble il se trouve, et propose un partage en francs. <em>(7 142,857142… ∈ ℚ ; 7 142 F chacune, 6 F en caisse.)</em></p>"
    },
    revision: (AR_OLD ? AR_OLD.revision : []).concat(["Une calculatrice affiche un arrondi : 16 666,66667 n'est pas la valeur exacte de 100 000/6."]),
    exo: AR_OLD ? AR_OLD.exo : "",
    quiz: AR_OLD ? AR_OLD.quiz : []
  });

  /* ═══════════════════════ 2nde A HISTOIRE — LES DISCIPLINES AFFINITAIRES ═══════════════════════ */
  var HD_OLD = ancien("2nde-a-histoire-disciplines");
  function fouille3D() {
    var o = [], k, R = alea(77);
    [[105, 30, "#3B2A1E", "#4E7D2A"], [65, 50, "#B5651D", null], [10, 60, "#8C8577", null], [-40, 40, "#6E6A63", null]].forEach(function (c) { o.push({ f: "boite", c: [0, c[0], 0], d: [360, c[1], 140], coul: c[2], dessus: c[3] || c[2], div: false }); });
    for (k = 0; k < 4; k++) o.push({ f: "boite", c: [-150 + k * 34, 108, -71], d: [12, 6, 2], coul: "#2F80ED", div: false });
    for (k = 0; k < 10; k++) o.push({ f: "sphere", c: [-60 + R() * 120, 52 + R() * 26, -72], r: 3.2, coul: k % 2 ? "#1E6FD9" : "#F7C948" });
    for (k = 0; k < 7; k++) o.push({ f: "boite", c: [-140 + k * 34 + R() * 10, 2 + R() * 22, -72], d: [18 + R() * 8, 8, 3], coul: "#A0522D", dessus: "#B8693A", div: false });
    for (k = 0; k < 9; k++) o.push({ f: "sphere", c: [40 + R() * 110, 4 + R() * 26, -72], r: 4.2, coul: "#1B1410" });
    for (k = 0; k < 8; k++) o.push({ f: "boite", c: [192, -50 + k * 25 + 12.5, -66], d: [8, 25, 4], coul: k % 2 ? "#FBF8F2" : "#C62828", div: false });
    o.push({ f: "boite", c: [-210, 128, -40], d: [6, 4, 50], coul: "#6B4423", div: false });
    o.push({ f: "boite", c: [-210, 128, -76], d: [16, 2, 24], coul: "#9AA3AF", dessus: "#C9CED6", div: false });
    o.push({ f: "boite", c: [150, 124, 30], d: [60, 8, 40], coul: "#C9B28A", dessus: "#E9DFCF", div: false });
    return o;
  }
  remplacer("2nde-a-histoire-disciplines", {
    c: "2nde A", m: "histoire", titre: "Les disciplines affinitaires de l'histoire", duree: 35,
    accroche: "Des tessons de poterie et du charbon de bois sortent d'une tranchée à Mbalmayo. « Des débris ! » dit le propriétaire. « Nos ancêtres, il y a sept générations », dit le chef. Et si les deux se trompaient ?",
    intro: "Une découverte sur un chantier de Mbalmayo te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois explications.",
    objectifs: ["définir les disciplines affinitaires de l'histoire", "dire ce que chacune apporte : vestiges, couches, dates, paroles, langues", "dater un reste organique au carbone 14", "critiquer et croiser des sources"],
    enquete: {
      titre: "Les tessons du chantier de Mbalmayo",
      svg: svg(640, 220, "Une tranchée de chantier montre des couches de terre colorées avec des tessons de poterie ; un ouvrier, le propriétaire et un vieux chef discutent", lin("hdC", ["#DCEBF5", "#F4F1EA"], true),
        "<rect width='640' height='220' fill='url(#hdC)'/><rect y='120' width='640' height='100' fill='#7A5530'/><rect x='120' y='120' width='300' height='100' fill='#5A3A1E'/>" +
        "<rect x='130' y='120' width='280' height='16' fill='#3B2A1E'/><rect x='130' y='136' width='280' height='30' fill='#B5651D'/><rect x='130' y='166' width='280' height='40' fill='#8C8577'/><rect x='130' y='206' width='280' height='14' fill='#6E6A63'/><path d='M130 120V220M410 120V220' stroke='#2B1D12' stroke-width='3'/>" +
        [[170, 180], [215, 188], [262, 176], [300, 190], [345, 182]].map(function (p, i) { return "<path d='M" + p[0] + " " + p[1] + "q8 -7 18 -2l-3 7q-8 -3 -15 0Z' fill='#A0522D' stroke='#6B3A1E'/>" + (i % 2 ? "<circle cx='" + (p[0] + 22) + "' cy='" + (p[1] + 8) + "' r='4' fill='#1B1410'/>" : ""); }).join("") +
        [160, 200, 240, 280].map(function (x) { return "<circle cx='" + x + "' cy='150' r='3' fill='#1E6FD9'/>"; }).join("") +
        perso(80, 36, "#5A3A1E", "#C2540A", "#2E3445") + "<path d='M100 70L118 128' stroke='#6B4423' stroke-width='4'/><path d='M112 124l14 8l-6 6Z' fill='#9AA3AF'/>" +
        perso(470, 36, "#6B4423", "#1E499B", "#2E3445") + perso(560, 40, "#4A2E1A", "#F4F1EA", "#7A5530") + "<path d='M578 70L586 124' stroke='#5D3A1E' stroke-width='3'/><path d='M548 30h24' stroke='#C62828' stroke-width='5'/>" +
        bulle(380, 6, 130, "Des débris !", "#9FC5E8") + bulle(480, 6, 150, "Sept générations…", "#F7C948")),
      legende: "À Mbalmayo, sur les bords du Nyong : en creusant des fondations, les ouvriers mettent au jour des tessons décorés et du charbon de bois.",
      contexte: "<p>Le propriétaire veut tout jeter pour finir ses fondations : « Ce ne sont que des débris. » Le chef du village, consulté, affirme : « Ces pots sont ceux de nos ancêtres, qui ont fondé le village il y a <strong>sept générations</strong>. » Une étudiante en histoire de l'université de Yaoundé I fait arrêter les travaux, relève les couches de terre et envoie un morceau de charbon au laboratoire.</p>",
      documents: [{ t: "Le relevé de la tranchée", html: "<table class='donnees'><tr><th>Couche</th><th>Profondeur</th><th>Ce qu'on y trouve</th></tr><tr><td>1</td><td>0 à 30 cm</td><td>terre noire, sachets plastique</td></tr><tr><td>2</td><td>30 à 80 cm</td><td>argile ocre, perles de verre de traite européenne</td></tr><tr><td>3</td><td>80 à 140 cm</td><td>sol gris, tessons décorés à la roulette, charbon de bois</td></tr></table>" },
        { t: "La fiche du laboratoire", html: "<p>Échantillon : charbon de bois, couche 3. Résultat : il reste <strong>88 %</strong> du carbone 14 d'origine. (Demi-vie du carbone 14 : 5 730 ans.)</p>" }],
      question: "Ces vestiges ont-ils une valeur, et de quand datent-ils vraiment ?",
      tache: "Explique au propriétaire et au chef ce que chaque discipline apprend sur ces vestiges, puis propose une date pour les tessons.",
      hypotheses: ["Ce ne sont que des débris sans valeur : on peut tout jeter.", "Le récit du chef suffit : les tessons datent de la fondation du village, il y a sept générations.", "Il faut croiser les disciplines : couches, carbone 14 et tradition orale montrent que les tessons sont bien plus anciens que le village actuel."]
    },
    parties: [
      { t: "Pourquoi des disciplines « affinitaires » ?", html: partie(HD_OLD, 0),
        planches: [{ type: "2D", titre: "L'historien et ses alliés", legende: "Autour de l'historien, les disciplines qui lui fournissent des sources : vestiges, fossiles, coutumes, langues, paroles, monnaies, inscriptions et noms de lieux. Il critique chacune et les croise.", svg: (function () {
          var s = "<rect width='640' height='300' fill='#FBF8F2'/>", D = [
            ["Archéologie", "vestiges", "<path d='M-9 -12h18l-3 6q8 6 4 16h-20q-4 -10 4 -16Z' fill='#A0522D' stroke='#6B3A1E'/><path d='M-8 -2h16' stroke='#E9DFCF' stroke-dasharray='2 2'/>"],
            ["Paléontologie", "fossiles", "<path d='M0 0m-12 0a12 12 0 1 1 12 12a8 8 0 1 1 -8 -8a4 4 0 1 1 4 4' fill='none' stroke='#8C8577' stroke-width='3'/>"],
            ["Ethnologie", "coutumes", "<ellipse rx='10' ry='15' fill='#6B4423'/><ellipse cx='-4' cy='-4' rx='3' ry='2' fill='#F7C948'/><ellipse cx='4' cy='-4' rx='3' ry='2' fill='#F7C948'/><path d='M-4 7h8' stroke='#F7C948' stroke-width='2'/>"],
            ["Linguistique", "langues", "<rect x='-15' y='-12' width='22' height='14' rx='4' fill='" + BLEU + "'/><rect x='-6' y='-1' width='22' height='14' rx='4' fill='#7B3F99'/>" + txt(-4, -2, "ba", { s: 8, c: "#fff" }) + txt(5, 10, "ntu", { s: 8, c: "#fff" })],
            ["Tradition orale", "griots, récits", "<rect x='-8' y='-8' width='16' height='20' rx='3' fill='#8B5A2B'/><ellipse cy='-8' rx='8' ry='3' fill='#E9DFCF' stroke='#6B4423'/><path d='M-8 0l16 8M-8 8l16 -8' stroke='#5A3A1E'/>"],
            ["Numismatique", "monnaies", "<circle r='12' fill='#D4A017' stroke='#8A6A10' stroke-width='2'/><circle r='7' fill='none' stroke='#8A6A10'/>"],
            ["Épigraphie", "inscriptions", "<path d='M-10 14V-6q0 -10 10 -10t10 10v20Z' fill='#9AA3AF'/><path d='M-6 -2h12M-6 3h12M-6 8h12' stroke='#4D5163'/>"],
            ["Toponymie", "noms de lieux", "<path d='M0 -14V14' stroke='#6B4423' stroke-width='3'/><path d='M-2 -12h16l5 5l-5 5h-16Z' fill='" + VERT + "'/>"]];
          D.forEach(function (d, k) { var a = -Math.PI / 2 + k * Math.PI / 4, x = 320 + 250 * Math.cos(a), y = 140 + 100 * Math.sin(a); s += "<path d='M320 140L" + x.toFixed(0) + " " + y.toFixed(0) + "' stroke='#C9D2E3' stroke-width='2'/>"; });
          s += "<circle cx='320' cy='140' r='52' fill='" + NUIT + "'/>" + txt(320, 134, "L'historien", { s: 13, c: "#fff" }) + txt(320, 150, "critique et croise", { s: 10, c: "#F7C948", w: 600 });
          D.forEach(function (d, k) { var a = -Math.PI / 2 + k * Math.PI / 4, x = 320 + 250 * Math.cos(a), y = 140 + 100 * Math.sin(a); s += "<circle cx='" + x.toFixed(0) + "' cy='" + y.toFixed(0) + "' r='24' fill='#fff' stroke='#C9A576' stroke-width='2'/><g transform='translate(" + x.toFixed(0) + " " + y.toFixed(0) + ")'>" + d[2] + "</g>" + txt(x, y + (k === 0 ? -32 : 38), d[0], { s: 11, halo: true }) + txt(x, y + (k === 0 ? -20 : 50), d[1], { s: 9, c: GRIS, w: 500, halo: true }); });
          return svg(640, 300, "L’historien au centre, entouré de huit disciplines avec leur symbole", "", s);
        })() }],
        fil: { html: "<p>Pour l'historien, tout vestige est une <strong>source</strong> : une poterie renseigne sur la technique, l'alimentation, les échanges ; un charbon de bois peut être daté. Jeter ces tessons, c'est détruire une page d'histoire que personne n'a écrite. Il faut arrêter de creuser à cet endroit et prévenir les spécialistes.</p>", verdicts: [[0, "rejetee", "Tessons et charbon sont des sources : archéologie et datation."]] },
        retenir: "Plus les écrits sont rares, plus les disciplines affinitaires sont précieuses." },
      { t: "Les principales disciplines", html: partie(HD_OLD, 1),
        planches: [{ type: "3d", titre: "La tranchée : une coupe stratigraphique", legende: "Tourne la tranchée : sous l'herbe, la couche 1 (terre noire et plastique), la couche 2 (argile ocre et perles de verre), la couche 3 (sol gris, tessons et charbon de bois). La mire rouge et blanche mesure la profondeur : plus une couche est basse, plus elle est ancienne.",
          modele: { h: 360, rx: -16, ry: 26, echelle: 0.9, alt: "Coupe de terrain en quatre couches de couleurs différentes avec des tessons, des perles, du charbon et une mire de mesure", objets: fouille3D(),
            etiquettes: [{ p: [-180, 105, -70], t: "couche 1 : sachets plastique", cote: "g" }, { p: [-180, 65, -70], t: "couche 2 : perles de traite", cote: "g" }, { p: [-180, 10, -70], t: "couche 3 : tessons, charbon", cote: "g" }, { p: [192, 40, -70], t: "mire (profondeur)", cote: "d" }] } }],
        fil: { html: "<p>La <strong>stratigraphie</strong> lit les couches comme les pages d'un livre posé à plat : la plus basse est la plus ancienne. Les perles de verre de la couche 2 viennent de la traite européenne (XVIIIᵉ-XIXᵉ siècles) : elles correspondent bien aux « sept générations » du chef (7 × 25 à 30 ans ≈ 175 à 210 ans). Mais les tessons sont <strong>en dessous</strong>, dans la couche 3 : ils sont plus anciens. La tradition orale est précieuse, mais elle parle de la dernière installation, pas de la plus ancienne.</p>", verdicts: [[1, "rejetee", "Les tessons sont sous la couche des perles de traite : plus anciens que sept générations."]] },
        retenir: "Archéologie, paléontologie, ethnologie, linguistique, tradition orale, numismatique, épigraphie, toponymie." },
      { t: "Dater le passé : l'apport des sciences", html: partie(HD_OLD, 2),
        fil: { html: "<p>Il reste 88 % du carbone 14. En une demi-vie (5 730 ans), il en resterait 50 % : l'échantillon a donc moins de 5 730 ans. Le calcul (simulation ci-dessus) donne environ <strong>1 060 ans</strong> : le charbon date de la fin du Xᵉ siècle, vers l'an 970. Croisée avec la stratigraphie et la tradition orale, la datation révèle <strong>deux occupations</strong> : une très ancienne (tessons) et celle des fondateurs du village actuel (perles).</p>", verdicts: [[2, "validee", "Stratigraphie + carbone 14 + tradition orale : deux occupations, les tessons ont environ mille ans."]] },
        retenir: "Carbone 14 : la moitié disparaît tous les 5 730 ans environ." },
      HD_OLD && HD_OLD.parties[3] ? HD_OLD.parties[3] : { t: "Entraînement", html: "" }
    ],
    denouement: {
      titre: "Le rapport de l'étudiante",
      etapes: ["Tessons et charbon sont des sources (indice 1).", "Stratigraphie : les tessons sont sous les perles de traite (indice 2).", "Carbone 14 : 88 % restant ≈ 1 060 ans (indice 3)."],
      reponse: "<p>Les tessons et le charbon ne sont pas des débris : ce sont des sources pour l'historien. L'archéologie étudie les poteries (forme, décor à la roulette, technique) ; la stratigraphie ordonne les couches : la couche 2, avec ses perles de verre de traite européenne, date des derniers siècles et correspond au récit du chef sur la fondation du village il y a sept générations (environ 200 ans). Mais les tessons et le charbon se trouvent dessous, dans la couche 3 : ils sont plus anciens. Le carbone 14 le confirme : il reste 88 % du carbone 14, ce qui correspond à environ 1 060 ans, donc vers l'an 970. Le site a été occupé deux fois : par une population ancienne de potiers, puis par les fondateurs du village actuel. La tradition orale n'est pas fausse, mais elle ne remonte pas aussi loin ; seule la confrontation des disciplines donne une histoire complète. Le propriétaire doit protéger le site et prévenir la délégation régionale des Arts et de la Culture.</p>",
      transfert: "<p>Un os trouvé dans un abri sous roche contient 25 % de son carbone 14 d'origine. Quel est son âge ? <em>(Deux demi-vies : environ 11 460 ans.)</em></p>"
    },
    revision: (HD_OLD ? HD_OLD.revision : []).concat(["Stratigraphie : la couche la plus basse est la plus ancienne."]),
    exo: HD_OLD ? HD_OLD.exo : "",
    quiz: HD_OLD ? HD_OLD.quiz : []
  });

  /* ═══════════════════════ 2nde A PHILOSOPHIE — QU'EST-CE QUE LA PHILOSOPHIE ? ═══════════════════════ */
  var PD_OLD = ancien("2nde-a-philo-definitions");
  function palabre3D() {
    var o = [], k, R = alea(11);
    o.push({ f: "cylindre", c: [0, -6, 0], r: 230, h: 6, n: 30, coul: "#B88A5A", dessus: "#C9A06E" });
    o.push({ f: "cylindre", c: [0, 0, 0], r: 26, r2: 18, h: 150, n: 14, coul: "#6B4A2B" });
    [[-40, 150, 0], [40, 150, 10], [0, 150, -40], [0, 150, 40]].forEach(function (b) { o.push({ f: "cylindre", c: [b[0] * 0.3, 140, b[2] * 0.3], r: 7, r2: 4, h: 40, n: 8, coul: "#5D3A1E" }); });
    for (k = 0; k < 22; k++) { var a = k * 2.4, d = 30 + R() * 110; o.push({ f: "sphere", c: [Math.cos(a) * d, 175 + R() * 45, Math.sin(a) * d], r: 34 + R() * 16, coul: ["#2E6B2A", "#3E8E3A", "#356F2E"][k % 3] }); }
    var H = [["#7B3F99", "#5A3A1E"], ["#C62828", "#6B4423"], ["#1E499B", "#4A2E1A"], ["#E8A33D", "#5A3A1E"], ["#2E7D32", "#6B4423"], ["#F4F1EA", "#4A2E1A"]];
    for (k = 0; k < 6; k++) {
      var t = Math.PI / 2 + k * Math.PI / 3, x = Math.cos(t) * 120, z = -Math.sin(t) * 120;
      o.push({ f: "cylindre", c: [x, 0, z], r: 12, h: 18, n: 10, coul: "#8B5A2B", dessus: "#A06A38" });
      o.push({ f: "cylindre", c: [x, 18, z], r: 11, r2: 8, h: 32, n: 10, coul: H[k][0] });
      o.push({ f: "sphere", c: [x, 58, z], r: 9, coul: H[k][1] });
    }
    o.push({ f: "boite", c: [0, -1, -60], d: [70, 2, 40], coul: "#C9B28A", dessus: "#D9C49C", div: false });
    return o;
  }
  remplacer("2nde-a-philo-definitions", {
    c: "2nde A", m: "philo", titre: "Qu'est-ce que la philosophie ?", duree: 35,
    accroche: "« URGENT : les élèves de la série A ne trouvent jamais de travail. La philo ne sert à rien. Partage à 10 amis ! » Moussa doit-il transférer le message ?",
    intro: "Un message reçu sur WhatsApp par un élève de Ngaoundéré te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées de la philosophie.",
    objectifs: ["donner l'étymologie et une définition de la philosophie", "distinguer opinion (doxa) et réflexion philosophique", "appliquer la démarche socratique à une rumeur", "citer des philosophes africains, dont Towa et Njoh-Mouelle"],
    enquete: {
      titre: "Le message qui circule à Ngaoundéré",
      svg: svg(640, 220, "Un élève tient un téléphone affichant un message alarmant ; son ami lui dit que la philosophie ne sert à rien", lin("pdC", ["#EAF3E6", "#F7F3EA"], true),
        "<rect width='640' height='220' fill='url(#pdC)'/><rect y='180' width='640' height='40' fill='#C9A06E'/>" +
        "<rect x='250' y='18' width='150' height='190' rx='18' fill='#1F2328'/><rect x='258' y='34' width='134' height='158' rx='6' fill='#ECE5DD'/><rect x='258' y='34' width='134' height='22' fill='#075E54'/>" + txt(325, 49, "Groupe 2nde A", { s: 10, c: "#fff" }) +
        "<rect x='264' y='62' width='122' height='96' rx='6' fill='#fff'/>" + txt(270, 78, "URGENT !", { s: 10, a: "start", c: ROUGE }) + txt(270, 94, "Les élèves de série A", { s: 9, a: "start", w: 500 }) + txt(270, 108, "ne trouvent jamais", { s: 9, a: "start", w: 500 }) + txt(270, 122, "de travail. La philo", { s: 9, a: "start", w: 500 }) + txt(270, 136, "ne sert à rien.", { s: 9, a: "start", w: 500 }) + txt(270, 150, "Partage à 10 amis !", { s: 9, a: "start", c: ROUGE }) +
        "<rect x='300' y='166' width='86' height='18' rx='9' fill='#25D366'/>" + txt(343, 179, "Transférer ?", { s: 9, c: "#fff" }) +
        perso(150, 96, "#5A3A1E", "#F4F1EA", "#2E3445") + "<path d='M144 98h-14' stroke='#F7C948' stroke-width='5'/>" + perso(500, 96, "#6B4423", "#1E499B", "#2E3445") + bulle(440, 40, 190, "La philo, ça ne sert à rien !", "#9FC5E8") + bulle(30, 40, 170, "Je partage ou pas ?", "#F7C948")),
      legende: "À Ngaoundéré, Moussa, élève de 2nde A, reçoit ce message sur le groupe de sa classe. Son ami Paul en rajoute.",
      contexte: "<p>Moussa hésite. Paul lui dit : « La philosophie, c'est juste donner son avis : chacun a sa philosophie, toutes se valent. Et puis ce sont des idées de Grecs et d'Européens, loin de nos réalités. » Moussa se souvient que son professeur a parlé de Socrate et de deux philosophes camerounais. Il se demande si la philosophie peut l'aider à décider.</p>",
      documents: [{ t: "Ce que dit le dictionnaire", html: "<p><strong>Philosophie</strong> n. f. : du grec <em>philosophia</em>, « amour de la sagesse ». Étude critique et rationnelle des grands problèmes de l'existence et de la connaissance.</p>" }, { t: "Une phrase de Kant", html: "<p>« On n'apprend pas la philosophie, on apprend à philosopher. »</p>" }],
      question: "Philosopher, est-ce simplement donner son avis ? La philosophie peut-elle aider Moussa face à ce message ?",
      tache: "Définis la philosophie, puis montre, en appliquant sa démarche au message, qu'elle n'est ni une simple opinion ni une affaire étrangère.",
      hypotheses: ["Philosopher, c'est donner son opinion : chacun a sa philosophie, toutes se valent.", "La philosophie ne sert à rien : elle reste loin de la vie concrète.", "La philosophie est l'amour de la sagesse : une réflexion critique et rationnelle qui examine les opinions par des arguments ; elle aide à juger le message et existe aussi en Afrique."]
    },
    parties: [
      { t: "Le mot et la chose", html: partie(PD_OLD, 0),
        planches: [{ type: "2D", titre: "Philein + sophia = philosophia", legende: "Deux mots grecs forment « philosophie » : aimer (philein) et la sagesse (sophia). Pythagore se disait « ami de la sagesse » et non « sage » : le philosophe cherche la vérité, il ne prétend pas la posséder.", svg: (function () {
          var s = "<rect width='640' height='230' fill='#FBF8F2'/>";
          s += "<rect x='30' y='40' width='170' height='90' rx='14' fill='" + BLEU + "'/>" + txt(115, 72, "φιλεῖν", { s: 24, c: "#fff" }) + txt(115, 96, "philein", { s: 13, c: "#DCE6F2", i: true }) + txt(115, 116, "aimer", { s: 13, c: "#F7C948" });
          s += txt(225, 92, "+", { s: 30, c: NUIT });
          s += "<rect x='250' y='40' width='170' height='90' rx='14' fill='#7B3F99'/>" + txt(335, 72, "σοφία", { s: 24, c: "#fff" }) + txt(335, 96, "sophia", { s: 13, c: "#E9DCF2", i: true }) + txt(335, 116, "la sagesse, le savoir", { s: 12, c: "#F7C948" });
          s += "<path d='M430 85H462' stroke='" + NUIT + "' stroke-width='3' marker-end='url(#pdF)'/><rect x='470' y='40' width='150' height='90' rx='14' fill='" + NUIT + "'/>" + txt(545, 72, "philosophia", { s: 16, c: "#fff", i: true }) + txt(545, 98, "amour", { s: 13, c: "#F7C948" }) + txt(545, 116, "de la sagesse", { s: 13, c: "#F7C948" });
          s += portrait(70, 186, "#C8A27A", "#F4EFE4", "#DADADA", "vieux") + bulle(110, 170, 300, "« Je ne suis pas sage, je suis ami de la sagesse. »", "#C9A576") + txt(70, 228, "Pythagore", { s: 10, c: GRIS });
          return svg(640, 230, "Le mot grec philein, aimer, et sophia, sagesse, forment philosophia ; portrait de Pythagore", fleche("pdF", NUIT), s);
        })() }],
        fil: { html: "<p>« Avoir sa philosophie de la vie », dans le langage courant, c'est avoir une opinion. Mais le philosophe est <strong>ami</strong> de la sagesse : il la <strong>cherche</strong>, par une réflexion <strong>critique</strong> et <strong>rationnelle</strong>. Toutes les opinions ne se valent donc pas : une idée justifiée par des arguments vaut mieux qu'un « on dit ».</p>", verdicts: [[0, "rejetee", "Philosopher, c'est examiner les opinions par la raison, pas les juxtaposer."]] },
        retenir: "Philosophie = amour de la sagesse = réflexion critique et rationnelle." },
      { t: "Philosopher, ce n'est pas avoir une opinion", html: partie(PD_OLD, 1),
        planches: [{ type: "2D", titre: "La méthode de Socrate appliquée au message", legende: "Socrate questionnait les certitudes marche après marche. Appliquée au message, sa méthode montre une généralisation sans preuve : la philosophie sert, ici, à ne pas propager une rumeur.", svg: (function () {
          var M = [["Opinion", "« Les élèves de série A ne trouvent jamais de travail. »", "#C62828"], ["Question", "Qui l'affirme ? Sur quelles preuves ?", "#C2540A"], ["Examen", "« Jamais » : un seul contre-exemple suffit (juriste, journaliste, enseignant…).", "#B8860B"], ["Définition", "Distinguer un fait vérifié d'une généralisation.", VERT], ["Sagesse", "Savoir ce qu'on ne sait pas : je ne transfère pas.", BLEU]], s = "<rect width='640' height='270' fill='#F5F7FB'/>";
          M.forEach(function (m, i) { var x = 20 + i * 18, y = 214 - i * 48, w = 600 - i * 18; s += "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='40' rx='8' fill='#fff' stroke='" + m[2] + "' stroke-width='2'/><rect x='" + x + "' y='" + y + "' width='106' height='40' rx='8' fill='" + m[2] + "'/>" + txt(x + 53, y + 25, m[0], { s: 13, c: "#fff" }) + txt(x + 118, y + 25, m[1], { s: 11, a: "start", w: 500 }); });
          return svg(640, 270, "Escalier de cinq marches : opinion, question, examen, définition, sagesse, appliqué au message", "", s);
        })() }],
        fil: { html: "<p>Moussa applique la méthode de Socrate : qui affirme cela ? Sur quelles preuves ? « Jamais » est une généralisation qu'un seul contre-exemple suffit à ruiner (des juristes, journalistes, enseignants, diplomates sont passés par la série A). La philosophie vient de lui servir : elle lui évite de propager une rumeur. Elle n'est pas loin de la vie concrète.</p>", verdicts: [[1, "rejetee", "Examiner la rumeur, c'est déjà philosopher : la philosophie sert dans la vie concrète."]] },
        retenir: "L'opinion affirme ; la philosophie questionne et argumente." },
      { t: "Philosopher en Afrique", html: partie(PD_OLD, 2),
        planches: [{ type: "3d", titre: "L'arbre à palabres", legende: "Tourne la scène : sous le grand arbre du village, les anciens et les jeunes sont assis en cercle pour débattre d'une question commune. Comme l'agora de Socrate à Athènes, la palabre est un lieu où l'on écoute, où l'on argumente et où l'on cherche ensemble ce qui est juste.",
          modele: { h: 360, rx: -22, ry: 18, echelle: 0.8, alt: "Grand arbre au feuillage vert, six personnes assises en cercle sur des tabourets, une natte au centre", objets: palabre3D(),
            etiquettes: [{ p: [0, 200, 0], t: "l'arbre à palabres" }, { p: [0, 60, -120], t: "chacun prend la parole", cote: "d" }, { p: [-35, 2, -60], t: "la natte", cote: "g" }] } }],
        fil: { html: "<p>La philosophie n'est pas réservée aux Grecs : l'Égypte ancienne a ses sagesses, la palabre africaine a ses débats argumentés, et des philosophes camerounais ont écrit des œuvres au programme. <strong>Marcien Towa</strong> appelle l'Afrique à une pensée critique et libératrice ; <strong>Ebénézer Njoh-Mouelle</strong> invite chacun à passer « de la médiocrité à l'excellence ». La définition tient : amour de la sagesse, réflexion critique et rationnelle, présente partout où l'on examine ses opinions.</p>", verdicts: [[2, "validee", "Amour de la sagesse, réflexion critique ; utile contre la rumeur ; Towa et Njoh-Mouelle en Afrique."]] },
        retenir: "Towa et Njoh-Mouelle : deux philosophes camerounais au programme." },
      PD_OLD && PD_OLD.parties[3] ? PD_OLD.parties[3] : { t: "Entraînement", html: "" }
    ],
    denouement: {
      titre: "La réponse de Moussa",
      etapes: ["Philosophie = amour de la sagesse, réflexion critique (indice 1).", "Méthode de Socrate : la rumeur ne résiste pas à l'examen (indice 2).", "Palabre, Towa, Njoh-Mouelle : la philosophie existe en Afrique (indice 3)."],
      reponse: "<p>Le mot « philosophie » vient du grec philein (aimer) et sophia (la sagesse) : c'est l'amour de la sagesse, c'est-à-dire une réflexion critique et rationnelle sur les grandes questions de l'existence. Ce n'est donc pas une simple opinion : l'opinion affirme sans preuve, la philosophie examine et argumente. Appliquée au message, la démarche de Socrate le montre : qui l'affirme ? sur quelles preuves ? « Jamais » est une généralisation qu'un seul contre-exemple suffit à réfuter. Moussa ne transfère pas le message et répond au groupe en demandant des sources. La philosophie lui a servi à résister à une rumeur : elle n'est pas loin de la vie. Enfin, elle n'est pas étrangère à l'Afrique : la palabre est un lieu de débat argumenté, et les Camerounais Marcien Towa et Ebénézer Njoh-Mouelle ont réfléchi à la libération et à l'excellence.</p>",
      transfert: "<p>Un camarade affirme : « Les gens riches sont forcément heureux. » Applique les cinq marches de Socrate à cette phrase.</p>"
    },
    revision: (PD_OLD ? PD_OLD.revision : []).concat(["Face à une rumeur : qui l'affirme ? sur quelles preuves ? existe-t-il un contre-exemple ?"]),
    exo: PD_OLD ? PD_OLD.exo : "",
    quiz: PD_OLD ? PD_OLD.quiz : []
  });

  /* ═══════════════════════ 2nde A GÉOGRAPHIE — LIRE UNE CARTE ═══════════════════════ */
  var GC_OLD = ancien("2nde-a-geo-cartes");
  function quartier3D() {
    var o = [], k, R = alea(5);
    o.push({ f: "boite", c: [0, -8, 0], d: [520, 8, 400], coul: "#7A6A4A", dessus: "#9DB36A" });
    o.push({ f: "boite", c: [-225, -3, 0], d: [70, 4, 400], coul: "#2F6EA5", dessus: "#4A90C2", div: false });
    for (k = 0; k < 14; k++) o.push({ f: "sphere", c: [-178 + R() * 14, 6, -190 + k * 29], r: [12, 9, 12], coul: k % 2 ? "#2E6B2A" : "#3E7D32" });
    o.push({ f: "boite", c: [-110, -2, -40], d: [110, 2, 320], coul: "#7FB2D9", dessus: "#A9CDE8", div: false });
    o.push({ f: "boite", c: [0, -2, 0], d: [14, 2, 400], coul: "#6F737C", dessus: "#8E939C", div: false });
    o.push({ f: "boite", c: [40, -2, -60], d: [400, 2, 14], coul: "#6F737C", dessus: "#8E939C", div: false });
    [-140, -100, -60].forEach(function (x, i) { [-175, -135, -20, 20, 70, 120].forEach(function (z, j) { o.push({ f: "boite", c: [x, 10, z], d: [24, 20, 22], coul: "#E9E2D2", dessus: (i + j) % 3 ? "#9AA3AF" : "#B5651D" }); }); });
    [40, 80, 120].forEach(function (x, i) { [-175, -135, -20].forEach(function (z, j) { o.push({ f: "boite", c: [x, 10, z], d: [24, 20, 22], coul: "#E9E2D2", dessus: (i + j) % 2 ? "#9AA3AF" : "#B5651D" }); }); });
    o.push({ f: "cone", c: [150, -4, 120], r: 110, h: 60, n: 20, coul: "#8C9A5A" });
    o.push({ f: "boite", c: [150, 70, 120], d: [70, 24, 34], coul: "#F4E7C8", dessus: "#C62828" });
    o.push({ f: "cylindre", c: [192, 56, 120], r: 1.6, h: 44, n: 6, coul: "#C9CED6" });
    o.push({ f: "boite", c: [204, 94, 120], d: [24, 14, 1], coul: "#F7C948", div: false });
    o.push({ f: "cylindre", c: [-80, 0, -95], r: 16, h: 14, n: 14, coul: "#C2540A", dessus: "#E8A33D" });
    for (k = 0; k <= 18; k++) { var t = k / 18; o.push({ f: "sphere", c: [-80 + 230 * t, 18 + 44 * Math.max(0, (t - 0.45) / 0.55), -95 + 215 * t], r: 3, coul: ROUGE }); }
    o.push({ f: "cylindre", c: [220, 0, -170], r: 26, h: 3, n: 20, coul: "#FBF8F2" });
    o.push({ f: "boite", c: [220, 5, -158], d: [6, 2, 24], coul: "#C62828", div: false });
    o.push({ f: "boite", c: [220, 5, -182], d: [6, 2, 24], coul: "#1F2328", div: false });
    return o;
  }
  remplacer("2nde-a-geo-cartes", {
    c: "2nde A", m: "geo", titre: "Lire une carte", duree: 35,
    accroche: "« Sur la carte, le refuge est à 3,5 cm du marché : 3,5 km, c'est trop loin pour y courir ! » Le club environnement doit-il abandonner son plan d'évacuation ?",
    intro: "La carte des zones inondables d'un quartier de Douala, préparée par un club environnement, te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois affirmations.",
    objectifs: ["identifier titre, orientation, légende, échelle et source", "calculer une distance réelle avec l'échelle et convertir les unités", "s'orienter avec la rose des vents", "produire une carte utile à la sécurité collective"],
    enquete: {
      titre: "Le plan d'évacuation du club environnement",
      svg: svg(640, 220, "Des élèves penchés sur une carte dessinée à la main avec une rivière bleue ; l’un affirme que 3,5 cm font 3,5 km", lin("gcC", ["#E6EEF7", "#F4F1EA"], true),
        "<rect width='640' height='220' fill='url(#gcC)'/><rect x='150' y='120' width='340' height='16' rx='3' fill='#8B5A2B'/><rect x='165' y='136' width='10' height='70' fill='#6B4423'/><rect x='465' y='136' width='10' height='70' fill='#6B4423'/>" +
        "<path d='M190 120L214 66H436L460 120Z' fill='#FBF3DC' stroke='#C9B28A'/><path d='M228 66q-10 20 -6 54' stroke='#4A90C2' stroke-width='6' fill='none'/><path d='M240 110l40 -18l40 6l60 -24' stroke='#9AA3AF' stroke-width='2' fill='none'/><circle cx='275' cy='104' r='5' fill='#E8A33D'/><rect x='380' y='74' width='10' height='8' fill='#C62828'/><path d='M275 104L385 78' stroke='#C62828' stroke-dasharray='4 3'/>" +
        perso(100, 76, "#5A3A1E", "#2E7D32", "#2E3445") + perso(540, 76, "#6B4423", "#F7C948", "#1E499B") + perso(320, 10, "#4A2E1A", "#DCE6F2", "#2E3445") + bulle(400, 160, 220, "3,5 cm… donc 3,5 km ?", "#F7C948") + bulle(20, 160, 200, "Il manque des choses…", "#9FC5E8")),
      legende: "À Douala, près du Wouri : le club environnement prépare pour les habitants une carte des zones inondables au 1/10 000.",
      contexte: "<p>Le brouillon montre le fleuve, des maisons, le marché et une école sur une petite colline, choisie comme <strong>point de refuge</strong>. Un membre dit : « Pas besoin de titre ni de légende : les habitants reconnaîtront leur quartier. » Un autre mesure 3,5 cm entre le marché et l'école et conclut : « 3,5 km, c'est trop loin pour y courir pendant une crue. »</p>",
      documents: [{ t: "Les notes du brouillon", html: "<table class='donnees'><tr><th>Élément</th><th>Sur le brouillon</th></tr><tr><td>Échelle</td><td>1/10 000</td></tr><tr><td>Marché → école-refuge</td><td>3,5 cm, en direction du Nord-Est</td></tr><tr><td>Titre, légende, flèche du Nord, source</td><td>absents</td></tr></table>" }],
      question: "Le brouillon peut-il servir aux habitants, et le refuge est-il vraiment trop loin ?",
      tache: "Liste ce qui manque à la carte, calcule la distance réelle marché–refuge et indique la direction à suivre.",
      hypotheses: ["Titre et légende sont décoratifs : un dessin du quartier suffit.", "3,5 cm sur la carte, c'est 3,5 km : le refuge est trop loin.", "Il faut titre, orientation, légende, échelle et source ; 3,5 cm × 10 000 = 35 000 cm = 350 m vers le Nord-Est : quelques minutes à pied."]
    },
    parties: [
      { t: "Les éléments obligatoires d'une carte", html: partie(GC_OLD, 0),
        planches: [{ type: "2D", titre: "La carte terminée : TOLES", legende: "La carte complète : Titre, Orientation (flèche du Nord), Légende, Échelle (graphique), Source. Sans légende, impossible de savoir que les hachures bleues sont des zones inondables et que le carré rouge est le refuge.", svg: (function () {
          var s = "<defs><pattern id='gcH' width='8' height='8' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'><rect width='8' height='8' fill='#DCEBF7'/><path d='M0 0V8' stroke='#4A90C2' stroke-width='2.5'/></pattern></defs><rect width='640' height='340' fill='#fff'/>";
          s += txt(240, 26, "Zones inondables et évacuation — quartier riverain du Wouri (Douala)", { s: 13 }) + "<circle cx='22' cy='22' r='10' fill='#F7C948'/>" + txt(22, 26, "T", { s: 11 });
          s += "<rect x='20' y='44' width='440' height='260' fill='#F3EFE2' stroke='" + NUIT + "' stroke-width='2'/>";
          s += "<path d='M20 44H70Q90 120 66 190T84 304H20Z' fill='#4A90C2'/>" + txt(44, 180, "Wouri", { s: 11, c: "#fff", i: true });
          s += "<path d='M70 44Q90 120 66 190T84 304H112Q118 240 100 190T104 44Z' fill='#5E9E4E'/>";
          s += "<path d='M104 44Q122 120 100 190T112 304H230Q236 220 210 170T220 44Z' fill='url(#gcH)' opacity='.95'/>";
          s += "<path d='M240 44V304M110 190H460M240 250L460 150' stroke='#8E939C' stroke-width='5'/>";
          var k; for (k = 0; k < 30; k++) { var x = 130 + (k % 6) * 52 + (k % 6 > 1 ? 20 : 0), y = 60 + Math.floor(k / 6) * 48; if (Math.abs(x - 240) < 14 || Math.abs(y - 190) < 12) continue; s += "<rect x='" + x + "' y='" + y + "' width='14' height='11' fill='#6F737C'/>"; }
          s += "<ellipse cx='388' cy='108' rx='56' ry='34' fill='none' stroke='#A07850'/><ellipse cx='388' cy='108' rx='34' ry='20' fill='none' stroke='#A07850'/><rect x='380' y='100' width='18' height='14' fill='#C62828' stroke='#fff' stroke-width='2'/>";
          s += "<circle cx='180' cy='232' r='9' fill='#E8A33D' stroke='#fff' stroke-width='2'/><path d='M180 232L389 107' stroke='#C62828' stroke-width='3' stroke-dasharray='8 5' marker-end='url(#gcF)'/>";
          s += "<g transform='translate(430 78)'><circle r='20' fill='#fff' stroke='" + NUIT + "'/><path d='M0 -18L6 0H-6Z' fill='#C62828'/><path d='M0 18L6 0H-6Z' fill='" + NUIT + "'/>" + txt(0, -24, "N", { s: 12 }) + "</g><circle cx='404' cy='56' r='10' fill='#F7C948'/>" + txt(404, 60, "O", { s: 11 });
          s += "<rect x='34' y='284' width='67' height='8' fill='" + NUIT + "'/><rect x='101' y='284' width='67' height='8' fill='#fff' stroke='" + NUIT + "'/>" + txt(34, 280, "0", { s: 9, w: 600 }) + txt(101, 280, "100", { s: 9, w: 600 }) + txt(168, 280, "200 m", { s: 9, w: 600 }) + txt(102, 300, "1/10 000", { s: 9, w: 600 }) + "<circle cx='186' cy='290' r='10' fill='#F7C948'/>" + txt(186, 294, "E", { s: 11 });
          s += "<rect x='476' y='44' width='150' height='260' rx='8' fill='#fff' stroke='#C9D2E3'/>" + txt(551, 64, "Légende", { s: 13 }) + "<circle cx='612' cy='60' r='10' fill='#F7C948'/>" + txt(612, 64, "L", { s: 11 });
          [["<rect width='22' height='14' fill='url(#gcH)'/>", "zone inondable"], ["<rect width='22' height='14' fill='#5E9E4E'/>", "mangrove"], ["<rect width='22' height='14' fill='#4A90C2'/>", "fleuve Wouri"], ["<rect x='4' y='2' width='14' height='11' fill='#6F737C'/>", "habitations"], ["<path d='M0 7H22' stroke='#8E939C' stroke-width='5'/>", "route"], ["<rect x='4' y='0' width='14' height='14' fill='#C62828'/>", "point de refuge"], ["<circle cx='11' cy='7' r='7' fill='#E8A33D'/>", "marché"], ["<path d='M0 7H22' stroke='#C62828' stroke-width='3' stroke-dasharray='6 4'/>", "itinéraire"], ["<ellipse cx='11' cy='7' rx='11' ry='6' fill='none' stroke='#A07850'/>", "colline"]].forEach(function (l, i) { s += "<g transform='translate(486 " + (78 + i * 24) + ")'>" + l[0] + "</g>" + txt(516, 90 + i * 24, l[1], { s: 11, a: "start", w: 500 }); });
          s += txt(20, 326, "Source : relevés du club environnement, 2026", { s: 10, a: "start", c: GRIS, w: 500 }) + "<circle cx='300' cy='322' r='10' fill='#F7C948'/>" + txt(300, 326, "S", { s: 11 });
          return svg(640, 340, "Carte d’un quartier de Douala au bord du Wouri : zone inondable hachurée, mangrove, maisons, routes, marché, refuge sur une colline, flèche du Nord, échelle et légende", fleche("gcF", "#C62828"), s);
        })() }],
        fil: { html: "<p>Un habitant qui n'a pas participé au brouillon ne peut pas deviner que les hachures signalent un danger, ni où est le Nord, ni quelle distance sépare deux points. Sans <strong>titre</strong>, on ne sait pas ce que montre la carte ; sans <strong>légende</strong>, les symboles sont muets ; sans <strong>orientation</strong> et <strong>échelle</strong>, on ne peut ni s'orienter ni mesurer ; sans <strong>source</strong>, on ne sait pas si l'on peut s'y fier.</p>", verdicts: [[0, "rejetee", "Sans titre, légende, orientation, échelle et source, la carte est illisible."]] },
        retenir: "TOLES : Titre, Orientation, Légende, Échelle, Source." },
      { t: "Calculer avec l'échelle", html: partie(GC_OLD, 1),
        fil: { html: "<p>Au 1/10 000, <strong>1 cm sur la carte = 10 000 cm sur le terrain</strong>. Donc 3,5 cm représentent 3,5 × 10 000 = 35 000 cm. On convertit : 35 000 cm = 350 m = 0,35 km. L'erreur consistait à oublier de multiplier par le dénominateur et à changer d'unité au hasard. À pied (environ 5 km/h, soit 83 m par minute), 350 m se parcourent en un peu plus de 4 minutes.</p>", verdicts: [[1, "rejetee", "3,5 cm × 10 000 = 35 000 cm = 350 m, et non 3,5 km."]] },
        retenir: "Distance réelle = distance sur la carte × dénominateur, puis conversion." },
      { t: "S'orienter", html: partie(GC_OLD, 2),
        planches: [{ type: "3d", titre: "La maquette du quartier", legende: "Tourne la maquette : à l'Ouest, le Wouri et sa mangrove ; la zone basse inondable en bleu clair ; les maisons et les routes ; au Nord-Est, l'école sur sa colline, avec son drapeau. L'itinéraire rouge monte du marché vers le refuge. La rose des vents donne le Nord (pointe rouge).",
          modele: { h: 380, rx: -42, ry: 20, echelle: 0.75, alt: "Maquette d’un quartier : fleuve, mangrove, zone inondable, maisons, routes, colline avec une école, itinéraire rouge et rose des vents", objets: quartier3D(),
            etiquettes: [{ p: [150, 90, 120], t: "refuge (Nord-Est)", cote: "d" }, { p: [-80, 16, -95], t: "marché", cote: "g" }, { p: [-225, 2, 100], t: "Wouri (Ouest)", cote: "g" }, { p: [220, 8, -146], t: "Nord", cote: "d" }] } }],
        fil: { html: "<p>La flèche du Nord pointe vers le haut de la carte : le refuge est en haut et à droite du marché, donc au <strong>Nord-Est</strong>, à l'opposé du fleuve qui coule à l'Ouest. La carte complète permet de dire aux habitants : « En cas de crue, quittez la zone hachurée et marchez 350 m vers le Nord-Est, jusqu'à l'école de la colline. »</p>", verdicts: [[2, "validee", "TOLES complet ; 350 m vers le Nord-Est : le refuge est accessible à pied."]] },
        retenir: "Le Nord est en haut, sauf indication contraire de la flèche." },
      GC_OLD && GC_OLD.parties[3] ? GC_OLD.parties[3] : { t: "Entraînement", html: "" }
    ],
    denouement: {
      titre: "La carte remise aux habitants",
      etapes: ["Ajouter titre, orientation, légende, échelle, source (indice 1).", "3,5 cm × 10 000 = 350 m (indice 2).", "Refuge au Nord-Est, loin du fleuve (indice 3)."],
      reponse: "<p>Le brouillon n'est pas encore une carte : il lui faut un titre (« Zones inondables et évacuation du quartier… »), une orientation (flèche du Nord), une légende (zone inondable hachurée, mangrove, habitations, routes, marché, point de refuge, itinéraire), une échelle (1/10 000 et une échelle graphique) et une source avec sa date. La distance se calcule avec l'échelle : 3,5 cm × 10 000 = 35 000 cm = 350 m, et non 3,5 km. Le refuge, l'école sur la colline, se trouve à 350 m au Nord-Est du marché, à l'opposé du Wouri : environ 4 à 5 minutes de marche. Le plan d'évacuation est donc réaliste, et la carte complète permettra à tous les habitants de le suivre.</p>",
      transfert: "<p>Sur une carte au 1/50 000, Bonabéri et Akwa sont séparés de 9 cm. Quelle distance réelle ? <em>(9 × 50 000 = 450 000 cm = 4,5 km.)</em></p>"
    },
    revision: (GC_OLD ? GC_OLD.revision : []).concat(["Conversions : 100 cm = 1 m ; 100 000 cm = 1 km."]),
    exo: GC_OLD ? GC_OLD.exo : "",
    quiz: GC_OLD ? GC_OLD.quiz : []
  });

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  VRT_A("2nde-a-maths-reels", 1, "Partage la tontine : décimal ou pas, et combien en francs ?", function (el) {
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:8px 18px;align-items:end'><label class='labo-c'><span>Caisse (F)</span><input type='number' value='100000' min='1' step='500' data-c style='width:120px;font:inherit;padding:6px'></label><label class='labo-c'><span>Membres : <b data-nv>6</b></span><input type='range' min='2' max='16' value='6' data-n></label></div><div data-v style='display:flex;flex-wrap:wrap;gap:4px;margin:10px 0'></div><p class='labo-r' data-r></p>";
    var C = el.querySelector("[data-c]"), N = el.querySelector("[data-n]");
    function maj() {
      var c = Math.max(1, parseInt(C.value, 10) || 0), n = parseInt(N.value, 10), g = pgcd(c, n), p = c / g, qq = n / g, F = facteurs(qq), ok = F.every(function (x) { return x === 2 || x === 5; }), part = Math.floor(c / n), reste = c - part * n, k, v = "";
      el.querySelector("[data-nv]").textContent = n;
      for (k = 0; k < n; k++) v += "<span style='display:inline-flex;flex-direction:column;align-items:center;padding:4px 6px;border-radius:8px;background:" + ["#E8A33D", "#1E499B", "#C62828", "#2E7D32"][k % 4] + ";color:#fff;font-size:12px;font-weight:700'>👗<span>" + milliers(part) + " F</span></span>";
      el.querySelector("[data-v]").innerHTML = v + (reste ? "<span style='align-self:center;padding:4px 8px;border:2px dashed #4D5163;border-radius:8px;font-size:12px;font-weight:700'>caisse : " + reste + " F</span>" : "");
      el.querySelector("[data-r]").innerHTML = milliers(c) + " ÷ " + n + " = " + (g > 1 ? milliers(p) + "/" + qq + " = " : "") + "<b>" + developpe(p, qq) + "</b> · " + (qq === 1 ? "<b style='color:" + VERT + "'>entier : partage exact</b>" : "dénominateur " + qq + " = " + F.join(" × ") + " · " + (ok ? "<b style='color:" + VERT + "'>décimal</b>" : "<b style='color:" + ROUGE + "'>rationnel non décimal</b>")) + " · en francs : <b>" + milliers(part) + " F</b> chacune" + (reste ? ", <b>" + reste + " F</b> restent en caisse" : ", rien en caisse");
    }
    C.addEventListener("input", maj); N.addEventListener("input", maj); maj();
  });
  VRT_A("2nde-a-histoire-disciplines", 2, "Datation au carbone 14 : règle le pourcentage restant", function (el) {
    el.innerHTML = "<label class='labo-c'><span>Carbone 14 restant : <b data-pv>88</b> %</span><input type='range' min='1' max='100' step='0.5' value='88' data-p style='width:260px'></label><div style='display:flex;flex-wrap:wrap;gap:6px;margin:8px 0'>" + [[88, "charbon de Mbalmayo"], [50, "une demi-vie"], [25, "deux demi-vies"], [3, "abri ancien"]].map(function (b) { return "<button type='button' class='btn-l' data-b='" + b[0] + "'>" + b[0] + " % · " + b[1] + "</button>"; }).join("") + "</div><div data-g></div><p class='labo-r' data-r></p>";
    var P = el.querySelector("[data-p]"), T = 5730, TM = 30000, X = function (t) { return 50 + t / TM * 400; }, Y = function (p) { return 170 - p * 1.5; };
    var courbe = "", t; for (t = 0; t <= TM; t += 300) courbe += (t ? "L" : "M") + X(t).toFixed(1) + " " + Y(100 * Math.pow(0.5, t / T)).toFixed(1);
    function maj() {
      var p = parseFloat(P.value), age = Math.round(T * Math.log(100 / p) / Math.LN2 / 10) * 10, an = 2026 - age, s = "<rect width='470' height='200' fill='#FBF8F2'/><path d='M50 20V170H455' stroke='" + NUIT + "' stroke-width='2' fill='none'/>", k;
      for (k = 0; k <= 5; k++) s += "<path d='M" + X(k * T) + " 170v5' stroke='" + NUIT + "'/>" + txt(X(k * T), 188, k ? milliers(k * T) : "0", { s: 9, c: GRIS, w: 600 });
      [100, 50, 25].forEach(function (v) { s += txt(44, Y(v) + 4, v + " %", { s: 9, a: "end", c: GRIS, w: 600 }) + "<path d='M50 " + Y(v) + "H455' stroke='#E3E7EF' stroke-dasharray='3 3'/>"; });
      s += "<path d='" + courbe + "' stroke='" + VERT + "' stroke-width='3' fill='none'/>";
      var x = Math.min(X(age), 455), y = Y(p);
      s += "<path d='M50 " + y + "H" + x + "V170' stroke='" + ROUGE + "' stroke-dasharray='4 3' fill='none'/><circle cx='" + x + "' cy='" + y + "' r='6' fill='" + ROUGE + "' stroke='#fff' stroke-width='2'/>" + txt(250, 16, "années écoulées depuis la mort de l'arbre", { s: 10, c: GRIS, w: 600 });
      el.querySelector("[data-pv]").textContent = String(p).replace(".", ",");
      el.querySelector("[data-g]").innerHTML = "<svg viewBox='0 0 470 200' style='max-width:520px;width:100%' role='img' aria-label='Courbe de décroissance du carbone 14'>" + s + "</svg>";
      el.querySelector("[data-r]").innerHTML = "Âge ≈ 5 730 × log₂(100 / " + String(p).replace(".", ",") + ") ≈ <b>" + milliers(age) + " ans</b> · " + (age > TM ? "au-delà du graphique · " : "") + "date ≈ <b>" + (an > 0 ? "an " + an : milliers(-an + 1) + " av. J.-C.") + "</b>";
    }
    P.addEventListener("input", maj);
    el.querySelectorAll("[data-b]").forEach(function (b) { b.addEventListener("click", function () { P.value = b.dataset.b; maj(); }); });
    maj();
  });
  VRT_A("2nde-a-philo-definitions", 1, "Opinion ou question philosophique ?", function (el) {
    exercice(el, [["« Les filles n'aiment pas les maths. » C'est… ___", ["une opinion", "une question philosophique", "un fait vérifié"], "Généralisation sans preuve : une opinion (doxa)."], ["« Qu'est-ce qui rend une loi juste ? » C'est… ___", ["une question philosophique", "une opinion", "un fait vérifié"], "Question sur une notion fondamentale : la justice."], ["« Yaoundé est la capitale du Cameroun. » C'est… ___", ["un fait vérifié", "une opinion", "une question philosophique"], "Vérifiable : un fait."], ["« Tout le monde sait que l'argent fait le bonheur. » C'est… ___", ["une opinion", "un fait vérifié", "une question philosophique"], "« Tout le monde sait » : formule typique de l'opinion."], ["« Le bonheur dépend-il de l'argent ? » C'est… ___", ["une question philosophique", "une opinion", "un fait vérifié"], "Elle appelle des arguments, pas un simple avis."], ["« Doit-on toujours obéir à ses parents ? » C'est… ___", ["une question philosophique", "un fait vérifié", "une opinion"], "Question sur le devoir et la liberté."], ["« Les élèves de série A ne trouvent jamais de travail. » C'est… ___", ["une opinion", "un fait vérifié", "une question philosophique"], "« Jamais » : un contre-exemple suffit à la réfuter."]], "Phrase suivante", "Phrase");
  });
  VRT_A("2nde-a-geo-cartes", 1, "Mesure sur la carte, trouve la distance réelle", function (el) {
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:8px 18px;align-items:end'><label class='labo-c'><span>Échelle</span><select data-e style='font:inherit;padding:6px'>" + [10000, 25000, 50000, 200000, 500000].map(function (d) { return "<option value='" + d + "'>1/" + milliers(d) + "</option>"; }).join("") + "</select></label><label class='labo-c'><span>Sur la carte : <b data-dv>3,5</b> cm</span><input type='range' min='0.5' max='15' step='0.5' value='3.5' data-d style='width:220px'></label></div><div data-g style='margin:10px 0'></div><p class='labo-r' data-r></p>";
    var E = el.querySelector("[data-e]"), D = el.querySelector("[data-d]");
    function nb(x) { return milliers(Math.round(x * 1000) / 1000).replace(".", ","); }
    function maj() {
      var e = parseInt(E.value, 10), d = parseFloat(D.value), cm = d * e, m = cm / 100, km = m / 1000, px = d * 28;
      el.querySelector("[data-dv]").textContent = String(d).replace(".", ",");
      var s = "<rect width='470' height='70' fill='#F3EFE2'/><rect x='10' y='40' width='" + (15 * 28 + 10) + "' height='22' fill='#F7C948' stroke='#B8860B'/>", k;
      for (k = 0; k <= 15; k++) s += "<path d='M" + (15 + k * 28) + " 40v" + (k % 5 ? 8 : 13) + "' stroke='#1F2328'/>" + (k % 5 ? "" : txt(15 + k * 28, 60, String(k), { s: 9, c: "#1F2328", w: 600 }));
      s += "<circle cx='15' cy='22' r='7' fill='#E8A33D' stroke='#fff' stroke-width='2'/><rect x='" + (8 + px) + "' y='15' width='14' height='14' fill='#C62828' stroke='#fff' stroke-width='2'/><path d='M15 22H" + (8 + px) + "' stroke='#C62828' stroke-width='3' stroke-dasharray='6 4'/>";
      el.querySelector("[data-g]").innerHTML = "<svg viewBox='0 0 470 70' style='max-width:520px;width:100%' role='img' aria-label='Règle graduée en centimètres sous un trajet du marché au refuge'>" + s + "</svg>";
      el.querySelector("[data-r]").innerHTML = String(d).replace(".", ",") + " cm × " + milliers(e) + " = <b>" + nb(cm) + " cm</b> = <b>" + nb(m) + " m</b> = <b>" + nb(km) + " km</b>" + (m < 2000 ? " · à pied (5 km/h) : environ <b>" + Math.max(1, Math.round(m / 83)) + " min</b>" : " · à pied : environ <b>" + nb(Math.round(km / 5 * 10) / 10) + " h</b>");
    }
    E.addEventListener("change", maj); D.addEventListener("input", maj); maj();
  });
})();
