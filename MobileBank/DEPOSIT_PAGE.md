# 💰 Page de Dépôt d'Argent

## 🎯 Objectif
Créer une page complète pour déposer de l'argent sur un compte, avec sélection du compte, méthode de dépôt, montant et référence.

---

## ✅ Page Créée

**Fichier :** `app/(screens)/deposit.tsx`

**Structure de la page :**

```
┌─────────────────────────────────────┐
│  [←] Dépôt d'Argent                 │ ← Header Gradient Vert
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ VERS VOTRE COMPTE           │   │
│  │                             │   │
│  │ [💳] Compte Courant    [✓]  │   │ ← Sélection Compte
│  │      **** 1234              │   │
│  │      10 110,00 €            │   │
│  │                             │   │
│  │ [💰] Épargne Premium        │   │
│  │      **** 5678              │   │
│  │      5 120,50 €             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ MÉTHODE DE DÉPÔT            │   │
│  │                             │   │
│  │ [📄]      [💵]              │   │ ← Grille 2x2
│  │ Chèque    Espèces           │   │
│  │                             │   │
│  │ [↔️]      [💳]              │   │
│  │ Virement Carte              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ MONTANT                     │   │
│  │                             │   │
│  │ ┌─────────────────────────┐ │   │
│  │ │  500.00            €    │ │   │ ← Input Gradient Vert
│  │ └─────────────────────────┘ │   │
│  │                             │   │
│  │ [50€] [100€] [200€] [500€]  │   │ ← Montants rapides
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ RÉFÉRENCE (OPTIONNEL)       │   │
│  │                             │   │
│  │ [📄] Ex: Salaire, Prime...  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ℹ️ Les dépôts par chèque    │   │ ← Info Card
│  │   peuvent prendre 2-3 jours │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Continuer →]                      │ ← Bouton
│                                     │
└─────────────────────────────────────┘
```

---

## 🎨 Design

### Header Gradient Vert
```typescript
<LinearGradient
  colors={['#34C759', '#28A745']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
```

**Pourquoi vert ?**
- ✅ Couleur associée à l'argent et aux gains
- ✅ Différenciation avec les autres pages
- ✅ Cohérent avec l'action de dépôt (positif)

---

## 📋 Sections de la Page

### 1. Sélection du Compte (2 comptes)

**Comptes disponibles :**

| Compte | Numéro | Solde | Icône |
|--------|--------|-------|-------|
| Compte Courant | **** 1234 | 10 110,00 € | card |
| Épargne Premium | **** 5678 | 5 120,50 € | wallet |

**Comportement :**
- Clic sur un compte → Sélection
- Compte sélectionné → Bordure bleue + checkmark
- Fond coloré pour le compte sélectionné

**Code :**
```typescript
const [selectedAccount, setSelectedAccount] = useState('Compte Courant');

<Pressable
  style={[
    styles.accountItem,
    selectedAccount === account.name && styles.accountItemSelected,
  ]}
  onPress={() => setSelectedAccount(account.name)}
>
  {/* Contenu */}
  {selectedAccount === account.name && (
    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
  )}
</Pressable>
```

---

### 2. Méthode de Dépôt (4 méthodes)

**Grille 2x2 :**

| Méthode | Icône | Description |
|---------|-------|-------------|
| **Chèque** | document-text | Dépôt par chèque |
| **Espèces** | cash | Dépôt en espèces |
| **Virement** | swap-horizontal | Virement externe |
| **Carte** | card | Carte bancaire |

**Comportement :**
- Clic sur une méthode → Sélection
- Méthode sélectionnée → Bordure verte + icône colorée
- Icône grise pour les non sélectionnées

**Code :**
```typescript
const [depositMethod, setDepositMethod] = useState('');

<Pressable
  style={[
    styles.methodItem,
    depositMethod === method.name && styles.methodItemSelected,
  ]}
  onPress={() => setDepositMethod(method.name)}
>
  <PremiumIcon
    name={method.icon}
    colors={depositMethod === method.name 
      ? ['#34C759', '#28A745'] 
      : ['#8E8E93', '#8E8E93']
    }
  />
  <Text>{method.name}</Text>
</Pressable>
```

---

### 3. Montant

