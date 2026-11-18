/* Leçons APPROFONDIES — lot 17, 6e (18/11/2026) : origine du latin, jours et mois en latin, branches des arts, piste
   d'athlétisme. Même gabarit et même mécanisme que 11-approfondies-lot4.js (remplacement EN PLACE ; schémas d'origine (illus)
   repris ; quiz portés à 10 questions). Simulations VRT_A en fin (la partie 1 de 6e-eps-piste garde son animation de 91-animations-2.js). */
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

  /* ═══════════════════════ 6e LATIN — ORIGINE ET IMPORTANCE ═══════════════════════ */
  var LO_OLD = ancien("6e-la-origine");
  function aqueduc3D() {
    var o = [], k;
    o.push({ f: "boite", c: [0, -6, 0], d: [520, 8, 200], coul: "#7A6A4A", dessus: "#9DB36A" });
    o.push({ f: "boite", c: [0, -2, 0], d: [520, 3, 40], coul: "#2F6EA5", dessus: "#4A90C2", div: false });
    for (k = 0; k < 7; k++) o.push({ f: "boite", c: [-210 + k * 70, 40, 0], d: [22, 84, 30], coul: "#C9B28A", dessus: "#D9C49C" });
    o.push({ f: "boite", c: [0, 90, 0], d: [470, 16, 32], coul: "#BFA67A", dessus: "#D9C49C" });
    for (k = 0; k < 13; k++) o.push({ f: "boite", c: [-216 + k * 36, 120, 0], d: [14, 44, 26], coul: "#C9B28A", dessus: "#D9C49C" });
    o.push({ f: "boite", c: [0, 148, 0], d: [470, 12, 28], coul: "#BFA67A", dessus: "#D9C49C" });
    o.push({ f: "boite", c: [0, 158, 0], d: [470, 8, 22], coul: "#A89270", dessus: "#A89270", div: false });
    o.push({ f: "boite", c: [0, 162.5, 0], d: [460, 1, 12], coul: "#5BA3D9", dessus: "#7FB9E2", div: false });
    return o;
  }
  var RACINES = [["aquarium", "aqua", "l'eau"], ["territoire", "terra", "la terre"], ["manuel", "manus", "la main"], ["solaire", "sol", "le soleil"], ["maternel", "mater", "la mère"], ["nocturne", "nox, noctis", "la nuit"], ["vitamine", "vita", "la vie"], ["pédestre", "pes, pedis", "le pied"]];
  remplacer("6e-la-origine", {
    c: "6e", m: "latin", titre: "Origine et importance du latin", duree: 30,
    accroche: "« Le latin est une langue morte : il n'en reste rien. Et le français vient de l'anglais ! » Le grand frère de Léa a-t-il raison ?",
    intro: "Une discussion de famille autour d'une liste de fournitures te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois affirmations.",
    objectifs: ["situer l'origine du latin (Latium, Rome)", "expliquer comment le latin a donné les langues romanes", "repérer des racines latines dans le français", "dire pourquoi le latin est encore utile"],
    enquete: {
      titre: "La liste de fournitures de Léa",
      svg: svg(640, 220, "Une élève lit une liste de fournitures ; son grand frère affirme que le latin est mort", lin("loC", ["#F4EDE1", "#E9DFCF"], true),
        "<rect width='640' height='220' fill='url(#loC)'/><rect y='186' width='640' height='34' fill='#B88A5A'/><g transform='rotate(-3 300 100)'><rect x='220' y='20' width='170' height='160' fill='#FFFBEA' stroke='#E3D7A6'/>" + txt(305, 44, "Fournitures 6e", { s: 13, c: BLEU }) + ["1 agenda", "1 cahier de bonus", "1 aquarelle", "crayons, gomme,", "et cetera…"].map(function (t, i) { return txt(236, 72 + i * 22, t, { s: 12, a: "start", c: i === 0 || i === 4 ? ROUGE : NUIT, i: true }); }).join("") + "</g>" +
        perso(130, 96, "#5A3A1E", "#C62828", "#2E3445") + perso(520, 90, "#6B4423", "#1E499B", "#2E3445") + bulle(420, 26, 210, "Le latin ? Langue morte !", "#9FC5E8") + bulle(20, 40, 200, "« Agenda », c'est latin ?", "#F7C948")),
      legende: "À Kribi, Léa prépare sa rentrée en 6e ; son lycée propose l'initiation au latin.",
      contexte: "<p>Sur la liste, Léa lit « agenda » et « et cetera » ; le professeur de français a dit que ces mots étaient latins. Son grand frère, en 3e, se moque : « Le latin est une langue morte : il n'en reste rien aujourd'hui. D'ailleurs, le français vient de l'anglais. » Leur mère, infirmière, ajoute que les médicaments et les maladies portent souvent des noms latins.</p>",
      documents: [{ t: "Un même mot dans cinq langues", html: "<table class='donnees'><tr><th>Latin</th><th>Français</th><th>Italien</th><th>Espagnol</th><th>Portugais</th><th>Roumain</th><th>Anglais</th></tr><tr><td>noctem</td><td>nuit</td><td>notte</td><td>noche</td><td>noite</td><td>noapte</td><td>night</td></tr></table>" }],
      question: "D'où vient le français, et le latin a-t-il vraiment disparu ?",
      tache: "Explique à son frère l'origine du français et donne trois preuves que le latin est encore présent.",
      hypotheses: ["Le français vient de l'anglais.", "Le latin est mort : il n'en reste rien dans notre vie.", "Le latin, langue de Rome répandue par l'Empire, a donné les langues romanes dont le français ; il vit dans notre vocabulaire, les sciences et le droit."]
    },
    parties: [
      { t: "La langue de Rome", html: partie(LO_OLD, 0), illus: ill(LO_OLD, 0),
        planches: [{ type: "3d", titre: "Un aqueduc romain", legende: "Tourne l'aqueduc : deux étages d'arcades en pierre portent un canal (en bleu) qui conduit l'eau d'une source jusqu'à la ville, avec une pente très faible. Partout où ils allaient, les Romains bâtissaient routes, ponts et aqueducs, et apportaient leur langue. Le mot vient d'ailleurs du latin : aqua (l'eau) + ducere (conduire).",
          modele: { h: 340, rx: -14, ry: 28, echelle: 0.85, alt: "Aqueduc romain à deux étages d’arcades en pierre au-dessus d’une rivière, avec un canal d’eau au sommet", objets: aqueduc3D(),
            etiquettes: [{ p: [0, 163, 0], t: "canal : l'eau (aqua) conduite (ducere)", cote: "d" }, { p: [-210, 40, -15], t: "arcades de pierre", cote: "g" }, { p: [-200, -1, 0], t: "rivière", cote: "g" }] } }],
        fil: { html: "<p>Le latin était la langue du Latium, autour de Rome. Avec la conquête, les Romains l'ont répandu autour de la Méditerranée, jusqu'en Gaule, la future France : les Gaulois ont peu à peu parlé latin.</p>", verdicts: [] },
        retenir: "Latin = langue de Rome, répandue par la conquête romaine." },
      { t: "Une langue mère", html: partie(LO_OLD, 1),
        planches: [{ type: "2D", titre: "L'arbre des langues romanes", legende: "Le latin parlé s'est transformé différemment selon les régions : il a donné les langues romanes. L'anglais appartient à une autre branche, germanique ; il a seulement emprunté beaucoup de mots au latin et au français.", svg: (function () {
          var s = "<rect width='640' height='270' fill='#FBF8F2'/><path d='M320 250V150' stroke='#6B4423' stroke-width='16' stroke-linecap='round'/>" + bloc(250, 200, 140, 46, "#7A1F1F", "latin", "noctem") + "<circle cx='320' cy='110' r='92' fill='#5E9E4E' opacity='.25'/>";
          [["français", "nuit", 120, 60], ["italien", "notte", 240, 30], ["espagnol", "noche", 400, 30], ["portugais", "noite", 520, 60], ["roumain", "noapte", 320, 104]].forEach(function (b) { s += "<path d='M320 196Q320 150 " + b[2] + " " + (b[3] + 40) + "' stroke='#6B4423' stroke-width='5' fill='none'/>" + bloc(b[2] - 60, b[3], 120, 44, VERT, b[0], b[1]); });
          s += "<rect x='500' y='180' width='130' height='70' rx='10' fill='#fff' stroke='#9AA3AF' stroke-dasharray='5 3'/>" + txt(565, 204, "anglais : night", { s: 12, c: GRIS }) + txt(565, 222, "branche germanique", { s: 10, c: GRIS, w: 500 }) + txt(565, 238, "(cousin éloigné)", { s: 10, c: GRIS, w: 500 });
          return svg(640, 270, "Arbre : du latin noctem partent cinq branches, nuit, notte, noche, noite, noapte ; l’anglais night est à part", "", s);
        })() }],
        fil: { html: "<p>Nuit, notte, noche, noite, noapte : les cinq langues romanes ont gardé la forme du latin <em>noctem</em>. L'anglais <em>night</em> vient d'une autre famille, germanique. Le français descend donc du latin, pas de l'anglais ; l'anglais, lui, a beaucoup <strong>emprunté</strong> au français après 1066.</p>", verdicts: [[0, "rejetee", "Le français est une langue romane, issue du latin."]] },
        retenir: "Le français est une langue romane : il descend du latin." },
      { t: "Le latin aujourd'hui", html: partie(LO_OLD, 2),
        fil: { html: "<p>Agenda (« ce qu'il faut faire »), et cetera (« et les autres choses »), aquarelle, les noms des médicaments et des espèces (<em>Homo sapiens</em>) : le latin est partout. On ne le parle plus à la maison, mais il vit dans nos mots, et connaître une racine aide à deviner le sens d'un mot (exercice ci-dessus).</p>", verdicts: [[1, "rejetee", "Le latin vit dans le vocabulaire, les sciences, le droit."], [2, "validee", "Latin de Rome → langues romanes ; présent partout aujourd'hui."]] },
        retenir: "Étudier le latin, c'est mieux comprendre le français." }
    ],
    denouement: {
      titre: "Léa répond à son frère",
      etapes: ["Le latin, langue de Rome, s'est répandu avec l'Empire (indice 1).", "Il a donné les langues romanes, dont le français (indice 2).", "Il vit dans nos mots, les sciences, le droit (indice 3)."],
      reponse: "<p>Le latin était la langue du Latium et de Rome, fondée selon la tradition en 753 avant J.-C. ; les conquêtes romaines l'ont répandu jusqu'en Gaule. En se transformant pendant des siècles, il a donné les langues romanes : français, italien, espagnol, portugais, roumain ; le tableau de « noctem » le montre. Le français ne vient donc pas de l'anglais, qui est une langue germanique ayant beaucoup emprunté au latin et au français. Et le latin n'a pas disparu : il vit dans notre vocabulaire (agenda, et cetera, maximum), dans les sciences (Homo sapiens), dans la médecine et le droit. Connaître ses racines, comme aqua ou manus, aide à comprendre et à bien écrire le français.</p>",
      transfert: "<p>Trouve le sens de « aqueduc », « manuscrit » et « territoire » grâce à leurs racines latines.</p>"
    },
    revision: (LO_OLD ? LO_OLD.revision : []).concat(["L'anglais est une langue germanique, cousine éloignée du français."]),
    exo: LO_OLD ? LO_OLD.exo : "",
    quiz: [
      q("Le latin était la langue…", "de Rome", "d'Athènes", "de Carthage", "Rome se trouve dans le Latium."),
      q("Laquelle n'est pas une langue romane ?", "L'anglais", "L'espagnol", "Le roumain", "L'anglais est germanique."),
      q("« aqua » signifie…", "l'eau", "l'air", "le feu", "D'où aquarium, aquatique, aqueduc."),
      q("Selon la tradition, Rome est fondée en…", "753 av. J.-C.", "1066", "476 apr. J.-C.", "Date traditionnelle."),
      q("Le français descend…", "du latin", "de l'anglais", "du grec", "C'est une langue romane."),
      q("« noctem » a donné en français…", "nuit", "night", "notte", "Notte est italien, night anglais."),
      q("« manus » (la main) a donné…", "manuel", "maternel", "matin", "Un manuel se tient à la main."),
      q("« Homo sapiens » est un nom…", "latin, utilisé en sciences", "anglais", "grec moderne", "Les espèces ont un nom latin."),
      q("Un aqueduc sert à…", "conduire l'eau", "conduire des chars", "stocker du blé", "aqua + ducere."),
      q("« et cetera » signifie…", "et les autres choses", "c'est fini", "au revoir", "On l'abrège etc.")
    ]
  });

  /* ═══════════════════════ 6e LATIN — LES JOURS ET LES MOIS ═══════════════════════ */
  var LJ_OLD = ancien("6e-la-jours");
  var ASTRES = [["Lune", "lundi", "dies Lunae", 12, "#C9CED6"], ["Mars", "mardi", "dies Martis", 10, "#C1440E"], ["Mercure", "mercredi", "dies Mercurii", 8, "#9C8F80"], ["Jupiter", "jeudi", "dies Iovis", 24, "#D8B98E"], ["Vénus", "vendredi", "dies Veneris", 12, "#E8D29A"], ["Saturne", "samedi", "dies Saturni", 20, "#D9C27A"], ["Soleil", "dimanche", "dies Solis", 34, "#F7B733"]];
  var MOIS = ["Ianuarius", "Februarius", "Martius", "Aprilis", "Maius", "Iunius", "Iulius", "Augustus", "September", "October", "November", "December"];
  function astres3D() {
    var o = [];
    o.push({ f: "boite", c: [0, -40, 0], d: [600, 4, 140], coul: "#101828", dessus: "#1B2540" });
    ASTRES.forEach(function (a, i) {
      var x = -252 + i * 84, yb = (i % 2 ? 70 : 0); o.push({ f: "sphere", c: [x, a[3] - 30 + yb, 0], r: a[3], coul: a[4] }); if (yb) o.push({ f: "cylindre", c: [x, -38, 0], r: 1.2, h: yb + 8, n: 6, coul: "#3A4A6A" });
      if (a[0] === "Saturne") o.push({ f: "cylindre", c: [x, a[3] - 31 + yb, 0], r: a[3] * 1.9, h: 1.5, n: 24, coul: "#B8A16A" });
      if (a[0] === "Jupiter") [-8, 0, 8].forEach(function (d) { o.push({ f: "cylindre", c: [x, a[3] - 30 + yb + d - 1.5, 0], r: Math.sqrt(a[3] * a[3] - d * d) + 0.4, h: 3, n: 24, coul: "#B07A4A" }); });
    });
    return o;
  }
  remplacer("6e-la-jours", {
    c: "6e", m: "latin", titre: "Les jours de la semaine et les mois en latin", duree: 30,
    accroche: "« Lundi, c'est “l'un-di”, le premier jour ! » « Septembre contient “sept” par erreur : c'est le 9ᵉ mois ! » Deux explications, deux erreurs ?",
    intro: "Le calendrier affiché dans une classe de 6e à Ebolowa te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois explications.",
    objectifs: ["connaître les noms latins des jours et leur sens", "relier les jours aux astres et aux dieux romains", "expliquer pourquoi septembre n'est plus le 7ᵉ mois", "connaître l'origine de janvier, juillet et août"],
    enquete: {
      titre: "Le calendrier de la classe",
      svg: svg(640, 220, "Un calendrier mural ouvert sur septembre, et deux élèves qui discutent de l’origine des noms", lin("ljC", ["#EAF3E6", "#F7F3EA"], true),
        "<rect width='640' height='220' fill='url(#ljC)'/><rect x='220' y='16' width='200' height='176' rx='6' fill='#fff' stroke='#C9D2E3' stroke-width='2'/><rect x='220' y='16' width='200' height='34' rx='6' fill='" + ROUGE + "'/>" + txt(320, 39, "SEPTEMBRE · 9ᵉ mois", { s: 13, c: "#fff" }) +
        (function () { var s = "", r, c, j = ["L", "M", "M", "J", "V", "S", "D"]; j.forEach(function (d, i) { s += txt(240 + i * 27, 68, d, { s: 11, c: i === 6 ? ROUGE : GRIS }); }); for (r = 0; r < 4; r++) for (c = 0; c < 7; c++) s += txt(240 + c * 27, 92 + r * 26, String(r * 7 + c + 1), { s: 11, w: 500, c: c === 6 ? ROUGE : NUIT }); return s; })() +
        perso(110, 96, "#5A3A1E", "#2E7D32", "#2E3445") + perso(530, 96, "#6B4423", "#7B3F99", "#2E3445") + bulle(20, 40, 180, "Lundi = « l'un-di » !", "#F7C948") + bulle(440, 40, 190, "Sept… mais 9ᵉ mois ?!", "#9FC5E8")),
      legende: "À Ebolowa, la classe de 6e affiche le calendrier de septembre, mois de la rentrée.",
      contexte: "<p>Christelle explique : « Lundi vient de “l'un-di” : c'est le premier jour de la semaine. » Son camarade Steve a une autre question : « Septembre contient “sept”, mais c'est le 9ᵉ mois : c'est une erreur des inventeurs du calendrier. » Le professeur de latin propose de remonter jusqu'à Rome.</p>",
      documents: [{ t: "Le calendrier romain primitif", html: "<p>« L'année de Romulus commençait en <strong>Martius</strong> (mars) et comptait dix mois ; les deux mois d'hiver, Ianuarius et Februarius, furent ajoutés plus tard. »</p>" }],
      question: "D'où viennent les noms de nos jours et de nos mois ?",
      tache: "Explique l'origine de « lundi » et de « septembre », puis celle de deux autres noms de jours ou de mois.",
      hypotheses: ["« Lundi » veut dire « le premier jour » (l'un-di).", "« Septembre » contient « sept » par erreur : il a toujours été le 9ᵉ mois.", "Les jours portent les noms d'astres et de dieux romains (lundi = jour de la Lune) ; l'année romaine commençait en mars, d'où septembre = 7ᵉ mois."]
    },
    parties: [
      { t: "Les jours : des astres et des dieux", html: partie(LJ_OLD, 0),
        planches: [{ type: "3d", titre: "Les sept astres de la semaine", legende: "Tourne la rangée : la Lune, Mars (rouge), Mercure, Jupiter (le plus gros, à bandes), Vénus, Saturne (avec ses anneaux) et le Soleil. Ce sont les sept astres visibles à l'œil nu que les Romains associaient à leurs dieux ; chacun a donné son nom à un jour. Tailles non respectées.",
          modele: { h: 360, rx: -10, ry: 0, echelle: 0.9, alt: "Sept astres en rangée : Lune, Mars, Mercure, Jupiter, Vénus, Saturne avec anneaux, Soleil", objets: astres3D(),
            etiquettes: ASTRES.map(function (a, i) { return { p: [-252 + i * 84, a[3] * 2 - 26 + (i % 2 ? 70 : 0), 0], t: a[1] + " : " + a[2], cote: i < 4 ? "g" : "d" }; }) } }],
        fil: { html: "<p>« Lundi » vient de <em>Lunae dies</em>, le <strong>jour de la Lune</strong> : « lun- » est la Lune, « -di » le jour (<em>dies</em>). De même mardi (Mars), mercredi (Mercure), jeudi (Jupiter), vendredi (Vénus). « L'un-di » est une étymologie inventée, une ressemblance de hasard.</p>", verdicts: [[0, "rejetee", "Lundi = Lunae dies, jour de la Lune."]] },
        retenir: "-di vient de dies : le jour." },
      { t: "Les mois", html: partie(LJ_OLD, 1), illus: ill(LJ_OLD, 1),
        fil: { html: "<p>Dans l'année romaine primitive, qui commençait en <strong>mars</strong>, September était bien le 7ᵉ mois (<em>septem</em> = 7), October le 8ᵉ, November le 9ᵉ, December le 10ᵉ. Quand janvier et février sont passés en tête de l'année, les noms sont restés, mais les numéros ont glissé de deux rangs (simulation ci-dessus). Ce n'est pas une erreur : c'est une trace de l'histoire.</p>", verdicts: [[1, "rejetee", "Septembre était le 7ᵉ mois d'une année qui commençait en mars."]] },
        retenir: "Septembre = 7ᵉ mois… d'une année qui commençait en mars." },
      { t: "Le latin au calendrier", html: partie(LJ_OLD, 2),
        planches: [{ type: "2D", titre: "Des mois renommés pour des hommes et des dieux", legende: "Quintilis (le 5ᵉ) devient Iulius en l'honneur de Jules César ; Sextilis (le 6ᵉ) devient Augustus pour l'empereur Auguste ; Ianuarius est le mois de Janus, le dieu à deux visages qui regarde l'année passée et l'année qui vient.", svg: (function () {
          var s = "<rect width='640' height='230' fill='#FBF8F2'/>";
          [["Quintilis", "« le 5ᵉ »", "Iulius", "Jules César", "juillet"], ["Sextilis", "« le 6ᵉ »", "Augustus", "l'empereur Auguste", "août"]].forEach(function (m, i) { var y = 20 + i * 70; s += bloc(20, y, 150, 52, "#9AA3AF", m[0], m[1]) + "<path d='M178 " + (y + 26) + "H228' stroke='" + NUIT + "' stroke-width='3' marker-end='url(#ljF)'/>" + bloc(236, y, 170, 52, "#7A1F1F", m[2], m[3]) + "<path d='M414 " + (y + 26) + "H464' stroke='" + NUIT + "' stroke-width='3' marker-end='url(#ljF)'/>" + bloc(472, y, 140, 52, BLEU, m[4]); });
          s += "<g transform='translate(90 190)'><ellipse rx='26' ry='30' fill='#C9B28A' stroke='#8A7350'/><path d='M0 -30V30' stroke='#8A7350' stroke-width='2'/><circle cx='-12' cy='-6' r='2.5' fill='#3B2416'/><circle cx='12' cy='-6' r='2.5' fill='#3B2416'/><path d='M-26 2l-8 4l8 2M26 2l8 4l-8 2' fill='#C9B28A' stroke='#8A7350'/></g>" + txt(140, 186, "Janus, dieu des portes et des commencements :", { s: 12, a: "start" }) + txt(140, 206, "Ianuarius → janvier, la porte de l'année", { s: 12, a: "start", c: BLEU });
          return svg(640, 230, "Quintilis devient Iulius puis juillet, Sextilis devient Augustus puis août ; Janus à deux visages pour janvier", fleche("ljF", NUIT), s);
        })() }],
        fil: { html: "<p>Les noms des jours viennent des astres et des dieux, ceux des mois de nombres, de dieux et d'empereurs. Les deux explications de la classe étaient des erreurs ; le latin donne la vraie réponse.</p>", verdicts: [[2, "validee", "Astres et dieux pour les jours ; année commençant en mars pour les mois."]] },
        retenir: "Chaque nom de mois raconte un peu d'histoire romaine." }
    ],
    denouement: {
      titre: "Le calendrier expliqué",
      etapes: ["Lundi = Lunae dies, jour de la Lune (indice 1).", "Année romaine commençant en mars : September = 7ᵉ (indice 2).", "Iulius, Augustus, Ianuarius : hommes et dieux (indice 3)."],
      reponse: "<p>Christelle se trompe : « lundi » ne vient pas de « l'un-di » mais du latin dies Lunae, « le jour de la Lune ». Les autres jours suivent la même règle : mardi (Mars), mercredi (Mercure), jeudi (Jupiter), vendredi (Vénus), les Romains donnant à chaque jour le nom d'un des sept astres visibles, associés à leurs dieux. Steve se trompe aussi : il n'y a pas d'erreur. L'ancienne année romaine commençait en mars, et September (de septem, sept) était alors le 7ᵉ mois, October le 8ᵉ, November le 9ᵉ, December le 10ᵉ. Quand l'année a commencé en janvier, mois de Janus, les numéros ont glissé de deux rangs mais les noms sont restés. Juillet et août portent les noms de Jules César et d'Auguste.</p>",
      transfert: "<p>Écris la date d'aujourd'hui en latin (dies + astre, puis le nom du mois), puis explique l'origine de « décembre ».</p>"
    },
    revision: (LJ_OLD ? LJ_OLD.revision : []).concat(["Les numéros des mois ont glissé de deux rangs quand l'année a commencé en janvier."]),
    exo: LJ_OLD ? LJ_OLD.exo : "",
    quiz: [
      q("« dies Martis » donne…", "mardi", "mercredi", "lundi", "Le jour du dieu Mars."),
      q("« dies » signifie…", "le jour", "le dieu", "la semaine", "D'où -di dans lundi, mardi…"),
      q("Lundi est le jour…", "de la Lune", "du premier", "du Soleil", "dies Lunae."),
      q("Jeudi est le jour de…", "Jupiter", "Janus", "Junon", "dies Iovis."),
      q("Vendredi est le jour de…", "Vénus", "Vulcain", "Saturne", "dies Veneris."),
      q("Pourquoi « septembre » contient-il « sept » ?", "C'était le 7ᵉ mois de l'année romaine primitive", "Il a 7 semaines", "Par erreur", "L'année commençait en mars."),
      q("« octo » signifie…", "huit", "dix", "six", "D'où octobre, octogone."),
      q("Janvier vient du dieu…", "Janus", "Jupiter", "Mars", "Dieu des portes et des débuts."),
      q("Juillet honore…", "Jules César", "Auguste", "Romulus", "Quintilis devient Iulius."),
      q("Août honore…", "l'empereur Auguste", "Jules César", "Mars", "Sextilis devient Augustus.")
    ]
  });

  /* ═══════════════════════ 6e ARTS — LES BRANCHES DES ARTS ═══════════════════════ */
  var AB_OLD = ancien("6e-arts-branches");
  function balafon3D() {
    var o = [], k;
    o.push({ f: "boite", c: [0, -6, 0], d: [420, 6, 200], coul: "#8B6B4A", dessus: "#A68A5E" });
    [-40, 40].forEach(function (z) { o.push({ f: "boite", c: [0, 60, z], d: [330, 8, 8], coul: "#5D3A1E" }); });
    [-160, 160].forEach(function (x) { [-40, 40].forEach(function (z) { o.push({ f: "boite", c: [x, 28, z], d: [8, 60, 8], coul: "#5D3A1E" }); }); });
    for (k = 0; k < 12; k++) {
      var x = -143 + k * 26, L = 100 - k * 4.5;
      o.push({ f: "boite", c: [x, 68, 0], d: [20, 5, L], coul: "#8B4A1E", dessus: "#A65A28" });
      o.push({ f: "sphere", c: [x, 38 - (12 - k) * 0.6, 0], r: 15 - k * 0.6, coul: "#D9B77A" });
    }
    [[60, -80], [100, -84]].forEach(function (p) { o.push({ f: "cylindre", c: [p[0], 78, p[1]], r: 1.6, h: 70, n: 6, axe: "z", coul: "#C9A06E" }); o.push({ f: "sphere", c: [p[0], 78, p[1] + 72], r: 6, coul: "#2B1D12" }); });
    return o;
  }
  remplacer("6e-arts-branches", {
    c: "6e", m: "arts", titre: "Les différentes branches des arts", duree: 30,
    accroche: "Festival culturel à Foumban : « Le conte n'est pas de l'art, c'est juste parler ! » « Le balafon est en bois sculpté : jury des arts plastiques ! » Le comité s'emmêle.",
    intro: "La répartition des œuvres entre les jurys d'un festival culturel scolaire à Foumban te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois avis.",
    objectifs: ["distinguer arts plastiques, musicaux et scéniques", "classer une œuvre selon ce qu'on crée et ce que perçoit le public", "citer des formes d'art camerounaises", "respecter toutes les formes de création"],
    enquete: {
      titre: "Les trois jurys du festival",
      svg: svg(640, 220, "Une table d’inscription avec trois urnes de couleur : arts plastiques, arts musicaux, arts scéniques ; des élèves présentent un balafon, une statuette, un conte", lin("abC", ["#F4EDE1", "#E9DFCF"], true),
        "<rect width='640' height='220' fill='url(#abC)'/><rect y='176' width='640' height='44' fill='#B88A5A'/>" + [["PLASTIQUES", "#352C72", 170], ["MUSICAUX", "#6B4E00", 320], ["SCÉNIQUES", "#6E1F43", 470]].map(function (u) { return "<rect x='" + (u[2] - 55) + "' y='96' width='110' height='70' rx='8' fill='" + u[1] + "'/>" + txt(u[2], 136, u[0], { s: 12, c: "#fff" }); }).join("") +
        "<g transform='translate(60 120)'><path d='M0 46c-14 0 -16 -30 -6 -38c-8 -8 -4 -22 6 -22s14 14 6 22c10 8 8 38 -6 38Z' fill='#B87333' stroke='#7A4A1E'/></g>" + perso(570, 76, "#5A3A1E", "#E8A33D", "#2E3445") + bulle(470, 20, 160, "Le conte, de l'art ?", "#9FC5E8") + bulle(30, 20, 200, "Balafon = bois sculpté !", "#F7C948") + "<rect x='250' y='60' width='140' height='10' rx='3' fill='#8B4A1E'/>" + [0, 1, 2, 3, 4, 5].map(function (k) { return "<circle cx='" + (262 + k * 23) + "' cy='80' r='" + (8 - k * 0.6) + "' fill='#D9B77A'/>"; }).join("")),
      legende: "À Foumban, ville des artisans du bronze et du bois, le lycée organise son festival culturel annuel.",
      contexte: "<p>Six œuvres sont inscrites : une statuette en bronze, un pagne ndop tissé, une photographie du palais, un air de balafon, un conte de la tortue, une danse. Rodrigue affirme : « Le conte n'est pas de l'art : c'est juste parler. » Amina ajoute : « Le balafon est un objet en bois sculpté : il va au jury des arts plastiques. » Le proviseur demande au comité de bien répartir les œuvres.</p>",
      documents: [{ t: "Le règlement du festival", html: "<p>« Trois jurys : <strong>arts plastiques</strong> (œuvres à regarder), <strong>arts musicaux</strong> (œuvres à écouter), <strong>arts scéniques</strong> (spectacles joués devant un public). »</p>" }],
      question: "Le conte est-il un art, et à quel jury confier le balafon ?",
      tache: "Répartis les six œuvres entre les trois jurys en justifiant chaque choix.",
      hypotheses: ["Le conte n'est pas de l'art : c'est juste parler.", "Le balafon relève des arts plastiques, parce que c'est un objet en bois.", "Trois familles : plastiques (on façonne : bronze, tissage, photo), musicaux (balafon, chant), scéniques (conte, danse) ; on classe selon ce qu'on crée et ce que perçoit le public."]
    },
    parties: [
      { t: "Les arts plastiques", html: partie(AB_OLD, 0),
        planches: [{ type: "2D", titre: "Trois œuvres plastiques camerounaises", legende: "Une statuette coulée en bronze à Foumban, un pagne ndop teint à l'indigo dans les Grassfields, une jarre de terre cuite : on façonne la matière (métal, fil, argile) pour créer une œuvre qu'on regarde, et parfois qu'on touche.", svg: (function () {
          var s = "<rect width='640' height='250' fill='#FBF8F2'/>";
          s += "<rect x='30' y='20' width='180' height='190' rx='12' fill='#fff' stroke='#C9D2E3'/><g transform='translate(120 140)'><rect x='-30' y='40' width='60' height='12' fill='#5D3A1E'/><path d='M0 40c-22 0 -26 -46 -10 -60c-12 -12 -6 -34 10 -34s22 22 10 34c16 14 12 60 -10 60Z' fill='#B87333' stroke='#7A4A1E' stroke-width='2'/><circle cx='-5' cy='-30' r='2' fill='#3B2416'/><circle cx='5' cy='-30' r='2' fill='#3B2416'/></g>" + txt(120, 230, "statuette en bronze", { s: 12 });
          s += "<rect x='230' y='20' width='180' height='190' rx='12' fill='#1F2A5A'/>" + (function () { var r = "", i, j; for (i = 0; i < 5; i++) for (j = 0; j < 6; j++) r += "<g transform='translate(" + (252 + i * 34) + " " + (40 + j * 30) + ")'><path d='M0 -9L9 0L0 9L-9 0Z' fill='none' stroke='#F4F1EA' stroke-width='2'/><circle r='2' fill='#F4F1EA'/></g>"; return r; })() + txt(320, 230, "pagne ndop (indigo)", { s: 12 });
          s += "<rect x='430' y='20' width='180' height='190' rx='12' fill='#fff' stroke='#C9D2E3'/><path d='M490 190c-26 0 -36 -70 -16 -110h52c20 40 10 110 -16 110Z' fill='#A0522D' stroke='#6B3A1E' stroke-width='2'/><path d='M486 80h28v-12h-28Z' fill='#8B4513'/><path d='M482 120q38 8 56 0M480 140q40 8 60 0' stroke='#E9DFCF' stroke-width='2' fill='none'/>" + txt(520, 230, "jarre en terre cuite", { s: 12 });
          return svg(640, 250, "Trois œuvres : une statuette en bronze, un pagne ndop bleu indigo à motifs blancs, une jarre en terre cuite décorée", "", s);
        })() }],
        fil: { html: "<p>La statuette de bronze, le pagne ndop et la photographie du palais sont des œuvres qu'on <strong>regarde</strong> : elles vont au jury des arts plastiques. On y façonne la matière ou les images.</p>", verdicts: [] },
        retenir: "Arts plastiques : on façonne la matière et les formes." },
      { t: "Les arts musicaux et scéniques", html: partie(AB_OLD, 1), illus: ill(AB_OLD, 1),
        planches: [{ type: "3d", titre: "Le balafon", legende: "Tourne le balafon : des lames de bois dur, de plus en plus courtes, posées sur un cadre ; sous chacune, une calebasse sert de caisse de résonance, plus petite pour les sons aigus. L'instrument est fabriqué par un artisan, mais l'œuvre d'art, c'est la musique qu'on en tire.",
          modele: { h: 320, rx: -26, ry: 24, echelle: 0.95, alt: "Balafon : douze lames de bois sur un cadre, avec des calebasses sous les lames et deux baguettes", objets: balafon3D(),
            etiquettes: [{ p: [-143, 72, 0], t: "lame longue : son grave", cote: "g" }, { p: [143, 72, 0], t: "lame courte : son aigu", cote: "d" }, { p: [-100, 30, 0], t: "calebasses (résonance)", cote: "g" }, { p: [80, 80, -84], t: "baguettes", cote: "d" }] } }],
        fil: { html: "<p>Ce que le public reçoit du balafon, c'est un <strong>air de musique</strong> : il va au jury des arts musicaux, même si l'objet a été taillé avec art. Le conte, lui, est un <strong>art scénique</strong> : le conteur joue avec sa voix, ses gestes, ses silences, fait participer le public ; c'est un spectacle, comme la danse et le théâtre.</p>", verdicts: [[0, "rejetee", "Le conte est un art scénique."], [1, "rejetee", "Le balafon produit de la musique : arts musicaux."]] },
        retenir: "Plastiques : voir ; musicaux : entendre ; scéniques : un spectacle." },
      { t: "Des arts camerounais", html: partie(AB_OLD, 2),
        fil: { html: "<p>La répartition est claire : plastiques (bronze, ndop, photographie), musicaux (balafon), scéniques (conte, danse). On classe une œuvre selon <strong>ce qu'on crée</strong> et <strong>ce que perçoit le public</strong>, pas selon la matière de l'objet (exercice ci-dessus).</p>", verdicts: [[2, "validee", "Trois familles, classement selon l'œuvre et le public."]] },
        retenir: "Le patrimoine artistique camerounais est immense et varié." }
    ],
    denouement: {
      titre: "La répartition du comité",
      etapes: ["Bronze, ndop, photographie : arts plastiques (indice 1).", "Balafon : musical ; conte : scénique (indice 2).", "On classe selon l'œuvre et le public (indice 3)."],
      reponse: "<p>Les arts se rangent en trois grandes familles. Les arts plastiques façonnent la matière ou l'image pour qu'on la regarde : la statuette en bronze, le pagne ndop tissé et teint, la photographie du palais vont à ce jury. Les arts musicaux produisent des sons organisés : l'air de balafon y va, car l'œuvre est la musique, même si l'instrument a été taillé avec soin. Les arts scéniques sont des spectacles joués devant un public : la danse, mais aussi le conte, où le conteur joue avec sa voix, ses gestes et les réponses du public ; Rodrigue a donc tort, le conte est un art à part entière. Ce classement aide à juger chaque œuvre avec les bons critères, et à respecter toutes les formes de création, du bronze de Foumban au mvet du Sud.</p>",
      transfert: "<p>Classe : un masque de danse porté pendant une cérémonie. Est-il plastique, scénique, ou les deux ? Justifie.</p>"
    },
    revision: (AB_OLD ? AB_OLD.revision : []).concat(["On classe une œuvre selon ce qu'elle donne au public, pas selon la matière de l'objet."]),
    exo: AB_OLD ? AB_OLD.exo : "",
    quiz: [
      q("La sculpture appartient aux arts…", "plastiques", "musicaux", "scéniques", "On façonne la matière."),
      q("Le conte est un art…", "scénique", "plastique", "musical seulement", "Il se joue devant un public."),
      q("Le mvet est…", "un instrument et un art du récit", "une danse", "une sculpture", "Il accompagne les récits épiques."),
      q("Un air de balafon relève des arts…", "musicaux", "plastiques", "scéniques", "L'œuvre est la musique."),
      q("La photographie est un art…", "plastique", "musical", "scénique", "Une image à regarder."),
      q("La danse est un art…", "scénique", "plastique", "musical seulement", "Un spectacle du corps."),
      q("Foumban est célèbre pour…", "le bronze et le bois sculpté", "le mvet", "la poterie seulement", "Ville d'artisans."),
      q("Le pagne ndop est…", "un textile teint à l'indigo", "un instrument", "une danse", "Arts textiles, donc plastiques."),
      q("Sous les lames du balafon, les calebasses servent…", "de caisses de résonance", "de décoration", "de baguettes", "Elles amplifient le son."),
      q("On classe une œuvre selon…", "ce qu'elle donne au public", "la matière de l'objet", "son prix", "Voir, entendre, assister à un spectacle.")
    ]
  });

  /* ═══════════════════════ 6e EPS — LA PISTE D'ATHLÉTISME ═══════════════════════ */
  var EP_OLD = ancien("6e-eps-piste");
  var PI = { L: 84.39, R0: 36.5, W: 1.22 };
  function Rmes(i) { return i === 1 ? PI.R0 + 0.3 : PI.R0 + (i - 1) * PI.W + 0.2; }
  function stade3D() {
    var o = [], K = 3, cx = PI.L / 2 * K, n = 12;
    function ring(r1, r2, coul) {
      var k, a0, a1;
      [-1, 1].forEach(function (s) {
        o.push({ f: "poly", pts: [[-cx, 0, s * r1 * K], [cx, 0, s * r1 * K], [cx, 0, s * r2 * K], [-cx, 0, s * r2 * K]], coul: coul });
        for (k = 0; k < n; k++) {
          var C = s * cx, d = s > 0 ? 1 : -1;
          var p = function (r, a) { return [C + d * r * K * Math.sin(a), 0, r * K * Math.cos(a)]; };
          var b0 = k * Math.PI / n, b1 = b0 + Math.PI / n;
          o.push({ f: "poly", pts: [p(r1, b0), p(r1, b1), p(r2, b1), p(r2, b0)], coul: coul });
        }
      });
    }
    var k;
    o.push({ f: "boite", c: [0, -4, 0], d: [cx * 2 + 2 * (PI.R0 + 14) * K, 4, 2 * (PI.R0 + 14) * K], coul: "#5E7D3A", dessus: "#6E9B45" });
    for (k = 0; k < 8; k++) { var r1 = PI.R0 + k * PI.W, r2 = r1 + PI.W; ring(r1 + 0.06, r2 - 0.06, "#B5442C"); ring(r2 - 0.06, r2 + 0.06, "#F4F1EA"); }
    ring(PI.R0 - 0.1, PI.R0 + 0.06, "#F4F1EA");
    ring(PI.R0 + 8 * PI.W + 0.06, PI.R0 + 8 * PI.W + 2.5, "#B5442C");
    o.push({ f: "boite", c: [cx, 0.6, -(PI.R0 + 4 * PI.W) * K], d: [2, 0.6, 8 * PI.W * K], coul: "#F4F1EA", div: false });
    o.push({ f: "boite", c: [cx, 10, -(PI.R0 + 8 * PI.W + 4) * K], d: [3, 20, 3], coul: "#1F2328" });
    return o;
  }
  remplacer("6e-eps-piste", {
    c: "6e", m: "eps", titre: "La piste d'athlétisme et son vocabulaire", duree: 30,
    accroche: "Finale du 200 m au stade de Ngaoundéré : « Ce n'est pas juste, celui du couloir 8 part loin devant ! » Et un coureur coupe le virage en passant à l'intérieur…",
    intro: "Une finale de 200 m pendant la journée sportive d'un lycée te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois réclamations.",
    objectifs: ["nommer les parties d'une piste de 400 m", "connaître le sens de course et la règle des couloirs", "expliquer et calculer le décalage des départs", "employer le vocabulaire de l'athlétisme"],
    enquete: {
      titre: "La réclamation de la finale du 200 m",
      svg: svg(640, 220, "Une piste rouge à couloirs blancs ; des coureurs alignés en escalier au départ d’un virage ; un élève proteste", lin("epC", ["#CFE3F2", "#F4F1EA"], true),
        "<rect width='640' height='220' fill='url(#epC)'/><path d='M0 100Q320 60 640 100V220H0Z' fill='#6E9B45'/><path d='M0 120Q320 80 640 120V220H0Z' fill='#B5442C'/>" + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (k) { return "<path d='M0 " + (120 + k * 12) + "Q320 " + (80 + k * 13) + " 640 " + (120 + k * 12) + "' stroke='#F4F1EA' stroke-width='1.5' fill='none'/>"; }).join("") +
        [0, 1, 2, 3, 4, 5, 6, 7].map(function (k) { var x = 120 + k * 40, y = 98 + k * 12.6; return "<circle cx='" + x + "' cy='" + (y - 12) + "' r='4' fill='#4A2E1A'/><path d='M" + (x - 4) + " " + (y - 8) + "h8v10h-8Z' fill='" + ["#1E499B", "#C62828", "#2E7D32", "#F7C948", "#7B3F99", "#E8A33D", "#0E7C86", "#F4F1EA"][k] + "'/>"; }).join("") +
        perso(560, 30, "#5A3A1E", "#C62828", "#2E3445") + bulle(380, 10, 160, "Pas juste !", "#F7C948") + txt(140, 210, "couloir 1", { s: 10, c: "#fff" }) + txt(420, 210, "couloir 8", { s: 10, c: "#fff" })),
      legende: "Au stade du lycée de Ngaoundéré : la finale du 200 m de la journée sportive.",
      contexte: "<p>Au départ, les huit coureurs sont placés en escalier dans le virage. Ibrahim, couloir 1, proteste : « Le couloir 8 part 26 mètres devant moi : il est avantagé ! » Pendant la course, un autre coureur quitte son couloir pour couper le virage à la corde. Un spectateur demande pourquoi tout le monde tourne « dans le même sens ».</p>",
      documents: [{ t: "Le règlement (extrait)", html: "<p>« La piste mesure 400 m au couloir 1. On court dans le sens inverse des aiguilles d'une montre. Au 200 m et au 400 m, chaque coureur reste dans son couloir du départ à l'arrivée. »</p>" }],
      question: "Le décalage est-il injuste, et que penser du coureur qui coupe le virage ?",
      tache: "Réponds à Ibrahim en expliquant le décalage, puis dis ce que l'arbitre doit faire pour le coureur qui a quitté son couloir.",
      hypotheses: ["Le départ décalé avantage les couloirs extérieurs.", "Chacun peut quitter son couloir pour raccourcir son virage.", "Piste de 400 m, sens inverse des aiguilles d'une montre, chacun dans son couloir ; le décalage compense la longueur des virages extérieurs : même distance pour tous."]
    },
    parties: [
      { t: "Une piste de 400 mètres", html: partie(EP_OLD, 0),
        planches: [{ type: "3d", titre: "Le stade et sa piste", legende: "Tourne le stade : la piste en tartan rouge entoure la pelouse ; deux lignes droites de 84,39 m et deux virages ; huit couloirs de 1,22 m séparés par des lignes blanches ; la corde le long du couloir 1 ; la ligne d'arrivée commune au bout de la ligne droite.",
          modele: { h: 340, rx: -46, ry: 0, echelle: 0.62, alt: "Stade d’athlétisme : piste rouge à huit couloirs blancs autour d’une pelouse verte, ligne d’arrivée", objets: stade3D(),
            etiquettes: [{ p: [0, 1, -(PI.R0 + 0.2) * 3], t: "la corde (couloir 1)", cote: "g" }, { p: [PI.L / 2 * 3, 2, -(PI.R0 + 4 * PI.W) * 3], t: "ligne d'arrivée", cote: "d" }, { p: [0, 1, -(PI.R0 + 7.5 * PI.W) * 3], t: "couloir 8", cote: "d" }, { p: [0, 1, 0], t: "pelouse (lancers, sauts)", cote: "g" }] } }],
        fil: { html: "<p>La piste mesure <strong>400 m dans le couloir 1</strong>. Mais les couloirs extérieurs font le tour d'un virage plus large : un tour complet dans le couloir 8 mesure environ 453 m. Si tout le monde partait sur la même ligne, le couloir 8 courrait plus que les autres.</p>", verdicts: [] },
        retenir: "400 m au couloir 1 ; couloir 1 = le plus proche de la corde." },
      { t: "Le sens et les départs", html: partie(EP_OLD, 1),
        fil: { html: "<p>Au 200 m, chaque coureur fait un virage dans son couloir. Le virage du couloir 8 est plus long d'environ 26,5 m que celui du couloir 1 : le coureur du couloir 8 part donc 26,5 m <strong>devant</strong>, pour courir exactement 200 m comme Ibrahim (simulation ci-dessus). Ce n'est pas un avantage, c'est l'égalité. Et quitter son couloir pour couper le virage, c'est courir moins que les autres : <strong>disqualification</strong>.</p>", verdicts: [[0, "rejetee", "Le décalage compense le virage plus long : même distance."], [1, "rejetee", "Quitter son couloir au 200 m, c'est la disqualification."]] },
        retenir: "Départs décalés = même distance pour tous les couloirs." },
      { t: "Le vocabulaire", html: partie(EP_OLD, 2),
        fil: { html: "<p>Couloir, corde, décalage, ligne d'arrivée, faux départ : avec ces mots, on peut expliquer la course. Sens inverse des aiguilles d'une montre, chacun dans son couloir, décalage pour l'égalité : la course était juste.</p>", verdicts: [[2, "validee", "Sens de course, couloirs, décalage égalisateur."]] },
        retenir: "Respecter son couloir, c'est respecter la règle et les autres." }
    ],
    denouement: {
      titre: "La décision de l'arbitre",
      etapes: ["Un tour = 400 m au couloir 1, plus dans les couloirs extérieurs (indice 1).", "Décalage du couloir 8 au 200 m : environ 26,5 m (indice 2).", "Couloirs, sens, vocabulaire (indice 3)."],
      reponse: "<p>La piste mesure 400 m dans le couloir 1, le long de la corde ; plus on s'éloigne de la corde, plus le virage est long. Au 200 m, chaque coureur court un virage puis la ligne droite, dans son couloir : le virage du couloir 8 étant plus long d'environ 26,5 m, son départ est avancé d'autant, pour que chacun parcoure exactement 200 m. Ibrahim n'est donc pas désavantagé. En revanche, le coureur qui a quitté son couloir pour couper le virage a couru moins que les autres : l'arbitre doit le disqualifier. Enfin, tout le monde court dans le sens inverse des aiguilles d'une montre, la corde à sa gauche, et la ligne d'arrivée est commune à toutes les courses.</p>",
      transfert: "<p>Au 400 m, les coureurs font deux virages dans leur couloir. Le décalage du couloir 8 est-il plus grand ou plus petit qu'au 200 m ? <em>(Environ deux fois plus grand : près de 53 m.)</em></p>"
    },
    revision: (EP_OLD ? EP_OLD.revision : []).concat(["Quitter son couloir au 200 m ou au 400 m entraîne la disqualification."]),
    exo: EP_OLD ? EP_OLD.exo : "",
    quiz: [
      q("Combien mesure un tour de piste au couloir 1 ?", "400 m", "200 m", "1 000 m", "Deux droites et deux virages."),
      q("Pourquoi les départs du 200 m sont-ils décalés ?", "Pour que tous courent la même distance", "Par tirage au sort", "Pour avantager le couloir 8", "Les virages extérieurs sont plus longs."),
      q("La corde est…", "le bord intérieur de la piste", "le bord extérieur", "la ligne d'arrivée", "Le couloir 1 la longe."),
      q("On court dans le sens…", "inverse des aiguilles d'une montre", "des aiguilles d'une montre", "que l'on veut", "La corde est à gauche."),
      q("Une piste compte en général…", "8 couloirs", "4 couloirs", "12 couloirs", "Numérotés de l'intérieur vers l'extérieur."),
      q("Un coureur qui coupe son virage au 200 m est…", "disqualifié", "félicité", "avantagé sans sanction", "Il a couru moins que les autres."),
      q("La ligne d'arrivée est…", "commune à toutes les courses", "différente pour chaque couloir", "au milieu du virage", "Au bout de la ligne droite."),
      q("Un faux départ, c'est…", "partir avant le signal", "partir en retard", "tomber au départ", "Il est sanctionné."),
      q("La zone de transmission sert…", "au passage du témoin en relais", "aux lancers", "à l'échauffement", "Relais 4 × 100 m."),
      q("Le décalage du couloir 8 au 200 m est d'environ…", "26,5 m", "2,6 m", "100 m", "π × (45,24 − 36,8) ≈ 26,5 m.")
    ]
  });

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  VRT_A("6e-la-origine", 2, "D'où vient ce mot ? Retrouve la racine latine", function (el) {
    exercice(el, RACINES.map(function (r) { return ["« " + r[0] + " » vient du latin ___", [r[1] + " (" + r[2] + ")"].concat(RACINES.filter(function (x) { return x[1] !== r[1]; }).slice(0, 2).map(function (x) { return x[1] + " (" + x[2] + ")"; })), "« " + r[0] + " » contient " + r[1] + ", " + r[2] + "."]; }), "Mot suivant", "Mot");
  });
  VRT_A("6e-la-jours", 1, "Fais commencer l'année en mars ou en janvier", function (el) {
    el.innerHTML = "<div style='display:flex;gap:8px;flex-wrap:wrap'><button type='button' class='btn-l' data-d='2'>Année romaine primitive (début en mars)</button><button type='button' class='btn-l' data-d='0'>Notre calendrier (début en janvier)</button></div><div data-g style='margin:8px 0'></div><p class='labo-r' data-r></p>";
    function maj(d) {
      var s = "<rect width='480' height='160' fill='#FBF8F2'/>", k;
      for (k = 0; k < 12; k++) { var m = (k + d) % 12, x = 10 + k * 38.5, sp = m >= 8; s += "<rect x='" + x + "' y='30' width='35' height='90' rx='6' fill='" + (sp ? "#7A1F1F" : "#DCE6F2") + "'/>" + txt(x + 17.5, 52, String(k + 1), { s: 15, c: sp ? "#fff" : BLEU }) + "<text x='" + (x + 22) + "' y='112' font-size='10' font-weight='700' fill='" + (sp ? "#fff" : NUIT) + "' transform='rotate(-90 " + (x + 22) + " 112)'>" + MOIS[m] + "</text>"; }
      s += txt(240, 20, d ? "L'année commence en Martius : September est le 7ᵉ mois" : "L'année commence en Ianuarius : September devient le 9ᵉ mois", { s: 12, c: d ? "#7A1F1F" : BLEU }) + txt(240, 146, "septem 7 · octo 8 · novem 9 · decem 10", { s: 11, c: GRIS, w: 600 });
      el.querySelector("[data-g]").innerHTML = "<svg viewBox='0 0 480 160' style='max-width:540px;width:100%' role='img' aria-label='Douze mois numérotés selon le mois de début de l’année'>" + s + "</svg>";
      el.querySelector("[data-r]").innerHTML = d ? "Début en mars : <b>September = 7ᵉ</b>, October = 8ᵉ, November = 9ᵉ, December = 10ᵉ : les noms correspondent aux nombres." : "Début en janvier : les mêmes noms glissent de <b>deux rangs</b> ; September devient le <b>9ᵉ</b> mois.";
    }
    el.querySelectorAll("[data-d]").forEach(function (b) { b.addEventListener("click", function () { maj(+b.dataset.d); }); });
    maj(2);
  });
  VRT_A("6e-arts-branches", 2, "Quel jury ? Classe chaque œuvre", function (el) {
    exercice(el, [["Une statuette en bronze de Foumban : arts ___", ["plastiques", "musicaux", "scéniques"], "On la regarde : matière façonnée."], ["Un air de balafon : arts ___", ["musicaux", "plastiques", "scéniques"], "L'œuvre est la musique."], ["Un conte de la tortue dit devant la classe : arts ___", ["scéniques", "musicaux", "plastiques"], "Un spectacle de parole."], ["Un pagne ndop tissé et teint : arts ___", ["plastiques", "scéniques", "musicaux"], "Arts textiles."], ["Une danse bikutsi : arts ___", ["scéniques", "plastiques", "musicaux"], "Spectacle du corps (avec musique)."], ["Une photographie du palais du sultan : arts ___", ["plastiques", "musicaux", "scéniques"], "Une image à regarder."], ["Une chorale qui chante l'hymne : arts ___", ["musicaux", "scéniques", "plastiques"], "Chant."], ["Une pièce de théâtre du club : arts ___", ["scéniques", "plastiques", "musicaux"], "Joué devant un public."]], "Œuvre suivante", "Œuvre");
  });
  VRT_A("6e-eps-piste", 1, "Calcule le décalage des départs", function (el) {
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:8px 18px;align-items:end'><div style='display:flex;gap:6px'><button type='button' class='btn-l' data-c='200'>200 m</button><button type='button' class='btn-l' data-c='400'>400 m</button></div><label class='labo-c'><span>Couloir : <b data-lv>8</b></span><input type='range' min='1' max='8' value='8' data-l></label></div><div data-g style='margin:8px 0'></div><p class='labo-r' data-r></p>";
    var course = 200, Lc = el.querySelector("[data-l]");
    function maj() {
      var c = +Lc.value, K = 3.1, cy = 165, cx1 = 320 - PI.L / 2 * K, cx2 = 320 + PI.L / 2 * K, s = "<rect width='640' height='330' fill='#6E9B45'/>", k;
      function stadeP(r) { r *= K; return "M" + cx1 + " " + (cy - r) + "H" + cx2 + "A" + r + " " + r + " 0 0 1 " + cx2 + " " + (cy + r) + "H" + cx1 + "A" + r + " " + r + " 0 0 1 " + cx1 + " " + (cy - r) + "Z"; }
      s += "<path d='" + stadeP(PI.R0 + 8 * PI.W + 1) + "' fill='#B5442C'/><path d='" + stadeP(PI.R0) + "' fill='#5E9E4E'/>";
      for (k = 0; k <= 8; k++) s += "<path d='" + stadeP(PI.R0 + k * PI.W) + "' fill='none' stroke='#F4F1EA' stroke-width='1.2'/>";
      s += "<path d='M" + cx2 + " " + (cy + PI.R0 * K) + "V" + (cy + (PI.R0 + 8 * PI.W) * K) + "' stroke='#fff' stroke-width='4'/>" + txt(cx2 + 6, cy + (PI.R0 + 10 * PI.W) * K + 6, "arrivée", { s: 11, c: "#fff", a: "start" });
      function pos(i, longueur) { var R = Rmes(i), d = longueur, P = [], t; if (course === 200) { var th = Math.PI * (R - Rmes(1)) / R; for (t = th; t <= Math.PI + 1e-9; t += 0.05) P.push([cx1 - R * K * Math.sin(t), cy - R * K * Math.cos(t)]); P.push([cx1, cy + R * K], [cx2, cy + R * K]); return { th: th, P: P, start: [cx1 - R * K * Math.sin(th), cy - R * K * Math.cos(th), th, cx1, -1] }; } var th2 = 2 * Math.PI * (R - Rmes(1)) / R; for (t = th2; t <= Math.PI + 1e-9; t += 0.05) P.push([cx2 + R * K * Math.sin(t), cy + R * K * Math.cos(t)]); P.push([cx2, cy - R * K], [cx1, cy - R * K]); for (t = 0; t <= Math.PI + 1e-9; t += 0.05) P.push([cx1 - R * K * Math.sin(t), cy - R * K * Math.cos(t)]); P.push([cx2, cy + R * K]); return { th: th2, P: P, start: [cx2 + R * K * Math.sin(th2), cy + R * K * Math.cos(th2), th2, cx2, 1] }; }
      for (k = 1; k <= 8; k++) { var p = pos(k), a = p.start[2], rin = (PI.R0 + (k - 1) * PI.W) * K, rout = rin + PI.W * K; var x1 = course === 200 ? cx1 - rin * Math.sin(a) : cx2 + rin * Math.sin(a), y1 = course === 200 ? cy - rin * Math.cos(a) : cy + rin * Math.cos(a), x2 = course === 200 ? cx1 - rout * Math.sin(a) : cx2 + rout * Math.sin(a), y2 = course === 200 ? cy - rout * Math.cos(a) : cy + rout * Math.cos(a); s += "<path d='M" + x1.toFixed(1) + " " + y1.toFixed(1) + "L" + x2.toFixed(1) + " " + y2.toFixed(1) + "' stroke='" + (k === c ? "#F7C948" : "#fff") + "' stroke-width='" + (k === c ? 4 : 2) + "'/>"; }
      var pc = pos(c); s += "<path d='" + pc.P.map(function (q, i) { return (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); }).join("") + "' stroke='#F7C948' stroke-width='3' fill='none' stroke-dasharray='8 5'/><circle cx='" + pc.start[0].toFixed(1) + "' cy='" + pc.start[1].toFixed(1) + "' r='6' fill='#F7C948' stroke='#1F2328'/>";
      s += txt(320, cy - 6, course + " m · couloir " + c, { s: 16, c: "#fff" }) + txt(320, cy + 16, "trait jaune : le trajet du coureur", { s: 11, c: "#fff", w: 500 });
      el.querySelector("[data-lv]").textContent = c;
      el.querySelector("[data-g]").innerHTML = "<svg viewBox='0 0 640 330' style='max-width:640px;width:100%' role='img' aria-label='Vue de dessus de la piste avec les départs décalés'>" + s + "</svg>";
      var nv = course === 200 ? 1 : 2, dec = nv * Math.PI * (Rmes(c) - Rmes(1));
      el.querySelector("[data-r]").innerHTML = "Rayon de course du couloir " + c + " : <b>" + Rmes(c).toFixed(2).replace(".", ",") + " m</b> (couloir 1 : 36,80 m) · " + (c === 1 ? "pas de décalage" : "virage" + (nv > 1 ? "s" : "") + " plus long" + (nv > 1 ? "s" : "") + " de " + nv + " × π × (" + Rmes(c).toFixed(2).replace(".", ",") + " − 36,80) ≈ <b>" + dec.toFixed(1).replace(".", ",") + " m</b> → départ avancé d'autant") + " · distance courue : <b>" + course + " m</b> pour tous. Sans décalage, le couloir " + c + " courrait <b>" + (course + dec).toFixed(1).replace(".", ",") + " m</b>.";
    }
    el.querySelectorAll("[data-c]").forEach(function (b) { b.addEventListener("click", function () { course = +b.dataset.c; maj(); }); });
    Lc.addEventListener("input", maj); maj();
  });
})();
