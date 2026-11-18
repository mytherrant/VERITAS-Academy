/* Leçons APPROFONDIES — lot 10, classes d'examen (18/11/2026) : Ville cruelle (français 3e), naissance et funérailles
   (culture nationale, Tle). Même gabarit et même mécanisme que 11-approfondies-lot4.js (remplacement EN PLACE ; ordre,
   clé, fiche APC, examen et scènes conservés). Les classes de 6e, 5e et 4e sont traitées par une autre session
   (16-approfondies-premier-cycle.js). Simulations VRT_A en fin de fichier. */
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

  /* ═══════════════════════ 3e FRANÇAIS — VILLE CRUELLE ═══════════════════════ */
  var VC_OLD = ancien("3e-fr-ville-cruelle");
  function cabosse(x, y, r, a, mur) {
    return "<g transform='translate(" + x + " " + y + ") rotate(" + (a || 0) + ")'><ellipse rx='" + r + "' ry='" + (r * 0.55) + "' fill='url(#" + (mur ? "vcCm" : "vcCv") + ")'/>" + [-0.5, 0, 0.5].map(function (k) { return "<path d='M" + (-r * 0.9) + " " + (k * r * 0.5) + "Q0 " + (k * r * 0.75) + " " + (r * 0.9) + " " + (k * r * 0.5) + "' stroke='#5A2E0A' stroke-width='1.2' fill='none' opacity='.5'/>"; }).join("") + "<path d='M" + (r * 0.95) + " 0l" + (r * 0.3) + " -3' stroke='#4E6B2A' stroke-width='3'/></g>";
  }
  function controle3D() {
    var o = [], k, feu = [0, 0, 0];
    o.push({ f: "boite", c: [0, -10, 0], d: [560, 8, 300], coul: "#B9905E", dessus: "#C9A06E" });
    o.push({ f: "boite", c: [-80, 120, -60], d: [300, 6, 180], coul: "#8E96A6", dessus: "#B8BFCC", div: false });
    [[-220, -140], [60, -140], [-220, 20], [60, 20]].forEach(function (p) { o.push({ f: "cylindre", c: [p[0], -2, p[1]], r: 5, h: 122, n: 8, coul: "#6B4423" }); });
    for (k = 0; k < 9; k++) o.push({ f: "sphere", c: [-190 + (k % 3) * 34, 12 + Math.floor(k / 3) * 22, -100 + (k % 2) * 8], r: [17, 12, 13], n: 14, m: 8, coul: "#C9B28A" });
    o.push({ f: "boite", c: [10, 0, -40], d: [70, 8, 50], coul: "#5C6478", dessus: "#8E96A6", div: false });
    o.push({ f: "boite", c: [40, 8, -40], d: [6, 70, 6], coul: "#5C6478", div: false });
    o.push({ f: "boite", c: [40, 78, -40], d: [70, 6, 6], coul: "#5C6478", div: false });
    o.push({ f: "sphere", c: [10, 22, -40], r: [18, 13, 14], n: 14, m: 8, coul: "#C9B28A" });
    for (k = 0; k < 7; k++) o.push({ f: "cylindre", c: [180 + Math.cos(k) * 22, 0, 60 + Math.sin(k) * 22], r: 5, h: 50, n: 6, axe: "x", coul: "#4E2A10" });
    for (k = 0; k < 6; k++) o.push({ f: "cone", c: [180 + (k % 3 - 1) * 14, 4, 60 + (k > 2 ? 10 : -10)], r: 14 - k, h: 36 + k * 6, n: 10, coul: k % 2 ? "#F2994A" : "#E8492E", ec: feu });
    for (k = 0; k < 5; k++) o.push({ f: "sphere", c: [180 + k * 6, 70 + k * 22, 60 - k * 4], r: 12 + k * 4, coul: "#9AA3B2", op: 0.45 - k * 0.07 });
    o.push({ f: "sphere", c: [150, 14, 90], r: [16, 11, 12], n: 14, m: 8, coul: "#3B2A1A" });
    return o;
  }
  var ETAPES_VC = ["Banda arrive à Tanga avec son cacao, le jour du marché.", "Au Contrôle, son cacao est déclaré mauvais et jeté au feu.", "Banda se bat avec les gardes et passe au commissariat.", "La nuit, il rencontre Odilia, qui cherche son frère Koumé.", "Koumé meurt après la révolte des ouvriers.", "Banda trouve la valise des commerçants grecs et reçoit dix mille francs.", "Il conduit Odilia à Bamila, chez sa mère."];
  remplacer("3e-fr-ville-cruelle", {
    c: "3e", m: "francais", titre: "Lecture suivie : Ville cruelle d'Eza Boto", duree: 35,
    accroche: "« C'est l'histoire d'amour de Banda et Odilia ! » — « Non, c'est un roman contre la colonisation ! » L'exposé de la 3ᵉ B tourne au débat.",
    intro: "La préparation d'un exposé sur le roman te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois lectures du titre.",
    objectifs: ["situer l'auteur et l'œuvre", "décrire les lieux et les personnages", "résumer l'intrigue en quatre temps", "dégager les grands thèmes et justifier le titre"],
    enquete: {
      titre: "L'exposé de la 3ᵉ B sur Ville cruelle",
      svg: (function () {
        var s = "<rect width='640' height='220' fill='#F4EFE4'/><rect x='40' y='30' width='130' height='170' rx='4' fill='#7A1F1F'/><rect x='48' y='38' width='114' height='154' fill='#8E2A2A'/>" + txt(105, 90, "VILLE", { s: 18, c: "#F4E7C5" }) + txt(105, 114, "CRUELLE", { s: 18, c: "#F4E7C5" }) + txt(105, 160, "Eza Boto", { s: 12, c: "#F4E7C5", i: true }) + txt(105, 182, "1954", { s: 11, c: "#F4E7C5", w: 500 });
        s += perso(280, 110, "#5A3A1E", "#F7C948", "#1E499B") + perso(500, 110, "#6B4423", "#DCE6F2", "#2E3445") + bulle(200, 40, 190, "Une histoire d'amour !", "#C2540A") + bulle(410, 40, 210, "Un roman anticolonial !", BLEU);
        return svg(640, 220, "La couverture du roman Ville cruelle et deux élèves qui débattent de son sens", "", s);
      })(),
      legende: "Au CES de Mbalmayo, la ville natale de Mongo Beti : la 3ᵉ B prépare un exposé sur l'œuvre au programme.",
      contexte: "<p>Pour l'exposé, il faut expliquer le titre. Clarisse soutient : « C'est surtout l'histoire d'amour entre Banda et Odilia ; la ville est cruelle parce qu'elle les sépare. » Ibrahim répond : « Non, c'est uniquement un roman contre les Blancs. » Le professeur demande de s'appuyer sur des épisodes précis et sur le sous-titre implicite de l'œuvre : la vie d'un paysan face à la ville coloniale.</p>",
      documents: [{ t: "Le début du chapitre sur le Contrôle (résumé)", html: "<p>Au Contrôle, les fonctionnaires examinent les sacs de cacao. Celui de Banda, fruit d'une année entière de travail, est déclaré « mauvais » et jeté au feu, sans discussion possible.</p>" }],
      question: "Pourquoi le titre Ville cruelle convient-il au roman ?",
      tache: "Rédige l'introduction et le plan de l'exposé, puis une conclusion qui justifie le titre par trois épisodes précis.",
      hypotheses: ["C'est avant tout une histoire d'amour : la ville est cruelle parce qu'elle sépare Banda et Odilia.", "C'est seulement un roman contre les Blancs.", "La ville coloniale est cruelle par son injustice économique et sa violence, envers Banda et les siens, et le roman montre aussi les limites du village."]
    },
    parties: [
      { t: "L'auteur et l'œuvre", html: partie(VC_OLD, 0),
        retenir: "Eza Boto = Mongo Beti ; Ville cruelle, 1954, Présence Africaine." },
      { t: "Les lieux et les personnages", html: partie(VC_OLD, 1),
        planches: [{ type: "2D", titre: "Tanga, une ville coupée en deux", legende: "Tanga-Sud : maisons en dur des commerçants grecs et de l'administration, avec le Contrôle du cacao. Tanga-Nord : cases des Africains (Moko). La piste mène au village de Bamila, au milieu de la forêt.", svg: (function () {
          var s = "<rect width='640' height='340' fill='#DCE9D2'/><path d='M0 170C160 160 300 190 640 160' stroke='#5BA3D9' stroke-width='14' fill='none'/>" + txt(560, 150, "rivière", { s: 11, c: "#2F6DB5", i: true });
          s += "<rect x='20' y='20' width='380' height='130' rx='12' fill='#EFE6D6' opacity='.8'/>" + txt(210, 42, "TANGA-SUD", { s: 14, c: "#7A1F1F" });
          [[60, 70], [130, 60], [200, 80], [280, 66], [340, 90]].forEach(function (p) { s += "<rect x='" + p[0] + "' y='" + p[1] + "' width='46' height='34' fill='#E9E2D2' stroke='#8A6E4B'/><path d='M" + (p[0] - 4) + " " + p[1] + "h54l-27 -16Z' fill='#B33A2C'/><rect x='" + (p[0] + 18) + "' y='" + (p[1] + 16) + "' width='10' height='18' fill='#6B4423'/>"; });
          s += "<rect x='230' y='106' width='110' height='30' fill='#C9C1B2' stroke='#7A6A55'/>" + txt(285, 126, "le Contrôle", { s: 11.5, c: "#7A1F1F" });
          s += "<rect x='20' y='196' width='380' height='126' rx='12' fill='#E9DDC0' opacity='.8'/>" + txt(210, 314, "TANGA-NORD (Moko)", { s: 14, c: "#6D4A00" });
          for (var k = 0; k < 10; k++) { var x = 50 + (k % 5) * 70, y = 220 + Math.floor(k / 5) * 46; s += "<ellipse cx='" + x + "' cy='" + (y + 28) + "' rx='20' ry='5' fill='#001136' opacity='.12'/><rect x='" + (x - 16) + "' y='" + (y + 6) + "' width='32' height='22' fill='#B98A55'/><path d='M" + (x - 22) + " " + (y + 8) + "L" + x + " " + (y - 10) + "L" + (x + 22) + " " + (y + 8) + "Z' fill='#C9A86B'/>"; }
          s += "<path d='M400 250C460 260 500 230 560 250' stroke='#A3824A' stroke-width='6' stroke-dasharray='10 6' fill='none'/>";
          for (k = 0; k < 14; k++) s += "<circle cx='" + (470 + (k % 5) * 30) + "' cy='" + (200 + Math.floor(k / 5) * 40 + (k % 2) * 10) + "' r='16' fill='#2E6B34'/>";
          s += "<rect x='560' y='240' width='26' height='18' fill='#B98A55'/><path d='M554 242L573 228L592 242Z' fill='#C9A86B'/>" + txt(574, 290, "Bamila", { s: 13, c: "#1B5E20", halo: true });
          return svg(640, 340, "Plan de Tanga : au nord les maisons en dur et le Contrôle, au sud les cases de Moko, et la piste vers le village de Bamila dans la forêt", rad("vcCv", ["#E9D27A", "#C9A227", "#8A6A1A"]), s);
        })() }],
        fil: { html: "<p>La ville est construite sur une séparation : d'un côté les commerçants et l'administration, de l'autre les Africains. Cette géographie dit déjà l'injustice : ce n'est pas un simple décor pour une histoire d'amour.</p>" },
        retenir: "Tanga-Sud (commerce, administration) / Tanga-Nord (Africains) ; Bamila, le village." },
      { t: "L'intrigue en quatre temps", html: partie(VC_OLD, 2),
        planches: [{ type: "3d", titre: "Le Contrôle du cacao", legende: "Tourne la scène : sous le hangar, les sacs de cacao attendent ; le sac de Banda est sur la bascule ; à droite, le feu où l'on jette le cacao déclaré « mauvais ». Une année de travail part en fumée.",
          modele: { h: 340, rx: -24, ry: 24, echelle: 0.85, alt: "Hangar du contrôle avec des sacs de cacao, une bascule et un feu où brûlent des sacs", objets: controle3D(),
            etiquettes: [{ p: [-160, 50, -100], t: "Sacs de cacao" }, { p: [40, 82, -40], t: "La bascule du Contrôle", cote: "d" }, { p: [180, 50, 60], t: "Le feu", cote: "d" }] } }],
        fil: { html: "<p>Le cacao de Banda, une année de travail, est brûlé sans recours ; Banda est frappé par les gardes ; Koumé meurt après s'être révolté contre un patron qui ne payait pas. La rencontre avec Odilia ne vient qu'ensuite : l'amour n'est pas le cœur du roman.</p>", verdicts: [[0, "rejetee", "L'histoire d'amour est secondaire : le roman s'ouvre sur l'injustice du Contrôle."]] },
        retenir: "Humiliation, rencontre, mort de Koumé, dénouement." },
      { t: "Les grands thèmes", html: partie(VC_OLD, 3) +
        "<div class='attention'><b>Nuance</b>Le roman ne se réduit pas à une opposition entre Blancs et Noirs : les gardes régionaux et certains intermédiaires sont africains, et le village de Bamila, dominé par les vieillards, étouffe aussi Banda.</div>",
        planches: [{ type: "2D", titre: "Le fruit du travail de Banda", legende: "Une cabosse mûre de cacao, ses fèves, puis les fèves séchées dans le sac : il faut une année de soins pour que le cacao arrive au marché de Tanga.", svg: svg(640, 220, "Cabosses de cacao mûres et vertes, fèves et sac de jute", rad("vcCm", ["#F2B05E", "#D9822B", "#8E4A18"]) + rad("vcCv", ["#E9D27A", "#C9A227", "#8A6A1A"]), "<rect width='640' height='220' fill='#F4EFE4'/><path d='M60 30v170' stroke='#6B4423' stroke-width='12'/>" + cabosse(110, 80, 40, 20, true) + cabosse(100, 150, 34, -15, false) + "<path d='M200 110h60' stroke='#8A6E4B' stroke-width='3' marker-end='url(#vcf)'/>" + [0, 1, 2, 3, 4, 5, 6, 7].map(function (k) { return "<ellipse cx='" + (300 + (k % 4) * 26) + "' cy='" + (96 + Math.floor(k / 4) * 26) + "' rx='11' ry='7' fill='#5A2E0A' transform='rotate(" + (k * 25) + " " + (300 + (k % 4) * 26) + " " + (96 + Math.floor(k / 4) * 26) + ")'/>"; }).join("") + "<path d='M420 110h60' stroke='#8A6E4B' stroke-width='3' marker-end='url(#vcf)'/><path d='M500 60c-10 30 -10 110 0 130h90c10 -20 10 -100 0 -130Z' fill='#C9B28A' stroke='#8A6E4B' stroke-width='2'/><path d='M505 80h80M505 120h80M505 160h80' stroke='#A3824A'/>" + txt(500, 210, "un sac, une année de travail", { s: 11.5, c: "#6D4A00", a: "end" })).replace("</defs>", fleche("vcf", "#8A6E4B") + "</defs>") }],
        fil: { html: "<p>La « cruauté » de la ville tient à son système : contrôle arbitraire, violence des gardes, exploitation par les commerçants, et elle frappe aussi par des Africains. Réduire le roman à « contre les Blancs » oublie cette mécanique et la critique du village.</p>", verdicts: [[1, "rejetee", "Le roman vise un système (colonial et social), y compris ses relais africains et le poids des vieillards."], [2, "validee", "Injustice économique, violence, mais aussi limites du village."]] },
        retenir: "Injustice coloniale, ville et village, révolte individuelle, la mère." }
    ],
    denouement: {
      titre: "Pourquoi « Ville cruelle »",
      etapes: ["Tanga, ville divisée entre colons et Africains (indice 2).", "Le cacao brûlé, les coups des gardes, la mort de Koumé (indice 3).", "Un système, avec ses relais africains, et un village qui étouffe aussi (indice 4)."],
      reponse: "<p>Le titre Ville cruelle convient parce que Tanga, la ville coloniale, broie ceux qui y viennent. Elle est cruelle par son injustice économique : le cacao de Banda, fruit d'une année de travail, est déclaré mauvais et jeté au feu au Contrôle. Elle est cruelle par sa violence : les gardes régionaux le frappent et le conduisent au commissariat, et Koumé meurt après s'être révolté contre un patron qui refusait de payer ses ouvriers. L'histoire d'Odilia et de Banda n'est donc pas le centre du roman, mais une rencontre née de cette violence. Le roman ne se limite pas non plus à « contre les Blancs » : il dénonce un système et ses relais, y compris africains, et montre aussi le village de Bamila, protecteur mais étouffant. Banda finit par quitter les deux, avec l'argent de la valise rendue aux Grecs.</p>",
      transfert: "<p>Choisis un autre épisode du roman et montre, en cinq lignes, qu'il illustre lui aussi la cruauté de la ville.</p>"
    },
    revision: (VC_OLD ? VC_OLD.revision : []).concat(["Titre : injustice économique (cacao brûlé), violence (gardes, mort de Koumé), système colonial et ses relais.", "Ville et village : Tanga détruit, Bamila étouffe."]),
    exo: VC_OLD ? VC_OLD.exo : "",
    quiz: (VC_OLD ? VC_OLD.quiz : []).concat([
      q("En quelle année paraît Ville cruelle ?", "1954", "1960", "1884", "Chez Présence Africaine."),
      q("Que devient le cacao de Banda au Contrôle ?", "il est jeté au feu", "il est acheté très cher", "il est envoyé en Europe", "Déclaré « mauvais »."),
      q("Qui est Koumé ?", "le frère d'Odilia", "le père de Banda", "un commerçant grec", "Il est en fuite après la révolte des ouvriers."),
      q("Comment s'appelle le village de Banda ?", "Bamila", "Tanga", "Moko", "Moko est un quartier de Tanga."),
      q("Que trouve Banda dans une rigole ?", "la valise de commerçants grecs", "un sac de cacao", "une lettre de sa mère", "Il la rend et reçoit dix mille francs."),
      q("Mongo Beti est né près de…", "Mbalmayo", "Garoua", "Bafoussam", "Au sud du Cameroun.")
    ]).slice(0, 10)
  });

  /* ═══════════════════════ Tle — NAISSANCE : TRADITION ET VIE MODERNE ═══════════════════════ */
  var CN_OLD = ancien("tle-cult-naissance");
  function naissance3D() {
    var o = [], k;
    o.push({ f: "boite", c: [0, -10, 0], d: [600, 8, 280], coul: "#A9B46A", dessus: "#BCC77A" });
    o.push({ f: "cylindre", c: [-160, -2, 0], r: 60, h: 60, n: 28, coul: "#B98A55", dessus: "#C99A65" });
    o.push({ f: "cone", c: [-160, 58, 0], r: 78, h: 64, n: 28, coul: "#C9A86B" });
    o.push({ f: "boite", c: [-160, 0, -60], d: [26, 40, 4], coul: "#5D3A1E", div: false });
    o.push({ f: "boite", c: [140, -2, 0], d: [200, 90, 110], coul: "#F1ECE2", dessus: "#E3DED2", div: false });
    o.push({ f: "boite", c: [140, 88, 0], d: [210, 8, 120], coul: "#B33A2C", dessus: "#C44A3C", div: false });
    o.push({ f: "boite", c: [140, 50, -56], d: [30, 8, 2], coul: "#C62828", div: false });
    o.push({ f: "boite", c: [140, 40, -56], d: [8, 28, 2], coul: "#C62828", div: false });
    for (k = 0; k < 3; k++) o.push({ f: "boite", c: [70 + k * 70, 20, -56], d: [34, 26, 2], coul: "#9FC5E8", div: false });
    o.push({ f: "boite", c: [140, -2, -60], d: [40, 46, 4], coul: "#1E499B", div: false });
    o.push({ f: "boite", c: [0, -4, -80], d: [140, 4, 30], coul: "#C9B28A", div: false });
    return o;
  }
  remplacer("tle-cult-naissance", {
    c: "Tle A", m: "cultures", titre: "Naissance : pratiques traditionnelles et vie moderne", duree: 30,
    accroche: "Grand-mère veut que l'enfant naisse au village ; papa veut la maternité. Et l'acte de naissance, qui y pense ?",
    intro: "La naissance attendue dans une famille de Mbalmayo te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois positions.",
    objectifs: ["décrire des pratiques traditionnelles liées à la naissance", "expliquer l'apport des soins modernes et de l'acte de naissance", "distinguer ce qu'il faut valoriser et ce qu'il faut questionner", "dialoguer avec les aînés sans mépriser la tradition"],
    enquete: {
      titre: "La naissance attendue chez les Ndzana",
      svg: svg(640, 220, "Une grand-mère, un père et une future mère discutent ; à gauche une case du village, à droite une maternité", "", "<rect width='640' height='220' fill='#EEF4E6'/><rect y='186' width='640' height='34' fill='#BCC77A'/><ellipse cx='80' cy='186' rx='56' ry='6' fill='#001136' opacity='.12'/><rect x='40' y='136' width='80' height='50' fill='#B98A55'/><path d='M28 140L80 92L132 140Z' fill='#C9A86B'/><rect x='500' y='110' width='120' height='76' fill='#F1ECE2' stroke='#C9C1B2'/><rect x='494' y='104' width='132' height='8' fill='#B33A2C'/><path d='M554 126h12M560 120v12' stroke='#C62828' stroke-width='4'/>" + txt(560, 176, "maternité", { s: 11, c: GRIS }) + perso(220, 100, "#6B4423", "#7B3F99", "#7B3F99") + perso(320, 100, "#5A3A1E", "#F2994A", "#F2994A") + perso(420, 100, "#6B4423", "#1E499B", "#2E3445") + bulle(150, 40, 150, "Au village, comme moi !", "#7B3F99") + bulle(370, 40, 160, "À la maternité !", BLEU)),
      legende: "À Mbalmayo : la famille Ndzana attend un enfant ; la grand-mère, le père et la future mère ne sont pas d'accord.",
      contexte: "<p>Mama Ndzana, la grand-mère, veut que sa belle-fille accouche au village, aidée par une matrone, et que l'on attende la <strong>cérémonie de nomination</strong> pour « déclarer » l'enfant. Le père veut la <strong>maternité</strong> de l'hôpital de district, mais pense que l'acte de naissance « peut attendre ». La future mère voudrait garder les deux : la sécurité de la maternité et l'accueil traditionnel de l'enfant par la famille.</p>",
      documents: [{ t: "Ce que dit la sage-femme du centre de santé", html: "<p>« Les consultations prénatales permettent de repérer à temps les grossesses à risque. Accoucher dans une formation sanitaire réduit fortement les décès des mères et des nouveau-nés. Et déclarez la naissance à l'état civil dans les délais fixés par la loi : sans acte de naissance, l'enfant ne pourra pas s'inscrire aux examens officiels. »</p>" }],
      question: "Comment concilier les pratiques traditionnelles de la naissance et les exigences de la vie moderne ?",
      tache: "Propose à la famille Ndzana un « plan de naissance » qui respecte la tradition et protège la mère et l'enfant, en dix lignes.",
      hypotheses: ["La tradition suffit : l'accouchement au village et la nomination remplacent l'hôpital et l'état civil.", "La vie moderne doit tout remplacer : les pratiques traditionnelles sont dépassées.", "Garder ce qui protège et rassemble (accueil, nom, solidarité), adopter ce qui sauve des vies et donne des droits (maternité, acte de naissance)."]
    },
    parties: [
      { t: "Les pratiques traditionnelles", html: partie(CN_OLD, 0),
        planches: [{ type: "3d", titre: "La case du village et la maternité", legende: "Tourne la scène : à gauche, la case familiale où l'on accueille l'enfant et sa mère ; à droite, la maternité, avec sa croix rouge. Le chemin entre les deux, c'est le dialogue entre tradition et vie moderne.",
          modele: { h: 320, rx: -22, ry: 18, echelle: 0.9, alt: "Case ronde au toit de paille et bâtiment de maternité au toit rouge avec une croix", objets: naissance3D(),
            etiquettes: [{ p: [-160, 124, 0], t: "La case familiale" }, { p: [140, 96, 0], t: "La maternité", cote: "d" }] } }],
        fil: { html: "<p>La protection de la mère, la présentation de l'enfant, le choix du nom et la solidarité autour de la jeune mère ont une vraie valeur : ils inscrivent l'enfant dans une famille et une histoire. Mais ils ne protègent pas contre une hémorragie ou une infection.</p>" },
        retenir: "Protection de la mère, accueil de l'enfant, nom, solidarité." },
      { t: "La rencontre avec la vie moderne", html: partie(CN_OLD, 1),
        planches: [{ type: "2D", titre: "Le parcours de l'enfant, de la grossesse à l'école", legende: "Consultations prénatales, accouchement à la maternité, déclaration à l'état civil puis acte de naissance, et, à côté, la présentation à la famille et la fête de nomination : les deux chemins se rejoignent.", svg: (function () {
          var E = [["Consultations prénatales", "#2E7D32"], ["Accouchement à la maternité", "#1E88E5"], ["Déclaration à l'état civil", "#7B3F99"], ["Acte de naissance", "#7B3F99"], ["École, examens officiels", "#C2540A"]], T = [["Conseils des aînées", 0], ["Présentation à la famille", 2], ["Fête de nomination", 3]], s = "";
          E.forEach(function (e, i) { var x = 14 + i * 126; s += "<rect x='" + x + "' y='70' width='116' height='56' rx='12' fill='" + e[1] + "'/>" + e[0].split(" ").reduce(function (acc, w) { var l = acc[acc.length - 1]; if ((l + " " + w).length > 14 && l) acc.push(w); else acc[acc.length - 1] = (l ? l + " " : "") + w; return acc; }, [""]).map(function (l, k, a) { return txt(x + 58, 100 - (a.length - 1) * 7 + k * 14, l, { s: 11, c: "#fff" }); }).join("") + (i < 4 ? "<path d='M" + (x + 117) + " 98h8' stroke='" + NUIT + "' stroke-width='2' marker-end='url(#cnf)'/>" : ""); });
          T.forEach(function (t) { var x = 14 + t[1] * 126 + 58; s += "<path d='M" + x + " 128V168' stroke='#A3824A' stroke-width='2' stroke-dasharray='4 4'/><rect x='" + (x - 62) + "' y='168' width='124' height='40' rx='12' fill='#F4E7C5' stroke='#C9A86B'/>" + txt(x, 192, t[0], { s: 10.5, c: "#6D4A00" }); });
          s += txt(320, 40, "vie moderne", { s: 13, c: BLEU }) + txt(320, 236, "tradition", { s: 13, c: "#6D4A00" });
          return svg(640, 250, "Frise : consultations prénatales, accouchement, déclaration, acte de naissance, école, avec en dessous les étapes traditionnelles", fleche("cnf", NUIT), s);
        })() }],
        fil: { html: "<p>La sage-femme le rappelle (document) : les consultations et la maternité sauvent des vies ; la déclaration à l'état civil, dans les délais légaux, donne à l'enfant une existence juridique. Attendre la nomination pour déclarer l'enfant risque de le priver de ses droits.</p>", verdicts: [[0, "rejetee", "La tradition ne protège pas des complications de l'accouchement et ne remplace pas l'état civil."]] },
        retenir: "Maternité et acte de naissance : santé et droits de l'enfant." },
      { t: "Garder un regard critique", html: partie(CN_OLD, 2),
        fil: { html: "<p>Supprimer toutes les pratiques traditionnelles priverait l'enfant de l'accueil, du nom et de la solidarité familiale, sans gain pour sa santé. La position de la future mère est la plus juste : maternité et état civil d'abord, puis présentation et nomination en famille.</p>", verdicts: [[1, "rejetee", "Les pratiques qui protègent et rassemblent n'ont pas à disparaître."], [2, "validee", "Valoriser ce qui rassemble, adopter ce qui protège et donne des droits."]] },
        retenir: "Respect et esprit critique : dialoguer avec les aînés." }
    ],
    denouement: {
      titre: "Le plan de naissance de la famille Ndzana",
      etapes: ["Consultations prénatales et accouchement à la maternité (indice 2).", "Déclaration de la naissance à l'état civil dans les délais (indice 2).", "Présentation à la famille, nomination et solidarité autour de la mère (indices 1 et 3)."],
      reponse: "<p>La famille Ndzana peut concilier tradition et vie moderne. La future mère suit les consultations prénatales et accouche à la maternité de l'hôpital de district, qui réduit fortement les risques de décès de la mère et de l'enfant. Dès la naissance, le père la déclare à l'état civil dans les délais fixés par la loi, pour que l'enfant ait un acte de naissance, indispensable à sa scolarité et à ses droits. Au retour de la maternité, la grand-mère organise la présentation de l'enfant à la famille et la cérémonie de nomination, et les femmes de la famille entourent la jeune mère pendant plusieurs semaines. On garde ainsi ce qui protège et rassemble, et l'on renonce seulement à ce qui mettrait la santé ou les droits de l'enfant en danger.</p>",
      transfert: "<p>Interroge une aînée de ta famille sur une pratique liée à la naissance. Dis en cinq lignes si elle doit être conservée, adaptée ou abandonnée, et pourquoi.</p>"
    },
    revision: (CN_OLD ? CN_OLD.revision : []).concat(["Maternité : moins de décès des mères et des nouveau-nés.", "Acte de naissance : existence juridique, inscription aux examens."]),
    exo: CN_OLD ? CN_OLD.exo : "",
    quiz: [
      q("À quoi sert l'acte de naissance ?", "À donner une existence juridique à l'enfant", "À choisir son prénom", "À remplacer la nomination", "Sans lui, pas d'examens officiels."),
      q("Une pratique traditionnelle fréquente :", "la nomination de l'enfant", "la vaccination", "l'échographie", "Fête de nomination."),
      q("Quelle attitude adopter ?", "Respect et esprit critique", "Mépris de la tradition", "Refus de la vie moderne", "Dialoguer avec les aînés."),
      q("Les consultations prénatales permettent de…", "repérer à temps les grossesses à risque", "choisir le nom de l'enfant", "éviter l'état civil", "Suivi médical."),
      q("Accoucher à la maternité…", "réduit les décès des mères et des enfants", "est interdit par la tradition", "ne change rien", "Soins en cas de complication."),
      q("Quand déclarer la naissance ?", "dans les délais fixés par la loi", "après la nomination seulement", "à l'entrée au collège", "À l'état civil."),
      q("Une pratique à valoriser :", "la solidarité autour de la jeune mère", "le refus des soins", "un interdit alimentaire nuisible", "Ce qui protège et rassemble."),
      q("Une pratique à questionner :", "un interdit qui met la santé en danger", "le choix du nom", "la présentation à la famille", "Ce qui nuit à la santé."),
      q("Le nom de l'enfant est souvent choisi pour…", "honorer un parent ou rappeler une circonstance", "plaire à l'administration", "remplacer l'acte de naissance", "Transmission familiale."),
      q("Pour faire évoluer une pratique, il faut…", "dialoguer avec les aînés", "l'interdire brutalement", "l'ignorer", "Sans mépriser.")
    ]
  });

  /* ═══════════════════════ Tle — FUNÉRAILLES : TRADITION ET VIE MODERNE ═══════════════════════ */
  var CM_OLD = ancien("tle-cult-mort");
  var BUDGET = [["Morgue et transport", 450000, "#5C6478"], ["Cercueil", 400000, "#6B4423"], ["Réception (repas, boissons)", 1200000, "#C2540A"], ["Chaises, bâches, sonorisation", 350000, "#1E88E5"], ["Tenues (pagne commun)", 400000, "#7B3F99"], ["Cérémonies (veillée, rites, culte)", 200000, "#2E7D32"]];
  function tamtam3D() {
    var o = [], k;
    o.push({ f: "boite", c: [0, -10, 0], d: [520, 8, 240], coul: "#B9905E", dessus: "#C9A06E" });
    o.push({ f: "cylindre", c: [-200, 30, -40], r: 40, h: 300, n: 30, axe: "x", coul: "#6B3E1E", dessus: "#8B5A2B" });
    o.push({ f: "boite", c: [-50, 70, -40], d: [220, 2, 10], coul: "#1F1209", div: false });
    [[-180, -40], [80, -40]].forEach(function (p) { o.push({ f: "boite", c: [p[0], -6, p[1] - 30], d: [10, 30, 10], coul: "#5D3A1E", div: false }); o.push({ f: "boite", c: [p[0], -6, p[1] + 30], d: [10, 30, 10], coul: "#5D3A1E", div: false }); });
    [-1, 1].forEach(function (sg) { o.push({ f: "cylindre", c: [-60 + sg * 70, 76, 30], r: 3, h: 80, n: 6, axe: "z", coul: "#8B5A2B" }); });
    for (k = 0; k < 8; k++) { o.push({ f: "boite", c: [-200 + k * 52, 0, 100], d: [36, 26, 34], coul: "#E9EEF3", dessus: "#F7F9FB", div: false }); o.push({ f: "boite", c: [-200 + k * 52, 26, 116], d: [36, 34, 4], coul: "#E9EEF3", div: false }); }
    o.push({ f: "boite", c: [0, 110, 100], d: [460, 4, 90], coul: "#1E88E5", dessus: "#2F9BEF", op: 0.85, div: false });
    return o;
  }
  remplacer("tle-cult-mort", {
    c: "Tle A", m: "cultures", titre: "Funérailles : tradition et vie moderne", duree: 30,
    accroche: "3 millions de francs pour les funérailles de Papa Kamga, pendant que les enfants risquent de quitter l'école. Faut-il réduire ?",
    intro: "Les funérailles d'un grand-père à Bafang te servent de fil rouge : à chaque partie, un indice t'aide à trancher entre trois positions.",
    objectifs: ["décrire les étapes des funérailles et leur sens", "expliquer ce que la vie moderne a changé", "argumenter sur le coût des funérailles", "proposer des solutions qui respectent le défunt et les vivants"],
    enquete: {
      titre: "Le conseil de famille des Kamga",
      svg: svg(640, 220, "Une réunion de famille sous une bâche bleue, avec un tableau de dépenses et un tambour à fente", "", "<rect width='640' height='220' fill='#F2EEE6'/><path d='M20 40h600l-20 30h-560Z' fill='#1E88E5'/><rect x='40' y='70' width='4' height='130' fill='#8E96A6'/><rect x='596' y='70' width='4' height='130' fill='#8E96A6'/>" + perso(120, 110, "#5A3A1E", "#7A6A55", "#5A5F6B") + perso(220, 110, "#6B4423", "#7B3F99", "#7B3F99") + perso(320, 110, "#5A3A1E", "#DCE6F2", "#1E499B") + "<rect x='400' y='86' width='200' height='110' rx='8' fill='#fff' stroke='#C9D2E3'/>" + txt(414, 108, "Budget prévu", { s: 12, a: "start", c: ROUGE }) + BUDGET.slice(0, 5).map(function (b, i) { return txt(414, 124 + i * 13, b[0].split(" (")[0].slice(0, 24), { s: 9.5, a: "start", w: 500 }) + txt(590, 124 + i * 13, b[1].toLocaleString("fr-FR"), { s: 9.5, a: "end", w: 600 }); }).join("") + "<path d='M414 182h176' stroke='#C9D2E3'/>" + txt(590, 194, "total : 3 000 000 F", { s: 11, a: "end", c: ROUGE })),
      legende: "À Bafang : la famille Kamga se réunit après le décès du grand-père pour préparer ses funérailles.",
      contexte: "<p>Papa Kamga est décédé à Douala ; son corps est à la morgue. Le conseil de famille prévoit <strong>3 000 000 F</strong> de dépenses. L'oncle aîné déclare : « Un grand homme mérite de grandes funérailles, sinon c'est la honte. » Sa petite-fille Carine, élève de Terminale, rappelle que les frais de scolarité de quatre enfants de la famille, environ <strong>600 000 F</strong>, ne sont pas payés. Un cousin propose de « tout supprimer et de l'enterrer simplement à Douala ».</p>",
      documents: [{ t: "Décision du comité de développement d'un village de l'Ouest (exemple)", html: "<p>« Les funérailles se tiennent sur une seule journée ; la réception est limitée aux repas ; l'achat d'un pagne commun n'est plus obligatoire. Les économies sont versées à une caisse de solidarité pour la scolarité des orphelins. »</p>" }],
      question: "Faut-il limiter les dépenses des funérailles, et comment le faire sans manquer de respect au défunt ?",
      tache: "Rédige l'intervention de Carine au conseil de famille : un budget révisé et trois arguments qui respectent le défunt et les vivants.",
      hypotheses: ["Il faut dépenser sans compter : l'honneur de la famille est en jeu.", "Il faut tout supprimer : les traditions funéraires coûtent trop cher et ne servent à rien.", "Il faut garder le sens des rites (honorer, réunir, transmettre) et limiter les dépenses de prestige, pour protéger les vivants."]
    },
    parties: [
      { t: "Les étapes", html: partie(CM_OLD, 0),
        planches: [{ type: "3d", titre: "Le tam-tam d'appel et la place des funérailles", legende: "Tourne la scène : le tambour à fente, taillé dans un tronc évidé, annonçait autrefois le décès d'un village à l'autre ; sous la bâche bleue, les rangées de chaises louées pour la veillée et la réception.",
          modele: { h: 320, rx: -22, ry: 22, echelle: 0.85, alt: "Grand tambour à fente en bois sur des supports, rangées de chaises blanches sous une bâche bleue", objets: tamtam3D(),
            etiquettes: [{ p: [-60, 74, -40], t: "Tambour à fente (tam-tam)" }, { p: [120, 30, 100], t: "Chaises louées", cote: "d" }, { p: [200, 114, 100], t: "Bâche", cote: "d" }] } }],
        fil: { html: "<p>Annonce, veillée, inhumation, deuil, funérailles : chaque étape a un sens. Elles honorent le défunt, réunissent la famille dispersée et transmettent la mémoire du lignage. Supprimer tout cela, comme le propose le cousin, ferait perdre ce sens.</p>", verdicts: [[1, "rejetee", "Les rites ont un sens (honorer, réunir, transmettre) ; il n'est pas nécessaire de tout supprimer."]] },
        retenir: "Annonce, veillée, inhumation, deuil, funérailles." },
      { t: "Ce qui change", html: partie(CM_OLD, 1),
        planches: [{ type: "2D", titre: "Où va l'argent des funérailles ?", legende: "Le budget prévu par la famille Kamga (3 000 000 F) : la réception en représente plus du tiers ; les rites et cérémonies proprement dits, moins d'un dixième.", svg: (function () {
          var tot = BUDGET.reduce(function (a, b) { return a + b[1]; }, 0), x = 30, s = "";
          BUDGET.forEach(function (b) { var w = b[1] / tot * 580; s += "<rect x='" + x + "' y='60' width='" + (w - 2) + "' height='60' rx='6' fill='" + b[2] + "'/>" + (w > 60 ? txt(x + w / 2, 96, Math.round(b[1] / tot * 100) + " %", { s: 13, c: "#fff" }) : ""); x += w; });
          BUDGET.forEach(function (b, i) { var xx = 30 + (i % 2) * 300, yy = 146 + Math.floor(i / 2) * 22; s += "<rect x='" + xx + "' y='" + (yy - 11) + "' width='14' height='14' rx='3' fill='" + b[2] + "'/>" + txt(xx + 20, yy, b[0] + " : " + b[1].toLocaleString("fr-FR") + " F", { s: 10.5, a: "start", w: 600 }); });
          s += txt(320, 40, "Budget prévu : 3 000 000 F", { s: 14, c: ROUGE });
          return svg(640, 230, "Barre découpée en six postes de dépenses ; la réception représente 40 pour cent", "", s);
        })() }],
        fil: { html: "<p>La morgue, la location du matériel, la réception et les pagnes ont fait exploser les coûts. Or ce sont surtout des dépenses de <strong>prestige</strong>, pas les rites eux-mêmes. Dépenser sans compter, pendant que quatre enfants risquent de quitter l'école, n'honore pas vraiment le défunt.</p>", verdicts: [[0, "rejetee", "L'honneur ne justifie pas de sacrifier la scolarité des vivants."]] },
        retenir: "Morgue, rites mêlés, coût en hausse." },
      { t: "Le débat", html: partie(CM_OLD, 2),
        fil: { html: "<p>Le document montre une solution déjà adoptée par certaines communautés : une seule journée, une réception limitée, un pagne facultatif, et une caisse de solidarité pour les orphelins. Le simulateur montre qu'en limitant la réception et les tenues, la famille Kamga paie la scolarité sans renoncer aux rites.</p>", verdicts: [[2, "validee", "Garder le sens des rites, limiter le prestige, protéger les vivants."]] },
        retenir: "Dette d'honneur et ciment social, mais pas au détriment des vivants." }
    ],
    denouement: {
      titre: "L'intervention de Carine",
      etapes: ["Les rites ont un sens : honorer, réunir, transmettre (indice 1).", "La réception et les tenues pèsent plus que les rites eux-mêmes (indice 2).", "Budget révisé et caisse de solidarité scolaire (indice 3)."],
      reponse: "<p>« Nous voulons tous honorer Papa Kamga. Les funérailles ont un sens : elles réunissent la famille dispersée, disent notre respect et transmettent sa mémoire ; il ne faut donc pas tout supprimer. Mais regardons le budget : la réception (1 200 000 F) et les tenues (400 000 F) pèsent bien plus que les cérémonies elles-mêmes (200 000 F). En organisant les funérailles sur une journée, avec une réception limitée aux repas et un pagne facultatif, nous pouvons économiser environ 900 000 F, payer les 600 000 F de scolarité des quatre enfants et ouvrir une caisse de solidarité. Grand-père, qui a tant travaillé pour nos études, serait plus honoré par des enfants à l'école que par des boissons. »</p>",
      transfert: "<p>Prépare un exposé de deux minutes : « Les funérailles dans ma communauté hier et aujourd'hui », avec une proposition concrète pour en réduire le coût.</p>"
    },
    revision: (CM_OLD ? CM_OLD.revision : []).concat(["Prestige (réception, tenues) ≠ rites ; caisse de solidarité pour les vivants."]),
    exo: CM_OLD ? CM_OLD.exo : "",
    quiz: [
      q("Moyen traditionnel d'annoncer un décès :", "le tam-tam", "la télévision", "le courrier", "Aujourd'hui aussi la radio et les réseaux sociaux."),
      q("Pourquoi la morgue a-t-elle changé les funérailles ?", "Elle permet d'attendre la famille dispersée", "Elle supprime les rites", "Elle rend les funérailles gratuites", "Les familles vivent loin."),
      q("Une critique fréquente des funérailles actuelles :", "leur coût élevé", "leur courte durée", "l'absence de musique", "Elles appauvrissent les familles."),
      q("Le tambour à fente est taillé dans…", "un tronc d'arbre évidé", "une calebasse", "une peau tendue seulement", "Le tam-tam d'appel."),
      q("Dans le budget des Kamga, le poste le plus lourd est…", "la réception", "les cérémonies religieuses", "la morgue", "1 200 000 F sur 3 000 000 F."),
      q("Pour les défenseurs des funérailles, elles sont…", "une dette d'honneur et un ciment social", "une dépense inutile", "une obligation légale", "Elles réunissent la communauté."),
      q("Une solution adoptée par certaines communautés :", "limiter les funérailles à une journée", "interdire les funérailles", "les rendre obligatoires chaque année", "Réduire le coût."),
      q("La veillée comprend souvent…", "chants, prières et témoignages", "un examen officiel", "une vente aux enchères", "Avant l'inhumation."),
      q("Une caisse de solidarité peut servir à…", "payer la scolarité des orphelins", "acheter plus de boissons", "louer plus de chaises", "Protéger les vivants."),
      q("Une position nuancée consiste à…", "garder le sens des rites et limiter le prestige", "dépenser sans compter", "tout supprimer", "Respecter le défunt et les vivants.")
    ]
  });

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  VRT_A("3e-fr-ville-cruelle", 2, "Remets l'intrigue dans l'ordre", function (el) {
    var ordre = ETAPES_VC.map(function (e, i) { return i; }), melange = [3, 0, 5, 1, 6, 2, 4], choisi = [];
    el.innerHTML = "<p class='an-note'>Clique sur les épisodes dans l'ordre du roman.</p><div data-c style='display:grid;gap:6px'></div><ol data-o class='labo-l'></ol><p class='labo-r' data-r></p>";
    function maj() {
      el.querySelector("[data-c]").innerHTML = melange.map(function (k) { return "<button type='button' class='btn-l' style='text-align:left' data-k='" + k + "'" + (choisi.indexOf(k) >= 0 ? " disabled" : "") + ">" + ETAPES_VC[k] + "</button>"; }).join("");
      el.querySelector("[data-o]").innerHTML = choisi.map(function (k, i) { return "<li style='color:" + (k === i ? VERT : ROUGE) + "'>" + ETAPES_VC[k] + (k === i ? " ✔" : " ✘") + "</li>"; }).join("");
      var bons = choisi.filter(function (k, i) { return k === i; }).length;
      el.querySelector("[data-r]").innerHTML = choisi.length === 7 ? (bons === 7 ? "<b>Parfait : l'intrigue est dans l'ordre.</b>" : "<b>" + bons + " / 7</b> bien placés. <button type='button' class='btn-l' data-z>Recommencer</button>") : "Épisodes placés : " + choisi.length + " / 7";
      el.querySelectorAll("[data-k]").forEach(function (b) { b.addEventListener("click", function () { choisi.push(+b.dataset.k); maj(); }); });
      var z = el.querySelector("[data-z]"); if (z) z.addEventListener("click", function () { choisi = []; maj(); });
    }
    maj();
  });
  VRT_A("tle-cult-naissance", 2, "Valoriser, adapter ou questionner ? Classe chaque pratique", function (el) {
    exercice(el, [["La solidarité des femmes autour de la jeune mère pendant plusieurs semaines : ___", ["valoriser", "questionner"], "Elle protège la mère et rassemble la famille."], ["Refuser les consultations prénatales parce que « nos mères n'en avaient pas » : ___", ["questionner", "valoriser"], "Cela met en danger la mère et l'enfant."], ["Choisir le nom de l'enfant pour honorer un grand-parent : ___", ["valoriser", "questionner"], "Transmission et mémoire familiale."], ["Attendre la nomination, des mois plus tard, pour déclarer l'enfant à l'état civil : ___", ["questionner", "valoriser"], "Il faut déclarer dans les délais légaux ; la nomination peut suivre."], ["Présenter l'enfant à la famille au retour de la maternité : ___", ["valoriser", "questionner"], "Une pratique adaptée à la vie moderne."], ["Un interdit qui prive la femme enceinte d'aliments nourrissants : ___", ["questionner", "valoriser"], "Il nuit à la santé de la mère et de l'enfant."]], "Pratique suivante", "Pratique");
  });
  VRT_A("tle-cult-mort", 2, "Simulateur : réviser le budget des funérailles", function (el) {
    el.innerHTML = "<div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:2px 18px'>" + BUDGET.map(function (b) { return "<label class='labo-c'><span>" + b[0] + " : <b data-v>" + b[1].toLocaleString("fr-FR") + "</b> F</span><input type='range' min='0' max='" + b[1] + "' step='25000' value='" + b[1] + "'></label>"; }).join("") + "</div><svg viewBox='0 0 640 120' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    var I = el.querySelectorAll("input"), V = el.querySelectorAll("[data-v]");
    function maj() {
      var N = [].map.call(I, function (x) { return +x.value; }), tot = N.reduce(function (a, b) { return a + b; }, 0), eco = 3000000 - tot, ok = eco >= 600000;
      N.forEach(function (n, i) { V[i].textContent = n.toLocaleString("fr-FR"); });
      var X = function (v) { return 30 + v / 3000000 * 580; };
      el.querySelector("[data-s]").innerHTML = "<rect x='30' y='40' width='580' height='26' rx='13' fill='#EEF1F6'/><rect x='30' y='40' width='" + (X(tot) - 30) + "' height='26' rx='13' fill='#C2540A'/><path d='M" + X(2400000) + " 30V76' stroke='" + NUIT + "' stroke-width='2' stroke-dasharray='4 3'/>" + txt(X(2400000), 24, "2 400 000 F : scolarité payée", { s: 11 }) + txt(30, 98, "Dépenses : " + tot.toLocaleString("fr-FR") + " F", { s: 12, a: "start" }) + txt(610, 98, "Économie : " + eco.toLocaleString("fr-FR") + " F", { s: 12, a: "end", c: ok ? VERT : ROUGE });
      el.querySelector("[data-r]").innerHTML = ok ? "<b>La scolarité des quatre enfants (600 000 F) est payée</b>" + (eco > 600000 ? ", et " + (eco - 600000).toLocaleString("fr-FR") + " F vont à la caisse de solidarité." : ".") + (N[5] < 100000 ? " ⚠️ Attention : les cérémonies elles-mêmes sont presque supprimées." : "") : "Il manque " + (600000 - eco).toLocaleString("fr-FR") + " F pour payer la scolarité. Où réduire sans toucher au sens des rites ?";
    }
    I.forEach(function (x) { x.addEventListener("input", maj); }); maj();
  });
})();
