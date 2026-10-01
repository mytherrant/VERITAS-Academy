# Audit de conformité — les huit cahiers d'œuvre intégrale

> Rapport produit par `python enrichissement/rapport.py`. Tous les
> nombres sont relus dans les `.docx` au moment de l'écriture ; aucun
> n'est saisi à la main.

## 1. Périmètre

| Cahier | Œuvre | Auteur | Genre | Classe visée |
|---|---|---|---|---|
| `vieuxnegre` | *Le vieux nègre et la médaille* | Ferdinand Oyono | roman | 1ʳᵉ / Tˡᵉ |
| `lionperle` | *Le lion et la perle* | Wole Soyinka | théâtre | 1ʳᵉ / Tˡᵉ |
| `ngum` | *Ngum a Jemea* | David Mbanga Eyombwan | théâtre | 1ʳᵉ / Tˡᵉ |
| `capitoline` | *Les tribus de Capitoline* | P.-C. Ombété-Bella | roman | 1ʳᵉ / Tˡᵉ |
| `tenebres` | *Au cœur des ténèbres* | Joseph Conrad | récit | 1ʳᵉ / Tˡᵉ |
| `tartuffe` | *Tartuffe ou l'Imposteur* | Molière | théâtre | seconde |
| `sauvages` | *Poèmes sauvages éclairés au feu de brousse* | Henri N'koumo | poésie | seconde |
| `stances` | *Stances et Poèmes* | Sully Prudhomme | poésie | 1ʳᵉ / Tˡᵉ |
| `balafon` | *Balafon* | Engelbert Mveng | poésie | 1ʳᵉ / Tˡᵉ |

## 2. Conformité de forme

Mesurée par `enrichissement/audit.py` : volume, fiches, devoirs rédigés,
encadrés, format d'épreuve MINESEC, grilles OBC à vingt points.

| Cahier | Mots | Extraits | Fiches | Devoirs rédigés | Encadrés | Verdict |
|---|---:|---:|---:|---:|---:|---|
| `vieuxnegre` | 44153 | 11 | 6 | 4 (1704 mots moy.) | 89 | conforme |
| `lionperle` | 39658 | 11 | 6 | 4 (1417 mots moy.) | 85 | conforme |
| `ngum` | 41313 | 11 | 6 | 4 (1253 mots moy.) | 86 | conforme |
| `capitoline` | 38683 | 11 | 6 | 4 (1328 mots moy.) | 85 | conforme |
| `tenebres` | 40214 | 11 | 6 | 4 (1326 mots moy.) | 86 | conforme |
| `tartuffe` | 40085 | 11 | 6 | 4 (1261 mots moy.) | 90 | conforme |
| `sauvages` | 40958 | 11 | 6 | 4 (1156 mots moy.) | 90 | conforme |
| `stances` | 45701 | 13 | 6 | 4 (1649 mots moy.) | 91 | conforme |
| `balafon` | 45584 | 13 | 6 | 4 (1315 mots moy.) | 91 | conforme |

**0 manquement(s) sur 9 cahiers.**

## 3. Contrôle verbatim des extraits

Mesuré par `enrichissement/verbatim.py`, qui rouvre le fichier de
l'œuvre et compare chaque phrase — ou chaque vers — du cahier au texte
de l'auteur. Trois catégories d'écart, et une seule qui disqualifie :

- **coquille restituée** : le scan a déformé la lettre (« fds » pour
  « fils », « 11 » pour « Il »). Le cahier rétablit le mot du livre.
- **accent rétabli** : la source numérique a perdu l'accent. Un scan en
  perd en masse ; il ne permet pas de trancher « fût » contre « fut ».
- **écart signalé** : tout le reste, à vérifier à la main.

| Cahier | Extraits | Unités vérifiées | Coquilles | Accents | Écarts signalés |
|---|---:|---:|---:|---:|---:|
| `vieuxnegre` | 10 | 314 | 14 | 6 | 11 |
| `lionperle` | 10 | 299 | 4 | 4 | 8 |
| `ngum` | 10 | 263 | 15 | 4 | 24 |
| `capitoline` | 10 | 138 | 7 | 8 | 1 |
| `tenebres` | 10 | 222 | 1 | 2 | 3 |
| `tartuffe` | 10 | 206 | 0 | 0 | **aucun** |
| `sauvages` | 10 | 24 | 0 | 0 | **aucun** |
| `stances` | 12 | 135 | 0 | 0 | **aucun** |
| `balafon` | 12 | 228 | 2 | 0 | **aucun** |

