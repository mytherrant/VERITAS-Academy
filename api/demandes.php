<?php
// ============================================================
// VÉRITAS — Demandes entrantes (établissement → Campus, parent → domicile)
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
//
// POURQUOI CE FICHIER EXISTE
// Les candidatures partenaires vivaient dans le localStorage du VISITEUR :
// save() ne pousse vers le serveur que pour une session admin/enseignant, donc
// une demande envoyée depuis un navigateur inconnu ne quittait jamais ce
// navigateur. L'écran disait « demande reçue » — personne ne la recevait.
//
// Ici, la demande est écrite CÔTÉ SERVEUR, dans api/data/ (dossier interdit
// d'accès HTTP par .htaccess). Le centre la voit depuis son tableau de bord,
// même si le visiteur ferme l'onglet aussitôt.
//
// ROUTES
//   POST /api/demandes.php                    public  — déposer une demande
//   GET  /api/demandes.php?action=list        admin   — lister (Bearer API_SECRET)
//   POST /api/demandes.php?action=update      admin   — statut / devis
// ============================================================

require_once __DIR__ . '/config_sync.php';   // CORS allowlist + requireAuth() + jsonResponse()
require_once __DIR__ . '/_auth_lib.php';     // vrt_rate_exceeded() + vrt_client_ip()

const DEM_FICHIER   = __DIR__ . '/data/demandes.json';
const DEM_MAX       = 3000;   // garde-fou : on ne laisse pas le fichier enfler sans fin
const DEM_MAX_PAR_MIN = 4;    // dépôts par minute et par IP

// ── Utilitaires ────────────────────────────────────────────────────────────
function dem_lire(): array {
    if (!is_file(DEM_FICHIER)) { return []; }
    $raw = @file_get_contents(DEM_FICHIER);
    if ($raw === false || $raw === '') { return []; }
    $j = json_decode($raw, true);
    return is_array($j) ? $j : [];
}

function dem_ecrire(array $liste): bool {
    $dir = dirname(DEM_FICHIER);
    if (!is_dir($dir)) { @mkdir($dir, 0750, true); }
    if (count($liste) > DEM_MAX) { $liste = array_slice($liste, -DEM_MAX); }
    $json = json_encode($liste, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false) { return false; }
    return @file_put_contents(DEM_FICHIER, $json, LOCK_EX) !== false;
}

/** Texte nettoyé et borné. Les demandes sont relues par un humain, pas exécutées. */
function dem_txt($v, int $max = 300): string {
    $s = is_string($v) ? $v : (is_scalar($v) ? (string) $v : '');
    $s = str_replace(["\r", "\0"], '', $s);
    $s = trim(preg_replace('/[ \t]+/', ' ', $s));
    return mb_substr($s, 0, $max);
}

function dem_liste_txt($v, int $maxItems = 20, int $max = 60): array {
    if (is_string($v)) { $v = preg_split('/[,;]+/', $v); }
    if (!is_array($v)) { return []; }
    $out = [];
    foreach ($v as $x) {
        $t = dem_txt($x, $max);
        if ($t !== '') { $out[] = $t; }
        if (count($out) >= $maxItems) { break; }
    }
    return $out;
}

function dem_tel_valide(string $tel): bool {
    return strlen(preg_replace('/\D/', '', $tel)) >= 8;
}

/** Référence lisible par un humain au téléphone : DEM-260806-4F2A. */
function dem_reference(string $type): string {
    $p = $type === 'campus' ? 'ETB' : 'DOM';
    return $p . '-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(2)));
}

/**
 * Notification best-effort. mail() n'est pas garanti sur un mutualisé : l'échec
 * est silencieux et n'empêche JAMAIS l'enregistrement. Le tableau de bord reste
 * la source de vérité ; ce courriel n'est qu'un rappel.
 */
