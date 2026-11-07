/* Leçons rédigées VÉRITAS — sciences, lot 2 (6e, 5e, 4e, Tle C, Tle D). Animations : 91-animations-2.js */
VRT_L("6e-maths-divisibilite", {
  c: "6e", m: "maths", cle: "Critères de divisibilité par 10, 100, 1000", titre: "Les critères de divisibilité", duree: 15,
  accroche: "Savoir si un nombre se divise par 3 sans poser la division ? C'est possible.",
  intro: "Partager 126 mangues entre 9 élèves sans reste, est-ce possible ? Les critères de divisibilité répondent en quelques secondes, sans poser la division.",
  objectifs: ["appliquer les critères par 2, 5, 10, 100, 1 000", "appliquer les critères par 3 et par 9", "justifier une réponse"],
  parties: [
    { t: "Le vocabulaire", html: "<div class='def'><b>Définition</b>Un nombre entier est <strong>divisible</strong> par un autre si le reste de la division est 0. On dit aussi qu'il en est un <strong>multiple</strong>.</div><div class='ex'><b>Exemple</b>126 ÷ 9 = 14 reste 0 : 126 est divisible par 9 ; 126 est un multiple de 9.</div>", retenir: "Divisible = reste nul." },
    { t: "Les critères", html: "<div class='tab-scroll'><table><thead><tr><th>Par</th><th>Un nombre est divisible s'il…</th><th>Exemple</th></tr></thead><tbody><tr><th>2</th><td>se termine par 0, 2, 4, 6 ou 8</td><td>358</td></tr><tr><th>5</th><td>se termine par 0 ou 5</td><td>1 235</td></tr><tr><th>10 / 100 / 1 000</th><td>se termine par 0 / 00 / 000</td><td>4 500</td></tr><tr><th>3</th><td>a une somme des chiffres divisible par 3</td><td>213 → 2+1+3 = 6</td></tr><tr><th>9</th><td>a une somme des chiffres divisible par 9</td><td>126 → 1+2+6 = 9</td></tr></tbody></table></div><div class='astuce'><b>Astuce</b>Si la somme des chiffres est encore grande, recommence : 98 766 → 36 → 3+6 = 9, donc divisible par 9 (et par 3).</div>", retenir: "2, 5, 10 : regarder le dernier chiffre. 3 et 9 : additionner les chiffres." },
    { t: "Justifier", html: "<div class='ex'><b>Exemple de rédaction</b>« 2 745 est divisible par 5 car il se termine par 5. Il est divisible par 9 car 2 + 7 + 4 + 5 = 18 et 18 est divisible par 9. »</div><div class='attention'><b>Attention</b>Divisible par 9 entraîne divisible par 3, mais pas l'inverse : 12 est divisible par 3 et pas par 9.</div>", retenir: "Toujours écrire « car… » avec le critère utilisé." }
  ],
  revision: ["Divisible = reste nul.", "Par 2 : chiffre des unités pair ; par 5 : 0 ou 5 ; par 10 : 0.", "Par 3 / par 9 : somme des chiffres divisible par 3 / par 9.", "Divisible par 9 ⇒ divisible par 3."],
  exo: "<p>Parmi 120, 315, 1 008, 2 222, lesquels sont divisibles par 2 ? par 3 ? par 5 ? par 9 ?</p>",
  quiz: [
    { q: "4 572 est-il divisible par 3 ?", r: ["Oui", "Non"], b: 0, e: "4+5+7+2 = 18, divisible par 3." },
    { q: "Quel nombre est divisible par 5 ?", r: ["2 352", "1 405", "777"], b: 1, e: "Il se termine par 5." },
    { q: "12 est divisible par 3. Est-il divisible par 9 ?", r: ["Oui", "Non"], b: 1, e: "1+2 = 3, pas un multiple de 9." }
  ]
});

