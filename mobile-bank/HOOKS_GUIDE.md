# 🎣 Hooks React Personnalisés - WillBank Mobile

Cette documentation explique comment utiliser les hooks personnalisés pour faciliter l'intégration des services dans vos composants React.

## 📋 Hooks Disponibles

### 1. `useAuth` - Gestion de l'Authentification

Hook pour gérer l'état d'authentification et les opérations associées.

#### Utilisation de Base

```typescript
import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks';

const LoginScreen = () => {
  const { login, isLoading, error, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login({ email, password });
      // Navigation automatique ou message de succès
    } catch (err) {
      // L'erreur est déjà gérée dans le hook
      console.error('Login failed');
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (isAuthenticated && user) {
    return <Text>Bienvenue {user.firstName}!</Text>;
  }

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
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button title="Se connecter" onPress={handleLogin} disabled={isLoading} />
    </View>
  );
};
```

#### API du Hook

```typescript
const {
  user,              // Client | null - Utilisateur connecté
  isAuthenticated,   // boolean - État d'authentification
  isLoading,         // boolean - Chargement en cours
  error,             // string | null - Message d'erreur
  login,             // (credentials) => Promise - Connexion
  register,          // (data) => Promise - Inscription
  logout,            // () => Promise - Déconnexion
  refreshUser,       // () => Promise - Rafraîchir l'utilisateur
  checkAuth,         // () => Promise - Vérifier l'authentification
} = useAuth();
```

#### Exemple d'Inscription

```typescript
const RegisterScreen = () => {
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    cin: '',
  });

  const handleRegister = async () => {
    try {
      await register(formData);
      // Rediriger vers le dashboard
    } catch (err) {
      // Erreur affichée via le hook
    }
  };

  return (
    <View>
      {/* Formulaire d'inscription */}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button title="S'inscrire" onPress={handleRegister} disabled={isLoading} />
    </View>
  );
};
```

#### Exemple de Guard d'Authentification

```typescript
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks';

const ProtectedScreen = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return <View>{/* Contenu protégé */}</View>;
};
```

---

### 2. `useAccounts` - Gestion des Comptes

Hook pour gérer les comptes bancaires d'un client.

#### Utilisation de Base

```typescript
import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button } from 'react-native';
import { useAuth, useAccounts } from '../hooks';

const AccountsScreen = () => {
  const { user } = useAuth();
  const { 
    accounts, 
    isLoading, 
    error, 
    loadAccountsByClient,
    getBalance 
  } = useAccounts(user?.id);

  useEffect(() => {
    if (user?.id) {
      loadAccountsByClient(user.id);
    }
  }, [user?.id]);

  const handleGetBalance = async (accountId: number) => {
    try {
      const balance = await getBalance(accountId);
      console.log('Balance:', balance);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  return (
    <View>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.accountNumber}</Text>
            <Text>Type: {item.accountType}</Text>
            <Text>Solde: {item.balance} MAD</Text>
            <Button 
              title="Voir solde" 
              onPress={() => handleGetBalance(item.id!)} 
            />
          </View>
        )}
      />
    </View>
  );
};
```

#### API du Hook

```typescript
const {
  accounts,              // Account[] - Liste des comptes
  selectedAccount,       // Account | null - Compte sélectionné
  isLoading,            // boolean - Chargement en cours
  error,                // string | null - Message d'erreur
  loadAccountsByClient, // (clientId) => Promise - Charger les comptes d'un client
  loadAccount,          // (accountId) => Promise - Charger un compte
  getBalance,           // (accountId) => Promise<number> - Obtenir le solde
  createAccount,        // (request) => Promise - Créer un compte
  creditAccount,        // (accountId, amount) => Promise - Créditer
  debitAccount,         // (accountId, amount) => Promise - Débiter
  refresh,              // () => Promise - Rafraîchir la liste
} = useAccounts(clientId?);
```

#### Exemple de Création de Compte

```typescript
import { AccountType } from '../types';

const CreateAccountScreen = () => {
  const { user } = useAuth();
  const { createAccount, isLoading, error } = useAccounts();
  const [accountType, setAccountType] = useState<AccountType>(AccountType.CHECKING);

  const handleCreateAccount = async () => {
    try {
      const newAccount = await createAccount({
        clientId: user!.id!,
        accountType,
      });
      console.log('Compte créé:', newAccount);
      // Rediriger ou afficher un message de succès
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  return (
    <View>
      {/* Sélecteur de type de compte */}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button 
        title="Créer le compte" 
        onPress={handleCreateAccount} 
        disabled={isLoading} 
      />
    </View>
  );
};
```

#### Exemple de Crédit/Débit

```typescript
const TransactionScreen = () => {
  const { user } = useAuth();
  const { 
    accounts, 
    creditAccount, 
    debitAccount, 
    isLoading 
  } = useAccounts(user?.id);
  const [amount, setAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  const handleCredit = async () => {
    if (selectedAccountId && amount) {
      try {
        await creditAccount(selectedAccountId, parseFloat(amount));
        // Message de succès
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDebit = async () => {
    if (selectedAccountId && amount) {
      try {
        await debitAccount(selectedAccountId, parseFloat(amount));
        // Message de succès
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <View>
      {/* Sélecteur de compte et montant */}
      <Button title="Créditer" onPress={handleCredit} disabled={isLoading} />
      <Button title="Débiter" onPress={handleDebit} disabled={isLoading} />
    </View>
  );
};
```

---

## 🎯 Exemples Avancés

### Combinaison de Plusieurs Hooks

```typescript
const DashboardScreen = () => {
  const { user, logout } = useAuth();
  const { accounts, isLoading, refresh } = useAccounts(user?.id);

  const handleRefresh = async () => {
    await refresh();
  };

  const handleLogout = async () => {
    await logout();
    // Redirection vers login
  };

  return (
    <View>
      <Text>Bonjour {user?.firstName}!</Text>
      <Text>Vous avez {accounts.length} compte(s)</Text>
      
      <Button title="Rafraîchir" onPress={handleRefresh} />
      <Button title="Déconnexion" onPress={handleLogout} />
      
      {isLoading && <ActivityIndicator />}
    </View>
  );
};
```

### Gestion d'État Global avec Context

```typescript
import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks';

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
```

---

## ✅ Avantages des Hooks

1. **Simplicité** : Logique d'authentification et de gestion des comptes encapsulée
2. **Réutilisabilité** : Utilisable dans n'importe quel composant
3. **État géré** : Gestion automatique du loading, errors, et data
4. **Type-safe** : Entièrement typé avec TypeScript
5. **Découplage** : Séparation de la logique métier et de l'UI

---

## 📚 Documentation Complémentaire

- [Services README](../SERVICES_README.md)
- [Types Documentation](../types/index.ts)
- [React Hooks Documentation](https://react.dev/reference/react)

---

## 🐛 Résolution des Problèmes

### "Cannot find module '../hooks'"

Vérifiez que vous importez depuis le bon chemin :
```typescript
import { useAuth, useAccounts } from '../hooks';
// ou
import { useAuth } from '../hooks/useAuth';
```

### "Hook is not updating"

Assurez-vous que le composant est bien dans un arbre React et que les dépendances sont correctes.

### "User is null after login"

Vérifiez que le backend retourne bien les données utilisateur dans la réponse de login.

---

Bon développement ! 🚀
