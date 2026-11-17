/* Leçons APPROFONDIES — lot 9, classe d'examen de 3e (17/11/2026) : articles (anglais), verbes faibles (allemand),
   la famille (espagnol), Ésope et Homère (grec). Même gabarit et même mécanisme que 11-approfondies-lot4.js
   (remplacement EN PLACE ; ordre, clé, fiche APC, examen et scènes conservés). Les classes de 6e, 5e et 4e sont
   traitées par une autre session (16-approfondies-premier-cycle.js). Simulations VRT_A en fin de fichier. */
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

  /* ═══════════════════════ 3e ANGLAIS — A, AN, THE ═══════════════════════ */
  var AR_OLD = ancien("3e-en-articles");
  function kribi3D() {
    var o = [], k;
    o.push({ f: "boite", c: [0, -14, 40], d: [600, 8, 260], coul: "#2F6DB5", dessus: "#3E87D1" });
    o.push({ f: "boite", c: [0, -8, -90], d: [600, 10, 120], coul: "#D9C08A", dessus: "#EAD7A6" });
    o.push({ f: "sphere", c: [200, 170, 160], r: 34, coul: "#FFD54A" });
    /* pirogue : coque en bois effilée */
    o.push({ f: "poly", pts: [[-160, -4, 40], [-60, -4, 52], [40, -4, 40], [-60, -4, 28]], coul: "#5D3A1E" });
    o.push({ f: "poly", pts: [[-160, -4, 40], [-60, 14, 54], [40, -4, 40], [-60, -4, 52]], coul: "#7A4A22" });
    o.push({ f: "poly", pts: [[-160, -4, 40], [-60, 14, 26], [40, -4, 40], [-60, -4, 28]], coul: "#8B5A2B" });
    o.push({ f: "cylindre", c: [-70, 6, 40], r: 1.5, h: 70, n: 6, coul: "#5D3A1E" });
    o.push({ f: "poly", pts: [[-68, 20, 40], [-68, 74, 40], [-20, 24, 40]], coul: "#F4EFE4" });
    /* cocotiers */
    [[-220, -110], [-120, -130], [150, -120], [240, -100]].forEach(function (p, i) {
      for (k = 0; k < 8; k++) o.push({ f: "cylindre", c: [p[0] + k * (i % 2 ? 2 : -2), -4 + k * 14, p[1]], r: 5 - k * 0.3, h: 14, n: 8, coul: "#8B6B4A" });
      [[30, 0], [-30, 0], [0, 30], [0, -30], [22, 22], [-22, -22]].forEach(function (d) { o.push({ f: "poly", pts: [[p[0] + (i % 2 ? 16 : -16), 110, p[1]], [p[0] + (i % 2 ? 16 : -16) + d[0] * 2, 86, p[1] + d[1] * 2], [p[0] + (i % 2 ? 16 : -16) + d[0] * 1.6 + 6, 96, p[1] + d[1] * 1.6 + 6]], coul: "#2E7D32" }); });
    });
    /* les chutes de la Lobé : rochers et eau blanche */
    for (k = 0; k < 5; k++) o.push({ f: "sphere", c: [-260 + k * 18, 2 + (k % 2) * 10, -40], r: 16, coul: "#6E6A66" });
    o.push({ f: "poly", pts: [[-280, 30, -30], [-180, 30, -30], [-180, -4, -10], [-280, -4, -10]], coul: "#EAF6FB", op: 0.85 });
    return o;
  }
  remplacer("3e-en-articles", {
    c: "3e", m: "anglais", titre: "Definite and indefinite articles: a, an, the", duree: 30,
    accroche: "« A sun is hot in the Cameroon » : Brenda's tourist leaflet about Kribi needs your help before the visitors arrive.",
    intro: "A tourist leaflet about Kribi is your guiding thread: in each part, a clue helps you choose between three rules.",
    objectifs: ["choose a or an according to the first sound", "use the for known or unique things, rivers, oceans and superlatives", "use no article with general plurals, countries, cities and languages", "avoid the French « le / la / les » reflex"],
    enquete: {
      titre: "Brenda's leaflet for the visitors of Kribi",
      svg: svg(640, 230, "Dépliant touristique en anglais sur Kribi avec des fautes d articles, à côté d une plage avec une pirogue et des cocotiers", lin("krs", ["#9FD4F2", "#E9F5FB"], true), "<rect width='640' height='230' fill='url(#krs)'/><rect y='150' width='640' height='80' fill='#2F6DB5'/><path d='M0 150C200 140 420 160 640 146V158H0Z' fill='#EAD7A6'/><circle cx='560' cy='50' r='26' fill='#FFD54A'/><path d='M420 168l60 6l40 -6l-50 -4Z' fill='#5D3A1E'/><path d='M466 166v-38l26 34Z' fill='#F4EFE4'/>" + "<g transform='rotate(-3 160 115)'><rect x='30' y='20' width='270' height='190' rx='6' fill='#fff' stroke='#D9CFBC'/>" + txt(46, 46, "VISIT KRIBI!", { s: 15, a: "start", c: TERRE }) + ["A sun is hot in the Cameroon.", "Swim in Atlantic Ocean.", "Visit an university and a Lobé Falls.", "Tourists love the mangoes."].map(function (l, i) { return txt(46, 80 + i * 28, "• " + l, { s: 12, a: "start", w: 500, i: true }); }).join("") + "</g>"),
      legende: "At Kribi: Brenda's family runs a small guesthouse near the Lobé Falls; English-speaking visitors are coming from Nigeria.",
      contexte: "<p>Brenda writes a leaflet for the visitors: « <em>A sun</em> is hot in <em>the Cameroon</em>. Swim in <em>Atlantic Ocean</em>. Visit <em>an university</em> and <em>a Lobé Falls</em>. Tourists love <em>the mangoes</em>. » Her brother says: « Put “the” everywhere, like “le, la, les” in French. » Her friend says: « Use “an” before every word that starts with a vowel letter. »</p>",
      documents: [{ t: "Three questions to ask", html: "<ol><li>Is the noun singular and countable, mentioned for the first time? → <strong>a / an</strong> (choose by the first <strong>sound</strong>).</li><li>Do we know which one, or is it unique? → <strong>the</strong>.</li><li>Is it a plural or an uncountable noun in general, a country, a city, a language? → <strong>no article (Ø)</strong>.</li></ol>" }],
      question: "Which article does each noun of the leaflet need?",
      tache: "Correct the five mistakes of the leaflet and justify each correction with one of the three questions.",
      hypotheses: ["Put « the » everywhere, like « le / la / les » in French.", "Use « an » before every word that starts with a vowel letter.", "Choose a / an by the first sound, « the » for known or unique things, and no article for general plurals and countries."]
    },
    parties: [
      { t: "A or an?", html: partie(AR_OLD, 0),
        planches: [{ type: "2D", titre: "It's the sound that counts", legende: "A university (« you- » sound), an hour (silent h), an egg, a European (« you- »), an orange, a mango: a before a consonant sound, an before a vowel sound.", svg: (function () {
          var I = [["a", "university", "« you- »"], ["an", "hour", "h silent"], ["an", "egg", "vowel sound"], ["a", "mango", "consonant"], ["an", "orange", "vowel sound"], ["a", "European", "« you- »"]], s = "";
          I.forEach(function (it, i) {
            var x = 20 + (i % 3) * 205, y = 20 + Math.floor(i / 3) * 140, c = it[0] === "an" ? "#C2540A" : BLEU;
            s += "<rect x='" + x + "' y='" + y + "' width='190' height='124' rx='14' fill='#F7F9FC' stroke='#E3E8F1'/><g transform='translate(" + (x + 50) + " " + (y + 62) + ")'>";
            if (it[1] === "university") s += "<rect x='-34' y='-20' width='68' height='44' fill='#E9E2D2' stroke='#8A6E4B'/><path d='M-40 -20L0 -42L40 -20Z' fill='#B33A2C'/><rect x='-24' y='-8' width='8' height='32' fill='#C9C1B2'/><rect x='-4' y='-8' width='8' height='32' fill='#C9C1B2'/><rect x='16' y='-8' width='8' height='32' fill='#C9C1B2'/>";
            else if (it[1] === "hour") s += "<circle r='34' fill='#FBF8F2' stroke='#5C6478' stroke-width='5'/><path d='M0 0V-22M0 0L16 8' stroke='#1F2328' stroke-width='4' stroke-linecap='round'/>";
            else if (it[1] === "egg") s += "<ellipse rx='24' ry='31' fill='url(#arEgg)'/>";
            else if (it[1] === "mango") s += "<ellipse rx='32' ry='24' fill='url(#arMg)' transform='rotate(-20)'/><path d='M24 -14q8 -10 16 -8' stroke='#5B3A12' stroke-width='3' fill='none'/>";
            else if (it[1] === "orange") s += "<circle r='30' fill='url(#arOr)'/><path d='M0 -30q6 -10 14 -8' stroke='#2E7D32' stroke-width='4' fill='none'/>";
            else s += "<circle r='30' fill='#003399'/>" + Array.apply(null, Array(12)).map(function (_, k) { var a = k / 12 * 2 * Math.PI; return "<text x='" + (19 * Math.cos(a)).toFixed(1) + "' y='" + (19 * Math.sin(a) + 4).toFixed(1) + "' font-size='10' text-anchor='middle' fill='#FFCC00'>★</text>"; }).join("");
            s += "</g>" + txt(x + 140, y + 56, it[0], { s: 26, c: c }) + txt(x + 140, y + 80, it[1], { s: 14 }) + txt(x + 140, y + 100, it[2], { s: 10.5, w: 500, c: GRIS });
          });
          return svg(640, 300, "Six images avec leur article : a university, an hour, an egg, a mango, an orange, a European", rad("arEgg", ["#FFFFFF", "#F4EBDD", "#D9C7A8"]) + rad("arMg", ["#FFE07A", "#F7B32B", "#E07A1F", "#7A9A2E"]) + rad("arOr", ["#FFD08A", "#F59A23", "#D96E00"]), s);
        })() }],
        fil: { html: "<p>« University » commence par une voyelle écrite mais par le <strong>son</strong> « you- », une consonne : on écrit <strong>a university</strong>. La règle de la lettre est fausse ; c'est le son qui compte.</p>", verdicts: [[1, "rejetee", "A university (« you- ») ; an hour (h muet) : c'est le son qui décide."]] },
        retenir: "a + consonant sound ; an + vowel sound." },
      { t: "The", html: partie(AR_OLD, 1),
        planches: [{ type: "3d", titre: "The beach at Kribi", legende: "Turn the beach: the sun and the Atlantic Ocean are unique, so « the »; the Lobé Falls (a famous place) take « the »; a pirogue, seen for the first time, takes « a »… then it becomes « the pirogue ».",
          modele: { h: 340, rx: -20, ry: 18, echelle: 0.85, alt: "Plage de Kribi en trois dimensions avec la mer, une pirogue à voile, des cocotiers, le soleil et les chutes de la Lobé", objets: kribi3D(),
            etiquettes: [{ p: [200, 204, 160], t: "the sun", cote: "d" }, { p: [100, -6, 100], t: "the Atlantic Ocean", cote: "d" }, { p: [-60, 40, 40], t: "a pirogue → the pirogue" }, { p: [-240, 40, -30], t: "the Lobé Falls" }] } }],
        fil: { html: "<p>Le soleil est unique : <strong>the sun</strong> ; un océan prend toujours <strong>the</strong> : <strong>the Atlantic Ocean</strong> ; les chutes de la Lobé aussi : <strong>the Lobé Falls</strong> (« a Lobé Falls » est faux).</p>" },
        retenir: "the: known or unique things, rivers, oceans, superlatives." },
      { t: "No article", html: partie(AR_OLD, 2),
        fil: { html: "<p>« Cameroon » est un pays : pas d'article (on dit cependant <em>the United States</em>). « Tourists love mangoes » parle des mangues en général : pas d'article. Mettre « the » partout, comme « le, la, les », produit trois fautes.</p>", verdicts: [[0, "rejetee", "« the Cameroon » et « the mangoes » (en général) sont faux."], [2, "validee", "Son pour a / an ; the pour le connu ou l'unique ; Ø pour le général et les pays."]] },
        retenir: "General plurals, uncountables, countries, cities, languages → no article." }
    ],
    denouement: {
      titre: "The corrected leaflet",
      etapes: ["a university, but an hour: the first sound decides (clue 1).", "the sun, the Atlantic Ocean, the Lobé Falls (clue 2).", "Cameroon, mangoes in general: no article (clue 3)."],
      reponse: "<p>Corrected leaflet: « <strong>The</strong> sun is hot in <strong>Cameroon</strong>. Swim in <strong>the</strong> Atlantic Ocean. Visit <strong>a</strong> university and <strong>the</strong> Lobé Falls. Tourists love <strong>mangoes</strong>. » We choose <em>a</em> or <em>an</em> by the first <strong>sound</strong>, not the first letter: <em>a university</em> (« you- ») but <em>an hour</em>. We use <em>the</em> for what is unique or known (the sun), for oceans and famous places (the Atlantic, the Lobé Falls). We use no article for countries (Cameroon) and for plurals in general (mangoes). Putting « the » everywhere, like « le, la, les » in French, would be wrong.</p>",
      transfert: "<p>Write a five-line leaflet for your own town, using at least two « a / an », two « the » and two nouns without article.</p>"
    },
    revision: (AR_OLD ? AR_OLD.revision : []).concat(["a university, a European (« you- ») ; an hour, an honest man (h muet).", "the + ocean, river, unique thing ; Ø + country, general plural."]),
    exo: AR_OLD ? AR_OLD.exo : "",
    quiz: [
      q("___ hour ago.", "An", "A", "The", "Silent h: vowel sound."),
      q("___ Wouri is a river in Douala.", "The", "A", "Ø", "Rivers take « the »."),
      q("I like ___ mangoes.", "Ø", "the", "a", "Mangoes in general: no article."),
      q("She studies at ___ university.", "a", "an", "Ø", "« you- »: consonant sound."),
      q("___ sun is very hot today.", "The", "A", "Ø", "Unique thing."),
      q("Swim in ___ Atlantic Ocean.", "the", "a", "Ø", "Oceans take « the »."),
      q("Kribi is in ___ Cameroon.", "Ø", "the", "a", "Most countries: no article."),
      q("He is ___ honest man.", "an", "a", "the", "Silent h."),
      q("I saw a pirogue. ___ pirogue was blue.", "The", "A", "Ø", "Mentioned before: « the »."),
      q("___ English is easy for her.", "Ø", "The", "An", "Languages: no article.")
    ]
  });

  /* ═══════════════════════ 3e ALLEMAND — LES VERBES FAIBLES ═══════════════════════ */
  var DV_OLD = ancien("3e-de-verbes");
  var PRON = [["ich", "e"], ["du", "st"], ["er / sie / es", "t"], ["wir", "en"], ["ihr", "t"], ["sie / Sie", "en"]];
  function conj(rad, p) { var e = PRON[p][1], tD = /[td]$/.test(rad) && (e === "st" || e === "t"); return [rad, (tD ? "e" : "") + e]; }
  function blocs3D() {
    var o = [], C = ["#C62828", "#F2994A", "#F2C94C", "#2E7D32", "#1E88E5", "#7B3F99"], k;
    o.push({ f: "boite", c: [0, -10, 0], d: [460, 8, 160], coul: "#C9A576", dessus: "#E3C79C" });
    for (k = 0; k < 6; k++) {
      var y = k * 34;
      o.push({ f: "boite", c: [-60, y, 0], d: [150, 28, 50], coul: "#1E499B", dessus: "#2F5FBF", div: false });
      o.push({ f: "boite", c: [50, y, 0], d: [60, 28, 50], coul: C[k], dessus: C[k], div: false, ec: [70, 0, 0] });
    }
    o.forEach(function (x) { x.c[1] -= 90; });
    return o;
  }
  remplacer("3e-de-verbes", {
    c: "3e", m: "allemand", titre: "Les verbes faibles (réguliers) au présent", duree: 30,
    accroche: "« Ich spielt Fußball, du lerne Deutsch » : le message vocal de Paul à Jonas fait sourire Berlin.",
    intro: "Le message d'un élève à son correspondant de Berlin te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois règles.",
    objectifs: ["trouver le radical d'un verbe faible", "ajouter les terminaisons -e, -st, -t, -en, -t, -en", "appliquer les cas particuliers (radical en -t / -d, verbes en -eln / -ern)", "présenter sa journée avec des verbes faibles"],
    enquete: {
      titre: "Le message de Paul à Jonas",
      svg: svg(640, 220, "Un élève enregistre un message vocal en allemand avec des fautes de conjugaison", "", "<rect width='640' height='220' fill='#F3F0F8'/>" + perso(90, 70, "#5A3A1E", "#DCE6F2", "#1E499B") + "<rect x='110' y='108' width='12' height='22' rx='3' fill='#1F2328'/>" + "<rect x='170' y='30' width='440' height='150' rx='16' fill='#fff' stroke='#C9D2E3'/><path d='M190 58h40' stroke='#7B3F99' stroke-width='6' stroke-linecap='round'/>" + [8, 16, 26, 14, 22, 10, 18, 28, 12, 20].map(function (h, i) { return "<rect x='" + (240 + i * 8) + "' y='" + (58 - h / 2) + "' width='4' height='" + h + "' rx='2' fill='#7B3F99'/>"; }).join("") + txt(190, 100, "« Hallo Jonas! Ich spielt Fußball.", { s: 13, a: "start", w: 500, i: true }) + txt(190, 124, "Du lerne Deutsch. Mein Vater arbeit viel.", { s: 13, a: "start", w: 500, i: true }) + txt(190, 148, "Wir kauft Bananen auf dem Markt. »", { s: 13, a: "start", w: 500, i: true })),
      legende: "À Dschang : Paul, élève de 3e, envoie un message vocal à Jonas, son correspondant de Berlin.",
      contexte: "<p>Paul raconte sa journée : « Ich <em>spielt</em> Fußball. Du <em>lerne</em> Deutsch. Mein Vater <em>arbeit</em> viel. Wir <em>kauft</em> Bananen auf dem Markt. » Jonas répond : « Je comprends, mais tes verbes sont tous mélangés ! » Paul pense : « En allemand, comme en anglais, la terminaison ne change presque pas. » Sa sœur : « Il suffit d'ajouter -e, -es, -e, comme en français. »</p>",
      documents: [{ t: "Les terminaisons du présent", html: "<table class='donnees'><tr><th>ich</th><th>du</th><th>er / sie / es</th><th>wir</th><th>ihr</th><th>sie / Sie</th></tr><tr><td>-e</td><td>-st</td><td>-t</td><td>-en</td><td>-t</td><td>-en</td></tr></table>" }],
      question: "Comment conjuguer correctement les verbes de Paul ?",
      tache: "Corrige les quatre verbes en indiquant pour chacun le radical et la terminaison.",
      hypotheses: ["La terminaison change à peine, comme en anglais.", "On ajoute -e, -es, -e comme en français.", "Radical + -e, -st, -t, -en, -t, -en ; on ajoute un e quand le radical finit par -t ou -d."]
    },
    parties: [
      { t: "Le modèle", html: partie(DV_OLD, 0),
        planches: [{ type: "3d", titre: "Le radical et ses terminaisons", legende: "Le bloc bleu est le radical (spiel-), le même pour toutes les personnes ; chaque bloc coloré est une terminaison : -e (ich), -st (du), -t (er), -en (wir), -t (ihr), -en (sie). Le curseur détache les terminaisons.",
          modele: { h: 360, rx: -14, ry: 24, echelle: 0.85, alt: "Six rangées de blocs : un radical bleu et une terminaison colorée par personne", eclate: "Détacher les terminaisons", jouer: "Détacher", objets: blocs3D(),
            etiquettes: PRON.map(function (p, k) { return { p: [80, k * 34 - 76, 0], t: p[0] + " spiel" + p[1], cote: "d", ec: [70, 0, 0] }; }).concat([{ p: [-130, 10, 0], t: "radical : spiel-" }]) } }],
        fil: { html: "<p>Six personnes, cinq terminaisons différentes : rien à voir avec l'anglais, où seul « he plays » change. « Ich spiel<strong>e</strong> », « du lern<strong>st</strong> » : il faut chaque fois enlever -en de l'infinitif et ajouter la bonne terminaison.</p>", verdicts: [[0, "rejetee", "Les terminaisons changent à presque toutes les personnes."], [1, "rejetee", "Ce sont -e, -st, -t, -en, -t, -en, pas les terminaisons françaises."]] },
        retenir: "Radical (infinitif sans -en) + -e, -st, -t, -en, -t, -en." },
      { t: "Les cas particuliers", html: partie(DV_OLD, 1),
        fil: { html: "<p>« arbeiten » a un radical en -t (arbeit-) : on ajoute un e pour pouvoir prononcer : « mein Vater arbeit<strong>e</strong>t ». Sans ce e, « er arbeitt » serait imprononçable.</p>" },
        retenir: "Radical en -t ou -d : du arbeitest, er arbeitet, ihr findet." },
      { t: "En situation", html: partie(DV_OLD, 2),
        planches: [{ type: "2D", titre: "Am Samstag auf dem Markt", legende: "Une scène de marché décrite avec des verbes faibles : Mama kauft Tomaten, die Verkäuferin sagt den Preis, die Kinder spielen, ich höre Musik.", svg: (function () {
          var s = "<rect width='640' height='260' fill='#F6EEDC'/><rect y='200' width='640' height='60' fill='#D9C49C'/><path d='M200 100h260l-20 -36h-220Z' fill='#C62828'/><rect x='220' y='150' width='220' height='12' fill='#8B5A2B'/><path d='M230 162v38M430 162v38' stroke='#6B4423' stroke-width='6'/>";
          for (var k = 0; k < 12; k++) s += "<circle cx='" + (236 + (k % 6) * 16) + "' cy='" + (142 - Math.floor(k / 6) * 10) + "' r='7' fill='#D7261E'/>";
          s += perso(170, 120, "#5A3A1E", "#C2540A", "#7B3F99") + perso(330, 84, "#6B4423", "#F7C948", "#2E3445") + perso(520, 120, "#6B4423", "#2E7D32", "#1E499B") + perso(580, 126, "#5A3A1E", "#F2994A", "#1E499B") + perso(60, 120, "#5A3A1E", "#DCE6F2", "#1E499B") + "<path d='M50 108a10 10 0 0 1 20 0' stroke='#1F2328' stroke-width='3' fill='none'/>";
          s += bulle(110, 60, 130, "Mama kauft…", TERRE) + bulle(270, 22, 170, "Die Verkäuferin sagt…", "#B07A00") + bulle(470, 60, 150, "Die Kinder spielen.", VERT) + bulle(10, 22, 120, "Ich höre Musik.", BLEU);
          return svg(640, 260, "Scène de marché : une mère achète des tomates, la vendeuse annonce le prix, deux enfants jouent, un élève écoute de la musique", "", s);
        })() }],
        fil: { html: "<p>« Wir kauf<strong>en</strong> Bananen » : avec wir, la terminaison est -en, comme l'infinitif. La règle complète (radical + terminaison, e intercalé après -t / -d) corrige les quatre verbes de Paul.</p>", verdicts: [[2, "validee", "Radical + terminaison ; e intercalé après -t / -d."]] },
        retenir: "lernen, kaufen, wohnen, machen, sagen, fragen, hören, kochen : verbes faibles." }
    ],
    denouement: {
      titre: "Le message corrigé",
      etapes: ["Radical : spiel-, lern-, arbeit-, kauf- (indice 1).", "Terminaisons : ich -e, du -st, er -t, wir -en (indice 1).", "arbeit- finit par -t : er arbeitet (indice 2)."],
      reponse: "<p>Message corrigé : « Hallo Jonas! Ich spiel<strong>e</strong> Fußball. Du lern<strong>st</strong> Deutsch. Mein Vater arbeit<strong>et</strong> viel. Wir kauf<strong>en</strong> Bananen auf dem Markt. » Un verbe faible se conjugue en prenant le radical (l'infinitif sans -en) et en ajoutant -e, -st, -t, -en, -t, -en. Contrairement à l'anglais, la terminaison change presque à chaque personne ; et ce ne sont pas les terminaisons françaises. Quand le radical se termine par -t ou -d, on intercale un e : er arbeitet, du arbeitest.</p>",
      transfert: "<p>Raconte ton samedi à Jonas en six phrases avec six verbes faibles différents (wohnen, machen, kochen, hören, fragen, sagen) et six personnes différentes.</p>"
    },
    revision: (DV_OLD ? DV_OLD.revision : []).concat(["Radical en -t / -d : e intercalé (er arbeitet, ihr findet)."]),
    exo: DV_OLD ? DV_OLD.exo : "",
    quiz: [
      q("du ___ (lernen)", "lernst", "lernt", "lerne", "du : -st."),
      q("er ___ (arbeiten)", "arbeitet", "arbeit", "arbeitt", "Radical en -t : e intercalé."),
      q("Quelle est la terminaison de « ich » ?", "-e", "-st", "-en", "ich spiele."),
      q("wir ___ (kaufen)", "kaufen", "kauft", "kaufst", "wir : -en."),
      q("ihr ___ (spielen)", "spielt", "spielen", "spielst", "ihr : -t."),
      q("Le radical de « wohnen » est…", "wohn-", "wohne-", "wohnen-", "On enlève -en."),
      q("du ___ (finden)", "findest", "findst", "finden", "Radical en -d."),
      q("sie (pluriel) ___ (machen)", "machen", "macht", "machst", "sie / Sie : -en."),
      q("wir ___ (wandern)", "wandern", "wanderen", "wandert", "Verbes en -ern : -n seulement."),
      q("« kochen » signifie…", "cuisiner", "acheter", "habiter", "kochen = cuisiner.")
    ]
  });

  /* ═══════════════════════ 3e ESPAGNOL — MI FAMILIA ═══════════════════════ */
  var EF_OLD = ancien("3e-es-familia");
  var FAM = [["el abuelo", "Papa Mbarga", 210, 50, "#6B4423", "#7A6A55", "", "vieux"], ["la abuela", "Mama Ngono", 430, 50, "#5A3A1E", "#7B3F99", "#1B1410", "vieux"], ["el padre", "Paul", 160, 170, "#6B4423", "#1E499B", "#1B1410", "homme"], ["la madre", "Marie", 320, 170, "#5A3A1E", "#C2540A", "#1B1410", "femme"], ["la tía", "Rose", 480, 170, "#6B4423", "#2E7D32", "#1B1410", "femme"], ["yo", "María", 120, 290, "#5A3A1E", "#F7C948", "#1B1410", "femme"], ["el hermano", "Junior", 230, 290, "#6B4423", "#DCE6F2", "#1B1410", "homme"], ["la hermana", "Lucie", 340, 290, "#5A3A1E", "#F2994A", "#1B1410", "femme"], ["el primo", "Eric", 500, 290, "#6B4423", "#1E88E5", "#1B1410", "homme"]];
  function arbre(sel) {
    var s = "<rect width='640' height='360' fill='#FBF7EE'/>", L = [[210, 50, 430, 50], [320, 50, 320, 110], [160, 110, 480, 110], [160, 110, 160, 140], [480, 110, 480, 140], [320, 110, 320, 140], [160, 170, 320, 170], [240, 170, 240, 230], [120, 230, 340, 230], [120, 230, 120, 260], [230, 230, 230, 260], [340, 230, 340, 260], [480, 200, 480, 230], [480, 230, 500, 230], [500, 230, 500, 260]];
    L.forEach(function (l) { s += "<path d='M" + l[0] + " " + l[1] + "L" + l[2] + " " + l[3] + "' stroke='#8A6E4B' stroke-width='3'/>"; });
    FAM.forEach(function (f, i) { s += (i === sel ? "<circle cx='" + f[2] + "' cy='" + f[3] + "' r='37' fill='none' stroke='" + ROUGE + "' stroke-width='4'/>" : "") + portrait(f[2], f[3], f[4], f[5], f[6], f[7]) + txt(f[2], f[3] + 46, f[0], { s: 12, c: BLEU, halo: true }) + txt(f[2], f[3] + 60, f[1], { s: 10.5, w: 500, c: GRIS, halo: true }); });
    return s;
  }
  remplacer("3e-es-familia", {
    c: "3e", m: "espagnol", titre: "Mi familia : présenter sa famille", duree: 30,
    accroche: "« Mi hermanos viven en Bafoussam » : Ana, la correspondante de Séville, a reçu la photo de famille de María… et une phrase à corriger.",
    intro: "Une photo de famille envoyée à une correspondante espagnole te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois règles.",
    objectifs: ["nommer les membres de la famille en espagnol", "accorder les possessifs (mi / mis, su / sus, nuestro…)", "employer la préposition a devant un COD de personne", "présenter sa famille en six phrases"],
    enquete: {
      titre: "La photo de famille de María",
      svg: svg(640, 230, "Une photo de famille avec trois générations et une légende en espagnol contenant des fautes", "", "<rect width='640' height='230' fill='#EFE6D6'/><rect x='30' y='20' width='300' height='190' rx='6' fill='#fff' stroke='#C9A576' stroke-width='4'/>" + portrait(100, 80, "#6B4423", "#7A6A55", "", "vieux") + portrait(180, 80, "#5A3A1E", "#7B3F99", "", "vieux") + portrait(260, 80, "#6B4423", "#1E499B", "#1B1410", "homme") + portrait(100, 160, "#5A3A1E", "#F7C948", "#1B1410", "femme") + portrait(180, 160, "#6B4423", "#DCE6F2", "#1B1410", "homme") + portrait(260, 160, "#5A3A1E", "#F2994A", "#1B1410", "femme") + "<rect x='360' y='40' width='250' height='150' rx='10' fill='#fff' stroke='#C9D2E3'/>" + ["Querida Ana:", "Mi hermanos viven en Bafoussam.", "Su padre es profesor. (mon père)", "Quiero mucho mi abuela.", "La hermana de mi padre es mi prima."].map(function (l, i) { return txt(374, 66 + i * 26, l, { s: 11.5, a: "start", w: i ? 500 : 700, i: true }); }).join("")),
      legende: "À Yaoundé : María, élève de 3e, prépare la légende d'une photo de famille pour Ana, sa correspondante de Séville.",
      contexte: "<p>María écrit : « <em>Mi hermanos</em> viven en Bafoussam. <em>Su padre</em> es profesor (pour dire « mon père »). Quiero mucho <em>mi abuela</em>. La hermana de mi padre es <em>mi prima</em>. » Ana répond : « J'adore la photo ! Mais qui est qui ? » Le frère de María dit : « Les possessifs ne s'accordent jamais. » Sa cousine : « En espagnol, on parle de sa famille comme en français, sans rien ajouter. »</p>",
      documents: [{ t: "L'arbre généalogique de María", html: "<p>Grands-parents : Papa Mbarga et Mama Ngono. Parents : Paul (le père) et Marie (la mère). Tante : Rose, sœur de Paul. Enfants : María, Junior, Lucie ; cousin : Eric, fils de Rose.</p>" }],
      question: "Comment corriger la légende pour qu'Ana comprenne qui est qui ?",
      tache: "Corrige les quatre phrases et présente la famille de María en six phrases en espagnol.",
      hypotheses: ["Les possessifs ne s'accordent jamais.", "On parle de sa famille comme en français, sans rien ajouter devant les personnes.", "Le possessif s'accorde en nombre (mi / mis) ; on met « a » devant un COD de personne ; le vocabulaire de parenté se lit sur l'arbre."]
    },
    parties: [
      { t: "El vocabulario", html: partie(EF_OLD, 0),
        planches: [{ type: "2D", titre: "El árbol genealógico de María", legende: "Trois générations : los abuelos, los padres y la tía, puis María, sus hermanos y su primo. La sœur du père est la tía ; le fils de la tía est el primo.", svg: svg(640, 360, "Arbre généalogique en portraits : grands-parents, parents, tante, enfants et cousin, avec les noms de parenté en espagnol", "", arbre(null)) }],
        fil: { html: "<p>Rose est la sœur du père de María : c'est <strong>su tía</strong>, pas « su prima ». Eric, le fils de Rose, est <strong>su primo</strong>.</p>" },
        retenir: "padre, madre, abuelo, abuela, hermano, hermana, tío, tía, primo, prima." },
      { t: "Los posesivos", html: partie(EF_OLD, 1),
        fil: { html: "<p>« hermanos » est au pluriel : <strong>mis</strong> hermanos. Et pour dire « mon père », c'est <strong>mi</strong> padre : « su padre » voudrait dire « son père » ou « votre père ». Les possessifs s'accordent en nombre (et nuestro / vuestro aussi en genre).</p>", verdicts: [[0, "rejetee", "mi → mis au pluriel ; nuestro → nuestra, nuestros, nuestras."]] },
        retenir: "mi / mis, tu / tus, su / sus ; nuestro / nuestra / nuestros / nuestras." },
      { t: "Presentar a su familia", html: partie(EF_OLD, 2),
        planches: [{ type: "3d", titre: "L'arbre de la famille", legende: "Tourne l'arbre : un tronc et trois étages de branches. En haut, los abuelos ; au milieu, los padres y la tía ; en bas, los hijos y el primo. Chaque fruit est une personne de la famille.",
          modele: { h: 380, rx: -10, ry: 20, echelle: 0.85, alt: "Arbre en trois dimensions avec des fruits colorés sur trois étages représentant trois générations", objets: (function () {
            var o = [], k;
            o.push({ f: "boite", c: [0, -10, 0], d: [360, 8, 200], coul: "#7A9A4A", dessus: "#8FB35A" });
            o.push({ f: "cylindre", c: [0, -2, 0], r: 16, r2: 11, h: 190, n: 14, coul: "#6B4423" });
            [[180, 2, 70, "#7A6A55"], [120, 3, 110, "#1E499B"], [60, 4, 150, "#F7C948"]].forEach(function (e, j) {
              for (k = 0; k < e[1]; k++) { var a = k / e[1] * 2 * Math.PI + j, x = e[2] * 0.6 * Math.cos(a), z = e[2] * 0.4 * Math.sin(a); o.push({ f: "sphere", c: [x * 0.5, e[0] + 6, z * 0.5], r: 34 - j * 4, coul: "#2E7D32", op: 0.75 }); o.push({ f: "sphere", c: [x, e[0], z], r: 13, coul: e[3] }); }
            });
            return o;
          })(), etiquettes: [{ p: [42, 180, 0], t: "los abuelos", cote: "d" }, { p: [-66, 120, 0], t: "los padres y la tía" }, { p: [90, 60, 0], t: "los hijos y el primo", cote: "d" }] } }],
        fil: { html: "<p>En espagnol, un COD qui désigne une personne est précédé de <strong>a</strong> : « Quiero mucho <strong>a</strong> mi abuela ». On ne parle donc pas de sa famille exactement comme en français.</p>", verdicts: [[1, "rejetee", "Il faut « a » devant un COD de personne : quiero a mi abuela."], [2, "validee", "Accord du possessif, « a » personnel, vocabulaire de l'arbre."]] },
        retenir: "Somos cinco en casa. Tengo dos hermanos. Quiero mucho a mi abuela." }
    ],
    denouement: {
      titre: "La légende corrigée",
      etapes: ["Rose = la tía ; Eric = el primo (indice 1).", "mis hermanos ; mi padre (indice 2).", "Quiero mucho a mi abuela (indice 3)."],
      reponse: "<p>Légende corrigée : « <strong>Mis</strong> hermanos viven en Bafoussam. <strong>Mi</strong> padre es profesor. Quiero mucho <strong>a</strong> mi abuela. La hermana de mi padre es mi <strong>tía</strong>. » Le possessif s'accorde en nombre avec ce qui est possédé (mi hermano, mis hermanos) et « su » signifie « son, sa, leur » ou « votre », jamais « mon ». Devant un complément d'objet direct qui désigne une personne, l'espagnol ajoute <strong>a</strong>. Enfin, l'arbre montre que la sœur du père est la tía, et son fils el primo.</p>",
      transfert: "<p>Présente ta propre famille à Ana en six phrases : combien vous êtes, les prénoms, deux métiers, où vit un grand-parent, et une phrase avec « quiero a… ».</p>"
    },
    revision: (EF_OLD ? EF_OLD.revision : []).concat(["« a » devant un COD de personne : quiero a mi madre."]),
    exo: EF_OLD ? EF_OLD.exo : "",
    quiz: [
      q("« Mes cousins » se dit…", "mis primos", "mi primos", "sus primos", "Pluriel : mis."),
      q("La hermana de mi padre es mi…", "tía", "prima", "abuela", "La sœur du père."),
      q("Tengo dos ___ (frères).", "hermanos", "hermanas", "primos", "hermano = frère."),
      q("« Mon père est professeur » :", "Mi padre es profesor.", "Su padre es profesor.", "Mis padre es profesor.", "mi = mon."),
      q("« J'aime beaucoup ma grand-mère » :", "Quiero mucho a mi abuela.", "Quiero mucho mi abuela.", "Quiero mucho la abuela mía a.", "« a » devant une personne."),
      q("« Notre maison » :", "nuestra casa", "nuestro casa", "nuestras casa", "casa est féminin."),
      q("El hijo de mi tía es mi…", "primo", "sobrino", "hermano", "Le cousin."),
      q("« los padres » signifie…", "les parents", "les pères seulement", "les grands-parents", "padre + madre."),
      q("« Somos cinco en casa » signifie…", "Nous sommes cinq à la maison.", "J'ai cinq maisons.", "Ma maison a cinq pièces.", "Présenter sa famille."),
      q("« sus hermanas » peut signifier…", "ses sœurs", "mes sœurs", "nos sœurs", "su / sus : son, sa, leur, votre.")
    ]
  });

  /* ═══════════════════════ 3e GREC — ÉSOPE, HOMÈRE ═══════════════════════ */
  var GR_OLD = ancien("3e-gr-esope-homere");
  function amphore3D() {
    var o = [], P = [[0, 0, 22, 28, "#1F1A17"], [0, 10, 28, 54, "#C46A2B"], [0, 30, 54, 70, "#C46A2B"], [0, 70, 70, 72, "#1F1A17"], [0, 90, 72, 64, "#1F1A17"], [0, 130, 64, 44, "#C46A2B"], [0, 160, 44, 26, "#C46A2B"], [0, 182, 26, 22, "#1F1A17"], [0, 220, 22, 30, "#C46A2B"], [0, 230, 30, 30, "#1F1A17"]], k;
    o.push({ f: "boite", c: [0, -10, 0], d: [320, 8, 220], coul: "#E9E4D8", dessus: "#F4F1EA" });
    for (k = 0; k < P.length - 1; k++) { var a = P[k], b = P[k + 1]; o.push({ f: "cylindre", c: [0, a[1], 0], r: a[3], r2: b[3], h: b[1] - a[1], n: 32, coul: a[4] }); }
    [-1, 1].forEach(function (sg) { for (k = 0; k < 10; k++) { var t = k / 9 * Math.PI; o.push({ f: "sphere", c: [sg * (30 + 22 * Math.sin(t)), 168 + 50 * Math.cos(t) * 0.6 + 10, 0], r: 5, coul: "#1F1A17" }); } });
    o.forEach(function (x) { x.c[1] -= 110; });
    return o;
  }
  remplacer("3e-gr-esope-homere", {
    c: "3e", m: "grec", titre: "Ésope, Homère et leurs genres littéraires", duree: 30,
    accroche: "« Ulysse, c'est une fable ! » La soirée contes du club de lecture tourne au débat entre la tortue et Achille.",
    intro: "Une soirée contes au club de lecture te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées.",
    objectifs: ["présenter Homère et les deux épopées qui lui sont attribuées", "présenter Ésope et la fable", "distinguer l'épopée de la fable", "repérer l'héritage d'Homère et d'Ésope, jusque dans les contes africains"],
    enquete: {
      titre: "La soirée contes du club de lecture",
      svg: (function () {
        var s = "<rect width='640' height='220' fill='#2B2233'/><circle cx='320' cy='200' r='60' fill='#F2994A' opacity='.25'/><path d='M300 200l20 -40l20 40Z' fill='#F2994A'/><path d='M310 200l10 -24l10 24Z' fill='#FFD54A'/>";
        s += perso(180, 110, "#6B4423", "#7A6A55", "#5A5F6B") + perso(460, 110, "#5A3A1E", "#DCE6F2", "#1E499B") + "<g transform='translate(90 190)'><ellipse rx='26' ry='14' fill='#6E6A3A'/><path d='M-22 0h44' stroke='#4D4A28' stroke-width='2'/><circle cx='28' cy='-4' r='7' fill='#7A7650'/></g>" + "<g transform='translate(560 160)'><path d='M-14 30l14 -60l14 60Z' fill='#B08D57'/><circle cy='-36' r='10' fill='#C9A66B'/></g>";
        s += bulle(110, 30, 160, "Ulysse, c'est une fable !", "#B07A00") + bulle(380, 30, 190, "Non, la tortue, c'est Ésope !", "#1E88E5");
        return svg(640, 220, "Deux élèves débattent autour d un feu, une tortue d un côté et un casque de héros grec de l autre", "", s);
      })(),
      legende: "À Ebolowa : le club de lecture du lycée organise une soirée contes autour du feu.",
      contexte: "<p>Grand-père Mvondo raconte comment <strong>la tortue Kulu</strong> a battu l'antilope à la course par la ruse ; la morale : « l'intelligence vaut mieux que la force ». Puis le professeur de grec lit le récit du <strong>cyclope</strong> trompé par Ulysse. Samuel s'exclame : « Ulysse, c'est une fable, comme la tortue ! » Grace répond : « Les animaux qui parlent, ce n'est que chez nous ; les Grecs ne racontaient que des guerres. »</p>",
      documents: [
        { t: "Ésope, « Le Lièvre et la Tortue » (morale)", html: "<p>« Souvent, le travail l'emporte sur les dons naturels négligés. »</p>" },
        { t: "Homère, Odyssée, chant IX (résumé)", html: "<p>Prisonniers du cyclope Polyphème, Ulysse et ses compagnons l'enivrent, lui crèvent son œil unique et s'échappent accrochés sous le ventre des moutons. Le poème compte plus de 12 000 vers.</p>" }
      ],
      question: "L'histoire d'Ulysse et celle de la tortue appartiennent-elles au même genre, et que nous ont laissé Homère et Ésope ?",
      tache: "Compare l'Odyssée et la fable de la tortue (longueur, personnages, but) et explique l'héritage de chacun, en dix lignes.",
      hypotheses: ["L'Odyssée est une fable, comme l'histoire de la tortue.", "Les fables d'animaux n'existent qu'en Afrique ; les Grecs ne racontaient que des guerres.", "L'Odyssée est une épopée (long poème, héros, dieux) ; la fable d'Ésope est un récit court avec des animaux et une morale ; les deux genres se retrouvent ailleurs, jusque dans nos contes."]
    },
    parties: [
      { t: "Homère et l'épopée", html: partie(GR_OLD, 0),
        planches: [{ type: "3d", titre: "Une amphore grecque", legende: "Tourne l'amphore : terre cuite orangée et bandes noires, comme sur les vases à figures noires qui représentaient les héros d'Homère (Achille, Ulysse). Les Grecs y conservaient l'huile et le vin.",
          modele: { h: 380, rx: -10, ry: 20, echelle: 0.9, alt: "Amphore grecque en terre cuite orange à bandes noires", objets: amphore3D(),
            etiquettes: [{ p: [0, 122, 0], t: "Col et lèvre" }, { p: [72, -30, 0], t: "Panse : frise des héros", cote: "d" }, { p: [52, 60, 0], t: "Anses", cote: "d" }] } }],
        fil: { html: "<p>L'Odyssée compte plus de 12 000 vers (document 2), raconte les exploits d'un héros humain sur dix ans, avec l'intervention des dieux : c'est une <strong>épopée</strong>, pas une fable.</p>", verdicts: [[0, "rejetee", "Long poème héroïque avec des dieux : une épopée."]] },
        retenir: "Homère (VIIIᵉ s. av. J.-C.) : l'Iliade et l'Odyssée, épopées." },
      { t: "Ésope et la fable", html: partie(GR_OLD, 1),
        planches: [{ type: "2D", titre: "Épopée et fable, côte à côte", legende: "Le voyage d'Ulysse de Troie à Ithaque, avec ses étapes (le cyclope, Circé, les sirènes), en dix ans ; à droite, la course du lièvre et de la tortue, en quelques lignes, avec sa morale.", svg: (function () {
          var s = "<rect width='640' height='320' fill='#F4EFE4'/><rect x='14' y='14' width='380' height='292' rx='14' fill='#BFDDF2'/>", P = [[340, 70, "Troie"], [270, 150, "le cyclope"], [180, 90, "Circé"], [120, 200, "les sirènes"], [60, 120, "Ithaque"]];
          s += "<path d='M" + P.map(function (p) { return p[0] + " " + p[1]; }).join("L") + "' fill='none' stroke='#7A4A22' stroke-width='3' stroke-dasharray='8 6' marker-end='url(#grf)'/>";
          P.forEach(function (p, i) { s += "<ellipse cx='" + p[0] + "' cy='" + (p[1] + 6) + "' rx='" + (i ? 22 : 30) + "' ry='10' fill='#D9C08A' stroke='#A3824A'/><circle cx='" + p[0] + "' cy='" + p[1] + "' r='5' fill='" + (i === 0 || i === 4 ? ROUGE : NUIT) + "'/>" + txt(p[0], p[1] - 12, p[2], { s: 11.5, halo: true }); });
          s += "<path d='M300 250l30 4l20 -4l-26 -4Z' fill='#5D3A1E'/><path d='M322 248v-28l16 26Z' fill='#F4EFE4'/>" + txt(204, 290, "Épopée : plus de 12 000 vers, dix ans d'aventures", { s: 12, c: "#7A4A22" });
          s += "<rect x='408' y='14' width='218' height='292' rx='14' fill='#EEF6E8'/><path d='M420 230h194' stroke='#7A9A4A' stroke-width='3'/><path d='M590 210v20' stroke='" + ROUGE + "' stroke-width='3'/><path d='M590 210l18 6l-18 6Z' fill='" + ROUGE + "'/>";
          s += "<g transform='translate(560 216)'><ellipse rx='18' ry='10' fill='#6E6A3A'/><circle cx='20' cy='-3' r='5' fill='#7A7650'/></g><g transform='translate(460 150)'><ellipse rx='18' ry='10' fill='#B9A68A'/><circle cx='-18' cy='-8' r='7' fill='#B9A68A'/><path d='M-22 -14l-4 -16M-16 -14l0 -16' stroke='#B9A68A' stroke-width='4' stroke-linecap='round'/><path d='M-6 10l-4 10M6 10l4 10' stroke='#B9A68A' stroke-width='3'/></g>" + txt(470, 120, "zzz", { s: 12, c: GRIS, i: true });
          s += txt(517, 50, "Fable : quelques lignes", { s: 12, c: VERT }) + txt(517, 270, "Morale : le travail", { s: 11.5, w: 600, c: VERT }) + txt(517, 286, "l'emporte sur le don négligé", { s: 11.5, w: 600, c: VERT });
          return svg(640, 320, "À gauche le voyage d Ulysse de Troie à Ithaque par le cyclope, Circé et les sirènes ; à droite le lièvre endormi et la tortue qui franchit la ligne d arrivée", fleche("grf", "#7A4A22"), s);
        })() }],
        fil: { html: "<p>Ésope, Grec du VIᵉ siècle av. J.-C., racontait déjà des <strong>fables d'animaux</strong> : le lièvre et la tortue, le corbeau et le renard. Les Grecs ne racontaient donc pas que des guerres, et la fable n'est pas propre à l'Afrique.</p>", verdicts: [[1, "rejetee", "Ésope, Grec, a écrit des fables d'animaux dès le VIᵉ siècle av. J.-C."]] },
        retenir: "Ésope (VIᵉ s. av. J.-C.) : fables, récits courts à morale, souvent avec des animaux." },
      { t: "Leur héritage", html: partie(GR_OLD, 2),
        fil: { html: "<p>La tortue Kulu de grand-père Mvondo et la tortue d'Ésope partagent le même genre et presque la même morale : la fable est universelle. Homère, lui, nous a laissé les mots « odyssée » et « talon d'Achille ».</p>", verdicts: [[2, "validee", "Épopée ≠ fable ; deux genres universels, présents aussi dans nos contes."]] },
        retenir: "« Une odyssée », « le talon d'Achille » ; La Fontaine reprend Ésope ; la tortue des contes africains." }
    ],
    denouement: {
      titre: "La tortue et Ulysse : deux genres, un même héritage",
      etapes: ["Odyssée : plus de 12 000 vers, héros, dieux → épopée (indice 1).", "Ésope : récits courts, animaux, morale → fable (indice 2).", "La fable est universelle ; Homère et Ésope ont laissé des mots et des œuvres (indice 3)."],
      reponse: "<p>L'histoire d'Ulysse et celle de la tortue n'appartiennent pas au même genre. L'Odyssée, attribuée au poète Homère (VIIIᵉ siècle av. J.-C.), est une épopée : un long poème de plus de 12 000 vers qui raconte pendant dix ans les exploits d'un héros, avec l'intervention des dieux, comme la ruse contre le cyclope. La fable, illustrée par Ésope (VIᵉ siècle av. J.-C.), est un récit court, souvent avec des animaux, qui se termine par une morale, comme « Le Lièvre et la Tortue ». Grace se trompe : les Grecs avaient déjà des fables d'animaux, et la tortue Kulu de nos contes en montre l'universalité. Homère nous a laissé des expressions (« une odyssée », « le talon d'Achille ») ; Ésope a inspiré La Fontaine et rejoint les conteurs africains.</p>",
      transfert: "<p>Écris une fable de dix lignes avec deux animaux du Cameroun (la tortue, le léopard, l'antilope, le singe…) et termine-la par une morale ; puis indique en deux lignes ce qui la distingue d'une épopée.</p>"
    },
    revision: (GR_OLD ? GR_OLD.revision : []).concat(["Épopée : long poème, héros, dieux ; fable : récit court, animaux, morale.", "La tortue des contes africains : la fable est universelle."]),
    exo: GR_OLD ? GR_OLD.exo : "",
    quiz: [
      q("Qui est le héros de l'Odyssée ?", "Ulysse", "Achille", "Ésope", "Son retour vers Ithaque."),
      q("Une fable se termine par…", "une morale", "une bataille", "une prière", "La leçon du récit."),
      q("« Le talon d'Achille » désigne…", "un point faible", "une course rapide", "une ruse", "Achille n'était vulnérable qu'au talon."),
      q("Homère est l'auteur supposé…", "de l'Iliade et de l'Odyssée", "des fables", "du Lièvre et la Tortue", "Deux épopées."),
      q("L'épopée est…", "un long poème qui raconte les exploits de héros", "un récit court à morale", "une pièce de théâtre comique", "Avec l'intervention des dieux."),
      q("Ésope vivait au…", "VIᵉ siècle av. J.-C.", "XVIIᵉ siècle", "VIIIᵉ siècle apr. J.-C.", "Selon la tradition, esclave affranchi."),
      q("Qui a réécrit en vers des fables d'Ésope ?", "La Fontaine", "Homère", "Victor Hugo", "Au XVIIᵉ siècle."),
      q("« Une odyssée » désigne aujourd'hui…", "un long voyage plein d'aventures", "une colère", "une fable", "D'après le voyage d'Ulysse."),
      q("Les aèdes étaient…", "des poètes qui récitaient les épopées", "des animaux des fables", "des dieux grecs", "Récitation orale."),
      q("La tortue rusée des contes africains montre que…", "la fable est un genre universel", "les Grecs ignoraient les fables", "l'épopée vient d'Afrique", "Même genre, partout.")
    ]
  });

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  VRT_A("3e-en-articles", 2, "Complete the leaflet: a, an, the or Ø", function (el) {
    exercice(el, [["___ sun is hot in Kribi.", ["The", "A", "Ø"], "Unique thing → the."], ["Kribi is in ___ Cameroon.", ["Ø", "the", "a"], "Most countries take no article."], ["Visit ___ university of Douala.", ["the", "an", "Ø"], "A known, specific one → the (« you- » sound anyway)."], ["Eat ___ orange on the beach.", ["an", "a", "the"], "Vowel sound → an."], ["Tourists love ___ mangoes.", ["Ø", "the", "a"], "Mangoes in general → no article."], ["Swim in ___ Atlantic Ocean.", ["the", "Ø", "an"], "Oceans → the."], ["Take ___ pirogue to the island.", ["a", "an", "Ø"], "First mention, consonant sound → a."], ["It is ___ hour from Douala.", ["an", "a", "the"], "Silent h → an."]], "Next", "Sentence");
  });
  VRT_A("3e-de-verbes", 0, "La machine à conjuguer : choisis un verbe et une personne", function (el) {
    var V = [["spielen", "jouer"], ["lernen", "apprendre"], ["kaufen", "acheter"], ["wohnen", "habiter"], ["arbeiten", "travailler"], ["finden", "trouver"], ["kochen", "cuisiner"]], v = 0, p = 0;
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:6px' data-v>" + V.map(function (x, k) { return "<button type='button' class='btn-l' data-k='" + k + "'>" + x[0] + "</button>"; }).join("") + "</div><div style='display:flex;flex-wrap:wrap;gap:6px;margin-top:8px' data-p>" + PRON.map(function (x, k) { return "<button type='button' class='btn-l' data-q='" + k + "'>" + x[0] + "</button>"; }).join("") + "</div><svg viewBox='0 0 640 140' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    function maj() {
      var rad = V[v][0].replace(/en$/, ""), c = conj(rad, p), wR = 22 + rad.length * 15, wE = 30 + c[1].length * 15;
      var s = "<rect width='640' height='140' fill='#F5F7FB'/>" + txt(70, 82, PRON[p][0].split(" ")[0], { s: 22, a: "end", c: GRIS });
      s += "<rect x='90' y='50' width='" + wR + "' height='48' rx='10' fill='#1E499B'/>" + txt(90 + wR / 2, 82, rad, { s: 22, c: "#fff" });
      s += "<rect x='" + (96 + wR) + "' y='50' width='" + wE + "' height='48' rx='10' fill='#C2540A'/>" + txt(96 + wR + wE / 2, 82, "-" + c[1], { s: 22, c: "#fff" });
      s += txt(110 + wR + wE, 82, "→  " + PRON[p][0].split(" ")[0] + " " + c[0] + c[1], { s: 22, a: "start" }) + txt(90, 32, "radical", { s: 11, a: "start", c: BLEU }) + txt(96 + wR, 32, "terminaison", { s: 11, a: "start", c: "#C2540A" });
      el.querySelector("[data-s]").innerHTML = s;
      el.querySelector("[data-r]").innerHTML = V[v][0] + " (" + V[v][1] + ") : radical <b>" + rad + "-</b> + <b>-" + c[1] + "</b>" + (c[1].length > PRON[p][1].length ? " · radical en -t / -d : on intercale un <b>e</b> pour prononcer." : "");
      el.querySelectorAll("[data-k]").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.k === v); });
      el.querySelectorAll("[data-q]").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.q === p); });
    }
    el.querySelectorAll("[data-k]").forEach(function (b) { b.addEventListener("click", function () { v = +b.dataset.k; maj(); }); });
    el.querySelectorAll("[data-q]").forEach(function (b) { b.addEventListener("click", function () { p = +b.dataset.q; maj(); }); });
    maj();
  });
  VRT_A("3e-es-familia", 1, "¿Quién es? Toca a una persona del árbol", function (el) {
    var REL = ["Es mi abuelo, el padre de mi padre.", "Es mi abuela, la madre de mi padre.", "Es mi padre. Es profesor.", "Es mi madre. Es comerciante.", "Es mi tía, la hermana de mi padre.", "Soy yo, María.", "Es mi hermano Junior.", "Es mi hermana Lucie.", "Es mi primo, el hijo de mi tía."];
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:6px' data-b>" + FAM.map(function (f, k) { return "<button type='button' class='btn-l' data-k='" + k + "'>" + f[1] + "</button>"; }).join("") + "</div><svg viewBox='0 0 640 360' class='an-svg' style='max-height:380px' data-s></svg><p class='labo-r' data-r></p>";
    function maj(k) {
      el.querySelector("[data-s]").innerHTML = arbre(k);
      el.querySelector("[data-r]").innerHTML = "<b>" + REL[k] + "</b> (" + FAM[k][0] + ")";
      el.querySelectorAll("[data-k]").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.k === k); });
    }
    el.querySelectorAll("[data-k]").forEach(function (b) { b.addEventListener("click", function () { maj(+b.dataset.k); }); });
    maj(4);
  });
  VRT_A("3e-gr-esope-homere", 1, "Épopée ou fable ? Classe chaque extrait", function (el) {
    exercice(el, [["Achille, furieux, refuse de combattre devant Troie pendant que les dieux se disputent sur l'Olympe : ___", ["épopée", "fable"], "Héros, guerre, dieux : l'Iliade."], ["Le corbeau lâche son fromage, flatté par le renard. Morale : tout flatteur vit aux dépens de celui qui l'écoute. ___", ["fable", "épopée"], "Animaux, récit court, morale."], ["Ulysse s'attache au mât pour écouter le chant des sirènes sans périr : ___", ["épopée", "fable"], "L'Odyssée, chant XII."], ["La tortue Kulu gagne la course contre l'antilope par la ruse ; l'intelligence vaut mieux que la force. ___", ["fable", "épopée"], "Conte africain à morale : même genre que les fables d'Ésope."], ["Le lièvre s'endort, la tortue avance sans s'arrêter et gagne. ___", ["fable", "épopée"], "Ésope : Le Lièvre et la Tortue."], ["Pénélope défait la nuit la toile tissée le jour, en attendant le retour d'Ulysse : ___", ["épopée", "fable"], "L'Odyssée."]], "Extrait suivant", "Extrait");
  });
})();
