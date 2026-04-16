# VÉRITAS Academy — Guide de Déploiement Complet

## Table des matières
1. [Comment ça marche (résumé simple)](#1-comment-ça-marche)
2. [Ce qui change pour vous](#2-ce-qui-change-pour-vous)
3. [Choisir un hébergement](#3-choisir-un-hébergement)
4. [Installation pas à pas](#4-installation-pas-à-pas)
5. [Comment les données sont stockées](#5-comment-les-données-sont-stockées)
6. [Comment faire les mises à jour](#6-comment-faire-les-mises-à-jour)
7. [Sauvegardes automatiques](#7-sauvegardes-automatiques)
8. [Sécurité](#8-sécurité)
9. [Coûts mensuels](#9-coûts-mensuels)
10. [FAQ](#10-faq)

---

## 1. Comment ça marche

### Aujourd'hui (version locale)
```
Votre PC → ouvre VERITAS_v1.0.html → données dans le navigateur (localStorage)
                                       ⚠️ Si vous changez de navigateur ou de PC, vous perdez tout
```

### Demain (version en ligne)
```
N'importe quel appareil → Internet → Serveur VÉRITAS → Base de données PostgreSQL
(PC, téléphone, tablette)                                  ✅ Données centralisées
                                                           ✅ Accessibles partout
                                                           ✅ Sauvegardées automatiquement
```

**En résumé** : au lieu de stocker les données dans votre navigateur (qui peut les perdre à tout moment), elles sont stockées dans une vraie base de données sur un serveur sécurisé accessible depuis n'importe quel appareil connecté à Internet.

---

## 2. Ce qui change pour vous

| Aspect | Avant (localStorage) | Après (serveur) |
|--------|---------------------|-----------------|
| **Accès** | 1 seul navigateur, 1 seul PC | Depuis n'importe quel appareil |
| **Données** | Perdues si cache vidé | Sauvegardées 24h/24 sur le serveur |
| **Multi-utilisateur** | Chacun a sa copie isolée | Tout le monde voit les mêmes données |
| **Sécurité** | Mots de passe dans le code source | Mots de passe chiffrés (bcrypt) |
| **Paiements** | Vérification manuelle | Possibilité de vérification automatique |
| **Mises à jour** | Re-télécharger le fichier HTML | Instantané, vous changez 1 fichier sur le serveur |
| **Coût** | Gratuit | ~8 000 FCFA/mois |

---

## 3. Choisir un hébergement

### Option A : VPS (Recommandé) — ~5 000 FCFA/mois

Un VPS (Virtual Private Server) est un petit ordinateur loué dans le cloud. Vous avez le contrôle total.

| Fournisseur | Plan | Prix | Recommandé |
|-------------|------|------|------------|
| **Hetzner** (hetzner.com) | CX22 — 2 vCPU, 4 Go RAM | ~3 000 FCFA/mois | ✅ Meilleur rapport qualité-prix |
| **Contabo** (contabo.com) | VPS S — 4 vCPU, 8 Go RAM | ~4 000 FCFA/mois | ✅ Beaucoup de ressources |
| **OVH** (ovhcloud.com) | Starter — 2 vCPU, 2 Go RAM | ~3 500 FCFA/mois | Bon si vous êtes déjà client |
| **DigitalOcean** (digitalocean.com) | Basic — 1 vCPU, 1 Go RAM | ~3 300 FCFA/mois | Simple d'utilisation |

### Option B : Hébergement mutualisé PHP — ~2 000 FCFA/mois

Moins cher mais plus limité. Nécessiterait de réécrire le backend en PHP.

### Option C : Gratuit (pour tester)

- **Render.com** : plan gratuit avec PostgreSQL (limité à 90 jours)
- **Railway.app** : $5 de crédit gratuit/mois
- **Fly.io** : plan gratuit limité

**Ma recommandation** : commencez avec **Hetzner CX22** (le moins cher des bons VPS) ou testez gratuitement sur **Render.com**.

---

## 4. Installation pas à pas

### Étape 1 : Créer un VPS

1. Allez sur hetzner.com → Cloud → Créer un serveur
2. Choisissez :
   - **Localisation** : Nuremberg ou Helsinki (proches de l'Afrique via câbles sous-marins)
   - **Image** : Ubuntu 22.04
   - **Type** : CX22 (2 vCPU, 4 Go RAM)
   - **SSH Key** : ajoutez votre clé SSH (ou utilisez un mot de passe)
3. Notez l'adresse IP du serveur (ex: `65.108.xxx.xxx`)

### Étape 2 : Se connecter au serveur

```bash
ssh root@65.108.xxx.xxx
```

### Étape 3 : Installer les logiciels nécessaires

```bash
# Mettre à jour le système
apt update && apt upgrade -y

# Installer Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Installer PostgreSQL
apt install -y postgresql postgresql-contrib

# Installer Caddy (serveur web + HTTPS automatique)
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install caddy

# Vérifier les installations
node --version    # v20.x.x
psql --version    # 14 ou 16
caddy version
```

### Étape 4 : Créer la base de données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans PostgreSQL, taper ces commandes :
CREATE DATABASE veritas_db;
CREATE USER veritas_user WITH ENCRYPTED PASSWORD 'VotreMotDePasseIci2026!';
GRANT ALL PRIVILEGES ON DATABASE veritas_db TO veritas_user;
ALTER DATABASE veritas_db OWNER TO veritas_user;
\q
```

### Étape 5 : Déployer l'application

```bash
# Créer un utilisateur dédié
useradd -m -s /bin/bash veritas
su - veritas

# Cloner ou copier les fichiers
mkdir -p /home/veritas/app
cd /home/veritas/app

# Copier les fichiers du dossier veritas-backend/ ici
# (via scp, rsync, git, ou FileZilla)
# Exemple avec scp depuis votre PC :
# scp -r veritas-backend/* root@65.108.xxx.xxx:/home/veritas/app/

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
nano .env
# Remplir : DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, CORS_ORIGIN
```

Dans le fichier `.env`, remplacez :
```
DATABASE_URL=postgresql://veritas_user:VotreMotDePasseIci2026!@localhost:5432/veritas_db
JWT_SECRET=collez_ici_une_longue_chaine_aleatoire
JWT_REFRESH_SECRET=collez_ici_une_autre_chaine_differente
CORS_ORIGIN=https://veritas-academy.cm
NODE_ENV=production
```

Pour générer les clés secrètes :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Exécutez 2 fois, une pour chaque secret
```

### Étape 6 : Initialiser la base et migrer les données

```bash
# Copier votre fichier VERITAS_v1.0.html dans le dossier public/
cp /chemin/vers/VERITAS_v1.0.html public/index.html

# Créer les tables
npm run db:init

# Importer les données depuis le HTML
npm run db:migrate public/index.html
```

### Étape 7 : Lancer le serveur

```bash
# Test rapide
npm start
# Si tout marche → Ctrl+C pour arrêter

# Lancer en permanence avec systemd
exit  # revenir en root
```

Créer le service :
```bash
cat > /etc/systemd/system/veritas.service << 'EOF'
[Unit]
Description=VÉRITAS Academy Backend
After=network.target postgresql.service

[Service]
Type=simple
User=veritas
WorkingDirectory=/home/veritas/app
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

systemctl enable veritas
systemctl start veritas
systemctl status veritas  # Vérifier que c'est "active (running)"
```

### Étape 8 : Configurer HTTPS avec un nom de domaine

```bash
# Configurer Caddy (remplacez veritas-academy.cm par votre domaine)
cat > /etc/caddy/Caddyfile << 'EOF'
veritas-academy.cm {
    reverse_proxy localhost:3000
    encode gzip
}
EOF

systemctl restart caddy
```

**Important** : avant cette étape, vous devez avoir :
1. Acheté un nom de domaine (ex: `veritas-academy.cm` chez un registrar camerounais)
2. Configuré le DNS pour pointer vers l'IP de votre serveur (enregistrement A)

### Étape 9 : Tester

Ouvrez `https://veritas-academy.cm` dans votre navigateur. Vous devriez voir votre application VÉRITAS !

---

## 5. Comment les données sont stockées

### Schéma simplifié

```
┌─────────────────────────────────────────────────────────┐
│                    SERVEUR VPS                          │
│                                                         │
│  ┌──────────────────┐     ┌───────────────────────┐    │
│  │  Node.js (API)    │────▶│  PostgreSQL (BDD)      │    │
│  │  Port 3000        │     │                         │    │
│  │                    │     │  Tables :                │    │
│  │  Reçoit les       │     │  • students (12 élèves) │    │
│  │  requêtes du      │     │  • grades (50 notes)     │    │
│  │  navigateur       │     │  • payments (35 paiem.)  │    │
│  │                    │     │  • teachers (4 profs)    │    │
│  │  Vérifie les      │     │  • absences              │    │
│  │  permissions      │     │  • elearning_contenus    │    │
│  │                    │     │  • ... (30+ tables)      │    │
│  └──────────────────┘     └───────────────────────┘    │
│                                                         │
│  ┌──────────────────┐                                   │
│  │  Caddy (HTTPS)    │  ← Internet ← Navigateurs       │
│  │  Port 443         │                                   │
│  └──────────────────┘                                   │
└─────────────────────────────────────────────────────────┘
```

### Où sont vos données exactement ?

| Donnée | Emplacement | Format |
|--------|------------|--------|
| Élèves, notes, paiements | PostgreSQL → fichiers sur `/var/lib/postgresql/` | Tables relationnelles |
| Fichiers uploadés (photos, PDFs) | `/home/veritas/app/uploads/` | Fichiers binaires |
| Configuration | `/home/veritas/app/.env` | Variables d'environnement |
| Code de l'application | `/home/veritas/app/public/index.html` | Fichier HTML |
| Logs | `/var/log/syslog` + journalctl | Texte |

### Comparaison localStorage vs PostgreSQL

```
AVANT (localStorage) :
  Tout dans 1 seul blob JSON → "VERITAS_DB" → limité à ~5-10 Mo
  Stocké dans le navigateur → disparaît si cache vidé

APRÈS (PostgreSQL) :
  Chaque type de donnée a sa propre table
  Table "students" : 1 ligne = 1 élève, colonnes = nom, prénom, classe...
  Table "grades"   : 1 ligne = 1 note, colonnes = matière, note1, note2, coef...
  Table "payments" : 1 ligne = 1 paiement, colonnes = montant, date, statut...
  → Pas de limite de taille
  → Recherche ultra-rapide (index)
  → Sauvegardé sur disque dur du serveur
```

---

## 6. Comment faire les mises à jour

### Mettre à jour le contenu (notes, élèves, paiements...)

**Méthode 1 : Depuis l'interface web (recommandé)**
- Vous utilisez VÉRITAS normalement depuis votre navigateur
- Chaque modification est enregistrée automatiquement dans PostgreSQL
- Tous les appareils connectés voient les mêmes données en temps réel

**Méthode 2 : Synchronisation depuis le fichier HTML local**
1. Ouvrez votre fichier VERITAS_v1.0.html local
2. Faites vos modifications normalement
3. Dans la console (F12), exécutez :
```javascript
// Envoyer les données locales vers le serveur
fetch('https://veritas-academy.cm/api/sync/upload', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer VOTRE_TOKEN'
  },
  body: JSON.stringify(DB)
}).then(r => r.json()).then(console.log);
```

### Mettre à jour le code (nouvelle version HTML)

```bash
# Se connecter au serveur
ssh root@65.108.xxx.xxx

# Remplacer le fichier HTML
# Option 1 : copier depuis votre PC
scp VERITAS_v2.0.html root@65.108.xxx.xxx:/home/veritas/app/public/index.html

# Option 2 : éditer directement sur le serveur
nano /home/veritas/app/public/index.html

# Redémarrer (seulement si le backend a changé)
systemctl restart veritas
```

**Important** : mettre à jour le fichier HTML ne touche PAS aux données. Vos élèves, notes, paiements restent intacts dans PostgreSQL.

### Mettre à jour la base de données (ajout de tables)

Si une nouvelle version nécessite de nouvelles tables :
```bash
# Se connecter à PostgreSQL
sudo -u postgres psql veritas_db

# Exécuter les nouvelles commandes SQL
ALTER TABLE students ADD COLUMN IF NOT EXISTS email VARCHAR(200);
\q
```

---

## 7. Sauvegardes automatiques

### Configurer les sauvegardes quotidiennes

```bash
# Créer le dossier de sauvegarde
mkdir -p /home/veritas/backups

# Créer le script de sauvegarde
cat > /home/veritas/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M)
BACKUP_DIR=/home/veritas/backups

# Sauvegarder la base PostgreSQL
pg_dump -U veritas_user veritas_db > $BACKUP_DIR/veritas_db_$DATE.sql

# Compresser
gzip $BACKUP_DIR/veritas_db_$DATE.sql

# Garder les 30 derniers jours seulement
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Sauvegarde $DATE terminée"
EOF

chmod +x /home/veritas/backup.sh

# Planifier une sauvegarde chaque nuit à 2h du matin
crontab -e
# Ajouter cette ligne :
0 2 * * * /home/veritas/backup.sh >> /home/veritas/backups/backup.log 2>&1
```

### Restaurer une sauvegarde

```bash
# En cas de problème, restaurer depuis une sauvegarde :
gunzip /home/veritas/backups/veritas_db_20260416_0200.sql.gz
sudo -u postgres psql veritas_db < /home/veritas/backups/veritas_db_20260416_0200.sql
```

### Sauvegardes hors-site (recommandé)

Copiez régulièrement les sauvegardes vers un autre endroit :
```bash
# Vers Google Drive (avec rclone)
apt install rclone
rclone config  # configurer Google Drive
rclone copy /home/veritas/backups remote:VERITAS_Backups

# Ou vers un autre serveur
rsync -avz /home/veritas/backups/ user@autre-serveur:/backups/veritas/
```

---

## 8. Sécurité

### Ce qui est sécurisé avec le backend

| Menace | Avant | Après |
|--------|-------|-------|
| Vol de mots de passe | ⛔ Visibles dans le code source | ✅ Chiffrés avec bcrypt |
| Modification de notes | ⛔ `DB.grades[0].n1 = 20` en console | ✅ Impossible sans token admin |
| Accès non autorisé | ⛔ Contournable en modifiant le HTML | ✅ Vérifié côté serveur |
| Perte de données | ⛔ Si cache vidé = tout perdu | ✅ Sauvegardé dans PostgreSQL |
| Interception réseau | ⛔ Pas de chiffrement en local | ✅ HTTPS (certificat Let's Encrypt) |

### Bonnes pratiques

1. **Changez les mots de passe par défaut** immédiatement après l'installation
2. **Activez le pare-feu** :
   ```bash
   ufw allow 22    # SSH
   ufw allow 80    # HTTP (redirigé vers HTTPS)
   ufw allow 443   # HTTPS
   ufw enable
   ```
3. **Mettez à jour régulièrement** :
   ```bash
   apt update && apt upgrade -y  # chaque semaine
   ```
4. **Surveillez les logs** :
   ```bash
   journalctl -u veritas -f  # voir les logs en direct
   ```

---

## 9. Coûts mensuels

| Poste | Coût mensuel |
|-------|-------------|
| VPS Hetzner CX22 | ~3 000 FCFA |
| Domaine `.cm` | ~3 300 FCFA/mois (40 000 FCFA/an) |
| Stockage S3 (optionnel, 100 Go) | ~2 000 FCFA |
| **Total minimum** | **~6 300 FCFA/mois** |
| **Total avec stockage** | **~8 300 FCFA/mois** |

Frais de paiement (si activés) :
- Orange Money : ~1% par transaction
- MTN MoMo : ~1% par transaction
- Stripe : 2.9% + 0.25€ par transaction

---

## 10. FAQ

### « Est-ce que je perds mes données actuelles ? »
Non. Le script de migration (`npm run db:migrate`) copie toutes vos données du fichier HTML vers PostgreSQL. Vos données restent aussi dans le fichier HTML d'origine.

### « Est-ce que le fichier HTML continue de fonctionner sans Internet ? »
Oui ! Le fichier HTML reste autonome. Vous pouvez toujours l'ouvrir localement. Mais les données seront celles du localStorage local, pas celles du serveur.

### « Plusieurs personnes peuvent utiliser l'application en même temps ? »
Oui, c'est justement l'avantage du backend. Chaque personne se connecte avec son compte et voit les données en temps réel.

### « Comment je mets à jour si j'ajoute de nouveaux élèves ? »
Vous les ajoutez depuis l'interface web connectée au serveur. Ils sont immédiatement enregistrés dans PostgreSQL et visibles par tous.

### « Que se passe-t-il si le serveur tombe en panne ? »
Les sauvegardes automatiques (section 7) vous permettent de restaurer en quelques minutes. Hetzner garantit 99.9% de disponibilité.

### « Puis-je revenir à la version locale si ça ne marche pas ? »
Oui. Téléchargez vos données depuis `/api/sync/download`, et votre fichier HTML fonctionnera comme avant avec le localStorage.

### « Ai-je besoin d'un développeur pour gérer le serveur ? »
Pour l'installation initiale, oui (ou suivez ce guide pas à pas). Ensuite, la gestion quotidienne (ajout d'élèves, notes, paiements) se fait normalement depuis l'interface VÉRITAS que vous connaissez déjà.

---

*Guide rédigé pour Centre VÉRITAS — Yaoundé, Cameroun — Avril 2026*
