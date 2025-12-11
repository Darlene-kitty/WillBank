# Intégration Frontend-Backend WillBank

## Vue d'ensemble

Le frontend Angular est configuré pour communiquer directement avec les microservices, en bypassant l'API Gateway pour le moment. Chaque service a été configuré avec CORS pour permettre les appels depuis le frontend.

## Configuration des URLs

### Environnement de développement (localhost)
```typescript
// frontend-web/src/environments/environment.ts
clientServiceUrl: 'http://localhost:8081'
accountServiceUrl: 'http://localhost:8082'
transactionServiceUrl: 'http://localhost:8083'
notificationServiceUrl: 'http://localhost:8084'
dashboardServiceUrl: 'http://localhost:8085'
```

### Environnement de production
```typescript
// frontend-web/src/environments/environment.prod.ts
clientServiceUrl: 'https://client-api.willbank.com'
accountServiceUrl: 'https://account-api.willbank.com'
transactionServiceUrl: 'https://transaction-api.willbank.com'
notificationServiceUrl: 'https://notification-api.willbank.com'
dashboardServiceUrl: 'https://dashboard-api.willbank.com'
```

## Liaisons Frontend-Backend

### 1. Gestion des Comptes
**Page:** `/accounts` (AccountsComponent)
**Service Frontend:** `AccountService`
**Backend:** Account Service (port 8082)
**Endpoints utilisés:**
- `GET /api/accounts` - Liste tous les comptes
- `GET /api/accounts/{id}` - Détails d'un compte
- `GET /api/accounts/client/{clientId}` - Comptes d'un client
- `POST /api/accounts` - Créer un compte
- `PUT /api/accounts/{id}` - Modifier un compte
- `DELETE /api/accounts/{id}` - Supprimer un compte
- `POST /api/accounts/{id}/credit` - Créditer un compte
- `POST /api/accounts/{id}/debit` - Débiter un compte

### 2. Gestion des Transactions
**Page:** `/transactions` (TransactionsComponent)
**Service Frontend:** `TransactionService`
**Backend:** Transaction Service (port 8083)
**Endpoints utilisés:**
- `GET /api/transactions` - Liste toutes les transactions
- `GET /api/transactions/{id}` - Détails d'une transaction
- `GET /api/transactions/account/{accountId}` - Transactions d'un compte
- `POST /api/transactions` - Créer une transaction
- `GET /api/transactions/account/{accountId}/range` - Transactions par période

### 3. Virements
**Page:** `/transfer` (TransferComponent)
**Service Frontend:** `TransactionService`
**Backend:** Transaction Service (port 8083)
**Endpoints utilisés:**
- `POST /api/transactions` - Créer un virement (type: TRANSFER)

### 4. Dashboard
**Page:** `/dashboard` (DashboardComponent)
**Service Frontend:** `DashboardService`
**Backend:** Dashboard Composite Service (port 8085)
**Endpoints utilisés:**
- `GET /api/dashboard/{clientId}` - Données complètes du dashboard
- `GET /api/statements/{accountId}` - Relevé de compte

### 5. Gestion des Clients
**Page:** `/clients` (ClientsComponent)
**Service Frontend:** `ClientService`
**Backend:** Client Service (port 8081)
**Endpoints utilisés:**
- `GET /api/clients` - Liste tous les clients
- `GET /api/clients/{id}` - Détails d'un client
- `POST /api/clients` - Créer un client
- `PUT /api/clients/{id}` - Modifier un client

### 6. Notifications
**Service Frontend:** `NotificationService`
**Backend:** Notification Service (port 8084)
**Endpoints utilisés:**
- `GET /api/notifications/recipient/{recipient}` - Notifications d'un utilisateur
- `GET /api/notifications` - Toutes les notifications

## Configuration CORS

### Services configurés avec CORS
Tous les services backend ont été configurés pour accepter les requêtes CORS depuis le frontend :

