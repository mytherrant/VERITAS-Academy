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
