/* Sonde de l'ECRAN D'ATTENTE de l'Atelier — « Chargement du répertoire… ».
 *
 *   node tests/sonde_atelier_attente.cjs http://localhost:3200
 *
 * Elle confronte le fichier TEL QU'IL EST SERVI a quatre scenarios de bout en
 * bout, dans un vrai navigateur. Trois d'entre eux tournent autour d'un seul
 * fait, mesure le 21/08 : l'ecran de connexion est atteint par 401, mais
 * l'entree d'historique posee au montage porte 'accueil' — un appui sur
 * « retour » y ramenait, et l'application ne pouvait alors afficher que
 * « Chargement du répertoire… », sans requete en cours et sans personne pour
 * la relancer.
 *
 * A EPROUVER PAR MUTATION : lancee contre la version d'avant (banc
 * `atelier-banc-avant`, git show HEAD), elle DOIT echouer sur S1, S3 et S4.
 * Une sonde qui passe partout ne prouve rien.
 */
const { chromium } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:3200';
const APP = BASE + '/plateforme/';
const dodo = (ms) => new Promise(r => setTimeout(r, ms));

const resultats = [];
function juger(nom, ok, vu) {
  resultats.push({ nom, ok, vu });
  console.log((ok ? '  OK   ' : '  ECHEC') + ' | ' + nom + (ok ? '' : '\n         vu : ' + vu));
}

/* Ce que l'ecran montre, reduit a trois etats nommes. */
async function ecran(page) {
  const t = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim());
  if (/Chargement du répertoire/.test(t)) return { nom: 'attente', t };
  if (/Se connecter/.test(t) && /Identifiant/.test(t)) return { nom: 'connexion', t };
  if (/Bonjour/.test(t)) return { nom: 'application', t };
  return { nom: 'autre', t };
}

async function neuf(nav) {
  const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    try { localStorage.clear(); localStorage.setItem('minesec_intro_vue', 'true'); } catch (e) {}
  });
  return { ctx, page };
}

/* Attend qu'un ecran donne s'installe, sans figer le temps d'avance.
   25 s par defaut : React descend d'unpkg au premier chargement, et un
   controle qui tranche avant que la page ait fini de naitre ne mesure que sa
   propre impatience — il rendait la sonde intermittente. */
async function attendre(page, nom, max) {
  const fin = Date.now() + (max || 25000);
  let e = await ecran(page);
  while (e.nom !== nom && Date.now() < fin) { await dodo(250); e = await ecran(page); }
  return e;
}

async function seConnecter(page) {
  await page.fill('input[type="text"]', 'banc@veritas.cm');
  await page.fill('input[type="password"]', 'motdepasse');
  await page.click('button:has-text("Se connecter")');
}

