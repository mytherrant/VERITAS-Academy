<#
  tools/reset_appareils_livret.ps1
  Remet a zero les appareils enregistres pour un code de cahier VERITAS.

  A QUOI CA SERT — un code ouvre 3 appareils au maximum (2 pour un enseignant),
  et une seule session a la fois. Quand un client change de telephone, ou quand
  un test a consomme un emplacement, ce script lui rend ses trois places. Le
  client devra ressaisir son code une fois : c'est normal, la session est reprise
  a zero elle aussi.

  L'IDENTIFIANT VA EN MINUSCULES. Le filigrane imprime sur la page l'affiche en
  MAJUSCULES (« 9D0E7A50429A »), mais la cle du registre est un HMAC hexadecimal
  minuscule et la comparaison est stricte : en majuscules, le serveur repond
  « 404 Code inconnu » alors que le code existe. Le script s'en charge.

  LE SECRET EST CELUI DU SERVEUR. `API_SECRET` dans api/payment_config.php, sur
  l'hebergement — pas forcement celui de la copie locale, qui peut avoir ete
  rotatee (elle repond alors 401).

  USAGE
    .\tools\reset_appareils_livret.ps1
    .\tools\reset_appareils_livret.ps1 -Id 9d0e7a50429a
#>
param(
  [string] $Id = '9d0e7a50429a',
  [string] $Url = 'https://veritas-school.com/api/livret.php'
)

$ErrorActionPreference = 'Stop'

$Id = $Id.Trim().ToLower()
if ($Id -notmatch '^[0-9a-f]{12}$') {
  Write-Host "Identifiant invalide : '$Id'" -ForegroundColor Red
  Write-Host "Attendu : 12 caracteres hexadecimaux, ceux du filigrane (en minuscules)."
  exit 1
}

Write-Host ""
Write-Host "Reinitialisation des appareils du code $Id" -ForegroundColor Cyan
Write-Host "Cible : $Url"
Write-Host ""
Write-Host "Collez la valeur de API_SECRET lue dans api/payment_config.php SUR LE SERVEUR."
Write-Host "(la saisie reste masquee)"
$sec = Read-Host -Prompt 'API_SECRET' -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
try {
  $clair = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
} finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
}

if ([string]::IsNullOrWhiteSpace($clair)) {
  Write-Host "Aucun secret saisi — rien n'a ete envoye." -ForegroundColor Yellow
  exit 1
}

$body = '{"action":"admin_reset_devices","id":"' + $Id + '"}'

try {
  $r = Invoke-RestMethod -Uri $Url -Method Post -ContentType 'application/json' `
        -Headers @{ Authorization = "Bearer $clair" } -Body $body -TimeoutSec 45
  if ($r.ok) {
    Write-Host ""
    Write-Host "OK — les appareils de $Id sont remis a zero." -ForegroundColor Green
    Write-Host "Le client rouvre veritas-school.com/livrets/6e.html et ressaisit son code."
  } else {
    Write-Host ""
    Write-Host "Refus du serveur : $($r.error)" -ForegroundColor Yellow
  }
} catch {
  $code = $null
  if ($_.Exception.Response) { $code = $_.Exception.Response.StatusCode.value__ }
  Write-Host ""
  switch ($code) {
    401 { Write-Host "HTTP 401 — secret refuse. Relisez API_SECRET sur le SERVEUR : celui de la copie locale a pu etre rotate." -ForegroundColor Red }
    403 { Write-Host "HTTP 403 — ce n'est probablement PAS la cle, mais le mur anti-DDoS de LWS. Attendez une minute et recommencez." -ForegroundColor Red }
    404 { Write-Host "HTTP 404 — code inconnu. Verifiez l'identifiant (12 caracteres, minuscules)." -ForegroundColor Red }
    default { Write-Host "Echec : $($_.Exception.Message)" -ForegroundColor Red }
  }
  exit 1
}
