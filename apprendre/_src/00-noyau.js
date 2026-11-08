/* VÉRITAS — Apprendre : registre des leçons rédigées (fichier généré : ne pas éditer lecons.js à la main,
   éditer apprendre/_src/*.js puis reconstruire avec tools/build_apprendre.sh). */
window.VRT_LECONS = {};
function VRT_L(id, o) { o.ordre = Object.keys(window.VRT_LECONS).length; window.VRT_LECONS[id] = o; }
/* Animation / schéma manipulable rattaché à la partie i d'une leçon. fn(el) dessine dans el. */
function VRT_A(id, i, titre, fn) { var L = window.VRT_LECONS[id]; if (L && L.parties[i]) { L.parties[i].anim = fn; L.parties[i].animT = titre; } }
