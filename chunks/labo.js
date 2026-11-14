/* VÉRITAS — base des laboratoires virtuels (chargée à la demande).
   88 Ko qu'un visiteur venu lire un corrigé n'ouvrira jamais. Chargée par
   _lazyChunk('labo') depuis showLabosVirtuels() et les écrans qui en
   dépendent. Extraite d'app.js le 04/08/2026. */
window.LABO_DB=[
  // ─ PHYSIQUE ─
  {id:"lv1",titre:"Circuit Électrique Interactif",matiere:"Physique",cat:"physique",
   classe:"4ème-3ème-2nde C",ico:"⚡",color:"#0891B2",gratuit:true,
   desc:"Construis et teste des circuits en série et parallèle. Calcule tension, intensité, résistance et puissance.",
   theorie:"⚡ Loi d'Ohm : U = R × I (U=Volts, R=Ohms, I=Ampères).\n\n🔴 Série : I identique partout. U_total = U₁+U₂. R_eq = R₁+R₂.\n🔵 Parallèle : U identique partout. I_total = I₁+I₂. 1/R_eq = 1/R₁+1/R₂.\n\n⚙️ Puissance : P = U×I = R×I² = U²/R (Watts).\nÉnergie : E = P×t (Joules). 1 kWh = 3 600 000 J.\n\nLois de Kirchhoff : ΣU = 0 dans une maille ; ΣI = 0 dans un nœud.",
   experience:[
     "1️⃣ MATÉRIEL : pile plate (4,5V), 2 ampoules, fils, interrupteur, ampèremètre, voltmètre. Branche l'interrupteur et observe : circuit ouvert → ampoule éteinte ; circuit fermé → ampoule allumée.",
     "2️⃣ CIRCUIT EN SÉRIE : branche 2 ampoules l'une après l'autre. Observe : les deux s'allument avec la même intensité. Débranche l'une → l'autre s'éteint aussi. Conclusion : en série, I identique et la panne d'une coupe tout.",
     "3️⃣ CIRCUIT EN PARALLÈLE : branche 2 ampoules côte à côte (en dérivation). Observe : chacune a la même tension. Débranche l'une → l'autre reste allumée. Conclusion : en parallèle, les appareils fonctionnent indépendamment.",
     "4️⃣ AMPÈREMÈTRE (mesure I) : branche-le EN SÉRIE dans le circuit. Il doit être traversé par le courant. Si la valeur est négative, inverse les bornes + et −.",
     "5️⃣ VOLTMÈTRE (mesure U) : branche-le EN PARALLÈLE aux bornes de l'ampoule. Il ne doit pas modifier le circuit. Relève la tension et vérifie U = R×I.",
     "6️⃣ LOI D'OHM (vérification) : mesure U aux bornes d'une résistance connue (ex. 100Ω) et I dans le circuit. Calcule R=U/I. Compare avec la valeur inscrite sur la résistance.",
     "7️⃣ SCHÉMA ÉLECTRIQUE : dessine le schéma normalisé du circuit (symboles : pile = ⏃, résistance = ▭, ampoule = ⊗, interrupteur = / ). Utilise une règle et des symboles normalisés (norme française).",
   ],
   quiz:[
     {q:"Si U=12V et R=400Ω, quelle est l'intensité ?",opts:["0,02 A","0,03 A","0,06 A","0,12 A"],ans:1,exp:"I = U/R = 12/400 = 0,03 A. Loi d'Ohm : I = U/R."},
     {q:"R₁=100Ω et R₂=150Ω en série. Résistance équivalente :",opts:["50 Ω","75 Ω","250 Ω","15 000 Ω"],ans:2,exp:"Série : R_eq = R₁+R₂ = 100+150 = 250 Ω."},
     {q:"En parallèle, la tension aux bornes de chaque branche est :",opts:["Différente","La même","Nulle","Double"],ans:1,exp:"En parallèle, U est identique à chaque branche — c'est pourquoi les appareils domestiques sont montés en parallèle."},
     {q:"U=220V, R=1100Ω. Puissance dissipée :",opts:["0,2 W","44 W","200 W","2420 W"],ans:1,exp:"P = U²/R = 220²/1100 = 48400/1100 = 44 W."},
     {q:"R₁=R₂=200Ω en parallèle. R_eq = ?",opts:["400 Ω","200 Ω","100 Ω","50 Ω"],ans:2,exp:"1/R_eq = 1/200+1/200 = 2/200 → R_eq = 100 Ω. En parallèle, R_eq < plus petite résistance."},
     {q:"3 résistances identiques en série, générateur 9V. Tension aux bornes de chacune :",opts:["9V","6V","3V","1V"],ans:2,exp:"En série la tension se divise : U_chacune = 9/3 = 3V."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  {id:"lv2",titre:"Les Forces et le Mouvement",matiere:"Physique",cat:"physique",
   classe:"4ème-2nde C-1ère C/D-Tle C/D",ico:"🚀",color:"#1E3A8A",gratuit:true,
   desc:"Lois de Newton, poids, chute libre, énergie mécanique et forces de frottement.",
   theorie:"📌 1ère loi (inertie) : si les forces se compensent, l'objet est immobile ou en MRU.\n📌 2ème loi : ΣF = m×a (F en Newtons, m en kg, a en m/s²).\n📌 3ème loi : action = réaction (forces égales et opposées sur deux corps différents).\n\n⬇️ Chute libre (sans frottement) : h = ½gt² ; v = gt (g = 10 m/s² en 2nde).\n🔴 Poids : P = mg. ATTENTION : masse (kg) ≠ poids (Newton) !\n\n2nde : identifier les forces, calculer résultante, MRU/MRUV.\n1ère : énergie cinétique Ec = ½mv² ; énergie potentielle Ep = mgh ; conservation Ec+Ep = cste (sans frottement).\nConservation : Ec + Ep = constante (sans frottement).",
   experience:[
     "1️⃣ Bilan des forces sur un objet posé sur une table : Poids P = mg vers le bas ; Réaction N vers le haut. Résultante = 0 (immobile).",
     "2️⃣ Chariot 2kg tiré par F=8N, frottement f=4N : a = (8-4)/2 = 2 m/s². Vitesse après 5s : v = at = 10 m/s.",
     "3️⃣ Chute libre h=20m : t = √(2×20/10) = 2 s ; vitesse à l'impact = g×t = 20 m/s.",
     "4️⃣ Poids d'un élève de 60kg : P = 60×10 = 600 N. Sur la Lune (g=1,6) : P_lune = 96 N.",
     "5️⃣ Énergie (1ère) : balle 0,5kg lâchée de h=5m. Ep = 0,5×10×5 = 25 J. Au sol : Ec = 25 J → v = √(2×25/0,5) = 10 m/s.",
     "6️⃣ 3ème loi : toi tu pousses le mur avec 50N → le mur te pousse avec 50N en sens inverse (réaction).",
     "7️⃣ Frottements : glissement d'un livre sur une table. Sans frottement, MRU. Avec, le livre ralentit (décélération).",
   ],
   quiz:[
     {q:"Un objet de 4kg soumis à F=20N. Son accélération :",opts:["0,2 m/s²","5 m/s²","80 m/s²","16 m/s²"],ans:1,exp:"a = F/m = 20/4 = 5 m/s². 2ème loi de Newton : ΣF = ma."},
     {q:"Poids d'un objet de 5kg (g=10) :",opts:["5 N","10 N","50 N","500 N"],ans:2,exp:"P = mg = 5×10 = 50 N. La masse est en kg, le poids en Newtons."},
     {q:"Chute libre h=45m (g=10). Durée :",opts:["2 s","3 s","4 s","9 s"],ans:1,exp:"h = ½gt² → t² = 2h/g = 90/10 = 9 → t = 3 s."},
     {q:"La 3ème loi de Newton (action-réaction) :",opts:["S'applique uniquement aux corps en mouvement","Les forces s'exercent sur le même corps","Deux corps exercent l'un sur l'autre des forces égales et opposées","N'est valable qu'en chute libre"],ans:2,exp:"Si A exerce F sur B, alors B exerce -F sur A. Forces égales, opposées, corps différents."},
     {q:"Objet en MRU (mouvement rectiligne uniforme). La résultante des forces est :",opts:["Maximale","Égale à ma","Nulle","Vers le bas"],ans:2,exp:"1ère loi : résultante nulle → immobile ou MRU. Pas de force nette = pas d'accélération."},
     {q:"Énergie cinétique d'un objet 2kg à 6 m/s :",opts:["12 J","24 J","36 J","72 J"],ans:2,exp:"Ec = ½mv² = ½×2×36 = 36 J."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:"Premium"},

  {id:"lv9",titre:"Optique & Propagation de la Lumière",matiere:"Physique",cat:"physique",
   classe:"2nde C-1ère C/D",ico:"🔭",color:"#0E7490",gratuit:true,
   desc:"Réflexion, réfraction, lentilles convergentes/divergentes, formation d'images et applications.",
   theorie:"🌟 Lumière : se propage en ligne droite à c = 3×10⁸ m/s dans le vide.\n\n🪞 Réflexion : angle incidence = angle réflexion (loi de Descartes).\n\n🔎 Réfraction : n₁×sin(i₁) = n₂×sin(i₂). Milieu plus dense → rayon se rapproche de la normale. n_eau≈1,33 ; n_verre≈1,5.\n\n🔬 Lentille convergente : f'>0. Vergence V=1/f' (dioptries).\nRelation conjugaison : 1/OA' - 1/OA = 1/f'.\nGrandissement : γ = OA'/OA.",
   experience:[
     "1️⃣ RÉFLEXION SUR MIROIR PLAN : pointe une lampe de poche vers un miroir dans une salle sombre. Mesure l'angle d'incidence (entre rayon et normale) et l'angle de réflexion. Vérifie : angle_i = angle_r. Dessine le schéma.",
     "2️⃣ RÉFRACTION — PAILLE DANS L'EAU : plonge une paille dans un verre d'eau. Observe : la paille paraît cassée à la surface. Le rayon change de direction en passant de l'air à l'eau (n_eau > n_air).",
     "3️⃣ DÉCOMPOSITION DE LA LUMIÈRE : dirige un rayon de lumière blanche (soleil ou lampe) sur un prisme ou un CD. Observe le spectre : rouge, orange, jaune, vert, bleu, indigo, violet. Chaque couleur est réfractée différemment.",
     "4️⃣ LENTILLE CONVERGENTE — CONSTRUCTION : trace 3 rayons pour un objet à OA=-30cm, f'=+10cm. Rayon parallèle → passe par F'. Rayon par le centre → ne dévie pas. Rayon par F → ressort parallèle. L'image est au croisement.",
     "5️⃣ LOUPE (lentille convergente) : place un objet ENTRE F et O (à moins de f'). Les rayons divergent après la lentille → pas d'image réelle. Regarde à travers : image virtuelle, droite, agrandie. C'est la loupe.",
     "6️⃣ MODÈLE DE L'ŒIL : le cristallin = lentille convergente convergente. Image réelle renversée sur la rétine. Myopie (œil trop long) → image se forme AVANT la rétine → correction par lentille divergente.",
     "7️⃣ VÉRIFICATION de la relation conjugaison : avec une lentille de f'=10cm connue, place un objet à OA=-20cm. Cherche la position de l'image en déplaçant un écran. Mesure OA'. Vérifie : 1/OA' - 1/OA = 1/f'.",
   ],
   quiz:[
     {q:"Vitesse de la lumière dans le vide :",opts:["3×10⁶ m/s","3×10⁸ m/s","3×10¹⁰ m/s","300 m/s"],ans:1,exp:"c = 3×10⁸ m/s ≈ 300 000 km/s."},
     {q:"Vergence = 5 dioptries → distance focale :",opts:["5 m","0,5 m","0,2 m","20 m"],ans:2,exp:"f' = 1/V = 1/5 = 0,2 m = 20 cm."},
     {q:"Lumière passant de l'air (n=1) vers l'eau (n=1,33) :",opts:["Accélère","Se rapproche de la normale","S'éloigne de la normale","Ne change pas"],ans:1,exp:"Milieu plus dense → n plus grand → rayon se rapproche de la normale."},
     {q:"Objet placé à 2f d'une lentille convergente. L'image est :",opts:["Virtuelle et droite","Réelle à f","Réelle à 2f, même taille","À l'infini"],ans:2,exp:"OA = -2f → OA' = +2f. γ = -1 : image réelle, renversée, même taille."},
     {q:"La décomposition de la lumière blanche par un prisme produit :",opts:["Lumière noire","Spectre de couleurs","Lumière plus intense","Uniquement rouge et bleu"],ans:1,exp:"Chaque couleur a une longueur d'onde et est réfractée différemment → spectre (arc-en-ciel)."},
     {q:"La réflexion totale interne est le principe de :",opts:["L'arc-en-ciel","La fibre optique","La loupe","Le miroir plan"],ans:1,exp:"Au-delà de l'angle limite, toute la lumière est réfléchie dans le milieu → guide d'ondes = fibre optique."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  {id:"lv10",titre:"Thermodynamique & Calorimétrie",matiere:"Physique",cat:"physique",
   classe:"1ère C/D",ico:"🌡️",color:"#AE5353",gratuit:false,plan:"Sciences",
   desc:"Transferts de chaleur, capacité calorifique, changements d'état et lois des gaz parfaits.",
   theorie:"🌡️ Q = m×c×ΔT (Q en J, m en kg, c = capacité thermique massique).\nc_eau = 4180 J/kg·K ; c_fer = 450 J/kg·K.\n\n🧊 Changement d'état : Q = m×L (L = chaleur latente). L_fusion_glace = 334 kJ/kg.\n\n⚖️ Mélange : Q_cédée + Q_reçue = 0 (système isolé).\n\n⚗️ Gaz parfaits : PV = nRT (R = 8,314 J/mol·K ; T en Kelvin = °C + 273).\nBoyle-Mariotte : PV = cste (T fixe). Charles : P/T = cste (V fixe). Gay-Lussac : V/T = cste (P fixe).",
   experience:[],
   quiz:[], verrou:true, nExp:7, nQuiz:5,
   ressource:"https://minesec-distancelearning.cm",pack:"Sciences"},

  // ─ CHIMIE ─
  {id:"lv3",titre:"Réactions Acide-Base",matiere:"Physique-Chimie",cat:"chimie",
   classe:"3ème-2nde C-Tle C/D",ico:"⚗️",color:"#6C56A6",gratuit:true,
   desc:"pH, indicateurs colorés, neutralisations, dosage acido-basique et calculs de concentration.",
   theorie:"⚗️ Acide : libère H⁺ (H₃O⁺). Base : libère OH⁻.\npH < 7 = acide ; pH = 7 = neutre ; pH > 7 = basique.\n\n⚖️ Neutralisation : Acide + Base → Sel + Eau. Ex: HCl + NaOH → NaCl + H₂O.\n\nIndicateurs : phénolphtaléine (incolore/acide → rose/basique) ; BBT (jaune/acide, vert/neutre, bleu/basique).\n\n📈 Titrage : à l'équivalence Ca×Va = Cb×Vb (monoprotique).",
   experience:[
     "1️⃣ MATÉRIEL : béchers, pipette, burette, pH-mètre (ou papier pH), indicateurs colorés (BBT, phénolphtaléine). Prépare ta paillasse.",
     "2️⃣ TEST DES INDICATEURS : verse quelques gouttes de BBT dans 3 tubes : solution acide (vinaigre), eau distillée, solution basique (eau savonneuse). Observe les couleurs : jaune / vert / bleu.",
     "3️⃣ MESURE DU pH : plonge le papier pH dans : jus de citron, eau minérale, solution de lessive. Compare les couleurs au nuancier. Note les valeurs. pH < 7 = acide, = 7 = neutre, > 7 = basique.",
     "4️⃣ TITRAGE — PRÉPARATION : verse 10 mL d'acide chlorhydrique (HCl) dans un bécher. Ajoute 3 gouttes de phénolphtaléine → solution incolore (milieu acide).",
     "5️⃣ TITRAGE — AJOUT DE BASE : remplis la burette de NaOH. Verse goutte à goutte dans le bécher. Agite après chaque ajout. La solution reste incolore tant que l'acide est en excès.",
     "6️⃣ POINT D'ÉQUIVALENCE : au bout d'un certain volume de NaOH, la solution devient rose persistant : c'est le point d'équivalence. Lis le volume versé sur la burette. Calcule la concentration : Ca×Va = Cb×Vb.",
     "7️⃣ COURBE DE TITRAGE : reporte sur un graphe le pH en fonction du volume de NaOH versé. La courbe a une forme en S avec un saut brusque au point d'équivalence (entre pH 3 et pH 11 pour HCl/NaOH).",
   ],
   quiz:[
     {q:"Jus de citron pH=2. Il est :",opts:["Très basique","Neutre","Légèrement acide","Très acide"],ans:3,exp:"pH 2 est très acide (proche de 0). Acide citrique + acide ascorbique."},
     {q:"HCl + NaOH produit :",opts:["HNaCl + O₂","NaCl + H₂O","NaHCl₂","NaCl₂ + H₂"],ans:1,exp:"Neutralisation acide fort / base forte → sel (NaCl) + eau."},
     {q:"Phénolphtaléine en milieu basique :",opts:["Jaune","Bleue","Rose/Violette","Incolore"],ans:2,exp:"Phénolphtaléine : incolore (acide/neutre) → rose/violette (basique, pH > 8,2)."},
     {q:"Au point d'équivalence HCl/NaOH, pH = :",opts:["0","7","10","14"],ans:1,exp:"Acide fort + base forte → pH = 7 à l'équivalence (NaCl + H₂O, neutres)."},
     {q:"Un acide fort vs un acide faible :",opts:["A un pH plus élevé","Se dissocie totalement dans l'eau","Réagit uniquement avec métaux","A une couleur plus intense"],ans:1,exp:"Acide fort (HCl, H₂SO₄) : dissociation totale. Acide faible (CH₃COOH) : dissociation partielle."},
     {q:"Dosage : 20mL acide + 25mL NaOH 0,1mol/L. Concentration de l'acide :",opts:["0,08 mol/L","0,125 mol/L","0,1 mol/L","0,5 mol/L"],ans:1,exp:"Ca×Va = Cb×Vb → Ca = 0,1×25/20 = 0,125 mol/L."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  {id:"lv11",titre:"Oxydoréduction & Combustion",matiere:"Chimie",cat:"chimie",
   classe:"1ère C/D-Tle C/D",ico:"🔥",color:"#EA580C",gratuit:false,plan:"Sciences",
   desc:"Réactions redox, nombres d'oxydation, piles électrochimiques, corrosion et combustions.",
   theorie:"🔥 Oxydation = perte d'électrons ; réduction = gain d'électrons.\nCouple redox : forme oxydée / forme réduite. Ex: Cu²⁺/Cu ; Zn²⁺/Zn.\n\n🔋 Pile : réaction redox spontanée → courant. Anode = oxydation ; Cathode = réduction.\n\n⚙️ Électrolyse : courant forcé → réaction non-spontanée.\n\n🔥 Combustion complète du méthane : CH₄ + 2O₂ → CO₂ + 2H₂O.\nIncomplète : CH₄ + 3/2 O₂ → CO + 2H₂O (CO = dangereux !).",
   experience:[],
   quiz:[], verrou:true, nExp:7, nQuiz:5,
   ressource:"https://minesec-distancelearning.cm",pack:"Sciences"},

  // ─ SVT ─
  {id:"lv4",titre:"La Mitose — Division Cellulaire",matiere:"SVT",cat:"svt",
   classe:"2nde C-1ère D",ico:"🧬",color:"#059669",gratuit:true,
   desc:"Visualise les 4 phases de la mitose. Comprends la réplication, la division et la différence avec la méiose.",
   theorie:"🔬 Mitose : division cellulaire → 2 cellules filles IDENTIQUES à la mère (même 2n chromosomes).\n\n4 phases — PMAT :\n📌 Prophase : chromosomes se condensent, fuseau se forme.\n📌 Métaphase : chromosomes alignés sur la plaque équatoriale.\n📌 Anaphase : chromatides sœurs séparées, migrent aux pôles.\n📌 Télophase : 2 noyaux formés, cytocinèse → 2 cellules.\n\nInterphase (avant mitose) : réplication ADN (phase S). 46 chromosomes chez l'homme.",
   experience:[
     "1️⃣ PRÉPARATION DE LA LAME : coupe 2-3 mm d'une racine d'oignon (méristème = zone de croissance en pointe). Étale sur lame, ajoute colorant carmin acéto-orcéine ou violet de gentiane. Pose la lamelle, écrase légèrement.",
     "2️⃣ OBSERVATION AU MICROSCOPE (objectif ×10 puis ×40) : cherche des cellules dont le noyau est visible et coloré. Repère des cellules avec des chromosomes visibles (distinctes des cellules en interphase).",
     "3️⃣ IDENTIFIER LA PROPHASE : cherche une cellule dont les chromosomes sont condensés en bâtonnets épais mais encore désorganisés. L'enveloppe nucléaire disparaît.",
     "4️⃣ IDENTIFIER LA MÉTAPHASE : cherche une cellule dont les chromosomes sont alignés EN FILE au centre (plaque équatoriale). C'est la phase la plus facile à observer.",
     "5️⃣ IDENTIFIER L'ANAPHASE : cherche une cellule dont les chromosomes se séparent vers les deux pôles (forme en V ou Y). Les deux groupes de chromatides migrent en sens opposé.",
     "6️⃣ IDENTIFIER LA TÉLOPHASE : cherche deux masses de chromosomes aux pôles. La cellule commence à se diviser en deux (étranglement visible = cytocinèse).",
     "7️⃣ SCHÉMA BILAN : dessine les 4 phases en ordre (PMAT) avec une légende : chromosomes, fuseau, plaque équatoriale, noyau. Note que la mitose conserve 2n=46 chromosomes dans chaque cellule fille.",
   ],
   quiz:[
     {q:"La mitose produit combien de cellules filles identiques ?",opts:["1","2","4","8"],ans:1,exp:"Mitose → 2 cellules filles génétiquement identiques à la mère (2n chromosomes)."},
     {q:"À quelle phase les chromosomes s'alignent-ils au centre ?",opts:["Prophase","Métaphase","Anaphase","Télophase"],ans:1,exp:"MÉTAPHASE : alignement sur la plaque équatoriale. PMAT → M = aligneMent au Milieu."},
     {q:"Qu'est-ce qu'une chromatide ?",opts:["Un chromosome entier","La moitié d'un chromosome répliqué","Une molécule d'ARN","Un gène isolé"],ans:1,exp:"Après réplication, chaque chromosome = 2 chromatides sœurs identiques reliées au centromère."},
     {q:"La mitose est précédée de :",opts:["La méiose","La prophase directement","L'interphase (réplication ADN)","La télophase"],ans:2,exp:"L'interphase (G1+S+G2) précède la mitose. La phase S = réplication de l'ADN."},
     {q:"Différence principale mitose vs méiose :",opts:["Mitose produit 4 cellules","Méiose produit des cellules identiques","Méiose produit 4 cellules haploïdes (n)","Mitose ne concerne que les plantes"],ans:2,exp:"Méiose → 4 cellules haploïdes (n) = gamètes. Mitose → 2 cellules diploïdes (2n) identiques."},
     {q:"Un humain a 2n=46. Après mitose, chaque cellule fille a :",opts:["23","46","92","12"],ans:1,exp:"La mitose conserve 2n→2n. Chaque cellule fille a bien 46 chromosomes."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  {id:"lv5",titre:"La Nutrition chez les Plantes",matiere:"SVT",cat:"svt",
   classe:"4ème-2nde C-1ère D",ico:"🌱",color:"#16A34A",gratuit:true,
   desc:"Photosynthèse, absorption des sels minéraux, circulation de la sève et rôle des stomates.",
   theorie:"🌿 Photosynthèse : 6CO₂ + 6H₂O + lumière → C₆H₁₂O₆ + 6O₂.\nLieu : CHLOROPLASTES (grains verts dans les cellules des feuilles). Nécessite : lumière + CO₂ + eau.\n\n🔬 3 conditions indispensables à la photosynthèse :\n• Lumière (vérifiable avec une cloche noire)\n• CO₂ (vérifiable avec de la chaux sodée ou du KOH)\n• Eau (vérifiable par déshydratation)\n\n💧 Sève brute : eau + sels minéraux (racines → poils absorbants → XYLÈME → feuilles).\n🍃 Transpiration : les stomates (pores) libèrent la vapeur d'eau.\n🍬 Sève élaborée : glucose fabriqué dans feuilles → PHLOÈME → toute la plante.",
   experience:[
     "1️⃣ Plante au soleil 2h et une plante à l'obscurité 2h. Prélève une feuille de chacune.",
     "2️⃣ Décoloration : trempe les feuilles dans l'alcool chaud (bain-marie) → feuilles deviennent blanc-crème.",
     "3️⃣ Test au Lugol (eau iodée) : feuille éclairée → BLEU-NOIR (amidon présent = photosynthèse a eu lieu).",
     "4️⃣ Feuille à l'obscurité + test Lugol → beige (pas d'amidon = pas de photosynthèse sans lumière).",
     "5️⃣ Transpiration : couvre une plante d'un sac plastique transparent → vapeur d'eau visible sur les parois.",
     "6️⃣ Trajet de l'eau : place une fleur blanche dans de l'eau colorée au bleu de méthylène → tige et pétales bleutés.",
     "7️⃣ Bilan : la plante fabrique ses propres aliments (autotrophe). Elle absorbe CO₂ et rejette O₂ = source d'oxygène vital.",
   ],
   quiz:[
     {q:"La photosynthèse se déroule dans :",opts:["Les mitochondries","Les chloroplastes","Le noyau","Les vacuoles"],ans:1,exp:"Les chloroplastes contiennent la chlorophylle (verte) qui capte la lumière et permet la photosynthèse."},
     {q:"La photosynthèse libère quel gaz utile à la respiration ?",opts:["CO₂","N₂","O₂","H₂"],ans:2,exp:"6CO₂ + 6H₂O + lumière → C₆H₁₂O₆ + 6O₂. L'oxygène libéré est utilisé par tous les êtres vivants."},
     {q:"Test au Lugol sur une feuille exposée à la lumière :",opts:["Rouge","Jaune","Bleu-noir","Aucune réaction"],ans:2,exp:"Lugol (eau iodée) colore l'amidon en bleu-noir. La photosynthèse produit du glucose transformé en amidon."},
     {q:"Quel organe de la racine absorbe l'eau ?",opts:["La tige","Les stomates","Les fleurs","Les poils absorbants"],ans:3,exp:"Les poils absorbants se trouvent à l'extrémité des racines et absorbent eau + sels minéraux du sol."},
     {q:"La sève élaborée (sucrée) circule :",opts:["Des racines vers les feuilles par le xylème","Des feuilles vers toute la plante par le phloème","Uniquement dans les racines","Des fleurs vers les feuilles"],ans:1,exp:"Sève élaborée (glucose) → fabriquée dans les feuilles → descend par le phloème vers les autres organes."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  {id:"lv12",titre:"La Digestion Humaine",matiere:"SVT",cat:"svt",
   classe:"4ème-1ère C",ico:"🍽️",color:"#B04E64",gratuit:true,
   desc:"Trajet des aliments, enzymes digestives, absorption des nutriments et rôle du foie.",
   theorie:"🍽️ Tube digestif : bouche → œsophage → estomac → intestin grêle → gros intestin → anus.\n\n⚗️ Enzymes :\n• Bouche : amylase salivaire (amidon → maltose)\n• Estomac : pepsine + HCl (pH≈2) (protéines → peptides)\n• Intestin grêle : lipase, protéases, amylase pancréatique ; bile du foie (émulsification graisses)\n\n🩸 Absorption : villosités intestinales (≈200 m² de surface). Glucose, acides aminés → sang. Lipides → lymphe.\nFoie : stockage glycogène, filtration, production bile.",
   experience:[
     "1️⃣ Amylase salivaire : amidon + salive à 37°C → 5min → test Lugol = jaune/brun (amidon dégradé !).",
     "2️⃣ Froid : même test à 0°C → Lugol bleu-noir (enzyme inactive par le froid).",
     "3️⃣ Acide : amylase à pH=2 → pas de digestion (enzyme dénaturée, comme dans l'estomac).",
     "4️⃣ Trajet du steak : bouche (mastication) → estomac (pepsine, 4h) → duodénum (bile+enzymes pancréas).",
     "5️⃣ Villosités intestinales : 200 m² de surface absorbante ! Glucose + acides aminés → sang portal → foie.",
     "6️⃣ Gros intestin : absorption de l'eau, flore bactérienne (microbiote), formation des fèces.",
     "7️⃣ IMC : poids(kg)/taille²(m). < 18,5 = sous-poids ; 18,5-25 = normal ; > 30 = obésité.",
   ],
   quiz:[
     {q:"Quel organe produit la bile ?",opts:["Pancréas","Estomac","Foie","Intestin grêle"],ans:2,exp:"Le foie produit la bile (stockée dans la vésicule biliaire) qui émulsionne les lipides."},
     {q:"L'amylase salivaire dégrade :",opts:["Les protéines","Les lipides","L'amidon","Les vitamines"],ans:2,exp:"L'amylase (bouche + pancréas) dégrade l'amidon → maltose → glucose."},
     {q:"pH de l'estomac ≈ :",opts:["7","2","8","5"],ans:1,exp:"L'estomac sécrète HCl → pH ≈ 2. Active la pepsine et détruit les bactéries."},
     {q:"L'absorption des nutriments a lieu principalement dans :",opts:["L'estomac","Le gros intestin","L'intestin grêle","La bouche"],ans:2,exp:"Intestin grêle (6-7m + villosités = 200m²) : site principal d'absorption."},
     {q:"Les lipides digérés sont absorbés par :",opts:["Le sang directement","La voie lymphatique","L'urine","Les poumons"],ans:1,exp:"Acides gras + glycérol → chylomicrons → vaisseaux lymphatiques (chylifères) → sang."},
     {q:"Rôle principal du gros intestin :",opts:["Produire les enzymes","Absorber les protéines","Absorber l'eau et former les fèces","Produire la bile"],ans:2,exp:"Gros intestin : absorption de l'eau + fermentation bactérienne → formation des matières fécales."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  {id:"lv13",titre:"Circulation Sanguine & Respiration",matiere:"SVT",cat:"svt",
   classe:"3ème-2nde C",ico:"❤️",color:"#AE5353",gratuit:true,
   desc:"Le cœur, la grande et petite circulation, échanges gazeux dans les poumons et rôle de l'hémoglobine.",
   theorie:"❤️ Cœur = pompe double à 4 cavités : 2 oreillettes + 2 ventricules.\n\n🔴 Grande circulation : cœur gauche → aorte → organes → veines caves → oreillette droite.\n🔵 Petite circulation : cœur droit → artères pulmonaires → poumons → veines pulmonaires → oreillette gauche.\n\n🫁 Hématose (alvéoles) : O₂ passe dans le sang par diffusion ; CO₂ en sort. Surface ≈ 70 m².\n\nHémoglobine (globules rouges) : fixe 4 O₂ → oxyhémoglobine (rouge vif) ; libère O₂ aux tissus.",
   experience:[
     "1️⃣ Dissection virtuelle cœur de mouton : identifie 4 cavités, valves (mitrale, tricuspide, sigmoïdes).",
     "2️⃣ Trajet d'une hématie : oreillette D → ventricule D → artère pulmonaire → poumon (charge O₂) → oreillette G → ventricule G → aorte → muscles.",
     "3️⃣ Mesure ton pouls (artère radiale, 15s × 4). Normal : 60-80/min. Après 30 squats : mesure de nouveau.",
     "4️⃣ Spiromètre virtuel : volume courant (0,5L), capacité vitale (3,5-5L), volume résiduel.",
     "5️⃣ Échanges gazeux alvéolaires : PO₂ alvéolaire > PO₂ sang veineux → diffusion O₂ vers sang.",
     "6️⃣ Hémoglobine : à faible PO₂ (tissus) elle libère O₂. À forte PO₂ (poumons) elle le capte.",
     "7️⃣ Athérosclérose : plaques de cholestérol → sténose artérielle → risque infarctus. Prévention : sport + alimentation.",
   ],
   quiz:[
     {q:"Le cœur humain a combien de cavités ?",opts:["2","3","4","6"],ans:2,exp:"4 cavités : oreillette D, ventricule D (circulation pulmonaire) + oreillette G, ventricule G (circulation systémique)."},
     {q:"Les artères pulmonaires transportent :",opts:["Sang oxygéné vers les poumons","Sang désoxygéné vers les poumons","Sang oxygéné vers le cœur","Sang désoxygéné vers le cœur"],ans:1,exp:"Exception ! Artères pulmonaires = sang DÉSOXYGÉNÉ du cœur droit vers les poumons."},
     {q:"Les échanges O₂/CO₂ ont lieu dans :",opts:["La trachée","Les bronches","Les alvéoles pulmonaires","Les capillaires coronaires"],ans:2,exp:"Alvéoles (300 millions, paroi ultra-fine) : diffusion O₂ → sang, CO₂ → air. Surface ≈ 70 m²."},
     {q:"L'hémoglobine se trouve dans :",opts:["Les leucocytes","Les plaquettes","Les globules rouges","Le plasma"],ans:2,exp:"Hémoglobine = protéine des érythrocytes (globules rouges). Transporte O₂ des poumons aux organes."},
     {q:"Pression artérielle '120/80' :",opts:["120=diastolique, 80=systolique","120=systolique, 80=diastolique","120 battements/min","Les deux ventricules"],ans:1,exp:"120 mmHg = systolique (contraction VG) ; 80 mmHg = diastolique (relâchement). Valeurs normales."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  {id:"lv14",titre:"Génétique & Hérédité",matiere:"SVT",cat:"svt",
   classe:"Tle C/D",ico:"🔬",color:"#6C56A6",gratuit:false,plan:"Sciences",
   desc:"Lois de Mendel, croisements, dominance, codominance et génétique des groupes sanguins.",
   theorie:"🧬 Gène : portion d'ADN. Allèles : différentes formes d'un gène.\nGénotype (AA, Aa, aa) → Phénotype (caractère observable).\n\n📌 1ère loi Mendel : uniformité F1 (AA × aa → 100% Aa).\n📌 2ème loi : F1×F1 → ratio 3:1 phénotypique, 1:2:1 génotypique.\n📌 3ème loi : assortiment indépendant des gènes de chromosomes différents.\n\nGroupes ABO : IA et IB codominants ; i récessif.\nDaltonisme : lié à X (garçons surtout touchés).\nDrépanocytose : HbS/HbS = malade ; HbA/HbS = porteur sain.",
   experience:[],
   quiz:[], verrou:true, nExp:7, nQuiz:5,
   ressource:"https://minesec-distancelearning.cm",pack:"Sciences"},

  // ─ MATHS ─
  {id:"lv6",titre:"Géométrie dans l'Espace",matiere:"Maths",cat:"maths",
   classe:"5ème-4ème-3ème-2nde C-1ère C",ico:"📐",color:"#AE5353",gratuit:true,
   desc:"Volumes, aires et diagonales des solides : cube, sphère, cylindre, pyramide, cône.",
   theorie:"📦 Cube : V=a³ ; Aire=6a² ; Diagonale=a√3.\n🔵 Sphère : V=(4/3)πr³ ; Aire=4πr².\n🥫 Cylindre : V=πr²h ; Aire totale=2πr(h+r).\n🔺 Pyramide : V=(B×h)/3 (B=aire base).\n🍦 Cône : V=(πr²h)/3 ; Apothème l=√(r²+h²).\n\nDistance 3D : AB=√[(x₂-x₁)²+(y₂-y₁)²+(z₂-z₁)²].\nSection d'un cube par plan diagonal → rectangle.",
   experience:[
     "1️⃣ RECONNAÎTRE LES SOLIDES : cube (6 faces carrées), pavé droit (6 faces rectangulaires), cylindre (2 cercles + 1 rectangle enroulé), cône (1 cercle + 1 secteur), pyramide (base + triangles). Dessine chaque solide.",
     "2️⃣ DÉVELOPPEMENT DU CUBE : découpe un cube en carton. Déplie-le. Observe : 6 carrés disposés en croix. Retrace le patron sur papier, découpe et reforme le cube. Aide-toi du patron pour calculer l'aire totale = 6a².",
     "3️⃣ VOLUME DU CUBE : remplis d'eau un cube de côté a=5cm jusqu'au bord. Verse dans une éprouvette graduée. Mesure : V = 125 cm³ (= a³). Vérifie la formule.",
     "4️⃣ CYLINDRE : mesure le rayon r et la hauteur h d'une boîte de conserve. Calcule V = πr²h. Compare avec la contenance indiquée sur l'étiquette (en mL = cm³). Écart dû aux parois ?",
     "5️⃣ PYRAMIDE vs PRISME : prends une pyramide et un prisme de même base et même hauteur. Pour remplir le prisme, il faut exactement 3 fois la pyramide d'eau. → V_pyramide = (1/3) × V_prisme.",
     "6️⃣ PROBLÈME CONCRET (cône) : une tente conique a r=3m et h=4m. Calcule la toile nécessaire (aire latérale = πrl où l=√(r²+h²)=5m) → πrl = 3π×5 ≈ 47,1 m².",
     "7️⃣ CALCUL DU VOLUME D'UN CHÂTEAU D'EAU : observe le château d'eau de ton quartier. Estime r et h. Applique V=πr²h. Convertis en litres (1 m³ = 1000 L). Combien de familles peut-il alimenter ?",
   ],
   quiz:[
     {q:"Cube d'arête 4cm. Volume :",opts:["16 cm³","48 cm³","64 cm³","96 cm³"],ans:2,exp:"V = a³ = 4³ = 64 cm³."},
     {q:"Volume d'une sphère :",opts:["V=πr²h","V=(4/3)πr³","V=πr³","V=2πr²"],ans:1,exp:"V=(4/3)πr³. Pour r=3 : V≈113cm³."},
     {q:"Cône r=3cm, h=4cm. Volume :",opts:["12π cm³","4π cm³","36π cm³","18π cm³"],ans:0,exp:"V=(1/3)πr²h=(1/3)π×9×4=12π≈37,7cm³."},
     {q:"Diagonale d'un cube d'arête a :",opts:["a√2","a√3","2a","a√6"],ans:1,exp:"d=√(a²+a²+a²)=a√3."},
     {q:"Cylindre r=5cm, h=10cm. Aire totale :",opts:["50π cm²","100π cm²","150π cm²","200π cm²"],ans:2,exp:"Aire=2πrh+2πr²=100π+50π=150π cm²."},
     {q:"Pyramide base 3×3cm, h=4cm. Volume :",opts:["12 cm³","18 cm³","36 cm³","48 cm³"],ans:0,exp:"V=(9×4)/3=12 cm³."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  {id:"lv15",titre:"Probabilités & Statistiques",matiere:"Maths",cat:"maths",
   classe:"3ème-1ère A-Tle A/C/D",ico:"🎲",color:"#D97706",gratuit:true,
   desc:"Probabilités classiques et conditionnelles, statistiques descriptives. Tle C/D : loi binomiale.",
   theorie:"🎲 P(A) = cas favorables / cas totaux. 0 ≤ P(A) ≤ 1.\nP(Ā) = 1-P(A) ; P(A∪B) = P(A)+P(B)-P(A∩B).\nIndépendants : P(A∩B) = P(A)×P(B).\n\n📊 Statistiques :\n• Moyenne : μ = Σ(xi×ni)/N\n• Médiane : valeur centrale de la série ordonnée\n• Mode : valeur la plus fréquente\n• Étendue = valeur max − valeur min\n• Écart interquartile = Q3 − Q1\n\n📐 Tle C/D — Loi binomiale B(n,p) :\nP(X=k) = C(n,k)×pᵏ×(1-p)ⁿ⁻ᵏ ; E(X)=np ; σ=√[np(1-p)].",
   experience:[
     "1️⃣ EXPÉRIENCE CONCRÈTE : lance un dé 30 fois. Note le résultat de chaque lancer dans un tableau. Calcule la fréquence de chaque face. Compare avec la probabilité théorique 1/6 ≈ 0,167.",
     "2️⃣ TABLEAU DE DONNÉES : relève les notes de contrôle de ta classe (ou utilise : 5, 7, 8, 9, 10, 10, 12, 13, 14, 15, 16, 18). Organise-les dans l'ordre croissant.",
     "3️⃣ CALCUL DES INDICATEURS : sur ta série ordonnée → calcule μ (moyenne) ; identifie la médiane (valeur centrale) ; identifie le mode (valeur la plus répétée) ; calcule l'étendue = max − min.",
     "4️⃣ HISTOGRAMME : regroupe les notes par tranches (0-5, 6-9, 10-12, 13-15, 16-20). Trace le diagramme en barres. Quelle tranche regroupe le plus d'élèves ?",
     "5️⃣ DIAGRAMME CIRCULAIRE : pour un sondage (ex. 40% aiment le foot, 30% la musique, 30% la lecture), calcule les angles (×360°) et trace le camembert.",
     "6️⃣ PROBABILITÉ CLASSIQUE : une urne a 3 boules rouges, 4 bleues, 3 vertes. Calcule : P(rouge), P(non rouge), P(rouge ou bleue). Vérifie que la somme des probabilités = 1.",
     "7️⃣ ARBRE DE PROBABILITÉ : un sac a 2 billes noires, 3 blanches. On tire 2 billes successivement sans remise. Construis l'arbre et calcule P(2 noires), P(1 noire + 1 blanche), P(2 blanches).",
   ],
   quiz:[
     {q:"Urne : 3 rouges + 7 bleues. P(rouge) = ?",opts:["3/7","7/10","3/10","1/3"],ans:2,exp:"P = 3/(3+7) = 3/10 = 0,3 = 30%."},
     {q:"Moyenne de la série {4, 6, 8, 10, 12} :",opts:["6","8","10","40"],ans:1,exp:"μ = (4+6+8+10+12)/5 = 40/5 = 8."},
     {q:"P(A)=0,5, P(B)=0,4, P(A∩B)=0,2. P(A∪B) = ?",opts:["0,9","0,7","1,1","0,3"],ans:1,exp:"P(A∪B) = P(A)+P(B)−P(A∩B) = 0,5+0,4−0,2 = 0,7."},
     {q:"La médiane d'une série ordonnée est :",opts:["La valeur la plus fréquente","La moyenne","La valeur qui partage la série en deux moitiés égales","La valeur minimale"],ans:2,exp:"Médiane : série ordonnée → valeur du milieu (ou moyenne des deux valeurs centrales si n pair)."},
     {q:"A et B indépendants, P(A)=0,3, P(B)=0,4. P(A∩B) = ?",opts:["0,7","0,12","0,1","0,35"],ans:1,exp:"Indépendants → P(A∩B) = P(A)×P(B) = 0,3×0,4 = 0,12."},
     {q:"L'écart-type σ mesure :",opts:["La valeur centrale","La dispersion des données autour de la moyenne","La valeur maximale","Le nombre total d'observations"],ans:1,exp:"σ élevé = données très dispersées. σ faible = données concentrées autour de μ."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  {id:"lv16",titre:"Fonctions & Dérivées",matiere:"Maths",cat:"maths",
   classe:"1ère A/C/D-Tle A/C/D",ico:"📈",color:"#BE185D",gratuit:false,plan:"Sciences",
   desc:"Fonctions usuelles, calcul de dérivées, tableaux de variations et optimisation.",
   theorie:"📐 Dérivée = taux de variation instantané = pente de la tangente.\n(xⁿ)'=nxⁿ⁻¹ ; (√x)'=1/(2√x) ; (eˣ)'=eˣ ; (ln x)'=1/x.\n(sin x)'=cos x ; (cos x)'=-sin x.\n(uv)'=u'v+uv' ; (u/v)'=(u'v-uv')/v².\n\n📊 Tableau de variations : f'>0 → croissante ; f'<0 → décroissante ; f'=0 → extremum.\n\n∫xⁿ dx = xⁿ⁺¹/(n+1)+C. Aire sous courbe = ∫ₐᵇ f(x)dx.",
   experience:[],
   quiz:[], verrou:true, nExp:7, nQuiz:6,
   ressource:"https://minesec-distancelearning.cm",pack:"Sciences"},

  {id:"lv17",titre:"Trigonométrie & Cercle Unité",matiere:"Maths",cat:"maths",
   classe:"3ème-2nde C-1ère C/D",ico:"📏",color:"#0891B2",gratuit:true,
   desc:"sin, cos, tan, valeurs remarquables, cercle trigonométrique et équations trigonométriques.",
   theorie:"📐 Triangle rectangle : sin=opp/hyp ; cos=adj/hyp ; tan=opp/adj (SOH-CAH-TOA).\n\n🔵 Cercle unité : M(cos θ, sin θ).\nValeurs (cos ; sin) : 0°(1 ; 0) ; 30°(√3/2 ; 1/2) ; 45°(√2/2 ; √2/2) ; 60°(1/2 ; √3/2) ; 90°(0 ; 1).\n\nIdentité : sin²+cos²=1 ; sin(2x)=2sin x cos x ; cos(2x)=cos²x-sin²x.\n\nConversion : degrés×π/180 = radians. 90°=π/2 ; 180°=π ; 360°=2π.",
   experience:[
     "1️⃣ CONSTRUCTION DU TRIANGLE : sur papier quadrillé, dessine un triangle rectangle. Mesure l'hypoténuse (c), le côté adjacent (a) et le côté opposé (b) à l'angle α. Calcule sin(α)=b/c, cos(α)=a/c, tan(α)=b/a.",
     "2️⃣ TABLE DES VALEURS REMARQUABLES : complète ce tableau à mémoriser — | α | 0° | 30° | 45° | 60° | 90° | sin | 0 | 1/2 | √2/2 | √3/2 | 1 | cos | 1 | √3/2 | √2/2 | 1/2 | 0 |",
     "3️⃣ MESURE D'UNE HAUTEUR inaccessible : mesure la distance au pied d'un arbre (ex. 10m). Avec un rapporteur, mesure l'angle d'élévation (ex. 35°). Hauteur = d×tan(35°) ≈ 10×0,70 = 7m.",
     "4️⃣ CERCLE TRIGONOMÉTRIQUE : trace un cercle de rayon 1. Place le point M correspondant à α=30°. Ses coordonnées sont (cos 30°, sin 30°) = (√3/2, 1/2). Fais de même pour 45°, 60°, 90°.",
     "5️⃣ VÉRIFICATION DE L'IDENTITÉ : pour α=30°, calcule sin²(30°)+cos²(30°) = (1/2)²+(√3/2)² = 1/4+3/4 = 1 ✓. Teste avec α=45°. Cette identité est toujours vraie.",
     "6️⃣ CONVERSION DEGRÉS ↔ RADIANS : 180° = π rad. Complète : 90°=?, 60°=?, 45°=?, 30°=?, 360°=? Sens inverse : π/3 = ? ° ; 3π/2 = ? °.",
     "7️⃣ RÉSOLUTION D'ÉQUATION : dans un triangle rectangle, un angle est 40° et l'hypoténuse est 15cm. Calcule les deux côtés inconnus : côté opposé = 15×sin(40°) ≈ 9,6cm ; côté adjacent = 15×cos(40°) ≈ 11,5cm.",
   ],
   quiz:[
     {q:"sin(30°) = ?",opts:["√3/2","1/2","√2/2","1"],ans:1,exp:"sin(30°)=1/2. Valeur remarquable fondamentale."},
     {q:"tan(α) dans un triangle rectangle :",opts:["adj/hyp","opp/hyp","opp/adj","hyp/adj"],ans:2,exp:"SOH-CAH-TOA : Tan=Opp/Adj."},
     {q:"sin²(x)+cos²(x) = ?",opts:["0","2","sin(2x)","1"],ans:3,exp:"Identité pythagoricienne fondamentale."},
     {q:"90° en radians :",opts:["π/4","π/3","π/2","π"],ans:2,exp:"90°×π/180 = π/2 rad."},
     {q:"cos(π) = ?",opts:["0","1","-1","√2/2"],ans:2,exp:"cos(180°)=-1. Point (-1,0) sur le cercle unité."},
     {q:"Période de sin(x) :",opts:["π","2π","π/2","4π"],ans:1,exp:"sin(x+2π)=sin(x). Période = 2π."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  // ─ GÉOGRAPHIE & HISTOIRE ─
  {id:"lv18",titre:"La Mondialisation",matiere:"Géographie",cat:"geo",
   classe:"3ème-Tle",ico:"🌐",color:"#059669",gratuit:false,plan:"Complet",
   desc:"Flux mondiaux, acteurs, inégalités, IDH et place du Cameroun dans la mondialisation.",
   theorie:"🌐 Mondialisation = mise en relation croissante des économies, sociétés et espaces mondiaux.\n\n📦 Flux : marchandises (OMC) ; capitaux (IDE) ; personnes (migrations) ; informations (internet).\n\n🏭 Acteurs : FMN ; États ; OMC/FMI/BM ; ONG ; villes mondiales.\n\n🗺️ Triade (USA-Europe-Japon) + BRICS (Brésil, Russie, Inde, Chine, Afrique du Sud).\n\n📊 IDH : Indice Développement Humain (revenus + santé + éducation). De 0 à 1.\n\n🇨🇲 Cameroun : exportations (cacao, café, bois, pétrole) ; port Douala = hub régional ; IDE chinois.",
   experience:[],
   quiz:[], verrou:true, nExp:7, nQuiz:5,
   ressource:"https://minesec-distancelearning.cm",pack:"Complet"},

  // ─ INFO & LANGUES ─
  {id:"lv19",titre:"Algorithmes & Programmation",matiere:"Info/Maths",cat:"info",
   classe:"4ème-3ème-2nde-1ère",ico:"💻",color:"#1E3A8A",gratuit:true,
   desc:"Algorithmique, structures de contrôle, fonctions, récursivité et initiation Python.",
   theorie:"💻 Algorithme : suite d'instructions ordonnées pour résoudre un problème.\n\nStructures :\n• Séquence : instructions dans l'ordre\n• Condition : SI ... ALORS ... SINON\n• Boucle : POUR (n fois) ou TANTQUE (condition)\n• Fonction : bloc réutilisable, paramètres + retour\n\nComplexité : O(n) linéaire ; O(n²) quadratique ; O(log n) logarithmique.\n\nAu programme : langage C (2nde C, Tle C/D) et JavaScript (1ère C/D). Python, cité ici en exemple : indentation obligatoire pour les blocs. Types : int, float, str, bool, list, dict.",
   experience:[
     "1️⃣ Factorielle : f=1 ; POUR i de 1 à n : f=f×i. Résultat : 5!=120 ; 10!=3 628 800.",
     "2️⃣ Maximum dans [5,3,8,2,9,1] : max=tab[0] ; POUR x dans tab : SI x>max : max=x → max=9.",
     "3️⃣ Tri à bulles : compare et échange les paires adjacentes. O(n²) → lent pour n grand.",
     "4️⃣ Récursivité : fib(n)=fib(n-1)+fib(n-2), fib(0)=0, fib(1)=1. fib(7)=13.",
     "5️⃣ Python : if age>=18: print('Majeur') else: print('Mineur'). Test avec input().",
     "6️⃣ Fonction Python : def moyenne(notes): return sum(notes)/len(notes). Test avec [12,14,16,10,18].",
     "7️⃣ Application : algorithme de calcul de mention BAC camerounais (TB/B/AB/P/R) selon la moyenne.",
   ],
   quiz:[
     {q:"Une boucle POUR i de 1 à n s'exécute :",opts:["Jusqu'à une condition","Exactement n fois","Indéfiniment","Une seule fois"],ans:1,exp:"POUR = nombre fixe d'itérations. TANTQUE = s'exécute jusqu'à ce que la condition soit fausse."},
     {q:"En Python, l'indentation sert à :",opts:["Décorer le code","Définir les blocs d'instructions","Commenter le code","Déclarer les variables"],ans:1,exp:"Python utilise l'indentation (pas les {}) pour délimiter les blocs if, for, def, etc."},
     {q:"Complexité O(n²) : si n double, le temps :",opts:["Double","Triple","Quadruple","Reste le même"],ans:2,exp:"O(n²) : (2n)²=4n². Le temps est multiplié par 4."},
     {q:"5! = ?",opts:["25","60","120","720"],ans:2,exp:"5! = 5×4×3×2×1 = 120."},
     {q:"Une fonction récursive :",opts:["Utilise uniquement des boucles","S'appelle elle-même","Ne retourne pas de valeur","Traite uniquement des entiers"],ans:1,exp:"Récursivité = la fonction s'appelle elle-même avec un cas de base pour arrêter."},
     {q:"Structure de condition :",opts:["POUR i de 1 à n","TANTQUE x>0","SI x>0 ALORS","FONCTION f(x)"],ans:2,exp:"SI...ALORS...SINON = condition (branchement). POUR/TANTQUE = boucles."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  {id:"lv27",titre:"Le Système Immunitaire & Vaccination",matiere:"SVT",cat:"svt",
   classe:"3ème-1ère C/D-Tle C/D",ico:"🛡️",color:"#16A34A",gratuit:true,
   desc:"Comprendre comment notre corps se défend contre les infections : anticorps, lymphocytes, vaccins.",
   theorie:"🛡️ IMMUNITÉ INNÉE (1ère ligne) : peau, muqueuses, phagocytose par macrophages. Rapide, non-spécifique.\n\n⚔️ IMMUNITÉ ADAPTATIVE (lente, spécifique) :\n• Lymphocytes B → produisent anticorps (Ig) qui neutralisent l'antigène.\n• Lymphocytes T cytotoxiques → tuent les cellules infectées.\n• Lymphocytes T auxiliaires (CD4) → coordonnent la réponse.\n\n💉 VACCINATION : injection d'antigène atténué ou inactivé → mémoire immunitaire.\nÀ la 2ème exposition, réponse rapide et forte (lymphocytes mémoire). C'est le principe.\n\n🦠 VIH : détruit les LT4 (CD4) → effondrement immunité → SIDA.",
   experience:[
     "1️⃣ OBSERVATION : Une coupure cicatrise. Étape 1 : rougeur + chaleur (vasodilatation). Étape 2 : pus (macrophages morts + bactéries). Étape 3 : croûte (fibrine). Étape 4 : peau neuve.",
     "2️⃣ EXPÉRIENCE PASTEUR (1885) : Pasteur injecte virus rage atténué à un jeune mordu. Il survit ! Première vaccination. Principe : exposer le système immunitaire SANS danger.",
     "3️⃣ ANTIGÈNE-ANTICORPS : modèle clé-serrure. Chaque anticorps reconnaît UN antigène spécifique (variole, grippe, COVID...). Production : ~10 milliards d'anticorps différents possibles.",
     "4️⃣ TYPES DE VACCINS : Atténué (BCG, ROR) — vivant affaibli. Inactivé (grippe) — virus tué. Sous-unité (hépatite B) — protéine du virus. ARNm (Pfizer COVID) — code génétique → cellule produit l'antigène.",
     "5️⃣ TEST ELISA : détecter VIH dans sang. Antigène fixé sur plaque → ajout sang. Si anticorps anti-VIH présents → ils se fixent → coloration → personne séropositive.",
     "6️⃣ GROUPES SANGUINS : A, B, AB, O. Antigène A sur globule = groupe A. Anticorps anti-B dans plasma = groupe A. Transfusion A→B = catastrophe (agglutination).",
     "7️⃣ MÉMOIRE IMMUNITAIRE : graphique. 1ère exposition à un microbe : pic anticorps faible et tardif (~7 jours). 2ème exposition : pic ÉNORME et rapide (~3 jours). C'est pourquoi le rappel vaccinal renforce la protection.",
   ],
   quiz:[
     {q:"Cellules qui produisent les anticorps :",opts:["Lymphocytes T","Lymphocytes B","Macrophages","Globules rouges"],ans:1,exp:"Lymphocytes B (LB) deviennent plasmocytes et sécrètent les anticorps (immunoglobulines)."},
     {q:"Le VIH attaque principalement :",opts:["Globules rouges","Lymphocytes T4 (CD4)","Plaquettes","Neurones"],ans:1,exp:"VIH se fixe sur les récepteurs CD4 des LT4 → les détruit → effondrement de la coordination immunitaire → SIDA."},
     {q:"Principe d'un vaccin :",opts:["Tuer les microbes du corps","Stimuler la mémoire immunitaire avant l'infection","Donner directement des anticorps","Boost générique du système"],ans:1,exp:"Le vaccin expose le système immunitaire à un antigène inoffensif pour créer une mémoire. Lors d'une vraie infection, réponse immédiate."},
     {q:"Personne de groupe sanguin O a :",opts:["Antigène A et B","Aucun antigène A ni B","Antigènes A,B et anti-A,anti-B","Antigène O"],ans:1,exp:"Groupe O = absence d'antigène A et B. Plasma contient anti-A et anti-B. Donneur universel mais receveur que de O."},
     {q:"L'immunité innée est :",opts:["Spécifique et lente","Non-spécifique et rapide","Acquise par vaccination","Limitée aux nouveau-nés"],ans:1,exp:"Immunité innée = barrière universelle (peau, phagocytose) rapide mais non-spécifique. Adaptative = spécifique mais lente."},
     {q:"Sérothérapie consiste à :",opts:["Vacciner","Injecter des anticorps déjà formés","Faire une transfusion","Donner des antibiotiques"],ans:1,exp:"Sérothérapie = injection d'anticorps préformés (rapide mais non durable). Utile contre venin de serpent, rage post-exposition."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  {id:"lv28",titre:"ADN, Gènes & Hérédité",matiere:"SVT",cat:"svt",
   classe:"3ème-1ère D-Tle C",ico:"🧬",color:"#6C56A6",gratuit:true,
   desc:"Structure de l'ADN, code génétique, transmission des caractères et lois de Mendel.",
   theorie:"🧬 ADN = double hélice (Watson & Crick 1953) faite de 4 bases : A-T et G-C (complémentaires).\n\n📐 STRUCTURE : 2 brins anti-parallèles enroulés. Sucre (désoxyribose) + phosphate = squelette. Bases à l'intérieur.\n\n⛓️ ARN messager : copie d'un gène (transcription dans noyau). Sort vers ribosome.\n\n🔬 CODE GÉNÉTIQUE : par triplets (codons) de 3 bases → 1 acide aminé. 64 codons → 20 acides aminés (redondance).\n\n👶 LOIS DE MENDEL :\n• 1ère loi : uniformité des hybrides F1.\n• 2ème loi : ségrégation 3:1 dans F2 (dominant : récessif).\n• Sexe humain : XX (♀), XY (♂).",
   experience:[
     "1️⃣ EXTRACTION ADN MAISON : écraser banane, mélanger avec eau salée + savon liquide. Filtrer. Ajouter alcool froid à 90° doucement. Observer : filaments blancs visqueux = ADN ! Vrai expérience accessible.",
     "2️⃣ COMPLÉMENTARITÉ DES BASES : A=T, G=C. Si un brin est ATGCGTAA, l'autre est TACGCATT (lire à l'envers : 5'→3'). Vérifie : A face à T, G face à C.",
     "3️⃣ TRANSCRIPTION : ADN → ARN. Brin codant 'ATGCCC' → ARN 'AUGCCC' (T remplacé par U). Triplet AUG = méthionine = START.",
     "4️⃣ MUTATION : changement de base. ATGCCC (Méthionine-Proline) → ATGCGC (Méthionine-Arginine). Conséquence : protéine modifiée. Ex : drépanocytose (1 mutation = anémie falciforme).",
     "5️⃣ CROISEMENT MENDEL : Pois lisses (LL) × pois ridés (ll) → F1 : 100% Ll lisses (loi 1). F1×F1 → F2 : 1 LL, 2 Ll, 1 ll = 3 lisses : 1 ridé (loi 2).",
     "6️⃣ SEXE DE L'ENFANT : ♂ XY produit spermatozoïdes X (50%) ou Y (50%). ♀ XX produit ovules X (100%). C'est le PÈRE qui détermine le sexe. ♂ XY + X → fille XX. ♂ XY + Y → garçon XY.",
     "7️⃣ ARBRE GÉNÉALOGIQUE : tracer la transmission d'une maladie. Maladie autosomique récessive (mucoviscidose) : sauts de génération, parents porteurs sains. Maladie liée à X (hémophilie) : surtout chez garçons.",
   ],
   quiz:[
     {q:"Bases complémentaires dans l'ADN :",opts:["A-G et T-C","A-T et G-C","A-C et T-G","Aucune règle"],ans:1,exp:"Règle de Chargaff : Adénine s'apparie avec Thymine (2 liaisons H), Guanine avec Cytosine (3 liaisons H)."},
     {q:"Combien d'acides aminés codent les 64 codons ?",opts:["64","32","20","4"],ans:2,exp:"Code génétique = 64 codons → 20 acides aminés. Plusieurs codons peuvent coder le même AA (redondance)."},
     {q:"Croisement Aa × Aa donne :",opts:["100% Aa","25% AA, 50% Aa, 25% aa","50% AA, 50% aa","100% aa"],ans:1,exp:"Loi 2 Mendel : 1/4 AA, 2/4 Aa, 1/4 aa = phénotypes 3:1 (dominant:récessif)."},
     {q:"Génotype d'un garçon hémophile (gène sur X, récessif) :",opts:["X^h Y","X^H X^h","X^H Y","X^h X^h"],ans:0,exp:"X^h Y : un seul X (du côté ♂), donc si le gène hémophile est présent → maladie. Pas de 'compensation' par l'autre X."},
     {q:"L'ARNm est produit dans :",opts:["Cytoplasme","Noyau","Ribosome","Mitochondrie"],ans:1,exp:"Transcription ADN→ARNm se fait dans le NOYAU. Puis l'ARNm sort vers le cytoplasme et le ribosome pour traduction."},
     {q:"Un caryotype humain normal compte :",opts:["46 chromosomes","23 chromosomes","48 chromosomes","2 chromosomes"],ans:0,exp:"46 chromosomes = 23 paires (22 autosomes + 1 paire sexuelle XX ou XY). Trisomie 21 = 3 chromosomes 21 au lieu de 2."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  {id:"lv29",titre:"Probabilités Conditionnelles & Bayes",matiere:"Maths",cat:"maths",
   classe:"Tle C-Tle D",ico:"🎲",color:"#F59E0B",gratuit:true,
   desc:"Probabilités conditionnelles, indépendance, formule de Bayes et arbres pondérés.",
   theorie:"🎲 P(A|B) = P(A∩B)/P(B) — probabilité de A SACHANT B.\n\n🌳 ARBRE PONDÉRÉ : branches = événements, poids = probabilités. P(chemin) = produit des poids.\n\n🔄 INDÉPENDANCE : A et B indépendants ⇔ P(A∩B) = P(A)×P(B) ⇔ P(A|B) = P(A).\n\n🧠 FORMULE DE BAYES : P(A|B) = P(B|A)×P(A) / P(B).\nApplication clé : test médical. P(malade|test+) ≠ P(test+|malade).",
   experience:[
     "1️⃣ TIRAGE DE BOULES : Urne = 5 rouges + 3 vertes. 2 tirages SANS remise. P(2 rouges) = (5/8)×(4/7) = 20/56 ≈ 0,357. Sans remise = dépendant.",
     "2️⃣ TIRAGE AVEC REMISE : même urne. P(2 rouges avec remise) = (5/8)×(5/8) = 25/64 ≈ 0,391. Avec remise = indépendant.",
     "3️⃣ INTERSECTION : Dans une classe de 30 élèves : 18 font Maths, 12 font Anglais, 6 les deux. P(M∩A) = 6/30 = 0,2. P(M∪A) = (18+12-6)/30 = 0,8.",
     "4️⃣ TEST MÉDICAL : maladie touche 1% pop. Test détecte 99% des malades (sensibilité), faux+ = 5%. Tu es positif. P(malade|+) = ? Bayes : (0,99×0,01)/(0,99×0,01 + 0,05×0,99) ≈ 17%. SURPRENANT !",
     "5️⃣ PARADOXE DU JEU MONTY HALL : 3 portes, 1 voiture. Tu choisis. Le présentateur ouvre une porte vide. Faut-il changer ? OUI ! P(gagner si on change) = 2/3.",
     "6️⃣ LANCERS DE DÉS : 2 dés à 6 faces. P(somme=7) = 6/36 = 1/6. P(somme=12) = 1/36. P(somme=2) = 1/36.",
     "7️⃣ EXPÉRIENCE COVID : taux positivité = 5%, sensibilité du test = 80%, faux+ = 2%. Tu testes positif. P(vraiment infecté) = 0,8×0,05 / (0,8×0,05 + 0,02×0,95) = 67%.",
   ],
   quiz:[
     {q:"P(A|B) = 0,3 et P(B) = 0,4. Alors P(A∩B) =",opts:["0,12","0,75","0,7","0,1"],ans:0,exp:"P(A∩B) = P(A|B)×P(B) = 0,3×0,4 = 0,12."},
     {q:"A et B indépendants. P(A)=0,5 et P(B)=0,4. P(A∪B) =",opts:["0,9","0,2","0,7","0,3"],ans:2,exp:"Indépendants : P(A∩B)=0,5×0,4=0,2. P(A∪B)=P(A)+P(B)-P(A∩B)=0,9-0,2=0,7."},
     {q:"Sur 100 personnes : 30 fument, 20 ont cancer, 15 fument ET ont cancer. P(cancer|fume) =",opts:["0,2","0,5","0,75","0,15"],ans:1,exp:"P(C|F) = P(C∩F)/P(F) = 15/30 = 0,5. Parmi les fumeurs, 50% ont cancer."},
     {q:"Lancer de 2 dés. P(somme = 7) =",opts:["1/36","1/12","1/6","5/36"],ans:2,exp:"Issues : (1,6)(6,1)(2,5)(5,2)(3,4)(4,3) = 6 sur 36 = 1/6."},
     {q:"Pour A et B indépendants, P(A|B) =",opts:["P(B)","P(A)×P(B)","P(A)","0"],ans:2,exp:"Indépendance : la connaissance de B ne change pas P(A). Donc P(A|B) = P(A)."},
     {q:"Test : détecte 95% des malades, 5% de faux positifs. 1% de la population malade. Pos test → vraiment malade ?",opts:["≈ 95%","≈ 50%","≈ 16% (paradoxe Bayes)","100%"],ans:2,exp:"P(malade|+) ≈ 0,95×0,01 / (0,95×0,01 + 0,05×0,99) ≈ 16%. La rareté du cas + faux+ fausse l'intuition."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:"Premium"},

  {id:"lv30",titre:"Énergie Nucléaire : Fission & Fusion",matiere:"Physique",cat:"physique",
   classe:"Tle C-Tle D",ico:"☢️",color:"#AE5353",gratuit:false,plan:"Sciences",
   desc:"Radioactivité, désintégration, fission (centrales), fusion (étoiles, bombe H).",
   theorie:"⚛️ NOYAU : Z protons + N neutrons. A=Z+N (nombre de masse). Notation : ^A_Z X.\n\n☢️ RADIOACTIVITÉ :\n• α : émission ^4_2 He (noyau hélium). Z↓2, A↓4.\n• β⁻ : neutron→proton + électron. Z↑1, A=cst.\n• γ : photon haute énergie. Z et A inchangés.\n\n⏱️ DEMI-VIE T : temps après lequel 50% des noyaux ont désintégré. N(t) = N₀ × (1/2)^(t/T).\n\n💥 FISSION : noyau lourd (U-235) absorbe neutron → se brise en 2 noyaux + 2 ou 3 neutrons + énergie. Réaction en chaîne. Centrales nucléaires.\n\n☀️ FUSION : 2 noyaux légers (H) → noyau plus lourd (He) + énergie. Source du Soleil. Bombe H.",
   experience:[],
   quiz:[], verrou:true, nExp:7, nQuiz:6,
   ressource:"https://minesec-distancelearning.cm",pack:"Sciences"},

  {id:"lv31",titre:"Chimie Organique : Synthèse d'Ester",matiere:"Chimie",cat:"chimie",
   classe:"Tle C/D",ico:"⚗️",color:"#C07D4F",gratuit:true,
   desc:"Estérification, hydrolyse, parfums et arômes. Mécanismes et déplacement d'équilibre.",
   theorie:"⚗️ ESTÉRIFICATION : Acide carboxylique + Alcool ⇌ Ester + Eau.\nR-COOH + R'-OH ⇌ R-CO-O-R' + H₂O\n\n⚖️ Équilibre LIMITÉ (~67% avec un alcool primaire, 60% secondaire, 5% tertiaire). Lente.\n\n🚀 CATALYSEUR : H₂SO₄ concentré accélère SANS modifier l'équilibre.\n\n⬆️ DÉPLACER vers la droite (Le Chatelier) :\n• Excès d'un réactif (généralement alcool)\n• Élimination de l'eau formée (distillation Dean-Stark)\n\n🌸 ESTERS = PARFUMS : éthanoate d'éthyle = solvant des colles et vernis à ongles, éthanoate de pentyle = banane, butanoate d'éthyle = ananas.",
   experience:[
     "1️⃣ SYNTHÈSE BANANE : mélanger 10mL acide éthanoïque + 10mL alcool isopentylique + 2mL H₂SO₄. Chauffer 1h à reflux. Refroidir, laver à l'eau. Odeur intense de banane = éthanoate d'isopentyle.",
     "2️⃣ MONTAGE À REFLUX : ballon + colonne de Vigreux + réfrigérant à eau. La vapeur monte, condense, redescend. Évite la perte de réactifs. Sécurité : pierre ponce contre l'ébullition.",
     "3️⃣ VÉRIFICATION ÉQUILIBRE : 1 mol acide + 1 mol alcool → 0,67 mol ester + 0,33 mol acide non transformé (alcool primaire). Pour atteindre 95% : excès d'alcool (3 mol) ou retirer l'eau.",
     "4️⃣ HYDROLYSE (réaction inverse) : ester + eau (+ H+ catalyseur) → acide + alcool. Même équilibre. Saponification (avec NaOH) = hydrolyse basique → savon !",
     "5️⃣ CHROMATOGRAPHIE CCM : éluant éther/acétate. Déposer acide pur, alcool pur, ester pur, mélange réactionnel. Comparer Rf après révélation iode. Vérifier présence/absence de chaque espèce.",
     "6️⃣ NOMENCLATURE : éthanoate d'éthyle = CH₃-COO-C₂H₅. 'éthan-OATE' = acide éthanoïque. 'éthyle' = éthanol. Acétate (anc.) = éthanoate.",
     "7️⃣ APPLICATION INDUSTRIELLE : arômes alimentaires de synthèse moins chers que les naturels. Glycéride (ester de glycérol) = corps gras, savons. Polyesters = textiles (PET = bouteille plastique).",
   ],
   quiz:[
     {q:"Estérification : produits formés :",opts:["Ester + H₂","Acide + alcool","Ester + H₂O","Alcool + base"],ans:2,exp:"R-COOH + R'-OH ⇌ R-COO-R' + H₂O. Eau est un sous-produit."},
     {q:"Pour déplacer l'équilibre vers l'ester, on peut :",opts:["Augmenter T fortement","Retirer l'eau formée","Ajouter eau","Diminuer alcool"],ans:1,exp:"Le Chatelier : retirer un produit déplace vers la formation. Excès d'alcool aussi."},
     {q:"Rôle du H₂SO₄ dans estérification :",opts:["Réactif","Solvant","Catalyseur","Produit"],ans:2,exp:"H₂SO₄ catalyse la réaction (accélère sans être consommé). Ne change PAS la position de l'équilibre."},
     {q:"Rendement avec alcool PRIMAIRE :",opts:["95%","67%","100%","50%"],ans:1,exp:"~67% pour alcool primaire (RCH₂OH). Secondaire ~50%, tertiaire ~5%."},
     {q:"Éthanoate d'éthyle, formule :",opts:["CH₃CH₂OH","CH₃COOH","CH₃COO-CH₂CH₃","CH₃CHO"],ans:2,exp:"Éthanoate = CH₃-COO-, éthyle = -CH₂CH₃. Donne odeur de colle/dissolvant ongles."},
     {q:"Saponification d'un ester avec NaOH donne :",opts:["Ester + eau","Acide carboxylique + alcool","Ion carboxylate + alcool","Aldéhyde"],ans:2,exp:"Hydrolyse basique : R-COO-R' + NaOH → R-COO⁻Na⁺ (savon) + R'-OH. Irréversible."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  {id:"lv7",titre:"Carte du Cameroun : les 10 régions",matiere:"Géographie",cat:"geo",
   classe:"6ème-3ème",ico:"🗺️",color:"#D97706",gratuit:true,
   desc:"Situe les 10 régions et leurs chefs-lieux sur la vraie carte du Cameroun, explore son relief et ses fleuves, relève le défi des chefs-lieux et calcule des distances à l'échelle.",
   theorie:"🗺️ Le Cameroun (475 442 km²) s'étire du Golfe de Guinée (≈2° N) au lac Tchad (≈13° N), entre ≈8,5° E et ≈16° E.\n\n🧭 Voisins (6) : Nigeria (ouest), Tchad (nord-est), République centrafricaine (est), Congo, Gabon et Guinée équatoriale (sud).\n\n🏛 10 régions (appelées « provinces » jusqu'en 2008) et leurs chefs-lieux :\n• Adamaoua — Ngaoundéré\n• Centre — Yaoundé (capitale politique)\n• Est — Bertoua\n• Extrême-Nord — Maroua\n• Littoral — Douala (capitale économique, port)\n• Nord — Garoua\n• Nord-Ouest — Bamenda\n• Ouest — Bafoussam\n• Sud — Ebolowa\n• Sud-Ouest — Buea\n\n🏔 Point culminant : le mont Cameroun (≈4 095 m), volcan actif près de Buea.\n\n🗣 Le Nord-Ouest et le Sud-Ouest sont les deux régions anglophones.\n\n🏞 Relief : plaine côtière au sud-ouest ; hautes terres de l'Ouest (mont Oku, 3 011 m) ; plateau de l'Adamaoua (≈1 100 m), « château d'eau » du pays ; plateau sud-camerounais couvert de forêt ; plaines du Nord et monts Mandara à l'Extrême-Nord.\n\n🌊 4 bassins versants :\n• Atlantique — Sanaga (≈918 km, le plus long fleuve du pays) et ses affluents Mbam et Lom ; Wouri, Nyong\n• Congo — Dja, Boumba, Sangha\n• Niger — Bénoué\n• Lac Tchad — Logone et Chari\n\n📏 Échelle : sur une carte au 1/1 000 000, 1 cm représente 1 000 000 cm, soit 10 km. Distance réelle = distance mesurée sur la carte × dénominateur de l'échelle.",
   experience:[
     "1️⃣ OBSERVE la carte : repère le Golfe de Guinée et les 6 pays voisins. Dans quelle direction se trouve le lac Tchad ?",
     "2️⃣ CLIQUE sur chaque chef-lieu (ou sur la légende) et note sa région et ses coordonnées (latitude N, longitude E).",
     "3️⃣ COMPARE les latitudes : quel chef-lieu est le plus au nord ? le plus au sud ? Range-les du nord au sud.",
     "4️⃣ REPÈRE le mont Cameroun : près de quel chef-lieu se trouve-t-il ? Pourquoi Douala et Buea sont-ils si proches ?",
     "5️⃣ SANS LA CARTE : sur une feuille, dessine le contour du Cameroun et place de mémoire les 10 chefs-lieux. Vérifie ensuite avec le labo.",
     "6️⃣ SCÈNE « Relief et fleuves » : clique sur chaque fleuve et note son bassin versant. Pourquoi dit-on que l'Adamaoua est le « château d'eau » du Cameroun ?",
     "7️⃣ SCÈNE « Défi » : place les 10 chefs-lieux sur la carte sans étiquettes. Vise au moins 20 / 30, puis rejoue pour battre ton score.",
     "8️⃣ SCÈNE « Distances et échelle » : mesure Yaoundé → Maroua. Calcule d'abord combien de centimètres ce trajet occupe sur une carte au 1/1 000 000, puis vérifie avec le labo.",
   ],
   quiz:[
     {q:"Combien de régions compte le Cameroun ?",opts:["8","10","12","58"],ans:1,exp:"10 régions (anciennes provinces, renommées en 2008). 58 est le nombre de départements."},
     {q:"Quel est le chef-lieu de la région de l'Est ?",opts:["Ebolowa","Ngaoundéré","Bertoua","Garoua"],ans:2,exp:"Bertoua est le chef-lieu de l'Est, la plus vaste région du pays."},
     {q:"Buea est le chef-lieu de la région :",opts:["du Littoral","du Sud-Ouest","du Nord-Ouest","de l'Ouest"],ans:1,exp:"Buea, au pied du mont Cameroun, est le chef-lieu du Sud-Ouest. Douala est celui du Littoral."},
     {q:"Quel chef-lieu est situé le plus au nord ?",opts:["Garoua","Ngaoundéré","Maroua","Bamenda"],ans:2,exp:"Maroua (≈10,6° N), chef-lieu de l'Extrême-Nord, est plus au nord que Garoua (≈9,3° N)."},
     {q:"Lequel de ces pays n'est PAS voisin du Cameroun ?",opts:["Tchad","Gabon","Ghana","Congo"],ans:2,exp:"Le Ghana est en Afrique de l'Ouest. Les voisins : Nigeria, Tchad, RCA, Congo, Gabon, Guinée équatoriale."},
     {q:"Les deux régions anglophones sont :",opts:["Nord et Extrême-Nord","Nord-Ouest et Sud-Ouest","Littoral et Ouest","Centre et Sud"],ans:1,exp:"Le Nord-Ouest (Bamenda) et le Sud-Ouest (Buea) sont les régions anglophones."},
     {q:"Le plus long fleuve du Cameroun est :",opts:["le Wouri","la Sanaga","la Bénoué","le Logone"],ans:1,exp:"La Sanaga (≈918 km) traverse le pays d'est en ouest et se jette dans l'Atlantique. Ses barrages (Song Loulou, Édéa) produisent beaucoup d'électricité."},
     {q:"La Bénoué appartient au bassin :",opts:["du Congo","du lac Tchad","du Niger","de la Sanaga"],ans:2,exp:"Née dans l'Adamaoua, la Bénoué passe à Garoua puis rejoint le Niger au Nigeria."},
     {q:"Le Logone et le Chari se jettent dans :",opts:["l'océan Atlantique","le lac Tchad","le Niger","la Sanaga"],ans:1,exp:"Ils se rejoignent à N'Djamena, face à Kousséri, puis alimentent le lac Tchad."},
     {q:"Pourquoi l'Adamaoua est-il appelé « château d'eau » du Cameroun ?",opts:["C'est la région la plus pluvieuse","Plusieurs grands cours d'eau y prennent leur source","Le lac Tchad s'y trouve","Il est entièrement couvert de forêt"],ans:1,exp:"Ce plateau élevé (≈1 100 m) donne naissance à la Bénoué et à plusieurs cours d'eau du bassin de la Sanaga."},
     {q:"Sur une carte au 1/1 000 000, 20 cm représentent :",opts:["2 km","20 km","200 km","2 000 km"],ans:2,exp:"1 cm = 1 000 000 cm = 10 km, donc 20 cm = 200 km. C'est à peu près la distance Yaoundé–Douala à vol d'oiseau."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  {id:"lv32",titre:"Climat Mondial & Changement Climatique",matiere:"Géographie",cat:"geo",
   classe:"6ème-2nde A",ico:"🌍",color:"#0EA5E9",gratuit:true,
   desc:"Climats, biomes, effet de serre, réchauffement, conséquences.",
   theorie:"🌍 5 GRANDS CLIMATS :\n• Équatorial (chaud humide toute l'année — forêt) — Cameroun sud, Amazonie\n• Tropical (saisons sèche/humide — savane) — Cameroun nord, Sahel\n• Désertique (sec extrême) — Sahara, Atacama\n• Tempéré (4 saisons) — Europe, Amérique du nord\n• Polaire (froid extrême) — Arctique, Antarctique\n\n🌡️ EFFET DE SERRE : gaz (CO₂, CH₄, vapeur eau) piègent rayonnement infrarouge → réchauffement. NATUREL : +33°C sinon Terre = -18°C en moyenne.\n\n📈 CHANGEMENT CLIMATIQUE : +1,1°C depuis 1880 dû activité humaine (combustion fossiles, déforestation).\n\n⚠️ CONSÉQUENCES : fonte glaces, montée océans, sécheresses Sahel, événements extrêmes, biodiversité.",
   experience:[
     "1️⃣ MESURE LOCALE : relever T et pluies mensuelles à Yaoundé (1 an). Tracer climogramme. Identifier saisons : grande saison sèche (déc-fév), petite saison pluies (mars-mai), petite saison sèche (juin-août), grande saison pluies (sept-nov).",
     "2️⃣ COMPARAISON CLIMATS : Yaoundé (équatorial) ~25°C cst, 1600mm pluies. Maroua (tropical sahélien) 28°C, 800mm. Paris (tempéré) 12°C, 650mm. Tracer 3 climogrammes côte à côte.",
     "3️⃣ EFFET DE SERRE — MAQUETTE : 2 bouteilles plastique transparentes, une fermée, une ouverte. Mettre au soleil 30min. Mesurer T intérieure. La fermée = +5 à 10°C. Analogie atmosphère terrestre.",
     "4️⃣ COURBE CO₂ MAUNA LOA (1958-2026) : 315 ppm → 425 ppm. Augmentation continue. Causes : combustion fossiles (charbon, pétrole, gaz) + déforestation.",
     "5️⃣ FONTE DE L'ARCTIQUE : photos satellites 1980 vs 2020. Surface banquise été : -40%. Conséquence : albédo (réflexion) ↓ → réchauffement amplifié (rétroaction positive).",
     "6️⃣ CAMEROUN — LAC TCHAD : 1963 = 25 000 km². 2025 = 1 500 km² (-94%). Causes : sécheresse + irrigation excessive. Crise écologique + sécurité (Boko Haram exploite la misère).",
     "7️⃣ SOLUTIONS : transition énergétique (solaire, éolien, hydraulique), reboisement, transports communs, sobriété. Accord de Paris 2015 : limiter à +1,5°C. Aujourd'hui : on est à +1,1°C, trajectoire actuelle +2,7°C en 2100.",
   ],
   quiz:[
     {q:"Climat du sud Cameroun (Yaoundé) :",opts:["Tropical sec","Équatorial","Désertique","Méditerranéen"],ans:1,exp:"Yaoundé = équatorial : chaud (25°C cst), humide toute l'année (1600mm pluies), 2 saisons sèches courtes."},
     {q:"Principal gaz à effet de serre dû à l'homme :",opts:["O₂","CO₂","N₂","H₂"],ans:1,exp:"CO₂ = principal GES anthropique (combustion fossiles). Aussi méthane (élevage), N₂O (engrais), CFC (climatisation)."},
     {q:"Réchauffement climatique observé depuis 1880 :",opts:["+0,1°C","+1,1°C","+5°C","+10°C"],ans:1,exp:"+1,1°C en moyenne globale. Mais +2°C en Arctique. Cameroun : +1,5°C dans certaines régions."},
     {q:"Lac Tchad a perdu :",opts:["10%","50%","94%","Aucune perte"],ans:2,exp:"Surface 1963 : 25 000 km². 2025 : 1 500 km². Perte ~94% : sécheresses + sur-irrigation."},
     {q:"Sans effet de serre naturel, T moyenne Terre serait :",opts:["+15°C","0°C","-18°C","-50°C"],ans:2,exp:"Sans GES naturels, Terre = -18°C (gelée). Avec GES naturels = +15°C. Pratique pour la vie. Le problème = excès anthropique."},
     {q:"Énergie renouvelable la plus utilisée au Cameroun :",opts:["Solaire","Hydraulique","Éolienne","Géothermique"],ans:1,exp:"Cameroun = 75% hydraulique (Edéa, Songloulou, Lom Pangar). Solaire en croissance."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  {id:"lv33",titre:"Algorithmes : Tri & Complexité",matiere:"Informatique",cat:"info",
   classe:"1ère-Tle TI",ico:"💻",color:"#1E40AF",gratuit:false,plan:"Sciences",
   desc:"Tri à bulles, tri par sélection, complexité O(n²), tri rapide O(n log n). Programme TI.",
   theorie:"💻 ALGO = suite d'instructions pour résoudre un problème.\n\n📊 COMPLEXITÉ = nombre d'opérations en fonction de n.\n• O(1) : constant (accès à tableau[i])\n• O(log n) : logarithmique (recherche dichotomique)\n• O(n) : linéaire (parcours simple)\n• O(n²) : quadratique (tris naïfs)\n• O(n log n) : log-linéaire (tris efficaces)\n• O(2^n) : exponentiel (FORCE BRUTE)\n\n🔢 TRI À BULLES : compare voisins, échange si désordre. Répète. Pire cas O(n²).\n\n⚡ TRI RAPIDE (Quicksort) : choisir pivot, partitionner < et >, récursion. Moyenne O(n log n).",
   experience:[],
   quiz:[], verrou:true, nExp:7, nQuiz:6,
   ressource:"https://minesec-distancelearning.cm",pack:"Sciences"},

  // ═══ SECTION ANGLOPHONE (GCE) — labs in English ═══
  {id:"lv40",titre:"Electric Circuits Lab (GCE Physics)",matiere:"Physics",cat:"english",
   classe:"Form 3-5",ico:"🔌",color:"#0891B2",gratuit:true,
   desc:"Build series and parallel circuits. Apply Ohm's Law, measure current, voltage and power. GCE O Level Physics (0580).",
   theorie:"⚡ Ohm's Law: V = I × R (V in volts, I in amperes, R in ohms).\n\n🔴 SERIES circuit: same current everywhere. V_total = V₁ + V₂. R_total = R₁ + R₂.\n🔵 PARALLEL circuit: same voltage across branches. I_total = I₁ + I₂. 1/R_total = 1/R₁ + 1/R₂.\n\n⚙️ Power: P = VI = I²R = V²/R (watts). Energy: E = Pt (joules). 1 kWh = 3.6 × 10⁶ J.\n\nGCE tip: Paper 1 MCQs often test unit conversions and circuit reasoning — show ALL working in Paper 2.",
   experience:[
     "1️⃣ APPARATUS: 4.5 V dry cell, two lamps, connecting wires, switch, ammeter, voltmeter. Close the switch and observe the lamp light up.",
     "2️⃣ SERIES: connect two lamps one after the other. Note both are dimmer; unscrew one — the other goes off. Conclusion: one path only.",
     "3️⃣ PARALLEL: connect the lamps side by side. Each glows at full brightness; unscrew one — the other stays on.",
     "4️⃣ AMMETER: connect IN SERIES. Record the current I in amperes.",
     "5️⃣ VOLTMETER: connect IN PARALLEL across a lamp. Record V and verify V = IR.",
     "6️⃣ Calculate the power of one lamp: P = VI. Express your answer in watts to 2 significant figures.",
   ],
   quiz:[
     {q:"V = 12 V and R = 400 Ω. The current I is:",opts:["0.02 A","0.03 A","0.06 A","0.12 A"],ans:1,exp:"I = V/R = 12/400 = 0.03 A (Ohm's Law)."},
     {q:"Two 100 Ω resistors in parallel give a total resistance of:",opts:["200 Ω","100 Ω","50 Ω","25 Ω"],ans:2,exp:"For two equal resistors in parallel: R/2 = 100/2 = 50 Ω."},
     {q:"In a series circuit, the current:",opts:["splits between components","is the same everywhere","is zero","doubles at each lamp"],ans:1,exp:"Series = one single path, so the same current flows through every component."},
     {q:"A 2 kW heater runs for 3 hours. Energy used:",opts:["6 J","6 kWh","2 kWh","666 kWh"],ans:1,exp:"E = P × t = 2 kW × 3 h = 6 kWh."},
   ],
   ressource:"https://camgceb.org",pack:null},

  {id:"lv41",titre:"Titration Lab — Acids & Bases (GCE Chemistry)",matiere:"Chemistry",cat:"english",
   classe:"Form 4-5 · Lower Sixth",ico:"🧪",color:"#6C56A6",gratuit:true,
   desc:"Neutralise an acid with a base using an indicator. Calculate concentration from titre values. GCE Chemistry (0515/0715).",
   theorie:"🧪 Neutralisation: acid + base → salt + water (e.g. HCl + NaOH → NaCl + H₂O).\n\npH scale: 0-6 acidic, 7 neutral, 8-14 alkaline. Indicators: methyl orange (red→yellow), phenolphthalein (colourless→pink).\n\n📐 Titration formula: (C₁V₁)/n₁ = (C₂V₂)/n₂ where C = concentration (mol/dm³), V = volume, n = mole ratio from the balanced equation.\n\nGCE tip: always read the burette at eye level, record titres to 2 decimal places, and average only CONCORDANT results (within 0.10 cm³).",
   experience:[
     "1️⃣ APPARATUS: burette, pipette (25.0 cm³), conical flask, white tile, NaOH solution (unknown), 0.10 mol/dm³ HCl, phenolphthalein.",
     "2️⃣ Pipette 25.0 cm³ of NaOH into the flask. Add 2-3 drops of phenolphthalein → solution turns pink.",
     "3️⃣ Fill the burette with HCl. Record the initial reading (e.g. 0.00 cm³).",
     "4️⃣ Add acid slowly while swirling. Near the end-point, add DROP BY DROP until the pink JUST disappears.",
     "5️⃣ Record the final reading. Titre = final − initial. Repeat until two concordant titres.",
     "6️⃣ Calculate: moles HCl = C × V/1000, then use the 1:1 ratio to find the NaOH concentration.",
   ],
   quiz:[
     {q:"25.0 cm³ of NaOH needs 20.0 cm³ of 0.10 mol/dm³ HCl. C(NaOH) = ?",opts:["0.05 mol/dm³","0.08 mol/dm³","0.10 mol/dm³","0.125 mol/dm³"],ans:1,exp:"Moles HCl = 0.10 × 0.020 = 0.002. 1:1 ratio → C = 0.002/0.025 = 0.08 mol/dm³."},
     {q:"Phenolphthalein in alkali is:",opts:["red","colourless","pink","blue"],ans:2,exp:"Phenolphthalein: colourless in acid, pink in alkali."},
     {q:"Concordant titres must agree within:",opts:["1.0 cm³","0.5 cm³","0.10 cm³","0.01 cm³"],ans:2,exp:"GCE practical standard: titres within 0.10 cm³ are concordant and may be averaged."},
     {q:"The salt formed from HCl + NaOH is:",opts:["Na₂SO₄","NaCl","NaNO₃","Na₂CO₃"],ans:1,exp:"Hydrochloric acid gives chlorides: NaCl (common salt)."},
   ],
   ressource:"https://camgceb.org",pack:null},

  {id:"lv42",titre:"Cell Division — Mitosis & Meiosis (GCE Biology)",matiere:"Biology",cat:"english",
   classe:"Form 5 · Sixth Form",ico:"🧫",color:"#059669",gratuit:false,plan:"Complet",
   desc:"Observe the stages of mitosis and meiosis, compare both processes and link them to growth and reproduction. GCE Biology (0510/0710).",
   theorie:"🧬 MITOSIS: one division → 2 identical diploid cells (growth, repair, asexual reproduction). Stages: Prophase, Metaphase, Anaphase, Telophase (PMAT).\n\n🧬 MEIOSIS: two divisions → 4 genetically different haploid gametes (sexual reproduction). Crossing-over in Prophase I creates variation.\n\nKey comparison: mitosis keeps the chromosome number (2n→2n); meiosis halves it (2n→n).\n\nGCE tip: examiners reward correctly LABELLED diagrams and the spelling of each phase.",
   experience:[],
   quiz:[], verrou:true, nExp:5, nQuiz:4,
   ressource:"https://camgceb.org",pack:null},

  // ═══ ENSEIGNEMENT TECHNIQUE — labos pratiques ═══
  {id:"lv43",titre:"Compta OHADA : du Journal au Bilan",matiere:"Comptabilité",cat:"technique",
   classe:"2nde-Tle CG/G2 · STT",ico:"📒",color:"#B45309",gratuit:true,
   desc:"Enregistre les opérations d'une PME de Douala, monte la balance et établis le bilan OHADA. Série CG/G2, Probatoire et BAC STT.",
   theorie:"📒 PARTIE DOUBLE : tout enregistrement a un DÉBIT = un CRÉDIT.\n\nClasses de comptes OHADA : 1 capitaux ; 2 immobilisations ; 3 stocks ; 4 tiers (clients 411, fournisseurs 401) ; 5 trésorerie (521 banque, 571 caisse) ; 6 charges ; 7 produits.\n\n🧾 TVA Cameroun : 19,25 %. TVA collectée (4431) sur ventes ; TVA récupérable (4452) sur achats.\n\nChaîne comptable : pièce justificative → JOURNAL → GRAND-LIVRE → BALANCE → BILAN + COMPTE DE RÉSULTAT.\nÉquilibre du bilan : ACTIF = PASSIF, toujours.",
   experience:[
     "1️⃣ Une PME de Douala achète des marchandises à 500 000 F HT à crédit. Calcule la TVA (19,25 %) et passe l'écriture : 601 Achats (D), 4452 TVA (D), 401 Fournisseurs (C).",
     "2️⃣ Vente de marchandises 800 000 F HT, encaissée en banque. Passe l'écriture : 521 (D 954 000), 701 (C 800 000), 4431 (C 154 000).",
     "3️⃣ Paiement du loyer 150 000 F en espèces : 622 Locations (D), 571 Caisse (C).",
     "4️⃣ Reporte chaque compte au grand-livre et calcule les soldes.",
     "5️⃣ Monte la balance : total des débits = total des crédits, sinon cherche l'erreur.",
     "6️⃣ Établis le bilan simplifié OHADA et vérifie ACTIF = PASSIF.",
   ],
   quiz:[
     {q:"TVA sur un achat de 500 000 F HT (19,25 %) :",opts:["75 000 F","96 250 F","100 000 F","192 500 F"],ans:1,exp:"500 000 × 0,1925 = 96 250 F."},
     {q:"Le compte 411 enregistre :",opts:["Les fournisseurs","Les clients","La banque","Le capital"],ans:1,exp:"411 = Clients (classe 4, tiers). Les fournisseurs sont au 401."},
     {q:"Dans la partie double, tout débit a :",opts:["Un solde","Un crédit équivalent","Une TVA","Un report"],ans:1,exp:"Principe fondamental : total débits = total crédits pour chaque écriture."},
     {q:"L'équilibre du bilan s'écrit :",opts:["Charges = Produits","Actif = Passif","Débit > Crédit","Capital = Trésorerie"],ans:1,exp:"Le bilan est TOUJOURS équilibré : Actif = Passif."},
   ],
   ressource:"https://officedubac.cm",pack:null},

  {id:"lv44",titre:"Câblage Industriel : Démarrage Étoile-Triangle (F3)",matiere:"Électrotechnique",cat:"technique",
   classe:"1ère-Tle F3",ico:"⚙️",color:"#0E7490",gratuit:true,
   desc:"Câble le circuit de puissance et de commande d'un démarrage étoile-triangle d'un moteur asynchrone triphasé. Série F3, BAC industriel.",
   theorie:"⚙️ Moteur asynchrone triphasé : le démarrage direct appelle 6 à 8 × In → le démarrage ÉTOILE-TRIANGLE réduit le courant de démarrage à ~1/3.\n\nPrincipe : démarrage en ÉTOILE (chaque enroulement sous U/√3) puis passage en TRIANGLE (pleine tension) après quelques secondes.\n\nCircuit de PUISSANCE : sectionneur Q1, contacteurs KM1 (ligne), KM2 (étoile), KM3 (triangle), relais thermique F1.\nCircuit de COMMANDE : BP marche S2, BP arrêt S1, temporisateur KA1, verrouillage électrique KM2/KM3 (jamais fermés ensemble !).\n\n⚠️ Sécurité : consignation, VAT (vérification d'absence de tension), EPI obligatoires.",
   experience:[
     "1️⃣ Identifie les bornes U1-V1-W1 / U2-V2-W2 de la plaque à bornes du moteur.",
     "2️⃣ Schéma de puissance : trace Q1 → KM1 → F1 → moteur ; KM2 court-circuite U2-V2-W2 (étoile) ; KM3 relie U1-W2, V1-U2, W1-V2 (triangle).",
     "3️⃣ Schéma de commande : S1 (NC) → S2 (NO) → KM1 auto-maintenu ; KA1 temporise 5 s puis ouvre KM2 et ferme KM3.",
     "4️⃣ VERROUILLAGE : place les contacts NC de KM2 et KM3 croisés — justifie pourquoi (court-circuit sinon).",
     "5️⃣ Simule la séquence : marche → étoile 5 s → triangle. Note le courant relevé à chaque phase.",
     "6️⃣ Liste les EPI et les étapes de consignation avant toute intervention.",
   ],
   quiz:[
     {q:"Le démarrage étoile-triangle réduit le courant de démarrage à environ :",opts:["1/2","1/3","1/√3","2/3"],ans:1,exp:"En étoile, chaque enroulement reçoit U/√3 → couple et courant divisés par 3."},
     {q:"KM2 (étoile) et KM3 (triangle) ne doivent JAMAIS être fermés ensemble car :",opts:["le moteur s'arrête","cela crée un court-circuit","le thermique déclenche","la tension chute"],ans:1,exp:"Fermés ensemble = court-circuit franc entre phases → verrouillage électrique ET mécanique obligatoire."},
     {q:"Le relais thermique F1 protège contre :",opts:["les courts-circuits","les surcharges prolongées","la foudre","l'inversion de phases"],ans:1,exp:"Le thermique protège des SURCHARGES ; les courts-circuits relèvent des fusibles/disjoncteur."},
     {q:"Avant d'intervenir sur l'armoire, la 1ère étape est :",opts:["mettre les gants","la consignation + VAT","démonter le moteur","appeler le chef"],ans:1,exp:"Consignation (séparation, condamnation) puis Vérification d'Absence de Tension : la base de la sécurité électrique."},
   ],
   ressource:"https://officedubac.cm",pack:null},

  {id:"lv45",titre:"Dessin Technique : Projections Orthogonales",matiere:"Dessin Technique",cat:"technique",
   classe:"1ère-4e année · 2nde-Tle F",ico:"📐",color:"#475569",gratuit:false,plan:"Complet",
   desc:"Représente une pièce mécanique en vues de face, dessus et gauche (méthode européenne). Toutes séries industrielles, CAP et BAC technique.",
   theorie:"📐 PROJECTION ORTHOGONALE (méthode européenne, symbole du tronc de cône) : la pièce est entre l'observateur et le plan de projection.\n\nDisposition : vue de FACE (principale) ; vue de DESSUS en dessous ; vue de GAUCHE à droite.\n\nTraits normalisés : fort continu (arêtes vues) ; interrompu fin (arêtes cachées) ; mixte fin (axes) ; fin continu (cotation).\n\n✏️ COTATION : ligne d'attache, ligne de cote, flèches, valeur en mm SANS unité. Jamais de cote répétée, jamais de cote sur trait caché si évitable.",
   experience:[],
   quiz:[], verrou:true, nExp:6, nQuiz:4,
   ressource:"https://officedubac.cm",pack:null},
];

/* ── Moteur de simulation (déplacé depuis app.js) ────────────────────────
   Le catalogue et le simulateur voyagent ensemble : qui ouvre un labo a
   besoin des deux, qui ne l'ouvre pas ne paie ni l'un ni l'autre. */
/* ── Thème des simulations : sombre ou clair, au choix (12/11/2026) ─────────
   Toutes les simulations dessinent pour un fond SOMBRE (encre blanche, or).
   Deux pièges corrigés ici, pour les deux hôtes du moteur (app.js et
   apprendre/labo.html) :
   · le fond : theme-lws.css éteint tous les dégradés de la vitrine
     (#VISITOR#VISITOR * { background-image:none }) et theme-lws.js repeint
     les grands blocs sombres en gris clair. Les simulations qui ne peignent
     pas leur propre fond (lv1, lv2, lv3, lv4, lv6, lv11) devenaient du blanc
     sur gris. On pose donc un aplat EXPLICITE sur l'hôte et le canevas :
     theme-lws.js respecte un fond explicite, et la règle CSS ne touche que
     les dégradés.
   · le choix : le thème CLAIR inverse l'hôte entier (invert + hue-rotate
     180°) — le fond devient clair, l'encre foncée, et les teintes restent
     reconnaissables. Une seule règle, valable pour les 31 simulations, sans
     réécrire leurs dessins.
   Par défaut : le thème du site (clair, sauf <html data-theme="dark">) ; le
   choix de l'élève est mémorisé dans ce navigateur. */
var _LABO_THEME_CLE='vrt_labo_theme';
function _laboTheme(){
  try{var v=localStorage.getItem(_LABO_THEME_CLE);if(v==='clair'||v==='sombre')return v;}catch(e){}
  return document.documentElement.getAttribute('data-theme')==='dark'?'sombre':'clair';
}
function _laboAppliquerTheme(cnv){
  if(!cnv)return;
  var hote=cnv.parentElement||cnv, clair=_laboTheme()==='clair';
  cnv.style.backgroundColor='#0F172A';
  hote.style.backgroundColor='#0F172A';
  hote.style.filter=clair?'invert(1) hue-rotate(180deg)':'';
  hote.setAttribute('data-labo-theme',clair?'clair':'sombre');
  // Bouton à côté de Pause / Recommencer, au style de l'hôte
  var play=document.getElementById('simPlayBtn'), b=document.getElementById('simThemeBtn');
  if(play&&play.parentElement&&!b){
    b=document.createElement('button');b.type='button';b.id='simThemeBtn';
    b.className=play.className;b.style.cssText=play.style.cssText;
    b.onclick=function(){
      try{localStorage.setItem(_LABO_THEME_CLE,_laboTheme()==='clair'?'sombre':'clair');}catch(e){}
      _laboAppliquerTheme(document.getElementById('laboCnv'));
    };
    play.parentElement.appendChild(b);
  }
  if(b){
    b.textContent=clair?'Thème sombre':'Thème clair';
    b.setAttribute('aria-label',clair?'Passer la simulation en thème sombre':'Passer la simulation en thème clair');
    b.title=b.getAttribute('aria-label');
  }
}
window._laboTheme=_laboTheme;window._laboAppliquerTheme=_laboAppliquerTheme;

function _initLaboSim(lv){
  cancelAnimationFrame(window._sim.raf);
  window._sim={running:true,raf:0,t:0,params:{},defaults:{}};
  var cnv=document.getElementById('laboCnv');
  if(!cnv) return;
  _laboAppliquerTheme(cnv);
  var ctx=cnv.getContext('2d');
  if(!ctx){console.warn('[VÉRITAS labo] Canvas 2D unavailable for '+lv.id);window._sim.running=false;return;}
  var W=cnv.width, H=cnv.height;
  var vals=document.getElementById('simValues');
  var cw=document.getElementById('simControls');

  function setVal(html){if(vals)vals.innerHTML=html;}
  function setCtrl(html){if(cw)cw.innerHTML=html;}

  // ── PHYSIQUE : Circuit Électrique (lv1) ──
  if(lv.id==="lv1"){
    var P=window._sim.params={U:6,R1:100,R2:100,mode:'serie'};
    window._sim.defaults={U:6,R1:100,R2:100,mode:'serie'};
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      return "<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>⚡ Tension (V): <input type='range' min='1' max='24' value='"+p.U+"' oninput='window._sim.params.U=+this.value' style='width:90px'><span id='slU'>"+p.U+"V</span></label>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>R1 (Ω): <input type='range' min='10' max='500' step='10' value='"+p.R1+"' oninput='window._sim.params.R1=+this.value' style='width:90px'><span>"+p.R1+"Ω</span></label>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>R2 (Ω): <input type='range' min='10' max='500' step='10' value='"+p.R2+"' oninput='window._sim.params.R2=+this.value' style='width:90px'><span>"+p.R2+"Ω</span></label>"
        +"<button onclick=\"window._sim.params.mode=window._sim.params.mode==='serie'?'parallele':'serie'\" style='background:#142554;color:#FFC93C;border:none;border-radius:10px;padding:6px 14px;font-size:11px;font-weight:700;cursor:pointer'>Mode: "+(window._sim.params.mode==='serie'?'Série':'Parallèle')+"</button>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var p=window._sim.params;var t=window._sim.t;
      ctx.clearRect(0,0,W,H);
      // Background grid
      ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=1;
      for(var gx=0;gx<W;gx+=20){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke();}
      for(var gy=0;gy<H;gy+=20){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke();}

      var isSerie=p.mode==='serie';
      var Req=isSerie?(p.R1+p.R2):(p.R1*p.R2)/(p.R1+p.R2);
      var I=p.U/Req;
      var I1=isSerie?I:p.U/p.R1;
      var I2=isSerie?I:p.U/p.R2;

      // Batterie
      ctx.fillStyle='#FFC93C';ctx.strokeStyle='#FFC93C';ctx.lineWidth=3;
      ctx.fillRect(40,130,50,80);ctx.fillStyle='#0F172A';ctx.font='bold 14px Montserrat';ctx.textAlign='center';
      ctx.fillText(p.U+'V',65,175);
      // + / -
      ctx.fillStyle='#fff';ctx.font='bold 18px monospace';ctx.fillText('+',65,148);ctx.fillText('−',65,200);

      // Wires
      ctx.strokeStyle='#87A9D3';ctx.lineWidth=2.5;ctx.setLineDash([]);
      if(isSerie){
        // Série: bat → R1 → R2 → bat
        ctx.beginPath();ctx.moveTo(90,145);ctx.lineTo(200,145);ctx.stroke();
        ctx.beginPath();ctx.moveTo(280,145);ctx.lineTo(400,145);ctx.stroke();
        ctx.beginPath();ctx.moveTo(480,145);ctx.lineTo(580,145);ctx.lineTo(580,195);ctx.lineTo(480,195);ctx.stroke();
        ctx.beginPath();ctx.moveTo(400,195);ctx.lineTo(200,195);ctx.lineTo(200,195);ctx.stroke();
        ctx.beginPath();ctx.moveTo(200,195);ctx.lineTo(90,195);ctx.stroke();
        // R1 box
        ctx.fillStyle=lv.color;ctx.fillRect(200,125,80,40);
        ctx.fillStyle='#fff';ctx.font='bold 13px Fira Code';ctx.textAlign='center';
        ctx.fillText('R1='+p.R1+'Ω',240,150);
        // R2 box
        ctx.fillStyle='#6C56A6';ctx.fillRect(400,125,80,40);
        ctx.fillStyle='#fff';ctx.fillText('R2='+p.R2+'Ω',440,150);
        // Ammeter
        ctx.beginPath();ctx.arc(340,195,16,0,Math.PI*2);ctx.fillStyle='#D1FAE5';ctx.fill();ctx.strokeStyle='#059669';ctx.lineWidth=2;ctx.stroke();
        ctx.fillStyle='#059669';ctx.font='bold 10px Fira Code';ctx.fillText('A',340,199);
        ctx.beginPath();ctx.moveTo(280,195);ctx.lineTo(324,195);ctx.strokeStyle='#87A9D3';ctx.lineWidth=2.5;ctx.stroke();
        ctx.beginPath();ctx.moveTo(356,195);ctx.lineTo(400,195);ctx.stroke();
      } else {
        // Parallèle
        ctx.beginPath();ctx.moveTo(90,145);ctx.lineTo(180,145);ctx.stroke();
        ctx.beginPath();ctx.moveTo(180,145);ctx.lineTo(180,110);ctx.lineTo(350,110);ctx.stroke();
        ctx.beginPath();ctx.moveTo(180,145);ctx.lineTo(180,220);ctx.lineTo(350,220);ctx.stroke();
        ctx.beginPath();ctx.moveTo(430,110);ctx.lineTo(520,110);ctx.lineTo(520,170);ctx.stroke();
        ctx.beginPath();ctx.moveTo(430,220);ctx.lineTo(520,220);ctx.lineTo(520,170);ctx.stroke();
        ctx.beginPath();ctx.moveTo(520,170);ctx.lineTo(580,170);ctx.lineTo(580,195);ctx.lineTo(90,195);ctx.stroke();
        // R1 top
        ctx.fillStyle=lv.color;ctx.fillRect(350,90,80,40);
        ctx.fillStyle='#fff';ctx.font='bold 12px Fira Code';ctx.fillText('R1='+p.R1+'Ω',390,115);
        // R2 bottom
        ctx.fillStyle='#6C56A6';ctx.fillRect(350,200,80,40);
        ctx.fillStyle='#fff';ctx.fillText('R2='+p.R2+'Ω',390,225);
      }

      // Electrons animés
      var speed=I*800;
      ctx.fillStyle='#FFC93C';
      for(var ei=0;ei<12;ei++){
        var phase=(t*speed*0.01+ei*57)%680;
        var ex,ey;
        if(isSerie){
          if(phase<200){ex=90+phase;ey=145;}
          else if(phase<400){ex=480-(phase-200);ey=195;}
          else{ex=280;ey=145+((phase-400)/280)*50;}
        } else {
          ex=90+(phase%490);ey=ei%2===0?110:220;
        }
        ctx.beginPath();ctx.arc(ex,ey,3+Math.sin(t*4+ei)*1,0,Math.PI*2);ctx.fill();
      }

      // Values display
      setVal(
        "<span>⚡ U="+p.U+"V</span>"
        +"<span>📏 R<sub>eq</sub>="+Req.toFixed(1)+"Ω</span>"
        +"<span>🔋 I<sub>total</sub>="+(I*1000).toFixed(1)+"mA</span>"
        +(isSerie?"":"<span>I₁="+(I1*1000).toFixed(1)+"mA</span><span>I₂="+(I2*1000).toFixed(1)+"mA</span>")
        +"<span>💡 P="+(p.U*I).toFixed(2)+"W</span>"
      );
      _simUpdateControls();
    };

  // ── PHYSIQUE : Forces et Mouvement (lv2) ──
  } else if(lv.id==="lv2"){
    var P=window._sim.params={mass:2,force:10,friction:0.3,vx:0,x:60};
    window._sim.defaults={mass:2,force:10,friction:0.3,vx:0,x:60};
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      return "<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>Masse (kg): <input type='range' min='0.5' max='10' step='0.5' value='"+p.mass+"' oninput='window._sim.params.mass=+this.value' style='width:80px'><span>"+p.mass+"kg</span></label>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>Force (N): <input type='range' min='0' max='50' step='1' value='"+p.force+"' oninput='window._sim.params.force=+this.value' style='width:80px'><span>"+p.force+"N</span></label>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>Frottement: <input type='range' min='0' max='1' step='0.05' value='"+p.friction+"' oninput='window._sim.params.friction=+this.value' style='width:80px'><span>"+p.friction+"</span></label>"
        +"<button onclick='window._sim.params.vx=0;window._sim.params.x=60' style='background:#142554;color:#FFC93C;border:none;border-radius:10px;padding:6px 14px;font-size:11px;font-weight:700;cursor:pointer'>⏹ Stop</button>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var p=window._sim.params;
      ctx.clearRect(0,0,W,H);
      // Ground
      ctx.fillStyle='#1E3A5F';ctx.fillRect(0,240,W,100);
      ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=1;
      for(var gx=0;gx<W;gx+=30){ctx.beginPath();ctx.moveTo(gx,240);ctx.lineTo(gx-15,280);ctx.stroke();}
      // Physics
      var a=(p.force-p.friction*p.mass*9.81)/p.mass;
      if(a<0&&p.vx<=0){a=0;p.vx=0;}
      p.vx+=a*0.016;if(p.vx<0)p.vx=0;
      p.x+=p.vx*2;
      if(p.x>W-60)p.x=60;
      // Object (box)
      var bx=p.x,by=190;
      ctx.fillStyle=lv.color;ctx.beginPath();
      ctx.roundRect(bx,by,50,50,8);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='bold 12px Fira Code';ctx.textAlign='center';
      ctx.fillText(p.mass+'kg',bx+25,by+30);
      // Force arrow
      if(p.force>0){
        var arrowLen=p.force*2;
        ctx.strokeStyle='#FFC93C';ctx.lineWidth=3;
        ctx.beginPath();ctx.moveTo(bx+50,by+25);ctx.lineTo(bx+50+arrowLen,by+25);ctx.stroke();
        ctx.beginPath();ctx.moveTo(bx+50+arrowLen,by+25);ctx.lineTo(bx+40+arrowLen,by+18);ctx.lineTo(bx+40+arrowLen,by+32);ctx.closePath();ctx.fillStyle='#FFC93C';ctx.fill();
        ctx.fillStyle='#FFC93C';ctx.font='bold 11px Montserrat';ctx.fillText('F='+p.force+'N',bx+50+arrowLen/2,by+12);
      }
      // Friction arrow
      if(p.vx>0.1){
        var fLen=p.friction*p.mass*9.81*2;
        ctx.strokeStyle='#D58E8E';ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(bx,by+25);ctx.lineTo(bx-fLen,by+25);ctx.stroke();
        ctx.fillStyle='#D58E8E';ctx.font='10px Montserrat';ctx.fillText('f',bx-fLen/2,by+40);
      }
      // Weight arrow
      ctx.strokeStyle='#87A9D3';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(bx+25,by+50);ctx.lineTo(bx+25,by+50+p.mass*5);ctx.stroke();
      ctx.fillStyle='#87A9D3';ctx.font='10px Montserrat';ctx.fillText('P='+(p.mass*9.81).toFixed(1)+'N',bx+35,by+60+p.mass*3);
      // Velocity indicator
      ctx.fillStyle='#fff';ctx.font='12px Fira Code';ctx.textAlign='left';
      ctx.fillText('v = '+p.vx.toFixed(2)+' m/s',20,30);
      ctx.fillText('a = '+a.toFixed(2)+' m/s²',20,50);
      setVal("<span>🚀 v="+p.vx.toFixed(2)+" m/s</span><span>📐 a="+a.toFixed(2)+" m/s²</span><span>⚖ P="+(p.mass*9.81).toFixed(1)+"N</span><span>💥 F="+p.force+"N</span><span>🔄 f="+(p.friction*p.mass*9.81).toFixed(1)+"N</span>");
      _simUpdateControls();
    };

  // ── CHIMIE : Réactions Acido-Basiques (lv3) ──
  } else if(lv.id==="lv3"){
    var P=window._sim.params={acidVol:50,baseVol:0,acidConc:0.1,baseConc:0.1};
    window._sim.defaults={acidVol:50,baseVol:0,acidConc:0.1,baseConc:0.1};
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      return "<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>Base ajoutée (mL): <input type='range' min='0' max='100' step='1' value='"+p.baseVol+"' oninput='window._sim.params.baseVol=+this.value' style='width:100px'><span>"+p.baseVol+"mL</span></label>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>[Acide]: <input type='range' min='0.01' max='1' step='0.01' value='"+p.acidConc+"' oninput='window._sim.params.acidConc=+this.value' style='width:80px'><span>"+p.acidConc+"M</span></label>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>[Base]: <input type='range' min='0.01' max='1' step='0.01' value='"+p.baseConc+"' oninput='window._sim.params.baseConc=+this.value' style='width:80px'><span>"+p.baseConc+"M</span></label>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var p=window._sim.params;var t=window._sim.t;
      ctx.clearRect(0,0,W,H);
      // pH calculation
      var nAcid=p.acidVol*p.acidConc/1000;
      var nBase=p.baseVol*p.baseConc/1000;
      var vTotal=(p.acidVol+p.baseVol)/1000;
      var pH;
      if(nBase<nAcid){var excess=(nAcid-nBase)/vTotal;pH=-Math.log10(Math.max(excess,1e-14));}
      else if(nBase>nAcid){var excess=(nBase-nAcid)/vTotal;pH=14+Math.log10(Math.max(excess,1e-14));}
      else{pH=7;}
      pH=Math.max(0,Math.min(14,pH));
      // Solution color
      var r,g,b2;
      if(pH<4){r=220;g=38+pH*15;b2=38;}
      else if(pH<7){r=220-((pH-4)/3)*180;g=130;b2=38+((pH-4)/3)*80;}
      else if(pH<10){r=40;g=130+((pH-7)/3)*50;b2=118+((pH-7)/3)*120;}
      else{r=40+((pH-10)/4)*80;g=80;b2=238;}
      // Beaker
      var bx=220,by=60,bw=240,bh=220;
      ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx,by+bh);ctx.lineTo(bx+bw,by+bh);ctx.lineTo(bx+bw,by);ctx.stroke();
      // Liquid
      var fillH=bh*(p.acidVol+p.baseVol)/150;
      var grad=ctx.createLinearGradient(bx,by+bh-fillH,bx,by+bh);
      grad.addColorStop(0,'rgba('+r+','+g+','+b2+',0.6)');
      grad.addColorStop(1,'rgba('+r+','+g+','+b2+',0.9)');
      ctx.fillStyle=grad;
      ctx.fillRect(bx+3,by+bh-fillH,bw-6,fillH-3);
      // Bubbles
      if(Math.abs(nBase-nAcid)<nAcid*0.3 && p.baseVol>5){
        for(var bi=0;bi<8;bi++){
          var bub_x=bx+30+Math.sin(t*2+bi*1.3)*(bw-60)*0.4+bw*0.3;
          var bub_y=by+bh-20-((t*40+bi*30)%fillH);
          ctx.beginPath();ctx.arc(bub_x,bub_y,2+Math.sin(t*3+bi)*1.5,0,Math.PI*2);
          ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fill();
        }
      }
      // Burette
      ctx.fillStyle='rgba(255,255,255,.15)';ctx.fillRect(bx+bw/2-8,10,16,by-10);
      ctx.fillStyle='rgba(100,180,255,.5)';
      var buretteLevel=(100-p.baseVol)/100*(by-20);
      ctx.fillRect(bx+bw/2-5,10+(by-20)-buretteLevel,10,buretteLevel);
      // Drops
      if(p.baseVol>0){
        var dropY=(t*120)%(by-10);
        ctx.beginPath();ctx.arc(bx+bw/2,by-10+dropY*0.3,3,0,Math.PI*2);
        ctx.fillStyle='rgba(100,180,255,.7)';ctx.fill();
      }
      // pH scale
      for(var si=0;si<=14;si++){
        var sx=30+si*12;
        var sc;
        if(si<4)sc='rgb(220,'+(38+si*15)+',38)';
        else if(si<7)sc='rgb('+(220-((si-4)/3)*180)+',130,'+(38+((si-4)/3)*80)+')';
        else if(si<10)sc='rgb(40,'+(130+((si-7)/3)*50)+','+(118+((si-7)/3)*120)+')';
        else sc='rgb('+(40+((si-10)/4)*80)+',80,238)';
        ctx.fillStyle=sc;ctx.fillRect(sx,300,12,20);
        ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='8px Fira Code';ctx.textAlign='center';ctx.fillText(si,sx+6,315);
      }
      // pH indicator arrow
      var phX=30+pH*12+6;
      ctx.fillStyle='#FFC93C';ctx.beginPath();ctx.moveTo(phX,296);ctx.lineTo(phX-5,288);ctx.lineTo(phX+5,288);ctx.closePath();ctx.fill();
      // pH big display
      ctx.fillStyle='#fff';ctx.font='bold 28px Montserrat';ctx.textAlign='right';
      ctx.fillText('pH = '+pH.toFixed(1),W-40,100);
      ctx.font='14px Georgia';ctx.fillStyle='rgba(255,255,255,.6)';
      ctx.fillText(pH<6.5?'ACIDE':pH>7.5?'BASIQUE':'≈ NEUTRE',W-40,125);
      setVal("<span>🧪 pH="+pH.toFixed(2)+"</span><span>🔴 n(H⁺)="+(nAcid*1000).toFixed(2)+"mmol</span><span>🔵 n(OH⁻)="+(nBase*1000).toFixed(2)+"mmol</span><span>💧 V<sub>total</sub>="+(p.acidVol+p.baseVol)+"mL</span>");
      _simUpdateControls();
    };

  // ── SVT : Cellule Végétale (lv4) ──
  } else if(lv.id==="lv4"){
    window._sim.params={zoom:1,showLabels:true};
    window._sim.defaults={zoom:1,showLabels:true};
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      return "<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>🔍 Zoom: <input type='range' min='0.6' max='2' step='0.1' value='"+p.zoom+"' oninput='window._sim.params.zoom=+this.value' style='width:90px'><span>×"+p.zoom.toFixed(1)+"</span></label>"
        +"<button onclick=\"window._sim.params.showLabels=!window._sim.params.showLabels\" style='background:#142554;color:#FFC93C;border:none;border-radius:10px;padding:6px 14px;font-size:11px;font-weight:700;cursor:pointer'>"+(p.showLabels?'Masquer':'Afficher')+" légendes</button>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var p=window._sim.params;var t=window._sim.t;var z=p.zoom;
      ctx.clearRect(0,0,W,H);
      ctx.save();ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.translate(-W/2,-H/2);
      var cx=W/2,cy=H/2;
      // Cell wall
      ctx.strokeStyle='#059669';ctx.lineWidth=6;ctx.setLineDash([]);
      ctx.beginPath();ctx.roundRect(cx-180,cy-120,360,240,20);ctx.stroke();
      // Cell membrane
      ctx.strokeStyle='#5CAB8E';ctx.lineWidth=2;ctx.setLineDash([6,4]);
      ctx.beginPath();ctx.roundRect(cx-170,cy-110,340,220,16);ctx.stroke();ctx.setLineDash([]);
      // Cytoplasm
      ctx.fillStyle='rgba(209,250,229,0.25)';ctx.beginPath();ctx.roundRect(cx-170,cy-110,340,220,16);ctx.fill();
      // Vacuole (big, pulsing)
      var vr=60+Math.sin(t*0.8)*4;
      ctx.beginPath();ctx.ellipse(cx+20,cy,vr,vr*0.8,0,0,Math.PI*2);
      ctx.fillStyle='rgba(147,197,253,0.35)';ctx.fill();ctx.strokeStyle='#93C5FD';ctx.lineWidth=2;ctx.stroke();
      // Nucleus
      var nx=cx-60,ny=cy-10;
      ctx.beginPath();ctx.ellipse(nx,ny,38,30,0,0,Math.PI*2);
      ctx.fillStyle='rgba(124,58,237,0.25)';ctx.fill();ctx.strokeStyle='#6C56A6';ctx.lineWidth=2;ctx.stroke();
      // Nucleolus
      ctx.beginPath();ctx.arc(nx+5,ny-3,10,0,Math.PI*2);ctx.fillStyle='rgba(124,58,237,0.5)';ctx.fill();
      // Chloroplasts (orbiting)
      for(var ci=0;ci<7;ci++){
        var ca=t*0.3+ci*Math.PI*2/7;
        var crx=cx+Math.cos(ca)*130,cry=cy+Math.sin(ca)*80;
        ctx.beginPath();ctx.ellipse(crx,cry,14,8,ca,0,Math.PI*2);
        ctx.fillStyle='#059669';ctx.fill();
        // Thylakoids
        ctx.strokeStyle='#047857';ctx.lineWidth=1;
        for(var ti=0;ti<3;ti++){
          ctx.beginPath();ctx.ellipse(crx,cry,10-ti*3,5-ti*1.5,ca,0,Math.PI*2);ctx.stroke();
        }
      }
      // Mitochondria
      for(var mi=0;mi<3;mi++){
        var ma=t*0.5+mi*2.1+1;
        var mx=cx+Math.cos(ma)*90,my=cy+Math.sin(ma)*55;
        ctx.beginPath();ctx.ellipse(mx,my,16,8,ma*0.5,0,Math.PI*2);
        ctx.fillStyle='rgba(239,68,68,0.4)';ctx.fill();ctx.strokeStyle='#C46F6F';ctx.lineWidth=1.5;ctx.stroke();
        // Cristae
        ctx.strokeStyle='rgba(239,68,68,0.5)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(mx-8,my);ctx.quadraticCurveTo(mx,my-6,mx+8,my);ctx.stroke();
      }
      // ER (endoplasmic reticulum)
      ctx.strokeStyle='rgba(251,191,36,0.4)';ctx.lineWidth=1.5;
      ctx.beginPath();
      for(var ei=0;ei<30;ei++){
        var ex=cx-120+ei*8,ey=cy+60+Math.sin(t*0.6+ei*0.4)*12;
        if(ei===0)ctx.moveTo(ex,ey);else ctx.lineTo(ex,ey);
      }
      ctx.stroke();
      // Labels
      if(p.showLabels){
        ctx.font='bold 11px Montserrat';ctx.textAlign='left';
        var labels=[
          [cx+190,cy-100,'Paroi cellulaire','#059669'],
          [cx+190,cy-75,'Membrane plasmique','#5CAB8E'],
          [cx+80,cy,'Vacuole','#6A8DC7'],
          [nx+45,ny-20,'Noyau','#6C56A6'],
          [nx+45,ny+5,'Nucléole','#6C56A6'],
          [cx+150,cy+60,'Chloroplaste','#059669'],
          [cx-160,cy+70,'Mitochondrie','#C46F6F'],
          [cx-140,cy+95,'Réticulum endoplasmique','#F59E0B'],
        ];
        labels.forEach(function(lb){
          ctx.fillStyle=lb[3];ctx.fillText(lb[2],lb[0],lb[1]);
          ctx.beginPath();ctx.arc(lb[0]-5,lb[1]-4,2,0,Math.PI*2);ctx.fill();
        });
      }
      ctx.restore();
      setVal("<span>🔬 Cellule végétale</span><span>🟢 Paroi + Chloroplastes + Vacuole</span><span>🔄 Zoom ×"+z.toFixed(1)+"</span>");
    };

  // ── MATHS : Volumes & Solides (lv5/lv6) ──
  } else if(lv.id==="lv5"){
    // ── SVT : Photosynthèse / Nutrition des plantes (lv5) ──
    window._sim.params={lumiere:80,co2:50,eau:60};
    window._sim.defaults={lumiere:80,co2:50,eau:60};
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      return "<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>☀️ Lumière (%): <input type='range' min='0' max='100' value='"+p.lumiere+"' oninput='window._sim.params.lumiere=+this.value' style='width:90px'><span>"+p.lumiere+"%</span></label>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>🌫️ CO₂ (%): <input type='range' min='0' max='100' value='"+p.co2+"' oninput='window._sim.params.co2=+this.value' style='width:90px'><span>"+p.co2+"%</span></label>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>💧 Eau (%): <input type='range' min='0' max='100' value='"+p.eau+"' oninput='window._sim.params.eau=+this.value' style='width:90px'><span>"+p.eau+"%</span></label>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var p=window._sim.params;var t=window._sim.t;
      ctx.clearRect(0,0,W,H);
      // Ciel dégradé selon lumière
      var skyTop='rgba('+(15+p.lumiere*0.5)+','+(30+p.lumiere*1.2)+','+(60+p.lumiere*1.5)+',1)';
      var skyBot='rgba('+(40+p.lumiere)+','+(80+p.lumiere*1.3)+','+(120+p.lumiere*1)+',1)';
      var grad=ctx.createLinearGradient(0,0,0,H*0.7);
      grad.addColorStop(0,skyTop);grad.addColorStop(1,skyBot);
      ctx.fillStyle=grad;ctx.fillRect(0,0,W,H*0.7);
      // Sol
      ctx.fillStyle='#5C3A1E';ctx.fillRect(0,H*0.7,W,H*0.3);
      ctx.fillStyle='#3E2614';ctx.fillRect(0,H*0.7,W,8);
      // Soleil (taille selon lumière)
      var sunR=8+p.lumiere*0.3;
      var sgrad=ctx.createRadialGradient(W-80,60,sunR*0.3,W-80,60,sunR*1.8);
      sgrad.addColorStop(0,'rgba(255,243,107,1)');sgrad.addColorStop(0.6,'rgba(255,201,60,'+(p.lumiere/120)+')');sgrad.addColorStop(1,'rgba(255,201,60,0)');
      ctx.fillStyle=sgrad;ctx.beginPath();ctx.arc(W-80,60,sunR*1.8,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,243,107,'+(0.4+p.lumiere/200)+')';ctx.beginPath();ctx.arc(W-80,60,sunR,0,Math.PI*2);ctx.fill();
      // Rayons solaires animés
      if(p.lumiere>20){
        ctx.strokeStyle='rgba(255,243,107,'+(p.lumiere/300)+')';ctx.lineWidth=2;
        for(var ri=0;ri<8;ri++){
          var ra=(t*0.3+ri*Math.PI/4)%(Math.PI*2);
          var rl=sunR+15+Math.sin(t*2+ri)*5;
          ctx.beginPath();ctx.moveTo(W-80+Math.cos(ra)*sunR*1.2,60+Math.sin(ra)*sunR*1.2);
          ctx.lineTo(W-80+Math.cos(ra)*(sunR+rl),60+Math.sin(ra)*(sunR+rl));ctx.stroke();
        }
      }
      // Plante (tige + feuilles, vigueur selon facteurs)
      var vigueur=Math.min(p.lumiere,p.co2,p.eau)/100;
      var plantH=80+vigueur*120;
      var px=W/2;var py=H*0.7;
      // Tige
      ctx.strokeStyle='#16A34A';ctx.lineWidth=4+vigueur*3;
      ctx.beginPath();ctx.moveTo(px,py);ctx.bezierCurveTo(px-5,py-plantH/3,px+5,py-plantH*2/3,px,py-plantH);ctx.stroke();
      // Feuilles
      var nbFeuilles=Math.floor(2+vigueur*5);
      for(var fi=0;fi<nbFeuilles;fi++){
        var fy=py-(fi+1)*(plantH/(nbFeuilles+1));
        var fSide=fi%2===0?-1:1;
        var fSize=20+vigueur*15;
        var sway=Math.sin(t+fi)*3;
        ctx.fillStyle='rgba(34,'+(150+vigueur*60)+',60,'+(0.7+vigueur*0.3)+')';
        ctx.beginPath();
        ctx.ellipse(px+fSide*fSize*0.6+sway,fy,fSize,fSize*0.5,fSide*0.4,0,Math.PI*2);
        ctx.fill();
        ctx.strokeStyle='#15803D';ctx.lineWidth=1.5;ctx.stroke();
      }
      // Racines
      ctx.strokeStyle='#7C2D12';ctx.lineWidth=2;
      for(var rk=0;rk<5;rk++){
        var ra2=Math.PI+rk*0.3-0.6;
        ctx.beginPath();ctx.moveTo(px,py);
        ctx.lineTo(px+Math.cos(ra2)*30,py+Math.abs(Math.sin(ra2))*30);ctx.stroke();
      }
      // Molécules CO2 entrantes (animées vers les feuilles)
      if(p.co2>10){
        ctx.fillStyle='rgba(150,150,150,'+(p.co2/120)+')';ctx.font='bold 11px Fira Code';
        for(var ci=0;ci<Math.floor(p.co2/20);ci++){
          var phase=(t*30+ci*80)%200;
          ctx.fillText('CO₂',60+phase,80+ci*30);
        }
      }
      // Molécules H2O remontant les racines
      if(p.eau>10){
        ctx.fillStyle='rgba(96,165,250,'+(p.eau/120)+')';
        for(var wi=0;wi<Math.floor(p.eau/15);wi++){
          var wph=(t*20+wi*30)%50;
          ctx.beginPath();ctx.arc(px-25+wi*8,py+30-wph,3,0,Math.PI*2);ctx.fill();
        }
      }
      // Molécules O2 sortantes (produit de la photosynthèse)
      if(vigueur>0.3){
        ctx.fillStyle='rgba(34,197,94,'+vigueur+')';ctx.font='bold 11px Fira Code';
        for(var oi=0;oi<Math.floor(vigueur*5);oi++){
          var oph=(t*25+oi*60)%150;
          ctx.fillText('O₂',px+30+oph,py-plantH/2-oph*0.5);
        }
      }
      // Équation
      ctx.fillStyle='rgba(255,255,255,.85)';ctx.font='bold 13px Fira Code';ctx.textAlign='left';
      ctx.fillText('6 CO₂ + 6 H₂O ──[lumière]──▶ C₆H₁₂O₆ + 6 O₂',16,H-20);
      var croissance=Math.round(vigueur*100);
      setVal("<span>☀️ "+p.lumiere+"%</span><span>🌫️ CO₂ "+p.co2+"%</span><span>💧 "+p.eau+"%</span><span>🌱 Croissance: "+croissance+"%</span><span>"+(croissance>70?'✅ Photosynthèse optimale':croissance>30?'🟡 Photosynthèse partielle':'❌ Photosynthèse insuffisante')+"</span>");
      _simUpdateControls();
    };

  } else if(lv.id==="lv6"){
    window._sim.params={shape:'cube',size:4};
    window._sim.defaults={shape:'cube',size:4};
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      return "<button onclick=\"window._sim.params.shape='cube'\" style='background:"+(p.shape==='cube'?'#142554':'#F0F4FF')+";color:"+(p.shape==='cube'?'#FFC93C':'#142554')+";border:none;border-radius:10px;padding:6px 14px;font-size:11px;font-weight:700;cursor:pointer'>Cube</button>"
        +"<button onclick=\"window._sim.params.shape='sphere'\" style='background:"+(p.shape==='sphere'?'#142554':'#F0F4FF')+";color:"+(p.shape==='sphere'?'#FFC93C':'#142554')+";border:none;border-radius:10px;padding:6px 14px;font-size:11px;font-weight:700;cursor:pointer'>Sphère</button>"
        +"<button onclick=\"window._sim.params.shape='cylinder'\" style='background:"+(p.shape==='cylinder'?'#142554':'#F0F4FF')+";color:"+(p.shape==='cylinder'?'#FFC93C':'#142554')+";border:none;border-radius:10px;padding:6px 14px;font-size:11px;font-weight:700;cursor:pointer'>Cylindre</button>"
        +"<button onclick=\"window._sim.params.shape='cone'\" style='background:"+(p.shape==='cone'?'#142554':'#F0F4FF')+";color:"+(p.shape==='cone'?'#FFC93C':'#142554')+";border:none;border-radius:10px;padding:6px 14px;font-size:11px;font-weight:700;cursor:pointer'>Cône</button>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>Taille: <input type='range' min='1' max='8' step='0.5' value='"+p.size+"' oninput='window._sim.params.size=+this.value' style='width:90px'><span>"+p.size+"</span></label>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var p=window._sim.params;var t=window._sim.t;
      ctx.clearRect(0,0,W,H);
      var cx=W/2,cy=H/2-20,s=p.size*25;
      var rot=t*0.5;
      ctx.save();ctx.translate(cx,cy);
      if(p.shape==='cube'){
        var c=Math.cos(rot),sn=Math.sin(rot);
        var pts=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
        pts=pts.map(function(v){
          var x2=v[0]*c-v[2]*sn,z2=v[0]*sn+v[2]*c;
          return[(x2)*s,(v[1]*Math.cos(0.4)-z2*Math.sin(0.4))*s];
        });
        var faces=[[0,1,2,3,'rgba(8,145,178,0.6)'],[4,5,6,7,'rgba(8,145,178,0.3)'],[0,1,5,4,'rgba(59,130,246,0.5)'],[2,3,7,6,'rgba(59,130,246,0.3)'],[0,3,7,4,'rgba(124,58,237,0.4)'],[1,2,6,5,'rgba(124,58,237,0.25)']];
        faces.forEach(function(f){
          ctx.beginPath();ctx.moveTo(pts[f[0]][0],pts[f[0]][1]);
          for(var fi=1;fi<4;fi++)ctx.lineTo(pts[f[fi]][0],pts[f[fi]][1]);
          ctx.closePath();ctx.fillStyle=f[4];ctx.fill();ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=1.5;ctx.stroke();
        });
        var vol=Math.pow(p.size*2,3);var surf=6*Math.pow(p.size*2,2);
        ctx.restore();
        ctx.fillStyle='#fff';ctx.font='bold 14px Montserrat';ctx.textAlign='center';
        ctx.fillText('a = '+(p.size*2)+' cm',cx,cy+s+40);
        setVal("<span>📐 a="+(p.size*2)+"cm</span><span>📦 V=a³="+vol.toFixed(1)+"cm³</span><span>🔲 S=6a²="+surf.toFixed(1)+"cm²</span>");
      } else if(p.shape==='sphere'){
        var r=s;
        // Sphere with gradient
        var grad=ctx.createRadialGradient(-r*0.3,-r*0.3,r*0.1,0,0,r);
        grad.addColorStop(0,'rgba(59,130,246,0.8)');grad.addColorStop(0.7,'rgba(124,58,237,0.5)');grad.addColorStop(1,'rgba(20,37,84,0.6)');
        ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=1.5;ctx.stroke();
        // Equator line rotating
        ctx.beginPath();ctx.ellipse(0,0,r,r*0.15,rot,0,Math.PI*2);ctx.strokeStyle='rgba(255,201,60,.4)';ctx.lineWidth=1;ctx.stroke();
        // Meridian
        ctx.beginPath();ctx.ellipse(0,0,r*0.15,r,0,0,Math.PI*2);ctx.stroke();
        ctx.restore();
        var vol2=(4/3)*Math.PI*Math.pow(p.size,3);var surf2=4*Math.PI*Math.pow(p.size,2);
        ctx.fillStyle='#fff';ctx.font='bold 14px Montserrat';ctx.textAlign='center';
        ctx.fillText('r = '+p.size+' cm',cx,cy+r+35);
        setVal("<span>📐 r="+p.size+"cm</span><span>📦 V=4/3πr³="+vol2.toFixed(1)+"cm³</span><span>🔲 S=4πr²="+surf2.toFixed(1)+"cm²</span>");
      } else if(p.shape==='cylinder'){
        var r=s*0.6,h=s*1.4;
        // Body
        ctx.beginPath();ctx.moveTo(-r,-h/2);ctx.lineTo(-r,h/2);ctx.lineTo(r,h/2);ctx.lineTo(r,-h/2);ctx.closePath();
        ctx.fillStyle='rgba(8,145,178,0.45)';ctx.fill();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=1.5;ctx.stroke();
        // Top ellipse
        ctx.beginPath();ctx.ellipse(0,-h/2,r,r*0.25,0,0,Math.PI*2);ctx.fillStyle='rgba(59,130,246,0.6)';ctx.fill();ctx.stroke();
        // Bottom ellipse
        ctx.beginPath();ctx.ellipse(0,h/2,r,r*0.25,0,0,Math.PI);ctx.strokeStyle='rgba(255,255,255,.2)';ctx.stroke();
        ctx.restore();
        var rr=p.size*0.6,hh=p.size*1.4;
        var vol3=Math.PI*rr*rr*hh;var surf3=2*Math.PI*rr*(rr+hh);
        ctx.fillStyle='#fff';ctx.font='bold 14px Montserrat';ctx.textAlign='center';
        ctx.fillText('r='+rr.toFixed(1)+' h='+hh.toFixed(1)+' cm',cx,cy+h/2+40);
        setVal("<span>📐 r="+rr.toFixed(1)+"cm h="+hh.toFixed(1)+"cm</span><span>📦 V=πr²h="+vol3.toFixed(1)+"cm³</span><span>🔲 S="+surf3.toFixed(1)+"cm²</span>");
      } else {
        // Cone
        var r=s*0.7,h=s*1.5;
        ctx.beginPath();ctx.moveTo(0,-h/2);ctx.lineTo(-r,h/2);ctx.lineTo(r,h/2);ctx.closePath();
        ctx.fillStyle='rgba(217,119,6,0.45)';ctx.fill();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.ellipse(0,h/2,r,r*0.2,0,0,Math.PI*2);ctx.fillStyle='rgba(217,119,6,0.3)';ctx.fill();ctx.stroke();
        ctx.restore();
        var rr=p.size*0.7,hh=p.size*1.5;
        var vol4=(1/3)*Math.PI*rr*rr*hh;
        ctx.fillStyle='#fff';ctx.font='bold 14px Montserrat';ctx.textAlign='center';
        ctx.fillText('r='+rr.toFixed(1)+' h='+hh.toFixed(1)+' cm',cx,cy+h/2+40);
        setVal("<span>📐 r="+rr.toFixed(1)+"cm h="+hh.toFixed(1)+"cm</span><span>📦 V=⅓πr²h="+vol4.toFixed(1)+"cm³</span>");
      }
      _simUpdateControls();
    };

  // ── GÉO : Carte du Cameroun (lv7) ──
  // Contour réel : Natural Earth 1:50m (domaine public, via world-atlas),
  // projection équirectangulaire x=X0+(lon-LON0)·cos(7°)·K, y=Y0+(LAT0-lat)·K.
  // Les chefs-lieux sont placés par leurs vraies coordonnées avec la même projection.
  } else if(lv.id==="lv7"){
    window._sim.params={scene:0,highlight:-1,info:-1,a:-1,b:-1,ordre:null,k:0,score:0,clic:null,fin:false};
    window._sim.defaults={scene:0,highlight:-1,info:-1,a:-1,b:-1,ordre:null,k:0,score:0,clic:null,fin:false};
    var CM_K=27,CM_COS=Math.cos(7*Math.PI/180),CM_LON0=8.4,CM_LAT0=13.2,CM_X0=200,CM_Y0=12;
    var cmXY=function(lat,lon){return [CM_X0+(lon-CM_LON0)*CM_COS*CM_K, CM_Y0+(CM_LAT0-lat)*CM_K];};
    var cmPath=(typeof Path2D==='function')?new Path2D("M204.2 240.0L204.9 237.9L206.5 235.4L208.4 232.1L210.7 228.0L212.3 220.9L213.3 216.4L214.3 212.3L216.0 208.6L217.7 206.2L222.5 201.4L226.1 197.8L227.9 196.3L229.3 195.1L231.5 193.7L233.8 192.1L235.5 188.9L237.0 185.9L238.0 185.3L239.5 184.7L243.9 181.5L246.7 179.5L247.4 180.5L247.9 181.7L248.4 182.3L250.8 182.7L253.9 182.7L255.8 182.3L256.7 181.3L257.8 178.4L258.4 177.8L259.2 177.7L262.6 179.7L265.5 182.6L268.4 185.4L269.9 186.4L270.5 187.6L271.8 192.8L272.6 194.0L273.8 194.6L276.0 194.3L278.4 193.3L280.5 192.0L282.5 190.3L283.9 188.7L284.4 187.6L284.7 183.3L285.2 182.4L287.3 180.7L290.8 177.9L292.7 176.3L292.5 175.7L291.4 174.0L290.2 172.0L291.4 170.1L292.5 168.6L296.9 163.5L296.9 161.8L297.2 159.8L300.6 153.9L302.7 146.3L302.8 144.8L304.8 141.1L307.3 136.3L312.1 135.6L314.0 134.4L316.1 132.3L317.4 130.3L318.1 128.4L318.6 124.9L319.5 120.8L319.9 117.2L321.4 113.9L323.8 112.2L327.9 110.8L328.6 110.2L329.2 108.0L329.7 103.4L329.8 100.6L330.0 99.5L330.6 97.4L334.4 93.8L336.1 88.0L337.6 82.0L342.0 74.8L347.1 67.6L349.6 65.7L351.6 64.8L353.9 64.7L355.5 64.1L361.0 60.6L363.4 59.4L365.1 58.1L365.5 57.0L365.7 55.4L365.1 51.7L366.1 49.0L366.6 44.8L366.9 41.5L366.6 40.3L365.8 38.7L365.7 38.4L364.0 36.3L361.2 35.1L357.4 34.8L355.3 34.0L355.1 32.3L354.9 31.3L354.7 30.2L354.4 27.9L351.8 15.3L356.6 15.3L362.5 16.8L363.9 18.0L364.7 22.2L366.7 24.7L370.5 26.7L372.8 30.9L373.7 37.1L375.7 40.9L376.2 41.5L378.5 46.9L379.1 48.6L379.2 51.9L379.0 54.1L380.1 56.8L378.4 61.5L377.8 64.3L377.6 68.3L378.7 75.4L380.4 80.9L382.3 85.3L384.3 88.7L387.6 92.5L391.1 96.0L394.4 98.2L391.3 99.5L385.4 99.6L382.1 98.9L380.4 98.9L378.8 99.3L372.5 100.0L366.1 99.7L360.2 98.8L356.6 99.0L353.8 101.1L351.6 104.2L349.5 106.7L350.2 109.5L351.8 111.1L354.9 114.4L357.6 117.7L359.0 119.9L364.4 124.7L369.7 129.0L370.8 129.8L372.2 130.5L373.1 130.8L376.0 133.3L379.9 137.4L383.6 143.7L386.2 150.1L388.7 156.4L389.9 157.5L391.6 158.1L391.8 159.5L391.7 161.4L391.1 163.1L389.7 165.2L387.0 169.7L383.4 172.3L382.5 173.8L381.9 175.7L381.1 177.7L379.2 181.8L377.8 185.2L376.4 186.3L373.2 191.4L371.0 196.5L370.6 197.9L369.9 198.8L368.9 199.6L365.1 201.2L363.8 202.0L362.8 203.0L361.9 204.0L361.6 205.4L362.5 207.2L363.5 208.6L364.6 208.7L365.6 208.7L366.2 209.5L366.6 210.0L366.6 220.0L365.7 221.5L365.8 222.2L365.3 223.9L365.2 225.8L365.5 226.6L366.2 227.2L367.2 228.6L367.8 231.6L369.0 242.4L369.6 244.1L370.7 245.3L374.1 247.6L377.4 250.7L378.6 252.7L379.2 256.0L380.5 258.5L380.5 259.4L379.9 259.7L378.7 259.8L377.8 260.0L378.5 261.8L380.3 265.1L383.3 268.5L386.5 272.1L389.1 275.1L392.4 278.5L395.0 281.2L397.6 284.0L399.6 284.6L401.1 284.8L401.8 285.4L402.5 286.6L403.9 288.0L405.4 289.9L405.9 291.7L405.2 293.5L405.9 296.1L405.9 296.3L406.4 297.3L406.2 298.2L406.6 301.6L407.3 304.6L408.6 307.1L408.6 307.3L408.4 308.9L406.8 309.9L405.8 311.5L405.5 313.8L406.0 316.6L407.2 319.9L407.3 321.8L406.9 322.1L406.1 322.7L405.2 323.2L403.0 320.9L400.5 319.4L396.7 316.7L393.0 315.7L388.1 315.6L385.9 315.9L384.5 314.9L382.4 313.7L381.2 313.4L379.6 314.3L378.4 314.4L377.1 314.0L374.3 314.1L374.0 312.5L373.5 312.2L370.5 312.4L369.6 311.1L369.1 311.2L368.0 310.8L365.6 309.0L363.1 310.2L357.8 310.1L351.0 310.1L344.0 310.2L337.6 310.1L331.1 310.0L330.6 308.3L329.2 307.5L326.8 307.4L319.7 307.7L314.3 307.4L312.6 307.3L310.7 306.8L306.1 306.4L300.5 306.7L299.3 306.7L294.9 306.7L284.6 306.2L279.0 306.3L279.1 307.4L278.7 308.1L278.5 309.9L272.3 309.9L264.1 309.9L256.4 309.9L251.2 309.9L242.4 309.9L239.4 308.6L238.5 307.9L238.3 307.0L238.2 306.4L237.5 306.2L238.1 299.9L239.3 294.6L239.8 289.6L241.5 285.3L240.6 280.9L239.6 279.0L234.1 272.9L236.6 270.6L233.3 270.9L232.6 268.6L231.0 265.9L232.0 265.4L232.9 263.9L235.9 264.4L235.8 263.6L233.2 261.3L233.5 260.2L234.6 258.9L234.0 258.3L232.1 259.7L230.8 259.6L229.8 258.7L229.1 258.6L229.5 260.4L228.5 261.9L227.5 262.5L225.8 262.4L224.4 262.0L224.0 261.1L222.8 260.4L219.1 259.3L216.1 257.9L215.5 254.2L214.3 252.6L213.7 250.7L213.4 248.7L213.9 245.4L213.1 244.9L212.3 244.8L210.9 244.9L209.7 244.7L208.2 243.0L207.0 242.3L207.7 245.5L206.9 246.5L204.6 246.2L203.8 245.0L203.6 244.0L204.6 240.1L204.2 240.0Z"):null;
    // lx/ly/la : décalage et alignement de l'étiquette (évite les chevauchements au sud-ouest)
    var regions=[
      {nom:"Adamaoua",chef:"Ngaoundéré",lat:7.32,lon:13.58,col:"#D97706",lx:9,ly:4,la:"left"},
      {nom:"Centre",chef:"Yaoundé",lat:3.87,lon:11.52,col:"#059669",lx:9,ly:4,la:"left",capitale:true},
      {nom:"Est",chef:"Bertoua",lat:4.58,lon:13.68,col:"#7C3AED",lx:9,ly:4,la:"left"},
      {nom:"Extrême-Nord",chef:"Maroua",lat:10.59,lon:14.32,col:"#DC2626",lx:9,ly:4,la:"left"},
      {nom:"Littoral",chef:"Douala",lat:4.05,lon:9.70,col:"#0891B2",lx:4,ly:15,la:"left"},
      {nom:"Nord",chef:"Garoua",lat:9.30,lon:13.40,col:"#2563EB",lx:9,ly:4,la:"left"},
      {nom:"Nord-Ouest",chef:"Bamenda",lat:5.96,lon:10.16,col:"#DB2777",lx:-9,ly:0,la:"right"},
      {nom:"Ouest",chef:"Bafoussam",lat:5.48,lon:10.42,col:"#CA8A04",lx:9,ly:4,la:"left"},
      {nom:"Sud",chef:"Ebolowa",lat:2.90,lon:11.15,col:"#16A34A",lx:9,ly:4,la:"left"},
      {nom:"Sud-Ouest",chef:"Buea",lat:4.16,lon:9.24,col:"#0D9488",lx:-9,ly:12,la:"right"},
    ];
    regions.forEach(function(rg){var xy=cmXY(rg.lat,rg.lon);rg.x=xy[0];rg.y=xy[1];});
    var mtCam=cmXY(4.20,9.17);
    var LG_X=468,LG_Y=58,LG_H=24;
    var fmtDeg=function(v,pos,neg){return Math.abs(v).toFixed(2).replace('.',',')+'° '+(v>=0?pos:neg);};
    // Inverse de la projection (pixel → latitude, longitude), distance orthodromique, direction
    var cmLL=function(x,y){return [CM_LAT0-(y-CM_Y0)/CM_K, CM_LON0+(x-CM_X0)/(CM_COS*CM_K)];};
    var cmKm=function(la1,lo1,la2,lo2){
      var r=Math.PI/180,dla=(la2-la1)*r,dlo=(lo2-lo1)*r;
      var a=Math.sin(dla/2)*Math.sin(dla/2)+Math.cos(la1*r)*Math.cos(la2*r)*Math.sin(dlo/2)*Math.sin(dlo/2);
      return 2*6371*Math.asin(Math.min(1,Math.sqrt(a)));
    };
    var cmDir=function(la1,lo1,la2,lo2){
      var dx=(lo2-lo1)*Math.cos((la1+la2)/2*Math.PI/180), dy=la2-la1;
      var ang=(Math.atan2(dx,dy)*180/Math.PI+360)%360;
      return ['nord','nord-est','est','sud-est','sud','sud-ouest','ouest','nord-ouest'][Math.round(ang/45)%8];
    };
    var fmtKm=function(v){return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');};
    var fmtDec=function(v){return (Math.round(v*10)/10).toFixed(1).replace('.',',');};

    // ── Scène « Relief & fleuves » ──
    // Fleuves : Natural Earth 1:10m (rivers_lake_centerlines, domaine public), lac Tchad :
    // Natural Earth 1:50m (lakes), même projection que le contour. Le Wouri et le Nyong
    // ne figurent pas dans ce jeu de données : ils ne sont pas dessinés plutôt qu'inventés.
    var BASSINS={
      atl:{nom:"Atlantique",col:"#38BDF8"},
      congo:{nom:"Congo",col:"#34D399"},
      niger:{nom:"Niger",col:"#C4B5FD"},
      tchad:{nom:"Lac Tchad",col:"#FB923C"}
    };
    var mkP=function(d){return (typeof Path2D==='function')?new Path2D(d):null;};
    var FL={"Bénoué":"M337.3 158.4L342.7 155.6L342 151.1L345 148.9L348.1 148L350 145L350.3 142.2L349.3 139.2L347.6 138L349.7 133.7L349.9 131.3L347.2 129.3L345.9 127.3L343.1 126.5L341.7 122.4L338.7 119.6L336.9 116.2L333.5 118.9L329.1 120L327.8 119.6L326.9 120.4L324.8 118.2L317.9 114.8L311.9 118.7L310.2 118.9L304.1 111.6L301.7 111.1L297.1 112.7L294.4 112.2M294.4 112.2L289.4 111.9L281.1 116.4L276.7 120L272 121.6L269.1 124.4L266.8 130.2L263 133L257.7 134.3L256.2 133.5L254.5 134.4L250.5 134.3L247.6 138.5L245.9 139L245.7 140.4L244.2 141.1L243.4 143.1L239.7 144.1L237.6 146.3L235.3 146.5L230.5 149.7L227.5 150.5L224.3 153.9L215.8 155.8L213.9 157.5L210.7 157.8L206.4 159.5L200.3 158.4","Chari":"M378 42.9L374.7 43.4L368.1 40.3L367.5 39.2L366.6 39.6L363.1 35.3L355.5 34.6L355 32.3M414.3 83.4L413.6 81.8L406.4 77.8L396.8 76.5L394.7 74.4L391.9 73.6L390.6 71.1L388.6 70L387.4 65.8L388.1 64.1L384.7 56L385.7 52.7L385.2 51.2L385.8 48.7L384.5 47.6L384.3 46.1L382.1 45.7L380.5 42.7L377.2 41.5L375.9 41.9L374.1 40.3L374.4 35.6L373.6 32.3L372.8 32.1L372.3 27.7L370.7 27.3L369.7 26L369.2 26.8L369.1 25L364.9 23.7L364.8 19.7L363.9 17.9","Lom":"M367.9 187.5L368.9 187.6L369.3 188.9L367.4 191L365.8 196.1L361.6 199.1L360.9 200.6L361.8 202L361.7 204.4L359.8 206.4L360 207.9L358.3 209.2L354 209.9L354.3 210.5L352.8 212.6L352.8 215.5L351.9 216.4L351.4 215.8L350.4 216.2L350.1 217.6L349.2 217.3L349.3 218.4L348.1 218.6L348.2 219.4L345.9 219.1L346.4 222.5L345.6 222.3L344.4 224.2L338.7 225.8L336.8 222.8L334.8 223.1L332.6 226.4L333.7 230.8L331.6 232.3L330.5 235L329 235.8L326.7 235.2","Sanaga":"M326.7 235.2L325.5 235.4L321.9 233.4L316.6 234.2L314.4 235.6L312.6 235.3L310.2 237.1L307.7 240.5L303.7 240.9L303.7 241.7L302 242.4L301.8 243.7L298.6 246.2L296.2 244.2L292 248.1L287.4 250.6L284.7 249.9L282.3 247.2L280 247L271.5 255.6L262 259L261.4 258.2L259.6 258.4L256.9 259.7L255.6 259.2L254.6 257.5L252.4 261.6L249.8 264.3L249.2 264.7L247.2 264L243.8 266.9L242.3 269.9L238 270.4","Mbam":"M296.1 176.6L296.6 186.8L297.2 188.9L300.4 191.8L299.7 194.1L298.3 195.5L298.1 197.1L294.8 200.1L290.8 201.2L286.2 204.5L277.1 206.9L277 211.3L278.1 212.1L275.3 214.9L274.8 216.6L275.3 218.2L274.4 221.3L275 221.8L271.8 224.7L271.7 227.6L273.3 231.7L272.4 233L273.1 233.7L272.6 235.7L273.4 237.2L275.1 236.8L274.8 238.1L275.9 238.2L275.7 239L278.3 239L280 240.7L280.6 243.4L277.2 249.5","Logone":"M390.2 158.6L394.5 159L397 156.9L397.5 154.2L399.5 150.9L400.1 141.2L407.6 136.3L413.4 134.9L414.2 133.7M413.8 119.3L409.5 111.1L404.5 108.4L401.3 105.7L398.9 105L398.4 101.7L389.6 94.8L384.9 90L382.7 85.2L380.6 84.3L380.9 81.6L378.6 77L379 74.1L377.8 71.5L377.4 66.5L378.5 63L378.5 60.2L380.5 57.1L378.6 53L379.8 50.3L378 47.7L378.2 45.4L379 45.2L378.2 44.1L378.2 42.1","Dja":"M340.8 270.4L340 272.7L337.7 273.9L336.9 275.6L329.1 275.8L326.6 278L323.5 276.9L320.1 277.3L319.4 276.5L318.8 277.7L317.8 277.7L318.1 277.1L317.2 277.6L315.7 276.5L314.9 277L314 275.8L311.4 276.9L310.8 276.5L307.7 279.6L308.4 284.7L311.5 286.7L316.6 288L318.9 290L322 290.8L322.5 290.2L326.1 291.6L326.9 290.9L329.1 291L330.8 293L330.8 291.4L334.8 293.2L336.8 293.1L336.8 291.6L337.8 291.9L337.5 291.3L341.6 288.9L345.1 288.9L346.9 290.2L352 291.7L354.9 300L354.5 303.3L357.4 305.1L358.8 304.2L360.2 304.7L360.9 303.4L361.3 304.7L362.5 305.2L362.8 307.1L364.9 307.8L365.3 308.8M405.5 323.7L404 320.6L400.7 320L395.8 316.2L389.8 315L385.9 316.5L382.6 313.3L380.9 313.3L378.9 315L376.3 313.5L374 314.2L374.4 312.8L373 311.3L372.6 312.3L370.6 312.6L370.5 311.7L369.6 311.7L370.1 311.3L369.2 311L369.4 311.7L367.4 310.8L365.1 308.8","lac":"M370 15.3L368.4 17.6L363.9 17.9L359.4 20.7L357.4 20L357 17.3L357.8 16.6L359.2 13L363.4 11L367.6 11.8L370 15.3Z","ancre":{"Bénoué":[341.7,122.4],"Chari":[382.1,45.7],"Lom":[350.4,216.2],"Sanaga":[284.7,249.9],"Mbam":[274.4,221.3],"Logone":[379,74.1],"Dja":[326.1,291.6]}};
    var lacPath=mkP(FL.lac);
    var reperes=[
      {nom:"Mont Cameroun",type:"sommet",lat:4.20,lon:9.17,
       info:"Volcan actif de 4 095 m, près de Buea : le plus haut sommet d'Afrique de l'Ouest et centrale. Dernière grande éruption en 2000."},
      {nom:"Mont Oku",type:"sommet",lat:6.20,lon:10.50,
       info:"3 011 m : point culminant des hautes terres de l'Ouest (région du Nord-Ouest). Un lac de cratère, le lac Oku, occupe ses flancs."},
      {nom:"Monts Mandara",type:"sommet",lat:10.85,lon:13.75,
       info:"Massif de l'Extrême-Nord, le long de la frontière avec le Nigeria ; il dépasse à peine 1 500 m."},
      {nom:"Plateau de l'Adamaoua",type:"plateau",lat:6.95,lon:12.70,
       info:"Altitude moyenne d'environ 1 100 m. « Château d'eau » du Cameroun : la Bénoué et plusieurs cours d'eau du bassin de la Sanaga y prennent leur source."},
      {nom:"Lac Tchad",type:"lac",lat:12.98,lon:14.55,bassin:"tchad",
       info:"Partagé par le Cameroun, le Tchad, le Niger et le Nigeria. Sa surface a fortement diminué depuis les années 1960."},
      {nom:"Sanaga",type:"fleuve",bassin:"atl",tr:["Sanaga"],
       info:"Plus long fleuve du Cameroun (≈ 918 km). Ses barrages de Song Loulou et d'Édéa produisent l'essentiel de l'électricité du pays ; il se jette dans l'Atlantique."},
      {nom:"Mbam",type:"fleuve",bassin:"atl",tr:["Mbam"],
       info:"Principal affluent de la Sanaga, qu'il rejoint au nord-ouest de Yaoundé."},
      {nom:"Lom",type:"fleuve",bassin:"atl",tr:["Lom"],
       info:"Affluent de la Sanaga, dans l'Est. Le barrage-réservoir de Lom Pangar régule le débit de la Sanaga en saison sèche."},
      {nom:"Bénoué",type:"fleuve",bassin:"niger",tr:["Bénoué"],
       info:"Naît dans l'Adamaoua, traverse Garoua (barrage de Lagdo en amont) puis rejoint le Niger au Nigeria."},
      {nom:"Logone et Chari",type:"fleuve",bassin:"tchad",tr:["Logone","Chari"],
       info:"Ils marquent la frontière avec le Tchad, se rejoignent à N'Djamena, face à Kousséri, et alimentent le lac Tchad."},
      {nom:"Dja",type:"fleuve",bassin:"congo",tr:["Dja"],
       info:"Coule vers le bassin du Congo. Sa boucle entoure la réserve du Dja, inscrite au patrimoine mondial de l'UNESCO en 1987."}
    ];
    // Décalage des étiquettes sur la carte [dx, dy, alignement]
    var ETQ={"Mont Cameroun":[-8,3,'right'],"Mont Oku":[-8,3,'right'],"Monts Mandara":[-8,3,'right'],
      "Plateau de l'Adamaoua":[0,-17,'center'],"Sanaga":[0,14,'center']};
    reperes.forEach(function(rp){
      if(rp.tr){
        rp.paths=rp.tr.map(function(k){return mkP(FL[k]);});
        rp.x=FL.ancre[rp.tr[0]][0];rp.y=FL.ancre[rp.tr[0]][1];
      } else {var xy=cmXY(rp.lat,rp.lon);rp.x=xy[0];rp.y=xy[1];}
    });

    // ── Scène « Défi » : 10 manches, ordre tiré au hasard ──
    var nouvellePartie=function(p){
      var o=regions.map(function(r,i){return i;});
      for(var i=o.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),tmp=o[i];o[i]=o[j];o[j]=tmp;}
      p.ordre=o;p.k=0;p.score=0;p.clic=null;p.fin=false;
    };
    var pointsPour=function(km){return km<=50?3:km<=120?2:km<=250?1:0;};

    var SCENES=["Régions","Relief et fleuves","Défi : trouve le chef-lieu","Distances et échelle"];
    window._sim.lv7Scene=function(i){
      var p=window._sim.params;
      p.scene=i;p.highlight=-1;p.info=-1;p.a=-1;p.b=-1;
      if(i===2)nouvellePartie(p);
      var ae=document.activeElement;if(ae&&ae.blur)ae.blur();
      _simUpdateControls();
    };
    window._sim.lv7Action=function(){
      var p=window._sim.params;
      if(p.scene===2)nouvellePartie(p);else{p.highlight=-1;p.info=-1;p.a=-1;p.b=-1;}
      var ae=document.activeElement;if(ae&&ae.blur)ae.blur();
      _simUpdateControls();
    };
    var btn=function(label,on,js){
      return "<button type='button' onclick='"+js+"' aria-pressed='"+(on?"true":"false")+"' style='background:"+(on?"#142554":"#F0F4FF")+";color:"+(on?"#FFC93C":"#142554")+";border:none;border-radius:10px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer'>"+label+"</button>";
    };
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      var h=SCENES.map(function(n,i){return btn(n,p.scene===i,"window._sim.lv7Scene("+i+")");}).join('');
      var act=p.scene===2?"Nouvelle partie":p.scene===3?"Effacer le trajet":"Tout afficher";
      return h+btn(act,false,"window._sim.lv7Action()");
    };
    _simUpdateControls();

    var plusProche=function(liste,mx,my,max){
      var best=-1,minD=max;
      liste.forEach(function(it,i){var d=Math.hypot(mx-it.x,my-it.y);if(d<minD){minD=d;best=i;}});
      return best;
    };
    var ligneLegende=function(my,n){
      var row=Math.floor((my-(LG_Y-14))/LG_H);
      return (row>=0&&row<n)?row:-1;
    };
    var cnvEl=document.getElementById('laboCnv');
    if(cnvEl)cnvEl.onclick=function(ev){
      var p=window._sim.params;
      var rect=cnvEl.getBoundingClientRect();
      var mx=(ev.clientX-rect.left)*(W/rect.width);
      var my=(ev.clientY-rect.top)*(H/rect.height);
      var dansLegende=mx>=LG_X-8&&my>=LG_Y-14;
      if(p.scene===1){
        var r1=dansLegende?ligneLegende(my,reperes.length):plusProche(reperes,mx,my,18);
        if(r1>=0)p.info=r1;
        return;
      }
      if(p.scene===2){
        if(!p.ordre)nouvellePartie(p);
        if(p.fin){nouvellePartie(p);return;}
        if(p.clic){p.k++;p.clic=null;if(p.k>=regions.length)p.fin=true;return;}
        if(mx>=LG_X-16)return; // la carte seulement
        var cible=regions[p.ordre[p.k]], ll=cmLL(mx,my);
        var km=cmKm(ll[0],ll[1],cible.lat,cible.lon), pts=pointsPour(km);
        p.clic={x:mx,y:my,km:km,pts:pts};p.score+=pts;
        return;
      }
      var r=dansLegende?ligneLegende(my,regions.length):plusProche(regions,mx,my,16);
      if(r<0)return;
      if(p.scene===3){
        if(p.a<0||p.b>=0){p.a=r;p.b=-1;}
        else if(r!==p.a)p.b=r;
        return;
      }
      p.highlight=r;
    };

    // ── Dessin ──
    var dessinerFond=function(titre){
      // Fond peint sur le canevas : le dégradé du conteneur est écrasé par le thème clair
      var bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#142554');bg.addColorStop(1,'#0F172A');
      ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
      ctx.fillStyle='rgba(255,255,255,.75)';ctx.font='bold 13px Montserrat';ctx.textAlign='left';
      ctx.fillText(titre,20,25);
      // Pays voisins & océan (repères)
      ctx.fillStyle='rgba(255,255,255,.28)';ctx.font='italic 10px Montserrat';
      ctx.fillText('NIGERIA',110,150);ctx.fillText('TCHAD',410,118);ctx.fillText('RCA',405,215);
      ctx.fillText('CONGO',372,334);ctx.fillText('GABON',272,334);ctx.fillText('GUINÉE ÉQ.',176,334);
      ctx.fillStyle='rgba(125,211,252,.45)';ctx.fillText('Golfe de Guinée',60,295);
      // Contour réel
      if(cmPath){
        ctx.fillStyle='rgba(255,201,60,.08)';ctx.fill(cmPath);
        ctx.strokeStyle='rgba(255,201,60,.75)';ctx.lineWidth=1.6;ctx.lineJoin='round';ctx.stroke(cmPath);
      }
    };
    var dessinerFleuves=function(alpha,sel){
      if(lacPath){ctx.fillStyle='rgba(56,189,248,'+(.55*alpha)+')';ctx.fill(lacPath);}
      ctx.lineJoin='round';ctx.lineCap='round';
      reperes.forEach(function(rp,i){
        if(!rp.paths)return;
        var on=sel===-1||sel===undefined||sel===i;
        ctx.strokeStyle=BASSINS[rp.bassin].col;ctx.globalAlpha=alpha*(on?1:.3);
        ctx.lineWidth=sel===i?3:1.6;
        rp.paths.forEach(function(pa){if(pa)ctx.stroke(pa);});
        ctx.globalAlpha=1;
      });
    };
    var dessinerMontCameroun=function(){
      ctx.fillStyle='#FFC93C';ctx.beginPath();
      ctx.moveTo(mtCam[0]-3,mtCam[1]-4);ctx.lineTo(mtCam[0]+3,mtCam[1]-4);ctx.lineTo(mtCam[0],mtCam[1]-10);ctx.closePath();ctx.fill();
      ctx.font='9px Montserrat';ctx.textAlign='right';ctx.fillText('▲ Mt Cameroun 4 095 m',mtCam[0]-14,mtCam[1]-14);
    };
    var dessinerChefsLieux=function(actif,etiquettes,t){
      regions.forEach(function(rg,i){
        if(actif(i)<0)return; // défi : chef-lieu pas encore trouvé, rien ne doit le trahir
        var sel=actif(i)===2, active=actif(i)>0;
        if(sel){
          var pr=9+Math.sin(t*3)*3;
          ctx.beginPath();ctx.arc(rg.x,rg.y,pr,0,Math.PI*2);
          ctx.strokeStyle=rg.col;ctx.lineWidth=2;ctx.stroke();
        }
        ctx.beginPath();ctx.arc(rg.x,rg.y,rg.capitale?5.5:4.5,0,Math.PI*2);
        ctx.fillStyle=active?rg.col:'rgba(140,140,140,.45)';ctx.fill();
        ctx.strokeStyle=active?'#fff':'rgba(255,255,255,.2)';ctx.lineWidth=rg.capitale?2:1.2;ctx.stroke();
        if(!etiquettes)return;
        ctx.fillStyle=active?'#fff':'rgba(255,255,255,.35)';
        ctx.font=(sel?'bold ':'')+'10px Montserrat';ctx.textAlign=rg.la;
        ctx.fillText(rg.chef+(rg.capitale?' ★':''),rg.x+rg.lx,rg.y+rg.ly);
      });
    };
    var dessinerLegendeRegions=function(actif){
      ctx.fillStyle='rgba(255,255,255,.55)';ctx.font='bold 10px Montserrat';ctx.textAlign='left';
      ctx.fillText('RÉGION · CHEF-LIEU',LG_X,LG_Y-22);
      regions.forEach(function(rg,i){
        var y=LG_Y+i*LG_H, sel=actif(i)===2, active=actif(i)>0;
        if(sel){ctx.fillStyle='rgba(255,255,255,.1)';ctx.fillRect(LG_X-8,y-14,W-LG_X,LG_H-2);}
        ctx.beginPath();ctx.arc(LG_X,y-4,5,0,Math.PI*2);ctx.fillStyle=active?rg.col:'rgba(140,140,140,.45)';ctx.fill();
        ctx.fillStyle=active?'#fff':'rgba(255,255,255,.4)';ctx.font=(sel?'bold ':'')+'11px Montserrat';
        ctx.fillText(rg.nom,LG_X+12,y);
        ctx.fillStyle=active?'rgba(255,201,60,.9)':'rgba(255,255,255,.3)';ctx.font='10px Montserrat';
        ctx.fillText('· '+rg.chef,LG_X+100,y);
      });
    };
    // Texte sur plusieurs lignes dans le panneau de droite
    var paragraphe=function(txt,x,y,larg,interligne){
      var mots=txt.split(' '),ligne='';
      mots.forEach(function(m){
        var essai=ligne?ligne+' '+m:m;
        if(ctx.measureText(essai).width>larg&&ligne){ctx.fillText(ligne,x,y);y+=interligne;ligne=m;}
        else ligne=essai;
      });
      if(ligne)ctx.fillText(ligne,x,y);
      return y;
    };

    window._sim._draw=function(){
      var p=window._sim.params;var t=window._sim.t;
      _simUpdateControls();

      // Scène 1 : relief et fleuves
      if(p.scene===1){
        dessinerFond('CAMEROUN — relief et fleuves');
        dessinerFleuves(1,p.info>=0&&reperes[p.info].paths?p.info:-1);
        // Clé des bassins
        ctx.font='10px Montserrat';ctx.textAlign='left';
        ctx.fillStyle='rgba(255,255,255,.55)';ctx.fillText('Bassins versants :',20,48);
        ['atl','congo','niger','tchad'].forEach(function(k,i){
          var y=64+i*15;ctx.strokeStyle=BASSINS[k].col;ctx.lineWidth=2.5;
          ctx.beginPath();ctx.moveTo(20,y-3);ctx.lineTo(34,y-3);ctx.stroke();
          ctx.fillStyle='rgba(255,255,255,.75)';ctx.fillText(BASSINS[k].nom,40,y);
        });
        // Sommets, plateau, lac
        reperes.forEach(function(rp,i){
          if(rp.paths)return;
          var sel=p.info===i;
          if(sel){ctx.beginPath();ctx.arc(rp.x,rp.y,9+Math.sin(t*3)*3,0,Math.PI*2);ctx.strokeStyle='#FFC93C';ctx.lineWidth=2;ctx.stroke();}
          ctx.fillStyle=rp.type==='lac'?'#38BDF8':'#FFC93C';
          if(rp.type==='plateau'){ctx.globalAlpha=.25;ctx.beginPath();ctx.ellipse(rp.x,rp.y,34,13,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
          ctx.beginPath();
          if(rp.type==='sommet'){ctx.moveTo(rp.x-4,rp.y+3);ctx.lineTo(rp.x+4,rp.y+3);ctx.lineTo(rp.x,rp.y-5);ctx.closePath();}
          else ctx.arc(rp.x,rp.y,3.5,0,Math.PI*2);
          ctx.fill();
        });
        // Étiquettes des repères sur la carte
        reperes.forEach(function(rp,i){
          var o=ETQ[rp.nom]||[7,3,'left'];
          ctx.fillStyle=rp.bassin?BASSINS[rp.bassin].col:'#FFC93C';ctx.globalAlpha=p.info<0||p.info===i?1:.45;
          ctx.font=(p.info===i?'bold ':'')+(rp.type==='fleuve'?'italic ':'')+'9px Montserrat';ctx.textAlign=o[2];
          ctx.fillText(rp.nom,rp.x+o[0],rp.y+o[1]);ctx.globalAlpha=1;
        });
        // Légende cliquable des repères
        ctx.fillStyle='rgba(255,255,255,.55)';ctx.font='bold 10px Montserrat';ctx.textAlign='left';
        ctx.fillText('REPÈRE · TYPE',LG_X,LG_Y-22);
        reperes.forEach(function(rp,i){
          var y=LG_Y+i*LG_H, sel=p.info===i;
          if(sel){ctx.fillStyle='rgba(255,255,255,.1)';ctx.fillRect(LG_X-8,y-14,W-LG_X,LG_H-2);}
          var col=rp.bassin?BASSINS[rp.bassin].col:'#FFC93C';
          ctx.beginPath();ctx.arc(LG_X,y-4,5,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
          ctx.fillStyle=sel||p.info<0?'#fff':'rgba(255,255,255,.55)';ctx.font=(sel?'bold ':'')+'11px Montserrat';
          ctx.fillText(rp.nom,LG_X+12,y);
          ctx.fillStyle='rgba(255,201,60,.8)';ctx.font='9px Montserrat';ctx.textAlign='right';
          ctx.fillText(rp.type,W-10,y);ctx.textAlign='left';
        });
        if(p.info>=0){
          var rp=reperes[p.info];
          var bas=rp.bassin?" · bassin "+(rp.bassin==='tchad'?"du lac Tchad":rp.bassin==='atl'?"de l'Atlantique":"du "+BASSINS[rp.bassin].nom):"";
          setVal("<span style='font-weight:700'>"+rp.nom+bas+"</span><span>"+rp.info+"</span>");
        } else {
          setVal("<span>4 bassins versants : Atlantique, Congo, Niger, lac Tchad</span><span>Clique sur un fleuve, un sommet ou la légende</span>");
        }
        return;
      }

      // Scène 2 : défi
      if(p.scene===2){
        if(!p.ordre)nouvellePartie(p);
        dessinerFond('DÉFI — place les chefs-lieux');
        dessinerFleuves(.35);
        var fait=function(i){var pos=p.ordre.indexOf(i);return pos<p.k||(pos===p.k&&p.clic);};
        dessinerChefsLieux(function(i){return fait(i)||p.fin?1:-1;},false,t);
        regions.forEach(function(rg,i){
          if(!(fait(i)||p.fin))return;
          ctx.fillStyle='rgba(255,255,255,.8)';ctx.font='10px Montserrat';ctx.textAlign=rg.la;
          ctx.fillText(rg.chef,rg.x+rg.lx,rg.y+rg.ly);
        });
        var px=LG_X-8;
        ctx.textAlign='left';
        if(p.fin){
          ctx.fillStyle='#FFC93C';ctx.font='bold 14px Montserrat';ctx.fillText('Partie terminée',px,60);
          ctx.fillStyle='#fff';ctx.font='bold 26px Montserrat';ctx.fillText(p.score+' / 30',px,100);
          var appr=p.score>=26?'Excellent : tu connais la carte par cœur.':p.score>=18?'Bien joué : encore quelques chefs-lieux à fixer.':p.score>=10?'Pas mal : revois la scène Régions puis rejoue.':'Commence par la scène Régions, puis retente le défi.';
          ctx.font='11px Montserrat';ctx.fillStyle='rgba(255,255,255,.8)';paragraphe(appr,px,130,W-px-12,16);
          ctx.fillStyle='rgba(255,201,60,.8)';ctx.font='10px Montserrat';ctx.fillText('Clique sur la carte pour rejouer',px,200);
          setVal("<span>Score : "+p.score+" / 30</span><span>3 points à moins de 50 km · 2 à moins de 120 km · 1 à moins de 250 km</span>");
          return;
        }
        var cible=regions[p.ordre[p.k]];
        ctx.fillStyle='rgba(255,255,255,.55)';ctx.font='bold 10px Montserrat';
        ctx.fillText('MANCHE '+(p.k+1)+' / '+regions.length+'  ·  SCORE '+p.score,px,40);
        ctx.fillStyle='#fff';ctx.font='12px Montserrat';ctx.fillText('Où se trouve',px,70);
        ctx.fillStyle='#FFC93C';ctx.font='bold 18px Montserrat';ctx.fillText(cible.chef+' ?',px,94);
        ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='11px Montserrat';ctx.fillText('chef-lieu de la région '+(/^[AEÉIOU]/.test(cible.nom)?"de l'":"du ")+cible.nom,px,114);
        if(p.clic){
          var c=p.clic;
          ctx.setLineDash([4,4]);ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1.4;
          ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(cible.x,cible.y);ctx.stroke();ctx.setLineDash([]);
          ctx.strokeStyle='#F87171';ctx.lineWidth=2;
          ctx.beginPath();ctx.moveTo(c.x-5,c.y-5);ctx.lineTo(c.x+5,c.y+5);ctx.moveTo(c.x+5,c.y-5);ctx.lineTo(c.x-5,c.y+5);ctx.stroke();
          ctx.beginPath();ctx.arc(cible.x,cible.y,9+Math.sin(t*3)*3,0,Math.PI*2);ctx.strokeStyle=cible.col;ctx.stroke();
          var verdict=c.pts===3?'En plein dans le mille !':c.pts===2?'Tout près.':c.pts===1?'Dans la bonne zone.':'Trop loin.';
          ctx.fillStyle=c.pts>=2?'#34D399':c.pts===1?'#FFC93C':'#F87171';ctx.font='bold 13px Montserrat';
          ctx.fillText(verdict+' +'+c.pts,px,150);
          ctx.fillStyle='#fff';ctx.font='11px Montserrat';ctx.fillText('Écart : '+fmtKm(c.km)+' km',px,170);
          ctx.fillStyle='rgba(255,201,60,.8)';ctx.font='10px Montserrat';ctx.fillText('Clique pour continuer',px,200);
          setVal("<span>"+cible.chef+" · région "+cible.nom+"</span><span>Écart : "+fmtKm(c.km)+" km</span><span>"+fmtDeg(cible.lat,'N','S')+" · "+fmtDeg(cible.lon,'E','O')+"</span>");
        } else {
          ctx.fillStyle='rgba(255,201,60,.8)';ctx.font='10px Montserrat';ctx.fillText('Clique sur la carte à l’endroit choisi',px,150);
          setVal("<span>Manche "+(p.k+1)+" / "+regions.length+"</span><span>Score : "+p.score+"</span><span>Aide : les fleuves sont tracés en fond</span>");
        }
        return;
      }

      // Scène 3 : distances et échelle
      if(p.scene===3){
        dessinerFond('CAMEROUN — distances et échelle');
        var etat=function(i){return i===p.a||i===p.b?2:(p.a<0?1:(p.b<0?1:.5));};
        if(p.a>=0&&p.b>=0){
          var A=regions[p.a],B=regions[p.b];
          var avance=Math.min(1,(t%3)/1.5);
          ctx.strokeStyle='#FFC93C';ctx.lineWidth=2;ctx.setLineDash([6,5]);
          ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke();ctx.setLineDash([]);
          ctx.fillStyle='#FFC93C';ctx.beginPath();
          ctx.arc(A.x+(B.x-A.x)*avance,A.y+(B.y-A.y)*avance,3.5,0,Math.PI*2);ctx.fill();
          var d=cmKm(A.lat,A.lon,B.lat,B.lon);
          var mxl=(A.x+B.x)/2,myl=(A.y+B.y)/2;
          ctx.font='bold 11px Montserrat';ctx.textAlign='center';
          var lab=fmtKm(d)+' km',lw=ctx.measureText(lab).width+12;
          ctx.fillStyle='rgba(15,23,42,.85)';ctx.fillRect(mxl-lw/2,myl-20,lw,17);
          ctx.fillStyle='#FFC93C';ctx.fillText(lab,mxl,myl-7);
          setVal("<span>"+A.chef+" → "+B.chef+" : "+fmtKm(d)+" km à vol d'oiseau, vers "+(function(dir){return (/^[eo]/.test(dir)?"l'":"le ")+dir;})(cmDir(A.lat,A.lon,B.lat,B.lon))+"</span>"
            +"<span>Carte au 1/1 000 000 (1 cm = 10 km) : "+fmtDec(d/10)+" cm</span>"
            +"<span>Carte au 1/5 000 000 (1 cm = 50 km) : "+fmtDec(d/50)+" cm</span>");
        } else if(p.a>=0){
          setVal("<span>Départ : "+regions[p.a].chef+"</span><span>Choisis maintenant la ville d'arrivée</span>");
        } else {
          setVal("<span>Clique sur deux chefs-lieux (carte ou légende)</span><span>La distance est calculée à vol d'oiseau, puis convertie à l'échelle</span>");
        }
        dessinerChefsLieux(etat,true,t);
        dessinerLegendeRegions(etat);
        return;
      }

      // Scène 0 : régions et chefs-lieux
      dessinerFond('🗺️ CAMEROUN — 10 régions');
      dessinerMontCameroun();
      var etat0=function(i){return p.highlight===i?2:(p.highlight===-1?1:0);};
      dessinerChefsLieux(etat0,true,t);
      dessinerLegendeRegions(etat0);
      if(p.highlight>=0){
        var s=regions[p.highlight];
        setVal("<span style='color:"+s.col+"'>📍 Région "+s.nom+"</span><span>🏛 Chef-lieu : "+s.chef+(s.capitale?" (capitale politique)":"")+"</span><span>🧭 "+fmtDeg(s.lat,'N','S')+" · "+fmtDeg(s.lon,'E','O')+"</span>");
      } else {
        setVal("<span>🗺️ 10 régions</span><span>📐 475 442 km²</span><span>🏔 Mt Cameroun 4 095 m</span><span>👆 Clique pour explorer</span>");
      }
    };

  // ── SIMULATION GÉNÉRIQUE (autres labos) ──
  
  // â”€â”€ lv8 : Décolonisation en Afrique â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  } else if(lv.id==="lv8"){
    var events=[
      {y:1956,pays:"Maroc / Tunisie",col:"France",c:"#EAB308"},
      {y:1957,pays:"Ghana",col:"Grande-Bretagne",c:"#4B9C69"},
      {y:1958,pays:"Guinée",col:"France",c:"#EAB308"},
      {y:1960,pays:"Cameroun, Sénégal, Mali, Côte d'Ivoire…",col:"France",c:"#EAB308"},
      {y:1960,pays:"Nigeria, Kenya, Somalie",col:"Grande-Bretagne",c:"#4B9C69"},
      {y:1962,pays:"Algérie, Rwanda, Burundi",col:"France / Belgique",c:"#EAB308"},
      {y:1964,pays:"Malawi, Zambie",col:"Grande-Bretagne",c:"#4B9C69"},
      {y:1965,pays:"Gambie, Rhodésie (UDI)",col:"Grande-Bretagne",c:"#4B9C69"},
      {y:1968,pays:"Guinée équatoriale, Swaziland",col:"Espagne / GB",c:"#C07D4F"},
      {y:1975,pays:"Mozambique, Angola, Comores",col:"Portugal",c:"#C46F6F"},
      {y:1980,pays:"Zimbabwe",col:"Grande-Bretagne",c:"#4B9C69"},
      {y:1990,pays:"Namibie",col:"Afrique du Sud / ONU",c:"#7C68B8"},
      {y:1993,pays:"Érythrée",col:"Éthiopie",c:"#C37199"},
    ];
    var selected=0;
    window._sim.params={sel:0};
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      return "<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:8px'>Événement: <input type='range' min='0' max='"+(events.length-1)+"' value='"+p.sel+"' oninput='window._sim.params.sel=+this.value' style='width:130px'></label>"
        +"<span style='font-size:11px;color:#142554'>"+events[p.sel].y+" — "+events[p.sel].pays+"</span>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var t=window._sim.t; var sel=window._sim.params.sel;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle='#0F172A'; ctx.fillRect(0,0,W,H);
      // Timeline axis
      var x0=40, x1=W-40, y0=H-60, barH=28;
      var yrs=[1956,1960,1965,1970,1975,1980,1985,1990,1993];
      ctx.strokeStyle='rgba(255,255,255,.25)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y0); ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.5)'; ctx.font='10px Montserrat'; ctx.textAlign='center';
      yrs.forEach(function(yr){
        var x=x0+(yr-1956)/(1993-1956)*(x1-x0);
        ctx.beginPath(); ctx.moveTo(x,y0); ctx.lineTo(x,y0+6); ctx.strokeStyle='rgba(255,255,255,.4)'; ctx.stroke();
        ctx.fillText(yr,x,y0+18);
      });
      // Bars
      var maxCount=0; var yrCount={};
      events.forEach(function(e){ yrCount[e.y]=(yrCount[e.y]||0)+1; if(yrCount[e.y]>maxCount) maxCount=yrCount[e.y]; });
      var yrSeen={};
      events.forEach(function(ev,i){
        var x=x0+(ev.y-1956)/(1993-1956)*(x1-x0);
        var slot=yrSeen[ev.y]||0; yrSeen[ev.y]=slot+1;
        var barY=y0-20-slot*14;
        var progress=Math.min(1,(t-i*0.18)*3);
        if(progress<=0) return;
        var bw=Math.max(4,14*progress);
        ctx.fillStyle=ev.c+(i===sel?'FF':'88');
        ctx.beginPath();
        if(typeof ctx.roundRect==='function') ctx.roundRect(x-bw/2,barY-12,bw,12,3);
        else { ctx.rect(x-bw/2,barY-12,bw,12); }
        ctx.fill();
        if(i===sel){
          ctx.beginPath(); ctx.moveTo(x,barY); ctx.lineTo(x,y0-2); ctx.strokeStyle=ev.c; ctx.lineWidth=1.5; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
        }
      });
      // Info box for selected
      var ev=events[sel];
      ctx.fillStyle='rgba(255,255,255,.07)'; if(typeof ctx.roundRect==='function') ctx.roundRect(12,10,W-24,72,12); else ctx.rect(12,10,W-24,72); ctx.fill();
      ctx.fillStyle=ev.c; ctx.font='bold 16px Montserrat'; ctx.textAlign='left';
      ctx.fillText(ev.y+' — Indépendance',24,36);
      ctx.fillStyle='rgba(255,255,255,.85)'; ctx.font='13px Georgia';
      ctx.fillText(ev.pays,24,56);
      ctx.fillStyle='rgba(255,255,255,.5)'; ctx.font='11px Georgia';
      ctx.fillText('Ancienne puissance : '+ev.col,24,74);
      setVal('<span>📅 '+ev.y+'</span><span>🌍 '+ev.pays+'</span><span>ðŸ´ '+ev.col+'</span>');
      _simUpdateControls();
    };

  // â”€â”€ lv9 : Optique & Propagation de la Lumière â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  } else if(lv.id==="lv9"){
    var P=window._sim.params={angle:45,n1:1.0,n2:1.5};
    window._sim.defaults={angle:45,n1:1.0,n2:1.5};
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      var sinT2=p.n1/p.n2*Math.sin(p.angle*Math.PI/180);
      var refr=sinT2<=1?'θr = '+(Math.asin(sinT2)*180/Math.PI).toFixed(1)+'°':'Réflexion totale';
      return "<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>θ incident: <input type='range' min='5' max='89' value='"+p.angle+"' oninput='window._sim.params.angle=+this.value' style='width:100px'><span>"+p.angle+"°</span></label>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>n2 (milieu): <input type='range' min='1.0' max='2.5' step='0.05' value='"+p.n2+"' oninput='window._sim.params.n2=+this.value' style='width:100px'><span>"+p.n2+"</span></label>"
        +"<span style='font-size:11px;color:#6C56A6;font-weight:700'>"+refr+"</span>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var p=window._sim.params; ctx.clearRect(0,0,W,H);
      ctx.fillStyle='#0A1628'; ctx.fillRect(0,0,W,H);
      var cx=W/2, iy=H/2;
      // Interface
      ctx.fillStyle='rgba(96,165,250,.12)'; ctx.fillRect(0,iy,W,H-iy);
      ctx.strokeStyle='rgba(255,255,255,.25)'; ctx.lineWidth=1.5; ctx.setLineDash([8,4]);
      ctx.beginPath(); ctx.moveTo(0,iy); ctx.lineTo(W,iy); ctx.stroke(); ctx.setLineDash([]);
      // Normal (dashed vertical)
      ctx.strokeStyle='rgba(255,255,255,.2)'; ctx.setLineDash([5,5]);
      ctx.beginPath(); ctx.moveTo(cx,iy-120); ctx.lineTo(cx,iy+120); ctx.stroke(); ctx.setLineDash([]);
      // Labels
      ctx.fillStyle='rgba(255,255,255,.4)'; ctx.font='11px Fira Code'; ctx.textAlign='left';
      ctx.fillText('n₁ = '+p.n1+' (air)',10,iy-12);
      ctx.fillText('n₁‚ = '+p.n2+' (verre)',10,iy+24);
      // Incident ray
      var ang=p.angle*Math.PI/180;
      var ix=cx-Math.sin(ang)*150, iy1=iy-Math.cos(ang)*150;
      ctx.strokeStyle='#FFC93C'; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.moveTo(ix,iy1); ctx.lineTo(cx,iy); ctx.stroke();
      // Arrow head
      var dx=cx-ix, dy=iy-iy1, len=Math.sqrt(dx*dx+dy*dy);
      var ux=dx/len, uy=dy/len;
      ctx.fillStyle='#FFC93C';
      ctx.beginPath(); ctx.moveTo(cx,iy); ctx.lineTo(cx-ux*12-uy*6,iy-uy*12+ux*6); ctx.lineTo(cx-ux*12+uy*6,iy-uy*12-ux*6); ctx.closePath(); ctx.fill();
      // Reflected ray
      ctx.strokeStyle='#87A9D3'; ctx.lineWidth=1.5;
      var rx=cx+Math.sin(ang)*120, ry=iy-Math.cos(ang)*120;
      ctx.beginPath(); ctx.moveTo(cx,iy); ctx.lineTo(rx,ry); ctx.stroke();
      // Refracted ray
      var sinT2=p.n1/p.n2*Math.sin(ang);
      if(sinT2<=1){
        var t2=Math.asin(sinT2);
        var rfx=cx+Math.sin(t2)*130, rfy=iy+Math.cos(t2)*130;
        ctx.strokeStyle='#5CAB8E'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(cx,iy); ctx.lineTo(rfx,rfy); ctx.stroke();
        // Angle arcs
        ctx.strokeStyle='rgba(252,211,77,.4)'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.arc(cx,iy,50,-(Math.PI/2+ang),-Math.PI/2); ctx.stroke();
        ctx.fillStyle='#FFC93C'; ctx.font='11px Fira Code'; ctx.textAlign='center';
        ctx.fillText(p.angle+'°',cx-30,iy-38);
        ctx.strokeStyle='rgba(52,211,153,.4)';
        ctx.beginPath(); ctx.arc(cx,iy,50,Math.PI/2,Math.PI/2+t2); ctx.stroke();
        ctx.fillStyle='#5CAB8E';
        ctx.fillText((t2*180/Math.PI).toFixed(1)+'°',cx+32,iy+44);
        setVal('<span>⚡ θi='+p.angle+'°</span><span>🔵 θr='+p.angle+'°</span><span>🟢 θt='+(t2*180/Math.PI).toFixed(1)+'°</span><span>n₁sinθi=n₁‚sinθt</span>');
      } else {
        ctx.fillStyle='#C46F6F'; ctx.font='bold 13px Montserrat'; ctx.textAlign='center';
        ctx.fillText('⚠️ Réflexion totale interne',W/2,iy+50);
        setVal('<span>⚠️ Angle limite dépassé — réflexion totale</span>');
      }
      _simUpdateControls();
    };

  // â”€â”€ lv10 : Thermodynamique & Calorimétrie â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  } else if(lv.id==="lv10"){
    var molecules=[];
    for(var mi=0;mi<30;mi++) molecules.push({x:200+Math.random()*280,y:60+Math.random()*220,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,r:4+Math.random()*3});
    window._sim.params={T:300,Q:0,mc:100}; window._sim.defaults={T:300,Q:0,mc:100};
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      return "<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>🌡️ Température (K): <input type='range' min='100' max='800' value='"+p.T+"' oninput='window._sim.params.T=+this.value' style='width:100px'><span>"+p.T+"K</span></label>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>Chaleur Q (J): <input type='range' min='0' max='5000' step='100' value='"+p.Q+"' oninput='window._sim.params.Q=+this.value' style='width:100px'><span>"+p.Q+"J</span></label>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>Masse×c (J/K): <input type='range' min='10' max='500' step='10' value='"+p.mc+"' oninput='window._sim.params.mc=+this.value' style='width:80px'><span>"+p.mc+"</span></label>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var p=window._sim.params; ctx.clearRect(0,0,W,H);
      ctx.fillStyle='#0A1628'; ctx.fillRect(0,0,W,H);
      var speed=Math.sqrt(p.T/300)*1.5;
      var hue=Math.max(0,Math.min(240,240-(p.T-100)*240/700));
      // Container
      ctx.strokeStyle='rgba(255,255,255,.3)'; ctx.lineWidth=2;
      ctx.strokeRect(190,50,300,230);
      ctx.fillStyle='rgba('+Math.round(255*(1-hue/240))+','+Math.round(100+hue/2)+','+Math.round(hue)+',0.05)';
      ctx.fillRect(190,50,300,230);
      // Molecules
      molecules.forEach(function(m){
        m.vx+=(Math.random()-.5)*0.05; m.vy+=(Math.random()-.5)*0.05;
        var spd=Math.sqrt(m.vx*m.vx+m.vy*m.vy);
        if(spd>0){m.vx=m.vx/spd*speed;m.vy=m.vy/spd*speed;}
        m.x+=m.vx; m.y+=m.vy;
        if(m.x<194+m.r||m.x>486-m.r) m.vx*=-1;
        if(m.y<54+m.r||m.y>276-m.r) m.vy*=-1;
        m.x=Math.max(194+m.r,Math.min(486-m.r,m.x));
        m.y=Math.max(54+m.r,Math.min(276-m.r,m.y));
        var g=ctx.createRadialGradient(m.x,m.y,0,m.x,m.y,m.r*1.5);
        g.addColorStop(0,'hsl('+hue+',80%,70%)'); g.addColorStop(1,'hsl('+hue+',80%,20%)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(m.x,m.y,m.r,0,Math.PI*2); ctx.fill();
      });
      // Thermometer
      var tPct=(p.T-100)/700; ctx.fillStyle='#1E293B'; ctx.fillRect(70,60,20,200);
      ctx.fillStyle='hsl('+hue+',80%,55%)'; ctx.fillRect(72,60+(1-tPct)*196,16,tPct*196+8);
      ctx.strokeStyle='rgba(255,255,255,.4)'; ctx.lineWidth=1;
      for(var ti=0;ti<=7;ti++){var ty=60+ti*28;ctx.beginPath();ctx.moveTo(68,ty);ctx.lineTo(90,ty);ctx.stroke();ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='9px Fira Code';ctx.textAlign='right';ctx.fillText(800-ti*100,66,ty+4);}
      ctx.fillStyle='#FFC93C'; ctx.font='bold 12px Fira Code'; ctx.textAlign='center'; ctx.fillText('T='+p.T+'K',80,275);
      // Formula box
      var dT=(p.Q/p.mc).toFixed(1);
      ctx.fillStyle='rgba(255,255,255,.06)'; ctx.fillRect(505,50,160,130);
      ctx.fillStyle='#FFC93C'; ctx.font='bold 12px Fira Code'; ctx.textAlign='left';
      ctx.fillText('Q = mÂ·cÂ·ΔT',515,80); ctx.fillStyle='rgba(255,255,255,.7)'; ctx.font='11px Fira Code';
      ctx.fillText('T = '+p.T+' K',515,100);
      ctx.fillText('Q = '+p.Q+' J',515,118);
      ctx.fillText('ΔT = '+dT+' K',515,136);
      ctx.fillText('T finale = '+(+p.T + +dT).toFixed(0)+' K',515,158);
      setVal('<span>🌡️ T='+p.T+'K</span><span>Q='+p.Q+'J</span><span>ΔT='+dT+'K</span><span>Ec̄∝T</span>');
    };

  // â”€â”€ lv11 : Oxydoréduction & Combustion â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  } else if(lv.id==="lv11"){
    window._sim.params={reaction:0,step:0};
    var reactions=[
      {nom:'Zn + Cu²âº → Zn²âº + Cu',oxyd:'Zn → Zn²âº + 2eâ»',red:'Cu²âº + 2eâ» → Cu',ne:2,col1:'#78716C',col2:'#0EA5E9',prod:'#C07D4F'},
      {nom:'Fe + 2HCl → FeCl₁‚ + H₁‚',oxyd:'Fe → Fe²âº + 2eâ»',red:'2Hâº + 2eâ» → H₁‚',ne:2,col1:'#6B7280',col2:'#C46F6F',prod:'#A3E635'},
      {nom:'CH₁„ + 2O₁‚ → CO₁‚ + 2H₁‚O',oxyd:'Combustion',red:'C: -4 → +4',ne:8,col1:'#87A9D3',col2:'#C07D4F',prod:'#94A3B8'},
    ];
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      return "<button onclick='window._sim.params.reaction=(window._sim.params.reaction+1)%3;window._sim.t=0' style='background:#142554;color:#FFC93C;border:none;border-radius:8px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer'>⇄ Changer réaction</button>"
        +"<span style='font-size:11px;color:#142554;font-weight:700;margin-left:8px'>"+reactions[p.reaction].nom+"</span>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var p=window._sim.params; var t=window._sim.t;
      var rx=reactions[p.reaction];
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0A1628'; ctx.fillRect(0,0,W,H);
      // Two half-cells
      [
        {x:120,label:'Oxydation',eq:rx.oxyd,col:rx.col1},
        {x:460,label:'Réduction',eq:rx.red,col:rx.col2}
      ].forEach(function(cell){
        ctx.strokeStyle=cell.col; ctx.lineWidth=2.5;
        ctx.strokeRect(cell.x-80,60,160,180);
        ctx.fillStyle=cell.col+'22'; ctx.fillRect(cell.x-80,60,160,180);
        ctx.fillStyle=cell.col; ctx.font='bold 13px Montserrat'; ctx.textAlign='center';
        ctx.fillText(cell.label,cell.x,54);
        ctx.fillStyle='rgba(255,255,255,.75)'; ctx.font='11px Georgia';
        var words=cell.eq.split(' ');
        ctx.fillText(cell.eq,cell.x,H/2-10);
        // Electrode
        ctx.fillStyle=cell.col; ctx.fillRect(cell.x-8,90,16,80);
        // Bubbles (product forming)
        for(var bi=0;bi<5;bi++){
          var phase=(t*0.6+bi*1.2)%1;
          var bx=cell.x-20+bi*10;
          var by=150-phase*60;
          ctx.fillStyle=rx.prod+'88'; ctx.beginPath(); ctx.arc(bx,by,3+Math.sin(t+bi)*1.5,0,Math.PI*2); ctx.fill();
        }
      });
      // Bridge
      ctx.fillStyle='#FFC93C'; ctx.fillRect(200,125,180,20); ctx.fillStyle='#0F172A'; ctx.font='10px Fira Code'; ctx.textAlign='center'; ctx.fillText('Pont salin',290,139);
      // Electrons flowing
      var ne=Math.min(rx.ne,8);
      for(var ei=0;ei<ne;ei++){
        var ePhase=(t*0.5+ei/ne)%1;
        var ex=120+80+ePhase*(460-120-80*2);
        var ey=60;
        ctx.fillStyle='#87A9D3'; ctx.beginPath(); ctx.arc(ex,ey,4,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#87A9D3'; ctx.font='bold 9px Fira Code'; ctx.textAlign='center'; ctx.fillText('eâ»',ex,ey-6);
      }
      // Wire top
      ctx.strokeStyle='#87A9D3'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(120,60); ctx.lineTo(460,60); ctx.stroke();
      // Formula
      ctx.fillStyle='rgba(255,255,255,.07)'; ctx.fillRect(10,H-70,W-20,55);
      ctx.fillStyle='#FFC93C'; ctx.font='bold 13px Fira Code'; ctx.textAlign='center';
      ctx.fillText(rx.nom,W/2,H-48);
      ctx.fillStyle='rgba(255,255,255,.6)'; ctx.font='11px Georgia';
      ctx.fillText(rx.oxyd+'   |   '+rx.red,W/2,H-28);
      setVal('<span>⚡ n(eâ»)='+rx.ne+'</span><span>Ox: '+rx.oxyd+'</span><span>Réd: '+rx.red+'</span>');
    };

  // â”€â”€ lv12 : Digestion Humaine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  } else if(lv.id==="lv12"){
    var organs=[
      {n:'Bouche',x:340,y:40,r:22,c:'#C07D4F',info:'Mastication + amylase salivaire. Amidon → Maltose.'},
      {n:'Œsophage',x:340,y:90,r:10,c:'#87A9D3',info:'Transit par péristaltisme. ~10 secondes.'},
      {n:'Estomac',x:320,y:155,r:40,c:'#C46F6F',info:'HCl + pepsine. pH=1,5–3. Protéines → peptides. ~2-4h.'},
      {n:'Intestin grêle',x:290,y:260,r:25,c:'#A3E635',info:'Bile + sucs pancréatiques. Absorption : 90% nutriments. ~6h.'},
      {n:'Gros intestin',x:400,y:280,r:20,c:'#F59E0B',info:'Absorption eau. Formation des fèces. Microbiote. ~24-48h.'},
      {n:'Anus',x:450,y:330,r:12,c:'#94A3B8',info:'Évacuation des déchets.'},
    ];
    window._sim.params={step:0}; window._sim.defaults={step:0};
    window._sim.controlsDef=function(){
      var p=window._sim.params; var o=organs[p.step%organs.length];
      return "<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>Étape: <input type='range' min='0' max='"+(organs.length-1)+"' value='"+p.step+"' oninput='window._sim.params.step=+this.value' style='width:120px'></label>"
        +"<span style='font-size:10px;color:#475882'>"+o.n+": "+o.info+"</span>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var p=window._sim.params; var t=window._sim.t; var sel=p.step%organs.length;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0A1628'; ctx.fillRect(0,0,W,H);
      // Draw connections
      ctx.strokeStyle='rgba(255,255,255,.15)'; ctx.lineWidth=3;
      for(var oi=0;oi<organs.length-1;oi++){
        ctx.beginPath(); ctx.moveTo(organs[oi].x,organs[oi].y); ctx.lineTo(organs[oi+1].x,organs[oi+1].y); ctx.stroke();
      }
      // Draw organs
      organs.forEach(function(o,i){
        var pulse=i===sel?(1+Math.sin(t*4)*0.12):1;
        ctx.fillStyle=o.c+(i===sel?'FF':'55');
        ctx.beginPath(); ctx.arc(o.x,o.y,o.r*pulse,0,Math.PI*2); ctx.fill();
        if(i===sel){ ctx.strokeStyle=o.c; ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(o.x,o.y,(o.r+6)*pulse,0,Math.PI*2); ctx.stroke(); }
        ctx.fillStyle='rgba(255,255,255,.85)'; ctx.font='bold 10px Montserrat'; ctx.textAlign='center';
        ctx.fillText(o.n,o.x+(o.x<400?-60:60),o.y+4);
      });
      // Food bolus animation
      var prog=(t*0.15)%1;
      var segIdx=Math.floor(prog*(organs.length-1));
      var segFrac=prog*(organs.length-1)-segIdx;
      if(segIdx<organs.length-1){
        var sx=organs[segIdx].x+(organs[segIdx+1].x-organs[segIdx].x)*segFrac;
        var sy=organs[segIdx].y+(organs[segIdx+1].y-organs[segIdx].y)*segFrac;
        ctx.fillStyle='#FFC93C'; ctx.beginPath(); ctx.arc(sx,sy,7+Math.sin(t*5)*2,0,Math.PI*2); ctx.fill();
      }
      // Info panel right
      var sel2=p.step%organs.length;
      ctx.fillStyle='rgba(255,255,255,.06)'; ctx.fillRect(520,20,150,H-40);
      ctx.fillStyle=organs[sel2].c; ctx.font='bold 11px Montserrat'; ctx.textAlign='center';
      ctx.fillText(organs[sel2].n,595,45);
      ctx.fillStyle='rgba(255,255,255,.7)'; ctx.font='9.5px Georgia'; ctx.textAlign='left';
      var words=organs[sel2].info.split(' '); var line=''; var lineY=65;
      words.forEach(function(w){if((line+' '+w).length>20){ctx.fillText(line,527,lineY);line=w;lineY+=14;}else line+=(line?'  ':'')+w;});
      ctx.fillText(line,527,lineY);
      setVal('<span>'+organs[sel2].n+'</span>');
      _simUpdateControls();
    };

  // â”€â”€ lv13 : Circulation Sanguine & Respiration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  } else if(lv.id==="lv13"){
    window._sim.params={fc:60,spo2:98}; window._sim.defaults={fc:60,spo2:98};
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      return "<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>💓 FC (bpm): <input type='range' min='40' max='180' value='"+p.fc+"' oninput='window._sim.params.fc=+this.value' style='width:90px'><span>"+p.fc+"</span></label>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>🫁 SpO₁‚ (%): <input type='range' min='80' max='100' value='"+p.spo2+"' oninput='window._sim.params.spo2=+this.value' style='width:90px'><span>"+p.spo2+"%</span></label>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var p=window._sim.params; var t=window._sim.t;
      var beat=t*(p.fc/60);
      var pulse=(Math.sin(beat*Math.PI*2)*0.5+0.5);
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0A1628'; ctx.fillRect(0,0,W,H);
      var cx=280,cy=170;
      // Heart shape
      var hs=1+pulse*0.08;
      ctx.save(); ctx.translate(cx,cy); ctx.scale(hs,hs);
      ctx.beginPath();
      ctx.moveTo(0,20);
      ctx.bezierCurveTo(-60,-20,-80,-80,-10,-80);
      ctx.bezierCurveTo(30,-80,40,-50,0,20);
      ctx.bezierCurveTo(-40,-50,-30,-80,10,-80);
      ctx.bezierCurveTo(80,-80,60,-20,0,20);
      ctx.fillStyle='rgba(239,68,68,'+(0.6+pulse*0.4)+')'; ctx.fill();
      // Chambers
      ctx.strokeStyle='rgba(255,255,255,.4)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(0,-40); ctx.lineTo(0,0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-25,-60); ctx.lineTo(25,-60); ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.6)'; ctx.font='8px Fira Code'; ctx.textAlign='center';
      ctx.fillText('VD',15,-20); ctx.fillText('VG',-15,-20);
      ctx.fillText('OD',15,-70); ctx.fillText('OG',-15,-70);
      ctx.restore();
      // Blood vessels - arteries (red) and veins (blue)
      var vessels=[
        {x1:cx,y1:cy-80,x2:cx,y2:40,col:'#C46F6F',label:'Aorte',oxy:true},
        {x1:cx,y1:cy+10,x2:cx,y2:310,col:'#6A8DC7',label:'Veine cave',oxy:false},
        {x1:cx-30,y1:cy-40,x2:90,y2:cy-40,col:'#6A8DC7',label:'Art. pulm.',oxy:false},
        {x1:cx+30,y1:cy-40,x2:470,y2:cy-40,col:'#C46F6F',label:'V. pulm.',oxy:true},
      ];
      vessels.forEach(function(v){
        ctx.strokeStyle=v.col; ctx.lineWidth=4;
        ctx.beginPath(); ctx.moveTo(v.x1,v.y1); ctx.lineTo(v.x2,v.y2); ctx.stroke();
        ctx.fillStyle=v.col; ctx.font='9px Fira Code'; ctx.textAlign='center';
        ctx.fillText(v.label,(v.x1+v.x2)/2,(v.y1+v.y2)/2-6);
      });
      // Lungs
      [[90,cy-40,50,'#6C56A6'],[470,cy-40,40,'#6C56A6']].forEach(function(l){
        ctx.fillStyle=l[3]+'44'; ctx.strokeStyle=l[3]; ctx.lineWidth=2;
        ctx.beginPath(); ctx.ellipse(l[0],l[1],l[2],l[2]*1.4,0,0,Math.PI*2);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle='rgba(255,255,255,.6)'; ctx.font='10px Fira Code'; ctx.textAlign='center';
        ctx.fillText('🫁',l[0],l[1]+4);
      });
      // Animated blood cells
      var bPhase=(beat*0.15)%1;
      [[cx,cy-80,cx,40,true],[cx,cy+10,cx,290,false],[cx-30,cy-40,90,cy-40,false],[cx+30,cy-40,470,cy-40,true]].forEach(function(v,vi){
        var frac=(bPhase+vi*0.25)%1;
        var bx=v[0]+(v[2]-v[0])*frac, by=v[1]+(v[3]-v[1])*frac;
        ctx.fillStyle=v[4]?'#C46F6F':'#6A8DC7';
        ctx.beginPath(); ctx.arc(bx,by,5,0,Math.PI*2); ctx.fill();
      });
      // ECG
      ctx.strokeStyle='#A3E635'; ctx.lineWidth=1.5;
      ctx.beginPath();
      for(var xi=0;xi<W-10;xi++){
        var xt=xi/60-t*(p.fc/60);
        var ecg=Math.sin(xt*Math.PI*2)*0.1+
          (Math.abs(xt%1-0.5)<0.05?Math.exp(-Math.pow((xt%1-0.5)*40,2))*2:0);
        var ey2=H-30-ecg*30;
        if(xi===0)ctx.moveTo(10+xi,ey2); else ctx.lineTo(10+xi,ey2);
      }
      ctx.stroke();
      setVal('<span>💓 '+p.fc+' bpm</span><span>SpO₁‚: '+p.spo2+'%</span><span>Q=VES×FC</span>');
    };

  // â”€â”€ lv14 : Génétique & Hérédité â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  } else if(lv.id==="lv14"){
    window._sim.params={phase:0,ploidy:2}; window._sim.defaults={phase:0,ploidy:2};
    var phases=['Prophase I','Métaphase I','Anaphase I','Télophase I','Méiose II — Cellules haploïdes'];
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      return "<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:8px'>Phase: <input type='range' min='0' max='4' value='"+p.phase+"' oninput='window._sim.params.phase=+this.value' style='width:140px'><span>"+phases[p.phase]+"</span></label>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var p=window._sim.params; var t=window._sim.t; var ph=p.phase;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0A1628'; ctx.fillRect(0,0,W,H);
      function drawCell(cx,cy,r,label,chromosomes){
        ctx.strokeStyle='rgba(255,255,255,.3)'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke();
        ctx.fillStyle='rgba(255,255,255,.7)'; ctx.font='10px Montserrat'; ctx.textAlign='center';
        ctx.fillText(label,cx,cy+r+16);
        chromosomes.forEach(function(c){
          ctx.fillStyle=c.col; ctx.fillRect(cx+c.dx-4,cy+c.dy-15,8,30);
          if(c.pair){ ctx.fillStyle=c.col+'88'; ctx.fillRect(cx+c.dx+4,cy+c.dy-14,8,28); }
        });
      }
      var chroms=[
        {dx:-30,dy:-10,col:'#C46F6F',pair:ph<2},{dx:-10,dy:-10,col:'#C46F6F',pair:ph<2},
        {dx:10,dy:-10,col:'#6A8DC7',pair:ph<2},{dx:30,dy:-10,col:'#6A8DC7',pair:ph<2},
      ];
      if(ph<4){
        drawCell(W/2,H/2-20,100,'2n=4 (diploïde)',chroms);
        if(ph===1){
          ctx.strokeStyle='rgba(255,255,255,.4)'; ctx.lineWidth=1; ctx.setLineDash([4,4]);
          ctx.beginPath(); ctx.moveTo(W/2,H/2-120); ctx.lineTo(W/2,H/2+80); ctx.stroke(); ctx.setLineDash([]);
        }
        if(ph===2){
          var sep=(t%3)/3*60;
          ctx.fillStyle='#C46F6F'; ctx.fillRect(W/2-40-sep,H/2-25,8,50);
          ctx.fillStyle='#6A8DC7'; ctx.fillRect(W/2+32+sep,H/2-25,8,50);
        }
        if(ph===3){
          drawCell(W/2-150,H/2,60,'n=2',[ {dx:-10,dy:0,col:'#C46F6F',pair:false},{dx:10,dy:0,col:'#6A8DC7',pair:false}]);
          drawCell(W/2+150,H/2,60,'n=2',[ {dx:-10,dy:0,col:'#C46F6F',pair:false},{dx:10,dy:0,col:'#6A8DC7',pair:false}]);
        }
      } else {
        for(var ci=0;ci<4;ci++){
          var ccx=110+ci*(W-160)/3; var ccy=H/2;
          ctx.strokeStyle='rgba(255,255,255,.3)'; ctx.lineWidth=1.5;
          ctx.beginPath(); ctx.arc(ccx,ccy,55,0,Math.PI*2); ctx.stroke();
          var col=ci%2===0?'#C46F6F':'#6A8DC7';
          ctx.fillStyle=col; ctx.fillRect(ccx-4,ccy-20,8,40);
          ctx.fillStyle='rgba(255,255,255,.6)'; ctx.font='10px Fira Code'; ctx.textAlign='center';
          ctx.fillText('n=2',ccx,ccy+72);
        }
        ctx.fillStyle='rgba(255,255,255,.5)'; ctx.font='12px Georgia'; ctx.textAlign='center';
        ctx.fillText('4 cellules haploïdes — gamètes',W/2,H-20);
      }
      ctx.fillStyle='#FFC93C'; ctx.font='bold 13px Montserrat'; ctx.textAlign='center';
      ctx.fillText(phases[ph],W/2,25);
      setVal('<span>Phase: '+phases[ph]+'</span>');
      _simUpdateControls();
    };

  // â”€â”€ lv15 : Probabilités & Statistiques â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  } else if(lv.id==="lv15"){
    var freq=new Array(13).fill(0); var total=0;
    window._sim.params={ndice:2,running:true}; window._sim.defaults={ndice:2,running:true};
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      return "<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>Dés: <input type='range' min='1' max='4' value='"+p.ndice+"' oninput='window._sim.params.ndice=+this.value;freq=new Array(13).fill(0);total=0' style='width:80px'><span>"+p.ndice+"</span></label>"
        +"<button onclick='freq=new Array(13).fill(0);total=0;window._sim.t=0' style='background:#142554;color:#FFC93C;border:none;border-radius:8px;padding:5px 12px;font-size:11px;font-weight:700;cursor:pointer'>🔄 Reset</button>"
        +"<span style='font-size:11px;color:#475882'>"+total+" lancers</span>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var p=window._sim.params; var t=window._sim.t;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0A1628'; ctx.fillRect(0,0,W,H);
      // Roll dice periodically
      if(t%0.1<0.016 && total<2000){
        var sum=0; for(var di=0;di<p.ndice;di++) sum+=Math.ceil(Math.random()*6);
        freq[sum]=(freq[sum]||0)+1; total++;
      }
      // Histogram
      var maxF=Math.max.apply(null,freq.slice(p.ndice,p.ndice*6+1))||1;
      var barW=Math.floor((W-80)/(p.ndice*5+1));
      for(var s=p.ndice;s<=p.ndice*6;s++){
        var bh=Math.round((freq[s]||0)/maxF*(H-100));
        var bx=60+(s-p.ndice)*barW;
        var theoretical=(p.ndice===2?(s-1):1)/(p.ndice===2?36:6);
        var theH=Math.round(theoretical*(H-100)*1.2);
        // Theoretical outline
        ctx.strokeStyle='rgba(252,211,77,.35)'; ctx.lineWidth=1;
        ctx.strokeRect(bx,H-60-theH,barW-3,theH);
        // Actual bar
        var hue=Math.round((s-p.ndice)/(p.ndice*5)*240);
        ctx.fillStyle='hsl('+hue+',70%,55%)';
        ctx.fillRect(bx,H-60-bh,barW-3,bh);
        ctx.fillStyle='rgba(255,255,255,.55)'; ctx.font='10px Fira Code'; ctx.textAlign='center';
        ctx.fillText(s,bx+barW/2-1,H-44);
        if(freq[s]) ctx.fillText(freq[s],bx+barW/2-1,H-63-bh);
      }
      // Axes
      ctx.strokeStyle='rgba(255,255,255,.3)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(55,20); ctx.lineTo(55,H-55); ctx.lineTo(W-10,H-55); ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.5)'; ctx.font='10px Fira Code'; ctx.textAlign='center';
      ctx.fillText('Somme des '+p.ndice+' dé(s)',W/2,H-10);
      ctx.fillText(total+' lancers — loi normale émerge',W/2,18);
      setVal('<span>🎲 '+p.ndice+' dé(s)</span><span>'+total+' lancers</span><span>Courbe en cloche</span>');
      _simUpdateControls();
    };

  // â”€â”€ lv16 : Fonctions & Dérivées â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  } else if(lv.id==="lv16"){
    window._sim.params={a:1,b:0,c:-2,xtan:0}; window._sim.defaults={a:1,b:0,c:-2,xtan:0};
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      return "<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:4px'>a: <input type='range' min='-3' max='3' step='0.5' value='"+p.a+"' oninput='window._sim.params.a=+this.value' style='width:70px'><span>"+p.a+"</span></label>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:4px'>b: <input type='range' min='-5' max='5' step='0.5' value='"+p.b+"' oninput='window._sim.params.b=+this.value' style='width:70px'><span>"+p.b+"</span></label>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:4px'>c: <input type='range' min='-5' max='5' step='0.5' value='"+p.c+"' oninput='window._sim.params.c=+this.value' style='width:70px'><span>"+p.c+"</span></label>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:4px'>x₁€: <input type='range' min='-4' max='4' step='0.1' value='"+p.xtan+"' oninput='window._sim.params.xtan=+this.value' style='width:70px'><span>"+p.xtan+"</span></label>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var p=window._sim.params; ctx.clearRect(0,0,W,H);
      ctx.fillStyle='#0A1628'; ctx.fillRect(0,0,W,H);
      var ox=W/2, oy=H/2, sc=45;
      // Grid
      ctx.strokeStyle='rgba(255,255,255,.06)'; ctx.lineWidth=1;
      for(var gx=-8;gx<=8;gx++){ctx.beginPath();ctx.moveTo(ox+gx*sc,0);ctx.lineTo(ox+gx*sc,H);ctx.stroke();}
      for(var gy=-4;gy<=4;gy++){ctx.beginPath();ctx.moveTo(0,oy+gy*sc);ctx.lineTo(W,oy+gy*sc);ctx.stroke();}
      // Axes
      ctx.strokeStyle='rgba(255,255,255,.35)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(0,oy); ctx.lineTo(W,oy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox,0); ctx.lineTo(ox,H); ctx.stroke();
      // Axis labels
      ctx.fillStyle='rgba(255,255,255,.4)'; ctx.font='9px Fira Code'; ctx.textAlign='center';
      for(var gx2=-7;gx2<=7;gx2+=1){if(gx2!==0)ctx.fillText(gx2,ox+gx2*sc,oy+14);}
      ctx.textAlign='right';
      for(var gy2=-3;gy2<=3;gy2+=1){if(gy2!==0)ctx.fillText(-gy2,ox-5,oy+gy2*sc+4);}
      // f(x)
      ctx.strokeStyle='#87A9D3'; ctx.lineWidth=2.5;
      ctx.beginPath(); var first=true;
      for(var xi=-8;xi<=8;xi+=0.05){
        var y=p.a*xi*xi+p.b*xi+p.c;
        var cx2=ox+xi*sc, cy2=oy-y*sc;
        if(cy2<0||cy2>H){first=true;continue;}
        if(first){ctx.moveTo(cx2,cy2);first=false;}else ctx.lineTo(cx2,cy2);
      }
      ctx.stroke();
      // Tangent at x0
      var x0=p.xtan, y0=p.a*x0*x0+p.b*x0+p.c;
      var deriv=2*p.a*x0+p.b;
      var tx1=x0-2, ty1=y0-deriv*2, tx2=x0+2, ty2=y0+deriv*2;
      ctx.strokeStyle='#FFC93C'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(ox+tx1*sc,oy-ty1*sc); ctx.lineTo(ox+tx2*sc,oy-ty2*sc); ctx.stroke();
      // Point
      ctx.fillStyle='#C46F6F'; ctx.beginPath(); ctx.arc(ox+x0*sc,oy-y0*sc,5,0,Math.PI*2); ctx.fill();
      // Formula
      ctx.fillStyle='rgba(255,255,255,.06)'; ctx.fillRect(10,10,220,65);
      ctx.fillStyle='#87A9D3'; ctx.font='bold 12px Fira Code'; ctx.textAlign='left';
      ctx.fillText('f(x) = '+p.a+'x² + '+p.b+'x + '+p.c,18,32);
      ctx.fillStyle='#FFC93C'; ctx.font='11px Fira Code';
      ctx.fillText("f'(x) = "+(2*p.a)+'x + '+p.b,18,52);
      ctx.fillStyle='rgba(255,255,255,.7)'; ctx.font='10px Fira Code';
      ctx.fillText("f'("+x0+") = "+deriv.toFixed(2),18,68);
      setVal("<span>f(x)="+p.a+"x²+"+p.b+"x+"+p.c+"</span><span>f'("+x0+")="+deriv.toFixed(2)+"</span><span>f("+x0+")="+y0.toFixed(2)+"</span>");
      _simUpdateControls();
    };

  // â”€â”€ lv17 : Trigonométrie & Cercle Unitaire â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  } else if(lv.id==="lv17"){
    window._sim.params={angleDeg:45,speed:1}; window._sim.defaults={angleDeg:45,speed:1};
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      var rad=(p.angleDeg*Math.PI/180);
      return "<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>θ (degrés): <input type='range' min='0' max='360' value='"+p.angleDeg+"' oninput='window._sim.params.angleDeg=+this.value' style='width:120px'><span>"+p.angleDeg+"°</span></label>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px'>Vitesse: <input type='range' min='0' max='3' step='0.1' value='"+p.speed+"' oninput='window._sim.params.speed=+this.value' style='width:80px'><span>"+p.speed+"</span></label>"
        +"<span style='font-size:11px;color:#6C56A6;font-weight:700'>sin="+Math.sin(rad).toFixed(3)+" cos="+Math.cos(rad).toFixed(3)+" tan="+(Math.abs(Math.cos(rad))<0.01?'∝ž':Math.tan(rad).toFixed(3))+"</span>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var p=window._sim.params; var t=window._sim.t;
      p.angleDeg=(p.angleDeg+p.speed)%360;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0A1628'; ctx.fillRect(0,0,W,H);
      var cx=200, cy=H/2, R=130;
      // Grid
      ctx.strokeStyle='rgba(255,255,255,.06)'; ctx.lineWidth=1;
      for(var gi=-3;gi<=3;gi++){ctx.beginPath();ctx.moveTo(cx-R-20,cy+gi*R/2);ctx.lineTo(cx+R+20,cy+gi*R/2);ctx.stroke();}
      // Circle
      ctx.strokeStyle='rgba(255,255,255,.3)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.stroke();
      // Axes
      ctx.strokeStyle='rgba(255,255,255,.4)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(cx-R-15,cy); ctx.lineTo(cx+R+15,cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,cy-R-15); ctx.lineTo(cx,cy+R+15); ctx.stroke();
      // Point on circle
      var ang=p.angleDeg*Math.PI/180;
      var px=cx+R*Math.cos(ang), py=cy-R*Math.sin(ang);
      // cos projection (horizontal)
      ctx.strokeStyle='#87A9D3'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(px,cy); ctx.stroke();
      ctx.fillStyle='#87A9D3'; ctx.font='11px Fira Code'; ctx.textAlign='center';
      ctx.fillText('cos θ',cx+(px-cx)/2,cy+16);
      // sin projection (vertical)
      ctx.strokeStyle='#A3E635'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(px,cy); ctx.lineTo(px,py); ctx.stroke();
      ctx.fillStyle='#A3E635'; ctx.textAlign='left';
      ctx.fillText('sin θ',px+5,cy-(py-cy)/2);
      // Radius
      ctx.strokeStyle='#FFC93C'; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(px,py); ctx.stroke();
      // Angle arc
      ctx.strokeStyle='rgba(252,211,77,.5)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.arc(cx,cy,40,0,-ang,ang>Math.PI); ctx.stroke();
      ctx.fillStyle='#FFC93C'; ctx.font='bold 11px Fira Code'; ctx.textAlign='center';
      ctx.fillText(p.angleDeg+'°',cx+55*Math.cos(-ang/2),cy+55*Math.sin(-ang/2));
      // Point
      ctx.fillStyle='#C46F6F'; ctx.beginPath(); ctx.arc(px,py,7,0,Math.PI*2); ctx.fill();
      // Sin wave on right side
      var wox=430, woy=H/2, wsc=60;
      ctx.strokeStyle='rgba(163,230,53,.3)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(wox,woy-wsc); ctx.lineTo(wox,woy+wsc); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(wox,woy); ctx.lineTo(W-10,woy); ctx.stroke();
      ctx.strokeStyle='#A3E635'; ctx.lineWidth=2;
      ctx.beginPath();
      for(var xi=0;xi<(W-wox-10);xi++){
        var ang2=(xi/(W-wox-10))*Math.PI*2+ang;
        var ys=woy-Math.sin(ang2)*wsc;
        if(xi===0) ctx.moveTo(wox+xi,ys); else ctx.lineTo(wox+xi,ys);
      }
      ctx.stroke();
      // Current position marker on wave
      ctx.fillStyle='#C46F6F'; ctx.beginPath(); ctx.arc(wox,woy-Math.sin(ang)*wsc,5,0,Math.PI*2); ctx.fill();
      // Labels
      ctx.fillStyle='rgba(255,255,255,.5)'; ctx.font='9px Fira Code'; ctx.textAlign='center';
      ctx.fillText('1',cx+R+8,cy+4); ctx.fillText('-1',cx-R-14,cy+4);
      ctx.fillText('1',cx+4,cy-R-5); ctx.fillText('-1',cx+4,cy+R+12);
      setVal('<span>θ='+p.angleDeg+'°</span><span>sin='+Math.sin(ang).toFixed(3)+'</span><span>cos='+Math.cos(ang).toFixed(3)+'</span>');
      _simUpdateControls();
    };

  // â”€â”€ lv18 : La Mondialisation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  } else if(lv.id==="lv18"){
    var POLES=[
      {n:'Amérique N.',x:140,y:130,col:'#6A8DC7'},{n:'Europe',x:320,y:110,col:'#FFC93C'},
      {n:'Asie-Pacifique',x:520,y:120,col:'#C46F6F'},{n:'Afrique',x:320,y:230,col:'#4B9C69'},
      {n:'Amérique S.',x:180,y:270,col:'#9784D1'},{n:'Moyen-Orient',x:400,y:190,col:'#C07D4F'},
    ];
    var FLOWS=[
      {f:0,t:1,val:7200,label:'commerce'},{f:1,t:2,val:9400,label:'tech'},{f:2,t:0,val:8100,label:'manufact.'},
      {f:3,t:1,val:3200,label:'matières'},{f:0,t:3,val:1800,label:'aide'},{f:1,t:3,val:2600,label:'invest.'},
      {f:5,t:1,val:4200,label:'énergie'},{f:2,t:3,val:5100,label:'export'},{f:4,t:2,val:2300,label:'comm.'},
    ];
    window._sim.params={flow:0};
    window._sim.controlsDef=function(){
      return "<span style='font-size:11px;color:#142554;font-weight:700'>Arcs animés = flux commerciaux et financiers mondiaux</span>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var t=window._sim.t;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0A1628'; ctx.fillRect(0,0,W,H);
      // Draw flows
      FLOWS.forEach(function(fl,fi){
        var src=POLES[fl.f], dst=POLES[fl.t];
        var phase=(t*0.25+fi*0.11)%1;
        var mx=(src.x+dst.x)/2, my=(src.y+dst.y)/2-60;
        // Bezier arc
        ctx.strokeStyle=src.col+'44'; ctx.lineWidth=1+fl.val/3000;
        ctx.beginPath(); ctx.moveTo(src.x,src.y);
        ctx.quadraticCurveTo(mx,my,dst.x,dst.y); ctx.stroke();
        // Moving dot
        var bx,by;
        bx=Math.pow(1-phase,2)*src.x+2*(1-phase)*phase*mx+Math.pow(phase,2)*dst.x;
        by=Math.pow(1-phase,2)*src.y+2*(1-phase)*phase*my+Math.pow(phase,2)*dst.y;
        ctx.fillStyle=src.col; ctx.beginPath(); ctx.arc(bx,by,4,0,Math.PI*2); ctx.fill();
        // Value label at midpoint
        var lx=Math.pow(0.5,2)*src.x+2*0.5*0.5*mx+Math.pow(0.5,2)*dst.x;
        var ly=Math.pow(0.5,2)*src.y+2*0.5*0.5*my+Math.pow(0.5,2)*dst.y;
        ctx.fillStyle='rgba(255,255,255,.3)'; ctx.font='8px Fira Code'; ctx.textAlign='center';
        ctx.fillText(fl.label,lx,ly);
      });
      // Draw poles
      POLES.forEach(function(p,pi){
        ctx.fillStyle=p.col+'BB';
        ctx.beginPath(); ctx.arc(p.x,p.y,18+Math.sin(t*1.5+pi)*2,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle=p.col; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(p.x,p.y,22,0,Math.PI*2); ctx.stroke();
        ctx.fillStyle='rgba(255,255,255,.85)'; ctx.font='bold 9.5px Montserrat'; ctx.textAlign='center';
        ctx.fillText(p.n,p.x,p.y+36);
      });
      // Title
      ctx.fillStyle='rgba(255,255,255,.06)'; ctx.fillRect(10,H-55,W-20,45);
      ctx.fillStyle='#FFC93C'; ctx.font='bold 11px Montserrat'; ctx.textAlign='center';
      ctx.fillText('Triade (Am.N. / Europe / Asie) = 75% du PIB mondial',W/2,H-35);
      ctx.fillStyle='rgba(255,255,255,.5)'; ctx.font='10px Georgia';
      ctx.fillText('FMI • OMC • ONU • multinationales • délocalisation • dette',W/2,H-18);
      setVal('<span>🌍 3 pôles de la Triade</span><span>Flux commerce, capital, migr.</span>');
    };

  // â”€â”€ lv19 : Algorithmes & Programmation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  } else if(lv.id==="lv19"){
    var arr=[]; for(var ai=0;ai<18;ai++) arr.push(Math.round(20+Math.random()*200));
    var sortStep=0; var sorted=false; var comparing=[-1,-1]; var swapping=-1;
    window._sim.params={algo:'bubble',speed:1}; window._sim.defaults={algo:'bubble',speed:1};
    function resetArr(){ arr=[]; for(var ai2=0;ai2<18;ai2++) arr.push(Math.round(20+Math.random()*200)); sortStep=0;sorted=false;comparing=[-1,-1];swapping=-1; }
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      return "<button onclick=\"window._sim.params.algo='bubble';resetArr()\" style='background:"+(p.algo==='bubble'?'#142554':'#E8EEFF')+";color:"+(p.algo==='bubble'?'#FFC93C':'#142554')+";border:none;border-radius:8px;padding:5px 12px;font-size:11px;font-weight:700;cursor:pointer'>Tri Bulles</button>"
        +"<button onclick=\"window._sim.params.algo='select';resetArr()\" style='background:"+(p.algo==='select'?'#6C56A6':'#E8EEFF')+";color:"+(p.algo==='select'?'#fff':'#142554')+";border:none;border-radius:8px;padding:5px 12px;font-size:11px;font-weight:700;cursor:pointer;margin-left:4px'>Tri Sélection</button>"
        +"<label style='font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:4px;margin-left:8px'>Vitesse: <input type='range' min='0.5' max='5' step='0.5' value='"+p.speed+"' oninput='window._sim.params.speed=+this.value' style='width:70px'><span>×"+p.speed+"</span></label>"
        +"<button onclick='resetArr()' style='background:#C46F6F;color:#fff;border:none;border-radius:8px;padding:5px 12px;font-size:11px;font-weight:700;cursor:pointer;margin-left:4px'>🔀 Mélanger</button>";
    };
    _simUpdateControls();
    var lastStep=0;
    window._sim._draw=function(){
      var p=window._sim.params; var t=window._sim.t;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0A1628'; ctx.fillRect(0,0,W,H);
      // Step algorithm
      if(!sorted && t-lastStep > 0.5/p.speed){
        lastStep=t;
        if(p.algo==='bubble'){
          var n=arr.length-sortStep; var swapped=false;
          for(var bi=0;bi<n-1;bi++){
            if(arr[bi]>arr[bi+1]){var tmp=arr[bi];arr[bi]=arr[bi+1];arr[bi+1]=tmp;swapped=true;comparing=[bi,bi+1];}
          }
          sortStep++; if(!swapped||sortStep>arr.length) sorted=true;
        } else {
          var minIdx=sortStep;
          for(var si=sortStep+1;si<arr.length;si++) if(arr[si]<arr[minIdx]) minIdx=si;
          var tmp2=arr[sortStep];arr[sortStep]=arr[minIdx];arr[minIdx]=tmp2;
          comparing=[sortStep,minIdx]; sortStep++; if(sortStep>=arr.length) sorted=true;
        }
      }
      // Draw bars
      var bw=Math.floor((W-40)/arr.length)-2;
      arr.forEach(function(v,i){
        var bh=Math.round(v/220*(H-80));
        var bx=20+i*(bw+2);
        var isSorted=sorted||(p.algo==='bubble'?i>=arr.length-sortStep:i<sortStep);
        ctx.fillStyle=comparing.indexOf(i)>=0?'#C46F6F':(isSorted?'#4B9C69':'#87A9D3');
        ctx.fillRect(bx,H-50-bh,bw,bh);
        if(bw>14){ctx.fillStyle='rgba(255,255,255,.4)';ctx.font='9px Fira Code';ctx.textAlign='center';ctx.fillText(v,bx+bw/2,H-52-bh);}
      });
      // Status
      ctx.fillStyle='rgba(255,255,255,.06)'; ctx.fillRect(10,10,W-20,35);
      ctx.fillStyle='#FFC93C'; ctx.font='bold 12px Montserrat'; ctx.textAlign='center';
      ctx.fillText(sorted?'âœ… Tableau trié!':(p.algo==='bubble'?'Tri à bulles':'Tri par sélection')+' — Étape '+sortStep,W/2,32);
      setVal('<span>'+(sorted?'Terminé':'En cours')+'</span><span>Étape: '+sortStep+'</span><span>O(n²)</span>');
      _simUpdateControls();
    };

  // â”€â”€ lv20 : Conjugaison & Grammaire Française â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  } else if(lv.id==="lv20"){
    var verbs=[
      {inf:'aimer',gr:1,temps:{
        present:['aime','aimes','aime','aimons','aimez','aiment'],
        imparfait:['aimais','aimais','aimait','aimions','aimiez','aimaient'],
        futur:['aimerai','aimeras','aimera','aimerons','aimerez','aimeront'],
        passe_c:['ai aimé','as aimé','a aimé','avons aimé','avez aimé','ont aimé'],
      }},
      {inf:'finir',gr:2,temps:{
        present:['finis','finis','finit','finissons','finissez','finissent'],
        imparfait:['finissais','finissais','finissait','finissions','finissiez','finissaient'],
        futur:['finirai','finiras','finira','finirons','finirez','finiront'],
        passe_c:['ai fini','as fini','a fini','avons fini','avez fini','ont fini'],
      }},
      {inf:'être',gr:3,temps:{
        present:['suis','es','est','sommes','êtes','sont'],
        imparfait:['étais','étais','était','étions','étiez','étaient'],
        futur:['serai','seras','sera','serons','serez','seront'],
        passe_c:['ai été','as été','a été','avons été','avez été','ont été'],
      }},
      {inf:'avoir',gr:3,temps:{
        present:['ai','as','a','avons','avez','ont'],
        imparfait:['avais','avais','avait','avions','aviez','avaient'],
        futur:['aurai','auras','aura','aurons','aurez','auront'],
        passe_c:['ai eu','as eu','a eu','avons eu','avez eu','ont eu'],
      }},
      {inf:'aller',gr:3,temps:{
        present:['vais','vas','va','allons','allez','vont'],
        imparfait:['allais','allais','allait','allions','alliez','allaient'],
        futur:['irai','iras','ira','irons','irez','iront'],
        passe_c:['suis allé','es allé','est allé','sommes allés','êtes allés','sont allés'],
      }},
    ];
    var TEMPS_KEYS=['present','imparfait','futur','passe_c'];
    var TEMPS_LABELS={'present':'Présent','imparfait':'Imparfait','futur':'Futur simple','passe_c':'Passé composé'};
    var PRONOMS=['je','tu','il/elle','nous','vous','ils/elles'];
    window._sim.params={verb:0,temps:'present'}; window._sim.defaults={verb:0,temps:'present'};
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      var btnV=verbs.map(function(v,i){
        return "<button onclick='window._sim.params.verb="+i+"' style='background:"+(i===p.verb?'#142554':'#E8EEFF')+";color:"+(i===p.verb?'#FFC93C':'#142554')+";border:none;border-radius:8px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer'>"+v.inf+"</button>";
      }).join(' ');
      var btnT=TEMPS_KEYS.map(function(k){
        return "<button onclick=\"window._sim.params.temps='"+k+"'\" style='background:"+(k===p.temps?'#6C56A6':'#EDE9FE')+";color:"+(k===p.temps?'#fff':'#6C56A6')+";border:none;border-radius:8px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer'>"+TEMPS_LABELS[k]+"</button>";
      }).join(' ');
      return "<div style='margin-bottom:6px'>"+btnV+"</div>"+btnT;
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var p=window._sim.params; var t=window._sim.t;
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#0A1628'; ctx.fillRect(0,0,W,H);
      var vb=verbs[Math.max(0,Math.min(p.verb||0,verbs.length-1))]||verbs[0]; if(!vb)return;
      var forms=(vb.temps[p.temps]||vb.temps.present)||[]; if(!forms.length)return;
      // Background card
      ctx.fillStyle='rgba(255,255,255,.04)'; ctx.fillRect(20,20,W-40,H-40);
      // Verb title
      ctx.fillStyle='#FFC93C'; ctx.font='bold 24px Libre Baskerville,Georgia,serif'; ctx.textAlign='center';
      ctx.fillText(vb.inf.toUpperCase(),W/2,72);
      ctx.fillStyle='rgba(255,255,255,.4)'; ctx.font='12px Montserrat';
      ctx.fillText('Groupe '+vb.gr+' — '+TEMPS_LABELS[p.temps],W/2,96);
      // Table
      var cols=[[60,'Pronom'],[W/2+20,'Forme conjuguée']];
      var rowH=36, startY=120;
      // Header
      ctx.fillStyle='rgba(255,255,255,.08)'; ctx.fillRect(30,startY,W-60,rowH);
      cols.forEach(function(c){
        ctx.fillStyle='rgba(255,255,255,.6)'; ctx.font='bold 11px Montserrat'; ctx.textAlign='left';
        ctx.fillText(c[0],c[1],startY+22);
      });
      // Divider
      ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(W/2+10,startY); ctx.lineTo(W/2+10,startY+rowH*7); ctx.stroke();
      // Rows
      forms.forEach(function(form,ri){
        var ry=startY+rowH*(ri+1);
        var highlight=Math.floor(t*1.5)%6===ri;
        if(highlight){ ctx.fillStyle='rgba(252,211,77,.08)'; ctx.fillRect(30,ry,W-60,rowH); }
        ctx.fillStyle=highlight?'#FFC93C':'rgba(255,255,255,.85)';
        ctx.font=(highlight?'bold ':'')+'13px Libre Baskerville,Georgia,serif'; ctx.textAlign='left';
        ctx.fillText(PRONOMS[ri],60,ry+23);
        ctx.fillStyle=highlight?'#87A9D3':'rgba(163,230,53,.9)';
        ctx.font=(highlight?'bold ':'')+'13px Libre Baskerville,Georgia,serif';
        ctx.fillText(form,W/2+20,ry+23);
        // Small line between rows
        ctx.strokeStyle='rgba(255,255,255,.06)'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(30,ry+rowH); ctx.lineTo(W-30,ry+rowH); ctx.stroke();
      });
      // Group color indicator
      var grpCol={1:'#4B9C69',2:'#6A8DC7',3:'#C46F6F'};
      ctx.fillStyle=grpCol[vb.gr]; ctx.fillRect(30,30,6,H-60);
      setVal('<span>'+vb.inf+'</span><span>'+TEMPS_LABELS[p.temps]+'</span><span>Groupe '+vb.gr+'</span>');
      _simUpdateControls();
    };

  // ══ 14/11/2026 — cinq vraies simulations à la place du diaporama d'étapes (lv27, lv28, lv29, lv31, lv32) ══
  // Contrôles communs : curseur et bouton au style des autres labos.
  } else if(lv.id==="lv28"||lv.id==="lv27"||lv.id==="lv29"||lv.id==="lv31"||lv.id==="lv32"){
    var LB_LAB="font-size:11px;font-weight:700;color:#142554;display:flex;align-items:center;gap:6px";
    var lbCurseur=function(lib,cle,min,max,pas,unite){var v=window._sim.params[cle];return "<label style='"+LB_LAB+"'>"+lib+" <input type='range' min='"+min+"' max='"+max+"' step='"+pas+"' value='"+v+"' oninput='window._sim.params."+cle+"=+this.value' style='width:110px'><span>"+v+(unite||"")+"</span></label>";};
    var lbBouton=function(lib,code,actif){return "<button onclick=\""+code+"\" style='background:"+(actif?"#142554":"#E6ECF7")+";color:"+(actif?"#FFC93C":"#142554")+";border:none;border-radius:10px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer'>"+lib+"</button>";};
    var txt=function(s,x,y,coul,taille,align,gras){ctx.fillStyle=coul||'#E2E8F0';ctx.font=(gras?'bold ':'')+(taille||12)+'px Montserrat';ctx.textAlign=align||'left';ctx.fillText(s,x,y);};
    var fond=function(){ctx.clearRect(0,0,W,H);ctx.fillStyle='#0F172A';ctx.fillRect(0,0,W,H);};

    // ── lv28 : croisements de Mendel (monohybridisme, dominance complète) ──
    if(lv.id==="lv28"){
      var GEN=["LL","Ll","ll"];
      window._sim.params={p1:1,p2:1,n:0,tir:[0,0,0]}; window._sim.defaults={p1:1,p2:1,n:0,tir:[0,0,0]};
      window._lbTirer=function(k){var p=window._sim.params,a=GEN[p.p1],b=GEN[p.p2];for(var i=0;i<k;i++){var g=a[Math.random()<.5?0:1]+b[Math.random()<.5?0:1];var c=(g==="LL")?0:(g==="ll")?2:1;p.tir[c]++;p.n++;}};
      window._sim.controlsDef=function(){var p=window._sim.params,s="";
        s+="<span style='"+LB_LAB+"'>Parent 1 :</span>"+GEN.map(function(g,i){return lbBouton(g,"window._sim.params.p1="+i+";window._sim.params.n=0;window._sim.params.tir=[0,0,0]",p.p1===i)}).join(" ");
        s+="<span style='"+LB_LAB+"'>Parent 2 :</span>"+GEN.map(function(g,i){return lbBouton(g,"window._sim.params.p2="+i+";window._sim.params.n=0;window._sim.params.tir=[0,0,0]",p.p2===i)}).join(" ");
        s+=lbBouton("Semer 100 graines","window._lbTirer(100)",true)+" "+lbBouton("Vider","window._sim.params.n=0;window._sim.params.tir=[0,0,0]",false);
        return s;};
      _simUpdateControls();
      var pois=function(x,y,r,ride,coul){ctx.save();ctx.translate(x,y);ctx.beginPath();for(var a=0;a<=Math.PI*2+.01;a+=Math.PI/24){var rr=r*(ride?(1+.12*Math.sin(a*7)):1);ctx.lineTo(rr*Math.cos(a),rr*Math.sin(a));}ctx.closePath();ctx.fillStyle=coul;ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1;ctx.stroke();ctx.restore();};
      window._sim._draw=function(){var p=window._sim.params,t=window._sim.t,a=GEN[p.p1],b=GEN[p.p2];fond();
        txt("Échiquier de croisement (L lisse, dominant ; l ridé, récessif)",20,24,'#FFC93C',13,'left',true);
        var x0=70,y0=70,c=62;
        txt("gamètes P1",x0+c,y0-16,'#93C5FD',11,'center');txt("gamètes P2",x0-38,y0+c+4,'#F9A8D4',11,'center');
        for(var i=0;i<2;i++){txt(a[i],x0+c*(i+.5)+c/2,y0+4,'#93C5FD',16,'center',true);txt(b[i],x0-8,y0+c*(i+.5)+c/2+18,'#F9A8D4',16,'center',true);}
        var nb=[0,0,0];
        for(var r=0;r<2;r++)for(var k=0;k<2;k++){var g=[a[k],b[r]].sort().join(""),X=x0+c*(k+.5),Y=y0+12+c*r,ride=(g==="ll");
          nb[g==="LL"?0:g==="ll"?2:1]++;
          var pulse=1+.05*Math.sin(t*3+r+k);
          ctx.strokeStyle='rgba(255,255,255,.25)';ctx.strokeRect(X,Y,c,c);
          pois(X+c/2,Y+c/2-6,15*pulse,ride,ride?'#9CA35A':'#8BC34A');txt(g,X+c/2,Y+c-8,'#E2E8F0',12,'center',true);}
        // proportions attendues
        var px=300;txt("Attendu (probabilités)",px,62,'#E2E8F0',12,'left',true);
        var lis=nb[0]+nb[1],rid=nb[2];
        [["lisses",lis/4,'#8BC34A'],["ridés",rid/4,'#9CA35A']].forEach(function(e,i){var y=78+i*30;ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(px,y,200,20);ctx.fillStyle=e[2];ctx.fillRect(px,y,200*e[1],20);txt(e[0]+" : "+Math.round(e[1]*100)+" %",px+208,y+15,'#E2E8F0',12);});
        txt("Génotypes : LL "+nb[0]+"/4 · Ll "+nb[1]+"/4 · ll "+nb[2]+"/4",px,152,'#CBD5E1',12);
        // tirage
        txt("Observé sur "+p.n+" graines semées",px,190,'#E2E8F0',12,'left',true);
        var ol=p.tir[0]+p.tir[1],or=p.tir[2];
        if(p.n){[["lisses",ol/p.n,'#8BC34A'],["ridés",or/p.n,'#9CA35A']].forEach(function(e,i){var y=204+i*30;ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(px,y,200,20);ctx.fillStyle=e[2];ctx.fillRect(px,y,200*e[1],20);txt(e[0]+" : "+Math.round(e[1]*100)+" %",px+208,y+15,'#E2E8F0',12);});
          txt(or?("Rapport lisses / ridés ≈ "+(ol/or).toFixed(2)+" : 1"):"Aucun ridé",px,282,'#FFC93C',13,'left',true);}
        else txt("Clique « Semer 100 graines » pour comparer au calcul.",px,214,'#94A3B8',12);
        txt(p.p1===1&&p.p2===1?"Ll × Ll : 3/4 lisses, 1/4 ridés (2e loi de Mendel, ségrégation)":p.p1+p.p2===2&&p.p1!==1?"LL × ll : F1 100 % Ll lisses (1re loi, uniformité)":(p.p1===2||p.p2===2)&&(p.p1===1||p.p2===1)?"Ll × ll : croisement-test, 1/2 lisses, 1/2 ridés":"",20,H-16,'#A5B4FC',12);
        setVal('<span>P1 '+a+' × P2 '+b+'</span><span>Lisses attendus '+Math.round(lis/4*100)+' %</span><span>'+p.n+' graines</span>');
        _simUpdateControls();};

    // ── lv27 : réponse immunitaire primaire et secondaire, effet du vaccin ──
    } else if(lv.id==="lv27"){
      window._sim.params={vaccin:1,jour:30}; window._sim.defaults={vaccin:1,jour:30};
      window._sim.controlsDef=function(){var p=window._sim.params;
        return lbBouton("Vacciné","window._sim.params.vaccin=1",p.vaccin===1)+" "+lbBouton("Non vacciné","window._sim.params.vaccin=0",p.vaccin===0)+" "+lbCurseur("Contamination au jour","jour",10,80,1,"");};
      _simUpdateControls();
      // anticorps : primaire lente et faible (pic ~ 12 j), secondaire rapide et forte (pic ~ 5 j)
      var bosse=function(t,t0,delai,haut,larg){var d=t-t0-delai;return d<-delai?0:haut*Math.exp(-d*d/(2*larg*larg))*(d<0?Math.exp(d/2):1);};
      window._sim._draw=function(){var p=window._sim.params,T=100,x0=60,x1=W-30,y0=H-50,y1=40;fond();
        var X=function(j){return x0+(x1-x0)*j/T},Y=function(v){return y0-(y0-y1)*v};
        ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x0,y1);ctx.lineTo(x0,y0);ctx.lineTo(x1,y0);ctx.stroke();
        for(var j=0;j<=T;j+=20)txt(j+" j",X(j),y0+16,'#94A3B8',10,'center');
        txt("concentration",x0-6,y1-8,'#94A3B8',10,'left');
        var seuil=.55;ctx.setLineDash([5,4]);ctx.strokeStyle='#F87171';ctx.beginPath();ctx.moveTo(x0,Y(seuil));ctx.lineTo(x1,Y(seuil));ctx.stroke();ctx.setLineDash([]);
        txt("seuil de la maladie (charge en microbes)",x1,Y(seuil)-6,'#F87171',10,'right');
        var an=function(j){var a=0;if(p.vaccin)a+=bosse(j,0,12,.22,6)+(j>12?.08*Math.exp(-(j-12)/60):0);if(j>=p.jour)a+=p.vaccin?bosse(j,p.jour,5,1,5):bosse(j,p.jour,12,.4,7);return Math.min(1.1,a);};
        var mic=function(j){if(j<p.jour)return 0;var d=j-p.jour,croit=.06*Math.exp(d*.35),fin=p.vaccin?6:15;return Math.max(0,Math.min(1,croit)*(d<fin?1:Math.exp(-(d-fin)/3)));};
        var tmax=Math.min(T,(window._sim.t*12)%(T+20));
        [["anticorps",an,'#34D399'],["microbes",mic,'#F59E0B']].forEach(function(c){ctx.strokeStyle=c[2];ctx.lineWidth=2.5;ctx.beginPath();for(var j=0;j<=tmax;j+=.5){var yy=Y(c[1](j));j?ctx.lineTo(X(j),yy):ctx.moveTo(X(j),yy);}ctx.stroke();});
        if(p.vaccin){ctx.fillStyle='#93C5FD';ctx.beginPath();ctx.moveTo(X(0),y0);ctx.lineTo(X(0)-6,y0+10);ctx.lineTo(X(0)+6,y0+10);ctx.fill();txt("vaccin",X(0)+8,y0-6,'#93C5FD',10);}
        ctx.fillStyle='#F59E0B';ctx.beginPath();ctx.moveTo(X(p.jour),y0);ctx.lineTo(X(p.jour)-6,y0+10);ctx.lineTo(X(p.jour)+6,y0+10);ctx.fill();txt("contamination",X(p.jour)+8,y0-6,'#F59E0B',10);
        var pic=0;for(var j=p.jour;j<T;j++)pic=Math.max(pic,mic(j));var malade=pic>seuil;
        txt("anticorps",x1-150,y1+4,'#34D399',11,'left',true);txt("microbes",x1-70,y1+4,'#F59E0B',11,'left',true);
        txt(p.vaccin?"Réponse SECONDAIRE : rapide et forte, grâce aux lymphocytes mémoire":"Réponse PRIMAIRE : lente (≈ 12 jours) et faible",x0,22,'#FFC93C',12,'left',true);
        setVal('<span>'+(p.vaccin?'Vacciné':'Non vacciné')+'</span><span>Contamination au jour '+p.jour+'</span><span>'+(malade?'La maladie se déclare':'Pas de maladie : les microbes sont éliminés à temps')+'</span>');
        _simUpdateControls();};

    // ── lv29 : test de dépistage et formule de Bayes, sur 1 000 personnes ──
    } else if(lv.id==="lv29"){
      window._sim.params={prev:5,sens:95,spec:90}; window._sim.defaults={prev:5,sens:95,spec:90};
      window._sim.controlsDef=function(){return lbCurseur("Malades dans la population","prev",1,50,1," %")+lbCurseur("Sensibilité","sens",50,100,1," %")+lbCurseur("Spécificité","spec",50,100,1," %");};
      _simUpdateControls();
      window._sim._draw=function(){var p=window._sim.params;fond();
        var N=1000,M=Math.round(N*p.prev/100),VP=Math.round(M*p.sens/100),FN=M-VP,S=N-M,VN=Math.round(S*p.spec/100),FP=S-VN;
        var cols=40,cel=7.2,gx=20,gy=34,k=0;
        var cat=function(i){return i<VP?0:i<M?1:i<M+FP?2:3};
        var coul=['#EF4444','#7F1D1D','#F59E0B','#334155'];
        for(var i=0;i<N;i++){var x=gx+(i%cols)*cel,y=gy+Math.floor(i/cols)*cel;ctx.fillStyle=coul[cat(i)];ctx.fillRect(x,y,cel-1.4,cel-1.4);}
        txt("1 000 personnes testées",gx,22,'#FFC93C',12,'left',true);
        var lx=330,ly=40;[[0,"malades, test positif",VP],[1,"malades, test négatif",FN],[2,"sains, test positif (faux positifs)",FP],[3,"sains, test négatif",VN]].forEach(function(e,i){ctx.fillStyle=coul[e[0]];ctx.fillRect(lx,ly+i*22,12,12);txt(e[2]+" "+e[1],lx+18,ly+i*22+11,'#E2E8F0',12);});
        var pp=VP+FP,ppv=pp?VP/pp:0;
        txt("Si le test est positif :",lx,150,'#E2E8F0',13,'left',true);
        txt("P(malade | +) = "+VP+" / ("+VP+" + "+FP+") = "+(ppv*100).toFixed(1)+" %",lx,172,'#FFC93C',14,'left',true);
        txt("Formule de Bayes :",lx,206,'#CBD5E1',12);
        txt("P(M|+) = P(+|M)·P(M) / P(+)",lx,226,'#CBD5E1',12);
        txt("= "+(p.sens/100).toFixed(2)+" × "+(p.prev/100).toFixed(2)+" / "+(pp/N).toFixed(3),lx,246,'#CBD5E1',12);
        txt(ppv<.5?"Peu de malades : la plupart des positifs sont… des faux positifs.":"La plupart des positifs sont vraiment malades.",lx,282,ppv<.5?'#F59E0B':'#34D399',12,'left',true);
        setVal('<span>Prévalence '+p.prev+' %</span><span>Positifs : '+pp+'</span><span>P(malade | +) = '+(ppv*100).toFixed(1)+' %</span>');
        _simUpdateControls();};

    // ── lv31 : estérification, équilibre et rendement ──
    } else if(lv.id==="lv31"){
      window._sim.params={exces:1,classe:0,eau:0}; window._sim.defaults={exces:1,classe:0,eau:0};
      window._sim.controlsDef=function(){var p=window._sim.params;
        return lbCurseur("Alcool pour 1 mol d'acide","exces",1,5,.5," mol")+["primaire","secondaire","tertiaire"].map(function(c,i){return lbBouton("Alcool "+c,"window._sim.params.classe="+i+";window._sim.t=0",p.classe===i)}).join(" ")+" "+lbBouton(p.eau?"Eau retirée":"Eau laissée","window._sim.params.eau=1-window._sim.params.eau;window._sim.t=0",!!p.eau);};
      _simUpdateControls();
      var K=[4,2.25,.005];
      // x²/((1−x)(n−x)) = K, racine dans [0, min(1,n)]
      var rend=function(n,k){var lo=0,hi=Math.min(1,n);for(var i=0;i<60;i++){var m=(lo+hi)/2;(m*m/((1-m)*(n-m)+1e-12)<k)?lo=m:hi=m;}return lo;};
      window._sim._draw=function(){var p=window._sim.params,t=window._sim.t;fond();
        var xe=p.eau?Math.min(.99,p.classe===2?.35:.98):rend(p.exces,K[p.classe]);
        var vit=[.35,.25,.08][p.classe],x=xe*(1-Math.exp(-vit*t*2));
        var x0=50,x1=360,y0=H-50,y1=50,X=function(s){return x0+(x1-x0)*s/10},Y=function(v){return y0-(y0-y1)*v};
        ctx.strokeStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.moveTo(x0,y1);ctx.lineTo(x0,y0);ctx.lineTo(x1,y0);ctx.stroke();
        txt("rendement",x0-4,y1-10,'#94A3B8',10);txt("temps (h)",x1,y0+18,'#94A3B8',10,'right');
        [0,.5,1].forEach(function(v){txt(Math.round(v*100)+" %",x0-6,Y(v)+4,'#94A3B8',10,'right');});
        ctx.setLineDash([5,4]);ctx.strokeStyle='#FFC93C';ctx.beginPath();ctx.moveTo(x0,Y(xe));ctx.lineTo(x1,Y(xe));ctx.stroke();ctx.setLineDash([]);
        txt("équilibre : "+Math.round(xe*100)+" %",x1,Y(xe)-6,'#FFC93C',11,'right',true);
        ctx.strokeStyle='#34D399';ctx.lineWidth=2.5;ctx.beginPath();for(var s=0;s<=Math.min(10,t*2);s+=.1){var v=xe*(1-Math.exp(-vit*s));s?ctx.lineTo(X(s),Y(v)):ctx.moveTo(X(s),Y(v));}ctx.stroke();ctx.lineWidth=1;
        // bilan en moles
        var bx=420,mol=[["acide",1-x,'#F87171'],["alcool",p.exces-x,'#93C5FD'],["ester",x,'#34D399'],["eau",p.eau?0:x,'#38BDF8']];
        txt("Quantités (mol)",bx,46,'#E2E8F0',12,'left',true);
        mol.forEach(function(m,i){var y=62+i*40;ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(bx,y,180,22);ctx.fillStyle=m[2];ctx.fillRect(bx,y,180*Math.min(1,m[1]/Math.max(1,p.exces)),22);txt(m[0]+" : "+m[1].toFixed(2),bx+6,y+16,'#0F172A',12,'left',true);});
        txt("R–COOH + R'–OH ⇌ R–COO–R' + H₂O",bx,240,'#CBD5E1',12);
        txt(p.eau?"Retirer l'eau déplace l'équilibre vers l'ester.":p.exces>1?"Un excès d'alcool déplace l'équilibre.":"Mélange équimolaire : réaction limitée.",bx,266,'#A5B4FC',12);
        setVal('<span>Alcool '+["primaire","secondaire","tertiaire"][p.classe]+'</span><span>'+p.exces+' mol d\'alcool</span><span>Rendement '+Math.round(x*100)+' % (équilibre '+Math.round(xe*100)+' %)</span>');
        _simUpdateControls();};

    // ── lv32 : effet de serre et température moyenne, rétroaction de la glace ──
    } else {
      window._sim.params={co2:420,glace:1}; window._sim.defaults={co2:420,glace:1};
      window._sim.controlsDef=function(){var p=window._sim.params;return lbCurseur("CO₂ dans l'air","co2",280,1000,10," ppm")+" "+lbBouton(p.glace?"Rétroaction glace : oui":"Rétroaction glace : non","window._sim.params.glace=1-window._sim.params.glace",!!p.glace);};
      _simUpdateControls();
      window._sim._draw=function(){var p=window._sim.params,t=window._sim.t;fond();
        var dF=5.35*Math.log(p.co2/280),dT=.8*dF*(p.glace?1.25:1),T=14+dT,glace=Math.max(0,1-dT/4.5);
        // Terre
        var cx=150,cy=H/2+10,R=95;
        var g=ctx.createRadialGradient(cx-30,cy-30,10,cx,cy,R);g.addColorStop(0,'#3B82F6');g.addColorStop(1,'#1E3A8A');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#22C55E';ctx.beginPath();ctx.ellipse(cx-25,cy+5,30,22,.4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(cx+30,cy-15,22,30,-.3,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#B8C4D4';ctx.beginPath();ctx.ellipse(cx,cy-R+6,48*glace+4,14*glace+2,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(cx,cy+R-6,52*glace+4,14*glace+2,0,0,Math.PI*2);ctx.fill();
        // atmosphère : épaisseur selon le CO2
        ctx.strokeStyle='rgba(248,113,113,'+(.15+.5*(p.co2-280)/720)+')';ctx.lineWidth=6+14*(p.co2-280)/720;ctx.beginPath();ctx.arc(cx,cy,R+14,0,Math.PI*2);ctx.stroke();ctx.lineWidth=1;
        // rayonnement : soleil → sol, infrarouge renvoyé
        for(var i=0;i<4;i++){var ph=(t*.6+i/4)%1,ax=cx+R+150-ph*130,ay=40+i*10+ph*40;ctx.strokeStyle='#FDE047';ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax-10,ay+4);ctx.stroke();}
        for(var j=0;j<5;j++){var q=(t*.5+j/5)%1,rx=cx+50+j*8,ry=cy-R*.4-q*60,retour=q>.5&&j<1+Math.round(3*(p.co2-280)/720);ctx.strokeStyle=retour?'#F87171':'#FB923C';ctx.beginPath();ctx.moveTo(rx,retour?cy-R*.4-(1-q)*60:ry);ctx.lineTo(rx+4,(retour?cy-R*.4-(1-q)*60:ry)-6);ctx.stroke();}
        // thermomètre
        var tx=360,ty0=270,ty1=60,TT=function(v){return ty0-(ty0-ty1)*(v-10)/14};
        ctx.fillStyle='rgba(255,255,255,.1)';ctx.fillRect(tx,ty1,18,ty0-ty1);ctx.fillStyle=T>16?'#EF4444':'#F59E0B';ctx.fillRect(tx,TT(T),18,ty0-TT(T));
        [10,14,18,22].forEach(function(v){txt(v+" °C",tx+26,TT(v)+4,'#94A3B8',10);});
        txt("Température moyenne : "+T.toFixed(1)+" °C",430,70,'#FFC93C',14,'left',true);
        txt("Réchauffement : +"+dT.toFixed(1)+" °C depuis 1850",430,96,'#E2E8F0',12);
        txt("Forçage radiatif : +"+dF.toFixed(2)+" W/m²",430,118,'#CBD5E1',12);
        txt("Banquise : "+Math.round(glace*100)+" % de son étendue",430,140,'#E2E8F0',12);
        txt(p.co2<=290?"Niveau préindustriel (≈ 280 ppm).":p.co2<=430?"Proche d'aujourd'hui (≈ 420 ppm).":"Au-delà de +2 °C : risques forts.",430,176,'#A5B4FC',12);
        if(p.glace){txt("Moins de glace → moins de lumière renvoyée",430,198,'#A5B4FC',11);txt("→ encore plus de chaleur (rétroaction).",430,214,'#A5B4FC',11);}else txt("Sans rétroaction : réchauffement plus faible.",430,198,'#A5B4FC',11);
        setVal('<span>CO₂ '+p.co2+' ppm</span><span>T = '+T.toFixed(1)+' °C</span><span>+'+dT.toFixed(1)+' °C</span>');
        _simUpdateControls();};
    }

  // ── FALLBACK GÉNÉRIQUE AMÉLIORÉ (slideshow des étapes d'expérience) ────
  } else {
    window._sim.params={stepIdx:0,autoPlay:true};
    window._sim.controlsDef=function(){
      var p=window._sim.params;
      var totalSteps=(lv.experience||[]).length;
      return "<button onclick='window._sim.params.stepIdx=Math.max(0,window._sim.params.stepIdx-1);window._sim.params.autoPlay=false;window._sim.t=0' style='background:#142554;color:#FFC93C;border:none;border-radius:8px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer'>← Étape précédente</button>"
        +"<button onclick='window._sim.params.autoPlay=!window._sim.params.autoPlay' style='background:#6C56A6;color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer'>"+(p.autoPlay?'⏸ Pause':'▶ Auto')+"</button>"
        +"<button onclick='window._sim.params.stepIdx=Math.min("+(totalSteps-1)+",window._sim.params.stepIdx+1);window._sim.params.autoPlay=false;window._sim.t=0' style='background:#142554;color:#FFC93C;border:none;border-radius:8px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer'>Étape suivante →</button>"
        +"<span style='font-size:11px;color:#142554;font-weight:700;margin-left:8px'>Étape "+(p.stepIdx+1)+"/"+totalSteps+"</span>";
    };
    _simUpdateControls();
    window._sim._draw=function(){
      var t=window._sim.t; ctx.clearRect(0,0,W,H);
      var p=window._sim.params;
      var steps=lv.experience||[];
      var totalSteps=steps.length;
      // Auto-play : changer d'étape toutes les 6 secondes
      if(p.autoPlay && t>0 && t%6 < 0.05 && totalSteps>1){
        p.stepIdx=(p.stepIdx+1) % totalSteps;
        _simUpdateControls();
      }
      // Fond animé : particules colorées
      var col1={r:20,g:37,b:84},col2={r:124,g:58,b:237};
      var bg=ctx.createLinearGradient(0,0,W,H);
      bg.addColorStop(0,'rgba(20,37,84,.95)');bg.addColorStop(1,'rgba(15,23,42,.95)');
      ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
      // Particules dorées en arrière-plan
      for(var i=0;i<25;i++){
        var px=(Math.sin(t*0.4+i*7.3)*0.5+0.5)*W;
        var py=(Math.cos(t*0.3+i*5.1)*0.5+0.5)*H;
        var sz=1.5+Math.sin(t*1.5+i)*1.2;
        ctx.fillStyle='rgba(255,201,60,'+(0.15+Math.sin(t+i*0.7)*0.1)+')';
        ctx.beginPath();ctx.arc(px,py,sz,0,Math.PI*2);ctx.fill();
      }
      // Titre du lab en haut
      ctx.textAlign='center';
      ctx.fillStyle='rgba(255,201,60,.95)';
      ctx.font='bold 17px Montserrat,sans-serif';
      ctx.fillText(lv.ico+' '+lv.titre,W/2,28);
      ctx.fillStyle='rgba(255,255,255,.6)';
      ctx.font='11px Georgia,serif';
      ctx.fillText(lv.matiere+' • '+lv.classe,W/2,44);
      // Étape courante affichée comme un encadré
      var step=steps[p.stepIdx]||'';
      // Boîte centrale
      var boxX=40,boxY=64,boxW=W-80,boxH=H-90;
      var grad=ctx.createLinearGradient(boxX,boxY,boxX+boxW,boxY+boxH);
      grad.addColorStop(0,'rgba(255,255,255,.06)');grad.addColorStop(1,'rgba(255,201,60,.08)');
      ctx.fillStyle=grad;
      // Roundrect manuel
      var r=14;
      ctx.beginPath();
      ctx.moveTo(boxX+r,boxY);ctx.lineTo(boxX+boxW-r,boxY);ctx.quadraticCurveTo(boxX+boxW,boxY,boxX+boxW,boxY+r);
      ctx.lineTo(boxX+boxW,boxY+boxH-r);ctx.quadraticCurveTo(boxX+boxW,boxY+boxH,boxX+boxW-r,boxY+boxH);
      ctx.lineTo(boxX+r,boxY+boxH);ctx.quadraticCurveTo(boxX,boxY+boxH,boxX,boxY+boxH-r);
      ctx.lineTo(boxX,boxY+r);ctx.quadraticCurveTo(boxX,boxY,boxX+r,boxY);
      ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(255,201,60,.4)';ctx.lineWidth=1.5;ctx.stroke();
      // Texte de l'étape avec wrap
      ctx.fillStyle='#FFC93C';ctx.font='bold 13px Montserrat,sans-serif';ctx.textAlign='left';
      ctx.fillText('ÉTAPE '+(p.stepIdx+1)+'/'+totalSteps,boxX+18,boxY+24);
      // Wrap du contenu
      ctx.fillStyle='rgba(255,255,255,.92)';ctx.font='12.5px Georgia,serif';
      var words=String(step).split(' '),line='',lines=[],maxW=boxW-36;
      words.forEach(function(w){
        var test=(line?line+' ':'')+w;
        if(ctx.measureText(test).width>maxW && line){lines.push(line);line=w;}
        else line=test;
      });
      if(line)lines.push(line);
      lines.slice(0,12).forEach(function(l,li){
        ctx.fillText(l,boxX+18,boxY+50+li*18);
      });
      // Progression
      var pct=totalSteps>1?(p.stepIdx/(totalSteps-1)):1;
      ctx.fillStyle='rgba(255,255,255,.15)';
      ctx.fillRect(boxX,boxY+boxH-6,boxW,3);
      ctx.fillStyle='rgba(255,201,60,.9)';
      ctx.fillRect(boxX,boxY+boxH-6,boxW*pct,3);
      setVal('<span>📍 Étape '+(p.stepIdx+1)+'/'+totalSteps+'</span><span>'+lv.matiere+'</span><span>'+(p.autoPlay?'▶ Auto-play':'⏸ Manuel')+'</span>');
    };
  }

  // Démarrer la boucle d'animation
  window._sim.running=true;
  _simLoop();
}
window._initLaboSim = _initLaboSim;
