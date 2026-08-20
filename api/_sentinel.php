<?php
// ════════════════════════════════════════════════════════════════════
// VÉRITAS — Sentinelle (v2.0) : anti-robots, anti-abus, anti-moisson
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
//
// POURQUOI CE FICHIER EXISTE
// Les défenses de VÉRITAS étaient DÉCLARATIVES : robots.txt, ai.txt, les
// en-têtes X-Robots-Tag et la liste d'agents interdits du .htaccess arrêtent
// les robots POLIS — ceux qui lisent les panneaux. Un script qui annonce
// « User-Agent: Mozilla/5.0 … Chrome » les traverse toutes sans ralentir.
//
// Et le filet censé le rattraper (vrt_rate_exceeded) comptait par une IP
// lue dans X-Forwarded-For, en-tête que le client écrit lui-même puisque
// aucun proxy de confiance n'est devant le site. Un robot changeant cet
// en-tête à chaque requête obtenait un compteur neuf à chaque requête.
//
// CE QUE FAIT CETTE COUCHE
//   1. Une IP qu'on ne peut pas falsifier (REMOTE_ADDR, sauf proxy déclaré).
//   2. Un score de suspicion bâti sur ce qu'un vrai navigateur envoie
//      TOUJOURS et qu'un script oublie presque toujours.
//   3. Des compteurs glissants réellement atomiques (flock).
//   4. Une décision graduée : passer → DÉFIER → bloquer.
//
// LE CHOIX CENTRAL : DÉFIER, PAS BANNIR
// Au Cameroun, une salle de classe entière sort par une seule IP (NAT
// opérateur). Bannir l'IP au 20e appel, c'est fermer le site à trente
// élèves parce qu'un seul a rafraîchi trop vite. La sentinelle demande
// donc un LAISSEZ-PASSER : invisible pour un humain (quelques centaines de
// millisecondes de calcul), ruineux pour qui veut moissonner 4 000 pages.
//
// ET SURTOUT : JAMAIS DE DÉFI PAR DÉFAUT
// Un mur d'entrée sur tout le site coûterait plus qu'il ne protège :
// les 64 pages statiques vivent du référencement, et Googlebot mis au défi
// est Googlebot qui désindexe. Le défi ne se déclenche QUE sur un
// comportement mesuré, jamais à l'arrivée.
// ════════════════════════════════════════════════════════════════════

if (defined('VRT_SENTINEL_LOADED')) { return; }
define('VRT_SENTINEL_LOADED', true);

// Où vivent compteurs, clé et journal. Surchargeable (constante posée AVANT
// l'inclusion) pour que les tests s'exécutent dans un bac à sable au lieu
// d'écrire dans les données de production.
function vrt_sentinel_dir(): string {
    return defined('VRT_SENTINEL_DIR') ? rtrim(VRT_SENTINEL_DIR, '/\\') : __DIR__ . '/data';
}

// ─────────────────────────────────────────────────────────────────────
// 1. L'IP RÉELLE
// ─────────────────────────────────────────────────────────────────────
// REMOTE_ADDR est posée par le serveur d'après la socket TCP : le client
// ne peut pas mentir dessus. Les en-têtes X-Forwarded-For / CF-Connecting-IP
// ne valent QUE si un proxy de confiance est réellement devant nous — sinon
// ils ne sont qu'un champ de saisie offert à l'attaquant.
//
// Pour activer un proxy de confiance (Cloudflare un jour), déclarer dans
// api/payment_config.php :  define('VRT_TRUSTED_PROXIES', ['1.2.3.4']);
// ─────────────────────────────────────────────────────────────────────
function vrt_real_ip(): string {
    $remote = (string) ($_SERVER['REMOTE_ADDR'] ?? '');

    $trusted = defined('VRT_TRUSTED_PROXIES') ? (array) VRT_TRUSTED_PROXIES : [];
    if ($trusted !== [] && in_array($remote, $trusted, true)) {
        // Un proxy déclaré nous parle : sa version de l'IP client fait foi.
        $fwd   = (string) ($_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '');
        $first = trim(explode(',', $fwd)[0]);
        if (filter_var($first, FILTER_VALIDATE_IP)) { return $first; }
    }

    return filter_var($remote, FILTER_VALIDATE_IP) ? $remote : '0.0.0.0';
}

