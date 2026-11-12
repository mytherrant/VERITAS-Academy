# Plan d'indexation — vos cinq priorités

**État au 08/09/2026.** Propriété validée dans Search Console. Ce document
donne, pour chacune de vos priorités, les adresses à faire indexer et dans
quel ordre.

> **Comment faire :** Search Console → *Inspection d'URL* → collez l'adresse →
> **« Demander une indexation »**. Google limite à une dizaine par jour, d'où
> le découpage en trois jours ci-dessous. Le sitemap s'occupe du reste tout
> seul, plus lentement.

---

## Jour 1 — ce qui rapporte tout de suite (10 adresses)

### ① L'Atelier de français
```
https://veritas-school.com/plateforme/
```

### ② La vente des cahiers et livrets
```
https://veritas-school.com/livrets/
https://veritas-school.com/livrets/6e.html
https://veritas-school.com/livrets/3e.html
https://veritas-school.com/livrets/tle.html
```
> La boutique d'abord : c'est elle qui porte les 24 ouvrages et vers laquelle
> tout le reste pointe.

### ③ Les œuvres au programme
```
https://veritas-school.com/oeuvres/
https://veritas-school.com/livrets/oeuvre-tartuffe.html
https://veritas-school.com/livrets/oeuvre-balafon.html
```

### ④ Le suivi des apprenants
```
https://veritas-school.com/decouvrir/repetitions-domicile-douala.html
https://veritas-school.com/decouvrir/soutien-scolaire-douala.html
```
> La première est neuve (08/09) : centre, domicile et classe virtuelle avec
> vos tarifs réels. C'est celle qui répond à « répétiteur à domicile Douala ».

---

## Jour 2 — les pages qui captent les recherches d'élèves (10 adresses)

```
https://veritas-school.com/corriges/
https://veritas-school.com/oeuvres/2nde-tartuffe.html
https://veritas-school.com/oeuvres/1ere-balafon.html
https://veritas-school.com/oeuvres/tle-vieux-negro.html
https://veritas-school.com/niveaux/
https://veritas-school.com/niveaux/francais-3eme.html
https://veritas-school.com/niveaux/francais-terminale.html
https://veritas-school.com/ressources/
https://veritas-school.com/ressources/bepc-francais.html
https://veritas-school.com/ressources/bac-francais.html
```
> Les fiches d'œuvre mènent désormais au cahier correspondant : chaque visite
> sur « Tartuffe résumé » peut devenir une vente.

---

## Jour 3 — le reste du dispositif (9 adresses)

```
https://veritas-school.com/decouvrir/
https://veritas-school.com/decouvrir/cours-en-ligne-cameroun.html
https://veritas-school.com/decouvrir/annales-epreuves-corrigees.html
https://veritas-school.com/manuels.html
https://veritas-school.com/outils/
https://veritas-school.com/outils/calcul-moyenne.html
https://veritas-school.com/parcours/
https://veritas-school.com/eleve/
https://veritas-school.com/enseignant/
```

---

## Un manque que je n'ai pas comblé seul : l'orientation

Votre cinquième priorité — **orientation, conseils, motivation** — n'a pas de
page publique. Elle vit dans l'application (« Choisir sa série », « Matières et
coefficients »), donc derrière une connexion : Google ne peut ni la lire ni la
proposer.

`/parcours/` en approche une partie (comment se calcule une moyenne), mais ce
n'est pas la même question qu'un parent se pose en fin de 3ᵉ.

Je n'ai pas écrit cette page parce qu'elle demande des choix qui sont les
vôtres, et qu'inventer un contenu d'orientation serait pire que ne rien
publier. Il me faudrait de vous :

- **quelles séries vous conseillez réellement** et sur quels critères
  (A, C, D, TI… — ce que vous dites en entretien) ;
- **si vous proposez un entretien d'orientation**, et à quel tarif ;
- **ce que vous constatez** : les erreurs d'aiguillage les plus fréquentes que
  vous rattrapez chaque année.

Avec cela j'écris `decouvrir/orientation-apres-la-3eme-cameroun.html` sur le
même modèle que la page « répétitions » — c'est-à-dire uniquement avec ce que
vous constatez, jamais avec des généralités.

---

## Ce qui est déjà en place, et qu'il ne faut pas refaire

| | |
|---|---|
| Sitemaps | 10 fichiers, **220 URL**, tous déclarés dans `robots.txt` |
| Titres | tous sous 60 signes — 31 pages corrigées le 08/09 |
| Descriptions | toutes sous 155 signes |
| Données structurées | `Product` (prix XAF) sur les cahiers ; `Book` sur les œuvres ; `EducationalOrganization` avec vos trois offres sur la page « répétitions » |
| Maillage | les 21 fiches d'œuvre mènent au cahier ; les 6 pages `decouvrir/` se pointent entre elles |
| Recherche interne | 432 entrées, à jour |

---

## Le calendrier réaliste

- **Jours 1-3** : les demandes d'indexation ci-dessus.
- **Jour 4** : vérifiez dans *Sitemaps* que l'état est passé à « Réussite ».
  S'il reste « Impossible de récupérer », dites-le-moi.
- **Semaines 2 à 6** : les positions se forment. Ne les jugez pas avant.
- **Pendant tout ce temps** : partagez les liens dans vos groupes WhatsApp et
  Facebook. Le trafic réel est le signal que Google suit le plus, et c'est le
  seul levier qui vous reste entièrement.
