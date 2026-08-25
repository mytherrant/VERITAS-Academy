/* ════════════════════════════════════════════════════════════════════════
   VÉRITAS — Banc : l'accueil obéit-il au panneau d'administration ?
   ────────────────────────────────────────────────────────────────────────
   CE QUI NE MARCHAIT PAS
   L'accueil public est une page STATIQUE, construite au build. Le panneau
   « Portail visiteur » édite publicInfo, api/public_data.php le sert en
   entier, et assets/vitrine.js sait remplir tout élément portant
   data-vrt-pub="chemin". Trois pièces en place — et zéro fente posée dans la
   maquette : `grep -c data-vrt-pub vitrine.html` rendait 0. Jacques modifiait
   ses horaires, enregistrait, et l'accueil ne bougeait pas. Aucune erreur,
   aucun message : un fil non branché ne se signale jamais.

   CE QUE LE BANC EXIGE
     A. une valeur posée par l'administration RECOUVRE le texte du build ;
     B. quand l'administration n'a rien posé, le texte du build DEMEURE.
   Le point B est la moitié qu'on oublie : une fente qui viderait la page dès
   que l'API est muette serait pire que pas de fente du tout — un visiteur
   verrait un accueil amputé au moindre incident réseau.

   Lancer :  node tests/sonde_fentes_accueil.cjs [http://localhost:8077]
   ════════════════════════════════════════════════════════════════════════ */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:8077';
const FICHIER = path.join(__dirname, '..', 'data', 'veritas_db.json');
let echecs = 0;

function verifier(nom, condition, detail) {
  const ok = !!condition;
  if (!ok) echecs++;
  console.log(`${ok ? '  ✓' : '  ✗ ÉCHEC'} ${nom}${detail ? ` — ${detail}` : ''}`);
}

/* Le texte affiché par la fente, lu dans le DOM après le passage de vitrine.js. */
async function lireFentes(page) {
  return await page.evaluate(() => {
    const o = {};
    document.querySelectorAll('[data-vrt-pub]').forEach(e => {
      o[e.getAttribute('data-vrt-pub')] = (e.textContent || '').trim();
    });
    return o;
  });
}

async function ouvrir() {
  /* NAVIGATEUR neuf à chaque cas : vitrine.js garde la réponse 5 min en
     sessionStorage, et on veut mesurer la fente, pas le cache.

     ET un AGENT de vrai navigateur. api/public_data.php est gardé par la
     sentinelle (vrt_sentinelle « lecture ») : un agent contenant
     « HeadlessChrome » prend +55 au score de suspicion et se fait refuser en
     403 « Accès automatisé refusé ». C'est le comportement VOULU — la
     sentinelle protège 4 000 corrigés d'une moisson. Mais le banc représente
     un visiteur ordinaire : lui laisser sa signature d'automate mesurerait la
     sentinelle au lieu de la fente, et rendrait un échec illisible.
     On ne désarme rien côté serveur : on rend le client conforme à ce qu'il
     est censé imiter. `locale` pose Accept-Language, dont l'absence coûte
     encore +25. */
  const navigateur = await chromium.launch();
  const ctx = await navigateur.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
             + '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    locale: 'fr-FR'
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-vrt-pub]', { timeout: 15000 });
  await page.waitForTimeout(2500);          // chargerPublic part à 260 ms, puis l'aller-retour
  const vu = await lireFentes(page);
  await navigateur.close();
  return vu;
}

(async () => {
  console.log(`\n🔍 Banc « l'accueil obéit-il au panneau admin ? »  (${BASE})\n`);

  const sauvegarde = fs.existsSync(FICHIER) ? fs.readFileSync(FICHIER, 'utf8') : null;
  try {
    // ── CAS B d'abord : l'administration n'a rien posé ────────────────────
    // On le passe en premier pour capturer les valeurs du BUILD, qui servent
    // ensuite de point de comparaison.
    console.log('  CAS B — l\'administration n\'a rien posé');
    fs.writeFileSync(FICHIER, JSON.stringify({ publicInfo: {}, school: {} }), 'utf8');
    const build = await ouvrir();
    const champs = Object.keys(build);
    verifier('les fentes existent dans la page servie', champs.length >= 2,
      champs.join(', ') || 'aucune');
    verifier('le texte du build DEMEURE quand l\'API ne dit rien',
      champs.every(c => build[c].length > 0),
      champs.map(c => `${c}="${build[c]}"`).join(' · '));

    // ── CAS A : l'administration pose une valeur ──────────────────────────
    console.log('\n  CAS A — l\'administration modifie horaires et adresse');
    const marque = 'BANC-' + Date.now();
    fs.writeFileSync(FICHIER, JSON.stringify({
      publicInfo: { horaires: marque + '-HORAIRES', adresse: marque + '-ADRESSE' },
      school: {}
    }), 'utf8');
    const pilote = await ouvrir();

    verifier('les horaires du panneau RECOUVRENT ceux du build',
      pilote['publicInfo.horaires'] === marque + '-HORAIRES',
      `affiché : « ${pilote['publicInfo.horaires']} »`);
    verifier('l\'adresse du panneau RECOUVRE celle du build',
      pilote['publicInfo.adresse'] === marque + '-ADRESSE',
      `affiché : « ${pilote['publicInfo.adresse']} »`);
  } finally {
    if (sauvegarde !== null) fs.writeFileSync(FICHIER, sauvegarde, 'utf8');
    console.log('\n  (data/veritas_db.json remis dans son état d\'origine)');
  }

  console.log(`\n${echecs === 0 ? '✅ Banc vert — l\'accueil obéit au panneau, et survit à son silence.' : `❌ ${echecs} contrôle(s) en échec.`}\n`);
  process.exit(echecs === 0 ? 0 : 1);
})();
