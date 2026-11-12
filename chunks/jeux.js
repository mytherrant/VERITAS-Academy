/* VÉRITAS — catalogue des jeux éducatifs (chargé à la demande).
   47 Ko, ouvert uniquement depuis la page Jeux & Œuvres. Le module REMPLIT
   le tableau déjà déclaré dans app.js (push) au lieu de le remplacer : les
   44 points de lecture du code restent inchangés. */
/* 12/11/2026 : TOUS les jeux intégrés sont gratuits (« pour mieux captiver et
   attirer les apprenants », Jacques) : Conjugaison, Figures de rhétorique et les
   quiz Physique, Géographie, Maths, SVT ne l'étaient pas. */
Array.prototype.push.apply(window.JEUX_CATALOGUE, [
  {id:"j1",titre:"Calcul Mental",emoji:"🔢",matiere:"Maths",niveau:"6eme-3eme",
   desc:"Additions, soustractions, multiplications et divisions chronometrees",gratuit:true,
   action:"lancerCalculMental"},
  {id:"j2",titre:"Devinette Personnages",emoji:"🧩",matiere:"Histoire-Geo",niveau:"3eme-Tle",
   desc:"Retrouvez les grands personnages de l'histoire africaine et mondiale",gratuit:true,
   action:"lancerDevinette"},
  {id:"j3",titre:"Orthographe Challenge",emoji:"✍️",matiere:"Francais",niveau:"6eme-3eme",
   desc:"Ecrivez correctement les mots difficiles du programme camerounais",gratuit:true,
   action:"lancerOrthographe"},
  {id:"j4",titre:"Geographie Cameroun",emoji:"🗺️",matiere:"Geographie",niveau:"5eme-3eme",
   desc:"Situez les regions, villes et fleuves du Cameroun sur la carte",gratuit:true,
   action:"lancerCarteGeo"},
  {id:"j5",titre:"Conjugaison Express",emoji:"📝",matiere:"Francais",niveau:"6eme-Tle",
   desc:"Conjuguez rapidement les verbes irreguliers et les temps composes",gratuit:true,
   action:"lancerConjugaison"},
  {id:"j6",titre:"Figures de Rhetorique",emoji:"📖",matiere:"Litterature",niveau:"3eme-1ere",
   desc:"Identifiez metaphores, allegories et autres figures de style",gratuit:true,
   action:"lancerFigures"},
  {id:"j7",titre:"Tableau Periodique",emoji:"⚗️",matiere:"Physique-Chimie",niveau:"3eme-2nde",
   desc:"Retrouvez les elements chimiques par leur symbole et numero atomique",gratuit:true,
   action:"lancerTableauPeriodique"},
  {id:"j8",titre:"Mots Caches Scientifiques",emoji:"🔬",matiere:"SVT",niveau:"4eme-1ere",
   desc:"Retrouvez les termes scientifiques caches dans la grille",gratuit:true,
   action:"lancerMotsCaches"},
  // ── OEUVRES LITTERAIRES 3ème ──
  {id:"j_3e_enfant_noir_qcm",titre:"L'Enfant Noir — Quiz 3ème",emoji:"📚",matiere:"Litterature",niveau:"3eme",
   desc:"QCM sur l'œuvre de Camara Laye au programme de 3ème",gratuit:true,type:"qcm",action:"lancerJLitL3e_enfant_noir",
   questions:[
    {q:"Qui est l'auteur de 'L'Enfant Noir' ?",opts:["Mongo Beti","Ferdinand Oyono","Camara Laye","Sembène Ousmane"],ans:2,exp:"Camara Laye (1928-1980), auteur guinéen. Roman autobiographique publié en 1953."},
    {q:"Dans quelle ville de Guinée est né le narrateur de 'L'Enfant Noir' ?",opts:["Conakry","Kouroussa","Kankan","Kindia"],ans:1,exp:"Le narrateur est né à Kouroussa, ville de Haute-Guinée."},
    {q:"Quel est le métier du père dans 'L'Enfant Noir' ?",opts:["Cultivateur","Forgeron","Pêcheur","Enseignant"],ans:1,exp:"Le père est forgeron et travaille l'or. Il a un don mystique lié à son totem : un serpent noir."},
    {q:"Quel animal symbolise le don mystique du père ?",opts:["Le lion","Le serpent noir","L'aigle","Le crocodile"],ans:1,exp:"Un petit serpent noir se glisse dans l'atelier du père — c'est son génie protecteur."},
    {q:"Où le narrateur est-il envoyé pour poursuivre ses études ?",opts:["Abidjan","Dakar","Paris","Conakry"],ans:2,exp:"Le roman se termine par le départ du narrateur pour Paris, symbole du déchirement culturel."},
    {q:"Quel thème central traverse 'L'Enfant Noir' ?",opts:["La guerre coloniale","Le conflit tradition/modernité","L'amour romantique","La révolte politique"],ans:1,exp:"Le roman explore la tension entre les traditions africaines et l'éducation occidentale imposée par la colonisation."},
    {q:"Quel est le prénom du narrateur ?",opts:["Kofi","Laye","Amadou","Toundi"],ans:1,exp:"Le narrateur se prénomme Laye, comme l'auteur lui-même — confirmant le caractère autobiographique."},
    {q:"Comment s'appelle l'ami d'enfance du narrateur ?",opts:["Kouyaté","Fanta","Check","Sidafa"],ans:3,exp:"Sidafa est le meilleur ami de Laye, avec qui il partage les jeux et les aventures du village."},
   ]},
  {id:"j_3e_enfant_noir_pendu",titre:"L'Enfant Noir — Pendu",emoji:"✏️",matiere:"Litterature",niveau:"3eme",
   desc:"Retrouvez les mots-clés de l'œuvre de Camara Laye",gratuit:true,type:"pendu",action:"lancerJLitP3e_enfant_noir",
   questions:[
    {mot:"KOUROUSSA",ind:"Ville natale du narrateur en Guinée"},
    {mot:"FORGERON",ind:"Métier du père dans l'œuvre"},
    {mot:"TOTEM",ind:"Animal spirituel protecteur"},
    {mot:"GUINEE",ind:"Pays d'origine de Camara Laye"},
    {mot:"AUTOBIOGRAPHIQUE",ind:"Genre de ce roman"},
    {mot:"TRADITION",ind:"Valeur défendue face à la modernité"},
    {mot:"PARIS",ind:"Destination finale du narrateur"},
   ]},
  {id:"j_3e_vieux_negre_qcm",titre:"Le Vieux Nègre et la Médaille — Quiz Tle",emoji:"🏅",matiere:"Litterature",niveau:"Terminale",
   desc:"QCM sur l'œuvre de Ferdinand Oyono",gratuit:true,type:"qcm",action:"lancerJLitL3e_vieux_negre",
   questions:[
    {q:"Qui est l'auteur du 'Vieux Nègre et la Médaille' ?",opts:["Camara Laye","Mongo Beti","Ferdinand Oyono","Cheikh Hamidou Kane"],ans:2,exp:"Ferdinand Oyono (1929-2010), écrivain camerounais né à Ebolowa. Roman publié en 1956, satire du colonialisme."},
    {q:"Quel est le nom du personnage principal ?",opts:["Toundi","Meka","Medza","Samba Diallo"],ans:1,exp:"Meka est le vieux paysan catholique du village de Doum, personnage central dont la naïveté révèle le cynisme colonial."},
    {q:"Pourquoi Meka reçoit-il une médaille ?",opts:["Pour ses exploits militaires","Pour avoir donné ses fils à la guerre et ses terres aux missionnaires","Pour être le chef du village","Pour son travail à l'administration"],ans:1,exp:"Meka a perdu ses deux fils à la guerre et cédé ses terres aux missionnaires — des sacrifices colossaux que la médaille coloniale compense dérisoi­rement."},
    {q:"Comment s'appelle la femme de Meka ?",opts:["Mami Titi","Amalia","Kelara","Doumba"],ans:2,exp:"Kelara est la femme aimante et fidèle de Meka, qui partage ses espoirs et leur désillusion commune après la cérémonie."},
    {q:"Dans quel village vivent Meka et sa femme ?",opts:["Ebolowa","Tanga","Doum","Mbalmayo"],ans:2,exp:"Meka habite le village de Doum, communauté rurale camerounaise dont la vie simple contraste avec l'absurdité du pouvoir colonial."},
    {q:"Qui est Mami Titi dans le roman ?",opts:["La femme du gouverneur","La fille de Meka","Une distillatrice d'arki du village","La cuisinière de l'administration coloniale"],ans:2,exp:"Mami Titi est une femme de Doum qui distille l'arki (eau-de-vie locale) — figure pittoresque et vivante de la communauté africaine."},
    {q:"Quelle mésaventure Meka vit-il la nuit de la remise de médaille ?",opts:["Il est félicité par le gouverneur","Il est arrêté et mis en prison par erreur","Il perd sa médaille dans la foule","Il rencontre le roi de France"],ans:1,exp:"Meka est arrêté par erreur par la police coloniale et passe la nuit en prison — cruelle ironie du sort pour celui qu'on vient de décorer."},
    {q:"Quelle est la tonalité dominante de ce roman ?",opts:["Tragique et épique","Ironique et satirique","Romantique et lyrique","Didactique et moralisatrice"],ans:1,exp:"Oyono use d'une ironie mordante pour critiquer l'administration coloniale et dénoncer l'hypocrisie de ses valeurs affichées."},
    {q:"Que symbolise la médaille dans le roman ?",opts:["La gloire africaine","La duperie et l'humiliation coloniale","Une récompense méritée","Le progrès social"],ans:1,exp:"La médaille symbolise le mensonge colonial : elle ne compense ni les sacrifices de Meka, ni la perte de ses fils et de ses terres."},
   ]},
  {id:"j_3e_vf_lit",titre:"Littérature 3ème — Vrai / Faux",emoji:"✅",matiere:"Litterature",niveau:"3eme",
   desc:"Vrai ou Faux sur les œuvres au programme de 3ème",gratuit:true,type:"vf",action:"lancerJLitVF3e",
   questions:[
    {q:"Camara Laye est un auteur camerounais.",opts:["Vrai","Faux"],ans:1,exp:"Faux. Camara Laye est guinéen, né à Kouroussa en 1928."},
    {q:"Dans 'L'Enfant Noir', le père du narrateur est forgeron.",opts:["Vrai","Faux"],ans:0,exp:"Vrai. Il travaille l'or et possède un don mystique symbolisé par le serpent noir."},
    {q:"'Le Vieux Nègre et la Médaille' est une œuvre de Mongo Beti.",opts:["Vrai","Faux"],ans:1,exp:"Faux. C'est Ferdinand Oyono qui est l'auteur (1956)."},
    {q:"'Mission Terminée' est l'œuvre de Mongo Beti.",opts:["Vrai","Faux"],ans:0,exp:"Vrai. Mongo Beti (Alexandre Biyidi) a publié 'Mission Terminée' en 1957."},
    {q:"Le narrateur de 'L'Enfant Noir' finit par rester en Guinée.",opts:["Vrai","Faux"],ans:1,exp:"Faux. Il part pour Paris poursuivre ses études, illustrant le déracinement culturel."},
   ]},
  // ── OEUVRES LITTERAIRES 1ère ──
  {id:"j_1e_antigone_qcm",titre:"Antigone (Anouilh) — Quiz 1ère",emoji:"🎭",matiere:"Litterature",niveau:"1ere",
   desc:"QCM sur Antigone de Jean Anouilh au programme de 1ère",gratuit:true,type:"qcm",action:"lancerJLitL1e_antigone",
   questions:[
    {q:"Qui est l'auteur de la pièce 'Antigone' au programme de 1ère ?",opts:["Sophocle","Jean Anouilh","Albert Camus","Jean Racine"],ans:1,exp:"Jean Anouilh (1910-1987) adapte le mythe grec de Sophocle dans une version moderne, créée en 1944 sous l'Occupation."},
    {q:"Contre quel décret Antigone se révolte-t-elle ?",opts:["L'interdiction du mariage","L'interdiction d'enterrer son frère Polynice","L'ordre de quitter Thèbes","La condamnation à mort de Créon"],ans:1,exp:"Créon interdit d'enterrer Polynice, considéré comme traître. Antigone transgresse ce décret par devoir filial et religieux."},
    {q:"Qui est Créon dans la pièce ?",opts:["Le père d'Antigone","L'amant d'Antigone","Le roi de Thèbes et oncle d'Antigone","Le frère d'Antigone"],ans:2,exp:"Créon est le roi de Thèbes, oncle d'Antigone. Il incarne le réalisme politique face à l'idéalisme d'Antigone."},
    {q:"Quel est le fiancé d'Antigone ?",opts:["Étéocle","Polynice","Hémon","Tirésias"],ans:2,exp:"Hémon, fils de Créon, est le fiancé d'Antigone. Il se suicidera après sa mort."},
    {q:"Comment Antigone meurt-elle ?",opts:["Décapitée","Empoisonnée","Emmurée vivante","Noyée"],ans:2,exp:"Créon la condamne à être emmurée vivante dans une caverne. Elle se suicide avant."},
    {q:"Quel thème oppose Antigone à Créon ?",opts:["La guerre et la paix","La loi divine vs la loi des hommes","L'amour et la haine","La richesse et la pauvreté"],ans:1,exp:"Antigone représente la loi divine (les dieux exigent l'enterrement) face à Créon et la raison d'État."},
    {q:"En quelle année Jean Anouilh crée-t-il sa version d'Antigone ?",opts:["1938","1944","1950","1962"],ans:1,exp:"Créée en 1944, sous l'Occupation allemande, la pièce résonne comme une allégorie de la résistance."},
   ]},
  {id:"j_1e_bouts_de_bois_qcm",titre:"Les Bouts de Bois de Dieu — Quiz 1ère",emoji:"🚂",matiere:"Litterature",niveau:"1ere",
   desc:"QCM sur l'œuvre de Sembène Ousmane",gratuit:true,type:"qcm",action:"lancerJLitL1e_bouts_bois",
   questions:[
    {q:"Qui a écrit 'Les Bouts de Bois de Dieu' ?",opts:["Mongo Beti","Ferdinand Oyono","Camara Laye","Sembène Ousmane"],ans:3,exp:"Sembène Ousmane (1923-2007), écrivain et cinéaste sénégalais. Roman publié en 1960."},
    {q:"Quel événement historique est au cœur du roman ?",opts:["La Première Guerre mondiale","La grève du chemin de fer Dakar-Niger (1947-1948)","L'indépendance du Sénégal","La Seconde Guerre mondiale"],ans:1,exp:"Le roman s'inspire de la grande grève des cheminots africains (oct. 1947 - mars 1948) sur la ligne Dakar-Niger."},
    {q:"Quel est le thème dominant du roman ?",opts:["L'amour romantique","La lutte collective ouvrière contre le colonialisme","La tradition africaine","La vie scolaire"],ans:1,exp:"La solidarité et la lutte collective face à l'exploitation coloniale : les travailleurs africains réclament l'égalité des droits."},
    {q:"Quel rôle jouent les femmes dans ce roman ?",opts:["Elles restent passives","Elles trahissent la grève","Elles sont actrices essentielles de la résistance","Elles sont absentes"],ans:2,exp:"Les femmes (Penda, Ramatoulaye, N'Deye Touti) jouent un rôle moteur : marche des femmes de Thiès à Dakar."},
    {q:"D'où vient le titre 'Les Bouts de Bois de Dieu' ?",opts:["D'une expression française","D'un proverbe wolof désignant les hommes","Du nom d'une locomotive","D'un conte peul"],ans:1,exp:"Expression wolof : 'les bouts de bois de Dieu' = les hommes, créés par Dieu, égaux en dignité."},
   ]},
  {id:"j_1e_vf_lit",titre:"Littérature 1ère — Vrai / Faux",emoji:"✅",matiere:"Litterature",niveau:"1ere",
   desc:"Vrai ou Faux sur les œuvres au programme de 1ère",gratuit:true,type:"vf",action:"lancerJLitVF1e",
   questions:[
    {q:"Jean Anouilh a écrit 'Antigone' en s'inspirant de Sophocle.",opts:["Vrai","Faux"],ans:0,exp:"Vrai. Anouilh reprend le mythe grec de Sophocle et le modernise (1944)."},
    {q:"'Les Bouts de Bois de Dieu' raconte la grève des enseignants.",opts:["Vrai","Faux"],ans:1,exp:"Faux. C'est la grève des cheminots sur la ligne Dakar-Niger (1947-1948)."},
    {q:"Dans Antigone, Hémon est le frère d'Antigone.",opts:["Vrai","Faux"],ans:1,exp:"Faux. Hémon est son fiancé, fils du roi Créon."},
    {q:"Sembène Ousmane est également cinéaste.",opts:["Vrai","Faux"],ans:0,exp:"Vrai. Il est considéré comme le père du cinéma africain."},
    {q:"Créon laisse finalement Antigone en vie.",opts:["Vrai","Faux"],ans:1,exp:"Faux. Créon la condamne à être emmurée vivante. Elle se suicide avant l'exécution."},
   ]},
  {id:"j_1e_antigone_trous",titre:"Antigone — Texte à trous",emoji:"✍️",matiere:"Litterature",niveau:"1ere",
   desc:"Complétez les phrases sur Antigone d'Anouilh",gratuit:true,type:"trous",action:"lancerJLitT1e_antigone",
   questions:[
    {q:"L'auteur de la pièce 'Antigone' adaptée en 1944 est Jean ___.",ans:"Anouilh",exp:"Jean Anouilh, dramaturge français (1910-1987)."},
    {q:"Antigone transgresse le décret de ___ en enterrant son frère.",ans:"Créon",exp:"Créon est le roi de Thèbes qui a interdit d'enterrer Polynice."},
    {q:"Le fiancé d'Antigone s'appelle ___.",ans:"Hémon",exp:"Hémon, fils de Créon, se suicide après la mort d'Antigone."},
    {q:"Antigone est condamnée à être ___ vivante.",ans:"emmurée",exp:"Elle sera emmurée dans une caverne — peine qu'elle devance en se suicidant."},
    {q:"La pièce d'Anouilh oppose la loi ___ à la loi des hommes.",ans:"divine",exp:"Antigone revendique une loi supérieure, divine et naturelle, contre la loi politique de Créon."},
   ]},
  // ── OEUVRES LITTERAIRES Terminale ──
  {id:"j_tle_huis_clos_qcm",titre:"Huis Clos (Sartre) — Quiz Tle",emoji:"🔐",matiere:"Litterature",niveau:"Terminale",
   desc:"QCM sur Huis Clos de Jean-Paul Sartre",gratuit:true,type:"qcm",action:"lancerJLitLTle_huis_clos",
   questions:[
    {q:"Qui est l'auteur de 'Huis Clos' ?",opts:["Albert Camus","Jean Anouilh","Jean-Paul Sartre","Simone de Beauvoir"],ans:2,exp:"Jean-Paul Sartre (1905-1980), philosophe existentialiste et dramaturge français. Pièce créée en 1944."},
    {q:"Quelle est la célèbre formule de 'Huis Clos' ?",opts:["'Je pense donc je suis'","'L'enfer, c'est les Autres'","'L'existence précède l'essence'","'Dieu est mort'"],ans:1,exp:"'L'enfer, c'est les Autres' : les personnages se torturent mutuellement pour l'éternité."},
    {q:"Combien de personnages principaux y a-t-il dans 'Huis Clos' ?",opts:["2","3","4","5"],ans:1,exp:"Trois personnages : Garcin, Inès et Estelle, enfermés dans un salon d'hôtel — leur enfer."},
    {q:"Qu'est-ce que le lieu de 'Huis Clos' représente ?",opts:["Une prison ordinaire","Un hôpital psychiatrique","L'enfer sous forme d'un salon d'hôtel","Le paradis"],ans:2,exp:"L'enfer est représenté comme un salon bourgeois banal — ni flammes ni torture physique, seulement la présence des autres."},
    {q:"Quel courant philosophique 'Huis Clos' illustre-t-il ?",opts:["Le structuralisme","L'existentialisme","Le marxisme","Le surréalisme"],ans:1,exp:"L'existentialisme sartrien : l'existence précède l'essence, l'homme est condamné à être libre et défini par ses actes."},
    {q:"Pourquoi les personnages ne peuvent-ils pas dormir ?",opts:["La lumière ne s'éteint jamais","Ils ont peur","Le bruit les empêche","La pièce est trop froide"],ans:0,exp:"La lumière électrique est constamment allumée — pas de sommeil, pas de répit, pas de fuite dans l'inconscience."},
   ]},
  {id:"j_tle_bouts_bois_qcm",titre:"Les Bouts de Bois de Dieu — Quiz Tle",emoji:"✊",matiere:"Litterature",niveau:"Terminale",
   desc:"Quiz approfondi sur Sembène Ousmane pour la Terminale",gratuit:true,type:"qcm",action:"lancerJLitLTle_bouts_bois",
   questions:[
    {q:"Quelle ville est le point de départ de la marche des femmes ?",opts:["Dakar","Saint-Louis","Thiès","Bamako"],ans:2,exp:"Les femmes partent de Thiès pour rejoindre Dakar à pied, symbole de résistance collective."},
    {q:"Qui est Penda dans le roman ?",opts:["La femme du chef syndicaliste","Une femme courageuse qui mène la marche","La secrétaire de l'administration","Une institutrice"],ans:1,exp:"Penda est une figure féminine centrale : rebelle, forte, elle dirige la marche des femmes de Thiès à Dakar."},
    {q:"Que signifie l'expression wolof 'Bouts de Bois de Dieu' ?",opts:["Les locomotives","Les rails du chemin de fer","Les êtres humains, créés égaux par Dieu","Les bâtons des policiers"],ans:2,exp:"Proverbe wolof : tous les hommes sont des 'bouts de bois de Dieu' — égaux en dignité devant le Créateur."},
    {q:"Quel personnage représente la jeunesse tiraillée entre tradition et modernité ?",opts:["Bakayoko","N'Deye Touti","Ramatoulaye","Lahbib"],ans:1,exp:"N'Deye Touti est instruite, admiratrice de la culture française, mais finit par rejoindre la lutte collective."},
    {q:"Comment se termine la grève ?",opts:["Par un échec total","Par une victoire partielle des grévistes","Par l'arrestation de tous les leaders","Par une répression militaire définitive"],ans:1,exp:"Les cheminots obtiennent des avancées (alignement des salaires) — victoire symbolique qui préfigure l'indépendance."},
   ]},
  {id:"j_tle_ville_cruelle_qcm",titre:"Ville Cruelle (Mongo Beti) — Quiz 3ème",emoji:"🌆",matiere:"Litterature",niveau:"3eme",
   desc:"QCM sur Ville Cruelle de Mongo Beti au programme Terminale",gratuit:true,type:"qcm",action:"lancerJLitLTle_ville_cruelle",
   questions:[
    {q:"Quel est le vrai nom de Mongo Beti ?",opts:["Ferdinand Oyono","Alexandre Biyidi-Awala","Rene Philombe","Patrice Ndedi Penda"],ans:1,exp:"Alexandre Biyidi-Awala, né à Mbalmayo (Cameroun) en 1932. Mongo Beti est son pseudonyme littéraire."},
    {q:"De quel pays est originaire Mongo Beti ?",opts:["Sénégal","Guinée","Cameroun","Congo"],ans:2,exp:"Mongo Beti est camerounais. Il est considéré comme l'un des pères de la littérature africaine francophone."},
    {q:"Quel est le thème central de 'Ville Cruelle' ?",opts:["L'amour impossible","L'exploitation coloniale et la corruption","La tradition orale africaine","La guerre de libération"],ans:1,exp:"Le roman dénonce l'exploitation économique coloniale, la corruption et la violence de la ville africaine colonisée."},
    {q:"Quel est le nom du personnage principal de 'Ville Cruelle' ?",opts:["Meka","Banda","Laye","Medza"],ans:1,exp:"Banda est un jeune paysan camerounais qui affronte la brutalité du système colonial pour vendre son cacao."},
    {q:"'Ville Cruelle' a d'abord été publié sous quel pseudonyme ?",opts:["Mongo Beti","Eza Boto","Alexandre Biyidi","Ferdinand Oyono"],ans:1,exp:"Publié en 1954 sous le pseudonyme 'Eza Boto' avant que Mongo Beti ne soit définitivement adopté."},
   ]},
  {id:"j_tle_vf_lit",titre:"Littérature Terminale — Vrai / Faux",emoji:"✅",matiere:"Litterature",niveau:"Terminale",
   desc:"Vrai ou Faux sur les œuvres littéraires au programme de Terminale",gratuit:true,type:"vf",action:"lancerJLitVFTle",
   questions:[
    {q:"'Huis Clos' de Sartre illustre le courant existentialiste.",opts:["Vrai","Faux"],ans:0,exp:"Vrai. La formule 'L'enfer, c'est les Autres' résume la vision existentialiste sartriennes de la liberté et de l'altérité."},
    {q:"Mongo Beti est sénégalais.",opts:["Vrai","Faux"],ans:1,exp:"Faux. Mongo Beti (Alexandre Biyidi) est camerounais, né à Mbalmayo en 1932."},
    {q:"Dans 'Huis Clos', les personnages peuvent dormir pour s'échapper.",opts:["Vrai","Faux"],ans:1,exp:"Faux. La lumière reste allumée en permanence — aucun répit possible."},
    {q:"'Ville Cruelle' dénonce l'exploitation coloniale au Cameroun.",opts:["Vrai","Faux"],ans:0,exp:"Vrai. Banda, le héros, subit la violence économique et morale du système colonial dans la ville."},
    {q:"Sembène Ousmane est à la fois romancier et cinéaste.",opts:["Vrai","Faux"],ans:0,exp:"Vrai. Il est le père du cinéma africain, auteur de films comme 'Xala' et 'Mandabi'."},
   ]},
  {id:"j_tle_lit_trous",titre:"Littérature Terminale — Texte à trous",emoji:"✍️",matiere:"Litterature",niveau:"Terminale",
   desc:"Complétez les phrases sur les œuvres de Terminale",gratuit:true,type:"trous",action:"lancerJLitTTle",
   questions:[
    {q:"L'auteur de 'Huis Clos' est Jean-Paul ___.",ans:"Sartre",exp:"Sartre (1905-1980), philosophe et dramaturge existentialiste."},
    {q:"La célèbre formule de Huis Clos est : 'L'enfer, c'est les ___'.",ans:"Autres",exp:"Cette formule résume l'idée que le regard des autres nous objectifie et nous emprisonne."},
    {q:"Le personnage principal de 'Ville Cruelle' se nomme ___.",ans:"Banda",exp:"Banda est un jeune paysan qui tente de vendre son cacao dans la ville coloniale."},
    {q:"'Les Bouts de Bois de Dieu' est une expression ___ qui signifie 'les hommes'.",ans:"wolof",exp:"Proverbe wolof : tous les êtres humains sont des 'bouts de bois de Dieu', égaux en dignité."},
    {q:"Mongo Beti a d'abord publié sous le pseudonyme Eza ___.",ans:"Boto",exp:"'Ville Cruelle' fut publié en 1954 sous 'Eza Boto', avant l'adoption définitive de 'Mongo Beti'."},
   ]},
  // ══════════════════════════════════════════════════════════════
  // ── NOUVEAUX JEUX v1.0 ── (Mathématiques, Sciences, Langues, Histoire du Cameroun)
  // ══════════════════════════════════════════════════════════════
  {id:"j_verbes_ang",titre:"Verbes Irréguliers Anglais",emoji:"🇬🇧",matiere:"Anglais",niveau:"6eme-Tle",
   desc:"Trouvez le prétérit et le participe passé des verbes irréguliers fréquents",gratuit:true,type:"qcm",action:"lancerJVerbesAng",
   questions:[
    {q:"Prétérit et participe passé de 'to be' ?",opts:["was/were - been","is - is","were - been","am - being"],ans:0,exp:"was/were (prétérit selon sujet) — been (participe passé). Ex: I was, you were, I have been."},
    {q:"Prétérit et participe passé de 'to go' ?",opts:["goed - goed","went - gone","gone - went","goes - going"],ans:1,exp:"went (prétérit irrégulier) — gone (participe passé). Ex: I went yesterday, I have gone home."},
    {q:"Prétérit de 'to buy' ?",opts:["buyed","bought","buied","bougt"],ans:1,exp:"bought. Se prononce /bɔːt/. Même forme au participe passé."},
    {q:"Participe passé de 'to write' ?",opts:["writed","wrote","written","writing"],ans:2,exp:"written. Prétérit = wrote, participe passé = written. Ex: I have written a letter."},
    {q:"Prétérit de 'to eat' ?",opts:["eated","ate","eaten","eat"],ans:1,exp:"ate (prétérit). Le participe passé est eaten. I ate an apple. I have eaten."},
    {q:"Participe passé de 'to take' ?",opts:["took","taked","taken","taking"],ans:2,exp:"taken. Prétérit = took, participe passé = taken. Ex: She has taken the book."},
    {q:"Prétérit de 'to see' ?",opts:["seed","seen","saw","see"],ans:2,exp:"saw (prétérit) — seen (participe passé). I saw a lion. I have seen it."},
    {q:"Prétérit et participe passé de 'to put' ?",opts:["put - put","putted - putted","puted - puted","put - putted"],ans:0,exp:"put — put — put (3 formes identiques). Autres verbes similaires : cut, hit, let, set."},
   ]},
  {id:"j_capitales_afrique",titre:"Capitales d'Afrique",emoji:"🌍",matiere:"Histoire-Geo",niveau:"6eme-Tle",
   desc:"Retrouvez les capitales des pays africains",gratuit:true,type:"qcm",action:"lancerJCapitalesAfr",
   questions:[
    {q:"Capitale du Cameroun ?",opts:["Douala","Yaoundé","Bafoussam","Garoua"],ans:1,exp:"Yaoundé est la capitale politique. Douala est la capitale économique et le principal port."},
    {q:"Capitale du Sénégal ?",opts:["Thiès","Saint-Louis","Dakar","Kaolack"],ans:2,exp:"Dakar, située sur la presqu'île du Cap-Vert, est la capitale et principale ville du Sénégal."},
    {q:"Capitale de la Côte d'Ivoire ?",opts:["Abidjan","Yamoussoukro","Bouaké","San-Pedro"],ans:1,exp:"Yamoussoukro est la capitale politique depuis 1983. Abidjan reste la capitale économique."},
    {q:"Capitale du Nigeria ?",opts:["Lagos","Kano","Abuja","Ibadan"],ans:2,exp:"Abuja est la capitale depuis 1991. Lagos reste la plus grande ville du pays (et d'Afrique)."},
    {q:"Capitale de l'Éthiopie ?",opts:["Addis-Abeba","Asmara","Djibouti","Mogadiscio"],ans:0,exp:"Addis-Abeba, siège de l'Union Africaine, située sur un plateau à 2400m d'altitude."},
    {q:"Capitale du Gabon ?",opts:["Port-Gentil","Libreville","Franceville","Oyem"],ans:1,exp:"Libreville, fondée en 1849 par des esclaves libérés (d'où son nom)."},
    {q:"Capitale du Tchad ?",opts:["Moundou","N'Djamena","Sarh","Abéché"],ans:1,exp:"N'Djamena, située au confluent du Chari et du Logone, à la frontière avec le Cameroun."},
    {q:"Capitale de la République Démocratique du Congo ?",opts:["Brazzaville","Kinshasa","Lubumbashi","Kisangani"],ans:1,exp:"Kinshasa (RDC). Ne pas confondre avec Brazzaville (République du Congo), situées face à face sur le fleuve Congo."},
    {q:"Capitale du Rwanda ?",opts:["Bujumbura","Kigali","Kampala","Nairobi"],ans:1,exp:"Kigali, située au centre du pays, bâtie sur plusieurs collines."},
    {q:"Capitale du Maroc ?",opts:["Casablanca","Marrakech","Fès","Rabat"],ans:3,exp:"Rabat est la capitale politique. Casablanca est la capitale économique et plus grande ville."},
   ]},
  {id:"j_histoire_cmr",titre:"Histoire du Cameroun — Dates-clés",emoji:"🇨🇲",matiere:"Histoire-Geo",niveau:"3eme-Tle",
   desc:"Testez vos connaissances sur l'histoire du Cameroun",gratuit:true,type:"qcm",action:"lancerJHistCmr",
   questions:[
    {q:"En quelle année le Cameroun obtient-il son indépendance ?",opts:["1958","1960","1961","1972"],ans:1,exp:"1er janvier 1960 : indépendance du Cameroun sous tutelle française. Ahmadou Ahidjo devient le premier président."},
    {q:"Qui fut le premier président du Cameroun indépendant ?",opts:["Paul Biya","Ahmadou Ahidjo","Ruben Um Nyobé","John Ngu Foncha"],ans:1,exp:"Ahmadou Ahidjo (1960-1982), premier président de la République du Cameroun."},
    {q:"En quelle année Paul Biya accède-t-il au pouvoir ?",opts:["1975","1982","1984","1990"],ans:1,exp:"6 novembre 1982 : Paul Biya succède à Ahmadou Ahidjo qui démissionne."},
    {q:"Qui était le leader de l'UPC assassiné en 1958 ?",opts:["Félix Moumié","Ruben Um Nyobé","Ernest Ouandié","Osendé Afana"],ans:1,exp:"Ruben Um Nyobé, fondateur et secrétaire général de l'UPC, assassiné le 13 septembre 1958 dans le maquis."},
    {q:"En quelle année a eu lieu la réunification du Cameroun français et anglais ?",opts:["1960","1961","1972","1984"],ans:1,exp:"1er octobre 1961 : réunification avec le Southern Cameroons (partie anglaise) suite au référendum du 11 février 1961."},
    {q:"Quel était le nom du Cameroun sous la République Unie ?",opts:["Kamerun","République Fédérale","République Unie du Cameroun","État du Cameroun"],ans:2,exp:"De 1972 à 1984 : République Unie du Cameroun. En 1984, elle devient la République du Cameroun."},
    {q:"Quel fleuve sépare traditionnellement le Grand Nord du Grand Sud ?",opts:["La Sanaga","Le Mbam","Le Wouri","Le Nyong"],ans:0,exp:"La Sanaga, plus long fleuve du Cameroun (918 km), sépare symboliquement les grandes régions."},
    {q:"En quelle année le multipartisme est-il rétabli au Cameroun ?",opts:["1990","1991","1992","1996"],ans:0,exp:"Loi du 19 décembre 1990 sur la liberté d'association, permettant la création de partis politiques."},
   ]},
  {id:"j_formules_phys",titre:"Formules de Physique",emoji:"⚡",matiere:"Physique-Chimie",niveau:"3eme-Tle",
   desc:"Retrouvez les formules fondamentales de physique",gratuit:true,type:"qcm",action:"lancerJFormulesPhys",
   questions:[
    {q:"Formule de la vitesse (mouvement rectiligne uniforme) ?",opts:["v = m/V","v = d × t","v = d / t","v = F × a"],ans:2,exp:"v = d/t où d = distance (m), t = temps (s), v = vitesse (m/s). Unités SI : mètres par seconde."},
    {q:"Loi d'Ohm ?",opts:["U = R × I","U = R + I","U = R / I","U = I / R"],ans:0,exp:"U = R × I où U = tension (V), R = résistance (Ω), I = intensité (A). Georg Simon Ohm, 1827."},
    {q:"Formule de l'énergie cinétique ?",opts:["Ec = m × v","Ec = m × g × h","Ec = (1/2) × m × v²","Ec = m × a²"],ans:2,exp:"Ec = ½ m v² où m = masse (kg), v = vitesse (m/s). Unité : joule (J)."},
    {q:"Formule de l'énergie potentielle de pesanteur ?",opts:["Ep = m × v²","Ep = m × g × h","Ep = F × d","Ep = (1/2) × k × x²"],ans:1,exp:"Ep = mgh où m = masse (kg), g ≈ 9,81 m/s² (Cameroun), h = hauteur (m)."},
    {q:"Deuxième loi de Newton ?",opts:["F = m + a","F = m / a","F = m × a","F = m × v²"],ans:2,exp:"F = m × a (Principe Fondamental de la Dynamique). F en Newton, m en kg, a en m/s²."},
    {q:"Formule de la puissance électrique ?",opts:["P = U / I","P = U × I","P = U + I","P = U² × I"],ans:1,exp:"P = U × I en Watts. Pour une résistance pure : P = RI² = U²/R."},
    {q:"Formule de la force de gravitation universelle ?",opts:["F = G × m × m'","F = G × (m × m') / r²","F = m × g","F = G / r²"],ans:1,exp:"F = G × m × m' / r² (loi de Newton). G = 6,67×10⁻¹¹ N·m²/kg²."},
    {q:"Quantité de mouvement ?",opts:["p = m × v","p = m × a","p = (1/2) × m × v²","p = F × t"],ans:0,exp:"p = mv (vecteur). En mécanique relativiste : p = γmv."},
   ]},
  {id:"j_equations",titre:"Équations du 2nd degré",emoji:"📐",matiere:"Maths",niveau:"2nde-1ere",
   desc:"Résolvez des équations du second degré ax² + bx + c = 0",gratuit:true,type:"qcm",action:"lancerJEquations",
   questions:[
    {q:"Solutions de x² - 5x + 6 = 0 ?",opts:["x = 1 ou x = 6","x = 2 ou x = 3","x = -2 ou x = -3","x = 0 ou x = 5"],ans:1,exp:"Δ = 25 - 24 = 1. x = (5±1)/2 donc x=3 ou x=2. Vérification : 2×3=6 et 2+3=5 ✓"},
    {q:"Discriminant de 2x² + 3x - 5 = 0 ?",opts:["Δ = 9 - 40 = -31","Δ = 9 + 40 = 49","Δ = 9 - 20 = -11","Δ = 9 + 10 = 19"],ans:1,exp:"Δ = b² - 4ac = 9 - 4(2)(-5) = 9 + 40 = 49. Δ > 0 donc 2 solutions réelles."},
    {q:"Combien de solutions a x² + 4x + 4 = 0 ?",opts:["0","1 (double)","2","Infini"],ans:1,exp:"Δ = 16 - 16 = 0. Solution double x = -2. C'est (x+2)² = 0, racine double."},
    {q:"Si Δ < 0, combien de solutions réelles ?",opts:["0","1","2","Ça dépend"],ans:0,exp:"Δ < 0 : aucune solution réelle. Mais 2 solutions complexes conjuguées (hors programme Tle D)."},
    {q:"Somme des racines de x² - 7x + 12 = 0 ?",opts:["5","7","12","-7"],ans:1,exp:"Somme = -b/a = 7. Produit = c/a = 12. Les racines sont 3 et 4 (3+4=7 ✓)."},
    {q:"Produit des racines de 2x² - 10x + 8 = 0 ?",opts:["5","4","8","-4"],ans:1,exp:"Produit = c/a = 8/2 = 4. Somme = -b/a = 10/2 = 5. Racines : 1 et 4."},
    {q:"Racine de x² = 49 ?",opts:["7 seulement","-7 seulement","7 ou -7","14"],ans:2,exp:"x² = 49 équivaut à |x| = 7, donc x = 7 ou x = -7. Toujours les deux signes !"},
   ]},
  {id:"j_svt_anatomie",titre:"Anatomie Humaine",emoji:"🫀",matiere:"SVT",niveau:"4eme-Tle",
   desc:"Testez vos connaissances sur le corps humain",gratuit:true,type:"qcm",action:"lancerJAnatomie",
   questions:[
    {q:"Combien d'os compte le squelette humain adulte ?",opts:["186","206","256","306"],ans:1,exp:"206 os chez l'adulte. Le nouveau-né en a ~270, certains fusionnent avec la croissance."},
    {q:"Quel est le plus grand os du corps humain ?",opts:["Le tibia","L'humérus","Le fémur","La colonne vertébrale"],ans:2,exp:"Le fémur (os de la cuisse) : environ 45 cm chez l'adulte. Il représente ~¼ de la taille."},
    {q:"Combien de chambres compte le cœur humain ?",opts:["2","3","4","5"],ans:2,exp:"4 chambres : 2 oreillettes (en haut) et 2 ventricules (en bas). Séparation gauche/droite."},
    {q:"Quel organe produit l'insuline ?",opts:["Le foie","Le pancréas","La rate","Les reins"],ans:1,exp:"Le pancréas (cellules β des îlots de Langerhans). L'insuline régule la glycémie."},
    {q:"Combien de paires de chromosomes chez l'humain ?",opts:["21","22","23","46"],ans:2,exp:"23 paires = 46 chromosomes au total. 22 paires autosomes + 1 paire sexuelle (XX ou XY)."},
    {q:"Quel est le plus grand organe du corps humain ?",opts:["Le foie","Les poumons","La peau","Le cerveau"],ans:2,exp:"La peau ! Surface d'environ 2 m² chez l'adulte, poids ~4-5 kg. Organe sensoriel et protecteur."},
    {q:"Quelle partie du cerveau contrôle l'équilibre ?",opts:["Le cortex","Le cervelet","Le bulbe rachidien","L'hypothalamus"],ans:1,exp:"Le cervelet coordonne les mouvements et l'équilibre. Situé à l'arrière du crâne, sous le cortex."},
    {q:"Combien de globules rouges produit-on par seconde ?",opts:["~2 000","~200 000","~2 000 000","~20 000 000"],ans:2,exp:"~2 millions par seconde (moelle osseuse). Ils vivent ~120 jours avant destruction dans la rate."},
   ]},
  {id:"j_participe_passe",titre:"Accord du Participe Passé",emoji:"✏️",matiere:"Francais",niveau:"5eme-3eme",
   desc:"Règles d'accord du participe passé avec avoir et être",gratuit:true,type:"qcm",action:"lancerJParticipePasse",
   questions:[
    {q:"'Les pommes que j'ai ___ sont mûres.' (manger)",opts:["mangé","mangés","mangées","manger"],ans:2,exp:"mangées. Avec 'avoir' : accord avec le COD s'il est placé avant. 'que' = COD féminin pluriel (les pommes)."},
    {q:"'Elle est ___ hier.' (venir)",opts:["venu","venue","venues","venir"],ans:1,exp:"venue. Avec 'être' : accord avec le sujet. 'Elle' = féminin singulier."},
    {q:"'Ils se sont ___ la main.' (serrer)",opts:["serré","serrés","serrées","serrer"],ans:0,exp:"serré. Verbe pronominal : 'la main' est COD placé après → pas d'accord. 'se' est ici COI (à eux-mêmes)."},
    {q:"'Les enfants ont ___ dehors.' (courir)",opts:["courus","couru","courues","couri"],ans:1,exp:"couru. Avec 'avoir' sans COD placé avant → pas d'accord. Le verbe 'courir' (sans objet) ne s'accorde pas."},
    {q:"'Quelle belle robe tu as ___ !' (choisir)",opts:["choisi","choisie","choisis","choisir"],ans:1,exp:"choisie. COD ('quelle robe', féminin singulier) placé avant l'auxiliaire 'avoir' → accord obligatoire."},
    {q:"'Elles se sont ___ de bonne heure.' (lever)",opts:["levé","levées","levés","lever"],ans:1,exp:"levées. Verbe pronominal réfléchi : 'se' est COD (elles ont levé elles-mêmes) → accord avec le sujet féminin pluriel."},
    {q:"'Les lettres ont été ___ ce matin.' (envoyer)",opts:["envoyé","envoyés","envoyées","envoyer"],ans:2,exp:"envoyées. Voix passive (être) → accord avec le sujet 'les lettres' (féminin pluriel)."},
   ]},
  {id:"j_tables_multi",titre:"Tables de Multiplication Express",emoji:"✖️",matiere:"Maths",niveau:"6eme-3eme",
   desc:"Révisez vos tables de multiplication en vitesse",gratuit:true,type:"qcm",action:"lancerJTablesMulti",
   questions:[
    {q:"7 × 8 = ?",opts:["54","56","58","63"],ans:1,exp:"56. Astuce : 7×8 = 7×(10-2) = 70-14 = 56."},
    {q:"9 × 6 = ?",opts:["54","56","58","64"],ans:0,exp:"54. Astuce 9 : 9×6 = 10×6 - 6 = 60-6 = 54."},
    {q:"12 × 7 = ?",opts:["74","84","94","104"],ans:1,exp:"84. 12×7 = 10×7 + 2×7 = 70+14 = 84."},
    {q:"8 × 9 = ?",opts:["71","72","81","89"],ans:1,exp:"72. 8×9 = 72. Vérifier : 72/8 = 9 ✓"},
    {q:"11 × 11 = ?",opts:["111","121","122","131"],ans:1,exp:"121 = 11². À retenir : 11×11=121, 12×12=144, 13×13=169."},
    {q:"25 × 4 = ?",opts:["75","90","100","125"],ans:2,exp:"100. Astuce : 25 × 4 = 100 (un quart de cent × 4 = cent entier)."},
    {q:"15 × 6 = ?",opts:["80","85","90","95"],ans:2,exp:"90. 15×6 = 10×6 + 5×6 = 60 + 30 = 90."},
    {q:"13 × 7 = ?",opts:["81","91","93","97"],ans:1,exp:"91. 13×7 = 13×7. Astuce : (10+3)×7 = 70+21 = 91."},
   ]},
  {id:"j_auteurs_cmr",titre:"Auteurs Camerounais & Africains",emoji:"✒️",matiere:"Litterature",niveau:"3eme-Tle",
   desc:"Qui a écrit quoi ? Les grands auteurs d'Afrique francophone",gratuit:true,type:"qcm",action:"lancerJAuteursCmr",
   questions:[
    {q:"Qui a écrit 'Une vie de boy' ?",opts:["Mongo Beti","Ferdinand Oyono","Camara Laye","Sembène Ousmane"],ans:1,exp:"Ferdinand Oyono (1956). Satire mordante du colonialisme à travers Toundi, jeune 'boy' camerounais."},
    {q:"Auteur de 'Le Vieux Nègre et la Médaille' ?",opts:["Mongo Beti","Ferdinand Oyono","René Philombe","Francis Bebey"],ans:1,exp:"Ferdinand Oyono (1956). Publié la même année qu'Une vie de boy."},
    {q:"Qui a écrit 'L'Enfant Noir' ?",opts:["Camara Laye","Cheikh Hamidou Kane","Ahmadou Kourouma","Mongo Beti"],ans:0,exp:"Camara Laye (1953). Roman autobiographique, écrivain guinéen."},
    {q:"Auteur de 'L'Aventure ambiguë' ?",opts:["Léopold Senghor","Cheikh Hamidou Kane","Birago Diop","Aminata Sow Fall"],ans:1,exp:"Cheikh Hamidou Kane (1961), sénégalais. Prix littéraire d'Afrique noire."},
    {q:"'Les Soleils des indépendances' est de...",opts:["Sembène Ousmane","Ahmadou Kourouma","Léopold Senghor","Ken Bugul"],ans:1,exp:"Ahmadou Kourouma (1968), ivoirien. Dénonce les régimes postcoloniaux africains."},
    {q:"Qui a écrit 'Ville Cruelle' sous le pseudo Eza Boto ?",opts:["Mongo Beti","Ferdinand Oyono","René Philombe","Francis Bebey"],ans:0,exp:"Mongo Beti (1954). Son vrai nom : Alexandre Biyidi-Awala, camerounais."},
    {q:"Auteur de 'Les Bouts de Bois de Dieu' ?",opts:["Sembène Ousmane","Aminata Sow Fall","Ousmane Soce","Birago Diop"],ans:0,exp:"Sembène Ousmane (1960), sénégalais. Récit de la grève des cheminots Dakar-Niger (1947-48)."},
    {q:"Qui a écrit 'Rencontres essentielles', premier roman d'une femme camerounaise ?",opts:["Calixthe Beyala","Werewere Liking","Thérèse Kuoh-Moukoury","Léonora Miano"],ans:2,exp:"Thérèse Kuoh-Moukoury (1969), pionnière de la littérature féminine camerounaise."},
   ]},
  {id:"j_voc_svt",titre:"Vocabulaire Scientifique SVT",emoji:"🔬",matiere:"SVT",niveau:"4eme-Tle",
   desc:"Définitions et termes techniques en biologie",gratuit:true,type:"qcm",action:"lancerJVocSVT",
   questions:[
    {q:"Qu'est-ce que la photosynthèse ?",opts:["Respiration des plantes","Fabrication de matière organique à partir de lumière","Absorption d'eau par les racines","Chute des feuilles"],ans:1,exp:"Transformation de CO₂ + H₂O en glucose + O₂ grâce à la lumière (chlorophylle). 6CO₂+6H₂O → C₆H₁₂O₆+6O₂."},
    {q:"Les mitochondries sont responsables de...",opts:["La photosynthèse","La digestion","La production d'ATP (énergie)","La duplication de l'ADN"],ans:2,exp:"Mitochondries = 'centrales énergétiques' de la cellule. Elles produisent l'ATP par respiration cellulaire."},
    {q:"Que signifie ADN ?",opts:["Acide Désoxyribonucléique","Acide DiNucléique","Adénosine Di-Nitrate","Alcool Désodorisant Naturel"],ans:0,exp:"Acide Désoxyribonucléique. Double hélice découverte par Watson & Crick en 1953. Porte l'information génétique."},
    {q:"Un écosystème, c'est...",opts:["Un ensemble d'espèces","Un milieu et les êtres vivants qui l'habitent","Une forêt uniquement","Une population animale"],ans:1,exp:"Biotope (milieu physique) + biocénose (êtres vivants) = écosystème. Ex : mangrove du Wouri, forêt du Dja."},
    {q:"La méiose produit...",opts:["Des cellules identiques","Des gamètes (cellules sexuelles)","Des globules rouges","Des neurones"],ans:1,exp:"Méiose : division réductionnelle produisant 4 gamètes haploïdes (n=23) à partir d'une cellule diploïde (2n=46)."},
    {q:"L'homéostasie, c'est...",opts:["La reproduction","Le maintien de l'équilibre interne","La mort cellulaire","La croissance"],ans:1,exp:"Homéostasie = capacité d'un organisme à maintenir ses constantes internes (température, pH, glycémie...)."},
    {q:"Que sont les enzymes ?",opts:["Des hormones","Des protéines catalyseurs","Des vitamines","Des sucres"],ans:1,exp:"Protéines qui accélèrent les réactions chimiques sans être consommées. Ex : amylase (digestion amidon)."},
    {q:"Les neurones communiquent par...",opts:["Les synapses","Les muscles","Les os","Le sang"],ans:0,exp:"Synapses : zones de contact entre neurones où sont libérés les neurotransmetteurs (dopamine, sérotonine...)."},
   ]},
  {id:'j_lois_physique',titre:'Lois de Physique-Chimie',emoji:'⚡',matiere:'Physique-Chimie',niveau:'2nde-Tle',type:'qcm',acces:1,gratuit:true,
    questions:[
      {q:'Quelle est la loi d\'Ohm ?',opts:['U = R × I','U = I / R','I = U × R','R = U × I²'],ans:0,exp:'La loi d\'Ohm : U = R × I, où U est la tension (V), R la résistance (Ω) et I l\'intensité (A).'},
      {q:'Quelle est la 2ème loi de Newton ?',opts:['F = m × a','F = m / a','a = F / m²','F = m + a'],ans:0,exp:'La 2ème loi de Newton : F = m × a. La force (N) = masse (kg) × accélération (m/s²).'},
      {q:'Formule de la vitesse',opts:['v = d / t','v = d × t','v = t / d','v = d + t'],ans:0,exp:'Vitesse = distance / temps. En m/s ou km/h.'},
      {q:'Formule de l\'énergie cinétique',opts:['Ec = ½mv²','Ec = mv²','Ec = ½mv','Ec = mv/2²'],ans:0,exp:'Énergie cinétique : Ec = ½mv². m en kg, v en m/s, Ec en joules.'},
      {q:'Formule de la puissance électrique',opts:['P = U × I','P = U / I','P = I / U','P = U + I'],ans:0,exp:'Puissance électrique P = U × I, exprimée en watts (W).'},
      {q:'La réaction acido-basique met en jeu',opts:['Un transfert de proton H⁺','Un transfert d\'électron','Une fusion nucléaire','Un changement d\'état'],ans:0,exp:'La réaction acido-basique est un transfert de proton (H⁺) d\'un acide vers une base.'},
      {q:'Formule de la chaleur reçue (calorimétrie)',opts:['Q = m × c × ΔT','Q = m / c × ΔT','Q = m × c / ΔT','Q = c × ΔT²'],ans:0,exp:'Q = m × c × ΔT. m : masse (kg), c : capacité thermique massique, ΔT : variation de température.'},
      {q:'Qu\'est-ce que la période T d\'un phénomène périodique ?',opts:['La durée d\'un cycle','La fréquence en Hz','L\'amplitude','La longueur d\'onde'],ans:0,exp:'La période T est la durée d\'un cycle complet, exprimée en secondes.'}
    ]},
  {id:'j_regions_cmr',titre:'Régions du Cameroun',emoji:'🗺️',matiere:'Géographie',niveau:'3ème-Tle',type:'qcm',acces:1,gratuit:true,
    questions:[
      {q:'Combien de régions compte le Cameroun ?',opts:['10','8','12','9'],ans:0,exp:'Le Cameroun est divisé en 10 régions depuis la réforme administrative.'},
      {q:'Quelle est la capitale de la région du Centre ?',opts:['Yaoundé','Bertoua','Bafoussam','Ngaoundéré'],ans:0,exp:'Yaoundé est la capitale politique du Cameroun et le chef-lieu de la région du Centre.'},
      {q:'Quelle région est traversée par le fleuve Sanaga ?',opts:['Centre et Littoral','Nord et Extrême-Nord','Est et Sud','Adamaoua et Nord-Ouest'],ans:0,exp:'Le Sanaga, plus long fleuve du Cameroun, traverse les régions du Centre et du Littoral.'},
      {q:'La région du Littoral a pour chef-lieu',opts:['Douala','Kribi','Edéa','Nkongsamba'],ans:0,exp:'Douala, capitale économique du Cameroun, est le chef-lieu de la région du Littoral.'},
      {q:'Quelle région partage une frontière avec le Nigeria au nord-ouest ?',opts:['Nord-Ouest','Adamaoua','Nord','Centre'],ans:0,exp:'La région du Nord-Ouest est frontalière avec le Nigeria.'},
      {q:'La région de l\'Est a pour chef-lieu',opts:['Bertoua','Abong-Mbang','Batouri','Yokadouma'],ans:0,exp:'Bertoua est le chef-lieu de la région de l\'Est.'},
      {q:'Le mont Cameroun se trouve dans quelle région ?',opts:['Sud-Ouest','Littoral','Nord-Ouest','Centre'],ans:0,exp:'Le mont Cameroun (4 095 m), plus haut sommet d\'Afrique centrale, est situé dans la région du Sud-Ouest.'},
      {q:'Quelle région est la plus grande du Cameroun ?',opts:['Est','Nord','Adamaoua','Centre'],ans:0,exp:'La région de l\'Est est la plus grande région du Cameroun avec environ 109 000 km².'}
    ]},
  {id:'j_maths_fonctions',titre:'Fonctions & Dérivées — Maths Tle',emoji:'📐',matiere:'Mathématiques',niveau:'Tle',type:'qcm',acces:1,gratuit:true,
    questions:[
      {q:'La dérivée de f(x) = x² est',opts:['f\'(x) = 2x','f\'(x) = x','f\'(x) = 2','f\'(x) = x²'],ans:0,exp:'Règle de dérivation : si f(x) = xⁿ alors f\'(x) = n·xⁿ⁻¹. Donc (x²)\' = 2x.'},
      {q:'La dérivée de f(x) = sin(x) est',opts:['f\'(x) = cos(x)','f\'(x) = -cos(x)','f\'(x) = -sin(x)','f\'(x) = tan(x)'],ans:0,exp:'(sin x)\' = cos x. Règle fondamentale à mémoriser.'},
      {q:'La dérivée de f(x) = eˣ est',opts:['f\'(x) = eˣ','f\'(x) = x·eˣ','f\'(x) = e','f\'(x) = eˣ⁻¹'],ans:0,exp:'La fonction exponentielle est sa propre dérivée : (eˣ)\' = eˣ.'},
      {q:'La dérivée de f(x) = ln(x) est',opts:['f\'(x) = 1/x','f\'(x) = 1/x²','f\'(x) = ln(x)/x','f\'(x) = x·ln(x)'],ans:0,exp:'(ln x)\' = 1/x pour x > 0.'},
      {q:'Si f\'(x) > 0 sur un intervalle, f est',opts:['Croissante','Décroissante','Constante','Nulle'],ans:0,exp:'Si la dérivée est positive, la fonction est croissante sur cet intervalle.'},
      {q:'∫x dx = ?',opts:['x²/2 + C','x² + C','2x + C','x/2 + C'],ans:0,exp:'Primitive de x : ∫x dx = x²/2 + C, où C est la constante d\'intégration.'},
      {q:'La dérivée de f(x) = cos(x) est',opts:['f\'(x) = -sin(x)','f\'(x) = sin(x)','f\'(x) = -cos(x)','f\'(x) = tan(x)'],ans:0,exp:'(cos x)\' = -sin x. Attention au signe !'},
      {q:'Le nombre dérivé f\'(a) représente',opts:['La pente de la tangente en a','La valeur de f en a','L\'ordonnée à l\'origine','La limite de f en +∞'],ans:0,exp:'f\'(a) est la pente (coefficient directeur) de la tangente à la courbe de f au point d\'abscisse a.'}
    ]},
  {id:'j_svt_genetique',titre:'Génétique & Hérédité — SVT',emoji:'🧬',matiere:'SVT',niveau:'1ère-Tle',type:'qcm',acces:1,gratuit:true,
    questions:[
      {q:'Quel scientifique est le fondateur de la génétique ?',opts:['Gregor Mendel','Charles Darwin','Louis Pasteur','Robert Koch'],ans:0,exp:'Gregor Mendel (1822-1884), moine botaniste autrichien, a établi les lois de l\'hérédité après ses expériences sur les petits pois.'},
      {q:'Combien de chromosomes contient une cellule somatique humaine ?',opts:['46','23','48','44'],ans:0,exp:'Les cellules somatiques humaines contiennent 46 chromosomes (23 paires), dont 22 paires d\'autosomes et 1 paire de chromosomes sexuels.'},
      {q:'Un individu de génotype Aa est dit',opts:['Hétérozygote','Homozygote dominant','Homozygote récessif','Haploïde'],ans:0,exp:'Un individu avec deux allèles différents (Aa) est hétérozygote. AA est homozygote dominant, aa est homozygote récessif.'},
      {q:'La méiose produit des cellules',opts:['Haploïdes (n chromosomes)','Diploïdes (2n chromosomes)','Triploïdes','Sans chromosomes'],ans:0,exp:'La méiose est une division qui réduit de moitié le nombre de chromosomes pour produire des gamètes haploïdes (n).'},
      {q:'L\'ADN est composé de',opts:['Nucléotides','Acides aminés','Glucides','Lipides'],ans:0,exp:'L\'ADN est un polynucléotide formé de nucléotides, chacun composé d\'un sucre (désoxyribose), d\'un groupement phosphate et d\'une base azotée (A, T, G, C).'},
      {q:'Les chromosomes sexuels chez la femme sont',opts:['XX','XY','YY','X seulement'],ans:0,exp:'La femme possède deux chromosomes X (XX) ; l\'homme possède un X et un Y (XY).'},
      {q:'L\'ARN messager est synthétisé lors de',opts:['La transcription','La traduction','La réplication','La mitose'],ans:0,exp:'La transcription est la synthèse d\'ARNm à partir de l\'ADN, dans le noyau cellulaire.'},
      {q:'Une mutation est',opts:['Une modification permanente de l\'ADN','Une division cellulaire','Une protéine défectueuse','Un type de mitose'],ans:0,exp:'Une mutation est une modification permanente de la séquence d\'ADN qui peut être héréditaire si elle touche les cellules germinales.'}
    ]}
]);
window._VRT_JEUX_OK = true;

