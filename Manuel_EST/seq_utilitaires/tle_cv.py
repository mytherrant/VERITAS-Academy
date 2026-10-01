# -*- coding: utf-8 -*-
"""
SÉQUENCE 7 — LE CV (Terminale ST)
Couvre la séquence didactique nationale « le CV » : séq. 5 en Tle TI:AF-F,
TI:BT et SES ; séq. 6 en Tle ACA, ACC, CG, FIG.

Progression officielle reprise :
  S1 structure externe et interne · S2 rédaction · S3 adaptation à une
  situation d'embauche (+ présentation orale pour BT-TI) · S4 intégration
  · S5 évaluation · S6 compte rendu et remédiation.
Outils de langue associés : lexique commun / lexique spécialisé ; outils de
liaison (adverbes, locutions adverbiales, pronoms relatifs) ; valeurs des
modes impératif et infinitif.

Le CV spécimen est une pièce FICTIVE construite pour la leçon (document
fonctionnel, non texte d'auteur) : aucune personne réelle n'y est décrite.
"""

# Chaque entrée = (style, texte). Styles du cahier :
# T_Seq T_Comp T_Sem T_Disc Objectif Corpus Texte_Titre Texte Source
# Rubrique Question Reponse Retient_Titre Retient_Corps Definition
# Outil Astuce Repere VersLeBac Exercice Consigne Corps Liste

R = ('Reponse', '\t')          # ligne de réponse (2 par question)


def q(n, txt, lignes=2):
    out = [('Question', '%d. %s' % (n, txt))]
    out += [R] * lignes
    return out


SEQ = []
A = SEQ.append
E = SEQ.extend

# =========================================================================
A(('T_Seq', 'SÉQUENCE 7'))
A(('T_Comp', "Compétence attendue : À la fin de la séquence, l'élève produira un CV "
             "et l'adaptera à une situation d'embauche."))
A(('Corps', "Cette séquence correspond à la séquence didactique nationale consacrée au CV "
            "(séquence 5 des séries TI:AF et F, TI:BT et SES ; séquence 6 des séries ACA, "
            "ACC, CG, FIG). Elle relève de la famille de situation « Utilisation de l'écrit "
            "et de l'oral pour produire divers types de textes »."))

# ------------------------------------------------------------------ SEM 1
A(('T_Sem', "👉 Semaine 1 — Le CV : lire un document fonctionnel et en dégager la structure"))

A(('T_Disc', "Leçon 1 · 📝 Langue — Le lexique commun et le lexique spécialisé"))
A(('Objectif', "🎯 À la fin de la leçon, l'apprenant sera capable de distinguer le lexique "
               "commun du lexique spécialisé et d'employer le vocabulaire propre au monde du travail."))
A(('Corpus', "📌 Corpus : extrait d'une offre de stage parue dans la presse économique camerounaise (document fonctionnel)."))
A(('Texte_Titre', "J'observe"))
A(('Texte', "AVIS DE RECRUTEMENT — Stage académique de fin de cycle"))
A(('Texte', "La société CAMTECH INDUSTRIE, spécialisée dans la maintenance des équipements "
            "frigorifiques, recherche deux stagiaires titulaires d'un Baccalauréat technique "
            "(série F3 ou MEM) pour un stage de trois mois à son atelier de Bonabéri."))
A(('Texte', "Missions : assister le technicien de maintenance dans le diagnostic des pannes ; "
            "renseigner les fiches d'intervention ; participer à l'inventaire des pièces de rechange ; "
            "respecter les consignes de sécurité en vigueur sur le site."))
A(('Texte', "Profil recherché : rigueur, ponctualité, aptitude au travail en équipe, "
            "maîtrise élémentaire de l'outil informatique."))
A(('Texte', "Dossier à déposer : une demande manuscrite, un curriculum vitæ, une copie certifiée "
            "du diplôme, une photocopie de la carte nationale d'identité."))
A(('Source', "Document fonctionnel reconstitué à partir du format des avis de recrutement en usage."))
A(('Rubrique', "🔍 Je manipule"))
E(q(1, "Relève dans cet avis cinq mots que tu emploies dans la vie de tous les jours, "
      "puis cinq mots que tu n'emploies que dans un contexte professionnel ou technique."))
E(q(2, "« Maintenance », « diagnostic », « fiche d'intervention », « pièces de rechange » : "
      "à quel métier ces mots appartiennent-ils ? Ce sont des mots du lexique…"))
E(q(3, "Le mot « profil » a un sens courant (le côté du visage) et un sens spécialisé dans cet avis. "
      "Lequel ? Comment appelle-t-on ce phénomène ?"))
E(q(4, "Pourquoi une entreprise emploie-t-elle un vocabulaire spécialisé dans une offre d'emploi ? "
      "Que se passe-t-il pour le candidat qui ne le comprend pas ?"))
A(('Rubrique', "📐 Je retiens la règle"))
A(('Retient_Titre', "🧠 Je retiens"))
A(('Retient_Corps', "Le lexique commun rassemble les mots que tout locuteur d'une langue comprend, "
                    "quel que soit son métier. Le lexique spécialisé rassemble les mots propres à un "
                    "domaine d'activité : c'est la terminologie de ce domaine."))
A(('Retient_Corps', "Un même mot peut appartenir aux deux : il a alors un sens commun et un sens "
                    "spécialisé. « Profil » désigne le côté du visage dans la langue courante, et "
                    "l'ensemble des qualités attendues d'un candidat dans le langage du recrutement. "
                    "C'est le contexte qui tranche."))
