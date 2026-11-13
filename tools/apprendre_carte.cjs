/* Carte « ressources de l'application ↔ progression MINESEC 2026-2027 », lue par
   tools/build_apprendre_ressources.cjs.

   Forme d'un lien vers des leçons : [classes, matière, rangs, motClé]
     · classes : "4e" ou "1re C,1re D" ;
     · matière : identifiant de apprendre/commun.js (pct, physique, svt…) ;
     · rangs   : position de la leçon dans la progression, ou null = toutes les
                 leçons dont le titre répond au motClé ;
     · motClé  : chaque leçon rattachée DOIT y répondre, sinon la construction
                 échoue. Si la progression est recollectée et que les rangs
                 glissent, on le sait tout de suite au lieu d'envoyer l'élève
                 sur le mauvais labo.
   Forme d'un rattachement à la matière entière : [classes, matière].

   Ne figure ici que ce qui a été confronté aux titres officiels ; le reste est
   consigné dans AUDIT/AUDIT_RESSOURCES_APPRENDRE.md. */
const COLLEGE = "6e,5e,4e,3e", LYCEE_A = "2nde A,1re A,Tle A", LYCEE_S = "2nde C,1re C,1re D,Tle C,Tle D";
const TOUTES = COLLEGE + "," + LYCEE_A + "," + LYCEE_S;
const S1 = "1re C,1re D", TS = "Tle C,Tle D", TOUTES_TLE = "Tle A,Tle C,Tle D", TOUTES_1RE = "1re A,1re C,1re D";
const EXAMENS = "3e," + TOUTES_1RE + "," + TOUTES_TLE;

exports.TOUTES = TOUTES;

// id du labo (chunks/labo.js) → liens. lv33, lv40-45 : série TI, GCE, technique, hors de ces progressions.
exports.labos = {
  lv1:  [["4e","pct",[15,16,18,19,21],/circuit|intensité|tension|Ohm/i], ["3e","pct",[20],/puissance/i], ["2nde C","physique",[21,22],/résistor/i]],
  lv2:  [["4e","pct",[33,34],/poids/i], ["2nde C","physique",[7,12],/mouvement|force/i], [S1,"physique",[3,4],/force/i], ["Tle C","physique",[9,10],/Newton|rectiligne/i], ["Tle D","physique",[10,11],/Newton|rectiligne/i]],
  lv9:  [["2nde C","physique",[16,17,18,19,20],/lumière|diffraction|réflexion|réfraction/i], [S1,"physique",[10,11],/lentille/i]],
  lv10: [[S1,"physique",[8,9],/chaleur|calorim/i]],
  lv3:  [["3e","pct",[9],/pH/], ["2nde C","chimie",[18,21,22,24],/acide|pH|dosage/i], [TS,"chimie",[17,18,20,21,22,23,24],/acide|pH|base/i]],
  lv11: [[S1,"chimie",[9,10,11,13,15],/oxyd|électrochim|pile/i], [TS,"chimie",[3],/combustion/i]],
  lv4:  [["2nde C","svt",[10],/mitose/i], ["1re D","svt",[8,10],/division|mitose/i]],
  lv5:  [["4e","svt",[4],/matière végétale/i], ["2nde C","svt",[1,3],/photosynth/i], ["1re D","svt",[45,46,47,48],/photosynth|énergie lumineuse/i]],
  lv12: [["4e","svt",[27,29,30],/digest/i], ["1re C","svt",[2,3],/digestion|absorption/i]],
  lv13: [["3e","svt",[31,32],/circulation/i], ["2nde C","svt",[12,14],/respirat/i]],
  lv14: [["Tle C","svt",[12,13,15,16],/hybrid|hérédité/i], ["Tle D","svt",[17,18,19,20],/hybrid/i]],
  lv6:  [["5e","maths",[60],/sphère/i], ["4e","maths",[43],/pyramide/i], ["3e","maths",[24,25],/section/i], ["2nde C","maths",[43,44],/espace/i], ["1re C","maths",[76],/espace/i]],
  lv15: [["3e","maths",[49,50],/statistique/i], ["1re A","maths",[21,22],/statistique/i], ["Tle A","maths",[39],/probabilit/i], ["Tle C","maths",[40,41,44],/probabilit|binomiale/i], ["Tle D","maths",[25,26,29],/probabilit|binomiale/i]],
  lv16: [["1re A","maths",[41,42,45],/dériv/i], ["1re C","maths",[36,38],/dériv/i], ["1re D","maths",[23,24],/dériv/i], ["Tle A","maths",[15,16,18,21],/dériv|primitive/i], ["Tle C","maths",[36,37],/primitive/i], ["Tle D","maths",[21,22],/primitive/i]],
  lv17: [["3e","maths",[16],/sinus/i], ["2nde C","maths",[24,25,26,27],/trigonom|angle orienté/i], ["1re C","maths",[14],/trigonom/i], ["1re D","maths",[10],/trigonom/i]],
  lv18: [["3e","geo",[25],/mondialis/i], [TOUTES_TLE,"geo",[16,17,19,23],/mondialis/i]],
  lv19: [["4e","info",[26],/algorithme/i], ["3e","info",[24,25,26,27],/algorithme/i], ["2nde A","info",[25],/algorithme/i], ["2nde C","info",[15,17],/algorithm/i], [S1,"info",[5],/algorithme/i], ["1re A","info",[17],/algorithme/i]],
  lv27: [["3e","svt",[21,22,23,29],/immun|vaccin/i], ["1re C","svt",[16],/immun/i], ["1re D","svt",[58],/immun/i], ["Tle C","svt",[23,24,25],/immun|humorale/i], ["Tle D","svt",[50,52,53,54],/immun/i]],
  lv28: [["3e","svt",[5],/ADN/], ["1re D","svt",[6,7],/ADN/], ["Tle C","svt",[6],/ADN/]],
  lv29: [["Tle C","maths",[42],/conditionnelles/i], ["Tle D","maths",[27],/conditionnelles/i]],
  lv30: [["Tle C","physique",[35,36,37],/nucléaire|radioact/i], ["Tle D","physique",[26,27,28],/nucléaire|radioact/i]],
  lv31: [[TS,"chimie",[4,7],/estérif/i]],
  lv7:  [["6e","geo",[3],/localiser/i], ["3e","geo",[1],/cameroun/i]],
  lv32: [["6e","geo",[18],/climat/i], ["2nde A","geo",[16],/climat/i]]
};

