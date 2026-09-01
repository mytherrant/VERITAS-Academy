/* tests/mock_livrets.cjs — serveur de banc d'essai pour les livrets en ligne.
 *
 * POURQUOI — PHP est absent de la machine de développement (cf. les contraintes
 * de déploiement du projet) : ni api/livret.php ni api/collab.php ne peuvent
 * tourner en local. Sans ce banc, les écrans du volet collaboratif (mur
 * d'abonnement, vue élève, console enseignant) ne seraient jamais exercés avant
 * la production — et la production, ici, c'est le site live sans pré-production.
 *
 * CE QU'IL EST, ET CE QU'IL N'EST PAS
 *   Il sert les fichiers du projet ET simule les DEUX endpoints, avec les mêmes
 *   formes de réponse. Il ne rejoue PAS la sécurité : les codes ne sont pas
 *   vérifiés, rien n'est signé. Il valide le RENDU et l'enchaînement des écrans,
 *   pas le verrou — celui-ci se juge sur le code PHP et le `php -l` de la CI.
 *
 * USAGE   node tests/mock_livrets.cjs [port]      (défaut 3100)
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');
const PORT = Number(process.argv[2] || process.env.PORT || 3100);

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.woff2': 'font/woff2',
};

// ── État en mémoire : remis à zéro à chaque démarrage ────────────────────────
const CODE_ELEVE = 'VRT-6E-TEST-0001';
const CODE_PROF  = 'VRT-6E-PROF-0001';

/* Retrait d'un code déjà payé (`action:"claim"`). Le banc rejoue le contrat
   EXACT d'api/livret.php, parce que c'est la distinction entre ses deux refus
   qui porte tout le diagnostic :
     404 « pending »  → aucun code pour cette référence ;
     403 « bad_tel »  → le code EXISTE, les 4 chiffres ne correspondent pas.
   Un bouchon plus indulgent que le serveur — qui rendrait le code sur la seule
   référence — validerait une reprise automatique que la production refuserait. */
const REF_BANC  = 'LV260901-BANCTEST';
const TEL4_BANC = '4321';
// Jours restants avant echeance, pour exercer le bandeau de renouvellement.
// Reglable par la variable d'environnement JOURS (defaut 12).
const JOURS_RESTANTS = Number(process.env.JOURS || 12);
const devoirs = new Map();
const classes = new Map();

