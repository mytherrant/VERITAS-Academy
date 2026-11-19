/* Leçons APPROFONDIES — lot 16, 4e et 6e (18/11/2026) : tons des langues nationales (4e), carte linguistique, intelligence
   artificielle, composants de l'ordinateur (6e). Même gabarit et même mécanisme que 11-approfondies-lot4.js (remplacement EN PLACE ;
   ordre, clé, scènes conservés ; schémas d'origine (illus) repris ; quiz portés à 10 questions). Simulations VRT_A en fin. */
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
  function ill(old, i) { return old && old.parties[i] ? old.parties[i].illus : undefined; }
  function bloc(x, y, w, h, c, l1, l2) {
    return "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='" + h + "' rx='10' fill='" + c + "'/>" + txt(x + w / 2, y + h / 2 - (l2 ? 3 : -5), l1, { s: 14, c: "#fff" }) + (l2 ? txt(x + w / 2, y + h / 2 + 14, l2, { s: 10, c: "#fff", w: 500 }) : "");
  }
  var CMR = [[8.6, 4.6], [9.3, 6.0], [10.1, 6.9], [11.1, 6.5], [11.8, 7.1], [12.3, 8.4], [13.0, 9.4], [13.6, 10.2], [14.1, 11.2], [14.6, 12.0], [14.1, 13.0], [14.6, 13.1], [15.0, 12.0], [15.1, 10.8], [15.6, 10.0], [14.4, 9.9], [14.9, 8.7], [15.5, 7.5], [14.6, 6.3], [14.5, 5.0], [15.0, 4.1], [16.1, 3.0], [16.2, 2.2], [15.0, 1.9], [13.3, 2.2], [11.3, 2.2], [9.8, 2.3], [9.8, 3.0], [9.5, 3.9], [9.0, 4.0]];
  function dedans(x, y) { var c = false, i, j; for (i = 0, j = CMR.length - 1; i < CMR.length; j = i++) { var a = CMR[i], b = CMR[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
  var FAM = { bantou: ["#2E7D32", "langues bantoues"], grass: ["#C2540A", "langues des Grassfields"], adam: ["#B8860B", "langues adamawa-oubanguiennes"], tchad: ["#7B3F99", "langues tchadiques"] };
  function famille(lon, lat) { if (lat > 10) return "tchad"; if (lon < 11.6 && lat > 5 && lat < 7.3) return "grass"; if (lat > 6.4 || (lon > 13.4 && lat > 3.6)) return "adam"; return "bantou"; }

  /* ═══════════════════════ 4e LANGUES NATIONALES — LES TONS ═══════════════════════ */
  var LT_OLD = ancien("4e-ln-tons");
  var TONS = [["haut", "á", [260, 260]], ["bas", "à", [150, 150]], ["moyen", "ā", [200, 200]], ["montant", "ǎ", [150, 270]], ["descendant", "â", [270, 150]]];
  function nkul3D() {
    var o = [], k;
    [-80, 80].forEach(function (x) { o.push({ f: "boite", c: [x, 10, 0], d: [16, 20, 90], coul: "#5D3A1E", dessus: "#6B4423" }); });
    o.push({ f: "boite", c: [0, -4, 0], d: [320, 8, 160], coul: "#8B6B4A", dessus: "#A68A5E" });
    o.push({ f: "cylindre", c: [-120, 54, 0], r: 34, h: 240, n: 22, axe: "x", coul: "#7A4A1E" });
    o.push({ f: "boite", c: [0, 88.5, 0], d: [160, 1.5, 7], coul: "#1F140C", div: false });
    o.push({ f: "boite", c: [0, 88.6, -12], d: [150, 1, 14], coul: "#9C6A3A", div: false });
    o.push({ f: "boite", c: [0, 88.6, 12], d: [150, 1, 14], coul: "#6B4423", div: false });
    for (k = 0; k < 2; k++) { o.push({ f: "cylindre", c: [40 + k * 30, 96, -70], r: 2.5, h: 70, n: 6, axe: "z", coul: "#C9A06E" }); o.push({ f: "sphere", c: [40 + k * 30, 96, -76], r: 7, coul: "#3B2416" }); }
    o.push({ f: "cylindre", c: [-120, 54, 0], r: 34.4, h: 2, n: 22, axe: "x", coul: "#5D3A1E" });
    o.push({ f: "cylindre", c: [118, 54, 0], r: 34.4, h: 2, n: 22, axe: "x", coul: "#5D3A1E" });
    return o;
  }
  remplacer("4e-ln-tons", {
    c: "4e", m: "ln", titre: "Les tons de nos langues", duree: 30,
    accroche: "« Les accents, c'est pour faire joli : enlevons-les de l'affiche ! » Le club de langues nationales a-t-il raison ?",
    intro: "Une affiche préparée par le club de langues nationales d'un lycée de Yaoundé te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur les tons.",
    objectifs: ["définir le ton comme hauteur mélodique d'une syllabe", "distinguer ton et volume de la voix", "noter les tons selon l'AGLC (´ ` ¯ ˇ ˆ)", "reconnaître un ton à l'oreille"],
    enquete: {
      titre: "L'affiche du club de langues nationales",
      svg: svg(640, 220, "Deux élèves devant une affiche écrite en langue nationale avec des accents sur les voyelles ; l’un veut effacer les accents", lin("ltC", ["#F4EDE1", "#E9DFCF"], true),
        "<rect width='640' height='220' fill='url(#ltC)'/><rect y='190' width='640' height='30' fill='#B88A5A'/><rect x='190' y='26' width='260' height='150' rx='6' fill='#FFFBEA' stroke='#C9B28A' stroke-width='3'/>" + txt(320, 58, "Club de langues nationales", { s: 13, c: VERT }) + txt(320, 100, "bá · bà · bā · bǎ · bâ", { s: 26, c: BLEU }) + txt(320, 136, "Un même « ba », cinq mélodies", { s: 12, c: GRIS, w: 600 }) + "<path d='M232 92l18 -18' stroke='" + ROUGE + "' stroke-width='3'/><path d='M228 74l22 22' stroke='" + ROUGE + "' stroke-width='3' opacity='0'/>" +
        perso(110, 96, "#5A3A1E", "#F7C948", "#2E3445") + "<path d='M128 116l60 -30' stroke='#6B4423' stroke-width='4'/>" + perso(540, 96, "#6B4423", "#2E7D32", "#1E499B") + bulle(20, 40, 170, "On efface les accents ?", "#F7C948") + bulle(462, 40, 160, "Tu changes les mots !", "#9FC5E8")),
      legende: "Au lycée bilingue d'Etoug-Ebé, à Yaoundé : le club de langues nationales prépare une affiche pour la journée des langues maternelles.",
      contexte: "<p>L'affiche montre le même « ba » écrit avec cinq signes différents. Paul veut les effacer : « Ce sont des accents décoratifs ; et de toute façon, le ton, c'est juste parler plus fort ou moins fort. » Marie proteste : « En français déjà, “a” et “à” ne veulent pas dire la même chose ! » Le professeur leur propose d'écouter, puis de vérifier dans l'AGLC.</p>",
      documents: [{ t: "Extrait de l'AGLC (1979)", html: "<p>« Les tons sont notés sur la voyelle : ton haut par l'accent aigu, ton bas par l'accent grave, ton moyen par le macron, ton montant par le caron, ton descendant par l'accent circonflexe. »</p>" }],
      question: "Qu'est-ce qu'un ton, et peut-on supprimer ces signes sans changer les mots ?",
      tache: "Définis le ton, montre que ce n'est pas le volume, puis explique le rôle des signes de l'AGLC.",
      hypotheses: ["Les signes sont des accents décoratifs : on peut les supprimer.", "Le ton, c'est le volume : parler fort ou doucement.", "Le ton est la hauteur mélodique d'une syllabe ; il distingue des mots ; l'AGLC le note par ´ ` ¯ ˇ ˆ."]
    },
    parties: [
      { t: "Qu'est-ce qu'un ton ?", html: partie(LT_OLD, 0),
        planches: [{ type: "2D", titre: "Hauteur ou volume ?", legende: "À gauche, on chante « ba » plus haut ou plus bas : c'est la hauteur, le ton change. À droite, on dit « ba » plus fort ou plus doucement : c'est le volume, le ton ne change pas. Seule la hauteur distingue les mots.", svg: (function () {
          var s = "<rect width='640' height='250' fill='#FBF8F2'/><rect x='20' y='20' width='290' height='210' rx='12' fill='#fff' stroke='" + VERT + "' stroke-width='2'/><rect x='330' y='20' width='290' height='210' rx='12' fill='#fff' stroke='" + ROUGE + "' stroke-width='2'/>";
          s += txt(165, 44, "La HAUTEUR change : le ton change", { s: 12, c: VERT });
          [[60, 0.06], [190, 0.025]].forEach(function (w, i) { var d = "", x; for (x = 0; x <= 110; x += 2) d += (x ? "L" : "M") + (w[0] - 20 + x) + " " + (130 + 34 * Math.sin(x * w[1] * 6.28)).toFixed(1); s += "<path d='" + d + "' stroke='" + VERT + "' stroke-width='2.5' fill='none'/>" + txt(w[0] + 35, 196, i ? "bà : son grave" : "bá : son aigu", { s: 12 }); });
          s += txt(475, 44, "Le VOLUME change : même ton", { s: 12, c: ROUGE });
          [[370, 40], [500, 14]].forEach(function (w, i) { var d = "", x; for (x = 0; x <= 110; x += 2) d += (x ? "L" : "M") + (w[0] - 20 + x) + " " + (130 + w[1] * Math.sin(x * 0.045 * 6.28)).toFixed(1); s += "<path d='" + d + "' stroke='" + ROUGE + "' stroke-width='2.5' fill='none'/>" + txt(w[0] + 35, 196, i ? "ba (doucement)" : "BA ! (fort)", { s: 12 }); });
          s += txt(165, 216, "vagues serrées = aigu ; larges = grave", { s: 10, c: GRIS, w: 500 }) + txt(475, 216, "vagues hautes = fort ; basses = doux", { s: 10, c: GRIS, w: 500 });
          return svg(640, 250, "Deux ondes de fréquences différentes pour les tons haut et bas, et deux ondes de même fréquence mais d’amplitudes différentes pour le volume", "", s);
        })() }],
        fil: { html: "<p>Crier « BA ! » ou murmurer « ba » ne change pas le mot : c'est le <strong>volume</strong> (la hauteur des vagues sonores). Le ton, lui, est la <strong>hauteur musicale</strong> (des vagues plus ou moins serrées) : aigu ou grave, montant ou descendant. Un enfant et un adulte qui disent le même mot ont des voix différentes, mais la même mélodie.</p>", verdicts: [[1, "rejetee", "Le volume ne change pas le mot ; le ton est une hauteur musicale."]] },
        retenir: "Ton = hauteur musicale d'une syllabe, pas volume." },
      { t: "Les tons et leur notation (AGLC)", html: partie(LT_OLD, 1), illus: ill(LT_OLD, 1),
        planches: [{ type: "3d", titre: "Le tambour d'appel (nkul)", legende: "Tourne le tambour à fente : un tronc évidé, fendu sur le dessus. Ses deux lèvres n'ont pas la même épaisseur : la lèvre fine sonne aigu, la lèvre épaisse sonne grave. En frappant l'une ou l'autre, le joueur reproduit la mélodie des mots et transmet des messages d'un village à l'autre : la preuve que, dans nos langues, la mélodie porte le sens.",
          modele: { h: 340, rx: -26, ry: 30, echelle: 0.95, alt: "Tambour à fente en bois posé sur deux supports, avec deux baguettes", objets: nkul3D(),
            etiquettes: [{ p: [0, 90, -12], t: "lèvre fine : son aigu (ton haut)", cote: "g" }, { p: [0, 90, 12], t: "lèvre épaisse : son grave (ton bas)", cote: "d" }, { p: [55, 96, -76], t: "baguettes", cote: "g" }] } }],
        fil: { html: "<p>Si l'on efface les signes, bá, bà, bā, bǎ et bâ s'écrivent tous « ba » : cinq mots deviennent impossibles à distinguer à l'écrit, comme si l'on écrivait « a » pour « à » en français. Les tambours parleurs le montrent : on peut transmettre un message <strong>avec les seuls tons</strong>. Les signes ne sont pas décoratifs.</p>", verdicts: [[0, "rejetee", "Sans les signes de ton, des mots différents s'écrivent pareil."]] },
        retenir: "Haut ´, bas `, moyen ¯, montant ˇ, descendant ˆ." },
      { t: "S'entraîner", html: partie(LT_OLD, 2),
        fil: { html: "<p>En écoutant les cinq mélodies (simulation ci-dessus), on entend que la hauteur seule change. On retrouve la définition : le ton est la <strong>hauteur mélodique</strong> d'une syllabe, qui peut distinguer des mots ; l'AGLC le note par un signe sur la voyelle.</p>", verdicts: [[2, "validee", "Hauteur mélodique, sens distinctif, notation AGLC."]] },
        retenir: "Fredonner la mélodie aide à entendre les tons." }
    ],
    denouement: {
      titre: "L'affiche reste intacte",
      etapes: ["Le ton n'est pas le volume (indice 1).", "Sans signes, des mots différents se confondent ; le tambour parle avec les tons (indice 2).", "Hauteur mélodique notée par l'AGLC (indice 3)."],
      reponse: "<p>Paul se trompe deux fois. Le ton n'est pas le volume : on peut crier ou chuchoter un mot sans le changer. Le ton est la hauteur musicale d'une syllabe : haut, bas, moyen, montant ou descendant. Dans la plupart des langues camerounaises, cette hauteur suffit à distinguer des mots qui ont les mêmes consonnes et les mêmes voyelles ; les tambours d'appel transmettent même des messages avec les seules mélodies. Les signes de l'affiche ne sont donc pas décoratifs : ce sont les notations de l'Alphabet général des langues camerounaises (accent aigu pour le ton haut, grave pour le bas, macron pour le moyen, caron pour le montant, circonflexe pour le descendant). Les effacer, ce serait confondre cinq mots en un.</p>",
      transfert: "<p>Avec ton enseignant, trouve dans la langue étudiée en classe deux mots qui ne diffèrent que par le ton ; fredonne-les, trace leur courbe et note-les avec les signes de l'AGLC.</p>"
    },
    revision: (LT_OLD ? LT_OLD.revision : []).concat(["Le volume (fort / doux) ne change pas le ton."]),
    exo: LT_OLD ? LT_OLD.exo : "",
    quiz: [
      q("Le ton est…", "la hauteur musicale d'une syllabe", "le volume de la voix", "la vitesse de parole", "Aigu ou grave, montant ou descendant."),
      q("Le ton haut se note…", "á (accent aigu)", "à (accent grave)", "ā (macron)", "Accent aigu."),
      q("Le ton bas se note…", "à", "á", "â", "Accent grave."),
      q("Le ton moyen se note…", "ā (macron)", "ǎ (caron)", "â (circonflexe)", "Un trait au-dessus de la voyelle."),
      q("Un ton montant va…", "du bas vers le haut", "du haut vers le bas", "reste plat", "Noté ǎ (caron)."),
      q("Un ton descendant se note…", "â", "ǎ", "ā", "Accent circonflexe."),
      q("Crier un mot au lieu de le murmurer…", "ne change pas son ton", "change toujours son sens", "le rend montant", "C'est le volume, pas la hauteur."),
      q("Dans une langue à tons, le ton peut…", "changer le sens du mot", "ne rien changer", "remplacer les consonnes", "D'où l'importance de bien le noter."),
      q("L'AGLC a été adopté en…", "1979", "1960", "2001", "Alphabet général des langues camerounaises."),
      q("Le tambour d'appel peut transmettre un message parce que…", "il reproduit la mélodie des mots", "il imite les consonnes", "il parle français", "Ses deux lèvres donnent deux hauteurs.")
    ]
  });

  /* ═══════════════════════ 6e LANGUES NATIONALES — LA CARTE LINGUISTIQUE ═══════════════════════ */
  var LC_OLD = ancien("6e-ln-carte");
  function maquetteCMR() {
    var o = [], lon, lat, P = 0.42, K = 40, X = function (l) { return (l - 12.3) * K; }, Z = function (l) { return (l - 7.4) * K; };
    o.push({ f: "boite", c: [0, -10, 0], d: [380, 6, 500], coul: "#5B8FB0", dessus: "#9CC3DD" });
    for (lat = 1.9; lat < 13.2; lat += P) for (lon = 8.6; lon < 16.3; lon += P) {
      if (!dedans(lon + P / 2, lat + P / 2)) continue;
      var f = famille(lon + P / 2, lat + P / 2);
      o.push({ f: "boite", c: [X(lon + P / 2), -2, Z(lat + P / 2)], d: [P * K - 1, 10, P * K - 1], coul: "#7A6A55", dessus: FAM[f][0], div: false });
    }
    [["ewondo", 11.5, 3.87, "bantou"], ["duala", 9.7, 4.05, "bantou"], ["ghomálá'", 10.42, 5.48, "grass"], ["mbum", 13.58, 7.32, "adam"], ["mafa", 13.8, 10.8, "tchad"], ["gbaya", 14.6, 5.2, "adam"]].forEach(function (v) { o.push({ f: "cylindre", c: [X(v[1]), 3, Z(v[2])], r: 1.6, h: 34, n: 6, coul: "#4D5163" }); o.push({ f: "sphere", c: [X(v[1]), 40, Z(v[2])], r: 6, coul: "#F7C948" }); });
    return o;
  }
  remplacer("6e-ln-carte", {
    c: "6e", m: "ln", titre: "La carte linguistique du Cameroun", duree: 30,
    accroche: "« Au Cameroun, on parle deux langues : le français et l'anglais. » « Non : on parle une seule langue avec plein d'accents ! » Et si les deux avaient tort ?",
    intro: "L'arrivée d'un nouvel élève de Maroua dans une classe de 6e à Yaoundé te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois affirmations.",
    objectifs: ["savoir que le Cameroun compte plus de 250 langues nationales", "nommer les grandes familles et les situer", "connaître les quatre grandes aires culturelles", "savoir à quoi sert l'AGLC"],
    enquete: {
      titre: "Le nouvel élève venu de Maroua",
      svg: svg(640, 220, "Une salle de classe : un nouvel élève en boubou salue en fulfulde ; deux camarades discutent", lin("lcC", ["#EAF3E6", "#F7F3EA"], true),
        "<rect width='640' height='220' fill='url(#lcC)'/><rect y='186' width='640' height='34' fill='#C9A06E'/><rect x='240' y='18' width='170' height='96' fill='#2E4A3A' stroke='#6B4423' stroke-width='5'/>" + txt(325, 48, "Bienvenue Moussa !", { s: 13, c: "#F4F1EA" }) + txt(325, 72, "Jam waali ? (fulfulde)", { s: 11, c: "#F7C948", w: 500 }) + txt(325, 94, "Mbəmbə kídí (ewondo)", { s: 11, c: "#9FC5E8", w: 500 }) +
        perso(325, 110, "#4A2E1A", "#F4F1EA", "#F4F1EA") + "<path d='M308 132h34v30h-34Z' fill='#E9E2D2' opacity='.6'/>" + perso(110, 100, "#5A3A1E", "#DCE6F2", "#1E499B") + perso(540, 100, "#6B4423", "#DCE6F2", "#1E499B") + bulle(20, 40, 180, "Deux langues seulement !", "#F7C948") + bulle(440, 40, 190, "Une seule, avec des accents !", "#9FC5E8")),
      legende: "Dans un collège de Yaoundé, Moussa, arrivé de Maroua, salue sa nouvelle classe en fulfulde ; sa voisine répond en ewondo.",
      contexte: "<p>Après les salutations, Brice affirme : « Au Cameroun, on parle deux langues, le français et l'anglais ; le reste, ce sont des patois. » Clarisse réplique : « Le fulfulde et l'ewondo, c'est la même langue avec des accents différents. » La maîtresse sort la carte linguistique du Cameroun.</p>",
      documents: [{ t: "Ce que disent les linguistes", html: "<p>« Le Cameroun compte plus de 250 langues nationales, réparties en plusieurs grandes familles, auxquelles s'ajoutent deux langues officielles, le français et l'anglais. »</p>" }],
      question: "Combien de langues parle-t-on au Cameroun, et l'ewondo et le fulfulde sont-ils une même langue ?",
      tache: "À l'aide de la carte, réponds à Brice et à Clarisse en citant les grandes familles de langues et leurs régions.",
      hypotheses: ["On ne parle que deux langues au Cameroun : le français et l'anglais.", "Toutes nos langues sont une seule langue avec des accents différents.", "Plus de 250 langues nationales, réparties en grandes familles selon les régions, plus deux langues officielles."]
    },
    parties: [
      { t: "Une grande diversité", html: partie(LC_OLD, 0),
        planches: [{ type: "2D", titre: "Bonjour, de toutes les manières", legende: "Une même salutation dans quelques langues du Cameroun, en plus du français et de l'anglais : chaque langue a son vocabulaire et sa grammaire. Les deux langues officielles s'ajoutent aux langues nationales, elles ne les remplacent pas.", svg: (function () {
          var L = [["français", "Bonjour", BLEU, "officielle"], ["anglais", "Good morning", BLEU, "officielle"], ["fulfulde", "Jam waali", "#B8860B", "Nord"], ["ewondo", "Mbəmbə kídí", "#2E7D32", "Centre"], ["duala", "Bwam", "#2E7D32", "Littoral"], ["ghomálá'", "Ǒ zǐ nyɛ̀", "#C2540A", "Ouest"]], s = "<rect width='640' height='240' fill='#FBF8F2'/>";
          L.forEach(function (l, i) { var x = 20 + (i % 3) * 206, y = 20 + Math.floor(i / 3) * 104; s += "<rect x='" + x + "' y='" + y + "' width='190' height='88' rx='14' fill='#fff' stroke='" + l[2] + "' stroke-width='2.5'/><rect x='" + x + "' y='" + y + "' width='190' height='26' rx='12' fill='" + l[2] + "'/>" + txt(x + 95, y + 18, l[0], { s: 12, c: "#fff" }) + txt(x + 95, y + 56, l[1], { s: 17 }) + txt(x + 95, y + 78, l[3], { s: 10, c: GRIS, w: 500 }); });
          return svg(640, 240, "Six cartes de salutation : français, anglais, fulfulde, ewondo, duala, ghomálá’", "", s);
        })() }],
        fil: { html: "<p>Le français et l'anglais sont les deux langues <strong>officielles</strong> (administration, école). Mais à côté d'elles, plus de <strong>250 langues nationales</strong> sont parlées en famille, au marché, dans les cérémonies. Ce ne sont pas des « patois » : ce sont de vraies langues, avec leur grammaire et leur vocabulaire.</p>", verdicts: [[0, "rejetee", "Deux langues officielles, mais plus de 250 langues nationales."]] },
        retenir: "Plus de 250 langues nationales + 2 langues officielles." },
      { t: "Les grandes familles", html: partie(LC_OLD, 1),
        planches: [{ type: "3d", titre: "La maquette des familles de langues", legende: "Tourne la maquette : chaque couleur est une grande famille. Vert : langues bantoues (Sud, Centre, Littoral) ; orange : Grassfields (Ouest, Nord-Ouest) ; ocre : adamawa-oubanguiennes (Adamaoua, Est) ; violet : tchadiques (Extrême-Nord). Les épingles marquent quelques langues. Limites approximatives : les langues se mêlent aux frontières.",
          modele: { h: 400, rx: -48, ry: 0, echelle: 0.62, alt: "Maquette du Cameroun en carreaux colorés selon les familles de langues, avec six épingles", objets: maquetteCMR(),
            etiquettes: [{ p: [(11.5 - 12.3) * 40, 46, (3.87 - 7.4) * 40], t: "ewondo (bantoue)", cote: "d" }, { p: [(9.7 - 12.3) * 40, 46, (4.05 - 7.4) * 40], t: "duala (bantoue)", cote: "g" }, { p: [(10.42 - 12.3) * 40, 46, (5.48 - 7.4) * 40], t: "ghomálá' (Grassfields)", cote: "g" }, { p: [(13.58 - 12.3) * 40, 46, (7.32 - 7.4) * 40], t: "mbum (adamawa)", cote: "d" }, { p: [(13.8 - 12.3) * 40, 46, (10.8 - 7.4) * 40], t: "mafa (tchadique)", cote: "d" }, { p: [(14.6 - 12.3) * 40, 46, (5.2 - 7.4) * 40], t: "gbaya (adamawa)", cote: "d" }] } }],
        fil: { html: "<p>L'ewondo appartient à la famille <strong>bantoue</strong>, au Centre ; le fulfulde à la famille <strong>atlantique</strong>, venue avec les Peuls et devenue langue de communication dans le Nord. Leurs mots, leurs sons et leur grammaire sont très différents : ce ne sont pas des « accents » d'une même langue, mais des langues de familles distinctes.</p>", verdicts: [[1, "rejetee", "Ewondo (bantoue) et fulfulde (atlantique) sont des langues de familles différentes."]] },
        retenir: "Bantou au Sud, Grassfields à l'Ouest, adamawa à l'Adamaoua et l'Est, tchadique à l'Extrême-Nord." },
      { t: "Quatre grandes aires culturelles", html: partie(LC_OLD, 2), illus: ill(LC_OLD, 2),
        fil: { html: "<p>Les langues se regroupent aussi avec les modes de vie : Moussa vient de l'aire <strong>soudano-sahélienne</strong>, sa voisine ewondo de l'aire <strong>fang-béti</strong>. Chaque aire a ses traditions, et souvent des langues voisines.</p>", verdicts: [] },
        retenir: "Quatre aires : soudano-sahélienne, Grassfields, sawa, fang-béti." },
      { t: "Écrire nos langues", html: partie(LC_OLD, 3),
        fil: { html: "<p>Toutes ces langues peuvent s'écrire avec un même alphabet, l'<strong>AGLC</strong>, qui note aussi les tons. La réponse à la classe est donc : plus de 250 langues nationales, réparties en grandes familles selon les régions, plus deux langues officielles ; une richesse à connaître et à respecter.</p>", verdicts: [[2, "validee", "Plus de 250 langues, grandes familles, régions, deux langues officielles."]] },
        retenir: "AGLC : un alphabet commun pour toutes nos langues." }
    ],
    denouement: {
      titre: "La réponse de la maîtresse",
      etapes: ["2 langues officielles, plus de 250 langues nationales (indice 1).", "Familles différentes : bantoue, Grassfields, adamawa, tchadique, atlantique (indice 2).", "Aires culturelles et AGLC (indices 3 et 4)."],
      reponse: "<p>Brice confond langues officielles et langues parlées : le français et l'anglais sont les deux langues officielles, mais le Cameroun compte plus de 250 langues nationales. Clarisse se trompe aussi : ces langues ne sont pas une seule langue avec des accents ; elles appartiennent à de grandes familles différentes, réparties selon les régions : langues bantoues au Sud et au Centre (ewondo, bulu, duala, basaa), langues des Grassfields à l'Ouest et au Nord-Ouest (ghomálá', medumba, lamnso'), langues adamawa-oubanguiennes dans l'Adamaoua et l'Est (mbum, gbaya), langues tchadiques dans l'Extrême-Nord (mafa, giziga) ; le fulfulde, de la famille atlantique, sert de langue de communication dans tout le Nord. Toutes peuvent s'écrire avec l'AGLC. Moussa parle fulfulde, sa voisine ewondo : deux langues, deux familles, un même pays.</p>",
      transfert: "<p>Interroge tes parents : quelle langue parlent-ils ? À quelle famille et à quelle aire culturelle appartient-elle ? Place-la sur la carte.</p>"
    },
    revision: (LC_OLD ? LC_OLD.revision : []).concat(["Langues officielles (français, anglais) ≠ langues nationales (plus de 250)."]),
    exo: LC_OLD ? LC_OLD.exo : "",
    quiz: [
      q("Combien de langues nationales environ ?", "Plus de 250", "Une vingtaine", "Exactement 2", "Une des plus grandes diversités d'Afrique."),
      q("Les deux langues officielles sont…", "le français et l'anglais", "l'ewondo et le fulfulde", "le duala et le basaa", "Langues de l'administration et de l'école."),
      q("L'ewondo est une langue…", "bantoue", "tchadique", "atlantique", "Comme le bulu et le duala."),
      q("Le ghomálá' appartient aux langues…", "des Grassfields", "tchadiques", "adamawa-oubanguiennes", "Ouest du Cameroun."),
      q("Les langues tchadiques sont surtout parlées…", "dans l'Extrême-Nord", "sur la côte", "dans le Centre", "Mafa, giziga…"),
      q("Le fulfulde est la langue de communication…", "du Nord", "de Douala", "du Sud-Ouest", "Famille atlantique, langue des Peuls."),
      q("Le mbum et le gbaya sont des langues…", "adamawa-oubanguiennes", "bantoues", "tchadiques", "Adamaoua et Est."),
      q("Que signifie AGLC ?", "Alphabet général des langues camerounaises", "Association générale des lycées camerounais", "Atlas géographique du Cameroun", "Adopté en 1979."),
      q("Les Duala et les Bakweri appartiennent à l'aire culturelle…", "sawa", "soudano-sahélienne", "des Grassfields", "Les peuples de la côte."),
      q("Ewondo et fulfulde sont…", "deux langues de familles différentes", "la même langue", "deux accents du français", "Bantoue et atlantique.")
    ]
  });

  /* ═══════════════════════ 6e INFORMATIQUE — L'INTELLIGENCE ARTIFICIELLE ═══════════════════════ */
  var IA_OLD = ancien("6e-info-ia");
  function telephone3D() {
    var o = [];
    o.push({ f: "boite", c: [0, -8, 0], d: [360, 10, 220], coul: "#6B4423", dessus: "#8B5A2B" });
    o.push({ f: "boite", c: [0, 6, 0], d: [90, 6, 180], coul: "#1F2328", dessus: "#2A2F36" });
    o.push({ f: "boite", c: [0, 9.2, 4], d: [80, 0.6, 150], coul: "#BFE3C8", dessus: "#DDEFE3", div: false });
    o.push({ f: "boite", c: [0, 9.6, 40], d: [60, 0.4, 60], coul: "#F2B33D", dessus: "#F2B33D", div: false });
    o.push({ f: "boite", c: [0, 9.6, -40], d: [60, 0.4, 16], coul: "#2E7D32", dessus: "#2E7D32", div: false });
    o.push({ f: "cylindre", c: [0, 9, 82], r: 4, h: 1.2, n: 12, coul: "#0B0D10" });
    o.push({ f: "sphere", c: [110, 18, 30], r: [30, 22, 20], coul: "#F2B33D" });
    o.push({ f: "sphere", c: [128, 14, 50], r: [8, 6, 6], coul: "#E07A2A" });
    o.push({ f: "sphere", c: [-120, 18, 40], r: [20, 24, 28], coul: "#3E6B2A" });
    o.push({ f: "sphere", c: [-115, 14, -40], r: [18, 22, 26], coul: "#4E7D2A" });
    return o;
  }
  remplacer("6e-info-ia", {
    c: "6e", m: "info", titre: "L'intelligence artificielle, c'est quoi ?", duree: 30,
    accroche: "Pour son exposé, Fadimatou demande à une IA la hauteur du mont Cameroun : « 6 095 mètres ». Son frère : « L'IA pense comme nous, elle ne se trompe jamais. » Vraiment ?",
    intro: "L'exposé d'une élève de 6e à Buea te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées sur l'intelligence artificielle.",
    objectifs: ["définir l'intelligence artificielle", "expliquer qu'une IA apprend à partir d'exemples", "comprendre pourquoi une IA peut se tromper", "vérifier une information donnée par une IA"],
    enquete: {
      titre: "L'exposé sur le mont Cameroun",
      svg: svg(640, 220, "Une élève tient un téléphone affichant une réponse d’IA, avec le mont Cameroun en arrière-plan", lin("iaC", ["#CFE3F2", "#F4F1EA"], true),
        "<rect width='640' height='220' fill='url(#iaC)'/><path d='M0 170L180 70L250 40L330 80L520 150L640 160V220H0Z' fill='#5E6B4A'/><path d='M222 54L250 40L280 56L262 60L248 52L236 60Z' fill='#E9E2D2'/><rect y='180' width='640' height='40' fill='#6E9B45'/>" +
        "<rect x='380' y='30' width='140' height='170' rx='16' fill='#1F2328'/><rect x='388' y='44' width='124' height='140' rx='6' fill='#F4F7FB'/>" + txt(450, 62, "Assistant IA", { s: 10, c: GRIS }) + "<rect x='396' y='70' width='108' height='26' rx='8' fill='#DCE6F2'/>" + txt(450, 87, "Hauteur du mont Cameroun ?", { s: 8, w: 600 }) + "<rect x='396' y='104' width='108' height='44' rx='8' fill='#E7F2E8'/>" + txt(450, 122, "Le mont Cameroun", { s: 9, w: 500 }) + txt(450, 138, "mesure 6 095 m.", { s: 11, c: ROUGE }) +
        perso(330, 100, "#5A3A1E", "#C62828", "#2E3445") + perso(580, 104, "#6B4423", "#1E499B", "#2E3445") + bulle(30, 100, 220, "L'IA ne se trompe jamais !", "#9FC5E8") + txt(250, 34, "mont Cameroun", { s: 10, c: "#2E3445", i: true })),
      legende: "À Buea, au pied du mont Cameroun : Fadimatou prépare un exposé avec un assistant d'intelligence artificielle.",
      contexte: "<p>L'assistant répond avec assurance : « Le mont Cameroun mesure 6 095 m. » Son grand frère affirme : « L'IA est un robot qui pense et comprend comme nous ; elle sait tout, elle ne se trompe jamais. Copie ! » Fadimatou a un doute : dans son manuel de géographie, elle a lu un autre chiffre.</p>",
      documents: [{ t: "Le manuel de géographie", html: "<p>« Le mont Cameroun, volcan actif situé près de Buea, culmine à <strong>4 095 m</strong> : c'est le point le plus haut d'Afrique de l'Ouest et centrale. »</p>" }],
      question: "Qu'est-ce qu'une IA, et peut-on lui faire confiance sans vérifier ?",
      tache: "Explique à son frère ce qu'est une IA, comment elle apprend et pourquoi Fadimatou doit vérifier.",
      hypotheses: ["L'IA est un être qui pense et comprend comme nous.", "L'IA ne se trompe jamais : on peut tout copier.", "L'IA est un programme qui apprend à partir d'exemples ; elle peut se tromper avec assurance : il faut vérifier (4 095 m)."]
    },
    parties: [
      { t: "Définition", html: partie(IA_OLD, 0),
        planches: [{ type: "2D", titre: "Ce qu'une IA fait, ce qu'elle ne fait pas", legende: "Une IA imite certaines capacités humaines (reconnaître, traduire, répondre) grâce à des calculs. Elle n'a ni conscience, ni sentiments, ni expérience du monde : elle ne « sait » pas ce qu'est une montagne.", svg: (function () {
          var s = "<rect width='640' height='240' fill='#FBF8F2'/><rect x='20' y='20' width='290' height='200' rx='14' fill='#fff' stroke='" + VERT + "' stroke-width='2.5'/><rect x='330' y='20' width='290' height='200' rx='14' fill='#fff' stroke='" + ROUGE + "' stroke-width='2.5'/>" + txt(165, 48, "✔ Elle sait faire (en calculant)", { s: 13, c: VERT }) + txt(475, 48, "✘ Elle n'a pas", { s: 13, c: ROUGE });
          ["reconnaître une voix, un visage", "traduire une phrase", "rédiger une réponse", "recommander une vidéo", "calculer très vite"].forEach(function (t, i) { s += txt(40, 84 + i * 28, "• " + t, { s: 12, a: "start", w: 500 }); });
          ["de conscience", "de sentiments", "d'expérience du monde", "de certitude : elle peut se tromper", "de responsabilité : c'est toi qui vérifies"].forEach(function (t, i) { s += txt(350, 84 + i * 28, "• " + t, { s: 12, a: "start", w: 500 }); });
          return svg(640, 240, "Deux colonnes : ce qu’une IA sait faire et ce qu’elle n’a pas", "", s);
        })() }],
        fil: { html: "<p>Une IA n'est ni vivante ni consciente : c'est un <strong>programme</strong> qui calcule. Elle produit des phrases qui « ressemblent » à des réponses, sans comprendre ce qu'est une montagne. Le frère de Fadimatou lui prête une pensée qu'elle n'a pas.</p>", verdicts: [[0, "rejetee", "Une IA est un programme qui calcule, sans conscience."]] },
        retenir: "L'IA imite l'intelligence, elle ne pense pas comme nous." },
      { t: "Comment une IA apprend", html: partie(IA_OLD, 1), illus: ill(IA_OLD, 1),
        fil: { html: "<p>Une IA apprend à partir d'<strong>exemples</strong> (simulation ci-dessus). Avec peu d'exemples, ou des exemples mal choisis, elle se trompe : elle peut confondre une mangue verte avec un avocat (essaie-le dans la partie suivante). Pour un texte, elle peut mélanger des chiffres lus ailleurs et inventer « 6 095 m ». Elle ne se trompe pas toujours, mais elle <strong>peut</strong> se tromper, même avec assurance.</p>", verdicts: [[1, "rejetee", "Une IA dépend de ses exemples : elle peut se tromper."]] },
        retenir: "Pas d'exemples, pas d'apprentissage : l'IA dépend de ses données." },
      { t: "L'IA autour de toi", html: partie(IA_OLD, 2),
        planches: [{ type: "3d", titre: "Le téléphone qui reconnaît un fruit", legende: "Tourne la scène : la caméra du téléphone photographie un fruit, et l'IA de l'application compare l'image aux milliers d'exemples qu'elle a vus. L'écran affiche une proposition (« mangue, 92 % »), jamais une certitude : une mangue encore verte peut être prise pour un avocat.",
          modele: { h: 340, rx: -40, ry: 18, echelle: 0.9, alt: "Table en bois avec un téléphone, une mangue et deux avocats", objets: telephone3D(),
            etiquettes: [{ p: [0, 10, 40], t: "écran : « mangue 92 % »", cote: "d" }, { p: [0, 10, 82], t: "caméra (capteur)", cote: "d" }, { p: [110, 40, 30], t: "mangue", cote: "d" }, { p: [-120, 42, 40], t: "avocats", cote: "g" }] } }],
        fil: { html: "<p>La simulation ci-dessus le montre : entraînée seulement sur des mangues bien jaunes, l'IA prend les mangues vertes pour des avocats. Traduction, reconnaissance de visage, assistant vocal : l'IA est partout, et utile. Mais Fadimatou fait ce qu'il faut : elle <strong>vérifie</strong> dans son manuel, une source fiable. Le mont Cameroun mesure 4 095 m, pas 6 095 m.</p>", verdicts: [[2, "validee", "Programme, apprentissage par exemples, erreurs possibles : vérifier."]] },
        retenir: "L'IA est un outil : utile, rapide, mais faillible." }
    ],
    denouement: {
      titre: "L'exposé corrigé",
      etapes: ["Une IA est un programme, pas un être pensant (indice 1).", "Elle apprend d'exemples et peut se tromper (indice 2).", "On vérifie dans une source fiable (indice 3)."],
      reponse: "<p>L'intelligence artificielle est un ensemble de techniques qui permettent à un programme d'imiter certaines capacités humaines : reconnaître une image, comprendre une question, rédiger une réponse. Elle ne pense pas comme nous : elle n'a ni conscience ni expérience du monde ; elle calcule à partir des milliers d'exemples qu'on lui a montrés. Si ces exemples sont insuffisants ou mal choisis, ou si elle mélange des informations, elle peut se tromper, et même avec assurance. Fadimatou a donc eu raison de vérifier dans son manuel : le mont Cameroun culmine à 4 095 m, et non 6 095 m. L'IA reste un outil précieux, à condition de garder son esprit critique.</p>",
      transfert: "<p>Pose à un assistant IA une question dont tu connais la réponse (la capitale d'une région, une date d'histoire) et compare sa réponse à ton manuel.</p>"
    },
    revision: (IA_OLD ? IA_OLD.revision : []).concat(["Toujours vérifier une réponse d'IA dans une source fiable."]),
    exo: IA_OLD ? IA_OLD.exo : "",
    quiz: [
      q("Une IA est…", "un programme informatique", "un être vivant", "un robot toujours humanoïde", "Ce sont des calculs, pas une conscience."),
      q("Pour apprendre, une IA a surtout besoin…", "d'exemples", "de sommeil", "de musique", "Elle repère des régularités dans les données."),
      q("Une réponse donnée par une IA est…", "à vérifier", "toujours juste", "interdite à l'école", "Une IA peut se tromper : on vérifie."),
      q("Le mont Cameroun culmine à…", "4 095 m", "6 095 m", "2 095 m", "Point culminant d'Afrique de l'Ouest et centrale."),
      q("Une IA a-t-elle des sentiments ?", "Non", "Oui, comme nous", "Seulement la nuit", "Elle n'a ni conscience ni sentiments."),
      q("Avec des exemples mal choisis, une IA…", "se trompe plus souvent", "devient parfaite", "refuse de répondre", "Elle dépend de ses données."),
      q("Lequel utilise l'IA ?", "la traduction automatique", "une règle graduée", "un crayon", "Elle « comprend » une phrase pour la traduire."),
      q("Déverrouiller un téléphone avec son visage, c'est…", "de la reconnaissance faciale par IA", "de la magie", "un code PIN", "La caméra compare ton visage à des exemples."),
      q("Une source fiable pour vérifier est…", "ton manuel ou ton enseignant", "une rumeur", "un message anonyme", "On croise les sources."),
      q("Prof. Ambassa sur VÉRITAS est…", "un assistant pédagogique à IA", "un vrai professeur caché", "un jeu vidéo", "Utile, mais à vérifier comme toute IA.")
    ]
  });

  /* ═══════════════════════ 6e INFORMATIQUE — LES COMPOSANTS DE BASE ═══════════════════════ */
  var CO_OLD = ancien("6e-info-composants");
  function pc3D() {
    var o = [];
    o.push({ f: "boite", c: [0, -6, 0], d: [300, 6, 260], coul: "#8E96A6", dessus: "#B8BFCC" });
    o.push({ f: "boite", c: [44, 90, 0], d: [4, 180, 200], coul: "#2B2F36", div: false });
    o.push({ f: "boite", c: [0, 179, 0], d: [92, 4, 200], coul: "#2B2F36", div: false });
    o.push({ f: "boite", c: [0, 0, 0], d: [92, 4, 200], coul: "#2B2F36", div: false });
    o.push({ f: "boite", c: [0, 90, 100], d: [92, 180, 4], coul: "#2B2F36", div: false });
    o.push({ f: "boite", c: [0, 90, -102], d: [92, 180, 4], coul: "#1F2328", dessus: "#3A3F47", div: false });
    o.push({ f: "cylindre", c: [0, 150, -105], r: 5, h: 2, n: 12, axe: "z", coul: "#4FC3F7" });
    o.push({ f: "boite", c: [-48, 90, 0], d: [4, 180, 200], coul: "#3A3F47", dessus: "#4A505A", div: false, ec: [-90, 0, 0] });
    o.push({ f: "boite", c: [38, 100, 10], d: [4, 140, 160], coul: "#1E6B3A", div: false, ec: [40, 0, 0] });
    o.push({ f: "boite", c: [32, 120, 0], d: [8, 26, 26], coul: "#B8BFCC", dessus: "#D8DDE5", ec: [-30, 20, 0] });
    o.push({ f: "cylindre", c: [28, 120, 0], r: 16, h: 10, n: 16, axe: "x", coul: "#4D5163", ec: [-60, 20, 0] });
    [0, 1].forEach(function (k) { o.push({ f: "boite", c: [32, 120, 30 + k * 10], d: [8, 50, 4], coul: "#1E499B", dessus: "#2F6DB5", ec: [-40, 60, 0] }); });
    o.push({ f: "boite", c: [0, 156, 70], d: [80, 40, 50], coul: "#5C6478", dessus: "#6F7788", ec: [0, 80, 40] });
    o.push({ f: "boite", c: [0, 30, -60], d: [60, 14, 44], coul: "#9AA3AF", dessus: "#C9CED6", ec: [-20, -10, -90] });
    return o;
  }
  remplacer("6e-info-composants", {
    c: "6e", m: "info", titre: "Les composants de base d'un micro-ordinateur", duree: 30,
    accroche: "Coupure de courant dans la salle informatique de Bertoua : Junior arrache la prise et déclare « l'écran, c'est l'ordinateur ». Sa voisine : « la souris, c'est une sortie ». Qui a raison ?",
    intro: "Une séance mouvementée en salle informatique te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois affirmations.",
    objectifs: ["nommer les composants de l'unité centrale et leur rôle", "distinguer périphériques d'entrée et de sortie", "expliquer le trajet de l'information", "adopter les bons gestes pour protéger le matériel"],
    enquete: {
      titre: "La séance coupée de la salle informatique",
      svg: svg(640, 220, "Salle informatique : un élève tient une prise arrachée près d’un écran noir, une élève montre une souris", lin("coC", ["#E6EEF7", "#F4F1EA"], true),
        "<rect width='640' height='220' fill='url(#coC)'/><rect x='80' y='132' width='480' height='14' rx='3' fill='#8B5A2B'/><rect x='94' y='146' width='10' height='60' fill='#6B4423'/><rect x='536' y='146' width='10' height='60' fill='#6B4423'/>" +
        "<rect x='240' y='40' width='150' height='92' rx='6' fill='#1F2328'/><rect x='248' y='48' width='134' height='72' fill='#0B0D10'/><rect x='300' y='122' width='30' height='10' fill='#2B2F36'/><rect x='410' y='60' width='46' height='72' rx='4' fill='#2B2F36'/><circle cx='433' cy='74' r='4' fill='#4FC3F7' opacity='.3'/><rect x='240' y='136' width='120' height='10' rx='2' fill='#C9CED6'/><ellipse cx='388' cy='140' rx='9' ry='6' fill='#C9CED6'/>" +
        perso(150, 76, "#5A3A1E", "#F7C948", "#2E3445") + "<path d='M170 118l30 20' stroke='#1F2328' stroke-width='3'/><rect x='196' y='134' width='12' height='8' fill='#F4F1EA' stroke='#1F2328'/>" + perso(500, 76, "#6B4423", "#7B3F99", "#2E3445") + bulle(40, 20, 190, "L'écran, c'est l'ordinateur !", "#F7C948") + bulle(420, 20, 210, "La souris, c'est une sortie !", "#9FC5E8")),
      legende: "Au lycée de Bertoua, en salle informatique : le courant saute pendant que la classe de 6e travaille.",
      contexte: "<p>Pendant la coupure, Junior arrache la prise de son poste : « Pas grave, l'écran, c'est l'ordinateur : c'est lui qui calcule et garde nos fichiers. » Sa voisine Awa ajoute : « La souris est un périphérique de sortie, puisqu'elle sort de l'unité centrale par un fil. » Au retour du courant, le poste de Junior met longtemps à redémarrer et son fichier non enregistré est perdu.</p>",
      documents: [{ t: "L'affiche de la salle", html: "<p>« Enregistrez souvent. Éteignez par le menu Démarrer. Ne débranchez jamais un poste allumé. Chaque poste est protégé par un onduleur. »</p>" }],
      question: "Où se trouve vraiment l'« ordinateur », et comment classer la souris ?",
      tache: "Explique le rôle de l'unité centrale et des périphériques, classe la souris, puis dis ce que Junior aurait dû faire.",
      hypotheses: ["L'écran est l'ordinateur : c'est lui qui calcule et garde les fichiers.", "La souris est un périphérique de sortie, puisqu'elle sort de l'unité centrale par un fil.", "L'unité centrale calcule et stocke ; la souris envoie des informations : c'est une entrée ; on enregistre et on éteint par le menu."]
    },
    parties: [
      { t: "L'unité centrale, le cerveau", html: partie(CO_OLD, 0),
        planches: [{ type: "3d", titre: "L'unité centrale ouverte", legende: "Tourne le boîtier, puis écarte les pièces avec le curseur : la carte mère (verte), le processeur sous son ventilateur, les barrettes de mémoire vive (bleues), l'alimentation (en haut) et le disque de stockage (en bas). C'est ici, et non dans l'écran, que l'information est traitée et conservée.",
          modele: { h: 380, rx: -18, ry: -36, echelle: 0.95, eclate: "Ouvrir et écarter les pièces", alt: "Boîtier d’unité centrale ouvert : carte mère, processeur et ventilateur, barrettes de mémoire, alimentation, disque", objets: pc3D(),
            etiquettes: [{ p: [28, 120, 0], t: "processeur + ventilateur", cote: "g", ec: [-60, 20, 0] }, { p: [32, 145, 35], t: "mémoire vive (RAM)", cote: "d", ec: [-40, 60, 0] }, { p: [0, 160, 70], t: "alimentation", cote: "d", ec: [0, 80, 40] }, { p: [0, 30, -60], t: "disque (stockage)", cote: "g", ec: [-20, -10, -90] }, { p: [38, 60, 60], t: "carte mère", cote: "d", ec: [40, 0, 0] }] } }],
        fil: { html: "<p>L'écran n'est qu'un <strong>périphérique de sortie</strong> : il affiche. Le calcul se fait dans le <strong>processeur</strong>, le travail en cours est gardé dans la <strong>mémoire vive</strong> (qui s'efface quand le courant coupe : d'où le fichier perdu), et les fichiers enregistrés sont sur le <strong>disque</strong>. Tout cela est dans l'unité centrale.</p>", verdicts: [[0, "rejetee", "L'écran affiche ; l'unité centrale calcule et stocke."]] },
        retenir: "L'unité centrale traite l'information." },
      { t: "Entrée, sortie", html: partie(CO_OLD, 1), illus: ill(CO_OLD, 1),
        fil: { html: "<p>Le sens qui compte n'est pas celui du fil, mais celui de l'<strong>information</strong>. Quand Awa bouge la souris ou clique, elle <strong>envoie</strong> une information à l'ordinateur : la souris est un périphérique d'<strong>entrée</strong>, comme le clavier. L'écran et l'imprimante <strong>reçoivent</strong> l'information : ce sont des sorties.</p>", verdicts: [[1, "rejetee", "La souris envoie des informations : c'est une entrée."]] },
        retenir: "Entrée : vers l'ordinateur. Sortie : depuis l'ordinateur." },
      { t: "Prendre soin du matériel", html: partie(CO_OLD, 2),
        fil: { html: "<p>Arracher la prise d'un poste allumé peut abîmer le disque et fait perdre ce qui n'est pas enregistré. Junior aurait dû enregistrer souvent ; pendant une coupure, l'<strong>onduleur</strong> donne quelques minutes pour enregistrer et éteindre par le menu.</p>", verdicts: [[2, "validee", "Unité centrale, entrée / sortie, bons gestes."]] },
        retenir: "Un matériel bien traité dure plus longtemps." }
    ],
    denouement: {
      titre: "Le bilan de la séance",
      etapes: ["L'écran affiche ; l'unité centrale calcule et stocke (indice 1).", "La souris envoie l'information : entrée (indice 2).", "Enregistrer, éteindre par le menu, onduleur (indice 3)."],
      reponse: "<p>Junior se trompe : l'écran n'est qu'un périphérique de sortie qui affiche. L'ordinateur proprement dit, c'est l'unité centrale : le processeur y calcule, la mémoire vive y garde le travail en cours (elle s'efface quand le courant coupe, c'est pourquoi son fichier non enregistré a été perdu) et le disque y conserve les fichiers enregistrés. Awa se trompe aussi : on classe un périphérique selon le trajet de l'information, pas selon le fil. La souris envoie des informations à l'ordinateur : c'est un périphérique d'entrée, comme le clavier, le micro ou le scanner ; l'écran, l'imprimante et les haut-parleurs sont des sorties. Enfin, il faut enregistrer souvent, éteindre par le menu et ne jamais arracher la prise ; l'onduleur laisse le temps de le faire pendant une coupure.</p>",
      transfert: "<p>Classe : webcam, clé USB, écran tactile, imprimante, micro. <em>(Entrée : webcam, micro ; sortie : imprimante ; entrée et sortie : écran tactile ; stockage : clé USB.)</em></p>"
    },
    revision: (CO_OLD ? CO_OLD.revision : []).concat(["La mémoire vive s'efface quand le courant coupe : enregistre souvent."]),
    exo: CO_OLD ? CO_OLD.exo : "",
    quiz: [
      q("La souris est un périphérique…", "d'entrée", "de sortie", "de stockage", "Elle envoie des informations à l'ordinateur."),
      q("Quel élément calcule dans l'unité centrale ?", "Le processeur", "L'écran", "Le câble", "Il exécute les instructions."),
      q("L'imprimante est un périphérique…", "de sortie", "d'entrée", "central", "Elle reçoit les informations."),
      q("La mémoire vive (RAM)…", "s'efface quand le courant coupe", "garde les fichiers pour toujours", "est un périphérique", "Il faut enregistrer sur le disque."),
      q("Les fichiers enregistrés sont gardés…", "sur le disque de stockage", "dans l'écran", "dans la souris", "Le disque conserve même éteint."),
      q("Le clavier est un périphérique…", "d'entrée", "de sortie", "de stockage", "On tape : l'information va vers l'ordinateur."),
      q("Les haut-parleurs sont des périphériques…", "de sortie", "d'entrée", "de calcul", "Ils diffusent le son venu de l'ordinateur."),
      q("Pour éteindre un ordinateur, on…", "passe par le menu", "arrache la prise", "débranche l'écran", "Pour ne pas abîmer le disque."),
      q("Un onduleur sert à…", "alimenter le poste quelques minutes pendant une coupure", "imprimer", "refroidir le processeur", "Le temps d'enregistrer et d'éteindre."),
      q("On classe un périphérique selon…", "le trajet de l'information", "la couleur du fil", "sa taille", "Vers l'ordinateur : entrée ; depuis : sortie.")
    ]
  });

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  VRT_A("4e-ln-tons", 2, "Écoute les cinq tons, puis reconnais-les à l'oreille", function (el) {
    var ctx = null, cible = -1, ok = 0, n = 0;
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:6px'>" + TONS.map(function (t, i) { return "<button type='button' class='btn-l' data-t='" + i + "'>🔊 b" + t[1].slice(-1) + " · " + t[0] + "</button>"; }).join("") + "</div><div data-g style='margin:8px 0'></div><div style='display:flex;flex-wrap:wrap;gap:6px;align-items:center'><button type='button' class='btn-l' data-j>🎲 Devine un ton</button><span data-c style='display:flex;gap:6px;flex-wrap:wrap'></span></div><p class='labo-r' data-r>Clique sur un ton pour l'entendre et voir sa courbe.</p>";
    function jouer(i) {
      var f = TONS[i][2], AC = window.AudioContext || window.webkitAudioContext;
      try {
        if (AC) { ctx = ctx || new AC(); var o = ctx.createOscillator(), g = ctx.createGain(), t0 = ctx.currentTime; o.type = "triangle"; o.frequency.setValueAtTime(f[0], t0); o.frequency.linearRampToValueAtTime(f[1], t0 + 0.5); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6); o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + 0.62); }
      } catch (e) { }
    }
    function courbe(i, cache) {
      var s = "<rect width='470' height='120' fill='#FBF8F2'/>" + [[30, "haut"], [60, "moyen"], [90, "bas"]].map(function (l) { return "<path d='M60 " + l[0] + "H450' stroke='#E3E7EF'/>" + txt(54, l[0] + 4, l[1], { s: 10, a: "end", c: GRIS, w: 600 }); }).join("");
      if (i >= 0 && !cache) { var Y = function (f) { return 90 - (f - 150) / 110 * 60; }, f = TONS[i][2]; s += "<path d='M120 " + Y(f[0]).toFixed(1) + "L390 " + Y(f[1]).toFixed(1) + "' stroke='" + (f[0] === f[1] ? "#A84200" : "#0E7C86") + "' stroke-width='7' stroke-linecap='round'/>" + txt(255, 114, "b" + TONS[i][1].slice(-1) + " — ton " + TONS[i][0], { s: 12 }); }
      else if (cache) s += txt(255, 66, "? Écoute bien…", { s: 16, c: GRIS });
      el.querySelector("[data-g]").innerHTML = "<svg viewBox='0 0 470 120' style='max-width:520px;width:100%' role='img' aria-label='Courbe mélodique du ton'>" + s + "</svg>";
    }
    el.querySelectorAll("[data-t]").forEach(function (b) { b.addEventListener("click", function () { var i = +b.dataset.t; jouer(i); courbe(i); el.querySelector("[data-r]").innerHTML = "Ton <b>" + TONS[i][0] + "</b>, noté <b>" + TONS[i][1] + "</b>."; }); });
    el.querySelector("[data-j]").addEventListener("click", function () {
      cible = Math.floor(Math.random() * TONS.length); jouer(cible); courbe(-1, true);
      el.querySelector("[data-c]").innerHTML = TONS.map(function (t, i) { return "<button type='button' class='btn-l' data-v='" + i + "'>" + t[1] + "</button>"; }).join("") + "<button type='button' class='btn-l' data-re>🔁 Réécouter</button>";
      el.querySelector("[data-re]").addEventListener("click", function () { jouer(cible); });
      el.querySelectorAll("[data-v]").forEach(function (b) { b.addEventListener("click", function () { var v = +b.dataset.v; n++; if (v === cible) ok++; courbe(cible); el.querySelector("[data-r]").innerHTML = (v === cible ? "✔ Bravo : " : "✘ Non : c'était ") + "le ton <b>" + TONS[cible][0] + "</b> (" + TONS[cible][1] + "). Score : <b>" + ok + " / " + n + "</b>"; el.querySelector("[data-c]").innerHTML = ""; }); });
      el.querySelector("[data-r]").textContent = "Quel ton as-tu entendu ?";
    });
    courbe(-1);
  });
  VRT_A("6e-ln-carte", 1, "À quelle famille appartient cette langue ?", function (el) {
    exercice(el, [["L'ewondo (Centre) est une langue… ___", ["bantoue", "tchadique", "des Grassfields"], "Comme le bulu, le duala, le basaa."], ["Le ghomálá' (Ouest) est une langue… ___", ["des Grassfields", "bantoue", "tchadique"], "Comme le medumba, le fe'efe'e."], ["Le mafa (Extrême-Nord) est une langue… ___", ["tchadique", "bantoue", "adamawa-oubanguienne"], "Comme le giziga."], ["Le mbum (Adamaoua) est une langue… ___", ["adamawa-oubanguienne", "tchadique", "des Grassfields"], "Comme le gbaya."], ["Le duala (Littoral) est une langue… ___", ["bantoue", "des Grassfields", "adamawa-oubanguienne"], "Famille bantoue, aire sawa."], ["Le fulfulde (Nord) est une langue… ___", ["atlantique", "bantoue", "tchadique"], "Langue des Peuls, véhiculaire au Nord."], ["Le lamnso' (Nord-Ouest) est une langue… ___", ["des Grassfields", "tchadique", "bantoue"], "Parlée par les Nso."], ["Le bulu (Sud) est une langue… ___", ["bantoue", "adamawa-oubanguienne", "des Grassfields"], "Proche de l'ewondo."]], "Langue suivante", "Langue");
  });
  VRT_A("6e-info-ia", 2, "Quand les exemples sont mal choisis : l’IA se trompe", function (el) {
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:8px 18px;align-items:end'><label class='labo-c'><span>Exemples d'entraînement : <b data-nv>20</b></span><input type='range' min='2' max='60' step='2' value='20' data-n></label><label class='labo-c' style='flex-direction:row;align-items:center;gap:6px'><input type='checkbox' data-b> <span>exemples mal choisis (seulement des mangues bien jaunes)</span></label></div><div data-g style='margin:8px 0'></div><p class='labo-r' data-r></p>";
    var N = el.querySelector("[data-n]"), B = el.querySelector("[data-b]");
    function fruits(nb, graine, biais) { var R = alea(graine), L = [], k; for (k = 0; k < nb; k++) { var m = k % 2 === 0, x, y; do { x = m ? 0.62 + (R() - 0.5) * 0.6 : 0.3 + (R() - 0.5) * 0.4; } while (m && biais && x < 0.8); y = m ? 0.4 + (R() - 0.5) * 0.36 : 0.62 + (R() - 0.5) * 0.36; L.push([Math.min(0.97, Math.max(0.03, x)), Math.min(0.97, Math.max(0.03, y)), m]); } return L; }
    var TEST = fruits(80, 999, false);
    function maj() {
      var n = +N.value, biais = B.checked, T = fruits(n, 7, biais), cm = [0, 0, 0], ca = [0, 0, 0];
      T.forEach(function (f) { var c = f[2] ? cm : ca; c[0] += f[0]; c[1] += f[1]; c[2]++; });
      cm = [cm[0] / cm[2], cm[1] / cm[2]]; ca = [ca[0] / ca[2], ca[1] / ca[2]];
      function predit(f) { return Math.hypot(f[0] - cm[0], f[1] - cm[1]) < Math.hypot(f[0] - ca[0], f[1] - ca[1]); }
      var bons = TEST.filter(function (f) { return predit(f) === f[2]; }).length, X = function (v) { return 40 + v * 400; }, Y = function (v) { return 20 + v * 160; }, s = "<rect width='470' height='210' fill='#FBF8F2'/>", gx, gy;
      for (gx = 0; gx < 40; gx++) for (gy = 0; gy < 16; gy++) { var p = [(gx + 0.5) / 40, (gy + 0.5) / 16]; s += "<rect x='" + X(gx / 40) + "' y='" + Y(gy / 16) + "' width='10.2' height='10.2' fill='" + (predit(p) ? "#FCE9B8" : "#DCEBD5") + "'/>"; }
      TEST.forEach(function (f) { var ok = predit(f) === f[2]; s += "<ellipse cx='" + X(f[0]).toFixed(1) + "' cy='" + Y(f[1]).toFixed(1) + "' rx='" + (f[2] ? 7 : 5) + "' ry='" + (f[2] ? 5 : 7) + "' fill='" + (f[2] ? "#F2B33D" : "#3E6B2A") + "' opacity='.35'" + (ok ? "" : " stroke='" + ROUGE + "' stroke-width='2.5' stroke-opacity='1'") + "/>"; });
      T.forEach(function (f) { s += "<ellipse cx='" + X(f[0]).toFixed(1) + "' cy='" + Y(f[1]).toFixed(1) + "' rx='" + (f[2] ? 8 : 6) + "' ry='" + (f[2] ? 6 : 8) + "' fill='" + (f[2] ? "#F2B33D" : "#3E6B2A") + "' stroke='#1F2328'/>"; });
      s += "<path d='M40 192H440' stroke='" + NUIT + "'/>" + txt(40, 205, "vert", { s: 10, a: "start", c: GRIS }) + txt(440, 205, "jaune", { s: 10, a: "end", c: GRIS }) + txt(240, 205, "couleur de la peau →", { s: 10, c: GRIS, w: 600 }) + txt(452, 30, "rond", { s: 10, a: "start", c: GRIS }) + txt(452, 176, "allongé", { s: 10, a: "start", c: GRIS });
      el.querySelector("[data-nv]").textContent = n;
      el.querySelector("[data-g]").innerHTML = "<svg viewBox='0 0 490 210' style='max-width:540px;width:100%' role='img' aria-label='Nuage de fruits classés par l’IA selon la couleur et la forme'>" + s + "</svg>";
      el.querySelector("[data-r]").innerHTML = "Fruits foncés = exemples d'entraînement ; fruits pâles = 80 fruits nouveaux à reconnaître ; fond jaune = l'IA dit « mangue », fond vert = « avocat ». Réussite : <b style='color:" + (bons >= 72 ? VERT : ROUGE) + "'>" + bons + " / 80</b>" + (80 - bons ? " · erreurs entourées de rouge" : "") + (biais ? " · les mangues vertes sont prises pour des avocats !" : "");
    }
    N.addEventListener("input", maj); B.addEventListener("change", maj); maj();
  });
  VRT_A("6e-info-composants", 2, "Révise : entrée, sortie ou stockage ?", function (el) {
    exercice(el, [["Le clavier est un périphérique… ___", ["d'entrée", "de sortie", "de stockage"], "On tape : l'information va vers l'ordinateur."], ["L'écran est un périphérique… ___", ["de sortie", "d'entrée", "de stockage"], "Il affiche ce que l'ordinateur envoie."], ["La souris est un périphérique… ___", ["d'entrée", "de sortie", "de stockage"], "Elle envoie mouvements et clics."], ["L'imprimante est un périphérique… ___", ["de sortie", "d'entrée", "de stockage"], "Elle reçoit le document à imprimer."], ["Le micro est un périphérique… ___", ["d'entrée", "de sortie", "de stockage"], "Il capte ta voix."], ["Les haut-parleurs sont des périphériques… ___", ["de sortie", "d'entrée", "de stockage"], "Ils diffusent le son."], ["Le scanner est un périphérique… ___", ["d'entrée", "de sortie", "de stockage"], "Il numérise un document vers l'ordinateur."], ["La clé USB sert surtout… ___", ["de stockage", "d'entrée", "de sortie"], "Elle conserve des fichiers."]], "Périphérique suivant", "Périphérique");
  });
})();
