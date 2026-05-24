// ════════════════════════════════════════════════════════════════════
// VÉRITAS — Migration Firebase Auth User-Scoped (v2.0)
// ────────────────────────────────────────────────────────────────────
// Ce fichier est un SCAFFOLDING prêt à intégrer dans VERITAS_v1.2.html
// quand Jacques aura activé Firebase Authentication dans la console.
//
// ÉTAPES POUR JACQUES :
// 1. Aller sur https://console.firebase.google.com → projet existant
// 2. Build → Authentication → Get started
// 3. Activer les méthodes : Email/Password + Anonymous
// 4. Settings → Service accounts → Generate new private key (pour custom claims)
// 5. Récupérer les 3 valeurs ci-dessous et remplacer les TODO
// 6. Coller ce fichier dans le HTML juste après le SDK Firebase
// ════════════════════════════════════════════════════════════════════

// 🔑 CONFIG — À REMPLIR
const FIREBASE_CONFIG = {
  apiKey:            "TODO_FIREBASE_API_KEY",            // → console > Project Settings > Web API Key
  authDomain:        "TODO_PROJECT_ID.firebaseapp.com",
  databaseURL:       "https://TODO_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId:         "TODO_PROJECT_ID",
  storageBucket:     "TODO_PROJECT_ID.appspot.com",
  messagingSenderId: "TODO_SENDER_ID",
  appId:             "TODO_APP_ID"
};

// ════════════════════════════════════════════════════════════════════
// 1. INITIALISATION SDK (à charger via CDN dans <head>)
// ════════════════════════════════════════════════════════════════════
/*
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js"></script>
*/

window.VFB = {
  init: function(){
    if(typeof firebase === 'undefined'){
      console.warn('[VFB] Firebase SDK non chargé — fallback localStorage');
      return false;
    }
    firebase.initializeApp(FIREBASE_CONFIG);
    this.auth = firebase.auth();
    this.db = firebase.database();
    // Persistence locale (reste connecté entre sessions)
    this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    // Listener auth changes
    this.auth.onAuthStateChanged(function(user){
      if(user){
        VFB.currentUser = user;
        VFB.refreshToken();
        console.log('[VFB] Connecté :', user.email||'anonyme');
      } else {
        VFB.currentUser = null;
        console.log('[VFB] Déconnecté');
      }
    });
    return true;
  },

  // ════════════════════════════════════════════════════════════════
  // 2. SIGN UP / LOGIN avec hash bcrypt côté Firebase
  // ════════════════════════════════════════════════════════════════
  signUp: function(email, password, profile){
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(function(cred){
        // Stocker le profil dans Realtime DB
        return VFB.db.ref('users/'+cred.user.uid).set({
          email: email,
          nom: profile.nom||'',
          pre: profile.pre||'',
          cls: profile.cls||'',
          tel: profile.tel||'',
          role: 'visiteur_inscrit',
          createdAt: firebase.database.ServerValue.TIMESTAMP
        }).then(function(){
          return cred.user;
        });
      });
  },

  login: function(email, password){
    return this.auth.signInWithEmailAndPassword(email, password);
  },

  logout: function(){
    return this.auth.signOut();
  },

  // ════════════════════════════════════════════════════════════════
  // 3. TOKEN MANAGEMENT — refresh auto
  // ════════════════════════════════════════════════════════════════
  refreshToken: function(){
    if(!this.currentUser) return Promise.resolve(null);
    return this.currentUser.getIdToken(true).then(function(token){
      VFB.idToken = token;
      // Cache 50 min (token expire à 60 min)
      setTimeout(function(){ VFB.refreshToken(); }, 50*60*1000);
      return token;
    });
  },

  // ════════════════════════════════════════════════════════════════
  // 4. FETCH AUTHENTIFIÉ — remplace _fbFetch et l'ancien token statique
  // ════════════════════════════════════════════════════════════════
  fetch: function(path, options){
    options = options || {};
    options.headers = options.headers || {};
    var doFetch = function(token){
      options.headers['Authorization'] = 'Bearer '+token;
      return fetch(path, options);
    };
    if(this.idToken) return doFetch(this.idToken);
    return this.refreshToken().then(doFetch);
  },

  // ════════════════════════════════════════════════════════════════
  // 5. CUSTOM CLAIMS ADMIN (via Cloud Function — voir setAdmin.js)
  // ════════════════════════════════════════════════════════════════
  isAdmin: function(){
    if(!this.currentUser) return Promise.resolve(false);
    return this.currentUser.getIdTokenResult().then(function(r){
      return r.claims.admin === true;
    });
  }
};

