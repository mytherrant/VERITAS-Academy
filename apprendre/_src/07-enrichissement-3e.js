/* Enrichissement des leçons gratuites de 3e (14/11/2026, « Continue l'enrichissement des leçons ») :
   quiz porté à 10 questions corrigées, comme les leçons des abonnés, et situation de vie APC
   (situation + tâche) pour les leçons qui n'en avaient pas. Les questions ne portent que sur
   ce que la leçon enseigne. Rien n'est retiré : on complète. */
function VRT_PLUS(id, quiz, apc) {
  var L = window.VRT_LECONS[id]; if (!L) return;
  L.quiz = (L.quiz || []).concat(quiz.map(function (x) { return { q: x[0], r: x[1], b: x[2], e: x[3] }; })).slice(0, 10);
  if (apc && !L.apc) L.apc = apc;
}

VRT_PLUS("3e-fr-relative", [
  ["« Le village ___ je suis né est loin. »", ["que", "dont", "où", "qui"], 2, "Où : complément de lieu (je suis né dans ce village)."],
  ["Dans « la mangue que tu manges », la fonction de « que » est :", ["sujet", "COD de « manges »", "complément de lieu", "attribut"], 1, "Tu manges quoi ? la mangue : « que » est COD."],
  ["« Voici l'outil ___ je me sers. »", ["que", "dont", "où", "lequel"], 1, "On se sert DE quelque chose : dont."],
  ["Quelle phrase contient une relative explicative ?", ["Les élèves qui ont fini peuvent sortir.", "Le livre que je lis est long.", "Mon père, qui est pêcheur, part à l'aube.", "La ville où j'habite est calme."], 2, "Entre virgules, elle peut être supprimée : explicative."],
  ["L'antécédent de « qui » dans « J'ai vu le taxi qui roulait vite » est :", ["J'", "le taxi", "vite", "roulait"], 1, "La relative complète le nom placé avant elle : le taxi."],
  ["Corrige : « L'ami que je t'ai parlé arrive. »", ["L'ami qui je t'ai parlé", "L'ami dont je t'ai parlé", "L'ami où je t'ai parlé", "L'ami lequel je t'ai parlé"], 1, "Parler DE quelqu'un : dont."]
], { module: "Langue", famille: "Vie quotidienne", agir: "Produire des phrases complexes correctes",
  situation: "Ton cousin écrit au chef du quartier : « Les jeunes ils ont fini le nettoyage. Le caniveau on a curé est propre. Le jour on a travaillé il pleuvait. »",
  tache: "Réécris ces trois phrases en utilisant chaque fois une subordonnée relative correcte, et souligne l'antécédent." });

VRT_PLUS("3e-fr-ville-cruelle", [
  ["En quelle année paraît Ville cruelle ?", ["1945", "1954", "1960", "1972"], 1, "Premier roman de l'auteur, publié en 1954 chez Présence Africaine."],
  ["Quel produit Banda vient-il vendre à Tanga ?", ["Du café", "Du cacao", "Des bananes", "Du bois"], 1, "Son cacao est déclaré « mauvais » au Contrôle et jeté au feu."],
  ["Qui est Koumé ?", ["Le père de Banda", "Le frère d'Odilia", "Un contrôleur", "Un commerçant grec"], 1, "Odilia cherche son frère Koumé, poursuivi après la révolte des ouvriers."],
  ["Tanga-Sud est le quartier :", ["des Africains", "des commerçants et de l'administration coloniale", "des pêcheurs", "des missionnaires seulement"], 1, "Tanga est coupée en deux : Sud colonial, Nord africain."],
  ["Le grand thème du Contrôle du cacao est :", ["l'amour", "l'injustice coloniale", "la fête", "l'école"], 1, "Contrôle arbitraire, violence des gardes : l'injustice coloniale."],
  ["Comment s'appelle le village de Banda ?", ["Moko", "Bamila", "Tanga", "Mbalmayo"], 1, "Moko est un quartier de Tanga-Nord ; le village est Bamila."]
], { module: "Lecture suivie", famille: "Vie socioculturelle", agir: "Lire et interpréter une œuvre intégrale",
  situation: "Au club de lecture, un camarade affirme : « Banda est seulement un jeune orgueilleux qui cherche les problèmes. »",
  tache: "En deux paragraphes, réponds-lui en t'appuyant sur deux épisodes précis du roman (le Contrôle du cacao, la rencontre avec Odilia ou Koumé)." });

