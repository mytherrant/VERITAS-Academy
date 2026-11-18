/* Leçons APPROFONDIES — lot 13, 2nde (18/11/2026) : ℝ et ses sous-ensembles, texte théâtral, la production (2nde C),
   l'énonciation (2nde A). Même gabarit et même mécanisme que 11-approfondies-lot4.js (remplacement EN PLACE ; ordre, clé,
   fiche APC, examen et scènes conservés ; partie « Entraînement au format de l'examen » et quiz d'origine repris).
   Simulations VRT_A en fin de fichier. */
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
  function bloc(x, y, w, h, c, l1, l2, l3) {
    return "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='" + h + "' rx='12' fill='" + c + "'/>" + txt(x + w / 2, y + h / 2 - (l2 ? 4 : -6), l1, { s: 18, c: "#fff" }) + (l2 ? txt(x + w / 2, y + h / 2 + 16, l2, { s: 11, c: "#fff", w: 500 }) : "") + (l3 ? txt(x + w / 2, y + h + 18, l3, { s: 11, c: GRIS, w: 600 }) : "");
  }

  /* ═══════════════════════ 2nde C MATHS — ℝ ET SES SOUS-ENSEMBLES ═══════════════════════ */
  var MR_OLD = ancien("2nde-c-maths-reels");
  function pgcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function champ3D() {
    var o = [], k, R = alea(30);
    o.push({ f: "boite", c: [0, -8, 0], d: [440, 8, 440], coul: "#6B4A2B", dessus: "#7A5530" });
    for (k = 0; k < 9; k++) o.push({ f: "boite", c: [-160 + k * 40, 2, 0], d: [22, 10, 340], coul: "#5D3A1E", dessus: "#4E7D2A", div: false });
    for (k = 0; k < 60; k++) o.push({ f: "sphere", c: [-160 + (k % 9) * 40 + (R() - 0.5) * 6, 14, -150 + Math.floor(k / 9) * 48 + (R() - 0.5) * 10], r: 7, coul: k % 3 ? "#3E8E3A" : "#5AA14A" });
    [[-180, -180], [180, -180], [180, 180], [-180, 180]].forEach(function (p) { o.push({ f: "cylindre", c: [p[0], 0, p[1]], r: 4, h: 50, n: 8, coul: "#8B5A2B" }); });
    for (k = 0; k <= 30; k++) { var t = k / 30; o.push({ f: "sphere", c: [-180 + 360 * t, 48, -180 + 360 * t], r: 2.4, coul: "#C62828" }); }
    [[-180, -180, 180, -180], [180, -180, 180, 180], [180, 180, -180, 180], [-180, 180, -180, -180]].forEach(function (l) { for (k = 0; k <= 20; k++) { var t = k / 20; o.push({ f: "sphere", c: [l[0] + (l[2] - l[0]) * t, 46, l[1] + (l[3] - l[1]) * t], r: 1.4, coul: "#E9E2D2" }); } });
    return o;
  }
  remplacer("2nde-c-maths-reels", {
    c: "2nde C", m: "maths", titre: "ℝ et ses sous-ensembles", duree: 35,
    accroche: "« 0,8333333 : la calculatrice l'affiche, donc c'est un décimal ! » Le trésorier de la coopérative de Santa se trompe-t-il ?",
    intro: "Les partages et les mesures d'une coopérative agricole te servent de fil rouge : à chaque partie, un indice t'aide à trancher entre trois affirmations.",
    objectifs: ["connaître ℕ, ℤ, 𝔻, ℚ, ℝ et leurs inclusions", "reconnaître un décimal grâce à la règle des dénominateurs", "reconnaître un irrationnel", "choisir le plus petit ensemble qui contient un nombre"],
    enquete: {
      titre: "Les comptes de la coopérative de Santa",
      svg: svg(640, 220, "Un trésorier montre une calculatrice affichant 0,8333333 près de sacs de pommes de terre", lin("mrC", ["#DCEBF5", "#F4F1EA"], true), "<rect width='640' height='220' fill='url(#mrC)'/><rect y='176' width='640' height='44' fill='#7A5530'/>" + [0, 1, 2, 3, 4].map(function (k) { return "<path d='M" + (60 + k * 40) + " 176c-6 -40 -2 -54 18 -58c20 4 24 18 18 58Z' fill='#C9B28A' stroke='#8A6E4B'/>"; }).join("") + perso(320, 80, "#5A3A1E", "#2E7D32", "#2E3445") + "<rect x='336' y='110' width='34' height='50' rx='5' fill='#1F2328'/><rect x='340' y='114' width='26' height='12' fill='#B8D8A8'/>" + "<rect x='400' y='40' width='210' height='70' rx='10' fill='#1F2328'/><rect x='410' y='50' width='190' height='40' fill='#B8D8A8'/>" + txt(590, 80, "0,8333333", { s: 24, a: "end", c: "#1F2328" }) + txt(505, 104, "5 ÷ 6", { s: 11, c: "#B8D8A8", w: 500 })),
      legende: "À Santa, dans le Nord-Ouest : la coopérative des producteurs de pommes de terre répartit sa récolte et mesure ses parcelles.",
      contexte: "<p>Cette saison, la coopérative partage <strong>5 tonnes</strong> entre <strong>6 familles</strong> ; la saison dernière, c'était entre 8. Le trésorier tape 5 ÷ 6 et lit 0,8333333 : « C'est un décimal, c'est écrit ! » Un membre ajoute : « 6 = 2 × 3 contient un 2, donc ça doit tomber juste. » Le géomètre, lui, doit planter des piquets le long de la diagonale d'une parcelle carrée de <strong>1 hectomètre</strong> de côté.</p>",
      documents: [{ t: "Le carnet du trésorier", html: "<table class='donnees'><tr><th>Saison</th><th>Partage</th><th>Calculatrice</th></tr><tr><td>2025</td><td>5 ÷ 8</td><td>0,625</td></tr><tr><td>2026</td><td>5 ÷ 6</td><td>0,8333333</td></tr><tr><td>Parcelle</td><td>diagonale d'un carré de 1 hm</td><td>1,4142136</td></tr></table>" }],
      question: "Lesquels de ces nombres sont décimaux, et peut-on écrire exactement la diagonale ?",
      tache: "Classe 5/8, 5/6 et la diagonale dans le plus petit ensemble possible, en justifiant chaque classement.",
      hypotheses: ["Tout nombre affiché par la calculatrice est un décimal.", "5/6 est décimal parce que 6 contient le facteur 2.", "Une fraction irréductible est décimale si son dénominateur n'a que 2 et 5 comme facteurs premiers ; la diagonale √2 est irrationnelle."]
    },
    parties: [
      { t: "Les cinq ensembles de nombres", html: partie(MR_OLD, 0),
        planches: [{ type: "2D", titre: "ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ", legende: "Chaque ensemble est contenu dans le suivant : 3 est dans tous ; −2 n'est pas dans ℕ ; 0,625 est décimal ; 5/6 est rationnel sans être décimal ; √2 et π sont seulement réels.", svg: (function () {
          var E = [["ℝ", 600, 280, "#EEF1F6"], ["ℚ", 500, 230, "#DCE6F2"], ["𝔻", 400, 180, "#C9DAF0"], ["ℤ", 290, 130, "#AFC7EA"], ["ℕ", 170, 80, "#8FB2E3"]], s = "<rect width='640' height='300' fill='#fff'/>";
          E.forEach(function (e, i) { s += "<rect x='" + (20 + i * 30) + "' y='" + (10 + i * 25) + "' width='" + e[1] + "' height='" + e[2] + "' rx='22' fill='" + e[3] + "' stroke='#7E9BC8'/>" + txt(38 + i * 30, 38 + i * 25, e[0], { s: 20, a: "start", c: BLEU }); });
          [["3", 200, 150], ["0", 240, 170], ["−2", 300, 210], ["−7", 330, 175], ["0,625", 420, 230], ["2,35", 410, 200], ["5/6", 500, 250], ["1/3", 520, 225], ["√2", 590, 280], ["π", 600, 250]].forEach(function (n) { s += txt(n[1], n[2], n[0], { s: 16, c: NUIT }); });
          return svg(640, 300, "Cinq rectangles emboîtés N, Z, D, Q, R avec des nombres placés dans le plus petit ensemble", "", s);
        })() }],
        labo: { type: "ensembles" },
        fil: { html: "<p>5/8 = 0,625 = 625/1000 : c'est un <strong>décimal</strong>. Mais la calculatrice n'affiche que 8 ou 10 chiffres : « 0,8333333 » est un <strong>arrondi</strong> de 5/6, dont l'écriture décimale continue sans fin. Ce qui s'affiche n'est pas toujours le nombre exact.</p>", verdicts: [[0, "rejetee", "La calculatrice tronque ou arrondit : 5/6 = 0,8333… n'est pas décimal."]] },
        retenir: "ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ." },
      { t: "Décimal ou pas ? La règle des dénominateurs", html: partie(MR_OLD, 1),
        fil: { html: "<p>5/6 est irréductible et 6 = 2 × 3 : le facteur <strong>3</strong> interdit l'écriture décimale finie. Il ne suffit pas qu'il y ait un 2 : il faut qu'il n'y ait <strong>que</strong> des 2 et des 5. 5/6 ∈ ℚ mais 5/6 ∉ 𝔻.</p>", verdicts: [[1, "rejetee", "Le facteur 3 de 6 interdit le décimal : seuls 2 et 5 sont permis."]] },
        retenir: "p/q irréductible ∈ 𝔻 ⟺ q = 2ᵃ × 5ᵇ." },
      { t: "Les irrationnels", html: partie(MR_OLD, 2),
        planches: [{ type: "3d", titre: "La parcelle carrée et sa diagonale", legende: "Tourne la parcelle : un carré de 1 hm de côté, avec ses rangs de pommes de terre et ses quatre piquets d'angle. La corde rouge suit la diagonale : sa longueur, √2 hm ≈ 141,42 m, ne s'écrit exactement avec aucun nombre décimal.",
          modele: { h: 360, rx: -38, ry: 30, echelle: 0.8, alt: "Parcelle carrée de pommes de terre avec quatre piquets et une corde rouge en diagonale", objets: champ3D(),
            etiquettes: [{ p: [0, 52, 0], t: "diagonale : √2 hm" }, { p: [180, 52, -180], t: "côté : 1 hm", cote: "d" }] } }],
        fil: { html: "<p>D'après Pythagore, la diagonale d'un carré de côté 1 vaut √2. Or 2 n'est pas un carré parfait : √2 est <strong>irrationnel</strong>, son écriture décimale est infinie et non périodique. Le géomètre utilisera une valeur approchée, 141,42 m.</p>", verdicts: [[2, "validee", "Règle des dénominateurs pour 𝔻 ; √2 irrationnel."]] },
        retenir: "Irrationnel : écriture décimale infinie non périodique (√2, π)." },
      MR_OLD && MR_OLD.parties[3] ? MR_OLD.parties[3] : { t: "Entraînement", html: "" }
    ],
    denouement: {
      titre: "Le classement du trésorier",
      etapes: ["5/8 = 0,625 ∈ 𝔻 (indice 1).", "5/6 : 6 = 2 × 3, donc 5/6 ∈ ℚ mais ∉ 𝔻 (indice 2).", "Diagonale √2 hm : irrationnelle, ∈ ℝ seulement (indice 3)."],
      reponse: "<p>5/8 est une fraction irréductible dont le dénominateur 8 = 2³ ne contient que le facteur 2 : c'est un décimal, 0,625, et chaque famille a reçu exactement 625 kg. Pour 5/6, le dénominateur 6 = 2 × 3 contient le facteur 3 : 5/6 = 0,8333… a une écriture décimale infinie (périodique) ; c'est un rationnel mais pas un décimal, et « 0,8333333 » n'est qu'un arrondi de la calculatrice. Enfin, la diagonale de la parcelle mesure √2 hm, car 1² + 1² = 2 : √2 est irrationnel, son écriture décimale est infinie et non périodique ; le géomètre prendra une valeur approchée, environ 141,42 m.</p>",
      transfert: "<p>Classe dans le plus petit ensemble : 21/35 ; 7/12 ; −18/6 ; √50 ; 3/40. <em>(3/5 = 0,6 ∈ 𝔻 ; 7/12 ∈ ℚ ; −3 ∈ ℤ ; 5√2 ∈ ℝ ; 0,075 ∈ 𝔻.)</em></p>"
    },
    revision: (MR_OLD ? MR_OLD.revision : []).concat(["La calculatrice affiche des arrondis : 0,8333333 n'est pas la valeur exacte de 5/6."]),
    exo: MR_OLD ? MR_OLD.exo : "",
    quiz: MR_OLD ? MR_OLD.quiz : []
  });

  /* ═══════════════════════ 2nde C FRANÇAIS — LE TEXTE THÉÂTRAL ═══════════════════════ */
  var FT_OLD = ancien("2nde-c-francais-theatre");
  function scene3D() {
    var o = [], k, rideau = [0, 0, 0];
    o.push({ f: "boite", c: [0, -10, 0], d: [520, 8, 300], coul: "#3B2A1A", dessus: "#4E3A26" });
    o.push({ f: "boite", c: [0, 10, 40], d: [440, 30, 180], coul: "#6B4423", dessus: "#9C6B3C", div: false });
    o.push({ f: "boite", c: [0, 120, 130], d: [440, 190, 6], coul: "#2E6B34", div: false });
    o.push({ f: "boite", c: [-230, 120, -50], d: [16, 220, 16], coul: "#C9A227", div: false });
    o.push({ f: "boite", c: [230, 120, -50], d: [16, 220, 16], coul: "#C9A227", div: false });
    o.push({ f: "boite", c: [0, 226, -50], d: [476, 20, 16], coul: "#C9A227", div: false });
    for (k = 0; k < 6; k++) { o.push({ f: "boite", c: [-200 + k * 18, 120, -44], d: [16, 190, 6], coul: k % 2 ? "#9E1C1C" : "#B32424", div: false, ec: [-90 - k * 4, 0, 0] }); o.push({ f: "boite", c: [200 - k * 18, 120, -44], d: [16, 190, 6], coul: k % 2 ? "#9E1C1C" : "#B32424", div: false, ec: [90 + k * 4, 0, 0] }); }
    o.push({ f: "boite", c: [-90, 44, 80], d: [60, 36, 40], coul: "#8B5A2B", dessus: "#A8703A", div: false });
    [[-40, "#F7C948", "#5A3A1E"], [40, "#1E499B", "#6B4423"], [110, "#2E7D32", "#5A3A1E"]].forEach(function (a) { o.push({ f: "cylindre", c: [a[0], 26, 20], r: 10, h: 54, n: 14, coul: a[1] }); o.push({ f: "sphere", c: [a[0], 92, 20], r: 11, coul: a[2] }); });
    [-160, 0, 160].forEach(function (x) { o.push({ f: "cone", c: [x, 206, -30], r: 14, h: 18, n: 12, coul: "#2C3138" }); o.push({ f: "sphere", c: [x, 202, -30], r: 6, coul: "#FFE066" }); });
    o.forEach(function (x) { if (x.c) x.c[1] -= 70; });
    return o;
  }
  remplacer("2nde-c-francais-theatre", {
    c: "2nde C", m: "francais", titre: "Le texte théâtral : ses caractéristiques", duree: 35,
    accroche: "Le club théâtre répète. « Pourquoi lis-tu les phrases en italique ? » « Et pourquoi parles-tu au public alors que ton père est à côté ? »",
    intro: "La répétition d'une pièce par le club théâtre te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées.",
    objectifs: ["distinguer répliques et didascalies ; comprendre la double énonciation", "reconnaître tirade, stichomythie, monologue et aparté", "repérer actes, scènes, exposition, nœud et dénouement", "lire une page de théâtre comme un metteur en scène"],
    enquete: {
      titre: "La répétition du club théâtre de Mbalmayo",
      svg: svg(640, 230, "Une scène de théâtre aux rideaux rouges ; une élève lit à voix haute une indication en italique", lin("ftS", ["#2B1E14", "#3B2A1A"], true), "<rect width='640' height='230' fill='url(#ftS)'/><path d='M0 0h120v200c-40 -20 -80 -10 -120 10Z' fill='#B32424'/><path d='M640 0h-120v200c40 -20 80 -10 120 10Z' fill='#B32424'/><rect x='0' y='180' width='640' height='50' fill='#6B4423'/>" + perso(240, 92, "#5A3A1E", "#F7C948", "#7B3F99") + perso(380, 92, "#6B4423", "#1E499B", "#2E3445") + bulle(150, 30, 200, "« … en colère. — Assez ! »", "#F2C94C") + bulle(330, 30, 200, "On ne lit pas l'italique !", "#9FC5E8")),
      legende: "Au lycée classique de Mbalmayo : le club théâtre répète une comédie de mariage pour la journée culturelle.",
      contexte: "<p>Pendant la répétition, Béatrice lit à voix haute : « LA FILLE, <em>en colère</em>. — Assez ! », y compris les mots en italique. Le metteur en scène l'arrête. Puis Paul, qui joue le prétendant, se tourne vers le public pour dire « <em>à part</em> » qu'il n'a pas un franc, alors que le père est juste à côté : « Mais le père va l'entendre ! » s'étonne une camarade. Un troisième affirme : « Une pièce, c'est juste une histoire écrite avec des tirets. »</p>",
      documents: [{ t: "Une page du texte de la répétition", html: "<p><strong>LE PÈRE</strong>, <em>s'asseyant</em>. — Alors, jeune homme, combien apportes-tu pour la dot ?<br><strong>LE PRÉTENDANT</strong>, <em>à part</em>. — Pas un franc… <em>(Haut.)</em> Tout ce qu'il faudra, Papa !<br><strong>LA FILLE</strong>, <em>en colère</em>. — Assez !</p>" }],
      question: "Comment lire et jouer correctement cette page de théâtre ?",
      tache: "Annote la page pour les acteurs : répliques, didascalies, aparté, et explique au club la double énonciation.",
      hypotheses: ["Les mots en italique se lisent à voix haute comme le reste.", "Un aparté est impossible : le père, à côté, l'entendrait forcément.", "Les didascalies guident le jeu sans être dites ; l'aparté est une convention : le public l'entend, pas les autres personnages."]
    },
    parties: [
      { t: "Un texte fait pour la scène", html: partie(FT_OLD, 0),
        planches: [{ type: "2D", titre: "Lire une page de théâtre", legende: "Le nom du personnage (en capitales), sa réplique, et les didascalies en italique : elles indiquent gestes, tons et apartés, mais ne se disent pas sur scène.", svg: (function () {
          var s = "<rect width='640' height='250' fill='#F4EFE4'/><rect x='30' y='16' width='380' height='220' rx='6' fill='#FFFDF6' stroke='#D9CFBC'/>", L = [["LE PÈRE", "s'asseyant", "Alors, jeune homme, combien apportes-tu ?"], ["LE PRÉTENDANT", "à part", "Pas un franc…"], ["", "(Haut.)", "Tout ce qu'il faudra, Papa !"], ["LA FILLE", "en colère", "Assez !"]];
          L.forEach(function (l, i) { var y = 50 + i * 46; s += (l[0] ? txt(46, y, l[0], { s: 12, a: "start", c: "#7A1F1F" }) : "") + txt(l[0] ? 46 + l[0].length * 8.6 : 46, y, l[1], { s: 12, a: "start", c: "#1E88E5", i: true }) + txt(46, y + 18, "— " + l[2], { s: 12.5, a: "start", w: 500 }); });
          s += "<rect x='440' y='30' width='180' height='40' rx='10' fill='#7A1F1F'/>" + txt(530, 55, "nom du personnage", { s: 12, c: "#fff" }) + "<rect x='440' y='90' width='180' height='40' rx='10' fill='#1E88E5'/>" + txt(530, 115, "didascalie (italique)", { s: 12, c: "#fff" }) + "<rect x='440' y='150' width='180' height='40' rx='10' fill='" + NUIT + "'/>" + txt(530, 175, "réplique (dite)", { s: 12, c: "#fff" });
          return svg(640, 250, "Page de théâtre annotée : noms des personnages, didascalies en bleu italique, répliques", "", s);
        })() }],
        fil: { html: "<p>« <em>en colère</em> » est une <strong>didascalie</strong> : elle dit à Béatrice <strong>comment</strong> jouer la réplique, pas ce qu'elle doit dire. Sur scène, on joue la colère ; on ne la lit pas.</p>", verdicts: [[0, "rejetee", "Les didascalies guident le jeu ; elles ne sont pas prononcées."]] },
        retenir: "Répliques (dites) + didascalies (jouées) ; double énonciation : l'auteur parle au public à travers les personnages." },
      { t: "Les formes de la parole", html: partie(FT_OLD, 1),
        planches: [{ type: "3d", titre: "La scène du club théâtre", legende: "Tourne la scène : le décor vert, la table, trois comédiens, les projecteurs, le cadre doré. Le curseur ouvre les rideaux. Face au public, l'acteur peut dire un aparté que les autres personnages, par convention, n'entendent pas.",
          modele: { h: 360, rx: -12, ry: 12, echelle: 0.82, alt: "Scène de théâtre avec rideaux rouges, décor, table, trois comédiens et projecteurs", eclate: "Ouvrir les rideaux", jouer: "Lever de rideau", objets: scene3D(),
            etiquettes: [{ p: [0, 140, -30], t: "Projecteurs" }, { p: [40, 34, 20], t: "Le prétendant (aparté)", cote: "d" }, { p: [-110, 50, -44], t: "Rideau", ec: [-90, 0, 0] }] } }],
        fil: { html: "<p>L'<strong>aparté</strong> est une <strong>convention</strong> acceptée par tous : le personnage parle « à part », le public l'entend, les autres personnages sont censés ne pas l'entendre. C'est même un ressort comique : le public sait que le prétendant n'a pas un franc, le père l'ignore.</p>", verdicts: [[1, "rejetee", "L'aparté est une convention théâtrale : le père ne l'entend pas."]] },
        retenir: "Tirade, stichomythie, monologue, aparté." },
      { t: "La structure d'une pièce", html: partie(FT_OLD, 2),
        planches: [{ type: "2D", titre: "Exposition, nœud, dénouement", legende: "La tension monte pendant le nœud (obstacles, rivalités entre prétendants) puis retombe au dénouement : heureux dans la comédie, malheureux dans la tragédie.", svg: (function () {
          var X = function (t) { return 60 + t * 540; }, d = "", t;
          for (t = 0; t <= 1; t += 0.02) d += (t ? "L" : "M") + X(t).toFixed(1) + " " + (230 - 170 * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.8)), 1.4)).toFixed(1);
          var s = "<rect width='640' height='270' fill='#fff'/><rect x='60' y='30' width='130' height='210' fill='#EEF3FC'/><rect x='190' y='30' width='300' height='210' fill='#FCEDEA'/><rect x='490' y='30' width='110' height='210' fill='#EEF8F1'/><path d='" + d + "' fill='none' stroke='#7A1F1F' stroke-width='4'/>";
          s += txt(125, 254, "exposition", { s: 13, c: BLEU }) + txt(340, 254, "nœud", { s: 13, c: "#A31238" }) + txt(545, 254, "dénouement", { s: 13, c: VERT }) + txt(70, 24, "tension", { s: 11.5, a: "start", c: GRIS });
          ["Acte I", "Acte II", "Acte III"].forEach(function (a, i) { s += "<path d='M" + (60 + (i + 1) * 180) + " 30V240' stroke='#C9D2E3' stroke-dasharray='4 4'/>" + txt(150 + i * 180, 48, a, { s: 11, c: GRIS }); });
          return svg(640, 270, "Courbe de tension d une pièce : exposition, nœud, dénouement, sur trois actes", "", s);
        })() }],
        fil: { html: "<p>Une pièce n'est pas « une histoire avec des tirets » : elle est construite pour la scène, en actes et en scènes, avec une exposition, un nœud et un dénouement, et chaque mot écrit sert le jeu.</p>", verdicts: [[2, "validee", "Didascalies jouées, aparté conventionnel, structure pour la scène."]] },
        retenir: "Actes, scènes ; exposition, nœud, dénouement." },
      FT_OLD && FT_OLD.parties[3] ? FT_OLD.parties[3] : { t: "Entraînement", html: "" }
    ],
    denouement: {
      titre: "La page annotée pour le club",
      etapes: ["Didascalies : jouer la colère, s'asseoir, parler « à part », sans les dire (indice 1).", "Aparté : convention ; le public entend, le père non (indice 2).", "Une page construite pour la scène, dans une structure en actes (indice 3)."],
      reponse: "<p>Dans cette page, les noms en capitales indiquent qui parle, les répliques sont les paroles à dire, et les mots en italique sont des didascalies : « s'asseyant », « à part », « Haut », « en colère » indiquent des gestes et des tons à jouer, jamais à prononcer. « Pas un franc… » est un aparté : par convention, le prétendant parle au public, que les autres personnages sont censés ne pas entendre ; c'est ce qui crée le comique, puisque le spectateur en sait plus que le père. C'est la double énonciation : l'auteur s'adresse au public à travers les personnages. Enfin, cette scène appartient au nœud d'une comédie : les obstacles au mariage s'accumulent avant un dénouement heureux.</p>",
      transfert: "<p>Écris une courte scène de six répliques (un vendeur et un client au marché) avec trois didascalies et un aparté, puis joue-la avec un camarade.</p>"
    },
    revision: (FT_OLD ? FT_OLD.revision : []).concat(["Les didascalies se jouent, elles ne se disent pas.", "L'aparté est une convention : le public l'entend, pas les autres personnages."]),
    exo: FT_OLD ? FT_OLD.exo : "",
    quiz: FT_OLD ? FT_OLD.quiz : []
  });

  /* ═══════════════════════ 2nde C ECM — LA PRODUCTION ═══════════════════════ */
  var EP_OLD = ancien("2nde-c-ecm-production");
  function filiere3D() {
    var o = [], k;
    o.push({ f: "boite", c: [0, -10, 0], d: [600, 8, 260], coul: "#7A9A4A", dessus: "#8FB35A" });
    o.push({ f: "boite", c: [0, -5, 0], d: [600, 2, 40], coul: "#8A7A66", dessus: "#9C8C76", div: false });
    /* cacaoyers (primaire) */
    [[-240, -70], [-190, -100], [-250, -130]].forEach(function (p) { o.push({ f: "cylindre", c: [p[0], 0, p[1]], r: 5, h: 50, n: 8, coul: "#5D3A1E" }); o.push({ f: "sphere", c: [p[0], 66, p[1]], r: 26, coul: "#2E6B34" }); for (k = 0; k < 3; k++) o.push({ f: "sphere", c: [p[0] + 6 - k * 4, 26 + k * 8, p[1] + 6], r: [4, 7, 4], n: 8, m: 6, coul: k % 2 ? "#E07A1F" : "#C9A227" }); });
    /* petite usine (secondaire) */
    o.push({ f: "boite", c: [0, 30, -90], d: [120, 70, 80], coul: "#C9C1B2", dessus: "#8E96A6", div: false });
    o.push({ f: "cylindre", c: [40, 64, -110], r: 8, h: 50, n: 12, coul: "#7A6A55" });
    o.push({ f: "sphere", c: [44, 126, -110], r: 12, coul: "#E9ECEF", op: 0.5 });
    /* boutique et camion (tertiaire) */
    o.push({ f: "boite", c: [210, 25, -90], d: [100, 60, 70], coul: "#F2C94C", dessus: "#C62828", div: false });
    o.push({ f: "boite", c: [210, 30, -126], d: [60, 30, 2], coul: "#9FC5E8", div: false });
    o.push({ f: "boite", c: [-60, 14, 0], d: [70, 34, 34], coul: "#1E88E5", dessus: "#F7F7F7", div: false });
    o.push({ f: "boite", c: [-12, 10, 0], d: [26, 26, 32], coul: "#C62828", dessus: "#E8492E", div: false });
    [[-80, -18], [-80, 18], [-20, -18], [-20, 18]].forEach(function (p) { o.push({ f: "cylindre", c: [p[0], 0, p[1]], r: 7, h: 4, n: 12, axe: "z", coul: "#1F2328" }); });
    return o;
  }
  remplacer("2nde-c-ecm-production", {
    c: "2nde C", m: "ecm", titre: "La production : facteurs et secteurs", duree: 35,
    accroche: "Vendre ses fèves brutes ou fabriquer du chocolat à Ebolowa ? Le projet de Nadège fait débattre la coopérative.",
    intro: "Le projet d'une jeune entrepreneuse de la filière cacao te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées.",
    objectifs: ["définir la production de biens et de services", "identifier les facteurs de production (nature, travail, capital)", "classer une activité dans le secteur primaire, secondaire ou tertiaire", "expliquer l'intérêt de transformer sur place"],
    enquete: {
      titre: "Le projet de chocolaterie de Nadège",
      svg: svg(640, 230, "Une cacaoyère, un petit atelier de transformation et une boutique qui vend des tablettes de chocolat", "", "<rect width='640' height='230' fill='#E9F1DC'/><rect y='186' width='640' height='44' fill='#8FB35A'/>" + [70, 120, 170].map(function (x) { return "<path d='M" + x + " 186v-60' stroke='#5D3A1E' stroke-width='8'/><circle cx='" + x + "' cy='110' r='30' fill='#2E6B34'/><ellipse cx='" + (x + 6) + "' cy='150' rx='6' ry='10' fill='#E07A1F'/>"; }).join("") + "<rect x='260' y='120' width='120' height='66' fill='#C9C1B2'/><path d='M252 120h136l-68 -30Z' fill='#8E96A6'/><rect x='350' y='70' width='12' height='50' fill='#7A6A55'/>" + "<rect x='450' y='120' width='140' height='66' fill='#F2C94C'/><path d='M444 120h152l-10 -20h-132Z' fill='#C62828'/><rect x='480' y='140' width='40' height='26' fill='#5A2E0A'/><rect x='526' y='140' width='40' height='26' fill='#5A2E0A'/>" + txt(115, 210, "primaire", { s: 12, c: "#1B5E20" }) + txt(320, 210, "secondaire", { s: 12, c: "#5C6478" }) + txt(520, 210, "tertiaire", { s: 12, c: "#C62828" }) + "<path d='M210 160h40M394 160h46' stroke='" + NUIT + "' stroke-width='2.5' marker-end='url(#epF)'/>").replace("</defs>", fleche("epF", NUIT) + "</defs>"),
      legende: "À Ebolowa : Nadège, fille de cacaoculteur, a appris à fabriquer du chocolat et présente son projet à la coopérative.",
      contexte: "<p>La coopérative vend chaque année ses fèves séchées à un exportateur. Nadège propose d'en transformer une partie en <strong>tablettes de chocolat</strong> vendues dans les supermarchés de Yaoundé. Un aîné objecte : « Nous sommes des planteurs, la production, c'est le champ ; le reste n'est pas de la production. » Un autre : « Pour produire, il suffit d'avoir de la terre et des bras. »</p>",
      documents: [{ t: "Ce dont Nadège a besoin (exemple)", html: "<table class='donnees'><tr><td>Fèves de cacao, sucre, eau</td><td>nature</td></tr><tr><td>Trois ouvriers, un comptable</td><td>travail</td></tr><tr><td>Torréfacteur, broyeuse, moules, local, fonds de départ</td><td>capital</td></tr><tr><td>Un plan d'affaires, la recherche de clients</td><td>esprit d'entreprise</td></tr></table>" }],
      question: "La transformation et la vente du chocolat sont-elles de la production, et de quoi Nadège a-t-elle besoin ?",
      tache: "Présente la filière du cacao à chocolat en trois secteurs et justifie l'intérêt de transformer sur place.",
      hypotheses: ["Seul le travail des champs est de la production.", "Pour produire, la terre et les bras suffisent.", "Produire, c'est créer des biens ou des services ; il faut nature, travail et capital ; la filière couvre les trois secteurs."]
    },
    parties: [
      { t: "Qu'est-ce que produire ?", html: partie(EP_OLD, 0),
        fil: { html: "<p>La tablette de chocolat est un <strong>bien</strong> ; son transport et sa vente au supermarché sont des <strong>services</strong>. Ce sont aussi des productions : l'aîné confond production et agriculture.</p>", verdicts: [[0, "rejetee", "Transformer et vendre, c'est aussi produire (biens et services)."]] },
        retenir: "Produire = créer des biens ou des services pour satisfaire des besoins." },
      { t: "Les facteurs de production", html: partie(EP_OLD, 1),
        fil: { html: "<p>Le document le montre : sans torréfacteur, broyeuse, moules et local (le <strong>capital</strong>), les fèves (la <strong>nature</strong>) et les ouvriers (le <strong>travail</strong>) ne donnent pas de chocolat. Il faut aussi l'esprit d'entreprise de Nadège pour combiner le tout.</p>", verdicts: [[1, "rejetee", "Sans capital (machines, local, fonds), pas de transformation."]] },
        retenir: "Nature, travail, capital (+ esprit d'entreprise)." },
      { t: "Les trois secteurs d'activité", html: partie(EP_OLD, 2),
        planches: [{ type: "3d", titre: "La filière cacao, du champ à la boutique", legende: "Tourne la scène de gauche à droite : les cacaoyers et leurs cabosses (primaire), l'atelier de transformation et sa cheminée (secondaire), le camion de livraison et la boutique (tertiaire).",
          modele: { h: 340, rx: -24, ry: 18, echelle: 0.85, alt: "Paysage avec cacaoyers, un atelier de transformation, un camion et une boutique", objets: filiere3D(),
            etiquettes: [{ p: [-220, 96, -100], t: "Primaire : cacaoculture" }, { p: [0, 70, -90], t: "Secondaire : chocolaterie", cote: "d" }, { p: [210, 60, -90], t: "Tertiaire : commerce", cote: "d" }, { p: [-40, 34, 0], t: "Tertiaire : transport" }] } }],
        fil: { html: "<p>La filière traverse les trois secteurs : cacaoculture (primaire), fabrication du chocolat (secondaire), transport et vente (tertiaire). Transformer sur place fait passer une partie de la valeur ajoutée du secondaire et du tertiaire au Cameroun, et crée des emplois.</p>", verdicts: [[2, "validee", "Biens et services, trois facteurs, trois secteurs."]] },
        retenir: "Primaire : nature ; secondaire : transformation ; tertiaire : services." },
      EP_OLD && EP_OLD.parties[3] ? EP_OLD.parties[3] : { t: "Entraînement", html: "" }
    ],
    denouement: {
      titre: "La filière du cacao à chocolat",
      etapes: ["Le chocolat est un bien, sa vente un service : deux productions (indice 1).", "Nature, travail, capital, esprit d'entreprise (indice 2).", "Primaire, secondaire, tertiaire ; valeur ajoutée gardée sur place (indice 3)."],
      reponse: "<p>Produire, c'est créer des biens ou des services pour satisfaire des besoins : la tablette de chocolat est un bien, son transport et sa vente sont des services ; ce sont donc bien des productions, et pas seulement le travail des champs. Pour produire, Nadège combine les facteurs de production : la nature (fèves, sucre, eau), le travail (ouvriers, comptable) et le capital (torréfacteur, broyeuse, moules, local, fonds), organisés par son esprit d'entreprise ; la terre et les bras ne suffisent pas. La filière couvre les trois secteurs : primaire (cacaoculture), secondaire (chocolaterie), tertiaire (transport, commerce). Transformer sur place garde au Cameroun une plus grande part de la valeur ajoutée et crée des emplois.</p>",
      transfert: "<p>Choisis une autre filière camerounaise (bois, café, manioc, poisson) et présente-la en trois secteurs, avec un exemple de chaque facteur de production.</p>"
    },
    revision: (EP_OLD ? EP_OLD.revision : []).concat(["Une filière traverse les trois secteurs ; transformer sur place garde la valeur ajoutée."]),
    exo: EP_OLD ? EP_OLD.exo : "",
    quiz: EP_OLD ? EP_OLD.quiz : []
  });

  /* ═══════════════════════ 2nde A FRANÇAIS — L'ÉNONCIATION ═══════════════════════ */
  var FE_OLD = ancien("2nde-a-francais-enonciation");
  var MARQUES = [["Je", "pronom de 1ʳᵉ personne"], ["t'", "pronom de 2ᵉ personne"], ["ici", "déictique de lieu"], ["demain", "déictique de temps"], ["sans doute", "modalisateur"], ["!", "ponctuation expressive"]];
  function cour3D() {
    var o = [], k;
    o.push({ f: "boite", c: [0, -10, 0], d: [560, 8, 320], coul: "#C9B28A", dessus: "#D9C49C" });
    o.push({ f: "boite", c: [0, 40, 150], d: [560, 100, 20], coul: "#E9E2D2", dessus: "#C62828", div: false });
    for (k = 0; k < 6; k++) o.push({ f: "boite", c: [-220 + k * 88, 50, 139], d: [36, 46, 2], coul: "#5C6478", div: false });
    o.push({ f: "cylindre", c: [140, 0, 40], r: 4, h: 150, n: 10, coul: "#C9CED6" });
    o.push({ f: "boite", c: [150, 126, 40], d: [14, 30, 2], coul: "#007A3D", div: false });
    o.push({ f: "boite", c: [164, 126, 40], d: [14, 30, 2], coul: "#CE1126", div: false });
    o.push({ f: "boite", c: [178, 126, 40], d: [14, 30, 2], coul: "#FCD116", div: false });
    o.push({ f: "poly", pts: [[164, 132, 38.5], [166, 127, 38.5], [171, 127, 38.5], [167, 124, 38.5], [169, 119, 38.5], [164, 122, 38.5], [159, 119, 38.5], [161, 124, 38.5], [157, 127, 38.5], [162, 127, 38.5]], coul: "#FCD116" });
    o.push({ f: "boite", c: [-120, -2, 60], d: [70, 20, 40], coul: "#8E96A6", dessus: "#B8BFCC", div: false });
    o.push({ f: "boite", c: [-160, 30, 100], d: [70, 50, 4], coul: "#5D3A1E", div: false });
    o.push({ f: "boite", c: [-160, 30, 97], d: [30, 22, 1], coul: "#FBF8F2", div: false });
    return o;
  }
  remplacer("2nde-a-francais-enonciation", {
    c: "2nde A", m: "francais", titre: "L'énonciation : les marques explicites", duree: 35,
    accroche: "« Je t'attends ici demain, sans doute à 8 h. Ne sois pas en retard ! » Un billet sans nom ni date, trouvé dans un cahier : qui, où, quand ?",
    intro: "Un billet mystérieux trouvé au lycée te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois lectures.",
    objectifs: ["identifier la situation d'énonciation (qui, à qui, où, quand)", "relever les marques explicites : pronoms, déictiques, temps, modalisateurs", "distinguer énoncé ancré et énoncé coupé", "transformer un énoncé ancré en énoncé coupé"],
    enquete: {
      titre: "Le billet trouvé dans le cahier",
      svg: svg(640, 220, "Un petit billet manuscrit plié trouvé dans un cahier, et deux élèves intriguées", "", "<rect width='640' height='220' fill='#EEF3F9'/><g transform='rotate(-4 200 110)'><rect x='70' y='30' width='270' height='150' rx='4' fill='#FFFBEA' stroke='#E3D7A6'/><path d='M80 60h250M80 90h250M80 120h250M80 150h250' stroke='#D7E3F2'/>" + txt(90, 74, "Je t'attends ici demain,", { s: 15, a: "start", c: BLEU, i: true }) + txt(90, 104, "sans doute à 8 h.", { s: 15, a: "start", c: BLEU, i: true }) + txt(90, 134, "Ne sois pas en retard !", { s: 15, a: "start", c: BLEU, i: true }) + "</g>" + perso(440, 100, "#5A3A1E", "#DCE6F2", "#1E499B") + perso(530, 104, "#6B4423", "#DCE6F2", "#1E499B") + bulle(400, 30, 200, "Ici ? Demain ? Qui ?", "#9FC5E8")),
      legende: "Au lycée de Kribi, en 2nde A : Grâce trouve un billet glissé dans un cahier emprunté à la bibliothèque.",
      contexte: "<p>Le billet dit : « Je t'attends ici demain, sans doute à 8 h. Ne sois pas en retard ! » Ni nom, ni date, ni lieu. Grâce dit : « Ici, c'est la bibliothèque, et demain, c'est mercredi. » Sa voisine répond : « Impossible de le savoir : ces mots ne veulent rien dire tout seuls. » Le professeur propose d'en faire un exercice sur l'énonciation.</p>",
      documents: [{ t: "La même information, racontée", html: "<p>« La veille de la kermesse, Atangana avait donné rendez-vous à son cousin dans la cour du lycée, à huit heures. »</p>" }],
      question: "Peut-on savoir qui a écrit le billet, à qui, où et quand ? Pourquoi le second texte est-il clair ?",
      tache: "Relève les marques de l'énonciation du billet, puis réécris-le en énoncé coupé.",
      hypotheses: ["« Ici » désigne forcément la bibliothèque, et « demain » forcément mercredi.", "Ces mots n'ont aucun sens.", "Ce sont des déictiques : ils ne se comprennent qu'avec la situation d'énonciation ; le récit utilise des repères absolus."]
    },
    parties: [
      { t: "La situation d'énonciation", html: partie(FE_OLD, 0),
        planches: [{ type: "2D", titre: "Qui ? À qui ? Où ? Quand ?", legende: "Les quatre questions de la situation d'énonciation : l'énonciateur (je), le destinataire (tu), le lieu (ici) et le moment (demain). Sans elles, le billet reste muet.", svg: (function () {
          var s = "<rect width='640' height='240' fill='#F5F7FB'/>" + perso(120, 70, "#5A3A1E", "#DCE6F2", "#1E499B") + perso(520, 70, "#6B4423", "#F7C948", "#2E3445") + "<path d='M150 110H480' stroke='" + NUIT + "' stroke-width='3' marker-end='url(#feF)'/><rect x='250' y='88' width='140' height='34' rx='10' fill='#fff' stroke='#C9D2E3'/>" + txt(320, 110, "énoncé", { s: 13 });
          s += bloc(30, 186, 130, 40, BLEU, "Qui ? je") + bloc(176, 186, 130, 40, "#7B3F99", "À qui ? tu") + bloc(322, 186, 130, 40, VERT, "Où ? ici") + bloc(468, 186, 140, 40, "#C2540A", "Quand ? demain");
          return svg(640, 240, "Un énonciateur adresse un énoncé à un destinataire ; quatre étiquettes : qui, à qui, où, quand", fleche("feF", NUIT), s);
        })() }],
        fil: { html: "<p>« Je », « t' », « ici », « demain » renvoient à une personne, un lieu et un moment que seuls connaissent l'auteur et le destinataire. Sans la situation, on ne peut pas les remplir. Ils ont un sens, mais un sens qui dépend de la situation.</p>", verdicts: [[1, "rejetee", "Ils ont un sens, qui dépend de la situation d'énonciation."]] },
        retenir: "Qui parle, à qui, où, quand." },
      { t: "Les marques explicites", html: partie(FE_OLD, 1),
        planches: [{ type: "3d", titre: "« Ici », c'est où ?", legende: "Tourne la cour du lycée : le bâtiment des classes, le mât et le drapeau, le banc, le panneau d'affichage. « Ici » peut désigner n'importe lequel de ces endroits : seul l'auteur du billet le sait.",
          modele: { h: 340, rx: -26, ry: 22, echelle: 0.85, alt: "Cour de lycée avec un bâtiment, un mât au drapeau camerounais, un banc et un panneau d affichage", objets: cour3D(),
            etiquettes: [{ p: [164, 144, 40], t: "le mât ?", cote: "d" }, { p: [-120, 12, 60], t: "le banc ?" }, { p: [-160, 60, 100], t: "le panneau ?" }] } }],
        fil: { html: "<p>Grâce suppose que « ici » est la bibliothèque parce qu'elle y a trouvé le billet ; mais le billet a pu être écrit ailleurs, et « demain » dépend du jour où il a été écrit, pas du jour où on le lit.</p>", verdicts: [[0, "rejetee", "« Ici » et « demain » renvoient au lieu et au moment de l'écriture, inconnus."]] },
        retenir: "Pronoms je / tu, déictiques (ici, demain), temps de l'énonciation, modalisateurs (sans doute), ponctuation expressive." },
      { t: "Énoncé ancré, énoncé coupé", html: partie(FE_OLD, 2),
        fil: { html: "<p>Le second texte est un <strong>énoncé coupé</strong> : 3ᵉ personne (Atangana), plus-que-parfait, repères absolus (« la veille de la kermesse », « dans la cour du lycée »). On le comprend sans connaître la situation de celui qui raconte.</p>", verdicts: [[2, "validee", "Déictiques liés à la situation ; repères absolus dans le récit."]] },
        retenir: "Ancré : je, tu, ici, demain ; coupé : il, passé simple, la veille, le lendemain." },
      FE_OLD && FE_OLD.parties[3] ? FE_OLD.parties[3] : { t: "Entraînement", html: "" }
    ],
    denouement: {
      titre: "Le billet décodé",
      etapes: ["Je, tu, ici, demain : situation d'énonciation inconnue (indice 1).", "Marques : pronoms, déictiques, modalisateur, ponctuation (indice 2).", "Énoncé coupé : repères absolus (indice 3)."],
      reponse: "<p>Le billet est un énoncé ancré dans sa situation d'énonciation : « je » (l'auteur) et « t' » (le destinataire) sont des pronoms de 1ʳᵉ et 2ᵉ personne ; « ici » et « demain » sont des déictiques de lieu et de temps ; « sans doute » est un modalisateur qui exprime une incertitude ; le point d'exclamation est une ponctuation expressive. Toutes ces marques ne prennent leur sens que si l'on sait qui a écrit, à qui, où et quand : faute de cela, Grâce ne peut pas affirmer que « ici » est la bibliothèque ni que « demain » est mercredi. Le second texte est un énoncé coupé, à la 3ᵉ personne et au passé, avec des repères absolus : il se comprend seul. Réécrit ainsi, le billet devient : « Il lui avait donné rendez-vous dans la cour du lycée le lendemain, probablement à huit heures, en lui demandant de ne pas être en retard. »</p>",
      transfert: "<p>Écris un message ancré de trois lignes à un camarade (avec quatre marques de l'énonciation), puis réécris-le en énoncé coupé.</p>"
    },
    revision: (FE_OLD ? FE_OLD.revision : []).concat(["Un déictique se comprend seulement avec la situation d'énonciation."]),
    exo: FE_OLD ? FE_OLD.exo : "",
    quiz: FE_OLD ? FE_OLD.quiz : []
  });

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  VRT_A("2nde-c-maths-reels", 1, "Le testeur de décimaux : entre une fraction", function (el) {
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:8px 18px;align-items:end'><label class='labo-c'><span>Numérateur p</span><input type='number' value='5' data-p style='width:90px;font:inherit;padding:6px'></label><label class='labo-c'><span>Dénominateur q</span><input type='number' value='6' min='1' data-q style='width:90px;font:inherit;padding:6px'></label></div><div style='display:flex;flex-wrap:wrap;gap:6px;margin-top:8px'>" + [[5, 8], [5, 6], [7, 20], [6, 15], [1, 3], [3, 40], [11, 12]].map(function (f) { return "<button type='button' class='btn-l' data-f='" + f[0] + "/" + f[1] + "'>" + f[0] + "/" + f[1] + "</button>"; }).join("") + "</div><p class='labo-r' data-r></p>";
    var P = el.querySelector("[data-p]"), Q = el.querySelector("[data-q]");
    function facteurs(n) { var f = [], d = 2; while (n > 1) { while (n % d === 0) { f.push(d); n /= d; } d++; } return f; }
    function developpe(p, q) { var ent = Math.floor(Math.abs(p) / q), r = Math.abs(p) % q, vus = {}, ch = "", i = 0; while (r && !(r in vus) && i < 40) { vus[r] = i++; r *= 10; ch += Math.floor(r / q); r %= q; } if (!r) return (p < 0 ? "−" : "") + ent + (ch ? "," + ch : ""); var k = vus[r]; return (p < 0 ? "−" : "") + ent + "," + ch.slice(0, k) + "<span style='text-decoration:overline'>" + ch.slice(k) + "</span>…"; }
    function maj() {
      var p = parseInt(P.value, 10), q = parseInt(Q.value, 10);
      if (!q || isNaN(p)) { el.querySelector("[data-r]").textContent = "Entre deux entiers, q non nul."; return; }
      var g = pgcd(p, q), pp = p / g, qq = q / g, F = facteurs(qq), ok = F.every(function (x) { return x === 2 || x === 5; });
      el.querySelector("[data-r]").innerHTML = p + "/" + q + (g > 1 ? " = <b>" + pp + "/" + qq + "</b> (irréductible)" : " est irréductible") + " · " + qq + " = " + (F.length ? F.join(" × ") : "1") + " · " + (ok ? "<b style='color:" + VERT + "'>seulement 2 et 5 : décimal</b>" : "<b style='color:" + ROUGE + "'>facteur " + F.filter(function (x) { return x !== 2 && x !== 5; })[0] + " : non décimal</b>") + " · écriture : <b>" + developpe(pp, qq) + "</b> · plus petit ensemble : <b>" + (qq === 1 ? (pp >= 0 ? "ℕ" : "ℤ") : ok ? "𝔻" : "ℚ") + "</b>";
    }
    P.addEventListener("input", maj); Q.addEventListener("input", maj);
    el.querySelectorAll("[data-f]").forEach(function (b) { b.addEventListener("click", function () { var f = b.dataset.f.split("/"); P.value = f[0]; Q.value = f[1]; maj(); }); });
    maj();
  });
  VRT_A("2nde-c-francais-theatre", 1, "Tirade, stichomythie, monologue ou aparté ?", function (el) {
    exercice(el, [["Un valet, seul sur scène, se plaint longuement de son maître : ___", ["monologue", "aparté", "tirade"], "Seul sur scène : monologue."], ["Deux personnages échangent dix répliques d'un ou deux mots dans une dispute : ___", ["stichomythie", "tirade", "monologue"], "Répliques courtes et rapides."], ["Le prétendant glisse au public « Pas un franc… » devant le père : ___", ["aparté", "monologue", "stichomythie"], "Le public entend, pas le père."], ["Le chef du village parle sans interruption pendant une page devant tous : ___", ["tirade", "monologue", "aparté"], "Longue réplique devant d'autres personnages."], ["« LA FILLE, en colère » : les mots en italique sont… ___", ["une didascalie", "une réplique", "un aparté"], "Indication de jeu, non prononcée."]], "Cas suivant", "Cas");
  });
  VRT_A("2nde-c-ecm-production", 2, "Primaire, secondaire ou tertiaire ?", function (el) {
    exercice(el, [["Un pêcheur de Kribi : ___", ["primaire", "secondaire", "tertiaire"], "Exploitation directe de la nature."], ["Une chocolaterie à Ebolowa : ___", ["secondaire", "primaire", "tertiaire"], "Transformation de matières premières."], ["Une infirmière à l'hôpital de Garoua : ___", ["tertiaire", "primaire", "secondaire"], "Service de santé."], ["Un mineur d'or à Bétaré-Oya : ___", ["primaire", "secondaire", "tertiaire"], "Mines : primaire."], ["Une brasserie à Douala : ___", ["secondaire", "tertiaire", "primaire"], "Industrie."], ["Un chauffeur de car Douala–Yaoundé : ___", ["tertiaire", "secondaire", "primaire"], "Transport : service."], ["Un maçon sur un chantier : ___", ["secondaire", "tertiaire", "primaire"], "BTP : secondaire."], ["Une vendeuse de pagnes au marché : ___", ["tertiaire", "secondaire", "primaire"], "Commerce : service."]], "Activité suivante", "Activité");
  });
  VRT_A("2nde-a-francais-enonciation", 1, "Relève les marques de l'énonciation du billet", function (el) {
    exercice(el, MARQUES.map(function (m) { return ["Dans le billet, « " + m[0] + " » est… ___", [m[1]].concat(["pronom de 1ʳᵉ personne", "pronom de 2ᵉ personne", "déictique de lieu", "déictique de temps", "modalisateur", "ponctuation expressive"].filter(function (x) { return x !== m[1]; }).slice(0, 2)), "Réponse : " + m[1] + "."]; }), "Marque suivante", "Marque");
  });
})();
