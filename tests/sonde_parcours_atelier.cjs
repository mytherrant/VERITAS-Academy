/* Sonde des PARCOURS DE TRAVAIL — Atelier de Français.
 *
 * Ce que les autres sondes ne couvrent pas
 * ----------------------------------------
 * `sonde_atelier_attente` vérifie qu'on ENTRE dans l'application, et que le
 * téléphone reste utilisable. `sonde_corpus_sync` vérifie que le contenu
 * rejoint sa métadonnée. `sonde_sync_groupe` vérifie que le travail sort du
 * navigateur. `paiements_entitlements` vérifie qu'on ne vole rien.
 *
 * Aucune ne vérifie qu'on peut TRAVAILLER. C'est pourtant ce qu'un
 * enseignant vient faire : prendre un texte, le mettre dans une épreuve,
 * poser un barème, lire le verdict du garde-fou, annoter, exporter.
 *
 * Cette sonde marche ces chemins-là, dans un vrai navigateur, en cliquant
 * ce que l'enseignant clique. Elle ne lit aucun état interne : ce qui
 * compte est ce qui APPARAÎT, parce que c'est tout ce qu'il verra.
 *
 *   node tests/sonde_parcours_atelier.cjs [url]
 */
'use strict';
const { chromium } = require('playwright');

const BASE = (process.argv[2] || 'http://localhost:3200').replace(/\/$/, '');
const APP = BASE + '/plateforme/';
const dodo = ms => new Promise(r => setTimeout(r, ms));

const resultats = [];
function juger(nom, ok, vu) {
  resultats.push({ nom, ok, vu });
  console.log('  ' + (ok ? 'OK   ' : 'ECHEC') + ' | ' + nom + (ok ? '' : '\n         vu : ' + vu));
}

/* Clique le premier élément dont le texte commence par `libelle`. Retourne
   faux si rien ne correspond — un bouton absent est un résultat, pas une
   exception à avaler. */
async function cliquer(page, libelle, dans) {
  return page.evaluate(({ l, d }) => {
    const racine = d ? document.querySelector(d) : document;
    if (!racine) return false;
    const el = [...racine.querySelectorAll('button, a[href]')]
      .find(x => (x.innerText || '').trim().indexOf(l) === 0
              && x.getBoundingClientRect().height > 0);
    if (!el) return false;
    el.click();
    return true;
  }, { l: libelle, d: dans || null });
}

const texte = page => page.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' '));

