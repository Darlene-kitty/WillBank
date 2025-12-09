# 🏦 Différenciation Compte Courant vs Compte Épargne

## 🎯 Objectif
Adapter la page de détails du compte pour afficher des informations et actions différentes selon le type de compte (Courant ou Épargne).

---

## ✅ Modifications Appliquées

### 1. Détection du Type de Compte

**Logique ajoutée :**
```typescript
// Déterminer le type de compte selon l'ID
const accountId = typeof id === 'string' ? parseInt(id) : 1;
const isCheckingAccount = accountId === 1; // 1 = Courant, 2 = Épargne
```

**Règle :**
- **ID 1** → Compte Courant
- **ID 2** → Compte Épargne

---

## 📊 Compte Courant (ID: 1)

### Données Spécifiques

```typescript
{
  name: 'Compte Courant',
  number: '**** 1234',
  balance: 10110.00,
  iban: 'FR76 3000 6000 0112 3456 7890 189',
  bic: 'BNPAFRPPXXX',
  status: 'Actif',
  openDate: '15 Janvier 2020',
  type: 'Compte Courant',
  interestRate: null,
  monthlyDeposit: null,
}
```

### Stats Affichées

| Stat | Icône | Valeur | Couleur |
|------|-------|--------|---------|
| Revenus | trending-up | +2 500 € | Vert |
| Dépenses | trending-down | -1 008 € | Rouge |

### Actions Rapides (4)

| Action | Icône | Couleur | Description |
|--------|-------|---------|-------------|
| **Virement** | paper-plane | Bleu | Faire un virement |
| **Dépôt** | add | Vert | Déposer de l'argent |
| **Relevé** | download | Orange | Télécharger le relevé |
| **Carte** | card | Violet | Gérer la carte bancaire |

### Transactions Récentes

```typescript
[
  { name: 'Apple Store', amount: -999.00, icon: 'bag-handle', category: 'Shopping' },
  { name: 'Starbucks', amount: -6.50, icon: 'cafe', category: 'Restaurant' },
  { name: 'Salaire', amount: 2500.00, icon: 'cash', category: 'Revenu' },
]
```

---

## 💰 Compte Épargne (ID: 2)

### Données Spécifiques

```typescript
{
  name: 'Épargne Premium',
  number: '**** 5678',
  balance: 5120.50,
  iban: 'FR76 3000 6000 0112 3456 7890 190',
  bic: 'BNPAFRPPXXX',
  status: 'Actif',
  openDate: '20 Mars 2021',
  type: 'Compte Épargne',
  interestRate: 3.5,        // Taux d'intérêt annuel
  monthlyDeposit: 200.00,   // Dépôt mensuel moyen
}
```

### Stats Affichées

| Stat | Icône | Valeur | Couleur |
|------|-------|--------|---------|
| Taux d'intérêt | trending-up | 3.5% / an | Violet |
| Dépôt mensuel | calendar | 200.00 € | Vert |

### Actions Rapides (4)

| Action | Icône | Couleur | Description |
|--------|-------|---------|-------------|
| **Alimenter** | add-circle | Vert | Ajouter de l'argent |
| **Auto** | repeat | Bleu | Virement automatique |
| **Relevé** | download | Orange | Télécharger le relevé |
| **Simuler** | calculator | Violet | Simuler les intérêts |

### Transactions Récentes

```typescript
[
  { name: 'Virement automatique', amount: 200.00, icon: 'repeat', category: 'Épargne' },
  { name: 'Intérêts mensuels', amount: 15.00, icon: 'trending-up', category: 'Intérêts' },
  { name: 'Virement automatique', amount: 200.00, icon: 'repeat', category: 'Épargne' },
]
```

### Section Informations d'Épargne (Exclusive)

**Nouvelle carte affichée uniquement pour le compte épargne :**

