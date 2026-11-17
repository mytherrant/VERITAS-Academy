/* Leçons rédigées VÉRITAS — sciences (maths, PCT, SVT, informatique).
   cle = morceau du titre officiel de la progression MINESEC 2026-2027 (rattachement automatique). */
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
