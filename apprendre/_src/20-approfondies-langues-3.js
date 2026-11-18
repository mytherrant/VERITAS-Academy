/* Leçons APPROFONDIES — lot 12, classes d'examen (18/11/2026) : chinois de 1re (不但……而且, 如果……就) et arabe de Tle
   (أنواع الخبر, اللازم والمتعدي). Même gabarit et même mécanisme que 11-approfondies-lot4.js (remplacement EN PLACE ;
   ordre, clé, fiche APC, examen et scènes conservés). Textes arabes en SVG avec direction rtl. Simulations VRT_A en fin
   de fichier. */
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
  function txtAr(x, y, t, o) {
    o = o || {};
    return "<text x='" + x + "' y='" + y + "' direction='rtl' text-anchor='" + (o.a || "middle") + "' font-size='" + (o.s || 16) + "' font-weight='" + (o.w || 700) + "' fill='" + (o.c || NUIT) + "' font-family='Amiri,Noto Naskh Arabic,Scheherazade,Arial,sans-serif'>" + t + "</text>";
  }
  function bloc(x, y, w, h, c, l1, l2, l3) {
    return "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='" + h + "' rx='12' fill='" + c + "'/>" + txt(x + w / 2, y + h / 2 - (l2 ? 4 : -6), l1, { s: 20, c: "#fff" }) + (l2 ? txt(x + w / 2, y + h / 2 + 16, l2, { s: 11.5, c: "#fff", w: 500 }) : "") + (l3 ? txt(x + w / 2, y + h + 18, l3, { s: 11, c: GRIS, w: 600 }) : "");
  }

  /* ═══════════════════════ 1re CHINOIS — 不但……而且 / 第一……第二 ═══════════════════════ */
  var ZB_OLD = ancien("1re-zh-budan");
  function lanterne3D() {
    var o = [], k;
    o.push({ f: "boite", c: [0, -10, 0], d: [460, 8, 220], coul: "#7A1F1F", dessus: "#9E2A2A" });
    o.push({ f: "boite", c: [0, -2, 40], d: [240, 26, 90], coul: "#5D3A1E", dessus: "#7A5230", div: false });
    o.push({ f: "boite", c: [0, 24, 40], d: [60, 70, 40], coul: "#6B4423", dessus: "#8B5A2B", div: false });
    o.push({ f: "boite", c: [0, 60, 18], d: [52, 26, 2], coul: "#F2C94C", div: false });
    [-150, 150].forEach(function (x) {
      o.push({ f: "cylindre", c: [x, 140, -40], r: 2, h: 60, n: 6, coul: "#1F2328" });
      o.push({ f: "cylindre", c: [x, 128, -40], r: 16, h: 12, n: 18, coul: "#C9A227", dessus: "#E0BE4A" });
      o.push({ f: "sphere", c: [x, 92, -40], r: [40, 36, 40], n: 22, m: 12, coul: "#D7261E" });
      for (k = 0; k < 8; k++) { var a = k / 8 * 2 * Math.PI; o.push({ f: "sphere", c: [x + 40 * Math.cos(a), 92, -40 + 40 * Math.sin(a)], r: 1.6, coul: "#C9A227" }); }
      o.push({ f: "cylindre", c: [x, 50, -40], r: 16, h: 8, n: 18, coul: "#C9A227", dessus: "#E0BE4A" });
      for (k = 0; k < 6; k++) o.push({ f: "cylindre", c: [x + (k - 2.5) * 3, 14, -40], r: 1.2, h: 36, n: 4, coul: "#E0BE4A" });
    });
    o.forEach(function (x) { x.c[1] -= 50; });
    return o;
  }
  remplacer("1re-zh-budan", {
    c: "1re A", m: "chinois", titre: "不但……而且 et 第一……第二 : enchaîner ses idées", duree: 30,
    accroche: "« 他会说汉语。他会说英语。» Le discours de Marie pour le concours « Pont du chinois » sonne comme une liste. Deux structures vont le faire chanter.",
    intro: "La préparation d'un discours pour le concours « Pont du chinois » te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois façons d'écrire.",
    objectifs: ["employer 不但……而且…… (non seulement… mais aussi…)", "placer 不但 selon que le sujet change ou non", "ordonner ses idées avec 第一、第二、第三", "présenter sa famille en chinois avec ces structures"],
    enquete: {
      titre: "Le discours de Marie pour le « Pont du chinois »",
      svg: svg(640, 230, "Une élève répète un discours en chinois sur une estrade décorée de lanternes rouges", lin("zhF", ["#9E2A2A", "#6E1A1A"], true), "<rect width='640' height='230' fill='url(#zhF)'/><rect x='0' y='180' width='640' height='50' fill='#5D3A1E'/>" + [120, 520].map(function (x) { return "<path d='M" + x + " 0v26' stroke='#1F2328' stroke-width='2'/><rect x='" + (x - 12) + "' y='26' width='24' height='6' fill='#C9A227'/><ellipse cx='" + x + "' cy='58' rx='30' ry='26' fill='#D7261E'/><path d='M" + (x - 30) + " 58h60M" + (x - 26) + " 46h52M" + (x - 26) + " 70h52' stroke='#B01C14'/><rect x='" + (x - 12) + "' y='82' width='24' height='6' fill='#C9A227'/><path d='M" + x + " 88v22' stroke='#E0BE4A' stroke-width='3'/>"; }).join("") + perso(320, 90, "#5A3A1E", "#F2F2F2", "#1E499B") + "<rect x='290' y='150' width='60' height='40' fill='#6B4423'/>" + "<rect x='380' y='40' width='120' height='70' rx='8' fill='#FBF8F2' stroke='#C9A227'/>" + txt(440, 66, "汉语桥", { s: 22, c: "#B01C14" }) + txt(440, 92, "Hànyǔ Qiáo", { s: 11, c: GRIS, w: 500 })),
      legende: "À Yaoundé : Marie, élève de 1re A, prépare le concours « Pont du chinois » (汉语桥) avec son professeur de chinois.",
      contexte: "<p>Le discours de Marie présente sa famille : « 我哥哥会说汉语。我哥哥会说英语。我们要帮助爸爸妈妈。我们要尊重爸爸妈妈。» Le professeur sourit : « C'est juste, mais ce sont des phrases qui se suivent sans lien. » Son camarade conseille : « Ajoute simplement 也 partout. » Une autre : « Pour numéroter, écris 一、二, ça suffit. »</p>",
      documents: [{ t: "La grille du jury", html: "<table class='donnees'><tr><td>Prononciation et tons</td><td>/5</td></tr><tr><td>Richesse des structures (liaisons, ordinaux…)</td><td>/5</td></tr><tr><td>Organisation des idées</td><td>/5</td></tr><tr><td>Aisance</td><td>/5</td></tr></table>" }],
      question: "Comment relier et ordonner les idées du discours de Marie ?",
      tache: "Réécris le discours en quatre phrases avec 不但……而且…… et 第一、第二, en donnant le pinyin.",
      hypotheses: ["Il suffit d'ajouter 也 (aussi) dans chaque phrase.", "Pour numéroter, 一、二 suffisent, sans 第.", "不但 A，而且 B relie deux qualités ; 第一、第二 ordonnent les idées."]
    },
    parties: [
      { t: "不但……而且……", html: partie(ZB_OLD, 0) +
        "<div class='prop'><b>Où placer 不但 ?</b>Même sujet dans les deux parties : 不但 se place <strong>après</strong> le sujet (他不但会说汉语，而且会说英语). Sujets différents : 不但 se place <strong>avant</strong> le premier sujet (不但哥哥会说汉语，而且姐姐也会说).</div>",
        planches: [{ type: "2D", titre: "La structure 不但 A，而且 B", legende: "Le sujet, puis 不但 et la première qualité, puis 而且 et la seconde : « Mon grand frère parle non seulement chinois, mais aussi anglais. »", svg: (function () {
          var s = "<rect width='640' height='200' fill='#FBF5EC'/>";
          s += bloc(14, 50, 108, 70, "#5C6478", "我哥哥", "wǒ gēge", "sujet") + bloc(130, 50, 90, 70, "#B01C14", "不但", "bùdàn", "non seulement") + bloc(228, 50, 140, 70, "#1E499B", "会说汉语", "huì shuō Hànyǔ", "qualité A") + bloc(376, 50, 90, 70, "#C9A227", "而且", "érqiě", "mais aussi") + bloc(474, 50, 152, 70, "#2E7D32", "会说英语", "huì shuō Yīngyǔ", "qualité B");
          s += txt(320, 30, "我哥哥不但会说汉语，而且会说英语。", { s: 18 });
          return svg(640, 200, "Cinq blocs colorés : sujet, bùdàn, qualité A, érqiě, qualité B", "", s);
        })() }],
        fil: { html: "<p>Avec 也 seul (我哥哥会说汉语，也会说英语), la phrase est juste mais plate. 不但……而且…… montre que la seconde qualité <strong>s'ajoute</strong> à la première : c'est ce que le jury appelle la richesse des structures.</p>", verdicts: [[0, "rejetee", "也 ajoute, mais 不但……而且…… met en valeur la seconde idée."]] },
        retenir: "不但 A，而且 B ; 不但 après le sujet s'il est le même." },
      { t: "第一……第二……", html: partie(ZB_OLD, 1),
        planches: [{ type: "3d", titre: "L'estrade du concours « Pont du chinois »", legende: "Tourne l'estrade : le pupitre doré, deux lanternes rouges à franges. Un discours bien ordonné (第一、第二、第三) se suit facilement, même par un jury qui écoute vingt candidats.",
          modele: { h: 340, rx: -12, ry: 22, echelle: 0.95, alt: "Estrade rouge avec un pupitre en bois et deux lanternes chinoises rouges et dorées", objets: lanterne3D(),
            etiquettes: [{ p: [-150, 82, -40], t: "灯笼 dēnglong (lanterne)" }, { p: [0, 24, 18], t: "讲台 jiǎngtái (pupitre)", cote: "d" }] } }],
        fil: { html: "<p>« 一、二 » ne sont que des nombres ; pour dire « premièrement, deuxièmement », il faut le préfixe des ordinaux : <strong>第一、第二</strong>. Sans 第, le jury entend « un, deux », pas un plan.</p>", verdicts: [[1, "rejetee", "Les ordinaux exigent 第 : 第一 (premièrement), 第二 (deuxièmement)."]] },
        retenir: "第 + nombre = ordinal : 第一、第二、第三." },
      { t: "Vocabulaire de la famille", html: partie(ZB_OLD, 2),
        planches: [{ type: "2D", titre: "我的家 Wǒ de jiā", legende: "La famille de Marie avec les mots chinois et leur pinyin.", svg: (function () {
          var F = [["爸爸", "bàba", 160, 70, "#6B4423", "#1E499B", "#1B1410", "homme"], ["妈妈", "māma", 480, 70, "#5A3A1E", "#C2540A", "#1B1410", "femme"], ["哥哥", "gēge", 110, 210, "#6B4423", "#2E7D32", "#1B1410", "homme"], ["姐姐", "jiějie", 270, 210, "#5A3A1E", "#7B3F99", "#1B1410", "femme"], ["我", "wǒ (Marie)", 430, 210, "#5A3A1E", "#F7C948", "#1B1410", "femme"]], s = "<rect width='640' height='300' fill='#FBF7EE'/><path d='M160 70H480M320 70V140M110 140H430M110 140V180M270 140V180M430 140V180' stroke='#8A6E4B' stroke-width='3' fill='none'/>";
          F.forEach(function (f) { s += portrait(f[2], f[3], f[4], f[5], f[6], f[7]) + txt(f[2], f[3] + 52, f[0], { s: 18, c: "#B01C14", halo: true }) + txt(f[2], f[3] + 70, f[1], { s: 11.5, w: 500, c: GRIS, halo: true }); });
          s += txt(560, 210, "家 jiā", { s: 22, c: "#B01C14" }) + txt(560, 232, "famille, maison", { s: 11, c: GRIS });
          return svg(640, 300, "Arbre de famille avec les mots chinois baba, mama, gege, jiejie et wo", "", s);
        })() }],
        fil: { html: "<p>Avec ce vocabulaire et les deux structures, le discours devient : « 第一，我哥哥不但会说汉语，而且会说英语。第二，我们不但要帮助爸爸妈妈，而且要尊重他们。»</p>", verdicts: [[2, "validee", "不但……而且…… pour relier, 第一、第二 pour ordonner."]] },
        retenir: "家 jiā, 爸爸, 妈妈, 哥哥, 姐姐, 帮助 bāngzhù, 尊重 zūnzhòng." }
    ],
    denouement: {
      titre: "Le discours réécrit",
      etapes: ["不但……而且…… relie deux qualités (indice 1).", "第一、第二 ordonnent les idées (indice 2).", "Vocabulaire de la famille et pinyin (indice 3)."],
      reponse: "<p>Discours réécrit : « 第一，我哥哥不但会说汉语，而且会说英语。(Dì yī, wǒ gēge bùdàn huì shuō Hànyǔ, érqiě huì shuō Yīngyǔ.) 第二，我们不但要帮助爸爸妈妈，而且要尊重他们。(Dì èr, wǒmen bùdàn yào bāngzhù bàba māma, érqiě yào zūnzhòng tāmen.) » La structure 不但 A，而且 B (« non seulement A, mais aussi B ») relie et met en valeur deux idées, mieux qu'une simple répétition avec 也 ; comme le sujet est le même, 不但 se place après lui. Le préfixe 第 transforme les nombres en ordinaux : 第一 (premièrement), 第二 (deuxièmement). Le jury entend ainsi un discours lié et organisé.</p>",
      transfert: "<p>Écris trois phrases sur ton école avec 第一、第二、第三, dont une avec 不但……而且……, et donne le pinyin.</p>"
    },
    revision: (ZB_OLD ? ZB_OLD.revision : []).concat(["Même sujet : 他不但…，而且… ; sujets différents : 不但他…，而且她也…"]),
    exo: ZB_OLD ? ZB_OLD.exo : "",
    quiz: [
      q("不但……而且…… signifie…", "non seulement… mais aussi…", "si… alors…", "certains… d'autres…", "bùdàn… érqiě…"),
      q("« Deuxièmement » se dit…", "第二", "二", "二第", "第 + nombre."),
      q("帮助 (bāngzhù) signifie…", "aider", "respecter", "parler", "Vocabulaire de la famille."),
      q("尊重 (zūnzhòng) signifie…", "respecter", "aider", "aimer", "尊重父母 : respecter ses parents."),
      q("哥哥 désigne…", "le grand frère", "la grande sœur", "le père", "gēge."),
      q("他不但会说汉语，___ 会说英语。", "而且", "第一", "如果", "Seconde partie de la structure."),
      q("Le pinyin de 第一 est…", "dì yī", "dì èr", "yī dì", "Premièrement."),
      q("家 (jiā) signifie…", "famille, maison", "école", "pays", "我的家 : ma famille."),
      q("Quand le sujet est le même, 不但 se place…", "après le sujet", "avant le sujet", "à la fin de la phrase", "他不但…"),
      q("姐姐 désigne…", "la grande sœur", "la mère", "le grand frère", "jiějie.")
    ]
  });

  /* ═══════════════════════ 1re CHINOIS — 如果……就…… ═══════════════════════ */
  var ZR_OLD = ancien("1re-zh-ruguo");
  function bus3D() {
    var o = [], k, R = alea(9);
    o.push({ f: "boite", c: [0, -10, 0], d: [520, 8, 260], coul: "#5C6478", dessus: "#6E7684" });
    o.push({ f: "boite", c: [0, -4, 0], d: [520, 1, 30], coul: "#E8E8E8", div: false });
    o.push({ f: "boite", c: [0, 52, -60], d: [260, 80, 90], coul: "#F2C94C", dessus: "#F7F7F7", div: false });
    for (k = 0; k < 5; k++) o.push({ f: "boite", c: [-100 + k * 46, 60, -106], d: [36, 28, 2], coul: "#9FC5E8", div: false });
    o.push({ f: "boite", c: [118, 30, -106], d: [20, 50, 2], coul: "#5C6478", div: false });
    [[-90, -106], [90, -106], [-90, -14], [90, -14]].forEach(function (p) { o.push({ f: "cylindre", c: [p[0], 14, p[1]], r: 16, h: 6, n: 18, axe: "z", coul: "#1F2328" }); });
    o.push({ f: "sphere", c: [-40, 200, -40], r: [70, 30, 50], n: 18, m: 10, coul: "#8E96A6" });
    o.push({ f: "sphere", c: [40, 210, -60], r: [60, 28, 44], n: 18, m: 10, coul: "#7A8392" });
    for (k = 0; k < 40; k++) o.push({ f: "cylindre", c: [-110 + R() * 220, 30 + R() * 150, -120 + R() * 140], r: 1, h: 10, n: 4, coul: "#5BA3D9" });
    o.forEach(function (x) { x.c[1] -= 70; });
    return o;
  }
  remplacer("1re-zh-ruguo", {
    c: "1re A", m: "chinois", titre: "如果……那么/就…… : exprimer la condition", duree: 30,
    accroche: "« 我们就如果下雨不去。» Le message de Junior sur la sortie à Kribi est incompréhensible : il faut remettre 如果 et 就 à leur place.",
    intro: "L'organisation d'une sortie de classe te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois façons de construire la phrase.",
    objectifs: ["construire une phrase conditionnelle avec 如果……（那么）……就……", "placer 就 après le sujet de la conséquence", "donner un conseil avec 如果……就……", "employer 有的……有的…… pour présenter des groupes"],
    enquete: {
      titre: "La sortie du club de chinois à Kribi",
      svg: svg(640, 220, "Un car jaune sous un nuage de pluie et un message en chinois mal construit", lin("zrC", ["#C9D6E3", "#EAF1F7"], true), "<rect width='640' height='220' fill='url(#zrC)'/><rect y='176' width='640' height='44' fill='#6E7684'/><ellipse cx='200' cy='50' rx='90' ry='30' fill='#8E96A6'/><ellipse cx='260' cy='60' rx='70' ry='26' fill='#7A8392'/>" + Array.apply(null, Array(24)).map(function (_, k) { var x = 130 + (k * 37) % 200, y = 90 + (k * 23) % 60; return "<path d='M" + x + " " + y + "l-4 12' stroke='#5BA3D9' stroke-width='2'/>"; }).join("") + "<rect x='120' y='120' width='220' height='56' rx='8' fill='#F2C94C'/>" + [0, 1, 2, 3].map(function (k) { return "<rect x='" + (134 + k * 48) + "' y='128' width='36' height='22' rx='3' fill='#9FC5E8'/>"; }).join("") + "<circle cx='160' cy='178' r='12' fill='#1F2328'/><circle cx='300' cy='178' r='12' fill='#1F2328'/><rect x='380' y='40' width='230' height='110' rx='10' fill='#fff' stroke='#C9D2E3'/>" + txt(395, 64, "Junior :", { s: 12, a: "start", c: BLEU }) + txt(395, 92, "我们就如果下雨不去。", { s: 17, a: "start" }) + txt(395, 118, "如果下雨了 ? 去 ?", { s: 15, a: "start", c: GRIS }) + "<path d='M396 98h200' stroke='" + ROUGE + "' stroke-width='2'/>"),
      legende: "À Yaoundé : le club de chinois du lycée prépare une sortie à Kribi ; la météo annonce de la pluie.",
      contexte: "<p>Junior écrit dans le groupe du club : « 我们就如果下雨不去。» Personne ne comprend s'ils partent ou non. Sa camarade propose : « Mets 如果 à la fin, comme le “if” anglais qu'on peut placer après. » Un autre : « 就 doit toujours venir en premier. » Le professeur demande aussi un conseil pour ceux qui ont des questions sur le voyage.</p>",
      documents: [{ t: "Le modèle du manuel", html: "<p>如果 + condition，(那么) + sujet + 就 + conséquence.<br><em>Rúguǒ míngtiān xià yǔ, wǒmen jiù bú qù.</em> S'il pleut demain, nous n'irons pas.</p>" }],
      question: "Comment écrire correctement le message de Junior et le conseil du professeur ?",
      tache: "Réécris le message, puis donne deux conseils avec 如果……就……, avec le pinyin.",
      hypotheses: ["如果 peut se placer à la fin de la phrase, comme « if » en anglais.", "就 se place en tête de phrase, avant le sujet.", "如果 ouvre la condition ; 就 se place après le sujet de la conséquence."]
    },
    parties: [
      { t: "La structure", html: partie(ZR_OLD, 0),
        planches: [{ type: "2D", titre: "如果 + condition，sujet + 就 + conséquence", legende: "La condition vient d'abord, introduite par 如果 ; dans la conséquence, 就 se place après le sujet 我们 et avant le verbe.", svg: (function () {
          var s = "<rect width='640' height='200' fill='#FBF5EC'/>";
          s += bloc(14, 50, 90, 70, "#B01C14", "如果", "rúguǒ", "si") + bloc(112, 50, 170, 70, "#1E499B", "明天下雨", "míngtiān xià yǔ", "condition") + bloc(290, 50, 100, 70, "#5C6478", "我们", "wǒmen", "sujet") + bloc(398, 50, 80, 70, "#C9A227", "就", "jiù", "alors") + bloc(486, 50, 140, 70, "#2E7D32", "不去", "bú qù", "conséquence");
          s += txt(320, 30, "如果明天下雨，我们就不去。", { s: 18 });
          return svg(640, 200, "Cinq blocs : rúguǒ, condition, sujet, jiù, conséquence", "", s);
        })() }],
        fil: { html: "<p>En chinois, la condition se place <strong>avant</strong> la conséquence : 如果 ne peut pas finir la phrase comme le « if » anglais. « 我们就如果下雨不去 » mélange les deux parties.</p>", verdicts: [[0, "rejetee", "La condition introduite par 如果 vient en premier."]] },
        retenir: "如果 + condition，(那么) + sujet + 就 + conséquence." },
      { t: "Donner un conseil", html: partie(ZR_OLD, 1),
        planches: [{ type: "3d", titre: "S'il pleut, le car ne part pas", legende: "Tourne la scène : le car jaune du club attend sous le nuage. 如果明天下雨，我们就不去 ; 如果不下雨，我们就去克里比 (Kèlǐbǐ, Kribi).",
          modele: { h: 360, rx: -16, ry: 20, echelle: 0.8, alt: "Car scolaire jaune sur une route sous un nuage de pluie", objets: bus3D(),
            etiquettes: [{ p: [-40, 160, -40], t: "下雨 xià yǔ (il pleut)" }, { p: [118, -20, -106], t: "汽车 qìchē (le car)", cote: "d" }] } }],
        fil: { html: "<p>Quand la conséquence n'a pas de sujet exprimé, 就 vient juste après la virgule : « 如果你有问题，<strong>就</strong>问老师。» Quand elle a un sujet, 就 se place après lui : « 我们<strong>就</strong>不去 ». Jamais avant le sujet.</p>", verdicts: [[1, "rejetee", "就 se place après le sujet de la conséquence, pas en tête."]] },
        retenir: "Conseil : 如果你……，就……" },
      { t: "Les nombres et 有的……有的……", html: partie(ZR_OLD, 2),
        fil: { html: "<p>Message final : « 如果明天下雨，我们就不去。如果不下雨，我们就去克里比。有的同学坐汽车，有的同学坐火车。» (certains camarades prennent le car, d'autres le train).</p>", verdicts: [[2, "validee", "如果 + condition，sujet + 就 + conséquence."]] },
        retenir: "有的……有的…… = certains… d'autres…" }
    ],
    denouement: {
      titre: "Le message corrigé",
      etapes: ["如果 + condition en premier (indice 1).", "就 après le sujet de la conséquence (indice 2).", "有的……有的…… pour les groupes (indice 3)."],
      reponse: "<p>Message corrigé : « 如果明天下雨，我们就不去。(Rúguǒ míngtiān xià yǔ, wǒmen jiù bú qù.) 如果你有问题，就问老师。(Rúguǒ nǐ yǒu wèntí, jiù wèn lǎoshī.) » En chinois, la condition introduite par 如果 vient toujours avant la conséquence ; on ne peut pas la rejeter à la fin comme le « if » anglais. Dans la conséquence, 就 se place après le sujet (我们就不去) ou, s'il n'y a pas de sujet, juste au début de la conséquence (就问老师), jamais devant le sujet. 那么 est facultatif. Pour dire que certains prennent le car et d'autres le train : 有的同学坐汽车，有的同学坐火车。</p>",
      transfert: "<p>Donne trois conseils à un camarade qui prépare le Probatoire, avec 如果……就……, et écris le pinyin.</p>"
    },
    revision: (ZR_OLD ? ZR_OLD.revision : []).concat(["La condition vient toujours avant la conséquence."]),
    exo: ZR_OLD ? ZR_OLD.exo : "",
    quiz: [
      q("如果 signifie…", "si", "mais", "donc seulement", "rúguǒ."),
      q("Où se place 就 ?", "après le sujet de la conséquence", "en tête de phrase", "à la fin de la phrase", "我们就不去."),
      q("有的……有的…… veut dire…", "certains… d'autres…", "non seulement… mais aussi…", "si… alors…", "有的同学…，有的同学…"),
      q("如果明天下雨，我们就不去 signifie…", "S'il pleut demain, nous n'irons pas.", "Il pleut, donc nous partons.", "Nous irons même s'il pleut.", "Phrase du manuel."),
      q("下雨 (xià yǔ) signifie…", "pleuvoir", "neiger", "partir", "下 + 雨."),
      q("Quelle phrase est correcte ?", "如果你有问题，就问老师。", "就你有问题，如果问老师。", "你有问题就如果问老师。", "Condition puis 就."),
      q("那么 dans la structure est…", "facultatif", "obligatoire", "interdit", "如果……(那么)……就……"),
      q("问 (wèn) signifie…", "demander", "répondre", "aller", "问老师 : demander au professeur."),
      q("老师 (lǎoshī) signifie…", "professeur", "élève", "parent", "Vocabulaire scolaire."),
      q("明天 (míngtiān) signifie…", "demain", "aujourd'hui", "hier", "Repère de temps.")
    ]
  });

  /* ═══════════════════════ Tle ARABE — أنواع الخبر ═══════════════════════ */
  var AK_OLD = ancien("tle-ar-khabar");
  function classe3D() {
    var o = [];
    o.push({ f: "boite", c: [0, -10, 0], d: [520, 8, 300], coul: "#9C6B3C", dessus: "#C0894F" });
    o.push({ f: "boite", c: [0, 0, 140], d: [520, 180, 6], coul: "#E9E2D2", div: false });
    o.push({ f: "boite", c: [0, 60, 134], d: [260, 90, 4], coul: "#23402F", div: false });
    o.push({ f: "boite", c: [0, 56, 132], d: [270, 6, 6], coul: "#8B5A2B", div: false });
    o.push({ f: "boite", c: [-60, 0, 20], d: [140, 50, 70], coul: "#6B4423", dessus: "#8B5A2B", div: false });
    o.push({ f: "boite", c: [-80, 50, 20], d: [44, 8, 32], coul: "#C62828", dessus: "#E8492E", div: false });
    o.push({ f: "boite", c: [-30, 50, 26], d: [10, 3, 30], coul: "#1E499B", div: false });
    o.push({ f: "boite", c: [110, 0, 30], d: [40, 46, 40], coul: "#5D3A1E", div: false });
    o.push({ f: "cylindre", c: [110, 46, 30], r: 9, h: 50, n: 14, coul: "#1E499B" });
    o.push({ f: "sphere", c: [110, 108, 30], r: 13, coul: "#6B4423" });
    o.push({ f: "boite", c: [150, 0, 100], d: [40, 70, 30], coul: "#1F2328", div: false });
    o.push({ f: "cylindre", c: [150, 70, 100], r: 9, h: 52, n: 14, coul: "#FFFFFF" });
    o.push({ f: "sphere", c: [150, 134, 100], r: 13, coul: "#5A3A1E" });
    return o;
  }
  var KHABAR = [["الجوُّ جميلٌ", "مفرد", "un seul mot"], ["البيتُ كبيرٌ", "مفرد", "un seul mot"], ["الأمُّ تطبخُ", "جملة فعلية", "phrase verbale"], ["الطالبُ يقرأُ الدرسَ", "جملة فعلية", "phrase verbale"], ["الطالبُ أبوه طبيبٌ", "جملة اسمية", "phrase nominale"], ["الكتابُ على الطاولةِ", "شبه جملة", "préposition + nom"], ["القلمُ في الحقيبةِ", "شبه جملة", "préposition + nom"], ["المعلّمُ أمامَ السبّورةِ", "شبه جملة", "adverbe de lieu + nom"]];
  remplacer("tle-ar-khabar", {
    c: "Tle A", m: "arabe", titre: "Les types d'attribut (أنواع الخبر)", duree: 30,
    accroche: "« الكتابُ على الطاولةِ » : Aminatou décrit sa salle de classe pour le club d'arabe. Où est le خبر, et de quel type est-il ?",
    intro: "La description d'une salle de classe en arabe te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois analyses.",
    objectifs: ["identifier le مبتدأ et le خبر d'une phrase nominale", "distinguer خبر مفرد, خبر جملة et خبر شبه جملة", "repérer le pronom de rappel (الرابط) dans un خبر جملة", "analyser des phrases décrivant un lieu"],
    enquete: {
      titre: "La salle de classe d'Aminatou à Maroua",
      svg: (function () {
        var s = "<rect width='640' height='230' fill='#EFE6D6'/><rect x='30' y='20' width='300' height='190' rx='6' fill='#fff' stroke='#C9C1B2'/>";
        ["الجوُّ جميلٌ.", "الكتابُ على الطاولةِ.", "المعلّمُ أمامَ السبّورةِ.", "الطالبُ أبوه طبيبٌ.", "الأمُّ تطبخُ."].forEach(function (l, i) { s += txtAr(310, 56 + i * 34, l, { s: 18, a: "start" }); });
        s += "<rect x='370' y='40' width='240' height='130' rx='6' fill='#23402F' stroke='#8B5A2B' stroke-width='6'/>" + txtAr(490, 96, "المبتدأ + الخبر", { s: 22, c: "#F4EFE4" }) + txt(490, 140, "phrase nominale", { s: 13, c: "#DCE6F2", w: 500 });
        return svg(640, 230, "Un cahier avec cinq phrases nominales en arabe et un tableau noir portant mubtada et khabar", "", s);
      })(),
      legende: "À Maroua : Aminatou, élève de Terminale A, prépare pour le club d'arabe la description de sa salle de classe.",
      contexte: "<p>Aminatou a écrit cinq phrases nominales. Pour l'exposé, elle doit dire de quel type est chaque خبر. Son camarade affirme : « Dans الكتابُ على الطاولةِ, il n'y a pas de خبر : il n'y a pas d'adjectif ! » Une autre : « Dans الطالبُ أبوه طبيبٌ, le خبر est seulement طبيبٌ. »</p>",
      documents: [{ t: "Rappel : la phrase nominale (الجملة الاسمية)", html: "<p>Elle commence par un nom, le مبتدأ (sujet), suivi du خبر (attribut), qui complète le sens. Tous deux sont <strong>مرفوع</strong> quand le خبر est un seul mot.</p>" }],
      question: "Quel est le type du خبر dans chacune des cinq phrases d'Aminatou ?",
      tache: "Classe les cinq phrases dans un tableau (مفرد / جملة / شبه جملة) et justifie chaque classement.",
      hypotheses: ["Le خبر est toujours un adjectif ; sans adjectif, il n'y a pas de خبر.", "Dans الطالبُ أبوه طبيبٌ, le خبر est seulement طبيبٌ.", "Le خبر peut être un mot, une phrase (avec pronom de rappel) ou un شبه جملة (préposition ou adverbe + nom)."]
    },
    parties: [
      { t: "La phrase nominale", html: partie(AK_OLD, 0),
        planches: [{ type: "2D", titre: "مبتدأ + خبر", legende: "On lit de droite à gauche : le مبتدأ (bleu) puis le خبر (vert), tous deux au cas sujet (مرفوع), marqués par la ḍamma.", svg: (function () {
          var s = "<rect width='640' height='190' fill='#F5F7FB'/><rect x='340' y='40' width='260' height='80' rx='14' fill='" + BLEU + "'/><rect x='40' y='40' width='260' height='80' rx='14' fill='" + VERT + "'/>";
          s += txtAr(470, 92, "الطالبُ", { s: 32, c: "#fff" }) + txtAr(170, 92, "مجتهدٌ", { s: 32, c: "#fff" }) + txtAr(470, 150, "المبتدأ (مرفوع)", { s: 16, c: BLEU }) + txtAr(170, 150, "الخبر (مرفوع)", { s: 16, c: VERT });
          s += "<path d='M330 80H310' stroke='" + NUIT + "' stroke-width='3' marker-end='url(#akF)'/>" + txt(320, 180, "« L'élève est travailleur. » — lecture de droite à gauche", { s: 11.5, c: GRIS });
          return svg(640, 190, "Deux blocs : le sujet al-talibu à droite, l attribut mujtahidun à gauche", fleche("akF", NUIT), s);
        })() }],
        retenir: "Phrase nominale = مبتدأ + خبر, au cas مرفوع." },
      { t: "Les trois types de خبر", html: partie(AK_OLD, 1),
        planches: [{ type: "3d", titre: "Décrire la salle de classe", legende: "Tourne la salle : le livre rouge sur la table (الكتابُ على الطاولةِ), le maître devant le tableau (المعلّمُ أمامَ السبّورةِ), l'élève assis qui lit (الطالبُ يقرأُ). Chaque position se dit avec un خبر شبه جملة ; chaque action, avec un خبر جملة.",
          modele: { h: 340, rx: -18, ry: 24, echelle: 0.9, alt: "Salle de classe avec un tableau noir, une table portant un livre rouge, un élève assis et un maître debout", objets: classe3D(),
            etiquettes: [{ p: [-80, 58, 20], t: "الكتابُ على الطاولةِ" }, { p: [150, 150, 100], t: "المعلّمُ أمامَ السبّورةِ", cote: "d" }, { p: [110, 124, 30], t: "الطالبُ يقرأُ", cote: "d" }] } }],
        fil: { html: "<p>Dans الكتابُ على الطاولةِ, le خبر est <strong>على الطاولةِ</strong> : une préposition et un nom, c'est un <strong>شبه جملة</strong>. Un خبر n'est donc pas forcément un adjectif.</p>", verdicts: [[0, "rejetee", "على الطاولةِ est un خبر شبه جملة."]] },
        retenir: "مفرد : un mot ; جملة : phrase verbale ou nominale ; شبه جملة : préposition ou adverbe + nom." },
      { t: "Le lien avec le sujet", html: partie(AK_OLD, 2),
        fil: { html: "<p>Dans الطالبُ أبوه طبيبٌ, le خبر est toute la phrase nominale <strong>أبوه طبيبٌ</strong> (son père est médecin) ; le pronom ـه, le <strong>رابط</strong>, la relie au مبتدأ. « طبيبٌ » seul ne dit rien de l'élève.</p>", verdicts: [[1, "rejetee", "Le خبر est la phrase أبوه طبيبٌ, reliée au sujet par le pronom ـه."], [2, "validee", "Trois types : مفرد، جملة، شبه جملة."]] },
        retenir: "خبر جملة : il contient un pronom de rappel (الرابط) qui renvoie au مبتدأ." }
    ],
    denouement: {
      titre: "Le tableau d'Aminatou",
      etapes: ["الجوُّ جميلٌ : خبر مفرد (indice 1).", "الكتابُ على الطاولةِ ، المعلّمُ أمامَ السبّورةِ : خبر شبه جملة (indice 2).", "الأمُّ تطبخُ : خبر جملة فعلية ; الطالبُ أبوه طبيبٌ : خبر جملة اسمية avec le رابط ـه (indice 3)."],
      reponse: "<p>Dans الجوُّ جميلٌ, le خبر est un seul mot, جميلٌ : c'est un خبر مفرد, au cas مرفوع. Dans الكتابُ على الطاولةِ et المعلّمُ أمامَ السبّورةِ, le خبر est une préposition ou un adverbe de lieu suivi d'un nom : c'est un خبر شبه جملة ; un خبر n'est donc pas toujours un adjectif. Dans الأمُّ تطبخُ, le خبر est une phrase verbale (تطبخُ) ; dans الطالبُ أبوه طبيبٌ, c'est une phrase nominale entière, أبوه طبيبٌ, reliée au مبتدأ par le pronom de rappel ـه : ce sont deux خبر جملة.</p>",
      transfert: "<p>Décris ta chambre en cinq phrases nominales en arabe, avec au moins un خبر de chaque type, et souligne le رابط s'il y en a un.</p>"
    },
    revision: (AK_OLD ? AK_OLD.revision : []).concat(["Un خبر n'est pas toujours un adjectif."]),
    exo: AK_OLD ? AK_OLD.exo : "",
    quiz: [
      q("Dans الجوُّ جميلٌ, le خبر est…", "مفرد", "جملة", "شبه جملة", "Un seul mot."),
      q("الكتابُ على الطاولةِ : quel type ?", "شبه جملة", "مفرد", "جملة فعلية", "Préposition + nom."),
      q("Le cas du مبتدأ est…", "مرفوع", "منصوب", "مجرور", "Marqué par la ḍamma."),
      q("الأمُّ تطبخُ : quel type de خبر ?", "جملة فعلية", "مفرد", "شبه جملة", "تطبخُ est un verbe."),
      q("الطالبُ أبوه طبيبٌ : quel type de خبر ?", "جملة اسمية", "مفرد", "شبه جملة", "أبوه طبيبٌ est une phrase nominale."),
      q("المعلّمُ أمامَ السبّورةِ : le خبر est…", "شبه جملة (ظرف + اسم)", "مفرد", "جملة فعلية", "أمامَ est un adverbe de lieu."),
      q("Dans الطالبُ أبوه طبيبٌ, le رابط est…", "le pronom ـه", "طبيبٌ", "الطالبُ", "Il renvoie au مبتدأ."),
      q("البيتُ كبيرٌ : le خبر est…", "مفرد", "جملة", "شبه جملة", "كبيرٌ."),
      q("القلمُ في الحقيبةِ : le خبر est…", "شبه جملة (جار ومجرور)", "مفرد", "جملة اسمية", "في + الحقيبةِ."),
      q("Une phrase nominale commence par…", "un nom (المبتدأ)", "un verbe", "une préposition", "الجملة الاسمية.")
    ]
  });

  /* ═══════════════════════ Tle ARABE — اللازم والمتعدي ═══════════════════════ */
  var AV_OLD = ancien("tle-ar-verbes");
  var VERBES = [["جلسَ الولدُ", "لازم", "pas de complément"], ["نامَ الطفلُ", "لازم", "pas de complément"], ["ذهبَ الطالبُ إلى المدرسةِ", "لازم", "complément avec préposition, pas de مفعول به"], ["ضحكَ الرجلُ", "لازم", "pas de complément"], ["كتبَ الطالبُ الدرسَ", "متعدٍّ", "الدرسَ est مفعول به منصوب"], ["قرأَ الطالبُ القصةَ", "متعدٍّ", "القصةَ est مفعول به"], ["فتحَ الولدُ البابَ", "متعدٍّ", "البابَ est مفعول به"], ["أعطى الأبُ الولدَ كتاباً", "متعدٍّ", "deux compléments : الولدَ et كتاباً"]];
  function chaise3D() {
    var o = [], ec = [0, -46, 0];
    o.push({ f: "boite", c: [0, -10, 0], d: [460, 8, 220], coul: "#9C6B3C", dessus: "#C0894F" });
    o.push({ f: "boite", c: [40, 0, 0], d: [60, 40, 60], coul: "#5D3A1E", dessus: "#7A5230", div: false });
    o.push({ f: "boite", c: [40, 40, 28], d: [60, 70, 6], coul: "#5D3A1E", div: false });
    o.push({ f: "cylindre", c: [40, 86, 0], r: 9, h: 40, n: 14, coul: "#2E7D32", ec: ec });
    o.push({ f: "sphere", c: [40, 136, 0], r: 12, coul: "#6B4423", ec: ec });
    o.push({ f: "cylindre", c: [-80, 0, 0], r: 12, h: 90, n: 14, coul: "#1E499B" });
    o.push({ f: "sphere", c: [-80, 106, 0], r: 15, coul: "#5A3A1E" });
    o.push({ f: "cylindre", c: [-68, 70, 0], r: 4, h: 80, n: 8, axe: "x", coul: "#1E499B" });
    return o;
  }
  remplacer("tle-ar-verbes", {
    c: "Tle A", m: "arabe", titre: "Verbes intransitifs et transitifs (اللازم والمتعدي)", duree: 30,
    accroche: "« ذهبَ الطالبُ المدرسةَ » : dans le journal d'Ibrahim, un verbe a pris un complément qu'il ne peut pas porter.",
    intro: "Le journal de bord d'un élève, écrit en arabe, te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois analyses.",
    objectifs: ["reconnaître un verbe intransitif (لازم)", "reconnaître un verbe transitif (متعدٍّ) et son مفعول به منصوب", "repérer les verbes à deux compléments", "rendre un verbe transitif avec les formes II et IV"],
    enquete: {
      titre: "Le journal d'Ibrahim, à Garoua",
      svg: (function () {
        var s = "<rect width='640' height='230' fill='#F4EFE4'/><g transform='rotate(2 330 115)'><rect x='160' y='20' width='320' height='190' rx='6' fill='#fff' stroke='#C9C1B2'/><path d='M440 20V210' stroke='#F2C2C9' stroke-width='2'/>";
        ["جلسَ الولدُ.", "كتبَ الطالبُ الدرسَ.", "ذهبَ الطالبُ المدرسةَ.", "أجلسَ الأبُ الولدَ.", "أعطى الأبُ الولدَ كتاباً."].forEach(function (l, i) { s += txtAr(426, 56 + i * 34, l, { s: 18, a: "start" }); });
        s += "<path d='M240 118h170' stroke='" + ROUGE + "' stroke-width='2'/></g>";
        return svg(640, 230, "Un journal intime ouvert avec cinq phrases verbales en arabe, dont une barrée en rouge", "", s);
      })(),
      legende: "À Garoua : Ibrahim, élève de Terminale A, tient un journal en arabe que corrige son professeur.",
      contexte: "<p>Le professeur a barré « ذهبَ الطالبُ المدرسةَ » et demande à Ibrahim de classer tous ses verbes. Ibrahim pense : « Tous les verbes peuvent avoir un complément direct, il suffit de mettre le nom au cas direct. » Son ami ajoute : « Et un verbe ne peut jamais avoir deux compléments. »</p>",
      documents: [{ t: "Rappel : le مفعول به", html: "<p>Le complément d'objet direct (مفعول به) d'un verbe transitif est au cas direct, <strong>منصوب</strong>, marqué par la fatḥa : كتبَ الطالبُ الدرس<strong>َ</strong>.</p>" }],
      question: "Pourquoi « ذهبَ الطالبُ المدرسةَ » est-elle fautive, et comment classer les verbes d'Ibrahim ?",
      tache: "Classe les cinq verbes (لازم / متعدٍّ), corrige la phrase fautive et explique la forme أجلسَ.",
      hypotheses: ["Tout verbe peut recevoir un مفعول به : il suffit de mettre le nom au منصوب.", "Un verbe ne peut jamais avoir deux compléments d'objet.", "Un verbe لازم n'a pas de مفعول به (il se construit avec une préposition) ; un verbe متعدٍّ en a un, parfois deux ; les formes II et IV rendent transitif."]
    },
    parties: [
      { t: "Le verbe intransitif (اللازم)", html: partie(AV_OLD, 0),
        planches: [{ type: "2D", titre: "لازم ou متعدٍّ ?", legende: "En haut, le verbe لازم s'arrête au sujet ; en bas, le verbe متعدٍّ « passe » au مفعول به, au cas منصوب. On lit de droite à gauche.", svg: (function () {
          var s = "<rect width='640' height='240' fill='#F5F7FB'/>";
          s += "<rect x='440' y='30' width='160' height='60' rx='12' fill='#7B3F99'/>" + txtAr(520, 70, "نامَ", { s: 26, c: "#fff" }) + "<rect x='250' y='30' width='160' height='60' rx='12' fill='" + BLEU + "'/>" + txtAr(330, 70, "الطفلُ", { s: 26, c: "#fff" }) + txtAr(130, 70, "لازم", { s: 22, c: "#7B3F99" }) + "<path d='M248 60h-30' stroke='" + GRIS + "' stroke-width='3' stroke-dasharray='5 4'/><path d='M214 50l-12 20M202 50l12 20' stroke='" + ROUGE + "' stroke-width='3'/>";
          s += "<rect x='440' y='140' width='160' height='60' rx='12' fill='#C2540A'/>" + txtAr(520, 180, "كتبَ", { s: 26, c: "#fff" }) + "<rect x='250' y='140' width='160' height='60' rx='12' fill='" + BLEU + "'/>" + txtAr(330, 180, "الطالبُ", { s: 26, c: "#fff" }) + "<rect x='40' y='140' width='170' height='60' rx='12' fill='" + VERT + "'/>" + txtAr(125, 180, "الدرسَ", { s: 26, c: "#fff" }) + "<path d='M248 170h-34' stroke='" + NUIT + "' stroke-width='3' marker-end='url(#avF)'/>" + txtAr(125, 222, "مفعول به (منصوب)", { s: 15, c: VERT }) + txtAr(520, 222, "متعدٍّ", { s: 18, c: "#C2540A" });
          return svg(640, 240, "Deux phrases : nama al-tiflu sans complément, kataba al-talibu al-darsa avec complément", fleche("avF", NUIT), s);
        })() }],
        fil: { html: "<p>ذهبَ est un verbe <strong>لازم</strong> : il ne peut pas avoir de مفعول به. On indique le lieu avec une préposition : « ذهبَ الطالبُ <strong>إلى</strong> المدرسةِ ». Mettre المدرسةَ au منصوب ne le rend pas transitif.</p>", verdicts: [[0, "rejetee", "ذهبَ est لازم : il se construit avec إلى, pas avec un مفعول به."]] },
        retenir: "اللازم : pas de مفعول به ; le lieu ou la personne se disent avec une préposition." },
      { t: "Le verbe transitif (المتعدي)", html: partie(AV_OLD, 1),
        fil: { html: "<p>« أعطى الأبُ الولدَ كتاباً » contient <strong>deux</strong> compléments au منصوب : الولدَ (à qui) et كتاباً (quoi). Certains verbes, comme أعطى (donner), en ont deux.</p>", verdicts: [[1, "rejetee", "أعطى a deux compléments : الولدَ et كتاباً."]] },
        retenir: "المتعدي : مفعول به منصوب ; أعطى en a deux." },
      { t: "Rendre un verbe transitif", html: partie(AV_OLD, 2),
        planches: [{ type: "3d", titre: "جلسَ الولدُ → أجلسَ الأبُ الولدَ", legende: "Tourne la scène : le père (bleu) fait asseoir l'enfant (vert) sur la chaise. Le curseur abaisse l'enfant sur la chaise : جلسَ (il s'est assis, لازم) devient أجلسَ (il a fait asseoir, متعدٍّ, forme IV).",
          modele: { h: 320, rx: -14, ry: 20, echelle: 0.95, alt: "Un père debout fait asseoir un enfant sur une chaise en bois", eclate: "Faire asseoir l'enfant", jouer: "أجلسَ", objets: chaise3D(),
            etiquettes: [{ p: [-80, 122, 0], t: "الأبُ (le père)" }, { p: [40, 150, 0], t: "الولدَ (مفعول به)", cote: "d", ec: [0, -46, 0] }] } }],
        fil: { html: "<p>La forme IV (أفعل) ajoute une idée de « faire faire » : جلسَ (s'asseoir) → <strong>أجلسَ</strong> (faire asseoir), qui prend un مفعول به : أجلسَ الأبُ <strong>الولدَ</strong>. La règle complète explique toutes les phrases d'Ibrahim.</p>", verdicts: [[2, "validee", "لازم sans مفعول به ; متعدٍّ avec un ou deux ; formes II et IV."]] },
        retenir: "Formes II (فعّل) et IV (أفعل) : rendre transitif." }
    ],
    denouement: {
      titre: "Le journal corrigé",
      etapes: ["جلسَ, ذهبَ : لازم ; « ذهبَ الطالبُ إلى المدرسةِ » (indice 1).", "كتبَ : متعدٍّ ; أعطى : deux compléments (indice 2).", "أجلسَ : forme IV, transitive (indice 3)."],
      reponse: "<p>« ذهبَ الطالبُ المدرسةَ » est fautive parce que ذهبَ est un verbe <strong>لازم</strong> : il n'a pas de مفعول به et se construit avec une préposition, d'où « ذهبَ الطالبُ <strong>إلى</strong> المدرسةِ ». Classement : جلسَ et ذهبَ sont لازم ; كتبَ (avec الدرسَ منصوب), أجلسَ et أعطى sont متعدٍّ. أعطى a même deux compléments, الولدَ et كتاباً : un verbe peut donc en avoir deux. Enfin, أجلسَ est la forme IV de جلسَ : elle ajoute l'idée de « faire asseoir » et rend le verbe transitif. Mettre un nom au منصوب ne suffit donc pas : c'est le verbe qui décide.</p>",
      transfert: "<p>Écris cinq phrases de ton propre journal en arabe : deux avec un verbe لازم, deux avec un verbe متعدٍّ, une avec أعطى, et souligne chaque مفعول به.</p>"
    },
    revision: (AV_OLD ? AV_OLD.revision : []).concat(["ذهبَ إلى… : un verbe لازم se complète par une préposition."]),
    exo: AV_OLD ? AV_OLD.exo : "",
    quiz: [
      q("نامَ الطفلُ : le verbe est…", "لازم", "متعدٍّ", "à deux compléments", "Pas de complément."),
      q("Le مفعول به est au cas…", "منصوب", "مرفوع", "مجرور", "Marqué par la fatḥa."),
      q("أجلسَ est la forme…", "IV", "II", "I", "أفعل."),
      q("كتبَ الطالبُ الدرسَ : le verbe est…", "متعدٍّ", "لازم", "sans sujet", "الدرسَ est مفعول به."),
      q("ذهبَ est…", "لازم", "متعدٍّ", "à deux compléments", "ذهبَ إلى…"),
      q("فتحَ الولدُ البابَ : le verbe est…", "متعدٍّ", "لازم", "nominal", "البابَ est مفعول به."),
      q("Combien de compléments dans أعطى الأبُ الولدَ كتاباً ?", "deux", "un", "aucun", "الولدَ et كتاباً."),
      q("جلسَ → أجلسَ : le verbe devient…", "متعدٍّ", "لازم", "passif", "Forme IV."),
      q("ضحكَ الرجلُ : le verbe est…", "لازم", "متعدٍّ", "à deux compléments", "Pas de complément."),
      q("Dans قرأَ الطالبُ القصةَ, le مفعول به est…", "القصةَ", "الطالبُ", "قرأَ", "Au cas منصوب.")
    ]
  });

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  VRT_A("1re-zh-budan", 0, "Construis la phrase : 不但……而且……", function (el) {
    var A = [["会说汉语", "huì shuō Hànyǔ", "parle chinois"], ["会说英语", "huì shuō Yīngyǔ", "parle anglais"], ["喜欢看书", "xǐhuan kàn shū", "aime lire"], ["喜欢踢足球", "xǐhuan tī zúqiú", "aime jouer au football"], ["帮助妈妈", "bāngzhù māma", "aide maman"], ["尊重老师", "zūnzhòng lǎoshī", "respecte le professeur"]], S = [["我哥哥", "wǒ gēge", "Mon grand frère"], ["我姐姐", "wǒ jiějie", "Ma grande sœur"], ["我", "wǒ", "Je"]], s = 0, a = 0, b = 1;
    function sel(lib, L, v, cle) { return "<label class='labo-c'><span>" + lib + "</span><select class='labo-sel' data-" + cle + ">" + L.map(function (x, k) { return "<option value='" + k + "'" + (k === v ? " selected" : "") + ">" + x[0] + " (" + x[2] + ")</option>"; }).join("") + "</select></label>"; }
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:8px 18px'>" + sel("Sujet", S, s, "s") + sel("Qualité A", A, a, "a") + sel("Qualité B", A, b, "b") + "</div><svg viewBox='0 0 640 150' class='an-svg' data-v></svg><p class='labo-r' data-r></p>";
    function maj() {
      s = +el.querySelector("[data-s]").value; a = +el.querySelector("[data-a]").value; b = +el.querySelector("[data-b]").value;
      var x = 10, h = "<rect width='640' height='150' fill='#FBF5EC'/>", P = [[S[s][0], S[s][1], "#5C6478"], ["不但", "bùdàn", "#B01C14"], [A[a][0], A[a][1], BLEU], ["而且", "érqiě", "#C9A227"], [A[b][0], A[b][1], VERT]];
      P.forEach(function (p) { var w = Math.max(70, p[0].length * 22 + 20); h += bloc(x, 30, w, 66, p[2], p[0], p[1]); x += w + 6; });
      el.querySelector("[data-v]").setAttribute("viewBox", "0 0 " + Math.max(640, x + 10) + " 150");
      el.querySelector("[data-v]").innerHTML = h;
      el.querySelector("[data-r]").innerHTML = a === b ? "⚠️ Choisis deux qualités différentes : 不但……而且…… ajoute une seconde idée." : "<b>" + S[s][0] + "不但" + A[a][0] + "，而且" + A[b][0] + "。</b> " + S[s][2] + " : non seulement « " + A[a][2] + " », mais aussi « " + A[b][2] + " ».";
    }
    el.querySelectorAll("select").forEach(function (x) { x.addEventListener("change", maj); }); maj();
  });
  VRT_A("1re-zh-ruguo", 1, "Quelle phrase est correcte ?", function (el) {
    exercice(el, [["S'il pleut demain, nous n'irons pas : ___", ["如果明天下雨，我们就不去。", "我们就如果明天下雨不去。", "就我们如果明天下雨不去。"], "如果 + condition，sujet + 就 + conséquence."], ["Si tu as un problème, demande au professeur : ___", ["如果你有问题，就问老师。", "就如果你有问题问老师。", "你有问题如果，就问老师。"], "Sans sujet dans la conséquence, 就 ouvre la conséquence."], ["S'il fait beau, nous irons à Kribi : ___", ["如果天气好，我们就去克里比。", "我们就去克里比，如果天气好。", "如果我们就天气好去克里比。"], "La condition vient en premier."], ["Si tu es fatigué, repose-toi : ___", ["如果你累了，就休息吧。", "就你累了如果休息吧。", "你如果就累了休息吧。"], "如果……，就……"], ["Certains élèves aiment lire, d'autres le sport : ___", ["学生有的喜欢看书，有的喜欢运动。", "学生如果喜欢看书，就喜欢运动。", "学生不但喜欢看书，有的喜欢运动。"], "有的……有的……"]], "Phrase suivante", "Phrase");
  });
  VRT_A("tle-ar-khabar", 1, "Quel est le type du خبر ?", function (el) {
    exercice(el, KHABAR.map(function (k) { return ["<span dir='rtl' style='font-size:22px'>" + k[0] + "</span> — type du خبر : ___", [k[1], "مفرد", "جملة فعلية", "جملة اسمية", "شبه جملة"].filter(function (x, i, a) { return a.indexOf(x) === i; }), k[2] + "."]; }), "Phrase suivante", "Phrase");
  });
  VRT_A("tle-ar-verbes", 0, "لازم أم متعدٍّ ? Classe chaque verbe", function (el) {
    exercice(el, VERBES.map(function (v) { return ["<span dir='rtl' style='font-size:22px'>" + v[0] + "</span> : ___", [v[1], v[1] === "لازم" ? "متعدٍّ" : "لازم"], v[2] + "."]; }), "Phrase suivante", "Phrase");
  });
})();
