# 🚀 Guide de Démarrage Rapide - WillBank

## 📋 Prérequis

- Java 17+
- Node.js 18+
- MySQL 8.0+
- Android Studio (pour l'émulateur Android) ou Xcode (pour iOS)
- Expo CLI: `npm install -g expo-cli`

## 🔧 Configuration Initiale

### 1. Base de Données MySQL

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE willbank_db;

# Initialiser les tables
mysql -u root -p willbank_db < init-mysql.sql

# Si besoin de migration IBAN
mysql -u root -p willbank_db < migration-add-iban.sql
```

### 2. Backend - Microservices Spring Boot

#### Option 1: Démarrage Automatique (Recommandé)

**Windows:**
```bash
start-all.bat
```

**Linux/Mac:**
```bash
chmod +x start-all.sh
./start-all.sh
```

#### Option 2: Démarrage Manuel

```bash
# 1. Eureka Server (port 8761)
cd eureka-server
mvn spring-boot:run

# 2. API Gateway (port 8080)
cd api-gateway
mvn spring-boot:run

# 3. Client Service (port 8081)
cd client-service
mvn spring-boot:run

# 4. Account Service (port 8082)
cd account-service
mvn spring-boot:run

# 5. Transaction Service (port 8083)
cd transaction-service
mvn spring-boot:run

# 6. Notification Service (port 8084)
cd notification-service
mvn spring-boot:run

# 7. Dashboard Composite Service (port 8085)
cd dashboard-composite-service
mvn spring-boot:run
```

**⏱️ Attendre 2-3 minutes** que tous les services s'enregistrent auprès d'Eureka.

### 3. Application Mobile (React Native + Expo)

```bash
# Aller dans le dossier MobileBank
cd MobileBank

# Installer les dépendances
npm install

# Démarrer Expo
npm start
# ou
expo start

# Puis:
# - Appuyer sur 'a' pour ouvrir dans Android Emulator
# - Appuyer sur 'i' pour ouvrir dans iOS Simulator
# - Scanner le QR code avec l'app Expo Go sur votre téléphone
```

#### Configuration de l'URL API

Le fichier `MobileBank/services/api.ts` est déjà configuré:
- **Android Emulator:** `http://10.0.2.2:8080` (par défaut)
- **iOS Simulator:** Modifier en `http://localhost:8080`
- **Appareil physique:** Utiliser l'IP de votre machine (ex: `http://192.168.1.100:8080`)

### 4. Frontend Web (Angular)

```bash
# Aller dans le dossier frontend-web
cd frontend-web

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
# ou
ng serve

# Ouvrir http://localhost:4200 dans votre navigateur
```

## 🔐 Premiers Pas

### 1. Admin par Défaut

Au premier démarrage du **client-service**, un administrateur est créé automatiquement:

```
Email: admin@willbank.com
Mot de passe: ADMIN1234
```

### 2. Créer un Compte Client

#### Via l'App Mobile:
1. Ouvrir l'app mobile
2. Cliquer sur "S'inscrire"
3. Remplir le formulaire
4. Se connecter avec les nouveaux identifiants

#### Via le Frontend Web:
1. Ouvrir http://localhost:4200
2. Cliquer sur "Inscription"
3. Remplir le formulaire
4. Se connecter

#### Via Postman:
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "Password123!",
  "phone": "+33123456789",
  "address": "123 Rue de Paris, 75001 Paris",
  "cin": "AB123456"
}
```

### 3. Se Connecter

#### App Mobile:
```
Email: admin@willbank.com
Password: ADMIN1234
```

#### Frontend Web:
```
Email: admin@willbank.com
Password: ADMIN1234
```

## 🧪 Vérification des Services

### 1. Eureka Dashboard
```
http://localhost:8761
```
Vérifier que tous les services sont enregistrés (couleur verte).

### 2. API Gateway
```
http://localhost:8080/actuator/health
```
Devrait retourner: `{"status":"UP"}`

### 3. Swagger UI (Documentation API)
```
http://localhost:8080/swagger-ui.html
```

### 4. Tester les Endpoints

**Connexion:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@willbank.com","password":"ADMIN1234"}'
```