// Regroupe une IP avec ses voisines immédiates (/24 en IPv4, /64 en IPv6).
// Un moissonneur qui tourne sur un bloc d'adresses loué change d'IP à chaque
// requête mais reste dans son bloc : compter par bloc le rattrape, alors que
// compter par IP le laisse passer indéfiniment.
function vrt_ip_block(?string $ip = null): string {
    $ip = $ip ?? vrt_real_ip();
    if (strpos($ip, ':') !== false) {                  // IPv6 → /64
        $parts = explode(':', $ip);
        return implode(':', array_slice($parts, 0, 4)) . '::/64';
    }
    $parts = explode('.', $ip);                        // IPv4 → /24
    if (count($parts) === 4) { return $parts[0] . '.' . $parts[1] . '.' . $parts[2] . '.0/24'; }
    return $ip;
}

// ─────────────────────────────────────────────────────────────────────
// 2. LA CLÉ DE SIGNATURE DU BOUCLIER
// ─────────────────────────────────────────────────────────────────────
// Auto-provisionnée : aucune configuration à faire. Elle vit dans api/data/
// (dossier interdit d'accès HTTP par .htaccess) sous forme de fichier PHP —
// ainsi, même si le verrou du dossier sautait un jour, le serveur exécuterait
// le fichier au lieu d'en afficher le contenu.
//
// On NE dérive PAS d'API_SECRET : config_sync.php en fabrique une valeur
// aléatoire à chaque requête quand payment_config.php manque, ce qui
// invaliderait tous les laissez-passer en permanence.
// ─────────────────────────────────────────────────────────────────────
function vrt_shield_key(): string {
    static $key = null;
    if ($key !== null) { return $key; }

    $dir  = vrt_sentinel_dir();
    $file = $dir . '/_shield_key.php';

    if (is_file($file)) {
        $k = @include $file;
        if (is_string($k) && strlen($k) === 64) { return $key = $k; }
    }

    if (!is_dir($dir)) { @mkdir($dir, 0750, true); }
    $k = bin2hex(random_bytes(32));

    // Écriture atomique : un fichier à moitié écrit, lu par une requête
    // concurrente, donnerait une clé tronquée et invaliderait les jetons.
    $tmp = $file . '.' . getmypid() . '.tmp';
    if (@file_put_contents($tmp, "<?php return '" . $k . "';\n", LOCK_EX) !== false) {
        @chmod($tmp, 0600);
        if (!@rename($tmp, $file)) { @unlink($tmp); }
    }

    // Si l'écriture échoue (disque plein, droits), on garde la clé en mémoire
    // pour cette requête : le bouclier reste cohérent le temps de l'appel.
    return $key = $k;
}