// ════════════════════════════════════════════════════════════════════
// 6. RÈGLES DE SÉCURITÉ FIREBASE REALTIME DB
// ────────────────────────────────────────────────────────────────────
// À coller dans console Firebase > Realtime DB > Rules :
// ════════════════════════════════════════════════════════════════════
/*
{
  "rules": {
    "users": {
      "$uid": {
        ".read":  "$uid === auth.uid || auth.token.admin === true",
        ".write": "$uid === auth.uid || auth.token.admin === true"
      }
    },
    "public": {
      ".read": true,
      ".write": "auth.token.admin === true"
    },
    "admin": {
      ".read":  "auth.token.admin === true",
      ".write": "auth.token.admin === true"
    },
    "centres": {
      "$centreId": {
        ".read":  "auth != null && (auth.token.centreId === $centreId || auth.token.admin === true)",
        ".write": "auth != null && (auth.token.centreId === $centreId || auth.token.admin === true)"
      }
    }
  }
}
*/

// ════════════════════════════════════════════════════════════════════
// 7. MIGRATION DES COMPTES EXISTANTS (script Node à exécuter 1x)
// ────────────────────────────────────────────────────────────────────
// Sauvegarder dans migrate-accounts.js et exécuter :
//   npm install firebase-admin
//   node migrate-accounts.js
// ════════════════════════════════════════════════════════════════════
/*
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://TODO_PROJECT_ID-default-rtdb.firebaseio.com'
});

// Lire l'export VÉRITAS (DB exportée en JSON)
const DB = JSON.parse(fs.readFileSync('./veritas-db-export.json'));

async function migrateAccounts() {
  const accounts = [...(DB.visitorAccounts||[]), ...(DB.studentAccounts||[])];
  let ok = 0, fail = 0;
  for (const acc of accounts) {
    try {
      const user = await admin.auth().createUser({
        email: acc.email || `${acc.user}@veritas.local`,
        password: acc.pwd || 'TempP@ss123!', // forcer reset au 1er login
        displayName: `${acc.pre} ${acc.nom}`,
        disabled: false
      });
      // Custom claim role
      await admin.auth().setCustomUserClaims(user.uid, {
        role: acc.type || 'visiteur_inscrit',
        centreId: 'default'
      });
      // Stocker profil
      await admin.database().ref(`users/${user.uid}`).set({
        nom: acc.nom, pre: acc.pre, cls: acc.cls, tel: acc.tel,
        oldId: acc.id, migratedAt: Date.now()
      });
      ok++;
    } catch(e) {
      console.error('Échec', acc.user, e.message);
      fail++;
    }
  }
  console.log(`✅ ${ok} migrés · ❌ ${fail} échecs`);
}

migrateAccounts().then(() => process.exit(0));
*/

// ════════════════════════════════════════════════════════════════════
// 8. AUTO-INIT au chargement
// ════════════════════════════════════════════════════════════════════
if(typeof window !== 'undefined' && document.readyState !== 'loading'){
  setTimeout(function(){ VFB.init(); }, 500);
} else if(typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', function(){
    setTimeout(function(){ VFB.init(); }, 500);
  });
}
