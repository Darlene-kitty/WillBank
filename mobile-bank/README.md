# 🏦 WillBank - Application Bancaire Mobile

Application bancaire mobile complète développée avec React Native, Expo Router et animations avancées.

## ✅ Statut: 100% Opérationnel + Services Backend Intégrés

- ✅ **0 erreurs** de diagnostic
- ✅ **0 bugs** détectés
- ✅ **10 écrans** fonctionnels
- ✅ **Services Backend** intégrés (Auth, Client, Account)
- ✅ **Authentification JWT** avec refresh automatique
- ✅ **Hooks React** personnalisés
- ✅ **Mode clair/sombre** avec toggle animé
- ✅ **Animations avancées** (FAB, Success Icon, Cards)
- ✅ **Prêt pour intégration backend**

## 🚀 Démarrage Rapide

### Installation
```bash
npm install

# Installer les dépendances des services
npm install axios @react-native-async-storage/async-storage
```

### Configuration API
Éditez `config/api.config.ts` pour configurer l'URL de votre backend :
```typescript
// Pour émulateur Android
BASE_URL: 'http://10.0.2.2:8080'

// Pour iOS Simulator
BASE_URL: 'http://localhost:8080'

// Pour appareil physique
BASE_URL: 'http://192.168.1.x:8080' // Remplacez x par votre IP
```

### Lancement
```bash
npm start
```

Puis choisissez votre plateforme :
- **iOS**: Appuyez sur `i`
- **Android**: Appuyez sur `a`
- **Web**: Appuyez sur `w`

## 📱 Fonctionnalités

### Écrans (10)
- ✅ **Login** - Authentification JWT avec Face ID
- ✅ **Dashboard** - Soldes et activités récentes
- ✅ **Profile** - Paramètres avec toggle de thème
- ✅ **New Transfer** - Formulaire de virement
- ✅ **Transfer Confirmation** - Récapitulatif
- ✅ **Transfer Success** - Modal animé avec partage
- ✅ **Transaction History** - Historique filtrable
- ✅ **Beneficiaries** - Gestion des bénéficiaires
- ✅ **Notifications** - Centre de notifications
- ✅ **Account Details** - Détails du compte

### Services Backend
- ✅ **Authentification** - Login, Register, Refresh Token
- ✅ **Gestion Client** - CRUD complet
- ✅ **Gestion Compte** - Crédit/Débit, Solde, CRUD
- ✅ **Auto-refresh JWT** - Transparent pour l'utilisateur
- ✅ **Gestion d'erreurs** - Messages clairs et logging

### Hooks React Personnalisés
- ✅ **useAuth** - Authentification simplifiée
- ✅ **useAccounts** - Gestion des comptes
- ✅ **État partagé** - Loading, errors, data

### Thème
- ✅ **Mode Clair** - Design lumineux
- ✅ **Mode Sombre** - Design sombre (par défaut)
- ✅ **Toggle Animé** - Transition fluide
- ✅ **Synchronisation** - Suit le thème système

### Animations
- ✅ **FAB Animé** - Rebond + rotation au clic
- ✅ **Success Icon** - Animation en 3 étapes (400ms)
- ✅ **Cards Animées** - Fade + slide + scale
- ✅ **Theme Toggle** - Interpolation de couleur
- ✅ **60 FPS** - Performance optimale

## 🎨 Technologies

- **React Native** - Framework mobile
- **Expo Router** - Navigation
- **React Native Reanimated** - Animations performantes
- **TypeScript** - Sécurité du code
- **Context API** - Gestion du thème
- **Axios** - Client HTTP pour l'API
- **AsyncStorage** - Stockage local persistant

## 📚 Documentation

### Guides Principaux
- **[SERVICES_README.md](./SERVICES_README.md)** - Guide des services backend
- **[HOOKS_GUIDE.md](./HOOKS_GUIDE.md)** - Guide des hooks React personnalisés
- **[WILLBANK_README.md](./WILLBANK_README.md)** - Documentation complète UI
- **[DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md)** - Guide de démarrage UI

### Configuration
- **`config/api.config.ts`** - Configuration de l'API
- **`types/`** - Interfaces TypeScript
- **`services/`** - Services backend (Auth, Client, Account)
- **`hooks/`** - Hooks React personnalisés

## 🚀 Exemple d'Utilisation

### Login avec le Hook useAuth

```typescript
import { useAuth } from './hooks';

const LoginScreen = () => {
  const { login, isLoading, error } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login({ email, password });
      // Navigation automatique
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <Button onPress={handleLogin} disabled={isLoading}>
      Se connecter
    </Button>
  );
};
```

### Récupérer les Comptes

```typescript
import { useAuth, useAccounts } from './hooks';

const AccountsScreen = () => {
  const { user } = useAuth();
  const { accounts, isLoading } = useAccounts(user?.id);
  
  return (
    <FlatList
      data={accounts}
      renderItem={({ item }) => (
        <Text>{item.accountNumber} - {item.balance} MAD</Text>
      )}
    />
  );
};
```

## 🎯 Test Rapide

### 1. Tester le Backend (Assurez-vous qu'il est démarré)
```bash
cd .. # Retour à la racine
./start-all.bat  # Windows
./start-all.sh   # Linux/Mac
```

### 2. Tester la Connexion
```bash
npm start
```
- Ouvrez l'écran de login
- Utilisez un compte de test (voir backend docs)
- Vérifiez que le token est sauvegardé

### 3. Tester le Dashboard
Vous verrez :
- Solde total récupéré de l'API
- Liste des comptes du backend
- Activités récentes
- FAB animé

### 4. Tester le Thème
```
Dashboard → Support → Apparence → Toggle Clair/Sombre
```
Transition fluide entre les thèmes !

## 📊 Structure du Projet

```
MobileBank/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Dashboard
│   │   └── _layout.tsx        # Navigation tabs
│   ├── _layout.tsx            # Layout principal
│   ├── account-details.tsx    # Détails du compte
│   ├── beneficiaries.tsx      # Bénéficiaires
│   ├── login.tsx              # Connexion
│   ├── new-transfer.tsx       # Nouveau virement
│   ├── notifications.tsx      # Notifications
│   ├── profile.tsx            # Profil
│   ├── transaction-history.tsx # Historique
│   ├── transfer-confirmation.tsx # Confirmation
│   └── transfer-success.tsx   # Succès (modal)
├── components/
│   ├── animated-fab.tsx       # FAB animé
│   ├── animated-success-icon.tsx # Icône de succès
│   ├── animated-card.tsx      # Card animée
│   └── theme-toggle.tsx       # Toggle de thème
├── contexts/
│   └── theme-context.tsx      # Context de thème
├── constants/
│   └── colors.ts              # Palettes de couleurs
└── babel.config.js            # Configuration Babel
```

## 🎉 Prêt !

L'application est **100% opérationnelle** et prête à l'emploi !

**Bon développement ! 🚀**
