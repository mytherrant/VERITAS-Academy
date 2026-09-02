<?php
/**
 * api/_notify_lib.php — LA REMISE DU CODE NE DÉPEND PLUS D'UN ONGLET OUVERT
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * POURQUOI CE FICHIER EXISTE
 *   Les 31/08 et 01/09/2026, cinq clients ont payé 1 500 F sans recevoir leur
 *   code. Rien n'avait échoué du côté de l'argent : les paiements étaient
 *   « COMPLETED » chez Orange, les codes étaient émis, inscrits au registre et
 *   déposés. Vérification faite après coup, `action:"claim"` les rendait tous
 *   les cinq du premier coup.
 *
 *   Le défaut était ailleurs : la remise n'avait que des canaux qui vivent DANS
 *   LE NAVIGATEUR DE L'ACHETEUR — un onglet resté au premier plan pendant le
 *   sondage, puis (depuis le 01/09) une reprise silencieuse au chargement,
 *   appuyée sur `localStorage`. Or payer par Orange Money veut dire QUITTER le
 *   navigateur pour composer « #150*50# » : Android gèle l'onglet resté
 *   derrière et le jette souvent. Et si l'acheteur revient depuis un autre
 *   téléphone, vide son cache, ou paie pour l'enfant d'un voisin, il ne reste
 *   RIEN sur l'appareil pour rattraper.
 *
 *   Ce fichier ajoute le seul canal qui ne dépende pas de l'appareil de
 *   l'acheteur : le serveur, au moment où la passerelle confirme, ENVOIE le
 *   code au numéro qui a payé. Ce numéro, on l'a — c'est celui que la
 *   passerelle nous transmet dans la notification de paiement.
 *
 * CE QU'IL NE FAIT PAS, ET C'EST VOLONTAIRE
 *   • Il ne remplace pas la reprise côté navigateur : deux canaux valent mieux
 *     qu'un, et celui-ci dépend d'un tiers (la passerelle SMS) qui peut tomber.
 *   • Il ne fait JAMAIS échouer un octroi de droit. Un webhook qui répondrait
 *     500 parce qu'un SMS n'est pas parti ferait rejouer la passerelle, et le
 *     client attendrait son code À CAUSE du canal censé le lui apporter.
 *     Toute erreur ici est avalée, journalisée, et remise en file.
 *   • Il ne garantit pas la remise : si aucun canal n'aboutit, les messages
 *     restent en file, visibles (livret.php, `admin_notify_list`), et
 *     l'exploitant reçoit UNE alerte portant le code et un lien WhatsApp
 *     pré-rempli vers le client. Une file visible vaut mieux qu'un envoi
 *     silencieusement perdu ; une alerte vaut mieux qu'une file que personne
 *     n'ouvre.
 *
 * TROIS CANAUX, ESSAYÉS DANS L'ORDRE (VRT_NOTIFY_CANAL, défaut « mail »)
 *   mail     — courriel. Le seul qui ne demande de compte NULLE PART : un
 *              hébergement mutualisé sait poster un message. Suppose que
 *              l'acheteur ait laissé une adresse (facultative à l'achat).
 *   whatsapp — WhatsApp Cloud API. Exige un compte Meta Business et un modèle
 *              approuvé ; sans eux, ce canal échoue proprement et le suivant
 *              prend la main.
 *   http     — passerelle SMS décrite par gabarit. Aucun fournisseur en dur.
 *
 * OÙ C'EST BRANCHÉ
 *   `vrt_grant_entitlement()` (api/_auth_lib.php) met en file DANS le verrou —
 *   une écriture de fichier local, quelques microsecondes. `vrt_grant_
 *   entitlement_to_file()` vide la file APRÈS avoir relâché le verrou : un
 *   appel réseau de plusieurs secondes tenu sous `flock` bloquerait toute la
 *   base, y compris les paiements suivants.
 *
 * CE FICHIER N'INCLUT RIEN — même raison que _livret_lib.php : il est chargé
 * par _auth_lib.php, et une dépendance en retour ferait un cycle. Les
 * constantes de configuration sont lues à l'appel, jamais au chargement.
 */
declare(strict_types=1);

