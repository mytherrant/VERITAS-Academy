<?php
/**
 * tests/sentinelle.php — LA PREUVE DU BOUCLIER
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POURQUOI CE FICHIER EXISTE
 *
 * Une protection anti-robots ne se relit pas : elle se met à l'épreuve. Le
 * rate-limit précédent AVAIT l'air correct — il comptait, il refusait à 4/min,
 * il écrivait un fichier par IP. Il était pourtant contournable par une ligne,
 * parce qu'il comptait par une IP que le client écrivait lui-même dans
 * X-Forwarded-For. Personne ne l'a vu en le lisant ; un test qui envoie deux
 * requêtes sous deux fausses IP l'aurait montré tout de suite.
 *
 * Ce test ne vérifie donc pas que le code « existe ». Il joue l'attaquant :
 * il falsifie des en-têtes, rejoue des jetons volés, se fait passer pour
 * Googlebot, et martèle l'endpoint — puis exige le bon verdict.
 *
 * CE QU'IL COUVRE
 *   1. IP    — X-Forwarded-For ignoré sans proxy déclaré (LA faille corrigée).
 *   2. Score — un outil qui s'annonce est vu ; un vrai navigateur passe.
 *   3. Jeton — signature, expiration, et non-transférabilité vers une autre IP.
 *   4. Débit — le martèlement finit en défi, pas en porte ouverte.
 *   5. SEO   — Googlebot n'est jamais défié en lecture, MAIS l'est ailleurs.
 *   6. Bloc  — un moissonneur qui change d'IP dans le même /24 est rattrapé.
 *
 * LANCER :  php tests/sentinelle.php
 * Sortie   : une ligne par contrôle, un bilan, code de sortie non nul si échec.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Bac à sable : la sentinelle écrit compteurs, clé et journal ici — jamais
// dans api/data/ de production.
$bac = sys_get_temp_dir() . '/vrt_sentinelle_' . getmypid();
@mkdir($bac, 0700, true);
define('VRT_SENTINEL_DIR', $bac);

require_once __DIR__ . '//../api/_sentinel.php';

$ok = 0; $ko = 0;

function verifie(string $titre, $attendu, $obtenu): void {
    global $ok, $ko;
    $bon = ($attendu === $obtenu);
    if ($bon) { $ok++; echo "  ✓ $titre\n"; }
    else {
        $ko++;
        echo "  ✗ $titre\n";
        echo "      attendu : " . var_export($attendu, true) . "\n";
        echo "      obtenu  : " . var_export($obtenu, true) . "\n";
    }
}

/** Repose $_SERVER comme le ferait une vraie requête de navigateur. */
function navigateur(string $ip = '41.202.10.5'): void {
    $_SERVER = [
        'REMOTE_ADDR'            => $ip,
        'SERVER_PROTOCOL'        => 'HTTP/1.1',
        'REQUEST_URI'            => '/api/public_data.php',
        'HTTP_USER_AGENT'        => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                                  . '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'HTTP_ACCEPT'            => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'HTTP_ACCEPT_LANGUAGE'   => 'fr-FR,fr;q=0.9,en;q=0.8',
        'HTTP_ACCEPT_ENCODING'   => 'gzip, deflate, br',
        'HTTP_SEC_FETCH_MODE'    => 'navigate',
        'HTTP_SEC_FETCH_SITE'    => 'none',
    ];
}

echo "\n═══ 1. L'IP RÉELLE — la faille corrigée ═══\n";

// Le cœur du problème : sans proxy de confiance devant le site (et il n'y en a
// pas — LiteSpeed répond en direct), X-Forwarded-For n'est qu'un champ que
// l'attaquant remplit. S'il est cru, chaque requête ouvre un compteur neuf.
navigateur('41.202.10.5');
$_SERVER['HTTP_X_FORWARDED_FOR'] = '1.2.3.4';
verifie('X-Forwarded-For falsifié est IGNORÉ', '41.202.10.5', vrt_real_ip());

$_SERVER['HTTP_CF_CONNECTING_IP'] = '9.9.9.9';
verifie('CF-Connecting-IP falsifié est IGNORÉ', '41.202.10.5', vrt_real_ip());

