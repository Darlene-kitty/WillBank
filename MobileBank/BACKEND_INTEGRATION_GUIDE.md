# 🔗 Guide d'Intégration Backend - MobileBank

## 📋 Vue d'ensemble

Ce document assure la compatibilité complète entre le frontend MobileBank et les services backend (client-service, account-service, transaction-service, notification-service).

---

## 🏗️ Architecture des Services

### Services Backend
1. **client-service** (Port: 8081) - Gestion des clients
2. **account-service** (Port: 8082) - Gestion des comptes
3. **transaction-service** (Port: 8083) - Gestion des transactions
4. **notification-service** (Port: 8084) - Gestion des notifications
5. **eureka-server** (Port: 8761) - Service Discovery
6. **api-gateway** (Port: 8080) - Point d'entrée unique

### URL de Base
```
Production: https://api.willbank.com
Development: http://localhost:8080
```

---

## 🔐 1. CLIENT SERVICE - Authentification & Profil

### Entité Backend: `Client.java`
```java
{
  id: Long,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String,
  phone: String,
  address: String,
  cin: String (unique),
  fcmToken: String,
  role: ClientRole (CLIENT, ADMIN, AGENT),
  status: ClientStatus (ACTIVE, BLOCKED, PENDING, SUSPENDED),
  lastLogin: LocalDateTime,
  createdAt: LocalDateTime,
  updatedAt: LocalDateTime
}
```

### Interface Frontend: `ClientProfile`
```typescript
// MobileBank/app/(screens)/profile-settings.tsx
interface ClientProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  cin: string;
  role: 'CLIENT' | 'ADMIN' | 'AGENT';
  status: 'ACTIVE' | 'BLOCKED' | 'PENDING' | 'SUSPENDED';
  createdAt: string;
  lastLogin: string;
}
```

### Endpoints à Implémenter

#### 1. Login
```typescript
POST /api/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  token: string,
  refreshToken: string,
  client: ClientDTO
}
```

#### 2. Register
```typescript
POST /api/auth/register
Body: {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phone: string,
  address: string,
  cin: string
}
Response: ClientDTO
```

#### 3. Get Profile
```typescript
GET /api/clients/{id}
Headers: { Authorization: "Bearer {token}" }
Response: ClientDTO
```

#### 4. Update Profile
```typescript
PUT /api/clients/{id}
Headers: { Authorization: "Bearer {token}" }
Body: {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: string
}
Response: ClientDTO
```

#### 5. Change Password
```typescript
POST /api/auth/change-password
Headers: { Authorization: "Bearer {token}" }
Body: {
  oldPassword: string,
  newPassword: string
}
Response: { message: string }
```

---

## 💰 2. ACCOUNT SERVICE - Comptes Bancaires

### Entité Backend: `Account.java`
```java
{
  id: Long,
  accountNumber: String (unique),
  clientId: Long,
  accountType: AccountType (SAVINGS, CHECKING, BUSINESS),
  balance: BigDecimal,
  status: AccountStatus (ACTIVE, SUSPENDED, CLOSED),
  createdAt: LocalDateTime,
  updatedAt: LocalDateTime
}
```

### Interface Frontend: `BankAccount`
```typescript
// MobileBank/app/(screens)/account-config.tsx
interface BankAccount {
  id: number;
  accountNumber: string;
  clientId: number;
  accountType: 'SAVINGS' | 'CHECKING' | 'BUSINESS';
  balance: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}
```

### Endpoints à Implémenter

#### 1. Get Accounts by Client
```typescript
GET /api/accounts/client/{clientId}
Headers: { Authorization: "Bearer {token}" }
Response: AccountDTO[]
```

#### 2. Get Account Details
```typescript
GET /api/accounts/{id}
Headers: { Authorization: "Bearer {token}" }
Response: AccountDTO
```

#### 3. Get Balance
```typescript
GET /api/accounts/{id}/balance
Headers: { Authorization: "Bearer {token}" }
Response: BigDecimal
```

#### 4. Update Account Status
```typescript
PUT /api/accounts/{id}
Headers: { Authorization: "Bearer {token}" }
Body: {
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED'
}
Response: AccountDTO
```

#### 5. Credit Account
```typescript
POST /api/accounts/{id}/credit
Headers: { Authorization: "Bearer {token}" }
Body: { amount: number }
Response: void
```

