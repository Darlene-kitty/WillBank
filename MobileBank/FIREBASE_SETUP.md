# Guide de Configuration Firebase pour WillBank Mobile

## Mode de fonctionnement

### 🚀 Mode Expo (Développement - ACTUEL)

L'application utilise actuellement une **version compatible Expo** qui :
- ✅ Fonctionne avec Expo Go
- ✅ Utilise un token FCM par défaut pour le développement
- ✅ Permet de tester tout le workflow d'inscription
- ⚠️ Les notifications push réelles nécessitent un build natif

**Token FCM par défaut** : `6w088Q-tg6lOvFDlIM81GxI7oFXGZvczzNs2O8aHYA8`

### 🔧 Mode Natif (Production - Optionnel)

Pour activer les vraies notifications push, il faudra :
1. Créer un build de développement avec EAS
2. Réinstaller les packages Firebase natifs
3. Reconfigurer les plugins dans `app.json`

## Prérequis

- Node.js et npm installés
- Expo CLI installé (`npm install -g expo-cli`)
- Backend WillBank en cours d'exécution (port 8081)

## Installation des dépendances

```bash
cd MobileBank
npm install
```

**Note** : Les packages Firebase natifs (@react-native-firebase) ont été retirés pour la compatibilité avec Expo Go. Le service utilise maintenant un token par défaut.

## Configuration Firebase (Mode Expo)

### 1. Service Firebase (services/firebaseService.ts)

Le service a été simplifié pour fonctionner avec Expo :
- Retourne toujours le token par défaut
- Simule les permissions
- Pas de dépendances natives

### 2. Token FCM par défaut

Un token par défaut est automatiquement utilisé :
```
6w088Q-tg6lOvFDlIM81GxI7oFXGZvczzNs2O8aHYA8
```

Ce token est envoyé au backend lors de l'inscription et permet de tester le workflow complet.

## Lancement de l'application

### ✅ Expo Go (Mode Actuel - Recommandé)

```bash
cd MobileBank
npm start
```

Puis scannez le QR code avec :
- **Android** : Expo Go app
- **iOS** : Caméra native

**Avantages** :
- ✅ Pas besoin de build
- ✅ Rechargement rapide
- ✅ Fonctionne immédiatement
- ✅ Workflow d'inscription complet fonctionnel

**Limitations** :
- ⚠️ Notifications push simulées (token par défaut)
- ℹ️ Les emails de bienvenue sont bien envoyés
- ℹ️ Le backend traite les notifications correctement

### 🔧 Build Natif (Pour vraies notifications push - Optionnel)

Si vous souhaitez tester les vraies notifications push :

```bash
# Réinstaller Firebase
npm install @react-native-firebase/app @react-native-firebase/messaging

# Mettre à jour app.json pour ajouter les plugins Firebase
# Puis créer un build
npx expo run:android
```

## Test du workflow d'inscription

1. **Démarrer le backend**
   ```bash
   cd d:\Projects\WillBank
   ./start-all.bat  # Windows
   # ou
   ./start-all.sh   # Linux/Mac
   ```

2. **Vérifier que le client-service est accessible**
   - URL: http://localhost:8081
   - Swagger UI: http://localhost:8081/swagger-ui.html

3. **Lancer l'application mobile**
   ```bash
   cd MobileBank
   npm start
   ```

4. **Tester l'inscription**
   - Ouvrir l'app
   - Cliquer sur "Créer un compte"
   - Remplir le formulaire :
     * Prénom: John
     * Nom: Doe
     * Email: john.doe@example.com
     * Téléphone: +33612345678
     * Adresse: 123 Rue de Paris
     * CIN: AB123456
     * Mot de passe: password123
   - Cliquer sur "S'inscrire"

5. **Vérifier les résultats**
   - L'utilisateur devrait être redirigé vers le dashboard
   - Vérifier les logs backend pour :
     ```
     INFO - Client registered successfully with ID: X
     INFO - Welcome email sent to: john.doe@example.com
     INFO - Welcome push notification sent successfully
     ```
   - Vérifier la réception de l'email
   - Vérifier la notification push (si build natif)

## Permissions Android

Les permissions suivantes sont ajoutées automatiquement :
- `android.permission.INTERNET`
- `com.google.android.c2dm.permission.RECEIVE`

## Débogage

### Vérifier le token FCM

Dans les logs de l'app, vous devriez voir :
```
Initializing Firebase notifications...
Firebase permission requested (Expo mode - using default token)
Using default FCM token for development
FCM Token initialized: 6w088Q-tg6lOv...
```

### Tester manuellement une notification

Utilisez Postman ou curl pour envoyer une requête au backend :

```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+33612345678",
    "address": "123 Test Street",
    "cin": "TEST123",
    "fcmToken": "6w088Q-tg6lOvFDlIM81GxI7oFXGZvczzNs2O8aHYA8"
  }'
```

### Logs utiles

**Mobile :**
```bash
# Logs React Native
npx react-native log-android  # Android
npx react-native log-ios      # iOS
```

**Backend :**
- Vérifier `client-service/logs/spring.log`
- Vérifier la console du service

## Troubleshooting

### Problème : "Unable to resolve @react-native-firebase/app"

**Solution :** 
- ✅ Déjà résolu ! Les packages Firebase natifs ont été retirés
- L'app utilise maintenant une version compatible Expo
- Pas besoin de configuration native

### Problème : "Firebase not initialized"

**Solution :** 
- C'est normal en mode Expo
- Le service utilise automatiquement le token par défaut
- Le workflow fonctionne quand même complètement

### Problème : "No FCM token"

**Solution :** 
- ✅ Le token par défaut est utilisé automatiquement
- Pas besoin d'action, le workflow fonctionne
- Pour un vrai token, créez un build natif (voir section "Build Natif")

### Problème : "Permission denied"

**Solution :**
- En mode Expo, les permissions sont simulées
- Retourne toujours `true`
- Pas d'impact sur le fonctionnement

### Problème : Email non reçu

**Solution :**
- Vérifier la configuration SMTP dans `client-service/application.yml`
- Vérifier les logs backend pour des erreurs d'envoi
- Vérifier le dossier spam

## Fonctionnalités implémentées

✅ Création de compte avec formulaire complet
✅ Validation des champs
✅ Token FCM par défaut (compatible Expo)
✅ Envoi automatique d'email de bienvenue
✅ Backend traite les notifications push
✅ Sauvegarde des tokens JWT
✅ Redirection automatique vers le dashboard
✅ Gestion des erreurs avec messages clairs
✅ Logs détaillés pour le débogage
✅ Compatible Expo Go (pas de build nécessaire)

## Mode de fonctionnement des notifications

### En mode Expo (actuel)
- Le token par défaut `6w088Q-tg6lOvFDlIM81GxI7oFXGZvczzNs2O8aHYA8` est envoyé au backend
- Le backend accepte et traite le token
- Les emails sont envoyés normalement
- Les notifications push sont loggées côté backend
- Pas de notification push visible sur le mobile (mode simulation)

### En mode natif (après build)
- Un vrai token FCM est généré
- Les notifications push arrivent réellement sur l'appareil
- Toutes les fonctionnalités Firebase sont actives

## Ressources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase](https://rnfirebase.io/)
- [Expo Documentation](https://docs.expo.dev/)
- [Spring Boot Firebase Admin](https://firebase.google.com/docs/admin/setup)

## Support

Pour toute question ou problème :
1. Vérifier les logs (mobile + backend)
2. Consulter `REGISTRATION_WORKFLOW.md` pour le détail du workflow
3. Vérifier la configuration Firebase dans le projet