VRT_PLUS("3e-maths-racines", [
  ["√64 vaut :", ["6", "8", "16", "32"], 1, "8² = 64."],
  ["√(9 × 4) vaut :", ["6", "13", "36", "√13"], 0, "√9 × √4 = 3 × 2 = 6."],
  ["√(49/25) vaut :", ["7/25", "49/5", "7/5", "5/7"], 2, "√49 / √25 = 7/5."],
  ["Lequel de ces nombres ne peut pas être un carré parfait ?", ["144", "81", "57", "196"], 2, "Un carré parfait ne se termine jamais par 7."],
  ["√75 simplifiée s'écrit :", ["3√5", "5√3", "25√3", "15"], 1, "75 = 25 × 3, donc √75 = 5√3."],
  ["(√7)² vaut :", ["√49", "14", "7", "49"], 2, "(√a)² = a."]
], { module: "Nombres et calculs", famille: "Vie économique", agir: "Calculer et comparer des longueurs",
  situation: "Papa veut entourer de fil barbelé un jardin carré de 196 m². Le vendeur de Mboppi lui propose 50 m de fil.",
  tache: "Calcule le côté du jardin puis son périmètre, et dis si 50 m de fil suffisent." });

VRT_PLUS("3e-maths-thales", [
  ["AM = 4, AB = 10, AC = 15 et (MN) // (BC). AN vaut :", ["6", "9", "37,5", "6,5"], 0, "AM/AB = AN/AC : 4/10 = AN/15, donc AN = 6."],
  ["Le petit triangle se place :", ["au dénominateur", "au numérateur", "n'importe où", "jamais dans la fraction"], 1, "Petit triangle en haut, grand en bas."],
  ["AM/AB = 1/2 signifie que M est :", ["en B", "au milieu de [AB]", "en A", "hors du segment"], 1, "AM vaut la moitié de AB."],
  ["La réciproque de Thalès sert à prouver :", ["qu'un triangle est rectangle", "que deux droites sont parallèles", "une aire", "un angle droit"], 1, "Elle prouve un parallélisme."],
  ["AM = 3, AB = 9, MN = 2. Alors BC vaut :", ["6", "4,5", "13,5", "1/3"], 0, "3/9 = 2/BC donc BC = 6."],
  ["On termine un calcul de Thalès par :", ["une addition", "un produit en croix", "une racine carrée", "le théorème de Pythagore"], 1, "L'égalité de deux rapports se résout par un produit en croix."]
], { module: "Géométrie", famille: "Environnement, bien-être et santé", agir: "Mesurer une hauteur inaccessible",
  situation: "Pour savoir si le palmier de la cour menace le toit de la classe (6 m de haut), vous plantez un bâton de 1,2 m qui fait une ombre de 0,8 m ; au même moment, l'ombre du palmier mesure 5,6 m.",
  tache: "Calcule la hauteur du palmier, en justifiant l'usage de Thalès, et dis s'il dépasse le toit." });

