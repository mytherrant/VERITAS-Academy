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
/* ⚠️ UN PORT FIXE REND CE BANC INTERMITTENT, ET UN BANC INTERMITTENT N'EST
   PLUS LU. Il écoutait toujours sur 8899. Deux lancements rapprochés — ce
   qu'on fait précisément quand on éprouve une correction par mutation — et le
   second trouvait le port encore tenu par le `php -S` du premier (TIME_WAIT
   sous Windows). Le banc annonçait alors « le serveur de test n'a pas
   démarré », ou cinq échecs sans rapport, une fois sur deux ou sur trois. On
   finit par mettre ça sur le compte du hasard, et c'est ainsi qu'on ignore un
   vrai rouge. La CI ne voyait rien : son runner est neuf à chaque fois.
   On demande donc un port LIBRE au système, comme le fait déjà
   `tests/static_server.cjs`. `PORT_BANC` reste prioritaire pour qui veut
   fixer le port à la main. */
const PORT = (() => {
  if (process.env.PORT_BANC) return parseInt(process.env.PORT_BANC, 10);
  /* On demande un port éphémère au noyau, on le note, on le rend. La fenêtre
     entre la fermeture et le `php -S` est infime et sans conséquence : au pire
     le banc dit « le serveur n'a pas démarré », comme avant, mais ce ne sera
     plus systématique au second lancement. */
  const { execFileSync } = require('child_process');
  const out = execFileSync(process.execPath, ['-e',
    "const s=require('net').createServer();s.listen(0,'127.0.0.1',()=>{" +
    "process.stdout.write(String(s.address().port));s.close();});"],
    { encoding: 'utf8' });
  const p = parseInt(out.trim(), 10);
  return Number.isInteger(p) && p > 0 ? p : 8899;
})();
const URL = `http://127.0.0.1:${PORT}/livret_test.php`;
const SECRET = 'BANC_DE_TEST_SECRET_0123456789';

let ok = 0, ko = 0;
const dit = (bon, quoi, det) => {
  if (bon) { ok++; console.log('  \x1b[32m✓\x1b[0m ' + quoi); }
  else { ko++; console.log('  \x1b[31m✗\x1b[0m ' + quoi + (det ? '  → ' + det : '')); }
};

/* Le CATALOGUE du banc — fourni, pas emprunté.
   api/data/ est l'état vivant du serveur : hors dépôt, hors copie CI, déposé
   par FTP. Sur une machine d'intégration il n'existe pas, et le serveur
   retombe sur cinq classes de repli. La première version de ce banc affirmait
   « bord-6e est au catalogue » : verte en local, ROUGE en CI, elle a bloqué le
   déploiement du 26/08/2026 — à raison, mais pour la mauvaise cause. Un banc
   doit éprouver la RÈGLE, jamais l'état de la machine qui l'exécute.
   Il apporte donc son catalogue, et les cas qu'il veut : un ouvrage à deux
   versions, un ouvrage sans guide, et un ouvrage déclaré sans page publiée. */
const CATALOGUE = {
  version: 1,
  ouvrages: {
    '6e':      { titre: 'Mon Cahier de français 6ᵉ', niveau: '6e', mode: 'interactif',
                 kinds: ['livret', 'guide'] },
    '5e':      { titre: 'Mon Cahier de français 5ᵉ', niveau: '5e', mode: 'interactif',
                 kinds: ['livret', 'guide'] },
    // Sans guide : c'est LUI qui exerce la règle ③.
    'bord-6e': { titre: 'Bord — Cahier de français 6ᵉ', niveau: '6e', mode: 'lecture',
                 kinds: ['livret'], prix: 2000, pagesLibres: 8 },
    '2nde':    { titre: 'Mon Cahier de français 2ⁿᵈᵉ A', niveau: '2nde', mode: 'interactif',
                 kinds: ['livret', 'guide'] },
    /* Déclaré, mais NI coquille NI données : exerce « déclaré ≠ publié ».
       Le rôle tenait auparavant à « 2nde », dont la coquille manquait sur le
       poste — donc à l'ÉTAT DE LA MACHINE, pas à la règle. Le jour où les
       données de 2ⁿᵈᵉ ont été déposées, le banc a rougi sans qu'aucune règle
       n'ait bougé. Un slug qui n'existera jamais nulle part est déterministe
       partout : c'est ce qu'on veut d'un banc. */
    'fantome': { titre: 'Ouvrage jamais publié', niveau: '6e', mode: 'interactif',
                 kinds: ['livret'] },
  },
};

