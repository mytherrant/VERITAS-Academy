/* Leçons APPROFONDIES — lot 2 : SVT de 3e (16/11/2026). Même gabarit que 07-lecons-approfondies.js. */
(function () {
  /* double hélice : deux brins de perles reliés par des paires de bases (A-T bleu/jaune, G-C rouge/vert) */
  function adn3D() {
    var o = [], N = 22, R = 46, H = 300, k, BASES = [["#5B8DD6", "#F2C200"], ["#C0392B", "#1F8A4C"]];
    for (k = 0; k < N; k++) {
      var a = k / N * 4 * Math.PI, y = -H / 2 + k * H / (N - 1), x1 = R * Math.cos(a), z1 = R * Math.sin(a), x2 = -x1, z2 = -z1, p = BASES[(k * 7 % 5) < 2 ? 1 : 0], inv = k % 3 === 1;
      o.push({ f: "sphere", c: [x1, y, z1], r: 8, n: 8, m: 5, coul: "#8E96A6" });
      o.push({ f: "sphere", c: [x2, y, z2], r: 8, n: 8, m: 5, coul: "#B8BFCC" });
      o.push({ f: "poly", pts: [[x1, y - 3, z1], [0, y - 3, 0], [0, y + 3, 0], [x1, y + 3, z1]], coul: inv ? p[1] : p[0] });
      o.push({ f: "poly", pts: [[0, y - 3, 0], [x2, y - 3, z2], [x2, y + 3, z2], [0, y + 3, 0]], coul: inv ? p[0] : p[1] });
    }
    return o;
  }
  /* caryotype simplifié : 22 paires + la paire sexuelle */
  function caryo(sexe) {
    var h = "<svg viewBox='0 0 640 230' role='img' aria-label='Caryotype humain simplifié " + (sexe === "XY" ? "de garçon" : "de fille") + " : 22 paires et la paire " + sexe + "'><rect width='640' height='230' fill='#fff'/>", i, x, y, L;
    for (i = 1; i <= 23; i++) {
      x = 22 + ((i - 1) % 12) * 51; y = i <= 12 ? 20 : 125; L = Math.round(70 - (i - 1) * 2.2);
      var paire = i === 23 ? sexe.split("") : null, l2 = paire && paire[1] === "Y" ? 26 : L;
      if (i === 23) L = 58;
      h += "<rect x='" + x + "' y='" + (y + 80 - L) + "' width='9' height='" + L + "' rx='4.5' fill='" + (i === 23 ? "#C0392B" : "#5B8DD6") + "'/>" +
        "<rect x='" + (x + 13) + "' y='" + (y + 80 - (i === 23 ? l2 : L)) + "' width='9' height='" + (i === 23 ? l2 : L) + "' rx='4.5' fill='" + (i === 23 ? (paire[1] === "Y" ? "#1E499B" : "#C0392B") : "#5B8DD6") + "'/>" +
        "<text x='" + (x + 11) + "' y='" + (y + 96) + "' text-anchor='middle' font-size='10.5' fill='#001136'>" + (i === 23 ? sexe : i) + "</text>";
    }
    return h + "</svg>";
  }

  VRT_L("3e-svt-adn", {
    c: "3e", m: "svt", cle: "notions de chromosome et d", titre: "Chromosomes et ADN : le support de l'hérédité", duree: 35,
    accroche: "« Ta femme ne te donne que des filles », dit Mama à Tonton Essomba. La science dit le contraire, et tu vas pouvoir l'expliquer.",
    intro: "Une situation de famille te suit toute la leçon. À chaque partie, un indice t'aide à répondre, avec respect et avec des preuves, à une idée très répandue.",
    objectifs: ["montrer que l'information héréditaire est dans le noyau", "décrire les chromosomes et le caryotype humain", "expliquer comment se détermine le sexe d'un enfant", "relier chromosome, ADN, gène et caractère"],
    enquete: {
      titre: "« Ce n'est pas elle qui choisit »",
      svg: "<svg viewBox='0 0 640 240' role='img' aria-label='Une famille réunie au salon : une grand-mère, un couple et leurs trois filles'><rect width='640' height='240' fill='#FFF8EC'/><rect y='190' width='640' height='50' fill='#E3D3AE'/><rect x='30' y='40' width='120' height='80' fill='#DCEBFA' stroke='#8E6A3E' stroke-width='6'/><path d='M90 40v80M30 80h120' stroke='#8E6A3E' stroke-width='3'/><rect x='420' y='120' width='190' height='60' rx='14' fill='#8E6A3E'/><rect x='420' y='104' width='190' height='26' rx='10' fill='#A97D50'/><g><circle cx='470' cy='92' r='13' fill='#6B4A2A'/><path d='M454 104h32l6 46h-44z' fill='#7B2D8E'/><path d='M456 96c0-16 28-16 28 0' fill='#F2C200'/><text x='470' y='170' text-anchor='middle' font-size='11' font-weight='600' fill='#fff'>Mama</text></g><g><circle cx='250' cy='86' r='13' fill='#6B4A2A'/><path d='M234 100h32l4 70h-40z' fill='#1E499B'/><text x='250' y='212' text-anchor='middle' font-size='11' font-weight='600' fill='#001136'>Tonton Essomba</text></g><g><circle cx='320' cy='90' r='12' fill='#6B4A2A'/><path d='M306 102h28l8 68h-44z' fill='#1F8A4C'/><path d='M306 120h36' stroke='#F2C200' stroke-width='4'/><text x='320' y='226' text-anchor='middle' font-size='11' font-weight='600' fill='#001136'>Tata Ngo Bassong</text></g><g fill='#6B4A2A'><circle cx='170' cy='130' r='9'/><circle cx='196' cy='142' r='8'/><circle cx='372' cy='146' r='7'/></g><g><path d='M162 140h16l3 40h-22z' fill='#E05A8A'/><path d='M189 151h14l2 30h-18z' fill='#F2C200'/><path d='M366 154h12l2 26h-16z' fill='#5B8DD6'/></g><text x='184' y='200' text-anchor='middle' font-size='10.5' fill='#001136'>Prisca, Laure</text><text x='372' y='200' text-anchor='middle' font-size='10.5' fill='#001136'>Manuela</text><g><rect x='420' y='30' width='200' height='44' rx='12' fill='#fff' stroke='#C0392B'/><path d='M470 74l-6 14 18-14' fill='#fff' stroke='#C0392B'/><text x='520' y='49' text-anchor='middle' font-size='11' fill='#C0392B' font-weight='600'>« Ta femme ne te donne</text><text x='520' y='64' text-anchor='middle' font-size='11' fill='#C0392B' font-weight='600'>que des filles ! »</text></g></svg>",
      legende: "Le dimanche, chez Tonton Essomba, à Ebolowa.",
      contexte: "<p>Dimanche, toute la famille est réunie chez ton oncle, Tonton Essomba. Sa femme, Tata Ngo Bassong, vient d'accoucher de leur troisième fille, Manuela. La grand-mère soupire : « Ta femme ne te donne que des filles. Il faudrait qu'elle mange autrement pour avoir un garçon. » Une voisine ajoute : « Et la petite a les yeux de son grand-père : c'est le même sang. »</p><p>Tata Ngo Bassong est triste. Tonton Essomba se tourne vers toi : « Tu fais les chromosomes en 3e, non ? Explique-nous. »</p>",
      documents: [
        { t: "L'arbre de la famille", html: "<svg viewBox='0 0 300 120' role='img' aria-label='Arbre généalogique : un père et une mère, trois filles'><g stroke='#001136' stroke-width='1.5'><path d='M90 30h120M150 30v30M60 60h180M60 60v20M150 60v20M240 60v20'/></g><rect x='70' y='18' width='22' height='22' fill='#5B8DD6'/><circle cx='220' cy='29' r='11' fill='#E05A8A'/><g fill='#E05A8A'><circle cx='60' cy='92' r='11'/><circle cx='150' cy='92' r='11'/><circle cx='240' cy='92' r='11'/></g><g font-size='10' fill='#001136' text-anchor='middle'><text x='81' y='12'>Essomba</text><text x='220' y='12'>Ngo Bassong</text><text x='60' y='116'>Prisca</text><text x='150' y='116'>Laure</text><text x='240' y='116'>Manuela</text></g></svg><p>Carré : garçon ou homme ; rond : fille ou femme.</p>" },
        { t: "Une expérience de transfert de noyau (simplifiée)", html: "<p>On retire le noyau d'un ovule de grenouille <strong>albinos</strong> (blanche). On y place le noyau d'une cellule d'une grenouille <strong>verte</strong>. L'ovule se développe : on obtient une grenouille <strong>verte</strong>.</p>" },
        { t: "Ce que dit le médecin du centre de santé", html: "<p>« Les globules rouges, les cellules les plus nombreuses du sang, n'ont <strong>pas de noyau</strong>. Une transfusion sanguine ne change ni la couleur des yeux, ni le groupe de gènes de celui qui la reçoit. »</p>" }
      ],
      question: "D'où viennent les ressemblances entre un enfant et sa famille, et qui, du père ou de la mère, détermine si le bébé sera une fille ou un garçon ?",
      tache: "Prépare une explication de huit à dix lignes, claire et respectueuse, à présenter à la famille, en t'appuyant sur les documents et sur la leçon.",
      hypotheses: [
        "C'est la mère qui décide du sexe de l'enfant (la grand-mère).",
        "Les caractères se transmettent par le sang (la voisine).",
        "L'information héréditaire est portée par les chromosomes du noyau, venus pour moitié du père et pour moitié de la mère."
      ]
    },
    parties: [
      { t: "L'information héréditaire est dans le noyau", html:
        "<p>Une cellule est formée d'une membrane, d'un cytoplasme et, le plus souvent, d'un <strong>noyau</strong>. Lequel de ces éléments porte les caractères héréditaires ? Le document 2 répond.</p>" +
        "<div class='ex'><b>Raisonnement</b>L'ovule de grenouille albinos a gardé sa membrane et son cytoplasme, mais il a reçu le noyau d'une grenouille verte. La grenouille obtenue est verte : elle a les caractères de l'individu qui a fourni le <strong>noyau</strong>.</div>" +
        "<div class='def'><b>Conclusion</b>L'<strong>information génétique</strong>, qui commande les caractères héréditaires, se trouve dans le <strong>noyau</strong> des cellules.</div>" +
        "<div class='savais'><b>Le savais-tu ?</b>L'expression « c'est le même sang » est une image. Les globules rouges des mammifères perdent leur noyau en se formant : le sang ne transporte pas l'information héréditaire d'une génération à l'autre.</div>",
        planches: [{ type: "Schéma d'expérience", titre: "Le transfert de noyau", legende: "La grenouille obtenue ressemble à celle qui a donné le noyau, pas à celle qui a donné l'ovule.", svg:
          "<svg viewBox='0 0 640 200' role='img' aria-label='Transfert du noyau d une cellule de grenouille verte dans un ovule sans noyau de grenouille albinos ; résultat : grenouille verte'><rect width='640' height='200' fill='#fff'/><g><ellipse cx='70' cy='60' rx='42' ry='22' fill='#5FA845'/><circle cx='52' cy='50' r='5' fill='#fff'/><circle cx='52' cy='50' r='2.5' fill='#001136'/><text x='70' y='104' text-anchor='middle' font-size='11.5' font-weight='600' fill='#001136'>grenouille verte</text><circle cx='70' cy='150' r='20' fill='#E0F5E5' stroke='#2F7D22'/><circle cx='72' cy='150' r='8' fill='#2F7D22'/><text x='70' y='190' text-anchor='middle' font-size='11' fill='#001136'>une de ses cellules</text></g><path d='M92 150C180 150 200 110 260 110' stroke='#C0392B' stroke-width='2.5' fill='none' stroke-dasharray='6 4'/><path d='M260 110l-12-6v12z' fill='#C0392B'/><text x='170' y='136' font-size='11' fill='#C0392B' font-weight='600'>noyau</text><g><ellipse cx='300' cy='40' rx='42' ry='22' fill='#F4EFE6' stroke='#C9BFAE'/><circle cx='282' cy='30' r='5' fill='#fff' stroke='#E05A8A'/><circle cx='282' cy='30' r='2.5' fill='#E05A8A'/><text x='300' y='80' text-anchor='middle' font-size='11.5' font-weight='600' fill='#001136'>grenouille albinos</text><circle cx='300' cy='120' r='26' fill='#FBF5E8' stroke='#B39B70' stroke-width='2'/><circle cx='300' cy='120' r='8' fill='#2F7D22'/><text x='300' y='166' text-anchor='middle' font-size='11' fill='#001136'>son ovule, sans son noyau</text></g><path d='M340 120h80' stroke='#1E499B' stroke-width='3'/><path d='M420 120l-12-7v14z' fill='#1E499B'/><text x='380' y='108' text-anchor='middle' font-size='11' fill='#1E499B'>développement</text><g><ellipse cx='520' cy='120' rx='52' ry='28' fill='#5FA845'/><circle cx='498' cy='108' r='6' fill='#fff'/><circle cx='498' cy='108' r='3' fill='#001136'/><path d='M560 132l26 14M556 106l26-12' stroke='#4F9E36' stroke-width='6' stroke-linecap='round'/><text x='520' y='170' text-anchor='middle' font-size='12' font-weight='600' fill='#1F7A45'>grenouille VERTE</text></g></svg>" }],
        fil: { html: "<p>Les yeux de Manuela ressemblent à ceux de son grand-père parce qu'une partie de l'information génétique de ce grand-père lui est parvenue, de noyau en noyau, par les cellules reproductrices de ses parents. Pas par le sang : les globules rouges n'ont même pas de noyau.</p>", verdicts: [[1, "rejetee", "L'information héréditaire est dans le noyau ; les globules rouges n'en ont pas."]] },
        retenir: "Le noyau contient l'information génétique qui commande les caractères héréditaires." },

      { t: "Les chromosomes et le caryotype", html:
        "<p>Quand une cellule se divise, son noyau laisse voir de petits bâtonnets colorables : les <strong>chromosomes</strong>. En les photographiant au microscope, puis en les classant par paires et par taille décroissante, on obtient le <strong>caryotype</strong>.</p>" +
        "<ul><li>Une cellule humaine ordinaire contient <strong>46 chromosomes</strong>, soit <strong>23 paires</strong>.</li><li>Dans chaque paire, un chromosome vient du <strong>père</strong>, l'autre de la <strong>mère</strong>.</li><li>Les cellules reproductrices (spermatozoïdes, ovules) n'en contiennent que <strong>23</strong>, un de chaque paire.</li></ul>" +
        "<div class='def'><b>À la fécondation</b>Un spermatozoïde (23 chromosomes) s'unit à un ovule (23 chromosomes) : la cellule-œuf obtenue en possède <strong>46</strong>. Toutes les cellules de l'enfant en sont des copies.</div>",
        planches: [
          { type: "Document", titre: "Caryotype d'une fille (simplifié)", legende: "22 paires de chromosomes semblables chez la fille et le garçon, et une 23e paire : XX chez la fille.", svg: caryo("XX") },
          { type: "Document", titre: "Caryotype d'un garçon (simplifié)", legende: "La 23e paire du garçon est XY : un grand chromosome X et un petit chromosome Y.", svg: caryo("XY") }
        ],
        fil: { html: "<p>Manuela a 46 chromosomes : 23 viennent de son père (par le spermatozoïde), 23 de sa mère (par l'ovule). Ses ressemblances avec ses grands-parents passent par ces chromosomes, transmis de génération en génération.</p>", verdicts: [[2, "precisee", "Moitié des chromosomes vient du père, moitié de la mère, par les cellules reproductrices."]] },
        retenir: "46 chromosomes (23 paires) ; 23 dans chaque cellule reproductrice : la fécondation rétablit 46." },

      { t: "Fille ou garçon : la 23e paire décide", html:
        "<p>La 23e paire est celle des <strong>chromosomes sexuels</strong> : <strong>XX</strong> chez la fille, <strong>XY</strong> chez le garçon. Regardons ce que contiennent les cellules reproductrices :</p>" +
        "<ul><li>la mère (XX) ne peut donner qu'un chromosome <strong>X</strong> : <strong>tous les ovules portent X</strong> ;</li><li>le père (XY) produit deux sortes de spermatozoïdes, en nombre égal : <strong>la moitié porte X, l'autre moitié porte Y</strong>.</li></ul>" +
        "<div class='def'><b>Conclusion</b>Le sexe de l'enfant dépend du <strong>spermatozoïde</strong> qui féconde l'ovule : X donne une fille (XX), Y donne un garçon (XY). C'est le <strong>hasard</strong> de la fécondation, avec <strong>une chance sur deux</strong> à chaque naissance.</div>" +
        "<div class='attention'><b>Attention aux idées reçues</b>Ni l'alimentation de la mère, ni la position, ni le jour du mois ne choisissent le sexe de l'enfant. Et chaque naissance est indépendante des précédentes : après trois filles, la probabilité d'un garçon reste d'une chance sur deux.</div>",
        planches: [{ type: "Tableau de croisement", titre: "Ce que donnent les cellules reproductrices", legende: "Deux cases sur quatre donnent XX, deux donnent XY : une chance sur deux pour chaque sexe.", svg:
          "<svg viewBox='0 0 640 220' role='img' aria-label='Échiquier de croisement : ovules X, spermatozoïdes X ou Y ; résultats XX fille ou XY garçon'><rect width='640' height='220' fill='#fff'/><g font-size='12.5' font-weight='600' fill='#001136' text-anchor='middle'><text x='320' y='22'>Spermatozoïdes du père (XY)</text><text x='92' y='126'>Ovules de</text><text x='92' y='142'>la mère (XX)</text></g><g stroke='#C9D3E6' stroke-width='1.5' fill='none'><rect x='180' y='34' width='280' height='170' rx='10'/><path d='M180 74h280M320 34v170M180 139h280'/></g><g font-size='17' font-weight='600' text-anchor='middle'><text x='250' y='60' fill='#C0392B'>X</text><text x='390' y='60' fill='#1E499B'>Y</text><text x='160' y='112' fill='#C0392B'>X</text><text x='160' y='177' fill='#C0392B'>X</text></g><g text-anchor='middle'><rect x='196' y='84' width='108' height='46' rx='8' fill='#FCE8EF'/><text x='250' y='105' font-size='16' font-weight='600' fill='#C0392B'>XX</text><text x='250' y='122' font-size='11' fill='#001136'>fille</text><rect x='336' y='84' width='108' height='46' rx='8' fill='#EAF1FC'/><text x='390' y='105' font-size='16' font-weight='600' fill='#1E499B'>XY</text><text x='390' y='122' font-size='11' fill='#001136'>garçon</text><rect x='196' y='149' width='108' height='46' rx='8' fill='#FCE8EF'/><text x='250' y='170' font-size='16' font-weight='600' fill='#C0392B'>XX</text><text x='250' y='187' font-size='11' fill='#001136'>fille</text><rect x='336' y='149' width='108' height='46' rx='8' fill='#EAF1FC'/><text x='390' y='170' font-size='16' font-weight='600' fill='#1E499B'>XY</text><text x='390' y='187' font-size='11' fill='#001136'>garçon</text></g><text x='560' y='112' text-anchor='middle' font-size='12' fill='#4D5163'>1 chance</text><text x='560' y='128' text-anchor='middle' font-size='12' fill='#4D5163'>sur 2</text></svg>" }],
        fil: { html: "<p>Tata Ngo Bassong ne peut transmettre que des chromosomes X : ce n'est donc pas elle qui « donne » les filles. C'est le spermatozoïde de Tonton Essomba, X ou Y, qui a fait la différence, et c'est le pur hasard. Trois filles de suite, cela arrive dans environ une famille sur huit (1/2 × 1/2 × 1/2 = 1/8), et le prochain bébé aura toujours une chance sur deux d'être un garçon.</p>", verdicts: [[0, "rejetee", "Tous les ovules portent X ; c'est le spermatozoïde (X ou Y) qui détermine le sexe, au hasard."]] },
        retenir: "Ovule : toujours X. Spermatozoïde : X ou Y. Le sexe se joue au hasard de la fécondation, une chance sur deux." },

      { t: "ADN et gènes : le message écrit dans les chromosomes", html:
        "<p>Chaque chromosome est fait d'une seule et très longue molécule d'<strong>ADN</strong> (acide désoxyribonucléique), enroulée et repliée. Déroulé, l'ADN d'une seule cellule humaine mesurerait environ deux mètres !</p>" +
        "<ul><li>L'ADN a la forme d'une <strong>double hélice</strong> : deux brins enroulés l'un autour de l'autre, comme une échelle tordue.</li><li>Les barreaux de l'échelle sont des paires de <strong>bases</strong>, notées A, T, G et C : A en face de T, G en face de C. L'ordre de ces lettres est un <strong>message</strong>.</li><li>Un <strong>gène</strong> est une portion d'ADN qui porte l'information d'un caractère (couleur des yeux, groupe sanguin…).</li><li>Un même gène peut exister en plusieurs versions, les <strong>allèles</strong> : c'est pourquoi deux sœurs ne se ressemblent pas tout à fait.</li></ul>" +
        "<p class='formule'>noyau → chromosome → ADN → gène → caractère</p>",
        planches: [{ type: "3d", titre: "La double hélice d'ADN", legende: "Fais tourner la molécule : deux brins (perles grises) et des barreaux colorés, les paires de bases A-T et G-C. L'ordre des barreaux écrit le message génétique.",
          modele: { h: 440, rx: -8, ry: 20, echelle: 0.8, alt: "Molécule d ADN en double hélice, en trois dimensions", objets: adn3D(),
            etiquettes: [
              { p: [46, -150, 0], t: "Brin d'ADN" },
              { p: [-23, -64, -20], t: "Paire de bases A-T", cote: "d" },
              { p: [20, 30, 20], t: "Paire de bases G-C", cote: "d" },
              { p: [0, 120, 0], t: "Un gène : une portion du message", cote: "d" },
              { p: [-46, 0, 0], t: "Double hélice" }
            ] } }],
        fil: { html: "<p>La couleur des yeux de Manuela dépend de gènes, portés par des chromosomes qu'elle a reçus de son père et de sa mère, eux-mêmes hérités de leurs parents. Voilà pourquoi elle peut avoir les yeux de son grand-père : un allèle de ce grand-père lui est parvenu, d'ADN en ADN.</p>", verdicts: [[2, "validee", "Les caractères sont commandés par des gènes, portions de l'ADN des chromosomes, venus des deux parents."]] },
        retenir: "Chromosome = ADN enroulé ; gène = portion d'ADN ; allèles = versions d'un même gène." }
    ],
    denouement: {
      titre: "Ce que tu peux expliquer à la famille",
      etapes: [
        "L'information héréditaire est dans le noyau, pas dans le sang (indice 1).",
        "L'enfant reçoit 23 chromosomes de son père et 23 de sa mère (indice 2).",
        "La mère donne toujours un X ; le père donne X ou Y : le sexe dépend du spermatozoïde, au hasard, une chance sur deux (indice 3).",
        "Les ressemblances viennent des gènes, portions d'ADN des chromosomes hérités des deux familles (indice 4)."
      ],
      reponse: "<p>Mama, Tata Ngo Bassong n'y est pour rien. Les caractères héréditaires sont écrits dans l'ADN des chromosomes, à l'intérieur du noyau des cellules, pas dans le sang. Chaque enfant reçoit 23 chromosomes de son père et 23 de sa mère. Les cellules de la mère portent toutes un chromosome X ; celles du père portent soit un X, soit un Y. Si c'est un spermatozoïde porteur de X qui rencontre l'ovule, c'est une fille ; s'il porte Y, c'est un garçon. C'est le hasard, avec une chance sur deux à chaque naissance, et ce que mange la maman n'y change rien. Si Manuela a les yeux de son grand-père, c'est qu'elle a reçu un de ses gènes, transmis de génération en génération par les chromosomes.</p>",
      transfert: "<p>À l'hôpital de district, deux bébés nés le même soir ont été confondus. Les parents veulent savoir lequel est le leur. Le médecin propose une analyse de l'ADN plutôt qu'une comparaison du groupe sanguin seul. Explique, avec les mots chromosome, ADN, gène et allèle, pourquoi l'ADN permet de retrouver les parents d'un enfant.</p>"
    },
    revision: [
      "L'information génétique est dans le <strong>noyau</strong> (transfert de noyau).",
      "Homme : <strong>46 chromosomes</strong>, soit 23 paires ; cellules reproductrices : <strong>23</strong>.",
      "Chaque paire : un chromosome du <strong>père</strong>, un de la <strong>mère</strong>.",
      "<strong>Caryotype</strong> : chromosomes classés par paires et par taille.",
      "Fille <strong>XX</strong>, garçon <strong>XY</strong>.",
      "Ovule : toujours X. Spermatozoïde : X ou Y. Le <strong>spermatozoïde</strong> détermine le sexe, au hasard (1 chance sur 2).",
      "ADN : <strong>double hélice</strong>, bases A-T et G-C ; <strong>gène</strong> = portion d'ADN.",
      "<strong>Allèles</strong> : versions d'un même gène ; noyau → chromosome → ADN → gène → caractère."
    ],
    exo: "<p><strong>Exercice.</strong> Un couple a déjà deux garçons. Le mari affirme : « Le prochain sera forcément une fille, c'est son tour. »</p><ol><li>Quels chromosomes sexuels portent les ovules de la mère ? Et les spermatozoïdes du père ?</li><li>Construis le tableau de croisement.</li><li>Le mari a-t-il raison ? Justifie.</li></ol><p><em>Corrigé : 1. Ovules : X ; spermatozoïdes : X ou Y. 2. XX, XX, XY, XY. 3. Non : chaque naissance est indépendante, une chance sur deux d'avoir une fille.</em></p>",
    quiz: [
      { q: "Où se trouve l'information génétique d'une cellule ?", r: ["Dans le noyau", "Dans la membrane", "Dans le sang"], b: 0, e: "Le transfert de noyau le montre." },
      { q: "Pourquoi le sang ne transmet-il pas les caractères héréditaires ?", r: ["Les globules rouges n'ont pas de noyau", "Le sang est rouge", "Le sang circule trop vite"], b: 0, e: "Sans noyau, pas d'information génétique à transmettre." },
      { q: "Combien de chromosomes dans une cellule humaine ordinaire ?", r: ["46", "23", "92"], b: 0, e: "23 paires, soit 46." },
      { q: "Combien de chromosomes dans un spermatozoïde ?", r: ["23", "46", "1"], b: 0, e: "Un chromosome de chaque paire." },
      { q: "Quelle est la paire sexuelle d'une fille ?", r: ["XX", "XY", "YY"], b: 0, e: "XX chez la fille, XY chez le garçon." },
      { q: "Qui détermine le sexe de l'enfant ?", r: ["Le spermatozoïde, X ou Y", "L'ovule, X ou Y", "L'alimentation de la mère"], b: 0, e: "Tous les ovules portent X." },
      { q: "Après trois filles, la probabilité d'avoir un garçon est…", r: ["toujours de 1 sur 2", "plus grande", "nulle"], b: 0, e: "Chaque naissance est indépendante." },
      { q: "Un gène est…", r: ["une portion d'ADN", "un chromosome entier", "une cellule"], b: 0, e: "Il porte l'information d'un caractère." },
      { q: "Dans l'ADN, la base A est toujours en face de…", r: ["T", "G", "C"], b: 0, e: "A avec T, G avec C." },
      { q: "Deux sœurs ne sont pas identiques car elles ont reçu…", r: ["des allèles différents de leurs parents", "des nombres de chromosomes différents", "un sang différent"], b: 0, e: "Chaque cellule reproductrice emporte un assortiment différent d'allèles." }
    ]
  });
})();
