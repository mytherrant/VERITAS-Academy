/* Leçons APPROFONDIES — lot 8, classes d'examen (17/11/2026) : présent simple et continu (anglais 3e), prépositions
   mixtes (allemand 3e), consultation médicale et superlatif (espagnol 3e), préparation du bac (Tle).
   Même gabarit et même mécanisme que 11-approfondies-lot4.js (remplacement EN PLACE ; ordre, clé, fiche APC, examen
   et scènes conservés). Illustrations réalistes ; simulations VRT_A en fin de fichier. */
(function () {
  "use strict";
  var NUIT = "#001136", BLEU = "#1E499B", GRIS = "#4D5163", VERT = "#17784D", ROUGE = "#C62828";

  function txt(x, y, t, o) {
    o = o || {};
    return "<text x='" + x + "' y='" + y + "' text-anchor='" + (o.a || "middle") + "' font-size='" + (o.s || 12) + "' font-weight='" + (o.w || 700) + "' fill='" + (o.c || NUIT) + "'" + (o.i ? " font-style='italic'" : "") + (o.halo ? " stroke='#fff' stroke-width='3' paint-order='stroke'" : "") + ">" + t + "</text>";
  }
  function lin(id, cs, vertical) {
    var s = "<linearGradient id='" + id + "'" + (vertical ? " x1='0' y1='0' x2='0' y2='1'" : "") + ">";
    cs.forEach(function (c, i) { s += "<stop offset='" + (i / (cs.length - 1)).toFixed(2) + "' stop-color='" + c + "'/>"; });
    return s + "</linearGradient>";
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
  /* silhouette debout : y = centre de la tête ; environ 92 px de haut */
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
  function telephone(x, y, lignes) {
    var s = "<g transform='translate(" + x + " " + y + ")'><rect width='170' height='200' rx='22' fill='#1F2328'/><rect x='8' y='14' width='154' height='172' rx='14' fill='#ECE5DD'/><rect x='8' y='14' width='154' height='26' rx='12' fill='#075E54'/>" + txt(20, 32, "Kwame (Accra)", { s: 11, a: "start", c: "#fff" });
    lignes.forEach(function (l, i) { var moi = l[0], w = 132, yy = 50 + i * 44; s += "<rect x='" + (moi ? 22 : 14) + "' y='" + yy + "' width='" + w + "' height='36' rx='8' fill='" + (moi ? "#DCF8C6" : "#fff") + "'/>" + txt(moi ? 28 : 20, yy + 15, l[1], { s: 9.5, a: "start", w: 500 }) + (l[2] ? txt(moi ? 28 : 20, yy + 29, l[2], { s: 9.5, a: "start", w: 500 }) : ""); });
    return s + "</g>";
  }

  /* ═══════════════════════ 3e ANGLAIS — PRESENT SIMPLE ET PRESENT CONTINUOUS ═══════════════════════ */
  var EN_OLD = ancien("3e-en-present");
  function reveil3D() {
    var o = [], k, hEc = [0, 0, 0];
    o.push({ f: "boite", c: [0, -10, 0], d: [380, 8, 200], coul: "#7A4A22", dessus: "#A8703A" });
    o.push({ f: "cylindre", c: [0, 70, -20], r: 70, h: 40, n: 32, axe: "z", coul: "#C62828", dessus: "#D84040" });
    o.push({ f: "cylindre", c: [0, 70, -23], r: 60, h: 2, n: 32, axe: "z", coul: "#FBF8F2" });
    for (k = 0; k < 12; k++) { var a = k / 12 * 2 * Math.PI; o.push({ f: "boite", c: [52 * Math.sin(a), 70 + 52 * Math.cos(a) - 3, -24.5], d: [3, k % 3 ? 4 : 8, 1], coul: "#1F2328", div: false }); }
    o.push({ f: "poly", pts: [[-2, 70, -25], [2, 70, -25], [22, 70 + 22 * 0.9, -25], [20, 70 + 24 * 0.9, -25]], coul: "#1F2328", ec: hEc });
    o.push({ f: "poly", pts: [[-2, 68, -25.5], [2, 72, -25.5], [-40, 56, -25.5], [-40, 52, -25.5]], coul: "#1F2328" });
    o.push({ f: "sphere", c: [0, 70, -26], r: 4, coul: "#B08D57" });
    [-1, 1].forEach(function (sg) { o.push({ f: "sphere", c: [sg * 46, 140, -20], r: 26, coul: "#C9CED6" }); o.push({ f: "cylindre", c: [sg * 36, 116, -20], r: 3, h: 16, n: 8, coul: "#8E96A6" }); });
    o.push({ f: "boite", c: [0, 150, -20], d: [6, 22, 6], coul: "#8E96A6", div: false });
    [-1, 1].forEach(function (sg) { o.push({ f: "cylindre", c: [sg * 46, -2, -20], r: 6, r2: 3, h: 10, n: 10, coul: "#8E96A6" }); });
    return o;
  }
  remplacer("3e-en-present", {
    c: "3e", m: "anglais", titre: "Revise the present tenses: simple and continuous", duree: 30,
    accroche: "« I am knowing you since one year » : Kwame, your pen pal in Accra, does not understand your message.",
    intro: "A WhatsApp chat with a Ghanaian pen pal is your guiding thread: in each part, a clue helps you choose between three ideas.",
    objectifs: ["use the simple present for habits, routines and general truths", "use the present continuous for actions happening now", "recognise time markers (every day, now, at the moment…)", "avoid the continuous with state verbs (know, like, want…)"],
    enquete: {
      titre: "Junior's message to Kwame",
      svg: svg(640, 230, "Écran de téléphone : conversation en anglais entre Junior et son correspondant Kwame, avec des fautes de temps", "", "<rect width='640' height='230' fill='#EEF3F8'/>" + telephone(40, 14, [[0, "Hi Junior! What do you do", "every Saturday?"], [1, "Every Saturday I am going", "to the market with Mama."], [1, "Now I write to you. I am", "knowing you since one year!"]]) + perso(330, 100, "#5A3A1E", "#DCE6F2", "#1E499B") + bulle(380, 60, 230, "Which tense is correct?") + txt(470, 200, "Junior, 3e, Bafoussam", { s: 12, c: GRIS, w: 600 })),
      legende: "In Bafoussam: Junior chats on WhatsApp with Kwame, his pen pal in Accra, Ghana.",
      contexte: "<p>Kwame asks: « What do you do every Saturday? » Junior answers: « Every Saturday <em>I am going</em> to the market with Mama. Now <em>I write</em> to you. <em>I am knowing</em> you since one year! » Kwame replies: « Are you going to the market right now? I don't understand. »</p><p>Junior's sister says: « The -ing form is more modern, use it everywhere! » His cousin says: « In English, both tenses mean the same thing. »</p>",
      documents: [{ t: "Time markers", html: "<table class='donnees'><tr><th>Simple present</th><td>every day, every Saturday, always, usually, often, sometimes, never</td></tr><tr><th>Present continuous</th><td>now, right now, at the moment, today, look!, listen!</td></tr></table>" }],
      question: "Which tense should Junior use in each sentence, and why?",
      tache: "Correct Junior's three sentences and explain each correction with a rule and a time marker.",
      hypotheses: ["The -ing form is more modern: use it everywhere.", "Both tenses mean the same thing.", "The simple present is for habits; the continuous is for actions happening now; state verbs stay in the simple present."]
    },
    parties: [
      { t: "The simple present", html: partie(EN_OLD, 0) +
        "<div class='attention'><b>Don't forget the -s</b>With he / she / it: she <strong>goes</strong>, he <strong>watches</strong>, Mama <strong>buys</strong>. Questions and negatives use <strong>do / does</strong>: Does she sell plantains? She doesn't sell rice.</div>",
        planches: [{ type: "3d", titre: "The alarm clock of habits", legende: "Every day, the alarm clock rings at 6 o'clock: habits and routines are expressed with the simple present. « Every Saturday I go to the market. »",
          modele: { h: 340, rx: -12, ry: 24, echelle: 1, alt: "Réveil rouge à deux cloches posé sur une table en bois", objets: reveil3D(), etiquettes: [{ p: [0, 166, -20], t: "Every day it rings at 6." }, { p: [60, 70, -25], t: "Habits → simple present", cote: "d" }] } }],
        fil: { html: "<p>« Every Saturday » is a habit marker: Junior must write « Every Saturday I <strong>go</strong> to the market ». With « I am going », Kwame thought he was going right now.</p>", verdicts: [[0, "rejetee", "« Every Saturday » is a habit: the simple present is required."]] },
        retenir: "Habits, routines, general truths → simple present (+ -s with he / she / it)." },
      { t: "The present continuous", html: partie(EN_OLD, 1),
        planches: [{ type: "2D", titre: "Right now at Mokolo market", legende: "At this moment: Mama is buying tomatoes, the seller is weighing them, a boy is pushing a cart, a girl is talking on the phone. Actions in progress → present continuous.", svg: (function () {
          var s = "<rect width='640' height='300' fill='#F6EEDC'/><rect y='230' width='640' height='70' fill='#D9C49C'/><path d='M180 120h280l-20 -40h-240Z' fill='#2E7D32'/><path d='M180 120h280v10h-280z' fill='#1B5E20'/><rect x='200' y='170' width='240' height='14' fill='#8B5A2B'/><path d='M210 184v46M430 184v46' stroke='#6B4423' stroke-width='6'/>";
          for (var k = 0; k < 14; k++) s += "<circle cx='" + (214 + (k % 7) * 18) + "' cy='" + (162 - Math.floor(k / 7) * 12) + "' r='8' fill='" + (k % 3 ? "#D7261E" : "#E8492E") + "'/>";
          s += "<path d='M360 160h50l-6 -20h-38Z' fill='#C9CED6'/><path d='M385 140v-14' stroke='#5C6478' stroke-width='3'/>";
          s += perso(160, 150, "#5A3A1E", "#C2540A", "#7B3F99") + perso(320, 104, "#6B4423", "#1E88E5", "#2E3445") + perso(520, 150, "#6B4423", "#F2F2F2", "#2E7D32") + "<rect x='530' y='190' width='70' height='36' rx='4' fill='#8B5A2B'/><circle cx='545' cy='232' r='8' fill='#2C3138'/><circle cx='590' cy='232' r='8' fill='#2C3138'/>" + perso(90, 150, "#5A3A1E", "#F7C948", "#1E499B") + "<rect x='106' y='152' width='7' height='12' rx='2' fill='#1F2328'/>";
          s += bulle(110, 70, 140, "Mama is buying…", "#C2540A") + bulle(300, 30, 170, "The seller is weighing…", "#1E88E5") + bulle(470, 90, 160, "A boy is pushing…", "#2E7D32") + bulle(10, 30, 160, "A girl is phoning…", "#B07A00");
          return svg(640, 300, "Marché animé : une mère achète des tomates, la vendeuse les pèse, un garçon pousse un pousse-pousse, une fille téléphone", "", s);
        })() }],
        fil: { html: "<p>« Now » marks an action in progress: « Now I <strong>am writing</strong> to you ». The two tenses do not mean the same thing: one describes habits, the other describes what is happening at the moment of speaking.</p>", verdicts: [[1, "rejetee", "« I go every Saturday » (habit) ≠ « I am going now » (in progress)."]] },
        retenir: "Now, at the moment, look!, listen! → am / is / are + verb-ing." },
      { t: "Verbs that don't like -ing", html: partie(EN_OLD, 2) +
        "<div class='ex'><b>Since one year?</b>« I am knowing you since one year » has two mistakes: <em>know</em> is a state verb, and English uses the present perfect with <em>for</em>: « I <strong>have known</strong> you <strong>for</strong> one year. » At your level, you can also say: « I <strong>know</strong> you very well. »</div>",
        fil: { html: "<p><em>Know</em> is a state verb: never « am knowing ». The sister's rule (« -ing everywhere ») creates mistakes.</p>", verdicts: [[2, "validee", "Habit → simple present; now → continuous; state verbs → simple form."]] },
        retenir: "know, like, love, want, need, understand, believe: no -ing." }
    ],
    denouement: {
      titre: "Junior's corrected message",
      etapes: ["« Every Saturday » → habit → simple present: I go (clue 1).", "« Now » → action in progress → I am writing (clue 2).", "« know » is a state verb → I know / I have known you for one year (clue 3)."],
      reponse: "<p>Corrected message: « Every Saturday I <strong>go</strong> to the market with Mama. Right now I <strong>am writing</strong> to you. I <strong>have known</strong> you <strong>for</strong> one year! » The simple present expresses habits and routines, with markers like <em>every Saturday</em>; the present continuous expresses an action happening at the moment of speaking, with markers like <em>now</em>; state verbs such as <em>know</em>, <em>like</em> or <em>want</em> are not used in the continuous. The two tenses do not mean the same thing, and the -ing form is not « more modern »: it is simply for actions in progress.</p>",
      transfert: "<p>Write a WhatsApp message of five lines to Kwame: describe your usual Sunday (simple present) and what your family is doing right now (present continuous).</p>"
    },
    revision: (EN_OLD ? EN_OLD.revision : []).concat(["Habits: every day, always, usually → simple present.", "Now, at the moment, look!, listen! → present continuous."]),
    exo: EN_OLD ? EN_OLD.exo : "",
    quiz: [
      q("She ___ to church every Sunday.", "goes", "is going", "go", "Habit: simple present with -s."),
      q("Listen! Somebody ___ .", "is singing", "sings", "sing", "« Listen! » = now."),
      q("I ___ the answer.", "know", "am knowing", "knowing", "State verb: no -ing."),
      q("Every Saturday I ___ to the market.", "go", "am going", "goes", "Habit marker: every Saturday."),
      q("Look! The baby ___ .", "is sleeping", "sleeps", "sleep", "« Look! » = now."),
      q("My father ___ in Garoua.", "works", "is work", "working", "A general fact."),
      q("Does she ___ plantains?", "sell", "sells", "selling", "After does: base form."),
      q("Which marker goes with the present continuous?", "at the moment", "every day", "usually", "Action in progress."),
      q("Which verb is a state verb?", "want", "run", "write", "want, like, know…"),
      q("Now I ___ to you.", "am writing", "write", "writes", "« Now »: in progress.")
    ]
  });

  /* ═══════════════════════ 3e ALLEMAND — WO? WOHIN? ═══════════════════════ */
  var DE_OLD = ancien("3e-de-prepositions");
  function chambre3D() {
    var o = [], ballEc = [0, -72, 0];
    o.push({ f: "boite", c: [0, -10, 0], d: [440, 8, 260], coul: "#9C6B3C", dessus: "#C0894F" });
    o.push({ f: "boite", c: [0, 0, 124], d: [440, 200, 8], coul: "#E9E2D2", dessus: "#F4EFE4", div: false });
    o.push({ f: "boite", c: [-60, 70, 0], d: [180, 8, 100], coul: "#7A4A22", dessus: "#A8703A", div: false });
    [[-140, -40], [20, -40], [-140, 40], [20, 40]].forEach(function (p) { o.push({ f: "boite", c: [p[0], 0, p[1]], d: [8, 70, 8], coul: "#6B4423", div: false }); });
    o.push({ f: "boite", c: [120, 0, 20], d: [60, 40, 60], coul: "#5D3A1E", dessus: "#7A5230", div: false });
    o.push({ f: "boite", c: [120, 40, 48], d: [60, 70, 6], coul: "#5D3A1E", div: false });
    o.push({ f: "boite", c: [-100, 78, -20], d: [40, 6, 30], coul: "#1E499B", dessus: "#2F5FBF", div: false });
    o.push({ f: "sphere", c: [-30, 92, 10], r: 14, coul: "#E8E8E8", ec: ballEc });
    o.push({ f: "sphere", c: [-30, 92, 10], r: 5, coul: "#1F2328", ec: ballEc });
    o.push({ f: "boite", c: [-60, 96, 118], d: [90, 56, 4], coul: "#2E7D32", div: false });
    return o;
  }
  remplacer("3e-de-prepositions", {
    c: "3e", m: "allemand", titre: "Wo? Wohin? Les prépositions de position et de direction", duree: 30,
    accroche: "« Der Ball liegt auf den Tisch » : Lena, la correspondante de Hambourg, sourit. Une seule lettre a tout changé.",
    intro: "La description de ta chambre pour une correspondante allemande te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois règles.",
    objectifs: ["connaître les neuf prépositions mixtes", "choisir le datif (Wo?) ou l'accusatif (Wohin?)", "employer les contractions im, am, ins, ans", "décrire une pièce et des déplacements en allemand"],
    enquete: {
      titre: "La lettre à Lena",
      svg: svg(640, 220, "Une lettre en allemand et un dessin de chambre avec un ballon sur la table", "", "<rect width='640' height='220' fill='#F4F1EA'/><g transform='rotate(-3 170 110)'><rect x='40' y='20' width='260' height='180' rx='6' fill='#fff' stroke='#D9CFBC'/>" + txt(56, 46, "Liebe Lena,", { s: 13, a: "start", c: BLEU, i: true }) + txt(56, 76, "Der Ball liegt auf den Tisch.", { s: 12, a: "start", w: 500, i: true }) + txt(56, 100, "Ich lege das Heft auf dem Bett.", { s: 12, a: "start", w: 500, i: true }) + txt(56, 124, "Ich gehe in die Schule…", { s: 12, a: "start", w: 500, i: true }) + "<path d='M138 80h60M196 104h48' stroke='" + ROUGE + "' stroke-width='2'/></g>" + "<rect x='360' y='40' width='240' height='150' rx='10' fill='#E9E2D2'/><rect x='360' y='150' width='240' height='40' fill='#C0894F'/><rect x='390' y='110' width='120' height='8' fill='#7A4A22'/><path d='M398 118v40M502 118v40' stroke='#6B4423' stroke-width='5'/><circle cx='450' cy='100' r='10' fill='#E8E8E8' stroke='#1F2328'/><rect x='530' y='120' width='40' height='40' fill='#5D3A1E'/>"),
      legende: "À Buea : Brenda, élève de 3e en section bilingue, écrit à Lena, sa correspondante de Hambourg.",
      contexte: "<p>Brenda décrit sa chambre : « Der Ball liegt <em>auf den Tisch</em>. Ich lege das Heft <em>auf dem Bett</em>. » Lena répond gentiment : « Je comprends, mais en allemand, on dirait que ton ballon est en train de voler vers la table ! » Le cousin de Brenda affirme : « Après <em>auf</em>, c'est toujours l'accusatif. » Sa camarade : « Non, ça dépend du verbe. »</p>",
      documents: [{ t: "Le tableau des articles", html: "<table class='donnees'><tr><th></th><th>masc.</th><th>fém.</th><th>neutre</th><th>pluriel</th></tr><tr><th>datif (Wo?)</th><td>dem</td><td>der</td><td>dem</td><td>den …n</td></tr><tr><th>accusatif (Wohin?)</th><td>den</td><td>die</td><td>das</td><td>die</td></tr></table>" }],
      question: "Comment choisir entre datif et accusatif après auf, in, unter… ?",
      tache: "Corrige les phrases de Brenda en justifiant chaque cas par la question Wo? ou Wohin?",
      hypotheses: ["Après auf, c'est toujours l'accusatif.", "Le cas dépend de la question : Wo? (position, sans déplacement) → datif ; Wohin? (direction, déplacement) → accusatif.", "Le cas dépend seulement du genre du nom."]
    },
    parties: [
      { t: "Les neuf prépositions mixtes", html: partie(DE_OLD, 0),
        planches: [{ type: "2D", titre: "Où est le ballon ?", legende: "Neuf positions du ballon autour d'une caisse : in, auf, unter, über, vor, hinter, neben, an, zwischen.", svg: (function () {
          var s = "", P = [["in", 0, 6], ["auf", 0, -46], ["unter", 0, 62], ["über", 0, -96], ["vor", -6, 30], ["hinter", 30, -20], ["neben", 70, 20], ["an", 40, 14], ["zwischen", 0, 0]], k;
          P.forEach(function (p, i) {
            var cx = 75 + (i % 5) * 122, cy = 110 + Math.floor(i / 5) * 160, t = "<g transform='translate(" + cx + " " + cy + ")'>";
            if (p[0] === "zwischen") t += "<rect x='-52' y='-14' width='34' height='40' fill='#C9A576' stroke='#8A6E4B'/><rect x='18' y='-14' width='34' height='40' fill='#C9A576' stroke='#8A6E4B'/>";
            else t += (p[0] === "hinter" ? "<circle cx='" + p[1] + "' cy='" + p[2] + "' r='10' fill='#E8E8E8' stroke='#1F2328'/>" : "") + "<path d='M-30 -14l10 -10h50l-10 10Z' fill='#E3C79C' stroke='#8A6E4B'/><path d='M20 -14l10 -10v40l-10 10Z' fill='#B08A5E' stroke='#8A6E4B'/><rect x='-30' y='-14' width='50' height='40' fill='#C9A576' stroke='#8A6E4B' opacity='" + (p[0] === "in" ? .55 : 1) + "'/>";
            if (p[0] !== "hinter") t += "<circle cx='" + p[1] + "' cy='" + p[2] + "' r='10' fill='#E8E8E8' stroke='#1F2328'/><path d='M" + (p[1] - 4) + " " + (p[2] - 4) + "l4 3l4 -3' stroke='#1F2328' fill='none'/>";
            t += "<rect x='-34' y='26' width='68' height='4' fill='#9C6B3C' opacity='.4'/>" + txt(0, 66, p[0], { s: 15, c: BLEU }) + "</g>";
            s += t;
          });
          return svg(640, 350, "Neuf petites scènes montrant un ballon dans, sur, sous, au-dessus, devant, derrière, à côté, contre une caisse, et entre deux caisses", "", s);
        })() }],
        fil: { html: "<p>Auf, in, unter… sont des prépositions <strong>mixtes</strong> : elles peuvent être suivies du datif <em>ou</em> de l'accusatif. Le cousin se trompe : « auf » n'impose pas toujours l'accusatif.</p>", verdicts: [[0, "rejetee", "Les neuf prépositions mixtes acceptent les deux cas."]] },
        retenir: "in, an, auf, über, unter, vor, hinter, neben, zwischen : prépositions mixtes." },
      { t: "Wo? → datif ; Wohin? → accusatif", html: partie(DE_OLD, 1),
        planches: [{ type: "3d", titre: "Le ballon sur la table, puis sous la table", legende: "Tourne la chambre. Le ballon est sur la table : Wo? → « Der Ball liegt auf dem Tisch » (datif). Le curseur le fait tomber : il va sous la table, Wohin? → « Der Ball rollt unter den Tisch » (accusatif).",
          modele: { h: 340, rx: -20, ry: 28, echelle: 0.95, alt: "Chambre avec table, chaise, cahier bleu et ballon qui passe de la table au sol", eclate: "Faire tomber le ballon", jouer: "Le ballon tombe", objets: chambre3D(),
            etiquettes: [{ p: [-30, 108, 10], t: "auf dem Tisch (Wo?)", ec: [0, -72, 0] }, { p: [-100, 84, -20], t: "das Heft", cote: "d" }, { p: [120, 80, 48], t: "der Stuhl", cote: "d" }] } }],
        fil: { html: "<p>« Der Ball <strong>liegt</strong> auf … Tisch » : liegen n'exprime aucun déplacement → Wo? → datif → <strong>auf dem Tisch</strong>. « Ich <strong>lege</strong> das Heft auf … Bett » : legen exprime un déplacement → Wohin? → accusatif → <strong>auf das Bett</strong>. Le genre ne suffit pas : c'est la question qui décide.</p>", verdicts: [[2, "rejetee", "Tisch est masculin dans les deux cas : dem (Wo?) ou den (Wohin?)."], [1, "validee", "Wo? → datif ; Wohin? → accusatif."]] },
        retenir: "Position (liegen, stehen, sein) → datif ; direction (legen, stellen, gehen) → accusatif." },
      { t: "Les contractions", html: partie(DE_OLD, 2),
        fil: { html: "<p>« Ich gehe in die Schule » est juste (Wohin? → accusatif féminin) ; on dirait aussi « Ich bin <strong>in der</strong> Schule » (Wo?). Avec un nom neutre : « Ich gehe <strong>ins</strong> Kino », « Ich bin <strong>im</strong> Kino ».</p>" },
        retenir: "in + dem = im ; an + dem = am ; in + das = ins ; an + das = ans." }
    ],
    denouement: {
      titre: "La lettre corrigée",
      etapes: ["Auf, in, unter… sont mixtes (indice 1).", "liegen → Wo? → auf dem Tisch ; legen → Wohin? → auf das Bett (indice 2).", "in die Schule : juste ; ins Kino / im Kino (indice 3)."],
      reponse: "<p>Lettre corrigée : « Der Ball liegt <strong>auf dem</strong> Tisch. Ich lege das Heft <strong>auf das</strong> Bett. Ich gehe <strong>in die</strong> Schule. » Les prépositions mixtes (in, an, auf, über, unter, vor, hinter, neben, zwischen) sont suivies du datif quand on répond à la question <em>Wo?</em> (position, sans déplacement : liegen, stehen, sein) et de l'accusatif quand on répond à <em>Wohin?</em> (direction, déplacement : legen, stellen, gehen). Ce n'est ni toujours l'accusatif après auf, ni une question de genre seulement : c'est le sens du verbe qui décide.</p>",
      transfert: "<p>Décris en cinq phrases ta salle de classe à Lena (Wo?), puis raconte en trois phrases où tu ranges tes affaires en arrivant (Wohin?).</p>"
    },
    revision: (DE_OLD ? DE_OLD.revision : []).concat(["liegen / stehen / sein → datif ; legen / stellen / gehen → accusatif."]),
    exo: DE_OLD ? DE_OLD.exo : "",
    quiz: [
      q("Ich gehe ___ Schule (f). (wohin?)", "in die", "in der", "im", "Direction : accusatif féminin."),
      q("Das Buch liegt auf ___ Tisch (m).", "dem", "den", "der", "Position : datif masculin."),
      q("in + das = ?", "ins", "im", "ans", "Contraction de l'accusatif neutre."),
      q("Ich lege das Heft auf ___ Bett (n).", "das", "dem", "den", "legen = déplacement → accusatif."),
      q("Die Katze schläft unter ___ Bett (n).", "dem", "das", "den", "schlafen = position → datif."),
      q("Wir sind ___ Strand (m) von Kribi.", "am", "ans", "an den", "an + dem."),
      q("Er geht ___ Kino (n).", "ins", "im", "in dem", "Wohin? → in das → ins."),
      q("Quelle question appelle le datif ?", "Wo?", "Wohin?", "Wer?", "Position sans déplacement."),
      q("Lequel exprime un déplacement ?", "stellen", "stehen", "liegen", "On pose quelque chose quelque part."),
      q("« zwischen » signifie…", "entre", "derrière", "au-dessus de", "Entre deux objets.")
    ]
  });

  /* ═══════════════════════ 3e ESPAGNOL — EN EL MÉDICO ═══════════════════════ */
  var ES_OLD = ancien("3e-es-medico");
  var CORPS = [["la cabeza", 0, -82, false], ["los ojos", 0, -86, true], ["la garganta", 0, -58, false], ["el brazo", -34, -10, false], ["el estómago", 0, 0, false], ["las manos", 38, 30, true], ["la rodilla", -12, 74, false], ["los pies", 10, 122, true]];
  function corps2D(cx, cy, sel) {
    var s = "<g transform='translate(" + cx + " " + cy + ")'><ellipse cy='132' rx='34' ry='6' fill='#001136' opacity='.15'/>";
    s += "<rect x='-14' y='40' width='12' height='88' rx='6' fill='#6B4423'/><rect x='2' y='40' width='12' height='88' rx='6' fill='#6B4423'/><ellipse cx='-10' cy='128' rx='11' ry='5' fill='#6B4423'/><ellipse cx='10' cy='128' rx='11' ry='5' fill='#6B4423'/>";
    s += "<path d='M-24 -40C-26 -46 -18 -50 0 -50S26 -46 24 -40L20 44H-20Z' fill='#F2F2F2' stroke='#C9D2E3'/><path d='M-14 44H14V76H-14Z' fill='#1E499B'/>";
    s += "<path d='M-24 -38L-40 30' stroke='#6B4423' stroke-width='10' stroke-linecap='round'/><path d='M24 -38L40 30' stroke='#6B4423' stroke-width='10' stroke-linecap='round'/><path d='M-24 -38L-34 -6' stroke='#F2F2F2' stroke-width='12' stroke-linecap='round'/><path d='M24 -38L34 -6' stroke='#F2F2F2' stroke-width='12' stroke-linecap='round'/>";
    s += "<rect x='-6' y='-62' width='12' height='14' fill='#6B4423'/><ellipse cy='-80' rx='17' ry='20' fill='#6B4423'/><path d='M-17 -84C-18 -102 -6 -101 0 -101S18 -102 17 -84C14 -94 -14 -94 -17 -84Z' fill='#1B1410'/><circle cx='-6' cy='-82' r='2' fill='#1B1410'/><circle cx='6' cy='-82' r='2' fill='#1B1410'/>";
    if (sel != null) { var p = CORPS[sel]; s += "<circle cx='" + p[1] + "' cy='" + p[2] + "' r='14' fill='" + ROUGE + "' opacity='.3'/><circle cx='" + p[1] + "' cy='" + p[2] + "' r='14' fill='none' stroke='" + ROUGE + "' stroke-width='2.5'/>"; }
    return s + "</g>";
  }
  function trousse3D() {
    var o = [];
    o.push({ f: "boite", c: [0, -10, 0], d: [420, 8, 220], coul: "#E9EEF3", dessus: "#F7F9FB" });
    o.push({ f: "cylindre", c: [-120, -2, 0], r: 26, h: 80, n: 28, coul: "#5A2A08", dessus: "#6E3610", op: 0.85 }); o.push({ f: "cylindre", c: [-120, 78, 0], r: 26, r2: 12, h: 10, n: 28, coul: "#5A2A08", op: 0.85 });
    o.push({ f: "cylindre", c: [-120, 88, 0], r: 12, h: 14, n: 18, coul: "#FBF8F2" });
    o.push({ f: "boite", c: [-120, 24, -27], d: [40, 34, 2], coul: "#FBF8F2", div: false });
    o.push({ f: "boite", c: [10, -2, 10], d: [90, 30, 60], coul: "#FBF8F2", dessus: "#FFFFFF", div: false });
    o.push({ f: "boite", c: [10, 12, 40], d: [70, 10, 1], coul: "#1E88E5", div: false });
    o.push({ f: "cylindre", c: [60, 2, -60], r: 4, h: 110, n: 10, axe: "x", coul: "#E8F4FA", op: 0.85 });
    o.push({ f: "sphere", c: [60, 6, -60], r: 5, coul: "#C62828" });
    for (var k = 0; k < 22; k++) { var a = k / 21 * Math.PI * 1.4; o.push({ f: "sphere", c: [150 + 50 * Math.cos(a), 2, 40 + 50 * Math.sin(a)], r: 3.4, coul: "#1F2328" }); }
    o.push({ f: "cylindre", c: [150 + 50 * Math.cos(Math.PI * 1.4), -2, 40 + 50 * Math.sin(Math.PI * 1.4)], r: 16, h: 6, n: 20, coul: "#C9CED6", dessus: "#E8ECF1" });
    return o;
  }
  remplacer("3e-es-medico", {
    c: "3e", m: "espagnol", titre: "En el médico : la consultation et le superlatif", duree: 30,
    accroche: "Une médecin espagnole, un enfant fiévreux à Maroua : c'est toi l'interprète. « ¿Qué te duele? »",
    intro: "Une consultation où tu sers d'interprète te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois façons de dire.",
    objectifs: ["dire où l'on a mal avec doler (me duele / me duelen)", "conduire un dialogue de consultation", "employer le superlatif relatif et absolu", "comprendre une ordonnance simple en espagnol"],
    enquete: {
      titre: "L'interprète du centre de santé de Maroua",
      svg: (function () {
        var s = "<rect width='640' height='230' fill='#EEF5F8'/><rect y='190' width='640' height='40' fill='#D9E3EA'/><rect x='250' y='130' width='170' height='16' rx='4' fill='#C9CED6'/><path d='M262 146v44M408 146v44' stroke='#8E96A6' stroke-width='5'/>";
        s += perso(120, 104, "#E8C3A0", "#FFFFFF", "#5C6478") + "<path d='M108 120q12 22 24 0' stroke='#1F2328' stroke-width='2' fill='none'/><circle cx='120' cy='144' r='4' fill='#C9CED6' stroke='#1F2328'/>" + perso(330, 74, "#6B4423", "#F7C948", "#1E499B") + "<g transform='translate(500 104)'><ellipse cy='84' rx='18' ry='4' fill='#001136' opacity='.18'/></g>" + perso(520, 104, "#5A3A1E", "#2E7D32", "#2E7D32");
        s += bulle(40, 30, 160, "¿Qué le duele?", "#1E88E5") + bulle(440, 30, 180, "Il a mal à la tête…", "#2E7D32") + txt(330, 222, "toi, l'interprète", { s: 12, c: GRIS, w: 600 });
        return svg(640, 230, "Une médecin espagnole en blouse blanche, l élève interprète au centre et une mère avec son enfant", "", s);
      })(),
      legende: "À Maroua : une ONG espagnole tient une consultation gratuite ; ton professeur t'a recommandé comme interprète.",
      contexte: "<p>La docteure Lucía ne parle pas français. Une maman explique que son fils a <strong>mal à la tête et à la gorge</strong>, de la <strong>fièvre</strong> depuis hier et mal aux <strong>pieds</strong> après la marche. Ton camarade propose de traduire : « Le duele los pies. » Un autre : « En espagnol, on dit “tiene mal a la cabeza”, comme en français. »</p><p>À la fin, la docteure dit que le centre est « el centro de salud más grande de la región » et que le sirop est « buenísimo ».</p>",
      documents: [{ t: "L'ordonnance de la docteure Lucía", html: "<p><em>Jarabe : una cucharada tres veces al día, durante cinco días. Beber mucha agua y descansar.</em></p>" }],
      question: "Comment traduire correctement les douleurs de l'enfant et l'ordonnance ?",
      tache: "Joue l'interprète : écris les répliques en espagnol de la maman, puis traduis l'ordonnance en français.",
      hypotheses: ["« Le duele los pies » est correct : doler ne change jamais.", "On dit « tiene mal a la cabeza », comme en français.", "Doler se construit comme gustar : le duele la cabeza, le duelen los pies."]
    },
    parties: [
      { t: "¿Qué te duele?", html: partie(ES_OLD, 0),
        planches: [{ type: "2D", titre: "El cuerpo humano", legende: "Les parties du corps en espagnol. Avec un nom singulier : me duele la cabeza ; avec un nom pluriel : me duelen los pies.", svg: (function () {
          var s = corps2D(320, 150, null);
          CORPS.forEach(function (p, i) { var g = p[1] <= 0 && i % 2 === 0, x = g ? 140 : 500, y = 40 + i * 30; s += "<path d='M" + (320 + p[1]) + " " + (150 + p[2]) + "L" + (g ? x + 70 : x - 4) + " " + y + "' stroke='" + GRIS + "' stroke-width='1'/><circle cx='" + (320 + p[1]) + "' cy='" + (150 + p[2]) + "' r='3' fill='" + ROUGE + "'/>" + txt(x + (g ? 66 : 0), y + 4, p[0], { s: 13, a: g ? "end" : "start", c: p[3] ? "#C2540A" : BLEU }); });
          s += txt(320, 310, "bleu : singulier → duele · orange : pluriel → duelen", { s: 11.5, c: GRIS });
          return svg(640, 320, "Un garçon debout avec les noms des parties du corps en espagnol", "", s);
        })() }],
        fil: { html: "<p>Comme <em>gustar</em>, <em>doler</em> s'accorde avec ce qui fait mal : <em>le duele <strong>la cabeza</strong></em> (singulier), <em>le duel<strong>en los pies</strong></em> (pluriel). « Le duele los pies » est faux, et « tiene mal a » est un calque du français.</p>", verdicts: [[0, "rejetee", "Avec un pluriel, doler devient duelen."], [1, "rejetee", "« Tener mal a » n'existe pas : on dit me / te / le duele(n)."], [2, "validee", "Doler se construit comme gustar."]] },
        retenir: "me duele + singulier ; me duelen + pluriel ; tengo fiebre / tos / gripe." },
      { t: "En la consulta", html: partie(ES_OLD, 1),
        planches: [{ type: "3d", titre: "La table de la consultation", legende: "Tourne la table : el jarabe (le sirop, flacon brun), la caja de pastillas (la boîte de comprimés), el termómetro (le thermomètre) et el estetoscopio (le stéthoscope).",
          modele: { h: 320, rx: -24, ry: 22, echelle: 1, alt: "Flacon de sirop brun, boîte de comprimés, thermomètre et stéthoscope sur une table blanche", objets: trousse3D(),
            etiquettes: [{ p: [-120, 100, 0], t: "el jarabe" }, { p: [10, 30, 10], t: "la caja de pastillas" }, { p: [100, 4, -60], t: "el termómetro", cote: "d" }, { p: [190, 4, 40], t: "el estetoscopio", cote: "d" }] } }],
        fil: { html: "<p>L'ordonnance se traduit ainsi : « Sirop : une cuillerée trois fois par jour, pendant cinq jours. Boire beaucoup d'eau et se reposer. » <em>Tres veces al día</em> = trois fois par jour.</p>" },
        retenir: "¿Qué le pasa? ¿Desde cuándo? Tome… tres veces al día." },
      { t: "El superlativo", html: partie(ES_OLD, 2),
        fil: { html: "<p>« El centro de salud <strong>más grande de</strong> la región » est un superlatif relatif (le plus grand de) ; « buen<strong>ísimo</strong> » est un superlatif absolu (très, très bon).</p>" },
        retenir: "el más… de ; -ísimo ; el mejor / el peor." }
    ],
    denouement: {
      titre: "La consultation réussie",
      etapes: ["Le duele la cabeza / la garganta ; le duelen los pies (indice 1).", "Tiene fiebre desde ayer ; l'ordonnance : trois fois par jour, cinq jours (indice 2).", "Más grande de = le plus grand de ; buenísimo = excellent (indice 3)."],
      reponse: "<p>L'interprète dit à la docteure : « Al niño le duele la cabeza y la garganta, le duelen los pies y tiene fiebre desde ayer. » Le verbe doler se construit comme gustar : il s'accorde avec ce qui fait mal, d'où <em>le duele</em> devant un singulier et <em>le duelen</em> devant un pluriel ; « tener mal a » n'existe pas en espagnol. À la maman, il traduit l'ordonnance : une cuillerée de sirop trois fois par jour pendant cinq jours, boire beaucoup d'eau et se reposer. Enfin, il explique que le centre est « le plus grand de la région » (superlatif relatif <em>el más… de</em>) et que le sirop est « très très bon » (superlatif absolu en <em>-ísimo</em>).</p>",
      transfert: "<p>Écris un dialogue de huit répliques entre la docteure Lucía et une élève qui a mal au ventre et aux yeux, en utilisant au moins un superlatif.</p>"
    },
    revision: (ES_OLD ? ES_OLD.revision : []).concat(["Doler = gustar : le duele (sing.), le duelen (plur.).", "« tener mal a » n'existe pas."]),
    exo: ES_OLD ? ES_OLD.exo : "",
    quiz: [
      q("« J'ai mal aux pieds »", "Me duelen los pies.", "Me duele los pies.", "Tengo mal a los pies.", "Pluriel : duelen."),
      q("Superlatif absolu de « cansado » :", "cansadísimo", "el más cansado", "muy cansadoísimo", "Adjectif + -ísimo."),
      q("« Le meilleur élève de la classe »", "el mejor alumno de la clase", "el más bueno alumno", "el buenísimo alumno", "Bueno → el mejor."),
      q("« Il a mal à la gorge »", "Le duele la garganta.", "Le duelen la garganta.", "Tiene mal a la garganta.", "Singulier : duele."),
      q("« J'ai de la fièvre »", "Tengo fiebre.", "Me duele fiebre.", "Estoy fiebre.", "Tener fiebre / tos / gripe."),
      q("« Tres veces al día » signifie…", "trois fois par jour", "pendant trois jours", "trois jours par semaine", "Vez = fois."),
      q("« ¿Desde cuándo? » demande…", "depuis quand", "pourquoi", "combien", "Desde = depuis."),
      q("« el jarabe », c'est…", "le sirop", "le comprimé", "le thermomètre", "Flacon de sirop."),
      q("Superlatif de « malo » :", "el peor", "el más malo de todos", "malísimo seulement", "Irrégulier : el peor."),
      q("« El hospital más grande de la ciudad » est un superlatif…", "relatif", "absolu", "comparatif", "El más… de.")
    ]
  });

  /* ═══════════════════════ Tle — PRÉPARER LE BAC À LONG TERME ═══════════════════════ */
  var OB_OLD = ancien("tle-orient-bac");
  var MATS = [["Philosophie", 5, 6], ["Français", 4, 8], ["Anglais", 3, 9], ["Histoire-géo", 3, 9], ["Mathématiques", 2, 7], ["SVT", 2, 10], ["Espagnol", 2, 12.5], ["EPS", 1, 14]];
  function moyenne(N) { var t = 0, c = 0; N.forEach(function (n, i) { t += n * MATS[i][1]; c += MATS[i][1]; }); return t / c; }
  function calendrier3D() {
    var o = [], C = { cours: "#1E88E5", sujet: "#C62828", conge: "#F2C94C", blanc: "#7B3F99" }, M = [["cours", "sujet"], ["cours", "sujet"], ["cours", "sujet"], ["conge"], ["cours", "sujet"], ["cours", "sujet"], ["conge"], ["cours", "sujet", "blanc"], ["cours", "sujet", "blanc"]], k;
    o.push({ f: "boite", c: [0, -8, 0], d: [560, 8, 140], coul: "#C9A576", dessus: "#E3C79C" });
    M.forEach(function (m, i) { var y = 0; m.forEach(function (b, n) { var h = b === "conge" ? 30 : b === "cours" ? 50 : 26; o.push({ f: "boite", c: [-240 + i * 60, y, 0], d: [46, h - 2, 60], coul: C[b], div: false, ec: [0, n * 12, 0] }); y += h; }); });
    o.push({ f: "boite", c: [300, 0, 0], d: [30, 160, 30], coul: "#2E7D32", dessus: "#43A047", div: false });
    return o;
  }
  remplacer("tle-orient-bac", {
    c: "Tle A", m: "orientation", titre: "Préparer le baccalauréat à long terme", duree: 30,
    accroche: "8,6 de moyenne au premier trimestre, le bac en juin : Kevin peut-il encore viser 11 ?",
    intro: "Le bulletin d'un élève de Terminale te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois stratégies.",
    objectifs: ["calculer une moyenne pondérée et fixer un objectif réaliste", "se fixer des objectifs précis, mesurables et datés", "organiser l'année de préparation mois par mois", "prendre soin de sa santé pour durer jusqu'à l'examen"],
    enquete: {
      titre: "Le bulletin de Kevin, Terminale A à Bertoua",
      svg: (function () {
        var s = "<rect width='640' height='230' fill='#F4F6FA'/><rect x='40' y='16' width='280' height='200' rx='8' fill='#fff' stroke='#C9D2E3'/>" + txt(56, 40, "Bulletin du 1er trimestre", { s: 12.5, a: "start", c: BLEU });
        MATS.forEach(function (m, i) { s += txt(56, 64 + i * 18, m[0] + " (coef. " + m[1] + ")", { s: 10.5, a: "start", w: 500 }) + txt(300, 64 + i * 18, String(m[2]), { s: 11, a: "end", c: m[2] < 10 ? ROUGE : VERT }); });
        s += "<path d='M56 208h244' stroke='#C9D2E3'/>" + txt(300, 206, "8,6 / 20", { s: 12, a: "end", c: ROUGE });
        s += perso(430, 100, "#5A3A1E", "#DCE6F2", "#1E499B") + bulle(470, 40, 150, "Est-ce encore possible ?");
        return svg(640, 230, "Bulletin de Kevin avec ses notes par matière et sa moyenne de 8,6, et Kevin qui se demande si le bac est encore possible", "", s);
      })(),
      legende: "À Bertoua : Kevin, élève de Terminale A, reçoit son bulletin du premier trimestre avant les congés de Noël.",
      contexte: "<p>Kevin a obtenu <strong>8,6 de moyenne</strong>, avec des notes faibles dans les matières à fort coefficient (philosophie 6, français 8). Son ami propose : « Laisse tomber cette année, tu bosseras en mai. » Sa sœur, bachelière, conseille : « Vise 20 partout dès maintenant ! » Le conseiller d'orientation lui demande plutôt de calculer ce qu'un progrès ciblé changerait.</p>",
      documents: [{ t: "Ce que rapporte un point selon le coefficient", html: "<p>Sur un total de coefficients de 22, un point gagné en philosophie (coef. 5) fait monter la moyenne de 5/22 ≈ <strong>0,23</strong> point ; un point en EPS (coef. 1), de 1/22 ≈ <strong>0,05</strong> point.</p>" }],
      question: "Quelle stratégie permettra à Kevin d'avoir son bac en juin ?",
      tache: "Calcule la moyenne de Kevin avec un progrès ciblé, puis rédige son plan de l'année : objectifs, calendrier, hygiène de vie.",
      hypotheses: ["Attendre mai pour tout réviser d'un coup.", "Viser 20 dans toutes les matières dès maintenant.", "Fixer des objectifs précis sur les matières à fort coefficient, réviser chaque mois sur des sujets d'examen, et préserver sa santé."]
    },
    parties: [
      { t: "Se fixer des objectifs", html: partie(OB_OLD, 0) +
        "<div class='methode'><b>Calculer l'effet d'un progrès</b><ol><li>Multiplie chaque note par son coefficient et additionne.</li><li>Divise par la somme des coefficients : c'est la moyenne.</li><li>Teste un progrès : +3 en philosophie (coef. 5) et +3 en français (coef. 4) rapportent (15 + 12) ÷ 22 ≈ 1,2 point.</li></ol></div>",
        fil: { html: "<p>Avec +3 points en philosophie et en français, puis +2 en anglais et en histoire-géographie, Kevin passe de 8,6 à environ 10,4 : le bac devient accessible sans « viser 20 partout ». Utilise le calculateur pour le vérifier.</p>", verdicts: [[1, "rejetee", "Un objectif irréaliste décourage : il faut des progrès ciblés et mesurables."]] },
        retenir: "Un objectif précis, mesurable et daté ; priorité aux forts coefficients." },
      { t: "Organiser l'année", html: partie(OB_OLD, 1),
        planches: [{ type: "3d", titre: "L'année de Kevin, mois par mois", legende: "De septembre à juin : chaque colonne est un mois. Bleu : cours et fiches ; rouge : un sujet d'examen par matière ; jaune : congés consacrés aux révisions ; violet : examens blancs en conditions réelles. La tour verte, au bout : le bac.",
          modele: { h: 320, rx: -20, ry: 22, echelle: 0.9, alt: "Neuf colonnes de blocs colorés représentant les mois de l année et une tour verte pour le bac", eclate: "Séparer les activités", jouer: "Séparer", objets: calendrier3D(),
            etiquettes: [{ p: [-240, 80, 30], t: "Septembre" }, { p: [300, 164, 0], t: "Le bac", cote: "d" }, { p: [-60, 34, 30], t: "Congés de Noël" }] } }],
        fil: { html: "<p>Tout réviser en mai, c'est affronter seul neuf mois de programme oubliés. Un sujet d'examen par matière chaque mois, et les deux derniers mois en conditions réelles, répartissent l'effort.</p>", verdicts: [[0, "rejetee", "En mai, il est trop tard pour combler neuf mois de lacunes."]] },
        retenir: "Chaque jour : relire ; chaque mois : un sujet par matière ; à la fin : sujets chronométrés." },
      { t: "Prendre soin de soi", html: partie(OB_OLD, 2) +
        "<div class='savais'><b>Le savais-tu ?</b>Pendant le sommeil, le cerveau trie et consolide ce qui a été appris dans la journée : réviser la nuit au lieu de dormir fait perdre une partie du travail.</div>",
        fil: { html: "<p>Un plan sur neuf mois ne tient que si le corps suit : sommeil, repas, sport, détente. C'est la condition des progrès ciblés.</p>", verdicts: [[2, "validee", "Objectifs ciblés, travail régulier, santé préservée."]] },
        retenir: "Un corps en forme apprend mieux ; parler de son stress." }
    ],
    denouement: {
      titre: "Le plan de Kevin",
      etapes: ["Objectifs ciblés : +3 en philosophie et en français, +2 en anglais et en histoire-géographie ≈ 10,4 (indice 1).", "Un sujet par matière chaque mois, examens blancs en mai-juin (indice 2).", "Sommeil, alimentation, sport, détente (indice 3)."],
      reponse: "<p>Kevin ne doit ni attendre mai ni viser 20 partout. Il calcule l'effet de progrès ciblés : en gagnant 3 points en philosophie (coef. 5) et en français (coef. 4), et 2 points en anglais et en histoire-géographie (coef. 3 chacune), sa moyenne passe d'environ 8,6 à 10,4. Il se fixe donc des objectifs précis, mesurables et datés pour chaque trimestre. Il organise l'année : relire chaque leçon le jour même, traiter chaque mois un sujet d'examen par matière, réviser pendant les congés et faire des examens blancs chronométrés les deux derniers mois. Enfin, il protège sa santé (sommeil, repas, sport, détente), sans laquelle ce plan ne tiendrait pas jusqu'en juin.</p>",
      transfert: "<p>Entre tes propres notes dans le calculateur, puis écris tes trois objectifs pour le prochain trimestre (matière, note visée, moyen d'y arriver).</p>"
    },
    revision: (OB_OLD ? OB_OLD.revision : []).concat(["Moyenne pondérée : Σ(note × coef.) ÷ Σ coef.", "Un point en matière à fort coefficient rapporte davantage."]),
    exo: OB_OLD ? OB_OLD.exo : "",
    quiz: [
      q("Quand commence la préparation du bac ?", "dès le début de l'année", "en mai", "la veille", "Un effort régulier sur neuf mois."),
      q("Un bon objectif est…", "précis, mesurable et daté", "vague et ambitieux", "le même pour tout le monde", "Par exemple : passer de 8 à 11 en philosophie au 2e trimestre."),
      q("En fin d'année, on privilégie…", "les sujets en conditions réelles", "les nouvelles leçons", "le repos complet", "Sujets chronométrés."),
      q("Un point en philosophie (coef. 5) sur un total de 22 rapporte…", "≈ 0,23 point de moyenne", "1 point de moyenne", "5 points de moyenne", "5 ÷ 22."),
      q("Où gagner des points en priorité ?", "dans les matières à fort coefficient où l'on est faible", "en EPS seulement", "dans la matière préférée", "Effet maximal sur la moyenne."),
      q("La moyenne pondérée se calcule…", "Σ(note × coef.) ÷ Σ coef.", "Σ notes ÷ nombre de matières", "note la plus haute ÷ 2", "Chaque note compte selon son coefficient."),
      q("Chaque mois, il est conseillé de…", "traiter un sujet d'examen par matière", "changer de série", "arrêter le sport", "Annales corrigées."),
      q("Réviser la nuit au lieu de dormir…", "fait perdre une partie du travail", "double la mémoire", "n'a aucun effet", "Le sommeil consolide."),
      q("En cas de stress, on peut…", "en parler à un conseiller, un enseignant ou un parent", "tout arrêter", "le cacher", "Demander de l'aide."),
      q("Pendant les congés, on…", "révise les chapitres passés et comble ses lacunes", "n'ouvre aucun cahier", "apprend seulement le programme suivant", "Les congés servent aussi à consolider.")
    ]
  });

  /* ═══════════════════════ SIMULATIONS ═══════════════════════ */
  function $(el, s) { return el.querySelector(s); }
  function quiz(el, C, rep, lib) {
    var i = 0, ok = 0;
    el.innerHTML = "<p class='labo-r' data-q style='font-size:16px'></p><div style='display:flex;gap:8px;flex-wrap:wrap' data-c></div><p class='an-note' data-e></p><p class='labo-r' data-s></p>";
    function poser() {
      var c = C[i];
      $(el, "[data-q]").innerHTML = (i + 1) + ". " + c[0].replace("___", "<b style='border-bottom:2px dashed #1E499B;padding:0 14px'>?</b>");
      $(el, "[data-e]").textContent = ""; $(el, "[data-s]").innerHTML = lib + " " + (i + 1) + " / " + C.length + " · score : <b>" + ok + "</b>";
      $(el, "[data-c]").innerHTML = c[1].slice().sort().map(function (x) { return "<button type='button' class='btn-l' data-v='" + x + "'>" + x + "</button>"; }).join("");
      el.querySelectorAll("[data-v]").forEach(function (b) {
        b.addEventListener("click", function () {
          var bon = b.dataset.v === c[1][0]; if (bon) ok++;
          $(el, "[data-q]").innerHTML = (i + 1) + ". " + c[0].replace("___", "<b style='color:" + (bon ? VERT : ROUGE) + "'>" + c[1][0] + "</b>");
          $(el, "[data-e]").innerHTML = (bon ? "✔ " : "✘ ") + c[2];
          el.querySelectorAll("[data-v]").forEach(function (x) { x.disabled = true; });
          var nx = document.createElement("button"); nx.type = "button"; nx.className = "btn-l"; nx.textContent = i + 1 < C.length ? rep : "↺";
          nx.addEventListener("click", function () { i = (i + 1) % C.length; if (!i) ok = 0; poser(); });
          $(el, "[data-c]").appendChild(nx);
          $(el, "[data-s]").innerHTML = lib + " " + (i + 1) + " / " + C.length + " · score : <b>" + ok + "</b>";
        });
      });
    }
    poser();
  }
  VRT_A("3e-en-present", 1, "Time markers: choose the right tense", function (el) {
    quiz(el, [["Every Saturday I ___ to the market.", ["go", "am going"], "« Every Saturday » = habit → simple present."], ["Look! Mama ___ tomatoes.", ["is buying", "buys"], "« Look! » = now → present continuous."], ["Kwame ___ football every evening.", ["plays", "is playing"], "Habit + -s with he."], ["Right now, my brothers ___ TV.", ["are watching", "watch"], "« Right now » → continuous."], ["I ___ English and French.", ["understand", "am understanding"], "State verb: no -ing."], ["Listen! The baby ___ .", ["is crying", "cries"], "« Listen! » → continuous."], ["She usually ___ to school by taxi.", ["goes", "is going"], "« usually » → simple present."], ["We ___ rice today, not plantains.", ["are eating", "eat"], "« today » for a temporary action → continuous."]], "Next sentence", "Sentence");
  });
  VRT_A("3e-de-prepositions", 2, "Wo? oder Wohin? Place le ballon", function (el) {
    var P = [["auf", "dem Tisch", "den Tisch", 0, -46], ["unter", "dem Tisch", "den Tisch", 0, 46], ["neben", "dem Tisch", "den Tisch", 120, 30], ["vor", "dem Tisch", "den Tisch", 0, 50], ["hinter", "dem Tisch", "den Tisch", 0, -10], ["über", "dem Tisch", "den Tisch", 0, -110]], p = 0, mvt = false;
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:6px' data-p>" + P.map(function (x, k) { return "<button type='button' class='btn-l' data-k='" + k + "'>" + x[0] + "</button>"; }).join("") + "</div><div style='display:flex;gap:6px;margin-top:8px'><button type='button' class='btn-l' data-m='0'>Wo? (liegen)</button><button type='button' class='btn-l' data-m='1'>Wohin? (rollen, legen)</button></div><svg viewBox='0 0 640 230' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    function maj() {
      var x = P[p], s = "<rect width='640' height='230' fill='#F4EFE4'/><rect y='190' width='640' height='40' fill='#C0894F'/>" + (x[0] === "hinter" ? "" : "") + "<g transform='translate(320 140)'>";
      var ball = "<g transform='translate(" + x[3] + " " + x[4] + ")'><circle r='14' fill='#E8E8E8' stroke='#1F2328'/><path d='M-6 -6l6 4l6 -4M0 -2v8' stroke='#1F2328' fill='none'/></g>";
      if (x[0] === "hinter") s += ball;
      s += "<rect x='-90' y='-30' width='180' height='12' fill='#7A4A22'/><rect x='-84' y='-18' width='10' height='68' fill='#6B4423'/><rect x='74' y='-18' width='10' height='68' fill='#6B4423'/>";
      if (x[0] === "vor") s += "<g transform='translate(0 50)'><circle r='14' fill='#E8E8E8' stroke='#1F2328'/></g>"; else if (x[0] !== "hinter") s += ball;
      if (mvt) s += "<path d='M-220 -60C-150 -100 " + (x[3] - 60) + " " + (x[4] - 60) + " " + (x[3] - 18) + " " + (x[4] - 8) + "' fill='none' stroke='#C2540A' stroke-width='2.5' stroke-dasharray='6 5' marker-end='url(#deA)'/>";
      s += "</g>";
      $(el, "[data-s]").innerHTML = "<defs>" + fleche("deA", "#C2540A") + "</defs>" + s;
      var art = mvt ? x[2] : x[1];
      $(el, "[data-r]").innerHTML = (mvt ? "Wohin? → accusatif : Der Ball rollt <b>" + x[0] + " " + art + "</b>." : "Wo? → datif : Der Ball liegt <b>" + x[0] + " " + art + "</b>.") + " (der Tisch, masculin)";
      el.querySelectorAll("[data-k]").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.k === p); });
      el.querySelectorAll("[data-m]").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.m === (mvt ? 1 : 0)); });
    }
    el.querySelectorAll("[data-k]").forEach(function (b) { b.addEventListener("click", function () { p = +b.dataset.k; maj(); }); });
    el.querySelectorAll("[data-m]").forEach(function (b) { b.addEventListener("click", function () { mvt = b.dataset.m === "1"; maj(); }); });
    maj();
  });
  VRT_A("3e-es-medico", 0, "¿Qué te duele? Toca una parte del cuerpo", function (el) {
    el.innerHTML = "<div style='display:flex;flex-wrap:wrap;gap:6px' data-b>" + CORPS.map(function (c, k) { return "<button type='button' class='btn-l' data-k='" + k + "'>" + c[0] + "</button>"; }).join("") + "</div><svg viewBox='0 0 640 300' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    function maj(k) {
      var c = CORPS[k], f = c[3] ? "Me duelen " : "Me duele ";
      $(el, "[data-s]").innerHTML = "<rect width='640' height='300' fill='#EEF5F8'/>" + corps2D(200, 160, k) + "<rect x='330' y='110' width='280' height='80' rx='16' fill='#fff' stroke='" + (c[3] ? "#C2540A" : BLEU) + "' stroke-width='2'/>" + txt(470, 146, f + c[0] + ".", { s: 17, c: c[3] ? "#C2540A" : BLEU }) + txt(470, 172, c[3] ? "pluriel → duelen" : "singulier → duele", { s: 12, w: 500, c: GRIS });
      $(el, "[data-r]").innerHTML = "<b>" + f + c[0] + ".</b> " + (c[3] ? "Le nom est au pluriel : le verbe aussi." : "Le nom est au singulier : duele.");
      el.querySelectorAll("[data-k]").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.k === k); });
    }
    el.querySelectorAll("[data-k]").forEach(function (b) { b.addEventListener("click", function () { maj(+b.dataset.k); }); });
    maj(0);
  });
  VRT_A("tle-orient-bac", 0, "Calculateur : ta moyenne avec des progrès ciblés", function (el) {
    el.innerHTML = "<div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2px 18px'>" + MATS.map(function (m) { return "<label class='labo-c'><span>" + m[0] + " (coef. " + m[1] + ") : <b data-v>" + m[2] + "</b></span><input type='range' min='0' max='20' step='0.5' value='" + m[2] + "'></label>"; }).join("") + "</div><svg viewBox='0 0 640 120' class='an-svg' data-s></svg><p class='labo-r' data-r></p>";
    var I = el.querySelectorAll("input"), V = el.querySelectorAll("[data-v]");
    function maj() {
      var N = [].map.call(I, function (x) { return +x.value; }), m = moyenne(N), m0 = moyenne(MATS.map(function (x) { return x[2]; }));
      N.forEach(function (n, i) { V[i].textContent = String(n).replace(".", ","); });
      var X = function (v) { return 30 + v / 20 * 580; }, col = m >= 10 ? VERT : m >= 9 ? "#F2994A" : ROUGE;
      var s = "<rect x='30' y='46' width='580' height='22' rx='11' fill='#EEF1F6'/><rect x='30' y='46' width='" + (X(m) - 30) + "' height='22' rx='11' fill='" + col + "'/><path d='M" + X(10) + " 36V78' stroke='" + NUIT + "' stroke-width='2' stroke-dasharray='4 3'/>" + txt(X(10), 30, "10 : admis", { s: 11.5 }) + "<path d='M" + X(m0) + " 70v12' stroke='" + GRIS + "' stroke-width='2'/>" + txt(X(m0), 98, "départ " + m0.toFixed(1).replace(".", ","), { s: 10.5, c: GRIS }) + txt(X(Math.min(m, 18.5)) + 6, 62, m.toFixed(2).replace(".", ","), { s: 12, a: "start", c: m > 1 ? "#fff" : NUIT });
      $(el, "[data-s]").innerHTML = s;
      $(el, "[data-r]").innerHTML = "Moyenne : <b>" + m.toFixed(2).replace(".", ",") + " / 20</b> (" + (m - m0 >= 0 ? "+" : "") + (m - m0).toFixed(2).replace(".", ",") + " point) · " + (m >= 16 ? "mention Très bien" : m >= 14 ? "mention Bien" : m >= 12 ? "mention Assez bien" : m >= 10 ? "admis" : "pas encore admis") + " · Σ coef. = 22";
    }
    I.forEach(function (x) { x.addEventListener("input", maj); }); maj();
  });
})();
