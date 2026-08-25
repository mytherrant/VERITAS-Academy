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

  /* --- S6 : la DEMONSTRATION ANIMEE -----------------------------------
     Elle remplace la « Visite guidee » par profils d'exemple, retiree le
     25/08/2026. Cette visite avait deux defauts : elle ne montrait rien du
     travail (un profil n'ouvre aucun compte, donc aucun corpus), et cliquer
     son propre nom dans la liste ressemblait a se connecter — c'est la panne
     « Chargement du repertoire… » signalee trois fois en aout.
     La demonstration, elle, est du HTML et du CSS : elle ne peut pas mener a
     un ecran mort, puisqu'elle ne change pas d'ecran. */
  {
    await fetch(BASE + '/__mode?m=auth&raz=1');
    const { ctx, page } = await neuf(nav);
    const erreurs = [];
    page.on('pageerror', e => erreurs.push(String((e && e.message) || e).slice(0, 120)));
    await page.goto(APP, { waitUntil: 'domcontentloaded' });
    await attendre(page, 'connexion');

    const demo = await page.evaluate(() => {
      const c = document.querySelector('.vrt-demo');
      const sc = [...document.querySelectorAll('.vrt-scene')];
      return {
        presente: !!c,
        scenes: sc.length,
        puces: document.querySelectorAll('.vrt-demo-puces i').length,
        titres: sc.map(x => (x.querySelector('h4') || {}).textContent || ''),
        /* Une scene sans hauteur est une scene absente : le cadre pourrait
           etre la et son contenu effondre. */
        hauteur: c ? Math.round(c.getBoundingClientRect().height) : 0
      };
    });
    juger('S6a · la démonstration animée est présente, avec ses six scènes',
      demo.presente && demo.scenes === 6 && demo.puces === 6 && demo.hauteur > 150,
      demo.presente ? (demo.scenes + ' scène(s), ' + demo.puces + ' puce(s), '
        + demo.hauteur + ' px de haut') : 'aucun bloc .vrt-demo');

    const attendus = ['connecter', 'leçon', 'épreuve', 'plusieurs', 'valider', 'exporter'];
    const tout = demo.titres.join(' ').toLowerCase();
    const manquants = attendus.filter(a => tout.indexOf(a) < 0);
    juger('S6b · elle nomme les six gestes annoncés',
      manquants.length === 0, manquants.length
        ? 'manque : ' + manquants.join(', ') + ' — vu : ' + demo.titres.join(' / ')
        : demo.titres.join(' / '));

    /* Le corpus repond 401 sur ce mode : la demonstration doit s'afficher
       QUAND MEME. C'est tout l'interet de ne l'avoir liee a aucune donnee. */
    const e = await ecran(page);
    juger('S6c · elle s’affiche sans compte et sans répertoire',
      e.nom === 'connexion' && demo.presente,
      e.nom + ' — démonstration ' + (demo.presente ? 'présente' : 'ABSENTE'));

    /* Une liste vide accusait LES FILTRES, quelle que soit la raison. Sur une
       base absente, ce message envoie chercher au mauvais endroit. */
    await page.evaluate(() => { try { localStorage.setItem('minesec_intro_vue', 'true'); } catch (e) {} });
    await page.goto(APP + '#liste', { waitUntil: 'domcontentloaded' });
    await dodo(1500);
    const liste = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
    juger('S6e · la liste vide n’accuse pas « ces filtres »',
      !/ne correspond à ces filtres/.test(liste), liste.slice(0, 160));

    juger('S6d · aucune erreur JS sur l’écran de connexion',
      erreurs.length === 0, erreurs.join(' | '));
    await ctx.close();
  }

  /* --- S7 : le TELEPHONE ---------------------------------------------
     Mesures du 21/08 sur un gabarit de 390 px, avant correction : les quatre
     cartes de tete occupaient 860 px (une par ligne), les six filtres du
     corpus 600 px avant le premier texte, et la barre du haut debordait de
     25 px — l'avatar etait coupe sur toutes les captures. Emulation CDP et
     non fenetre redimensionnee : sous Windows, le mode sans interface
     plafonne a ~500 px et mesurerait un faux debordement. */
  {
    await fetch(BASE + '/__mode?m=ok&raz=1');
    const ctxm = await nav.newContext({ viewport:{width:390,height:844}, isMobile:true,
      hasTouch:true, deviceScaleFactor:2 });
    const page = await ctxm.newPage();
    await page.addInitScript(()=>{try{localStorage.clear();
      localStorage.setItem('minesec_intro_vue','true');}catch(e){}});
    await page.goto(APP, { waitUntil:'domcontentloaded' });
    const e = await attendre(page, 'application', 30000);
    juger('S7a · l’application s’ouvre sur un gabarit de téléphone',
      e.nom === 'application', e.nom);
    const large = await page.evaluate(()=>({doc:document.documentElement.scrollWidth,
      vue:document.documentElement.clientWidth}));
    juger('S7b · rien ne déborde en largeur',
      large.doc <= large.vue + 1, 'document '+large.doc+' px pour une vue de '+large.vue+' px');
    const cols = await page.evaluate(()=>{const g=document.querySelector('.vrt-stats');
      return g ? getComputedStyle(g).gridTemplateColumns.split(' ').length : 0;});
    juger('S7c · les cartes de tête tiennent sur deux colonnes',
      cols === 2, cols + ' colonne(s)');
    await page.evaluate(()=>{const b=document.querySelector('.vrt-mobilebar');
      if(b) b.querySelectorAll('button')[1].click();});
    await dodo(1500);
    const filtres = await page.evaluate(()=>{
      const v=[...document.querySelectorAll('aside select')]
        .filter(x=>x.getBoundingClientRect().height>0).length;
      const b=document.querySelector('.vrt-only-sm');
      return {visibles:v, bouton:b?getComputedStyle(b).display:'(absent)'};});
    juger('S7d · les filtres du corpus sont repliés, derrière un bouton',
      filtres.visibles === 0 && filtres.bouton !== 'none' && filtres.bouton !== '(absent)',
      JSON.stringify(filtres));
    /* S7f — LA PLANCHE DE TRAVAIL.
       C'est la mesure de ce que Jacques appelait « touffu et peu
       exploitable » : combien de pixels d'accessoires precedent la premiere
       ligne du texte qu'on est venu ecrire. Sur un telephone de 812 px de
       haut, tout ce qui depasse un ecran entier oblige a chercher son propre
       travail. Mesure du 25/08 avant repli : 1 085 px. */
    await page.evaluate(()=>{const b=[...document.querySelectorAll('button')]
      .find(x=>/^Épreuves$/.test((x.innerText||'').trim()));if(b)b.click();});
    await dodo(900);
    await page.evaluate(()=>{const b=[...document.querySelectorAll('button')]
      .find(x=>/^(Ouvrir|Consulter)$/.test((x.innerText||'').trim()));if(b)b.click();});
    await dodo(2000);
    const planche = await page.evaluate(()=>{
      const a=document.querySelector('[id^="vrt-txt-"]');
      if(!a) return {y:-1, page:document.documentElement.scrollHeight};
      const r=a.getBoundingClientRect();
      return {y:Math.round(r.top+window.scrollY),
              page:document.documentElement.scrollHeight,
              deborde:document.documentElement.scrollWidth
                     >document.documentElement.clientWidth+1};});
    juger('S7f · la planche de travail est atteignable sur téléphone',
      planche.y >= 0 && planche.y <= 900 && !planche.deborde,
      planche.y < 0 ? 'aucun texte ancré dans le composeur'
        : 'texte à ' + planche.y + ' px du haut (page ' + planche.page + ' px)'
          + (planche.deborde ? ' — DÉBORDE en largeur' : ''));

    /* S7g — les volets du composeur sont bien replies sur telephone, et
       leurs boutons ATTEIGNABLES. Un volet replie dont le bouton est masque
       n'est pas replie : il a disparu. */
    const volets = await page.evaluate(()=>{
      const b=[...document.querySelectorAll('button.vrt-only-sm')]
        .filter(x=>x.getBoundingClientRect().height>0)
        .map(x=>(x.innerText||'').trim());
      const ouverts=[...document.querySelectorAll('.vrt-repli-corps')]
        .filter(x=>getComputedStyle(x).display!=='none').length;
      return {boutons:b, ouverts:ouverts};});
    juger('S7g · les volets du composeur sont repliés, boutons atteignables',
      volets.boutons.length >= 3,
      volets.boutons.length + ' bouton(s) visible(s) : ' + volets.boutons.join(' · '));

    await ctxm.close();

    /* Le repli est une mesure de TELEPHONE : il ne doit pas fuir sur un
       ecran de bureau, ou la colonne de filtres est le mode de travail. */
    const ctxd = await nav.newContext({ viewport:{width:1440,height:900} });
    const pd = await ctxd.newPage();
    await pd.addInitScript(()=>{try{localStorage.clear();
      localStorage.setItem('minesec_intro_vue','true');}catch(e){}});
    await pd.goto(APP, { waitUntil:'domcontentloaded' });
    await attendre(pd, 'application', 30000);
    await pd.evaluate(()=>{const b=[...document.querySelectorAll('button')]
      .find(x=>/^Corpus/.test((x.innerText||'').trim()));if(b)b.click();});
    await dodo(1500);
    const bureau = await pd.evaluate(()=>{
      const v=[...document.querySelectorAll('aside select')]
        .filter(x=>x.getBoundingClientRect().height>0).length;
      const b=document.querySelector('.vrt-only-sm');
      return {visibles:v, bouton:b?getComputedStyle(b).display:'(absent)'};});
    juger('S7e · sur grand écran les filtres restent dépliés',
      /* Un fichier sans repli du tout satisfait aussi cette regle : ce
         controle garde le BUREAU, il n'exige pas le repli mobile. */
      bureau.visibles === 6 && bureau.bouton !== 'block', JSON.stringify(bureau));
    await ctxd.close();
  }

  await nav.close();
  const ko = resultats.filter(r => !r.ok).length;
  console.log('\n' + (resultats.length - ko) + '/' + resultats.length + ' contrôles passés');
  process.exit(ko ? 1 : 0);
})().catch(e => { console.error('sonde en panne :', e); process.exit(2); });
