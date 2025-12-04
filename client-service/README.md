# 🏦 WillBank - Client Service avec Authentification JWT

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-Enabled-red.svg)](https://jwt.io/)

Microservice de gestion des clients pour WillBank avec système d'authentification et d'autorisation complet basé sur JWT (JSON Web Tokens).

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Démarrage rapide](#démarrage-rapide)
- [Documentation](#documentation)
- [Technologies](#technologies)
- [Configuration](#configuration)
- [Tests](#tests)
- [Contribution](#contribution)

## 🎯 Aperçu

Le **Client Service** est le microservice responsable de la gestion des clients et de l'authentification dans l'architecture microservices de WillBank. Il fournit des APIs RESTful sécurisées pour:

- ✅ Enregistrement et authentification des clients
- ✅ Gestion des profils clients (CRUD)
- ✅ Génération et validation de tokens JWT
- ✅ Gestion des rôles et permissions
- ✅ Sécurisation des endpoints avec Spring Security

## 🚀 Fonctionnalités

### Authentification & Autorisation

- **Enregistrement de clients** avec validation des données
- **Connexion sécurisée** avec email et mot de passe
- **Tokens JWT** (Access Token + Refresh Token)
- **Rafraîchissement automatique** des tokens
- **Changement de mot de passe** sécurisé
- **Gestion des rôles** : CLIENT, ADMIN, AGENT
- **Statuts de compte** : ACTIVE, BLOCKED, PENDING, SUSPENDED

### Gestion des clients

- **CRUD complet** des informations clients
- **Recherche par ID, email, téléphone**
- **Validation KYC simplifiée** (nom, prénom, CIN, adresse)
- **Index optimisés** pour les recherches

### Sécurité

- **Hachage BCrypt** des mots de passe
- **Validation JWT** sur tous les endpoints protégés
- **CORS configuré** pour Angular et React
- **Protection contre** les attaques courantes
- **Session stateless** (pas de cookies)

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│          API Layer                      │
│  AuthController | ClientController      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Security Filter Chain              │
│  JwtAuthenticationFilter | SecurityConfig│
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Service Layer                   │
│  AuthService | ClientService            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Repository Layer                   │
│  ClientRepository (Spring Data JPA)     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        MySQL Database                   │
│          client_db                      │
└─────────────────────────────────────────┘
```

Pour plus de détails, consultez [ARCHITECTURE.md](ARCHITECTURE.md)

## ⚡ Démarrage rapide

### Prérequis

- Java 17+
- Maven 3.8+
- MySQL 8.0+

### Installation en 3 étapes

```bash
# 1. Créer la base de données
mysql -u root -p -e "CREATE DATABASE client_db"

# 2. Compiler le projet
mvn clean install

# 3. Démarrer le service
mvn spring-boot:run
```

Le service sera accessible sur **http://localhost:8081**

### Test rapide

```bash
# Enregistrer un client
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "password": "Password123!",
    "phone": "+33612345678",
    "address": "123 Rue de Paris",
    "cin": "AB123456"
  }'

# Se connecter
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@example.com",
    "password": "Password123!"
  }'
```

Pour un guide complet, consultez [QUICKSTART.md](QUICKSTART.md)

## 📚 Documentation

### Guides

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](QUICKSTART.md) | Guide de démarrage en 5 minutes |
| [AUTHENTICATION_README.md](AUTHENTICATION_README.md) | Documentation complète de l'authentification |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Architecture détaillée du système |

### Documentation interactive

- **Swagger UI**: http://localhost:8081/swagger-ui.html
- **API Docs**: http://localhost:8081/api-docs
- **Health Check**: http://localhost:8081/actuator/health

### Collection Postman

Importez la collection pré-configurée : [WillBank_Client_Service.postman_collection.json](WillBank_Client_Service.postman_collection.json)

## 🛠️ Technologies

### Backend

- **Spring Boot 3.x** - Framework principal
- **Spring Security** - Sécurité et authentification
- **Spring Data JPA** - Couche de persistance
- **Spring Cloud Netflix Eureka** - Service discovery
- **JWT (jjwt 0.12.3)** - Gestion des tokens
- **MySQL 8.0** - Base de données
- **Lombok** - Réduction du code boilerplate
- **SpringDoc OpenAPI** - Documentation Swagger

### Sécurité

- **BCrypt** - Hachage des mots de passe
- **HMAC-SHA256** - Signature des tokens JWT
- **CORS** - Gestion des origines croisées

## ⚙️ Configuration

### application.yml

```yaml
server:
  port: 8081

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/client_db
    username: root
    password: root

jwt:
  secret: [YOUR_SECRET_KEY]
  expiration: 86400000        # 24 heures
  refresh-expiration: 604800000  # 7 jours
```

### Variables d'environnement

```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=client_db
DB_USER=root
DB_PASSWORD=root
JWT_SECRET=your-secret-key
```

## 🔗 Endpoints principaux

### Authentification (Public)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Enregistrer un nouveau client |
| POST | `/api/auth/login` | Se connecter |
| POST | `/api/auth/refresh` | Rafraîchir le token |

### Gestion des clients (Protégé)

| Méthode | Endpoint | Rôle requis | Description |
|---------|----------|-------------|-------------|
| GET | `/api/clients` | CLIENT, AGENT, ADMIN | Liste des clients |
| GET | `/api/clients/{id}` | CLIENT, AGENT, ADMIN | Détails d'un client |
| POST | `/api/clients` | AGENT, ADMIN | Créer un client |
| PUT | `/api/clients/{id}` | AGENT, ADMIN | Modifier un client |
| DELETE | `/api/clients/{id}` | ADMIN | Supprimer un client |

### Profil (Protégé)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/auth/me` | Profil de l'utilisateur connecté |
| PUT | `/api/auth/change-password` | Changer le mot de passe |

## 🧪 Tests

### Comptes de test

Exécutez le script SQL pour créer des comptes de test:

```bash
mysql -u root -p client_db < src/main/resources/init-test-users.sql
```

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@willbank.com | Admin123! | ADMIN |
| agent@willbank.com | Agent123! | AGENT |
| client@willbank.com | Client123! | CLIENT |

### Tests avec Postman

1. Importer la collection `WillBank_Client_Service.postman_collection.json`
2. Configurer l'environnement:
   - `base_url`: `http://localhost:8081`
3. Exécuter le dossier "Authentication" pour tester l'authentification
4. Les tokens seront automatiquement sauvegardés

### Tests avec cURL

Voir [AUTHENTICATION_README.md](AUTHENTICATION_README.md) pour des exemples complets.

## 📊 Structure de la base de données

### Table: clients

```sql
CREATE TABLE clients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    cin VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    last_login DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_email (email),
    INDEX idx_phone (phone)
);
```

## 🔐 Sécurité

### Règles de mot de passe

- Minimum 8 caractères
- Au moins une majuscule
- Au moins une minuscule
- Au moins un chiffre
- Au moins un caractère spécial (@$!%*?&)

### Exemple de mot de passe valide

✅ `Password123!`
✅ `MySecure@Pass1`
❌ `password` (trop simple)
❌ `12345678` (pas de lettres)

## 🌐 Intégration avec l'écosystème WillBank

Ce service fait partie de l'architecture microservices WillBank et s'intègre avec:

- **API Gateway** - Point d'entrée unique (à venir)
- **Eureka Server** - Service discovery
- **Account Service** - Gestion des comptes bancaires
- **Transaction Service** - Gestion des transactions
- **Notification Service** - Notifications push/email

## 🤝 Contribution

Ce projet fait partie du TP #1 d'Architecture Microservices pour WillBank.

### Standards de code

- **Java Code Style**: Google Java Style Guide
- **Commits**: Conventional Commits
- **Branches**: feature/*, bugfix/*, hotfix/*

## 📝 Licence

Ce projet est développé dans le cadre académique pour WillBank.

## 👥 Équipe

Développé par l'équipe WillBank Development Team dans le cadre du cours d'Architecture Microservices.

## 📞 Support

Pour toute question ou problème:

1. Consulter la [documentation complète](AUTHENTICATION_README.md)
2. Vérifier les [issues GitHub](#)
3. Consulter la [documentation Swagger](http://localhost:8081/swagger-ui.html)

## 🎯 Roadmap

- [x] Authentification JWT
- [x] Gestion des rôles
- [x] CRUD clients
- [x] Documentation complète
- [ ] Intégration API Gateway
- [ ] Révocation de tokens
- [ ] Multi-factor authentication
- [ ] OAuth2 / OpenID Connect
- [ ] Rate limiting
- [ ] Audit logging

## 📈 Statut du projet

🟢 **En développement actif** - Version 1.0.0

---

**Made with ❤️ by WillBank Development Team**

**Date:** Décembre 2025
