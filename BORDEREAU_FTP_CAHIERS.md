# Bordereau FTP — les neuf cahiers d'œuvre intégrale

**État au 06/09/2026.** Ce bordereau **remplace celui du 04/09**, qui demandait
de déposer 296 Mo d'images de pages. Ce n'est plus la marche à suivre : les
neuf cahiers sont devenus des **cahiers interactifs**, du même type que les
quinze autres. Il reste **neuf fichiers, 2,9 Mo en tout**.

---

## Ce qui a changé, en une ligne

| | Avant (04/09) | Maintenant |
|---|---|---|
| À déposer | 296 Mo d'images | **2,9 Mo** |
| Fichiers | 1 969 images + 9 dossiers epub | **9 fichiers** |
| L'élève | lisait | **écrit dedans, la correction s'ouvre** |
| L'enseignant | rien | **lit et annote les copies de sa classe** |
| Durée du transfert | plusieurs heures | **quelques minutes** |

---

## Le geste, une fois pour toutes

Déposez les neuf fichiers dans, sur le serveur :

```
uploads/protected/livrets/
```

C'est le **même dossier** que vos quinze cahiers actuels — celui qui contient
déjà `booklet-6e.js`. Rien de nouveau à créer.

Les fichiers sont sur votre poste, ici :

```
C:\Users\Mythe Errant\Downloads\Claude code\uploads\protected\livrets\
```

| Fichier | Ouvrage | Niveau | Prix | Poids |
|---|---|---|---|---|
| `booklet-oeuvre-tartuffe.js` | Tartuffe ou l'Imposteur | 2ⁿᵈᵉ | 1 000 F | 313 Ko |
| `booklet-oeuvre-capitoline.js` | Les Tribus de Capitoline | 2ⁿᵈᵉ | 1 000 F | 285 Ko |
| `booklet-oeuvre-poemes.js` | Poèmes sauvages | 2ⁿᵈᵉ | 1 000 F | 303 Ko |
| `booklet-oeuvre-balafon.js` | Balafon | 1ʳᵉ | 1 200 F | 346 Ko |
| `booklet-oeuvre-lionperle.js` | Le Lion et la Perle | 1ʳᵉ | 1 200 F | 291 Ko |
| `booklet-oeuvre-tenebres.js` | Au cœur des ténèbres | 1ʳᵉ | 1 200 F | 295 Ko |
| `booklet-oeuvre-ngum.js` | Ngum a Jemea | Tˡᵉ | 1 300 F | 308 Ko |
| `booklet-oeuvre-stances.js` | Stances et Poèmes | Tˡᵉ | 1 300 F | 339 Ko |
| `booklet-oeuvre-vieuxnegre.js` | Le Vieux Nègre et la Médaille | Tˡᵉ | 1 300 F | 320 Ko |

**Aucune image à déposer. Aucun dossier `epub/`. Rien d'autre.**

---

## Ce qui vous protège d'ici là

Les neuf **n'apparaissent pas** à la boutique tant que leur fichier n'est pas
sur le serveur — vérifié en production aujourd'hui : la devanture en annonce
seize (les quinze cahiers et *Le Tube digestif*), pas vingt-cinq.

Ce n'est pas un oubli, c'est la règle : `api/public_data.php` demande à
`vrt_livret_etat()` si le serveur peut livrer, et ne publie que ce qui répond
oui. Personne ne peut donc payer un cahier qui ne s'ouvrirait pas.

Leurs **pages de vente** et leurs **aperçus gratuits** sont, eux, déjà en ligne
et référencés — c'est ce qui prépare le terrain avant la mise en vente.

---

## Après le dépôt : la vérification qui compte

Dans le navigateur, **sur veritas-school.com** (la sentinelle refuse `curl`) :

```js
fetch('/api/public_data.php').then(r=>r.json()).then(j=>{
  const o = (j.boutique||[]).filter(b => String(b.id).includes('oeuvre-'));
  console.log(o.length + ' cahier(s) d\'œuvre en vente', o.map(b=>b.id));
});
```

- **9** → les neuf sont en vente.
- Un nombre inférieur → seuls ceux-là sont arrivés ; redéposez les autres.

Puis ouvrez un aperçu gratuit, qui ne demande pas de code :
`https://veritas-school.com/livrets/apercu.html?o=oeuvre-tartuffe`

---

## Ce qu'il reste à faire APRÈS, et que vous seul pouvez faire

1. **Le dépôt FTP ci-dessus** — neuf fichiers.
2. **Rien d'autre.** Le prix, le niveau, la page de vente, l'aperçu, le plan du
   site, le lien depuis la fiche d'œuvre : tout est déjà en ligne et se
   déclenche seul.

> Si vous republiez un cahier plus tard (contenu corrigé), relancez
> `python tools/cahier_oeuvre_interactif.py --charge <dossier>` puis redéposez
> le fichier concerné. Le catalogue et les pages se mettent à jour tout seuls.
