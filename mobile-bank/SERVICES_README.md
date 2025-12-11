# Services WillBank - Application Mobile

Cette documentation décrit les services implémentés pour l'application mobile WillBank (React Native / Expo).

## 📁 Structure des Services

```
mobile-bank/
├── services/
│   ├── api.service.ts          # Client API avec intercepteurs JWT
│   ├── auth.service.ts         # Service d'authentification
│   ├── client.service.ts       # Service de gestion des clients
│   ├── account.service.ts      # Service de gestion des comptes
│   └── index.ts                # Export centralisé
├── types/
│   ├── client.types.ts         # Types et interfaces pour les clients
│   └── account.types.ts        # Types et interfaces pour les comptes
```

## 🚀 Installation des Dépendances

Les services nécessitent les packages suivants :

```bash
npm install axios @react-native-async-storage/async-storage
```

## 🔧 Configuration

### URL de l'API

Modifiez l'URL de base de l'API dans `services/api.service.ts` :

```typescript
const API_BASE_URL = 'http://localhost:8080'; // Pour émulateur Android
// ou
const API_BASE_URL = 'http://10.0.2.2:8080'; // Pour émulateur Android (alternative)
// ou
const API_BASE_URL = 'http://192.168.1.x:8080'; // Pour appareil physique
```

## 📝 Utilisation des Services

### 1. Service d'Authentification

```typescript
import { authService } from '../services';
import { LoginRequest, RegisterRequest } from '../types/client.types';

// Connexion
const loginData: LoginRequest = {
  email: 'user@example.com',
  password: 'Password123!',
  fcmToken: 'optional-fcm-token' // Pour les notifications push
};

try {
  const response = await authService.login(loginData);
  console.log('Access Token:', response.accessToken);
  console.log('User:', response.client);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Inscription
const registerData: RegisterRequest = {
  firstName: 'Ahmed',
  lastName: 'Alami',
  email: 'ahmed@example.com',
  password: 'Password123!',
  phone: '+212612345678',
  address: '123 Rue Mohammed V, Casablanca',
  cin: 'AB123456'
};

const response = await authService.register(registerData);

// Récupérer l'utilisateur courant
const currentUser = await authService.getCurrentUser();

// Changer le mot de passe
await authService.changePassword({
  currentPassword: 'OldPassword123!',
  newPassword: 'NewPassword123!'
});

// Vérifier l'authentification
const isAuth = await authService.isAuthenticated();

// Déconnexion
await authService.logout();
```

### 2. Service Client

```typescript
import { clientService } from '../services';

// Récupérer tous les clients (Admin/Agent)
const clients = await clientService.getAllClients();

// Récupérer un client par ID
const client = await clientService.getClientById(1);

// Créer un client (Admin/Agent)
const newClient = await clientService.createClient({
  firstName: 'Fatima',
  lastName: 'Benali',
  email: 'fatima@example.com',
  phone: '+212698765432',
  address: '45 Avenue Hassan II, Rabat',
  cin: 'CD789012'
});

// Mettre à jour un client
const updated = await clientService.updateClient(1, {
  ...client,
  phone: '+212612345679'
});

// Supprimer un client (Admin)
await clientService.deleteClient(1);
```

### 3. Service Compte

```typescript
import { accountService } from '../services';
import { AccountType } from '../types/account.types';

// Récupérer tous les comptes
const accounts = await accountService.getAllAccounts();

// Récupérer un compte par ID
const account = await accountService.getAccountById(1);

// Récupérer un compte par numéro
const account = await accountService.getAccountByNumber('MA001234567890123456');

// Récupérer tous les comptes d'un client
const clientAccounts = await accountService.getAccountsByClientId(1);

// Récupérer le solde d'un compte
const balance = await accountService.getAccountBalance(1);

// Créer un nouveau compte
const newAccount = await accountService.createAccount({
  clientId: 1,
  accountType: AccountType.SAVINGS // ou AccountType.CHECKING
});

// Mettre à jour un compte
const updated = await accountService.updateAccount(1, account);

// Créditer un compte
await accountService.creditAccount(1, 1000.50);

// Débiter un compte
await accountService.debitAccount(1, 500.00);

// Supprimer un compte
await accountService.deleteAccount(1);
```

## 🔐 Gestion Automatique du Token JWT

Le service API gère automatiquement :

1. **Ajout du token** : Le token JWT est ajouté automatiquement à chaque requête
2. **Refresh automatique** : Si le token expire (401), il est rafraîchi automatiquement
3. **Stockage sécurisé** : Les tokens sont stockés dans AsyncStorage
4. **Déconnexion automatique** : Si le refresh échoue, l'utilisateur est déconnecté

## 🎯 Exemple d'Intégration dans un Composant React Native

```typescript
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { authService } from '../services';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      
      Alert.alert('Succès', `Bienvenue ${response.client.firstName}!`);
      // Navigation vers l'écran principal
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Connexion...' : 'Se connecter'}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
};

export default LoginScreen;
```

## 🔄 Gestion des Erreurs

Tous les services gèrent les erreurs de manière cohérente :

```typescript
try {
  const data = await accountService.getAccountById(1);
} catch (error) {
  // error.message contient un message d'erreur lisible
  console.error(error.message);
  
  // Afficher à l'utilisateur
  Alert.alert('Erreur', error.message);
}
```

Types d'erreurs gérées :
- **Erreurs réseau** : "Impossible de contacter le serveur. Vérifiez votre connexion."
- **Erreurs serveur** : Messages d'erreur du backend
- **Token expiré** : Refresh automatique ou déconnexion

## 🧪 Tests

Pour tester les services, assurez-vous que :
1. Le backend est démarré (`http://localhost:8080`)
2. L'API Gateway route correctement les requêtes
3. Les services Eureka, Client et Account sont en ligne

## 📱 Configuration pour Appareil Physique

Si vous testez sur un appareil physique, modifiez l'URL de l'API :

```typescript
// Dans services/api.service.ts
const API_BASE_URL = 'http://192.168.1.x:8080'; // Remplacez x par votre IP locale
```

Pour trouver votre IP locale :
- Windows : `ipconfig`
- macOS/Linux : `ifconfig` ou `ip addr`

## 🔗 Endpoints API Utilisés

- **Auth** : `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`
- **Clients** : `/api/clients/*`
- **Comptes** : `/api/accounts/*`

## 📚 Documentation Complémentaire

- [APIs REST Documentation](../../doc/03-design/apis-rest-updated.md)
- [Client Service README](../../client-service/README.md)
- [Authentication README](../../client-service/AUTHENTICATION_README.md)
