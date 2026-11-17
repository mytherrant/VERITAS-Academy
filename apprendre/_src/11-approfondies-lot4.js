/* Leçons APPROFONDIES — lot 4 (17/11/2026) : aimants (4e), osmose (Tle D), expérience de Rutherford et mesure (2nde C),
   division euclidienne (5e). Gabarit de 07-lecons-approfondies.js : situation de vie suivie partie après partie,
   hypothèses tranchées, planches 2D et 3D, labo ou simulation, situation résolue (denouement), quiz de 10 questions.
   Ces leçons remplacent EN PLACE les versions courtes des fichiers 05 et 06 (même identifiant, même rang dans la
   liste ; fiche APC et « examen » repris). Les simulations sont déclarées à la fin du fichier (VRT_A). */
(function () {
  "use strict";
  var NUIT = "#001136", BLEU = "#1E499B", GRIS = "#4D5163", ROUGE = "#D9472B", VERT = "#17784D", NS = "http://www.w3.org/2000/svg";

  /* ── outils de dessin 2D ── */
  function txt(x, y, t, o) {
    o = o || {};
    return "<text x='" + x + "' y='" + y + "' text-anchor='" + (o.a || "middle") + "' font-size='" + (o.s || 12) + "' font-weight='" + (o.w || 700) + "' fill='" + (o.c || NUIT) + "'" + (o.i ? " font-style='italic'" : "") + ">" + t + "</text>";
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
  function omb(id) { return "<radialGradient id='" + id + "'><stop offset='0' stop-color='#001136' stop-opacity='.28'/><stop offset='1' stop-color='#001136' stop-opacity='0'/></radialGradient>"; }
  function fleche(id, c) { return "<marker id='" + id + "' markerWidth='10' markerHeight='10' refX='7' refY='5' orient='auto'><path d='M0 1L8 5L0 9Z' fill='" + c + "'/></marker>"; }
  function svg(w, h, alt, defs, corps) {
    return "<svg viewBox='0 0 " + w + " " + h + "' role='img' aria-label='" + alt + "' font-family='Inter,Arial,sans-serif'><rect width='" + w + "' height='" + h + "' fill='#fff'/><defs>" + defs + "</defs>" + corps +
      "<text x='" + (w - 6) + "' y='" + (h - 5) + "' font-size='8' text-anchor='end' fill='#8A93A6'>Planche VÉRITAS</text></svg>";
  }
  /* générateur pseudo-aléatoire à graine fixe : les dessins (et les pages statiques) restent identiques d'une construction à l'autre */
  function alea(g) { return function () { g = (g * 16807) % 2147483647; return (g - 1) / 2147483646; }; }
  /* une mangue mûre (2D) */
  function mangue(id, x, y, r, a) {
    return "<g transform='translate(" + x + " " + y + ") rotate(" + (a || 0) + ")'><ellipse cx='1' cy='" + (r * .9) + "' rx='" + (r * .9) + "' ry='" + (r * .25) + "' fill='url(#" + id + "o)'/><ellipse rx='" + r + "' ry='" + (r * .78) + "' fill='url(#" + id + "m)'/>" +
      "<ellipse cx='" + (-r * .35) + "' cy='" + (-r * .3) + "' rx='" + (r * .3) + "' ry='" + (r * .16) + "' fill='#fff' opacity='.55' transform='rotate(-25)'/><path d='M" + (r * .85) + " " + (-r * .25) + "l" + (r * .3).toFixed(1) + " " + (-r * .3).toFixed(1) + "' stroke='#5B3A12' stroke-width='" + (r > 7 ? 1.4 : 1) + "' fill='none'/></g>";
  }
  function defsMangue(id) { return rad(id + "m", ["#FFE07A", "#F7B32B", "#E07A1F", "#7A9A2E"]) + omb(id + "o"); }

  /* reprendre une leçon existante : même rang dans la liste, fiche APC et lien d'examen conservés */
  function ancien(id) { return window.VRT_LECONS[id]; }
  function remplacer(id, o) {
    var a = ancien(id);
    if (a) ["apc", "examen", "rang", "cle"].forEach(function (k) { if (a[k] != null && o[k] == null) o[k] = a[k]; });
    VRT_L(id, o);
    if (a) o.ordre = a.ordre;
  }
  function q(qq, bonne, f1, f2, e) { return { q: qq, r: [bonne, f1, f2], b: 0, e: e }; }

  /* ═══════════════════════ 4e PCT — LES AIMANTS ET LEURS PÔLES ═══════════════════════ */
  /* champ d'un aimant droit (pôle N en (xn, yn), pôle S en (xs, ys)) : somme de deux « charges magnétiques » */
  function champ(px, py, xn, yn, xs, ys) {
    var dx = px - xn, dy = py - yn, d = Math.pow(dx * dx + dy * dy, 1.5) + 1e-6, ex = dx / d, ey = dy / d;
    dx = px - xs; dy = py - ys; d = Math.pow(dx * dx + dy * dy, 1.5) + 1e-6; ex -= dx / d; ey -= dy / d;
    return [ex, ey];
  }
  function aimant2D(id, x, y, L, H) {
    return "<ellipse cx='" + (x + L / 2) + "' cy='" + (y + H + 6) + "' rx='" + (L * .55) + "' ry='7' fill='url(#" + id + "o)'/>" +
      "<rect x='" + x + "' y='" + y + "' width='" + (L / 2) + "' height='" + H + "' rx='5' fill='url(#" + id + "r)'/><rect x='" + (x + L / 2) + "' y='" + y + "' width='" + (L / 2) + "' height='" + H + "' rx='5' fill='url(#" + id + "b)'/>" +
      "<rect x='" + (x + 6) + "' y='" + (y + 4) + "' width='" + (L - 12) + "' height='" + (H * .22) + "' rx='3' fill='#fff' opacity='.32'/>" +
      txt(x + L / 4, y + H / 2 + 7, "N", { s: 20, c: "#fff", w: 800 }) + txt(x + 3 * L / 4, y + H / 2 + 7, "S", { s: 20, c: "#fff", w: 800 });
  }
  function defsAimant(id) { return lin(id + "r", ["#F2836B", "#D9472B", "#9E2A14"], true) + lin(id + "b", ["#6E9BEA", "#1E499B", "#0E2A62"], true) + omb(id + "o"); }
  function boussole2D(x, y, ang, r) {
    r = r || 13;
    return "<g transform='translate(" + x + " " + y + ")'><circle r='" + (r + 2) + "' fill='#C9CFDD'/><circle r='" + r + "' fill='#FDFCF7' stroke='#8E96A6'/><g transform='rotate(" + ang.toFixed(1) + ")'><path d='M0 " + (-r + 2) + "L3.6 0L-3.6 0Z' fill='" + ROUGE + "'/><path d='M0 " + (r - 2) + "L3.6 0L-3.6 0Z' fill='#5C6478'/></g><circle r='1.8' fill='" + NUIT + "'/></g>";
  }
  var PLANCHE_SPECTRE = (function () {
    var id = "ai1", W = 640, H = 330, xn = 250, xs = 390, y0 = 165, s = "", R = alea(20261117), i;
    s += "<rect x='12' y='12' width='616' height='306' rx='14' fill='#F7F3EA' stroke='#E3DCCB'/>";
    for (i = 0; i < 2300; i++) {
      var px = 24 + R() * 592, py = 24 + R() * 282;
      if ((px > 222 && px < 418 && py > 141 && py < 189) || (py < 46 && px > 130 && px < 510)) continue;
      var e = champ(px, py, xn, y0, xs, y0), n = Math.sqrt(e[0] * e[0] + e[1] * e[1]), l = 3.2 + Math.min(4.5, n * 9000), ux = e[0] / n, uy = e[1] / n;
      var op = Math.max(0.18, Math.min(0.95, n * 26000));
      s += "<path d='M" + (px - ux * l).toFixed(1) + " " + (py - uy * l).toFixed(1) + "L" + (px + ux * l).toFixed(1) + " " + (py + uy * l).toFixed(1) + "' stroke='#2E2F36' stroke-opacity='" + op.toFixed(2) + "' stroke-width='1.3' stroke-linecap='round'/>";
    }
    s += aimant2D(id, 222, 141, 196, 48);
    [[120, 70], [520, 70], [320, 60], [120, 262], [520, 262], [320, 272], [70, 165], [570, 165]].forEach(function (p) {
      var e = champ(p[0], p[1], xn, y0, xs, y0); s += boussole2D(p[0], p[1], Math.atan2(e[1], e[0]) * 180 / Math.PI + 90, 14);
    });
    s += "<rect x='130' y='16' width='380' height='24' rx='12' fill='#fff' fill-opacity='.92' stroke='#E3DCCB'/>" + txt(320, 33, "Limaille de fer saupoudrée sur un carton posé sur l'aimant", { s: 12.5, c: GRIS, w: 600 });
    return svg(W, H, "Spectre magnétique d un aimant droit : la limaille de fer dessine des lignes qui vont du pôle Nord au pôle Sud ; les aiguilles des boussoles suivent ces lignes", defsAimant(id), s);
  })();

  function aimant3D() {
    var o = [], xn = -55, xs = 55, k;
    o.push({ f: "boite", c: [0, -6, 0], d: [470, 10, 320], coul: "#7A4A22", dessus: "#A8703A" });
    o.push({ f: "boite", c: [-45, 2, 0], d: [90, 22, 34], coul: "#D9472B", div: false });
    o.push({ f: "boite", c: [45, 2, 0], d: [90, 22, 34], coul: "#1E499B", div: false });
    for (k = 0; k < 12; k++) {
      var a = 2 * Math.PI * k / 12, cx = 150 * Math.cos(a), cz = 110 * Math.sin(a), e = champ(cx, cz, xn, 0, xs, 0), n = Math.sqrt(e[0] * e[0] + e[1] * e[1]), ux = e[0] / n, uz = e[1] / n, L = 15, w = 4, h = 9, ec = [0, 34, 0];
      o.push({ f: "cylindre", c: [cx, 0, cz], r: 19, h: 6, n: 20, coul: "#B08D57", dessus: "#FBF6E9", ec: ec });
      o.push({ f: "poly", pts: [[cx + ux * L, h, cz + uz * L], [cx - uz * w, h, cz + ux * w], [cx + uz * w, h, cz - ux * w]], coul: "#D9472B", ec: ec });
      o.push({ f: "poly", pts: [[cx - ux * L, h, cz - uz * L], [cx + uz * w, h, cz - ux * w], [cx - uz * w, h, cz + ux * w]], coul: "#E8ECF1", ec: ec });
      o.push({ f: "cylindre", c: [cx, h, cz], r: 2, h: 1.5, n: 8, coul: "#B08D57", ec: ec });
    }
    [[-150, 0, 120], [170, 0, -120], [0, 0, 140]].forEach(function (p, i) { o.push({ f: "cylindre", c: p, r: 2.2, h: 40, n: 6, axe: "x", coul: "#7F8794" }); });
    return o;
  }

  remplacer("4e-pct-aimants", {
    c: "4e", m: "pct", titre: "Les aimants et leurs pôles", duree: 30,
    accroche: "Une clé perdue dans le sable du chantier et un aimant sans lettres : la physique mène l'enquête.",
    intro: "Une clé tombée dans un tas de sable te sert de fil rouge : à chaque partie, un indice te permet de trancher entre quatre idées.",
    objectifs: ["nommer les deux pôles d'un aimant et les repérer avec une boussole", "énoncer les règles d'attraction et de répulsion", "décrire le champ magnétique et son spectre", "citer les matériaux attirés par un aimant"],
    enquete: {
      titre: "La clé du portail dans le tas de sable",
      svg: (function () {
        var id = "aisc", R = alea(77), s = "<rect width='640' height='230' fill='#EAF4FB'/><rect y='150' width='640' height='80' fill='#E9D6AE'/>";
        s += "<path d='M140 160C200 70 330 60 420 160Z' fill='#DCC08A'/><path d='M160 160C220 92 320 86 400 160' fill='none' stroke='#C9A86B' stroke-width='2'/>";
        for (var i = 0; i < 60; i++) { var x = 170 + R() * 230, y = 115 + R() * 42; if ((x - 285) * (x - 285) / 12000 + (y - 160) * (y - 160) / 2600 > 1) continue; s += R() < .5 ? "<path d='M" + x.toFixed(0) + " " + y.toFixed(0) + "l" + (6 + R() * 6).toFixed(0) + " " + (R() * 6 - 3).toFixed(0) + "' stroke='#5D646F' stroke-width='2' stroke-linecap='round'/>" : "<circle cx='" + x.toFixed(0) + "' cy='" + y.toFixed(0) + "' r='2.6' fill='" + (R() < .5 ? "#B8432C" : "#A7AEB9") + "'/>"; }
        s += "<g transform='translate(300 128) rotate(-18)'><circle r='7' fill='none' stroke='#8E96A6' stroke-width='3'/><rect x='6' y='-3' width='26' height='6' rx='2' fill='#D9B23A'/><rect x='24' y='3' width='5' height='5' fill='#D9B23A'/></g>";
        s += "<rect x='470' y='60' width='14' height='100' fill='#7A5230'/><path d='M462 60h90v12h-90z' fill='#8E96A6'/>";
        s += "<g transform='translate(470 120)'>" + aimant2D(id, 0, 0, 70, 20).replace(/>N</, ">?<").replace(/>S</, ">?<") + "</g>";
        s += txt(285, 205, "sable mêlé de clous, de capsules et de fils de cuivre", { s: 12, c: "#6D4A00", w: 600 }) + txt(505, 52, "aimant du vieux haut-parleur", { s: 11.5, c: NUIT, w: 600 });
        s += "<path d='M296 112l-6-26' stroke='#C2540A' stroke-width='1.5' marker-end='url(#aiscf)'/>" + txt(286, 80, "la clé", { s: 12, c: "#C2540A" });
        return svg(640, 230, "Un tas de sable de chantier mêlé de clous et de capsules ; une clé dorée au porte-clés en acier y est tombée ; un aimant sans marques attend", defsAimant(id) + fleche("aiscf", "#C2540A"), s);
      })(),
      legende: "Au quartier Tamdja, à Bafoussam : le tas de sable du chantier de l'oncle Kamga, devant le portail.",
      contexte: "<p>Junior a laissé tomber la <strong>clé du cadenas du portail</strong> dans le tas de sable du chantier de son oncle. Le sable est plein de clous, de capsules de bouteilles et de bouts de fil électrique. La clé est dorée (en <strong>laiton</strong>, un alliage de cuivre et de zinc) et pend à un petit <strong>anneau en acier</strong>.</p><p>Son cousin Arnaud démonte un vieux haut-parleur et en sort un <strong>aimant</strong> puissant… dont les lettres N et S sont effacées. Ce soir, l'oncle veut aussi s'en servir comme boussole de secours pour orienter la future fenêtre vers le nord.</p>",
      documents: [
        { t: "Ce qu'il y a dans le sable", html: "<table class='donnees'><tr><th>Objet</th><th>Matériau</th></tr><tr><td>clous</td><td>fer</td></tr><tr><td>capsules de bouteilles</td><td>acier (fer + carbone)</td></tr><tr><td>bouts de fil électrique</td><td>cuivre</td></tr><tr><td>canette écrasée</td><td>aluminium</td></tr><tr><td>clé</td><td>laiton (cuivre + zinc)</td></tr><tr><td>anneau de la clé</td><td>acier</td></tr></table>" },
        { t: "La boussole de l'oncle", html: "<p>Une boussole est une petite <strong>aiguille aimantée</strong> qui tourne librement sur un pivot. Loin de tout aimant, son extrémité colorée (pôle Nord de l'aiguille) indique le <strong>nord géographique</strong>.</p>" }
      ],
      question: "L'aimant peut-il sortir la clé du sable, et comment retrouver son pôle Nord sans les lettres ?",
      tache: "Explique à Junior et Arnaud, en huit lignes, ce que l'aimant va ramener, pourquoi, et comment identifier ses pôles.",
      hypotheses: [
        "Un aimant attire tous les métaux : il ramènera la clé directement.",
        "La clé est en laiton : elle n'est pas attirée, elle est perdue.",
        "La clé n'est pas attirée, mais son anneau en acier l'est : l'aimant ramènera la clé par l'anneau.",
        "Sans les lettres, on ne peut plus savoir où est le pôle Nord de l'aimant."
      ]
    },
    parties: [
      { t: "Deux pôles, toujours", html:
        "<div class='def'><b>Définition</b>Tout aimant possède deux <strong>pôles</strong> : le <strong>pôle Nord</strong> et le <strong>pôle Sud</strong>. C'est près des pôles que l'action de l'aimant est la plus forte : les clous s'y accrochent en grappes.</div>" +
        "<p>Si on casse un aimant, on n'isole jamais un pôle : chaque morceau redevient un aimant complet, avec son pôle Nord et son pôle Sud.</p>" +
        "<div class='methode'><b>Retrouver le pôle Nord d'un aimant sans marques</b><ol><li>Suspends l'aimant par son milieu à un fil, loin de tout objet en fer.</li><li>Attends qu'il s'immobilise : il s'oriente comme une boussole.</li><li>L'extrémité tournée vers le <strong>nord géographique</strong> est son <strong>pôle Nord</strong>.</li></ol></div>" +
        "<div class='savais'><b>Le savais-tu ?</b>La Terre elle-même se comporte comme un énorme aimant. C'est pour cela qu'une aiguille aimantée, partout au Cameroun, montre le nord.</div>",
        fil: { html: "<p>Arnaud attache l'aimant à un fil de pêche, au milieu de la cour, loin du chantier. Après quelques oscillations, il s'arrête : une extrémité regarde vers Bamenda, au nord. C'est le <strong>pôle Nord</strong>. Il le marque au feutre rouge. Les lettres effacées n'étaient pas un problème.</p>", verdicts: [[3, "rejetee", "L'aimant suspendu s'oriente comme une boussole : son extrémité tournée vers le nord est son pôle Nord."]] },
        retenir: "Un aimant a toujours deux pôles ; suspendu, son pôle Nord indique le nord géographique." },

      { t: "Attraction et répulsion", html:
        "<ul><li>Deux pôles de <strong>même nom</strong> se <strong>repoussent</strong> (Nord-Nord, Sud-Sud).</li><li>Deux pôles de <strong>noms différents</strong> s'<strong>attirent</strong> (Nord-Sud).</li></ul>" +
        "<div class='prop'><b>Règle</b>L'aiguille d'une boussole est un petit aimant : son pôle Nord est <strong>attiré</strong> par le pôle Sud d'un aimant et <strong>repoussé</strong> par son pôle Nord.</div>" +
        "<div class='astuce'><b>Contrôle du marquage</b>Approche l'extrémité marquée en rouge de la boussole : si le bout coloré de l'aiguille <strong>s'enfuit</strong>, c'est bien un pôle Nord.</div>" +
        "<div class='attention'><b>Piège</b>L'attraction ne prouve rien : un aimant attire aussi un clou non aimanté. Seule la <strong>répulsion</strong> prouve qu'un objet est un aimant, et permet d'identifier ses pôles.</div>",
        fil: { html: "<p>Arnaud approche le bout marqué de la boussole de l'oncle : le bout coloré de l'aiguille <strong>recule</strong>. Répulsion Nord-Nord : le marquage est confirmé. Il retourne l'aimant : l'aiguille se précipite vers l'autre extrémité, le pôle Sud.</p>" },
        retenir: "Pôles de même nom : répulsion ; pôles de noms différents : attraction." },

      { t: "Le champ magnétique et son spectre", html:
        "<div class='def'><b>Champ magnétique</b>Autour d'un aimant, il existe une région où une aiguille aimantée subit une action : c'est le <strong>champ magnétique</strong>. En chaque point, l'aiguille s'oriente selon une direction bien précise.</div>" +
        "<p>Saupoudre de la <strong>limaille de fer</strong> sur un carton posé sur l'aimant et tapote : les grains s'alignent et dessinent des <strong>lignes de champ</strong>. Ce dessin s'appelle le <strong>spectre magnétique</strong>.</p>" +
        "<div class='prop'><b>Lignes de champ</b>Elles sortent par le <strong>pôle Nord</strong> et rentrent par le <strong>pôle Sud</strong> ; elles se resserrent près des pôles, là où le champ est le plus intense.</div>",
        planches: [
          { type: "2D", titre: "Le spectre magnétique d'un aimant droit", legende: "Les grains de limaille s'alignent en lignes courbes qui vont d'un pôle à l'autre ; ils sont plus serrés et plus nombreux près des pôles. Chaque boussole s'aligne sur la ligne qui passe par elle.", svg: PLANCHE_SPECTRE },
          { type: "3d", titre: "Douze boussoles autour de l'aimant", legende: "Tourne la table : chaque aiguille (rouge = pôle Nord) suit la ligne de champ qui passe par elle. Le curseur soulève les boussoles pour mieux voir leurs aiguilles.",
            modele: { h: 360, rx: -38, ry: 18, echelle: 0.95, alt: "Aimant droit rouge et bleu entouré de douze boussoles sur une table en bois", eclate: "Soulever les boussoles", jouer: "Soulever", objets: aimant3D(),
              etiquettes: [{ p: [-80, 14, 0], t: "Pôle Nord" }, { p: [80, 14, 0], t: "Pôle Sud", cote: "d" }, { p: [150, 10, 0], t: "Boussole", cote: "d", ec: [0, 34, 0] }] } }
        ],
        fil: { html: "<p>Le champ est le plus fort près des pôles : pour « pêcher » dans le sable, Arnaud plongera donc une <strong>extrémité</strong> de l'aimant, et non son milieu. Il l'emballe d'abord dans un sachet plastique : les objets attirés se détacheront d'un coup quand il retirera le sachet.</p>" },
        retenir: "Lignes de champ : du pôle Nord au pôle Sud, serrées près des pôles." },

      { t: "Ce que l'aimant attire", html:
        "<p>Un aimant attire le <strong>fer</strong>, l'<strong>acier</strong> (fer + carbone), le <strong>nickel</strong> et le <strong>cobalt</strong> : ce sont des matériaux <strong>ferromagnétiques</strong>. Il n'attire ni le cuivre, ni l'aluminium, ni le laiton, ni l'or, ni le bois, ni le plastique.</p>",
        planches: [{ type: "2D", titre: "Le tri du sable du chantier", legende: "Côté gauche, ce que l'aimant ramène : clous, capsules et la clé, tirée par son anneau en acier. Côté droit, ce qui reste dans le sable : fils de cuivre et canette en aluminium.", svg: (function () {
          var id = "ai3", s = "<rect x='14' y='14' width='300' height='242' rx='14' fill='#EEF8F1' stroke='#9FD3B3'/><rect x='326' y='14' width='300' height='242' rx='14' fill='#FCEDEA' stroke='#E9AFA4'/>";
          s += txt(164, 40, "Attiré", { s: 15, c: VERT }) + txt(476, 40, "Pas attiré", { s: 15, c: "#A31238" });
          s += "<g transform='translate(110 62)'>" + aimant2D(id, 0, 0, 108, 30) + "</g>";
          [[124, 100, 86], [144, 102, 92], [164, 100, 88], [184, 102, 95]].forEach(function (c) { s += "<g transform='translate(" + c[0] + " " + c[1] + ") rotate(" + c[2] + ")'><rect x='-1' y='-2' width='36' height='4' rx='2' fill='#6E7684'/><rect x='-5' y='-4' width='6' height='8' rx='1' fill='#5D646F'/></g>"; });
          s += "<g transform='translate(204 112)'><circle r='12' fill='url(#" + id + "cap)'/><circle r='9' fill='none' stroke='#8E96A6' stroke-dasharray='2 2'/></g>";
          s += "<g transform='translate(130 172) rotate(70)'><circle r='8' fill='none' stroke='#7F8794' stroke-width='3.4'/><rect x='7' y='-4' width='40' height='8' rx='2' fill='url(#" + id + "lai)'/><rect x='34' y='4' width='7' height='7' fill='#C9A12F'/><rect x='42' y='4' width='5' height='5' fill='#C9A12F'/></g>";
          s += txt(164, 236, "clous (fer) · capsule (acier) · anneau (acier)", { s: 11, w: 600, c: VERT });
          s += "<g transform='translate(380 110)'><path d='M0 0c20-20 40 20 60 0s40 20 60 0' fill='none' stroke='#C46A2B' stroke-width='5' stroke-linecap='round'/><path d='M10 40c20-14 40 14 60 0' fill='none' stroke='#C46A2B' stroke-width='5' stroke-linecap='round'/></g>";
          s += "<g transform='translate(520 140)'><rect x='-26' y='-38' width='52' height='76' rx='10' fill='url(#" + id + "alu)'/><path d='M-26 -6l52 14' stroke='#8E96A6' stroke-width='2'/><rect x='-12' y='-46' width='24' height='8' rx='3' fill='#A7AEB9'/></g>";
          s += txt(476, 236, "fils (cuivre) · canette (aluminium) · clé seule (laiton)", { s: 11, w: 600, c: "#A31238" });
          return svg(640, 270, "Tri des objets du sable : clous, capsule et anneau d acier attirés ; fils de cuivre et canette en aluminium non attirés", defsAimant(id) + rad(id + "cap", ["#F2F4F7", "#BFC5CF", "#7F8794"]) + lin(id + "lai", ["#F5D77A", "#D9B23A", "#9C7A16"], true) + lin(id + "alu", ["#E6EAF0", "#B9C0CB", "#8992A0"]), s);
        })() }],
        fil: { html: "<p>D'après le document 1, le laiton contient du cuivre et du zinc : la clé seule ne serait <strong>pas</strong> attirée. Mais son anneau est en <strong>acier</strong> : il colle à l'aimant et remonte la clé avec lui. Les clous et les capsules montent aussi ; les fils de cuivre et la canette restent dans le sable.</p>", verdicts: [[0, "rejetee", "Le cuivre, l'aluminium et le laiton ne sont pas attirés."], [1, "rejetee", "La clé n'est pas attirée, mais son anneau en acier l'est."], [2, "validee", "L'anneau en acier est attiré et ramène la clé."]] },
        retenir: "Attirés : fer, acier, nickel, cobalt. Pas attirés : cuivre, aluminium, laiton, bois, plastique." }
    ],
    denouement: {
      titre: "La clé remonte, accrochée par son anneau",
      etapes: [
        "Aimant suspendu : l'extrémité tournée vers le nord est son pôle Nord (indice 1).",
        "Répulsion avec le bout coloré de la boussole : le marquage est confirmé (indice 2).",
        "On pêche avec une extrémité, là où le champ est le plus fort (indice 3).",
        "Laiton non attiré, anneau en acier attiré : la clé remonte par l'anneau (indice 4)."
      ],
      reponse: "<p>Pour retrouver les pôles, on suspend l'aimant par son milieu loin de tout objet en fer : il s'oriente comme une boussole, et l'extrémité tournée vers le nord géographique est son pôle Nord. La répulsion avec le bout coloré de l'aiguille de la boussole le confirme, car deux pôles de même nom se repoussent. Pour fouiller le sable, on plonge une extrémité de l'aimant, emballée dans un sachet, car le champ magnétique est le plus intense près des pôles. La clé, en laiton (cuivre et zinc), n'est pas attirée ; mais son anneau en acier l'est : l'aimant ramène donc la clé par son anneau, avec les clous et les capsules, tandis que les fils de cuivre et la canette en aluminium restent dans le sable.</p>",
      transfert: "<p>Au marché Central de Yaoundé, un ferrailleur doit séparer, dans un tas de déchets, les boîtes de conserve (acier) des canettes de boisson (aluminium). Propose-lui un procédé en trois lignes et justifie-le.</p>"
    },
    revision: [
      "Deux pôles : <strong>Nord</strong> et <strong>Sud</strong> ; un aimant cassé redonne deux aimants complets.",
      "Suspendu, le pôle Nord d'un aimant indique le <strong>nord géographique</strong>.",
      "Même nom : <strong>répulsion</strong> ; noms différents : <strong>attraction</strong>.",
      "Seule la répulsion prouve qu'un objet est un aimant.",
      "<strong>Champ magnétique</strong> : lignes du pôle Nord au pôle Sud, serrées près des pôles (spectre de limaille).",
      "Attirés : <strong>fer, acier, nickel, cobalt</strong> ; pas le cuivre, l'aluminium, le laiton."
    ],
    exo: "<p>Tu disposes de deux barres métalliques identiques : l'une est un aimant, l'autre une simple barre de fer. Sans aucun autre objet, comment savoir laquelle est l'aimant ? <em>(Pose l'extrémité de la barre A sur le milieu de la barre B : s'il y a attraction, A est l'aimant, car le milieu d'un aimant n'attire presque rien.)</em></p>",
    quiz: [
      q("Deux pôles Sud face à face…", "se repoussent", "s'attirent", "ne font rien", "Même nom : répulsion."),
      q("Lequel est attiré par un aimant ?", "Une capsule de bouteille en acier", "Une canette en aluminium", "Une clé en laiton", "L'acier contient du fer."),
      q("On casse un aimant en deux. Chaque morceau a…", "deux pôles", "un seul pôle", "aucun pôle", "Chaque morceau est un aimant complet."),
      q("Un aimant suspendu par son milieu s'oriente…", "son pôle Nord vers le nord", "son pôle Nord vers le sud", "au hasard", "Il se comporte comme une boussole."),
      q("Le bout coloré d'une aiguille de boussole recule devant une extrémité d'aimant : cette extrémité est…", "un pôle Nord", "un pôle Sud", "non aimantée", "Le bout coloré est un pôle Nord : répulsion Nord-Nord."),
      q("Quelle observation prouve qu'un objet est un aimant ?", "une répulsion", "une attraction", "sa couleur", "Un clou est attiré sans être un aimant."),
      q("Les lignes de champ d'un aimant droit…", "sortent du pôle Nord et rentrent par le pôle Sud", "sortent du pôle Sud", "sont des droites parallèles", "C'est la convention."),
      q("Où le champ d'un aimant droit est-il le plus intense ?", "près des pôles", "au milieu", "loin de l'aimant", "La limaille s'y accumule."),
      q("La limaille de fer sur un carton permet d'obtenir…", "le spectre magnétique", "la masse de l'aimant", "le courant électrique", "Les grains s'alignent sur les lignes de champ."),
      q("Une clé en laiton accrochée à un anneau en acier…", "est ramenée par l'anneau", "est attirée directement", "ne peut jamais être ramenée", "Le laiton n'est pas attiré, l'acier l'est.")
    ]
  });

  /* ═══════════════════════ Tle D SVT — LES ÉCHANGES D'EAU (OSMOSE) ═══════════════════════ */
  function globule(id, x, y, k, lab) {
    /* k = 1 normal, k > 1 gonflé (sphérique), k = 0 éclaté (fantôme), k < 1 ratatiné (crénelé) */
    var s = "<g transform='translate(" + x + " " + y + ")'><ellipse cy='46' rx='42' ry='6' fill='url(#" + id + "o)'/>";
    if (k === 0) {
      s += "<circle r='38' fill='#F6C9C0' fill-opacity='.35' stroke='#C26A5A' stroke-width='1.6' stroke-dasharray='5 5'/>";
      for (var i = 0; i < 9; i++) { var a = i * 0.7; s += "<circle cx='" + (52 * Math.cos(a)).toFixed(1) + "' cy='" + (52 * Math.sin(a)).toFixed(1) + "' r='2.4' fill='#C2412F' opacity='.6'/>"; }
    } else if (k < 1) {
      var d = "";
      for (var j = 0; j <= 28; j++) { var b = 2 * Math.PI * j / 28, r = (j % 2 ? 22 : 29); d += (j ? "L" : "M") + (r * Math.cos(b) * 1.15).toFixed(1) + " " + (r * Math.sin(b)).toFixed(1); }
      s += "<path d='" + d + "Z' fill='url(#" + id + "g)' stroke='#9E2A14' stroke-width='1.5' stroke-linejoin='round'/>";
    } else if (k > 1) {
      s += "<circle r='40' fill='url(#" + id + "g)' stroke='#B4321E' stroke-width='1.6'/><ellipse cx='-12' cy='-14' rx='12' ry='7' fill='#fff' opacity='.35'/>";
    } else {
      s += "<ellipse rx='40' ry='30' fill='url(#" + id + "g)' stroke='#B4321E' stroke-width='1.6'/><ellipse rx='20' ry='12' fill='#C2412F' opacity='.45'/><ellipse cx='-14' cy='-14' rx='11' ry='5' fill='#fff' opacity='.4'/>";
    }
    return s + txt(0, 72, lab[0], { s: 12.5, c: NUIT }) + txt(0, 88, lab[1], { s: 11, w: 500, c: GRIS }) + "</g>";
  }
  function cellule3D() {
    var o = [];
    o.push({ f: "boite", c: [0, -8, 0], d: [520, 8, 220], coul: "#DDE4EE", dessus: "#EEF2F7" });
    /* cellule turgescente (à gauche) */
    o.push({ f: "boite", c: [-125, 0, 0], d: [190, 110, 120], coul: "#4CAF50", op: 0.18, div: false, ec: [0, 120, 0] });
    o.push({ f: "sphere", c: [-125, 55, 0], r: [86, 50, 54], n: 28, m: 16, coul: "#8E3B8C", op: 0.7 });
    o.push({ f: "sphere", c: [-195, 30, 30], r: 13, coul: "#6B4C9A" });
    /* cellule plasmolysée (à droite) */
    o.push({ f: "boite", c: [125, 0, 0], d: [190, 110, 120], coul: "#4CAF50", op: 0.18, div: false, ec: [0, 120, 0] });
    o.push({ f: "sphere", c: [125, 50, 0], r: [62, 38, 40], n: 28, m: 16, coul: "#BFE6B8", op: 0.45 });
    o.push({ f: "sphere", c: [125, 50, 0], r: [36, 24, 26], n: 24, m: 14, coul: "#5E1F5C", op: 0.85 });
    o.push({ f: "sphere", c: [85, 45, 22], r: 10, coul: "#6B4C9A" });
    return o;
  }
  var PLANCHE_FRITES = (function () {
    var id = "os4", X = function (c) { return 70 + c / 0.6 * 520; }, Y = function (p) { return 160 - p * 10.5; }, s = "", P = [[0, 12], [0.1, 7.5], [0.2, 3.2], [0.3, -0.6], [0.4, -4.1], [0.5, -8], [0.6, -11]], i;
    for (i = 0; i <= 6; i++) s += "<path d='M" + X(i / 10) + " 30V292' stroke='#E3E8F1'/>" + txt(X(i / 10), 310, String(i / 10).replace(".", ","), { s: 11, w: 500, c: GRIS });
    for (i = -12; i <= 12; i += 4) s += "<path d='M70 " + Y(i) + "H600' stroke='#E3E8F1'/>" + txt(62, Y(i) + 4, (i > 0 ? "+" : i < 0 ? "−" : "") + Math.abs(i), { s: 11, w: 500, c: GRIS, a: "end" });
    s += "<path d='M70 " + Y(0) + "H604' stroke='" + NUIT + "' stroke-width='1.6' marker-end='url(#" + id + "f)'/><path d='M70 296V24' stroke='" + NUIT + "' stroke-width='1.6' marker-end='url(#" + id + "f)'/>";
    s += "<rect x='70' y='30' width='" + (X(0.28) - 70) + "' height='" + (Y(0) - 30) + "' fill='#DCEBFF' opacity='.55'/><rect x='" + X(0.28) + "' y='" + Y(0) + "' width='" + (600 - X(0.28)) + "' height='" + (292 - Y(0)) + "' fill='#FCE4E0' opacity='.55'/>";
    s += txt(160, 52, "milieu hypotonique : la frite gagne de l'eau", { s: 11.5, c: BLEU, a: "start" }) + txt(360, 270, "milieu hypertonique : elle en perd", { s: 11.5, c: "#A31238", a: "start" });
    s += "<path d='M" + X(-0.0) + " " + Y(11.5) + "L" + X(0.6) + " " + Y(-11.3) + "' stroke='#C2540A' stroke-width='2.4' stroke-dasharray='7 5'/>";
    P.forEach(function (p) { s += "<circle cx='" + X(p[0]) + "' cy='" + Y(p[1]) + "' r='5.5' fill='" + BLEU + "' stroke='#fff' stroke-width='1.6'/>"; });
    s += "<circle cx='" + X(0.28) + "' cy='" + Y(0) + "' r='8' fill='none' stroke='#C2540A' stroke-width='2.4'/><path d='M" + X(0.28) + " " + Y(0) + "V292' stroke='#C2540A' stroke-dasharray='4 4'/>" + txt(X(0.28) + 6, 286, "≈ 0,28 mol/L", { s: 12.5, c: "#C2540A", a: "start" });
    s += txt(335, 330, "concentration de la solution de saccharose (mol/L)", { s: 12, c: NUIT }) + "<text transform='translate(22 160) rotate(-90)' text-anchor='middle' font-size='12' font-weight='700' fill='" + NUIT + "'>variation de masse (%)</text>";
    return svg(640, 340, "Graphique : la variation de masse des frites de pomme de terre diminue quand la concentration augmente et s annule vers 0,28 mol par litre", fleche(id + "f", NUIT), s);
  })();

  remplacer("tle-svt-osmose", {
    c: "Tle D", m: "svt", titre: "Les échanges d'eau entre la cellule et son milieu", duree: 35,
    accroche: "De l'eau distillée dans une perfusion ? L'infirmière-major dit non. Les légumes du marché expliquent pourquoi.",
    intro: "Un stage à l'hôpital et un étal du marché te servent de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées.",
    objectifs: ["définir l'osmose et les milieux hypo-, iso- et hypertoniques", "prévoir et expliquer le comportement d'une cellule animale (hémolyse)", "décrire turgescence et plasmolyse d'une cellule végétale", "déterminer expérimentalement la concentration isotonique d'un tissu"],
    enquete: {
      titre: "La perfusion et les légumes de Sandaga",
      svg: (function () {
        var id = "ossc", s = "<rect width='640' height='220' fill='#F3F8FC'/><rect x='0' y='170' width='640' height='50' fill='#E4E9F0'/>";
        s += "<rect x='60' y='30' width='6' height='150' fill='#9AA3B2'/><path d='M40 30h50' stroke='#9AA3B2' stroke-width='5'/><rect x='70' y='38' width='40' height='64' rx='8' fill='url(#" + id + "fl)' stroke='#8EA9C1'/><path d='M90 102v40c0 20 40 20 40 40' fill='none' stroke='#8EA9C1' stroke-width='3'/>" + txt(90, 72, "?", { s: 22, c: BLEU });
        s += "<rect x='140' y='120' width='70' height='14' rx='4' fill='#C7D3E3'/>" + txt(175, 156, "perfusion", { s: 11.5, c: GRIS, w: 600 });
        s += "<rect x='330' y='118' width='260' height='16' rx='3' fill='#A97D50'/><path d='M350 134v40M570 134v40' stroke='#8E6A3E' stroke-width='7'/>";
        [0, 1, 2, 3].forEach(function (i) { var x = 360 + i * 32; s += "<path d='M" + x + " 118c-6-40 4-62 10-70c6 8 16 30 10 70Z' fill='" + (i % 2 ? "#2E8B3E" : "#3FA34D") + "' stroke='#1C6B2A'/>"; });
        s += "<g fill='#5A9BD8' opacity='.8'><circle cx='370' cy='40' r='2.5'/><circle cx='392' cy='30' r='2'/><circle cx='410' cy='44' r='2.5'/><circle cx='430' cy='34' r='2'/></g>";
        [0, 1, 2].forEach(function (i) { var x = 510 + i * 22; s += "<ellipse cx='" + x + "' cy='110' rx='10' ry='7' fill='#D9F0C8' stroke='#7DAA55' transform='rotate(" + (i * 20 - 15) + " " + x + " 110)'/>"; });
        s += "<g fill='#fff' stroke='#C9CFDD'><circle cx='520' cy='92' r='2'/><circle cx='534' cy='86' r='1.6'/><circle cx='546' cy='94' r='2'/></g>";
        s += txt(400, 205, "ndolè aspergé d'eau", { s: 11.5, c: "#1C6B2A", w: 600 }) + txt(535, 205, "concombre salé", { s: 11.5, c: "#5B7A2E", w: 600 });
        return svg(640, 220, "À gauche, une perfusion avec un flacon d eau distillée ; à droite, un étal du marché : bottes de ndolè aspergées d eau et tranches de concombre salées", lin(id + "fl", ["#EAF4FB", "#CFE3F3"], true), s);
      })(),
      legende: "À Douala : le service de pédiatrie de l'hôpital Laquintinie, puis l'étal de la mère de Brenda au marché Sandaga.",
      contexte: "<p>Brenda, élève infirmière en stage à l'hôpital Laquintinie, doit poser une perfusion à un enfant déshydraté. Le flacon de <strong>sérum physiologique</strong> est fini ; elle propose de le remplacer par de l'<strong>eau distillée</strong>, « puisque c'est l'eau la plus pure ». L'infirmière-major l'arrête net : « Tu veux faire éclater ses globules rouges ? »</p><p>Le soir, au marché Sandaga, Brenda voit sa mère <strong>asperger d'eau</strong> ses bottes de ndolè pour qu'elles restent fermes, tandis que la voisine <strong>sale</strong> des tranches de concombre qui ramollissent et rendent leur eau.</p>",
      documents: [
        { t: "L'étiquette du sérum physiologique", html: "<p>Solution de chlorure de sodium à <strong>9 g/L</strong> (0,9 %), stérile, pour perfusion. <em>Même concentration en substances dissoutes que le plasma sanguin.</em></p>" },
        { t: "Expérience des frites de pomme de terre (TP du lycée de Bonabéri)", html: "<table class='donnees'><tr><th>Saccharose (mol/L)</th><td>0</td><td>0,1</td><td>0,2</td><td>0,3</td><td>0,4</td><td>0,5</td><td>0,6</td></tr><tr><th>Variation de masse (%)</th><td>+12</td><td>+7,5</td><td>+3,2</td><td>−0,6</td><td>−4,1</td><td>−8</td><td>−11</td></tr></table><p>Frites de même taille pesées avant et après 1 h dans chaque solution.</p>" }
      ],
      question: "Pourquoi l'eau distillée serait-elle dangereuse dans le sang, alors que l'eau rend les légumes fermes et que le sel les ramollit ?",
      tache: "Rédige pour Brenda, en dix lignes, une explication unique valable pour le sang et pour les légumes, en t'appuyant sur les deux documents.",
      hypotheses: [
        "L'eau distillée, très pure, ne peut faire de mal à aucune cellule.",
        "Le sel « brûle » les légumes, comme le ferait un acide.",
        "L'eau traverse les membranes vers le milieu le plus concentré : trop d'eau fait éclater les globules rouges, et le sel retire l'eau des légumes."
      ]
    },
    parties: [
      { t: "L'osmose, un mouvement d'eau", html:
        "<div class='def'><b>Définition</b>L'<strong>osmose</strong> est le passage de l'<strong>eau</strong> à travers une membrane <strong>semi-perméable</strong> (perméable à l'eau, pas aux substances dissoutes), du milieu le <strong>moins concentré</strong> vers le milieu le <strong>plus concentré</strong>.</div>" +
        "<ul><li>Milieu <strong>hypotonique</strong> : moins concentré que la cellule → l'eau <strong>entre</strong>.</li><li>Milieu <strong>isotonique</strong> : même concentration → pas de mouvement net.</li><li>Milieu <strong>hypertonique</strong> : plus concentré → l'eau <strong>sort</strong>.</li></ul>" +
        "<div class='astuce'><b>Pour ne pas se tromper</b>L'eau « suit » les substances dissoutes : elle va là où il y en a le plus, comme pour les diluer.</div>",
        planches: [{ type: "2D", titre: "L'osmomètre de Dutrochet", legende: "Un entonnoir fermé par une membrane semi-perméable (boyau, cellophane) contient de l'eau sucrée ; il plonge dans de l'eau pure. L'eau entre dans l'entonnoir, plus concentré : le liquide monte dans le tube de h.", svg: (function () {
          var id = "os1", s = "";
          s += "<rect x='150' y='190' width='340' height='130' rx='10' fill='url(#" + id + "eau)' stroke='#8EA9C1' stroke-width='2'/><path d='M150 210H490' stroke='#fff' stroke-width='2' opacity='.6'/>";
          s += "<path d='M240 170L280 250H360L400 170Z' fill='url(#" + id + "suc)' stroke='#6D8299' stroke-width='2'/><rect x='312' y='40' width='16' height='132' fill='url(#" + id + "suc)' stroke='#6D8299' stroke-width='1.5'/><path d='M312 172v-132M328 172v-132' stroke='#6D8299'/>";
          s += "<path d='M240 170H312M328 170H400' stroke='#6D8299' stroke-width='2'/><rect x='278' y='248' width='84' height='6' rx='2' fill='#C2540A'/>";
          s += "<path d='M300 92H340' stroke='" + NUIT + "' stroke-dasharray='3 3'/><path d='M300 150H340' stroke='" + NUIT + "' stroke-dasharray='3 3'/><path d='M350 150V92' stroke='" + NUIT + "' stroke-width='1.5' marker-end='url(#" + id + "f)' marker-start='url(#" + id + "f)'/>" + txt(362, 126, "h", { s: 15, a: "start" });
          var R = alea(5); for (var i = 0; i < 26; i++) { var x = 270 + R() * 100, y = 186 + R() * 58; if (Math.abs(x - 320) > 40 + (y - 186) * -0.55 + 20) continue; s += "<circle cx='" + x.toFixed(0) + "' cy='" + y.toFixed(0) + "' r='3.2' fill='#E39B2E'/>"; }
          [[290, 300], [320, 304], [350, 300]].forEach(function (p) { s += "<path d='M" + p[0] + " " + p[1] + "L" + (320 + (p[0] - 320) * 0.4) + " 266' fill='none' stroke='" + BLEU + "' stroke-width='2.4' marker-end='url(#" + id + "b)'/>"; });
          s += txt(140, 250, "eau pure", { s: 12.5, c: BLEU, a: "end" }) + txt(420, 160, "eau sucrée", { s: 12.5, c: "#B8741A", a: "start" }) + txt(500, 214, "membrane", { s: 12, c: "#C2540A", a: "start" }) + txt(500, 230, "semi-perméable", { s: 12, c: "#C2540A", a: "start" }) + "<path d='M496 218L364 250' stroke='#C2540A'/>";
          s += "<g transform='translate(520 60)'><circle r='3.2' fill='#E39B2E'/>" + txt(10, 4, "saccharose", { s: 11, w: 500, a: "start", c: GRIS }) + "<path d='M-6 24h20' stroke='" + BLEU + "' stroke-width='2.2' marker-end='url(#" + id + "b)'/>" + txt(20, 28, "eau", { s: 11, w: 500, a: "start", c: GRIS }) + "</g>";
          return svg(640, 340, "Osmomètre : un entonnoir d eau sucrée fermé par une membrane plonge dans de l eau pure ; le niveau monte dans le tube", lin(id + "eau", ["#E2F1FB", "#BFDDF2"], true) + lin(id + "suc", ["#FFF4D6", "#F9DFA0"], true) + fleche(id + "f", NUIT) + fleche(id + "b", BLEU), s);
        })() }],
        fil: { html: "<p>L'eau distillée ne contient presque aucune substance dissoute : face à des cellules, elle est le milieu <strong>le plus hypotonique</strong> qui soit. L'eau va donc entrer massivement dans les cellules. « Pure » ne veut pas dire « sans danger ».</p>" },
        retenir: "Osmose : l'eau traverse la membrane du moins concentré vers le plus concentré." },

      { t: "La cellule animale : le globule rouge", html:
        "<p>Le globule rouge est en équilibre dans une solution de chlorure de sodium à environ <strong>9 g/L</strong> : elle est <strong>isotonique</strong> au plasma. C'est le sérum physiologique.</p>" +
        "<ul><li>En milieu <strong>hypotonique</strong>, l'eau entre : le globule gonfle, devient sphérique puis sa membrane se rompt et l'hémoglobine s'échappe : c'est l'<strong>hémolyse</strong>.</li><li>En milieu <strong>hypertonique</strong>, l'eau sort : le globule se <strong>ratatine</strong> et se hérisse (aspect crénelé).</li></ul>" +
        "<div class='attention'><b>À l'hôpital</b>Une perfusion doit toujours être <strong>isotonique</strong> au plasma (sérum physiologique à 9 g/L, sérum glucosé à 50 g/L). Une perfusion d'eau distillée provoquerait une hémolyse massive.</div>",
        planches: [{ type: "2D", titre: "Un globule rouge dans trois milieux", legende: "Vus au microscope : à 9 g/L, le disque biconcave est intact ; dans l'eau salée à 20 g/L, il se ratatine ; à 3 g/L, il gonfle en sphère ; dans l'eau distillée, il éclate et l'hémoglobine se répand.", svg: (function () {
          var id = "os2", s = "";
          s += globule(id, 90, 110, 0.5, ["20 g/L", "hypertonique"]) + globule(id, 245, 110, 1, ["9 g/L", "isotonique"]) + globule(id, 400, 110, 1.3, ["3 g/L", "hypotonique"]) + globule(id, 555, 110, 0, ["eau distillée", "hémolyse"]);
          s += "<path d='M40 30H600' stroke='url(#" + id + "dg)' stroke-width='10' stroke-linecap='round'/>" + txt(40, 22, "plus concentré", { s: 11, w: 600, a: "start", c: "#A31238" }) + txt(600, 22, "moins concentré", { s: 11, w: 600, a: "end", c: BLEU });
          return svg(640, 220, "Quatre globules rouges : ratatiné à 20 grammes par litre, normal à 9, gonflé à 3, éclaté dans l eau distillée", rad(id + "g", ["#F9B9AA", "#E25D45", "#B4321E", "#7A1A0C"]) + omb(id + "o") + lin(id + "dg", ["#E8394B", "#F2C2C9", "#CFE0FF", "#4F86E0"]), s);
        })() }],
        fil: { html: "<p>Injectée dans une veine, l'eau distillée dilue brutalement le plasma autour des globules rouges : l'eau y entre, ils gonflent et éclatent. L'infirmière-major a raison : il faut une solution <strong>isotonique</strong>, à 9 g/L.</p>", verdicts: [[0, "rejetee", "L'eau distillée est fortement hypotonique : elle fait éclater les globules rouges (hémolyse)."]] },
        retenir: "Globule rouge : hémolyse en milieu hypotonique, ratatinement en milieu hypertonique, intact à 9 g/L de NaCl." },

      { t: "La cellule végétale : turgescence et plasmolyse", html:
        "<p>La cellule végétale est entourée d'une <strong>paroi</strong> rigide de cellulose et contient une grande <strong>vacuole</strong>. La paroi l'empêche d'éclater.</p>" +
        "<ul><li>En milieu <strong>hypotonique</strong>, la vacuole se remplit et pousse le cytoplasme contre la paroi : la cellule est <strong>turgescente</strong>, ferme.</li><li>En milieu <strong>hypertonique</strong>, la vacuole se vide, le cytoplasme se rétracte et la membrane se décolle de la paroi : c'est la <strong>plasmolyse</strong> ; le tissu devient mou.</li></ul>" +
        "<div class='methode'><b>Observer la plasmolyse au microscope</b><ol><li>Prélève un fragment d'épiderme d'oignon rouge (vacuoles colorées).</li><li>Monte-le dans l'eau : cellules turgescentes, vacuoles violettes pleines.</li><li>Remplace l'eau par de l'eau très salée : en quelques minutes, les vacuoles se contractent et se décollent des parois.</li><li>Remets de l'eau pure : la turgescence revient (déplasmolyse).</li></ol></div>",
        planches: [{ type: "3d", titre: "Deux cellules d'épiderme d'oignon rouge", legende: "À gauche, une cellule turgescente : la vacuole violette remplit la cellule. À droite, une cellule plasmolysée : la vacuole s'est contractée et le cytoplasme s'est décollé de la paroi. Le curseur soulève les parois.",
          modele: { h: 360, rx: -26, ry: 24, echelle: 0.9, alt: "Deux cellules végétales en trois dimensions, l une turgescente, l autre plasmolysée", eclate: "Soulever les parois", jouer: "Soulever les parois", objets: cellule3D(),
            etiquettes: [{ p: [-125, 60, 0], t: "Vacuole pleine" }, { p: [-125, 112, 0], t: "Paroi (cellulose)", ec: [0, 120, 0] }, { p: [125, 50, 0], t: "Vacuole contractée", cote: "d" }, { p: [175, 70, 30], t: "Cytoplasme décollé", cote: "d" }] } }],
        labo: { type: "osmose", veg: true, c: 4 },
        fil: { html: "<p>L'eau aspergée sur le ndolè est hypotonique : elle entre dans les cellules des feuilles, les vacuoles se remplissent, les cellules deviennent <strong>turgescentes</strong> et les feuilles fermes. Le sel crée autour des tranches de concombre un milieu <strong>hypertonique</strong> : l'eau sort des cellules (c'est elle qui coule dans l'assiette), elles se plasmolysent, le concombre ramollit. Aucune « brûlure » : un simple mouvement d'eau.</p>", verdicts: [[1, "rejetee", "Le sel ne brûle pas : il rend le milieu hypertonique et l'eau quitte les cellules (plasmolyse)."], [2, "validee", "Une seule loi, l'osmose, explique la perfusion et les légumes."]] },
        retenir: "Cellule végétale : turgescence en milieu hypotonique, plasmolyse en milieu hypertonique." },

      { t: "Mesurer la concentration des cellules", html:
        "<p>On peut trouver la concentration du contenu des cellules d'un tissu en cherchant la solution dans laquelle il ne gagne ni ne perd d'eau.</p>" +
        "<div class='methode'><b>Exploiter l'expérience des frites</b><ol><li>Calcule pour chaque solution la variation de masse en % : (m<sub>finale</sub> − m<sub>initiale</sub>) ÷ m<sub>initiale</sub> × 100.</li><li>Trace la variation de masse en fonction de la concentration.</li><li>Lis la concentration pour laquelle la variation est <strong>nulle</strong> : c'est la concentration <strong>isotonique</strong> au contenu des cellules.</li></ol></div>",
        planches: [{ type: "2D", titre: "Variation de masse des frites selon la concentration", legende: "Les points du document 2 s'alignent presque. La droite coupe l'axe horizontal vers 0,28 mol/L : c'est la concentration du contenu des cellules de pomme de terre.", svg: PLANCHE_FRITES }],
        fil: { html: "<p>Sous 0,28 mol/L, les frites gagnent de l'eau (milieu hypotonique) ; au-dessus, elles en perdent (hypertonique). C'est la preuve chiffrée que le sens du mouvement d'eau ne dépend que de la <strong>différence de concentration</strong> entre la cellule et son milieu.</p>", verdicts: [[2, "validee", "Le gain ou la perte d'eau change de signe à la concentration isotonique."]] },
        retenir: "Concentration isotonique = celle pour laquelle la masse du tissu ne varie pas." }
    ],
    denouement: {
      titre: "Une seule loi pour la perfusion et les légumes",
      etapes: [
        "L'eau traverse les membranes du moins concentré vers le plus concentré (indice 1).",
        "Eau distillée : hypotonique, hémolyse des globules rouges ; d'où le sérum à 9 g/L (indice 2).",
        "Légumes arrosés : turgescence ; légumes salés : plasmolyse (indice 3).",
        "Les frites changent de comportement autour de 0,28 mol/L : la concentration décide (indice 4)."
      ],
      reponse: "<p>L'eau traverse les membranes cellulaires par osmose, du milieu le moins concentré en substances dissoutes vers le plus concentré. L'eau distillée ne contient presque rien de dissous : injectée dans le sang, elle serait fortement hypotonique ; l'eau entrerait dans les globules rouges qui gonfleraient puis éclateraient (hémolyse). C'est pourquoi on perfuse une solution isotonique au plasma, le sérum physiologique à 9 g/L. Les cellules végétales obéissent à la même loi, mais leur paroi les empêche d'éclater : l'eau aspergée sur le ndolè entre dans les cellules, qui deviennent turgescentes, et les feuilles restent fermes ; le sel rend le milieu hypertonique autour du concombre, l'eau sort des cellules, qui se plasmolysent, et le concombre ramollit. L'expérience des frites le confirme : elles gagnent de l'eau sous 0,28 mol/L de saccharose et en perdent au-dessus.</p>",
      transfert: "<p>Pour conserver le poisson, les femmes de Kribi le salent abondamment avant de le fumer. En t'appuyant sur l'osmose, explique en cinq lignes pourquoi le sel empêche les bactéries de se développer.</p>"
    },
    revision: [
      "<strong>Osmose</strong> : passage de l'eau à travers une membrane semi-perméable, du moins concentré vers le plus concentré.",
      "Milieux <strong>hypo-</strong>, <strong>iso-</strong>, <strong>hypertonique</strong> : l'eau entre, ne bouge pas, sort.",
      "Globule rouge : <strong>hémolyse</strong> (hypo), ratatinement (hyper), intact à <strong>9 g/L</strong> de NaCl.",
      "Perfusion : toujours <strong>isotonique</strong> au plasma.",
      "Cellule végétale : <strong>turgescence</strong> (hypo), <strong>plasmolyse</strong> (hyper) ; la paroi empêche l'éclatement.",
      "Concentration isotonique d'un tissu : variation de masse nulle (frites : ≈ 0,28 mol/L)."
    ],
    exo: "<p>Des cellules d'épiderme d'oignon rouge sont placées dans des solutions de saccharose à 0,1 ; 0,3 et 0,6 mol/L. La concentration isotonique de ces cellules est 0,35 mol/L. Décris et explique ce qu'on observe au microscope dans chaque cas. <em>(0,1 et 0,3 : hypotoniques, cellules turgescentes ; 0,6 : hypertonique, plasmolyse.)</em></p>",
    quiz: [
      q("Dans de l'eau distillée, un globule rouge…", "gonfle puis éclate", "se ratatine", "ne change pas", "Milieu hypotonique : l'eau entre, hémolyse."),
      q("La plasmolyse s'observe en milieu…", "hypertonique", "hypotonique", "isotonique", "La vacuole perd son eau."),
      q("L'eau se déplace vers le milieu…", "le plus concentré", "le moins concentré", "le plus chaud", "C'est la définition de l'osmose."),
      q("Le sérum physiologique contient…", "9 g/L de chlorure de sodium", "90 g/L de chlorure de sodium", "de l'eau distillée", "Il est isotonique au plasma."),
      q("Pourquoi une cellule végétale n'éclate-t-elle pas en milieu hypotonique ?", "sa paroi rigide la retient", "sa vacuole est vide", "elle n'a pas de membrane", "Elle devient turgescente."),
      q("Une membrane semi-perméable laisse passer…", "l'eau mais pas les substances dissoutes", "toutes les substances", "rien du tout", "D'où le mouvement de l'eau seule."),
      q("Des tranches de concombre salées ramollissent car…", "leurs cellules perdent de l'eau", "le sel les brûle", "elles gagnent de l'eau", "Milieu hypertonique : plasmolyse."),
      q("Une frite qui garde la même masse est dans un milieu…", "isotonique", "hypotonique", "hypertonique", "Pas de mouvement net d'eau."),
      q("Une salade arrosée redevient croquante grâce à…", "la turgescence de ses cellules", "la plasmolyse", "l'hémolyse", "Ses vacuoles se remplissent."),
      q("Le contenu des cellules de pomme de terre équivaut à environ…", "0,28 mol/L de saccharose", "0 mol/L", "0,6 mol/L", "Variation de masse nulle vers 0,28 mol/L.")
    ]
  });

  /* ═══════════════════════ 2nde C CHIMIE — L'EXPÉRIENCE DE RUTHERFORD ═══════════════════════ */
  var R_OLD = ancien("2nde-c-chimie-rutherford");
  function feuille3D() {
    var o = [], k, R = alea(1911);
    o.push({ f: "boite", c: [0, -70, 0], d: [520, 8, 340], coul: "#3C4253", dessus: "#4B5266" });
    o.push({ f: "boite", c: [-215, -10, 0], d: [70, 70, 70], coul: "#6E7681", dessus: "#8A929C" });
    o.push({ f: "sphere", c: [-205, 0, 0], r: 7, coul: "#F2994A" });
    o.push({ f: "cylindre", c: [-180, 0, 0], r: 1.6, h: 175, n: 6, axe: "x", coul: "#FF7A45" });
    o.push({ f: "boite", c: [0, 0, 0], d: [2, 120, 120], coul: "#D4AF37", div: false });
    o.push({ f: "cylindre", c: [0, -50, 0], r: 230, h: 100, n: 48, coul: "#9BE3B0", op: 0.12, double: true });
    /* éclairs sur l'écran : nombreux en face, quelques-uns déviés, un rare vers l'arrière */
    for (k = 0; k < 26; k++) { var a = (R() - 0.5) * 0.25, y = (R() - 0.5) * 60; o.push({ f: "sphere", c: [229 * Math.cos(a), y, 229 * Math.sin(a)], r: 3.2, coul: "#C8FF6A" }); }
    [0.55, -0.7, 0.95, -1.2, 1.6].forEach(function (a) { o.push({ f: "sphere", c: [229 * Math.cos(a), (R() - 0.5) * 40, 229 * Math.sin(a)], r: 3.6, coul: "#C8FF6A" }); });
    o.push({ f: "sphere", c: [229 * Math.cos(2.7), 8, 229 * Math.sin(2.7)], r: 4.5, coul: "#E9FF9E" });
    /* trajectoires en pointillés : une déviée, une renvoyée */
    for (k = 1; k < 14; k++) o.push({ f: "sphere", c: [k * 15, 0, k * k * 0.9], r: 1.5, coul: "#FF7A45" });
    for (k = 1; k < 14; k++) o.push({ f: "sphere", c: [229 * Math.cos(2.7) * k / 14, 8 * k / 14, 229 * Math.sin(2.7) * k / 14], r: 1.5, coul: "#FFB347" });
    return o;
  }
  var PLANCHE_ZOOM_OR = (function () {
    var id = "ru2", s = "<rect x='12' y='12' width='616' height='296' rx='14' fill='#0F1830'/>", i, j;
    for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) {
      var cx = 230 + i * 62 + (j % 2) * 31, cy = 60 + j * 66;
      s += "<circle cx='" + cx + "' cy='" + cy + "' r='31' fill='url(#" + id + "nu)'/><circle cx='" + cx + "' cy='" + cy + "' r='2.6' fill='#FFD54A'/>";
    }
    function traj(d, c) { s += "<path d='" + d + "' fill='none' stroke='" + (c || "#FF8A50") + "' stroke-width='2.2' stroke-dasharray='1 0' marker-end='url(#" + id + "f)'/>"; }
    [42, 92, 160, 228, 284].forEach(function (y) { traj("M30 " + y + "H600"); });
    traj("M30 199H272Q300 201 326 214L600 270");
    traj("M30 128H250Q262 128 252 134L40 196", "#FFD54A");
    s += txt(46, 34, "particules α", { s: 12, c: "#FFB38A", a: "start" }) + txt(420, 296, "noyau d'or (agrandi 1 000 fois : il serait invisible)", { s: 11.5, w: 600, c: "#FFE08A" }) + txt(560, 34, "nuage électronique", { s: 11.5, w: 600, c: "#A9C4FF", a: "end" });
    return svg(640, 320, "Zoom sur la feuille d or : des atomes presque vides, chacun avec un noyau minuscule ; presque toutes les particules alpha passent tout droit, une est déviée, une rebondit", "<radialGradient id='" + id + "nu'><stop offset='0' stop-color='#7C9BEF' stop-opacity='.42'/><stop offset='.7' stop-color='#3A5BB8' stop-opacity='.2'/><stop offset='1' stop-color='#3A5BB8' stop-opacity='.05'/></radialGradient>" + fleche(id + "f", "#FF8A50"), s);
  })();

  remplacer("2nde-c-chimie-rutherford", {
    c: "2nde C", m: "chimie", titre: "L'expérience de Rutherford et le noyau atomique", duree: 35,
    accroche: "« Si la matière était vide, ma main traverserait la table ! » Une feuille d'or tranche le débat.",
    intro: "Un débat au club scientifique te sert de fil rouge : à chaque partie, un résultat de l'expérience de 1911 t'aide à trancher entre trois modèles de l'atome.",
    objectifs: ["décrire l'expérience de Rutherford et ses trois observations", "en déduire le modèle planétaire de l'atome et rejeter le modèle de Thomson", "manipuler les ordres de grandeur du noyau et de l'atome", "écrire et lire la représentation symbolique d'un noyau"],
    enquete: {
      titre: "Le débat du club scientifique de Garoua",
      svg: (function () {
        var id = "rusc", s = "<rect width='640' height='210' fill='#FBF7EE'/><rect x='30' y='20' width='250' height='120' rx='6' fill='#244A3A' stroke='#7A5230' stroke-width='6'/>";
        s += "<circle cx='105' cy='80' r='42' fill='#F2B7A8' opacity='.85'/>"; [[90, 66], [120, 74], [98, 98], [118, 96], [84, 86], [106, 80]].forEach(function (p) { s += "<circle cx='" + p[0] + "' cy='" + p[1] + "' r='4' fill='#1E499B'/>"; });
        s += txt(105, 134, "Aïssatou : « pudding »", { s: 10.5, c: "#E8F5EE", w: 600 });
        s += "<circle cx='210' cy='80' r='42' fill='none' stroke='#9FD3B3' stroke-dasharray='3 4'/><circle cx='210' cy='80' r='3' fill='#FFD54A'/><circle cx='250' cy='78' r='3.5' fill='#8FB4FF'/><circle cx='180' cy='52' r='3.5' fill='#8FB4FF'/>" + txt(210, 134, "noyau et vide ?", { s: 10.5, c: "#E8F5EE", w: 600 });
        s += "<rect x='330' y='110' width='260' height='14' rx='3' fill='#A97D50'/><path d='M350 124v60M570 124v60' stroke='#8E6A3E' stroke-width='7'/>";
        s += "<g transform='translate(440 70)'><circle r='16' fill='#6B4423'/><path d='M-22 60c0-30 10-42 22-42s22 12 22 42' fill='#2E6FB0'/><path d='M14 30l30 10' stroke='#6B4423' stroke-width='8' stroke-linecap='round'/></g>";
        s += "<path d='M486 84l-6 22' stroke='#C2540A' stroke-width='2' marker-end='url(#" + id + "f)'/>";
        s += "<rect x='470' y='20' width='160' height='40' rx='12' fill='#fff' stroke='#E3DCCB'/>" + txt(550, 45, "« Ma main passera ! »", { s: 12, c: NUIT });
        return svg(640, 210, "Au tableau, deux modèles de l atome dessinés ; un élève frappe la table de la main", fleche(id + "f", "#C2540A"), s);
      })(),
      legende: "Au lycée classique de Garoua, le mercredi après-midi : la séance du club scientifique.",
      contexte: "<p>Au club scientifique, le professeur annonce : « La matière est presque entièrement vide. » Moussa frappe la table : « Si c'était vrai, ma main passerait à travers ! » Aïssatou a lu un vieux livre : pour elle, l'atome est une <strong>boule pleine de charge positive</strong>, dans laquelle les électrons sont piqués comme des raisins dans un gâteau (le modèle de <strong>Thomson</strong>, 1904).</p><p>Le professeur sort un document : les résultats de l'expérience menée en 1909-1911 par Geiger et Marsden dans le laboratoire de <strong>Rutherford</strong>.</p>",
      documents: [
        { t: "Les comptages de Geiger et Marsden", html: "<table class='donnees'><tr><th>Ce qui arrive sur l'écran</th><th>Proportion</th></tr><tr><td>particules α non déviées (ou presque)</td><td>plus de 99,9 %</td></tr><tr><td>déviées de plus de 10°</td><td>environ 1 sur 1 000</td></tr><tr><td>renvoyées vers l'arrière (plus de 90°)</td><td>environ 1 sur 10 000</td></tr></table><p>Feuille d'or de 0,4 µm d'épaisseur, soit environ <strong>1 000 couches d'atomes</strong>.</p>" },
        { t: "La particule α", html: "<p>Noyau d'hélium ⁴₂He : chargée <strong>positivement</strong> (+2e), environ 7 300 fois plus lourde qu'un électron, lancée à près de <strong>15 000 km/s</strong>.</p>" }
      ],
      question: "L'atome est-il une boule pleine ou presque vide ? Et si la matière est vide, pourquoi la main de Moussa ne traverse-t-elle pas la table ?",
      tache: "Rédige la synthèse du club en dix lignes, en appuyant chaque affirmation sur une observation de l'expérience.",
      hypotheses: [
        "L'atome est une boule pleine de charge positive où sont piqués les électrons (Aïssatou).",
        "Si l'atome était presque vide, la main de Moussa passerait à travers la table.",
        "L'atome est presque vide : un noyau minuscule, positif et lourd, entouré d'électrons lointains."
      ]
    },
    parties: [
      { t: "L'expérience", html:
        "<p>Une source radioactive (du polonium), enfermée dans une boîte de plomb percée d'un trou, émet un <strong>faisceau</strong> fin de particules α. Le faisceau frappe une <strong>feuille d'or</strong> très mince. Un <strong>écran</strong> de sulfure de zinc, qui fait un petit éclair à chaque impact, entoure la feuille ; on compte les éclairs au microscope, dans le noir.</p>" +
        "<ol><li>La très grande majorité des particules <strong>traverse</strong> la feuille sans être déviée.</li><li>Quelques-unes sont <strong>déviées</strong>, parfois fortement.</li><li>De très rares particules (environ 1 sur 10 000) <strong>rebondissent</strong> vers l'arrière.</li></ol>" +
        "<div class='savais'><b>Le savais-tu ?</b>Rutherford a raconté : « C'était aussi incroyable que si vous tiriez un obus de 38 cm sur une feuille de papier à cigarette et qu'il revenait vous frapper. »</div>",
        planches: [{ type: "3d", titre: "Le dispositif de Geiger et Marsden", legende: "Tourne le dispositif : la boîte de plomb (à gauche) envoie le faisceau α sur la feuille d'or. L'écran circulaire s'allume surtout en face ; quelques éclairs sur les côtés ; un éclair rare revient du côté de la source.",
          modele: { h: 380, rx: -30, ry: 28, echelle: 0.82, alt: "Dispositif de Rutherford en trois dimensions : source dans une boîte de plomb, faisceau, feuille d or, écran circulaire avec des éclairs", objets: feuille3D(),
            etiquettes: [{ p: [-215, 30, 0], t: "Source α (boîte de plomb)" }, { p: [0, 62, 0], t: "Feuille d'or", cote: "d" }, { p: [229, 30, 0], t: "Éclairs nombreux en face", cote: "d" }, { p: [229 * Math.cos(2.7), 20, 229 * Math.sin(2.7)], t: "Rebond (1 sur 10 000)" }] } }],
        fil: { html: "<p>Le document 1 est sans appel : plus de 99,9 % des particules α traversent 1 000 couches d'atomes d'or <strong>sans rien rencontrer</strong>. Les atomes de la feuille sont donc essentiellement faits de <strong>vide</strong>. Lance toi-même le faisceau dans la simulation pour le constater.</p>" },
        retenir: "Presque tout traverse, quelques déviations, de très rares rebonds." },

      { t: "Interpréter : le noyau", html:
        "<div class='def'><b>Modèle planétaire (Rutherford, 1911)</b>L'atome est constitué d'un <strong>noyau</strong> central, très petit, chargé positivement, qui contient presque toute la masse ; les <strong>électrons</strong>, négatifs et très légers, se déplacent autour, très loin du noyau. Entre les deux : du <strong>vide</strong>.</div>" +
        "<div class='methode'><b>Raisonner observation par observation</b><ol><li>Presque toutes les α passent : l'atome est surtout <strong>vide</strong>.</li><li>Certaines sont déviées : elles passent près d'une charge <strong>positive</strong> qui les repousse (les électrons, 7 300 fois plus légers, ne pourraient pas dévier une α).</li><li>De rares α rebondissent : elles ont frappé presque de plein fouet une charge positive <strong>concentrée</strong> et <strong>lourde</strong>, le noyau.</li></ol></div>",
        planches: [{ type: "2D", titre: "Zoom sur la feuille d'or", legende: "Chaque atome d'or est un nuage d'électrons presque vide, avec au centre un noyau minuscule (agrandi ici 1 000 fois). La plupart des α passent loin des noyaux ; une frôle un noyau et est déviée ; une le frappe de face et rebondit.", svg: PLANCHE_ZOOM_OR }],
        fil: { html: "<p>Dans le modèle d'Aïssatou, la charge positive est étalée dans toute la boule : elle ne pourrait que <strong>freiner légèrement</strong> les α, jamais en renvoyer une. Les rebonds exigent une charge positive très concentrée. Dans la simulation, passe au modèle de Thomson : aucun rebond.</p>", verdicts: [[0, "rejetee", "Une charge positive étalée ne peut pas renvoyer une particule α ; il faut un noyau concentré."], [2, "validee", "Les rebonds rares révèlent un noyau minuscule, positif et lourd."]] },
        retenir: "Noyau minuscule, positif, lourd ; électrons légers et lointains ; entre les deux, le vide." },

      { t: "Ordres de grandeur, et la main de Moussa", html:
        "<p>Le noyau mesure environ 10⁻¹⁵ m, l'atome environ 10⁻¹⁰ m : le noyau est <strong>100 000 fois</strong> plus petit que l'atome.</p>" +
        "<div class='ex'><b>Calcul</b>Si l'atome avait le diamètre du terrain du stade Roumdé Adjia de Garoua (100 m), son noyau mesurerait 100 m ÷ 100 000 = 10⁻³ m = <strong>1 mm</strong> : un grain de mil au centre de la pelouse.</div>" +
        "<div class='prop'><b>Pourquoi la matière paraît pleine</b>Les électrons des atomes de ta main et ceux des atomes de la table, tous négatifs, se <strong>repoussent</strong> très fortement dès qu'ils se rapprochent. C'est cette répulsion électrique, et non un « remplissage », qui empêche ta main de traverser la table.</div>",
        fil: { html: "<p>Moussa a mal raisonné : « vide » ne veut pas dire « sans force ». Sa main ne touche jamais vraiment la table : les nuages d'électrons se repoussent. La particule α, elle, est un projectile minuscule et très rapide qui se faufile entre les noyaux.</p>", verdicts: [[1, "rejetee", "La répulsion entre les électrons de la main et ceux de la table empêche de traverser, même si l'atome est presque vide."]] },
        retenir: "Noyau ≈ 10⁻¹⁵ m, atome ≈ 10⁻¹⁰ m : rapport 100 000. La matière « résiste » par répulsion électrique." },

      { t: "La représentation symbolique d'un noyau", html: (R_OLD && R_OLD.parties[2] ? R_OLD.parties[2].html : "") +
        "<div class='savais'><b>La particule α elle-même</b>C'est le noyau ⁴₂He : 2 protons et 4 − 2 = 2 neutrons, d'où sa charge +2e.</div>",
        planches: [{ type: "2D", titre: "Lire ⁵⁶₂₆Fe", legende: "Le nombre de masse A (en haut) compte les nucléons ; le numéro atomique Z (en bas) compte les protons ; N = A − Z neutrons.", svg: (function () {
          var id = "ru4", s = "", R = alea(56), i, P = [];
          s += txt(150, 150, "Fe", { s: 82, c: NUIT }) + txt(40, 92, "56", { s: 30, c: "#C2540A", a: "start" }) + txt(40, 186, "26", { s: 30, c: BLEU, a: "start" });
          s += txt(60, 230, "A = 56 nucléons", { s: 13, c: "#C2540A", a: "start" }) + txt(60, 252, "Z = 26 protons", { s: 13, c: BLEU, a: "start" }) + txt(60, 274, "N = 56 − 26 = 30 neutrons", { s: 13, a: "start" });
          for (i = 0; i < 56; i++) { var r = 50 * Math.cbrt(R()), t = R() * 2 * Math.PI, ph = Math.acos(2 * R() - 1); P.push([430 + r * Math.sin(ph) * Math.cos(t), 150 + r * Math.sin(ph) * Math.sin(t), r * Math.cos(ph), i < 26]); }
          P.sort(function (a, b) { return a[2] - b[2]; }).forEach(function (p) { s += "<circle cx='" + p[0].toFixed(1) + "' cy='" + p[1].toFixed(1) + "' r='11' fill='url(#" + id + (p[3] ? "p" : "n") + ")'/>"; });
          s += "<g transform='translate(520 250)'><circle r='8' fill='url(#" + id + "p)'/>" + txt(14, 4, "proton (+e)", { s: 11.5, a: "start", w: 600 }) + "<circle cy='24' r='8' fill='url(#" + id + "n)'/>" + txt(14, 28, "neutron (0)", { s: 11.5, a: "start", w: 600 }) + "</g>";
          return svg(640, 300, "Le noyau de fer 56 26 : 26 protons rouges et 30 neutrons gris serrés en boule", rad(id + "p", ["#FFB3B3", "#E8394B", "#B0182C", "#5E0812"]) + rad(id + "n", ["#EEF1F6", "#AEB6C6", "#727C8E", "#3B4252"]), s);
        })() }],
        retenir: "Z protons, A nucléons, N = A − Z neutrons ; des isotopes ont le même Z." },
      R_OLD && R_OLD.parties[3] ? R_OLD.parties[3] : { t: "Entraînement", html: "" }
    ],
    denouement: {
      titre: "Un atome presque vide, une table qui résiste",
      etapes: [
        "Plus de 99,9 % des α traversent 1 000 couches d'atomes : l'atome est surtout vide (indice 1).",
        "Déviations et rares rebonds : une charge positive concentrée et lourde, le noyau ; le modèle de Thomson est rejeté (indice 2).",
        "Noyau 100 000 fois plus petit que l'atome ; la main ne passe pas à cause de la répulsion entre électrons (indice 3).",
        "Le noyau s'écrit ᴬ_Z X : Z protons, A − Z neutrons (indice 4)."
      ],
      reponse: "<p>Dans l'expérience de Rutherford, plus de 99,9 % des particules α traversent sans déviation une feuille d'or épaisse d'environ 1 000 couches d'atomes : l'atome est donc essentiellement vide. Quelques particules sont déviées et environ une sur 10 000 rebondit : elles ont rencontré une charge positive très concentrée et lourde, le noyau. Une charge positive étalée dans tout l'atome, comme dans le modèle de Thomson défendu par Aïssatou, ne pourrait jamais renvoyer une particule α : ce modèle est rejeté au profit du modèle planétaire, un noyau 100 000 fois plus petit que l'atome entouré d'électrons lointains. Moussa a tort de croire que sa main passerait : les électrons de sa main et ceux de la table se repoussent fortement, ce qui donne à la matière sa consistance malgré le vide qu'elle contient.</p>",
      transfert: "<p>Si l'on refaisait l'expérience avec une feuille d'aluminium (noyau ²⁷₁₃Al, deux fois moins chargé environ que celui de l'or, Z = 79), observerait-on plus ou moins de rebonds ? Justifie en quatre lignes.</p>"
    },
    revision: (R_OLD && R_OLD.revision || []).concat(["Modèle de Thomson (charge étalée) <strong>rejeté</strong> : il n'explique pas les rebonds.", "La matière résiste par <strong>répulsion</strong> entre électrons, pas parce qu'elle est pleine."]),
    exo: R_OLD ? R_OLD.exo : "",
    quiz: R_OLD ? R_OLD.quiz : []
  });

  /* ═══════════════════════ 5e MATHS — LA DIVISION EUCLIDIENNE ═══════════════════════ */
  var D_OLD = ancien("5e-maths-division-euclidienne");
  function cagette2D(id, x, y, n) {
    var s = "<g transform='translate(" + x + " " + y + ")'><ellipse cx='60' cy='70' rx='64' ry='7' fill='url(#" + id + "o)'/><rect x='0' y='8' width='120' height='58' rx='4' fill='url(#" + id + "bo)' stroke='#7A4F27'/>", i;
    for (i = 0; i < Math.min(n, 24); i++) s += mangue(id, 12 + (i % 8) * 13.7, 18 + Math.floor(i / 8) * 13, 7.5, (i * 37) % 50 - 25);
    s += "<rect x='0' y='38' width='120' height='9' fill='url(#" + id + "bo)' stroke='#7A4F27' opacity='.95'/><rect x='0' y='54' width='120' height='12' rx='3' fill='url(#" + id + "bo)' stroke='#7A4F27'/><path d='M4 42h112' stroke='#F1C98F' opacity='.6'/>";
    return s + "</g>";
  }
  function defsCagette(id) { return defsMangue(id) + lin(id + "bo", ["#E2B57A", "#C08850", "#8A5A2D"], true); }
  function cagettes3D() {
    var o = [], i, j, k, R = alea(250);
    o.push({ f: "boite", c: [0, -6, 0], d: [600, 8, 330], coul: "#8C6A45", dessus: "#B08A5E" });
    for (i = 0; i < 10; i++) {
      var col = i % 5, et = Math.floor(i / 5), cx = -200 + col * 100, cz = -50, cy = et * 46, ec = [0, et * 50, et * 40];
      [[0, 0, 0, 90, 4, 64], [0, 18, -30, 90, 32, 4], [0, 18, 30, 90, 32, 4], [-43, 18, 0, 4, 32, 64], [43, 18, 0, 4, 32, 64]].forEach(function (b) {
        o.push({ f: "boite", c: [cx + b[0], cy + b[1], cz + b[2]], d: [b[3], b[4], b[5]], coul: "#C9A576", dessus: "#E3C79C", div: false, ec: ec });
      });
      for (j = 0; j < 24; j++) { k = j % 12; o.push({ f: "sphere", c: [cx - 33 + (k % 6) * 13.2, cy + 28 + Math.floor(j / 12) * 10, cz - 18 + Math.floor(k / 6) * 26 + (R() - 0.5) * 6], r: 6.6, coul: ["#F4B63F", "#E98B2A", "#8DB33A", "#D9542B", "#F7CF4A"][Math.floor(R() * 5)], ec: ec }); }
    }
    o.push({ f: "cylindre", c: [150, 0, 100], r: 48, r2: 58, h: 22, n: 24, coul: "#2F6DB5", dessus: "#4C8AD0" });
    for (j = 0; j < 10; j++) { var a = j * 0.63, rr = j < 6 ? 30 : 10; o.push({ f: "sphere", c: [150 + rr * Math.cos(a), 26 + (j < 6 ? 0 : 10), 100 + rr * Math.sin(a)], r: 7, coul: ["#F4B63F", "#E98B2A", "#8DB33A", "#D9542B"][j % 4] }); }
    return o;
  }

  remplacer("5e-maths-division-euclidienne", {
    c: "5e", m: "maths", titre: "La division euclidienne", duree: 30,
    accroche: "250 mangues, des cagettes de 24 : « 10,4 cagettes », dit Ibrahim. Le grossiste éclate de rire.",
    intro: "La récolte de Maman Aïssa te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois réponses.",
    objectifs: ["poser une division euclidienne et nommer ses termes", "écrire l'égalité a = b × q + r et vérifier que r < b", "interpréter le quotient et le reste dans un problème concret", "reconnaître un diviseur et un multiple"],
    enquete: {
      titre: "La récolte de mangues de Maman Aïssa",
      svg: (function () {
        var id = "dvsc", s = "<rect width='640' height='220' fill='#FFF7E6'/><rect y='168' width='640' height='52' fill='#E7D3A8'/>";
        s += "<path d='M60 168c-4-60 8-90 14-110' stroke='#6B4423' stroke-width='12' fill='none'/><ellipse cx='80' cy='60' rx='70' ry='46' fill='#2E7D32'/><ellipse cx='50' cy='76' rx='44' ry='30' fill='#388E3C'/>";
        [[60, 80], [95, 70], [40, 60], [110, 92]].forEach(function (p) { s += mangue(id, p[0], p[1], 7, 80); });
        var R = alea(3), i; for (i = 0; i < 60; i++) s += mangue(id, 180 + (i % 15) * 15 + R() * 4, 160 - Math.floor(i / 15) * 9 - (i % 15 > 3 && i % 15 < 11 ? 6 : 0), 8, R() * 60 - 30);
        s += cagette2D(id, 440, 104, 24) + cagette2D(id, 440, 50, 24);
        s += "<rect x='420' y='12' width='200' height='34' rx='12' fill='#fff' stroke='#E3DCCB'/>" + txt(520, 34, "cagette de 24 : 3 000 F", { s: 12.5, c: "#8A6200" });
        s += txt(290, 200, "250 mangues récoltées", { s: 13, c: "#6D4A00" });
        return svg(640, 220, "Un manguier, un tas de mangues au sol et deux cagettes pleines ; affiche : cagette de 24 à 3 000 francs", defsCagette(id), s);
      })(),
      legende: "À Garoua, au bord de la route de Ngaoundéré : le verger de Maman Aïssa, un samedi de mars.",
      contexte: "<p>Maman Aïssa a récolté <strong>250 mangues</strong>. Le grossiste qui passe le samedi achète uniquement des <strong>cagettes pleines de 24 mangues</strong>, à <strong>3 000 F</strong> la cagette. Les mangues qui restent seront vendues au détail au bord de la route, à <strong>150 F</strong> pièce.</p><p>Ibrahim, son fils, tape 250 ÷ 24 sur le téléphone : « 10,416… Maman, ça fait 10,4 cagettes ! » Sa sœur Hawa propose d'arrondir : « Prépare 11 cagettes, comme ça tout part au grossiste. »</p>",
      documents: [{ t: "Les prix du samedi", html: "<table class='donnees'><tr><td>Cagette pleine (24 mangues), grossiste</td><td>3 000 F</td></tr><tr><td>Mangue au détail</td><td>150 F</td></tr></table>" }],
      question: "Combien de cagettes pleines Maman Aïssa peut-elle vendre, combien de mangues lui restera-t-il, et combien gagnera-t-elle en tout ?",
      tache: "Pose la bonne division, écris l'égalité qui la contrôle, puis calcule la recette totale.",
      hypotheses: [
        "« 10,4 cagettes » (Ibrahim) : le résultat de la calculatrice suffit.",
        "« 11 cagettes pleines » (Hawa) : on arrondit au-dessus et tout part au grossiste.",
        "10 cagettes pleines, et quelques mangues à vendre au détail."
      ]
    },
    parties: [
      { t: "Le vocabulaire", html: (D_OLD ? D_OLD.parties[0].html : "") +
        "<div class='astuce'><b>Ce que disent q et r</b>Le <strong>quotient</strong> q compte les groupes complets (les cagettes pleines) ; le <strong>reste</strong> r compte ce qui ne suffit pas à faire un groupe de plus (les mangues en trop).</div>",
        planches: [{ type: "2D", titre: "250 mangues rangées par 24", legende: "10 cagettes pleines de 24 mangues (240 mangues) et 10 mangues qui restent dans la bassine : 250 = 24 × 10 + 10.", svg: (function () {
          var id = "dv1", s = "", i;
          for (i = 0; i < 10; i++) s += cagette2D(id, 14 + (i % 5) * 124, 14 + Math.floor(i / 5) * 84, 24);
          s += "<g transform='translate(250 190)'><ellipse cx='70' cy='54' rx='80' ry='8' fill='url(#" + id + "o)'/><path d='M0 14h140l-14 40h-112z' fill='url(#" + id + "ba)' stroke='#4F7AA3'/><ellipse cx='70' cy='14' rx='70' ry='9' fill='#B7D4EC' stroke='#4F7AA3'/>";
          for (i = 0; i < 10; i++) s += mangue(id, 22 + (i % 5) * 24, 6 + Math.floor(i / 5) * 9, 8, i * 23);
          s += "</g>" + txt(320, 275, "reste : 10 mangues", { s: 13, c: "#C2540A" });
          s += "<rect x='420' y='196' width='200' height='58' rx='12' fill='#FFF8E6' stroke='#F2DFA6'/>" + txt(520, 220, "250 = 24 × 10 + 10", { s: 15, c: "#8A6200" }) + txt(520, 242, "et 10 < 24", { s: 12.5, c: "#8A6200" });
          return svg(640, 290, "Dix cagettes pleines de vingt-quatre mangues et une bassine de dix mangues", defsCagette(id) + lin(id + "ba", ["#CFE3F3", "#7FA6C9"], true), s);
        })() }],
        fil: { html: "<p>On ne vend pas 0,4 cagette au grossiste : il ne prend que des cagettes <strong>pleines</strong>. La calculatrice donne un quotient décimal ; ce qu'il faut ici, c'est un quotient <strong>entier</strong> et un <strong>reste</strong>. 24 × 10 = 240 et 250 − 240 = 10 : <strong>10 cagettes</strong> et <strong>10 mangues</strong>.</p>", verdicts: [[0, "rejetee", "On ne vend pas une fraction de cagette : il faut un quotient entier et un reste."]] },
        retenir: "Dividende = diviseur × quotient + reste, et le reste est toujours plus petit que le diviseur." },

      { t: "Poser la division", html:
        "<ol><li>Combien de fois 24 « va »-t-il dans 25 (les deux premiers chiffres de 250) ? <strong>1</strong> fois (24), il reste 1.</li><li>On abaisse le 0 : 10. 24 va <strong>0</strong> fois dans 10, il reste 10.</li><li>Résultat : quotient <strong>10</strong>, reste <strong>10</strong>.</li></ol>" +
        "<div class='astuce'><b>Vérifier</b>On calcule toujours b × q + r : 24 × 10 + 10 = 240 + 10 = 250. ✓ Et 10 &lt; 24. ✓</div>" +
        "<div class='attention'><b>Piège du zéro</b>Quand le diviseur ne « va » pas dans le nombre formé, on écrit <strong>0</strong> au quotient avant de continuer : sans lui, on trouverait 1 au lieu de 10.</div>",
        planches: [{ type: "2D", titre: "La potence de 250 ÷ 24", legende: "On lit le quotient sous la barre (10) et le reste en bas à gauche (10).", svg: (function () {
          var s = "<rect x='120' y='20' width='400' height='240' rx='14' fill='#FBFAF7' stroke='#E3DCCB'/>";
          s += txt(250, 70, "2 5 0", { s: 30, a: "end" }) + "<path d='M270 40V230M270 82H420' stroke='" + NUIT + "' stroke-width='3'/>" + txt(300, 70, "24", { s: 30, a: "start", c: BLEU }) + txt(300, 120, "1 0", { s: 30, a: "start", c: "#C2540A" });
          s += txt(222, 112, "− 2 4", { s: 24, a: "end", c: GRIS }) + "<path d='M170 122H236' stroke='" + GRIS + "' stroke-width='2'/>" + txt(250, 160, "1 0", { s: 26, a: "end" }) + txt(250, 200, "− 0", { s: 22, a: "end", c: GRIS }) + "<path d='M196 210H254' stroke='" + GRIS + "' stroke-width='2'/>" + txt(250, 246, "1 0", { s: 28, a: "end", c: VERT });
          s += txt(440, 160, "quotient", { s: 13, c: "#C2540A" }) + "<path d='M406 156L356 118' stroke='#C2540A' stroke-width='1.6'/>" + txt(110, 246, "reste", { s: 13, c: VERT, a: "end" }) + txt(440, 70, "diviseur", { s: 13, c: BLEU }) + txt(110, 70, "dividende", { s: 13, a: "end" });
          return svg(640, 280, "Division posée de 250 par 24 : quotient 10, reste 10", "", s);
        })() }],
        fil: { html: "<p>La division posée confirme : <strong>q = 10</strong> et <strong>r = 10</strong>. Pour remplir une 11ᵉ cagette, il faudrait 24 × 11 = 264 mangues : il en manque 14.</p>", verdicts: [[1, "rejetee", "24 × 11 = 264 > 250 : la 11ᵉ cagette ne serait pas pleine."]] },
        retenir: "Toujours vérifier : b × q + r redonne a, et r < b." },

      { t: "Le reste, plus petit que le diviseur ; diviseurs et multiples", html:
        "<div class='prop'><b>Unicité</b>Pour a et b donnés (b ≠ 0), il n'existe qu'<strong>un seul</strong> couple (q ; r) avec a = b × q + r et 0 ≤ r &lt; b. Si r ≥ b, on peut encore remplir un groupe : on n'a pas fini la division.</div>" +
        (D_OLD ? D_OLD.parties[2].html : "") +
        "<div class='ex'><b>Quand faut-il « une de plus » ?</b>Pour transporter les 250 mangues dans des cagettes (pleines ou non), il faut 10 + 1 = <strong>11 cagettes</strong>, car les 10 mangues restantes ont besoin d'une cagette. Pour en <strong>vendre</strong> au grossiste, seules les 10 pleines comptent. Tout dépend de la question.</div>",
        planches: [{ type: "3d", titre: "Les dix cagettes et la bassine", legende: "Deux étages de 5 cagettes de 24 mangues, et la bassine bleue des 10 mangues restantes. Le curseur écarte l'étage du dessus pour compter les cagettes.",
          modele: { h: 360, rx: -26, ry: 30, echelle: 0.8, alt: "Dix cagettes de mangues empilées sur deux étages et une bassine de dix mangues", eclate: "Écarter l'étage du dessus", jouer: "Écarter les cagettes", objets: cagettes3D(),
            etiquettes: [{ p: [-200, 70, -50], t: "5 cagettes en haut", ec: [0, 50, 40] }, { p: [200, 20, -50], t: "5 cagettes en bas", cote: "d" }, { p: [150, 40, 100], t: "Reste : 10 mangues", cote: "d" }] } }],
        fil: { html: "<p>Recette : 10 cagettes × 3 000 F = <strong>30 000 F</strong> ; 10 mangues × 150 F = <strong>1 500 F</strong> au détail. Total : <strong>31 500 F</strong>.</p>", verdicts: [[2, "validee", "250 = 24 × 10 + 10 : 10 cagettes pleines et 10 mangues, soit 31 500 F."]] },
        retenir: "Reste nul : b divise a. Selon la question, le reste peut obliger à prévoir « une de plus »." },
      D_OLD && D_OLD.parties[3] ? D_OLD.parties[3] : { t: "Entraînement", html: "" }
    ],
    denouement: {
      titre: "10 cagettes, 10 mangues, 31 500 F",
      etapes: [
        "On cherche des cagettes pleines : quotient entier et reste, pas 10,4 (indice 1).",
        "Division posée : 250 = 24 × 10 + 10, avec 10 < 24 (indice 2).",
        "Une 11ᵉ cagette pleine demanderait 264 mangues (indice 2).",
        "Recette : 10 × 3 000 + 10 × 150 = 31 500 F (indice 3)."
      ],
      reponse: "<p>Il faut faire la division euclidienne de 250 par 24 : 250 = 24 × 10 + 10, et le reste 10 est bien plus petit que 24. Maman Aïssa peut donc vendre <strong>10 cagettes pleines</strong> au grossiste, et il lui restera <strong>10 mangues</strong>. « 10,4 cagettes » n'a pas de sens, car le grossiste n'achète que des cagettes pleines ; et une 11ᵉ cagette pleine demanderait 24 × 11 = 264 mangues. Sa recette sera de 10 × 3 000 F = 30 000 F chez le grossiste et de 10 × 150 F = 1 500 F au détail, soit <strong>31 500 F</strong> en tout.</p>",
      transfert: "<p>L'an prochain, Maman Aïssa espère 400 mangues. Combien de cagettes pleines ? Combien de mangues au détail ? Quelle recette ? <em>(400 = 24 × 16 + 16 : 16 cagettes, 16 mangues, 48 000 + 2 400 = 50 400 F.)</em></p>"
    },
    revision: D_OLD ? D_OLD.revision : [],
    exo: D_OLD ? D_OLD.exo : "",
    quiz: D_OLD ? D_OLD.quiz : []
  });

  /* ═══════════════════════ 2nde C PHYSIQUE — MESURER ET ESTIMER L'ERREUR ═══════════════════════ */
  var M_OLD = ancien("2nde-c-physique-mesure");
  function piedCoulisse3D() {
    var o = [], i;
    o.push({ f: "boite", c: [0, -14, 0], d: [560, 6, 220], coul: "#6B4A2B", dessus: "#94693F" });
    o.push({ f: "boite", c: [10, 0, 0], d: [420, 6, 34], coul: "#C3C9D2", dessus: "#E3E7ED", div: false });
    for (i = 0; i <= 40; i++) o.push({ f: "boite", c: [-190 + i * 9.5, 3.4, -10 + (i % 5 ? 4 : 0)], d: [0.9, 0.6, i % 5 ? 8 : 16], coul: "#1B2233", div: false });
    o.push({ f: "boite", c: [-205, 0, 40], d: [14, 6, 120], coul: "#B5BCC7", dessus: "#D8DDE4", div: false });
    var ec = [44, 0, 0];
    o.push({ f: "boite", c: [-180, 0, 40], d: [14, 6, 120], coul: "#B5BCC7", dessus: "#D8DDE4", div: false, ec: ec });
    o.push({ f: "boite", c: [-140, 4, 0], d: [90, 12, 44], coul: "#9DA5B2", dessus: "#C6CCD6", div: false, ec: ec });
    for (i = 0; i <= 10; i++) o.push({ f: "boite", c: [-175 + i * 8.55, 10.4, 16], d: [0.8, 0.6, i % 5 ? 6 : 10], coul: "#1B2233", div: false, ec: ec });
    o.push({ f: "cylindre", c: [-192.5, 0, 70], r: 11, h: 30, n: 24, coul: "#B87333", dessus: "#D99A5B" });
    return o;
  }
  var PLANCHE_CIBLES = (function () {
    var id = "me2", s = "", R = alea(42);
    function cible(cx, lab, sous, dx, dy, sig) {
      var t = "<g transform='translate(" + cx + " 140)'>";
      [80, 60, 40, 20].forEach(function (r, i) { t += "<circle r='" + r + "' fill='" + (i % 2 ? "#fff" : "#EEF3FC") + "' stroke='#9FB3D8'/>"; });
      t += "<circle r='4' fill='" + ROUGE + "'/>";
      for (var k = 0; k < 9; k++) { var x = dx + (R() - 0.5) * 2 * sig, y = dy + (R() - 0.5) * 2 * sig; t += "<circle cx='" + x.toFixed(1) + "' cy='" + y.toFixed(1) + "' r='4.6' fill='" + BLEU + "' stroke='#fff' stroke-width='1.2'/>"; }
      return t + txt(0, 112, lab, { s: 13 }) + txt(0, 130, sous, { s: 11, w: 500, c: GRIS }) + "</g>";
    }
    s += cible(110, "fidèle et juste", "petite erreur aléatoire, pas de biais", 0, 0, 9) + cible(320, "fidèle mais fausse", "erreur systématique", 34, -26, 9) + cible(530, "dispersée", "grande erreur aléatoire", 0, 0, 46);
    s += txt(320, 26, "Centre rouge = valeur vraie ; points bleus = mesures répétées", { s: 12, c: GRIS, w: 600 });
    return svg(640, 290, "Trois cibles : mesures groupées au centre ; mesures groupées mais décalées (erreur systématique) ; mesures dispersées (erreur aléatoire)", "", s);
  })();

  remplacer("2nde-c-physique-mesure", {
    c: "2nde C", m: "physique", titre: "Mesurer une grandeur et estimer l'erreur", duree: 35,
    accroche: "Le sac de riz « 25 kg » ne fait que 24,2 kg sur la balance de la maison. Qui se trompe ?",
    intro: "Un sac de riz pesé deux fois te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois explications.",
    objectifs: ["utiliser correctement un instrument de mesure et lire un vernier", "distinguer erreur systématique et erreur aléatoire", "écrire un résultat avec sa valeur moyenne, son incertitude et son unité", "juger si deux mesures sont compatibles"],
    enquete: {
      titre: "Le sac de riz du marché Mboppi",
      svg: (function () {
        var id = "mesc", s = "<rect width='640' height='220' fill='#F6F2EA'/><rect y='170' width='640' height='50' fill='#E2D6BE'/>";
        s += "<rect x='60' y='120' width='170' height='50' rx='8' fill='url(#" + id + "ba)' stroke='#7F8794'/><rect x='92' y='134' width='106' height='26' rx='4' fill='#14301F'/>" + txt(145, 153, "25,0 kg", { s: 16, c: "#7CFFA2" });
        s += "<path d='M95 120l12-56h76l12 56Z' fill='url(#" + id + "sac)' stroke='#A3824A'/>" + txt(145, 98, "RIZ 25 kg", { s: 12, c: "#6D4A00" });
        s += "<rect x='96' y='176' width='98' height='20' rx='4' fill='#14301F'/>" + txt(145, 191, "à vide : 0,8", { s: 11, c: "#7CFFA2", w: 600 });
        s += "<g transform='translate(470 110)'><circle r='54' fill='#fff' stroke='#7F8794' stroke-width='4'/>";
        for (var i = 0; i < 30; i++) { var a = -Math.PI * 0.75 + i * Math.PI * 1.5 / 29; s += "<path d='M" + (46 * Math.cos(a)).toFixed(1) + " " + (46 * Math.sin(a)).toFixed(1) + "L" + ((i % 5 ? 41 : 36) * Math.cos(a)).toFixed(1) + " " + ((i % 5 ? 41 : 36) * Math.sin(a)).toFixed(1) + "' stroke='" + NUIT + "' stroke-width='1.2'/>"; }
        s += "<path d='M0 0L30 -26' stroke='" + ROUGE + "' stroke-width='3' stroke-linecap='round'/><circle r='4' fill='" + NUIT + "'/>" + txt(0, 30, "24,2 kg ?", { s: 13 }) + "</g>";
        s += txt(145, 212, "balance du commerçant", { s: 11.5, c: GRIS, w: 600 }) + txt(470, 190, "balance de cuisine de Mme Ngo Bayiha", { s: 11.5, c: GRIS, w: 600 });
        return svg(640, 220, "À gauche, la balance électronique du commerçant affiche 25 kilogrammes, et 0,8 kilogramme à vide ; à droite, une balance à aiguille indique environ 24,2 kilogrammes", lin(id + "ba", ["#D7DCE3", "#A7AEB9"], true) + lin(id + "sac", ["#F4E3C3", "#E2C896", "#B8975E"]), s);
      })(),
      legende: "À Douala : l'étal d'un grossiste du marché Mboppi, puis la cuisine de Mme Ngo Bayiha à Akwa.",
      contexte: "<p>Mme Ngo Bayiha achète un sac de riz étiqueté <strong>25 kg</strong>. Sur la balance électronique du commerçant, il affiche 25,0 kg. Avant de partir, elle remarque que la balance affiche <strong>0,8 kg</strong> quand le plateau est vide. Le commerçant hausse les épaules : « Une balance électronique ne se trompe jamais. »</p><p>À la maison, son fils Samuel, élève de 2nde C, pèse le sac <strong>cinq fois</strong> sur la balance de cuisine bien tarée (aiguille sur 0 à vide). Les cinq lectures ne sont pas identiques.</p>",
      documents: [
        { t: "Les cinq pesées de Samuel", html: "<table class='donnees'><tr><th>Pesée</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><th>Masse (kg)</th><td>24,1</td><td>24,3</td><td>24,2</td><td>24,4</td><td>24,0</td></tr></table><p>Balance à aiguille graduée tous les 100 g.</p>" },
        { t: "Ce que dit la loi", html: "<p>Les instruments de pesage du commerce sont contrôlés par le service de la métrologie légale. Un écart de plus de 0,2 % sur une masse vendue est une fraude.</p>" }
      ],
      question: "Le sac fait-il vraiment 25 kg ? D'où viennent les écarts entre les deux balances, et entre les cinq pesées de Samuel ?",
      tache: "Rédige pour Mme Ngo Bayiha un compte rendu de mesure : la masse du sac avec son incertitude, et l'explication des écarts.",
      hypotheses: [
        "Le commerçant a raison : une balance électronique ne peut pas se tromper.",
        "Les cinq pesées ne sont pas identiques : la balance de Samuel est inutilisable.",
        "La balance du commerçant ajoute 0,8 kg à toutes les pesées ; le sac pèse environ 24,2 kg, à quelques centaines de grammes près."
      ]
    },
    parties: [
      { t: "Grandeur, unité, instrument", html: (M_OLD ? M_OLD.parties[0].html : "") +
        "<div class='methode'><b>Lire un pied à coulisse au 1/10 de mm</b><ol><li>Lis sur la règle les millimètres entiers placés <strong>avant</strong> le zéro du vernier.</li><li>Cherche le trait du vernier qui est <strong>exactement aligné</strong> avec un trait de la règle.</li><li>Son numéro donne les dixièmes de millimètre.</li></ol></div>",
        planches: [{ type: "3d", titre: "Le pied à coulisse", legende: "Tourne l'instrument : la règle graduée en mm, le coulisseau portant le vernier (10 divisions sur 9 mm) et les deux becs qui serrent un tuyau en cuivre. Le curseur fait glisser le coulisseau.",
          modele: { h: 340, rx: -46, ry: 8, echelle: 1.05, alt: "Pied à coulisse en trois dimensions serrant un tuyau de cuivre", eclate: "Ouvrir les becs", jouer: "Ouvrir les becs", objets: piedCoulisse3D(),
            etiquettes: [{ p: [120, 6, -10], t: "Règle (mm)", cote: "d" }, { p: [-140, 12, 16], t: "Vernier au 1/10", ec: [44, 0, 0] }, { p: [-192, 30, 70], t: "Tuyau mesuré" }, { p: [-205, 4, 100], t: "Bec fixe" }] } }],
        fil: { html: "<p>Samuel commence par vérifier sa balance : à vide, l'aiguille est sur <strong>0</strong>. Celle du commerçant affiche 0,8 kg à vide : elle n'est pas « remise à zéro » (tarée). Un instrument électronique peut donc se tromper s'il est mal réglé.</p>", verdicts: [[0, "rejetee", "La balance affiche 0,8 kg à vide : elle est mal tarée, toutes ses pesées sont faussées."]] },
        retenir: "Grandeur + nombre + unité ; vérifier le zéro de l'instrument avant de mesurer." },

      { t: "Les différents types d'erreur", html: (M_OLD ? M_OLD.parties[1].html : ""),
        planches: [{ type: "2D", titre: "Erreur systématique ou erreur aléatoire ?", legende: "Des mesures groupées mais décalées trahissent une erreur systématique (on corrige l'instrument) ; des mesures dispersées autour du centre trahissent une erreur aléatoire (on répète et on fait la moyenne).", svg: PLANCHE_CIBLES }],
        fil: { html: "<p>Les 0,8 kg affichés à vide s'ajoutent à <strong>chaque</strong> pesée du commerçant, toujours dans le même sens : c'est une erreur <strong>systématique</strong>. 25,0 − 0,8 = <strong>24,2 kg</strong>. Les petits écarts entre les pesées de Samuel (24,0 à 24,4) vont tantôt en plus, tantôt en moins : erreur <strong>aléatoire</strong> (lecture de l'aiguille, position du sac). Elle ne rend pas la balance inutilisable : on la réduit en faisant la moyenne.</p>", verdicts: [[1, "rejetee", "Des écarts aléatoires sont normaux : on les réduit par la moyenne, l'instrument reste utilisable."]] },
        retenir: "Systématique : même sens, on corrige l'instrument. Aléatoire : on répète et on fait la moyenne." },

      { t: "Écrire un résultat de mesure", html: (M_OLD ? M_OLD.parties[2].html : "") +
        "<div class='methode'><b>Exploiter une série de mesures</b><ol><li>Calcule la <strong>moyenne</strong> m̄ des mesures.</li><li>Prends comme incertitude ΔG le plus grand écart entre une mesure et la moyenne (ou la demi-étendue).</li><li>Écris G = (m̄ ± ΔG) unité, puis l'incertitude relative ΔG/m̄ en %.</li></ol></div>",
        fil: { html: "<p>Moyenne des cinq pesées : (24,1 + 24,3 + 24,2 + 24,4 + 24,0) ÷ 5 = 121,0 ÷ 5 = <strong>24,2 kg</strong>. Plus grand écart à la moyenne : 0,2 kg. Donc <strong>m = (24,2 ± 0,2) kg</strong>, soit une incertitude relative de 0,2 ÷ 24,2 ≈ 0,8 %. Les 25 kg annoncés sont hors de l'intervalle [24,0 ; 24,4] : il manque environ 800 g, soit 3,2 %, bien au-delà des 0,2 % tolérés.</p>", verdicts: [[2, "validee", "Balance corrigée : 25,0 − 0,8 = 24,2 kg, exactement la moyenne de Samuel : m = (24,2 ± 0,2) kg."]] },
        retenir: "G = (valeur moyenne ± incertitude) unité ; deux mesures sont compatibles si leurs intervalles se recouvrent." },
      M_OLD && M_OLD.parties[3] ? M_OLD.parties[3] : { t: "Entraînement", html: "" }
    ],
    denouement: {
      titre: "m = (24,2 ± 0,2) kg : il manque 800 g",
      etapes: [
        "La balance du commerçant affiche 0,8 kg à vide : elle est mal tarée (indice 1).",
        "Cette erreur systématique fausse toutes ses pesées : 25,0 − 0,8 = 24,2 kg (indice 2).",
        "Les écarts de Samuel sont aléatoires : on fait la moyenne (indice 2).",
        "Moyenne 24,2 kg, incertitude 0,2 kg : m = (24,2 ± 0,2) kg, 25 kg est exclu (indice 3)."
      ],
      reponse: "<p>La balance du commerçant affiche 0,8 kg à vide : elle n'est pas tarée et ajoute 0,8 kg à chaque pesée. C'est une erreur systématique, qui ne disparaît pas en répétant la mesure ; corrigée, sa lecture donne 25,0 − 0,8 = 24,2 kg. Les cinq pesées de Samuel, faites sur une balance bien tarée, varient de 24,0 à 24,4 kg : ce sont des erreurs aléatoires de lecture, que l'on réduit en calculant la moyenne, 24,2 kg. Le plus grand écart à la moyenne est de 0,2 kg, d'où le résultat <strong>m = (24,2 ± 0,2) kg</strong>, avec une incertitude relative d'environ 0,8 %. Les deux balances sont donc d'accord une fois l'erreur corrigée, et le sac ne pèse pas 25 kg : il manque environ 800 g, bien au-delà de la tolérance légale.</p>",
      transfert: "<p>Au laboratoire, quatre groupes mesurent la période d'un pendule : 1,42 s ; 1,38 s ; 1,40 s ; 1,44 s. Le chronomètre du groupe 4 démarre toujours 0,04 s en retard. Corrige la mesure du groupe 4, puis donne le résultat avec son incertitude. <em>(1,40 s ; T = (1,40 ± 0,02) s.)</em></p>"
    },
    revision: M_OLD ? M_OLD.revision.concat(["Vernier au 1/10 : mm entiers avant le zéro, puis le trait du vernier aligné donne les dixièmes."]) : [],
    exo: M_OLD ? M_OLD.exo : "",
    quiz: M_OLD ? M_OLD.quiz : []
  });

  /* ═══════════════════════ SIMULATIONS (VRT_A) ═══════════════════════ */
  function $(el, s) { return el.querySelector(s); }
  function curseur(lib, min, max, pas, val, unite) {
    return "<label class='labo-c'><span>" + lib + " : <b data-v>" + val + "</b>" + (unite || "") + "</span><input type='range' min='" + min + "' max='" + max + "' step='" + pas + "' value='" + val + "'></label>";
  }
  function moinsAnimer() { try { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } }

  /* Rutherford : faisceau de particules α sur une feuille d'or (modèle de Rutherford ou de Thomson) */
  VRT_A("2nde-c-chimie-rutherford", 0, "Bombarde la feuille d'or et compte les éclairs", function (el) {
    el.innerHTML = "<canvas width='640' height='300' style='width:100%;height:auto;display:block;border-radius:12px;background:#0B1226' aria-label='Simulation : des particules alpha traversent une feuille d or'></canvas>" +
      "<div class='labo-cs' style='display:flex;flex-wrap:wrap;gap:8px;margin-top:10px'><button type='button' class='btn-l' data-go>Lancer le faisceau</button><button type='button' class='btn-l' data-mod>Modèle : Rutherford</button>" + curseur("Taille du noyau (agrandie)", 2, 10, 1, 4, "") + "</div>" +
      "<p class='labo-r' data-res></p><p class='an-note'>Le noyau est dessiné des milliers de fois trop gros pour être visible : dans la réalité, environ 1 particule sur 10 000 seulement rebondit. Passe au modèle de Thomson (charge positive étalée) : plus aucun rebond.</p>";
    var cv = $(el, "canvas"), ctx = cv.getContext("2d"), W = 640, H = 300, dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
    var thomson = false, rn = 4, V0 = 4.2, P = [], N = [], cpt = { t: 0, d: 0, r: 0 }, raf = 0, actif = false, i, j;
    function d0() { return rn * 0.12; }
    for (i = 0; i < 2; i++) for (j = 0; j < 6; j++) N.push([312 + i * 26, 30 + j * 48 + i * 24]);
    var inp = $(el, "input"), res = $(el, "[data-res]");
    inp.addEventListener("input", function () { rn = +inp.value; $(el, "[data-v]").textContent = rn; dessine(); });
    $(el, "[data-mod]").addEventListener("click", function () { thomson = !thomson; this.textContent = "Modèle : " + (thomson ? "Thomson" : "Rutherford"); cpt = { t: 0, d: 0, r: 0 }; P = []; dessine(); });
    $(el, "[data-go]").addEventListener("click", function () { actif = !actif; this.textContent = actif ? "Pause" : "Lancer le faisceau"; if (actif) boucle(); else cancelAnimationFrame(raf); });
    function nouveau() { P.push({ x: 0, y: 14 + Math.random() * (H - 28), vx: V0, vy: 0, tr: [], fin: false }); }
    /* Coulomb : distance minimale d'approche de face d0 = 2k / v0² ; Thomson : même charge étalée dans une boule de rayon R0 */
    function avance(p, T) {
      var k = d0() * V0 * V0 / 2, t = 0, R0 = 16;
      while (t < T) {
        var ax = 0, ay = 0, dmin = 1e9;
        N.forEach(function (n) {
          var dx = p.x - n[0], dy = p.y - n[1], d = Math.sqrt(dx * dx + dy * dy) + 1e-9, f;
          dmin = Math.min(dmin, d);
          f = thomson ? (d < R0 ? k * d / (R0 * R0 * R0) : k / (d * d)) : k / (d * d);
          ax += f * dx / d; ay += f * dy / d;
        });
        var dt = Math.max(0.002, Math.min(1, 0.08 * dmin / V0, T - t));
        p.vx += ax * dt; p.vy += ay * dt; p.x += p.vx * dt; p.y += p.vy * dt; t += dt;
      }
      p.tr.push([p.x, p.y]); if (p.tr.length > 70) p.tr.shift();
      if (p.x < -4 || p.x > W + 4 || p.y < -4 || p.y > H + 4) {
        p.fin = true; var ang = Math.abs(Math.atan2(p.vy, p.vx)) * 180 / Math.PI;
        if (ang > 90) cpt.r++; else if (ang > 10) cpt.d++; else cpt.t++;
      }
    }
    function dessine() {
      ctx.fillStyle = "rgba(11,18,38,1)"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(242,201,76,.16)"; ctx.fillRect(292, 0, 64, H);
      N.forEach(function (n) {
        if (thomson) { var g = ctx.createRadialGradient(n[0], n[1], 1, n[0], n[1], 16); g.addColorStop(0, "rgba(255,120,90,.55)"); g.addColorStop(1, "rgba(255,120,90,.08)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n[0], n[1], 16, 0, 7); ctx.fill(); }
        else { ctx.fillStyle = "rgba(120,150,230,.10)"; ctx.beginPath(); ctx.arc(n[0], n[1], 16, 0, 7); ctx.fill(); ctx.fillStyle = "#FFD54A"; ctx.shadowColor = "#FFD54A"; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(n[0], n[1], rn * 0.5, 0, 7); ctx.fill(); ctx.shadowBlur = 0; }
      });
      P.forEach(function (p) {
        for (var k = 1; k < p.tr.length; k++) { ctx.strokeStyle = "rgba(255,138,80," + (k / p.tr.length * 0.8).toFixed(2) + ")"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(p.tr[k - 1][0], p.tr[k - 1][1]); ctx.lineTo(p.tr[k][0], p.tr[k][1]); ctx.stroke(); }
        ctx.fillStyle = "#FFB38A"; ctx.beginPath(); ctx.arc(p.x, p.y, 2.4, 0, 7); ctx.fill();
      });
      var tot = cpt.t + cpt.d + cpt.r;
      res.innerHTML = "Particules arrivées : <b>" + tot + "</b> · traversent (moins de 10°) : <b>" + cpt.t + "</b> · déviées : <b>" + cpt.d + "</b> · renvoyées vers l'arrière : <b>" + cpt.r + "</b>";
    }
    function boucle() {
      if (Math.random() < 0.6) nouveau();
      P.forEach(function (p) { avance(p, 2); });
      P = P.filter(function (p) { return !p.fin; });
      dessine(); if (actif) raf = requestAnimationFrame(boucle);
    }
    dessine();
    if (moinsAnimer()) $(el, "[data-go]").textContent = "Lancer le faisceau (animation)";
  });

  /* Division euclidienne : ranger a mangues dans des cagettes de b */
  VRT_A("5e-maths-division-euclidienne", 0, "Range les mangues dans les cagettes", function (el) {
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:8px 18px'>" + curseur("Mangues (a)", 1, 300, 1, 250) + curseur("Mangues par cagette (b)", 2, 30, 1, 24) + "</div><svg viewBox='0 0 640 260' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    var I = el.querySelectorAll("input"), V = el.querySelectorAll("[data-v]"), sv = $(el, "[data-s]"), id = "dvA";
    function maj() {
      var a = +I[0].value, b = +I[1].value, qq = Math.floor(a / b), r = a - b * qq, s = "<defs>" + defsMangue(id) + "</defs>", k, max = Math.min(qq, 24), col = 8;
      V[0].textContent = a; V[1].textContent = b;
      for (k = 0; k < max; k++) {
        var x = 8 + (k % col) * 66, y = 8 + Math.floor(k / col) * 60;
        s += "<rect x='" + x + "' y='" + y + "' width='60' height='52' rx='6' fill='#E2B57A' stroke='#8A5A2D'/><rect x='" + (x + 4) + "' y='" + (y + 4) + "' width='52' height='44' rx='4' fill='#C08850' opacity='.45'/>";
        var cc = Math.ceil(Math.sqrt(b * 1.3)), rr = Math.ceil(b / cc), dm = Math.min(46 / cc, 40 / rr);
        for (var m = 0; m < b; m++) s += "<circle cx='" + (x + 7 + dm / 2 + (m % cc) * dm).toFixed(1) + "' cy='" + (y + 6 + dm / 2 + Math.floor(m / cc) * dm).toFixed(1) + "' r='" + (dm * 0.42).toFixed(1) + "' fill='url(#" + id + "m)'/>";
      }
      if (qq > max) s += "<text x='540' y='" + (8 + Math.ceil(max / col) * 60 + 4) + "' font-size='13' font-weight='700' fill='" + GRIS + "'>… et " + (qq - max) + " de plus</text>";
      var y0 = 8 + Math.ceil(max / col) * 60 + (qq > max ? 10 : 0);
      for (k = 0; k < r; k++) s += mangue(id, 20 + (k % 30) * 20, y0 + 30 + Math.floor(k / 30) * 18, 8, k * 31);
      sv.setAttribute("viewBox", "0 0 640 " + (y0 + 34 + Math.ceil(r / 30) * 18));
      s += "<text x='8' y='" + (y0 + 14) + "' font-size='12' font-weight='700' fill='#C2540A'>" + (r ? "reste : " + r + " mangue" + (r > 1 ? "s" : "") : "reste : 0 (b divise a)") + "</text>";
      sv.innerHTML = s;
      $(el, "[data-r]").innerHTML = "<b>" + a + " = " + b + " × " + qq + " + " + r + "</b> avec " + r + " &lt; " + b + " · quotient : <b>" + qq + "</b> cagette" + (qq > 1 ? "s" : "") + " pleine" + (qq > 1 ? "s" : "") + " · reste : <b>" + r + "</b>" + (r ? " · pour tout transporter : <b>" + (qq + 1) + "</b> cagettes" : "");
    }
    I[0].addEventListener("input", maj); I[1].addEventListener("input", maj); maj();
  });

  /* Pied à coulisse : lire un vernier au 1/10 de mm */
  VRT_A("2nde-c-physique-mesure", 0, "Lis le pied à coulisse, puis vérifie ta lecture", function (el) {
    el.innerHTML = "<svg viewBox='0 0 640 190' class='an-svg' data-s></svg><div style='display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px'><button type='button' class='btn-l' data-n>Nouvel objet</button><label class='labo-c'><span>Ta lecture (mm)</span><input type='text' inputmode='decimal' size='6' data-l style='font:inherit;padding:6px 8px;border:1px solid #C9D2E3;border-radius:8px'></label><button type='button' class='btn-l' data-v>Vérifier</button></div><p class='labo-r' data-r>Lis les millimètres avant le zéro du vernier, puis cherche le trait du vernier aligné avec la règle.</p>";
    var sv = $(el, "[data-s]"), L = 23.7, K = 14;   /* 14 px par mm */
    function dessine() {
      var x0 = 40, s = "<defs>" + lin("pcR", ["#EEF1F5", "#C3C9D2"], true) + lin("pcV", ["#DDE2E9", "#A9B1BD"], true) + "</defs>";
      s += "<rect x='20' y='40' width='600' height='46' rx='4' fill='url(#pcR)' stroke='#7F8794'/>";
      for (var m = 0; m <= 41; m++) { var x = x0 + m * K; if (x > 615) break; var h = m % 10 ? (m % 5 ? 12 : 18) : 24; s += "<path d='M" + x + " 86V" + (86 - h) + "' stroke='#1B2233' stroke-width='1.2'/>"; if (m % 10 === 0) s += "<text x='" + x + "' y='56' font-size='12' font-weight='700' text-anchor='middle' fill='#1B2233'>" + m / 10 + "</text>"; }
      
      var xv = x0 + L * K;
      s += "<rect x='" + (xv - 18) + "' y='86' width='" + (10 * 0.9 * K + 40) + "' height='44' rx='4' fill='url(#pcV)' stroke='#7F8794'/>";
      for (var v = 0; v <= 10; v++) { var xx = xv + v * 0.9 * K; s += "<path d='M" + xx.toFixed(1) + " 86V" + (v % 5 ? 98 : 104) + "' stroke='#1B2233' stroke-width='1.2'/>"; if (v % 5 === 0) s += "<text x='" + xx.toFixed(1) + "' y='118' font-size='11' font-weight='700' text-anchor='middle' fill='#1B2233'>" + v + "</text>"; }
      s += "<rect x='20' y='86' width='16' height='80' fill='#B5BCC7' stroke='#7F8794'/><rect x='" + (xv - 18) + "' y='130' width='16' height='36' fill='#B5BCC7' stroke='#7F8794'/>";
      s += "<rect x='36' y='136' width='" + (xv - 18 - 36) + "' height='26' rx='13' fill='url(#pcCu)'/>";
      sv.innerHTML = s.replace("</defs>", lin("pcCu", ["#F0B27A", "#B87333", "#7A4A1E"], true) + "</defs>");
    }
    function nouveau() { L = Math.round((8 + Math.random() * 28) * 10) / 10; $(el, "[data-l]").value = ""; $(el, "[data-r]").textContent = "Nouvel objet serré entre les becs : à toi de lire."; dessine(); }
    $(el, "[data-n]").addEventListener("click", nouveau);
    $(el, "[data-v]").addEventListener("click", function () {
      var u = parseFloat(String($(el, "[data-l]").value).replace(",", ".")), ent = Math.floor(L + 1e-9), dix = Math.round((L - ent) * 10);
      $(el, "[data-r]").innerHTML = isNaN(u) ? "Écris un nombre, par exemple 23,7." : Math.abs(u - L) < 0.05 ? "<b>Exact : " + String(L).replace(".", ",") + " mm.</b> " + ent + " mm avant le zéro, et le trait " + dix + " du vernier est aligné." : "Pas tout à fait. Lecture correcte : <b>" + String(L).replace(".", ",") + " mm</b> (" + ent + " mm entiers, trait n° " + dix + " du vernier aligné).";
    });
    dessine();
  });

  /* Pesées répétées : moyenne et incertitude ; balance tarée ou non */
  VRT_A("2nde-c-physique-mesure", 2, "Pèse le sac autant de fois que tu veux", function (el) {
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:8px'><button type='button' class='btn-l' data-p>Peser le sac</button><button type='button' class='btn-l' data-b>Balance : celle de Samuel (tarée)</button><button type='button' class='btn-l' data-z>Effacer</button></div><svg viewBox='0 0 640 150' class='an-svg' data-s></svg><p class='labo-r' data-r>Appuie plusieurs fois sur « Peser le sac ».</p>";
    var M = [], com = false, sv = $(el, "[data-s]"), R = alea(7);
    function gauss() { var u = R() || 0.5, v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    function X(m) { return 40 + (m - 23.5) / 2 * 560; }
    function maj() {
      var s = "<path d='M30 100H620' stroke='" + NUIT + "' stroke-width='1.5'/>", k;
      for (k = 0; k <= 20; k++) { var m = 23.5 + k * 0.1; s += "<path d='M" + X(m) + " 100v" + (k % 5 ? 6 : 10) + "' stroke='" + NUIT + "'/>"; if (k % 5 === 0) s += "<text x='" + X(m) + "' y='124' font-size='11' text-anchor='middle' fill='" + GRIS + "'>" + m.toFixed(1).replace(".", ",") + "</text>"; }
      s += "<path d='M" + X(25) + " 30V100' stroke='#A31238' stroke-dasharray='4 4'/><text x='" + X(25) + "' y='24' font-size='11' font-weight='700' text-anchor='middle' fill='#A31238'>étiquette : 25 kg</text>";
      var cnt = {};
      M.forEach(function (m) { var key = m.toFixed(1); cnt[key] = (cnt[key] || 0) + 1; s += "<circle cx='" + X(m) + "' cy='" + (96 - cnt[key] * 9) + "' r='4.2' fill='" + (com ? ROUGE : BLEU) + "'/>"; });
      if (M.length) {
        var moy = M.reduce(function (a, b) { return a + b; }, 0) / M.length, dg = Math.max.apply(null, M.map(function (m) { return Math.abs(m - moy); }));
        s += "<rect x='" + X(moy - dg) + "' y='132' width='" + (X(moy + dg) - X(moy - dg)) + "' height='8' rx='4' fill='#C2540A' opacity='.5'/><path d='M" + X(moy) + " 128V144' stroke='#C2540A' stroke-width='2.5'/>";
        $(el, "[data-r]").innerHTML = M.length + " pesée" + (M.length > 1 ? "s" : "") + " · moyenne : <b>" + moy.toFixed(2).replace(".", ",") + " kg</b> · plus grand écart : <b>" + dg.toFixed(1).replace(".", ",") + " kg</b> · résultat : <b>m = (" + moy.toFixed(1).replace(".", ",") + " ± " + Math.max(0.1, dg).toFixed(1).replace(".", ",") + ") kg</b>" + (com ? " · ⚠️ balance non tarée : toutes les valeurs sont décalées de +0,8 kg (erreur systématique)." : "");
      } else $(el, "[data-r]").textContent = "Appuie plusieurs fois sur « Peser le sac ».";
      sv.innerHTML = s;
    }
    $(el, "[data-p]").addEventListener("click", function () { var m = Math.round((24.2 + Math.max(-0.2, Math.min(0.2, gauss() * 0.11)) + (com ? 0.8 : 0)) * 10) / 10; M.push(m); maj(); });
    $(el, "[data-b]").addEventListener("click", function () { com = !com; M = []; this.textContent = "Balance : " + (com ? "celle du commerçant (0,8 kg à vide)" : "celle de Samuel (tarée)"); maj(); });
    $(el, "[data-z]").addEventListener("click", function () { M = []; maj(); });
    maj();
  });
})();
