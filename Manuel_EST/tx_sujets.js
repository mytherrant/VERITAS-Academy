/* =====================================================================
   Banques de sujets de dissertation classés par GENRE (pour ciblage par
   série) + tableau « sujets types par série ». Sujets VERBATIM (fascicule
   DJAWILL, compilations du Centre, sujets officiels MINESEC).
   ===================================================================== */

/* --- Sujets par GENRE (chaque série pioche selon ses œuvres) --- */
const roman = [
  "Mario Vargas Llosa affirme : « Tout grand roman est un déicide, c’est-à-dire un assassinat symbolique de la réalité. » Commentez et discutez ces propos à l’aide d’arguments et d’exemples tirés des œuvres littéraires lues ou étudiées.",
  "Michel Raimond écrit : « Le succès du roman, la faveur dont il jouit auprès du public, l’intérêt qu’il suscite chez les lecteurs tiennent au fait qu’il nous livre à la fois les prestiges de l’imaginaire et les saveurs du réel. » En vous appuyant sur vos lectures d’œuvres romanesques, justifiez cette affirmation.",
  "« Le roman est une clef qui ouvre les portes interdites de nos maisons. » Partagez-vous cet avis de Louis Aragon ?",
  "« Le roman c’est la vie de tous les jours dans le langage de tous les jours », affirme Michel Butor. Appréciez cette définition à la lumière des œuvres romanesques que vous avez lues ou étudiées.",
  "Émile Zola, dans Le Roman expérimental, affirme qu’une œuvre littéraire doit être « un procès-verbal, rien de plus : elle n’a que le mérite de l’observation exacte ». Ce jugement s’accorde-t-il avec votre lecture des romans de votre programme ?",
];

const theatre = [
  "Victor Hugo déclare : « Le théâtre n’est pas le pays du réel : il y a des arbres en carton, des palais de toile, un ciel de haillon, des diamants de verre, de l’or de clinquant, un soleil qui sort de dessous terre. Mais c’est le pays du vrai. » Analysez cette affirmation à la lumière de votre culture pour montrer que le théâtre est un mélange de réalité et de fiction.",
  "Molière assignait à la comédie « de corriger les hommes en les divertissant ». Expliquez et discutez ce propos à la lumière des œuvres théâtrales que vous avez lues ou étudiées.",
  "Barthélemy Kotchy déclare : « Le théâtre négro-africain doit être un théâtre de réflexion au sens physique et philosophique du terme ; il doit être un donner à voir et un donner à penser. » Commentez cette pensée à la lumière des œuvres théâtrales camerounaises lues ou étudiées.",
  "Le théâtre n’est-il fait que pour divertir ?",
];

const poesie = [
  "Un penseur pour qui la poésie est à la fois fond et beauté asserte : « Je ne chante pas pour passer le temps. » Montrez la pertinence de ce point de vue à partir de votre culture poétique.",
  "Malherbe, au sujet du métier de poète, déclare : « La seule gloire qu’on pourra tirer est qu’on dira de nous que nous sommes de bons arrangeurs de syllabes. » Commentez et discutez ce point de vue à partir de votre culture poétique.",
  "Discutez ces propos de Victor Hugo à partir de votre culture poétique : « Malheur à qui prend ses sandales quand la haine et le scandale tourmentent le peuple agité. »",
  "Lamartine affirme : « Je ne parlais plus pour personne, je ne parlais que pour moi-même ; c’était mon propre cœur qui se berçait de ses propres sanglots. » Justifiez ce point de vue à partir de votre culture poétique.",
];

const engagementSociete = [
  "« La littérature n’est pas un objet de loisir, elle a une fonction humaine et grave, ce qui ne veut pas dire ennuyeuse. » Que vous inspirent ces propos d’Anne-Marie Garat sur la fonction de la littérature dans la société ?",
  "Pour Guy de Maupassant, l’œuvre littéraire a pour fonction de réveiller les consciences et d’affirmer son refus de voir l’humanité se déchirer. En vous appuyant sur des œuvres lues ou étudiées, expliquez et discutez ces propos.",
  "Friedrich Nietzsche affirme : « L’artiste a le pouvoir de réveiller la force d’agir qui sommeille dans d’autres âmes. » Montrez en quoi cette déclaration éclaire le rôle de l’écrivain dans la société.",
  "« La littérature vous jette dans la bataille ; écrire, c’est une autre façon de vouloir la liberté. Si vous commencez, de gré ou de force, vous êtes engagé. » Partagez-vous cette conception de Jean-Paul Sartre ?",
  "Théophile Gautier affirme : « Tout ce qui est utile est laid, car c’est l’expression de quelque besoin, et ceux de l’homme sont ignobles et dégoûtants. » La littérature doit-elle uniquement s’orienter vers la forme ?",
];

const cultureGenerale = [
  "Le monde entier est menacé par des pandémies. Après en avoir énuméré les causes possibles, dites dans quelle mesure elles peuvent être combattues.",
  "Les nouvelles technologies : après en avoir montré les bienfaits, vous direz dans quelle mesure elles peuvent nuire à la jeunesse.",
  "« Sans instruction, les femmes d’Afrique ne pourront pas prendre pleinement part au développement économique et s’impliquer davantage dans la vie politique de leur pays » (Martin Ziguélé). Pensez-vous que le développement de l’Afrique se limiterait à la simple éducation de la femme ?",
  "Pensez-vous, comme certains, que le diplôme ne confère pas immédiatement la compétence ? Vous répondrez dans un développement argumenté, assorti d’exemples précis puisés dans votre culture.",
  "Doit-on, au nom du respect d’une culture, tolérer toutes les traditions ? Vous appuierez votre réflexion sur des exemples précis.",
];

/* --- Sujets types par série (quels genres chaque série doit maîtriser) --- */
const parSerieTle = [
  ["Tles C / D / E (scientifiques)","Roman + théâtre (pièce camerounaise). Piocher dans : Roman, Théâtre, Engagement & société."],
  ["Tle TI (industrielle)","Roman (camerounais XXe) + essai. Piocher dans : Roman, Engagement & société, Culture générale."],
  ["Tles ESF / HT (tertiaire)","Roman (africain) + essai lié au monde socio-professionnel. Piocher dans : Roman, Engagement & société, Culture générale."],
  ["Tles ACA / ACC / FIG / CG / SES (tertiaire)","Roman (camerounais) + essai + théâtre (français XVIIIe, œuvre secondaire). Piocher dans : Roman, Théâtre, Engagement & société, Culture générale."],
  ["Séries industrielles F / AF / CI / BT","Dissertation de culture littéraire OU de culture générale (3 sujets au choix, dont un CG). Piocher dans : Engagement & société, Culture générale."],
];
const parSerie1ere = [
  ["1ères C / D, TI, ESF / HT, ACA…","Roman (français XIXe) + théâtre (africain XXe) + essai. Piocher dans : Roman, Théâtre, Engagement & société."],
  ["1ère E","Théâtre (africain XXe) + essai. Piocher dans : Théâtre, Engagement & société."],
  ["Séries STT & industrielles","Dissertation littéraire OU de culture générale (selon le type de sujet). Piocher dans : Engagement & société, Culture générale."],
];

module.exports = { roman, theatre, poesie, engagementSociete, cultureGenerale,
  parSerieTle, parSerie1ere };