if (!defined('VRT_NOTIFY_LIB')) {
    define('VRT_NOTIFY_LIB', '1.0');

    /** Dossier de la file. Surchargeable pour les bancs, comme VRT_LIVRET_DIR. */
    function vrt_notify_dir(): string {
        $d = (defined('VRT_NOTIFY_DIR') ? (string) VRT_NOTIFY_DIR
                                        : __DIR__ . '/data') . '/notify';
        if (!is_dir($d)) { @mkdir($d, 0750, true); }
        return $d;
    }

    function vrt_notify_log(string $ligne): void {
        $f = dirname(vrt_notify_dir()) . '/_notify_log.txt';
        // Même borne que les autres journaux du projet : sur un hébergement
        // mutualisé, un quota atteint met TOUT le site en 500.
        if (function_exists('vrt_log_borne')) { vrt_log_borne($f, date('c') . ' ' . $ligne); return; }
        if (@filesize($f) > 262144) {
            $g = @file_get_contents($f, false, null, 131072);
            if ($g !== false) @file_put_contents($f, "... [journal tronque] ...\n" . $g, LOCK_EX);
        }
        @file_put_contents($f, date('c') . ' ' . $ligne . "\n", FILE_APPEND | LOCK_EX);
    }

    /* ── LE NUMÉRO ────────────────────────────────────────────────────────────
       Les passerelles nous donnent le numéro sous quatre formes selon l'humeur
       du parcours : « 690361319 », « 237690361319 », « +237 690 36 13 19 »,
       parfois « 00237690361319 ». Une passerelle SMS, elle, n'en accepte qu'une.
       Normaliser ici plutôt que dans chaque transport évite d'avoir quatre fois
       la même règle et trois fois la même erreur.

       On ne devine PAS un pays : hors Cameroun (9 chiffres commençant par 6 ou
       2), on rend la chaîne vide et le message part en échec explicite. Envoyer
       un code d'accès à un numéro mal reconstruit, c'est le livrer à un
       inconnu. */
    function vrt_notify_tel(string $brut): string {
        $c = (string) preg_replace('/\D+/', '', $brut);
        if ($c === '') return '';
        if (strpos($c, '00') === 0) $c = substr($c, 2);
        if (strpos($c, '237') === 0 && strlen($c) === 12) return $c;      // déjà international
        if (strlen($c) === 9 && ($c[0] === '6' || $c[0] === '2')) return '237' . $c;
        return '';                                                        // format inconnu : on n'invente pas
    }

    /* Un SMS en GSM-7 tient 160 caractères ; dès qu'UN accent s'y glisse, il
       bascule en UCS-2 et tombe à 70 — le même message coûte alors trois envois
       au lieu d'un. Le texte WhatsApp, lui, garde ses accents : il n'est pas
       découpé en segments. */
    function vrt_notify_sans_accents(string $s): string {
        $t = ['à'=>'a','â'=>'a','ä'=>'a','á'=>'a','ã'=>'a','é'=>'e','è'=>'e','ê'=>'e','ë'=>'e',
              'î'=>'i','ï'=>'i','í'=>'i','ô'=>'o','ö'=>'o','ó'=>'o','õ'=>'o','ù'=>'u','û'=>'u',
              'ü'=>'u','ú'=>'u','ç'=>'c','ñ'=>'n','œ'=>'oe','æ'=>'ae',
              'À'=>'A','Â'=>'A','É'=>'E','È'=>'E','Ê'=>'E','Ë'=>'E','Î'=>'I','Ï'=>'I','Ô'=>'O',
              'Ù'=>'U','Û'=>'U','Ü'=>'U','Ç'=>'C',
              '’'=>"'", '‘'=>"'", '“'=>'"', '”'=>'"', '«'=>'"', '»'=>'"',
              '—'=>'-', '–'=>'-', '…'=>'...',
              'ᵉ'=>'e','ʳ'=>'r','ⁿ'=>'n','ᵈ'=>'d','ᵃ'=>'a'];
        $s = strtr($s, $t);
        // Tout ce qui reste hors ASCII imprimable serait de toute façon rendu
        // par un « ? » chez l'opérateur : on l'enlève plutôt que de le payer.
        return (string) preg_replace('/[^\x20-\x7E\r\n]/u', '', $s);
    }

    /** Adresse publique du site (surchargeable pour les bancs). */
    function vrt_notify_site(): string {
        $u = defined('VRT_SITE_URL') ? (string) VRT_SITE_URL : 'https://veritas-school.com';
        return rtrim($u, '/');
    }

    /* ── LE LIEN QU'ON ENVOIE ─────────────────────────────────────────────────
       Toujours `cahier.html?o=<slug>`, jamais `<slug>.html`. Les deux existent,
       mais depuis les dix pages d'atterrissage du 31/08/2026, `<slug>.html` est
       une page de VENTE pour une partie du catalogue — y envoyer quelqu'un qui
       vient de payer lui redemanderait de payer. `cahier.html` est la porte,
       pour tous les ouvrages, et c'est elle que le banc de remise pilote. */
    function vrt_notify_lien(string $slug): string {
        return vrt_notify_site() . '/livrets/cahier.html?o=' . rawurlencode($slug);
    }

    /**
     * Le message remis à l'acheteur. Court, parce qu'un SMS se paie au segment
     * et se lit sur un écran de téléphone : ce qu'il faut, c'est le code, où le
     * saisir, et à qui écrire si ça coince.
     */
    function vrt_notify_texte(array $v, bool $accents = true): string {
        $titre = (string) ($v['titre'] ?? '');
        $code  = (string) ($v['code'] ?? '');
        $lien  = (string) ($v['lien'] ?? '');
        $exp   = (int) ($v['exp'] ?? 0);
        $n     = (int) ($v['n'] ?? 1);
        $aide  = defined('VRT_NOTIFY_AIDE') ? (string) VRT_NOTIFY_AIDE : '697 63 77 39';

        /* ÉCHÉANCE D'ABONNEMENT — rien n'existait entre « abonné » et « expiré ».
           La durée était calculée, écrite et respectée à la lecture, mais aucun
           message n'était envoyé à l'approche du terme : l'abonné constatait un
           matin que le contenu avait disparu, sans savoir pourquoi ni comment
           revenir. Le transport, lui, était déjà construit et éprouvé — c'est
           celui qui livre les codes de cahier. Il ne manquait que de s'en
           servir. */
        if ((string) ($v['type'] ?? 'code') === 'echeance') {
            $jours = max(0, (int) ($v['jours'] ?? 0));
            $t = 'VERITAS — votre abonnement arrive a echeance' . "\n"
               . ($titre !== '' ? $titre . "\n" : '')
               . ($jours > 0
                    ? 'Il se termine dans ' . $jours . ' jour' . ($jours > 1 ? 's' : '')
                    : 'Il se termine aujourd’hui')
               . ($exp > 0 ? ' (le ' . date('d/m/Y', $exp) . ')' : '') . '.' . "\n"
               . 'Renouveler : ' . ($lien !== '' ? $lien : vrt_notify_site()) . "\n"
               . 'Aide : ' . $aide;
            return $accents ? $t : vrt_notify_sans_accents($t);
        }

        $t = 'VERITAS — votre code d’accès' . "\n"
           . ($titre !== '' ? $titre . "\n" : '')
           . 'Code : ' . $code . "\n"
           . ($n > 1 ? 'Pack de ' . $n . ' codes : les autres sont sur la page.' . "\n" : '')
           . 'Ouvrir : ' . $lien . "\n"
           . 'Saisissez le code sur cette page.'
           . ($exp > 0 ? ' Valable jusqu’au ' . date('d/m/Y', $exp) . ', 3 appareils.' : '')
           . "\n" . 'Aide : ' . $aide;
        return $accents ? $t : vrt_notify_sans_accents($t);
    }

    /* ── LA FILE ──────────────────────────────────────────────────────────────
       Un fichier par référence, nommé par son empreinte : aucune référence
       venue du réseau ne touche le disque. La référence est l'identité de la
       vente, donc la file est idempotente par construction — une passerelle qui
       rejoue sa notification jusqu'à obtenir un 200 ne fait pas partir deux
       SMS. */
    function vrt_notify_fichier(string $ref): string {
        return vrt_notify_dir() . '/' . hash('sha256', strtoupper(trim($ref))) . '.json';
    }

    function vrt_notify_lire(string $ref): ?array {
        $f = vrt_notify_fichier($ref);
        if (!is_file($f)) return null;
        $d = json_decode((string) @file_get_contents($f), true);
        return is_array($d) ? $d : null;
    }

    function vrt_notify_ecrire(array $m): bool {
        $f = vrt_notify_fichier((string) ($m['ref'] ?? ''));
        $ok = @file_put_contents($f, json_encode($m, JSON_UNESCAPED_UNICODE), LOCK_EX);
        if ($ok === false) return false;
        @chmod($f, 0640);
        return true;
    }

    /**
     * Met un code en file de remise. APPELÉ SOUS VERROU : ici, rien que du
     * disque local — pas un octet de réseau.
     *
     * @return string  '' si mis en file, sinon le motif du refus (journalisé
     *                 par l'appelant, jamais remonté au client).
     */
    function vrt_notify_enfiler(array $v): string {
        $ref = trim((string) ($v['ref'] ?? ''));
        if ($ref === '') return 'ref manquante';
        if (vrt_notify_lire($ref) !== null) return 'deja en file';   // rejeu de webhook

        $tel = vrt_notify_tel((string) ($v['tel'] ?? ''));
        $mail = trim((string) ($v['mail'] ?? ''));
        if ($mail !== '' && !filter_var($mail, FILTER_VALIDATE_EMAIL)) $mail = '';

        /* SANS CONTACT ≠ SANS NUMÉRO. Un acheteur peut n'avoir laissé qu'une
           adresse (paiement par carte) ou que son numéro (Orange Money) : il est
           joignable dans les deux cas. Ce n'est que privé des DEUX qu'il ne
           reste plus qu'une alerte à l'exploitant. */
        $joignable = ($tel !== '' || $mail !== '');
        $m = [
            'ref'      => $ref,
            'tel'      => $tel,
            'tel4'     => $tel !== '' ? substr($tel, -4) : '',
            'mail'     => $mail,
            'classe'   => (string) ($v['classe'] ?? ''),
            'kind'     => (string) ($v['kind'] ?? 'livret'),
            'titre'    => (string) ($v['titre'] ?? ''),
            'lien'     => (string) ($v['lien'] ?? ''),
            'texte'    => vrt_notify_texte($v, true),
            'sms'      => vrt_notify_texte($v, false),
            'cree'     => time(),
            'essais'   => 0,
            'prochain' => 0,
            'dernier'  => 0,
            'alerte'   => 0,
            'etat'     => $joignable ? 'attente' : 'sans_contact',
            'erreur'   => $joignable ? '' : 'ni adresse e-mail ni numero exploitable',
        ];
        if (!vrt_notify_ecrire($m)) return 'ecriture impossible';
        vrt_notify_log('[FILE] ref=' . $ref . ' tel=…' . $m['tel4']
            . ' mail=' . ($mail !== '' ? 'oui' : 'non')
            . ' classe=' . $m['classe'] . ' etat=' . $m['etat']);
        return $joignable ? '' : 'acheteur injoignable';
    }

    /* Attente avant nouvel essai. Une passerelle SMS tombe rarement pour
       longtemps ; un numéro éteint, souvent. On réessaie vite, puis on espace,
       et on s'arrête à six : au-delà, ce n'est plus un incident réseau, c'est
       un cas pour un humain — et l'administration a la liste. */
    function vrt_notify_attente(int $essais): int {
        $p = [0, 60, 300, 1800, 7200, 21600];
        return $p[min($essais, count($p) - 1)];
    }
    function vrt_notify_max_essais(): int { return 6; }

    /**
     * BATTEMENT — vider la file sans dépendre de la vente suivante.
     *
     * La file ne se vidait qu'au webhook suivant (ou sur commande de
     * l'administrateur). Un envoi qui échoue le vendredi soir attendait donc
     * la prochaine vente : si elle tombait le lundi, le client a passé le
     * week-end sans son code, alors qu'il était émis et prêt dès la première
     * seconde.
     *
     * Pas de tâche planifiée sur cet hébergement, et une planification
     * GitHub exigerait un secret que le dépôt n'a pas — elle échouerait en
     * silence, ce qui est pire que rien. On se sert donc du trafic : quelques
     * endpoints appellent ce battement, qui ne fait RIEN neuf fois sur dix.
     *
     * Trois précautions, parce que ceci vit sur un chemin public :
     *   · un `filemtime` tranche avant tout le reste — coût négligeable ;
     *   · la file vide sort immédiatement, sans rien lire ;
     *   · la réponse est rendue au visiteur AVANT l'appel réseau quand le
     *     serveur sait le faire (LiteSpeed et FPM le savent tous les deux),
     *     de sorte que personne n'attend un SMS qui ne le concerne pas.
     */
    /**
     * Prévenir AVANT que l'accès se referme.
     *
     * Rien n'existait entre « abonné » et « expiré » : pas de relance à
     * l'approche du terme, aucun message le jour où le contenu disparaît.
     * L'abonné le découvrait seul, et repartait souvent pour de bon.
     *
     * Une relance par abonnement, jamais deux : la référence de file est
     * l'identifiant de l'abonnement, et la file est idempotente par
     * construction. Le drapeau `relance` est posé en plus, pour que la base le
     * dise aussi à qui la lit.
     *
     * Ne prévient QUE ce qui est encore actif et réellement daté : un
     * abonnement sans terme (octroi manuel de l'administration) n'expire pas,
     * il n'y a rien à annoncer.
     *
     * @return int le nombre de relances mises en file
     */
    function vrt_abo_relances(array &$db, int $joursAvant = 7): int {
        if (!isset($db['elearning']['abonnements']) || !is_array($db['elearning']['abonnements'])) return 0;
        $now   = (int) round(microtime(true) * 1000);
        $seuil = $now + ($joursAvant * 86400000);
        $mis   = 0;

        foreach ($db['elearning']['abonnements'] as $i => $a) {
            if (!is_array($a)) continue;
            if (!empty($a['relance'])) continue;                       // déjà prévenu
            $fin = (int) ($a['dateFinTs'] ?? 0);
            if ($fin <= 0 || $fin <= $now || $fin > $seuil) continue;  // sans terme, déjà fini, ou trop tôt
            $st = strtolower((string) ($a['statut'] ?? ''));
            if (in_array($st, ['expiré', 'expire', 'annulé', 'annule', 'suspendu'], true)) continue;

            // Le contact : celui de la ligne, complété par celui du compte.
            $tel = (string) ($a['tel'] ?? '');
            $mail = (string) ($a['email'] ?? $a['mail'] ?? '');
            $accId = (string) ($a['accountId'] ?? '');
            if ($accId !== '' && function_exists('vrt_resoudre_compte')) {
                $r = vrt_resoudre_compte($db, $accId);
                if ($r) {
                    $acc = $db[$r['coll']][$r['idx']];
                    if ($tel === '')  $tel  = (string) ($acc['tel'] ?? '');
                    if ($mail === '') $mail = (string) ($acc['email'] ?? $acc['mail'] ?? '');
                }
            }
            if ($tel === '' && $mail === '') continue;   // injoignable : rien à tenter

            $jours = (int) max(0, floor(($fin - $now) / 86400000));
            $msg = vrt_notify_enfiler([
                'ref'   => 'RELANCE-' . (string) ($a['id'] ?? ('abo' . $i)),
                'type'  => 'echeance',
                'tel'   => $tel,
                'mail'  => $mail,
                'titre' => (string) ($a['planNom'] ?? $a['plan'] ?? 'Votre abonnement'),
                'lien'  => vrt_notify_site() . '/app.html#abonnements',
                'exp'   => (int) floor($fin / 1000),
                'jours' => $jours,
            ]);
            // « déjà en file » compte comme fait : ne pas retenter à chaque battement.
            if ($msg === '' || $msg === 'deja en file' || $msg === 'acheteur injoignable') {
                $db['elearning']['abonnements'][$i]['relance'] = date('c');
                $mis++;
            }
        }
        return $mis;
    }

    function vrt_notify_battement(int $minIntervalle = 600, int $budget = 2): void {
        $dir = vrt_notify_dir();

        /* ── LA RONDE DES ÉCHÉANCES ────────────────────────────────────────
           Bien plus lourde que le vidage de file (lecture + réécriture de la
           base) : deux fois par jour suffisent largement pour prévenir sept
           jours à l'avance, et elle sort sans écrire quand personne n'arrive à
           terme — c'est-à-dire presque toujours. Verrou non bloquant : aucun
           visiteur n'attend derrière cette tâche. */
        $marqueAbo = dirname($dir) . '/_relance_tick.txt';
        if (time() - (@filemtime($marqueAbo) ?: 0) >= 43200) {
            @file_put_contents($marqueAbo, (string) time());
            if (function_exists('vrt_abo_relances_fichier')) {
                try {
                    $n = vrt_abo_relances_fichier(7);
                    if ($n > 0) vrt_notify_log('[RELANCES] ' . $n . ' abonnement(s) prévenu(s)');
                } catch (\Throwable $e) { vrt_notify_log('[RELANCES_ERR] ' . $e->getMessage()); }
            }
        }

        // Y a-t-il seulement quelque chose à faire ? (un seul appel disque)
        $enAttente = glob($dir . '/*.json') ?: [];
        if (!$enAttente) return;

        $marque = dirname($dir) . '/_notify_tick.txt';
        $dernier = @filemtime($marque) ?: 0;
        if (time() - $dernier < $minIntervalle) return;
        // On pose la marque AVANT d'envoyer : deux visiteurs simultanés ne
        // doivent pas déclencher deux vidages de la même file.
        @file_put_contents($marque, (string) time());

        // Rendre la main au visiteur d'abord, s'il y a moyen.
        if (function_exists('litespeed_finish_request'))      { @litespeed_finish_request(); }
        elseif (function_exists('fastcgi_finish_request'))    { @fastcgi_finish_request(); }

        try {
            $r = vrt_notify_vider($budget);
            if (($r['tentes'] ?? 0) > 0) {
                vrt_notify_log('[BATTEMENT] ' . json_encode($r));
            }
        } catch (\Throwable $e) {
            vrt_notify_log('[BATTEMENT_ERR] ' . $e->getMessage());
        }
    }

    /**
     * Vide la file. APPELÉ HORS VERROU — il y a du réseau ici.
     * Budget serré : un webhook doit répondre vite, sinon la passerelle
     * considère qu'il a échoué et rejoue.
     *
     * @return array{tentes:int,envoyes:int,restants:int}
     */
    function vrt_notify_vider(int $budget = 3): array {
        $fs  = glob(vrt_notify_dir() . '/*.json') ?: [];
        $now = time();
        $tentes = 0; $envoyes = 0; $restants = 0;

        foreach ($fs as $f) {
            $m = json_decode((string) @file_get_contents($f), true);
            if (!is_array($m)) continue;

            /* Ménage : une file qui ne s'efface jamais finit par saturer le
               quota, et un disque plein met tout le site en 500. Les remises
               abouties se gardent trois mois — assez pour répondre à une
               réclamation, pas assez pour peser. Les échecs définitifs restent :
               ce sont eux qu'un humain doit voir. */
            if (($m['etat'] ?? '') === 'envoye' && $now - (int) ($m['cree'] ?? 0) > 7776000) {
                @unlink($f); continue;
            }
            /* Un acheteur sans contact du tout ne se rattrape pas par un
               réessai : il se rattrape par un humain. On prévient une fois,
               puis on laisse la ligne visible dans l'inventaire. */
            if (($m['etat'] ?? '') === 'sans_contact' && empty($m['alerte'])) {
                vrt_notify_alerte($m);
                vrt_notify_ecrire($m);
                continue;
            }
            if (($m['etat'] ?? '') !== 'attente') continue;
            $restants++;
            if ($tentes >= $budget) continue;
            if ((int) ($m['prochain'] ?? 0) > $now) continue;

            $tentes++;
            $r = vrt_notify_envoyer($m);
            $m['essais']  = (int) ($m['essais'] ?? 0) + 1;
            $m['dernier'] = $now;
            if ($r['ok']) {
                $m['etat'] = 'envoye'; $m['erreur'] = ''; $m['canal'] = $r['canal'];
                $envoyes++; $restants--;
                vrt_notify_log('[ENVOYE] ref=' . (string) ($m['ref'] ?? '') . ' tel=…'
                    . (string) ($m['tel4'] ?? '') . ' canal=' . $r['canal'] . ' essai=' . $m['essais']);
            } else {
                $m['erreur'] = substr((string) $r['msg'], 0, 300);
                if ($m['essais'] >= vrt_notify_max_essais()) {
                    $m['etat'] = 'echec'; $restants--;
                    vrt_notify_log('[ABANDON] ref=' . (string) ($m['ref'] ?? '') . ' tel=…'
                        . (string) ($m['tel4'] ?? '') . ' motif=' . $m['erreur']);
                    // Abandonner en silence, c'est le défaut d'origine avec un
                    // journal en plus. On prévient l'exploitant, une seule fois.
                    vrt_notify_alerte($m);
                } else {
                    $m['prochain'] = $now + vrt_notify_attente((int) $m['essais']);
                    vrt_notify_log('[RETARD] ref=' . (string) ($m['ref'] ?? '') . ' essai=' . $m['essais']
                        . ' motif=' . $m['erreur']);
                }
            }
            vrt_notify_ecrire($m);
        }
        return ['tentes' => $tentes, 'envoyes' => $envoyes, 'restants' => $restants];
    }

    /** Inventaire pour l'administration — jamais le code, jamais le numéro entier. */
    function vrt_notify_liste(int $max = 200): array {
        $out = [];
        foreach ((glob(vrt_notify_dir() . '/*.json') ?: []) as $f) {
            $m = json_decode((string) @file_get_contents($f), true);
            if (!is_array($m)) continue;
            $out[] = [
                'ref'    => (string) ($m['ref'] ?? ''),
                'tel4'   => (string) ($m['tel4'] ?? ''),
                'mail'   => (string) ($m['mail'] ?? ''),
                'classe' => (string) ($m['classe'] ?? ''),
                'kind'   => (string) ($m['kind'] ?? ''),
                'etat'   => (string) ($m['etat'] ?? ''),
                'canal'  => (string) ($m['canal'] ?? ''),
                'essais' => (int) ($m['essais'] ?? 0),
                'cree'   => (int) ($m['cree'] ?? 0),
                'erreur' => (string) ($m['erreur'] ?? ''),
                // Le geste de rattrapage, prêt : un appui et le client a son code.
                'whatsapp' => ((string) ($m['etat'] ?? '') === 'envoye') ? '' : vrt_notify_wa_lien($m),
            ];
        }
        usort($out, static function ($a, $b) { return $b['cree'] <=> $a['cree']; });
        return array_slice($out, 0, max(1, $max));
    }

    /* ══ TRANSPORTS ═══════════════════════════════════════════════════════════
       Aucun fournisseur n'est câblé en dur. Deux raisons :

       1. Le marché camerounais du SMS change vite et se choisit sur le prix au
          message ; figer un fournisseur dans le code obligerait à redéployer
          pour en changer.
       2. Ce qui varie d'un fournisseur à l'autre est TOUJOURS la même chose —
          une URL, une méthode, un corps de requête, un en-tête d'authentifi-
          cation. Un gabarit couvre donc la quasi-totalité des passerelles HTTP
          sans écrire une ligne de code par fournisseur.

       WhatsApp Cloud API a, elle, son propre transport : son corps de requête
       est structuré (modèle + paramètres), pas un simple couple champ/valeur.  */

    /* Les canaux ESSAYÉS, dans l'ordre. Une liste et non un choix unique : un
       acheteur laisse tantôt une adresse, tantôt un numéro, et exiger de choisir
       un canal unique reviendrait à décider d'avance lequel des deux clients on
       ne servira pas.

       Défaut « mail » : c'est le seul canal qui ne demande aucun compte chez un
       tiers — un hébergement mutualisé sait envoyer un courriel. Laisser le
       défaut à vide aurait fait taire la remise chez qui ne lit pas cette ligne,
       et c'est le silence qu'on répare ici. */
    function vrt_notify_canaux(): array {
        $c = defined('VRT_NOTIFY_CANAL') ? strtolower(trim((string) VRT_NOTIFY_CANAL)) : 'mail';
        if ($c === '') return [];
        $out = [];
        foreach (explode(',', $c) as $x) {
            $x = trim($x);
            if (in_array($x, ['mail', 'whatsapp', 'http'], true) && !in_array($x, $out, true)) $out[] = $x;
        }
        return $out;
    }
    /** Compat : le premier canal, pour l'affichage. */
    function vrt_notify_canal(): string { $c = vrt_notify_canaux(); return $c[0] ?? ''; }

    /**
     * Envoi effectif : on essaie les canaux dans l'ordre, le premier qui aboutit
     * gagne. Ne lève jamais.
     * @return array{ok:bool,canal:string,msg:string}
     */
    function vrt_notify_envoyer(array $m): array {
        $tel   = (string) ($m['tel'] ?? '');
        $mail  = (string) ($m['mail'] ?? '');
        $canaux = vrt_notify_canaux();
        if (!$canaux) return ['ok' => false, 'canal' => '', 'msg' => 'aucun canal configure (VRT_NOTIFY_CANAL)'];

        $motifs = [];
        foreach ($canaux as $canal) {
            try {
                if ($canal === 'mail') {
                    if ($mail === '') { $motifs[] = 'mail: pas d’adresse'; continue; }
                    $r = vrt_notify_mail($m);
                } elseif ($canal === 'whatsapp') {
                    if ($tel === '') { $motifs[] = 'whatsapp: pas de numéro'; continue; }
                    $r = vrt_notify_whatsapp($tel, (string) ($m['texte'] ?? ''));
                } else {
                    if ($tel === '') { $motifs[] = 'sms: pas de numéro'; continue; }
                    $r = vrt_notify_http($tel, (string) ($m['sms'] ?? ''));
                }
            } catch (\Throwable $e) {
                // Une remise ratée est un incident ; une remise qui fait tomber
                // le webhook est une vente perdue. On avale, toujours.
                $r = ['ok' => false, 'canal' => $canal, 'msg' => 'exception : ' . $e->getMessage()];
            }
            if (!empty($r['ok'])) return $r;
            $motifs[] = $canal . ': ' . (string) ($r['msg'] ?? '?');
        }
        return ['ok' => false, 'canal' => '', 'msg' => implode(' | ', $motifs)];
    }

    /* ── COURRIEL ─────────────────────────────────────────────────────────────
       Le seul canal qui ne demande de compte nulle part : un hébergement
       mutualisé sait poster un courriel. `mail()` n'est pas brillant, mais il
       est LÀ — et un code remis par un canal médiocre vaut infiniment mieux
       qu'un code qui attend sur le serveur.

       Deux précautions qui décident si le message arrive ou part en indésirable :
       une adresse d'expéditeur DU DOMAINE (un « From » chez gmail envoyé par nos
       serveurs échoue SPF), et un « Reply-To » où le client peut réellement
       répondre.                                                                */
    function vrt_notify_mail(array $m): array {
        $a = trim((string) ($m['mail'] ?? ''));
        if ($a === '' || !filter_var($a, FILTER_VALIDATE_EMAIL)) {
            return ['ok' => false, 'canal' => 'mail', 'msg' => 'adresse absente ou invalide'];
        }
        if (!function_exists('mail')) {
            return ['ok' => false, 'canal' => 'mail', 'msg' => 'fonction mail() indisponible'];
        }
        $de     = defined('VRT_NOTIFY_FROM')     ? (string) VRT_NOTIFY_FROM     : 'no-reply@veritas-school.com';
        $repond = defined('VRT_NOTIFY_REPLYTO')  ? (string) VRT_NOTIFY_REPLYTO  : 'contact@veritas-school.com';
        $titre  = (string) ($m['titre'] ?? 'votre cahier');
        $sujet  = 'Votre code d’accès — ' . $titre;

        // Encodage du sujet : un accent brut dans un en-tête sort en mojibake
        // chez la moitié des clients de messagerie.
        $sujetEnc = '=?UTF-8?B?' . base64_encode($sujet) . '?=';

        $corps = vrt_notify_mail_html($m);
        $entetes = "MIME-Version: 1.0\r\n"
                 . "Content-Type: text/html; charset=UTF-8\r\n"
                 . "Content-Transfer-Encoding: 8bit\r\n"
                 . 'From: =?UTF-8?B?' . base64_encode('Centre VÉRITAS') . "?= <$de>\r\n"
                 . "Reply-To: $repond\r\n"
                 . "X-Mailer: VERITAS\r\n";

        $ok = @mail($a, $sujetEnc, $corps, $entetes, '-f' . $de);
        if (!$ok) return ['ok' => false, 'canal' => 'mail', 'msg' => 'mail() a refuse l’envoi (SMTP local ?)'];
        return ['ok' => true, 'canal' => 'mail', 'msg' => ''];
    }

    /** Le courriel lui-même. Sobre : le code doit se voir en une seconde. */
    function vrt_notify_mail_html(array $m): string {
        $e = static function ($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); };
        $lien = (string) ($m['lien'] ?? vrt_notify_lien((string) ($m['classe'] ?? '')));
        $code = '';
        if (preg_match('/Code\s*:\s*([A-Z0-9\-]+)/u', (string) ($m['texte'] ?? ''), $mm)) $code = $mm[1];
        $aide = defined('VRT_NOTIFY_AIDE') ? (string) VRT_NOTIFY_AIDE : '697 63 77 39';

        return '<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto;'
             . 'color:#1f2b38;line-height:1.55">'
             . '<p style="font-size:15px">Bonjour,</p>'
             . '<p style="font-size:15px">Votre paiement est confirmé. Voici votre code d’accès à '
             . '<b>' . $e($m['titre'] ?? '') . '</b> :</p>'
             . '<p style="font-family:ui-monospace,Consolas,monospace;font-size:22px;font-weight:700;'
             . 'letter-spacing:1px;background:#f4f6f8;border-radius:10px;padding:14px 16px;text-align:center;'
             . 'margin:18px 0">' . $e($code) . '</p>'
             . '<p style="font-size:15px"><a href="' . $e($lien) . '" '
             . 'style="display:inline-block;background:#142554;color:#fff;text-decoration:none;'
             . 'border-radius:9px;padding:12px 20px;font-weight:700">Ouvrir mon cahier</a></p>'
             . '<p style="font-size:13.5px;color:#5b6672">Ouvrez cette page, saisissez le code, et le cahier '
             . 's’ouvre. Il fonctionne sur 3 appareils (téléphone, tablette, ordinateur).</p>'
             . '<p style="font-size:13.5px;color:#5b6672">Une difficulté ? Écrivez-nous au '
             . $e($aide) . '. Merci de votre confiance.</p>'
             . '<p style="font-size:12px;color:#98a1aa;border-top:1px solid #e6eaee;padding-top:10px">'
             . 'Centre VÉRITAS — veritas-school.com</p></div>';
    }

    /* ── LE LIEN WHATSAPP D'UN SEUL APPUI ─────────────────────────────────────
       Envoyer un WhatsApp DEPUIS un serveur exige un compte Meta Business et un
       modèle approuvé. Tant qu'il n'y en a pas, le serveur fabrique au moins le
       geste : un lien `wa.me` vers le numéro du client, message déjà écrit. Il
       reste un appui à donner — mais c'est un appui, pas une enquête. */
    function vrt_notify_wa_lien(array $m): string {
        $tel = (string) ($m['tel'] ?? '');
        if ($tel === '') return '';
        return 'https://wa.me/' . $tel . '?text=' . rawurlencode((string) ($m['texte'] ?? ''));
    }

    /* ── QUAND LE CLIENT N'EST PAS JOIGNABLE, C'EST L'EXPLOITANT QU'ON PRÉVIENT
       Une remise qui échoue sans que personne ne l'apprenne, c'est l'incident
       du 01/09 qui recommence : le code attend, le client croit avoir perdu son
       argent, et VÉRITAS l'apprend par une réclamation — ou jamais.

       Une alerte PAR REMISE, jamais par tentative : six essais ne doivent pas
       faire six courriels. */
    function vrt_notify_alerte(array &$m): void {
        if (!empty($m['alerte'])) return;
        $a = defined('VRT_NOTIFY_ADMIN_MAIL') ? trim((string) VRT_NOTIFY_ADMIN_MAIL) : '';
        if ($a === '' || !filter_var($a, FILTER_VALIDATE_EMAIL) || !function_exists('mail')) {
            $m['alerte'] = 1;                 // pas d'adresse d'alerte : on ne réessaiera pas en boucle
            return;
        }
        $e = static function ($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); };
        $wa = vrt_notify_wa_lien($m);
        $de = defined('VRT_NOTIFY_FROM') ? (string) VRT_NOTIFY_FROM : 'no-reply@veritas-school.com';

        $corps = '<div style="font-family:system-ui,Arial,sans-serif;max-width:560px;line-height:1.55">'
               . '<p><b>Un code payé n’a pas pu être remis automatiquement.</b></p>'
               . '<p>Référence : <code>' . $e($m['ref'] ?? '') . '</code><br>'
               . 'Ouvrage : ' . $e($m['titre'] ?? $m['classe'] ?? '') . '<br>'
               . 'Client : ' . ($e($m['tel'] ?? '') ?: '—')
               . ' · ' . ($e($m['mail'] ?? '') ?: 'pas d’adresse') . '<br>'
               . 'Motif : ' . $e($m['erreur'] ?? '') . '</p>'
               . '<pre style="background:#f4f6f8;border-radius:8px;padding:12px;white-space:pre-wrap;'
               . 'font-size:13px">' . $e($m['texte'] ?? '') . '</pre>'
               . ($wa !== '' ? '<p><a href="' . $e($wa) . '" style="display:inline-block;background:#25D366;'
                     . 'color:#fff;text-decoration:none;border-radius:9px;padding:12px 20px;font-weight:700">'
                     . 'Envoyer sur WhatsApp au ' . $e($m['tel']) . '</a></p>'
                 : '<p style="color:#b03030">Aucun numéro : ce client n’est joignable ni par courriel '
                     . 'ni par WhatsApp. Retrouvez-le dans le tableau de bord de la passerelle.</p>')
               . '</div>';

        $ok = @mail($a, '=?UTF-8?B?' . base64_encode('VÉRITAS — code à remettre à la main') . '?=',
              $corps,
              "MIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n"
              . 'From: =?UTF-8?B?' . base64_encode('VÉRITAS') . "?= <$de>\r\n", '-f' . $de);
        $m['alerte'] = 1;                     // même en cas d'échec : le journal porte la trace
        vrt_notify_log('[ALERTE] ref=' . (string) ($m['ref'] ?? '') . ' vers=' . $a
            . ' envoi=' . ($ok ? 'ok' : 'echec'));
    }

    /* Substitution dans un gabarit de formulaire « a=1&b={msg} » : on remplace
       DANS LA VALEUR puis on encode la valeur seule. Encoder le gabarit entier
       casserait les « & » et les « = » qui en font la structure — c'est l'erreur
       classique, et elle produit une requête acceptée mais vide. */
    function vrt_notify_corps_form(string $tpl, array $vars): string {
        $out = [];
        foreach (explode('&', $tpl) as $paire) {
            if ($paire === '') continue;
            $kv = explode('=', $paire, 2);
            $k  = $kv[0];
            $v  = $kv[1] ?? '';
            foreach ($vars as $cle => $val) { $v = str_replace('{' . $cle . '}', (string) $val, $v); }
            $out[] = rawurlencode($k) . '=' . rawurlencode($v);
        }
        return implode('&', $out);
    }

    /* Gabarit JSON : la valeur substituée est échappée AU FORMAT JSON (guillemets,
       antislashs, sauts de ligne). Un message multi-lignes inséré tel quel
       produirait un JSON invalide — et une passerelle qui répond 400 sans dire
       pourquoi. */
    function vrt_notify_corps_json(string $tpl, array $vars): string {
        foreach ($vars as $cle => $val) {
            $echappe = substr(json_encode((string) $val, JSON_UNESCAPED_UNICODE), 1, -1);
            $tpl = str_replace('{' . $cle . '}', (string) $echappe, $tpl);
        }
        return $tpl;
    }

    /** Passerelle SMS générique, décrite par gabarits dans payment_config.php. */
    function vrt_notify_http(string $tel, string $msg): array {
        $url = defined('VRT_SMS_URL') ? trim((string) VRT_SMS_URL) : '';
        if ($url === '' || strpos($url, 'À_REMPLIR') !== false) {
            return ['ok' => false, 'canal' => 'http', 'msg' => 'VRT_SMS_URL non configuree'];
        }
        $methode = defined('VRT_SMS_METHODE') ? strtoupper(trim((string) VRT_SMS_METHODE)) : 'POST';
        $type    = defined('VRT_SMS_TYPE')    ? strtolower(trim((string) VRT_SMS_TYPE))    : 'form';
        $tpl     = defined('VRT_SMS_CORPS')   ? (string) VRT_SMS_CORPS                     : '';
        $attendu = defined('VRT_SMS_OK')      ? trim((string) VRT_SMS_OK)                  : '';

        $vars = ['tel' => $tel, 'tel_plus' => '+' . $tel,
                 'tel_local' => (strpos($tel, '237') === 0 ? substr($tel, 3) : $tel),
                 'msg' => $msg];

        // L'URL accepte les mêmes gabarits : certaines passerelles ne prennent
        // que des paramètres d'URL, même en POST.
        foreach ($vars as $k => $v) { $url = str_replace('{' . $k . '}', rawurlencode((string) $v), $url); }

        $corps = '';
        $entetes = ['Accept: */*'];
        if ($tpl !== '') {
            if ($type === 'json') {
                $corps = vrt_notify_corps_json($tpl, $vars);
                $entetes[] = 'Content-Type: application/json';
            } else {
                $corps = vrt_notify_corps_form($tpl, $vars);
                $entetes[] = 'Content-Type: application/x-www-form-urlencoded';
            }
        }
        foreach (explode('|', defined('VRT_SMS_ENTETES') ? (string) VRT_SMS_ENTETES : '') as $h) {
            $h = trim($h);
            if ($h !== '' && strpos($h, ':') !== false) $entetes[] = $h;
        }

        [$http, $rep] = vrt_notify_curl($methode, $url, $corps, $entetes);
        if ($http < 200 || $http >= 300) {
            return ['ok' => false, 'canal' => 'http',
                    'msg' => 'HTTP ' . $http . ' ' . substr((string) $rep, 0, 200)];
        }
        /* Beaucoup de passerelles répondent 200 pour dire « requête reçue » ET
           pour dire « solde épuisé ». Sans ce contrôle, une remise jamais partie
           serait comptée comme livrée — exactement le silence qu'on répare ici.
           VRT_SMS_OK vide = on s'en tient au code HTTP, faute de mieux. */
        if ($attendu !== '' && stripos((string) $rep, $attendu) === false) {
            return ['ok' => false, 'canal' => 'http',
                    'msg' => 'reponse sans « ' . $attendu . " » : " . substr((string) $rep, 0, 200)];
        }
        return ['ok' => true, 'canal' => 'http', 'msg' => ''];
    }

    /**
     * WhatsApp Cloud API (Meta). Un message envoyé à quelqu'un qui ne nous a pas
     * écrit dans les 24 h DOIT passer par un modèle approuvé : c'est la règle de
     * Meta, pas un choix. Sans VRT_WA_MODELE, on tente le texte libre — utile
     * seulement en essai, sur un numéro qui vient d'écrire au compte.
     */
    function vrt_notify_whatsapp(string $tel, string $texte): array {
        $id    = defined('VRT_WA_PHONE_ID') ? trim((string) VRT_WA_PHONE_ID) : '';
        $token = defined('VRT_WA_TOKEN')    ? trim((string) VRT_WA_TOKEN)    : '';
        if ($id === '' || $token === '' || strpos($id, 'À_REMPLIR') !== false) {
            return ['ok' => false, 'canal' => 'whatsapp', 'msg' => 'VRT_WA_PHONE_ID / VRT_WA_TOKEN non configures'];
        }
        $v = defined('VRT_WA_VERSION') ? trim((string) VRT_WA_VERSION) : 'v21.0';
        $modele = defined('VRT_WA_MODELE') ? trim((string) VRT_WA_MODELE) : '';
        $langue = defined('VRT_WA_LANGUE') ? trim((string) VRT_WA_LANGUE) : 'fr';

        if ($modele !== '') {
            /* Un modèle approuvé n'accepte pas de saut de ligne dans un
               paramètre : Meta refuse le message avec l'erreur 132000. Le texte
               part donc en une ligne, les retours devenus des espaces. */
            $p = trim((string) preg_replace('/\s*\n\s*/', ' · ', $texte));
            $corps = ['messaging_product' => 'whatsapp', 'to' => $tel, 'type' => 'template',
                      'template' => ['name' => $modele, 'language' => ['code' => $langue],
                                     'components' => [['type' => 'body',
                                        'parameters' => [['type' => 'text', 'text' => $p]]]]]];
        } else {
            $corps = ['messaging_product' => 'whatsapp', 'to' => $tel, 'type' => 'text',
                      'text' => ['preview_url' => false, 'body' => $texte]];
        }

        [$http, $rep] = vrt_notify_curl('POST',
            'https://graph.facebook.com/' . $v . '/' . rawurlencode($id) . '/messages',
            json_encode($corps, JSON_UNESCAPED_UNICODE),
            ['Content-Type: application/json', 'Authorization: Bearer ' . $token]);

        if ($http < 200 || $http >= 300) {
            return ['ok' => false, 'canal' => 'whatsapp',
                    'msg' => 'HTTP ' . $http . ' ' . substr((string) $rep, 0, 200)];
        }
        $d = json_decode((string) $rep, true);
        if (!is_array($d) || empty($d['messages'])) {
            return ['ok' => false, 'canal' => 'whatsapp', 'msg' => 'reponse inattendue : ' . substr((string) $rep, 0, 200)];
        }
        return ['ok' => true, 'canal' => 'whatsapp', 'msg' => ''];
    }

    /**
     * Un appel HTTP borné dans le temps. Le délai serré n'est pas de la
     * frilosité : cette fonction s'exécute pendant qu'une passerelle de
     * paiement attend notre 200. Au-delà, elle conclut à l'échec et rejoue.
     *
     * @return array{0:int,1:string}
     */
    function vrt_notify_curl(string $methode, string $url, string $corps, array $entetes): array {
        if (!function_exists('curl_init')) return [0, 'curl absent sur ce serveur'];
        $ch = curl_init($url);
        if ($ch === false) return [0, 'url invalide'];
        $opts = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => $entetes,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT        => defined('VRT_NOTIFY_TIMEOUT') ? (int) VRT_NOTIFY_TIMEOUT : 10,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_FOLLOWLOCATION => false,
        ];
        if ($methode === 'POST') {
            $opts[CURLOPT_POST] = true;
            $opts[CURLOPT_POSTFIELDS] = $corps;
        } elseif ($methode !== 'GET') {
            $opts[CURLOPT_CUSTOMREQUEST] = $methode;
            if ($corps !== '') $opts[CURLOPT_POSTFIELDS] = $corps;
        }
        curl_setopt_array($ch, $opts);
        $rep  = curl_exec($ch);
        $http = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err  = curl_error($ch);
        curl_close($ch);
        if ($rep === false) return [0, 'curl : ' . $err];
        return [$http, (string) $rep];
    }
}
