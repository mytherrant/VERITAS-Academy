#!/usr/bin/env node
/**
 * tests/banc_cahier.cjs — LE CAHIER DE L'ÉLÈVE, DE BOUT EN BOUT
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 *   node tests/banc_cahier.cjs
 *
 * CE QU'IL PROUVE
 *   ① l'élève écrit, ferme, revient : il retrouve ses réponses ;
 *   ② un enregistrement PARTIEL ne détruit pas les réponses précédentes —
 *      c'est le défaut qui ferait perdre une heure de travail en silence ;
 *   ③ un élève ne lit JAMAIS le cahier d'un autre ;
 *   ④ l'enseignant lit les copies de SON ouvrage, et seulement du sien ;
 *   ⑤ une annotation se pose sur l'exercice visé, et le retrouve ;
 *   ⑥ les refus sont bruyants : clé mal formée, réponse trop longue, note
 *      hors barème — jamais une troncature silencieuse.
 *
 * Registre et catalogue ISOLÉS : aucune écriture ne touche api/data/ ni la
 * production.
 */
'use strict';
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');
const PORT = parseInt(process.env.PORT_BANC || '8921', 10);
const BASE = `http://127.0.0.1:${PORT}`;
const SECRET = 'BANC_CAHIER_SECRET_0123456789';

let ok = 0, ko = 0;
const dit = (bon, quoi, det) => {
  if (bon) { ok++; console.log('  \x1b[32m✓\x1b[0m ' + quoi); }
  else { ko++; console.log('  \x1b[31m✗\x1b[0m ' + quoi + (det ? '  → ' + det : '')); }
};

const CATALOGUE = {
  version: 1,
  ouvrages: {
    '6e': { titre: 'Cahier 6ᵉ', niveau: '6e', mode: 'interactif', kinds: ['livret', 'guide'] },
    '5e': { titre: 'Cahier 5ᵉ', niveau: '5e', mode: 'interactif', kinds: ['livret', 'guide'] },
  },
};

function preparer() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-cahier-'));
  fs.mkdirSync(path.join(dir, 'lvdata'));
  /* Le dossier des données VENDUES — cahiers et tables de corrigés. Isolé au
     même titre que le registre : sans cette constante, le banc irait lire
     uploads/protected/livrets/ et son verdict dépendrait de ce que Jacques a
     téléversé ce jour-là, au lieu de la règle. */
  const donnees = path.join(dir, 'contenu');
  fs.mkdirSync(donnees);
  fs.writeFileSync(path.join(donnees, 'corrige-6e.js'),
    'window.CAHIER_CORRIGES=' + JSON.stringify({
      b12: 'Le narrateur est interne : il dit « je » et ne sait que ce qu’il voit.',
      b30: 'Le champ lexical de la peur : « trembler », « ombre », « frisson ».',
    }) + ';', 'utf8');
  const cat = path.join(dir, 'catalogue.json');
  fs.writeFileSync(cat, JSON.stringify(CATALOGUE), 'utf8');
  const entete = `<?php
define('VRT_LIVRET_DIR', ${JSON.stringify(path.join(dir, 'lvdata'))});
define('VRT_LIVRET_CATALOGUE', ${JSON.stringify(cat)});
define('API_SECRET', ${JSON.stringify(SECRET)});
define('VRT_LIVRET_DONNEES', ${JSON.stringify(donnees)});
`;
  fs.writeFileSync(path.join(dir, 'livret_test.php'),
    entete + `require ${JSON.stringify(path.join(RACINE, 'api', 'livret.php'))};\n`, 'utf8');
  fs.writeFileSync(path.join(dir, 'cahier_test.php'),
    entete + `require ${JSON.stringify(path.join(RACINE, 'api', 'cahier.php'))};\n`, 'utf8');
  return dir;
}

