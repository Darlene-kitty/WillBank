# Workflow de Création de Compte et Notifications

## Vue d'ensemble

Ce document décrit le workflow complet de création de compte utilisateur dans l'application mobile WillBank, incluant l'envoi automatique de notifications par email et push via Firebase Cloud Messaging (FCM).

## Architecture du Workflow

```
[Mobile App] → [Backend API] → [Email Service + FCM]
     ↓              ↓                    ↓
  Register      Save User         Send Welcome Notifications
                                  (Email + Push)
```

## Étapes du Workflow

### 1. Utilisateur remplit le formulaire d'inscription

**Écran**: `app/(auth)/register.tsx`

L'utilisateur fournit les informations suivantes :
- Prénom
- Nom
- Email
- Téléphone
- Adresse
- Numéro CIN
- Mot de passe (minimum 6 caractères)

### 2. Récupération automatique du token FCM

**Service**: `services/firebaseService.ts`

Avant l'envoi de la requête d'inscription :
- Le service `firebaseService.getFCMToken()` est appelé automatiquement
- Si Firebase est configuré, un vrai token est récupéré
- Sinon, un token par défaut est utilisé : `6w088Q-tg6lOvFDlIM81GxI7oFXGZvczzNs2O8aHYA8`

```typescript
// Token FCM récupéré automatiquement
const fcmToken = await firebaseService.getFCMToken();
```

### 3. Envoi de la requête d'inscription

**Service**: `services/authService.ts`

La méthode `authService.register()` envoie une requête POST à `/api/auth/register` avec :
```typescript
{
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phone: string,
  address: string,
  cin: string,
  fcmToken: string  // Inclus automatiquement
}
```

### 4. Backend crée le compte

**Backend**: `client-service/controller/AuthController.java`

Le backend :
1. Valide les données d'inscription
2. Vérifie que l'email et le CIN ne sont pas déjà utilisés
3. Encode le mot de passe
4. Sauvegarde l'utilisateur dans la base de données
5. Génère les tokens JWT (access + refresh)

### 5. Envoi des notifications automatiques

**Backend**: `client-service/service/AuthService.java`

Dès que le compte est créé avec succès, le backend envoie **automatiquement** :

#### A. Email de bienvenue
```java
emailService.sendWelcomeEmail(
    savedClient.getEmail(),
    savedClient.getFirstName(),
    savedClient.getLastName()
);
```

#### B. Notification push via FCM
```java
pushNotificationService.sendWelcomePushNotification(
    savedClient.getFcmToken(),
    savedClient.getFirstName()
);
```

**Contenu de la notification push** :
- **Titre** : "Bienvenue chez WillBank !"
- **Corps** : "Bonjour {Prénom}, votre compte a été créé avec succès."
- **Type** : WELCOME
- **Couleur** : #0D47A1 (bleu WillBank)

### 6. Réponse au client mobile

Le backend retourne :
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "client": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+33612345678",
    "address": "123 Rue de Paris",
    "cin": "AB123456",
    "role": "CLIENT",
    "status": "ACTIVE"
  }
}
```

### 7. Sauvegarde locale et redirection

**Mobile**: `app/(auth)/register.tsx`

L'application mobile :
1. Sauvegarde les tokens JWT dans AsyncStorage
2. Met à jour le contexte d'authentification
3. Affiche un message de succès
4. Redirige vers le dashboard

```typescript
// Sauvegarde automatique
await AsyncStorage.multiSet([
  ['authToken', accessToken],
  ['refreshToken', refreshToken],
  ['clientId', client.id.toString()],
]);

