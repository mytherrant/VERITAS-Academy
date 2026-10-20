# Reprise — Atelier de Français, lot J et suite (20/10/2026)

Branche de travail : **`atelier-progressions-suivi`** (tirée de `atelier-epure-relecture`, elle-même en PR #107 vers `master`). Travailler sur cette branche, jamais directement sur `master` : un push sur `master` déploie en production.

## Déjà fait (commits poussés)

| Commit | Contenu |
|---|---|
| 7062246 | Lot G — aperçu en mode document : feuille A4 réelle, onglets Énoncé / Corrigé / Guide / Note / Tout, impression `@page` avec en-tête et pied VÉRITAS paginé |
| 4318293 | Correctif — « Compréhension » et « Langue » n'apparaissent plus que si la structure de l'épreuve les comporte (`_rubriquesPrevues`, `_qListOf`) |
| a40c865 | Lot H — mode Focus du composeur |
| 8b48609 | Lot I — progressions nationales ESG/EST (`plateforme/progressions.js`, généré par `tools/importer_progressions.py`), écran Progressions, assistant « Progression nationale / Séquence évaluée » |

## À faire, dans l'ordre (un commit par lot ; montrer chaque lot à Jacques avant tout déploiement)

### 1. Lot J — Suivi et calendrier (modèle : eval.tchouskou.com/suivi)
- Nouvel écran « Suivi » (menu latéral, après Progressions).
- Échéances **déduites des progressions** pour « Mes classes » (`me.prefs.mesClasses`, ids de `VRT_PROGRESSIONS.classes`) :
  - sujet prêt : lundi de la semaine qui précède S5 ;
  - épreuve : S5 (début) ;
  - corrigé et compte rendu : S6.
- État de chaque échéance d'après l'épreuve liée (`ep.assistant.progId` + `ep.assistant.progSeq`) : aucun sujet / brouillon / en relecture / ajustement / validé / diffusé (`ep.status`, `ep.inLibrary`). En retard si la date est passée et l'état insuffisant.
- Filtres : horizon 30 j / 60 j / année ; classe ; « retards seulement ». Groupement par classe. Chaque ligne ouvre l'épreuve, ou propose « Composer l'évaluation » (`_composerSequence(cls, sq)`) s'il n'y en a pas.
- Vue mensuelle : vacances, fériés et journées officielles (`VRT_PROGRESSIONS.calendrier`).
- Accueil : bandeau « Cette semaine : séquence N, semaine n (type) » pour la première de mes classes (`_semaineDe(cls, iso)`).

### 2. Renforcer encore les consignes d'Ambassa
Dans `plateforme/generateur.js` (`formationMinesec`, `promptEpreuve`), en restant sous les plafonds : consigne système ≤ 20 Ko (ia_proxy.php), prompt ≤ `PLAFOND_PROMPT` (7 600 octets), sortie ≤ 8 192 jetons. Repasser `tests/banc_ambassa_guide.cjs`, `banc_composition_ambassa.cjs` et `banc_exigences_reflexion.cjs`.

### 3. Contrôles, puis PR vers master
```
node tests/verif_syntaxe_atelier.cjs
node tests/verif_liaisons_atelier.cjs
node tests/banc_planche_mobile.cjs
node tests/banc_progressions.cjs
node tests/banc_composition_ambassa.cjs
node tests/banc_ambassa_guide.cjs
node tools/versionner_atelier.cjs --verifie
python tools/habiller_pages.py --controle
```

## Pièges connus
- Patcher le gros `plateforme/index.html` par un **script Python écrit dans un fichier**, jamais par un heredoc (les antislashs y sont mangés). Vérifier chaque ancre (`assert s.count(old) == 1`).
- Pas de `git stash` : il réécrit les fichiers en CRLF et casse les ancres.
- Après toute modification d'un module `plateforme/*.js` : `node tools/versionner_atelier.cjs` (les jetons `?v=` sont contrôlés par la CI).
- Ordre des `const` dans `renderVals` : un calcul utilisé avant sa déclaration casse tout l'écran (zone morte).
- Les classes CSS `.vrt-feuille` (animation de la présentation) et `.vrt-hab` (habillage de la vitrine) sont réservées.
- Le corpus `api/data/corpus_minesec.json` est gitignoré : les bancs navigateur de l'Atelier ne tournent pas sans lui ; les contrôles ci-dessus, eux, tournent.
- Les fichiers Word des progressions ne sont pas dans le dépôt ; `plateforme/progressions.js` (généré) l'est. Ne pas le retoucher à la main.