#### 6. Debit Account
```typescript
POST /api/accounts/{id}/debit
Headers: { Authorization: "Bearer {token}" }
Body: { amount: number }
Response: void
```

---

## 💸 3. TRANSACTION SERVICE - Transactions

### Entité Backend: `Transaction.java`
```java
{
  id: Long,
  transactionReference: String (unique),
  type: TransactionType (DEPOSIT, WITHDRAWAL, TRANSFER),
  sourceAccountId: Long,
  destinationAccountId: Long,
  destinationIban: String,
  amount: BigDecimal,
  description: String,
  status: TransactionStatus (PENDING, COMPLETED, FAILED, CANCELLED),
  createdAt: LocalDateTime
}
```

### Interface Frontend: `Transaction`
```typescript
// MobileBank/app/(screens)/transaction-history.tsx
interface Transaction {
  id: number;
  transactionReference: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  sourceAccountId: number;
  destinationAccountId?: number;
  destinationIban?: string;
  amount: number;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
}
```

### Endpoints à Implémenter

#### 1. Create Transaction (Transfer)
```typescript
POST /api/transactions
Headers: { Authorization: "Bearer {token}" }
Body: {
  type: 'TRANSFER',
  sourceAccountId: number,
  destinationAccountId: number,
  destinationIban: string,
  amount: number,
  description: string
}
Response: TransactionDTO
```

#### 2. Create Transaction (Deposit)
```typescript
POST /api/transactions
Headers: { Authorization: "Bearer {token}" }
Body: {
  type: 'DEPOSIT',
  sourceAccountId: number,
  amount: number,
  description: string
}
Response: TransactionDTO
```

#### 3. Get Transactions by Account
```typescript
GET /api/transactions/account/{accountId}
Headers: { Authorization: "Bearer {token}" }
Response: TransactionDTO[]
```

#### 4. Get Transaction by ID
```typescript
GET /api/transactions/{id}
Headers: { Authorization: "Bearer {token}" }
Response: TransactionDTO
```

#### 5. Get Transaction by Reference
```typescript
GET /api/transactions/reference/{reference}
Headers: { Authorization: "Bearer {token}" }
Response: TransactionDTO
```

#### 6. Get Transactions by Date Range
```typescript
GET /api/transactions/account/{accountId}/range?startDate={date}&endDate={date}
Headers: { Authorization: "Bearer {token}" }
Response: TransactionDTO[]
```

---

## 🔔 4. NOTIFICATION SERVICE - Notifications

### Entité Backend: `Notification.java`
```java
{
  id: Long,
  type: NotificationType (EMAIL, SMS, PUSH, IN_APP),
  recipient: String,
  message: String,
  eventData: String,
  status: NotificationStatus (PENDING, SENT, FAILED),
  createdAt: LocalDateTime,
  sentAt: LocalDateTime
}
```

### Interface Frontend: `Notification`
```typescript
// MobileBank/app/(screens)/notifications.tsx
interface Notification {
  id: number;
  type: 'transaction' | 'security' | 'info' | 'promo';
  title: string;
  message: string;
  date: string;
  read: boolean;
  icon: string;
}
```

### Endpoints à Implémenter

#### 1. Get Notifications by Recipient
```typescript
GET /api/notifications/recipient/{email}
Headers: { Authorization: "Bearer {token}" }
Response: Notification[]
```

#### 2. Get Notification Preferences
```typescript
GET /api/notifications/preferences/{clientId}
Headers: { Authorization: "Bearer {token}" }
Response: NotificationPreferences
```

#### 3. Update Notification Preferences
```typescript
PUT /api/notifications/preferences/{clientId}
Headers: { Authorization: "Bearer {token}" }
Body: {
  email: boolean,
  sms: boolean,
  push: boolean,
  inApp: boolean,
  transactions: boolean,
  security: boolean,
  marketing: boolean,
  updates: boolean
}
Response: NotificationPreferences
```

#### 4. Send Test Notification
```typescript
POST /api/notifications/test
Headers: { Authorization: "Bearer {token}" }
Body: { clientId: number }
Response: { message: string }
```

---

## 🔄 5. FLUX COMPLETS

### A. Flux de Connexion
```
1. User entre email/password
   ↓
2. POST /api/auth/login
   ↓
3. Backend valide credentials
   ↓
4. Backend retourne JWT token + refreshToken
   ↓
5. Frontend stocke tokens (AsyncStorage)
   ↓
6. GET /api/clients/{id} pour récupérer profil
   ↓
7. GET /api/accounts/client/{clientId} pour récupérer comptes
   ↓
8. Navigation vers Dashboard
```