function dem_notifier(array $d): void {
    if (!defined('DEMANDES_NOTIFY_EMAIL') || !DEMANDES_NOTIFY_EMAIL) { return; }
    $titre = $d['type'] === 'campus'
        ? 'Nouvelle demande VÉRITAS Campus — ' . $d['etablissement']
        : 'Demande d\'accompagnement à domicile — ' . $d['nom'];
    $corps = "Référence : " . $d['ref'] . "\n"
           . "Reçue le  : " . $d['created_at'] . "\n"
           . "Contact   : " . $d['nom'] . ' · ' . $d['tel'] . ' · ' . $d['email'] . "\n\n"
           . json_encode($d, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    @mail(DEMANDES_NOTIFY_EMAIL, $titre, $corps, "Content-Type: text/plain; charset=utf-8\r\n");
}

// ── Routage ────────────────────────────────────────────────────────────────
$action = (string) ($_GET['action'] ?? '');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// ── ADMIN : lister ─────────────────────────────────────────────────────────
if ($action === 'list') {
    requireAuth();
    $liste = dem_lire();
    $type  = dem_txt($_GET['type'] ?? '', 20);
    $statut = dem_txt($_GET['statut'] ?? '', 20);
    if ($type !== '' || $statut !== '') {
        $liste = array_values(array_filter($liste, function ($d) use ($type, $statut) {
            if ($type !== '' && ($d['type'] ?? '') !== $type) { return false; }
            if ($statut !== '' && ($d['statut'] ?? '') !== $statut) { return false; }
            return true;
        }));
    }
    jsonResponse(['ok' => true, 'demandes' => array_reverse($liste), 'total' => count($liste)]);
}

// ── ADMIN : mettre à jour (statut, devis, note interne) ────────────────────
if ($action === 'update') {
    requireAuth();
    if ($method !== 'POST' && $method !== 'PUT' && $method !== 'PATCH') {
        jsonResponse(['ok' => false, 'error' => 'Méthode non autorisée.'], 405);
    }
    $body = json_decode((string) file_get_contents('php://input'), true);
    if (!is_array($body)) { $body = $_POST; }
    $id = dem_txt($body['id'] ?? '', 40);
    if ($id === '') { jsonResponse(['ok' => false, 'error' => 'Identifiant manquant.'], 422); }

    $liste = dem_lire();
    $trouve = false;
    foreach ($liste as &$d) {
        if (($d['id'] ?? '') !== $id) { continue; }
        $trouve = true;
        if (isset($body['statut'])) {
            $s = dem_txt($body['statut'], 20);
            $permis = ['nouveau', 'en_cours', 'devis_envoye', 'accepte', 'clos'];
            if (in_array($s, $permis, true)) { $d['statut'] = $s; }
        }
        if (isset($body['note']))  { $d['note'] = dem_txt($body['note'], 1500); }
        if (isset($body['devis']) && is_array($body['devis'])) {
            $d['devis'] = [
                'montant'   => (int) ($body['devis']['montant'] ?? 0),
                'periode'   => dem_txt($body['devis']['periode'] ?? '', 60),
                'detail'    => dem_liste_txt($body['devis']['detail'] ?? [], 30, 160),
                'valide_le' => dem_txt($body['devis']['valide_le'] ?? date('Y-m-d'), 20),
                'emis_le'   => date('c'),
            ];
            if (($d['statut'] ?? '') === 'nouveau' || ($d['statut'] ?? '') === 'en_cours') {
                $d['statut'] = 'devis_envoye';
            }
        }
        $d['maj_le'] = date('c');
        break;
    }
    unset($d);
    if (!$trouve) { jsonResponse(['ok' => false, 'error' => 'Demande introuvable.'], 404); }
    if (!dem_ecrire($liste)) { jsonResponse(['ok' => false, 'error' => 'Écriture impossible.'], 500); }
    jsonResponse(['ok' => true]);
}

// ── PUBLIC : déposer une demande ───────────────────────────────────────────
if ($method !== 'POST') {
    jsonResponse(['ok' => false, 'error' => 'Méthode non autorisée.'], 405);
}
if (vrt_rate_exceeded('demandes', DEM_MAX_PAR_MIN)) {
    jsonResponse(['ok' => false, 'error' => 'Trop de demandes envoyées coup sur coup. Patientez une minute.'], 429);
}

$body = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($body)) { $body = $_POST; }