VRT_PLUS("3e-pct-atome", [
  ["La charge d'un électron est :", ["positive", "négative", "nulle", "variable"], 1, "Électrons (−), protons (+), neutrons neutres."],
  ["Le numéro atomique Z est le nombre :", ["de neutrons", "de protons", "d'atomes", "de molécules"], 1, "Z = nombre de protons, carte d'identité de l'élément."],
  ["Le symbole Fe désigne :", ["le fluor", "le fer", "le phosphore", "le francium"], 1, "Fe vient du latin ferrum."],
  ["Le carbone a Z = 6. Combien d'électrons a l'atome de carbone ?", ["3", "6", "12", "0"], 1, "Atome neutre : autant d'électrons que de protons."],
  ["L'espace où se déplacent les électrons s'appelle :", ["le noyau", "le nuage électronique", "la molécule", "l'ion"], 1, "Autour du noyau, un espace presque vide."],
  ["Le noyau de l'atome est chargé :", ["négativement", "positivement", "neutre", "selon le cas"], 1, "Il contient les protons (+) et les neutrons (0)."]
], { module: "La matière", famille: "Environnement, bien-être et santé", agir: "Décrire la constitution de la matière",
  situation: "Ta petite sœur lit sur une boîte de comprimés : « Fer (Fe) » et sur un paquet de sel : « Sodium (Na) ». Elle demande pourquoi on écrit des lettres et si un atome est chargé.",
  tache: "Explique-lui, avec un schéma légendé, la constitution d'un atome, pourquoi il est neutre et ce que signifient ces symboles." });

VRT_PLUS("3e-pct-ph", [
  ["L'eau pure a un pH de :", ["0", "5", "7", "14"], 2, "pH = 7 : solution neutre."],
  ["L'eau de javel est :", ["acide", "neutre", "basique", "sans pH"], 2, "pH > 7 : basique."],
  ["L'unité de la concentration molaire est :", ["g/L", "mol/L", "mol", "L/mol"], 1, "C = n / V, en mol/L."],
  ["0,5 mol dans 250 mL donne C =", ["0,125 mol/L", "2 mol/L", "125 mol/L", "0,5 mol/L"], 1, "250 mL = 0,25 L ; 0,5 ÷ 0,25 = 2 mol/L."],
  ["Pour mesurer précisément le pH, on utilise :", ["un thermomètre", "un pH-mètre", "un voltmètre", "une balance"], 1, "Le papier pH donne une valeur approchée, le pH-mètre est plus précis."],
  ["Au laboratoire, on ne doit jamais :", ["porter des lunettes", "goûter une solution", "utiliser un agitateur", "lire l'étiquette"], 1, "On ne goûte jamais une solution."]
], { module: "Les solutions", famille: "Environnement, bien-être et santé", agir: "Utiliser les solutions sans danger",
  situation: "Au marché, une vendeuse prépare un détachant en versant de l'eau dans un acide concentré ; un autre client veut vérifier si son « jus naturel » est acide en le goûtant.",
  tache: "Dis ce qui est dangereux dans chaque cas et décris la bonne méthode pour diluer un acide et mesurer le pH." });

VRT_PLUS("3e-svt-adn", [
  ["ADN signifie :", ["acide désoxyribonucléique", "acide dynamique nucléaire", "atome de noyau", "aminoacide nucléaire"], 0, "Molécule en double hélice."],
  ["La forme de la molécule d'ADN est :", ["un carré", "une double hélice", "un cercle", "une étoile"], 1, "Deux brins enroulés."],
  ["Les versions différentes d'un même gène s'appellent :", ["chromosomes", "allèles", "noyaux", "cellules"], 1, "Les allèles expliquent les différences entre individus."],
  ["Une fille possède la paire sexuelle :", ["XY", "XX", "YY", "X seul"], 1, "XX chez la fille, XY chez le garçon."],
  ["Combien de paires de chromosomes non sexuels chez l'humain ?", ["22", "23", "46", "12"], 0, "22 paires identiques + 1 paire sexuelle."],
  ["Les expériences de transfert de noyau montrent que l'information génétique est :", ["dans la membrane", "dans le noyau", "dans le sang", "dans le cytoplasme"], 1, "La cellule prend les caractères du donneur du noyau."]
], { module: "Hérédité", famille: "Environnement, bien-être et santé", agir: "Expliquer la transmission des caractères",
  situation: "Une voisine accuse sa belle-fille : « C'est ta faute si vous n'avez eu que des filles. » La belle-fille, en larmes, te demande ton avis.",
  tache: "À l'aide des chromosomes sexuels (XX, XY), explique qui détermine le sexe de l'enfant et pourquoi l'accusation est fausse." });

