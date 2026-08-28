#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_compte_serveur.cjs — LE COMPTE CRÉÉ SUR LE SITE EXISTE-T-IL
   AILLEURS QUE DANS CE NAVIGATEUR ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_compte_serveur.cjs

   CE QU'IL PROTÈGE
   L'Atelier de Français promet : « inscrivez-vous sur veritas-school.com, puis
   revenez ici avec le même identifiant. » Le 28/08/2026 cette phrase était
   fausse pour TOUT LE MONDE, et pour une raison qu'aucun test existant ne
   pouvait voir : `doRegister()` rangeait le compte dans `DB.visitorAccounts`
   puis appelait `save()` — localStorage — et s'arrêtait là. `_fbFetch`
   court-circuite api/db.php pour quiconque n'est ni admin ni enseignant, donc
   AUCUNE requête ne partait. Le compte n'existait que sur un appareil.
   `plateforme.php?action=session`, lui, lit `data/veritas_db.json` côté
   SERVEUR : il ne trouvait rien et répondait « Identifiants invalides » à un
   inscrit qui tapait pourtant le bon mot de passe.

   Le banc frère `banc_mdp_inter_sites.cjs` vérifie que les deux moitiés
   s'accordent sur la FORME du mot de passe. Il passait au vert pendant tout
   l'incident : les empreintes étaient justes, mais dans une base que le
   serveur ne voit pas. Celui-ci vérifie donc l'autre moitié du contrat — que
   le compte ARRIVE, et qu'il SURVIT.

   MÉTHODE — rien n'est simulé côté serveur : on monte un bac à sable, on y
   lance un vrai `php -S`, et on parle à api/compte.php et api/db.php par HTTP.
   La vérification de connexion emprunte ensuite le chemin exact de
   `plateforme.php?action=session` : vrt_find_account + vrt_verify_password.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawn } = require('child_process');

const RACINE = path.resolve(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => {
  b ? ok++ : ko++;
  console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : ''));
};

const PORT = 8791 + (process.pid % 90);
const BASE = 'http://127.0.0.1:' + PORT;
const SECRET = 'banc-compte-serveur-' + Math.random().toString(36).slice(2, 12);
const BAC = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-banc-compte-'));

/* Le bac à sable reçoit UNE COPIE des endpoints réels : ce sont eux qu'on
   mesure, pas une réécriture. Seul `payment_config.php` est fabriqué, pour
   donner au banc un secret de synchronisation connu (le vrai est gitignoré,
   et absent de la CI). */
const FICHIERS = ['compte.php', 'db.php', '_json_boot.php', 'config_sync.php',
  '_auth_lib.php', '_livret_lib.php', '_sentinel.php', '_bot_log.php'];

function monterBac() {
  fs.mkdirSync(path.join(BAC, 'api'), { recursive: true });
  fs.mkdirSync(path.join(BAC, 'data'), { recursive: true });
  for (const f of FICHIERS) {
    const src = path.join(RACINE, 'api', f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(BAC, 'api', f));
  }
  fs.writeFileSync(path.join(BAC, 'api', 'payment_config.php'),
    "<?php define('API_SECRET', " + JSON.stringify(SECRET) + ");\n");
  /* Base volontairement PETITE : au-delà de 50 Ko, db.php refuse tout payload
     de moins de 2 Ko (garde anti-écrasement). On mesure la préservation des
     comptes, pas cette garde-là — qui a son propre motif. */
  fs.writeFileSync(path.join(BAC, 'data', 'veritas_db.json'), JSON.stringify({
    school: { nom: 'VÉRITAS' },
    students: [], studentAccounts: [], visitorAccounts: [],
    lastModified: 1000,
  }));
}

let serveur = null;
async function lancerServeur() {
  serveur = spawn('php', ['-S', '127.0.0.1:' + PORT, '-t', BAC],
    { cwd: BAC, stdio: ['ignore', 'ignore', 'ignore'] });
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(BASE + '/api/compte.php?action=inscription', { method: 'POST', body: '{}' });
      if (r.status) return true;
    } catch (e) { await new Promise(s => setTimeout(s, 150)); }
  }
  return false;
}

