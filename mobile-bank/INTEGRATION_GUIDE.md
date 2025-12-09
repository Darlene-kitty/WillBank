# 🚀 Guide de Démarrage - Application Mobile WillBank

## ✅ Intégration Terminée

L'application mobile React Native a été complètement intégrée avec le backend Spring Boot.

### Ce qui a été fait :

1. **✅ AuthContext** - Gestion globale de l'authentification
2. **✅ Login** - Connexion avec API réelle + gestion d'erreurs
3. **✅ Register** - Inscription avec validation complète
4. **✅ Dashboard** - Affichage des comptes depuis l'API
5. **✅ Profile** - Données utilisateur réelles
6. **✅ Protection des routes** - Redirection automatique si non connecté

---

## 🎯 Démarrage Rapide

### 1. Vérifier que le Backend est Lancé

Assurez-vous que tous les services Spring Boot sont démarrés dans IntelliJ :
- ✅ Eureka Server (port 8761)
- ✅ API Gateway (port 8080)
- ✅ Client Service (port 8081)
- ✅ Account Service (port 8082)
- ✅ Notification Service (port 8083)

### 2. Lancer l'Application Mobile

```bash
cd mobile-bank

# Démarrer Metro (serveur de développement)
npm start

# Dans un autre terminal :
# Pour Android
npm run android

# Pour iOS (Mac uniquement)
npm run ios
```

---

## 📱 Configuration par Plateforme

### Android Emulator

L'URL de l'API est déjà configurée pour l'émulateur Android :

```typescript
// config/api.config.ts
BASE_URL: 'http://10.0.2.2:8080'
```

**Note** : `10.0.2.2` est l'adresse IP spéciale qui pointe vers `localhost` de votre machine depuis l'émulateur Android.

### iOS Simulator

Modifiez `config/api.config.ts` :

```typescript
BASE_URL: 'http://localhost:8080'
```

### Appareil Physique (Android ou iOS)

1. Trouvez votre IP locale :
```bash
# Windows
ipconfig
# Cherchez "IPv4 Address" de votre carte réseau Wi-Fi

# Mac/Linux
ifconfig
# Cherchez "inet" de votre interface réseau
```

2. Modifiez `config/api.config.ts` :
```typescript
BASE_URL: 'http://192.168.1.XXX:8080'  // Remplacez XXX par votre IP
```

3. Assurez-vous que :
   - Votre téléphone et PC sont sur le même réseau Wi-Fi
   - Le pare-feu Windows autorise les connexions sur le port 8080

---

## 🧪 Test de l'Application

### 1. Écran de Login

L'application démarre sur l'écran de **login** :

**Option A : Créer un nouveau compte**
1. Cliquez sur "Créer un compte"
2. Remplissez le formulaire :
   - Prénom : `Mohamed`
   - Nom : `Alami`
   - Email : `mohamed.alami@gmail.com`
   - Téléphone : `+212 6 12 34 56 78`
   - Adresse : `10 Rue Hassan II, Casablanca`
   - CIN : `AB123456`
   - Mot de passe : `Test123!`
3. Cliquez sur "S'inscrire"
4. ✅ Vous serez automatiquement connecté et redirigé vers le dashboard

**Option B : Utiliser un compte existant**

Si vous avez déjà créé un compte via Postman ou l'application web :
```
Email: votre-email@example.com
Mot de passe: votre-mot-de-passe
```

### 2. Dashboard

Après connexion, vous verrez :