// Redirection
router.replace('/(tabs)/');
```

### 8. Réception des notifications

#### Email
L'utilisateur reçoit un email de bienvenue à l'adresse fournie lors de l'inscription.

#### Push Notification
Si l'application est :
- **Au premier plan** : La notification est affichée dans l'app via `onMessage()`
- **En arrière-plan** : Notification système standard
- **Fermée** : Notification système, avec `getInitialNotification()` au prochain démarrage

## Configuration Firebase

### Mobile (React Native)

**Fichiers de configuration** :
- `MobileBank/android/app/google-services.json` : Configuration Google Services
- `MobileBank/config/firebase.ts` : Configuration Firebase
- `MobileBank/services/firebaseService.ts` : Service de gestion FCM

**Initialisation** :
```typescript
// Dans app/_layout.tsx
useEffect(() => {
  const initFirebase = async () => {
    await firebaseService.requestPermission();
    firebaseService.setupNotificationListeners();
    await firebaseService.getFCMToken();
  };
  initFirebase();
}, []);
```

### Backend (Spring Boot)

**Fichiers de configuration** :
- `client-service/src/main/resources/serviceAccountKey.json` : Clé de service Firebase Admin
- `client-service/src/main/java/com/willbank/client/google-services.json` : Configuration

**Service** :
- `PushNotificationService.java` : Gestion des notifications push
- Firebase Admin SDK initialisé au démarrage de l'application

## Gestion des erreurs

### Si Firebase n'est pas disponible

Le service utilise un token par défaut :
```typescript
fcmToken = '6w088Q-tg6lOvFDlIM81GxI7oFXGZvczzNs2O8aHYA8';
```

Le backend :
- Vérifie si le token est valide avant d'envoyer
- Log les erreurs mais ne bloque pas l'inscription
- L'envoi de notification est asynchrone (`@Async`)

### Si l'email échoue

L'inscription réussit quand même, seule la notification email échoue.

## Token par défaut

Pour le développement et les tests, un token FCM par défaut est configuré :
```
6w088Q-tg6lOvFDlIM81GxI7oFXGZvczzNs2O8aHYA8
```

Ce token est utilisé quand :
- Firebase n'est pas configuré
- Les permissions sont refusées
- Une erreur survient lors de la récupération du token

## Flux de première connexion

En bonus, lors de la première connexion après inscription :
1. Le backend détecte que `lastLogin` est null
2. Envoie automatiquement :
   - Email "Première connexion réussie"
   - Notification push "Bienvenue dans votre espace WillBank"

## Tests

### Test manuel

1. Lancer le backend : `./start-all.bat` ou `./start-all.sh`
2. Lancer l'app mobile : `cd MobileBank && npm start`
3. Cliquer sur "Créer un compte"
4. Remplir le formulaire
5. Cliquer sur "S'inscrire"
6. Vérifier :
   - Redirection vers le dashboard
   - Réception de l'email de bienvenue
   - Notification push (si configuré)

### Logs backend

Vérifier les logs du `client-service` :
```
INFO - Registration attempt for email: john.doe@example.com
INFO - Client registered successfully with ID: 1
INFO - Sending welcome email to: john.doe@example.com
INFO - Sending welcome push notification to token: 6w088Q-tg6lOv...
INFO - Welcome push notification sent successfully
```

## Sécurité

- Les mots de passe sont encodés avec BCrypt
- Les tokens JWT ont une durée de vie limitée
- Le token FCM est stocké de manière sécurisée
- Les permissions de notification sont demandées à l'utilisateur

## Améliorations futures

1. Vérification de l'email avec code OTP
2. Notifications push personnalisées selon les préférences
3. Support multi-langues pour les notifications
4. Analytics des taux d'ouverture des notifications
5. Deep linking depuis les notifications

## Dépendances

### Mobile
```json
{
  "@react-native-firebase/app": "^latest",
  "@react-native-firebase/messaging": "^latest",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "axios": "^1.13.2"
}
```

### Backend
```xml
<dependency>
    <groupId>com.google.firebase</groupId>
    <artifactId>firebase-admin</artifactId>
</dependency>
```

## Conclusion

Le workflow est maintenant complètement implémenté et automatisé. Chaque nouvelle inscription déclenche automatiquement l'envoi d'un email de bienvenue et d'une notification push Firebase, offrant une expérience utilisateur fluide et engageante.
