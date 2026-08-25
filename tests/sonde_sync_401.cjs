/* ════════════════════════════════════════════════════════════════════════
   VÉRITAS — Banc : un refus d'authentification ne doit pas se confondre
   avec une panne de réseau.
   ────────────────────────────────────────────────────────────────────────
   POURQUOI CE BANC EXISTE
   La synchronisation est morte le 12/08/2026 et personne ne l'a su avant le
   25/08 : le serveur répondait 401 (clé refusée après rotation du secret) et
   le client traitait ce refus comme une coupure réseau — trois tentatives,
   un point rouge, un toast de six secondes. Treize jours de saisies (élèves,
   livres, photos, paiements) n'ont existé que dans UN navigateur.

   CE QUE LE BANC EXIGE
   Deux cas, et surtout la DIFFÉRENCE entre les deux — un test qui ne verrait
   que le cas 401 passerait au vert même si le code affichait la bannière pour
   n'importe quelle erreur, ce qui rendrait l'alerte inutile à force de crier.

     A. 401 servi par le VRAI api/db.php  → bannière persistante, AUCUN retry.
     B. Hôte injoignable (panne réseau)   → PAS de bannière, retry programmé.

   Lancer :  node tests/sonde_sync_401.cjs [http://localhost:8077]
   ════════════════════════════════════════════════════════════════════════ */

const { chromium } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:8077';
let echecs = 0;

function verifier(nom, condition, detail) {
  const ok = !!condition;
  if (!ok) echecs++;
  console.log(`${ok ? '  ✓' : '  ✗ ÉCHEC'} ${nom}${detail ? ` — ${detail}` : ''}`);
}

/* Installe une session admin et neutralise ce qui partirait vers l'extérieur.
   On ne simule PAS le serveur : c'est le vrai db.php qui répondra 401. */
async function preparer(page, urlDb, secret) {
  await page.evaluate(({ urlDb, secret }) => {
    const ses = { type: 'superadmin', id: 'banc', nom: 'Banc', _token: 'banc', _exp: Date.now() + 36e5 };
    window.SES = ses;
    sessionStorage.setItem('VERITAS_SES', JSON.stringify(ses));

    // Le disjoncteur de _fbFetch renverrait un 503 synthétique avant l'appel réel.
    if (window._fbBreaker) window._fbBreaker.isOpen = () => false;

    LWS_API.db = urlDb;
    DB.cloudConfig = { url: urlDb.replace(/\/db\.php.*$/, ''), secret, lastSync: '12/08/2026 00:04:51' };

    // Repartir d'un écran propre entre deux cas.
    const b = document.getElementById('_authFailBanner');
    if (b) b.remove();
    window.__retryProgramme = false;
    if (!window.__setTimeoutOriginal) window.__setTimeoutOriginal = window.setTimeout;
  }, { urlDb, secret });
}

/* Observe la conséquence du refus.

   On lit `_syncRetryTimer` — l'état que le code POSE lui-même quand il décide
   de retenter — plutôt que d'envelopper _cloudAutoSyncPush pour compter les
   rappels. L'enveloppe paraissait plus directe ; elle ne mesurait rien : sous
   mutation elle restait verte, donc elle ne distinguait pas « le code renonce »
   de « le code retente ». Un contrôle qui ne rougit jamais ne contrôle rien.

   Bénéfice second : le minuteur est posé DANS le catch, donc visible en une
   seconde, au lieu d'attendre les 8 s du premier backoff. */
async function lancerEtObserver(page) {
  return await page.evaluate(async () => {
    window._syncRetryTimer = null;
    window._cloudAutoSyncPush(1);

    // Attendre que le catch ait tranché : bannière OU minuteur de reprise.
    const limite = Date.now() + 8000;
    while (Date.now() < limite) {
      if (document.getElementById('_authFailBanner') || window._syncRetryTimer) break;
      await new Promise(r => setTimeout(r, 150));
    }
    await new Promise(r => setTimeout(r, 400));   // laisser le catch finir sa branche

    const ban = document.getElementById('_authFailBanner');
    return {
      banniere: !!ban,
      texte: ban ? (ban.textContent || '').slice(0, 90) : '',
      retryProgramme: !!window._syncRetryTimer
    };
  });
}

