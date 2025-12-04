# Architecture d'Authentification - Client Service

## 📋 Vue d'ensemble

Ce document décrit l'architecture complète du système d'authentification implémenté pour le microservice `client-service` de WillBank.

## 🏗️ Architecture en couches

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTS (Web, Mobile)                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (Future)                    │
│                    Port: 8080 (to be added)                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT SERVICE (Port 8081)               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Controllers Layer                        │  │
│  │  • AuthController     • ClientController              │  │
│  └───────────────────────────────────────────────────────┘  │
│                              ↓                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Security Filter Chain                       │  │
│  │  • JwtAuthenticationFilter                            │  │
│  │  • SecurityConfig                                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                              ↓                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               Service Layer                           │  │
│  │  • AuthService       • ClientService                  │  │
│  │  • CustomUserDetailsService                           │  │
│  └───────────────────────────────────────────────────────┘  │
│                              ↓                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Security Components                        │  │
│  │  • JwtUtil           • PasswordEncoder                │  │
│  │  • AuthenticationManager                              │  │
│  └───────────────────────────────────────────────────────┘  │
│                              ↓                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Repository Layer                           │  │
│  │  • ClientRepository (JPA)                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database                           │
│                      client_db                              │
│  Tables: clients                                            │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Flux d'authentification détaillé

### 1. Enregistrement (Register)

```
┌──────┐                ┌─────────────┐               ┌──────────┐
│Client│                │AuthController│               │AuthService│
└──┬───┘                └──────┬──────┘               └─────┬────┘
   │                           │                            │
   │ POST /auth/register       │                            │
   │ + RegisterRequest         │                            │
   ├──────────────────────────>│                            │
   │                           │                            │
   │                           │ register(request)          │
   │                           ├───────────────────────────>│
   │                           │                            │
   │                           │  1. Validate data          │
   │                           │  2. Check email exists     │
   │                           │  3. Hash password (BCrypt) │
   │                           │  4. Save client            │
   │                           │  5. Generate JWT tokens    │
   │                           │                            │
   │                           │ LoginResponse              │
   │                           │<───────────────────────────┤
   │                           │                            │
   │ 201 Created               │                            │
   │ + Access Token            │                            │
   │ + Refresh Token           │                            │
   │<──────────────────────────┤                            │
   │                           │                            │
```

### 2. Connexion (Login)

```
┌──────┐                ┌─────────────┐               ┌──────────┐
│Client│                │AuthController│               │AuthService│
└──┬───┘                └──────┬──────┘               └─────┬────┘
   │                           │                            │
   │ POST /auth/login          │                            │
   │ + LoginRequest            │                            │
   ├──────────────────────────>│                            │
   │                           │                            │
   │                           │ login(request)             │
   │                           ├───────────────────────────>│
   │                           │                            │
   │                           │  1. Authenticate           │
   │                           │     (AuthenticationManager)│
   │                           │  2. Load UserDetails       │
   │                           │  3. Verify password        │
   │                           │  4. Update last login      │
   │                           │  5. Generate JWT tokens    │
   │                           │                            │
   │                           │ LoginResponse              │
   │                           │<───────────────────────────┤
   │                           │                            │
   │ 200 OK                    │                            │
   │ + Access Token            │                            │
   │ + Refresh Token           │                            │
   │<──────────────────────────┤                            │
   │                           │                            │
```

### 3. Accès à une ressource protégée

```
┌──────┐     ┌────────────────┐     ┌─────────────┐     ┌──────────┐
│Client│     │JwtAuthFilter   │     │ClientController│   │ClientService│
└──┬───┘     └───────┬────────┘     └──────┬──────┘     └─────┬────┘
   │                 │                     │                   │
   │ GET /clients    │                     │                   │
   │ + Bearer Token  │                     │                   │
   ├────────────────>│                     │                   │
   │                 │                     │                   │
   │                 │ 1. Extract token    │                   │
   │                 │ 2. Validate token   │                   │
   │                 │    (JwtUtil)        │                   │
   │                 │ 3. Load UserDetails │                   │
   │                 │ 4. Set Security     │                   │
   │                 │    Context          │                   │
   │                 │                     │                   │
   │                 │    getAllClients()  │                   │
   │                 ├────────────────────>│                   │
   │                 │                     │                   │
   │                 │                     │ getAllClients()   │
   │                 │                     ├──────────────────>│
   │                 │                     │                   │
   │                 │                     │ List<ClientDTO>   │
   │                 │                     │<──────────────────┤
   │                 │                     │                   │
   │                 │   200 OK + Data     │                   │
   │                 │<────────────────────┤                   │
   │                 │                     │                   │
   │ Response        │                     │                   │
   │<────────────────┤                     │                   │
   │                 │                     │                   │
```