// ─────────────────────────────────────────────────────────────────────
// 3. LE SCORE DE SUSPICION
// ─────────────────────────────────────────────────────────────────────
// Chaque signal vaut ce qu'il coûte à contourner. Un User-Agent se change en
// un mot ; la cohérence complète d'en-têtes d'un vrai navigateur est plus
// laborieuse à imiter. On ne cherche pas la certitude — on cherche à rendre
// la moisson assez pénible pour qu'elle aille voir ailleurs.
//
// Retourne 0 (humain plausible) à 100+ (robot manifeste).
// ─────────────────────────────────────────────────────────────────────
function vrt_bot_score(): int {
    $ua    = (string) ($_SERVER['HTTP_USER_AGENT'] ?? '');
    $score = 0;

    // ── Agent absent ou dérisoire : aucun navigateur ne fait ça ──
    if ($ua === '')            { $score += 45; }
    elseif (strlen($ua) < 20)  { $score += 35; }

    // ── Signatures d'outils qui s'annoncent (les honnêtes) ──
    $outils = 'curl|wget|python-requests|python-urllib|scrapy|httpx|aiohttp|go-http-client|'
            . 'java/|libwww|lwp::|okhttp|axios|node-fetch|guzzle|httpclient|restsharp|'
            . 'postman|insomnia|apache-httpclient|mechanize|urllib|winhttp|zgrab|masscan';
    if (preg_match('~(' . $outils . ')~i', $ua)) { $score += 50; }

    // ── Navigateurs pilotés par automate ──
    $automates = 'headlesschrome|phantomjs|puppeteer|playwright|selenium|webdriver|'
               . 'cypress|nightmare|splash|htmlunit';
    if (preg_match('~(' . $automates . ')~i', $ua)) { $score += 55; }

    // ── Ce qu'un vrai navigateur envoie TOUJOURS ──
    // Accept-Language est le plus révélateur : aucun navigateur ne l'omet,
    // et la plupart des scripts n'y pensent pas.
    if (empty($_SERVER['HTTP_ACCEPT']))          { $score += 25; }
    if (empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])) { $score += 25; }
    if (empty($_SERVER['HTTP_ACCEPT_ENCODING'])) { $score += 15; }

    // ── Incohérence : se dire Chrome sans en avoir les en-têtes ──
    // Chrome >= 76 envoie Sec-Fetch-* sur chaque requête. Un script qui copie
    // la chaîne User-Agent de Chrome sans copier le reste se trahit ici.
    $ditChrome = preg_match('~Chrome/(\d+)~i', $ua, $m) && (int) $m[1] >= 76;
    if ($ditChrome && empty($_SERVER['HTTP_SEC_FETCH_MODE']) && empty($_SERVER['HTTP_SEC_FETCH_SITE'])) {
        $score += 30;
    }

    // ── Protocole d'un autre âge ──
    if ((string) ($_SERVER['SERVER_PROTOCOL'] ?? '') === 'HTTP/1.0') { $score += 20; }

    // ── En-têtes de proxy posés alors qu'aucun proxy n'est déclaré ──
    // Signal fort : personne n'écrit X-Forwarded-For « par accident ».
    $proxyDeclare = defined('VRT_TRUSTED_PROXIES') && VRT_TRUSTED_PROXIES !== [];
    if (!$proxyDeclare && (!empty($_SERVER['HTTP_X_FORWARDED_FOR']) || !empty($_SERVER['HTTP_CF_CONNECTING_IP']))) {
        $score += 30;
    }

    return $score;
}

// ─────────────────────────────────────────────────────────────────────
// 4. LES MOTEURS DE RECHERCHE LÉGITIMES
// ─────────────────────────────────────────────────────────────────────
// Le référencement fait vivre les 64 pages statiques. Un défi servi à
// Googlebot est une page qui sort de l'index. On l'exempte donc — mais
// UNIQUEMENT en lecture publique : un moissonneur qui usurpe « Googlebot »
// n'obtient ainsi que ce que robots.txt lui accordait déjà, et se heurte
// au bouclier dès qu'il touche à l'IA, aux téléchargements ou aux écritures.
// ─────────────────────────────────────────────────────────────────────
function vrt_is_search_engine(): bool {
    $ua = (string) ($_SERVER['HTTP_USER_AGENT'] ?? '');
    // ⚠️ Les exclusions comptent : « Bingbot-AI » CONTIENT « Bingbot », et
    // « Applebot-Extended » contient « Applebot ». Sans ces gardes, les deux
    // moissonneurs d'entraînement entreraient par la porte réservée au
    // référencement — celle qui exempte de tout contrôle.
    return (bool) preg_match(
        '~(Googlebot(?!-Extended)|Bingbot(?!-AI)|DuckDuckBot|Slurp|YandexBot|Applebot(?!-Extended))~i',
        $ua
    );
}

// ─────────────────────────────────────────────────────────────────────
// 4bis. LES MOISSONNEUSES D'IA  ← répond directement à « protection contre les IA »
// ─────────────────────────────────────────────────────────────────────
// robots.txt interdisait DÉJÀ tous les agents listés ci-dessous. Mais
// robots.txt est un panneau de courtoisie : il n'a aucun effet sur qui
// choisit de ne pas le lire, et rien côté serveur ne l'appliquait. Un
// moissonneur qui ignorait le panneau repartait avec les 4 000 corrigés,
// les 56 pages d'analyses littéraires et les manuels — c'est-à-dire des
// années de travail, absorbées dans un modèle sans une ligne de crédit.
//
// Ici on applique. Trois listes, séparées à dessein : elles ne relèvent pas
// de la même décision.
// ─────────────────────────────────────────────────────────────────────

