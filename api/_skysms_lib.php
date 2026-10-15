<?php
// ============================================================
// VÉRITAS — SkySMS (SKYSOFT Technology, skysms.cm)
// © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
// ------------------------------------------------------------
// DEUX SERVICES, DEUX JEUX D'IDENTIFIANTS — ne pas les confondre :
//   • Collecte Mobile Money : GET /api/public/collecte_momo/v2/output=json
//       uid, amount, phone, id_client → { statut, id_operation, amount,
//       telephone, description }   (identifiant : SKYSMS_UID)
//   • Envoi de SMS          : GET /api/public/sendsms/v1/output=json
//       user, password, sender, phone, message, idsmsclient → { statut, … }
//       statut 1 = envoyé ; 0 = échec ; -1 … -13 = refus (doc PDF V2023)
//       (identifiants : SKYSMS_USER / SKYSMS_PASSWORD / SKYSMS_SENDER)
//
// CE QUE SKYSMS NE FOURNIT PAS — relevé le 15/10/2026 sur la doc technique
// publique (https://skysms.cm/v2/api-docs) :
//   • AUCUNE route publique de statut d'une collecte. La liste des opérations
//     (/api/getListeOperationsMoMo) exige une session du tableau de bord.
//   • AUCUNE signature sur le rappel. Le compte porte `urlCallBack` +
//     `methodeCallBack` : SkySMS rappelle l'URL déclarée chez eux, au format
//     non documenté. On l'authentifie donc par un SECRET DANS L'URL
//     (SKYSMS_CALLBACK_CLE) et on recoupe montant + numéro.
//   • La réponse de la collecte est un ACCUSÉ, pas une preuve de paiement, et
//     elle n'ouvre JAMAIS un accès — seul le rappel (ou la validation de
//     l'administration) le fait. Mesuré le 15/10/2026, demande de 100 F reçue
//     sur le téléphone : réponse en ~20 s, AVANT la saisie du code Pin —
//       { "statut":"1", "amount":100, "telephone":"697637739",
//         "description":"Demande de collecte enregistrée avec succes.\nVeuillez
//          valider le paiement en saisissant votre code Pin.",
//         "id_operation":"<uuid>" }
//     « 1 » = demande enregistrée. id_client alphanumérique accepté. (Un
//     premier essai, le même jour, avait été coupé à 61 s sans réponse : on
//     garde donc la coupure pour « demande partie, rappel attendu ».)
//
// Les identifiants ne vivent QUE dans api/payment_config.php (gitignoré) : le
// dépôt est public, et SkySMS les fait voyager en paramètres d'URL — on ne
// journalise donc JAMAIS une URL d'appel.
// ============================================================