A(('Retient_Corps', "Dans un CV, le lexique spécialisé n'est pas un ornement : il prouve que tu "
                    "connais le métier. Écrire « j'ai aidé à réparer des machines » et écrire "
                    "« j'ai assisté le technicien dans le diagnostic des pannes » décrivent le même "
                    "geste — mais la seconde formulation te place déjà dans la profession."))
A(('Definition', "🌺 La terminologie : l'ensemble organisé des termes propres à un domaine "
                 "(la mécanique, la comptabilité, le droit). Chaque terme y a un sens unique et stable."))
A(('Definition', "🌺 Le jargon : l'emploi d'un lexique spécialisé devant un public qui ne le "
                 "comprend pas. Le même mot est terminologie devant un spécialiste et jargon devant un profane."))
A(('VersLeBac', "👑 Vers le BAC — La rubrique « Sémantique / Lexicologie » de l'épreuve de langue "
                "interroge régulièrement l'opposition lexique commun / lexique spécialisé, et demande "
                "de retrouver le domaine d'un terme. Repère toujours le domaine AVANT de proposer un sens."))
A(('Rubrique', "✍️ Je m'exerce"))
A(('Exercice', "✍️ Exercice 1 : Relève dans l'avis ci-dessus dix termes spécialisés. Pour chacun, "
               "indique le domaine d'activité, puis donne un équivalent en lexique commun. Présente "
               "ton travail en trois colonnes."))
A(('Exercice', "✍️ Exercice 2 : Choisis le métier auquel ta série te prépare. Constitue le lexique "
               "spécialisé de ce métier : quinze termes au minimum, classés par sous-domaine "
               "(les outils, les opérations, les documents, les risques). Ce répertoire te servira "
               "pour rédiger ton CV."))

A(('T_Disc', "Leçon 2 · 🖋️ Méthodologie — Le CV : structure externe et structure interne"))
A(('Objectif', "🎯 À la fin de la leçon, l'apprenant sera capable d'identifier la structure externe "
               "et la structure interne d'un curriculum vitæ."))
A(('Corpus', "📌 Corpus : curriculum vitæ d'un candidat au stage annoncé ci-dessus (spécimen)."))
A(('Texte_Titre', "J'observe"))
A(('Texte', "NGONO Émile Aristide"))
A(('Texte', "Né le 12 mars 2007 à Ebolowa — Célibataire — Nationalité camerounaise"))
A(('Texte', "Quartier Nyalla, Douala V — Tél. : 6 XX XX XX XX — emile.ngono@exemple.cm"))
A(('Texte', "FORMATION"))
A(('Texte', "2026 — Baccalauréat technique, série F3 (Électrotechnique), Lycée technique de Douala-Koumassi. "
            "2023 — Brevet d'études du premier cycle, Collège de la Réconciliation, Ebolowa."))
A(('Texte', "EXPÉRIENCES"))
A(('Texte', "Juillet-août 2025 — Stage d'observation (un mois), atelier ÉLECTRO-SERVICE, Douala. "
            "Démontage et remontage de moteurs asynchrones ; tenue du registre des interventions."))
A(('Texte', "2024-2026 — Trésorier du club scientifique du lycée. Gestion d'une caisse de 85 000 francs ; "
            "présentation du bilan devant l'assemblée des membres."))
A(('Texte', "COMPÉTENCES"))
A(('Texte', "Lecture de schémas électriques. Utilisation du multimètre et de la pince ampèremétrique. "
            "Traitement de texte et tableur (niveau élémentaire). Français, anglais scolaire, boulou."))
A(('Texte', "CENTRES D'INTÉRÊT"))
A(('Texte', "Réparation d'appareils électroménagers dans le quartier. Football (capitaine de l'équipe du lycée)."))
A(('Source', "Spécimen construit pour la leçon. Le candidat est fictif."))
A(('Rubrique', "🔍 Je manipule"))
E(q(1, "Combien de rubriques ce CV comporte-t-il ? Nomme-les dans l'ordre où elles apparaissent."))
E(q(2, "Observe la mise en page : où sont placés le nom et les coordonnées ? Comment les titres de "
      "rubrique se distinguent-ils du reste ? Ce que tu décris là, c'est la structure externe."))
E(q(3, "Dans la rubrique FORMATION, dans quel ordre les diplômes sont-ils cités : du plus ancien au "
      "plus récent, ou l'inverse ? Pourquoi ce choix, selon toi ?"))
E(q(4, "La rubrique EXPÉRIENCES mentionne un poste de trésorier de club, qui n'est pas un emploi. "
      "Pourquoi le candidat l'a-t-il fait figurer ? Que prouve-t-il ?"))
E(q(5, "Relève les verbes employés dans les expériences (« démontage », « tenue », « gestion »…). "
      "Sont-ils conjugués ? Sous quelle forme se présentent-ils ?"))
A(('Rubrique', "📐 Je retiens la règle"))
A(('Retient_Titre', "🧠 Je retiens"))
A(('Retient_Corps', "Le curriculum vitæ — littéralement « le cours de la vie » — est un document "
                    "fonctionnel qui présente, sur une page, l'identité, la formation, l'expérience et "
                    "les compétences d'un candidat. Il ne se lit pas : il se parcourt. Un recruteur y "
                    "consacre moins d'une minute."))