// (a) ENTRAÎNEMENT DE MODÈLES — aucune contrepartie pour VÉRITAS.
//     C'est le cœur de la demande : blocage sec, sans discussion.
const VRT_IA_ENTRAINEMENT =
    'GPTBot|ClaudeBot|Claude-Web|anthropic-ai|CCBot|Bytespider|Amazonbot|'
  . 'Meta-ExternalAgent|FacebookBot|PerplexityBot|YouBot|Diffbot|Omgilibot|Omgili|'
  . 'ImagesiftBot|cohere-ai|cohere-training-data-crawler|Applebot-Extended|'
  . 'Google-Extended|GoogleOther|Bingbot-AI|msnbot-AI|Timpibot|Webzio';

// (b) IA « À LA DEMANDE » — une PERSONNE RÉELLE a demandé à son assistant
//     d'ouvrir une page de VÉRITAS. Ce n'est pas de la moisson.
//     ⚠️ DÉCISION COMMERCIALE, PAS TECHNIQUE. Bloquer, c'est disparaître des
//     réponses de ChatGPT et de Perplexity — un canal par lequel des parents
//     cherchent aujourd'hui « corrigés programme camerounais ». Le robots.txt
//     actuel les interdit déjà : on reste donc cohérent avec ce qui est
//     annoncé. Pour les accueillir à nouveau, vider cette liste (chaîne vide)
//     — un seul geste, aucun autre changement nécessaire.
const VRT_IA_A_LA_DEMANDE =
    'ChatGPT-User|OAI-SearchBot|Claude-User|MistralAI-User|Perplexity-User';

// (c) ASPIRATEURS SEO COMMERCIAUX — ils revendent l'analyse de votre site et
//     consomment la bande passante du mutualisé sans rien apporter.
const VRT_ASPIRATEURS_SEO =
    'AhrefsBot|SemrushBot|MJ12bot|DotBot|BLEXBot|DataForSeoBot|SerpstatBot|'
  . 'PetalBot|ZoominfoBot|Barkrowler|SeekportBot';

/**
 * @return string '' si l'agent n'est pas concerné, sinon la catégorie
 *                ('entrainement', 'a_la_demande', 'seo') — journalisée pour
 *                que Jacques voie QUI vient, et non un simple compteur.
 */
function vrt_ia_categorie(): string {
    $ua = (string) ($_SERVER['HTTP_USER_AGENT'] ?? '');
    if ($ua === '') { return ''; }
    if (preg_match('~(' . VRT_IA_ENTRAINEMENT . ')~i', $ua))  { return 'entrainement'; }
    if (VRT_IA_A_LA_DEMANDE !== ''
        && preg_match('~(' . VRT_IA_A_LA_DEMANDE . ')~i', $ua)) { return 'a_la_demande'; }
    if (preg_match('~(' . VRT_ASPIRATEURS_SEO . ')~i', $ua))  { return 'seo'; }
    return '';
}

// ─────────────────────────────────────────────────────────────────────
// 5. LES COMPTEURS GLISSANTS
// ─────────────────────────────────────────────────────────────────────
// Le compteur historique (vrt_rate_exceeded) lisait puis écrivait sans
// verrou : deux requêtes simultanées lisaient le même état et la seconde
// écrasait la première — le compteur sous-comptait précisément sous la
// charge d'une attaque. Ici tout se passe sous flock exclusif.
//
// Retourne le nombre d'appels sur la fenêtre, CET appel compris.
// ─────────────────────────────────────────────────────────────────────
function vrt_sentinel_hits(string $bucket, int $window): int {
    $dir = vrt_sentinel_dir() . '/_sentinel';
    if (!is_dir($dir)) { @mkdir($dir, 0750, true); }

    $f = $dir . '/' . substr(hash('sha256', $bucket), 0, 24) . '.txt';

    $fh = @fopen($f, 'c+');
    if ($fh === false) { return 0; }   // disque en peine → on laisse passer (voir §7)

    $n = 0;
    if (flock($fh, LOCK_EX)) {
        $now = time();

        // On compte PAR SECONDE (« seconde:nombre »), pas un horodatage par
        // requête. Première version : une ligne par appel, plafonnée à 400
        // entrées pour que le fichier n'enfle pas — sauf que le plafond
        // écrêtait AUSSI le compte, bloqué à 401. Tout seuil au-dessus de 400
        // devenait inatteignable : le filet de bloc ne se serait jamais
        // déclenché en production, et rien ne l'aurait signalé.
        // Ici le fichier ne dépasse jamais $window entrées quelle que soit
        // l'intensité de l'attaque, et le compte reste exact.
        $seaux = [];
        foreach (explode(',', (string) stream_get_contents($fh)) as $paire) {
            if ($paire === '' || strpos($paire, ':') === false) { continue; }
            [$t, $c] = explode(':', $paire, 2);
            $t = (int) $t;
            if ($t > 0 && ($now - $t) < $window) { $seaux[$t] = (int) $c; }
        }
        $seaux[$now] = ($seaux[$now] ?? 0) + 1;
        $n = array_sum($seaux);

        $plat = [];
        foreach ($seaux as $t => $c) { $plat[] = $t . ':' . $c; }

        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, implode(',', $plat));
        fflush($fh);
        flock($fh, LOCK_UN);
    }
    fclose($fh);

    // Ménage opportuniste : sans lui, api/data/_sentinel/ accumulerait un
    // fichier par IP vue depuis l'ouverture du site.
    if (random_int(1, 200) === 1) { vrt_sentinel_gc($dir); }

    return $n;
}

