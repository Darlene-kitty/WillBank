# Configuration Gmail pour WillBank Notifications

## 📧 Étapes de Configuration

### 1. Créer un compte Gmail dédié
- Créer un nouveau compte Gmail : `willbank.notifications@gmail.com`
- Ou utiliser votre compte existant

### 2. Activer l'authentification à 2 facteurs
1. Aller dans **Paramètres Google** → **Sécurité**
2. Activer **Validation en 2 étapes**

### 3. Générer un mot de passe d'application
1. Dans **Sécurité** → **Validation en 2 étapes**
2. Cliquer sur **Mots de passe des applications**
3. Sélectionner **Autre (nom personnalisé)**
4. Saisir : `WillBank Notifications`
5. **Copier le mot de passe généré** (16 caractères)

### 4. Configurer application.yml

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: jacky.kouang@saintjeaningenieur.org  # Votre email Gmail
    password: uvkb ltoz uuhx tizv                # Mot de passe d'application (16 caractères)
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
```

### 5. Variables d'environnement (Recommandé pour la sécurité)

```bash
# Définir les variables d'environnement
export GMAIL_USERNAME=jacky.kouang@saintjeaningenieur.org
export GMAIL_PASSWORD=uvkbltozuuhxtizv
```

```yaml
# Dans application.yml
spring:
  mail:
    username: ${GMAIL_USERNAME:willbank@example.com}
    password: ${GMAIL_PASSWORD:your-password}
```

## 🧪 Test de Configuration

### Test manuel avec cURL
```bash
# Créer une transaction pour déclencher une notification
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "DEPOSIT",
    "sourceAccountId": 1,
    "amount": 100.00,
    "description": "Test notification email"
  }'
```

### Vérifier les logs
```bash
# Dans les logs du notification-service
2025-12-11 10:30:15 INFO  EmailService - Sending email to: account-1@willbank.com
2025-12-11 10:30:16 INFO  EmailService - Email sent successfully to: account-1@willbank.com
```

## 🔒 Sécurité

- ⚠️ **Ne jamais commiter** les vrais identifiants dans Git
- ✅ Utiliser des variables d'environnement
- ✅ Ajouter `application-prod.yml` au `.gitignore`
- ✅ Utiliser des profils Spring différents (dev/prod)

## 📝 Notes

- Les emails sont envoyés automatiquement lors des transactions
- Format des destinataires : `account-{accountId}@willbank.com`
- Pour tester avec de vrais emails, modifier les destinataires dans `EventListener.java`