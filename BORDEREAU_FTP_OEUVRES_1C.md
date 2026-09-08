# Bordereau FTP — les quatre cahiers d'œuvres du collège

**État au 08/09/2026.** Les cahiers d'étude des œuvres intégrales de **6ᵉ, 5ᵉ,
4ᵉ et 3ᵉ** sont **en vente à 1 000 FCFA le niveau** : catalogue, pages de
vente, cartes de boutique et plan du site sont écrits et partent au prochain
déploiement.

Il reste **deux gestes**, tous deux en FTP, et sans eux le serveur ne peut
rien livrer — la boutique n'affichera donc pas encore les cartes
(`vrt_livret_etat()` ne publie que ce qui est déposé).

---

## Fait — les quatre couvertures

Vous les avez fournies le 08/09. Elles sont retouchées, mises au gabarit du
site (1 200 × 1 600) et déposées dans `uploads/oeuvres/` : la CI les emporte,
vous n'avez rien à téléverser.

**Deux fautes y étaient peintes**, et elles ne se corrigeaient pas dans un
fichier de texte :

- **« Lect·ures méthodiques »** — un caractère parasite entre le « t » et le
  « u », sur les **quatre** couvertures. Il a été retiré en supprimant sa
  colonne de pixels et en recollant la suite : la police, la graisse et le
  crénage restent ceux de l'original. Réécrire le mot avec une police
  approchante se serait vu davantage que la faute.
- **« 3é »** au lieu de **« 3ᵉ »** sur la pastille de la 3ᵉ — les trois autres
  portaient bien « 6ᵉ », « 5ᵉ », « 4ᵉ ». L'accent aigu a été effacé et sa
  place repeinte du rouge relevé autour, le coup de pinceau étant texturé.

Sur une couverture de cahier de **français**, ces deux-là se remarquaient.

Pour les régénérer après une nouvelle version des sources :

```bash
python tools/couvertures_oeuvres_1c.py
```

---

## Geste 1 — les huit fichiers de charge

Ce sont les cahiers eux-mêmes. Ils ne sont dans aucun dépôt : **le dépôt GitHub
est public**, et c'est le produit vendu.

Déposez le contenu de `~/veritas-ftp/uploads/protected/livrets/` dans, sur le
serveur :

```
uploads/protected/livrets/
```

| Fichier | Poids | Pour qui |
|---|---|---|
| `booklet-oeuvres-6e.js` | 281 Ko | l'élève |
| `booklet-oeuvres-5e.js` | 292 Ko | l'élève |
| `booklet-oeuvres-4e.js` | 279 Ko | l'élève |
| `booklet-oeuvres-3e.js` | 303 Ko | l'élève |
| `guide-oeuvres-6e.js` | 310 Ko | l'enseignant |
| `guide-oeuvres-5e.js` | 352 Ko | l'enseignant |
| `guide-oeuvres-4e.js` | 337 Ko | l'enseignant |
| `guide-oeuvres-3e.js` | 362 Ko | l'enseignant |

**2,5 Mo en tout.** C'est le **même dossier** que vos vingt-quatre cahiers
actuels — celui qui contient déjà `booklet-6e.js`, `guide-bord-3e.js`, etc.

> **Ce qui distingue les deux fichiers d'un même niveau.** Le fichier de
> l'élève ne porte NI les corrigés rédigés, NI la note aux enseignants, NI les
> huit encadrés « Côté enseignant » qui étaient posés au milieu des chapitres
> — l'un d'eux, en 5ᵉ, disait sur quel chapitre porterait l'épreuve d'étude de
> texte. Le fichier de l'enseignant, lui, porte tout.
>
> Dans la version d'origine, tout cela voyageait avec le cahier de l'élève :
> le sommaire affichait un cadenas sur les corrigés, et c'était la seule
> protection. Un élève de sixième n'a pas besoin des outils de développement
> pour ouvrir un fichier que son navigateur vient de télécharger.

---

## Geste 2 — les soixante-sept illustrations

Déposez le contenu de `~/veritas-ftp/uploads/oeuvres/1c/` dans, sur le serveur :

```
uploads/oeuvres/1c/
```

**6,8 Mo.** Elles sont publiques (ce sont des illustrations, pas le cahier) et
servies avec un cache long.

Ce qui a changé par rapport au lot d'origine :

| | Avant | Maintenant |
|---|---|---|
| Fichiers | 72 | **67** |
| Poids | 9,9 Mo | **6,8 Mo** (−32 %) |
| Cadrage | 13 images hors du cadre 3:2 | **toutes au cadre**, par marge ajoutée — rien n'est rogné |
| Format | 5 JPEG jusqu'à 678 Ko | **tout en WebP**, 1 200 px au plus |
| Inutilisées | 4 fichiers `_v*.jpg`, 2,5 Mo, cités nulle part | **écartés** |

Trois illustrations sont **nouvelles**, tirées de
`Downloads/Oeuvres de la 6e en 4e/`, et chacune remplace une répétition du
cahier de 6ᵉ :

