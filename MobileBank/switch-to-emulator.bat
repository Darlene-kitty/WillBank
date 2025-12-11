@echo off
echo ========================================
echo Configuration pour Émulateur Android
echo ========================================
echo.

echo Restauration de la configuration émulateur...
if exist "config\environment.emulator.backup.ts" (
    copy "config\environment.emulator.backup.ts" "config\environment.ts" >nul
    echo ✅ Configuration émulateur restaurée
) else (
    echo Création de la configuration émulateur...
    echo import { Platform } from 'react-native'; > "config\environment.ts"
    echo. >> "config\environment.ts"
    echo const isDev = __DEV__; >> "config\environment.ts"
    echo. >> "config\environment.ts"
    echo const getDevHost = ^(^) =^> { >> "config\environment.ts"
    echo   if ^(Platform.OS === 'web'^) { >> "config\environment.ts"
    echo     return 'localhost'; >> "config\environment.ts"
    echo   } else if ^(Platform.OS === 'android'^) { >> "config\environment.ts"
    echo     return '10.0.2.2'; >> "config\environment.ts"
    echo   } else { >> "config\environment.ts"
    echo     return 'localhost'; >> "config\environment.ts"
    echo   } >> "config\environment.ts"
    echo }; >> "config\environment.ts"
    echo ✅ Configuration émulateur créée
)

echo.
echo IP utilisée: 10.0.2.2 (émulateur Android)
echo.

pause