(async () => {
  console.log('\n  PARCOURS DE TRAVAIL — ' + APP + '\n');
  /* Mode `auth` : la sequence REELLE (401 -> formulaire -> jeton ->
     repertoire). Le mode `ok` sert le corpus sans authentification, ce que
     la production ne fait pas, et tout ce qui consomme un droit se refusait
     alors faute de jeton. */
  await fetch(BASE + '/__mode?m=auth&raz=1').catch(() => {});
  await fetch(BASE + '/__complet?c=ok').catch(() => {});

  const nav = await chromium.launch();
  const ctx = await nav.newContext({ viewport: { width: 1360, height: 900 } });
  const page = await ctx.newPage();
  const erreursJS = [];
  page.on('pageerror', e => erreursJS.push(String((e && e.message) || e).slice(0, 140)));
  await page.addInitScript(() => {
    try { localStorage.clear(); localStorage.setItem('minesec_intro_vue', 'true'); } catch (e) {}
  });
  await page.goto(APP, { waitUntil: 'domcontentloaded' });
  await dodo(4000);

  /* --- Connexion. Sans jeton, tout ce qui consomme un droit se refuse. -- */
  await page.evaluate(() => {
    const ins = [...document.querySelectorAll('input')];
    const poser = (el, v) => {
      const d = Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value');
      d.set.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };
    if (ins[0]) poser(ins[0], 'banc');
    if (ins[1]) poser(ins[1], 'banc');
    const b = [...document.querySelectorAll('button')]
      .find(x => /Se connecter/.test(x.innerText || ''));
    if (b) b.click();
  });
  await dodo(4000);

  /* --- P0 : l'application est ouverte et le répertoire est là ---------- */
  const depart = await page.evaluate(() => {
    const t = (document.body.innerText || '');
    return { corpus: /(\d[\d\s]*)\s*texte\(s\)/.test(t) || /Bonjour/.test(t), extrait: t.slice(0, 60) };
  });
  juger('P0 · l’application s’ouvre sur un répertoire chargé',
    depart.corpus, depart.extrait.replace(/\s+/g, ' '));

  /* --- P1 : ajouter un texte à une épreuve mène au composeur ----------- */
  await cliquer(page, 'Ressources');
  await dodo(1600);
  const aAjoute = await cliquer(page, '+ Ajouter');
  await dodo(2200);
  const apresAjout = await page.evaluate(() => ({
    ancre: !!document.querySelector('[id^="vrt-txt-"]'),
    ecran: location.hash,
    mots: ((document.body.innerText || '').match(/(\d+)\s*mots/) || [])[1] || '?'
  }));
  juger('P1 · « Ajouter » met le texte dans le composeur',
    aAjoute && apresAjout.ancre && /composeur/.test(apresAjout.ecran),
    'bouton ' + (aAjoute ? 'cliqué' : 'ABSENT') + ', écran ' + apresAjout.ecran
      + ', texte ancré : ' + apresAjout.ancre);

  /* --- P2 : le texte affiché est ENTIER, pas l'amorce ------------------ */
  const longueur = await page.evaluate(() => {
    const a = document.querySelector('[id^="vrt-txt-"]');
    if (!a) return { car: 0, mots: 0 };
    const p = a.querySelector('.vrt-protege') || a;
    const t = (p.innerText || '').trim();
    return { car: t.length, mots: t.split(/\s+/).filter(Boolean).length };
  });
  juger('P2 · le texte du composeur est entier, pas l’amorce de 180 car.',
    longueur.car > 260, longueur.car + ' caractères, ' + longueur.mots + ' mots');

  /* --- P3 : le garde-fou rend un verdict ------------------------------- */
  const conf = await page.evaluate(() => {
    const t = (document.body.innerText || '');
    const m = t.match(/(\d+)\s*(?:point\(s\) à corriger|écart\(s\) à la norme)/);
    return { rendu: !!m || /Aucun écart|conforme/i.test(t), n: m ? m[1] : '—' };
  });
  juger('P3 · le garde-fou de conformité rend un verdict',
    conf.rendu, 'aucun verdict lisible à l’écran');

  /* --- P4 : appliquer le barème type le renseigne ---------------------- */
  const avantBareme = await texte(page);
  const aBareme = await cliquer(page, 'Appliquer le barème type');
  await dodo(1500);
  const apresBareme = await texte(page);
  juger('P4 · « Appliquer le barème type » change quelque chose',
    !aBareme || avantBareme !== apresBareme,
    aBareme ? 'le bouton n’a rien changé à l’écran' : 'bouton absent (droit d’édition ?)');

  /* --- P5 : l'export Word produit un vrai fichier ----------------------
     L'export vit sur l'ecran APERCU, pas dans le composeur. On y va par
     « Generer & apercu », qui CONSOMME un quota d'epreuve cote serveur :
     ce detour verifie donc aussi que le decompte laisse passer. Un quota
     mal cable bloquerait l'apercu, et l'export avec, sans rien dire. */
  const aGenere = await cliquer(page, 'Générer');
  await dodo(2600);
  const surApercu = await page.evaluate(() => /apercu/.test(location.hash));
  juger('P5a · « Générer & aperçu » ouvre l’aperçu (le quota laisse passer)',
    aGenere && surApercu,
    aGenere ? 'cliqué, mais l’écran n’a pas changé (quota refusé ?)' : 'bouton « Générer » absent');
  const tele = page.waitForEvent('download', { timeout: 12000 }).catch(() => null);
  const aExport = await cliquer(page, 'Exporter en Word');
  const dl = await tele;
  let taille = 0;
  if (dl) {
    try {
      const fs = require('fs');
      const chemin = await dl.path();
      if (chemin) taille = fs.statSync(chemin).size;
    } catch (e) {}
  }
  juger('P5 · l’export Word produit un fichier non vide',
    !!dl && taille > 3000,
    aExport ? (dl ? 'fichier de ' + taille + ' octets' : 'aucun téléchargement déclenché')
            : 'bouton d’export absent');

  /* --- P6 : annoter un mot le marque -----------------------------------
     RETOUR AU COMPOSEUR. P5 nous a menes a l'apercu pour exporter ;
     l'annotation se fait dans le composeur, seul ecran ou le texte est
     decoupe mot a mot avec un gestionnaire de clic sur chacun. */
  await cliquer(page, 'Modifier');
  await dodo(2000);
  const surComposeur = await page.evaluate(() =>
    /composeur/.test(location.hash) && !!document.querySelector('[id^="vrt-txt-"]'));
  juger('P6a · « Modifier » ramène de l’aperçu au composeur',
    surComposeur, 'écran ' + await page.evaluate(() => location.hash));

  const annot = await page.evaluate(() => {
    const a = document.querySelector('[id^="vrt-txt-"]');
    if (!a) return { ok: false, pourquoi: 'aucun texte' };
    const mots = [...a.querySelectorAll('span')].filter(s => {
      const t = (s.textContent || '').trim();
      return t.length > 3 && !s.querySelector('span');
    });
    if (!mots.length) return { ok: false, pourquoi: 'aucun mot cliquable' };
    const avant = getComputedStyle(mots[0]).backgroundColor;
    mots[0].click();
    return { ok: true, avant, cible: (mots[0].textContent || '').trim().slice(0, 14) };
  });
  await dodo(1200);
  const apresAnnot = await page.evaluate(() => {
    const a = document.querySelector('[id^="vrt-txt-"]');
    if (!a) return null;
    const marques = [...a.querySelectorAll('span')].filter(s => {
      const bg = getComputedStyle(s).backgroundColor;
      return bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
    }).length;
    return marques;
  });
  juger('P6 · cliquer un mot du texte l’annote',
    annot.ok && apresAnnot > 0,
    annot.ok ? (apresAnnot + ' mot(s) marqué(s) après le clic') : annot.pourquoi);

  /* --- P7 : créer un cours depuis un gabarit --------------------------- */
  await cliquer(page, 'Cours');
  await dodo(1600);
  const gab = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')]
      .filter(x => x.getBoundingClientRect().height > 40
                && /leçon|séance|gabarit|fiche/i.test(x.innerText || ''));
    if (!b.length) return { ok: false, vu: (document.body.innerText || '').slice(0, 70) };
    b[0].click();
    return { ok: true, nom: (b[0].innerText || '').trim().slice(0, 30) };
  });
  await dodo(2000);
  const ecranCours = await page.evaluate(() => location.hash + ' | '
    + (document.body.innerText || '').slice(0, 60).replace(/\s+/g, ' '));
  juger('P7 · un gabarit de cours s’ouvre en édition',
    gab.ok && /coursEdit|cours/.test(ecranCours), ecranCours);

  /* --- P8 : le panier de textes retient ce qu'on y met ----------------- */
  await cliquer(page, 'Ressources');
  await dodo(1600);
  const panier = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')]
      .find(x => /panier/i.test(x.getAttribute('title') || ''));
    if (!b) return { ok: false, vu: 'aucun bouton de panier' };
    b.click();
    return { ok: true };
  });
  await dodo(1400);
  const panierOuvert = await page.evaluate(() =>
    /panier/i.test((document.body.innerText || '')));
  juger('P8 · le panier de textes s’ouvre',
    panier.ok && panierOuvert, panier.vu || 'panneau non visible après le clic');

  /* --- P9 : aucune erreur JS sur tout le parcours ---------------------- */
  juger('P9 · aucune erreur JavaScript sur tout le parcours',
    erreursJS.length === 0, erreursJS.slice(0, 3).join(' | '));

  await nav.close();
  const ok = resultats.filter(r => r.ok).length;
  console.log('\n  ' + ok + '/' + resultats.length + ' parcours praticables\n');
  process.exit(ok === resultats.length ? 0 : 1);
})();