const lireBase = () => JSON.parse(fs.readFileSync(path.join(BAC, 'data', 'veritas_db.json'), 'utf8'));

async function inscrire(corps) {
  const r = await fetch(BASE + '/api/compte.php?action=inscription', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corps),
  });
  let j = {}; try { j = await r.json(); } catch (e) {}
  return { http: r.status, j };
}

function php64(v) {
  return "base64_decode('" + Buffer.from(String(v), 'utf8').toString('base64') + "')";
}

/* Le chemin EXACT de plateforme.php?action=session (lignes « SESSION —
   identifiants contre la base ») : on cherche le compte, puis on vérifie le
   mot de passe. Si ces deux appels disent oui, l'Atelier ouvre. */
function atelierOuvre(login, motDePasse) {
  const src = `require ${JSON.stringify(path.join(BAC, 'api', '_auth_lib.php'))};
$db = json_decode(file_get_contents(${JSON.stringify(path.join(BAC, 'data', 'veritas_db.json'))}), true);
$t = vrt_find_account($db, ${php64(login)});
if (!$t) { echo json_encode(['trouve' => false, 'ok' => false]); exit; }
$maj = false;
$ok = vrt_verify_password(${php64(motDePasse)}, (string)($t['acc']['pwd'] ?? ''), (string)($t['acc']['user'] ?? ''), $maj);
echo json_encode(['trouve' => true, 'ok' => $ok, 'type' => $t['type']]);`;
  return JSON.parse(execFileSync('php', ['-r', src], { encoding: 'utf8' }).trim());
}

async function synchroAdmin(payload) {
  const r = await fetch(BASE + '/api/db.php', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SECRET },
    body: JSON.stringify(payload),
  });
  let j = {}; try { j = await r.json(); } catch (e) {}
  return { http: r.status, j };
}

