/* ============================================================
   VÉRITAS Campus — Configuration de DÉPLOIEMENT
   Éditer ce seul fichier selon le mode d'hébergement choisi.
   Chargé AVANT campus.js sur toutes les pages.
   ============================================================ */
window.CAMPUS_CONFIG = {

  // Mode d'hébergement :
  //   'managed' : hébergé par VÉRITAS Campus — multi-établissements, sous-domaine (ecole.veritas-campus.com)
  //   'self'    : serveur EN LIGNE de l'établissement — mono-établissement (leur domaine, leurs données)
  //   'local'   : serveur LOCAL (PC du proviseur / réseau interne) — mono-établissement, hors-ligne
  mode: 'managed',

  // Base de l'API. '' = même origine (recommandé : le frontend et api/ sont servis ensemble).
  //   Local typique  : 'http://localhost' ou 'http://192.168.1.10' (IP du PC serveur sur le réseau)
  //   Self / managed : '' (même domaine)
  apiBase: '',

  // Établissement imposé (modes 'self' et 'local' mono-établissement) : son slug.
  //   En 'managed', laisser vide → l'établissement est résolu par le sous-domaine.
  fixedTenant: '',

  // Nom affiché tant que la marque de l'établissement n'est pas chargée.
  brandFallback: 'VÉRITAS Campus'
};
