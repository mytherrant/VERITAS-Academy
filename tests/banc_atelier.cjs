/* Banc d'essai de l'ecran de chargement de l'Atelier de Francais.
 *
 * Sert plateforme/ tel quel et simule api/plateforme.php. Le mode se change a
 * chaud par /__mode?m=..., sans redemarrer ni recharger le serveur :
 *
 *   ok      index reel bati sur api/data/corpus_minesec.json (1040 textes)
 *   auth    401 tant qu'aucun jeton n'a ete emis, 200 ensuite  <-- PROD
 *   bloque  en-tetes + quelques Ko, puis PLUS RIEN (la panne signalee)
 *   vide    200 avec textes: []
 *   muet    la requete n'obtient jamais de reponse
 *
 * Le mode `auth` rejoue la sequence REELLE de la production : un visiteur non
 * authentifie recoit 401, l'ecran de connexion s'affiche, il se connecte, et
 * le repertoire doit alors descendre. C'est ce parcours-la qui restait bloque
 * sur « Chargement du repertoire… » le 21/08 ; aucun autre mode ne
 * l'exerce, puisque tous les autres repondent des la premiere requete.
 *
 * `/__journal` rend la liste horodatee des requetes vues : c'est ce qui
 * permet de trancher « la requete n'est jamais partie » sans supposer.
 *
 * SECOND COMMUTATEUR, independant du premier : `/__complet?c=...` regle le
 * sort de `?action=corpus&mode=complet&n=N`, la requete qui va chercher le
 * TEXTE INTEGRAL quand on ouvre une fiche ou qu'on ajoute un texte a une
 * epreuve. L'index et la completion sont deux transferts distincts : l'index
 * peut arriver parfaitement pendant que la completion echoue, et c'est
 * precisement la panne qui laissait une epreuve se composer sur des amorces
 * de 180 caracteres. Il faut donc pouvoir casser l'un sans casser l'autre.
 *
 *   ok    le texte integral, comme api/plateforme.php  <-- defaut
 *   ko    500 : le serveur repond, mais en erreur
 *   402   « Abonnement requis », la reponse du serveur pour un texte ferme
 *   muet  aucune reponse : la requete reste en vol
 *   vide  200 mais sans le texte attendu (reponse de forme inattendue)
 *
 * Il valide le RENDU des ecrans, pas la securite : aucun droit n'est verifie.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

/* path.resolve : un chemin donne avec des barres obliques ne se compare
   sinon plus a ce que path.join produit sous Windows, et TOUT le statique
   repartait en 403. */
const RACINE = path.resolve(process.argv[3] || process.cwd());
const PORT = Number(process.argv[2] || process.env.PORT || 3200);
let MODE = 'ok';
let COMPLET = 'ok';             // sort de mode=complet, regle par /__complet
let JETON = '';                 // jeton emis par ?action=session
const JOURNAL = [];             // horodatage de chaque requete d'API vue
const T0 = Date.now();
const noter = (quoi) => { JOURNAL.push({ t: Date.now() - T0, quoi: quoi });
  console.log('[banc] +' + (Date.now() - T0) + 'ms ' + quoi); };

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

/* La source integrale, lue une fois : `mode=complet` doit rendre le VRAI
   texte, pas une invention du banc, sinon on validerait un affichage contre
   des donnees qui n'existent nulle part. */
let SOURCE = null;
function source() {
  if (!SOURCE) SOURCE = JSON.parse(fs.readFileSync(
    path.join(RACINE, 'api/data/corpus_minesec.json'), 'utf8'));
  return SOURCE;
}

/* Decalage des fiches libres, identique a VRT_LIBRE_OFFSET cote serveur :
   les deux repertoires numerotent a partir de 1, et `n` est la cle du
   client partout. */
const LIBRE_OFFSET = 10000;

let INDEX = null;
function indexCorpus() {
  if (INDEX) return INDEX;
  const items = JSON.parse(fs.readFileSync(path.join(RACINE, 'api/data/corpus_minesec.json'), 'utf8'));
  /* REPERTOIRE PROTEGE : l'index ne porte qu'une amorce de 180 caracteres,
     le texte integral se demande ensuite. */
  const textes = items.map(t => ({
    n: t.n | 0, src: 'minesec',
    type: t.type || '', words: t.words | 0, level: t.level || '',
    cycle: t.cycle || '', group: t.group || '', groupKind: t.groupKind || '',
    subkind: t.subkind || '', usage: t.usage || '', author: t.author || '',
    title: t.title || '', reference: t.reference || '', faits: t.faits || '',
    libre: true, extrait: String(t.text || '').slice(0, 180)
  }));
  /* REPERTOIRE LIBRE DE DROITS : domaine public, servi EN ENTIER. Le
     fichier peut manquer sur un poste qui ne l'a pas encore genere -- le
     banc continue alors avec le seul repertoire protege, comme le serveur. */
  let nLibres = 0;
  const fLibre = path.join(RACINE, 'api/data/corpus_libre.json');
  if (fs.existsSync(fLibre)) {
    JSON.parse(fs.readFileSync(fLibre, 'utf8')).forEach(t => {
      textes.push({
        n: LIBRE_OFFSET + (t.n | 0), src: 'libre',
        type: t.type || '', words: t.words | 0, level: t.level || '',
        cycle: t.cycle || '', group: t.group || '', groupKind: t.groupKind || '',
        subkind: t.subkind || '', usage: t.usage || '', author: t.author || '',
        title: t.title || '', reference: t.reference || '', faits: t.faits || '',
        libre: true, extrait: String(t.text || '')
      });
      nLibres++;
    });
  }
  INDEX = JSON.stringify({
    ok: true, total: textes.length, libres: 20 + nLibres, libresDroit: nLibres,
    palier: 'ens',
    plafonds: { textes: -1, citations: -1, exports: 30, ia: 30 },
    droit: { ok: true, motif: 'abonnement' },
    textes: textes
  });
  return INDEX;
}