// Poser mille fausses IP ne doit plus produire mille identités.
$identites = [];
for ($i = 0; $i < 50; $i++) {
    navigateur('41.202.10.5');
    $_SERVER['HTTP_X_FORWARDED_FOR'] = '10.0.0.' . $i;
    $identites[vrt_real_ip()] = true;
}
verifie('50 en-têtes falsifiés = 1 seule identité', 1, count($identites));

// Le seul cas où l'en-tête compte : un proxy explicitement déclaré.
verifie('REMOTE_ADDR invalide → adresse neutre', '0.0.0.0',
    (function () { $_SERVER = ['REMOTE_ADDR' => 'pas-une-ip']; return vrt_real_ip(); })());

echo "\n═══ 2. LE SCORE DE SUSPICION ═══\n";

navigateur();
verifie('Un vrai navigateur ne marque aucun point', 0, vrt_bot_score());

navigateur();
$_SERVER['HTTP_USER_AGENT'] = 'curl/8.4.0';
$s = vrt_bot_score();
verifie('curl est repéré (>= 50)', true, $s >= 50);

navigateur();
unset($_SERVER['HTTP_ACCEPT_LANGUAGE']);
verifie('Accept-Language manquant est repéré', true, vrt_bot_score() >= 25);

// Le cas qui compte vraiment : le script qui COPIE la chaîne de Chrome.
// La liste d'agents interdits du .htaccess ne le voit pas ; la cohérence, si.
navigateur();
unset($_SERVER['HTTP_SEC_FETCH_MODE'], $_SERVER['HTTP_SEC_FETCH_SITE']);
verifie('Faux Chrome sans Sec-Fetch-* est repéré', true, vrt_bot_score() >= 30);

navigateur();
$_SERVER['HTTP_USER_AGENT'] = 'python-requests/2.31.0';
unset($_SERVER['HTTP_ACCEPT_LANGUAGE'], $_SERVER['HTTP_SEC_FETCH_MODE'], $_SERVER['HTTP_SEC_FETCH_SITE']);
verifie('Moissonneur python franchit le seuil de blocage', true, vrt_bot_score() >= VRT_SCORE_BLOCAGE);

// Le contrôle inverse, celui qui protège les élèves : aucune combinaison
// d'en-têtes manquants ne doit condamner un navigateur réel, même ancien.
navigateur();
unset($_SERVER['HTTP_ACCEPT'], $_SERVER['HTTP_ACCEPT_LANGUAGE'],
      $_SERVER['HTTP_ACCEPT_ENCODING'], $_SERVER['HTTP_SEC_FETCH_MODE'],
      $_SERVER['HTTP_SEC_FETCH_SITE']);
$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (Linux; Android 8.1; TECNO KC8) AppleWebKit/537.36 Safari/537.36';
verifie('Un vieux téléphone dégarni reste SOUS le seuil de blocage', true, vrt_bot_score() < VRT_SCORE_BLOCAGE);

echo "\n═══ 3. LE LAISSEZ-PASSER ═══\n";

navigateur('41.202.10.5');
$jeton = vrt_shield_issue();
verifie('Un jeton fraîchement émis est valide', true, vrt_shield_valid($jeton));

verifie('Un jeton bricolé est refusé', false, vrt_shield_valid($jeton . 'x'));
verifie('Un jeton vide est refusé', false, vrt_shield_valid(''));
verifie('Un jeton sans forme est refusé', false, vrt_shield_valid('n-importe-quoi'));

// Le vol de jeton : je copie celui d'un élève et je m'en sers depuis chez moi.
navigateur('102.244.99.1');
verifie('Un jeton volé ne vaut rien depuis une autre IP', false, vrt_shield_valid($jeton));

// Le même jeton, même IP, mais un autre navigateur.
navigateur('41.202.10.5');
$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (X11; Linux x86_64) Firefox/128.0';
verifie('Un jeton volé ne vaut rien depuis un autre agent', false, vrt_shield_valid($jeton));