## 4. Ce qui a été corrigé

**Une seule altération réelle a été trouvée sur les huit cahiers**, et
elle est corrigée : dans *Le lion et la perle*, fiche 2, la réplique de
Sadikou portait « avec **ces** divagations, cela m'était sorti de **la**
tête » là où le texte donne « avec **des** divagations, cela m'était
sorti de tête ». Deux mots, trois occurrences dans le cahier — remis au
texte de l'auteur.

Les autres écarts signalés ont été ouverts un par un sur la source. Ils
relèvent de deux causes, aucune imputable au contenu des cahiers :

- **des coquilles d'océrisation restituées** — « dis » pour « Dès »,
  « mûri » pour « mur », « font » pour « t'ont », « giile » pour
  « gile », « kapotier » pour « kapokier ». Le cahier rend le mot que
  le livre imprime ; c'est la règle du projet, et elle est bien
  appliquée.
- **des décalages de ma fenêtre de comparaison** — quand une phrase
  revient deux fois dans l'œuvre, l'outil peut l'aligner sur la mauvaise
  occurrence. Vérification faite : « Il prit son front dans ses mains. Il
  se sentait très las » (*Le vieux nègre*), « jalonné la route avec des
  piquets » (*Le lion et la perle*) et « ses ténèbres étaient
  impénétrables » (*Au cœur des ténèbres*) figurent **exactement** dans
  leurs sources.

## 5. Ce qui reste à confirmer sur l'exemplaire imprimé

Trois passages où le cahier restitue ce que la source numérique a perdu.
La restitution est très probable — sans elle, la phrase n'a pas de sens
— mais elle ne peut être tranchée que sur le volume papier :

- *Ngum a Jemea* : « je ne fuis pas vers **les** montagnes » (la source
  numérique omet l'article, qu'elle porte pourtant deux vers plus haut).
- *Ngum a Jemea* : « non non non je **ne** fuirai pas » (l'adverbe de
  négation manque à la seconde occurrence de la source).
- *Le lion et la perle* : « **Quant** à ce bouc touffu » — la source
  numérique écrit « quand », qui n'est pas la locution française.

## 6. Ce qui a été ajouté à tous les cahiers

- **Section 2 bis — repères chronologiques et postérité** : une
  chronologie datée par cahier, un paragraphe de réception, un encadré.
  Sources vérifiées ; quand le web et le livre divergent, c'est le livre
  qui tranche — ainsi pour *Poèmes sauvages*, dont plusieurs sites
  donnent une autre année et un autre bilan que le dossier du volume.
- **Rappel du format de l'épreuve** en tête des devoirs rédigés :
  les trois sujets, leurs barèmes, les quatre critères de la grille OBC,
  et la consigne officielle sur l'exploitation des procédés de style.
- **Section 11 — Avant l'épreuve, la dernière révision** : les textes
  étudiés, les dates à connaître, six gestes qui rapportent des points,
  cinq fautes qui en coûtent.

## 7. L'appareil pédagogique ajouté

Quatre sections neuves dans chacun des huit cahiers, plus un rappel de
format et une page de révision :

| Section | Contenu | D'où vient la matière |
|---|---|---|
| 10 bis — Boîte à outils | Trois outils communs, trois propres au genre | Méthodologie, déclinée roman / théâtre / poésie |
| 10 ter — Carte mentale | Huit branches : structure, personnages, lieux, moments, textes étudiés, axes, thèmes, procédés | Relevée **dans l'œuvre** (`oeuvres.py`) et dans les fiches du cahier |
| 10 quater — Fiche de lecture | Formulaire à remplir par l'élève | Le cadre seul : le cahier ne donne pas les réponses |
| 10 quinquies — Faire le point | QCM, appariement, remise en ordre, vrai/faux, complètement, références, écriture | QCM tiré du texte ; le reste construit sur les fiches |
| 11 — Avant l'épreuve | Textes, dates, six gestes qui rapportent, cinq fautes qui coûtent | Synthèse du cahier |

Le rappel du format MINESEC ouvre désormais la section 8 : les trois
sujets, leurs barèmes, les quatre critères de la grille OBC et la
consigne officielle sur l’exploitation des procédés de style.

**Les données d’œuvre ont été relevées dans les fichiers eux-mêmes**, non
dans des notices. Trois vérifications ont corrigé ce que la mémoire ou le
web donnaient :

