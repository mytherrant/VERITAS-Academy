# Enrichissement des cahiers d'œuvre intégrale

Chaîne de production des huit cahiers VÉRITAS d'étude d'œuvre intégrale.
Le contenu est **écrit dans des modules Python**, jamais directement dans les
`.docx` : le document est reconstruit entièrement à chaque exécution.

```bash
python enrichissement/build_all.py              # les huit cahiers
python enrichissement/build_all.py vieuxnegre   # un seul
```

## Les huit cahiers

| Clé | Œuvre | Auteur |
|---|---|---|
| `vieuxnegre` | Le vieux nègre et la médaille | Ferdinand Oyono |
| `lionperle` | Le lion et la perle | Wole Soyinka |
| `ngum` | Ngum a Jemea | David Mbanga Eyombwan |
| `capitoline` | Les tribus de Capitoline | P.-C. Ombété-Bella |
| `tenebres` | Au cœur des ténèbres | Joseph Conrad |
| `tartuffe` | Tartuffe ou l'Imposteur | Molière |
| `sauvages` | Poèmes sauvages éclairés au feu de brousse | Henri N'koumo |
| `stances` | Stances et Poèmes | Sully Prudhomme |

Les trois derniers n'ont pas de version antérieure à relire : leur paratexte
est écrit dans `<cahier>_front.py` et l'assemblage passe par
`builder.build_neuf`. Les cinq premiers relisent leur paratexte dans la
conversion markdown de leur `.docx` d'origine.

## Structure produite

Chaque cahier conserve son paratexte d'origine (notions, biographie, contrôles
de lecture, personnages, thèmes, bibliographie) et voit **quatre sections**
réécrites :

- **6 bis** — six lectures méthodiques : extrait verbatim ≥ 300 mots, situation,
  mouvements, axes fond/forme, plan de commentaire, exercices différenciés.
- **8** — deux commentaires composés et deux dissertations **entièrement
  rédigés** (1 000 à 1 400 mots pièce), non des plans.
- **9** — deux devoirs au format MINESEC, corrigés et grilles OBC
  (4 critères / 20 points).
- **10** — « Vers le Probatoire — Vers le BAC » : par niveau, un commentaire
  composé avec son texte et une dissertation, plus les pistes d'exploitation.

## Les modules

```
docxkit.py               primitives de rendu DOCX (blocs, encadrés, grilles)
mdsource.py              lecture des sections conservées
front.py                 paratexte des cahiers écrits de zéro
builder.py               assemblage : markdown d'origine + sections neuves
build_all.py             pilote
augurales.py             l'entrée dans l'œuvre, écrite pour l'élève
controles.py             table de réécriture des questions redondantes
audit.py                 conformité de forme et format MINESEC
verbatim.py              contrôle des extraits contre les fichiers sources
impression.py            typographie et structure : prêt à imprimer
pedagogie.py             couverture de l'œuvre, progression, activité
structure.py             plan, hiérarchie, numérotation, redondance
structure_banc.py        éprouve structure.py par mutation
rapport.py               régénère AUDIT_CAHIERS_OEUVRE_INTEGRALE.md
complements.py           chronologie et postérité, par cahier (section 2 bis)
oeuvres.py               structure, personnages, lieux, QCM — relevés dans
                         les œuvres elles-mêmes
apparat.py               boîte à outils, carte mentale, fiche de lecture,
                         exercices bilan (sections 10 bis à 10 quinquies)

<cahier>_fiches.py       fiches 1-3
<cahier>_fiches2.py      fiches 4-6   (tenebres : réparti sur 3 fichiers)
<cahier>_modeles.py      COMMENTAIRES, DISSERTATIONS
<cahier>_devoirs.py      DEVOIR1, DEVOIR1_CORRIGE, DEVOIR2, DEVOIR2_CORRIGE,
                         ENCADRES_DEVOIRS

contractions.py          supports de contraction VERBATIM + question de discussion
contractions_corriges.py corrigés correspondants (thème, thèse, structure, grille)
vers_examen.py           rubrique 10, par cahier et par niveau
```

`contractions.py` et `vers_examen.py` **surchargent** ce que contiennent les
modules `<cahier>_devoirs.py` : le sujet I d'origine y est remplacé au moment
de la construction. Ne pas modifier le sujet I dans `<cahier>_devoirs.py`, il
est ignoré.

## Règles de contenu

**Les extraits d'œuvre sont verbatim.** Les fautes d'océrisation des fichiers
sources sont corrigées ; les coupes sont signalées par `[…]` ; aucune phrase
n'est reformulée. Un passage trop dégradé pour être restitué avec certitude est
écarté, jamais deviné.