VRT_L("5e-maths-pgcd", {
  c: "5e", m: "maths", cle: "PGCD de deux entiers naturels", titre: "Le PGCD de deux entiers naturels", duree: 20,
  accroche: "Faire des lots identiques avec 24 cahiers et 36 stylos : le PGCD décide.",
  intro: "Une association veut répartir 24 cahiers et 36 stylos en lots identiques, sans rien laisser. Combien de lots, au maximum ? La réponse est le PGCD de 24 et 36.",
  objectifs: ["lister les diviseurs d'un nombre", "trouver les diviseurs communs", "déterminer le PGCD et l'utiliser"],
  parties: [
    { t: "Diviseurs communs", html: "<p>Diviseurs de 24 : 1, 2, 3, 4, 6, 8, 12, 24.<br>Diviseurs de 36 : 1, 2, 3, 4, 6, 9, 12, 18, 36.</p><p>Diviseurs <strong>communs</strong> : 1, 2, 3, 4, 6, 12.</p>", retenir: "On cherche les diviseurs par paires : 24 = 1×24 = 2×12 = 3×8 = 4×6." },
    { t: "Le PGCD", html: "<div class='def'><b>Définition</b>Le PGCD de deux entiers est leur <strong>Plus Grand Commun Diviseur</strong>.</div><p class='formule'>PGCD(24 ; 36) = 12</p><p>Retour au problème : on peut faire <strong>12 lots</strong>, chacun de 2 cahiers et 3 stylos.</p>", retenir: "PGCD = le plus grand des diviseurs communs." },
    { t: "Deux nombres premiers entre eux", html: "<p>Si PGCD(a ; b) = 1, on dit que a et b sont <strong>premiers entre eux</strong> : 8 et 15, par exemple.</p><div class='astuce'><b>Astuce</b>Pour simplifier une fraction au maximum, on divise numérateur et dénominateur par leur PGCD : 24/36 = 2/3.</div>", retenir: "PGCD = 1 : premiers entre eux, fraction irréductible." }
  ],
  revision: ["Lister les diviseurs par paires.", "Diviseurs communs = présents dans les deux listes.", "PGCD = le plus grand d'entre eux.", "PGCD = 1 : premiers entre eux.", "Fraction irréductible : diviser par le PGCD."],
  exo: "<p>Un fleuriste a 48 roses et 60 tulipes. Combien de bouquets identiques au maximum ? Composition de chacun ? <em>(PGCD = 12 : 12 bouquets de 4 roses et 5 tulipes.)</em></p>",
  quiz: [
    { q: "PGCD(18 ; 24) = ?", r: ["3", "6", "72"], b: 1, e: "Diviseurs communs : 1, 2, 3, 6." },
    { q: "8 et 15 sont…", r: ["premiers entre eux", "multiples", "égaux"], b: 0, e: "PGCD(8 ; 15) = 1." },
    { q: "Simplifier 24/36 :", r: ["12/18", "2/3", "4/6"], b: 1, e: "On divise par le PGCD 12." }
  ]
});