- *Le vieux nègre et la médaille* : le roman écrit « cercle de **chaux** »,
  jamais « craie » — le mot « craie » n’apparaît pas une seule fois dans
  l’œuvre. Le support de contraction de Lydie Moudileno, lui, écrit
  « craie » : il est reproduit verbatim, et le corrigé signale désormais
  l’écart au correcteur.
- *Au cœur des ténèbres* : le récit est divisé en **trois chapitres**, et
  la Nellie est un « cotre de croisière ».
- *Poèmes sauvages* : édition **2022**, « Henrike Grohs » sans tréma,
  **dix-neuf tués** et trente-trois blessés — ce que dit le dossier du
  volume, là où plusieurs sites donnent 2019 et seize morts.

> ⚠️ **Piège du fichier source du *Lion et la perle*.** Il contient, à la
> suite du texte de Soyinka, une seconde pièce sans rapport (Gbêhanzin,
> Migan, Mèhou, le Danhomè). Le texte authentique s’arrête au mot 23 412.
> C’est noté en tête de `oeuvres.py`.

## 8. Conformité aux corrigés harmonisés de l’OBC

Source : le recueil des corrigés harmonisés nationaux de l’Office du
Baccalauréat (Division des examens, sessions 2020-2022, Littérature,
séries A-ABI) et les deux maquettes de rédaction qui l’accompagnent.
Trois écarts ont été corrigés :

**1. Le barème.** Les cahiers annonçaient « introduction 3 / axes 12 /
conclusion 3 / langue 2 ». Ce découpage ne figure dans aucun corrigé
national. Le barème harmonisé est **6 / 6 / 6 / 2**, avec des
sous-critères chiffrés — dont **1,5 point pour les seuls « Intérêts du
texte »**, rubrique qu’aucun des huit cahiers ne portait. Elle y est
désormais, dans les seize commentaires composés.

**2. Le vocabulaire.** Le corrigé national dit *centre d’intérêt* et non
« axe », *sous-centre* et non « sous-partie », *outil d’analyse* et non
« procédé ». Les parties des trente-deux devoirs rédigés sont renommées
en conséquence, et le lexique des outils employés par l’OBC
— caractérisation nominale, adjectivale, péjorative ; champ lexical ;
reprise anaphorique ; valeur d’un temps — figure en encadré.

**3. La charpente.** Un commentaire composé national s’ordonne ainsi :
situation du texte, idée générale, plan possible, première partie,
transition, deuxième partie, intérêts du texte. Une dissertation :
thème, reformulation, problématique, type de plan, plan possible,
parties, transition, synthèse. Les trente-deux devoirs suivent
désormais cet ordre, et les **deux maquettes de rédaction** — celle du
commentaire et celle de la dissertation, avec leurs formules d’
articulation — ouvrent la section 8 de chaque cahier.

`audit.py` vérifie ces trois points ; le contrôle a été éprouvé par
mutation.

## 9. Contrôle prêt à imprimer

Mesuré par `enrichissement/impression.py`. Les autres contrôles disent
si le cahier est conforme et si ses citations sont exactes ; celui-ci
dit s’il sort proprement de la machine.

| Cahier | Fichier | Caract. | Balisage | Typo. | Structure | Tableaux | Mise en page |
|---|---:|---:|---:|---:|---:|---:|---:|
| `vieuxnegre` | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `lionperle` | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `ngum` | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `capitoline` | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `tenebres` | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `tartuffe` | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `sauvages` | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `stances` | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `balafon` | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

**0 point(s) à examiner sur 9 cahiers.**

Ce que ce contrôle a fait corriger, et qu’aucun autre ne voyait :

- **près de deux mille apostrophes droites par volume** — le rendu pose
  désormais l’apostrophe typographique, l’espace fine devant la
  ponctuation double et l’espace insécable autour des guillemets ;
- **une régression grave** : une boucle du sommaire réutilisait le nom
  de variable `cle`, qui porte l’identifiant du cahier. Les cinq
  cahiers relus perdaient en silence leur rubrique d’examen, leurs
  compléments et tout l’appareil pédagogique — sans message d’erreur ;
- **des pages blanches** : deux sauts de page consécutifs à chaque
  jonction de sections, et un saut placé devant un titre de niveau 1
  qui en provoque déjà un ;
