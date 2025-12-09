# 👤 Page de Configuration du Profil Utilisateur

## 📋 Vue d'ensemble

Création d'une page premium de configuration du profil utilisateur basée sur l'entité `Client` du backend (`client-service`).

---

## 🎯 Fonctionnalités

### 1. **Header Premium**
- Gradient violet (#667EEA → #764BA2)
- Bouton retour
- Bouton édition (toggle mode édition)

### 2. **Carte Profil**
- Avatar avec initiales sur gradient
- Bouton caméra pour changer la photo
- Nom complet
- Email
- Badges de statut (Actif, Client)

### 3. **Informations Personnelles (Éditables)**
- ✅ Prénom
- ✅ Nom
- ✅ Email
- ✅ Téléphone
- ✅ Adresse
- Mode édition activable/désactivable
- Validation et sauvegarde

### 4. **Informations du Compte (Lecture seule)**
- CIN (Carte d'Identité Nationale)
- Date de création du compte
- Dernière connexion

### 5. **Section Sécurité**
- Bouton "Changer le mot de passe"
- Icône avec gradient orange

### 6. **Actions**
- Bouton "Enregistrer" (visible en mode édition)
- Bouton "Annuler" (réinitialise les valeurs)
- Loading state pendant la sauvegarde
- Alert de confirmation après sauvegarde

---

## 📊 Structure des Données

### Interface ClientProfile (basée sur l'entité Backend)

```typescript
interface ClientProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  cin: string;
  role: 'CLIENT' | 'ADMIN' | 'AGENT';
  status: 'ACTIVE' | 'BLOCKED' | 'PENDING' | 'SUSPENDED';
  createdAt: string;
  lastLogin: string;
}
```

### Correspondance avec l'Entité Backend

| Frontend | Backend (Client.java) |
|----------|----------------------|
| `firstName` | `firstName` |
| `lastName` | `lastName` |
| `email` | `email` |
| `phone` | `phone` |
| `address` | `address` |
| `cin` | `cin` |
| `role` | `ClientRole` enum |
| `status` | `ClientStatus` enum |
| `createdAt` | `createdAt` |
| `lastLogin` | `lastLogin` |

---

## 🎨 Design

### Composants Utilisés
- `PremiumCard` - Cartes avec élévation
- `PremiumInput` - Inputs avec labels et icônes
- `PremiumButton` - Bouton principal
- `PremiumIcon` - Icônes dans containers
- `PremiumBadge` - Badges de statut

### Gradients
- **Header**: `#667EEA → #764BA2` (Violet)
- **Avatar**: `#667EEA → #764BA2` (Violet)
- **Icône Infos**: `#667EEA → #764BA2` (Violet)
- **Icône Compte**: `#34C759 → #28A745` (Vert)
- **Icône Sécurité**: `#FF9500 → #FF6B00` (Orange)

### Animations
- Entrée en cascade avec `FadeInDown`
- Délais: 0ms, 100ms, 200ms, 300ms, 350ms

---

## 🔄 Flux Utilisateur

```
1. Paramètres → Clic sur "Informations personnelles"
   ↓
2. Page Profil (mode lecture)
   ↓
3. Clic sur icône "Éditer" (crayon)
   ↓
4. Mode édition activé (inputs éditables)
   ↓
5. Modification des champs
   ↓
6. Clic sur "Enregistrer"
   ↓
7. Loading (1.5s)
   ↓
8. Alert de confirmation
   ↓
9. Retour en mode lecture
```

---

## 🔗 Navigation

### Depuis account-settings.tsx
```typescript
// Item "Informations personnelles"
{ id: 1, icon: 'person-outline', label: 'Informations personnelles', route: '/profile' }

// Handler
if (item.route === '/profile') {
  router.push('/profile-settings' as any);
}

// Bouton édition sur la carte profil
<Pressable onPress={() => router.push('/profile-settings' as any)}>
```

---

## 📱 Sections de la Page

### 1. Profile Header Card
- Avatar circulaire avec gradient
- Bouton caméra (bottom-right)
- Nom complet
- Email
- 2 badges (Statut + Rôle)

### 2. Informations Personnelles
- 5 champs éditables avec PremiumInput
- Icône "person" avec gradient violet
- Désactivés par défaut, éditables en mode édition

### 3. Informations du Compte
- 3 informations en lecture seule
- Icône "shield-checkmark" avec gradient vert
- Format de date français

### 4. Sécurité
- 1 bouton d'action
- Icône "lock-closed" avec gradient orange
- Chevron à droite

### 5. Boutons d'Action (mode édition)
- Bouton "Enregistrer" (primary)
- Bouton "Annuler" (secondary)
- Apparaissent uniquement en mode édition

---

## 🎯 États

### Mode Lecture (par défaut)
- Inputs désactivés
- Bouton "Éditer" visible (icône crayon)
- Pas de boutons d'action

### Mode Édition
- Inputs activés
- Bouton "Fermer" visible (icône X)
- Boutons "Enregistrer" et "Annuler" visibles

### Mode Sauvegarde
- Bouton "Enregistrer" → "Enregistrement..."
- Tous les boutons désactivés
- Loading pendant 1.5s

---

## 🔐 Sécurité

### Champs Non Modifiables
- CIN (identifiant unique)
- Date de création
- Dernière connexion
- Rôle (géré par admin)
- Statut (géré par admin)

### Validation (à implémenter)
- Email valide
- Téléphone au format français
- Champs obligatoires non vides

---

## 🚀 Intégration Backend

### Endpoint à utiliser
```
PUT /api/clients/{id}
```

### Payload
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@email.com",
  "phone": "+33 6 12 34 56 78",
  "address": "123 Rue de la Paix, 75001 Paris"
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
  id: 1,
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@email.com',
  phone: '+33 6 12 34 56 78',
  address: '123 Rue de la Paix, 75001 Paris',
  cin: 'AB123456',
  role: 'CLIENT',
  status: 'ACTIVE',
  createdAt: '2023-01-15',
  lastLogin: '2024-12-09T10:30:00',
}
```

---

## ✅ Checklist

- [x] Création de la page `profile-settings.tsx`
- [x] Interface `ClientProfile` basée sur l'entité backend
- [x] Mode édition/lecture
- [x] Sauvegarde avec loading
- [x] Navigation depuis `account-settings.tsx`
- [x] Composants premium utilisés
- [x] Animations d'entrée
- [x] Dark mode supporté
- [x] KeyboardAvoidingView
- [x] 0 erreurs TypeScript

---

## 🎨 Améliorations Futures

1. **Upload de photo de profil**
   - Intégration avec caméra/galerie
   - Crop et redimensionnement
   - Upload vers backend

2. **Validation en temps réel**
   - Email format
   - Téléphone format
   - Champs obligatoires

3. **Changement de mot de passe**
   - Modal dédiée
   - Validation force du mot de passe
   - Confirmation par email

4. **Historique des modifications**
   - Log des changements
   - Date et heure
   - Champs modifiés

5. **Vérification 2FA**
   - Code SMS pour modifications sensibles
   - Email de confirmation

---

## 📁 Fichiers Modifiés

### Créés
- `MobileBank/app/(screens)/profile-settings.tsx`

### Modifiés
- `MobileBank/app/(screens)/account-settings.tsx`
  - Ajout navigation vers `/profile-settings`
  - Handler pour item "Informations personnelles"
  - Bouton édition sur carte profil

---

## 🔍 Backend Reference

### Entité Client
- **Fichier**: `client-service/src/main/java/com/willbank/client/entity/Client.java`
- **Table**: `clients`
- **Indexes**: `email`, `phone`

### DTO
- **Fichier**: `client-service/src/main/java/com/willbank/client/dto/ClientDTO.java`
- **Validation**: Jakarta Validation

### Controller
- **Fichier**: `client-service/src/main/java/com/willbank/client/controller/ClientController.java`
- **Endpoints**: CRUD complet

---

**Créé le**: 9 Décembre 2024  
**Status**: ✅ Complet et fonctionnel  
**Erreurs TypeScript**: 0
