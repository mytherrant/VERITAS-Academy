/* VÉRITAS — Apprendre : registre des leçons rédigées (fichier généré : ne pas éditer lecons.js à la main,
   éditer apprendre/_src/*.js puis reconstruire avec tools/build_apprendre.sh). */
window.VRT_LECONS = {};
function VRT_L(id, o) { o.ordre = Object.keys(window.VRT_LECONS).length; window.VRT_LECONS[id] = o; }
/* Animation / schéma manipulable rattaché à la partie i d'une leçon. fn(el) dessine dans el. */
function VRT_A(id, i, titre, fn) { var L = window.VRT_LECONS[id]; if (L && L.parties[i]) { L.parties[i].anim = fn; L.parties[i].animT = titre; } }

/* Leçons rédigées VÉRITAS — sciences (maths, PCT, SVT, informatique).
   cle = morceau du titre officiel de la progression MINESEC 2026-2027 (rattachement automatique). */
VRT_L("3e-maths-thales", {
  c: "3e", m: "maths", cle: "Propriété directe de Thalès", titre: "La propriété de Thalès dans le triangle", duree: 20,
  accroche: "Mesurer la hauteur d'un arbre sans y grimper : c'est Thalès.",
  intro: "Comment mesurer la hauteur d'un manguier de la cour sans grimper dedans ? Avec un bâton, son ombre et la propriété de Thalès.",
  objectifs: ["reconnaître une configuration de Thalès", "écrire l'égalité des trois rapports", "calculer une longueur inconnue"],
  parties: [
    { t: "La configuration de Thalès", html:
      "<p>On a un triangle <strong>ABC</strong>. Un point <strong>M</strong> est sur le côté [AB], un point <strong>N</strong> sur le côté [AC], et la droite (MN) est <strong>parallèle</strong> à (BC).</p>" +
      "<div class='attention'><b>Condition indispensable</b>Sans le parallélisme de (MN) et (BC), on n'a pas le droit d'utiliser la propriété.</div>",
      illus: { legende: "(MN) est parallèle à (BC) : le petit triangle AMN est une « réduction » du grand triangle ABC.", svg:
      "<svg viewBox='0 0 420 250' role='img' aria-label='Triangle ABC coupé par la droite MN parallèle à BC'><path d='M60 220 L360 220 L150 30 Z' fill='#DBE8FE' stroke='#142554' stroke-width='2.5' stroke-linejoin='round'/><path d='M150 30 L96 138 L246 138 Z' fill='#FFC93C' fill-opacity='.45'/><line x1='60' y1='138' x2='330' y2='138' stroke='#1E499B' stroke-width='2.5' stroke-dasharray='7 6'/><g fill='#142554' font-size='18' font-weight='700'><text x='142' y='22'>A</text><text x='40' y='238'>B</text><text x='366' y='238'>C</text><text x='74' y='134'>M</text><text x='252' y='134'>N</text></g><g fill='#142554'><circle cx='96' cy='138' r='4'/><circle cx='246' cy='138' r='4'/></g><text x='334' y='133' fill='#1E499B' font-size='14'>(MN) // (BC)</text></svg>" } ,
      retenir: "Deux points sur deux côtés + une parallèle au troisième côté : c'est la configuration de Thalès." },
    { t: "La propriété directe", html:
      "<div class='def'><b>Propriété</b>Si M ∈ [AB], N ∈ [AC] et (MN) // (BC), alors les longueurs des côtés des triangles AMN et ABC sont proportionnelles :</div>" +
      "<p class='formule'>AM / AB = AN / AC = MN / BC</p>" +
      "<div class='astuce'><b>Astuce</b>On écrit toujours le <strong>petit triangle en haut</strong> et le <strong>grand triangle en bas</strong>, en partant du sommet commun A.</div>" + "<div class='savais'><b>Le savais-tu ?</b>On raconte que Thalès de Milet, mathématicien grec du VIᵉ siècle avant J.-C., aurait mesuré la hauteur d'une pyramide d'Égypte grâce à son ombre.</div>",
      retenir: "Petit triangle sur grand triangle, sommet commun en premier." },
    { t: "Calculer une longueur", html:
      "<div class='ex'><b>Exemple</b>AM = 3 cm, AB = 5 cm, BC = 8 cm et (MN) // (BC). Calculer MN.</div>" +
      "<ol><li>On vérifie la configuration : M ∈ [AB], N ∈ [AC], (MN) // (BC).</li><li>On écrit l'égalité utile : AM / AB = MN / BC, soit 3 / 5 = MN / 8.</li><li>Produit en croix : MN = 3 × 8 ÷ 5 = <strong>4,8 cm</strong>.</li></ol>" +
      "<h3>L'arbre et son ombre</h3><p>Un bâton de 1,5 m projette une ombre de 2 m ; au même moment, l'ombre du manguier mesure 12 m. Les rayons du soleil sont parallèles, donc : hauteur du manguier = 1,5 × 12 ÷ 2 = <strong>9 m</strong>.</p>",
      retenir: "On n'écrit que les deux rapports qui contiennent la longueur cherchée et deux longueurs connues." }
  ],
  revision: ["Configuration : M sur [AB], N sur [AC], <strong>(MN) // (BC)</strong>.", "Égalité : <strong>AM/AB = AN/AC = MN/BC</strong>.", "Petit triangle en haut, grand en bas.", "On termine par un produit en croix.", "La réciproque sert à <strong>prouver</strong> que deux droites sont parallèles."],
  exo: "<p>Dans un triangle EFG, R ∈ [EF] et S ∈ [EG] avec (RS) // (FG). ER = 4 cm, EF = 10 cm, EG = 15 cm. Calcule ES. <em>(Réponse : 6 cm.)</em></p>",
  quiz: [
    { q: "Quelle condition est obligatoire pour appliquer Thalès dans ABC avec M ∈ [AB] et N ∈ [AC] ?", r: ["AM = AN", "(MN) parallèle à (BC)", "ABC rectangle"], b: 1, e: "Sans parallélisme, les rapports ne sont pas égaux." },
    { q: "AM = 2, AB = 6, BC = 9. Combien vaut MN ?", r: ["3", "4,5", "27"], b: 0, e: "2/6 = MN/9, donc MN = 9 × 2 ÷ 6 = 3." },
    { q: "Quelle égalité est juste ?", r: ["AM/AB = AN/AC", "AM/AN = AB/BC", "AB/AM = AC/MN"], b: 0, e: "On compare les côtés correspondants : petit triangle sur grand triangle." },
    { q: "Un bâton de 1 m fait une ombre de 0,5 m ; un poteau fait une ombre de 4 m. Sa hauteur ?", r: ["2 m", "8 m", "4,5 m"], b: 1, e: "1/0,5 = h/4, donc h = 8 m." }
  ],
  examen: { t: "Thalès au BEPC : sujets corrigés", href: "/corriges/" }
});

VRT_L("3e-maths-racines", {
  c: "3e", m: "maths", cle: "Racines carrées d", titre: "Racine carrée d'un nombre positif", duree: 15,
  accroche: "Quel côté pour un champ carré de 49 m² ? La racine carrée répond.",
  intro: "Un terrain carré mesure 49 m². Quelle est la longueur de son côté ? Il faut trouver le nombre qui, multiplié par lui-même, donne 49 : c'est sa racine carrée.",
  objectifs: ["définir la racine carrée d'un nombre positif", "connaître les carrés parfaits usuels", "appliquer √(a×b) = √a × √b"],
  parties: [
    { t: "Définition", html:
      "<div class='def'><b>Définition</b>a est un nombre positif. La racine carrée de a, notée √a, est le nombre <strong>positif</strong> dont le carré est égal à a.</div>" +
      "<p class='formule'>(√a)² = a   et   √a ≥ 0</p><p>Exemples : √49 = 7 car 7² = 49 ; √0 = 0 ; √1 = 1.</p>" +
      "<div class='attention'><b>Attention</b>√(−4) n'existe pas dans les nombres réels : aucun carré n'est négatif.</div>",
      illus: { legende: "Un carré d'aire 49 a un côté de √49 = 7.", svg:
      "<svg viewBox='0 0 420 200' role='img' aria-label='Carré d aire 49 et de côté 7'><rect x='60' y='20' width='160' height='160' rx='4' fill='#DBE8FE' stroke='#142554' stroke-width='2.5'/><g stroke='#8FB0EE' stroke-width='1'><path d='M82.9 20v160M105.7 20v160M128.6 20v160M151.4 20v160M174.3 20v160M197.1 20v160M60 42.9h160M60 65.7h160M60 88.6h160M60 111.4h160M60 134.3h160M60 157.1h160'/></g><text x='140' y='108' text-anchor='middle' font-size='30' font-weight='700' fill='#142554'>49 m²</text><text x='140' y='198' text-anchor='middle' font-size='16' fill='#1E499B'>côté = √49 = 7 m</text><text x='260' y='70' font-size='18' fill='#142554'>7 × 7 = 49</text><text x='260' y='105' font-size='18' fill='#142554'>donc √49 = 7</text><rect x='256' y='124' width='130' height='4' rx='2' fill='#FFC93C'/></svg>" },
      retenir: "Une racine carrée est toujours positive ou nulle." },
    { t: "Les carrés parfaits à connaître", html:
      "<div class='tab-scroll'><table><thead><tr><th>n</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td></tr></thead><tbody><tr><th>n²</th><td>1</td><td>4</td><td>9</td><td>16</td><td>25</td><td>36</td><td>49</td><td>64</td><td>81</td><td>100</td><td>121</td><td>144</td></tr></tbody></table></div>" +
      "<div class='astuce'><b>Astuce</b>Un carré parfait se termine toujours par 0, 1, 4, 5, 6 ou 9 : un nombre qui finit par 2, 3, 7 ou 8 n'est jamais un carré parfait.</div><p>Lis le tableau dans l'autre sens : √81 = 9, √144 = 12. Pour un nombre qui n'est pas un carré parfait, on encadre : 36 &lt; 40 &lt; 49 donc 6 &lt; √40 &lt; 7.</p>",
      retenir: "Connaître les carrés de 1 à 12 fait gagner un temps précieux à l'examen." },
    { t: "Règles de calcul", html:
      "<p class='formule'>√(a × b) = √a × √b    √(a / b) = √a / √b  (b ≠ 0)</p>" +
      "<div class='ex'><b>Simplifier √50</b>50 = 25 × 2, donc √50 = √25 × √2 = <strong>5√2</strong>.</div>" +
      "<div class='attention'><b>Piège classique</b>√(a + b) n'est PAS égal à √a + √b. Exemple : √(9 + 16) = √25 = 5, alors que √9 + √16 = 3 + 4 = 7.</div>",
      retenir: "La racine se « partage » dans un produit, jamais dans une somme." }
  ],
  revision: ["√a existe seulement si a ≥ 0, et √a ≥ 0.", "(√a)² = a.", "Carrés parfaits de 1 à 144.", "√(ab) = √a × √b ; √(a/b) = √a / √b.", "√(a + b) ≠ √a + √b."],
  exo: "<p>Écris sous la forme a√b : √12 ; √75 ; √200. <em>(2√3 ; 5√3 ; 10√2.)</em></p>",
  quiz: [
    { q: "Combien vaut √121 ?", r: ["11", "12", "60,5"], b: 0, e: "11 × 11 = 121." },
    { q: "√18 s'écrit aussi…", r: ["9√2", "3√2", "2√3"], b: 1, e: "18 = 9 × 2, donc √18 = 3√2." },
    { q: "√(16 + 9) vaut…", r: ["7", "5", "25"], b: 1, e: "On calcule d'abord 16 + 9 = 25, puis √25 = 5." },
    { q: "Entre quels entiers se trouve √30 ?", r: ["4 et 5", "5 et 6", "6 et 7"], b: 1, e: "25 < 30 < 36." }
  ]
});

VRT_L("3e-pct-atome", {
  c: "3e", m: "pct", cle: "Séance 1 : Atome", titre: "L'atome", duree: 15,
  accroche: "Tout ce qui t'entoure est fait de grains minuscules : les atomes.",
  intro: "La table, l'eau du seau, l'air que tu respires : tout est fait d'atomes. Un seul grain de sel en contient des milliards de milliards.",
  objectifs: ["décrire la structure d'un atome", "expliquer pourquoi l'atome est électriquement neutre", "lire un symbole chimique"],
  parties: [
    { t: "Un noyau et des électrons", html:
      "<p>Un atome est formé :</p><ul><li>d'un <strong>noyau</strong> central, très petit, chargé positivement ; il contient des <strong>protons</strong> (charge +) et des <strong>neutrons</strong> (neutres) ;</li><li>d'<strong>électrons</strong> (charge −) qui se déplacent autour du noyau, dans un espace presque vide appelé <strong>nuage électronique</strong>.</li></ul>",
      illus: { legende: "Modèle simplifié de l'atome de lithium : 3 protons, 4 neutrons, 3 électrons.", svg:
      "<svg viewBox='0 0 420 260' role='img' aria-label='Schéma d un atome avec noyau et électrons'><circle cx='170' cy='130' r='110' fill='#DBE8FE' fill-opacity='.5' stroke='#8FB0EE' stroke-dasharray='5 6'/><circle cx='170' cy='130' r='62' fill='none' stroke='#8FB0EE' stroke-dasharray='5 6'/><g><circle cx='162' cy='124' r='9' fill='#D9472B'/><circle cx='178' cy='124' r='9' fill='#8C9BC0'/><circle cx='170' cy='138' r='9' fill='#D9472B'/><circle cx='155' cy='139' r='9' fill='#8C9BC0'/><circle cx='185' cy='139' r='9' fill='#D9472B'/><circle cx='170' cy='112' r='9' fill='#8C9BC0'/><circle cx='170' cy='150' r='9' fill='#8C9BC0'/></g><g fill='#FFC93C' stroke='#142554' stroke-width='1.5'><circle cx='232' cy='130' r='8'/><circle cx='99' cy='80' r='8'/><circle cx='118' cy='225' r='8'/></g><g font-size='14' fill='#142554'><text x='300' y='80'>● proton (+)</text><text x='300' y='108'>● neutron</text><text x='300' y='136'>● électron (−)</text></g><circle cx='296' cy='75' r='5' fill='#D9472B'/><circle cx='296' cy='103' r='5' fill='#8C9BC0'/><circle cx='296' cy='131' r='5' fill='#FFC93C' stroke='#142554'/><text x='300' y='190' font-size='13' fill='#636A80'>Proportions non respectées :</text><text x='300' y='208' font-size='13' fill='#636A80'>le noyau est 100 000 fois</text><text x='300' y='226' font-size='13' fill='#636A80'>plus petit que l'atome.</text></svg>" },
      retenir: "Atome = noyau (protons + neutrons) + électrons autour." },
    { t: "Un atome est neutre", html:
      "<p>Dans un atome, il y a <strong>autant de protons que d'électrons</strong>. Les charges + et − se compensent : l'atome est électriquement neutre.</p><p>Le nombre de protons s'appelle le <strong>numéro atomique Z</strong>. C'est la carte d'identité de l'élément : Z = 1 hydrogène, Z = 6 carbone, Z = 8 oxygène.</p>",
      retenir: "Nombre de protons = nombre d'électrons = Z." },
    { t: "Symboles chimiques", html:
      "<p>Chaque élément a un symbole : une majuscule, parfois suivie d'une minuscule.</p><table><thead><tr><th>Élément</th><th>Symbole</th><th>Z</th></tr></thead><tbody><tr><td>Hydrogène</td><td>H</td><td>1</td></tr><tr><td>Carbone</td><td>C</td><td>6</td></tr><tr><td>Azote</td><td>N</td><td>7</td></tr><tr><td>Oxygène</td><td>O</td><td>8</td></tr><tr><td>Sodium</td><td>Na</td><td>11</td></tr><tr><td>Fer</td><td>Fe</td><td>26</td></tr></tbody></table>",
      retenir: "Un symbole commence toujours par une majuscule : Na, et non NA ou na."  }
  ],
  revision: ["Noyau positif : protons (+) et neutrons (0).", "Électrons (−) autour du noyau.", "Atome neutre : autant de protons que d'électrons.", "Z = numéro atomique = nombre de protons.", "Symboles : H, C, N, O, Na, Fe…"],
  exo: "<p>L'atome d'aluminium a Z = 13. Combien a-t-il d'électrons ? Pourquoi ? <em>(13, car il est neutre.)</em></p>",
  quiz: [
    { q: "Quelles particules se trouvent dans le noyau ?", r: ["Protons et électrons", "Protons et neutrons", "Électrons seulement"], b: 1, e: "Les électrons tournent autour du noyau." },
    { q: "Un atome a 8 protons. Combien a-t-il d'électrons ?", r: ["8", "16", "4"], b: 0, e: "L'atome est neutre." },
    { q: "Quel est le symbole du sodium ?", r: ["So", "Na", "S"], b: 1, e: "Du latin natrium." },
    { q: "Pourquoi un atome est-il neutre ?", r: ["Il n'a pas de charge du tout", "Les charges + et − se compensent", "Les neutrons annulent tout"], b: 1, e: "Autant de protons (+) que d'électrons (−)." }
  ]
});

VRT_L("3e-pct-ph", {
  c: "3e", m: "pct", cle: "concentration molaire et de pH", titre: "Concentration molaire et pH d'une solution", duree: 20,
  accroche: "Jus de citron, eau savonneuse : le pH dit qui est acide.",
  intro: "Le jus de citron pique la langue, l'eau savonneuse glisse entre les doigts. Ces deux liquides n'ont pas le même pH. Apprends à le mesurer et à calculer une concentration.",
  objectifs: ["calculer une concentration molaire", "classer une solution acide, neutre ou basique", "mesurer un pH en sécurité"],
  parties: [
    { t: "La concentration molaire", html:
      "<p>Une solution est obtenue en dissolvant un <strong>soluté</strong> dans un <strong>solvant</strong> (souvent l'eau). La concentration molaire indique la quantité de soluté par litre de solution.</p><p class='formule'>C = n / V</p><ul><li>C : concentration molaire en mol/L</li><li>n : quantité de matière du soluté en mol</li><li>V : volume de la solution en L</li></ul>" +
      "<div class='ex'><b>Exemple</b>On dissout 0,2 mol de sel dans de l'eau pour obtenir 0,5 L de solution : C = 0,2 ÷ 0,5 = <strong>0,4 mol/L</strong>.</div>",
      retenir: "Le volume doit être en litres : 250 mL = 0,25 L." },
    { t: "L'échelle de pH", html:
      "<p>Le pH est un nombre, en général entre 0 et 14 :</p><ul><li>pH &lt; 7 : solution <strong>acide</strong> (jus de citron, vinaigre) ;</li><li>pH = 7 : solution <strong>neutre</strong> (eau pure) ;</li><li>pH &gt; 7 : solution <strong>basique</strong> (eau savonneuse, eau de javel).</li></ul>",
      illus: { legende: "Plus le pH est petit, plus la solution est acide ; plus il est grand, plus elle est basique.", svg:
      "<svg viewBox='0 0 440 150' role='img' aria-label='Échelle de pH de 0 à 14'><defs><linearGradient id='phg' x1='0' x2='1'><stop offset='0' stop-color='#D9472B'/><stop offset='.35' stop-color='#FFC93C'/><stop offset='.5' stop-color='#7FCB8C'/><stop offset='.75' stop-color='#8FB0EE'/><stop offset='1' stop-color='#5B4FA8'/></linearGradient></defs><rect x='20' y='50' width='400' height='28' rx='14' fill='url(#phg)'/><g font-size='12' fill='#142554' text-anchor='middle'><text x='20' y='96'>0</text><text x='220' y='96'>7</text><text x='420' y='96'>14</text></g><line x1='220' y1='42' x2='220' y2='86' stroke='#142554' stroke-width='2'/><g font-size='13' fill='#142554' font-weight='700' text-anchor='middle'><text x='90' y='36'>ACIDE</text><text x='220' y='36'>NEUTRE</text><text x='350' y='36'>BASIQUE</text></g><g font-size='12' fill='#636A80' text-anchor='middle'><text x='54' y='122'>citron ≈ 2</text><text x='128' y='140'>vinaigre ≈ 3</text><text x='220' y='122'>eau pure 7</text><text x='320' y='140'>savon ≈ 10</text><text x='392' y='122'>javel ≈ 12</text></g></svg>" },
      retenir: "Acide sous 7, neutre à 7, basique au-dessus de 7." },
    { t: "Mesurer le pH sans danger", html:
      "<p>On utilise le <strong>papier pH</strong> : on dépose une goutte de solution avec un agitateur, puis on compare la couleur obtenue à l'échelle de la boîte. Le <strong>pH-mètre</strong> donne une mesure plus précise.</p><div class='attention'><b>Sécurité</b>Blouse, lunettes, gants. On ne goûte jamais une solution au laboratoire. On verse toujours l'acide dans l'eau, jamais l'inverse.</div>",
      retenir: "Une goutte sur le papier pH, jamais le papier dans le flacon." }
  ],
  revision: ["C = n / V (mol/L).", "Volume toujours en litres.", "pH < 7 acide ; = 7 neutre ; > 7 basique.", "Papier pH : goutte déposée avec un agitateur.", "Sécurité : blouse, lunettes, gants."],
  exo: "<p>On dissout 0,05 mol de soude dans 250 mL d'eau. Calcule la concentration. <em>(0,2 mol/L.)</em></p>",
  quiz: [
    { q: "Une solution a un pH de 3. Elle est…", r: ["basique", "neutre", "acide"], b: 2, e: "pH < 7 : acide." },
    { q: "0,1 mol dans 0,5 L : quelle concentration ?", r: ["0,05 mol/L", "0,2 mol/L", "5 mol/L"], b: 1, e: "C = 0,1 ÷ 0,5 = 0,2 mol/L." },
    { q: "Quel liquide est basique ?", r: ["Jus de citron", "Eau savonneuse", "Vinaigre"], b: 1, e: "Le savon a un pH vers 10." },
    { q: "Pour diluer un acide, on verse…", r: ["l'eau dans l'acide", "l'acide dans l'eau", "les deux en même temps"], b: 1, e: "Cela évite les projections dangereuses." }
  ]
});

VRT_L("3e-svt-adn", {
  c: "3e", m: "svt", cle: "notions de chromosome et d", titre: "Chromosomes et ADN : le support de l'hérédité", duree: 20,
  accroche: "Pourquoi as-tu les yeux de ta mère ? Réponse dans tes chromosomes.",
  intro: "Tu ressembles à tes parents sans être leur copie. L'information qui se transmet de génération en génération est écrite dans une molécule : l'ADN.",
  objectifs: ["situer l'information génétique dans la cellule", "décrire un chromosome", "relier chromosome, ADN et gène"],
  parties: [
    { t: "L'information génétique est dans le noyau", html:
      "<p>Des expériences de transfert de noyau l'ont montré : quand on remplace le noyau d'une cellule par celui d'une autre, la cellule prend les caractères de l'individu qui a donné le noyau. L'information génétique est donc <strong>dans le noyau</strong>.</p>",
      retenir: "Le noyau commande les caractères héréditaires." },
    { t: "Les chromosomes", html:
      "<p>Au moment où la cellule se divise, on voit dans le noyau des petits bâtonnets : les <strong>chromosomes</strong>. Chez l'être humain, chaque cellule (sauf les cellules reproductrices) en contient <strong>46</strong>, soit <strong>23 paires</strong>.</p><ul><li>22 paires sont identiques chez la fille et le garçon ;</li><li>la 23ᵉ paire, celle des <strong>chromosomes sexuels</strong>, est XX chez la fille et XY chez le garçon.</li></ul>",
      illus: { legende: "Du noyau à l'ADN : le chromosome est un long filament d'ADN très enroulé ; un gène en est un petit segment.", svg:
      "<svg viewBox='0 0 460 200' role='img' aria-label='Cellule, noyau, chromosome, ADN, gène'><circle cx='70' cy='100' r='58' fill='#E0F5E5' stroke='#00520B' stroke-width='2'/><circle cx='78' cy='96' r='24' fill='#7FCB8C' stroke='#00520B' stroke-width='2'/><path d='M70 86l14 20M86 86l-14 20' stroke='#00520B' stroke-width='3' stroke-linecap='round'/><text x='70' y='180' text-anchor='middle' font-size='13' fill='#142554'>cellule et noyau</text><path d='M134 100h30' stroke='#636A80' stroke-width='2' marker-end='url(#fl)'/><defs><marker id='fl' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='7' markerHeight='7' orient='auto'><path d='M0 0l10 5-10 5z' fill='#636A80'/></marker></defs><g stroke='#007E11' stroke-width='14' stroke-linecap='round'><path d='M190 50 L230 150'/><path d='M230 50 L190 150'/></g><circle cx='210' cy='100' r='6' fill='#00520B'/><text x='210' y='180' text-anchor='middle' font-size='13' fill='#142554'>chromosome</text><path d='M252 100h30' stroke='#636A80' stroke-width='2' marker-end='url(#fl)'/><path d='M300 60 C320 80 340 40 360 60 S400 80 420 60' fill='none' stroke='#1E499B' stroke-width='3'/><path d='M300 140 C320 120 340 160 360 140 S400 120 420 140' fill='none' stroke='#1E499B' stroke-width='3'/><g stroke='#8FB0EE' stroke-width='2'><path d='M310 68v64M325 64v72M340 58v84M355 62v76M370 70v60M385 66v68M400 62v76M413 64v72'/></g><rect x='336' y='52' width='38' height='96' rx='6' fill='#FFC93C' fill-opacity='.35' stroke='#9A6F00'/><text x='355' y='170' text-anchor='middle' font-size='13' fill='#9A6F00' font-weight='700'>un gène</text><text x='360' y='190' text-anchor='middle' font-size='13' fill='#142554'>molécule d'ADN</text></svg>" },
      retenir: "46 chromosomes, soit 23 paires ; XX chez la fille, XY chez le garçon." },
    { t: "ADN et gènes", html:
      "<p>Chaque chromosome est formé d'une très longue molécule d'<strong>ADN</strong> (acide désoxyribonucléique), en forme de double hélice. Un <strong>gène</strong> est un petit morceau d'ADN qui porte l'information d'un caractère (par exemple le groupe sanguin).</p><p>Un même gène peut exister sous plusieurs versions, appelées <strong>allèles</strong> : c'est pourquoi les individus d'une même espèce ne sont pas identiques.</p>",
      retenir: "Chromosome → ADN → gène → caractère." }
  ],
  revision: ["L'information génétique est dans le noyau.", "Homme : 46 chromosomes (23 paires).", "Chromosomes sexuels : XX (fille), XY (garçon).", "Chromosome = ADN enroulé ; gène = segment d'ADN.", "Allèles : versions différentes d'un même gène."],
  exo: "<p>Explique en trois lignes pourquoi deux frères n'ont pas exactement les mêmes caractères. Utilise les mots : chromosome, gène, allèle.</p>",
  quiz: [
    { q: "Combien de chromosomes dans une cellule humaine ordinaire ?", r: ["23", "46", "92"], b: 1, e: "23 paires, soit 46." },
    { q: "Un garçon possède la paire sexuelle…", r: ["XX", "XY", "YY"], b: 1, e: "XX chez la fille, XY chez le garçon." },
    { q: "Un gène est…", r: ["une cellule", "un segment d'ADN", "un chromosome entier"], b: 1, e: "Le gène est une portion de la molécule d'ADN." },
    { q: "Où se trouve l'information génétique ?", r: ["Dans le noyau", "Dans la membrane", "Dans le sang seulement"], b: 0, e: "Les transferts de noyau le prouvent." }
  ]
});

VRT_L("3e-svt-ressemblances", {
  c: "3e", m: "svt", cle: "Ressemblances entre les individus", titre: "Ressemblances entre les individus : les caractères de l'espèce humaine", duree: 15,
  accroche: "Nous sommes tous différents… et pourtant tous humains.",
  intro: "Au marché de Mokolo, aucun visage n'est identique. Pourtant, tous ces gens partagent des caractères qui font d'eux des êtres humains.",
  objectifs: ["distinguer caractères de l'espèce et caractères individuels", "définir l'espèce", "donner des exemples précis"],
  parties: [
    { t: "Les caractères de l'espèce", html:
      "<p>Tous les êtres humains marchent sur deux pieds, ont un pouce opposable, un grand cerveau, la parole articulée. Ces traits communs sont les <strong>caractères de l'espèce humaine</strong>.</p><div class='def'><b>Définition</b>Une espèce est un ensemble d'individus qui se ressemblent et qui peuvent se reproduire entre eux en donnant des descendants eux-mêmes féconds.</div>",
      retenir: "Caractères de l'espèce = traits partagés par tous les humains." },
    { t: "Les caractères individuels", html:
      "<p>À l'intérieur de l'espèce, chacun a ses propres variations : couleur des yeux, forme du lobe de l'oreille, groupe sanguin, taille… Ce sont les <strong>caractères individuels</strong>.</p>",
      illus: { legende: "Le même caractère (le lobe de l'oreille) existe sous deux formes : libre ou attaché.", svg:
      "<svg viewBox='0 0 420 190' role='img' aria-label='Lobe d oreille libre et lobe attaché'><g fill='#E0F5E5' stroke='#00520B' stroke-width='2.5' stroke-linejoin='round'><path d='M90 30c40 0 62 30 58 66-3 26-22 38-26 56-4 18-30 24-38 6-6-14 10-12 4-28' /><path d='M290 30c40 0 62 30 58 66-3 26-14 40-28 56-8 8-20 4-24-6'/></g><path d='M88 130c-10 8-12 24 2 30 10 4 18-2 18-10' fill='#FFC93C' fill-opacity='.5' stroke='#9A6F00' stroke-width='2'/><path d='M296 146c-8 4-10 10-6 12' fill='none' stroke='#9A6F00' stroke-width='3'/><g font-size='15' font-weight='700' fill='#142554' text-anchor='middle'><text x='110' y='186'>lobe libre</text><text x='310' y='186'>lobe attaché</text></g></svg>" },
      retenir: "Caractères individuels = ce qui rend chaque personne unique." },
    { t: "Héréditaire ou acquis ?", html:
      "<p>Certains caractères viennent des parents : ils sont <strong>héréditaires</strong> (groupe sanguin, couleur naturelle des yeux). D'autres sont modifiés par le milieu ou le mode de vie : la peau qui fonce au soleil, les muscles qui grossissent avec le sport.</p>",
      retenir: "Hérédité + environnement façonnent chaque individu." }
  ],
  revision: ["Espèce : individus semblables, interféconds, à descendance féconde.", "Caractères de l'espèce : communs à tous.", "Caractères individuels : variables d'une personne à l'autre.", "Certains sont héréditaires, d'autres modifiés par le milieu."],
  exo: "<p>Classe : groupe sanguin, bronzage, bipédie, couleur des yeux, cicatrice. <em>(Espèce : bipédie. Individuels héréditaires : groupe sanguin, yeux. Acquis : bronzage, cicatrice.)</em></p>",
  quiz: [
    { q: "La bipédie est un caractère…", r: ["de l'espèce", "individuel", "acquis"], b: 0, e: "Tous les humains marchent sur deux pieds." },
    { q: "Le groupe sanguin est…", r: ["acquis", "héréditaire", "inexistant"], b: 1, e: "Il est transmis par les parents." },
    { q: "Le bronzage est un caractère…", r: ["héréditaire", "modifié par le milieu", "de l'espèce"], b: 1, e: "Il dépend de l'exposition au soleil." }
  ]
});

VRT_L("6e-info-ia", {
  c: "6e", m: "info", cle: "Généralités sur l", titre: "L'intelligence artificielle, c'est quoi ?", duree: 15,
  accroche: "Un téléphone qui reconnaît ta voix : c'est de l'IA.",
  intro: "Ton téléphone reconnaît ta voix, une application traduit une phrase en anglais, un correcteur souligne tes fautes : derrière tout cela, il y a souvent de l'intelligence artificielle.",
  objectifs: ["définir l'intelligence artificielle", "citer des exemples de la vie courante", "comprendre comment une IA apprend"],
  parties: [
    { t: "Définition", html:
      "<div class='def'><b>Définition</b>L'intelligence artificielle (IA) est l'ensemble des techniques qui permettent à une machine d'imiter certaines capacités humaines : reconnaître, comprendre, décider, produire un texte ou une image.</div><p>Une IA n'est ni vivante ni consciente : c'est un <strong>programme</strong> qui calcule très vite.</p>",
      retenir: "L'IA imite l'intelligence, elle ne pense pas comme nous." },
    { t: "Comment une IA apprend", html:
      "<p>On montre à l'IA des milliers d'<strong>exemples</strong> (des photos de mangues et d'avocats, par exemple). Elle repère des régularités puis devine la réponse pour un exemple nouveau.</p>",
      illus: { legende: "Les trois étapes : des exemples, un entraînement, une prédiction.", svg:
      "<svg viewBox='0 0 460 170' role='img' aria-label='Exemples puis entraînement puis prédiction'><defs><marker id='fi' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='7' markerHeight='7' orient='auto'><path d='M0 0l10 5-10 5z' fill='#142554'/></marker></defs><rect x='14' y='30' width='120' height='100' rx='14' fill='#E4E9F2' stroke='#0C2A6A' stroke-width='2'/><g><ellipse cx='48' cy='66' rx='16' ry='12' fill='#FFC93C'/><ellipse cx='96' cy='66' rx='16' ry='12' fill='#FFC93C'/><ellipse cx='48' cy='102' rx='12' ry='16' fill='#7FCB8C'/><ellipse cx='96' cy='102' rx='12' ry='16' fill='#7FCB8C'/></g><text x='74' y='152' text-anchor='middle' font-size='13' fill='#142554'>1. des exemples</text><path d='M140 80h40' stroke='#142554' stroke-width='2' marker-end='url(#fi)'/><rect x='186' y='30' width='100' height='100' rx='14' fill='#0C2A6A'/><g stroke='#FFC93C' stroke-width='2'><circle cx='212' cy='60' r='6' fill='none'/><circle cx='212' cy='100' r='6' fill='none'/><circle cx='260' cy='80' r='6' fill='none'/><path d='M218 60l36 18M218 100l36-18'/></g><text x='236' y='152' text-anchor='middle' font-size='13' fill='#142554'>2. l'entraînement</text><path d='M292 80h40' stroke='#142554' stroke-width='2' marker-end='url(#fi)'/><rect x='338' y='30' width='110' height='100' rx='14' fill='#E0F5E5' stroke='#00520B' stroke-width='2'/><ellipse cx='370' cy='80' rx='16' ry='12' fill='#FFC93C'/><text x='398' y='76' font-size='13' fill='#00520B' font-weight='700'>mangue</text><text x='398' y='94' font-size='12' fill='#00520B'>à 97 %</text><text x='393' y='152' text-anchor='middle' font-size='13' fill='#142554'>3. la prédiction</text></svg>" },
      retenir: "Pas d'exemples, pas d'apprentissage : l'IA dépend de ses données." },
    { t: "L'IA autour de toi", html:
      "<ul><li><strong>Assistants vocaux</strong> qui comprennent une question posée à l'oral ;</li><li><strong>traduction automatique</strong> d'un texte ;</li><li><strong>reconnaissance de visage</strong> pour déverrouiller un téléphone ;</li><li><strong>recommandations</strong> de vidéos ou de musiques ;</li><li><strong>assistants pédagogiques</strong>, comme Prof. Ambassa sur VÉRITAS.</li></ul><div class='attention'><b>Garde l'esprit critique</b>Une IA peut se tromper avec assurance. Vérifie toujours une information importante dans ton cours ou auprès d'un enseignant.</div>",
      retenir: "L'IA est un outil : utile, rapide, mais faillible." }
  ],
  revision: ["IA : techniques qui imitent des capacités humaines.", "Elle apprend à partir de nombreux exemples.", "Exemples : traduction, reconnaissance vocale, recommandations.", "Elle n'est pas consciente et peut se tromper."],
  exo: "<p>Cite trois objets ou applications de ton quotidien qui utilisent l'IA, et dis ce qu'ils « reconnaissent ».</p>",
  quiz: [
    { q: "Une IA est…", r: ["un être vivant", "un programme informatique", "un robot toujours humanoïde"], b: 1, e: "Ce sont des calculs, pas une conscience." },
    { q: "Pour apprendre, une IA a surtout besoin…", r: ["d'exemples", "de sommeil", "d'électricité solaire"], b: 0, e: "Elle repère des régularités dans les données." },
    { q: "Une réponse donnée par une IA est…", r: ["toujours juste", "à vérifier", "interdite à l'école"], b: 1, e: "Une IA peut se tromper : on vérifie." }
  ]
});

VRT_L("6e-info-composants", {
  c: "6e", m: "info", cle: "Rôles des composants de base", titre: "Les composants de base d'un micro-ordinateur", duree: 15,
  accroche: "Écran, clavier, unité centrale : qui fait quoi ?",
  intro: "Devant un ordinateur de la salle informatique, tu vois un écran, un clavier, une souris et une boîte. Chacun a un rôle précis.",
  objectifs: ["nommer les composants de base", "distinguer périphériques d'entrée et de sortie", "expliquer le rôle de l'unité centrale"],
  parties: [
    { t: "L'unité centrale, le cerveau", html:
      "<p>L'<strong>unité centrale</strong> contient le processeur (qui calcule), la mémoire vive (qui garde les données pendant le travail) et le disque de stockage (qui conserve les fichiers). Sur un ordinateur portable, tout est rangé sous le clavier.</p>",
      retenir: "L'unité centrale traite l'information." },
    { t: "Entrée, sortie", html:
      "<p>Les <strong>périphériques</strong> se branchent à l'unité centrale :</p><ul><li><strong>d'entrée</strong> : ils envoient des informations à l'ordinateur (clavier, souris, micro, scanner) ;</li><li><strong>de sortie</strong> : ils reçoivent des informations de l'ordinateur (écran, imprimante, haut-parleurs).</li></ul>",
      illus: { legende: "Les informations entrent par le clavier et la souris, sont traitées, puis sortent par l'écran et l'imprimante.", svg:
      "<svg viewBox='0 0 460 200' role='img' aria-label='Périphériques d entrée, unité centrale, périphériques de sortie'><defs><marker id='fc' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='7' markerHeight='7' orient='auto'><path d='M0 0l10 5-10 5z' fill='#0C2A6A'/></marker></defs><rect x='14' y='120' width='110' height='34' rx='6' fill='#E4E9F2' stroke='#0C2A6A' stroke-width='2'/><g fill='#8C9BC0'><rect x='22' y='127' width='12' height='8' rx='2'/><rect x='38' y='127' width='12' height='8' rx='2'/><rect x='54' y='127' width='12' height='8' rx='2'/><rect x='70' y='127' width='12' height='8' rx='2'/><rect x='86' y='127' width='12' height='8' rx='2'/><rect x='102' y='127' width='12' height='8' rx='2'/><rect x='30' y='140' width='76' height='8' rx='2'/></g><rect x='50' y='54' width='34' height='50' rx='17' fill='#E4E9F2' stroke='#0C2A6A' stroke-width='2'/><path d='M67 54v16' stroke='#0C2A6A' stroke-width='2'/><text x='69' y='182' text-anchor='middle' font-size='13' fill='#142554' font-weight='700'>ENTRÉE</text><path d='M132 104h40' stroke='#0C2A6A' stroke-width='2.5' marker-end='url(#fc)'/><rect x='182' y='40' width='92' height='130' rx='10' fill='#0C2A6A'/><rect x='196' y='56' width='64' height='10' rx='3' fill='#FFC93C'/><rect x='196' y='74' width='64' height='6' rx='3' fill='#8C9BC0'/><circle cx='228' cy='146' r='8' fill='none' stroke='#FFC93C' stroke-width='2'/><text x='228' y='190' text-anchor='middle' font-size='13' fill='#142554' font-weight='700'>UNITÉ CENTRALE</text><path d='M282 104h40' stroke='#0C2A6A' stroke-width='2.5' marker-end='url(#fc)'/><rect x='332' y='34' width='116' height='76' rx='8' fill='#E4E9F2' stroke='#0C2A6A' stroke-width='2'/><rect x='342' y='44' width='96' height='56' rx='4' fill='#DBE8FE'/><path d='M380 110v12h20v-12' fill='#8C9BC0'/><rect x='346' y='130' width='86' height='30' rx='6' fill='#E4E9F2' stroke='#0C2A6A' stroke-width='2'/><rect x='360' y='124' width='58' height='10' fill='#fff' stroke='#0C2A6A'/><text x='390' y='182' text-anchor='middle' font-size='13' fill='#142554' font-weight='700'>SORTIE</text></svg>" },
      retenir: "Entrée : vers l'ordinateur. Sortie : depuis l'ordinateur." },
    { t: "Prendre soin du matériel", html:
      "<ul><li>Éteindre l'ordinateur par le menu, pas en coupant le courant.</li><li>Pas de boisson ni de nourriture près du clavier.</li><li>Protéger le poste avec un onduleur ou un régulateur lors des coupures de courant.</li></ul>",
      retenir: "Un matériel bien traité dure plus longtemps." }
  ],
  revision: ["Unité centrale : processeur, mémoire vive, stockage.", "Entrée : clavier, souris, micro, scanner.", "Sortie : écran, imprimante, haut-parleurs.", "Éteindre proprement ; protéger des coupures."],
  exo: "<p>Classe : webcam, écran, clavier, imprimante, micro, haut-parleur. <em>(Entrée : webcam, clavier, micro. Sortie : écran, imprimante, haut-parleur.)</em></p>",
  quiz: [
    { q: "La souris est un périphérique…", r: ["d'entrée", "de sortie", "de stockage"], b: 0, e: "Elle envoie des informations à l'ordinateur." },
    { q: "Quel élément calcule dans l'unité centrale ?", r: ["L'écran", "Le processeur", "Le câble"], b: 1, e: "Le processeur exécute les instructions." },
    { q: "L'imprimante est un périphérique…", r: ["d'entrée", "de sortie", "central"], b: 1, e: "Elle reçoit les informations de l'ordinateur." }
  ]
});

/* Leçons rédigées VÉRITAS — français, histoire, géographie, ECM, philosophie. */
VRT_L("3e-fr-relative", {
  c: "3e", m: "francais", cle: "La subordonnée relative", titre: "La proposition subordonnée relative", duree: 20,
  accroche: "« Le livre que tu m'as prêté… » : la relative précise sans alourdir.",
  intro: "« Le taxi qui m'a déposé roulait vite. » Sans la partie soulignée, on ne saurait pas de quel taxi il s'agit. Cette partie est une proposition subordonnée relative.",
  objectifs: ["repérer une subordonnée relative et son antécédent", "choisir le bon pronom relatif", "distinguer relative déterminative et relative explicative"],
  parties: [
    { t: "Reconnaître la relative", html:
      "<p>La subordonnée relative :</p><ul><li>commence par un <strong>pronom relatif</strong> : qui, que, quoi, dont, où, lequel, auquel, duquel… ;</li><li>complète un nom ou un pronom placé avant elle, appelé <strong>antécédent</strong> ;</li><li>joue le rôle d'un adjectif : elle est <strong>complément de l'antécédent</strong>.</li></ul>" +
      "<div class='ex'><b>Exemple</b>Banda vend le cacao <u>que sa mère a récolté</u>. — Antécédent : <em>le cacao</em> ; pronom relatif : <em>que</em>.</div>",
      illus: { legende: "La relative s'accroche à son antécédent comme un wagon à la locomotive.", svg:
      "<svg viewBox='0 0 460 150' role='img' aria-label='Schéma : antécédent, pronom relatif, subordonnée'><rect x='10' y='40' width='130' height='50' rx='12' fill='#DBE8FE' stroke='#142554' stroke-width='2'/><text x='75' y='71' text-anchor='middle' font-size='16' font-weight='700' fill='#142554'>le cacao</text><text x='75' y='112' text-anchor='middle' font-size='12' fill='#636A80'>antécédent</text><path d='M140 65h30' stroke='#9A6F00' stroke-width='3'/><rect x='170' y='40' width='60' height='50' rx='12' fill='#FFC93C'/><text x='200' y='71' text-anchor='middle' font-size='16' font-weight='700' fill='#142554'>que</text><text x='200' y='112' text-anchor='middle' font-size='12' fill='#636A80'>pronom relatif</text><path d='M230 65h20' stroke='#9A6F00' stroke-width='3'/><rect x='250' y='40' width='200' height='50' rx='12' fill='#fff' stroke='#1E499B' stroke-width='2' stroke-dasharray='6 4'/><text x='350' y='71' text-anchor='middle' font-size='15' fill='#142554'>sa mère a récolté</text><text x='350' y='112' text-anchor='middle' font-size='12' fill='#636A80'>suite de la subordonnée</text><circle cx='60' cy='130' r='0'/></svg>" },
      retenir: "Pas d'antécédent, pas de relative : on cherche d'abord le nom complété." },
    { t: "Choisir le pronom relatif", html:
      "<div class='tab-scroll'><table><thead><tr><th>Pronom</th><th>Fonction dans la relative</th><th>Exemple</th></tr></thead><tbody>" +
      "<tr><th>qui</th><td>sujet</td><td>l'élève <u>qui</u> parle</td></tr><tr><th>que</th><td>COD</td><td>le livre <u>que</u> je lis</td></tr>" +
      "<tr><th>dont</th><td>complément introduit par « de »</td><td>l'ami <u>dont</u> je parle (parler <em>de</em>)</td></tr><tr><th>où</th><td>complément de lieu ou de temps</td><td>la ville <u>où</u> je suis né ; le jour <u>où</u> il est venu</td></tr>" +
      "<tr><th>lequel, auquel…</th><td>après une préposition</td><td>la table <u>sur laquelle</u> j'écris</td></tr></tbody></table></div>" +
      "<div class='attention'><b>Fautes fréquentes</b>« L'ami <s>que</s> je t'ai parlé » → l'ami <strong>dont</strong> je t'ai parlé. « La ville <s>que</s> j'habite dedans » → la ville <strong>où</strong> j'habite.</div>",
      retenir: "Le pronom dépend de sa fonction DANS la relative : qui sujet, que COD, dont = « de »." },
    { t: "Déterminative ou explicative ?", html:
      "<ul><li><strong>Déterminative</strong> : indispensable, elle identifie l'antécédent. Pas de virgule. <em>Les élèves qui ont fini peuvent sortir.</em> (seulement ceux-là)</li><li><strong>Explicative</strong> : on peut la supprimer ; elle ajoute une précision. Entre virgules. <em>Les élèves, qui ont fini, peuvent sortir.</em> (tous ont fini)</li></ul>",
      retenir: "La virgule change le sens : elle transforme une sélection en simple explication." }
  ],
  revision: ["La relative complète un antécédent (nom ou pronom).", "Elle commence par un pronom relatif.", "qui = sujet ; que = COD ; dont = complément en « de » ; où = lieu/temps.", "lequel, auquel, duquel après une préposition.", "Déterminative sans virgule ; explicative entre virgules."],
  exo: "<p>Complète avec le bon pronom : 1. Voici la case ___ je suis né. 2. C'est un roman ___ tout le monde parle. 3. Le cacao ___ Banda transporte est lourd. <em>(où ; dont ; que)</em></p>",
  quiz: [
    { q: "« L'homme ___ je te parle est mon oncle. »", r: ["que", "dont", "qui"], b: 1, e: "On parle DE quelqu'un : dont." },
    { q: "Dans « la route qui mène à Tanga », qui est…", r: ["sujet de mène", "COD de mène", "antécédent"], b: 0, e: "Qui mène ? la route : qui est sujet." },
    { q: "Quelle relative est explicative ?", r: ["Les fruits qui sont mûrs tombent.", "Les fruits, qui sont mûrs, tombent.", "Les fruits que je cueille."], b: 1, e: "Entre virgules, elle peut être supprimée." },
    { q: "« La table sur ___ je pose mon cahier. »", r: ["que", "laquelle", "dont"], b: 1, e: "Après une préposition : lequel, laquelle…" }
  ],
  examen: { t: "Grammaire au BEPC : sujets corrigés", href: "/corriges/" }
});

VRT_L("3e-fr-ville-cruelle", {
  c: "3e", m: "francais", cle: "Ville Cruelle d", titre: "Lecture suivie : Ville cruelle d'Eza Boto", duree: 25,
  scenes: ["ville-cruelle-deux-cents-kilos"],
  accroche: "Une journée à Tanga, deux cents kilos de cacao, une ville qui broie les faibles.",
  intro: "Un jeune paysan porte le cacao de toute une année à la ville pour gagner de quoi se marier. En une journée, Tanga va tout lui prendre… ou presque. Voici les repères pour suivre l'œuvre en classe.",
  objectifs: ["situer l'auteur et l'œuvre", "suivre la structure du récit", "dégager les grands thèmes"],
  parties: [
    { t: "L'auteur et l'œuvre", html:
      "<p><strong>Eza Boto</strong> est le premier pseudonyme d'<strong>Alexandre Biyidi Awala</strong>, plus connu sous le nom de <strong>Mongo Beti</strong> (1932-2001), écrivain camerounais né près de Mbalmayo. <em>Ville cruelle</em>, son premier roman, paraît en 1954 aux éditions Présence Africaine.</p><p>Le roman se compose de <strong>treize chapitres et d'un épilogue</strong>. L'action se passe « un matin de février 193… », pendant la période coloniale.</p>",
      retenir: "Eza Boto = Mongo Beti ; Ville cruelle, 1954, 13 chapitres + épilogue." },
    { t: "Les lieux et les personnages", html:
      "<p><strong>Tanga</strong> est une ville coupée en deux : <strong>Tanga-Sud</strong>, le quartier des commerçants et de l'administration coloniale, et <strong>Tanga-Nord</strong>, où vivent les Africains, dans des quartiers comme Moko. Le village de Banda s'appelle <strong>Bamila</strong>.</p>" +
      "<ul><li><strong>Banda</strong> : jeune paysan orgueilleux et révolté, fils unique d'une mère malade ;</li><li><strong>la mère de Banda</strong> : son seul lien avec le village, elle veut le voir marié avant de mourir ;</li><li><strong>Odilia</strong> et son frère <strong>Koumé</strong> : avec d'autres ouvriers, Koumé a malmené son patron blanc qui refusait de les payer ; il est en fuite ;</li><li><strong>les Grecs</strong> (commerçants qui achètent le cacao), <strong>les contrôleurs</strong> et <strong>les gardes régionaux</strong> : le système colonial et ses relais ;</li><li><strong>Tonga</strong>, vieillard de Bamila, et l'oncle tailleur de Tanga.</li></ul>",
      illus: { legende: "Schéma du parcours de Banda : de Bamila à Tanga, puis le retour.", svg:
      "<svg viewBox='0 0 460 190' role='img' aria-label='Parcours de Banda entre Bamila et Tanga'><rect x='10' y='20' width='130' height='120' rx='16' fill='#E0F5E5' stroke='#00520B' stroke-width='2'/><text x='75' y='50' text-anchor='middle' font-size='16' font-weight='700' fill='#00520B'>BAMILA</text><text x='75' y='72' text-anchor='middle' font-size='12' fill='#142554'>le village</text><text x='75' y='90' text-anchor='middle' font-size='12' fill='#142554'>la mère, Tonga</text><text x='75' y='108' text-anchor='middle' font-size='12' fill='#142554'>la plantation</text><rect x='300' y='20' width='150' height='56' rx='12' fill='#E4E9F2' stroke='#0C2A6A' stroke-width='2'/><text x='375' y='44' text-anchor='middle' font-size='15' font-weight='700' fill='#0C2A6A'>TANGA-SUD</text><text x='375' y='64' text-anchor='middle' font-size='12' fill='#142554'>Grecs, Contrôle, Blancs</text><rect x='300' y='86' width='150' height='56' rx='12' fill='#FFF3E4' stroke='#A84200' stroke-width='2'/><text x='375' y='110' text-anchor='middle' font-size='15' font-weight='700' fill='#A84200'>TANGA-NORD</text><text x='375' y='130' text-anchor='middle' font-size='12' fill='#142554'>Moko, Odilia, Koumé</text><path d='M140 60 C200 30 250 30 296 46' fill='none' stroke='#142554' stroke-width='2.5' stroke-dasharray='7 5'/><path d='M296 120 C250 160 190 160 140 110' fill='none' stroke='#9A6F00' stroke-width='2.5' stroke-dasharray='7 5'/><text x='218' y='28' text-anchor='middle' font-size='12' fill='#142554'>l'aller : 200 kg de cacao</text><text x='218' y='176' text-anchor='middle' font-size='12' fill='#9A6F00'>le retour, de nuit, avec Odilia</text></svg>" },
      retenir: "Ville coupée en deux : la géographie de Tanga montre déjà l'injustice." },
    { t: "L'intrigue en quatre temps", html:
      "<ol><li><strong>L'humiliation</strong> : au Contrôle, son cacao est déclaré « mauvais » et jeté au feu ; Banda s'en prend aux hommes du contrôleur, les gardes régionaux le frappent et le conduisent au commissariat. Il repart sans argent, l'œil poché.</li><li><strong>La rencontre</strong> : dans la nuit, il croise Odilia, qui cherche son frère Koumé, poursuivi après la révolte des ouvriers contre leur patron.</li><li><strong>La mort de Koumé</strong> : Koumé meurt ; Banda remet à Odilia l'argent trouvé sur son frère et la conduit chez sa mère, à Bamila.</li><li><strong>Le dénouement</strong> : Banda retrouve dans une rigole la petite valise perdue par un couple de commerçants grecs ; il la rend et reçoit dix billets de mille francs. Dans l'épilogue, après la mort de sa mère, il annonce qu'il ira s'installer à Fort-Nègre.</li></ol>",
      retenir: "Une seule journée suffit pour que la ville broie Banda… et le transforme." },
    { t: "Les grands thèmes", html:
      "<ul><li><strong>L'injustice coloniale</strong> : contrôle arbitraire du cacao, violence des gardes, exploitation par les commerçants.</li><li><strong>La ville et le village</strong> : Tanga attire et détruit ; Bamila protège mais étouffe (le poids des vieillards).</li><li><strong>La révolte individuelle</strong> : Banda et Koumé refusent de se soumettre.</li><li><strong>La mère</strong> : figure de l'attachement et du devoir.</li></ul>",
      retenir: "Pour une rédaction : un thème = une idée + un épisode précis du roman." }
  ],
  revision: ["Eza Boto, pseudonyme de Mongo Beti ; roman paru en 1954.", "Tanga-Sud (colons, commerce) / Tanga-Nord (Africains) ; village : Bamila.", "Banda perd son cacao au Contrôle, rencontre Odilia, rend la valise perdue par des Grecs.", "Épilogue : mort de la mère, départ pour Fort-Nègre.", "Thèmes : injustice coloniale, ville/village, révolte, la mère."],
  exo: "<p>En cinq lignes, explique pourquoi le titre <em>Ville cruelle</em> convient au roman. Appuie-toi sur deux épisodes précis.</p>",
  quiz: [
    { q: "Qui se cache derrière le pseudonyme Eza Boto ?", r: ["Ferdinand Oyono", "Mongo Beti", "Guillaume Oyono Mbia"], b: 1, e: "Alexandre Biyidi Awala, dit Mongo Beti." },
    { q: "Pourquoi Banda va-t-il à Tanga ?", r: ["Pour étudier", "Pour vendre son cacao", "Pour chercher Koumé"], b: 1, e: "Il veut gagner l'argent de son mariage." },
    { q: "Dans quel quartier vivent les Africains ?", r: ["Tanga-Sud", "Tanga-Nord", "Bamila"], b: 1, e: "Tanga-Sud est le quartier des commerçants et des colons." },
    { q: "Où Banda part-il vivre à la fin ?", r: ["À Tanga", "À Fort-Nègre", "Il reste à Bamila"], b: 1, e: "C'est l'épilogue, après la mort de sa mère." }
  ]
});

VRT_L("3e-hist-partage", {
  c: "3e", m: "histoire", cle: "Conquête et partage de l", titre: "La conquête et le partage de l'Afrique", duree: 20,
  scenes: ["1re-histoire-conference-de-berlin", "histoire-douala-1884"],
  accroche: "1884 : autour d'une table à Berlin, l'Europe se partage un continent.",
  intro: "En 1880, les Européens ne contrôlent que des côtes africaines. En 1914, seuls deux États africains restent indépendants. Que s'est-il passé en trente ans ?",
  objectifs: ["expliquer les causes de la conquête", "présenter la conférence de Berlin", "décrire le partage du continent"],
  parties: [
    { t: "Pourquoi conquérir l'Afrique ?", html:
      "<ul><li><strong>Causes économiques</strong> : l'industrie européenne a besoin de matières premières (caoutchouc, huile de palme, cacao, minerais) et de nouveaux marchés.</li><li><strong>Causes politiques</strong> : puissance et prestige des nations ; rivalités entre la France, la Grande-Bretagne et l'Allemagne.</li><li><strong>Causes idéologiques et religieuses</strong> : prétendue « mission civilisatrice », action des missionnaires.</li><li><strong>Moyens</strong> : explorations, armes modernes, médicaments contre le paludisme (quinine), bateaux à vapeur.</li></ul>",
      retenir: "Économie, puissance, idéologie : trois familles de causes." },
    { t: "La conférence de Berlin (1884-1885)", html:
      "<p>Réunie à Berlin du <strong>15 novembre 1884 au 26 février 1885</strong> à l'initiative du chancelier allemand <strong>Bismarck</strong>, elle rassemble les puissances européennes et les États-Unis. <strong>Aucun Africain n'y est invité.</strong></p><ul><li>Liberté de navigation sur les fleuves <strong>Congo</strong> et <strong>Niger</strong>.</li><li>Règle de l'<strong>occupation effective</strong> : pour revendiquer un territoire, il faut l'occuper réellement.</li><li>Obligation de <strong>notifier</strong> aux autres puissances toute nouvelle prise de possession.</li></ul>",
      illus: { legende: "Frise : du traité germano-douala à la Première Guerre mondiale.", svg:
      "<svg viewBox='0 0 460 150' role='img' aria-label='Frise chronologique 1884 à 1914'><line x1='20' y1='70' x2='440' y2='70' stroke='#142554' stroke-width='3'/><g fill='#FFC93C' stroke='#142554' stroke-width='2'><circle cx='40' cy='70' r='8'/><circle cx='70' cy='70' r='8'/><circle cx='250' cy='70' r='8'/><circle cx='420' cy='70' r='8'/></g><g font-size='13' font-weight='700' fill='#142554' text-anchor='middle'><text x='40' y='50'>1884</text><text x='88' y='104'>1884-85</text><text x='250' y='50'>1896</text><text x='420' y='50'>1914</text></g><g font-size='11.5' fill='#636A80' text-anchor='middle'><text x='40' y='30'>traité de Douala</text><text x='88' y='120'>conférence de Berlin</text><text x='250' y='30'>Adoua : l'Éthiopie résiste</text><text x='408' y='104'>seuls l'Éthiopie et</text><text x='408' y='120'>le Libéria indépendants</text></g></svg>" },
      retenir: "Berlin ne partage pas l'Afrique sur une carte : il fixe les RÈGLES du partage." },
    { t: "Le partage du continent", html:
      "<p>Après Berlin, c'est la « course au clocher » : traités signés avec des chefs, expéditions militaires, frontières tracées souvent en lignes droites, sans tenir compte des peuples. La France et la Grande-Bretagne obtiennent les plus grands ensembles ; l'Allemagne prend le Kamerun, le Togo, le Sud-Ouest africain et l'Afrique orientale allemande.</p><p>Les Africains résistent (Samory Touré, Béhanzin, Menelik II…). En 1914, seuls l'<strong>Éthiopie</strong> et le <strong>Libéria</strong> restent indépendants.</p>",
      retenir: "Des frontières tracées par d'autres : un héritage encore visible aujourd'hui." }
  ],
  revision: ["Causes : économiques, politiques, idéologiques.", "Conférence de Berlin : 15 nov. 1884 – 26 fév. 1885, convoquée par Bismarck.", "Règles : occupation effective, notification, libre navigation Congo-Niger.", "Aucun Africain présent.", "1914 : seuls l'Éthiopie et le Libéria indépendants."],
  exo: "<p>Rédige un paragraphe argumenté (8 lignes) : « La conférence de Berlin a-t-elle partagé l'Afrique ? »</p>",
  quiz: [
    { q: "Qui convoque la conférence de Berlin ?", r: ["Napoléon III", "Bismarck", "La reine Victoria"], b: 1, e: "Le chancelier allemand Otto von Bismarck." },
    { q: "Que signifie l'occupation effective ?", r: ["Occuper réellement le territoire revendiqué", "Acheter le territoire", "Le visiter une fois"], b: 0, e: "Une simple revendication ne suffit plus." },
    { q: "Combien d'Africains participent à la conférence ?", r: ["Aucun", "Dix", "Un par royaume"], b: 0, e: "Le continent est partagé sans ses peuples." },
    { q: "Quels pays restent indépendants en 1914 ?", r: ["Égypte et Maroc", "Éthiopie et Libéria", "Cameroun et Togo"], b: 1, e: "L'Éthiopie a vaincu l'Italie à Adoua en 1896." }
  ],
  examen: { t: "Histoire au BEPC : sujets corrigés", href: "/corriges/" }
});

VRT_L("3e-hist-kamerun", {
  c: "3e", m: "histoire", cle: "Le Cameroun allemand", titre: "Le Cameroun allemand (1884-1916)", duree: 20,
  scenes: ["histoire-douala-1884", "3e-histoire-conference-de-foumban"],
  accroche: "12 juillet 1884 : un traité signé à Douala fait naître le Kamerun.",
  intro: "Pendant trente-deux ans, le Cameroun est une colonie allemande : le Kamerun. Cette période laisse des routes, des plantations, des chemins de fer… et le souvenir de résistances héroïques.",
  objectifs: ["dater et expliquer la naissance du protectorat", "décrire l'exploitation allemande", "présenter les résistances et la fin de la colonie"],
  parties: [
    { t: "La naissance du Kamerun", html:
      "<p>Le <strong>12 juillet 1884</strong>, les rois douala <strong>Ndumbé Lobé Bell</strong> et <strong>Ngando Akwa</strong> signent un traité avec des représentants de maisons de commerce allemandes. Le <strong>14 juillet 1884</strong>, l'explorateur <strong>Gustav Nachtigal</strong> hisse le drapeau allemand : c'est le début du protectorat.</p><p>Les Douala avaient posé des conditions (garder leurs terres et leur rôle d'intermédiaires du commerce) ; elles ne seront pas respectées.</p>",
      retenir: "12 juillet 1884 : traité germano-douala." },
    { t: "Exploiter le territoire", html:
      "<ul><li><strong>Plantations</strong> autour du mont Cameroun (cacao, banane, hévéa), avec un travail forcé très dur.</li><li><strong>Voies de communication</strong> : chemin de fer du Nord (Douala-Nkongsamba) et du Centre (vers Eséka), routes, wharfs.</li><li><strong>Administration</strong> : capitale à Buea, puis à Douala ; gouverneurs comme Jesko von Puttkamer.</li><li>En 1911, l'accord franco-allemand agrandit la colonie vers l'est et le sud (le « Neukamerun »).</li></ul>",
      illus: { legende: "Repères du Kamerun : naissance, expansion, résistances, fin.", svg:
      "<svg viewBox='0 0 460 150' role='img' aria-label='Frise du Cameroun allemand'><line x1='20' y1='72' x2='440' y2='72' stroke='#A84200' stroke-width='4'/><g fill='#FFC93C' stroke='#6B2A00' stroke-width='2'><circle cx='30' cy='72' r='8'/><circle cx='280' cy='72' r='8'/><circle cx='355' cy='72' r='8'/><circle cx='430' cy='72' r='8'/></g><g font-size='13' font-weight='700' fill='#142554' text-anchor='middle'><text x='36' y='52'>1884</text><text x='280' y='52'>1911</text><text x='355' y='104'>1914</text><text x='424' y='52'>1916</text></g><g font-size='11.5' fill='#636A80' text-anchor='middle'><text x='60' y='32'>traité germano-douala</text><text x='280' y='32'>Neukamerun</text><text x='355' y='122'>Rudolf Duala Manga Bell</text><text x='355' y='138'>et Martin-Paul Samba exécutés</text><text x='410' y='32'>départ des Allemands</text></g></svg>" },
      retenir: "Infrastructures réelles, mais construites par le travail forcé." },
    { t: "Résister, puis tourner la page", html:
      "<p>Plusieurs peuples résistent par les armes ou par le droit. En <strong>1914</strong>, <strong>Rudolf Duala Manga Bell</strong>, qui contestait l'expropriation des terres douala, est pendu ; <strong>Martin-Paul Samba</strong> est fusillé. Pendant la Première Guerre mondiale, les troupes franco-britanniques chassent les Allemands : la colonie disparaît en <strong>1916</strong>, puis le territoire est partagé entre la France et la Grande-Bretagne.</p>",
      retenir: "1916 : fin du Kamerun ; Manga Bell et Samba, héros nationaux." }
  ],
  revision: ["12 juillet 1884 : traité germano-douala ; 14 juillet : drapeau hissé par Nachtigal.", "Plantations, chemins de fer, travail forcé.", "1911 : Neukamerun.", "1914 : exécution de Rudolf Duala Manga Bell et Martin-Paul Samba.", "1916 : fin de la présence allemande."],
  exo: "<p>Présente en dix lignes l'œuvre allemande au Cameroun : ce qu'elle a construit et ce qu'elle a coûté aux populations.</p>",
  quiz: [
    { q: "Quand est signé le traité germano-douala ?", r: ["12 juillet 1884", "1er janvier 1960", "1916"], b: 0, e: "Deux jours avant que Nachtigal hisse le drapeau." },
    { q: "Rudolf Duala Manga Bell s'opposait…", r: ["à l'expropriation des terres douala", "à la construction des écoles", "aux missionnaires seulement"], b: 0, e: "Il fut pendu en 1914." },
    { q: "Quand les Allemands quittent-ils le Cameroun ?", r: ["1884", "1916", "1945"], b: 1, e: "Chassés pendant la Première Guerre mondiale." }
  ]
});

VRT_L("3e-geo-cameroun", {
  c: "3e", m: "geo", cle: "Présentation générale du Cameroun", titre: "Présentation générale du Cameroun", duree: 15,
  accroche: "Mer, forêt, montagnes, savane, Sahel : l'Afrique en miniature.",
  intro: "On surnomme le Cameroun « l'Afrique en miniature » : on y trouve presque tous les paysages du continent, de la mer au désert. Découvre sa carte d'identité.",
  objectifs: ["situer le Cameroun", "donner ses chiffres clés", "nommer les grandes régions naturelles"],
  parties: [
    { t: "Situation et limites", html:
      "<p>Le Cameroun est situé en Afrique centrale, au fond du <strong>golfe de Guinée</strong>, entre environ 2° et 13° de latitude Nord. Il partage ses frontières avec le <strong>Nigeria</strong> à l'ouest, le <strong>Tchad</strong> au nord-est, la <strong>République centrafricaine</strong> à l'est, le <strong>Congo</strong>, le <strong>Gabon</strong> et la <strong>Guinée équatoriale</strong> au sud. Il s'ouvre sur l'océan Atlantique au sud-ouest.</p>",
      retenir: "Six voisins et une façade maritime sur l'Atlantique." },
    { t: "Chiffres clés", html:
      "<ul><li>Superficie : environ <strong>475 650 km²</strong>.</li><li><strong>10 régions</strong> ; capitale politique <strong>Yaoundé</strong>, capitale économique <strong>Douala</strong>.</li><li>Deux langues officielles : le <strong>français</strong> et l'<strong>anglais</strong> ; plus de 250 langues nationales.</li><li>Une population jeune, en forte croissance.</li></ul>",
      retenir: "Deux langues officielles, dix régions, deux grandes métropoles." },
    { t: "Les grandes régions naturelles", html:
      "<p>Du sud au nord, on traverse :</p><ol><li>la <strong>plaine côtière</strong> (mangroves, Douala) ;</li><li>le <strong>plateau sud-camerounais</strong>, couvert de forêt dense ;</li><li>les <strong>hautes terres de l'Ouest</strong> (volcans, mont Cameroun, sols fertiles) ;</li><li>le <strong>plateau de l'Adamaoua</strong>, château d'eau du pays ;</li><li>les <strong>basses terres du Nord</strong> et les <strong>monts Mandara</strong>, jusqu'au lac Tchad.</li></ol>",
      illus: { legende: "Coupe simplifiée du sud au nord (échelles non respectées).", svg:
      "<svg viewBox='0 0 460 190' role='img' aria-label='Coupe schématique du relief camerounais du sud au nord'><path d='M10 160 L60 158 L90 150 L150 120 L180 70 L200 90 L240 96 L270 80 L320 82 L350 120 L400 140 L420 110 L440 150 L450 160 Z' fill='#E0F5E5' stroke='#00520B' stroke-width='2'/><path d='M10 160 h40' stroke='#1E499B' stroke-width='6'/><g font-size='11' fill='#142554' text-anchor='middle'><text x='40' y='182'>plaine côtière</text><text x='120' y='182'>plateau sud</text><text x='190' y='60'>hautes terres de l'Ouest</text><text x='295' y='70'>Adamaoua</text><text x='370' y='182'>basses terres</text><text x='420' y='100'>Mandara</text></g><text x='10' y='20' font-size='12' fill='#636A80'>SUD</text><text x='420' y='20' font-size='12' fill='#636A80'>NORD</text><path d='M40 24 H410' stroke='#636A80' stroke-dasharray='4 5'/></svg>" },
      retenir: "Cinq grands ensembles naturels, une diversité qui fait la richesse du pays." }
  ],
  revision: ["Afrique centrale, fond du golfe de Guinée.", "Six pays voisins + l'Atlantique.", "Environ 475 650 km², 10 régions.", "Yaoundé (politique), Douala (économique).", "Plaine côtière, plateau sud, hautes terres de l'Ouest, Adamaoua, basses terres du Nord."],
  exo: "<p>Sur une carte muette, place les six pays voisins, Yaoundé, Douala et le lac Tchad.</p>",
  quiz: [
    { q: "Quelle est la capitale économique ?", r: ["Yaoundé", "Douala", "Garoua"], b: 1, e: "Yaoundé est la capitale politique." },
    { q: "Combien de régions compte le Cameroun ?", r: ["8", "10", "12"], b: 1, e: "Dix régions administratives." },
    { q: "Quel plateau est appelé « château d'eau » ?", r: ["L'Adamaoua", "Le plateau sud", "La plaine côtière"], b: 0, e: "De nombreux fleuves y prennent leur source." }
  ]
});

VRT_L("3e-geo-mangrove", {
  c: "3e", m: "geo", cle: "La mangrove", titre: "Dossier : la mangrove", duree: 15,
  scenes: ["3e-geo-mangrove-douala"],
  accroche: "Des arbres les pieds dans l'eau salée, une nurserie pour les poissons.",
  intro: "Le long de la côte, autour de Douala, des forêts poussent les pieds dans l'eau salée. Cette mangrove est précieuse… et menacée.",
  objectifs: ["décrire la mangrove", "expliquer son utilité", "proposer des solutions pour la protéger"],
  parties: [
    { t: "Une forêt entre terre et mer", html:
      "<p>La <strong>mangrove</strong> est une forêt qui pousse dans les zones de balancement des marées, là où l'eau douce des fleuves rencontre l'eau salée. Ses arbres, les <strong>palétuviers</strong>, tiennent sur des <strong>racines-échasses</strong> et respirent grâce à des racines qui sortent de la vase.</p><p>Au Cameroun, on la trouve surtout dans l'estuaire du Wouri (Douala-Edéa) et vers Rio del Rey.</p>",
      illus: { legende: "Les racines-échasses retiennent la vase et abritent les jeunes poissons.", svg:
      "<svg viewBox='0 0 460 200' role='img' aria-label='Coupe d une mangrove'><rect x='0' y='120' width='460' height='80' fill='#DBE8FE'/><path d='M0 120 Q115 112 230 120 T460 120' fill='none' stroke='#1E499B' stroke-width='2'/><rect x='0' y='175' width='460' height='25' fill='#C9A97A'/><g fill='#7FCB8C' stroke='#00520B' stroke-width='2'><ellipse cx='120' cy='50' rx='70' ry='34'/><ellipse cx='320' cy='56' rx='80' ry='36'/></g><g stroke='#6B2A00' stroke-width='4' fill='none' stroke-linecap='round'><path d='M120 70v50'/><path d='M120 100 Q90 130 80 178M120 100 Q150 130 160 178M120 110 Q105 145 102 178M120 110 Q135 145 140 178'/><path d='M320 76v44'/><path d='M320 100 Q285 135 276 178M320 100 Q355 135 366 178M320 112 Q305 150 302 178M320 112 Q338 150 342 178'/></g><g fill='#FFC93C'><path d='M200 150 l12 -5 v10 z'/><ellipse cx='194' cy='150' rx='9' ry='4'/><path d='M240 160 l10 -4 v8 z'/><ellipse cx='235' cy='160' rx='7' ry='3'/></g><text x='12' y='140' font-size='12' fill='#1E499B'>eau saumâtre (marée)</text><text x='12' y='192' font-size='12' fill='#6B2A00'>vase</text><text x='170' y='110' font-size='12' fill='#00520B'>racines-échasses</text></svg>" },
      retenir: "Palétuviers + racines-échasses + eau saumâtre = mangrove." },
    { t: "Pourquoi la mangrove est précieuse", html:
      "<ul><li><strong>Frayère</strong> : poissons, crevettes et crabes s'y reproduisent.</li><li><strong>Protection</strong> du littoral contre l'érosion et les tempêtes.</li><li><strong>Ressources</strong> pour les riverains : pêche, bois, plantes médicinales.</li><li>Elle stocke beaucoup de <strong>carbone</strong> et aide à lutter contre le réchauffement climatique.</li></ul>",
      retenir: "Sans mangrove, moins de poissons et une côte plus fragile." },
    { t: "Menaces et solutions", html:
      "<p><strong>Menaces</strong> : coupe du bois pour fumer le poisson, extension de la ville de Douala, déchets plastiques, pollution industrielle et pétrolière.</p><p><strong>Solutions</strong> : reboisement de palétuviers, fumoirs améliorés qui consomment moins de bois, aires protégées, ramassage des déchets, sensibilisation des riverains.</p>",
      retenir: "Protéger la mangrove, c'est protéger la pêche et les familles qui en vivent." }
  ],
  revision: ["Forêt littorale des zones de marée, eau saumâtre.", "Palétuviers à racines-échasses.", "Rôles : frayère, protection de la côte, ressources, carbone.", "Menaces : bois de fumage, urbanisation, pollution.", "Solutions : reboisement, fumoirs améliorés, aires protégées."],
  exo: "<p>Rédige une affiche de sensibilisation (5 phrases) destinée aux pêcheurs de l'estuaire du Wouri.</p>",
  quiz: [
    { q: "Comment s'appellent les arbres de la mangrove ?", r: ["Palétuviers", "Baobabs", "Fromagers"], b: 0, e: "Ils supportent l'eau salée." },
    { q: "Quel rôle joue la mangrove pour les poissons ?", r: ["Frayère", "Désert", "Barrage"], b: 0, e: "Les jeunes poissons y grandissent à l'abri." },
    { q: "Une menace directe de la mangrove au Cameroun :", r: ["La coupe de bois pour le fumage", "La neige", "Le tourisme spatial"], b: 0, e: "Le fumage du poisson consomme beaucoup de bois." }
  ]
});

VRT_L("3e-ecm-democratie", {
  c: "3e", m: "ecm", cle: "Les Fondements de la Démocratie", titre: "Les fondements de la démocratie", duree: 15,
  accroche: "Qui décide ? Le peuple. Comment ? C'est tout l'enjeu.",
  intro: "Élire un délégué de classe, voter une loi, critiquer un dirigeant sans aller en prison : tout cela repose sur les fondements de la démocratie.",
  objectifs: ["définir la démocratie", "citer ses principes fondamentaux", "distinguer ses formes"],
  parties: [
    { t: "Définition", html:
      "<p>Le mot vient du grec <em>dêmos</em> (le peuple) et <em>kratos</em> (le pouvoir). Le président américain Abraham Lincoln l'a résumée ainsi : « le gouvernement du peuple, par le peuple, pour le peuple ».</p>",
      retenir: "En démocratie, le pouvoir appartient au peuple." },
    { t: "Les piliers de la démocratie", html:
      "<ul><li><strong>La souveraineté du peuple</strong>, exprimée par des élections libres, régulières et transparentes.</li><li><strong>La séparation des pouvoirs</strong> (législatif, exécutif, judiciaire), théorisée par Montesquieu.</li><li><strong>L'État de droit</strong> : gouvernants et gouvernés obéissent aux mêmes lois.</li><li><strong>Les libertés fondamentales</strong> : expression, presse, réunion, association.</li><li><strong>Le pluralisme</strong> : plusieurs partis et opinions peuvent exister.</li></ul>",
      illus: { legende: "Les trois pouvoirs séparés se contrôlent mutuellement.", svg:
      "<svg viewBox='0 0 460 200' role='img' aria-label='Les trois pouvoirs'><path d='M230 18 L430 70 H30 Z' fill='#FFF6DA' stroke='#6B4E00' stroke-width='2'/><text x='230' y='60' text-anchor='middle' font-size='15' font-weight='700' fill='#6B4E00'>LE PEUPLE SOUVERAIN</text><g fill='#FFC93C' stroke='#6B4E00' stroke-width='2'><rect x='50' y='78' width='26' height='92'/><rect x='217' y='78' width='26' height='92'/><rect x='384' y='78' width='26' height='92'/></g><rect x='20' y='170' width='420' height='14' fill='#D9A21B'/><g font-size='13' font-weight='700' fill='#142554' text-anchor='middle'><text x='63' y='198'>LÉGISLATIF</text><text x='230' y='198'>EXÉCUTIF</text><text x='397' y='198'>JUDICIAIRE</text></g><g font-size='11' fill='#636A80' text-anchor='middle'><text x='130' y='120'>vote les lois</text><text x='300' y='120'>applique les lois</text><text x='330' y='150'>juge</text></g></svg>" },
      retenir: "Élections, séparation des pouvoirs, État de droit, libertés, pluralisme." },
    { t: "Les formes de démocratie", html:
      "<ul><li><strong>Directe</strong> : les citoyens votent eux-mêmes les décisions (Athènes antique).</li><li><strong>Représentative</strong> : ils élisent des représentants (députés, sénateurs, conseillers municipaux).</li><li><strong>Semi-directe</strong> : représentation + référendum.</li></ul><p>Au Cameroun, la Constitution organise une démocratie représentative, avec la possibilité du référendum.</p>",
      retenir: "Aujourd'hui, la plupart des démocraties sont représentatives." }
  ],
  revision: ["Démocratie : pouvoir du peuple (dêmos + kratos).", "Formule de Lincoln.", "Piliers : élections, séparation des pouvoirs, État de droit, libertés, pluralisme.", "Formes : directe, représentative, semi-directe."],
  exo: "<p>Montre, à partir de l'élection du délégué de ta classe, trois principes démocratiques respectés (ou non).</p>",
  quiz: [
    { q: "Que signifie « kratos » ?", r: ["le peuple", "le pouvoir", "la loi"], b: 1, e: "Dêmos = peuple ; kratos = pouvoir." },
    { q: "Qui a théorisé la séparation des pouvoirs ?", r: ["Montesquieu", "Lincoln", "Bismarck"], b: 0, e: "Dans De l'esprit des lois (1748)." },
    { q: "Élire des députés relève de la démocratie…", r: ["directe", "représentative", "monarchique"], b: 1, e: "On confie le pouvoir à des représentants." }
  ]
});

VRT_L("3e-ecm-sieges", {
  c: "3e", m: "ecm", cle: "Calcul des sièges", titre: "TP : calculer les sièges au scrutin proportionnel", duree: 20,
  scenes: ["3e-ecm-election-proportionnelle"],
  accroche: "4 listes, 7 sièges, 12 000 voix : à toi de répartir.",
  intro: "Dans un scrutin proportionnel, chaque liste obtient un nombre de sièges proportionnel à ses voix. Mais comment faire quand la division ne tombe pas juste ? Voici une méthode.",
  objectifs: ["calculer un quotient électoral", "attribuer les sièges au quotient", "répartir les sièges restants"],
  parties: [
    { t: "Le quotient électoral", html:
      "<p class='formule'>quotient électoral = suffrages exprimés ÷ nombre de sièges</p><div class='ex'><b>Exemple</b>12 000 suffrages exprimés, 6 sièges : quotient = 12 000 ÷ 6 = <strong>2 000</strong> voix pour un siège.</div>",
      retenir: "On compte les suffrages exprimés : bulletins nuls et blancs exclus." },
    { t: "Répartir les sièges", html:
      "<ol><li>Chaque liste reçoit autant de sièges que de fois le quotient dans ses voix (partie entière).</li><li>Les sièges restants vont aux listes qui ont les <strong>plus forts restes</strong>.</li></ol><div class='tab-scroll'><table><thead><tr><th>Liste</th><th>Voix</th><th>Sièges au quotient</th><th>Reste</th><th>Total</th></tr></thead><tbody><tr><th>A</th><td>5 300</td><td>2</td><td>1 300</td><td><b>3</b></td></tr><tr><th>B</th><td>3 900</td><td>1</td><td>1 900</td><td><b>2</b></td></tr><tr><th>C</th><td>1 800</td><td>0</td><td>1 800</td><td><b>1</b></td></tr><tr><th>D</th><td>1 000</td><td>0</td><td>1 000</td><td>0</td></tr></tbody></table></div><p>3 sièges sont attribués au quotient ; les 3 restants vont aux plus forts restes : B (1 900), C (1 800), A (1 300).</p>",
      retenir: "Quotient d'abord, plus forts restes ensuite." },
    { t: "Et au Cameroun ?", html:
      "<p>Le Code électoral camerounais (loi de 2012) combine, pour les législatives et les municipales, le scrutin <strong>majoritaire</strong> et la <strong>représentation proportionnelle</strong>, avec des règles particulières (prime à la liste arrivée en tête, seuil de voix). Ton enseignant précisera les règles en vigueur ; la méthode du quotient reste la base du calcul.</p>",
      retenir: "Toujours lire le texte de loi avant de calculer : les règles varient." }
  ],
  revision: ["Quotient = suffrages exprimés ÷ sièges.", "Sièges au quotient = partie entière de voix ÷ quotient.", "Sièges restants aux plus forts restes.", "Au Cameroun : système mixte (majoritaire + proportionnel)."],
  exo: "<p>5 sièges ; 10 000 exprimés ; A 4 700, B 3 100, C 2 200. Répartis les sièges. <em>(Quotient 2 000 ; A 2, B 1, C 1 au quotient ; reste : 1 siège pour le plus fort reste, B (1 100) → A 2, B 2, C 1.)</em></p>",
  quiz: [
    { q: "9 000 suffrages exprimés, 3 sièges : quotient ?", r: ["3 000", "9 000", "300"], b: 0, e: "9 000 ÷ 3 = 3 000." },
    { q: "Les bulletins blancs comptent-ils dans les suffrages exprimés ?", r: ["Oui", "Non"], b: 1, e: "Seuls les bulletins valables pour une liste comptent." },
    { q: "Après le quotient, les sièges restants vont…", r: ["au hasard", "aux plus forts restes", "toujours à la première liste"], b: 1, e: "C'est la méthode des plus forts restes." }
  ]
});

VRT_L("tle-philo-passions", {
  c: "Tle A", m: "philo", cle: "Les passions : définition", titre: "Les passions : définition et manifestations", duree: 25,
  scenes: ["tle-philo-passion-raison"],
  accroche: "La passion fait-elle notre grandeur ou notre esclavage ?",
  intro: "On dit d'un footballeur qu'il est « passionné », d'un jaloux qu'il est « aveuglé par la passion ». Le même mot désigne-t-il une force ou une faiblesse ?",
  objectifs: ["définir la passion et la distinguer de l'émotion", "décrire ses manifestations", "poser le problème philosophique de la passion"],
  parties: [
    { t: "Définir la passion", html:
      "<p>Le mot vient du latin <em>pati</em> : <strong>subir</strong>, souffrir. Étymologiquement, la passion est ce que l'âme subit, par opposition à l'action.</p><div class='def'><b>Définition</b>La passion est une inclination exclusive et durable qui oriente toute la vie affective et mentale d'une personne vers un objet unique.</div><ul><li>L'<strong>émotion</strong> est brusque et brève (la peur devant un serpent).</li><li>La <strong>passion</strong> est durable et organise la vie autour de son objet (l'ambition, l'amour, la jalousie, le jeu).</li></ul>",
      retenir: "Émotion : un choc passager. Passion : une orientation durable de toute la vie." },
    { t: "Les manifestations de la passion", html:
      "<ul><li><strong>Exclusivité</strong> : l'objet de la passion envahit la pensée ; le reste perd de l'importance.</li><li><strong>Cristallisation</strong> : le passionné embellit son objet et ne voit plus ses défauts.</li><li><strong>Logique propre</strong> : il raisonne beaucoup, mais au service de sa passion.</li><li><strong>Énergie</strong> : la passion mobilise des forces considérables.</li></ul>",
      illus: { legende: "Le problème : la passion, moteur ou maîtresse de la raison ?", svg:
      "<svg viewBox='0 0 460 180' role='img' aria-label='Balance entre passion et raison'><path d='M230 30v120' stroke='#352C72' stroke-width='4'/><path d='M120 60 L340 40' stroke='#352C72' stroke-width='4' stroke-linecap='round'/><path d='M190 160h80' stroke='#352C72' stroke-width='6' stroke-linecap='round'/><g stroke='#352C72' stroke-width='2'><path d='M120 60 L90 110 M120 60 L150 110'/><path d='M340 40 L310 90 M340 40 L370 90'/></g><path d='M80 110 h80 a40 16 0 0 1 -80 0z' fill='#F5B57A' stroke='#6B2A00' stroke-width='2'/><path d='M300 90 h80 a40 16 0 0 1 -80 0z' fill='#ADA4DE' stroke='#352C72' stroke-width='2'/><g font-size='15' font-weight='700' text-anchor='middle'><text x='120' y='150' fill='#6B2A00'>PASSION</text><text x='340' y='130' fill='#352C72'>RAISON</text></g><g font-size='11' fill='#636A80' text-anchor='middle'><text x='120' y='168'>force, énergie, élan</text><text x='340' y='148'>mesure, jugement</text></g></svg>" },
      retenir: "La passion voit tout à travers son objet." },
    { t: "Le problème : grandeur ou servitude ?", html:
      "<h3>La passion asservit</h3><p>Pour une longue tradition (les stoïciens, Spinoza), la passion est une <strong>servitude</strong> : l'homme passionné n'est plus maître de lui ; elle le pousse au crime (jalousie, vengeance).</p><h3>La passion grandit</h3><p>Pour Hegel, « rien de grand ne s'est accompli dans le monde sans passion » : les grands bâtisseurs, inventeurs, libérateurs étaient passionnés. Descartes, dans <em>Les Passions de l'âme</em> (1649), juge que les passions sont « toutes bonnes de leur nature » si la raison les gouverne.</p>",
      retenir: "Problème à poser en dissertation : la passion est-elle un obstacle ou un moteur pour l'homme ?" }
  ],
  revision: ["Étymologie : pati, subir.", "Passion ≠ émotion : durable, exclusive.", "Manifestations : exclusivité, cristallisation, logique propre, énergie.", "Thèse 1 : la passion asservit (stoïciens, Spinoza).", "Thèse 2 : la passion grandit (Hegel) ; la régler par la raison (Descartes)."],
  exo: "<p>Sujet : « Faut-il se méfier de ses passions ? » Rédige l'introduction : amorce, problématique, annonce du plan.</p>",
  quiz: [
    { q: "Que signifie le latin pati ?", r: ["agir", "subir", "aimer"], b: 1, e: "La passion est d'abord ce que l'on subit." },
    { q: "Qu'est-ce qui distingue la passion de l'émotion ?", r: ["Sa durée et son exclusivité", "Son intensité seulement", "Rien"], b: 0, e: "L'émotion est brève ; la passion organise la vie." },
    { q: "Quel philosophe valorise la passion comme moteur de l'histoire ?", r: ["Hegel", "Épictète", "Spinoza"], b: 0, e: "« Rien de grand… sans passion »." },
    { q: "Qui a écrit Les Passions de l'âme ?", r: ["Kant", "Descartes", "Platon"], b: 1, e: "Publié en 1649." }
  ],
  examen: { t: "Dissertations de philosophie corrigées", href: "/corriges/" }
});

VRT_L("tle-philo-liberte", {
  c: "Tle A", m: "philo", cle: "La liberté comme fondement de la responsabilité", titre: "La liberté, fondement de la responsabilité", duree: 25,
  scenes: ["philo-socrate-courage"],
  accroche: "Peut-on être coupable de ce qu'on n'a pas choisi ?",
  intro: "Un élève qui a recopié la copie de son voisin dira : « Ce n'est pas ma faute, il m'a laissé faire. » Mais si l'on est libre, on doit répondre de ses actes.",
  objectifs: ["définir liberté et responsabilité", "montrer le lien entre les deux", "examiner les limites de la responsabilité"],
  parties: [
    { t: "Deux notions liées", html:
      "<div class='def'><b>Liberté</b>Pouvoir de se déterminer soi-même, de choisir et d'agir sans contrainte.</div><div class='def'><b>Responsabilité</b>Obligation de répondre de ses actes et d'en assumer les conséquences (du latin <em>respondere</em>, répondre).</div>",
      retenir: "Être responsable, c'est devoir « répondre » de ce que l'on a choisi." },
    { t: "Pas de responsabilité sans liberté", html:
      "<p>On ne punit pas un fou, ni celui qui a agi sous la menace d'une arme : sans liberté, il n'y a pas de faute. Kant fonde la morale sur l'<strong>autonomie</strong> de la volonté : parce que l'homme peut se donner sa propre loi, il est responsable. Pour Sartre, l'homme est « condamné à être libre » : il ne peut se cacher derrière sa nature, son milieu ou les autres ; il porte le poids de ses choix.</p>",
      illus: { legende: "Chaîne de la responsabilité : sans choix libre, la chaîne se rompt.", svg:
      "<svg viewBox='0 0 460 120' role='img' aria-label='Liberté, choix, acte, responsabilité'><g font-size='13' font-weight='700' text-anchor='middle'><rect x='10' y='36' width='96' height='46' rx='23' fill='#ADA4DE'/><text x='58' y='64' fill='#352C72'>liberté</text><rect x='126' y='36' width='96' height='46' rx='23' fill='#EAE7F7' stroke='#5B4FA8'/><text x='174' y='64' fill='#352C72'>choix</text><rect x='242' y='36' width='96' height='46' rx='23' fill='#EAE7F7' stroke='#5B4FA8'/><text x='290' y='64' fill='#352C72'>acte</text><rect x='358' y='36' width='96' height='46' rx='23' fill='#FFC93C'/><text x='406' y='64' fill='#142554'>répondre</text></g><g stroke='#5B4FA8' stroke-width='3'><path d='M106 59h20M222 59h20M338 59h20'/></g></svg>" },
      retenir: "La responsabilité suppose la liberté : on n'accuse pas une pierre qui tombe." },
    { t: "Les limites", html:
      "<ul><li><strong>Les déterminismes</strong> (sociaux, biologiques, psychologiques) diminuent-ils notre responsabilité ? Le droit reconnaît des circonstances atténuantes.</li><li><strong>L'inconscient</strong> (Freud) : certains actes échappent à la conscience.</li><li>Mais connaître ces déterminismes permet justement de mieux s'en libérer : la liberté est aussi une <strong>conquête</strong>.</li></ul>",
      retenir: "Plus je comprends ce qui me détermine, plus je peux en répondre." }
  ],
  revision: ["Liberté : pouvoir de se déterminer soi-même.", "Responsabilité : répondre de ses actes.", "Sans liberté, pas de faute (folie, contrainte).", "Kant : autonomie ; Sartre : condamné à être libre.", "Limites : déterminismes, inconscient ; la liberté se conquiert."],
  exo: "<p>Sujet : « Suis-je responsable de ce que je suis ? » Propose un plan dialectique en trois parties.</p>",
  quiz: [
    { q: "Respondere signifie…", r: ["répondre", "respecter", "reposer"], b: 0, e: "Être responsable, c'est répondre de ses actes." },
    { q: "Pourquoi ne condamne-t-on pas un fou de la même façon ?", r: ["Il n'est pas libre de ses actes", "Il est trop pauvre", "Il est absent"], b: 0, e: "Sans discernement, pas de liberté réelle." },
    { q: "Qui a dit que l'homme est « condamné à être libre » ?", r: ["Sartre", "Descartes", "Platon"], b: 0, e: "Dans L'existentialisme est un humanisme." }
  ]
});

/* Leçons rédigées VÉRITAS — langues vivantes, langues et cultures nationales, orientation-conseil. */
VRT_L("3e-en-articles", {
  c: "3e", m: "anglais", cle: "Definite and indefinite articles", titre: "Definite and indefinite articles: a, an, the", duree: 15,
  accroche: "A mango, an orange, the market: three little words, many rules.",
  intro: "« I bought <em>a</em> mango at <em>the</em> market. » In English, small words called articles tell us if we are speaking about something new or something we already know.",
  objectifs: ["use a / an correctly", "use the for known or unique things", "know when to use no article"],
  parties: [
    { t: "A or an?", html:
      "<p>We use <strong>a / an</strong> with a singular countable noun mentioned for the first time.</p><ul><li><strong>a</strong> before a consonant <em>sound</em>: a book, a university (« you »), a European.</li><li><strong>an</strong> before a vowel <em>sound</em>: an apple, an hour (the h is silent), an honest man.</li></ul>",
      retenir: "Listen to the SOUND, not the letter: a uniform, an hour." },
    { t: "The", html:
      "<p>We use <strong>the</strong> when the listener knows which thing we mean:</p><ul><li>it was mentioned before: <em>I saw a taxi. The taxi was yellow.</em></li><li>it is unique: <em>the sun, the moon, the President of the Republic</em> ;</li><li>with superlatives: <em>the tallest girl in the class</em> ;</li><li>with rivers, oceans, some countries: <em>the Wouri, the Atlantic, the United States</em>.</li></ul>",
      illus: { legende: "First mention: a. Second mention: the.", svg:
      "<svg viewBox='0 0 460 150' role='img' aria-label='First mention a, second mention the'><rect x='10' y='20' width='200' height='110' rx='16' fill='#FBE4EE' stroke='#6E1F43' stroke-width='2'/><text x='110' y='56' text-anchor='middle' font-size='17' fill='#142554'>I saw <tspan font-weight='700' fill='#B03A6E'>a</tspan> taxi.</text><text x='110' y='92' text-anchor='middle' font-size='13' fill='#636A80'>new information</text><path d='M216 75h28' stroke='#142554' stroke-width='3'/><rect x='250' y='20' width='200' height='110' rx='16' fill='#FFF6DA' stroke='#6B4E00' stroke-width='2'/><text x='350' y='56' text-anchor='middle' font-size='17' fill='#142554'><tspan font-weight='700' fill='#9A6F00'>The</tspan> taxi was yellow.</text><text x='350' y='92' text-anchor='middle' font-size='13' fill='#636A80'>known information</text></svg>" },
      retenir: "New → a / an. Known or unique → the." },
    { t: "No article", html:
      "<p>No article with plural or uncountable nouns used in general, with most countries, cities, languages and school subjects:</p><ul><li><em>Children like sweets.</em> <em>Water is important.</em></li><li><em>Cameroon, Douala, English, mathematics.</em></li></ul><div class='attention'><b>French speakers, watch out!</b>« J'aime <u>les</u> mangues » = I like mangoes (no article).</div>",
      retenir: "General statements in the plural: no article." }
  ],
  revision: ["a + consonant sound, an + vowel sound.", "the: already mentioned, unique, superlative.", "the + rivers and oceans: the Wouri, the Atlantic.", "No article for general plurals, countries, languages, subjects."],
  exo: "<p>Fill in with a, an, the or Ø: 1. ___ elephant is ___ biggest land animal. 2. I like ___ football. 3. She is ___ honest girl. <em>(An / the ; Ø ; an)</em></p>",
  quiz: [
    { q: "___ hour ago.", r: ["A", "An", "The"], b: 1, e: "The h is silent: vowel sound." },
    { q: "___ Wouri is a river in Douala.", r: ["A", "The", "Ø"], b: 1, e: "Rivers take the." },
    { q: "I like ___ mangoes.", r: ["the", "a", "Ø"], b: 2, e: "General statement in the plural: no article." }
  ]
});

VRT_L("3e-en-present", {
  c: "3e", m: "anglais", cle: "Revise the present tenses", titre: "Revise the present tenses: simple and continuous", duree: 15,
  accroche: "Every day I walk to school; right now I am writing. Two presents, two uses.",
  intro: "English has two present tenses. One talks about habits and facts, the other about what is happening now.",
  objectifs: ["form the simple present and the present continuous", "choose the right tense", "recognise time markers"],
  parties: [
    { t: "The simple present", html:
      "<p>For <strong>habits, routines and general truths</strong>.</p><p class='formule'>I / you / we / they play — he / she / it plays</p><ul><li>Negative: <em>She does not (doesn't) play.</em></li><li>Question: <em>Does she play?</em></li><li>Markers: every day, always, usually, often, sometimes, never.</li></ul>",
      retenir: "He, she, it: add -s! (He goes, she watches, it flies.)" },
    { t: "The present continuous", html:
      "<p>For <strong>actions happening now</strong> or temporary situations.</p><p class='formule'>am / is / are + verb-ing</p><ul><li><em>I am reading. They are playing.</em></li><li>Markers: now, right now, at the moment, look!, listen!</li></ul>",
      illus: { legende: "Habit (always) or now (at this moment)?", svg:
      "<svg viewBox='0 0 460 140' role='img' aria-label='Timeline simple present and present continuous'><line x1='20' y1='80' x2='440' y2='80' stroke='#142554' stroke-width='2'/><g fill='#E79BBE'><circle cx='60' cy='80' r='7'/><circle cx='120' cy='80' r='7'/><circle cx='180' cy='80' r='7'/><circle cx='280' cy='80' r='7'/><circle cx='340' cy='80' r='7'/><circle cx='400' cy='80' r='7'/></g><rect x='212' y='58' width='36' height='44' rx='8' fill='#FFC93C'/><text x='230' y='120' text-anchor='middle' font-size='13' font-weight='700' fill='#9A6F00'>NOW</text><text x='120' y='40' text-anchor='middle' font-size='13' fill='#B03A6E'>I walk to school every day.</text><text x='330' y='40' text-anchor='middle' font-size='13' fill='#9A6F00'>I am writing now.</text></svg>" },
      retenir: "Habit → simple present. Now → present continuous." },
    { t: "Verbs that don't like -ing", html:
      "<p>State verbs are usually not used in the continuous: <em>know, like, love, want, need, understand, believe</em>.</p><div class='attention'><b>Wrong / Right</b><s>I am knowing</s> → I know. <s>She is wanting rice</s> → She wants rice.</div>",
      retenir: "Feelings and thoughts: simple present." }
  ],
  revision: ["Simple present: habits, facts; -s with he/she/it.", "do/does for negatives and questions.", "Present continuous: am/is/are + -ing, for now.", "State verbs (know, like, want…) stay simple."],
  exo: "<p>Put the verbs in the correct tense: 1. Look! The baby (sleep). 2. My father (work) in Garoua. 3. I (not understand) this word. <em>(is sleeping ; works ; don't understand)</em></p>",
  quiz: [
    { q: "She ___ to church every Sunday.", r: ["go", "goes", "is going"], b: 1, e: "Habit + she: goes." },
    { q: "Listen! Somebody ___ .", r: ["sings", "is singing", "sing"], b: 1, e: "Listen! = happening now." },
    { q: "I ___ the answer.", r: ["know", "am knowing", "knowing"], b: 0, e: "Know is a state verb." }
  ]
});

VRT_L("3e-de-verbes", {
  c: "3e", m: "allemand", cle: "Conjuguer les verbes faibles", titre: "Les verbes faibles (réguliers) au présent", duree: 15,
  accroche: "spielen, lernen, kaufen : un seul modèle pour des centaines de verbes.",
  intro: "En allemand, la plupart des verbes sont « faibles » : ils se conjuguent tous sur le même modèle. Une fois le modèle connu, tu peux en conjuguer des centaines.",
  objectifs: ["conjuguer un verbe faible au présent", "connaître les cas particuliers en -t, -d, -n", "utiliser les verbes dans une phrase"],
  parties: [
    { t: "Le modèle", html:
      "<p>On enlève <strong>-en</strong> de l'infinitif pour obtenir le radical (<em>spielen</em> → <em>spiel-</em>), puis on ajoute les terminaisons.</p><div class='tab-scroll'><table><thead><tr><th>Pronom</th><th>Terminaison</th><th>spielen (jouer)</th></tr></thead><tbody><tr><th>ich</th><td>-e</td><td>ich spiel<b>e</b></td></tr><tr><th>du</th><td>-st</td><td>du spiel<b>st</b></td></tr><tr><th>er / sie / es</th><td>-t</td><td>er spiel<b>t</b></td></tr><tr><th>wir</th><td>-en</td><td>wir spiel<b>en</b></td></tr><tr><th>ihr</th><td>-t</td><td>ihr spiel<b>t</b></td></tr><tr><th>sie / Sie</th><td>-en</td><td>sie spiel<b>en</b></td></tr></tbody></table></div>",
      retenir: "e – st – t – en – t – en : la chanson des terminaisons." },
    { t: "Les cas particuliers", html:
      "<ul><li>Radical en <strong>-t</strong> ou <strong>-d</strong> : on ajoute un <strong>e</strong> pour prononcer : du arbeit<b>e</b>st, er arbeit<b>e</b>t, ihr find<b>e</b>t.</li><li>Infinitif en <strong>-eln</strong> / <strong>-ern</strong> : wir/sie prennent seulement <strong>-n</strong> : wir wander<b>n</b>, sie sammel<b>n</b>.</li></ul>",
      retenir: "arbeiten → du arbeitest : le e rend la prononciation possible." },
    { t: "En situation", html:
      "<div class='ex'><b>Beispiele</b><em>Ich lerne Deutsch. — Du kaufst Bananen auf dem Markt. — Wir spielen Fußball nach der Schule.</em></div><p>Verbes faibles utiles : lernen (apprendre), kaufen (acheter), wohnen (habiter), machen (faire), sagen (dire), fragen (demander), hören (écouter), kochen (cuisiner).</p>",
      retenir: "Le verbe conjugué est toujours en 2ᵉ position dans la phrase déclarative." }
  ],
  revision: ["Radical = infinitif sans -en.", "Terminaisons : -e, -st, -t, -en, -t, -en.", "Radical en -t/-d : du arbeitest, er arbeitet.", "Verbe conjugué en 2ᵉ position."],
  exo: "<p>Conjugue au présent : 1. du (wohnen) in Yaoundé. 2. er (arbeiten) viel. 3. wir (kaufen) Brot. <em>(wohnst ; arbeitet ; kaufen)</em></p>",
  quiz: [
    { q: "du ___ (lernen)", r: ["lernt", "lernst", "lernen"], b: 1, e: "du → -st." },
    { q: "er ___ (arbeiten)", r: ["arbeitt", "arbeitet", "arbeiten"], b: 1, e: "Radical en -t : on ajoute -e-." },
    { q: "Quelle est la terminaison de « ich » ?", r: ["-e", "-t", "-en"], b: 0, e: "ich spiele, ich lerne." }
  ]
});

VRT_L("3e-de-prepositions", {
  c: "3e", m: "allemand", cle: "prépositions exprimant la direction et la position", titre: "Wo? Wohin? Les prépositions de position et de direction", duree: 20,
  accroche: "Das Buch liegt auf dem Tisch… Ich lege das Buch auf den Tisch.",
  intro: "« Où est le livre ? » et « Où vas-tu le mettre ? » ne se disent pas de la même façon en allemand. Neuf prépositions changent de cas selon la question.",
  objectifs: ["connaître les prépositions mixtes", "choisir entre datif et accusatif", "décrire une pièce ou un trajet"],
  parties: [
    { t: "Les neuf prépositions mixtes", html:
      "<p><strong>in</strong> (dans), <strong>an</strong> (contre, au bord de), <strong>auf</strong> (sur), <strong>über</strong> (au-dessus de), <strong>unter</strong> (sous), <strong>vor</strong> (devant), <strong>hinter</strong> (derrière), <strong>neben</strong> (à côté de), <strong>zwischen</strong> (entre).</p>",
      illus: { legende: "Position du ballon par rapport à la boîte.", svg:
      "<svg viewBox='0 0 460 190' role='img' aria-label='Prépositions de lieu autour d une boîte'><rect x='170' y='70' width='120' height='80' rx='6' fill='#FBE4EE' stroke='#6E1F43' stroke-width='2.5'/><g fill='#FFC93C' stroke='#9A6F00' stroke-width='2'><circle cx='230' cy='112' r='11'/><circle cx='230' cy='58' r='11'/><circle cx='230' cy='20' r='11'/><circle cx='230' cy='170' r='11'/><circle cx='140' cy='120' r='11'/><circle cx='320' cy='120' r='11'/></g><g font-size='13' font-weight='700' fill='#142554'><text x='246' y='116'>in</text><text x='246' y='62'>auf</text><text x='246' y='24'>über</text><text x='246' y='174'>unter</text><text x='70' y='124'>neben</text><text x='338' y='124'>neben</text></g><text x='20' y='182' font-size='12' fill='#636A80'>(vor = devant, hinter = derrière, zwischen = entre)</text></svg>" },
      retenir: "Neuf prépositions : in, an, auf, über, unter, vor, hinter, neben, zwischen." },
    { t: "Wo? → datif ; Wohin? → accusatif", html:
      "<ul><li><strong>Wo?</strong> (où ? position, pas de déplacement) → <strong>datif</strong> : <em>Das Heft liegt auf <b>dem</b> Tisch.</em></li><li><strong>Wohin?</strong> (où vas-tu ? direction, déplacement) → <strong>accusatif</strong> : <em>Ich lege das Heft auf <b>den</b> Tisch.</em></li></ul><div class='tab-scroll'><table><thead><tr><th></th><th>masculin</th><th>féminin</th><th>neutre</th><th>pluriel</th></tr></thead><tbody><tr><th>datif (wo?)</th><td>dem</td><td>der</td><td>dem</td><td>den …n</td></tr><tr><th>accusatif (wohin?)</th><td>den</td><td>die</td><td>das</td><td>die</td></tr></tbody></table></div>",
      retenir: "Mouvement vers un lieu = accusatif ; on est déjà là = datif." },
    { t: "Les contractions", html:
      "<p>in + dem = <strong>im</strong> ; an + dem = <strong>am</strong> ; in + das = <strong>ins</strong> ; an + das = <strong>ans</strong>.</p><div class='ex'><b>Beispiele</b><em>Ich bin im Klassenzimmer. — Ich gehe ins Klassenzimmer. — Wir sind am Strand von Kribi.</em></div>",
      retenir: "im / ins : je suis dans / je vais dans." }
  ],
  revision: ["in, an, auf, über, unter, vor, hinter, neben, zwischen.", "Wo? → datif (dem, der, dem, den).", "Wohin? → accusatif (den, die, das, die).", "im, am, ins, ans."],
  exo: "<p>Complète : 1. Die Katze schläft unter ___ Bett (n). 2. Ich stelle die Flasche auf ___ Tisch (m). 3. Er geht ___ Kino. <em>(dem ; den ; ins)</em></p>",
  quiz: [
    { q: "Ich gehe ___ Schule (f). (wohin?)", r: ["in die", "in der", "im"], b: 0, e: "Direction : accusatif féminin die." },
    { q: "Das Buch liegt auf ___ Tisch (m).", r: ["den", "dem", "der"], b: 1, e: "Position : datif masculin dem." },
    { q: "in + das = ?", r: ["im", "ins", "ans"], b: 1, e: "ins = in das." }
  ]
});

VRT_L("3e-es-familia", {
  c: "3e", m: "espagnol", cle: "Arbre généalogique", titre: "Mi familia : présenter sa famille", duree: 15,
  accroche: "Mi abuela, mis primos, mi tía : toute la famille en espagnol.",
  intro: "Présenter sa famille est l'un des premiers actes de communication. Apprends le vocabulaire, les possessifs et les verbes pour parler des tiens.",
  objectifs: ["nommer les membres de la famille", "utiliser les adjectifs possessifs", "présenter sa famille à l'oral"],
  parties: [
    { t: "El vocabulario", html:
      "<div class='tab-scroll'><table><thead><tr><th>Español</th><th>Français</th><th>Español</th><th>Français</th></tr></thead><tbody><tr><td>el padre / la madre</td><td>le père / la mère</td><td>el abuelo / la abuela</td><td>le grand-père / la grand-mère</td></tr><tr><td>el hermano / la hermana</td><td>le frère / la sœur</td><td>el tío / la tía</td><td>l'oncle / la tante</td></tr><tr><td>el hijo / la hija</td><td>le fils / la fille</td><td>el primo / la prima</td><td>le cousin / la cousine</td></tr><tr><td>los padres</td><td>les parents</td><td>el sobrino</td><td>le neveu</td></tr></tbody></table></div>",
      illus: { legende: "Un arbre généalogique sur trois générations.", svg:
      "<svg viewBox='0 0 460 200' role='img' aria-label='Arbre généalogique'><g stroke='#6E1F43' stroke-width='2' fill='none'><path d='M160 40h140M230 40v40M120 80h220M120 80v30M340 80v30M120 140v20M80 160h80M80 160v10M160 160v10'/></g><g font-size='12' text-anchor='middle'><rect x='100' y='22' width='70' height='28' rx='14' fill='#FBE4EE'/><text x='135' y='41' fill='#142554'>el abuelo</text><rect x='290' y='22' width='72' height='28' rx='14' fill='#FBE4EE'/><text x='326' y='41' fill='#142554'>la abuela</text><rect x='80' y='108' width='80' height='28' rx='14' fill='#FFF6DA'/><text x='120' y='127' fill='#142554'>mi padre</text><rect x='298' y='108' width='84' height='28' rx='14' fill='#FFF6DA'/><text x='340' y='127' fill='#142554'>mi tía</text><rect x='40' y='170' width='80' height='26' rx='13' fill='#B03A6E'/><text x='80' y='188' fill='#fff' font-weight='700'>yo</text><rect x='126' y='170' width='80' height='26' rx='13' fill='#E79BBE'/><text x='166' y='188' fill='#142554'>mi hermana</text><rect x='300' y='150' width='80' height='26' rx='13' fill='#E79BBE'/><text x='340' y='168' fill='#142554'>mi primo</text></g><path d='M340 136v14' stroke='#6E1F43' stroke-width='2'/></svg>" },
      retenir: "Le masculin pluriel désigne le groupe : los padres = le père et la mère." },
    { t: "Los posesivos", html:
      "<p><strong>mi / mis</strong> (mon, ma / mes), <strong>tu / tus</strong> (ton, ta / tes), <strong>su / sus</strong> (son, sa, leur / ses, leurs), <strong>nuestro, -a, -os, -as</strong> (notre / nos), <strong>vuestro…</strong> (votre / vos).</p><div class='ex'><b>Ejemplos</b><em>Mi madre se llama Ngono. Mis hermanos viven en Bafoussam. Nuestra casa es grande.</em></div>",
      retenir: "mi hermano, mis hermanos : le possessif s'accorde avec ce qui est possédé." },
    { t: "Presentar a su familia", html:
      "<p>Phrases utiles : <em>Somos cinco en casa. — Tengo dos hermanos y una hermana. — Mi padre es profesor y mi madre es comerciante. — Mi abuela vive en el pueblo.</em></p><div class='attention'><b>Attention</b>Avec les personnes, on met <strong>a</strong> devant le COD : <em>Quiero mucho <b>a</b> mi abuela.</em></div>",
      retenir: "tener (tengo, tienes, tiene…) pour dire combien de frères et sœurs on a." }
  ],
  revision: ["padre, madre, hermano, abuelo, tío, primo…", "mi/mis, tu/tus, su/sus, nuestro…", "Tengo dos hermanos.", "a devant un COD de personne."],
  exo: "<p>Présente ta famille en six phrases en espagnol (nombre, noms, métiers, lieu de vie).</p>",
  quiz: [
    { q: "« Mes cousins » se dit…", r: ["mi primos", "mis primos", "su primos"], b: 1, e: "mis + pluriel." },
    { q: "La hermana de mi padre es mi…", r: ["abuela", "tía", "prima"], b: 1, e: "La sœur du père : la tante." },
    { q: "Tengo dos ___ (frères).", r: ["hermanas", "hermanos", "hijos"], b: 1, e: "hermanos = frères (ou frères et sœurs)." }
  ]
});

VRT_L("3e-es-medico", {
  c: "3e", m: "espagnol", cle: "Consultations médicales", titre: "En el médico : la consultation et le superlatif", duree: 15,
  accroche: "Me duele la cabeza… ¡Es la peor gripe del año!",
  intro: "Chez le médecin, il faut savoir dire où on a mal. Et pour décrire, le superlatif est bien utile.",
  objectifs: ["nommer les parties du corps", "dire où l'on a mal avec doler", "former le superlatif"],
  parties: [
    { t: "¿Qué te duele?", html:
      "<p>Le verbe <strong>doler</strong> se construit comme <em>gustar</em> : <em>me duele</em> + singulier, <em>me duelen</em> + pluriel.</p><ul><li><em>Me duele la cabeza.</em> (la tête)</li><li><em>Me duele el estómago.</em> (le ventre)</li><li><em>Me duelen los pies.</em> (les pieds)</li><li><em>Tengo fiebre / tos / gripe.</em> (fièvre, toux, grippe)</li></ul>",
      illus: { legende: "El cuerpo : quelques parties du corps.", svg:
      "<svg viewBox='0 0 460 220' role='img' aria-label='Silhouette avec parties du corps en espagnol'><g fill='#FBE4EE' stroke='#6E1F43' stroke-width='2'><circle cx='230' cy='40' r='24'/><rect x='200' y='66' width='60' height='80' rx='16'/><rect x='168' y='70' width='22' height='74' rx='11'/><rect x='270' y='70' width='22' height='74' rx='11'/><rect x='204' y='146' width='22' height='64' rx='11'/><rect x='234' y='146' width='22' height='64' rx='11'/></g><g font-size='13' fill='#142554'><text x='290' y='38'>la cabeza</text><text x='60' y='100'>el brazo</text><text x='296' y='112'>el estómago</text><text x='290' y='200'>la pierna</text><text x='70' y='210'>el pie</text></g><g stroke='#B03A6E' stroke-width='1.5'><path d='M254 40h32M120 104h50M260 108h34M258 196h30M118 206h86'/></g></svg>" },
      retenir: "me duele la cabeza / me duelen los ojos." },
    { t: "En la consulta", html:
      "<div class='ex'><b>Diálogo</b><em>— Buenos días, doctor. — Buenos días, ¿qué le pasa? — Me duele la garganta y tengo fiebre. — ¿Desde cuándo? — Desde ayer. — Tome este jarabe tres veces al día y descanse.</em></div>",
      retenir: "« Desde cuándo » = depuis quand." },
    { t: "El superlativo", html:
      "<ul><li>Relatif : <strong>el / la / los / las más</strong> + adjectif + <strong>de</strong> : <em>Es el hospital más grande de la ciudad.</em></li><li>Absolu : adjectif + <strong>-ísimo</strong> : <em>cansado → cansadísimo, grande → grandísimo</em>.</li><li>Irréguliers : <em>bueno → el mejor ; malo → el peor</em>.</li></ul>",
      retenir: "el más… de ; -ísimo ; el mejor / el peor." }
  ],
  revision: ["me duele + singulier ; me duelen + pluriel.", "tengo fiebre, tos, gripe.", "el más grande de… ; grandísimo.", "el mejor / el peor."],
  exo: "<p>Écris un dialogue de six répliques entre un médecin et un élève qui a mal au ventre.</p>",
  quiz: [
    { q: "« J'ai mal aux pieds »", r: ["Me duele los pies", "Me duelen los pies", "Tengo los pies"], b: 1, e: "Pluriel : duelen." },
    { q: "Superlatif absolu de « cansado » :", r: ["cansadísimo", "más cansado", "el cansado"], b: 0, e: "-ísimo." },
    { q: "« Le meilleur élève de la classe »", r: ["el más bueno alumno", "el mejor alumno de la clase", "el bueno alumno"], b: 1, e: "bueno → mejor." }
  ]
});

VRT_L("1re-it-avverbi", {
  c: "1re A", m: "italien", cle: "La formation des adverbes en -mente", titre: "Gli avverbi in -mente", duree: 15,
  accroche: "lento → lentamente, facile → facilmente : la recette des adverbes.",
  intro: "Comme le français ajoute « -ment » (lentement), l'italien forme beaucoup d'adverbes avec <strong>-mente</strong>. Quelques règles suffisent.",
  objectifs: ["former un adverbe en -mente", "appliquer les règles de -le / -re", "connaître les adverbes irréguliers"],
  parties: [
    { t: "La règle", html:
      "<ul><li>Adjectif en <strong>-o</strong> : on part du féminin en -a : <em>lento → lenta → lentamente ; sicuro → sicuramente</em>.</li><li>Adjectif en <strong>-e</strong> : on ajoute -mente : <em>veloce → velocemente ; forte → fortemente</em>.</li><li>Adjectif en <strong>-le</strong> ou <strong>-re</strong> : le e tombe : <em>facile → facilmente ; regolare → regolarmente</em>.</li></ul>",
      illus: { legende: "Trois chemins pour un adverbe.", svg:
      "<svg viewBox='0 0 460 160' role='img' aria-label='Formation des adverbes'><g font-size='14' fill='#142554'><rect x='10' y='14' width='440' height='38' rx='10' fill='#FBE4EE'/><text x='24' y='38'>lent<tspan font-weight='700'>o</tspan> → lent<tspan fill='#B03A6E' font-weight='700'>a</tspan> → lenta<tspan fill='#B03A6E' font-weight='700'>mente</tspan></text><rect x='10' y='62' width='440' height='38' rx='10' fill='#FFF6DA'/><text x='24' y='86'>veloc<tspan font-weight='700'>e</tspan> → veloce<tspan fill='#9A6F00' font-weight='700'>mente</tspan></text><rect x='10' y='110' width='440' height='38' rx='10' fill='#DDF2F4'/><text x='24' y='134'>facil<tspan font-weight='700' text-decoration='line-through'>e</tspan> → facil<tspan fill='#0E7C86' font-weight='700'>mente</tspan></text></g></svg>" },
      retenir: "-o → -amente ; -e → -emente ; -le/-re → -lmente / -rmente." },
    { t: "Les irréguliers", html:
      "<p><strong>buono → bene</strong>, <strong>cattivo → male</strong>, <strong>migliore → meglio</strong>, <strong>peggiore → peggio</strong>.</p><div class='ex'><b>Esempi</b><em>Parla bene l'italiano. — Oggi sto meglio. — Ha giocato male.</em></div>",
      retenir: "bene, male, meglio, peggio : à apprendre par cœur." },
    { t: "En contexte", html:
      "<p><em>I giovani devono rispettare <b>sinceramente</b> i genitori. — Il dialogo tra generazioni si costruisce <b>pazientemente</b>.</em></p>",
      retenir: "L'adverbe se place souvent juste après le verbe." }
  ],
  revision: ["lento → lentamente.", "veloce → velocemente.", "facile → facilmente.", "bene, male, meglio, peggio."],
  exo: "<p>Forme l'adverbe : rapido, gentile, particolare, triste. <em>(rapidamente, gentilmente, particolarmente, tristemente)</em></p>",
  quiz: [
    { q: "regolare → ?", r: ["regolaremente", "regolarmente", "regolaramente"], b: 1, e: "-re : le e tombe." },
    { q: "buono → ?", r: ["buonamente", "bene", "meglio"], b: 1, e: "Irrégulier." },
    { q: "sicuro → ?", r: ["sicuramente", "sicuromente", "sicurmente"], b: 0, e: "Féminin sicura + mente." }
  ]
});

VRT_L("1re-it-accordo", {
  c: "1re A", m: "italien", cle: "Exprimer l'accord et le désaccord", titre: "Esprimere accordo e disaccordo", duree: 15,
  accroche: "Sono d'accordo… oppure no ! Débattre poliment en italien.",
  intro: "Dans un débat sur la délinquance juvénile ou les conflits de générations, il faut savoir approuver, nuancer et contredire poliment.",
  objectifs: ["exprimer l'accord", "exprimer le désaccord et la nuance", "donner son opinion"],
  parties: [
    { t: "Dire son accord", html:
      "<ul><li><em>Sono d'accordo con te / con Lei.</em></li><li><em>Hai ragione.</em> (tu as raison)</li><li><em>Certo ! / Esatto ! / Proprio così.</em></li></ul>",
      retenir: "essere d'accordo con qualcuno." },
    { t: "Dire son désaccord, nuancer", html:
      "<ul><li><em>Non sono d'accordo. — Non è vero. — Hai torto.</em></li><li>Nuancer : <em>Sì, però… — Da una parte…, dall'altra… — Dipende.</em></li></ul>",
      illus: { legende: "Du plein accord au désaccord total.", svg:
      "<svg viewBox='0 0 460 120' role='img' aria-label='Échelle de l accord au désaccord'><rect x='20' y='50' width='420' height='16' rx='8' fill='#FBE4EE'/><g fill='#B03A6E'><circle cx='30' cy='58' r='9'/><circle cx='230' cy='58' r='9' fill='#FFC93C'/><circle cx='430' cy='58' r='9' fill='#6E1F43'/></g><g font-size='13' text-anchor='middle' fill='#142554'><text x='60' y='36'>Sono d'accordo!</text><text x='230' y='36'>Sì, però… / Dipende</text><text x='400' y='36'>Non sono d'accordo</text><text x='60' y='96' fill='#636A80'>accord</text><text x='230' y='96' fill='#636A80'>nuance</text><text x='400' y='96' fill='#636A80'>désaccord</text></g></svg>" },
      retenir: "« Sì, però… » : la nuance est souvent plus convaincante." },
    { t: "Donner son opinion", html:
      "<p><em>Secondo me… — Per me… — Penso che + subjonctif : Penso che i genitori <b>abbiano</b> un ruolo importante.</em></p>",
      retenir: "Penso che, credo che + congiuntivo." }
  ],
  revision: ["Sono d'accordo / Non sono d'accordo.", "Hai ragione / Hai torto.", "Sì, però… ; Dipende.", "Secondo me ; Penso che + subjonctif."],
  exo: "<p>Réagis en italien (3 phrases) : « I giovani di oggi non rispettano più gli anziani. »</p>",
  quiz: [
    { q: "« Tu as raison »", r: ["Hai torto", "Hai ragione", "Sei d'accordo"], b: 1, e: "ragione = raison." },
    { q: "Pour nuancer, on dit…", r: ["Certo!", "Sì, però…", "Esatto!"], b: 1, e: "Oui, mais…" },
    { q: "« Penso che » est suivi…", r: ["de l'indicatif", "du subjonctif", "de l'infinitif"], b: 1, e: "Opinion : congiuntivo." }
  ]
});

VRT_L("1re-zh-budan", {
  c: "1re A", m: "chinois", cle: "不但……而且", titre: "不但……而且 et 第一……第二 : enchaîner ses idées", duree: 15,
  accroche: "Non seulement… mais aussi… : deux structures pour bien argumenter en chinois.",
  intro: "Pour parler de la solidarité familiale, il faut enchaîner les idées. Deux structures très utiles : 不但……而且…… et 第一……第二…….",
  objectifs: ["employer 不但……而且……", "ordonner des idées avec 第一、第二", "les utiliser à l'oral et à l'écrit"],
  parties: [
    { t: "不但……而且……", html:
      "<p><strong>不但</strong> (bùdàn) … <strong>而且</strong> (érqiě) … = « non seulement… mais aussi… ».</p><div class='ex'><b>例子</b>他<b>不但</b>会说汉语，<b>而且</b>会说英语。<br><em>Tā bùdàn huì shuō Hànyǔ, érqiě huì shuō Yīngyǔ.</em><br>Il parle non seulement chinois, mais aussi anglais.</div>",
      illus: { legende: "Deux idées reliées : la seconde renforce la première.", svg:
      "<svg viewBox='0 0 460 120' role='img' aria-label='Structure budan erqie'><rect x='10' y='30' width='90' height='50' rx='12' fill='#B03A6E'/><text x='55' y='62' text-anchor='middle' font-size='20' fill='#fff' font-weight='700'>不但</text><rect x='106' y='30' width='110' height='50' rx='12' fill='#FBE4EE'/><text x='161' y='61' text-anchor='middle' font-size='14' fill='#142554'>idée 1</text><rect x='232' y='30' width='90' height='50' rx='12' fill='#FFC93C'/><text x='277' y='62' text-anchor='middle' font-size='20' fill='#142554' font-weight='700'>而且</text><rect x='328' y='30' width='122' height='50' rx='12' fill='#FFF6DA'/><text x='389' y='61' text-anchor='middle' font-size='14' fill='#142554'>idée 2 (plus forte)</text></svg>" },
      retenir: "不但 A，而且 B : B ajoute quelque chose à A." },
    { t: "第一……第二……", html:
      "<p><strong>第一</strong> (dì yī, premièrement), <strong>第二</strong> (dì èr, deuxièmement), <strong>第三</strong> (dì sān)… : le préfixe 第 transforme un nombre en ordinal.</p><div class='ex'><b>例子</b><b>第一</b>，家人要互相帮助；<b>第二</b>，孩子要尊重父母。<br><em>Dì yī, jiārén yào hùxiāng bāngzhù ; dì èr, háizi yào zūnzhòng fùmǔ.</em><br>Premièrement, la famille doit s'entraider ; deuxièmement, les enfants doivent respecter leurs parents.</div>",
      retenir: "第 + nombre = ordinal : 第一, 第二, 第三." },
    { t: "Vocabulaire de la famille", html:
      "<p>家 jiā (famille, maison) — 爸爸 bàba — 妈妈 māma — 哥哥 gēge (grand frère) — 姐姐 jiějie (grande sœur) — 帮助 bāngzhù (aider) — 尊重 zūnzhòng (respecter).</p>",
      retenir: "Toujours noter le pinyin avec les tons." }
  ],
  revision: ["不但 A，而且 B = non seulement A mais aussi B.", "第一、第二、第三 = premièrement, deuxièmement…", "家 jiā, 帮助 bāngzhù, 尊重 zūnzhòng."],
  exo: "<p>Écris deux phrases avec 不但……而且…… sur ta famille ou ton école.</p>",
  quiz: [
    { q: "不但……而且…… signifie…", r: ["si… alors…", "non seulement… mais aussi…", "parce que… donc…"], b: 1, e: "bùdàn… érqiě…" },
    { q: "« Deuxièmement » se dit…", r: ["二第", "第二", "第一"], b: 1, e: "第 + 二." },
    { q: "帮助 (bāngzhù) signifie…", r: ["aider", "respecter", "famille"], b: 0, e: "尊重 = respecter." }
  ]
});

VRT_L("1re-zh-ruguo", {
  c: "1re A", m: "chinois", cle: "如果", titre: "如果……那么/就…… : exprimer la condition", duree: 15,
  accroche: "如果你努力，就会成功 : si tu travailles, tu réussiras.",
  intro: "Pour donner un conseil ou parler des conséquences d'un acte (par exemple la délinquance juvénile), on utilise la condition.",
  objectifs: ["construire une phrase conditionnelle", "choisir entre 那么 et 就", "donner un conseil"],
  parties: [
    { t: "La structure", html:
      "<p><strong>如果</strong> (rúguǒ, si) + condition，(<strong>那么</strong> nàme) + sujet + <strong>就</strong> (jiù) + conséquence.</p><div class='ex'><b>例子</b><b>如果</b>明天下雨，我们<b>就</b>不去。<br><em>Rúguǒ míngtiān xià yǔ, wǒmen jiù bú qù.</em><br>S'il pleut demain, nous n'irons pas.</div>",
      illus: { legende: "Condition → conséquence.", svg:
      "<svg viewBox='0 0 460 110' role='img' aria-label='Si condition alors conséquence'><rect x='10' y='30' width='80' height='46' rx='12' fill='#B03A6E'/><text x='50' y='60' text-anchor='middle' font-size='20' fill='#fff' font-weight='700'>如果</text><rect x='96' y='30' width='130' height='46' rx='12' fill='#FBE4EE'/><text x='161' y='58' text-anchor='middle' font-size='14' fill='#142554'>condition</text><path d='M232 53h30' stroke='#142554' stroke-width='3'/><rect x='268' y='30' width='60' height='46' rx='12' fill='#FFC93C'/><text x='298' y='60' text-anchor='middle' font-size='20' fill='#142554' font-weight='700'>就</text><rect x='334' y='30' width='116' height='46' rx='12' fill='#FFF6DA'/><text x='392' y='58' text-anchor='middle' font-size='14' fill='#142554'>conséquence</text></svg>" },
      retenir: "就 se place APRÈS le sujet de la seconde proposition." },
    { t: "Donner un conseil", html:
      "<p><em>如果你有问题，就问老师。</em> Rúguǒ nǐ yǒu wèntí, jiù wèn lǎoshī. — Si tu as un problème, demande au professeur.</p>",
      retenir: "如果 + 有问题 : très utile en classe !" },
    { t: "Les nombres et 有的……有的……", html:
      "<p><strong>有的</strong>……<strong>有的</strong>…… = « certains… d'autres… » : <em>学生有的喜欢看书，有的喜欢运动。</em> Certains élèves aiment lire, d'autres le sport.</p>",
      retenir: "有的 A，有的 B : pour décrire un groupe varié." }
  ],
  revision: ["如果 + condition，(那么) + sujet + 就 + conséquence.", "就 après le sujet.", "有的……有的…… = certains… d'autres…"],
  exo: "<p>Donne trois conseils à un camarade avec 如果……就…….</p>",
  quiz: [
    { q: "如果 signifie…", r: ["si", "mais", "parce que"], b: 0, e: "rúguǒ = si." },
    { q: "Où se place 就 ?", r: ["Avant le sujet", "Après le sujet de la conséquence", "En fin de phrase"], b: 1, e: "我们就不去." },
    { q: "有的……有的…… veut dire…", r: ["tous…", "certains… d'autres…", "aucun…"], b: 1, e: "Pour un groupe varié." }
  ]
});

VRT_L("tle-ar-khabar", {
  c: "Tle A", m: "arabe", cle: "Les types d", titre: "Les types d'attribut (أنواع الخبر)", duree: 15,
  accroche: "الطالبُ مجتهدٌ : la phrase nominale et ses attributs.",
  intro: "En arabe, la phrase nominale (الجملة الاسمية) se compose d'un sujet (المبتدأ) et d'un attribut (الخبر). Cet attribut peut prendre trois formes.",
  objectifs: ["reconnaître المبتدأ et الخبر", "distinguer les trois types de خبر", "construire des phrases nominales"],
  parties: [
    { t: "La phrase nominale", html:
      "<p dir='rtl' lang='ar' class='formule'>الطالبُ مجتهدٌ</p><p>« L'élève est travailleur. » <strong>الطالبُ</strong> est le sujet (المبتدأ), <strong>مجتهدٌ</strong> est l'attribut (الخبر). Les deux sont au cas sujet (مرفوع).</p>",
      retenir: "مبتدأ + خبر = phrase nominale ; tous deux مرفوع." },
    { t: "Les trois types de خبر", html:
      "<div class='tab-scroll'><table><thead><tr><th>Type</th><th>Exemple</th><th>Sens</th></tr></thead><tbody>" +
      "<tr><th>خبر مفرد (un mot)</th><td dir='rtl' lang='ar'>الجوُّ جميلٌ</td><td>Le temps est beau.</td></tr>" +
      "<tr><th>خبر جملة (une phrase)</th><td dir='rtl' lang='ar'>الطالبُ يقرأُ الدرسَ</td><td>L'élève lit la leçon. (phrase verbale)</td></tr>" +
      "<tr><th></th><td dir='rtl' lang='ar'>الطالبُ أبوه طبيبٌ</td><td>L'élève, son père est médecin. (phrase nominale)</td></tr>" +
      "<tr><th>خبر شبه جملة</th><td dir='rtl' lang='ar'>الكتابُ على الطاولةِ</td><td>Le livre est sur la table. (préposition + nom)</td></tr>" +
      "<tr><th></th><td dir='rtl' lang='ar'>المعلّمُ أمامَ السبّورةِ</td><td>Le maître est devant le tableau. (adverbe de lieu)</td></tr></tbody></table></div>",
      illus: { legende: "Un sujet, trois façons de le compléter.", svg:
      "<svg viewBox='0 0 460 170' role='img' aria-label='Types de khabar'><rect x='330' y='62' width='120' height='46' rx='12' fill='#B03A6E'/><text x='390' y='92' text-anchor='middle' font-size='18' fill='#fff' font-weight='700'>المبتدأ</text><g stroke='#6E1F43' stroke-width='2'><path d='M330 85 L230 30M330 85 L230 85M330 85 L230 140'/></g><g font-size='14' text-anchor='middle' fill='#142554'><rect x='20' y='12' width='210' height='36' rx='10' fill='#FBE4EE'/><text x='125' y='35'>خبر مفرد — un mot</text><rect x='20' y='67' width='210' height='36' rx='10' fill='#FFF6DA'/><text x='125' y='90'>خبر جملة — une phrase</text><rect x='20' y='122' width='210' height='36' rx='10' fill='#DDF2F4'/><text x='125' y='145'>خبر شبه جملة</text></g></svg>" },
      retenir: "مفرد, جملة (اسمية أو فعلية), شبه جملة." },
    { t: "Le lien avec le sujet", html:
      "<p>Quand le خبر est une phrase, elle contient un pronom qui renvoie au sujet (الرابط) : dans <span dir='rtl' lang='ar'>الطالبُ أبوه طبيبٌ</span>, le pronom <span dir='rtl' lang='ar'>ـه</span> (« son ») renvoie à الطالب.</p>",
      retenir: "Phrase-attribut = pronom de rappel obligatoire." }
  ],
  revision: ["Phrase nominale = مبتدأ + خبر.", "خبر مفرد : un mot.", "خبر جملة : phrase verbale ou nominale, avec pronom de rappel.", "خبر شبه جملة : préposition + nom ou adverbe de lieu/temps."],
  exo: "<p>Donne le type de خبر : <span dir='rtl' lang='ar'>البيتُ كبيرٌ — الأمُّ تطبخُ — القلمُ في الحقيبةِ</span>. <em>(مفرد ; جملة فعلية ; شبه جملة)</em></p>",
  quiz: [
    { q: "Dans الجوُّ جميلٌ, le خبر est…", r: ["مفرد", "جملة", "شبه جملة"], b: 0, e: "Un seul mot : جميلٌ." },
    { q: "الكتابُ على الطاولةِ : quel type ?", r: ["مفرد", "شبه جملة", "جملة فعلية"], b: 1, e: "Préposition + nom." },
    { q: "Le cas du مبتدأ est…", r: ["منصوب", "مرفوع", "مجرور"], b: 1, e: "Le sujet est au nominatif." }
  ]
});

VRT_L("tle-ar-verbes", {
  c: "Tle A", m: "arabe", cle: "Les verbes intransitifs et transitifs", titre: "Verbes intransitifs et transitifs (اللازم والمتعدي)", duree: 15,
  accroche: "جلسَ الولدُ / كتبَ الطالبُ الدرسَ : avec ou sans complément.",
  intro: "Certains verbes se suffisent à eux-mêmes, d'autres demandent un complément d'objet direct (المفعول به).",
  objectifs: ["distinguer الفعل اللازم et الفعل المتعدي", "repérer المفعول به", "rendre un verbe transitif"],
  parties: [
    { t: "Le verbe intransitif (اللازم)", html:
      "<p>Il n'a pas de complément d'objet : <span dir='rtl' lang='ar'>جلسَ الولدُ</span> (l'enfant s'est assis), <span dir='rtl' lang='ar'>نامَ الطفلُ</span> (le bébé a dormi).</p>",
      retenir: "اللازم : le sens est complet avec le sujet." },
    { t: "Le verbe transitif (المتعدي)", html:
      "<p>Il a un complément d'objet direct, au cas direct (منصوب) : <span dir='rtl' lang='ar'>كتبَ الطالبُ الدرسَ</span> (l'élève a écrit la leçon). Certains en ont deux : <span dir='rtl' lang='ar'>أعطى الأبُ الولدَ كتاباً</span> (le père a donné un livre à l'enfant).</p>",
      illus: { legende: "Verbe + sujet (+ complément).", svg:
      "<svg viewBox='0 0 460 140' role='img' aria-label='Verbe intransitif et transitif'><g font-size='18' text-anchor='middle' font-weight='700'><rect x='300' y='14' width='140' height='42' rx='12' fill='#B03A6E'/><text x='370' y='42' fill='#fff'>جلسَ الولدُ</text><rect x='300' y='80' width='140' height='42' rx='12' fill='#B03A6E'/><text x='370' y='108' fill='#fff'>كتبَ الطالبُ</text><rect x='150' y='80' width='120' height='42' rx='12' fill='#FFC93C'/><text x='210' y='108' fill='#142554'>الدرسَ</text></g><g font-size='13' fill='#636A80'><text x='20' y='40'>لازم : pas de complément</text><text x='20' y='106'>متعدٍّ → مفعول به</text></g></svg>" },
      retenir: "المفعول به est منصوب (fatha)." },
    { t: "Rendre un verbe transitif", html:
      "<p>On peut rendre transitif un verbe intransitif avec la forme IV (أفعل) ou la forme II (فعّل) : <span dir='rtl' lang='ar'>جلسَ</span> → <span dir='rtl' lang='ar'>أجلسَ الأبُ الولدَ</span> (le père a fait asseoir l'enfant).</p>",
      retenir: "Forme IV ou II : « faire faire »." }
  ],
  revision: ["اللازم : sans complément.", "المتعدي : avec مفعول به منصوب.", "Certains verbes ont deux compléments (أعطى).", "Formes II et IV pour rendre transitif."],
  exo: "<p>Classe : <span dir='rtl' lang='ar'>ذهبَ — قرأَ — ضحكَ — فتحَ</span>. <em>(لازم : ذهب، ضحك ; متعدٍّ : قرأ، فتح)</em></p>",
  quiz: [
    { q: "نامَ الطفلُ : le verbe est…", r: ["لازم", "متعدٍّ"], b: 0, e: "Pas de complément." },
    { q: "Le مفعول به est au cas…", r: ["مرفوع", "منصوب", "مجرور"], b: 1, e: "Cas direct." },
    { q: "أجلسَ est la forme…", r: ["I", "IV", "X"], b: 1, e: "Forme IV : أفعل." }
  ]
});

VRT_L("6e-ln-carte", {
  c: "6e", m: "ln", cle: "La carte linguistique du Cameroun", titre: "La carte linguistique du Cameroun", duree: 15,
  scenes: ["1re-langues-nationales-salutations-aines"],
  accroche: "Plus de 250 langues dans un seul pays : un trésor à connaître.",
  intro: "Le Cameroun compte plus de 250 langues nationales. Elles ne sont pas réparties au hasard : elles appartiennent à de grandes familles.",
  objectifs: ["connaître le nombre approximatif de langues", "nommer les grandes familles", "situer quelques langues"],
  parties: [
    { t: "Une grande diversité", html:
      "<p>Les linguistes recensent <strong>plus de 250 langues</strong> au Cameroun. À côté des deux langues officielles (français et anglais), ces langues nationales sont parlées en famille, au marché, dans les cérémonies. Certaines servent de langue véhiculaire dans une région (le fulfulde au Nord, l'ewondo autour de Yaoundé, le duala sur la côte).</p>",
      retenir: "Plus de 250 langues nationales + 2 langues officielles." },
    { t: "Les grandes familles", html:
      "<ul><li><strong>Langues bantoues</strong> : au Sud et au Centre (ewondo, bulu, duala, basaa…).</li><li><strong>Langues des Grassfields</strong> (semi-bantoues) : à l'Ouest et au Nord-Ouest (ghomálá', medumba, fe'efe'e, lamnso'…).</li><li><strong>Langues adamawa-oubanguiennes</strong> : dans l'Adamaoua et l'Est (mbum, gbaya…).</li><li><strong>Langues tchadiques</strong> : dans l'Extrême-Nord (mafa, giziga…).</li><li>Le <strong>fulfulde</strong> (famille atlantique) et l'<strong>arabe choa</strong> au Nord ; le <strong>kanuri</strong> près du lac Tchad.</li></ul>",
      illus: { legende: "Schéma simplifié : les familles de langues du sud au nord (zones approximatives).", svg:
      "<svg viewBox='0 0 300 300' role='img' aria-label='Schéma des familles de langues du Cameroun'><path d='M150 10 L175 30 L170 80 L210 120 L240 170 L250 250 L200 290 L60 290 L40 240 L70 200 L90 160 L120 120 L135 70 Z' fill='#FFF3E4' stroke='#6B2A00' stroke-width='2'/><path d='M150 10 L175 30 L170 80 L135 70 Z' fill='#F5B57A'/><path d='M135 70 L170 80 L210 120 L120 120 Z' fill='#FFC93C' fill-opacity='.7'/><path d='M120 120 L210 120 L240 170 L90 160 Z' fill='#7CCCD3' fill-opacity='.7'/><path d='M90 160 L70 200 L110 200 L130 165 Z' fill='#ADA4DE'/><path d='M130 165 L240 170 L250 250 L200 290 L60 290 L40 240 L70 200 L110 200 Z' fill='#7FCB8C' fill-opacity='.7'/><g font-size='11' fill='#142554' font-weight='700'><text x='138' y='55'>tchadiques</text><text x='138' y='103'>fulfulde</text><text x='120' y='148'>adamawa-oub.</text><text x='42' y='190'>Grassfields</text><text x='130' y='240'>bantoues</text></g></svg>" },
      retenir: "Bantou au Sud, Grassfields à l'Ouest, tchadique à l'Extrême-Nord." },
    { t: "Écrire nos langues", html:
      "<p>Pour écrire toutes ces langues avec les mêmes règles, des linguistes camerounais ont adopté en 1979 l'<strong>Alphabet général des langues camerounaises (AGLC)</strong>. Il note les voyelles, les consonnes et les <strong>tons</strong>.</p>",
      retenir: "AGLC : un alphabet commun pour toutes nos langues." }
  ],
  revision: ["Plus de 250 langues nationales.", "Familles : bantoue, Grassfields, adamawa-oubanguienne, tchadique, fulfulde, arabe choa, kanuri.", "Langues véhiculaires régionales.", "AGLC (1979) pour les écrire."],
  exo: "<p>Interroge tes parents : quelle langue parlent-ils ? À quelle famille appartient-elle ? Dans quelle région est-elle parlée ?</p>",
  quiz: [
    { q: "Combien de langues nationales environ ?", r: ["Une vingtaine", "Plus de 250", "Exactement 10"], b: 1, e: "Une des plus grandes diversités d'Afrique." },
    { q: "L'ewondo est une langue…", r: ["bantoue", "tchadique", "européenne"], b: 0, e: "Comme le bulu et le duala." },
    { q: "Que signifie AGLC ?", r: ["Association générale des lycées camerounais", "Alphabet général des langues camerounaises", "Atlas géographique"], b: 1, e: "Adopté en 1979." }
  ]
});

VRT_L("4e-ln-tons", {
  c: "4e", m: "ln", cle: "Les tons de la langue", titre: "Les tons de nos langues", duree: 15,
  scenes: ["1re-langues-nationales-singulier-pluriel"],
  accroche: "Même syllabe, autre hauteur, autre sens : bienvenue dans les langues à tons.",
  intro: "Dans la plupart des langues camerounaises, la hauteur de la voix sur une syllabe peut changer le sens d'un mot. C'est le <strong>ton</strong>.",
  objectifs: ["définir le ton", "reconnaître les tons de base", "les noter selon l'AGLC"],
  parties: [
    { t: "Qu'est-ce qu'un ton ?", html:
      "<p>Le ton est la <strong>hauteur musicale</strong> d'une syllabe. Dans une langue à tons, deux mots peuvent avoir les mêmes voyelles et les mêmes consonnes et ne différer que par le ton. Ton enseignant te donnera des exemples dans la langue étudiée en classe.</p>",
      retenir: "Changer le ton peut changer le mot." },
    { t: "Les tons et leur notation (AGLC)", html:
      "<div class='tab-scroll'><table><thead><tr><th>Ton</th><th>Signe</th><th>Exemple</th></tr></thead><tbody><tr><th>haut</th><td>accent aigu</td><td>á</td></tr><tr><th>bas</th><td>accent grave</td><td>à</td></tr><tr><th>moyen</th><td>trait (macron)</td><td>ā</td></tr><tr><th>montant (bas → haut)</th><td>caron</td><td>ǎ</td></tr><tr><th>descendant (haut → bas)</th><td>accent circonflexe</td><td>â</td></tr></tbody></table></div>",
      illus: { legende: "La hauteur de la voix sur la syllabe « ba ».", svg:
      "<svg viewBox='0 0 460 170' role='img' aria-label='Courbes des tons'><g stroke='#E6E0D4'><path d='M20 40h420M20 80h420M20 120h420'/></g><g font-size='12' fill='#636A80'><text x='22' y='36'>haut</text><text x='22' y='76'>moyen</text><text x='22' y='116'>bas</text></g><g stroke-width='5' stroke-linecap='round' fill='none'><path d='M70 40h50' stroke='#A84200'/><path d='M150 120h50' stroke='#A84200'/><path d='M230 80h50' stroke='#A84200'/><path d='M310 120 L360 40' stroke='#0E7C86'/><path d='M390 40 L440 120' stroke='#0E7C86'/></g><g font-size='18' text-anchor='middle' font-weight='700' fill='#142554'><text x='95' y='160'>bá</text><text x='175' y='160'>bà</text><text x='255' y='160'>bā</text><text x='335' y='160'>bǎ</text><text x='415' y='160'>bâ</text></g></svg>" },
      retenir: "Haut ´, bas `, moyen ¯, montant ˇ, descendant ˆ." },
    { t: "S'entraîner", html:
      "<ol><li>Écoute un mot prononcé par ton enseignant.</li><li>Fredonne-le sur « la-la » pour entendre la mélodie.</li><li>Trace la courbe avec la main (haut, bas, montée, descente).</li><li>Note le ton avec le bon signe.</li></ol>",
      retenir: "Fredonner la mélodie aide à entendre les tons." }
  ],
  revision: ["Ton = hauteur d'une syllabe.", "Il peut changer le sens d'un mot.", "AGLC : á haut, à bas, ā moyen, ǎ montant, â descendant."],
  exo: "<p>Avec ton enseignant, trouve dans la langue étudiée deux mots qui ne diffèrent que par le ton, et note-les.</p>",
  quiz: [
    { q: "Le ton haut se note…", r: ["à", "á", "ā"], b: 1, e: "Accent aigu." },
    { q: "Un ton montant va…", r: ["du haut vers le bas", "du bas vers le haut", "reste plat"], b: 1, e: "Noté ǎ (caron)." },
    { q: "Dans une langue à tons, le ton peut…", r: ["changer le sens du mot", "ne rien changer", "remplacer les voyelles"], b: 0, e: "D'où l'importance de bien le noter." }
  ]
});

VRT_L("tle-cult-naissance", {
  c: "Tle A", m: "cultures", cle: "en rapport avec la naissance et la vie moderne", titre: "Naissance : pratiques traditionnelles et vie moderne", duree: 15,
  accroche: "Nom, rites, maternité : comment la tradition accueille un enfant aujourd'hui.",
  intro: "Dans les communautés camerounaises, la naissance n'est pas qu'un événement médical : elle fait entrer un enfant dans une famille et une lignée. Comment ces pratiques vivent-elles avec la vie moderne ?",
  objectifs: ["décrire des pratiques liées à la naissance", "analyser leurs rapports avec la vie moderne", "adopter une attitude critique et respectueuse"],
  parties: [
    { t: "Les pratiques traditionnelles", html:
      "<ul><li><strong>La protection de la femme enceinte</strong> : interdits alimentaires ou de comportement, conseils des aînées.</li><li><strong>L'accueil de l'enfant</strong> : présentation à la famille, au lignage ou aux ancêtres selon les communautés.</li><li><strong>Le nom</strong> : souvent choisi pour honorer un parent, rappeler une circonstance ou exprimer un vœu.</li><li><strong>La solidarité</strong> : la jeune mère est entourée et aidée pendant plusieurs semaines.</li></ul><p>Ces pratiques varient beaucoup d'une communauté à l'autre : on les étudie à partir de la communauté cible choisie en classe.</p>",
      retenir: "La naissance est un événement familial et communautaire." },
    { t: "La rencontre avec la vie moderne", html:
      "<ul><li>Les consultations prénatales et l'accouchement à l'hôpital réduisent la mortalité des mères et des enfants.</li><li>L'<strong>acte de naissance</strong> donne à l'enfant une existence juridique : sans lui, pas d'inscription aux examens officiels.</li><li>Certaines pratiques se maintiennent en s'adaptant : présentation de l'enfant à la famille après la sortie de la maternité, fête de nomination.</li></ul>",
      illus: { legende: "Tradition et modernité se complètent souvent.", svg:
      "<svg viewBox='0 0 460 150' role='img' aria-label='Tradition et modernité autour de la naissance'><circle cx='150' cy='75' r='62' fill='#FFF3E4' stroke='#A84200' stroke-width='2'/><circle cx='310' cy='75' r='62' fill='#DDF2F4' stroke='#0E7C86' stroke-width='2'/><g font-size='12' fill='#142554' text-anchor='middle'><text x='120' y='60'>présentation</text><text x='120' y='76'>à la famille</text><text x='120' y='96'>nomination</text><text x='340' y='60'>consultations</text><text x='340' y='76'>prénatales</text><text x='340' y='96'>acte de naissance</text><text x='230' y='70' font-weight='700'>solidarité</text><text x='230' y='86' font-weight='700'>familiale</text></g></svg>" },
      retenir: "Hôpital et acte de naissance : des droits pour l'enfant." },
    { t: "Garder un regard critique", html:
      "<p>On valorise ce qui protège et rassemble (la solidarité, la transmission du nom et de la langue) ; on questionne ce qui met la santé en danger (refus des soins, interdits nuisibles). Le dialogue avec les aînés permet de faire évoluer les pratiques sans les mépriser.</p>",
      retenir: "Respecter la tradition n'empêche pas de la faire évoluer." }
  ],
  revision: ["Naissance : événement familial et communautaire.", "Pratiques : protection de la mère, accueil, nom, solidarité.", "Modernité : soins, acte de naissance.", "Attitude : respect et esprit critique."],
  exo: "<p>Interroge une aînée de ta communauté sur les pratiques liées à la naissance ; présente-les en dix lignes et dis ce qui a changé.</p>",
  quiz: [
    { q: "À quoi sert l'acte de naissance ?", r: ["À rien", "À donner une existence juridique à l'enfant", "À choisir son prénom"], b: 1, e: "Indispensable pour l'école et les examens." },
    { q: "Une pratique traditionnelle fréquente :", r: ["la nomination de l'enfant", "le vote", "l'exportation"], b: 0, e: "Le nom honore souvent un parent." },
    { q: "Quelle attitude adopter ?", r: ["Tout rejeter", "Respect et esprit critique", "Tout accepter sans réfléchir"], b: 1, e: "Valoriser ce qui protège, questionner ce qui nuit." }
  ]
});

VRT_L("tle-cult-mort", {
  c: "Tle A", m: "cultures", cle: "en rapport avec la mort et la vie moderne", titre: "Funérailles : tradition et vie moderne", duree: 15,
  scenes: ["tle-cultures-funerailles-tradition-modernite", "tle-cultures-tam-tam-parleur"],
  accroche: "Deuil, veillée, funérailles : honorer les morts sans ruiner les vivants ?",
  intro: "Au Cameroun, les funérailles sont un moment majeur de la vie sociale. Elles honorent le défunt et rassemblent la communauté. Mais elles évoluent, et soulèvent des débats.",
  objectifs: ["décrire les étapes des rites funéraires", "identifier les changements liés à la vie moderne", "débattre de leurs coûts et de leur sens"],
  parties: [
    { t: "Les étapes", html:
      "<ol><li><strong>L'annonce du décès</strong> : autrefois par le tam-tam ou des messagers, aujourd'hui aussi par la radio, le téléphone et les réseaux sociaux.</li><li><strong>La veillée</strong> : chants, prières, témoignages.</li><li><strong>L'inhumation</strong>, souvent au village d'origine.</li><li><strong>Le deuil</strong> : comportements particuliers de la famille proche pendant une période.</li><li><strong>Les funérailles</strong> proprement dites, parfois des mois ou des années plus tard, selon les communautés.</li></ol>",
      retenir: "Les rites accompagnent le défunt et consolent les vivants." },
    { t: "Ce qui change", html:
      "<ul><li><strong>La morgue</strong> permet d'attendre le retour de la famille dispersée.</li><li><strong>Les cérémonies</strong> mêlent rites traditionnels et religieux.</li><li><strong>Le coût</strong> augmente : transport, réception, tenues, location de chaises et de bâches.</li></ul>",
      illus: { legende: "Le tam-tam d'annonce et le téléphone : deux messagers du deuil.", svg:
      "<svg viewBox='0 0 460 150' role='img' aria-label='Tam-tam et téléphone'><g transform='translate(100 20)'><ellipse cx='40' cy='12' rx='40' ry='12' fill='#F5B57A' stroke='#6B2A00' stroke-width='2'/><path d='M0 12c0 30 10 50 22 66l-4 30h44l-4-30c12-16 22-36 22-66' fill='#A84200' stroke='#6B2A00' stroke-width='2'/></g><path d='M230 40 c20 10 20 50 0 60M250 30 c30 15 30 65 0 80' fill='none' stroke='#9A6F00' stroke-width='3' stroke-linecap='round'/><rect x='300' y='20' width='60' height='110' rx='12' fill='#0C2A6A'/><rect x='308' y='32' width='44' height='76' rx='4' fill='#DDF2F4'/><circle cx='330' cy='118' r='5' fill='#FFC93C'/></svg>" },
      retenir: "Les moyens changent, le besoin de rassembler demeure." },
    { t: "Le débat", html:
      "<p>Faut-il limiter les dépenses des funérailles ? Pour les uns, elles sont une dette d'honneur envers le défunt et un ciment social. Pour les autres, elles appauvrissent les familles au détriment des vivants (scolarité, santé). De nombreuses communautés réfléchissent à des règles pour en réduire le coût.</p>",
      retenir: "Honorer les morts sans sacrifier les vivants : un équilibre à trouver." }
  ],
  revision: ["Étapes : annonce, veillée, inhumation, deuil, funérailles.", "Changements : morgue, religion, réseaux sociaux.", "Débat : sens et coût des funérailles."],
  exo: "<p>Prépare un exposé de deux minutes : « Les funérailles dans ma communauté hier et aujourd'hui ».</p>",
  quiz: [
    { q: "Moyen traditionnel d'annoncer un décès :", r: ["le tam-tam", "la télévision", "la poste"], b: 0, e: "Le tam-tam parleur transmettait les messages." },
    { q: "Pourquoi la morgue a-t-elle changé les funérailles ?", r: ["Elle permet d'attendre la famille dispersée", "Elle les a interdites", "Elle ne change rien"], b: 0, e: "Les familles vivent souvent loin du village." },
    { q: "Une critique fréquente des funérailles actuelles :", r: ["leur coût élevé", "leur brièveté", "leur absence"], b: 0, e: "Elles peuvent appauvrir les familles." }
  ]
});

VRT_L("tle-orient-temps", {
  c: "Tle A", m: "orientation", cle: "La gestion du temps", titre: "Gérer son temps en classe d'examen", duree: 15,
  scenes: ["tle-orientation-choisir-sa-filiere"],
  accroche: "24 heures, 7 matières, 1 bac : un emploi du temps qui marche.",
  intro: "L'année du baccalauréat passe vite. Ceux qui réussissent ne travaillent pas forcément plus : ils organisent mieux leur temps.",
  objectifs: ["faire le bilan de son emploi du temps", "construire un planning réaliste", "lutter contre la procrastination"],
  parties: [
    { t: "Faire le bilan", html:
      "<p>Pendant une semaine, note ce que tu fais heure par heure : cours, trajets, travaux domestiques, téléphone, sommeil, révisions. Tu découvriras souvent des « heures perdues » (réseaux sociaux, attentes).</p>",
      retenir: "On ne gère bien que ce que l'on mesure." },
    { t: "Construire un planning", html:
      "<ul><li>Bloque d'abord le <strong>sommeil</strong> (7 à 8 h) et les cours.</li><li>Prévois des séances courtes (40 à 50 min) suivies de pauses.</li><li>Donne plus de temps aux matières à <strong>fort coefficient</strong> et à celles où tu es faible.</li><li>Garde un temps libre pour le repos, le sport, la famille.</li></ul>",
      illus: { legende: "Exemple d'une soirée bien découpée.", svg:
      "<svg viewBox='0 0 460 120' role='img' aria-label='Planning d une soirée'><g font-size='11' text-anchor='middle'><rect x='10' y='40' width='80' height='40' rx='8' fill='#DDF2F4'/><text x='50' y='64' fill='#0A4F55'>16h-17h repos</text><rect x='94' y='40' width='100' height='40' rx='8' fill='#0E7C86'/><text x='144' y='64' fill='#fff'>17h-18h philo</text><rect x='198' y='40' width='30' height='40' rx='8' fill='#FFC93C'/><text x='213' y='64' fill='#142554'>pause</text><rect x='232' y='40' width='100' height='40' rx='8' fill='#0E7C86'/><text x='282' y='64' fill='#fff'>18h15 français</text><rect x='336' y='40' width='114' height='40' rx='8' fill='#E4E9F2'/><text x='393' y='64' fill='#0C2A6A'>dîner, famille</text></g><text x='10' y='104' font-size='12' fill='#636A80'>Séances de 45 à 50 min, pauses courtes, matières fortes en premier.</text></svg>" },
      retenir: "Un planning réaliste vaut mieux qu'un planning parfait jamais suivi." },
    { t: "Vaincre la procrastination", html:
      "<ul><li>Commence par une tâche de 5 minutes : le plus dur est de commencer.</li><li>Téléphone en mode silencieux et hors de portée pendant la séance.</li><li>Coche ce qui est fait : voir ses progrès motive.</li></ul>",
      retenir: "Commencer petit, mais commencer aujourd'hui." }
  ],
  revision: ["Bilan d'une semaine heure par heure.", "Sommeil et cours d'abord.", "Séances de 40 à 50 min + pauses.", "Priorité aux forts coefficients et aux faiblesses.", "Téléphone éloigné pendant le travail."],
  exo: "<p>Construis ton planning de la semaine prochaine (soirées et week-end) et affiche-le chez toi.</p>",
  quiz: [
    { q: "Combien d'heures de sommeil viser ?", r: ["4 à 5 h", "7 à 8 h", "12 h"], b: 1, e: "Le sommeil fixe les apprentissages." },
    { q: "Durée conseillée d'une séance de travail :", r: ["40 à 50 min", "4 heures sans pause", "10 min"], b: 0, e: "Suivie d'une pause courte." },
    { q: "Contre la procrastination :", r: ["attendre l'inspiration", "commencer par une tâche de 5 min", "tout faire la veille"], b: 1, e: "Le plus dur est de commencer." }
  ]
});

VRT_L("tle-orient-bac", {
  c: "Tle A", m: "orientation", cle: "La préparation à long terme", titre: "Préparer le baccalauréat à long terme", duree: 15,
  scenes: ["tle-orientation-entretien-affirmation"],
  accroche: "Le bac se gagne en octobre, pas la veille de l'examen.",
  intro: "Réussir le baccalauréat est un marathon. La préparation commence dès la rentrée, avec une méthode et des objectifs.",
  objectifs: ["se fixer des objectifs", "organiser les révisions sur l'année", "prendre soin de sa santé"],
  parties: [
    { t: "Se fixer des objectifs", html:
      "<p>Calcule la moyenne visée et fixe un objectif par matière, en tenant compte des <strong>coefficients</strong> de ta série. Un objectif doit être précis, mesurable et daté : « passer de 8 à 11 en philosophie au deuxième trimestre ».</p>",
      retenir: "Un objectif flou ne guide pas ; un objectif chiffré, oui." },
    { t: "Organiser l'année", html:
      "<ul><li><strong>Au fil des cours</strong> : relire chaque leçon le jour même, faire des fiches.</li><li><strong>Chaque mois</strong> : traiter un sujet d'examen par matière (annales corrigées).</li><li><strong>Aux congés</strong> : réviser les chapitres passés, combler les lacunes.</li><li><strong>Les deux derniers mois</strong> : sujets en conditions réelles, chronométrés.</li></ul>",
      illus: { legende: "Une montée progressive vers l'examen.", svg:
      "<svg viewBox='0 0 460 150' role='img' aria-label='Préparation progressive du baccalauréat'><path d='M20 130 L120 110 L220 85 L320 55 L430 20' fill='none' stroke='#0E7C86' stroke-width='4' stroke-linecap='round'/><g fill='#FFC93C' stroke='#0A4F55' stroke-width='2'><circle cx='20' cy='130' r='7'/><circle cx='120' cy='110' r='7'/><circle cx='220' cy='85' r='7'/><circle cx='320' cy='55' r='7'/><circle cx='430' cy='20' r='9'/></g><g font-size='11' fill='#142554'><text x='24' y='148'>rentrée : fiches</text><text x='110' y='132'>annales chaque mois</text><text x='190' y='108'>congés : lacunes</text><text x='270' y='78'>sujets chronométrés</text><text x='392' y='44' font-weight='700'>BAC</text></g></svg>" },
      retenir: "Régularité + annales = confiance le jour J." },
    { t: "Prendre soin de soi", html:
      "<p>Sommeil, alimentation équilibrée, activité physique, moments de détente : un corps en forme apprend mieux. En cas de stress, parle à un conseiller d'orientation, un enseignant ou un parent.</p>",
      retenir: "La santé fait partie de la préparation." }
  ],
  revision: ["Objectifs précis, chiffrés, datés.", "Relire chaque jour, faire des fiches.", "Une annale par mois et par matière.", "Sujets chronométrés en fin d'année.", "Santé et soutien : conseiller d'orientation."],
  exo: "<p>Écris tes trois objectifs du trimestre (matière, note visée, moyen d'y arriver).</p>",
  quiz: [
    { q: "Quand commence la préparation du bac ?", r: ["La veille", "Dès la rentrée", "Après les résultats"], b: 1, e: "C'est un marathon." },
    { q: "Un bon objectif est…", r: ["« faire mieux »", "chiffré et daté", "secret"], b: 1, e: "On peut alors mesurer ses progrès." },
    { q: "En fin d'année, on privilégie…", r: ["les sujets chronométrés", "les nouvelles leçons", "le repos complet"], b: 0, e: "Pour s'habituer au temps de l'épreuve." }
  ]
});

/* Leçons rédigées VÉRITAS — latin, grec, sciences (séries A), EPS, arts, travail manuel, ESF. */
VRT_L("6e-la-origine", {
  c: "6e", m: "latin", cle: "Origine et importance du latin", titre: "Origine et importance du latin", duree: 15,
  accroche: "Tu parles déjà un peu latin sans le savoir.",
  intro: "Agenda, bonus, curriculum vitae, et cetera… Ces mots sont latins. Le français lui-même descend du latin. D'où vient cette langue et pourquoi l'étudier aujourd'hui ?",
  objectifs: ["situer l'origine du latin", "nommer les langues romanes", "repérer le latin dans notre vie quotidienne"],
  parties: [
    { t: "La langue de Rome", html:
      "<p>Le latin était la langue du <strong>Latium</strong>, une région d'Italie centrale où se trouve <strong>Rome</strong>. Selon la tradition, Rome est fondée en <strong>753 avant J.-C.</strong> En conquérant un immense empire, autour de la Méditerranée, les Romains ont répandu leur langue jusqu'en Gaule (la France actuelle), en Espagne et en Afrique du Nord.</p>",
      illus: { legende: "Du Latium à l'Empire : le latin voyage avec les Romains.", svg:
      "<svg viewBox='0 0 460 190' role='img' aria-label='Expansion du latin depuis Rome'><rect x='0' y='0' width='460' height='190' rx='14' fill='#DBE8FE'/><path d='M40 40 Q120 20 200 40 L230 70 Q260 60 300 70 L380 60 Q430 80 420 120 L330 150 Q260 170 180 150 L90 160 Q30 130 40 40Z' fill='#E4E9F2' stroke='#8C9BC0' stroke-width='2'/><circle cx='240' cy='95' r='9' fill='#FFC93C' stroke='#071A45' stroke-width='2'/><text x='254' y='92' font-size='13' font-weight='700' fill='#071A45'>ROME</text><g stroke='#0C2A6A' stroke-width='2' stroke-dasharray='5 4' fill='none'><path d='M235 90 Q180 60 120 60'/><path d='M235 100 Q160 120 100 140'/><path d='M248 102 Q300 140 360 140'/><path d='M248 88 Q310 60 370 80'/></g><g font-size='11' fill='#0C2A6A'><text x='86' y='54'>Gaule</text><text x='60' y='150'>Hispanie</text><text x='340' y='160'>Afrique</text><text x='360' y='72'>Orient</text></g><text x='18' y='180' font-size='11' fill='#636A80'>Schéma simplifié, sans échelle.</text></svg>" },
      retenir: "Latin = langue de Rome, répandue par la conquête romaine." },
    { t: "Une langue mère", html:
      "<p>En se transformant pendant des siècles dans les différentes régions, le latin parlé a donné naissance aux <strong>langues romanes</strong> : le <strong>français</strong>, l'<strong>italien</strong>, l'<strong>espagnol</strong>, le <strong>portugais</strong> et le <strong>roumain</strong>.</p><div class='ex'><b>Exemple : un mot, cinq langues</b>Du latin <em>noctem</em> (la nuit) viennent nuit, notte, noche, noite, noapte.</div>",
      retenir: "Le français est une langue romane : il descend du latin." },
    { t: "Le latin aujourd'hui", html:
      "<ul><li>Dans le <strong>vocabulaire</strong> : aquarium, maximum, alibi, ex aequo, a priori.</li><li>Dans les <strong>sciences</strong> : les êtres vivants ont un nom latin (<em>Homo sapiens</em>, l'être humain).</li><li>Dans le <strong>droit</strong>, la <strong>médecine</strong> et les <strong>devises</strong>.</li></ul><div class='astuce'><b>Astuce</b>Connaître la racine latine aide à deviner le sens d'un mot français : <em>aqua</em> (l'eau) → aquatique, aquarium, aqueduc.</div>",
      retenir: "Étudier le latin, c'est mieux comprendre le français." }
  ],
  revision: ["Latin : langue du Latium et de Rome (fondée en 753 av. J.-C. selon la tradition).", "Répandu par l'Empire romain.", "Langues romanes : français, italien, espagnol, portugais, roumain.", "Présent dans le vocabulaire, les sciences, le droit."],
  exo: "<p>Trouve trois mots français formés sur <em>terra</em> (la terre) et trois sur <em>manus</em> (la main).</p>",
  quiz: [
    { q: "Le latin était la langue…", r: ["d'Athènes", "de Rome", "de Carthage"], b: 1, e: "Rome se trouve dans le Latium." },
    { q: "Laquelle n'est pas une langue romane ?", r: ["L'espagnol", "Le roumain", "L'anglais"], b: 2, e: "L'anglais est une langue germanique, même s'il a beaucoup emprunté au latin." },
    { q: "« aqua » signifie…", r: ["l'air", "l'eau", "le feu"], b: 1, e: "D'où aquarium, aquatique." }
  ]
});

VRT_L("6e-la-jours", {
  c: "6e", m: "latin", cle: "Les jours de la semaine en latin", titre: "Les jours de la semaine et les mois en latin", duree: 15,
  accroche: "Lundi, c'est le jour de la Lune ; mardi, celui de Mars.",
  intro: "Les noms de nos jours et de nos mois viennent tout droit du latin. Derrière chacun se cache un astre ou un dieu romain.",
  objectifs: ["connaître les jours en latin", "expliquer l'origine des noms des mois", "comprendre pourquoi septembre n'est pas le 7ᵉ mois"],
  parties: [
    { t: "Les jours : des astres et des dieux", html:
      "<div class='tab-scroll'><table><thead><tr><th>Latin</th><th>Sens</th><th>Français</th></tr></thead><tbody><tr><td>dies Lunae</td><td>jour de la Lune</td><td>lundi</td></tr><tr><td>dies Martis</td><td>jour de Mars</td><td>mardi</td></tr><tr><td>dies Mercurii</td><td>jour de Mercure</td><td>mercredi</td></tr><tr><td>dies Iovis</td><td>jour de Jupiter</td><td>jeudi</td></tr><tr><td>dies Veneris</td><td>jour de Vénus</td><td>vendredi</td></tr><tr><td>dies Saturni</td><td>jour de Saturne</td><td>samedi (nom d'origine différente)</td></tr><tr><td>dies Solis, puis dies Dominica</td><td>jour du Soleil, puis jour du Seigneur</td><td>dimanche</td></tr></tbody></table></div>",
      retenir: "-di vient de dies : le jour." },
    { t: "Les mois", html:
      "<p>L'ancien calendrier romain commençait en <strong>mars</strong>. Voilà pourquoi :</p><ul><li><strong>September</strong> vient de <em>septem</em> (7), <strong>October</strong> de <em>octo</em> (8), <strong>November</strong> de <em>novem</em> (9), <strong>December</strong> de <em>decem</em> (10) ;</li><li><strong>Iulius</strong> (juillet) honore Jules César, <strong>Augustus</strong> (août) l'empereur Auguste ;</li><li><strong>Ianuarius</strong> (janvier) est le mois de Janus, dieu des portes et des commencements.</li></ul>",
      illus: { legende: "Le calendrier romain primitif commençait en mars : septembre était le 7ᵉ mois.", svg:
      "<svg viewBox='0 0 460 200' role='img' aria-label='Roue des mois romains'><circle cx='130' cy='100' r='86' fill='#E4E9F2' stroke='#071A45' stroke-width='2'/><g font-size='11' text-anchor='middle' fill='#0C2A6A'><text x='130' y='28' font-weight='700'>1 Martius</text><text x='196' y='54'>2 Aprilis</text><text x='212' y='104'>3 Maius</text><text x='196' y='152'>4 Iunius</text><text x='130' y='182'>5 Quintilis</text><text x='64' y='152'>6 Sextilis</text><text x='48' y='104' font-weight='700' fill='#9A6F00'>7 September</text><text x='64' y='54' font-weight='700' fill='#9A6F00'>8 October</text></g><circle cx='130' cy='100' r='22' fill='#FFC93C'/><text x='130' y='104' text-anchor='middle' font-size='11' font-weight='700' fill='#071A45'>Rome</text><g font-size='13' fill='#142554'><text x='250' y='60'>septem = 7 → septembre</text><text x='250' y='88'>octo = 8 → octobre</text><text x='250' y='116'>novem = 9 → novembre</text><text x='250' y='144'>decem = 10 → décembre</text></g></svg>" },
      retenir: "Septembre = 7ᵉ mois… d'une année qui commençait en mars." },
    { t: "Le latin au calendrier", html:
      "<div class='savais'><b>Le savais-tu ?</b>Juillet s'appelait d'abord <em>Quintilis</em> (le 5ᵉ) et août <em>Sextilis</em> (le 6ᵉ), avant d'être renommés en l'honneur de Jules César et d'Auguste.</div>",
      retenir: "Chaque nom de mois raconte un peu d'histoire romaine." }
  ],
  revision: ["dies = jour.", "Lune, Mars, Mercure, Jupiter, Vénus, Saturne, Soleil.", "Calendrier romain primitif : début en mars.", "September (7), October (8), November (9), December (10).", "Iulius (César), Augustus (Auguste), Ianuarius (Janus)."],
  exo: "<p>Écris la date d'aujourd'hui avec le nom latin du jour et du mois.</p>",
  quiz: [
    { q: "« dies Martis » donne…", r: ["mercredi", "mardi", "lundi"], b: 1, e: "Le jour du dieu Mars." },
    { q: "Pourquoi « septembre » contient-il « sept » ?", r: ["C'était le 7ᵉ mois", "Il a 7 semaines", "Par hasard"], b: 0, e: "L'année romaine commençait en mars." },
    { q: "Janvier vient du dieu…", r: ["Janus", "Jupiter", "Mars"], b: 0, e: "Dieu des portes et des débuts." }
  ]
});

VRT_L("4e-gr-alphabet", {
  c: "4e", m: "grec", cle: "Alphabet grec : écriture et prononciation", titre: "L'alphabet grec : écriture et prononciation", duree: 20,
  accroche: "Alpha + bêta = alphabet : 24 lettres à apprivoiser.",
  intro: "Le mot « alphabet » vient des deux premières lettres grecques : alpha et bêta. Apprends à lire et à écrire les 24 lettres de l'alphabet grec.",
  objectifs: ["connaître les 24 lettres et leur nom", "prononcer et transcrire chaque lettre", "reconnaître des mots français d'origine grecque"],
  parties: [
    { t: "D'où vient l'alphabet grec ?", html:
      "<p>Vers le VIIIᵉ siècle avant J.-C., les Grecs adaptent l'alphabet des <strong>Phéniciens</strong>, qui ne notait que les consonnes. Les Grecs y ajoutent les <strong>voyelles</strong>. C'est de cet alphabet que viennent l'alphabet latin, puis le nôtre.</p>",
      retenir: "Les Grecs ont été les premiers à noter régulièrement les voyelles." },
    { t: "Les 24 lettres", html:
      "<div class='tab-scroll'><table><thead><tr><th>Lettre</th><th>Nom</th><th>Son</th><th>Lettre</th><th>Nom</th><th>Son</th></tr></thead><tbody>" +
      "<tr><td>Α α</td><td>alpha</td><td>a</td><td>Ν ν</td><td>nu</td><td>n</td></tr><tr><td>Β β</td><td>bêta</td><td>b</td><td>Ξ ξ</td><td>xi</td><td>ks</td></tr><tr><td>Γ γ</td><td>gamma</td><td>g (dur)</td><td>Ο ο</td><td>omicron</td><td>o bref</td></tr><tr><td>Δ δ</td><td>delta</td><td>d</td><td>Π π</td><td>pi</td><td>p</td></tr><tr><td>Ε ε</td><td>epsilon</td><td>e bref</td><td>Ρ ρ</td><td>rhô</td><td>r</td></tr><tr><td>Ζ ζ</td><td>zêta</td><td>dz</td><td>Σ σ ς</td><td>sigma</td><td>s</td></tr><tr><td>Η η</td><td>êta</td><td>ê long</td><td>Τ τ</td><td>tau</td><td>t</td></tr><tr><td>Θ θ</td><td>thêta</td><td>th</td><td>Υ υ</td><td>upsilon</td><td>u (ü)</td></tr><tr><td>Ι ι</td><td>iota</td><td>i</td><td>Φ φ</td><td>phi</td><td>ph</td></tr><tr><td>Κ κ</td><td>kappa</td><td>k</td><td>Χ χ</td><td>khi</td><td>kh</td></tr><tr><td>Λ λ</td><td>lambda</td><td>l</td><td>Ψ ψ</td><td>psi</td><td>ps</td></tr><tr><td>Μ μ</td><td>mu</td><td>m</td><td>Ω ω</td><td>oméga</td><td>ô long</td></tr></tbody></table></div>" +
      "<div class='attention'><b>Attention aux faux amis</b>Η se lit « ê » (et non « h ») ; Ρ se lit « r » ; Χ se lit « kh ». Le sigma s'écrit ς en fin de mot : λόγος.</div>",
      retenir: "24 lettres ; σ devient ς à la fin d'un mot." },
    { t: "Le grec dans nos mots", html:
      "<ul><li><strong>φίλος</strong> (philos, ami) + <strong>σοφία</strong> (sophia, sagesse) → philosophie.</li><li><strong>γῆ</strong> (gê, terre) + <strong>γράφω</strong> (graphô, écrire) → géographie.</li><li><strong>βίος</strong> (bios, vie) + <strong>λόγος</strong> (logos, discours, étude) → biologie.</li></ul>",
      retenir: "Beaucoup de mots savants du français sont faits de racines grecques." }
  ],
  revision: ["Alphabet adapté du phénicien, avec ajout des voyelles.", "24 lettres, d'alpha à oméga.", "η = ê, ρ = r, χ = kh, ψ = ps, φ = ph.", "Sigma final : ς.", "Racines grecques : philo-, -sophie, géo-, -graphie, bio-, -logie."],
  exo: "<p>Transcris en lettres latines : Ἑλλάς, Ὅμηρος, φιλοσοφία. <em>(Hellas, Homêros, philosophia)</em></p>",
  quiz: [
    { q: "Combien de lettres compte l'alphabet grec ?", r: ["24", "26", "22"], b: 0, e: "D'alpha à oméga." },
    { q: "La lettre η se prononce…", r: ["h", "ê", "n"], b: 1, e: "C'est l'êta, un e long." },
    { q: "« Philosophie » signifie…", r: ["amour de la sagesse", "étude de la Terre", "écriture de la vie"], b: 0, e: "philos (ami) + sophia (sagesse)." }
  ]
});

VRT_L("3e-gr-esope-homere", {
  c: "3e", m: "grec", cle: "Esope, Homère et leurs genres littéraires", titre: "Ésope, Homère et leurs genres littéraires", duree: 15,
  accroche: "L'épopée des héros, la fable des animaux : deux trésors grecs.",
  intro: "Deux auteurs grecs ont traversé les siècles : Homère, le poète des héros, et Ésope, le conteur des animaux. Ils ont fondé deux genres encore vivants : l'épopée et la fable.",
  objectifs: ["présenter Homère et Ésope", "caractériser l'épopée et la fable", "mesurer leur influence"],
  parties: [
    { t: "Homère et l'épopée", html:
      "<p>Selon la tradition, <strong>Homère</strong> est un poète aveugle du VIIIᵉ siècle avant J.-C. On lui attribue deux grandes épopées :</p><ul><li>l'<strong>Iliade</strong> : un épisode de la guerre de Troie, autour de la colère d'Achille ;</li><li>l'<strong>Odyssée</strong> : le long retour d'Ulysse vers son île d'Ithaque.</li></ul><div class='def'><b>Définition</b>L'épopée est un long poème qui raconte les exploits de héros, souvent avec l'intervention des dieux. Elle était récitée par des aèdes.</div>",
      retenir: "Homère : Iliade et Odyssée, modèles de l'épopée." },
    { t: "Ésope et la fable", html:
      "<p><strong>Ésope</strong> (VIᵉ siècle avant J.-C.) est, selon la tradition, un esclave devenu célèbre pour ses <strong>fables</strong> : de courts récits, souvent avec des animaux, qui se terminent par une <strong>morale</strong>.</p><div class='savais'><b>Le savais-tu ?</b>Au XVIIᵉ siècle, le Français Jean de La Fontaine a repris et réécrit en vers de nombreuses fables d'Ésope.</div>",
      illus: { legende: "Deux genres, deux formes.", svg:
      "<svg viewBox='0 0 460 170' role='img' aria-label='Comparaison épopée et fable'><rect x='10' y='14' width='210' height='142' rx='16' fill='#E4E9F2' stroke='#071A45' stroke-width='2'/><text x='115' y='42' text-anchor='middle' font-size='16' font-weight='700' fill='#0C2A6A'>ÉPOPÉE · Homère</text><g font-size='12' fill='#142554'><text x='26' y='70'>• long poème</text><text x='26' y='92'>• héros, dieux, combats</text><text x='26' y='114'>• récité par l'aède</text><text x='26' y='136'>• Iliade, Odyssée</text></g><rect x='240' y='14' width='210' height='142' rx='16' fill='#FFF6DA' stroke='#6B4E00' stroke-width='2'/><text x='345' y='42' text-anchor='middle' font-size='16' font-weight='700' fill='#6B4E00'>FABLE · Ésope</text><g font-size='12' fill='#142554'><text x='256' y='70'>• récit court</text><text x='256' y='92'>• animaux qui parlent</text><text x='256' y='114'>• une morale</text><text x='256' y='136'>• reprise par La Fontaine</text></g></svg>" },
      retenir: "Fable = récit court + morale." },
    { t: "Leur héritage", html:
      "<p>Des expressions viennent d'eux : « une odyssée » (un long voyage plein d'aventures), « le talon d'Achille » (le point faible). Les conteurs africains utilisent aussi des animaux pour transmettre une leçon de vie : la fable est un genre universel.</p>",
      retenir: "Épopée et fable vivent encore dans nos expressions et nos contes." }
  ],
  revision: ["Homère (VIIIᵉ s. av. J.-C.) : Iliade, Odyssée.", "Épopée : long poème héroïque.", "Ésope (VIᵉ s. av. J.-C.) : fables avec morale.", "La Fontaine a repris Ésope.", "Expressions : une odyssée, le talon d'Achille."],
  exo: "<p>Invente une courte fable (dix lignes) avec deux animaux de chez nous et termine-la par une morale.</p>",
  quiz: [
    { q: "Qui est le héros de l'Odyssée ?", r: ["Achille", "Ulysse", "Hector"], b: 1, e: "Son retour vers Ithaque." },
    { q: "Une fable se termine par…", r: ["une morale", "une bataille", "un chant"], b: 0, e: "C'est la leçon à retenir." },
    { q: "« Le talon d'Achille » désigne…", r: ["une force", "un point faible", "une chaussure"], b: 1, e: "Le seul endroit où Achille était vulnérable." }
  ]
});

VRT_L("tle-sc-microscopie", {
  c: "Tle A", m: "sciences", cle: "Cellule en microscopie optique", titre: "La cellule en microscopie optique", duree: 20,
  accroche: "Un oignon, une goutte d'eau, un microscope : la vie apparaît en petites cases.",
  intro: "Tous les êtres vivants sont faits de cellules. Au microscope optique, un simple épiderme d'oignon révèle des centaines de petites « cases » : ce sont des cellules.",
  objectifs: ["énoncer la théorie cellulaire", "calculer un grossissement", "comparer cellule animale et cellule végétale"],
  parties: [
    { t: "La cellule, unité du vivant", html:
      "<div class='def'><b>Théorie cellulaire</b>Tout être vivant est formé d'une ou de plusieurs cellules ; la cellule est l'unité de structure et de fonctionnement du vivant ; toute cellule provient d'une autre cellule.</div><p>Elle a été formulée au XIXᵉ siècle (Schleiden, Schwann, puis Virchow), grâce aux progrès du microscope.</p>",
      retenir: "Pas de vie sans cellule." },
    { t: "Utiliser le microscope optique", html:
      "<p class='formule'>grossissement = grossissement de l'objectif × grossissement de l'oculaire</p><div class='ex'><b>Exemple</b>Objectif ×40 et oculaire ×10 : grossissement total ×400.</div><ol><li>Poser la lame sur la platine, objectif le plus faible.</li><li>Mettre au point avec la vis macrométrique, puis micrométrique.</li><li>Passer ensuite aux objectifs plus forts.</li></ol>",
      retenir: "Toujours commencer par le plus faible grossissement." },
    { t: "Cellule animale, cellule végétale", html:
      "<p>Les deux possèdent une <strong>membrane plasmique</strong>, un <strong>cytoplasme</strong> et un <strong>noyau</strong>. La cellule végétale a en plus une <strong>paroi</strong> rigide, une grande <strong>vacuole</strong> et souvent des <strong>chloroplastes</strong>.</p>",
      illus: { legende: "Cellule animale (à gauche) et cellule végétale (à droite).", svg:
      "<svg viewBox='0 0 460 200' role='img' aria-label='Cellule animale et cellule végétale'><ellipse cx='110' cy='100' rx='90' ry='70' fill='#E0F5E5' stroke='#00520B' stroke-width='2.5'/><circle cx='125' cy='95' r='24' fill='#7FCB8C' stroke='#00520B' stroke-width='2'/><circle cx='130' cy='92' r='6' fill='#00520B'/><g font-size='11' fill='#142554'><text x='30' y='190'>membrane · cytoplasme · noyau</text></g><rect x='250' y='30' width='190' height='140' rx='8' fill='#C9E7CF' stroke='#00520B' stroke-width='5'/><rect x='258' y='38' width='174' height='124' rx='5' fill='#E0F5E5' stroke='#00520B' stroke-width='1.5'/><rect x='290' y='52' width='120' height='90' rx='30' fill='#DBE8FE' stroke='#1E499B' stroke-width='1.5'/><circle cx='272' cy='60' r='12' fill='#7FCB8C' stroke='#00520B' stroke-width='1.5'/><g fill='#007E11'><ellipse cx='275' cy='130' rx='9' ry='5'/><ellipse cx='420' cy='60' rx='9' ry='5'/><ellipse cx='418' cy='140' rx='9' ry='5'/></g><g font-size='11' fill='#142554'><text x='318' y='100'>vacuole</text><text x='252' y='190'>+ paroi, vacuole, chloroplastes</text></g></svg>" },
      retenir: "Végétale = animale + paroi + vacuole + chloroplastes." }
  ],
  revision: ["Théorie cellulaire : la cellule est l'unité du vivant.", "Grossissement = objectif × oculaire.", "Commencer au plus faible grossissement.", "Membrane, cytoplasme, noyau : communs.", "Paroi, vacuole, chloroplastes : végétale."],
  exo: "<p>Un élève observe avec un objectif ×10 et un oculaire ×15. Quel est le grossissement ? <em>(×150)</em></p>",
  quiz: [
    { q: "Objectif ×40, oculaire ×10 : grossissement ?", r: ["×50", "×400", "×4"], b: 1, e: "On multiplie." },
    { q: "Quel élément est propre à la cellule végétale ?", r: ["Le noyau", "La paroi", "La membrane"], b: 1, e: "Elle donne sa rigidité à la cellule." },
    { q: "Toute cellule provient…", r: ["de la matière inerte", "d'une autre cellule", "de l'eau"], b: 1, e: "Troisième principe de la théorie cellulaire." }
  ]
});

VRT_L("tle-sc-organites", {
  c: "Tle A", m: "sciences", cle: "Organisation de la cellule en microscopie électronique", titre: "La cellule en microscopie électronique : les organites", duree: 20,
  accroche: "Mille fois plus près : la cellule devient une usine.",
  intro: "Le microscope électronique grossit des centaines de milliers de fois. Il révèle, dans la cellule, de petites structures spécialisées : les organites.",
  objectifs: ["citer les principaux organites", "associer chaque organite à son rôle", "comparer les deux microscopes"],
  parties: [
    { t: "Pourquoi le microscope électronique ?", html:
      "<p>Le microscope optique utilise la lumière et ne distingue pas des détails plus petits qu'environ 0,2 micromètre. Le microscope électronique utilise un faisceau d'électrons : il montre l'<strong>ultrastructure</strong> de la cellule.</p>",
      retenir: "Électrons au lieu de lumière : bien plus de détails." },
    { t: "Les organites et leurs rôles", html:
      "<ul><li><strong>Noyau</strong> (enveloppe percée de pores, nucléole) : contient l'ADN, dirige la cellule.</li><li><strong>Mitochondrie</strong> : respiration cellulaire, produit l'énergie.</li><li><strong>Chloroplaste</strong> (végétaux) : photosynthèse.</li><li><strong>Ribosomes</strong> : fabriquent les protéines.</li><li><strong>Réticulum endoplasmique</strong> : synthèse et transport de molécules.</li><li><strong>Appareil de Golgi</strong> : modifie, emballe et expédie les protéines.</li><li><strong>Lysosomes</strong> : digestion intracellulaire.</li></ul>",
      retenir: "Chaque organite a un métier : la cellule est une usine organisée." },
    { t: "Une cellule, deux regards", html:
      "<div class='tab-scroll'><table><thead><tr><th></th><th>Optique</th><th>Électronique</th></tr></thead><tbody><tr><th>Rayonnement</th><td>lumière</td><td>électrons</td></tr><tr><th>Grossissement</th><td>jusqu'à environ ×1 500</td><td>plusieurs centaines de milliers</td></tr><tr><th>Échantillon</th><td>peut être vivant</td><td>préparé, mort</td></tr></tbody></table></div>",
      retenir: "L'optique montre la cellule ; l'électronique montre ses organites." }
  ],
  revision: ["Microscope électronique : faisceau d'électrons, ultrastructure.", "Noyau : ADN, direction.", "Mitochondrie : énergie ; chloroplaste : photosynthèse.", "Ribosomes : protéines ; Golgi : emballage ; lysosomes : digestion."],
  exo: "<p>Compare la cellule à une usine : associe chaque organite à un service (direction, centrale électrique, atelier, expédition…).</p>",
  quiz: [
    { q: "Quel organite produit l'énergie ?", r: ["La mitochondrie", "Le lysosome", "La vacuole"], b: 0, e: "Siège de la respiration cellulaire." },
    { q: "Les protéines sont fabriquées par…", r: ["les ribosomes", "la paroi", "les pores"], b: 0, e: "Sur le réticulum ou libres dans le cytoplasme." },
    { q: "Le microscope électronique utilise…", r: ["la lumière", "des électrons", "des ultrasons"], b: 1, e: "D'où son pouvoir de séparation." }
  ]
});

VRT_L("6e-eps-piste", {
  c: "6e", m: "eps", cle: "Le vocabulaire spécifique d", titre: "La piste d'athlétisme et son vocabulaire", duree: 15,
  accroche: "Couloir, corde, décalage : parle comme un athlète.",
  intro: "Avant de courir sur une piste, il faut en connaître les parties et les règles. Elles sont les mêmes au stade de ton lycée et aux Jeux olympiques.",
  objectifs: ["nommer les parties d'une piste", "comprendre le sens de course et les couloirs", "expliquer les départs décalés"],
  parties: [
    { t: "Une piste de 400 mètres", html:
      "<p>La piste réglementaire mesure <strong>400 m</strong> dans le premier couloir. Elle comprend <strong>deux lignes droites</strong> et <strong>deux virages</strong>. Elle compte en général <strong>8 couloirs</strong>, numérotés de l'intérieur vers l'extérieur. Le bord intérieur s'appelle la <strong>corde</strong>.</p>",
      retenir: "400 m au couloir 1 ; couloir 1 = le plus proche de la corde." },
    { t: "Le sens et les départs", html:
      "<ul><li>On court dans le <strong>sens inverse des aiguilles d'une montre</strong> : la corde est à gauche du coureur.</li><li>La <strong>ligne d'arrivée</strong> est commune à toutes les courses.</li><li>Dans les courses avec virages en couloirs (200 m, 400 m), les départs sont <strong>décalés</strong> : le couloir extérieur, plus long dans le virage, part devant.</li></ul>",
      retenir: "Départs décalés = même distance pour tous les couloirs." },
    { t: "Le vocabulaire", html:
      "<div class='tab-scroll'><table><tbody><tr><th>Couloir</th><td>bande où le coureur doit rester</td></tr><tr><th>Corde</th><td>bord intérieur de la piste</td></tr><tr><th>Ligne de départ / d'arrivée</th><td>lignes blanches transversales</td></tr><tr><th>Zone de transmission</th><td>espace où se passe le témoin au relais</td></tr><tr><th>Faux départ</th><td>départ avant le signal</td></tr></tbody></table></div>",
      retenir: "Respecter son couloir, c'est respecter la règle et les autres." }
  ],
  revision: ["Piste de 400 m au couloir 1, 8 couloirs.", "2 lignes droites, 2 virages ; corde = bord intérieur.", "Sens inverse des aiguilles d'une montre.", "Départs décalés au 200 m et au 400 m."],
  exo: "<p>Dessine une piste, place les couloirs, la ligne d'arrivée et le sens de course.</p>",
  quiz: [
    { q: "Combien mesure un tour de piste au couloir 1 ?", r: ["200 m", "400 m", "1 000 m"], b: 1, e: "Deux droites et deux virages." },
    { q: "Pourquoi les départs du 400 m sont-ils décalés ?", r: ["Pour l'égalité des distances", "Par tirage au sort", "Pour gagner du temps"], b: 0, e: "Les couloirs extérieurs sont plus longs dans les virages." },
    { q: "La corde est…", r: ["le bord extérieur", "le bord intérieur", "la ligne d'arrivée"], b: 1, e: "Le couloir 1 la longe." }
  ]
});

VRT_L("6e-eps-bras-jambes", {
  c: "6e", m: "eps", cle: "Synchronisation bras-jambes dans les déplacements : les courses", titre: "Courir mieux : la coordination bras-jambes", duree: 15,
  accroche: "Bras gauche avec jambe droite : le secret d'une course fluide.",
  intro: "Courir vite, ce n'est pas seulement bouger les jambes. Les bras donnent le rythme et l'équilibre.",
  objectifs: ["décrire la coordination croisée", "adopter une bonne posture", "s'échauffer avant de courir"],
  parties: [
    { t: "La coordination croisée", html:
      "<p>Quand la <strong>jambe droite</strong> avance, c'est le <strong>bras gauche</strong> qui avance, et inversement. Ce mouvement croisé équilibre le corps et évite qu'il tourne sur lui-même.</p>",
      retenir: "Bras et jambe opposés avancent ensemble." },
    { t: "La bonne posture", html:
      "<ul><li>Regard loin devant, tête dans l'axe du corps.</li><li>Bras pliés à environ 90°, épaules relâchées.</li><li>Les mains vont d'avant en arrière, sans traverser devant la poitrine.</li><li>Appuis sur l'avant du pied, genoux qui montent.</li></ul><div class='astuce'><b>Astuce</b>Pour accélérer, accélère d'abord les bras : les jambes suivent le rythme.</div>",
      retenir: "Coudes à 90°, épaules relâchées, regard devant." },
    { t: "S'échauffer et récupérer", html:
      "<p>Avant l'effort : footing léger, rotations des articulations, montées de genoux, talons-fesses. Après : marche, étirements doux, boire de l'eau.</p>",
      retenir: "Un corps échauffé se blesse moins." }
  ],
  revision: ["Coordination croisée : bras opposé à la jambe.", "Coudes à 90°, épaules relâchées.", "Appuis sur l'avant du pied.", "Échauffement avant, récupération après."],
  exo: "<p>Filme ou observe un camarade qui court : sa coordination bras-jambes est-elle croisée ? Ses bras traversent-ils devant la poitrine ?</p>",
  quiz: [
    { q: "Quand la jambe droite avance, quel bras avance ?", r: ["Le droit", "Le gauche", "Aucun"], b: 1, e: "Coordination croisée." },
    { q: "Angle conseillé des coudes :", r: ["environ 90°", "bras tendus", "45°"], b: 0, e: "Les bras pliés donnent le rythme." },
    { q: "Pour accélérer, on peut…", r: ["accélérer les bras", "regarder ses pieds", "serrer les épaules"], b: 0, e: "Les jambes suivent le rythme des bras." }
  ]
});

VRT_L("6e-arts-branches", {
  c: "6e", m: "arts", cle: "Les différentes branches des arts", titre: "Les différentes branches des arts", duree: 15,
  accroche: "Peindre, sculpter, chanter, jouer : toutes les façons de créer.",
  intro: "Un masque sculpté, un chant de veillée, une pièce de théâtre, un pagne tissé : l'art prend mille formes. On les range en grandes familles.",
  objectifs: ["distinguer arts plastiques, musicaux et scéniques", "citer des exemples de chaque branche", "reconnaître des formes d'art camerounaises"],
  parties: [
    { t: "Les arts plastiques", html:
      "<p>Ils créent des œuvres qu'on <strong>regarde</strong> et parfois qu'on touche : <strong>dessin, peinture, sculpture, gravure, céramique</strong> (poterie), <strong>architecture</strong>, <strong>photographie</strong>, arts textiles.</p>",
      retenir: "Arts plastiques : on façonne la matière et les formes." },
    { t: "Les arts musicaux et scéniques", html:
      "<ul><li><strong>Arts musicaux</strong> : chant, musique instrumentale (balafon, tam-tam, mvet, guitare…).</li><li><strong>Arts scéniques</strong> (ou arts du spectacle) : théâtre, danse, conte, marionnettes, mime.</li></ul>",
      illus: { legende: "Trois grandes familles d'arts.", svg:
      "<svg viewBox='0 0 460 170' role='img' aria-label='Trois familles d arts'><g text-anchor='middle'><circle cx='80' cy='80' r='62' fill='#EAE7F7' stroke='#352C72' stroke-width='2'/><text x='80' y='72' font-size='14' font-weight='700' fill='#352C72'>PLASTIQUES</text><text x='80' y='92' font-size='11' fill='#142554'>dessin, peinture</text><text x='80' y='108' font-size='11' fill='#142554'>sculpture, poterie</text><circle cx='230' cy='80' r='62' fill='#FFF6DA' stroke='#6B4E00' stroke-width='2'/><text x='230' y='72' font-size='14' font-weight='700' fill='#6B4E00'>MUSICAUX</text><text x='230' y='92' font-size='11' fill='#142554'>chant, balafon</text><text x='230' y='108' font-size='11' fill='#142554'>tam-tam, mvet</text><circle cx='380' cy='80' r='62' fill='#FBE4EE' stroke='#6E1F43' stroke-width='2'/><text x='380' y='72' font-size='14' font-weight='700' fill='#6E1F43'>SCÉNIQUES</text><text x='380' y='92' font-size='11' fill='#142554'>théâtre, danse</text><text x='380' y='108' font-size='11' fill='#142554'>conte, mime</text></g><text x='230' y='162' text-anchor='middle' font-size='12' fill='#636A80'>regarder · écouter · assister</text></svg>" },
      retenir: "Plastiques (voir), musicaux (entendre), scéniques (voir et entendre un spectacle)." },
    { t: "Des arts camerounais", html:
      "<div class='savais'><b>Le savais-tu ?</b>Foumban est célèbre pour ses artisans du bronze et du bois sculpté ; les Grassfields pour leurs masques et leurs perles ; le mvet accompagne les grands récits épiques du Sud.</div>",
      retenir: "Le patrimoine artistique camerounais est immense et varié." }
  ],
  revision: ["Arts plastiques : dessin, peinture, sculpture, gravure, céramique, architecture, photographie.", "Arts musicaux : chant, musique instrumentale.", "Arts scéniques : théâtre, danse, conte, mime.", "Patrimoine camerounais : bronze et bois de Foumban, masques, mvet."],
  exo: "<p>Classe : tissage, danse, balafon, poterie, conte, photographie. <em>(Plastiques : tissage, poterie, photographie ; musicaux : balafon ; scéniques : danse, conte.)</em></p>",
  quiz: [
    { q: "La sculpture appartient aux arts…", r: ["plastiques", "musicaux", "scéniques"], b: 0, e: "On façonne la matière." },
    { q: "Le conte est un art…", r: ["plastique", "scénique", "musical seulement"], b: 1, e: "Il se joue devant un public." },
    { q: "Le mvet est…", r: ["une danse", "un instrument et un art du récit", "une sculpture"], b: 1, e: "Il accompagne les récits épiques." }
  ]
});

VRT_L("3e-arts-ombre", {
  c: "3e", m: "arts", cle: "L’ombre portée et l'ombre propre", titre: "L'ombre et la lumière : ombre propre et ombre portée", duree: 15,
  accroche: "Une source de lumière, un objet, deux ombres : dessine le volume.",
  intro: "Pour qu'un dessin donne l'impression du relief, il faut savoir où tombe la lumière et où naissent les ombres.",
  objectifs: ["distinguer ombre propre et ombre portée", "placer les ombres selon la source de lumière", "ombrer un volume simple"],
  parties: [
    { t: "Deux sortes d'ombres", html:
      "<div class='def'><b>Ombre propre</b>Partie de l'objet qui ne reçoit pas la lumière.</div><div class='def'><b>Ombre portée</b>Ombre que l'objet projette sur une surface (le sol, un mur), du côté opposé à la lumière.</div>",
      retenir: "Propre : SUR l'objet. Portée : À CÔTÉ de l'objet." },
    { t: "Lumière, pénombre, ombre", html:
      "<p>Sur une sphère éclairée, on distingue la <strong>zone éclairée</strong> (avec un point très clair, le <strong>reflet</strong>), une zone de <strong>pénombre</strong> qui passe progressivement au sombre, puis l'<strong>ombre propre</strong>. Plus la source est basse, plus l'ombre portée est longue.</p>",
      retenir: "Le passage de la lumière à l'ombre doit être progressif." },
    { t: "Ombrer au crayon", html:
      "<ol><li>Repère la source de lumière et dessine une flèche.</li><li>Trace la limite entre lumière et ombre propre.</li><li>Ombre par hachures ou estompe, du plus clair au plus foncé.</li><li>Dessine l'ombre portée, opposée à la lumière.</li></ol><div class='astuce'><b>Astuce</b>Un crayon tendre (2B, 4B) donne des noirs profonds ; un crayon dur (H) des gris légers.</div>",
      retenir: "Toujours partir de la position de la lumière." }
  ],
  revision: ["Ombre propre : sur l'objet.", "Ombre portée : projetée, à l'opposé de la lumière.", "Lumière → pénombre → ombre, de façon progressive.", "Source basse = ombre portée longue."],
  exo: "<p>Dessine un cube et une sphère éclairés par la gauche ; ombre-les au crayon.</p>",
  quiz: [
    { q: "L'ombre portée se trouve…", r: ["sur l'objet", "du côté opposé à la lumière, sur une surface", "toujours derrière le dessinateur"], b: 1, e: "C'est l'ombre projetée." },
    { q: "Si la lampe descend, l'ombre portée…", r: ["raccourcit", "s'allonge", "disparaît"], b: 1, e: "Comme les ombres du soir." },
    { q: "Pour des noirs profonds, on prend un crayon…", r: ["H", "4B", "HB"], b: 1, e: "B = tendre et foncé." }
  ]
});

VRT_L("6e-tm-materiel-dessin", {
  c: "6e", m: "tm", cle: "Le matériel de dessin : définition", titre: "Le matériel de dessin", duree: 15,
  accroche: "Le bon outil pour le bon trait.",
  intro: "Avant de dessiner le kiosque du projet de l'année, il faut connaître ses outils et savoir s'en servir.",
  objectifs: ["nommer le matériel de dessin", "choisir l'outil adapté", "entretenir son matériel"],
  parties: [
    { t: "Pour tracer", html:
      "<ul><li><strong>Crayons graphite</strong> : H (dur, trait clair), HB (moyen), B (tendre, trait foncé).</li><li><strong>Règle graduée</strong> : tracer et mesurer des droites.</li><li><strong>Équerre</strong> : tracer des angles droits et des perpendiculaires.</li><li><strong>Compas</strong> : tracer des cercles et des arcs.</li><li><strong>Rapporteur</strong> : mesurer et tracer des angles.</li></ul>",
      illus: { legende: "Les instruments de base du dessin technique.", svg:
      "<svg viewBox='0 0 460 160' role='img' aria-label='Règle, équerre, compas, crayon'><rect x='10' y='110' width='200' height='26' rx='3' fill='#FFF6DA' stroke='#6B4E00' stroke-width='2'/><g stroke='#6B4E00'><path d='M20 110v10M40 110v6M60 110v10M80 110v6M100 110v10M120 110v6M140 110v10M160 110v6M180 110v10M200 110v6'/></g><path d='M230 136 L330 136 L230 36 Z' fill='#DDF2F4' stroke='#0A4F55' stroke-width='2'/><path d='M244 122 L290 122 L244 76 Z' fill='#fff' stroke='#0A4F55'/><g stroke='#071A45' stroke-width='3' stroke-linecap='round'><path d='M390 20 L360 130'/><path d='M390 20 L420 130'/></g><circle cx='390' cy='20' r='6' fill='#0C2A6A'/><path d='M60 30 L170 80' stroke='#FFC93C' stroke-width='12' stroke-linecap='round'/><path d='M170 80 L186 87' stroke='#C9A97A' stroke-width='8'/><path d='M186 87 L192 90' stroke='#142554' stroke-width='3'/><g font-size='12' fill='#142554'><text x='80' y='154'>règle</text><text x='264' y='154'>équerre</text><text x='374' y='150'>compas</text><text x='70' y='22'>crayon</text></g></svg>" },
      retenir: "H = dur et clair ; B = tendre et foncé." },
    { t: "Pour corriger et colorier", html:
      "<p><strong>Gomme</strong>, <strong>taille-crayon</strong>, <strong>crayons de couleur</strong>, <strong>feutres</strong>. Le <strong>papier</strong> est choisi selon le travail (papier à dessin, papier calque).</p>",
      retenir: "Un trait léger se gomme facilement : appuie peu au début." },
    { t: "Entretenir son matériel", html:
      "<ul><li>Garder une mine bien taillée pour des traits précis.</li><li>Nettoyer la règle et l'équerre (la mine salit la feuille).</li><li>Ranger le compas pointe protégée : c'est un outil piquant.</li></ul>",
      retenir: "Un outil propre fait un dessin propre." }
  ],
  revision: ["Crayons H, HB, B.", "Règle, équerre, compas, rapporteur.", "Gomme, taille-crayon, couleurs, papier adapté.", "Entretien et sécurité du matériel."],
  exo: "<p>Prépare ta trousse de dessin et vérifie qu'il ne manque rien de la liste.</p>",
  quiz: [
    { q: "Pour tracer un cercle, on utilise…", r: ["l'équerre", "le compas", "le rapporteur"], b: 1, e: "Le compas trace cercles et arcs." },
    { q: "Un crayon 4B donne un trait…", r: ["clair et dur", "foncé et tendre", "coloré"], b: 1, e: "B = black, tendre." },
    { q: "Pour un angle droit, on utilise…", r: ["l'équerre", "la gomme", "le calque"], b: 0, e: "Elle a un angle de 90°." }
  ]
});

VRT_L("6e-tm-site-pepiniere", {
  c: "6e", m: "tm", cle: "Choix du site", titre: "Choisir le site d'une pépinière", duree: 15,
  accroche: "Une bonne pépinière commence par un bon emplacement.",
  intro: "Une pépinière produit de jeunes plants (cacaoyers, arbres fruitiers, légumes) avant leur repiquage. Le choix du terrain conditionne la réussite.",
  objectifs: ["définir une pépinière", "énumérer les critères de choix du site", "justifier un choix sur le terrain"],
  parties: [
    { t: "Qu'est-ce qu'une pépinière ?", html:
      "<div class='def'><b>Définition</b>Une pépinière est un lieu aménagé où l'on fait germer et grandir de jeunes plants, protégés, avant de les planter à leur emplacement définitif.</div>",
      retenir: "Pépinière = berceau des jeunes plants." },
    { t: "Les critères du bon site", html:
      "<ul><li><strong>Eau</strong> : un point d'eau proche et permanent pour l'arrosage.</li><li><strong>Sol</strong> : meuble, fertile, bien drainé (pas de zone inondable).</li><li><strong>Relief</strong> : terrain plat ou en légère pente.</li><li><strong>Lumière</strong> : bon ensoleillement, avec possibilité d'ombrager les jeunes plants.</li><li><strong>Accès</strong> : facile pour le travail et le transport des plants.</li><li><strong>Protection</strong> : à l'abri des animaux en divagation et des vents forts.</li></ul>",
      illus: { legende: "Un site bien choisi : eau, sol plat, ombrage, clôture, accès.", svg:
      "<svg viewBox='0 0 460 190' role='img' aria-label='Site de pépinière'><rect x='0' y='120' width='460' height='70' fill='#E0F5E5'/><path d='M0 120 Q230 110 460 120' fill='none' stroke='#00520B' stroke-width='2'/><path d='M320 130 Q380 120 440 140 Q400 165 330 155 Z' fill='#DBE8FE' stroke='#1E499B' stroke-width='2'/><text x='360' y='178' font-size='11' fill='#1E499B'>point d'eau</text><rect x='70' y='95' width='180' height='12' fill='#8C9BC0'/><g stroke='#6B4E00' stroke-width='2'><path d='M80 107v24M240 107v24M160 107v24'/></g><text x='96' y='90' font-size='11' fill='#142554'>ombrière</text><g fill='#7FCB8C' stroke='#00520B'><circle cx='100' cy='136' r='6'/><circle cx='125' cy='136' r='6'/><circle cx='150' cy='136' r='6'/><circle cx='175' cy='136' r='6'/><circle cx='200' cy='136' r='6'/><circle cx='225' cy='136' r='6'/></g><g stroke='#6B4E00' stroke-width='2'><path d='M50 150V112M270 150V112M50 118h220M50 134h220'/></g><text x='60' y='170' font-size='11' fill='#142554'>clôture</text><circle cx='60' cy='36' r='18' fill='#FFC93C'/><path d='M0 160 L40 190' stroke='#C9A97A' stroke-width='10'/><text x='4' y='186' font-size='10' fill='#6B4E00'>piste</text></svg>" },
      retenir: "Eau, sol, relief, lumière, accès, protection." },
    { t: "Sur le terrain", html:
      "<p>Visite deux terrains possibles, note chaque critère de 0 à 2, additionne : le terrain qui obtient le meilleur total est retenu. Cette méthode permet de justifier son choix.</p><div class='astuce'><b>Astuce</b>Évite le pied d'un grand arbre : ses racines prennent l'eau et ses feuilles portent parfois des maladies.</div>",
      retenir: "Un choix se justifie par des critères notés." }
  ],
  revision: ["Pépinière : lieu de production de jeunes plants.", "Critères : eau, sol, relief, lumière, accès, protection.", "Éviter les zones inondables.", "Comparer les terrains avec une grille notée."],
  exo: "<p>Construis une grille de choix (6 critères) et compare deux terrains autour de ton établissement.</p>",
  quiz: [
    { q: "Le critère le plus important pour arroser :", r: ["un point d'eau proche", "un grand arbre", "une route goudronnée"], b: 0, e: "Les jeunes plants ont besoin d'arrosage régulier." },
    { q: "Une zone inondable est…", r: ["idéale", "à éviter", "obligatoire"], b: 1, e: "Les racines pourrissent dans l'eau stagnante." },
    { q: "Pourquoi une clôture ?", r: ["Pour décorer", "Pour protéger des animaux", "Pour faire de l'ombre"], b: 1, e: "Les chèvres adorent les jeunes plants !" }
  ]
});

VRT_L("1re-esf-notions", {
  c: "1re A", m: "esf", cle: "Notions sur l'économie sociale et familiale", titre: "Notions sur l'économie sociale et familiale", duree: 15,
  accroche: "Bien gérer le foyer : un savoir qui s'apprend.",
  intro: "Budget, alimentation, santé, logement, soin des enfants et des aînés : la vie d'un foyer demande des compétences. C'est l'objet de l'économie sociale et familiale.",
  objectifs: ["définir les mots économie, sociale et familiale", "décrire les domaines de l'ESF", "mesurer son impact sur la vie du foyer"],
  parties: [
    { t: "Trois mots", html:
      "<ul><li><strong>Économie</strong> : du grec <em>oikos</em> (maison) et <em>nomos</em> (règle) ; la bonne gestion des ressources.</li><li><strong>Sociale</strong> : qui concerne la vie en société et la solidarité.</li><li><strong>Familiale</strong> : qui concerne la famille et le foyer.</li></ul><div class='def'><b>Définition</b>L'économie sociale et familiale est la discipline qui apprend à gérer au mieux les ressources du foyer (argent, temps, énergie, aliments) pour le bien-être de chacun.</div>",
      retenir: "Économie = « règle de la maison »." },
    { t: "Ses domaines", html:
      "<ul><li><strong>Budget</strong> : prévoir recettes et dépenses, épargner.</li><li><strong>Alimentation</strong> : repas équilibrés, hygiène, conservation des aliments.</li><li><strong>Santé</strong> : puériculture, gérontologie, prévention.</li><li><strong>Habitat</strong> et <strong>vêtement</strong> : entretien, décoration, couture.</li></ul>",
      illus: { legende: "Le foyer au centre des domaines de l'ESF.", svg:
      "<svg viewBox='0 0 460 190' role='img' aria-label='Domaines de l économie sociale et familiale'><circle cx='230' cy='95' r='42' fill='#B03A6E'/><text x='230' y='92' text-anchor='middle' font-size='14' font-weight='700' fill='#fff'>LE</text><text x='230' y='110' text-anchor='middle' font-size='14' font-weight='700' fill='#fff'>FOYER</text><g stroke='#6E1F43' stroke-width='2'><path d='M200 70 L130 34M260 70 L330 34M200 120 L130 156M260 120 L330 156'/></g><g font-size='13' text-anchor='middle' fill='#142554'><rect x='50' y='14' width='130' height='36' rx='18' fill='#FBE4EE'/><text x='115' y='37'>budget</text><rect x='280' y='14' width='130' height='36' rx='18' fill='#FBE4EE'/><text x='345' y='37'>alimentation</text><rect x='50' y='140' width='130' height='36' rx='18' fill='#FBE4EE'/><text x='115' y='163'>santé, enfants, aînés</text><rect x='280' y='140' width='130' height='36' rx='18' fill='#FBE4EE'/><text x='345' y='163'>habitat, vêtement</text></g></svg>" },
      retenir: "Budget, alimentation, santé, habitat, vêtement." },
    { t: "Un impact concret", html:
      "<p>Un foyer bien géré dépense moins, mange mieux, tombe moins malade et peut épargner pour la scolarité des enfants. L'ESF prépare aussi à des métiers : conseiller en économie familiale, restauration, puériculture, couture.</p>",
      retenir: "L'ESF améliore la vie quotidienne et ouvre des métiers." }
  ],
  revision: ["oikos + nomos = règle de la maison.", "ESF : gérer les ressources du foyer pour le bien-être.", "Domaines : budget, alimentation, santé, habitat, vêtement.", "Débouchés professionnels."],
  exo: "<p>Établis le budget d'un repas familial pour six personnes avec les prix du marché de ton quartier.</p>",
  quiz: [
    { q: "« Oikos » signifie…", r: ["la maison", "l'argent", "le marché"], b: 0, e: "Économie = règle de la maison." },
    { q: "Lequel n'est pas un domaine de l'ESF ?", r: ["Budget", "Alimentation", "Astronomie"], b: 2, e: "L'ESF concerne la vie du foyer." },
    { q: "Épargner pour la scolarité relève…", r: ["du budget", "du vêtement", "de la décoration"], b: 0, e: "Prévoir recettes, dépenses et épargne." }
  ]
});

VRT_L("1re-esf-alarme", {
  c: "1re A", m: "esf", cle: "Les signes d'alarme", titre: "Les signes d'alarme chez le nourrisson", duree: 15,
  accroche: "Savoir reconnaître l'urgence peut sauver un bébé.",
  intro: "Un nourrisson ne peut pas dire qu'il va mal. Il faut savoir reconnaître un bébé bien portant… et les signes qui imposent d'aller au centre de santé sans attendre.",
  objectifs: ["décrire un bébé bien portant", "reconnaître les signes de danger", "réagir rapidement"],
  parties: [
    { t: "Un bébé bien portant", html:
      "<ul><li>Il tète ou boit bien et prend régulièrement du poids (courbe du carnet de santé).</li><li>Il est éveillé, réagit aux voix et aux sons.</li><li>Il respire calmement, sa peau est rose et chaude.</li><li>Ses selles et ses urines sont régulières.</li></ul>",
      retenir: "Bonne prise de poids, éveil, respiration calme." },
    { t: "Les signes de danger", html:
      "<div class='attention'><b>Consulter immédiatement si le bébé :</b>ne peut plus téter ni boire ; vomit tout ce qu'il prend ; a des convulsions ; est anormalement mou, somnolent ou difficile à réveiller ; respire très vite ou avec un creusement sous les côtes ; a une forte fièvre ou, au contraire, est froid ; a une diarrhée avec yeux enfoncés et pli de la peau qui reste.</div>",
      illus: { legende: "Repères rapides : signes rassurants et signes d'alarme.", svg:
      "<svg viewBox='0 0 460 180' role='img' aria-label='Signes rassurants et signes d alarme'><rect x='10' y='10' width='210' height='160' rx='16' fill='#E0F5E5' stroke='#00520B' stroke-width='2'/><circle cx='62' cy='33' r='9' fill='#007E11'/><path d='m57.5 33 3 3 5-5.5' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/><text x='122' y='38' text-anchor='middle' font-size='14' font-weight='600' fill='#00520B'>RASSURANT</text><g font-size='12' fill='#142554'><text x='26' y='66'>• tète bien</text><text x='26' y='90'>• prend du poids</text><text x='26' y='114'>• éveillé, réactif</text><text x='26' y='138'>• respiration calme</text></g><rect x='240' y='10' width='210' height='160' rx='16' fill='#FCEFEC' stroke='#B4321E' stroke-width='2'/><path d='M290 41 299 25l9 16z' fill='#B4321E'/><path d='M299 31v4M299 38v.4' stroke='#fff' stroke-width='2' stroke-linecap='round'/><text x='352' y='38' text-anchor='middle' font-size='14' font-weight='600' fill='#B4321E'>URGENCE</text><g font-size='12' fill='#142554'><text x='256' y='66'>• ne tète plus</text><text x='256' y='90'>• vomit tout</text><text x='256' y='114'>• convulsions</text><text x='256' y='138'>• mou, somnolent</text><text x='256' y='162'>• respire très vite</text></g></svg>" },
      retenir: "Un seul signe de danger suffit pour consulter d'urgence." },
    { t: "Que faire ?", html:
      "<ol><li>Aller sans attendre au centre de santé le plus proche, avec le carnet de santé.</li><li>Continuer à proposer le sein ou à faire boire pendant le trajet si l'enfant peut avaler.</li><li>Ne pas donner de médicament ni de décoction sans avis d'un agent de santé.</li></ol>",
      retenir: "Agir vite, avec le carnet de santé." }
  ],
  revision: ["Bébé bien portant : tète, grossit, éveillé, respire calmement.", "Danger : ne tète plus, vomit tout, convulsions, somnolence, respiration rapide, déshydratation.", "Consulter immédiatement, avec le carnet.", "Pas d'automédication."],
  exo: "<p>Réalise une affiche des signes d'alarme du nourrisson destinée aux jeunes parents de ton quartier.</p>",
  quiz: [
    { q: "Un nourrisson qui vomit tout ce qu'il prend…", r: ["peut attendre demain", "doit consulter d'urgence", "doit boire une décoction"], b: 1, e: "C'est un signe de danger." },
    { q: "Signe de bonne santé :", r: ["prise de poids régulière", "somnolence permanente", "respiration très rapide"], b: 0, e: "La courbe du carnet le montre." },
    { q: "Que prendre en allant au centre de santé ?", r: ["Le carnet de santé", "Rien", "Des médicaments achetés au marché"], b: 0, e: "Il contient l'historique de l'enfant." }
  ]
});

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

/* Premières leçons de l'année — 2nde A, 2nde C, 5e, 4e (11/11/2026).
   « Chaque classe doit avoir au moins 5 leçons disponibles » ; « même rigueur,
   situations ancrées dans le contexte camerounais, QCM » (Jacques).
   Format des leçons d'examen : cours en trois temps, entraînement au format de
   l'épreuve (Partie A : ressources ; Partie B : compétences, situation de vie),
   fiche de révision, exercice, dix questions corrigées, rattachement APC.
   cle = morceau du titre officiel de la progression MINESEC 2026-2027. */

/* ══════════════════════════ 2nde C ══════════════════════════ */

VRT_L("2nde-c-maths-reels", {
  c: "2nde C", m: "maths", cle: "ℝ et ses sous-ensembles", titre: "ℝ et ses sous-ensembles", duree: 25,
  accroche: "Entiers, décimaux, fractions, racines : chaque nombre a sa famille.",
  intro: "Le prix d'un pagne, la moitié d'un régime de plantain, la diagonale d'un carré de terrain : ces nombres n'appartiennent pas tous au même ensemble. Savoir les ranger, c'est savoir quelles opérations sont permises.",
  objectifs: ["reconnaître ℕ, ℤ, 𝔻, ℚ et ℝ", "justifier qu'un nombre appartient (ou non) à un ensemble", "utiliser les symboles ∈, ∉, ⊂"],
  parties: [
    { t: "Les cinq ensembles de nombres", html:
      "<div class='def'><b>Définitions</b><strong>ℕ</strong> : entiers naturels (0, 1, 2, …). <strong>ℤ</strong> : entiers relatifs (…, −2, −1, 0, 1, …). <strong>𝔻</strong> : décimaux, qui s'écrivent a/10ⁿ avec a ∈ ℤ. <strong>ℚ</strong> : rationnels, qui s'écrivent p/q avec p ∈ ℤ et q ∈ ℕ*. <strong>ℝ</strong> : tous les nombres de la droite graduée.</div>" +
      "<p class='formule'>ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ</p>" +
      "<div class='ex'><b>Exemples</b>−7 ∈ ℤ mais −7 ∉ ℕ ; 2,35 = 235/100 ∈ 𝔻 ; 1/3 ∈ ℚ mais 1/3 ∉ 𝔻 ; √2 ∈ ℝ mais √2 ∉ ℚ.</div>",
      retenir: "Chaque ensemble est contenu dans le suivant : un entier est aussi un décimal, un rationnel, un réel." },
    { t: "Décimal ou pas ? La règle des dénominateurs", html:
      "<p>Une fraction irréductible p/q est un <strong>décimal</strong> si et seulement si son dénominateur q ne contient que les facteurs premiers <strong>2</strong> et <strong>5</strong>.</p>" +
      "<div class='ex'><b>Exemples</b>7/20 : 20 = 2² × 5, donc 7/20 = 0,35 ∈ 𝔻. 5/12 : 12 = 2² × 3, le facteur 3 interdit l'écriture décimale finie : 5/12 = 0,41666… ∉ 𝔻.</div>" +
      "<div class='attention'><b>Attention</b>Il faut d'abord rendre la fraction irréductible : 6/15 = 2/5 est bien décimal (0,4), même si 15 contient un 3.</div>",
      retenir: "Fraction irréductible + dénominateur fait seulement de 2 et de 5 = nombre décimal." },
    { t: "Les irrationnels", html:
      "<p>Un réel qui n'est pas rationnel est dit <strong>irrationnel</strong> : son écriture décimale est infinie et <strong>non périodique</strong>. Exemples : √2 ≈ 1,41421…, √3, π ≈ 3,14159…</p>" +
      "<div class='astuce'><b>Astuce</b>√n est rationnel seulement si n est un carré parfait : √49 = 7 ∈ ℕ, mais √50 = 5√2 est irrationnel.</div>" +
      "<div class='savais'><b>Le savais-tu ?</b>Un champ carré de 1 hectomètre de côté a une diagonale de √2 hm : aucun mètre-ruban, aussi fin soit-il, ne donnera sa longueur « exacte » en décimal.</div>",
      retenir: "ℝ = rationnels + irrationnels ; un irrationnel n'a ni fin ni motif qui se répète." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Parmi ces nombres, lequel est un décimal ?</p><ol type='a'><li>1/3</li><li>7/40</li><li>√5</li><li>2/7</li></ol><details><summary>Voir la réponse</summary><p><strong>7/40</strong> : 40 = 2³ × 5, donc 7/40 = 0,175.</p></details><p><strong>Exercice.</strong> Compléter par ∈ ou ∉ : −4 … ℕ ; 18/6 … ℕ ; 0,7 … ℤ ; √36 … ℚ.</p><details><summary>Voir la réponse</summary><p>−4 ∉ ℕ ; 18/6 = 3 ∈ ℕ ; 0,7 ∉ ℤ ; √36 = 6 ∈ ℚ.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Une coopérative de Foumbot partage 5 tonnes de pommes de terre entre 8 familles. Un membre affirme : « chaque famille recevra un nombre de kilogrammes qu'on ne peut pas écrire exactement ». Un autre veut planter des avocatiers le long de la diagonale d'une parcelle carrée de 30 m de côté.</p><p><strong>Tâche 1.</strong> Le premier membre a-t-il raison ? <strong>Tâche 2.</strong> La longueur de la diagonale est-elle un nombre décimal ?</p><details><summary>Voir une réponse attendue</summary><p>5 000 ÷ 8 = 625 kg : c'est un entier, il se trompe. La diagonale vaut 30√2 m ≈ 42,43 m : c'est un irrationnel, non décimal ; on l'arrondit pour les mesures sur le terrain.</p></details></div>",
      retenir: "Savoir-être mobilisé : rigueur dans la justification." }
  ],
  revision: ["<strong>ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ</strong>.", "Décimal : a/10ⁿ ; rationnel : p/q.", "p/q irréductible est décimal ⇔ q = 2ᵃ × 5ᵇ.", "Irrationnel : écriture décimale infinie non périodique (√2, π).", "√n est entier seulement si n est un carré parfait."],
  exo: "<p>Classe dans le plus petit ensemble possible : 12/4 ; −3/5 ; 11/6 ; √81 ; √7. <em>(Réponse : 3 ∈ ℕ ; −0,6 ∈ 𝔻 ; 11/6 ∈ ℚ ; 9 ∈ ℕ ; √7 ∈ ℝ, irrationnel.)</em></p>",
  quiz: [
    { q: "Quel nombre est un entier relatif mais pas un entier naturel ?", r: ["0", "−5", "5/2", "√4"], b: 1, e: "−5 est négatif : il est dans ℤ, pas dans ℕ." },
    { q: "La fraction 7/20 est :", r: ["irrationnelle", "rationnelle non décimale", "décimale", "entière"], b: 2, e: "20 = 2² × 5 : 7/20 = 0,35." },
    { q: "Laquelle de ces inclusions est juste ?", r: ["ℚ ⊂ 𝔻", "ℝ ⊂ ℚ", "ℤ ⊂ ℕ", "𝔻 ⊂ ℚ"], b: 3, e: "Tout décimal a/10ⁿ est une fraction, donc un rationnel." },
    { q: "√2 est :", r: ["un irrationnel", "un décimal", "un rationnel", "un entier"], b: 0, e: "Son écriture décimale est infinie et non périodique." },
    { q: "5/12 n'est pas décimal parce que :", r: ["5 est premier", "12 contient le facteur 3", "12 est pair", "5 &lt; 12"], b: 1, e: "Seuls 2 et 5 sont permis au dénominateur d'une fraction irréductible décimale." },
    { q: "6/15 est-il décimal ?", r: ["non, à cause du 3", "oui, car 6/15 = 2/5 = 0,4", "non, il est irrationnel", "on ne peut pas savoir"], b: 1, e: "On simplifie d'abord : 6/15 = 2/5." },
    { q: "√49 appartient à :", r: ["ℝ seulement", "ℚ mais pas ℤ", "ℕ", "aucun ensemble"], b: 2, e: "√49 = 7, entier naturel." },
    { q: "Le symbole ∉ signifie :", r: ["n'appartient pas à", "est inclus dans", "est égal à", "appartient à"], b: 0, e: "a ∉ E : a n'est pas un élément de E." },
    { q: "La diagonale d'un carré de côté 30 m mesure :", r: ["60 m", "30√2 m", "900 m", "15 m"], b: 1, e: "Pythagore : d² = 30² + 30² = 1 800, donc d = 30√2 ≈ 42,43 m." },
    { q: "0,333… (3 répété à l'infini) est :", r: ["irrationnel", "décimal", "entier", "rationnel"], b: 3, e: "0,333… = 1/3 : écriture infinie mais périodique, donc rationnelle." }
  ],
  apc: { module: "Mathématiques de Seconde C", famille: "Représentation, organisation et traitement de l'information", agir: "Utiliser les nombres réels pour résoudre des problèmes de la vie courante", situation: "Une coopérative de Foumbot partage sa récolte et aménage une parcelle carrée.", tache: "Décider si les quantités calculées sont décimales, rationnelles ou irrationnelles." }
});

VRT_L("2nde-c-physique-mesure", {
  c: "2nde C", m: "physique", cle: "Rappels des techniques de mesure", titre: "Mesurer une grandeur et estimer l'erreur", duree: 25,
  accroche: "Une mesure sans incertitude n'est qu'une promesse.",
  intro: "Au marché Mboppi, deux balances ne donnent pas le même poids pour le même sac de riz. Qui a raison ? Aucune mesure n'est parfaite : la physique apprend à dire de combien on peut se tromper.",
  objectifs: ["utiliser correctement un instrument de mesure", "distinguer erreur systématique et erreur aléatoire", "écrire un résultat avec son incertitude"],
  parties: [
    { t: "Grandeur, unité, instrument", html:
      "<div class='def'><b>Définition</b>Une <strong>grandeur physique</strong> est ce que l'on peut mesurer : longueur (m), masse (kg), temps (s), intensité (A), température (K ou °C). Mesurer, c'est <strong>comparer</strong> à une unité à l'aide d'un instrument.</div>" +
      "<ul><li>Règle graduée, pied à coulisse : longueurs.</li><li>Balance : masses.</li><li>Chronomètre : durées.</li><li>Ampèremètre (en série), voltmètre (en dérivation).</li></ul>" +
      "<div class='astuce'><b>Astuce</b>La <strong>précision</strong> d'un instrument est en général la plus petite graduation : 1 mm pour une règle, 0,1 mm pour un pied à coulisse au 1/10.</div>",
      retenir: "Grandeur + nombre + unité : « 2,5 » ne veut rien dire, « 2,5 kg » si." },
    { t: "Les différents types d'erreur", html:
      "<p>L'<strong>erreur</strong> est l'écart entre la valeur mesurée et la valeur vraie (inconnue).</p>" +
      "<div class='def'><b>Erreur systématique</b>Toujours dans le même sens : balance mal tarée, zéro de l'ampèremètre décalé, lecture faite toujours de biais. Elle ne disparaît pas en répétant la mesure ; on la <strong>corrige</strong> (réglage, étalonnage).</div>" +
      "<div class='def'><b>Erreur aléatoire</b>Tantôt en plus, tantôt en moins : réflexes au chronomètre, vibrations, lecture entre deux graduations. On la <strong>réduit</strong> en répétant la mesure et en faisant la moyenne.</div>" +
      "<div class='attention'><b>Erreur de parallaxe</b>Lire une graduation en regardant de biais fausse la lecture : l'œil doit être en face, perpendiculaire à l'échelle.</div>",
      retenir: "Systématique : on corrige l'instrument. Aléatoire : on répète et on fait la moyenne." },
    { t: "Écrire un résultat de mesure", html:
      "<p>On écrit : <strong>G = (valeur ± incertitude) unité</strong>. L'incertitude absolue ΔG dit de combien on peut se tromper ; l'incertitude relative ΔG/G permet de comparer des mesures.</p>" +
      "<div class='ex'><b>Exemple</b>Cinq élèves chronomètrent la chute d'une mangue : 0,62 s ; 0,58 s ; 0,60 s ; 0,64 s ; 0,56 s. Moyenne : t = 3,00 ÷ 5 = 0,60 s. Les valeurs s'écartent d'au plus 0,04 s : <strong>t = (0,60 ± 0,04) s</strong>. Incertitude relative : 0,04 ÷ 0,60 ≈ 7 %.</div>" +
      "<div class='savais'><b>Le savais-tu ?</b>Les balances des marchés sont contrôlées par le service des poids et mesures : une balance « trafiquée » est une erreur systématique… volontaire.</div>",
      retenir: "Toujours la valeur, l'incertitude et l'unité ; plus l'incertitude relative est petite, plus la mesure est précise." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Une balance affiche 0,2 kg à vide. L'erreur commise sur toutes les pesées est :</p><ol type='a'><li>aléatoire</li><li>systématique</li><li>de parallaxe</li><li>nulle</li></ol><details><summary>Voir la réponse</summary><p><strong>Systématique</strong> : chaque pesée est faussée de +0,2 kg ; il faut tarer la balance.</p></details><p><strong>Exercice.</strong> Une longueur vaut L = (12,4 ± 0,1) cm. Calcule l'incertitude relative.</p><details><summary>Voir la réponse</summary><p>0,1 ÷ 12,4 ≈ 0,008, soit environ 0,8 %.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Mme Ngo Bayiha achète 10 kg de riz chez deux commerçants. Chez le premier, sa propre balance de cuisine (bien tarée) indique 9,4 kg ; chez le second, 10,0 kg. Le premier commerçant dit que « c'est l'humidité ».</p><p><strong>Tâche 1.</strong> Quel type d'erreur soupçonner chez le premier commerçant ? <strong>Tâche 2.</strong> Propose une démarche pour le vérifier.</p><details><summary>Voir une réponse attendue</summary><p>Un écart de 0,6 kg toujours en défaveur de l'acheteuse évoque une erreur systématique (balance mal réglée ou truquée). Démarche : peser plusieurs fois un objet de masse connue (un paquet de 1 kg scellé) sur sa balance ; si l'écart se répète dans le même sens, l'erreur est systématique.</p></details></div>",
      retenir: "Savoir-être mobilisé : honnêteté et esprit critique face à une mesure." }
  ],
  revision: ["Mesurer = comparer à une unité avec un instrument.", "Précision ≈ plus petite graduation.", "Erreur <strong>systématique</strong> : même sens, on corrige l'instrument.", "Erreur <strong>aléatoire</strong> : on répète et on fait la moyenne.", "Résultat : <strong>G = (valeur ± ΔG) unité</strong> ; incertitude relative ΔG/G."],
  exo: "<p>Quatre mesures d'une tension : 4,52 V ; 4,48 V ; 4,50 V ; 4,50 V. Donne la valeur moyenne et une incertitude raisonnable. <em>(Réponse : U = (4,50 ± 0,02) V.)</em></p>",
  quiz: [
    { q: "L'unité légale de masse est :", r: ["le gramme", "le kilogramme", "le newton", "la tonne"], b: 1, e: "Dans le Système international, la masse s'exprime en kilogramme (kg)." },
    { q: "Un ampèremètre se branche :", r: ["en série", "en dérivation", "aux bornes du générateur seul", "indifféremment"], b: 0, e: "Le courant doit le traverser : il est placé en série." },
    { q: "Une erreur qui se répète toujours dans le même sens est :", r: ["aléatoire", "de parallaxe", "systématique", "négligeable"], b: 2, e: "C'est la définition de l'erreur systématique." },
    { q: "Pour réduire une erreur aléatoire, on :", r: ["change d'unité", "lit de biais", "arrondit plus", "répète la mesure et fait la moyenne"], b: 3, e: "Les écarts en plus et en moins se compensent dans la moyenne." },
    { q: "L'erreur de parallaxe vient :", r: ["d'une lecture de biais", "d'une pile usée", "de la température", "d'un mauvais calcul"], b: 0, e: "L'œil doit être perpendiculaire à l'échelle." },
    { q: "La précision d'une règle graduée en millimètres est :", r: ["1 cm", "1 mm", "0,1 mm", "1 m"], b: 1, e: "C'est sa plus petite graduation." },
    { q: "L = (12,4 ± 0,1) cm. L'incertitude absolue vaut :", r: ["12,4 cm", "12,5 cm", "0,1 cm", "0,8 %"], b: 2, e: "C'est le nombre placé après ±." },
    { q: "Quelle écriture de résultat est correcte ?", r: ["0,60", "0,60 ± 0,04", "t = 0,60 s environ", "t = (0,60 ± 0,04) s"], b: 3, e: "Grandeur, valeur, incertitude et unité." },
    { q: "Moyenne de 0,62 ; 0,58 ; 0,60 ; 0,64 ; 0,56 s :", r: ["0,60 s", "0,62 s", "0,58 s", "3,00 s"], b: 0, e: "Somme 3,00 s, divisée par 5." },
    { q: "Une balance qui affiche 0,2 kg à vide doit être :", r: ["jetée", "tarée (remise à zéro)", "utilisée deux fois", "inclinée"], b: 1, e: "On corrige une erreur systématique en réglant l'instrument." }
  ],
  apc: { module: "Physique de Seconde C", famille: "Mesure des grandeurs physiques", agir: "Mesurer une grandeur et apprécier la qualité de la mesure", situation: "Deux balances du marché donnent des masses différentes pour le même sac de riz.", tache: "Identifier le type d'erreur et proposer une vérification." }
});

VRT_L("2nde-c-chimie-rutherford", {
  c: "2nde C", m: "chimie", cle: "L'expérience de Rutherford", titre: "L'expérience de Rutherford et le noyau atomique", duree: 25,
  accroche: "Une feuille d'or presque vide : la matière est surtout du vide.",
  intro: "La chaise sur laquelle tu es assis te paraît pleine. Pourtant, en 1911, une expérience simple a montré que l'atome est presque entièrement vide, avec en son centre un noyau minuscule et très lourd.",
  objectifs: ["décrire l'expérience de Rutherford et ses observations", "en déduire le modèle planétaire de l'atome", "écrire et lire la représentation symbolique d'un noyau"],
  parties: [
    { t: "L'expérience", html:
      "<p>Rutherford bombarde une <strong>feuille d'or très mince</strong> avec des particules α (chargées positivement). Un écran fluorescent tout autour permet de voir où elles arrivent.</p>" +
      "<ol><li>La très grande majorité des particules <strong>traverse</strong> la feuille sans être déviée.</li><li>Quelques-unes sont <strong>déviées</strong>.</li><li>De très rares particules (environ 1 sur 10 000) <strong>rebondissent</strong> vers l'arrière.</li></ol>",
      illus: { legende: "La plupart des particules α traversent ; quelques-unes sont déviées ; de rares rebondissent sur un noyau.", svg:
      "<svg viewBox='0 0 420 200' role='img' aria-label='Particules alpha traversant une feuille d or'><rect x='200' y='20' width='10' height='160' fill='#FFC93C' stroke='#9A6F00'/><g stroke='#1E499B' stroke-width='2' fill='none'><line x1='20' y1='50' x2='400' y2='50'/><line x1='20' y1='80' x2='400' y2='80'/><line x1='20' y1='150' x2='400' y2='150'/><path d='M20 110 L205 110 L400 70'/><path d='M20 125 L200 125 L40 175' stroke='#B03A6E'/></g><circle cx='205' cy='118' r='4' fill='#C24E00'/><text x='215' y='196' font-size='13' fill='#142554'>feuille d'or</text><text x='300' y='64' font-size='12' fill='#1E499B'>déviée</text><text x='40' y='192' font-size='12' fill='#B03A6E'>renvoyée</text></svg>" },
      retenir: "Presque tout traverse, très peu est renvoyé : l'atome est surtout du vide." },
    { t: "Le modèle de Rutherford", html:
      "<div class='def'><b>Modèle planétaire</b>L'atome est constitué d'un <strong>noyau</strong> central, très petit, chargé positivement, qui contient presque toute la masse ; les <strong>électrons</strong>, négatifs, tournent autour, très loin du noyau.</div>" +
      "<p>Ordre de grandeur : le noyau est environ <strong>100 000 fois</strong> plus petit que l'atome (10⁻¹⁵ m contre 10⁻¹⁰ m).</p>" +
      "<div class='savais'><b>Le savais-tu ?</b>Si l'atome avait la taille du stade Ahmadou Ahidjo de Yaoundé, son noyau serait une graine de mil posée au centre de la pelouse.</div>",
      retenir: "Noyau minuscule, positif et lourd ; électrons légers et lointains ; entre les deux, le vide." },
    { t: "La représentation symbolique d'un noyau", html:
      "<p>Le noyau contient des <strong>protons</strong> (charge +e) et des <strong>neutrons</strong> (charge nulle), appelés nucléons.</p>" +
      "<p class='formule'><sup>A</sup><sub>Z</sub>X</p>" +
      "<div class='def'><b>Notation</b>X : symbole de l'élément ; <strong>Z</strong> : numéro atomique = nombre de protons ; <strong>A</strong> : nombre de masse = nombre de nucléons. Nombre de neutrons : <strong>N = A − Z</strong>.</div>" +
      "<div class='ex'><b>Exemple</b>Le noyau de fer ⁵⁶₂₆Fe (le fer des tôles de nos toits) a 26 protons et 56 − 26 = 30 neutrons.</div>" +
      "<div class='astuce'><b>Isotopes</b>Même Z, A différent : ¹²₆C et ¹⁴₆C sont deux isotopes du carbone.</div>",
      retenir: "Z protons, A nucléons, A − Z neutrons ; des isotopes ont le même Z." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Le fait que de rares particules α rebondissent prouve que :</p><ol type='a'><li>l'atome est plein</li><li>les électrons sont lourds</li><li>il existe un noyau petit, dense et positif</li><li>l'or est magnétique</li></ol><details><summary>Voir la réponse</summary><p>Il existe un <strong>noyau</strong> très petit, très dense et chargé positivement, qui repousse les particules α positives.</p></details><p><strong>Exercice.</strong> Donne la composition du noyau ²⁷₁₃Al.</p><details><summary>Voir la réponse</summary><p>13 protons et 27 − 13 = 14 neutrons.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Pendant un débat au club scientifique d'un lycée de Garoua, Moussa affirme : « Si la matière était presque vide, je pourrais passer la main à travers la table. »</p><p><strong>Tâche.</strong> En t'appuyant sur l'expérience de Rutherford, explique pourquoi l'atome est bien presque vide, mais pourquoi la main ne traverse pas la table.</p><details><summary>Voir une réponse attendue</summary><p>Les particules α traversent la feuille d'or sans déviation dans leur immense majorité : l'atome est surtout du vide. Mais la main et la table sont faites d'atomes dont les nuages d'électrons se repoussent (forces électriques) : ce sont ces répulsions, et non la « matière pleine », qui empêchent la main de passer.</p></details></div>",
      retenir: "Savoir-être mobilisé : argumenter à partir d'observations expérimentales." }
  ],
  revision: ["Feuille d'or bombardée par des particules α positives.", "Presque toutes traversent : l'atome est surtout du <strong>vide</strong>.", "De rares rebonds : un <strong>noyau</strong> petit, dense, positif.", "Notation <strong>ᴬ_Z X</strong> : Z protons, A nucléons, N = A − Z neutrons.", "Isotopes : même Z, A différent."],
  exo: "<p>Le noyau de chlore ³⁵₁₇Cl a un isotope de nombre de masse 37. Donne la composition des deux noyaux. <em>(Réponse : 17 protons et 18 neutrons ; 17 protons et 20 neutrons.)</em></p>",
  quiz: [
    { q: "Rutherford bombarde une feuille :", r: ["d'or", "de cuivre", "de papier", "de fer"], b: 0, e: "Une feuille d'or très mince, d'épaisseur quelques milliers d'atomes." },
    { q: "La plupart des particules α :", r: ["rebondissent", "traversent sans déviation", "sont absorbées", "explosent"], b: 1, e: "C'est l'observation principale : l'atome est surtout vide." },
    { q: "Le noyau atomique est chargé :", r: ["négativement", "il est neutre", "positivement", "tantôt + tantôt −"], b: 2, e: "Il contient les protons, positifs." },
    { q: "Presque toute la masse de l'atome est :", r: ["dans les électrons", "répartie partout", "dans le vide", "dans le noyau"], b: 3, e: "Les électrons sont environ 1 800 fois plus légers qu'un nucléon." },
    { q: "Dans ⁵⁶₂₆Fe, le nombre de neutrons est :", r: ["30", "26", "56", "82"], b: 0, e: "N = A − Z = 56 − 26 = 30." },
    { q: "Z représente :", r: ["le nombre de neutrons", "le nombre de protons", "le nombre de nucléons", "la masse"], b: 1, e: "Z est le numéro atomique." },
    { q: "Deux isotopes ont :", r: ["le même A", "le même nombre de neutrons", "le même Z", "des symboles différents"], b: 2, e: "Même élément, donc même nombre de protons Z." },
    { q: "Le noyau est environ … fois plus petit que l'atome :", r: ["10", "100", "2", "100 000"], b: 3, e: "10⁻¹⁵ m contre 10⁻¹⁰ m." },
    { q: "Les particules α sont chargées :", r: ["positivement", "négativement", "elles sont neutres", "de manière variable"], b: 0, e: "Ce sont des noyaux d'hélium, positifs : le noyau d'or les repousse." },
    { q: "²⁷₁₃Al contient :", r: ["27 protons", "13 protons et 14 neutrons", "14 protons et 13 neutrons", "13 neutrons"], b: 1, e: "Z = 13 protons ; 27 − 13 = 14 neutrons." }
  ],
  apc: { module: "Chimie de Seconde C", famille: "Structure de la matière", agir: "Exploiter des résultats expérimentaux pour décrire la structure de l'atome", situation: "Un débat au club scientifique d'un lycée de Garoua sur la « matière vide ».", tache: "Argumenter à partir de l'expérience de Rutherford." }
});

VRT_L("2nde-c-francais-theatre", {
  c: "2nde C", m: "francais", cle: "le texte théâtral (caractéristiques)", titre: "Le texte théâtral : ses caractéristiques", duree: 25,
  accroche: "Au théâtre, les mots sont écrits pour être joués.",
  intro: "Une pièce de théâtre ne se lit pas comme un roman : pas de narrateur, des personnages qui se parlent, des indications pour la scène. Reconnaître ces marques, c'est préparer la lecture de Tartuffe et l'analyse de n'importe quel extrait au devoir.",
  objectifs: ["identifier dialogue, didascalies et double énonciation", "nommer les formes de la parole théâtrale", "situer un extrait dans la structure d'une pièce"],
  parties: [
    { t: "Un texte fait pour la scène", html:
      "<div class='def'><b>Définition</b>Le texte théâtral est composé de <strong>répliques</strong> (les paroles des personnages) et de <strong>didascalies</strong> (indications de jeu, de décor, de ton, souvent en italique).</div>" +
      "<div class='ex'><b>Exemple</b>ORGON, <em>à Dorine</em>. — Et Tartuffe ? <br>DORINE. — Tartuffe ? Il se porte à merveille.<br>Le nom du personnage, puis sa réplique ; « à Dorine » est une didascalie.</div>" +
      "<div class='def'><b>Double énonciation</b>Un personnage parle à un autre personnage, mais l'auteur s'adresse en même temps au <strong>spectateur</strong>, qui en sait souvent plus que les personnages.</div>",
      retenir: "Répliques pour les personnages, didascalies pour la mise en scène, et toujours un spectateur qui écoute." },
    { t: "Les formes de la parole", html:
      "<ul><li><strong>Tirade</strong> : longue réplique sans interruption.</li><li><strong>Stichomythie</strong> : échange rapide de répliques très courtes (souvent un conflit).</li><li><strong>Monologue</strong> : un personnage seul sur scène parle (il dévoile ses pensées).</li><li><strong>Aparté</strong> : réplique dite à part, que les autres personnages sont censés ne pas entendre, mais que le public entend.</li></ul>" +
      "<div class='astuce'><b>Astuce</b>Dans les palabres d'un village, le notable qui prend longuement la parole fait une tirade ; deux voisins qui se disputent au marché font une stichomythie.</div>",
      retenir: "Tirade longue, stichomythie rapide, monologue seul, aparté secret pour le public." },
    { t: "La structure d'une pièce", html:
      "<p>Une pièce classique se divise en <strong>actes</strong>, eux-mêmes divisés en <strong>scènes</strong> (une scène change dès qu'un personnage entre ou sort).</p>" +
      "<ol><li><strong>Exposition</strong> : présente les personnages et la situation.</li><li><strong>Nœud</strong> : le conflit se développe, les obstacles s'accumulent.</li><li><strong>Dénouement</strong> : le conflit se résout (heureusement dans la comédie, tragiquement dans la tragédie).</li></ol>" +
      "<div class='savais'><b>Le savais-tu ?</b>Les pièces de Guillaume Oyônô Mbia, comme <em>Trois prétendants… un mari</em>, reprennent cette construction pour faire rire des réalités camerounaises de la dot et du mariage.</div>",
      retenir: "Actes et scènes ; exposition, nœud, dénouement." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Une réplique dite « à part » que le public entend mais pas les autres personnages est :</p><ol type='a'><li>une tirade</li><li>un monologue</li><li>un aparté</li><li>une didascalie</li></ol><details><summary>Voir la réponse</summary><p>Un <strong>aparté</strong>.</p></details><p><strong>Exercice.</strong> Dans « JUMA, <em>se levant brusquement</em>. — Assez ! », relève la didascalie et dis à quoi elle sert.</p><details><summary>Voir la réponse</summary><p>« se levant brusquement » : elle indique le geste et traduit la colère du personnage.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Ton club de théâtre prépare la Semaine de la jeunesse. On te confie une courte scène où un père refuse un prétendant pauvre pour sa fille.</p><p><strong>Tâche.</strong> Écris un échange de six répliques comportant au moins deux didascalies, une stichomythie et un aparté.</p><details><summary>Voir une réponse attendue</summary><p>Exemple : LE PÈRE, <em>croisant les bras</em>. — Combien gagnes-tu ? / LE PRÉTENDANT. — Assez. / LE PÈRE. — Assez pour qui ? / LE PRÉTENDANT. — Pour vivre. / LE PÈRE. — Pour vivre seul ! / LA FILLE, <em>à part</em>. — Il ne voit que l'argent… On vérifie : didascalies en italique, répliques courtes enchaînées, aparté signalé.</p></details></div>",
      retenir: "Savoir-être mobilisé : créativité et respect des codes du genre." }
  ],
  revision: ["Texte théâtral = <strong>répliques</strong> + <strong>didascalies</strong>.", "<strong>Double énonciation</strong> : on parle au personnage et au public.", "Tirade, stichomythie, monologue, aparté.", "Actes divisés en scènes.", "Exposition, nœud, dénouement."],
  exo: "<p>Indique la forme de parole : a) un valet seul se plaint de son maître ; b) deux personnages échangent dix répliques d'un mot. <em>(Réponse : a) monologue ; b) stichomythie.)</em></p>",
  quiz: [
    { q: "Les indications de jeu et de décor s'appellent :", r: ["des didascalies", "des répliques", "des tirades", "des apartés"], b: 0, e: "Elles s'adressent au metteur en scène et aux acteurs." },
    { q: "Une longue réplique ininterrompue est :", r: ["une stichomythie", "une tirade", "un aparté", "une scène"], b: 1, e: "La tirade peut durer plusieurs dizaines de vers." },
    { q: "La double énonciation signifie que :", r: ["deux acteurs parlent ensemble", "la pièce a deux auteurs", "le personnage parle aussi pour le public", "on répète chaque réplique"], b: 2, e: "Le spectateur reçoit tout ce qui se dit sur scène." },
    { q: "Un échange rapide de répliques courtes est :", r: ["un monologue", "un dénouement", "une didascalie", "une stichomythie"], b: 3, e: "Il traduit souvent un affrontement." },
    { q: "Un personnage seul sur scène qui parle prononce :", r: ["un monologue", "un aparté", "une tirade obligatoirement", "un prologue"], b: 0, e: "Il révèle ses pensées au public." },
    { q: "Une scène change quand :", r: ["le décor change obligatoirement", "un personnage entre ou sort", "un acteur se trompe", "le rideau tombe"], b: 1, e: "C'est la règle des scènes au théâtre classique." },
    { q: "La partie qui présente personnages et situation est :", r: ["le dénouement", "le nœud", "l'exposition", "l'épilogue"], b: 2, e: "Elle ouvre la pièce." },
    { q: "Le dénouement d'une comédie est en général :", r: ["tragique", "absent", "violent", "heureux"], b: 3, e: "La comédie se termine bien, souvent par un mariage." },
    { q: "Dans « LA SERVANTE, à part. — Quel aveuglement ! », la réplique est :", r: ["un aparté", "une tirade", "une stichomythie", "un monologue"], b: 0, e: "« à part » : le public entend, les autres personnages non." },
    { q: "Guillaume Oyônô Mbia est l'auteur de :", r: ["Tartuffe", "Trois prétendants… un mari", "Ville cruelle", "Le Cid"], b: 1, e: "Comédie camerounaise sur la dot et le mariage." }
  ],
  apc: { module: "Français de Seconde C", famille: "Vie sociale et culturelle", agir: "Lire et produire un texte théâtral", situation: "Le club de théâtre prépare une scène pour la Semaine de la jeunesse.", tache: "Écrire une courte scène respectant les codes du théâtre." }
});

VRT_L("2nde-c-ecm-production", {
  c: "2nde C", m: "ecm", cle: "La production", titre: "La production : facteurs et secteurs", duree: 20,
  accroche: "Du champ de cacao à la tablette de chocolat : produire, c'est transformer.",
  intro: "Le planteur de cacao de la Lekié, l'usine de transformation de Douala et le taxi-moto qui transporte les sacs produisent tous quelque chose. Comprendre la production, c'est comprendre d'où viennent les richesses d'un pays.",
  objectifs: ["définir la production et ses facteurs", "classer une activité dans un secteur", "expliquer le rôle de la production dans le développement"],
  parties: [
    { t: "Qu'est-ce que produire ?", html:
      "<div class='def'><b>Définition</b>La <strong>production</strong> est l'activité qui consiste à créer des <strong>biens</strong> (objets matériels : maïs, ciment, savon) ou des <strong>services</strong> (activités immatérielles : soins, transport, enseignement) pour satisfaire des besoins.</div>" +
      "<div class='ex'><b>Exemples camerounais</b>Biens : la banane de Njombé, l'aluminium d'Edéa, le ciment de Figuil. Services : un appel téléphonique, une consultation à l'hôpital, un trajet en car Douala–Yaoundé.</div>",
      retenir: "On produit des biens (on les touche) et des services (on en profite)." },
    { t: "Les facteurs de production", html:
      "<ul><li><strong>La nature</strong> : terre, eau, forêt, sous-sol (pétrole, bauxite).</li><li><strong>Le travail</strong> : l'activité humaine, physique ou intellectuelle.</li><li><strong>Le capital</strong> : outils, machines, bâtiments, argent investi.</li></ul>" +
      "<div class='astuce'><b>Astuce</b>Une boulangerie de quartier combine les trois : farine et eau (nature), boulanger (travail), four et local (capital). On y ajoute souvent l'<strong>esprit d'entreprise</strong>, qui organise les autres.</div>",
      retenir: "Nature + travail + capital, organisés par l'entrepreneur." },
    { t: "Les trois secteurs d'activité", html:
      "<ol><li><strong>Primaire</strong> : exploitation directe de la nature (agriculture, élevage, pêche, mines). Ex. : la culture du café à Dschang.</li><li><strong>Secondaire</strong> : transformation des matières premières (industrie, BTP). Ex. : une brasserie, une scierie.</li><li><strong>Tertiaire</strong> : services (commerce, transport, banque, santé, éducation, télécoms).</li></ol>" +
      "<div class='savais'><b>Le savais-tu ?</b>Le Cameroun exporte encore beaucoup de produits bruts (cacao, bois, pétrole). Les transformer sur place ferait passer la valeur du secteur primaire au secondaire, et créerait des emplois.</div>",
      retenir: "Primaire : on récolte ; secondaire : on transforme ; tertiaire : on rend service." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Un vendeur de pagnes au marché central exerce dans le secteur :</p><ol type='a'><li>primaire</li><li>secondaire</li><li>tertiaire</li><li>informel seulement</li></ol><details><summary>Voir la réponse</summary><p><strong>Tertiaire</strong> : le commerce est un service.</p></details><p><strong>Exercice.</strong> Classe : pêcheur de Kribi, menuisier, infirmière, mineur de Bétaré-Oya.</p><details><summary>Voir la réponse</summary><p>Pêcheur et mineur : primaire ; menuisier : secondaire ; infirmière : tertiaire.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Ta tante produit du manioc à Ayos. Elle le vend brut au marché à bas prix et pense ouvrir un petit atelier pour en faire du bâton de manioc et du tapioca.</p><p><strong>Tâche.</strong> Explique-lui, avec les notions de facteurs de production et de secteurs, ce que ce projet changerait.</p><details><summary>Voir une réponse attendue</summary><p>Elle passerait du secteur primaire (récolte) au secondaire (transformation). Il lui faudra plus de capital (râpes, presses, local) et de travail (employés), mais le produit transformé se vend plus cher et se conserve mieux : elle crée de la valeur ajoutée et des emplois au village.</p></details></div>",
      retenir: "Savoir-être mobilisé : esprit d'initiative et sens de l'entreprise." }
  ],
  revision: ["Produire = créer des <strong>biens</strong> ou des <strong>services</strong>.", "Facteurs : <strong>nature, travail, capital</strong> (+ esprit d'entreprise).", "Primaire : exploitation de la nature.", "Secondaire : transformation.", "Tertiaire : services."],
  exo: "<p>Donne un exemple camerounais d'activité de chaque secteur. <em>(Exemple : cacaoculture ; brasserie ; transport urbain.)</em></p>",
  quiz: [
    { q: "Une consultation chez le médecin est :", r: ["un service", "un bien", "une matière première", "un capital"], b: 0, e: "C'est une activité immatérielle." },
    { q: "Lequel n'est PAS un facteur de production ?", r: ["le travail", "le loisir", "le capital", "la nature"], b: 1, e: "Les facteurs sont la nature, le travail et le capital." },
    { q: "Une brasserie appartient au secteur :", r: ["primaire", "tertiaire", "secondaire", "quaternaire"], b: 2, e: "Elle transforme des matières premières." },
    { q: "La pêche à Kribi relève du secteur :", r: ["secondaire", "tertiaire", "industriel", "primaire"], b: 3, e: "Exploitation directe de la nature." },
    { q: "Un four de boulangerie est un élément du :", r: ["capital", "travail", "secteur primaire", "service"], b: 0, e: "C'est un équipement durable." },
    { q: "Le transport Douala–Yaoundé est :", r: ["un bien", "un service", "une matière première", "du secteur primaire"], b: 1, e: "Le transport est un service." },
    { q: "Transformer le cacao sur place permettrait surtout :", r: ["de réduire le travail", "de supprimer le capital", "de créer de la valeur ajoutée et des emplois", "d'exporter plus de fèves brutes"], b: 2, e: "Le produit transformé vaut plus que la matière brute." },
    { q: "L'aluminium d'Edéa est :", r: ["un service", "un facteur de travail", "un produit du primaire", "un bien industriel"], b: 3, e: "Il est produit par transformation de l'alumine." },
    { q: "Un enseignant travaille dans le secteur :", r: ["tertiaire", "primaire", "secondaire", "minier"], b: 0, e: "L'éducation est un service." },
    { q: "Celui qui organise et combine les facteurs de production est :", r: ["le consommateur", "l'entrepreneur", "le client", "le fisc"], b: 1, e: "Il prend le risque et organise la production." }
  ],
  apc: { module: "Éducation à la citoyenneté et à la morale, Seconde", famille: "Vie économique", agir: "Comprendre l'organisation de la production pour s'insérer dans la vie économique", situation: "Une productrice de manioc d'Ayos veut transformer sa récolte.", tache: "Expliquer l'intérêt de passer du primaire au secondaire." }
});

/* ══════════════════════════ 2nde A ══════════════════════════ */

VRT_L("2nde-a-maths-reels", {
  c: "2nde A", m: "maths", cle: "IR et ses sous ensembles", titre: "ℝ et ses sous-ensembles", duree: 20,
  accroche: "Compter les pagnes, partager la tontine, mesurer une diagonale : trois familles de nombres.",
  intro: "Au marché, on compte en nombres entiers ; dans une tontine, on partage en fractions ; sur un terrain carré, la diagonale donne une racine. Ranger ces nombres dans leurs ensembles aide à calculer juste et à bien rédiger.",
  objectifs: ["nommer les ensembles ℕ, ℤ, 𝔻, ℚ, ℝ", "dire à quel ensemble appartient un nombre", "lire et écrire ∈, ∉ et ⊂"],
  parties: [
    { t: "Des entiers aux réels", html:
      "<div class='def'><b>Les ensembles</b><strong>ℕ</strong> : 0, 1, 2, 3… ; <strong>ℤ</strong> : ajoute les négatifs (−1, −2…) ; <strong>𝔻</strong> : nombres à virgule qui s'arrêtent (2,5 ; −0,75) ; <strong>ℚ</strong> : toutes les fractions p/q ; <strong>ℝ</strong> : tous les nombres de la droite graduée.</div>" +
      "<p class='formule'>ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ</p>" +
      "<div class='ex'><b>Exemples</b>Un découvert de 3 000 F se note −3 000 : c'est un entier relatif. Un pagne à 4 500,50 F n'existe pas en pièces, mais 4 500,50 est un décimal. Un tiers de la cagnotte, 1/3, est un rationnel.</div>",
      retenir: "Chaque ensemble est inclus dans le suivant." },
    { t: "Reconnaître un décimal", html:
      "<p>Un nombre est <strong>décimal</strong> s'il s'écrit avec un nombre <strong>fini</strong> de chiffres après la virgule.</p>" +
      "<div class='ex'><b>Exemples</b>3/4 = 0,75 : décimal. 2/3 = 0,666… : la suite de 6 ne s'arrête pas, ce n'est pas un décimal, mais c'est un rationnel.</div>" +
      "<div class='astuce'><b>Astuce</b>Pour une fraction simplifiée, regarde le dénominateur : s'il ne contient que des 2 et des 5 (4 = 2 × 2 ; 20 = 2 × 2 × 5), la fraction est décimale.</div>",
      retenir: "Décimal = écriture qui s'arrête ; rationnel = fraction, même si l'écriture ne s'arrête pas." },
    { t: "Des nombres qui ne sont pas des fractions", html:
      "<p>Certains réels ne s'écrivent pas comme une fraction : ce sont les <strong>irrationnels</strong>, comme √2 ≈ 1,414… ou π ≈ 3,1416…</p>" +
      "<div class='savais'><b>Le savais-tu ?</b>La légende raconte qu'Hippase, un disciple de Pythagore, aurait été chassé pour avoir révélé que √2 n'est pas une fraction : pour les pythagoriciens, tout devait être rapport de nombres entiers.</div>" +
      "<div class='attention'><b>Attention</b>√9 = 3 et √0,25 = 0,5 ne sont pas irrationnels : ce sont des racines « qui tombent juste ».</div>",
      retenir: "Les réels sont les rationnels et les irrationnels réunis." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> −12 appartient à :</p><ol type='a'><li>ℕ seulement</li><li>ℤ mais pas ℕ</li><li>aucun ensemble</li><li>𝔻 mais pas ℤ</li></ol><details><summary>Voir la réponse</summary><p><strong>ℤ mais pas ℕ</strong> (et donc aussi 𝔻, ℚ et ℝ).</p></details><p><strong>Exercice.</strong> Écris 3/8 et 5/6 sous forme décimale et dis s'ils sont décimaux.</p><details><summary>Voir la réponse</summary><p>3/8 = 0,375 : décimal. 5/6 = 0,8333… : rationnel non décimal.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Une tontine de six couturières de Bafoussam réunit 100 000 F à partager à parts égales. La trésorière dit : « chacune aura 16 666,66 F tout rond ».</p><p><strong>Tâche.</strong> Explique pourquoi ce n'est pas tout à fait juste et propose une solution pratique pour le partage.</p><details><summary>Voir une réponse attendue</summary><p>100 000 ÷ 6 = 16 666,666… : le 6 se répète à l'infini, c'est un rationnel non décimal. On ne peut pas le payer exactement en francs. Solution : verser 16 666 F à chacune et garder les 4 F restants dans la caisse commune (ou arrondir à 16 665 F et mettre 10 F de côté).</p></details></div>",
      retenir: "Savoir-être mobilisé : honnêteté et sens de la justice dans le partage." }
  ],
  revision: ["<strong>ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ</strong>.", "Décimal : écriture décimale finie.", "Rationnel : fraction p/q.", "Irrationnel : ni décimal ni fraction (√2, π).", "∈ « appartient à », ⊂ « est inclus dans »."],
  exo: "<p>Range dans le plus petit ensemble : 7 ; −2,5 ; 1/7 ; √16 ; √3. <em>(Réponse : ℕ ; 𝔻 ; ℚ ; ℕ ; ℝ.)</em></p>",
  quiz: [
    { q: "Lequel est un entier naturel ?", r: ["−3", "0,5", "12", "√2"], b: 2, e: "12 est positif et entier." },
    { q: "3/4 s'écrit :", r: ["0,75", "0,34", "1,33", "0,666…"], b: 0, e: "3 ÷ 4 = 0,75, un décimal." },
    { q: "2/3 est :", r: ["un entier", "un rationnel non décimal", "un irrationnel", "un décimal"], b: 1, e: "0,666… : fraction, mais écriture infinie." },
    { q: "Quelle inclusion est fausse ?", r: ["ℕ ⊂ ℤ", "ℚ ⊂ ℝ", "𝔻 ⊂ ℚ", "ℝ ⊂ ℕ"], b: 3, e: "ℝ contient bien plus de nombres que ℕ." },
    { q: "√9 est :", r: ["irrationnel", "égal à 3, entier", "égal à 4,5", "négatif"], b: 1, e: "3 × 3 = 9." },
    { q: "π est :", r: ["un décimal", "un entier", "un irrationnel", "une fraction"], b: 2, e: "Son écriture décimale est infinie et non périodique." },
    { q: "Un découvert de 3 000 F s'écrit :", r: ["−3 000, un entier relatif", "3 000, un naturel", "3/1 000", "√3 000"], b: 0, e: "Une dette se note avec un signe moins." },
    { q: "« a ∈ E » se lit :", r: ["a est inclus dans E", "a est égal à E", "a n'appartient pas à E", "a appartient à E"], b: 3, e: "∈ : appartenance d'un élément." },
    { q: "100 000 ÷ 6 vaut :", r: ["16 666", "16 666,666…", "16 667 exactement", "16 666,6"], b: 1, e: "Le 6 se répète sans fin." },
    { q: "Une fraction simplifiée est décimale si son dénominateur ne contient que :", r: ["des 2 et des 5", "des 3", "des nombres pairs", "des 7"], b: 0, e: "Car 10 = 2 × 5." }
  ],
  apc: { module: "Mathématiques de Seconde A", famille: "Représentation, organisation et traitement de l'information", agir: "Utiliser les nombres réels dans des situations de la vie courante", situation: "Une tontine de couturières de Bafoussam partage sa cagnotte.", tache: "Justifier le partage et proposer un arrondi équitable." }
});

VRT_L("2nde-a-francais-enonciation", {
  c: "2nde A", m: "francais", cle: "énonciation (les marques explicites)", titre: "L'énonciation : les marques explicites", duree: 25,
  accroche: "Qui parle, à qui, où et quand ? Le texte le dit, si on sait le lire.",
  intro: "Un SMS « Je suis là demain » n'a de sens que si l'on sait qui l'envoie et quand. Tout texte porte ainsi les traces de celui qui parle : les reconnaître, c'est la première question de toute étude de texte.",
  objectifs: ["définir la situation d'énonciation", "relever les marques explicites de l'énonciation", "distinguer énoncé ancré et énoncé coupé"],
  parties: [
    { t: "La situation d'énonciation", html:
      "<div class='def'><b>Définition</b>L'<strong>énonciation</strong> est l'acte de produire un énoncé. La <strong>situation d'énonciation</strong> répond à quatre questions : <strong>qui</strong> parle (l'énonciateur) ? à <strong>qui</strong> (le destinataire) ? <strong>où</strong> ? <strong>quand</strong> ?</div>" +
      "<div class='ex'><b>Exemple</b>« Je vous attends ici demain à huit heures », dit le proviseur aux élèves de 2nde A, dans la cour, le lundi. Je = le proviseur ; vous = les élèves ; ici = la cour ; demain = mardi.</div>",
      retenir: "Énonciateur, destinataire, lieu, moment : les quatre repères de l'énonciation." },
    { t: "Les marques explicites", html:
      "<ul><li><strong>Pronoms personnels</strong> et <strong>possessifs</strong> de 1ʳᵉ et 2ᵉ personne : je, tu, nous, vous, mon, ton, notre…</li><li><strong>Déictiques</strong> de lieu et de temps : ici, là-bas, ce matin, hier, demain, maintenant, dans trois jours.</li><li><strong>Temps verbaux</strong> liés au moment où l'on parle : présent d'énonciation, passé composé, futur.</li><li><strong>Modalisateurs</strong> qui montrent l'opinion : peut-être, sans doute, hélas, malheureusement, « je pense que ».</li><li><strong>Ponctuation expressive</strong> : ! ?</li></ul>" +
      "<div class='astuce'><b>Astuce</b>Un déictique ne se comprend qu'en connaissant la situation : « demain » change de sens chaque jour.</div>",
      retenir: "Je/tu, ici/maintenant, présent, modalisateurs : l'énonciateur est présent dans son texte." },
    { t: "Énoncé ancré, énoncé coupé", html:
      "<div class='def'><b>Énoncé ancré</b>(ou discours) : lié à la situation d'énonciation, avec ses marques (je, tu, ici, hier). Ex. : une lettre, un dialogue, un discours.</div>" +
      "<div class='def'><b>Énoncé coupé</b>(ou récit) : détaché de la situation, à la 3ᵉ personne, au passé simple et à l'imparfait, avec des repères absolus (« le 20 mai 1972 », « la veille »).</div>" +
      "<div class='ex'><b>Comparer</b>Ancré : « Hier, j'ai vu le défilé à Yaoundé. » Coupé : « La veille, Atangana vit passer le défilé. »</div>",
      retenir: "Ancré = repères liés à celui qui parle ; coupé = repères indépendants." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Dans « Nous partirons demain », le mot « demain » est :</p><ol type='a'><li>un modalisateur</li><li>un déictique de temps</li><li>un pronom</li><li>un repère absolu</li></ol><details><summary>Voir la réponse</summary><p>Un <strong>déictique de temps</strong> : on ne le comprend qu'en sachant quand la phrase est dite.</p></details><p><strong>Exercice.</strong> Relève les marques de l'énonciation : « Ici, mes amis, nous sommes sans doute plus heureux qu'en ville ! »</p><details><summary>Voir la réponse</summary><p>Ici (lieu), mes/nous (1ʳᵉ personne), amis (destinataire), sommes (présent), sans doute (modalisateur), ! (ponctuation expressive).</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Le délégué de ta classe doit annoncer à la radio du lycée la sortie pédagogique au musée de la Blackitude à Yaoundé.</p><p><strong>Tâche.</strong> Rédige son annonce (6 à 8 lignes) en utilisant au moins quatre marques différentes de l'énonciation, puis souligne-les.</p><details><summary>Voir une réponse attendue</summary><p>Exemple : « Chers camarades, je vous annonce que nous visiterons vendredi prochain le musée… Rendez-vous ici, devant le portail, à 7 h. Je pense que vous adorerez ! » Marques : je, vous, nous, vendredi prochain, ici, je pense que, !</p></details></div>",
      retenir: "Savoir-être mobilisé : prise de parole claire et respectueuse." }
  ],
  revision: ["Situation d'énonciation : <strong>qui, à qui, où, quand</strong>.", "Marques : pronoms je/tu/nous/vous, <strong>déictiques</strong>, présent d'énonciation, <strong>modalisateurs</strong>.", "Un déictique dépend de la situation (ici, demain).", "<strong>Énoncé ancré</strong> : discours, lettre, dialogue.", "<strong>Énoncé coupé</strong> : récit à la 3ᵉ personne, passé simple."],
  exo: "<p>Transforme en énoncé coupé : « Demain, je pars à Kribi. » <em>(Réponse possible : « Le lendemain, il partit pour Kribi. »)</em></p>",
  quiz: [
    { q: "L'énonciateur est :", r: ["celui qui parle", "celui qui écoute", "le lieu", "le texte"], b: 0, e: "C'est l'auteur de l'énoncé." },
    { q: "« Ici » est :", r: ["un modalisateur", "un déictique de lieu", "un pronom", "un verbe"], b: 1, e: "Il désigne le lieu où l'on parle." },
    { q: "Lequel est un modalisateur ?", r: ["demain", "nous", "sans doute", "ici"], b: 2, e: "Il exprime le degré de certitude." },
    { q: "Un énoncé coupé utilise surtout :", r: ["je et tu", "le présent d'énonciation", "des déictiques", "le passé simple et la 3ᵉ personne"], b: 3, e: "Il est détaché de la situation d'énonciation." },
    { q: "« La veille » est un repère :", r: ["absolu, du récit", "déictique", "modalisateur", "de lieu"], b: 0, e: "Il ne dépend pas du moment où l'on parle." },
    { q: "Une lettre à un ami est en général un énoncé :", r: ["coupé", "ancré", "historique", "neutre"], b: 1, e: "Elle contient je, tu, ici, aujourd'hui…" },
    { q: "Dans « Je vous attends », le destinataire est désigné par :", r: ["je", "attends", "vous", "aucun mot"], b: 2, e: "Vous = ceux à qui l'on parle." },
    { q: "« Hélas » exprime :", r: ["le lieu", "le temps", "la personne", "un sentiment de l'énonciateur"], b: 3, e: "C'est un modalisateur affectif." },
    { q: "Le présent d'énonciation situe l'action :", r: ["au moment où l'on parle", "dans un passé lointain", "dans un conte", "hors du temps"], b: 0, e: "Ex. : « Je t'écris de Garoua. »" },
    { q: "« Demain » n'a pas le même sens chaque jour parce que :", r: ["c'est un adverbe de manière", "c'est un déictique", "c'est un nom", "il est mal écrit"], b: 1, e: "Il dépend du jour où l'énoncé est produit." }
  ],
  apc: { module: "Français de Seconde A", famille: "Vie sociale et culturelle", agir: "Analyser et produire des textes en tenant compte de la situation d'énonciation", situation: "Le délégué annonce une sortie pédagogique à la radio du lycée.", tache: "Rédiger une annonce comportant les marques de l'énonciation." }
});

VRT_L("2nde-a-histoire-disciplines", {
  c: "2nde A", m: "histoire", cle: "disciplines affinitaires de l", titre: "Les disciplines affinitaires de l'histoire", duree: 20,
  accroche: "Une poterie, un fossile, un chant de griot : l'historien a besoin d'alliés.",
  intro: "Pour écrire l'histoire de l'Afrique, où les écrits anciens sont rares, l'historien ne travaille pas seul. Archéologues, ethnologues, linguistes, géologues lui fournissent des sources qu'il croise et critique.",
  objectifs: ["définir les principales disciplines affinitaires", "dire ce que chacune apporte à l'historien", "illustrer par des exemples camerounais"],
  parties: [
    { t: "Pourquoi des disciplines « affinitaires » ?", html:
      "<p>L'<strong>histoire</strong> étudie le passé des sociétés humaines à partir de <strong>sources</strong> : écrites, orales, matérielles. Les <strong>disciplines affinitaires</strong> (ou auxiliaires) sont des sciences voisines qui aident à trouver, dater et comprendre ces sources.</p>" +
      "<div class='attention'><b>Méthode</b>Une source ne « parle » pas seule : l'historien la <strong>critique</strong> (qui l'a produite ? quand ? pourquoi ?) et la <strong>croise</strong> avec d'autres.</div>",
      retenir: "Plus les sources écrites sont rares, plus les disciplines affinitaires sont précieuses." },
    { t: "Les principales disciplines", html:
      "<ul><li><strong>Archéologie</strong> : étudie les vestiges matériels (outils, poteries, tombes) mis au jour par des fouilles.</li><li><strong>Paléontologie</strong> : étudie les fossiles d'êtres vivants disparus.</li><li><strong>Ethnologie / anthropologie</strong> : étudie les peuples, leurs coutumes, leurs institutions.</li><li><strong>Linguistique</strong> : étudie les langues ; leur parenté éclaire les migrations (ex. : les langues bantoues).</li><li><strong>Tradition orale</strong> : récits, généalogies, chants transmis par les anciens et les griots.</li><li><strong>Numismatique</strong> (monnaies), <strong>épigraphie</strong> (inscriptions), <strong>toponymie</strong> (noms de lieux).</li></ul>",
      retenir: "Vestiges, fossiles, coutumes, langues, paroles, monnaies, inscriptions, noms de lieux : autant de sources." },
    { t: "Dater le passé : l'apport des sciences", html:
      "<p>La <strong>datation au carbone 14</strong> mesure la radioactivité restante dans un reste organique (charbon de bois, os) : sa quantité diminue de moitié environ tous les <strong>5 730 ans</strong>.</p>" +
      "<div class='ex'><b>Au Cameroun</b>L'abri sous roche de <strong>Shum Laka</strong>, près de Bamenda, a livré des outils et des sépultures vieux de plusieurs milliers d'années, datés grâce à ces méthodes. Le site d'<strong>Obobogo</strong>, près de Yaoundé, témoigne d'une occupation ancienne avec poteries et traces de métallurgie.</div>" +
      "<div class='savais'><b>Le savais-tu ?</b>Des chercheurs ont extrait de l'ADN ancien de squelettes de Shum Laka : c'est la génétique qui devient, elle aussi, une alliée de l'historien.</div>",
      retenir: "Le carbone 14 date les restes organiques ; la stratigraphie (couches du sol) donne l'ordre des événements." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> La science qui étudie les monnaies anciennes est :</p><ol type='a'><li>l'épigraphie</li><li>la toponymie</li><li>la numismatique</li><li>la paléontologie</li></ol><details><summary>Voir la réponse</summary><p>La <strong>numismatique</strong>.</p></details><p><strong>Exercice.</strong> Associe : poterie enfouie ; chant du griot ; nom du village « Ndog-Bong ».</p><details><summary>Voir la réponse</summary><p>Archéologie ; tradition orale ; toponymie.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> En creusant les fondations d'une maison à Mbalmayo, des ouvriers trouvent des tessons de poterie et du charbon de bois. Le propriétaire veut tout jeter pour continuer les travaux.</p><p><strong>Tâche.</strong> Explique-lui l'intérêt historique de cette découverte et ce qu'il devrait faire.</p><details><summary>Voir une réponse attendue</summary><p>Ces vestiges peuvent renseigner sur les anciens habitants : la poterie (archéologie) sur leur mode de vie, le charbon de bois sur la date (carbone 14). Il faut arrêter de creuser à cet endroit, ne rien déplacer et prévenir les autorités (délégation de la Culture, université) pour que des spécialistes examinent le site.</p></details></div>",
      retenir: "Savoir-être mobilisé : respect et protection du patrimoine." }
  ],
  revision: ["Histoire = étude du passé à partir de <strong>sources</strong> critiquées.", "<strong>Archéologie</strong> : vestiges ; <strong>paléontologie</strong> : fossiles.", "<strong>Ethnologie</strong> : peuples ; <strong>linguistique</strong> : langues.", "<strong>Tradition orale</strong>, numismatique, épigraphie, toponymie.", "<strong>Carbone 14</strong> : moitié perdue environ tous les 5 730 ans."],
  exo: "<p>Quelle discipline consulter pour savoir pourquoi un quartier s'appelle « Mokolo » ? <em>(Réponse : la toponymie, avec la tradition orale.)</em></p>",
  quiz: [
    { q: "L'archéologie étudie :", r: ["les vestiges matériels", "les langues", "les monnaies seulement", "les étoiles"], b: 0, e: "Outils, poteries, tombes, bâtiments." },
    { q: "La tradition orale est transmise par :", r: ["les archives", "les anciens et les griots", "les fossiles", "les monnaies"], b: 1, e: "Récits, généalogies, chants." },
    { q: "La toponymie étudie :", r: ["les fossiles", "les inscriptions", "les noms de lieux", "les coutumes"], b: 2, e: "Topos = lieu, onoma = nom." },
    { q: "Le carbone 14 sert à :", r: ["traduire une langue", "lire une carte", "étudier les monnaies", "dater des restes organiques"], b: 3, e: "Sa radioactivité diminue régulièrement." },
    { q: "Shum Laka se trouve près de :", r: ["Bamenda", "Maroua", "Kribi", "Bertoua"], b: 0, e: "Abri sous roche de la région du Nord-Ouest." },
    { q: "La parenté des langues bantoues renseigne surtout sur :", r: ["la monnaie", "les migrations", "le climat", "les fossiles"], b: 1, e: "Des langues proches signalent des origines communes." },
    { q: "L'épigraphie étudie :", r: ["les poteries", "les fossiles", "les inscriptions", "les chants"], b: 2, e: "Textes gravés sur pierre, métal…" },
    { q: "Avant d'utiliser une source, l'historien doit :", r: ["la recopier", "la jeter", "la vendre", "la critiquer et la croiser"], b: 3, e: "Qui ? quand ? pourquoi ? avec quelles autres sources ?" },
    { q: "L'ethnologie étudie :", r: ["les peuples et leurs coutumes", "les roches", "les monnaies", "les fossiles"], b: 0, e: "Organisation sociale, rites, institutions." },
    { q: "Des tessons trouvés dans un chantier, il faut :", r: ["les jeter", "arrêter et prévenir les autorités", "les vendre au marché", "les casser"], b: 1, e: "Ils appartiennent au patrimoine." }
  ],
  apc: { module: "Histoire de Seconde", famille: "Vie sociale et culturelle", agir: "Utiliser des sources variées pour reconstituer le passé", situation: "Des vestiges découverts lors de travaux à Mbalmayo.", tache: "Expliquer l'intérêt historique et la conduite à tenir." }
});

VRT_L("2nde-a-philo-definitions", {
  c: "2nde A", m: "philo", cle: "Définitions de la Philosophie", titre: "Qu'est-ce que la philosophie ?", duree: 20,
  accroche: "Philosopher, c'est oser demander « pourquoi ? » jusqu'au bout.",
  intro: "« Pourquoi faut-il obéir aux aînés ? » « Le bonheur, c'est d'avoir de l'argent ? » Ces questions que tu te poses déjà sont philosophiques. La philosophie apprend à les poser clairement et à y répondre par la raison.",
  objectifs: ["donner l'étymologie et une définition de la philosophie", "distinguer philosophie et opinion", "citer des philosophes, dont des philosophes camerounais"],
  parties: [
    { t: "Le mot et la chose", html:
      "<div class='def'><b>Étymologie</b>« Philosophie » vient du grec <strong>philein</strong> (aimer) et <strong>sophia</strong> (la sagesse, le savoir) : l'<strong>amour de la sagesse</strong>. On attribue ce mot à Pythagore, qui se disait non pas « sage » mais « ami de la sagesse ».</div>" +
      "<div class='def'><b>Définition</b>La philosophie est une <strong>réflexion critique</strong> et <strong>rationnelle</strong> sur les grandes questions de l'existence : la vérité, le bien, la justice, la liberté, le bonheur.</div>",
      retenir: "Philosophie = amour de la sagesse = réflexion par la raison." },
    { t: "Philosopher, ce n'est pas avoir une opinion", html:
      "<p>L'<strong>opinion</strong> (la doxa) est un avis non vérifié : « on dit que… », « tout le monde sait que… ». La philosophie <strong>examine</strong> ces avis et cherche des <strong>arguments</strong>.</p>" +
      "<div class='ex'><b>Socrate</b>Dans l'Athènes du Vᵉ siècle av. J.-C., Socrate interrogeait les passants jusqu'à ce qu'ils reconnaissent leur ignorance : « Ce que je sais, c'est que je ne sais rien. » Sa devise reprenait celle du temple de Delphes : « Connais-toi toi-même. »</div>" +
      "<div class='astuce'><b>Kant</b>« On n'apprend pas la philosophie, on apprend à philosopher » : ce qui compte, c'est la démarche, pas la récitation.</div>",
      retenir: "L'opinion affirme ; la philosophie questionne et argumente." },
    { t: "Philosopher en Afrique", html:
      "<p>La philosophie n'est pas propre à l'Europe : l'Égypte ancienne, les sagesses africaines et des penseurs contemporains réfléchissent aux mêmes questions.</p>" +
      "<div class='ex'><b>Au Cameroun</b><strong>Marcien Towa</strong> (<em>Essai sur la problématique philosophique dans l'Afrique actuelle</em>, 1971) invite l'Afrique à une pensée critique et libératrice. <strong>Ebénézer Njoh-Mouelle</strong> (<em>De la médiocrité à l'excellence</em>, 1970) appelle chacun à refuser la médiocrité et à se dépasser.</div>",
      retenir: "Towa et Njoh-Mouelle : deux philosophes camerounais au programme." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Le mot « sophia » signifie :</p><ol type='a'><li>l'amour</li><li>la sagesse</li><li>la vérité</li><li>la cité</li></ol><details><summary>Voir la réponse</summary><p><strong>La sagesse</strong> (le savoir).</p></details><p><strong>Exercice.</strong> Opinion ou réflexion philosophique ? a) « Les filles n'aiment pas les maths. » b) « Qu'est-ce qui rend une règle juste ? »</p><details><summary>Voir la réponse</summary><p>a) Opinion (généralisation non vérifiée). b) Question philosophique.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Au quartier, un ami te dit : « La philosophie ne sert à rien, elle ne donne pas de travail. »</p><p><strong>Tâche.</strong> En une quinzaine de lignes, réponds-lui avec deux arguments et un exemple tiré de la vie quotidienne au Cameroun.</p><details><summary>Voir une réponse attendue</summary><p>Argument 1 : elle apprend à raisonner, à argumenter et à repérer les fausses informations (rumeurs sur les réseaux sociaux). Argument 2 : elle éclaire nos choix moraux et citoyens (voter, refuser la corruption). Exemple : avant de partager un message alarmiste sur WhatsApp, se demander « qui l'affirme ? sur quelles preuves ? », c'est déjà philosopher.</p></details></div>",
      retenir: "Savoir-être mobilisé : esprit critique et ouverture au dialogue." }
  ],
  revision: ["<strong>Philein</strong> + <strong>sophia</strong> = amour de la sagesse.", "Réflexion <strong>critique</strong> et <strong>rationnelle</strong>.", "Opinion (doxa) ≠ philosophie.", "Socrate : « Connais-toi toi-même » ; Kant : apprendre à philosopher.", "Camerounais : <strong>Marcien Towa</strong>, <strong>Ebénézer Njoh-Mouelle</strong>."],
  exo: "<p>Formule une question philosophique à partir de la situation : « Mon père m'oblige à choisir la série C. » <em>(Exemple : « Doit-on toujours obéir à ses parents ? »)</em></p>",
  quiz: [
    { q: "Philosophie signifie :", r: ["amour de la sagesse", "science des étoiles", "art de parler", "étude des lois"], b: 0, e: "Philein + sophia." },
    { q: "Le mot est attribué à :", r: ["Kant", "Pythagore", "Towa", "Descartes"], b: 1, e: "Il se disait « ami de la sagesse »." },
    { q: "La doxa désigne :", r: ["la sagesse", "la raison", "l'opinion", "la justice"], b: 2, e: "Un avis non examiné." },
    { q: "« Connais-toi toi-même » est associé à :", r: ["Njoh-Mouelle", "Kant", "Pythagore", "Socrate"], b: 3, e: "Devise du temple de Delphes reprise par Socrate." },
    { q: "Marcien Towa est un philosophe :", r: ["camerounais", "grec", "allemand", "égyptien ancien"], b: 0, e: "Auteur de l'Essai sur la problématique philosophique dans l'Afrique actuelle." },
    { q: "De la médiocrité à l'excellence est de :", r: ["Towa", "Njoh-Mouelle", "Socrate", "Kant"], b: 1, e: "Ebénézer Njoh-Mouelle, 1970." },
    { q: "Selon Kant, on apprend surtout :", r: ["des citations", "l'histoire des philosophes", "à philosopher", "à réciter"], b: 2, e: "La démarche compte plus que le contenu appris." },
    { q: "Une réflexion philosophique s'appuie sur :", r: ["la rumeur", "la tradition seulement", "la force", "des arguments rationnels"], b: 3, e: "Elle justifie ce qu'elle avance." },
    { q: "Laquelle est une question philosophique ?", r: ["Qu'est-ce que la justice ?", "Quelle heure est-il ?", "Combien coûte le pain ?", "Où est Kribi ?"], b: 0, e: "Elle porte sur une notion fondamentale et appelle une réflexion." },
    { q: "Socrate disait savoir :", r: ["tout", "qu'il ne savait rien", "la vérité sur les dieux", "compter"], b: 1, e: "La conscience de son ignorance est le début de la sagesse." }
  ],
  apc: { module: "Philosophie de Seconde A", famille: "Vie sociale et culturelle", agir: "Développer une pensée critique face aux opinions", situation: "Un ami affirme que la philosophie ne sert à rien.", tache: "Lui répondre de manière argumentée." }
});

VRT_L("2nde-a-geo-cartes", {
  c: "2nde A", m: "geo", cle: "Initiation à la lecture des cartes", titre: "Lire une carte", duree: 20,
  accroche: "Titre, légende, orientation, échelle : la carte se lit comme un texte.",
  intro: "Pour aller de Douala à Limbé, pour comprendre où pousse le cacao ou d'où viennent les inondations, il faut savoir lire une carte. Une carte n'est pas un dessin : c'est un document codé, avec ses règles.",
  objectifs: ["identifier les éléments d'une carte", "utiliser l'échelle pour calculer une distance réelle", "s'orienter avec la rose des vents"],
  parties: [
    { t: "Les éléments obligatoires d'une carte", html:
      "<ul><li><strong>Le titre</strong> : dit ce que la carte représente (« Les grandes régions agricoles du Cameroun »).</li><li><strong>La légende</strong> : explique les couleurs, les symboles et les figurés (points, lignes, surfaces).</li><li><strong>L'orientation</strong> : la flèche du Nord ou la rose des vents.</li><li><strong>L'échelle</strong> : le rapport entre les distances sur la carte et sur le terrain.</li><li><strong>La source et la date</strong> : qui a produit les données, et quand.</li></ul>" +
      "<div class='astuce'><b>Méthode</b>On lit d'abord le titre, puis la légende, <strong>avant</strong> de regarder la carte elle-même.</div>",
      retenir: "TOLES : Titre, Orientation, Légende, Échelle, Source." },
    { t: "Calculer avec l'échelle", html:
      "<div class='def'><b>Échelle numérique</b>1/50 000 signifie que <strong>1 cm sur la carte = 50 000 cm sur le terrain</strong>, soit 500 m.</div>" +
      "<p class='formule'>distance réelle = distance sur la carte × dénominateur de l'échelle</p>" +
      "<div class='ex'><b>Exemple</b>Sur une carte au 1/200 000, deux villages sont à 6 cm l'un de l'autre : 6 × 200 000 = 1 200 000 cm = <strong>12 km</strong>.</div>" +
      "<div class='attention'><b>Attention</b>Plus le dénominateur est grand, plus la carte est à <strong>petite échelle</strong> (elle montre un grand territoire avec peu de détails) : une carte du monde au 1/50 000 000 est à petite échelle ; un plan de Yaoundé au 1/10 000 est à grande échelle.</div>",
      retenir: "On multiplie, puis on convertit les centimètres en mètres ou en kilomètres." },
    { t: "S'orienter", html:
      "<p>La <strong>rose des vents</strong> indique les quatre points cardinaux : Nord, Sud, Est, Ouest, et les points intermédiaires (Nord-Est, Sud-Ouest…).</p>" +
      "<div class='ex'><b>Au Cameroun</b>Garoua est au <strong>Nord</strong> de Yaoundé ; Douala est à l'<strong>Ouest</strong> de Yaoundé ; Bertoua est à l'<strong>Est</strong>.</div>" +
      "<div class='savais'><b>Le savais-tu ?</b>Sur le terrain, le soleil se lève à l'Est et se couche à l'Ouest : à midi, au Cameroun, il est presque à la verticale, car le pays est proche de l'équateur.</div>",
      retenir: "Le Nord est en haut, sauf indication contraire de la flèche." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> L'élément d'une carte qui explique les symboles est :</p><ol type='a'><li>le titre</li><li>l'échelle</li><li>l'orientation</li><li>la légende</li></ol><details><summary>Voir la réponse</summary><p><strong>La légende</strong>.</p></details><p><strong>Exercice.</strong> Sur une carte au 1/25 000, une route mesure 8 cm. Quelle est sa longueur réelle ?</p><details><summary>Voir la réponse</summary><p>8 × 25 000 = 200 000 cm = 2 km.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Ton club environnement veut indiquer aux habitants d'un quartier de Douala les zones inondables proches du Wouri, sur une carte au 1/10 000.</p><p><strong>Tâche.</strong> Indique les éléments que la carte doit comporter, et calcule la distance réelle représentée par 3,5 cm.</p><details><summary>Voir une réponse attendue</summary><p>Titre (« Zones inondables du quartier… »), légende (zones à risque, routes, points de refuge), flèche du Nord, échelle 1/10 000, source et date. 3,5 × 10 000 = 35 000 cm = 350 m.</p></details></div>",
      retenir: "Savoir-être mobilisé : sens civique et souci de la sécurité collective." }
  ],
  revision: ["Éléments : <strong>titre, orientation, légende, échelle, source</strong>.", "Lire titre et légende avant la carte.", "<strong>Distance réelle = distance carte × dénominateur</strong>.", "Grand dénominateur = petite échelle (grand territoire).", "Rose des vents : N, S, E, O."],
  exo: "<p>Sur une carte au 1/500 000, Edéa et Douala sont à environ 12 cm. Distance réelle ? <em>(Réponse : 6 000 000 cm = 60 km.)</em></p>",
  quiz: [
    { q: "Ce que représente une carte est indiqué par :", r: ["le titre", "l'échelle", "la source", "le Nord"], b: 0, e: "On le lit en premier." },
    { q: "Au 1/50 000, 1 cm représente :", r: ["50 m", "500 m", "5 km", "50 km"], b: 1, e: "50 000 cm = 500 m." },
    { q: "Au 1/200 000, 6 cm représentent :", r: ["1,2 km", "120 km", "12 km", "1 200 km"], b: 2, e: "6 × 200 000 = 1 200 000 cm = 12 km." },
    { q: "La légende sert à :", r: ["dater la carte", "orienter la carte", "mesurer", "expliquer les symboles"], b: 3, e: "Couleurs, figurés, symboles." },
    { q: "Garoua est située par rapport à Yaoundé au :", r: ["Nord", "Sud", "Ouest", "Est"], b: 0, e: "Région du Nord." },
    { q: "Un plan de ville au 1/10 000 est à :", r: ["petite échelle", "grande échelle", "échelle nulle", "aucune échelle"], b: 1, e: "Petit dénominateur, beaucoup de détails." },
    { q: "Le soleil se lève à :", r: ["l'Ouest", "le Nord", "l'Est", "le Sud"], b: 2, e: "Et il se couche à l'Ouest." },
    { q: "Au 1/25 000, 8 cm représentent :", r: ["20 km", "200 m", "8 km", "2 km"], b: 3, e: "8 × 25 000 = 200 000 cm = 2 km." },
    { q: "L'orientation d'une carte est donnée par :", r: ["la flèche du Nord ou la rose des vents", "la légende", "le titre", "la source"], b: 0, e: "Elle indique les points cardinaux." },
    { q: "Douala est par rapport à Yaoundé à :", r: ["l'Est", "l'Ouest", "le Nord", "le Sud"], b: 1, e: "Douala est sur la côte, à l'ouest de Yaoundé." }
  ],
  apc: { module: "Géographie de Seconde", famille: "Environnement, santé et bien-être", agir: "Lire et produire des cartes pour comprendre et protéger l'environnement", situation: "Un club environnement cartographie les zones inondables d'un quartier de Douala.", tache: "Concevoir les éléments de la carte et calculer des distances réelles." }
});

/* ══════════════════════════ 5e ══════════════════════════ */

VRT_L("5e-maths-division-euclidienne", {
  c: "5e", m: "maths", cle: "Introduction et division euclidienne", titre: "La division euclidienne", duree: 20,
  accroche: "157 mangues dans des sacs de 12 : combien de sacs, combien de restes ?",
  intro: "Au marché, une commerçante range ses mangues par sacs de 12. Elle veut savoir combien de sacs pleins elle obtiendra et combien de mangues resteront. C'est exactement ce que calcule la division euclidienne.",
  objectifs: ["poser une division euclidienne", "écrire l'égalité a = b × q + r", "vérifier que le reste est plus petit que le diviseur"],
  parties: [
    { t: "Le vocabulaire", html:
      "<div class='def'><b>Définition</b>Faire la <strong>division euclidienne</strong> d'un entier <strong>a</strong> (le dividende) par un entier <strong>b</strong> non nul (le diviseur), c'est trouver deux entiers <strong>q</strong> (le quotient) et <strong>r</strong> (le reste) tels que :</div>" +
      "<p class='formule'>a = b × q + r avec 0 ≤ r &lt; b</p>" +
      "<div class='ex'><b>Exemple</b>157 = 12 × 13 + 1 : le quotient est 13, le reste est 1, et 1 &lt; 12.</div>",
      retenir: "Dividende = diviseur × quotient + reste, et le reste est toujours plus petit que le diviseur." },
    { t: "Poser la division", html:
      "<ol><li>On cherche combien de fois 12 « va » dans 15 : 1 fois (12), il reste 3.</li><li>On abaisse le 7 : 37. 12 va 3 fois dans 37 (36), il reste 1.</li><li>Résultat : quotient <strong>13</strong>, reste <strong>1</strong>.</li></ol>" +
      "<div class='astuce'><b>Vérifier</b>On calcule toujours b × q + r : 12 × 13 + 1 = 156 + 1 = 157. ✓</div>" +
      "<div class='attention'><b>Attention</b>Écrire 157 = 12 × 12 + 13 est une égalité juste, mais ce n'est pas la division euclidienne : le reste 13 n'est pas plus petit que 12.</div>",
      retenir: "Toujours vérifier : le calcul retombe sur le dividende, et r &lt; b." },
    { t: "Diviseurs et multiples", html:
      "<p>Si le reste est <strong>nul</strong>, on dit que b <strong>divise</strong> a, que a est un <strong>multiple</strong> de b.</p>" +
      "<div class='ex'><b>Exemple</b>96 = 12 × 8 + 0 : 12 divise 96, et 96 est un multiple de 12. Une classe de 96 élèves peut être répartie en 8 groupes de 12 sans reste.</div>" +
      "<div class='savais'><b>Le savais-tu ?</b>Cette division porte le nom d'Euclide, mathématicien grec d'Alexandrie (IIIᵉ siècle av. J.-C.), qui l'a décrite dans ses <em>Éléments</em>.</div>",
      retenir: "Reste nul : b est un diviseur de a, a est un multiple de b." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Dans la division euclidienne de 50 par 7, le reste est :</p><ol type='a'><li>7</li><li>1</li><li>0</li><li>8</li></ol><details><summary>Voir la réponse</summary><p>50 = 7 × 7 + <strong>1</strong>.</p></details><p><strong>Exercice.</strong> Effectue la division euclidienne de 245 par 9 et écris l'égalité.</p><details><summary>Voir la réponse</summary><p>245 = 9 × 27 + 2 (et 2 &lt; 9).</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Pour la fête de l'école à Ebolowa, 230 élèves doivent voyager dans des cars de 48 places.</p><p><strong>Tâche 1.</strong> Combien de cars pleins ? <strong>Tâche 2.</strong> Combien de cars faut-il réserver en tout ?</p><details><summary>Voir une réponse attendue</summary><p>230 = 48 × 4 + 38 : 4 cars pleins, et il reste 38 élèves. Il faut donc réserver <strong>5 cars</strong> : on ne laisse aucun élève à l'école !</p></details></div>",
      retenir: "Savoir-être mobilisé : rigueur et sens de l'organisation." }
  ],
  revision: ["<strong>a = b × q + r</strong> avec <strong>0 ≤ r &lt; b</strong>.", "a : dividende ; b : diviseur ; q : quotient ; r : reste.", "On vérifie : b × q + r doit redonner a.", "Reste nul : b divise a.", "Dans un problème, le reste peut obliger à ajouter une unité (un car de plus)."],
  exo: "<p>Un paysan range 500 œufs dans des alvéoles de 30. Combien d'alvéoles pleines et combien d'œufs restent ? <em>(Réponse : 500 = 30 × 16 + 20 : 16 alvéoles, 20 œufs.)</em></p>",
  quiz: [
    { q: "Dans a = b × q + r, q est :", r: ["le quotient", "le reste", "le diviseur", "le dividende"], b: 0, e: "C'est le nombre de fois que b « va » dans a." },
    { q: "Le reste doit toujours être :", r: ["plus grand que b", "strictement plus petit que b", "égal à b", "pair"], b: 1, e: "0 ≤ r &lt; b." },
    { q: "157 = 12 × 13 + … :", r: ["13", "12", "1", "0"], b: 2, e: "12 × 13 = 156, il reste 1." },
    { q: "La division euclidienne de 50 par 7 donne :", r: ["q = 6, r = 8", "q = 8, r = 0", "q = 5, r = 15", "q = 7, r = 1"], b: 3, e: "7 × 7 = 49 et 50 − 49 = 1." },
    { q: "Si le reste est 0, alors :", r: ["b divise a", "a divise b", "le calcul est faux", "q = 0"], b: 0, e: "a est un multiple de b." },
    { q: "Pour 230 élèves et des cars de 48 places, il faut réserver :", r: ["4 cars", "5 cars", "6 cars", "48 cars"], b: 1, e: "230 = 48 × 4 + 38 : un 5ᵉ car pour les 38 restants." },
    { q: "Quelle égalité est une division euclidienne ?", r: ["157 = 12 × 12 + 13", "157 = 10 × 15 + 7 par 15", "157 = 12 × 13 + 1", "157 = 12 × 14 − 11"], b: 2, e: "Le reste 1 est bien plus petit que 12." },
    { q: "245 = 9 × 27 + … :", r: ["0", "9", "11", "2"], b: 3, e: "9 × 27 = 243." },
    { q: "Euclide était un mathématicien :", r: ["grec", "romain", "chinois", "camerounais"], b: 0, e: "D'Alexandrie, IIIᵉ siècle av. J.-C." },
    { q: "96 est un multiple de 12 car :", r: ["96 > 12", "96 = 12 × 8 + 0", "96 est pair", "9 + 6 = 15"], b: 1, e: "Le reste est nul." }
  ],
  apc: { module: "Mathématiques de 5e", famille: "Représentation, organisation et traitement de l'information", agir: "Utiliser la division euclidienne pour organiser des quantités", situation: "Le transport de 230 élèves d'Ebolowa en cars de 48 places.", tache: "Calculer le nombre de cars à réserver." }
});

VRT_L("5e-francais-subordonnee-relative", {
  c: "5e", m: "francais", cle: "La subordonnée relative", titre: "La proposition subordonnée relative", duree: 20,
  accroche: "« Le griot qui chante » : qui le chante ? La relative le dit.",
  intro: "Pour dire de quel élève on parle sans répéter son nom, on écrit « l'élève qui a gagné le concours ». Cette petite proposition, introduite par « qui », est une subordonnée relative : elle apporte une précision sur un nom.",
  objectifs: ["reconnaître une proposition subordonnée relative", "identifier le pronom relatif et son antécédent", "employer le bon pronom relatif"],
  parties: [
    { t: "Reconnaître la relative", html:
      "<div class='def'><b>Définition</b>La <strong>subordonnée relative</strong> est introduite par un <strong>pronom relatif</strong> (qui, que, quoi, dont, où, lequel, auquel, duquel…). Elle complète un nom ou un pronom placé avant elle : l'<strong>antécédent</strong>.</div>" +
      "<div class='ex'><b>Exemple</b>J'ai lu le conte <strong>que ma grand-mère racontait le soir</strong>. Antécédent : « le conte » ; pronom relatif : « que » ; relative : « que ma grand-mère racontait le soir ».</div>",
      retenir: "Pronom relatif + verbe conjugué, juste après le nom qu'il complète." },
    { t: "Choisir le bon pronom", html:
      "<ul><li><strong>qui</strong> : sujet du verbe de la relative. « Le pêcheur <u>qui</u> revient de Kribi… »</li><li><strong>que</strong> : complément d'objet direct. « Le poisson <u>que</u> le pêcheur vend… »</li><li><strong>dont</strong> : remplace un complément introduit par « de ». « Le village <u>dont</u> je parle… » (je parle <em>du</em> village)</li><li><strong>où</strong> : lieu ou temps. « Le marché <u>où</u> je vais… », « le jour <u>où</u> il est né… »</li></ul>" +
      "<div class='astuce'><b>Astuce</b>Remplace le pronom par l'antécédent dans la relative : « je parle <em>du village</em> » → donc « dont ».</div>",
      retenir: "qui = sujet ; que = COD ; dont = « de… » ; où = lieu ou temps." },
    { t: "La fonction de la relative", html:
      "<p>La subordonnée relative est <strong>complément de l'antécédent</strong> : comme un adjectif, elle précise le nom.</p>" +
      "<div class='ex'><b>Comparer</b>« un fruit mûr » ↔ « un fruit qui est mûr ». La relative joue le même rôle que l'adjectif « mûr ».</div>" +
      "<div class='attention'><b>Attention</b>« Que » n'est pas toujours relatif : dans « Je sais que tu viendras », il n'y a pas d'antécédent : c'est une conjonction, la proposition est complétive.</div>",
      retenir: "Pas d'antécédent, pas de relative." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Dans « La ville où je suis né est Bafang », le pronom relatif est :</p><ol type='a'><li>la</li><li>où</li><li>je</li><li>est</li></ol><details><summary>Voir la réponse</summary><p><strong>où</strong> (antécédent : « la ville »).</p></details><p><strong>Exercice.</strong> Complète avec qui, que, dont ou où : a) Le livre … tu m'as prêté. b) L'ami … je t'ai parlé. c) La case … nous dormons.</p><details><summary>Voir la réponse</summary><p>a) que ; b) dont ; c) où.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Ton correspondant de Belgique veut connaître ton village. Tu lui écris une lettre.</p><p><strong>Tâche.</strong> Décris ton village en cinq phrases contenant chacune une subordonnée relative introduite par un pronom différent (qui, que, dont, où, et un autre au choix).</p><details><summary>Voir une réponse attendue</summary><p>Exemple : « Mon village, qui s'appelle Bandjoun, est sur une colline. Les danses que nous dansons au festival sont célèbres. Le chef dont je t'ai parlé habite la chefferie. Le marché où vont les femmes ouvre le samedi. La rivière près de laquelle nous jouons est fraîche. »</p></details></div>",
      retenir: "Savoir-être mobilisé : fierté de sa culture et ouverture aux autres." }
  ],
  revision: ["Relative = <strong>pronom relatif</strong> + verbe, après un <strong>antécédent</strong>.", "<strong>qui</strong> sujet, <strong>que</strong> COD.", "<strong>dont</strong> remplace « de + nom ».", "<strong>où</strong> : lieu ou temps.", "Fonction : complément de l'antécédent."],
  exo: "<p>Relie par une relative : « Le tisserand vend des pagnes. Ces pagnes sont très beaux. » <em>(Réponse : Le tisserand vend des pagnes qui sont très beaux.)</em></p>",
  quiz: [
    { q: "Le mot que complète la relative s'appelle :", r: ["l'antécédent", "le sujet", "le verbe", "l'attribut"], b: 0, e: "Il est placé avant le pronom relatif." },
    { q: "« Le pêcheur … revient » : on complète par :", r: ["que", "qui", "dont", "où"], b: 1, e: "Le pronom est sujet de « revient »." },
    { q: "« Le village … je parle » :", r: ["qui", "que", "dont", "où"], b: 2, e: "On parle DU village." },
    { q: "« La case … nous dormons » :", r: ["dont", "que", "qui", "où"], b: 3, e: "Où marque le lieu." },
    { q: "« Le livre … tu m'as prêté » :", r: ["que", "qui", "dont", "où"], b: 0, e: "Tu as prêté le livre : COD." },
    { q: "Dans « Je sais que tu viendras », « que » est :", r: ["un pronom relatif", "une conjonction", "un adverbe", "un nom"], b: 1, e: "Il n'y a pas d'antécédent." },
    { q: "La relative joue un rôle proche de :", r: ["un verbe", "un adverbe", "un adjectif", "un article"], b: 2, e: "Elle précise le nom, comme un adjectif." },
    { q: "« Le jour … il est né » :", r: ["dont", "que", "qui", "où"], b: 3, e: "Où peut aussi marquer le temps." },
    { q: "Dans « Le conte que ma grand-mère racontait », l'antécédent est :", r: ["le conte", "ma grand-mère", "racontait", "que"], b: 0, e: "C'est le nom complété." },
    { q: "Lequel n'est PAS un pronom relatif ?", r: ["dont", "parce que", "lequel", "où"], b: 1, e: "« Parce que » est une locution conjonctive." }
  ],
  apc: { module: "Français de 5e", famille: "Vie sociale et culturelle", agir: "Décrire son milieu de vie avec précision", situation: "Une lettre à un correspondant étranger pour présenter son village.", tache: "Décrire le village avec des subordonnées relatives variées." }
});

VRT_L("5e-histoire-pygmees-sao", {
  c: "5e", m: "histoire", cle: "Les Pygmées et les Sao", titre: "Les Pygmées et les Sao, premiers peuples du Cameroun", duree: 20,
  accroche: "Chasseurs de la forêt, bronziers du lac Tchad : les racines du Cameroun.",
  intro: "Bien avant les royaumes et les villes, le territoire du Cameroun était habité. Au sud, dans la forêt, vivaient les Pygmées ; au nord, autour du lac Tchad, s'est développée la brillante civilisation Sao.",
  objectifs: ["localiser les Pygmées et les Sao", "décrire leur mode de vie", "citer les traces laissées par la civilisation Sao"],
  parties: [
    { t: "Les Pygmées, peuple de la forêt", html:
      "<p>Les <strong>Pygmées</strong> sont considérés comme parmi les plus anciens habitants de la forêt d'Afrique centrale. Au Cameroun, on trouve notamment les <strong>Baka</strong> (Est et Sud), les <strong>Bagyeli</strong> ou Bakola (région de Kribi–Lolodorf) et les <strong>Bedzang</strong> (centre).</p>" +
      "<ul><li>Ils vivent de <strong>chasse</strong>, de <strong>pêche</strong> et de <strong>cueillette</strong> (miel, fruits, tubercules sauvages).</li><li>Ils sont <strong>semi-nomades</strong> : ils déplacent leurs campements en forêt.</li><li>Ils ont une connaissance remarquable des <strong>plantes médicinales</strong> et de la faune.</li></ul>",
      retenir: "Baka, Bagyeli, Bedzang : chasseurs-cueilleurs de la forêt du Sud et de l'Est." },
    { t: "Les Sao, une civilisation du lac Tchad", html:
      "<p>Les <strong>Sao</strong> ont vécu dans la plaine du <strong>Logone et du Chari</strong>, au sud du lac Tchad (actuels Extrême-Nord du Cameroun et Tchad), pendant plusieurs siècles, jusque vers le <strong>XVIᵉ siècle</strong>.</p>" +
      "<ul><li>Agriculteurs, éleveurs et pêcheurs.</li><li>Ils vivaient sur des <strong>buttes</strong> artificielles qui les protégeaient des crues.</li><li>Ils maîtrisaient la <strong>poterie</strong> (grandes jarres funéraires) et le travail du <strong>bronze</strong> par la technique de la <strong>cire perdue</strong>.</li></ul>" +
      "<div class='savais'><b>Le savais-tu ?</b>Les <strong>Kotoko</strong> d'aujourd'hui, autour de Kousséri et de Makary, se considèrent comme des descendants des Sao.</div>",
      retenir: "Buttes, jarres funéraires, bronze à la cire perdue : les traces des Sao." },
    { t: "Comment les connaissons-nous ?", html:
      "<p>Les Sao n'ont pas laissé d'écrits. Nous les connaissons par l'<strong>archéologie</strong> (fouilles des buttes, objets en terre cuite et en bronze) et par la <strong>tradition orale</strong> des peuples voisins, qui les décrit comme des « géants ».</p>" +
      "<div class='attention'><b>Attention</b>Le mot « pygmée » vient du grec et a longtemps été employé avec mépris. Aujourd'hui, on désigne plutôt chaque peuple par son nom : Baka, Bagyeli, Bedzang.</div>",
      retenir: "Sans écrits : fouilles et récits des anciens." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Les Sao vivaient :</p><ol type='a'><li>dans la forêt de l'Est</li><li>autour du lac Tchad</li><li>sur la côte de Kribi</li><li>sur le mont Cameroun</li></ol><details><summary>Voir la réponse</summary><p><strong>Autour du lac Tchad</strong>, dans la plaine du Logone et du Chari.</p></details><p><strong>Exercice.</strong> Cite deux activités des Pygmées et deux savoir-faire des Sao.</p><details><summary>Voir la réponse</summary><p>Pygmées : chasse, cueillette (ou pêche). Sao : poterie, bronze à la cire perdue.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Dans ta classe, un camarade se moque d'un élève baka en le traitant de « petit homme de la brousse ».</p><p><strong>Tâche.</strong> En t'appuyant sur ta leçon, rédige quelques lignes pour lui montrer que les peuples pygmées méritent respect et admiration.</p><details><summary>Voir une réponse attendue</summary><p>Les Baka sont parmi les plus anciens habitants du Cameroun. Leur connaissance de la forêt, des plantes médicinales et des animaux est un trésor de savoirs. Se moquer d'eux, c'est mépriser une partie de notre histoire nationale : tous les Camerounais sont égaux en dignité.</p></details></div>",
      retenir: "Savoir-être mobilisé : respect de la diversité culturelle et du vivre-ensemble." }
  ],
  revision: ["<strong>Pygmées</strong> (Baka, Bagyeli, Bedzang) : forêt du Sud et de l'Est.", "Chasse, pêche, cueillette ; semi-nomades.", "<strong>Sao</strong> : plaine du Logone et du Chari, sud du lac Tchad, jusque vers le XVIᵉ siècle.", "Buttes, jarres funéraires, bronze à la <strong>cire perdue</strong>.", "Connus par l'archéologie et la tradition orale ; les Kotoko s'en disent descendants."],
  exo: "<p>Pourquoi les Sao construisaient-ils leurs villages sur des buttes ? <em>(Réponse : pour se protéger des crues du Logone et du Chari, et pour se défendre.)</em></p>",
  quiz: [
    { q: "Les Baka vivent surtout :", r: ["dans la forêt de l'Est et du Sud", "au bord du lac Tchad", "dans le Sahel", "sur les hauts plateaux"], b: 0, e: "Ce sont des peuples de la forêt." },
    { q: "Les Pygmées vivent traditionnellement de :", r: ["l'élevage de bœufs", "chasse, pêche et cueillette", "l'industrie", "la culture du coton"], b: 1, e: "Ce sont des chasseurs-cueilleurs." },
    { q: "Les Sao vivaient dans la plaine :", r: ["du Wouri", "de la Sanaga", "du Logone et du Chari", "du Nyong"], b: 2, e: "Au sud du lac Tchad." },
    { q: "La technique de la cire perdue sert à :", r: ["construire des buttes", "pêcher", "chasser", "couler des objets en bronze"], b: 3, e: "On moule le métal dans une forme en cire qui fond." },
    { q: "Les Sao construisaient leurs villages sur :", r: ["des buttes", "des arbres", "des pirogues", "des montagnes"], b: 0, e: "Pour se protéger des crues." },
    { q: "Les descendants supposés des Sao sont :", r: ["les Baka", "les Kotoko", "les Douala", "les Bamoun"], b: 1, e: "Autour de Kousséri et Makary." },
    { q: "Nous connaissons les Sao surtout par :", r: ["leurs livres", "leurs journaux", "l'archéologie et la tradition orale", "Internet"], b: 2, e: "Ils n'ont pas laissé d'écrits." },
    { q: "Les Bagyeli vivent surtout autour de :", r: ["Maroua", "Garoua", "Bafoussam", "Kribi et Lolodorf"], b: 3, e: "Dans la forêt du Sud." },
    { q: "Les Sao étaient réputés pour leurs :", r: ["grandes jarres funéraires", "pyramides", "navires", "écritures"], b: 0, e: "Poteries de grande taille." },
    { q: "Se moquer d'un camarade baka est contraire au :", r: ["commerce", "vivre-ensemble", "sport", "calcul"], b: 1, e: "Tous les Camerounais sont égaux en dignité." }
  ],
  apc: { module: "Histoire de 5e", famille: "Vie sociale et culturelle", agir: "Connaître les origines du peuplement du Cameroun pour mieux vivre ensemble", situation: "Un élève baka moqué par un camarade.", tache: "Montrer, par la connaissance historique, le respect dû à chaque peuple." }
});

VRT_L("5e-geo-croissance-population", {
  c: "5e", m: "geo", cle: "La croissance rapide de la population mondiale", titre: "La croissance rapide de la population mondiale", duree: 20,
  accroche: "Huit milliards d'humains : comment en est-on arrivé là ?",
  intro: "En 1950, la Terre comptait environ 2,5 milliards d'habitants ; elle a franchi le cap des 8 milliards en 2022. Le Cameroun aussi grandit très vite. Comprendre cette croissance, c'est comprendre les besoins en écoles, en emplois et en nourriture.",
  objectifs: ["décrire l'évolution de la population mondiale", "calculer un taux d'accroissement naturel", "expliquer causes et conséquences de la croissance"],
  parties: [
    { t: "Une croissance récente et rapide", html:
      "<p>Pendant des millénaires, la population a augmenté lentement. Depuis le <strong>XXᵉ siècle</strong>, elle s'est envolée : environ <strong>2,5 milliards</strong> en 1950, plus de <strong>8 milliards</strong> en 2022.</p>" +
      "<div class='ex'><b>Au Cameroun</b>La population est passée d'environ 5 millions d'habitants au début des années 1960 à <strong>près de 29 millions</strong> aujourd'hui (estimations récentes) : elle a été multipliée par plus de cinq.</div>",
      retenir: "La population mondiale a plus que triplé depuis 1950." },
    { t: "Mesurer la croissance", html:
      "<div class='def'><b>Indicateurs</b><strong>Taux de natalité</strong> : nombre de naissances pour 1 000 habitants en un an. <strong>Taux de mortalité</strong> : nombre de décès pour 1 000 habitants en un an.</div>" +
      "<p class='formule'>taux d'accroissement naturel (‰) = taux de natalité − taux de mortalité</p>" +
      "<div class='ex'><b>Exemple</b>Natalité 35 ‰, mortalité 9 ‰ : accroissement naturel = 26 ‰, soit 2,6 % par an.</div>" +
      "<div class='astuce'><b>Astuce</b>‰ se lit « pour mille » : 26 ‰ = 2,6 %.</div>",
      retenir: "Accroissement naturel = natalité − mortalité." },
    { t: "Causes et conséquences", html:
      "<ul><li><strong>Causes</strong> : baisse de la mortalité (vaccins, médicaments, hygiène, eau potable) alors que la natalité reste élevée dans de nombreux pays, notamment en Afrique.</li><li><strong>Conséquences</strong> : population très jeune, besoins croissants en écoles, hôpitaux, logements, emplois et nourriture ; croissance rapide des villes comme Douala et Yaoundé.</li></ul>" +
      "<div class='savais'><b>Le savais-tu ?</b>Au Cameroun, plus de 4 habitants sur 10 ont moins de 15 ans : c'est une chance (une force de travail future) si l'école et l'emploi suivent.</div>",
      retenir: "La mortalité baisse plus vite que la natalité : la population augmente." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Le taux d'accroissement naturel est égal à :</p><ol type='a'><li>natalité + mortalité</li><li>natalité − mortalité</li><li>mortalité − natalité</li><li>natalité × mortalité</li></ol><details><summary>Voir la réponse</summary><p><strong>Natalité − mortalité</strong>.</p></details><p><strong>Exercice.</strong> Une ville a une natalité de 32 ‰ et une mortalité de 8 ‰. Calcule son accroissement naturel en ‰ et en %.</p><details><summary>Voir la réponse</summary><p>32 − 8 = 24 ‰, soit 2,4 % par an.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Le maire de ta commune constate que les classes de l'école publique comptent plus de 100 élèves.</p><p><strong>Tâche.</strong> Explique-lui le lien avec la croissance de la population et propose deux solutions.</p><details><summary>Voir une réponse attendue</summary><p>La natalité reste élevée alors que la mortalité a baissé : le nombre d'enfants à scolariser augmente plus vite que les salles construites. Solutions : construire de nouvelles salles et recruter des enseignants ; sensibiliser à la santé familiale et à l'espacement des naissances ; organiser des cours en double flux en attendant.</p></details></div>",
      retenir: "Savoir-être mobilisé : responsabilité citoyenne face aux défis démographiques." }
  ],
  revision: ["≈ 2,5 milliards en 1950 ; <strong>plus de 8 milliards en 2022</strong>.", "Cameroun : près de 29 millions d'habitants.", "<strong>Natalité</strong> et <strong>mortalité</strong> en ‰.", "<strong>Accroissement naturel = natalité − mortalité</strong>.", "Population jeune : besoins en écoles, santé, emplois."],
  exo: "<p>Un pays a 40 ‰ de natalité et 12 ‰ de mortalité. Calcule l'accroissement naturel. <em>(Réponse : 28 ‰, soit 2,8 % par an.)</em></p>",
  quiz: [
    { q: "La population mondiale a dépassé 8 milliards en :", r: ["2022", "1950", "1900", "2000"], b: 0, e: "Selon les Nations unies, en novembre 2022." },
    { q: "Le taux de natalité se calcule pour :", r: ["100 habitants", "1 000 habitants", "10 habitants", "1 million d'habitants"], b: 1, e: "Il s'exprime en ‰." },
    { q: "Accroissement naturel = :", r: ["mortalité − natalité", "natalité + mortalité", "natalité − mortalité", "naissances × décès"], b: 2, e: "Les naissances moins les décès." },
    { q: "35 ‰ de natalité et 9 ‰ de mortalité donnent :", r: ["44 ‰", "35 ‰", "9 ‰", "26 ‰"], b: 3, e: "35 − 9 = 26 ‰." },
    { q: "26 ‰ correspond à :", r: ["2,6 %", "26 %", "0,26 %", "260 %"], b: 0, e: "On divise par 10." },
    { q: "Une cause principale de la croissance est :", r: ["la hausse de la mortalité", "la baisse de la mortalité", "la disparition des naissances", "le froid"], b: 1, e: "Grâce aux vaccins, aux soins et à l'hygiène." },
    { q: "La population du Cameroun est aujourd'hui proche de :", r: ["5 millions", "100 millions", "29 millions", "8 milliards"], b: 2, e: "Estimations récentes." },
    { q: "Une population très jeune a surtout besoin de :", r: ["maisons de retraite", "routes uniquement", "aéroports", "écoles et emplois"], b: 3, e: "Les enfants d'aujourd'hui sont les travailleurs de demain." },
    { q: "En 1950, la Terre comptait environ :", r: ["2,5 milliards d'habitants", "8 milliards", "500 millions", "15 milliards"], b: 0, e: "La population a plus que triplé depuis." },
    { q: "‰ se lit :", r: ["pour cent", "pour mille", "par jour", "par an"], b: 1, e: "Pour mille." }
  ],
  apc: { module: "Géographie de 5e", famille: "Environnement, population et développement", agir: "Comprendre la croissance démographique pour agir en citoyen", situation: "Des classes de plus de 100 élèves dans l'école publique de la commune.", tache: "Expliquer le lien avec la croissance de la population et proposer des solutions." }
});

/* ══════════════════════════ 4e ══════════════════════════ */

VRT_L("4e-maths-facteurs-premiers", {
  c: "4e", m: "maths", cle: "Décomposition en produit de facteurs premiers", titre: "Décomposer un nombre en produit de facteurs premiers", duree: 20,
  accroche: "Chaque entier a sa « carte d'identité » faite de nombres premiers.",
  intro: "Comme une maison se construit avec des briques, chaque nombre entier se construit en multipliant des nombres premiers. Trouver ces briques permet de simplifier des fractions et de résoudre des problèmes de partage.",
  objectifs: ["reconnaître un nombre premier", "décomposer un entier en produit de facteurs premiers", "utiliser la décomposition pour simplifier une fraction"],
  parties: [
    { t: "Les nombres premiers", html:
      "<div class='def'><b>Définition</b>Un <strong>nombre premier</strong> est un entier naturel qui a <strong>exactement deux diviseurs</strong> : 1 et lui-même.</div>" +
      "<p>Les premiers nombres premiers : <strong>2, 3, 5, 7, 11, 13, 17, 19, 23, 29</strong>…</p>" +
      "<div class='attention'><b>Attention</b><strong>1 n'est pas premier</strong> (il n'a qu'un seul diviseur). <strong>2</strong> est le seul nombre premier pair.</div>",
      retenir: "Premier = deux diviseurs exactement : 1 et lui-même." },
    { t: "La méthode des divisions successives", html:
      "<p>On divise le nombre par le plus petit nombre premier possible, et on recommence avec le quotient, jusqu'à obtenir 1.</p>" +
      "<div class='ex'><b>Exemple : 360</b>360 ÷ 2 = 180 ; 180 ÷ 2 = 90 ; 90 ÷ 2 = 45 ; 45 ÷ 3 = 15 ; 15 ÷ 3 = 5 ; 5 ÷ 5 = 1.</div>" +
      "<p class='formule'>360 = 2³ × 3² × 5</p>" +
      "<div class='astuce'><b>Critères utiles</b>Divisible par 2 : se termine par un chiffre pair. Par 3 : somme des chiffres divisible par 3. Par 5 : se termine par 0 ou 5.</div>",
      retenir: "On divise par 2, puis 3, puis 5, 7… tant que c'est possible." },
    { t: "Simplifier une fraction", html:
      "<p>On décompose le numérateur et le dénominateur, puis on supprime les facteurs communs.</p>" +
      "<div class='ex'><b>Exemple</b>84/126 : 84 = 2² × 3 × 7 et 126 = 2 × 3² × 7. Facteurs communs : 2 × 3 × 7 = 42. Donc 84/126 = 2/3.</div>" +
      "<div class='savais'><b>Le savais-tu ?</b>La sécurité des paiements par téléphone (Mobile Money) repose sur des méthodes de cryptage qui utilisent de très grands nombres premiers, très difficiles à retrouver à partir de leur produit.</div>",
      retenir: "Fraction irréductible : plus aucun facteur premier commun." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Lequel est un nombre premier ?</p><ol type='a'><li>21</li><li>1</li><li>27</li><li>23</li></ol><details><summary>Voir la réponse</summary><p><strong>23</strong> : ses seuls diviseurs sont 1 et 23 (21 = 3 × 7 ; 27 = 3³ ; 1 n'est pas premier).</p></details><p><strong>Exercice.</strong> Décompose 252 en produit de facteurs premiers.</p><details><summary>Voir la réponse</summary><p>252 = 2² × 3² × 7.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Une association de Ngaoundéré a reçu 84 cahiers et 126 stylos. Elle veut faire des kits identiques, avec le plus grand nombre de kits possible, sans rien laisser.</p><p><strong>Tâche.</strong> Combien de kits ? Que contient chaque kit ?</p><details><summary>Voir une réponse attendue</summary><p>84 = 2² × 3 × 7 et 126 = 2 × 3² × 7 : le plus grand diviseur commun est 2 × 3 × 7 = 42. On fait <strong>42 kits</strong>, chacun avec 2 cahiers et 3 stylos.</p></details></div>",
      retenir: "Savoir-être mobilisé : solidarité et organisation du partage." }
  ],
  revision: ["Nombre premier : <strong>deux diviseurs exactement</strong>.", "2, 3, 5, 7, 11, 13, 17, 19, 23, 29… ; <strong>1 n'est pas premier</strong>.", "Divisions successives par les nombres premiers.", "<strong>360 = 2³ × 3² × 5</strong>.", "Pour simplifier, on supprime les facteurs communs."],
  exo: "<p>Décompose 150 et 225, puis simplifie 150/225. <em>(Réponse : 150 = 2 × 3 × 5², 225 = 3² × 5² ; 150/225 = 2/3.)</em></p>",
  quiz: [
    { q: "Un nombre premier a :", r: ["exactement deux diviseurs", "un seul diviseur", "trois diviseurs", "aucun diviseur"], b: 0, e: "1 et lui-même." },
    { q: "Le seul nombre premier pair est :", r: ["4", "2", "0", "6"], b: 1, e: "Tous les autres pairs sont divisibles par 2." },
    { q: "1 est-il premier ?", r: ["oui", "seulement en 4e", "non", "parfois"], b: 2, e: "Il n'a qu'un seul diviseur." },
    { q: "360 = :", r: ["2² × 3³ × 5", "2 × 3 × 5 × 12", "6 × 60", "2³ × 3² × 5"], b: 3, e: "8 × 9 × 5 = 360, et 2, 3, 5 sont premiers." },
    { q: "Un nombre est divisible par 3 si :", r: ["la somme de ses chiffres est divisible par 3", "il se termine par 3", "il est impair", "il se termine par 0"], b: 0, e: "Exemple : 252 → 2 + 5 + 2 = 9." },
    { q: "252 = :", r: ["2 × 3 × 42", "2² × 3² × 7", "2³ × 3 × 7", "4 × 63"], b: 1, e: "4 × 9 × 7 = 252, en facteurs premiers." },
    { q: "84/126 simplifiée donne :", r: ["4/6", "42/63", "2/3", "1/2"], b: 2, e: "On supprime 2 × 3 × 7 = 42." },
    { q: "Lequel est premier ?", r: ["21", "27", "1", "23"], b: 3, e: "23 n'a que deux diviseurs." },
    { q: "Avec 84 cahiers et 126 stylos, le nombre maximal de kits identiques est :", r: ["42", "21", "14", "84"], b: 0, e: "PGCD(84 ; 126) = 42." },
    { q: "Dans 2³, l'exposant 3 signifie :", r: ["2 + 2 + 2", "2 × 2 × 2", "2 × 3", "3 × 3"], b: 1, e: "2³ = 2 × 2 × 2 = 8." }
  ],
  apc: { module: "Mathématiques de 4e", famille: "Représentation, organisation et traitement de l'information", agir: "Utiliser l'arithmétique pour organiser un partage", situation: "Une association de Ngaoundéré prépare des kits scolaires identiques.", tache: "Trouver le plus grand nombre de kits et leur contenu." }
});

/* Leçons des classes d'examen — 1re et Tle (12/11/2026).
   Demande de Jacques : « Continue la préparation des autres leçons avec le même workflow »,
   puis « Classe d'examen en priorité ».
   Relevé avant : en 1re et en Tle, Français, Philosophie, Histoire et Géographie n'avaient
   aucune leçon (sauf deux de philosophie en Tle A), alors que maths, sciences et ECM en ont
   des dizaines. Premières leçons de la progression MINESEC 2026-2027 dans ces matières.
   Même format que 06-premieres-lecons.js : cours en trois temps, entraînement au format de
   l'épreuve (Partie A : ressources ; Partie B : compétences, situation camerounaise), fiche
   de révision, exercice, dix questions corrigées, rattachement APC.
   Une leçon commune à plusieurs séries (même intitulé officiel) est enregistrée pour chacune :
   VRT_L(id, Object.assign({ c: classe }, LECON)). cle = morceau du titre officiel. */

/* ══════════════════════ Philosophie — Tle C et Tle D ══════════════════════ */

var VRT_TCD_PHILO_AFRIQUE = {
  m: "philo", cle: "Histoire et tendances de la Philosophie africaine", titre: "Histoire et tendances de la philosophie africaine", duree: 25,
  accroche: "Y a-t-il une philosophie africaine ? Le débat lui-même en est une.",
  intro: "Pendant longtemps, des auteurs européens ont affirmé que l'Afrique n'avait ni histoire ni pensée rationnelle. Les philosophes africains ont répondu, mais pas tous de la même façon : certains ont cherché la philosophie dans les traditions, d'autres ont exigé une pensée critique et écrite. Ce débat est au cœur du programme de Terminale.",
  objectifs: ["situer les grandes étapes de la philosophie africaine", "distinguer les tendances (ethnophilosophie, courant critique, courant idéologique, sagesse)", "associer chaque tendance à ses auteurs et à leurs œuvres"],
  parties: [
    { t: "Aux origines : l'Égypte ancienne et la réponse aux préjugés", html:
      "<p>Les historiens africains, à la suite de <strong>Cheikh Anta Diop</strong> (<em>Nations nègres et culture</em>, 1954) et de <strong>Théophile Obenga</strong>, rattachent la pensée africaine à l'<strong>Égypte pharaonique</strong> : sagesse de Ptahhotep, notion de <strong>Maât</strong> (ordre, vérité, justice).</p>" +
      "<div class='def'><b>Le contexte</b>Au XIXᵉ et au début du XXᵉ siècle, Hegel exclut l'Afrique de l'histoire universelle et Lévy-Bruhl parle d'une « mentalité prélogique ». La philosophie africaine moderne naît en grande partie comme <strong>réponse</strong> à ces thèses ethnocentristes.</div>" +
      "<div class='savais'><b>Le savais-tu ?</b>Le mot « Maât » désignait à la fois la justice du pharaon, la vérité de la parole et l'équilibre du monde : une seule notion pour l'éthique, la politique et la cosmologie.</div>",
      retenir: "La philosophie africaine moderne se construit en réponse aux préjugés et revendique un héritage ancien (Égypte, Maât)." },
    { t: "L'ethnophilosophie et sa critique", html:
      "<div class='def'><b>Ethnophilosophie</b>Tendance qui cherche la philosophie <strong>dans les croyances, proverbes, mythes et langues</strong> d'un peuple, considérés comme une sagesse collective. Œuvre fondatrice : <strong>Placide Tempels</strong>, <em>La Philosophie bantoue</em> (1945), centrée sur la « force vitale ». Puis <strong>Alexis Kagame</strong>, <em>La Philosophie bantu-rwandaise de l'être</em> (1956).</div>" +
      "<div class='def'><b>Le courant critique</b><strong>Paulin Hountondji</strong> (<em>Sur la « philosophie africaine »</em>, 1976) reproche à l'ethnophilosophie de fabriquer une pensée <strong>collective, figée et unanime</strong>, alors que la philosophie est l'œuvre d'individus qui discutent et se contredisent. Le Camerounais <strong>Marcien Towa</strong> (<em>Essai sur la problématique philosophique dans l'Afrique actuelle</em>, 1971) y voit une pensée qui n'aide pas l'Afrique à se libérer : il faut s'approprier la <strong>raison critique</strong> et la science, « le secret de l'Europe ».</div>" +
      "<div class='attention'><b>Attention</b>La critique ne nie pas la valeur des traditions : elle refuse de les appeler « philosophie » tant qu'elles ne sont pas soumises à l'examen rationnel.</div>",
      retenir: "Ethnophilosophie (Tempels, Kagame) : sagesse collective. Critique (Hountondji, Towa) : pensée individuelle, rationnelle, discutée." },
    { t: "Les autres tendances", html:
      "<ul><li><strong>Courant idéologique et politique</strong> : penser la libération et le développement. Senghor (négritude), Kwame Nkrumah (<em>Le Consciencisme</em>, 1964), Julius Nyerere (l'<em>ujamaa</em>, socialisme africain).</li><li><strong>Philosophie de la sagacité</strong> : le Kényan <strong>Henry Odera Oruka</strong> interroge des sages des villages pour dégager des pensées <strong>individuelles</strong> et argumentées.</li><li><strong>Philosophie professionnelle</strong> : universitaires qui traitent toutes les questions (science, politique, religion). Au Cameroun : <strong>Fabien Eboussi Boulaga</strong> (<em>La Crise du Muntu</em>, 1977), <strong>Ebénézer Njoh-Mouelle</strong> (<em>De la médiocrité à l'excellence</em>, 1970).</li></ul>" +
      "<div class='astuce'><b>Astuce de mémorisation</b>Quatre tendances, quatre questions : où est la pensée ? (ethno) ; qu'est-ce que philosopher ? (critique) ; comment se libérer ? (idéologique) ; qui pense ? (sagacité).</div>",
      retenir: "Ethnophilosophie, critique, idéologique, sagacité, professionnelle : un débat vivant, pas une doctrine unique." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> L'auteur de <em>Sur la « philosophie africaine »</em> (1976) est :</p><ol type='a'><li>Placide Tempels</li><li>Alexis Kagame</li><li>Paulin Hountondji</li><li>Kwame Nkrumah</li></ol><details><summary>Voir la réponse</summary><p><strong>Paulin Hountondji</strong>, philosophe béninois, chef de file de la critique de l'ethnophilosophie.</p></details><p><strong>Exercice.</strong> Explique en trois lignes pourquoi Marcien Towa refuse d'identifier philosophie et traditions.</p><details><summary>Voir la réponse</summary><p>Pour Towa, philosopher, c'est examiner de façon critique, y compris sa propre tradition ; glorifier un passé figé empêche l'Afrique de s'approprier la raison et la science qui lui permettraient de se libérer.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Lors d'une veillée à Bafoussam, ton oncle affirme : « Nos proverbes, c'est notre philosophie ; pas besoin de lire les livres des Blancs. » Ta cousine, en Terminale D, répond que « la philosophie est universelle ».</p><p><strong>Tâche.</strong> Rédige un paragraphe argumenté (15 lignes) qui expose les deux positions, en citant au moins deux auteurs, puis dépasse l'opposition.</p><details><summary>Voir une réponse attendue</summary><p>L'oncle rejoint l'ethnophilosophie (Tempels, Kagame) : les proverbes contiennent une sagesse et une vision du monde. La cousine rejoint le courant critique (Hountondji, Towa) : la philosophie est une démarche rationnelle, individuelle, ouverte à la discussion, qui n'appartient à aucun peuple. Dépassement : les proverbes sont une matière à penser précieuse, mais ils deviennent philosophie quand on les interroge (« ce proverbe est-il juste ? à quelles conditions ? »), comme le fait Odera Oruka avec les sages.</p></details></div>",
      retenir: "Savoir-être mobilisé : dialogue respectueux entre tradition et esprit critique." }
  ],
  revision: ["Réponse aux thèses ethnocentristes (Hegel, Lévy-Bruhl) ; héritage égyptien (Maât, C. A. Diop).", "<strong>Ethnophilosophie</strong> : Tempels (1945), Kagame (1956).", "<strong>Critique</strong> : Hountondji (1976), Towa (1971).", "<strong>Idéologique</strong> : Senghor, Nkrumah, Nyerere ; <strong>sagacité</strong> : Odera Oruka.", "Camerounais : Towa, Eboussi Boulaga, Njoh-Mouelle."],
  exo: "<p>Classe chaque auteur dans sa tendance : Kagame ; Nkrumah ; Hountondji ; Odera Oruka ; Tempels. <em>(Réponse : ethnophilosophie ; idéologique ; critique ; sagacité ; ethnophilosophie.)</em></p>",
  quiz: [
    { q: "<em>La Philosophie bantoue</em> (1945) est de :", r: ["Placide Tempels", "Marcien Towa", "Cheikh Anta Diop", "Hegel"], b: 0, e: "Missionnaire belge, il fonde l'ethnophilosophie autour de la « force vitale »." },
    { q: "L'ethnophilosophie cherche la philosophie :", r: ["dans les sciences exactes", "dans les croyances et proverbes d'un peuple", "uniquement chez les Grecs", "dans les textes de loi"], b: 1, e: "Elle la voit comme une sagesse collective et implicite." },
    { q: "Hountondji reproche à l'ethnophilosophie de supposer une pensée :", r: ["trop scientifique", "trop individuelle", "collective et unanime", "trop récente"], b: 2, e: "La philosophie suppose des individus qui débattent." },
    { q: "Marcien Towa est :", r: ["béninois", "kényan", "ghanéen", "camerounais"], b: 3, e: "Auteur de l'Essai sur la problématique philosophique dans l'Afrique actuelle (1971)." },
    { q: "Le « consciencisme » est associé à :", r: ["Kwame Nkrumah", "Julius Nyerere", "Alexis Kagame", "Paulin Hountondji"], b: 0, e: "Le premier président du Ghana, 1964." },
    { q: "La philosophie de la sagacité est développée par :", r: ["Senghor", "Odera Oruka", "Tempels", "Lévy-Bruhl"], b: 1, e: "Il interroge des sages pour dégager des pensées personnelles et argumentées." },
    { q: "<em>La Crise du Muntu</em> (1977) est de :", r: ["Njoh-Mouelle", "Hountondji", "Eboussi Boulaga", "Obenga"], b: 2, e: "Fabien Eboussi Boulaga, philosophe camerounais." },
    { q: "Lévy-Bruhl a parlé d'une mentalité :", r: ["rationnelle", "scientifique", "critique", "prélogique"], b: 3, e: "Thèse ethnocentriste à laquelle répond la philosophie africaine moderne." },
    { q: "La notion égyptienne de Maât désigne :", r: ["l'ordre, la vérité et la justice", "un dieu de la guerre", "un fleuve", "une pyramide"], b: 0, e: "Une notion à la fois éthique, politique et cosmique." },
    { q: "L'<em>ujamaa</em> est le projet politique de :", r: ["Senghor", "Julius Nyerere", "Towa", "Kagame"], b: 1, e: "Socialisme africain fondé sur la solidarité villageoise, en Tanzanie." }
  ],
  apc: { module: "Philosophie de Terminale C et D", famille: "Vie sociale et culturelle", agir: "Situer les débats de la philosophie africaine pour dialoguer entre tradition et raison critique", situation: "Lors d'une veillée familiale, un oncle et une élève s'opposent sur l'existence d'une philosophie africaine.", tache: "Exposer les deux positions avec des auteurs, puis dépasser l'opposition." }
};
VRT_L("tle-c-philo-africaine", Object.assign({ c: "Tle C" }, VRT_TCD_PHILO_AFRIQUE));
VRT_L("tle-d-philo-africaine", Object.assign({ c: "Tle D" }, VRT_TCD_PHILO_AFRIQUE));

var VRT_TCD_PHILO_DISSERT = {
  m: "philo", cle: "Rappel des principes et des exigences méthodologiques de la dissertation", titre: "La dissertation philosophique : principes et méthode", duree: 30,
  accroche: "Une dissertation n'est pas un exposé : c'est un problème que l'on résout.",
  intro: "Au baccalauréat, la dissertation philosophique compte autant que ta réflexion personnelle que tes connaissances. Le correcteur attend un problème clairement posé, un raisonnement qui avance et une réponse argumentée. Cette leçon reprend les exigences et donne une méthode pas à pas.",
  objectifs: ["analyser un sujet et dégager une problématique", "construire un plan dialectique (thèse, antithèse, synthèse)", "rédiger une introduction et une conclusion conformes"],
  parties: [
    { t: "Comprendre le sujet et poser le problème", html:
      "<ol><li><strong>Lire le sujet mot à mot</strong> : définir chaque notion (« liberté », « bonheur », « travail »), repérer les mots de liaison (« seulement », « toujours », « peut-on », « doit-on »).</li><li><strong>Reformuler</strong> le sujet avec tes propres mots.</li><li><strong>Repérer la tension</strong> : la réponse spontanée et ce qui la contredit.</li><li><strong>Formuler la problématique</strong> sous forme d'une ou deux questions qui montrent pourquoi la réponse n'est pas évidente.</li></ol>" +
      "<div class='ex'><b>Exemple</b>Sujet : « Le travail est-il seulement une contrainte ? » Réponse spontanée : oui, on travaille pour vivre. Mais le travail permet aussi de se réaliser (Hegel, Marx). Problématique : le travail n'est-il qu'une nécessité subie, ou peut-il être le lieu où l'homme se forme et se libère ?</div>" +
      "<div class='attention'><b>Attention</b>Le hors-sujet est la faute la plus lourde : un exposé sur « le travail en général » ne répond pas au mot « seulement ».</div>",
      retenir: "Définir, reformuler, repérer la tension, poser la problématique." },
    { t: "Construire le plan dialectique", html:
      "<div class='def'><b>Le plan dialectique</b><strong>Thèse</strong> : on défend une première réponse, avec arguments, auteurs et exemples. <strong>Antithèse</strong> : on montre les limites de la thèse et on défend la position opposée. <strong>Synthèse (ou dépassement)</strong> : on propose une réponse nuancée qui tient compte des deux, souvent en distinguant des cas ou en changeant de point de vue.</div>" +
      "<p>Chaque partie comprend deux ou trois <strong>paragraphes</strong> : une idée directrice, un argument, une référence philosophique, un exemple concret, une petite conclusion.</p>" +
      "<div class='astuce'><b>Astuce</b>Une <strong>transition</strong> entre les parties (« Pourtant… », « Mais cette réponse ne suffit pas, car… ») montre au correcteur que ton raisonnement progresse.</div>",
      retenir: "Thèse, antithèse, synthèse : trois étapes d'un raisonnement qui avance, reliées par des transitions." },
    { t: "Introduction et conclusion", html:
      "<div class='def'><b>L'introduction (trois moments)</b>1) <strong>L'amorce</strong> : une situation, une citation ou un fait qui conduit au sujet. 2) <strong>La position du problème</strong> : définitions rapides et problématique. 3) <strong>L'annonce du plan</strong>, sous forme de questions ou d'étapes.</div>" +
      "<div class='def'><b>La conclusion</b>1) <strong>Le bilan</strong> : rappel du chemin parcouru et réponse claire à la question posée. 2) <strong>Une solution personnelle et contextualisée</strong> : ta propre position, appliquée à une situation réelle (camerounaise, africaine, actuelle). 3) <strong>L'ouverture</strong> : une question voisine, facultative.</div><div class='astuce'><b>Le barème du bac</b>Dans le format APC du baccalauréat (annales de la série A4, 2022-2025), la dissertation est la <strong>Partie B</strong>, notée sur 9 en trois tâches : <strong>introduction</strong> (3 pts), <strong>analyse dialectique</strong> (3 pts), <strong>conclusion avec une solution personnelle et contextualisée</strong> (3 pts). La présentation compte 2 points.</div>" +
      "<div class='savais'><b>Le savais-tu ?</b>Beaucoup de correcteurs lisent l'introduction et la conclusion en premier : elles disent si l'élève a compris le sujet. Rédige-les au brouillon avant le développement.</div>",
      retenir: "Introduction : amorce, problème, plan. Conclusion : bilan qui répond, solution personnelle et contextualisée, ouverture." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Dans une introduction de dissertation, la problématique sert à :</p><ol type='a'><li>résumer la vie d'un auteur</li><li>montrer pourquoi la question pose problème</li><li>donner la réponse finale</li><li>citer le plus d'auteurs possible</li></ol><details><summary>Voir la réponse</summary><p>Elle <strong>montre pourquoi la question pose problème</strong> : deux réponses possibles s'opposent.</p></details><p><strong>Exercice.</strong> Formule une problématique pour : « Faut-il toujours dire la vérité ? »</p><details><summary>Voir la réponse</summary><p>Le devoir de vérité est-il absolu, comme le pense Kant, ou peut-on mentir pour protéger autrui, au risque de détruire la confiance qui fonde la vie commune ?</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Au bac blanc de ton lycée à Ebolowa, le sujet est : « Le bonheur dépend-il de l'argent ? » Ton camarade a écrit trois pages sur la pauvreté au Cameroun, sans définir le bonheur ni poser de question. Il a obtenu 6/20.</p><p><strong>Tâche 1.</strong> Explique-lui ses deux erreurs principales. <strong>Tâche 2.</strong> Propose une introduction complète et un plan dialectique détaillé.</p><details><summary>Voir une réponse attendue</summary><p>Erreurs : pas de définition des notions ni de problématique (exposé hors-sujet) ; pas de raisonnement dialectique. Introduction : amorce (« Au marché, on entend : l'argent ne fait pas le bonheur, mais il y contribue ») ; définitions (bonheur : satisfaction durable ; argent : moyen d'échange) ; problématique : l'argent, simple moyen, peut-il procurer un état aussi intérieur que le bonheur ? Plan : I. L'argent conditionne le bonheur (besoins, santé, sécurité ; Aristote : le bonheur suppose des biens extérieurs). II. Mais il ne suffit pas (Épicure : le sage limite ses désirs ; la course à l'argent rend malheureux). III. L'argent est une condition du bien-être, le bonheur relève de la sagesse et des liens humains.</p></details></div>",
      retenir: "Savoir-être mobilisé : rigueur et honnêteté intellectuelle." }
  ],
  revision: ["Analyser : définir, reformuler, repérer la tension.", "<strong>Problématique</strong> : la question qui montre le problème.", "Plan <strong>dialectique</strong> : thèse, antithèse, synthèse.", "Paragraphe : idée, argument, référence, exemple.", "Introduction : amorce, problème, plan ; conclusion : bilan, <strong>solution personnelle et contextualisée</strong>, ouverture.", "Bac : intro 3 pts, analyse dialectique 3 pts, conclusion 3 pts."],
  exo: "<p>Rédige l'amorce et la problématique du sujet : « La liberté consiste-t-elle à faire ce que l'on veut ? » <em>(Piste : partir d'un jeune qui quitte la maison familiale « pour être libre » ; problématique : faire tout ce qu'on désire, est-ce être libre, ou est-ce obéir à ses désirs ? Rousseau : « l'obéissance à la loi qu'on s'est prescrite est liberté ».)</em></p>",
  quiz: [
    { q: "La première étape face à un sujet est :", r: ["citer des auteurs", "rédiger la conclusion", "définir les termes du sujet", "écrire le plan"], b: 2, e: "Sans définitions, on ne voit pas le problème." },
    { q: "La problématique se présente :", r: ["sous forme de question(s)", "comme une citation", "comme un résumé", "comme une liste d'auteurs"], b: 0, e: "Elle pose le problème que le développement va résoudre." },
    { q: "Dans un plan dialectique, l'antithèse :", r: ["répète la thèse", "montre les limites de la thèse", "est la conclusion", "est facultative"], b: 1, e: "Elle défend un point de vue opposé." },
    { q: "La synthèse :", r: ["choisit au hasard", "ajoute des exemples", "résume l'introduction", "dépasse l'opposition par une réponse nuancée"], b: 3, e: "Elle tient compte des deux parties précédentes." },
    { q: "L'amorce sert à :", r: ["annoncer le plan", "conduire vers le sujet", "conclure", "donner la note"], b: 1, e: "C'est l'entrée en matière de l'introduction." },
    { q: "Un paragraphe de développement contient :", r: ["idée, argument, référence, exemple", "seulement des citations", "le plan", "la problématique"], b: 0, e: "C'est l'unité de base du raisonnement." },
    { q: "La faute la plus lourde en dissertation est :", r: ["une transition courte", "une ouverture absente", "un exemple camerounais", "le hors-sujet"], b: 3, e: "Ne pas répondre à la question posée." },
    { q: "La conclusion doit d'abord :", r: ["poser une nouvelle question", "répondre clairement à la problématique", "citer Kant", "recopier l'introduction"], b: 1, e: "Le bilan donne la réponse ; l'ouverture vient ensuite." },
    { q: "Les transitions servent à :", r: ["allonger la copie", "remplacer les arguments", "montrer la progression du raisonnement", "annoncer la note"], b: 2, e: "Elles relient les parties de façon logique." },
    { q: "Dans « Le travail est-il SEULEMENT une contrainte ? », le mot clé à interroger est :", r: ["seulement", "le", "est", "une"], b: 0, e: "Il oriente le problème : la contrainte est-elle tout le travail ?" }
  ],
  apc: { module: "Philosophie de Terminale C et D", famille: "Vie sociale et culturelle", agir: "Construire une réflexion argumentée sur une question philosophique", situation: "Un élève a obtenu 6/20 au bac blanc pour un exposé sans problématique sur le bonheur et l'argent.", tache: "Identifier ses erreurs et proposer une introduction et un plan dialectique." }
};
VRT_L("tle-c-philo-dissertation", Object.assign({ c: "Tle C" }, VRT_TCD_PHILO_DISSERT));
VRT_L("tle-d-philo-dissertation", Object.assign({ c: "Tle D" }, VRT_TCD_PHILO_DISSERT));

/* ══════════════════════ Français — Tle C et Tle D ══════════════════════ */

var VRT_TCD_FR_DISSERT = {
  m: "francais", cle: "Dissertation : Analyse du sujet et formulation de la problématique", titre: "Dissertation littéraire : analyser le sujet et formuler la problématique", duree: 25,
  accroche: "Le sujet contient déjà la moitié de la copie : encore faut-il savoir le lire.",
  intro: "La dissertation littéraire demande de discuter une opinion sur la littérature (le roman, la poésie, le théâtre, le rôle de l'écrivain) à partir de tes lectures. Les copies échouent rarement par manque d'idées : elles échouent parce que le sujet a été mal lu. Cette leçon apprend à le décortiquer.",
  objectifs: ["identifier les éléments d'un sujet de dissertation", "analyser les mots clés et la thèse proposée", "formuler une problématique pertinente"],
  parties: [
    { t: "Les éléments d'un sujet", html:
      "<p>Un sujet de dissertation comprend en général :</p><ul><li>une <strong>citation</strong> ou une affirmation (souvent d'un écrivain ou d'un critique) ;</li><li>une <strong>consigne</strong> : « Commentez », « Discutez », « Partagez-vous ce point de vue ? », « Vous illustrerez votre réponse d'exemples précis ».</li></ul>" +
      "<div class='def'><b>Les types de consigne</b><strong>Explicative</strong> (« expliquez », « justifiez ») : on montre que la thèse est juste. <strong>Dialectique</strong> (« discutez », « partagez-vous… ») : on examine la thèse puis ses limites. <strong>Comparative</strong> : on confronte deux thèses.</div>" +
      "<div class='attention'><b>Attention</b>La consigne commande le plan : « discutez » appelle un plan dialectique, « expliquez » un plan analytique.</div>",
      retenir: "Citation + consigne ; c'est la consigne qui décide du type de plan." },
    { t: "Analyser les mots clés", html:
      "<ol><li><strong>Souligner</strong> les mots clés (notions, adjectifs forts, adverbes : « seulement », « avant tout », « toujours »).</li><li><strong>Définir</strong> chacun dans le contexte de la littérature.</li><li><strong>Reformuler</strong> la thèse en une phrase simple.</li><li><strong>Délimiter le corpus</strong> : quel genre, quelle époque, quelles œuvres ?</li></ol>" +
      "<div class='ex'><b>Exemple</b>« Le roman doit avant tout divertir le lecteur. » Mots clés : <em>roman</em> (genre narratif), <em>avant tout</em> (priorité), <em>divertir</em> (distraire, plaire). Reformulation : la fonction principale du roman serait le plaisir. Corpus : romans étudiés (<em>Le Vieux Nègre et la médaille</em> de Ferdinand Oyono, <em>Une si longue lettre</em> de Mariama Bâ…).</div>",
      retenir: "Souligner, définir, reformuler, délimiter : quatre gestes avant toute idée." },
    { t: "Formuler la problématique", html:
      "<p>La problématique transforme la thèse en <strong>question qui pose problème</strong> : elle met en tension l'affirmation et ce qui la limite.</p>" +
      "<div class='ex'><b>Exemple</b>Thèse : le roman doit avant tout divertir. Tension : beaucoup de romans africains dénoncent (colonisation, condition de la femme). Problématique : <em>le roman n'a-t-il pour fonction première que de plaire, ou le plaisir de lecture est-il au service d'une dénonciation et d'une réflexion ?</em></div>" +
      "<div class='astuce'><b>Astuce</b>Une bonne problématique reprend les mots du sujet et contient souvent « ou » : elle annonce les deux grandes parties.</div>" +
      "<div class='savais'><b>Le savais-tu ?</b><em>Le Vieux Nègre et la médaille</em> (1956) fait rire le lecteur… pour mieux dénoncer l'humiliation coloniale : le comique au service de la critique.</div>",
      retenir: "Problématique = question qui oppose la thèse à ses limites, avec les mots du sujet." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> La consigne « Partagez-vous ce point de vue ? » appelle un plan :</p><ol type='a'><li>chronologique</li><li>dialectique</li><li>thématique sans discussion</li><li>descriptif</li></ol><details><summary>Voir la réponse</summary><p><strong>Dialectique</strong> : on examine la thèse, puis ses limites, avant de nuancer.</p></details><p><strong>Exercice.</strong> Relève et définis les mots clés : « La poésie est d'abord un jeu sur le langage. »</p><details><summary>Voir la réponse</summary><p><em>Poésie</em> : genre littéraire en vers ou en prose rythmée ; <em>d'abord</em> : en priorité ; <em>jeu sur le langage</em> : travail des sonorités, des images, du rythme.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Le club de lecture de ton lycée à Limbé prépare un débat. Sujet affiché : « L'écrivain africain doit être un combattant. » Discutez cette affirmation en vous appuyant sur des exemples précis.</p><p><strong>Tâche.</strong> Analyse le sujet (mots clés, reformulation, corpus) et formule une problématique.</p><details><summary>Voir une réponse attendue</summary><p>Mots clés : <em>écrivain africain</em> ; <em>doit</em> (obligation) ; <em>combattant</em> (qui lutte contre l'injustice, engagé). Reformulation : l'engagement serait un devoir pour l'écrivain africain. Corpus : Mongo Beti, Ferdinand Oyono, Mariama Bâ, poètes de la négritude. Problématique : l'écrivain africain a-t-il pour devoir de lutter par ses textes, ou peut-il revendiquer la liberté de créer sans mission imposée ?</p></details></div>",
      retenir: "Savoir-être mobilisé : rigueur dans la lecture et esprit critique." }
  ],
  revision: ["Sujet = citation + <strong>consigne</strong>.", "« Discutez » : plan <strong>dialectique</strong> ; « expliquez » : plan analytique.", "Souligner, définir, reformuler, délimiter le corpus.", "<strong>Problématique</strong> : question qui oppose la thèse à ses limites.", "Reprendre les mots du sujet dans la problématique."],
  exo: "<p>Formule une problématique pour : « Le théâtre est un miroir de la société. » <em>(Exemple : le théâtre se contente-t-il de refléter la société, ou la transforme-t-il en la grossissant pour faire réfléchir le spectateur ?)</em></p>",
  quiz: [
    { q: "Un sujet de dissertation comprend en général :", r: ["une citation et une consigne", "un texte et des questions", "un tableau", "un résumé"], b: 0, e: "La consigne dit ce qu'on attend de la citation." },
    { q: "« Discutez » appelle :", r: ["un plan explicatif", "un plan dialectique", "un résumé", "une biographie"], b: 1, e: "On examine la thèse et ses limites." },
    { q: "Le mot « avant tout » dans un sujet indique :", r: ["une date", "un exemple", "une priorité", "une conclusion"], b: 2, e: "Il hiérarchise : c'est souvent lui qui pose le problème." },
    { q: "Reformuler le sujet sert à :", r: ["allonger l'introduction", "changer de sujet", "citer un auteur", "s'assurer de l'avoir compris"], b: 3, e: "On dit la thèse en mots simples." },
    { q: "La problématique contient souvent :", r: ["l'opposition « ou »", "une date", "une liste d'œuvres", "un proverbe"], b: 0, e: "Elle annonce les deux pistes de la discussion." },
    { q: "<em>Le Vieux Nègre et la médaille</em> est de :", r: ["Mongo Beti", "Ferdinand Oyono", "Mariama Bâ", "Senghor"], b: 1, e: "Ferdinand Léopold Oyono, 1956." },
    { q: "Délimiter le corpus, c'est :", r: ["compter les mots", "choisir la consigne", "préciser les œuvres et genres concernés", "écrire la conclusion"], b: 2, e: "On sait ainsi où chercher les exemples." },
    { q: "Une consigne explicative demande de :", r: ["réfuter la thèse", "comparer deux thèses", "raconter une histoire", "justifier la thèse"], b: 3, e: "On montre en quoi l'affirmation est fondée." },
    { q: "Le principal danger d'une mauvaise analyse est :", r: ["le hors-sujet", "une copie trop courte", "un exemple africain", "une écriture lisible"], b: 0, e: "On répond alors à une autre question." },
    { q: "« Combattant » appliqué à l'écrivain renvoie à :", r: ["la guerre militaire", "l'engagement", "le divertissement", "la poésie pure"], b: 1, e: "C'est l'écrivain engagé contre l'injustice." }
  ],
  apc: { module: "Français de Terminale C et D", famille: "Vie sociale et culturelle", agir: "Analyser un sujet de dissertation pour construire une réflexion pertinente", situation: "Le club de lecture d'un lycée de Limbé prépare un débat sur l'engagement de l'écrivain africain.", tache: "Analyser le sujet et formuler une problématique." }
};
VRT_L("tle-c-francais-dissertation", Object.assign({ c: "Tle C" }, VRT_TCD_FR_DISSERT));
VRT_L("tle-d-francais-dissertation", Object.assign({ c: "Tle D" }, VRT_TCD_FR_DISSERT));

/* ══════════════════════ Géographie — Tle A, C et D ══════════════════════ */

var VRT_TLE_GEO_CAMEROUN = {
  m: "geo", cle: "La diversité physique du Cameroun", titre: "La diversité physique du Cameroun", duree: 25,
  accroche: "De la forêt de Lomié aux rives du lac Tchad : l'Afrique en miniature.",
  intro: "Le Cameroun s'étire sur plus de 1 200 km, du golfe de Guinée au lac Tchad. Sur ce territoire de 475 650 km² se succèdent plaines, plateaux et montagnes, climats équatorial et sahélien, forêts et steppes. Cette diversité est une richesse, mais aussi une contrainte pour le développement.",
  objectifs: ["décrire les grands ensembles du relief camerounais", "présenter les climats, la végétation et l'hydrographie", "montrer en quoi cette diversité est un atout et une contrainte"],
  parties: [
    { t: "Un relief contrasté", html:
      "<p>Situé entre 2° et 13° de latitude Nord, le Cameroun présente cinq grands ensembles :</p><ul><li>la <strong>plaine côtière</strong> (Douala, Kribi), basse et humide ;</li><li>le <strong>plateau sud-camerounais</strong> (environ 650 m), couvert de forêt ;</li><li>les <strong>hautes terres de l'Ouest</strong>, volcaniques : <strong>mont Cameroun</strong> (4 095 m, point culminant), monts Bamboutos, Manengouba, mont Oku ;</li><li>le <strong>plateau de l'Adamaoua</strong> (environ 1 100 m), « château d'eau » du pays ;</li><li>les <strong>basses terres du Nord</strong> (cuvette de la Bénoué, plaine du lac Tchad), dominées par les <strong>monts Mandara</strong>.</li></ul>" +
      "<div class='savais'><b>Le savais-tu ?</b>Le mont Cameroun est un volcan actif : sa dernière éruption date de 2012. Les Portugais l'appelaient le « Char des dieux ».</div>",
      retenir: "Plaine côtière, plateau sud, hautes terres de l'Ouest, Adamaoua, basses terres du Nord." },
    { t: "Climats, végétation et cours d'eau", html:
      "<div class='def'><b>Les climats</b><strong>Équatorial</strong> au Sud (deux saisons sèches et deux saisons des pluies ; forme côtière très pluvieuse, plus de 10 m de pluie par an à Debundscha) ; <strong>tropical soudanien</strong> sur l'Adamaoua et la Bénoué (une saison sèche, une saison des pluies) ; <strong>soudano-sahélien</strong> vers le lac Tchad (longue saison sèche).</div>" +
      "<p>La végétation suit les pluies : <strong>forêt dense</strong> au Sud et à l'Est, <strong>savanes</strong> au centre, <strong>steppes</strong> à l'Extrême-Nord, <strong>mangrove</strong> sur la côte.</p>" +
      "<div class='def'><b>Les bassins hydrographiques</b>Quatre bassins : <strong>Atlantique</strong> (Sanaga, plus long fleuve du pays, Nyong, Wouri), <strong>Congo</strong> (Sangha, Dja), <strong>Niger</strong> (Bénoué), <strong>Tchad</strong> (Logone, Chari).</div>",
      retenir: "Du Sud au Nord : pluies en baisse, forêt → savane → steppe ; quatre bassins fluviaux." },
    { t: "Une diversité : atout et contrainte", html:
      "<div class='ex'><b>Atouts</b>Agriculture variée (cacao et café au Sud, coton au Nord, maraîchage à l'Ouest), potentiel hydroélectrique (barrages d'Edéa, de Song Loulou et de Nachtigal sur la Sanaga, retenue de Lom Pangar dans son bassin), tourisme (plages de Kribi, parcs de Waza et de la Bénoué, mont Cameroun).</div>" +
      "<div class='attention'><b>Contraintes</b>Relief accidenté qui renchérit routes et voies ferrées, risques naturels (éruptions, glissements de terrain, inondations), sécheresse et avancée du désert au Nord, enclavement de certaines régions.</div>",
      retenir: "La diversité physique offre des ressources variées mais impose des aménagements coûteux et des risques." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Le point culminant du Cameroun est :</p><ol type='a'><li>le mont Oku</li><li>le mont Cameroun</li><li>le mont Manengouba</li><li>les monts Mandara</li></ol><details><summary>Voir la réponse</summary><p><strong>Le mont Cameroun</strong>, 4 095 m, volcan actif du Sud-Ouest.</p></details><p><strong>Exercice.</strong> Associe : Sanaga, Bénoué, Logone, Sangha → bassin.</p><details><summary>Voir la réponse</summary><p>Sanaga : Atlantique ; Bénoué : Niger ; Logone : Tchad ; Sangha : Congo.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Une entreprise de transport veut ouvrir une ligne de cars Douala – Bafoussam – Ngaoundéré – Maroua. Son directeur te demande une note sur les milieux traversés.</p><p><strong>Tâche.</strong> En une quinzaine de lignes, présente les reliefs et climats traversés, puis deux contraintes et une précaution pour chaque.</p><details><summary>Voir une réponse attendue</summary><p>Douala : plaine côtière, climat équatorial très pluvieux. Bafoussam : hautes terres de l'Ouest, pentes fortes. Ngaoundéré : plateau de l'Adamaoua, falaise abrupte au Nord. Maroua : basses terres sahéliennes, chaleur et longue saison sèche. Contraintes : fortes pluies et glissements de terrain (précaution : éviter les trajets de nuit en saison des pluies, entretenir les véhicules) ; pentes et falaises (précaution : freins et chauffeurs formés à la montagne) ; chaleur et poussière au Nord (précaution : climatisation, eau à bord, filtres).</p></details></div>",
      retenir: "Savoir-être mobilisé : sens des responsabilités et anticipation des risques." }
  ],
  revision: ["475 650 km², de 2° à 13° N : « Afrique en miniature ».", "Relief : plaine côtière, plateau sud, hautes terres de l'Ouest (mont Cameroun 4 095 m), Adamaoua, basses terres du Nord.", "Climats : équatorial, tropical soudanien, soudano-sahélien.", "Végétation : forêt, savane, steppe, mangrove.", "Bassins : Atlantique (Sanaga), Congo, Niger (Bénoué), Tchad (Logone)."],
  exo: "<p>Sur un croquis du Cameroun, place : le mont Cameroun, l'Adamaoua, les monts Mandara, la Sanaga, la Bénoué et le lac Tchad. Ajoute une légende en trois couleurs pour la forêt, la savane et la steppe. <em>(Vérifie avec la carte de l'atlas.)</em></p>",
  quiz: [
    { q: "La superficie du Cameroun est d'environ :", r: ["475 650 km²", "47 565 km²", "1 200 000 km²", "275 000 km²"], b: 0, e: "Un peu moins que l'Espagne métropolitaine plus le Portugal." },
    { q: "Le plateau de l'Adamaoua est surnommé :", r: ["le grenier du pays", "le château d'eau du Cameroun", "l'Afrique en miniature", "la porte du désert"], b: 1, e: "De nombreux fleuves y prennent leur source." },
    { q: "Le plus long fleuve du Cameroun est :", r: ["le Wouri", "le Nyong", "la Sanaga", "le Logone"], b: 2, e: "Il alimente plusieurs barrages hydroélectriques." },
    { q: "La Bénoué appartient au bassin :", r: ["du Congo", "du Tchad", "atlantique direct", "du Niger"], b: 3, e: "Elle rejoint le Niger au Nigeria." },
    { q: "Le climat de l'Extrême-Nord est :", r: ["soudano-sahélien", "équatorial", "tempéré", "montagnard humide"], b: 0, e: "Longue saison sèche et faibles pluies." },
    { q: "La mangrove se trouve :", r: ["sur l'Adamaoua", "sur la côte", "au lac Tchad", "sur les monts Mandara"], b: 1, e: "Forêt des estuaires, autour de Douala et du Rio del Rey." },
    { q: "Le climat équatorial compte :", r: ["une saison", "trois saisons", "deux saisons sèches et deux pluvieuses", "une seule saison sèche"], b: 2, e: "C'est le rythme du Sud du pays." },
    { q: "Lequel est un barrage sur la Sanaga ?", r: ["Lagdo", "Mékin", "Memve'ele", "Song Loulou"], b: 3, e: "Lagdo est sur la Bénoué, Mékin sur le Dja, Memve'ele sur le Ntem ; Song Loulou et Edéa sont sur la Sanaga." },
    { q: "Une contrainte du relief de l'Ouest est :", r: ["les glissements de terrain", "la sécheresse permanente", "l'absence de sols", "le froid polaire"], b: 0, e: "Fortes pentes et pluies abondantes favorisent les glissements." },
    { q: "Le Cameroun est surnommé « Afrique en miniature » à cause de :", r: ["sa petite taille", "sa diversité physique et humaine", "sa population", "sa capitale"], b: 1, e: "On y retrouve presque tous les milieux africains." }
  ],
  apc: { module: "Géographie de Terminale", famille: "Environnement, santé et bien-être", agir: "Exploiter la connaissance des milieux physiques pour aménager et voyager en sécurité", situation: "Une entreprise ouvre une ligne de cars Douala – Bafoussam – Ngaoundéré – Maroua.", tache: "Présenter les milieux traversés, leurs contraintes et les précautions à prendre." }
};
VRT_L("tle-a-geo-diversite-physique", Object.assign({ c: "Tle A" }, VRT_TLE_GEO_CAMEROUN));
VRT_L("tle-c-geo-diversite-physique", Object.assign({ c: "Tle C" }, VRT_TLE_GEO_CAMEROUN));
VRT_L("tle-d-geo-diversite-physique", Object.assign({ c: "Tle D" }, VRT_TLE_GEO_CAMEROUN));

/* ══════════════════════ Histoire — Tle A ══════════════════════ */

VRT_L("tle-a-histoire-seconde-guerre", {
  c: "Tle A", m: "histoire", cle: "La Deuxième Guerre mondiale", titre: "La Deuxième Guerre mondiale (1939-1945)", duree: 25,
  accroche: "Six ans de guerre, plus de 50 millions de morts, et un Cameroun au cœur de la France libre.",
  intro: "Vingt ans après la Grande Guerre, le monde bascule dans un conflit encore plus meurtrier. La Deuxième Guerre mondiale oppose les puissances de l'Axe aux Alliés sur tous les continents. Le Cameroun y joue un rôle inattendu dès 1940.",
  objectifs: ["expliquer les causes de la guerre", "retracer les grandes phases du conflit", "présenter la participation du Cameroun"],
  parties: [
    { t: "Les causes", html:
      "<ul><li><strong>Le traité de Versailles</strong> (1919), vécu en Allemagne comme un « diktat » humiliant.</li><li><strong>La crise de 1929</strong> : chômage et misère favorisent les régimes autoritaires.</li><li><strong>Les régimes totalitaires</strong> expansionnistes : Italie fasciste de Mussolini, Allemagne nazie de Hitler (au pouvoir en 1933), Japon militariste.</li><li><strong>La faiblesse des démocraties</strong> et l'échec de la SDN : remilitarisation de la Rhénanie (1936), Anschluss (1938), accords de Munich (1938).</li></ul>" +
      "<div class='def'><b>Le déclenchement</b>Le <strong>1er septembre 1939</strong>, l'Allemagne envahit la Pologne ; le 3 septembre, le Royaume-Uni et la France lui déclarent la guerre.</div>",
      retenir: "Versailles, crise de 1929, totalitarismes et faiblesse des démocraties : invasion de la Pologne le 1er septembre 1939." },
    { t: "Les grandes phases", html:
      "<ol><li><strong>1939-1941 : victoires de l'Axe.</strong> Guerre éclair (Blitzkrieg) ; défaite de la France (juin 1940) ; appel du général de Gaulle le 18 juin 1940 ; invasion de l'URSS (juin 1941) ; attaque japonaise de Pearl Harbor (7 décembre 1941), entrée en guerre des États-Unis.</li><li><strong>1942-1943 : le tournant.</strong> Midway (juin 1942), El-Alamein (octobre-novembre 1942), <strong>Stalingrad</strong> (capitulation allemande en février 1943).</li><li><strong>1943-1945 : la victoire des Alliés.</strong> Débarquement en Normandie (6 juin 1944) ; capitulation allemande le <strong>8 mai 1945</strong> ; bombes atomiques sur Hiroshima (6 août) et Nagasaki (9 août) ; capitulation japonaise le <strong>2 septembre 1945</strong>.</li></ol>" +
      "<div class='attention'><b>Une guerre d'anéantissement</b>Plus de 50 millions de morts, dont une majorité de civils ; génocide des Juifs d'Europe (près de 6 millions de victimes) et des Tsiganes.</div>",
      retenir: "Victoires de l'Axe, tournant de 1942-1943, victoire alliée : 8 mai 1945 en Europe, 2 septembre 1945 en Asie." },
    { t: "Le Cameroun dans la guerre", html:
      "<p>Sous mandat français, le Cameroun refuse le régime de Vichy : le <strong>27 août 1940</strong>, le colonel <strong>Leclerc</strong> prend le contrôle de Douala et rallie le territoire à la <strong>France libre</strong> du général de Gaulle, avec le Tchad et le reste de l'AEF.</p>" +
      "<ul><li>Des milliers de <strong>tirailleurs</strong> camerounais combattent en Afrique du Nord (Koufra, Bir Hakeim) puis en Europe.</li><li>L'<strong>effort de guerre</strong> pèse sur les populations : travail forcé, cultures imposées, réquisition de caoutchouc et de bois.</li></ul>" +
      "<div class='savais'><b>Le savais-tu ?</b>Pendant plusieurs mois, Brazzaville fut la capitale de la France libre : l'Afrique centrale, Cameroun compris, a donné à de Gaulle son premier territoire et ses premières troupes.</div>",
      retenir: "27 août 1940 : ralliement du Cameroun à la France libre ; tirailleurs et effort de guerre." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> La bataille considérée comme le tournant de la guerre sur le front de l'Est est :</p><ol type='a'><li>Midway</li><li>Stalingrad</li><li>Bir Hakeim</li><li>Pearl Harbor</li></ol><details><summary>Voir la réponse</summary><p><strong>Stalingrad</strong> : l'armée allemande y capitule en février 1943.</p></details><p><strong>Exercice.</strong> Classe dans l'ordre : débarquement en Normandie ; invasion de la Pologne ; Pearl Harbor ; capitulation du Japon.</p><details><summary>Voir la réponse</summary><p>Pologne (1939) → Pearl Harbor (1941) → Normandie (1944) → capitulation du Japon (1945).</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Lors de la cérémonie du 11 novembre devant le monument aux morts de Douala, ton petit frère demande : « Pourquoi des Camerounais sont-ils allés mourir dans une guerre de Blancs ? »</p><p><strong>Tâche.</strong> Réponds-lui en une dizaine de lignes en expliquant le contexte colonial, le rôle du Cameroun en 1940 et les conséquences pour le pays.</p><details><summary>Voir une réponse attendue</summary><p>En 1939, le Cameroun est un territoire sous mandat français : ses habitants n'ont pas choisi d'entrer en guerre. En août 1940, Leclerc rallie Douala à la France libre ; le Cameroun devient une base de départ et fournit des soldats, les tirailleurs, et des ressources au prix du travail forcé. Ces soldats ont combattu pour une liberté qu'on leur refusait : après 1945, ce paradoxe nourrit les revendications nationalistes, comme celles de l'UPC (fondée en 1948), et la marche vers l'indépendance.</p></details></div>",
      retenir: "Savoir-être mobilisé : devoir de mémoire et esprit critique." }
  ],
  revision: ["Causes : Versailles, crise de 1929, totalitarismes, faiblesse des démocraties.", "<strong>1er septembre 1939</strong> : invasion de la Pologne.", "Tournant : Midway, El-Alamein, <strong>Stalingrad</strong> (1942-1943).", "Fin : <strong>8 mai 1945</strong> (Europe), <strong>2 septembre 1945</strong> (Japon).", "<strong>27 août 1940</strong> : Leclerc rallie le Cameroun à la France libre."],
  exo: "<p>Construis une frise chronologique 1939-1945 avec six dates et place le ralliement du Cameroun. <em>(1/9/1939 Pologne ; 18/6/1940 appel de De Gaulle ; 27/8/1940 Cameroun ; 7/12/1941 Pearl Harbor ; 2/1943 Stalingrad ; 6/6/1944 Normandie ; 8/5/1945 et 2/9/1945.)</em></p>",
  quiz: [
    { q: "La guerre commence avec l'invasion :", r: ["de la Pologne", "de la France", "de l'URSS", "de l'Éthiopie"], b: 0, e: "Le 1er septembre 1939." },
    { q: "Hitler arrive au pouvoir en :", r: ["1919", "1933", "1939", "1929"], b: 1, e: "Il devient chancelier en janvier 1933." },
    { q: "L'attaque de Pearl Harbor provoque l'entrée en guerre :", r: ["de l'URSS", "de l'Italie", "des États-Unis", "de la Chine"], b: 2, e: "Le 7 décembre 1941." },
    { q: "Le Cameroun se rallie à la France libre le :", r: ["18 juin 1940", "8 mai 1945", "1er janvier 1960", "27 août 1940"], b: 3, e: "Leclerc prend le contrôle de Douala." },
    { q: "Le débarquement de Normandie a lieu le :", r: ["6 juin 1944", "8 mai 1945", "2 septembre 1945", "6 août 1945"], b: 0, e: "Opération Overlord." },
    { q: "La capitulation allemande est signée le :", r: ["11 novembre 1918", "8 mai 1945", "6 août 1945", "24 octobre 1945"], b: 1, e: "Fin de la guerre en Europe." },
    { q: "La bombe atomique est lancée sur Hiroshima le :", r: ["7 décembre 1941", "8 mai 1945", "6 août 1945", "2 septembre 1945"], b: 2, e: "Puis Nagasaki le 9 août." },
    { q: "Les soldats africains de l'armée française sont appelés :", r: ["légionnaires", "zouaves", "spahis seulement", "tirailleurs"], b: 3, e: "Ils ont combattu à Koufra, Bir Hakeim, en Italie et en France." },
    { q: "Une cause de la guerre est :", r: ["le traité de Versailles jugé humiliant", "l'indépendance du Cameroun", "la création de l'ONU", "la guerre froide"], b: 0, e: "L'Allemagne veut effacer le « diktat » de 1919." },
    { q: "Le tournant de la guerre se situe en :", r: ["1939-1940", "1942-1943", "1944-1945", "1938"], b: 1, e: "Midway, El-Alamein, Stalingrad." }
  ],
  apc: { module: "Histoire de Terminale A", famille: "Citoyenneté", agir: "Expliquer la participation de l'Afrique aux conflits mondiaux pour entretenir la mémoire collective", situation: "Lors d'une cérémonie du souvenir à Douala, un enfant s'interroge sur l'engagement des Camerounais en 1939-1945.", tache: "Expliquer le contexte colonial, le rôle du Cameroun et les conséquences." }
});

/* ══════════════════════ Français — Tle A et 1re A ══════════════════════ */

var VRT_A_FR_COMMENTAIRE = {
  m: "francais", cle: "Commentaire composé (analyse de la consigne)", titre: "Commentaire composé : analyser la consigne", duree: 25,
  accroche: "La consigne est une boussole : elle indique où regarder dans le texte.",
  intro: "Au probatoire et au baccalauréat A, le commentaire composé est un exercice majeur. Avant de lire le texte en détail, il faut comprendre ce que la consigne demande : sans cela, on paraphrase ou on fait une explication linéaire, deux fautes sévèrement notées.",
  objectifs: ["identifier les éléments d'une consigne de commentaire composé", "distinguer consigne avec pistes et consigne sans pistes", "transformer la consigne en projet de lecture"],
  parties: [
    { t: "Qu'est-ce qu'un commentaire composé ?", html:
      "<div class='def'><b>Définition</b>Le commentaire composé est l'étude organisée d'un texte littéraire (poème, extrait de roman ou de théâtre) autour de <strong>centres d'intérêt</strong>. On montre <strong>ce que dit</strong> le texte et <strong>comment il le dit</strong> (procédés d'écriture).</div>" +
      "<div class='attention'><b>Deux fautes à éviter</b>La <strong>paraphrase</strong> (répéter le texte avec d'autres mots) et l'<strong>explication linéaire</strong> (suivre le texte ligne à ligne). Le commentaire est <strong>composé</strong> : regroupé par idées.</div>",
      retenir: "Commentaire composé = fond + forme, organisés en centres d'intérêt." },
    { t: "Les éléments de la consigne", html:
      "<p>Une consigne contient en général :</p><ul><li>le <strong>paratexte</strong> : auteur, titre de l'œuvre, date, parfois un chapeau qui situe le passage ;</li><li>l'<strong>ordre</strong> : « Vous ferez de ce texte un commentaire composé » ;</li><li>parfois des <strong>pistes</strong> : « Vous montrerez par exemple comment le poète exprime sa nostalgie et célèbre la terre natale. »</li></ul>" +
      "<div class='def'><b>Consigne avec pistes</b>Les pistes suggèrent les centres d'intérêt : on peut les suivre (c'est le plus sûr), les reformuler ou les compléter. « Par exemple » signifie qu'elles ne sont pas obligatoires.</div>" +
      "<div class='def'><b>Consigne sans pistes</b>L'élève doit trouver lui-même deux ou trois centres d'intérêt à partir de ses premières lectures (thèmes, tonalité, visée).</div>",
      retenir: "Paratexte + ordre + pistes éventuelles : les pistes annoncent souvent le plan." },
    { t: "Transformer la consigne en projet de lecture", html:
      "<ol><li><strong>Lire le paratexte</strong> : genre, époque, mouvement (négritude, poésie de la libération…).</li><li><strong>Souligner les mots clés</strong> des pistes (« nostalgie », « célèbre ») et les définir.</li><li><strong>Transformer chaque piste en question</strong> : « Comment le poète exprime-t-il sa nostalgie ? »</li><li><strong>Chercher dans le texte</strong> les procédés qui répondent (champs lexicaux, figures, rythme, temps verbaux).</li></ol>" +
      "<div class='ex'><b>Exemple</b>Consigne : « Vous ferez de ce poème de <em>Balafon</em> (Engelbert Mveng) un commentaire composé. Vous montrerez par exemple comment le poète rend hommage à l'Afrique et exprime sa foi. » Centres d'intérêt : I. Un hommage à l'Afrique ; II. L'expression d'une foi.</div>" +
      "<div class='savais'><b>Le savais-tu ?</b>Le père Engelbert Mveng (1930-1995), jésuite camerounais, était aussi historien et peintre : il a conçu des fresques et des vitraux inspirés de l'art africain.</div>",
      retenir: "Chaque piste devient une question, et chaque question une partie du commentaire." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Dans une consigne, l'expression « par exemple » signifie que les pistes sont :</p><ol type='a'><li>obligatoires</li><li>indicatives</li><li>interdites</li><li>à recopier</li></ol><details><summary>Voir la réponse</summary><p><strong>Indicatives</strong> : on peut les suivre, les reformuler ou les compléter.</p></details><p><strong>Exercice.</strong> Transforme en questions la piste : « Vous montrerez comment l'auteur dénonce la colonisation par l'ironie. »</p><details><summary>Voir la réponse</summary><p>Quelles réalités de la colonisation l'auteur dénonce-t-il ? Par quels procédés ironiques (antiphrases, décalages, naïveté feinte) le fait-il ?</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> En devoir surveillé dans ton lycée de Nkongsamba, la consigne est : « Vous ferez de ce texte un commentaire composé. » Il n'y a aucune piste. Ta voisine panique et commence à expliquer le texte vers après vers.</p><p><strong>Tâche.</strong> Explique-lui, en une dizaine de lignes, la démarche pour trouver ses centres d'intérêt et pourquoi l'explication vers par vers est une erreur.</p><details><summary>Voir une réponse attendue</summary><p>L'explication vers par vers est une explication linéaire, non « composée » : elle conduit à la paraphrase et à des répétitions. Démarche : lire plusieurs fois le texte ; noter le thème, la tonalité (lyrique, polémique, élégiaque) et la visée ; relever les champs lexicaux dominants et les procédés marquants ; regrouper ces observations en deux ou trois idées directrices ; formuler chacune en question. Ce sont les centres d'intérêt.</p></details></div>",
      retenir: "Savoir-être mobilisé : méthode et maîtrise de soi devant l'épreuve." }
  ],
  revision: ["Commentaire composé : <strong>fond + forme</strong>, en centres d'intérêt.", "Éviter la <strong>paraphrase</strong> et l'<strong>explication linéaire</strong>.", "Consigne : paratexte, ordre, pistes éventuelles.", "« Par exemple » : pistes <strong>indicatives</strong>.", "Piste → question → partie du devoir."],
  exo: "<p>Consigne : « Vous montrerez par exemple comment le poète exprime sa douleur d'exilé et son attachement à la terre natale. » Dégage les mots clés et propose deux centres d'intérêt. <em>(Mots clés : douleur, exilé, attachement, terre natale. I. Le chant d'une douleur d'exilé ; II. Une célébration de la terre natale.)</em></p>",
  quiz: [
    { q: "Le commentaire composé étudie :", r: ["le fond et la forme du texte", "la vie de l'auteur seulement", "la grammaire seulement", "le résumé du texte"], b: 0, e: "Ce que dit le texte et comment il le dit." },
    { q: "La paraphrase consiste à :", r: ["analyser les procédés", "répéter le texte avec d'autres mots", "citer le texte", "construire un plan"], b: 1, e: "C'est la faute la plus fréquente." },
    { q: "L'explication linéaire :", r: ["est attendue au bac", "regroupe les idées", "suit le texte ligne à ligne", "porte sur la consigne"], b: 2, e: "Elle s'oppose au commentaire « composé »." },
    { q: "Le paratexte comprend :", r: ["les figures de style", "les centres d'intérêt", "la conclusion", "l'auteur, le titre, la date"], b: 3, e: "Tout ce qui entoure le texte." },
    { q: "Une piste de lecture sert surtout à :", r: ["suggérer un centre d'intérêt", "donner la note", "remplacer le texte", "imposer une conclusion"], b: 0, e: "Elle oriente le plan." },
    { q: "<em>Balafon</em> est un recueil de :", r: ["Mongo Beti", "Engelbert Mveng", "Senghor", "Oyono"], b: 1, e: "Poèmes du père Engelbert Mveng, 1972." },
    { q: "Sans pistes, l'élève doit :", r: ["refuser le sujet", "faire une explication linéaire", "trouver lui-même les centres d'intérêt", "résumer le texte"], b: 2, e: "À partir du thème, de la tonalité et des procédés." },
    { q: "Transformer une piste en question permet :", r: ["d'allonger la copie", "de citer l'auteur", "d'éviter la conclusion", "d'orienter la recherche des procédés"], b: 3, e: "Chaque partie répond à une question." },
    { q: "Une tonalité possible d'un poème est :", r: ["lyrique", "arithmétique", "administrative", "chronologique"], b: 0, e: "Expression des sentiments personnels." },
    { q: "Un commentaire composé comprend en général :", r: ["une seule partie", "deux ou trois centres d'intérêt", "dix parties", "aucune introduction"], b: 1, e: "Annoncés dans l'introduction." }
  ],
  apc: { module: "Français de Première et Terminale A", famille: "Vie sociale et culturelle", agir: "Analyser une consigne pour construire une lecture organisée d'un texte littéraire", situation: "En devoir surveillé à Nkongsamba, une élève sans pistes de lecture explique le texte vers par vers.", tache: "Lui expliquer la démarche pour trouver des centres d'intérêt." }
};
VRT_L("tle-a-francais-commentaire-consigne", Object.assign({ c: "Tle A" }, VRT_A_FR_COMMENTAIRE));
VRT_L("1re-a-francais-commentaire-consigne", Object.assign({ c: "1re A" }, VRT_A_FR_COMMENTAIRE));

/* ══════════════════════ Philosophie — 1re C et 1re D ══════════════════════ */

var VRT_1CD_PHILO_DEF = {
  m: "philo", cle: "Définitions de la Philosophie", titre: "Définir la philosophie", duree: 25,
  accroche: "Une seule discipline commence par se demander ce qu'elle est : la philosophie.",
  intro: "En série scientifique, tu découvres la philosophie cette année. Elle ne donne pas de formules, mais elle apprend à interroger les formules elles-mêmes : qu'est-ce que savoir ? Qu'est-ce qui est juste ? Pour commencer, il faut savoir ce que les philosophes entendent par « philosophie ».",
  objectifs: ["donner l'étymologie et plusieurs définitions de la philosophie", "distinguer la conception spontanée et la conception savante", "reconnaître les grandes questions de la philosophie"],
  parties: [
    { t: "La conception spontanée et l'étymologie", html:
      "<p>Dans le langage courant, « avoir une philosophie », c'est avoir une <strong>manière de vivre</strong> (« ma philosophie : ne jamais abandonner ») ou rester calme dans l'épreuve (« prendre les choses avec philosophie »). C'est la <strong>conception spontanée</strong>.</p>" +
      "<div class='def'><b>Étymologie</b>Du grec <strong>philein</strong> (aimer) et <strong>sophia</strong> (sagesse, savoir) : <strong>amour de la sagesse</strong>. Pythagore aurait refusé le titre de « sage » (sophos) pour se dire « ami de la sagesse » (philosophos) : le philosophe <strong>cherche</strong> le savoir, il ne le possède pas.</div>",
      retenir: "Conception spontanée : une manière de vivre. Étymologie : amour, recherche de la sagesse." },
    { t: "Quelques définitions savantes", html:
      "<ul><li><strong>Platon</strong> : l'étonnement est le commencement de la philosophie ; elle conduit des apparences à la vérité (allégorie de la caverne).</li><li><strong>Aristote</strong> : la philosophie est la <strong>science des premiers principes et des premières causes</strong>.</li><li><strong>Descartes</strong> : elle est comme un <strong>arbre</strong> dont les racines sont la métaphysique, le tronc la physique et les branches la médecine, la mécanique et la morale.</li><li><strong>Kant</strong> la ramène à quatre questions : <strong>Que puis-je savoir ? Que dois-je faire ? Que m'est-il permis d'espérer ? Qu'est-ce que l'homme ?</strong></li><li><strong>Marcien Towa</strong> : philosopher, c'est examiner de façon critique, y compris ses propres traditions, pour se libérer.</li></ul>" +
      "<div class='astuce'><b>Astuce</b>Retiens les quatre questions de Kant : elles reviennent sans cesse dans les sujets (connaissance, morale, religion, homme).</div>",
      retenir: "Platon : l'étonnement ; Aristote : premières causes ; Descartes : l'arbre ; Kant : quatre questions ; Towa : la critique libératrice." },
    { t: "Ce qui définit l'attitude philosophique", html:
      "<div class='def'><b>Trois caractères</b>La philosophie est une réflexion <strong>rationnelle</strong> (elle argumente), <strong>critique</strong> (elle ne reçoit aucune idée sans examen) et <strong>totalisante</strong> (elle cherche le sens d'ensemble : l'homme, le monde, la valeur des choses).</div>" +
      "<div class='ex'><b>Philosophie et sciences</b>Le physicien mesure la chute d'un corps ; le philosophe demande ce que vaut une loi scientifique, si la science peut tout expliquer, si tout ce qui est techniquement possible est moralement permis (clonage, armes, intelligence artificielle).</div>" +
      "<div class='savais'><b>Le savais-tu ?</b>Jusqu'au XVIIIᵉ siècle, la physique s'appelait « philosophie naturelle » : le grand livre de Newton (1687) s'intitule <em>Principes mathématiques de la philosophie naturelle</em>.</div>",
      retenir: "Rationnelle, critique, totalisante : la philosophie interroge le sens et la valeur, là où la science mesure." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> « La science des premiers principes et des premières causes » est une définition de :</p><ol type='a'><li>Kant</li><li>Descartes</li><li>Aristote</li><li>Towa</li></ol><details><summary>Voir la réponse</summary><p><strong>Aristote</strong>, dans la <em>Métaphysique</em>.</p></details><p><strong>Exercice (format du Probatoire).</strong> Définis les concepts « philosophie » et « opinion » et donne pour chacun une citation avec son auteur.</p><details><summary>Voir la réponse</summary><p>Philosophie : réflexion rationnelle, critique et totalisante sur les questions fondamentales ; « On n'apprend pas la philosophie, on apprend à philosopher » (Kant). Opinion (doxa) : avis reçu sans examen ; « Ce que je sais, c'est que je ne sais rien » (Socrate), qui oppose la conscience de son ignorance aux fausses certitudes.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> En 1re C à Bertoua, un camarade déclare : « Nous sommes des scientifiques : la philosophie, c'est du bavardage. La science répond à tout. »</p><p><strong>Tâche.</strong> Rédige une réponse argumentée (12 à 15 lignes) qui montre ce que la philosophie apporte à un futur scientifique, avec au moins une définition étudiée et un exemple actuel.</p><details><summary>Voir une réponse attendue</summary><p>La science explique comment les phénomènes se produisent, mais elle ne dit pas ce qu'il faut faire de ses découvertes. Kant rappelle que la question « Que dois-je faire ? » est distincte de « Que puis-je savoir ? ». Exemple : l'intelligence artificielle permet de produire de fausses vidéos très réalistes ; la technique le permet, mais est-ce juste de les diffuser ? De plus, Descartes faisait de la physique une branche de la philosophie : les grands savants (Newton, Einstein) ont réfléchi aux fondements de leur science. La philosophie n'est donc pas un bavardage : elle apprend à examiner les principes et les usages du savoir.</p></details></div>",
      retenir: "Savoir-être mobilisé : ouverture d'esprit et sens de la responsabilité." }
  ],
  revision: ["Conception spontanée : manière de vivre ; savante : réflexion rigoureuse.", "<strong>Philein</strong> + <strong>sophia</strong> : amour de la sagesse (Pythagore).", "Aristote : premiers principes ; Descartes : l'arbre ; Kant : quatre questions.", "Réflexion <strong>rationnelle</strong>, <strong>critique</strong>, <strong>totalisante</strong>.", "La science mesure ; la philosophie interroge le sens et la valeur."],
  exo: "<p>Explique en cinq lignes l'image de l'arbre chez Descartes. <em>(Racines : métaphysique, fondement de tout ; tronc : physique ; branches : médecine, mécanique, morale ; les fruits, utiles à la vie, viennent des branches, mais tout dépend des racines.)</em></p>",
  quiz: [
    { q: "Dans le langage courant, « prendre les choses avec philosophie » signifie :", r: ["rester calme et serein", "étudier Platon", "refuser de penser", "faire de la science"], b: 0, e: "C'est la conception spontanée." },
    { q: "Le philosophe, selon Pythagore, est celui qui :", r: ["possède la sagesse", "aime et cherche la sagesse", "enseigne la géométrie", "dirige la cité"], b: 1, e: "Philosophos : ami de la sagesse." },
    { q: "Pour Platon, la philosophie commence par :", r: ["la peur", "la richesse", "l'étonnement", "la guerre"], b: 2, e: "S'étonner, c'est voir que l'évidence pose question." },
    { q: "L'image de l'arbre est de :", r: ["Kant", "Aristote", "Towa", "Descartes"], b: 3, e: "Racines : métaphysique ; tronc : physique ; branches : médecine, mécanique, morale." },
    { q: "« Que dois-je faire ? » relève de :", r: ["la morale", "la physique", "la religion", "la logique"], b: 0, e: "C'est la deuxième question de Kant." },
    { q: "Une réflexion critique :", r: ["accepte toutes les opinions", "examine les idées avant de les admettre", "refuse la raison", "récite les traditions"], b: 1, e: "Aucune idée n'est reçue sans examen." },
    { q: "Le caractère « totalisant » de la philosophie signifie qu'elle :", r: ["étudie un seul objet", "fait des calculs", "cherche un sens d'ensemble", "dure longtemps"], b: 2, e: "Elle interroge l'homme, le monde et les valeurs." },
    { q: "Newton parlait de « philosophie naturelle » pour désigner :", r: ["la morale", "la religion", "la poésie", "la physique"], b: 3, e: "Ses Principia de 1687." },
    { q: "Marcien Towa voit dans la philosophie :", r: ["une critique libératrice", "une récitation des ancêtres", "une science exacte", "un loisir"], b: 0, e: "Examiner même ses propres traditions pour se libérer." },
    { q: "Aristote définit la philosophie comme :", r: ["l'art de bien parler", "la science des premiers principes et des premières causes", "l'amour des richesses", "l'étude des étoiles"], b: 1, e: "Définition de la Métaphysique." }
  ],
  apc: { module: "Philosophie de Première C et D", famille: "Vie sociale et culturelle", agir: "Montrer l'utilité de la réflexion philosophique pour un futur scientifique", situation: "En 1re C à Bertoua, un élève affirme que la science répond à tout et que la philosophie est du bavardage.", tache: "Lui répondre de manière argumentée avec des définitions et un exemple actuel." }
};
VRT_L("1re-c-philo-definitions", Object.assign({ c: "1re C" }, VRT_1CD_PHILO_DEF));
VRT_L("1re-d-philo-definitions", Object.assign({ c: "1re D" }, VRT_1CD_PHILO_DEF));

/* ══════════════════════ Philosophie — 1re A ══════════════════════ */

VRT_L("1re-a-philo-ethnocentrisme", {
  c: "1re A", m: "philo", cle: "Thèses ethnocentristes occidentales", titre: "Les thèses ethnocentristes occidentales sur l'Afrique", duree: 25,
  accroche: "« L'Afrique n'est pas une partie historique du monde » : une thèse à examiner, pas à subir.",
  intro: "Pour comprendre pourquoi la philosophie africaine s'est d'abord construite comme une réponse, il faut connaître les thèses qu'elle conteste. Du XVIIIᵉ au XXᵉ siècle, des penseurs européens ont jugé l'Afrique à partir de leur propre culture, prise comme mesure de toute humanité : c'est l'ethnocentrisme.",
  objectifs: ["définir l'ethnocentrisme", "présenter les thèses de Hegel, Gobineau et Lévy-Bruhl", "montrer les limites de ces thèses et leurs conséquences"],
  parties: [
    { t: "L'ethnocentrisme", html:
      "<div class='def'><b>Définition</b>L'<strong>ethnocentrisme</strong> est l'attitude qui consiste à juger les autres cultures à partir des valeurs de la sienne, considérée comme supérieure ou comme la norme. Claude Lévi-Strauss : « Le barbare, c'est d'abord l'homme qui croit à la barbarie » (<em>Race et histoire</em>, 1952).</div>" +
      "<div class='ex'><b>Exemple</b>Dire qu'un peuple « n'a pas d'écriture, donc pas de pensée », c'est prendre l'écriture alphabétique européenne comme seul critère de rationalité et ignorer l'oralité, les hiéroglyphes, l'écriture bamoun du roi Njoya.</div>",
      retenir: "Ethnocentrisme : sa propre culture comme mesure des autres." },
    { t: "Les principales thèses", html:
      "<ul><li><strong>Hegel</strong> (<em>Leçons sur la philosophie de l'histoire</em>, 1822-1830) : l'Afrique « proprement dite » ne serait « pas une partie historique du monde » ; l'Africain vivrait dans l'immédiateté, sans conscience de l'universel.</li><li><strong>Arthur de Gobineau</strong> (<em>Essai sur l'inégalité des races humaines</em>, 1853-1855) : hiérarchie des « races » ; la « race noire » serait la plus basse. Thèse raciste aujourd'hui scientifiquement réfutée.</li><li><strong>Lucien Lévy-Bruhl</strong> (<em>La Mentalité primitive</em>, 1922) : les « primitifs » auraient une mentalité <strong>prélogique</strong> et <strong>mystique</strong>, indifférente à la contradiction.</li></ul>" +
      "<div class='attention'><b>Les conséquences</b>Ces thèses ont servi à <strong>justifier</strong> la traite négrière et la colonisation, présentée comme une « mission civilisatrice ».</div>",
      retenir: "Hegel : Afrique hors de l'histoire ; Gobineau : inégalité des races ; Lévy-Bruhl : mentalité prélogique." },
    { t: "Les réponses et les limites", html:
      "<ul><li><strong>Lévy-Bruhl lui-même</strong>, dans ses <em>Carnets</em> publiés en 1949, revient sur l'idée d'une mentalité prélogique propre à certains peuples.</li><li><strong>Cheikh Anta Diop</strong> montre l'apport de l'Égypte nègre à la civilisation et la profondeur historique de l'Afrique.</li><li>La génétique a établi qu'il n'existe pas de « races » humaines biologiquement hiérarchisées.</li><li><strong>Marcien Towa</strong> et <strong>Paulin Hountondji</strong> répondent en philosophes : la rationalité est universelle ; il faut l'exercer, non prouver qu'on la possède.</li></ul>" +
      "<div class='savais'><b>Le savais-tu ?</b>Le roi Ibrahim Njoya (vers 1870-1933) a inventé à Foumban une écriture, le <strong>shü-mom</strong>, et fait rédiger l'histoire et les coutumes de son royaume : un démenti direct à l'idée d'une Afrique sans écriture.</div>",
      retenir: "Ces thèses sont réfutées par l'histoire, la science et la philosophie ; la raison est universelle." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> L'expression « mentalité prélogique » est de :</p><ol type='a'><li>Hegel</li><li>Gobineau</li><li>Lévy-Bruhl</li><li>Lévi-Strauss</li></ol><details><summary>Voir la réponse</summary><p><strong>Lucien Lévy-Bruhl</strong>, <em>La Mentalité primitive</em> (1922).</p></details><p><strong>Exercice (format du Probatoire).</strong> Définis les concepts « ethnocentrisme » et « mentalité prélogique » et donne pour chacun une citation avec son auteur.</p><details><summary>Voir la réponse</summary><p>Ethnocentrisme : juger les autres cultures à partir de la sienne, prise pour norme ; « Le barbare, c'est d'abord l'homme qui croit à la barbarie » (Lévi-Strauss). Mentalité prélogique : selon Lévy-Bruhl, pensée « primitive » mystique, indifférente à la contradiction ; « L'Afrique […] n'est pas une partie historique du monde » (Hegel) relève du même préjugé.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Sur un réseau social, une vidéo virale affirme : « Les Africains n'ont rien inventé, tout vient de l'Occident. » Plusieurs élèves de ta classe à Yaoundé la partagent en riant.</p><p><strong>Tâche.</strong> Rédige un commentaire argumenté (12 lignes) qui identifie la thèse ethnocentriste, la rattache à un auteur étudié et la réfute avec deux arguments.</p><details><summary>Voir une réponse attendue</summary><p>Cette affirmation reprend l'idée de Hegel d'une Afrique hors de l'histoire. Elle est fausse : l'Égypte pharaonique a développé l'écriture, la géométrie et la médecine (Cheikh Anta Diop) ; au Cameroun, le roi Njoya a inventé une écriture au XIXᵉ siècle ; la métallurgie du fer est attestée très tôt en Afrique. Juger les autres à partir de critères qu'on suppose universels, c'est de l'ethnocentrisme. Partager une telle vidéo sans vérifier, c'est accepter une opinion sans examen, le contraire de l'attitude philosophique.</p></details></div>",
      retenir: "Savoir-être mobilisé : esprit critique et fierté éclairée de son héritage." }
  ],
  revision: ["<strong>Ethnocentrisme</strong> : juger les autres à partir de sa culture.", "<strong>Hegel</strong> : l'Afrique, « pas une partie historique du monde ».", "<strong>Gobineau</strong> (1853-1855) : inégalité des races.", "<strong>Lévy-Bruhl</strong> (1922) : mentalité prélogique ; revenu sur sa thèse (1949).", "Réponses : C. A. Diop, Towa, Hountondji ; écriture de Njoya."],
  exo: "<p>Explique la phrase de Lévi-Strauss : « Le barbare, c'est d'abord l'homme qui croit à la barbarie. » <em>(Celui qui traite les autres de « barbares » refuse de reconnaître leur humanité : c'est lui qui adopte l'attitude qu'il dénonce.)</em></p>",
  quiz: [
    { q: "L'ethnocentrisme consiste à :", r: ["juger les autres cultures à partir de la sienne", "étudier toutes les cultures", "aimer les voyages", "parler plusieurs langues"], b: 0, e: "Sa culture devient la mesure de toutes les autres." },
    { q: "Pour Hegel, l'Afrique « proprement dite » :", r: ["est le berceau de la philosophie", "n'est pas une partie historique du monde", "est l'avenir du monde", "est une démocratie"], b: 1, e: "Thèse des Leçons sur la philosophie de l'histoire." },
    { q: "<em>Essai sur l'inégalité des races humaines</em> est de :", r: ["Lévy-Bruhl", "Hegel", "Gobineau", "Towa"], b: 2, e: "Arthur de Gobineau, 1853-1855." },
    { q: "<em>La Mentalité primitive</em> date de :", r: ["1853", "1945", "1971", "1922"], b: 3, e: "Lucien Lévy-Bruhl." },
    { q: "La « mentalité prélogique » serait indifférente :", r: ["à la contradiction", "à la musique", "à la religion", "à la nature"], b: 0, e: "Selon Lévy-Bruhl, avant ses Carnets." },
    { q: "Ces thèses ont servi à justifier :", r: ["les indépendances", "la colonisation", "la négritude", "l'ONU"], b: 1, e: "Sous le nom de « mission civilisatrice »." },
    { q: "L'écriture shü-mom a été inventée par :", r: ["Cheikh Anta Diop", "Senghor", "le roi Njoya", "Hountondji"], b: 2, e: "À Foumban, royaume bamoun." },
    { q: "« Le barbare, c'est d'abord l'homme qui croit à la barbarie » est de :", r: ["Hegel", "Gobineau", "Towa", "Lévi-Strauss"], b: 3, e: "Race et histoire, 1952." },
    { q: "Cheikh Anta Diop a surtout montré :", r: ["l'apport de l'Égypte nègre à la civilisation", "l'infériorité de l'Afrique", "la supériorité de l'Europe", "l'absence d'histoire africaine"], b: 0, e: "Nations nègres et culture, 1954." },
    { q: "Pour Towa et Hountondji, face à ces thèses il faut :", r: ["se taire", "exercer la raison critique", "rejeter toute philosophie", "imiter l'Europe en tout"], b: 1, e: "La rationalité est universelle : il faut l'exercer." }
  ],
  apc: { module: "Philosophie de Première A", famille: "Vie sociale et culturelle", agir: "Identifier et réfuter les préjugés ethnocentristes", situation: "Une vidéo virale affirme que les Africains n'ont rien inventé ; des élèves la partagent.", tache: "Rédiger un commentaire qui identifie la thèse, la rattache à un auteur et la réfute." }
});

/* ══════════════════════ Français — 1re C et 1re D ══════════════════════ */

var VRT_1CD_FR_COMMUNICATION = {
  m: "francais", cle: "Les conditions de la communication", titre: "Les conditions de la communication", duree: 25,
  accroche: "« Allô ? Tu m'entends ? » : même une conversation banale obéit à des règles.",
  intro: "Un SMS mal compris, un exposé que personne n'écoute, une annonce radio en langue inconnue : la communication échoue souvent. Le linguiste Roman Jakobson a décrit les éléments sans lesquels un message ne passe pas. Les connaître aide à lire les textes… et à mieux se faire comprendre.",
  objectifs: ["identifier les six facteurs de la communication", "associer à chaque facteur sa fonction du langage", "expliquer les causes d'échec d'une communication"],
  parties: [
    { t: "Les six facteurs de la communication", html:
      "<div class='def'><b>Le schéma de Jakobson</b>Un <strong>destinateur</strong> (émetteur) adresse un <strong>message</strong> à un <strong>destinataire</strong> (récepteur). Pour que le message passe, il faut : un <strong>référent</strong> (ce dont on parle, le contexte), un <strong>code</strong> commun (une langue, des signes) et un <strong>canal</strong> (le contact physique : voix, papier, téléphone, réseau).</div>" +
      "<div class='ex'><b>Exemple</b>Une mère (destinateur) envoie par WhatsApp (canal), en français (code), à son fils (destinataire) le message « Achète deux kilos de riz au retour » ; le référent est la course à faire.</div>",
      retenir: "Destinateur, destinataire, message, référent, code, canal." },
    { t: "Les fonctions du langage", html:
      "<p>À chaque facteur correspond une <strong>fonction</strong>, selon que le message est centré sur lui :</p><ul><li><strong>expressive</strong> (destinateur) : « Comme je suis heureux ! »</li><li><strong>conative</strong> ou impressive (destinataire) : « Viens ici ! » (impératif, apostrophe)</li><li><strong>référentielle</strong> (référent) : « Yaoundé est la capitale politique. »</li><li><strong>poétique</strong> (message) : jeu sur les sons et les formes, slogans, poèmes</li><li><strong>métalinguistique</strong> (code) : « Que veut dire « mbombo » ? »</li><li><strong>phatique</strong> (canal) : « Allô ? », « Tu me suis ? »</li></ul>" +
      "<div class='astuce'><b>Astuce</b>Un même texte combine souvent plusieurs fonctions ; on cherche la fonction <strong>dominante</strong>.</div>",
      retenir: "Expressive, conative, référentielle, poétique, métalinguistique, phatique." },
    { t: "Quand la communication échoue", html:
      "<p>La communication peut être perturbée par des <strong>bruits</strong> : tout ce qui gêne la transmission.</p><ul><li>bruit du <strong>canal</strong> : réseau coupé, brouhaha du marché, écriture illisible ;</li><li>bruit du <strong>code</strong> : langue non partagée, jargon, abréviations de SMS inconnues ;</li><li>bruit du <strong>référent</strong> : le destinataire ignore le contexte (une allusion qu'il ne comprend pas) ;</li><li>bruit <strong>psychologique</strong> : préjugé, colère, inattention.</li></ul>" +
      "<div class='def'><b>La rétroaction (feed-back)</b>La réponse du destinataire permet au destinateur de vérifier que le message est passé et de le corriger.</div>" +
      "<div class='savais'><b>Le savais-tu ?</b>Avec plus de 250 langues, le Cameroun pratique au quotidien le changement de code : on passe du français à l'anglais, au pidgin ou au camfranglais selon l'interlocuteur.</div>",
      retenir: "Bruits du canal, du code, du référent ou psychologiques ; la rétroaction permet de corriger." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Dans « Allô, tu m'entends bien ? », la fonction dominante est :</p><ol type='a'><li>expressive</li><li>référentielle</li><li>phatique</li><li>poétique</li></ol><details><summary>Voir la réponse</summary><p><strong>Phatique</strong> : le message vérifie que le contact (canal) fonctionne.</p></details><p><strong>Exercice.</strong> Identifie la fonction dominante : a) « Défense d'uriner ici ! » b) « Le mot « nkap » signifie argent. »</p><details><summary>Voir la réponse</summary><p>a) Conative (centrée sur le destinataire, injonction). b) Métalinguistique (porte sur le code).</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Le délégué de ta classe à Garoua envoie dans le groupe WhatsApp : « Dvr de maths reporté à jeudi, svp passez l'info ». Plusieurs élèves anglophones et un nouvel élève venu de Maroua n'ont rien compris ; d'autres n'avaient plus de connexion.</p><p><strong>Tâche.</strong> Analyse cette situation de communication (facteurs, causes de l'échec) et réécris le message pour qu'il soit compris de tous.</p><details><summary>Voir une réponse attendue</summary><p>Destinateur : le délégué ; destinataires : les élèves ; canal : WhatsApp ; code : français abrégé ; référent : le report du devoir. Causes de l'échec : bruit du code (abréviations « dvr », « svp », français seul pour des anglophones) ; bruit du canal (pas de connexion). Message réécrit : « Le devoir de mathématiques est reporté au jeudi 19 novembre. / The maths test is postponed to Thursday, 19 November. Merci de prévenir ceux qui n'ont pas de connexion. » Il faudrait aussi l'annoncer en classe (autre canal) et demander une confirmation (rétroaction).</p></details></div>",
      retenir: "Savoir-être mobilisé : souci d'être compris par tous et respect de la diversité linguistique." }
  ],
  revision: ["Six facteurs : <strong>destinateur, destinataire, message, référent, code, canal</strong>.", "Fonctions : expressive, conative, référentielle, poétique, métalinguistique, phatique.", "Chercher la fonction <strong>dominante</strong>.", "<strong>Bruits</strong> : canal, code, référent, psychologiques.", "La <strong>rétroaction</strong> vérifie que le message est passé."],
  exo: "<p>Pour chaque phrase, donne la fonction dominante : « Ô Afrique, terre de mes ancêtres » ; « Fermez vos cahiers » ; « Le Wouri se jette dans l'Atlantique » ; « Tu me suis ? ». <em>(Expressive ou poétique ; conative ; référentielle ; phatique.)</em></p>",
  quiz: [
    { q: "Le schéma de la communication étudié ici est celui de :", r: ["Roman Jakobson", "Ferdinand de Saussure", "Aristote", "Descartes"], b: 0, e: "Linguiste, 1960 : six facteurs et six fonctions." },
    { q: "Le code désigne :", r: ["le contenu du message", "le système de signes commun", "le récepteur", "le support"], b: 1, e: "Par exemple une langue." },
    { q: "Le canal est :", r: ["ce dont on parle", "la langue", "le moyen physique de transmission", "la personne qui parle"], b: 2, e: "Voix, papier, téléphone, réseau." },
    { q: "La fonction centrée sur le destinataire est :", r: ["expressive", "phatique", "référentielle", "conative"], b: 3, e: "Impératif, apostrophe, questions." },
    { q: "« Que signifie le mot « mbombo » ? » relève de la fonction :", r: ["métalinguistique", "poétique", "phatique", "expressive"], b: 0, e: "Le message porte sur le code lui-même." },
    { q: "La fonction expressive est centrée sur :", r: ["le canal", "le destinateur", "le code", "le référent"], b: 1, e: "Elle exprime les sentiments de celui qui parle." },
    { q: "Un réseau téléphonique coupé est un bruit :", r: ["du code", "psychologique", "du canal", "du référent"], b: 2, e: "Le contact physique est rompu." },
    { q: "La rétroaction (feed-back) permet de :", r: ["changer de langue", "écrire un poème", "couper la communication", "vérifier que le message est compris"], b: 3, e: "Le destinataire répond au destinateur." },
    { q: "Un slogan publicitaire qui joue sur les sons relève surtout de la fonction :", r: ["poétique", "phatique", "métalinguistique", "référentielle"], b: 0, e: "Le message est travaillé pour lui-même." },
    { q: "« Yaoundé est la capitale politique du Cameroun » relève de la fonction :", r: ["conative", "référentielle", "expressive", "phatique"], b: 1, e: "Elle informe sur le référent." }
  ],
  apc: { module: "Français de Première C et D", famille: "Vie sociale et culturelle", agir: "Analyser une situation de communication pour transmettre un message compris de tous", situation: "Un message abrégé du délégué sur WhatsApp n'est pas compris par une partie de la classe à Garoua.", tache: "Analyser les facteurs et les causes de l'échec, puis réécrire le message." }
};
VRT_L("1re-c-francais-communication", Object.assign({ c: "1re C" }, VRT_1CD_FR_COMMUNICATION));
VRT_L("1re-d-francais-communication", Object.assign({ c: "1re D" }, VRT_1CD_FR_COMMUNICATION));

/* ══════════════════════ Histoire — 1re A, 1re C et 1re D ══════════════════════ */

var VRT_1RE_HIST_RENAISSANCE = {
  m: "histoire", cle: "Europe de la renaissance", titre: "L'Europe de la Renaissance (XVᵉ-XVIᵉ siècles)", duree: 25,
  accroche: "Une imprimerie, des caravelles et une nouvelle idée de l'homme : l'Europe change de visage.",
  intro: "Entre le milieu du XVᵉ et la fin du XVIᵉ siècle, l'Europe connaît un renouveau des arts, des sciences et des idées, et part à la découverte du monde. C'est aussi le moment où des navigateurs portugais atteignent les côtes du Cameroun, auquel ils donnent son nom.",
  objectifs: ["définir la Renaissance et l'humanisme", "présenter les transformations artistiques, scientifiques et religieuses", "expliquer les grandes découvertes et leurs conséquences pour l'Afrique"],
  parties: [
    { t: "La Renaissance et l'humanisme", html:
      "<div class='def'><b>Définitions</b>La <strong>Renaissance</strong> est le renouveau culturel européen des XVᵉ et XVIᵉ siècles, né en <strong>Italie</strong> (Florence, Rome, Venise), qui s'inspire de l'Antiquité grecque et romaine. L'<strong>humanisme</strong> est le mouvement intellectuel qui place l'<strong>homme</strong>, sa dignité et sa raison au centre de la réflexion.</div>" +
      "<ul><li><strong>L'imprimerie</strong> : Gutenberg met au point les caractères mobiles à Mayence (Bible vers 1455) ; les livres se diffusent rapidement.</li><li><strong>Les humanistes</strong> : Érasme (<em>Éloge de la folie</em>, 1511), Thomas More (<em>Utopie</em>, 1516), Rabelais, Montaigne.</li><li><strong>Les mécènes</strong> : les Médicis à Florence, les papes à Rome financent artistes et savants.</li></ul>",
      retenir: "Renaissance : renouveau inspiré de l'Antiquité, né en Italie ; humanisme : l'homme au centre ; diffusion par l'imprimerie." },
    { t: "Arts, sciences et religion", html:
      "<ul><li><strong>Arts</strong> : perspective, étude du corps humain. Léonard de Vinci (<em>La Joconde</em>), Michel-Ange (plafond de la chapelle Sixtine), Raphaël.</li><li><strong>Sciences</strong> : <strong>Copernic</strong> (1543) affirme que la Terre tourne autour du Soleil (héliocentrisme) ; Vésale décrit l'anatomie humaine.</li><li><strong>Religion</strong> : en <strong>1517</strong>, <strong>Martin Luther</strong> critique la vente des indulgences : c'est la <strong>Réforme protestante</strong> ; Calvin la prolonge. L'Église catholique répond par la <strong>Contre-Réforme</strong> (concile de Trente, 1545-1563).</li></ul>" +
      "<div class='attention'><b>Attention</b>La Renaissance n'est pas une rupture totale avec le Moyen Âge, et elle reste réservée à une élite urbaine et instruite.</div>",
      retenir: "Vinci, Michel-Ange ; Copernic (1543) ; Luther (1517) : Réforme et Contre-Réforme." },
    { t: "Les grandes découvertes et l'Afrique", html:
      "<ul><li>Causes : recherche de l'or et des épices, contournement de l'Empire ottoman (prise de Constantinople en <strong>1453</strong>), progrès techniques (caravelle, boussole, astrolabe).</li><li>Étapes : Bartolomeu Dias passe le cap de Bonne-Espérance (1488) ; <strong>Christophe Colomb</strong> atteint l'Amérique (1492) ; Vasco de Gama arrive en Inde (1498) ; Magellan et Elcano font le tour du monde (1519-1522).</li></ul>" +
      "<div class='ex'><b>Le Cameroun</b>Vers <strong>1472</strong>, le Portugais <strong>Fernando Póo</strong> entre dans l'estuaire du Wouri ; les marins, frappés par l'abondance des crevettes, le nomment <strong>Rio dos Camarões</strong>, la « rivière des crevettes » : c'est l'origine du nom <strong>Cameroun</strong>.</div>" +
      "<div class='attention'><b>Conséquences</b>Premiers contacts commerciaux avec l'Afrique, puis développement de la <strong>traite atlantique</strong> pour fournir des esclaves aux plantations d'Amérique ; destruction des sociétés amérindiennes.</div>",
      retenir: "1453, 1488, 1492, 1498 ; vers 1472, Rio dos Camarões ; le revers des découvertes : traite et conquêtes." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Le mouvement qui place l'homme au centre de la réflexion est :</p><ol type='a'><li>la Réforme</li><li>l'humanisme</li><li>la Contre-Réforme</li><li>l'héliocentrisme</li></ol><details><summary>Voir la réponse</summary><p><strong>L'humanisme</strong>, avec Érasme, More, Rabelais, Montaigne.</p></details><p><strong>Exercice.</strong> Associe chaque date à son événement : 1455, 1492, 1517, 1543.</p><details><summary>Voir la réponse</summary><p>1455 : Bible de Gutenberg ; 1492 : Colomb en Amérique ; 1517 : thèses de Luther ; 1543 : Copernic, héliocentrisme.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Un guide du musée maritime de Douala prépare une visite pour des collégiens. Il veut leur expliquer d'où vient le nom « Cameroun » et pourquoi l'arrivée des Portugais au XVᵉ siècle a eu des effets à la fois positifs et dramatiques.</p><p><strong>Tâche.</strong> Rédige pour lui un texte de 12 à 15 lignes.</p><details><summary>Voir une réponse attendue</summary><p>Au XVᵉ siècle, les Européens cherchent une route maritime vers les épices et l'or de l'Asie et de l'Afrique, grâce à la caravelle, à la boussole et à l'astrolabe. Vers 1472, Fernando Póo entre dans l'estuaire du Wouri : les marins y voient d'innombrables crevettes et le nomment Rio dos Camarões, d'où le nom Cameroun. Ces contacts ouvrent des échanges commerciaux (ivoire, poivre, tissus, métaux). Mais ils préparent aussi la traite atlantique : pendant plus de trois siècles, des millions d'Africains sont déportés vers l'Amérique, et la côte camerounaise, de Douala à Bimbia, devient un lieu de ce commerce. Se souvenir de ces deux faces, c'est comprendre l'histoire de notre pays.</p></details></div>",
      retenir: "Savoir-être mobilisé : esprit critique et devoir de mémoire." }
  ],
  revision: ["<strong>Renaissance</strong> (XVᵉ-XVIᵉ s.) : renouveau né en Italie, inspiré de l'Antiquité.", "<strong>Humanisme</strong> : l'homme au centre ; imprimerie de Gutenberg (vers 1455).", "Vinci, Michel-Ange ; <strong>Copernic</strong> 1543 ; <strong>Luther</strong> 1517.", "Découvertes : 1488 Dias, <strong>1492</strong> Colomb, 1498 Vasco de Gama.", "Vers 1472 : Fernando Póo, <strong>Rio dos Camarões</strong>."],
  exo: "<p>Construis un tableau à trois colonnes (arts, sciences, religion) avec deux personnages et une œuvre ou une date pour chacun. <em>(Arts : Vinci, La Joconde ; Michel-Ange, chapelle Sixtine. Sciences : Copernic, 1543 ; Vésale. Religion : Luther, 1517 ; Calvin.)</em></p>",
  quiz: [
    { q: "La Renaissance est née en :", r: ["Italie", "Angleterre", "Espagne", "Allemagne"], b: 0, e: "Florence, Rome et Venise en sont les grands foyers." },
    { q: "L'imprimerie à caractères mobiles est mise au point par :", r: ["Copernic", "Gutenberg", "Érasme", "Luther"], b: 1, e: "À Mayence, Bible vers 1455." },
    { q: "<em>Éloge de la folie</em> est d'un humaniste :", r: ["Rabelais", "Montaigne", "Érasme", "Thomas More"], b: 2, e: "Érasme, 1511." },
    { q: "Copernic affirme que :", r: ["la Terre est plate", "le Soleil tourne autour de la Terre", "la Lune est une planète", "la Terre tourne autour du Soleil"], b: 3, e: "L'héliocentrisme, 1543." },
    { q: "La Réforme protestante commence en :", r: ["1517", "1492", "1453", "1545"], b: 0, e: "Martin Luther et les 95 thèses." },
    { q: "Christophe Colomb atteint l'Amérique en :", r: ["1488", "1492", "1498", "1522"], b: 1, e: "Au service des rois d'Espagne." },
    { q: "Le nom « Cameroun » vient de :", r: ["un roi douala", "un fleuve du Nord", "Rio dos Camarões, la rivière des crevettes", "un mot allemand"], b: 2, e: "Nom donné par les Portugais à l'estuaire du Wouri." },
    { q: "La prise de Constantinople par les Ottomans date de :", r: ["1517", "1492", "1498", "1453"], b: 3, e: "Elle pousse les Européens à chercher d'autres routes vers l'Asie." },
    { q: "Une conséquence dramatique des grandes découvertes pour l'Afrique est :", r: ["la traite atlantique", "l'imprimerie", "l'humanisme", "la Contre-Réforme"], b: 0, e: "Déportation de millions d'Africains vers l'Amérique." },
    { q: "La caravelle, la boussole et l'astrolabe sont :", r: ["des œuvres d'art", "des progrès techniques de navigation", "des livres humanistes", "des religions"], b: 1, e: "Ils rendent possibles les voyages au long cours." }
  ],
  apc: { module: "Histoire de Première", famille: "Citoyenneté", agir: "Expliquer les transformations de l'Europe et leurs effets sur l'Afrique", situation: "Un guide du musée maritime de Douala prépare une visite sur l'origine du nom du Cameroun.", tache: "Rédiger un texte qui explique le nom et les deux faces des contacts avec les Portugais." }
};
VRT_L("1re-a-histoire-renaissance", Object.assign({ c: "1re A" }, VRT_1RE_HIST_RENAISSANCE));
VRT_L("1re-c-histoire-renaissance", Object.assign({ c: "1re C" }, VRT_1RE_HIST_RENAISSANCE));
VRT_L("1re-d-histoire-renaissance", Object.assign({ c: "1re D" }, VRT_1RE_HIST_RENAISSANCE));

/* ══════════════════════ Géographie — 1re A ══════════════════════ */

VRT_L("1re-a-geo-croissance-demographique", {
  c: "1re A", m: "geo", cle: "La croissance démographique", titre: "La croissance démographique dans le monde", duree: 25,
  accroche: "Huit milliards d'humains, mais des rythmes de croissance très différents.",
  intro: "La population mondiale a dépassé 8 milliards en novembre 2022. Elle était d'un milliard vers 1800. Cette croissance n'a pas été régulière et elle n'est pas la même partout : l'Afrique subsaharienne, dont le Cameroun, connaît aujourd'hui la croissance la plus rapide du monde.",
  objectifs: ["calculer et interpréter les indicateurs démographiques", "expliquer la transition démographique", "comparer la croissance des pays développés et des pays en développement"],
  parties: [
    { t: "Les indicateurs démographiques", html:
      "<div class='def'><b>Définitions</b><strong>Taux de natalité</strong> (TN) = naissances ÷ population × 1 000 (en ‰). <strong>Taux de mortalité</strong> (TM) = décès ÷ population × 1 000. <strong>Taux d'accroissement naturel</strong> (TAN) = TN − TM, exprimé en ‰ ou en %. <strong>Indice synthétique de fécondité</strong> (ISF) : nombre moyen d'enfants par femme.</div>" +
      "<div class='ex'><b>Exemple</b>Une ville de 200 000 habitants enregistre 7 000 naissances et 1 600 décès en un an. TN = 7 000 ÷ 200 000 × 1 000 = 35 ‰ ; TM = 8 ‰ ; TAN = 27 ‰ = 2,7 % par an.</div>" +
      "<div class='astuce'><b>Astuce</b>Temps de doublement approximatif : 70 ÷ taux en %. À 2,7 % par an, la population double en 26 ans environ.</div>",
      retenir: "TAN = TN − TM ; doublement ≈ 70 ÷ taux en %." },
    { t: "La transition démographique", html:
      "<div class='def'><b>Définition</b>La <strong>transition démographique</strong> est le passage d'un régime à natalité et mortalité <strong>élevées</strong> à un régime où les deux sont <strong>faibles</strong>.</div>" +
      "<ol><li><strong>Régime traditionnel</strong> : TN et TM élevés, croissance faible.</li><li><strong>Phase 1</strong> : la mortalité baisse (vaccins, hygiène, alimentation), la natalité reste forte : <strong>croissance très rapide</strong>.</li><li><strong>Phase 2</strong> : la natalité baisse à son tour (scolarisation des filles, urbanisation, contraception) : la croissance ralentit.</li><li><strong>Régime moderne</strong> : TN et TM faibles, croissance faible, vieillissement.</li></ol>" +
      "<div class='ex'><b>Où en est-on ?</b>L'Europe a achevé sa transition. Le Cameroun est entre la phase 1 et la phase 2 : mortalité en baisse, fécondité encore élevée (près de 5 enfants par femme selon l'enquête démographique et de santé de 2018), croissance d'environ 2,6 % par an.</div>",
      retenir: "Mortalité qui baisse d'abord, natalité ensuite : entre les deux, une explosion démographique." },
    { t: "Une croissance inégale et ses enjeux", html:
      "<ul><li><strong>Pays développés</strong> : croissance faible ou nulle, vieillissement (Japon, Europe), parfois déclin.</li><li><strong>Pays en développement</strong> : population jeune ; en Afrique subsaharienne, plus de 40 % des habitants ont moins de 15 ans.</li></ul>" +
      "<div class='attention'><b>Enjeux pour le Cameroun</b>Besoins massifs en écoles, en emplois, en soins et en logements ; pression sur les terres et les forêts ; mais aussi un atout, le <strong>dividende démographique</strong>, si les jeunes sont formés et employés.</div>" +
      "<div class='savais'><b>Le savais-tu ?</b>Selon les projections de l'ONU, plus d'un humain sur quatre sera africain en 2050.</div>",
      retenir: "Vieillissement au Nord, jeunesse au Sud ; la croissance rapide est un défi et une chance." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Pendant la première phase de la transition démographique :</p><ol type='a'><li>la natalité baisse, la mortalité reste forte</li><li>la mortalité baisse, la natalité reste forte</li><li>les deux sont faibles</li><li>la population diminue</li></ol><details><summary>Voir la réponse</summary><p><strong>La mortalité baisse, la natalité reste forte</strong> : la croissance est très rapide.</p></details><p><strong>Exercice.</strong> Un pays a un TN de 12 ‰ et un TM de 10 ‰. Calcule le TAN et commente.</p><details><summary>Voir la réponse</summary><p>TAN = 2 ‰ = 0,2 % : croissance très faible, typique d'un pays ayant achevé sa transition.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> La commune de Mbouda compte 100 000 habitants. En 2025, on y a enregistré 3 800 naissances et 900 décès. Le maire veut savoir combien de places d'école primaire prévoir et si la population aura doublé en 2050.</p><p><strong>Tâche 1.</strong> Calcule TN, TM et TAN. <strong>Tâche 2.</strong> Estime le temps de doublement et propose deux mesures au maire.</p><details><summary>Voir une réponse attendue</summary><p>TN = 38 ‰ ; TM = 9 ‰ ; TAN = 29 ‰ = 2,9 % par an. Doublement ≈ 70 ÷ 2,9 ≈ 24 ans : la population atteindrait environ 200 000 habitants vers 2049, si le rythme se maintient. Mesures : construire des salles de classe et recruter des enseignants chaque année (environ 3 800 enfants de plus par génération) ; développer la formation professionnelle et les centres de santé maternelle, pour transformer cette jeunesse en atout.</p></details></div>",
      retenir: "Savoir-être mobilisé : sens de l'anticipation et de l'intérêt général." }
  ],
  revision: ["TN, TM en ‰ ; <strong>TAN = TN − TM</strong> ; ISF : enfants par femme.", "Doublement ≈ <strong>70 ÷ taux en %</strong>.", "<strong>Transition démographique</strong> : mortalité puis natalité baissent.", "Cameroun : croissance ≈ 2,6 % par an, ISF proche de 5.", "Enjeux : écoles, emplois, santé ; dividende démographique."],
  exo: "<p>Un pays de 30 millions d'habitants a un TN de 34 ‰ et un TM de 8 ‰. Calcule le nombre de naissances et de décès en un an, puis l'accroissement naturel. <em>(Réponse : 1 020 000 naissances ; 240 000 décès ; + 780 000 habitants, soit 2,6 %.)</em></p>",
  quiz: [
    { q: "La population mondiale a dépassé 8 milliards en :", r: ["2022", "2000", "1990", "2030"], b: 0, e: "En novembre 2022 selon l'ONU." },
    { q: "Le taux d'accroissement naturel se calcule par :", r: ["TN + TM", "TN − TM", "TM − TN", "TN × TM"], b: 1, e: "Naissances moins décès, rapportés à la population." },
    { q: "Un taux de natalité s'exprime en :", r: ["%", "km²", "‰", "habitants"], b: 2, e: "Pour mille habitants." },
    { q: "L'ISF désigne :", r: ["le taux de mortalité infantile", "l'espérance de vie", "la densité", "le nombre moyen d'enfants par femme"], b: 3, e: "Indice synthétique de fécondité." },
    { q: "À 3,5 % par an, une population double en environ :", r: ["20 ans", "35 ans", "70 ans", "10 ans"], b: 0, e: "70 ÷ 3,5 = 20." },
    { q: "Dans le régime démographique moderne :", r: ["TN et TM sont élevés", "TN et TM sont faibles", "seule la mortalité est forte", "la population explose"], b: 1, e: "Fin de la transition : croissance faible." },
    { q: "Une cause de la baisse de la natalité est :", r: ["la baisse de la scolarisation", "la ruralisation", "la scolarisation des filles", "les épidémies"], b: 2, e: "Mariage plus tardif, accès à l'information et à la contraception." },
    { q: "La phase de croissance la plus rapide correspond à :", r: ["le régime moderne", "le vieillissement", "le régime traditionnel", "la baisse de la mortalité avec une natalité forte"], b: 3, e: "Phase 1 de la transition." },
    { q: "Le « dividende démographique » désigne :", r: ["l'avantage d'une population active nombreuse et formée", "une prime de naissance", "un impôt", "le vieillissement"], b: 0, e: "Il suppose formation et emplois." },
    { q: "Le continent à la croissance la plus rapide aujourd'hui est :", r: ["l'Europe", "l'Afrique", "l'Amérique du Nord", "l'Océanie"], b: 1, e: "Surtout l'Afrique subsaharienne." }
  ],
  apc: { module: "Géographie de Première A", famille: "Environnement, santé et bien-être", agir: "Utiliser les indicateurs démographiques pour anticiper les besoins d'une population", situation: "Le maire de Mbouda veut prévoir les places d'école et l'évolution de la population.", tache: "Calculer les taux, estimer le doublement et proposer des mesures." }
});

/* Leçons des classes d'examen, deuxième série — 1re et Tle (12/11/2026).
   Demande de Jacques : « Continue les leçons » (classes d'examen en priorité).
   Leçons suivantes de la progression MINESEC 2026-2027 en Français, Philosophie, Histoire
   et Géographie, après 07-lecons-examen.js. Même format, même règle de partage entre séries. */

/* ══════════════════════ Philosophie — Tle C et Tle D ══════════════════════ */

var VRT_TCD_PHILO_VIVRE = {
  m: "philo", cle: "Des nouvelles thématiques : le vivre-ensemble", titre: "Philosophie africaine : le vivre-ensemble et la gouvernance", duree: 25,
  accroche: "Plus de 250 peuples, deux langues officielles, un seul pays : vivre ensemble se pense.",
  intro: "Les philosophes africains d'aujourd'hui ne se demandent plus seulement s'il existe une philosophie africaine : ils réfléchissent aux problèmes concrets du continent. Comment des peuples différents peuvent-ils former une nation ? Comment gouverner de façon juste et efficace ? Ce sont les thèmes du vivre-ensemble et de la gouvernance.",
  objectifs: ["définir le vivre-ensemble et la bonne gouvernance", "présenter des réflexions africaines sur ces thèmes", "appliquer ces notions à des situations camerounaises"],
  parties: [
    { t: "Le vivre-ensemble", html:
      "<div class='def'><b>Définition</b>Le <strong>vivre-ensemble</strong> désigne la capacité de personnes et de groupes différents (ethnies, langues, religions, régions) à partager un même espace dans la paix, le respect mutuel et la solidarité, en reconnaissant leurs différences sans en faire des motifs d'exclusion.</div>" +
      "<ul><li>La pensée <strong>ubuntu</strong> d'Afrique australe, popularisée par Desmond Tutu : « Je suis parce que nous sommes » ; l'homme n'existe pleinement qu'en relation.</li><li><strong>Achille Mbembe</strong>, philosophe camerounais, analyse dans <em>Politique de l'inimitié</em> (2016) la tentation de définir son identité contre un ennemi.</li><li>Kant parlait déjà de l'« insociable sociabilité » des hommes : nous avons besoin des autres, mais nous leur résistons.</li></ul>" +
      "<div class='savais'><b>Le savais-tu ?</b>Le Cameroun a créé en 2017 une Commission nationale pour la promotion du bilinguisme et du multiculturalisme, chargée de veiller au vivre-ensemble.</div>",
      retenir: "Vivre-ensemble : reconnaître les différences sans exclure ; ubuntu : « Je suis parce que nous sommes »." },
    { t: "La gouvernance", html:
      "<div class='def'><b>Définition</b>La <strong>gouvernance</strong> est la manière dont le pouvoir est exercé pour gérer les affaires publiques. La <strong>bonne gouvernance</strong> repose sur la <strong>transparence</strong>, la <strong>redevabilité</strong> (rendre des comptes), la <strong>participation</strong> des citoyens, l'<strong>État de droit</strong> et la lutte contre la <strong>corruption</strong>.</div>" +
      "<ul><li><strong>Lucien Ayissi</strong>, philosophe camerounais (<em>Corruption et gouvernance</em>, 2008), montre que la corruption détruit la confiance et le bien commun.</li><li><strong>Fabien Eboussi Boulaga</strong> (<em>Les Conférences nationales en Afrique noire</em>, 1993) voit dans le dialogue public un moyen de refonder l'État.</li><li><strong>Ebénézer Njoh-Mouelle</strong> lie le développement à l'excellence et à la responsabilité de chacun.</li></ul>",
      retenir: "Bonne gouvernance : transparence, redevabilité, participation, État de droit, lutte contre la corruption." },
    { t: "Le rôle du philosophe", html:
      "<p>Le philosophe ne gouverne pas, mais il <strong>éclaire</strong> : il clarifie les notions (justice, nation, pouvoir), critique les discours qui divisent ou qui masquent les abus, et propose des principes.</p>" +
      "<div class='ex'><b>Exemple</b>Face à un message tribaliste sur les réseaux sociaux, le philosophe demande : sur quel critère juge-t-on une personne ? Ce critère est-il juste ? Que deviendrait la société si chacun l'appliquait ?</div>" +
      "<div class='attention'><b>Attention</b>Le vivre-ensemble n'est pas l'effacement des différences : une unité imposée par la force n'est pas une paix véritable.</div>",
      retenir: "Le philosophe clarifie, critique et propose : il met la raison au service de la cité." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> La redevabilité signifie que les dirigeants doivent :</p><ol type='a'><li>être riches</li><li>rendre compte de leur gestion</li><li>parler plusieurs langues</li><li>rester au pouvoir</li></ol><details><summary>Voir la réponse</summary><p><strong>Rendre compte de leur gestion</strong> aux citoyens et aux institutions de contrôle.</p></details><p><strong>Exercice.</strong> Explique en trois lignes la formule ubuntu « Je suis parce que nous sommes ».</p><details><summary>Voir la réponse</summary><p>L'identité d'une personne se construit dans ses relations avec les autres ; nuire à la communauté, c'est se nuire à soi-même. La solidarité fait partie de l'humanité de chacun.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Dans ton quartier à Douala, un forage financé par la mairie est en panne depuis six mois. Des habitants accusent « ceux de l'autre communauté » d'avoir détourné l'argent ; la tension monte.</p><p><strong>Tâche.</strong> En une quinzaine de lignes, analyse la situation à partir des notions de vivre-ensemble et de gouvernance, puis propose une démarche pacifique.</p><details><summary>Voir une réponse attendue</summary><p>Le problème est d'abord de gouvernance : on ignore comment l'argent du forage a été utilisé (manque de transparence et de redevabilité). L'accusation contre une communauté transforme ce problème en conflit identitaire et menace le vivre-ensemble, comme le montre Mbembe à propos de la « politique de l'inimitié ». Démarche : réunir les habitants de toutes les communautés, demander par écrit à la mairie le budget et l'état des travaux, saisir si besoin les autorités de contrôle, et désigner un comité mixte de suivi. On remplace le soupçon par l'information et la participation.</p></details></div>",
      retenir: "Savoir-être mobilisé : tolérance, sens du bien commun et esprit critique." }
  ],
  revision: ["<strong>Vivre-ensemble</strong> : différences reconnues, paix, respect, solidarité.", "<strong>Ubuntu</strong> : « Je suis parce que nous sommes » (Desmond Tutu).", "<strong>Bonne gouvernance</strong> : transparence, redevabilité, participation, État de droit.", "Camerounais : Mbembe (2016), Ayissi (2008), Eboussi Boulaga (1993), Njoh-Mouelle.", "Le philosophe clarifie, critique, propose."],
  exo: "<p>Donne deux exemples concrets de mauvaise gouvernance et, pour chacun, une solution fondée sur la transparence ou la participation. <em>(Ex. : marché public attribué sans appel d'offres → publication des appels d'offres ; budget communal secret → réunion publique annuelle de présentation des comptes.)</em></p>",
  quiz: [
    { q: "« Je suis parce que nous sommes » résume :", r: ["l'ubuntu", "l'ethnophilosophie", "le rationalisme", "la négritude"], b: 0, e: "Pensée d'Afrique australe popularisée par Desmond Tutu." },
    { q: "<em>Politique de l'inimitié</em> est de :", r: ["Towa", "Achille Mbembe", "Hountondji", "Senghor"], b: 1, e: "Philosophe camerounais, 2016." },
    { q: "La transparence dans la gouvernance consiste à :", r: ["cacher les budgets", "nommer ses proches", "rendre publiques les décisions et les comptes", "supprimer les élections"], b: 2, e: "Les citoyens peuvent ainsi contrôler." },
    { q: "Lucien Ayissi a réfléchi surtout sur :", r: ["la poésie", "la négritude", "la physique", "la corruption et la gouvernance"], b: 3, e: "Corruption et gouvernance, 2008." },
    { q: "Le vivre-ensemble suppose :", r: ["le respect des différences", "l'effacement des cultures", "une seule langue", "la séparation des communautés"], b: 0, e: "Unité dans la diversité, sans exclusion." },
    { q: "L'« insociable sociabilité » est une expression de :", r: ["Mbembe", "Kant", "Platon", "Tutu"], b: 1, e: "Les hommes ont besoin des autres mais leur résistent." },
    { q: "L'État de droit signifie que :", r: ["le chef est au-dessus des lois", "chacun fait sa loi", "tous, gouvernants compris, sont soumis à la loi", "il n'y a pas de tribunaux"], b: 2, e: "La loi s'impose à tous." },
    { q: "La Commission pour le bilinguisme et le multiculturalisme a été créée en :", r: ["1960", "1972", "1990", "2017"], b: 3, e: "Pour promouvoir le vivre-ensemble." },
    { q: "Face à un discours tribaliste, le philosophe :", r: ["examine le critère de jugement et sa justice", "le partage", "l'ignore", "le soutient"], b: 0, e: "Il exerce l'esprit critique." },
    { q: "<em>Les Conférences nationales en Afrique noire</em> est d'un philosophe :", r: ["sénégalais", "camerounais", "kényan", "béninois"], b: 1, e: "Fabien Eboussi Boulaga, 1993." }
  ],
  apc: { module: "Philosophie de Terminale C et D", famille: "Citoyenneté", agir: "Mobiliser les notions de vivre-ensemble et de gouvernance pour apaiser un conflit", situation: "Un forage en panne dans un quartier de Douala fait naître des accusations entre communautés.", tache: "Analyser la situation et proposer une démarche pacifique." }
};
VRT_L("tle-c-philo-vivre-ensemble", Object.assign({ c: "Tle C" }, VRT_TCD_PHILO_VIVRE));
VRT_L("tle-d-philo-vivre-ensemble", Object.assign({ c: "Tle D" }, VRT_TCD_PHILO_VIVRE));

/* ══════════════════════ Français — Tle C et Tle D ══════════════════════ */

var VRT_TCD_FR_REFERENT = {
  m: "francais", cle: "Le référent et ses substituts", titre: "Le référent et ses substituts", duree: 20,
  accroche: "Dire « il », « ce dernier » ou « le vieil homme » : trois façons de ne pas se répéter.",
  intro: "Un texte parle sans cesse des mêmes êtres et des mêmes choses, mais sans répéter leur nom à chaque ligne. Il les reprend par des pronoms, des synonymes, des périphrases. Savoir repérer ces reprises, c'est suivre le fil d'un texte ; savoir les employer, c'est écrire sans lourdeur ni ambiguïté.",
  objectifs: ["définir le référent et les substituts", "distinguer substituts grammaticaux et lexicaux", "repérer une chaîne de référence et éviter l'ambiguïté"],
  parties: [
    { t: "Le référent", html:
      "<div class='def'><b>Définition</b>Le <strong>référent</strong> est la réalité (personne, objet, idée) que désigne un mot ou un groupe de mots dans un texte. Les mots qui reprennent ce référent sans répéter le même terme sont ses <strong>substituts</strong>.</div>" +
      "<div class='ex'><b>Exemple</b>« <u>Meka</u> attendait sa médaille. <u>Le vieil homme</u> avait donné ses terres. <u>Il</u> était fier. » Le référent est le personnage de Meka ; « le vieil homme » et « il » sont des substituts.</div>",
      retenir: "Référent : ce dont on parle ; substituts : les mots qui le reprennent." },
    { t: "Les deux familles de substituts", html:
      "<div class='def'><b>Substituts grammaticaux</b>Les <strong>pronoms</strong> : personnels (il, le, lui), démonstratifs (celui-ci, ce dernier), possessifs (le sien), relatifs (qui, que, dont), indéfinis (chacun).</div>" +
      "<div class='def'><b>Substituts lexicaux</b><strong>Synonyme</strong> (la voiture → le véhicule) ; <strong>hyperonyme</strong>, terme plus général (le manguier → l'arbre) ; <strong>périphrase</strong> (Yaoundé → la ville aux sept collines) ; <strong>reprise par un déterminant démonstratif</strong> (un orage → cet orage) ; <strong>terme appréciatif</strong> (le ministre → ce grand serviteur de l'État).</div>" +
      "<div class='astuce'><b>Astuce</b>Les substituts lexicaux apportent souvent une <strong>information</strong> ou un <strong>jugement</strong> : « ce menteur » ne reprend pas seulement le personnage, il le juge.</div>",
      retenir: "Grammaticaux : pronoms ; lexicaux : synonyme, hyperonyme, périphrase, démonstratif, terme appréciatif." },
    { t: "Anaphore, cataphore et ambiguïté", html:
      "<ul><li><strong>Reprise anaphorique</strong> : le substitut vient <strong>après</strong> le référent (« Ndongo est arrivé ; il était épuisé »).</li><li><strong>Reprise cataphorique</strong> : le substitut vient <strong>avant</strong> (« Il était épuisé, Ndongo, quand il est arrivé »).</li><li><strong>Chaîne de référence</strong> : l'ensemble des expressions qui désignent le même référent tout au long d'un texte.</li></ul>" +
      "<div class='attention'><b>Ambiguïté</b>« Le père d'Ali a parlé au directeur ; il était en colère. » Qui est en colère ? Il faut remplacer « il » par un substitut précis : « ce dernier » (le directeur) ou « le père d'Ali ».</div>",
      retenir: "Anaphore : après ; cataphore : avant ; un pronom doit renvoyer à un seul référent possible." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Dans « Le manguier de la cour est vieux ; cet arbre donne pourtant beaucoup », « cet arbre » est :</p><ol type='a'><li>une périphrase</li><li>un pronom</li><li>un hyperonyme précédé d'un démonstratif</li><li>une cataphore</li></ol><details><summary>Voir la réponse</summary><p><strong>Un hyperonyme</strong> (arbre, plus général que manguier) précédé du démonstratif « cet ».</p></details><p><strong>Exercice.</strong> Relève la chaîne de référence : « Douala s'éveille. La capitale économique bruisse déjà ; elle ne dort jamais vraiment. »</p><details><summary>Voir la réponse</summary><p>Douala → la capitale économique (périphrase) → elle (pronom personnel).</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Pour le journal du lycée de Kumba, un élève a écrit : « Le proviseur a reçu le délégué. Le proviseur a félicité le délégué. Le délégué a remercié le proviseur et il lui a promis qu'il ferait mieux. »</p><p><strong>Tâche.</strong> Explique les deux défauts de ce passage, puis réécris-le avec des substituts variés et sans ambiguïté.</p><details><summary>Voir une réponse attendue</summary><p>Défauts : répétitions lourdes des noms ; ambiguïté de « il » et « lui » dans la dernière phrase (on ne sait pas qui promet ni qui fera mieux). Réécriture : « Le proviseur a reçu le délégué de la classe et l'a félicité. Touché, le jeune homme a remercié le chef d'établissement et lui a promis de redoubler d'efforts. »</p></details></div>",
      retenir: "Savoir-être mobilisé : souci de clarté envers le lecteur." }
  ],
  revision: ["<strong>Référent</strong> : la réalité désignée.", "Substituts <strong>grammaticaux</strong> : pronoms.", "Substituts <strong>lexicaux</strong> : synonyme, hyperonyme, périphrase, démonstratif, terme appréciatif.", "<strong>Anaphore</strong> (après), <strong>cataphore</strong> (avant), <strong>chaîne de référence</strong>.", "Un pronom = un seul référent possible."],
  exo: "<p>Trouve une périphrase pour : le lion ; le Cameroun ; le soleil ; Yaoundé. <em>(Le roi des animaux ; l'Afrique en miniature ; l'astre du jour ; la ville aux sept collines.)</em></p>",
  quiz: [
    { q: "Le référent est :", r: ["la réalité désignée par les mots", "un pronom", "le titre du texte", "l'auteur"], b: 0, e: "Ce dont on parle." },
    { q: "« La ville aux sept collines » pour Yaoundé est :", r: ["un pronom", "une périphrase", "un hyperonyme", "une cataphore"], b: 1, e: "Une expression qui désigne par une caractéristique." },
    { q: "Dans « le manguier → l'arbre », « arbre » est :", r: ["un synonyme", "un antonyme", "un hyperonyme", "un pronom"], b: 2, e: "Un terme plus général." },
    { q: "Les pronoms sont des substituts :", r: ["lexicaux", "appréciatifs", "périphrastiques", "grammaticaux"], b: 3, e: "Ils appartiennent à la grammaire, non au lexique." },
    { q: "Dans une reprise anaphorique, le substitut est placé :", r: ["après le référent", "avant le référent", "dans le titre", "en note"], b: 0, e: "Il renvoie à ce qui précède." },
    { q: "« Il était épuisé, Ndongo » est une reprise :", r: ["anaphorique", "cataphorique", "lexicale", "inutile"], b: 1, e: "Le pronom annonce le nom qui suit." },
    { q: "« Ce menteur » pour reprendre un personnage ajoute :", r: ["une date", "un lieu", "un jugement", "une question"], b: 2, e: "Le substitut appréciatif évalue le référent." },
    { q: "Une ambiguïté apparaît quand un pronom :", r: ["est au pluriel", "est en début de phrase", "est un relatif", "peut renvoyer à deux référents"], b: 3, e: "Le lecteur ne sait pas qui est désigné." },
    { q: "« Ce dernier » renvoie :", r: ["au dernier nom cité", "au premier nom cité", "à l'auteur", "au lecteur"], b: 0, e: "Il lève l'ambiguïté entre deux personnes." },
    { q: "L'ensemble des expressions qui désignent un même référent forme :", r: ["une périphrase", "une chaîne de référence", "une cataphore", "un champ lexical"], b: 1, e: "Elle assure la cohérence du texte." }
  ],
  apc: { module: "Français de Terminale C et D", famille: "Vie sociale et culturelle", agir: "Employer des substituts variés pour écrire un texte clair et cohérent", situation: "Un article du journal du lycée de Kumba est plein de répétitions et d'ambiguïtés.", tache: "Identifier les défauts et réécrire le passage." }
};
VRT_L("tle-c-francais-referent", Object.assign({ c: "Tle C" }, VRT_TCD_FR_REFERENT));
VRT_L("tle-d-francais-referent", Object.assign({ c: "Tle D" }, VRT_TCD_FR_REFERENT));

var VRT_TCD_FR_SUBJONCTIF = {
  m: "francais", cle: "Le mode subjonctif", titre: "La valeur des modes : le subjonctif", duree: 20,
  accroche: "« Il faut que tu viennes » : le subjonctif dit ce qui n'est pas encore réel.",
  intro: "L'indicatif présente les faits comme réels ; le subjonctif les présente comme envisagés, souhaités, redoutés ou douteux. Ce mode, que beaucoup évitent ou emploient mal, est pourtant indispensable pour exprimer la volonté, le sentiment ou le but, à l'écrit comme à l'oral.",
  objectifs: ["identifier les valeurs du subjonctif", "employer le subjonctif après les verbes et conjonctions qui l'exigent", "éviter les erreurs courantes (« après que », « bien que »)"],
  parties: [
    { t: "Le subjonctif : un mode du possible", html:
      "<div class='def'><b>Définition</b>Le <strong>subjonctif</strong> présente l'action comme <strong>envisagée</strong> par la pensée, et non comme un fait certain. Il a quatre temps : présent (<em>qu'il vienne</em>), passé (<em>qu'il soit venu</em>), imparfait et plus-que-parfait, ces deux derniers réservés à la langue littéraire (<em>qu'il vînt, qu'il fût venu</em>).</div>" +
      "<div class='ex'><b>Comparaison</b>« Je sais qu'il <u>vient</u> » (fait certain : indicatif) / « Je veux qu'il <u>vienne</u> » (action souhaitée : subjonctif).</div>",
      retenir: "Indicatif : le réel ; subjonctif : l'envisagé (volonté, sentiment, doute, but)." },
    { t: "Les emplois du subjonctif", html:
      "<ul><li><strong>Dans une proposition indépendante</strong> : ordre à la 3ᵉ personne (« Qu'il sorte ! »), souhait (« Vive le Cameroun ! », « Que Dieu vous garde ! »).</li><li><strong>Après les verbes de volonté, de souhait, d'obligation</strong> : vouloir, exiger, souhaiter, il faut que.</li><li><strong>Après les verbes de sentiment</strong> : craindre, regretter, être content que.</li><li><strong>Après les verbes de doute ou d'opinion à la forme négative</strong> : douter que, je ne pense pas que.</li><li><strong>Après certaines conjonctions</strong> : pour que, afin que (but) ; bien que, quoique (concession) ; avant que, jusqu'à ce que (temps) ; à condition que, pourvu que, à moins que (condition) ; sans que.</li><li><strong>Dans une relative</strong> exprimant une qualité recherchée : « Je cherche un logement qui <u>soit</u> proche du lycée. »</li></ul>",
      retenir: "Volonté, sentiment, doute, but, concession, condition, antériorité (avant que) : subjonctif." },
    { t: "Les pièges", html:
      "<div class='attention'><b>« Après que » + indicatif</b>On écrit « après qu'il <strong>est</strong> parti » (fait accompli, donc réel), et non « après qu'il soit parti ». À l'inverse : « avant qu'il <strong>parte</strong> » (subjonctif).</div>" +
      "<div class='attention'><b>Formes à ne pas confondre</b>« qu'il <strong>croie</strong> » (subjonctif de croire) ≠ « qu'il croit » ; « que nous <strong>soyons</strong> » (et non « soyions ») ; « que vous <strong>ayez</strong> » (et non « ayiez »).</div>" +
      "<div class='astuce'><b>Astuce</b>Pour trouver le subjonctif présent, remplace par « il faut que… » : il faut que je <em>fasse</em>, que tu <em>ailles</em>, qu'il <em>puisse</em>, que nous <em>sachions</em>.</div>",
      retenir: "Après que + indicatif ; avant que + subjonctif ; soyons, ayez sans « i »." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Quelle phrase est correcte ?</p><ol type='a'><li>Bien qu'il est malade, il travaille.</li><li>Après qu'il soit parti, nous avons mangé.</li><li>Bien qu'il soit malade, il travaille.</li><li>Il faut que tu vas au marché.</li></ol><details><summary>Voir la réponse</summary><p><strong>c</strong> : « bien que » exige le subjonctif.</p></details><p><strong>Exercice.</strong> Donne la valeur du subjonctif : a) « Que personne ne bouge ! » b) « Je crains qu'il ne pleuve. » c) « Parle fort pour qu'on t'entende. »</p><details><summary>Voir la réponse</summary><p>a) Ordre ; b) sentiment (crainte) ; c) but.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Le bureau du foyer culturel de ton lycée à Ebolowa doit écrire une lettre au proviseur pour demander une salle de répétition. Le brouillon contient : « Nous voulons que vous nous donnez une salle avant que la fête arrive. Bien que nous sommes nombreux, il faut que le bruit reste faible. »</p><p><strong>Tâche.</strong> Corrige les erreurs de mode en justifiant, puis rédige la phrase finale de la lettre avec un subjonctif de but.</p><details><summary>Voir une réponse attendue</summary><p>« que vous nous <strong>donniez</strong> » (volonté) ; « avant que la fête arrive » est correct (avant que + subjonctif ; pour ce verbe, le subjonctif présent a la même forme que l'indicatif) ; « bien que nous <strong>soyons</strong> » (concession) ; « que le bruit reste faible » est correct. Phrase finale : « Nous vous serions reconnaissants de nous accorder cette salle afin que la fête de fin de trimestre soit réussie. »</p></details></div>",
      retenir: "Savoir-être mobilisé : correction de la langue dans les écrits officiels." }
  ],
  revision: ["Subjonctif = action <strong>envisagée</strong> ; indicatif = action réelle.", "Volonté, sentiment, doute : <strong>vouloir que, craindre que, douter que</strong>.", "Conjonctions : pour que, bien que, avant que, à condition que, sans que.", "<strong>Après que + indicatif</strong>.", "Soyons, ayez, qu'il croie, qu'il aille."],
  exo: "<p>Mets le verbe au mode qui convient : « Il faut que nous (être) à l'heure. Je pense qu'il (venir). Je ne pense pas qu'il (venir). Après qu'il (finir), il sortira. » <em>(soyons ; viendra ou vient ; vienne ; aura fini.)</em></p>",
  quiz: [
    { q: "Le subjonctif présente l'action comme :", r: ["envisagée", "certaine", "passée", "terminée"], b: 0, e: "Souhaitée, redoutée, douteuse ou visée." },
    { q: "« Il faut que tu … au marché » :", r: ["vas", "ailles", "allais", "iras"], b: 1, e: "Subjonctif présent du verbe aller." },
    { q: "« Après que » est suivi :", r: ["du subjonctif", "de l'infinitif", "de l'indicatif", "de l'impératif"], b: 2, e: "Le fait est accompli, donc réel." },
    { q: "« Bien que » exprime :", r: ["le but", "la cause", "le temps", "la concession"], b: 3, e: "Et il exige le subjonctif." },
    { q: "« Vive le Cameroun ! » est un subjonctif de :", r: ["souhait", "but", "doute", "condition"], b: 0, e: "Emploi en proposition indépendante." },
    { q: "La forme correcte est :", r: ["que nous soyions", "que nous soyons", "que nous sommes", "que nous soyez"], b: 1, e: "Pas de « i » après le « y »." },
    { q: "« Je cherche un élève qui … parler anglais » :", r: ["peut", "pourra", "puisse", "pouvait"], b: 2, e: "Relative exprimant une qualité recherchée." },
    { q: "« Pour que » exprime :", r: ["la cause", "la concession", "l'opposition", "le but"], b: 3, e: "Afin que, pour que + subjonctif." },
    { q: "« Je crains qu'il ne pleuve » : le subjonctif exprime :", r: ["un sentiment", "un ordre", "un fait certain", "une hypothèse passée"], b: 0, e: "La crainte est un sentiment." },
    { q: "Le subjonctif imparfait (« qu'il vînt ») appartient surtout :", r: ["au langage SMS", "à la langue littéraire", "à l'oral familier", "aux recettes"], b: 1, e: "On le rencontre dans les textes classiques." }
  ],
  apc: { module: "Français de Terminale C et D", famille: "Vie sociale et culturelle", agir: "Employer correctement le subjonctif dans un écrit officiel", situation: "Le foyer culturel d'un lycée d'Ebolowa rédige une demande de salle pleine d'erreurs de mode.", tache: "Corriger les erreurs en justifiant et rédiger une phrase de but." }
};
VRT_L("tle-c-francais-subjonctif", Object.assign({ c: "Tle C" }, VRT_TCD_FR_SUBJONCTIF));
VRT_L("tle-d-francais-subjonctif", Object.assign({ c: "Tle D" }, VRT_TCD_FR_SUBJONCTIF));

/* ══════════════════════ Géographie — Tle A, C et D ══════════════════════ */

var VRT_TLE_GEO_GROUPES = {
  m: "geo", cle: "Les grands groupes humains", titre: "Les grands groupes humains du Cameroun", duree: 25,
  accroche: "Plus de 250 ethnies : la diversité humaine est la signature du Cameroun.",
  intro: "La population camerounaise, proche de 29 millions d'habitants, est formée de très nombreux peuples aux langues, aux organisations sociales et aux activités différentes. Les géographes les regroupent en quelques grands ensembles, dont la répartition sur le territoire est très inégale.",
  objectifs: ["identifier les grands groupes humains du Cameroun et leurs régions", "expliquer l'inégale répartition de la population", "montrer que la diversité humaine est un atout et un défi"],
  parties: [
    { t: "Les grands ensembles", html:
      "<ul><li><strong>Les Pygmées</strong> (Baka, Bakola, Bagyéli, Bedzang) : premiers occupants, dans la forêt de l'Est et du Sud ; chasse, pêche et cueillette.</li><li><strong>Les Bantous</strong> : Sud, Centre, Littoral, Est. Beti (Ewondo, Eton, Bulu), Bassa, Douala, Maka, Bakweri… Agriculture de forêt, pêche sur la côte.</li><li><strong>Les semi-Bantous ou peuples des Grassfields</strong> : Ouest et Nord-Ouest. Bamiléké, Bamoun, Tikar… Chefferies organisées, agriculture intensive, commerce.</li><li><strong>Les Soudanais</strong> : Nord et Extrême-Nord. Mafa, Toupouri, Massa, Moundang, Guiziga… Agriculture de mil et de sorgho, élevage.</li><li><strong>Les Peuls (Foulbé)</strong>, arrivés aux XVIIIᵉ-XIXᵉ siècles, éleveurs et islamisés ; les <strong>Arabes Choa</strong> et les <strong>Haoussa</strong> dans le Nord.</li></ul>" +
      "<div class='savais'><b>Le savais-tu ?</b>Le Cameroun compte plus de 250 langues nationales : c'est l'un des pays les plus divers du monde sur le plan linguistique.</div>",
      retenir: "Pygmées, Bantous, semi-Bantous (Grassfields), Soudanais, Peuls et autres peuples du Nord." },
    { t: "Une répartition inégale", html:
      "<p>La densité moyenne dépasse 60 habitants au km², mais elle varie énormément :</p><ul><li><strong>Fortes densités</strong> : hautes terres de l'Ouest (sols volcaniques fertiles, climat sain), Littoral (Douala), monts Mandara et plaines de l'Extrême-Nord.</li><li><strong>Faibles densités</strong> : Est et Sud forestiers, Adamaoua (souvent moins de 20 hab./km²).</li></ul>" +
      "<div class='def'><b>Facteurs</b><strong>Naturels</strong> : fertilité des sols, eau, climat, relief refuge (monts Mandara contre les razzias). <strong>Historiques</strong> : migrations, traite, colonisation (plantations du Sud-Ouest). <strong>Économiques</strong> : villes, ports, emplois (Douala, Yaoundé).</div>",
      retenir: "Ouest, Littoral, Extrême-Nord très peuplés ; Est, Sud et Adamaoua peu peuplés ; facteurs naturels, historiques, économiques." },
    { t: "Une diversité : atout et défi", html:
      "<div class='ex'><b>Atouts</b>Richesse culturelle (danses, cuisines, artisanat, festivals comme le Ngondo des Douala ou le Nguon des Bamoun), complémentarité des activités (éleveurs du Nord, agriculteurs de l'Ouest, commerçants), tourisme.</div>" +
      "<div class='attention'><b>Défis</b>Replis identitaires et tribalisme, conflits fonciers entre agriculteurs et éleveurs, inégalités régionales de développement, migrations vers les villes.</div>" +
      "<p>L'unité nationale repose sur le <strong>bilinguisme</strong> (français et anglais), la promotion des langues et cultures nationales et l'égal accès de tous aux services de l'État.</p>",
      retenir: "Diversité = richesse culturelle et complémentarité, mais risque de replis identitaires : l'unité nationale se construit." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Les Bamiléké et les Bamoun appartiennent au groupe :</p><ol type='a'><li>soudanais</li><li>pygmée</li><li>semi-bantou (Grassfields)</li><li>arabe choa</li></ol><details><summary>Voir la réponse</summary><p><strong>Semi-bantou</strong>, peuples des hautes terres de l'Ouest (Grassfields).</p></details><p><strong>Exercice.</strong> Cite deux régions de forte densité et explique pour chacune un facteur.</p><details><summary>Voir la réponse</summary><p>L'Ouest : sols volcaniques fertiles. Le Littoral : Douala, port et premier pôle d'emplois.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Dans l'Adamaoua, des éleveurs peuls et des agriculteurs s'affrontent régulièrement : les bœufs détruisent des champs, les agriculteurs occupent des couloirs de transhumance. Le sous-préfet te demande, en tant que délégué du conseil des jeunes, des propositions.</p><p><strong>Tâche.</strong> Explique les causes géographiques du conflit et propose trois solutions favorables au vivre-ensemble.</p><details><summary>Voir une réponse attendue</summary><p>Causes : croissance de la population et extension des champs ; troupeaux plus nombreux ; espace partagé sans limites claires ; sécheresses qui poussent les éleveurs plus loin. Solutions : délimiter et matérialiser les couloirs de transhumance et les zones de pâturage avec les deux communautés ; créer un comité mixte de règlement des conflits sous l'autorité du chef traditionnel et du sous-préfet ; développer les cultures fourragères et l'association agriculture-élevage (fumier contre résidus de récolte).</p></details></div>",
      retenir: "Savoir-être mobilisé : tolérance et sens du dialogue." }
  ],
  revision: ["Près de 29 millions d'habitants, plus de 250 ethnies et langues.", "<strong>Pygmées</strong> (forêt), <strong>Bantous</strong> (Sud, Centre, Littoral, Est), <strong>semi-Bantous</strong> (Ouest), <strong>Soudanais</strong> (Nord), <strong>Peuls</strong>.", "Fortes densités : Ouest, Littoral, Extrême-Nord.", "Faibles densités : Est, Sud, Adamaoua.", "Facteurs naturels, historiques, économiques ; unité nationale à construire."],
  exo: "<p>Sur un croquis du Cameroun, colorie les zones de fortes et de faibles densités et indique, par une flèche, deux grands courants de migration vers les villes. <em>(Ex. : Ouest → Douala ; Extrême-Nord → Yaoundé et Douala.)</em></p>",
  quiz: [
    { q: "Les premiers occupants des forêts du Cameroun sont :", r: ["les Pygmées", "les Peuls", "les Bamiléké", "les Arabes Choa"], b: 0, e: "Baka, Bakola, Bagyéli, Bedzang." },
    { q: "Les Beti, Bassa et Douala sont des peuples :", r: ["soudanais", "bantous", "semi-bantous", "peuls"], b: 1, e: "Ils occupent le Sud, le Centre et le Littoral." },
    { q: "Les Peuls sont surtout :", r: ["pêcheurs", "chasseurs", "éleveurs", "planteurs de cacao"], b: 2, e: "Arrivés aux XVIIIᵉ-XIXᵉ siècles, islamisés." },
    { q: "Les Mafa et les Toupouri vivent :", r: ["sur la côte", "dans l'Est forestier", "à l'Ouest", "dans le Nord et l'Extrême-Nord"], b: 3, e: "Groupe soudanais." },
    { q: "Une région de forte densité est :", r: ["l'Ouest", "l'Est", "l'Adamaoua", "le Sud forestier"], b: 0, e: "Sols volcaniques fertiles et climat d'altitude." },
    { q: "Les monts Mandara sont très peuplés notamment parce qu'ils ont servi :", r: ["de port", "de refuge", "de désert", "de plantation"], b: 1, e: "Les populations y échappaient aux razzias." },
    { q: "Le Cameroun compte environ :", r: ["10 langues", "50 langues", "plus de 250 langues", "2 langues"], b: 2, e: "Langues nationales, plus le français et l'anglais officiels." },
    { q: "Le Ngondo est une fête traditionnelle des :", r: ["Bamoun", "Peuls", "Baka", "Douala"], b: 3, e: "Célébrée sur les rives du Wouri." },
    { q: "Un défi de la diversité humaine est :", r: ["le tribalisme", "la richesse culturelle", "le tourisme", "la complémentarité"], b: 0, e: "Le repli identitaire menace l'unité nationale." },
    { q: "Un facteur économique de concentration de la population est :", r: ["la forêt dense", "la présence de villes et d'emplois", "l'altitude", "la sécheresse"], b: 1, e: "Douala et Yaoundé attirent les migrants." }
  ],
  apc: { module: "Géographie de Terminale", famille: "Citoyenneté", agir: "Exploiter la connaissance des groupes humains pour favoriser la paix sociale", situation: "Dans l'Adamaoua, éleveurs et agriculteurs s'affrontent pour l'espace.", tache: "Expliquer les causes du conflit et proposer des solutions." }
};
VRT_L("tle-a-geo-groupes-humains", Object.assign({ c: "Tle A" }, VRT_TLE_GEO_GROUPES));
VRT_L("tle-c-geo-groupes-humains", Object.assign({ c: "Tle C" }, VRT_TLE_GEO_GROUPES));
VRT_L("tle-d-geo-groupes-humains", Object.assign({ c: "Tle D" }, VRT_TLE_GEO_GROUPES));

/* ══════════════════════ Histoire — Tle A ══════════════════════ */

VRT_L("tle-a-histoire-consequences-onu", {
  c: "Tle A", m: "histoire", cle: "Les conséquences de la Deuxième Guerre mondiale et la naissance de l", titre: "Les conséquences de la Deuxième Guerre mondiale et la naissance de l'ONU", duree: 25,
  accroche: "1945 : un monde en ruines, deux superpuissances et une organisation pour la paix.",
  intro: "La Deuxième Guerre mondiale a bouleversé le monde : pertes humaines immenses, destructions, nouvel équilibre des puissances. Pour éviter une nouvelle catastrophe, les vainqueurs créent l'Organisation des Nations unies. Pour le Cameroun, placé sous sa tutelle, 1945 ouvre le chemin de l'indépendance.",
  objectifs: ["présenter les conséquences humaines, matérielles, politiques et morales de la guerre", "décrire la création, les buts et les organes de l'ONU", "expliquer le rôle de l'ONU dans l'évolution du Cameroun"],
  parties: [
    { t: "Un bilan terrible", html:
      "<ul><li><strong>Humain</strong> : plus de 50 millions de morts, dont une majorité de civils ; l'URSS en compte plus de 20 millions ; génocide des Juifs et des Tsiganes ; des millions de réfugiés et de déplacés.</li><li><strong>Matériel</strong> : villes rasées (Varsovie, Dresde, Hiroshima), routes, ponts, usines et terres agricoles détruits ; l'Europe est ruinée.</li><li><strong>Moral</strong> : découverte des camps d'extermination ; les procès de <strong>Nuremberg</strong> (1945-1946) jugent les dirigeants nazis pour <strong>crimes contre l'humanité</strong>, notion nouvelle.</li></ul>",
      retenir: "Plus de 50 millions de morts, une Europe en ruines, la notion de crime contre l'humanité (Nuremberg)." },
    { t: "Un monde nouveau", html:
      "<ul><li><strong>Déclin de l'Europe</strong> et montée de deux <strong>superpuissances</strong> : les États-Unis et l'URSS, qui s'opposent bientôt dans la <strong>guerre froide</strong>.</li><li>Les États-Unis aident à reconstruire l'Europe de l'Ouest (<strong>plan Marshall</strong>, 1947).</li><li><strong>Essor de la décolonisation</strong> : les colonisés ont combattu pour la liberté ; la conférence de <strong>Brazzaville</strong> (1944) promet des réformes ; la Charte de l'ONU proclame le droit des peuples à disposer d'eux-mêmes.</li></ul>" +
      "<div class='savais'><b>Le savais-tu ?</b>Le 10 décembre 1948, l'Assemblée générale de l'ONU adopte à Paris la <strong>Déclaration universelle des droits de l'homme</strong>, réponse directe aux horreurs de la guerre.</div>",
      retenir: "Déclin européen, bipolarisation (États-Unis / URSS), décolonisation, droits de l'homme (1948)." },
    { t: "L'ONU et le Cameroun", html:
      "<div class='def'><b>La naissance de l'ONU</b>La <strong>Charte des Nations unies</strong> est signée à <strong>San Francisco le 26 juin 1945</strong> par 51 États et entre en vigueur le <strong>24 octobre 1945</strong>. Buts : maintenir la paix et la sécurité, développer des relations amicales entre les nations, favoriser la coopération et le respect des droits de l'homme. Siège : New York.</div>" +
      "<p><strong>Organes principaux</strong> : Assemblée générale (tous les États, une voix chacun) ; <strong>Conseil de sécurité</strong> (15 membres dont 5 permanents avec <strong>droit de veto</strong> : États-Unis, Russie, Chine, Royaume-Uni, France) ; Secrétariat général ; Cour internationale de justice (La Haye) ; Conseil économique et social ; Conseil de tutelle.</p>" +
      "<div class='ex'><b>Le Cameroun</b>Ancien mandat de la SDN, le Cameroun devient en 1946 un <strong>territoire sous tutelle de l'ONU</strong>, administré par la France et le Royaume-Uni. Les Camerounais peuvent adresser des pétitions à l'ONU ; Ruben Um Nyobè, leader de l'UPC, plaide à New York pour la réunification et l'indépendance (1952). Le Cameroun devient membre de l'ONU le <strong>20 septembre 1960</strong>.</div>",
      retenir: "Charte : 26 juin 1945 ; ONU : 24 octobre 1945 ; Cameroun sous tutelle (1946), membre en 1960." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Les membres permanents du Conseil de sécurité disposent :</p><ol type='a'><li>du droit de vote seulement</li><li>du droit de veto</li><li>du droit de tutelle</li><li>d'une armée commune</li></ol><details><summary>Voir la réponse</summary><p><strong>Du droit de veto</strong> : un seul « non » bloque une résolution.</p></details><p><strong>Exercice.</strong> Explique en quoi le statut de territoire sous tutelle a favorisé le nationalisme camerounais.</p><details><summary>Voir la réponse</summary><p>La tutelle avait pour but de conduire le territoire vers l'autonomie ou l'indépendance ; les Camerounais pouvaient pétitionner à l'ONU, ce qui a donné une tribune internationale à l'UPC et à Um Nyobè.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Lors de la Journée des Nations unies (24 octobre), ton club UNESCO de Bertoua organise une conférence. Un camarade affirme : « L'ONU ne sert à rien, il y a toujours des guerres. »</p><p><strong>Tâche.</strong> Prépare une intervention de 12 à 15 lignes qui rappelle pourquoi l'ONU a été créée, présente deux de ses réussites et une de ses limites.</p><details><summary>Voir une réponse attendue</summary><p>L'ONU naît en 1945 pour éviter une troisième guerre mondiale après plus de 50 millions de morts. Réussites : aucun conflit mondial depuis 1945 ; elle a accompagné la décolonisation, dont celle du Cameroun, territoire sous tutelle devenu membre en 1960 ; ses agences (UNICEF, OMS, PAM, HCR) vaccinent, nourrissent et protègent des millions de personnes, y compris des réfugiés à l'Est du Cameroun. Limite : le droit de veto des cinq membres permanents bloque souvent le Conseil de sécurité face à certaines guerres. L'ONU n'est pas parfaite, mais sans elle le monde serait plus dangereux.</p></details></div>",
      retenir: "Savoir-être mobilisé : esprit de paix et argumentation nuancée." }
  ],
  revision: ["Bilan : plus de <strong>50 millions de morts</strong>, Europe ruinée, Nuremberg (crime contre l'humanité).", "Monde bipolaire : <strong>États-Unis / URSS</strong> ; plan Marshall (1947).", "Charte de l'ONU : <strong>26 juin 1945</strong> ; ONU : <strong>24 octobre 1945</strong>.", "Conseil de sécurité : 15 membres, 5 permanents avec <strong>veto</strong>.", "Cameroun : tutelle de l'ONU (1946), membre le <strong>20 septembre 1960</strong>."],
  exo: "<p>Complète un tableau à deux colonnes (organe de l'ONU / rôle) pour l'Assemblée générale, le Conseil de sécurité, la Cour internationale de justice et le Conseil de tutelle. <em>(Débattre et voter des recommandations ; maintenir la paix ; juger les différends entre États ; surveiller les territoires sous tutelle.)</em></p>",
  quiz: [
    { q: "La Charte des Nations unies est signée à :", r: ["San Francisco", "Genève", "Paris", "Londres"], b: 0, e: "Le 26 juin 1945." },
    { q: "L'ONU entre officiellement en existence le :", r: ["8 mai 1945", "24 octobre 1945", "10 décembre 1948", "1er janvier 1960"], b: 1, e: "C'est la Journée des Nations unies." },
    { q: "Le Conseil de sécurité compte :", r: ["5 membres", "51 membres", "15 membres", "193 membres"], b: 2, e: "5 permanents et 10 élus pour deux ans." },
    { q: "Les procès de Nuremberg jugent :", r: ["les dirigeants japonais", "les résistants", "les colonisés", "les dirigeants nazis"], b: 3, e: "1945-1946, crimes contre l'humanité." },
    { q: "Le plan Marshall (1947) est une aide :", r: ["américaine à l'Europe", "soviétique à l'Afrique", "française au Cameroun", "de l'ONU à l'Asie"], b: 0, e: "Pour reconstruire l'Europe de l'Ouest." },
    { q: "En 1946, le Cameroun devient :", r: ["indépendant", "un territoire sous tutelle de l'ONU", "une colonie allemande", "membre de l'ONU"], b: 1, e: "Administré par la France et le Royaume-Uni." },
    { q: "Ruben Um Nyobè plaide à l'ONU en :", r: ["1945", "1960", "1952", "1972"], b: 2, e: "Pour la réunification et l'indépendance." },
    { q: "Le Cameroun devient membre de l'ONU le :", r: ["1er janvier 1960", "1er octobre 1961", "20 mai 1972", "20 septembre 1960"], b: 3, e: "Quelques mois après son indépendance." },
    { q: "La Déclaration universelle des droits de l'homme date de :", r: ["1948", "1945", "1919", "1960"], b: 0, e: "Adoptée à Paris le 10 décembre 1948." },
    { q: "Les deux superpuissances de l'après-guerre sont :", r: ["la France et le Royaume-Uni", "les États-Unis et l'URSS", "la Chine et le Japon", "l'Allemagne et l'Italie"], b: 1, e: "Leur rivalité ouvre la guerre froide." }
  ],
  apc: { module: "Histoire de Terminale A", famille: "Citoyenneté", agir: "Évaluer le rôle de l'ONU dans le maintien de la paix et l'émancipation des peuples", situation: "Lors de la Journée des Nations unies à Bertoua, un élève affirme que l'ONU ne sert à rien.", tache: "Préparer une intervention nuancée sur les buts, les réussites et les limites de l'ONU." }
});

/* ══════════════════════ Philosophie — Tle A ══════════════════════ */

VRT_L("tle-a-philo-patristique-medievale", {
  c: "Tle A", m: "philo", cle: "La période patristique et médiévale", titre: "La période patristique et médiévale : Dieu, la foi, la raison", duree: 25,
  accroche: "Faut-il croire pour comprendre, ou comprendre pour croire ?",
  intro: "Du IIᵉ au XVᵉ siècle, la philosophie se met au service de la religion. Les Pères de l'Église, puis les penseurs du Moyen Âge chrétiens, musulmans et juifs, se demandent comment concilier la foi révélée et la raison héritée des Grecs. Deux grands penseurs de cette époque sont nés en Afrique du Nord.",
  objectifs: ["situer la patristique et la scolastique", "présenter les positions de saint Augustin, saint Anselme, Thomas d'Aquin et Averroès", "analyser le problème des rapports entre foi et raison"],
  parties: [
    { t: "La patristique", html:
      "<div class='def'><b>Définition</b>La <strong>patristique</strong> est la pensée des <strong>Pères de l'Église</strong> (IIᵉ-Vᵉ siècles), qui défendent et expliquent la foi chrétienne en utilisant la philosophie grecque, surtout Platon.</div>" +
      "<ul><li><strong>Tertullien</strong> (Carthage, vers 160-220) se méfie de la philosophie : « Qu'y a-t-il de commun entre Athènes et Jérusalem ? »</li><li><strong>Saint Augustin</strong> (354-430), né à Thagaste (dans l'actuelle Algérie), évêque d'Hippone : « Crois pour comprendre » ; la foi éclaire la raison. Œuvres : <em>Les Confessions</em>, <em>La Cité de Dieu</em>.</li></ul>" +
      "<div class='savais'><b>Le savais-tu ?</b>Augustin et Tertullien sont des Africains : l'Afrique du Nord romaine fut l'un des grands foyers de la pensée chrétienne.</div>",
      retenir: "Patristique : les Pères de l'Église ; Augustin : « Crois pour comprendre »." },
    { t: "La scolastique médiévale", html:
      "<div class='def'><b>Définition</b>La <strong>scolastique</strong> est la philosophie enseignée dans les écoles et universités du Moyen Âge (XIᵉ-XVᵉ siècles), qui cherche à <strong>accorder la foi et la raison</strong> par l'argumentation logique.</div>" +
      "<ul><li><strong>Saint Anselme</strong> (1033-1109) : « la foi qui cherche à comprendre » ; il propose une preuve rationnelle de l'existence de Dieu (preuve dite ontologique : Dieu est « ce dont on ne peut rien concevoir de plus grand »).</li><li><strong>Thomas d'Aquin</strong> (1225-1274), <em>Somme théologique</em> : la foi et la raison viennent toutes deux de Dieu et ne peuvent se contredire ; la raison démontre l'existence de Dieu par « cinq voies », la foi révèle ce que la raison ne peut atteindre.</li></ul>",
      retenir: "Scolastique : accorder foi et raison ; Anselme : preuve ontologique ; Thomas d'Aquin : foi et raison ne se contredisent pas." },
    { t: "La philosophie dans le monde musulman", html:
      "<ul><li><strong>Avicenne</strong> (Ibn Sina, 980-1037), médecin et philosophe persan, prolonge Aristote.</li><li><strong>Averroès</strong> (Ibn Rushd, 1126-1198), né à Cordoue, grand commentateur d'Aristote : la philosophie est permise et même obligatoire pour ceux qui en sont capables ; la vérité ne peut contredire la vérité (<em>Discours décisif</em>).</li></ul>" +
      "<div class='attention'><b>Le problème central</b>Que faire si la raison semble contredire un texte sacré ? Augustin donne la priorité à la foi ; Thomas d'Aquin et Averroès cherchent un accord, en interprétant le texte ou en distinguant les domaines.</div>" +
      "<div class='astuce'><b>Pour le bac</b>Ces positions nourrissent les sujets sur « la foi et la raison », « la religion », « la vérité ».</div>",
      retenir: "Avicenne, Averroès : Aristote transmis à l'Europe ; « la vérité ne contredit pas la vérité »." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> « Crois pour comprendre » résume la position de :</p><ol type='a'><li>Averroès</li><li>Thomas d'Aquin</li><li>saint Augustin</li><li>Avicenne</li></ol><details><summary>Voir la réponse</summary><p><strong>Saint Augustin</strong> : la foi précède et éclaire l'intelligence.</p></details><p><strong>Exercice.</strong> Distingue patristique et scolastique (époque, objectif).</p><details><summary>Voir la réponse</summary><p>Patristique : IIᵉ-Vᵉ siècles, Pères de l'Église qui défendent la foi avec la philosophie grecque. Scolastique : XIᵉ-XVᵉ siècles, enseignement universitaire qui cherche à accorder foi et raison par la logique.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Dans ton groupe d'étude à Ngaoundéré, une camarade affirme : « Quand on a la foi, on n'a pas besoin de réfléchir. » Un autre répond : « La raison suffit, la religion est inutile. »</p><p><strong>Tâche.</strong> Rédige un paragraphe argumenté (15 lignes) qui présente les deux positions, les éclaire par des penseurs du Moyen Âge et propose une position nuancée.</p><details><summary>Voir une réponse attendue</summary><p>La première position rappelle Tertullien, qui se méfiait de la philosophie ; la seconde rejette toute révélation. Or les grands penseurs médiévaux ont refusé de choisir : Augustin dit « crois pour comprendre » mais aussi « comprends pour croire » ; Anselme parle d'une foi qui cherche à comprendre ; Thomas d'Aquin et Averroès affirment que la foi et la raison, venant d'une même vérité, ne peuvent se contredire. Position nuancée : la raison examine, la foi donne un sens ; un croyant qui réfléchit évite le fanatisme, un rationaliste ouvert respecte les questions qu'il ne résout pas.</p></details></div>",
      retenir: "Savoir-être mobilisé : tolérance religieuse et usage de la raison." }
  ],
  revision: ["<strong>Patristique</strong> (IIᵉ-Vᵉ s.) : Tertullien, <strong>saint Augustin</strong> (« Crois pour comprendre »).", "<strong>Scolastique</strong> (XIᵉ-XVᵉ s.) : accorder foi et raison.", "<strong>Anselme</strong> : preuve ontologique ; <strong>Thomas d'Aquin</strong> : Somme théologique, cinq voies.", "<strong>Avicenne</strong>, <strong>Averroès</strong> : commentateurs d'Aristote.", "Augustin et Tertullien : penseurs africains."],
  exo: "<p>Explique en cinq lignes pourquoi, selon Thomas d'Aquin, la foi et la raison ne peuvent pas se contredire. <em>(Toutes deux viennent de Dieu, source de toute vérité ; une contradiction apparente vient d'une erreur de raisonnement ou d'une mauvaise interprétation du texte.)</em></p>",
  quiz: [
    { q: "La patristique est la pensée :", r: ["des Pères de l'Église", "des philosophes grecs", "des Lumières", "des existentialistes"], b: 0, e: "IIᵉ-Vᵉ siècles." },
    { q: "Saint Augustin est né à :", r: ["Athènes", "Thagaste, en Afrique du Nord", "Rome", "Cordoue"], b: 1, e: "Dans l'actuelle Algérie ; évêque d'Hippone." },
    { q: "« Qu'y a-t-il de commun entre Athènes et Jérusalem ? » est de :", r: ["Thomas d'Aquin", "Averroès", "Tertullien", "Anselme"], b: 2, e: "Il oppose philosophie et foi." },
    { q: "La <em>Somme théologique</em> est de :", r: ["saint Augustin", "Avicenne", "Anselme", "Thomas d'Aquin"], b: 3, e: "XIIIᵉ siècle." },
    { q: "La preuve ontologique de l'existence de Dieu est associée à :", r: ["saint Anselme", "Tertullien", "Averroès", "Augustin"], b: 0, e: "Dieu, « ce dont on ne peut rien concevoir de plus grand »." },
    { q: "Averroès est surtout connu comme commentateur de :", r: ["Platon", "Aristote", "Socrate", "Pythagore"], b: 1, e: "On l'appelait « le Commentateur »." },
    { q: "La scolastique cherche à :", r: ["supprimer la foi", "rejeter Aristote", "accorder la foi et la raison", "abolir les universités"], b: 2, e: "Par l'argumentation logique." },
    { q: "<em>La Cité de Dieu</em> est de :", r: ["Thomas d'Aquin", "Anselme", "Averroès", "saint Augustin"], b: 3, e: "Écrite après le sac de Rome en 410." },
    { q: "« La vérité ne peut contredire la vérité » exprime l'idée que :", r: ["foi et raison s'accordent", "la foi est fausse", "la raison est inutile", "il n'y a pas de vérité"], b: 0, e: "Position d'Averroès et de Thomas d'Aquin." },
    { q: "Avicenne était :", r: ["un Père de l'Église", "médecin et philosophe persan", "un poète latin", "un empereur romain"], b: 1, e: "Ibn Sina, 980-1037." }
  ],
  apc: { module: "Philosophie de Terminale A", famille: "Vie sociale et culturelle", agir: "Articuler foi et raison dans une réflexion tolérante", situation: "Dans un groupe d'étude à Ngaoundéré, deux élèves opposent la foi et la raison.", tache: "Présenter les positions, les éclairer par des penseurs médiévaux et nuancer." }
});

/* ══════════════════════ Français — Tle A et 1re A ══════════════════════ */

var VRT_A_FR_METRIQUE = {
  m: "francais", cle: "texte poétique (éléments de métrique)", titre: "Le texte poétique : éléments de métrique", duree: 25,
  accroche: "Compter les syllabes d'un vers, c'est entendre la musique du poème.",
  intro: "Le poème se distingue de la prose par un travail particulier sur le rythme et les sons. La métrique étudie le vers : le nombre de syllabes, les pauses, les rimes, les strophes. Au commentaire composé, ces outils permettent de montrer comment la forme sert le sens.",
  objectifs: ["compter les syllabes d'un vers (e muet, diérèse, synérèse)", "identifier les types de vers, de rimes et de strophes", "relier les choix métriques au sens du poème"],
  parties: [
    { t: "Compter les syllabes", html:
      "<p>En poésie, on compte les <strong>syllabes prononcées</strong>, appelées <strong>pieds</strong> par l'usage scolaire.</p>" +
      "<div class='def'><b>Le e muet</b>Il <strong>se prononce</strong> devant une consonne (« la ter-re-de mes pè-res ») ; il <strong>s'élide</strong> devant une voyelle ou un h muet ; il <strong>ne compte jamais</strong> en fin de vers.</div>" +
      "<div class='def'><b>Diérèse et synérèse</b>La <strong>diérèse</strong> sépare deux voyelles qui se suivent en deux syllabes (« pas-si-on » au lieu de « pas-sion ») pour insister sur un mot. La <strong>synérèse</strong> les réunit en une seule.</div>" +
      "<div class='ex'><b>Exemple</b>« Demain, dès l'aube, à l'heure où blanchit la campagne » (Victor Hugo) : De / main / dès / l'au / b(e) à / l'heu / r(e) où / blan / chit / la / cam / pagn(e) = <strong>12 syllabes</strong>.</div>",
      retenir: "E muet : compte devant consonne, s'élide devant voyelle, jamais en fin de vers." },
    { t: "Vers, rythme et rimes", html:
      "<ul><li><strong>Types de vers</strong> : alexandrin (12 syllabes), décasyllabe (10), octosyllabe (8), hexasyllabe (6) ; vers libre (sans mètre fixe), fréquent chez les poètes africains modernes.</li><li><strong>Césure et hémistiches</strong> : l'alexandrin classique est coupé en deux <strong>hémistiches</strong> de 6 syllabes par la <strong>césure</strong>.</li><li><strong>Enjambement</strong> : la phrase déborde sur le vers suivant ; <strong>rejet</strong> : mot court mis en valeur au début du vers suivant.</li></ul>" +
      "<div class='def'><b>Les rimes</b><strong>Disposition</strong> : suivies (AABB), croisées (ABAB), embrassées (ABBA). <strong>Richesse</strong> : pauvre (1 son commun), suffisante (2), riche (3 ou plus). <strong>Genre</strong> : féminine (terminée par un e muet) ou masculine.</div>",
      retenir: "Alexandrin = 6 + 6 ; rimes suivies, croisées, embrassées ; pauvre, suffisante, riche." },
    { t: "Strophes et formes fixes ; la forme au service du sens", html:
      "<p><strong>Strophes</strong> : distique (2 vers), tercet (3), quatrain (4), quintil (5), sizain (6). <strong>Formes fixes</strong> : le <strong>sonnet</strong> (deux quatrains et deux tercets, 14 vers), la ballade, le rondeau.</p>" +
      "<div class='ex'><b>Pour le commentaire</b>On ne relève jamais un procédé pour lui-même : on dit ce qu'il produit. Un rejet met un mot en relief ; un vers court après des alexandrins crée une rupture ; des rimes riches donnent une impression d'harmonie.</div>" +
      "<div class='savais'><b>Le savais-tu ?</b>Senghor indiquait en tête de certains poèmes l'instrument qui devait les accompagner (kôras, balafong, tam-tam) : pour lui, le poème est fait pour être chanté.</div>",
      retenir: "Distique, tercet, quatrain ; sonnet = 4 + 4 + 3 + 3 ; toujours relier la forme au sens." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Une rime qui suit le schéma ABBA est :</p><ol type='a'><li>suivie</li><li>croisée</li><li>embrassée</li><li>riche</li></ol><details><summary>Voir la réponse</summary><p><strong>Embrassée</strong> : les rimes B sont « embrassées » par les rimes A.</p></details><p><strong>Exercice.</strong> Compte les syllabes : « Mignonne, allons voir si la rose » (Ronsard).</p><details><summary>Voir la réponse</summary><p>Mi / gnon / n(e) al / lons / voir / si / la / ros(e) = <strong>8 syllabes</strong> (octosyllabe) ; le e de « mignonne » s'élide devant « allons », celui de « rose » ne compte pas en fin de vers.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Pour la journée de la poésie de ton lycée à Bafang, ton groupe doit présenter un poème de quatre vers sur le fleuve Nkam. Un camarade propose de « faire comme dans les livres », avec des alexandrins et des rimes croisées, mais personne ne sait vérifier.</p><p><strong>Tâche.</strong> Explique à ton groupe la méthode pour vérifier un alexandrin et une disposition de rimes, puis écris un quatrain qui respecte ces règles.</p><details><summary>Voir une réponse attendue</summary><p>Méthode : prononcer lentement chaque vers ; compter les syllabes en appliquant la règle du e muet (prononcé devant consonne, élidé devant voyelle, muet en fin de vers) ; vérifier la césure après la 6ᵉ syllabe ; noter A, B, A, B les sons finaux. Exemple de quatrain : « Sous la brume du soir, le Nkam rejoint la mer ; / Il porte dans ses eaux les chants de nos collines ; / Il traverse la nuit, le jour, l'été, l'hiver, / Et garde le secret de ses rives divines. » (12 syllabes, rimes croisées ABAB.)</p></details></div>",
      retenir: "Savoir-être mobilisé : créativité et rigueur." }
  ],
  revision: ["On compte les <strong>syllabes prononcées</strong>.", "E muet : compte devant consonne, élidé devant voyelle, jamais en fin de vers.", "<strong>Diérèse</strong> (une syllabe de plus) / <strong>synérèse</strong>.", "Alexandrin 12 (6 + 6), décasyllabe 10, octosyllabe 8.", "Rimes suivies, croisées, embrassées ; sonnet = 2 quatrains + 2 tercets."],
  exo: "<p>Indique la disposition des rimes : « lune / chant / brune / champ » ; « mer / amer / soir / noir » ; « ciel / nuit / bruit / miel ». <em>(Croisées ABAB ; suivies AABB ; embrassées ABBA.)</em></p>",
  quiz: [
    { q: "Un alexandrin compte :", r: ["12 syllabes", "10 syllabes", "8 syllabes", "14 syllabes"], b: 0, e: "Classiquement coupé en deux hémistiches de 6." },
    { q: "En fin de vers, le e muet :", r: ["compte toujours", "ne compte jamais", "compte double", "se prononce fort"], b: 1, e: "C'est une règle constante." },
    { q: "La diérèse consiste à :", r: ["supprimer une syllabe", "élider un e muet", "séparer deux voyelles en deux syllabes", "couper le vers en deux"], b: 2, e: "« pas-si-on » au lieu de « pas-sion »." },
    { q: "Le schéma AABB correspond à des rimes :", r: ["croisées", "embrassées", "riches", "suivies"], b: 3, e: "On dit aussi rimes plates." },
    { q: "Un sonnet comporte :", r: ["deux quatrains et deux tercets", "quatre quatrains", "trois tercets", "un distique"], b: 0, e: "14 vers au total." },
    { q: "Une rime riche a en commun :", r: ["un son", "trois sons ou plus", "deux sons", "aucun son"], b: 1, e: "Pauvre : 1 ; suffisante : 2 ; riche : 3 ou plus." },
    { q: "La césure de l'alexandrin classique se place après la :", r: ["4ᵉ syllabe", "8ᵉ syllabe", "6ᵉ syllabe", "10ᵉ syllabe"], b: 2, e: "Elle sépare deux hémistiches." },
    { q: "Une strophe de trois vers est :", r: ["un quatrain", "un distique", "un sizain", "un tercet"], b: 3, e: "Tercet = 3 vers." },
    { q: "Le rejet met en valeur :", r: ["un mot court placé au début du vers suivant", "la rime", "le titre", "la dernière strophe"], b: 0, e: "La phrase déborde et isole ce mot." },
    { q: "Un vers sans nombre fixe de syllabes est un :", r: ["alexandrin", "vers libre", "octosyllabe", "hémistiche"], b: 1, e: "Fréquent dans la poésie moderne et africaine." }
  ],
  apc: { module: "Français de Première et Terminale A", famille: "Vie sociale et culturelle", agir: "Utiliser les règles de la métrique pour analyser et composer un poème", situation: "Pour la journée de la poésie d'un lycée de Bafang, un groupe veut écrire un quatrain en alexandrins sur le Nkam.", tache: "Expliquer la méthode de vérification et composer le quatrain." }
};
VRT_L("tle-a-francais-metrique", Object.assign({ c: "Tle A" }, VRT_A_FR_METRIQUE));
VRT_L("1re-a-francais-metrique", Object.assign({ c: "1re A" }, VRT_A_FR_METRIQUE));

/* ══════════════════════ Philosophie — 1re C et 1re D ══════════════════════ */

var VRT_1CD_PHILO_ORIGINE = {
  m: "philo", cle: "Origine et objet de la Philosophie", titre: "Origine et objet de la philosophie", duree: 25,
  accroche: "La philosophie est-elle née en Grèce, ou y a-t-elle seulement pris son nom ?",
  intro: "On enseigne souvent que la philosophie est née en Grèce au VIᵉ siècle avant notre ère, comme par « miracle ». Des historiens africains ont contesté ce récit en rappelant la dette des Grecs envers l'Égypte. Après l'origine, il faut aussi se demander de quoi s'occupe la philosophie.",
  objectifs: ["expliquer les conditions de naissance de la philosophie en Grèce", "présenter la thèse du « miracle grec » et sa critique", "définir l'objet de la philosophie"],
  parties: [
    { t: "La naissance de la philosophie en Grèce", html:
      "<p>Au VIᵉ siècle av. J.-C., en Ionie (côte de l'actuelle Turquie), à <strong>Milet</strong>, des penseurs cherchent à expliquer la nature par des causes naturelles et non par les dieux : on passe du <strong>mythos</strong> (récit mythique) au <strong>logos</strong> (discours rationnel).</p>" +
      "<ul><li><strong>Thalès</strong> : le principe (arkhè) de toutes choses est l'eau.</li><li><strong>Anaximène</strong> : l'air ; <strong>Héraclite</strong> : le feu et le changement perpétuel ; <strong>Pythagore</strong> : le nombre.</li></ul>" +
      "<div class='def'><b>Les conditions</b>La <strong>cité</strong> (polis) où l'on débat sur l'agora ; l'<strong>écriture alphabétique</strong> ; le <strong>loisir</strong> (scholè) des citoyens ; le commerce et les voyages, qui mettent en contact avec d'autres savoirs.</div>",
      retenir: "Milet, VIᵉ s. av. J.-C. : du mythos au logos ; Thalès, l'eau principe de toute chose." },
    { t: "« Miracle grec » ou héritage égyptien ?", html:
      "<div class='def'><b>La thèse du miracle grec</b>Formulée notamment par Ernest Renan au XIXᵉ siècle : la raison serait apparue d'un coup en Grèce, sans héritage, comme un privilège européen.</div>" +
      "<div class='ex'><b>La critique</b><strong>Cheikh Anta Diop</strong> et <strong>Théophile Obenga</strong> rappellent que les auteurs grecs eux-mêmes (Hérodote, Platon, Diogène Laërce) rapportent que Thalès, Pythagore et Platon séjournèrent en <strong>Égypte</strong> pour s'instruire en géométrie, en astronomie et en sagesse. L'Égypte pharaonique avait développé des mathématiques, une médecine et une réflexion morale (Maât, enseignements de Ptahhotep).</div>" +
      "<div class='attention'><b>Nuance</b>Reconnaître cet héritage n'enlève rien à l'originalité grecque : l'argumentation publique et critique y prend une forme nouvelle. La philosophie n'est la propriété d'aucun peuple.</div>",
      retenir: "Le « miracle grec » oublie l'Égypte ; l'originalité grecque est réelle, mais la raison est universelle." },
    { t: "L'objet de la philosophie", html:
      "<p>La philosophie n'a pas un objet particulier comme la biologie (le vivant) ou la géologie (la Terre) : elle s'intéresse à <strong>tout</strong>, mais sous l'angle du <strong>sens</strong>, des <strong>fondements</strong> et des <strong>valeurs</strong>.</p>" +
      "<ul><li><strong>L'homme</strong> : sa nature, sa liberté, son destin.</li><li><strong>Le monde</strong> : son origine, son ordre.</li><li><strong>Dieu</strong> et le sacré.</li><li><strong>La connaissance</strong> : qu'est-ce que la vérité ? Que vaut la science ?</li><li><strong>L'action</strong> : morale et politique (le bien, le juste, le pouvoir).</li></ul>" +
      "<div class='astuce'><b>Astuce</b>Socrate a « fait descendre la philosophie du ciel sur la terre » (Cicéron) : après les physiciens de Milet, il centre la réflexion sur l'homme et sur la manière de bien vivre.</div>",
      retenir: "Objet : l'homme, le monde, Dieu, la connaissance, l'action, sous l'angle du sens et des valeurs." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Le passage du mythos au logos désigne :</p><ol type='a'><li>le passage de la poésie au théâtre</li><li>le passage de l'explication mythique à l'explication rationnelle</li><li>la traduction du grec en latin</li><li>la naissance de l'écriture</li></ol><details><summary>Voir la réponse</summary><p><strong>Le passage de l'explication mythique à l'explication rationnelle</strong> du monde.</p></details><p><strong>Exercice (format du Probatoire).</strong> Définis les concepts « logos » et « miracle grec » et donne pour chacun une citation avec son auteur.</p><details><summary>Voir la réponse</summary><p>Logos : discours rationnel qui explique par des causes naturelles, opposé au mythos ; « C'est l'étonnement qui poussa les premiers penseurs aux spéculations philosophiques » (Aristote). Miracle grec : thèse d'une naissance soudaine et sans héritage de la raison en Grèce (Renan), contestée par Cheikh Anta Diop : « L'histoire de l'Afrique noire restera suspendue en l'air et ne pourra être écrite correctement tant que les historiens africains n'oseront pas la rattacher à l'histoire de l'Égypte » (<em>Antériorité des civilisations nègres</em>, 1967).</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> En 1re D à Kribi, un élève déclare pendant l'exposé : « La philosophie, c'est un truc d'Européens ; nous, Africains, nous n'avons rien à y faire. »</p><p><strong>Tâche.</strong> Réponds-lui en 12 à 15 lignes en t'appuyant sur l'origine de la philosophie et sur son objet.</p><details><summary>Voir une réponse attendue</summary><p>Historiquement, la philosophie ne naît pas d'un « miracle » européen : les Grecs reconnaissaient leur dette envers l'Égypte, et des historiens comme Cheikh Anta Diop et Théophile Obenga ont montré la profondeur de la pensée égyptienne. Saint Augustin, l'un des plus grands philosophes, était africain ; aujourd'hui, Towa, Eboussi Boulaga ou Njoh-Mouelle sont camerounais. Surtout, l'objet de la philosophie concerne tout homme : la vérité, la justice, la liberté, le sens de la vie. Un élève africain qui se demande si une règle est juste ou si une information est vraie philosophe déjà : la raison n'appartient à aucun continent.</p></details></div>",
      retenir: "Savoir-être mobilisé : confiance en sa capacité de penser et ouverture." }
  ],
  revision: ["Milet, VIᵉ s. av. J.-C. : du <strong>mythos</strong> au <strong>logos</strong>.", "Thalès (eau), Anaximène (air), Héraclite (feu), Pythagore (nombre).", "Conditions : cité, écriture, loisir, échanges.", "<strong>Miracle grec</strong> (Renan) critiqué par <strong>C. A. Diop</strong> et <strong>Obenga</strong> : héritage égyptien.", "Objet : l'homme, le monde, Dieu, la connaissance, l'action."],
  exo: "<p>Explique la formule de Cicéron : Socrate « a fait descendre la philosophie du ciel sur la terre ». <em>(Les premiers philosophes étudiaient la nature et le cosmos ; Socrate centre la réflexion sur l'homme, la morale et la vie dans la cité.)</em></p>",
  quiz: [
    { q: "Les premiers philosophes grecs vivaient à :", r: ["Milet, en Ionie", "Rome", "Alexandrie", "Carthage"], b: 0, e: "Côte de l'actuelle Turquie, VIᵉ s. av. J.-C." },
    { q: "Pour Thalès, le principe de toutes choses est :", r: ["le feu", "l'eau", "l'air", "le nombre"], b: 1, e: "L'arkhè, ce dont tout provient." },
    { q: "Le logos désigne :", r: ["le mythe", "la poésie", "le discours rationnel", "la religion"], b: 2, e: "Il s'oppose au mythos." },
    { q: "La thèse du « miracle grec » est associée à :", r: ["Cheikh Anta Diop", "Obenga", "Thalès", "Ernest Renan"], b: 3, e: "XIXᵉ siècle." },
    { q: "Cheikh Anta Diop souligne l'apport de :", r: ["l'Égypte pharaonique", "la Chine", "Rome", "l'Inde"], b: 0, e: "Nations nègres et culture, 1954." },
    { q: "Le loisir (scholè) a favorisé la philosophie car il :", r: ["supprimait le travail des esclaves", "laissait du temps pour réfléchir", "interdisait le commerce", "remplaçait l'école"], b: 1, e: "Le mot a donné « école »." },
    { q: "Pour Héraclite, tout est :", r: ["immobile", "eau", "changement perpétuel", "nombre"], b: 2, e: "« On ne se baigne jamais deux fois dans le même fleuve. »" },
    { q: "Qui a « fait descendre la philosophie du ciel sur la terre » ?", r: ["Thalès", "Pythagore", "Platon", "Socrate"], b: 3, e: "Formule de Cicéron." },
    { q: "L'objet de la philosophie est :", r: ["tout, sous l'angle du sens et des valeurs", "uniquement la nature", "uniquement Dieu", "uniquement les nombres"], b: 0, e: "L'homme, le monde, Dieu, la connaissance, l'action." },
    { q: "Théophile Obenga est un historien :", r: ["grec", "africain", "allemand", "romain"], b: 1, e: "Congolais, il a étudié l'Égypte ancienne avec Cheikh Anta Diop." }
  ],
  apc: { module: "Philosophie de Première C et D", famille: "Vie sociale et culturelle", agir: "Montrer l'universalité de la démarche philosophique", situation: "En 1re D à Kribi, un élève affirme que la philosophie est réservée aux Européens.", tache: "Lui répondre en s'appuyant sur l'origine et l'objet de la philosophie." }
};
VRT_L("1re-c-philo-origine-objet", Object.assign({ c: "1re C" }, VRT_1CD_PHILO_ORIGINE));
VRT_L("1re-d-philo-origine-objet", Object.assign({ c: "1re D" }, VRT_1CD_PHILO_ORIGINE));

/* ══════════════════════ Français — 1re C et 1re D ══════════════════════ */

var VRT_1CD_FR_PONCTUATION = {
  m: "francais", cle: "La ponctuation", titre: "La ponctuation : rôles et emplois", duree: 20,
  accroche: "« Mangeons, les enfants ! » ou « Mangeons les enfants ! » : une virgule sauve des vies.",
  intro: "À l'oral, la voix marque les pauses, les questions, les émotions. À l'écrit, c'est la ponctuation qui fait ce travail. Mal ponctuée, une phrase devient ambiguë ou illisible ; bien ponctuée, elle guide le lecteur et sert le sens. Les correcteurs du probatoire y sont très attentifs.",
  objectifs: ["identifier les signes de ponctuation et leurs rôles", "employer correctement la virgule, le point-virgule et les deux-points", "analyser les effets de la ponctuation dans un texte littéraire"],
  parties: [
    { t: "Les signes qui terminent la phrase", html:
      "<ul><li><strong>Le point (.)</strong> : fin d'une phrase déclarative ou injonctive.</li><li><strong>Le point d'interrogation (?)</strong> : question directe (« Viens-tu ? »). Pas de point d'interrogation dans une question indirecte : « Je me demande s'il viendra. »</li><li><strong>Le point d'exclamation (!)</strong> : émotion, ordre, interjection.</li><li><strong>Les points de suspension (…)</strong> : phrase inachevée, hésitation, sous-entendu, énumération incomplète.</li></ul>" +
      "<div class='astuce'><b>Typographie française</b>On met une espace avant ; : ! ? et à l'intérieur des guillemets « … » ; aucune espace avant le point et la virgule.</div>",
      retenir: "Point, point d'interrogation, point d'exclamation, points de suspension : ils terminent la phrase et lui donnent sa modalité." },
    { t: "Les signes à l'intérieur de la phrase", html:
      "<div class='def'><b>La virgule</b>Elle sépare les éléments d'une <strong>énumération</strong> ; elle encadre une <strong>apposition</strong>, une <strong>incise</strong> (« dit-il »), une <strong>apostrophe</strong> (« Paul, viens ») ; elle détache un <strong>complément circonstanciel</strong> placé en tête ; elle sépare deux propositions juxtaposées. On ne sépare <strong>jamais</strong> le sujet de son verbe par une seule virgule.</div>" +
      "<div class='def'><b>Le point-virgule et les deux-points</b>Le <strong>point-virgule</strong> sépare deux propositions liées par le sens mais autonomes. Les <strong>deux-points</strong> annoncent une <strong>explication</strong>, une <strong>conséquence</strong>, une <strong>énumération</strong> ou une <strong>citation</strong>.</div>" +
      "<p><strong>Guillemets</strong> : paroles rapportées, citation, mot mis à distance. <strong>Tirets</strong> : changement d'interlocuteur dans un dialogue, ou mise en relief. <strong>Parenthèses</strong> : précision secondaire.</p>",
      retenir: "Jamais de virgule seule entre sujet et verbe ; deux-points = explication, conséquence, énumération, citation." },
    { t: "Ponctuation et sens", html:
      "<div class='ex'><b>Une virgule change tout</b>« Le professeur dit : l'élève est absent. » (c'est l'élève qui est absent) / « Le professeur, dit l'élève, est absent. » (c'est le professeur qui est absent).</div>" +
      "<div class='ex'><b>Effets dans un texte littéraire</b>Des phrases courtes séparées par des points créent un rythme haché (tension, émotion) ; une longue énumération par virgules donne une impression d'abondance ; les points de suspension suggèrent l'émotion ou le non-dit ; les points d'exclamation traduisent l'indignation ou l'enthousiasme.</div>" +
      "<div class='attention'><b>Au probatoire</b>Dans une question de langue, on attend le signe, son <strong>rôle</strong> et son <strong>effet</strong> sur le sens ou le rythme : « Les points de suspension marquent l'hésitation du narrateur et traduisent son trouble. »</div>",
      retenir: "La ponctuation crée du sens et du rythme : signe + rôle + effet." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Quelle phrase est correctement ponctuée ?</p><ol type='a'><li>Les élèves de 1re C, préparent le probatoire.</li><li>Je me demande s'il viendra ?</li><li>Il avait tout prévu : la carte, l'eau, la lampe.</li><li>Paul viens ici !</li></ol><details><summary>Voir la réponse</summary><p><strong>c</strong> : les deux-points annoncent une énumération. (a) sépare le sujet du verbe ; (b) question indirecte sans point d'interrogation ; (d) l'apostrophe « Paul » doit être suivie d'une virgule.</p></details><p><strong>Exercice.</strong> Ponctue de deux manières et explique la différence : « Ngono dit le directeur est malade ».</p><details><summary>Voir la réponse</summary><p>« Ngono, dit le directeur, est malade. » (c'est Ngono qui est malade, selon le directeur) / « Ngono dit : le directeur est malade. » (c'est le directeur qui est malade, selon Ngono).</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Le communiqué suivant doit être affiché au lycée bilingue de Buea : « attention les élèves de 1re C et D qui n'ont pas payé l'APEE ne composeront pas lundi le proviseur recevra les parents mardi à 9 heures »</p><p><strong>Tâche.</strong> Rétablis la ponctuation et les majuscules, puis explique le rôle de trois signes que tu as utilisés.</p><details><summary>Voir une réponse attendue</summary><p>« Attention ! Les élèves de 1re C et D qui n'ont pas payé l'APEE ne composeront pas lundi. Le proviseur recevra les parents mardi, à 9 heures. » Le point d'exclamation attire l'attention (interjection) ; le premier point sépare deux informations distinctes ; la virgule détache le complément de temps « à 9 heures », qui précise « mardi ». (La relative « qui n'ont pas payé » ne doit pas être entre virgules : elle désigne seulement une partie des élèves.)</p></details></div>",
      retenir: "Savoir-être mobilisé : rigueur et souci du lecteur." }
  ],
  revision: ["Fin de phrase : <strong>. ? ! …</strong> ; pas de « ? » dans une question indirecte.", "Virgule : énumération, apposition, incise, apostrophe, complément détaché.", "<strong>Jamais</strong> de virgule seule entre sujet et verbe.", "Point-virgule : propositions liées ; deux-points : explication, conséquence, énumération, citation.", "Analyser : signe + rôle + effet."],
  exo: "<p>Ponctue ce dialogue : « Où vas-tu demanda la mère Au marché répondit Esso Reviens vite alors » <em>(« Où vas-tu ? » demanda la mère. — Au marché, répondit Esso. — Reviens vite, alors !)</em></p>",
  quiz: [
    { q: "« Je me demande s'il viendra » se termine par :", r: ["un point", "un point d'interrogation", "deux-points", "un point-virgule"], b: 0, e: "C'est une question indirecte." },
    { q: "Les deux-points peuvent annoncer :", r: ["la fin du texte", "une explication ou une énumération", "un changement de paragraphe", "une question indirecte"], b: 1, e: "Aussi une conséquence ou une citation." },
    { q: "Quelle phrase est fautive ?", r: ["Paul, viens ici !", "Hier, il a plu.", "Les élèves de Tle, travaillent.", "Il pleut ; je reste."], b: 2, e: "On ne sépare pas le sujet du verbe par une virgule." },
    { q: "Dans un dialogue, le tiret marque :", r: ["une question", "une énumération", "une citation savante", "le changement d'interlocuteur"], b: 3, e: "Chaque réplique commence par un tiret." },
    { q: "Les points de suspension peuvent exprimer :", r: ["l'hésitation ou le sous-entendu", "une certitude", "une définition", "une conséquence"], b: 0, e: "Ils laissent la phrase en suspens." },
    { q: "« Paul, viens » : la virgule isole :", r: ["une apposition", "une apostrophe", "une incise", "un complément de lieu"], b: 1, e: "On interpelle quelqu'un." },
    { q: "« dit-il » au milieu d'une phrase est :", r: ["une apposition", "une apostrophe", "une incise", "un complément"], b: 2, e: "L'incise est encadrée de virgules." },
    { q: "Le point-virgule sépare :", r: ["le sujet et le verbe", "deux mots d'une énumération courte", "les lettres d'un sigle", "deux propositions liées par le sens"], b: 3, e: "Pause plus forte que la virgule, plus faible que le point." },
    { q: "En typographie française, on met une espace avant :", r: ["le point d'exclamation", "le point", "la virgule", "aucun signe"], b: 0, e: "Aussi avant ; : ? et à l'intérieur des guillemets." },
    { q: "Une suite de phrases très courtes crée souvent un effet de :", r: ["calme", "tension ou rythme haché", "abondance", "lenteur"], b: 1, e: "Le rythme s'accélère." }
  ],
  apc: { module: "Français de Première C et D", famille: "Vie sociale et culturelle", agir: "Ponctuer correctement un écrit pour qu'il soit compris sans ambiguïté", situation: "Un communiqué non ponctué doit être affiché au lycée bilingue de Buea.", tache: "Rétablir la ponctuation et justifier trois signes." }
};
VRT_L("1re-c-francais-ponctuation", Object.assign({ c: "1re C" }, VRT_1CD_FR_PONCTUATION));
VRT_L("1re-d-francais-ponctuation", Object.assign({ c: "1re D" }, VRT_1CD_FR_PONCTUATION));

/* ══════════════════════ Histoire — 1re A, 1re C et 1re D ══════════════════════ */

var VRT_1RE_HIST_INDUSTRIE = {
  m: "histoire", cle: "industrialisation de l", titre: "L'industrialisation de l'Europe (XVIIIᵉ-XIXᵉ siècles)", duree: 25,
  accroche: "La machine à vapeur a changé l'Europe… puis le destin de l'Afrique.",
  intro: "À partir de la fin du XVIIIᵉ siècle, l'Europe passe d'une économie agricole et artisanale à une économie industrielle fondée sur les machines, le charbon et les usines. Cette révolution transforme les sociétés européennes et pousse les puissances industrielles à conquérir de nouveaux territoires, notamment en Afrique.",
  objectifs: ["expliquer les causes et les étapes de la révolution industrielle", "décrire ses conséquences économiques et sociales", "établir le lien entre industrialisation et impérialisme en Afrique"],
  parties: [
    { t: "La première révolution industrielle", html:
      "<p>Elle commence en <strong>Grande-Bretagne</strong> vers <strong>1760-1780</strong>, puis gagne la France, la Belgique et l'Allemagne au XIXᵉ siècle.</p>" +
      "<div class='def'><b>Les causes</b>Une <strong>révolution agricole</strong> qui nourrit plus d'habitants et libère de la main-d'œuvre ; une <strong>croissance démographique</strong> ; des <strong>capitaux</strong> issus du commerce, y compris le commerce triangulaire ; du <strong>charbon</strong> et du <strong>fer</strong> en abondance ; des inventions.</div>" +
      "<ul><li><strong>Textile</strong> : navette volante (Kay, 1733), machines à filer.</li><li><strong>Machine à vapeur</strong> perfectionnée par <strong>James Watt</strong> (1769).</li><li><strong>Chemin de fer</strong> : locomotive de Stephenson ; ligne Liverpool-Manchester (1830) ; bateaux à vapeur.</li></ul>",
      retenir: "Grande-Bretagne, fin du XVIIIᵉ siècle : charbon, fer, textile, machine à vapeur (Watt), chemin de fer." },
    { t: "La deuxième révolution industrielle", html:
      "<p>Vers <strong>1870-1880</strong>, de nouvelles énergies et industries apparaissent :</p><ul><li><strong>Électricité</strong> (lampe d'Edison, 1879) et <strong>pétrole</strong> ;</li><li><strong>moteur à explosion</strong> et automobile (Benz, 1886) ;</li><li><strong>chimie</strong> (engrais, colorants, caoutchouc) et <strong>acier</strong> ;</li><li>grandes entreprises, banques et concentration du capital ; l'Allemagne et les États-Unis rattrapent la Grande-Bretagne.</li></ul>" +
      "<div class='savais'><b>Le savais-tu ?</b>Le pneu gonflable (Dunlop, 1888) et l'essor de l'automobile ont fait exploser la demande de caoutchouc : les colonisateurs l'ont exigé des populations d'Afrique centrale, y compris au Cameroun allemand.</div>",
      retenir: "Fin du XIXᵉ siècle : électricité, pétrole, moteur à explosion, chimie, acier, grandes entreprises." },
    { t: "Conséquences : sociétés nouvelles et expansion coloniale", html:
      "<ul><li><strong>Urbanisation</strong> rapide : Manchester, la Ruhr ; quartiers ouvriers insalubres.</li><li><strong>Nouvelles classes</strong> : une <strong>bourgeoisie</strong> industrielle et financière, un <strong>prolétariat</strong> ouvrier (journées de 12 à 15 heures, travail des enfants).</li><li><strong>Question sociale</strong> : syndicats, grèves, socialisme ; Karl Marx et Friedrich Engels publient le <em>Manifeste du parti communiste</em> (1848).</li></ul>" +
      "<div class='attention'><b>Le lien avec l'Afrique</b>Les industries ont besoin de <strong>matières premières</strong> (caoutchouc, huile de palme, coton, minerais) et de <strong>débouchés</strong> pour leurs produits et leurs capitaux : c'est l'un des <strong>fondements de l'impérialisme</strong>, qui conduit au partage de l'Afrique (conférence de Berlin, 1884-1885) et à la colonisation du Cameroun par l'Allemagne en 1884.</div>",
      retenir: "Villes, bourgeoisie et prolétariat, question sociale ; besoin de matières premières et de débouchés → impérialisme." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> La révolution industrielle commence :</p><ol type='a'><li>en France vers 1850</li><li>en Grande-Bretagne vers 1760-1780</li><li>en Allemagne vers 1900</li><li>aux États-Unis vers 1700</li></ol><details><summary>Voir la réponse</summary><p><strong>En Grande-Bretagne, vers 1760-1780</strong>.</p></details><p><strong>Exercice.</strong> Classe en deux colonnes (1re / 2e révolution industrielle) : charbon, électricité, machine à vapeur, pétrole, textile, chimie.</p><details><summary>Voir la réponse</summary><p>1re : charbon, machine à vapeur, textile. 2e : électricité, pétrole, chimie.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Lors d'une sortie au port de Douala, tu observes des grumes de bois et des fèves de cacao chargées vers l'Europe, et des voitures et des machines déchargées. Ton camarade demande : « Pourquoi exportons-nous des produits bruts et importons-nous des produits finis ? »</p><p><strong>Tâche.</strong> Explique en 12 à 15 lignes l'origine historique de cette situation, en partant de l'industrialisation de l'Europe, puis propose une piste pour la changer.</p><details><summary>Voir une réponse attendue</summary><p>Au XIXᵉ siècle, l'Europe s'industrialise : ses usines ont besoin de matières premières et de marchés. Elle colonise l'Afrique, dont le Cameroun (1884), et y organise une économie de traite : les colonies produisent des matières brutes (caoutchouc, huile de palme, cacao, bois) et achètent des produits manufacturés. Après l'indépendance, cette spécialisation a largement persisté, car l'industrie exige des capitaux, de l'énergie et des compétences. Piste : transformer sur place une partie des produits (chocolateries, menuiseries, usines de transformation du bois), comme le prévoit la politique d'import-substitution, pour créer des emplois et de la valeur ajoutée.</p></details></div>",
      retenir: "Savoir-être mobilisé : esprit critique et sens de l'initiative économique." }
  ],
  revision: ["1re révolution : <strong>Grande-Bretagne</strong>, vers 1760-1780 ; charbon, textile, <strong>machine à vapeur</strong> (Watt, 1769), chemin de fer.", "2e révolution (vers 1870) : <strong>électricité</strong>, <strong>pétrole</strong>, moteur, chimie, acier.", "Sociétés : urbanisation, <strong>bourgeoisie</strong> / <strong>prolétariat</strong>, question sociale (Marx, 1848).", "Besoins : <strong>matières premières</strong> et <strong>débouchés</strong>.", "→ impérialisme ; Cameroun allemand en 1884."],
  exo: "<p>Construis un schéma « causes → révolution industrielle → conséquences en Europe → conséquences en Afrique ». <em>(Révolution agricole, capitaux, charbon, inventions → usines, machines → villes, ouvriers, bourgeoisie → recherche de matières premières et de marchés, colonisation.)</em></p>",
  quiz: [
    { q: "La machine à vapeur est perfectionnée par :", r: ["James Watt", "Thomas Edison", "Karl Benz", "Karl Marx"], b: 0, e: "En 1769." },
    { q: "La première révolution industrielle repose surtout sur :", r: ["le pétrole et l'électricité", "le charbon et le fer", "le nucléaire", "le numérique"], b: 1, e: "Charbon pour la vapeur, fer pour les machines." },
    { q: "La ligne de chemin de fer Liverpool-Manchester ouvre en :", r: ["1769", "1884", "1830", "1900"], b: 2, e: "Symbole de la révolution des transports." },
    { q: "Le prolétariat désigne :", r: ["les propriétaires d'usines", "les paysans riches", "les banquiers", "les ouvriers qui vivent de leur salaire"], b: 3, e: "Nouvelle classe née de l'industrie." },
    { q: "Le <em>Manifeste du parti communiste</em> date de :", r: ["1848", "1769", "1884", "1919"], b: 0, e: "Marx et Engels." },
    { q: "Une nouveauté de la deuxième révolution industrielle est :", r: ["la machine à vapeur", "l'électricité", "la navette volante", "le charbon"], b: 1, e: "Avec le pétrole et le moteur à explosion." },
    { q: "Les industries européennes cherchent en Afrique :", r: ["des ouvriers qualifiés", "des machines", "des matières premières et des débouchés", "du charbon uniquement"], b: 2, e: "C'est un fondement de l'impérialisme." },
    { q: "L'Allemagne établit son protectorat sur le Cameroun en :", r: ["1830", "1848", "1914", "1884"], b: 3, e: "Traité germano-douala de juillet 1884." },
    { q: "La demande de caoutchouc augmente notamment avec :", r: ["le pneu et l'automobile", "la machine à vapeur", "le textile", "l'imprimerie"], b: 0, e: "Dunlop, 1888 ; Benz, 1886." },
    { q: "L'urbanisation industrielle entraîne :", r: ["la disparition des villes", "des quartiers ouvriers insalubres", "la fin du travail des enfants", "le retour à la terre"], b: 1, e: "Avant les premières lois sociales." }
  ],
  apc: { module: "Histoire de Première", famille: "Vie économique", agir: "Expliquer l'origine historique de la place de l'Afrique dans les échanges mondiaux", situation: "Au port de Douala, des élèves voient partir des produits bruts et arriver des produits finis.", tache: "Expliquer l'origine de cette situation et proposer une piste de changement." }
};
VRT_L("1re-a-histoire-industrialisation", Object.assign({ c: "1re A" }, VRT_1RE_HIST_INDUSTRIE));
VRT_L("1re-c-histoire-industrialisation", Object.assign({ c: "1re C" }, VRT_1RE_HIST_INDUSTRIE));
VRT_L("1re-d-histoire-industrialisation", Object.assign({ c: "1re D" }, VRT_1RE_HIST_INDUSTRIE));

/* ══════════════════════ Géographie — 1re A ══════════════════════ */

VRT_L("1re-a-geo-problemes-demographiques", {
  c: "1re A", m: "geo", cle: "Les problèmes démographiques dans le monde", titre: "Les problèmes démographiques dans le monde", duree: 25,
  accroche: "Trop de jeunes ici, trop de vieux là-bas : deux problèmes opposés.",
  intro: "La croissance démographique ne pose pas les mêmes problèmes partout. Les pays en développement, à la population jeune et nombreuse, peinent à loger, nourrir, éduquer et employer. Les pays développés, eux, vieillissent et manquent de jeunes actifs. Comprendre ces deux situations aide à juger les politiques démographiques.",
  objectifs: ["identifier les problèmes liés à la croissance rapide", "identifier les problèmes liés au vieillissement", "lire une pyramide des âges et en tirer des conclusions"],
  parties: [
    { t: "Les pays à croissance rapide", html:
      "<ul><li><strong>Scolarisation</strong> : salles de classe surchargées, manque d'enseignants.</li><li><strong>Emploi</strong> : chômage et sous-emploi des jeunes, secteur informel (moto-taxis, petit commerce).</li><li><strong>Alimentation</strong> : insécurité alimentaire si la production agricole progresse moins vite que la population.</li><li><strong>Urbanisation rapide</strong> : exode rural, quartiers spontanés, manque d'eau potable, d'électricité et d'assainissement.</li><li><strong>Santé</strong> : hôpitaux saturés, mortalité maternelle et infantile encore élevée.</li><li><strong>Environnement</strong> : déforestation, épuisement des sols, pression sur l'eau.</li></ul>" +
      "<div class='ex'><b>Au Cameroun</b>Douala et Yaoundé comptent chacune environ 4 millions d'habitants ; les quartiers construits en zones inondables (Mabanda à Douala, les bords du Mfoundi à Yaoundé) sont régulièrement touchés.</div>",
      retenir: "Croissance rapide : écoles, emplois, nourriture, logement, santé, environnement sous pression." },
    { t: "Les pays vieillissants", html:
      "<div class='def'><b>Le vieillissement</b>Augmentation de la part des personnes âgées (65 ans et plus) dans la population, due à la baisse de la natalité et à l'allongement de l'espérance de vie.</div>" +
      "<ul><li><strong>Financement des retraites et des soins</strong> : moins d'actifs pour plus de retraités.</li><li><strong>Manque de main-d'œuvre</strong> dans certains métiers (santé, bâtiment, agriculture).</li><li><strong>Recours à l'immigration</strong>, source de débats politiques.</li><li>Risque de <strong>diminution de la population</strong> : villages abandonnés, écoles fermées.</li></ul>" +
      "<div class='savais'><b>Le savais-tu ?</b>Au Japon, près de trois habitants sur dix ont plus de 65 ans ; on y vend désormais plus de couches pour adultes que pour bébés.</div>",
      retenir: "Vieillissement : retraites, soins, manque d'actifs, immigration, déclin." },
    { t: "Lire une pyramide des âges", html:
      "<p>La <strong>pyramide des âges</strong> représente la population par sexe (hommes à gauche, femmes à droite) et par tranche d'âge (de bas en haut).</p>" +
      "<div class='def'><b>Trois formes</b><strong>Base large, sommet étroit</strong> (triangle) : population jeune, natalité forte (Cameroun, Niger). <strong>Forme de cloche ou de ruche</strong> : natalité modérée, population équilibrée. <strong>Base rétrécie, sommet élargi</strong> (toupie) : population vieillie (Japon, Italie, Allemagne).</div>" +
      "<div class='astuce'><b>Méthode</b>1) Présenter (pays, date). 2) Décrire la forme, la base, le sommet, les anomalies (encoches dues à une guerre, à une épidémie). 3) Expliquer. 4) Conclure sur les problèmes et les besoins.</div>",
      retenir: "Triangle : population jeune ; toupie : population vieillie ; présenter, décrire, expliquer, conclure." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Une pyramide à base large et sommet étroit indique :</p><ol type='a'><li>une population vieillie</li><li>une population jeune à forte natalité</li><li>une population en déclin</li><li>une guerre récente</li></ol><details><summary>Voir la réponse</summary><p><strong>Une population jeune à forte natalité</strong>, comme celle du Cameroun.</p></details><p><strong>Exercice.</strong> Cite deux problèmes d'un pays jeune et deux d'un pays vieilli.</p><details><summary>Voir la réponse</summary><p>Pays jeune : chômage des jeunes, manque d'écoles. Pays vieilli : financement des retraites, manque de main-d'œuvre.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Dans la commune de Bonabéri, à Douala, la population a doublé en quinze ans. Les habitants se plaignent : écoles surchargées (plus de 100 élèves par classe), coupures d'eau, inondations dans les quartiers bas, jeunes sans emploi.</p><p><strong>Tâche.</strong> Rattache ces problèmes à la croissance démographique et à l'urbanisation, puis propose un plan d'action en quatre mesures pour le conseil municipal.</p><details><summary>Voir une réponse attendue</summary><p>Ces problèmes viennent d'une croissance rapide (natalité forte et exode rural) plus rapide que les équipements. Mesures : 1) construire des salles de classe et recruter des enseignants, avec une carte scolaire ; 2) étendre le réseau d'eau et installer des bornes-fontaines ; 3) interdire et relocaliser les constructions en zone inondable, curer les drains ; 4) soutenir l'emploi des jeunes par la formation professionnelle et l'appui aux petites entreprises (artisanat, transformation agricole).</p></details></div>",
      retenir: "Savoir-être mobilisé : sens de l'intérêt général et esprit d'initiative." }
  ],
  revision: ["Pays jeunes : <strong>écoles, emplois, alimentation, logement, santé, environnement</strong>.", "Pays vieillis : <strong>retraites, soins, manque d'actifs, immigration</strong>.", "Pyramide <strong>triangle</strong> = population jeune ; <strong>toupie</strong> = population vieillie.", "Méthode : présenter, décrire, expliquer, conclure.", "Douala et Yaoundé : urbanisation rapide, zones inondables."],
  exo: "<p>Décris et explique une pyramide des âges du Cameroun : base très large (plus de 40 % de moins de 15 ans), sommet très étroit (environ 3 % de plus de 65 ans). Quels besoins en découlent ? <em>(Population très jeune, natalité forte, espérance de vie encore limitée ; besoins : écoles, maternités, vaccins, emplois futurs.)</em></p>",
  quiz: [
    { q: "Un problème typique d'un pays à croissance rapide est :", r: ["le chômage des jeunes", "le manque de jeunes", "le financement des retraites", "la fermeture des écoles"], b: 0, e: "Les emplois augmentent moins vite que les jeunes actifs." },
    { q: "Le vieillissement résulte de :", r: ["la hausse de la natalité", "la baisse de la natalité et l'allongement de la vie", "l'exode rural", "la guerre"], b: 1, e: "Moins de naissances, vie plus longue." },
    { q: "Une pyramide en forme de toupie indique une population :", r: ["jeune", "en forte croissance", "vieillie", "équilibrée"], b: 2, e: "Base rétrécie, sommet élargi." },
    { q: "Dans une pyramide des âges, les hommes sont représentés :", r: ["en haut", "à droite", "en bas", "à gauche"], b: 3, e: "Les femmes à droite." },
    { q: "Un pays au fort vieillissement est :", r: ["le Japon", "le Niger", "le Cameroun", "le Tchad"], b: 0, e: "Près de 3 habitants sur 10 ont plus de 65 ans." },
    { q: "Une encoche dans une pyramide peut s'expliquer par :", r: ["une bonne récolte", "une guerre ou une épidémie", "une élection", "une fête nationale"], b: 1, e: "Déficit de naissances ou surmortalité." },
    { q: "Les quartiers spontanés résultent surtout :", r: ["du vieillissement", "de la baisse de la natalité", "d'une urbanisation rapide et mal maîtrisée", "de l'émigration"], b: 2, e: "L'exode rural dépasse la construction de logements." },
    { q: "Pour compenser le manque d'actifs, les pays vieillis ont recours à :", r: ["l'exode rural", "la hausse des naissances forcée", "la fermeture des frontières", "l'immigration"], b: 3, e: "Source de débats politiques." },
    { q: "Au Cameroun, la part des moins de 15 ans dépasse :", r: ["40 %", "10 %", "20 %", "70 %"], b: 0, e: "Population très jeune." },
    { q: "La première étape du commentaire d'une pyramide est :", r: ["conclure", "présenter le document", "expliquer", "critiquer"], b: 1, e: "Pays, date, source." }
  ],
  apc: { module: "Géographie de Première A", famille: "Environnement, santé et bien-être", agir: "Identifier les problèmes démographiques pour proposer des solutions locales", situation: "À Bonabéri, la population a doublé en quinze ans : écoles surchargées, coupures d'eau, inondations.", tache: "Rattacher ces problèmes à la croissance et proposer un plan d'action municipal." }
});

/* ══════════════════════ Philosophie — 1re A ══════════════════════ */

/* Même contenu que la leçon de Tle C et D sur les tendances de la philosophie africaine
   (07-lecons-examen.js) : en 1re A, la progression la place en n° 2. */
VRT_L("1re-a-philo-tendances-africaine", Object.assign({}, VRT_TCD_PHILO_AFRIQUE, {
  c: "1re A", cle: "Les tendances de la Philosophie Africaine", titre: "Les tendances de la philosophie africaine",
  apc: Object.assign({}, VRT_TCD_PHILO_AFRIQUE.apc, { module: "Philosophie de Première A" })
}));

/* Leçons des classes d'examen, troisième série — 1re et Tle (12/11/2026).
   Demande de Jacques : « Continue les leçons » puis « Oui » (suite de la progression).
   Leçons suivantes de la progression MINESEC 2026-2027 en Français, Philosophie, Histoire
   et Géographie, après 07 et 08. Quand la progression d'une classe reprend un intitulé déjà
   rédigé pour une autre, la leçon est reprise avec son propre cle (Object.assign). */

/* Partage d'une leçon entre classes dont l'intitulé officiel diffère : cle propre à chaque classe. */
function VRT_LX(id, classe, cle, L, sur) {
  VRT_L(id, Object.assign({}, L, { c: classe, cle: cle }, sur || {}));
}

/* ══════════════════════ Philosophie — Tle C et Tle D ══════════════════════ */

var VRT_TCD_PHILO_TEXTE = {
  m: "philo", cle: "exercice sur texte philosophique", titre: "L'exercice sur texte philosophique : méthode", duree: 30,
  accroche: "Comprendre ce que dit un philosophe avant de dire ce qu'on en pense.",
  intro: "Au baccalauréat, l'un des sujets proposés est un texte philosophique suivi de questions. On n'y attend pas un résumé ni une opinion vague : on attend que tu dégages le problème, la thèse et l'argumentation de l'auteur, que tu expliques ses notions, puis que tu évalues sa position. Cette leçon donne la méthode, étape par étape.",
  objectifs: ["dégager le thème, le problème et la thèse d'un texte", "repérer la structure argumentative", "répondre aux questions de compréhension et d'évaluation"],
  parties: [
    { t: "Lire le texte : thème, problème, thèse", html:
      "<ol><li><strong>Lire plusieurs fois</strong>, crayon en main : souligner les notions, entourer les connecteurs (mais, donc, car, en effet, ainsi).</li><li><strong>Le thème</strong> : de quoi parle le texte ? (la force et le droit, la conscience, le travail…).</li><li><strong>Le problème</strong> : quelle question l'auteur se pose-t-il ? On le formule en question.</li><li><strong>La thèse</strong> : quelle réponse l'auteur défend-il ? On la formule en une phrase affirmative.</li></ol>" +
      "<div class='ex'><b>Exemple</b>« Le plus fort n'est jamais assez fort pour être toujours le maître, s'il ne transforme sa force en droit et l'obéissance en devoir » (Rousseau, <em>Du contrat social</em>, 1762). Thème : la force et le droit. Problème : la force peut-elle fonder un pouvoir durable ? Thèse : non, un pouvoir n'est stable que s'il est reconnu comme légitime.</div>",
      retenir: "Thème (de quoi ?), problème (quelle question ?), thèse (quelle réponse ?)." },
    { t: "Dégager la structure et expliquer", html:
      "<p>La <strong>structure</strong> est le mouvement de l'argumentation : on découpe le texte en deux ou trois moments, chacun avec ses limites (lignes) et son idée principale, en s'appuyant sur les connecteurs.</p>" +
      "<div class='def'><b>Les questions d'explication</b>On demande souvent d'expliquer une expression ou une phrase. Démarche : <strong>définir</strong> les termes, <strong>reformuler</strong> l'idée, <strong>montrer son rôle</strong> dans l'argumentation, l'<strong>illustrer</strong> par un exemple.</div>" +
      "<div class='attention'><b>Deux fautes</b>La <strong>paraphrase</strong> (répéter le texte) et le <strong>hors-texte</strong> (parler de tout sauf de ce que dit l'auteur). Cite le texte entre guillemets, avec les lignes.</div>",
      retenir: "Structure : moments + idées + connecteurs ; expliquer = définir, reformuler, situer, illustrer." },
    { t: "Évaluer le texte", html:
      "<p>La dernière question demande souvent l'<strong>intérêt philosophique</strong> du texte ou une <strong>appréciation critique</strong>.</p><ul><li><strong>Intérêt</strong> : ce que la thèse nous apprend, à quoi elle s'oppose, en quoi elle éclaire notre monde.</li><li><strong>Limites</strong> : ce qu'elle ne prend pas en compte ; une objection d'un autre auteur ; un contre-exemple.</li><li><strong>Position personnelle argumentée</strong> : ni approbation ni rejet sans raisons.</li></ul>" +
      "<div class='astuce'><b>Le vocabulaire des annales</b>Dans le commentaire du baccalauréat A4 (annales 2022-2025, Partie A notée sur 9), l'évaluation se fait en deux temps notés chacun 2 points : la <strong>réfutation</strong> (un auteur qui s'oppose à la thèse, avec son argument) et la <strong>réinterprétation</strong> (un auteur qui la prolonge ou la nuance), avant la conclusion sur l'<strong>intérêt philosophique</strong>. Le même travail répond aux questions d'évaluation d'un exercice sur texte.</div><div class='ex'><b>Exemple</b>Intérêt de la thèse de Rousseau : elle distingue pouvoir de fait et pouvoir de droit, et fonde la légitimité sur le consentement. Limite : certains régimes durent longtemps par la peur et la propagande ; mais leur instabilité finale confirme la thèse.</div>",
      retenir: "Évaluer : intérêt, limites, position argumentée ; toujours en lien avec le texte." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> La thèse d'un texte est :</p><ol type='a'><li>le sujet dont il parle</li><li>la question qu'il pose</li><li>la réponse que l'auteur défend</li><li>le nom de l'auteur</li></ol><details><summary>Voir la réponse</summary><p><strong>La réponse que l'auteur défend</strong>, formulée par une phrase affirmative.</p></details><p><strong>Exercice.</strong> Donne le problème posé par : « L'homme est condamné à être libre » (Sartre).</p><details><summary>Voir la réponse</summary><p>L'homme peut-il échapper à la responsabilité de ses choix ? (Thèse : non, même ne pas choisir est un choix.)</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Au bac blanc de ton lycée à Bamenda, le texte proposé est : « Le plus fort n'est jamais assez fort pour être toujours le maître, s'il ne transforme sa force en droit et l'obéissance en devoir. […] La force est une puissance physique ; je ne vois point quelle moralité peut résulter de ses effets. Céder à la force est un acte de nécessité, non de volonté. » (Rousseau, <em>Du contrat social</em>, I, 3).</p><p><strong>Tâche.</strong> 1) Dégage le thème, le problème et la thèse. 2) Explique « céder à la force est un acte de nécessité, non de volonté ». 3) Évalue la thèse en quelques lignes.</p><details><summary>Voir une réponse attendue</summary><p>1) Thème : la force et le droit. Problème : la force peut-elle créer un droit et un devoir d'obéir ? Thèse : non ; la force contraint mais n'oblige pas moralement ; seul un pouvoir légitime fonde le devoir. 2) Quand on cède sous la menace, on ne choisit pas : on subit. Une obéissance arrachée n'est pas un engagement ; dès que la force faiblit, elle disparaît. Exemple : un racketteur obtient de l'argent, il n'obtient aucun droit. 3) Intérêt : la légitimité repose sur le consentement des citoyens, idée qui fonde la démocratie et la Constitution. Limite : une loi légitime a aussi besoin de la force publique pour être appliquée ; droit et force ne s'opposent pas toujours, la force doit être au service du droit.</p></details></div>",
      retenir: "Savoir-être mobilisé : rigueur dans la lecture et honnêteté intellectuelle." }
  ],
  revision: ["<strong>Thème</strong> : de quoi parle le texte.", "<strong>Problème</strong> : la question, formulée en question.", "<strong>Thèse</strong> : la réponse de l'auteur, en phrase affirmative.", "<strong>Structure</strong> : moments, idées, connecteurs.", "Expliquer : définir, reformuler, situer, illustrer ; évaluer : intérêt, limites, position."],
  exo: "<p>Pour la phrase de Pascal « L'homme n'est qu'un roseau, le plus faible de la nature ; mais c'est un roseau pensant », donne le thème, le problème et la thèse. <em>(Thème : la grandeur de l'homme ; problème : en quoi l'homme, si fragile, est-il grand ? ; thèse : sa grandeur vient de la pensée, qui lui fait connaître sa faiblesse.)</em></p>",
  quiz: [
    { q: "Le thème d'un texte répond à la question :", r: ["de quoi parle-t-il ?", "que pense l'auteur ?", "quand a-t-il été écrit ?", "combien de lignes a-t-il ?"], b: 0, e: "Le thème est le sujet traité." },
    { q: "Le problème se formule :", r: ["par une affirmation", "par une question", "par une citation", "par un titre"], b: 1, e: "Il montre ce qui fait difficulté." },
    { q: "Les connecteurs logiques aident surtout à repérer :", r: ["l'auteur", "la date", "la structure de l'argumentation", "le nombre de mots"], b: 2, e: "Mais, donc, car marquent les étapes." },
    { q: "La paraphrase consiste à :", r: ["citer avec les lignes", "évaluer la thèse", "définir les notions", "répéter le texte autrement sans l'expliquer"], b: 3, e: "Faute fréquente à éviter." },
    { q: "« Céder à la force est un acte de nécessité, non de volonté » est de :", r: ["Rousseau", "Descartes", "Sartre", "Platon"], b: 0, e: "Du contrat social, 1762." },
    { q: "Expliquer une expression, c'est d'abord :", r: ["la recopier", "définir ses termes", "donner son avis", "la contester"], b: 1, e: "Puis reformuler, situer, illustrer." },
    { q: "L'évaluation d'un texte comprend :", r: ["un résumé", "la biographie de l'auteur", "son intérêt et ses limites", "une liste de citations"], b: 2, e: "Avec une position argumentée." },
    { q: "Le « hors-texte » désigne :", r: ["une citation exacte", "une explication précise", "une objection pertinente", "un développement sans rapport avec le texte"], b: 3, e: "On parle du thème en général, pas de l'auteur." },
    { q: "Dans le texte de Rousseau, la thèse est que :", r: ["la force ne fonde pas le droit", "le plus fort a toujours raison", "il faut toujours obéir", "le droit est inutile"], b: 0, e: "Seul un pouvoir légitime oblige." },
    { q: "On cite le texte :", r: ["sans guillemets", "entre guillemets avec les lignes", "seulement dans l'introduction", "jamais"], b: 1, e: "C'est la preuve que l'on travaille sur le texte." }
  ],
  apc: { module: "Philosophie de Terminale C et D", famille: "Vie sociale et culturelle", agir: "Analyser un texte philosophique pour en évaluer la thèse", situation: "Au bac blanc d'un lycée de Bamenda, les élèves étudient un texte de Rousseau sur la force et le droit.", tache: "Dégager thème, problème et thèse, expliquer une phrase et évaluer la position de l'auteur." }
};
VRT_L("tle-c-philo-texte", Object.assign({ c: "Tle C" }, VRT_TCD_PHILO_TEXTE));
VRT_L("tle-d-philo-texte", Object.assign({ c: "Tle D" }, VRT_TCD_PHILO_TEXTE));

/* ══════════════════════ Philosophie — la conscience (Tle C, Tle D, 1re A) ══════════════════════ */

var VRT_PHILO_CONSCIENCE = {
  m: "philo", titre: "La conscience : nature, valeur et limites", duree: 30,
  accroche: "« Je pense, donc je suis » : mais suis-je vraiment ce que je crois être ?",
  intro: "Je sais que je lis cette phrase, je sais que j'ai faim, je sais que j'ai mal agi hier : c'est la conscience. Elle semble faire la grandeur de l'homme et fonder sa liberté. Pourtant, des penseurs ont montré qu'elle ne nous dit pas tout de nous-mêmes. Cette notion revient souvent au baccalauréat.",
  objectifs: ["définir la conscience et en distinguer les formes", "présenter la valeur de la conscience (Descartes, Pascal, Husserl)", "en montrer les limites (Spinoza, Marx, Freud)"],
  parties: [
    { t: "Définitions et formes", html:
      "<div class='def'><b>Étymologie et définition</b>Du latin <strong>cum scientia</strong>, « avec savoir ». La <strong>conscience</strong> est la connaissance plus ou moins claire que l'homme a de lui-même, de ses états et du monde qui l'entoure.</div>" +
      "<ul><li><strong>Conscience spontanée</strong> (ou immédiate) : je vois, j'entends, je ressens, sans y réfléchir.</li><li><strong>Conscience réfléchie</strong> : je fais retour sur moi-même (« je sais que je pense »).</li><li><strong>Conscience psychologique</strong> : savoir ce que l'on vit. <strong>Conscience morale</strong> : juger le bien et le mal de ses actes (remords, fierté). Rousseau : « Conscience ! conscience ! instinct divin, immortelle et céleste voix ».</li></ul>" +
      "<div class='astuce'><b>Husserl</b>« Toute conscience est conscience de quelque chose » : la conscience est toujours tournée vers un objet (c'est l'<strong>intentionnalité</strong>).</div>",
      retenir: "Conscience = « avec savoir » ; spontanée / réfléchie ; psychologique / morale ; intentionnalité (Husserl)." },
    { t: "La valeur de la conscience", html:
      "<ul><li><strong>Descartes</strong> (<em>Discours de la méthode</em>, 1637) : après avoir douté de tout, il trouve une certitude, « <strong>Je pense, donc je suis</strong> » (le cogito). La conscience est le premier fondement de la connaissance.</li><li><strong>Pascal</strong> : « L'homme n'est qu'un roseau, le plus faible de la nature ; mais c'est un <strong>roseau pensant</strong>. » Sa grandeur est de savoir qu'il est mortel.</li><li><strong>Liberté et responsabilité</strong> : parce que je suis conscient, je peux choisir et répondre de mes actes ; un tribunal tient compte du discernement de l'accusé.</li></ul>" +
      "<div class='savais'><b>Le savais-tu ?</b>Le code pénal camerounais, comme la plupart des codes, atténue la responsabilité de celui qui a agi sans discernement (démence, très jeune âge) : sans conscience, pas de pleine responsabilité.</div>",
      retenir: "Cogito (Descartes), roseau pensant (Pascal) : la conscience fonde la connaissance, la dignité et la responsabilité." },
    { t: "Les limites de la conscience", html:
      "<ul><li><strong>Spinoza</strong> : « Les hommes se croient libres parce qu'ils sont conscients de leurs actions et ignorants des causes qui les déterminent. »</li><li><strong>Marx</strong> : « Ce n'est pas la conscience des hommes qui détermine leur existence, c'est au contraire leur existence sociale qui détermine leur conscience. » Nos idées dépendent de notre milieu et de notre classe.</li><li><strong>Freud</strong> : une grande partie de notre vie psychique est <strong>inconsciente</strong> (désirs refoulés, lapsus, rêves, actes manqués) ; « le moi n'est pas maître dans sa propre maison ».</li></ul>" +
      "<div class='attention'><b>Nuance</b>Ces limites ne suppriment pas la conscience : elles invitent à l'élargir. Connaître ce qui nous détermine, c'est déjà commencer à s'en libérer (Spinoza).</div>",
      retenir: "Spinoza (illusion du libre arbitre), Marx (conditions sociales), Freud (inconscient) : la conscience n'est ni totale ni transparente." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> « Toute conscience est conscience de quelque chose » est une formule de :</p><ol type='a'><li>Descartes</li><li>Husserl</li><li>Freud</li><li>Marx</li></ol><details><summary>Voir la réponse</summary><p><strong>Husserl</strong> : c'est l'intentionnalité de la conscience.</p></details><p><strong>Exercice.</strong> Distingue conscience psychologique et conscience morale par deux exemples.</p><details><summary>Voir la réponse</summary><p>Psychologique : « je sais que j'ai peur avant l'examen ». Morale : « j'ai honte d'avoir copié sur mon voisin ».</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Ton cousin de Mbalmayo a insulté sa sœur sous le coup de la colère. Il se défend : « Ce n'est pas moi, je n'étais pas conscient de ce que je disais. »</p><p><strong>Tâche.</strong> Rédige un paragraphe argumenté (15 lignes) pour répondre à la question : « Peut-on être tenu responsable de ce que l'on fait sans en avoir conscience ? »</p><details><summary>Voir une réponse attendue</summary><p>D'un côté, la responsabilité suppose la conscience : selon Descartes, l'homme est un être pensant capable de juger ; la loi excuse celui qui n'a pas de discernement. Et Freud montre qu'une part de nos actes vient de l'inconscient. Mais la colère n'abolit pas totalement la conscience : le cousin savait qu'il parlait à sa sœur. Spinoza invite à connaître ce qui nous pousse pour mieux nous maîtriser ; une personne qui se sait colérique a le devoir de se surveiller. Conclusion : l'absence de conscience peut atténuer la faute, mais elle ne supprime pas la responsabilité de réparer (s'excuser) et d'apprendre à se maîtriser.</p></details></div>",
      retenir: "Savoir-être mobilisé : responsabilité et maîtrise de soi." }
  ],
  revision: ["<strong>Cum scientia</strong> : « avec savoir ».", "Spontanée / réfléchie ; psychologique / morale.", "Valeur : <strong>cogito</strong> (Descartes), <strong>roseau pensant</strong> (Pascal), intentionnalité (Husserl), responsabilité.", "Limites : <strong>Spinoza</strong>, <strong>Marx</strong>, <strong>Freud</strong> (inconscient).", "La connaissance de ses déterminations commence la liberté."],
  exo: "<p>Explique en cinq lignes la phrase de Spinoza : « Les hommes se croient libres parce qu'ils sont conscients de leurs actions et ignorants des causes qui les déterminent. » <em>(Nous voyons nos choix, pas ce qui les produit : éducation, désirs, milieu ; le sentiment de liberté peut être une illusion.)</em></p>",
  quiz: [
    { q: "Le mot « conscience » vient du latin :", r: ["cum scientia", "cogito", "anima", "ratio"], b: 0, e: "« Avec savoir »." },
    { q: "« Je pense, donc je suis » est de :", r: ["Pascal", "Descartes", "Husserl", "Freud"], b: 1, e: "Discours de la méthode, 1637." },
    { q: "La conscience morale permet de :", r: ["voir les couleurs", "se souvenir", "juger le bien et le mal de ses actes", "calculer"], b: 2, e: "Remords, fierté, sentiment du devoir." },
    { q: "Pour Pascal, l'homme est :", r: ["une machine", "un animal politique", "un loup pour l'homme", "un roseau pensant"], b: 3, e: "Faible mais grand par la pensée." },
    { q: "L'intentionnalité signifie que la conscience :", r: ["est toujours conscience de quelque chose", "est toujours morale", "est inconsciente", "n'existe pas"], b: 0, e: "Husserl." },
    { q: "Pour Marx, la conscience est déterminée par :", r: ["Dieu", "l'existence sociale", "l'inconscient", "la raison pure"], b: 1, e: "Préface à la Critique de l'économie politique, 1859." },
    { q: "Le lapsus et le rêve sont, pour Freud, des manifestations :", r: ["de la conscience morale", "du cogito", "de l'inconscient", "de la raison"], b: 2, e: "Des désirs refoulés se trahissent." },
    { q: "« Le moi n'est pas maître dans sa propre maison » est de :", r: ["Descartes", "Spinoza", "Rousseau", "Freud"], b: 3, e: "Le psychisme échappe en partie à la conscience." },
    { q: "La conscience réfléchie consiste à :", r: ["faire retour sur soi-même", "percevoir sans réfléchir", "dormir", "obéir à l'instinct"], b: 0, e: "« Je sais que je pense »." },
    { q: "Pour Spinoza, les hommes se croient libres parce qu'ils :", r: ["connaissent toutes les causes", "ignorent les causes qui les déterminent", "n'ont pas de conscience", "sont seuls"], b: 1, e: "Ils voient leurs actes, pas leurs causes." }
  ],
  apc: { module: "Philosophie", famille: "Vie sociale et culturelle", agir: "Réfléchir sur la conscience pour assumer ses actes", situation: "Un jeune de Mbalmayo dit ne pas être responsable d'insultes prononcées sous le coup de la colère.", tache: "Répondre de manière argumentée à la question de la responsabilité sans conscience." }
};
VRT_LX("tle-c-philo-conscience", "Tle C", "Nature, valeur et limites de la Conscience", VRT_PHILO_CONSCIENCE, { apc: Object.assign({}, VRT_PHILO_CONSCIENCE.apc, { module: "Philosophie de Terminale C" }) });
VRT_LX("tle-d-philo-conscience", "Tle D", "Nature, valeur et limites de la Conscience", VRT_PHILO_CONSCIENCE, { apc: Object.assign({}, VRT_PHILO_CONSCIENCE.apc, { module: "Philosophie de Terminale D" }) });
VRT_LX("1re-a-philo-conscience", "1re A", "La Conscience (types", VRT_PHILO_CONSCIENCE, { apc: Object.assign({}, VRT_PHILO_CONSCIENCE.apc, { module: "Philosophie de Première A" }) });

/* ══════════════════════ Philosophie — Tle A ══════════════════════ */

VRT_L("tle-a-philo-periode-moderne", {
  c: "Tle A", m: "philo", cle: "La période moderne : rationalisme", titre: "La période moderne : rationalisme, empirisme et existentialisme", duree: 30,
  accroche: "D'où viennent nos idées : de la raison, de l'expérience… ou de nos choix ?",
  intro: "Après le Moyen Âge, la philosophie s'émancipe de la théologie. Trois grands courants marquent les Temps modernes et contemporains : le rationalisme, qui fait confiance à la raison ; l'empirisme, qui fait tout venir de l'expérience ; l'existentialisme, qui place l'existence concrète et la liberté au centre. Kant tente entre les deux premiers une synthèse.",
  objectifs: ["présenter le rationalisme et l'empirisme et leurs représentants", "expliquer la synthèse kantienne", "définir l'existentialisme et la formule de Sartre"],
  parties: [
    { t: "Le rationalisme", html:
      "<div class='def'><b>Définition</b>Le <strong>rationalisme</strong> soutient que la <strong>raison</strong> est la source principale de la connaissance vraie ; certaines idées sont <strong>innées</strong>, présentes dans l'esprit avant toute expérience.</div>" +
      "<ul><li><strong>Descartes</strong> (1596-1650), <em>Discours de la méthode</em> (1637) : « Le bon sens est la chose du monde la mieux partagée » ; doute méthodique et cogito ; les idées claires et distinctes sont vraies.</li><li><strong>Spinoza</strong>, <strong>Leibniz</strong> : la réalité a un ordre rationnel que la raison peut connaître.</li></ul>",
      retenir: "Rationalisme : la raison, idées innées ; Descartes, Spinoza, Leibniz." },
    { t: "L'empirisme et la synthèse de Kant", html:
      "<div class='def'><b>Définition</b>L'<strong>empirisme</strong> soutient que toutes nos connaissances viennent de l'<strong>expérience</strong> sensible ; à la naissance, l'esprit est une « <strong>table rase</strong> », une page blanche.</div>" +
      "<ul><li><strong>John Locke</strong>, <em>Essai sur l'entendement humain</em> (1690) : il n'y a pas d'idées innées.</li><li><strong>David Hume</strong> (1711-1776) : l'idée de cause vient de l'<strong>habitude</strong> de voir deux faits se suivre, non de la raison.</li></ul>" +
      "<div class='def'><b>Kant et le criticisme</b><strong>Kant</strong>, <em>Critique de la raison pure</em> (1781) : la connaissance commence avec l'expérience, mais elle ne vient pas toute de l'expérience ; l'esprit apporte ses formes (espace, temps, catégories). « Des pensées sans contenu sont vides, des intuitions sans concepts sont aveugles. »</div>",
      retenir: "Empirisme : expérience, table rase (Locke, Hume) ; Kant : synthèse, la connaissance unit expérience et raison." },
    { t: "L'existentialisme", html:
      "<div class='def'><b>Définition</b>L'<strong>existentialisme</strong> est un courant des XIXᵉ et XXᵉ siècles qui part de l'<strong>existence concrète</strong> de l'individu : sa liberté, ses choix, son angoisse, sa mort.</div>" +
      "<ul><li><strong>Kierkegaard</strong> (1813-1855), existentialisme chrétien : l'individu seul devant Dieu.</li><li><strong>Jean-Paul Sartre</strong>, <em>L'existentialisme est un humanisme</em> (1946) : « <strong>L'existence précède l'essence</strong> » ; l'homme n'a pas de nature fixée d'avance, il se fait par ses actes ; il est « condamné à être libre » et responsable de tous ses choix.</li></ul>" +
      "<div class='ex'><b>Exemple</b>Pour Sartre, dire « je suis né paresseux » est de la mauvaise foi : on se cache derrière une prétendue nature pour fuir sa responsabilité.</div>",
      retenir: "Existentialisme : liberté, choix, responsabilité ; Sartre : « l'existence précède l'essence »." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> L'expression « table rase » appartient à :</p><ol type='a'><li>Descartes</li><li>Sartre</li><li>Locke</li><li>Leibniz</li></ol><details><summary>Voir la réponse</summary><p><strong>Locke</strong> : l'esprit est d'abord vide, l'expérience y inscrit tout.</p></details><p><strong>Exercice.</strong> Oppose rationalisme et empirisme sur l'origine des idées.</p><details><summary>Voir la réponse</summary><p>Rationalisme : certaines idées sont innées et la raison connaît le vrai. Empirisme : toutes les idées viennent de l'expérience sensible.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Un élève de ta classe à Sangmélima, qui a échoué au probatoire, dit : « Dans ma famille, personne n'a jamais réussi les études. C'est notre destin. »</p><p><strong>Tâche.</strong> Réponds-lui en 12 à 15 lignes en t'appuyant sur l'existentialisme de Sartre, puis nuance ta réponse.</p><details><summary>Voir une réponse attendue</summary><p>Pour Sartre, « l'existence précède l'essence » : il n'y a pas de destin écrit d'avance ; l'homme se définit par ce qu'il fait. Invoquer le destin familial, c'est de la mauvaise foi : une manière d'échapper à sa liberté. Ton camarade peut choisir de reprendre ses cours, de s'organiser, de demander de l'aide. Nuance : le milieu pèse réellement (moyens, encadrement), comme le rappellent les empiristes et les sociologues ; mais ces conditions sont une situation à dépasser, pas une fatalité. Être libre, c'est choisir ce qu'on fait de ce qu'on a reçu.</p></details></div>",
      retenir: "Savoir-être mobilisé : responsabilité et confiance en sa liberté." }
  ],
  revision: ["<strong>Rationalisme</strong> : raison, idées innées (Descartes, Spinoza, Leibniz).", "<strong>Empirisme</strong> : expérience, table rase (Locke 1690, Hume).", "<strong>Kant</strong> (1781) : la connaissance unit expérience et formes de l'esprit.", "<strong>Existentialisme</strong> : Kierkegaard, Sartre (1946).", "« L'existence précède l'essence » ; « condamné à être libre »."],
  exo: "<p>Explique la phrase de Kant : « Des pensées sans contenu sont vides, des intuitions sans concepts sont aveugles. » <em>(Sans expérience, la raison tourne à vide ; sans concepts, les sensations restent un chaos incompréhensible : il faut les deux pour connaître.)</em></p>",
  quiz: [
    { q: "Le rationalisme affirme que la connaissance vient surtout de :", r: ["la raison", "l'expérience", "la tradition", "la révélation"], b: 0, e: "Avec des idées innées." },
    { q: "« Le bon sens est la chose du monde la mieux partagée » ouvre :", r: ["l'Essai de Locke", "le Discours de la méthode", "la Critique de la raison pure", "L'existentialisme est un humanisme"], b: 1, e: "Descartes, 1637." },
    { q: "Pour Hume, l'idée de cause vient de :", r: ["Dieu", "la raison pure", "l'habitude", "l'innéité"], b: 2, e: "Nous voyons deux faits se suivre souvent." },
    { q: "La <em>Critique de la raison pure</em> est de :", r: ["Hume", "Descartes", "Sartre", "Kant"], b: 3, e: "1781." },
    { q: "« L'existence précède l'essence » est de :", r: ["Sartre", "Kierkegaard", "Locke", "Leibniz"], b: 0, e: "L'existentialisme est un humanisme, 1946." },
    { q: "Pour l'empirisme, l'esprit à la naissance est :", r: ["plein d'idées", "une table rase", "divin", "inconscient"], b: 1, e: "Locke." },
    { q: "Kierkegaard représente un existentialisme :", r: ["athée", "marxiste", "chrétien", "empiriste"], b: 2, e: "L'individu seul devant Dieu." },
    { q: "Pour Sartre, invoquer sa « nature » pour excuser ses actes relève de :", r: ["la sagesse", "la raison", "l'empirisme", "la mauvaise foi"], b: 3, e: "On fuit sa liberté." },
    { q: "Kant réalise une synthèse entre :", r: ["rationalisme et empirisme", "foi et raison", "marxisme et existentialisme", "Platon et Aristote"], b: 0, e: "Expérience et formes de l'esprit." },
    { q: "Spinoza et Leibniz sont des philosophes :", r: ["empiristes", "rationalistes", "existentialistes", "sophistes"], b: 1, e: "XVIIᵉ siècle." }
  ],
  apc: { module: "Philosophie de Terminale A", famille: "Vie sociale et culturelle", agir: "Mobiliser les courants modernes pour réfléchir à la liberté et au destin", situation: "Un élève de Sangmélima attribue son échec au probatoire au « destin » de sa famille.", tache: "Lui répondre à partir de l'existentialisme, puis nuancer." }
});

/* ══════════════════════ Philosophie — 1re C et 1re D ══════════════════════ */

var VRT_1CD_PHILO_METHODE = {
  m: "philo", cle: "La méthode de la Philosophie", titre: "La méthode de la philosophie", duree: 25,
  accroche: "Le physicien a son laboratoire ; le philosophe a sa méthode.",
  intro: "La philosophie n'utilise ni microscope ni expérience de laboratoire. Elle avance pourtant avec méthode : elle questionne, définit, problématise, argumente. Des philosophes ont même décrit leur méthode, de Socrate à Descartes. Ces outils te serviront dans toutes les disciplines.",
  objectifs: ["identifier les étapes de la démarche philosophique", "présenter la méthode socratique et la méthode cartésienne", "appliquer la démarche à une question de la vie courante"],
  parties: [
    { t: "Les quatre gestes du philosophe", html:
      "<ol><li><strong>Questionner</strong> : transformer une évidence en question (« Est-il toujours juste d'obéir à la loi ? »).</li><li><strong>Conceptualiser</strong> : définir précisément les notions, distinguer les sens (loi juridique, loi morale, loi scientifique).</li><li><strong>Problématiser</strong> : montrer pourquoi la question fait difficulté, en opposant des réponses possibles.</li><li><strong>Argumenter</strong> : justifier chaque affirmation par des raisons, des exemples, des références, et examiner les objections.</li></ol>" +
      "<div class='astuce'><b>Astuce</b>Ces quatre gestes sont exactement ceux de la dissertation : introduction (questionner, définir, problématiser), développement (argumenter).</div>",
      retenir: "Questionner, conceptualiser, problématiser, argumenter." },
    { t: "La méthode socratique", html:
      "<p>Socrate (Vᵉ siècle av. J.-C.) n'écrit rien : il dialogue sur l'agora d'Athènes. Sa méthode comporte deux moments :</p><ul><li><strong>L'ironie</strong> : il feint l'ignorance et pose des questions qui font apparaître les contradictions de son interlocuteur, qui croyait savoir.</li><li><strong>La maïeutique</strong> (« art de faire accoucher ») : comme sa mère sage-femme, il aide l'esprit de l'autre à découvrir lui-même la vérité.</li></ul>" +
      "<div class='ex'><b>Exemple</b>Dans le <em>Ménon</em> de Platon, Socrate amène un jeune esclave sans instruction à trouver comment doubler la surface d'un carré, uniquement par des questions.</div>",
      retenir: "Ironie (détruire les fausses certitudes) + maïeutique (faire naître la vérité) : le dialogue." },
    { t: "La méthode cartésienne et la dialectique", html:
      "<div class='def'><b>Les quatre règles de Descartes</b>(<em>Discours de la méthode</em>, 1637) : 1) <strong>évidence</strong> : n'accepter pour vrai que ce qui est clair et distinct ; 2) <strong>analyse</strong> : diviser chaque difficulté en parties ; 3) <strong>synthèse</strong> : aller du plus simple au plus complexe ; 4) <strong>dénombrement</strong> : tout vérifier pour ne rien omettre.</div>" +
      "<p>Le <strong>doute méthodique</strong> : douter de tout ce qui peut être mis en doute, non pour rester dans le doute, mais pour trouver une certitude.</p>" +
      "<div class='def'><b>La dialectique</b>Méthode qui fait progresser la pensée par la confrontation des contraires : chez Platon, le dialogue qui s'élève vers les idées ; chez Hegel, le mouvement thèse, antithèse, synthèse.</div>",
      retenir: "Descartes : évidence, analyse, synthèse, dénombrement ; doute méthodique ; dialectique : progresser par les contraires." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> La maïeutique est :</p><ol type='a'><li>l'art de convaincre par la force</li><li>l'art de faire découvrir la vérité par des questions</li><li>une règle de Descartes</li><li>une science expérimentale</li></ol><details><summary>Voir la réponse</summary><p><strong>L'art de faire découvrir la vérité par des questions</strong>, « accoucher les esprits ».</p></details><p><strong>Exercice (format du Probatoire).</strong> Définis les concepts « maïeutique » et « doute méthodique » et donne pour chacun une citation avec son auteur.</p><details><summary>Voir la réponse</summary><p>Maïeutique : art socratique de faire découvrir la vérité à l'interlocuteur par des questions ; « Connais-toi toi-même » (Socrate, devise de Delphes). Doute méthodique : douter de tout ce qui peut l'être pour trouver une certitude ; « Je pense, donc je suis » (Descartes, <em>Discours de la méthode</em>, 1637).</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Un message circule dans le groupe WhatsApp de ta classe à Bafia : « Boire de l'eau chaude avec du citron guérit le paludisme. Partagez ! »</p><p><strong>Tâche.</strong> Montre, en appliquant la méthode cartésienne et la démarche philosophique, comment examiner ce message avant de le croire ou de le partager.</p><details><summary>Voir une réponse attendue</summary><p>Règle de l'évidence : ne rien admettre sans preuve claire ; le message ne cite aucune source. Analyse : qui l'a écrit ? sur quelles preuves ? que disent les médecins et le ministère de la Santé ? Questionner : « guérir » ou seulement « soulager » ? Argumenter : le paludisme est causé par un parasite transmis par l'anophèle ; seuls des traitements antipaludiques prouvés le guérissent ; croire ce message peut retarder un traitement et tuer. Conclusion : douter méthodiquement, vérifier, et ne pas partager ce qui n'est pas prouvé.</p></details></div>",
      retenir: "Savoir-être mobilisé : esprit critique et responsabilité dans l'usage de l'information." }
  ],
  revision: ["Questionner, <strong>conceptualiser</strong>, <strong>problématiser</strong>, <strong>argumenter</strong>.", "Socrate : <strong>ironie</strong> et <strong>maïeutique</strong>.", "Descartes : <strong>évidence, analyse, synthèse, dénombrement</strong> ; doute méthodique.", "<strong>Dialectique</strong> : Platon, Hegel (thèse, antithèse, synthèse).", "Ces gestes structurent la dissertation."],
  exo: "<p>Conceptualise la notion de « loi » en distinguant trois sens, avec un exemple pour chacun. <em>(Loi juridique : le code de la route ; loi morale : ne pas mentir ; loi scientifique : la loi de la gravitation.)</em></p>",
  quiz: [
    { q: "Conceptualiser, c'est :", r: ["définir précisément les notions", "raconter une histoire", "citer un auteur", "conclure"], b: 0, e: "Distinguer les sens d'un mot." },
    { q: "La maïeutique est la méthode de :", r: ["Descartes", "Socrate", "Kant", "Hegel"], b: 1, e: "« Art de faire accoucher » les esprits." },
    { q: "L'ironie socratique consiste à :", r: ["se moquer méchamment", "réciter des leçons", "feindre l'ignorance pour révéler les contradictions", "refuser de parler"], b: 2, e: "Elle détruit les fausses certitudes." },
    { q: "La première règle de Descartes est celle de :", r: ["l'analyse", "la synthèse", "le dénombrement", "l'évidence"], b: 3, e: "N'accepter que ce qui est clair et distinct." },
    { q: "Le doute méthodique sert à :", r: ["trouver une certitude", "rester dans le doute", "refuser toute science", "croire sans examen"], b: 0, e: "On doute pour fonder le vrai." },
    { q: "Diviser une difficulté en parties correspond à :", r: ["l'évidence", "l'analyse", "le dénombrement", "la synthèse"], b: 1, e: "Deuxième règle." },
    { q: "Le mouvement thèse, antithèse, synthèse est associé à :", r: ["Socrate", "Descartes", "Hegel", "Locke"], b: 2, e: "La dialectique hégélienne." },
    { q: "Problématiser, c'est :", r: ["résumer", "conclure", "définir un mot", "montrer pourquoi la question fait difficulté"], b: 3, e: "Opposer des réponses possibles." },
    { q: "Dans le <em>Ménon</em>, Socrate fait découvrir un problème de géométrie à :", r: ["un jeune esclave", "un roi", "un médecin", "un sophiste célèbre"], b: 0, e: "Uniquement par des questions." },
    { q: "Le <em>Discours de la méthode</em> date de :", r: ["1781", "1637", "1690", "1946"], b: 1, e: "Descartes." }
  ],
  apc: { module: "Philosophie de Première C et D", famille: "Vie sociale et culturelle", agir: "Appliquer une méthode rigoureuse pour examiner une information", situation: "Un message non vérifié sur la guérison du paludisme circule dans un groupe WhatsApp de classe à Bafia.", tache: "Examiner le message avec la méthode cartésienne et la démarche philosophique." }
};
VRT_L("1re-c-philo-methode", Object.assign({ c: "1re C" }, VRT_1CD_PHILO_METHODE));
VRT_L("1re-d-philo-methode", Object.assign({ c: "1re D" }, VRT_1CD_PHILO_METHODE));

/* ══════════════════════ Français — 1re C, 1re D, Tle C, Tle D ══════════════════════ */

var VRT_CD_FR_NARRATIF = {
  m: "francais", cle: "Le texte narratif : caractéristiques", titre: "Le texte narratif : caractéristiques et fonctions", duree: 25,
  accroche: "Un narrateur, des personnages, une intrigue : tout récit obéit à une architecture.",
  intro: "Romans, nouvelles, contes, faits divers : le texte narratif raconte une suite d'événements. Au programme, <em>Au cœur des ténèbres</em> de Joseph Conrad ou <em>Le Vieux Nègre et la médaille</em> de Ferdinand Oyono s'analysent avec les mêmes outils : qui raconte, comment l'histoire est construite, quel rôle jouent les personnages, et à quoi sert le récit.",
  objectifs: ["identifier le narrateur et les points de vue", "appliquer le schéma narratif et le schéma actantiel", "dégager les fonctions d'un récit"],
  parties: [
    { t: "Le narrateur et les points de vue", html:
      "<div class='def'><b>Auteur et narrateur</b>L'<strong>auteur</strong> est la personne réelle qui écrit ; le <strong>narrateur</strong> est la voix qui raconte dans le texte. Il peut être <strong>personnage</strong> de l'histoire (récit à la 1re personne : Toundi dans <em>Une vie de boy</em> d'Oyono) ou <strong>extérieur</strong> à l'histoire (récit à la 3e personne).</div>" +
      "<div class='def'><b>Les points de vue (focalisations)</b><strong>Omniscient</strong> (focalisation zéro) : le narrateur sait tout, même les pensées de tous. <strong>Interne</strong> : on voit à travers les yeux d'un personnage. <strong>Externe</strong> : on voit de l'extérieur, comme une caméra, sans accès aux pensées.</div>",
      retenir: "Auteur ≠ narrateur ; narrateur personnage ou extérieur ; focalisation zéro, interne, externe." },
    { t: "La structure du récit", html:
      "<div class='def'><b>Le schéma narratif</b>1) <strong>Situation initiale</strong> ; 2) <strong>élément perturbateur</strong> ; 3) <strong>péripéties</strong> ; 4) <strong>élément de résolution</strong> ; 5) <strong>situation finale</strong>.</div>" +
      "<div class='def'><b>Le schéma actantiel</b>Le <strong>sujet</strong> (héros) recherche un <strong>objet</strong> ; il est aidé par des <strong>adjuvants</strong> et gêné par des <strong>opposants</strong> ; un <strong>destinateur</strong> le pousse à agir, au profit d'un <strong>destinataire</strong>.</div>" +
      "<div class='ex'><b>Exemple</b><em>Le Vieux Nègre et la médaille</em> : situation initiale, Meka, catéchumène modèle, a donné ses terres à la mission ; élément perturbateur, l'annonce de la médaille ; péripéties, la cérémonie, l'ivresse, l'orage, l'arrestation ; situation finale, Meka désabusé, qui comprend le mépris colonial.</div>" +
      "<div class='astuce'><b>Les temps du récit</b>Passé simple : actions de premier plan ; imparfait : arrière-plan, descriptions, habitudes.</div>",
      retenir: "Schéma narratif en 5 étapes ; schéma actantiel en 6 rôles ; passé simple / imparfait." },
    { t: "Les fonctions du récit", html:
      "<ul><li><strong>Divertir</strong> : susciter le plaisir, le suspense, l'émotion.</li><li><strong>Informer</strong> et faire connaître une société, une époque.</li><li><strong>Dénoncer</strong> : la colonisation chez Oyono, la condition de la femme chez Mariama Bâ, la brutalité de l'exploitation coloniale au Congo chez Conrad.</li><li><strong>Faire réfléchir</strong> et transmettre des valeurs (contes, fables, récits initiatiques).</li></ul>" +
      "<div class='savais'><b>Le savais-tu ?</b><em>Au cœur des ténèbres</em> (1899) est raconté par Marlow à des compagnons, sur un bateau sur la Tamise : un récit dans le récit, qui fait entendre la voix d'un témoin troublé.</div>",
      retenir: "Divertir, informer, dénoncer, faire réfléchir : un récit a souvent plusieurs fonctions." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Dans un récit en focalisation interne, le lecteur :</p><ol type='a'><li>connaît les pensées de tous les personnages</li><li>voit les événements à travers un personnage</li><li>ne connaît aucune pensée</li><li>lit un dialogue de théâtre</li></ol><details><summary>Voir la réponse</summary><p>Il <strong>voit les événements à travers un personnage</strong>, avec ses perceptions et ses pensées.</p></details><p><strong>Exercice.</strong> Donne le temps et sa valeur : « Il pleuvait sur Yaoundé. Soudain, la porte s'ouvrit. »</p><details><summary>Voir la réponse</summary><p>« pleuvait » : imparfait, arrière-plan (décor) ; « s'ouvrit » : passé simple, action de premier plan, soudaine.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Pour le concours de nouvelles du club de lecture de ton lycée à Edéa, tu dois écrire un récit court sur un jeune qui quitte son village pour chercher du travail à Douala.</p><p><strong>Tâche.</strong> Établis le schéma narratif et le schéma actantiel de ta nouvelle, précise le narrateur et la focalisation choisis, et dis quelle fonction tu donnes à ton récit.</p><details><summary>Voir une réponse attendue</summary><p>Schéma narratif : situation initiale, Essomba aide ses parents aux champs à Pouma ; perturbation, la récolte est perdue ; péripéties, arrivée à Douala, petits boulots, escroquerie d'un faux recruteur ; résolution, un menuisier l'engage comme apprenti ; situation finale, il ouvre son atelier et aide sa famille. Schéma actantiel : sujet, Essomba ; objet, un travail digne ; destinateur, la pauvreté et l'amour des siens ; destinataire, sa famille ; adjuvant, le menuisier ; opposant, le faux recruteur. Narrateur extérieur, focalisation interne sur Essomba. Fonction : divertir et dénoncer les escroqueries à l'emploi.</p></details></div>",
      retenir: "Savoir-être mobilisé : créativité et regard critique sur la société." }
  ],
  revision: ["<strong>Auteur ≠ narrateur</strong> ; narrateur personnage ou extérieur.", "Focalisation <strong>zéro</strong> (omniscient), <strong>interne</strong>, <strong>externe</strong>.", "Schéma narratif : situation initiale, perturbation, péripéties, résolution, situation finale.", "Schéma actantiel : sujet, objet, destinateur, destinataire, adjuvant, opposant.", "Fonctions : divertir, informer, dénoncer, faire réfléchir."],
  exo: "<p>Établis le schéma actantiel d'un conte que tu connais (par exemple Kulu la tortue). <em>(Sujet, objet, adjuvants, opposants, destinateur, destinataire : vérifie que chaque rôle est rempli par un personnage ou une force.)</em></p>",
  quiz: [
    { q: "Le narrateur est :", r: ["la voix qui raconte dans le texte", "l'auteur réel", "l'éditeur", "le lecteur"], b: 0, e: "Il peut différer totalement de l'auteur." },
    { q: "Dans la focalisation zéro, le narrateur :", r: ["ne sait rien", "sait tout, même les pensées", "voit comme une caméra", "est un personnage secondaire"], b: 1, e: "On parle aussi de point de vue omniscient." },
    { q: "L'élément perturbateur :", r: ["termine l'histoire", "décrit le décor", "rompt l'équilibre initial", "présente l'auteur"], b: 2, e: "Il lance l'action." },
    { q: "Dans le schéma actantiel, l'opposant :", r: ["aide le héros", "est l'objet recherché", "pousse le héros à agir", "gêne le héros"], b: 3, e: "Personnage ou force qui fait obstacle." },
    { q: "Le passé simple exprime surtout :", r: ["les actions de premier plan", "le décor", "les habitudes", "les descriptions"], b: 0, e: "L'imparfait sert à l'arrière-plan." },
    { q: "<em>Une vie de boy</em> est raconté par :", r: ["un narrateur omniscient", "Toundi, à la première personne", "le commandant", "Meka"], b: 1, e: "Sous forme de journal intime." },
    { q: "La focalisation externe ne donne pas accès :", r: ["aux actions", "aux paroles", "aux pensées des personnages", "aux lieux"], b: 2, e: "On voit de l'extérieur, comme une caméra." },
    { q: "Le narrateur d'<em>Au cœur des ténèbres</em> est :", r: ["Kurtz", "Conrad lui-même", "Toundi", "Marlow"], b: 3, e: "Il raconte son voyage sur le fleuve Congo." },
    { q: "Une fonction de dénonciation vise à :", r: ["critiquer une injustice", "faire rire seulement", "décrire un paysage", "enseigner la grammaire"], b: 0, e: "Oyono dénonce la colonisation." },
    { q: "La dernière étape du schéma narratif est :", r: ["l'élément de résolution", "la situation finale", "les péripéties", "la situation initiale"], b: 1, e: "Un nouvel équilibre." }
  ],
  apc: { module: "Français de Première et Terminale C et D", famille: "Vie sociale et culturelle", agir: "Analyser et construire un récit à l'aide des outils de la narratologie", situation: "Un club de lecture d'Edéa organise un concours de nouvelles sur l'exode rural.", tache: "Établir les schémas narratif et actantiel, le narrateur, la focalisation et la fonction du récit." }
};
VRT_L("1re-c-francais-narratif", Object.assign({ c: "1re C" }, VRT_CD_FR_NARRATIF));
VRT_L("1re-d-francais-narratif", Object.assign({ c: "1re D" }, VRT_CD_FR_NARRATIF));
VRT_L("tle-c-francais-narratif", Object.assign({ c: "Tle C" }, VRT_CD_FR_NARRATIF));
VRT_L("tle-d-francais-narratif", Object.assign({ c: "Tle D" }, VRT_CD_FR_NARRATIF));

var VRT_CD_FR_IDEES = {
  m: "francais", cle: "la dissertation : recherche des idées", titre: "La dissertation : rechercher les idées et les exemples", duree: 25,
  accroche: "Une page blanche n'est pas un manque d'idées : c'est un manque de méthode.",
  intro: "Une fois le sujet analysé et la problématique posée, beaucoup d'élèves restent bloqués : « je n'ai pas d'idées ». La recherche des idées est pourtant une technique, qui s'apprend : questionner le sujet, puiser dans ses lectures, classer ce que l'on trouve. C'est l'étape qui prépare le plan.",
  objectifs: ["utiliser des techniques pour trouver des arguments", "choisir des exemples littéraires précis et pertinents", "classer les idées pour préparer un plan"],
  parties: [
    { t: "Trouver des arguments", html:
      "<ol><li><strong>Le remue-méninges</strong> : noter au brouillon, sans trier, tout ce que le sujet évoque (idées, œuvres, auteurs, souvenirs de lecture).</li><li><strong>Les questions clés</strong> : Pourquoi ? Comment ? Dans quels cas ? Jusqu'à quel point ? Pour qui ?</li><li><strong>Le pour et le contre</strong> : chercher ce qui justifie la thèse du sujet, puis ce qui la limite.</li><li><strong>Les notions voisines</strong> : un sujet sur le roman fait penser au lecteur, au réalisme, à l'engagement, au plaisir.</li></ol>" +
      "<div class='def'><b>Argument et exemple</b>L'<strong>argument</strong> est une idée générale qui justifie une affirmation ; l'<strong>exemple</strong> est un fait précis (une œuvre, une scène, un personnage) qui illustre l'argument.</div>",
      retenir: "Remue-méninges, questions clés, pour et contre, notions voisines ; argument ≠ exemple." },
    { t: "Choisir de bons exemples", html:
      "<ul><li><strong>Précis</strong> : titre, auteur, personnage, scène (« dans <em>Le Vieux Nègre et la médaille</em>, la scène où Meka, serré dans sa veste, attend des heures en plein soleil »).</li><li><strong>Variés</strong> : plusieurs genres, époques, aires culturelles (littérature africaine, française, étrangère).</li><li><strong>Analysés</strong> : on montre en une ou deux phrases en quoi l'exemple prouve l'argument.</li></ul>" +
      "<div class='attention'><b>À éviter</b>Les exemples vagues (« dans beaucoup de romans… »), les résumés d'œuvre complets, les exemples tirés de films ou de séries quand le sujet porte sur la littérature (sauf s'ils sont pertinents et secondaires).</div>" +
      "<div class='astuce'><b>Astuce</b>Constitue-toi pendant l'année un carnet de « fiches exemples » : pour chaque œuvre étudiée, trois scènes clés, trois citations courtes, les thèmes qu'elle illustre.</div>",
      retenir: "Exemples précis, variés, analysés ; tenir un carnet d'exemples." },
    { t: "Classer les idées", html:
      "<p>Les idées trouvées sont <strong>regroupées</strong> par affinité, puis rangées selon la problématique :</p><ul><li>pour un plan <strong>dialectique</strong> : ce qui défend la thèse / ce qui la limite / le dépassement ;</li><li>pour un plan <strong>analytique</strong> : les causes, les manifestations, les conséquences ; ou les différents aspects d'une notion.</li></ul>" +
      "<div class='ex'><b>Exemple</b>Sujet : « Le roman doit avant tout divertir. » Idées pour : suspense, évasion, plaisir de l'intrigue (Alexandre Dumas). Idées contre : dénonciation (Oyono, Mongo Beti), réflexion morale (Mariama Bâ), connaissance de l'homme. Dépassement : le plaisir de lecture est un moyen de faire passer la critique (l'humour d'Oyono).</div>",
      retenir: "Regrouper, puis ordonner selon la problématique : le classement prépare le plan." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Un exemple littéraire efficace doit être :</p><ol type='a'><li>vague et général</li><li>un résumé complet de l'œuvre</li><li>précis et analysé</li><li>tiré uniquement d'un film</li></ol><details><summary>Voir la réponse</summary><p><strong>Précis et analysé</strong> : œuvre, auteur, scène, et lien explicite avec l'argument.</p></details><p><strong>Exercice.</strong> Distingue argument et exemple : « La poésie exprime les sentiments. Dans « Femme noire », Senghor célèbre la beauté de la femme africaine. »</p><details><summary>Voir la réponse</summary><p>Argument : la poésie exprime les sentiments. Exemple : le poème « Femme noire » de Senghor.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> En devoir à Sangmélima, le sujet est : « La lecture des œuvres littéraires est-elle encore utile à l'ère du numérique ? » Ta voisine a écrit au brouillon : « oui c'est utile », et rien d'autre.</p><p><strong>Tâche.</strong> Montre-lui comment trouver des idées : propose quatre arguments (deux pour, deux contre ou de nuance), chacun avec un exemple précis, puis classe-les en un plan.</p><details><summary>Voir une réponse attendue</summary><p>Pour : 1) la littérature fait connaître l'histoire et la société (Oyono et la colonisation) ; 2) elle forme l'esprit critique et la langue (l'ironie de Mongo Beti dans <em>Le Pauvre Christ de Bomba</em>). Contre ou nuance : 3) le numérique offre d'autres accès rapides au savoir (encyclopédies en ligne, vidéos éducatives) ; 4) les œuvres elles-mêmes se lisent aujourd'hui sur écran et en livre audio. Plan : I. Le numérique concurrence la lecture littéraire (arguments 3) ; II. Mais la littérature apporte ce que l'écran ne remplace pas (1, 2) ; III. Le numérique peut devenir un allié de la lecture (4).</p></details></div>",
      retenir: "Savoir-être mobilisé : méthode et persévérance." }
  ],
  revision: ["Techniques : <strong>remue-méninges</strong>, questions clés, pour et contre, notions voisines.", "<strong>Argument</strong> (idée générale) ≠ <strong>exemple</strong> (fait précis).", "Exemples <strong>précis, variés, analysés</strong>.", "Classer selon la problématique (dialectique ou analytique).", "Tenir un carnet de fiches exemples."],
  exo: "<p>Pour le sujet « Le théâtre est fait pour être vu et non pour être lu », trouve deux arguments pour et deux contre, avec un exemple chacun. <em>(Pour : la mise en scène, le jeu des acteurs, le public ; contre : la lecture permet de savourer le texte, les didascalies guident l'imagination.)</em></p>",
  quiz: [
    { q: "Le remue-méninges consiste à :", r: ["noter toutes les idées sans les trier", "rédiger directement la copie", "recopier le sujet", "choisir un seul exemple"], b: 0, e: "On trie ensuite." },
    { q: "Un argument est :", r: ["un titre d'œuvre", "une idée générale qui justifie", "une citation", "un nom d'auteur"], b: 1, e: "L'exemple vient l'illustrer." },
    { q: "Un bon exemple est :", r: ["« dans beaucoup de romans »", "le résumé complet d'une œuvre", "une scène précise d'une œuvre, analysée", "un proverbe sans source"], b: 2, e: "Précis et relié à l'argument." },
    { q: "Pour un plan dialectique, on classe les idées en :", r: ["causes et conséquences", "ordre alphabétique", "ordre chronologique", "thèse, limites, dépassement"], b: 3, e: "Selon la problématique." },
    { q: "Varier les exemples, c'est :", r: ["puiser dans plusieurs genres et époques", "citer toujours le même auteur", "n'utiliser que des films", "éviter la littérature africaine"], b: 0, e: "Cela montre une culture étendue." },
    { q: "« Pourquoi ? Comment ? Dans quels cas ? » sont :", r: ["des transitions", "des questions clés pour trouver des idées", "des conclusions", "des citations"], b: 1, e: "Elles ouvrent le sujet." },
    { q: "<em>Le Pauvre Christ de Bomba</em> est de :", r: ["Ferdinand Oyono", "Mariama Bâ", "Mongo Beti", "Senghor"], b: 2, e: "1956, roman satirique." },
    { q: "Le carnet de fiches exemples sert à :", r: ["noter ses notes", "remplacer les cours", "copier pendant l'examen", "réunir scènes et citations pour les devoirs"], b: 3, e: "On le construit pendant l'année." },
    { q: "La recherche des idées prépare directement :", r: ["le plan", "la note", "l'introduction seulement", "la correction"], b: 0, e: "Les idées classées deviennent les parties." },
    { q: "Analyser un exemple, c'est :", r: ["le citer sans commentaire", "montrer en quoi il prouve l'argument", "le résumer en entier", "le mettre en conclusion"], b: 1, e: "Une ou deux phrases suffisent." }
  ],
  apc: { module: "Français de Première et Terminale C et D", famille: "Vie sociale et culturelle", agir: "Rechercher et organiser des idées pour construire une dissertation", situation: "En devoir à Sangmélima, une élève n'a trouvé qu'une phrase sur l'utilité de la lecture à l'ère du numérique.", tache: "Proposer des arguments avec exemples et les classer en plan." }
};
VRT_L("1re-c-francais-recherche-idees", Object.assign({ c: "1re C" }, VRT_CD_FR_IDEES));
VRT_L("1re-d-francais-recherche-idees", Object.assign({ c: "1re D" }, VRT_CD_FR_IDEES));
VRT_L("tle-c-francais-recherche-idees", Object.assign({ c: "Tle C" }, VRT_CD_FR_IDEES));
VRT_L("tle-d-francais-recherche-idees", Object.assign({ c: "Tle D" }, VRT_CD_FR_IDEES));

/* ══════════════════════ Français — Tle A et 1re A ══════════════════════ */

var VRT_A_FR_LECTURE_METHODIQUE = {
  m: "francais", cle: "Commentaire composé (lecture méthodique du texte)", titre: "Commentaire composé : la lecture méthodique du texte", duree: 25,
  accroche: "Observer, supposer, vérifier : lire un texte comme un enquêteur.",
  intro: "Après l'analyse de la consigne vient le travail sur le texte lui-même. La lecture méthodique est une démarche organisée qui part de l'observation des faits d'écriture pour construire des hypothèses de lecture, puis les vérifier. C'est elle qui fournit la matière du commentaire composé.",
  objectifs: ["conduire une première lecture d'observation", "formuler des hypothèses de lecture", "relever et interpréter les procédés dans un tableau"],
  parties: [
    { t: "Observer le texte", html:
      "<ul><li><strong>Le paratexte</strong> : auteur, œuvre, date, genre, mouvement.</li><li><strong>La forme</strong> : vers ou prose, strophes, longueur, ponctuation, structure visible.</li><li><strong>L'énonciation</strong> : qui parle (je, nous, il), à qui (tu, vous, apostrophes), quand et où (indices de temps et de lieu).</li><li><strong>Les champs lexicaux</strong> dominants, les répétitions, les mots marquants.</li><li><strong>La tonalité</strong> : lyrique, épique, élégiaque, polémique, satirique, tragique.</li></ul>" +
      "<div class='astuce'><b>Astuce</b>Lis le texte au moins trois fois : une fois pour comprendre, une fois crayon en main, une fois à voix basse pour entendre le rythme.</div>",
      retenir: "Paratexte, forme, énonciation, champs lexicaux, tonalité : la grille d'observation." },
    { t: "Formuler des hypothèses de lecture", html:
      "<div class='def'><b>Hypothèse de lecture</b>Une <strong>idée directrice</strong> sur le sens ou l'effet du texte, née de l'observation, qu'il faudra vérifier par l'analyse. Elle se formule comme une affirmation provisoire : « Le poète célèbre sa terre natale », « Le narrateur dénonce par l'ironie ».</div>" +
      "<p>Deux ou trois hypothèses suffisent ; ce sont souvent les futures parties du commentaire. Quand la consigne donne des pistes, les hypothèses les reprennent.</p>" +
      "<div class='attention'><b>Attention</b>Une hypothèse sans preuve dans le texte est abandonnée. On ne plaque pas sur le texte ce qu'on sait de l'auteur.</div>",
      retenir: "Hypothèse = idée directrice provisoire, à vérifier par des relevés." },
    { t: "Vérifier : le tableau d'analyse", html:
      "<p>Pour chaque hypothèse, on construit un tableau à trois colonnes : <strong>relevé</strong> (citation avec la ligne ou le vers) ; <strong>procédé</strong> (figure de style, temps verbal, rythme, sonorités…) ; <strong>interprétation</strong> (l'effet produit, le sens).</p>" +
      "<div class='ex'><b>Exemple</b>Hypothèse : le poète exprime la nostalgie. Relevé : « Je me souviens… » (v. 1). Procédé : anaphore de « je me souviens », imparfait. Interprétation : le retour obsédant du passé traduit le regret d'un temps perdu.</div>" +
      "<div class='savais'><b>Le savais-tu ?</b>Le correcteur valorise la triade citation, procédé, interprétation : une citation sans procédé est de la paraphrase ; un procédé sans interprétation est un catalogue.</div>",
      retenir: "Relevé, procédé, interprétation : jamais l'un sans les deux autres." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Une hypothèse de lecture est :</p><ol type='a'><li>le résumé du texte</li><li>une idée directrice provisoire à vérifier</li><li>la biographie de l'auteur</li><li>une figure de style</li></ol><details><summary>Voir la réponse</summary><p><strong>Une idée directrice provisoire à vérifier</strong> par des relevés dans le texte.</p></details><p><strong>Exercice.</strong> Complète la triade : relevé « Ô Afrique ! » ; procédé ? ; interprétation ?</p><details><summary>Voir la réponse</summary><p>Procédé : apostrophe et interjection « Ô », phrase exclamative. Interprétation : le poète s'adresse directement à l'Afrique personnifiée, avec ferveur : tonalité lyrique et célébration.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> En préparation du commentaire composé, ton groupe d'étude à Foumban reçoit un poème qui parle d'un village abandonné après l'exode des jeunes vers la ville. Personne ne sait par où commencer.</p><p><strong>Tâche.</strong> Décris la démarche de lecture méthodique que le groupe doit suivre, propose deux hypothèses de lecture plausibles et le type de procédés à chercher pour chacune.</p><details><summary>Voir une réponse attendue</summary><p>Démarche : lire trois fois ; noter le paratexte ; observer la forme, l'énonciation (qui parle ? un ancien ? le poète ?), les champs lexicaux (le vide, le silence, la ruine ; la ville, le départ), la tonalité. Hypothèse 1 : le poète peint la désolation du village (procédés : champ lexical du vide et de la mort, imparfait de description, personnification des cases, rythme lent). Hypothèse 2 : il exprime un regret et un appel au retour (procédés : apostrophes aux jeunes, interrogations, impératifs, opposition village/ville). On vérifie chaque hypothèse dans un tableau relevé, procédé, interprétation.</p></details></div>",
      retenir: "Savoir-être mobilisé : méthode, patience et travail en équipe." }
  ],
  revision: ["Observer : <strong>paratexte, forme, énonciation, champs lexicaux, tonalité</strong>.", "<strong>Hypothèses de lecture</strong> : 2 ou 3 idées directrices provisoires.", "Vérifier : tableau <strong>relevé / procédé / interprétation</strong>.", "Hypothèses vérifiées = centres d'intérêt du commentaire.", "Pas de citation sans procédé ni procédé sans interprétation."],
  exo: "<p>Pour le vers « Demain, dès l'aube, à l'heure où blanchit la campagne, / Je partirai » (Hugo), remplis une ligne de tableau. <em>(Relevé : « Demain », « Je partirai » ; procédé : futur, indices de temps en accumulation ; interprétation : détermination du poète, départ solennel et inéluctable.)</em></p>",
  quiz: [
    { q: "La première étape de la lecture méthodique est :", r: ["l'observation du texte", "la rédaction", "la conclusion", "la biographie"], b: 0, e: "On part des faits d'écriture." },
    { q: "L'énonciation étudie :", r: ["les rimes", "qui parle, à qui, quand et où", "le nombre de syllabes", "la date de publication"], b: 1, e: "Indices personnels, de temps et de lieu." },
    { q: "Une tonalité qui exprime la plainte et le deuil est :", r: ["épique", "satirique", "élégiaque", "comique"], b: 2, e: "L'élégie est un chant de tristesse." },
    { q: "Le tableau d'analyse comporte :", r: ["deux colonnes", "une seule colonne", "quatre colonnes", "relevé, procédé, interprétation"], b: 3, e: "Trois colonnes." },
    { q: "Une hypothèse sans preuve dans le texte doit être :", r: ["abandonnée", "gardée quand même", "mise en conclusion", "recopiée"], b: 0, e: "Le texte fait foi." },
    { q: "Un catalogue de procédés sans interprétation est :", r: ["valorisé", "un défaut", "obligatoire", "une hypothèse"], b: 1, e: "Il faut dire l'effet produit." },
    { q: "Un champ lexical est :", r: ["une figure de style", "une strophe", "un ensemble de mots liés à un même thème", "une rime"], b: 2, e: "Par exemple le vide, la mort, la ruine." },
    { q: "Combien d'hypothèses de lecture retenir en général ?", r: ["une seule", "dix", "aucune", "deux ou trois"], b: 3, e: "Elles deviennent les centres d'intérêt." },
    { q: "L'apostrophe « Ô Afrique ! » relève surtout de la tonalité :", r: ["lyrique", "comique", "didactique", "réaliste"], b: 0, e: "Expression fervente des sentiments." },
    { q: "Lire à voix basse le texte permet surtout de percevoir :", r: ["la date", "le rythme et les sonorités", "le nom de l'éditeur", "la consigne"], b: 1, e: "Utile surtout en poésie." }
  ],
  apc: { module: "Français de Première et Terminale A", famille: "Vie sociale et culturelle", agir: "Conduire la lecture méthodique d'un texte pour préparer un commentaire composé", situation: "Un groupe d'étude de Foumban reçoit un poème sur un village abandonné après l'exode des jeunes.", tache: "Décrire la démarche, proposer des hypothèses de lecture et les procédés à chercher." }
};
VRT_L("tle-a-francais-lecture-methodique", Object.assign({ c: "Tle A" }, VRT_A_FR_LECTURE_METHODIQUE));
VRT_L("1re-a-francais-lecture-methodique", Object.assign({ c: "1re A" }, VRT_A_FR_LECTURE_METHODIQUE));

/* ══════════════════════ Géographie — Tle A, C et D ══════════════════════ */

var VRT_TLE_GEO_VILLES = {
  m: "geo", cle: "Les villes du Cameroun", titre: "Les villes du Cameroun", duree: 25,
  accroche: "Plus d'un Camerounais sur deux vit en ville : une révolution silencieuse.",
  intro: "En 1960, moins d'un Camerounais sur cinq vivait en ville ; aujourd'hui, c'est plus de la moitié. Douala et Yaoundé sont devenues des métropoles de plusieurs millions d'habitants, entourées d'un réseau de villes régionales. Cette croissance rapide apporte des opportunités, mais aussi de lourds problèmes.",
  objectifs: ["présenter l'origine et la hiérarchie des villes camerounaises", "expliquer les causes de la croissance urbaine", "analyser les problèmes urbains et les solutions"],
  parties: [
    { t: "Origine et hiérarchie des villes", html:
      "<ul><li><strong>Villes précoloniales</strong> : capitales de royaumes et de lamidats, comme Foumban, Maroua, Garoua, Ngaoundéré.</li><li><strong>Villes coloniales</strong> : postes administratifs, militaires et commerciaux, comme Douala (port), Yaoundé (poste allemand fondé en 1889), Kribi, Edéa, Buea (capitale du Kamerun allemand jusqu'en 1909).</li><li><strong>Villes récentes</strong> : chefs-lieux administratifs, villes nées des chantiers ou des carrefours.</li></ul>" +
      "<div class='def'><b>La hiérarchie urbaine</b>Deux <strong>métropoles</strong> : <strong>Douala</strong>, capitale économique (port, industries, commerce) et <strong>Yaoundé</strong>, capitale politique (institutions, administration, universités) ; des <strong>métropoles régionales</strong> (Garoua, Bamenda, Bafoussam, Maroua, Ngaoundéré, Bertoua, Ebolowa, Buea) ; des villes moyennes et petites.</div>",
      retenir: "Villes précoloniales, coloniales, récentes ; bicéphalie Douala (économie) / Yaoundé (politique)." },
    { t: "Les causes de la croissance urbaine", html:
      "<ul><li><strong>L'exode rural</strong> : recherche d'emploi, d'écoles, de soins, de loisirs ; fuite de la pauvreté rurale.</li><li><strong>La croissance naturelle</strong> des citadins, population jeune et féconde.</li><li><strong>L'insécurité</strong> dans certaines régions (Extrême-Nord, Nord-Ouest, Sud-Ouest), qui pousse des déplacés vers les villes.</li><li><strong>Le rôle de l'État</strong> : administrations, universités, investissements concentrés dans les villes.</li></ul>" +
      "<div class='savais'><b>Le savais-tu ?</b>Le taux d'urbanisation du Cameroun dépasse 58 % ; Douala et Yaoundé comptent chacune environ 4 millions d'habitants.</div>",
      retenir: "Exode rural, croissance naturelle, insécurité, concentration des services : la ville grandit vite." },
    { t: "Problèmes urbains et solutions", html:
      "<div class='attention'><b>Les problèmes</b><strong>Habitat spontané</strong> et bidonvilles ; <strong>insuffisance des services</strong> (eau, électricité, assainissement, ramassage des ordures) ; <strong>embouteillages</strong> et transports informels (moto-taxis) ; <strong>chômage</strong> et secteur informel ; <strong>insécurité</strong> ; <strong>inondations</strong> en zones basses ; pollution.</div>" +
      "<div class='ex'><b>Les solutions</b>Plans directeurs d'urbanisme ; restructuration des quartiers et relogement ; construction de logements sociaux (SIC, MAETUR) ; nouvelles voiries et transports collectifs ; drainage (curage des drains à Douala) ; décentralisation et développement des villes secondaires pour soulager les métropoles.</div>",
      retenir: "Habitat spontané, services insuffisants, embouteillages, chômage, inondations ; planification et décentralisation." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> La capitale économique du Cameroun est :</p><ol type='a'><li>Yaoundé</li><li>Garoua</li><li>Douala</li><li>Bafoussam</li></ol><details><summary>Voir la réponse</summary><p><strong>Douala</strong> : premier port, premier centre industriel et commercial.</p></details><p><strong>Exercice.</strong> Classe ces villes selon leur origine : Foumban, Douala, Maroua, Yaoundé.</p><details><summary>Voir la réponse</summary><p>Précoloniales : Foumban (royaume bamoun), Maroua (lamidat). Coloniales : Douala (port), Yaoundé (poste allemand de 1889).</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> À Bafoussam, un nouveau quartier s'est construit sans plan sur les pentes d'une colline : pas de route goudronnée, pas d'eau courante, des ordures dans le ravin, et un glissement de terrain a détruit trois maisons pendant la saison des pluies.</p><p><strong>Tâche.</strong> Explique les causes de cette situation et propose au maire un plan de quatre mesures.</p><details><summary>Voir une réponse attendue</summary><p>Causes : croissance rapide de la ville (exode rural, déplacés), manque de terrains aménagés et de logements abordables, absence de contrôle des constructions, pauvreté des habitants. Mesures : 1) interdire la construction sur les pentes dangereuses et reloger les familles menacées ; 2) établir un plan d'urbanisme du quartier avec voirie et parcelles viabilisées ; 3) installer des bornes-fontaines et organiser la pré-collecte des ordures avec les associations de jeunes ; 4) reboiser les pentes et construire des caniveaux pour limiter l'érosion et les glissements.</p></details></div>",
      retenir: "Savoir-être mobilisé : civisme et sens de l'intérêt général." }
  ],
  revision: ["Villes <strong>précoloniales</strong> (Foumban, Maroua), <strong>coloniales</strong> (Douala, Yaoundé 1889), récentes.", "<strong>Douala</strong> : capitale économique ; <strong>Yaoundé</strong> : capitale politique.", "Croissance : exode rural, croissance naturelle, insécurité, services concentrés.", "Problèmes : habitat spontané, services, embouteillages, chômage, inondations.", "Solutions : urbanisme, logements sociaux, transports, décentralisation."],
  exo: "<p>Sur un croquis du Cameroun, place les deux métropoles et six métropoles régionales, puis trace les grands axes routiers qui les relient. <em>(Douala, Yaoundé ; Garoua, Maroua, Ngaoundéré, Bafoussam, Bamenda, Bertoua.)</em></p>",
  quiz: [
    { q: "La capitale politique du Cameroun est :", r: ["Yaoundé", "Douala", "Buea", "Garoua"], b: 0, e: "Siège des institutions." },
    { q: "Plus de la moitié des Camerounais vivent :", r: ["à l'étranger", "en ville", "dans la forêt", "au bord du lac Tchad"], b: 1, e: "Le taux d'urbanisation dépasse 58 %." },
    { q: "Foumban est une ville d'origine :", r: ["coloniale", "récente", "précoloniale", "industrielle"], b: 2, e: "Capitale du royaume bamoun." },
    { q: "Buea a été la capitale du Kamerun allemand jusqu'en :", r: ["1960", "1884", "1972", "1909"], b: 3, e: "Avant le transfert à Douala." },
    { q: "L'exode rural est :", r: ["le départ des campagnes vers les villes", "le départ vers l'étranger", "le retour au village", "un recensement"], b: 0, e: "Première cause de la croissance urbaine." },
    { q: "Un quartier construit sans plan ni autorisation est un :", r: ["lotissement", "habitat spontané", "centre d'affaires", "parc"], b: 1, e: "Souvent sans services de base." },
    { q: "La SIC et la MAETUR interviennent dans :", r: ["la pêche", "l'agriculture", "le logement et l'aménagement urbain", "le transport aérien"], b: 2, e: "Logements sociaux, terrains viabilisés." },
    { q: "Une métropole régionale du Nord est :", r: ["Kribi", "Ebolowa", "Edéa", "Garoua"], b: 3, e: "Chef-lieu de la région du Nord." },
    { q: "Développer les villes secondaires vise à :", r: ["soulager les métropoles", "vider les campagnes", "supprimer les villes", "fermer les routes"], b: 0, e: "Rééquilibrer le territoire." },
    { q: "Un problème fréquent des quartiers bas de Douala est :", r: ["la sécheresse", "les inondations", "le froid", "les volcans"], b: 1, e: "Zones marécageuses, drains bouchés." }
  ],
  apc: { module: "Géographie de Terminale", famille: "Environnement, santé et bien-être", agir: "Analyser les problèmes urbains pour proposer des solutions d'aménagement", situation: "À Bafoussam, un quartier construit sans plan sur une colline subit un glissement de terrain.", tache: "Expliquer les causes et proposer quatre mesures au maire." }
};
VRT_L("tle-a-geo-villes", Object.assign({ c: "Tle A" }, VRT_TLE_GEO_VILLES));
VRT_L("tle-c-geo-villes", Object.assign({ c: "Tle C" }, VRT_TLE_GEO_VILLES));
VRT_L("tle-d-geo-villes", Object.assign({ c: "Tle D" }, VRT_TLE_GEO_VILLES));

/* ══════════════════════ Histoire — Tle A ══════════════════════ */

VRT_L("tle-a-histoire-supergrands", {
  c: "Tle A", m: "histoire", cle: "Europe sous l’influence des deux supergrands", titre: "L'Europe sous l'influence des deux supergrands (1945-1991)", duree: 25,
  accroche: "Un continent coupé en deux par un rideau de fer et un mur.",
  intro: "Après 1945, l'Europe affaiblie passe sous l'influence des deux vainqueurs : les États-Unis à l'Ouest, l'URSS à l'Est. Leur rivalité, la guerre froide, divise le continent pendant plus de quarante ans, jusqu'à la chute du mur de Berlin et la disparition de l'URSS.",
  objectifs: ["expliquer la division de l'Europe en deux blocs", "décrire l'organisation de chaque bloc", "présenter les crises de la guerre froide en Europe"],
  parties: [
    { t: "La formation des deux blocs", html:
      "<ul><li><strong>5 mars 1946</strong>, discours de Churchill à Fulton : « un <strong>rideau de fer</strong> s'est abattu sur le continent ».</li><li><strong>1947</strong> : <strong>doctrine Truman</strong> (endiguement du communisme) et <strong>plan Marshall</strong> (aide économique) ; réponse soviétique : la <strong>doctrine Jdanov</strong>, qui dénonce l'« impérialisme américain ».</li><li>Les pays d'Europe de l'Est (Pologne, Hongrie, Tchécoslovaquie, Roumanie, Bulgarie…) deviennent des <strong>démocraties populaires</strong> sous contrôle soviétique.</li></ul>" +
      "<div class='def'><b>La guerre froide</b>Affrontement idéologique, politique, économique et militaire entre les États-Unis et l'URSS, sans guerre directe entre eux, de 1947 à 1991.</div>",
      retenir: "Rideau de fer (1946), doctrine Truman, plan Marshall et doctrine Jdanov (1947) : deux blocs." },
    { t: "L'organisation des deux Europe", html:
      "<div class='def'><b>À l'Ouest</b>Démocraties libérales et économie de marché ; <strong>OTAN</strong> (1949), alliance militaire avec les États-Unis ; construction européenne : <strong>CECA</strong> (1951), <strong>CEE</strong> par le <strong>traité de Rome</strong> (25 mars 1957).</div>" +
      "<div class='def'><b>À l'Est</b>Régimes communistes à parti unique, économie planifiée ; <strong>CAEM</strong> (ou Comecon, 1949) pour l'économie ; <strong>pacte de Varsovie</strong> (1955), alliance militaire dirigée par l'URSS.</div>" +
      "<div class='ex'><b>L'Allemagne coupée en deux</b>En 1949 naissent la <strong>RFA</strong> (à l'Ouest, capitale Bonn) et la <strong>RDA</strong> (à l'Est, capitale Berlin-Est).</div>",
      retenir: "Ouest : OTAN (1949), CEE (1957) ; Est : CAEM (1949), pacte de Varsovie (1955) ; RFA et RDA (1949)." },
    { t: "Les crises en Europe", html:
      "<ul><li><strong>Blocus de Berlin</strong> (1948-1949) : l'URSS coupe l'accès terrestre à Berlin-Ouest ; les Américains ravitaillent la ville par un pont aérien.</li><li><strong>Insurrection de Budapest</strong> (1956) : écrasée par les chars soviétiques.</li><li><strong>Construction du mur de Berlin</strong> (13 août 1961) pour empêcher la fuite des Allemands de l'Est.</li><li><strong>Printemps de Prague</strong> (1968) : réformes libérales en Tchécoslovaquie, écrasées par le pacte de Varsovie.</li></ul>" +
      "<div class='savais'><b>Le savais-tu ?</b>Pendant la guerre froide, de nombreux pays africains, dont le Cameroun, revendiquent le <strong>non-alignement</strong> (conférence de Bandung en 1955, mouvement des non-alignés en 1961) pour ne dépendre d'aucun bloc.</div>",
      retenir: "Blocus de Berlin (1948-1949), Budapest (1956), mur (1961), Prague (1968)." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> L'expression « rideau de fer » est de :</p><ol type='a'><li>Truman</li><li>Staline</li><li>Churchill</li><li>Jdanov</li></ol><details><summary>Voir la réponse</summary><p><strong>Churchill</strong>, à Fulton, le 5 mars 1946.</p></details><p><strong>Exercice.</strong> Associe : OTAN, pacte de Varsovie, CEE, CAEM → bloc et date.</p><details><summary>Voir la réponse</summary><p>OTAN : Ouest, 1949 ; pacte de Varsovie : Est, 1955 ; CEE : Ouest, 1957 ; CAEM : Est, 1949.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Ton grand-père, ancien étudiant camerounais en RDA dans les années 1970, raconte qu'il ne pouvait pas aller voir des amis à Berlin-Ouest, « à quelques centaines de mètres ». Ta petite sœur ne comprend pas pourquoi.</p><p><strong>Tâche.</strong> Explique-lui en une dizaine de lignes la division de l'Allemagne et de Berlin, et pourquoi un mur séparait la ville.</p><details><summary>Voir une réponse attendue</summary><p>Après 1945, l'Allemagne vaincue est occupée par les Alliés. La rivalité entre les États-Unis et l'URSS (la guerre froide) conduit en 1949 à la création de deux États : la RFA à l'Ouest, alliée des États-Unis, et la RDA à l'Est, communiste, alliée de l'URSS. Berlin, située en RDA, est elle aussi coupée en deux. Comme des millions d'Allemands de l'Est fuyaient vers l'Ouest par Berlin, la RDA a construit en 1961 un mur gardé par des soldats. Passer d'un côté à l'autre était presque impossible jusqu'à la chute du mur, le 9 novembre 1989.</p></details></div>",
      retenir: "Savoir-être mobilisé : esprit de paix et compréhension des héritages historiques." }
  ],
  revision: ["<strong>5 mars 1946</strong> : rideau de fer (Churchill).", "<strong>1947</strong> : doctrine Truman, plan Marshall, doctrine Jdanov.", "Ouest : <strong>OTAN</strong> (1949), CECA (1951), <strong>CEE</strong> (1957).", "Est : <strong>CAEM</strong> (1949), <strong>pacte de Varsovie</strong> (1955).", "Crises : Berlin 1948-1949, Budapest 1956, <strong>mur 1961</strong>, Prague 1968 ; chute du mur 1989."],
  exo: "<p>Construis une frise 1945-1991 avec huit événements de la guerre froide en Europe. <em>(1946 rideau de fer ; 1947 Truman et Marshall ; 1948-1949 blocus ; 1949 OTAN, RFA, RDA ; 1955 pacte de Varsovie ; 1957 CEE ; 1961 mur ; 1968 Prague ; 1989 chute du mur ; 1991 fin de l'URSS.)</em></p>",
  quiz: [
    { q: "Le discours du « rideau de fer » date de :", r: ["1946", "1945", "1949", "1961"], b: 0, e: "Churchill à Fulton, 5 mars 1946." },
    { q: "Le plan Marshall est une aide :", r: ["soviétique", "américaine", "française", "allemande"], b: 1, e: "Pour reconstruire l'Europe, 1947." },
    { q: "L'OTAN est créée en :", r: ["1955", "1957", "1949", "1961"], b: 2, e: "Alliance militaire occidentale." },
    { q: "Le pacte de Varsovie regroupe :", r: ["les pays de la CEE", "les non-alignés", "les pays de l'OTAN", "l'URSS et les démocraties populaires"], b: 3, e: "1955." },
    { q: "Le traité de Rome crée en 1957 :", r: ["la CEE", "l'OTAN", "l'ONU", "le CAEM"], b: 0, e: "Le 25 mars 1957." },
    { q: "Le mur de Berlin est construit en :", r: ["1949", "1961", "1968", "1989"], b: 1, e: "Le 13 août 1961." },
    { q: "Pendant le blocus de Berlin, les Américains ravitaillent la ville par :", r: ["la mer", "le train", "un pont aérien", "des tunnels"], b: 2, e: "1948-1949." },
    { q: "Le Printemps de Prague a lieu en :", r: ["1956", "1961", "1989", "1968"], b: 3, e: "Écrasé par les troupes du pacte de Varsovie." },
    { q: "La doctrine Jdanov est la réponse :", r: ["soviétique à la doctrine Truman", "américaine au blocus", "française au plan Marshall", "de l'ONU"], b: 0, e: "1947." },
    { q: "Le mur de Berlin tombe le :", r: ["13 août 1961", "9 novembre 1989", "25 décembre 1991", "8 mai 1945"], b: 1, e: "Fin symbolique de la division de l'Europe." }
  ],
  apc: { module: "Histoire de Terminale A", famille: "Citoyenneté", agir: "Expliquer les divisions héritées de la guerre froide", situation: "Un ancien étudiant camerounais en RDA raconte qu'il ne pouvait pas se rendre à Berlin-Ouest.", tache: "Expliquer la division de l'Allemagne et l'existence du mur de Berlin." }
});

/* ══════════════════════ Histoire — 1re A, 1re C et 1re D ══════════════════════ */

var VRT_1RE_HIST_IMPERIALISME = {
  m: "histoire", cle: "Les fondements de l’impérialisme européen", titre: "Les fondements de l'impérialisme européen", duree: 25,
  accroche: "Pourquoi l'Europe a-t-elle voulu se partager l'Afrique à la fin du XIXᵉ siècle ?",
  intro: "Entre 1880 et 1914, les puissances européennes se lancent dans une course aux colonies : en une trentaine d'années, presque toute l'Afrique est conquise et partagée. Cette expansion, appelée impérialisme, a des causes économiques, politiques, démographiques, idéologiques et scientifiques, que les Européens de l'époque exposaient sans détour.",
  objectifs: ["définir l'impérialisme", "expliquer ses fondements économiques, politiques, démographiques et idéologiques", "porter un regard critique sur les justifications de la colonisation"],
  parties: [
    { t: "Définition et fondements économiques", html:
      "<div class='def'><b>Définition</b>L'<strong>impérialisme</strong> est la volonté d'un État d'étendre sa domination politique, économique et culturelle sur d'autres territoires et peuples. La <strong>colonisation</strong> en est la forme la plus directe.</div>" +
      "<ul><li>Les industries européennes ont besoin de <strong>matières premières</strong> (caoutchouc, huile de palme, coton, cacao, minerais).</li><li>Elles cherchent des <strong>débouchés</strong> pour leurs produits manufacturés, protégés par le <strong>protectionnisme</strong> des pays rivaux.</li><li>Les banques veulent placer des <strong>capitaux</strong> dans des investissements rentables (chemins de fer, mines, plantations).</li></ul>" +
      "<div class='ex'><b>Jules Ferry (1885)</b>« La politique coloniale est fille de la politique industrielle. »</div>",
      retenir: "Impérialisme : domination ; fondements économiques : matières premières, débouchés, capitaux." },
    { t: "Fondements politiques et démographiques", html:
      "<ul><li><strong>Prestige et puissance</strong> : après sa défaite de 1870, la France cherche une revanche hors d'Europe ; l'Allemagne unifiée veut sa « place au soleil ».</li><li><strong>Rivalités</strong> entre puissances : occuper un territoire avant le rival ; contrôler des points stratégiques (routes maritimes, canal de Suez ouvert en 1869, escales charbonnières).</li><li><strong>Démographie</strong> : l'Europe compte de nombreux habitants ; les colonies de peuplement (Algérie, Afrique australe) accueillent des émigrants.</li></ul>" +
      "<div class='def'><b>La conférence de Berlin</b>(novembre 1884-février 1885), convoquée par Bismarck : elle fixe les règles du partage (occupation effective, notification aux autres puissances) et accélère la « course au clocher ».</div>",
      retenir: "Prestige, revanche, rivalités, points stratégiques, émigration ; conférence de Berlin (1884-1885)." },
    { t: "Fondements idéologiques, religieux et scientifiques", html:
      "<ul><li><strong>La « mission civilisatrice »</strong> : les Européens prétendent apporter le progrès à des peuples jugés « inférieurs ». Ferry parle en 1885 du « devoir de civiliser les races inférieures » ; Kipling, du « fardeau de l'homme blanc » (1899). Ces idées reposent sur un <strong>racisme</strong> pseudo-scientifique.</li><li><strong>Les missions religieuses</strong> : catholiques et protestantes veulent évangéliser ; elles précèdent souvent la conquête (au Cameroun, la Baptist Missionary Society à Douala et Victoria dès les années 1840).</li><li><strong>Les explorations</strong> : Livingstone, Stanley, Brazza ; au Cameroun, Gustav Nachtigal signe en juillet 1884 le traité germano-douala.</li></ul>" +
      "<div class='attention'><b>Regard critique</b>Ces justifications masquaient la conquête militaire, le travail forcé et la spoliation des terres. Dès l'époque, des voix dénoncent la colonisation, comme Georges Clemenceau qui répond à Ferry à la Chambre en 1885.</div>",
      retenir: "Mission civilisatrice (racisme), missions religieuses, explorations : des justifications à examiner de façon critique." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> « La politique coloniale est fille de la politique industrielle » souligne un fondement :</p><ol type='a'><li>religieux</li><li>économique</li><li>démographique</li><li>scientifique</li></ol><details><summary>Voir la réponse</summary><p><strong>Économique</strong> : l'industrie a besoin de matières premières et de débouchés.</p></details><p><strong>Exercice.</strong> Cite deux règles fixées par la conférence de Berlin.</p><details><summary>Voir la réponse</summary><p>L'occupation effective d'un territoire pour le revendiquer ; la notification de toute prise de possession aux autres puissances.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Lors d'une exposition au musée national de Yaoundé, un visiteur affirme devant une carte de l'Afrique en 1914 : « Les Européens sont venus pour nous civiliser, c'était une bonne chose. »</p><p><strong>Tâche.</strong> Rédige une réponse argumentée de 12 à 15 lignes qui présente les vrais fondements de l'impérialisme et montre les limites de l'argument de la « mission civilisatrice ».</p><details><summary>Voir une réponse attendue</summary><p>L'argument de la « mission civilisatrice » était surtout une justification. Les fondements réels étaient économiques (matières premières comme le caoutchouc et l'huile de palme, débouchés, placements de capitaux ; Ferry : « la politique coloniale est fille de la politique industrielle »), politiques (prestige, rivalités, points stratégiques) et démographiques. Cette « mission » reposait sur l'idée raciste de peuples inférieurs, alors que l'Afrique avait ses royaumes, ses savoirs et ses écritures (Njoya). Au Cameroun, la colonisation allemande s'est accompagnée de guerres de conquête, de travail forcé (plantations, chemin de fer) et de spoliation des terres, comme l'a dénoncé Rudolf Duala Manga Bell, pendu en 1914. Écoles et hôpitaux ont existé, mais ils servaient d'abord le système colonial.</p></details></div>",
      retenir: "Savoir-être mobilisé : esprit critique et devoir de mémoire." }
  ],
  revision: ["<strong>Impérialisme</strong> : volonté de domination ; colonisation.", "Économique : <strong>matières premières, débouchés, capitaux</strong> (Ferry, 1885).", "Politique : prestige, revanche, rivalités, points stratégiques ; démographique : émigration.", "Idéologique : <strong>mission civilisatrice</strong>, racisme ; religieux : missions ; explorations.", "Conférence de Berlin (1884-1885) ; Cameroun allemand (juillet 1884)."],
  exo: "<p>Classe ces éléments dans un tableau (économique, politique, idéologique) : recherche de caoutchouc ; revanche de 1870 ; « fardeau de l'homme blanc » ; contrôle du canal de Suez ; placements des banques ; évangélisation. <em>(Économique : caoutchouc, banques ; politique : revanche, Suez ; idéologique et religieux : fardeau, évangélisation.)</em></p>",
  quiz: [
    { q: "L'impérialisme est :", r: ["la volonté d'un État d'étendre sa domination", "un régime monarchique", "une religion", "une alliance militaire"], b: 0, e: "La colonisation en est la forme la plus directe." },
    { q: "« La politique coloniale est fille de la politique industrielle » est de :", r: ["Bismarck", "Jules Ferry", "Kipling", "Clemenceau"], b: 1, e: "Discours de 1885." },
    { q: "La conférence de Berlin s'est tenue en :", r: ["1870", "1914", "1884-1885", "1919"], b: 2, e: "Convoquée par Bismarck." },
    { q: "Le « fardeau de l'homme blanc » est une expression de :", r: ["Ferry", "Livingstone", "Nachtigal", "Kipling"], b: 3, e: "Poème de 1899." },
    { q: "Le traité germano-douala est signé en :", r: ["juillet 1884", "1914", "1960", "1919"], b: 0, e: "Gustav Nachtigal pour l'Allemagne." },
    { q: "Un fondement politique de l'impérialisme français est :", r: ["la recherche d'huile de palme", "la revanche après 1870", "l'évangélisation", "l'émigration"], b: 1, e: "Défaite face à la Prusse." },
    { q: "Le canal de Suez, point stratégique, ouvre en :", r: ["1884", "1914", "1869", "1899"], b: 2, e: "Route maritime vers l'Asie." },
    { q: "La « mission civilisatrice » reposait sur :", r: ["l'égalité des peuples", "le droit des peuples à disposer d'eux-mêmes", "la démocratie", "l'idée raciste de peuples inférieurs"], b: 3, e: "À examiner de façon critique." },
    { q: "Qui s'opposa à Ferry à la Chambre en 1885 ?", r: ["Clemenceau", "Bismarck", "Kipling", "Stanley"], b: 0, e: "Il dénonça la prétendue supériorité des « races »." },
    { q: "La règle d'« occupation effective » signifie qu'il faut :", r: ["acheter le territoire", "occuper réellement un territoire pour le revendiquer", "demander l'avis des habitants", "attendre l'ONU"], b: 1, e: "Fixée à Berlin." }
  ],
  apc: { module: "Histoire de Première", famille: "Citoyenneté", agir: "Analyser les fondements de l'impérialisme avec un regard critique", situation: "Au musée national de Yaoundé, un visiteur présente la colonisation comme une mission civilisatrice.", tache: "Lui répondre en exposant les vrais fondements de l'impérialisme et les limites de cet argument." }
};
VRT_L("1re-a-histoire-imperialisme", Object.assign({ c: "1re A" }, VRT_1RE_HIST_IMPERIALISME));
VRT_L("1re-c-histoire-imperialisme", Object.assign({ c: "1re C" }, VRT_1RE_HIST_IMPERIALISME));
VRT_L("1re-d-histoire-imperialisme", Object.assign({ c: "1re D" }, VRT_1RE_HIST_IMPERIALISME));

/* ══════════════════════ Géographie — 1re A ══════════════════════ */

VRT_L("1re-a-geo-migrations", {
  c: "1re A", m: "geo", cle: "Les migrations", titre: "Les migrations dans le monde", duree: 25,
  accroche: "Environ 280 millions de personnes vivent hors de leur pays de naissance.",
  intro: "Partir chercher du travail en ville, fuir une guerre, rejoindre sa famille à l'étranger : les migrations sont aussi anciennes que l'humanité. Elles concernent aujourd'hui des centaines de millions de personnes et transforment les sociétés de départ comme d'arrivée. Le Cameroun est à la fois pays de départ, de passage et d'accueil.",
  objectifs: ["définir les différents types de migrations", "expliquer les causes des migrations", "décrire les grands flux migratoires, dont ceux qui concernent le Cameroun"],
  parties: [
    { t: "Définitions", html:
      "<div class='def'><b>Vocabulaire</b>Une <strong>migration</strong> est un déplacement de population d'un lieu à un autre avec changement de résidence durable. <strong>Émigration</strong> : départ d'un pays ; <strong>immigration</strong> : arrivée dans un pays. <strong>Solde migratoire</strong> = immigrants − émigrants.</div>" +
      "<ul><li><strong>Migrations internes</strong> (dans un même pays) : exode rural, migrations entre régions.</li><li><strong>Migrations internationales</strong> : vers un autre pays, régulières ou irrégulières.</li><li><strong>Migrations forcées</strong> : <strong>réfugiés</strong> (qui fuient une persécution ou une guerre et franchissent une frontière) et <strong>déplacés internes</strong> (qui fuient sans quitter leur pays).</li><li>Migrations <strong>temporaires</strong> ou <strong>saisonnières</strong> (transhumance, travaux agricoles) ou <strong>définitives</strong>.</li></ul>",
      retenir: "Émigration / immigration ; solde migratoire ; internes / internationales ; volontaires / forcées." },
    { t: "Les causes des migrations", html:
      "<div class='def'><b>Facteurs de répulsion et d'attraction</b>On part à cause de <strong>facteurs de répulsion</strong> du lieu de départ et on choisit une destination pour ses <strong>facteurs d'attraction</strong>.</div>" +
      "<ul><li><strong>Économiques</strong> : pauvreté, chômage, faibles revenus ; espoir d'emploi et de meilleurs salaires.</li><li><strong>Politiques et sécuritaires</strong> : guerres, terrorisme, persécutions.</li><li><strong>Environnementales</strong> : sécheresse, désertification, inondations, montée des eaux.</li><li><strong>Sociales</strong> : études, regroupement familial, soins, mariage.</li></ul>",
      retenir: "Répulsion au départ, attraction à l'arrivée : causes économiques, politiques, environnementales, sociales." },
    { t: "Les grands flux et le Cameroun", html:
      "<ul><li>Flux <strong>Sud-Nord</strong> : de l'Afrique, de l'Amérique latine et de l'Asie vers l'Europe et l'Amérique du Nord.</li><li>Flux <strong>Sud-Sud</strong>, très importants en Afrique : la majorité des migrants africains restent sur le continent.</li><li>Flux vers les <strong>pays du Golfe</strong> (travailleurs d'Asie et d'Afrique).</li></ul>" +
      "<div class='ex'><b>Le Cameroun</b><strong>Départ</strong> : étudiants et travailleurs vers l'Europe, l'Amérique du Nord, le Gabon, la Guinée équatoriale ; une diaspora qui envoie des fonds aux familles. <strong>Accueil</strong> : plusieurs centaines de milliers de réfugiés venus de Centrafrique (Est) et du Nigeria (Extrême-Nord). <strong>Déplacements internes</strong> : exode rural ; personnes fuyant Boko Haram dans l'Extrême-Nord et la crise dans le Nord-Ouest et le Sud-Ouest.</div>" +
      "<div class='attention'><b>Les routes dangereuses</b>Des milliers de migrants meurent chaque année dans le Sahara et en Méditerranée en tentant de rejoindre l'Europe par des voies irrégulières.</div>",
      retenir: "Flux Sud-Nord et Sud-Sud ; le Cameroun : pays de départ, d'accueil et de déplacements internes." },
    { t: "Entraînement au format de l'examen", html:
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Une personne qui fuit la guerre sans quitter son pays est :</p><ol type='a'><li>un réfugié</li><li>un déplacé interne</li><li>un immigrant</li><li>un touriste</li></ol><details><summary>Voir la réponse</summary><p><strong>Un déplacé interne</strong> : le réfugié, lui, franchit une frontière.</p></details><p><strong>Exercice.</strong> Un pays reçoit 50 000 immigrants et voit partir 80 000 émigrants en un an. Calcule le solde migratoire.</p><details><summary>Voir la réponse</summary><p>50 000 − 80 000 = − 30 000 : solde migratoire négatif, le pays perd des habitants par migration.</p></details>" +
      "<h3>Partie B : évaluation des compétences</h3><p><strong>Situation.</strong> Ton camarade de Bamenda, déplacé avec sa famille à Douala, veut tenter de rejoindre l'Europe « par le désert », comme un cousin parti il y a deux ans dont on n'a plus de nouvelles.</p><p><strong>Tâche.</strong> Explique-lui les causes de sa situation, les risques de la migration irrégulière, et propose-lui trois alternatives.</p><details><summary>Voir une réponse attendue</summary><p>Sa famille est une famille déplacée interne : elle a fui l'insécurité du Nord-Ouest (facteur de répulsion) pour Douala (attraction : sécurité, emplois). Le départ par le désert est une migration irrégulière très dangereuse : passeurs, rançons, mort dans le Sahara ou en Méditerranée, détention ; le silence du cousin en est un signe. Alternatives : 1) poursuivre sa formation (bac, formation professionnelle) et chercher une bourse d'études à l'étranger par les voies légales ; 2) apprendre un métier demandé (électricité, mécanique, informatique) dans un centre de formation à Douala ; 3) se renseigner auprès des services de l'emploi (FNE) et des programmes d'appui à l'entrepreneuriat des jeunes.</p></details></div>",
      retenir: "Savoir-être mobilisé : prudence, sens des responsabilités et solidarité." }
  ],
  revision: ["Migration : changement de résidence durable ; <strong>émigration</strong> / <strong>immigration</strong>.", "<strong>Solde migratoire</strong> = immigrants − émigrants.", "Internes / internationales ; <strong>réfugiés</strong> (frontière franchie) / <strong>déplacés internes</strong>.", "Facteurs de <strong>répulsion</strong> et d'<strong>attraction</strong>.", "Cameroun : départ (diaspora), accueil (réfugiés de RCA et du Nigeria), déplacés internes."],
  exo: "<p>Pour chaque cas, donne le type de migration : un berger peul qui descend vers l'Adamaoua en saison sèche ; une étudiante qui part à Montréal ; une famille de Mora qui fuit vers Maroua ; un Centrafricain installé à Garoua-Boulaï. <em>(Saisonnière ; internationale volontaire ; déplacement interne forcé ; réfugié.)</em></p>",
  quiz: [
    { q: "L'émigration est :", r: ["le départ d'un pays", "l'arrivée dans un pays", "un recensement", "une naissance"], b: 0, e: "L'immigration est l'arrivée." },
    { q: "Le solde migratoire se calcule par :", r: ["naissances − décès", "immigrants − émigrants", "émigrants + immigrants", "population ÷ superficie"], b: 1, e: "Il peut être positif ou négatif." },
    { q: "Un réfugié est une personne qui :", r: ["voyage pour le tourisme", "change de quartier", "fuit une persécution en franchissant une frontière", "part étudier"], b: 2, e: "Protégée par le droit international." },
    { q: "L'exode rural est une migration :", r: ["internationale", "forcée par la guerre", "saisonnière", "interne"], b: 3, e: "De la campagne vers la ville." },
    { q: "Un facteur d'attraction est :", r: ["l'espoir d'un emploi", "la guerre", "la sécheresse", "le chômage au départ"], b: 0, e: "Il attire vers la destination." },
    { q: "La majorité des migrants africains :", r: ["partent en Europe", "restent en Afrique", "vont en Asie", "vont en Amérique"], b: 1, e: "Les flux Sud-Sud dominent." },
    { q: "Le Cameroun accueille des réfugiés venus surtout de :", r: ["France et Belgique", "Chine et Inde", "Centrafrique et Nigeria", "Brésil et Argentine"], b: 2, e: "À l'Est et dans l'Extrême-Nord." },
    { q: "La transhumance est une migration :", r: ["définitive", "internationale forcée", "urbaine", "saisonnière"], b: 3, e: "Les troupeaux suivent les pâturages." },
    { q: "Les fonds envoyés par la diaspora à leurs familles sont des :", r: ["transferts de fonds", "impôts", "dettes", "subventions de l'État"], b: 0, e: "Une ressource importante pour de nombreux ménages." },
    { q: "Le nombre de migrants internationaux dans le monde est d'environ :", r: ["28 millions", "280 millions", "2,8 milliards", "2 800"], b: 1, e: "Environ 3,6 % de la population mondiale." }
  ],
  apc: { module: "Géographie de Première A", famille: "Citoyenneté", agir: "Analyser les causes et les risques des migrations pour faire des choix éclairés", situation: "Un jeune déplacé de Bamenda à Douala veut rejoindre l'Europe par le désert.", tache: "Expliquer sa situation, les risques de la migration irrégulière et proposer des alternatives." }
});

/* ══════════════════════ Reprises (même contenu, autre classe) ══════════════════════ */

/* 1re C et D, Français n° 3 « Dissertation : Analyse d'un sujet de dissertation » :
   la leçon de Tle C et D (07) traite exactement cette étape. */
VRT_LX("1re-c-francais-dissertation", "1re C", "Analyse d’un sujet de dissertation", VRT_TCD_FR_DISSERT, { apc: Object.assign({}, VRT_TCD_FR_DISSERT.apc, { module: "Français de Première C" }) });
VRT_LX("1re-d-francais-dissertation", "1re D", "Analyse d’un sujet de dissertation", VRT_TCD_FR_DISSERT, { apc: Object.assign({}, VRT_TCD_FR_DISSERT.apc, { module: "Français de Première D" }) });

/* 1re A, Philosophie n° 3 « La réorientation actuelle du débat philosophique africain » :
   les nouvelles thématiques (vivre-ensemble, gouvernance) de la leçon de Tle C et D (08). */
VRT_LX("1re-a-philo-reorientation", "1re A", "La réorientation actuelle du débat philosophique africain", VRT_TCD_PHILO_VIVRE,
  { titre: "La réorientation actuelle du débat philosophique africain", apc: Object.assign({}, VRT_TCD_PHILO_VIVRE.apc, { module: "Philosophie de Première A" }) });

/* 1re A, Philosophie n° 4 « Rappel des principes théoriques de la dissertation philosophique ». */
VRT_LX("1re-a-philo-dissertation", "1re A", "Rappel des principes théoriques de la dissertation philosophique", VRT_TCD_PHILO_DISSERT,
  { apc: Object.assign({}, VRT_TCD_PHILO_DISSERT.apc, { module: "Philosophie de Première A" }) });

/* Schémas animés et manipulables — sciences. Chaque fonction reçoit le conteneur et y dessine.
   Règles : transform/opacity uniquement pour les boucles ; tout reste lisible sans animation. */
(function () {
  var NS = "http://www.w3.org/2000/svg";
  function curseur(lab, min, max, pas, val, unite) {
    return "<label class='an-cur'><span>" + lab + " <b data-v>" + val + "</b>" + (unite || "") + "</span><input type='range' min='" + min + "' max='" + max + "' step='" + pas + "' value='" + val + "'></label>";
  }
  function f(x, d) { return (Math.round(x * Math.pow(10, d || 2)) / Math.pow(10, d || 2)).toString().replace(".", ","); }

  /* ---------- Thalès : la parallèle glisse, les rapports restent égaux ---------- */
  VRT_A("3e-maths-thales", 1, "Fais glisser la parallèle (MN)", function (el) {
    el.innerHTML = "<svg viewBox='0 0 420 240' class='an-svg'><path d='M60 220 L360 220 L150 25 Z' fill='#DBE8FE' stroke='#142554' stroke-width='2.5' stroke-linejoin='round'/><path data-p fill='#FFC93C' fill-opacity='.45'/><line data-l stroke='#1E499B' stroke-width='3'/><circle data-m r='5' fill='#142554'/><circle data-n r='5' fill='#142554'/><text data-tm font-size='17' font-weight='700' fill='#142554'>M</text><text data-tn font-size='17' font-weight='700' fill='#142554'>N</text><g font-size='17' font-weight='700' fill='#142554'><text x='143' y='18'>A</text><text x='40' y='238'>B</text><text x='366' y='238'>C</text></g></svg>" +
      curseur("Position de M sur [AB] : AM/AB =", 0.15, 0.95, 0.01, 0.5) +
      "<div class='an-res'><span>AM/AB = <b data-r1></b></span><span>AN/AC = <b data-r2></b></span><span>MN/BC = <b data-r3></b></span></div><p class='an-note'>Les trois rapports restent égaux tant que (MN) est parallèle à (BC).</p>";
    var A = [150, 25], B = [60, 220], C = [360, 220], r = el.querySelector("input");
    function maj() {
      var k = +r.value, M = [A[0] + k * (B[0] - A[0]), A[1] + k * (B[1] - A[1])], N = [A[0] + k * (C[0] - A[0]), A[1] + k * (C[1] - A[1])];
      var q = function (s) { return el.querySelector("[" + s + "]"); };
      q("data-l").setAttribute("x1", M[0] - 30); q("data-l").setAttribute("y1", M[1]); q("data-l").setAttribute("x2", N[0] + 30); q("data-l").setAttribute("y2", N[1]);
      q("data-p").setAttribute("d", "M" + A + " L" + M + " L" + N + " Z");
      q("data-m").setAttribute("cx", M[0]); q("data-m").setAttribute("cy", M[1]); q("data-n").setAttribute("cx", N[0]); q("data-n").setAttribute("cy", N[1]);
      q("data-tm").setAttribute("x", M[0] - 22); q("data-tm").setAttribute("y", M[1] - 6); q("data-tn").setAttribute("x", N[0] + 8); q("data-tn").setAttribute("y", N[1] - 6);
      ["data-r1", "data-r2", "data-r3"].forEach(function (s) { q(s).textContent = f(k); });
      q("data-v").textContent = f(k);
    }
    r.addEventListener("input", maj); maj();
  });

  /* ---------- Racine carrée : l'aire change, le côté suit ---------- */
  VRT_A("3e-maths-racines", 0, "Choisis l'aire du carré", function (el) {
    el.innerHTML = "<svg viewBox='0 0 420 220' class='an-svg'><rect data-c x='40' y='20' fill='#DBE8FE' stroke='#142554' stroke-width='2.5' rx='3' style='transition:width .25s,height .25s'/><text data-a x='0' y='0' text-anchor='middle' font-size='22' font-weight='700' fill='#142554'></text><text x='250' y='80' font-size='17' fill='#142554'>côté = √aire</text><text data-s x='250' y='116' font-size='26' font-weight='700' fill='#1E499B'></text><text data-e x='250' y='150' font-size='14' fill='#636A80'></text></svg>" + curseur("Aire :", 1, 144, 1, 49, " m²");
    var r = el.querySelector("input");
    function maj() {
      var a = +r.value, s = Math.sqrt(a), px = 16 + s * 14.5, c = el.querySelector("[data-c]");
      c.setAttribute("width", px); c.setAttribute("height", px);
      var t = el.querySelector("[data-a]"); t.setAttribute("x", 40 + px / 2); t.setAttribute("y", 20 + px / 2 + 8); t.textContent = px > 60 ? a : "";
      el.querySelector("[data-s]").textContent = "√" + a + " = " + (Number.isInteger(s) ? s : "≈ " + f(s));
      el.querySelector("[data-e]").textContent = Number.isInteger(s) ? a + " est un carré parfait (" + s + " × " + s + ")" : "entre " + Math.floor(s) + " et " + Math.ceil(s);
      el.querySelector("[data-v]").textContent = a;
    }
    r.addEventListener("input", maj); maj();
  });

  /* ---------- Atome : électrons en orbite, Z réglable (couches K et L) ---------- */
  var ELEM = ["", "H Hydrogène", "He Hélium", "Li Lithium", "Be Béryllium", "B Bore", "C Carbone", "N Azote", "O Oxygène", "F Fluor", "Ne Néon", "Na Sodium"];
  VRT_A("3e-pct-atome", 0, "Choisis un élément et regarde ses électrons", function (el) {
    el.innerHTML = "<div class='an-atome'><svg viewBox='0 0 300 300' class='an-svg' style='max-width:320px;margin:auto'><circle cx='150' cy='150' r='62' fill='none' stroke='#8FB0EE' stroke-dasharray='4 6'/><circle cx='150' cy='150' r='104' fill='none' stroke='#8FB0EE' stroke-dasharray='4 6'/><circle cx='150' cy='150' r='138' fill='none' stroke='#8FB0EE' stroke-dasharray='4 6'/><g data-noyau></g><g class='an-orb an-k' data-k></g><g class='an-orb an-l' data-l></g><g class='an-orb an-m' data-mm></g></svg>" +
      "<div class='an-res'><span><b data-nom></b></span><span>Z = <b data-z></b></span><span>Couches : <b data-c></b></span></div></div>" + curseur("Numéro atomique Z :", 1, 11, 1, 3);
    var r = el.querySelector("input");
    function pts(g, n, rad) {
      g.innerHTML = ""; for (var i = 0; i < n; i++) { var a = 2 * Math.PI * i / n, c = document.createElementNS(NS, "circle");
        c.setAttribute("cx", 150 + rad * Math.cos(a)); c.setAttribute("cy", 150 + rad * Math.sin(a)); c.setAttribute("r", 8); c.setAttribute("fill", "#FFC93C"); c.setAttribute("stroke", "#142554"); c.setAttribute("stroke-width", "1.5"); g.appendChild(c); }
    }
    function maj() {
      var z = +r.value, k = Math.min(z, 2), l = Math.min(Math.max(z - 2, 0), 8), m = Math.max(z - 10, 0), no = el.querySelector("[data-noyau]");
      no.innerHTML = ""; var n = z * 2, s = 0;
      for (var i = 0; i < n; i++) { var a = i * 2.4, rr = 5 * Math.sqrt(i), c = document.createElementNS(NS, "circle");
        c.setAttribute("cx", 150 + rr * Math.cos(a)); c.setAttribute("cy", 150 + rr * Math.sin(a)); c.setAttribute("r", 6); c.setAttribute("fill", i % 2 ? "#8C9BC0" : "#D9472B"); no.appendChild(c); s++; }
      pts(el.querySelector("[data-k]"), k, 62); pts(el.querySelector("[data-l]"), l, 104); pts(el.querySelector("[data-mm]"), m, 138);
      el.querySelector("[data-nom]").textContent = ELEM[z]; el.querySelector("[data-z]").textContent = z + " protons, " + z + " électrons";
      el.querySelector("[data-c]").textContent = "K" + k + (l ? " L" + l : "") + (m ? " M" + m : ""); el.querySelector("[data-v]").textContent = z;
    }
    r.addEventListener("input", maj); maj();
  });

  /* ---------- pH : choisir une solution, l'aiguille et le papier réagissent ---------- */
  var SOL = [["Jus de citron", 2], ["Vinaigre", 3], ["Jus d'orange", 4], ["Eau de pluie", 6], ["Eau pure", 7], ["Sang", 7.4], ["Eau de mer", 8], ["Bicarbonate", 9], ["Eau savonneuse", 10], ["Eau de javel", 12]];
  VRT_A("3e-pct-ph", 1, "Teste une solution au papier pH", function (el) {
    el.innerHTML = "<div class='an-choix'>" + SOL.map(function (s, i) { return "<button type='button' data-i='" + i + "'>" + s[0] + "</button>"; }).join("") + "</div>" +
      "<svg viewBox='0 0 440 150' class='an-svg'><defs><linearGradient id='phg2' x1='0' x2='1'><stop offset='0' stop-color='#D9472B'/><stop offset='.35' stop-color='#FFC93C'/><stop offset='.5' stop-color='#7FCB8C'/><stop offset='.75' stop-color='#8FB0EE'/><stop offset='1' stop-color='#5B4FA8'/></linearGradient></defs><rect x='20' y='60' width='400' height='26' rx='13' fill='url(#phg2)'/><g font-size='12' fill='#142554' text-anchor='middle'><text x='20' y='104'>0</text><text x='220' y='104'>7</text><text x='420' y='104'>14</text></g><g data-aig style='transition:transform .6s cubic-bezier(.2,.8,.2,1)'><path d='M0 30 L-9 50 L9 50 Z' fill='#142554'/></g><rect data-pap x='170' y='116' width='100' height='26' rx='4' stroke='#142554' style='transition:fill .6s'/><text x='280' y='134' font-size='13' fill='#636A80'>papier pH</text></svg><div class='an-res'><span>pH ≈ <b data-ph>?</b></span><span><b data-nat>Choisis une solution</b></span></div>";
    function couleur(p) { var c = ["#D9472B", "#E8713A", "#F29A3A", "#FFC93C", "#D6D24A", "#A9CF5E", "#7FCB8C", "#6FBF9A", "#7DB2C8", "#8FB0EE", "#8C8FD8", "#7B6FC4", "#6A5CB6", "#5B4FA8", "#4A3F94"]; return c[Math.round(p)]; }
    el.querySelectorAll(".an-choix button").forEach(function (b) {
      b.addEventListener("click", function () {
        el.querySelectorAll(".an-choix button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        var s = SOL[+b.dataset.i], p = s[1];
        el.querySelector("[data-aig]").style.transform = "translateX(" + (20 + p / 14 * 400) + "px)";
        el.querySelector("[data-pap]").setAttribute("fill", couleur(p));
        el.querySelector("[data-ph]").textContent = f(p, 1);
        el.querySelector("[data-nat]").textContent = p < 7 ? "acide" : p === 7 ? "neutre" : "basique";
      });
    });
    el.querySelector("[data-aig]").style.transform = "translateX(220px)"; el.querySelector("[data-pap]").setAttribute("fill", "#F3F0EA");
  });

  /* ---------- ADN : zoom en 4 étapes + double hélice qui tourne ---------- */
  VRT_A("3e-svt-adn", 2, "Zoome de la cellule jusqu'au gène", function (el) {
    var ET = [
      ["Cellule", "Une cellule du corps : au centre, le noyau.", "<circle cx='210' cy='110' r='90' fill='#E0F5E5' stroke='#00520B' stroke-width='2.5'/><circle cx='222' cy='104' r='36' fill='#7FCB8C' stroke='#00520B' stroke-width='2.5'/><circle cx='150' cy='150' r='8' fill='#C7E8CE'/><circle cx='270' cy='160' r='6' fill='#C7E8CE'/>"],
      ["Noyau", "Dans le noyau, au moment de la division : 46 chromosomes.", "<circle cx='210' cy='110' r='96' fill='#7FCB8C' fill-opacity='.4' stroke='#00520B' stroke-width='2.5'/>" + (function () { var s = ""; for (var i = 0; i < 18; i++) { var a = i * 0.9, r = 18 + i * 3.6, x = 210 + r * Math.cos(a), y = 110 + r * Math.sin(a) * .8; s += "<g transform='translate(" + x + " " + y + ") rotate(" + (i * 37) + ")'><path d='M-4 -12 L4 12 M4 -12 L-4 12' stroke='#007E11' stroke-width='5' stroke-linecap='round'/></g>"; } return s; })()],
      ["Chromosome", "Un chromosome : deux chromatides reliées au centre.", "<g stroke='#007E11' stroke-width='26' stroke-linecap='round'><path d='M170 30 L250 190'/><path d='M250 30 L170 190'/></g><circle cx='210' cy='110' r='12' fill='#00520B'/>"],
      ["ADN et gène", "Déroulé, le chromosome est une double hélice d'ADN ; un gène en est un segment.", "<g class='an-helice'>" + (function () { var s = ""; for (var i = 0; i <= 24; i++) { var x = 40 + i * 14.5, y1 = 110 + 50 * Math.sin(i * 0.52), y2 = 110 - 50 * Math.sin(i * 0.52); s += "<line x1='" + x + "' y1='" + y1 + "' x2='" + x + "' y2='" + y2 + "' stroke='" + (i > 9 && i < 15 ? "#FFC93C" : "#8FB0EE") + "' stroke-width='3'/><circle cx='" + x + "' cy='" + y1 + "' r='4' fill='#1E499B'/><circle cx='" + x + "' cy='" + y2 + "' r='4' fill='#007E11'/>"; } return s; })() + "</g><text x='225' y='210' text-anchor='middle' font-size='14' font-weight='700' fill='#9A6F00'>un gène</text>"]
    ], cur = 0;
    el.innerHTML = "<div class='an-etapes'>" + ET.map(function (e, i) { return "<button type='button' data-i='" + i + "'>" + (i + 1) + ". " + e[0] + "</button>"; }).join("") + "</div><svg viewBox='0 0 420 220' class='an-svg an-zoom' data-sv></svg><p class='an-note' data-t></p>";
    function aff(i) {
      cur = i; var sv = el.querySelector("[data-sv]"); sv.classList.remove("an-in"); void sv.getBBox; sv.innerHTML = ET[i][2];
      requestAnimationFrame(function () { sv.classList.add("an-in"); });
      el.querySelector("[data-t]").textContent = ET[i][1];
      el.querySelectorAll(".an-etapes button").forEach(function (b, k) { b.setAttribute("aria-pressed", k === i); });
    }
    el.querySelectorAll(".an-etapes button").forEach(function (b) { b.addEventListener("click", function () { aff(+b.dataset.i); }); });
    aff(0);
  });

  /* ---------- Ressemblances : choisir les allèles, le caractère change ---------- */
  VRT_A("3e-svt-ressemblances", 1, "Combine les caractères d'un visage", function (el) {
    el.innerHTML = "<div class='an-choix' data-g='lobe'><span>Lobe :</span><button type='button' aria-pressed='true' data-v='libre'>libre</button><button type='button' data-v='attache'>attaché</button></div>" +
      "<div class='an-choix' data-g='yeux'><span>Yeux :</span><button type='button' aria-pressed='true' data-v='#5A3A1E'>marron foncé</button><button type='button' data-v='#8A5A2B'>marron clair</button><button type='button' data-v='#3B6B4A'>verts</button></div>" +
      "<div class='an-choix' data-g='cheveux'><span>Cheveux :</span><button type='button' aria-pressed='true' data-v='crepus'>crépus</button><button type='button' data-v='lisses'>lisses</button></div>" +
      "<svg viewBox='0 0 300 230' class='an-svg' style='max-width:300px;margin:auto'><g data-ch></g><ellipse cx='150' cy='125' rx='70' ry='85' fill='#B9824F'/><g data-or></g><circle data-y1 cx='124' cy='112' r='7'/><circle data-y2 cx='176' cy='112' r='7'/><path d='M130 160 Q150 175 170 160' stroke='#5E2F0E' stroke-width='4' fill='none' stroke-linecap='round'/></svg>" +
      "<p class='an-note'>Tous ces visages sont humains (caractères de l'espèce) mais chacun est unique (caractères individuels).</p>";
    var etat = { lobe: "libre", yeux: "#5A3A1E", cheveux: "crepus" };
    function dess() {
      el.querySelector("[data-y1]").setAttribute("fill", etat.yeux); el.querySelector("[data-y2]").setAttribute("fill", etat.yeux);
      el.querySelector("[data-or]").innerHTML = "<path d='M80 110 q-24 4 -18 34 q6 22 " + (etat.lobe === "libre" ? "18 24 q10 4 8 -10" : "18 16") + "' fill='#A8723F' stroke='#5E2F0E' stroke-width='2'/><path d='M220 110 q24 4 18 34 q-6 22 " + (etat.lobe === "libre" ? "-18 24 q-10 4 -8 -10" : "-18 16") + "' fill='#A8723F' stroke='#5E2F0E' stroke-width='2'/>";
      var ch = ""; if (etat.cheveux === "crepus") { for (var i = 0; i < 26; i++) { var a = Math.PI + i / 25 * Math.PI; ch += "<circle cx='" + (150 + 76 * Math.cos(a)) + "' cy='" + (110 + 86 * Math.sin(a) * .9) + "' r='14' fill='#1E1A17'/>"; } }
      else ch = "<path d='M78 120 Q80 30 150 32 Q220 30 222 120 L210 80 Q150 50 90 80 Z' fill='#1E1A17'/>";
      el.querySelector("[data-ch]").innerHTML = ch;
    }
    el.querySelectorAll(".an-choix").forEach(function (g) { g.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { g.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); etat[g.dataset.g] = b.dataset.v; dess(); }); }); });
    dess();
  });

  /* ---------- IA : l'élève entraîne une mini-IA (mangue ou avocat) ---------- */
  VRT_A("6e-info-ia", 1, "Entraîne ta propre mini-IA", function (el) {
    var ex = [], test = null;
    el.innerHTML = "<p class='an-note' style='margin-top:0'>Montre-lui des fruits et dis ce que c'est. Elle compare ensuite un fruit inconnu à ceux qu'elle a vus (couleur et forme).</p><div class='an-choix'><button type='button' data-f='m'>+ une mangue</button><button type='button' data-f='a'>+ un avocat</button><button type='button' data-t>Tester un fruit inconnu</button><button type='button' data-z>Tout effacer</button></div><svg viewBox='0 0 420 200' class='an-svg' data-sv><text x='14' y='20' font-size='12' fill='#636A80'>jaune ←  couleur  → vert</text><text x='14' y='194' font-size='12' fill='#636A80'>rond ↑ forme ↓ allongé</text></svg><div class='an-res'><span>Exemples : <b data-n>0</b></span><span data-r>Ajoute au moins 2 exemples de chaque fruit.</span></div>";
    var sv = el.querySelector("[data-sv]");
    function point(x, y, f, test) { var g = document.createElementNS(NS, "g"); g.setAttribute("transform", "translate(" + x + " " + y + ")"); g.innerHTML = test ? "<circle r='13' fill='#fff' stroke='#142554' stroke-width='2' stroke-dasharray='3 3'/><text y='5' text-anchor='middle' font-size='14' font-weight='700' fill='#142554'>?</text>" : (f === "m" ? "<ellipse rx='14' ry='10' fill='#FFC93C' stroke='#9A6F00'/>" : "<ellipse rx='9' ry='13' fill='#7FCB8C' stroke='#00520B'/>"); g.setAttribute("class", "an-pop"); sv.appendChild(g); return g; }
    function hasard(f) { return f === "m" ? [60 + Math.random() * 150, 40 + Math.random() * 70] : [210 + Math.random() * 180, 100 + Math.random() * 80]; }
    el.querySelectorAll("[data-f]").forEach(function (b) { b.addEventListener("click", function () { var p = hasard(b.dataset.f); ex.push([p[0], p[1], b.dataset.f]); point(p[0], p[1], b.dataset.f); el.querySelector("[data-n]").textContent = ex.length; }); });
    el.querySelector("[data-t]").addEventListener("click", function () {
      var nm = ex.filter(function (e) { return e[2] === "m"; }).length, na = ex.length - nm, r = el.querySelector("[data-r]");
      if (nm < 2 || na < 2) { r.textContent = "Pas assez d'exemples : une IA sans données ne sait rien."; return; }
      if (test) test.remove(); var p = [40 + Math.random() * 360, 40 + Math.random() * 140]; test = point(p[0], p[1], "", true);
      var d = ex.map(function (e) { return [Math.hypot(e[0] - p[0], e[1] - p[1]), e[2]]; }).sort(function (a, b) { return a[0] - b[0]; }).slice(0, 3);
      var m = d.filter(function (x) { return x[1] === "m"; }).length; r.innerHTML = "Prédiction : <b>" + (m >= 2 ? "mangue" : "avocat") + "</b> (" + Math.round(Math.max(m, 3 - m) / 3 * 100) + " % de ses 3 voisins les plus proches)";
    });
    el.querySelector("[data-z]").addEventListener("click", function () { ex = []; test = null; sv.querySelectorAll("g").forEach(function (g) { g.remove(); }); el.querySelector("[data-n]").textContent = 0; el.querySelector("[data-r]").textContent = "Ajoute au moins 2 exemples de chaque fruit."; });
  });

  /* ---------- Ordinateur : cliquer un composant pour voir son rôle ---------- */
  VRT_A("6e-info-composants", 1, "Clique sur un élément de l'ordinateur", function (el) {
    var R = { clavier: ["Clavier", "Entrée", "Tu tapes du texte et des commandes."], souris: ["Souris", "Entrée", "Tu pointes, tu cliques, tu fais glisser."], uc: ["Unité centrale", "Traitement", "Le processeur calcule, la mémoire vive garde le travail en cours, le disque conserve les fichiers."], ecran: ["Écran", "Sortie", "Il affiche ce que l'ordinateur produit."], imprimante: ["Imprimante", "Sortie", "Elle met sur papier un document."], hp: ["Haut-parleurs", "Sortie", "Ils diffusent le son."] };
    el.innerHTML = "<svg viewBox='0 0 460 220' class='an-svg an-pc'><g data-k='ecran' tabindex='0' role='button' aria-label='Écran'><rect x='150' y='16' width='170' height='110' rx='8' fill='#E4E9F2' stroke='#0C2A6A' stroke-width='2.5'/><rect x='162' y='28' width='146' height='86' rx='4' fill='#DBE8FE'/><path d='M222 126v14h26v-14' fill='#8C9BC0'/></g><g data-k='uc' tabindex='0' role='button' aria-label='Unité centrale'><rect x='26' y='30' width='90' height='150' rx='8' fill='#0C2A6A'/><rect x='40' y='46' width='62' height='10' rx='3' fill='#FFC93C'/><circle cx='71' cy='156' r='9' fill='none' stroke='#FFC93C' stroke-width='2'/></g><g data-k='clavier' tabindex='0' role='button' aria-label='Clavier'><rect x='140' y='160' width='190' height='40' rx='6' fill='#E4E9F2' stroke='#0C2A6A' stroke-width='2.5'/><path d='M152 172h166M152 182h166M170 192h130' stroke='#8C9BC0' stroke-width='5' stroke-dasharray='10 4'/></g><g data-k='souris' tabindex='0' role='button' aria-label='Souris'><rect x='346' y='160' width='30' height='44' rx='15' fill='#E4E9F2' stroke='#0C2A6A' stroke-width='2.5'/><path d='M361 160v14' stroke='#0C2A6A' stroke-width='2'/></g><g data-k='imprimante' tabindex='0' role='button' aria-label='Imprimante'><rect x='350' y='60' width='96' height='50' rx='8' fill='#E4E9F2' stroke='#0C2A6A' stroke-width='2.5'/><rect x='368' y='44' width='60' height='18' fill='#fff' stroke='#0C2A6A' stroke-width='2'/><rect x='368' y='100' width='60' height='22' fill='#fff' stroke='#0C2A6A' stroke-width='2'/></g><g data-k='hp' tabindex='0' role='button' aria-label='Haut-parleurs'><rect x='122' y='70' width='22' height='44' rx='6' fill='#8C9BC0' stroke='#0C2A6A' stroke-width='2'/><circle cx='133' cy='100' r='6' fill='#0C2A6A'/></g></svg><div class='an-fiche' data-f><b>Clique sur un élément</b><span>Écran, clavier, souris, unité centrale, imprimante ou haut-parleurs.</span></div>";
    el.querySelectorAll("[data-k]").forEach(function (g) {
      function choisir() { el.querySelectorAll("[data-k]").forEach(function (x) { x.classList.toggle("an-sel", x === g); }); var r = R[g.dataset.k]; el.querySelector("[data-f]").innerHTML = "<b>" + r[0] + "</b><em class='an-tag an-" + (r[1] === "Entrée" ? "in" : r[1] === "Sortie" ? "out" : "uc") + "'>" + r[1] + "</em><span>" + r[2] + "</span>"; }
      g.addEventListener("click", choisir); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choisir(); } });
    });
  });
})();

/* Schémas animés et manipulables — lot 2. Mêmes règles : transform/opacity, lisible sans animation. */
(function () {
  var NS = "http://www.w3.org/2000/svg";
  function cur(lab, min, max, pas, val, u) { return "<label class='an-cur'><span>" + lab + " <b data-v>" + val + "</b>" + (u || "") + "</span><input type='range' min='" + min + "' max='" + max + "' step='" + pas + "' value='" + val + "'></label>"; }
  function q(el, s) { return el.querySelector(s); }

  /* ---------- 6e : testeur de divisibilité ---------- */
  VRT_A("6e-maths-divisibilite", 1, "Tape un nombre : les critères se vérifient tout seuls", function (el) {
    el.innerHTML = "<label class='an-cur'><span>Ton nombre</span><input type='number' min='0' max='99999999' value='2745' style='width:100%;font:600 22px Poppins,sans-serif;padding:8px 12px;border:1px solid #E6EAF2;border-radius:10px'></label><div class='an-grille' data-g></div><p class='an-note' data-s></p>";
    var inp = q(el, "input");
    function maj() {
      var n = Math.max(0, Math.floor(+inp.value || 0)), s = String(n), som = s.split("").reduce(function (a, c) { return a + +c; }, 0), u = s.slice(-1);
      var T = [["2", n % 2 === 0, "dernier chiffre " + u + (n % 2 === 0 ? " pair" : " impair")], ["5", n % 5 === 0, "se termine par " + u], ["10", n % 10 === 0, "se termine par " + u], ["3", n % 3 === 0, "somme des chiffres " + som], ["9", n % 9 === 0, "somme des chiffres " + som]];
      q(el, "[data-g]").innerHTML = T.map(function (t) { return "<div class='an-carte " + (t[1] ? "an-oui" : "an-non") + "'><b>÷ " + t[0] + "</b><span>" + (t[1] ? VRT.app.pic("coche", 16) + " oui" : VRT.app.pic("croix", 16) + " non") + "</span><small>" + t[2] + "</small></div>"; }).join("");
      q(el, "[data-s]").textContent = s.length > 1 ? "Somme des chiffres : " + s.split("").join(" + ") + " = " + som : "";
    }
    inp.addEventListener("input", maj); maj();
  });

  /* ---------- 5e : PGCD, diviseurs qui s'allument ---------- */
  VRT_A("5e-maths-pgcd", 1, "Choisis deux nombres : leurs diviseurs communs s'allument", function (el) {
    el.innerHTML = cur("a =", 2, 60, 1, 24) + cur("b =", 2, 60, 1, 36).replace("data-v", "data-w") + "<div data-l></div><div class='an-res'><span>PGCD = <b data-p></b></span><span data-r></span></div>";
    var r = el.querySelectorAll("input");
    function div(n) { var d = []; for (var i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; }
    function maj() {
      var a = +r[0].value, b = +r[1].value, da = div(a), db = div(b), co = da.filter(function (x) { return db.indexOf(x) >= 0; }), p = co[co.length - 1];
      q(el, "[data-v]").textContent = a; q(el, "[data-w]").textContent = b;
      function ligne(n, d) { return "<p style='margin:8px 0 4px;font-size:13px;color:#4D5163'>Diviseurs de " + n + "</p><div class='an-chips'>" + d.map(function (x) { return "<span class='" + (x === p ? "an-pg" : co.indexOf(x) >= 0 ? "an-co" : "") + "'>" + x + "</span>"; }).join("") + "</div>"; }
      q(el, "[data-l]").innerHTML = ligne(a, da) + ligne(b, db);
      q(el, "[data-p]").textContent = p; q(el, "[data-r]").textContent = p === 1 ? a + " et " + b + " sont premiers entre eux" : a + "/" + b + " = " + (a / p) + "/" + (b / p) + " (fraction irréductible)";
    }
    r[0].addEventListener("input", maj); r[1].addEventListener("input", maj); maj();
  });

  /* ---------- 4e : boussoles autour d'un aimant (champ de dipôle) ---------- */
  VRT_A("4e-pct-aimants", 1, "Déplace l'aimant : les boussoles s'orientent", function (el) {
    el.innerHTML = "<svg viewBox='0 0 460 260' class='an-svg' data-sv style='touch-action:none;cursor:grab'></svg><p class='an-note'>Fais glisser l'aimant (ou utilise les flèches du clavier). L'aiguille rouge indique le Nord de chaque boussole : elle pointe vers le pôle Sud de l'aimant.</p>";
    var sv = q(el, "[data-sv]"), ax = 230, ay = 130, boussoles = [];
    for (var i = 0; i < 7; i++) for (var j = 0; j < 4; j++) {
      var g = document.createElementNS(NS, "g"), x = 40 + i * 63, y = 35 + j * 63;
      g.innerHTML = "<circle r='15' fill='#fff' stroke='#C9CFDD' stroke-width='1.5'/><g data-a style='transition:transform .25s'><path d='M0 -12 L4 0 L-4 0Z' fill='#D9472B'/><path d='M0 12 L4 0 L-4 0Z' fill='#8C9BC0'/></g>";
      g.setAttribute("transform", "translate(" + x + " " + y + ")"); sv.appendChild(g); boussoles.push([x, y, g.querySelector("[data-a]")]);
    }
    var aim = document.createElementNS(NS, "g"); aim.setAttribute("tabindex", "0"); aim.setAttribute("role", "slider"); aim.setAttribute("aria-label", "Aimant, déplaçable");
    aim.innerHTML = "<rect x='-50' y='-14' width='50' height='28' rx='4' fill='#D9472B'/><rect x='0' y='-14' width='50' height='28' rx='4' fill='#1E499B'/><text x='-25' y='5' text-anchor='middle' font-size='14' font-weight='600' fill='#fff'>N</text><text x='25' y='5' text-anchor='middle' font-size='14' font-weight='600' fill='#fff'>S</text>";
    sv.appendChild(aim);
    function champ(px, py) { /* pôle N (+) à gauche, pôle S (−) à droite */
      var bx = 0, by = 0;[[ax - 40, ay, 1], [ax + 40, ay, -1]].forEach(function (p) { var dx = px - p[0], dy = py - p[1], d = Math.pow(dx * dx + dy * dy, 1.5) + 1; bx += p[2] * dx / d; by += p[2] * dy / d; });
      return Math.atan2(by, bx) * 180 / Math.PI + 90;
    }
    function maj() { aim.setAttribute("transform", "translate(" + ax + " " + ay + ")"); boussoles.forEach(function (b) { b[2].style.transform = "rotate(" + champ(b[0], b[1]) + "deg)"; }); }
    function pt(e) { var r = sv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 460, (e.clientY - r.top) / r.height * 260]; }
    var drag = false;
    aim.addEventListener("pointerdown", function (e) { drag = true; aim.setPointerCapture(e.pointerId); });
    aim.addEventListener("pointermove", function (e) { if (!drag) return; var p = pt(e); ax = Math.max(55, Math.min(405, p[0])); ay = Math.max(20, Math.min(240, p[1])); maj(); });
    aim.addEventListener("pointerup", function () { drag = false; });
    aim.addEventListener("keydown", function (e) { var d = { ArrowLeft: [-15, 0], ArrowRight: [15, 0], ArrowUp: [0, -15], ArrowDown: [0, 15] }[e.key]; if (d) { e.preventDefault(); ax = Math.max(55, Math.min(405, ax + d[0])); ay = Math.max(20, Math.min(240, ay + d[1])); maj(); } });
    maj();
  });

  /* ---------- 4e : élodée, bulles selon la lumière ---------- */
  VRT_A("4e-svt-photosynthese", 2, "Règle la lampe et compte les bulles", function (el) {
    el.innerHTML = "<svg viewBox='0 0 460 240' class='an-svg'><circle data-lampe cx='70' cy='60' r='26' fill='#FFC93C'/><g data-rayons stroke='#FFC93C' stroke-width='3' stroke-linecap='round'><path d='M110 60h40M100 90l30 22M100 30l30-22'/></g><rect x='190' y='40' width='200' height='190' rx='12' fill='#EDF2FB' stroke='#9FBEEA' stroke-width='2'/><rect x='190' y='60' width='200' height='170' fill='#DBE8FE' opacity='.7'/><path d='M290 228 C285 190 300 160 290 120 C282 95 295 80 290 70' stroke='#007E11' stroke-width='5' fill='none'/><g fill='#86D094'><ellipse cx='278' cy='200' rx='12' ry='4'/><ellipse cx='303' cy='175' rx='12' ry='4'/><ellipse cx='279' cy='150' rx='12' ry='4'/><ellipse cx='302' cy='122' rx='12' ry='4'/><ellipse cx='281' cy='96' rx='12' ry='4'/></g><g data-b></g></svg>" + cur("Intensité lumineuse :", 0, 10, 1, 6) + "<div class='an-res'><span>Bulles de dioxygène : <b data-n>0</b> par minute</span></div>";
    var r = q(el, "input"), gb = q(el, "[data-b]"), t = null;
    function bulle() {
      var c = document.createElementNS(NS, "circle"); c.setAttribute("cx", 286 + Math.random() * 10); c.setAttribute("cy", 72); c.setAttribute("r", 3 + Math.random() * 2); c.setAttribute("fill", "#fff"); c.setAttribute("stroke", "#1E499B"); c.setAttribute("class", "an-bulle"); gb.appendChild(c); setTimeout(function () { c.remove(); }, 1600);
    }
    function maj() {
      var v = +r.value; q(el, "[data-v]").textContent = v; q(el, "[data-n]").textContent = v * 6;
      q(el, "[data-lampe]").setAttribute("opacity", 0.25 + v / 13); q(el, "[data-rayons]").setAttribute("opacity", v / 10);
      clearInterval(t); if (v > 0 && !matchMedia("(prefers-reduced-motion: reduce)").matches) t = setInterval(bulle, 1100 - v * 95);
    }
    r.addEventListener("input", maj); maj();
  });

  /* ---------- Tle C : 8 bits cliquables ---------- */
  VRT_A("tle-maths-binaire", 0, "Allume les bits : le nombre décimal se calcule", function (el) {
    el.innerHTML = "<div class='an-bits' data-b></div><div class='an-res'><span>Écriture binaire : <b data-bin></b></span><span>Valeur décimale : <b data-dec></b></span></div><p class='an-note' data-s></p>";
    var bits = [0, 0, 0, 0, 1, 1, 0, 1];
    function rendre() {
      q(el, "[data-b]").innerHTML = bits.map(function (b, i) { var p = 7 - i; return "<button type='button' aria-pressed='" + !!b + "' data-i='" + i + "'><b>" + b + "</b><small>2<sup>" + p + "</sup> = " + Math.pow(2, p) + "</small></button>"; }).join("");
      var dec = bits.reduce(function (a, b, i) { return a + b * Math.pow(2, 7 - i); }, 0), termes = bits.map(function (b, i) { return b ? Math.pow(2, 7 - i) : 0; }).filter(Boolean);
      q(el, "[data-bin]").textContent = (bits.join("").replace(/^0+(?=.)/, "")) + "₂"; q(el, "[data-dec]").textContent = dec;
      q(el, "[data-s]").textContent = termes.length ? termes.join(" + ") + " = " + dec : "Tous les bits sont éteints : 0.";
      el.querySelectorAll("[data-i]").forEach(function (b) { b.addEventListener("click", function () { bits[+b.dataset.i] ^= 1; rendre(); }); });
    }
    rendre();
  });

  /* ---------- Tle D : globule rouge et cellule végétale selon la concentration ---------- */
  VRT_A("tle-svt-osmose", 1, "Change la concentration du milieu", function (el) {
    el.innerHTML = "<svg viewBox='0 0 460 200' class='an-svg'><g transform='translate(115 95)'><ellipse data-gr rx='60' ry='60' fill='#F2A595' stroke='#B4321E' stroke-width='3' style='transition:all .5s'/><ellipse data-gr2 rx='30' ry='14' fill='#E8806C' opacity='.6' style='transition:all .5s'/></g><text x='115' y='190' text-anchor='middle' font-size='13' fill='#001136'>globule rouge</text><g transform='translate(340 95)'><rect x='-75' y='-65' width='150' height='130' rx='6' fill='#E0F5E5' stroke='#004A0A' stroke-width='4'/><rect data-cyto x='-68' y='-58' width='136' height='116' rx='10' fill='#C9E7CF' stroke='#007E11' stroke-width='1.5' style='transition:all .5s'/><rect data-vac x='-50' y='-42' width='100' height='84' rx='26' fill='#DBE8FE' stroke='#1E499B' style='transition:all .5s'/></g><text x='340' y='190' text-anchor='middle' font-size='13' fill='#001136'>cellule végétale</text></svg>" + cur("NaCl dans le milieu :", 0, 30, 1, 9, " g/L") + "<div class='an-res'><span>Milieu <b data-m></b></span><span data-e></span></div>";
    var r = q(el, "input");
    function maj() {
      var c = +r.value, k = Math.max(-1, Math.min(1, (9 - c) / 9)); /* + : hypotonique, − : hypertonique */
      q(el, "[data-v]").textContent = c;
      var gr = q(el, "[data-gr]"), eclate = c <= 2;
      gr.setAttribute("rx", eclate ? 0 : 60 + k * 14); gr.setAttribute("ry", eclate ? 0 : (k >= 0 ? 60 + k * 14 : 60 + k * 26)); gr.setAttribute("stroke-dasharray", k < -.3 ? "6 4" : "none");
      q(el, "[data-gr2]").setAttribute("opacity", eclate ? 0 : .6);
      var s = k >= 0 ? 1 : 1 + k * .45, cy = q(el, "[data-cyto]"), va = q(el, "[data-vac]");
      cy.setAttribute("width", 136 * s); cy.setAttribute("height", 116 * s); cy.setAttribute("x", -68 * s); cy.setAttribute("y", -58 * s);
      var sv = k >= 0 ? 1 + k * .25 : 1 + k * .7; va.setAttribute("width", 100 * sv); va.setAttribute("height", 84 * sv); va.setAttribute("x", -50 * sv); va.setAttribute("y", -42 * sv);
      q(el, "[data-m]").textContent = c < 8 ? "hypotonique" : c > 10 ? "hypertonique" : "isotonique";
      q(el, "[data-e]").textContent = c <= 2 ? "Hémolyse : le globule éclate ; la cellule végétale est turgescente." : c < 8 ? "L'eau entre : le globule gonfle, la vacuole se remplit." : c > 10 ? "L'eau sort : le globule se ratatine, plasmolyse de la cellule végétale." : "Équilibre : pas de mouvement net d'eau.";
    }
    r.addEventListener("input", maj); maj();
  });

  /* ---------- 4e grec : alphabet cliquable ---------- */
  var GR = [["Α α", "alpha", "a", "alphabet"], ["Β β", "bêta", "b", "biologie (βίος)"], ["Γ γ", "gamma", "g", "géographie (γῆ)"], ["Δ δ", "delta", "d", "démocratie (δῆμος)"], ["Ε ε", "epsilon", "e bref", "écologie"], ["Ζ ζ", "zêta", "dz", "zoologie (ζῷον)"], ["Η η", "êta", "ê long", "hémisphère"], ["Θ θ", "thêta", "th", "théâtre (θέατρον)"], ["Ι ι", "iota", "i", "idée"], ["Κ κ", "kappa", "k", "cinéma (κίνημα)"], ["Λ λ", "lambda", "l", "logique (λόγος)"], ["Μ μ", "mu", "m", "musique (μουσική)"], ["Ν ν", "nu", "n", "nautique (ναῦς)"], ["Ξ ξ", "xi", "ks", "xénophobe (ξένος)"], ["Ο ο", "omicron", "o bref", "orthographe"], ["Π π", "pi", "p", "politique (πόλις)"], ["Ρ ρ", "rhô", "r", "rhétorique"], ["Σ σ ς", "sigma", "s", "symphonie"], ["Τ τ", "tau", "t", "téléphone (τῆλε)"], ["Υ υ", "upsilon", "u (ü)", "hydraulique (ὕδωρ)"], ["Φ φ", "phi", "ph", "philosophie (φίλος)"], ["Χ χ", "khi", "kh", "chronologie (χρόνος)"], ["Ψ ψ", "psi", "ps", "psychologie (ψυχή)"], ["Ω ω", "oméga", "ô long", "horoscope (ὥρα)"]];
  VRT_A("4e-gr-alphabet", 1, "Clique une lettre : nom, son et un mot français", function (el) {
    el.innerHTML = "<div class='an-grec'>" + GR.map(function (g, i) { return "<button type='button' data-i='" + i + "'>" + g[0].split(" ")[1] + "</button>"; }).join("") + "</div><div class='an-fiche' data-f><b>Choisis une lettre</b><span>Les 24 lettres, de l'alpha à l'oméga.</span></div>";
    el.querySelectorAll("[data-i]").forEach(function (b) { b.addEventListener("click", function () {
      el.querySelectorAll("[data-i]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); var g = GR[+b.dataset.i];
      q(el, "[data-f]").innerHTML = "<b style='font-size:28px'>" + g[0] + "</b><span><strong>" + g[1] + "</strong> · se prononce « " + g[2] + " »</span><span>Dans un mot français : <em>" + g[3] + "</em></span>";
    }); });
  });

  /* ---------- 3e arts : la lampe tourne, l'ombre suit ---------- */
  VRT_A("3e-arts-ombre", 0, "Déplace la lampe autour de la sphère", function (el) {
    el.innerHTML = "<svg viewBox='0 0 460 260' class='an-svg'><defs><radialGradient id='sph' data-g cx='35%' cy='35%' r='75%'><stop offset='0' stop-color='#fff'/><stop offset='.35' stop-color='#C9CFDD'/><stop offset='.8' stop-color='#4D5163'/><stop offset='1' stop-color='#1E2333'/></radialGradient></defs><rect x='0' y='190' width='460' height='70' fill='#F5F7FB'/><ellipse data-ombre cx='270' cy='205' rx='70' ry='14' fill='#001136' opacity='.35'/><circle cx='230' cy='140' r='60' fill='url(#sph)'/><g data-lampe><circle r='16' fill='#FFC93C' stroke='#9A6F00' stroke-width='2'/><path d='M0 -26v-8M18 -18l6-6M-18 -18l-6-6' stroke='#FFC93C' stroke-width='3' stroke-linecap='round'/></g><text data-t1 font-size='12' fill='#C24E00'>ombre propre</text><text data-t2 font-size='12' fill='#001136'>ombre portée</text></svg>" + cur("Position de la lampe :", 10, 170, 1, 45, "°");
    var r = q(el, "input");
    function maj() {
      var a = +r.value * Math.PI / 180, lx = 230 - Math.cos(a) * 170, ly = 140 - Math.sin(a) * 120;
      q(el, "[data-v]").textContent = r.value;
      q(el, "[data-lampe]").setAttribute("transform", "translate(" + lx + " " + ly + ")");
      var g = q(el, "[data-g]"); g.setAttribute("cx", (50 - Math.cos(a) * 25) + "%"); g.setAttribute("cy", (50 - Math.sin(a) * 25) + "%");
      var hauteur = Math.max(0.15, Math.sin(a)), long = 60 / hauteur, dir = Math.cos(a) >= 0 ? 1 : -1;
      var om = q(el, "[data-ombre]"); om.setAttribute("rx", Math.min(220, 40 + long * .6)); om.setAttribute("cx", 230 + dir * Math.min(200, long * .7));
      var t1 = q(el, "[data-t1]"); t1.setAttribute("x", 230 + dir * 30); t1.setAttribute("y", 150 + 10);
      var t2 = q(el, "[data-t2]"); t2.setAttribute("x", Math.max(10, Math.min(380, 230 + dir * Math.min(200, long * .7) - 30))); t2.setAttribute("y", 240);
    }
    r.addEventListener("input", maj); maj();
  });

  /* ---------- 6e EPS : la piste, cliquer les éléments ---------- */
  VRT_A("6e-eps-piste", 0, "Clique sur la piste pour nommer ses parties", function (el) {
    var R = { corde: ["La corde", "Bord intérieur de la piste ; le couloir 1 la longe."], couloir: ["Un couloir", "Bande de 1,22 m environ ; le coureur doit y rester."], droite: ["Ligne droite", "Deux lignes droites sur un tour."], virage: ["Virage", "Deux virages ; plus long dans les couloirs extérieurs."], arrivee: ["Ligne d'arrivée", "Commune à toutes les courses."], sens: ["Sens de course", "Inverse des aiguilles d'une montre : la corde est à gauche."] };
    el.innerHTML = "<svg viewBox='0 0 460 240' class='an-svg an-pc'><g data-k='couloir' tabindex='0' role='button' aria-label='Couloir'><rect x='30' y='20' width='400' height='200' rx='100' fill='#E8806C'/></g><g stroke='#fff' stroke-width='1.2' fill='none'>" + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { var d = 12 * i; return "<rect x='" + (30 + d * .5) + "' y='" + (20 + d * .5) + "' width='" + (400 - d) + "' height='" + (200 - d) + "' rx='" + (100 - d * .5) + "'/>"; }).join("") + "</g><g data-k='corde' tabindex='0' role='button' aria-label='Corde'><rect x='78' y='68' width='304' height='104' rx='52' fill='#86D094' stroke='#fff' stroke-width='4'/></g><g data-k='droite' tabindex='0' role='button' aria-label='Ligne droite'><rect x='140' y='22' width='180' height='44' fill='transparent'/></g><g data-k='virage' tabindex='0' role='button' aria-label='Virage'><rect x='32' y='60' width='50' height='120' fill='transparent'/></g><g data-k='arrivee' tabindex='0' role='button' aria-label='Ligne d arrivée'><rect x='318' y='172' width='8' height='48' fill='#fff' stroke='#001136'/></g><g data-k='sens' tabindex='0' role='button' aria-label='Sens de course'><path d='M200 120 a30 30 0 1 0 60 0' fill='none' stroke='#001136' stroke-width='4' marker-end='url(#fs)'/></g><defs><marker id='fs' viewBox='0 0 10 10' refX='6' refY='5' markerWidth='6' markerHeight='6' orient='auto'><path d='M0 0l10 5-10 5z' fill='#001136'/></marker></defs></svg><div class='an-fiche' data-f><b>Clique sur un élément</b><span>Corde, couloir, ligne droite, virage, ligne d'arrivée, sens de course.</span></div>";
    el.querySelectorAll("[data-k]").forEach(function (g) { function f() { el.querySelectorAll("[data-k]").forEach(function (x) { x.classList.toggle("an-sel", x === g); }); var r = R[g.dataset.k]; q(el, "[data-f]").innerHTML = "<b>" + r[0] + "</b><span>" + r[1] + "</span>"; } g.addEventListener("click", f); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(); } }); });
  });

  /* ---------- 6e EPS : coureur en coordination croisée ---------- */
  VRT_A("6e-eps-bras-jambes", 0, "Observe la coordination croisée", function (el) {
    el.innerHTML = "<svg viewBox='0 0 300 240' class='an-svg' style='max-width:320px;margin:auto'><g transform='translate(150 40)' stroke-linecap='round' stroke-width='9' fill='none'><circle cx='0' cy='0' r='16' fill='#F5B57A' stroke='none'/><path d='M0 18 L4 92' stroke='#0C2A6A'/><g class='an-membre an-bd'><path d='M2 30 L-22 60 L-6 84' stroke='#1E499B'/></g><g class='an-membre an-bg'><path d='M2 30 L26 58 L44 44' stroke='#D9472B'/></g><g class='an-membre an-jd'><path d='M4 92 L-18 140 L-40 170' stroke='#D9472B'/></g><g class='an-membre an-jg'><path d='M4 92 L30 136 L22 182' stroke='#1E499B'/></g></g><text x='20' y='230' font-size='12' fill='#1E499B'>■ bras gauche + jambe droite</text><text x='170' y='230' font-size='12' fill='#D9472B'>■ bras droit + jambe gauche</text></svg><p class='an-note'>Même couleur = membres qui avancent ensemble : un bras et la jambe opposée.</p>";
  });

  /* ---------- Tle A sciences : zoom du microscope ---------- */
  VRT_A("tle-sc-microscopie", 1, "Change d'objectif : ×4, ×10, ×40", function (el) {
    el.innerHTML = "<div class='an-choix'><span>Objectif :</span><button type='button' data-z='4'>×4</button><button type='button' data-z='10' aria-pressed='true'>×10</button><button type='button' data-z='40'>×40</button><span style='margin-left:8px'>Oculaire ×10</span></div><div class='an-oculaire'><svg viewBox='0 0 300 300' data-sv><g data-champ style='transition:transform .5s;transform-origin:150px 150px'>" + (function () { var s = ""; for (var i = 0; i < 9; i++) for (var j = 0; j < 7; j++) { var x = i * 40 - 30 + (j % 2) * 20, y = j * 52 - 30; s += "<rect x='" + x + "' y='" + y + "' width='40' height='52' fill='#F4E6EE' stroke='#9C5B7C' stroke-width='1.5'/><ellipse cx='" + (x + 24) + "' cy='" + (y + 20) + "' rx='5' ry='4' fill='#9C5B7C' opacity='.8'/>"; } return s; })() + "</g></svg></div><div class='an-res'><span>Grossissement total : <b data-g>×100</b></span><span data-t></span></div>";
    function z(v) {
      el.querySelectorAll("[data-z]").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.z === v); });
      q(el, "[data-champ]").style.transform = "scale(" + ({ 4: .45, 10: 1, 40: 3.2 }[v]) + ")";
      q(el, "[data-g]").textContent = "×" + v * 10;
      q(el, "[data-t]").textContent = { 4: "On repère la zone à observer.", 10: "On distingue les cellules et leurs parois.", 40: "On voit le noyau de chaque cellule." }[v];
    }
    el.querySelectorAll("[data-z]").forEach(function (b) { b.addEventListener("click", function () { z(+b.dataset.z); }); }); z(10);
  });

  /* ---------- Tle A sciences : organites cliquables ---------- */
  VRT_A("tle-sc-organites", 1, "Clique sur un organite", function (el) {
    var R = { noyau: ["Noyau", "Contient l'ADN et dirige la cellule ; enveloppe percée de pores."], mito: ["Mitochondrie", "Respiration cellulaire : produit l'énergie."], golgi: ["Appareil de Golgi", "Modifie, emballe et expédie les protéines."], ret: ["Réticulum endoplasmique", "Synthèse et transport des molécules ; porte des ribosomes."], lyso: ["Lysosome", "Digestion à l'intérieur de la cellule."], memb: ["Membrane plasmique", "Limite la cellule et contrôle les échanges."] };
    el.innerHTML = "<svg viewBox='0 0 460 260' class='an-svg an-pc'><g data-k='memb' tabindex='0' role='button' aria-label='Membrane'><ellipse cx='230' cy='130' rx='215' ry='118' fill='#FBEFF4' stroke='#B03A6E' stroke-width='4'/></g><g data-k='noyau' tabindex='0' role='button' aria-label='Noyau'><circle cx='220' cy='125' r='52' fill='#ECE8F8' stroke='#5B4FA8' stroke-width='3' stroke-dasharray='10 3'/><circle cx='230' cy='118' r='16' fill='#5B4FA8'/></g><g data-k='mito' tabindex='0' role='button' aria-label='Mitochondrie'><ellipse cx='95' cy='90' rx='38' ry='17' fill='#FDEBDD' stroke='#C24E00' stroke-width='2.5'/><path d='M66 90 q8 -12 14 0 t14 0 t14 0 t14 0' fill='none' stroke='#C24E00' stroke-width='2'/><ellipse cx='350' cy='190' rx='34' ry='15' fill='#FDEBDD' stroke='#C24E00' stroke-width='2.5'/></g><g data-k='golgi' tabindex='0' role='button' aria-label='Appareil de Golgi'><g fill='none' stroke='#0E7C86' stroke-width='5' stroke-linecap='round'><path d='M320 70 q30 12 60 0'/><path d='M318 84 q32 12 64 0'/><path d='M322 98 q28 12 56 0'/></g></g><g data-k='ret' tabindex='0' role='button' aria-label='Réticulum'><path d='M150 200 q20 -18 40 0 t40 0 t40 0' fill='none' stroke='#1E499B' stroke-width='5'/><g fill='#1E499B'><circle cx='160' cy='195' r='3'/><circle cx='200' cy='205' r='3'/><circle cx='240' cy='195' r='3'/></g></g><g data-k='lyso' tabindex='0' role='button' aria-label='Lysosome'><circle cx='110' cy='180' r='13' fill='#E0F5E5' stroke='#007E11' stroke-width='2.5'/><circle cx='380' cy='130' r='11' fill='#E0F5E5' stroke='#007E11' stroke-width='2.5'/></g></svg><div class='an-fiche' data-f><b>Clique sur un organite</b><span>Noyau, mitochondrie, appareil de Golgi, réticulum, lysosome, membrane.</span></div>";
    el.querySelectorAll("[data-k]").forEach(function (g) { function f(e) { if (e) e.stopPropagation(); el.querySelectorAll("[data-k]").forEach(function (x) { x.classList.toggle("an-sel", x === g); }); var r = R[g.dataset.k]; q(el, "[data-f]").innerHTML = "<b>" + r[0] + "</b><span>" + r[1] + "</span>"; } g.addEventListener("click", f); g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(e); } }); });
  });
})();