**Les supports de contraction sont verbatim eux aussi**, et liés à une
problématique de l'œuvre. Aucun n'est un texte inventé attribué à personne :

| Cahier | Source du support |
|---|---|
| `vieuxnegre` | Lydie Moudileno, *Parades postcoloniales*, chap. « Parade, identité, authenticité » |
| `lionperle` | Préface critique de l'édition CLÉ / NENA, « Un festin de négritude » |
| `ngum` | Postface du prince René Douala Manga Bell + notice de l'édition |
| `capitoline` | Paul-Alain Abena Bella, dossier pédagogique publié avec le roman |
| `tenebres` | Joseph Conrad, *Au cœur des ténèbres*, chap. I (méditation de Marlow) |

**Seuil vérifié à chaque build.** `builder.controle_extraits()` refuse tout
extrait d'œuvre sous 300 mots et l'affiche. Un build sain annonce
`11 extraits ; 0 sous 300 mots`.

## Contrôles, et dans quel ordre les lancer

```bash
python enrichissement/build_all.py      # reconstruit les neuf cahiers
python enrichissement/audit.py          # forme, densité, format MINESEC
python enrichissement/verbatim.py       # verbatim contre les fichiers sources
python enrichissement/impression.py     # prêt à imprimer (typo, structure)
python enrichissement/pedagogie.py      # couverture, progression, activité
python enrichissement/structure.py      # plan, numérotation, redondance
python enrichissement/structure_banc.py # éprouve le contrôle par mutation
python enrichissement/rapport.py        # régénère le rapport d'audit
```

**Une rubrique, un métier.** Le cahier interrogeait l'élève dans trois
rubriques successives — carnet de bord, contrôle de lecture, QCM — et les
trois posaient les mêmes questions. `structure.py` mesure ces répétitions,
et `controles.py` porte la table de réécriture. Le carnet garde les
questions de fait ; le contrôle demande de situer, ordonner, attribuer,
citer exactement ; le QCM reconnaît un fait capital sur l'œuvre entière —
il peut y revenir, il ne peut pas recopier une question.

**Deux règles de plan**, tenues par `builder.architecture` : tout titre de
niveau 2 porte un numéro « N.M » et tout titre de niveau 3 porte un nom, ou
un nom de série suivi d'un numéro (« Séquence 3 », « Exercice 5 »). Aucun
numéro n'est écrit en dur dans un titre conditionnel : les branches de la
carte mentale et les exercices bilan sont numérotés à la volée, sur ceux
qui sont réellement rendus.

`audit.py` mesure la forme. Il ne dit rien de ce que valent les textes :
c'est le rôle de `verbatim.py`, qui rouvre l'œuvre et compare chaque phrase.
Il classe les écarts en trois catégories — coquille de scan restituée, accent
rétabli, écart signalé — et seule la troisième compte. Il a été éprouvé par
mutation : on change un mot dans un cahier construit et l'on vérifie qu'il le
voit.

**Deux seuils dépendent du genre.** Un extrait de prose doit faire trois
cents mots ; un poème n'a pas de longueur minimale, son unité est sémantique
— « Le Vase brisé » fait cent vingt-deux mots et se commente entier. En
contrepartie, chaque référence d'un cahier de vers doit nommer ce qu'elle
reproduit, et l'audit le vérifie. Les cahiers concernés sont déclarés dans
`build_all.POESIE` et `verbatim.POESIE`.

## Sources des textes

Les œuvres intégrales et leurs conversions de travail :

```
D:\Bibliothèque\Bords\Définitif\Le bord\dossier sans titre\   (4 œuvres)
D:\Bibliothèque\Littérature\Classiques\Africains\             (Ngum, Capitoline)
```

Les sections conservées de chaque cahier sont relues dans
`graphify-out/converted/Manuel_*_Etude_Integrale_*.md`.

> ⚠️ **Ces conversions markdown sont la seule copie des cahiers d'origine.**
> Les `.docx` initiaux ont été perdus en cours de travail ; c'est à partir de
> ces `.md` que les cahiers ont pu être reconstruits. Ne pas les supprimer.

## En cas de perte des sources

Le contenu rédigé survit dans `__pycache__/*.pyc` tant que les modules ont été
importés au moins une fois. `_recover.py` recharge chaque `.pyc` par un
`SourcelessFileLoader` et régénère le `.py` correspondant :

```bash
python enrichissement/_recover.py
```

Seul le code exécutable (`docxkit`, `builder`) doit alors être réécrit à la
main ; tout le contenu — extraits, analyses, devoirs — est récupéré intact.
