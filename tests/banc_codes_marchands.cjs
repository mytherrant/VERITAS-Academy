#!/usr/bin/env node
/* ============================================================================
 *  banc_codes_marchands.cjs — les coordonnées d'encaissement ont DEUX sources,
 *  et elles doivent dire la même chose.
 *
 *  Depuis le 21/09/2026 (CamerPay muet), on encaisse par code marchand au nom
 *  de VERITAS EDUCATION. Les coordonnées vivent à deux endroits, volontairement :
 *    · app.js → VERITAS_PAYMENTS : fenêtres de paiement de l'application ;
 *    · api/payment_camerpay.php → camerpayManuelInfo() : servies par la sonde
 *      ?action=config aux pages qui ne chargent pas app.js (cahiers, vitrine,
 *      Atelier), et recopiées dans le motif `reason` que l'Atelier affiche.
 *
 *  Le jour où l'on change un numéro dans l'une et pas dans l'autre, une moitié
 *  des clients paie sur le bon compte et l'autre sur l'ancien — sans aucune
 *  erreur nulle part. Ce banc refuse le déploiement dans ce cas.
 *
 *  Il vérifie aussi l'inverse : les pages publiques NE recopient PAS les codes.
 *  Elles doivent les LIRE dans la sonde ; une copie en dur y serait une
 *  troisième source, que personne ne penserait à mettre à jour.
 *
 *  Usage : node tests/banc_codes_marchands.cjs [racine]   (racine = dépôt)
 * ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const lire = f => fs.readFileSync(path.join(RACINE, f), 'utf8').replace(/\r\n/g, '\n');

let ko = 0, ok = 0;
const dit = (v, q) => { console.log((v ? '  \x1b[32m✓\x1b[0m ' : '  \x1b[31m✗\x1b[0m ') + q); v ? ok++ : ko++; };
const chiffres = s => String(s || '').replace(/\D+/g, '').replace(/^237(?=\d{9}$)/, '');

// ── 1. app.js : on EXÉCUTE le bloc réel, on ne le relit pas à la main ─────
const app = lire('app.js');
const debut = app.indexOf('window.VERITAS_PAYMENTS = (function(){');
const fin = debut >= 0 ? app.indexOf('})();', debut) : -1;
let P = null;
if (debut >= 0 && fin > debut) {
  const ctx = { DB: {}, window: {} };
  ctx.window = ctx;
  vm.createContext(ctx);
  try { vm.runInContext(app.slice(debut, fin + 5), ctx); P = ctx.VERITAS_PAYMENTS; } catch (e) { P = null; }
}
console.log('\x1b[1m① app.js — VERITAS_PAYMENTS\x1b[0m');
dit(!!(P && P.momo && P.orange), 'le bloc VERITAS_PAYMENTS s’exécute');

// ── 2. PHP : camerpayManuelInfo() ─────────────────────────────────────────
const php = lire('api/payment_camerpay.php');
const fn = (php.match(/function camerpayManuelInfo\(\)\s*\{([\s\S]*?)\n\}/) || [])[1] || '';
const champ = (op, cle) => {
  const bloc = (fn.match(new RegExp("'" + op + "'\\s*=>\\s*\\[([\\s\\S]*?)\\]")) || [])[1] || '';
  return (bloc.match(new RegExp("'" + cle + "'\\s*=>\\s*'([^']*)'")) || [])[1] || '';
};
const titulairePhp = (fn.match(/'titulaire'\s*=>\s*'([^']*)'/) || [])[1] || '';
console.log('\x1b[1m② api/payment_camerpay.php — camerpayManuelInfo()\x1b[0m');
dit(!!fn && !!champ('momo', 'codeMarchand') && !!champ('orange', 'codeMarchand'), 'la fonction et ses deux codes marchands sont lisibles');

// ── 3. Les deux sources concordent ────────────────────────────────────────
console.log('\x1b[1m③ Les deux sources disent la même chose\x1b[0m');
if (P) {
  for (const op of ['momo', 'orange']) {
    const nom = op === 'momo' ? 'MTN MoMo' : 'Orange Money';
    dit(chiffres(P[op].numero) === chiffres(champ(op, 'numero')),
      nom + ' : même numéro (' + chiffres(P[op].numero) + ' / ' + chiffres(champ(op, 'numero')) + ')');
    dit(String(P[op].codeMarchand || '') === champ(op, 'codeMarchand'),
      nom + ' : même code marchand (' + (P[op].codeMarchand || '∅') + ' / ' + (champ(op, 'codeMarchand') || '∅') + ')');
    dit(String(P[op].code || '') === champ(op, 'ussd'),
      nom + ' : même entrée USSD (' + (P[op].code || '∅') + ' / ' + (champ(op, 'ussd') || '∅') + ')');
    dit(String(P[op].nomCompte || '') === titulairePhp,
      nom + ' : même titulaire (« ' + (P[op].nomCompte || '') + ' » / « ' + titulairePhp + ' »)');
  }
}

// Le motif `reason` est lu TEL QUEL par l'Atelier : il doit porter les codes en vigueur.
const bloqueHS = (php.match(/CAMERPAY_HORS_SERVICE\)\s*\{([\s\S]*?)\n\}/) || [])[1] || '';
const reason = ((bloqueHS.match(/'reason'\s*=>\s*([\s\S]*?),\n/) || [])[1] || '').replace(/'\s*\.\s*'/g, '');
dit(!!reason && reason.includes(champ('momo', 'codeMarchand')) && reason.includes(champ('orange', 'codeMarchand')),
  'le motif affiché par l’Atelier cite les deux codes en vigueur');

// ── 4. Aucune troisième copie dans les pages publiques ────────────────────
console.log('\x1b[1m④ Les pages publiques lisent la sonde, elles ne recopient pas\x1b[0m');
const codes = [champ('momo', 'codeMarchand'), champ('orange', 'codeMarchand')].filter(Boolean);
for (const f of ['livrets/gate.js', 'assets/vitrine.js', 'plateforme/index.html']) {
  let t = '';
  try { t = lire(f); } catch (e) { dit(false, f + ' introuvable'); continue; }
  const trouves = codes.filter(c => t.includes(c));
  dit(trouves.length === 0, f + (trouves.length ? ' recopie ' + trouves.join(', ') + ' en dur' : ' ne recopie aucun code'));
}

console.log('\n' + (ko ? '\x1b[31m\x1b[1m  ✗ ' + ko + ' au rouge sur ' + (ok + ko) + '.\x1b[0m'
                    : '\x1b[32m\x1b[1m  ✓ ' + ok + '/' + ok + ' — une seule vérité sur les comptes marchands.\x1b[0m'));
process.exit(ko ? 1 : 0);
