# 📦 Installation des Dépendances - WillBank

## Application Mobile (React Native / Expo)

### Dépendances Requises

Pour que les services fonctionnent correctement, vous devez installer les packages suivants :

```bash
cd mobile-bank

# Installation des dépendances pour les services
npm install axios @react-native-async-storage/async-storage

# OU avec Yarn
yarn add axios @react-native-async-storage/async-storage
```

### Détails des Packages

#### 1. **axios** (^1.6.0)
- Client HTTP pour les appels API
- Gestion des intercepteurs
- Support des requêtes asynchrones
- Gestion automatique des erreurs

#### 2. **@react-native-async-storage/async-storage** (^1.21.0)
- Stockage persistant local pour React Native
- Utilisé pour stocker les tokens JWT
- Alternative à localStorage pour mobile
- Support natif iOS et Android

### Commandes d'Installation

```bash
# Naviguer vers le dossier mobile
cd mobile-bank

# Installer les dépendances
npm install

# Installer les packages manquants
npm install axios @react-native-async-storage/async-storage

# Pour iOS uniquement (après installation)
cd ios && pod install && cd ..

# Démarrer l'application
npm start
```

### Vérification de l'Installation

Après installation, votre `package.json` devrait contenir :

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    // ... autres dépendances
  }
}
```

## Application Web (Angular)

### Dépendances Déjà Installées

L'application Angular utilise les packages natifs Angular pour les appels HTTP :
- `@angular/common/http` : HttpClient pour les requêtes
- `@angular/core` : Services et injection de dépendances
- `rxjs` : Programmation réactive avec Observables

Aucune installation supplémentaire n'est nécessaire pour les services ! ✅

### Vérification

```bash
cd frontend-web

# Installer les dépendances si nécessaire
npm install

# Démarrer l'application
npm start
```

## 🚀 Démarrage Complet du Projet

### 1. Backend

```bash
# Démarrer tous les microservices
./start-all.bat  # Windows
./start-all.sh   # Linux/Mac

# Vérifier que tous les services sont démarrés :
# - Eureka Server : http://localhost:8761
# - API Gateway : http://localhost:8080
# - Client Service : http://localhost:8081
# - Account Service : http://localhost:8082
# - Transaction Service : http://localhost:8083
```

### 2. Application Mobile

```bash
cd mobile-bank

# Installation initiale
npm install
npm install axios @react-native-async-storage/async-storage

# Configuration de l'URL de l'API
# Éditer services/api.service.ts :
# const API_BASE_URL = 'http://10.0.2.2:8080'; // Pour émulateur Android
# const API_BASE_URL = 'http://localhost:8080'; // Pour iOS Simulator

# Démarrer
npm start

# Dans un autre terminal :
# Pour Android
npm run android

# Pour iOS
npm run ios
```

### 3. Application Web

```bash
cd frontend-web

# Installation
npm install

# Configuration de l'URL de l'API (déjà configuré)
# src/environments/environment.ts : apiUrl: 'http://localhost:8080'

# Démarrer
npm start

# Ouvrir http://localhost:4200
```

## 🔧 Configuration des URLs

### Mobile (services/api.service.ts)

```typescript
// Pour émulateur Android
const API_BASE_URL = 'http://10.0.2.2:8080';

// Pour iOS Simulator
const API_BASE_URL = 'http://localhost:8080';

// Pour appareil physique (remplacer X.X.X.X par votre IP locale)
const API_BASE_URL = 'http://X.X.X.X:8080';
```

### Web (src/environments/environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

## 🐛 Résolution des Problèmes

### Mobile : "Cannot find module 'axios'"

```bash
cd mobile-bank
npm install axios
```

### Mobile : "NativeModule: AsyncStorage is null"

```bash
cd mobile-bank
npm install @react-native-async-storage/async-storage

# Pour iOS
cd ios && pod install && cd ..

# Redémarrer l'application
npm start -- --reset-cache
```

### Mobile : "Network request failed"

1. Vérifier que le backend est démarré
2. Vérifier l'URL dans `services/api.service.ts`
3. Pour émulateur Android, utiliser `10.0.2.2` au lieu de `localhost`
4. Pour appareil physique, utiliser l'IP locale de votre machine

### Web : "CORS Error"

Vérifier la configuration CORS dans l'API Gateway :

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
    configuration.setAllowedMethods(Arrays.asList("*"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    // ...
}
```

## ✅ Checklist de Vérification

### Backend
- [ ] MySQL est démarré
- [ ] Eureka Server est accessible (http://localhost:8761)
- [ ] Client Service est enregistré dans Eureka
- [ ] Account Service est enregistré dans Eureka
- [ ] API Gateway route correctement les requêtes

### Mobile
- [ ] Dependencies installées (`axios`, `@react-native-async-storage/async-storage`)
- [ ] URL de l'API configurée correctement
- [ ] Application démarre sans erreur
- [ ] Peut accéder à l'écran de login

### Web
- [ ] Dependencies installées (`npm install`)
- [ ] URL de l'API configurée dans environment.ts
- [ ] Application démarre sur http://localhost:4200
- [ ] Peut accéder à l'écran de login

## 📚 Documentation

- [Services Mobile README](mobile-bank/SERVICES_README.md)
- [Services Web README](frontend-web/SERVICES_README.md)
- [APIs REST Documentation](doc/03-design/apis-rest-updated.md)
- [Résumé de l'Intégration](INTEGRATION_FRONTEND_SUMMARY.md)

## 🎯 Prêt à Tester !

Une fois toutes les installations terminées, vous pouvez :

1. **Tester l'authentification** : Login/Register
2. **Gérer les clients** : CRUD sur les clients
3. **Gérer les comptes** : Créer, consulter, créditer/débiter des comptes
4. **Vérifier le refresh automatique** : Laisser expirer le token et voir le refresh

Bon développement ! 🚀
