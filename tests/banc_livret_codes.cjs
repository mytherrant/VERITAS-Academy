#!/usr/bin/env node
/**
 * tests/banc_livret_codes.cjs — LA PORTE DES CAHIERS, DE BOUT EN BOUT
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 *   node tests/banc_livret_codes.cjs
 *
 * CE QU'IL PROUVE — les deux règles commerciales, pas le code qui les écrit :
 *   ① chaque manuel a SON accès      : un code de 6ᵉ n'ouvre pas la 5ᵉ ;
 *   ② le code dépend de la VERSION   : un code élève n'ouvre pas le guide de
 *      l'enseignant, et réciproquement ;
 *   ③ un ouvrage vendu sans guide ne peut pas en émettre un (sinon on encaisse
 *      un code qui n'ouvrira jamais rien) ;
 *   ④ l'émission manuelle (règlement en espèces au centre) marche, est fermée
 *      sans la clé d'administration, et ne laisse pas les codes en clair dans
 *      le registre ;
 *   ⑤ la révocation coupe immédiatement.
 *
 * POURQUOI UN SERVEUR PHP RÉEL
 *   Ces règles vivent dans le CHEMIN HTTP (action, en-tête Authorization, codes
 *   d'état), pas dans une fonction isolée. Les rejouer à la main en PHP les
 *   testerait à côté. Le banc démarre donc `php -S` sur une coquille qui
 *   redirige le registre vers un dossier temporaire : aucune écriture ne touche
 *   api/data/ ni la production.
 *
 * ÉPROUVÉ PAR MUTATION (25/08/2026) : en neutralisant les deux gardes de
 * `unlock` (`if (false)`), 3 contrôles passent au rouge — ceux de ① et ②.
 * Un banc qui reste vert quand on casse la règle ne teste rien.
 */
'use strict';
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');
const PORT = parseInt(process.env.PORT_BANC || '8899', 10);
const URL = `http://127.0.0.1:${PORT}/livret_test.php`;
const SECRET = 'BANC_DE_TEST_SECRET_0123456789';

let ok = 0, ko = 0;
const dit = (bon, quoi, det) => {
  if (bon) { ok++; console.log('  \x1b[32m✓\x1b[0m ' + quoi); }
  else { ko++; console.log('  \x1b[31m✗\x1b[0m ' + quoi + (det ? '  → ' + det : '')); }
};

// ── Coquille de test : registre isolé, secret d'administration connu ─────────
function preparer() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-livret-'));
  fs.mkdirSync(path.join(dir, 'lvdata'));
  const shim = `<?php
define('VRT_LIVRET_DIR', __DIR__ . '/lvdata');
define('API_SECRET', ${JSON.stringify(SECRET)});
require ${JSON.stringify(path.join(RACINE, 'api', 'livret.php'))};
`;
  fs.writeFileSync(path.join(dir, 'livret_test.php'), shim, 'utf8');
  return dir;
}

async function api(body, secret) {
  const h = { 'Content-Type': 'application/json' };
  if (secret) h['Authorization'] = 'Bearer ' + secret;
  const r = await fetch(URL, { method: 'POST', headers: h, body: JSON.stringify(body) });
  let j = null; try { j = await r.json(); } catch (e) {}
  return { status: r.status, j };
}

async function attendre(ms) { return new Promise(r => setTimeout(r, ms)); }

async function serveurPret() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await api({ action: 'catalogue' });
      if (r.status === 200) return true;
    } catch (e) { /* pas encore levé */ }
    await attendre(250);
  }
  return false;
}