// id du jeu → liens. Absents : L'Enfant noir, Antigone, Huis clos, Les Bouts de bois de Dieu et
// les « Vrai/Faux » de littérature : ces œuvres ne sont plus au programme 2026-27.
exports.jeux = {
  j1: [[COLLEGE,"maths"]], j_tables_multi: [["6e,5e","maths"]],
  j3: [[COLLEGE,"francais"]], j5: [[COLLEGE,"francais"]],
  j_participe_passe: [["5e","francais",[10,26],/participe passé/i], ["4e","francais",[20,55],/participe passé/i], ["3e","francais",[3,72,83],/participe passé/i]],
  j6: [["3e","francais",[90,107],/figures/i], ["2nde A","francais",[92,106,125],/figures/i], ["2nde C","francais",[73,76],/figures/i], ["1re A","francais",[18,23,89],/figures/i], [S1,"francais",[31,65],/figures/i]],
  j_auteurs_cmr: [[EXAMENS+",2nde A,2nde C","francais"]],
  j_3e_vieux_negre_qcm: [[TOUTES_TLE,"francais",null,/vieux n[èe]gre/i]],
  j_tle_ville_cruelle_qcm: [["3e","francais",null,/ville cruelle/i]],
  j_verbes_ang: [[TOUTES,"anglais"]],
  j2: [["3e,1re A,1re C,1re D,Tle A","histoire"]], j_histoire_cmr: [["3e,1re A,1re C,1re D,Tle A","histoire"]],
  j4: [["3e","geo"]], j_capitales_afrique: [["4e","geo"]], j_regions_cmr: [["3e,Tle A,Tle C,Tle D","geo"]],
  j7: [["3e","pct",[3],/Mendele/i], ["2nde C","chimie",[6,7],/classification/i]],
  j_formules_phys: [["3e","pct"], [LYCEE_S,"physique"]], j_lois_physique: [["2nde C,1re C,1re D,Tle C,Tle D","physique"]],
  j8: [["4e,3e,2nde C,1re C,1re D","svt"]], j_svt_anatomie: [["4e,3e","svt"]], j_voc_svt: [["4e,3e,2nde C,1re C,1re D,Tle C,Tle D","svt"]],
  j_svt_genetique: [["Tle C","svt",[12,13,15,16],/hybrid|hérédité/i], ["Tle D","svt",[17,18,19,20],/hybrid/i]],
  j_equations: [["2nde C","maths",[12],/2nd degré/i], ["1re A","maths",[3,5],/second degré/i], [S1,"maths",[2],/second degré/i]],
  j_maths_fonctions: [[TOUTES_TLE,"maths"]]
};

