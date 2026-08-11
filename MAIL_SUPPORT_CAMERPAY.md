# Mail au support CamerPay

> **À vérifier avant d'envoyer :**
> 1. La ligne « j'ai régénéré mon jeton API après la validation » doit être **vraie**. Si tu ne l'as
>    pas encore fait, fais-le d'abord — le support répondra « régénérez votre jeton » sinon, et tu
>    auras perdu 24 h.
> 2. Remplace les trois références de transaction si tu en as de plus récentes.
> 3. N'ajoute **jamais** ton jeton API ni ton secret HMAC dans ce message, même tronqués.
>
> **Destinataire** : le support depuis `camerpay.biz/client` (le canal interne rattache
> automatiquement ton compte marchand). À défaut, l'adresse de contact de leur site.

---

**Objet :** Compte vérifié KYC-2 mais l'API renvoie toujours des transactions sandbox — VERITAS EDUCATION SARL

---

Bonjour,

Mon compte marchand **VERITAS EDUCATION SARL** (RCCM CM-DLA-03-2026-B12-00729) est validé au
niveau **KYC-2 Renforcé**, et le badge « Vérifié » est bien actif sur mon tableau de bord.

Pourtant, **toutes mes transactions restent en mode test** : `POST /api/payment/initiate` me renvoie
systématiquement une `pay_url` pointant vers `https://camerpay.biz/sandbox/simulate/...`, et la page
qui s'ouvre affiche « MODE TEST (SANDBOX) — aucun débit réel n'est effectué ».

Transactions concernées (toutes de 100 XAF, méthode `orange_money`, numéro 697637739) :

- `b5dedb23-9b91-4b0c-9bcb-35f3a7f8b1b9`
- `62aa7486-d549-4db7-b31b-ded118a15b24`
- `a8ecc37e-ec7e-47ff-9b03-0c0216e9a60e`

**J'ai régénéré mon jeton API après la validation du KYC**, et le comportement est identique.

## Ce que j'ai déjà vérifié de mon côté

Afin de vous éviter les vérifications d'usage, voici l'état de mon intégration :

- **Payload d'initiation** conforme à l'exemple de votre tableau de bord : `amount` (entier),
  `currency: "XAF"`, `payment_method: "orange_money"`, `customer_phone`, `merchant_invoice_id`,
  `merchant_callback_url`, `merchant_return_url`.
- **Le jeton est bien pris en compte** : l'appel est authentifié, la transaction est créée
  (201/200), l'UUID revient, et votre page affiche correctement mon montant et mon numéro. Ce n'est
  donc pas un problème d'authentification.
- **URL de rappel** déclarée : `https://veritas-school.com/api/payment_camerpay.php?action=notify`
  (elle répond, en HTTPS, sans redirection).
- **Vérification de signature HMAC-SHA256** conforme à votre documentation : mon implémentation
  reproduit exactement votre vecteur de test officiel — secret `test_secret_key_123` sur la chaîne
  `5add2319-f71b-4f2d-a4f4-97fe0d11c1d4|FACT-001|completed|10000.00` donne bien
  `feab3068de64a00e07ecddc6990570a621eb3d725f9efb728b6a9ca2e455bc37`. Je signe la chaîne reçue
  telle quelle, sans reformater le montant.

## Mes questions

1. **Existe-t-il un interrupteur « mode test / mode production » sur le compte marchand ?** Si oui,
   où se trouve-t-il ? Je ne l'ai pas trouvé sur `camerpay.biz/client`.
2. **Le jeton généré avant la validation du KYC reste-t-il un jeton sandbox ?** Autrement dit,
   faut-il impérativement en générer un nouveau *après* l'approbation — et le mien, régénéré depuis,
   devrait-il déjà être un jeton de production ?
3. **Une activation manuelle de votre côté est-elle nécessaire** après l'approbation du KYC pour
   ouvrir l'encaissement réel ? Si oui, quel est le délai habituel ?
4. **Mon journal de webhooks indique un échec de notification.** Pouvez-vous me communiquer le
   **code HTTP** que mon serveur a renvoyé pour cette tentative ? Cela me permettra de distinguer un
   refus de signature (401) d'une référence inconnue (404). Par ailleurs, le **secret HMAC est-il
   différent entre le sandbox et la production ?** Si oui, je dois reporter le nouveau au moment de
   la bascule.

Mon abonnement est le plan **Entreprise**. Je suis en phase de lancement commercial et cette
activation conditionne ma mise en service : tout élément qui accélérerait le traitement me serait
très utile.

Je reste disponible pour tout complément — journaux applicatifs, capture de la requête d'initiation,
ou test en direct sur une transaction de votre choix.

Cordialement,

**TAKOU SOH Jacques Miterand**
VERITAS EDUCATION SARL — Ndogpassi 14e, Douala
https://www.veritas-school.com