(async () => {
  console.log('Sonde de l’écran d’attente — ' + APP + '\n');
  const nav = await chromium.launch();

  /* --- S1 : retour arriere depuis l'ecran de connexion ------------------ */
  {
    await fetch(BASE + '/__mode?m=auth&raz=1');
    const { ctx, page } = await neuf(nav);
    await page.goto(APP, { waitUntil: 'domcontentloaded' });
    const co = await attendre(page, 'connexion');
    juger('S0 · un visiteur sans compte reçoit l’écran de connexion',
      co.nom === 'connexion', co.nom + ' — ' + co.t.slice(0, 90));
    await page.goBack().catch(() => {});
    await dodo(1500);
    const e = await ecran(page);
    juger('S1 · « retour » depuis la connexion ne laisse pas une attente morte',
      e.nom !== 'attente', e.nom + ' — ' + e.t.slice(0, 110));
    await ctx.close();
  }

  /* --- S2 : la connexion normale marche toujours ------------------------ */
  {
    await fetch(BASE + '/__mode?m=auth&raz=1');
    const { ctx, page } = await neuf(nav);
    await page.goto(APP, { waitUntil: 'domcontentloaded' });
    await attendre(page, 'connexion');
    await seConnecter(page);
    const e = await attendre(page, 'application', 25000);
    juger('S2 · une connexion réussie ouvre l’application',
      e.nom === 'application', e.nom + ' — ' + e.t.slice(0, 110));
    await ctx.close();
  }

  /* --- S3 : le chien de garde n'invente pas de panne -------------------- */
  {
    await fetch(BASE + '/__mode?m=auth&raz=1');
    const { ctx, page } = await neuf(nav);
    await page.goto(APP, { waitUntil: 'domcontentloaded' });
    await attendre(page, 'connexion');
    await dodo(14000);                      // le chien de garde se declenche a 12 s
    await page.goBack().catch(() => {});
    await dodo(1500);
    const e = await ecran(page);
    const ment = /n’a jamais démarré|n'a jamais démarré|aucune requête n’est partie/.test(e.t);
    juger('S3 · aucun diagnostic inventé après 14 s sur l’écran de connexion',
      !ment && e.nom !== 'attente', e.nom + ' — ' + e.t.slice(0, 140));
    await ctx.close();
  }

  /* --- S4 : « Revenir a la connexion » ne se laisse pas defaire --------- */
  {
    await fetch(BASE + '/__mode?m=auth&raz=1');
    const { ctx, page } = await neuf(nav);
    await page.goto(APP, { waitUntil: 'domcontentloaded' });
    await attendre(page, 'connexion');
    await seConnecter(page);
    await attendre(page, 'application', 25000);
    /* le compte se ferme : on revient a la connexion par le chemin normal */
    await page.evaluate(() => { try { localStorage.removeItem('minesec_token'); } catch (e) {} });
    await fetch(BASE + '/__mode?m=auth&raz=1');   // le serveur ne connait plus le jeton
    await page.reload({ waitUntil: 'domcontentloaded' });
    const co = await attendre(page, 'connexion');
    juger('S4a · une session expirée ramène à la connexion',
      co.nom === 'connexion', co.nom + ' — ' + co.t.slice(0, 90));
    await page.goBack().catch(() => {});
    await dodo(1500);
    const e = await ecran(page);
    juger('S4b · et « retour » n’y ressuscite pas l’attente morte',
      e.nom !== 'attente', e.nom + ' — ' + e.t.slice(0, 110));
    await ctx.close();
  }

  /* --- S5 : une attente LEGITIME ne doit pas etre interrompue ----------
     La garde de coherence relance ou renvoie a la connexion quand plus rien
     n'est en cours. Elle ne doit surtout pas confondre « rien ne se passe »
     avec « c'est long » : un transfert de 700 Ko sur une ligne lente est un
     travail en cours, pas une panne. Ce controle-la garde la garde. */
  {
    await fetch(BASE + '/__mode?m=bloque&raz=1');
    const { ctx, page } = await neuf(nav);
    await page.goto(APP, { waitUntil: 'domcontentloaded' });
    const a = await attendre(page, 'attente');
    juger('S5a · un téléchargement en cours affiche l’attente',
      a.nom === 'attente', a.nom + ' — ' + a.t.slice(0, 90));
    await dodo(10000);
    const b = await ecran(page);
    juger('S5b · et l’attente n’est pas coupée pendant que le transfert dure',
      b.nom === 'attente', b.nom + ' — ' + b.t.slice(0, 110));
    /* immobilite : 25 s apres les en-tetes, la ligne est declaree morte */
    const fin = Date.now() + 30000;
    let c = await ecran(page);
    while (!/interrompu|n’a pas pu|réessayez/i.test(c.t) && Date.now() < fin) {
      await dodo(1000); c = await ecran(page);
    }
    juger('S5c · un transfert qui s’arrête en route finit par le dire',
      /interrompu|n’a pas pu|réessayez/i.test(c.t), c.nom + ' — ' + c.t.slice(0, 140));
    await ctx.close();
  }

  /* --- S6 : la VISITE GUIDEE ------------------------------------------
     Elle n'ouvre aucun compte, donc aucun repertoire — et tout le rendu etait
     suspendu a la presence du repertoire. Cliquer sur son nom menait donc a
     « Chargement du repertoire… » pour toujours (build 3), puis, la garde de
     coherence installee, a un retour immediat a l'accueil (build 5) : deux
     facons differentes de ne rien faire. C'est probablement LA panne signalee
     a l'origine — la liste de profils contient « M. Jacques Takou », et
     choisir son nom ressemble a une connexion. Ce controle-la manquait. */
  {
    await fetch(BASE + '/__mode?m=auth&raz=1');
    const { ctx, page } = await neuf(nav);
    const erreurs = [];
    page.on('pageerror', e => erreurs.push(String((e && e.message) || e).slice(0, 120)));
    await page.goto(APP, { waitUntil: 'domcontentloaded' });
    await attendre(page, 'connexion');
    await page.locator('button:has-text("Mme Nadège Fotso")').first()
      .click({ timeout: 8000 }).catch(() => {});
    await dodo(1500);
    const e = await ecran(page);
    juger('S6a · un profil d’exemple ouvre l’interface',
      e.nom === 'application', e.nom + ' — ' + e.t.slice(0, 110));
    const bandeau = await page.evaluate(
      () => /Profil d.{0,3}exemple/.test(document.body.innerText));
    juger('S6b · et dit pourquoi le répertoire est vide', bandeau, 'bandeau absent');
    /* On parcourt : une interface qui s'ouvre puis casse au premier clic
       n'est pas une visite guidee. */
    for (const lbl of ['Ressources', 'Épreuves', 'Cours', 'Accueil']) {
      await page.locator('button:has-text("' + lbl + '"), a:has-text("' + lbl + '")')
        .first().click({ timeout: 4000 }).catch(() => {});
      await dodo(600);
    }
    const f = await ecran(page);
    juger('S6c · la navigation ne retombe pas sur l’accueil public',
      f.nom !== 'connexion' && f.nom !== 'attente', f.nom + ' — ' + f.t.slice(0, 110));
    /* Une liste vide accusait LES FILTRES, quelle que soit la raison. Sur une
       base absente, ce message envoie chercher au mauvais endroit. */
    await page.locator('button:has-text("Ressources"), a:has-text("Ressources")')
      .first().click({ timeout: 4000 }).catch(() => {});
    await dodo(1200);
    const liste = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
    juger('S6e · la liste vide dit la vraie raison, pas « ces filtres »',
      /Profil d.{0,3}exemple/.test(liste) && !/ne correspond à ces filtres/.test(liste),
      liste.slice(0, 160));
    juger('S6d · aucune erreur JS pendant la visite',
      erreurs.length === 0, erreurs.join(' | '));
    await ctx.close();
  }

  await nav.close();
  const ko = resultats.filter(r => !r.ok).length;
  console.log('\n' + (resultats.length - ko) + '/' + resultats.length + ' contrôles passés');
  process.exit(ko ? 1 : 0);
})().catch(e => { console.error('sonde en panne :', e); process.exit(2); });
