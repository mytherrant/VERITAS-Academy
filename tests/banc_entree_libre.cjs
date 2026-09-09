#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_entree_libre.cjs — ON ENTRE SANS MOT DE PASSE, ET L'ESSAI NE SE
   RELANCE PAS.
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_entree_libre.cjs

   CE QU'IL PROTÈGE
   Le 09/09/2026, l'Atelier a cessé de demander un compte à l'entrée : trop
   d'enseignants s'arrêtaient devant le formulaire d'inscription et repartaient.
   Retirer un mur, c'est déplacer la charge ailleurs — sur l'abonnement et sur
   l'essai. Trois promesses tiennent désormais la boutique, et aucune ne se
   vérifie en lisant le code :

     1. ON ENTRE. Sans compte, sans mot de passe, sans formulaire.
     2. L'ESSAI NE SE RELANCE PAS. Ni en revenant, ni en vidant son navigateur
        (le plafond par adresse), ni en s'abonnant (le report à la promotion).
     3. L'ESSAI NE SE CONSOMME PAS EN REGARDANT. Il démarre au premier geste
        payant — un texte sous droits, un export, un appel à Ambassa — et pas
        avant. C'est ce qui permet de resserrer les quantités sans punir celui
        qui prend son temps.

   Chacune de ces trois promesses est tenue par du code qui ne lève RIEN quand
   il se trompe : un essai qui repart à zéro ne produit aucune erreur, il
   produit un abonnement qu'on ne vend jamais.

   MÉTHODE — rien n'est simulé. On monte un bac à sable, on y lance un vrai
   `php -S`, et on parle à api/plateforme.php par HTTP, comme le navigateur.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const RACINE = path.resolve(__dirname, '..');
const V = '\x1b[32m✓\x1b[0m', X = '\x1b[31m✗\x1b[0m', G = '\x1b[1m', R = '\x1b[0m';
let ok = 0, ko = 0;
const dire = (b, m, d) => {
  b ? ok++ : ko++;
  console.log('  ' + (b ? V : X) + ' ' + m + (!b && d ? '  → ' + d : ''));
};

const PORT = 8881 + (process.pid % 90);
const BASE = 'http://127.0.0.1:' + PORT;
const SECRET = 'banc-entree-libre-' + Math.random().toString(36).slice(2, 12);
const BAC = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-banc-entree-'));

/* ⚠️ DÉPENDANCE, PAS INVENTAIRE. `_auth_lib.php` fait des require_once : en
   oublier un ne donne pas un contrôle en moins mais une erreur fatale PHP, et
   un banc qui ne mesure plus rien. */
const FICHIERS = ['plateforme.php', '_json_boot.php', 'config_sync.php',
  '_auth_lib.php', '_livret_lib.php', '_notify_lib.php', '_sentinel.php',
  '_bot_log.php'];

/* Le plafond d'essais par adresse IP, posé bas exprès : le banc tourne depuis
   une seule adresse, et c'est justement ce garde-fou qu'on veut voir mordre. */
const PLAFOND_IP = 4;

