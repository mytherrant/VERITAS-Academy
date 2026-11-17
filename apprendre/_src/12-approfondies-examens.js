/* Leçons APPROFONDIES — lot 5, classes d'examen (17/11/2026) : numération binaire (Tle C), cellule en microscopie
   optique et électronique (Tle A), calcul des sièges au scrutin proportionnel et ombres (3e).
   Même gabarit et même mécanisme que 11-approfondies-lot4.js : remplacement EN PLACE des versions courtes
   (ordre, clé, fiche APC, examen et scènes conservés), simulations VRT_A en fin de fichier. */
(function () {
  "use strict";
  var NUIT = "#001136", BLEU = "#1E499B", GRIS = "#4D5163", VERT = "#17784D";

  function txt(x, y, t, o) {
    o = o || {};
    return "<text x='" + x + "' y='" + y + "' text-anchor='" + (o.a || "middle") + "' font-size='" + (o.s || 12) + "' font-weight='" + (o.w || 700) + "' fill='" + (o.c || NUIT) + "'" + (o.i ? " font-style='italic'" : "") + ">" + t + "</text>";
  }
  function lin(id, cs, vertical) {
    var s = "<linearGradient id='" + id + "'" + (vertical ? " x1='0' y1='0' x2='0' y2='1'" : "") + ">";
    cs.forEach(function (c, i) { s += "<stop offset='" + (i / (cs.length - 1)).toFixed(2) + "' stop-color='" + c + "'/>"; });
    return s + "</linearGradient>";
  }
  function rad(id, cs, cx, cy) {
    var s = "<radialGradient id='" + id + "' cx='" + (cx || "35%") + "' cy='" + (cy || "30%") + "' r='75%'>";
    cs.forEach(function (c, i) { s += "<stop offset='" + (i / (cs.length - 1)).toFixed(2) + "' stop-color='" + c + "'/>"; });
    return s + "</radialGradient>";
  }
  function omb(id) { return "<radialGradient id='" + id + "'><stop offset='0' stop-color='#001136' stop-opacity='.3'/><stop offset='1' stop-color='#001136' stop-opacity='0'/></radialGradient>"; }
  function fleche(id, c) { return "<marker id='" + id + "' markerWidth='10' markerHeight='10' refX='7' refY='5' orient='auto'><path d='M0 1L8 5L0 9Z' fill='" + c + "'/></marker>"; }
  function svg(w, h, alt, defs, corps) {
    return "<svg viewBox='0 0 " + w + " " + h + "' role='img' aria-label='" + alt + "' font-family='Inter,Arial,sans-serif'><rect width='" + w + "' height='" + h + "' fill='#fff'/><defs>" + defs + "</defs>" + corps +
      "<text x='" + (w - 6) + "' y='" + (h - 5) + "' font-size='8' text-anchor='end' fill='#8A93A6'>Planche VÉRITAS</text></svg>";
  }
  function alea(g) { return function () { g = (g * 16807) % 2147483647; return (g - 1) / 2147483646; }; }
  function ancien(id) { return window.VRT_LECONS[id]; }
  function remplacer(id, o) {
    var a = ancien(id);
    if (a) ["apc", "examen", "rang", "cle", "scenes"].forEach(function (k) { if (a[k] != null && o[k] == null) o[k] = a[k]; });
    VRT_L(id, o);
    if (a) o.ordre = a.ordre;
  }
  function q(qq, bonne, f1, f2, e) { return { q: qq, r: [bonne, f1, f2], b: 0, e: e }; }
  function bin(n) { return n.toString(2); }

  /* ═══════════════════════ Tle C MATHS — NUMÉRATION BINAIRE ═══════════════════════ */
  var B_OLD = ancien("tle-maths-binaire");
  function lampes2D(id, x, y, n, L) {
    var s = "<g transform='translate(" + x + " " + y + ")'><rect x='-14' y='-34' width='" + (L * 8 + 10) + "' height='96' rx='14' fill='url(#" + id + "pan)'/>", b = ("00000000" + bin(n)).slice(-8), i;
    for (i = 0; i < 8; i++) {
      var cx = i * L + L / 2 - 4, on = b[i] === "1";
      if (on) s += "<circle cx='" + cx + "' cy='0' r='" + (L * .46) + "' fill='url(#" + id + "halo)'/>";
      s += "<circle cx='" + cx + "' cy='0' r='" + (L * .28) + "' fill='url(#" + id + (on ? "on" : "off") + ")' stroke='" + (on ? "#C48A0C" : "#3A4152") + "'/>" +
        "<ellipse cx='" + (cx - L * .09) + "' cy='" + (-L * .1) + "' rx='" + (L * .08) + "' ry='" + (L * .05) + "' fill='#fff' opacity='.7'/>" +
        txt(cx, L * .62, Math.pow(2, 7 - i), { s: 11, c: "#C9D2E3", w: 600 }) + txt(cx, L * .9, b[i], { s: 14, c: on ? "#FFD54A" : "#8A93A6" });
    }
    return s + "</g>";
  }
  function defsLampes(id) {
    return lin(id + "pan", ["#2A3247", "#151B2B"], true) + rad(id + "on", ["#FFFDE8", "#FFE066", "#F2B705", "#B07A00"]) + rad(id + "off", ["#9AA3B2", "#5C6478", "#2E3445"]) +
      "<radialGradient id='" + id + "halo'><stop offset='0' stop-color='#FFE066' stop-opacity='.55'/><stop offset='1' stop-color='#FFE066' stop-opacity='0'/></radialGradient>";
  }
  function panneau3D(n) {
    var o = [], b = ("00000000" + bin(n)).slice(-8), i;
    o.push({ f: "boite", c: [0, -10, 0], d: [540, 10, 200], coul: "#8B5A2B", dessus: "#A8733F" });
    [-200, 200].forEach(function (x) { o.push({ f: "cylindre", c: [x, -5, -30], r: 5, h: 10, n: 12, coul: "#9CA3AD" }); });
    o.push({ f: "boite", c: [0, 60, -30], d: [470, 120, 22], coul: "#15171C", dessus: "#1F2228" });
    [[0, 124, 480, 8], [0, -4, 480, 8]].forEach(function (f) { o.push({ f: "boite", c: [f[0], f[1], -30], d: [f[2], f[3], 26], coul: "#BFC5CC", dessus: "#E2E6EA", div: false }); });
    [-238, 238].forEach(function (x) { o.push({ f: "boite", c: [x, 60, -30], d: [8, 136, 26], coul: "#BFC5CC", dessus: "#E2E6EA", div: false }); });
    for (i = 0; i < 8; i++) {
      var x = -192 + i * 55, on = b[i] === "1", ec = on ? [0, 0, -26] : [0, 0, 0];
      o.push({ f: "cylindre", c: [x, 62, -47], r: 11, h: 8, n: 20, axe: "z", coul: "#B08D57", dessus: "#D2B07A" });
      o.push({ f: "sphere", c: [x, 62, -58], r: 15, coul: on ? "#FFF3C4" : "#E4E7EC", op: on ? 1 : 0.8, ec: ec });
      if (on) o.push({ f: "sphere", c: [x, 62, -58], r: 23, coul: "#FFB938", op: 0.22, ec: ec });
    }
    return o;
  }
  remplacer("tle-maths-binaire", {
    c: "Tle C", m: "maths", titre: "Numération binaire et numération décimale", duree: 35,
    accroche: "Huit ampoules seulement pour afficher le score : le tableau du gymnase parle binaire.",
    intro: "Le tableau d'affichage d'un gymnase te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois affirmations.",
    objectifs: ["écrire un entier en base 2 et le reconvertir en base 10", "maîtriser l'algorithme des divisions successives par 2", "justifier l'unicité de l'écriture binaire par la division euclidienne", "connaître la capacité d'un octet (0 à 255)"],
    enquete: {
      titre: "Le tableau de score du gymnase de Bafoussam",
      svg: (function () { var id = "bisc"; return svg(640, 200, "Un tableau de score à huit ampoules : quatre sont allumées et affichent 45 en binaire", defsLampes(id), "<rect width='640' height='200' fill='#EEF2F8'/>" + lampes2D(id, 130, 70, 45, 52) + txt(320, 180, "Score de l'équipe locale : 00101101", { s: 14, c: NUIT })); })(),
      legende: "Au gymnase omnisports de Bafoussam : le vieux tableau d'affichage du club de handball, fabriqué par les élèves du lycée technique.",
      contexte: "<p>Pour un tournoi de handball, les élèves du club d'électronique ont fabriqué un tableau de score avec <strong>8 ampoules</strong> par équipe. Chaque ampoule est allumée (1) ou éteinte (0). Ce soir, l'équipe locale a marqué <strong>45 buts</strong> en cumul du tournoi.</p><p>Le président du club s'inquiète : « Avec 8 ampoules, on ne pourra jamais afficher plus de 8 buts ! » Un élève répond : « Au contraire, on peut aller jusqu'à 256. » Et on prévoit 300 buts cumulés en fin de saison.</p>",
      documents: [{ t: "Le principe du tableau", html: "<p>De droite à gauche, les ampoules valent <strong>1, 2, 4, 8, 16, 32, 64, 128</strong>. Le score est la somme des valeurs des ampoules allumées.</p>" }],
      question: "Quelles ampoules allumer pour 45 ? Quel est le plus grand score affichable, et faut-il ajouter des ampoules pour 300 ?",
      tache: "Écris 45 en base 2 par deux méthodes, détermine la capacité du tableau et propose une solution pour la fin de saison.",
      hypotheses: ["Avec 8 ampoules, on ne peut afficher que 8 scores différents au plus (le président).", "Le plus grand score affichable est 256 (l'élève).", "Le plus grand score affichable est 255 ; pour 300, il faut une 9ᵉ ampoule."]
    },
    parties: [
      { t: "Le principe de la base 2", html: (B_OLD ? B_OLD.parties[0].html : "") +
        "<div class='ex'><b>Lecture du tableau</b>00101101₂ = 32 + 8 + 4 + 1 = <strong>45</strong>.</div>",
        planches: [{ type: "2D", titre: "45 sur le tableau : 00101101₂", legende: "Les ampoules allumées valent 32, 8, 4 et 1 : 32 + 8 + 4 + 1 = 45. Sous chaque ampoule, sa valeur (puissance de 2) et son chiffre binaire.", svg: (function () { var id = "bi1"; return svg(640, 170, "Huit ampoules, valeurs 128 à 1, allumées pour 32, 8, 4 et 1", defsLampes(id), lampes2D(id, 130, 64, 45, 52)); })() }],
        fil: { html: "<p>Chaque ampoule a <strong>2 états</strong>. Pour 8 ampoules, le principe multiplicatif donne 2 × 2 × … × 2 = 2⁸ = <strong>256 combinaisons</strong>, pas 8. Le président confond le nombre d'ampoules et le nombre d'affichages.</p>", verdicts: [[0, "rejetee", "8 ampoules à 2 états : 2⁸ = 256 affichages différents."]] },
        retenir: "En base 2, les rangs sont les puissances de 2 : 1, 2, 4, 8, 16, 32, 64, 128." },
      { t: "De la base 10 à la base 2", html: (B_OLD ? B_OLD.parties[1].html : "") +
        "<div class='methode'><b>Deuxième méthode : les plus grandes puissances</b><ol><li>Cherche la plus grande puissance de 2 inférieure ou égale au nombre : 32 ≤ 45.</li><li>Retire-la : 45 − 32 = 13 ; recommence : 8 ≤ 13, 13 − 8 = 5 ; 4 ≤ 5, 5 − 4 = 1 ; 1.</li><li>Allume 32, 8, 4, 1 : 101101₂.</li></ol></div>",
        planches: [{ type: "2D", titre: "Les divisions successives de 45 par 2", legende: "On divise par 2 jusqu'à un quotient nul ; les restes, lus de bas en haut, donnent 101101.", svg: (function () {
          var s = "", n = 45, i = 0, R = [];
          while (n > 0) { R.push([n, Math.floor(n / 2), n % 2]); n = Math.floor(n / 2); }
          R.forEach(function (r, k) {
            var x = 40 + k * 82, y = 40 + k * 34;
            s += txt(x + 24, y, r[0], { s: 18, a: "end" }) + "<path d='M" + (x + 30) + " " + (y - 18) + "V" + (y + 22) + "M" + (x + 30) + " " + (y + 6) + "H" + (x + 72) + "' stroke='" + NUIT + "' stroke-width='2'/>" + txt(x + 50, y, "2", { s: 16, c: BLEU }) +
              "<rect x='" + (x + 4) + "' y='" + (y + 10) + "' width='24' height='22' rx='6' fill='" + (r[2] ? "#FFE9A8" : "#EEF1F6") + "'/>" + txt(x + 16, y + 26, r[2], { s: 15, c: "#C2540A" });
          });
          s += "<path d='M582 250V60' stroke='#C2540A' stroke-width='2.5' marker-end='url(#bi2f)'/>" + txt(570, 280, "lecture : 101101₂", { s: 15, c: "#C2540A", a: "end" });
          return svg(640, 300, "Divisions successives de 45 par 2 avec les restes 1, 0, 1, 1, 0, 1 lus de bas en haut", fleche("bi2f", "#C2540A"), s);
        })() }],
        fil: { html: "<p>Les deux méthodes donnent <strong>45 = 101101₂</strong>, soit 00101101 sur les 8 ampoules : on allume les ampoules 32, 8, 4 et 1.</p>" },
        retenir: "Divisions successives par 2, restes lus de bas en haut." },
      { t: "Unicité de l'écriture et capacité d'un octet", html: (B_OLD ? B_OLD.parties[2].html : "") +
        "<div class='prop'><b>Capacité</b>Avec n chiffres binaires, on écrit les entiers de 0 à <strong>2ⁿ − 1</strong> : 2ⁿ valeurs en tout, en comptant 0. Pour n = 8 : de 0 à 255. Pour n = 9 : de 0 à 511.</div>" +
        "<div class='attention'><b>Piège</b>256 combinaisons ne veut pas dire « jusqu'à 256 » : la combinaison 00000000 sert à afficher 0.</div>",
        planches: [{ type: "3d", titre: "Le tableau à 8 ampoules affiche 255", legende: "Les 8 ampoules allumées : 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255 = 2⁸ − 1, le plus grand score possible. Le curseur fait avancer les ampoules allumées.",
          modele: { h: 320, rx: -10, ry: -16, echelle: 0.95, alt: "Tableau de score en trois dimensions avec huit ampoules allumées", eclate: "Faire ressortir les ampoules allumées", jouer: "Allumer", objets: panneau3D(255),
            etiquettes: [{ p: [-192, 90, -58], t: "128" }, { p: [193, 90, -58], t: "1", cote: "d" }] } }],
        fil: { html: "<p>Toutes les ampoules allumées : 11111111₂ = 2⁸ − 1 = <strong>255</strong>. Pour 300 > 255, il faut une 9ᵉ ampoule (valeur 256) : 300 = 256 + 32 + 8 + 4 = 100101100₂.</p>", verdicts: [[1, "rejetee", "256 combinaisons, mais de 0 à 255 : 256 n'est pas affichable."], [2, "validee", "Maximum 2⁸ − 1 = 255 ; 300 = 100101100₂ demande 9 ampoules."]] },
        retenir: "n bits : de 0 à 2ⁿ − 1. Un octet : 0 à 255." }
    ],
    denouement: {
      titre: "45 = 00101101₂ ; maximum 255 ; une 9ᵉ ampoule pour 300",
      etapes: ["Chaque ampoule vaut une puissance de 2 (indice 1).", "45 = 32 + 8 + 4 + 1 = 101101₂ (indice 2).", "8 ampoules : 2⁸ = 256 combinaisons, de 0 à 255 (indice 3).", "300 = 256 + 44 = 100101100₂ : 9 ampoules (indice 3)."],
      reponse: "<p>Par divisions successives par 2, 45 = 101101₂ : sur le tableau, on allume les ampoules de valeurs 32, 8, 4 et 1 (00101101). Chaque ampoule ayant deux états, 8 ampoules offrent 2⁸ = 256 combinaisons, ce qui permet d'afficher tous les entiers de 0 à 2⁸ − 1 = 255 ; le président se trompe donc, mais l'élève aussi, car 256 n'est pas affichable. Comme 300 > 255 et que 300 = 256 + 32 + 8 + 4 = 100101100₂, il faut ajouter une 9ᵉ ampoule, de valeur 256 : le tableau ira alors jusqu'à 2⁹ − 1 = 511.</p>",
      transfert: "<p>Une adresse IP s'écrit avec quatre octets, par exemple 192.168.1.45. Écris l'octet 192 en binaire et explique pourquoi aucun des quatre nombres ne peut dépasser 255. <em>(192 = 11000000₂.)</em></p>"
    },
    revision: (B_OLD ? B_OLD.revision : []).concat(["n bits : 2ⁿ valeurs, de 0 à 2ⁿ − 1."]),
    exo: B_OLD ? B_OLD.exo : "",
    quiz: [
      q("1010₂ vaut…", "10", "5", "12", "8 + 2 = 10."),
      q("13 en base 2 :", "1101", "1011", "1110", "8 + 4 + 1."),
      q("Le plus grand entier sur 8 bits :", "255", "256", "128", "2⁸ − 1."),
      q("45 en base 2 :", "101101", "110101", "101011", "32 + 8 + 4 + 1."),
      q("Combien de combinaisons avec 8 ampoules allumées ou éteintes ?", "256", "8", "16", "2⁸."),
      q("Dans les divisions successives par 2, on lit les restes…", "de bas en haut", "de haut en bas", "dans n'importe quel ordre", "Le dernier reste est le chiffre de plus fort poids."),
      q("100000000₂ vaut…", "256", "128", "512", "2⁸."),
      q("Combien de bits faut-il au minimum pour écrire 300 ?", "9", "8", "10", "256 ≤ 300 < 512."),
      q("L'unicité de l'écriture binaire découle…", "de la division euclidienne par 2", "du théorème de Pythagore", "du calcul intégral", "Quotient et reste uniques."),
      q("11111₂ vaut…", "31", "32", "15", "2⁵ − 1.")
    ]
  });

  /* ═══════════════════════ Tle A SCIENCES — LA CELLULE EN MICROSCOPIE OPTIQUE ═══════════════════════ */
  var MO_OLD = ancien("tle-sc-microscopie");
  function microscope3D() {
    var o = [], up = [0, 46, 0];
    o.push({ f: "boite", c: [0, -10, 0], d: [460, 8, 260], coul: "#8B5A2B", dessus: "#B07A45" });
    o.push({ f: "boite", c: [0, 0, 10], d: [150, 16, 190], coul: "#E9E4D8", dessus: "#F4F1EA" });
    o.push({ f: "boite", c: [0, 16, 70], d: [44, 150, 34], coul: "#E9E4D8", dessus: "#F4F1EA", div: false });
    o.push({ f: "boite", c: [0, 112, 10], d: [130, 8, 120], coul: "#1B1D22", dessus: "#2A2D33", div: false });
    o.push({ f: "boite", c: [0, 121, 10], d: [96, 2, 30], coul: "#DDEFF7", op: 0.7, div: false });
    o.push({ f: "boite", c: [0, 123, 10], d: [16, 1, 14], coul: "#C77DB0", op: 0.8, div: false });
    o.push({ f: "cylindre", c: [0, 40, 10], r: 22, h: 3, n: 24, coul: "#B8C4D6", dessus: "#EAF2FB" });
    o.push({ f: "cylindre", c: [26, 120, 70], r: 13, h: 12, n: 18, axe: "x", coul: "#2A2D33" });
    o.push({ f: "cylindre", c: [-38, 120, 70], r: 13, h: 12, n: 18, axe: "x", coul: "#2A2D33" });
    o.push({ f: "cylindre", c: [26, 90, 70], r: 8, h: 10, n: 14, axe: "x", coul: "#C9CED6" });
    o.push({ f: "boite", c: [0, 166, 52], d: [40, 50, 30], coul: "#E9E4D8", dessus: "#F4F1EA", div: false, ec: up });
    o.push({ f: "cylindre", c: [0, 160, 10], r: 26, h: 12, n: 22, coul: "#C9CED6", dessus: "#EEF1F4", ec: up });
    [[-14, 0], [12, -8], [10, 12]].forEach(function (p, i) { o.push({ f: "cylindre", c: [p[0], 134 + i * 4, 10 + p[1]], r: 6.5 - i, r2: 5, h: 26 - i * 4, n: 14, coul: ["#D8DDE3", "#C9CED6", "#D4D9DF"][i], ec: up }); o.push({ f: "cylindre", c: [p[0], 150 + i * 2, 10 + p[1]], r: 6.8 - i, h: 3, n: 14, coul: ["#C62828", "#F2C94C", "#1E88E5"][i], ec: up }); });
    o.push({ f: "cylindre", c: [0, 172, 10], r: 16, h: 80, n: 20, coul: "#E9E4D8", dessus: "#F4F1EA", ec: up });
    o.push({ f: "cylindre", c: [0, 252, 10], r: 11, h: 26, n: 18, coul: "#1B1D22", dessus: "#0E0F12", ec: up });
    o.forEach(function (x) { x.c[1] -= 130; });
    return o;
  }
  function cellulesOignon(id, x, y, w, h, bar) {
    var s = "<g transform='translate(" + x + " " + y + ")'><clipPath id='" + id + "cl'><circle cx='" + (w / 2) + "' cy='" + (h / 2) + "' r='" + (h / 2) + "'/></clipPath><circle cx='" + (w / 2) + "' cy='" + (h / 2) + "' r='" + (h / 2) + "' fill='#FBF3F6'/><g clip-path='url(#" + id + "cl)'>", R = alea(9), r, c;
    for (r = -1; r < 7; r++) for (c = -1; c < 4; c++) {
      var ox = c * 120 + (r % 2 ? 60 : 0) + (R() - .5) * 8, oy = r * 40, L = 116 + (R() - .5) * 10, H = 38;
      s += "<path d='M" + ox + " " + oy + "h" + L + "l4 " + H + "h-" + L + "Z' fill='url(#" + id + "vac)' stroke='#7B3F69' stroke-width='2.2'/>";
      s += "<ellipse cx='" + (ox + 18 + R() * 70) + "' cy='" + (oy + 20) + "' rx='9' ry='7' fill='#8E4A80' opacity='.85'/><circle cx='" + (ox + 22 + R() * 60) + "' cy='" + (oy + 18) + "' r='2' fill='#5B2450'/>";
    }
    s += "</g><circle cx='" + (w / 2) + "' cy='" + (h / 2) + "' r='" + (h / 2) + "' fill='none' stroke='#1B2233' stroke-width='6'/>";
    if (bar) s += "<path d='M" + (w / 2 - 40) + " " + (h - 26) + "h80' stroke='#001136' stroke-width='4'/>" + txt(w / 2, h - 34, bar, { s: 12 });
    return s + "</g>";
  }
  remplacer("tle-sc-microscopie", {
    c: "Tle A", m: "sciences", titre: "La cellule en microscopie optique", duree: 35,
    accroche: "« Une cellule d'oignon, c'est gros comme un grain de riz ! » Le microscope et un calcul tranchent.",
    intro: "Une séance de travaux pratiques te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois affirmations.",
    objectifs: ["énoncer la théorie cellulaire", "nommer les parties du microscope optique et l'utiliser", "calculer un grossissement et la taille réelle d'une cellule", "comparer cellule animale et cellule végétale"],
    enquete: {
      titre: "Le TP de sciences au lycée de Bertoua",
      svg: (function () { var id = "mosc"; return svg(640, 220, "Le champ du microscope montre des cellules d oignon allongées avec leur noyau ; à côté, un dessin d élève de 20 millimètres", rad(id + "vac", ["#FBE3EF", "#F3C8DD", "#E7A9C8"]), "<rect width='640' height='220' fill='#F4F6FA'/>" + cellulesOignon(id, 60, 10, 200, 200) + "<rect x='330' y='40' width='260' height='140' rx='12' fill='#fff' stroke='#C9D2E3'/>" + txt(460, 70, "Dessin de Mireille (×400)", { s: 13 }) + "<rect x='380' y='96' width='160' height='40' fill='none' stroke='#7B3F69' stroke-width='2'/><ellipse cx='420' cy='116' rx='10' ry='8' fill='#8E4A80'/>" + "<path d='M380 150h160' stroke='#C2540A' stroke-width='2' marker-start='url(#moscf)' marker-end='url(#moscf)'/>" + txt(460, 168, "20 mm sur le dessin… et en vrai ?", { s: 12, c: "#C2540A" }), true).replace("</defs>", fleche("moscf", "#C2540A") + "</defs>"); })(),
      legende: "Au lycée bilingue de Bertoua, en Terminale A : la séance de TP de sciences, avec deux microscopes pour toute la classe.",
      contexte: "<p>Mireille monte un fragment d'épiderme d'oignon rouge entre lame et lamelle. Avec l'objectif <strong>×40</strong> et l'oculaire <strong>×10</strong>, elle voit des « petites cases » allongées, chacune avec un point sombre. Elle dessine une case : <strong>20 mm</strong> de long sur sa feuille, à la même échelle que ce qu'elle voit.</p><p>Son voisin Junior s'exclame : « Une cellule d'oignon, c'est donc gros comme un grain de riz ! » Il veut aussi passer directement à l'objectif ×40 pour « gagner du temps ». La professeure demande d'abord de faire le calcul… et un frottis de joue.</p>",
      documents: [{ t: "Les deux observations", html: "<table class='donnees'><tr><th></th><th>Épiderme d'oignon</th><th>Cellules de la joue</th></tr><tr><td>forme</td><td>rectangles réguliers jointifs</td><td>contours irréguliers, isolées</td></tr><tr><td>paroi épaisse</td><td>oui</td><td>non</td></tr><tr><td>grande vacuole colorée</td><td>oui</td><td>non</td></tr><tr><td>noyau</td><td>oui</td><td>oui</td></tr></table>" }],
      question: "Quelle est la taille réelle de la cellule d'oignon, et qu'est-ce qui distingue une cellule végétale d'une cellule animale ?",
      tache: "Calcule le grossissement et la taille réelle, explique la bonne façon d'utiliser le microscope, puis compare les deux cellules.",
      hypotheses: ["Une cellule d'oignon mesure environ 20 mm, comme un grain de riz (Junior).", "Une cellule d'oignon mesure environ 0,05 mm : invisible à l'œil nu.", "Toutes les cellules ont la même forme et les mêmes constituants."]
    },
    parties: [
      { t: "La cellule, unité du vivant", html: (MO_OLD ? MO_OLD.parties[0].html : ""),
        fil: { html: "<p>Les « petites cases » de Mireille sont des <strong>cellules</strong> ; le point sombre est leur <strong>noyau</strong>. L'oignon, la joue de Junior, une bactérie : tous sont faits de cellules.</p>" },
        retenir: "Pas de vie sans cellule." },
      { t: "Utiliser le microscope optique", html: (MO_OLD ? MO_OLD.parties[1].html : ""),
        planches: [{ type: "3d", titre: "Le microscope optique", legende: "Tourne le microscope : oculaire en haut, tube, revolver portant trois objectifs, platine avec la lame, vis macrométrique (grosse) et micrométrique (petite), source de lumière au pied. Le curseur remonte le tube, comme la vis macrométrique.",
          modele: { h: 420, rx: -12, ry: 38, echelle: 0.85, alt: "Microscope optique en trois dimensions", eclate: "Remonter le tube", jouer: "Mise au point", objets: microscope3D(),
            etiquettes: [{ p: [0, 148, 10], t: "Oculaire (×10)", ec: [0, 46, 0] }, { p: [-14, 4, 10], t: "Objectifs (×4, ×10, ×40)", ec: [0, 46, 0] }, { p: [48, -14, 10], t: "Platine et lame", cote: "d" }, { p: [32, -10, 70], t: "Vis macrométrique", cote: "d" }, { p: [0, -87, 10], t: "Source de lumière" }] } }],
        fil: { html: "<p>Junior a tort de passer directement au ×40 : le champ est minuscule, la mise au point se fait à quelques dixièmes de millimètre et l'objectif risque d'écraser la lame. On repère d'abord au ×4, on centre, puis on grossit. Ici, le grossissement total est 40 × 10 = <strong>×400</strong>.</p>" },
        retenir: "Grossissement = objectif × oculaire ; toujours commencer par le plus faible." },
      { t: "Calculer la taille réelle", html:
        "<p class='formule'>taille réelle = taille sur le dessin ÷ grossissement</p>" +
        "<div class='methode'><b>Méthode</b><ol><li>Mesure l'objet sur le dessin (en mm).</li><li>Divise par le grossissement.</li><li>Convertis en micromètres : 1 mm = 1 000 µm.</li></ol></div>" +
        "<div class='ex'><b>Exemple</b>20 mm ÷ 400 = 0,05 mm = <strong>50 µm</strong>.</div>" +
        "<div class='savais'><b>Ordres de grandeur</b>Bactérie : 1 à 5 µm ; globule rouge : 7 µm ; cellule de joue : 50 µm ; cellule d'oignon : 50 à 200 µm ; grain de riz : 6 000 µm. L'œil nu ne distingue pas en dessous d'environ 100 µm.</div>",
        planches: [{ type: "2D", titre: "Le champ au ×400 et sa barre d'échelle", legende: "Chaque cellule allongée mesure environ 50 µm ; la barre d'échelle de 25 µm permet de le vérifier directement sur l'image.", svg: (function () { var id = "mo3"; return svg(640, 300, "Cellules d oignon vues au microscope avec une barre d échelle de 25 micromètres", rad(id + "vac", ["#FBE3EF", "#F3C8DD", "#E7A9C8"]), cellulesOignon(id, 170, 4, 300, 290, "25 µm")); })() }],
        fil: { html: "<p>20 mm ÷ 400 = 0,05 mm = 50 µm. Un grain de riz mesure environ 6 mm : il est <strong>120 fois</strong> plus long que la cellule. Junior a oublié de diviser par le grossissement.</p>", verdicts: [[0, "rejetee", "Il faut diviser la taille du dessin par 400 : 0,05 mm, pas 20 mm."], [1, "validee", "20 mm ÷ 400 = 0,05 mm = 50 µm."]] },
        retenir: "Taille réelle = taille observée ÷ grossissement." },
      { t: "Cellule animale, cellule végétale", html: (MO_OLD ? MO_OLD.parties[2].html : ""),
        planches: [{ type: "2D", titre: "Cellules de la joue et cellules d'oignon", legende: "À gauche, des cellules de la joue au bleu de méthylène : contour irrégulier, noyau bien visible, pas de paroi. À droite, des cellules d'oignon : paroi épaisse, grande vacuole, cellules jointives.", svg: (function () {
          var id = "mo4", s = "<circle cx='170' cy='150' r='130' fill='#EEF6FC'/>", R = alea(31), i;
          [[120, 110], [210, 120], [150, 200], [230, 210], [100, 180]].forEach(function (p) {
            var d = "", k; for (k = 0; k <= 12; k++) { var a = k / 12 * 6.283, r = 34 + (R() - .5) * 12; d += (k ? "L" : "M") + (p[0] + r * Math.cos(a)).toFixed(1) + " " + (p[1] + r * .8 * Math.sin(a)).toFixed(1); }
            s += "<path d='" + d + "Z' fill='#BFD7F2' fill-opacity='.7' stroke='#3D6FB0' stroke-width='1.6' stroke-linejoin='round'/><circle cx='" + (p[0] + 4) + "' cy='" + p[1] + "' r='9' fill='#2155B0'/>";
          });
          s += "<circle cx='170' cy='150' r='130' fill='none' stroke='#1B2233' stroke-width='6'/>" + txt(170, 300, "cellules de la joue", { s: 13, c: BLEU });
          s += cellulesOignon(id, 340, 20, 260, 260) + txt(470, 300, "cellules d'oignon", { s: 13, c: "#7B3F69" });
          return svg(640, 316, "Deux champs de microscope : cellules de la joue irrégulières à noyau bleu, cellules d oignon rectangulaires à paroi", rad(id + "vac", ["#FBE3EF", "#F3C8DD", "#E7A9C8"]), s);
        })() }],
        fil: { html: "<p>Le document le montre : les deux cellules ont un <strong>noyau</strong>, un cytoplasme et une membrane, mais seule la cellule d'oignon a une <strong>paroi</strong> épaisse et une grande <strong>vacuole</strong>. Toutes les cellules ne sont donc pas identiques.</p>", verdicts: [[2, "rejetee", "Paroi et vacuole n'existent que dans la cellule végétale ; les formes diffèrent."]] },
        retenir: "Végétale = animale + paroi + vacuole + chloroplastes." }
    ],
    denouement: {
      titre: "50 µm, et deux cellules différentes",
      etapes: ["Les « cases » sont des cellules, unités du vivant (indice 1).", "Grossissement 40 × 10 = 400, en commençant au plus faible (indice 2).", "20 mm ÷ 400 = 0,05 mm = 50 µm (indice 3).", "Paroi et vacuole : cellule végétale seulement (indice 4)."],
      reponse: "<p>Avec l'objectif ×40 et l'oculaire ×10, le grossissement est de 40 × 10 = 400. La cellule dessinée à 20 mm mesure donc réellement 20 ÷ 400 = 0,05 mm, soit 50 µm : environ 120 fois moins qu'un grain de riz, et invisible à l'œil nu. Junior a oublié de diviser par le grossissement ; il doit aussi toujours commencer l'observation au plus faible grossissement. Les cellules d'oignon et celles de la joue possèdent toutes une membrane, un cytoplasme et un noyau, ce qui illustre la théorie cellulaire ; mais la cellule végétale d'oignon possède en plus une paroi épaisse et une grande vacuole, absentes de la cellule animale de la joue.</p>",
      transfert: "<p>Sur une photographie prise au ×1 000, un globule rouge mesure 7 mm. Calcule sa taille réelle en µm et compare-la à celle de la cellule d'oignon. <em>(7 µm, environ 7 fois plus petit.)</em></p>"
    },
    revision: (MO_OLD ? MO_OLD.revision : []).concat(["Taille réelle = taille observée ÷ grossissement ; 1 mm = 1 000 µm."]),
    exo: MO_OLD ? MO_OLD.exo : "",
    quiz: [
      q("Objectif ×40, oculaire ×10 : grossissement ?", "×400", "×50", "×4", "On multiplie."),
      q("Quel élément est propre à la cellule végétale ?", "la paroi", "le noyau", "la membrane", "Elle donne sa rigidité."),
      q("Toute cellule provient…", "d'une autre cellule", "de la matière inerte", "de l'eau", "Théorie cellulaire."),
      q("Un dessin de 20 mm au ×400 représente…", "50 µm", "20 mm", "8 000 mm", "20 ÷ 400 = 0,05 mm."),
      q("1 mm vaut…", "1 000 µm", "100 µm", "10 µm", "Micromètre = millième de mm."),
      q("On commence une observation avec…", "le plus faible grossissement", "le plus fort grossissement", "l'objectif ×40", "Pour repérer et centrer."),
      q("La vis qui sert à la mise au point fine est…", "la vis micrométrique", "la vis macrométrique", "le revolver", "La grosse vis approche, la petite affine."),
      q("Les cellules de la joue n'ont pas…", "de paroi", "de noyau", "de membrane", "Ce sont des cellules animales."),
      q("Taille réelle = …", "taille observée ÷ grossissement", "taille observée × grossissement", "grossissement ÷ taille observée", "On revient à la vraie taille."),
      q("Une bactérie mesure environ…", "1 à 5 µm", "1 mm", "1 cm", "Bien plus petite qu'une cellule d'oignon.")
    ]
  });

  /* ═══════════════════════ Tle A SCIENCES — LES ORGANITES ═══════════════════════ */
  var OR_OLD = ancien("tle-sc-organites");
  function cellule3D() {
    var o = [], R = alea(77), k;
    o.push({ f: "sphere", c: [0, 0, 0], r: [190, 120, 140], n: 30, m: 18, coul: "#F6D3E1", op: 0.16 });
    o.push({ f: "sphere", c: [-30, 0, 0], r: 50, coul: "#7C4DA8", ec: [0, 90, 0] });
    o.push({ f: "sphere", c: [-40, 8, 22], r: 16, coul: "#4A2470", ec: [0, 90, 0] });
    for (k = 0; k < 4; k++) o.push({ f: "sphere", c: [-30 + 70 * Math.cos(k), -4 + k * 5, 70 * Math.sin(k) * .6], r: [44, 4, 26], n: 18, m: 6, coul: "#5B8DEF", op: 0.85, ec: [0, -70, 0] });
    for (k = 0; k < 4; k++) o.push({ f: "sphere", c: [110, 30 + k * 9, -30], r: [36 - k * 3, 3.5, 20], n: 16, m: 6, coul: "#F2C94C", ec: [80, 40, 0] });
    for (k = 0; k < 9; k++) { var a = k * 0.7 + R(), rr = 95 + R() * 40; o.push({ f: "sphere", c: [rr * Math.cos(a), (R() - .5) * 70, rr * Math.sin(a) * .7], r: [20, 9, 9], n: 14, m: 8, coul: "#E8703A", ec: [Math.cos(a) * 80, 0, Math.sin(a) * 80] }); }
    for (k = 0; k < 6; k++) { var b = k * 1.05 + 0.3; o.push({ f: "sphere", c: [140 * Math.cos(b) * .8, (R() - .5) * 50, 110 * Math.sin(b) * .7], r: 8, coul: "#36B37A", ec: [Math.cos(b) * 60, 30, Math.sin(b) * 60] }); }
    for (k = 0; k < 40; k++) { var c = R() * 6.28, d = 70 + R() * 90; o.push({ f: "sphere", c: [d * Math.cos(c), (R() - .5) * 90, d * Math.sin(c) * .7], r: 2.2, coul: "#2E3445" }); }
    return o;
  }
  remplacer("tle-sc-organites", {
    c: "Tle A", m: "sciences", titre: "La cellule en microscopie électronique : les organites", duree: 35,
    accroche: "Pourquoi le cœur d'un athlète de Buéa a-t-il autant de « centrales électriques » dans ses cellules ?",
    intro: "La Course de l'Espoir sur le mont Cameroun te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois explications.",
    objectifs: ["expliquer pourquoi le microscope électronique révèle l'ultrastructure", "citer les principaux organites et leur rôle", "relier le nombre d'organites à l'activité d'une cellule", "comparer microscopie optique et électronique"],
    enquete: {
      titre: "La Course de l'Espoir et les mitochondries",
      svg: (function () {
        var s = "<rect width='640' height='200' fill='#EAF4FB'/><path d='M0 200L180 70L260 110L380 20L520 120L640 80V200Z' fill='#5E7C5A'/><path d='M380 20L350 50L400 46Z' fill='#E9EEF2'/><path d='M0 200C160 170 300 190 640 150V200Z' fill='#7FA36E'/>";
        s += "<g transform='translate(200 150)'><circle cx='0' cy='-30' r='7' fill='#6B4423'/><path d='M0 -22l-4 20l-10 14M-4 -2l10 16M0 -18l12 8M0 -18l-12 4' stroke='#6B4423' stroke-width='4' stroke-linecap='round' fill='none'/><rect x='-6' y='-20' width='10' height='14' rx='3' fill='#D9472B'/></g>";
        s += "<rect x='430' y='130' width='190' height='54' rx='10' fill='#fff' fill-opacity='.92' stroke='#C9D2E3'/>" + txt(525, 152, "38 km, 3 000 m de dénivelé", { s: 12 }) + txt(525, 172, "Mont Cameroun, Buéa", { s: 11.5, w: 600, c: GRIS });
        return svg(640, 200, "Un coureur sur les pentes du mont Cameroun", "", s);
      })(),
      legende: "À Buéa, la veille de la Course de l'Espoir : une conférence du médecin de l'équipe au lycée.",
      contexte: "<p>Le médecin d'un club d'athlétisme de Buéa présente aux Terminales des photographies de cellules prises au <strong>microscope électronique</strong>. Il montre que les cellules du muscle cardiaque d'un coureur de la Course de l'Espoir contiennent des <strong>milliers de mitochondries</strong>.</p><p>Un élève affirme : « Ce sont des réserves de graisse. » Une autre : « Toutes les cellules du corps ont le même nombre d'organites. » Le médecin sourit et distribue un tableau.</p>",
      documents: [{ t: "Nombre moyen de mitochondries par cellule", html: "<table class='donnees'><tr><th>Cellule</th><th>Mitochondries</th></tr><tr><td>muscle cardiaque</td><td>≈ 5 000</td></tr><tr><td>foie</td><td>≈ 1 500</td></tr><tr><td>peau</td><td>≈ 100</td></tr><tr><td>globule rouge adulte</td><td>0</td></tr></table>" }],
      question: "À quoi servent les mitochondries, et pourquoi sont-elles si nombreuses dans les cellules du cœur ?",
      tache: "Explique, en huit lignes, ce que révèle le microscope électronique et le rôle des principaux organites, en t'appuyant sur le tableau.",
      hypotheses: ["Les mitochondries sont des réserves de graisse.", "Toutes les cellules ont le même nombre d'organites.", "Les mitochondries produisent l'énergie : plus une cellule travaille, plus elle en a."]
    },
    parties: [
      { t: "Pourquoi le microscope électronique ?", html: (OR_OLD ? OR_OLD.parties[0].html : "") +
        "<div class='def'><b>Pouvoir de séparation</b>Plus petite distance entre deux points que l'instrument montre encore séparés : environ <strong>0,2 µm</strong> au microscope optique, environ <strong>0,2 nm</strong> (1 000 fois moins) au microscope électronique.</div>",
        planches: [{ type: "2D", titre: "Une mitochondrie vue par les deux microscopes", legende: "Au microscope optique (à gauche), une mitochondrie n'est qu'un petit bâtonnet flou. Au microscope électronique (à droite), on voit sa double membrane et ses crêtes internes.", svg: (function () {
          var s = "<circle cx='160' cy='150' r='120' fill='#F3EDE2'/><ellipse cx='160' cy='150' rx='16' ry='7' fill='#C98A55' opacity='.7' filter='url(#fl)'/><circle cx='160' cy='150' r='120' fill='none' stroke='#1B2233' stroke-width='6'/>" + txt(160, 296, "optique ×1 000", { s: 13 });
          s += "<rect x='340' y='30' width='260' height='240' rx='8' fill='#2B2B2B'/><ellipse cx='470' cy='150' rx='110' ry='56' fill='#8C8C8C' stroke='#E6E6E6' stroke-width='4'/><ellipse cx='470' cy='150' rx='100' ry='47' fill='#6E6E6E' stroke='#CFCFCF' stroke-width='2'/>";
          for (var k = 0; k < 9; k++) { var x = 390 + k * 20, t = k % 2 ? 106 : 194, L = 40 + (k % 3) * 8; s += "<path d='M" + x + " " + t + "V" + (k % 2 ? t + L : t - L) + "' stroke='#D9D9D9' stroke-width='4' stroke-linecap='round'/>"; }
          s += txt(470, 296, "électronique ×40 000", { s: 13 }) + txt(470, 52, "crêtes", { s: 12, c: "#F2F2F2" }) + txt(570, 252, "double membrane", { s: 11, c: "#F2F2F2", a: "end" });
          return svg(640, 310, "Une mitochondrie floue au microscope optique et détaillée au microscope électronique", "<filter id='fl'><feGaussianBlur stdDeviation='2.5'/></filter>", s);
        })() }],
        fil: { html: "<p>Au microscope optique, une mitochondrie (1 à 2 µm) est à peine un point. Seul le microscope électronique révèle sa structure : double membrane et crêtes internes. Ce ne sont pas des gouttes de graisse, mais de véritables organites.</p>", verdicts: [[0, "rejetee", "Le microscope électronique montre une double membrane et des crêtes : un organite, pas une réserve de graisse."]] },
        retenir: "Électrons au lieu de lumière : pouvoir de séparation 1 000 fois meilleur, on voit l'ultrastructure." },
      { t: "Les organites et leurs rôles", html: (OR_OLD ? OR_OLD.parties[1].html : ""),
        planches: [{ type: "3d", titre: "Une cellule en vue éclatée", legende: "Tourne la cellule, puis écarte les organites : le noyau (violet) monte, le réticulum (bleu) descend, l'appareil de Golgi (jaune) s'écarte, les mitochondries (orange) et les lysosomes (verts) sortent vers l'extérieur ; les petits points noirs sont les ribosomes.",
          modele: { h: 400, rx: -18, ry: 22, echelle: 0.9, alt: "Cellule animale en trois dimensions avec ses organites en vue éclatée", eclate: "Écarter les organites", jouer: "Éclater la cellule", objets: cellule3D(),
            etiquettes: [{ p: [-30, 52, 0], t: "Noyau (ADN)", ec: [0, 90, 0] }, { p: [110, 60, -30], t: "Appareil de Golgi", cote: "d", ec: [80, 40, 0] }, { p: [-100, -4, 0], t: "Réticulum endoplasmique", ec: [0, -70, 0] }, { p: [190, 0, 0], t: "Membrane plasmique", cote: "d" }] } }],
        fil: { html: "<p>La <strong>mitochondrie</strong> est le siège de la respiration cellulaire : elle oxyde les nutriments (glucose) en présence de dioxygène et libère l'énergie dont la cellule a besoin pour travailler.</p>" },
        retenir: "Chaque organite a un métier : la cellule est une usine organisée." },
      { t: "Structure et fonction", html: (OR_OLD ? OR_OLD.parties[2].html : "") +
        "<div class='prop'><b>Relation structure-fonction</b>Le nombre d'organites d'une cellule dépend de son activité : beaucoup de mitochondries dans les cellules qui consomment beaucoup d'énergie (muscle, cœur), beaucoup de réticulum et de Golgi dans celles qui fabriquent et exportent des protéines (cellules du pancréas).</div>",
        fil: { html: "<p>Le cœur bat sans arrêt, de 60 à 180 fois par minute pendant la course : ses cellules ont un énorme besoin d'énergie, d'où <strong>5 000 mitochondries</strong> chacune ; une cellule de peau, peu active, en a 100 ; le globule rouge adulte, qui a perdu ses organites, aucune. Le nombre d'organites varie donc selon le travail de la cellule.</p>", verdicts: [[1, "rejetee", "De 0 à 5 000 mitochondries selon les cellules."], [2, "validee", "Plus la cellule consomme d'énergie, plus elle a de mitochondries."]] },
        retenir: "L'optique montre la cellule ; l'électronique montre ses organites, dont le nombre suit l'activité." }
    ],
    denouement: {
      titre: "Des centrales électriques en nombre",
      etapes: ["Le microscope électronique, 1 000 fois plus précis, révèle les organites (indice 1).", "La mitochondrie produit l'énergie par respiration cellulaire (indice 2).", "Cœur ≈ 5 000 mitochondries par cellule, peau ≈ 100 (indice 3)."],
      reponse: "<p>Le microscope électronique utilise un faisceau d'électrons au lieu de la lumière ; son pouvoir de séparation, environ 1 000 fois meilleur, révèle l'ultrastructure de la cellule : noyau, réticulum, appareil de Golgi, ribosomes, lysosomes et mitochondries. Les mitochondries ne sont pas des réserves de graisse : ce sont des organites à double membrane, sièges de la respiration cellulaire, qui libèrent l'énergie à partir des nutriments et du dioxygène. Une cellule du muscle cardiaque, qui travaille sans relâche et encore plus pendant la Course de l'Espoir, en contient environ 5 000, contre 100 pour une cellule de peau : le nombre d'organites dépend de l'activité de la cellule.</p>",
      transfert: "<p>Les cellules du pancréas fabriquent et exportent de grandes quantités d'enzymes (des protéines). Quels organites s'attend-on à y trouver en abondance ? Justifie en trois lignes. <em>(Ribosomes, réticulum endoplasmique, appareil de Golgi.)</em></p>"
    },
    revision: (OR_OLD ? OR_OLD.revision : []).concat(["Pouvoir de séparation : 0,2 µm (optique), 0,2 nm (électronique).", "Le nombre d'organites suit l'activité de la cellule."]),
    exo: OR_OLD ? OR_OLD.exo : "",
    quiz: [
      q("Quel organite produit l'énergie ?", "la mitochondrie", "le lysosome", "la vacuole", "Respiration cellulaire."),
      q("Les protéines sont fabriquées par…", "les ribosomes", "la paroi", "les pores", "Libres ou sur le réticulum."),
      q("Le microscope électronique utilise…", "des électrons", "la lumière", "des ultrasons", "D'où son pouvoir de séparation."),
      q("Le noyau contient…", "l'ADN", "les mitochondries", "les chloroplastes", "Il dirige la cellule."),
      q("La photosynthèse se fait dans…", "le chloroplaste", "la mitochondrie", "le lysosome", "Cellules végétales chlorophylliennes."),
      q("Une cellule du cœur a environ…", "5 000 mitochondries", "100 mitochondries", "aucune mitochondrie", "Gros besoin d'énergie."),
      q("L'appareil de Golgi sert à…", "emballer et expédier les protéines", "digérer les déchets", "produire l'énergie", "Le service d'expédition."),
      q("Le pouvoir de séparation du microscope optique est d'environ…", "0,2 µm", "0,2 nm", "2 mm", "Limite due à la lumière."),
      q("Les lysosomes…", "digèrent les déchets de la cellule", "fabriquent l'ADN", "font la photosynthèse", "Ils contiennent des enzymes digestives."),
      q("Les échantillons observés au microscope électronique sont…", "préparés et morts", "toujours vivants", "colorés au bleu de méthylène seulement", "Ils sont fixés et coupés très finement.")
    ]
  });

  /* ═══════════════════════ 3e ECM — CALCULER LES SIÈGES ═══════════════════════ */
  var S_OLD = ancien("3e-ecm-sieges");
  var COUL_L = ["#1E499B", "#D9472B", "#17784D", "#C48A0C", "#7B3F99"];
  function repartir(voix, n) {
    var tot = voix.reduce(function (a, b) { return a + b; }, 0), qe = tot / n, S = voix.map(function (v) { return Math.floor(v / qe); }), R = voix.map(function (v, i) { return v - S[i] * qe; }), reste = n - S.reduce(function (a, b) { return a + b; }, 0);
    var ord = voix.map(function (v, i) { return i; }).sort(function (a, b) { return R[b] - R[a]; });
    var T = S.slice(); for (var k = 0; k < reste; k++) T[ord[k]]++;
    return { tot: tot, qe: qe, S: S, R: R, T: T, reste: reste };
  }
  function hemicycle(T, cx, cy, R0) {
    var n = T.reduce(function (a, b) { return a + b; }, 0), s = "", k = 0, rangs = n <= 9 ? 1 : n <= 24 ? 2 : 3, par = Math.ceil(n / rangs), L = [];
    T.forEach(function (t, i) { for (var j = 0; j < t; j++) L.push(i); });
    for (var r = 0; r < rangs; r++) {
      var m = Math.min(par, n - k), rr = R0 + r * 34;
      for (var j = 0; j < m; j++, k++) {
        var a = Math.PI - (j + 0.5) / m * Math.PI, x = cx + rr * Math.cos(a), y = cy - rr * Math.sin(a);
        s += "<ellipse cx='" + x.toFixed(1) + "' cy='" + (y + 11).toFixed(1) + "' rx='12' ry='3.5' fill='#001136' opacity='.18'/><circle cx='" + x.toFixed(1) + "' cy='" + y.toFixed(1) + "' r='12' fill='" + COUL_L[L[k]] + "'/><ellipse cx='" + (x - 4).toFixed(1) + "' cy='" + (y - 5).toFixed(1) + "' rx='4.5' ry='2.6' fill='#fff' opacity='.55'/>";
      }
    }
    return s;
  }
  function hemicycle3D(T) {
    var o = [], n = T.reduce(function (a, b) { return a + b; }, 0), L = [], k;
    T.forEach(function (t, i) { for (var j = 0; j < t; j++) L.push(i); });
    o.push({ f: "boite", c: [0, -8, 40], d: [460, 8, 300], coul: "#9C6B3C", dessus: "#C0894F" });
    o.push({ f: "boite", c: [0, 12, 150], d: [120, 36, 40], coul: "#5D3A1E", dessus: "#7A5230" });
    o.push({ f: "boite", c: [0, 32, 140], d: [40, 4, 16], coul: "#2E7D32", dessus: "#3E9B44", div: false });
    for (k = 0; k < n; k++) {
      var a = Math.PI * (k + 0.5) / n, x = -150 * Math.cos(a), z = 130 - 150 * Math.sin(a);
      o.push({ f: "boite", c: [x, 0, z], d: [26, 8, 22], coul: "#4A2C14", dessus: "#5D3A1E", div: false });
      o.push({ f: "boite", c: [x, 8, z], d: [26, 12, 22], coul: COUL_L[L[k]], div: false });
      o.push({ f: "boite", c: [x, 20, z - 8.5], d: [26, 24, 5], coul: COUL_L[L[k]], div: false });
    }
    return o;
  }
  var ELEC = [5300, 3900, 1800, 1000];
  remplacer("3e-ecm-sieges", {
    c: "3e", m: "ecm", titre: "TP : calculer les sièges au scrutin proportionnel", duree: 30,
    accroche: "Quatre listes, sept sièges, 12 000 voix : la liste B réclame un recomptage. A-t-elle raison ?",
    intro: "Une élection municipale simulée en classe te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois réclamations.",
    objectifs: ["calculer les suffrages exprimés et le quotient électoral", "attribuer les sièges au quotient", "répartir les sièges restants au plus fort reste", "vérifier et contester un résultat avec des arguments chiffrés"],
    enquete: {
      titre: "Le conseil municipal simulé de la 3ᵉ B",
      svg: (function () { var r = repartir(ELEC, 7); return svg(640, 210, "Hémicycle de sept sièges colorés selon les listes", "", "<rect width='640' height='210' fill='#F6F3EC'/>" + hemicycle(r.T, 320, 180, 120) + txt(320, 200, "7 sièges à pourvoir", { s: 13, c: GRIS }) + ELEC.map(function (v, i) { return "<rect x='" + (28 + i * 0) + "' y='" + (24 + i * 26) + "' width='14' height='14' rx='4' fill='" + COUL_L[i] + "'/>" + txt(50, 36 + i * 26, "Liste " + "ABCD"[i], { s: 12, a: "start" }); }).join("")); })(),
      legende: "Au collège de Mbalmayo, en ECM : la classe de 3ᵉ B simule l'élection d'un conseil municipal de 7 conseillers.",
      contexte: "<p>Pour comprendre le scrutin proportionnel, la 3ᵉ B organise une élection simulée avec les élèves de tout le collège. Sur 12 600 bulletins, <strong>600 sont blancs ou nuls</strong>. Quatre listes se présentent pour <strong>7 sièges</strong>.</p><p>Le bureau de vote annonce A : 3 sièges, B : 2, C : 1, D : 1. La tête de liste B proteste : « On a presque un tiers des voix, on devrait avoir 3 sièges ! » La liste D, elle, voudrait que l'on compte les bulletins blancs.</p>",
      documents: [{ t: "Procès-verbal du bureau de vote", html: "<table class='donnees'><tr><th>Liste</th><td>A</td><td>B</td><td>C</td><td>D</td><td>blancs et nuls</td></tr><tr><th>Voix</th><td>5 300</td><td>3 900</td><td>1 800</td><td>1 000</td><td>600</td></tr></table>" }],
      question: "La répartition annoncée est-elle juste, et les réclamations des listes B et D sont-elles fondées ?",
      tache: "Refais le calcul complet (suffrages exprimés, quotient, sièges au quotient, plus forts restes) et réponds par écrit aux deux réclamations.",
      hypotheses: ["Il faut compter les 600 bulletins blancs et nuls dans le calcul (liste D).", "La liste B devrait avoir 3 sièges (liste B).", "La répartition 3, 2, 1, 1 est conforme à la méthode du quotient et des plus forts restes."]
    },
    parties: [
      { t: "Suffrages exprimés et quotient électoral", html: (S_OLD ? S_OLD.parties[0].html : "") +
        "<div class='def'><b>Suffrages exprimés</b>Bulletins valablement attribués à une liste : on retire les bulletins <strong>blancs et nuls</strong> du nombre de votants.</div>",
        fil: { html: "<p>Votants : 12 600 ; blancs et nuls : 600 ; suffrages exprimés : <strong>12 000</strong>. Quotient : 12 000 ÷ 7 ≈ <strong>1 714,3</strong> voix par siège. Compter les blancs fausserait le quotient : ils n'expriment le choix d'aucune liste.</p>", verdicts: [[0, "rejetee", "Les blancs et nuls ne sont pas des suffrages exprimés : on ne les compte pas."]] },
        retenir: "On compte les suffrages exprimés : bulletins nuls et blancs exclus." },
      { t: "Répartir les sièges", html: (S_OLD ? S_OLD.parties[1].html : "") +
        "<div class='methode'><b>Le calcul de la 3ᵉ B</b><ol><li>A : 5 300 ÷ 1 714,3 ≈ 3,09 → 3 sièges, reste ≈ 157.</li><li>B : 3 900 ÷ 1 714,3 ≈ 2,28 → 2 sièges, reste ≈ 471.</li><li>C : 1 800 ÷ 1 714,3 ≈ 1,05 → 1 siège, reste ≈ 86.</li><li>D : 1 000 ÷ 1 714,3 ≈ 0,58 → 0 siège, reste 1 000.</li><li>6 sièges attribués, 1 restant : au plus fort reste, <strong>D</strong> (1 000).</li></ol></div>",
        planches: [{ type: "2D", titre: "Sièges au quotient, puis au plus fort reste", legende: "Barres : voix de chaque liste ; chaque case pleine vaut un quotient (≈ 1 714 voix) et donne un siège ; la partie hachurée est le reste. Le 7ᵉ siège va au plus fort reste, celui de D.", svg: (function () {
          var r = repartir(ELEC, 7), s = "", K = 440 / 5400;
          ELEC.forEach(function (v, i) {
            var y = 30 + i * 60, x = 80;
            s += txt(66, y + 24, "ABCD"[i], { s: 18, c: COUL_L[i], a: "end" });
            for (var k = 0; k < r.S[i]; k++) s += "<rect x='" + (x + k * r.qe * K) + "' y='" + y + "' width='" + (r.qe * K - 3) + "' height='34' rx='6' fill='" + COUL_L[i] + "'/>" + txt(x + k * r.qe * K + r.qe * K / 2, y + 23, "siège", { s: 11, c: "#fff" });
            var xr = x + r.S[i] * r.qe * K;
            s += "<rect x='" + xr + "' y='" + y + "' width='" + Math.max(2, r.R[i] * K) + "' height='34' rx='6' fill='url(#hach" + i + ")' stroke='" + COUL_L[i] + "'/>" + txt(xr + r.R[i] * K + 8, y + 22, "reste " + Math.round(r.R[i]) + (r.T[i] > r.S[i] ? " → +1 siège" : ""), { s: 12, a: "start", c: r.T[i] > r.S[i] ? "#C2540A" : GRIS });
          });
          s += "<path d='M" + (80 + r.qe * K) + " 20V270' stroke='" + NUIT + "' stroke-dasharray='4 4'/>" + txt(80 + r.qe * K, 288, "1 quotient ≈ 1 714 voix", { s: 11.5 });
          var d = ELEC.map(function (v, i) { return "<pattern id='hach" + i + "' width='8' height='8' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'><rect width='8' height='8' fill='#fff'/><rect width='3' height='8' fill='" + COUL_L[i] + "' opacity='.45'/></pattern>"; }).join("");
          return svg(640, 300, "Barres des voix des quatre listes découpées en quotients et en restes ; le dernier siège va à la liste D", d, s);
        })() }],
        fil: { html: "<p>Le calcul confirme la répartition annoncée : <strong>A 3, B 2, C 1, D 1</strong>. Le dernier siège revient à D, dont le reste (1 000) dépasse celui de B (≈ 471). Essaie toi-même avec le simulateur : il faudrait à B environ 530 voix de plus pour lui prendre ce siège.</p>", verdicts: [[2, "validee", "Quotient puis plus forts restes : 3, 2, 1, 1."]] },
        retenir: "Quotient d'abord, plus forts restes ensuite." },
      { t: "Lire le résultat et contester avec des arguments", html:
        "<div class='prop'><b>Proportionnalité approchée</b>B a 3 900 ÷ 12 000 = 32,5 % des voix ; 32,5 % de 7 sièges = 2,28 sièges. Avec des sièges entiers, B ne peut avoir que 2 ou 3 sièges : la méthode donne 2, car son reste est plus faible que celui de D.</div>" +
        "<div class='attention'><b>Contester, oui, mais par la loi</b>Toute réclamation se fait par écrit, auprès de l'organe électoral compétent (au Cameroun, ELECAM et, pour le contentieux, les juridictions compétentes), avec des chiffres. Insulter ou bloquer un bureau de vote est une infraction.</div>" +
        (S_OLD ? S_OLD.parties[2].html : ""),
        planches: [{ type: "3d", titre: "La salle du conseil municipal", legende: "Les 7 sièges du conseil, colorés selon les listes : 3 bleus (A), 2 rouges (B), 1 vert (C), 1 jaune (D). Tourne la salle.",
          modele: { h: 320, rx: -32, ry: 0, echelle: 1, alt: "Salle du conseil en hémicycle avec sept fauteuils colorés", objets: hemicycle3D(repartir(ELEC, 7).T),
            etiquettes: [{ p: [0, 30, 150], t: "Tribune du maire" }, { p: [-140, 30, 80], t: "Liste A (3 sièges)" }, { p: [140, 30, 80], t: "Liste D (1 siège)", cote: "d" }] } }],
        fil: { html: "<p>B a 32,5 % des voix, soit 2,28 sièges « idéaux » : obtenir 3 sièges la sur-représenterait davantage que D n'est sur-représentée avec 1. Sa réclamation n'est pas fondée ; elle peut cependant la déposer par écrit.</p>", verdicts: [[1, "rejetee", "B : 2,28 sièges idéaux ; son reste (471) est inférieur à celui de D (1 000)."]] },
        retenir: "Toujours lire le texte de loi avant de calculer ; contester par écrit, chiffres à l'appui." }
    ],
    denouement: {
      titre: "A 3, B 2, C 1, D 1 : le procès-verbal est juste",
      etapes: ["Suffrages exprimés : 12 600 − 600 = 12 000 (indice 1).", "Quotient : 12 000 ÷ 7 ≈ 1 714 ; au quotient : A 3, B 2, C 1, D 0 (indice 2).", "Siège restant au plus fort reste : D (1 000) (indice 2).", "B : 2,28 sièges idéaux, 2 obtenus ; réclamation par écrit possible mais non fondée (indice 3)."],
      reponse: "<p>Les bulletins blancs et nuls ne sont pas des suffrages exprimés : il y en a 12 600 − 600 = 12 000, et la réclamation de D sur ce point n'est pas fondée. Le quotient électoral vaut 12 000 ÷ 7 ≈ 1 714 voix. Au quotient, A obtient 3 sièges, B 2, C 1 et D 0 ; il reste un siège, attribué au plus fort reste, celui de D (1 000 voix, contre environ 471 pour B, 157 pour A et 86 pour C). La répartition annoncée, A 3, B 2, C 1, D 1, est donc conforme. Avec 32,5 % des voix, B a droit à 2,28 sièges « idéaux » : la méthode des plus forts restes lui en donne 2. Elle peut contester par écrit auprès de l'organe compétent, mais ses chiffres ne lui donnent pas raison.</p>",
      transfert: "<p>Même élection, mais avec 9 sièges. Refais la répartition avec le simulateur puis à la main. <em>(Quotient ≈ 1 333 ; au quotient A 3, B 2, C 1, D 0 ; restes A 1 300, B 1 233, C 467, D 1 000 : A, B et D gagnent un siège → A 4, B 3, C 1, D 1.)</em></p>"
    },
    revision: (S_OLD ? S_OLD.revision : []).concat(["Suffrages exprimés = votants − blancs et nuls.", "Contester un résultat : par écrit, devant l'organe compétent, chiffres à l'appui."]),
    exo: S_OLD ? S_OLD.exo : "",
    quiz: [
      q("9 000 suffrages exprimés, 3 sièges : quotient ?", "3 000", "9 000", "300", "9 000 ÷ 3."),
      q("Les bulletins blancs comptent-ils dans les suffrages exprimés ?", "non", "oui", "seulement s'ils sont nombreux", "Ils n'expriment le choix d'aucune liste."),
      q("Après le quotient, les sièges restants vont…", "aux plus forts restes", "au hasard", "toujours à la première liste", "Méthode des plus forts restes."),
      q("12 600 votants, 600 blancs et nuls : suffrages exprimés ?", "12 000", "12 600", "13 200", "On retire les blancs et nuls."),
      q("Quotient pour 12 000 exprimés et 7 sièges :", "environ 1 714", "7", "12 007", "12 000 ÷ 7."),
      q("A a 5 300 voix, quotient 1 714 : sièges au quotient ?", "3", "4", "2", "Partie entière de 3,09."),
      q("D a 1 000 voix et 0 siège au quotient. Son reste vaut…", "1 000", "0", "714", "Aucun quotient complet."),
      q("Qui obtient le 7ᵉ siège ?", "D, plus fort reste", "B, deuxième liste", "A, liste en tête", "1 000 > 471 > 157 > 86."),
      q("Une réclamation électorale se fait…", "par écrit, devant l'organe compétent", "en bloquant le bureau de vote", "sur les réseaux sociaux seulement", "Respect de la loi."),
      q("32,5 % des voix pour 7 sièges représentent…", "2,28 sièges", "3 sièges exactement", "32 sièges", "0,325 × 7.")
    ]
  });

  /* ═══════════════════════ 3e ARTS — OMBRE PROPRE ET OMBRE PORTÉE ═══════════════════════ */
  var A_OLD = ancien("3e-arts-ombre");
  var PLANCHE_SPHERE = (function () {
    var s = "<rect width='640' height='330' fill='#F4EFE6'/><rect y='230' width='640' height='100' fill='#E3D8C4'/>";
    s += "<ellipse cx='392' cy='252' rx='150' ry='22' fill='url(#om1)'/>";
    s += "<circle cx='240' cy='170' r='80' fill='url(#sph1)'/>";
    s += "<path d='M200 101A80 80 0 0 0 314 236' fill='none' stroke='#C2540A' stroke-width='2' stroke-dasharray='5 4'/>";
    s += "<g transform='translate(70 52)'><circle r='18' fill='url(#lp)'/><circle r='34' fill='#FFE066' opacity='.18'/></g><path d='M92 64L190 120' stroke='#F2B705' stroke-width='2' marker-end='url(#fl1)'/><path d='M90 70L310 236' stroke='#F2B705' stroke-width='1.4' stroke-dasharray='6 5'/><path d='M88 62L540 248' stroke='#F2B705' stroke-width='1.4' stroke-dasharray='6 5'/>";
    s += "<g font-size='12' font-weight='700' fill='" + NUIT + "'><path d='M206 140l-60 -20' stroke='" + NUIT + "'/><text x='140' y='116' text-anchor='end'>reflet</text><path d='M236 170l-90 30' stroke='" + NUIT + "'/><text x='140' y='206' text-anchor='end'>lumière</text><path d='M292 154l70 -50' stroke='" + NUIT + "'/><text x='366' y='100'>pénombre</text><path d='M290 214l90 -60' stroke='" + NUIT + "'/><text x='384' y='150'>ombre propre</text><path d='M300 244l-6 6' stroke='" + NUIT + "'/><text x='300' y='292'>reflet du sol</text><text x='470' y='292'>ombre portée</text><path d='M470 280l-20 -26' stroke='" + NUIT + "'/></g>";
    return svg(640, 330, "Une sphère éclairée par une lampe en haut à gauche : reflet, lumière, pénombre, ombre propre, reflet du sol et ombre portée allongée à droite", rad("sph1", ["#FFFFFF", "#E9E4DA", "#B9B1A2", "#6E665A", "#3B352C", "#5A5246"], "32%", "28%") + rad("lp", ["#FFFDE8", "#FFE066", "#F2B705"]) + omb("om1") + fleche("fl1", "#F2B705"), s);
  })();
  function scene3D() {
    return [
      { f: "boite", c: [0, -6, 0], d: [500, 8, 300], coul: "#E3D8C4", dessus: "#EFE6D6" },
      { f: "poly", pts: [[120, 2, -10], [280, 2, 20], [290, 2, -70], [125, 2, -95]], coul: "#6E665A", op: 0.45 },
      { f: "boite", c: [-80, 0, 0], d: [90, 90, 90], coul: "#C9C1B2", dessus: "#EFE9DE", div: false },
      { f: "sphere", c: [120, 52, -50], r: 50, coul: "#D9D2C4" },
      { f: "poly", pts: [[-35, 2, 45], [60, 2, 80], [60, 2, -20], [-35, 2, -45]], coul: "#6E665A", op: 0.4 }
    ];
  }
  remplacer("3e-arts-ombre", {
    c: "3e", m: "arts", titre: "L'ombre et la lumière : ombre propre et ombre portée", duree: 30,
    accroche: "Le canari de grand-mère semble tout plat sur l'affiche. Deux ombres vont lui rendre son volume.",
    intro: "L'affiche de l'exposition du collège te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois conseils.",
    objectifs: ["distinguer ombre propre et ombre portée", "placer les ombres selon la position de la source de lumière", "modeler un volume par un dégradé progressif", "ombrer un volume simple au crayon"],
    enquete: {
      titre: "L'affiche de l'exposition de Foumban",
      svg: (function () {
        var s = "<rect width='640' height='220' fill='#F7F2E8'/><rect x='40' y='20' width='240' height='180' rx='8' fill='#fff' stroke='#C9D2E3'/><path d='M120 70c-30 10-40 70 0 100h80c40-30 30-90 0-100Z' fill='#C9805B' stroke='#7A4A1E' stroke-width='2'/><rect x='130' y='56' width='60' height='16' rx='6' fill='#C9805B' stroke='#7A4A1E' stroke-width='2'/>" + txt(160, 190, "dessin « plat »", { s: 12, c: GRIS });
        s += "<rect x='360' y='20' width='240' height='180' rx='8' fill='#fff' stroke='#C9D2E3'/><ellipse cx='520' cy='172' rx='70' ry='12' fill='url(#om2)'/><path d='M440 70c-30 10-40 70 0 100h80c40-30 30-90 0-100Z' fill='url(#can)' stroke='#7A4A1E' stroke-width='2'/><rect x='450' y='56' width='60' height='16' rx='6' fill='url(#can)' stroke='#7A4A1E' stroke-width='2'/>" + txt(480, 190, "avec ses ombres", { s: 12, c: GRIS });
        s += "<g transform='translate(330 40)'><circle r='12' fill='#FFE066'/><circle r='22' fill='#FFE066' opacity='.25'/></g>";
        return svg(640, 220, "Le même canari dessiné deux fois : plat sans ombres, en volume avec ombre propre et ombre portée", rad("can", ["#F1C3A4", "#C9805B", "#8A4E2C", "#4E2A14"], "30%", "30%") + omb("om2"), s);
      })(),
      legende: "À Foumban, ville des artistes : le collège prépare une exposition sur les objets du patrimoine bamoun.",
      contexte: "<p>Pour l'affiche de l'exposition, Njoya dessine au crayon le <strong>canari</strong> (jarre en terre) de sa grand-mère, posé sur une table près de la fenêtre. Son dessin est juste, mais il paraît « plat », comme découpé.</p><p>Trois camarades le conseillent : « Noircis tout le côté droit uniformément », dit l'un ; « Ajoute une ombre sous le canari, du même côté que la fenêtre », dit l'autre ; la troisième propose de regarder d'où vient la lumière avant de toucher au crayon.</p>",
      documents: [{ t: "La position de la lumière", html: "<p>La fenêtre est <strong>en haut à gauche</strong> du canari ; c'est la fin d'après-midi, le soleil est assez bas.</p>" }],
      question: "Où placer l'ombre propre et l'ombre portée, et comment ombrer pour que le canari paraisse en volume ?",
      tache: "Rédige pour Njoya une méthode en quatre étapes, puis ombre une sphère éclairée par la gauche.",
      hypotheses: ["Il suffit de noircir uniformément tout le côté droit.", "L'ombre portée se place du même côté que la fenêtre.", "Ombre propre à l'opposé de la lumière, avec un dégradé ; ombre portée sur la table, à droite, allongée car le soleil est bas."]
    },
    parties: [
      { t: "Deux sortes d'ombres", html: (A_OLD ? A_OLD.parties[0].html : ""),
        fil: { html: "<p>La lumière arrive en haut à gauche : l'<strong>ombre propre</strong> sera sur la partie droite et basse du canari ; l'<strong>ombre portée</strong> sera projetée sur la table, vers la droite, à l'opposé de la fenêtre. Fais tourner la lampe dans l'animation pour le vérifier.</p>", verdicts: [[1, "rejetee", "L'ombre portée se forme à l'opposé de la source de lumière."]] },
        retenir: "Propre : SUR l'objet. Portée : À CÔTÉ de l'objet, à l'opposé de la lumière." },
      { t: "Lumière, pénombre, ombre", html: (A_OLD ? A_OLD.parties[1].html : "") +
        "<div class='def'><b>Reflet du sol</b>Au bas de l'ombre propre, la table renvoie un peu de lumière : une bande légèrement plus claire, qui renforce l'impression de volume.</div>",
        planches: [
          { type: "2D", titre: "Les six valeurs d'une sphère éclairée", legende: "Du plus clair au plus foncé : reflet, lumière, pénombre, ombre propre (la limite en pointillés est la ligne de séparation), puis le reflet du sol ; l'ombre portée s'allonge à droite, d'autant plus que la lampe est basse.", svg: PLANCHE_SPHERE },
          { type: "3d", titre: "Un cube et une sphère sur la table", legende: "Tourne la scène : la lumière vient d'en haut à gauche ; les faces tournées vers elle sont claires, les autres foncées, et les ombres portées s'étirent vers la droite.",
            modele: { h: 320, rx: -26, ry: 20, echelle: 1, alt: "Un cube et une sphère blancs sur une table avec leurs ombres portées", objets: scene3D(), etiquettes: [{ p: [-80, 92, 0], t: "Face éclairée" }, { p: [230, 4, -30], t: "Ombre portée", cote: "d" }] } }
        ],
        fil: { html: "<p>Noircir uniformément donne un aplat sans relief : c'est le <strong>dégradé progressif</strong> (lumière, pénombre, ombre) qui fait « tourner » la surface du canari.</p>", verdicts: [[0, "rejetee", "Un aplat uniforme ne donne pas de volume : il faut un dégradé progressif."]] },
        retenir: "Le passage de la lumière à l'ombre doit être progressif." },
      { t: "Ombrer au crayon", html: (A_OLD ? A_OLD.parties[2].html : "") +
        "<div class='ex'><b>Pour le canari</b>Flèche de lumière en haut à gauche ; ligne de séparation en arc sur la droite de la panse ; hachures croisées au 2B qui suivent la courbure ; bande claire en bas (reflet de la table) ; ombre portée au 4B, allongée vers la droite et plus floue en s'éloignant.</div>",
        fil: { html: "<p>Avec ces quatre étapes, le canari de Njoya « sort » de la feuille : la conseillère qui voulait d'abord repérer la lumière avait raison.</p>", verdicts: [[2, "validee", "Lumière d'abord, dégradé sur l'objet, ombre portée allongée à l'opposé."]] },
        retenir: "Toujours partir de la position de la lumière." }
    ],
    denouement: {
      titre: "Le canari prend du volume",
      etapes: ["Repérer la lumière : en haut à gauche (indice 1).", "Ombre propre à droite, en dégradé progressif, avec le reflet du sol (indice 2).", "Ombre portée sur la table, vers la droite, allongée car le soleil est bas (indices 2 et 3)."],
      reponse: "<p>Njoya doit d'abord repérer la source de lumière : la fenêtre, en haut à gauche. L'ombre propre se place alors sur la partie droite et basse du canari, mais pas en aplat : on passe progressivement de la lumière à la pénombre puis à l'ombre, en gardant un reflet clair là où la lumière frappe directement et une bande plus claire en bas, renvoyée par la table. L'ombre portée se dessine sur la table, à l'opposé de la fenêtre, donc vers la droite ; comme le soleil est bas en fin d'après-midi, elle est allongée. Noircir tout le côté droit ou placer l'ombre portée du côté de la fenêtre aplatirait le dessin ou le rendrait incohérent.</p>",
      transfert: "<p>À midi, le soleil est presque au-dessus du canari. Décris en trois lignes comment changent l'ombre propre et l'ombre portée. <em>(Ombre propre en bas de la panse, ombre portée courte, presque sous l'objet.)</em></p>"
    },
    revision: (A_OLD ? A_OLD.revision : []).concat(["Six valeurs : reflet, lumière, pénombre, ombre propre, reflet du sol, ombre portée."]),
    exo: A_OLD ? A_OLD.exo : "",
    quiz: [
      q("L'ombre portée se trouve…", "du côté opposé à la lumière, sur une surface", "sur l'objet", "toujours derrière le dessinateur", "C'est l'ombre projetée."),
      q("Si la lampe descend, l'ombre portée…", "s'allonge", "raccourcit", "disparaît", "Comme les ombres du soir."),
      q("Pour des noirs profonds, on prend un crayon…", "4B", "H", "HB", "B = tendre et foncé."),
      q("L'ombre propre se trouve…", "sur l'objet, du côté non éclairé", "sur la table", "du côté de la lampe", "Partie de l'objet sans lumière."),
      q("La lumière vient de gauche : l'ombre portée va…", "vers la droite", "vers la gauche", "sous la lampe", "À l'opposé de la source."),
      q("Le point le plus clair d'une sphère s'appelle…", "le reflet", "la pénombre", "l'ombre portée", "Lumière directement renvoyée."),
      q("La pénombre est…", "le passage progressif de la lumière à l'ombre", "l'ombre la plus noire", "l'ombre sur le sol", "Zone intermédiaire."),
      q("Pourquoi un aplat noir ne donne-t-il pas de volume ?", "il n'y a pas de dégradé", "le crayon est trop dur", "la feuille est trop petite", "Le volume naît des valeurs progressives."),
      q("À midi, l'ombre portée est…", "courte", "très longue", "inexistante pour toujours", "Soleil haut."),
      q("Première étape pour ombrer un objet :", "repérer la source de lumière", "noircir le fond", "gommer les contours", "Tout en découle.")
    ]
  });

  /* ═══════════════════════ SIMULATION : RÉPARTITION DES SIÈGES ═══════════════════════ */
  VRT_A("3e-ecm-sieges", 1, "Simulateur : change les voix et le nombre de sièges", function (el) {
    function cur(l, min, max, pas, v) { return "<label class='labo-c'><span>" + l + " : <b data-v>" + v.toLocaleString("fr-FR") + "</b></span><input type='range' min='" + min + "' max='" + max + "' step='" + pas + "' value='" + v + "'></label>"; }
    el.innerHTML = "<div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:4px 18px'>" + ELEC.map(function (v, i) { return cur("Voix de " + "ABCD"[i], 0, 8000, 50, v); }).join("") + cur("Sièges", 3, 21, 1, 7) + "</div><svg viewBox='0 0 640 230' class='an-svg' data-s></svg><div class='tab-scroll' data-t></div><p class='labo-r' data-r></p>";
    var I = el.querySelectorAll("input"), V = el.querySelectorAll("[data-v]");
    function maj() {
      var voix = [0, 1, 2, 3].map(function (i) { return +I[i].value; }), n = +I[4].value;
      I.forEach(function (x, i) { V[i].textContent = (+x.value).toLocaleString("fr-FR"); });
      var tot = voix.reduce(function (a, b) { return a + b; }, 0);
      if (!tot) { el.querySelector("[data-r]").textContent = "Aucun suffrage exprimé."; return; }
      var r = repartir(voix, n);
      el.querySelector("[data-s]").innerHTML = hemicycle(r.T, 320, 210, n > 9 ? 110 : 140) + r.T.map(function (t, i) { return "<rect x='16' y='" + (14 + i * 24) + "' width='14' height='14' rx='4' fill='" + COUL_L[i] + "'/><text x='36' y='26' dy='" + i * 24 + "' font-size='12.5' font-weight='700' fill='" + NUIT + "'>" + "ABCD"[i] + " : " + t + "</text>"; }).join("");
      el.querySelector("[data-t]").innerHTML = "<table><tr><th>Liste</th><th>Voix</th><th>Au quotient</th><th>Reste</th><th>Total</th></tr>" + voix.map(function (v, i) { return "<tr><th>" + "ABCD"[i] + "</th><td>" + v.toLocaleString("fr-FR") + "</td><td>" + r.S[i] + "</td><td>" + Math.round(r.R[i]).toLocaleString("fr-FR") + "</td><td><b>" + r.T[i] + "</b>" + (r.T[i] > r.S[i] ? " (+1 au reste)" : "") + "</td></tr>"; }).join("") + "</table>";
      el.querySelector("[data-r]").innerHTML = "Suffrages exprimés : <b>" + tot.toLocaleString("fr-FR") + "</b> · quotient : <b>" + Math.round(r.qe).toLocaleString("fr-FR") + "</b> voix par siège · sièges au quotient : <b>" + (n - r.reste) + "</b> · aux plus forts restes : <b>" + r.reste + "</b>";
    }
    I.forEach(function (x) { x.addEventListener("input", maj); }); maj();
  });
})();