if (!function_exists('vrt_skysms_base')) {

    function vrt_skysms_base(): string {
        return defined('SKYSMS_API_BASE') ? rtrim((string) SKYSMS_API_BASE, '/') : 'https://skysms.cm/api/public';
    }

    function vrt_skysms_const(string $nom): string {
        if (!defined($nom)) return '';
        $v = trim((string) constant($nom));
        return (strpos($v, 'À_REMPLIR') !== false) ? '' : $v;
    }

    /** Collecte Mobile Money branchée ET allumée. */
    function vrt_skysms_collecte_active(): bool {
        if (defined('SKYSMS_ACTIF') && !SKYSMS_ACTIF) return false;
        return vrt_skysms_const('SKYSMS_UID') !== '';
    }

    /** Envoi de SMS possible. */
    function vrt_skysms_sms_actif(): bool {
        return vrt_skysms_const('SKYSMS_USER') !== '' && vrt_skysms_const('SKYSMS_PASSWORD') !== '';
    }

    /** Le rappel est-il authentifiable ? Sans clé, il est refusé (fail-closed). */
    function vrt_skysms_cle_rappel(): string {
        $c = vrt_skysms_const('SKYSMS_CALLBACK_CLE');
        return strlen($c) >= 24 ? $c : '';
    }

    /** Jeton public d'initiation : le sien, sinon celui de CamerPay. */
    function vrt_skysms_jeton_public(): string {
        $t = vrt_skysms_const('SKYSMS_PUBLIC_INIT');
        if ($t !== '') return $t;
        return defined('CAMERPAY_PUBLIC_INIT') ? trim((string) CAMERPAY_PUBLIC_INIT) : '';
    }

    function vrt_skysms_taux_frais(): float {
        return defined('SKYSMS_FEE_RATE') ? (float) SKYSMS_FEE_RATE : 0.0;
    }

    /** 6XXXXXXXX / +237 6XX… / 2376XXXXXXXX → 6XXXXXXXX (format des exemples SkySMS). */
    function vrt_skysms_tel_local(string $tel): string {
        $n = preg_replace('/[^0-9]/', '', $tel);
        if (strlen($n) === 12 && strpos($n, '237') === 0) $n = substr($n, 3);
        return (strlen($n) === 9 && $n[0] === '6') ? $n : '';
    }

    /** Identifiant client NUMÉRIQUE (l'exemple SkySMS : 10000001), unique par demande.
        IMPRÉVISIBLE (audit 15/10/2026, n°2) : c'est lui qui relie le rappel à la
        commande. « date + 3 chiffres » se devinait à la seconde près. 10 chiffres
        commençant par 1 : tient dans un entier 32 bits signé, et ne ressemble
        jamais à un numéro de téléphone (6XXXXXXXX) dans les journaux masqués. */
    function vrt_skysms_id_client(): string {
        return (string) random_int(1000000000, 1999999999);
    }

    /** 690000001 → « 6•• •• •0 01 » : assez pour que le payeur reconnaisse son numéro. */
    function vrt_skysms_tel_masque(string $tel): string {
        $l = vrt_skysms_tel_local($tel);
        return $l === '' ? '' : $l[0] . '•• •• •' . $l[6] . ' ' . substr($l, 7, 2);
    }

    /**
     * GET vers SkySMS. Ne lève jamais.
     * @return array{0:int,1:string,2:string} [http, corps, erreur curl]
     */
    function vrt_skysms_get(string $chemin, array $params, int $timeout): array {
        if (!function_exists('curl_init')) return [0, '', 'curl absent sur ce serveur'];
        $ch = curl_init(vrt_skysms_base() . $chemin . '?' . http_build_query($params, '', '&', PHP_QUERY_RFC3986));
        if ($ch === false) return [0, '', 'url invalide'];
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => ['Accept: application/json'],
            CURLOPT_CONNECTTIMEOUT => 8,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_FOLLOWLOCATION => false,
        ]);
        $rep  = curl_exec($ch);
        $http = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err  = curl_error($ch);
        curl_close($ch);
        if ($rep === false) return [0, '', $err !== '' ? $err : 'aucune réponse'];
        return [$http, (string) $rep, ''];
    }

    /**
     * Demande de paiement poussée sur le téléphone du payeur.
     * @return array{ok:bool,attente:bool,http:int,data:array,msg:string}
     *   ok      : SkySMS a accepté la demande (ou n'a pas encore répondu)
     *   attente : la connexion a expiré sans réponse — la demande est
     *             vraisemblablement partie, le rappel tranchera
     */
    function vrt_skysms_collecter(string $tel, int $montant, string $idClient): array {
        $local = vrt_skysms_tel_local($tel);
        if ($local === '') return ['ok' => false, 'attente' => false, 'http' => 0, 'data' => [], 'msg' => 'Numéro invalide (6XXXXXXXX).'];
        $timeout = defined('SKYSMS_TIMEOUT') ? max(10, (int) SKYSMS_TIMEOUT) : 75;
        if (function_exists('set_time_limit')) @set_time_limit($timeout + 30);
        [$http, $rep, $err] = vrt_skysms_get('/collecte_momo/v2/output=json', [
            'uid' => vrt_skysms_const('SKYSMS_UID'), 'amount' => $montant,
            'phone' => $local, 'id_client' => $idClient,
        ], $timeout);
        if ($http === 0) {
            // Mesuré : SkySMS garde la connexion ouverte pendant que le payeur
            // valide, puis la coupe. Une coupure n'est donc PAS un refus.
            return ['ok' => true, 'attente' => true, 'http' => 0, 'data' => [],
                    'msg' => 'Pas de réponse immédiate de SkySMS (' . substr($err, 0, 120) . ').'];
        }
        $d = json_decode($rep, true);
        if (!is_array($d)) $d = ['brut' => substr($rep, 0, 300)];
        if ($http >= 400) {
            return ['ok' => false, 'attente' => false, 'http' => $http, 'data' => $d,
                    'msg' => (string) ($d['detail'] ?? $d['description'] ?? $d['message'] ?? ('HTTP ' . $http))];
        }
        $statut = strtolower(trim((string) ($d['statut'] ?? '')));
        $desc   = (string) ($d['description'] ?? '');
        $refus  = ($statut !== '' && $statut[0] === '-')
               || preg_match('/(echec|échec|erreur|invalide|insuffisant|refus|inexistant|inactif|expir|non autoris)/iu', $desc);
        return ['ok' => !$refus, 'attente' => false, 'http' => $http, 'data' => $d,
                'msg' => $desc !== '' ? $desc : ($refus ? 'Demande refusée par SkySMS.' : 'Demande transmise.')];
    }

    /**
     * Lecture d'un statut SkySMS (réponse de collecte ou rappel).
     * @return string 'paid' | 'failed' | 'pending'
     */
    function vrt_skysms_verdict(array $d): string {
        foreach (['success', 'fail', 'pending'] as $b) {
            if (isset($d[$b]) && !is_array($d[$b])) $d[$b] = filter_var($d[$b], FILTER_VALIDATE_BOOLEAN);
        }
        /* Table OFFICIELLE du rappel, fournie par SKYSOFT le 15/10/2026 :
             statut  1 = Successful · 0 = Fail · -1 = Pending
           Elle passe avant toute autre lecture : « -1 » ressemble à un code
           d'erreur (les SMS en ont de -1 à -13) et l'heuristique ci-dessous
           l'aurait pris pour un échec. ⚠️ Ne vaut QUE pour le rappel : la
           réponse de la collecte rend aussi « 1 », mais pour « demande
           enregistrée » — elle n'est jamais passée ici. */
        if (isset($d['statut']) && is_scalar($d['statut'])) {
            $s = trim((string) $d['statut']);
            if ($s === '1')  return 'paid';
            if ($s === '0')  return 'failed';
            if ($s === '-1') return 'pending';
        }
        if (!empty($d['success'])) return 'paid';
        if (!empty($d['fail']))    return 'failed';
        foreach (['statut', 'status', 'statutText', 'statutProvider', 'reponse', 'state'] as $k) {
            if (!isset($d[$k]) || is_array($d[$k])) continue;
            $s = strtolower(trim((string) $d[$k]));
            if ($s === '') continue;
            if (preg_match('/^(1|success|successful|successfull|succes|succès|paid|payé|paye|completed|complete|valide|validé|ok|confirmed|accepted_paid)$/u', $s)) return 'paid';
            if (preg_match('/^(0|-\d+|fail|failed|failure|echec|échec|cancel|canceled|cancelled|annul|rejected|refus|refused|expired|expire|timeout|error|erreur)/u', $s)) return 'failed';
            return 'pending';
        }
        return 'pending';
    }

    /**
     * Normalise un rappel SkySMS (format non documenté : on lit large).
     * @return array{id_client:string,id_operation:string,verdict:string,montant:?int,tel:string,motif:string}
     */
    function vrt_skysms_lire_rappel(array $b): array {
        // Certains relais enveloppent l'opération : { data: {...} } / { operation: {...} }
        foreach (['data', 'operation', 'operationsMomo', 'body'] as $env) {
            if (isset($b[$env]) && is_array($b[$env])) { $b = $b[$env] + $b; break; }
        }
        $pick = function (array $cles) use ($b) {
            foreach ($cles as $k) {
                if (isset($b[$k]) && is_scalar($b[$k]) && trim((string) $b[$k]) !== '') return trim((string) $b[$k]);
            }
            return '';
        };
        $m = $pick(['amount', 'montant', 'montantText']);
        $m = preg_replace('/[^0-9.]/', '', $m);
        return [
            'id_client'    => $pick(['id_client', 'idclient', 'idClient', 'idTransactionClient', 'id_transaction_client', 'order_id', 'external_reference', 'reference']),
            'id_operation' => $pick(['id_operation', 'idOperation', 'numeroOperation', 'id', 'txnid', 'payment_ref']),
            // ID de la transaction chez Orange / MTN : la preuve à citer au
            // service client de l'opérateur en cas de litige.
            'id_operateur' => $pick(['id_operateur', 'idOperateur', 'numeroPaymentOperateur']),
            'verdict'      => vrt_skysms_verdict($b),
            'montant'      => ($m !== '' && is_numeric($m)) ? (int) round((float) $m) : null,
            'tel'          => vrt_skysms_tel_local($pick(['telephone', 'phone', 'tel', 'numero'])),
            'motif'        => mb_substr($pick(['description', 'message', 'reason', 'observation', 'statutText']), 0, 255),
        ];
    }

    /* Index « identifiant SkySMS → notre référence ». Un fichier par clé, nom
       haché : la clé vient d'un rappel non signé, elle ne fabrique pas de chemin. */
    function vrt_skysms_indexer(string $stateDir, string $cle, string $ref): void {
        if ($cle === '' || $ref === '') return;
        $d = $stateDir . '_skysms_idx/';
        if (!is_dir($d)) @mkdir($d, 0750, true);
        @file_put_contents($d . sha1($cle) . '.txt', $ref, LOCK_EX);
    }
    function vrt_skysms_resoudre(string $stateDir, array $cles): string {
        foreach ($cles as $c) {
            if ($c === '') continue;
            $f = $stateDir . '_skysms_idx/' . sha1($c) . '.txt';
            if (is_file($f)) { $r = trim((string) @file_get_contents($f)); if ($r !== '') return $r; }
        }
        return '';
    }

    /**
     * Envoi d'un SMS. Ne lève jamais.
     * @return array{ok:bool,canal:string,msg:string}
     */
    function vrt_skysms_sms(string $tel, string $message, string $idSms = ''): array {
        if (!vrt_skysms_sms_actif()) return ['ok' => false, 'canal' => 'skysms', 'msg' => 'SKYSMS_USER / SKYSMS_PASSWORD non configures'];
        $local = vrt_skysms_tel_local($tel);
        if ($local === '') return ['ok' => false, 'canal' => 'skysms', 'msg' => 'numero non camerounais ou invalide'];
        $message = trim($message);
        if ($message === '') return ['ok' => false, 'canal' => 'skysms', 'msg' => 'message vide'];
        $p = [
            'user' => vrt_skysms_const('SKYSMS_USER'), 'password' => vrt_skysms_const('SKYSMS_PASSWORD'),
            'sender' => mb_substr(vrt_skysms_const('SKYSMS_SENDER') ?: 'VERITAS', 0, 11),
            'phone' => $local, 'message' => mb_substr($message, 0, 640),
        ];
        if ($idSms !== '') $p['idsmsclient'] = substr(preg_replace('/[^A-Za-z0-9_-]/', '', $idSms), 0, 40);
        [$http, $rep, $err] = vrt_skysms_get('/sendsms/v1/output=json', $p, 20);
        if ($http === 0) return ['ok' => false, 'canal' => 'skysms', 'msg' => 'curl : ' . $err];
        $d = json_decode($rep, true);
        if (!is_array($d)) return ['ok' => false, 'canal' => 'skysms', 'msg' => 'HTTP ' . $http . ' réponse illisible'];
        $st = trim((string) ($d['statut'] ?? ''));
        if ($st === '1') return ['ok' => true, 'canal' => 'skysms', 'msg' => 'SMS envoyé (' . (string) ($d['ssid_sms'] ?? '') . ')',
                                 'solde' => $d['solde'] ?? null,
                                 // Identifiants du SMS chez SkySMS et chez nous : c'est par eux
                                 // qu'arrive l'accusé de réception (rappel ou consultation).
                                 'ssid' => (string) ($d['ssid_sms'] ?? ''), 'idsms' => (string) ($p['idsmsclient'] ?? '')];
        // La description de SkySMS recopie login ET mot de passe en clair
        // (« Compte Inexistant (Login : … / Pwd : …) ») : on la caviarde.
        $desc = preg_replace('/\(Login.*?\)/u', '(identifiants masqués)', (string) ($d['description'] ?? ''));
        return ['ok' => false, 'canal' => 'skysms', 'msg' => 'statut ' . $st . ' : ' . mb_substr($desc, 0, 160)];
    }

    /**
     * Accusé de réception d'un SMS envoyé (doc SKYSOFT V2023, § 3) :
     * statut 1 = DELIVRE, 0 = NON_DELIVRE ; datereception dd/MM/yyyy HH:mm:ss.
     * @return array{ok:bool,statut:string,date:string,motif:string}
     */
    function vrt_skysms_dlr_consulter(string $ssid): array {
        if ($ssid === '' || !vrt_skysms_sms_actif()) return ['ok' => false, 'statut' => 'inconnu', 'date' => '', 'motif' => 'non consultable'];
        [$http, $rep, $err] = vrt_skysms_get('/accusereceptionsms/v1/output=json', [
            'user' => vrt_skysms_const('SKYSMS_USER'), 'password' => vrt_skysms_const('SKYSMS_PASSWORD'),
            'ssid_sms' => $ssid], 15);
        $d = json_decode($rep, true);
        if (!is_array($d)) return ['ok' => false, 'statut' => 'inconnu', 'date' => '', 'motif' => $err !== '' ? $err : 'HTTP ' . $http];
        return ['ok' => true, 'statut' => vrt_skysms_dlr_statut((string) ($d['statut'] ?? '')),
                'date' => mb_substr((string) ($d['datereception'] ?? ''), 0, 40),
                'motif' => mb_substr(preg_replace('/\(Login.*?\)/u', '', (string) ($d['description'] ?? '')), 0, 160)];
    }

    /** 1 → delivre, 0 → non_delivre, le reste → inconnu (accusé pas encore revenu). */
    function vrt_skysms_dlr_statut(string $s): string {
        $s = strtolower(trim($s));
        if (in_array($s, ['1', 'delivre', 'délivré', 'delivered', 'true'], true)) return 'delivre';
        if (in_array($s, ['0', 'non_delivre', 'undelivered', 'failed', 'false'], true)) return 'non_delivre';
        return 'inconnu';
    }

    /** Solde SMS (nombre de SMS restants). */
    function vrt_skysms_solde(): array {
        if (!vrt_skysms_sms_actif()) return ['ok' => false, 'msg' => 'SMS non configuré'];
        [$http, $rep, $err] = vrt_skysms_get('/soldesms/v1/output=json', [
            'user' => vrt_skysms_const('SKYSMS_USER'), 'password' => vrt_skysms_const('SKYSMS_PASSWORD')], 15);
        $d = json_decode($rep, true);
        if (!is_array($d)) return ['ok' => false, 'msg' => $err !== '' ? $err : 'HTTP ' . $http];
        return ['ok' => trim((string) ($d['statut'] ?? '')) === '1', 'solde' => $d['solde'] ?? null,
                'msg' => mb_substr((string) ($d['description'] ?? ''), 0, 160)];
    }

    /**
     * Page de paiement servie par ?action=payer : c'est la `pay_url` que
     * reçoivent les quatre tunnels (cahiers, vitrine, Atelier, application),
     * qui savent tous ouvrir une page. Elle demande le numéro, déclenche la
     * demande sur le téléphone et suit le statut.
     */
    function vrt_skysms_page(array $state, string $api): string {
        $e = function ($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); };
        $ref     = (string) ($state['ref'] ?? '');
        $montant = number_format((int) ($state['montant'] ?? 0), 0, ',', ' ');
        $tel     = vrt_skysms_tel_local((string) ($state['clientTel'] ?? ''));
        /* Le numéro n'apparaît plus en clair (audit n°4) : la page n'en reçoit
           que la forme masquée ; le serveur utilise le numéro enregistré quand
           le champ reste vide. `t` = jeton de la pay_url, exigé par la collecte. */
        $masque  = vrt_skysms_tel_masque($tel);
        $cfg = json_encode(['ref' => $ref, 'api' => $api, 'masque' => $masque, 't' => (string) ($state['jeton'] ?? ''),
                            'retour' => (string) ($state['retour'] ?? ''),
                            'auto' => ($tel !== '' && empty($state['push_count']))],
                           JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
        return '<!doctype html><html lang="fr"><head><meta charset="utf-8">'
. '<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">'
. '<title>Paiement Mobile Money — VÉRITAS</title><style>'
. ':root{--fond:#f4f6fb;--carte:#fff;--encre:#142554;--doux:#5b6785;--or:#FFC93C;--ok:#1e8e4f;--ko:#c0392b;--bord:#dfe4ee}'
. '@media (prefers-color-scheme:dark){:root{--fond:#0d1530;--carte:#16204a;--encre:#f2f4fa;--doux:#aab3cc;--bord:#2a3666}}'
. '*{box-sizing:border-box}body{margin:0;background:var(--fond);color:var(--encre);font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}'
. 'main{max-width:440px;margin:0 auto;padding:24px 16px}.carte{background:var(--carte);border:1px solid var(--bord);border-radius:14px;padding:22px}'
. 'h1{font-size:1.15rem;margin:0 0 4px}.montant{font-size:2rem;font-weight:800;margin:10px 0 2px}.doux{color:var(--doux);font-size:.9rem}'
. 'label{display:block;font-weight:600;margin:18px 0 6px}input{width:100%;font-size:1.15rem;padding:12px;border:1px solid var(--bord);border-radius:10px;background:transparent;color:inherit;letter-spacing:.04em}'
. 'button{width:100%;margin-top:14px;padding:14px;border:0;border-radius:10px;background:var(--encre);color:#fff;font-size:1rem;font-weight:700;cursor:pointer}'
. '@media (prefers-color-scheme:dark){button{background:var(--or);color:#142554}}button:disabled{opacity:.55;cursor:wait}'
. '#etat{margin-top:16px;padding:12px;border-radius:10px;display:none}#etat.info{display:block;background:rgba(255,201,60,.18)}'
. '#etat.ok{display:block;background:rgba(30,142,79,.15);color:var(--ok);font-weight:700}#etat.ko{display:block;background:rgba(192,57,43,.12);color:var(--ko)}'
. '.op{font-weight:700}a{color:inherit}</style></head><body><main><div class="carte">'
. '<h1>' . $e($state['label'] ?? 'Paiement VÉRITAS') . '</h1>'
. '<div class="montant">' . $montant . ' FCFA</div><div class="doux">Référence ' . $e($ref) . ' · MTN Mobile Money ou Orange Money</div>'
. '<form id="f"><label for="tel">Votre numéro Mobile Money</label>'
. '<input id="tel" name="tel" inputmode="numeric" autocomplete="tel" placeholder="' . $e($masque !== '' ? $masque : '6XX XX XX XX') . '" maxlength="16" value="">'
. ($masque !== '' ? '<div class="doux">Numéro enregistré : ' . $e($masque) . ' — laissez vide pour l’utiliser, ou entrez un autre numéro.</div>' : '')
. '<div class="doux" id="op"></div>'
. '<button id="go" type="submit">Recevoir la demande de paiement</button></form>'
. '<div id="etat" role="status" aria-live="polite"></div>'
. '<p class="doux" style="margin-top:18px">Une demande de ' . $montant . ' FCFA s’affiche sur votre téléphone : validez-la avec votre code secret. '
. 'Votre accès s’active tout seul dès que l’opérateur confirme. Vous pourrez ensuite fermer cette page.</p>'
. '</div></main><script>(function(){var C=' . $cfg . ';'
. 'var f=document.getElementById("f"),t=document.getElementById("tel"),b=document.getElementById("go"),e=document.getElementById("etat"),o=document.getElementById("op"),fini=false,suivi=null;'
. 'function loc(v){v=(v||"").replace(/\D/g,"");if(v.length===12&&v.indexOf("237")===0)v=v.slice(3);return v;}'
. 'function oper(v){if(v.length!==9||v[0]!=="6")return"";var p2=v.slice(0,2),p3=+v.slice(0,3);if(p2==="67"||p2==="68"||(p3>=650&&p3<=654))return"MTN Mobile Money";if(p2==="69"||(p3>=655&&p3<=659)||p3===640)return"Orange Money";return"";}'
. 'function majOp(){var x=oper(loc(t.value));o.textContent=x?("Opérateur : "+x):"";}t.addEventListener("input",majOp);majOp();'
. 'function dire(c,m){e.className=c;e.textContent=m;}'
. 'function sonder(){if(fini)return;fetch(C.api+"?action=status&ref="+encodeURIComponent(C.ref),{cache:"no-store"}).then(function(r){return r.json();}).then(function(j){'
. 'if(j.status==="paid"){fini=true;clearInterval(suivi);b.disabled=true;dire("ok","Paiement confirmé. Votre accès s’ouvre…");setTimeout(retourner,1500);}'
. 'else if(j.status==="failed"){clearInterval(suivi);suivi=null;b.disabled=false;dire("ko","Paiement non abouti"+(j.reason?" : "+j.reason:"")+". Vous pouvez réessayer.");}'
. 'else if(j.status==="underpaid"){fini=true;clearInterval(suivi);dire("ko","Montant reçu incomplet. Contactez VÉRITAS sur WhatsApp au 697 63 77 39 avec la référence "+C.ref+".");}'
. '}).catch(function(){});}'
. 'function retourner(){try{if(window.opener&&!window.opener.closed){window.opener.focus();window.close();}}catch(x){}'
. 'if(C.retour){location.href=C.retour;}else{e.innerHTML+=" <a href=\\"/\\">Revenir sur VÉRITAS</a>";}}'
/* Attente bornée (audit n°7) : sans verdict au bout de 3 min, on dit quoi faire
   au lieu de laisser le payeur devant un écran qui tourne. */
. 'var garde=null;function borner(){if(garde)return;garde=setTimeout(function(){if(!fini)dire("info","Pas encore de confirmation ? Si vous avez validé sur votre téléphone, votre accès s’ouvrira dès que l’opérateur confirme. Sinon, envoyez la référence "+C.ref+" sur WhatsApp au 697 63 77 39.");},180000);}'
. 'function suivre(){if(!suivi)suivi=setInterval(sonder,5000);sonder();borner();}'
. 'function pousser(auto){var v=loc(t.value);if(!(v===""&&C.masque)&&!oper(v)){dire("ko","Entrez un numéro MTN ou Orange à 9 chiffres (6XX XX XX XX).");return;}'
. 'b.disabled=true;dire("info","Demande envoyée au "+(v||C.masque)+". Regardez votre téléphone et validez avec votre code secret…");suivre();'
. 'fetch(C.api+"?action=skysms_collect",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ref:C.ref,tel:v,t:C.t,auto:!!auto})})'
. '.then(function(r){return r.json().then(function(j){return{s:r.status,j:j};});}).then(function(x){if(fini)return;'
. 'if(x.j&&x.j.status==="paid"){sonder();return;}'
. 'if(x.s>=400){b.disabled=false;dire("ko",(x.j&&x.j.error)||"La demande n’a pas pu être envoyée. Réessayez.");}'
. 'else{setTimeout(function(){if(!fini)b.disabled=false;},30000);}'
. '}).catch(function(){setTimeout(function(){if(!fini)b.disabled=false;},30000);});}'
. 'f.addEventListener("submit",function(ev){ev.preventDefault();pousser(false);});'
. 'suivre();if(C.auto)pousser(true);})();</script></body></html>';
    }
}
