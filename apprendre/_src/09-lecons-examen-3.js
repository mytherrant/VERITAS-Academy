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