// L'expiration : je forge un jeton périmé AVEC la bonne clé.
navigateur('41.202.10.5');
$corps  = (time() - 10) . '.' . vrt_shield_fingerprint();
$perime = rtrim(strtr(base64_encode($corps), '+/', '-_'), '=') . '.'
        . substr(hash_hmac('sha256', $corps, vrt_shield_key()), 0, 32);
verifie('Un jeton périmé est refusé malgré sa signature valide', false, vrt_shield_valid($perime));

echo "\n═══ 4. LE DÉBIT ═══\n";

// Un élève normal consulte : il ne doit JAMAIS voir de défi.
$verdicts = [];
for ($i = 0; $i < 30; $i++) {
    navigateur('41.202.77.7');
    $verdicts[] = vrt_sentinelle('lecture', false)['verdict'];
}
verifie('30 consultations normales passent sans défi', ['passe'], array_values(array_unique($verdicts)));

// Un moissonneur martèle depuis une IP fixe.
$vu = 'passe';
for ($i = 0; $i < 130; $i++) {
    navigateur('41.202.88.8');
    $v = vrt_sentinelle('lecture', false)['verdict'];
    if ($v !== 'passe') { $vu = $v; break; }
}
verifie('Le martèlement finit par déclencher un défi', 'defi', $vu);

// Le profil « ia » coûte de l'argent : il se resserre bien plus tôt.
$vuIA = 'passe';
for ($i = 0; $i < 40; $i++) {
    navigateur('41.202.55.5');
    $v = vrt_sentinelle('ia', false)['verdict'];
    if ($v !== 'passe') { $vuIA = $v; break; }
}
verifie("Le profil IA se ferme bien avant le profil lecture", 'defi', $vuIA);

// Un outil qui s'annonce n'a pas droit au défi : on ferme.
navigateur('41.202.66.6');
$_SERVER['HTTP_USER_AGENT'] = 'python-requests/2.31.0';
unset($_SERVER['HTTP_ACCEPT_LANGUAGE'], $_SERVER['HTTP_SEC_FETCH_MODE'], $_SERVER['HTTP_SEC_FETCH_SITE']);
verifie('Un moissonneur déclaré est bloqué, pas défié', 'bloque', vrt_sentinelle('lecture', false)['verdict']);

echo "\n═══ 5. LES MOTEURS DE RECHERCHE (le référencement) ═══\n";

// Googlebot indexe vite et en rafale. S'il reçoit un défi, les 64 pages
// statiques sortent de l'index — le remède tuerait le malade.
$vuGoogle = 'passe';
for ($i = 0; $i < 200; $i++) {
    navigateur('66.249.66.1');
    $_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
    $v = vrt_sentinelle('lecture', false)['verdict'];
    if ($v !== 'passe') { $vuGoogle = $v; break; }
}
verifie('Googlebot n\'est JAMAIS défié en lecture publique', 'passe', $vuGoogle);

// Mais l'exemption s'arrête à la lecture : usurper « Googlebot » ne doit pas
// ouvrir l'IA ni les téléchargements payants.
// Le compte de tours suit le plafond du profil 'telechargement' (120/min,
// aligne sur celui que secure_pdf.php s'accorde). Un test qui bouclerait
// moins que le plafond passerait au vert sans rien prouver.
$vuFaux = 'passe';
for ($i = 0; $i < 140; $i++) {
    navigateur('102.16.4.4');
    $_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
    $v = vrt_sentinelle('telechargement', false)['verdict'];
    if ($v !== 'passe') { $vuFaux = $v; break; }
}
verifie('Un faux Googlebot est bel et bien défié sur les téléchargements', 'defi', $vuFaux);

echo "\n═══ 6. LE BLOC VOISIN ═══\n";

// La parade classique : louer un /24 et changer d'IP à chaque requête. Compter
// par IP seule ne le voit jamais ; compter par bloc le rattrape.
$vuBloc = 'passe'; $maxParIp = 0;
for ($tour = 0; $tour < 3 && $vuBloc === 'passe'; $tour++) {
    for ($i = 1; $i < 254; $i++) {
        navigateur('203.0.113.' . $i);
        $r = vrt_sentinelle('lecture', false);
        $maxParIp = max($maxParIp, $r['ip_hits'] ?? 0);
        if ($r['verdict'] !== 'passe') { $vuBloc = $r['verdict']; break; }
    }
}
verifie('Un moissonneur qui tourne dans un /24 est rattrapé', 'defi', $vuBloc);

