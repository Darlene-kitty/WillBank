# 📦 Installation - MobileBank

## Dépendances Manquantes

Pour que l'intégration backend fonctionne, vous devez installer AsyncStorage :

```bash
cd MobileBank
npm install @react-native-async-storage/async-storage
```

## Vérification

Après installation, vérifiez qu'il n'y a plus d'erreurs :

```bash
npm run type-check
```

## Démarrage

```bash
npm start
```

---

**Note**: Cette dépendance est nécessaire pour le stockage sécurisé des tokens JWT.