(async () => {
  console.log(`\n${G}LE COMPTE CRÉÉ SUR LE SITE ARRIVE-T-IL AU SERVEUR ?${R}\n`);
  monterBac();
  if (!await lancerServeur()) {
    console.log('  ' + X + ' impossible de lancer php -S sur le port ' + PORT);
    process.exit(1);
  }

  try {
    // ── ① Une inscription atteint la base du serveur ────────────────────────
    console.log(`${G}① L'inscription franchit la frontière${R}`);
    const MDP = 'MonMotDePasse2026';
    const r1 = await inscrire({ user: 'ens_test', motDePasse: MDP, nom: 'Takou', pre: 'Jean',
      tel: '697000000', cls: '3ème', role: 'enseignant', discipline: 'Français' });
    dire(r1.http === 201 && r1.j.ok === true, 'api/compte.php crée le compte (201)',
      'HTTP ' + r1.http + ' ' + JSON.stringify(r1.j));

    const base1 = lireBase();
    const cree = (base1.visitorAccounts || []).find(a => a.user === 'ens_test');
    dire(!!cree, 'le compte est ÉCRIT dans data/veritas_db.json',
      'visitorAccounts = ' + JSON.stringify(base1.visitorAccounts || []));

    // ── ② Le mot de passe n'est jamais au repos en clair ────────────────────
    console.log(`\n${G}② Le mot de passe au repos${R}`);
    dire(!!cree && typeof cree.pwd === 'string' && cree.pwd.startsWith('$2y$'),
      'stocké en bcrypt', cree ? String(cree.pwd).slice(0, 12) : 'compte absent');
    dire(!!cree && String(cree.pwd).indexOf(MDP) < 0,
      'le mot de passe en clair n’apparaît nulle part dans l’enregistrement');

    // ── ③ Ce compte ouvre bien l'Atelier ────────────────────────────────────
    console.log(`\n${G}③ L'Atelier reconnaît ce compte${R}`);
    const s1 = atelierOuvre('ens_test', MDP);
    dire(s1.trouve === true, 'vrt_find_account le trouve (le 401 « invalides » disparaît)');
    dire(s1.ok === true, 'vrt_verify_password accepte le mot de passe du site',
      JSON.stringify(s1));

    // ── ④ Et refuse ce qu'il doit refuser ───────────────────────────────────
    console.log(`\n${G}④ Ce qui doit être refusé l'est${R}`);
    const s2 = atelierOuvre('ens_test', 'PasLeBon2026');
    dire(s2.ok === false, 'un mauvais mot de passe est refusé (sinon ③ ne prouverait rien)');
    const s3 = atelierOuvre('personne_du_tout', MDP);
    dire(s3.trouve === false, 'un identifiant inconnu reste inconnu');

    // ── ⑤ Unicité réelle, plus seulement locale ─────────────────────────────
    console.log(`\n${G}⑤ Deux appareils ne peuvent plus prendre le même identifiant${R}`);
    const r2 = await inscrire({ user: 'ens_test', motDePasse: 'AutreMotDePasse9', nom: 'Autre', pre: 'Personne' });
    dire(r2.http === 409, 'identifiant déjà pris → 409', 'HTTP ' + r2.http);
    const doublons = (lireBase().visitorAccounts || []).filter(a => a.user === 'ens_test').length;
    dire(doublons === 1, 'aucun doublon écrit dans la base', doublons + ' enregistrement(s)');

    // ── ⑥ Remontée idempotente des comptes d'avant le correctif ─────────────
    console.log(`\n${G}⑥ Remontée d'un compte déjà connu (rattrapage)${R}`);
    const r3 = await inscrire({ user: 'ens_test', motDePasse: MDP, nom: 'Takou', pre: 'Jean' });
    dire(r3.http === 200 && r3.j.ok === true && r3.j.existe === true,
      'même identifiant + BON mot de passe → 200 existe:true', 'HTTP ' + r3.http + ' ' + JSON.stringify(r3.j));
    dire((lireBase().visitorAccounts || []).filter(a => a.user === 'ens_test').length === 1,
      'la remontée n’ajoute pas un second compte');

    // ── ⑦ Le client ne s'octroie pas de droits ──────────────────────────────
    console.log(`\n${G}⑦ Le navigateur ne décide pas de ses droits${R}`);
    await inscrire({ user: 'malin', motDePasse: 'MotDePasse123', nom: 'M', pre: 'M',
      plans: ['premium'], inscriptionPayee: true, statut: 'actif', role: 'superadmin',
      srvAt: 1, id: 'va_force' });
    const malin = (lireBase().visitorAccounts || []).find(a => a.user === 'malin');
    dire(!!malin && Array.isArray(malin.plans) && malin.plans.length === 0,
      '`plans` envoyé par le client est ignoré', malin ? JSON.stringify(malin.plans) : 'absent');
    dire(!!malin && malin.role !== 'superadmin', 'un rôle inconnu retombe sur « eleve »',
      malin ? malin.role : 'absent');
    dire(!!malin && malin.id !== 'va_force', 'l’identifiant interne est fixé par le serveur',
      malin ? malin.id : 'absent');

    // ── ⑧ Le format des nouveaux identifiants ───────────────────────────────
    console.log(`\n${G}⑧ Format d'identifiant : même règle des deux côtés${R}`);
    const r4 = await inscrire({ user: 'jean@mail.com', motDePasse: 'MotDePasse123', nom: 'J', pre: 'J' });
    dire(r4.http === 400, 'un identifiant hors-norme est refusé à la création', 'HTTP ' + r4.http);
    const appjs = fs.readFileSync(path.join(RACINE, 'app.js'), 'utf8');
    dire(/\/\^\[A-Za-z0-9\._-\]\{3,32\}\$\/\.test\(user\)/.test(appjs),
      'app.js applique la MÊME règle avant d’annoncer « compte créé »');

    // ── ⑨ La synchro admin n'efface plus les inscrits ───────────────────────
    console.log(`\n${G}⑨ Une synchro administrateur ne fait pas disparaître un inscrit${R}`);
    const avant = lireBase();
    const recent = (avant.visitorAccounts || []).find(a => a.user === 'ens_test');
    /* La copie de l'admin est ANTÉRIEURE à l'inscription : c'est le cas réel —
       il a chargé sa page, un visiteur s'est inscrit pendant ce temps, il
       enregistre. Sans préservation, l'inscrit disparaît ici. */
    const copieAdmin = {
      school: { nom: 'VÉRITAS' }, students: [], studentAccounts: [],
      visitorAccounts: [{ id: 'va_admin', user: 'eleve_admin', nom: 'Connu', pre: 'De l’admin',
        pwd: 'S256$' + 'a'.repeat(64), plans: [] }],
      lastModified: (recent && recent.srvAt ? recent.srvAt : Date.now()) - 1,
    };
    const sync1 = await synchroAdmin(copieAdmin);
    dire(sync1.http === 200 && sync1.j.ok === true, 'la synchro admin est acceptée',
      'HTTP ' + sync1.http + ' ' + JSON.stringify(sync1.j));
    const apres = lireBase();
    const survit = (apres.visitorAccounts || []).find(a => a.user === 'ens_test');
    dire(!!survit, 'le compte inscrit entre-temps SURVIT à la synchro',
      'visitorAccounts = ' + (apres.visitorAccounts || []).map(a => a.user).join(', '));
    dire(!!(apres.visitorAccounts || []).find(a => a.user === 'eleve_admin'),
      'le compte apporté par l’admin est bien là, lui aussi');
    const s4 = atelierOuvre('ens_test', MDP);
    dire(s4.ok === true, 'et il ouvre TOUJOURS l’Atelier après la synchro', JSON.stringify(s4));

    // ── ⑩ Mais une suppression volontaire reste possible ────────────────────
    console.log(`\n${G}⑩ L'administration peut toujours supprimer un compte${R}`);
    const copieAdmin2 = {
      school: { nom: 'VÉRITAS' }, students: [], studentAccounts: [],
      visitorAccounts: [{ id: 'va_admin', user: 'eleve_admin', nom: 'Connu', pre: 'De l’admin',
        pwd: 'S256$' + 'a'.repeat(64), plans: [] }],
      // Copie POSTÉRIEURE au compte : l'admin le connaissait et l'a retiré.
      lastModified: Date.now() + 60000,
    };
    const sync2 = await synchroAdmin(copieAdmin2);
    dire(sync2.http === 200, 'la seconde synchro passe', 'HTTP ' + sync2.http);
    dire(!(lireBase().visitorAccounts || []).find(a => a.user === 'ens_test'),
      'un compte que l’admin a sciemment retiré ne ressuscite pas');

    // ── ⑪ Le contrat client → serveur ───────────────────────────────────────
    console.log(`\n${G}⑪ Le navigateur appelle vraiment cet endpoint${R}`);
    dire(/compte\.php\?action=inscription/.test(appjs),
      'app.js poste sur compte.php?action=inscription');
    dire(/user:acc\.user,\s*motDePasse:pwdClair/.test(appjs),
      'il envoie les NOMS de champs attendus (user + motDePasse)');
    const iAppel = appjs.indexOf('_compteServeurEnregistrer(acc, pwd)');
    const iPush = appjs.indexOf('DB.visitorAccounts.push(acc)');
    dire(iAppel > 0 && iPush > 0 && iAppel < iPush,
      'le serveur est consulté AVANT l’écriture locale (pas de compte fantôme)');
    dire(/_compteRemonter\(va2,p\)/.test(appjs),
      'une connexion réussie rejoue la remontée des comptes d’avant le correctif');

    // ── ⑫ Le fichier partira-t-il en production ? ───────────────────────────
    console.log(`\n${G}⑫ L'endpoint sera bien déployé${R}`);
    const dep = fs.readFileSync(path.join(RACINE, '.github', 'workflows', 'deploy.yml'), 'utf8');
    dire(/api\/compte\.php/.test(dep), 'api/compte.php est dans l’allow-list de deploy.yml');
    let suivi = '';
    try {
      suivi = execFileSync('git', ['ls-files', 'api/compte.php'], { cwd: RACINE, encoding: 'utf8' }).trim();
    } catch (e) {}
    dire(suivi === 'api/compte.php',
      'api/compte.php est suivi par git (sinon la CI l’ignore en silence)', suivi || 'non suivi');

  } finally {
    if (serveur) serveur.kill();
    try { fs.rmSync(BAC, { recursive: true, force: true }); } catch (e) {}
  }

  console.log(`\n${G}${ok} contrôle(s) au vert, ${ko} au rouge.${R}\n`);
  process.exit(ko === 0 ? 0 : 1);
})();
