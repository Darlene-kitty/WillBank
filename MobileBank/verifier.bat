@echo off
echo ========================================
echo Verification de la configuration Expo
echo ========================================
echo.

echo [1/5] Verification de Node.js...
node --version
echo.

echo [2/5] Verification de npm...
npm --version
echo.

echo [3/5] Verification des dependances Expo...
npx expo-doctor
echo.

echo [4/5] Verification des dependances npm...
npx expo install --check
echo.

echo [5/5] Structure du projet...
dir /b app
echo.

echo ========================================
echo Verification terminee!
echo ========================================
echo.
echo Pour demarrer l'application:
echo   1. Executez: start-clean.bat
echo   2. Scannez le QR code avec Expo Go
echo   3. Si erreur, utilisez: npx expo start --tunnel
echo.

pause
