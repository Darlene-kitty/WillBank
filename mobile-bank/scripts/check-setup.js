#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration WillBank...\n');

let errors = 0;
let warnings = 0;

// Fonction pour exécuter une commande
function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    return null;
  }
}

// Vérifier Node.js
console.log('📦 Vérification de Node.js...');
const nodeVersion = runCommand('node --version');
if (nodeVersion) {
  const version = parseInt(nodeVersion.replace('v', '').split('.')[0]);
  if (version >= 18) {
    console.log(`✅ Node.js ${nodeVersion.trim()} (OK)`);
  } else {
    console.log(`❌ Node.js ${nodeVersion.trim()} (Version 18+ requise)`);
    errors++;
  }
} else {
  console.log('❌ Node.js non installé');
  errors++;
}

// Vérifier npm
console.log('\n📦 Vérification de npm...');
const npmVersion = runCommand('npm --version');
if (npmVersion) {
  console.log(`✅ npm ${npmVersion.trim()} (OK)`);
} else {
  console.log('❌ npm non installé');
  errors++;
}

// Vérifier les dépendances
console.log('\n📦 Vérification des dépendances...');
const nodeModulesExists = fs.existsSync(path.join(__dirname, '..', 'node_modules'));
if (nodeModulesExists) {
  console.log('✅ node_modules existe');
  
  // Vérifier les dépendances critiques
  const criticalDeps = [
    'react-native-reanimated',
    'expo-router',
    '@expo/vector-icons',
    'react-native-gesture-handler',
  ];
  
  criticalDeps.forEach(dep => {
    const depPath = path.join(__dirname, '..', 'node_modules', dep);
    if (fs.existsSync(depPath)) {
      console.log(`✅ ${dep} installé`);
    } else {
      console.log(`❌ ${dep} manquant`);
      errors++;
    }
  });
} else {
  console.log('❌ node_modules manquant (exécuter: npm install)');
  errors++;
}

// Vérifier babel.config.js
console.log('\n📦 Vérification de babel.config.js...');
const babelConfigPath = path.join(__dirname, '..', 'babel.config.js');
if (fs.existsSync(babelConfigPath)) {
  const babelConfig = fs.readFileSync(babelConfigPath, 'utf8');
  if (babelConfig.includes('react-native-reanimated/plugin')) {
    console.log('✅ babel.config.js configuré correctement');
  } else {
    console.log('⚠️  babel.config.js manque le plugin reanimated');
    warnings++;
  }
} else {
  console.log('❌ babel.config.js manquant');
  errors++;
}

// Vérifier tsconfig.json
console.log('\n📦 Vérification de tsconfig.json...');
const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
    console.log('✅ tsconfig.json configuré correctement');
  } else {
    console.log('⚠️  tsconfig.json manque la configuration des paths');
    warnings++;
  }
} else {
  console.log('❌ tsconfig.json manquant');
  errors++;
}

// Vérifier les fichiers critiques
console.log('\n📦 Vérification des fichiers critiques...');
const criticalFiles = [
  'app/_layout.tsx',
  'app/(tabs)/index.tsx',
  'contexts/theme-context.tsx',
  'constants/colors.ts',
];

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
    errors++;
  }
});

// Vérifier Expo
console.log('\n📦 Vérification d\'Expo...');
const expoVersion = runCommand('npx expo --version');
if (expoVersion) {
  console.log(`✅ Expo ${expoVersion.trim()} (OK)`);
} else {
  console.log('⚠️  Expo CLI non trouvé (sera installé automatiquement)');
  warnings++;
}

// Résumé
console.log('\n' + '='.repeat(50));
console.log('📊 RÉSUMÉ');
console.log('='.repeat(50));

if (errors === 0 && warnings === 0) {
  console.log('✅ Tout est OK ! Vous pouvez lancer l\'application.');
  console.log('\n🚀 Commandes disponibles:');
  console.log('   npm start        - Lancer le serveur de développement');
  console.log('   npm run android  - Lancer sur Android');
  console.log('   npm run ios      - Lancer sur iOS');
  console.log('   npm run web      - Lancer sur Web');
} else {
  if (errors > 0) {
    console.log(`❌ ${errors} erreur(s) trouvée(s)`);
  }
  if (warnings > 0) {
    console.log(`⚠️  ${warnings} avertissement(s)`);
  }
  
  console.log('\n🔧 Actions recommandées:');
  if (!nodeModulesExists) {
    console.log('   1. Exécuter: npm install');
  }
  if (errors > 0) {
    console.log('   2. Corriger les erreurs ci-dessus');
  }
  console.log('   3. Relancer ce script: node scripts/check-setup.js');
}

console.log('\n📚 Documentation:');
console.log('   - GUIDE_LANCEMENT_COMPLET.md');
console.log('   - WILLBANK_README.md');
console.log('   - QUICK_START.md');

process.exit(errors > 0 ? 1 : 0);