function vrt_sentinel_gc(string $dir): void {
    $limite = time() - 7200;   // 2 h sans activité → le fichier ne sert plus
    foreach ((array) @glob($dir . '/*.txt') as $f) {
        if (@filemtime($f) < $limite) { @unlink($f); }
    }
}

// ─────────────────────────────────────────────────────────────────────
// 6. LE LAISSEZ-PASSER
// ─────────────────────────────────────────────────────────────────────
// Jeton signé HMAC-SHA256, lié à l'IP et à l'empreinte du navigateur pour
// qu'il ne soit pas revendable, et de durée courte. Format :
//   base64url(expiration.empreinte).signature
// ─────────────────────────────────────────────────────────────────────
function vrt_shield_fingerprint(): string {
    return substr(hash('sha256',
        vrt_real_ip() . '|' . ($_SERVER['HTTP_USER_AGENT'] ?? '') . '|' . ($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '')
    ), 0, 24);
}

function vrt_shield_issue(int $ttl = 1800): string {
    $corps = (time() + $ttl) . '.' . vrt_shield_fingerprint();
    $sig   = hash_hmac('sha256', $corps, vrt_shield_key());
    return rtrim(strtr(base64_encode($corps), '+/', '-_'), '=') . '.' . substr($sig, 0, 32);
}

function vrt_shield_valid(string $jeton): bool {
    if ($jeton === '' || substr_count($jeton, '.') !== 1) { return false; }
    [$b64, $sig] = explode('.', $jeton, 2);

    $corps = base64_decode(strtr($b64, '-_', '+/'), true);
    if ($corps === false || substr_count($corps, '.') !== 1) { return false; }

    $attendu = substr(hash_hmac('sha256', $corps, vrt_shield_key()), 0, 32);
    if (!hash_equals($attendu, $sig)) { return false; }

    [$exp, $empreinte] = explode('.', $corps, 2);
    if ((int) $exp < time()) { return false; }

    // Lié à l'empreinte : un jeton copié dans un script qui tourne ailleurs
    // (autre IP, autre agent) ne vaut rien.
    return hash_equals(vrt_shield_fingerprint(), $empreinte);
}

// Le jeton voyage en en-tête (fetch) ou en cookie (navigation de page).
function vrt_shield_presente(): string {
    $h = (string) ($_SERVER['HTTP_X_VERITAS_PASS'] ?? '');
    if ($h !== '') { return $h; }
    return (string) ($_COOKIE['vrt_pass'] ?? '');
}

// ─────────────────────────────────────────────────────────────────────
// 7. LA PORTE
// ─────────────────────────────────────────────────────────────────────
// Un seul appel en tête d'endpoint. Trois issues :
//   • rien (le visiteur passe)
//   • 429 + demande de laissez-passer  → le bouclier JS résout et rejoue
//   • 403                              → robot manifeste, on ferme
//
// FAIL-OPEN ASSUMÉ : si le disque refuse d'écrire, la sentinelle laisse
// passer plutôt que de fermer le site. Elle est une couche SUPPLÉMENTAIRE —
// elle ne remplace aucune vérification d'authentification, qui reste seule
// juge de l'accès aux données. Une sentinelle en panne ne doit pas être une
// panne de VÉRITAS ; elle ne doit pas non plus être la seule serrure.
// ─────────────────────────────────────────────────────────────────────

