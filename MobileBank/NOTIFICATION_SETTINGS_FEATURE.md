# 🔔 Page de Configuration des Notifications

## 📋 Vue d'ensemble

Création d'une page premium de configuration des notifications basée sur l'entité `Notification` du backend (`notification-service`).

---

## 🎯 Fonctionnalités

### 1. **Header Premium**
- Gradient orange (#FF9500 → #FF6B00)
- Bouton retour
- Titre "Notifications"

### 2. **Carte Informative**
- Message explicatif
- Icône information

### 3. **Canaux de Notification** (basé sur NotificationType enum)
- ✅ Email
- ✅ SMS
- ✅ Push (notifications push mobile)
- ✅ In-App (notifications dans l'application)

### 4. **Catégories de Notifications**
- ✅ Transactions (virements, paiements, retraits)
- ✅ Sécurité (connexions, modifications)
- ✅ Marketing (offres, promotions)
- ✅ Mises à jour (nouvelles fonctionnalités)

### 5. **Paramètres Avancés**
- Seuil de notification (montant minimum)
- Heures silencieuses (plage horaire)

### 6. **Actions**
- Bouton "Envoyer une notification de test"
- Bouton "Enregistrer les préférences"
- Loading state pendant la sauvegarde

---

## 📊 Structure des Données

### Interface NotificationPreferences

```typescript
interface NotificationPreferences {
  // Types de notifications (basé sur NotificationType enum)
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  
  // Catégories de notifications
  transactions: boolean;
  security: boolean;
  marketing: boolean;
  updates: boolean;
  
  // Paramètres avancés
  transactionThreshold: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}
```

### Correspondance avec l'Entité Backend

| Frontend | Backend (Notification.java) |
|----------|----------------------------|
| `email` | `NotificationType.EMAIL` |
| `sms` | `NotificationType.SMS` |
| `push` | `NotificationType.PUSH` |
| `inApp` | `NotificationType.IN_APP` |

### Enums Backend

**NotificationType:**
- `EMAIL` → Notifications par email
- `SMS` → Notifications par SMS
- `PUSH` → Notifications push mobile
- `IN_APP` → Notifications dans l'application

**NotificationStatus:**
- `PENDING` → En attente d'envoi
- `SENT` → Envoyée avec succès
- `FAILED` → Échec d'envoi

---

## 🎨 Design

### Composants Utilisés
- `PremiumCard` - Cartes avec élévation
- `PremiumIcon` - Icônes dans containers
- `PremiumDivider` - Séparateurs
- `PremiumButton` - Bouton d'enregistrement
- `Switch` - Toggles natifs React Native

### Gradients
- **Header**: `#FF9500 → #FF6B00` (Orange)
- **Icône Canaux**: `#FF9500 → #FF6B00` (Orange)
- **Icône Catégories**: `#0066FF → #0052CC` (Bleu)
- **Icône Avancés**: `#667EEA → #764BA2` (Violet)

### Animations
- Entrée en cascade avec `FadeInDown`
- Délais: 0ms, 100ms, 200ms, 300ms, 400ms, 450ms

---

## 🔄 Flux Utilisateur

```
1. Paramètres → Clic sur "Notifications"
   ↓
2. Page Configuration des Notifications
   ↓
3. Activation/Désactivation des canaux
   ↓
4. Sélection des catégories
   ↓
5. Configuration des paramètres avancés
   ↓
6. Test de notification (optionnel)
   ↓
7. Enregistrement des préférences
   ↓
8. Confirmation avec Alert
```

---

## 🔗 Navigation

### Depuis account-settings.tsx
```typescript
// Item "Notifications"
{ id: 5, icon: 'notifications-outline', label: 'Notifications', route: '/notification-settings' }

// Handler
if (item.route === '/notification-settings') {
  router.push('/notification-settings' as any);
}
```

---

## 📱 Sections de la Page

### 1. Carte Informative
- Message explicatif
- Icône information avec couleur primary

### 2. Canaux de Notification
- 4 switches (Email, SMS, Push, In-App)
- Icône "notifications" avec gradient orange
- Description pour chaque canal

### 3. Catégories
- 4 switches (Transactions, Sécurité, Marketing, Mises à jour)
- Icône "list" avec gradient bleu
- Description pour chaque catégorie

### 4. Paramètres Avancés
- Bouton "Seuil de notification" (navigable)
- Switch "Heures silencieuses" avec plage horaire
- Icône "settings" avec gradient violet

### 5. Actions
- Bouton "Envoyer une notification de test"
- Bouton "Enregistrer les préférences" (primary)

---

## 🎯 États

### Switches
- Tous les switches sont indépendants
- Changement immédiat de l'état local
- Sauvegarde globale avec le bouton

### Sauvegarde
- Bouton "Enregistrer" → "Enregistrement..."
- Bouton désactivé pendant le loading
- Alert de confirmation après succès

---

## 🔐 Logique Métier

### Canaux de Notification
- Au moins un canal doit être activé
- Email recommandé pour les notifications de sécurité
- Push pour les notifications en temps réel

### Catégories
- Sécurité ne peut pas être désactivée (recommandé)
- Transactions activées par défaut
- Marketing optionnel

### Paramètres Avancés
- Seuil minimum : 0 € (toutes les transactions)
- Seuil par défaut : 100 €
- Heures silencieuses : 22:00 - 08:00

---

## 🚀 Intégration Backend

### Endpoints à utiliser

**1. Récupérer les préférences**
```
GET /api/notifications/preferences/{clientId}
```

**2. Mettre à jour les préférences**
```
PUT /api/notifications/preferences/{clientId}
```

**3. Envoyer une notification de test**
```
POST /api/notifications/test
```

**4. Récupérer l'historique**
```
GET /api/notifications/recipient/{email}
```

### Payload (Mise à jour)
```json
{
  "email": true,
  "sms": false,
  "push": true,
  "inApp": true,
  "transactions": true,
  "security": true,
  "marketing": false,
  "updates": true,
  "transactionThreshold": 100,
  "quietHoursEnabled": true,
  "quietHoursStart": "22:00",
  "quietHoursEnd": "08:00"
}
```

### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## 📊 Données Mockées

```typescript
{
  // Types
  email: true,
  sms: false,
  push: true,
  inApp: true,
  
  // Catégories
  transactions: true,
  security: true,
  marketing: false,
  updates: true,
  
  // Avancés
  transactionThreshold: 100,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
}
```

---

## 🎨 Détails des Canaux

### Email
- **Icône**: mail
- **Description**: Notifications par email
- **Délai**: Quelques minutes
- **Idéal pour**: Récapitulatifs, relevés

### SMS
- **Icône**: chatbubble
- **Description**: Notifications par SMS
- **Délai**: Instantané
- **Idéal pour**: Alertes urgentes, codes OTP

### Push
- **Icône**: phone-portrait
- **Description**: Notifications push sur mobile
- **Délai**: Instantané
- **Idéal pour**: Transactions en temps réel

### In-App
- **Icône**: apps
- **Description**: Notifications dans l'app
- **Délai**: Instantané
- **Idéal pour**: Toutes les notifications

---

## 🎨 Détails des Catégories

### Transactions
- **Icône**: swap-horizontal
- **Exemples**: Virements, paiements, retraits, dépôts
- **Fréquence**: Variable
- **Importance**: Haute

### Sécurité
- **Icône**: shield-checkmark
- **Exemples**: Connexions, modifications de compte, changements de mot de passe
- **Fréquence**: Faible
- **Importance**: Critique

### Marketing
- **Icône**: megaphone
- **Exemples**: Offres spéciales, promotions, nouveaux produits
- **Fréquence**: Moyenne
- **Importance**: Faible

### Mises à jour
- **Icône**: refresh
- **Exemples**: Nouvelles fonctionnalités, maintenance, améliorations
- **Fréquence**: Faible
- **Importance**: Moyenne

---

## ✅ Checklist

- [x] Création de la page `notification-settings.tsx`
- [x] Interface `NotificationPreferences`
- [x] 4 canaux de notification (Email, SMS, Push, In-App)
- [x] 4 catégories (Transactions, Sécurité, Marketing, Mises à jour)
- [x] Paramètres avancés (Seuil, Heures silencieuses)
- [x] Bouton de test
- [x] Sauvegarde avec loading
- [x] Navigation depuis `account-settings.tsx`
- [x] Composants premium utilisés
- [x] Animations d'entrée
- [x] Dark mode supporté
- [x] 0 erreurs TypeScript

---

## 🎨 Améliorations Futures

1. **Gestion des heures silencieuses**
   - Sélecteur d'heure visuel
   - Jours de la semaine personnalisables
   - Exceptions pour urgences

2. **Historique des notifications**
   - Liste des notifications envoyées
   - Statut (envoyée, lue, échouée)
   - Filtres par type et date

3. **Templates personnalisés**
   - Personnalisation des messages
   - Langue des notifications
   - Format (court/détaillé)

4. **Règles avancées**
   - Notifications conditionnelles
   - Seuils par type de transaction
   - Alertes géolocalisées

5. **Statistiques**
   - Nombre de notifications par mois
   - Taux d'ouverture
   - Canaux les plus utilisés

---

## 📁 Fichiers Modifiés

### Créés
- `MobileBank/app/(screens)/notification-settings.tsx`
- `MobileBank/NOTIFICATION_SETTINGS_FEATURE.md`

### Modifiés
- `MobileBank/app/(screens)/account-settings.tsx`
  - Ajout navigation vers `/notification-settings`
  - Handler pour item "Notifications"

---

## 🔍 Backend Reference

### Entité Notification
- **Fichier**: `notification-service/src/main/java/com/willbank/notification/entity/Notification.java`
- **Table**: `notifications`
- **Champs**: type, recipient, message, eventData, status, createdAt, sentAt

### Enums
- **NotificationType**: EMAIL, SMS, PUSH, IN_APP
- **NotificationStatus**: PENDING, SENT, FAILED

### Controller
- **Fichier**: `notification-service/src/main/java/com/willbank/notification/controller/NotificationController.java`
- **Endpoints**: GET by recipient, GET all

### Events
- **TransactionCreatedEvent**: Notification lors d'une transaction
- **AccountCreditedEvent**: Notification lors d'un crédit
- **AccountDebitedEvent**: Notification lors d'un débit
- **ClientUpdatedEvent**: Notification lors d'une modification client

---

## 🔄 Intégration avec RabbitMQ

Le service notification utilise RabbitMQ pour recevoir les événements :

### Queues
- `transaction.created` → Notifications de transactions
- `account.credited` → Notifications de crédits
- `account.debited` → Notifications de débits
- `client.updated` → Notifications de modifications

### Listener
- **Fichier**: `EventListener.java`
- Écoute les événements et crée les notifications
- Envoie via Email, SMS, Push selon les préférences

---

**Créé le**: 9 Décembre 2024  
**Status**: ✅ Complet et fonctionnel  
**Erreurs TypeScript**: 0
