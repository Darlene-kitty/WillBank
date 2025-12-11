# 🔔 Centre de Notifications

## 🎯 Objectif
Créer une page complète de centre de notifications avec filtres, gestion des notifications lues/non lues, et suppression. Également retirer le bouton de test des design systems du login.

---

## ✅ Modifications Appliquées

### 1. Nouvelle Page Notifications

**Fichier créé :** `app/(screens)/notifications.tsx`

**Structure de la page :**

```
┌─────────────────────────────────────┐
│  [←] Notifications [3] [✓✓]        │ ← Header Gradient Orange
├─────────────────────────────────────┤
│                                     │
│  [Toutes (6)]  [Non lues (3)]      │ ← Filtres
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [↓] Paiement reçu       [●] │   │
│  │     Vous avez reçu 250€     │   │
│  │     Il y a 5 min        [×] │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [🛒] Paiement effectué  [●] │   │
│  │     Achat Apple Store       │   │ ← Notifications
│  │     Il y a 2h           [×] │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [🛡] Connexion détectée     │   │
│  │     iPhone 14 Pro           │   │
│  │     Hier                [×] │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔔 Types de Notifications

### 1. Transaction (Vert/Rouge)
- **Icône :** arrow-down-circle (reçu) / cart (dépense)
- **Couleurs :** Vert (#34C759) pour revenus, Rouge (#FF3B30) pour dépenses
- **Exemples :**
  - Paiement reçu
  - Paiement effectué
  - Virement programmé

### 2. Sécurité (Bleu)
- **Icône :** shield-checkmark
- **Couleurs :** Bleu (#0066FF)
- **Exemples :**
  - Connexion détectée
  - Changement de mot de passe
  - Activation 2FA

### 3. Info (Violet)
- **Icône :** document-text, calendar
- **Couleurs :** Violet (#667EEA)
- **Exemples :**
  - Relevé mensuel disponible
  - Rappel de paiement
  - Mise à jour de l'app

### 4. Promo (Orange)
- **Icône :** sparkles
- **Couleurs :** Orange (#FF9500)
- **Exemples :**
  - Nouvelle fonctionnalité
  - Offre spéciale
  - Cashback disponible

---

## 🎨 Fonctionnalités

### 1. Header avec Badge

**Affichage :**
```typescript
<View style={styles.headerCenter}>
  <Text style={styles.headerTitle}>Notifications</Text>
  {unreadCount > 0 && (
    <PremiumBadge
      text={unreadCount.toString()}
      variant="error"
      size="small"
    />
  )}
</View>
```

**Bouton "Tout marquer comme lu" :**
- Icône : checkmark-done
- Désactivé si aucune notification non lue
- Opacité réduite quand désactivé

### 2. Filtres

**2 filtres disponibles :**
1. **Toutes** - Affiche toutes les notifications (6)
2. **Non lues** - Affiche uniquement les non lues (3)

**Comportement :**
```typescript
const [filter, setFilter] = useState<'all' | 'unread'>('all');

const filteredNotifications = filter === 'all' 
  ? notifications 
  : notifications.filter(n => !n.read);
```

**Design :**
- Boutons avec fond coloré pour le filtre actif
- Compteur entre parenthèses
- Animations de transition

### 3. Carte de Notification

**Éléments :**
- **Icône** - PremiumIcon avec gradient selon le type
- **Point rouge** - Indicateur de non lu (●)
- **Titre** - En gras
- **Message** - Description
- **Temps** - "Il y a X min/h/jours"
- **Bouton supprimer** - Icône (×)

**États :**
- **Non lue** - Opacité 1, point rouge visible
- **Lue** - Opacité 0.7, pas de point rouge

**Actions :**
```typescript
// Marquer comme lue au clic
<Pressable onPress={() => handleMarkAsRead(notification.id)}>

// Supprimer
<Pressable onPress={() => handleDelete(notification.id)}>
  <Ionicons name="close-circle" />
</Pressable>
```

### 4. État Vide

**Affichage quand aucune notification :**
```
┌─────────────────────────────┐
│                             │
│         [🔕]                │
│                             │
│   Aucune notification       │
│                             │
│   Toutes vos notifications  │
│   ont été lues              │
│                             │
└─────────────────────────────┘
```

**2 messages différents :**
- Filtre "Toutes" : "Vous n'avez aucune notification pour le moment"
- Filtre "Non lues" : "Toutes vos notifications ont été lues"

---

## 📊 Données des Notifications

### Structure TypeScript

```typescript
interface Notification {
  id: number;
  type: 'transaction' | 'security' | 'info' | 'promo';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  colors: string[];
}
```

### Exemple de Données

```typescript
{
  id: 1,
  type: 'transaction',
  title: 'Paiement reçu',
  message: 'Vous avez reçu 250,00 € de Jane Doe',
  time: 'Il y a 5 min',
  read: false,
  icon: 'arrow-down-circle',
  colors: ['#34C759', '#28A745'],
}
```

---

## 🎯 Actions Disponibles

### 1. Marquer comme Lue
```typescript
const handleMarkAsRead = (id: number) => {
  setNotifications(prev => 
    prev.map(n => n.id === id ? { ...n, read: true } : n)
  );
};
```

### 2. Tout Marquer comme Lu
```typescript
const handleMarkAllAsRead = () => {
  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
};
```

### 3. Supprimer
```typescript
const handleDelete = (id: number) => {
  setNotifications(prev => prev.filter(n => n.id !== id));
};
```

### 4. Filtrer
```typescript
const filteredNotifications = filter === 'all' 
  ? notifications 
  : notifications.filter(n => !n.read);