A(('Retient_Corps', "La structure EXTERNE, c'est la disposition sur la page : l'état civil et les "
                    "coordonnées en tête ; les rubriques détachées par des titres en capitales ou en gras ; "
                    "les dates alignées à gauche ; une page unique, aérée, sans faute. Elle se voit avant "
                    "d'être lue, et c'est elle qui décide si le CV sera lu."))
A(('Retient_Corps', "La structure INTERNE, c'est l'ordre et le contenu des rubriques : état civil, "
                    "formation, expériences, compétences, centres d'intérêt. À l'intérieur de chaque "
                    "rubrique, l'ordre est ANTICHRONOLOGIQUE — du plus récent au plus ancien — parce que "
                    "le recruteur s'intéresse d'abord à ce que tu es aujourd'hui."))
A(('Retient_Corps', "Le CV s'écrit sans « je ». On emploie des noms (« gestion d'une caisse ») ou des "
                    "verbes à l'infinitif, jamais des phrases complètes. Cette absence de pronom n'est pas "
                    "de la froideur : elle fait gagner de la place et met l'action au premier plan."))
A(('Definition', "🌺 La structure externe : tout ce qui relève de la disposition matérielle du document "
                 "— emplacement des blocs, typographie, alignements, blancs."))
A(('Definition', "🌺 La structure interne : l'organisation du contenu — nature des rubriques, ordre des "
                 "informations à l'intérieur de chacune."))
A(('Definition', "🌺 L'ordre antichronologique : du plus récent au plus ancien. Il est de règle dans le "
                 "CV, pour la formation comme pour les expériences."))
A(('Astuce', "💡 Astuce — Une expérience n'est pas forcément un emploi salarié. Un stage, une "
             "responsabilité associative, un travail de vacances, une réparation faite pour le voisinage : "
             "tout cela prouve une compétence. Ce qui compte n'est pas d'avoir été payé, c'est d'avoir fait."))
A(('VersLeBac', "👑 Vers le BAC — L'épreuve d'écrit utilitaire donne une situation (une offre, un besoin) "
                "et demande le document correspondant. On note d'abord la conformité au genre : un CV qui "
                "aurait la forme d'une lettre perd l'essentiel des points, même bien écrit."))
A(('Rubrique', "✍️ Je m'exerce"))
A(('Exercice', "✍️ Exercice 1 : Recopie les cinq titres de rubrique du spécimen, puis, sous chacun, "
               "note en une phrase ce que la rubrique doit contenir et l'ordre dans lequel les "
               "informations s'y rangent."))
A(('Exercice', "✍️ Exercice 2 : Le CV ci-dessus tiendrait-il sur une page ? Reporte-le au brouillon en "
               "respectant les alignements, puis mesure. Si tu dépasses, indique ce que tu supprimerais "
               "en premier et justifie ton choix par l'offre de stage de la leçon 1."))

# ------------------------------------------------------------------ SEM 2
A(('T_Sem', "👉 Semaine 2 — Rédiger son CV : les rubriques et les liaisons"))

A(('T_Disc', "Leçon 1 · 📝 Langue — Les outils de liaison dans la phrase"))
A(('Objectif', "🎯 À la fin de la leçon, l'apprenant sera capable d'employer les adverbes de liaison, "
               "les locutions adverbiales et les pronoms relatifs pour enchaîner ses idées."))
A(('Corpus', "📌 Corpus : lettre d'accompagnement du candidat NGONO (spécimen)."))
A(('Texte_Titre', "J'observe"))
A(('Texte', "J'ai obtenu en juin dernier le Baccalauréat technique F3, que j'ai préparé au lycée "
            "technique de Douala-Koumassi. Au cours de ma formation, j'ai découvert la maintenance "
            "des machines tournantes, qui est devenue ma spécialité de prédilection. J'ai en outre "
            "effectué un stage d'un mois dans un atelier où l'on réparait des moteurs asynchrones. "
            "Cependant, cette première expérience est restée courte. C'est pourquoi je souhaite "
            "aujourd'hui l'approfondir dans une entreprise dont la réputation en matière de "
            "maintenance frigorifique n'est plus à faire. Par ailleurs, la rigueur exigée sur vos "
            "sites correspond à la manière dont j'ai été formé."))
A(('Source', "Spécimen construit pour la leçon."))
A(('Rubrique', "🔍 Je manipule"))
E(q(1, "Relève les mots « que », « qui », « où », « dont ». Quel mot chacun remplace-t-il dans la "
      "phrase précédente ? Comment appelle-t-on ces mots ?"))
E(q(2, "Relève « en outre », « cependant », « c'est pourquoi », « par ailleurs ». Quel rapport chacun "
      "établit-il : ajout, opposition, conséquence ?"))
E(q(3, "Supprime tous ces mots de liaison et relis le passage. Que devient-il ? Le sens est-il encore "
      "le même ?"))
E(q(4, "« C'est pourquoi » et « cependant » sont-ils de même nature que « que » et « qui » ? "
      "Qu'est-ce qui les distingue ?"))
A(('Rubrique', "📐 Je retiens la règle"))
A(('Retient_Titre', "🧠 Je retiens"))
A(('Retient_Corps', "Les outils de liaison assurent la cohérence du texte : ils rendent visible le "
                    "rapport logique entre les idées. Sans eux, un texte n'est plus qu'une suite de "
                    "phrases juxtaposées, que le lecteur doit relier lui-même — et qu'il relie mal."))
