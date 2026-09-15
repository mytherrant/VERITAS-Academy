#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_code_ami_cahiers.cjs — LE CODE AMI VAUT AUSSI SUR LES CAHIERS
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_code_ami_cahiers.cjs

   ─── CE QU'IL PROTÈGE, ET POURQUOI IL EXISTE ────────────────────────────────

   Le 14/09/2026, le Code ami est arrivé côté serveur : −10 % pour le filleul,
   10 % pour le parrain, sur `intent: 'livret'` comme sur les abonnements. Le
   formulaire d'inscription l'annonce noir sur blanc — « Code ami (facultatif)
   — −10 % sur vos abonnements ET ACHATS ».

   Il ne valait pourtant sur AUCUN des quinze cahiers. `api/payment_camerpay.php`
   n'évalue le parrainage que si la requête d'initiation porte la clé `code` —
   une garde délibérée, pour qu'un parrain ne soit jamais rémunéré sur un achat
   où le filleul n'a pas vu sa remise. `livrets/gate.js`, lui, ne l'envoyait
   jamais. La promesse était donc fausse sur la surface la plus achetée du site,
   et rien ne l'aurait dit : le paiement aboutissait, au plein tarif.

   ─── LE PIÈGE QUE CE BANC GARDE VRAIMENT ────────────────────────────────────

   Brancher un champ de remise est facile ; le brancher SANS créer deux vérités
   de prix ne l'est pas. Le tunnel des cahiers a déjà payé cette leçon : les
   quatre cahiers d'œuvres du collège valent 1 000 F, et leur écran annonçait
   « 1 500 FCFA » pour un débit de 1 000 — ni l'un ni l'autre chiffre n'était
   faux tout seul, c'est leur ÉCART qui l'était, sur le seul écran où quelqu'un
   sort de l'argent.

   Ici l'écart serait pire, car le serveur tranche : un montant réduit sans code
   valide est refusé (409 PRIX_INCOHERENT), et un montant plein avec un code
   valide rémunère le parrain sur un rabais que personne n'a reçu.

   Ce banc mesure donc UN SEUL invariant, sous quatre angles :

       le prix affiché = le libellé du bouton = le montant envoyé au débit

   ─── DEUX ÉTAGES, ET LE SECOND PEUT MANQUER ─────────────────────────────────
   ① lit les fichiers : tourne partout, CI comprise, garde la porte du
     déploiement. ② pilote un vrai navigateur (Playwright) et LIT LE CORPS
     réellement envoyé à `?action=init` — la seule preuve qui compte, puisque
     c'est ce corps, et lui seul, qui décide de ce qui est débité.

   ─── POUR LE FAIRE ROUGIR (un banc vert n'est une preuve qu'après) ──────────
   Dans `livrets/gate.js` :
     · remplacer `if (n <= 1 && codeAmiPose()) corps.code = codeAmi.code;`
       par `corps.code = codeAmi.code || '';`          → ⑤ et ⑦ rougissent
     · remplacer `aPayer = codeAmi.montant;` par
       `aPayer = Math.round(aPayer * 0.9);`            → ⑥ rougit (prix deviné)
     · retirer le garde-fou `plein !== codeAmi.base` de `majPrix`
                                                       → ① rougit
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

let chromium = null;
try { ({ chromium } = require('playwright')); } catch (e) { /* étage 2 indisponible */ }

const RACINE = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT_BANC_CA || 3178);
const BASE = `http://localhost:${PORT}`;
const PAGE = `${BASE}/livrets/cahier.html?o=6e`;

const G = '\x1b[32m', R = '\x1b[0m', Rg = '\x1b[31m';
let ok = 0, ko = 0;
function dire(cond, titre, detail) {
  if (cond) { ok++; console.log(`  ${G}✓${R} ${titre}`); }
  else { ko++; console.log(`  ${Rg}✗${R} ${titre}${detail ? '\n      ' + detail : ''}`); }
}

const gate = fs.readFileSync(path.join(RACINE, 'livrets', 'gate.js'), 'utf8');
const lib = fs.readFileSync(path.join(RACINE, 'api', '_parrainage_lib.php'), 'utf8');
const pay = fs.readFileSync(path.join(RACINE, 'api', 'payment_camerpay.php'), 'utf8');

console.log(`\n${G}① Le contrat entre la porte des cahiers et le serveur${R}`);

/* L'URL est assemblée (`PARR + '?action=verifier'`) : on vérifie les deux
   moitiés, pas une chaîne littérale qui n'existe nulle part dans le fichier. */