VRT_PLUS("3e-svt-ressemblances", [
  ["Une espèce rassemble des individus qui :", ["vivent au même endroit", "se ressemblent et donnent des descendants féconds", "ont la même taille", "parlent la même langue"], 1, "Définition de l'espèce : interféconds, descendance féconde."],
  ["La couleur naturelle des yeux est un caractère :", ["acquis", "héréditaire", "de l'espèce", "modifié par le sport"], 1, "Elle vient des parents."],
  ["Les muscles qui grossissent avec le sport : caractère", ["héréditaire", "modifié par le milieu", "de l'espèce", "génétique seulement"], 1, "Le mode de vie le modifie."],
  ["Le pouce opposable est un caractère :", ["individuel", "de l'espèce", "acquis", "rare"], 1, "Commun à tous les humains."],
  ["La forme du lobe de l'oreille est un caractère :", ["de l'espèce", "individuel", "acquis", "du milieu"], 1, "Elle varie d'une personne à l'autre."],
  ["La parole articulée est :", ["un caractère de l'espèce humaine", "un caractère acquis au marché", "un caractère individuel", "propre aux adultes"], 0, "Trait commun à tous les êtres humains."],
  ["Un enfant né de l'âne et de la jument (mulet) est stérile : l'âne et le cheval sont donc", ["la même espèce", "deux espèces différentes", "des caractères individuels", "des allèles"], 1, "Leur descendance n'est pas féconde."]
], { module: "Hérédité", famille: "Environnement, bien-être et santé", agir: "Distinguer l'inné et l'acquis",
  situation: "Deux jumeaux de ta classe ont le même groupe sanguin et les mêmes yeux, mais l'un, qui joue au football tous les jours, est bien plus musclé et plus bronzé.",
  tache: "Classe leurs caractères en héréditaires et modifiés par le milieu, et explique ces différences." });

VRT_PLUS("3e-hist-kamerun", [
  ["Qui hisse le drapeau allemand le 14 juillet 1884 ?", ["Bismarck", "Gustav Nachtigal", "Jesko von Puttkamer", "Rudolf Duala Manga Bell"], 1, "L'explorateur Gustav Nachtigal."],
  ["Quels rois douala signent le traité de 1884 ?", ["Ndumbé Lobé Bell et Ngando Akwa", "Njoya et Mbo", "Samba et Atangana", "Béhanzin et Samory"], 0, "Les rois Bell et Akwa."],
  ["Que désigne le « Neukamerun » de 1911 ?", ["Une ville", "L'agrandissement de la colonie vers l'est et le sud", "Une plantation", "Un traité avec la Grande-Bretagne"], 1, "Accord franco-allemand de 1911."],
  ["Quelle ligne de chemin de fer relie Douala à Nkongsamba ?", ["Le chemin de fer du Centre", "Le chemin de fer du Nord", "Le Transcamerounais", "La ligne de Kribi"], 1, "Chemin de fer du Nord."],
  ["Martin-Paul Samba est :", ["un gouverneur allemand", "un résistant fusillé en 1914", "un commerçant", "un roi douala de 1884"], 1, "Exécuté en 1914 comme Rudolf Duala Manga Bell."],
  ["Première capitale du Kamerun citée par la leçon :", ["Yaoundé", "Buea", "Kribi", "Garoua"], 1, "Capitale à Buea, puis à Douala."],
  ["Les conditions posées par les Douala en 1884 ont été :", ["respectées", "non respectées", "renégociées en 1916", "inscrites dans la Constitution"], 1, "Leurs terres seront expropriées."]
], { module: "Le Cameroun sous domination allemande", famille: "Vie citoyenne et démocratique", agir: "Exploiter des documents historiques",
  situation: "Lors d'une visite au musée de Douala, ton petit frère voit un portrait de Rudolf Duala Manga Bell et demande pourquoi il a été pendu alors que les Douala avaient signé avec les Allemands.",
  tache: "Rédige une courte explication (8 à 10 lignes) : conditions du traité de 1884, expropriation des terres, résistance et exécution de 1914." });

