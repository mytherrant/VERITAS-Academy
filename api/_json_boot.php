<?php
// ============================================================
// VÉRITAS — Amorçage défensif des endpoints (v1.12)
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// Œuvre protégée — Loi n° 2000/011 + Convention de Berne.
// ──────────────────────────────────────────────────────────
// POURQUOI CE FICHIER EXISTE
//
// En production, `payment_config.php` était inclus alors que certaines de ses
// constantes étaient DÉJÀ définies (ADMIN_TOKEN, PAY_API_SECRET). PHP émettait
// alors, AVANT le corps JSON :
//
//   <br /><b>Warning</b>: Constant ADMIN_TOKEN already defined in
//   <b>/htdocs/api/payment_config.php</b> on line <b>32</b><br />
//   {"error":"..."}
//
// Deux dégâts, tous deux constatés en prod le 25/07/2026 :
//   1. FONCTIONNEL — le client fait `r.json()` sur cette réponse. Du HTML avant
//      l'accolade ⇒ exception ⇒ **les paiements MTN et Orange échouaient
//      silencieusement de bout en bout**.
//   2. SÉCURITÉ — fuite du chemin absolu du serveur et du nom des constantes
//      sensibles, sur un dépôt public.
//
// Le fichier `payment_config.php` du serveur est édité à la main chez LWS : on
// ne peut pas le corriger depuis la CI. Le remède doit donc **immuniser les
// endpoints**, quoi que fasse la config. C'est le rôle de ce fichier ; il doit
// être inclus en TOUTE PREMIÈRE instruction de chaque endpoint.
// ============================================================

if (defined('VRT_JSON_BOOT')) { return; }
define('VRT_JSON_BOOT', 1);

// ── 1. Ne JAMAIS afficher une erreur au client ──────────────────────────
// On continue de tout journaliser (error_log) : on masque, on n'aveugle pas.
@ini_set('display_errors', '0');
@ini_set('display_startup_errors', '0');
@ini_set('log_errors', '1');
error_reporting(E_ALL);

// ── 2. Filet de sécurité : purger tout parasite avant le corps JSON ─────
// Si l'hébergeur force `display_errors` par php.ini (ou via auto_prepend_file),
// le point 1 ne suffit pas. On tamponne alors la sortie et on retire ce qui
// précède le JSON — mais UNIQUEMENT si la réponse est réellement du JSON, pour
// ne jamais corrompre un binaire (content.php, secure_pdf.php).
if (!function_exists('vrt_strip_noise_before_json')) {
    function vrt_strip_noise_before_json($buffer) {
        // Réponse binaire/HTML ? On ne touche à rien.
        $isJson = false;
        foreach (headers_list() as $h) {
            if (stripos($h, 'content-type:') === 0) {
                $isJson = (stripos($h, 'json') !== false);
                break;
            }
        }
        if (!$isJson) return $buffer;

        $trimmed = ltrim($buffer);
        // Déjà propre : rien à faire (cas nominal).
        if ($trimmed === '' || $trimmed[0] === '{' || $trimmed[0] === '[') return $buffer;

        // Chercher le début du vrai corps JSON après le parasite.
        $posObj = strpos($buffer, '{');
        $posArr = strpos($buffer, '[');
        $pos = false;
        if ($posObj !== false && $posArr !== false) $pos = min($posObj, $posArr);
        elseif ($posObj !== false) $pos = $posObj;
        elseif ($posArr !== false) $pos = $posArr;
        if ($pos === false) return $buffer;

        $candidate = substr($buffer, $pos);
        // On ne coupe que si le reste est du JSON valide : sinon on préfère
        // laisser la réponse intacte plutôt que de la mutiler.
        json_decode($candidate);
        if (json_last_error() !== JSON_ERROR_NONE) return $buffer;

        // Tracer l'incident pour ne pas masquer un problème de config durablement.
        @file_put_contents(__DIR__ . '/data/_security_log.txt',
            date('c') . ' [OUTPUT_NOISE_STRIPPED] ' . ($_SERVER['SCRIPT_NAME'] ?? '?')
            . ' bytes=' . $pos . ' extrait=' . str_replace("\n", ' ', substr($buffer, 0, 120)) . "\n",
            FILE_APPEND);

        return $candidate;
    }
}
ob_start('vrt_strip_noise_before_json');
