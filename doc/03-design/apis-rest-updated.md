# APIs REST - Documentation Complète

## Microservice Client (Port 8081)

### Authentification (Public)

#### POST /api/auth/register
Enregistre un nouveau client.
**Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "address": "string",
  "cin": "string",
  "fcmToken": "string" (optionnel)
}
```
**Response:** LoginResponse avec tokens JWT

#### POST /api/auth/login
Authentifie un client.
**Body:**
```json
{
  "email": "string",
  "password": "string",
  "fcmToken": "string" (optionnel)
}
```
**Response:** LoginResponse avec tokens JWT

#### POST /api/auth/refresh
Rafraîchit le token d'accès.
**Body:**
```json
{
  "refreshToken": "string"
}
```
**Response:** LoginResponse avec nouveaux tokens

#### GET /api/auth/me
Retourne le profil de l'utilisateur authentifié.
**Headers:** Authorization: Bearer {token}
**Response:** ClientDTO

#### PUT /api/auth/change-password
Change le mot de passe.
**Headers:** Authorization: Bearer {token}
**Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

### Gestion des Clients (Protégé)

#### GET /api/clients
Retourne tous les clients.
**Headers:** Authorization: Bearer {token}
**Rôles:** CLIENT, AGENT, ADMIN
**Response:** Array<ClientDTO>

#### GET /api/clients/{id}
Retourne les informations d'un client.
**Headers:** Authorization: Bearer {token}
**Rôles:** CLIENT, AGENT, ADMIN
**Response:** ClientDTO

#### POST /api/clients
Crée un client.
**Headers:** Authorization: Bearer {token}
**Rôles:** AGENT, ADMIN
**Body:** ClientDTO
**Response:** ClientDTO

#### PUT /api/clients/{id}
Met à jour le client.
**Headers:** Authorization: Bearer {token}
**Rôles:** AGENT, ADMIN
**Body:** ClientDTO
**Response:** ClientDTO

#### DELETE /api/clients/{id}
Supprime un client.
**Headers:** Authorization: Bearer {token}
**Rôles:** ADMIN
**Response:** 204 No Content

---

## Microservice Compte (Port 8082)

### Gestion des Comptes (Protégé)

#### GET /api/accounts
Retourne tous les comptes.
**Headers:** Authorization: Bearer {token}
**Response:** Array<AccountDTO>

#### GET /api/accounts/{id}
Retourne un compte.
**Headers:** Authorization: Bearer {token}
**Response:** AccountDTO

#### GET /api/accounts/number/{accountNumber}
Retourne un compte par son numéro.
**Headers:** Authorization: Bearer {token}
**Response:** AccountDTO

#### GET /api/accounts/client/{clientId}
Retourne tous les comptes d'un client.
**Headers:** Authorization: Bearer {token}
**Response:** Array<AccountDTO>

#### POST /api/accounts
Crée un compte.
**Headers:** Authorization: Bearer {token}
**Body:**
```json
{
  "clientId": "number",
  "accountType": "SAVINGS" | "CHECKING"
}
```
**Response:** AccountDTO

#### PUT /api/accounts/{id}
Met à jour un compte.
**Headers:** Authorization: Bearer {token}
**Body:** AccountDTO
**Response:** AccountDTO

#### GET /api/accounts/{id}/balance
Retourne le solde d'un compte (avec cache).
**Headers:** Authorization: Bearer {token}
**Response:** BigDecimal

#### POST /api/accounts/{id}/credit
Crédite un compte.
**Headers:** Authorization: Bearer {token}
**Query Params:** amount=BigDecimal
**Response:** 200 OK

#### POST /api/accounts/{id}/debit
Débite un compte.
**Headers:** Authorization: Bearer {token}
**Query Params:** amount=BigDecimal
**Response:** 200 OK

#### DELETE /api/accounts/{id}
Supprime un compte.
**Headers:** Authorization: Bearer {token}
**Response:** 204 No Content

---

## Microservice Transaction (Port 8083)

### Gestion des Transactions (Protégé)

#### POST /api/transactions
Effectue une transaction (dépôt, retrait, virement).
**Headers:** Authorization: Bearer {token}
**Body:**
```json
{
  "type": "DEPOSIT" | "WITHDRAWAL" | "TRANSFER",
  "sourceAccountId": "number",
  "destinationAccountId": "number" (pour TRANSFER),
  "amount": "BigDecimal",
  "description": "string"
}
```
**Response:** TransactionDTO

#### GET /api/transactions/{id}
Retourne une transaction par son ID.
**Headers:** Authorization: Bearer {token}
**Response:** TransactionDTO

#### GET /api/transactions/account/{accountId}
Retourne l'historique des transactions d'un compte.
**Headers:** Authorization: Bearer {token}
**Response:** Array<TransactionDTO>

#### GET /api/transactions
Retourne toutes les transactions.
**Headers:** Authorization: Bearer {token}
**Response:** Array<TransactionDTO>

---

## API Gateway (Port 8080)

Toutes les requêtes passent par l'API Gateway:
- Client Service: `http://localhost:8080/api/auth/*` et `http://localhost:8080/api/clients/*`
- Account Service: `http://localhost:8080/api/accounts/*`
- Transaction Service: `http://localhost:8080/api/transactions/*`
- Dashboard Service: `http://localhost:8080/api/dashboard/*`
- Notification Service: `http://localhost:8080/api/notifications/*`

---

## Formats de Réponse

### ClientDTO
```json
{
  "id": "number",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "cin": "string",
  "role": "CLIENT" | "AGENT" | "ADMIN",
  "status": "ACTIVE" | "BLOCKED" | "PENDING" | "SUSPENDED",
  "lastLogin": "datetime",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### AccountDTO
```json
{
  "id": "number",
  "accountNumber": "string",
  "clientId": "number",
  "accountType": "SAVINGS" | "CHECKING",
  "balance": "BigDecimal",
  "status": "ACTIVE" | "INACTIVE" | "BLOCKED",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### LoginResponse
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "tokenType": "Bearer",
  "expiresIn": "number",
  "client": ClientDTO
}
```