## 🔑 Composants clés

### 1. JwtUtil
**Responsabilité:** Gestion des tokens JWT

**Méthodes principales:**
- `generateToken(UserDetails)` - Génère un access token
- `generateRefreshToken(UserDetails)` - Génère un refresh token
- `extractUsername(token)` - Extrait l'email du token
- `isTokenValid(token, UserDetails)` - Valide le token

**Configuration:**
```yaml
jwt:
  secret: [256-bit secret key]
  expiration: 86400000  # 24 heures
  refresh-expiration: 604800000  # 7 jours
```

### 2. JwtAuthenticationFilter
**Responsabilité:** Intercepter et valider les requêtes

**Processus:**
1. Extraire le token du header `Authorization`
2. Valider le token avec JwtUtil
3. Charger les détails utilisateur
4. Définir le SecurityContext
5. Continuer la chaîne de filtres

### 3. CustomUserDetailsService
**Responsabilité:** Charger les détails utilisateur pour Spring Security

**Processus:**
1. Rechercher le client par email
2. Vérifier le statut (ACTIVE, BLOCKED, etc.)
3. Construire UserDetails avec rôles

### 4. SecurityConfig
**Responsabilité:** Configuration globale de la sécurité

**Configuration:**
- Endpoints publics (sans auth)
- Endpoints protégés (avec auth + rôles)
- CORS configuration
- Session management (STATELESS)
- Password encoder (BCrypt)

### 5. AuthService
**Responsabilité:** Logique métier d'authentification

**Méthodes:**
- `register(RegisterRequest)` - Inscription
- `login(LoginRequest)` - Connexion
- `refreshToken(RefreshTokenRequest)` - Rafraîchissement
- `changePassword(email, ChangePasswordRequest)` - Changement mot de passe

### 6. ClientService
**Responsabilité:** Gestion CRUD des clients

**Méthodes:**
- `createClient(ClientDTO)` - Création
- `getClientById(id)` - Récupération
- `updateClient(id, ClientDTO)` - Mise à jour
- `deleteClient(id)` - Suppression

## 📊 Modèle de données

### Table: clients

```sql
CREATE TABLE clients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- BCrypt hash
    phone VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    cin VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,       -- CLIENT, ADMIN, AGENT
    status VARCHAR(50) NOT NULL,     -- ACTIVE, BLOCKED, PENDING, SUSPENDED
    last_login DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    
    INDEX idx_email (email),
    INDEX idx_phone (phone)
);
```

## 🔒 Sécurité

### Hachage des mots de passe
- **Algorithme:** BCrypt
- **Coût:** 10 rounds (par défaut)
- **Salage:** Automatique par BCrypt

### Tokens JWT
- **Algorithme:** HS256 (HMAC with SHA-256)
- **Signature:** Clé secrète 256 bits
- **Claims:** Subject (email), Issued At, Expiration

### Protection CSRF
- **Désactivé** pour les APIs REST
- Sécurité basée sur tokens JWT

### CORS
- **Origines autorisées:**
  - `http://localhost:4200` (Angular)
  - `http://localhost:3000` (React)
- **Méthodes:** GET, POST, PUT, DELETE, OPTIONS, PATCH
- **Credentials:** Autorisés

## 🎭 Gestion des rôles

### Hiérarchie des rôles

```
┌──────────┐
│  ADMIN   │  Tous les droits
└────┬─────┘
     │
┌────▼─────┐
│  AGENT   │  Gestion clients + lecture
└────┬─────┘
     │
┌────▼─────┐
│  CLIENT  │  Lecture de ses propres données
└──────────┘
```

### Permissions par rôle

| Endpoint              | CLIENT | AGENT | ADMIN |
|-----------------------|--------|-------|-------|
| GET /clients          | ✅     | ✅    | ✅    |
| GET /clients/{id}     | ✅*    | ✅    | ✅    |
| POST /clients         | ❌     | ✅    | ✅    |
| PUT /clients/{id}     | ✅*    | ✅    | ✅    |
| DELETE /clients/{id}  | ❌     | ❌    | ✅    |

*✅ = Uniquement ses propres données

## 🎯 Statuts des clients

### Cycle de vie

```
     ┌──────────┐
     │ REGISTER │
     └────┬─────┘
          │
          ▼
     ┌────────┐
  ┌─►│ ACTIVE │◄──┐
  │  └───┬────┘   │
  │      │        │
  │      │ Block  │ Activate
  │      ▼        │
  │  ┌─────────┐  │
  └──┤ BLOCKED │──┘
     └─────────┘
```

### Comportement par statut

