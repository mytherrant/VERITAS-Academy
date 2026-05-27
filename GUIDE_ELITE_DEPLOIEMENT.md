# 🎓 Guide de déploiement — Plan Élite Ambassa

> **Objectif** : Activer le plan **Élite (10 000 FCFA / mois)** avec Claude 3.5 Sonnet + RAG + Cache validé
> **Effort total** : 4-6 heures de configuration manuelle, ensuite tout est automatique
> **Coût initial** : 30 € de crédit Anthropic (≈ 19 000 FCFA)

---

## 📋 Vue d'ensemble

Cette infrastructure fournit aux abonnés Élite :

1. **Claude 3.5 Sonnet** (meilleur LLM pour le français/littérature) au lieu de Pollinations
2. **RAG** — l'IA reçoit en temps réel des extraits d'annales et de la bibliothèque africaine
3. **Cache validé par enseignant** — réponses curées servies instantanément (gratuit côté API)
4. **Quota illimité** — pas de blocage

Les fichiers créés :

| Fichier | Rôle |
|---|---|
| `api/ia_proxy.php` | Proxy sécurisé vers Anthropic (clé API jamais exposée au client) |
| `api/rag.php` | Recherche dans biblio_index.db (SQLite FTS5) |
| `api/admin_validate.php` | API admin pour valider/rejeter les réponses IA |
| `api/sql/veritas_validated_answers.sql` | Schéma MySQL du cache validé |
| `admin-validation.html` | Interface graphique pour valider les réponses |

---

## 🔧 ÉTAPE 1 — Compte Anthropic + clé API (30 min)

1. **Créer le compte** : https://console.anthropic.com/login
   - Email pro : `contact@veritas.cm` (ou autre que vous gérez)
   - Activer la 2FA pour sécurité

2. **Charger 30 € de crédit initial**
   - Console → Settings → Plans & Billing
   - Cliquer "Add credit" → minimum 5 $, recommandé 30 $ (≈ 30 €)
   - Méthode : carte bancaire internationale OU virement (plus long)

3. **Générer la clé API**
   - Console → API Keys → "Create Key"
   - Nom : `veritas-school-production`
   - **COPIEZ LA CLÉ MAINTENANT** (vous ne pourrez plus la revoir) — elle commence par `sk-ant-api03-...`

4. **Tester rapidement** (optionnel, depuis votre PC)
   ```bash
   curl https://api.anthropic.com/v1/messages \
     -H "x-api-key: sk-ant-VOTRE_CLE" \
     -H "anthropic-version: 2023-06-01" \
     -H "content-type: application/json" \
     -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":50,"messages":[{"role":"user","content":"Dis bonjour en 5 mots"}]}'
   ```

---

## 🔐 ÉTAPE 2 — Stocker la clé API sur LWS (10 min)

**⚠️ NE JAMAIS commiter la clé dans Git.** Elle va dans `api/payment_config.php` qui est déjà ignoré.

