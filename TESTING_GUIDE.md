# 🧪 Guide de Test - Intégration Frontend

## ✅ Corrections Effectuées

### Application Web (Angular)
- ✅ Export de `LoginRequest` et type alias `User` depuis auth.service
- ✅ Remplacement de `User` par `Client` dans tous les composants
- ✅ Correction de `getCurrentUser()` en `getCurrentUserValue()`
- ✅ Mise à jour des imports dans navbar, login, profile, dashboard

### Application Mobile (React Native)
- ✅ Configuration API dans `config/api.config.ts`
- ✅ Services avec gestion automatique JWT
- ✅ Hooks React personnalisés

## 🚀 Test de l'Application Web

### 1. Vérifier que le Backend est Démarré

```bash
# Dans le dossier racine WillBank
./start-all.bat  # Windows
./start-all.sh   # Linux/Mac

# Vérifier les services :
# - Eureka: http://localhost:8761
# - API Gateway: http://localhost:8080
# - Client Service: http://localhost:8081
```

### 2. Démarrer l'Application Web

```bash
cd frontend-web
ng serve
```

L'application devrait démarrer sans erreurs sur **http://localhost:4200**

### 3. Tester l'Authentification

**Page de Login** : http://localhost:4200/login

Essayez avec un compte de test (si vous en avez créé un) :
```
Email: test@willbank.ma
Password: Test123!
```

Ou créez un nouveau compte :
- Cliquez sur "Créer un compte"
- Remplissez le formulaire d'inscription

### 4. Vérifier le Dashboard

Après connexion, vous devriez voir :
- Votre nom en haut à droite
- Le dashboard avec statistiques
- Les comptes (vides si nouveau client)

### 5. Tester le Profil

- Cliquez sur votre nom → Profil
- Vérifiez que vos informations s'affichent
- Essayez de modifier votre profil

## 📱 Test de l'Application Mobile

### 1. Installer les Dépendances

```bash
cd mobile-bank

# Installer les packages requis
npm install axios @react-native-async-storage/async-storage

# Pour iOS uniquement
cd ios && pod install && cd ..
```

### 2. Configurer l'URL de l'API

**Option A : Émulateur Android**
```typescript
// config/api.config.ts
BASE_URL: 'http://10.0.2.2:8080'
```

**Option B : iOS Simulator**
```typescript
BASE_URL: 'http://localhost:8080'
```

**Option C : Appareil Physique**
```bash
# Trouvez votre IP locale
ipconfig  # Windows
ifconfig  # Mac/Linux

# Puis dans config/api.config.ts
BASE_URL: 'http://192.168.1.X:8080'  # Remplacez X
```

### 3. Démarrer l'Application

```bash
# Démarrer le serveur Metro
npm start

# Dans un autre terminal :
# Pour Android
npm run android

# Pour iOS
npm run ios
```

### 4. Tester l'Authentification

**Écran de Login**
- Entrez vos identifiants
- Le token JWT devrait être sauvegardé automatiquement
- Vous êtes redirigé vers le dashboard

### 5. Tester avec les Hooks

```typescript
// Exemple dans un composant
import { useAuth, useAccounts } from './hooks';

const { user, login, logout } = useAuth();
const { accounts, loadAccountsByClient } = useAccounts(user?.id);
```

## 🔍 Vérifications Techniques

### Web - Console Développeur

1. **Ouvrir les DevTools** (F12)
2. **Onglet Network** :
   - Login : `POST /api/auth/login` → 200 OK
   - Get User : `GET /api/auth/me` → 200 OK
   - Comptes : `GET /api/accounts/client/{id}` → 200 OK

3. **Onglet Application → LocalStorage** :
   - `accessToken` doit être présent
   - `refreshToken` doit être présent
   - `currentUser` doit contenir vos infos

### Mobile - Logs

```bash
# Voir les logs
npx react-native log-android  # Android
npx react-native log-ios      # iOS

# Logs attendus :
# "Login successful"
# "Token saved"
# "Accounts loaded: 2"
```

## ❌ Dépannage

### Web : Erreurs de Compilation

**Problème** : Erreurs TypeScript
```
ng serve --configuration development
```

**Problème** : CORS Error
- Vérifier la configuration CORS dans le backend
- Le backend doit autoriser `http://localhost:4200`

### Mobile : Cannot Connect to Server

**Android Emulator** :
```typescript
// Utilisez 10.0.2.2 au lieu de localhost
BASE_URL: 'http://10.0.2.2:8080'
```

**Appareil Physique** :
- Assurez-vous d'être sur le même réseau Wi-Fi
- Utilisez votre IP locale (pas localhost)
- Vérifiez le pare-feu

### Backend Non Démarré

**Symptôme** : "Network Error" ou "Connection Refused"

**Solution** :
```bash
# Vérifier les services
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health

# Redémarrer si nécessaire
./start-all.bat
```

## ✅ Checklist de Test

### Web
- [ ] Compilation sans erreurs
- [ ] Login fonctionne
- [ ] Token JWT sauvegardé
- [ ] Dashboard affiche les données
- [ ] Profil modifiable
- [ ] Déconnexion fonctionne

### Mobile  
- [ ] Application démarre
- [ ] Login fonctionne
- [ ] Token JWT sauvegardé dans AsyncStorage
- [ ] Hooks fonctionnent
- [ ] Refresh automatique du token
- [ ] Navigation fluide

## 📊 Tests Postman (Optionnel)

Testez d'abord le backend directement :

```bash
# Import la collection
POSTMAN_COLLECTION.json

# Testez :
1. Auth → Login
2. Auth → Get Me
3. Accounts → Get Accounts by Client
```

## 🎉 Résultat Attendu

### Web
- ✅ Application compile sans erreur
- ✅ Login redirige vers dashboard
- ✅ Données utilisateur affichées
- ✅ Token JWT géré automatiquement

### Mobile
- ✅ Application démarre sur l'émulateur/appareil
- ✅ Login sauvegarde le token
- ✅ Hooks fournissent les données
- ✅ Navigation fonctionne

## 📚 Ressources

- [Services Web README](frontend-web/SERVICES_README.md)
- [Services Mobile README](mobile-bank/SERVICES_README.md)
- [Hooks Guide](mobile-bank/HOOKS_GUIDE.md)
- [APIs REST](doc/03-design/apis-rest-updated.md)

## 🆘 Besoin d'Aide ?

1. **Vérifier les logs** du backend et frontend
2. **Tester avec Postman** pour isoler le problème
3. **Vérifier la configuration** des URLs
4. **Consulter la documentation** des services

Bon test ! 🚀
