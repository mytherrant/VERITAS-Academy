# Kit de campagne VÉRITAS — mode d'emploi
*août 2026*

---

## Par où commencer

1. Lire [`PLAN_CAMPAGNE.md`](PLAN_CAMPAGNE.md) — la plateforme créative et le calendrier des six semaines.
2. Ouvrir `rendu/` — tout y est déjà fabriqué, prêt à imprimer et à envoyer.
3. Tourner les vidéos avec [`SCRIPTS_VIDEO.md`](SCRIPTS_VIDEO.md).
4. Copier les messages depuis [`MESSAGES_WHATSAPP.md`](MESSAGES_WHATSAPP.md).

Aucune étape ne dépend d'une autre. Si vous n'avez qu'une heure devant vous, imprimez cinq affiches élève et publiez `statut-corriges.png` en statut WhatsApp.

---

## Ce que contient `rendu/`

| Fichier | Taille | Pour quoi |
|---|---|---|
| `affiche-eleve.pdf` · `.png` | A4 (2382 × 3369 px, ~288 dpi) | Établissements, librairies. Le PDF va chez l'imprimeur, le PNG suffit pour une photocopie. |
| `affiche-enseignant.pdf` · `.png` | A4 | Salle des professeurs, à joindre au spécimen. |
| `affiche-parent.pdf` · `.png` | A4 | Réunions de parents, APEE, librairies. |
| `statut-corriges.png` | 1080 × 1920 | Statut WhatsApp — élèves. |
| `statut-prix.png` | 1080 × 1920 | Statut WhatsApp — parents. |
| `statut-enseignant.png` | 1080 × 1920 | Statut WhatsApp — enseignants. |
| `carre-chiffre.png` | 1080 × 1080 | À envoyer **dans** une discussion ou un groupe. |
| `carre-prix.png` | 1080 × 1080 | La grille de tarifs, à envoyer quand on demande « c'est combien ? ». |

**Les deux registres sont volontairement différents.** Les affiches A4 sont sur papier crème, sobres : elles s'impriment en photocopie sans ruiner personne et se lisent de près. Les visuels WhatsApp sont sur fond nuit et or : dans un fil de statuts, entre deux photos de famille, le crème disparaît et le navy gagne.

---

## Refabriquer les fichiers

```bash
node promo/render.js
```

Pour ne refaire qu'une pièce :

```bash
node promo/render.js parent
```

Le script pilote le Chrome déjà installé sur la machine — aucune dépendance à installer. Les A4 sortent en PDF vectoriel (net à n'importe quel zoom, polices incorporées) **et** en PNG 288 dpi.

### Régénérer les QR codes

```bash
python promo/gen_qr.py
```

Chaque affiche a son propre QR, qui pointe vers la page tenant sa promesse. Le `?src=` en fin d'URL sert seulement à savoir quelle affiche ramène du monde — les pages statiques ignorent les paramètres inconnus, rien ne casse.

### Rafraîchir les captures d'écran

Les téléphones affichent de **vraies captures du site en ligne**, pas des maquettes. Si le site change, refaites-les :

```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=12000 --window-size=430,860 --screenshot="C:\Users\Mythe Errant\Downloads\Claude code\promo\affiches\captures\seq.png" "https://veritas-school.com/corriges/3e/sequence-1.html"
```

> Les captures se prennent **sur le site en ligne**, jamais sur les fichiers locaux : en `file://`, les feuilles de style ne se chargent pas et la page sort toute nue.

---

## Imprimer

- **Chez un imprimeur** : donnez le **PDF**. Format A4, sans marges (« à fond perdu » non nécessaire — la maquette n'a pas d'élément qui touche le bord haut ou latéral).
- **En photocopie** : le **PNG** suffit. Prévenez que c'est de la couleur : le bandeau navy et l'orange portent l'information. En noir et blanc l'affiche reste lisible, mais elle perd le QR contrasté — vérifiez qu'il scanne encore avant d'en tirer cinquante.
- **Vérifiez toujours le QR sur un tirage réel**, avec deux téléphones différents, avant le tirage en nombre.

## Envoyer sur WhatsApp

- **Statut** : envoyez le PNG tel quel. Ne le recadrez pas — les marges hautes et basses évitent que l'interface de WhatsApp mange le texte.
- **Dans une discussion** : préférez les carrés. Un 1080 × 1920 s'affiche minuscule dans un fil.
- **Toujours envoyer en « document » si la qualité compte** ; en image, WhatsApp recompresse et le petit texte bave.
- Ne postez pas les trois statuts le même jour. Un par semaine, dans l'ordre du calendrier.

---

## Deux points qui demandent votre arbitrage

**1. La devise du logo dit « LA RÉUSSITE ASSURÉE ».**
Toute la campagne est bâtie sur l'inverse : *on ne promet pas la réussite, on promet la lucidité*. C'est ce qui la rend crédible face à un parent méfiant, et c'est la règle que vous avez posée vous-même. Le logo, lui, promet exactement ce que le texte refuse de promettre. Je l'ai laissé tel quel — c'est votre marque, pas une décision de campagne. Mais un parent attentif verra la contradiction. À trancher un jour, pas forcément maintenant.

**2. Ce que je n'ai pas mis, et pourquoi.**
Aucun témoignage, aucun taux de réussite VÉRITAS, aucun « déjà N élèves ». La base est vide : afficher un chiffre serait l'inventer. Les seuls chiffres présents sont comptés dans le dépôt (3 932 exercices, 42 séquences), lus dans le code (les tarifs), ou publics (BAC 2024). Le jour où vous aurez de vrais témoignages d'abonnés, ce sont eux qui feront le plus gros saut de conversion — bien plus que n'importe quel visuel.

---

## Les chiffres employés, et d'où ils viennent

| Chiffre | Source | Vérifiable par |
|---|---|---|
| 3 932 exercices corrigés | comptage des blocs `class="ex"` dans `corriges/` | `python promo/../tools/audit_corriges.py` ou recomptage direct |
| 42 séquences + 3 cahiers techniques | `corriges/<niveau>/sequence-N.html` et `corriges/est-*.html` | `ls corriges/*/sequence-*.html` |
| 3 000 / 5 000 / 25 000 FCFA l'année | `app.js`, plans `plan1`…`plan6` | recherche `plan2` dans `app.js` |
| 250 FCFA par mois | 3 000 ÷ 12 | arithmétique |
| BAC général 2024 : 37,26 % (contre 75,73 %) | résultats nationaux publics | presse nationale 2024 |

Si l'un de ces chiffres bouge, il bouge **partout** : les affiches, les statuts, les scripts et les messages le répètent. Refaites une recherche globale sur l'ancienne valeur avant de rendre quoi que ce soit.