// LE SEUIL DE BLOCAGE SEC, calibré sur ce que ces outils envoient VRAIMENT :
//   curl               → 50 (signature) + 25 (pas d'Accept-Language) + 15 (pas
//                        d'Accept-Encoding)                                = 90
//   python-requests    → 50 (signature) + 25 (pas d'Accept-Language)      = 75
//   navigateur ancien  → 30 (pas de Sec-Fetch) + 25 (pas d'Accept-Language) = 55
//   client sans en-tête→ 25 + 25 + 15                                     = 65
// À 90, python-requests passait : le seuil doit tomber sous 75. À 70, tout ce
// qui s'annonce comme un outil est fermé, et aucune combinaison d'en-têtes
// manquants ne suffit à condamner un navigateur réel (65 au pire).
if (!defined('VRT_SCORE_BLOCAGE')) { define('VRT_SCORE_BLOCAGE', 70); }

// Profils (appels/minute avant défi ; par IP, puis par bloc voisin)
// Le plafond « bloc » est un FILET, pas la mesure principale : un /24 d'opérateur
// camerounais abrite des centaines d'élèves qui ont chacun droit à leur budget.
// Il ne doit se déclencher que sur la signature d'une moisson distribuée —
// beaucoup d'adresses différentes faisant chacune peu de requêtes.
$GLOBALS['VRT_PROFILS'] = [
    'lecture'        => ['ip' => 90, 'bloc' => 600, 'seuil' => 60],  // public_data, contenus
    'ecriture'       => ['ip' => 10, 'bloc' =>  60, 'seuil' => 45],  // demandes, formulaires
    'ia'             => ['ip' => 12, 'bloc' =>  60, 'seuil' => 45],  // ia_proxy — coûte de l'argent
    // ⚠️ 'telechargement' : NE PAS RABAISSER SANS RELIRE CE QUI SUIT.
    // Ce profil valait 20/min. C'est ce chiffre qui avait fait écarter la
    // sentinelle du déploiement : secure_pdf.php sert un livret UNE IMAGE PAR
    // PAGE, donc l'élève qui feuillette 40 pages fait 40 requêtes — il était
    // arrêté à la page 21, sur un livret qu'il avait payé.
    // 120 n'est pas un chiffre choisi au hasard : c'est exactement ce que
    // secure_pdf.php s'accorde déjà (vrt_rate_exceeded('spdf', 120)). Poser
    // ici un plafond PLUS BAS que celui de l'endpoint ne protégeait rien —
    // la vraie défense y est plus fine : elle compte les pages DISTINCTES sur
    // une heure glissante, si bien que relire dix fois la même page est
    // gratuit et qu'en balayer trois cents coûte.
    // Le filet de bloc monte en proportion : une classe de trente élèves
    // derrière l'IP d'un lycée lit légitimement plusieurs centaines de pages
    // par minute.
    'telechargement' => ['ip' => 120, 'bloc' => 900, 'seuil' => 45],  // PDF/EPUB — le fonds de commerce
    'identification' => ['ip' =>  8, 'bloc' =>  40, 'seuil' => 40],  // codes, mots de passe
];

