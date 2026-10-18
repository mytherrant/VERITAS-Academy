#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_skysms_rappel.cjs — LE RAPPEL SKYSMS OUVRE-T-IL L'ACCÈS PAYÉ…
   ET SEULEMENT LUI ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_skysms_rappel.cjs

   ─── CE QU'IL PROTÈGE ───────────────────────────────────────────────────────
   Depuis le 15/10/2026, SkySMS (SKYSOFT) encaisse les paiements Mobile Money
   et envoie les SMS des codes. Ce qui ouvre un accès payé, c'est le RAPPEL de
   SKYSOFT (?action=skysms_notify), authentifié par une clé dans l'URL — leur
   rappel n'est pas signé. Ce banc lève un vrai serveur (php -S) sur une copie
   de api/ et un faux SkySMS, puis rejoue :

   ① clé absente / fausse → refus 401, rien ne change ;
   ② la réponse de la collecte (« statut 1 » = demande ENREGISTRÉE) n'ouvre
      jamais l'accès — mesuré en production le 15/10 ;
   ③ statut -1 (en attente) ne tranche rien ; 0 → échec ; 1 → payé + octroi ;
   ④ SKYSOFT colle ses paramètres avec un second « ? » derrière la clé ;
   ⑤ un montant inférieur ou un autre numéro n'ouvrent RIEN ;
   ⑥ un rappel rejoué n'octroie pas deux fois ;
   ⑦ chaque rappel à clé valide est accusé « 1 » (exigence SKYSOFT), y compris
      quand il ne se rattache à rien — sinon ils renvoient sans fin ;
   ⑧ l'accusé SMS (?action=skysms_dlr) est consigné sur la bonne remise ;
   ⑨ le suivi de statut (page de paiement, toutes les 5 s) ne réécrit pas
      l'état d'un paiement SkySMS.

   Rien n'est écrit dans les données du dépôt : tout vit dans un dossier
   temporaire, effacé à la fin.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const RACINE = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT_BANC_SKYSMS || 3271);
const PORT_SKY = PORT + 1;
const CLE = 'cle-de-rappel-banc-0123456789abcdef';
const SECRET = 'secret-admin-banc-0123456789';
const BASE = `http://127.0.0.1:${PORT}/api/payment_camerpay.php`;

let ok = 0, ko = 0;
const vert = (s) => `\x1b[32m${s}\x1b[0m`;
const rouge = (s) => `\x1b[31m${s}\x1b[0m`;
function verifier(nom, condition, detail) {
  if (condition) { ok++; console.log('  ' + vert('✓') + ' ' + nom); }
  else { ko++; console.log('  ' + rouge('✗ ' + nom) + (detail ? '\n      ' + detail : '')); }
}
const titre = (t) => console.log('\n\x1b[1m' + t + '\x1b[0m');

const CATALOGUE = {
  ouvrages: { '6e': { titre: 'Mon Cahier de français 6ᵉ', niveau: '6e', mode: 'interactif', kinds: ['livret', 'guide'], prix: 1500 } }
};

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-skysms-'));
const API = path.join(dir, 'www', 'api');
const ETATS = path.join(API, 'data', 'payments');
const NOTIFY = path.join(dir, 'nf');
const DB = path.join(dir, 'db.json');

