# Notifications Email - Guide d'Implémentation

## 📧 Vue d'Ensemble

Les notifications par email ont été implémentées pour deux événements principaux :

### ✅ 1. Création de Compte Bancaire
Lorsqu'un nouveau compte bancaire est créé pour un client, un email de notification est automatiquement envoyé contenant :
- Le numéro du compte
- Le type de compte (SAVINGS, CHECKING, etc.)
- La date de création
- Un message de bienvenue

### ✅ 2. Transactions sur un Compte
Pour chaque transaction effectuée (dépôt, retrait, virement), un email est envoyé au client avec :
- Le type d'opération (avec icône et couleur appropriées)
- Le montant de la transaction
- Le numéro de compte
- La référence de la transaction
- Le nouveau solde après l'opération
- La date et l'heure de la transaction

## 🔧 Configuration

### Configuration des Services

Les emails sont configurés dans les fichiers `application.yml` des services :

#### account-service
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME:test@example.com}
    password: ${MAIL_PASSWORD:}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

app:
  name: WillBank
  email:
    from: ${MAIL_FROM:noreply@willbank.com}
```

#### transaction-service
Même configuration que account-service.

### Variables d'Environnement

Pour activer l'envoi réel d'emails, définissez ces variables d'environnement :

```bash
MAIL_USERNAME=votre.email@gmail.com
MAIL_PASSWORD=votre_mot_de_passe_application
MAIL_FROM=noreply@willbank.com
```

**Note** : Pour Gmail, vous devez utiliser un "Mot de passe d'application" plutôt que votre mot de passe habituel.

### Mode Simulation

Si les variables d'environnement ne sont pas configurées (ou si `MAIL_USERNAME=test@example.com`), le système fonctionne en **mode simulation** :
- Les emails ne sont pas réellement envoyés
- Les détails de l'email sont loggés dans la console
- Aucune erreur n'est levée

## 📁 Fichiers Créés/Modifiés

### Account Service

#### Nouveaux fichiers :
1. **ClientClient.java** - Feign Client pour récupérer les infos du client
2. **ClientDTO.java** - DTO pour les données client
3. **EmailService.java** - Service d'envoi d'emails pour la création de compte

#### Fichiers modifiés :
1. **pom.xml** - Ajout des dépendances Spring Mail, Thymeleaf et OpenFeign
2. **AccountServiceApplication.java** - Activation de @EnableFeignClients
3. **AccountService.java** - Ajout de l'envoi d'email après création de compte
4. **application.yml** - Configuration email

### Transaction Service

#### Nouveaux fichiers :
1. **ClientClient.java** - Feign Client pour récupérer les infos du client
2. **AccountDTO.java** - DTO pour les données de compte
3. **ClientDTO.java** - DTO pour les données client
4. **EmailService.java** - Service d'envoi d'emails pour les transactions

#### Fichiers modifiés :
1. **pom.xml** - Ajout des dépendances Spring Mail et Thymeleaf
2. **AccountClient.java** - Ajout de la méthode getAccountById
3. **TransactionService.java** - Ajout de l'envoi d'email après chaque transaction
4. **application.yml** - Configuration email

## 🎨 Templates d'Email

Les emails sont générés avec des templates HTML inline comprenant :

### Email de Création de Compte
- Header avec le nom de l'application
- Message de bienvenue personnalisé
- Informations du compte dans un cadre stylisé
- Footer avec copyright

### Email de Transaction
- Header coloré selon le type d'opération :
  - 🟢 Vert pour les dépôts
  - 🔴 Rouge pour les retraits
  - 🔵 Bleu pour les virements
- Icônes emoji pour identifier rapidement le type
- Montant en gras et coloré
- Nouveau solde mis en évidence
- Avertissement de sécurité

## 🚀 Test des Notifications

### 1. Test de Création de Compte

```bash
# Via l'API Gateway (port 8080)
POST http://localhost:8080/account-service/api/accounts
Content-Type: application/json

{
  "clientId": 1,
  "accountType": "SAVINGS"
}
```

Le client avec l'ID 1 recevra un email de notification.

### 2. Test de Transaction

```bash
# Dépôt
POST http://localhost:8080/transaction-service/api/transactions
Content-Type: application/json

{
  "type": "DEPOSIT",
  "sourceAccountId": 1,
  "amount": 1000.00,
  "description": "Dépôt initial"
}

# Retrait
POST http://localhost:8080/transaction-service/api/transactions
Content-Type: application/json

{
  "type": "WITHDRAWAL",
  "sourceAccountId": 1,
  "amount": 500.00,
  "description": "Retrait ATM"
}

# Virement
POST http://localhost:8080/transaction-service/api/transactions
Content-Type: application/json

{
  "type": "TRANSFER",
  "sourceAccountId": 1,
  "destinationAccountId": 2,
  "amount": 250.00,
  "description": "Virement à un ami"
}
```

Le propriétaire du compte source recevra un email pour chaque transaction.

## 📊 Logs

En mode simulation, vous verrez dans les logs :

```
WARN  - Email not configured - Simulation mode: Account created email would be sent to client@email.com
INFO  - Email content: Account ACC-12345678 (SAVINGS) created for John Doe

WARN  - Email not configured - Simulation mode: Transaction email would be sent to client@email.com
INFO  - Email content: DEPOSIT transaction of 1000.00 for account ACC-12345678, new balance: 1000.00
```

## ⚠️ Important

1. **Asynchrone** : Les emails sont envoyés de manière asynchrone (@Async) pour ne pas bloquer les opérations
2. **Gestion d'erreurs** : Si l'envoi d'email échoue, l'opération principale (création de compte ou transaction) n'est PAS annulée
3. **Feign Clients** : Les services communiquent via Feign pour récupérer les informations nécessaires
4. **Dépendances** : Assurez-vous que tous les services (Eureka, Client Service, Account Service, Transaction Service) sont démarrés

## 🔐 Configuration Gmail

Pour utiliser Gmail comme serveur SMTP :

1. Allez sur https://myaccount.google.com/security
2. Activez la validation en deux étapes
3. Créez un "Mot de passe d'application"
4. Utilisez ce mot de passe dans la variable `MAIL_PASSWORD`

## 📝 Prochaines Améliorations Possibles

- Templates Thymeleaf externes pour une meilleure maintenabilité
- Support de plusieurs langues
- Notifications par SMS en plus des emails
- Personnalisation des templates par type de client
- Historique des notifications envoyées