A(('Retient_Corps', "Les PRONOMS RELATIFS (qui, que, quoi, dont, où, lequel, auquel, duquel) "
                    "introduisent une proposition subordonnée relative et reprennent un mot déjà "
                    "exprimé, l'antécédent. Ils lient à l'intérieur de la phrase et évitent la répétition : "
                    "« un stage dans un atelier où l'on réparait des moteurs » remplace « un stage dans un "
                    "atelier ; dans cet atelier, on réparait des moteurs »."))
A(('Retient_Corps', "Les ADVERBES DE LIAISON (ainsi, cependant, donc, ensuite, néanmoins, toutefois) et "
                    "les LOCUTIONS ADVERBIALES (en outre, par ailleurs, c'est pourquoi, en revanche, "
                    "de plus, en effet) lient d'une phrase à l'autre. Ils marquent l'addition, l'opposition, "
                    "la cause, la conséquence, la conclusion."))
A(('Retient_Corps', "Attention : le CV, lui, ne comporte pas de liaisons — il est fait de listes. "
                    "Ce sont la lettre d'accompagnement, la requête et le rapport qui en réclament. "
                    "Savoir lier, c'est savoir écrire le texte QUI ACCOMPAGNE le CV."))
A(('Definition', "🌺 L'antécédent : le mot que le pronom relatif reprend. Dans « la maintenance qui est "
                 "devenue ma spécialité », l'antécédent de « qui » est « la maintenance »."))
A(('Definition', "🌺 « Dont » remplace un complément introduit par « de » : « une entreprise dont la "
                 "réputation… » = « la réputation DE cette entreprise »."))
A(('Astuce', "💡 Astuce — Pour choisir entre « que » et « qui » : remplace mentalement par un nom. "
             "Si le mot est sujet du verbe qui suit, c'est « qui » ; s'il est complément d'objet, c'est « que »."))
A(('Rubrique', "✍️ Je m'exerce"))
A(('Exercice', "✍️ Exercice 1 : Réunis chaque couple de phrases en une seule, à l'aide du pronom "
               "relatif qui convient. a) J'ai suivi une formation. Cette formation m'a préparé au "
               "diagnostic. b) Je postule dans un atelier. On y répare des groupes froids. c) Je "
               "possède un diplôme. Je suis fier de ce diplôme. d) J'ai rencontré un technicien. "
               "Ce technicien m'a formé."))
A(('Exercice', "✍️ Exercice 2 : Rédige un paragraphe de huit à dix lignes présentant ton parcours à "
               "un employeur. Emploie au moins trois pronoms relatifs différents et trois locutions "
               "adverbiales différentes, et souligne-les."))

A(('T_Disc', "Leçon 2 · 🖋️ Méthodologie — Le CV : rédiger chaque rubrique"))
A(('Objectif', "🎯 À la fin de la leçon, l'apprenant sera capable de rédiger les rubriques d'un CV "
               "dans la forme nominale attendue."))
A(('Corpus', "📌 Corpus : deux formulations d'une même expérience (corpus annoté)."))
A(('Texte_Titre', "J'observe"))
A(('Texte', "Formulation A — « J'ai fait un stage pendant les vacances dans un atelier à Douala et "
            "j'aidais le patron à réparer des moteurs, et aussi je notais ce qu'on faisait dans un cahier. »"))
A(('Texte', "Formulation B — « Juillet-août 2025 — Stage d'observation (un mois), atelier "
            "ÉLECTRO-SERVICE, Douala. Démontage et remontage de moteurs asynchrones ; tenue du "
            "registre des interventions. »"))
A(('Source', "Corpus annoté construit pour la leçon."))
A(('Rubrique', "🔍 Je manipule"))
E(q(1, "Compte les mots de chaque formulation. Laquelle est la plus courte ? De combien ?"))
E(q(2, "Quelles informations la formulation B donne-t-elle que la formulation A ne donne pas "
      "(date précise, durée, nom de l'entreprise, lieu) ?"))
E(q(3, "Relève les verbes de A. Comment les mêmes actions sont-elles exprimées en B ? "
      "Quelle classe grammaticale remplace le verbe ?"))
E(q(4, "« Aidais le patron à réparer » devient « démontage et remontage de moteurs asynchrones ». "
      "Qu'apporte le second groupe que le premier ne disait pas ?"))
E(q(5, "Quel signe de ponctuation sépare les deux tâches en B ? Pourquoi pas « et » ?"))
A(('Rubrique', "📐 Je retiens la règle"))
A(('Retient_Titre', "🧠 Je retiens"))
A(('Retient_Corps', "Chaque ligne d'expérience se rédige selon une formule constante : "
                    "DATE — INTITULÉ (durée), STRUCTURE, LIEU. Puis, sur la ligne suivante, les tâches, "
                    "en groupes nominaux séparés par des points-virgules. Cette formule est un moule : "
                    "on la remplit, on ne l'invente pas à chaque fois."))
A(('Retient_Corps', "La NOMINALISATION est le procédé central du CV : on transforme le verbe en nom. "
                    "« J'ai réparé » devient « réparation » ; « je tenais le registre » devient « tenue du "
                    "registre ». On gagne de la place et l'on met l'ACTE en avant plutôt que la personne."))
A(('Retient_Corps', "Le CV proscrit le vague. « Aider », « participer », « s'occuper de » ne disent rien : "
                    "ils décrivent une présence, pas un acte. Remplace-les par le geste technique réel — "
                    "démonter, diagnostiquer, calibrer, saisir, inventorier, encaisser. Un recruteur "
                    "recrute des gestes, pas des intentions."))