/* ════════════════════════════════════════════════════════════════════════
   JEUX DE RÉFLEXION, DE STRATÉGIE ET D'ÉVEIL (12/11/2026) — tous gratuits.
   « Varie les petits jeux captivants gratuits pour tous les niveaux
   (intelligence, stratégie, réflexion, éveil, stimulation) pour rendre plus
   captivant et pousser à l'abonnement » (Jacques).

   Neuf jeux, chacun en trois niveaux (Facile 6ᵉ-5ᵉ, Moyen 4ᵉ-2nde,
   Difficile 1ʳᵉ-Tˡᵉ), générés à chaque partie : on ne les épuise pas.
   Record par jeu et par niveau (localStorage, facultatif). En fin de partie,
   un visiteur non abonné voit une invitation discrète vers les formules.
   Ajouté à la fin de chunks/jeux.js (même chargement à la demande).
   ════════════════════════════════════════════════════════════════════════ */
(function (W) {
  "use strict";
  var NIV = [["facile", "Facile", "6ᵉ – 5ᵉ"], ["moyen", "Moyen", "4ᵉ – 2nde"], ["difficile", "Difficile", "1ʳᵉ – Tˡᵉ"]];
  function esc(s) { return (typeof _esc === "function") ? _esc(s) : String(s).replace(/[&<>"']/g, function (c) { return "&#" + c.charCodeAt(0) + ";"; }); }
  function alea(n) { return Math.floor(Math.random() * n); }
  function melange(t) { t = t.slice(); for (var i = t.length - 1; i > 0; i--) { var j = alea(i + 1), x = t[i]; t[i] = t[j]; t[j] = x; } return t; }
  function lire(k) { try { return JSON.parse(localStorage.getItem("vrt_jr_" + k) || "null"); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem("vrt_jr_" + k, JSON.stringify(v)); } catch (e) { } }
  /* Record : `mieux` dit si une valeur plus grande (score) ou plus petite (coups, secondes) est meilleure. */
  function record(cle, val, mieux) {
    var r = lire(cle), neuf = r === null || (mieux === "haut" ? val > r : val < r);
    if (neuf) ecrire(cle, val);
    return { neuf: neuf, ancien: r };
  }
  function abonne() {
    try { var t = typeof _aiTier === "function" ? _aiTier() : "anon"; return t !== "anon" && t !== "free"; } catch (e) { return false; }
  }
  function invitation() {
    if (abonne()) return "";
    return "<div style='margin-top:18px;padding:14px 16px;border-radius:14px;background:#FFF6DC;border:1px solid #F3DFA6;text-align:left;font-size:14px;color:#4D3B00'>"
      + "<b>Tu aimes réfléchir ?</b> Avec une formule VÉRITAS, tu as aussi les leçons complètes de ta classe, le tuteur IA, les labos et les examens blancs notés — dès 1 200 F par mois."
      + "<div style='margin-top:10px'><button class='btn bi' onclick=\"(typeof vShowSec==='function')&&vShowSec('elearning',null)\">Voir les formules</button></div></div>";
  }
  /* L'écran commun : titre, consigne, choix du niveau, zone de jeu. */
  function ecran(id, titre, ico, consigne, niv, corps) {
    W._jrPartie = (W._jrPartie || 0) + 1;   // toute nouvelle partie invalide les chronomètres de la précédente
    _vc("<div class='vsec'>"
      + "<button class='back-btn' onclick='showJeuxEdu()'>← Jeux</button>"
      + "<div class='vsec-title'><span class='vsec-ico' aria-hidden='true' style='font-size:20px'>" + ico + "</span>" + esc(titre) + "</div>"
      + "<div class='vcard' style='max-width:620px;margin:0 auto;text-align:center'>"
      + "<div style='font-size:14px;color:#4D5163;margin-bottom:12px'>" + consigne + "</div>"
      + "<div style='display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:14px'>"
      + NIV.map(function (n) {
          return "<button type='button' class='tab" + (n[0] === niv ? " on" : "") + "' onclick=\"" + id + "('" + n[0] + "')\" title='" + n[2] + "'>" + n[1] + "</button>";
        }).join("")
      + "</div><div id='jrZone'>" + corps + "</div></div></div>");
  }
  function zone(h) { var z = document.getElementById("jrZone"); if (z) z.innerHTML = h; }
  function fin(titre, detail, rec, rejouer) {
    return "<div style='padding:10px 0'><div style='font:800 22px Montserrat,sans-serif;color:#142554'>" + titre + "</div>"
      + "<div style='color:#4D5163;margin-top:6px'>" + detail + "</div>"
      + (rec ? "<div style='margin-top:6px;font-weight:700;color:" + (rec.neuf ? "#047857'>Nouveau record !" : "#5B6170'>Record : " + rec.ancien) + "</div>" : "")
      + "<div style='margin-top:14px'><button class='btn bi' onclick=\"" + rejouer + "\">Rejouer</button></div>"
      + invitation() + "</div>";
  }
  var CASE = "display:inline-flex;align-items:center;justify-content:center;border-radius:10px;font-weight:800;cursor:pointer;user-select:none;";

  /* ── 1. SUITES LOGIQUES (intelligence) ─────────────────────────────────── */
  function suite(niv) {
    var a = 1 + alea(9), r = 2 + alea(4), t = [], k, choix = niv === "facile" ? alea(2) : niv === "moyen" ? alea(4) : alea(6), regle;
    if (choix === 0) { regle = "on ajoute " + r; for (k = 0; k < 6; k++) t.push(a + k * r); }
    else if (choix === 1) { regle = "on retire " + r; a += 40; for (k = 0; k < 6; k++) t.push(a - k * r); }
    else if (choix === 2) { regle = "on multiplie par " + (r > 3 ? 2 : r); var m = r > 3 ? 2 : r; for (k = 0; k < 6; k++) t.push(a * Math.pow(m, k)); }
    else if (choix === 3) { regle = "les carrés"; var d = 1 + alea(4); for (k = 0; k < 6; k++) t.push((d + k) * (d + k)); }
    else if (choix === 4) { regle = "chaque terme est la somme des deux précédents"; t = [a, a + r]; for (k = 2; k < 6; k++) t.push(t[k - 1] + t[k - 2]); }
    else { regle = "on ajoute 1, puis 2, puis 3…"; t = [a]; for (k = 1; k < 6; k++) t.push(t[k - 1] + k); }
    return { montre: t.slice(0, 5), rep: t[5], regle: regle };
  }
  W.lancerJrSuites = function (niv) {
    niv = niv || "facile";
    var n = 0, bons = 0, q = suite(niv), t0 = Date.now();
    function pose() {
      zone("<div style='font-size:13px;color:#8B93A6'>Question " + (n + 1) + " sur 8 · " + bons + " juste" + (bons > 1 ? "s" : "") + "</div>"
        + "<div style='font:800 28px Georgia,serif;color:#142554;margin:18px 0;letter-spacing:1px'>" + q.montre.join(" ; ") + " ; <span style='color:#C24E00'>?</span></div>"
        + "<input id='jrRep' type='number' inputmode='numeric' class='fi' style='max-width:180px;margin:0 auto 12px;text-align:center;font-size:20px'>"
        + "<div><button class='btn bi' id='jrOk'>Valider</button></div><div id='jrFb' style='min-height:22px;margin-top:10px'></div>");
      var i = document.getElementById("jrRep"); if (i) { i.focus(); i.onkeydown = function (e) { if (e.key === "Enter") valider(); }; }
      document.getElementById("jrOk").onclick = valider;
    }
    function valider() {
      var v = parseInt((document.getElementById("jrRep") || {}).value, 10), fb = document.getElementById("jrFb");
      if (isNaN(v)) return;
      var ok = v === q.rep; if (ok) bons++;
      fb.innerHTML = ok ? "<b style='color:#047857'>Juste !</b> " + esc(q.regle) : "<b style='color:#B42318'>C'était " + q.rep + "</b> : " + esc(q.regle);
      document.getElementById("jrOk").disabled = true;
      setTimeout(function () {
        n++;
        if (n >= 8) { var s = Math.round((Date.now() - t0) / 1000); zone(fin(bons + " / 8", "en " + s + " secondes", record("suites_" + niv, bons, "haut"), "lancerJrSuites('" + niv + "')")); return; }
        q = suite(niv); pose();
      }, 1400);
    }
    ecran("lancerJrSuites", "Suites logiques", "🧠", "Trouve le nombre suivant. Chaque suite cache une règle.", niv, "");
    pose();
  };

  /* ── 2. MÉMOIRE DES PAIRES (éveil, mémoire) ────────────────────────────── */
  var SYMB = ["📐", "🧪", "🌍", "📚", "🔭", "🧬", "⚡", "🎨", "🎵", "🧮", "🌱", "🦁", "🚀", "⚽", "🥭", "🌋", "🐘", "✏️"];
  W.lancerJrMemoire = function (niv) {
    niv = niv || "facile";
    var paires = niv === "facile" ? 6 : niv === "moyen" ? 8 : 12, cols = niv === "difficile" ? 6 : 4;
    var cartes = melange(melange(SYMB).slice(0, paires).reduce(function (t, s) { return t.concat([s, s]); }, []));
    var vues = [], trouvees = {}, coups = 0, bloque = false;
    function dessine() {
      zone("<div style='font-size:13px;color:#8B93A6;margin-bottom:10px'>" + coups + " coup" + (coups > 1 ? "s" : "") + " · " + Object.keys(trouvees).length / 2 + " / " + paires + " paires</div>"
        + "<div style='display:grid;grid-template-columns:repeat(" + cols + ",1fr);gap:8px;max-width:" + (cols * 78) + "px;margin:0 auto'>"
        + cartes.map(function (s, i) {
            var ouverte = trouvees[i] || vues.indexOf(i) >= 0;
            return "<button type='button' data-i='" + i + "' aria-label='Carte " + (i + 1) + "' style='" + CASE + "height:66px;font-size:28px;border:0;background:" + (trouvees[i] ? "#DCFCE7" : ouverte ? "#fff" : "#1E499B") + ";box-shadow:0 1px 3px rgba(0,17,54,.15)'>" + (ouverte ? s : "") + "</button>";
          }).join("") + "</div>");
      [].forEach.call(document.querySelectorAll("#jrZone [data-i]"), function (b) { b.onclick = function () { tourne(+b.getAttribute("data-i")); }; });
    }
    function tourne(i) {
      if (bloque || trouvees[i] || vues.indexOf(i) >= 0) return;
      vues.push(i); dessine();
      if (vues.length < 2) return;
      coups++;
      if (cartes[vues[0]] === cartes[vues[1]]) { trouvees[vues[0]] = trouvees[vues[1]] = 1; vues = []; dessine(); }
      else { bloque = true; setTimeout(function () { vues = []; bloque = false; dessine(); }, 800); }
      if (Object.keys(trouvees).length === cartes.length)
        setTimeout(function () { zone(fin("Bravo !", paires + " paires en " + coups + " coups", record("memoire_" + niv, coups, "bas"), "lancerJrMemoire('" + niv + "')")); }, 400);
    }
    ecran("lancerJrMemoire", "Mémoire des paires", "🃏", "Retourne deux cartes à la fois et retrouve toutes les paires, en un minimum de coups.", niv, "");
    dessine();
  };

  /* ── 3. TAQUIN (réflexion) ─────────────────────────────────────────────── */
  W.lancerJrTaquin = function (niv) {
    niv = niv || "facile";
    var n = niv === "difficile" ? 4 : 3, t = [], k, coups = 0, vide;
    for (k = 1; k < n * n; k++) t.push(k); t.push(0);
    function voisins(p) { var v = [], r = Math.floor(p / n), c = p % n; if (r > 0) v.push(p - n); if (r < n - 1) v.push(p + n); if (c > 0) v.push(p - 1); if (c < n - 1) v.push(p + 1); return v; }
    // Mélange par coups légaux : la grille est toujours soluble.
    vide = t.indexOf(0);
    for (k = 0; k < (niv === "facile" ? 40 : 160); k++) { var v = voisins(vide), p = v[alea(v.length)]; t[vide] = t[p]; t[p] = 0; vide = p; }
    function gagne() { for (var i = 0; i < n * n - 1; i++) if (t[i] !== i + 1) return false; return true; }
    function dessine() {
      zone("<div style='font-size:13px;color:#8B93A6;margin-bottom:10px'>" + coups + " coup" + (coups > 1 ? "s" : "") + "</div>"
        + "<div style='display:grid;grid-template-columns:repeat(" + n + ",1fr);gap:6px;max-width:" + (n * 76) + "px;margin:0 auto'>"
        + t.map(function (x, i) {
            return x === 0 ? "<span style='height:68px'></span>"
              : "<button type='button' data-i='" + i + "' style='" + CASE + "height:68px;font-size:24px;border:0;background:#1E499B;color:#fff'>" + x + "</button>";
          }).join("") + "</div>");
      [].forEach.call(document.querySelectorAll("#jrZone [data-i]"), function (b) { b.onclick = function () { bouge(+b.getAttribute("data-i")); }; });
    }
    function bouge(p) {
      vide = t.indexOf(0);
      if (voisins(vide).indexOf(p) < 0) return;
      t[vide] = t[p]; t[p] = 0; coups++; dessine();
      if (gagne()) zone(fin("Grille remise en ordre !", "en " + coups + " coups", record("taquin_" + niv, coups, "bas"), "lancerJrTaquin('" + niv + "')"));
    }
    ecran("lancerJrTaquin", "Taquin", "🧩", "Fais glisser les cases vers la case vide pour les remettre dans l'ordre, de 1 à " + (n * n - 1) + ".", niv, "");
    dessine();
  };

  /* ── 4. TOURS DE HANOÏ (stratégie) ─────────────────────────────────────── */
  W.lancerJrHanoi = function (niv) {
    niv = niv || "facile";
    var d = niv === "facile" ? 3 : niv === "moyen" ? 4 : 5, tours = [[], [], []], k, sel = -1, coups = 0, min = Math.pow(2, d) - 1;
    for (k = d; k >= 1; k--) tours[0].push(k);
    var COUL = ["#C24E00", "#1E499B", "#047857", "#7C3AED", "#B42318"];
    function dessine() {
      zone("<div style='font-size:13px;color:#8B93A6;margin-bottom:10px'>" + coups + " coup" + (coups > 1 ? "s" : "") + " · minimum possible : " + min + "</div>"
        + "<div style='display:flex;gap:8px;justify-content:center;align-items:flex-end'>"
        + tours.map(function (t, i) {
            return "<button type='button' data-t='" + i + "' aria-label='Tour " + (i + 1) + "' style='flex:1;max-width:180px;height:" + (d * 26 + 40) + "px;border:2px solid " + (sel === i ? "#C24E00" : "#E4E9F2") + ";border-radius:12px;background:#F8FAFD;display:flex;flex-direction:column-reverse;align-items:center;padding:8px 4px;gap:4px;cursor:pointer'>"
              + t.map(function (x) { return "<span style='display:block;height:20px;border-radius:6px;width:" + (20 + x * 16) + "%;background:" + COUL[x - 1] + "'></span>"; }).join("") + "</button>";
          }).join("") + "</div><div id='jrFb' style='min-height:22px;margin-top:10px;color:#B42318'></div>");
      [].forEach.call(document.querySelectorAll("#jrZone [data-t]"), function (b) { b.onclick = function () { clic(+b.getAttribute("data-t")); }; });
    }
    function clic(i) {
      if (sel < 0) { if (tours[i].length) { sel = i; dessine(); } return; }
      if (i === sel) { sel = -1; dessine(); return; }
      var x = tours[sel][tours[sel].length - 1], dessus = tours[i][tours[i].length - 1];
      if (dessus && dessus < x) { sel = -1; dessine(); document.getElementById("jrFb").textContent = "Un disque ne se pose jamais sur un plus petit."; return; }
      tours[i].push(tours[sel].pop()); sel = -1; coups++; dessine();
      if (tours[2].length === d) zone(fin(coups === min ? "Parfait !" : "Réussi !", coups + " coups (le minimum est " + min + ")", record("hanoi_" + niv, coups, "bas"), "lancerJrHanoi('" + niv + "')"));
    }
    ecran("lancerJrHanoi", "Tours de Hanoï", "🗼", "Déplace toute la pile sur la tour de droite. Un disque à la fois, jamais sur un plus petit. Touche une tour pour prendre, une autre pour poser.", niv, "");
    dessine();
  };

  /* ── 5. CODE SECRET (logique déductive) ────────────────────────────────── */
  W.lancerJrCode = function (niv) {
    niv = niv || "facile";
    var lg = niv === "facile" ? 3 : niv === "moyen" ? 4 : 5, essaisMax = 10, chiffres = melange([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var secret = chiffres.slice(0, lg), essais = [];
    function note(g) {
      var bien = 0, mal = 0;
      g.forEach(function (c, i) { if (c === secret[i]) bien++; else if (secret.indexOf(c) >= 0) mal++; });
      return [bien, mal];
    }
    function dessine(msg) {
      zone("<div style='font-size:13px;color:#8B93A6;margin-bottom:8px'>Code de " + lg + " chiffres tous différents · essai " + (essais.length + 1) + " sur " + essaisMax + "</div>"
        + "<input id='jrRep' inputmode='numeric' maxlength='" + lg + "' class='fi' style='max-width:200px;margin:0 auto 10px;text-align:center;font-size:22px;letter-spacing:6px'>"
        + "<div><button class='btn bi' id='jrOk'>Essayer</button></div><div style='min-height:20px;margin-top:8px;color:#B42318'>" + (msg || "") + "</div>"
        + "<table style='margin:10px auto;border-collapse:collapse;font-size:15px'>" + essais.slice().reverse().map(function (e) {
            return "<tr><td style='padding:4px 12px;font:700 18px monospace;letter-spacing:4px'>" + e.g.join("") + "</td><td style='padding:4px 8px;color:#047857'>● " + e.n[0] + " bien placé" + (e.n[0] > 1 ? "s" : "") + "</td><td style='padding:4px 8px;color:#C24E00'>○ " + e.n[1] + " mal placé" + (e.n[1] > 1 ? "s" : "") + "</td></tr>";
          }).join("") + "</table>");
      var i = document.getElementById("jrRep"); if (i) { i.focus(); i.onkeydown = function (e) { if (e.key === "Enter") essai(); }; }
      document.getElementById("jrOk").onclick = essai;
    }
    function essai() {
      var v = String((document.getElementById("jrRep") || {}).value || "").replace(/\D/g, "");
      var g = v.split("").map(Number);
      if (g.length !== lg) { dessine("Entre exactement " + lg + " chiffres."); return; }
      if (g.some(function (c, i) { return g.indexOf(c) !== i; })) { dessine("Les chiffres du code sont tous différents."); return; }
      var r = note(g); essais.push({ g: g, n: r });
      if (r[0] === lg) { zone(fin("Code trouvé : " + secret.join(""), "en " + essais.length + " essai" + (essais.length > 1 ? "s" : ""), record("code_" + niv, essais.length, "bas"), "lancerJrCode('" + niv + "')")); return; }
      if (essais.length >= essaisMax) { zone(fin("Perdu !", "Le code était " + secret.join(""), null, "lancerJrCode('" + niv + "')")); return; }
      dessine();
    }
    ecran("lancerJrCode", "Code secret", "🔐", "Devine le code. Après chaque essai : ● chiffres bien placés, ○ chiffres présents mais mal placés.", niv, "");
    dessine();
  };

  /* ── 6. ALLUMETTES (stratégie contre l'ordinateur) ─────────────────────── */
  W.lancerJrAllumettes = function (niv) {
    niv = niv || "facile";
    var reste = niv === "facile" ? 15 : niv === "moyen" ? 21 : 25, maxPrise = niv === "difficile" ? 4 : 3, tour = "toi", journal = [];
    // Celui qui prend la DERNIÈRE allumette perd. Stratégie gagnante : laisser (maxPrise+1)·k + 1.
    function coupOrdi() {
      var cible = (reste - 1) % (maxPrise + 1);
      var parfait = niv === "difficile" || (niv === "moyen" && Math.random() < 0.6);
      var p = (parfait && cible > 0) ? cible : 1 + alea(Math.min(maxPrise, reste));
      return Math.min(p, reste);
    }
    function dessine() {
      zone("<div style='font-size:15px;margin-bottom:10px'><b>" + reste + "</b> allumette" + (reste > 1 ? "s" : "") + " · tu peux en prendre de 1 à " + maxPrise + "</div>"
        + "<div style='font-size:28px;letter-spacing:2px;line-height:1.6;max-width:420px;margin:0 auto 12px;word-break:break-all'>" + new Array(reste + 1).join("🧨") + "</div>"
        + "<div style='display:flex;gap:8px;justify-content:center'>" + [1, 2, 3, 4].slice(0, maxPrise).map(function (k) {
            return "<button class='btn bi' data-k='" + k + "'" + (k > reste ? " disabled" : "") + ">Prendre " + k + "</button>";
          }).join("") + "</div>"
        + "<div style='margin-top:12px;color:#4D5163;font-size:14px'>" + journal.slice(-3).join("<br>") + "</div>");
      [].forEach.call(document.querySelectorAll("#jrZone [data-k]"), function (b) { b.onclick = function () { prendre(+b.getAttribute("data-k")); }; });
    }
    function prendre(k) {
      if (tour !== "toi" || k > reste) return;
      reste -= k; journal.push("Tu prends " + k + ".");
      if (reste === 0) { zone(fin("Perdu…", "Tu as pris la dernière allumette. Astuce : laisse toujours un multiple de " + (maxPrise + 1) + ", plus un.", null, "lancerJrAllumettes('" + niv + "')")); return; }
      tour = "ordi"; dessine();
      setTimeout(function () {
        var p = coupOrdi(); reste -= p; journal.push("L'ordinateur prend " + p + ".");
        if (reste === 0) {
          var v = (lire("allum_" + niv) || 0) + 1; ecrire("allum_" + niv, v);
          zone(fin("Gagné !", "L'ordinateur a dû prendre la dernière allumette.", { neuf: false, ancien: v + " victoire" + (v > 1 ? "s" : "") }, "lancerJrAllumettes('" + niv + "')")); return;
        }
        tour = "toi"; dessine();
      }, 700);
    }
    ecran("lancerJrAllumettes", "Allumettes", "🧨", "Chacun son tour, on prend de 1 à " + maxPrise + " allumettes. Celui qui prend la dernière a perdu. Tu commences.", niv, "");
    dessine();
  };

  /* ── 7. RÉFLEXE COULEURS (stimulation, attention) ──────────────────────── */
  var COUL = [["ROUGE", "#DC2626"], ["BLEU", "#2563EB"], ["VERT", "#16A34A"], ["JAUNE", "#CA8A04"], ["VIOLET", "#7C3AED"], ["ORANGE", "#EA580C"]];
  W.lancerJrCouleurs = function (niv) {
    niv = niv || "facile";
    var nb = niv === "facile" ? 3 : niv === "moyen" ? 4 : 6, duree = 30, pts = 0, erreurs = 0, fini = false, debut = Date.now(), q, chrono;
    var jeu = COUL.slice(0, nb);
    function nouvelle() { var m = alea(nb), c = alea(nb); if (niv !== "facile" && m === c) c = (c + 1) % nb; q = { mot: jeu[m][0], encre: c }; }
    function dessine() {
      var r = Math.max(0, duree - Math.floor((Date.now() - debut) / 1000));
      zone("<div style='font-size:13px;color:#8B93A6'>" + r + " s · " + pts + " point" + (pts > 1 ? "s" : "") + " · " + erreurs + " erreur" + (erreurs > 1 ? "s" : "") + "</div>"
        + "<div style='font:900 44px Montserrat,sans-serif;margin:22px 0;color:" + jeu[q.encre][1] + "'>" + q.mot + "</div>"
        + "<div style='font-size:13px;color:#4D5163;margin-bottom:10px'>Touche la couleur de l'ENCRE, pas le mot.</div>"
        + "<div style='display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:360px;margin:0 auto'>" + jeu.map(function (c, i) {
            return "<button type='button' data-c='" + i + "' aria-label='" + c[0] + "' style='" + CASE + "height:52px;border:0;background:" + c[1] + "'></button>";
          }).join("") + "</div>");
      [].forEach.call(document.querySelectorAll("#jrZone [data-c]"), function (b) { b.onclick = function () { repond(+b.getAttribute("data-c")); }; });
    }
    function repond(c) { if (fini) return; if (c === q.encre) pts++; else erreurs++; nouvelle(); dessine(); }
    function arret() {
      fini = true; clearInterval(chrono);
      var s = Math.max(0, pts - erreurs);
      zone(fin(s + " points", pts + " bonnes réponses, " + erreurs + " erreur" + (erreurs > 1 ? "s" : "") + " en " + duree + " secondes", record("couleurs_" + niv, s, "haut"), "lancerJrCouleurs('" + niv + "')"));
    }
    ecran("lancerJrCouleurs", "Réflexe couleurs", "🎨", "30 secondes : touche la couleur dans laquelle le mot est ÉCRIT. Le cerveau veut lire le mot : résiste !", niv, "");
    nouvelle(); dessine();
    if (W._jrChrono) clearInterval(W._jrChrono);
    var partie = W._jrPartie;
    chrono = W._jrChrono = setInterval(function () {
      // L'élève a quitté le jeu, ou en a lancé un autre : ce chronomètre s'arrête.
      if (!document.getElementById("jrZone") || W._jrPartie !== partie) { clearInterval(chrono); return; }
      if (Date.now() - debut >= duree * 1000) arret(); else if (!fini) { var e = document.querySelector("#jrZone div"); if (e) e.textContent = Math.max(0, duree - Math.floor((Date.now() - debut) / 1000)) + " s · " + pts + " point" + (pts > 1 ? "s" : "") + " · " + erreurs + " erreur" + (erreurs > 1 ? "s" : ""); }
    }, 250);
  };

  /* ── 8. GRILLE LOGIQUE (carré latin à régions : 4×4, 6×6, 9×9) ─────────── */
  function grilleSolution(n) {
    var br = n === 4 ? 2 : n === 6 ? 2 : 3, bc = n / br, g = [], r, c;
    for (r = 0; r < n; r++) { g.push([]); for (c = 0; c < n; c++) g[r].push(((r % br) * bc + Math.floor(r / br) + c) % n + 1); }
    // Mélanges qui gardent la grille valide : symboles, lignes dans une bande, bandes, colonnes dans une pile.
    var perm = melange(Array.apply(null, Array(n)).map(function (_, i) { return i + 1; }));
    g = g.map(function (l) { return l.map(function (x) { return perm[x - 1]; }); });
    var lignes = [], bandes = melange(Array.apply(null, Array(n / br)).map(function (_, i) { return i; }));
    bandes.forEach(function (b) { melange(Array.apply(null, Array(br)).map(function (_, i) { return i; })).forEach(function (i) { lignes.push(g[b * br + i]); }); });
    g = lignes;
    var cols = []; melange(Array.apply(null, Array(n / bc)).map(function (_, i) { return i; })).forEach(function (p) {
      melange(Array.apply(null, Array(bc)).map(function (_, i) { return i; })).forEach(function (i) { cols.push(p * bc + i); });
    });
    return { g: g.map(function (l) { return cols.map(function (c) { return l[c]; }); }), br: br, bc: bc };
  }
  W.lancerJrGrille = function (niv) {
    niv = niv || "facile";
    var n = niv === "facile" ? 4 : niv === "moyen" ? 6 : 9, S = grilleSolution(n), vides = Math.round(n * n * (niv === "facile" ? 0.45 : niv === "moyen" ? 0.5 : 0.55));
    var fixe = S.g.map(function (l) { return l.map(function () { return true; }); }), joue = S.g.map(function (l) { return l.slice(); }), t0 = Date.now();
    melange(Array.apply(null, Array(n * n)).map(function (_, i) { return i; })).slice(0, vides).forEach(function (p) { fixe[Math.floor(p / n)][p % n] = false; joue[Math.floor(p / n)][p % n] = 0; });
    function valide() {
      var r, c, k, vu;
      for (r = 0; r < n; r++) { vu = {}; for (c = 0; c < n; c++) { k = joue[r][c]; if (!k || vu[k]) return false; vu[k] = 1; } }
      for (c = 0; c < n; c++) { vu = {}; for (r = 0; r < n; r++) { k = joue[r][c]; if (vu[k]) return false; vu[k] = 1; } }
      for (var b = 0; b < n; b++) { vu = {}; var r0 = Math.floor(b / (n / S.bc)) * S.br, c0 = (b % (n / S.bc)) * S.bc;
        for (r = r0; r < r0 + S.br; r++) for (c = c0; c < c0 + S.bc; c++) { k = joue[r][c]; if (vu[k]) return false; vu[k] = 1; } }
      return true;
    }
    function dessine(msg) {
      var taille = n === 9 ? 34 : 46;
      zone("<div style='font-size:13px;color:#8B93A6;margin-bottom:8px'>Chiffres de 1 à " + n + " · zones de " + S.br + "×" + S.bc + "</div>"
        + "<div style='display:inline-grid;grid-template-columns:repeat(" + n + "," + taille + "px);border:2px solid #142554;border-radius:6px;overflow:hidden'>"
        + joue.map(function (l, r) { return l.map(function (x, c) {
            var bord = "border-right:" + ((c + 1) % S.bc === 0 && c < n - 1 ? "2px solid #142554" : "1px solid #CBD5E1") + ";border-bottom:" + ((r + 1) % S.br === 0 && r < n - 1 ? "2px solid #142554" : "1px solid #CBD5E1") + ";";
            return fixe[r][c] ? "<span style='" + bord + "height:" + taille + "px;display:flex;align-items:center;justify-content:center;font-weight:800;background:#EEF2FA;color:#142554'>" + x + "</span>"
              : "<input data-r='" + r + "' data-c='" + c + "' inputmode='numeric' maxlength='1' value='" + (x || "") + "' style='" + bord + "width:" + taille + "px;height:" + taille + "px;box-sizing:border-box;border-top:0;border-left:0;text-align:center;font-size:18px;color:#C24E00;font-weight:700;outline:none'>";
          }).join(""); }).join("") + "</div>"
        + "<div style='margin-top:12px'><button class='btn bi' id='jrOk'>Vérifier</button></div><div style='min-height:20px;margin-top:8px;color:#B42318'>" + (msg || "") + "</div>");
      [].forEach.call(document.querySelectorAll("#jrZone input[data-r]"), function (i) {
        i.oninput = function () { var v = parseInt(i.value, 10); if (!(v >= 1 && v <= n)) { i.value = ""; v = 0; } joue[+i.getAttribute("data-r")][+i.getAttribute("data-c")] = v; };
      });
      document.getElementById("jrOk").onclick = function () {
        if (valide()) { var s = Math.round((Date.now() - t0) / 1000); zone(fin("Grille résolue !", "en " + Math.floor(s / 60) + " min " + (s % 60) + " s", record("grille_" + niv, s, "bas"), "lancerJrGrille('" + niv + "')")); }
        else dessine("Pas encore : chaque ligne, chaque colonne et chaque zone doit contenir 1 à " + n + " une seule fois.");
      };
    }
    ecran("lancerJrGrille", "Grille logique", "🔢", "Complète la grille : chaque chiffre une seule fois par ligne, par colonne et par zone encadrée.", niv, "");
    dessine();
  };

  /* ── 9. ANAGRAMMES (vocabulaire, programme) ────────────────────────────── */
  var MOTS = {
    facile: ["CARTE", "LIVRE", "CALCUL", "FLEUVE", "PLANTE", "NOMBRE", "PHRASE", "VERBE", "SAVANE", "ECOLE", "CAHIER", "REGLE", "ANGLE", "SOLEIL"],
    moyen: ["TRIANGLE", "FRACTION", "VOLCAN", "CELLULE", "ENERGIE", "RECIT", "ADJECTIF", "PROVINCE", "EQUATION", "MOLECULE", "COLONIE", "CLIMAT"],
    difficile: ["DERIVEE", "PROBABILITE", "PHOTOSYNTHESE", "DISSERTATION", "METAPHORE", "ELECTRON", "LOGARITHME", "INDEPENDANCE", "CHROMOSOME", "ARGUMENT"]
  };
  W.lancerJrAnagrammes = function (niv) {
    niv = niv || "facile";
    var liste = melange(MOTS[niv]).slice(0, 8), n = 0, bons = 0, mot, brouille;
    function prepare() { mot = liste[n]; do { brouille = melange(mot.split("")).join(""); } while (brouille === mot && mot.length > 1); }
    function pose() {
      zone("<div style='font-size:13px;color:#8B93A6'>Mot " + (n + 1) + " sur 8 · " + bons + " trouvé" + (bons > 1 ? "s" : "") + "</div>"
        + "<div style='font:800 30px monospace;letter-spacing:8px;color:#142554;margin:18px 0'>" + brouille + "</div>"
        + "<div style='font-size:13px;color:#4D5163;margin-bottom:8px'>" + mot.length + " lettres · commence par « " + mot[0] + " »</div>"
        + "<input id='jrRep' class='fi' autocomplete='off' style='max-width:260px;margin:0 auto 10px;text-align:center;font-size:20px;text-transform:uppercase'>"
        + "<div><button class='btn bi' id='jrOk'>Valider</button> <button class='btn bo' id='jrPasse'>Passer</button></div><div id='jrFb' style='min-height:22px;margin-top:10px'></div>");
      var i = document.getElementById("jrRep"); if (i) { i.focus(); i.onkeydown = function (e) { if (e.key === "Enter") valider(false); }; }
      document.getElementById("jrOk").onclick = function () { valider(false); };
      document.getElementById("jrPasse").onclick = function () { valider(true); };
    }
    function valider(passe) {
      var v = String((document.getElementById("jrRep") || {}).value || "").toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Z]/g, "");
      if (!passe && !v) return;
      var ok = !passe && v === mot; if (ok) bons++;
      document.getElementById("jrFb").innerHTML = ok ? "<b style='color:#047857'>Bravo !</b>" : "<b style='color:#B42318'>C'était " + mot + "</b>";
      document.getElementById("jrOk").disabled = document.getElementById("jrPasse").disabled = true;
      setTimeout(function () {
        n++;
        if (n >= liste.length) { zone(fin(bons + " / " + liste.length, "mots retrouvés", record("anagr_" + niv, bons, "haut"), "lancerJrAnagrammes('" + niv + "')")); return; }
        prepare(); pose();
      }, 1200);
    }
    ecran("lancerJrAnagrammes", "Anagrammes du programme", "🔤", "Remets les lettres dans l'ordre pour retrouver un mot de tes cours.", niv, "");
    prepare(); pose();
  };

  /* Au catalogue : gratuits, tous niveaux, rangés sous « Réflexion ». */
  // [id, titre, emoji, description, lanceur, icône du site, genre affiché sur la carte]
  var JR = [
    ["jr_suites", "Suites logiques", "🧠", "Intelligence : trouve la règle cachée et le nombre suivant", "lancerJrSuites", "brain", "Intelligence"],
    ["jr_memoire", "Mémoire des paires", "🃏", "Éveil et mémoire : retrouve toutes les paires en un minimum de coups", "lancerJrMemoire", "eye", "Mémoire"],
    ["jr_taquin", "Taquin", "🧩", "Réflexion : fais glisser les cases pour les remettre dans l'ordre", "lancerJrTaquin", "target", "Réflexion"],
    ["jr_hanoi", "Tours de Hanoï", "🗼", "Stratégie : déplace la pile en un minimum de coups", "lancerJrHanoi", "award", "Stratégie"],
    ["jr_code", "Code secret", "🔐", "Logique : déduis le code grâce aux indices", "lancerJrCode", "lock", "Logique"],
    ["jr_allumettes", "Allumettes", "🧨", "Stratégie : bats l'ordinateur en anticipant ses coups", "lancerJrAllumettes", "flame", "Stratégie"],
    ["jr_couleurs", "Réflexe couleurs", "🎨", "Stimulation : 30 secondes d'attention et de rapidité", "lancerJrCouleurs", "zap", "Réflexes"],
    ["jr_grille", "Grille logique", "🔢", "Réflexion : complète la grille de 4×4 à 9×9", "lancerJrGrille", "pencil", "Réflexion"],
    ["jr_anagrammes", "Anagrammes du programme", "🔤", "Vocabulaire : retrouve les mots de tes cours", "lancerJrAnagrammes", "book", "Vocabulaire"]
  ];
  if (W.JEUX_CATALOGUE) JR.forEach(function (x) {
    if (W.JEUX_CATALOGUE.some(function (j) { return j.id === x[0]; })) return;
    W.JEUX_CATALOGUE.push({ id: x[0], titre: x[1], emoji: x[2], matiere: "Réflexion", niveau: "Tous niveaux (6eme-Tle)", tousNiveaux: true,
      desc: x[3], gratuit: true, action: x[4], type: "reflexion", ico: x[5], genre: x[6] });
  });
})(window);
