# Ce que VÉRITAS peut apprendre de SchoolMouv

Relevé du 06/11/2026, fait sur les pages publiques de schoolmouv.fr : accueil, page matière Français 1re, fiche de cours « Le théâtre », fiche de révision et exercices de *Pot-Bouille*.

**Règle :** on reprend des **principes**, jamais leurs fichiers. Leurs icônes, illustrations et textes de leçons sont protégés. VÉRITAS dessine ses propres icônes et écrit ses propres leçons.

---

## 1. Les icônes de matières (ce que Jacques aime)

Mesures faites sur leurs fichiers `/subjects/*.svg` :

| Trait | Leur choix | Ce qu'on en tire |
|---|---|---|
| Grille | 24 × 24, toutes identiques | Même grille pour toutes les matières |
| Couleur | **Une seule teinte par matière**, en 2 à 4 nuances (ex. Français : 4 violets ; SVT : 3 turquoises) | Une teinte par matière, avec une face claire, une face foncée et un contour sombre |
| Relief | Aplats juxtaposés, **aucun dégradé** | Le volume vient des aplats ; c'est léger (4 à 12 Ko) et net à 16 px |
| Contour | Trait foncé de la même teinte | Lisible sur fond crème comme sur fond blanc |
| Usage | Rail vertical à gauche, liste du menu, bandeau défilant de l'accueil | Rail des matières dans les cours, cartes matières sur la vitrine |

La sprite actuelle de VÉRITAS (`assets/veritas-icons.svg`) est en **trait monochrome** (style Lucide). Elle reste pour l'interface. Les **matières** reçoivent une famille à part, en couleur : `assets/veritas-matieres.svg`, livrée avec le gabarit.

## 2. La leçon : un gabarit unique

C'est leur vraie force : **toutes les leçons ont la même forme**. Chez VÉRITAS, chaque cours de `cours/` porte ses propres polices et son propre dégradé (`registres_de_langue_5e.html` : Baloo + Nunito, en-tête vert-rouge).

Anatomie d'une fiche de cours SchoolMouv :

1. **Fil d'Ariane** : Accueil › Programme 1re › Français › la leçon.
2. **Surtitre de type** (« Cours », « Exercices », « Fiche de révision ») au-dessus d'un **H1** centré.
3. **Onglets de format** pour une même notion : *Cours · Révision · Quiz* (et *Vidéo* quand elle existe). L'élève change de format sans quitter la leçon.
4. **Sommaire collant à gauche** ; la partie lue est surlignée pendant le défilement.
5. **Parties numérotées** : pastille ronde cerclée (1, 2, 3…) + titre H2, soulignement court en couleur. Sous-parties H3 précédées d'une puce ronde pleine.
6. **Listes à deux niveaux**, notion clé en gras, puis sa définition après les deux-points.
7. **« → À retenir »** en couleur à la fin de chaque partie : une phrase, pas un paragraphe.
8. **Un seul encadré d'information** teinté en tête (rappel d'examen).
9. **Télécharger en PDF** (bouton discret, en haut à droite de la carte).
10. **« Contenus complémentaires »** en pied de page : cartes vers les autres formats de la même notion.
11. **Bulle « Tchat avec un prof »** : chez VÉRITAS, c'est Prof. Ambassa (déjà en place).

Volumes : une fiche de révision fait environ **470 mots en 3 parties**. Leur page « exercices » n'est qu'un renvoi vers un PDF.

## 3. La page matière

- Pastille du niveau (« 1re ») en haut du rail des matières.
- Menu latéral court : *Programme · Fiches de lecture · Grammaire · Encyclopédie · Kit Bac*.
- Une présentation de 3 lignes, puis **chapitres** (« Chapitre 1 ») et **leçons en lignes cliquables** terminées par un chevron. Pas de cartes, pas d'images.

## 4. La sobriété, en chiffres

