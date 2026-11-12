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
