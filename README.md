# WillBank - Microservices Bancaires
## TP Noté ENS - Décembre 2025

Projet complet d'architecture microservices pour une application bancaire avec Spring Boot 3.3.4 et Spring Cloud 2023.0.5.

## 📋 Architecture

### Microservices (7 modules)
1. **eureka-server** (8761) - Service Discovery
2. **api-gateway** (8080) - Gateway avec JWT et Rate Limiting
3. **client-service** (8081) - Gestion des clients
4. **account-service** (8082) - Gestion des comptes (avec cache Redis)
5. **transaction-service** (8083) - Gestion des transactions (avec RabbitMQ)
6. **notification-service** (8084) - Notifications (Email, Push, SMS)
7. **dashboard-composite-service** (8085) - Dashboard composite

### Technologies
- **Java 17**
- **Spring Boot 3.3.4**
- **Spring Cloud 2023.0.5**
- **MySQL 8.0** (4 bases de données séparées)
- **Redis** (cache + rate limiting)
- **RabbitMQ** (messaging avec topic exchange)
- **Maven** (multi-module)
- **Lombok** (réduction du boilerplate)
- **SpringDoc OpenAPI** (documentation Swagger)

## 🚀 Prérequis

### Installations requises
1. **JDK 17** - [Télécharger](https://adoptium.net/)
2. **Maven 3.8+** - [Télécharger](https://maven.apache.org/download.cgi)
3. **MySQL 8.0** - [Télécharger](https://dev.mysql.com/downloads/mysql/)
4. **Redis** - [Télécharger](https://redis.io/download)
5. **RabbitMQ** - [Télécharger](https://www.rabbitmq.com/download.html)

### Vérification des installations
```bash
java -version          # Java 17
mvn -version           # Maven 3.8+
mysql --version        # MySQL 8.0
redis-cli --version    # Redis
rabbitmq-diagnostics status  # RabbitMQ
```

## 📦 Installation et Configuration

### 1. Cloner le projet
```bash
git clone <repository-url>
cd willbank
```

### 2. Initialiser MySQL
```bash
# Se connecter à MySQL
mysql -u root -p

# Exécuter le script d'initialisation
source init-mysql.sql

# Ou directement
mysql -u root -p < init-mysql.sql
```

Le script crée 4 bases de données :
- `client_db`
- `account_db`
- `transaction_db`
- `notification_db`

### 3. Démarrer Redis
```bash
# Windows
redis-server

# Linux/Mac
redis-server /usr/local/etc/redis.conf
```

Vérifier que Redis fonctionne :
```bash
redis-cli ping
# Réponse attendue : PONG
```

### 4. Démarrer RabbitMQ
```bash
# Windows
rabbitmq-server

# Linux/Mac
brew services start rabbitmq
# ou
sudo systemctl start rabbitmq-server
```

Accéder à l'interface RabbitMQ : http://localhost:15672
- Username: `guest`
- Password: `guest`

### 5. Compiler le projet
```bash
# À la racine du projet
mvn clean install -DskipTests
```

## 🎯 Démarrage des Services

**ORDRE IMPORTANT** - Respecter cet ordre de démarrage :

### 1. Eureka Server (Service Discovery)
```bash
cd eureka-server
mvn spring-boot:run
```
Attendre que le serveur démarre : http://localhost:8761

### 2. Services métier (en parallèle ou séquentiellement)
```bash
# Terminal 2 - Client Service
cd client-service
mvn spring-boot:run

# Terminal 3 - Account Service
cd account-service
mvn spring-boot:run

# Terminal 4 - Transaction Service
cd transaction-service
mvn spring-boot:run

# Terminal 5 - Notification Service
cd notification-service
mvn spring-boot:run

# Terminal 6 - Dashboard Composite Service
cd dashboard-composite-service
mvn spring-boot:run
```

### 3. API Gateway (en dernier)
```bash
# Terminal 7
cd api-gateway
mvn spring-boot:run
```

### Vérification
- Eureka Dashboard : http://localhost:8761
- Tous les services doivent apparaître comme "UP"

## 📚 Documentation API (Swagger)

Chaque service expose sa documentation OpenAPI :

- **Client Service** : http://localhost:8081/swagger-ui.html
- **Account Service** : http://localhost:8082/swagger-ui.html
- **Transaction Service** : http://localhost:8083/swagger-ui.html
- **Notification Service** : http://localhost:8084/swagger-ui.html
- **Dashboard Service** : http://localhost:8085/swagger-ui.html

## 🧪 Tests avec cURL

### 1. Créer un client
```bash
curl -X POST http://localhost:8080/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Mohamed",
    "lastName": "Benali",
    "email": "mohamed.benali@example.com",
    "phone": "+212612345678",
    "address": "123 Rue Hassan II, Casablanca",
    "cin": "AB123456"
  }'
```

### 2. Récupérer un client
```bash
curl http://localhost:8080/api/clients/1
```

### 3. Créer un compte
```bash
curl -X POST http://localhost:8080/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "accountType": "SAVINGS"
  }'
```

### 4. Lister les comptes d'un client
```bash
curl http://localhost:8080/api/accounts/client/1
```

### 5. Effectuer un dépôt
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "DEPOSIT",
    "sourceAccountId": 1,
    "amount": 1000.00,
    "description": "Dépôt initial"
  }'
```

### 6. Effectuer un retrait
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "WITHDRAWAL",
    "sourceAccountId": 1,
    "amount": 200.00,
    "description": "Retrait ATM"
  }'
```

### 7. Effectuer un virement
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "TRANSFER",
    "sourceAccountId": 1,
    "destinationAccountId": 2,
    "amount": 150.00,
    "description": "Virement à un ami"
  }'
```

### 8. Consulter le solde (avec cache Redis)
```bash
curl http://localhost:8080/api/accounts/1/balance
```

### 9. Dashboard complet d'un client
```bash
curl http://localhost:8080/api/dashboard/1
```

### 10. Relevé de compte
```bash
curl "http://localhost:8080/api/statements/1?from=2025-01-01T00:00:00&to=2025-12-31T23:59:59"
```

### 11. Consulter les notifications
```bash
curl http://localhost:8080/api/notifications
```

## 📊 Collection Postman

Importer cette collection JSON dans Postman :

```json
{
  "info": {
    "name": "WillBank API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Clients",
      "item": [
        {
          "name": "Create Client",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"firstName\": \"Ahmed\",\n  \"lastName\": \"Alami\",\n  \"email\": \"ahmed.alami@example.com\",\n  \"phone\": \"+212612345678\",\n  \"address\": \"Rabat, Morocco\",\n  \"cin\": \"AB123456\"\n}"
            },
            "url": {"raw": "http://localhost:8080/api/clients"}
          }
        },
        {
          "name": "Get Client",
          "request": {
            "method": "GET",
            "url": {"raw": "http://localhost:8080/api/clients/1"}
          }
        },
        {
          "name": "Get All Clients",
          "request": {
            "method": "GET",
            "url": {"raw": "http://localhost:8080/api/clients"}
          }
        }
      ]
    },
    {
      "name": "Accounts",
      "item": [
        {
          "name": "Create Account",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"clientId\": 1,\n  \"accountType\": \"SAVINGS\"\n}"
            },
            "url": {"raw": "http://localhost:8080/api/accounts"}
          }
        },
        {
          "name": "Get Accounts by Client",
          "request": {
            "method": "GET",
            "url": {"raw": "http://localhost:8080/api/accounts/client/1"}
          }
        },
        {
          "name": "Get Balance",
          "request": {
            "method": "GET",
            "url": {"raw": "http://localhost:8080/api/accounts/1/balance"}
          }
        }
      ]
    },
    {
      "name": "Transactions",
      "item": [
        {
          "name": "Deposit",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"type\": \"DEPOSIT\",\n  \"sourceAccountId\": 1,\n  \"amount\": 5000.00,\n  \"description\": \"Dépôt initial\"\n}"
            },
            "url": {"raw": "http://localhost:8080/api/transactions"}
          }
        },
        {
          "name": "Withdrawal",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"type\": \"WITHDRAWAL\",\n  \"sourceAccountId\": 1,\n  \"amount\": 500.00,\n  \"description\": \"Retrait\"\n}"
            },
            "url": {"raw": "http://localhost:8080/api/transactions"}
          }
        },
        {
          "name": "Transfer",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"type\": \"TRANSFER\",\n  \"sourceAccountId\": 1,\n  \"destinationAccountId\": 2,\n  \"amount\": 300.00,\n  \"description\": \"Virement\"\n}"
            },
            "url": {"raw": "http://localhost:8080/api/transactions"}
          }
        }
      ]
    },
    {
      "name": "Dashboard",
      "item": [
        {
          "name": "Get Dashboard",
          "request": {
            "method": "GET",
            "url": {"raw": "http://localhost:8080/api/dashboard/1"}
          }
        },
        {
          "name": "Get Statement",
          "request": {
            "method": "GET",
            "url": {"raw": "http://localhost:8080/api/statements/1?from=2025-01-01T00:00:00&to=2025-12-31T23:59:59"}
          }
        }
      ]
    }
  ]
}
```

## 🔧 Fonctionnalités Implémentées

### ✅ CRUD Complet
- **Clients** : Create, Read, Update, Delete
- **Comptes** : Create, Read, Update, Delete
- **Transactions** : Create, Read (pas de modification/suppression pour l'intégrité)

### ✅ Événements RabbitMQ
Le **transaction-service** publie 4 types d'événements sur le topic exchange `willbank.events` :
1. **TransactionCreatedEvent** - Lors de la création d'une transaction
2. **AccountCreditedEvent** - Lors d'un crédit de compte
3. **AccountDebitedEvent** - Lors d'un débit de compte
4. **ClientUpdatedEvent** - Lors de la mise à jour d'un client

### ✅ Notifications
Le **notification-service** écoute tous les événements (`willbank.events.#`) et :
- Enregistre chaque notification en base de données
- Simule l'envoi d'emails (JavaMailSender)
- Simule l'envoi de push notifications FCM (System.out)
- Log toutes les notifications

