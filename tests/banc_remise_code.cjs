#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_remise_code.cjs — LE CODE PAYÉ ARRIVE, ET LE CAHIER NE S'IMPRIME PAS
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_remise_code.cjs

   ─── CE QU'IL PROTÈGE, ET POURQUOI IL EXISTE ────────────────────────────────

   LE 01/09/2026, DEUX CLIENTS ONT PAYÉ SANS RECEVOIR LEUR CODE. Diagnostic sur
   la production : les deux paiements étaient `COMPLETED` chez Orange, les deux
   codes étaient émis et déposés — `action:"claim"` répondait 403 « bad_tel »,
   c'est-à-dire « ce code existe, mais pas avec ce numéro ». Rien n'avait échoué
   du côté de l'argent. La REMISE, elle, n'avait qu'un seul canal : un onglet
   ouvert au premier plan pendant huit minutes.

   Or payer par Orange Money veut dire QUITTER le navigateur pour composer
   `#150*50#`. Android gèle alors les minuteurs de l'onglet resté derrière, et
   le jette souvent. Au retour : plus de sondage, et plus de référence non plus
   — elle était rangée en `sessionStorage`, qui meurt avec l'onglet.

   Trois contrôles, donc, sur le seul parcours qui compte : celui de quelqu'un
   qui a payé et qui revient.

   ─── ET UN QUATRIÈME, SUR L'AUTRE BOUT DU PRODUIT ───────────────────────────

   `cahier.js` interceptait Ctrl+S / Ctrl+P / Ctrl+U, mais le MENU Imprimer du
   navigateur restait ouvert et `cahier.css` n'avait aucune règle `@media
   print`. Un cahier à 1 500 F sortait en PDF proprement mis en page. Ce banc
   ÉMULE le média « print » et mesure le style calculé : lire la feuille dirait
   que la règle est écrite, pas qu'elle mord.

   ─── LE BOUCHON NE DOIT PAS ÊTRE PLUS INDULGENT QUE LE SERVEUR ──────────────
   `tests/mock_livrets.cjs` rejoue le contrat EXACT d'api/livret.php pour
   `claim` : 404 « pending » quand aucun code n'existe, 403 « bad_tel » quand il
   existe mais que les 4 chiffres ne correspondent pas. Un bouchon qui rendrait
   le code sur la seule référence validerait une reprise que la production
   refuserait.

   ─── DEUX ÉTAGES, ET LE SECOND PEUT MANQUER ────────────────────────────────
   Les contrôles ① à ④ lisent les fichiers : ils tournent PARTOUT, CI comprise,
   et c'est eux qui gardent la porte du déploiement. Les contrôles ⑤ à ⑧
   pilotent un vrai navigateur (Playwright) et mesurent le style CALCULÉ sous le
   média « print » — la seule preuve qu'une règle l'emporte sur la feuille
   d'impression que les coquilles héritent de la maquette papier. La CI n'a ni
   `npm install` ni navigateur : ils y sont ANNONCÉS COMME NON EXÉCUTÉS, jamais
   sautés en silence. Un banc qui se tait quand il ne teste rien est pire que
   pas de banc.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
let chromium = null;
try { ({ chromium } = require('playwright')); } catch (e) { /* étage 2 indisponible */ }

const RACINE = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT_BANC || 3177);
const BASE = `http://localhost:${PORT}`;
const PAGE = `${BASE}/livrets/cahier.html?o=6e`;

const REF = 'LV260901-BANCTEST';
const TEL4 = '4321';
const CODE_ATTENDU = 'VRT-6E-TEST-0001';

const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => {
  b ? ok++ : ko++;
  console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : ''));
};

/** Pose un achat en attente, recharge, et rend ce que l'écran montre. */
async function ouvrirAvecAchat(page, achat) {
  await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
  await page.evaluate((a) => {
    localStorage.clear();
    if (a) localStorage.setItem('vrt-livret-achat', JSON.stringify(a));
  }, achat);
  await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
  // La reprise est un aller-retour réseau : on laisse le temps qu'il faut,
  // sans dépendre d'un délai fixe qui rendrait le banc intermittent.
  try {
    await page.waitForFunction(
      () => /VRT-[A-Z0-9-]{6,}/.test(document.body.innerText),
      { timeout: 6000 });
  } catch (e) { /* rien ne s'est affiché : c'est un résultat, pas une panne */ }
  return page.evaluate(() => ({
    texte: document.body.innerText,
    reste: localStorage.getItem('vrt-livret-achat'),
  }));
}

