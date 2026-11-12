<?php
/**
 * tests/banc_migration_bcrypt.php — L'EMPREINTE S256 MIGRE-T-ELLE VRAIMENT ?
 * © 2024-2026 Jacques Miterand TAKOU (Mythe Errant).
 *
 *   php tests/banc_migration_bcrypt.php
 *
 * CE QU'IL PROTÈGE
 * `vrt_verify_password()` lève `$needUpgrade` depuis toujours quand un compte
 * s'authentifie avec une empreinte S256 — un SHA-256 en UN tour, salé par
 * l'identifiant (public) et poivré par une constante du source. Six appelants
 * déclaraient la variable ; aucun ne la lisait. `vrt_hash_bcrypt()` n'était
 * donc appelée qu'à la création d'un compte par api/compte.php : tous les
 * autres comptes — nés dans un navigateur, ou antérieurs — restaient en S256
 * à vie.
 *
 * Un SHA-256 en un tour se force à plusieurs milliards d'essais par seconde
 * sur une carte graphique ordinaire. Avec le minimum de 6 caractères qu'impose
 * l'inscription, une base qui fuite est une base dont les mots de passe sont
 * lisibles le soir même.
 *
 * CE QU'IL VÉRIFIE
 *   1. un compte S256 qui s'authentifie voit son empreinte devenir bcrypt ;
 *   2. le mot de passe continue d'ouvrir le compte APRÈS migration ;
 *   3. la migration est idempotente (repasser ne change plus rien) ;
 *   4. un MAUVAIS mot de passe ne migre rien — et n'écrase donc pas l'empreinte ;
 *   5. un compte déjà en bcrypt n'est pas retouché ;
 *   6. un identifiant inconnu ne modifie aucun compte ;
 *   7. les voisins de la base sont laissés intacts.
 */

require_once __DIR__ . '/../api/_auth_lib.php';

$V = "\033[32m+\033[0m";
$X = "\033[31mx\033[0m";
$ok = 0; $ko = 0; $echecs = [];

function dire(string $t, bool $c, string $d = ''): void {
    global $ok, $ko, $V, $X, $echecs;
    if ($c) { $ok++; echo "  $V $t\n"; }
    else { $ko++; $echecs[] = $t; echo "  $X $t" . ($d !== '' ? "  -> $d" : '') . "\n"; }
}

$FICHIER = vrt_db_file();
$SAUVE   = is_file($FICHIER) ? file_get_contents($FICHIER) : null;

/** Repose une base d'essai ne contenant que les comptes fournis. */
function poser(array $comptes): void {
    global $FICHIER;
    $db = ['lastModified' => 1000, 'studentAccounts' => [], 'visitorAccounts' => $comptes];
    file_put_contents($FICHIER, json_encode($db, JSON_UNESCAPED_UNICODE));
}
function relire(): array {
    global $FICHIER;
    return json_decode((string) file_get_contents($FICHIER), true) ?: [];
}
function pwdDe(string $user): string {
    foreach (relire()['visitorAccounts'] ?? [] as $a) {
        if (($a['user'] ?? '') === $user) return (string) ($a['pwd'] ?? '');
    }
    return '';
}

echo "\n\033[1mL'EMPREINTE S256 MIGRE-T-ELLE VERS BCRYPT ?\033[0m\n\n";

$MDP   = 'soleil2026';
$AUTRE = 'nkolo-bassa';

// -- 1. Migration a la premiere authentification reussie ---------------------
echo "\033[1m1. Un compte S256 qui s'authentifie passe en bcrypt\033[0m\n";
poser([
    ['id' => 'va_1', 'user' => 'awa.mbala', 'pwd' => vrt_hash_s256($MDP, 'awa.mbala'), 'statut' => 'actif'],
    ['id' => 'va_2', 'user' => 'nkolo',     'pwd' => vrt_hash_s256($AUTRE, 'nkolo'),   'statut' => 'actif'],
]);
dire("au depart l'empreinte est bien en S256", strpos(pwdDe('awa.mbala'), 'S256$') === 0, pwdDe('awa.mbala'));

$besoin = false;
dire("le mot de passe ouvre le compte",
     vrt_verify_password($MDP, pwdDe('awa.mbala'), 'awa.mbala', $besoin) === true);
dire("et le drapeau de migration est leve", $besoin === true);

dire("la migration s'annonce faite", vrt_upgrade_password_bcrypt('awa.mbala', $MDP) === true);
dire("l'empreinte stockee est desormais bcrypt", strpos(pwdDe('awa.mbala'), '$2y$') === 0, pwdDe('awa.mbala'));

// -- 2. Le compte reste ouvrable --------------------------------------------
echo "\n\033[1m2. Le compte reste ouvrable apres migration\033[0m\n";
$b2 = false;
dire("le meme mot de passe passe encore",
     vrt_verify_password($MDP, pwdDe('awa.mbala'), 'awa.mbala', $b2) === true);