function preparer() {
  fs.mkdirSync(ETATS, { recursive: true });
  fs.mkdirSync(path.join(dir, 'lv'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'sky'), { recursive: true });
  for (const f of fs.readdirSync(path.join(RACINE, 'api'))) {
    if (/\.php$/.test(f) && f !== 'payment_config.php') fs.copyFileSync(path.join(RACINE, 'api', f), path.join(API, f));
  }
  fs.copyFileSync(path.join(RACINE, 'api', 'payment_config.php.exemple'), path.join(API, 'payment_config.exemple.php'));
  fs.writeFileSync(path.join(dir, 'catalogue.json'), JSON.stringify(CATALOGUE));
  fs.writeFileSync(DB, JSON.stringify({ tarifs: { livret: 1500, livretJours: 365 }, livretVentes: [], visitorAccounts: [] }));
  /* La configuration du banc : nos valeurs d'abord, l'exemple du dépôt
     complète le reste (il ne définit que ce qui ne l'est pas encore). */
  fs.writeFileSync(path.join(API, 'payment_config.php'), `<?php
define('SKYSMS_UID', 'uid-banc');
define('SKYSMS_PUBLIC_INIT', 'pub_0123456789abcdef0123456789abcdef');
define('SKYSMS_CALLBACK_CLE', ${JSON.stringify(CLE)});
define('SKYSMS_API_BASE', 'http://127.0.0.1:${PORT_SKY}/api/public');
define('SKYSMS_TIMEOUT', 10);
define('PAY_API_SECRET', ${JSON.stringify(SECRET)});
define('API_SECRET', ${JSON.stringify(SECRET)});
define('VRT_HMAC_KEY', 'cle-hmac-de-banc-0123456789-suffisamment-longue');
define('VRT_DB_FICHIER', ${JSON.stringify(DB)});
define('VRT_LIVRET_DIR', ${JSON.stringify(path.join(dir, 'lv'))});
define('VRT_LIVRET_CATALOGUE', ${JSON.stringify(path.join(dir, 'catalogue.json'))});
define('VRT_NOTIFY_DIR', ${JSON.stringify(NOTIFY)});
define('VRT_NOTIFY_CANAL', 'aucun');
define('VRT_SMS_SANS_MAIL', 1);
define('VRT_RATE_DIR', ${JSON.stringify(path.join(dir, 'lv', '_rate'))});
define('PUBLIC_BASE_URL', 'https://veritas-school.com');
require __DIR__ . '/payment_config.exemple.php';
`);
  /* Le faux SkySMS : la collecte répond comme la vraie le 15/10/2026 — « 1 »,
     demande ENREGISTRÉE, AVANT toute saisie du code Pin. */
  fs.writeFileSync(path.join(dir, 'sky', 'routeur.php'), `<?php
header('Content-Type: application/json');
if (strpos($_SERVER['REQUEST_URI'], '/collecte_momo/') !== false) {
  // Deux numéros piégés : refus « 0 » de SkySMS, et page HTML au lieu de JSON.
  if (($_GET['phone'] ?? '') === '690000009') { echo json_encode(['statut' => '0', 'description' => 'Service momentanement indisponible']); exit; }
  if (($_GET['phone'] ?? '') === '690000008') { header('Content-Type: text/html'); echo '<html>Maintenance</html>'; exit; }
  echo json_encode(['statut' => '1', 'amount' => (int) ($_GET['amount'] ?? 0), 'telephone' => $_GET['phone'] ?? '',
    'description' => "Demande de collecte enregistrée avec succes.\\nVeuillez valider le paiement en saisissant votre code Pin.",
    'id_operation' => 'op-' . ($_GET['id_client'] ?? '')]);
  exit;
}
echo json_encode(['statut' => '0', 'description' => 'route inconnue du banc']);
`);
}

function etatFichier(ref) { return path.join(ETATS, 'camerpay_' + ref.replace(/[^a-zA-Z0-9_-]/g, '_') + '.json'); }
function lireEtat(ref) { return JSON.parse(fs.readFileSync(etatFichier(ref), 'utf8')); }
function semer(ref, extra) {
  const st = Object.assign({
    ref, pay_url: '', montant: 1500, label: 'Cahier 6e', intent: 'livret', targetId: '6e:livret', accountId: '',
    clientNom: 'Banc', clientTel: '237690000001', clientEmail: '', status: 'pending', provider: 'skysms',
    created_at: new Date(Date.now() - 60000).toISOString(), push_count: 0
  }, extra || {});
  fs.writeFileSync(etatFichier(ref), JSON.stringify(st));
  return st;
}
/* L'index « id SkySMS → référence » tel que skysms_collect l'écrit. */
function indexer(idc, ref) {
  const d = path.join(ETATS, '_skysms_idx');
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, require('crypto').createHash('sha1').update(idc).digest('hex') + '.txt'), ref);
}
function ventes() { return (JSON.parse(fs.readFileSync(DB, 'utf8')).livretVentes || []); }

