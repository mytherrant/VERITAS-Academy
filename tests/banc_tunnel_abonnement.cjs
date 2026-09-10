#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_tunnel_abonnement.cjs — LE CORPUS SE FERME-T-IL, ET S'OUVRE-T-IL
   VRAIMENT AU PAIEMENT ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_tunnel_abonnement.cjs

   CE QU'IL PROTÈGE — LE MAILLON QUE PERSONNE NE MESURAIT
   `tests/paiements_entitlements.php` vérifie déjà qu'un paiement au bon tarif
   écrit le plan dans `acc.plans`, et qu'un paiement insuffisant ne l'écrit pas.
   Il s'arrête là. Or entre « le plan est actif sur le compte » et « le texte
   descend dans le navigateur de l'enseignant », il reste TROIS fonctions où un
   nom peut diverger sans que rien ne le signale :

       plat_plans_atelier()  →  plat_droit()  →  plat_palier_de()  →  plat_paliers()

   Un plan écrit sous un nom que `plat_plans_atelier()` ne cherche pas, un motif
   que `plat_palier_de()` ne reconnaît pas, un palier absent de la table : dans
   les trois cas le paiement réussit, le droit s'écrit, et le client reçoit
   toujours 402. « Il a payé, rien ne s'ouvre » — et rien dans les journaux ne
   distingue ce cas d'un impayé.

   Ce banc mesure donc le tunnel ENTIER, en HTTP réel, sur le corps du texte :

       invité → 402 → promotion → 402 → paiement → 200 + le texte intégral

   Depuis le 09/09/2026 une étape s'y est ajoutée — l'invité devient titulaire
   au moment de payer (`?action=promouvoir`). C'est elle qui fournit désormais
   l'`accountId` sans lequel `vrt_grant_entitlement()` n'écrit NULLE PART : ce
   banc est ce qui garantit que le maillon neuf porte bien la chaîne.

   MÉTHODE — rien n'est simulé. Bac à sable, vrai `php -S`, vrai
   `vrt_grant_entitlement()` appelé en PHP CLI sur la base du bac (le chemin
   qu'emprunte le webhook CamerPay), et le corpus redemandé par HTTP.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, execFileSync } = require('child_process');

const RACINE = path.resolve(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => {
  b ? ok++ : ko++;
  console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : ''));
};

const PORT = 8991 + (process.pid % 90);
const BASE = 'http://127.0.0.1:' + PORT;
const SECRET = 'banc-tunnel-' + Math.random().toString(36).slice(2, 12);
const BAC = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-banc-tunnel-'));

/* ⚠️ DÉPENDANCE, PAS INVENTAIRE : `_auth_lib.php` fait des require_once. En
   oublier un ne donne pas un contrôle en moins, mais une erreur fatale PHP. */
const FICHIERS = ['plateforme.php', '_json_boot.php', 'config_sync.php',
  '_auth_lib.php', '_livret_lib.php', '_notify_lib.php', '_sentinel.php',
  '_bot_log.php'];

/* Les quatre plans, avec le tarif que le serveur exige réellement. Un plan
   absent de cette liste est un plan que personne ne vérifie. */
const PLANS = [
  { id: 'ens_mois', tarif: 800, exports: 30 },
  { id: 'ens', tarif: 5000, exports: 30 },
  { id: 'etab', tarif: 30000, exports: 120 },
  { id: 'pro', tarif: 70000, exports: 400 },
];

const DB = () => path.join(BAC, 'data', 'veritas_db.json');

function monterBac() {
  fs.mkdirSync(path.join(BAC, 'api', 'data'), { recursive: true });
  fs.mkdirSync(path.join(BAC, 'data'), { recursive: true });
  for (const f of FICHIERS) {
    const src = path.join(RACINE, 'api', f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(BAC, 'api', f));
  }
  fs.writeFileSync(path.join(BAC, 'api', 'payment_config.php'),
    "<?php define('API_SECRET', " + JSON.stringify(SECRET) + ");\n");

  const corpus = [];
  for (let n = 1; n <= 40; n++) {
    corpus.push({
      n, type: 'récit', words: 120, level: '6e', cycle: '1er cycle',
      group: 'Module ' + (1 + (n % 4)), groupKind: 'module', subkind: '',
      usage: 'étude de texte', author: 'Auteur ' + n, title: 'Texte ' + n,
      reference: 'Réf. ' + n, faits: 'le groupe nominal',
      text: 'CORPS INTEGRAL DU TEXTE ' + n + '. ' + 'Phrase de remplissage. '.repeat(12),
    });
  }
  fs.writeFileSync(path.join(BAC, 'api', 'data', 'corpus_minesec.json'),
    JSON.stringify(corpus));
  ecrireBase({
    school: { nom: 'VÉRITAS' },
    students: [], studentAccounts: [], visitorAccounts: [],
    elearning: { plans: [], contenus: [], abonnements: [], commandes: [] },
    promoCodes: [],
    plateforme: { offres: { joursEssai: 7, cadeauBienvenue: 0, essaisParIp: 0 } },
    lastModified: 1000,
  });
}