const serveur = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');

  if (u.pathname === '/__mode') {
    MODE = u.searchParams.get('m') || 'ok';
    if (u.searchParams.get('raz')) JETON = '';
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('mode=' + MODE + (JETON ? ' (jeton emis)' : ' (sans jeton)'));
  }
  if (u.pathname === '/__complet') {
    COMPLET = u.searchParams.get('c') || 'ok';
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('complet=' + COMPLET);
  }
  if (u.pathname === '/__journal') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ mode: MODE, complet: COMPLET,
      jeton: !!JETON, journal: JOURNAL }));
  }

  if (u.pathname.indexOf('/api/') === 0) {
    const action = u.searchParams.get('action') || '';
    res.setHeader('Access-Control-Allow-Origin', '*');

    /* Connexion : on emet un jeton, comme le fait api/plateforme.php. */
    if (u.pathname.indexOf('plateforme.php') >= 0 && action === 'session') {
      noter('session (connexion)');
      JETON = 'BANC-' + Date.now().toString(36);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, token: JETON,
        compte: { nom: 'Enseignant du banc', role: 'ens' },
        droit: { ok: true, motif: 'abonnement' } }));
    }

    if (u.pathname.indexOf('plateforme.php') >= 0 && action === 'corpus') {
      const porte = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
      if (MODE === 'auth' && (!JETON || porte !== JETON)) {
        noter('corpus -> 401 (pas de jeton valide)');
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ ok: false, error: 'Authentification requise' }));
      }
      /* TEXTE INTEGRAL. Branche AVANT les modes de l'index : les deux
         transferts sont independants, et c'est tout l'interet du banc de
         pouvoir casser la completion pendant que l'index arrive bien. */
      if ((u.searchParams.get('mode') || 'index') === 'complet') {
        const n = Number(u.searchParams.get('n') || 0);
        if (COMPLET === 'muet') { noter('complet n=' + n + ' -> MUET'); return; }
        if (COMPLET === 'ko') {
          noter('complet n=' + n + ' -> 500');
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ ok: false, error: 'Panne serveur' }));
        }
        if (COMPLET === '402') {
          noter('complet n=' + n + ' -> 402');
          res.writeHead(402, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ ok: false, error: 'Abonnement requis',
            motif: 'palier', palier: 'demo',
            message: 'Ce texte fait partie du répertoire complet.' }));
        }
        if (COMPLET === 'vide') {
          /* 200, mais pas la forme attendue : c'est le cas qui passait sans
             bruit et laissait l'appelant attendre un rappel qui ne venait
             jamais. */
          noter('complet n=' + n + ' -> 200 sans texte');
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ ok: true }));
        }
        /* Fiche libre : servie en entier, sans condition — c'est tout
           l'interet du domaine public. */
        if (n >= LIBRE_OFFSET) {
          const fl = path.join(RACINE, 'api/data/corpus_libre.json');
          const lib = fs.existsSync(fl) ? JSON.parse(fs.readFileSync(fl, 'utf8')) : [];
          const tl = lib.find(x => (x.n | 0) === n - LIBRE_OFFSET);
          if (!tl) { noter('complet libre n=' + n + ' -> 404');
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            return res.end(JSON.stringify({ ok: false, error: 'Introuvable' })); }
          noter('complet libre n=' + n + ' -> OK');
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ ok: true,
            texte: Object.assign({}, tl, { n: n, src: 'libre', libre: true }),
            droit: { ok: true, motif: 'domaine public' }, palier: 'ens' }));
        }
        const t = source().find(x => (x.n | 0) === n);
        if (!t) {
          noter('complet n=' + n + ' -> 404');
          res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ ok: false, error: 'Introuvable' }));
        }
        noter('complet n=' + n + ' -> OK (' + String(t.text || '').length + ' car.)');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ ok: true, texte: t,
          droit: { ok: true, motif: 'abonnement' }, palier: 'ens' }));
      }
      if (MODE === 'muet') { noter('corpus -> MUET'); return; }
      if (MODE === 'vide') {
        noter('corpus -> VIDE');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ ok: true, total: 0, libres: 0, palier: 'ens', textes: [] }));
      }
      if (MODE === 'bloque') {
        noter('corpus -> BLOQUE (en-tetes + 40 Ko puis silence)');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8',
          'Transfer-Encoding': 'chunked' });
        res.write(indexCorpus().slice(0, 40000));
        return; // ni fin, ni erreur : la connexion reste ouverte
      }
      noter('corpus -> OK');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(indexCorpus());
    }
    noter('api ' + (action || u.pathname));
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ ok: true, configured: false, essai: { jours: 7, cadeau: 0 },
      service: 'banc', message: 'banc d’essai local' }));
  }

  let p = decodeURIComponent(u.pathname);
  if (p === '/' || p === '/plateforme' || p === '/plateforme/') p = '/plateforme/index.html';
  const f = path.join(RACINE, p.replace(/^\/+/, ''));
  if (!f.startsWith(RACINE)) { res.writeHead(403); return res.end('non'); }
  fs.readFile(f, (e, buf) => {
    if (e) { res.writeHead(404); return res.end('introuvable : ' + p); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream',
      'Cache-Control': 'no-store' });
    res.end(buf);
  });
});

serveur.listen(PORT, () => console.log('[banc] http://localhost:' + PORT + '/plateforme/  (mode=' + MODE + ')'));