```

---

## 🎨 Composants Utilisés

### Composants Premium
1. **PremiumCard** (6x) - Cartes de notification
2. **PremiumIcon** (6x) - Icônes avec gradient
3. **PremiumBadge** (1x) - Badge du header

### Composants Natifs
- **LinearGradient** - Header orange
- **SafeAreaView** - Zones sûres
- **ScrollView** - Scroll vertical
- **Pressable** - Boutons interactifs
- **Ionicons** - Icônes

---

## 📱 Gradient Header Orange

**Couleurs :**
```typescript
<LinearGradient
  colors={['#FF9500', '#FF6B00']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
```

**Pourquoi orange ?**
- ✅ Différenciation visuelle des autres pages
- ✅ Couleur associée aux notifications
- ✅ Contraste élevé avec le blanc
- ✅ Cohérent avec l'icône de notification

---

## 🔧 Suppression du Bouton Design Systems

### Modification du Login

**Fichier :** `app/(auth)/login.tsx`

**Avant :**
```typescript
{/* Design Systems Test Button */}
<Pressable 
  style={styles.designSystemsButton}
  onPress={() => router.push('/design-systems/')}
>
  <Ionicons name="color-palette-outline" size={20} />
  <Text>🎨 Tester les Design Systems</Text>
</Pressable>
```

**Après :**
```typescript
// Bouton supprimé
```

**Raison :**
- ✅ Fonctionnalité de test non nécessaire en production
- ✅ Simplifie l'interface de login
- ✅ Réduit la confusion pour l'utilisateur
- ✅ Les design systems restent accessibles via code

**Note :** Les pages de design systems (`/design-systems/`) restent disponibles mais ne sont plus accessibles depuis l'UI.

---

## 🧪 Tests Recommandés

### 1. Affichage
- [ ] Header orange avec gradient
- [ ] Badge avec nombre de non lues
- [ ] 2 filtres visibles
- [ ] 6 notifications affichées

### 2. Filtres
- [ ] Clic sur "Toutes" → 6 notifications
- [ ] Clic sur "Non lues" → 3 notifications
- [ ] Compteurs corrects entre parenthèses

### 3. Actions
- [ ] Clic sur notification → Marquée comme lue
- [ ] Point rouge disparaît
- [ ] Opacité passe à 0.7
- [ ] Badge header se met à jour

### 4. Tout Marquer comme Lu
- [ ] Clic sur bouton → Toutes marquées comme lues
- [ ] Badge disparaît
- [ ] Bouton devient grisé
- [ ] Filtre "Non lues" → État vide

### 5. Suppression
- [ ] Clic sur (×) → Notification supprimée
- [ ] Compteurs mis à jour
- [ ] Animation de sortie

### 6. État Vide
- [ ] Filtre "Non lues" sans notification → Message approprié
- [ ] Icône et texte visibles
- [ ] Centré verticalement

### 7. Login
- [ ] Bouton "Design Systems" absent
- [ ] Pas d'erreur TypeScript
- [ ] Layout correct

---

## 💡 Améliorations Futures

### 1. Notifications Push
```typescript
import * as Notifications from 'expo-notifications';

// Configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Envoyer une notification
await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Paiement reçu',
    body: 'Vous avez reçu 250,00 €',
    data: { type: 'transaction', id: 123 },
  },
  trigger: null, // Immédiat
});
```

### 2. Groupement par Date
```typescript
const groupedNotifications = notifications.reduce((groups, notification) => {
  const date = getDateLabel(notification.time); // "Aujourd'hui", "Hier", "Cette semaine"
  if (!groups[date]) groups[date] = [];
  groups[date].push(notification);
  return groups;
}, {});
```

### 3. Actions Rapides
```typescript
<Pressable onPress={() => handleQuickAction(notification)}>
  <Text>Voir la transaction</Text>
</Pressable>
```

### 4. Swipe to Delete
```typescript
import { Swipeable } from 'react-native-gesture-handler';

<Swipeable
  renderRightActions={() => (
    <Pressable onPress={() => handleDelete(id)}>
      <Text>Supprimer</Text>
    </Pressable>
  )}
>
  {/* Notification */}
</Swipeable>
```

### 5. Paramètres de Notifications
```typescript
// Dans account-settings
{
  icon: 'notifications-outline',
  label: 'Notifications',
  route: '/notification-settings',
  badge: unreadCount > 0 ? unreadCount.toString() : undefined,
}
```

### 6. Recherche
```typescript
<PremiumInput
  icon="search"
  placeholder="Rechercher une notification..."
  value={searchQuery}
  onChangeText={setSearchQuery}
/>
```

---

## 📚 Ressources

- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [iOS Notification Guidelines](https://developer.apple.com/design/human-interface-guidelines/notifications)
- [Material Design Notifications](https://m3.material.io/components/badges/overview)

---

**Date :** 9 Décembre 2024  
**Status :** ✅ Complété  
**TypeScript Errors :** 0  
**Nouvelles Pages :** 1  
**Notifications :** 6 (3 non lues)  
**Fonctionnalités :** Filtres + Marquer lu + Supprimer + État vide
