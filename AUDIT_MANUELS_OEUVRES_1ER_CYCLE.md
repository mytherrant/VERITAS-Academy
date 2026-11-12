# Audit du cycle — les quatre manuels d'étude d'œuvres intégrales

> Rapport produit par `python premier_cycle/rapport1c.py`. Tous les
> nombres sont relus dans les volumes construits au moment de
> l'écriture ; aucun n'est saisi à la main.

## 1. Périmètre

| Classe | Les trois œuvres | Genres |
|---|---|---|
| **Sixième** | *Les Chants de la Forêt* · *Les Bimanes* · *Les Contes de Korotoumou* | contes et chantefables · sept nouvelles · quatorze contes |
| **Cinquième** | *L'Arbre fétiche* · *N'koum-wam, le huitième notable* · *Père inconnu* | quatre nouvelles · comédie en cinq actes · récit |
| **Quatrième** | *Trois prétendants… un mari* · *Cœur du Sahel* · *L'attachement au sol natal* | comédie en cinq actes · roman · vingt-six poèmes |
| **Troisième** | *Ville cruelle* · *La marmite de Koka-Mbala* · *Petites gouttes de chant pour créer l'Homme* | roman · drame en deux actes · vingt-deux poèmes |

## 2. Conformité de forme

Mesurée sur les blocs eux-mêmes : volume, lectures suivies, ateliers
d'écriture, jeux corrigés, épreuves au format MINESEC.

| Volume | Mots | dont corrigés | Lectures suivies | Ateliers | Jeux | Cartes | Épreuves | Encadrés | Tableaux |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `6e` | 42025 | 3331 | 18 | 6 | 20 | 3 | 9 | 144 | 74 |
| `5e` | 43389 | 3837 | 18 | 7 | 21 | 3 | 9 | 140 | 78 |
| `4e` | 41147 | 3718 | 18 | 6 | 20 | 3 | 9 | 139 | 74 |
| `3e` | 43203 | 4154 | 18 | 6 | 21 | 3 | 9 | 142 | 76 |

## 3. Longueur des lectures suivies

La prose doit dépasser **cinq cents mots** ; la poésie en est
dispensée — un poème se commente entier — mais sa référence doit
**nommer l'unité reproduite**, et le contrôle le vérifie.

| Volume | Prose : le plus court | Poésie | Supports composés |
|---|---|---|---:|
| `6e` | 514 mots (sur 18) | aucune | 9 |
| `5e` | 592 mots (sur 18) | aucune | 10 |
| `4e` | 571 mots (sur 12) | 6 poèmes entiers | 9 |
| `3e` | 604 mots (sur 12) | 6 poèmes entiers | 9 |

## 4. Les huit contrôles

`python premier_cycle/audit1c.py`

| Volume | Extraits contrôlés | Manquements |
|---|---:|---|
| `6e` | 38 | **aucun** |
| `5e` | 37 | **aucun** |
| `4e` | 36 | **aucun** |
| `3e` | 36 | **aucun** |

**0 manquement(s) sur 4 volumes.**

Grilles de jeu dont un mot n'a pas pu être placé : **0**. Une seule
suffirait à imprimer, dans un cahier d'élève, une note technique
(« mots écartés faute de place ») qui n'a rien à y faire.

## 5. Ce que les contrôles ne peuvent pas voir

`audit1c.py` compare les extraits au fichier de l'œuvre, et
`source.extrait()` les **découpe** au lieu de les laisser retaper :
le verbatim est donc mécaniquement vrai, non promis. La réparation
des numérisations, elle, **ne peut qu'insérer une espace** — elle le
vérifie en comparant les deux textes privés de tout blanc. Ce qui
demanderait de toucher une lettre reste donc dans le texte :

- **villecruelle** — un tiret parasite au milieu d'une phrase (« sur-la chaussée poussiéreuse »)
- **villecruelle** — un tiret parasite dans « examinait la-qualité » (« la-qualité »)
- **villecruelle** — un « 1 » à la place du point d'exclamation (« Que diable 1 »)
- **korotoumou** — une espace tombée au milieu de « c'est-à-dire » (« c'est- à-dire »)
- **arbre** — un « 1 » à la place du point d'exclamation (« Au voleur 1 »)
- **gouttes** — « calculé » là où le livre imprime vraisemblablement « capturé » (« ayant été calculé dans une case »)
- **gouttes** — une ligne étrangère à l'auteur, au milieu du poème XII (« Something went wrong »)

Le remède n'est pas dans la chaîne : c'est **une meilleure
numérisation de l'œuvre**, ou la coupe marquée `[…]` là où le
passage peut s'en passer.

## 6. Éprouver l'audit lui-même

`python premier_cycle/audit_banc.py 6e 5e 4e 3e` pose **8 avaries**
en mémoire, une à la fois — un mot changé dans une lecture suivie, un
extrait ramené à soixante mots, une référence de poème qui ne dit plus
« poème entier », deux mots soudés par le scan, un barème qui ne fait
plus vingt points, une quinzième faute disparue, une faute annoncée
absente du texte, le corrigé d'un jeu supprimé — et exige que l'audit
les signale **avec la bonne étiquette**. Un contrôle qui n'a jamais
rougi ne prouve rien.