(async () => {
  console.log(`\n🔍 Banc « refus d'authentification ≠ panne réseau »  (${BASE})\n`);
  const navigateur = await chromium.launch();
  const page = await navigateur.newPage();
  page.on('pageerror', e => console.log('  ⚠ erreur page :', e.message));

  /* La session doit exister AVANT le premier script : /app.html sans ancre ni
     session repart sur la vitrine (app.html « _plusDAccueilIci », puis app.js
     ligne ~4249). Poser sessionStorage après le chargement arriverait trop
     tard — on mesurerait alors l'accueil public, pas l'application. */
  await page.addInitScript(() => {
    sessionStorage.setItem('VERITAS_SES', JSON.stringify({
      type: 'superadmin', id: 'banc', nom: 'Banc', _token: 'banc', _exp: Date.now() + 36e5
    }));
  });

  await page.goto(`${BASE}/app.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window._cloudAutoSyncPush === 'function', { timeout: 30000 });

  const present = await page.evaluate(() => typeof window._showAuthFailBanner === 'function');
  verifier('_showAuthFailBanner est présente dans app.js', present);

  // ── CAS A : le vrai db.php, avec une clé volontairement fausse ──────────
  console.log('\n  CAS A — 401 réel servi par api/db.php');
  await preparer(page, `${BASE}/api/db.php`, 'CLE_VOLONTAIREMENT_FAUSSE');
  const a = await lancerEtObserver(page);
  verifier('la bannière de refus s\'affiche', a.banniere, a.texte);
  verifier('aucune nouvelle tentative n\'est programmée', !a.retryProgramme,
    a.retryProgramme ? 'le code retente un refus permanent' : 'court-circuit correct');

  // ── CAS B : hôte injoignable — une vraie panne réseau ───────────────────
  //    Le contrôle qui donne sa valeur au cas A : si la bannière apparaissait
  //    ici aussi, elle ne dirait plus rien de particulier.
  console.log('\n  CAS B — hôte injoignable (panne réseau)');
  await preparer(page, 'http://127.0.0.1:9/db.php', 'peu-importe');
  const b = await lancerEtObserver(page);
  verifier('PAS de bannière de refus sur une panne réseau', !b.banniere, b.texte || 'aucune');
  verifier('une nouvelle tentative EST programmée', b.retryProgramme,
    b.retryProgramme ? 'backoff actif' : 'le retry a disparu — régression');

  /* ── CAS C : le mur anti-DDoS de l'hébergeur ────────────────────────────
     LWS renvoie 403 + une page HTML quand le laissez-passer manque. Ce n'est
     ni une clé refusée (401, corps JSON) ni une panne réseau, et cela se
     répare par un rechargement — pas en ressaisissant une clé. On sert donc
     une VRAIE réponse HTTP de cette forme, interceptée au niveau réseau. */
  console.log('\n  CAS C — 403 + page HTML (protection anti-DDoS de l\'hébergeur)');
  await page.route('**/api/db.php*', route => route.fulfill({
    status: 403,
    contentType: 'text/html; charset=utf-8',
    body: '<!DOCTYPE html><html><head><title>LWS Protection DDoS</title></head><body>Vérification en cours</body></html>'
  }));
  await preparer(page, `${BASE}/api/db.php`, 'peu-importe');
  await page.evaluate(() => { const b = document.getElementById('_shieldBanner'); if (b) b.remove(); });
  const c = await page.evaluate(async () => {
    window._cloudAutoSyncPush(1);
    const limite = Date.now() + 6000;
    while (Date.now() < limite) {
      if (document.getElementById('_shieldBanner')) break;
      await new Promise(r => setTimeout(r, 150));
    }
    const ban = document.getElementById('_shieldBanner');
    return { banniere: !!ban, texte: ban ? (ban.textContent || '').slice(0, 80) : '' };
  });
  verifier('la bannière « protection de l\'hébergeur » s\'affiche', c.banniere, c.texte);
  const pasConfondu = await page.evaluate(() => !document.getElementById('_authFailBanner'));
  verifier('elle n\'est PAS confondue avec une clé refusée', pasConfondu,
    pasConfondu ? 'aucune bannière de clé' : 'la bannière 401 s\'affiche aussi — les deux causes sont mélangées');
  await page.unroute('**/api/db.php*');

  await navigateur.close();
  console.log(`\n${echecs === 0 ? '✅ Banc vert — les trois causes sont distinguées.' : `❌ ${echecs} contrôle(s) en échec.`}\n`);
  process.exit(echecs === 0 ? 0 : 1);
})();
