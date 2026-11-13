#!/usr/bin/env node
/* tests/banc_apprendre_reglages.cjs — CE QUI SE RÈGLE DANS L'ADMIN ARRIVE DANS APPRENDRE
     node tests/banc_apprendre_reglages.cjs
   Écran admin « Apprendre » (app.js, pgApprendreAdmin) → DB.apprendreCfg →
   api/apprendre_config.php → window.VRT_APP_CFG → apprendre/commun.js.
   Prouve : ① l'endpoint sert les réglages de la base en JavaScript, en liste
   blanche, et un objet vide sans base ; ② commun.js les applique (classes,
   matières, leçons, parties, leçon ajoutée, ressources, familles, formules,
   offre, cahiers) ; ③ une leçon PAYANTE ne reçoit que son en-tête ; ④ sans
   réglage, Apprendre est inchangé ; ⑤ calendrier.js applique dates et échéances. */
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), vm = require('vm');
const { spawn } = require('child_process');
const RACINE = path.resolve(__dirname, '..');
let ok = 0, ko = 0;
const dire = (m, b, d) => { b ? ok++ : ko++; console.log('  ' + (b ? '\x1b[32m✓\x1b[0m ' : '\x1b[31m✗\x1b[0m ') + m + (!b && d ? '  → ' + d : '')); };

const CFG = {
  classes: { '6e': { visible: false } },
  matieres: { maths: { nom: 'Maths réglées', couleur: '#AA0000' }, svt: { visible: false } },
  lecons: {
    '3e-maths-thales': { titre: 'Thalès réglé', parties: [{ t: 'P1 réglée', html: '<p>x</p>', src: 0 }, { t: 'Ajoutée', html: '<p>y</p>', src: -1 }] },
    '3e-ecm-r02': { titre: 'Payante renommée', intro: 'NE DOIT PAS PASSER', parties: [] }
  },
  nouvelles: [{ id: 'v-3e-francais-banc', c: '3e', m: 'francais', titre: 'Leçon du banc', parties: [{ t: 'P', html: '<p>z</p>' }],
    quiz: [{ q: 'Q ?', r: ['a', 'b'], b: 1 }, { q: '', r: [] }] }],
  ressourcesAjout: [{ id: 'r-banc', t: 'methode', ti: 'Ressource du banc', u: '/corriges/', classes: ['3e'], m: 'maths', debut: true }],
  ressources: { lv1: { ti: 'Labo renommé', ab: 1 }, lv2: { masquer: true } },
  familles: { jeu: { visible: false }, labo: { nom: 'Expériences' } },
  formules: { starter: { nom: 'Débutant' }, elite: { masquer: true } },
  offre: { titre: 'Titre du banc', conseilAutre: 'pro', humainActif: false },
  cahiers: [{ c: '3e', m: 'francais', masquer: true }],
  whatsapp: '+237 600 00 00 00',
  calendrier: { session: { BEPC: { ecritDe: '2027-06-01' } }, ajout: [{ t: 'Examen blanc du banc', de: '2027-02-15' }], masquer: ['Vacances de Noël'] },
  secret: 'NE DOIT PAS SORTIR'
};

function charger(cfg, avecCalendrier) {
  const W = { VRT_APP_CFG: cfg, localStorage: { getItem() { return null; }, setItem() {} }, sessionStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
    location: { search: '' }, fetch: () => Promise.reject(new Error('hors ligne')) };
  W.window = W;
  const ctx = vm.createContext(W);
  const fichiers = ['progressions.js', 'lecons.js', 'ressources.js', 'apercus-3e.js', 'commun.js'].concat(avecCalendrier ? ['calendrier.js'] : []);
  for (const f of fichiers) vm.runInContext(fs.readFileSync(path.join(RACINE, 'apprendre', f), 'utf8'), ctx, { filename: f });
  return W;
}