**Récupérer le profil:**
```bash
curl -X GET http://localhost:8080/api/clients/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Récupérer les comptes:**
```bash
curl -X GET http://localhost:8080/api/accounts/client/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📱 Fonctionnalités Disponibles

### App Mobile
- ✅ Connexion / Inscription
- ✅ Dashboard avec solde total
- ✅ Liste des comptes bancaires
- ✅ Transactions récentes
- ✅ Statistiques (revenus/dépenses)
- ✅ Notifications
- ✅ Virement bancaire
- ✅ Profil utilisateur
- ✅ Thème sombre/clair

### Frontend Web
- ✅ Connexion / Inscription
- ✅ Dashboard administrateur
- ✅ Gestion des clients
- ✅ Gestion des comptes
- ✅ Gestion des transactions
- ✅ Notifications système
- ✅ Thème sombre/clair

## 🐛 Dépannage

### Problème: Services ne démarrent pas

**Solution:**
```bash
# Vérifier que MySQL est lancé
mysql -u root -p -e "SHOW DATABASES;"

# Vérifier les ports disponibles
netstat -an | findstr "8080 8081 8082 8083 8084 8085 8761"

# Rebuild les projets
cd client-service
mvn clean install
```

### Problème: App mobile ne se connecte pas au backend

**Solution:**
1. Vérifier que le backend est bien lancé
2. Pour Android Emulator, utiliser `10.0.2.2:8080`
3. Pour appareil physique, utiliser l'IP de votre machine
4. Vérifier le firewall

**Obtenir votre IP:**
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

### Problème: Erreur 401 Unauthorized

**Solution:**
- Le token JWT a expiré (24h de validité)
- Se reconnecter pour obtenir un nouveau token

### Problème: "Cannot find module 'react'" dans MobileBank

**Solution:**
```bash
cd MobileBank
rm -rf node_modules package-lock.json
npm install
```

### Problème: Base de données vide

**Solution:**
```bash
# Réinitialiser la BDD
mysql -u root -p willbank_db < init-mysql.sql

# Redémarrer le client-service pour créer l'admin
cd client-service
mvn spring-boot:run
```

## 📊 Ports Utilisés

| Service | Port | URL |
|---------|------|-----|
| Eureka Server | 8761 | http://localhost:8761 |
| API Gateway | 8080 | http://localhost:8080 |
| Client Service | 8081 | http://localhost:8081 |
| Account Service | 8082 | http://localhost:8082 |
| Transaction Service | 8083 | http://localhost:8083 |
| Notification Service | 8084 | http://localhost:8084 |
| Dashboard Service | 8085 | http://localhost:8085 |
| Frontend Web | 4200 | http://localhost:4200 |
| MySQL | 3306 | localhost:3306 |

## 📚 Documentation Complète

- [README Principal](./README.md)
- [Résumé d'Intégration](./INTEGRATION_SUMMARY.md)
- [Guide d'Installation](./INSTALLATION_GUIDE.md)
- [Guide de Test](./TESTING_GUIDE.md)
- [Collection Postman](./POSTMAN_COLLECTION.json)

## 🎯 Prochaines Étapes

1. ✅ Créer votre premier compte client
2. ✅ Créer un compte bancaire
3. ✅ Effectuer une transaction
4. ✅ Consulter le dashboard
5. ✅ Tester les notifications
6. ✅ Explorer l'API avec Swagger

## 💡 Conseils

- **Développement:** Utilisez les données mockées en mode dev pour tester rapidement
- **Production:** Configurez les variables d'environnement dans `application.properties`
- **Sécurité:** Changez les mots de passe par défaut en production
- **Performance:** Activez Redis pour le cache des comptes
- **Monitoring:** Utilisez Actuator endpoints pour surveiller les services

## 🆘 Support

En cas de problème:
1. Vérifier les logs des microservices
2. Consulter Eureka Dashboard pour l'état des services
3. Tester les endpoints avec Postman
4. Consulter la documentation Swagger

---

**Bonne chance! 🚀**