VRT_PLUS("3e-hist-partage", [
  ["La conférence de Berlin se tient :", ["en 1860", "de novembre 1884 à février 1885", "en 1914", "en 1945"], 1, "Du 15 novembre 1884 au 26 février 1885."],
  ["Une cause économique de la conquête :", ["la mission civilisatrice", "le besoin de matières premières", "le prestige", "l'action des missionnaires"], 1, "L'industrie européenne a besoin de matières premières et de marchés."],
  ["Les fleuves déclarés libres à la navigation :", ["Nil et Zambèze", "Congo et Niger", "Sanaga et Wouri", "Orange et Limpopo"], 1, "Liberté de navigation sur le Congo et le Niger."],
  ["La « course au clocher » désigne :", ["une fête religieuse", "la course des puissances pour occuper des territoires", "une compétition sportive", "la construction d'églises"], 1, "Après Berlin, chaque puissance se hâte d'occuper."],
  ["Un résistant africain à la conquête :", ["Bismarck", "Samory Touré", "Nachtigal", "Lincoln"], 1, "Samory Touré, comme Béhanzin ou Menelik II."],
  ["Les frontières tracées en lignes droites :", ["suivaient les peuples", "ne tenaient pas compte des peuples", "étaient choisies par les Africains", "suivaient toujours les fleuves"], 1, "Tracées sans tenir compte des peuples."]
], { module: "L'impérialisme européen", famille: "Vie citoyenne et démocratique", agir: "Expliquer l'origine des frontières africaines",
  situation: "Un camarade s'étonne : sur la carte de l'Afrique, beaucoup de frontières sont des lignes droites, et des peuples comme les Fang vivent dans plusieurs pays.",
  tache: "Explique-lui, en t'appuyant sur la conférence de Berlin et le partage, l'origine de ces frontières." });

VRT_PLUS("3e-geo-cameroun", [
  ["Capitale politique du Cameroun :", ["Douala", "Yaoundé", "Bamenda", "Garoua"], 1, "Yaoundé politique, Douala économique."],
  ["Superficie approximative :", ["47 565 km²", "475 650 km²", "4 756 500 km²", "1 000 000 km²"], 1, "Environ 475 650 km²."],
  ["Pays voisin au nord-est :", ["Le Nigeria", "Le Tchad", "Le Gabon", "Le Congo"], 1, "Tchad au nord-est, Nigeria à l'ouest."],
  ["Les langues officielles sont :", ["français et allemand", "français et anglais", "anglais et pidgin", "français seulement"], 1, "Deux langues officielles, plus de 250 langues nationales."],
  ["Le mont Cameroun se trouve dans :", ["la plaine côtière du Nord", "les hautes terres de l'Ouest", "l'Adamaoua", "les basses terres du Nord"], 1, "Volcans et sols fertiles des hautes terres."],
  ["La forêt dense couvre surtout :", ["le plateau sud-camerounais", "les monts Mandara", "le lac Tchad", "l'Adamaoua"], 0, "Plateau sud couvert de forêt dense."],
  ["Le Cameroun s'ouvre sur :", ["l'océan Indien", "l'océan Atlantique", "la mer Rouge", "la Méditerranée"], 1, "Au fond du golfe de Guinée, sur l'Atlantique."]
], { module: "Le Cameroun : cadre naturel", famille: "Vie économique", agir: "Présenter un pays à partir d'une carte",
  situation: "Un correspondant gabonais te demande, pour son exposé, de lui présenter le Cameroun en une page.",
  tache: "Rédige cette présentation : situation, voisins, chiffres clés et les cinq grandes régions naturelles du sud au nord." });

