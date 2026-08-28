#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_mdp_inter_sites.cjs — LE MOT DE PASSE DU SITE OUVRE-T-IL L'ATELIER ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_mdp_inter_sites.cjs

   CE QU'IL PROTÈGE
   L'Atelier dit à l'enseignant : « L'inscription se fait sur veritas-school.com,
   puis vous revenez ici avec le même identifiant. » Cette phrase engage DEUX
   programmes qui ne se parlent pas :

     app.js         fabrique le mot de passe stocké, dans le navigateur ;
     api/plateforme.php  le vérifie, sur le serveur, via vrt_verify_password.

   Ils n'ont aucun appel en commun. Rien ne signale leur désaccord : l'inscrit
   saisit le BON mot de passe et se voit refuser, sans explication. C'est
   arrivé — `doRegister()` rangeait le mot de passe EN CLAIR, et le serveur
   rejette explicitement le clair. La phrase était fausse pour tout compte neuf,
   et ne devenait vraie qu'après le passage de `_migratePasswords()` dans le
   navigateur d'un administrateur, puis une synchro.

   CE QU'IL VÉRIFIE, DANS LES DEUX SENS
     ① le hash que le navigateur produit est accepté par le serveur ;
     ② le hash que le SERVEUR produit est accepté par le navigateur ;
     ③ un mot de passe en clair est REFUSÉ — c'est le défaut qu'on vient de
       corriger, et le banc doit rougir s'il revient ;
     ④ un mauvais mot de passe est refusé (sinon ① ne prouverait rien) ;
     ⑤ le sel est bien l'identifiant : le même mot de passe sous deux comptes
       donne deux empreintes différentes.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const crypto = require('crypto');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const RACINE = path.resolve(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => {
  b ? ok++ : ko++;
  console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : ''));
};

/* Réplique EXACTE de `hashPassword` (app.js), qui tourne dans le navigateur :
     'S256$' + sha256(pwd + '$' + (salt || 'VERITAS') + '$2026')
   Le sel est l'identifiant du compte. On la réécrit ici plutôt que de charger
   app.js (3,4 Mo, et il attend un DOM) — mais elle est vérifiée contre le
   fichier réel juste après, sinon ce banc mesurerait sa propre copie. */
