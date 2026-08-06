/* VÉRITAS — base des laboratoires virtuels (chargée à la demande).
   88 Ko qu'un visiteur venu lire un corrigé n'ouvrira jamais. Chargée par
   _lazyChunk('labo') depuis showLabosVirtuels() et les écrans qui en
   dépendent. Extraite d'app.js le 04/08/2026. */
window.LABO_DB=[
  // ─ PHYSIQUE ─
  {id:"lv1",titre:"Circuit Électrique Interactif",matiere:"Physique",cat:"physique",
   classe:"4ème-3ème-2nde",ico:"⚡",color:"#0891B2",gratuit:true,
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
   classe:"2nde-1ère",ico:"🚀",color:"#1E3A8A",gratuit:true,
   desc:"Lois de Newton, poids, chute libre, énergie mécanique et forces de frottement. Programme 2nde–1ère.",
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
     {q:"La 3ème loi de Newton (action-réaction) :",opts:["S'applique uniquement aux corps en mouvement","Les forces s'exercent sur le même corps","Deux corps exercent sur l'autre des forces égales et opposées","N'est valable qu'en chute libre"],ans:2,exp:"Si A exerce F sur B, alors B exerce -F sur A. Forces égales, opposées, corps différents."},
     {q:"Objet en MRU (mouvement rectiligne uniforme). La résultante des forces est :",opts:["Maximale","Égale à ma","Nulle","Vers le bas"],ans:2,exp:"1ère loi : résultante nulle → immobile ou MRU. Pas de force nette = pas d'accélération."},
     {q:"Énergie cinétique d'un objet 2kg à 6 m/s :",opts:["12 J","24 J","36 J","72 J"],ans:2,exp:"Ec = ½mv² = ½×2×36 = 36 J."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:"Premium"},

  {id:"lv9",titre:"Optique & Propagation de la Lumière",matiere:"Physique",cat:"physique",
   classe:"2nde-1ère-Tle",ico:"🔭",color:"#0E7490",gratuit:true,
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
   classe:"1ère-Tle",ico:"🌡️",color:"#AE5353",gratuit:false,plan:"Sciences",
   desc:"Transferts de chaleur, capacité calorifique, changements d'état et lois des gaz parfaits.",
   theorie:"🌡️ Q = m×c×ΔT (Q en J, m en kg, c = capacité thermique massique).\nc_eau = 4180 J/kg·K ; c_fer = 450 J/kg·K.\n\n🧊 Changement d'état : Q = m×L (L = chaleur latente). L_fusion_glace = 334 kJ/kg.\n\n⚖️ Mélange : Q_cédée + Q_reçue = 0 (système isolé).\n\n⚗️ Gaz parfaits : PV = nRT (R = 8,314 J/mol·K ; T en Kelvin = °C + 273).\nBoyle : PV = cste (T fixe). Gay-Lussac : P/T = cste (V fixe).",
   experience:[
     "1️⃣ CALORIMÈTRE — MESURE DE C : verse 200g d'eau à 20°C dans un calorimètre. Chauffe un bloc de métal à 100°C, plonge-le dans l'eau. Mesure la température finale T_éq. Applique : m_métal×c_métal×(100-T_éq) = m_eau×4180×(T_éq-20). Déduis c_métal.",
     "2️⃣ CHANGEMENT D'ÉTAT — PALIER : mets des glaçons dans un bécher. Chauffe à puissance constante. Relève T toutes les minutes. Trace la courbe. Observe : pendant la fonte (0°C), T ne change pas malgré le chauffage → énergie absorbée = chaleur latente L.",
     "3️⃣ MÉLANGE D'EAU : mesure 100g d'eau chaude (T₁=80°C) dans un bécher, 100g d'eau froide (T₂=20°C) dans un autre. Mélange. Mesure T_eq. Compare avec la prévision : T_eq = (T₁+T₂)/2 = 50°C. Pourquoi l'écart ?",
     "4️⃣ SERINGUE ET GAZ (loi de Boyle) : bouche une seringue avec le doigt (V constant). Essaie de comprimer. Ressens la pression augmenter. Avec une seringue + manomètre : comprime le volume de moitié → la pression double.",
     "5️⃣ DILATATION THERMIQUE : chauffe un ballon en caoutchouc partiellement gonflé. Observe : il gonfle davantage (gaz se dilate). Refroidis : il se dégonfle. La pression à volume constant augmente avec T.",
     "6️⃣ ISOLATION THERMIQUE : mets de l'eau chaude (60°C) dans deux récipients : l'un bien isolé (coton, polystyrène), l'autre nu. Mesure la température toutes les 5 minutes pendant 30 min. Compare les courbes de refroidissement.",
     "7️⃣ COMBUSTION ET CALORIMÉTRIE : brûle une noix ou un morceau de biscuit sous un bécher d'eau. Mesure ΔT de l'eau. Calcule Q = m×4180×ΔT. Estime l'énergie (kJ/g) contenue dans l'aliment.",
   ],
   quiz:[
     {q:"On chauffe 1kg d'eau (c=4180) de 20°C à 70°C :",opts:["4 180 J","41 800 J","209 000 J","418 000 J"],ans:2,exp:"Q = 1×4180×50 = 209 000 J."},
     {q:"27°C en Kelvin :",opts:["27 K","127 K","300 K","327 K"],ans:2,exp:"T(K) = T(°C) + 273 = 300 K."},
     {q:"La chaleur latente correspond à :",opts:["L'énergie pour chauffer","L'énergie pour changer d'état à T constante","La capacité thermique","La conduction"],ans:1,exp:"Chaleur latente = énergie de changement d'état sans variation de température (fusion, vaporisation)."},
     {q:"Gaz à 200kPa et 400K, chauffé à 800K (V=cste). Nouvelle pression :",opts:["100 kPa","200 kPa","400 kPa","800 kPa"],ans:2,exp:"Gay-Lussac : P/T = cste → P₂ = 200×800/400 = 400 kPa."},
     {q:"L'eau a une capacité thermique plus élevée que le fer. Donc :",opts:["L'eau chauffe plus vite","L'eau nécessite plus d'énergie pour la même ΔT","L'eau conduit mieux","L'eau bout plus vite"],ans:1,exp:"c_eau=4180 >> c_fer=450 → l'eau stocke beaucoup d'énergie (régulateur thermique : océans, radiateurs)."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:"Sciences"},

  // ─ CHIMIE ─
  {id:"lv3",titre:"Réactions Acide-Base",matiere:"Physique-Chimie",cat:"chimie",
   classe:"2nde-1ère-Tle C",ico:"⚗️",color:"#6C56A6",gratuit:true,
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
   classe:"Tle C/D",ico:"🔥",color:"#EA580C",gratuit:false,plan:"Sciences",
   desc:"Réactions redox, nombres d'oxydation, piles électrochimiques, corrosion et combustions.",
   theorie:"🔥 OIL RIG : Oxidation Is Loss (d'électrons) ; Reduction Is Gain.\nCouple redox : forme oxydée / forme réduite. Ex: Cu²⁺/Cu ; Zn²⁺/Zn.\n\n🔋 Pile : réaction redox spontanée → courant. Anode = oxydation ; Cathode = réduction.\n\n⚙️ Électrolyse : courant forcé → réaction non-spontanée.\n\n🔥 Combustion complète du méthane : CH₄ + 2O₂ → CO₂ + 2H₂O.\nIncomplète : CH₄ + 3/2 O₂ → CO + 2H₂O (CO = dangereux !).",
   experience:[
     "1️⃣ RÉACTION Zn/CuSO₄ : plonge une lame de zinc dans une solution bleue de sulfate de cuivre (CuSO₄). Observe sur 5 minutes : dépôt rougeâtre sur la lame (cuivre métallique) et décoloration progressive de la solution.",
     "2️⃣ RÉACTION Cu/ZnSO₄ : plonge une lame de cuivre dans une solution de sulfate de zinc (ZnSO₄). Observe : aucune réaction. Conclusion : Zn est meilleur réducteur que Cu. Ordre de réactivité.",
     "3️⃣ CONSTRUCTION DE LA PILE Zn/Cu : prépare 2 béchers (ZnSO₄ + lame Zn ; CuSO₄ + lame Cu). Relie par un pont salin (papier filtre trempé dans KNO₃). Branche un voltmètre : lis ≈ 1,1 V.",
     "4️⃣ COMBUSTION DU MAGNÉSIUM : brûle un ruban de Mg dans l'air avec une pince. Observe : flamme blanche éblouissante (NE PAS REGARDER DIRECTEMENT). Résidu blanc = MgO. Équation : 2Mg + O₂ → 2MgO.",
     "5️⃣ ÉQUILIBRAGE D'ÉQUATION (procédure) : pour C₃H₈ + O₂ → CO₂ + H₂O, compte les atomes avant et après. Ajoute des coefficients pour égaliser : C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. Vérifie chaque élément.",
     "6️⃣ CORROSION DU FER : observe des clous dans 3 tubes (eau + air, eau seule, air sec). Après 1 semaine : rouille dans le tube avec eau + air uniquement. Rôle de l'eau ET de l'oxygène confirmé.",
     "7️⃣ ÉLECTROLYSE DÉMONSTRATION : place deux électrodes en carbone dans de l'eau salée. Branche une pile 9V. Observe : bulles aux deux électrodes (H₂ à la cathode, O₂ à l'anode). L'eau se décompose !",
   ],
   quiz:[
     {q:"Zn + Cu²⁺ → Zn²⁺ + Cu. Quel élément est oxydé ?",opts:["Cu²⁺","Cu","Zn²⁺","Zn"],ans:3,exp:"Zn perd 2 électrons (0→+2) = oxydé (OIL). Cu²⁺ gagne 2e⁻ (+2→0) = réduit (RIG)."},
     {q:"N.o. de l'oxygène dans H₂O :",opts:["+2","+1","-1","-2"],ans:3,exp:"O très électronégatif → n.o. = -2 dans la plupart des composés."},
     {q:"Dans une pile, l'oxydation a lieu :",opts:["À la cathode","Au pont salin","À l'anode","Dans les deux"],ans:2,exp:"ANODE = Oxydation (A-O). Cathode = Réduction (C-R)."},
     {q:"Combustion complète de CH₄ donne :",opts:["CO + H₂O","CO₂ + H₂","CO₂ + H₂O","CH₃OH + O"],ans:2,exp:"CH₄ + 2O₂ → CO₂ + 2H₂O. Complète = CO₂. Incomplète = CO (toxique)."},
     {q:"La galvanisation protège le fer en le couvrant de :",opts:["Chrome","Cuivre","Zinc","Étain"],ans:2,exp:"Zinc plus réducteur que fer → se sacrifie en premier (protection cathodique)."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:"Sciences"},

  // ─ SVT ─
  {id:"lv4",titre:"La Mitose — Division Cellulaire",matiere:"SVT",cat:"svt",
   classe:"1ère D-Tle D",ico:"🧬",color:"#059669",gratuit:true,
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
   classe:"5ème-4ème",ico:"🌱",color:"#16A34A",gratuit:true,
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
   classe:"5ème-4ème",ico:"🍽️",color:"#B04E64",gratuit:true,
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
   classe:"4ème-3ème",ico:"❤️",color:"#AE5353",gratuit:true,
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
   classe:"Tle D",ico:"🔬",color:"#6C56A6",gratuit:false,plan:"Sciences",
   desc:"Lois de Mendel, croisements, dominance, codominance et génétique des groupes sanguins.",
   theorie:"🧬 Gène : portion d'ADN. Allèles : différentes formes d'un gène.\nGénotype (AA, Aa, aa) → Phénotype (caractère observable).\n\n📌 1ère loi Mendel : uniformité F1 (AA × aa → 100% Aa).\n📌 2ème loi : F1×F1 → ratio 3:1 phénotypique, 1:2:1 génotypique.\n📌 3ème loi : assortiment indépendant des gènes de chromosomes différents.\n\nGroupes ABO : IA et IB codominants ; i récessif.\nDaltonisme : lié à X (garçons surtout touchés).\nDrépanocytose : HbS/HbS = malade ; HbA/HbS = porteur sain.",
   experience:[
     "1️⃣ Mendel : VV (violette) × vv (blanche) → F1 : 100% Vv (violettes). V dominant.",
     "2️⃣ Tableau de Punnett Vv×Vv : VV + 2Vv + vv = 3 violettes : 1 blanche (ratio 3:1).",
     "3️⃣ Dihybridisme AABB × aabb → F1 : AaBb. F1×F1 → F2 : 9 A_B_ : 3 A_bb : 3 aaB_ : 1 aabb.",
     "4️⃣ Groupes sanguins : père IAi (A) × mère IBi (B) → IAIB (AB), IAi (A), IBi (B), ii (O). 4 groupes possibles !",
     "5️⃣ Daltonisme (lié X) : mère XᴰX (porteuse) × père XᴰY → 50% fils daltoniens.",
     "6️⃣ Drépanocytose : HbA/HbS × HbA/HbS → 25% risque enfant malade (HbS/HbS).",
     "7️⃣ Arbre généalogique : détermine le mode de transmission d'une maladie (dominant/récessif/lié X).",
   ],
   quiz:[
     {q:"Croisement Vv × Vv (V dominant). Ratio phénotypique F2 :",opts:["1:1:1:1","1:2:1","3:1","1:1"],ans:2,exp:"Vv×Vv → 1VV + 2Vv + 1vv = 3 phénotype V_ (violette) : 1 vv (blanche)."},
     {q:"Le phénotype est :",opts:["Le matériel génétique","L'ensemble des allèles","Le caractère observable","La séquence ADN complète"],ans:2,exp:"Phénotype = caractère observable (couleur yeux, taille, groupe sanguin). Génotype = constitution allélique."},
     {q:"IA et IB pour les groupes sanguins ABO sont :",opts:["IA dominant sur IB","IB dominant sur IA","Codominants","Les deux récessifs"],ans:2,exp:"IA et IB codominants → individu IAIB exprime les DEUX antigènes → groupe AB."},
     {q:"Le daltonisme (lié à X) touche surtout :",opts:["Les filles","Les garçons","Les deux sexes","Uniquement les homozygotes"],ans:1,exp:"Garçons XY : un seul allèle X → si défectueux, maladie exprimée. Filles XX : peuvent être porteuses."},
     {q:"Croisement AA × aa. F1 est :",opts:["AA","aa","100% Aa","1/2 AA + 1/2 aa"],ans:2,exp:"1ère loi (uniformité) : P1 AA × P2 aa → F1 : 100% Aa."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:"Sciences"},

  // ─ MATHS ─
  {id:"lv6",titre:"Géométrie dans l'Espace",matiere:"Maths",cat:"maths",
   classe:"2nde-1ère-Tle",ico:"📐",color:"#AE5353",gratuit:true,
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
   classe:"1ère-Tle",ico:"🎲",color:"#D97706",gratuit:true,
   desc:"Probabilités classiques et conditionnelles, statistiques descriptives. 1ère : loi binomiale.",
   theorie:"🎲 P(A) = cas favorables / cas totaux. 0 ≤ P(A) ≤ 1.\nP(Ā) = 1-P(A) ; P(A∪B) = P(A)+P(B)-P(A∩B).\nIndépendants : P(A∩B) = P(A)×P(B).\n\n📊 Statistiques :\n• Moyenne : μ = Σ(xi×ni)/N\n• Médiane : valeur centrale de la série ordonnée\n• Mode : valeur la plus fréquente\n• Étendue = valeur max − valeur min\n• Écart interquartile = Q3 − Q1\n\n📐 1ère (Tle) — Loi binomiale B(n,p) :\nP(X=k) = C(n,k)×pᵏ×(1-p)ⁿ⁻ᵏ ; E(X)=np ; σ=√[np(1-p)].",
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
     {q:"A et B indépendants, P(A)=0,3, P(B)=0,4. P(A∩B) = ?",opts:["0,7","0,12","0,1","0,7"],ans:1,exp:"Indépendants → P(A∩B) = P(A)×P(B) = 0,3×0,4 = 0,12."},
     {q:"L'écart-type σ mesure :",opts:["La valeur centrale","La dispersion des données autour de la moyenne","La valeur maximale","Le nombre total d'observations"],ans:1,exp:"σ élevé = données très dispersées. σ faible = données concentrées autour de μ."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:null},

  {id:"lv16",titre:"Fonctions & Dérivées",matiere:"Maths",cat:"maths",
   classe:"1ère-Tle",ico:"📈",color:"#BE185D",gratuit:false,plan:"Sciences",
   desc:"Fonctions usuelles, calcul de dérivées, tableaux de variations et optimisation.",
   theorie:"📐 Dérivée = taux de variation instantané = pente de la tangente.\n(xⁿ)'=nxⁿ⁻¹ ; (√x)'=1/(2√x) ; (eˣ)'=eˣ ; (ln x)'=1/x.\n(sin x)'=cos x ; (cos x)'=-sin x.\n(uv)'=u'v+uv' ; (u/v)'=(u'v-uv')/v².\n\n📊 Tableau de variations : f'>0 → croissante ; f'<0 → décroissante ; f'=0 → extremum.\n\n∫xⁿ dx = xⁿ⁺¹/(n+1)+C. Aire sous courbe = ∫ₐᵇ f(x)dx.",
   experience:[
     "1️⃣ TRACER LA COURBE : prends f(x)=x² sur [-3;3]. Construis le tableau de valeurs (x=-3,-2,-1,0,1,2,3 → f=9,4,1,0,1,4,9). Place les points sur papier millimétré. Trace la parabole en reliant les points.",
     "2️⃣ PENTE D'UNE TANGENTE : sur ta courbe de x², dessine la tangente au point x=1. Mesure sa pente (montée/base). Compare avec la valeur de f'(1)=2×1=2. Est-ce cohérent ?",
     "3️⃣ TABLEAU DE VARIATIONS : f(x)=x²-4x+3 → f'(x)=2x-4. Résous f'(x)=0 → x=2. Signe de f' : négatif sur ]-∞,2[, positif sur ]2,+∞[. Complète le tableau (flèche ↘ puis ↗).",
     "4️⃣ EXTREMUM LOCAL : d'après ton tableau, f est décroissante avant x=2 et croissante après → x=2 est un MINIMUM. Calcule f(2)=4-8+3=-1. C'est la valeur minimale de f.",
     "5️⃣ APPLICATION AU PROBLÈME CONCRET : un agriculteur veut clôturer un jardin rectangulaire de périmètre 40m. Surface S = x×(20-x). Dérive et trouve le max de S → x=10m (carré de 10×10).",
     "6️⃣ CALCUL DE DÉRIVÉES (exercice guidé) : dérive les fonctions suivantes en utilisant les formules : f(x)=3x⁴ → f'=? ; g(x)=5x²+2x → g'=? ; h(x)=√x → h'=? Vérifie tes réponses.",
     "7️⃣ INTÉGRALE (Tle) — AIRE SOUS LA COURBE : sur le graphe de f(x)=x entre 0 et 4, l'aire est un triangle de base 4 et hauteur 4. Aire = ½×4×4=8. Vérifie : ∫₀⁴ x dx = [x²/2]₀⁴ = 8 ✓",
   ],
   quiz:[
     {q:"Dérivée de f(x)=5x³ :",opts:["5x²","15x²","x³","15x³"],ans:1,exp:"(5x³)'=5×3x²=15x²."},
     {q:"Si f'(x)>0 sur un intervalle, f est :",opts:["Décroissante","Constante","Croissante","Convexe"],ans:2,exp:"f'(x)>0 ↔ pente positive ↔ f croissante."},
     {q:"Dérivée de ln(x) :",opts:["x","1/x","ln(x)/x","eˣ"],ans:1,exp:"(ln x)'=1/x pour x>0."},
     {q:"f(x)=x²-4x+3. f'(x)=0 en x=?",opts:["1","2","3","-2"],ans:1,exp:"f'(x)=2x-4=0 → x=2. Minimum (f''=2>0)."},
     {q:"∫₀² x dx = ?",opts:["2","4","1","0"],ans:0,exp:"[x²/2]₀²=4/2-0=2."},
     {q:"Dérivée de eˣ :",opts:["xeˣ⁻¹","eˣ","xeˣ","1/eˣ"],ans:1,exp:"(eˣ)'=eˣ. La fonction exponentielle est sa propre dérivée."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:"Sciences"},

  {id:"lv17",titre:"Trigonométrie & Cercle Unité",matiere:"Maths",cat:"maths",
   classe:"2nde-1ère",ico:"📏",color:"#0891B2",gratuit:true,
   desc:"sin, cos, tan, valeurs remarquables, cercle trigonométrique et équations trigonométriques.",
   theorie:"📐 Triangle rectangle : sin=opp/hyp ; cos=adj/hyp ; tan=opp/adj (SOH-CAH-TOA).\n\n🔵 Cercle unité : M(cos θ, sin θ).\nValeurs : 0°(0,1) ; 30°(1/2,√3/2) ; 45°(√2/2,√2/2) ; 60°(√3/2,1/2) ; 90°(1,0).\n\nIdentité : sin²+cos²=1 ; sin(2x)=2sin x cos x ; cos(2x)=cos²x-sin²x.\n\nConversion : degrés×π/180 = radians. 90°=π/2 ; 180°=π ; 360°=2π.",
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
   classe:"Tle",ico:"🌐",color:"#059669",gratuit:false,plan:"Complet",
   desc:"Flux mondiaux, acteurs, inégalités, IDH et place du Cameroun dans la mondialisation.",
   theorie:"🌐 Mondialisation = mise en relation croissante des économies, sociétés et espaces mondiaux.\n\n📦 Flux : marchandises (OMC) ; capitaux (IDE) ; personnes (migrations) ; informations (internet).\n\n🏭 Acteurs : FMN ; États ; OMC/FMI/BM ; ONG ; villes mondiales.\n\n🗺️ Triade (USA-Europe-Japon) + BRICS (Brésil, Russie, Inde, Chine, Afrique du Sud).\n\n📊 IDH : Indice Développement Humain (revenus + santé + éducation). De 0 à 1.\n\n🇨🇲 Cameroun : exportations (cacao, café, bois, pétrole) ; port Douala = hub régional ; IDE chinois.",
   experience:[
     "1️⃣ Trace les grandes routes maritimes : Canal Suez, Canal Panama, détroit Malacca, Cap Bonne Espérance.",
     "2️⃣ FMN Apple : conçu Californie → assemblé Chine → vendu mondialement. Fragmentation chaîne de valeur.",
     "3️⃣ IDH Cameroun 2023 ≈ 0,576 (moyen). Comparer : Norvège (0,97), Niger (0,40).",
     "4️⃣ Migrations camerounaises : diaspora en France, USA, UK. Transferts de fonds ≈ 300M$/an.",
     "5️⃣ Villes mondiales (global cities) : New York, Londres, Tokyo, Shanghai. Critères : CBD, bourse, FMN, hub aérien.",
     "6️⃣ Mondialisation culturelle : 'McDonaldisation' vs résistances locales. Francophonie comme levier.",
     "7️⃣ Débat : mondialisation = opportunité ou menace pour le Cameroun ? Argumentez avec des données.",
   ],
   quiz:[
     {q:"La mondialisation désigne :",opts:["La standardisation de la cuisine","La mise en relation croissante des économies mondiales","La création de l'Union Africaine","La colonisation du Sud"],ans:1,exp:"Mondialisation = intégration des marchés, capitaux, personnes et informations à l'échelle mondiale."},
     {q:"Les BRICS regroupent :",opts:["USA,UK,Inde,Chine,Suisse","Brésil,Russie,Inde,Chine,Afrique du Sud","Bangladesh,Rwanda,Inde,Corée,Suède","Belgique,Russie,Iran,Cameroun,Sénégal"],ans:1,exp:"BRICS = puissances émergentes contestant la domination de la triade USA-Europe-Japon."},
     {q:"L'IDH mesure :",opts:["Uniquement le PIB","La richesse des FMN","Le développement humain (revenus+santé+éducation)","La superficie"],ans:2,exp:"IDH (ONU) : combine espérance de vie, niveau d'éducation et revenu/habitant. Entre 0 et 1."},
     {q:"Le port de Douala est important car :",opts:["1er port d'Afrique","Hub pour pays enclavés d'Afrique centrale","Exporte uniquement du pétrole","Appartient à une FMN américaine"],ans:1,exp:"Douala = hub logistique pour Cameroun, Tchad, RCA — pays sans accès à la mer."},
     {q:"Une firme multinationale (FMN) :",opts:["Emploie > 1000 personnes","Produit et vend dans plusieurs pays","Appartient à l'État","Exporte uniquement"],ans:1,exp:"FMN = entreprise avec filiales de production/commercialisation dans plusieurs pays (Total, Samsung, Dangote)."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:"Complet"},

  // ─ INFO & LANGUES ─
  {id:"lv19",titre:"Algorithmes & Programmation",matiere:"Info/Maths",cat:"info",
   classe:"3ème-Tle",ico:"💻",color:"#1E3A8A",gratuit:true,
   desc:"Algorithmique, structures de contrôle, fonctions, récursivité et initiation Python.",
   theorie:"💻 Algorithme : suite d'instructions ordonnées pour résoudre un problème.\n\nStructures :\n• Séquence : instructions dans l'ordre\n• Condition : SI ... ALORS ... SINON\n• Boucle : POUR (n fois) ou TANTQUE (condition)\n• Fonction : bloc réutilisable, paramètres + retour\n\nComplexité : O(n) linéaire ; O(n²) quadratique ; O(log n) logarithmique.\n\nPython : indentation obligatoire pour les blocs. Types : int, float, str, bool, list, dict.",
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
   classe:"Tle D",ico:"🛡️",color:"#16A34A",gratuit:true,
   desc:"Comprendre comment notre corps se défend contre les infections : anticorps, lymphocytes, vaccins. Programme Tle.",
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
   classe:"1ère D-Tle D",ico:"🧬",color:"#6C56A6",gratuit:true,
   desc:"Structure de l'ADN, code génétique, transmission des caractères et lois de Mendel. Programme 1ère-Tle.",
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
   desc:"Probabilités conditionnelles, indépendance, formule de Bayes et arbres pondérés. Programme Tle.",
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
     {q:"Test détecte 95% malades. 1% pop malade. Pos test → vraiment malade ?",opts:["≈ 95%","≈ 50%","≈ 16% (paradoxe Bayes)","100%"],ans:2,exp:"P(malade|+) ≈ 0,95×0,01 / (0,95×0,01 + 0,05×0,99) ≈ 16%. La rareté du cas + faux+ fausse l'intuition."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:"Premium"},

  {id:"lv30",titre:"Énergie Nucléaire : Fission & Fusion",matiere:"Physique",cat:"physique",
   classe:"Tle C-Tle D",ico:"☢️",color:"#AE5353",gratuit:false,plan:"Sciences",
   desc:"Radioactivité, désintégration, fission (centrales), fusion (étoiles, bombe H). Programme Tle.",
   theorie:"⚛️ NOYAU : Z protons + N neutrons. A=Z+N (nombre de masse). Notation : ^A_Z X.\n\n☢️ RADIOACTIVITÉ :\n• α : émission ^4_2 He (noyau hélium). Z↓2, A↓4.\n• β⁻ : neutron→proton + électron. Z↑1, A=cst.\n• γ : photon haute énergie. Z et A inchangés.\n\n⏱️ DEMI-VIE T : temps après lequel 50% des noyaux ont désintégré. N(t) = N₀ × (1/2)^(t/T).\n\n💥 FISSION : noyau lourd (U-235) absorbe neutron → se brise en 2 + 3 neutrons + énergie. Réaction en chaîne. Centrales nucléaires.\n\n☀️ FUSION : 2 noyaux légers (H) → noyau plus lourd (He) + énergie. Source du Soleil. Bombe H.",
   experience:[
     "1️⃣ COMPOSITION U-235 : Z=92 protons, A=235 → N=143 neutrons. Symbole : ^235_92 U. Très instable, fissile.",
     "2️⃣ DÉSINTÉGRATION α : ^238_92 U → ^234_90 Th + ^4_2 He. Vérifier : Z: 92=90+2 ✓ ; A: 238=234+4 ✓.",
     "3️⃣ DÉSINTÉGRATION β⁻ : ^14_6 C → ^14_7 N + e⁻. Un neutron du C devient proton (Z↑1). Datation au C-14 utilise cette propriété (T=5730 ans).",
     "4️⃣ DEMI-VIE : iode-131 (T=8 jours). Après 24 jours = 3 demi-vies. Fraction restante = (1/2)³ = 1/8 = 12,5%. Si N₀=400 atomes → 50 restants.",
     "5️⃣ DATATION C-14 : un fossile contient 25% du C-14 normal. 25% = (1/2)² → 2 demi-vies = 2×5730 = 11 460 ans.",
     "6️⃣ FISSION U-235 : neutron + ^235_92 U → ^141_56 Ba + ^92_36 Kr + 3 neutrons + 200 MeV. Les 3 neutrons fissent d'autres U-235 → réaction en chaîne (bombe A) ou contrôlée (centrale).",
     "7️⃣ FUSION DANS LE SOLEIL : 4 ^1_1 H → ^4_2 He + 2 positrons + 2 neutrinos + énergie. Température requise : 15 millions K (cœur Soleil). Sur Terre : ITER tente la reproduction.",
   ],
   quiz:[
     {q:"L'uranium-235 contient combien de neutrons ?",opts:["92","143","235","327"],ans:1,exp:"^235_92 U : A=235, Z=92 protons. N=A-Z=235-92=143 neutrons."},
     {q:"Désintégration α : Z et A changent comment ?",opts:["Z↑2, A=cst","Z=cst, A↓4","Z↓2, A↓4","Z↓1, A=cst"],ans:2,exp:"α = ^4_2 He éjecté. Le noyau perd 2 protons (Z↓2) et 2 neutrons (A↓4)."},
     {q:"Iode-131 (T=8j). Après 32 jours, fraction restante :",opts:["1/4","1/8","1/16","1/32"],ans:2,exp:"32j = 4 demi-vies. Fraction = (1/2)⁴ = 1/16."},
     {q:"Centrale nucléaire utilise quel phénomène ?",opts:["Fusion","Fission","Combustion","Désintégration alpha"],ans:1,exp:"Centrale = fission de U-235 ou Pu-239 contrôlée. Fusion = pas encore maîtrisée pour énergie."},
     {q:"Énergie du Soleil provient de :",opts:["Combustion","Fusion H→He","Fission","Géothermie"],ans:1,exp:"Au cœur du Soleil (15 millions K), 4 H → 1 He + énergie via fusion. Perte de masse convertie en E selon E=mc²."},
     {q:"Un échantillon : 25% C-14 restant. Âge ?",opts:["5730 ans","11 460 ans","17 190 ans","Indéterminable"],ans:1,exp:"25% = (1/2)² → 2 demi-vies × 5730 = 11 460 ans."},
   ],
   ressource:"https://minesec-distancelearning.cm",pack:"Sciences"},

  {id:"lv31",titre:"Chimie Organique : Synthèse d'Ester",matiere:"Chimie",cat:"chimie",
   classe:"1ère D-Tle D",ico:"⚗️",color:"#C07D4F",gratuit:true,
   desc:"Estérification, hydrolyse, parfums et arômes. Mécanismes et déplacement d'équilibre. Programme 1ère-Tle.",
   theorie:"⚗️ ESTÉRIFICATION : Acide carboxylique + Alcool ⇌ Ester + Eau.\nR-COOH + R'-OH ⇌ R-CO-O-R' + H₂O\n\n⚖️ Équilibre LIMITÉ (~67% acide-alcool primaires, 50% secondaires). Lente.\n\n🚀 CATALYSEUR : H₂SO₄ concentré accélère SANS modifier l'équilibre.\n\n⬆️ DÉPLACER vers la droite (Le Chatelier) :\n• Excès d'un réactif (généralement alcool)\n• Élimination de l'eau formée (distillation Dean-Stark)\n\n🌸 ESTERS = PARFUMS : éthanoate d'éthyle = colle nail, éthanoate de pentyle = banane, butanoate d'éthyle = ananas.",
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

  {id:"lv32",titre:"Climat Mondial & Changement Climatique",matiere:"Géographie",cat:"geo",
   classe:"2nde-1ère",ico:"🌍",color:"#0EA5E9",gratuit:true,
   desc:"Climats, biomes, effet de serre, réchauffement, conséquences. Programme 2nde-1ère.",
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
   experience:[
     "1️⃣ ALGO TRI BULLES (Python-like) :\n  for i de 0 à n-1:\n    for j de 0 à n-i-1:\n      si t[j] > t[j+1]:\n        échanger(t[j], t[j+1])\nDessine les étapes sur [5,3,8,1].",
     "2️⃣ ÉTAPES SUR [5,3,8,1] :\nPassage 1: [3,5,8,1] → [3,5,8,1] → [3,5,1,8]\nPassage 2: [3,5,1,8] → [3,1,5,8] → fini\nPassage 3: [1,3,5,8] → trié !",
     "3️⃣ COMPTER LES COMPARAISONS : pour n=4, max = 4×3 = 12 comparaisons. Pour n=10 = 90. Pour n=1000 = 1 million. Quadratique.",
     "4️⃣ TRI PAR SÉLECTION : trouver le min, le mettre en 1er. Recommencer avec [1:]. Aussi O(n²) mais moins d'échanges.",
     "5️⃣ RECHERCHE DICHOTOMIQUE (tableau trié) : couper en 2 à chaque étape. n=1 000 000 → 20 comparaisons (log₂ 10⁶). C'est pourquoi le tri préalable est utile.",
     "6️⃣ QUICKSORT — PIVOT : choisir t[0]=5 dans [5,3,8,1,4]. Partition : <5 → [3,1,4], =5 → [5], >5 → [8]. Récursion sur chaque partie.",
     "7️⃣ COMPARER PERFORMANCES : n=10⁶ éléments. Tri bulles : 10¹² ops (~17 min). Quicksort : 2×10⁷ ops (~20 ms). Différence x50 000 !",
   ],
   quiz:[
     {q:"Complexité du tri à bulles pire cas :",opts:["O(n)","O(n²)","O(n log n)","O(1)"],ans:1,exp:"Tri à bulles : 2 boucles imbriquées → O(n²). Pour n=1000, ~10⁶ opérations."},
     {q:"Algorithme le plus rapide pour grands n :",opts:["Tri à bulles O(n²)","Tri par sélection O(n²)","Quicksort O(n log n)","Tous équivalents"],ans:2,exp:"Quicksort/Mergesort en O(n log n) sont bien plus rapides pour grands n. Pour n=10⁶ : O(n²)=10¹² vs O(n log n)=2×10⁷."},
     {q:"Recherche dichotomique exige :",opts:["Tableau non trié","Tableau trié","Tableau vide","Récursion"],ans:1,exp:"Dichotomie requiert un tableau trié. Coupe en 2 à chaque étape. Complexité O(log n)."},
     {q:"Pour n=1024, log₂(n) =",opts:["10","100","1024","2"],ans:0,exp:"2¹⁰ = 1024 donc log₂(1024) = 10. Très efficace : dichotomie sur 1024 éléments = 10 comparaisons max."},
     {q:"Complexité de l'accès t[i] dans un tableau :",opts:["O(log n)","O(n)","O(1)","O(n²)"],ans:2,exp:"Accès direct via indice = O(1) = constant. C'est la force des tableaux vs listes chaînées."},
     {q:"Tri sur [3,1,2] avec tri à bulles, 1er échange :",opts:["Aucun","3 et 1","1 et 2","3 et 2"],ans:1,exp:"Compare 3 et 1 → 3>1 donc échange → [1,3,2]. Puis compare 3 et 2 → [1,2,3] trié."},
   ],
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
   experience:[
     "1️⃣ Observe the prepared onion root tip slide: identify cells in interphase (most numerous) and the four mitosis phases.",
     "2️⃣ Draw one cell in METAPHASE: chromosomes aligned on the equator, spindle fibres attached to centromeres.",
     "3️⃣ Count 50 cells and record how many are in each phase → estimate the relative duration of each phase.",
     "4️⃣ Compare with a meiosis diagram: spot crossing-over (chiasmata) in Prophase I.",
     "5️⃣ Build the comparison table: number of divisions, daughter cells, chromosome number, genetic identity.",
   ],
   quiz:[
     {q:"Mitosis produces:",opts:["4 haploid cells","2 identical diploid cells","2 haploid cells","4 different diploid cells"],ans:1,exp:"Mitosis = one division, two genetically identical diploid daughter cells."},
     {q:"Crossing-over happens during:",opts:["Metaphase II","Prophase I","Anaphase II","Telophase I"],ans:1,exp:"Crossing-over (exchange between homologous chromatids) occurs in Prophase I of meiosis."},
     {q:"In humans (2n = 46), a gamete contains:",opts:["46 chromosomes","92 chromosomes","23 chromosomes","12 chromosomes"],ans:2,exp:"Meiosis halves the number: n = 23 chromosomes in sperm and egg cells."},
     {q:"The phase where chromosomes line up at the equator:",opts:["Prophase","Metaphase","Anaphase","Telophase"],ans:1,exp:"Metaphase = Middle: chromosomes align on the metaphase plate."},
   ],
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
   experience:[
     "1️⃣ Observe la pièce en perspective (cale étagée percée). Choisis la vue de face = la plus représentative.",
     "2️⃣ Trace le cadre et le cartouche aux instruments (format A4, échelle 1:1).",
     "3️⃣ Dessine la vue de face : arêtes vues en trait fort, perçage caché en interrompu fin, axes en mixte fin.",
     "4️⃣ Déduis la vue de dessus par correspondance verticale (lignes de rappel).",
     "5️⃣ Déduis la vue de gauche par correspondance horizontale (utilise la ligne à 45°).",
     "6️⃣ Cote la pièce : longueur, largeur, hauteur, position et diamètre du perçage (Ø).",
   ],
   quiz:[
     {q:"En méthode européenne, la vue de dessus se place :",opts:["au-dessus de la vue de face","en dessous de la vue de face","à gauche","à droite"],ans:1,exp:"Méthode E : l'objet est entre l'œil et le plan → la vue de dessus se projette EN DESSOUS."},
     {q:"Les arêtes cachées se tracent en :",opts:["trait fort continu","trait interrompu fin","trait mixte fin","trait fin continu"],ans:1,exp:"Arêtes cachées = trait interrompu fin (pointillés)."},
     {q:"Un diamètre se cote avec le symbole :",opts:["R","Ø","D","⌀⌀"],ans:1,exp:"Ø devant la valeur (ex. Ø12) ; R est réservé aux rayons."},
     {q:"Le trait mixte fin sert à représenter :",opts:["les contours vus","les axes de symétrie","les hachures","le cartouche"],ans:1,exp:"Axes et plans de symétrie = trait mixte fin (tiret-point)."},
   ],
   ressource:"https://officedubac.cm",pack:null},
];

/* ── Moteur de simulation (déplacé depuis app.js) ────────────────────────
   Le catalogue et le simulateur voyagent ensemble : qui ouvre un labo a
   besoin des deux, qui ne l'ouvre pas ne paie ni l'un ni l'autre. */
function _initLaboSim(lv){
  cancelAnimationFrame(window._sim.raf);
  window._sim={running:true,raf:0,t:0,params:{},defaults:{}};
  var cnv=document.getElementById('laboCnv');
  if(!cnv) return;
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
  } else if(lv.id==="lv7"){
    window._sim.params={highlight:-1};
    window._sim.defaults={highlight:-1};
    var regions=[
      {nom:"Adamaoua",cx:380,cy:130,chef:"Ngaoundéré",col:"#D97706"},
      {nom:"Centre",cx:330,cy:200,chef:"Yaoundé",col:"#059669"},
      {nom:"Est",cx:440,cy:210,chef:"Bertoua",col:"#6C56A6"},
      {nom:"Extrême-Nord",cx:370,cy:40,chef:"Maroua",col:"#AE5353"},
      {nom:"Littoral",cx:260,cy:220,chef:"Douala",col:"#0891B2"},
      {nom:"Nord",cx:370,cy:85,chef:"Garoua",col:"#1E3A8A"},
      {nom:"Nord-Ouest",cx:270,cy:160,chef:"Bamenda",col:"#BE185D"},
      {nom:"Ouest",cx:290,cy:185,chef:"Bafoussam",col:"#D97706"},
      {nom:"Sud",cx:330,cy:260,chef:"Ebolowa",col:"#059669"},
      {nom:"Sud-Ouest",cx:230,cy:190,chef:"Buea",col:"#6C56A6"},
    ];
    window._sim.controlsDef=function(){
      return "<span style='font-size:11px;font-weight:700;color:#142554'>Clique sur une région pour l'explorer</span>"
        +"<button onclick='window._sim.params.highlight=-1' style='background:#F0F4FF;color:#142554;border:none;border-radius:10px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer'>Tout afficher</button>";
    };
    _simUpdateControls();
    // Click on canvas to select region
    var cnvEl=document.getElementById('laboCnv');
    if(cnvEl)cnvEl.onclick=function(ev){
      var rect=cnvEl.getBoundingClientRect();
      var mx=(ev.clientX-rect.left)*(W/rect.width);
      var my=(ev.clientY-rect.top)*(H/rect.height);
      var closest=-1,minD=999;
      regions.forEach(function(rg,i){
        var d=Math.hypot(mx-rg.cx,my-rg.cy);
        if(d<minD){minD=d;closest=i;}
      });
      if(minD<50)window._sim.params.highlight=closest;
    };
    window._sim._draw=function(){
      var p=window._sim.params;var t=window._sim.t;
      ctx.clearRect(0,0,W,H);
      // Title
      ctx.fillStyle='rgba(255,255,255,.6)';ctx.font='bold 13px Montserrat';ctx.textAlign='left';
      ctx.fillText('🗺️ CAMEROUN — 10 Régions',20,25);
      // Country outline (simplified polygon)
      ctx.beginPath();ctx.moveTo(350,15);ctx.lineTo(400,30);ctx.lineTo(420,70);ctx.lineTo(410,100);
      ctx.lineTo(460,160);ctx.lineTo(490,230);ctx.lineTo(420,290);ctx.lineTo(340,310);
      ctx.lineTo(280,290);ctx.lineTo(240,260);ctx.lineTo(210,230);ctx.lineTo(220,180);
      ctx.lineTo(240,140);ctx.lineTo(280,120);ctx.lineTo(320,80);ctx.lineTo(340,40);ctx.closePath();
      ctx.fillStyle='rgba(255,255,255,.05)';ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,.2)';ctx.lineWidth=2;ctx.stroke();
      // Regions
      regions.forEach(function(rg,i){
        var active=p.highlight===i||p.highlight===-1;
        var pulse=active?Math.sin(t*2+i)*3:0;
        var r=18+pulse;
        ctx.beginPath();ctx.arc(rg.cx,rg.cy,r,0,Math.PI*2);
        ctx.fillStyle=active?rg.col+'cc':'rgba(100,100,100,.3)';ctx.fill();
        ctx.strokeStyle=active?'#fff':'rgba(255,255,255,.1)';ctx.lineWidth=active?2:1;ctx.stroke();
        ctx.fillStyle=active?'#fff':'rgba(255,255,255,.3)';ctx.font=(p.highlight===i?'bold ':'')+' 9px Montserrat';ctx.textAlign='center';
        ctx.fillText(rg.nom,rg.cx,rg.cy+r+14);
        if(p.highlight===i){
          ctx.fillStyle='#FFC93C';ctx.font='bold 10px Fira Code';
          ctx.fillText('Chef-lieu: '+rg.chef,rg.cx,rg.cy+r+28);
        }
      });
      // Mt Cameroun
      ctx.fillStyle='#FFC93C';ctx.font='8px Montserrat';ctx.textAlign='left';
      ctx.fillText('▲ Mt Cameroun 4095m',200,205);
      // Info panel
      if(p.highlight>=0){
        var sel=regions[p.highlight];
        setVal("<span style='color:"+sel.col+"'>📍 "+sel.nom+"</span><span>🏛 Chef-lieu: "+sel.chef+"</span>");
      } else {
        setVal("<span>🗺️ 10 régions</span><span>🏔 Point culminant: Mt Cameroun 4095m</span><span>👆 Clique pour explorer</span>");
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