// Cours, méthodes, œuvres : pages publiques du site.
const reLit = t => new RegExp(t, "i");
exports.pages = [
  { id:"c_registres", t:"cours", ti:"Les registres de langue", d:"Familier, courant, soutenu : les reconnaître et passer de l'un à l'autre.", u:"/cours/registres_de_langue_5e.html",
    l:[["6e","francais",[9,34],/registre/i], ["5e","francais",[37,94],/registre/i], ["3e","francais",[48],/niveaux de langue/i], ["2nde A","francais",[59,91],/registres/i], ["2nde C","francais",[11],/registres/i]] },
  { id:"c_commentaire", t:"cours", ti:"Le commentaire composé : analyser le texte et la consigne", d:"De la lecture de la consigne au plan, pas à pas.", u:"/cours/commentaire_compose_analyse.html",
    l:[["1re A,Tle A","francais",null,/commentaire compos/i]] },
  { id:"c_module1", t:"cours", ti:"Séquence 1 : Stances et poèmes de Sully Prudhomme", d:"Le module complet de la Terminale A : paratexte, lectures méthodiques, langue, production.", u:"/cours/module_1_tle_A.html",
    l:[["Tle A","francais",null,/stances et poèmes/i]] },
  { id:"e_bepc_ortho", t:"epreuve", ti:"BEPC blanc : correction orthographique", u:"/evaluations/BEPC_blanc_3e_correction_orthographique.html", l:[["3e","francais"]] },
  { id:"e_bepc_texte", t:"epreuve", ti:"BEPC blanc : étude de texte", u:"/evaluations/BEPC_blanc_3e_etude_de_texte.html", l:[["3e","francais"]] },
  { id:"e_bepc_expr", t:"epreuve", ti:"BEPC blanc : expression écrite", u:"/evaluations/BEPC_blanc_3e_expression_ecrite.html", l:[["3e","francais"]] },
  { id:"e_villecruelle", t:"epreuve", ti:"Épreuve sur Ville cruelle", u:"/evaluations/epreuve_3e_ville_cruelle_2026.html", l:[["3e","francais",null,/ville cruelle/i]] },
  { id:"e_vieuxnegre", t:"epreuve", ti:"Épreuve sur Le Vieux Nègre et la médaille", u:"/evaluations/epreuve_bac_vieux_negre_2026.html", l:[[TOUTES_TLE,"francais",null,/vieux n[èe]gre/i]] },
  { id:"e_bac_ang", t:"epreuve", ti:"Évaluation BAC d'anglais (interactive)", d:"Grammar, vocabulary, reading comprehension, composition writing.", u:"/evaluations/evaluation_bac_anglais.html", l:[["Tle A","anglais"], ["Tle A","anglais",null,/garbage/i]] },
  { id:"e_bac_fr", t:"epreuve", ti:"Évaluation BAC de langue française (interactive)", u:"/evaluations/evaluation_bac_langue_francaise.html", l:[["Tle A","francais"]] },
  { id:"e_bac_lit", t:"epreuve", ti:"Évaluation BAC de littérature (interactive)", u:"/evaluations/evaluation_bac_litterature.html", l:[["Tle A","francais"]] }
];