const lireBase = () => JSON.parse(fs.readFileSync(DB(), 'utf8'));
const ecrireBase = (o) => fs.writeFileSync(DB(), JSON.stringify(o));

let serveur = null;
async function lancerServeur() {
  serveur = spawn('php', ['-S', '127.0.0.1:' + PORT, '-t', BAC],
    { cwd: BAC, stdio: ['ignore', 'ignore', 'ignore'] });
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(BASE + '/api/plateforme.php?action=config');
      if (r.status) return true;
    } catch (e) { await new Promise(s => setTimeout(s, 150)); }
  }
  return false;
}

async function appel(url, opts) {
  const r = await fetch(BASE + '/api/plateforme.php' + url, opts || {});
  let j = {}; try { j = await r.json(); } catch (e) {}
  return { http: r.status, j };
}
const poste = (url, corps, jeton) => appel(url, {
  method: 'POST',
  headers: Object.assign({ 'Content-Type': 'application/json' },
    jeton ? { Authorization: 'Bearer ' + jeton } : {}),
  body: JSON.stringify(corps || {}),
});
const lit = (url, jeton) => appel(url,
  jeton ? { headers: { Authorization: 'Bearer ' + jeton } } : {});

const empreinte = () => 'app' + Math.random().toString(36).slice(2, 14)
  + Math.random().toString(36).slice(2, 10);

/* LE CHEMIN DU WEBHOOK, pas une imitation : c'est `vrt_grant_entitlement()`
   qu'appelle payment_camerpay.php quand CamerPay confirme, et c'est lui qu'on
   appelle ici, sur la base du bac, avec la charge utile de même forme. */
function encaisser(accountId, plan, montant) {
  const src = `require ${JSON.stringify(path.join(BAC, 'api', '_auth_lib.php'))};
$f = ${JSON.stringify(DB())};
$db = json_decode(file_get_contents($f), true);
$res = vrt_grant_entitlement($db, [
  'intent' => 'subscription',
  'targetId' => ${JSON.stringify(plan)},
  'montant' => ${montant},
  'montant_paye' => ${montant},
  'ref' => 'PLAT' . strtoupper(bin2hex(random_bytes(3))),
  'accountId' => ${JSON.stringify(accountId)},
  'clientNom' => 'Testeur', 'clientTel' => '237690000000',
  'label' => 'Abonnement Atelier',
]);
if (!empty($res['changed'])) file_put_contents($f, json_encode($db, JSON_UNESCAPED_UNICODE));
echo json_encode(['changed' => !empty($res['changed']),
                  'underpaid' => !empty($res['underpaid']),
                  'msg' => (string)($res['msg'] ?? '')]);`;
  return JSON.parse(execFileSync('php', ['-r', src], { encoding: 'utf8' }).trim());
}

