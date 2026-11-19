/* Leçons enrichies — lettres et langues, lot A (18/11/2026), consignes de Jacques : situation résolue avec les formules (règles,
   structures) étape par étape, exemples, astuces, planches 2D. AJOUTS SEULEMENT (enrichir) : blocs def / formule / ex / astuce en
   fin de partie, planches, denouement.formules. Partage avec la session des sciences : voir STATE.md. */
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
  /* Consignes de Jacques (18/11/2026) : situation résolue avec les formules étape par étape, exemples, règles, astuces,
     planches 2D et 3D. AJOUTS SEULEMENT : blocs en fin de partie, planches, denouement.formules. */
  function enrichir(id, o) {
    var L = ancien(id); if (!L) return;
    (o.blocs || []).forEach(function (b) { var p = L.parties[b[0]]; if (p) p.html = (p.html || "") + b[1]; });
    (o.planches || []).forEach(function (b) { var p = L.parties[b[0]]; if (p) p.planches = (p.planches || []).concat([b[1]]); });
    if (o.formules && L.denouement && !(L.denouement.formules || []).length) L.denouement.formules = o.formules;
  }
  function def(t, h) { return "<div class='def'><b>" + t + "</b>" + h + "</div>"; }
  function formule(h) { return "<p class='formule'>" + h + "</p>"; }
  function ex(h, t) { return "<div class='ex'><b>" + (t || "Exemples") + "</b>" + h + "</div>"; }
  function astuce(h, t) { return "<div class='astuce'><b>" + (t || "Astuce") + "</b>" + h + "</div>"; }
  function attention(h, t) { return "<div class='attention'><b>" + (t || "Attention") + "</b>" + h + "</div>"; }
  function methode(h, t) { return "<div class='methode'><b>" + (t || "Méthode") + "</b>" + h + "</div>"; }
  function F(nom, f, calcul) { return { nom: nom, f: f, calcul: calcul }; }
  /* fiche 2D en colonnes : [{t, c, l:[lignes]}] */
  function colonnes(titre, cols, h, alt) {
    var W = 640, n = cols.length, w = (W - 30 - (n - 1) * 12) / n, s = "<rect width='640' height='" + h + "' fill='#FBF8F2'/>" + txt(320, 28, titre, { s: 15 });
    cols.forEach(function (c, i) {
      var x = 15 + i * (w + 12);
      s += "<rect x='" + x + "' y='44' width='" + w + "' height='" + (h - 58) + "' rx='12' fill='#fff' stroke='" + c.c + "' stroke-width='2'/><rect x='" + x + "' y='44' width='" + w + "' height='34' rx='11' fill='" + c.c + "'/>" + txt(x + w / 2, 66, c.t, { s: 14, c: "#fff" });
      c.l.forEach(function (l, k) { s += txt(x + 12, 100 + k * 24, l, { s: 12, a: "start", w: l.charAt(0) === "→" ? 800 : 550, c: l.charAt(0) === "→" ? c.c : NUIT }); });
    });
    return svg(640, h, alt || titre, "", s);
  }

  /* ═══════════ 3e ANGLAIS — LES ARTICLES ═══════════ */
  enrichir("3e-en-articles", {
    blocs: [[0, def("Rule : a or an?", "Use <strong>a</strong> before a <strong>consonant sound</strong> and <strong>an</strong> before a <strong>vowel sound</strong>. Listen to the first sound, not the first letter.") + formule("a + consonant sound · an + vowel sound") + ex("a uniform (/juː/), a one-way street (/w/), a European country<br>an MP3 player (/em/), an umbrella, an honest answer (silent h)") + astuce("Say the word aloud before writing: <em>hour</em> starts with /aʊ/, so <strong>an hour</strong>; <em>university</em> starts with /juː/, so <strong>a university</strong>.", "Tip")],
      [1, formule("the + noun already mentioned / unique / superlative / river, ocean, plural country") + ex("the Wouri, the Sanaga (rivers) · the Atlantic Ocean · the United States<br>but: Mount Cameroon, Lake Chad (no article)")],
      [2, attention("No article before meals, sports and school subjects: <em>We have lunch at noon. He plays football. I like English.</em>", "Watch out")]],
    planches: [[1, { type: "2D", titre: "Which article? A decision tree", legende: "Three questions decide the article: is the thing specific or unique? Is the noun singular and countable? Is it used in general or is it a name? Then listen to the first sound for a / an.", svg: (function () {
      var s = "<rect width='640' height='300' fill='#FBF8F2'/>";
      function b(x, y, w, t, c, f) { return "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='44' rx='10' fill='" + (f || "#fff") + "' stroke='" + c + "' stroke-width='2'/>" + txt(x + w / 2, y + 27, t, { s: 12.5, c: f ? "#fff" : NUIT }); }
      s += b(200, 14, 240, "Is it specific, known or unique?", BLEU) + "<path d='M320 58V80M320 80H120V100M320 80H520V100' stroke='" + NUIT + "' stroke-width='2' fill='none'/>" + txt(200, 76, "yes", { s: 11, c: VERT }) + txt(440, 76, "no", { s: 11, c: ROUGE });
      s += b(40, 100, 160, "THE", VERT, VERT) + txt(120, 166, "the sun, the taxi I saw", { s: 11, w: 500 });
      s += b(400, 100, 240, "Singular countable, first time?", BLEU) + "<path d='M520 144V166M520 166H440V186M520 166H600V186' stroke='" + NUIT + "' stroke-width='2' fill='none'/>" + txt(470, 162, "yes", { s: 11, c: VERT }) + txt(580, 162, "no", { s: 11, c: ROUGE });
      s += b(330, 186, 200, "A / AN : listen!", "#C2540A", "#C2540A") + b(550, 186, 80, "Ø", GRIS, GRIS) + txt(430, 254, "a university · an hour", { s: 11, w: 500 }) + txt(590, 254, "Cameroon,", { s: 11, w: 500 }) + txt(590, 270, "mangoes", { s: 11, w: 500 });
      return svg(640, 300, "Arbre de décision : chose précise ou unique, the ; singulier dénombrable cité pour la première fois, a ou an selon le son ; sinon pas d’article", "", s);
    })() }]],
    formules: [F("Premier son du nom", "a + son consonne ; an + son voyelle", "a university (/juː/) · an hour (/aʊ/)"), F("Chose unique ou connue", "the + nom unique, déjà cité ou superlatif", "the sun · the Atlantic Ocean · the Lobé Falls"), F("Sens général, nom de pays", "Ø + pluriel général, indénombrable ou pays", "Cameroon is beautiful · Mangoes are sweet")]
  });

  /* ═══════════ 3e ANGLAIS — LES PRÉSENTS ═══════════ */
  enrichir("3e-en-present", {
    blocs: [[0, formule("Subject + verb (-s with he / she / it) · do / does + not + verb · Do / Does + subject + verb?") + ex("Every Saturday, I go to the market with my mother.<br>My father works in a bank. Does he work on Sundays? No, he doesn't.") + attention("Spelling of -s: <em>watch → watches, go → goes, study → studies, play → plays</em>.", "Spelling")],
      [1, formule("Subject + am / is / are + verb-ing") + def("Present continuous", "An action in progress <strong>now</strong>, or a <strong>temporary</strong> situation.") + ex("Look! The bus is coming.<br>My father usually works in Douala, but this month he is working in Garoua.") + astuce("Markers decide: <em>every day, usually, often</em> → simple present; <em>now, at the moment, look!, listen!</em> → present continuous.", "Tip")]],
    planches: [[1, { type: "2D", titre: "Habit or now? Two timelines", legende: "Simple present: the action comes back again and again on the timeline (a habit). Present continuous: the action is happening around the moment of speaking (now).", svg: (function () {
      var s = "<rect width='640' height='250' fill='#FBF8F2'/>", k;
      [[70, "Simple present : I go to the market every Saturday", BLEU], [180, "Present continuous : I am writing a letter now", "#C2540A"]].forEach(function (r, i) {
        s += txt(320, r[0] - 34, r[1], { s: 13, c: r[2] }) + "<path d='M40 " + r[0] + "H600' stroke='" + NUIT + "' stroke-width='2.5' marker-end='url(#tlF)'/><path d='M320 " + (r[0] - 12) + "V" + (r[0] + 12) + "' stroke='" + ROUGE + "' stroke-width='3'/>" + txt(320, r[0] + 30, "now", { s: 11, c: ROUGE });
        if (!i) for (k = 0; k < 9; k++) s += "<circle cx='" + (70 + k * 62) + "' cy='" + r[0] + "' r='8' fill='" + BLEU + "'/>";
        else s += "<rect x='270' y='" + (r[0] - 9) + "' width='100' height='18' rx='9' fill='#C2540A' opacity='.85'/>";
      });
      return svg(640, 250, "Deux lignes du temps : points répétés pour l’habitude, bande autour de maintenant pour l’action en cours", fleche("tlF", NUIT), s);
    })() }]],
    formules: [F("Habitude → présent simple", "every / usually + S + V(-s)", "« Every Saturday » → I go to the market"), F("Action en cours → présent continu", "now + S + am / is / are + V-ing", "« Now » → I am writing to you"), F("Verbe d'état", "know, like, want… → pas de -ing ; since / for → present perfect", "I know you · I have known you for one year")]
  });

  /* ═══════════ 3e ALLEMAND — PRÉPOSITIONS MIXTES ═══════════ */
  enrichir("3e-de-prepositions", {
    blocs: [[0, def("Règle", "Les neuf prépositions mixtes sont suivies du <strong>datif</strong> pour une position (Wo?) et de l'<strong>accusatif</strong> pour une direction (Wohin?).") + astuce("Retiens-les en chanson : <em>an, auf, hinter, in, neben, über, unter, vor, zwischen</em>.")],
      [1, formule("Wo? + liegen, stehen, sitzen, hängen → DATIF (dem, der, dem, den)") + formule("Wohin? + legen, stellen, setzen, hängen → ACCUSATIF (den, die, das, die)") + ex("Das Buch liegt auf <strong>dem</strong> Tisch. → Ich lege das Buch auf <strong>den</strong> Tisch.<br>Die Katze sitzt unter <strong>dem</strong> Stuhl. → Die Katze läuft unter <strong>den</strong> Stuhl.") + methode("Repère le verbe, pose la question <em>Wo?</em> ou <em>Wohin?</em>, puis choisis le cas et l'article selon le genre du nom.")],
      [2, attention("Un déplacement à l'intérieur d'un même lieu reste au datif : <em>Die Kinder laufen im Hof</em> (ils courent dans la cour, sans y entrer).")]],
    planches: [[1, { type: "2D", titre: "Wo? ou Wohin? : verbes et articles", legende: "À gauche, les verbes de position et les articles du datif ; à droite, les verbes de déplacement et les articles de l'accusatif. Seul le masculin et le neutre changent vraiment : dem / den, dem / das, der / die.", svg: colonnes("Wo? → datif · Wohin? → accusatif", [{ t: "Wo? (position)", c: BLEU, l: ["liegen, stehen, sitzen, hängen, sein", "masculin : dem Tisch", "féminin : der Tasche", "neutre : dem Bett", "pluriel : den Bänken", "→ Das Heft liegt auf dem Tisch."] }, { t: "Wohin? (direction)", c: "#C2540A", l: ["legen, stellen, setzen, hängen, gehen", "masculin : den Tisch", "féminin : die Tasche", "neutre : das Bett (ins)", "pluriel : die Bänke", "→ Ich lege das Heft auf den Tisch."] }], 270, "Tableau : verbes de position et articles du datif, verbes de direction et articles de l’accusatif") }]],
    formules: [F("Préposition mixte ?", "an, auf, hinter, in, neben, über, unter, vor, zwischen", "auf, in, unter : mixtes"), F("Position → datif", "Wo? + liegen / stehen → dem (m.), der (f.), dem (n.)", "Das Heft liegt auf dem Tisch"), F("Direction → accusatif", "Wohin? + legen / stellen → den (m.), die (f.), das (n.)", "Ich lege das Heft auf das Bett · ins Kino (in + das)")]
  });

  /* ═══════════ 3e ALLEMAND — VERBES FAIBLES ═══════════ */
  enrichir("3e-de-verbes", {
    blocs: [[0, def("Verbe faible", "Verbe régulier : son radical ne change pas ; on ajoute seulement les terminaisons du présent.") + formule("radical = infinitif − en ; ich -e · du -st · er/sie/es -t · wir -en · ihr -t · sie/Sie -en") + ex("wohnen : ich wohne, du wohnst, er wohnt, wir wohnen, ihr wohnt, sie wohnen.<br>kaufen : Du kaufst Bananen ; wir kaufen Brot.")],
      [1, ex("arbeiten : du arbeitest, er arbeitet, ihr arbeitet · finden : er findet · tanzen : du tanzt (pas de -s- en plus)", "Cas particuliers") + astuce("Radical en -s, -ß, -z : <em>du</em> prend seulement <strong>-t</strong> : du tanzt, du heißt, du reist.") + attention("<em>Sie</em> (vous de politesse) se conjugue comme <em>sie</em> (ils) : Sie spielen, Herr Atangana.")]],
    planches: [[0, { type: "2D", titre: "Spielen et arbeiten : les terminaisons en couleur", legende: "Le radical (en bleu) ne change pas ; seules les terminaisons (en orange) changent. Avec arbeiten, un e (en vert) s'ajoute devant -st et -t pour pouvoir prononcer.", svg: (function () {
      var P = ["ich", "du", "er / sie / es", "wir", "ihr", "sie / Sie"], T = ["e", "st", "t", "en", "t", "en"], s = "<rect width='640' height='280' fill='#FBF8F2'/>";
      [["spielen (jouer)", "spiel", 30], ["arbeiten (travailler)", "arbeit", 340]].forEach(function (v, j) {
        s += "<rect x='" + v[2] + "' y='16' width='270' height='250' rx='12' fill='#fff' stroke='#C9D2E3'/>" + txt(v[2] + 135, 42, v[0], { s: 14, c: BLEU });
        P.forEach(function (p, i) { var y = 76 + i * 32, e = j && (T[i] === "st" || T[i] === "t") ? "e" : ""; s += txt(v[2] + 20, y, p, { s: 13, a: "start", w: 600, c: GRIS }) + "<text x='" + (v[2] + 130) + "' y='" + y + "' font-size='16' font-weight='800'><tspan fill='" + BLEU + "'>" + v[1] + "</tspan><tspan fill='" + VERT + "'>" + e + "</tspan><tspan fill='#C2540A'>" + T[i] + "</tspan></text>"; });
      });
      return svg(640, 280, "Deux tableaux de conjugaison : spielen et arbeiten, radical en bleu, terminaisons en orange, e de liaison en vert", "", s);
    })() }]],
    formules: [F("Trouver le radical", "radical = infinitif − en", "spielen → spiel- · arbeiten → arbeit-"), F("Ajouter la terminaison", "ich -e · du -st · er -t · wir -en · ihr -t · sie -en", "ich spiele · du lernst · wir kaufen"), F("Radical en -t ou -d", "+ e devant -st et -t", "er arbeitet · du arbeitest")]
  });

  /* ═══════════ 3e ESPAGNOL — LA FAMILLE ═══════════ */
  enrichir("3e-es-familia", {
    blocs: [[0, def("Los parentescos", "On nomme chaque personne par son lien avec soi : <em>la tía</em> = la sœur de mon père ou de ma mère ; <em>el primo</em> = le fils de mon oncle ou de ma tante.") + ex("Mi tía Rose es la hermana de mi madre. Eric es su hijo : es mi primo.<br>Mis abuelos viven en el pueblo.") + astuce("Le masculin pluriel englobe les deux sexes : <em>los padres</em> = les parents ; <em>los hermanos</em> = frères et sœurs ; <em>los tíos</em> = l'oncle et la tante.")],
      [1, formule("mi / tu / su + nom singulier · mis / tus / sus + nom pluriel (accord avec la chose possédée)") + ex("mi hermano → mis hermanos · su casa → sus casas · nuestra abuela")],
      [2, formule("Somos + nombre (en casa) · Tengo + nombre + hermano(s) · Se llama + prénom")]],
    planches: [[1, { type: "2D", titre: "Los posesivos : mi, mis, nuestro…", legende: "Le possessif s'accorde avec ce qui est possédé (singulier ou pluriel ; nuestro et vuestro aussi en genre), jamais avec le possesseur.", svg: colonnes("Los posesivos", [{ t: "un objet / une personne", c: BLEU, l: ["mi (mon, ma)", "tu (ton, ta)", "su (son, sa, leur, votre*)", "nuestro / nuestra", "vuestro / vuestra", "→ mi padre, su casa"] }, { t: "plusieurs", c: "#C2540A", l: ["mis (mes)", "tus (tes)", "sus (ses, leurs, vos*)", "nuestros / nuestras", "vuestros / vuestras", "→ mis hermanos, sus primos"] }], 270, "Tableau des possessifs espagnols au singulier et au pluriel") }]],
    formules: [F("Nommer le lien de parenté", "hermana de mi madre = mi tía ; hijo de mi tía = mi primo", "Rose = la tía · Eric = el primo"), F("Accorder le possessif", "mi + singulier · mis + pluriel", "mis hermanos · mi padre"), F("COD de personne", "verbe + a + personne", "Quiero mucho a mi abuela")]
  });

  /* ═══════════ 3e ESPAGNOL — CHEZ LE MÉDECIN ═══════════ */
  enrichir("3e-es-medico", {
    blocs: [[0, formule("me / te / le duele + nom singulier · me / te / le duelen + nom pluriel") + astuce("<em>Doler</em> se construit comme <em>gustar</em> : c'est la partie du corps qui est sujet. Si elle est au pluriel, le verbe aussi : <em>me duelen las muelas</em>.") + ex("Me duele la espalda. — ¿Le duelen los oídos? — Al niño le duele la garganta.")],
      [1, ex("Tome este jarabe <strong>tres veces al día</strong> durante <strong>cinco días</strong>.<br>Descanse y beba mucha agua.", "La receta (ordonnance)") + attention("<em>Desde ayer</em> = depuis hier ; <em>hace dos días</em> = il y a deux jours.")],
      [2, def("Superlativo", "Relatif : <em>el / la / los / las + más / menos + adjectif + de</em> ; absolu : adjectif + <em>-ísimo</em>.") + formule("el hospital más grande de la ciudad · un médico buenísimo")]],
    planches: [[1, { type: "2D", titre: "La receta del médico", legende: "Une ordonnance réelle se lit ainsi : le médicament, la dose, le nombre de prises par jour (veces al día) et la durée du traitement (durante… días).", svg: (function () {
      var s = "<rect width='640' height='300' fill='#E9EEF4'/><g transform='rotate(-2 320 150)'><rect x='150' y='18' width='340' height='264' fill='#fff' stroke='#C9D2E3'/><rect x='150' y='18' width='340' height='40' fill='#2F6DB5'/>" + txt(320, 44, "Hospital Regional · Dr. Mbarga", { s: 13, c: "#fff" }) + txt(170, 80, "Paciente : Junior, 12 años", { s: 12, a: "start", w: 600 }) + txt(470, 80, "Fecha : 18/11", { s: 11, a: "end", c: GRIS });
      [["1.", "Jarabe para la tos", "una cucharada, tres veces al día"], ["2.", "Paracetamol 500 mg", "un comprimido si tiene fiebre"], ["", "Durante cinco días", "beber mucha agua y descansar"]].forEach(function (r, i) { var y = 116 + i * 54; s += txt(170, y, r[0] + " " + r[1], { s: 14, a: "start", c: BLEU, i: true }) + txt(186, y + 20, r[2], { s: 12, a: "start", c: NUIT, i: true }); });
      s += "<path d='M380 262q20 -20 40 0t40 -6' stroke='" + BLEU + "' stroke-width='2' fill='none'/>" + txt(430, 278, "firma", { s: 10, c: GRIS }) + "</g>";
      return svg(640, 300, "Ordonnance espagnole manuscrite : sirop trois fois par jour, paracétamol en cas de fièvre, pendant cinq jours", "", s);
    })() }]],
    formules: [F("Douleur au singulier / au pluriel", "le duele + singulier · le duelen + pluriel", "Le duele la cabeza · le duelen los pies"), F("Durée et fréquence", "desde + moment · tres veces al día · durante + durée", "Tiene fiebre desde ayer · cinco días"), F("Superlatif", "el / la más + adj + de · adj + -ísimo", "el hospital más grande de la ciudad · buenísimo")]
  });

  /* ═══════════ 3e GREC — ÉSOPE ET HOMÈRE ═══════════ */
  enrichir("3e-gr-esope-homere", {
    blocs: [[1, def("Fable", "Récit court, souvent en prose chez Ésope, dont les personnages sont surtout des animaux ; il se termine par une <strong>morale</strong>, leçon de vie.") + formule("fable = récit court + animaux qui parlent + morale") + ex("<em>Le Corbeau et le Renard</em>, <em>La Cigale et la Fourmi</em> : d'Ésope à La Fontaine.") + astuce("Pour trouver la morale, demande-toi : quel défaut est puni, quelle qualité est récompensée ?")],
      [0, ex("<em>Iliade</em> : la colère d'Achille pendant la guerre de Troie. <em>Odyssée</em> : dix ans de retour pour Ulysse.", "Les deux épopées") + attention("Une épopée n'est pas un roman : c'est un long poème chanté, transmis d'abord oralement par les aèdes.")]],
    planches: [[2, { type: "2D", titre: "D'Homère à La Fontaine : une frise", legende: "Les deux genres traversent vingt-huit siècles : l'épopée d'Homère (VIIIᵉ siècle av. J.-C.), les fables d'Ésope (VIᵉ siècle av. J.-C.), reprises en vers par La Fontaine (XVIIᵉ siècle), tandis que les conteurs africains racontent toujours la ruse de la tortue.", svg: (function () {
      var s = "<rect width='640' height='220' fill='#FBF8F2'/><path d='M30 110H610' stroke='" + NUIT + "' stroke-width='3' marker-end='url(#frF)'/>";
      [[80, "VIIIᵉ s. av. J.-C.", "Homère", "Iliade, Odyssée", "#7A1F1F"], [210, "VIᵉ s. av. J.-C.", "Ésope", "fables en prose", VERT], [380, "XVIIᵉ siècle", "La Fontaine", "fables en vers", BLEU], [530, "aujourd'hui", "conteurs africains", "la tortue rusée", "#C2540A"]].forEach(function (e, i) { s += "<circle cx='" + e[0] + "' cy='110' r='9' fill='" + e[4] + "'/>" + txt(e[0], i % 2 ? 150 : 76, e[1], { s: 11, c: GRIS, w: 600 }) + txt(e[0], i % 2 ? 170 : 56, e[2], { s: 14, c: e[4] }) + txt(e[0], i % 2 ? 188 : 38, e[3], { s: 11, w: 500 }); });
      return svg(640, 220, "Frise chronologique : Homère, Ésope, La Fontaine, conteurs africains", fleche("frF", NUIT), s);
    })() }]],
    formules: [F("Critères de l'épopée", "long poème + héros + dieux", "Odyssée : plus de 12 000 vers, Ulysse, Athéna → épopée"), F("Critères de la fable", "récit court + animaux + morale", "Le Lièvre et la Tortue → fable"), F("Héritage", "œuvres + mots + genre universel", "une odyssée, le talon d'Achille ; la tortue des contes africains")]
  });

  /* ═══════════ 3e FRANÇAIS — LA SUBORDONNÉE RELATIVE ═══════════ */
  enrichir("3e-fr-relative", {
    blocs: [[0, formule("antécédent + pronom relatif + (sujet) + verbe = subordonnée relative") + def("Antécédent", "Nom ou pronom que la relative complète ; le pronom relatif le représente dans la relative.")],
      [1, ex("La route <strong>où</strong> l'accident a eu lieu est en travaux. (lieu)<br>Le chauffeur <strong>dont</strong> on parle est prudent. (parler <em>de</em>)<br>Le car <strong>que</strong> nous prenons part à 7 h. (COD)") + ex("La gare routière près de <strong>laquelle</strong> j'habite. · Les passagers <strong>auxquels</strong> il a parlé.", "Avec lequel")]],
    planches: [[1, { type: "2D", titre: "Choisir le pronom relatif en trois gestes", legende: "On remplace le pronom par l'antécédent pour retrouver la phrase simple, on cherche la fonction, puis on choisit le pronom.", svg: (function () {
      var s = "<rect width='640' height='250' fill='#FBF8F2'/>";
      [["1. Phrase simple", "On parle du chauffeur.", BLEU], ["2. Fonction", "complément introduit par « de »", "#7B3F99"], ["3. Pronom", "le chauffeur DONT on parle", VERT]].forEach(function (e, i) { var x = 20 + i * 210; s += "<rect x='" + x + "' y='60' width='190' height='110' rx='14' fill='#fff' stroke='" + e[2] + "' stroke-width='2.5'/><rect x='" + x + "' y='60' width='190' height='34' rx='12' fill='" + e[2] + "'/>" + txt(x + 95, 82, e[0], { s: 14, c: "#fff" }) + txt(x + 95, 136, e[1], { s: 12, w: 600 }) + (i < 2 ? "<path d='M" + (x + 192) + " 115H" + (x + 208) + "' stroke='" + NUIT + "' stroke-width='3' marker-end='url(#rlF2)'/>" : ""); });
      s += txt(320, 210, "sujet → qui · COD → que · de… → dont · lieu / temps → où · préposition → lequel", { s: 12, c: NUIT });
      return svg(640, 250, "Trois étapes pour choisir le pronom relatif : phrase simple, fonction, pronom", fleche("rlF2", NUIT), s);
    })() }]],
    formules: [F("Repérer l'antécédent", "nom + pronom relatif + verbe", "« la gare … le car … les passagers … l'accident »"), F("Retrouver la fonction", "phrase simple : remplacer le pronom par l'antécédent", "on parle du car → dont ; le car part de la gare → d'où / de laquelle"), F("Ponctuer", "déterminative sans virgules ; explicative entre virgules", "les passagers qui étaient assis derrière (sans virgules)")]
  });
})();
