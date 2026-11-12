<?php
require_once __DIR__ . '/_json_boot.php'; // en TOUTE première instruction : aucune trace PHP avant le JSON
// ============================================================
// VÉRITAS — Manuels collaboratifs (apprendre/manuel.html)
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
//
// POURQUOI CE FICHIER EXISTE
// Un enseignant compose le manuel de sa classe à partir des leçons VÉRITAS et
// de ses propres blocs ; ses collègues l'éditent avec lui, ses élèves lisent la
// version PUBLIÉE. Ce travail doit vivre côté serveur : un localStorage ne se
// partage ni entre collègues, ni avec les élèves.
//
// MODÈLE DE CONFIANCE (sans compte, comme un lien de document partagé)
//   • id (10 caractères)  = lien de LECTURE, donné aux élèves ;
//   • clé d'édition (48 hex) = lien d'ÉDITION, donné aux co-enseignants.
//     Le serveur n'en garde que l'empreinte SHA-256 ; comparaison hash_equals.
//   • La lecture sans clé ne renvoie QUE les documents et blocs publiés.
//
// SÛRETÉ DU CONTENU
//   Le texte des blocs est relu par d'autres navigateurs : il est nettoyé ICI
//   (liste fermée de balises, AUCUN attribut), en plus du nettoyage côté client.
//   Les blocs « partie de leçon » ne portent qu'une référence (id de leçon + n°),
//   rendue côté client à partir des données VÉRITAS : pas de HTML stocké.
//
// INTÉGRITÉ (relecture php-reviewer du 07/11/2026)
//   • Écriture ATOMIQUE : fichier temporaire puis rename(). Un disque plein ou
//     un quota atteint laisse l'ancienne version intacte ; un élève qui lit
//     pendant un enregistrement voit l'ancienne ou la nouvelle, jamais une moitié.
//   • La version précédente est gardée en {id}.prev.json (filet de secours).
//   • Plafonds sur la SORTIE, pas seulement sur l'entrée : chaque « {} » reçu
//     devenait un bloc normalisé de ~70 octets (380 Ko reçus → 8,4 Mo écrits).
//   • Un « doc » absent ou invalide est REFUSÉ (422) : il vidait le manuel.
//
// CONCURRENCE
//   Chaque enregistrement envoie la version qu'il modifie. Si un collègue a
//   enregistré entre-temps, réponse 409 avec la version courante : rien n'est
//   écrasé en silence. Lecture-vérification-écriture sous un verrou dédié (.lock).
//
// ROUTES
//   POST /api/manuels.php?action=creer                {titre, classe, matiere}
//   GET  /api/manuels.php?id=xxxxxxxxxx               (+ en-tête X-Manuel-Cle)
//   POST /api/manuels.php?action=enregistrer&id=…     X-Manuel-Cle, {version, titre, doc}
// ============================================================

require_once __DIR__ . '/_auth_lib.php';     // vrt_rate_exceeded() + vrt_client_ip()

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const MAN_DIR          = __DIR__ . '/data/manuels';
const MAN_TAILLE_MAX   = 400000;   // octets de JSON reçus
const MAN_FICHIER_MAX  = 600000;   // octets de JSON écrits (après normalisation)
const MAN_BLOCS_MAX    = 600;      // blocs au total dans un manuel
const MAN_MANUELS_MAX  = 5000;     // manuels sur le serveur (quota disque mutualisé)
const MAN_CREER_MIN    = 3;        // créations par minute et par IP
const MAN_ECRIRE_MIN   = 40;       // enregistrements par minute et par IP (sauvegarde différée côté client)
const MAN_LIRE_MIN     = 300;      // une classe entière derrière une même IP (CGNAT des opérateurs)
const MAN_TYPES        = ['texte', 'def', 'ex', 'astuce', 'attention', 'savais', 'question', 'partie'];

