<?php
/**
 * api/_recettes_lib.php — LE REGISTRE DES RECETTES PAR LIVRE
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant). Tous droits réservés.
 *
 * ── POURQUOI UN REGISTRE À PART (16/09/2026) ─────────────────────────────────
 *
 * Les parts d'auteur (« 60 % des ventes ») se calculaient dans le NAVIGATEUR,
 * comme `livre.vendu × livre.prix`. Trois défauts, tous d'argent :
 *
 *   1. LE PRIX DU JOUR RÉÉCRIT L'HISTOIRE. Un manuel vendu dix fois à 1 000 F
 *      puis passé à 2 000 F affichait 20 000 F de ventes : la part de l'auteur
 *      doublait après coup, pour des exemplaires jamais vendus à ce prix. Les
 *      remises (Code ami, codes promo, prix de pack) n'étaient pas vues non plus.
 *   2. LES VENTES SANS STOCK NE COMPTAIENT PAS. `vendu` ne s'incrémente que si un
 *      stock est suivi (`stock > 0`), et jamais pour un livre numérique : leurs
 *      auteurs voyaient zéro.
 *   3. CE QUE LE SERVEUR ÉCRIT DANS LA BASE NE TIENT PAS. api/db.php remplace la
 *      base ENTIÈRE par la copie du navigateur administrateur à chaque
 *      synchronisation. Un compteur incrémenté au paiement est effacé par la
 *      synchro suivante. C'est pour la même raison que le Code ami tient son
 *      propre registre (api/data/parrainage/).
 *
 * Ce registre enregistre donc, AU PAIEMENT CONFIRMÉ et côté serveur, le montant
 * réellement encaissé pour chaque livre — remises déduites, idempotent par
 * référence — dans un fichier que db.php ne touche jamais.
 *
 * ── LE PASSÉ ─────────────────────────────────────────────────────────────────
 * Le registre ne peut pas reconstituer les ventes d'avant son ouverture : aucune
 * trace du prix alors payé n'existe. À la PREMIÈRE vente qu'il enregistre pour
 * un livre, il FIGE l'estimation de l'ancien calcul (`vendu × prix` à cet
 * instant) dans `anterieur`. À partir de là, un changement de prix ne réécrit
 * plus rien : le passé est figé, le présent est exact.
 *
 * Forme : { v, livres: { <bookId>: { recette, n, anterieur, depuis } },
 *           ops: { <ref>: { b, m, i, t, rembourse } } }
 */

