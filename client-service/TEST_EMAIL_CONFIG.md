# Test de Configuration Email

## Variables d'environnement requises

```bash
MAIL_USERNAME=votre.email@gmail.com
MAIL_PASSWORD=votre_mot_de_passe_application_16_caracteres
```

## Comment tester

### 1. Vérifier que les variables sont définies

**Windows PowerShell** :
```powershell
echo $env:MAIL_USERNAME
echo $env:MAIL_PASSWORD
```

**Linux/Mac** :
```bash
echo $MAIL_USERNAME
echo $MAIL_PASSWORD
```

### 2. Démarrer le service avec les variables

**Windows** :
```powershell
# Option 1 : Définir puis lancer
$env:MAIL_USERNAME="willbank.notifications@gmail.com"
$env:MAIL_PASSWORD="abcdefghijklmnop"
cd client-service
mvn spring-boot:run

# Option 2 : Lancer avec IntelliJ/Eclipse
# Configurer les variables dans Run Configuration
```

**Linux/Mac** :
```bash
export MAIL_USERNAME="willbank.notifications@gmail.com"
export MAIL_PASSWORD="abcdefghijklmnop"
cd client-service
mvn spring-boot:run
```

### 3. Vérifier les logs au démarrage

Cherchez dans les logs :
```
INFO - Email configuration detected
INFO - Mail server: smtp.gmail.com
INFO - Mail username: willbank.notifications@gmail.com
```

### 4. Tester l'envoi d'email

#### Via l'API de registration

```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "votre.email.test@gmail.com",
    "password": "password123",
    "phone": "+33612345678",
    "address": "123 Test Street",
    "cin": "TEST123",
    "fcmToken": "6w088Q-tg6lOvFDlIM81GxI7oFXGZvczzNs2O8aHYA8"
  }'
```

#### Logs à vérifier

**Succès** :
```
INFO - Client registered successfully with ID: 1
INFO - Sending welcome email to: votre.email.test@gmail.com
INFO - Welcome email sent successfully to: votre.email.test@gmail.com
```

**Échec (configuration manquante)** :
```
INFO - Client registered successfully with ID: 1
INFO - Sending welcome email to: votre.email.test@gmail.com
WARN - Email not configured - Simulation mode: Welcome email would be sent to votre.email.test@gmail.com
```

### 5. Vérifier la boîte mail

- Vérifiez la boîte de réception du client : `votre.email.test@gmail.com`
- L'email devrait arriver dans quelques secondes
- **Si absent** : Vérifier le dossier **Spam**

## Résolution de problèmes

### Erreur : "Username and Password not accepted"

**Cause** : Mauvais mot de passe ou mot de passe d'application non utilisé

**Solution** :
1. Vérifier que vous utilisez le **mot de passe d'application** (16 caractères)
2. PAS le mot de passe normal de votre compte Gmail
3. Régénérer un nouveau mot de passe d'application si nécessaire

### Erreur : "Connection timeout"

**Cause** : Port bloqué ou firewall

**Solution** :
1. Vérifier que le port **587** n'est pas bloqué
2. Désactiver temporairement le firewall pour tester
3. Vérifier la connexion internet

### Erreur : "Access denied"

**Cause** : 2FA non activée ou application bloquée

**Solution** :
1. Activer la validation en deux étapes sur Google
2. Générer un nouveau mot de passe d'application
3. Attendre quelques minutes après la génération

### Email non reçu

**Vérifications** :
1. ✅ Vérifier le dossier **Spam/Courrier indésirable**
2. ✅ Vérifier que l'adresse email du client est correcte
3. ✅ Vérifier les logs backend pour confirmer l'envoi
4. ✅ Tester avec une autre adresse email

## Configuration avancée

### Utiliser un autre fournisseur SMTP

Si vous ne voulez pas utiliser Gmail, modifiez `application.yml` :

```yaml
spring:
  mail:
    host: smtp.office365.com  # Pour Outlook
    # host: smtp.mail.yahoo.com  # Pour Yahoo
    # host: smtp.sendgrid.net  # Pour SendGrid
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
```

### Configuration pour production

Utilisez des variables d'environnement sécurisées :
- **AWS** : AWS Secrets Manager
- **Azure** : Azure Key Vault
- **Google Cloud** : Secret Manager
- **Docker** : Variables d'environnement dans docker-compose.yml

## Templates d'email

Les templates sont dans : `client-service/src/main/resources/templates/`

- `welcome-email.html` : Email de bienvenue
- `first-login-email.html` : Première connexion
- `password-changed-email.html` : Mot de passe modifié

Vous pouvez personnaliser ces templates pour votre marque.

## Sécurité

⚠️ **IMPORTANT** :
- Ne jamais commiter les mots de passe dans Git
- Ajouter `.env` dans `.gitignore`
- Utiliser des variables d'environnement en production
- Régénérer les mots de passe d'application régulièrement
- Utiliser un compte Gmail dédié (pas votre compte personnel)

## Script de démarrage avec variables

Créez un fichier `start-with-email.bat` (Windows) :
```batch
@echo off
set MAIL_USERNAME=willbank.notifications@gmail.com
set MAIL_PASSWORD=abcdefghijklmnop
cd client-service
mvn spring-boot:run
```

Ou `start-with-email.sh` (Linux/Mac) :
```bash
#!/bin/bash
export MAIL_USERNAME="willbank.notifications@gmail.com"
export MAIL_PASSWORD="abcdefghijklmnop"
cd client-service
mvn spring-boot:run
```