function man_json($data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Erreur serveur : message neutre au client, détail dans le journal du serveur. */
function man_echec(string $journal, string $message, int $code = 500): void {
    error_log('[manuels] ' . $journal);
    man_json(['erreur' => $message], $code);
}

function man_id_valide($id): bool { return is_string($id) && preg_match('/^[a-z0-9]{10}$/', $id) === 1; }
function man_fichier(string $id, string $ext = '.json'): string { return MAN_DIR . '/' . $id . $ext; }

function man_lire(string $id): ?array {
    $raw = @file_get_contents(man_fichier($id));
    if ($raw === false || $raw === '') return null;
    $m = json_decode($raw, true);
    return is_array($m) ? $m : null;
}

/** Écriture atomique : tmp + rename ; garde la version précédente. Renvoie un message d'erreur ou ''. */
function man_ecrire(string $id, array $m): string {
    $json = json_encode($m, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) return 'encodage JSON impossible';
    if (strlen($json) > MAN_FICHIER_MAX) return 'trop_gros';
    $f = man_fichier($id); $tmp = man_fichier($id, '.tmp');
    if (@file_put_contents($tmp, $json) !== strlen($json)) { @unlink($tmp); return 'écriture du fichier temporaire incomplète'; }
    if (is_file($f)) @copy($f, man_fichier($id, '.prev.json'));
    if (!@rename($tmp, $f)) { @unlink($tmp); return 'rename impossible'; }
    return '';
}

function man_txt($v, int $max): string {
    $s = is_string($v) ? $v : (is_scalar($v) ? (string) $v : '');
    $s = str_replace(["\r", "\0"], '', $s);
    return mb_substr(trim(preg_replace('/[ \t]+/', ' ', $s)), 0, $max);
}

/** HTML de bloc : balises de mise en forme seulement, AUCUN attribut (ni style, ni on*, ni href). */
function man_html($v, int $max = 8000): string {
    $s = is_string($v) ? mb_substr($v, 0, $max * 2) : '';
    $s = strip_tags($s, '<b><i><u><strong><em><br><p><ul><ol><li><sub><sup>');
    $s = preg_replace('#<(/?)(b|i|u|strong|em|br|p|ul|ol|li|sub|sup)\b[^>]*>#i', '<$1$2>', $s);
    return mb_substr($s, 0, $max);
}

/** Identifiant court, valide ET unique dans le manuel (des doublons cassaient les ancres #b-id). */
function man_court_id($v, array &$vus): string {
    $s = is_string($v) && preg_match('/^[A-Za-z0-9_-]{1,24}$/', $v) ? $v : '';
    while ($s === '' || isset($vus[$s])) $s = substr(bin2hex(random_bytes(6)), 0, 10);
    $vus[$s] = true;
    return $s;
}

/** Reconstruit le document à partir d'une liste fermée de champs (rien d'inconnu ne passe).
 *  Plafond GLOBAL de blocs : les plafonds par niveau (40 × 60 × 120) laissaient passer 288 000 blocs. */
function man_nettoie_doc(array $doc): array {
    $chaps = []; $vus = []; $total = 0;
    foreach (array_slice($doc['chapitres'], 0, 40) as $c) {
        if (!is_array($c)) continue;
        $docs = [];
        foreach (array_slice(is_array($c['docs'] ?? null) ? $c['docs'] : [], 0, 60) as $d) {
            if (!is_array($d)) continue;
            $blocs = [];
            foreach (array_slice(is_array($d['blocs'] ?? null) ? $d['blocs'] : [], 0, 120) as $b) {
                if (!is_array($b)) continue;
                if (++$total > MAN_BLOCS_MAX) break 3;
                $type = in_array($b['type'] ?? '', MAN_TYPES, true) ? $b['type'] : 'texte';
                $bloc = ['id' => man_court_id($b['id'] ?? '', $vus), 'type' => $type, 'pub' => !empty($b['pub'])];
                if ($type === 'partie') {
                    $ref = is_string($b['ref'] ?? null) ? $b['ref'] : '';
                    if (!preg_match('/^[a-z0-9-]{1,60}#\d{1,2}$/', $ref)) continue;
                    $bloc['ref'] = $ref;
                } else {
                    $bloc['titre'] = man_txt($b['titre'] ?? '', 160);
                    $bloc['html']  = man_html($b['html'] ?? '');
                    if ($type === 'question') $bloc['rep'] = man_html($b['rep'] ?? '', 3000);
                }
                $blocs[] = $bloc;
            }
            $docs[] = ['id' => man_court_id($d['id'] ?? '', $vus), 'titre' => man_txt($d['titre'] ?? 'Document', 160),
                       'pub' => !empty($d['pub']), 'blocs' => $blocs];
        }
        $chaps[] = ['id' => man_court_id($c['id'] ?? '', $vus), 'titre' => man_txt($c['titre'] ?? 'Chapitre', 160), 'docs' => $docs];
    }
    return ['chapitres' => $chaps];
}

/** Vue élève : documents publiés, blocs publiés. (La réponse d'une question y figure : l'élève la
 *  découvre au clic, c'est un outil d'entraînement, pas un sujet d'examen.) */
function man_vue_publique(array $doc): array {
    $out = ['chapitres' => []];
    foreach (($doc['chapitres'] ?? []) as $c) {
        $docs = [];
        foreach (($c['docs'] ?? []) as $d) {
            if (empty($d['pub'])) continue;
            $d['blocs'] = array_values(array_filter($d['blocs'] ?? [], function ($b) { return !empty($b['pub']); }));
            $docs[] = $d;
        }
        if ($docs) { $c['docs'] = $docs; $out['chapitres'][] = $c; }
    }
    return $out;
}

function man_cle_ok(array $m): bool {
    $cle = $_SERVER['HTTP_X_MANUEL_CLE'] ?? '';
    return is_string($cle) && preg_match('/^[a-f0-9]{48}$/', $cle) === 1
        && hash_equals((string) ($m['cle'] ?? ''), hash('sha256', $cle));
}

function man_entete(array $m): array {
    return ['id' => $m['id'], 'titre' => $m['titre'], 'classe' => $m['classe'], 'matiere' => $m['matiere'],
            'version' => $m['version'], 'maj' => $m['maj']];
}

function man_corps(): array {
    $raw = file_get_contents('php://input', false, null, 0, MAN_TAILLE_MAX + 1);
    if ($raw === false || strlen($raw) > MAN_TAILLE_MAX) man_json(['erreur' => 'Manuel trop volumineux.'], 413);
    $j = json_decode($raw, true);
    return is_array($j) ? $j : [];
}

$methode = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action  = $_GET['action'] ?? '';
if ($methode !== 'GET' && $methode !== 'POST') { header('Allow: GET, POST'); man_json(['erreur' => 'Méthode non autorisée.'], 405); }
if (!is_dir(MAN_DIR) && !@mkdir(MAN_DIR, 0750, true) && !is_dir(MAN_DIR)) man_echec('mkdir ' . MAN_DIR . ' impossible', 'Stockage des manuels indisponible.', 503);

// ── Créer ──────────────────────────────────────────────────────────────────
if ($methode === 'POST' && $action === 'creer') {
    // JSON exigé : un formulaire d'un autre site (requête « simple ») ne peut pas créer de manuel.
    if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) man_json(['erreur' => 'Format attendu : JSON.'], 415);
    if (vrt_rate_exceeded('man_creer', MAN_CREER_MIN)) man_json(['erreur' => 'Trop de créations. Réessayez dans une minute.'], 429);
    if (count(glob(MAN_DIR . '/*.json', GLOB_NOSORT) ?: []) >= MAN_MANUELS_MAX * 2)   // ×2 : les .prev.json
        man_echec('plafond de manuels atteint', 'Le nombre maximal de manuels est atteint. Contactez VÉRITAS.', 503);
    $in = man_corps();
    $titre = man_txt($in['titre'] ?? '', 120);
    if ($titre === '') man_json(['erreur' => 'Donnez un titre au manuel.'], 400);
    do { $id = strtolower(substr(strtr(base64_encode(random_bytes(9)), '+/=', 'xyz'), 0, 10)); }
    while (!man_id_valide($id) || is_file(man_fichier($id)));
    $cle = bin2hex(random_bytes(24));
    $m = ['id' => $id, 'titre' => $titre, 'classe' => man_txt($in['classe'] ?? '', 20), 'matiere' => man_txt($in['matiere'] ?? '', 30),
          'cle' => hash('sha256', $cle), 'version' => 1, 'cree' => date('c'), 'maj' => date('c'),
          'doc' => ['chapitres' => [['id' => 'c1', 'titre' => 'Chapitre 1', 'docs' => []]]]];
    $err = man_ecrire($id, $m);
    if ($err !== '') man_echec("creer $id : $err", "Le manuel n'a pas pu être enregistré sur le serveur.");
    man_json(['ok' => true, 'cle' => $cle] + man_entete($m) + ['doc' => $m['doc']], 201);
}

