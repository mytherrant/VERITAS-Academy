/* ════════════════════════════════════════════════════════════════════════
   VÉRITAS — Banc : une correction faite dans le panneau admin doit TENIR.
   ────────────────────────────────────────────────────────────────────────
   CE QUI NE MARCHAIT PAS
   Les livres numériques entrent dans la base par catalogue_livres.json, relu
   à chaque chargement de l'application. La fusion réimposait la fiche du
   fichier : « Mise à jour : ce que le catalogue décrit, et rien d'autre ».
   Corriger un prix ou un titre depuis le panneau admin ne tenait donc pas —
   la valeur revenait au rechargement suivant, sans message, sans trace.
   « Modifiable à tout moment » était faux, et personne ne pouvait le voir
   autrement qu'en rechargeant deux fois.

   CE QUE LE BANC EXIGE, ET SURTOUT LA DIFFÉRENCE ENTRE LES DEUX
   Un banc qui vérifierait seulement « l'édition survit » passerait aussi si
   la fusion ne faisait plus rien du tout — ce qui casserait les mises à jour
   du catalogue. Il faut donc les deux :
     A. un champ CORRIGÉ à la main n'est plus repris par le fichier ;
     B. un champ NON touché continue d'être mis à jour par le fichier.

   Lancer :  node tests/sonde_catalogue_admin.cjs [http://localhost:8077]
   ════════════════════════════════════════════════════════════════════════ */

const { chromium } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:8077';
let echecs = 0;

function verifier(nom, condition, detail) {
  const ok = !!condition;
  if (!ok) echecs++;
  console.log(`${ok ? '  ✓' : '  ✗ ÉCHEC'} ${nom}${detail ? ` — ${detail}` : ''}`);
}

const ID = 'bancLivre';
function catalogue(titre, prix) {
  return JSON.stringify({
    version: 1,
    livres: [{
      id: ID, titre: titre, auteur: 'Banc', prix: prix, prixDigital: prix,
      pages: 20, securePages: 20, freePages: 3, epub: false, numeriqueSeul: true
    }]
  });
}

(async () => {
  console.log(`\n🔍 Banc « une correction admin tient-elle ? »  (${BASE})\n`);

  const navigateur = await chromium.launch();
  const page = await navigateur.newPage();
  await page.addInitScript(() => {
    sessionStorage.setItem('VERITAS_SES', JSON.stringify({
      type: 'superadmin', id: 'banc', nom: 'Banc', _token: 'banc', _exp: Date.now() + 36e5
    }));
  });

  // Le catalogue servi est piloté par le banc : c'est lui qui joue la
  // republication, sans toucher au vrai fichier du dépôt.
  let versionServie = catalogue('Titre A', 1000);
  await page.route('**/catalogue_livres.json*', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: versionServie }));

  await page.goto(`${BASE}/app.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof DB !== 'undefined' && !!(DB && DB.school), { timeout: 30000 });

  // ── 1. Première arrivée du livre ────────────────────────────────────────
  const initial = await page.evaluate(async (id) => {
    DB.books = [];
    DB._catVu = {};
    await window._catalogueLivresCharger();
    const b = (DB.books || []).find(x => x.id === id);
    return b ? { titre: b.titre, prix: b.prixDigital } : null;
  }, ID);
  verifier('le livre entre en base depuis le catalogue', !!initial,
    initial ? `« ${initial.titre} » à ${initial.prix} F` : 'absent');
  if (!initial) { await navigateur.close(); process.exit(1); }

  // ── 2. L'administration corrige le prix, puis le catalogue est republié ──
  console.log('\n  L\'administration passe le prix à 1500, puis le catalogue est republié (2000)');
  versionServie = catalogue('Titre B', 2000);

  const apres = await page.evaluate(async (id) => {
    const b = (DB.books || []).find(x => x.id === id);
    b.prixDigital = 1500;                 // la correction faite depuis le panneau
    await window._catalogueLivresCharger();
    const c = (DB.books || []).find(x => x.id === id);
    return { titre: c.titre, prix: c.prixDigital };
  }, ID);

  verifier('A. le prix corrigé à la main RÉSISTE à la republication',
    apres.prix === 1500, `prix = ${apres.prix} (1500 attendu, 2000 = écrasé)`);
  verifier('B. le titre NON touché est bien mis à jour',
    apres.titre === 'Titre B', `titre = « ${apres.titre} » (« Titre B » attendu)`);

  await navigateur.close();
  console.log(`\n${echecs === 0 ? '✅ Banc vert — l\'administration tranche, le catalogue continue de livrer le reste.' : `❌ ${echecs} contrôle(s) en échec.`}\n`);
  process.exit(echecs === 0 ? 0 : 1);
})();
