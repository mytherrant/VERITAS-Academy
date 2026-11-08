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
