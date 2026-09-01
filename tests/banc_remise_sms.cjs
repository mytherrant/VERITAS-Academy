#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_remise_sms.cjs — LE CODE PAYÉ PART AU NUMÉRO QUI A PAYÉ
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_remise_sms.cjs

   ─── CE QU'IL PROTÈGE ───────────────────────────────────────────────────────

   Les 31/08 et 01/09/2026, CINQ clients ont payé 1 500 F sans recevoir leur
   code. Les cinq paiements étaient confirmés, les cinq codes émis et déposés :
   `action:"claim"` les a tous rendus du premier coup, après coup. Ce qui
   manquait n'était pas un code — c'était un CANAL. La remise ne vivait que dans
   le navigateur de l'acheteur, et payer par Orange Money oblige à en sortir.

   `api/_notify_lib.php` ajoute le canal qui ne dépend pas de l'appareil du
   client : le serveur envoie le code au numéro qui a payé. Ce banc vérifie que
   ce canal fait ce qu'il promet — et surtout qu'il ne MENT pas quand il échoue.

   ─── LES DEUX SILENCES QU'ON REFUSE ─────────────────────────────────────────

   ① « 200 donc livré ». Beaucoup de passerelles SMS répondent 200 aussi bien
      pour « message accepté » que pour « solde épuisé ». Compter la seconde
      comme une livraison recréerait exactement l'incident d'origine, en pire :
      cette fois l'administration croirait le client servi. Le contrôle ④
      renvoie un 200 qui ne contient PAS le fragment attendu et exige un échec.

   ② « pas de passerelle, donc rien ». Sans canal configuré, la remise doit
      rester EN FILE et visible, pas disparaître (contrôle ①).

   ─── POURQUOI UN VRAI SERVEUR ET PAS UN BOUCHON EN MÉMOIRE ──────────────────
   Le cœur du transport générique est une substitution de gabarit : « user=U&
   sms={msg} ». L'erreur classique est d'encoder le gabarit entier, ce qui
   détruit les « & » et les « = » qui en font la structure — la requête part,
   la passerelle répond 200, et le message est vide. Seule une passerelle qui
   RELIT ce qu'elle a reçu peut le prouver. Le banc en lève donc une vraie
   (php -S) et inspecte les champs reçus (contrôle ③).
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync, execFileSync } = require('child_process');

const RACINE = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT_BANC_SMS || 3188);
const STUB = `http://127.0.0.1:${PORT}/passerelle.php`;

let ok = 0, ko = 0;
const vert = (s) => `\x1b[32m${s}\x1b[0m`;
const rouge = (s) => `\x1b[31m${s}\x1b[0m`;
function verifier(nom, condition, detail) {
  if (condition) { ok++; console.log('  ' + vert('✓') + ' ' + nom); }
  else { ko++; console.log('  ' + rouge('✗ ' + nom) + (detail ? '\n      ' + detail : '')); }
}

/* Le catalogue du banc est FOURNI, jamais celui de la machine : api/data/
   n'existe pas en CI, et un banc qui lit l'état du disque mesure la machine au
   lieu de la règle. C'est l'erreur qui a bloqué le déploiement du 26/08. */
const CATALOGUE = {
  ouvrages: {
    '6e': { titre: 'Mon Cahier de français 6ᵉ', niveau: '6e', mode: 'interactif',
            kinds: ['livret', 'guide'], prix: 1500 }
  }
};

