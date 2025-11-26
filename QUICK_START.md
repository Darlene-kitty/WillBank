# 🚀 Guide de Démarrage Rapide - WillBank

## Étape 1 : Vérifier les Prérequis

```bash
# Vérifier Java 17
java -version

# Vérifier Maven
mvn -version

# Vérifier MySQL
mysql --version

# Vérifier Redis
redis-cli --version

# Vérifier RabbitMQ
rabbitmq-diagnostics status
```

## Étape 2 : Démarrer les Services Externes

### MySQL
```bash
# Windows
net start MySQL80

# Linux/Mac
sudo systemctl start mysql
# ou
brew services start mysql
```

### Redis
```bash
# Windows
redis-server

# Linux/Mac
redis-server
# ou
brew services start redis
```

### RabbitMQ
```bash
# Windows
rabbitmq-server

# Linux/Mac
rabbitmq-server
# ou
brew services start rabbitmq
```

## Étape 3 : Initialiser MySQL

```bash
mysql -u root -p < init-mysql.sql
```

Ou manuellement :
```sql
CREATE DATABASE client_db;
CREATE DATABASE account_db;
CREATE DATABASE transaction_db;
CREATE DATABASE notification_db;
```

## Étape 4 : Compiler le Projet

```bash
mvn clean install -DskipTests
```

## Étape 5 : Démarrer les Microservices

### Option A : Script Automatique (Windows)
```bash
start-all.bat
```

### Option B : Script Automatique (Linux/Mac)
```bash
./start-all.sh
```

### Option C : Démarrage Manuel

**Terminal 1 - Eureka Server**
```bash
cd eureka-server
mvn spring-boot:run
```
Attendre 30 secondes, puis vérifier : http://localhost:8761

**Terminal 2 - Client Service**
```bash
cd client-service
mvn spring-boot:run
```

**Terminal 3 - Account Service**
```bash
cd account-service
mvn spring-boot:run
```

**Terminal 4 - Transaction Service**
```bash
cd transaction-service
mvn spring-boot:run
```

**Terminal 5 - Notification Service**
```bash
cd notification-service
mvn spring-boot:run
```

**Terminal 6 - Dashboard Service**
```bash
cd dashboard-composite-service
mvn spring-boot:run
```

**Terminal 7 - API Gateway**
```bash
cd api-gateway
mvn spring-boot:run
```

## Étape 6 : Vérifier le Démarrage

### Eureka Dashboard
Ouvrir : http://localhost:8761

Vous devez voir 6 services enregistrés :
- CLIENT-SERVICE
- ACCOUNT-SERVICE
- TRANSACTION-SERVICE
- NOTIFICATION-SERVICE
- DASHBOARD-COMPOSITE-SERVICE
- API-GATEWAY

### Health Checks
```bash
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
curl http://localhost:8083/actuator/health
curl http://localhost:8084/actuator/health
curl http://localhost:8085/actuator/health
```

## Étape 7 : Test Rapide

### 1. Créer un client
```bash
curl -X POST http://localhost:8080/api/clients \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Ahmed\",\"lastName\":\"Alami\",\"email\":\"ahmed@willbank.ma\",\"phone\":\"+212612345678\",\"address\":\"Rabat\",\"cin\":\"AB123456\"}"
```

### 2. Créer un compte
```bash
curl -X POST http://localhost:8080/api/accounts \
  -H "Content-Type: application/json" \
  -d "{\"clientId\":1,\"accountType\":\"SAVINGS\"}"
```