(async () => {
  console.log(`\n${G}LE CODE PAYÉ ARRIVE, ET LE CAHIER NE S'IMPRIME PAS${R}\n`);

  // ══ ÉTAGE 1 — sans navigateur : ce qui garde la porte du déploiement ══════
  const gate = fs.readFileSync(path.join(RACINE, 'livrets', 'gate.js'), 'utf8');

  console.log(`${G}① La preuve d’achat survit à la fermeture de l’onglet${R}`);
  dire(/localStorage\.setItem\(REF_CLE/.test(gate),
    'référence et 4 chiffres rangés en localStorage, pas seulement en session');
  dire(/function achatLu\(\)/.test(gate) && /localStorage\.getItem\(REF_CLE\)/.test(gate),
    'et relus au même endroit');

  console.log(`\n${G}② Un code payé se représente sans qu’on le demande${R}`);
  dire(/repriseAchat/.test(gate) && /VRT\.reclamer\(a\.ref, a\.t4\)/.test(gate),
    'une réclamation est tentée à l’ouverture de page');
  dire(/visibilitychange/.test(gate) && /function auRetour/.test(gate),
    'et au retour sur l’onglet — Android gèle les minuteurs pendant le #150*50#');

  console.log(`\n${G}③ Le cahier ne s’imprime pas${R}`);
  const mediaPrint = /@media print\{[^}]*#hote,#sheet,#lis\{display:none !important\}/.test(gate);
  dire(mediaPrint, 'une règle @media print masque les conteneurs de contenu');
  dire(/vrt-noprint-avis/.test(gate),
    'et la feuille imprimée porte une explication, pas une page blanche');

  console.log(`\n${G}④ La règle vise des conteneurs qui existent vraiment${R}`);
  {
    /* ⚠️ UNE RÈGLE QUI NE MATCHE RIEN NE DIT RIEN. Viser `#hote` alors que la
       coquille nomme son conteneur `#sheet` produirait exactement le même
       fichier, la même relecture rassurante, et une impression toujours
       ouverte. On constate donc chaque identifiant sur la surface qui le
       porte. */
    const lire = (f) => {
      const p = path.join(RACINE, 'livrets', f);
      return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
    };
    dire(/id="hote"/.test(lire('cahier.html')),
      '#hote — le lecteur générique, 14 ouvrages sur 15');
    const coquilles = ['6e', '5e', '4e', '3e'].filter(c => /id="sheet"/.test(lire(c + '.html')));
    dire(coquilles.length === 4,
      '#sheet — les quatre coquilles de collège (' + coquilles.length + '/4)',
      'manquantes : ' + ['6e', '5e', '4e', '3e'].filter(c => !coquilles.includes(c)).join(', '));
    dire(/d\.id = 'lis'/.test(lire('liseur.js')),
      '#lis — le feuilletage, posé à l’exécution par liseur.js');
  }

  // ══ ÉTAGE 2 — avec un vrai navigateur ════════════════════════════════════
  if (!chromium) {
    console.log(`\n${G}⑤ Mesure en navigateur${R}`);
    console.log('  \x1b[33m•\x1b[0m NON EXÉCUTÉE : playwright absent de cette machine.');
    console.log('    Les contrôles ① à ④ ci-dessus gardent la porte ; ceux-ci mesurent');
    console.log('    le rendu réel (style calculé sous le média « print », reprise');
    console.log('    automatique bout en bout). Pour les jouer : npm i -D playwright');
    console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
    process.exit(ko === 0 ? 0 : 1);
  }

  const serveur = spawn(process.execPath,
    [path.join(RACINE, 'tests', 'mock_livrets.cjs'), String(PORT)],
    { cwd: RACINE, stdio: 'ignore' });
  const nav = await chromium.launch();
  let sortie = 1;

  try {
    // Le bouchon met un instant à écouter ; on attend le port plutôt qu'un délai.
    const ctx = await nav.newContext();
    const page = await ctx.newPage();
    for (let i = 0; i < 40; i++) {
      try { await page.goto(BASE + '/livrets/cahier.html', { timeout: 1000 }); break; }
      catch (e) { await page.waitForTimeout(250); }
    }

    console.log(`${G}⑤ Un code payé et jamais retiré se représente tout seul${R}`);
    {
      const r = await ouvrirAvecAchat(page, { ref: REF, t4: TEL4, q: Date.now() });
      dire(r.texte.includes(CODE_ATTENDU),
        'l’acheteur rouvre la page : son code s’affiche sans rien demander',
        'écran obtenu : ' + r.texte.replace(/\s+/g, ' ').slice(0, 90));
      dire(r.reste === null,
        'et l’achat cesse d’être suivi — pas de réclamation rejouée à chaque visite',
        'reste en mémoire : ' + r.reste);
    }

    console.log(`\n${G}⑥ La mémoire de l’achat survit à la fermeture de l’onglet${R}`);
    {
      /* `sessionStorage` meurt avec l'onglet — c'est ce qui a coûté les deux
         ventes, le parcours Orange Money obligeant à quitter le navigateur.
         On vérifie que le rangement est bien celui qui survit. */
      await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
      const cles = await page.evaluate(() => {
        localStorage.clear(); sessionStorage.clear();
        window.VRTLivret.config({ classe: '6e', kind: 'livret', titre: 'Banc' });
        return null;
      });
      const src = await page.evaluate(async () => {
        const r = await fetch('/livrets/gate.js'); return r.text();
      });
      dire(/localStorage\.setItem\(REF_CLE/.test(src),
        'la référence et les 4 chiffres partent en localStorage');
      dire(!/sessionStorage\.getItem\('vrt-livret-ref'\)\s*\|\|\s*''\s*;[\s\S]{0,40}modale/.test(src),
        'l’écran de retrait ne dépend plus du seul sessionStorage');
    }

    console.log(`\n${G}⑦ Un achat qu’on ne peut pas réclamer ne fait pas de bruit${R}`);
    {
      const r = await ouvrirAvecAchat(page, { ref: 'LV260901-INCONNUE', t4: '0000', q: Date.now() });
      dire(!/VRT-[A-Z0-9-]{6,}/.test(r.texte),
        'référence inconnue : aucun code inventé',
        r.texte.replace(/\s+/g, ' ').slice(0, 80));
      dire(!/erreur|impossible|Introuvable/i.test(r.texte),
        'et aucune erreur jetée au visage d’un client dont le paiement traîne',
        r.texte.replace(/\s+/g, ' ').slice(0, 80));
    }

    console.log(`\n${G}⑧ Le cahier ne s’imprime pas${R}`);
    {
      await page.goto(PAGE, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => !!document.getElementById('vrt-noprint'), { timeout: 5000 })
        .catch(() => {});
      const ecran = await page.evaluate(() =>
        getComputedStyle(document.getElementById('hote')).display);
      /* ⚠️ ON ÉMULE LE MÉDIA, ON NE LIT PAS LA FEUILLE. Lire `cssRules` dirait
         que la règle est écrite ; seul le style CALCULÉ sous « print » dit
         qu'elle l'emporte sur la feuille d'impression que les coquilles
         héritent de la maquette papier. */
      await page.emulateMedia({ media: 'print' });
      const impr = await page.evaluate(() => ({
        hote: getComputedStyle(document.getElementById('hote')).display,
        avis: getComputedStyle(document.getElementById('vrt-noprint-avis')).display,
      }));
      await page.emulateMedia({ media: 'screen' });

      dire(ecran !== 'none', 'à l’écran, le cahier s’affiche normalement', 'display=' + ecran);
      dire(impr.hote === 'none',
        'à l’impression, le contenu du cahier ne sort pas', 'display=' + impr.hote);
      dire(impr.avis === 'block',
        'et la feuille imprimée porte l’explication, pas une page blanche',
        'display=' + impr.avis);
    }

    console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
    sortie = ko === 0 ? 0 : 1;
  } catch (e) {
    console.log('  ' + X + ' banc interrompu : ' + (e && e.message));
    sortie = 1;
  } finally {
    await nav.close().catch(() => {});
    serveur.kill();
  }
  process.exit(sortie);
})();