function jeton(classe, kind, id) {
  // Même FORME que le vrai (corps.signature en base64url) pour que le client
  // sache y lire son `id` — mais signé avec rien du tout. Banc d'essai.
  const corps = Buffer.from(JSON.stringify({
    s: 'livret', c: classe, k: kind, id, lb: 'Banc', sid: 'x',
    exp: Math.floor(Date.now() / 1000) + 3600, fp: 'x',
  })).toString('base64url');
  return corps + '.banc';
}
function claims(token) {
  try { return JSON.parse(Buffer.from(String(token).split('.')[0], 'base64url').toString('utf8')); }
  catch (e) { return null; }
}
function lireDonnees(nom) {
  const p = path.join(RACINE, 'livrets', nom);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

function api(url, corps) {
  const a = corps.action || '';

  if (url.includes('livret.php')) {
    if (a === 'unlock') {
      const c = String(corps.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      const attendu = (corps.kind === 'guide' ? CODE_PROF : CODE_ELEVE).replace(/-/g, '');
      if (c !== attendu) return { s: 401, j: { ok: false, error: 'Code non reconnu. (banc : ' + (corps.kind === 'guide' ? CODE_PROF : CODE_ELEVE) + ')', code: 'bad_code' } };
      return { s: 200, j: { ok: true, token: jeton(corps.classe, corps.kind, corps.kind === 'guide' ? 'prof000banc' : 'eleve00banc'),
                            exp: Math.floor(Date.now() / 1000) + 3600, kind: corps.kind, classe: corps.classe, label: 'Banc',
                            // Echeance proche, pour exercer le bandeau de renouvellement.
                            joursRestants: JOURS_RESTANTS, expireLe: Math.floor(Date.now()/1000) + JOURS_RESTANTS*86400 } };
    }
    if (a === 'session') {
      const c = claims(corps.token);
      if (!c) return { s: 401, j: { ok: false, error: 'Session expirée.', code: 'auth' } };
      return { s: 200, j: { ok: true, exp: c.exp, kind: c.k, classe: c.c, label: c.lb,
                            joursRestants: JOURS_RESTANTS,
                            expireLe: Math.floor(Date.now()/1000) + JOURS_RESTANTS*86400 } };
    }
    if (a === 'ouvrage') {
      const f = ficheOuvrage(String(corps.o || ''));
      if (!f) return { s: 404, j: { ok: false, error: 'Ouvrage inconnu (banc).', code: 'unknown' } };
      return { s: 200, j: { ok: true, ouvrage: Object.assign({ slug: corps.o }, f) } };
    }
    if (a === 'content') {
      const c = claims(corps.token);
      if (!c) return { s: 401, j: { ok: false, error: 'Session expirée.', code: 'auth' } };
      // Le banc ne dispose que des EXTRAITS gratuits : c'est suffisant pour
      // exercer le rendu, et cela évite d'avoir le produit complet sur le disque.
      return { s: 200, j: { ok: true, classe: c.c, kind: c.k,
        wm: { id: c.id.toUpperCase(), lb: 'Banc', d: '17/08/2026', txt: 'VÉRITAS · BANC · 17/08/2026' },
        js: { booklet: lireDonnees('demo-6e-livret.js'), guide: lireDonnees('demo-6e-guide.js') } } };
    }
    if (a === 'claim') {
      const ref = String(corps.ref || '').trim().toUpperCase();
      const t4  = String(corps.tel || '').replace(/\D+/g, '').slice(-4);
      if (ref !== REF_BANC) {
        return { s: 404, j: { ok: false, code: 'pending',
          error: 'Aucun code disponible pour cette référence.' } };
      }
      if (t4 !== TEL4_BANC) {
        return { s: 403, j: { ok: false, code: 'bad_tel',
          error: 'Les 4 derniers chiffres du numéro payeur ne correspondent pas.' } };
      }
      return { s: 200, j: { ok: true, code: CODE_ELEVE, codes: null,
        classe: '6e', kind: 'livret',
        expire: Math.floor(Date.now() / 1000) + 365 * 86400 } };
    }
    return { s: 400, j: { ok: false, error: 'Action inconnue (banc).', code: 'action' } };
  }

  // ── collab.php ──
  const c = claims(corps.token);
  if (a === 'classe_creer') {
    const id = 'cl_' + Math.random().toString(16).slice(2, 12);
    classes.set(id, { id, prof: c && c.id, niveau: c ? c.c : '6e', nom: corps.nom, cree: Math.floor(Date.now() / 1000), eleves: {}, effectif: 0 });
    return { s: 200, j: { ok: true, classe: classes.get(id) } };
  }
  if (a === 'classe_lister') return { s: 200, j: { ok: true, classes: [...classes.values()], niveau: c ? c.c : '6e' } };

  if (a === 'devoir_creer') {
    const t = 'BANC' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const d = { token: t, prof: c && c.id, profNom: corps.profNom, classeId: corps.classeId,
                niveau: c ? c.c : '6e', titre: corps.titre, consigne: corps.consigne,
                items: (corps.items || []).map((it, i) => Object.assign({ n: i + 1 }, it)),
                du: corps.du || 0, cree: Math.floor(Date.now() / 1000), ouvert: true, soumissions: {}, vues: 0 };
    devoirs.set(t, d);
    return { s: 200, j: { ok: true, token: t, lien: 'http://localhost:' + PORT + '/d/?t=' + t, devoir: d } };
  }
  if (a === 'devoir_lister') {
    return { s: 200, j: { ok: true, devoirs: [...devoirs.values()].map((d) => ({
      token: d.token, titre: d.titre, classeId: d.classeId, niveau: d.niveau,
      items: d.items.length, cree: d.cree, du: d.du, ouvert: d.ouvert,
      copies: Object.keys(d.soumissions).length,
      corrigees: Object.values(d.soumissions).filter((s) => s.rendue).length,
      vues: d.vues, lien: 'http://localhost:' + PORT + '/d/?t=' + d.token })) } };
  }
  if (a === 'devoir_apercu') {
    const d = devoirs.get(String(corps.t || '').toUpperCase());
    if (!d) return { s: 404, j: { ok: false, error: 'Ce lien de devoir n\'existe pas (banc).', code: 'unknown' } };
    d.vues++;
    const items = d.items.map((it) => it.src === 'prof'
      ? { n: it.n, src: 'prof', consigne: it.consigne, type: it.type || 'court' }
      : { n: it.n, src: 'verrouille', repere: it.repere || 'Exercice du livret' });
    return { s: 200, j: { ok: true, apercu: { titre: d.titre, consigne: d.consigne, niveau: d.niveau,
      profNom: d.profNom, du: d.du, ouvert: d.ouvert, items, total: items.length,
      verrouilles: items.filter((i) => i.src === 'verrouille').length,
      rejoints: Object.keys(d.soumissions).length } } };
  }
  if (a === 'devoir_ouvrir') {
    const d = devoirs.get(String(corps.t || '').toUpperCase());
    if (!d) return { s: 404, j: { ok: false, error: 'Devoir introuvable (banc).', code: 'unknown' } };
    if (!c) return { s: 401, j: { ok: false, error: 'Session expirée.', code: 'auth' } };
    return { s: 200, j: { ok: true, devoir: d, macopie: d.soumissions[c.id] || null } };
  }
  if (a === 'soumettre') {
    const d = devoirs.get(String(corps.t || '').toUpperCase());
    if (!d || !c) return { s: 404, j: { ok: false, error: 'Devoir introuvable (banc).', code: 'unknown' } };
    d.soumissions[c.id] = Object.assign(d.soumissions[c.id] || {}, {
      nom: corps.nom, reponses: corps.reponses, envoye: Math.floor(Date.now() / 1000) });
    return { s: 200, j: { ok: true, envoye: d.soumissions[c.id].envoye } };
  }
  if (a === 'copies') {
    const d = devoirs.get(String(corps.t || '').toUpperCase());
    if (!d) return { s: 404, j: { ok: false, error: 'Devoir introuvable (banc).', code: 'unknown' } };
    return { s: 200, j: { ok: true, devoir: { token: d.token, titre: d.titre, items: d.items, niveau: d.niveau },
      copies: Object.entries(d.soumissions).map(([eid, s]) => Object.assign({ eleveId: eid }, s)) } };
  }
  if (a === 'apprecier') {
    const d = devoirs.get(String(corps.t || '').toUpperCase());
    if (!d || !d.soumissions[corps.eleveId]) return { s: 404, j: { ok: false, error: 'Copie introuvable (banc).', code: 'unknown' } };
    Object.assign(d.soumissions[corps.eleveId], { note: corps.note, sur: 20,
      appreciation: corps.appreciation, commentaires: corps.commentaires, rendue: true });
    return { s: 200, j: { ok: true } };
  }
  if (a === 'tableau_bord') {
    const ds = [...devoirs.values()];
    const copies = ds.reduce((n, d) => n + Object.keys(d.soumissions).length, 0);
    const corr = ds.reduce((n, d) => n + Object.values(d.soumissions).filter((s) => s.rendue).length, 0);
    return { s: 200, j: { ok: true, bilan: { devoirs: ds.length, copies, corrigees: corr,
      aCorriger: copies - corr, vues: ds.reduce((n, d) => n + d.vues, 0), classes: classes.size,
      parrainage: { invites: 0, convertis: 0 } },
      recents: ds.map((d) => ({ titre: d.titre, token: d.token, cree: d.cree,
        copies: Object.keys(d.soumissions).length, attendus: 0, completion: null })),
      aRelancer: [] } };
  }
  if (a === 'parrain_visite' || a === 'parrain_convertir') return { s: 200, j: { ok: true } };
  return { s: 400, j: { ok: false, error: 'Action inconnue (banc).', code: 'action' } };
}

const CHARGE = process.env.CHARGE
  || path.join(process.env.USERPROFILE || process.env.HOME || '', 'veritas-ftp');

/** Fiche d'un ouvrage en mode lecture, lue dans le catalogue reellement produit. */
function ficheOuvrage(slug) {
  try {
    const c = JSON.parse(fs.readFileSync(path.join(RACINE, 'api/data/livrets_catalogue.json'), 'utf8'));
    return (c.ouvrages || {})[slug] || null;
  } catch (e) { return null; }
}

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');

  // GET ?o=<slug>&p=<n> : une page-image. Le banc rejoue la REGLE (aperçu
  // gratuit puis code exige), pas la signature du jeton.
  if (u.pathname.startsWith('/api/livret.php') && u.searchParams.has('o') && u.searchParams.has('p')) {
    const slug = String(u.searchParams.get('o')).replace(/[^a-z0-9_-]/g, '');
    const n = parseInt(u.searchParams.get('p'), 10) || 0;
    const f = ficheOuvrage(slug);
    const libres = f ? (f.pagesLibres || 0) : 0;
    if (n > libres) {
      // Le banc ne verifie pas de SIGNATURE (il n'en produit pas de vraie), mais
      // il rejoue la REGLE : jeton present, lisible, et portant CET ouvrage.
      // Sans cela, un jeton bidon obtenait la page et le test disait « 200 » —
      // en laissant croire que la porte tenait.
      const c = claims(u.searchParams.get('token') || '');
      const bon = c && String(u.searchParams.get('token')).endsWith('.banc') && c.c === slug;
      if (!bon) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'Ressaisissez votre code.', code: 'auth' }));
        return;
      }
    }
    const img = path.join(CHARGE, 'uploads/protected/livrets', slug,
                          'p' + String(n).padStart(3, '0') + '.jpg');
    fs.readFile(img, (e, d) => {
      if (e) { res.writeHead(404, { 'Content-Type': 'application/json' });
               res.end(JSON.stringify({ ok: false, error: 'Page absente.', code: 'no_page' })); return; }
      res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store' });
      res.end(d);
    });
    return;
  }

  if (u.pathname.startsWith('/api/')) {
    let b = '';
    req.on('data', (d) => { b += d; });
    req.on('end', () => {
      let corps = {};
      try { corps = JSON.parse(b || '{}'); } catch (e) {}
      const r = api(u.pathname, corps);
      res.writeHead(r.s, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(r.j));
    });
    return;
  }
  let f = path.join(RACINE, decodeURIComponent(u.pathname));
  if (f.endsWith(path.sep) || u.pathname.endsWith('/')) f = path.join(f, 'index.html');
  if (!path.resolve(f).startsWith(RACINE)) { res.writeHead(403); res.end('403'); return; }
  fs.readFile(f, (e, data) => {
    if (e) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('404 ' + u.pathname); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream',
                         'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log('Banc livrets sur http://localhost:' + PORT);
  console.log('  code élève      : ' + CODE_ELEVE);
  console.log('  code enseignant : ' + CODE_PROF);
  console.log('  console prof    : http://localhost:' + PORT + '/livrets/prof.html');
  console.log('  ⚠️  Le banc NE rejoue PAS la sécurité : il valide le rendu, pas le verrou.');
});
