@echo off
echo ========================================
echo Demarrage de WillBank Backend
echo ========================================

echo.
echo [1/7] Demarrage Eureka Server...
start "Eureka Server" cmd /k "cd eureka-server && mvn spring-boot:run"
timeout /t 30

echo.
echo [2/7] Demarrage Client Service...
start "Client Service" cmd /k "cd client-service && mvn spring-boot:run"
timeout /t 15

echo.
echo [3/7] Demarrage Account Service...
start "Account Service" cmd /k "cd account-service && mvn spring-boot:run"
timeout /t 15

echo.
echo [4/7] Demarrage Transaction Service...
start "Transaction Service" cmd /k "cd transaction-service && mvn spring-boot:run"
timeout /t 15

echo.
echo [5/7] Demarrage Notification Service...
start "Notification Service" cmd /k "cd notification-service && mvn spring-boot:run"
timeout /t 15

echo.
echo [6/7] Demarrage Dashboard Composite Service...
start "Dashboard Service" cmd /k "cd dashboard-composite-service && mvn spring-boot:run"
timeout /t 15

echo.
echo [7/7] Demarrage API Gateway...
start "API Gateway" cmd /k "cd api-gateway && mvn spring-boot:run"

echo.
echo ========================================
echo Tous les services sont en cours de demarrage
echo Veuillez patienter 2-3 minutes
echo ========================================
echo.
echo Eureka Dashboard: http://localhost:8761
echo API Gateway: http://localhost:8080
echo Swagger UI disponible sur chaque service
echo.
pause