function monterBac() {
  fs.mkdirSync(path.join(BAC, 'api', 'data'), { recursive: true });
  fs.mkdirSync(path.join(BAC, 'data'), { recursive: true });
  for (const f of FICHIERS) {
    const src = path.join(RACINE, 'api', f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(BAC, 'api', f));
  }
  fs.writeFileSync(path.join(BAC, 'api', 'payment_config.php'),
    "<?php define('API_SECRET', " + JSON.stringify(SECRET) + ");\n");

  /* Un répertoire MINESEC minuscule mais RÉEL au sens du format : c'est lui
     que plat_offerts() échantillonne et que le palier borne. */
  const corpus = [];
  for (let n = 1; n <= 40; n++) {
    corpus.push({
      n, type: 'récit', words: 120, level: '6e', cycle: '1er cycle',
      group: 'Module ' + (1 + (n % 4)), groupKind: 'module', subkind: '',
      usage: 'étude de texte', author: 'Auteur ' + n, title: 'Texte ' + n,
      reference: 'Réf. ' + n, faits: 'le groupe nominal',
      text: 'Corps du texte numéro ' + n + '. ' + 'Phrase de remplissage. '.repeat(12),
    });
  }
  fs.writeFileSync(path.join(BAC, 'api', 'data', 'corpus_minesec.json'),
    JSON.stringify(corpus));

  fs.writeFileSync(path.join(BAC, 'data', 'veritas_db.json'), JSON.stringify({
    school: { nom: 'VÉRITAS' },
    students: [], studentAccounts: [], visitorAccounts: [],
    plateforme: {
      offres: { joursEssai: 7, cadeauBienvenue: 0, quotaEssai: 10,
                essaisParIp: PLAFOND_IP },
      /* Plafonds d'essai posés explicitement : le banc mesure le MÉCANISME,
         il ne doit pas rougir le jour où Jacques règle un chiffre autrement. */
      paliers: { essai: { textes: 12, citations: 5, exports: 2, ia: 5, epreuves: 5 } },
    },
    lastModified: 1000,
  }));
}

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
const lireBase = () => JSON.parse(fs.readFileSync(path.join(BAC, 'data', 'veritas_db.json'), 'utf8'));
const lireRegistre = () => {
  const f = path.join(BAC, 'api', 'data', '_plat_invites.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : { appareils: {}, ip: {} };
};

(async () => {
  console.log(`\n${G}ON ENTRE SANS MOT DE PASSE — ET L'ESSAI NE SE RELANCE PAS${R}\n`);
  monterBac();
  if (!await lancerServeur()) {
    console.log('  ' + X + ' impossible de lancer php -S sur le port ' + PORT);
    process.exit(1);
  }

  try {
    // ── ① L'entrée est ouverte ───────────────────────────────────────────
    console.log(`${G}① On entre — sans compte, sans mot de passe${R}`);
    const cfg = await lit('?action=config');
    dire(cfg.j.entree && cfg.j.entree.libre === true,
      '?action=config annonce une entrée libre',
      JSON.stringify(cfg.j.entree));
    dire(!('essaisParIp' in (cfg.j.offres || {})),
      'le plafond anti-farming n’est PAS publié (un garde-fou qu’on affiche se contourne)',
      JSON.stringify(cfg.j.offres));

    const sansCle = await poste('?action=invite', {});
    dire(sansCle.http === 400,
      'une ouverture sans empreinte est refusée (400)', 'HTTP ' + sansCle.http);
    const mauvaise = await poste('?action=invite', { appareil: 'trop-court' });
    dire(mauvaise.http === 400,
      'une empreinte hors format est refusée (400)', 'HTTP ' + mauvaise.http);

    const A = empreinte();
    const e1 = await poste('?action=invite', { appareil: A });
    dire(e1.http === 200 && e1.j.ok === true && !!e1.j.token,
      'une empreinte valide rend un jeton, sans aucun identifiant',
      'HTTP ' + e1.http + ' ' + JSON.stringify(e1.j).slice(0, 120));
    dire(String(e1.j.token || '').startsWith('inv.'),
      'le jeton d’invité porte un préfixe qui le distingue d’un jeton de compte');
    dire(e1.j.neuf === true, 'la première ouverture est signalée « neuve »');

    const jetonA = e1.j.token;

    // ── ② Le répertoire s'ouvre à un invité ──────────────────────────────
    console.log(`\n${G}② Le répertoire s’ouvre à un invité${R}`);
    const idx = await lit('?action=corpus&mode=index', jetonA);
    dire(idx.http === 200 && Array.isArray(idx.j.textes) && idx.j.textes.length === 40,
      'l’index entier descend (40 entrées), auteur et amorce compris',
      'HTTP ' + idx.http + ' ' + (idx.j.textes || []).length);
    dire(idx.j.palier === 'essai',
      'le palier appliqué est celui de l’essai', String(idx.j.palier));
    const fermes = (idx.j.textes || []).filter(t => t.libre === false).length;
    dire(fermes === 40 - 12,
      'l’échantillon ouvert vaut exactement le plafond du palier (12 sur 40)',
      fermes + ' fermés');
    const sansJeton = await lit('?action=corpus&mode=index');
    dire(sansJeton.http === 401,
      'sans AUCUN jeton, le répertoire reste fermé (401) — l’entrée est libre, pas la marchandise',
      'HTTP ' + sansJeton.http);

    // ── ③ REGARDER NE CONSOMME PAS L'ESSAI ───────────────────────────────
    console.log(`\n${G}③ Parcourir le répertoire ne consomme pas l’essai${R}`);
    dire(idx.j.droit && idx.j.droit.motif === 'essai_ouverture',
      'après l’index, l’essai n’est toujours PAS entamé',
      JSON.stringify(idx.j.droit));
    dire((lireRegistre().appareils[Object.keys(lireRegistre().appareils)[0]] || {}).essai === 0,
      'le registre ne porte aucune date d’ouverture');
    /* ⚠️ DEUX ÉCHANTILLONS, ET ILS NE SE VALENT PAS.
       « demo » (5 textes ici) est offert à TOUT LE MONDE, essai terminé
       compris. « essai » (12) est plus large. Ouvrir un texte du premier
       ne doit RIEN déclencher — sinon regarder la vitrine coûterait
       l'essai. Ouvrir un texte que seul l'essai rend lisible, si.
       Les deux listes sont déterministes (un pas régulier sur les 40
       textes), donc calculables ici sans deviner. */
    const pas = (n) => { const out = []; for (let k = 0; k < n; k++)
      out.push(1 + Math.min(39, Math.floor(k * 40 / n))); return out; };
    const offertsDemo = pas(5), offertsEssai = pas(12);
    /* Un numéro offert dans les DEUX listes : c'est celui dont l'ouverture ne
       doit rien déclencher. Prendre un offert de « demo » au hasard ne suffit
       pas — les deux échantillons ont un pas différent, et « demo » compte des
       numéros que l'essai, lui, ferme (mesuré : le 9 y renvoie 402). */
    const nDemo = offertsDemo.find(n => offertsEssai.indexOf(n) >= 0);
    const nEssaiSeul = offertsEssai.find(n => offertsDemo.indexOf(n) < 0);
    dire(nEssaiSeul != null, 'les deux échantillons diffèrent bien (sinon rien à mesurer)');

    const rDemo = await lit('?action=corpus&mode=complet&n=' + nDemo, jetonA);
    const apresDemo = await lit('?action=corpus&mode=index', jetonA);
    dire(rDemo.http === 200 && apresDemo.j.droit.motif === 'essai_ouverture',
      'ouvrir un texte offert à tous (échantillon « demo ») ne déclenche rien',
      'HTTP ' + rDemo.http + ' ' + JSON.stringify(apresDemo.j.droit));

    /* L'autre chemin de déclenchement, mesuré sur une empreinte NEUVE :
       celle-ci doit rester intacte pour le contrôle ④. */
    const B = empreinte();
    const eB = await poste('?action=invite', { appareil: B });
    const jetonB = eB.j.token;
    const rSeul = await lit('?action=corpus&mode=complet&n=' + nEssaiSeul, jetonB);
    const apresSeul = await lit('?action=corpus&mode=index', jetonB);
    dire(rSeul.http === 200 && apresSeul.j.droit.motif === 'essai',
      'ouvrir un texte que SEUL l’essai rend lisible, en revanche, le déclenche',
      'HTTP ' + rSeul.http + ' ' + JSON.stringify(apresSeul.j.droit));
    const offert = { n: nDemo };

    // ── ④ Le premier geste payant ouvre l'essai ──────────────────────────
    console.log(`\n${G}④ Le premier geste payant ouvre l’essai — et une seule fois${R}`);
    const q1 = await poste('?action=quota', { genre: 'export' }, jetonA);
    dire(q1.http === 200 && q1.j.ok === true && q1.j.utilise === 1,
      'un export est décompté (1 sur 2)', JSON.stringify(q1.j));
    const apresQuota = await lit('?action=corpus&mode=index', jetonA);
    dire(apresQuota.j.droit.motif === 'essai',
      'l’essai est MAINTENANT ouvert, et pas avant',
      JSON.stringify(apresQuota.j.droit));
    dire(apresQuota.j.droit.resteJours === 7,
      'il reste les 7 jours entiers — l’attente ne les a pas rognés',
      String(apresQuota.j.droit.resteJours));

    const debut1 = lireRegistre().appareils[Object.keys(lireRegistre().appareils)[0]].essai;
    await poste('?action=quota', { genre: 'export' }, jetonA);
    const debut2 = lireRegistre().appareils[Object.keys(lireRegistre().appareils)[0]].essai;
    dire(debut1 > 0 && debut1 === debut2,
      'un second geste ne REPOUSSE pas la date d’ouverture',
      debut1 + ' → ' + debut2);

    const q3 = await poste('?action=quota', { genre: 'export' }, jetonA);
    dire(q3.http === 402 && q3.j.ok === false,
      'le troisième export est refusé (402) : le plafond de 2 s’applique vraiment',
      'HTTP ' + q3.http + ' ' + JSON.stringify(q3.j));
    dire(q3.j.utilise === 2,
      'un refus ne consomme pas — le compteur reste à 2', String(q3.j.utilise));

    // ── ⑤ Un texte sous droits est refusé hors échantillon ───────────────
    console.log(`\n${G}⑤ L’échantillon est un échantillon${R}`);
    const ferme = (idx.j.textes || []).find(t => t.libre === false);
    const rF = await lit('?action=corpus&mode=complet&n=' + ferme.n, jetonA);
    dire(rF.http === 402 && rF.j.error === 'Abonnement requis',
      'un texte hors échantillon renvoie le mur d’abonnement (402)',
      'HTTP ' + rF.http + ' ' + JSON.stringify(rF.j).slice(0, 90));
    const rO = await lit('?action=corpus&mode=complet&n=' + offert.n, jetonA);
    dire(rO.http === 200 && rO.j.texte && rO.j.texte.text,
      'un texte de l’échantillon descend en entier');

    // ── ⑥ L'essai ne se relance pas ──────────────────────────────────────
    console.log(`\n${G}⑥ L’essai ne se relance pas${R}`);
    const e1bis = await poste('?action=invite', { appareil: A });
    dire(e1bis.j.ok === true && e1bis.j.neuf === false,
      'la même empreinte retrouve le MÊME invité (pas une nouvelle ouverture)',
      JSON.stringify(e1bis.j.neuf));
    dire(e1bis.j.compte.id === e1.j.compte.id,
      'l’identifiant est identique — donc l’essai et les compteurs aussi',
      e1.j.compte.id + ' vs ' + e1bis.j.compte.id);
    const qBis = await poste('?action=quota', { genre: 'export' }, e1bis.j.token);
    dire(qBis.http === 402,
      'revenir ne rend pas les exports déjà consommés', 'HTTP ' + qBis.http);

    /* Vider son navigateur fabrique une empreinte neuve. C'est le plafond par
       adresse qui borne le procédé — et il doit répondre 200, jamais 429 :
       LWS bannit l'IP à six mauvaises requêtes par minute, et cette sanction
       ferme veritas-school.com pour tout le quartier. */
    let ouvertes = 2, dernier = null;   // A et B, déjà ouvertes plus haut
    for (let i = 0; i < 6; i++) {
      dernier = await poste('?action=invite', { appareil: empreinte() });
      if (dernier.j.ok) ouvertes++; else break;
    }
    dire(ouvertes === PLAFOND_IP,
      'le plafond par adresse mord à ' + PLAFOND_IP + ' ouvertures (' + ouvertes + ' obtenues)');
    dire(dernier.http === 200 && dernier.j.ok === false && dernier.j.code === 'plafond_ip',
      'le refus est un 200 qui dit non — jamais un 4xx (LWS bannit à 6 mauvaises requêtes/min)',
      'HTTP ' + dernier.http + ' ' + JSON.stringify(dernier.j).slice(0, 90));

    // ── ⑦ Un invité n'a pas d'équipe ─────────────────────────────────────
    console.log(`\n${G}⑦ Ce qu’un invité ne peut pas faire${R}`);
    const gr = await poste('?action=groupe&op=creer', { nom: 'Lycée X' }, jetonA);
    dire(gr.j.ok === false && gr.j.code === 'invite',
      'créer une équipe demande un abonnement', JSON.stringify(gr.j).slice(0, 90));
    const grL = await lit('?action=groupe&op=lister', jetonA);
    dire(grL.http === 200 && Array.isArray(grL.j.groupes) && grL.j.groupes.length === 0,
      'lister reste ouvert et rend une liste vide (le navigateur n’a pas de cas particulier)');

    // ── ⑧ La promotion : l'invité devient titulaire ──────────────────────
    console.log(`\n${G}⑧ Au moment de payer, l’invité devient titulaire${R}`);
    const pr = await poste('?action=promouvoir',
      { nom: 'Mme Ngo Bell', tel: '699112233' }, jetonA);
    dire(pr.http === 201 && pr.j.ok === true && !!pr.j.token && !!pr.j.code,
      'un compte naît, avec un jeton et un code de reprise',
      'HTTP ' + pr.http + ' ' + JSON.stringify(pr.j).slice(0, 110));
    dire(/^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(pr.j.code || ''),
      'le code se lit au téléphone : douze signes sans I, O, 0 ni 1',
      String(pr.j.code));

    const base = lireBase();
    const cree = (base.visitorAccounts || []).find(a => a.id === pr.j.compte.id);
    dire(!!cree, 'le compte est bien écrit dans la base du serveur');
    dire(cree && cree.pwd === '',
      'il n’a AUCUN mot de passe — c’est ce qui rend la connexion par mot de passe impossible');
    dire(cree && cree.srvCreated === true && cree.srvAt > 0,
      'il porte srvCreated + srvAt : une synchro admin ne l’effacera pas',
      JSON.stringify({ srvCreated: cree && cree.srvCreated, srvAt: cree && cree.srvAt }));
    dire(cree && !cree.platCodeClair && typeof cree.platCode === 'string'
      && cree.platCode.length === 64 && cree.platCode !== pr.j.code,
      'le code n’est rangé qu’en empreinte, jamais en clair');
    dire(cree && Array.isArray(cree.plans) && cree.plans.length === 0,
      'aucun plan n’est accordé ici : l’argent reste l’affaire du paiement');

    /* LE PIÈGE LE PLUS CHER : s'abonner ne doit pas offrir un essai neuf. */
    const jetonC = pr.j.token;
    const idxC = await lit('?action=corpus&mode=index', jetonC);
    dire(idxC.j.droit && idxC.j.droit.motif === 'essai',
      'le compte HÉRITE de l’essai déjà entamé — il n’en rouvre pas un neuf',
      JSON.stringify(idxC.j.droit));
    const qC = await poste('?action=quota', { genre: 'export' }, jetonC);
    dire(qC.http === 402,
      'les exports déjà consommés le restent : promouvoir ne remet pas les compteurs à zéro',
      'HTTP ' + qC.http + ' ' + JSON.stringify(qC.j));

    const regApres = lireRegistre();
    dire(!Object.values(regApres.appareils).some(a => a.id === e1.j.compte.id),
      'l’entrée d’invité est retirée du registre : plus d’essai parallèle sur la même machine');

    // ── ⑨ Le code de reprise ─────────────────────────────────────────────
    console.log(`\n${G}⑨ Le code de reprise rouvre l’abonnement, ailleurs${R}`);
    const rep = await poste('?action=reprise', { code: pr.j.code });
    dire(rep.http === 200 && rep.j.ok === true && !!rep.j.token,
      'le bon code rend un jeton du compte', JSON.stringify(rep.j).slice(0, 100));
    dire(rep.j.compte && rep.j.compte.id === pr.j.compte.id,
      'et c’est bien le même compte', String(rep.j.compte && rep.j.compte.id));
    const repMin = await poste('?action=reprise', { code: String(pr.j.code).toLowerCase() });
    dire(repMin.j.ok === true,
      'la casse et les tirets ne comptent pas — on le recopie à la main');
    const repFaux = await poste('?action=reprise', { code: 'ABCD-EFGH-JKLM' });
    dire(repFaux.http === 200 && repFaux.j.ok === false,
      'un code inconnu répond 200 qui dit non, jamais un 4xx (même raison que ⑥)',
      'HTTP ' + repFaux.http);

    /* Un code perdu ne se retrouve pas — le serveur n'en a que l'empreinte —
       il se REMPLACE. Et le remplacement doit fermer l'ancien : sinon la
       personne à qui on l'a lu au téléphone garde l'abonnement ouvert. */
    const ancien = pr.j.code;
    const neuf = await poste('?action=code', {}, jetonC);
    dire(neuf.http === 200 && neuf.j.ok === true && !!neuf.j.code && neuf.j.code !== ancien,
      'un abonné peut poser un code NEUF, différent du précédent',
      JSON.stringify(neuf.j).slice(0, 90));
    const avecNeuf = await poste('?action=reprise', { code: neuf.j.code });
    dire(avecNeuf.j.ok === true, 'le code neuf ouvre le compte');
    const avecAncien = await poste('?action=reprise', { code: ancien });
    dire(avecAncien.j.ok === false,
      'l’ancien code ne vaut plus rien — c’est ce qui permet de le remplacer après une fuite');
    const codeInvite = await poste('?action=code', {}, jetonA);
    dire(codeInvite.j.ok === false,
      'un invité n’a pas de code : il n’a pas encore d’abonnement à reprendre');

    // ── ⑩ Aucun mot de passe n'ouvre le compte promu ─────────────────────
    console.log(`\n${G}⑩ Aucun mot de passe n’ouvre un compte né sans mot de passe${R}`);
    for (const essai of ['', ' ', 'motdepasse', cree.user]) {
      const se = await poste('?action=session', { login: cree.user, motDePasse: essai });
      if (se.http !== 401 && se.http !== 400) {
        dire(false, 'connexion refusée pour « ' + essai + ' »', 'HTTP ' + se.http);
        break;
      }
    }
    dire(true, 'les quatre tentatives de connexion par mot de passe sont refusées');

  } finally {
    if (serveur) { try { serveur.kill(); } catch (e) {} }
    try { fs.rmSync(BAC, { recursive: true, force: true }); } catch (e) {}
  }

  console.log('\n' + G + (ko ? X + ' ' + ko + ' contrôle(s) en échec' : V + ' tout est vert')
    + ' — ' + ok + '/' + (ok + ko) + R + '\n');
  process.exit(ko ? 1 : 0);
})();