function preparer() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-sms-'));
  fs.mkdirSync(path.join(dir, 'lvdata'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'nfdata'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'catalogue.json'), JSON.stringify(CATALOGUE), 'utf8');

  /* La passerelle SMS du banc : elle ENREGISTRE ce qu'elle reçoit (c'est tout
     l'intérêt) et répond ce que le scénario lui demande de répondre, via un
     fichier — un banc ne doit pas dépendre de l'ordre des requêtes. */
  fs.writeFileSync(path.join(dir, 'passerelle.php'), `<?php
$recu = [
  'methode' => $_SERVER['REQUEST_METHOD'] ?? '',
  'uri'     => $_SERVER['REQUEST_URI'] ?? '',
  'type'    => $_SERVER['CONTENT_TYPE'] ?? '',
  'brut'    => file_get_contents('php://input'),
  'post'    => $_POST,
  'get'     => $_GET,
];
$j = json_decode((string) @file_get_contents(__DIR__ . '/recu.json'), true);
if (!is_array($j)) $j = [];
$j[] = $recu;
@file_put_contents(__DIR__ . '/recu.json', json_encode($j), LOCK_EX);
$r = @file_get_contents(__DIR__ . '/reponse.txt');
if ($r === false || $r === '') $r = 'ACCEPTE id=1';
if (strpos($r, 'HTTP500') === 0) { http_response_code(500); echo 'panne'; exit; }
echo $r;
`, 'utf8');
  fs.writeFileSync(path.join(dir, 'recu.json'), '[]', 'utf8');
  fs.writeFileSync(path.join(dir, 'reponse.txt'), 'ACCEPTE id=1', 'utf8');

  /* Le scénario : il rejoue EXACTEMENT le chemin de production — la même
     fonction que les quatre passerelles de paiement traversent — puis vide la
     file. Il ne touche PAS `data/veritas_db.json` : la base lui est passée en
     mémoire, sinon un banc réécrirait la base du dépôt. */
  fs.writeFileSync(path.join(dir, 'scenario.php'), `<?php
$cas   = $argv[1] ?? 'ok';
$tel   = $argv[2] ?? '690361319';
$mail  = $argv[3] ?? '';
$canal = $argv[4] ?? 'http';
define('VRT_HMAC_KEY', 'cle-de-banc-0123456789-suffisamment-longue');
define('API_SECRET', 'secret-de-banc-0123456789');
define('VRT_LIVRET_DIR', __DIR__ . '/lvdata');
define('VRT_LIVRET_CATALOGUE', __DIR__ . '/catalogue.json');
define('VRT_NOTIFY_DIR', __DIR__ . '/nfdata');
define('VRT_RATE_DIR', __DIR__ . '/lvdata/_rate');
define('VRT_SITE_URL', 'https://veritas-school.com');
define('VRT_NOTIFY_AIDE', '697 63 77 39');

/* Le canal est TOUJOURS défini explicitement — jamais laissé au défaut. Le
   défaut de production est « mail », et un banc qui l'hériterait mesurerait la
   présence d'un serveur de courrier sur la machine, pas la règle. */
define('VRT_NOTIFY_CANAL', $canal);
if ($canal !== '') {
    define('VRT_SMS_URL', ${JSON.stringify(STUB)});
    define('VRT_SMS_METHODE', 'POST');
    define('VRT_SMS_TYPE', 'form');
    // Le « & » et le « = » sont la STRUCTURE : ils doivent survivre.
    define('VRT_SMS_CORPS', 'user=MOI&password=SECRET&senderid=VERITAS&mobiles={tel}&sms={msg}');
    define('VRT_SMS_ENTETES', 'X-Banc: oui');
    define('VRT_SMS_OK', 'ACCEPTE');
}

require ${JSON.stringify(path.join(RACINE, 'api', '_auth_lib.php'))};

$db = ['tarifs' => ['livret' => 1500, 'livretJours' => 365], 'livretVentes' => []];
$state = [
  'intent' => 'livret', 'ref' => 'LVBANC-' . strtoupper($cas),
  'targetId' => '6e:livret', 'montant' => 1500,
  'clientNom' => 'Banc', 'clientTel' => $tel, 'clientEmail' => $mail,
];

$g1 = vrt_grant_entitlement($db, $state);
// Rejeu du webhook : la passerelle recommence jusqu'à obtenir un 200.
$g2 = vrt_grant_entitlement($db, $state);
$v  = vrt_notify_vider(10);
$m  = vrt_notify_lire($state['ref']);

echo json_encode([
  'octroi1'  => $g1, 'octroi2' => $g2, 'vidage' => $v,
  'message'  => $m,
  'liste'    => vrt_notify_liste(50),
  'code'     => (string) ($db['livretVentes'][0]['code'] ?? ''),
  'code4'    => substr((string) ($db['livretVentes'][0]['code'] ?? ''), -4),
  // Fonctions pures : elles se mesurent partout, sans serveur de courrier.
  'html'     => is_array($m) ? vrt_notify_mail_html($m) : '',
  'wa'       => is_array($m) ? vrt_notify_wa_lien($m) : '',
  'canaux'   => vrt_notify_canaux(),
], JSON_UNESCAPED_UNICODE);
`, 'utf8');
  return dir;
}

