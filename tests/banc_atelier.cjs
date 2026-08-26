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
let QUOTA = 'ok';          // ok | plein | panne
let PALIER = 'abo';        // abo (tout ouvert) | demo (5 textes offerts)
const JETON_PAY = 'BANC-PUBLIC-INIT';   // miroir de CAMERPAY_PUBLIC_INIT
let PAYSTATUT = 'pending';             // pending | success | failed
let DERNIER_INIT = null;               // dernier corps recu par ?action=init
const COMPTEURS = {};      // genre -> nombre consomme
const PORT = Number(process.argv[2] || process.env.PORT || 3200);
let MODE = 'ok';
const ETATS = {};               // etat partage par groupe (action=etat)
const GROUPES = {};             // fiche de groupe, ecrite au meme appel
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
  /* PALIER DEMO — miroir de plat_offerts() (api/plateforme.php).
     Le banc marquait TOUT `libre: true` : il ne pouvait donc jamais montrer le
     cadenas ni le mur d'abonnement, c'est-a-dire precisement ce qui se vend.
     Le vrai serveur n'offre que N textes, choisis d'un PAS REGULIER pour que
     l'echantillon tombe dans tous les cycles — prendre les N premiers donnerait
     N textes du seul Module 1, et le visiteur en conclurait que la base ne
     couvre que la 6e. On reproduit ce choix, pas une approximation. */
  if (PALIER === 'demo') {
    const combien = 5, total = textes.length;
    const offerts = new Set();
    if (total > combien) {
      const pas = total / combien;
      for (let k = 0; k < combien; k++) {
        offerts.add(textes[Math.min(total - 1, Math.floor(k * pas))].n);
      }
    } else {
      textes.forEach(t => offerts.add(t.n));
    }
    textes.forEach(t => {
      t.libre = offerts.has(t.n);
      if (!t.libre) t.faits = '';   // le serveur vide aussi ce champ
    });
  }
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
  if (u.pathname === '/__palier') {
    PALIER = u.searchParams.get('p') || 'abo';
    INDEX = null;                       // l'index est mis en cache : le refaire
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('palier=' + PALIER);
  }
  if (u.pathname === '/__pay') {
    PAYSTATUT = u.searchParams.get('s') || 'pending';
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ statut: PAYSTATUT, dernierInit: DERNIER_INIT }));
  }
  if (u.pathname === '/__quota') {
    QUOTA = u.searchParams.get('m') || 'ok';
    if (u.searchParams.get('raz')) { for (const k in COMPTEURS) delete COMPTEURS[k]; }
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('quota=' + QUOTA + ' compteurs=' + JSON.stringify(COMPTEURS));
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
        /* `id` EST dans la reponse du vrai serveur (api/plateforme.php:483) et
           le front s'en sert comme `accountId` au paiement : l'omettre ici
           ferait passer au banc un parcours qui echoue en production. */
        compte: { id: 'acc_banc_001', nom: 'Enseignant du banc', role: 'ens' },
        droit: { ok: true, motif: 'abonnement' } }));
    }

    /* CAMERPAY — miroir du CONTRAT de api/payment_camerpay.php.
       Ce n'est pas la passerelle qu'on simule (aucun argent ne circule ici),
       c'est la POIGNEE DE MAIN : le jeton public exige par camerpayInitGuard,
       et les noms de champs lus par ?action=init. Ce banc applique les memes
       refus, dans le meme ordre — 401 sans Bearer, 400 sans `ref`. C'est
       precisement ce qui manquait : le contrat du front avait diverge de celui
       du serveur sans que rien ne le signale, et le paiement etait impossible.
       Un banc qui accepterait n'importe quel corps ne prouverait rien. */
    if (u.pathname.indexOf('payment_camerpay.php') >= 0 && action === 'config') {
      noter('camerpay config');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: true, provider: 'camerpay',
        configured: true, canCollect: true, selfService: true, mode: 'sandbox',
        sandbox: true, publicInitToken: JETON_PAY, flow: 'redirect',
        reason: 'CamerPay est en mode TEST (sandbox) : aucun argent réel ne circule.' }));
    }
    if (u.pathname.indexOf('payment_camerpay.php') >= 0 && action === 'init') {
      const porte = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
      if (porte !== JETON_PAY) {
        noter('camerpay init -> 401 (Bearer absent ou faux)');
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'Authentification requise pour initier un paiement' }));
      }
      let corps = '';
      req.on('data', c => { corps += c; });
      return req.on('end', () => {
        let b = {};
        try { b = JSON.parse(corps || '{}'); } catch (e) {}
        DERNIER_INIT = b;
        const montant = parseInt(b.montant || 0, 10);
        const ref = String(b.ref || '').trim();
        if (montant <= 0 || !ref) {
          noter('camerpay init -> 400 (montant/ref manquants : contrat non respecte)');
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ error: 'montant et ref requis' }));
        }
        noter('camerpay init -> 201 ref=' + ref + ' montant=' + montant
          + ' cible=' + (b.targetId || '?') + ' compte=' + (b.accountId || 'AUCUN'));
        res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, ref: ref,
          transaction_uuid: 'BANC-' + ref,
          pay_url: 'http://localhost:' + PORT + '/__payer?ref=' + encodeURIComponent(ref),
          status: 'pending', sandbox: true }));
      });
    }
    if (u.pathname.indexOf('payment_camerpay.php') >= 0 && action === 'status') {
      const ref = u.searchParams.get('ref') || '';
      noter('camerpay status ref=' + ref + ' -> ' + PAYSTATUT);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ref: ref, status: PAYSTATUT, sandbox: true,
        intent: 'subscription' }));
    }

    /* QUOTA — miroir de api/plateforme.php?action=quota. Sert a eprouver les
       deux chemins que le front doit savoir traiter : l'accord (200) et le
       refus (402). Le compteur est en memoire du banc, remis a zero au
       redemarrage : on valide le PARCOURS, pas la comptabilite.
       Commutable a chaud : /__quota?m=ok|plein|panne */
    if (u.pathname.indexOf('plateforme.php') >= 0 && action === 'quota') {
      const porte = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
      if (!JETON || porte !== JETON) {
        noter('quota -> 401 (pas de jeton)');
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ ok: false, error: 'Authentification requise' }));
      }
      if (QUOTA === 'panne') { noter('quota -> MUET (panne simulee)'); return; }
      let corps = '';
      req.on('data', c => { corps += c; });
      return req.on('end', () => {
        let genre = 'epreuve';
        try { genre = (JSON.parse(corps || '{}').genre) || 'epreuve'; } catch (e) {}
        const plafond = (QUOTA === 'plein') ? 0 : 30;
        COMPTEURS[genre] = (COMPTEURS[genre] || 0);
        if (plafond >= 0 && COMPTEURS[genre] >= plafond) {
          noter('quota ' + genre + ' -> 402 (epuise)');
          res.writeHead(402, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ ok: false, error: 'Quota épuisé',
            accorde: false, utilise: COMPTEURS[genre], plafond: plafond }));
        }
        COMPTEURS[genre]++;
        noter('quota ' + genre + ' -> 200 (' + COMPTEURS[genre] + '/' + plafond + ')');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: true, accorde: true,
          utilise: COMPTEURS[genre], plafond: plafond }));
      });
    }

    /* ETAT DU GROUPE — le partage entre collegues.
       Garde en memoire, revision incrementale, comme le vrai serveur. */
    if (u.pathname.indexOf('plateforme.php') >= 0 && action === 'etat') {
      const gid = u.searchParams.get('groupe') || '';
      if (req.method === 'GET') {
        noter('etat GET ' + gid);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ ok: true,
          etat: ETATS[gid] || null, groupe: GROUPES[gid] || null }));
      }
      let corps = '';
      req.on('data', c => { corps += c; });
      req.on('end', () => {
        noter('etat POST ' + gid);
        let j = {};
        try { j = JSON.parse(corps || '{}'); } catch (e) {}
        const rev = ((ETATS[gid] && ETATS[gid].revision) || 0) + 1;
        ETATS[gid] = { contenu: j.etat || {}, majPar: 'banc', majLe: Date.now(), revision: rev };
        if (j.groupe && j.groupe.id) GROUPES[j.groupe.id] = j.groupe;
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: true, revision: rev }));
      });
      return;
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
        /* ⚠️ LE MUR D'ABONNEMENT, applique AUSSI au texte integral.
           Le banc ne l'appliquait qu'a l'index : il servait donc en 200 le
           contenu d'un texte que le vrai serveur refuse en 402. Un banc qui
           livre la marchandise ne peut pas prouver qu'elle est protegee — il
           aurait valide un mur qui n'existe pas. Miroir de api/plateforme.php :
           un numero hors des offerts, dans le repertoire MINESEC, repond 402
           SANS le texte. Le repertoire libre de droits n'est pas concerne (voir
           juste en dessous) : ses auteurs sont morts depuis assez longtemps. */
        if (PALIER === 'demo' && n < LIBRE_OFFSET) {
          /* indexCorpus() rend une CHAINE JSON deja serialisee (elle est mise
             en cache telle quelle) : il faut la relire pour retrouver les
             fiches. */
          const offerts = JSON.parse(indexCorpus()).textes
            .filter(t => t.src === 'minesec' && t.libre).map(t => t.n);
          if (offerts.indexOf(n) < 0) {
            noter('complet n=' + n + ' -> 402 (hors palier demo)');
            res.writeHead(402, { 'Content-Type': 'application/json; charset=utf-8' });
            return res.end(JSON.stringify({ ok: false, error: 'Abonnement requis',
              motif: 'palier', palier: 'demo',
              message: 'Ce texte fait partie du répertoire complet. Abonnez-vous pour ouvrir les 1040 textes, leurs questions et leurs faits de langue.' }));
          }
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