// Sans ce contrôle, le test précédent pourrait passer pour la mauvaise raison :
// c'est bien le compteur de BLOC qui a parlé, pas celui d'une IP saturée.
verifie("...et c'est le filet de bloc qui a parlé, pas le compteur par IP",
    true, $maxParIp <= $GLOBALS['VRT_PROFILS']['lecture']['ip']);


echo "
═══ 8. LES MOISSONNEUSES D'IA ═══
";

// robots.txt les interdisait deja ; rien ne l'appliquait. On verifie que le
// refus est desormais REEL, et qu'aucune porte laterale ne subsiste.

// Chaines d'agent reelles, telles qu'observees dans les journaux publics.
$iaEntrainement = [
    'GPTBot (OpenAI)'      => 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot',
    'ClaudeBot'            => 'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
    'CCBot (CommonCrawl)'  => 'CCBot/2.0 (https://commoncrawl.org/faq/)',
    'Bytespider (TikTok)'  => 'Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)',
    'PerplexityBot'        => 'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
    'Meta-ExternalAgent'   => 'Mozilla/5.0 (compatible; meta-externalagent/1.1)',
    'Amazonbot'            => 'Mozilla/5.0 (compatible; Amazonbot/0.1)',
    'Cohere (training)'    => 'cohere-training-data-crawler/1.0',
];
foreach ($iaEntrainement as $nom => $ua) {
    navigateur('102.244.7.' . rand(2, 250));
    $_SERVER['HTTP_USER_AGENT'] = $ua;
    verifie('Moissonneuse refusee : ' . $nom, 'ia', vrt_sentinelle('lecture', false)['verdict']);
}

// Le piege de sous-chaine : « Bingbot-AI » CONTIENT « Bingbot », et
// « Applebot-Extended » contient « Applebot ». Sans exclusion explicite, ces
// deux-la entraient par l'exemption reservee au referencement.
navigateur('102.244.8.9');
$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (compatible; Bingbot-AI/2.0; +http://www.bing.com/bingbot.htm)';
verifie("Bingbot-AI n'entre PAS par la porte du referencement", 'ia',
    vrt_sentinelle('lecture', false)['verdict']);

navigateur('102.244.8.10');
$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 (KHTML, like Gecko) Applebot-Extended/0.1';
verifie('Applebot-Extended non plus', 'ia', vrt_sentinelle('lecture', false)['verdict']);

// Les deux controles ci-dessus passent aujourd'hui par la liste des
// moissonneuses, qui est consultee AVANT l'exemption des moteurs. Ils ne
// prouvent donc rien sur l'exclusion (?!-AI) elle-meme : la mutation qui la
// retire les laisse verts. On interroge donc vrt_is_search_engine() EN DIRECT,
// pour que l'exclusion soit reellement tenue — elle redeviendrait porteuse
// le jour ou quelqu'un reordonnerait les controles.
$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (compatible; Bingbot-AI/2.0)';
verifie('vrt_is_search_engine() rejette Bingbot-AI', false, vrt_is_search_engine());
$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (compatible; bingbot/2.0)';
verifie('vrt_is_search_engine() accepte le vrai bingbot', true, vrt_is_search_engine());
$_SERVER['HTTP_USER_AGENT'] = 'AppleWebKit/605 Applebot-Extended/0.1';
verifie('vrt_is_search_engine() rejette Applebot-Extended', false, vrt_is_search_engine());
$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (compatible; Googlebot/2.1)';
verifie('vrt_is_search_engine() accepte Googlebot', true, vrt_is_search_engine());

// ... alors que les VRAIS moteurs restent servis : le referencement fait
// vivre les 64 pages statiques, un 403 a Googlebot les sort de l'index.
navigateur('66.249.66.1');
$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
verifie('Googlebot, lui, est toujours servi', 'passe', vrt_sentinelle('lecture', false)['verdict']);

navigateur('157.55.39.1');
$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)';
verifie('Bingbot (le vrai) est toujours servi', 'passe', vrt_sentinelle('lecture', false)['verdict']);