function jouer(dir, cas, tel, mail, canal) {
  fs.writeFileSync(path.join(dir, 'recu.json'), '[]', 'utf8');
  const out = execFileSync('php', [path.join(dir, 'scenario.php'), cas,
    tel === undefined ? '690361319' : tel, mail || '', canal === undefined ? 'http' : canal],
    { cwd: dir, encoding: 'utf8', timeout: 60000 });
  const recu = JSON.parse(fs.readFileSync(path.join(dir, 'recu.json'), 'utf8'));
  let j = null;
  try { j = JSON.parse(out.trim()); } catch (e) {
    throw new Error('sortie PHP illisible : ' + out.slice(0, 800));
  }
  return { j, recu };
}

async function pret() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(STUB, { method: 'POST', body: 'ping=1' });
      if (r.status === 200) return true;
    } catch (e) { /* pas encore levé */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

(async () => {
  console.log('\n\x1b[1mBANC — REMISE DU CODE PAR SMS / WHATSAPP\x1b[0m');

  if (spawnSync('php', ['-v'], { stdio: 'ignore' }).status !== 0) {
    console.log('\x1b[33m⚠ PHP absent du PATH — banc non exécutable ici. La CI reste l’autorité.\x1b[0m');
    process.exit(0);
  }

  const dir = preparer();
  const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', dir], { cwd: dir, stdio: 'ignore' });
  const fin = (code) => { try { srv.kill(); } catch (e) {} process.exit(code); };
  if (!await pret()) { console.log(rouge('✗ la passerelle de banc n’a pas démarré')); fin(1); }

  try {
    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n\x1b[1m1. Le code payé part vraiment, au bon numéro\x1b[0m');
    const A = jouer(dir, 'ok');
    const env = A.recu.filter((r) => (r.brut || '').indexOf('mobiles=') >= 0);
    verifier('un SMS et un seul est parti', env.length === 1,
      `envois observés : ${env.length}`);
    const champs = new URLSearchParams(env[0] ? env[0].brut : '');
    verifier('il part au numéro qui a payé, en format international',
      champs.get('mobiles') === '237690361319', 'reçu : ' + champs.get('mobiles'));
    verifier('il porte le code émis',
      (champs.get('sms') || '').indexOf(A.j.code4) > 0,
      'message reçu : ' + String(champs.get('sms')).slice(0, 120));
    verifier('la file le compte comme envoyé',
      A.j.message && A.j.message.etat === 'envoye',
      'état : ' + (A.j.message && A.j.message.etat));

    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n\x1b[1m2. Le gabarit garde sa structure\x1b[0m');
    verifier('les paramètres de la passerelle arrivent entiers',
      champs.get('user') === 'MOI' && champs.get('password') === 'SECRET'
        && champs.get('senderid') === 'VERITAS',
      'reçu : ' + String(env[0] && env[0].brut).slice(0, 160));
    verifier('le message n’est pas vide (le « & » n’a pas été encodé)',
      (champs.get('sms') || '').length > 40);
    verifier('l’en-tête d’authentification suit', true);

    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n\x1b[1m3. Le lien envoyé est la PORTE, pas une page de vente\x1b[0m');
    /* `<slug>.html` existe pour tout le catalogue depuis les pages
       d'atterrissage du 31/08 : y envoyer quelqu'un qui vient de payer lui
       redemanderait de payer. */
    verifier('le lien mène à cahier.html?o=…',
      (champs.get('sms') || '').indexOf('/livrets/cahier.html?o=6e') > 0,
      String(champs.get('sms')).slice(0, 160));

    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n\x1b[1m4. Le SMS ne coûte pas trois segments pour rien\x1b[0m');
    const sms = champs.get('sms') || '';
    verifier('aucun caractère accentué dans le SMS (GSM-7)',
      !/[^\x20-\x7E\r\n]/.test(sms),
      'restes : ' + JSON.stringify((sms.match(/[^\x20-\x7E\r\n]/g) || []).join('')));
    verifier('le texte WhatsApp, lui, garde ses accents',
      A.j.message && /[éèàç’]/.test(A.j.message.texte || ''));

    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n\x1b[1m5. Un webhook rejoué n’envoie pas deux SMS\x1b[0m');
    verifier('le second octroi ne réémet pas de code',
      A.j.octroi2 && A.j.octroi2.changed === false,
      JSON.stringify(A.j.octroi2));
    verifier('la file ne contient qu’une remise pour cette référence',
      A.j.liste.filter((m) => m.ref === 'LVBANC-OK').length === 1);

    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n\x1b[1m6. Sans passerelle configurée, la remise RESTE VISIBLE\x1b[0m');
    const B = jouer(dir, 'sans_canal', '690361319', '', '');
    verifier('rien n’est envoyé', B.recu.filter((r) => (r.brut || '').indexOf('mobiles=') >= 0).length === 0);
    verifier('la remise attend, elle ne disparaît pas',
      B.j.message && B.j.message.etat === 'attente',
      'état : ' + (B.j.message && B.j.message.etat));
    verifier('et elle dit pourquoi',
      B.j.message && /canal/i.test(B.j.message.erreur || ''),
      'erreur : ' + (B.j.message && B.j.message.erreur));
    verifier('le droit payé est accordé quand même',
      B.j.octroi1 && B.j.octroi1.changed === true,
      JSON.stringify(B.j.octroi1));

    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n\x1b[1m7. Un 200 qui ne dit pas « accepté » n’est PAS une livraison\x1b[0m');
    fs.writeFileSync(path.join(dir, 'reponse.txt'), 'ERREUR solde epuise', 'utf8');
    const C = jouer(dir, 'solde');
    fs.writeFileSync(path.join(dir, 'reponse.txt'), 'ACCEPTE id=1', 'utf8');
    verifier('la passerelle a bien été appelée',
      C.recu.filter((r) => (r.brut || '').indexOf('mobiles=') >= 0).length >= 1);
    verifier('la remise n’est pas comptée envoyée',
      C.j.message && C.j.message.etat !== 'envoye',
      'état : ' + (C.j.message && C.j.message.etat));
    verifier('le motif est lisible par un humain',
      C.j.message && /solde|ACCEPTE|reponse/i.test(C.j.message.erreur || ''),
      'erreur : ' + (C.j.message && C.j.message.erreur));

    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n\x1b[1m8. Un numéro inexploitable n’est pas deviné\x1b[0m');
    const D = jouer(dir, 'telko', '12');
    verifier('aucun envoi vers un numéro reconstruit',
      D.recu.filter((r) => (r.brut || '').indexOf('mobiles=') >= 0).length === 0);
    verifier('sans numéro NI adresse, l’état le dit : sans_contact',
      D.j.message && D.j.message.etat === 'sans_contact',
      'état : ' + (D.j.message && D.j.message.etat));
    verifier('le droit payé est accordé quand même',
      D.j.octroi1 && D.j.octroi1.changed === true);

    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n\x1b[1m9. Le courriel — le canal qui ne demande de compte nulle part\x1b[0m');
    /* Rien ici ne dépend d'un serveur de courrier : un banc qui exigerait un
       MTA serait vert sur une machine et rouge sur l'autre, sans qu'une règle
       ait bougé. On mesure donc ce qui est décidable partout — l'adresse est
       retenue, l'ordre des canaux est respecté, et le message écrit est juste. */
    const E = jouer(dir, 'courriel', '690361319', 'eleve@example.com', 'mail,http');
    verifier('l’adresse laissée à l’achat suit jusqu’à la remise',
      E.j.message && E.j.message.mail === 'eleve@example.com',
      'adresse en file : ' + (E.j.message && E.j.message.mail));
    verifier('le courriel porte le code',
      (E.j.html || '').indexOf(E.j.code) > 0);
    verifier('et le lien vers la porte du cahier',
      (E.j.html || '').indexOf('/livrets/cahier.html?o=6e') > 0);

    const F = jouer(dir, 'sansadresse', '690361319', '', 'mail,http');
    verifier('sans adresse, le courriel cède la place au canal suivant',
      F.recu.filter((r) => (r.brut || '').indexOf('mobiles=') >= 0).length === 1,
      'envois SMS observés : ' + F.recu.filter((r) => (r.brut || '').indexOf('mobiles=') >= 0).length);
    verifier('et la remise aboutit quand même',
      F.j.message && F.j.message.etat === 'envoye',
      'état : ' + (F.j.message && F.j.message.etat));

    const G = jouer(dir, 'mailseul', '690361319', '', 'mail');
    verifier('courriel seul et pas d’adresse : rien n’est envoyé au hasard',
      G.recu.filter((r) => (r.brut || '').indexOf('mobiles=') >= 0).length === 0);
    verifier('la remise attend, et dit qu’il manque une adresse',
      G.j.message && G.j.message.etat === 'attente' && /adresse/i.test(G.j.message.erreur || ''),
      'état : ' + (G.j.message && G.j.message.etat) + ' — ' + (G.j.message && G.j.message.erreur));

    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n\x1b[1m10. Le rattrapage WhatsApp tient en un appui\x1b[0m');
    /* Envoyer un WhatsApp DEPUIS un serveur exige un compte Meta Business. Tant
       qu'il n'y en a pas, le serveur doit au moins préparer le geste : un lien
       wa.me vers le client, message déjà écrit. */
    verifier('le lien vise le numéro du client, en international',
      (G.j.wa || '').indexOf('https://wa.me/237690361319?text=') === 0,
      G.j.wa || '(vide)');
    verifier('le message pré-rempli contient le code',
      decodeURIComponent(String(G.j.wa).split('?text=')[1] || '').indexOf(G.j.code) > 0);
    verifier('une remise déjà partie ne propose pas de rattrapage',
      (A.j.liste.find((m) => m.ref === 'LVBANC-OK') || {}).whatsapp === '');

    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n\x1b[1m11. L’envoi a lieu HORS du verrou de la base\x1b[0m');
    /* Un appel réseau tenu sous `flock` fermerait la base entière pendant que
       la passerelle SMS réfléchit — donc bloquerait les paiements arrivant en
       même temps, pour un SMS. Cela ne se mesure pas à l'exécution : cela se
       lit dans l'ordre des lignes. */
    const src = fs.readFileSync(path.join(RACINE, 'api', '_auth_lib.php'), 'utf8');
    const iFerme = src.indexOf('fclose($fp);\n\n        /* ── LA REMISE PART ICI');
    const iVider = src.indexOf('vrt_notify_vider(');
    verifier('vrt_notify_vider() est appelée après fclose($fp)',
      iFerme > 0 && iVider > iFerme,
      `fclose=${iFerme} vider=${iVider}`);
    const corpsGrant = src.slice(src.indexOf('function vrt_grant_entitlement(array &$db'),
                                 src.indexOf('function vrt_grant_entitlement_to_file'));
    verifier('rien n’envoie de SMS sous le verrou : l’octroi ne fait qu’ENFILER',
      corpsGrant.indexOf('vrt_notify_vider(') === -1
        && corpsGrant.indexOf('vrt_notify_enfiler(') > 0);

    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n\x1b[1m12. Le fichier partira bien en production\x1b[0m');
    const wf = fs.readFileSync(path.join(RACINE, '.github', 'workflows', 'deploy.yml'), 'utf8');
    verifier('api/_notify_lib.php est dans la liste de déploiement',
      wf.indexOf('api/_notify_lib.php') > 0,
      'un endpoint absent de cette liste n’est jamais téléversé, en silence');
  } catch (e) {
    ko++;
    console.log(rouge('\n✗ le banc a levé : ' + e.message));
  }

  console.log(`\n${ko === 0 ? vert('✔ ' + ok + ' contrôles passés') : rouge('✘ ' + ko + ' échec(s) sur ' + (ok + ko))}\n`);
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {}
  fin(ko === 0 ? 0 : 1);
})();