if (!function_exists('vrt_rec_dir')) {

    function vrt_rec_dir(): string {
        $dir = defined('VRT_REC_DIR') ? rtrim((string) VRT_REC_DIR, '/\\') : __DIR__ . '/data/recettes';
        if (!is_dir($dir)) @mkdir($dir, 0750, true);
        // Défense en profondeur : api/data/.htaccess interdit déjà tout le dossier.
        if (!is_file($dir . '/.htaccess')) {
            @file_put_contents($dir . '/.htaccess',
                "Require all denied\n<IfModule !mod_authz_core.c>\nOrder allow,deny\nDeny from all\n</IfModule>\n");
        }
        if (!is_file($dir . '/index.php')) @file_put_contents($dir . '/index.php', "<?php http_response_code(403); exit;\n");
        return $dir;
    }

    function vrt_rec_fichier(): string { return vrt_rec_dir() . '/registre.json'; }

    function vrt_rec_vide(): array { return ['v' => 1, 'livres' => [], 'ops' => []]; }

    function vrt_rec_lire(): array {
        $f = vrt_rec_fichier();
        if (!is_file($f)) return vrt_rec_vide();
        $j = json_decode((string) @file_get_contents($f), true);
        return is_array($j) ? array_merge(vrt_rec_vide(), $j) : vrt_rec_vide();
    }

    /**
     * Transaction sous verrou exclusif — même motif que vrt_parr_tx(). Un
     * registre illisible n'est JAMAIS écrasé : on en garde une copie et on
     * refuse d'écrire, plutôt que de repartir de zéro et d'effacer des recettes.
     */
    function vrt_rec_tx(callable $fn) {
        $f  = vrt_rec_fichier();
        $fp = @fopen($f, 'c+');
        if (!$fp) throw new \RuntimeException('registre des recettes inaccessible');
        if (!flock($fp, LOCK_EX)) { fclose($fp); throw new \RuntimeException('registre des recettes verrouillé'); }
        try {
            $brut = (string) stream_get_contents($fp);
            $reg  = json_decode($brut, true);
            if (!is_array($reg)) {
                if (trim($brut) !== '') {
                    @copy($f, $f . '.illisible.' . date('Ymd_His'));
                    throw new \RuntimeException('registre des recettes illisible — copie conservée, aucune écriture');
                }
                $reg = [];
            }
            $reg   = array_merge(vrt_rec_vide(), $reg);
            $avant = json_encode($reg, JSON_UNESCAPED_UNICODE);
            $res   = $fn($reg);
            $apres = json_encode($reg, JSON_UNESCAPED_UNICODE);
            if ($apres !== false && $apres !== $avant) {
                if ($brut !== '') @file_put_contents($f . '.bak', $brut);
                ftruncate($fp, 0); rewind($fp); fwrite($fp, $apres); fflush($fp);
            }
            return $res;
        } finally {
            flock($fp, LOCK_UN);
            fclose($fp);
        }
    }

    /**
     * Enregistre la vente confirmée d'un livre. Idempotente par référence : un
     * webhook rejoué, une réconciliation, une validation manuelle après le
     * webhook n'ajoutent rien.
     *
     * @param array $livre  la ligne du livre telle que la base la connaît AVANT
     *                      l'incrément de cette vente — sert à figer le passé.
     * @return bool vrai si la vente vient d'être enregistrée.
     */
    function vrt_rec_enregistrer(string $ref, string $bookId, int $montant, string $intent, array $livre = []): bool {
        if ($ref === '' || $bookId === '' || $montant < 0) return false;
        return (bool) vrt_rec_tx(function (array &$reg) use ($ref, $bookId, $montant, $intent, $livre) {
            if (isset($reg['ops'][$ref])) return false;
            $reg['ops'][$ref] = ['b' => $bookId, 'm' => $montant, 'i' => $intent, 't' => time(), 'rembourse' => 0];
            if (!isset($reg['livres'][$bookId]) || !is_array($reg['livres'][$bookId])) {
                /* Première vente suivie de ce livre : on FIGE l'ancien calcul.
                   `vendu` peut avoir été effacé par une synchro ou n'avoir jamais
                   compté (pas de stock) — c'est la meilleure estimation qui
                   existe, et elle ne bougera plus. */
                $venduAvant = max(0, (int) ($livre['vendu'] ?? 0));
                $prixAvant  = max(0, (int) ($livre['prix'] ?? 0));
                $reg['livres'][$bookId] = ['recette' => 0, 'n' => 0,
                                           'anterieur' => $venduAvant * $prixAvant, 'depuis' => time()];
            }
            $l = &$reg['livres'][$bookId];
            $l['recette'] = (int) ($l['recette'] ?? 0) + $montant;
            $l['n']       = (int) ($l['n'] ?? 0) + 1;
            unset($l);
            return true;
        });
    }

    /**
     * Le remboursement reprend la recette, au prorata s'il est partiel.
     * Un PANIER est remboursé sous sa référence parente alors que ses livres sont
     * enregistrés ligne par ligne (`ref#1`, `ref#2`…) : on les retrouve toutes.
     *
     * @param int $montantRembourse 0 = remboursement total.
     * @return int la recette reprise, en francs.
     */
    function vrt_rec_annuler(string $ref, int $montantRembourse = 0): int {
        if ($ref === '') return 0;
        return (int) vrt_rec_tx(function (array &$reg) use ($ref, $montantRembourse) {
            $cles = [];
            foreach ($reg['ops'] as $cle => $op) {
                $cle = (string) $cle;
                if ($cle === $ref || strpos($cle, $ref . '#') === 0) $cles[] = $cle;
            }
            if (!$cles) return 0;
            $totalPaye = 0;
            foreach ($cles as $cle) $totalPaye += (int) ($reg['ops'][$cle]['m'] ?? 0);
            if ($totalPaye <= 0) return 0;
            $part = ($montantRembourse <= 0 || $montantRembourse >= $totalPaye) ? 1.0 : $montantRembourse / $totalPaye;
            $repris = 0;
            foreach ($cles as $cle) {
                $op = &$reg['ops'][$cle];
                $m   = (int) ($op['m'] ?? 0);
                $deja = (int) ($op['rembourse'] ?? 0);
                $du  = min($m - $deja, (int) round($m * $part));
                if ($du <= 0) { unset($op); continue; }
                $op['rembourse'] = $deja + $du;
                $b = (string) ($op['b'] ?? '');
                unset($op);
                if ($b !== '' && isset($reg['livres'][$b])) {
                    $reg['livres'][$b]['recette'] = max(0, (int) ($reg['livres'][$b]['recette'] ?? 0) - $du);
                }
                $repris += $du;
            }
            return $repris;
        });
    }

    /** Recettes par livre, pour les écrans d'administration et d'auteur. */
    function vrt_rec_par_livre(): array {
        $out = [];
        foreach ((vrt_rec_lire()['livres'] ?? []) as $id => $l) {
            if (!is_array($l)) continue;
            $out[(string) $id] = ['recette' => (int) ($l['recette'] ?? 0), 'n' => (int) ($l['n'] ?? 0),
                                  'anterieur' => (int) ($l['anterieur'] ?? 0), 'depuis' => (int) ($l['depuis'] ?? 0)];
        }
        return $out;
    }

    /**
     * Point d'entrée de l'octroi. Un échec du registre ne doit JAMAIS bloquer
     * l'octroi — le client a payé, son accès passe d'abord —, mais il ne se tait
     * pas non plus : il est journalisé. À appeler AVANT l'incrément de `vendu`,
     * pour que le passé figé soit celui d'avant cette vente.
     */
    function vrt_rec_vente(array $db, array $state, string $bookId): void {
        try {
            vrt_rec_enregistrer((string) ($state['ref'] ?? ''), $bookId,
                max(0, (int) ($state['montant_paye'] ?? $state['montant'] ?? 0)),
                (string) ($state['intent'] ?? ''), vrt_rec_livre($db, $bookId));
        } catch (\Throwable $e) {
            if (function_exists('vrt_pay_log')) {
                vrt_pay_log('[RECETTE_ERR] ref=' . ($state['ref'] ?? '') . ' livre=' . $bookId . ' ' . $e->getMessage());
            }
        }
    }

    /** La ligne d'un livre dans la base, sans la modifier. */
    function vrt_rec_livre(array $db, string $bookId): array {
        foreach (($db['books'] ?? []) as $b) {
            if (is_array($b) && (string) ($b['id'] ?? '') === $bookId) return $b;
        }
        return [];
    }
}
