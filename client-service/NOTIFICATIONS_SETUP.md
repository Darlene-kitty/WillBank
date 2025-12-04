# Configuration des Notifications - WillBank Client Service

## Vue d'ensemble

Ce guide explique comment configurer les notifications par email (SMTP) et les push notifications (Firebase Cloud Messaging) pour le microservice client-service.

---

## 📧 Configuration des Emails

### 1. Configuration Gmail

Le service utilise Gmail SMTP par défaut. Vous devez créer un **mot de passe d'application** Gmail :

#### Étapes :
1. Accédez à votre compte Google : https://myaccount.google.com/
2. Allez dans **Sécurité** → **Validation en deux étapes** (activez-la si nécessaire)
3. Recherchez **Mots de passe des applications**
4. Sélectionnez **Autre (nom personnalisé)** → Nommez-le "WillBank Client Service"
5. Copiez le mot de passe généré (16 caractères)

#### Configuration des variables d'environnement :

**Windows PowerShell :**
```powershell
$env:MAIL_USERNAME="votre.email@gmail.com"
$env:MAIL_PASSWORD="votre-mot-de-passe-application"
```

**Linux/Mac :**
```bash
export MAIL_USERNAME="votre.email@gmail.com"
export MAIL_PASSWORD="votre-mot-de-passe-application"
```

**Fichier `.env` (recommandé pour le développement) :**
```properties
MAIL_USERNAME=votre.email@gmail.com
MAIL_PASSWORD=votre-mot-de-passe-application
```

### 2. Utiliser un autre fournisseur SMTP

Si vous ne souhaitez pas utiliser Gmail, modifiez `application.yml` :

```yaml
spring:
  mail:
    host: smtp.votre-fournisseur.com
    port: 587  # ou 465 pour SSL
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true  # false si vous utilisez SSL (port 465)
```

**Exemples de fournisseurs populaires :**

| Fournisseur | Host | Port | SSL/TLS |
|-------------|------|------|---------|
| Gmail | smtp.gmail.com | 587 | STARTTLS |
| Outlook | smtp-mail.outlook.com | 587 | STARTTLS |
| Yahoo | smtp.mail.yahoo.com | 587 | STARTTLS |
| SendGrid | smtp.sendgrid.net | 587 | STARTTLS |
| Mailgun | smtp.mailgun.org | 587 | STARTTLS |

### 3. Templates d'emails

Les templates HTML Thymeleaf se trouvent dans `src/main/resources/templates/` :

- `welcome-email.html` - Email de bienvenue lors de l'inscription
- `first-login-email.html` - Email lors de la première connexion
- `password-changed-email.html` - Email de confirmation de changement de mot de passe

**Personnalisation des templates :**

Les templates utilisent Thymeleaf. Variables disponibles :

```html
<!-- welcome-email.html -->
${firstName} - Prénom du client
${lastName} - Nom du client

<!-- first-login-email.html -->
${firstName} - Prénom du client
${loginDate} - Date de connexion (LocalDateTime)
${email} - Email du client

<!-- password-changed-email.html -->
${firstName} - Prénom du client
${changeDate} - Date du changement (LocalDateTime)
${email} - Email du client
```

### 4. Configuration de l'expéditeur

Modifiez dans `application.yml` :

```yaml
app:
  name: WillBank
  email:
    from: noreply@willbank.com  # Changez cette adresse
```

---

## 🔔 Configuration de Firebase Cloud Messaging (FCM)

### 1. Créer un projet Firebase

