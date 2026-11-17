/* Leçons APPROFONDIES — lot 3 : racines carrées, atome, ressemblances (3e, 16/11/2026). Gabarit : 07-lecons-approfondies.js. */
(function () {
  function poulailler3D() {
    var o = [], S = 141, h = S / 2;   /* 7,07 m à l'échelle 20 unités par mètre */
    o.push({ f: "boite", c: [0, -3, 0], d: [S + 60, 6, S + 60], coul: "#C9A97A", dessus: "#B98E5A" });
    o.push({ f: "boite", c: [0, 1, 0], d: [S, 2, S], coul: "#E3D3AE" });
    [[-h, -h], [h, -h], [h, h], [-h, h]].forEach(function (p) { o.push({ f: "cylindre", c: [p[0], 0, p[1]], r: 3, h: 50, n: 8, coul: "#7A4A1E" }); });
    o.push({ f: "poly", pts: [[-h, 2, h], [h, 2, h], [h, 48, h], [-h, 48, h]], coul: "#AEB6C6", op: 0.35 });
    o.push({ f: "poly", pts: [[h, 2, h], [h, 2, -h], [h, 48, -h], [h, 48, h]], coul: "#AEB6C6", op: 0.35 });
    o.push({ f: "poly", pts: [[-h, 2, -h], [-h, 2, h], [-h, 48, h], [-h, 48, -h]], coul: "#AEB6C6", op: 0.35 });
    o.push({ f: "boite", c: [0, 54, -h + 22], d: [S + 10, 4, 54], coul: "#9AA3B2", dessus: "#C2C9D4" });
    o.push({ f: "poly", pts: [[-h, 3, -h], [-h + 2, 3, -h - 2], [h, 3, h - 2], [h - 2, 3, h]], coul: "#C0392B" });
    [[-30, 20], [20, -10], [40, 40], [-50, -40], [0, 50]].forEach(function (p) {
      o.push({ f: "sphere", c: [p[0], 9, p[1]], r: [7, 6, 9], n: 8, m: 5, coul: "#F4EFE6" });
      o.push({ f: "sphere", c: [p[0], 16, p[1] + 7], r: 3.5, n: 6, m: 4, coul: "#C0392B" });
    });
    return o;
  }
  function atome3D() {
    var o = [], k, N = [[0, 0, 0], [9, 4, 2], [-8, 5, -3], [3, -8, 5], [-4, -6, -7], [6, 7, -8], [-7, -3, 8], [2, 10, 6], [10, -5, -4], [-10, 2, 4], [4, -2, -11], [-2, -11, -1]];
    N.forEach(function (p, i) { o.push({ f: "sphere", c: [p[0] * 1.7, p[1] * 1.7, p[2] * 1.7], r: 10, n: 8, m: 5, coul: i % 2 ? "#8E96A6" : "#C0392B" }); });
    function anneau(R, tilt, n, el) {
      for (k = 0; k < n; k++) {
        var a = 2 * Math.PI * k / n, x = R * Math.cos(a), z = R * Math.sin(a), y = z * Math.sin(tilt), zz = z * Math.cos(tilt);
        o.push({ f: "sphere", c: [x, y, zz], r: 1.6, n: 4, m: 3, coul: "#9DB4D8" });
      }
      el.forEach(function (a) { var x = R * Math.cos(a), z = R * Math.sin(a); o.push({ f: "sphere", c: [x, z * Math.sin(tilt), z * Math.cos(tilt)], r: 6, n: 8, m: 5, coul: "#1E499B" }); });
    }
    anneau(75, 1.15, 48, [0.3, 3.44]);
    anneau(135, -0.75, 80, [1.0, 2.6, 4.2, 5.8]);
    return o;
  }
  function enquete3D() {
    /* histogramme en 3D du relevé de la classe : présents / absents pour 4 caractères */
    var o = [{ f: "boite", c: [0, -2, 0], d: [380, 4, 120], coul: "#E3E8F1" }], D = [[26, 14], [31, 9], [22, 18], [11, 29]];
    D.forEach(function (d, i) {
      var x = -135 + i * 90;
      o.push({ f: "boite", c: [x - 16, d[0] * 2.5, -10], d: [26, d[0] * 5, 26], coul: "#1E499B", dessus: "#5B8DD6", div: false });
      o.push({ f: "boite", c: [x + 16, d[1] * 2.5, 10], d: [26, d[1] * 5, 26], coul: "#F2B705", dessus: "#FFD86B", div: false });
    });
    return o;
  }

  /* ════════════════════ MATHS 3e — RACINES CARRÉES ════════════════════ */
  VRT_L("3e-maths-racines", {
    c: "3e", m: "maths", cle: "Racines carrées d", titre: "Racine carrée d'un nombre positif", duree: 35,
    accroche: "Papa Fotso veut un poulailler carré de 50 m². Combien mesure un côté, et combien de grillage acheter ?",
    intro: "Le poulailler de Papa Fotso te suit toute la leçon : à chaque partie, tu avances d'un pas vers les bonnes mesures.",
    objectifs: ["définir la racine carrée d'un nombre positif", "encadrer une racine carrée entre deux entiers", "simplifier une racine carrée avec √(a × b) = √a × √b", "utiliser une valeur approchée pour résoudre un problème concret"],
    enquete: {
      titre: "Le poulailler de Papa Fotso",
      svg: "<svg viewBox='0 0 640 230' role='img' aria-label='Un terrain derrière une maison, un carré tracé au sol pour le poulailler, des poules, un homme avec un mètre ruban'><rect width='640' height='230' fill='#EAF4FF'/><rect y='120' width='640' height='110' fill='#C9A97A'/><rect x='470' y='40' width='150' height='90' fill='#F1E6CF'/><path d='M460 44l85-30 85 30z' fill='#9AA3B2'/><rect x='520' y='80' width='30' height='50' fill='#6B4A2A'/><path d='M150 140h170v70H150z' fill='#E3D3AE' stroke='#C0392B' stroke-width='2.5' stroke-dasharray='8 5'/><text x='235' y='182' text-anchor='middle' font-size='14' font-weight='600' fill='#C0392B'>50 m² ?</text><g><circle cx='96' cy='126' r='10' fill='#6B4A2A'/><path d='M84 138h24l4 40H80z' fill='#1F8A4C'/><path d='M108 150l40 0' stroke='#F2C200' stroke-width='3'/><text x='96' y='196' text-anchor='middle' font-size='11' font-weight='600' fill='#001136'>Papa Fotso</text></g><g fill='#F4EFE6' stroke='#C9BFAE'><ellipse cx='370' cy='196' rx='12' ry='9'/><ellipse cx='400' cy='206' rx='12' ry='9'/><ellipse cx='430' cy='192' rx='12' ry='9'/></g><g fill='#C0392B'><circle cx='380' cy='189' r='4'/><circle cx='410' cy='199' r='4'/><circle cx='440' cy='185' r='4'/></g><g><rect x='30' y='20' width='240' height='44' rx='10' fill='#fff' stroke='#1E499B'/><text x='150' y='38' text-anchor='middle' font-size='11.5' fill='#1E499B' font-weight='600'>« 200 poules, 4 par m² : 50 m².</text><text x='150' y='54' text-anchor='middle' font-size='11.5' fill='#1E499B' font-weight='600'>Côté : 50 ÷ 4 = 12,5 m ! »</text></g></svg>",
      legende: "Derrière la maison, à Bafang : le carré tracé à la ficelle et les premières poules.",
      contexte: "<p>Papa Fotso, ton voisin à Bafang, se lance dans l'élevage : il veut <strong>200 poules pondeuses</strong>. Le technicien d'élevage lui a dit : pas plus de <strong>4 poules par mètre carré</strong>. Il veut un poulailler <strong>carré</strong> et doit acheter, au mètre, le grillage du tour et un fil de fer à tendre en diagonale pour accrocher les abreuvoirs.</p><p>Il a déjà fait son calcul (bulle ci-dessus). Son fils Junior, en 4e, propose autre chose. Papa Fotso te demande de vérifier avant d'aller à la quincaillerie.</p>",
      documents: [
        { t: "Les données de l'élevage", html: "<table class='donnees'><tr><td>Nombre de poules</td><td>200</td></tr><tr><td>Densité conseillée</td><td>4 poules par m² au plus</td></tr><tr><td>Forme</td><td>carré</td></tr><tr><td>Grillage</td><td>vendu au mètre entier</td></tr></table>" },
        { t: "Les calculs de la famille", html: "<p><strong>Papa Fotso :</strong> « Côté = 50 ÷ 4 = 12,5 m. »</p><p><strong>Junior :</strong> « 50 = 25 + 25, donc √50 = √25 + √25 = 5 + 5 = 10 m. »</p><p><strong>Toi :</strong> « Le côté est le nombre positif qui, multiplié par lui-même, donne 50. »</p>" }
      ],
      question: "Combien mesure exactement le côté du poulailler, combien de mètres de grillage faut-il acheter, et quelle longueur de fil pour la diagonale ?",
      tache: "Vérifie les deux calculs de la famille, puis donne à Papa Fotso les trois mesures avec une justification.",
      hypotheses: [
        "Le côté mesure 50 ÷ 4 = 12,5 m (Papa Fotso).",
        "√50 = √25 + √25 = 10, donc le côté mesure 10 m (Junior).",
        "Le côté est le nombre positif dont le carré vaut 50 : il est compris entre 7 et 8."
      ]
    },
    parties: [
      { t: "Définition de la racine carrée", html:
        "<p>Pour un carré de côté c, l'aire vaut c × c = c². Si l'on connaît l'aire et que l'on cherche le côté, on cherche un nombre <strong>positif</strong> dont le carré est égal à l'aire.</p>" +
        "<div class='def'><b>Définition</b>a est un nombre positif. La <strong>racine carrée</strong> de a, notée √a, est le nombre <strong>positif</strong> dont le carré est égal à a.</div>" +
        "<p class='formule'>(√a)² = a   et   √a ≥ 0</p><p>Exemples : √49 = 7 car 7² = 49 ; √0 = 0 ; √1 = 1 ; √0,25 = 0,5 car 0,5² = 0,25.</p>" +
        "<div class='attention'><b>Attention</b>√(−4) n'existe pas : aucun nombre au carré n'est négatif. Et −7 a aussi pour carré 49, mais √49 désigne le nombre <strong>positif</strong> 7.</div>",
        fil: { html: "<p>L'aire du poulailler est 200 ÷ 4 = <strong>50 m²</strong>. Son côté c vérifie c² = 50 avec c &gt; 0 : c'est <strong>√50</strong>. Papa Fotso a divisé par 4 comme pour un périmètre : vérifions, 12,5 × 12,5 = 156,25 m², trois fois trop !</p>", verdicts: [[0, "rejetee", "12,5² = 156,25 ≠ 50 : diviser l'aire par 4 ne donne pas le côté."], [2, "precisee", "Le côté est √50 ; reste à le situer et à le calculer."]] },
        retenir: "√a est le nombre positif dont le carré vaut a. Côté d'un carré = √(aire)." },

      { t: "Carrés parfaits et encadrement", html:
        "<p>Un <strong>carré parfait</strong> est le carré d'un entier. Les connaître permet de lire des racines exactes et d'encadrer les autres.</p>" +
        "<div class='tab-scroll'><table class='donnees'><tr><th>n</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td></tr><tr><th>n²</th><td>1</td><td>4</td><td>9</td><td>16</td><td>25</td><td>36</td><td>49</td><td>64</td><td>81</td><td>100</td><td>121</td><td>144</td></tr></table></div>" +
        "<div class='ex'><b>Encadrer √40</b>36 &lt; 40 &lt; 49, donc √36 &lt; √40 &lt; √49, soit <strong>6 &lt; √40 &lt; 7</strong>.</div>" +
        "<div class='astuce'><b>Astuce</b>Un carré parfait se termine par 0, 1, 4, 5, 6 ou 9. Un entier qui finit par 2, 3, 7 ou 8 n'est jamais un carré parfait : sa racine n'est pas entière.</div>",
        planches: [{ type: "Figure", titre: "50 m² entre deux carrés parfaits", legende: "Le carré de 49 m² (côté 7 m) est à peine plus petit ; celui de 64 m² (côté 8 m) est trop grand. Le côté cherché est entre 7 et 8.", svg:
          "<svg viewBox='0 0 640 230' role='img' aria-label='Trois carrés emboîtés de 49, 50 et 64 mètres carrés'><rect width='640' height='230' fill='#fff'/><g transform='translate(40 20)'><rect width='184' height='184' fill='#FFF3D1' stroke='#C79A00' stroke-width='2'/><rect width='163' height='163' fill='#EAF1FC' stroke='#1E499B' stroke-width='2.5'/><rect width='161' height='161' fill='#DDE8FA' stroke='#5B8DD6' stroke-dasharray='4 3'/><text x='80' y='88' text-anchor='middle' font-size='14' font-weight='600' fill='#1E499B'>50 m²</text><text x='80' y='106' text-anchor='middle' font-size='11' fill='#4D5163'>côté √50</text></g><g font-size='12.5' fill='#001136'><text x='290' y='60'><tspan font-weight='600' fill='#5B8DD6'>49 m²</tspan> : côté 7 m (trop juste)</text><text x='290' y='92'><tspan font-weight='600' fill='#1E499B'>50 m²</tspan> : côté √50</text><text x='290' y='124'><tspan font-weight='600' fill='#C79A00'>64 m²</tspan> : côté 8 m (trop grand)</text></g><path d='M290 170h300' stroke='#001136'/><g font-size='12' fill='#001136' text-anchor='middle'><path d='M310 165v10M570 165v10' stroke='#001136'/><text x='310' y='192'>7</text><text x='570' y='192'>8</text><circle cx='328' cy='170' r='5' fill='#C0392B'/><text x='336' y='158' fill='#C0392B' font-weight='600'>√50 ≈ 7,07</text></g></svg>" }],
        fil: { html: "<p>49 &lt; 50 &lt; 64, donc <strong>7 &lt; √50 &lt; 8</strong> : le côté mesure entre 7 et 8 mètres. Ni 12,5 m, ni 10 m. Et comme 50 est tout près de 49, √50 est tout près de 7.</p>", verdicts: [[2, "precisee", "7 < √50 < 8 : l'encadrement est confirmé."], [1, "rejetee", "10² = 100, pas 50 : 10 m est hors de l'encadrement."]] },
        retenir: "Pour encadrer √a, on cherche les deux carrés parfaits qui entourent a." },

      { t: "Règles de calcul : produit, quotient, et le piège de la somme", html:
        "<p class='formule'>√(a × b) = √a × √b      √(a / b) = √a / √b  (b ≠ 0)</p>" +
        "<div class='ex'><b>Simplifier √50</b>On cherche dans 50 un carré parfait en facteur : 50 = 25 × 2. Donc √50 = √25 × √2 = <strong>5√2</strong>.</div>" +
        "<div class='attention'><b>Piège classique</b>√(a + b) n'est <strong>pas</strong> égal à √a + √b. Contre-exemple : √(9 + 16) = √25 = 5, alors que √9 + √16 = 3 + 4 = 7. La racine se « partage » dans un produit, jamais dans une somme.</div>" +
        "<h3>La diagonale d'un carré</h3><p>Dans un carré de côté c, la diagonale d vérifie, d'après le théorème de Pythagore, d² = c² + c² = 2c². Donc <strong>d = c × √2</strong>.</p>",
        planches: [{ type: "3d", titre: "Le poulailler en 3D", legende: "Tourne le poulailler : le grillage fait le tour (4 côtés de √50 m), le fil rouge part d'un coin et va au coin opposé.",
          modele: { h: 360, rx: -30, ry: 35, echelle: 1.35, dy: 30, alt: "Poulailler carré en trois dimensions avec son grillage, son toit et un fil en diagonale", objets: poulailler3D(),
            etiquettes: [
              { p: [0, 2, 71], t: "Côté : √50 = 5√2 ≈ 7,07 m" },
              { p: [-35, 3, -35], t: "Fil en diagonale : 10 m", cote: "d" },
              { p: [71, 30, 30], t: "Grillage (4 côtés)", cote: "d" },
              { p: [0, 56, -48], t: "Toit en tôle" },
              { p: [20, 9, -10], t: "200 poules, 4 par m²", cote: "d" }
            ] } }],
        fil: { html: "<p>Junior a « partagé » la racine dans une somme : c'est interdit. En revanche, 50 = 25 × 2 donne √50 = <strong>5√2</strong>. Et la diagonale ? d = √50 × √2 = √(50 × 2) = √100 = <strong>10 m exactement</strong>. Le 10 de Junior était la bonne longueur… mais pour la diagonale, pas pour le côté !</p>", verdicts: [[1, "rejetee", "√(25 + 25) ≠ √25 + √25. Le côté vaut 5√2 ; c'est la diagonale qui mesure 10 m."]] },
        retenir: "√(ab) = √a × √b ; √(a + b) ≠ √a + √b ; diagonale d'un carré = côté × √2." },

      { t: "Valeur approchée et réponse concrète", html:
        "<p>Pour acheter du grillage, il faut un nombre décimal. On utilise la touche √ de la calculatrice, ou une valeur à connaître : <strong>√2 ≈ 1,414</strong>.</p>" +
        "<div class='ex'><b>Calcul</b>5√2 ≈ 5 × 1,414 = 7,07 m. Vérification : 7,07² ≈ 49,98 ≈ 50. ✔</div>" +
        "<div class='attention'><b>Arrondir dans le bon sens</b>Quand on achète, on arrondit <strong>au-dessus</strong> : avec un grillage trop court, le poulailler ne ferme pas.</div>" +
        "<div class='savais'><b>Le savais-tu ?</b>√2 n'est pas un nombre décimal : son écriture après la virgule ne s'arrête jamais et ne se répète jamais. On dit que c'est un nombre <strong>irrationnel</strong>.</div>",
        fil: { html: "<p>Périmètre : 4 × 5√2 = 20√2 ≈ 20 × 1,414 = 28,28 m. Le grillage se vend au mètre entier : il faut <strong>29 m</strong>. Pour la diagonale, <strong>10 m</strong> de fil, plus de quoi faire les nœuds.</p>", verdicts: [[2, "validee", "Côté √50 = 5√2 ≈ 7,07 m, entre 7 et 8 ; d'où 29 m de grillage et 10 m de diagonale."]] },
        retenir: "√2 ≈ 1,414 ; à l'achat, on arrondit toujours au-dessus." }
    ],
    denouement: {
      titre: "Les mesures pour la quincaillerie",
      etapes: [
        "Aire : 200 ÷ 4 = 50 m² ; côté c = √50 (indice 1).",
        "49 < 50 < 64 donc 7 < √50 < 8 : ni 12,5 m ni 10 m (indice 2).",
        "√50 = √25 × √2 = 5√2 ; diagonale = 5√2 × √2 = √100 = 10 m (indice 3).",
        "5√2 ≈ 7,07 m ; périmètre ≈ 28,28 m, donc 29 m de grillage (indice 4)."
      ],
      reponse: "<p>Papa Fotso, pour 200 poules à 4 par m², il faut 50 m². Le côté du carré est le nombre positif dont le carré vaut 50 : c'est √50 = 5√2, soit environ 7,07 m. Votre 12,5 m donnerait 156 m², trois fois trop, et les 10 m de Junior donneraient 100 m². Le tour mesure 4 × 7,07 ≈ 28,3 m : achetez 29 m de grillage. Le fil en diagonale mesure exactement √50 × √2 = √100 = 10 m : prévoyez 10,5 m pour les nœuds.</p>",
      transfert: "<p>Le collège veut un potager carré de 72 m² pour le club agricole, entouré d'une haie. Donne la valeur exacte du côté sous la forme a√b, une valeur approchée au centimètre, et la longueur de la diagonale (chemin en terre battue). <em>Indice : 72 = 36 × 2.</em></p>"
    },
    revision: [
      "√a existe si <strong>a ≥ 0</strong>, et <strong>√a ≥ 0</strong> ; (√a)² = a.",
      "Côté d'un carré d'aire A : <strong>√A</strong>.",
      "Carrés parfaits de 1 à 144 ; encadrer √a entre deux entiers.",
      "<strong>√(ab) = √a × √b</strong> ; √(a/b) = √a / √b.",
      "Simplifier : faire apparaître un carré parfait, √50 = √25 × √2 = 5√2.",
      "<strong>√(a + b) ≠ √a + √b</strong>.",
      "Diagonale d'un carré = côté × √2 ; √2 ≈ 1,414.",
      "Pour un achat, arrondir <strong>au-dessus</strong>."
    ],
    exo: "<p>Écris sous la forme a√b : √12 ; √75 ; √200. Puis encadre √130 entre deux entiers consécutifs. <em>(2√3 ; 5√3 ; 10√2 ; 11 &lt; √130 &lt; 12.)</em></p>",
    quiz: [
      { q: "Que vaut √49 ?", r: ["7", "−7", "24,5"], b: 0, e: "7² = 49 et √49 est positif." },
      { q: "Un carré a une aire de 50 m². Son côté est…", r: ["√50 m", "12,5 m", "25 m"], b: 0, e: "Côté = √(aire)." },
      { q: "Entre quels entiers se trouve √50 ?", r: ["7 et 8", "6 et 7", "8 et 9"], b: 0, e: "49 < 50 < 64." },
      { q: "√50 s'écrit aussi…", r: ["5√2", "25√2", "2√5"], b: 0, e: "50 = 25 × 2." },
      { q: "√(9 + 16) vaut…", r: ["5", "7", "25"], b: 0, e: "√25 = 5 ; on ne partage pas la racine dans une somme." },
      { q: "La diagonale d'un carré de côté √50 mesure…", r: ["10", "√100 + 2", "7,07"], b: 0, e: "√50 × √2 = √100 = 10." },
      { q: "Une valeur approchée de √2 est…", r: ["1,414", "1,732", "2,236"], b: 0, e: "1,414² ≈ 2." },
      { q: "√(−9)…", r: ["n'existe pas", "vaut −3", "vaut 3"], b: 0, e: "Aucun carré n'est négatif." },
      { q: "Il faut 28,28 m de grillage vendu au mètre. On achète…", r: ["29 m", "28 m", "28,3 m"], b: 0, e: "On arrondit au-dessus pour fermer le poulailler." },
      { q: "Lequel de ces nombres n'est pas un carré parfait ?", r: ["72", "81", "144"], b: 0, e: "72 est entre 64 et 81." }
    ],
    examen: { t: "Racines carrées au BEPC : sujets corrigés", href: "/corriges/" }
  });

  /* ════════════════════ PCT 3e — L'ATOME ════════════════════ */
  VRT_L("3e-pct-atome", {
    c: "3e", m: "pct", cle: "Séance 1 : Atome", titre: "L'atome", duree: 35,
    accroche: "Un fil de cuivre et la chaîne en or de Mama : même matière, couleur différente ? L'atome tranche.",
    intro: "Une discussion de famille te sert de fil rouge : à chaque partie, un indice t'aide à trancher entre trois idées.",
    objectifs: ["savoir que la matière est faite d'atomes", "décrire la structure d'un atome et ses ordres de grandeur", "expliquer la neutralité de l'atome et le rôle du numéro atomique Z", "lire et écrire les symboles chimiques"],
    enquete: {
      titre: "Le fil de cuivre et la chaîne en or",
      svg: "<svg viewBox='0 0 640 220' role='img' aria-label='Sur une table : une chaîne en or, un fil électrique dénudé en cuivre, une pince coupante ; deux enfants discutent'><rect width='640' height='220' fill='#FFF8EC'/><rect x='60' y='120' width='520' height='16' rx='4' fill='#A97D50'/><path d='M90 136v70M550 136v70' stroke='#8E6A3E' stroke-width='8'/><path d='M120 112c30-20 70-20 100 0' fill='none' stroke='#E0A800' stroke-width='5' stroke-dasharray='3 3'/><circle cx='170' cy='116' r='7' fill='#F2C200'/><path d='M260 112h120' stroke='#2E3445' stroke-width='9' stroke-linecap='round'/><path d='M380 112h40' stroke='#C46A2B' stroke-width='5' stroke-linecap='round'/><path d='M430 104l30 8-30 8' fill='#8E96A6'/><g font-size='11.5' font-weight='600' fill='#001136' text-anchor='middle'><text x='170' y='98'>chaîne en or</text><text x='340' y='98'>fil électrique (cuivre)</text></g><g><circle cx='60' cy='60' r='12' fill='#6B4A2A'/><path d='M46 74h28l4 40H42z' fill='#5B8DD6'/><rect x='80' y='18' width='190' height='40' rx='10' fill='#fff' stroke='#1E499B'/><text x='175' y='35' text-anchor='middle' font-size='11' fill='#1E499B'>« Or, cuivre : même matière,</text><text x='175' y='50' text-anchor='middle' font-size='11' fill='#1E499B'>seule la couleur change. »</text></g><g><circle cx='590' cy='70' r='10' fill='#6B4A2A'/><path d='M579 82h22l3 34h-28z' fill='#E05A8A'/><rect x='370' y='18' width='200' height='40' rx='10' fill='#fff' stroke='#C0392B'/><text x='470' y='35' text-anchor='middle' font-size='11' fill='#C0392B'>« Et si je coupe le fil en deux,</text><text x='470' y='50' text-anchor='middle' font-size='11' fill='#C0392B'>encore et encore, sans fin ? »</text></g></svg>",
      legende: "Chez toi, à Ngaoundéré : Ibrahim répare une rallonge pendant que sa petite sœur Fadimatou regarde.",
      contexte: "<p>Ton grand frère Ibrahim répare une rallonge électrique. Il dénude le fil : dedans, du <strong>cuivre</strong>, orange et brillant. Sur la table traîne la chaîne en <strong>or</strong> de Mama, jaune et brillante aussi. Ibrahim affirme que c'est « la même matière, de couleur différente ». Ta petite sœur Fadimatou prend la pince : « Et si je coupe le fil en deux, puis encore en deux, je peux continuer sans fin ? »</p><p>Mama, qui a acheté sa chaîne cher au marché, n'est pas d'accord avec Ibrahim. Tout le monde se tourne vers toi.</p>",
      documents: [
        { t: "Quelques éléments et leur numéro atomique", html: "<table class='donnees'><tr><th>Élément</th><th>Symbole</th><th>Z</th></tr><tr><td>Hydrogène</td><td>H</td><td>1</td></tr><tr><td>Carbone</td><td>C</td><td>6</td></tr><tr><td>Oxygène</td><td>O</td><td>8</td></tr><tr><td>Aluminium</td><td>Al</td><td>13</td></tr><tr><td>Fer</td><td>Fe</td><td>26</td></tr><tr><td>Cuivre</td><td>Cu</td><td>29</td></tr><tr><td>Or</td><td>Au</td><td>79</td></tr></table>" },
        { t: "Des tailles vertigineuses", html: "<p>Un atome de cuivre mesure environ <strong>0,25 milliardième de mètre</strong> (0,000 000 000 25 m). Sur un seul millimètre de fil, on pourrait aligner environ <strong>4 millions</strong> d'atomes de cuivre.</p><p>Le noyau est environ <strong>100 000 fois</strong> plus petit que l'atome.</p>", source: "Ordres de grandeur." }
      ],
      question: "Le cuivre et l'or sont-ils faits de la même matière, et peut-on couper un fil de cuivre indéfiniment ?",
      tache: "Explique à ta famille, en huit lignes, de quoi sont faits le fil et la chaîne et ce qui les distingue vraiment, chiffres à l'appui.",
      hypotheses: [
        "Le cuivre et l'or sont faits des mêmes grains de matière ; seule la couleur change (Ibrahim).",
        "On peut couper la matière en morceaux de plus en plus petits sans jamais s'arrêter (Fadimatou).",
        "Le cuivre et l'or sont faits d'atomes différents, qui se distinguent par leur nombre de protons."
      ]
    },
    parties: [
      { t: "La matière est faite d'atomes", html:
        "<p>Toute la matière qui nous entoure (le fil, la chaîne, l'eau du seau, l'air) est faite de grains extrêmement petits : les <strong>atomes</strong>. On ne peut pas les voir au microscope ordinaire ; des microscopes spéciaux (à effet tunnel) permettent aujourd'hui d'en « photographier » la surface.</p>" +
        "<div class='def'><b>Définition</b>Un <strong>atome</strong> est la plus petite partie d'un élément chimique qui garde l'identité de cet élément. Le cuivre est fait d'atomes de cuivre, l'or d'atomes d'or.</div>" +
        "<div class='ex'><b>Ordre de grandeur</b>Un atome de cuivre mesure environ 0,25 × 10⁻⁹ m. Dans 1 mm (10⁻³ m) de fil, on aligne environ 10⁻³ ÷ (0,25 × 10⁻⁹) = 4 × 10⁶, soit <strong>4 millions</strong> d'atomes.</div>",
        fil: { html: "<p>Fadimatou peut couper le fil en deux une vingtaine de fois avant que les morceaux deviennent trop petits pour sa pince. Mais même avec des outils parfaits, elle finirait par arriver à un <strong>atome de cuivre</strong> : si on le « coupait », ce ne serait plus du cuivre. La division a une limite.</p>", verdicts: [[1, "rejetee", "On arrive à l'atome, plus petite partie qui reste du cuivre."]] },
        retenir: "Toute matière est faite d'atomes ; l'atome est la plus petite partie d'un élément." },

      { t: "Un noyau minuscule et des électrons", html:
        "<p>Un atome est formé de deux parties :</p><ul><li>un <strong>noyau</strong> central, chargé positivement, qui contient des <strong>protons</strong> (charge +) et des <strong>neutrons</strong> (sans charge) ;</li><li>des <strong>électrons</strong> (charge −), très légers, qui se déplacent autour du noyau.</li></ul>" +
        "<p>Le noyau est environ <strong>100 000 fois</strong> plus petit que l'atome, mais il contient presque toute sa masse. Entre le noyau et les électrons : du <strong>vide</strong>.</p>" +
        "<div class='savais'><b>Pour imaginer</b>Si un atome avait la taille d'un grand stade de football (environ 200 m), son noyau serait un grain de maïs posé au centre (2 mm), et les électrons de minuscules poussières dans les tribunes.</div>" +
        "<div class='attention'><b>Modèle</b>Le dessin en anneaux ci-dessous est un <strong>modèle simplifié</strong> : en réalité, les électrons ne suivent pas des trajectoires circulaires bien nettes, ils occupent une région autour du noyau, le nuage électronique.</div>",
        planches: [{ type: "3d", titre: "Modèle simplifié de l'atome de carbone", legende: "Tourne l'atome : au centre, 6 protons (rouges) et 6 neutrons (gris) ; autour, 6 électrons (bleus), 2 sur la couche K et 4 sur la couche L. Les distances ne sont pas à l'échelle : le noyau devrait être 100 000 fois plus petit.",
          modele: { h: 380, rx: -10, ry: 25, echelle: 1.1, alt: "Modèle simplifié de l atome de carbone en trois dimensions", objets: atome3D(),
            etiquettes: [
              { p: [0, 0, 0], t: "Noyau : protons + neutrons" },
              { p: [15.3, 6.8, 3.4], t: "Neutron (pas de charge)", cote: "d" },
              { p: [-13.6, 8.5, -5.1], t: "Proton (charge +)" },
              { p: [75 * Math.cos(0.3), 75 * Math.sin(0.3) * Math.sin(1.15), 75 * Math.sin(0.3) * Math.cos(1.15)], t: "Électron (charge −)", cote: "d" },
              { p: [-135, 0, 0], t: "Couche L : 4 électrons" }
            ] } }],
        fil: { html: "<p>Le fil de cuivre comme la chaîne en or sont faits d'atomes qui ont tous la même architecture : un noyau de protons et de neutrons, entouré d'électrons. Alors, Ibrahim aurait-il raison ? Pas si vite : tout dépend du <strong>nombre</strong> de ces particules.</p>" },
        retenir: "Atome = noyau (protons +, neutrons) + électrons (−) ; noyau 100 000 fois plus petit que l'atome." },

      { t: "L'atome est neutre ; Z fait son identité", html:
        "<p>Dans un atome, il y a <strong>autant de protons que d'électrons</strong>. Les charges + et − se compensent exactement : l'atome est <strong>électriquement neutre</strong>.</p>" +
        "<div class='def'><b>Numéro atomique</b>Le nombre de protons du noyau s'appelle le <strong>numéro atomique Z</strong>. Tous les atomes d'un même élément ont le même Z, et deux éléments différents ont des Z différents : <strong>Z est la carte d'identité de l'élément</strong>.</div>" +
        "<div class='ex'><b>Exemple</b>Cuivre : Z = 29, donc 29 protons et, l'atome étant neutre, 29 électrons. Or : Z = 79, donc 79 protons et 79 électrons.</div>",
        fil: { html: "<p>D'après le document 1, un atome de cuivre a <strong>29 protons</strong>, un atome d'or en a <strong>79</strong>. Ce ne sont pas les mêmes atomes : ce sont deux <strong>éléments différents</strong>. La couleur, la masse, le prix et le comportement chimique en découlent. Mama a raison : sa chaîne n'est pas du cuivre « peint en jaune ».</p>", verdicts: [[0, "rejetee", "Cuivre Z = 29, or Z = 79 : deux éléments différents."], [2, "validee", "C'est le nombre de protons (Z) qui distingue les éléments."]] },
        retenir: "Nombre de protons = nombre d'électrons = Z. Z identifie l'élément." },

      { t: "Les symboles chimiques", html:
        "<p>Chaque élément a un <strong>symbole</strong> reconnu dans le monde entier : une lettre majuscule, parfois suivie d'une lettre minuscule. Il vient souvent du nom latin : Cu (cuprum, cuivre), Au (aurum, or), Fe (ferrum, fer), Na (natrium, sodium).</p>" +
        "<div class='attention'><b>Écriture</b>La première lettre est toujours en <strong>majuscule</strong>, la deuxième en <strong>minuscule</strong> : Cu, et non CU ni cu. Sinon on confond : Co (cobalt) n'est pas CO (monoxyde de carbone, une molécule).</div>" +
        "<div class='savais'><b>Le savais-tu ?</b>On connaît 118 éléments. Ils sont rangés par Z croissant dans la classification périodique, que tu étudieras en seconde.</div>",
        planches: [{ type: "Planche", titre: "Cases d'identité de quatre éléments de la maison", legende: "Chaque case donne le symbole, le nom et Z. Un atome de chaque élément a Z protons et Z électrons.", svg:
          "<svg viewBox='0 0 640 170' role='img' aria-label='Cases de l aluminium, du fer, du cuivre et de l or avec leur symbole et leur numéro atomique'><rect width='640' height='170' fill='#fff'/><g font-family='Poppins, sans-serif'><g transform='translate(20 20)'><rect width='130' height='130' rx='12' fill='#EEF1F6' stroke='#8E96A6'/><text x='12' y='26' font-size='14' fill='#4D5163'>13</text><text x='65' y='82' text-anchor='middle' font-size='44' font-weight='600' fill='#001136'>Al</text><text x='65' y='114' text-anchor='middle' font-size='12' fill='#4D5163'>aluminium (marmites)</text></g><g transform='translate(175 20)'><rect width='130' height='130' rx='12' fill='#F3ECE6' stroke='#8E6A3E'/><text x='12' y='26' font-size='14' fill='#4D5163'>26</text><text x='65' y='82' text-anchor='middle' font-size='44' font-weight='600' fill='#001136'>Fe</text><text x='65' y='114' text-anchor='middle' font-size='12' fill='#4D5163'>fer (fer à béton)</text></g><g transform='translate(330 20)'><rect width='130' height='130' rx='12' fill='#FBE9DE' stroke='#C46A2B'/><text x='12' y='26' font-size='14' fill='#4D5163'>29</text><text x='65' y='82' text-anchor='middle' font-size='44' font-weight='600' fill='#001136'>Cu</text><text x='65' y='114' text-anchor='middle' font-size='12' fill='#4D5163'>cuivre (fils)</text></g><g transform='translate(485 20)'><rect width='130' height='130' rx='12' fill='#FFF3D1' stroke='#C79A00'/><text x='12' y='26' font-size='14' fill='#4D5163'>79</text><text x='65' y='82' text-anchor='middle' font-size='44' font-weight='600' fill='#001136'>Au</text><text x='65' y='114' text-anchor='middle' font-size='12' fill='#4D5163'>or (bijoux)</text></g></g></svg>" }],
        fil: { html: "<p>Sur l'étiquette d'un câble électrique, on lit « Cu » ; sur le certificat d'un bijou, « Au ». Deux symboles, deux éléments, deux sortes d'atomes. La réponse de la famille est complète.</p>", verdicts: [[2, "validee", "Symboles Cu et Au : deux éléments aux atomes différents."]] },
        retenir: "Symbole : majuscule puis minuscule (Cu, Au, Fe, Na) ; souvent tiré du latin." }
    ],
    denouement: {
      titre: "De quoi sont faits le fil et la chaîne",
      etapes: [
        "Toute matière est faite d'atomes ; on ne peut pas diviser sans fin (indice 1).",
        "Chaque atome a un noyau (protons, neutrons) et des électrons ; le noyau est 100 000 fois plus petit (indice 2).",
        "Cuivre : Z = 29 ; or : Z = 79. Deux éléments différents (indice 3).",
        "Symboles Cu et Au, reconnus partout (indice 4)."
      ],
      reponse: "<p>Le fil et la chaîne sont faits d'atomes, des grains si petits qu'un millimètre de fil en aligne environ 4 millions. On ne peut donc pas couper le fil sans fin, Fadimatou : on finirait par arriver à un atome de cuivre, la plus petite partie qui soit encore du cuivre. Tous les atomes ont la même architecture : un noyau minuscule de protons et de neutrons, entouré d'électrons, autant d'électrons que de protons. Mais un atome de cuivre a 29 protons et un atome d'or en a 79 : ce sont deux éléments différents, de symboles Cu et Au. Ibrahim, ce n'est donc pas qu'une question de couleur, et la chaîne de Mama est bien en or.</p>",
      transfert: "<p>Au marché, un vendeur propose des marmites « en alu » et d'autres « en fonte » (du fer). Sachant que Z(Al) = 13 et Z(Fe) = 26, explique à un acheteur, en quatre lignes, ce qui différencie les atomes de ces deux métaux, et combien d'électrons possède chacun d'eux.</p>"
    },
    revision: [
      "Toute matière est faite d'<strong>atomes</strong>, plus petites parties d'un élément.",
      "Taille d'un atome : de l'ordre du dixième de <strong>milliardième de mètre</strong>.",
      "<strong>Noyau</strong> : protons (+) et neutrons (0) ; <strong>électrons</strong> (−) autour.",
      "Noyau environ <strong>100 000 fois</strong> plus petit que l'atome ; entre les deux, du vide.",
      "Atome <strong>neutre</strong> : autant de protons que d'électrons.",
      "<strong>Z</strong> = numéro atomique = nombre de protons = identité de l'élément.",
      "Symboles : <strong>H, C, O, Al, Fe, Cu, Au, Na</strong> (majuscule puis minuscule)."
    ],
    exo: "<p>L'atome de sodium a Z = 11. Combien a-t-il de protons ? d'électrons ? Pourquoi ? Écris son symbole correctement. <em>(11 protons, 11 électrons car l'atome est neutre ; symbole Na.)</em></p>",
    quiz: [
      { q: "La plus petite partie d'un élément qui garde son identité est…", r: ["l'atome", "le noyau", "l'électron"], b: 0, e: "Couper un atome de cuivre, ce n'est plus du cuivre." },
      { q: "Que contient le noyau d'un atome ?", r: ["Des protons et des neutrons", "Des électrons seulement", "Du vide"], b: 0, e: "Les électrons sont autour du noyau." },
      { q: "Quelle est la charge d'un électron ?", r: ["Négative", "Positive", "Nulle"], b: 0, e: "Le proton est +, le neutron n'a pas de charge." },
      { q: "Pourquoi un atome est-il électriquement neutre ?", r: ["Il a autant de protons que d'électrons", "Il n'a pas de neutrons", "Ses électrons sont immobiles"], b: 0, e: "Les charges + et − se compensent." },
      { q: "Le cuivre a Z = 29. Combien d'électrons a un atome de cuivre ?", r: ["29", "58", "0"], b: 0, e: "Atome neutre : autant d'électrons que de protons." },
      { q: "Qu'est-ce qui distingue un atome d'or d'un atome de cuivre ?", r: ["Le nombre de protons", "La couleur de ses électrons", "Rien"], b: 0, e: "Z(Au) = 79, Z(Cu) = 29." },
      { q: "Le noyau est environ … fois plus petit que l'atome.", r: ["100 000", "10", "2"], b: 0, e: "D'où l'image du grain de maïs dans un stade." },
      { q: "Quelle écriture du symbole du cuivre est correcte ?", r: ["Cu", "CU", "cu"], b: 0, e: "Majuscule puis minuscule." },
      { q: "Le symbole Au désigne…", r: ["l'or", "l'aluminium", "l'argent"], b: 0, e: "Du latin aurum." },
      { q: "Environ combien d'atomes de cuivre sur 1 mm de fil ?", r: ["4 millions", "4 000", "4"], b: 0, e: "10⁻³ ÷ (0,25 × 10⁻⁹) = 4 × 10⁶." }
    ]
  });

  /* ════════════════════ SVT 3e — RESSEMBLANCES ENTRE LES INDIVIDUS ════════════════════ */
  VRT_L("3e-svt-ressemblances", {
    c: "3e", m: "svt", cle: "Ressemblances entre les individus", titre: "Ressemblances entre les individus : les caractères de l'espèce humaine", duree: 35,
    accroche: "Deux jumelles qu'on confond, un chimpanzé qui nous ressemble : qui fait partie de quelle espèce, et pourquoi ?",
    intro: "Une sortie de classe et deux jumelles te guident toute la leçon : à chaque partie, un indice trie les caractères.",
    objectifs: ["distinguer caractères de l'espèce et caractères individuels", "définir l'espèce par l'interfécondité", "distinguer caractères héréditaires et caractères modifiés par le milieu", "exploiter un relevé de caractères"],
    enquete: {
      titre: "Awa, Aïssa et le chimpanzé de Limbé",
      svg: "<svg viewBox='0 0 640 230' role='img' aria-label='Une classe au centre de faune de Limbé devant un enclos de chimpanzés ; deux jumelles, l une en tenue de sport'><rect width='640' height='230' fill='#EAF4FF'/><rect y='150' width='640' height='80' fill='#7FB069'/><g fill='#2F8A3B'><ellipse cx='480' cy='80' rx='70' ry='50'/><ellipse cx='580' cy='90' rx='60' ry='45'/></g><path d='M380 150V90M380 90h260' stroke='#8E6A3E' stroke-width='3'/><g stroke='#8E6A3E' stroke-width='1.5'><path d='M400 90v60M430 90v60M460 90v60M490 90v60M520 90v60M550 90v60M580 90v60M610 90v60'/></g><g><circle cx='520' cy='120' r='12' fill='#3B2A1E'/><circle cx='520' cy='124' r='7' fill='#A97D50'/><path d='M508 134h24l6 30h-36z' fill='#3B2A1E'/><path d='M508 140l-14 18M532 140l14 18' stroke='#3B2A1E' stroke-width='6' stroke-linecap='round'/></g><g><circle cx='120' cy='112' r='11' fill='#6B4A2A'/><path d='M108 124h24l4 40h-32z' fill='#1E3A6E'/><circle cx='170' cy='112' r='11' fill='#5A3C22'/><path d='M156 124h28l6 40h-40z' fill='#C0392B'/><path d='M156 132l-8 16M184 132l8 16' stroke='#5A3C22' stroke-width='6' stroke-linecap='round'/></g><g fill='#6B4A2A'><circle cx='250' cy='118' r='10'/><circle cx='300' cy='120' r='10'/></g><g><path d='M240 130h20l4 34h-28z' fill='#E9EEF6'/><path d='M290 132h20l4 32h-28z' fill='#E9EEF6'/></g><g font-size='11' font-weight='600' fill='#001136' text-anchor='middle'><text x='120' y='182'>Awa</text><text x='172' y='182'>Aïssa (handball)</text><text x='275' y='182'>Christelle, Ndi</text><text x='520' y='186'>chimpanzé</text></g><g><rect x='206' y='30' width='200' height='40' rx='10' fill='#fff' stroke='#1E499B'/><text x='306' y='47' text-anchor='middle' font-size='11' fill='#1E499B'>« Il est presque humain,</text><text x='306' y='62' text-anchor='middle' font-size='11' fill='#1E499B'>regarde ses mains ! »</text></g></svg>",
      legende: "Sortie de la 3e au centre de faune de Limbé ; sur le chemin du retour, on parle des jumelles.",
      contexte: "<p>Ta classe de 3e visite le centre de faune de Limbé. Devant l'enclos des chimpanzés, Ndi s'exclame : « Il est presque humain ! Il a des mains comme nous, il nous regarde comme nous. » Christelle répond qu'un chimpanzé n'est pas un humain, « même s'il nous ressemble ».</p><p>Dans le car du retour, la discussion continue avec les jumelles <strong>Awa et Aïssa</strong>, de vraies jumelles. Au CM2, tout le monde les confondait. Aujourd'hui, Aïssa, qui fait du handball tous les jours, est plus musclée et plus bronzée que sa sœur. « Les vraies jumelles ont exactement les mêmes caractères », affirme Ndi. Le professeur de SVT vous demande de trier tout cela.</p>",
      documents: [
        { t: "Le relevé de la classe de 3e B (40 élèves)", html: "<table class='donnees'><tr><th>Caractère</th><th>Présent</th><th>Absent</th></tr><tr><td>Lobe de l'oreille détaché</td><td>26</td><td>14</td></tr><tr><td>Sait rouler la langue en gouttière</td><td>31</td><td>9</td></tr><tr><td>Fossette au menton ou aux joues</td><td>22</td><td>18</td></tr><tr><td>Pousse le pouce en arrière (« pouce d'auto-stoppeur »)</td><td>11</td><td>29</td></tr><tr><td>Marche debout sur deux pieds</td><td>40</td><td>0</td></tr></table>", source: "Données de l'exercice, relevées en classe." },
        { t: "Ce que dit le guide du centre", html: "<p>« Le chimpanzé partage avec nous beaucoup de caractères : mains préhensiles, vision des couleurs, vie en groupe. Mais un être humain et un chimpanzé <strong>ne peuvent pas avoir de descendance ensemble</strong>. »</p>" }
      ],
      question: "Qu'est-ce qui fait qu'un individu appartient à l'espèce humaine, et pourquoi deux vraies jumelles ne sont-elles plus tout à fait identiques ?",
      tache: "Classe les caractères observés (relevé, jumelles, chimpanzé) dans un tableau, puis rédige une conclusion de six à huit lignes pour la classe.",
      hypotheses: [
        "Le chimpanzé fait presque partie de l'espèce humaine puisqu'il nous ressemble beaucoup (Ndi).",
        "De vraies jumelles ont, toute leur vie, exactement les mêmes caractères (Ndi).",
        "Chaque individu porte des caractères de l'espèce, des caractères individuels hérités de ses parents, et d'autres modifiés par son mode de vie."
      ]
    },
    parties: [
      { t: "Les caractères de l'espèce et la notion d'espèce", html:
        "<p>Les 40 élèves de la classe marchent debout sur deux pieds (dernière ligne du relevé). Tous ont aussi un pouce opposable, un grand cerveau, la parole articulée. Ces traits, communs à tous les êtres humains, sont les <strong>caractères de l'espèce humaine</strong>.</p>" +
        "<div class='def'><b>Définition</b>Une <strong>espèce</strong> est un ensemble d'individus qui se ressemblent et qui peuvent se reproduire entre eux en donnant des descendants eux-mêmes <strong>féconds</strong>.</div>" +
        "<p>La ressemblance ne suffit donc pas : le critère décisif est l'<strong>interfécondité</strong>. Le cheval et l'âne peuvent avoir un descendant, le mulet, mais le mulet est stérile : le cheval et l'âne appartiennent à deux espèces différentes.</p>",
        fil: { html: "<p>Le chimpanzé partage de nombreux caractères avec nous, mais le guide est clair : un humain et un chimpanzé ne peuvent pas avoir de descendance ensemble. Le chimpanzé appartient donc à une <strong>autre espèce</strong>, même s'il en est l'une des plus proches.</p>", verdicts: [[0, "rejetee", "Pas d'interfécondité entre humain et chimpanzé : ce sont deux espèces."]] },
        retenir: "Espèce = individus semblables, interféconds, à descendance féconde." },

      { t: "Les caractères individuels", html:
        "<p>À l'intérieur de l'espèce, chacun présente ses propres variations : forme du lobe de l'oreille, capacité à rouler la langue, fossettes, groupe sanguin, couleur des yeux… Ce sont les <strong>caractères individuels</strong> (ou variations individuelles).</p>" +
        "<p>Le relevé de la classe le montre : pour ces caractères, les élèves se répartissent en deux groupes, alors que pour la bipédie, ils sont tous identiques. C'est l'association de nombreux caractères individuels qui rend chaque personne <strong>unique</strong>.</p>",
        planches: [{ type: "3d", titre: "Le relevé de la classe en 3D", legende: "Bleu : élèves qui présentent le caractère ; jaune : ceux qui ne le présentent pas. De gauche à droite : lobe détaché, langue roulée, fossettes, pouce d'auto-stoppeur. Chaque caractère partage la classe : ce sont des caractères individuels.",
          modele: { h: 340, rx: -22, ry: 28, echelle: 1.1, dy: 90, alt: "Histogramme en trois dimensions des quatre caractères du relevé de la classe", objets: enquete3D(),
            etiquettes: [
              { p: [-151, 130, -10], t: "Lobe détaché : 26" },
              { p: [-29, 155, -10], t: "Langue roulée : 31" },
              { p: [61, 110, -10], t: "Fossettes : 22", cote: "d" },
              { p: [151, 145, 10], t: "Pas de pouce d'auto-stoppeur : 29", cote: "d" }
            ] } }],
        fil: { html: "<p>Awa et Aïssa partagent avec toute la classe les caractères de l'espèce. Elles partagent aussi entre elles les mêmes caractères individuels hérités : même forme de lobe, mêmes fossettes, même groupe sanguin. C'est pour cela qu'on les confondait au CM2.</p>", verdicts: [[2, "precisee", "Caractères de l'espèce communs à tous, caractères individuels variables : le tri commence."]] },
        retenir: "Caractères individuels = variations qui rendent chaque personne unique." },

      { t: "Héréditaire ou modifié par le milieu ?", html:
        "<p>Certains caractères individuels sont transmis par les parents : ils sont <strong>héréditaires</strong> (groupe sanguin, forme du lobe de l'oreille, couleur naturelle des yeux et de la peau). D'autres dépendent du <strong>milieu</strong> et du <strong>mode de vie</strong> : la peau qui fonce au soleil, les muscles développés par le sport, une cicatrice, l'accent.</p>" +
        "<div class='def'><b>À retenir</b>Un caractère héréditaire se transmet aux enfants ; un caractère acquis par le mode de vie ne se transmet pas. Le fils d'un champion de handball ne naît pas musclé.</div>" +
        "<div class='ex'><b>Les vraies jumelles</b>Elles proviennent d'une même cellule-œuf qui s'est séparée en deux : elles ont reçu exactement la même information génétique. Leurs différences ne peuvent donc venir que du <strong>milieu</strong> et du <strong>mode de vie</strong>.</div>",
        planches: [{ type: "Tableau", titre: "Trier les caractères des jumelles", legende: "Les caractères héréditaires restent identiques ; ce sont les caractères modifiés par le mode de vie qui les distinguent.", svg:
          "<svg viewBox='0 0 640 220' role='img' aria-label='Tableau en trois colonnes : caractères de l espèce, caractères individuels héréditaires, caractères modifiés par le milieu'><rect width='640' height='220' fill='#fff'/><g><rect x='10' y='10' width='200' height='34' rx='8' fill='#EEF3FC'/><rect x='220' y='10' width='200' height='34' rx='8' fill='#FFF3D1'/><rect x='430' y='10' width='200' height='34' rx='8' fill='#F1FAF4'/></g><g font-size='12.5' font-weight='600' fill='#001136' text-anchor='middle'><text x='110' y='32'>Caractères de l’espèce</text><text x='320' y='32'>Individuels héréditaires</text><text x='530' y='32'>Modifiés par le milieu</text></g><g font-size='12' fill='#2E3445'><text x='24' y='76'>• bipédie</text><text x='24' y='102'>• pouce opposable</text><text x='24' y='128'>• grand cerveau</text><text x='24' y='154'>• langage articulé</text><text x='234' y='76'>• groupe sanguin</text><text x='234' y='102'>• forme du lobe</text><text x='234' y='128'>• fossettes</text><text x='234' y='154'>• couleur des yeux</text><text x='444' y='76'>• muscles (handball)</text><text x='444' y='102'>• bronzage</text><text x='444' y='128'>• cicatrice</text><text x='444' y='154'>• accent, savoirs</text></g><g font-size='11.5' text-anchor='middle'><text x='110' y='196' fill='#1E499B'>communs à tous</text><text x='320' y='196' fill='#8A6200'>identiques chez Awa et Aïssa</text><text x='530' y='196' fill='#1F7A45'>différents chez Awa et Aïssa</text></g></svg>" }],
        fil: { html: "<p>Awa et Aïssa ont reçu la même information génétique : groupe sanguin, lobe, fossettes, couleur des yeux sont identiques. Mais Aïssa s'entraîne au handball et joue au soleil : ses muscles et sa peau se sont modifiés. Ces différences ne sont pas héréditaires.</p>", verdicts: [[1, "rejetee", "Même information génétique, mais le mode de vie (sport, soleil) a modifié certains caractères."]] },
        retenir: "Héréditaire : transmis par les parents. Modifié par le milieu : acquis, non transmis." },

      { t: "D'où viennent les caractères héréditaires ?", html:
        "<p>Chaque être humain provient d'une <strong>cellule-œuf</strong>, formée par l'union d'un spermatozoïde du père et d'un ovule de la mère. Chacune de ces cellules apporte la moitié de l'information génétique, portée par les <strong>chromosomes</strong> du noyau.</p>" +
        "<p>Comme chaque spermatozoïde et chaque ovule emporte un assortiment différent de cette information, deux frères et sœurs ne reçoivent pas les mêmes combinaisons : ils se ressemblent sans être identiques. Seuls les <strong>vrais jumeaux</strong>, issus d'une même cellule-œuf, ont la même information génétique.</p>" +
        "<div class='savais'><b>Pour aller plus loin</b>La leçon « Chromosomes et ADN » montre où et comment cette information est écrite.</div>",
        fil: { html: "<p>Le tri est complet : chaque individu porte les caractères de son espèce, des caractères individuels hérités de ses deux parents par la cellule-œuf, et des caractères modifiés par sa vie. C'est vrai pour toi, pour Awa et Aïssa… et, dans son espèce à lui, pour le chimpanzé de Limbé.</p>", verdicts: [[2, "validee", "Caractères de l'espèce + caractères individuels héréditaires (cellule-œuf) + caractères modifiés par le milieu."]] },
        retenir: "Les caractères héréditaires viennent des deux parents, par la cellule-œuf." }
    ],
    denouement: {
      titre: "La conclusion de la classe",
      etapes: [
        "Le chimpanzé n'est pas interfécond avec l'humain : autre espèce (indice 1).",
        "Le relevé partage la classe pour les caractères individuels, pas pour la bipédie (indice 2).",
        "Les vraies jumelles ont la même information génétique ; sport et soleil les ont différenciées (indice 3).",
        "Les caractères héréditaires viennent des deux parents, par la cellule-œuf (indice 4)."
      ],
      reponse: "<p>Tous les élèves de la classe marchent debout, ont un pouce opposable et parlent : ce sont des caractères de l'espèce humaine. Le chimpanzé nous ressemble, mais il ne peut pas avoir de descendance avec un humain : il appartient à une autre espèce. À l'intérieur de notre espèce, chacun présente des caractères individuels, comme la forme du lobe ou les fossettes, qui partagent la classe en groupes. Beaucoup sont héréditaires : ils viennent des deux parents par la cellule-œuf. D'autres sont modifiés par le mode de vie. Awa et Aïssa, vraies jumelles, ont reçu la même information génétique : leurs différences de muscles et de bronzage viennent du handball et du soleil, pas de l'hérédité.</p>",
      transfert: "<p>Un éleveur de Ngaoundéré croise une vache de race goudali avec un taureau de race holstein et obtient des veaux qui, adultes, se reproduisent normalement. Le goudali et la holstein appartiennent-ils à la même espèce ? Justifie avec la définition de l'espèce, puis cite un caractère de l'espèce et deux caractères qui varient d'une race à l'autre.</p>"
    },
    revision: [
      "<strong>Espèce</strong> : individus semblables, interféconds, à descendance féconde.",
      "Ressembler ne suffit pas : critère de l'<strong>interfécondité</strong> (humain et chimpanzé : deux espèces).",
      "<strong>Caractères de l'espèce</strong> : communs à tous (bipédie, pouce opposable, langage).",
      "<strong>Caractères individuels</strong> : variables d'une personne à l'autre (lobe, fossettes, groupe sanguin).",
      "<strong>Héréditaires</strong> : transmis par les parents ; <strong>modifiés par le milieu</strong> : acquis, non transmis.",
      "Vrais jumeaux : même information génétique, différences dues au milieu.",
      "Information héréditaire apportée par le spermatozoïde et l'ovule, réunis dans la <strong>cellule-œuf</strong>."
    ],
    exo: "<p>Classe ces caractères dans les trois colonnes (espèce, individuel héréditaire, modifié par le milieu) : groupe sanguin, bronzage, bipédie, couleur des yeux, cicatrice, langage articulé, muscles d'un docker du port de Douala. <em>(Espèce : bipédie, langage. Héréditaires : groupe sanguin, yeux. Milieu : bronzage, cicatrice, muscles.)</em></p>",
    quiz: [
      { q: "Quel critère décide que deux individus sont de la même espèce ?", r: ["Ils ont ensemble des descendants féconds", "Ils se ressemblent beaucoup", "Ils vivent au même endroit"], b: 0, e: "C'est l'interfécondité." },
      { q: "Le chimpanzé et l'humain sont…", r: ["deux espèces différentes", "la même espèce", "deux races de la même espèce"], b: 0, e: "Pas de descendance possible entre eux." },
      { q: "Le mulet, fils d'un âne et d'une jument, est stérile. Donc…", r: ["l'âne et le cheval sont deux espèces", "l'âne et le cheval sont une seule espèce", "le mulet est une espèce"], b: 0, e: "La descendance doit être féconde." },
      { q: "La bipédie est un caractère…", r: ["de l'espèce", "individuel acquis", "individuel héréditaire"], b: 0, e: "Les 40 élèves la présentent." },
      { q: "La forme du lobe de l'oreille est un caractère…", r: ["individuel héréditaire", "de l'espèce", "acquis par le sport"], b: 0, e: "Il partage la classe et vient des parents." },
      { q: "Le bronzage est un caractère…", r: ["modifié par le milieu", "héréditaire", "de l'espèce"], b: 0, e: "Il dépend de l'exposition au soleil." },
      { q: "D'après le relevé, combien d'élèves savent rouler la langue ?", r: ["31", "9", "40"], b: 0, e: "31 présents, 9 absents." },
      { q: "Pourquoi deux vraies jumelles ont-elles le même groupe sanguin ?", r: ["Elles viennent d'une même cellule-œuf", "Elles mangent la même chose", "Elles dorment dans la même chambre"], b: 0, e: "Même information génétique." },
      { q: "Aïssa est plus musclée que sa jumelle car…", r: ["elle fait du handball", "elle a hérité d'autres gènes", "elle est plus âgée"], b: 0, e: "Caractère modifié par le mode de vie." },
      { q: "Un caractère acquis par le sport…", r: ["ne se transmet pas aux enfants", "se transmet toujours", "devient un caractère de l'espèce"], b: 0, e: "Seuls les caractères héréditaires passent à la descendance." }
    ]
  });
})();
