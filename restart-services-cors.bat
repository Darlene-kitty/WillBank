@echo off
echo ========================================
echo Redemarrage des services avec CORS
echo ========================================

echo.
echo Arret des services en cours...
taskkill /f /im java.exe 2>nul

echo.
echo Attente de 5 secondes...
timeout /t 5 /nobreak >nul

echo.
echo Demarrage des services avec CORS...

echo.
echo [1/6] Demarrage Eureka Server...
start "Eureka Server" cmd /c "cd eureka-server && mvn spring-boot:run"
timeout /t 10 /nobreak >nul

echo.
echo [2/6] Demarrage Client Service...
start "Client Service" cmd /c "cd client-service && mvn spring-boot:run"
timeout /t 15 /nobreak >nul

echo.
echo [3/6] Demarrage Account Service...
start "Account Service" cmd /c "cd account-service && mvn spring-boot:run"
timeout /t 10 /nobreak >nul

echo.
echo [4/6] Demarrage Transaction Service...
start "Transaction Service" cmd /c "cd transaction-service && mvn spring-boot:run"
timeout /t 10 /nobreak >nul

echo.
echo [5/6] Demarrage Notification Service...
start "Notification Service" cmd /c "cd notification-service && mvn spring-boot:run"
timeout /t 10 /nobreak >nul

echo.
echo [6/6] Demarrage Dashboard Composite Service...
start "Dashboard Service" cmd /c "cd dashboard-composite-service && mvn spring-boot:run"
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo Tous les services sont en cours de demarrage
echo ========================================
echo.
echo URLs des services:
echo - Eureka Server: http://localhost:8761
echo - Client Service: http://localhost:8081
echo - Account Service: http://localhost:8082
echo - Transaction Service: http://localhost:8083
echo - Notification Service: http://localhost:8084
echo - Dashboard Service: http://localhost:8085
echo.
echo Frontend Angular: http://localhost:4200
echo.
echo Attendez 2-3 minutes pour que tous les services soient completement demarres
echo avant de tester le frontend.
echo.
pause