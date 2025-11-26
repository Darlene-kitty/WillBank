@echo off
echo ========================================
echo WillBank Microservices Startup Script
echo ========================================
echo.

echo Checking prerequisites...
echo.

echo [1/7] Starting Eureka Server (8761)...
start "Eureka Server" cmd /k "cd eureka-server && mvn spring-boot:run"
timeout /t 30 /nobreak

echo [2/7] Starting Client Service (8081)...
start "Client Service" cmd /k "cd client-service && mvn spring-boot:run"
timeout /t 15 /nobreak

echo [3/7] Starting Account Service (8082)...
start "Account Service" cmd /k "cd account-service && mvn spring-boot:run"
timeout /t 15 /nobreak

echo [4/7] Starting Transaction Service (8083)...
start "Transaction Service" cmd /k "cd transaction-service && mvn spring-boot:run"
timeout /t 15 /nobreak

echo [5/7] Starting Notification Service (8084)...
start "Notification Service" cmd /k "cd notification-service && mvn spring-boot:run"
timeout /t 15 /nobreak

echo [6/7] Starting Dashboard Composite Service (8085)...
start "Dashboard Service" cmd /k "cd dashboard-composite-service && mvn spring-boot:run"
timeout /t 15 /nobreak

echo [7/7] Starting API Gateway (8080)...
start "API Gateway" cmd /k "cd api-gateway && mvn spring-boot:run"

echo.
echo ========================================
echo All services are starting...
echo Please wait 2-3 minutes for full startup
echo.
echo Eureka Dashboard: http://localhost:8761
echo API Gateway: http://localhost:8080
echo ========================================
echo.
pause