**Input avec Gradient Vert :**
```typescript
<LinearGradient
  colors={['#34C759', '#28A745']}
  style={styles.amountContainer}
>
  <TextInput
    placeholder="0.00"
    value={amount}
    onChangeText={setAmount}
    keyboardType="decimal-pad"
    style={styles.amountInput}
  />
  <Text style={styles.currency}>€</Text>
</LinearGradient>
```

**Montants Rapides (4) :**
- 50 €
- 100 €
- 200 €
- 500 €

**Comportement :**
- Clic sur un montant → Remplit l'input
- Clavier numérique avec décimales
- Validation : montant > 0

---

### 4. Référence (Optionnel)

**Input avec PremiumInput :**
```typescript
<PremiumInput
  icon="document-text"
  placeholder="Ex: Salaire, Prime..."
  value={reference}
  onChangeText={setReference}
/>
```

**Exemples de références :**
- Salaire
- Prime
- Remboursement
- Cadeau
- Vente

---

### 5. Carte d'Information

**Message :**
> ℹ️ Les dépôts par chèque peuvent prendre 2-3 jours ouvrés pour être crédités.

**Design :**
- Icône information-circle
- Fond card
- Texte secondaire
- Bordure arrondie

---

### 6. Bouton Continuer

**PremiumButton :**
```typescript
<PremiumButton
  title="Continuer"
  onPress={handleContinue}
  icon="arrow-forward"
  variant="primary"
  disabled={!amount || parseFloat(amount) <= 0 || !depositMethod}
/>
```

**Conditions d'activation :**
- ✅ Montant saisi
- ✅ Montant > 0
- ✅ Méthode de dépôt sélectionnée

**Navigation :**
```typescript
router.push({
  pathname: '/deposit-confirmation',
  params: {
    amount,
    account: selectedAccount,
    method: depositMethod,
    reference: reference || 'Dépôt'
  }
});
```

---

## 🎯 Fonctionnalités

### 1. Sélection Multiple

**3 sélections requises :**
1. Compte de destination
2. Méthode de dépôt
3. Montant

**1 sélection optionnelle :**
4. Référence

### 2. Validation

**Règles :**
- Montant doit être > 0
- Méthode de dépôt obligatoire
- Compte pré-sélectionné (Compte Courant)
- Référence optionnelle

### 3. Feedback Visuel

**États :**
- **Non sélectionné** - Fond gris, icône grise
- **Sélectionné** - Bordure colorée, icône colorée, checkmark
- **Désactivé** - Bouton grisé, opacité réduite

### 4. Keyboard Handling

**KeyboardAvoidingView :**
```typescript
<KeyboardAvoidingView 
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={0}
>
  <ScrollView keyboardShouldPersistTaps="handled">
    {/* Contenu */}
  </ScrollView>
</KeyboardAvoidingView>
```

---

## 🎨 Composants Utilisés

### Composants Premium
1. **PremiumCard** (4x) - Cartes de section
2. **PremiumInput** (1x) - Input référence
3. **PremiumButton** (1x) - Bouton continuer
4. **PremiumIcon** (4x) - Icônes méthodes de dépôt

### Composants Natifs
- **LinearGradient** (2x) - Header + Input montant
- **SafeAreaView** - Zones sûres
- **KeyboardAvoidingView** - Gestion clavier
- **ScrollView** - Scroll vertical
- **TextInput** - Input montant
- **Pressable** - Boutons interactifs
- **Ionicons** - Icônes

---

## 📊 Flux Utilisateur

```
1. Ouvrir la page
   ↓
2. Sélectionner le compte (pré-sélectionné: Courant)
   ↓
3. Choisir la méthode de dépôt (Chèque/Espèces/Virement/Carte)
   ↓
4. Saisir le montant (ou clic rapide)
   ↓
5. [Optionnel] Ajouter une référence
   ↓
6. Cliquer sur "Continuer"
   ↓
7. Navigation vers page de confirmation
```

---

## 🧪 Tests Recommandés

### 1. Sélection Compte
- [ ] Compte Courant pré-sélectionné
- [ ] Clic sur Épargne → Sélection change
- [ ] Checkmark visible sur compte sélectionné
- [ ] Bordure bleue sur compte sélectionné