VRT_PLUS("3e-geo-mangrove", [
  ["La mangrove pousse :", ["en haute montagne", "dans les zones de balancement des marées", "dans le désert", "en savane"], 1, "Là où l'eau douce rencontre l'eau salée."],
  ["L'eau de la mangrove, mélange d'eau douce et salée, est dite :", ["potable", "saumâtre", "distillée", "minérale"], 1, "Eau saumâtre."],
  ["Où trouve-t-on surtout la mangrove au Cameroun ?", ["Estuaire du Wouri et Rio del Rey", "Lac Tchad", "Adamaoua", "Monts Mandara"], 0, "Estuaire du Wouri (Douala-Edéa) et Rio del Rey."],
  ["La mangrove aide à lutter contre le réchauffement car elle :", ["chauffe l'eau", "stocke beaucoup de carbone", "produit du pétrole", "attire les touristes"], 1, "Elle stocke du carbone."],
  ["Une solution pour réduire la coupe du bois :", ["les fumoirs améliorés", "plus de plastiques", "l'extension de la ville", "brûler la vase"], 0, "Ils consomment moins de bois pour fumer le poisson."],
  ["Les racines qui sortent de la vase permettent aux palétuviers de :", ["voler", "respirer", "se déplacer", "boire de l'eau salée seulement"], 1, "La vase manque d'air."],
  ["La mangrove protège le littoral contre :", ["l'érosion et les tempêtes", "la sécheresse", "les criquets", "le froid"], 0, "Rôle de protection de la côte."]
], { module: "Environnement et développement", famille: "Environnement, bien-être et santé", agir: "Proposer des solutions pour protéger un milieu",
  situation: "À Youpwé, des pêcheuses coupent chaque semaine des palétuviers pour fumer le poisson ; les pêcheurs disent que les crevettes se font rares.",
  tache: "Rédige une affiche de sensibilisation : rôle de la mangrove, lien avec la baisse des prises, et trois solutions concrètes." });

VRT_PLUS("3e-ecm-democratie", [
  ["« Dêmos » signifie :", ["le pouvoir", "le peuple", "la loi", "la ville"], 1, "Dêmos : le peuple ; kratos : le pouvoir."],
  ["La formule « gouvernement du peuple, par le peuple, pour le peuple » est de :", ["Montesquieu", "Abraham Lincoln", "Rousseau", "Bismarck"], 1, "Abraham Lincoln."],
  ["Les trois pouvoirs séparés sont :", ["législatif, exécutif, judiciaire", "militaire, religieux, civil", "local, national, mondial", "politique, économique, social"], 0, "Séparation théorisée par Montesquieu."],
  ["L'État de droit signifie que :", ["seuls les citoyens obéissent aux lois", "gouvernants et gouvernés obéissent aux mêmes lois", "le chef fait la loi seul", "il n'y a pas de lois"], 1, "Tous sont soumis aux mêmes lois."],
  ["Le pluralisme, c'est :", ["un parti unique", "la coexistence de plusieurs partis et opinions", "le vote obligatoire", "l'absence d'élections"], 1, "Plusieurs partis et opinions peuvent exister."],
  ["Représentation + référendum, c'est la démocratie :", ["directe", "représentative", "semi-directe", "absolue"], 2, "Semi-directe."],
  ["Au Cameroun, la Constitution organise une démocratie :", ["directe", "représentative, avec possibilité de référendum", "sans élection", "monarchique"], 1, "Démocratie représentative avec référendum possible."]
], { module: "La démocratie", famille: "Vie citoyenne et démocratique", agir: "Participer à la vie démocratique",
  situation: "Pour élire le chef de classe, le professeur principal propose que le surveillant général le désigne seul « pour gagner du temps ».",
  tache: "Rédige une lettre polie au professeur principal pour proposer une élection, en t'appuyant sur trois piliers de la démocratie." });

