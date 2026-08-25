/* ════════════════════════════════════════════════════════════════════════
   VÉRITAS — Banc : une saisie part-elle VRAIMENT sur le serveur, toute seule ?
   ────────────────────────────────────────────────────────────────────────
   LA QUESTION QUE PERSONNE NE POSAIT
   « La synchronisation marche » se vérifiait jusqu'ici en regardant une
   pastille verte et une date. Or le 25/08/2026 la pastille disait « ✓ » et le
   serveur n'avait rien reçu depuis onze jours : `_fbFetch` rendait une réponse
   synthétique 200 aux non-admins, et un refus 401 était traité comme une
   panne réseau passagère. Un indicateur qui se contente de refléter ce que le
   client CROIT ne prouve rien.

   Ce banc ne lit aucun indicateur. Il écrit une marque dans DB, appelle
   save(), n'appelle RIEN d'autre — puis va lire le fichier du serveur pour
   voir si la marque y est arrivée. C'est la seule preuve qui compte.

   Il tourne contre le VRAI api/db.php servi en local (php -S), avec la vraie
   authentification Bearer : ni endpoint simulé, ni contrôle désactivé.

   Lancer :  node tests/sonde_sync_bout_en_bout.cjs [http://localhost:8077]
   ════════════════════════════════════════════════════════════════════════ */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:8077';
let echecs = 0;

function verifier(nom, condition, detail) {
  const ok = !!condition;
  if (!ok) echecs++;
  console.log(`${ok ? '  ✓' : '  ✗ ÉCHEC'} ${nom}${detail ? ` — ${detail}` : ''}`);
}

/* Le secret vit dans api/payment_config.php (gitignoré). On le lit au vol pour
   parler au serveur local ; il n'est jamais affiché ni recopié ailleurs. */
function secretLocal() {
  const f = path.join(__dirname, '..', 'api', 'payment_config.php');
  if (!fs.existsSync(f)) return null;
  const s = fs.readFileSync(f, 'utf8');
  for (const nom of ['API_SECRET', 'PAY_API_SECRET']) {
    const m = s.match(new RegExp("define\\('" + nom + "'\\s*,\\s*'([^']+)'"));
    if (m) return m[1];
  }
  return null;
}

async function lireServeur(secret) {
  const r = await fetch(`${BASE}/api/db.php?t=` + Date.now(), {
    headers: { Authorization: 'Bearer ' + secret }
  });
  if (!r.ok) return { _statut: r.status };
  return await r.json();
}

(async () => {
  console.log(`\n🔍 Banc « la saisie arrive-t-elle sur le serveur ? »  (${BASE})\n`);

  const secret = secretLocal();
  if (!secret) {
    console.log('  ⚠ api/payment_config.php introuvable ou sans secret — banc ignoré.');
    console.log('    (Attendu : ce fichier est gitignoré, il n\'existe que sur la machine.)\n');
    process.exit(0);
  }

  // Le serveur doit répondre AVANT qu'on mesure quoi que ce soit.
  const amorce = await lireServeur(secret);
  verifier('le serveur local accepte la clé', amorce._statut === undefined,
    amorce._statut ? 'HTTP ' + amorce._statut : 'authentifié');
  if (amorce._statut) {
    console.log('\n  Sans authentification, le reste n\'a pas de sens.\n');
    process.exit(1);
  }

  const navigateur = await chromium.launch();
  const page = await navigateur.newPage();
  await page.addInitScript(() => {
    sessionStorage.setItem('VERITAS_SES', JSON.stringify({
      type: 'superadmin', id: 'banc', nom: 'Banc', _token: 'banc', _exp: Date.now() + 36e5
    }));
  });
  await page.goto(`${BASE}/app.html`, { waitUntil: 'domcontentloaded' });
  // save() existe dès l'analyse du script ; DB n'est peuplée qu'après load(),
  // qui est asynchrone. Attendre les deux séparément, sinon on mesure le
  // chargement au lieu de la synchronisation.
  // `DB` est déclaré « let » dans app.js : il vit dans la portée lexicale
  // globale et n'est PAS une propriété de window. `window.DB` reste donc
  // undefined même une fois l'application chargée — d'où l'identifiant nu.
  await page.waitForFunction(() => typeof save === 'function', { timeout: 30000 });
  await page.waitForFunction(() => typeof DB !== 'undefined' && !!(DB && DB.school), { timeout: 30000 });

  const marque = 'BANC-' + Date.now();

  // ── CAS A : un admin enregistre → la marque doit atteindre le serveur ────
  console.log('  CAS A — un administrateur enregistre une modification');
  await page.evaluate(({ base, secret, marque }) => {
    if (window._fbBreaker) { window._fbBreaker.failures = []; window._fbBreaker.suspendedUntil = 0; }
    LWS_API.db = base + '/api/db.php';
    DB.cloudConfig = { url: base + '/api', secret: secret, lastSync: 'Jamais' };
    DB.school = DB.school || {};
    DB.school.slogan = marque;          // la marque que l'on cherchera côté serveur
    DB.lastModified = Date.now();
    save();                             // ← RIEN d'autre n'est appelé : c'est le sujet du test
  }, { base: BASE, secret, marque });

  // save() débounce à 800 ms, puis fait son pré-contrôle et son PUT.
  let vu = false, attendu = 0;
  for (let i = 0; i < 30 && !vu; i++) {
    await new Promise(r => setTimeout(r, 500));
    attendu += 500;
    const d = await lireServeur(secret);
    if (d && d.school && d.school.slogan === marque) vu = true;
  }
  verifier('la marque est arrivée sur le serveur SANS action manuelle', vu,
    vu ? `reçue en ~${attendu} ms` : 'absente après 15 s');

  // ── CAS B : un visiteur ne pousse rien ───────────────────────────────────
  //    Contrôle indispensable : sans lui, le CAS A passerait aussi si le code
  //    poussait la base pour n'importe qui — ce qui serait une fuite, pas un
  //    succès.
  console.log('\n  CAS B — un visiteur non-admin ne pousse rien');
  const marqueVisiteur = 'VISITEUR-' + Date.now();
  await page.evaluate(({ marque }) => {
    // save() et _fbFetch lisent tous deux sessionStorage directement pour
    // décider s'ils ont le droit de pousser : changer la session stockée
    // suffit, et c'est exactement le chemin qu'emprunte un vrai visiteur.
    sessionStorage.setItem('VERITAS_SES', JSON.stringify({ type: 'visiteur', id: 'v', _token: 'v', _exp: Date.now() + 36e5 }));
    DB.school.slogan = marque;
    DB.lastModified = Date.now();
    save();
  }, { marque: marqueVisiteur });

  await new Promise(r => setTimeout(r, 5000));
  const apres = await lireServeur(secret);
  const fuite = !!(apres && apres.school && apres.school.slogan === marqueVisiteur);
  verifier('la saisie d\'un visiteur n\'atteint PAS le serveur', !fuite,
    fuite ? 'le serveur a accepté une écriture de visiteur' : 'restée locale, comme attendu');

  await navigateur.close();
  console.log(`\n${echecs === 0 ? '✅ Banc vert — la synchronisation automatique fonctionne, et seulement pour un admin.' : `❌ ${echecs} contrôle(s) en échec.`}\n`);
  process.exit(echecs === 0 ? 0 : 1);
})();