1. Accédez à la [Console Firebase](https://console.firebase.google.com/)
2. Cliquez sur **Ajouter un projet**
3. Nommez votre projet "WillBank" (ou un autre nom)
4. Suivez les étapes de création

### 2. Obtenir le fichier de clé privée

1. Dans la console Firebase, allez dans **Paramètres du projet** (icône engrenage)
2. Onglet **Comptes de service**
3. Cliquez sur **Générer une nouvelle clé privée**
4. Un fichier JSON sera téléchargé (ex: `willbank-firebase-adminsdk-xxxxx.json`)

### 3. Configurer le fichier de clé

**Option 1 : Placer dans le classpath (recommandé pour développement)**

1. Renommez le fichier téléchargé en `serviceAccountKey.json`
2. Placez-le dans `src/main/resources/`
3. Le fichier sera automatiquement copié dans `target/classes/` lors de la compilation

**Option 2 : Chemin absolu (recommandé pour production)**

Modifiez `application.yml` :

```yaml
firebase:
  config-file: /opt/willbank/config/serviceAccountKey.json
```

Définissez une variable d'environnement :

```powershell
# Windows
$env:FIREBASE_CONFIG_FILE="C:\config\serviceAccountKey.json"

# Linux/Mac
export FIREBASE_CONFIG_FILE="/opt/willbank/config/serviceAccountKey.json"
```

Puis dans `application.yml` :

```yaml
firebase:
  config-file: ${FIREBASE_CONFIG_FILE:classpath:serviceAccountKey.json}
```

### 4. Configuration des applications clientes

**Android (Kotlin) :**

```kotlin
// build.gradle (Project level)
dependencies {
    classpath 'com.google.gms:google-services:4.3.15'
}

// build.gradle (App level)
plugins {
    id 'com.google.gms.google-services'
}

dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-messaging-ktx'
}

// MyFirebaseMessagingService.kt
class MyFirebaseMessagingService : FirebaseMessagingService() {
    override fun onNewToken(token: String) {
        // Envoyez ce token lors du register/login
        sendTokenToServer(token)
    }
    
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        // Gérer les notifications reçues
    }
}
```

**iOS (Swift) :**

```swift
// AppDelegate.swift
import Firebase
import UserNotifications

func application(_ application: UIApplication, 
                 didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    FirebaseApp.configure()
    
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
        guard granted else { return }
        DispatchQueue.main.async {
            application.registerForRemoteNotifications()
        }
    }
    
    return true
}

func application(_ application: UIApplication, 
                 didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    Messaging.messaging().apnsToken = deviceToken
}
```

### 5. Tester les push notifications

**Obtenir un FCM token de test :**

1. Installez votre application mobile sur un appareil/émulateur
2. Le token FCM sera généré automatiquement
3. Récupérez-le depuis les logs de l'application ou l'interface utilisateur
4. Utilisez ce token dans les requêtes Postman

**Exemple de requête avec FCM token :**

```json
// POST /api/auth/register
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "password": "Password123!",
  "phone": "+33612345678",
  "address": "123 Rue de Paris, 75001 Paris",
  "cin": "AB123456",
  "fcmToken": "fJ8Xr2KqR7e:APA91bH..."  // Token FCM complet (150+ caractères)
}
```

---

## 🔧 Vérification de la configuration

### Test Email

Après avoir configuré les variables d'environnement SMTP :

```powershell
# Compiler le projet
mvn clean compile

# Lancer l'application
mvn spring-boot:run

# Tester l'endpoint register - un email sera envoyé
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "votre-email@example.com",
    "password": "Password123!",
    "phone": "+33612345678",
    "address": "1 Rue Test",
    "cin": "TEST1234"
  }'
```

Vérifiez votre boîte mail pour l'email de bienvenue.

### Test Firebase Push Notification

```powershell
# Avec un token FCM valide
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "Password123!",
    "phone": "+33612345678",
    "address": "1 Rue Test",
    "cin": "TEST5678",
    "fcmToken": "YOUR_VALID_FCM_TOKEN"
  }'
```

Vous devriez recevoir une notification push sur votre appareil mobile.

---

## 🐛 Dépannage

### Problèmes Email

**Erreur : "Authentication failed"**
- Vérifiez que le mot de passe d'application est correct
- Assurez-vous que la validation en deux étapes est activée sur Gmail
- Vérifiez les variables d'environnement `MAIL_USERNAME` et `MAIL_PASSWORD`

**Erreur : "Could not connect to SMTP host"**
- Vérifiez votre connexion Internet
- Vérifiez que le port 587 n'est pas bloqué par un firewall
- Essayez avec le port 465 (SSL) au lieu de 587 (TLS)

**Les emails arrivent en spam**
- Configurez SPF, DKIM et DMARC pour votre domaine
- Utilisez un service professionnel comme SendGrid ou Mailgun pour la production

### Problèmes Firebase

**Erreur : "Failed to initialize Firebase"**
- Vérifiez que `serviceAccountKey.json` est présent dans le classpath
- Vérifiez le chemin dans `application.yml` : `firebase.config-file`
- Assurez-vous que le fichier JSON est valide

**Erreur : "Invalid FCM token"**
- Le token FCM peut expirer ou être invalidé
- Demandez à l'application mobile de régénérer le token
- Vérifiez que le token n'a pas d'espaces ou caractères invalides

**Les notifications ne sont pas reçues**
- Vérifiez que l'application mobile est au premier plan ou en arrière-plan
- Vérifiez les permissions de notification sur l'appareil
- Consultez les logs Firebase dans la console : https://console.firebase.google.com/

---

## 📊 Logs et Monitoring

### Activer les logs de débogage

Dans `application.yml` :

```yaml
logging:
  level:
    com.willbank.client.service.EmailService: DEBUG
    com.willbank.client.service.PushNotificationService: DEBUG
    org.springframework.mail: DEBUG
    com.google.firebase: DEBUG
```

### Vérifier l'envoi des notifications

Les logs indiqueront :

```
[EmailService] Sending welcome email to: jean.dupont@example.com
[EmailService] Welcome email sent successfully to: jean.dupont@example.com

[PushNotificationService] Sending welcome push notification to token: fJ8Xr...
[PushNotificationService] Welcome push notification sent successfully: projects/...
```

---

## 🚀 Déploiement en Production

### Variables d'environnement recommandées

```properties
# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=noreply@willbank.com
MAIL_PASSWORD=xxxxxxxxxxxxx
MAIL_FROM=noreply@willbank.com

# Firebase Configuration
FIREBASE_CONFIG_FILE=/opt/willbank/config/serviceAccountKey.json

# Application
APP_NAME=WillBank Production
```

### Sécurité

1. **Ne jamais committer** les fichiers suivants dans Git :
   - `serviceAccountKey.json`
   - Mots de passe d'application email
   - Fichiers `.env`

2. Ajoutez à `.gitignore` :
   ```
   serviceAccountKey.json
   .env
   *.credentials
   ```

3. Utilisez un gestionnaire de secrets pour la production :
   - AWS Secrets Manager
   - Azure Key Vault
   - HashiCorp Vault
   - Kubernetes Secrets

---

## 📖 Ressources Supplémentaires

- [Documentation Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Spring Boot Email Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/io.html#io.email)
- [Thymeleaf Documentation](https://www.thymeleaf.org/documentation.html)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)

---

**Support:** Si vous rencontrez des problèmes, consultez les logs ou contactez l'équipe de développement.