### 3. Faire un dépôt
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"DEPOSIT\",\"sourceAccountId\":1,\"amount\":5000.00,\"description\":\"Dépôt initial\"}"
```

### 4. Consulter le dashboard
```bash
curl http://localhost:8080/api/dashboard/1
```

### 5. Vérifier les notifications
```bash
curl http://localhost:8080/api/notifications
```

## Étape 8 : Explorer l'API

### Swagger UI
- Client Service: http://localhost:8081/swagger-ui.html
- Account Service: http://localhost:8082/swagger-ui.html
- Transaction Service: http://localhost:8083/swagger-ui.html
- Notification Service: http://localhost:8084/swagger-ui.html
- Dashboard Service: http://localhost:8085/swagger-ui.html

### RabbitMQ Management
http://localhost:15672 (guest/guest)

## 🎯 Scénario de Test Complet

```bash
# 1. Créer un client
CLIENT_RESPONSE=$(curl -s -X POST http://localhost:8080/api/clients \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Mohamed","lastName":"Benali","email":"mohamed@willbank.ma","phone":"+212612345678","address":"Casablanca","cin":"CD789012"}')

echo "Client créé : $CLIENT_RESPONSE"

# 2. Créer deux comptes
ACCOUNT1=$(curl -s -X POST http://localhost:8080/api/accounts \
  -H "Content-Type: application/json" \
  -d '{"clientId":1,"accountType":"SAVINGS"}')

ACCOUNT2=$(curl -s -X POST http://localhost:8080/api/accounts \
  -H "Content-Type: application/json" \
  -d '{"clientId":1,"accountType":"CHECKING"}')

echo "Comptes créés"

# 3. Dépôt sur compte 1
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"type":"DEPOSIT","sourceAccountId":1,"amount":10000.00,"description":"Salaire"}'

# 4. Dépôt sur compte 2
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"type":"DEPOSIT","sourceAccountId":2,"amount":5000.00,"description":"Épargne"}'

# 5. Retrait
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"type":"WITHDRAWAL","sourceAccountId":1,"amount":500.00,"description":"ATM"}'

# 6. Virement entre comptes
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"type":"TRANSFER","sourceAccountId":1,"destinationAccountId":2,"amount":1000.00,"description":"Transfert épargne"}'

# 7. Consulter le dashboard
curl http://localhost:8080/api/dashboard/1 | json_pp

# 8. Consulter les notifications
curl http://localhost:8080/api/notifications | json_pp

# 9. Vérifier le cache Redis
redis-cli KEYS "*"
redis-cli GET "balances::1"
```

## 🐛 Dépannage Rapide

### Service ne démarre pas
```bash
# Vérifier les logs
tail -f <service>/target/*.log

# Vérifier le port
netstat -ano | findstr :8081
```

### MySQL Connection Error
```bash
# Vérifier MySQL
mysql -u root -p -e "SHOW DATABASES;"

# Vérifier les credentials dans application.yml
```

### Redis Connection Error
```bash
# Tester Redis
redis-cli ping
# Doit retourner : PONG
```

### RabbitMQ Connection Error
```bash
# Vérifier RabbitMQ
rabbitmqctl status

# Accéder à l'interface web
http://localhost:15672
```

## 📊 Monitoring

### Vérifier tous les services
```bash
curl http://localhost:8761/eureka/apps | grep -o "<app>[^<]*</app>"
```

### Vérifier RabbitMQ
```bash
# Lister les exchanges
rabbitmqadmin list exchanges

# Lister les queues
rabbitmqadmin list queues
```

### Vérifier Redis
```bash
# Voir toutes les clés
redis-cli KEYS "*"

# Monitorer en temps réel
redis-cli MONITOR
```

## 🎓 Points de Validation

✅ Eureka affiche 6 services UP
✅ Création de client réussie
✅ Création de compte réussie
✅ Transaction DEPOSIT fonctionne
✅ Transaction WITHDRAWAL fonctionne
✅ Transaction TRANSFER fonctionne
✅ Dashboard retourne client + comptes + transactions
✅ Notifications créées en base
✅ Cache Redis fonctionne
✅ RabbitMQ reçoit les événements
✅ Swagger UI accessible sur tous les services

## 📞 Support

En cas de problème, vérifier :
1. Tous les services externes sont démarrés (MySQL, Redis, RabbitMQ)
2. Les bases de données sont créées
3. Les ports ne sont pas déjà utilisés
4. Java 17 est bien installé
5. Maven est configuré correctement

Bon courage pour votre TP ! 🚀
