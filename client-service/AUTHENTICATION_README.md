# Client Service - Authentication Documentation

## Vue d'ensemble

Le microservice `client-service` de WillBank implémente un système complet d'authentification et d'autorisation basé sur JWT (JSON Web Tokens) avec Spring Security.

## Fonctionnalités d'authentification

### ✅ Fonctionnalités implémentées

1. **Enregistrement de nouveaux clients** avec validation des données
2. **Connexion avec email et mot de passe**
3. **Génération de JWT tokens** (access token + refresh token)
4. **Actualisation des tokens** via refresh token
5. **Changement de mot de passe** pour les utilisateurs authentifiés
6. **Protection des endpoints** avec autorisation basée sur les rôles
7. **Gestion du statut des clients** (ACTIVE, BLOCKED, PENDING, SUSPENDED)
8. **Rôles multiples** (CLIENT, ADMIN, AGENT)

## Architecture de sécurité

### Composants principaux

- **JwtUtil** : Génération et validation des JWT tokens
- **JwtAuthenticationFilter** : Filtre pour intercepter et valider les tokens
- **CustomUserDetailsService** : Chargement des détails utilisateur
- **SecurityConfig** : Configuration globale de la sécurité
- **AuthService** : Logique métier d'authentification
- **AuthController** : Endpoints REST d'authentification

### Configuration JWT

```yaml
jwt:
  secret: [SECRET_KEY_256_BITS]
  expiration: 86400000  # 24 heures
  refresh-expiration: 604800000  # 7 jours
```

## Endpoints d'authentification

### 1. Enregistrement (Register)

**POST** `/api/auth/register`

**Body:**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "password": "Password123!",
  "phone": "+33612345678",
  "address": "123 Rue de Paris, 75001 Paris",
  "cin": "AB123456"
}
```

**Réponse (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "client": {
    "id": 1,
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "phone": "+33612345678",
    "address": "123 Rue de Paris, 75001 Paris",
    "cin": "AB123456",
    "role": "CLIENT",
    "status": "ACTIVE",
    "lastLogin": "2025-12-04T10:30:00",
    "createdAt": "2025-12-04T10:30:00",
    "updatedAt": "2025-12-04T10:30:00"
  }
}
```

### 2. Connexion (Login)

**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "jean.dupont@example.com",
  "password": "Password123!"
}
```

**Réponse (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "client": {
    "id": 1,
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "role": "CLIENT",
    "status": "ACTIVE"
  }
}
```

### 3. Actualiser le token (Refresh Token)

**POST** `/api/auth/refresh`

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Réponse (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "client": { ... }
}
```

### 4. Changer le mot de passe (Change Password)

**PUT** `/api/auth/change-password`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword456!"
}
```