dire("et le drapeau est retombe (plus rien a migrer)", $b2 === false);
$b3 = false;
dire("un mauvais mot de passe est refuse",
     vrt_verify_password('mauvais', pwdDe('awa.mbala'), 'awa.mbala', $b3) === false);

// -- 3. Idempotence ---------------------------------------------------------
echo "\n\033[1m3. Repasser la migration ne change plus rien\033[0m\n";
$avant = pwdDe('awa.mbala');
dire("le second passage s'abstient", vrt_upgrade_password_bcrypt('awa.mbala', $MDP) === false);
dire("et l'empreinte n'a pas bouge", pwdDe('awa.mbala') === $avant);

// -- 4. Un mauvais mot de passe ne migre rien -------------------------------
echo "\n\033[1m4. Un mauvais mot de passe n'ecrase aucune empreinte\033[0m\n";
$empreinteNkolo = pwdDe('nkolo');
dire("la migration refuse un clair qui ne correspond pas",
     vrt_upgrade_password_bcrypt('nkolo', 'pas-le-bon') === false);
dire("l'empreinte de nkolo est intacte", pwdDe('nkolo') === $empreinteNkolo);
$b4 = false;
dire("et son vrai mot de passe l'ouvre toujours",
     vrt_verify_password($AUTRE, pwdDe('nkolo'), 'nkolo', $b4) === true);

// -- 5. Deja en bcrypt ------------------------------------------------------
echo "\n\033[1m5. Un compte deja en bcrypt est laisse tranquille\033[0m\n";
poser([['id' => 'va_3', 'user' => 'deja', 'pwd' => vrt_hash_bcrypt($MDP), 'statut' => 'actif']]);
$avantDeja = pwdDe('deja');
dire("la migration s'abstient", vrt_upgrade_password_bcrypt('deja', $MDP) === false);
dire("l'empreinte est inchangee (pas de re-hachage inutile)", pwdDe('deja') === $avantDeja);

// -- 6. Identifiant inconnu -------------------------------------------------
echo "\n\033[1m6. Un identifiant inconnu ne touche a rien\033[0m\n";
poser([['id' => 'va_4', 'user' => 'awa.mbala', 'pwd' => vrt_hash_s256($MDP, 'awa.mbala'), 'statut' => 'actif']]);
$avantTout = json_encode(relire());
dire("la migration refuse un compte absent", vrt_upgrade_password_bcrypt('fantome', $MDP) === false);
dire("et la base est identique, octet pour octet", json_encode(relire()) === $avantTout);

// -- 7. Les voisins ---------------------------------------------------------
echo "\n\033[1m7. Migrer un compte n'abime pas les autres\033[0m\n";
poser([
    ['id' => 'va_5', 'user' => 'un',    'pwd' => vrt_hash_s256($MDP, 'un'),      'statut' => 'actif', 'nom' => 'UN'],
    ['id' => 'va_6', 'user' => 'deux',  'pwd' => vrt_hash_s256($AUTRE, 'deux'),  'statut' => 'actif', 'nom' => 'DEUX'],
    ['id' => 'va_7', 'user' => 'trois', 'pwd' => vrt_hash_s256($AUTRE, 'trois'), 'statut' => 'actif', 'nom' => 'TROIS'],
]);
$pwdDeux = pwdDe('deux'); $pwdTrois = pwdDe('trois');
vrt_upgrade_password_bcrypt('un', $MDP);
dire("un est migre", strpos(pwdDe('un'), '$2y$') === 0);
dire("deux n'a pas bouge", pwdDe('deux') === $pwdDeux);
dire("trois n'a pas bouge", pwdDe('trois') === $pwdTrois);
$apres = relire();
dire("les trois comptes sont toujours la", count($apres['visitorAccounts'] ?? []) === 3);
dire("et leurs autres champs sont preserves", ($apres['visitorAccounts'][1]['nom'] ?? '') === 'DEUX');
dire("lastModified a ete releve (la synchro admin le verra)",
     (int) ($apres['lastModified'] ?? 0) > 1000);

// -- Restitution de la base d'origine ---------------------------------------
if ($SAUVE !== null) file_put_contents($FICHIER, $SAUVE);

echo "\n" . str_repeat('-', 68) . "\n";
if ($ko === 0) {
    echo "\033[32m\033[1m  OK $ok/$ok controles passes — l'empreinte migre vraiment.\033[0m\n\n";
    exit(0);
}
echo "\033[31m\033[1m  $ko echec(s) sur " . ($ok + $ko) . "\033[0m\n";
foreach ($echecs as $e) echo "     . $e\n";
echo "\n";
exit(1);
