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

  /* ─────────────── 2nde C Physique (formules déjà complètes) ─────────────── */
})();