A(('Retient_Corps', "Chiffre dès que tu le peux. « Gestion d'une caisse » est faible ; « gestion d'une "
                    "caisse de 85 000 francs » est vérifiable. Le nombre est la preuve la moins coûteuse."))
A(('Definition', "🌺 La nominalisation : la transformation d'un verbe en nom (réparer → réparation ; "
                 "tenir → tenue ; vendre → vente). C'est aussi l'une des cinq techniques de réduction "
                 "du résumé : tu la connais déjà."))
A(('Astuce', "💡 Astuce — Tu retrouves ici la technique que tu emploies dans la contraction de texte. "
             "Le CV est un exercice de réduction : dire le maximum dans le minimum de mots. Ce que tu as "
             "appris aux séquences 3 et 4 te sert directement."))
A(('VersLeBac', "👑 Vers le BAC — Les fautes les plus lourdement sanctionnées dans un CV sont la phrase "
                "complète avec « je », l'ordre chronologique au lieu de l'antichronologique, et l'absence "
                "de dates. Elles se corrigent en une relecture : fais-la toujours."))
A(('Rubrique', "✍️ Je m'exerce"))
A(('Exercice', "✍️ Exercice 1 : Réécris ces expériences dans la forme attendue du CV. a) « Pendant les "
               "grandes vacances de 2025 j'ai travaillé chez ma tante qui a une boutique et je vendais "
               "et je tenais les comptes. » b) « Je suis délégué de ma classe depuis deux ans et "
               "j'organise les réunions et je parle au nom des élèves. » c) « L'an dernier j'ai aidé à "
               "installer l'électricité dans la maison de mon oncle. »"))
A(('Exercice', "✍️ Exercice 2 : Rédige entièrement la rubrique EXPÉRIENCES de ton propre CV : trois "
               "entrées au minimum, dans l'ordre antichronologique, chacune suivie de deux tâches en "
               "groupes nominaux. Aucune entrée ne doit contenir de verbe conjugué."))

# ------------------------------------------------------------------ SEM 3
A(('T_Sem', "👉 Semaine 3 — Adapter son CV à une offre, et le présenter"))

A(('T_Disc', "Leçon 1 · 📝 Langue — Les valeurs des modes : impératif et infinitif"))
A(('Objectif', "🎯 À la fin de la leçon, l'apprenant sera capable d'identifier les valeurs de "
               "l'impératif et de l'infinitif et de choisir le mode adapté à un écrit fonctionnel."))
A(('Corpus', "📌 Corpus : consignes de sécurité affichées dans un atelier (document fonctionnel)."))
A(('Texte_Titre', "J'observe"))
A(('Texte', "CONSIGNES DE SÉCURITÉ — ATELIER DE MAINTENANCE"))
A(('Texte', "Porter obligatoirement les équipements de protection individuelle. Ne pas intervenir sur "
            "une machine sous tension. Consigner toute anomalie dans le registre prévu à cet effet."))
A(('Texte', "Avant toute intervention, vérifiez la mise hors tension. Signalez immédiatement au chef "
            "d'atelier tout incident, même bénin. N'utilisez que l'outillage mis à votre disposition."))
A(('Texte', "En cas de départ de feu : couper l'alimentation générale, donner l'alerte, évacuer par "
            "l'issue la plus proche."))
A(('Source', "Document fonctionnel reconstitué à partir du format des affichages réglementaires d'atelier."))
A(('Rubrique', "🔍 Je manipule"))
E(q(1, "Classe les verbes du texte en deux colonnes : ceux qui se terminent par -er, -ir, -re sans "
      "sujet exprimé ; ceux qui sont conjugués à la deuxième personne du pluriel. À quels modes "
      "appartiennent-ils ?"))
E(q(2, "Les deux modes expriment-ils la même chose ici ? Un ordre à l'infinitif est-il moins "
      "impérieux qu'un ordre à l'impératif ?"))
E(q(3, "Le premier paragraphe s'adresse-t-il à quelqu'un en particulier ? Et le deuxième ? "
      "Qu'est-ce que cela change dans le ton ?"))
E(q(4, "« Ne pas intervenir » et « N'utilisez que » : relève la construction de la négation dans "
      "chaque cas. Que remarques-tu ?"))
A(('Rubrique', "📐 Je retiens la règle"))
A(('Retient_Titre', "🧠 Je retiens"))
A(('Retient_Corps', "L'IMPÉRATIF exprime l'ordre, la défense, le conseil, la prière. Il n'a que trois "
                    "personnes (2ᵉ du singulier, 1ʳᵉ et 2ᵉ du pluriel) et ne porte pas de pronom sujet. "
                    "Il s'adresse à un destinataire identifié : « Vérifiez la mise hors tension » "
                    "s'adresse à vous, ici, maintenant."))
A(('Retient_Corps', "L'INFINITIF est le mode qui nomme l'action sans l'attribuer à personne. Employé "
                    "comme un ordre — c'est l'infinitif injonctif — il donne une consigne VALABLE POUR "
                    "TOUS ET EN TOUT TEMPS : « Porter obligatoirement les équipements ». C'est pourquoi "
                    "les règlements, les modes d'emploi et les recettes l'emploient."))
A(('Retient_Corps', "La négation le montre bien : à l'infinitif, les deux éléments restent groupés "
                    "AVANT le verbe (« ne pas intervenir ») ; à l'impératif, ils encadrent le verbe "
                    "(« n'utilisez que »)."))
