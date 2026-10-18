#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   tests/banc_espaces_gains.cjs — ESPACE PARTENAIRE ET TABLEAU FINANCIER
   © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).

     node tests/banc_espaces_gains.cjs

   Aucun fournisseur ne verse les commissions (SkySMS garde les fonds chez
   Nexah) : le Centre paie à la FIN DU MOIS. Ce banc parle aux vrais endpoints
   (php -S jetable) et garde :
     · api/parrainage.php?action=transactions — réussies, échouées, en attente,
       à régler, code marchand, numéros, totaux ; lecture SEULE ;
     · ?action=journal — ce que le serveur a écrit ;
     · ?action=versements_mois — la liste à payer, puis « marquer versés » ;
     · ?action=moi — ce que voit l'enseignant-partenaire (plateforme/gains.html).
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const { spawn } = require('child_process');

const RACINE = path.resolve(__dirname, '..');
let ok = 0, ko = 0;
const dire = (b, m, d) => { b ? ok++ : ko++; console.log('  ' + (b ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m') + ' ' + m + (!b && d ? '  → ' + d : '')); };

const PORT = 9081 + (process.pid % 90);
const BASE = 'http://127.0.0.1:' + PORT;
const SECRET = 'banc-gains-' + Math.random().toString(36).slice(2, 12);
const BAC = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-banc-gains-'));
const FICHIERS = ['plateforme.php', 'parrainage.php', '_json_boot.php', 'config_sync.php', '_auth_lib.php', '_livret_lib.php',
  '_notify_lib.php', '_skysms_lib.php', '_parrainage_lib.php', '_recettes_lib.php', '_sentinel.php', '_bot_log.php', '_manuel_lib.php'];

function monter() {
  for (const d of ['api/data/payments', 'api/data/payments_manuel', 'data']) fs.mkdirSync(path.join(BAC, d), { recursive: true });
  for (const f of FICHIERS) { const s = path.join(RACINE, 'api', f); if (fs.existsSync(s)) fs.copyFileSync(s, path.join(BAC, 'api', f)); }
  fs.writeFileSync(path.join(BAC, 'api', 'payment_config.php'), "<?php define('API_SECRET', " + JSON.stringify(SECRET) + ");\n");
  fs.writeFileSync(path.join(BAC, 'data', 'veritas_db.json'), JSON.stringify({
    school: { nom: 'VÉRITAS' }, students: [], studentAccounts: [],
    visitorAccounts: [{ id: 'va_eleve', user: 'eleve', nom: 'Élève', tel: '677112233', statut: 'actif', plans: [] }],
    elearning: { plans: [{ id: 'abo_pro_m', nom: 'PRO', prix: 2000, duree: 'mensuel' }], abonnements: [] },
    plateforme: { offres: { joursEssai: 7, essaisParIp: 50 } }, lastModified: 1000,
  }));
}
let srv = null;
async function lancer() {
  srv = spawn('php', ['-S', '127.0.0.1:' + PORT, '-t', BAC], { cwd: BAC, stdio: ['ignore', 'ignore', 'ignore'] });
  for (let i = 0; i < 60; i++) { try { const r = await fetch(BASE + '/api/parrainage.php?action=config'); if (r.status) return true; } catch (e) { await new Promise(s => setTimeout(s, 150)); } }
  return false;
}
async function api(fichier, q, corps, jeton) {
  const h = { 'Content-Type': 'application/json' }; if (jeton) h.Authorization = 'Bearer ' + jeton;
  const r = await fetch(BASE + '/api/' + fichier + '?' + q, corps ? { method: 'POST', headers: h, body: JSON.stringify(corps) } : { headers: h });
  let j = {}; try { j = await r.json(); } catch (e) {}
  return { http: r.status, j };
}
const etat = (ref, o) => fs.writeFileSync(path.join(BAC, 'api/data/payments', 'camerpay_' + ref + '.json'), JSON.stringify(Object.assign({
  ref, provider: 'skysms', montant: 2000, label: 'PRO', intent: 'subscription', targetId: 'abo_pro_m', clientNom: 'Client ' + ref,
  clientTel: '237699000111', status: 'pending', created_at: new Date().toISOString(),
}, o)));

(async () => {
  console.log('\n\x1b[1mVÉRITAS — espace partenaire, transactions, versements de fin de mois\x1b[0m\n');
  monter();
  if (!(await lancer())) { console.log('  impossible de lancer php -S'); process.exit(1); }
  try {
    // Un enseignant-partenaire, et une vente faite avec son code.
    let r = await api('plateforme.php', 'action=partenaires', { op: 'creer', nom: 'IPR Test', tel: '699000001', code: 'PROF-TEST' }, SECRET);
    const reprise = r.j.reprise, accId = r.j.accId;
    dire(r.j.ok && reprise, 'partenaire créé (compte + code de reprise)', JSON.stringify(r.j));
    r = await api('parrainage.php', 'action=crediter', { ref: 'VT-OK1', montant: 1800, code: 'PROF-TEST', tel: '677112233', intent: 'subscription', targetId: 'abo_pro_m' }, SECRET);
    dire(r.j.ok && r.j.commission === 360, 'vente de 1 800 F avec son code : 360 F crédités (20 %)', JSON.stringify(r.j));

    etat('VT-OK1', { status: 'paid', montant: 1800, paid_at: new Date().toISOString(), granted: true, parrainage: { code: 'PROF-TEST' }, clientTel: '237677112233' });
    etat('VT-KO1', { status: 'failed', montant: 1500, failure_reason: 'Solde insuffisant', clientTel: '237655443322' });
    etat('VT-AT1', { status: 'pending', montant: 2000, a_regler: true, reason: 'Aucune confirmation après 24 h' });
    etat('VT-OUT', { provider: 'camerpay_payout_cm', status: 'sent', montant: 5000 });
    fs.writeFileSync(path.join(BAC, 'api/data/payments_manuel', 'manuel_VT-MAN1.json'), JSON.stringify({
      ref: 'VT-MAN1', intent: 'livret', montant: 1500, label: 'Cahier 3e', clientNom: 'Parent', clientTel: '237698765432',
      status: 'declare', declared_at: new Date().toISOString() }));

    // ── Tableau financier ──
    r = await api('parrainage.php', 'action=transactions&jours=30');
    dire(r.http === 401, 'transactions : refusé sans la clé d’administration', r.http);
    r = await api('parrainage.php', 'action=transactions&jours=30', null, SECRET);
    const t = r.j.totaux || {}, tx = r.j.transactions || [];
    dire(r.j.ok && t.n === 4, '4 transactions (le versement sortant n’en est pas une)', JSON.stringify(t));
    dire(t.reussi === 1 && t.echoue === 1 && t.attente === 2 && t.aRegler === 1, '1 réussie · 1 échouée · 2 en attente dont 1 à régler', JSON.stringify(t));
    dire(t.encaisse === 1800 && t.echoueMontant === 1500 && t.attenteMontant === 3500, 'montants : 1 800 encaissés, 1 500 échoués, 3 500 en attente', JSON.stringify(t));
    dire(t.tauxReussite === 50, 'taux de réussite : 50 % des transactions closes', t.tauxReussite);
    const ok1 = tx.find(x => x.ref === 'VT-OK1') || {};
    dire(ok1.tel === '677112233' && ok1.operateur === 'MTN' && ok1.code === 'PROF-TEST' && ok1.commission === 360,
      'la ligne porte le numéro, l’opérateur, le code et la commission', JSON.stringify(ok1));
    const ko1 = tx.find(x => x.ref === 'VT-KO1') || {};
    dire(ko1.statut === 'echoue' && ko1.operateur === 'Orange' && /insuffisant/.test(ko1.motif), 'échec : Orange, avec son motif', JSON.stringify(ko1));
    const man = tx.find(x => x.ref === 'VT-MAN1') || {};
    dire(man.source === 'Code marchand' && man.statut === 'attente', 'paiement par code marchand déclaré : « en attente »', JSON.stringify(man));
    dire(r.j.commissionsDues === 360 && (r.j.parOperateur || {}).MTN, 'commissions dues et répartition par opérateur', JSON.stringify(r.j.parOperateur));
    const avant = fs.readFileSync(path.join(BAC, 'api/data/payments', 'camerpay_VT-AT1.json'), 'utf8');
    await api('parrainage.php', 'action=transactions&jours=30', null, SECRET);
    dire(fs.readFileSync(path.join(BAC, 'api/data/payments', 'camerpay_VT-AT1.json'), 'utf8') === avant, 'lecture SEULE : aucun fichier de paiement réécrit');

    r = await api('parrainage.php', 'action=journal&n=100', null, SECRET);
    dire(r.j.ok && (r.j.lignes || []).some(l => l.type === 'CODE_AMI'), 'journal : la commission y figure (CODE_AMI)', JSON.stringify((r.j.lignes || []).slice(0, 2)));

    // ── Espace partenaire ──
    r = await api('plateforme.php', 'action=reprise', { code: reprise });
    const jeton = r.j.token;
    r = await api('parrainage.php', 'action=moi', null, jeton);
    const m = r.j;
    dire(m.ok && m.code === 'PROF-TEST' && m.commissionPct === 20, 'espace partenaire : son code et son taux (20 %)', JSON.stringify(m).slice(0, 200));
    dire(m.solde === 360 && m.gagne === 360 && (m.ceMois || {}).commission === 360 && (m.ceMois || {}).ventes === 1, 'gains : 360 à recevoir, 360 ce mois-ci, 1 paiement', JSON.stringify(m.ceMois));
    dire(m.versement && m.versement.mode === 'mensuel' && /^\d{4}-\d{2}-\d{2}$/.test(m.versement.prochain), 'versement mensuel annoncé, avec sa date', JSON.stringify(m.versement));
    dire(m.partenaire && m.partenaire.ouvert && m.partenaire.cycle === 1 && m.partenaire.seuil === 5, 'accès Atelier ouvert, 1 / 5 vers la prolongation', JSON.stringify(m.partenaire));
    dire(Object.keys(m.parMois || {}).length === 6 && m.filleulsPayants === 1, '6 mois d’historique, 1 filleul payant', JSON.stringify(m.parMois));

    // ── Versements de fin de mois ──
    r = await api('parrainage.php', 'action=versements_mois', null, SECRET);
    const l = (r.j.lignes || [])[0] || {};
    dire(r.j.ok && l.benef === 'acc:' + accId && l.solde === 360 && l.tel === '699000001' && l.partenaire, 'liste à payer : le partenaire, son numéro, 360 F', JSON.stringify(r.j));
    dire(l.seuilAtteint === false && r.j.aPayer === 0, 'sous le seuil de 2 000 F : reporté, rien à payer ce mois', JSON.stringify(r.j));
    r = await api('parrainage.php', 'action=versements_mois', { lignes: [{ benef: l.benef, montant: 9999 }] }, SECRET);
    dire(r.j.ok && r.j.resultats[0].ok === false, 'plus que le solde : refusé ligne par ligne', JSON.stringify(r.j));
    r = await api('parrainage.php', 'action=versements_mois', { lignes: [{ benef: l.benef, montant: 360, note: 'octobre' }] }, SECRET);
    dire(r.j.ok && r.j.resultats[0].ok === true, 'versement de 360 F marqué', JSON.stringify(r.j));
    r = await api('parrainage.php', 'action=moi', null, jeton);
    dire(r.j.solde === 0 && r.j.verse === 360 && (r.j.versements || [])[0] && r.j.versements[0].etat === 'verse',
      'le partenaire le voit : solde 0, 360 F versés', JSON.stringify(r.j.versements));
    r = await api('parrainage.php', 'action=versements_mois', null, SECRET);
    dire((r.j.lignes || []).length === 0, 'plus rien à payer ensuite', JSON.stringify(r.j.lignes));
  } finally {
    try { srv && srv.kill(); } catch (e) {}
    try { fs.rmSync(BAC, { recursive: true, force: true }); } catch (e) {}
  }
  console.log('\n' + (ko === 0 ? '\x1b[32m\x1b[1m  ✓ ' + ok + '/' + ok + ' contrôles passés' : '\x1b[31m\x1b[1m  ✗ ' + ko + ' échec(s) sur ' + (ok + ko)) + '\x1b[0m\n');
  process.exit(ko === 0 ? 0 : 1);
})();