**Réponse (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

### 5. Obtenir le profil actuel (Get Current User)

**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Réponse (200 OK):**
```json
"Authenticated user: jean.dupont@example.com"
```

## Endpoints Clients (protégés)

Tous les endpoints `/api/clients/**` nécessitent une authentification avec token JWT.

### Obtenir tous les clients

**GET** `/api/clients`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Obtenir un client par ID

**GET** `/api/clients/{id}`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Créer un client (Admin/Agent seulement)

**POST** `/api/clients`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "firstName": "Marie",
  "lastName": "Martin",
  "email": "marie.martin@example.com",
  "phone": "+33698765432",
  "address": "456 Avenue des Champs, 75008 Paris",
  "cin": "CD789012"
}
```

## Règles de validation

### Mot de passe
- Minimum 8 caractères
- Au moins une lettre majuscule
- Au moins une lettre minuscule
- Au moins un chiffre
- Au moins un caractère spécial (@$!%*?&)

### Email
- Format email valide

### CIN
- Format alphanumérique (8-20 caractères)
- Lettres majuscules et chiffres uniquement

### Téléphone
- Format international
- 10 à 15 chiffres

## Gestion des rôles et statuts

### Rôles disponibles
- **CLIENT** : Client standard
- **ADMIN** : Administrateur avec tous les droits
- **AGENT** : Agent bancaire

### Statuts de compte
- **ACTIVE** : Compte actif et opérationnel
- **BLOCKED** : Compte bloqué (connexion refusée)
- **PENDING** : Compte en attente de validation
- **SUSPENDED** : Compte temporairement suspendu

## Sécurité

### Endpoints publics (sans authentification)
- `/api/auth/**` (login, register, refresh)
- `/api-docs/**`
- `/swagger-ui/**`
- `/actuator/**`

### Endpoints protégés (avec authentification)
- `/api/clients/**` - Requiert ROLE_CLIENT, ROLE_ADMIN ou ROLE_AGENT

### CORS
Configuré pour accepter les requêtes depuis :
- `http://localhost:4200` (Angular)
- `http://localhost:3000` (React Native/React)

## Gestion des erreurs

### Codes d'erreur

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Ressource créée |
| 400 | Données invalides |
| 401 | Non authentifié / Credentials invalides |
| 403 | Accès refusé |
| 404 | Ressource non trouvée |
| 409 | Conflit (client existe déjà) |
| 500 | Erreur serveur |

### Exemples de réponses d'erreur

**Credentials invalides (401):**
```json
{
  "status": 401,
  "message": "Invalid email or password",
  "timestamp": "2025-12-04T10:30:00"
}
```

**Token expiré (401):**
```json
{
  "status": 401,
  "message": "Token has expired",
  "timestamp": "2025-12-04T10:30:00"
}
```

**Client existe déjà (409):**
```json
{
  "status": 409,
  "message": "Client with email jean.dupont@example.com already exists",
  "timestamp": "2025-12-04T10:30:00"
}
```

**Validation des champs (400):**
```json
{
  "password": "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
  "email": "Email should be valid"
}
```

## Tests avec cURL

### 1. Enregistrer un nouveau client
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "password": "Password123!",
    "phone": "+33612345678",
    "address": "123 Rue de Paris, 75001 Paris",
    "cin": "AB123456"
  }'
```

### 2. Se connecter
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@example.com",
    "password": "Password123!"
  }'
```

### 3. Accéder à un endpoint protégé
```bash
curl -X GET http://localhost:8081/api/clients/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Changer le mot de passe
```bash
curl -X PUT http://localhost:8081/api/auth/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Password123!",
    "newPassword": "NewPassword456!"
  }'
```

### 5. Actualiser le token
```bash
curl -X POST http://localhost:8081/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Tests avec Postman

1. Créer une nouvelle collection "WillBank Client Service"
2. Configurer les variables d'environnement :
   - `base_url`: `http://localhost:8081`
   - `access_token`: (sera rempli automatiquement)
   - `refresh_token`: (sera rempli automatiquement)

3. Dans les Tests du endpoint Login, ajouter :
```javascript
var jsonData = pm.response.json();
pm.environment.set("access_token", jsonData.accessToken);
pm.environment.set("refresh_token", jsonData.refreshToken);
```

4. Pour les requêtes protégées, ajouter le header :
   - Key: `Authorization`
   - Value: `Bearer {{access_token}}`

## Intégration avec les autres microservices

### Validation du token dans d'autres services

Les autres microservices peuvent valider les tokens JWT en :

1. Partageant la même clé secrète JWT
2. Décodant le token pour extraire l'email et les rôles
3. Vérifiant la signature et la date d'expiration

### Exemple de configuration dans un autre service
```yaml
jwt:
  secret: [MÊME_SECRET_QUE_CLIENT_SERVICE]
```

## Base de données

### Migration du schéma

Avec `ddl-auto: update`, les nouvelles colonnes seront automatiquement ajoutées :
- `password` (VARCHAR)
- `role` (VARCHAR/ENUM)
- `status` (VARCHAR/ENUM)
- `last_login` (DATETIME)

### Index créés
- Index sur `email` pour optimiser les recherches
- Index sur `phone` pour les recherches par téléphone

## Logs et monitoring

Les logs sont configurés pour tracer :
- Les tentatives de connexion (succès/échec)
- Les enregistrements de nouveaux clients
- Les changements de mot de passe
- Les erreurs de validation de token
- Les erreurs d'authentification

## Recommandations de sécurité

1. **En production** :
   - Changer la clé secrète JWT
   - Utiliser HTTPS uniquement
   - Configurer des CORS stricts
   - Activer les logs d'audit
   - Mettre en place un rate limiting

2. **Gestion des tokens** :
   - Stocker les tokens de manière sécurisée côté client
   - Ne jamais exposer les tokens dans les URLs
   - Implémenter un mécanisme de révocation si nécessaire

3. **Mots de passe** :
   - Utiliser BCrypt pour le hachage (déjà configuré)
   - Implémenter une politique de rotation des mots de passe
   - Ajouter un mécanisme de réinitialisation par email

## Support et documentation

- **Swagger UI** : http://localhost:8081/swagger-ui.html
- **API Docs** : http://localhost:8081/api-docs
- **Actuator Health** : http://localhost:8081/actuator/health

---

**Auteur**: WillBank Development Team  
**Version**: 1.0.0  
**Date**: Décembre 2025