A(('Retient_Corps', "Dans un CV, l'infinitif est la forme des compétences (« lire un schéma », "
                    "« utiliser un multimètre ») ; l'impératif n'y a aucune place — on ne donne pas "
                    "d'ordre à son recruteur."))
A(('Definition', "🌺 L'infinitif injonctif : l'infinitif employé pour donner une consigne impersonnelle, "
                 "dans un règlement ou une notice."))
A(('Definition', "🌺 La valeur d'un mode : ce que le mode exprime en contexte, au-delà de sa forme "
                 "(l'ordre, le conseil, la défense, l'hypothèse, le souhait)."))
A(('VersLeBac', "👑 Vers le BAC — La rubrique « Morphosyntaxe » demande souvent d'identifier un mode "
                "PUIS d'en donner la valeur. Les deux questions valent des points distincts : nommer le "
                "mode ne suffit jamais, il faut dire ce qu'il exprime dans CE texte."))
A(('Rubrique', "✍️ Je m'exerce"))
A(('Exercice', "✍️ Exercice 1 : Réécris les consignes du deuxième paragraphe à l'infinitif injonctif, "
               "puis celles du premier à l'impératif. Indique ensuite ce que le changement modifie dans "
               "le rapport au lecteur."))
A(('Exercice', "✍️ Exercice 2 : Rédige, en dix consignes, le règlement de l'atelier ou du laboratoire "
               "de ta spécialité. Emploie l'infinitif injonctif pour les règles permanentes et "
               "l'impératif pour les gestes d'urgence. Justifie ton choix en deux phrases."))

A(('T_Disc', "Leçon 2 · 🖋️ Méthodologie — Adapter son CV à une situation d'embauche"))
A(('Objectif', "🎯 À la fin de la leçon, l'apprenant sera capable d'adapter son CV à une offre "
               "déterminée en hiérarchisant ses informations."))
A(('Corpus', "📌 Corpus : l'offre CAMTECH INDUSTRIE (leçon 1, semaine 1) et le CV de NGONO Émile "
             "(leçon 2, semaine 1). Reviens à ces deux documents."))
A(('Rubrique', "🔍 Je manipule"))
E(q(1, "Relis l'offre. Relève les quatre exigences du « profil recherché » et les quatre missions "
      "annoncées."))
E(q(2, "Pour chaque exigence, cherche dans le CV de NGONO l'élément qui y répond. Y a-t-il des "
      "exigences auxquelles rien ne répond ?"))
E(q(3, "L'offre demande une « maîtrise élémentaire de l'outil informatique ». Où cette information "
      "figure-t-elle dans le CV ? Est-elle bien placée pour être vue ?"))
E(q(4, "Le CV mentionne le football et la réparation d'appareils du quartier. Laquelle de ces deux "
      "informations sert la candidature ? Pourquoi l'autre n'est-elle pas inutile pour autant ?"))
E(q(5, "Si tu devais remonter une seule ligne du CV pour cette offre précise, laquelle et pourquoi ?"))
A(('Rubrique', "📐 Je retiens la règle"))
A(('Retient_Titre', "🧠 Je retiens"))
A(('Retient_Corps', "Un CV ne s'écrit pas une fois pour toutes : il se RÉGLE sur l'offre. Le contenu "
                    "reste vrai — on ne ment jamais — mais l'ordre, le détail et le vocabulaire changent "
                    "selon ce qui est demandé."))
A(('Retient_Corps', "La méthode tient en trois temps. (a) SOULIGNER dans l'offre les mots qui disent "
                    "l'attente : diplôme exigé, missions, qualités. (b) APPARIER chaque mot souligné à un "
                    "élément de ton parcours. (c) REMONTER dans le CV les éléments appariés et reprendre "
                    "leur formulation avec les MOTS DE L'OFFRE — si l'offre dit « diagnostic des pannes », "
                    "écris « diagnostic », non « recherche des problèmes »."))
A(('Retient_Corps', "Ce qui ne sert pas l'offre ne disparaît pas forcément : il descend. Les centres "
                    "d'intérêt prouvent que tu existes hors de l'école ; ils occupent la dernière place, "
                    "jamais la première."))
A(('Retient_Corps', "Une exigence à laquelle tu ne réponds pas ne se cache pas et ne s'invente pas. "
                    "Elle se compense : à défaut du diplôme demandé, mets en avant l'expérience ; à défaut "
                    "d'expérience, la formation et la motivation — que la lettre d'accompagnement, elle, "
                    "développera."))
A(('Definition', "🌺 L'appariement : la mise en correspondance, terme à terme, des exigences de l'offre "
                 "et des éléments du parcours. C'est le travail préparatoire de toute candidature."))
A(('Astuce', "💡 Astuce — Reprendre les mots de l'offre n'est pas de la flatterie : beaucoup de "
             "structures trient les candidatures par mots-clés. Le CV qui n'emploie pas les mots de "
             "l'offre risque de n'être jamais lu par un être humain."))
A(('Rubrique', "✍️ Je m'exerce"))
A(('Exercice', "✍️ Exercice 1 : Établis le tableau d'appariement complet entre l'offre CAMTECH et le CV "
               "de NGONO : deux colonnes, « ce que l'offre demande » et « ce que le CV prouve ». Marque "
               "d'une croix les exigences sans réponse."))
A(('Exercice', "✍️ Exercice 2 : Reprends le CV que tu as commencé la semaine 2. Adapte-le à une offre "
               "réelle ou reconstituée correspondant à ta série. Rends deux documents : l'offre et ton "
               "CV adapté, en soulignant les mots que tu as repris de l'offre."))