function hashNavigateur(pwd, sel) {
  const data = pwd + '$' + (sel || 'VERITAS') + '$2026';
  return 'S256$' + crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

/* Les valeurs partent en base64. `JSON.stringify` produit des chaînes entre
   GUILLEMETS DOUBLES, et PHP y interpole les variables : une empreinte
   « S256$d7f89… » devenait la variable `$d7f89…`, vide, et le banc comparait
   contre du néant au lieu de comparer contre le hash. Encodée, la chaîne ne
   peut plus rien déclencher — quel que soit le mot de passe testé. */
function php64(v) {
  return "base64_decode('" + Buffer.from(String(v), 'utf8').toString('base64') + "')";
}

/** Demande à PHP ce que le serveur pense d'un couple (clair, stocké). */
function serveurAccepte(clair, stocke, sel) {
  const src = `require ${JSON.stringify(path.join(RACINE, 'api', '_auth_lib.php'))};
$maj = false;
$ok = vrt_verify_password(${php64(clair)}, ${php64(stocke)}, ${php64(sel)}, $maj);
echo json_encode(['ok' => $ok, 'maj' => $maj]);`;
  return JSON.parse(execFileSync('php', ['-r', src], { encoding: 'utf8' }).trim());
}

/** Ce que le SERVEUR produirait comme empreinte, pour comparer aux deux sens. */
function hashServeur(clair, sel) {
  const src = `require ${JSON.stringify(path.join(RACINE, 'api', '_auth_lib.php'))};
echo vrt_hash_s256(${php64(clair)}, ${php64(sel)});`;
  return execFileSync('php', ['-r', src], { encoding: 'utf8' }).trim();
}

console.log(`\n${G}LE MOT DE PASSE DU SITE OUVRE-T-IL L'ATELIER ?${R}\n`);

if (spawnSync('php', ['-v'], { stdio: 'ignore' }).status !== 0) {
  console.log('\x1b[33m⚠ PHP absent du PATH — banc non exécutable ici.\x1b[0m');
  process.exit(0);
}

/* ── 0. La copie de la fonction est-elle fidèle à app.js ? ─────────────────
   Un banc qui teste sa propre réécriture ne teste rien. On relit la formule
   dans le fichier réel et on vérifie qu'elle n'a pas bougé. */
console.log(`${G}0. La réplique est fidèle au code du navigateur${R}`);
const appjs = require('fs').readFileSync(path.join(RACINE, 'app.js'), 'utf8');
const iH = appjs.indexOf('async function hashPassword(');
const corps = iH >= 0 ? appjs.slice(iH, iH + 700) : '';
dire(/enc\.encode\(pwd\s*\+\s*'\$'\s*\+\s*\(salt\|\|'VERITAS'\)\s*\+\s*'\$2026'\)/.test(corps),
  'app.js compose bien « pwd$sel$2026 »');
dire(/'S256\$'\s*\+/.test(corps), 'app.js préfixe bien « S256$ »');
dire(/digest\('SHA-256'/.test(corps), 'app.js hache bien en SHA-256');

console.log(`\n${G}1. ① Le hash du navigateur ouvre la porte du serveur${R}`);
const CAS = [
  ['nkolo', 'MonMotDePasse6'],
  ['awa.mbala', 'école2026'],           // accents : encodage UTF-8 des deux côtés
  ['prof_etoa', 'a b c 1 2 3'],         // espaces
  ['user-3', '«guillemets»&<>'],        // ponctuation française et HTML
];
for (const [user, mdp] of CAS) {
  const stocke = hashNavigateur(mdp, user);
  const r = serveurAccepte(mdp, stocke, user);
  dire(r.ok === true, `« ${user} » se connecte avec son mot de passe`, JSON.stringify(r));
}

console.log(`\n${G}2. ② Les deux empreintes sont identiques, caractère pour caractère${R}`);
for (const [user, mdp] of CAS) {
  dire(hashNavigateur(mdp, user) === hashServeur(mdp, user),
    `« ${user} » — navigateur et serveur produisent la même empreinte`);
}

console.log(`\n${G}3. ③ Un mot de passe EN CLAIR est refusé${R}`);
/* C'est le défaut corrigé le 28/08 : `doRegister()` rangeait le clair, et le
   serveur le rejette. Si ce contrôle passe au vert « accepté », c'est que la
   porte s'est ouverte à tout le monde ; s'il repasse au rouge côté site, c'est
   que l'inscription a recommencé à ranger du clair. */
const clairRefuse = serveurAccepte('MonMotDePasse6', 'MonMotDePasse6', 'nkolo');
dire(clairRefuse.ok === false,
  'le serveur refuse un mot de passe stocké en clair — donc l’inscription DOIT hacher',
  JSON.stringify(clairRefuse));

console.log(`\n${G}4. L'inscription du site hache bien avant de ranger${R}`);
/* Le contrôle qui aurait attrapé la panne : on lit le code d'inscription et on
   exige qu'il ne range pas la valeur brute du champ. */
const iR = appjs.indexOf('async function doRegister(');
const reg = iR >= 0 ? appjs.slice(iR, iR + 4000) : '';
dire(iR >= 0, 'doRegister() est asynchrone (le hachage l’exige)');
dire(/hashPassword\(pwd\s*,\s*user\)/.test(reg),
  'doRegister() hache le mot de passe avec l’identifiant pour sel');
dire(!/user:user,\s*pwd:pwd\b/.test(reg),
  'doRegister() ne range plus la valeur brute du champ');
const iM = appjs.indexOf('async function _mgrCreate(');
const mgr = iM >= 0 ? appjs.slice(iM, iM + 3000) : '';
dire(/hashPassword\(pwd\s*,\s*user\)/.test(mgr),
  'un compte créé depuis l’administration est haché lui aussi');

console.log(`\n${G}5. ④⑤ Ce qui doit échouer échoue${R}`);
const mauvais = serveurAccepte('PasLeBon', hashNavigateur('MonMotDePasse6', 'nkolo'), 'nkolo');
dire(mauvais.ok === false, 'un mauvais mot de passe est refusé');
const autreSel = serveurAccepte('MonMotDePasse6', hashNavigateur('MonMotDePasse6', 'nkolo'), 'awa');
dire(autreSel.ok === false,
  'le même mot de passe sous un AUTRE identifiant ne passe pas — le sel sert');
dire(hashNavigateur('x', 'a') !== hashNavigateur('x', 'b'),
  'deux comptes avec le même mot de passe ont deux empreintes distinctes');

/* Un compte encore en S256 doit demander sa promotion vers bcrypt : c'est ce
   drapeau qui déclenche la migration au repos côté serveur. */
console.log(`\n${G}6. Le serveur demande la promotion vers bcrypt${R}`);
const r6 = serveurAccepte('MonMotDePasse6', hashNavigateur('MonMotDePasse6', 'nkolo'), 'nkolo');
dire(r6.maj === true, 'un compte S256 authentifié est signalé « à migrer en bcrypt »');

console.log('\n' + '─'.repeat(68));
if (ko) { console.log(`\x1b[31m${G}  ${X} ${ko} contrôle(s) en échec sur ${ok + ko}${R}`); process.exit(1); }
console.log(`\x1b[32m${G}  ✓ ${ok}/${ok} — le compte du site ouvre bien l'Atelier.${R}`);