VRT_L("4e-pct-aimants", {
  c: "4e", m: "pct", cle: "Les aimants et les pôles d", titre: "Les aimants et leurs pôles", duree: 15,
  accroche: "Une boussole qui tourne toute seule : c'est le magnétisme.",
  intro: "Un aimant attire les trombones, fait tourner l'aiguille d'une boussole et repousse parfois un autre aimant. Découvre ses deux pôles et leurs règles.",
  objectifs: ["nommer les pôles d'un aimant", "énoncer les règles d'attraction et de répulsion", "citer les matériaux attirés"],
  parties: [
    { t: "Deux pôles", html: "<p>Tout aimant possède deux <strong>pôles</strong>, appelés <strong>pôle Nord</strong> et <strong>pôle Sud</strong>. C'est près des pôles que l'action de l'aimant est la plus forte. Si on casse un aimant, chaque morceau a à nouveau un pôle Nord et un pôle Sud.</p>", retenir: "Un aimant a toujours deux pôles, même cassé." },
    { t: "Attraction et répulsion", html: "<ul><li>Deux pôles de <strong>même nom</strong> se <strong>repoussent</strong> (Nord-Nord, Sud-Sud).</li><li>Deux pôles de <strong>noms différents</strong> s'<strong>attirent</strong> (Nord-Sud).</li></ul><p>L'aiguille d'une boussole est un petit aimant : elle s'oriente selon le champ magnétique autour d'un aimant, ou celui de la Terre.</p>", retenir: "Contraires s'attirent, semblables se repoussent." },
    { t: "Ce que l'aimant attire", html: "<p>Un aimant attire le <strong>fer</strong>, l'<strong>acier</strong>, le <strong>nickel</strong> et le <strong>cobalt</strong>. Il n'attire ni le cuivre, ni l'aluminium, ni le bois, ni le plastique.</p><div class='savais'><b>Le savais-tu ?</b>On utilise des électroaimants pour trier la ferraille et dans les haut-parleurs de ton téléphone.</div>", retenir: "Fer, acier, nickel, cobalt : attirés." }
  ],
  revision: ["Deux pôles : Nord et Sud.", "Même nom : répulsion ; noms différents : attraction.", "Boussole = petit aimant mobile.", "Attirés : fer, acier, nickel, cobalt."],
  exo: "<p>Comment reconnaître le pôle Nord d'un aimant dont les marques sont effacées, à l'aide d'une boussole ? Explique.</p>",
  quiz: [
    { q: "Deux pôles Sud face à face…", r: ["s'attirent", "se repoussent", "ne font rien"], b: 1, e: "Même nom : répulsion." },
    { q: "Lequel est attiré par un aimant ?", r: ["Une canette en aluminium", "Un clou en fer", "Une pièce en cuivre"], b: 1, e: "Le fer est attiré." },
    { q: "On casse un aimant en deux. Chaque morceau a…", r: ["un seul pôle", "deux pôles", "aucun pôle"], b: 1, e: "On obtient deux aimants complets." }
  ]
});

VRT_L("4e-svt-photosynthese", {
  c: "4e", m: "svt", cle: "La production de la matière végétale", titre: "La production de la matière végétale", duree: 20,
  accroche: "La plante fabrique sa nourriture avec de la lumière, de l'air et de l'eau.",
  intro: "Un manguier grandit chaque année de plusieurs kilogrammes. D'où vient cette matière ? Pas du sol seulement : surtout de l'air, grâce à la lumière.",
  objectifs: ["nommer les besoins d'un végétal chlorophyllien", "décrire la photosynthèse", "interpréter une expérience"],
  parties: [
    { t: "Ce dont la plante a besoin", html: "<p>Un végétal chlorophyllien prélève :</p><ul><li>de l'<strong>eau</strong> et des <strong>sels minéraux</strong> dans le sol, par ses racines ;</li><li>du <strong>dioxyde de carbone</strong> dans l'air, par ses feuilles ;</li><li>de l'<strong>énergie lumineuse</strong>, captée par la <strong>chlorophylle</strong> (pigment vert).</li></ul>", retenir: "Eau + sels minéraux + CO₂ + lumière." },
    { t: "La photosynthèse", html: "<div class='def'><b>Définition</b>La photosynthèse est la fabrication de matière organique (sucres, amidon) par les parties vertes de la plante, à partir d'eau et de dioxyde de carbone, grâce à la lumière. Elle rejette du dioxygène.</div><p class='formule'>eau + dioxyde de carbone → (lumière, chlorophylle) → matière organique + dioxygène</p>", retenir: "La photosynthèse produit de la matière et rejette du dioxygène." },
    { t: "L'expérience de l'élodée", html: "<p>Une plante aquatique, l'élodée, est placée sous une lampe. Des bulles de <strong>dioxygène</strong> se dégagent. Plus la lumière est forte, plus les bulles sont nombreuses ; dans l'obscurité, elles cessent.</p><div class='astuce'><b>Astuce</b>Pour prouver la fabrication d'amidon, on dépose de l'eau iodée sur une feuille décolorée : elle devient bleu-noir là où la feuille était éclairée.</div>", retenir: "Pas de lumière, pas de photosynthèse." }
  ],
  revision: ["Besoins : eau, sels minéraux, CO₂, lumière.", "Chlorophylle : capte la lumière.", "Photosynthèse : matière organique + dioxygène.", "Élodée : plus de lumière, plus de bulles.", "Eau iodée : bleu-noir en présence d'amidon."],
  exo: "<p>Explique pourquoi un plant de maïs placé dans un placard pendant une semaine jaunit et ne grandit plus.</p>",
  quiz: [
    { q: "Quel gaz la plante rejette-t-elle à la lumière ?", r: ["Dioxyde de carbone", "Dioxygène", "Azote"], b: 1, e: "Ce sont les bulles de l'élodée." },
    { q: "Quel pigment capte la lumière ?", r: ["L'hémoglobine", "La chlorophylle", "La mélanine"], b: 1, e: "Il donne la couleur verte." },
    { q: "Dans l'obscurité, les bulles de l'élodée…", r: ["augmentent", "cessent", "changent de couleur"], b: 1, e: "Sans lumière, pas de photosynthèse." }
  ]
});

