@echo off
echo ========================================
echo Verification de l'etat des services
echo ========================================

echo.
echo [1/6] Verification Eureka Server (port 8761)...
curl -s -o nul -w "Status: %%{http_code}" http://localhost:8761/actuator/health 2>nul
if %errorlevel% equ 0 (
    echo  - OK
) else (
    echo  - En cours de demarrage...
)

echo.
echo [2/6] Verification Client Service (port 8081)...
curl -s -o nul -w "Status: %%{http_code}" http://localhost:8081/actuator/health 2>nul
if %errorlevel% equ 0 (
    echo  - OK
) else (
    echo  - En cours de demarrage...
)

echo.
echo [3/6] Verification Account Service (port 8082)...
curl -s -o nul -w "Status: %%{http_code}" http://localhost:8082/actuator/health 2>nul
if %errorlevel% equ 0 (
    echo  - OK
) else (
    echo  - En cours de demarrage...
)

echo.
echo [4/6] Verification Transaction Service (port 8083)...
curl -s -o nul -w "Status: %%{http_code}" http://localhost:8083/actuator/health 2>nul
if %errorlevel% equ 0 (
    echo  - OK
) else (
    echo  - En cours de demarrage...
)

echo.
echo [5/6] Verification Notification Service (port 8084)...
curl -s -o nul -w "Status: %%{http_code}" http://localhost:8084/actuator/health 2>nul
if %errorlevel% equ 0 (
    echo  - OK
) else (
    echo  - En cours de demarrage...
)

echo.
echo [6/6] Verification Dashboard Service (port 8085)...
curl -s -o nul -w "Status: %%{http_code}" http://localhost:8085/actuator/health 2>nul
if %errorlevel% equ 0 (
    echo  - OK
) else (
    echo  - En cours de demarrage...
)

echo.
echo ========================================
echo Test des endpoints principaux
echo ========================================

echo.
echo Test Account Service - GET /api/accounts...
curl -s -o nul -w "Status: %%{http_code}" http://localhost:8082/api/accounts 2>nul
if %errorlevel% equ 0 (
    echo  - OK
) else (
    echo  - Service non disponible
)

echo.
echo Test Transaction Service - GET /api/transactions...
curl -s -o nul -w "Status: %%{http_code}" http://localhost:8083/api/transactions 2>nul
if %errorlevel% equ 0 (
    echo  - OK
) else (
    echo  - Service non disponible
)

echo.
echo Test Client Service - GET /api/clients...
curl -s -o nul -w "Status: %%{http_code}" http://localhost:8081/api/clients 2>nul
if %errorlevel% equ 0 (
    echo  - OK
) else (
    echo  - Service non disponible
)

echo.
echo ========================================
echo Verification terminee
echo ========================================
echo.
echo Si des services ne sont pas encore prets,
echo attendez encore 1-2 minutes et relancez ce script.
echo.
pause