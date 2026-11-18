/* Leçons APPROFONDIES — lot 15, 5e et 4e (18/11/2026) : subordonnée relative, Pygmées et Sao, croissance de la population (5e),
   alphabet grec (4e). Même gabarit et même mécanisme que 11-approfondies-lot4.js (remplacement EN PLACE ; ordre, clé, fiche APC,
   examen et scènes conservés ; partie « Entraînement au format de l'examen » et quiz d'origine repris). Simulations VRT_A en fin. */
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
  /* case à toit conique (3D) */
  function case3D(o, x, z, r, h, toit, mur, y0) {
    y0 = y0 || 0;
    o.push({ f: "cylindre", c: [x, y0, z], r: r, h: h, n: 14, coul: mur || "#B5793F" });
    o.push({ f: "cone", c: [x, y0 + h, z], r: r * 1.25, h: r * 1.3, n: 14, coul: toit || "#8A6E4B" });
  }
  function bonhomme3D(o, x, z, habit, peau, y0) {
    y0 = y0 || 0;
    o.push({ f: "cylindre", c: [x, y0, z], r: 7, r2: 5, h: 26, n: 10, coul: habit });
    o.push({ f: "sphere", c: [x, y0 + 32, z], r: 6, coul: peau || "#5A3A1E" });
  }

  /* ═══════════════════════ 5e FRANÇAIS — LA SUBORDONNÉE RELATIVE ═══════════════════════ */
  var SR_OLD = ancien("5e-francais-subordonnee-relative");
  function bandjoun3D() {
    var o = [], k, R = alea(17);
    o.push({ f: "boite", c: [0, -8, 0], d: [520, 8, 380], coul: "#7A5530", dessus: "#6E9B45" });
    o.push({ f: "boite", c: [0, 40, 60], d: [110, 80, 110], coul: "#6B3A1E", dessus: "#6B3A1E" });
    o.push({ f: "cone", c: [0, 80, 60], r: 92, h: 150, n: 4, coul: "#8A6E4B" });
    [-40, -14, 14, 40].forEach(function (x) { o.push({ f: "cylindre", c: [x, 0, 2], r: 5, h: 78, n: 8, coul: "#4A2E1A" }); o.push({ f: "boite", c: [x, 40, 0], d: [6, 50, 2], coul: "#C62828", div: false }); });
    o.push({ f: "boite", c: [0, 22, 4], d: [22, 44, 2], coul: "#2B1D12", div: false });
    [[-160, 90], [160, 110], [-150, -40]].forEach(function (p) { o.push({ f: "boite", c: [p[0], 22, p[1]], d: [50, 44, 50], coul: "#8B5A2B", dessus: "#8B5A2B" }); o.push({ f: "cone", c: [p[0], 44, p[1]], r: 42, h: 64, n: 4, coul: "#9C7D52" }); });
    for (k = 0; k < 10; k++) { var x = 170 + (R() - 0.5) * 80, z = -110 + (R() - 0.5) * 90; o.push({ f: "cylindre", c: [x, 0, z], r: 4, h: 40, n: 6, coul: "#5D3A1E" }); o.push({ f: "sphere", c: [x, 52, z], r: 22 + R() * 8, coul: k % 2 ? "#2E6B2A" : "#3E7D32" }); }
    [[-40, -130], [10, -130], [60, -130]].forEach(function (p, i) { o.push({ f: "boite", c: [p[0], 14, p[1]], d: [40, 2, 28], coul: "#9AA3AF", dessus: "#B8BFCC", div: false }); [-16, 16].forEach(function (dx) { [-12, 12].forEach(function (dz) { o.push({ f: "cylindre", c: [p[0] + dx, 0, p[1] + dz], r: 1.6, h: 14, n: 6, coul: "#6B4423" }); }); }); o.push({ f: "boite", c: [p[0], 4, p[1]], d: [34, 8, 20], coul: "#8B5A2B", dessus: ["#E8A33D", "#C62828", "#3E8E3A"][i], div: false }); });
    bonhomme3D(o, -20, -100, "#7B3F99"); bonhomme3D(o, 40, -100, "#E8A33D", "#6B4423");
    o.push({ f: "boite", c: [0, -3, -60], d: [30, 2, 120], coul: "#B88A5A", dessus: "#C9A06E", div: false });
    return o;
  }
  remplacer("5e-francais-subordonnee-relative", {
    c: "5e", m: "francais", titre: "La proposition subordonnée relative", duree: 30,
    accroche: "« Le chef que je t'ai parlé… », « le marché que les femmes vont… » : la lettre de Junior sonne faux. Pourquoi ?",
    intro: "Une lettre écrite par un élève de Bandjoun à son correspondant belge te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois conseils.",
    objectifs: ["reconnaître une subordonnée relative, son pronom et son antécédent", "choisir qui, que, dont ou où selon la fonction", "distinguer « que » relatif et « que » conjonction", "éviter les répétitions en reliant des phrases"],
    enquete: {
      titre: "La lettre de Junior à son correspondant",
      svg: svg(640, 220, "Un élève écrit une lettre à une table ; au fond, une chefferie au grand toit pointu sur une colline", lin("srC", ["#CFE3F2", "#F4F1EA"], true),
        "<rect width='640' height='220' fill='url(#srC)'/><path d='M0 150Q160 110 320 130T640 120V220H0Z' fill='#6E9B45'/>" +
        "<rect x='440' y='86' width='70' height='50' fill='#6B3A1E'/><path d='M420 88L475 18L530 88Z' fill='#8A6E4B'/><path d='M450 136V96M462 136V96M488 136V96M500 136V96' stroke='#C62828' stroke-width='4'/><rect x='468' y='106' width='14' height='30' fill='#2B1D12'/>" +
        "<rect x='560' y='110' width='40' height='30' fill='#8B5A2B'/><path d='M552 112L580 74L608 112Z' fill='#9C7D52'/>" +
        "<rect x='40' y='150' width='300' height='12' rx='3' fill='#8B5A2B'/><rect x='52' y='162' width='10' height='50' fill='#6B4423'/><rect x='318' y='162' width='10' height='50' fill='#6B4423'/>" +
        "<g transform='rotate(-3 200 120)'><rect x='120' y='60' width='190' height='92' fill='#FFFBEA' stroke='#E3D7A6'/>" + txt(130, 80, "Cher Thomas,", { s: 11, a: "start", c: BLEU, i: true }) + txt(130, 98, "Le chef que je t'ai parlé", { s: 11, a: "start", c: ROUGE, i: true }) + txt(130, 116, "habite la chefferie.", { s: 11, a: "start", c: BLEU, i: true }) + txt(130, 134, "Le marché que les femmes vont…", { s: 11, a: "start", c: ROUGE, i: true }) + "</g>" +
        perso(80, 66, "#5A3A1E", "#DCE6F2", "#1E499B") + bulle(330, 20, 170, "Ça sonne faux…", "#F7C948")),
      legende: "À Bandjoun, dans l'Ouest : Junior écrit à Thomas, son correspondant de Liège, pour lui présenter son village.",
      contexte: "<p>Le premier brouillon de Junior répétait sans cesse les mêmes mots : « Mon village s'appelle Bandjoun. Bandjoun est sur une colline. Le chef habite la chefferie. Je t'ai parlé du chef. » Son grand frère lui conseille de relier les phrases. Junior écrit alors : « Le chef <strong>que</strong> je t'ai parlé habite la chefferie. Le marché <strong>que</strong> les femmes vont ouvre le samedi. Je pense <strong>que</strong> tu aimeras Bandjoun. » Sa sœur dit : « Mets plutôt des “et” partout, c'est plus simple. »</p>",
      documents: [{ t: "Le brouillon de Junior", html: "<p>« Mon village s'appelle Bandjoun. Bandjoun est sur une colline. Le chef habite la chefferie. Je t'ai parlé du chef. Les femmes vont au marché. Le marché ouvre le samedi. »</p>" }],
      question: "Comment relier correctement ces phrases, et pourquoi « que » ne convient-il pas partout ?",
      tache: "Réécris le brouillon avec des subordonnées relatives correctes, en justifiant chaque pronom relatif.",
      hypotheses: ["Il suffit de relier avec « et » : « Le chef habite la chefferie et je t'ai parlé du chef. »", "« Que » convient partout : c'est le pronom relatif passe-partout.", "Le pronom dépend de sa fonction dans la relative (qui sujet, que COD, dont « de… », où lieu) ; et sans antécédent, « que » n'est pas relatif."]
    },
    parties: [
      { t: "Reconnaître la relative", html: partie(SR_OLD, 0),
        planches: [{ type: "2D", titre: "Antécédent, pronom relatif, relative", legende: "La relative s'accroche au nom qu'elle complète (l'antécédent) par un pronom relatif. Elle remplace la phrase répétée : le nom n'est écrit qu'une fois.", svg: (function () {
          var s = "<rect width='640' height='230' fill='#FBF8F2'/>" + txt(320, 30, "Le chef habite la chefferie.  +  Je t'ai parlé du chef.", { s: 14, c: GRIS }) + "<path d='M320 42V64' stroke='" + NUIT + "' stroke-width='2' marker-end='url(#srF)'/>";
          s += "<rect x='40' y='80' width='96' height='40' rx='8' fill='" + BLEU + "'/>" + txt(88, 106, "Le chef", { s: 16, c: "#fff" }) + "<rect x='142' y='80' width='60' height='40' rx='8' fill='" + ROUGE + "'/>" + txt(172, 106, "dont", { s: 16, c: "#fff" }) + "<rect x='208' y='80' width='170' height='40' rx='8' fill='#fff' stroke='" + ROUGE + "' stroke-width='2' stroke-dasharray='5 3'/>" + txt(293, 106, "je t'ai parlé", { s: 16, c: ROUGE }) + "<rect x='384' y='80' width='216' height='40' rx='8' fill='#E9EEF6'/>" + txt(492, 106, "habite la chefferie.", { s: 16 });
          s += "<path d='M172 124Q130 160 88 124' stroke='" + ROUGE + "' stroke-width='2' fill='none' marker-end='url(#srF2)'/>" + txt(130, 170, "remplace « du chef »", { s: 11, c: ROUGE });
          s += "<path d='M142 196H378' stroke='" + ROUGE + "' stroke-width='3'/><path d='M142 190V202M378 190V202' stroke='" + ROUGE + "' stroke-width='3'/>" + txt(260, 216, "subordonnée relative", { s: 12, c: ROUGE }) + txt(88, 72, "antécédent", { s: 11, c: BLEU });
          return svg(640, 230, "Deux phrases réunies : le chef dont je t’ai parlé habite la chefferie ; flèche du pronom dont vers son antécédent le chef", fleche("srF", NUIT) + fleche("srF2", ROUGE), s);
        })() }],
        fil: { html: "<p>Avec « et », le nom « chef » reste répété deux fois. La subordonnée relative, elle, <strong>remplace le nom répété par un pronom relatif</strong> et s'accroche juste après l'antécédent : « Le chef dont je t'ai parlé habite la chefferie. » Une seule phrase, une seule fois le mot « chef ».</p>", verdicts: [[0, "rejetee", "« Et » garde la répétition ; la relative remplace le nom par un pronom."]] },
        retenir: "Pronom relatif + verbe conjugué, juste après l'antécédent." },
      { t: "Choisir le bon pronom", html: partie(SR_OLD, 1),
        planches: [{ type: "3d", titre: "Le village de Junior", legende: "Tourne le village : la chefferie au grand toit de chaume et aux piliers sculptés, les cases, le bois sacré, le marché du samedi. Chaque lieu donne une relative : la chefferie où vit le chef, le marché où vont les femmes, le bois sacré dont on parle à voix basse.",
          modele: { h: 380, rx: -24, ry: 24, echelle: 0.8, alt: "Village de l’Ouest du Cameroun : grande chefferie au toit pyramidal de chaume, cases, bois sacré, étals de marché", objets: bandjoun3D(),
            etiquettes: [{ p: [0, 200, 60], t: "la chefferie où vit le chef" }, { p: [10, 20, -130], t: "le marché où vont les femmes", cote: "g" }, { p: [170, 70, -110], t: "le bois sacré dont on parle", cote: "d" }] } }],
        fil: { html: "<p>Remplace le pronom par l'antécédent : « je t'ai parlé <em>du chef</em> » → complément en « de » → <strong>dont</strong>. « Les femmes vont <em>au marché</em> » → lieu → <strong>où</strong>. « Que » ne convient que pour un COD : « le pagne <strong>que</strong> ma mère a acheté » (elle a acheté <em>le pagne</em>).</p>", verdicts: [[1, "rejetee", "« Que » est COD seulement : « dont je t'ai parlé », « où les femmes vont »."]] },
        retenir: "qui = sujet ; que = COD ; dont = « de… » ; où = lieu ou temps." },
      { t: "La fonction de la relative", html: partie(SR_OLD, 2),
        fil: { html: "<p>Dans « Je pense que tu aimeras Bandjoun », il n'y a pas de nom avant « que » : pas d'antécédent, donc ce n'est pas un pronom relatif mais une <strong>conjonction</strong> ; cette phrase est correcte telle quelle. La relative, elle, complète toujours un nom, comme un adjectif.</p>", verdicts: [[2, "validee", "Pronom choisi selon sa fonction ; « que » sans antécédent est une conjonction."]] },
        retenir: "Pas d'antécédent, pas de relative." },
      SR_OLD && SR_OLD.parties[3] ? SR_OLD.parties[3] : { t: "Entraînement", html: "" }
    ],
    denouement: {
      titre: "La lettre corrigée",
      etapes: ["La relative remplace le nom répété (indice 1).", "dont = « de… », où = lieu, que = COD (indice 2).", "« Je pense que… » : conjonction, pas de relative (indice 3)."],
      reponse: "<p>Relier avec « et » ne supprime pas la répétition ; la subordonnée relative la supprime, car le pronom relatif reprend l'antécédent. Mais le pronom dépend de sa fonction dans la relative : on dit « je t'ai parlé du chef », donc « le chef <strong>dont</strong> je t'ai parlé » ; « les femmes vont au marché », lieu, donc « le marché <strong>où</strong> les femmes vont ». « Que » est réservé au COD. Enfin, « Je pense que tu aimeras Bandjoun » est juste : « que » n'y a pas d'antécédent, c'est une conjonction. Lettre corrigée : « Mon village, <strong>qui</strong> s'appelle Bandjoun, est sur une colline. Le chef <strong>dont</strong> je t'ai parlé habite la chefferie. Le marché <strong>où</strong> vont les femmes ouvre le samedi. Les masques <strong>que</strong> nous portons à la fête sont célèbres. Je pense que tu aimeras Bandjoun. »</p>",
      transfert: "<p>Relie par une relative : « J'ai visité la case. Mon grand-père est né dans cette case. » <em>(J'ai visité la case où mon grand-père est né.)</em></p>"
    },
    revision: (SR_OLD ? SR_OLD.revision : []).concat(["Test : remplace le pronom par l'antécédent pour trouver sa fonction."]),
    exo: SR_OLD ? SR_OLD.exo : "",
    quiz: SR_OLD ? SR_OLD.quiz : []
  });

  /* ═══════════════════════ 5e HISTOIRE — LES PYGMÉES ET LES SAO ═══════════════════════ */
  var PS_OLD = ancien("5e-histoire-pygmees-sao");
  var CMR = [[8.6, 4.6], [9.3, 6.0], [10.1, 6.9], [11.1, 6.5], [11.8, 7.1], [12.3, 8.4], [13.0, 9.4], [13.6, 10.2], [14.1, 11.2], [14.6, 12.0], [14.1, 13.0], [14.6, 13.1], [15.0, 12.0], [15.1, 10.8], [15.6, 10.0], [14.4, 9.9], [14.9, 8.7], [15.5, 7.5], [14.6, 6.3], [14.5, 5.0], [15.0, 4.1], [16.1, 3.0], [16.2, 2.2], [15.0, 1.9], [13.3, 2.2], [11.3, 2.2], [9.8, 2.3], [9.8, 3.0], [9.5, 3.9], [9.0, 4.0]];
  function butte3D() {
    var o = [], k, R = alea(23);
    o.push({ f: "boite", c: [0, -8, 0], d: [560, 6, 420], coul: "#3E6E8E", dessus: "#5B8FB0" });
    o.push({ f: "cone", c: [0, -5, 20], r: 190, r2: 130, h: 34, n: 24, coul: "#9C7A4E" });
    o.push({ f: "cylindre", c: [0, 29, 20], r: 130, h: 2, n: 24, coul: "#B89466", dessus: "#C9A87A" });
    [[-60, 60], [40, 90], [70, 0], [-30, -20], [-90, -30]].forEach(function (p, i) { case3D(o, p[0], p[1], 20 - (i % 2) * 3, 30, "#A68A5E", "#B07A44", 31); });
    for (k = 0; k < 3; k++) { o.push({ f: "cylindre", c: [20 + k * 26, 31, -70], r: 9, r2: 11, h: 20, n: 12, coul: "#A0522D" }); o.push({ f: "cylindre", c: [20 + k * 26, 51, -70], r: 11, r2: 6, h: 8, n: 12, coul: "#8B4513" }); }
    for (k = 0; k < 14; k++) { var a = R() * 6.28, d = 210 + R() * 40; o.push({ f: "cylindre", c: [Math.cos(a) * d, -5, Math.sin(a) * d * 0.9], r: 2, h: 18 + R() * 10, n: 5, coul: "#6E8B3D" }); }
    o.push({ f: "boite", c: [-180, -2, -150], d: [50, 4, 14], coul: "#5D3A1E", dessus: "#7A5530" });
    bonhomme3D(o, -180, -150, "#C9B28A", "#4A2E1A");
    bonhomme3D(o, -40, -60, "#E9DFCF", "#4A2E1A", 31);
    return o;
  }
  var CIRE = [
    ["1. Modèle en cire", "On sculpte la statuette dans la cire d'abeille.", function () { return "<path d='M0 40c-14 0 -16 -30 -6 -38c-8 -8 -4 -22 6 -22s14 14 6 22c10 8 8 38 -6 38Z' fill='#E8C46A' stroke='#B8902A'/>"; }],
    ["2. Moule en argile", "On recouvre la cire d'argile, en laissant un trou (l'entonnoir).", function () { return "<path d='M-30 46h60v-62q-30 -30 -60 0Z' fill='#A0522D'/><path d='M0 40c-14 0 -16 -30 -6 -38c-8 -8 -4 -22 6 -22s14 14 6 22c10 8 8 38 -6 38Z' fill='#E8C46A' opacity='.55'/><path d='M-6 -40h12l-4 10h-4Z' fill='#8B4513'/>"; }],
    ["3. Chauffe : la cire fond", "Au feu, l'argile durcit ; la cire fond et s'écoule : elle est « perdue ».", function () { return "<path d='M-30 46h60v-62q-30 -30 -60 0Z' fill='#A0522D'/><path d='M0 40c-14 0 -16 -30 -6 -38c-8 -8 -4 -22 6 -22s14 14 6 22c10 8 8 38 -6 38Z' fill='#3B2416'/><path d='M-3 -40q-3 -14 0 -22' stroke='#E8C46A' stroke-width='4'/><path d='M-40 62q10 -24 20 0q10 -24 20 0q10 -24 20 0q10 -24 20 0' fill='#F28C28'/>"; }],
    ["4. Coulée du bronze", "On verse le bronze fondu (cuivre + étain, plus de 1 000 °C) dans le vide.", function () { return "<path d='M-30 46h60v-62q-30 -30 -60 0Z' fill='#A0522D'/><path d='M0 40c-14 0 -16 -30 -6 -38c-8 -8 -4 -22 6 -22s14 14 6 22c10 8 8 38 -6 38Z' fill='#F2A33A'/><path d='M14 -64l-14 22' stroke='#F2A33A' stroke-width='5'/><path d='M8 -72h26l-4 12h-18Z' fill='#5C6478'/>"; }],
    ["5. On casse le moule", "Après refroidissement, on brise l'argile : la statuette de bronze apparaît.", function () { return "<path d='M-34 46l10 -18l8 18ZM20 46l10 -22l8 22Z' fill='#A0522D'/><path d='M0 40c-14 0 -16 -30 -6 -38c-8 -8 -4 -22 6 -22s14 14 6 22c10 8 8 38 -6 38Z' fill='#B87333' stroke='#7A4A1E'/><circle cx='-3' cy='-16' r='1.6' fill='#3B2416'/><circle cx='3' cy='-16' r='1.6' fill='#3B2416'/>"; }]];
  remplacer("5e-histoire-pygmees-sao", {
    c: "5e", m: "histoire", titre: "Les Pygmées et les Sao, premiers peuples du Cameroun", duree: 30,
    accroche: "Au Musée national, deux élèves se disputent : « Les Sao étaient des géants ! » « Non, c'étaient des petits hommes de la forêt, comme les Pygmées ! » Qui a raison ?",
    intro: "Une visite de classe au Musée national de Yaoundé te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois affirmations.",
    objectifs: ["localiser les peuples pygmées et les Sao sur la carte du Cameroun", "décrire leur mode de vie", "expliquer la technique du bronze à la cire perdue", "distinguer ce que disent l'archéologie et la tradition orale"],
    enquete: {
      titre: "La dispute du Musée national",
      svg: svg(640, 220, "Salle de musée : une vitrine avec une statuette de bronze et une grande jarre ; deux élèves se disputent devant", lin("psC", ["#F4EDE1", "#E2D5BF"], true),
        "<rect width='640' height='220' fill='url(#psC)'/><rect y='186' width='640' height='34' fill='#8B6B4A'/><rect x='220' y='40' width='200' height='120' fill='#DCEBF5' opacity='.7' stroke='#9AA3AF' stroke-width='3'/><rect x='210' y='160' width='220' height='30' fill='#5D3A1E'/>" +
        "<g transform='translate(270 128)'><path d='M0 30c-14 0 -16 -30 -6 -38c-8 -8 -4 -22 6 -22s14 14 6 22c10 8 8 38 -6 38Z' fill='#B87333' stroke='#7A4A1E'/></g><path d='M340 158c-20 0 -26 -60 -10 -80h40c16 20 10 80 -10 80Z' fill='#A0522D' stroke='#6B3A1E'/><path d='M336 78h28' stroke='#6B3A1E' stroke-width='4'/>" +
        txt(320, 30, "Civilisation Sao — Extrême-Nord", { s: 11, c: GRIS }) +
        perso(110, 100, "#5A3A1E", "#DCE6F2", "#1E499B") + perso(530, 100, "#6B4423", "#DCE6F2", "#1E499B") + bulle(20, 50, 170, "Des géants !", "#F7C948") + bulle(450, 50, 180, "Des petits hommes !", "#9FC5E8")),
      legende: "Au Musée national de Yaoundé, la classe de 5e découvre une statuette de bronze et une jarre funéraire sao.",
      contexte: "<p>Devant la vitrine, Esther affirme : « Mon grand-père dit que les Sao étaient des <strong>géants</strong> : c'est donc vrai. » Brice réplique : « Les Sao et les Pygmées, c'est pareil : de petits hommes qui vivaient dans la forêt du Sud. » Le guide sourit et propose de vérifier avec la carte, les objets et ce que disent les archéologues.</p>",
      documents: [{ t: "Le cartel de la vitrine", html: "<p>« Statuette en bronze, technique de la cire perdue. Jarre funéraire. Civilisation Sao, plaine du Logone et du Chari, Extrême-Nord du Cameroun. Objets issus de fouilles archéologiques. »</p>" }],
      question: "Où vivaient les Pygmées et les Sao, comment vivaient-ils, et que valent les deux affirmations ?",
      tache: "Situe les deux peuples, décris leur mode de vie et dis comment on les connaît.",
      hypotheses: ["Pygmées et Sao vivaient au même endroit, dans la forêt du Sud.", "Les Sao étaient de vrais géants : la tradition orale le dit, c'est donc prouvé.", "Les peuples pygmées (Baka, Bagyeli, Bedzang) vivent dans la forêt du Sud et de l'Est ; les Sao, agriculteurs et bronziers, vivaient au sud du lac Tchad ; l'archéologie corrige la légende."]
    },
    parties: [
      { t: "Les Pygmées, peuple de la forêt", html: partie(PS_OLD, 0),
        planches: [{ type: "2D", titre: "Deux peuples, deux milieux", legende: "La forêt dense du Sud et de l'Est (vert foncé) est le domaine des Baka, Bagyeli et Bedzang ; la plaine inondable du Logone et du Chari, au sud du lac Tchad (Extrême-Nord), était celui des Sao. Plus de 1 000 km les séparent.", svg: (function () {
          var X = function (l) { return 40 + (l - 8.3) * 32; }, Y = function (l) { return 380 - (l - 1.6) * 30; }, pts = CMR.map(function (p) { return X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1); }).join("L"), s = "<rect width='640' height='400' fill='#DCEBF5'/><clipPath id='psK'><path d='M" + pts + "Z'/></clipPath>";
          s += "<path d='M" + pts + "Z' fill='#000' opacity='.12' transform='translate(4 5)'/><g clip-path='url(#psK)'>" + [[1.5, 5.6, "#2E6B34"], [5.6, 7.0, "#7E9D57"], [7.0, 8.3, "#A9B46A"], [8.3, 10.9, "#CDBB78"], [10.9, 13.4, "#E6D6A2"]].map(function (b) { return "<rect x='0' y='" + Y(b[1]) + "' width='400' height='" + (Y(b[0]) - Y(b[1])) + "' fill='" + b[2] + "'/>"; }).join("") + "<path d='M" + X(14.3) + " " + Y(12.9) + "Q" + X(14.8) + " " + Y(11.6) + " " + X(14.6) + " " + Y(10.8) + "L" + X(15.2) + " " + Y(10.4) + "L" + X(15.4) + " " + Y(12.2) + "Z' fill='#9FC6A6' opacity='.8'/></g>";
          s += "<path d='M" + pts + "Z' fill='none' stroke='#5B3A1A' stroke-width='2' stroke-linejoin='round'/><path d='M" + X(14.1) + " " + Y(13.0) + "q10 -14 26 -8q8 10 -6 18Z' fill='#5BA3D9' stroke='#2F6DB5'/>" + txt(X(14.2), Y(13.35), "lac Tchad", { s: 10, c: "#2F6DB5", i: true, a: "end" });
          s += "<path d='M" + X(15.1) + " " + Y(10.5) + "Q" + X(14.6) + " " + Y(11.7) + " " + X(14.4) + " " + Y(12.8) + "' stroke='#2F6DB5' stroke-width='2' fill='none'/>";
          [["Baka", 14.2, 3.2], ["Baka", 12.6, 2.8], ["Bagyeli", 10.2, 3.0], ["Bedzang", 11.6, 4.9]].forEach(function (p) { s += "<circle cx='" + X(p[1]) + "' cy='" + Y(p[2]) + "' r='6' fill='#F7C948' stroke='#5B3A1A'/>" + txt(X(p[1]) + 9, Y(p[2]) + 4, p[0], { s: 11, a: "start", c: "#fff", halo: false }); });
          s += "<rect x='" + (X(14.4) - 7) + "' y='" + (Y(11.9) - 7) + "' width='14' height='14' fill='#B87333' stroke='#fff' stroke-width='2'/>" + txt(X(14.4) + 12, Y(11.9) + 4, "Sao", { s: 12, a: "start", halo: true });
          s += "<rect x='360' y='40' width='260' height='140' rx='12' fill='#fff' stroke='#2E6B34' stroke-width='2'/>" + txt(376, 64, "Peuples pygmées", { s: 14, a: "start", c: "#2E6B34" }) + ["forêt dense du Sud et de l'Est", "Baka, Bagyeli, Bedzang", "chasse, pêche, cueillette (miel)", "semi-nomades, campements", "plantes médicinales"].map(function (t, i) { return txt(376, 88 + i * 18, "• " + t, { s: 11, a: "start", w: 500 }); }).join("");
          s += "<rect x='360' y='200' width='260' height='150' rx='12' fill='#fff' stroke='#B87333' stroke-width='2'/>" + txt(376, 224, "Civilisation Sao", { s: 14, a: "start", c: "#8B4513" }) + ["plaine du Logone et du Chari", "au sud du lac Tchad", "agriculture, élevage, pêche", "villages sur des buttes", "poterie et bronze (cire perdue)", "jusque vers le XVIᵉ siècle"].map(function (t, i) { return txt(376, 248 + i * 17, "• " + t, { s: 11, a: "start", w: 500 }); }).join("");
          return svg(640, 400, "Carte du Cameroun : forêt du Sud avec les peuples Baka, Bagyeli, Bedzang ; plaine au sud du lac Tchad avec les Sao", "", s);
        })() }],
        fil: { html: "<p>La carte est sans appel : les peuples pygmées vivent dans la <strong>forêt dense</strong> du Sud et de l'Est (Baka vers Lomié et Djoum, Bagyeli vers Kribi et Lolodorf, Bedzang au centre), tandis que les Sao occupaient la <strong>plaine du Logone et du Chari</strong>, au sud du lac Tchad, à plus de 1 000 km. Deux milieux, deux peuples, deux modes de vie.</p>", verdicts: [[0, "rejetee", "Forêt du Sud et de l'Est pour les Pygmées ; sud du lac Tchad pour les Sao."]] },
        retenir: "Baka, Bagyeli, Bedzang : chasseurs-cueilleurs de la forêt." },
      { t: "Les Sao, une civilisation du lac Tchad", html: partie(PS_OLD, 1),
        planches: [{ type: "3d", titre: "Un village sao sur sa butte", legende: "Tourne la scène : pendant la crue, la plaine du Logone est inondée ; le village, bâti sur une butte de terre, reste au sec. Cases rondes à toit de paille, jarres de terre cuite, une pirogue de pêcheur.",
          modele: { h: 360, rx: -28, ry: 22, echelle: 0.8, alt: "Plaine inondée avec une butte de terre portant des cases rondes, des jarres et une pirogue", objets: butte3D(),
            etiquettes: [{ p: [0, 30, 150], t: "butte de terre", cote: "d" }, { p: [46, 60, -70], t: "jarres", cote: "d" }, { p: [-180, 10, -150], t: "pirogue (pêche)", cote: "g" }, { p: [-220, -4, 120], t: "plaine inondée", cote: "g" }] } }],
        fil: { html: "<p>Les objets de la vitrine viennent des fouilles des buttes : jarres, perles, statuettes de bronze coulées à la <strong>cire perdue</strong> (simulation ci-dessus). Ce sont les traces d'une société d'agriculteurs, d'éleveurs, de pêcheurs et d'artisans très habiles, et non d'un peuple de chasseurs de la forêt.</p>", verdicts: [] },
        retenir: "Buttes, jarres funéraires, bronze à la cire perdue : les traces des Sao." },
      { t: "Comment les connaissons-nous ?", html: partie(PS_OLD, 2),
        fil: { html: "<p>Les Sao n'ont pas laissé d'écrits. Les récits des peuples voisins en font des « géants » : une façon de dire leur force et leur prestige. Mais les archéologues qui ont fouillé leurs buttes et leurs jarres funéraires y ont trouvé des restes d'êtres humains de taille ordinaire. La tradition orale est précieuse, mais elle doit être <strong>confrontée</strong> à l'archéologie.</p>", verdicts: [[1, "rejetee", "La légende des « géants » n'est pas confirmée par les fouilles."], [2, "validee", "Deux peuples, deux milieux ; l'archéologie corrige la légende."]] },
        retenir: "Sans écrits : fouilles et récits des anciens, qu'on confronte." },
      PS_OLD && PS_OLD.parties[3] ? PS_OLD.parties[3] : { t: "Entraînement", html: "" }
    ],
    denouement: {
      titre: "Le guide tranche",
      etapes: ["Deux milieux différents sur la carte (indice 1).", "Buttes, jarres, bronze : une civilisation d'agriculteurs et d'artisans (indice 2).", "Les fouilles ne confirment pas les « géants » (indice 3)."],
      reponse: "<p>Esther et Brice se trompent tous les deux. Les peuples pygmées (Baka, Bagyeli, Bedzang) vivent dans la forêt dense du Sud et de l'Est ; chasseurs, pêcheurs et cueilleurs semi-nomades, ils connaissent remarquablement les plantes et les animaux. Les Sao, eux, vivaient dans la plaine du Logone et du Chari, au sud du lac Tchad, jusque vers le XVIᵉ siècle : agriculteurs, éleveurs et pêcheurs, ils bâtissaient leurs villages sur des buttes pour échapper aux crues et maîtrisaient la poterie et le bronze à la cire perdue. Ce ne sont donc pas les mêmes peuples. Quant aux « géants », c'est une image de la tradition orale des peuples voisins ; les fouilles n'ont rien trouvé de tel. Les Kotoko d'aujourd'hui se disent leurs descendants. Les deux peuples méritent respect : ils sont à la racine de l'histoire du Cameroun.</p>",
      transfert: "<p>Explique en trois lignes pourquoi il ne faut pas employer « pygmée » comme une moquerie, et comment nommer ces peuples.</p>"
    },
    revision: (PS_OLD ? PS_OLD.revision : []).concat(["Cire perdue : modèle en cire, moule d'argile, cire fondue, bronze coulé, moule cassé."]),
    exo: PS_OLD ? PS_OLD.exo : "",
    quiz: PS_OLD ? PS_OLD.quiz : []
  });

  /* ═══════════════════════ 5e GÉOGRAPHIE — LA CROISSANCE DE LA POPULATION ═══════════════════════ */
  var CP_OLD = ancien("5e-geo-croissance-population");
  var PYR = [15.5, 14, 12.5, 11, 9.5, 8, 7, 5.5, 4.5, 3.5, 3, 2.2, 1.6, 1.1, 0.8, 0.7];
  function pyramide3D() {
    var o = [];
    o.push({ f: "boite", c: [0, -6, 0], d: [420, 6, 120], coul: "#C9B28A", dessus: "#E9DFCF" });
    PYR.forEach(function (p, i) { var w = p * 11; o.push({ f: "boite", c: [-w / 2 - 3, 7 + i * 14, 0], d: [w, 12, 40], coul: "#2F6DB5", dessus: "#4A90C2" }); o.push({ f: "boite", c: [w / 2 + 3, 7 + i * 14, 0], d: [w, 12, 40], coul: "#C2540A", dessus: "#E8A33D" }); });
    o.push({ f: "boite", c: [0, 112, 0], d: [2, 224, 2], coul: "#1F2328", div: false });
    return o;
  }
  remplacer("5e-geo-croissance-population", {
    c: "5e", m: "geo", titre: "La croissance rapide de la population mondiale", duree: 30,
    accroche: "112 élèves dans une classe de CM1 à Garoua. « C'est une mauvaise année, ça passera », dit un conseiller municipal. Et si c'était le début d'une tendance ?",
    intro: "Une classe surchargée d'une école publique de Garoua te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois explications.",
    objectifs: ["décrire l'évolution de la population mondiale et camerounaise", "calculer un taux d'accroissement naturel et l'exprimer en %", "lire une pyramide des âges", "expliquer causes et conséquences de la croissance"],
    enquete: {
      titre: "La classe de 112 élèves",
      svg: svg(640, 220, "Une salle de classe bondée : de nombreux élèves serrés sur des bancs, une maîtresse au tableau", lin("cpC", ["#F4EDE1", "#E6DAC4"], true),
        "<rect width='640' height='220' fill='url(#cpC)'/><rect x='30' y='20' width='170' height='90' fill='#2E4A3A' stroke='#6B4423' stroke-width='5'/>" + txt(115, 52, "Effectif : 112", { s: 15, c: "#F4F1EA" }) + txt(115, 76, "Places : 60", { s: 13, c: "#F4F1EA", w: 500 }) + txt(115, 98, "CM1 — Garoua", { s: 11, c: "#C9D2E3", w: 500 }) + perso(240, 70, "#5A3A1E", "#7B3F99", "#2E3445") +
        (function () { var s = "", r, c; for (r = 0; r < 4; r++) { s += "<rect x='" + (300 - r * 10) + "' y='" + (100 + r * 28) + "' width='" + (320 + r * 20) + "' height='8' fill='#8B5A2B'/>"; for (c = 0; c < 9 + r; c++) { var x = 312 - r * 10 + c * 34, y = 84 + r * 28; s += "<circle cx='" + x + "' cy='" + y + "' r='8' fill='" + ["#4A2E1A", "#5A3A1E", "#6B4423"][(r + c) % 3] + "'/><path d='M" + (x - 10) + " " + (y + 18) + "q10 -14 20 0Z' fill='" + (c % 2 ? "#DCE6F2" : "#F7F3EA") + "'/>"; } } return s; })()),
      legende: "À Garoua, dans le Nord : la classe de CM1 de l'école publique compte 112 élèves pour 60 places.",
      contexte: "<p>Au conseil municipal, un conseiller dit : « C'est une mauvaise année ; la population a toujours augmenté doucement, ça va se calmer. » Un autre calcule : « Natalité 36 ‰, mortalité 9 ‰ : l'accroissement est de 36 + 9 = 45 ‰. » Le maire demande à la délégation de l'Éducation de lui expliquer la situation et de prévoir l'avenir.</p>",
      documents: [{ t: "Les chiffres de la commune", html: "<table class='donnees'><tr><th>Indicateur</th><th>Valeur</th></tr><tr><td>Population</td><td>environ 400 000 habitants</td></tr><tr><td>Natalité</td><td>36 ‰</td></tr><tr><td>Mortalité</td><td>9 ‰</td></tr><tr><td>Moins de 15 ans</td><td>plus de 4 habitants sur 10</td></tr></table>" }],
      question: "La croissance de la population est-elle passagère, et à quel rythme la commune grandit-elle ?",
      tache: "Calcule l'accroissement naturel, explique ses causes et dis ce qu'il faut prévoir pour les écoles.",
      hypotheses: ["La population a toujours augmenté doucement : c'est passager.", "L'accroissement naturel est natalité + mortalité = 45 ‰.", "Mortalité en baisse, natalité élevée : 36 − 9 = 27 ‰ ≈ 2,7 % par an ; la population très jeune double en environ 26 ans : il faut planifier écoles et enseignants."]
    },
    parties: [
      { t: "Une croissance récente et rapide", html: partie(CP_OLD, 0),
        planches: [{ type: "2D", titre: "8 milliards en 2022", legende: "Il a fallu des millénaires pour atteindre 1 milliard d'humains (vers 1804) ; depuis 1950, on en ajoute un tous les 12 à 15 ans. La courbe se redresse brusquement au XXᵉ siècle : c'est l'« explosion démographique ».", svg: (function () {
          var D = [[1750, 0.79], [1804, 1], [1850, 1.26], [1900, 1.65], [1927, 2], [1950, 2.5], [1960, 3], [1974, 4], [1987, 5], [1999, 6], [2011, 7], [2022, 8]], X = function (a) { return 60 + (a - 1750) / 280 * 540; }, Y = function (v) { return 240 - v * 26; }, s = "<rect width='640' height='280' fill='#FBF8F2'/><path d='M60 20V240H610' stroke='" + NUIT + "' stroke-width='2' fill='none'/>", k;
          for (k = 0; k <= 8; k += 2) s += "<path d='M60 " + Y(k) + "H610' stroke='#E3E7EF'/>" + txt(52, Y(k) + 4, k + " Md", { s: 10, a: "end", c: GRIS, w: 600 });
          [1750, 1800, 1850, 1900, 1950, 2000].forEach(function (a) { s += txt(X(a), 258, String(a), { s: 10, c: GRIS, w: 600 }); });
          s += "<path d='" + D.map(function (d, i) { return (i ? "L" : "M") + X(d[0]).toFixed(1) + " " + Y(d[1]).toFixed(1); }).join("") + "' stroke='" + ROUGE + "' stroke-width='3.5' fill='none'/>";
          D.forEach(function (d) { if (d[1] >= 1 && d[1] % 1 === 0) s += "<circle cx='" + X(d[0]) + "' cy='" + Y(d[1]) + "' r='4.5' fill='" + ROUGE + "' stroke='#fff' stroke-width='1.5'/>" + txt(X(d[0]) - 8, Y(d[1]) - 6, String(d[0]), { s: 9, a: "end", c: NUIT, halo: true }); });
          s += "<rect x='90' y='40' width='200' height='56' rx='10' fill='#fff' stroke='#C9D2E3'/>" + txt(190, 62, "Cameroun", { s: 12, c: VERT }) + txt(190, 84, "≈ 5 M (1960) → ≈ 29 M (auj.)", { s: 11, w: 600 });
          return svg(640, 280, "Courbe de la population mondiale de 1750 à 2022, de 0,8 à 8 milliards, avec les années de chaque milliard", "", s);
        })() }],
        fil: { html: "<p>La courbe montre le contraire d'une croissance « douce » : il a fallu des millénaires pour atteindre 1 milliard d'habitants, mais seulement 11 ans pour passer de 7 à 8 milliards. Au Cameroun, la population a été multipliée par plus de cinq depuis l'indépendance. Ce n'est pas une mauvaise année : c'est une tendance de fond.</p>", verdicts: [[0, "rejetee", "La croissance est récente, rapide et durable."]] },
        retenir: "La population mondiale a plus que triplé depuis 1950." },
      { t: "Mesurer la croissance", html: partie(CP_OLD, 1),
        fil: { html: "<p>Les naissances <strong>ajoutent</strong> des habitants, les décès en <strong>retirent</strong> : on soustrait. 36 − 9 = <strong>27 ‰</strong>, soit 2,7 % par an. Additionner la mortalité n'a pas de sens : plus de décès ne peut pas faire grandir la population. À 2,7 % par an, la population double en environ 70 ÷ 2,7 ≈ 26 ans (simulation ci-dessus).</p>", verdicts: [[1, "rejetee", "Accroissement naturel = natalité − mortalité = 27 ‰."]] },
        retenir: "Accroissement naturel = natalité − mortalité ; ‰ ÷ 10 = %." },
      { t: "Causes et conséquences", html: partie(CP_OLD, 2),
        planches: [{ type: "3d", titre: "La pyramide des âges du Cameroun", legende: "Tourne la pyramide : chaque étage est une tranche de 5 ans (de 0-4 ans en bas à 75 ans et plus en haut), hommes en bleu à gauche, femmes en orange à droite. La base très large montre une population très jeune : plus de 4 habitants sur 10 ont moins de 15 ans. Ordres de grandeur.",
          modele: { h: 360, rx: -12, ry: 26, echelle: 0.85, alt: "Pyramide des âges en barres empilées, très large à la base et étroite au sommet, hommes en bleu et femmes en orange", objets: pyramide3D(),
            etiquettes: [{ p: [-90, 7, -20], t: "0-4 ans : la base la plus large", cote: "g" }, { p: [10, 217, -20], t: "75 ans et plus", cote: "d" }, { p: [70, 63, -20], t: "femmes", cote: "d" }, { p: [-70, 63, -20], t: "hommes", cote: "g" }] } }],
        fil: { html: "<p>Grâce aux vaccins, à l'eau potable et aux soins, la <strong>mortalité a baissé</strong>, surtout celle des enfants, alors que la <strong>natalité reste élevée</strong>. La pyramide en forme de triangle à base large le montre : chaque année, plus d'enfants arrivent à l'âge d'aller à l'école. Il faut donc planifier salles, tables-bancs et enseignants pour les années à venir.</p>", verdicts: [[2, "validee", "27 ‰, doublement en ≈ 26 ans, population jeune : planifier."]] },
        retenir: "La mortalité baisse plus vite que la natalité : la population augmente." },
      CP_OLD && CP_OLD.parties[3] ? CP_OLD.parties[3] : { t: "Entraînement", html: "" }
    ],
    denouement: {
      titre: "Le rapport au maire",
      etapes: ["Croissance récente et durable (indice 1).", "36 − 9 = 27 ‰ = 2,7 % par an (indice 2).", "Pyramide jeune : plus d'élèves chaque année (indice 3)."],
      reponse: "<p>La classe de 112 élèves n'est pas un accident. La population mondiale est passée de 2,5 milliards en 1950 à plus de 8 milliards en 2022, et celle du Cameroun d'environ 5 à près de 29 millions depuis 1960. Dans la commune, l'accroissement naturel vaut natalité − mortalité = 36 − 9 = 27 ‰, soit 2,7 % par an (et non 45 ‰ : les décès se retranchent). À ce rythme, la population double en environ 26 ans. La cause : la mortalité a baissé grâce aux progrès de la santé, tandis que la natalité reste élevée ; la population est donc très jeune, avec plus de 4 habitants sur 10 de moins de 15 ans. Il faut construire des salles, recruter des enseignants et, en attendant, organiser des cours en double flux ; à plus long terme, l'éducation des filles et la santé familiale aident à mieux espacer les naissances.</p>",
      transfert: "<p>Une ville a 30 ‰ de natalité et 10 ‰ de mortalité. Calcule son accroissement naturel et son temps de doublement approximatif. <em>(20 ‰ = 2 % ; 70 ÷ 2 = 35 ans.)</em></p>"
    },
    revision: (CP_OLD ? CP_OLD.revision : []).concat(["Temps de doublement ≈ 70 ÷ (taux en %)."]),
    exo: CP_OLD ? CP_OLD.exo : "",
    quiz: CP_OLD ? CP_OLD.quiz : []
  });

  /* ═══════════════════════ 4e GREC — L'ALPHABET GREC ═══════════════════════ */
  var GA_OLD = ancien("4e-gr-alphabet");
  var TRAITS = {
    "Α": [[0, 0, 15, 40], [15, 40, 30, 0], [7, 16, 23, 16]], "Η": [[0, 0, 0, 40], [30, 0, 30, 40], [0, 20, 30, 20]], "Ν": [[0, 0, 0, 40], [0, 40, 30, 0], [30, 0, 30, 40]], "Θ": "o", "Ρ": [[0, 0, 0, 40], [0, 40, 22, 40], [22, 40, 28, 33], [28, 33, 28, 27], [28, 27, 22, 20], [22, 20, 0, 20]]
  };
  function stele3D() {
    var o = [];
    o.push({ f: "boite", c: [0, -110, 0], d: [380, 20, 140], coul: "#8C8577", dessus: "#A39D90" });
    o.push({ f: "boite", c: [0, 10, 0], d: [320, 220, 34], coul: "#E7E1D4", dessus: "#F2EEE4" });
    o.push({ f: "boite", c: [0, 126, 0], d: [340, 14, 40], coul: "#D8D1C2", dessus: "#E7E1D4" });
    function point(x, y) { o.push({ f: "sphere", c: [x, y, -17.5], r: 2.4, coul: "#5C564C" }); }
    function mot(m, x0, y0, s) {
      m.split("").forEach(function (L, i) {
        var bx = x0 + i * 46 * s, T = TRAITS[L];
        if (T === "o") { var k; for (k = 0; k < 28; k++) { var a = k / 28 * 6.283; point(bx + (15 + 14 * Math.cos(a)) * s, y0 + (20 + 20 * Math.sin(a)) * s); } T = [[8, 20, 22, 20]]; }
        T.forEach(function (t) { var L2 = Math.hypot(t[2] - t[0], t[3] - t[1]), n = Math.max(2, Math.round(L2 / 3.4)), k; for (k = 0; k <= n; k++) point(bx + (t[0] + (t[2] - t[0]) * k / n) * s, y0 + (t[1] + (t[3] - t[1]) * k / n) * s); });
      });
    }
    mot("ΑΘΗΝΑ", -110, 30, 1);
    return o;
  }
  remplacer("4e-gr-alphabet", {
    c: "4e", m: "grec", titre: "L'alphabet grec : écriture et prononciation", duree: 30,
    accroche: "Sur la carte postale de son oncle, Nadia lit « A-T-H-H-N-A ». Son frère y voit « ATHENA ». Les lettres grecques se lisent-elles comme les nôtres ?",
    intro: "Une carte postale envoyée d'Athènes à une élève de Douala te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois affirmations.",
    objectifs: ["expliquer l'origine phénicienne de l'alphabet grec et l'invention des voyelles", "lire et transcrire les 24 lettres", "éviter les faux amis Η, Ρ, Χ", "reconnaître des racines grecques dans des mots français"],
    enquete: {
      titre: "La carte postale d'Athènes",
      svg: svg(640, 220, "Une carte postale montrant un temple grec et le mot ΑΘΗΝΑ ; une élève perplexe la tient", lin("gaC", ["#BFE0F7", "#EAF4FB"], true),
        "<rect width='640' height='220' fill='#F4F1EA'/><g transform='rotate(-3 250 110)'><rect x='90' y='24' width='320' height='180' rx='6' fill='url(#gaC)' stroke='#C9D2E3' stroke-width='3'/><rect x='90' y='150' width='320' height='54' fill='#C9B28A'/>" +
        "<path d='M160 70L250 44L340 70Z' fill='#EDE7DA' stroke='#B8AE9C'/><rect x='160' y='70' width='180' height='10' fill='#E2DACB'/>" + [0, 1, 2, 3, 4, 5].map(function (k) { return "<rect x='" + (168 + k * 31) + "' y='80' width='12' height='62' fill='#F2EEE4' stroke='#C9C0AE'/>"; }).join("") + "<rect x='152' y='142' width='196' height='10' fill='#D8D1C2'/>" +
        txt(250, 186, "ΑΘΗΝΑ", { s: 28, c: "#1E499B" }) + "</g>" + perso(500, 96, "#5A3A1E", "#C62828", "#2E3445") + bulle(420, 22, 200, "A-T-H-H-N-A ?", "#F7C948") + txt(470, 205, "ΠΛΑΚΑ · ΑΚΡΟΠΟΛΙΣ", { s: 11, c: GRIS })),
      legende: "À Douala, Nadia (4e) reçoit une carte postale de son oncle, en voyage à Athènes.",
      contexte: "<p>Nadia lit « ΑΘΗΝΑ » lettre par lettre en croyant reconnaître notre alphabet : « A, T, H, H, N, A. » Son frère hésite : « Le Η ressemble à un H, le Ρ de ΑΚΡΟΠΟΛΙΣ à un P, et le Χ à un X. » Leur cousine, en 3e, ajoute : « De toute façon, le grec, ça n'a rien à voir avec le français. »</p>",
      documents: [{ t: "Au dos de la carte", html: "<p>« Χαῖρε, Nadia ! (Bonjour !) Je suis à ΑΘΗΝΑ, au pied de l'ΑΚΡΟΠΟΛΙΣ. Ton oncle qui t'embrasse. »</p>" }],
      question: "Comment se lisent ΑΘΗΝΑ et ΑΚΡΟΠΟΛΙΣ, et le grec a-t-il un lien avec le français ?",
      tache: "Transcris les deux mots en lettres latines, explique les pièges de lecture et montre un lien entre le grec et notre langue.",
      hypotheses: ["Les lettres grecques se lisent comme les lettres latines qui leur ressemblent : Η = h, Ρ = p, Χ = x.", "Le grec n'a rien à voir avec le français.", "Η se lit ê, Ρ se lit r, Χ se lit kh, Θ se lit th : ΑΘΗΝΑ = Athêna, ΑΚΡΟΠΟΛΙΣ = Akropolis ; notre alphabet et beaucoup de nos mots viennent du grec."]
    },
    parties: [
      { t: "D'où vient l'alphabet grec ?", html: partie(GA_OLD, 0),
        planches: [{ type: "2D", titre: "Du phénicien au français", legende: "Les Phéniciens notaient seulement les consonnes. Les Grecs ont repris leurs signes, les ont retournés ou redressés, et ont transformé certains en voyelles (aleph → alpha). Les Romains ont adapté l'alphabet grec, et nous écrivons avec l'alphabet latin.", svg: (function () {
          var C = [["aleph", "<path d='M-12 -14L12 -2L-12 10M-4 -16L4 14' stroke='#7A1F1F' stroke-width='3' fill='none'/>", "Α", "alpha", "A"], ["beth", "<path d='M8 14V-14H-6L-10 -4L8 -2' stroke='#7A1F1F' stroke-width='3' fill='none'/>", "Β", "bêta", "B"], ["gimel", "<path d='M-6 14L4 -14L10 -6' stroke='#7A1F1F' stroke-width='3' fill='none'/>", "Γ", "gamma", "C, G"], ["daleth", "<path d='M8 -14L-10 0L8 6Z' stroke='#7A1F1F' stroke-width='3' fill='none'/>", "Δ", "delta", "D"]], s = "<rect width='640' height='260' fill='#FBF8F2'/>";
          s += txt(110, 30, "Phénicien", { s: 13, c: "#7A1F1F" }) + txt(110, 46, "(vers 1050 av. J.-C.)", { s: 10, c: GRIS, w: 500 }) + txt(320, 30, "Grec", { s: 13, c: BLEU }) + txt(320, 46, "(VIIIᵉ s. av. J.-C.)", { s: 10, c: GRIS, w: 500 }) + txt(530, 30, "Latin / français", { s: 13, c: VERT }) + txt(530, 46, "(Rome, puis nous)", { s: 10, c: GRIS, w: 500 });
          C.forEach(function (c, i) { var y = 80 + i * 46; s += "<rect x='70' y='" + (y - 20) + "' width='80' height='40' rx='8' fill='#F2E6D6'/><g transform='translate(92 " + y + ")'>" + c[1] + "</g>" + txt(130, y + 5, c[0], { s: 10, c: "#7A1F1F", w: 600, a: "start" }) + "<path d='M156 " + y + "H254' stroke='#C9D2E3' stroke-width='3' marker-end='url(#gaF)'/><rect x='262' y='" + (y - 20) + "' width='116' height='40' rx='8' fill='#DCE6F2'/>" + txt(290, y + 8, c[2], { s: 22, c: BLEU }) + txt(312, y + 5, c[3], { s: 11, c: BLEU, a: "start", w: 600 }) + "<path d='M384 " + y + "H482' stroke='#C9D2E3' stroke-width='3' marker-end='url(#gaF)'/><rect x='490' y='" + (y - 20) + "' width='80' height='40' rx='8' fill='#DDEFE3'/>" + txt(530, y + 8, c[4], { s: 22, c: VERT }); });
          s += "<rect x='262' y='238' width='116' height='18' rx='6' fill='" + BLEU + "'/>" + txt(320, 251, "+ les voyelles !", { s: 11, c: "#fff" });
          return svg(640, 260, "Quatre lettres phéniciennes aleph, beth, gimel, daleth, devenues alpha, bêta, gamma, delta puis A, B, C, D", fleche("gaF", "#9AA3AF"), s);
        })() }],
        fil: { html: "<p>Notre alphabet descend directement de l'alphabet grec, par l'intermédiaire du latin : A vient de alpha, B de bêta, D de delta. Le mot « alphabet » lui-même est grec. Et des milliers de mots français sont formés de racines grecques (téléphone, géographie, biologie). Le grec a donc beaucoup à voir avec le français.</p>", verdicts: [[1, "rejetee", "Notre alphabet et beaucoup de nos mots viennent du grec."]] },
        retenir: "Phénicien → grec (avec les voyelles) → latin → français." },
      { t: "Les 24 lettres", html: partie(GA_OLD, 1),
        planches: [{ type: "3d", titre: "Une stèle gravée : ΑΘΗΝΑ", legende: "Tourne la stèle de marbre : le nom de la ville est gravé en capitales grecques, point par point, comme le faisaient les tailleurs de pierre. Lis-le lettre à lettre : alpha (a), thêta (th), êta (ê), nu (n), alpha (a) : Athêna.",
          modele: { h: 340, rx: -10, ry: 24, echelle: 0.8, alt: "Stèle de marbre blanc posée sur un socle, avec le mot ΑΘΗΝΑ gravé en points", objets: stele3D(),
            etiquettes: [{ p: [-49, 50, -18], t: "Θ = th", cote: "g" }, { p: [-3, 50, -18], t: "Η = ê (pas h !)", cote: "d" }, { p: [43, 50, -18], t: "Ν = n", cote: "d" }] } }],
        fil: { html: "<p>Certaines capitales grecques ressemblent à nos lettres mais ne se lisent pas pareil : <strong>Η</strong> est un êta (ê long), <strong>Ρ</strong> un rhô (r), <strong>Χ</strong> un khi (kh), <strong>Ν</strong> un nu (n). ΑΘΗΝΑ se lit donc « Athêna », et ΑΚΡΟΠΟΛΙΣ « Akropolis ». Se fier à la ressemblance, c'est tomber dans le piège des faux amis.</p>", verdicts: [[0, "rejetee", "Faux amis : Η = ê, Ρ = r, Χ = kh."]] },
        retenir: "24 lettres ; η = ê, ρ = r, χ = kh ; σ devient ς en fin de mot." },
      { t: "Le grec dans nos mots", html: partie(GA_OLD, 2),
        planches: [{ type: "2D", titre: "L'atelier des racines", legende: "Deux racines grecques s'assemblent pour former un mot français savant : ἀκρο- (le haut) + πόλις (la cité) donnent « acropole », la ville haute. Le même jeu fabrique géographie, biologie, téléphone, démocratie.", svg: (function () {
          var R = [["ἄκρος", "akros", "haut", "πόλις", "polis", "cité", "acropole"], ["γῆ", "gê", "terre", "γράφω", "graphô", "écrire", "géographie"], ["βίος", "bios", "vie", "λόγος", "logos", "étude", "biologie"], ["τῆλε", "têle", "loin", "φωνή", "phônê", "voix", "téléphone"]], s = "<rect width='640' height='260' fill='#FBF8F2'/>";
          R.forEach(function (r, i) { var y = 20 + i * 60; s += bloc(30, y, 150, 46, BLEU, r[0] + " · " + r[1], r[2]) + txt(198, y + 30, "+", { s: 22 }) + bloc(214, y, 150, 46, "#7B3F99", r[3] + " · " + r[4], r[5]) + "<path d='M372 " + (y + 23) + "H418' stroke='" + NUIT + "' stroke-width='3' marker-end='url(#gaF2)'/><rect x='426' y='" + y + "' width='190' height='46' rx='10' fill='#fff' stroke='" + VERT + "' stroke-width='2'/>" + txt(521, y + 29, r[6], { s: 16, c: VERT }); });
          return svg(640, 260, "Quatre assemblages de racines grecques : acropole, géographie, biologie, téléphone", fleche("gaF2", NUIT), s);
        })() }],
        fil: { html: "<p>Nadia peut maintenant tout relire : ΑΘΗΝΑ = Athêna, la ville d'Athéna ; ΑΚΡΟΠΟΛΙΣ = Akropolis, de ἄκρος (haut) et πόλις (cité) : la « ville haute ». Et le français en a tiré « acropole », comme « politique » (de πόλις). Lire le grec, c'est mieux comprendre sa propre langue.</p>", verdicts: [[2, "validee", "Bonne lecture des faux amis et racines grecques du français."]] },
        retenir: "Beaucoup de mots savants du français sont faits de racines grecques." }
    ],
    denouement: {
      titre: "Nadia déchiffre sa carte",
      etapes: ["Notre alphabet vient du grec (indice 1).", "Faux amis : Η = ê, Ρ = r, Χ = kh (indice 2).", "Racines : ἄκρος + πόλις = acropole (indice 3)."],
      reponse: "<p>Il ne faut pas lire les lettres grecques d'après leur ressemblance avec les nôtres. Dans ΑΘΗΝΑ, Θ (thêta) se lit « th » et Η (êta) se lit « ê » : le mot se transcrit Athêna, le nom de la ville d'Athènes et de sa déesse. Dans ΑΚΡΟΠΟΛΙΣ, Ρ (rhô) se lit « r » et Σ (sigma) « s » : Akropolis. Le Χ de Χαῖρε se lit « kh » : khaïré, « bonjour ». Le grec n'est pas étranger au français : les Grecs ont adapté l'alphabet phénicien en y ajoutant les voyelles, les Romains l'ont repris, et nous écrivons avec cet héritage ; de plus, « acropole » vient de ἄκρος (haut) et πόλις (cité), comme « politique » ou « métropole ».</p>",
      transfert: "<p>Transcris : ΔΗΜΟΚΡΑΤΙΑ et ΦΩΤΟΓΡΑΦΙΑ, puis donne le mot français. <em>(dêmokratia → démocratie ; phôtographia → photographie.)</em></p>"
    },
    revision: (GA_OLD ? GA_OLD.revision : []).concat(["Faux amis : Η (ê), Ρ (r), Χ (kh), Ν (n)."]),
    exo: GA_OLD ? GA_OLD.exo : "",
    quiz: [
      q("Combien de lettres compte l'alphabet grec ?", "24", "26", "22", "D'alpha à oméga."),
      q("La lettre Η (êta) se lit…", "ê", "h", "n", "Un e long ; faux ami du H."),
      q("La lettre Ρ (rhô) se lit…", "r", "p", "b", "Faux ami du P."),
      q("La lettre Χ (khi) se lit…", "kh", "x", "ks", "Le son ks est noté par ξ (xi)."),
      q("ΑΘΗΝΑ se transcrit…", "Athêna", "Athhna", "Atena", "Θ = th, Η = ê."),
      q("Les Grecs ont ajouté à l'alphabet phénicien…", "les voyelles", "les consonnes", "les chiffres", "Le phénicien ne notait que les consonnes."),
      q("Le sigma final s'écrit…", "ς", "σ", "Σ", "Comme dans λόγος."),
      q("« Philosophie » signifie…", "amour de la sagesse", "étude de la Terre", "écriture de la vie", "philos (ami) + sophia (sagesse)."),
      q("ἄκρος + πόλις a donné…", "acropole", "métropole", "politesse", "La ville haute."),
      q("Le mot « alphabet » vient…", "des deux premières lettres grecques", "d'un mot latin signifiant « lettre »", "du phénicien « aleph » seul", "Alpha + bêta.")
    ]
  });

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  VRT_A("5e-francais-subordonnee-relative", 1, "Qui, que, dont ou où ? Complète la lettre", function (el) {
    exercice(el, [["Le chef ___ je t'ai parlé habite la chefferie.", ["dont", "que", "où"], "Je t'ai parlé du chef : « de… » → dont."], ["Le marché ___ les femmes vont ouvre le samedi.", ["où", "que", "dont"], "Les femmes vont au marché : lieu → où."], ["Mon village, ___ s'appelle Bandjoun, est sur une colline.", ["qui", "que", "dont"], "Le village s'appelle… : sujet → qui."], ["Les masques ___ nous portons sont célèbres.", ["que", "qui", "où"], "Nous portons les masques : COD → que."], ["Le jour ___ je suis né, il pleuvait.", ["où", "que", "dont"], "Temps → où."], ["Le pagne ___ ma mère est fière vient de Foumban.", ["dont", "que", "où"], "Elle est fière du pagne → dont."], ["Le griot ___ chante ce soir vient de Foumban.", ["qui", "que", "dont"], "Le griot chante : sujet → qui."], ["La rivière ___ nous nous baignons est fraîche.", ["où", "que", "qui"], "Nous nous baignons dans la rivière : lieu → où."]], "Phrase suivante", "Phrase");
  });
  VRT_A("5e-histoire-pygmees-sao", 1, "Coule une statuette de bronze à la cire perdue", function (el) {
    var i = 0;
    el.innerHTML = "<div data-g></div><p class='labo-r' data-r></p><div style='display:flex;gap:8px;flex-wrap:wrap'><button type='button' class='btn-l' data-av>Étape suivante ▶</button><button type='button' class='btn-l' data-ra>↺ Recommencer</button></div>";
    function maj() {
      var s = "<rect width='470' height='170' fill='#F4EDE1'/><rect y='140' width='470' height='30' fill='#8B6B4A'/>";
      CIRE.forEach(function (c, k) { s += "<rect x='" + (12 + k * 92) + "' y='148' width='80' height='14' rx='7' fill='" + (k <= i ? "#B87333" : "#D8CFC0") + "'/>"; });
      s += "<g transform='translate(235 76)'>" + CIRE[i][2]() + "</g>";
      el.querySelector("[data-g]").innerHTML = "<svg viewBox='0 0 470 170' style='max-width:520px;width:100%' role='img' aria-label='Étape de la fonte du bronze à la cire perdue'>" + s + "</svg>";
      el.querySelector("[data-r]").innerHTML = "<b>" + CIRE[i][0] + "</b> — " + CIRE[i][1];
      el.querySelector("[data-av]").disabled = i === CIRE.length - 1;
    }
    el.querySelector("[data-av]").addEventListener("click", function () { if (i < CIRE.length - 1) { i++; maj(); } });
    el.querySelector("[data-ra]").addEventListener("click", function () { i = 0; maj(); });
    maj();
  });
  VRT_A("5e-geo-croissance-population", 1, "Règle natalité et mortalité, observe la population grandir", function (el) {
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:8px 18px'><label class='labo-c'><span>Natalité : <b data-nv>36</b> ‰</span><input type='range' min='8' max='50' value='36' data-n></label><label class='labo-c'><span>Mortalité : <b data-mv>9</b> ‰</span><input type='range' min='5' max='30' value='9' data-m></label></div><div data-g style='margin-top:8px'></div><p class='labo-r' data-r></p>";
    var N = el.querySelector("[data-n]"), M = el.querySelector("[data-m]"), P0 = 400000;
    function maj() {
      var n = +N.value, m = +M.value, t = (n - m) / 1000, s = "<rect width='470' height='190' fill='#FBF8F2'/><path d='M50 15V160H455' stroke='" + NUIT + "' stroke-width='2' fill='none'/>", k, d = "", Pmax = 1600000;
      el.querySelector("[data-nv]").textContent = n; el.querySelector("[data-mv]").textContent = m;
      [400000, 800000, 1200000, 1600000].forEach(function (v) { var y = 160 - v / Pmax * 140; s += "<path d='M50 " + y + "H455' stroke='#E3E7EF'/>" + txt(46, y + 4, (v / 1000) + " k", { s: 9, a: "end", c: GRIS, w: 600 }); });
      for (k = 0; k <= 50; k += 10) s += txt(50 + k * 8, 176, (2026 + k) + "", { s: 9, c: GRIS, w: 600 });
      for (k = 0; k <= 50; k++) { var P = P0 * Math.pow(1 + t, k); d += (k ? "L" : "M") + (50 + k * 8) + " " + Math.max(10, 160 - P / Pmax * 140).toFixed(1); }
      s += "<path d='" + d + "' stroke='" + (t > 0 ? ROUGE : VERT) + "' stroke-width='3' fill='none'/>";
      el.querySelector("[data-g]").innerHTML = "<svg viewBox='0 0 470 190' style='max-width:520px;width:100%' role='img' aria-label='Projection de la population de la commune sur 50 ans'>" + s + "</svg>";
      var P20 = Math.round(P0 * Math.pow(1 + t, 20) / 1000) * 1000;
      el.querySelector("[data-r]").innerHTML = "Accroissement naturel = " + n + " − " + m + " = <b>" + (n - m) + " ‰</b> = <b>" + String((n - m) / 10).replace(".", ",") + " %</b> par an · " + (t > 0 ? "doublement en ≈ <b>" + Math.round(Math.log(2) / Math.log(1 + t)) + " ans</b> · " : t < 0 ? "la population diminue · " : "population stable · ") + "dans 20 ans : <b>" + P20.toLocaleString("fr-FR") + "</b> habitants";
    }
    N.addEventListener("input", maj); M.addEventListener("input", maj); maj();
  });
  VRT_A("4e-gr-alphabet", 1, "Lis les mots grecs : choisis la bonne transcription", function (el) {
    exercice(el, [["ΑΘΗΝΑ se lit… ___", ["Athêna", "Athhna", "Atena"], "Θ = th, Η = ê."], ["ΑΚΡΟΠΟΛΙΣ se lit… ___", ["Akropolis", "Akpopolis", "Akropolix"], "Ρ = r, Σ = s."], ["Χαῖρε (bonjour) se lit… ___", ["khaïré", "xaïpé", "kaïré"], "Χ = kh, ρ = r."], ["ΦΩΣ (lumière) se lit… ___", ["phôs", "fos", "pôs"], "Φ = ph, Ω = ô long, Σ = s."], ["ΨΥΧΗ (âme) se lit… ___", ["psukhê", "puxh", "psikh"], "Ψ = ps, Υ = u, Χ = kh, Η = ê."], ["ΛΟΓΟΣ (parole) se lit… ___", ["logos", "loyos", "lorox"], "Γ = g dur, Σ = s."], ["ΒΙΟΣ (vie) se lit… ___", ["bios", "biox", "vios"], "Β = b."], ["ΔΗΜΟΣ (peuple) se lit… ___", ["dêmos", "dhmos", "demox"], "Δ = d, Η = ê."]], "Mot suivant", "Mot");
  });
})();