```
┌─────────────────────────────────────┐
│ Informations d'Épargne              │
│                                     │
│ [📈] Taux d'intérêt annuel          │
│      3.5% brut                      │
│                                     │
│ [💰] Intérêts mensuels estimés      │
│      14.94 €                        │
│                                     │
│ [📅] Intérêts annuels estimés       │
│      179.22 €                       │
└─────────────────────────────────────┘
```

**Calculs automatiques :**
```typescript
// Intérêts mensuels
const monthlyInterest = (balance * (interestRate / 100)) / 12;
// 5120.50 * (3.5 / 100) / 12 = 14.94 €

// Intérêts annuels
const annualInterest = balance * (interestRate / 100);
// 5120.50 * (3.5 / 100) = 179.22 €
```

---

## 📋 Comparaison Visuelle

### Compte Courant
```
┌─────────────────────────────────────┐
│  [←] Détails du Compte         [⋯]  │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ COMPTE COURANT      [👁]    │   │
│  │ **** 1234                   │   │
│  │                             │   │
│  │ SOLDE DISPONIBLE            │   │
│  │ 10 110,00 €                 │   │
│  │                             │   │
│  │ [↗ Revenus]  [↘ Dépenses]  │   │ ← Stats Courant
│  │  +2 500 €      -1 008 €    │   │
│  └─────────────────────────────┘   │
│                                     │
│  [🚀] [💰] [📄] [💳]              │ ← Actions Courant
│  Vir.  Dép. Rel. Carte            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Informations du Compte      │   │
│  │ ...                         │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Compte Épargne
```
┌─────────────────────────────────────┐
│  [←] Détails du Compte         [⋯]  │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ COMPTE ÉPARGNE      [👁]    │   │
│  │ **** 5678                   │   │
│  │                             │   │
│  │ SOLDE DISPONIBLE            │   │
│  │ 5 120,50 €                  │   │
│  │                             │   │
│  │ [📈 Taux]    [📅 Dépôt]    │   │ ← Stats Épargne
│  │  3.5% / an    200.00 €     │   │
│  └─────────────────────────────┘   │
│                                     │
│  [➕] [🔄] [📄] [🧮]              │ ← Actions Épargne
│  Ali. Auto Rel. Sim.              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Informations d'Épargne      │   │ ← Carte exclusive
│  │                             │   │
│  │ [📈] Taux: 3.5% brut        │   │
│  │ [💰] Mensuel: 14.94 €       │   │
│  │ [📅] Annuel: 179.22 €       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Informations du Compte      │   │
│  │ ...                         │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 🎨 Différences Clés

### 1. Stats

| Aspect | Compte Courant | Compte Épargne |
|--------|----------------|----------------|
| **Stat 1** | Revenus (+2 500 €) | Taux d'intérêt (3.5% / an) |
| **Stat 2** | Dépenses (-1 008 €) | Dépôt mensuel (200.00 €) |
| **Couleurs** | Vert/Rouge | Violet/Vert |
| **Focus** | Flux de trésorerie | Rendement |

### 2. Actions Rapides

| Position | Compte Courant | Compte Épargne |
|----------|----------------|----------------|
| **1** | Virement (paper-plane) | Alimenter (add-circle) |
| **2** | Dépôt (add) | Auto (repeat) |
| **3** | Relevé (download) | Relevé (download) |
| **4** | Carte (card) | Simuler (calculator) |

### 3. Transactions

| Aspect | Compte Courant | Compte Épargne |
|--------|----------------|----------------|
| **Types** | Shopping, Restaurant, Salaire | Virements auto, Intérêts |
| **Icônes** | bag-handle, cafe, cash | repeat, trending-up |
| **Montants** | Variables (-999 à +2500) | Réguliers (200, 15) |

### 4. Sections Exclusives

| Section | Compte Courant | Compte Épargne |
|---------|----------------|----------------|
| **Informations d'Épargne** | ❌ Non | ✅ Oui |
| **Calcul intérêts** | ❌ Non | ✅ Oui (mensuel + annuel) |
| **Taux d'intérêt** | ❌ Non | ✅ 3.5% brut |

---

## 🔧 Code Conditionnel

### Pattern Utilisé