### B. Flux de Virement
```
1. User remplit formulaire (new-transfer.tsx)
   ↓
2. Navigation vers confirmation (transfer-confirmation.tsx)
   ↓
3. User confirme
   ↓
4. POST /api/transactions
   Body: {
     type: 'TRANSFER',
     sourceAccountId: 1,
     destinationAccountId: 2,
     amount: 100.00,
     description: 'Virement'
   }
   ↓
5. Backend:
   - Vérifie solde suffisant
   - Débite compte source
   - Crédite compte destination
   - Crée transaction
   - Publie événement RabbitMQ
   ↓
6. Notification Service écoute événement
   ↓
7. Envoie notifications (Email, SMS, Push)
   ↓
8. Frontend reçoit response avec transactionReference
   ↓
9. Navigation vers success (transfer-success.tsx)
```

### C. Flux de Dépôt
```
1. User remplit formulaire (deposit.tsx)
   ↓
2. Navigation vers confirmation (deposit-confirmation.tsx)
   ↓
3. User confirme
   ↓
4. POST /api/transactions
   Body: {
     type: 'DEPOSIT',
     sourceAccountId: 1,
     amount: 500.00,
     description: 'Dépôt Chèque'
   }
   ↓
5. Backend crée transaction PENDING
   ↓
6. Après validation (2-3 jours pour chèque):
   - POST /api/accounts/{id}/credit
   - Update transaction status: COMPLETED
   ↓
7. Notification envoyée
   ↓
8. Frontend affiche success (deposit-success.tsx)
```

---

## 🔒 6. SÉCURITÉ & AUTHENTIFICATION

### JWT Token Structure
```json
{
  "sub": "user@email.com",
  "clientId": 1,
  "role": "CLIENT",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Headers Requis
```typescript
{
  'Authorization': 'Bearer {token}',
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

### Gestion du Token
```typescript
// Stockage
await AsyncStorage.setItem('authToken', token);
await AsyncStorage.setItem('refreshToken', refreshToken);

// Récupération
const token = await AsyncStorage.getItem('authToken');

// Refresh Token
if (response.status === 401) {
  const newToken = await refreshAuthToken();
  // Retry request with new token
}
```

### Intercepteur Axios (à créer)
```typescript
// MobileBank/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      // Call refresh endpoint
      // Retry original request
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 📡 7. SERVICES À CRÉER

### A. Auth Service
```typescript
// MobileBank/services/authService.ts
import api from './api';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  
  register: async (data: RegisterRequest) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },
  
  logout: async () => {
    await AsyncStorage.multiRemove(['authToken', 'refreshToken']);
  },
  
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/api/auth/refresh', { refreshToken });
    return response.data;
  },
};
```

### B. Client Service
```typescript
// MobileBank/services/clientService.ts
import api from './api';