dire(/PARR\s*=\s*'\/api\/parrainage\.php'/.test(gate) && /PARR\s*\+\s*'\?action=verifier'/.test(gate),
  'gate.js demande au serveur ce qu\'il honorerait (?action=verifier)',
  'aucun appel à parrainage.php : la remise serait devinée dans le navigateur');

dire(/intent:\s*'livret'/.test(gate),
  'et il le demande sous l\'intent « livret », celui que le serveur reconnaît');

/* La clé ne doit PAS être posée inconditionnellement : sa seule présence
   déclenche l'évaluation côté serveur (array_key_exists), MÊME VIDE. On lit
   donc le littéral `var corps = { … }` envoyé au débit et on exige qu'il n'y
   ait aucune clé `code` dedans — elle ne s'ajoute qu'après, sous condition. */
const litt = /var corps = \{[\s\S]*?\n\s{8}\};/.exec(gate);
dire(!!litt && !/(^|[{,]\s*)code\s*:/.test(litt[0])
  && /if\s*\(n\s*<=\s*1\s*&&\s*codeAmiPose\(\)\)\s*corps\.code\s*=/.test(gate),
  'la clé `code` n\'est ajoutée au débit que si une remise est AFFICHÉE',
  'une clé `code` inconditionnelle ferait appliquer un lien que la page ignore');

dire(/array_key_exists\('code',\s*\$input\)/.test(pay),
  'et le serveur, lui, n\'évalue le parrainage que sur présence de cette clé');

const elig = /function vrt_parr_intent_eligible[\s\S]{0,400}?\n\s{4}\}/.exec(lib);
const eligTxt = elig ? elig[0] : '';
dire(eligTxt !== '' && !/'livret'\s*,/.test(eligTxt.replace(/'livret_pack'/g, '')),
  '« livret » est éligible au code ami côté serveur',
  'l\'intent est banni : la remise serait refusée après affichage');
dire(/'livret_pack'/.test(eligTxt),
  '… et « livret_pack » ne l\'est pas — un pack a déjà ses paliers de volume');

dire(/codeAmi\.base\s*!==\s*aPayer/.test(gate) && /plein\s*!==\s*codeAmi\.base/.test(gate),
  'une remise validée ne survit pas à un tarif qui bouge sous elle',
  'sans ce garde-fou, le montant envoyé ne serait plus celui qui a été validé');