- **ACTIVE:** Peut se connecter et utiliser tous les services
- **BLOCKED:** Connexion refusée, compte bloqué
- **PENDING:** En attente de validation (pas encore implémenté)
- **SUSPENDED:** Temporairement suspendu (pas encore implémenté)

## 📈 Diagramme de séquence complet

### Enregistrement + Premier accès

```
Client          AuthController      AuthService      ClientRepository      JwtUtil
  │                   │                   │                  │                │
  │─Register Request─>│                   │                  │                │
  │                   │─register()───────>│                  │                │
  │                   │                   │─exists?─────────>│                │
  │                   │                   │<─No──────────────│                │
  │                   │                   │─save()──────────>│                │
  │                   │                   │<─Client──────────│                │
  │                   │                   │─generateToken()─────────────────>│
  │                   │                   │<─Access Token────────────────────│
  │                   │                   │─generateRefreshToken()──────────>│
  │                   │                   │<─Refresh Token───────────────────│
  │                   │<─LoginResponse────│                  │                │
  │<─201 + Tokens─────│                   │                  │                │
  │                   │                   │                  │                │
  │─GET /clients──────────────────────────────────────────────────────────────┐
  │ (Authorization: Bearer {token})                                           │
  │<──────────────────────────────────────────────────────────────────────────┘
  │                   [JwtAuthenticationFilter validates token]
  │                   │                   │                  │                │
  │─────────────────>│─getAllClients()──>│─findAll()───────>│                │
  │                   │                   │<─List<Client>────│                │
  │                   │<─List<ClientDTO>──│                  │                │
  │<─200 + Data───────│                   │                  │                │
```

## 🔄 Intégration future avec autres microservices

### API Gateway Integration

```
┌─────────────────────────────────────────────────────────┐
│                     API Gateway                         │
│  • Route: /client/** → client-service:8081             │
│  • Authentication centralisée                           │
│  • Rate limiting                                        │
│  • Load balancing                                       │
└─────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Client     │  │   Account    │  │ Transaction  │
│   Service    │  │   Service    │  │   Service    │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Token Validation dans autres services

Les autres microservices peuvent valider les tokens JWT en:
1. Partageant la même clé secrète JWT
2. Décodant le token
3. Vérifiant la signature et l'expiration

```java
// Dans les autres services
@Bean
public JwtUtil jwtUtil() {
    return new JwtUtil(); // Même implémentation
}
```

## 📦 Structure du projet

```
client-service/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/willbank/client/
│       │       ├── controller/
│       │       │   ├── AuthController.java
│       │       │   └── ClientController.java
│       │       ├── dto/
│       │       │   ├── LoginRequest.java
│       │       │   ├── LoginResponse.java
│       │       │   ├── RegisterRequest.java
│       │       │   ├── RefreshTokenRequest.java
│       │       │   ├── ChangePasswordRequest.java
│       │       │   └── ClientDTO.java
│       │       ├── entity/
│       │       │   └── Client.java
│       │       ├── exception/
│       │       │   ├── ClientNotFoundException.java
│       │       │   ├── ClientAlreadyExistsException.java
│       │       │   ├── InvalidCredentialsException.java
│       │       │   ├── TokenExpiredException.java
│       │       │   ├── InvalidTokenException.java
│       │       │   └── GlobalExceptionHandler.java
│       │       ├── repository/
│       │       │   └── ClientRepository.java
│       │       ├── security/
│       │       │   ├── JwtUtil.java
│       │       │   ├── JwtAuthenticationFilter.java
│       │       │   ├── CustomUserDetailsService.java
│       │       │   └── SecurityConfig.java
│       │       └── service/
│       │           ├── AuthService.java
│       │           └── ClientService.java
│       └── resources/
│           ├── application.yml
│           └── init-test-users.sql
├── pom.xml
├── AUTHENTICATION_README.md
├── QUICKSTART.md
├── ARCHITECTURE.md (ce fichier)
└── WillBank_Client_Service.postman_collection.json
```

## 🚀 Points d'extension futurs

### 1. Révocation de tokens
- Implémenter une blacklist de tokens
- Stocker dans Redis pour performance

### 2. Multi-factor Authentication (MFA)
- OTP par SMS/Email
- Authenticator apps (TOTP)

### 3. OAuth2/OpenID Connect
- Login via Google, Facebook, etc.
- SSO pour entreprises

### 4. Audit logging
- Log toutes les connexions
- Détection d'activités suspectes

### 5. Rate limiting
- Limiter les tentatives de connexion
- Protection contre brute force

### 6. Password policies
- Rotation obligatoire
- Historique des mots de passe
- Règles de complexité avancées

---

**Auteur:** WillBank Development Team  
**Version:** 1.0.0  
**Date:** Décembre 2025
