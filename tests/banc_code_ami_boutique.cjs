#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_code_ami_boutique.cjs — LE CODE AMI VAUT AUSSI DANS LA BOUTIQUE
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_code_ami_boutique.cjs

   ─── CE QU'IL PROTÈGE ───────────────────────────────────────────────────────

   La boutique de la vitrine vend des manuels PAPIER, livrés ou retirés au
   centre (`intent:'cart'`). Le Code ami n'y valait rien, pour deux raisons :

     · le navigateur n'envoyait pas la clé `code` — or api/payment_camerpay.php
       n'évalue le parrainage que si elle est PRÉSENTE ;
     · le serveur excluait `cart` en bloc — à juste titre pour le panier
       NUMÉRIQUE d'app.js (chaque ligne y est accordée et contrôlée contre
       l'encaissé : une remise globale ferait perdre la dernière), à tort pour
       le panier PHYSIQUE, qui n'ouvre rien.

   Le serveur est gardé par tests/parrainage.php (section 9). Ce banc garde le
   NAVIGATEUR : ce qu'il affiche, et ce qu'il envoie au débit.

   ─── TROIS RÈGLES, MESURÉES SUR LE CORPS RÉELLEMENT ENVOYÉ ─────────────────

     1. le total affiché = le montant débité — et la remise vient du serveur ;
     2. la remise porte sur les ARTICLES, jamais sur la livraison ;
     3. la clé `code` n'accompagne le débit que si une remise est affichée.

   Le bouchon calcule la remise comme 10,37 % arrondis à l'inférieur : un
   chiffre qu'un « 10 % » deviné dans le navigateur ne reproduirait pas.

   ─── POUR LE FAIRE ROUGIR (éprouvé le 16/09/2026, chiffres mesurés) ─────────
   Dans assets/vitrine.js :
     · `if (remiseAmi() > 0) {` → `if (true) {` (clé inconditionnelle)   3 au rouge
     · `return pu ? sousTotalArticles() + fraisLivraison() - remiseAmi() : 0;`
       → `… - Math.round(sousTotalArticles() * 0.1) : 0;` (remise devinée)  7 au rouge
     · `if (c.base !== sousTotalArticles()) return 0;` retiré (périmée)  2 au rouge
     · (19/09) préremplissage `S.saisie.vpCodeAmi = codeAmiRetenu();`
       retiré de m__commander (lien d'un ami ignoré)                    3 au rouge
   Muter par remplacement exact puis par son INVERSE exact, jamais par copie.
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

let chromium = null;
try { ({ chromium } = require('playwright')); } catch (e) { /* étage 2 indisponible */ }

const RACINE = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT_BANC_BOUTIQUE || 3191);
const BASE = `http://localhost:${PORT}`;

const G = '\x1b[32m', R = '\x1b[0m', Rg = '\x1b[31m';
let ok = 0, ko = 0;
function dire(cond, titre, vu) {
  if (cond) { ok++; console.log(`  ${G}✓${R} ${titre}`); }
  else { ko++; console.log(`  ${Rg}✗${R} ${titre}${vu ? '\n      ' + vu : ''}`); }
}

const js = fs.readFileSync(path.join(RACINE, 'assets', 'vitrine.js'), 'utf8');
const lib = fs.readFileSync(path.join(RACINE, 'api', '_parrainage_lib.php'), 'utf8');

console.log(`\n${G}① Le contrat, lu dans les fichiers${R}`);
dire(/liste = liste\.concat\(\[CHAMP_CODE_AMI\]\)/.test(js) && /champ: 'vpCodeAmi'/.test(js),
  'le tunnel porte un champ « Code ami », pour les quatre moyens de paiement');
dire(/parrainage\.php\?action=verifier/.test(js) && /intent: 'cart'/.test(js),
  'la remise est demandée au SERVEUR, sous l’intent « cart »');
