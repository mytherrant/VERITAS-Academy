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
      "<div class='integ'><h3>Partie A : évaluation des ressources</h3><p><strong>Question de cours.</strong> Le passage du mythos au logos désigne :</p><ol type='a'><li>le passage de la poésie au théâtre</li><li>le passage de l'explication mythique à l'explication rationnelle</li><li>la traduction du grec en latin</li><li>la naissance de l'écriture</li></ol><details><summary>Voir la réponse</summary><p><strong>Le passage de l'explication mythique à l'explication rationnelle</strong> du monde.</p></details><p><strong>Exercice.</strong> Donne deux arguments contre la thèse du « miracle grec ».</p><details><summary>Voir la réponse</summary><p>Les Grecs eux-mêmes reconnaissent avoir étudié en Égypte (Thalès, Pythagore, Platon) ; l'Égypte possédait déjà des savoirs mathématiques, médicaux et une réflexion morale (Maât).</p></details>" +
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