(async () => {
  console.log(`\n${G}LE CORPUS S'OUVRE-T-IL VRAIMENT AU PAIEMENT ?${R}\n`);
  monterBac();
  if (!await lancerServeur()) {
    console.log('  ' + X + ' impossible de lancer php -S sur le port ' + PORT);
    process.exit(1);
  }

  try {
    for (const plan of PLANS) {
      console.log(`${G}── Plan « ${plan.id} » — ${plan.tarif} FCFA ──${R}`);

      /* ① L'invité entre, et bute sur le mur. */
      const e = await poste('?action=invite', { appareil: empreinte() });
      const jetonInv = e.j.token;
      const idx = await lit('?action=corpus&mode=index', jetonInv);
      const ferme = (idx.j.textes || []).find(t => t.libre === false);
      dire(!!ferme && idx.j.palier === 'essai',
        'l’invité voit l’index, et une partie du répertoire lui est fermée',
        'palier=' + idx.j.palier);

      const avant = await lit('?action=corpus&mode=complet&n=' + ferme.n, jetonInv);
      dire(avant.http === 402 && avant.j.error === 'Abonnement requis',
        'le texte fermé répond 402 — le mur est bien là AVANT de payer',
        'HTTP ' + avant.http);

      /* ② Il devient titulaire. Payer ne suffit pas : sans compte,
            vrt_grant_entitlement n'écrit nulle part. */
      const pr = await poste('?action=promouvoir',
        { nom: 'Mme Ngo Bell', tel: '699112233' }, jetonInv);
      const accId = pr.j.compte && pr.j.compte.id;
      const jetonCpt = pr.j.token;
      dire(pr.http === 201 && !!accId && !!jetonCpt,
        'la promotion rend un compte et un jeton', 'HTTP ' + pr.http);

      const apresPromo = await lit('?action=corpus&mode=complet&n=' + ferme.n, jetonCpt);
      dire(apresPromo.http === 402,
        '⚠️ devenir titulaire n’ouvre RIEN par soi-même — sinon le compte serait le produit',
        'HTTP ' + apresPromo.http);

      /* ③ Un montant insuffisant n'ouvre pas. */
      const sous = encaisser(accId, plan.id, Math.max(100, Math.floor(plan.tarif / 10)));
      dire(sous.changed === false && sous.underpaid === true,
        'un paiement insuffisant est refusé — pas de « tarif indéterminable »',
        JSON.stringify(sous));
      const apresSous = await lit('?action=corpus&mode=complet&n=' + ferme.n, jetonCpt);
      dire(apresSous.http === 402,
        'et le texte reste fermé après ce refus', 'HTTP ' + apresSous.http);

      /* ④ Le tarif juste. C'EST ICI que tout se joue. */
      const paye = encaisser(accId, plan.id, plan.tarif);
      dire(paye.changed === true,
        plan.tarif + ' FCFA sont acceptés et écrivent le droit', JSON.stringify(paye));

      const base = lireBase();
      const acc = (base.visitorAccounts || []).find(a => a.id === accId);
      dire(!!acc && Array.isArray(acc.plans) && acc.plans.indexOf(plan.id) >= 0,
        'le plan est écrit sur LE compte né de la promotion, sous son propre nom',
        JSON.stringify(acc && acc.plans));

      /* ⑤ LE CONTRÔLE DÉCISIF : le texte descend, en entier. */
      const apres = await lit('?action=corpus&mode=complet&n=' + ferme.n, jetonCpt);
      dire(apres.http === 200 && apres.j.texte
        && String(apres.j.texte.text || '').indexOf('CORPS INTEGRAL DU TEXTE') === 0,
        '✦ le texte qui répondait 402 descend maintenant EN ENTIER',
        'HTTP ' + apres.http + ' ' + JSON.stringify(apres.j).slice(0, 90));
      dire(apres.j.droit && apres.j.droit.motif === 'abonnement'
        && apres.j.palier === plan.id,
        'le droit est motivé par l’ABONNEMENT, au palier du plan payé',
        JSON.stringify(apres.j.droit) + ' palier=' + apres.j.palier);

      /* ⑥ Tout le répertoire, pas seulement ce texte-là. */
      const idx2 = await lit('?action=corpus&mode=index', jetonCpt);
      const fermesApres = (idx2.j.textes || []).filter(t => t.libre === false).length;
      dire(fermesApres === 0,
        'plus AUCUN texte n’est fermé — c’est le répertoire entier qui s’ouvre',
        fermesApres + ' encore fermés');

      /* ⑦ Les quotas suivent le plan, pas l'essai. */
      const q = await poste('?action=quota', { genre: 'export' }, jetonCpt);
      dire(q.http === 200 && q.j.plafond === plan.exports,
        'le plafond d’exports est celui du plan (' + plan.exports + '), plus celui de l’essai',
        JSON.stringify(q.j));

      /* ⑧ Le droit voyage avec le code de reprise. Sans cela, l'abonné qui
            change de téléphone retrouverait un mur. */
      const rep = await poste('?action=reprise', { code: pr.j.code });
      dire(rep.j.ok === true && rep.j.droit && rep.j.droit.motif === 'abonnement',
        'le code de reprise rouvre le compte AVEC son abonnement',
        JSON.stringify(rep.j.droit));
      const surAutreAppareil = await lit('?action=corpus&mode=complet&n=' + ferme.n,
        rep.j.token);
      dire(surAutreAppareil.http === 200,
        'et le texte s’ouvre sur cet autre appareil', 'HTTP ' + surAutreAppareil.http);

      console.log('');
    }

    /* ⑨ Le piège du plan inconnu : il ne doit ni se vendre, ni ouvrir. */
    console.log(`${G}── Ce qui ne doit PAS s'acheter ──${R}`);
    const e2 = await poste('?action=invite', { appareil: empreinte() });
    const pr2 = await poste('?action=promouvoir', { nom: 'X', tel: '699000000' }, e2.j.token);
    const faux = encaisser(pr2.j.compte.id, 'plan_qui_nexiste_pas', 5000);
    dire(faux.changed === false,
      'un plan absent du catalogue ne s’achète pas — on ne devine pas un tarif',
      JSON.stringify(faux));

  } finally {
    if (serveur) { try { serveur.kill(); } catch (e) {} }
    try { fs.rmSync(BAC, { recursive: true, force: true }); } catch (e) {}
  }

  console.log('\n' + G + (ko ? X + ' ' + ko + ' contrôle(s) en échec' : V + ' tout est vert')
    + ' — ' + ok + '/' + (ok + ko) + R + '\n');
  process.exit(ko ? 1 : 0);
})();