- **un titre d’exercice tronqué** : « ÉTUDIER CE TEXTE — Le pauvre
  homme ! » », coupé au dernier tiret au lieu du premier, laissait
  un guillemet orphelin ;
- **un guillemet fermant surnuméraire** au milieu d’une citation de
  *Le lion et la perle* ;
- **un sommaire menteur** : il annonçait une section au libellé disparu
  et taisait les cinq sections ajoutées depuis.

Le contrôle a été éprouvé par mutation : on insère dans un cahier
construit une apostrophe droite, du markdown non rendu, un double
espace, une ponctuation collée — il voit chacun, et laisse passer le
témoin.

## 10. Pertinence des parcours

Mesurée par `enrichissement/pedagogie.py`, quatrième contrôle, écrit
pour cet audit. Les trois autres disent si le cahier est bien fait ;
celui-ci dit **s'il sert à apprendre**. Un cahier peut être
irréprochable et n'étudier que le dernier tiers d'un roman.

| Cahier | Extraits situés dans l'œuvre | Amplitude | Mots/séquence | Activités |
|---|---|---|---|---|
| `vieuxnegre` | 0% 49% 55% 56% 57% 75% 86% 98% | 0–98 % | 2767–3320 | 15–18 |
| `lionperle` | 7% 8% 26% 34% 59% 69% 85% | 7–85 % | 2375–2825 | 14–19 |
| `ngum` | 19% 28% 29% 32% 85% 87% 97% | 19–97 % | 2305–2810 | 12–19 |
| `capitoline` | 0% 4% 22% 48% 94% | 0–94 % | 2396–2694 | 13–18 |
| `tenebres` | 1% 5% 9% 18% 68% 86% 97% | 1–97 % | 2608–2905 | 13–17 |
| `tartuffe` | 23% 28% 36% 61% 69% 85% 90% | 23–90 % | 2544–2844 | 14–19 |
| `sauvages` | 2% 16% 25% 41% 58% 65% 93% | 2–93 % | 2438–2820 | 15–18 |
| `stances` | 2% 3% 5% 6% 8% 9% 12% 21% 30% 98% | 2–98 % | 2542–3223 | 20–23 |
| `balafon` | 0% 2% 13% 16% 31% 36% 40% 42% 65% 89% | 0–89 % | 2823–3638 | 19–22 |

**Progression.** Les neuf cahiers ont six séquences, six objectifs
distincts, aucun outil répété, et les cinq repères attendus dans
chacune (je lis, j'observe, boîte à outils, je retiens, je m'entraîne).
Chaque séquence tient dans une séance : de deux mille trois cents à
trois mille six cents mots, avec huit à vingt et une activités où
l'élève produit lui-même.

### Ce que cet audit a corrigé

- **Balafon** : un saut de quarante-sept pour cent au cœur du recueil.
  « Mère » — le plus long poème du volume, celui qui nomme l'Afrique
  « Mère des Douleurs » et porte le double rejet (« il parle petit
  nègre » chez les uns, « il parle petit blanc » chez les siens) —
  n'était nulle part. Il devient le support du devoir surveillé,
  questions et corrigé réécrits avec lui.
- **Le vieux nègre et la médaille** : le parcours n'ouvrait le roman
  qu'à quarante-neuf pour cent. L'élève rencontrait Meka déjà debout
  dans son cercle de chaux, sans avoir lu comment le roman le
  construit. Le devoir surveillé porte désormais sur **l'ouverture** —
  la convocation, la nuit sans sommeil, la préparation.

### Deux défauts de mesure, corrigés dans l'outil

- Les chapitres d'un `.epub` étaient triés **alphabétiquement** :
  « c10 » passait avant « c2 ». L'ordre du texte s'en trouvait
  bouleversé et les positions étaient fausses — *Stances et Poèmes*
  semblait ne commencer qu'à quarante-sept pour cent, alors que « Le
  Vase brisé » est à deux. Tri numérique désormais.
- Le fichier du *Lion et la perle* contient, après le texte de
  Soyinka, une seconde pièce sans rapport. La source est bornée à son
  texte authentique — 22 556 mots, `verbatim.BORNES`. Sans cela, le
  parcours paraissait s'arrêter au milieu de la pièce.

### Ce qui reste à arbitrer

Cinq cahiers gardent un saut supérieur au seuil de quarante-cinq pour
cent. Ce n'est pas une faute : six séquences ne peuvent pas couvrir
uniformément un roman de quarante mille mots, et le choix des passages
obéit d'abord à leur richesse. Mais la zone non représentée est
signalée, pour que la décision soit prise et non subie.

