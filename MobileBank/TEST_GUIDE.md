# 🧪 Guide de Test Rapide

## 🚀 Lancer l'Application

```bash
cd MobileBank
npx expo start
```

Ensuite, choisissez :
- **i** pour iOS Simulator
- **a** pour Android Emulator
- Scanner le **QR code** avec Expo Go sur votre téléphone

---

## ✅ Tests à Effectuer

### 1. Page de Connexion (Login)

**Test du clavier :**
1. Cliquer sur le champ "Email"
2. ✅ Le clavier apparaît
3. ✅ Le champ reste visible (pas caché par le clavier)
4. Cliquer sur le champ "Mot de passe"
5. ✅ Le clavier reste ouvert
6. ✅ Le champ reste visible

**Test des zones sûres :**
1. ✅ Le header ne chevauche pas la barre d'état
2. ✅ Le contenu ne touche pas les bords de l'écran
3. ✅ Le badge "SSL 256-bit" est visible en bas

---

### 2. Page Nouveau Virement

**Test de saisie du montant (IMPORTANT) :**
1. Aller sur la page "Nouveau Virement"
2. Cliquer sur le champ montant (grand champ bleu)
3. ✅ Le clavier numérique apparaît
4. Taper "150.50"
5. ✅ Le montant s'affiche correctement
6. Cliquer sur un bouton rapide (ex: "100 €")
7. ✅ Le montant change à 100

**Test des autres champs :**
1. Cliquer sur "Bénéficiaire"
2. ✅ Le clavier texte apparaît
3. ✅ Le champ reste visible
4. Cliquer sur "Référence"
5. ✅ Le clavier texte apparaît
6. ✅ Le champ reste visible

**Test du bouton Continuer :**
1. Sans montant → ✅ Bouton désactivé (grisé)
2. Avec montant → ✅ Bouton actif (bleu)
3. Cliquer sur "Continuer" → ✅ Navigation vers confirmation

---

### 3. Page Dashboard

**Test de l'affichage :**
1. ✅ Header avec gradient bleu visible
2. ✅ Avatar et nom "William" visibles
3. ✅ Badge notification "3" visible
4. ✅ Carte de solde total visible
5. ✅ 2 cartes de comptes visibles
6. ✅ 4 boutons d'action visibles
7. ✅ Liste des transactions visible
8. ✅ FAB (bouton flottant) en bas à droite

**Test du scroll :**
1. Scroller vers le bas
2. ✅ Scroll fluide
3. ✅ Toutes les transactions visibles

---

### 4. Page Statistiques

**Test de l'affichage :**
1. Cliquer sur le bouton "Stats" du dashboard
2. ✅ Header violet visible
3. ✅ Carte "Vue d'ensemble" avec 3 stats
4. ✅ Graphique "Dépenses par Catégorie" visible
5. ✅ Légende des catégories visible
6. ✅ Graphique "Tendance Mensuelle" visible
7. ✅ Labels des mois visibles
8. ✅ Liste "Principales Dépenses" visible

**Test du scroll :**
1. Scroller vers le bas
2. ✅ Scroll fluide
3. ✅ Tous les graphiques visibles

---

## 📱 Tests sur Différents Appareils

### iPhone SE (Petit Écran)
- [ ] Login : tout visible sans scroll excessif
- [ ] Nouveau virement : champs visibles avec clavier
- [ ] Dashboard : contenu bien espacé
- [ ] Statistiques : graphiques lisibles

### iPhone 14 Pro (Encoche)
- [ ] Headers ne chevauchent pas l'encoche
- [ ] SafeArea respectée partout
- [ ] Contenu centré correctement

### iPhone 14 Pro Max (Grand Écran)
- [ ] Pas d'espace vide excessif
- [ ] Contenu bien réparti
- [ ] Animations fluides

### Android (Divers)
- [ ] Clavier fonctionne correctement
- [ ] SafeArea respectée
- [ ] Pas de problèmes de layout

---

## 🐛 Problèmes Connus Résolus

### ✅ Saisie du montant bloquée
**Avant :** Impossible de taper dans le champ montant  
**Après :** Saisie fonctionnelle avec clavier numérique

### ✅ Clavier cache les inputs
**Avant :** Les champs étaient cachés par le clavier  
**Après :** KeyboardAvoidingView + ScrollView gèrent le scroll automatique

### ✅ Header chevauche la barre d'état
**Avant :** Sur iPhone avec encoche, le header touchait la barre d'état  
**Après :** SafeAreaView respecte les zones sûres

---

## 🎯 Critères de Succès

L'application est prête si :
- ✅ Tous les champs de saisie sont accessibles
- ✅ Le clavier ne cache aucun input
- ✅ Les headers respectent les zones sûres
- ✅ Le scroll est fluide partout
- ✅ Aucun contenu n'est coupé
- ✅ Les animations sont à 60 FPS
- ✅ Le design premium est conservé

---

## 📞 Support

Si vous rencontrez un problème :
1. Vérifier que vous êtes sur la dernière version
2. Redémarrer l'application
3. Vider le cache : `npx expo start -c`
4. Vérifier les logs : `npx expo start --dev-client`

---

**Bon test ! 🚀**
