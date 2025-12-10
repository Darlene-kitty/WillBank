# 💎 Guide des Composants Premium

## Vue d'ensemble

Cette bibliothèque contient **13 composants premium** réutilisables, inspirés des meilleurs Design Systems (Material Design 3, iOS HIG, Ant Mobile, Banking Modern).

---

## 📦 Composants Disponibles (14 composants)

### 1. **PremiumCard** - Carte Premium
```tsx
import { PremiumCard } from '@/components/shared';

<PremiumCard 
  gradient={['#0066FF', '#0052CC']}
  delay={100}
  elevated
>
  <Text>Contenu</Text>
</PremiumCard>
```

**Props:**
- `gradient?: string[]` - Couleurs du gradient
- `delay?: number` - Délai d'animation (ms)
- `elevated?: boolean` - Ombre premium
- `onPress?: () => void` - Action au clic

---

### 2. **PremiumInput** - Input Premium
```tsx
import { PremiumInput } from '@/components/shared';

<PremiumInput
  label="Email"
  icon="mail"
  placeholder="exemple@email.com"
  value={email}
  onChangeText={setEmail}
  error="Email invalide"
/>
```

**Props:**
- `label?: string` - Label au-dessus
- `icon?: IconName` - Icône gauche
- `rightIcon?: IconName` - Icône droite (ex: eye)
- `error?: string` - Message d'erreur
- Tous les props de `TextInput`

---

### 3. **PremiumChart** - Graphique Animé
```tsx
import { PremiumChart } from '@/components/shared';

<PremiumChart
  data={[100, 200, 150, 300, 250]}
  colors={['#0066FF', '#0052CC']}
  height={180}
  showGradient
/>
```

**Props:**
- `data: number[]` - Données du graphique
- `colors?: string[]` - Couleurs du gradient
- `height?: number` - Hauteur (défaut: 180)
- `showGradient?: boolean` - Gradient sur barres

---

### 4. **PremiumFAB** - Floating Action Button
```tsx
import { PremiumFAB } from '@/components/shared';

<PremiumFAB
  icon="add"
  onPress={() => {}}
  colors={['#0066FF', '#0052CC']}
  badge={3}
/>
```

**Props:**
- `icon: IconName` - Icône
- `onPress: () => void` - Action
- `colors?: string[]` - Gradient
- `badge?: number` - Badge de notification
- `size?: number` - Taille (défaut: 64)

---

### 5. **PremiumIcon** - Icône dans Container
```tsx
import { PremiumIcon } from '@/components/shared';

<PremiumIcon
  name="wallet"
  size={48}
  iconSize={24}
  colors={['#0066FF', '#0052CC']}
  shape="rounded"
  gradient
/>
```

**Props:**
- `name: IconName` - Nom de l'icône
- `size?: number` - Taille du container
- `iconSize?: number` - Taille de l'icône
- `shape?: 'circle' | 'rounded' | 'square'`
- `gradient?: boolean` - Gradient ou couleur unie

---

### 6. **PremiumBadge** - Badge Premium
```tsx
import { PremiumBadge } from '@/components/shared';

<PremiumBadge
  text="Nouveau"
  variant="success"
  size="medium"
  icon="checkmark-circle"
  gradient
/>
```

**Props:**
- `text: string | number` - Texte du badge
- `variant?: 'primary' | 'success' | 'warning' | 'error' | 'info'`
- `size?: 'small' | 'medium' | 'large'`
- `icon?: IconName` - Icône optionnelle
- `gradient?: boolean` - Style gradient

---

### 7. **PremiumDivider** - Séparateur
```tsx
import { PremiumDivider } from '@/components/shared';

<PremiumDivider text="ou continuer avec" />
<PremiumDivider variant="gradient" colors={['#0066FF', '#0052CC']} />
<PremiumDivider variant="dashed" />
```

**Props:**
- `text?: string` - Texte au centre
- `variant?: 'solid' | 'gradient' | 'dashed'`
- `colors?: string[]` - Couleurs du gradient
- `thickness?: number` - Épaisseur
- `spacing?: number` - Espacement vertical

---

### 8. **PremiumStat** - Statistique
```tsx
import { PremiumStat } from '@/components/shared';

<PremiumStat
  icon="trending-up"
  label="Revenus"
  value="2 500 €"
  trend="up"
  trendValue="+12%"
  colors={['#34C759', '#28A745']}
  variant="horizontal"
/>
```

**Props:**
- `icon: IconName` - Icône
- `label: string` - Label
- `value: string | number` - Valeur
- `trend?: 'up' | 'down' | 'neutral'` - Tendance
- `trendValue?: string` - Valeur de tendance
- `variant?: 'horizontal' | 'vertical'`

---

### 9. **PremiumTransactionItem** - Item de Transaction
```tsx
import { PremiumTransactionItem } from '@/components/shared';

<PremiumTransactionItem
  name="Apple Store"
  category="Shopping"
  date="Aujourd'hui"
  amount={-999.00}
  icon="bag-handle"
  onPress={() => {}}
/>
```

**Props:**
- `name: string` - Nom de la transaction
- `category: string` - Catégorie
- `date: string` - Date
- `amount: number` - Montant (négatif ou positif)
- `icon: IconName` - Icône
- `onPress?: () => void` - Action au clic

---

### 10. **PremiumAccountCard** - Carte de Compte
```tsx
import { PremiumAccountCard } from '@/components/shared';

<PremiumAccountCard
  name="Compte Courant"
  number="**** 1234"
  balance={10110.00}
  icon="card"
  colors={['#0066FF', '#0052CC']}
  balanceVisible={true}
  onPress={() => {}}
/>
```

