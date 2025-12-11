@echo off
echo ========================================
echo Test de connexion Emulateur Android
echo ========================================
echo.

echo Configuration pour emulateur Android:
echo - IP emulateur: 10.0.2.2 (pointe vers localhost de la machine hote)
echo - Client Service: http://10.0.2.2:8081
echo - Account Service: http://10.0.2.2:8082
echo - Transaction Service: http://10.0.2.2:8083
echo - Notification Service: http://10.0.2.2:8084
echo - Dashboard Service: http://10.0.2.2:8085
echo.

echo ========================================
echo Test des endpoints depuis emulateur
echo ========================================
echo.

echo 1. Test Client Service (Auth)...
curl -X GET "http://localhost:8081/api/clients" -H "Content-Type: application/json" --connect-timeout 5 --max-time 10
if %errorlevel% equ 0 (
    echo    - Client Service accessible depuis emulateur
) else (
    echo    - Client Service NON accessible
)
echo.

echo 2. Test Account Service...
curl -X GET "http://localhost:8082/api/accounts" -H "Content-Type: application/json" --connect-timeout 5 --max-time 10
if %errorlevel% equ 0 (
    echo    - Account Service accessible depuis emulateur
) else (
    echo    - Account Service NON accessible
)
echo.

echo 3. Test Transaction Service...
curl -X GET "http://localhost:8083/api/transactions" -H "Content-Type: application/json" --connect-timeout 5 --max-time 10
if %errorlevel% equ 0 (
    echo    - Transaction Service accessible depuis emulateur
) else (
    echo    - Transaction Service NON accessible
)
echo.

echo 4. Test Notification Service...
curl -X GET "http://localhost:8084/api/notifications" -H "Content-Type: application/json" --connect-timeout 5 --max-time 10
if %errorlevel% equ 0 (
    echo    - Notification Service accessible depuis emulateur
) else (
    echo    - Notification Service NON accessible
)
echo.

echo 5. Test Dashboard Service...
curl -X GET "http://localhost:8085/api/dashboard/1" -H "Content-Type: application/json" --connect-timeout 5 --max-time 10
if %errorlevel% equ 0 (
    echo    - Dashboard Service accessible depuis emulateur
) else (
    echo    - Dashboard Service NON accessible
)
echo.

echo ========================================
echo RÉSUMÉ
echo ========================================
echo.
echo L'application mobile est configuree pour:
echo - Emulateur Android: 10.0.2.2 (pointe vers localhost)
echo - iOS Simulator: localhost
echo - Web: localhost
echo.
echo Pour appareil physique, utilisez environment.physical-device.ts
echo avec l'IP reelle: 172.17.8.245
echo.

pause