(async () => {
  if (spawnSync('php', ['-v'], { stdio: 'ignore' }).status !== 0) {
    console.log('\x1b[33m⚠ PHP absent du PATH — banc non exécutable ici. La CI reste l’autorité.\x1b[0m');
    process.exit(0);
  }

  const dir = preparer();
  const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', dir], { cwd: dir, stdio: 'ignore' });
  const fin = (code) => { try { srv.kill(); } catch (e) {} process.exit(code); };

  if (!await serveurPret()) { console.log('\x1b[31m✗ le serveur de test n’a pas démarré\x1b[0m'); fin(1); }

  console.log('\n\x1b[1m1. Catalogue (public) — la vitrine, jamais le contenu\x1b[0m');
  const cat = await api({ action: 'catalogue' });
  dit(cat.status === 200 && cat.j && cat.j.ok, 'catalogue servi sans authentification');
  const ouvrages = (cat.j && cat.j.ouvrages) || [];
  dit(ouvrages.length >= 5, ouvrages.length + ' ouvrages au catalogue');
  const bord = ouvrages.find(o => o.slug === 'bord-6e');
  dit(bord && bord.kinds.length === 1 && bord.kinds[0] === 'livret',
      'un ouvrage sans guide n’annonce QUE la version élève');
  dit(cat.j && cat.j.kinds && cat.j.kinds.livret && cat.j.kinds.guide,
      'les libellés des versions viennent du serveur');
  dit(JSON.stringify(cat.j).indexOf('sequences') < 0,
      'le catalogue ne laisse filtrer AUCUN contenu pédagogique');

  /* DÉCLARÉ ≠ PUBLIÉ. Le catalogue retombe sur cinq classes d'origine pour ne
     jamais fermer un accès vendu, si bien que « 2nde » y figure sans que sa
     coquille existe. La boutique, qui lit ce catalogue, affichait donc une
     carte menant à un 404 — constaté au navigateur le 25/08/2026. */
  const dispo = ouvrages.filter(o => o.disponible === true).map(o => o.slug);
  const pasDispo = ouvrages.filter(o => o.disponible === false).map(o => o.slug);
  dit(ouvrages.every(o => typeof o.disponible === 'boolean'),
      'chaque ouvrage dit s’il est réellement publié');
  dit(dispo.indexOf('6e') >= 0 && dispo.indexOf('bord-6e') >= 0,
      'les ouvrages dont la coquille existe sont « disponibles » : ' + dispo.join(', '));
  dit(pasDispo.indexOf('2nde') >= 0,
      '« 2nde », déclaré mais sans page, est marqué NON disponible',
      'non disponibles : ' + (pasDispo.join(', ') || 'aucun'));

  console.log('\n\x1b[1m2. La porte d’administration est fermée par défaut\x1b[0m');
  dit((await api({ action: 'admin_gen', classe: '6e', kind: 'livret', n: 1 })).status === 401,
      'sans clé → 401');
  dit((await api({ action: 'admin_gen', classe: '6e', kind: 'livret', n: 1 }, 'mauvaise-cle')).status === 401,
      'mauvaise clé → 401');

  console.log('\n\x1b[1m3. Émission manuelle (règlement en espèces au centre)\x1b[0m');
  const gen6 = await api({ action: 'admin_gen', classe: '6e', kind: 'livret', n: 2,
                           jours: 365, label: 'Espèces — Awa NGO, reçu 42' }, SECRET);
  dit(gen6.status === 200 && gen6.j.ok, 'émission acceptée avec la bonne clé');
  const codes6 = (gen6.j && gen6.j.codes) || [];
  dit(codes6.length === 2, 'quantité respectée (2 codes)', 'reçu ' + codes6.length);
  dit(codes6[0] !== codes6[1], 'deux codes distincts');
  dit(gen6.j && gen6.j.expire > Math.floor(Date.now() / 1000), 'échéance dans le futur');

  const genGuide = await api({ action: 'admin_gen', classe: '6e', kind: 'guide', n: 1,
                               jours: 365, label: 'Spécimen enseignant' }, SECRET);
  const codeGuide = (genGuide.j && genGuide.j.codes && genGuide.j.codes[0]) || '';
  dit(!!codeGuide, 'code enseignant émis');
  dit((await api({ action: 'admin_gen', classe: 'nexistepas', kind: 'livret', n: 1 }, SECRET)).status === 400,
      'ouvrage inconnu → refusé');

  // ③ Le défaut trouvé le 25/08 : `bord-6e` n'a pas de guide, et le serveur en
  //   émettait un quand même — un code vendable qui n'ouvre rien.
  dit((await api({ action: 'admin_gen', classe: 'bord-6e', kind: 'guide', n: 1 }, SECRET)).status === 400,
      'version que l’ouvrage n’accepte pas → refusée');

  console.log('\n\x1b[1m4. Le registre ne conserve PAS les codes en clair\x1b[0m');
  const list = await api({ action: 'admin_list' }, SECRET);
  dit(list.status === 200 && list.j.ok, 'inventaire lisible par l’administrateur');
  dit(codes6.every(c => JSON.stringify(list.j).indexOf(c) < 0),
      'aucun code en clair dans l’inventaire (empreinte HMAC seulement)');
  dit(!!(list.j.codes || []).find(c => (c.label || '').indexOf('Awa NGO') >= 0),
      'la vente au comptoir est retrouvable par le nom de l’acheteur');

  console.log('\n\x1b[1m5. ① Chaque manuel a SON accès\x1b[0m');
  const bon = await api({ action: 'unlock', code: codes6[0], classe: '6e', kind: 'livret' });
  dit(bon.status === 200 && bon.j.ok, 'code 6ᵉ sur le cahier 6ᵉ → ouvre');
  const ailleurs = await api({ action: 'unlock', code: codes6[1], classe: '5e', kind: 'livret' });
  dit(!(ailleurs.status === 200 && ailleurs.j && ailleurs.j.ok),
      'le MÊME code sur le cahier 5ᵉ → REFUSÉ', 'reçu ' + ailleurs.status);

  console.log('\n\x1b[1m6. ② Le code dépend de la VERSION (élève / enseignant)\x1b[0m');
  const ev = await api({ action: 'unlock', code: codes6[1], classe: '6e', kind: 'guide' });
  dit(!(ev.status === 200 && ev.j && ev.j.ok),
      'code ÉLÈVE sur le guide enseignant → REFUSÉ', 'reçu ' + ev.status);
  const ge = await api({ action: 'unlock', code: codeGuide, classe: '6e', kind: 'livret' });
  dit(!(ge.status === 200 && ge.j && ge.j.ok),
      'code ENSEIGNANT sur le livret élève → REFUSÉ', 'reçu ' + ge.status);
  const go = await api({ action: 'unlock', code: codeGuide, classe: '6e', kind: 'guide' });
  dit(go.status === 200 && go.j.ok, 'code enseignant sur le guide → ouvre');

  console.log('\n\x1b[1m7. Révocation à effet immédiat\x1b[0m');
  const cible = (list.j.codes || []).find(c => (c.label || '').indexOf('Spécimen') >= 0);
  dit((await api({ action: 'admin_revoke', id: cible && cible.id }, SECRET)).status === 200,
      'révocation acceptée');
  const apres = await api({ action: 'unlock', code: codeGuide, classe: '6e', kind: 'guide' });
  dit(!(apres.status === 200 && apres.j && apres.j.ok),
      'le code révoqué n’ouvre plus rien', 'reçu ' + apres.status);

  console.log('\n' + '─'.repeat(68));
  const total = ok + ko;
  if (ko === 0) console.log(`\x1b[32m\x1b[1m  ✓ ${ok}/${total} contrôles passés\x1b[0m`);
  else console.log(`\x1b[31m\x1b[1m  ✗ ${ko} échec(s) sur ${total}\x1b[0m`);
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {}
  fin(ko === 0 ? 0 : 1);
})();