function vrt_sentinelle(string $profil = 'lecture', bool $repondre = true): array {
    $p = $GLOBALS['VRT_PROFILS'][$profil] ?? $GLOBALS['VRT_PROFILS']['lecture'];

    $ip     = vrt_real_ip();
    $score  = vrt_bot_score();

    // ── Moissonneuses d'IA : refus sec, AVANT tout le reste ──────────────
    // Placé en tête à dessein. Ni un laissez-passer, ni l'exemption des
    // moteurs de recherche ne doivent pouvoir servir de contournement : une
    // moissonneuse sait exécuter du JavaScript et sait se dire « Googlebot ».
    // Le refus est le même sur les 4 000 corrigés que sur les manuels.
    $cat = vrt_ia_categorie();
    if ($cat !== '') {
        vrt_sentinel_journal('IA-' . strtoupper($cat), $profil, $score, $ip,
                             substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 80));
        if ($repondre) { vrt_sentinel_refuse403(); }
        return ['verdict' => 'ia', 'categorie' => $cat, 'score' => $score];
    }

    $jeton  = vrt_shield_presente();
    $laisse = $jeton !== '' && vrt_shield_valid($jeton);

    // Un laissez-passer valide : le visiteur a déjà prouvé qu'il n'était pas
    // un script jetable. On le laisse tranquille — dans la limite d'un plafond
    // large, pour qu'un jeton volé ne devienne pas un blanc-seing.
    if ($laisse) {
        $n = vrt_sentinel_hits('pass_' . $ip, 60);
        if ($n <= $p['ip'] * 4) { return ['verdict' => 'passe', 'score' => $score, 'passe' => true]; }
    }

    // Moteurs de recherche : exemptés en lecture publique uniquement.
    if ($profil === 'lecture' && vrt_is_search_engine()) {
        return ['verdict' => 'passe', 'score' => $score, 'moteur' => true];
    }

    // Robot manifeste : on ferme sans proposer de défi. Un outil qui
    // s'annonce « python-requests » n'a pas de bouclier JS à exécuter.
    if ($score >= VRT_SCORE_BLOCAGE) {
        vrt_sentinel_journal('BLOQUE', $profil, $score, $ip);
        if ($repondre) { vrt_sentinel_refuse403(); }
        return ['verdict' => 'bloque', 'score' => $score];
    }

    $nIp   = vrt_sentinel_hits('ip_' . $ip, 60);
    $nBloc = vrt_sentinel_hits('bl_' . vrt_ip_block($ip), 60);

    // Le budget du profil se resserre à mesure que la suspicion monte : un
    // visiteur au profil douteux dispose d'une marge plus courte avant défi.
    $budget = $score >= $p['seuil'] ? (int) max(3, $p['ip'] / 3) : $p['ip'];

    if ($nIp > $budget || $nBloc > $p['bloc']) {
        vrt_sentinel_journal('DEFI', $profil, $score, $ip, $nIp . '/' . $nBloc);
        if ($repondre) { vrt_sentinel_demandePasse($profil); }
        return ['verdict' => 'defi', 'score' => $score, 'ip_hits' => $nIp, 'bloc_hits' => $nBloc];
    }

    return ['verdict' => 'passe', 'score' => $score, 'ip_hits' => $nIp];
}

function vrt_sentinel_demandePasse(string $profil): void {
    if (!headers_sent()) {
        http_response_code(429);
        header('Content-Type: application/json; charset=utf-8');
        header('Retry-After: 5');
        header('X-Veritas-Shield: challenge');   // le bouclier JS écoute cet en-tête
    }
    echo json_encode([
        'error'     => "Trop de requêtes en peu de temps. Merci de confirmer que vous n'êtes pas un robot.",
        'shield'    => 'challenge',
        'challenge' => '/api/challenge.php',
        'profil'    => $profil,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

function vrt_sentinel_refuse403(): void {
    if (!headers_sent()) {
        http_response_code(403);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Veritas-Shield: blocked');
    }
    echo json_encode([
        'error' => "Accès automatisé refusé. Ce contenu est protégé (loi n° 2000/011). "
                 . "Pour un usage légitime : contact@veritas-school.com",
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ─────────────────────────────────────────────────────────────────────
// 8. LE JOURNAL
// ─────────────────────────────────────────────────────────────────────
// Sans trace, on ne sait pas si le bouclier protège ou s'il gêne des élèves.
// Rotation par taille ET suppression de l'ancienne archive : le journal ne
// doit jamais devenir un moyen de remplir le disque du mutualisé.
// ─────────────────────────────────────────────────────────────────────
function vrt_sentinel_journal(string $verdict, string $profil, int $score, string $ip, string $extra = ''): void {
    $dir = vrt_sentinel_dir();
    if (!is_dir($dir)) { @mkdir($dir, 0750, true); }
    $f = $dir . '/_sentinel.log';

    if (@filesize($f) > 512 * 1024) {
        @unlink($f . '.1');
        @rename($f, $f . '.1');
    }

    $ligne = sprintf(
        "%s [%s] %s score=%d ip=%s %s ua=%s uri=%s\n",
        date('c'), $verdict, $profil, $score, $ip, $extra,
        substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? '-'), 0, 120),
        substr((string) ($_SERVER['REQUEST_URI'] ?? '-'), 0, 120)
    );
    @file_put_contents($f, $ligne, FILE_APPEND | LOCK_EX);
}