// ── Coquille de test : registre isolé, catalogue fourni, secret connu ────────
function preparer() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-livret-'));
  fs.mkdirSync(path.join(dir, 'lvdata'));
  /* ── LE DÉPÔT DES DONNÉES VENDUES, FOURNI PAR LE BANC ────────────────────
     Depuis le 01/09/2026, « disponible » ne veut plus dire « a une page » mais
     « le serveur peut LIVRER ». Le dossier de livraison est hors dépôt (FTP) :
     sans fixture, ce banc mesurerait l'état du disque de la machine — l'erreur
     que ce fichier a déjà commise sur « 2nde », et qui l'a fait rougir le jour
     où les données ont été déposées, sans qu'aucune règle ait bougé.
     On dépose donc exactement deux ouvrages, et on laisse les autres vides :
       · `6e`      → cahier interactif livrable (booklet-6e.js) ;
       · `bord-6e` → feuilletage livrable (dossier de pages) ;
       · `2nde`    → A une page de vente dans le dépôt depuis le 31/08, mais
                     AUCUNE donnée : c'est le témoin vivant de la régression —
                     une page n'est pas une livraison ;
       · `fantome` → ni l'un ni l'autre, indisponible partout et toujours. */
  const don = path.join(dir, 'donnees');
  fs.mkdirSync(don);
  fs.writeFileSync(path.join(don, 'booklet-6e.js'), 'window.BOOKLET={};', 'utf8');
  fs.mkdirSync(path.join(don, 'bord-6e'));
  fs.writeFileSync(path.join(don, 'bord-6e', 'p001.jpg'), 'jpeg-de-banc', 'utf8');
  const cat = path.join(dir, 'catalogue.json');
  fs.writeFileSync(cat, JSON.stringify(CATALOGUE, null, 1), 'utf8');
  const shim = `<?php
define('VRT_LIVRET_DIR', __DIR__ . '/lvdata');
define('VRT_LIVRET_DONNEES', __DIR__ . '/donnees');
/* Compteurs de débit isolés : sans cela, ce banc consomme sa propre limite
   (40 requêtes/minute) dans le dossier partagé du dépôt, et le passage suivant
   se voit refuser dès la première requête. */
define('VRT_RATE_DIR', __DIR__ . '/lvdata/_rate');
define('VRT_LIVRET_CATALOGUE', ${JSON.stringify(cat)});
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
     jamais fermer un accès vendu : un ouvrage peut y figurer sans que rien
     n'existe derrière. La boutique, qui lit ce catalogue, affichait alors une
     carte menant à un 404 — constaté au navigateur le 25/08/2026.

     LA RÈGLE A CHANGÉ LE 27/08, et ce contrôle avec elle. « Disponible »
     voulait dire « la coquille `livrets/<slug>.html` est sur le disque ».
     Depuis que `livrets/cahier.html` ouvre n'importe quel ouvrage (`?o=`),
     onze cahiers n'ont plus de coquille du tout : la règle d'avant les aurait
     déclarés indisponibles à vie, donc invisibles en boutique alors qu'ils se
     vendent. Elle constate désormais l'une OU l'autre des deux preuves — une
     coquille, ou les DONNÉES du cahier sur le serveur. La seconde est la plus
     importante : c'est elle qui manquait le jour où l'on a pu payer 1 000 F un
     livre dont le contenu n'était pas déposé.

     Ce contrôle-ci éprouve la règle, pas l'état de la machine : il demande au
     serveur un ouvrage dont il sait qu'il n'a NI l'un NI l'autre. */
  const dispo = ouvrages.filter(o => o.disponible === true).map(o => o.slug);
  const pasDispo = ouvrages.filter(o => o.disponible === false).map(o => o.slug);
  dit(ouvrages.every(o => typeof o.disponible === 'boolean'),
      'chaque ouvrage dit s’il est réellement publié');
  /* ⚠️ LA RÈGLE A ENCORE CHANGÉ, LE 01/09/2026, ET CE CONTRÔLE AVEC ELLE.
     Il affirmait « les ouvrages dont la COQUILLE existe sont disponibles ».
     C'était juste tant qu'une coquille voulait dire une page-LECTEUR. Le
     31/08, dix pages d'ATTERRISSAGE ont été produites pour le référencement :
     les quinze ouvrages ont eu une page, et cette affirmation est devenue vraie
     de tout le catalogue — donc vide de sens. Elle aurait continué de passer au
     vert en gardant une boutique qui vend ce qu'elle ne peut pas livrer.
     La question est désormais : le serveur a-t-il de quoi SERVIR ? */
  dit(dispo.indexOf('6e') >= 0,
      'un cahier dont les données sont déposées est disponible', 'dispo : ' + dispo.join(', '));
  dit(dispo.indexOf('bord-6e') >= 0,
      'un feuilletage dont les pages sont déposées aussi', 'dispo : ' + dispo.join(', '));
  /* LE TÉMOIN DE LA RÉGRESSION. `livrets/2nde.html` est dans le dépôt depuis le
     31/08 — mais rien n'est déposé pour lui ici. S'il ressort « disponible »,
     c'est que la page a repris le pas sur la livraison. */
  dit(pasDispo.indexOf('2nde') >= 0,
      'un ouvrage qui n’a QU’une page de vente ne l’est pas — une page n’est pas une livraison',
      'disponibles à tort : ' + dispo.join(', '));

  /* Le catalogue de ce banc déclare un ouvrage fantôme : aucune coquille,
     aucune donnée. C'est le seul cas où « non disponible » est la bonne
     réponse, et il doit rester vrai quoi que Jacques ait téléversé. */
  const fantome = ouvrages.filter(o => o.slug === 'fantome')[0];
  dit(!!fantome && fantome.disponible === false,
      'un ouvrage sans coquille NI données est marqué NON disponible',
      fantome ? 'disponible=' + fantome.disponible : 'absent du catalogue');

  /* Et le lien suit : la boutique ne peut pas deviner laquelle des deux
     formes existe, c'est le serveur qui le dit. */
  const avecCoquille = ouvrages.filter(o => o.slug === '6e')[0];
  dit(avecCoquille && avecCoquille.lien === '6e.html',
      'un ouvrage à coquille pointe vers SA page',
      avecCoquille && avecCoquille.lien);
  dit(fantome && /^cahier\.html\?o=/.test(fantome.lien || ''),
      'un ouvrage sans coquille passe par le moteur générique',
      fantome && fantome.lien);

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