1. **Client Service** - Déjà configuré dans SecurityConfig
2. **Account Service** - Nouvelle configuration CorsConfig ajoutée
3. **Transaction Service** - Nouvelle configuration CorsConfig ajoutée
4. **Dashboard Composite Service** - Nouvelle configuration CorsConfig ajoutée
5. **Notification Service** - Nouvelle configuration CorsConfig ajoutée

### Origines autorisées
- `http://localhost:4200` (développement Angular)
- `http://127.0.0.1:4200` (développement Angular alternatif)
- `https://willbank-frontend.com` (production)

### Méthodes HTTP autorisées
- GET, POST, PUT, DELETE, OPTIONS, PATCH

### Headers autorisés
- Authorization, Content-Type, X-Requested-With, Accept, Origin

## Service API Générique

Le `ApiService` fournit une interface unifiée pour les appels HTTP vers tous les microservices :

```typescript
// Exemple d'utilisation
this.apiService.get<Account[]>('/api/accounts', null, 'account')
this.apiService.post<Transaction>('/api/transactions', data, 'transaction')
```

## Routes Frontend

Les routes principales sont protégées par `authGuard` :
- `/dashboard` - Tableau de bord
- `/accounts` - Gestion des comptes
- `/transactions` - Historique des transactions
- `/transfer` - Effectuer un virement
- `/clients` - Gestion des clients
- `/profile` - Profil utilisateur

## Sécurité

### Authentification
- Tokens JWT stockés dans localStorage
- Intercepteur HTTP pour ajouter automatiquement les tokens
- Guard d'authentification sur les routes protégées

### CORS
- Configuration stricte des origines autorisées
- Support des credentials pour l'authentification
- Headers de sécurité appropriés

## Tests de Connectivité

Pour tester la connectivité entre le frontend et les services :

1. Démarrer tous les services backend
2. Démarrer le frontend Angular (`ng serve`)
3. Vérifier les appels réseau dans les DevTools du navigateur
4. Tester chaque fonctionnalité (comptes, transactions, virements)

## Résolution des Problèmes CORS

### Problème Identifié
Les erreurs CORS indiquent que les services backend ne sont pas configurés correctement ou ne sont pas démarrés.

### Solutions Implémentées

1. **Configuration CORS au niveau des contrôleurs**
   - Ajout de `@CrossOrigin` sur tous les contrôleurs
   - Origines autorisées : `http://localhost:4200`, `http://127.0.0.1:4200`

2. **Configuration CORS globale**
   - Création de `WebConfig` pour chaque service
   - Configuration via `WebMvcConfigurer`

3. **Configuration CORS pour Spring Security**
   - Le client-service utilise déjà `SecurityConfig` avec CORS

### Scripts de Démarrage

1. **Redémarrage avec CORS** : `restart-services-cors.bat`
   - Arrête tous les services Java
   - Redémarre tous les services dans l'ordre correct
   - Attend entre chaque démarrage

2. **Test CORS** : `test-cors.bat`
   - Teste les requêtes OPTIONS (preflight)
   - Vérifie la configuration CORS de chaque service

### Ordre de Démarrage Recommandé

1. Eureka Server (port 8761)
2. Client Service (port 8081) 
3. Account Service (port 8082)
4. Transaction Service (port 8083)
5. Notification Service (port 8084)
6. Dashboard Composite Service (port 8085)
7. Frontend Angular (port 4200)

### Vérification

Après le démarrage des services :
1. Vérifier Eureka : http://localhost:8761
2. Tester les endpoints avec Postman ou curl
3. Démarrer le frontend Angular
4. Vérifier les appels réseau dans les DevTools

## Prochaines Étapes

1. **Redémarrer les services** avec `restart-services-cors.bat`
2. Tester l'intégration complète
3. Ajouter la gestion d'erreurs réseau
4. Implémenter le retry automatique
5. Ajouter des indicateurs de chargement
6. Optimiser les performances avec la mise en cache