# 04 — Vérification (15/10/2026, soir)

## Ce qui est déployé
Commits poussés sur `master` (avance rapide depuis `a8ba357`, puis `e246ddb..bf1a9cd`), déployés par FTP. 2ᵉ vague (audit approfondi) : `d8f4e2f` Campus, `a3fa6b8` SkySMS, `99b61a4` Orange/MTN, `22da842` upload, `07efcf7` CI, `bf1a9cd` tunnel + assets **1.20.28** (vérifié en prod : `app.js?v=1.20.28.040403`, nouveaux messages présents, 0 erreur console). 1ʳᵉ vague :

| Commit | Contenu |
|---|---|
| `4110dbb` | Rapports d'audit (phases 1-4) |
| `7a76452` | **fix(skysms)** : n°1 id_operation recoupé · n°2 id_client imprévisible · n°3 référence non réutilisable · n°4 jeton de page + numéro masqué · n°5 verrou d'état · n°6 octroi après l'accusé · n°7 attente bornée / signalée · n°8 journaux masqués |
| `984c758` | Banc `tests/banc_skysms.php` (31 contrôles) branché en CI |
| `4d5a729` | `confirmerAchat` → `_payRef('BOOK')` ; version d'assets **1.20.27** |
| `e246ddb` | Fusion avec la session parallèle (`5d09b62`) : le rappel accuse **« 1 »** dès que la clé est bonne (règle SKYSOFT) ; l'id_operation n'est exigé que pour un « payé » |

## Preuves

| Test | Résultat | Preuve |
|---|---|---|
| Banc SkySMS **avant** correctif | ❌ 15 rouges / 31 | exécution locale sur `origin/master` |
| Banc SkySMS **après** correctif | ✅ 31/31 | `php tests/banc_skysms.php` |
| Contrôle du verrou (n°5) éprouvé par mutation | ✅ rouge sans correctif (rappel en 0,03 s), vert avec | version 1 du contrôle trouvée fausse et réécrite |
| Banc de la session parallèle `banc_skysms_rappel.cjs` | ✅ 33/33 | après fusion (32/33 avant d'avoir restreint l'id_operation aux « payé ») |
| Batterie complète de la CI, en local | ✅ 68/71 | les 3 rouges (`banc_cahiers_reels`, `banc_composition_ambassa`, `banc_menu_rubriques`) sont **identiques sur la prod sans mes correctifs** : ce sont des rouges de ce poste, pas des régressions |
| CI GitHub du push `e246ddb` | ✅ Déploiement (6 min), Tests E2E (2 min 27), Garde-fou des ouvrages | `gh run list --branch master` |
| Version servie en prod | ✅ `app.js?v=1.20.27.887603`, SW `veritas-v1.20.27.887603` | `/app.html`, `/sw.js` |
| Correctif navigateur servi | ✅ `_payRef("BOOK")` présent dans l'`app.js` de prod | téléchargement de l'`app.js` servi |
| Sonde de paiement | ✅ `provider: skysms`, `canCollect: true` | `?action=config` |
| Page de paiement inconnue | ✅ 404 | `?action=payer&ref=VT000000-ZZZZ` |
| Rappel sans clé | ✅ 401 | `?action=skysms_notify` sans `cle` |
| Accueil en navigateur | ✅ 0 erreur console | navigateur intégré |

## Ce qui n'a PAS été vérifié en prod (et pourquoi)
- **Aucun paiement réel lancé** : il n'existe aucun sandbox SkySoft (votre règle 4). Le parcours complet *init → collecte → rappel → accès* est prouvé **par le banc local**, avec une fausse SkySMS. À faire de votre côté : **un achat réel de 100 F** avec le produit `btest100`, puis le retirer de la boutique.
- **Le jeton de page n'a pas été testé en prod** : cela demandait de créer un faux paiement dans la base de prod. C'est prouvé par le banc (contrôles ④).
- **La réponse avant l'octroi (n°6)** n'est active que si LWS fournit `litespeed_finish_request()` ; c'est invérifiable en local, faute de LiteSpeed. Sinon le comportement reste celui d'avant.
- QCM, vidéo, mot de passe oublié, corrigés, Lighthouse : non rejoués.

## Retour arrière
```bash
git revert --no-edit e246ddb 4d5a729 984c758 7a76452 && git push origin HEAD:master
```
Le push redéploie automatiquement (comptez environ 6 min). Les paiements créés après le correctif portent `jeton` et `ops` : l'ancien code les ignore sans casser.