// Méthodes et examens, par classe, série et matière : tools/methodes/_classement.json (lu aussi par
// tools/methodes_examens.cjs pour l'index des ressources). Les méthodes de français gardent en plus
// leur rattachement aux leçons de la progression qui les enseignent.
const LECONS_METHODE = {
  x_fr_commentaire: [["1re A,Tle A","francais",null,/commentaire compos/i]],
  x_fr_dissertation: [["2nde A,2nde C,"+TOUTES_1RE+","+TOUTES_TLE,"francais",null,/dissertation/i]],
  x_fr_contraction: [["2nde A,2nde C,"+TOUTES_1RE,"francais",null,/contraction de texte|résumé/i]]
};
require("./methodes/_classement.json").forEach(e => exports.pages.push({ id: e.id, t: "methode", ti: e.ti, d: e.d, u: e.u, l: e.l.concat(LECONS_METHODE[e.id] || []) }));

// Œuvres au programme : fichier → [classes, recherche dans les titres]. N'kum-Wam : étudiée en 5e selon la progression.
exports.oeuvres = [
  ["6e-bimanes","Les Bimanes","6e",/bimanes/i], ["6e-chants-foret","Chants de la forêt","6e",/chants de la forêt/i], ["6e-contes-korotoumou","Les Contes de Korotoumou","6e",/korotoumou/i],
  ["5e-arbre-fetiche","L'Arbre fétiche","5e",/arbre fétiche/i], ["5e-pere-inconnu","Père inconnu","5e",/père inconnu/i], ["5e-nkum-wam","N'kum-Wam, le huitième notable","5e",/n.?kum-wam/i],
  ["4e-attachement-sol","L'Attachement au sol natal","4e",/attachement au sol/i], ["4e-coeur-sahel","Cœur du Sahel","4e",/cœur du sahel/i], ["4e-trois-pretendants","Trois prétendants… un mari","4e",/trois prétendants/i],
  ["3e-marmite-koka","La Marmite de Koka Mballa","3e",/marmite/i], ["3e-petites-gouttes","Petites gouttes de chants pour créer l'homme","3e",/petites gouttes/i], ["3e-ville-cruelle","Ville cruelle","3e",/ville cruelle/i],
  ["2nde-tartuffe","Tartuffe","2nde A,2nde C",/tartuffe/i], ["2nde-tribus-capitoline","Les Tribus de Capitoline","2nde A,2nde C",/capitoline/i], ["2nde-poemes-sauvages","Poèmes sauvages éclairés au feu de brousse","2nde A,2nde C",null],
  ["1ere-balafon","Balafon","1re A",/balafon/i], ["1ere-coeur-tenebres","Au cœur des ténèbres","1re A,1re C,1re D",/ténèbres/i], ["1ere-lion-perle","Le Lion et la perle","1re A,1re C,1re D",/lion et la perle/i],
  ["tle-stances-poemes","Stances et poèmes","Tle A",/stances/i], ["tle-vieux-negro","Le Vieux Nègre et la médaille","Tle A,Tle C,Tle D",/vieux n[èe]gre/i], ["tle-ngum-jemea","Ngum a Jemea","Tle A,Tle C,Tle D",/ngum/i]
];

// Mouvements littéraires : la frise est rattachée aux leçons « inscription dans le contexte ».
exports.frise = [
  [/tartuffe/i, "classicisme", "Le classicisme"],
  [/stances/i, "parnasse", "Le Parnasse"],
  [/vieux n[èe]gre/i, "independances", "Les littératures africaines des indépendances"]
];

// Corrigés du français : classe → dossier. Rattachés à la matière entière : un livret ne suit pas
// le découpage en modules de la fiche MINESEC, le dire chapitre par chapitre serait faux.
exports.corriges = { "6e":"6e", "5e":"5e", "4e":"4e", "3e":"3e", "2nde A":"2nde", "2nde C":"2nde", "1re A":"1ere-a", "1re C":"1ere-cd", "1re D":"1ere-cd", "Tle A":"tle-a", "Tle C":"tle-cd", "Tle D":"tle-cd" };

// Programmes de français par classe.
exports.programmes = { "6e":"6eme", "5e":"5eme", "4e":"4eme", "3e":"3eme", "2nde A":"seconde", "2nde C":"seconde", "1re A":"premiere", "1re C":"premiere", "1re D":"premiere", "Tle A":"terminale", "Tle C":"terminale", "Tle D":"terminale" };

