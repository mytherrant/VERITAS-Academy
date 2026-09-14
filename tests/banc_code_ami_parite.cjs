/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_code_ami_parite.cjs — LE NAVIGATEUR ET LE SERVEUR DISENT-ILS LA MÊME CHOSE ?
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

       node tests/banc_code_ami_parite.cjs

   Trois tables existent en deux exemplaires, un dans app.js (pour afficher),
   un dans api/ (pour encaisser). Rien ne les relie, sauf ce banc :
     ① les formules Starter / Pro / Élite / Famille — _formulesDefaut() ⇄ vrt_plans_formules() ;
     ② le code ami d'un identifiant — _codeAmiCalculer() ⇄ vrt_parr_code_pour_id() ;
     ③ l'opérateur d'un numéro — _payGuessOperator() ⇄ vrt_parr_methode().
   Un écart en ① affiche un prix que le serveur refuse ; en ② un code que
   personne ne reconnaît ; en ③ un versement parti chez le mauvais opérateur.
   Aucun ne lève d'erreur : c'est pour cela qu'ils ont un banc.
   ════════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RACINE = path.join(__dirname, '..');
const APP = fs.readFileSync(path.join(RACINE, 'app.js'), 'utf8');
let vert = 0, rouge = 0;
const ok = (quoi, cond, detail) => {
  if (cond) { vert++; console.log('  \x1b[32m✓\x1b[0m ' + quoi); }
  else { rouge++; console.log('  \x1b[31m✗\x1b[0m ' + quoi + (detail ? '\n      \x1b[33m' + detail + '\x1b[0m' : '')); }
};
const titre = t => console.log('\n\x1b[1m' + t + '\x1b[0m');

/** Le texte d'une fonction d'app.js, de sa déclaration à l'accolade fermante en colonne 0. */
function extraire(debut) {
  const i = APP.indexOf(debut);
  if (i < 0) return null;
  const m = /\r?\n\}\r?\n/.exec(APP.slice(i));
  return m ? APP.slice(i, i + m.index + m[0].length) : null;
}
function php(code) {
  return execFileSync('php', ['-r', code], { cwd: RACINE, encoding: 'utf8' });
}

(async () => {
  // ─────────────────────────────────────────────────────────────────────────
  titre('① Les formules : mêmes identifiants, mêmes prix, mêmes étiquettes');
  const srcF = extraire('function _formulesDefaut(){');
  ok('_formulesDefaut() lisible dans app.js', !!srcF);
  if (srcF) {
    const js = new Function(srcF + '\nreturn _formulesDefaut();')();
    const serveur = JSON.parse(php('require "api/_auth_lib.php"; echo json_encode(array_values(vrt_plans_formules()), JSON_UNESCAPED_UNICODE);'));
    ok('8 formules de chaque côté', js.length === 8 && serveur.length === 8, 'js=' + js.length + ' serveur=' + serveur.length);
    const champs = ['id', 'groupe', 'variante', 'nom', 'public', 'cible', 'prix', 'ancien', 'duree', 'planTags', 'avantages', 'populaire', 'enfantsMax'];
    const ecarts = [];
    serveur.forEach(s => {
      const c = js.find(x => x.id === s.id);
      if (!c) { ecarts.push(s.id + ' absente du navigateur'); return; }
      champs.forEach(k => {
        if (JSON.stringify(c[k]) !== JSON.stringify(s[k])) ecarts.push(s.id + '.' + k + ' : ' + JSON.stringify(c[k]) + ' ≠ ' + JSON.stringify(s[k]));
      });
    });
    ok('chaque champ affiché est celui que le serveur encaisse', ecarts.length === 0, ecarts.slice(0, 6).join(' | '));
    const pro = js.find(x => x.id === 'abo_pro_a');
    ok('Pro à l’année : 20 000 F, barré 24 000 F (deux mois offerts)', pro && pro.prix === 20000 && pro.ancien === 24000);
  }

  // ─────────────────────────────────────────────────────────────────────────
  titre('② Le code ami d’un identifiant');
  const srcC = extraire('window._codeAmiCalculer = function(id){');
  ok('_codeAmiCalculer lisible dans app.js', !!srcC);
  if (srcC) {
    const window = { crypto: require('crypto').webcrypto, TextEncoder };
    const calculer = new Function('window', 'crypto', 'TextEncoder', srcC.replace('window._codeAmiCalculer =', 'return') )(window, window.crypto, TextEncoder);
    const ids = ['va_1789312345678_a1b2c3', 'va_awa', 'ens_1', 'k3f9a2pq', 'va_1757000000000_ffffff', 'é-accentué'];
    // Les identifiants ne contiennent aucune apostrophe : le JSON se glisse tel quel dans une chaîne PHP.
    const attendu = JSON.parse(php("require 'api/_parrainage_lib.php'; $o=[]; foreach (json_decode('" + JSON.stringify(ids) + "', true) as $i) $o[]=vrt_parr_code_pour_id($i); echo json_encode($o);"));
    const obtenus = [];
    for (const id of ids) obtenus.push(await calculer(id));
    ok('le navigateur calcule le même code que le serveur (6 identifiants, accents compris)',
       JSON.stringify(obtenus) === JSON.stringify(attendu), 'js=' + obtenus.join(',') + ' serveur=' + attendu.join(','));
  }

  // ─────────────────────────────────────────────────────────────────────────
  titre('③ L’opérateur d’un numéro');
  const srcO = extraire('function _payGuessOperator(tel){');
  ok('_payGuessOperator lisible dans app.js', !!srcO);
  if (srcO) {
    const guess = new Function(srcO + '\nreturn _payGuessOperator;')();
    const serveur = JSON.parse(php('require "api/_parrainage_lib.php"; $o=[]; for ($p=600;$p<=699;$p++) $o[$p]=vrt_parr_methode($p."123456"); echo json_encode($o);'));
    const trad = { mtn: 'mtn_momo', orange: 'orange_money', '': '' };
    const ecarts = [];
    for (let p = 600; p <= 699; p++) {
      const j = trad[guess(p + '123456')];
      if (j !== serveur[p]) ecarts.push(p + ' js=' + j + ' php=' + serveur[p]);
    }
    ok('mêmes opérateurs sur les 100 préfixes 600-699', ecarts.length === 0, ecarts.slice(0, 5).join(' | '));
  }

  console.log('\n────────────────────────────────────────────────────────────────────');
  if (rouge === 0) { console.log('\x1b[32m\x1b[1m  ✓ ' + vert + '/' + vert + ' — le navigateur affiche ce que le serveur encaisse.\x1b[0m\n'); process.exit(0); }
  console.log('\x1b[31m\x1b[1m  ✗ ' + rouge + ' écart(s) sur ' + (vert + rouge) + '.\x1b[0m\n'); process.exit(1);
})().catch(e => { console.error(e); process.exit(2); });