VRT_PLUS("3e-ecm-sieges", [
  ["12 000 suffrages exprimés, 4 sièges : quotient =", ["4 000", "3 000", "48 000", "2 400"], 1, "12 000 ÷ 4 = 3 000."],
  ["Avec un quotient de 2 000, une liste à 5 300 voix obtient au quotient :", ["1 siège", "2 sièges", "3 sièges", "5 sièges"], 1, "Partie entière de 5 300 ÷ 2 000 = 2."],
  ["Son reste est alors :", ["300", "1 300", "2 000", "3 300"], 1, "5 300 − 2 × 2 000 = 1 300."],
  ["Le quotient électoral se calcule avec :", ["les inscrits", "les suffrages exprimés", "les bulletins nuls", "la population"], 1, "Suffrages exprimés ÷ sièges."],
  ["Au Cameroun, les législatives combinent :", ["majoritaire et proportionnelle", "tirage au sort et vote", "nomination et vote", "proportionnelle seule"], 0, "Système mixte (Code électoral de 2012)."],
  ["Avec les plus forts restes, une petite liste peut :", ["obtenir un siège sans atteindre le quotient", "perdre ses voix", "doubler ses sièges", "annuler l'élection"], 0, "Exemple de la liste C : 0 siège au quotient, 1 au plus fort reste."],
  ["Si 4 sièges sont attribués au quotient sur 6, il en reste :", ["0", "2", "4", "6"], 1, "6 − 4 = 2 sièges aux plus forts restes."]
], { module: "La vie démocratique", famille: "Vie citoyenne et démocratique", agir: "Calculer une répartition de sièges",
  situation: "Le conseil des délégués du lycée compte 5 sièges. Résultats : liste Avenir 410 voix, Unité 290, Réussite 180, Solidarité 120 (1 000 suffrages exprimés).",
  tache: "Calcule le quotient, puis répartis les 5 sièges au quotient et aux plus forts restes, en présentant un tableau." });

VRT_PLUS("3e-en-present", [
  ["He ___ football every afternoon.", ["play", "plays", "is play", "playing"], 1, "Habit, he/she/it: -s."],
  ["Look! The children ___ in the rain.", ["dance", "dances", "are dancing", "is dancing"], 2, "Action happening now: are + -ing."],
  ["They ___ like fish.", ["doesn't", "don't", "isn't", "aren't"], 1, "Negative with they: don't."],
  ["___ your mother work at the hospital?", ["Do", "Does", "Is", "Are"], 1, "Question with he/she: does."],
  ["Which sentence is correct?", ["I am needing water.", "I need water.", "I needs water.", "I am need water."], 1, "Need is a state verb: simple present."],
  ["We ___ English at the moment.", ["study", "are studying", "studies", "is studying"], 1, "At the moment: present continuous."],
  ["The sun ___ in the east.", ["rise", "rises", "is rising always", "rising"], 1, "General truth: simple present."]
], { module: "Grammar", famille: "Everyday life", agir: "Talk about habits and current actions",
  situation: "Your pen friend in Bamenda asks you to describe a normal school day and what your family is doing right now, on a Saturday morning.",
  tache: "Write 8 to 10 sentences: four in the simple present (habits) and four in the present continuous (now). Underline the time markers." });

VRT_PLUS("3e-en-articles", [
  ["She is ___ honest girl.", ["a", "an", "the", "no article"], 1, "Honest: silent h, vowel sound."],
  ["___ sun rises early in Garoua.", ["A", "An", "The", "No article"], 2, "Unique thing: the."],
  ["He wants to go to ___ university.", ["a", "an", "the", "no article"], 0, "University starts with a « you » sound: a."],
  ["I bought a radio. ___ radio is new.", ["A", "An", "The", "No article"], 2, "Already mentioned: the."],
  ["She speaks ___ French.", ["a", "the", "an", "no article"], 3, "No article with languages."],
  ["Paul is ___ tallest boy in the class.", ["a", "an", "the", "no article"], 2, "Superlative: the."],
  ["___ Atlantic Ocean is near Kribi.", ["A", "An", "The", "No article"], 2, "Oceans take the."]
], { module: "Grammar", famille: "Everyday life", agir: "Use articles correctly in writing",
  situation: "Your cousin wrote this short text for the school magazine: « I live in the Douala. I have a uncle who is the engineer. He likes the mangoes. Last week, he visited Wouri. »",
  tache: "Correct the five article mistakes and explain each correction in one short sentence." });