1. **Connectez-vous au FTP LWS** (FileZilla ou autre)
2. Téléchargez le fichier `api/payment_config.php` actuel
3. Ajoutez ces lignes (avant le `?>` final s'il existe) :

```php
<?php
// ... contenu existant (clés MoMo/Orange...) ...

// ── Anthropic Claude (Plan Élite) ────────────────────────────────────
define('ANTHROPIC_API_KEY', 'sk-ant-api03-VOTRE_CLE_ICI');

// ── Token admin pour valider les réponses IA ────────────────────────
// Choisir un long token aléatoire (32+ caractères)
define('ADMIN_TOKEN', 'vrt-admin-XXXXXXXXXXXXXXXXXXXXXX');
```

**💡 Générer un token admin sécurisé** :
- En ligne : https://www.uuidgenerator.net/version4
- Ou en console : `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`

4. Re-uploadez `payment_config.php` sur LWS via FTP
5. Vérifiez que `api/.htaccess` interdit l'accès direct :
   ```apache
   <Files "payment_config.php">
     Order allow,deny
     Deny from all
   </Files>
   ```

---

## 🗃 ÉTAPE 3 — Créer la table cache validé (5 min)

1. **Connectez-vous à phpMyAdmin LWS**
2. Sélectionnez votre base de données VÉRITAS
3. Onglet **SQL**
4. Collez le contenu de `api/sql/veritas_validated_answers.sql`
5. Cliquez **Exécuter**

Vérification :
```sql
SHOW TABLES LIKE 'veritas_validated_answers';
DESCRIBE veritas_validated_answers;
```

Vous devriez voir la table avec ses 14 colonnes.

---

## 📚 ÉTAPE 4 — RAG : Uploader la bibliothèque (15 min)

Le RAG s'appuie sur `biblio_index.db` (SQLite FTS5, ~2 GB sur votre PC dans `C:\Users\Mythe Errant\Desktop\Corpus\`).

**Option A — Upload complet (recommandé si LWS accepte)**

1. Vérifiez la limite d'upload LWS (généralement 2 GB max par fichier)
2. Compressez la base : `gzip biblio_index.db` → `biblio_index.db.gz` (~600 MB)
3. Uploadez via FTP dans `/api/data/`
4. SSH ou panneau LWS : `gunzip biblio_index.db.gz`
5. Vérifiez : `ls -lah api/data/biblio_index.db` (doit faire ~2 GB)

**Option B — Sous-ensemble (si LWS limite la taille)**

Sur votre PC, créer une base réduite avec uniquement les œuvres au programme :

```bash
cd "C:\Users\Mythe Errant\Desktop\Corpus"
python -c "
import sqlite3
src = sqlite3.connect('biblio_index.db')
dst = sqlite3.connect('biblio_minesec.db')
# Copier la structure
for row in src.execute(\"SELECT sql FROM sqlite_master WHERE type='table' AND sql IS NOT NULL\"):
    try: dst.execute(row[0])
    except: pass
# Filtrer auteurs MINESEC
authors = ['Mongo Beti', 'Eza Boto', 'Ferdinand Oyono', 'Mariama Bâ',
           'Pabe Mongo', 'Guy Menga', 'René Philombe', 'Djaïli Amadou Amal',
           'Léonora Miano', 'Camara Laye', 'Wole Soyinka', 'Chinua Achebe',
           'Molière', 'Voltaire', 'Sully Prudhomme', 'Mveng']
for a in authors:
    src.execute('ATTACH ? AS ext', (dst.execute('PRAGMA database_list').fetchone()[2],))
    # ...migration filtrée
"
```

→ Base réduite à ~50 MB, suffisante pour les œuvres au programme.

**Option C — Ignorer le RAG pour démarrer**

Si vous ne pouvez pas uploader maintenant, `api/rag.php` retournera juste `{passages:[]}` et l'IA fonctionnera sans contexte enrichi. Vous activerez le RAG plus tard.

---

## 🌐 ÉTAPE 5 — Déployer les fichiers PHP (5 min)

1. **Commit + push** depuis votre PC :
   ```bash
   cd "C:\Users\Mythe Errant\Downloads\Claude code"
   git add api/ia_proxy.php api/rag.php api/admin_validate.php \
           api/sql/veritas_validated_answers.sql \
           admin-validation.html GUIDE_ELITE_DEPLOIEMENT.md
   git commit -m "feat(elite) : MVP Plan Élite — proxy IA + RAG + admin validation"
   git push origin master
   ```

2. **Vérifier le workflow GitHub Actions** : il faut qu'il copie ces nouveaux fichiers.

   Ouvrez `.github/workflows/deploy.yml` et ajoutez dans la section "Préparer les fichiers" :
   ```yaml
   # API Plan Élite
   for f in api/ia_proxy.php api/rag.php api/admin_validate.php; do
     [ -f "$f" ] && cp "$f" deploy/api/ && echo "  ✓ $f"
   done
   # Page admin validation
   [ -f admin-validation.html ] && cp admin-validation.html deploy/ && echo "  ✓ admin-validation.html"
   ```

3. **Push à nouveau** → le workflow déploie tout via FTP automatiquement.

---

## ✅ ÉTAPE 6 — Tester le système complet (15 min)

### Test 1 — Le proxy fonctionne sans clé Anthropic (mode fallback)

```bash
curl -X POST https://veritas-school.com/api/ia_proxy.php \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Bonjour","plan":"free"}'
```
Réponse attendue : du texte généré par Pollinations.

### Test 2 — Le proxy utilise Sonnet si plan Élite

```bash
curl -X POST https://veritas-school.com/api/ia_proxy.php \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Quels sont les axes de Tartuffe ?","plan":"elite","userId":"test_user"}'
```
Réponse attendue : `"source":"claude_sonnet"` dans le JSON.

### Test 3 — Le RAG répond

```bash
curl "https://veritas-school.com/api/rag.php?q=Mongo+Beti+Ville+Cruelle"
```
Réponse attendue : `{ok:true, passages:[{auteur:"Mongo Beti", ...}]}`.

### Test 4 — La page admin valide une réponse

1. Ouvrir https://veritas-school.com/admin-validation.html
2. Entrer le `ADMIN_TOKEN` choisi à l'étape 2
3. Vous devriez voir la réponse du test 2 dans la liste "En attente"
4. Cliquer ✓ Valider → la réponse passe en "Validées"
5. Refaire le test 2 → cette fois `"source":"cache_validated"` (retour instantané du cache)

---

## 🚀 ÉTAPE 7 — Activer Élite côté frontend (30 min)

Dans `VERITAS_v1.2.html`, modifier la fonction `callClaudeAPI` pour utiliser le proxy si l'utilisateur est Élite :

```javascript
async function callClaudeAPI(prompt, sysPrompt) {
  const ses = (typeof SES !== 'undefined' && SES) ? SES : null;
  const tier = (typeof _aiTier === 'function') ? _aiTier() : 'anon';
  const userId = ses && ses.id ? ses.id : 'anon-' + (localStorage.getItem('_anonId') || (function(){
    const id = 'anon-' + Math.random().toString(36).slice(2);
    localStorage.setItem('_anonId', id);
    return id;
  })());

  // Plan Élite ou Admin → passer par le proxy serveur (Sonnet + RAG + Cache)
  if (tier === 'elite' || tier === 'admin') {
    try {
      // 1. RAG : récupérer le contexte (max 2 secondes)
      let ragContext = '';
      try {
        const ctrl = new AbortController();
        setTimeout(() => ctrl.abort(), 2000);
        const ragResp = await fetch('/api/rag.php?q=' + encodeURIComponent(prompt.substring(0, 200)), { signal: ctrl.signal });
        const ragData = await ragResp.json();
        if (ragData.passages && ragData.passages.length) {
          ragContext = ragData.passages.map(p =>
            'Source: ' + p.auteur + ' — ' + p.titre + (p.annee ? ' (' + p.annee + ')' : '') +
            '\n' + p.extrait
          ).join('\n\n');
        }
      } catch(e) { /* RAG optionnel */ }

      // 2. Appel proxy IA
      const resp = await fetch('/api/ia_proxy.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          sysPrompt: sysPrompt || AMBASSA_PERSONA,
          ragContext,
          userId,
          plan: tier
        })
      });
      const data = await resp.json();
      if (data && data.text) {
        if (data.source === 'cache_validated') {
          toast('✓ Réponse validée par un enseignant VÉRITAS', 'ok');
        }
        return data.text;
      }
    } catch(e) { console.warn('[Élite] proxy fail, fallback Pollinations:', e); }
  }

  // FALLBACK : Pollinations direct (anon, free, starter, pro)
  // (code existant inchangé...)
}
```

---

## 💰 ÉTAPE 8 — Onboarding du premier abonné Élite (1 jour)

### Côté admin (vous)

1. Créer un plan dans `DB.elearning.plans` :
   ```js
   { id: 'elite', nom: 'Élite', prix: 10000, periode: 'mois',
     avantages: ['IA illimitée Claude Sonnet', 'RAG contexte annales',
                 'Réponses validées enseignant', 'Photo Math premium',
                 'Accès prioritaire forum'] }
   ```

2. Créer la page de souscription `pgEliteSubscription()` avec :
   - Bouton "Payer 10 000 F MoMo" → modal avec téléphone +237 677 637 739, référence ELITE-XYZ123
   - Bouton WhatsApp "Envoyer ma confirmation" → message pré-rempli au centre

### Côté élève

1. Élève clique "S'abonner Élite" → reçoit la référence ELITE-XYZ123
2. Paie 10 000 F MoMo au +237 677 637 739 avec cette référence
3. Envoie WhatsApp confirmation
4. Vous validez dans `mPayAttempts()` → bascule son `tier` à `elite` pour 30 jours
5. Élève accède immédiatement à Sonnet + RAG + Cache

---

## 📊 ÉTAPE 9 — Suivi des coûts Anthropic (mensuel)

1. **Console Anthropic** → Usage → graphique journalier des tokens consommés
2. **Notification email** : configurer un seuil à 25 € (alerte avant épuisement)
3. **Auto-recharge** : activer "Auto-reload" si solde < 5 € → +20 €

Coût moyen par requête Sonnet (estimé) :
- Prompt 8 KB + RAG 4 KB + persona 3 KB = ~6 000 tokens d'entrée → ~0,018 $
- Réponse ~2 000 tokens → ~0,030 $
- **Total : ~0,05 $ par requête** = ~30 FCFA

Pour 10 abonnés Élite à 30 requêtes/mois = 300 requêtes = **15 $ (≈ 9 500 FCFA)** de coût Anthropic.
Recette : 10 × 10 000 FCFA = **100 000 FCFA** → marge brute ≈ 90 500 FCFA.

---

## 🛡 ÉTAPE 10 — Sécurité finale (checklist)

- [ ] `payment_config.php` est dans `.gitignore` ✓ (déjà fait)
- [ ] `ANTHROPIC_API_KEY` jamais dans le HTML/JS côté client ✓
- [ ] `ADMIN_TOKEN` long et unique (32+ chars) ✓
- [ ] `api/admin_validate.php` exige le token sur CHAQUE requête ✓
- [ ] `api/rag.php` en lecture seule (PRAGMA query_only) ✓
- [ ] Rate limiting basique dans `ia_proxy.php` (2s entre 2 requêtes par user) ✓
- [ ] HTTPS forcé sur LWS (déjà actif) ✓
- [ ] Logs IA dans `api/data/ia_proxy.log` rotation manuelle si > 10 MB

---

## 📞 Support et débogage

**Si l'IA ne répond pas en plan Élite** :
1. Vérifier dans `api/data/ia_proxy.log` les dernières lignes
2. Console DevTools : chercher les messages `[IA]`
3. Vérifier le solde Anthropic console
4. Tester directement : `curl -X POST https://veritas-school.com/api/ia_proxy.php ...` (voir Test 2)

**Si le cache validé ne marche pas** :
1. phpMyAdmin → vérifier que la table existe
2. Tester avec : `SELECT COUNT(*) FROM veritas_validated_answers;`
3. Vérifier les logs : `tail -50 api/data/ia_proxy.log | grep cache_hit`

**Si le RAG est vide** :
1. Vérifier que `api/data/biblio_index.db` existe et fait > 1 KB
2. Tester : `curl 'https://veritas-school.com/api/rag.php?q=Mongo+Beti'`
3. Si pas de fichier → mode dégradé OK, l'IA fonctionne sans RAG

---

## 🎯 Roadmap d'amélioration continue

**Après 1 mois** :
- Analyser les réponses les plus utilisées (top 20)
- Valider en priorité les "patterns" récurrents (chaque sujet de dissert' Tartuffe → 1 corrigé validé)

**Après 3 mois** :
- 200+ réponses validées → cache hit > 70% → coût Anthropic divisé par 3
- Activer le tier "pro" en payant 50% du coût Sonnet (marge réduite mais accessible)

**Après 6 mois** :
- Considérer un fine-tuning Mistral sur le corpus validé (économie 80% sur les coûts API)
- Ouvrir une API publique payante pour d'autres écoles camerounaises

---

*Document généré pour Jacques Miterand TAKOU — Centre VÉRITAS, Douala 2026*
*Pour toute question technique : consulter la console Anthropic ou rouvrir une session Claude Code*
