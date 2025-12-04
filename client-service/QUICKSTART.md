# Guide de Démarrage Rapide - Client Service avec Authentification

## 🚀 Démarrage en 5 minutes

### Prérequis

- Java 17 ou supérieur
- Maven 3.8+
- MySQL 8.0+
- Eureka Server (optionnel pour les tests locaux)

### 1. Configuration de la base de données

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE client_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Optionnel: Créer des utilisateurs de test
source src/main/resources/init-test-users.sql
```

### 2. Configuration du fichier application.yml

Vérifiez que les paramètres de connexion MySQL sont corrects :

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/client_db
    username: root
    password: root  # Modifier selon votre configuration
```

### 3. Compiler et démarrer le service

```bash
# Compiler le projet
mvn clean install

# Démarrer le service
mvn spring-boot:run
```

Le service démarre sur **http://localhost:8081**

### 4. Vérifier que le service fonctionne

```bash
# Health check
curl http://localhost:8081/actuator/health

# Documentation Swagger
# Ouvrir dans le navigateur: http://localhost:8081/swagger-ui.html
```

## 🧪 Tests rapides avec cURL

### 1. Enregistrer un nouveau client

```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "Test123!",
    "phone": "+33600000000",
    "address": "123 Test Street",
    "cin": "TEST1234"
  }'
```

**Réponse attendue:** Token JWT + informations du client

### 2. Se connecter

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Copier le `accessToken` de la réponse pour l'utiliser dans les requêtes suivantes**

### 3. Accéder à un endpoint protégé

```bash
# Remplacer YOUR_TOKEN par le token obtenu lors du login
curl -X GET http://localhost:8081/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 Comptes de test pré-configurés

Si vous avez exécuté le script SQL d'initialisation :

| Rôle   | Email                  | Mot de passe | Description           |
|--------|------------------------|--------------|------------------------|
| ADMIN  | admin@willbank.com     | Admin123!    | Administrateur système |
| CLIENT | client@willbank.com    | Client123!   | Client standard        |
| AGENT  | agent@willbank.com     | Agent123!    | Agent bancaire         |

### Test avec compte admin

```bash
# Login admin
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@willbank.com",
    "password": "Admin123!"
  }'
```

## 🔐 Flux d'authentification typique

### 1. Enregistrement initial
```
Client -> POST /api/auth/register -> Service
       <- Access Token + Refresh Token <- Service
```

### 2. Login
```
Client -> POST /api/auth/login -> Service
       <- Access Token + Refresh Token <- Service
```

### 3. Accès aux ressources protégées
```
Client -> GET /api/clients
          Header: Authorization: Bearer {token}
       <- Liste des clients <- Service
```

### 4. Rafraîchissement du token (avant expiration)
```
Client -> POST /api/auth/refresh
          Body: { refreshToken: "..." }
       <- Nouveaux tokens <- Service
```

## 🛠️ Dépannage

### Problème: "Cannot connect to MySQL"

**Solution:**
```bash
# Vérifier que MySQL est démarré
# Windows PowerShell
Get-Service MySQL*

# Vérifier la connexion
mysql -u root -p -e "SELECT 1"
```

### Problème: "Table 'clients' doesn't exist"

**Solution:**
Le mode `ddl-auto: update` devrait créer la table automatiquement.
Si ce n'est pas le cas:
```sql
USE client_db;
SHOW TABLES;
```

Si la table n'existe pas, elle sera créée au premier démarrage du service.

### Problème: "401 Unauthorized" sur endpoints protégés

**Solution:**
- Vérifier que le token JWT est bien présent dans le header `Authorization`
- Vérifier le format: `Bearer {votre_token}`
- Vérifier que le token n'a pas expiré (24h par défaut)

### Problème: "Invalid JWT signature"

**Solution:**
- Vérifier que `jwt.secret` est identique dans toute l'application
- Ne pas modifier `jwt.secret` une fois que des tokens ont été générés

## 📚 Documentation complète

- **Authentication README**: `AUTHENTICATION_README.md` - Guide complet de l'authentification
- **Swagger UI**: http://localhost:8081/swagger-ui.html - Documentation interactive des APIs
- **Postman Collection**: `WillBank_Client_Service.postman_collection.json` - Collection de tests

## 🎯 Prochaines étapes

1. **Intégrer avec API Gateway**: Configurer le routage via Spring Cloud Gateway
2. **Ajouter Eureka**: Enregistrer le service auprès d'Eureka Server
3. **Tests d'intégration**: Créer des tests automatisés
4. **Monitoring**: Configurer des métriques et logs centralisés

## 🔗 Endpoints principaux

| Endpoint                      | Méthode | Auth | Description                    |
|-------------------------------|---------|------|--------------------------------|
| `/api/auth/register`          | POST    | Non  | Enregistrer un nouveau client  |
| `/api/auth/login`             | POST    | Non  | Se connecter                   |
| `/api/auth/refresh`           | POST    | Non  | Rafraîchir le token            |
| `/api/auth/change-password`   | PUT     | Oui  | Changer le mot de passe        |
| `/api/auth/me`                | GET     | Oui  | Obtenir le profil actuel       |
| `/api/clients`                | GET     | Oui  | Liste des clients              |
| `/api/clients/{id}`           | GET     | Oui  | Détails d'un client            |
| `/api/clients`                | POST    | Oui  | Créer un client                |
| `/api/clients/{id}`           | PUT     | Oui  | Modifier un client             |
| `/api/clients/{id}`           | DELETE  | Oui  | Supprimer un client            |

## 💡 Astuces

### Stocker le token dans Postman

Dans les Tests du endpoint Login:
```javascript
var jsonData = pm.response.json();
pm.environment.set("access_token", jsonData.accessToken);
pm.environment.set("refresh_token", jsonData.refreshToken);
```

### Vérifier un token JWT

Aller sur https://jwt.io et coller votre token pour voir son contenu.

### Générer un hash BCrypt pour un mot de passe

```bash
# Utiliser le endpoint register pour générer automatiquement
# Ou utiliser un outil en ligne: https://bcrypt-generator.com/
```

## ✅ Checklist de démarrage

- [ ] MySQL installé et démarré
- [ ] Base de données `client_db` créée
- [ ] Configuration `application.yml` mise à jour
- [ ] Service compilé avec `mvn clean install`
- [ ] Service démarré avec `mvn spring-boot:run`
- [ ] Health check réussi
- [ ] Test d'enregistrement réussi
- [ ] Test de login réussi
- [ ] Accès à un endpoint protégé réussi

## 🆘 Support

Pour toute question ou problème:
1. Vérifier les logs de l'application
2. Consulter la documentation Swagger
3. Vérifier les erreurs dans la console

---

**Bon développement ! 🎉**
