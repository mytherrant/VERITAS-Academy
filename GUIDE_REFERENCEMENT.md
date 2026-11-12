# Référencement — ce qu'il vous reste à faire

**État au 06/09/2026.** Le socle technique est en place et déployé. Ce qui suit
demande vos comptes Google et Bing : je ne peux pas le faire à votre place.

---

## 1. Google Search Console — 15 minutes, le levier décisif

Sans elle, Google trouvera vos 26 pages neuves en quelques semaines. Avec elle,
en quelques jours.

### a) Ouvrir la propriété

1. Allez sur **`search.google.com/search-console`**, connectez-vous.
2. « Ajouter une propriété » → choisissez **« Préfixe d'URL »** (pas « Domaine »,
   qui exige un accès DNS chez LWS).
3. Saisissez exactement : `https://veritas-school.com`

### b) Prouver que le site est à vous — choisissez UNE méthode

**Méthode « Fichier HTML » — la plus simple, tout est prêt.**

1. Google fait télécharger un fichier nommé `google<une longue suite>.html`.
2. Posez-le à la racine du dossier :
   `C:\Users\Mythe Errant\Downloads\Claude code\`
3. Dites-le-moi : je le commite et le pousse, il part en production tout seul.
   *(Ou, si vous préférez le faire : `git add google*.html`, commit, push.)*
4. Attendez la fin du déploiement (~3 min), puis cliquez « Valider » chez Google.

> La CI sait déposer ce fichier depuis aujourd'hui. Avant, il serait resté dans
> le dépôt sans jamais atteindre le serveur, et la validation aurait échoué sans
> que rien ne l'explique.

**Méthode « Balise HTML » — si vous préférez ne rien téléverser.**

Google donne une ligne de la forme :
`<meta name="google-site-verification" content="LE-JETON">`
Envoyez-la-moi : l'emplacement est préparé dans `vitrine.html` **et** dans la
maquette, je la pose aux deux endroits et je déploie.

### c) Une fois validé — les deux seuls gestes qui comptent

1. Menu **« Sitemaps »** → saisissez `sitemap-index.xml` → Envoyer.
   Un seul suffit : il pointe les neuf autres, soit **219 URL**.
2. Menu **« Inspection d'URL »** → collez une adresse → « Demander
   l'indexation ». À faire pour ces quatre-là en priorité :
   - `https://veritas-school.com/livrets/`
   - `https://veritas-school.com/livrets/oeuvre-tartuffe.html`
   - `https://veritas-school.com/livrets/6e.html`
   - `https://veritas-school.com/corriges/`

   Google limite à une dizaine de demandes par jour. Inutile de les faire
   toutes : le sitemap s'occupe du reste.

---

## 2. Bing Webmaster Tools — 5 minutes

`bing.com/webmasters` → « Importer depuis Google Search Console ». Il reprend
la propriété et les sitemaps sans rien ressaisir. Bing alimente aussi
DuckDuckGo et Yahoo.

---

## 3. Google Business Profile — si ce n'est pas déjà fait

Pour « cours de français Douala », « préparation BEPC Douala », c'est la fiche
locale qui remonte, pas le site. `business.google.com` → créer la fiche du
Centre VÉRITAS avec l'adresse, le téléphone et les horaires.

---

## Ce qui est déjà fait — n'y revenez pas

| | |
|---|---|
| Sitemaps | 9 fichiers, **219 URL**, tous déclarés dans `robots.txt` |
| Cahiers | 26 pages au plan, dont les 9 cahiers d'œuvre |
| Données structurées | `Product` (prix XAF, disponibilité) sur chaque page de cahier ; `Book` sur les fiches d'œuvre |
| Maillage | les 21 fiches d'œuvre mènent au cahier correspondant |
| Titres | tous sous 60 signes — la limite d'affichage de Google |
| Descriptions | toutes sous 155 signes |
| `robots.txt` | n'interdit ni `/livrets/`, ni `/oeuvres/`, ni `/corriges/` |
| Recherche interne | 431 entrées, à jour |

---

## Ce qu'il faut savoir avant de juger les résultats

- **Comptez un mois.** Une page neuve met deux à six semaines à trouver sa
  place. Regarder les positions au bout de trois jours ne dit rien.
- **Ce qui accélère vraiment, c'est le trafic réel.** Un lien partagé dans un
  groupe WhatsApp de parents amène des visiteurs, et Google le remarque. C'est
  plus efficace que n'importe quel réglage technique restant.
- **Ce qui ne marche pas** : acheter des liens, répéter des mots-clés, publier
  des pages sans contenu propre. Google les détecte et cela se paie.
- **Le levier suivant, quand vous voudrez** : une page par œuvre du premier
  cycle. Vous avez douze œuvres 6ᵉ→3ᵉ traitées dans les manuels, et seules les
  fiches existent. Ce sont les mêmes requêtes que « Tartuffe résumé », sur un
  public quatre fois plus nombreux.
