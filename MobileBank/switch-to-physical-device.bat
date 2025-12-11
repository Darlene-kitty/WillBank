@echo off
echo ========================================
echo Configuration pour Appareil Physique
echo ========================================
echo.

echo Sauvegarde de la configuration actuelle...
copy "config\environment.ts" "config\environment.emulator.backup.ts" >nul

echo Copie de la configuration pour appareil physique...
copy "config\environment.physical-device.ts" "config\environment.ts" >nul

echo.
echo ✅ Configuration mise à jour pour appareil physique
echo IP utilisée: 172.17.8.245
echo.
echo Pour revenir à l'émulateur, utilisez switch-to-emulator.bat
echo.

pause