A(('T_Disc', "Leçon 3 · 🗣️ Oral — Présenter son CV devant un jury"))
A(('Objectif', "🎯 À la fin de la leçon, l'apprenant sera capable de présenter oralement son CV dans "
               "les conditions d'un entretien d'embauche."))
A(('Corpus', "📌 Corpus : transcription d'un début d'entretien d'embauche (spécimen annoté)."))
A(('Texte_Titre', "J'observe"))
A(('Texte', "LE RECRUTEUR. — Asseyez-vous. En deux minutes, présentez-vous."))
A(('Texte', "CANDIDAT A. — Euh… je m'appelle… enfin, comme c'est marqué sur le CV. J'ai fait le "
            "Baccalauréat F3 là, et puis bon, je cherche un stage. Voilà."))
A(('Texte', "LE RECRUTEUR. — Merci. (Au candidat suivant.) Présentez-vous."))
A(('Texte', "CANDIDAT B. — Je m'appelle Émile Ngono, j'ai dix-neuf ans et je viens d'obtenir le "
            "Baccalauréat technique F3 au lycée de Koumassi. Pendant ma formation, je me suis "
            "spécialisé dans la maintenance des machines tournantes : j'ai passé un mois à l'atelier "
            "ÉLECTRO-SERVICE, où j'ai démonté et remonté des moteurs asynchrones et tenu le registre "
            "des interventions. J'ai également été trésorier du club scientifique, ce qui m'a appris "
            "à rendre des comptes devant une assemblée. Votre offre porte sur le diagnostic des pannes "
            "et le suivi des fiches d'intervention : ce sont exactement les deux gestes que j'ai déjà "
            "pratiqués. C'est pourquoi je me présente devant vous."))
A(('Source', "Spécimen construit pour la leçon. Les candidats sont fictifs."))
A(('Rubrique', "🔍 Je manipule"))
E(q(1, "Combien de temps durerait chaque réponse à voix haute ? Chronomètre-les en les lisant."))
E(q(2, "Le candidat A dit « comme c'est marqué sur le CV ». Pourquoi est-ce une faute, alors que "
      "l'information est effectivement sur le CV ?"))
E(q(3, "Relève dans la réponse de B les quatre moments : identité, formation, preuve, lien avec l'offre. "
      "Où commence chacun ?"))
E(q(4, "B emploie « ce qui m'a appris » et « c'est pourquoi ». Retrouve les outils de liaison étudiés "
      "en semaine 2. Que gagne son propos ?"))
E(q(5, "B dit-il autre chose que ce que contient son CV ? Qu'ajoute-t-il alors ?"))
A(('Rubrique', "📐 Je retiens la règle"))
A(('Retient_Titre', "🧠 Je retiens"))
A(('Retient_Corps', "Présenter son CV, ce n'est pas le lire : c'est le RACONTER. Le jury a le document "
                    "sous les yeux ; il attend que tu lui donnes le fil qui relie les lignes."))
A(('Retient_Corps', "La présentation tient en quatre temps, en deux minutes : (1) l'identité — nom, âge, "
                    "diplôme, en une phrase ; (2) le parcours — la formation et sa spécialité ; (3) la "
                    "preuve — une expérience racontée avec un geste précis et un chiffre ; (4) le lien — "
                    "pourquoi CE poste, en reprenant les mots de l'offre."))
A(('Retient_Corps', "Trois fautes coûtent immédiatement : renvoyer au document (« c'est écrit sur le CV ») ; "
                    "s'excuser d'exister (« je n'ai pas beaucoup d'expérience mais… ») ; réciter sans "
                    "regarder. On regarde le jury, on parle posément, on se tait quand on a fini."))
A(('Retient_Corps', "Prépare ta présentation par écrit, apprends-la, puis oublie le texte et garde les "
                    "quatre étapes. Un propos appris par cœur s'entend ; une structure maîtrisée ne "
                    "s'entend pas, elle se sent."))
A(('Definition', "🌺 L'entretien d'embauche : échange oral au cours duquel le candidat justifie, "
                 "développe et incarne ce que son dossier annonce."))
A(('Astuce', "💡 Astuce — Prépare une réponse à la question « Quel est votre défaut ? ». Ne réponds ni "
             "« aucun » ni un défaut rédhibitoire : nomme un défaut réel et dis ce que tu fais pour le corriger."))
A(('VersLeBac', "👑 Vers le BAC — En série BT-TI, la séquence officielle demande explicitement de "
                "PRÉSENTER son CV devant un jury dans le cadre d'un entretien d'embauche. L'exercice est "
                "donc évaluable : prépare-le comme un exposé, pas comme une conversation."))
A(('Rubrique', "✍️ Je m'exerce"))
A(('Exercice', "✍️ Exercice 1 : Rédige intégralement ta présentation de deux minutes, en respectant les "
               "quatre temps. Compte les mots : deux minutes valent environ deux cent cinquante mots."))
A(('Exercice', "✍️ Exercice 2 : Par groupes de trois, jouez l'entretien à tour de rôle — un candidat, "
               "deux membres du jury. Le jury note sur une grille : les quatre temps sont-ils présents ? "
               "le regard ? le débit ? le lien avec l'offre ? Chaque candidat repasse une seconde fois "
               "après remarques."))