- Fond crème `#F7F1ED`, carte de contenu blanche, **titres gris `#505050`** (pas noirs).
- Deux polices seulement : une pour les titres, une pour le texte (police système).
- **Une couleur d'accent par matière**, qui teinte les onglets, les pastilles et les « À retenir » (Français = violet-prune).
- Colonne de lecture d'environ **630 px**.
- Aucune image dans la leçon elle-même.

## 5. Leurs défauts, à ne pas reproduire

- **Balises qui fuient à l'écran** : `__Pot-Bouille__` (Markdown non converti) dans le titre et les cartes ; `$\rightarrow$` (LaTeX non rendu) en pleine fiche de révision. → Un contrôle de rendu dans les bancs VÉRITAS (aucun `__`, `$\`, `**` visible).
- **Interligne serré** : 16 px sur 18,4 px (1,15). → VÉRITAS garde 1,65 et la prose justifiée avec césure au téléphone.
- **Bannière de cookies** qui ne se ferme pas au premier clic.
- Marketing très chargé sur l'accueil (violet saturé, bandeaux promo superposés, 4 chiffres en cartes). → On ne reprend que la sobriété des **pages de cours**.

## 5 bis. Les quatre éléments signalés par Jacques (captures du 06/11)

1. **« Faisons connaissance »** : trois cartes blanches *Je suis un · Élève / Parent / Enseignant*, chacune avec une petite illustration en couleur et des étincelles. La carte a un bord inférieur épais couleur sable, qui fait une « marche ». Au-dessous, une ligne discrète : *Déjà un compte ? Je me connecte !* → C'est l'aiguillage par profil que VÉRITAS fait déjà dans son menu « Plus », mais rendu en 3 gestes.
2. **Bandeau d'appel « annales corrigées »** : fond lilas très pâle, angle arrondi, icône à gauche, titre en gras sur deux lignes, une phrase grise, chevron coloré à droite. Toute la carte est cliquable. → Il se place en fin de leçon pour pousser vers les épreuves corrigées VÉRITAS (BEPC, Probatoire, BAC).
3. **Manuel numérique, vue enseignant** (`manuels.schoolmouv.fr`) :
   - interrupteur **Vue enseignant / Vue élève** en haut au centre ;
   - colonne de gauche aux couleurs de la matière, avec l'icône de matière dans un médaillon rond et les **formats empilés** : *Vidéo · Cours · Synthèse · Quiz · S'entraîner* (le format ouvert devient une carte blanche) ;
   - **barre d'outils flottante** sur chaque bloc : *Modifier · Dupliquer · Supprimer · Lien · Télécharger · interrupteur « Publier à mes élèves »*.
   → C'est le modèle à suivre pour les **cahiers en ligne** (`livrets/`) et l'**espace enseignant** : l'enseignant choisit ce que ses élèves voient.
4. **Accueil en étapes** (fenêtre « Bienvenue ! ») : à gauche, 4 étapes numérotées reliées par un pointillé vertical (l'étape courante est surlignée) ; à droite, une capture, un titre, 3 puces et un seul bouton **Suivant**. → Pour la première visite de l'Atelier et de l'espace enseignant.

## 6. Ce qui est prêt et ce qui reste à faire

| Élément | État |
|---|---|
| 13 icônes de matières originales (`assets/veritas-matieres.svg`) | **Livré**, prototype |
| Gabarit de fiche de cours (`cours/_gabarit_fiche.html`), avec la leçon VÉRITAS « Registres de langue, 5e » remise en forme | **Livré**, prototype non déployé |
| Dans le même gabarit : cartes de profil, bandeau annales, vue enseignant / élève avec barre d'outils, accueil en 4 étapes | **Livré**, prototype |
| Basculer les cours existants de `cours/` sur le gabarit | À faire |
| Page matière (chapitres → leçons) par niveau | À faire |
| Rail des matières dans l'espace élève / e-learning d'`app.js` | À faire |
| Contrôle « aucune balise visible » dans les bancs | À faire |