(async () => {
  console.log('\n🔍 Banc « les réglages de l\'admin arrivent dans Apprendre »\n');

  // ── ① l'endpoint ─────────────────────────────────────────────────────────
  const BAC = fs.mkdtempSync(path.join(os.tmpdir(), 'vrt-banc-reglages-'));
  fs.mkdirSync(path.join(BAC, 'api'), { recursive: true });
  for (const f of ['apprendre_config.php', '_json_boot.php']) fs.copyFileSync(path.join(RACINE, 'api', f), path.join(BAC, 'api', f));
  const PORT = 8600 + (process.pid % 90), BASE = 'http://127.0.0.1:' + PORT;
  const php = spawn('php', ['-S', '127.0.0.1:' + PORT, '-t', BAC], { stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 700));
  try {
    let r = await fetch(BASE + '/api/apprendre_config.php'), t = await r.text();
    dire('sans base : un objet vide, pas une erreur', r.status === 200 && /^window\.VRT_APP_CFG=\{\};/.test(t), t.slice(0, 80));
    fs.mkdirSync(path.join(BAC, 'data'), { recursive: true });
    fs.writeFileSync(path.join(BAC, 'data/veritas_db.json'), JSON.stringify({ apprendreCfg: Object.assign({}, CFG, { textes: [{ de: 'a', vers: '</script><b>' }] }), students: [{ nom: 'privé' }] }));
    r = await fetch(BASE + '/api/apprendre_config.php'); t = await r.text();
    const ct = r.headers.get('content-type') || '';
    dire('servi en JavaScript', /javascript/.test(ct), ct);
    const W = {}; vm.runInNewContext(t, { window: W });
    dire('les réglages de la base redescendent', W.VRT_APP_CFG && W.VRT_APP_CFG.matieres && W.VRT_APP_CFG.matieres.maths.nom === 'Maths réglées');
    dire('liste blanche : une clé inconnue ne sort pas', !/NE DOIT PAS SORTIR/.test(t));
    dire('le reste de la base ne sort pas', !/privé/.test(t));
    dire('« </script> » d\'un texte ne ferme pas la balise', !/<\/script>/i.test(t));
  } finally { php.kill(); }

  // ── ② ③ commun.js ────────────────────────────────────────────────────────
  const W = charger(CFG, true), A = W.VRT.app, LE = W.VRT_LECONS, R = W.VRT_RES;
  dire('classe masquée retirée', A.CLASSES.indexOf('6e') < 0 && A.CLASSES.indexOf('5e') >= 0);
  dire('matière renommée et recolorée', A.PAR_ID.maths.nom === 'Maths réglées' && A.PAR_ID.maths.t[0] === '#AA0000');
  dire('matière masquée retirée, ses leçons aussi', !A.MATIERES.some(m => m.id === 'svt') && !Object.keys(LE).some(k => LE[k].m === 'svt'));
  const T = LE['3e-maths-thales'];
  dire('leçon renommée', T && T.titre === 'Thalès réglé');
  dire('parties : modifiée, retirée, ajoutée', T && T.parties.length === 2 && T.parties[0].t === 'P1 réglée' && T.parties[1].t === 'Ajoutée');
  dire('le schéma d\'origine de la partie 1 est conservé', T && !!(T.parties[0].illus || T.parties[0].anim));
  const P = LE['3e-ecm-r02'];
  dire('leçon payante : titre modifié', P && P.titre === 'Payante renommée');
  dire('leçon payante : contenu intact (suite servie par le serveur)', P && P.intro !== 'NE DOIT PAS PASSER' && P.parties.some(p => p.verrou));
  const N = LE['v-3e-francais-banc'];
  dire('leçon ajoutée, placée et quiz nettoyé', N && N.n >= 900 && N.quiz.length === 1 && N.quiz[0].b === 1);
  dire('ressource ajoutée en tête de la matière', R.items['r-banc'] && R.mat['3e|maths'][0] === 'r-banc');
  dire('ressource modifiée (titre, accès)', R.items.lv1 && R.items.lv1.ti === 'Labo renommé' && R.items.lv1.ab === 1);
  dire('ressource masquée retirée des listes', !R.items.lv2 && !Object.keys(R.lec).some(k => R.lec[k].indexOf('lv2') >= 0));
  dire('famille masquée : ses ressources disparaissent', !A.FAMILLES.some(f => f[0] === 'jeu') && !Object.keys(R.items).some(k => R.items[k].t === 'jeu'));
  dire('famille renommée', A.FAMILLES.some(f => f[0] === 'labo' && f[1] === 'Expériences'));
  const o = A.offre('5e', 'francais', 'lecon');
  dire('offre : titre, formule renommée, formule masquée', /Titre du banc/.test(o) && /Débutant/.test(o) && !/>Élite</.test(o));
  dire('offre : formule conseillée réglée', /fo-c"><span class="fo-badge">Conseillée pour toi<\/span><p class="fo-nom">Pro/.test(o));
  dire('offre : carte « Avec un professeur » retirée', !/fo-h/.test(o));
  dire('cahier masqué pour 3e français', A.cahierPour('3e', 'francais') === null && !!A.cahierPour('4e', 'francais'));
  dire('numéro WhatsApp nettoyé', A.WA === '237600000000');
  const E = W.VRT.annee.echeances('3e');
  dire('calendrier : date du BEPC réglée', W.VRT.annee.SESSION.BEPC.ecrit[0] === '2027-06-01');
  dire('calendrier : échéance ajoutée, échéance masquée', E.some(e => e.t === 'Examen blanc du banc') && !E.some(e => e.t === 'Vacances de Noël'));

  // ── ④ sans réglage : rien ne change ──────────────────────────────────────
  const V = charger(undefined, true);
  dire('sans réglage : 12 classes, matières et leçons d\'origine', V.VRT.app.CLASSES.length === 12 && V.VRT_LECONS['3e-maths-thales'].titre === 'La propriété de Thalès dans le triangle');
  dire('sans réglage : offre d\'origine', /Choisis ta formule/.test(V.VRT.app.offre('3e', 'francais', 'lecon')) && V.VRT.app.WA === '237697637739');

  console.log('\n' + ok + ' réussis, ' + ko + ' échoués\n');
  process.exit(ko ? 1 : 0);
})();