dire(/localStorage\.setItem\('vrt_code_ami'/.test(gate) && /sessionStorage\.getItem\('_vrtRef'\)/.test(gate),
  'le code voyage entre les cahiers et l\'application (mêmes clés qu\'app.js)');

// ══════════════════════════════════════════════════════════════════════════
// ② LE CORPS RÉELLEMENT ENVOYÉ AU DÉBIT
// ══════════════════════════════════════════════════════════════════════════
(async () => {
  if (!chromium) {
    console.log(`\n${G}②${R} NON EXÉCUTÉE : playwright absent de cette machine.`);
    console.log('    Les contrôles ① gardent la porte du déploiement ; ② mesure');
    console.log('    le corps réellement envoyé à ?action=init. Pour les jouer :');
    console.log('    npm i -D playwright');
    console.log(`\n${ok} contrôle(s) au vert, ${ko} au rouge.\n`);
    process.exit(ko === 0 ? 0 : 1);
  }

  const PRIX_PLEIN = 1500;
  /* 137, PAS 150. Une remise ronde de 10 % serait reproductible par un calcul
     local : le banc ne saurait plus distinguer « le client affiche ce que le
     serveur a dit » de « le client a deviné la même chose ». Un chiffre que
     rien ne permet de deviner rend la triche visible. */
  const REMISE = 137;
  const MONTANT_REMISE = PRIX_PLEIN - REMISE;

  const serveur = spawn(process.execPath,
    [path.join(RACINE, 'tests', 'mock_livrets.cjs'), String(PORT)],
    { cwd: RACINE, stdio: 'ignore' });
  const nav = await chromium.launch();
  let sortie = 1;

  try {
    const ctx = await nav.newContext();
    // Le tunnel pré-ouvre un onglet vide (contournement des bloqueurs de
    // fenêtres). On le laisse vivre : le fermer ferait diverger le parcours.
    const page = await ctx.newPage();

    let dernierInit = null;            // le corps envoyé au débit
    let reponseVerif = null;           // ce que le serveur répond au code

    await page.route('**/api/livret.php*', async (route) => {
      const req = route.request();
      let corps = {};
      try { corps = JSON.parse(req.postData() || '{}'); } catch (e) {}
      if (corps.action !== 'catalogue') return route.continue();
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          ouvrages: [{ slug: '6e', prix: PRIX_PLEIN, prixGuide: 5000 }],
          paliers: [[50, 20], [25, 15], [10, 10]]
        })
      });
    });

    await page.route('**/payment_camerpay.php*', async (route) => {
      const u = new URL(route.request().url());
      if (u.searchParams.get('action') === 'config') {
        return route.fulfill({
          status: 200, contentType: 'application/json',
          body: JSON.stringify({ ok: true, selfService: true, publicInitToken: 'tok-banc', file: 'payment_camerpay.php' })
        });
      }
      if (u.searchParams.get('action') === 'init') {
        try { dernierInit = JSON.parse(route.request().postData() || '{}'); } catch (e) { dernierInit = null; }
        // Pas de pay_url : le tunnel n'ouvre alors aucune page de paiement.
        return route.fulfill({
          status: 200, contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
      return route.continue();
    });

    await page.route('**/parrainage.php*', async (route) => {
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify(reponseVerif || { ok: false, message: 'Code inconnu, épuisé ou expiré.' })
      });
    });

    for (let i = 0; i < 40; i++) {
      try { await page.goto(PAGE, { timeout: 1000, waitUntil: 'domcontentloaded' }); break; }
      catch (e) { await page.waitForTimeout(250); }
    }

    /* Rouvrir proprement le tunnel entre deux mesures : le stockage garde le
       code d'un essai à l'autre, et l'auto-application le ressortirait. */
    const ouvrir = async (n) => {
      await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => { try { localStorage.clear(); sessionStorage.clear(); } catch (e) {} });
      await page.waitForFunction(() => !!window.VRTLivret, { timeout: 5000 });
      await page.evaluate((q) => {
        window.VRTLivret.config({ classe: '6e', kind: 'livret', titre: 'Banc' });
        window.VRTLivret.acheter({ n: q });
      }, n || 1);
      await page.waitForSelector('#vrt-go', { timeout: 5000 });
      // La sonde des tarifs répond après l'ouverture : on attend le prix ferme.
      await page.waitForFunction((p) => {
        const b = document.getElementById('vrt-go');
        return b && b.textContent.indexOf(String(p)) !== -1;
      }, PRIX_PLEIN, { timeout: 5000 }).catch(() => {});
      dernierInit = null;
    };

    const payer = async () => {
      await page.fill('#vrt-tel', '697637739');
      await page.click('#vrt-go');
      await page.waitForFunction(() => window.__initVu === true, { timeout: 5000 })
        .catch(() => {});
      // Le corps est capté par la route ; on laisse la chaîne se dérouler.
      for (let i = 0; i < 40 && dernierInit === null; i++) await page.waitForTimeout(100);
      return dernierInit;
    };

    const affiche = () => page.evaluate(() => {
      const p = document.querySelector('#vrt-achat .vrt-prix');
      const b = document.getElementById('vrt-go');
      return {
        prix: p ? p.textContent.replace(/\s| /g, '') : '',
        bouton: b ? b.textContent.replace(/\s| /g, '') : '',
        ca: (document.getElementById('vrt-ca-msg') || {}).textContent || ''
      };
    });

    console.log(`\n${G}⑤ Sans code : rien ne change, et la clé n'est pas envoyée${R}`);
    {
      reponseVerif = null;
      await ouvrir(1);
      const corps = await payer();
      dire(!!corps, 'le tunnel initie bien un paiement', 'aucun corps capté');
      dire(!!corps && corps.montant === PRIX_PLEIN,
        `le montant envoyé est le plein tarif (${PRIX_PLEIN})`,
        'montant envoyé : ' + (corps && corps.montant));
      dire(!!corps && !('code' in corps),
        'et la clé `code` est ABSENTE — le serveur n\'applique aucun lien caché',
        'clés envoyées : ' + (corps ? Object.keys(corps).join(',') : '—'));
    }

    console.log(`\n${G}⑥ Code accepté : un seul chiffre, du serveur jusqu'au débit${R}`);
    {
      reponseVerif = {
        ok: true, code: 'VRTBANC1', remisePct: 10, remise: REMISE,
        prix: PRIX_PLEIN, montant: MONTANT_REMISE, parrain: 'Awa T.', message: ''
      };
      await ouvrir(1);
      await page.fill('#vrt-ca', 'vrtbanc1');
      await page.click('#vrt-ca-go');
      await page.waitForFunction(() => /appliqué/.test(
        (document.getElementById('vrt-ca-msg') || {}).textContent || ''), { timeout: 5000 }).catch(() => {});
      const vu = await affiche();
      dire(vu.prix.indexOf(String(MONTANT_REMISE)) !== -1,
        `le prix affiché devient celui du serveur (${MONTANT_REMISE})`, 'affiché : ' + vu.prix);
      dire(vu.prix.indexOf(String(PRIX_PLEIN)) !== -1,
        'le plein tarif reste lisible à côté — une remise se compare', 'affiché : ' + vu.prix);
      dire(vu.bouton.indexOf(String(MONTANT_REMISE)) !== -1,
        'le bouton « Payer » porte le MÊME chiffre', 'bouton : ' + vu.bouton);
      const corps = await payer();
      dire(!!corps && corps.montant === MONTANT_REMISE,
        'et c\'est ce chiffre-là qui part au débit — pas un prix recalculé ici',
        'montant envoyé : ' + (corps && corps.montant));
      dire(!!corps && corps.code === 'VRTBANC1',
        'le code qui a produit la remise accompagne le paiement',
        'code envoyé : ' + (corps && corps.code));
    }

    console.log(`\n${G}⑦ Ce qui rendrait la remise fausse la retire${R}`);
    {
      reponseVerif = {
        ok: true, code: 'VRTBANC1', remisePct: 10, remise: REMISE,
        prix: PRIX_PLEIN, montant: MONTANT_REMISE, parrain: '', message: ''
      };
      await ouvrir(1);
      await page.fill('#vrt-ca', 'VRTBANC1');
      await page.click('#vrt-ca-go');
      await page.waitForFunction(() => /appliqué/.test(
        (document.getElementById('vrt-ca-msg') || {}).textContent || ''), { timeout: 5000 }).catch(() => {});

      // Passage en pack : le serveur refuse d'y cumuler un code.
      await page.fill('#vrt-n', '12');
      await page.dispatchEvent('#vrt-n', 'input');
      await page.waitForTimeout(150);
      const vu = await affiche();
      dire(vu.prix.indexOf(String(MONTANT_REMISE)) === -1,
        'porté à 12 codes, l\'écran cesse d\'annoncer la remise d\'un seul',
        'affiché : ' + vu.prix);
      const cache = await page.evaluate(() =>
        getComputedStyle(document.getElementById('vrt-ca-bloc')).display);
      dire(cache === 'none',
        'et le champ disparaît, au lieu de promettre ce qui ne peut pas aboutir',
        'display du bloc : ' + cache);
      const corps = await payer();
      dire(!!corps && !('code' in corps),
        'le débit d\'un pack part SANS clé `code`',
        'clés envoyées : ' + (corps ? Object.keys(corps).join(',') : '—'));
      dire(!!corps && corps.intent === 'livret_pack',
        'sous l\'intent « livret_pack », celui des paliers de volume',
        'intent : ' + (corps && corps.intent));
    }

    console.log(`\n${G}⑧ Code refusé : le prix ne bouge pas d'un franc${R}`);
    {
      reponseVerif = { ok: false, message: 'Code inconnu, épuisé ou expiré.' };
      await ouvrir(1);
      await page.fill('#vrt-ca', 'VRTFAUX0');
      await page.click('#vrt-ca-go');
      await page.waitForFunction(() => /inconnu|refus|expir/i.test(
        (document.getElementById('vrt-ca-msg') || {}).textContent || ''), { timeout: 5000 }).catch(() => {});
      const vu = await affiche();
      dire(vu.bouton.indexOf(String(PRIX_PLEIN)) !== -1,
        'le bouton reste au plein tarif', 'bouton : ' + vu.bouton);
      dire(/inconnu|refus|expir/i.test(vu.ca),
        'et l\'acheteur lit POURQUOI, au lieu d\'un silence', 'message : ' + vu.ca);
      const corps = await payer();
      dire(!!corps && corps.montant === PRIX_PLEIN && !('code' in corps),
        'le débit part au plein tarif, sans clé `code`',
        'montant : ' + (corps && corps.montant) + ' clés : ' + (corps ? Object.keys(corps).join(',') : '—'));
    }

    sortie = ko === 0 ? 0 : 1;
  } catch (e) {
    console.log(`  ${Rg}✗${R} étage ② interrompu : ${e.message}`);
    ko++;
    sortie = 1;
  } finally {
    await nav.close().catch(() => {});
    try { serveur.kill(); } catch (e) {}
  }

  console.log(`\n${ok} contrôle(s) au vert, ${ko} au rouge.\n`);
  process.exit(sortie);
})();