export const clientService = {
  getProfile: async (clientId: number) => {
    const response = await api.get(`/api/clients/${clientId}`);
    return response.data;
  },
  
  updateProfile: async (clientId: number, data: Partial<ClientProfile>) => {
    const response = await api.put(`/api/clients/${clientId}`, data);
    return response.data;
  },
  
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await api.post('/api/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};
```

### C. Account Service
```typescript
// MobileBank/services/accountService.ts
import api from './api';

export const accountService = {
  getAccountsByClient: async (clientId: number) => {
    const response = await api.get(`/api/accounts/client/${clientId}`);
    return response.data;
  },
  
  getAccountDetails: async (accountId: number) => {
    const response = await api.get(`/api/accounts/${accountId}`);
    return response.data;
  },
  
  getBalance: async (accountId: number) => {
    const response = await api.get(`/api/accounts/${accountId}/balance`);
    return response.data;
  },
  
  updateAccountStatus: async (accountId: number, status: string) => {
    const response = await api.put(`/api/accounts/${accountId}`, { status });
    return response.data;
  },
};
```

### D. Transaction Service
```typescript
// MobileBank/services/transactionService.ts
import api from './api';

export const transactionService = {
  createTransaction: async (data: TransactionDTO) => {
    const response = await api.post('/api/transactions', data);
    return response.data;
  },
  
  getTransactionsByAccount: async (accountId: number) => {
    const response = await api.get(`/api/transactions/account/${accountId}`);
    return response.data;
  },
  
  getTransactionById: async (transactionId: number) => {
    const response = await api.get(`/api/transactions/${transactionId}`);
    return response.data;
  },
  
  getTransactionsByDateRange: async (
    accountId: number,
    startDate: string,
    endDate: string
  ) => {
    const response = await api.get(
      `/api/transactions/account/${accountId}/range`,
      { params: { startDate, endDate } }
    );
    return response.data;
  },
};
```

### E. Notification Service
```typescript
// MobileBank/services/notificationService.ts
import api from './api';

export const notificationService = {
  getNotifications: async (email: string) => {
    const response = await api.get(`/api/notifications/recipient/${email}`);
    return response.data;
  },
  
  getPreferences: async (clientId: number) => {
    const response = await api.get(`/api/notifications/preferences/${clientId}`);
    return response.data;
  },
  
  updatePreferences: async (clientId: number, preferences: any) => {
    const response = await api.put(
      `/api/notifications/preferences/${clientId}`,
      preferences
    );
    return response.data;
  },
  
  sendTestNotification: async (clientId: number) => {
    const response = await api.post('/api/notifications/test', { clientId });
    return response.data;
  },
};
```

---

## 🧪 8. TESTS D'INTÉGRATION

### Test de Connexion
```typescript
// Test avec Postman ou curl
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "test@willbank.com",
  "password": "password123"
}

// Expected Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "client": {
    "id": 1,
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "test@willbank.com",
    ...
  }
}
```

### Test de Virement
```typescript
POST http://localhost:8080/api/transactions
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "TRANSFER",
  "sourceAccountId": 1,
  "destinationAccountId": 2,
  "amount": 100.00,
  "description": "Test virement"
}

// Expected Response
{
  "id": 1,
  "transactionReference": "TRX-12345678",
  "type": "TRANSFER",
  "status": "COMPLETED",
  ...
}
```

---

## 📋 9. CHECKLIST D'INTÉGRATION

### Backend
- [ ] Tous les services démarrés (Eureka, Gateway, Client, Account, Transaction, Notification)
- [ ] Base de données MySQL configurée
- [ ] RabbitMQ configuré et démarré
- [ ] CORS configuré pour accepter les requêtes du frontend
- [ ] JWT secret configuré
- [ ] Endpoints testés avec Postman

### Frontend
- [ ] Services API créés (authService, clientService, etc.)
- [ ] Intercepteur Axios configuré
- [ ] AsyncStorage configuré pour tokens
- [ ] Gestion des erreurs implémentée
- [ ] Loading states implémentés
- [ ] Navigation après login/logout
- [ ] Refresh token logic implémentée

### Tests
- [ ] Login/Logout fonctionnel
- [ ] Récupération du profil
- [ ] Liste des comptes
- [ ] Création de transaction
- [ ] Historique des transactions
- [ ] Notifications reçues
- [ ] Mise à jour du profil
- [ ] Changement de mot de passe

---

## 🚀 10. DÉMARRAGE COMPLET

### 1. Démarrer les Services Backend
```bash
# Terminal 1 - Eureka Server
cd eureka-server
mvn spring-boot:run

# Terminal 2 - API Gateway
cd api-gateway
mvn spring-boot:run

# Terminal 3 - Client Service
cd client-service
mvn spring-boot:run

# Terminal 4 - Account Service
cd account-service
mvn spring-boot:run

# Terminal 5 - Transaction Service
cd transaction-service
mvn spring-boot:run

# Terminal 6 - Notification Service
cd notification-service
mvn spring-boot:run
```

### 2. Démarrer le Frontend
```bash
cd MobileBank
npm install
npm start
```

### 3. Vérifier les Services
```
Eureka: http://localhost:8761
API Gateway: http://localhost:8080
Client Service: http://localhost:8081
Account Service: http://localhost:8082
Transaction Service: http://localhost:8083
Notification Service: http://localhost:8084
```

---

## 📝 11. VARIABLES D'ENVIRONNEMENT

### Backend (application.properties)
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/willbank
spring.datasource.username=root
spring.datasource.password=password

# JWT
jwt.secret=your-secret-key-here
jwt.expiration=86400000

# RabbitMQ
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest

# Eureka
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

### Frontend (.env)
```
API_BASE_URL=http://localhost:8080
API_TIMEOUT=10000
```

---

**Créé le**: 9 Décembre 2024  
**Status**: ✅ Guide complet d'intégration  
**Version**: 1.0