```typescript
{isCheckingAccount ? (
  // Code pour Compte Courant
  <>
    <PremiumStat label="Revenus" value="+2 500 €" />
    <PremiumStat label="Dépenses" value="-1 008 €" />
  </>
) : (
  // Code pour Compte Épargne
  <>
    <PremiumStat label="Taux d'intérêt" value="3.5% / an" />
    <PremiumStat label="Dépôt mensuel" value="200.00 €" />
  </>
)}
```

### Sections Conditionnelles

1. **Stats** - Différentes selon le type
2. **Actions rapides** - 4 actions différentes
3. **Transactions** - Données différentes
4. **Informations d'Épargne** - Uniquement pour épargne

---

## 🧪 Tests Recommandés

### Compte Courant (ID: 1)
- [ ] Naviguer depuis dashboard → ID 1
- [ ] Header affiche "COMPTE COURANT"
- [ ] Solde : 10 110,00 €
- [ ] Stats : Revenus + Dépenses
- [ ] Actions : Virement, Dépôt, Relevé, Carte
- [ ] Transactions : Shopping, Restaurant, Salaire
- [ ] Pas de section "Informations d'Épargne"

### Compte Épargne (ID: 2)
- [ ] Naviguer depuis dashboard → ID 2
- [ ] Header affiche "COMPTE ÉPARGNE"
- [ ] Solde : 5 120,50 €
- [ ] Stats : Taux 3.5% + Dépôt 200 €
- [ ] Actions : Alimenter, Auto, Relevé, Simuler
- [ ] Transactions : Virements auto, Intérêts
- [ ] Section "Informations d'Épargne" visible
- [ ] Calculs intérêts corrects (14.94 € / 179.22 €)

### Navigation
- [ ] Clic sur carte compte courant → ID 1
- [ ] Clic sur carte compte épargne → ID 2
- [ ] Retour vers dashboard fonctionne

---

## 💡 Améliorations Futures

### 1. Plus de Types de Comptes

```typescript
type AccountType = 'checking' | 'savings' | 'investment' | 'loan';

const accountTypes = {
  checking: { name: 'Compte Courant', icon: 'card' },
  savings: { name: 'Compte Épargne', icon: 'wallet' },
  investment: { name: 'Compte Titres', icon: 'trending-up' },
  loan: { name: 'Compte Prêt', icon: 'home' },
};
```

### 2. Graphique d'Évolution (Épargne)

```typescript
<PremiumChart 
  data={savingsHistory}
  colors={['#667EEA', '#764BA2']}
  height={180}
  showGradient
/>
```

### 3. Objectif d'Épargne

```typescript
<View style={styles.goalCard}>
  <Text>Objectif: 10 000 €</Text>
  <ProgressBar progress={balance / 10000} />
  <Text>Reste: {(10000 - balance).toFixed(2)} €</Text>
</View>
```

### 4. Simulateur d'Intérêts

```typescript
const simulateInterest = (amount: number, rate: number, years: number) => {
  return amount * Math.pow(1 + rate / 100, years);
};

// Dans 5 ans avec 200€/mois
const futureValue = simulateInterest(balance + (200 * 12 * 5), 3.5, 5);
```

### 5. Historique des Intérêts

```typescript
const interestHistory = [
  { month: 'Janvier', amount: 14.50 },
  { month: 'Février', amount: 14.80 },
  { month: 'Mars', amount: 15.10 },
  // ...
];
```

---

## 📚 Ressources

- [Types de comptes bancaires](https://www.banque-france.fr/particuliers/comptes-bancaires)
- [Calcul des intérêts composés](https://www.service-public.fr/particuliers/vosdroits/F2365)
- [Livret d'épargne réglementé](https://www.economie.gouv.fr/particuliers/livrets-epargne-reglementee)

---

**Date :** 9 Décembre 2024  
**Status :** ✅ Complété  
**TypeScript Errors :** 0  
**Types de Comptes :** 2 (Courant + Épargne)  
**Différences :** Stats, Actions, Transactions, Section exclusive