- ✅ **Votre nom** en haut : "Bonjour, Mohamed"
- ✅ **Solde total** de tous vos comptes
- ✅ **Liste des comptes** (s'ils existent)
  - Compte Courant / Compte Épargne
  - Numéro de compte masqué
  - Solde actuel
  - Statut (Actif/Bloqué)

**Si aucun compte n'existe** :
- Message : "Aucun compte disponible"
- Créez un compte via Postman ou l'interface admin web

### 3. Profil Utilisateur

1. Cliquez sur l'icône **profil** dans la barre du bas
2. Vous verrez :
   - ✅ Vos initiales dans l'avatar
   - ✅ Votre nom complet
   - ✅ Votre email
   - ✅ Téléphone, adresse, CIN

3. Testez la **déconnexion** :
   - Cliquez sur "Déconnexion" en bas
   - Confirmez → retour à l'écran de login

---

## 🔍 Débogage

### Voir les Logs en Temps Réel

**Android** :
```bash
npx react-native log-android
```

**iOS** :
```bash
npx react-native log-ios
```

### Logs Attendus (succès)

```
Login successful
Token saved to AsyncStorage
User: { id: 1, firstName: "Mohamed", ... }
Accounts loaded: 2
```

### Erreurs Communes

#### ❌ "Network Error" ou "Connection Refused"

**Cause** : Le backend n'est pas accessible

**Solutions** :
1. Vérifiez que tous les services Spring Boot sont démarrés dans IntelliJ
2. Testez l'API Gateway : http://localhost:8080/actuator/health
3. Vérifiez l'URL dans `config/api.config.ts` :
   - Android : `http://10.0.2.2:8080`
   - iOS : `http://localhost:8080`
   - Physique : `http://VOTRE_IP:8080`

#### ❌ "Email ou mot de passe incorrect"

**Cause** : Identifiants invalides

**Solutions** :
1. Créez un nouveau compte via l'app mobile
2. Ou utilisez un compte existant créé dans Postman/Web
3. Vérifiez l'email et mot de passe

#### ❌ "Aucun compte disponible"

**Cause** : Le client n'a pas encore de comptes bancaires

**Solutions** :
1. Créez un compte via Postman :
```json
POST http://localhost:8080/api/accounts
{
  "clientId": 1,
  "accountType": "CHECKING",
  "balance": 1000.0
}
```
2. Ou via l'interface admin web

#### ❌ Metro Bundler ne démarre pas

**Solution** :
```bash
cd mobile-bank
npx react-native start --reset-cache
```

---

## 📋 Fonctionnalités Intégrées

| Fonctionnalité | Status | Description |
|----------------|--------|-------------|
| **Login** | ✅ | Authentification JWT avec backend |
| **Register** | ✅ | Inscription avec validation |
| **Dashboard** | ✅ | Affichage des comptes réels |
| **Profile** | ✅ | Données utilisateur depuis API |
| **Logout** | ✅ | Déconnexion + nettoyage AsyncStorage |
| **Token Refresh** | ✅ | Rafraîchissement automatique JWT |
| **Protection Routes** | ✅ | Redirection si non authentifié |
| **Pull to Refresh** | ✅ | Recharger les comptes |
| **Loading States** | ✅ | Indicateurs de chargement |
| **Error Handling** | ✅ | Messages d'erreur |

---

## 🔐 Flux d'Authentification

```
1. User entre email/password
   ↓
2. POST /api/auth/login
   ↓
3. Backend retourne JWT tokens
   ↓
4. Tokens sauvegardés dans AsyncStorage
   ↓
5. User stocké dans AuthContext
   ↓
6. Redirection vers Dashboard
   ↓
7. GET /api/accounts/client/{id}
   ↓
8. Affichage des comptes
```

**Requêtes Automatiques** :
- Toutes les requêtes API incluent automatiquement le token JWT
- Si le token expire (401), refresh automatique
- Si refresh échoue, déconnexion automatique

---

## 📦 Structure du Code

```
mobile-bank/
├── contexts/
│   ├── auth-context.tsx        ← ✅ Gestion auth globale
│   └── theme-context.tsx
├── services/
│   ├── api.service.ts          ← ✅ Client HTTP avec intercepteurs
│   ├── auth.service.ts         ← ✅ Login, register, refresh
│   ├── client.service.ts       ← ✅ Gestion clients
│   └── account.service.ts      ← ✅ Gestion comptes
├── hooks/
│   ├── useAuth.ts              ← ✅ Hook d'authentification
│   └── useAccounts.ts          ← ✅ Hook de gestion comptes
├── types/
│   ├── client.types.ts         ← ✅ Types TypeScript
│   └── account.types.ts
├── config/
│   └── api.config.ts           ← ✅ Configuration API
└── app/
    ├── _layout.tsx             ← ✅ AuthProvider intégré
    ├── login.tsx               ← ✅ Login avec API
    ├── register.tsx            ← ✅ Inscription avec API
    ├── profile.tsx             ← ✅ Profil réel
    └── (tabs)/
        └── index.tsx           ← ✅ Dashboard avec comptes réels
```

---

## 🎉 Prochaines Étapes

Fonctionnalités à implémenter (optionnelles) :

1. **Transactions** : Afficher l'historique des transactions
2. **Transferts** : Intégrer l'API de transfert d'argent
3. **Notifications** : Firebase Cloud Messaging
4. **Biométrie** : Face ID / Touch ID
5. **Bénéficiaires** : Gérer les bénéficiaires de transferts

---

## 📚 Documentation

- [Services README](SERVICES_README.md) - Documentation des services
- [Hooks Guide](HOOKS_GUIDE.md) - Utilisation des hooks
- [APIs REST](../doc/03-design/apis-rest-updated.md) - Documentation backend

---

## 🆘 Support

**Problème de connexion ?**
1. Vérifiez les logs Android/iOS
2. Testez l'API avec Postman
3. Vérifiez l'URL dans `config/api.config.ts`
4. Assurez-vous que le backend est lancé

**L'app plante au démarrage ?**
```bash
# Réinstaller les dépendances
rm -rf node_modules
npm install

# Nettoyer le cache
npx react-native start --reset-cache

# Android : Nettoyer le build
cd android && ./gradlew clean && cd ..
```

---

**Dernière mise à jour** : 8 Décembre 2024
**Status** : ✅ Intégration mobile terminée - Prêt pour les tests !