async function poste(fichier, body, secret) {
  const h = { 'Content-Type': 'application/json' };
  if (secret) h['Authorization'] = 'Bearer ' + secret;
  const r = await fetch(BASE + '/' + fichier, { method: 'POST', headers: h, body: JSON.stringify(body) });
  let j = null; try { j = await r.json(); } catch (e) {}
  return { status: r.status, j };
}
const lv = (b, s) => poste('livret_test.php', b, s);
const ca = (b) => poste('cahier_test.php', b);

const attendre = (ms) => new Promise(r => setTimeout(r, ms));
async function serveurPret() {
  for (let i = 0; i < 40; i++) {
    try { if ((await lv({ action: 'catalogue' })).status === 200) return true; } catch (e) {}
    await attendre(250);
  }
  return false;
}

(async () => {
  if (spawnSync('php', ['-v'], { stdio: 'ignore' }).status !== 0) {
    console.log('\x1b[33m⚠ PHP absent du PATH — banc non exécutable ici.\x1b[0m');
    process.exit(0);
  }
  const dir = preparer();
  const srv = spawn('php', ['-S', `127.0.0.1:${PORT}`, '-t', dir], { cwd: dir, stdio: 'ignore' });
  const fin = (c) => { try { srv.kill(); } catch (e) {} process.exit(c); };
  if (!await serveurPret()) { console.log('\x1b[31m✗ serveur de test absent\x1b[0m'); fin(1); }

  // ── Mise en place : deux élèves de 6ᵉ, un prof de 6ᵉ, un prof de 5ᵉ ───────
  const gen = async (classe, kind, label) => {
    const r = await lv({ action: 'admin_gen', classe, kind, n: 1, jours: 365, label }, SECRET);
    return (r.j && r.j.codes && r.j.codes[0]) || '';
  };
  const ouvre = async (code, classe, kind) => {
    const r = await lv({ action: 'unlock', code, classe, kind });
    return (r.j && r.j.token) || '';
  };

  const cAwa   = await gen('6e', 'livret', 'Awa');
  const cBiya  = await gen('6e', 'livret', 'Biya');
  const cProf  = await gen('6e', 'guide',  'Prof 6e');
  const cProf5 = await gen('5e', 'guide',  'Prof 5e');
  const tAwa   = await ouvre(cAwa, '6e', 'livret');
  const tBiya  = await ouvre(cBiya, '6e', 'livret');
  const tProf  = await ouvre(cProf, '6e', 'guide');
  const tProf5 = await ouvre(cProf5, '5e', 'guide');

  console.log('\n\x1b[1m0. Mise en place\x1b[0m');
  dit(!!(tAwa && tBiya && tProf && tProf5), 'quatre sessions ouvertes (2 élèves, 2 enseignants)');

  console.log('\n\x1b[1m1. La porte\x1b[0m');
  dit((await ca({ action: 'charger' })).status === 401, 'sans jeton → 401');
  dit((await ca({ action: 'charger', token: 'x.y' })).status === 401, 'jeton fabriqué → 401');

  console.log('\n\x1b[1m2. ① L’élève écrit, revient, retrouve son travail\x1b[0m');
  const vide = await ca({ action: 'charger', token: tAwa });
  dit(vide.status === 200 && Object.keys(vide.j.reponses || {}).length === 0, 'cahier neuf : aucune réponse');

  const r1 = await ca({ action: 'enregistrer', token: tAwa, reponses: {
    '6e/seq1/lecon1/b12/r0': 'Le narrateur est interne.',
    '6e/seq1/lecon1/b12/r1': 'Il emploie la première personne.',
    '6e/seq1/lecon2/b30/r0': 'Un champ lexical de la peur.',
  }});
  dit(r1.status === 200 && r1.j.ecrits === 3, 'trois réponses enregistrées', 'ecrits=' + (r1.j && r1.j.ecrits));

  const relu = await ca({ action: 'charger', token: tAwa });
  dit(relu.j.reponses['6e/seq1/lecon1/b12/r0'] === 'Le narrateur est interne.',
      'la réponse revient mot pour mot');
  dit(Object.keys(relu.j.reponses).length === 3, 'les trois sont là');

  console.log('\n\x1b[1m2 bis. ② Un enregistrement PARTIEL ne détruit rien\x1b[0m');
  const r2 = await ca({ action: 'enregistrer', token: tAwa, reponses: {
    '6e/seq1/lecon3/b44/r0': 'Ajout plus tard dans l’année.',
  }});
  const apres = await ca({ action: 'charger', token: tAwa });
  dit(Object.keys(apres.j.reponses).length === 4,
      'la 4ᵉ s’ajoute SANS effacer les trois premières',
      'total=' + Object.keys(apres.j.reponses).length);
  dit(apres.j.reponses['6e/seq1/lecon1/b12/r0'] === 'Le narrateur est interne.',
      'la première réponse est intacte');

  const r3 = await ca({ action: 'enregistrer', token: tAwa, reponses: { '6e/seq1/lecon3/b44/r0': '' } });
  const apres2 = await ca({ action: 'charger', token: tAwa });
  dit(Object.keys(apres2.j.reponses).length === 3, 'vider un champ l’efface vraiment');

  console.log('\n\x1b[1m3. ⑥ Les refus sont bruyants\x1b[0m');
  const mauvaise = await ca({ action: 'enregistrer', token: tAwa, reponses: { '../../etc/passwd': 'x' } });
  dit(mauvaise.status === 200 && mauvaise.j.ecrits === 0, 'une clé qui ressemble à un chemin est ignorée');
  const apres3 = await ca({ action: 'charger', token: tAwa });
  dit(Object.keys(apres3.j.reponses).length === 3, 'et n’a rien écrit');

  const longue = 'x'.repeat(7000);
  const tronq = await ca({ action: 'enregistrer', token: tAwa, reponses: { '6e/seq2/b1/r0': longue } });
  dit((tronq.j.tronquees || []).length === 1,
      'une réponse trop longue est signalée, pas coupée en silence');

  console.log('\n\x1b[1m4. ③ Un élève ne lit pas le cahier d’un autre\x1b[0m');
  const chezBiya = await ca({ action: 'charger', token: tBiya });
  dit(Object.keys(chezBiya.j.reponses || {}).length === 0,
      'Biya ouvre SON cahier, vide — pas celui d’Awa');
  const volTente = await ca({ action: 'copies', token: tBiya });
  dit(volTente.status === 403, 'un élève ne peut pas lister les copies', 'reçu ' + volTente.status);
  const volTente2 = await ca({ action: 'copie', token: tBiya, eleve: 'peu importe' });
  dit(volTente2.status === 403, 'ni en ouvrir une', 'reçu ' + volTente2.status);

  console.log('\n\x1b[1m5. ④ L’enseignant lit SON ouvrage, et seulement le sien\x1b[0m');
  const copies = await ca({ action: 'copies', token: tProf });
  dit(copies.status === 200 && (copies.j.copies || []).length >= 1,
      (copies.j && copies.j.total) + ' copie(s) visible(s) par le prof de 6ᵉ');
  const idAwa = (copies.j.copies || []).sort((a, b) => b.exercices - a.exercices)[0];
  dit(idAwa && idAwa.exercices === 4, 'le prof voit le bon nombre d’exercices traités',
      'vu ' + (idAwa && idAwa.exercices));

  const copie = await ca({ action: 'copie', token: tProf, eleve: idAwa.eleve });
  dit(copie.status === 200 && copie.j.reponses['6e/seq1/lecon1/b12/r0'] === 'Le narrateur est interne.',
      'il lit la réponse de l’élève');

  /* L'IDENTITÉ NE SE DEMANDE PAS — elle se déduit du jeton signé.
     Ce contrôle existe parce qu'une mutation d'épreuve est passée INAPERÇUE :
     en faisant venir l'identité du corps de la requête, le banc restait vert,
     faute d'exercer ce chemin. Maintenant qu'on connaît l'identifiant d'Awa,
     Biya essaie de se faire passer pour elle par tous les noms de champ
     plausibles. Chacun doit rester sans effet — Biya lit toujours SON cahier,
     qui est vide. */
  for (const champ of ['moi', 'eleve', 'id', 'user', 'compte']) {
    const usurpe = await ca(Object.assign({ action: 'charger', token: tBiya },
                                          { [champ]: idAwa.eleve }));
    const lues = Object.keys(((usurpe.j || {}).reponses) || {}).length;
    dit(usurpe.status === 200 && lues === 0,
        `« ${champ} » dans la requête ne change pas de cahier`, 'lu ' + lues + ' réponse(s)');
  }

  const copies5 = await ca({ action: 'copies', token: tProf5 });
  dit(copies5.status === 200 && (copies5.j.copies || []).length === 0,
      'le prof de 5ᵉ ne voit AUCUNE copie de 6ᵉ');
  const vol5 = await ca({ action: 'copie', token: tProf5, eleve: idAwa.eleve });
  dit(vol5.status === 404, 'et ne peut pas en ouvrir une par son identifiant', 'reçu ' + vol5.status);

  console.log('\n\x1b[1m6. ⑤ L’annotation se pose sur le bon exercice\x1b[0m');
  const ann = await ca({ action: 'annoter', token: tProf, eleve: idAwa.eleve,
                         item: '6e/seq1/lecon1/b12/r0', texte: 'Bien vu. Cite le texte.', note: 8.5 });
  dit(ann.status === 200 && ann.j.ok, 'annotation acceptée');
  const vueEleve = await ca({ action: 'charger', token: tAwa });
  const a = (vueEleve.j.annotations || {})['6e/seq1/lecon1/b12/r0'];
  dit(a && a.texte === 'Bien vu. Cite le texte.' && a.note === 8.5,
      'l’élève la voit, sur CET exercice');
  dit(Object.keys(vueEleve.j.annotations).length === 1, 'et sur lui seul');
  dit(vueEleve.j.reponses['6e/seq1/lecon1/b12/r0'] === 'Le narrateur est interne.',
      'annoter n’a pas altéré la réponse');

  const horsBareme = await ca({ action: 'annoter', token: tProf, eleve: idAwa.eleve,
                               item: '6e/seq1/lecon1/b12/r1', texte: 'x', note: 25 });
  dit(horsBareme.status === 400, 'une note de 25/20 est refusée', 'reçu ' + horsBareme.status);

  const parEleve = await ca({ action: 'annoter', token: tAwa, eleve: idAwa.eleve,
                             item: '6e/seq1/lecon1/b12/r0', texte: '20/20 !', note: 20 });
  dit(parEleve.status === 403, 'un élève ne s’annote pas lui-même', 'reçu ' + parEleve.status);

  const profEcrit = await ca({ action: 'enregistrer', token: tProf, reponses: { '6e/x/y/z': 'a' } });
  dit(profEcrit.status === 403, 'un enseignant n’écrit pas dans le cahier à la place de l’élève',
      'reçu ' + profEcrit.status);

  /* ── ⑥ Le corrigé s'ouvre TOUT SEUL, mais seulement après avoir cherché ──
     C'est la règle arrêtée par Jacques le 27/08 : l'apprenant travaille en
     autonomie puis voit la correction, sans attendre son enseignant. Elle ne
     vaut que si elle est tenue par le SERVEUR — un verrou côté client se lève
     en changeant une variable dans la console, et un corrigé déjà présent
     dans la page se lit sans même cliquer. */
  console.log('\n\x1b[1m7. ⑥ La correction s’ouvre après avoir cherché, pas avant\x1b[0m');

  const dispo = await ca({ action: 'charger', token: tAwa });
  dit((dispo.j.corriges || 0) === 2, 'le cahier annonce ses 2 corrections type',
      'reçu ' + (dispo.j && dispo.j.corriges));

  // Awa a répondu sous b12 et b30 (section 2), jamais sous b77.
  const ouvert = await ca({ action: 'corrige', token: tAwa, item: '6e/seq1/lecon1/b12/r0' });
  dit(ouvert.status === 200 && /narrateur est interne/.test(ouvert.j.corrige || ''),
      'exercice traité → la correction s’ouvre', 'reçu ' + ouvert.status);

  const cBlanc = await gen('6e', 'livret', 'Nkolo');
  const tBlanc = await ouvre(cBlanc, '6e', 'livret');
  const refuse = await ca({ action: 'corrige', token: tBlanc, item: '6e/seq1/lecon1/b12/r0' });
  dit(refuse.status === 403 && refuse.j.code === 'cherche',
      'élève qui n’a rien écrit → REFUSÉ (403 « cherche »)', 'reçu ' + refuse.status);
  dit(!/narrateur est interne/.test(JSON.stringify(refuse.j || {})),
      'et le refus ne laisse pas fuiter le texte de la correction');

  /* Une réponse blanche ne compte pas. Sans ce contrôle, la règle se
     contournerait d'un clic : ouvrir le champ, taper une espace, tout lire. */
  await ca({ action: 'enregistrer', token: tBlanc, reponses: { '6e/seq1/lecon1/b12/r0': '   ' } });
  const blanc2 = await ca({ action: 'corrige', token: tBlanc, item: '6e/seq1/lecon1/b12/r0' });
  dit(blanc2.status === 403, 'une réponse blanche ne déverrouille rien', 'reçu ' + blanc2.status);

  await ca({ action: 'enregistrer', token: tBlanc, reponses: { '6e/seq1/lecon1/b12/r0': 'Il dit « je ».' } });
  const blanc3 = await ca({ action: 'corrige', token: tBlanc, item: '6e/seq1/lecon1/b12/r0' });
  dit(blanc3.status === 200, 'dès qu’il répond vraiment, elle s’ouvre', 'reçu ' + blanc3.status);

  const parProf = await ca({ action: 'corrige', token: tProf, item: '6e/seq1/lecon1/b12/r0' });
  dit(parProf.status === 200, 'l’enseignant y accède sans condition — il prépare son cours');

  /* L'ordre des deux refus compte, et il est celui-ci : « as-tu cherché ? »
     AVANT « existe-t-il une correction ? ». L'inverse dirait à qui n'a rien
     écrit quels exercices en ont une — une carte du corrigé, donnée sans
     avoir rien fait. On répond donc 403 tant que la règle n'est pas remplie,
     et 404 seulement ensuite. */
  const nonCherche = await ca({ action: 'corrige', token: tAwa, item: '6e/seq1/lecon1/b77/r0' });
  dit(nonCherche.status === 403,
      'sans réponse, on ne sait même pas si une correction existe (403 d’abord)',
      'reçu ' + nonCherche.status);

  await ca({ action: 'enregistrer', token: tAwa, reponses: { '6e/seq1/lecon1/b77/r0': 'Ma production.' } });
  const nulle = await ca({ action: 'corrige', token: tAwa, item: '6e/seq1/lecon1/b77/r0' });
  dit(nulle.status === 404 && nulle.j.code === 'aucun',
      'une fois traité, un exercice sans correction type le DIT (404)',
      'reçu ' + nulle.status);

  const autreCahier = await ca({ action: 'corrige', token: tProf5, item: '6e/seq1/lecon1/b12/r0' });
  dit(autreCahier.status === 404,
      'le prof de 5ᵉ ne tire pas les corrections de la 6ᵉ avec une clé de 6ᵉ',
      'reçu ' + autreCahier.status);

  console.log('\n' + '─'.repeat(68));
  const total = ok + ko;
  if (ko === 0) console.log(`\x1b[32m\x1b[1m  ✓ ${ok}/${total} contrôles passés\x1b[0m`);
  else console.log(`\x1b[31m\x1b[1m  ✗ ${ko} échec(s) sur ${total}\x1b[0m`);
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {}
  fin(ko === 0 ? 0 : 1);
})();
