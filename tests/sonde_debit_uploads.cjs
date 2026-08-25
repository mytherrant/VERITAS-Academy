/* ════════════════════════════════════════════════════════════════════════
   VÉRITAS — Banc : la file d'envoi ne doit pas faire bannir l'IP.
   ────────────────────────────────────────────────────────────────────────
   LE BUDGET N'EST PAS UNE OPINION
   LWS documente la limite : « Le débit de requêtes considérées comme
   mauvaises par votre IP est supérieur à la limite de 6 par minute avec une
   réserve de 20 sur un site » (erreur 512 / OL-BADRATE-PER-IP). Une réponse
   401, 403 ou 429 est une « mauvaise requête ».

   CE QUI SE PASSAIT
   Chaque fichier était retenté 2 fois, puis la file passait au suivant quoi
   qu'il arrive. Avec l'authentification cassée et 12 fichiers en attente :
   24 requêtes refusées d'affilée. Réserve dépassée → LWS ferme le site ENTIER
   à cette IP, y compris app.html. L'application se bannissait elle-même, et
   recommençait à chaque sauvegarde.

   CE QUE LE BANC EXIGE
   Sur un refus d'authentification, la file s'ARRÊTE : une seule requête part,
   pas vingt-quatre. On compte les requêtes réellement émises et on les
   confronte au budget documenté.

   Lancer :  node tests/sonde_debit_uploads.cjs [http://localhost:8077]
   ════════════════════════════════════════════════════════════════════════ */

const { chromium } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:8077';
const EN_ATTENTE = 12;      // fichiers en attente d'envoi
const BUDGET_LWS = 6;       // mauvaises requêtes/minute tolérées par LWS
const RESERVE_LWS = 20;     // réserve avant blocage
let echecs = 0;

function verifier(nom, condition, detail) {
  const ok = !!condition;
  if (!ok) echecs++;
  console.log(`${ok ? '  ✓' : '  ✗ ÉCHEC'} ${nom}${detail ? ` — ${detail}` : ''}`);
}

(async () => {
  console.log(`\n🔍 Banc « la file d'envoi ne doit pas faire bannir l'IP »  (${BASE})`);
  console.log(`   ${EN_ATTENTE} fichiers en attente · budget LWS : ${BUDGET_LWS}/min, réserve ${RESERVE_LWS}\n`);

  const navigateur = await chromium.launch();
  const page = await navigateur.newPage();
  await page.addInitScript(() => {
    sessionStorage.setItem('VERITAS_SES', JSON.stringify({
      type: 'superadmin', id: 'banc', nom: 'Banc', _token: 'banc', _exp: Date.now() + 36e5
    }));
  });

  // Le serveur refuse : c'est la situation exacte du 25/08/2026.
  let requetes = 0;
  await page.route('**/upload_file.php*', route => {
    requetes++;
    route.fulfill({ status: 401, contentType: 'application/json', body: '{"error":"Non autorisé"}' });
  });

  await page.goto(`${BASE}/app.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window._cloudAutoUploadBinaries === 'function', { timeout: 30000 });

  const resultat = await page.evaluate(async (n) => {
    // Des photos d'élèves en data: URL — le cas le plus courant chez Jacques.
    // 'A' répété est du base64 valide, ce que _toFile exige pour construire le File.
    DB.students = [];
    for (let i = 0; i < n; i++) {
      DB.students.push({ id: 'e' + i, nom: 'Test' + i, pre: 'X', photo: 'data:image/jpeg;base64,' + 'A'.repeat(8000) });
    }
    DB.cloudConfig = { url: location.origin + '/api', secret: 'CLE_FAUSSE', lastSync: 'Jamais' };

    return await new Promise(resolve => {
      let fini = false;
      window._cloudAutoUploadBinaries(function (envoyes, erreurs) {
        fini = true; resolve({ envoyes, erreurs, termine: true });
      });
      // Filet : si la file ne rend jamais la main, on veut quand même le compte.
      setTimeout(() => { if (!fini) resolve({ termine: false }); }, 20000);
    });
  }, EN_ATTENTE);

  await new Promise(r => setTimeout(r, 1500));   // laisser retomber d'éventuels retries en vol

  console.log(`  → requêtes réellement émises : ${requetes} (pour ${EN_ATTENTE} fichiers en attente)\n`);

  verifier('la file rend la main au lieu de tourner', resultat.termine,
    resultat.termine ? `${resultat.erreurs} échec(s) signalé(s)` : 'aucun rappel reçu en 20 s');
  verifier(`elle reste sous la réserve LWS (${RESERVE_LWS})`, requetes < RESERVE_LWS,
    `${requetes} requêtes`);
  verifier(`elle reste sous le débit LWS (${BUDGET_LWS}/min)`, requetes <= BUDGET_LWS,
    `${requetes} requêtes — au-delà, LWS ferme le site à l'IP`);
  verifier('elle s\'arrête au PREMIER refus (pas de marche forcée)', requetes <= 1,
    `${requetes} requête(s) ; sans l'arrêt, on en attendrait ${EN_ATTENTE * 2}`);

  await navigateur.close();
  console.log(`\n${echecs === 0 ? '✅ Banc vert — la file ne peut plus faire bannir l\'IP.' : `❌ ${echecs} contrôle(s) en échec.`}\n`);
  process.exit(echecs === 0 ? 0 : 1);
})();
