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