dire(/if \(remiseAmi\(\) > 0\) \{\s*corps\.code = S\.codeAmi\.code;/.test(js),
  'la clé `code` n’est ajoutée au débit que si une remise est affichée');
dire(/corps\.assiette = sousTotalArticles\(\) - remiseAmi\(\);/.test(js),
  'l’assiette de la commission part avec le débit : les articles, remise déduite');
dire(/if \(\$intent === 'cart'\) return \$panierPhysique;/.test(lib),
  'côté serveur, seul le panier PHYSIQUE est admis — le numérique reste exclu');

(async () => {
  if (!chromium) {
    console.log(`\n${G}②${R} NON EXÉCUTÉE : playwright absent de cette machine.`);
    console.log(`\n${ok} contrôle(s) au vert, ${ko} au rouge.\n`);
    process.exit(ko === 0 ? 0 : 1);
  }

  const PU = 1500, LIVR_DOUALA = 1000;
  const remiseServeur = (m) => Math.floor(m * 0.1037);   // indevinable côté client

  const serveur = spawn(process.execPath, [path.join(RACINE, 'tests', 'static_server.cjs'), String(PORT)],
    { cwd: RACINE, stdio: 'ignore' });
  const nav = await chromium.launch();
  let sortie = 1;

  try {
    const ctx = await nav.newContext();
    const page = await ctx.newPage();
    page.on('dialog', d => d.dismiss().catch(() => {}));   // alert() d'échec : on ne bloque pas

    let init = null, verifs = [], codeValide = 'VRTBANC1';

    await page.route('**/api/parrainage.php*', async (route) => {
      let c = {}; try { c = JSON.parse(route.request().postData() || '{}'); } catch (e) {}
      verifs.push(c);
      const m = parseInt(c.montant, 10) || 0;
      const corps = (String(c.code || '').toUpperCase() === codeValide)
        ? { ok: true, code: codeValide, remisePct: 10, remise: remiseServeur(m), prix: m,
            montant: m - remiseServeur(m), parrain: 'Awa T.', message: '' }
        : { ok: false, code: '', remise: 0, prix: m, montant: m, message: 'Code inconnu, épuisé ou expiré.' };
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(corps) });
    });
    await page.route('**/api/payment_camerpay.php*', async (route) => {
      const u = new URL(route.request().url());
      if (u.searchParams.get('action') === 'config') {
        return route.fulfill({ status: 200, contentType: 'application/json',
          body: JSON.stringify({ ok: true, canCollect: true, selfService: true,
            publicInitToken: 'tok-banc', file: 'payment_camerpay.php' }) });
      }
      if (u.searchParams.get('action') === 'init') {
        try { init = JSON.parse(route.request().postData() || '{}'); } catch (e) { init = null; }
        return route.fulfill({ status: 201, contentType: 'application/json',
          body: JSON.stringify({ ok: true, pay_url: 'about:blank' }) });
      }
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    for (let i = 0; i < 40; i++) {
      try { await page.goto(BASE + '/vitrine.html', { timeout: 1500, waitUntil: 'domcontentloaded' }); break; }
      catch (e) { await page.waitForTimeout(250); }
    }

    /* Ouvre le tunnel sur 2 cahiers à 1 500 F, livrés à Douala (1 000 F). */
    const ouvrir = async () => {
      await page.goto(BASE + '/vitrine.html', { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => { try { localStorage.clear(); sessionStorage.clear(); } catch (e) {} });
      await page.waitForFunction(() => !!(window.VRT && window.VRT.etat), { timeout: 8000 });
      await page.evaluate(({ PU }) => {
        const S = window.VRT.etat;
        S.article = { id: 'bk-banc', titre: 'Cahier 6e', prix: PU, detail: '', note: '' };
        S.qte = 2;
        S.saisie.vpCodeAmi = '';
        const a = document.createElement('a'); a.setAttribute('data-go', 'paiement');
        window.VRT.act('u__aller', a);
      }, { PU });
      // Choisir la livraison Douala (2e option) : c'est ce clic qui rend le tunnel.
      await page.waitForSelector('[data-vrt-item="optionsLivraison"]', { timeout: 8000 });
      await page.locator('[data-vrt-item="optionsLivraison"]').nth(1).click();
      await page.waitForSelector('#vpCodeAmi', { timeout: 8000 });
      init = null; verifs = [];
    };
    const saisirCode = async (code) => {
      await page.fill('#vpCodeAmi', code);
      await page.waitForTimeout(1200);                      // délai de saisie + réponse
    };
    const payer = async () => {
      await page.fill('#vpNom', 'Banc Boutique');
      await page.fill('#vpTel', '697637739');
      await page.fill('#vpTel2', '697637739');
      await page.evaluate(() => {
        const S = window.VRT.etat;
        S.saisie.vpNom = 'Banc Boutique'; S.saisie.vpTel = '697637739'; S.saisie.vpTel2 = '697637739';
        // Livraison à Douala : verifierSaisie() exige une adresse d'au moins 8 caractères.
        S.saisie.vpAdr = 'Akwa, rue Joss, face pharmacie';
        window.VRT.act('payer', document.body);
      });
      for (let i = 0; i < 50 && init === null; i++) await page.waitForTimeout(100);
      return init;
    };
    const total = () => page.evaluate(() =>
      ((document.querySelector('[data-vrt-val="totalPayer"]') || {}).textContent || '').replace(/\D/g, ''));
    const lignesTotal = () => page.evaluate(() =>
      [...document.querySelectorAll('[data-vrt-item="lignesTotal"]')].map(e => e.textContent.replace(/\s+/g, ' ').trim()));

    console.log(`\n${G}② Sans code : plein tarif, pas de clé${R}`);
    {
      await ouvrir();
      const attendu = PU * 2 + LIVR_DOUALA;
      dire(await total() === String(attendu), `total affiché ${attendu} F`, 'affiché : ' + await total());
      const c = await payer();
      dire(!!c, 'le tunnel initie bien un paiement', 'aucun corps capté');
      dire(!!c && c.montant === attendu && !('code' in c) && !('assiette' in c),
        'débit au plein tarif, sans clé `code` ni assiette',
        'corps : ' + JSON.stringify(c && { montant: c.montant, code: c.code, assiette: c.assiette }));
    }

    console.log(`\n${G}③ Code accepté : remise du serveur, sur les articles seulement${R}`);
    {
      await ouvrir();
      await saisirCode('vrtbanc1');
      const articles = PU * 2, remise = remiseServeur(articles);
      const attendu = articles - remise + LIVR_DOUALA;
      const v = verifs[verifs.length - 1] || {};
      dire(v.montant === articles && v.intent === 'cart',
        `la vérification part sur les ARTICLES (${articles} F), pas sur le total livraison comprise`,
        'envoyé : ' + JSON.stringify(v));
      const ls = await lignesTotal();
      dire(ls.some(l => /Code ami/.test(l) && l.replace(/\D/g, '').endsWith(String(remise))),
        `une ligne « Code ami − ${remise} F » apparaît dans les totaux`, 'lignes : ' + JSON.stringify(ls));
      dire(await total() === String(attendu), `total affiché ${attendu} F (livraison intacte)`,
        'affiché : ' + await total());
      const c = await payer();
      dire(!!c && c.montant === attendu, 'et c’est CE total qui part au débit',
        'montant : ' + (c && c.montant));
      dire(!!c && c.code === 'VRTBANC1', 'avec le code qui a produit la remise', 'code : ' + (c && c.code));
      dire(!!c && c.assiette === articles - remise,
        `l’assiette de la commission exclut la livraison (${articles - remise} F)`,
        'assiette : ' + (c && c.assiette));
    }

    console.log(`\n${G}④ Un exemplaire de plus : la remise suit le serveur, pas l’ancien chiffre${R}`);
    {
      await ouvrir();
      await saisirCode('VRTBANC1');
      await page.evaluate(() => window.VRT.act('ajouterArticle', document.body));
      await page.waitForTimeout(1500);                     // re-vérification automatique
      const articles = PU * 3, remise = remiseServeur(articles);
      const attendu = articles - remise + LIVR_DOUALA;
      const v = verifs[verifs.length - 1] || {};
      dire(v.montant === articles, `le code est re-vérifié sur le NOUVEAU sous-total (${articles} F)`,
        'dernière vérification : ' + JSON.stringify(v));
      const c = await payer();
      dire(!!c && c.montant === attendu,
        `débit ${attendu} F — pas l’ancienne remise appliquée à un autre panier`,
        'montant : ' + (c && c.montant));
    }

    console.log(`\n${G}⑤ Code refusé : rien ne bouge${R}`);
    {
      await ouvrir();
      await saisirCode('VRTFAUX0');
      const attendu = PU * 2 + LIVR_DOUALA;
      const msg = await page.evaluate(() => {
        const e = document.getElementById('vpCodeAmi');
        const b = e && (e.closest('label') || e.parentNode);
        const m = b && b.querySelector('.vp-err');
        return m ? m.textContent : '';
      });
      dire(/inconnu|épuis|expir/i.test(msg), 'l’acheteur lit POURQUOI le code est refusé', 'message : ' + msg);
      dire(await total() === String(attendu), 'le total ne bouge pas', 'affiché : ' + await total());
      const c = await payer();
      dire(!!c && c.montant === attendu && !('code' in c),
        'débit au plein tarif, sans clé `code`',
        'corps : ' + JSON.stringify(c && { montant: c.montant, code: c.code }));
    }

    /* ⑥ Le code porté par le lien d'un ami. `codeAmiRetenu()` existait, mais
       rien ne l'appelait : arrivé par `?ref=`, le visiteur devait retaper le
       code dans le tunnel. On passe ici par le VRAI bouton « Commander » d'une
       carte du catalogue (m__commander), c'est lui qui ouvre le tunnel. */
    console.log(`\n${G}⑥ Arrivé par le lien d'un ami : le code est déjà posé, et vérifié${R}`);
    {
      await page.route('**/api/public_data.php*', route => route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ boutique: [
          { id: 'bk-banc', titre: 'Cahier 6e', prix: PU, cls: '6e', stock: 10, numerique: false }] })
      }));
      await page.goto(BASE + '/vitrine.html', { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => { try { localStorage.clear(); sessionStorage.clear(); } catch (e) {} });
      await page.goto(BASE + '/vitrine.html?ref=vrtbanc1', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => !!(window.VRT && window.VRT.etat), { timeout: 8000 });
      verifs = []; init = null;
      await page.evaluate(() => window.VRT.act('goBoutique', document.body));
      const btn = page.locator('[data-vrt-item="manuels"] [aria-label="Commander Cahier 6e"]').first();
      await btn.waitFor({ timeout: 8000 });
      await btn.click();
      await page.waitForSelector('#vpCodeAmi', { timeout: 8000 });
      await page.waitForTimeout(800);
      const champ = await page.inputValue('#vpCodeAmi');
      dire(champ === 'VRTBANC1', 'le champ « Code ami » est prérempli depuis le lien', 'champ : ' + champ);
      const v = verifs[verifs.length - 1] || {};
      dire(v.code === 'VRTBANC1' && v.montant === PU,
        'et vérifié au serveur sans que l’acheteur tape rien', 'vérifications : ' + JSON.stringify(verifs));
      const frais = await page.evaluate(() => [0, 1000, 2500][window.VRT.etat.livr] || 0);
      const attendu = PU - remiseServeur(PU) + frais;
      dire(await total() === String(attendu), `total affiché ${attendu} F (remise du serveur déduite)`,
        'affiché : ' + await total());
    }

    sortie = ko === 0 ? 0 : 1;
  } catch (e) {
    console.log(`  ${Rg}✗${R} étage ② interrompu : ${e.message}`);
    ko++; sortie = 1;
  } finally {
    await nav.close().catch(() => {});
    try { serveur.kill(); } catch (e) {}
  }

  console.log(`\n${ok} contrôle(s) au vert, ${ko} au rouge.\n`);
  process.exit(sortie);
})();