// Évaluations en direct (DB.evaluations, seed d'app.js) : id → [classes, matières].
exports.evaluations = {
  eval_m1:["3e",["maths"]], eval_f1:["3e",["francais"]], eval_pc1:["3e",["pct"]], eval_svt1:["3e",["svt"]], eval_hg1:["3e",["histoire","geo"]],
  eval_en1:["3e",["anglais"]], eval_info1:["3e",["info"]], eval_ph1:["Tle A",["philo"]], eval_lit1:[TOUTES_TLE,["francais"]], eval_m2:["2nde C",["maths"]]
};

// Matière d'une épreuve (EPREUVES_DB) → identifiant(s) Apprendre.
exports.matEpreuve = { "Mathématiques":["maths"], "Français":["francais"], "Physique-Chimie":["pct"], "Physique":["physique"], "SVT":["svt"], "Histoire-Géographie":["histoire","geo"], "Anglais":["anglais"], "Philosophie":["philo"], "Informatique":["info"], "Sciences":["pct","svt"] };

// Outils pour tous : classes "" = toutes. t = famille d'affichage.
exports.outils = [
  { id:"o_notes", t:"notes", ti:"Mes notes et mes coefficients", d:"Calcule ta moyenne avec les coefficients officiels de ta classe et vois ce qui pèse le plus.", u:"notes.html" },
  { id:"o_cible", t:"notes", ti:"La note à viser", d:"Ce qu'il te faut au prochain devoir pour remonter.", u:"/outils/points-manquants.html" },
  { id:"o_planning", t:"notes", ti:"Mon planning de révision", d:"Réparti selon les coefficients.", u:"/outils/planning-revision.html" },
  { id:"o_orient_c", t:"orientation", ti:"Quelle série après ma classe ?", d:"Compare ta moyenne selon les séries, d'après tes propres notes.", u:"notes.html#series", c:"3e,2nde A,2nde C" },
  { id:"o_orient", t:"orientation", ti:"Orientation scolaire", d:"Filières, séries, grandes écoles, bourses et concours.", u:"/app.html#orientation" },
  { id:"o_apres", t:"orientation", ti:"Après l'examen : les poursuites d'études", d:"Après le BEPC, le Probatoire, le BAC : filières et vocabulaire des concours.", u:"/parcours/#apres", c:EXAMENS },
  { id:"o_sujet", t:"direct", ti:"Le sujet du jour", d:"Un sujet à traiter chaque jour, la réponse le soir.", u:"/app.html#sujet-du-jour" },
  { id:"o_erreurs", t:"direct", ti:"Mes erreurs à revoir", d:"Les questions manquées, à refaire.", u:"/app.html#erreurs" },
  { id:"o_mes_eval", t:"direct", ti:"Évaluations de ma classe", d:"Celles que tes enseignants ont ouvertes.", u:"/app.html#mes-evaluations", compte:1 },
  { id:"o_positionnement", t:"direct", ti:"Tester mon niveau", d:"10 questions, tes forces et tes lacunes.", u:"/app.html#positionnement" },
  { id:"o_simulateur", t:"direct", ti:"Examen blanc", d:"Sujet officiel, chronomètre, note.", u:"/app.html#simulateur", c:EXAMENS },
  { id:"o_battles", t:"defis", ti:"Battles de la semaine", d:"10 QCM face aux élèves de ton cycle, classement hebdomadaire.", u:"/app.html#battles", compte:1 },
  { id:"o_classes", t:"defis", ti:"Classes et forum", d:"Échanger avec ta classe et poser tes questions.", u:"/app.html#classes" },
  { id:"o_correction", t:"aide", ti:"Faire corriger ma copie", d:"Une correction détaillée par l'IA.", u:"/app.html#correction-ia", compte:1 },
  { id:"o_ambassa", t:"aide", ti:"Poser une question au Professeur Ambassa", d:"Une explication sur le programme.", u:"/app.html#ambassa" },
  { id:"o_calendrier", t:"aide", ti:"Calendrier scolaire", d:"Examens, vacances, conseils de classe.", u:"/app.html#calendrier" },
  { id:"o_flash", t:"aide", ti:"VÉRITAS Flash", d:"Scanne le QR de ta séquence, les ressources s'ouvrent.", u:"/flash/" },   // gardé : seul chemin vers flash/ (banc_menu_rubriques)
];