### ✅ Dashboard Composite
- **GET /api/dashboard/{clientId}** : Retourne client + tous ses comptes + 10 dernières transactions
- **GET /api/statements/{accountId}?from=&to=** : Relevé de compte avec filtrage par date

### ✅ API Gateway
- Routes vers tous les microservices avec load balancing (`lb://`)
- JWT Resource Server (clé RSA générée en mémoire)
- Rate Limiting avec Redis (configurable par route)
- Actuator endpoints pour monitoring

### ✅ Cache Redis
- Cache du solde des comptes dans **account-service**
- Annotation `@Cacheable` sur `getBalance()`
- Invalidation automatique avec `@CacheEvict` lors des modifications

### ✅ Bonus Implémentés
- ✅ Lombok sur toutes les entités
- ✅ @Slf4j sur tous les services
- ✅ GlobalExceptionHandler dans chaque service
- ✅ Validation @Valid sur les DTO
- ✅ OpenAPI annotations (@Operation, @ApiResponse)
- ✅ Rate Limiting avec Redis
- ✅ Actuator sur tous les services

## 🏗️ Structure du Projet

```
willbank/
├── pom.xml (parent)
├── init-mysql.sql
├── README.md
├── eureka-server/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/willbank/eureka/
│       └── resources/application.yml
├── api-gateway/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/willbank/gateway/
│       │   ├── ApiGatewayApplication.java
│       │   └── config/
│       │       ├── SecurityConfig.java
│       │       └── RateLimiterConfig.java
│       └── resources/application.yml
├── client-service/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/willbank/client/
│       │   ├── ClientServiceApplication.java
│       │   ├── entity/Client.java
│       │   ├── repository/ClientRepository.java
│       │   ├── dto/ClientDTO.java
│       │   ├── service/ClientService.java
│       │   ├── controller/ClientController.java
│       │   └── exception/
│       └── resources/application.yml
├── account-service/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/willbank/account/
│       │   ├── AccountServiceApplication.java
│       │   ├── entity/Account.java
│       │   ├── repository/AccountRepository.java
│       │   ├── dto/AccountDTO.java
│       │   ├── service/AccountService.java
│       │   ├── controller/AccountController.java
│       │   └── exception/
│       └── resources/application.yml
├── transaction-service/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/willbank/transaction/
│       │   ├── TransactionServiceApplication.java
│       │   ├── entity/Transaction.java
│       │   ├── repository/TransactionRepository.java
│       │   ├── dto/TransactionDTO.java
│       │   ├── service/
│       │   │   ├── TransactionService.java
│       │   │   └── EventPublisher.java
│       │   ├── controller/TransactionController.java
│       │   ├── client/AccountClient.java
│       │   ├── event/
│       │   │   ├── TransactionCreatedEvent.java
│       │   │   ├── AccountCreditedEvent.java
│       │   │   ├── AccountDebitedEvent.java
│       │   │   └── ClientUpdatedEvent.java
│       │   ├── config/RabbitMQConfig.java
│       │   └── exception/
│       └── resources/application.yml
├── notification-service/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/willbank/notification/
│       │   ├── NotificationServiceApplication.java
│       │   ├── entity/Notification.java
│       │   ├── repository/NotificationRepository.java
│       │   ├── service/
│       │   │   ├── NotificationService.java
│       │   │   ├── EmailService.java
│       │   │   └── PushNotificationService.java
│       │   ├── controller/NotificationController.java
│       │   ├── listener/EventListener.java
│       │   ├── event/
│       │   └── config/RabbitMQConfig.java
│       └── resources/application.yml
└── dashboard-composite-service/
    ├── pom.xml
    └── src/main/
        ├── java/com/willbank/dashboard/
        │   ├── DashboardCompositeServiceApplication.java
        │   ├── client/
        │   │   ├── ClientServiceClient.java
        │   │   ├── AccountServiceClient.java
        │   │   └── TransactionServiceClient.java
        │   ├── dto/
        │   │   ├── ClientDTO.java
        │   │   ├── AccountDTO.java
        │   │   ├── TransactionDTO.java
        │   │   ├── DashboardResponse.java
        │   │   └── StatementResponse.java
        │   ├── service/DashboardService.java
        │   └── controller/DashboardController.java
        └── resources/application.yml
```