// Un laissez-passer valide ne doit pas servir de contournement : une
// moissonneuse sait executer du JavaScript, donc resoudre un defi.
navigateur('102.244.9.1');
$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)';
$_SERVER['HTTP_X_VERITAS_PASS'] = vrt_shield_issue(1800);
verifie('Un laissez-passer VALIDE ne rachete pas une moissonneuse', 'ia',
    vrt_sentinelle('lecture', false)['verdict']);
unset($_SERVER['HTTP_X_VERITAS_PASS']);

// Les aspirateurs SEO commerciaux : bande passante du mutualisé consommee
// pour revendre l'analyse du site.
navigateur('102.244.10.1');
$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)';
verifie('Aspirateur SEO commercial refuse', 'ia', vrt_sentinelle('lecture', false)['verdict']);

// Et l'eleve ordinaire, lui, n'est jamais confondu avec tout cela.
navigateur('41.202.55.7');
verifie('Un eleve sur telephone passe toujours', 'passe',
    vrt_sentinelle('lecture', false)['verdict']);



echo "
═══ 9. FEUILLETER UN LIVRET PAYÉ (le parcours qui avait tout bloqué) ═══
";

// STATE.md avait ecarte ce chantier du deploiement pour cette raison :
// « il renvoie 403 a un client envoyant un User-Agent de navigateur ordinaire
//   — sur la porte du contenu payant, cela fermerait la boutique aux clients
//   qui ont paye ».
//
// La cause : secure_pdf.php sert le livret UNE IMAGE PAR PAGE. Un eleve qui
// feuillette 40 pages fait 40 requetes en quelques minutes. L endpoint
// s autorise lui-meme 120 requetes/minute et compte les pages DISTINCTES sur
// une heure glissante — un signal fin. Un plafond aveugle plus bas que le
// sien ne protege de rien : il ferme la porte au client qui a paye.

navigateur('41.202.77.4');
$vu = 'passe';
for ($i = 1; $i <= 45; $i++) {
    $r = vrt_sentinelle('telechargement', false);
    if ($r['verdict'] !== 'passe') { $vu = $r['verdict'] . ' a la page ' . $i; break; }
}
verifie('Un eleve feuillette 45 pages de son livret sans etre arrete', 'passe', $vu);

// Et le meme parcours pour une classe entiere derriere l IP du lycee.
navigateur('41.202.88.10');
$vu2 = 'passe';
for ($i = 1; $i <= 100; $i++) {
    $r = vrt_sentinelle('telechargement', false);
    if ($r['verdict'] !== 'passe') { $vu2 = $r['verdict'] . ' au tour ' . $i; break; }
}
verifie('100 pages consultees depuis une seule IP restent servies', 'passe', $vu2);

// En revanche, l aspiration franche doit toujours etre arretee.
navigateur('102.99.4.4');
$vuAsp = 'jamais arrete';
for ($i = 1; $i <= 400; $i++) {
    $r = vrt_sentinelle('telechargement', false);
    if ($r['verdict'] !== 'passe') { $vuAsp = $r['verdict']; break; }
}
verifie('Une aspiration de 400 pages est bel et bien arretee', 'defi', $vuAsp);



echo "
═══ 10. AUCUN NAVIGATEUR REEL NE DOIT ATTEINDRE LE SEUIL DE REFUS ═══
";

// Le seuil de refus sec est 70 (VRT_SCORE_BLOCAGE). C'est la frontiere la plus
// dangereuse du systeme : au-dela, le client recoit 403 sans defi ni recours.
// On epingle donc le score de chaque forme de client REELLE. Si une evolution
// du bareme fait franchir 70 a l'une d'elles, ce test rougit AVANT la mise en
// ligne — et non apres l'appel d'un parent dont l'enfant ne peut plus lire.