# ------------------------------------------------------------------ SEM 4
A(('T_Sem', "👉 Semaine 4 — Intégration"))
A(('T_Disc', "⚖️ Intégration — Produire un CV complet"))
A(('Objectif', "🎯 À la fin de cette étape, l'apprenant sera capable de mobiliser toutes les ressources "
               "de la séquence pour produire un CV adapté à une situation d'embauche."))
A(('Consigne', "Consigne : Situation — La société SOCATRAM, installée à Douala-Bonabéri, recrute "
               "quatre stagiaires pour trois mois. Elle demande un Baccalauréat technique, "
               "« le sens de l'organisation, la ponctualité et l'aptitude à rendre compte par écrit ». "
               "Les missions annoncées sont : la tenue des documents de suivi, l'assistance aux "
               "techniciens sur le site, et la participation aux inventaires mensuels. Le dossier "
               "comprend un curriculum vitæ d'une page."))
A(('Consigne', "Tâche : 1) Souligne dans l'annonce les exigences et les missions. 2) Établis ton "
               "tableau d'appariement. 3) Rédige ton CV complet sur une page, dans l'ordre "
               "antichronologique, sans verbe conjugué, en reprenant les mots de l'annonce. "
               "4) Prépare oralement ta présentation de deux minutes."))
A(('Outil', "🧰 Grille d'auto-évaluation — Coche avant de rendre."))
A(('Liste', "• Le CV tient sur une page unique, aérée, sans rature."))
A(('Liste', "• L'état civil et les coordonnées figurent en tête et sont complets."))
A(('Liste', "• Les cinq rubriques sont présentes et titrées."))
A(('Liste', "• Chaque rubrique est antichronologique."))
A(('Liste', "• Aucune phrase avec « je » ; aucun verbe conjugué dans les rubriques."))
A(('Liste', "• Chaque expérience porte une date, une durée, une structure et un lieu."))
A(('Liste', "• Au moins un chiffre vérifiable figure dans le document."))
A(('Liste', "• Les mots-clés de l'annonce sont repris."))
A(('Liste', "• Relecture orthographique faite à voix basse, mot à mot."))

# ------------------------------------------------------------------ SEM 5
A(('T_Sem', "👉 Semaine 5 — Évaluation"))
A(('T_Disc', "⚖️ Évaluation — Écrit utilitaire : le CV"))
A(('Consigne', "Consigne : Situation — Le Centre hospitalier de district de ta ville recrute un agent "
               "d'appui administratif. L'annonce précise : « Titulaire au minimum du Baccalauréat. "
               "Qualités requises : discrétion, sens de l'accueil, maîtrise du traitement de texte. "
               "Missions : accueil et orientation des usagers, classement des dossiers, saisie des "
               "registres. » Dossier : un CV."))
A(('Consigne', "I. CV — 14 points. Rédige ton curriculum vitæ, adapté à cette annonce, sur une page. "
               "Structure externe 4 pts ; structure interne et ordre antichronologique 4 pts ; "
               "forme nominale et précision des tâches 4 pts ; reprise des mots de l'annonce 2 pts."))
A(('Consigne', "II. LANGUE — 4 points. 1) Relève dans l'annonce deux termes du lexique spécialisé de "
               "l'administration et donne leur équivalent en lexique commun (1 pt). 2) « Titulaire au "
               "minimum du Baccalauréat » : à quel mode est le verbe sous-entendu si l'on réécrit la "
               "phrase en consigne ? Justifie (1 pt). 3) Réunis en une seule phrase, par un pronom "
               "relatif : « Je postule à un poste. Ce poste demande de la discrétion. » (1 pt). "
               "4) Emploie « c'est pourquoi » dans une phrase reliant ta formation à cette candidature (1 pt)."))
A(('Consigne', "III. PRÉSENTATION — 2 points. Copie propre, marges respectées, écriture lisible, "
               "aucune rature."))
A(('Repere', "🎯 Repère — Barème par série : en C-D-E-TI et STT, l'écrit utilitaire est noté sur 20 selon "
             "la répartition ci-dessus. En série industrielle (F, AF, CI, BT), le même sujet se répartit "
             "en compréhension de l'annonce 4 pts, langue 4 pts, production du CV 10 pts, présentation 2 pts."))

# ------------------------------------------------------------------ SEM 6
A(('T_Sem', "👉 Semaine 6 — Compte rendu et remédiation"))
A(('T_Disc', "🧭 Compte rendu — Ce que l'évaluation a montré"))
A(('Rubrique', "🔍 Je fais mon bilan"))
E(q(1, "Compte rendu : ton CV tenait-il sur une page ? Les cinq rubriques y étaient-elles, dans "
      "l'ordre ? As-tu laissé passer un verbe conjugué ?", 3))
E(q(2, "Combien de mots de l'annonce as-tu repris ? Relis ta copie et compte-les."))
E(q(3, "Reprends la ligne d'expérience que tu juges la plus faible. Réécris-la ici en respectant la "
      "formule DATE — INTITULÉ (durée), STRUCTURE, LIEU, puis les tâches en groupes nominaux.", 3))
A(('Rubrique', "📐 Je remédie"))
A(('Exercice', "✍️ Remédiation 1 : Recopie au propre ton CV corrigé. Conserve-le : il te servira "
               "pour la séquence 8 et au-delà du lycée."))
A(('Exercice', "✍️ Remédiation 2 : Constitue un dossier de candidature complet — le CV corrigé et, "
               "en une page, la présentation orale rédigée. Ce dossier est le premier document "
               "professionnel de ta vie."))