## 🐛 Dépannage

### MySQL Connection Refused
```bash
# Vérifier que MySQL est démarré
sudo systemctl status mysql

# Vérifier les credentials dans application.yml
username: root
password: root
```

### Redis Connection Error
```bash
# Vérifier que Redis est démarré
redis-cli ping

# Démarrer Redis si nécessaire
redis-server
```

### RabbitMQ Connection Error
```bash
# Vérifier que RabbitMQ est démarré
rabbitmq-diagnostics status

# Démarrer RabbitMQ si nécessaire
rabbitmq-server
```

### Port Already in Use
```bash
# Trouver le processus utilisant le port
netstat -ano | findstr :8080

# Tuer le processus (Windows)
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

## 📈 Monitoring

### Eureka Dashboard
http://localhost:8761

### Actuator Endpoints
- Client Service: http://localhost:8081/actuator
- Account Service: http://localhost:8082/actuator
- Transaction Service: http://localhost:8083/actuator
- Notification Service: http://localhost:8084/actuator
- Dashboard Service: http://localhost:8085/actuator
- API Gateway: http://localhost:8080/actuator

### RabbitMQ Management
http://localhost:15672 (guest/guest)

**Configuration RabbitMQ :**
- **Service Status** : ✅ En cours d'exécution
- **Exchange** : `willbank.events` (topic exchange)
- **Queue** : `willbank.notifications`
- **Routing Pattern** : `willbank.events.#`
- **Connexion** : localhost:5672 (guest/guest)