| Cahier | Zone sans extrait | Ce qui s'y trouve |
|---|---|---|
| `vieuxnegre` | 0–49 % | La fin de la première partie : l'annonce de la médaille, l'attente du village, les préparatifs |
| `ngum` | 32–85 % | Les actes III et IV : les recours, les appuis cherchés, les instances de l'entourage |
| `capitoline` | 48–94 % | Le conflit des deux familles et la montée vers le dernier repas |
| `tenebres` | 18–68 % | Le chapitre II : la remontée du fleuve, le brouillard, l'attaque |
| `stances` | 30–98 % | La partie « Poèmes » : quinze pièces longues, dont une seule est étudiée |

Le remède est le même dans les cinq cas, et il est éprouvé : déplacer
le support d'un devoir vers la zone vide, et réécrire ses questions
avec lui. Un support changé sans ses questions vaut moins qu'un
support inchangé.

## 11. Organisation et structure

Mesurée par `enrichissement/structure.py`, cinquième contrôle, écrit
pour cet audit. Les quatre autres regardent le contenu ; celui-ci
regarde le **plan**. Un cahier peut être juste partout et illisible
d'un bout à l'autre.

| Cahier | Questions | Doublons | Hiérarchie | Numéros | Étiquettes | Annonces |
|---|---|---|---|---|---|---|
| `vieuxnegre` | 44 | 0 | 0 | 0 | 0 | 0 |
| `lionperle` | 46 | 0 | 0 | 0 | 0 | 0 |
| `ngum` | 60 | 0 | 0 | 0 | 0 | 0 |
| `capitoline` | 35 | 0 | 0 | 0 | 0 | 0 |
| `tenebres` | 43 | 0 | 0 | 0 | 0 | 0 |
| `tartuffe` | 21 | 0 | 0 | 0 | 0 | 0 |
| `sauvages` | 19 | 0 | 0 | 0 | 0 | 0 |
| `stances` | 19 | 0 | 0 | 0 | 0 | 0 |
| `balafon` | 17 | 0 | 0 | 0 | 0 | 0 |

### Le défaut principal : la même question, trois fois

Le cahier interrogeait l'élève dans trois rubriques successives — le
contrôle de lecture, les devoirs progressifs, le QCM final — et les
trois posaient les mêmes questions. Quarante-huit répétitions relevées
sur les neuf cahiers. L'élève répondait trois fois à « Pourquoi Meka
est-il arrêté ? » en croyant avancer.

La correction ne consiste pas à supprimer des questions, mais à donner
à chaque rubrique un métier distinct :

| Rubrique | Quand | Ce qu'elle demande |
|---|---|---|
| Carnet de bord | à la maison, pendant la lecture | les faits : qui, où, quand, comment |
| Contrôle de lecture | en classe, quinze minutes | situer, ordonner, attribuer, citer exactement |
| QCM final | avant l'épreuve, en autonomie | reconnaître un fait capital sur l'œuvre entière |

Vingt-cinq questions ont été réécrites, à la place de leur doublon, sur
un registre différent. Toutes leurs réponses sont établies ailleurs
dans le cahier : aucune ne demande un fait que l'œuvre ou le cahier
n'aurait pas donné. La table est dans `enrichissement/controles.py`, et
le générateur signale toute entrée qui ne trouve plus sa cible.

### Ce que la charpente a corrigé

- **L'ordre du parcours.** Le contrôle de lecture précédait les devoirs
  qui accompagnent la lecture : l'élève retrouvait donc en devoir les
  questions auxquelles il venait de répondre en classe. On lit d'abord
  — le carnet de bord —, on est contrôlé ensuite.
- **Une étiquette, un objet.** « Devoir n° 1 » désignait à la fois le
  premier devoir d'accompagnement et l'épreuve blanche de type BAC.
  Les devoirs d'accompagnement sont devenus des **étapes**, ce qu'ils
  sont.
- **Les six séquences au sommaire.** Elles étaient au niveau 3, sous
  une section unique : un volume de trois cents pages annonçait
  « 4.1 Lectures méthodiques » et rien d'autre. Chaque séquence est
  désormais une section numérotée.