function scoreDe(array $entetes): int {
    $_SERVER = array_merge(['REMOTE_ADDR' => '41.202.1.1', 'SERVER_PROTOCOL' => 'HTTP/1.1'], $entetes);
    return vrt_bot_score();
}
$CHR  = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
$base = ['HTTP_ACCEPT' => 'text/html', 'HTTP_ACCEPT_LANGUAGE' => 'fr-FR', 'HTTP_ACCEPT_ENCODING' => 'gzip'];
$secF = ['HTTP_SEC_FETCH_MODE' => 'navigate', 'HTTP_SEC_FETCH_SITE' => 'none'];

$clients = [
    'Chrome bureau'            => array_merge(['HTTP_USER_AGENT' => $CHR], $base, $secF),
    'Chrome fetch() XHR'       => array_merge(['HTTP_USER_AGENT' => $CHR, 'HTTP_ACCEPT' => '*/*'], $base,
                                              ['HTTP_SEC_FETCH_MODE' => 'cors', 'HTTP_SEC_FETCH_SITE' => 'same-origin']),
    'Android Chrome (TECNO)'   => array_merge(['HTTP_USER_AGENT' => 'Mozilla/5.0 (Linux; Android 10; TECNO KC8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36'], $base, $secF),
    'Safari iPhone'            => array_merge(['HTTP_USER_AGENT' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'], $base),
    'Firefox bureau'           => array_merge(['HTTP_USER_AGENT' => 'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0'], $base, $secF),
    'App Capacitor (WebView)'  => array_merge(['HTTP_USER_AGENT' => 'Mozilla/5.0 (Linux; Android 11; SM-A125F) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/113.0.0.0 Mobile Safari/537.36', 'HTTP_ACCEPT' => '*/*'], $base,
                                              ['HTTP_SEC_FETCH_MODE' => 'cors', 'HTTP_SEC_FETCH_SITE' => 'same-origin']),
    'Lecteur PDF (balise img)' => array_merge(['HTTP_USER_AGENT' => $CHR, 'HTTP_ACCEPT' => 'image/avif,image/webp,*/*'], $base,
                                              ['HTTP_SEC_FETCH_MODE' => 'no-cors', 'HTTP_SEC_FETCH_SITE' => 'same-origin']),
    'Opera Mini (proxy)'       => array_merge(['HTTP_USER_AGENT' => 'Opera/9.80 (Android; Opera Mini/62.0.2254/191.303; U; fr) Presto/2.12.423 Version/12.16'], $base),
    'Vieil Android (Chrome 33)'=> array_merge(['HTTP_USER_AGENT' => 'Mozilla/5.0 (Linux; Android 4.4.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.0.0 Mobile Safari/537.36'], $base),
];
foreach ($clients as $nom => $h) {
    $sc = scoreDe($h);
    verifie('Jamais refuse : ' . $nom . ' (score ' . $sc . ' < 70)', true, $sc < 70);
}

// Le pire cas plausible : requete emise par le service worker, sans Sec-Fetch
// ni Accept-Language. Elle doit rester SERVIE — au pire avec un budget reduit.
$pire = scoreDe(['HTTP_USER_AGENT' => $CHR, 'HTTP_ACCEPT' => '*/*', 'HTTP_ACCEPT_ENCODING' => 'gzip']);
verifie('Pire cas navigateur (SW sans Sec-Fetch ni Langue) reste servi : ' . $pire . ' < 70', true, $pire < 70);

// A l'inverse, un outil qui s'annonce doit bel et bien franchir le seuil.
$outil = scoreDe(['HTTP_USER_AGENT' => 'curl/8.4.0', 'HTTP_ACCEPT' => '*/*']);
verifie('Un outil declare (curl) franchit le seuil : ' . $outil . ' >= 70', true, $outil >= 70);


// ── Bilan ────────────────────────────────────────────────────────────────
echo "\n" . str_repeat('─', 62) . "\n";
echo $ko === 0
    ? "✅ BOUCLIER VÉRIFIÉ — $ok contrôles passés.\n"
    : "❌ $ko contrôle(s) en échec sur " . ($ok + $ko) . ".\n";

// Ménage du bac à sable
foreach ((array) @glob($bac . '/_sentinel/*') as $f) { @unlink($f); }
foreach ((array) @glob($bac . '/*') as $f) { is_dir($f) ? @rmdir($f) : @unlink($f); }
@rmdir($bac);

exit($ko === 0 ? 0 : 1);