// ── Lire (le rename atomique garantit une lecture cohérente, sans verrou) ──
if ($methode === 'GET') {
    if (vrt_rate_exceeded('man_lire', MAN_LIRE_MIN)) man_json(['erreur' => 'Trop de requêtes.'], 429);
    $id = $_GET['id'] ?? '';
    if (!man_id_valide($id) || !is_file(man_fichier($id))) man_json(['erreur' => 'Manuel introuvable.'], 404);
    $m = man_lire($id);
    if ($m === null) man_echec("lire $id : fichier illisible", 'Manuel momentanément illisible.');
    $editeur = man_cle_ok($m);
    man_json(man_entete($m) + ['editeur' => $editeur, 'doc' => $editeur ? $m['doc'] : man_vue_publique($m['doc'])]);
}

// ── Enregistrer (verrou dédié, clé vérifiée AVANT de lire le corps, version contrôlée) ──
if ($methode === 'POST' && $action === 'enregistrer') {
    if (vrt_rate_exceeded('man_ecrire', MAN_ECRIRE_MIN)) man_json(['erreur' => 'Trop d\'enregistrements rapprochés.'], 429);
    $id = $_GET['id'] ?? '';
    if (!man_id_valide($id) || !is_file(man_fichier($id))) man_json(['erreur' => 'Manuel introuvable.'], 404);
    $lk = @fopen(man_fichier($id, '.lock'), 'c');
    if (!$lk || !flock($lk, LOCK_EX)) man_echec("verrou $id impossible", 'Manuel momentanément indisponible.', 503);
    $fin = function (array $data, int $code) use ($lk) { flock($lk, LOCK_UN); fclose($lk); man_json($data, $code); };
    $m = man_lire($id);
    if ($m === null) { error_log("[manuels] enregistrer $id : fichier illisible"); $fin(['erreur' => 'Manuel illisible.'], 500); }
    if (!man_cle_ok($m)) $fin(['erreur' => "Lien d'édition invalide."], 403);
    $in = man_corps();
    if (!isset($in['doc']['chapitres']) || !is_array($in['doc']['chapitres']))
        $fin(['erreur' => 'Document invalide : rien n\'a été enregistré.'], 422);
    if ((int) ($in['version'] ?? 0) !== (int) $m['version'])
        $fin(['erreur' => 'conflit', 'message' => 'Un collègue a enregistré une version plus récente.'] + man_entete($m) + ['doc' => $m['doc']], 409);
    if (isset($in['titre'])) { $t = man_txt($in['titre'], 120); if ($t !== '') $m['titre'] = $t; }
    $m['doc'] = man_nettoie_doc($in['doc']);
    $m['version'] = (int) $m['version'] + 1;
    $m['maj'] = date('c');
    $err = man_ecrire($id, $m);
    if ($err === 'trop_gros') $fin(['erreur' => 'Manuel trop volumineux : scindez-le en plusieurs manuels.'], 413);
    if ($err !== '') { error_log("[manuels] enregistrer $id : $err"); $fin(['erreur' => "L'enregistrement a échoué sur le serveur ; la version précédente est intacte."], 500); }
    $fin(['ok' => true, 'version' => $m['version'], 'maj' => $m['maj']], 200);
}

man_json(['erreur' => 'Action inconnue.'], 400);
