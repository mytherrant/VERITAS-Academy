/* ENRICHISSEMENT des leçons de sciences (18/11/2026), consignes de Jacques :
   « Résoudre la situation-problème de départ en donnant des formules avec les étapes de la leçon ; illustrer par des
     exemples ; formules, détails précis, astuces pour mieux retenir ; planches 2D et 3D. »
   Ce fichier passe APRÈS les sources des leçons (ordre alphabétique) et AVANT les animations (90-…) :
   - formules : denouement.formules = [{ nom, f, calcul }] (affichées par lecon.html, « étape par étape ») ;
   - ajouts   : HTML ajouté à la fin d'une partie (définitions, formules, exemples, astuces) ;
   - planches : planches ajoutées à une partie (l'ordre des parties ne change pas : les VRT_A restent valides).
   Contrôle : node tools/audit_lecons.cjs */
(function () {
  "use strict";
  function enrichir(id, o) {
    var L = window.VRT_LECONS[id];
    if (!L) return;
    if (o.formules && L.denouement) L.denouement.formules = o.formules;
    Object.keys(o.ajouts || {}).forEach(function (k) { var p = L.parties[+k]; if (p) p.html = (p.html || "") + o.ajouts[k]; });
    Object.keys(o.planches || {}).forEach(function (k) { var p = L.parties[+k]; if (p) p.planches = (p.planches || []).concat(o.planches[k]); });
  }
  function F(nom, f, calcul) { return { nom: nom, f: f, calcul: calcul }; }
  function ex(t, h) { return "<div class='ex'><b>" + t + "</b>" + h + "</div>"; }
  function astuce(h) { return "<div class='astuce'><b>Astuce pour retenir</b>" + h + "</div>"; }
  function attention(h) { return "<div class='attention'><b>Attention</b>" + h + "</div>"; }
  function def(t, h) { return "<div class='def'><b>" + t + "</b>" + h + "</div>"; }
  function formule(h) { return "<p class='formule'>" + h + "</p>"; }
  var NUIT = "#001136", BLEU = "#1E499B", GRIS = "#4D5163", VERT = "#17784D", ORANGE = "#C2540A", ROUGE = "#C62828";
  function txt(x, y, t, o) { o = o || {}; return "<text x='" + x + "' y='" + y + "' text-anchor='" + (o.a || "middle") + "' font-size='" + (o.s || 12) + "' font-weight='" + (o.w || 700) + "' fill='" + (o.c || NUIT) + "'>" + t + "</text>"; }
  function svg(w, h, alt, corps) { return "<svg viewBox='0 0 " + w + " " + h + "' role='img' aria-label='" + alt + "' font-family='Inter,Arial,sans-serif'><rect width='" + w + "' height='" + h + "' fill='#fff'/>" + corps + "<text x='" + (w - 6) + "' y='" + (h - 5) + "' font-size='8' text-anchor='end' fill='#8A93A6'>Planche VÉRITAS</text></svg>"; }
  function pl2(titre, legende, w, h, alt, corps) { return { type: "2D", titre: titre, legende: legende, svg: svg(w, h, alt, corps) }; }

  /* ─────────────── 6e Mathématiques ─────────────── */
  enrichir("6e-maths-divisibilite", {
    formules: [
      F("Tester la divisibilité par 2, 5 et 10 (dernier chiffre)", "n divisible par 2 ⇔ chiffre des unités pair ; par 5 ⇔ unités 0 ou 5 ; par 10 ⇔ unités 0", "1 260 se termine par 0 : divisible par 2, par 5 et par 10"),
      F("Tester la divisibilité par 3 et 9 (somme des chiffres)", "n divisible par 3 (ou 9) ⇔ la somme de ses chiffres est divisible par 3 (ou 9)", "1 + 2 + 6 + 0 = 9 : divisible par 3 et par 9"),
      F("Calculer le nombre de sachets", "nombre de sachets = nombre de beignets ÷ beignets par sachet", "1 260 ÷ 2 = 630 ; ÷ 3 = 420 ; ÷ 5 = 252 ; ÷ 9 = 140 ; ÷ 10 = 126"),
      F("Comparer les recettes", "recette = nombre de sachets × prix d'un sachet", "140 × 450 F = 63 000 F et 126 × 500 F = 63 000 F")
    ],
    ajouts: {
      0: def("Définition", "a est <strong>divisible</strong> par b (b ≠ 0) lorsque le reste de la division de a par b est <strong>nul</strong> : a = b × q. On dit aussi que b est un <strong>diviseur</strong> de a et que a est un <strong>multiple</strong> de b."),
      1: formule("Par 2 : unités 0, 2, 4, 6, 8 · par 5 : unités 0 ou 5 · par 10 : unités 0 · par 100 : se termine par 00 · par 1 000 : par 000") +
        formule("Par 3 : somme des chiffres divisible par 3 · par 9 : somme des chiffres divisible par 9") +
        ex("Exemple", "4 725 : unités 5 → divisible par 5, pas par 2 ni 10 ; 4 + 7 + 2 + 5 = 18 → divisible par 3 et par 9.") +
        astuce("« <strong>Les petits regardent la queue, les grands font la somme</strong> » : 2, 5, 10 regardent le dernier chiffre ; 3 et 9 additionnent tous les chiffres. Si la somme est encore grande, recommence : 9 999 → 36 → 9.")
    }
  });

  enrichir("6e-maths-fractions", {
    formules: [
      F("Calculer une fraction d'une quantité", "a/b de Q = Q ÷ b × a", "3/4 de 12 L = 12 ÷ 4 × 3 = 9 L ; 6/8 de 12 L = 12 ÷ 8 × 6 = 9 L"),
      F("Fabriquer une fraction égale", "a/b = (a × k)/(b × k)", "3/4 = (3 × 2)/(4 × 2) = 6/8"),
      F("Vérifier l'égalité par les produits en croix", "a/b = c/d ⇔ a × d = b × c", "3 × 8 = 24 et 4 × 6 = 24 : 3/4 = 6/8"),
      F("Conclure", "même valeur ⇒ même quantité versée", "Aïcha et Paul versent chacun 9 L : 18 L dans la marmite")
    ],
    ajouts: {
      1: astuce("Pour savoir si deux fractions sont égales, fais le <strong>produit en croix</strong> : 3/4 et 6/8 → 3 × 8 = 24 et 4 × 6 = 24, c'est égal. Pour 2/3 et 3/4 : 8 ≠ 9, elles sont différentes.") +
        ex("Exemple", "Comparer 5/6 et 7/9 : dénominateur commun 18 → 15/18 et 14/18, donc 5/6 > 7/9.")
    }
  });

  enrichir("6e-maths-angles", {
    formules: [
      F("Angle entre deux chiffres voisins du cadran", "360° ÷ 12 = 30°", "le tour complet (360°) est partagé en 12 heures"),
      F("Angle des aiguilles à h heures pile", "angle = h × 30° (si plus de 180°, on prend 360° − angle)", "1 h → 30° ; 3 h → 90° ; 4 h → 120° ; 6 h → 180°"),
      F("Classer l'angle", "aigu < 90° = droit < obtus < 180° = plat", "30° aigu ; 90° droit ; 120° obtus ; 180° plat")
    ],
    ajouts: {
      0: def("Définition", "Deux angles sont <strong>adjacents</strong> s'ils ont le même sommet, un côté commun et sont de part et d'autre de ce côté. Deux angles sont <strong>complémentaires</strong> si leur somme vaut 90°, <strong>supplémentaires</strong> si elle vaut 180°."),
      1: formule("aigu : 0° &lt; a &lt; 90° · droit : a = 90° · obtus : 90° &lt; a &lt; 180° · plat : a = 180°") +
        ex("Exemple", "À 10 h, 10 × 30° = 300° : le petit angle vaut 360° − 300° = 60°, angle aigu.") +
        ex("Exemple", "Deux angles de 35° et 55° sont complémentaires : 35° + 55° = 90°.")
    }
  });

  enrichir("6e-maths-symetrie-axiale", {
    formules: [
      F("Mesurer la distance de chaque point à l'axe", "d(A ; axe) = longueur de la perpendiculaire [AH]", "le rond est à 50 cm de l'axe, le carré à 90 cm"),
      F("Placer le symétrique de l'autre côté", "A' sur (AH), de l'autre côté de l'axe, avec HA' = HA", "rond à 50 cm à droite, à 40 cm du haut ; carré à 90 cm à droite"),
      F("Vérifier par la conservation des longueurs", "A'B' = AB", "le carré symétrique garde 30 cm de côté")
    ],
    ajouts: {
      0: ex("Exemple sur quadrillage", "Axe vertical ; A est 4 carreaux à gauche de l'axe et 2 carreaux au-dessus du bas : A' est 4 carreaux à droite, toujours 2 carreaux au-dessus du bas.") +
        astuce("« <strong>Plier, piquer, déplier</strong> » : plie la feuille le long de l'axe, pique le point avec la pointe du compas, déplie : le trou de l'autre côté est le symétrique."),
      2: ex("Exemple dans la vie", "Les lettres A, M, T, U, V, W, Y ont un axe de symétrie vertical ; B, C, D, E, K un axe horizontal ; H, I, O, X en ont deux.") +
        attention("Le parallélogramme quelconque n'a <strong>aucun</strong> axe de symétrie, même s'il « paraît » régulier.")
    }
  });

  enrichir("6e-maths-proportionnalite", {
    formules: [
      F("Calculer le coefficient (prix d'un kilo)", "coefficient = prix ÷ quantité", "1 500 F ÷ 3 kg = 500 F/kg ; 2 500 ÷ 5 = 500 : même coefficient, proportionnel"),
      F("Tester les mangues", "prix ÷ quantité pour chaque colonne", "500 ÷ 3 ≈ 167 F ; 900 ÷ 6 = 150 F : coefficients différents, pas proportionnel"),
      F("Calculer la quatrième proportionnelle", "prix = quantité × coefficient", "7 kg × 500 F = 3 500 F"),
      F("Vérifier par les produits en croix", "3 × 3 500 = 7 × 1 500", "10 500 = 10 500 ✓")
    ],
    ajouts: {
      0: formule("y = k × x &nbsp;·&nbsp; k = y ÷ x (le même pour toutes les colonnes)"),
      1: formule("Produit en croix : si a/b = c/x alors x = b × c ÷ a") +
        astuce("« <strong>Un kilo d'abord</strong> » : quand tu hésites, cherche toujours le prix d'UNE unité (passage à l'unité), puis multiplie. Et vérifie : plus de kilos doit donner plus cher, jamais moins.") +
        attention("Proportionnel ne veut pas dire « augmente ensemble » : l'âge et la taille augmentent ensemble, mais ne sont pas proportionnels.")
    }
  });

  enrichir("6e-maths-cercle", {
    formules: [
      F("Calculer le rayon", "r = d ÷ 2", "r = 1,40 ÷ 2 = 0,70 m"),
      F("Calculer le périmètre (bordure en fer)", "P = π × d", "P = 3,14 × 1,40 = 4,396 ≈ 4,40 m"),
      F("Calculer l'aire (couvercle en tôle)", "A = π × r × r", "A = 3,14 × 0,70 × 0,70 = 1,5386 ≈ 1,54 m²"),
      F("Calculer le coût total", "coût = P × prix du mètre + A × prix du m²", "4,40 × 1 500 + 1,54 × 6 000 = 6 600 + 9 240 = 15 840 F")
    ],
    ajouts: {
      2: astuce("« <strong>Le tour prend le diamètre, l'aire prend le rayon deux fois</strong> » : P = π × d ; A = π × r × r. Et l'unité te trahit : une longueur en m, une aire en m².")
    }
  });

  enrichir("6e-maths-pave-droit", {
    formules: [
      F("Calculer l'aire des trois faces différentes", "L × l ; L × h ; l × h", "20 × 12 = 240 cm² ; 20 × 8 = 160 cm² ; 12 × 8 = 96 cm²"),
      F("Calculer l'aire totale (carton)", "A = 2 × (L × l + L × h + l × h)", "2 × (240 + 160 + 96) = 2 × 496 = 992 cm²"),
      F("Calculer le volume de la boîte", "V = L × l × h", "20 × 12 × 8 = 1 920 cm³"),
      F("Calculer le nombre de savons", "volume de la boîte ÷ volume d'un savon (a × a × a)", "1 920 ÷ (4 × 4 × 4) = 1 920 ÷ 64 = 30 savons, soit 5 × 3 × 2")
    ],
    ajouts: {
      2: astuce("« <strong>Aire = papier, volume = remplissage</strong> » : pour emballer, on additionne des surfaces (cm²) ; pour remplir, on multiplie trois longueurs (cm³).")
    }
  });

  /* ─────────────── 5e / 4e Mathématiques ─────────────── */
  enrichir("5e-maths-pgcd", {
    formules: [
      F("Écrire la condition « tomber juste »", "le côté c de la dalle divise 360 et 240", "c est un diviseur commun de 360 et 240"),
      F("Calculer le PGCD par l'algorithme d'Euclide", "PGCD(a ; b) = PGCD(b ; r), avec a = b × q + r", "360 = 240 × 1 + 120 ; 240 = 120 × 2 + 0 → PGCD = 120"),
      F("Calculer le nombre de dalles", "(longueur ÷ c) × (largeur ÷ c)", "(360 ÷ 120) × (240 ÷ 120) = 3 × 2 = 6 dalles"),
      F("Calculer le coût de la pose", "nombre de dalles × prix de pose", "6 × 1 500 F = 9 000 F")
    ],
    ajouts: {
      1: ex("Exemple : algorithme d'Euclide", "PGCD(84 ; 36) : 84 = 36 × 2 + 12 ; 36 = 12 × 3 + 0. Le dernier reste non nul est <strong>12</strong>.") +
        ex("Exemple : partage équitable", "Avec 84 cahiers et 36 stylos, on fait au plus PGCD(84 ; 36) = 12 lots identiques de 7 cahiers et 3 stylos."),
      2: ex("Exemple : fraction irréductible", "84/36 = (84 ÷ 12)/(36 ÷ 12) = 7/3 : en divisant par le PGCD, on obtient directement la fraction irréductible.")
    }
  });

  enrichir("4e-maths-facteurs-premiers", {
    formules: [
      F("Décomposer par divisions successives", "diviser par 2, puis 3, puis 5… tant que c'est possible", "360 ÷ 2 = 180 ; ÷ 2 = 90 ; ÷ 2 = 45 ; ÷ 3 = 15 ; ÷ 3 = 5 ; ÷ 5 = 1"),
      F("Écrire la décomposition", "n = p₁^a × p₂^b × p₃^c", "360 = 2³ × 3² × 5"),
      F("Compter les diviseurs", "nombre de diviseurs = (a + 1) × (b + 1) × (c + 1)", "(3 + 1) × (2 + 1) × (1 + 1) = 4 × 3 × 2 = 24 dispositions"),
      F("Trouver la disposition la plus proche du carré", "le diviseur d le plus proche de √n, avec n ÷ d élèves par rangée", "√360 ≈ 19 : 18 rangées de 20 élèves")
    ]
  });


  /* ─────────────── Lot 2 : 5e-3e sciences ─────────────── */
  enrichir("5e-maths-division-euclidienne", {
    formules: [
      F("Poser l'égalité de la division euclidienne", "a = b × q + r, avec 0 ≤ r < b", "250 = 24 × q + r"),
      F("Trouver le quotient", "q = le plus grand entier tel que b × q ≤ a", "24 × 10 = 240 ≤ 250 et 24 × 11 = 264 > 250 : q = 10"),
      F("Calculer le reste", "r = a − b × q", "r = 250 − 240 = 10, et 10 < 24 ✓"),
      F("Calculer la recette", "q × prix d'une cagette + r × prix d'une mangue", "10 × 3 000 + 10 × 150 = 30 000 + 1 500 = 31 500 F")
    ],
    ajouts: { 1: astuce("« <strong>Le reste est toujours plus petit que le diviseur</strong> » : si ton reste dépasse le diviseur, ton quotient est trop petit d'au moins 1. Vérifie toujours : b × q + r doit redonner a.") }
  });

  enrichir("4e-pct-aimants", {
    formules: [
      F("Identifier le pôle Nord de l'aimant", "aimant suspendu librement : le pôle Nord se tourne vers le nord géographique", "l'extrémité qui pointe vers le nord est le pôle N"),
      F("Confirmer avec la boussole", "pôles de même nom ⇒ répulsion ; pôles de noms contraires ⇒ attraction", "le bout coloré (N) de l'aiguille est repoussé : l'extrémité testée est bien N"),
      F("Choisir où pêcher", "le champ magnétique est le plus intense près des pôles", "on plonge une extrémité de l'aimant, pas son milieu"),
      F("Prévoir ce qui est attiré", "attirés : fer, acier, nickel, cobalt · non attirés : cuivre, laiton, aluminium, or", "anneau en acier attiré, clé en laiton non : la clé remonte par son anneau")
    ],
    ajouts: {
      1: ex("Exemple", "On approche le pôle N d'un aimant du pôle S d'un autre aimant posé sur des crayons : il roule vers lui (attraction). On le retourne : il s'éloigne (répulsion).") +
        ex("Exemple", "Une aiguille à coudre frottée 20 fois dans le même sens sur un aimant devient à son tour un petit aimant : posée sur un bouchon dans l'eau, elle s'oriente nord-sud.") +
        astuce("« <strong>Les contraires s'attirent, les pareils se repoussent</strong> » : N-S s'attirent, N-N et S-S se repoussent."),
      3: ex("Exemple au quotidien", "La porte du réfrigérateur, les haut-parleurs du téléphone et les cartes bancaires utilisent des aimants ; c'est pourquoi on n'approche pas un aimant d'une carte à piste magnétique.")
    }
  });

  enrichir("4e-svt-photosynthese", {
    formules: [
      F("Faire le bilan de masse", "gain du plant = masse finale − masse initiale ; perte de la terre = masse initiale − masse finale", "le plant gagne 450 g ; la terre ne perd que 4 g (sels minéraux)"),
      F("Séparer l'eau de la matière sèche", "masse fraîche = eau + matière sèche", "450 g = environ 360 g d'eau + 90 g de matière sèche"),
      F("Trouver l'origine du carbone", "matière sèche ≈ 45 % de carbone, venu du CO₂ de l'air", "≈ 0,45 × 90 ≈ 40 g de carbone pris dans l'air"),
      F("Écrire le bilan de la photosynthèse", "eau + dioxyde de carbone → (lumière, chlorophylle) → matière organique + dioxygène", "6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂")
    ],
    ajouts: {
      4: ex("Exemple", "Une plante aquatique (élodée) éclairée dans l'eau dégage des bulles de dioxygène ; à l'obscurité, plus de bulles.") +
        ex("Exemple", "Une feuille de manioc cachée deux jours par un papier aluminium puis testée à l'eau iodée ne bleuit pas là où elle était cachée : sans lumière, pas d'amidon.")
    }
  });

  enrichir("3e-pct-ph", {
    formules: [
      F("Calculer la quantité de matière", "n = m ÷ M", "n = 40 g ÷ 40 g/mol = 1 mol de NaOH"),
      F("Calculer la concentration molaire", "C = n ÷ V", "C = 1 mol ÷ 0,5 L = 2 mol/L"),
      F("Classer la solution par son pH", "pH < 7 acide · pH = 7 neutre · pH > 7 basique", "pH > 13 : très basique, corrosive"),
      F("Calculer la dilution", "C₁ × V₁ = C₂ × V₂", "2 × 50 mL = C₂ × 500 mL → C₂ = 0,2 mol/L (dix fois moins concentrée)")
    ],
    ajouts: {
      0: ex("Exemple", "15 g de sel (NaCl, M = 58,5 g/mol) dans 250 mL : n = 15 ÷ 58,5 ≈ 0,26 mol ; C = 0,26 ÷ 0,25 ≈ 1,0 mol/L."),
      2: ex("Exemple : facteur de dilution", "Pour diviser la concentration par 10, on prélève 10 mL de solution et on complète à 100 mL avec de l'eau : V₂ = 10 × V₁.") +
        astuce("« <strong>Toujours l'acide (ou la soude) dans l'eau, jamais l'eau dedans</strong> » : on verse le produit concentré lentement dans beaucoup d'eau, pour éviter les projections brûlantes.")
    }
  });

  enrichir("3e-svt-adn", {
    formules: [
      F("Compter les chromosomes reçus", "cellule-œuf = 23 chromosomes du père + 23 de la mère", "23 + 23 = 46 chromosomes, soit 23 paires"),
      F("Écrire les gamètes possibles", "mère XX → ovules tous X ; père XY → spermatozoïdes X ou Y", "ovule X ; spermatozoïde X (50 %) ou Y (50 %)"),
      F("Faire le tableau de croisement", "gamète du père × gamète de la mère", "X × X = XX (fille) ; Y × X = XY (garçon)"),
      F("Calculer la probabilité", "probabilité = cas favorables ÷ cas possibles", "fille : 1 ÷ 2 = 50 % à chaque naissance, quel que soit le rang")
    ],
    ajouts: {
      2: ex("Exemple", "Une famille a déjà trois filles. La probabilité que le 4ᵉ enfant soit un garçon reste 1 sur 2 : chaque fécondation est indépendante.") +
        ex("Exemple : caryotype", "Un caryotype montre 22 paires semblables (autosomes) et une 23ᵉ paire XX : c'est une fille ; XY : un garçon. 47 chromosomes avec trois chromosomes 21 : trisomie 21.")
    }
  });

  enrichir("3e-maths-racines", {
    formules: [
      F("Calculer l'aire nécessaire", "aire = nombre de poules ÷ densité", "200 ÷ 4 = 50 m²"),
      F("Calculer le côté du carré", "c = √A", "c = √50 = √(25 × 2) = 5√2 ≈ 7,07 m"),
      F("Encadrer pour vérifier", "a² < A < b² ⇒ a < √A < b", "49 < 50 < 64 donc 7 < √50 < 8"),
      F("Calculer le grillage", "P = 4 × c", "4 × 7,07 ≈ 28,3 m : acheter 29 m"),
      F("Calculer la diagonale", "d = c × √2", "5√2 × √2 = 5 × 2 = 10 m de fil")
    ],
    planches: {
      1: [pl2("Le carré de 50 m² et sa diagonale", "Un carré d'aire 50 m² a un côté de √50 ≈ 7,07 m ; sa diagonale mesure exactement 10 m.", 640, 260, "Carré de côté racine de 50 avec sa diagonale de 10 mètres, encadré entre les carrés de 7 et 8 mètres",
        "<rect x='70' y='30' width='196' height='196' fill='#EEF4FC' stroke='" + BLEU + "' stroke-width='3'/><rect x='70' y='30' width='224' height='224' fill='none' stroke='#9AA4B6' stroke-dasharray='6 4'/><rect x='70' y='30' width='186' height='186' fill='none' stroke='#C9D0DC' stroke-dasharray='3 4'/>" +
        "<path d='M70 226L266 30' stroke='" + ROUGE + "' stroke-width='3'/>" + txt(168, 140, "50 m²", { s: 18, c: BLEU }) + txt(150, 106, "d = 10 m", { s: 13, c: ROUGE }) + txt(168, 248, "c = √50 ≈ 7,07 m", { s: 13 }) +
        "<rect x='330' y='40' width='280' height='180' rx='14' fill='#FFF6E3' stroke='#F2DFA6'/>" + txt(470, 76, "7² = 49 < 50 < 64 = 8²", { s: 15, c: '#8A6200' }) + txt(470, 108, "donc 7 < √50 < 8", { s: 15 }) + txt(470, 146, "√50 = √25 × √2 = 5√2", { s: 15, c: BLEU }) + txt(470, 184, "d = 5√2 × √2 = 10 m", { s: 15, c: ROUGE }))]
    },
    ajouts: { 2: attention("√(a + b) ≠ √a + √b : √(9 + 16) = √25 = 5, alors que √9 + √16 = 3 + 4 = 7.") + astuce("« <strong>On sort les carrés parfaits</strong> » : √50 = √(25 × 2) = 5√2 ; √72 = √(36 × 2) = 6√2. Connais par cœur les carrés de 1 à 15.") }
  });

  enrichir("3e-pct-atome", {
    formules: [
      F("Compter les atomes sur une longueur", "nombre d'atomes = longueur ÷ diamètre d'un atome", "1 mm ÷ 0,000 000 25 mm ≈ 4 millions d'atomes de cuivre"),
      F("Écrire la neutralité de l'atome", "nombre d'électrons = nombre de protons = Z", "cuivre : 29 protons et 29 électrons"),
      F("Identifier l'élément par Z", "Z = numéro atomique, propre à chaque élément", "Z = 29 : cuivre (Cu) ; Z = 79 : or (Au)"),
      F("Comparer les tailles", "taille de l'atome ≈ 100 000 × taille du noyau", "noyau d'1 mm ⇒ atome de 100 m, un stade")
    ],
    planches: {
      2: [pl2("Deux atomes, deux éléments", "Le cuivre (Z = 29) et l'or (Z = 79) ont la même architecture, mais pas le même nombre de protons : ce sont deux éléments différents.", 640, 240, "Schéma comparé d'un atome de cuivre et d'un atome d'or avec leur numéro atomique",
        (function () { var s = "", k; [[160, "Cu", 29, "#C77B30"], [480, "Au", 79, "#D4A017"]].forEach(function (a) { s += "<circle cx='" + a[0] + "' cy='110' r='86' fill='#F7F9FC' stroke='#C9D0DC' stroke-dasharray='4 4'/><circle cx='" + a[0] + "' cy='110' r='14' fill='" + a[3] + "'/>"; for (k = 0; k < 10; k++) { var t = k * Math.PI / 5; s += "<circle cx='" + (a[0] + 70 * Math.cos(t)).toFixed(1) + "' cy='" + (110 + 70 * Math.sin(t)).toFixed(1) + "' r='4' fill='" + BLEU + "'/>"; } s += txt(a[0], 115, a[1], { s: 13, c: "#fff" }) + txt(a[0], 220, a[1] + " : Z = " + a[2] + " protons, " + a[2] + " électrons", { s: 13 }); }); return s + txt(320, 112, "≠", { s: 30, c: ROUGE }); })())]
    },
    ajouts: {
      2: def("Définition", "Le <strong>numéro atomique Z</strong> est le nombre de protons du noyau. L'atome est <strong>électriquement neutre</strong> : il a autant d'électrons (charge −e) que de protons (charge +e).") +
        ex("Exemple", "L'atome d'oxygène (Z = 8) a 8 protons et 8 électrons ; l'atome de fer (Z = 26) a 26 protons et 26 électrons.") +
        astuce("« <strong>Z, c'est la carte d'identité</strong> » : change le nombre de protons, et tu changes d'élément ; change le nombre d'électrons, et tu obtiens un ion du même élément.")
    }
  });

  enrichir("3e-svt-ressemblances", {
    formules: [
      F("Tester l'appartenance à une espèce", "même espèce ⇔ interfécondité et descendance fertile", "humain × chimpanzé : pas de descendance → espèces différentes"),
      F("Classer les caractères", "caractère de l'espèce : tous l'ont · caractère individuel : varie d'une personne à l'autre", "bipédie, pouce opposable, langage : espèce ; lobe d'oreille, fossettes : individuel"),
      F("Séparer hérédité et milieu", "caractère observé = information génétique + influence du milieu", "jumelles : même information génétique ; sport et soleil changent leur peau et leurs muscles"),
      F("Retrouver l'origine des caractères héréditaires", "cellule-œuf = information du père + information de la mère", "les caractères viennent des deux familles")
    ],
    planches: {
      1: [pl2("Caractères de l'espèce et caractères individuels", "Tous les humains partagent les caractères de l'espèce ; les caractères individuels varient et partagent la classe en groupes.", 640, 230, "Deux colonnes : caractères de l'espèce humaine et caractères individuels",
        "<rect x='20' y='20' width='290' height='190' rx='14' fill='#EEF4FC' stroke='#C9D8EE'/><rect x='330' y='20' width='290' height='190' rx='14' fill='#ECF7F0' stroke='#BFDCC9'/>" + txt(165, 50, "Caractères de l'espèce", { s: 15, c: BLEU }) + txt(475, 50, "Caractères individuels", { s: 15, c: VERT }) +
        ["marcher debout (bipédie)", "pouce opposable", "langage articulé", "46 chromosomes"].map(function (t, k) { return txt(40, 86 + k * 30, "• " + t, { s: 13, a: "start", w: 500 }); }).join("") +
        ["lobe d'oreille libre ou attaché", "fossettes ou non", "groupe sanguin A, B, AB, O", "enrouler la langue ou non"].map(function (t, k) { return txt(350, 86 + k * 30, "• " + t, { s: 13, a: "start", w: 500 }); }).join(""))]
    },
    ajouts: {
      2: ex("Exemple", "Le groupe sanguin est héréditaire : il ne change pas avec l'alimentation. La couleur de la peau peut foncer au soleil (influence du milieu), mais la couleur de base est héréditaire.") +
        ex("Exemple", "Deux vrais jumeaux, l'un footballeur, l'autre non, ont le même groupe sanguin mais pas la même musculature.") +
        astuce("« <strong>Héritage + vie = ce que tu es</strong> » : pour chaque caractère, demande-toi s'il peut changer pendant la vie (milieu) ou s'il est fixé dès la cellule-œuf (hérédité).") +
        attention("Un caractère « de famille » n'est pas toujours héréditaire : une famille peut partager un accent ou des habitudes alimentaires sans gène commun.")
    }
  });

  /* ─────────────── 2nde C Physique (formules déjà complètes) ─────────────── */
})();