**Props:**
- `name: string` - Nom du compte
- `number: string` - Numéro masqué
- `balance: number` - Solde
- `icon: IconName` - Icône
- `colors?: string[]` - Gradient
- `balanceVisible?: boolean` - Afficher le solde

---

### 11. **PremiumSuccessAnimation** - Animation de Succès
```tsx
import { PremiumSuccessAnimation } from '@/components/shared';

<PremiumSuccessAnimation
  size={100}
  colors={['#34C759', '#28A745']}
  delay={200}
/>
```

**Props:**
- `size?: number` - Taille (défaut: 100)
- `colors?: string[]` - Gradient
- `delay?: number` - Délai d'animation

---

### 12. **ThemeToggle** - Toggle Dark/Light Mode
```tsx
import { ThemeToggle } from '@/components/shared';

<ThemeToggle variant="default" />
<ThemeToggle variant="compact" />
```

**Props:**
- `variant?: 'default' | 'compact'` - Style
- `style?: ViewStyle` - Style personnalisé

---

### 13. **PremiumButton** - Bouton Premium
```tsx
import { PremiumButton } from '@/components/shared';

<PremiumButton
  title="Se connecter"
  onPress={() => {}}
  variant="primary"
  size="large"
  icon="arrow-forward"
  loading={false}
/>
```

**Props:**
- `title: string` - Texte du bouton
- `onPress: () => void` - Action
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost'`
- `size?: 'small' | 'medium' | 'large'`
- `icon?: IconName` - Icône
- `loading?: boolean` - État de chargement

---

### 14. **PremiumBottomNav** - Navigation Bottom Bar
```tsx
import { PremiumBottomNav, BottomNavItem } from '@/components/shared';

const navItems: BottomNavItem[] = [
  { id: 'home', label: 'Accueil', icon: 'home', onPress: () => {} },
  { id: 'transfer', label: 'Virements', icon: 'swap-horizontal', onPress: () => {} },
  { id: 'stats', label: 'Stats', icon: 'stats-chart', onPress: () => {} },
  { id: 'profile', label: 'Profil', icon: 'person', onPress: () => {} },
];

<PremiumBottomNav 
  items={navItems}
  activeId="home"
  variant="default"
/>
```

**Props:**
- `items: BottomNavItem[]` - Liste des items de navigation
- `activeId: string` - ID de l'item actif
- `variant?: 'default' | 'floating'` - Style (fixe ou flottant)
- `style?: ViewStyle` - Style personnalisé

**BottomNavItem:**
- `id: string` - Identifiant unique
- `label: string` - Label affiché
- `icon: IconName` - Icône Ionicons
- `onPress: () => void` - Action au clic

---

## 🎨 Palettes de Couleurs

### Gradients Prédéfinis
```tsx
// Primary
['#0066FF', '#0052CC']

// Success
['#34C759', '#28A745']

// Premium
['#667EEA', '#764BA2']

// Sunset
['#FF6B6B', '#FF8E53']

// Ocean
['#00D4FF', '#0066FF']
```

---

## 🚀 Bonnes Pratiques

### 1. **Animations**
- Utilisez `delay` pour créer des animations en cascade
- Respectez les durées: 200-400ms pour les animations rapides

### 2. **Accessibilité**
- Tous les composants supportent le dark mode
- Tailles de police respectent les standards bancaires

### 3. **Performance**
- Animations à 60 FPS avec Reanimated
- Composants optimisés avec `React.memo` si nécessaire

### 4. **Cohérence**
- Utilisez les mêmes gradients dans toute l'app
- Respectez la hiérarchie typographique

---

## 📱 Exemple Complet

```tsx
import {
  PremiumCard,
  PremiumInput,
  PremiumButton,
  PremiumDivider,
  PremiumBadge,
} from '@/components/shared';

export default function ExampleScreen() {
  return (
    <ScrollView>
      <PremiumCard gradient={['#0066FF', '#0052CC']} delay={0}>
        <PremiumBadge text="Premium" variant="success" gradient />
        
        <PremiumInput
          label="Email"
          icon="mail"
          placeholder="exemple@email.com"
        />
        
        <PremiumButton
          title="Continuer"
          onPress={() => {}}
          variant="primary"
        />
        
        <PremiumDivider text="ou" />
      </PremiumCard>
    </ScrollView>
  );
}
```

---

## 🔄 Migration depuis les Anciens Composants

| Ancien | Nouveau |
|--------|---------|
| `AnimatedCard` | `PremiumCard` |
| `AnimatedChart` | `PremiumChart` |
| `AnimatedFAB` | `PremiumFAB` |
| `AnimatedSuccessIcon` | `PremiumSuccessAnimation` |

---

## 📚 Ressources

- **Design Systems**: Material Design 3, iOS HIG, Ant Mobile
- **Animations**: React Native Reanimated
- **Gradients**: expo-linear-gradient
- **Icônes**: @expo/vector-icons (Ionicons)

---

---

## 🆕 Dernières Mises à Jour

### v1.1 - 9 Décembre 2024
- ✅ Ajout de `PremiumBottomNav` - Navigation bottom bar premium
- ✅ Support de 2 variants: default (fixe) et floating (flottante)
- ✅ Animations scale au press et indicateur actif avec gradient

---

**Créé avec ❤️ pour WillBank Mobile**