### 2. Méthode de Dépôt
- [ ] Aucune méthode sélectionnée par défaut
- [ ] Clic sur Chèque → Sélection
- [ ] Icône devient verte
- [ ] Bordure verte apparaît
- [ ] Clic sur autre méthode → Change sélection

### 3. Montant
- [ ] Input vide par défaut
- [ ] Clavier numérique s'ouvre
- [ ] Saisie "100.50" fonctionne
- [ ] Clic sur "50 €" → Input = "50"
- [ ] Clic sur "500 €" → Input = "500"

### 4. Référence
- [ ] Input vide par défaut
- [ ] Saisie texte fonctionne
- [ ] Optionnel (pas obligatoire)

### 5. Bouton Continuer
- [ ] Désactivé si montant vide
- [ ] Désactivé si montant = 0
- [ ] Désactivé si méthode non sélectionnée
- [ ] Activé si tout est valide
- [ ] Navigation vers confirmation

### 6. Keyboard
- [ ] Clavier ne cache pas l'input
- [ ] Scroll automatique vers input actif
- [ ] Fermeture clavier fonctionne

### 7. Affichage
- [ ] Header vert visible
- [ ] SafeArea respectée
- [ ] Scroll fluide
- [ ] Animations d'entrée

---

## 💡 Améliorations Futures

### 1. Historique des Dépôts

```typescript
const recentDeposits = [
  { date: '15 Nov', amount: 500, method: 'Chèque' },
  { date: '1 Nov', amount: 200, method: 'Espèces' },
];

<View style={styles.historySection}>
  <Text>Dépôts récents</Text>
  {recentDeposits.map(deposit => (
    <View key={deposit.date}>
      <Text>{deposit.date} - {deposit.amount} € ({deposit.method})</Text>
    </View>
  ))}
</View>
```

### 2. Scan de Chèque

```typescript
import * as ImagePicker from 'expo-image-picker';

const scanCheck = async () => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
  });
  
  if (!result.canceled) {
    // OCR pour extraire le montant
  }
};
```

### 3. Limites de Dépôt

```typescript
const depositLimits = {
  cheque: { daily: 5000, monthly: 20000 },
  cash: { daily: 1000, monthly: 5000 },
  transfer: { daily: 10000, monthly: 50000 },
  card: { daily: 2000, monthly: 10000 },
};

// Afficher la limite restante
<Text>Limite restante: {limit - totalToday} €</Text>
```

### 4. Frais de Dépôt

```typescript
const depositFees = {
  cheque: 0,
  cash: 0,
  transfer: 0,
  card: amount => amount * 0.01, // 1%
};

const fee = depositFees[depositMethod](parseFloat(amount));

<Text>Frais: {fee.toFixed(2)} €</Text>
<Text>Total: {(parseFloat(amount) + fee).toFixed(2)} €</Text>
```

### 5. Dépôt Récurrent

```typescript
const [isRecurring, setIsRecurring] = useState(false);
const [frequency, setFrequency] = useState('monthly');

<View style={styles.recurringSection}>
  <Switch value={isRecurring} onValueChange={setIsRecurring} />
  <Text>Dépôt automatique</Text>
  
  {isRecurring && (
    <Picker selectedValue={frequency} onValueChange={setFrequency}>
      <Picker.Item label="Hebdomadaire" value="weekly" />
      <Picker.Item label="Mensuel" value="monthly" />
      <Picker.Item label="Trimestriel" value="quarterly" />
    </Picker>
  )}
</View>
```

### 6. Confirmation Biométrique

```typescript
import * as LocalAuthentication from 'expo-local-authentication';

const handleContinue = async () => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Confirmer le dépôt',
  });
  
  if (result.success) {
    router.push('/deposit-confirmation');
  }
};
```

---

## 📚 Ressources

- [Dépôt de chèque](https://www.service-public.fr/particuliers/vosdroits/F2368)
- [Dépôt d'espèces](https://www.banque-france.fr/particuliers/depot-especes)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [Expo Local Authentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/)

---

**Date :** 9 Décembre 2024  
**Status :** ✅ Complété  
**TypeScript Errors :** 0  
**Méthodes de Dépôt :** 4  
**Montants Rapides :** 4  
**Composants Premium :** 4
