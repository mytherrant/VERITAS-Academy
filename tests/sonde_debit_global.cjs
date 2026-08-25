/* ════════════════════════════════════════════════════════════════════════
   VÉRITAS — Banc : l'application tient-elle dans le budget de l'hébergeur ?
   ────────────────────────────────────────────────────────────────────────
   LE BUDGET EST PUBLIÉ, ET IL EST ÉTROIT
   LWS documente deux paliers, tous deux comptés sur les requêtes
   « considérées comme mauvaises » — 401, 403, 429 en font partie :
     · OL-BADRATE-PER-IP  : 6 par minute, réserve de 20  → site fermé un moment
     · OL-BLACKLIST-IP    : au-delà, l'IP est bloquée sur les ports 80 ET 443
   Le second est le plus dur : il coupe aussi l'accès au panneau de
   l'hébergeur, donc le moyen même de demander le déblocage.

   CE QUI SE PASSAIT
   _startBgPoll interroge api/db.php toutes les 15 secondes : QUATRE requêtes
   par minute, en permanence. Clé refusée = quatre mauvaises requêtes par
   minute, soit les deux tiers du budget, sans fin. Le disjoncteur _fbBreaker
   ne les voyait pas (il ne compte que les 5xx). En ajoutant la synchro et la
   file d'envoi, le plafond était franchi sans discontinuer — et le
   bannissement ne pouvait plus retomber, puisque l'application le
   réalimentait. Constaté le 25/08/2026 : ni le site ni panel.lws.fr
   n'étaient joignables.

   CE QUE LE BANC MESURE
   Le nombre réel d'appels à /api/ pendant une fenêtre d'observation, serveur
   refusant tout. On le confronte au budget publié. On ne lit aucun
   indicateur interne : on compte ce qui part sur le réseau.

   Lancer :  node tests/sonde_debit_global.cjs [http://localhost:8077]
   ════════════════════════════════════════════════════════════════════════ */

const { chromium } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:8077';
const FENETRE_MS = 50000;      // > 3 cycles du sondage de 15 s
const BUDGET_MIN = 6;          // mauvaises requêtes/minute tolérées par LWS
const RESERVE    = 20;         // pointe absorbée avant blocage
let echecs = 0;

function verifier(nom, condition, detail) {
  const ok = !!condition;
  if (!ok) echecs++;
  console.log(`${ok ? '  ✓' : '  ✗ ÉCHEC'} ${nom}${detail ? ` — ${detail}` : ''}`);
}

(async () => {
  console.log(`\n🔍 Banc « l'application tient-elle dans le budget LWS ? »  (${BASE})`);
  console.log(`   fenêtre : ${FENETRE_MS / 1000} s · budget : ${BUDGET_MIN} mauvaises requêtes/min\n`);

  const navigateur = await chromium.launch();
  const ctx = await navigateur.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
             + '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    locale: 'fr-FR'
  });
  await ctx.addInitScript(() => {
    sessionStorage.setItem('VERITAS_SES', JSON.stringify({
      type: 'superadmin', id: 'banc', nom: 'Banc', _token: 'banc', _exp: Date.now() + 36e5
    }));
  });
  const page = await ctx.newPage();

  // Le serveur refuse TOUT : c'est la situation d'une clé périmée.
  const appels = [];
  await page.route('**/api/**', route => {
    appels.push({ t: Date.now(), url: route.request().url().split('?')[0] });
    route.fulfill({ status: 401, contentType: 'application/json', body: '{"error":"Non autorisé"}' });
  });

  await page.goto(`${BASE}/app.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof DB !== 'undefined' && !!(DB && DB.school), { timeout: 30000 });

  // Configuration cloud complète + sondage de fond armé : le pire cas réel.
  await page.evaluate((base) => {
    LWS_API.db = base + '/api/db.php';
    DB.cloudConfig = { url: base + '/api', secret: 'CLE_PERIMEE', lastSync: '14/08/2026 23:25:11' };
    if (typeof _startBgPoll === 'function') _startBgPoll();
    if (typeof _triggerAutoSync === 'function') _triggerAutoSync();
    DB.lastModified = Date.now();
    save();
  }, BASE);

  const debut = Date.now();
  await page.waitForTimeout(FENETRE_MS);
  const duree = (Date.now() - debut) / 1000;

  /* DEUX mesures, parce que la règle de LWS en distingue deux : un DÉBIT
     soutenu (6/min) et une RÉSERVE (20) qui absorbe une pointe. Confondre les
     deux ferait rougir le banc pour un démarrage parfaitement sain — sondes de
     configuration des passerelles, premier pull — qui ne se répète jamais.
     Ce qui tue une adresse IP, c'est ce qui recommence chaque minute. */
  const AMORCE_MS = 15000;                       // le temps que la page s'installe
  const amorce = appels.filter(a => a.t - debut <  AMORCE_MS);
  const regime = appels.filter(a => a.t - debut >= AMORCE_MS);
  const dureeRegime = (duree * 1000 - AMORCE_MS) / 1000;
  const parMinute = regime.length / (dureeRegime / 60);

  const parChemin = {};
  appels.forEach(a => { parChemin[a.url] = (parChemin[a.url] || 0) + 1; });

  console.log(`  → ${appels.length} appel(s) en ${duree.toFixed(0)} s`);
  console.log(`      démarrage (${AMORCE_MS / 1000} premières s) : ${amorce.length}`);
  console.log(`      régime établi (${dureeRegime.toFixed(0)} s suivantes) : ${regime.length}`
            + `  →  ${parMinute.toFixed(1)}/min`);
  Object.keys(parChemin).forEach(u => console.log(`      ${parChemin[u]}× ${u.replace(BASE, '')}`));
  console.log('');

  verifier(`le débit établi reste sous le budget LWS (${BUDGET_MIN}/min)`,
    parMinute <= BUDGET_MIN, `${parMinute.toFixed(1)}/min`);
  verifier(`le démarrage reste sous la réserve LWS (${RESERVE})`,
    amorce.length < RESERVE, `${amorce.length} appel(s) au démarrage`);
  verifier('le sondage de fond se TAIT après le refus',
    regime.length === 0,
    `${regime.length} appel(s) en régime ; sans frein, le seul sondage de 15 s `
    + `en produirait ~${Math.floor(dureeRegime / 15)}`);
  verifier('le frein est bien posé côté application',
    await page.evaluate(() => typeof _vrtFreine === 'function' && _vrtFreine()),
    'window._vrtServeurRefuse renseigné');
  verifier('corriger la clé lève le frein immédiatement',
    await page.evaluate(() => { _vrtLeverFrein(); return !_vrtFreine(); }),
    'aucune attente imposée à qui vient de réparer');

  await navigateur.close();
  console.log(`\n${echecs === 0 ? '✅ Banc vert — l\'application ne peut plus faire bannir son propre hébergement.' : `❌ ${echecs} contrôle(s) en échec.`}\n`);
  process.exit(echecs === 0 ? 0 : 1);
})();