VRT_L("tle-maths-binaire", {
  c: "Tle C", m: "maths", cle: "Numération binaire et numération décimale", titre: "Numération binaire et numération décimale", duree: 20,
  accroche: "Ton téléphone ne compte qu'avec 0 et 1. Apprends sa langue.",
  intro: "Tous les ordinateurs représentent les nombres avec deux chiffres seulement : 0 et 1. C'est la numération binaire, ou en base 2.",
  objectifs: ["écrire un entier en base 2", "convertir de la base 2 vers la base 10", "comprendre l'unicité de l'écriture"],
  parties: [
    { t: "Le principe", html: "<p>En base 10, chaque rang vaut 10 fois le précédent : unités, dizaines, centaines… En base 2, chaque rang vaut <strong>2 fois</strong> le précédent : 1, 2, 4, 8, 16, 32…</p><p class='formule'>1101₂ = 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13</p>", retenir: "En base 2, les rangs sont les puissances de 2." },
    { t: "De la base 10 à la base 2", html: "<p>On divise successivement par 2 et on lit les restes <strong>de bas en haut</strong> :</p><div class='ex'><b>Exemple : 45</b>45 = 2×22 + <b>1</b> ; 22 = 2×11 + <b>0</b> ; 11 = 2×5 + <b>1</b> ; 5 = 2×2 + <b>1</b> ; 2 = 2×1 + <b>0</b> ; 1 = 2×0 + <b>1</b>. Donc 45 = 101101₂.</div>", retenir: "Divisions successives par 2, restes lus de bas en haut." },
    { t: "Pourquoi l'écriture est unique", html: "<p>Tout entier naturel non nul s'écrit de façon <strong>unique</strong> sous la forme Σ aᵢ 2ⁱ avec aᵢ ∈ {0 ; 1} et le premier chiffre égal à 1. Cela découle de l'unicité du quotient et du reste dans la division euclidienne par 2.</p><div class='savais'><b>Le savais-tu ?</b>Un octet (8 chiffres binaires) code les entiers de 0 à 255, car 11111111₂ = 2⁸ − 1.</div>", retenir: "Écriture binaire unique, conséquence de la division euclidienne." }
  ],
  revision: ["Base 2 : chiffres 0 et 1, rangs = puissances de 2.", "Base 2 → base 10 : somme des puissances de 2 où le chiffre vaut 1.", "Base 10 → base 2 : divisions par 2, restes de bas en haut.", "Unicité : division euclidienne.", "Un octet : 0 à 255."],
  exo: "<p>Convertis 100 en base 2, puis 1011011₂ en base 10. <em>(1100100₂ ; 91)</em></p>",
  quiz: [
    { q: "1010₂ vaut…", r: ["10", "5", "12"], b: 0, e: "8 + 2 = 10." },
    { q: "13 en base 2 :", r: ["1101", "1011", "1110"], b: 0, e: "8 + 4 + 1." },
    { q: "Le plus grand entier sur 8 bits :", r: ["256", "255", "128"], b: 1, e: "2⁸ − 1." }
  ],
  examen: { t: "Annales du BAC C : arithmétique", href: "/corriges/" }
});