- `w1-qui-est-qui.webp` — les personnages nommés, en tête de « Qui est qui dans
  la forêt ». Ce chapitre s'ouvrait sur la carte mentale des dix-huit contes,
  qui ne montre justement pas qui est qui ;
- `w1-mindmap-foret.webp` — en tête des corrigés, à la place de cette même
  carte mentale, servie une seconde fois cent pages plus loin ;
- `w2-themes-bimanes.webp` — en tête de la note aux enseignants, à la place de
  la photo de classe déjà vue au chapitre 3.

---

## Ce que vous n'avez pas à faire

Rien du côté paiement, code, envoi ou protection. Ces cahiers entrent dans le
circuit qui vend déjà vos vingt-quatre autres ouvrages :

- **paiement CamerPay**, 1 000 XAF, même caisse, même journal ;
- **code émis à la confirmation**, même registre, même format
  `VRT-OEUVRES-6E-XXXX-XXXX`, même révocation, même libération d'appareil ;
- **envoi par SMS, WhatsApp et courriel**, avec le lien qui mène à la porte du
  cahier — pas à sa page de vente, où l'on redemanderait 1 000 F ;
- **3 appareils** par code élève, 2 par code enseignant ;
- **filigrane nominatif** sur chaque écran, et le contenu ne sort de
  `api/livret.php` qu'après vérification du code.

Le brief demandait de reprendre côté serveur l'algorithme de codes des cahiers.
Ce n'est pas ce qui a été fait, et il faut le dire franchement : **ce verrou-là
n'en était pas un.** La fabrique de codes était dans la page, et deux boutons
— « Code élève démo » et « Code enseignant » — en produisaient un valide en un
clic. Personne n'avait à payer. Comme aucun code de ce format n'a jamais été
vendu, rien ne se casse à l'abandonner ; et un second format aurait voulu dire
un second registre, une seconde révocation, un second espace d'administration.

---

## Ce qui reste ouvert, et que je ne peux pas trancher seul

**1. Les images manquent aux trois cahiers du haut du collège.**
La 6ᵉ a 20 illustrations distinctes pour 22 emplacements. Les autres non :

| Cahier | Emplacements | Images distinctes | La plus répétée |
|---|---|---|---|
| 6ᵉ | 22 | **20** | 2 fois (corrigé ici) |
| 5ᵉ | 25 | 13 | 3 fois |
| 3ᵉ | 25 | 10 | 5 fois |
| **4ᵉ** | 25 | **7** | **6 fois** — `a4-w1-cour` |

Dans le cahier de 4ᵉ, la même cour de village ouvre six chapitres sur
vingt-cinq. Le dossier `Oeuvres de la 6e en 4e/` ne contient **aucune** image
neuve pour ces trois niveaux : les dix-sept qu'il a en plus concernent toutes
la 6ᵉ, ou sont hors sujet — la frise « Father Kwame Mensah » est en anglais et
raconte la vie d'un auteur ghanéen qui ne figure dans aucun des quatre cahiers.

Il faut donc **produire des illustrations pour la 4ᵉ, la 3ᵉ et la 5ᵉ**, ou
accepter la répétition. Dites-moi laquelle des deux.

**2. Le salon de classe n'est pas branché.**
La maquette en a l'interface entière : bouton « Envoyer au salon de classe »,
code de classe, panneau enseignant annonçant que les copies « remontent ici ».
Rien n'était relié — le bouton affichait un message et c'est tout. L'élève
croyait avoir rendu son travail.

Le bouton a été retiré et les textes rendus exacts : reste « Récupérer mes
réponses », qui produit vraiment un fichier, à envoyer par WhatsApp.

Le brancher pour de bon est un chantier à part. `api/cahier.php` sait déjà
recevoir et rendre des copies, mais il range chaque réponse sous une clé
dérivée de l'ÉNONCÉ, pour qu'un cahier corrigé entre deux rentrées ne décale
pas les copies déjà rendues. Ces cahiers-ci numérotent leurs champs dans
l'ordre où ils les dessinent (`n0`, `n1`, `n2`…) : les brancher tels quels
importerait ce défaut dans la base, et un exercice ajouté au milieu d'une
séquence déplacerait toutes les réponses qui suivent.

**3. Deux titres d'images portent des fautes.**
Le texte est incrusté dans les illustrations, je ne peux pas le corriger :
« Les Chants de la Foret – 18 contes Beti » (deux accents manquants) sur
`w1-carte-mentale`, et « INEGALITES », « DIGNITE » sur `w2-themes-bimanes`.
Sur un cahier de français, cela se remarque.

---

## Pour vérifier après le dépôt

```bash
gh workflow run deploy.yml
```

Puis, une fois le job « Déployer via FTP » terminé — **et pas avant**, sinon
une 404 se met en cache sous l'URL demandée :

```bash
curl -sI "https://veritas-school.com/livrets/cahier-oeuvres-6e.html?x=1" | head -1
```

Et l'aperçu gratuit, qui ne demande aucun code :

```
https://veritas-school.com/livrets/cahier-oeuvres-6e.html?extrait=1
```

Deux chapitres, pris aux deux bouts du cahier, sans un seul corrigé — 9 à
11 Ko contre 280 à 300 Ko pour le cahier entier.
