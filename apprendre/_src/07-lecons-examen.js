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