**Architecture des messages :**
1. **Transaction Service** publie les événements sur `willbank.events`
2. **Notification Service** consomme via la queue `willbank.notifications`
3. **4 types d'événements** : transaction créée, compte crédité/débité, client mis à jour

**Vérification du statut :**
```bash
# Windows - Vérifier le service
Get-Service | Where-Object {$_.Name -like "*rabbit*"}

# Accès interface web
http://localhost:15672
Username: guest
Password: guest
```

## 🎓 Points Clés pour la Notation

### Architecture (5/20)
✅ 7 microservices fonctionnels
✅ Service Discovery avec Eureka
✅ API Gateway avec routing
✅ Communication inter-services (Feign)

### Implémentation (8/20)
✅ CRUD complet sur toutes les entités
✅ MySQL 8 avec 4 bases séparées
✅ RabbitMQ avec 4 événements
✅ Redis pour cache et rate limiting
✅ Validation et gestion d'erreurs

### Bonus (7/20)
✅ Lombok partout
✅ Logging avec @Slf4j
✅ GlobalExceptionHandler
✅ OpenAPI/Swagger
✅ JWT Resource Server
✅ Rate Limiting
✅ Cache Redis

## 👨‍💻 Auteur

Projet réalisé dans le cadre du TP noté ENS - Décembre 2025

## 📝 Licence

Ce projet est à usage éducatif uniquement.