- **Les numéros périmés.** « 1.1 Le titre » se lisait sous « 3.1
  Analyse du paratexte » : la numérotation d'avant le changement de
  plan. Un titre de niveau 3 porte désormais un nom, ou un nom de série
  suivi d'un numéro — jamais un numéro hérité.
- **Les « bis » et les « ter ».** Ils ne subsistaient plus que dans les
  renvois internes — « voir § III.6 bis ». Un renvoi à un numéro se
  périme au premier changement de plan ; il nomme désormais la section.
- **Les séries interrompues.** La carte mentale passait de la
  « Branche 5 » à la « Branche 8 », parce que deux branches étaient
  conditionnelles. Les rubriques sont numérotées à la volée, sur celles
  qui sont réellement rendues, et l'annonce les compte au lieu de les
  réciter — « six exercices » précédait sept exercices.
- **Quarante-cinq tableaux aplatis.** Les cinq cahiers relus
  imprimaient en colonnes de paragraphes des tableaux que la conversion
  n'avait pas su reconnaître — listes de personnages, tableaux d'axes.
  La reconnaissance se fait maintenant ligne à ligne : il en reste dix-
  huit, qui ne sont pas des tableaux mais des suites d'encadrés.
- **Le plan de la collection.** « Capitoline » n'avait pas de section
  de synthèse, si bien que le cahier demandait d'interpréter le roman
  avant de l'avoir lu. Les neuf cahiers suivent aujourd'hui le même
  plan, dans le même ordre.

### L'entrée dans l'œuvre, réécrite pour l'élève

La première page de l'étude s'adressait à l'enseignant : « Séance
d'ouverture (55 minutes) », « Demandez à la classe », « Ramassez les
papiers ». L'élève qui ouvrait son cahier au premier jour y lisait les
consignes d'un autre.

Elle se fait maintenant en trois temps qu'il conduit lui-même :
j'observe le titre — des questions auxquelles personne ne peut encore
répondre faux ; **mon hypothèse de lecture** — un tableau qu'il remplit
et ne relira qu'à la dernière séance ; **mon contrat de lecture** — ce
qu'il s'engage à repérer, en cases à cocher, et un journal assez simple
pour être tenu. Ce qui revient au professeur — durées, calendrier de la
classe, dates des contrôles — est conservé dans un encadré « Côté
enseignant », à la fin de la section.

### Le contrôle a été éprouvé par mutation

Un contrôle qui n'a jamais rougi ne prouve rien. `structure_banc.py`
abîme une copie du cahier, défaut par défaut, et vérifie que chacun
remonte : la question recopiée, les séquences laissées au niveau 3, le
numéro périmé, la branche sautée, l'étiquette réemployée, l'annonce
fausse, la partie à section unique. Les sept mutations sont détectées.

Trois défauts de MESURE ont d'ailleurs été trouvés avant les défauts de
contenu, et corrigés dans l'outillage : `audit.py` et `pedagogie.py` ne
reconnaissaient plus les séquences une fois celles-ci renumérotées, et
la liste des verbes de consigne ignorait « distinguez », « reconstituez »
et « discutez » — la cinquième séquence de « Capitoline » passait pour
pauvre alors qu'elle demandait ces trois gestes. On rouvre le cahier
avant de l'accuser.

## 12. Garde-fous, et comment les relancer

```bash
python enrichissement/build_all.py      # reconstruit les neuf cahiers
python enrichissement/audit.py          # conformité de forme et MINESEC
python enrichissement/verbatim.py       # verbatim contre les sources
python enrichissement/impression.py     # typographie, prêt à imprimer
python enrichissement/pedagogie.py      # couverture, progression, activité
python enrichissement/structure.py      # plan, numérotation, redondance
python enrichissement/structure_banc.py # éprouve le contrôle par mutation
python enrichissement/rapport.py        # régénère ce rapport
```

`verbatim.py` a été écrit pour cet audit : il manquait à la chaîne, qui
ne mesurait jusque-là que la forme. Il a été éprouvé par mutation — on a
changé un mot dans un cahier construit et vérifié qu'il le voyait —, et
il attrape le remplacement d'un mot, la suppression d'une négation,
l'ajout d'un mot et la coupe d'un groupe.

Deux seuils dépendent du genre, et c'est voulu : un extrait de prose
doit faire trois cents mots, un poème n'a pas de longueur minimale — son
unité est sémantique. En contrepartie, chaque référence d'un cahier de
vers doit nommer ce qu'elle reproduit (« poème entier », « parties I et
II »), et l'audit le vérifie.