VRT_L("tle-svt-osmose", {
  c: "Tle D", m: "svt", cle: "Échanges d’eau", titre: "Les échanges d'eau entre la cellule et son milieu", duree: 20,
  accroche: "Un globule rouge qui gonfle ou se ratatine : c'est l'osmose.",
  intro: "Plongés dans l'eau pure, les globules rouges éclatent ; dans de l'eau très salée, ils se ratatinent. Pourquoi ? Parce que l'eau traverse la membrane selon les concentrations.",
  objectifs: ["définir l'osmose", "prévoir le comportement d'une cellule selon le milieu", "décrire turgescence et plasmolyse"],
  parties: [
    { t: "L'osmose", html: "<div class='def'><b>Définition</b>L'osmose est le passage de l'eau à travers une membrane semi-perméable, du milieu le <strong>moins concentré</strong> en substances dissoutes vers le milieu le <strong>plus concentré</strong>.</div><ul><li>Milieu <strong>hypotonique</strong> : moins concentré que la cellule → l'eau entre.</li><li>Milieu <strong>isotonique</strong> : même concentration → pas de mouvement net.</li><li>Milieu <strong>hypertonique</strong> : plus concentré → l'eau sort.</li></ul>", retenir: "L'eau va vers le milieu le plus concentré." },
    { t: "La cellule animale", html: "<p>Le globule rouge est en équilibre dans une solution de chlorure de sodium à environ <strong>9 g/L</strong> (isotonique au plasma). En milieu hypotonique, il gonfle puis éclate : c'est l'<strong>hémolyse</strong>. En milieu hypertonique, il perd de l'eau et se <strong>ratatine</strong>.</p>", retenir: "9 g/L de NaCl : le globule rouge reste intact." },
    { t: "La cellule végétale", html: "<p>La paroi empêche la cellule végétale d'éclater. En milieu hypotonique, la vacuole se remplit : la cellule est <strong>turgescente</strong>. En milieu hypertonique, la vacuole se vide et la membrane se décolle de la paroi : c'est la <strong>plasmolyse</strong>.</p><div class='savais'><b>Le savais-tu ?</b>Une salade arrosée redevient croquante grâce à la turgescence de ses cellules.</div>", retenir: "Turgescence en milieu hypotonique, plasmolyse en milieu hypertonique." }
  ],
  revision: ["Osmose : l'eau va du moins concentré au plus concentré.", "Hypo / iso / hypertonique.", "Globule rouge : hémolyse (hypo), ratatinement (hyper), intact à 9 g/L.", "Cellule végétale : turgescence (hypo), plasmolyse (hyper)."],
  exo: "<p>On place des cellules d'épiderme d'oignon rouge dans une solution de saccharose concentrée. Décris et explique ce qu'on observe au microscope.</p>",
  quiz: [
    { q: "Dans de l'eau pure, un globule rouge…", r: ["se ratatine", "éclate", "ne change pas"], b: 1, e: "Milieu hypotonique : l'eau entre, hémolyse." },
    { q: "La plasmolyse s'observe en milieu…", r: ["hypotonique", "isotonique", "hypertonique"], b: 2, e: "La vacuole perd son eau." },
    { q: "L'eau se déplace vers le milieu…", r: ["le moins concentré", "le plus concentré", "le plus chaud"], b: 1, e: "C'est la définition de l'osmose." }
  ]
});
