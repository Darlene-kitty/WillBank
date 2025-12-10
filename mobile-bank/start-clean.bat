@echo off
echo Nettoyage du cache...
rmdir /s /q .expo 2>nul
rmdir /s /q node_modules\.cache 2>nul
del /q package-lock.json 2>nul

echo Installation des dependances...
call npm install

echo Demarrage d'Expo avec cache vide...
call npx expo start --clear --tunnel

pause