$type = dem_txt($body['type'] ?? '', 20);
if ($type !== 'campus' && $type !== 'domicile') {
    jsonResponse(['ok' => false, 'error' => 'Type de demande inconnu.'], 422);
}

$nom   = dem_txt($body['nom'] ?? '', 120);
$tel   = dem_txt($body['tel'] ?? '', 40);
$email = dem_txt($body['email'] ?? '', 160);
if ($nom === '')            { jsonResponse(['ok' => false, 'error' => 'Le nom est requis.'], 422); }
if (!dem_tel_valide($tel))  { jsonResponse(['ok' => false, 'error' => 'Numéro de téléphone invalide.'], 422); }
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['ok' => false, 'error' => 'Adresse e-mail invalide.'], 422);
}

$d = [
    'id'         => 'dem_' . bin2hex(random_bytes(8)),
    'ref'        => dem_reference($type),
    'type'       => $type,
    'statut'     => 'nouveau',
    'created_at' => date('c'),
    'nom'        => $nom,
    'tel'        => $tel,
    'email'      => $email,
    'ville'      => dem_txt($body['ville'] ?? '', 80),
    'message'    => dem_txt($body['message'] ?? '', 1200),
    // On garde une EMPREINTE de l'IP (anti-abus, corrélation) et non l'IP elle-même :
    // ces fiches contiennent déjà une adresse de domicile, inutile d'y ajouter
    // une donnée de connexion en clair.
    'ip_hash'    => substr(hash('sha256', vrt_client_ip() . '|veritas-demandes'), 0, 16),
];

if ($type === 'campus') {
    $d['etablissement'] = dem_txt($body['etablissement'] ?? '', 160);
    $d['fonction']      = dem_txt($body['fonction'] ?? '', 60);
    $d['effectif']      = max(0, min(100000, (int) ($body['effectif'] ?? 0)));
    $d['mode']          = in_array(dem_txt($body['mode'] ?? '', 20), ['managed', 'self', 'local'], true)
                          ? dem_txt($body['mode'] ?? '', 20) : 'managed';
    $d['besoins']       = dem_liste_txt($body['besoins'] ?? [], 20, 60);
    if ($d['etablissement'] === '') {
        jsonResponse(['ok' => false, 'error' => 'Le nom de l\'établissement est requis.'], 422);
    }
} else {
    $d['adresse']   = dem_txt($body['adresse'] ?? '', 300);
    $d['quartier']  = dem_txt($body['quartier'] ?? '', 120);
    $d['niveau']    = dem_txt($body['niveau'] ?? '', 40);
    $d['matieres']  = dem_liste_txt($body['matieres'] ?? [], 15, 60);
    $d['eleves']    = max(1, min(20, (int) ($body['eleves'] ?? 1)));
    $d['frequence'] = dem_txt($body['frequence'] ?? '', 80);
    $d['creneaux']  = dem_txt($body['creneaux'] ?? '', 160);
    $d['objectif']  = dem_txt($body['objectif'] ?? '', 300);
    if ($d['adresse'] === '' && $d['quartier'] === '') {
        jsonResponse(['ok' => false, 'error' => 'Précisez au moins le quartier.'], 422);
    }
    if (!$d['matieres']) {
        jsonResponse(['ok' => false, 'error' => 'Indiquez au moins une matière.'], 422);
    }
}

$liste = dem_lire();
$liste[] = $d;
if (!dem_ecrire($liste)) {
    jsonResponse(['ok' => false, 'error' => 'Enregistrement impossible pour le moment.'], 500);
}
dem_notifier($d);

jsonResponse(['ok' => true, 'ref' => $d['ref'], 'id' => $d['id']], 201);