async function appel(query, opts) {
  const r = await fetch(BASE + query, opts || {});
  return { s: r.status, t: await r.text() };
}
const rappel = (q) => appel('?action=skysms_notify&cle=' + q);

function lancer(port, racine, routeur) {
  const args = ['-S', '127.0.0.1:' + port, '-t', racine];
  if (routeur) args.push(routeur);
  return spawn('php', args, { stdio: 'ignore', env: Object.assign({}, process.env, { PHP_CLI_SERVER_WORKERS: '2' }) });
}
async function attendre(url) {
  for (let i = 0; i < 50; i++) {
    try { await fetch(url); return; } catch (e) { await new Promise((r) => setTimeout(r, 100)); }
  }
  throw new Error('serveur injoignable : ' + url);
}

(async () => {
  preparer();
  const srv = lancer(PORT, path.join(dir, 'www'));
  const sky = lancer(PORT_SKY, path.join(dir, 'sky'), path.join(dir, 'sky', 'routeur.php'));
  const fin = () => { srv.kill(); sky.kill(); fs.rmSync(dir, { recursive: true, force: true }); };
  try {
    await attendre(BASE + '?action=status&ref=x');
    await attendre(`http://127.0.0.1:${PORT_SKY}/`);

    titre('① La clé du rappel');
    semer('SKY-A'); indexer('IDC-A', 'SKY-A');
    let r = await appel('?action=skysms_notify&statut=1&id_client=IDC-A');
    verifier('sans clé → 401', r.s === 401, `${r.s} ${r.t}`);
    r = await rappel('fausse-cle-0123456789abcdef&statut=1&id_client=IDC-A');
    verifier('clé fausse → 401', r.s === 401, `${r.s} ${r.t}`);
    r = await rappel(CLE + 'x&statut=1&id_client=IDC-A');
    verifier('clé + 1 caractère → 401', r.s === 401, `${r.s} ${r.t}`);
    verifier('… et rien n\'est payé', lireEtat('SKY-A').status === 'pending' && ventes().length === 0);

    titre('② La réponse de la collecte n\'ouvre jamais l\'accès');
    semer('SKY-B');
    r = await appel('?action=skysms_collect', { method: 'POST', headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ ref: 'SKY-B', tel: '690000001' }) });
    let e = lireEtat('SKY-B');
    verifier('collecte acceptée (200)', r.s === 200, `${r.s} ${r.t}`);
    verifier('« statut 1 » de la collecte laisse le paiement en attente', e.status === 'pending' && !e.granted, JSON.stringify(e.push_reponse));
    verifier('id_operation SkySMS mémorisé', /^op-/.test(e.id_operation || ''), e.id_operation);
    verifier('aucune vente émise', ventes().length === 0);
    const idc = (e.id_clients || [])[0];

    titre('③ Table officielle du rappel : -1 attente · 0 échec · 1 payé');
    r = await rappel(`${CLE}&statut=-1&id_client=${idc}`);
    verifier('-1 → accusé « 1 »', r.s === 200 && r.t === '1', `${r.s} ${r.t}`);
    verifier('-1 → toujours en attente', lireEtat('SKY-B').status === 'pending');
    r = await rappel(`${CLE}&statut=0&id_client=${idc}&description=Solde%20insuffisant`);
    e = lireEtat('SKY-B');
    verifier('0 → échec, motif gardé', e.status === 'failed' && /insuffisant/.test(e.failure_reason || ''), e.status + ' ' + e.failure_reason);
    verifier('0 → rien d\'octroyé', ventes().length === 0);
    // Le payeur réessaie : nouvelle demande, puis rappel payé par l'id_operation.
    e.last_push_at = '2000-01-01T00:00:00Z'; fs.writeFileSync(etatFichier('SKY-B'), JSON.stringify(e));
    r = await appel('?action=skysms_collect', { method: 'POST', headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ ref: 'SKY-B', tel: '690000001' }) });
    e = lireEtat('SKY-B');
    verifier('nouvelle demande après échec → en attente', r.s === 200 && e.status === 'pending', `${r.s} ${e.status}`);

    titre('④ Paramètres collés avec un second « ? » (rappel réel du 15/10)');
    r = await rappel(`${CLE}?statut=1&id_operation=${e.id_operation}&amount=1500&telephone=690000001&id_operateur=MP2610.1234`);
    e = lireEtat('SKY-B');
    verifier('accusé « 1 »', r.s === 200 && r.t === '1', `${r.s} ${r.t}`);
    verifier('payé par le rappel', e.status === 'paid' && e.paid_source === 'rappel', e.status);
    verifier('id opérateur gardé (preuve en cas de litige)', e.id_operateur === 'MP2610.1234', e.id_operateur);
    verifier('accès octroyé (une vente, un code)', e.granted === true && ventes().length === 1, `granted=${e.granted} ventes=${ventes().length}`);

    titre('⑤ Montant inférieur, autre numéro');
    semer('SKY-C'); indexer('IDC-C', 'SKY-C');
    r = await rappel(`${CLE}&statut=1&id_client=IDC-C&amount=100&telephone=690000001`);
    e = lireEtat('SKY-C');
    verifier('100 F pour 1 500 F → sous-payé, à régler', e.status === 'underpaid' && e.a_regler === true, e.status);
    verifier('… accusé « 1 », rien d\'octroyé', r.t === '1' && !e.granted && ventes().length === 1);
    semer('SKY-D'); indexer('IDC-D', 'SKY-D');
    r = await rappel(`${CLE}&statut=1&id_client=IDC-D&amount=1500&telephone=677000000`);
    e = lireEtat('SKY-D');
    verifier('payé depuis un autre numéro → en attente, à régler', e.status === 'pending' && e.a_regler === true, e.status);
    verifier('… accusé « 1 » (un renvoi n\'y changerait rien), rien d\'octroyé', r.s === 200 && r.t === '1' && ventes().length === 1, `${r.s} ${r.t}`);

    titre('⑥ Rappel rejoué');
    r = await rappel(`${CLE}&statut=1&id_client=${idc}&amount=1500`);
    verifier('rejoué → accusé « 1 », pas de seconde vente', r.t === '1' && ventes().length === 1, `ventes=${ventes().length}`);
    r = await rappel(`${CLE}&statut=0&id_client=${idc}`);
    verifier('un « échec » tardif ne défait pas un paiement', lireEtat('SKY-B').status === 'paid');

    titre('⑦ Rappel qui ne se rattache à rien');
    r = await rappel(`${CLE}&statut=1&id_client=INCONNU-999&amount=1500`);
    verifier('référence inconnue → accusé « 1 » (pas de renvoi sans fin)', r.s === 200 && r.t === '1', `${r.s} ${r.t}`);
    verifier('… et rien d\'octroyé', ventes().length === 1);

    titre('⑧ Accusé de réception des SMS (skysms_dlr)');
    r = await appel('?action=skysms_dlr&cle=mauvaise-cle-0123456789abcdef&ssid_sms=X&statut=1');
    verifier('clé fausse → 401', r.s === 401, `${r.s} ${r.t}`);
    r = await appel(`?action=skysms_dlr&cle=${CLE}&ssid_sms=INCONNU&statut=1`);
    verifier('SMS inconnu → accusé « 1 »', r.s === 200 && r.t === '1', `${r.s} ${r.t}`);
    const fnotif = fs.readdirSync(path.join(NOTIFY, 'notify')).filter((f) => f.endsWith('.json'));
    verifier('la vente a mis un SMS de remise en file', fnotif.length >= 1, fnotif.join(','));
    if (fnotif.length) {
      const fp = path.join(NOTIFY, 'notify', fnotif[0]);
      const m = JSON.parse(fs.readFileSync(fp, 'utf8'));
      Object.assign(m, { etat: 'envoye', canal: 'skysms', ssid: 'SS-BANC-1', idsms: 'VRTBANC1' });
      fs.writeFileSync(fp, JSON.stringify(m));
      r = await appel(`?action=skysms_dlr&cle=${CLE}?ssid_sms=SS-BANC-1&statut=1&datereception=15/10/2026%2012:00:00`);
      const m2 = JSON.parse(fs.readFileSync(fp, 'utf8'));
      verifier('SMS délivré → consigné sur la remise', r.t === '1' && m2.dlr && m2.dlr.statut === 'delivre', JSON.stringify(m2.dlr));
    }

    titre('⑨ Le suivi de statut ne réécrit pas un paiement SkySMS');
    semer('SKY-E');
    const avant = fs.readFileSync(etatFichier('SKY-E'), 'utf8');
    r = await appel('?action=status&ref=SKY-E');
    verifier('status → pending', r.s === 200 && JSON.parse(r.t).status === 'pending', r.t);
    verifier('l\'état n\'a pas été réécrit', fs.readFileSync(etatFichier('SKY-E'), 'utf8') === avant);

    titre('⑩ Suivi admin');
    r = await appel('?action=skysms_suivi');
    verifier('sans jeton → 401', r.s === 401, `${r.s}`);
    r = await appel('?action=skysms_suivi', { headers: { Authorization: 'Bearer ' + SECRET } });
    let j = {}; try { j = JSON.parse(r.t); } catch (x) {}
    verifier('avec jeton → totaux cohérents (1 payé, 1 sous-payé)', r.s === 200 && j.totaux && j.totaux.payes === 1 && j.totaux.a_regler >= 2,
             r.t.slice(0, 300));

    titre('⑪ Une demande que SkySMS n\'a pas enregistrée se voit');
    const pousser = (ref, tel) => appel('?action=skysms_collect', { method: 'POST', headers: { 'Content-Type': 'application/json' },
                                         body: JSON.stringify({ ref, tel }) });
    semer('SKY-F');
    r = await pousser('SKY-F', '690000009');
    verifier('statut « 0 » de la collecte → erreur montrée au payeur', r.s === 502 && /indisponible/.test(r.t), `${r.s} ${r.t}`);
    semer('SKY-G');
    r = await pousser('SKY-G', '690000008');
    verifier('réponse non JSON → erreur, pas « regardez votre téléphone »', r.s === 502 && /illisible/.test(r.t), `${r.s} ${r.t}`);
    /* SkySMS injoignable (port fermé) : la demande n'est jamais partie. */
    const inj = require('child_process').spawnSync('php', ['-r',
      "define('SKYSMS_API_BASE','http://127.0.0.1:9/api/public');define('SKYSMS_UID','u');define('SKYSMS_TIMEOUT',10);"
      + "require " + JSON.stringify(path.join(API, '_skysms_lib.php')) + ";"
      + "echo json_encode(vrt_skysms_collecter('690000001',1500,'1234567890'));"], { encoding: 'utf8' });
    let ji = {}; try { ji = JSON.parse(inj.stdout); } catch (x) {}
    verifier('SkySMS injoignable → échec, pas « attente »', ji.ok === false && ji.attente === false && /injoignable/.test(ji.msg || ''), inj.stdout + inj.stderr);
  } catch (err) {
    ko++; console.log(rouge('✗ ' + (err && err.stack || err)));
  } finally {
    fin();
  }
  console.log(`\n${ok} vérification(s) au vert, ${ko} au rouge.`);
  process.exit(ko ? 1 : 0);
})();
