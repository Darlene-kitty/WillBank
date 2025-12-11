@echo off
echo ========================================
echo Test de connexion Frontend Mobile-bank
echo vers les Microservices (Bypass Gateway)
echo ========================================
echo.

echo Configuration des services selon environment.ts:
echo - Account Service: http://localhost:8082
echo - Dashboard Service: http://localhost:8085  
echo - Transaction Service: http://localhost:8083
echo - Notification Service: http://localhost:8084
echo.

echo ========================================
echo 1. TEST ACCOUNT SERVICE (Port 8082)
echo ========================================
echo.
echo Test endpoint: /api/accounts
curl -s -w "HTTP Status: %%{http_code}\n" "http://localhost:8082/api/accounts" --connect-timeout 5 --max-time 10
echo.

echo ========================================
echo 2. TEST DASHBOARD SERVICE (Port 8085)
echo ========================================
echo.
echo Test endpoint: /api/dashboard/1
curl -s -w "HTTP Status: %%{http_code}\n" "http://localhost:8085/api/dashboard/1" --connect-timeout 5 --max-time 10
echo.

echo ========================================
echo 3. TEST TRANSACTION SERVICE (Port 8083)
echo ========================================
echo.
echo Test endpoint: /api/transactions
curl -s -w "HTTP Status: %%{http_code}\n" "http://localhost:8083/api/transactions" --connect-timeout 5 --max-time 10
echo.

echo ========================================
echo 4. TEST NOTIFICATION SERVICE (Port 8084)
echo ========================================
echo.
echo Test endpoint: /api/notifications
curl -s -w "HTTP Status: %%{http_code}\n" "http://localhost:8084/api/notifications" --connect-timeout 5 --max-time 10
echo.

echo ========================================
echo TEST CORS (Preflight OPTIONS)
echo ========================================
echo.

echo Test CORS Account Service...
curl -X OPTIONS "http://localhost:8082/api/accounts" -H "Origin: http://localhost:4200" -H "Access-Control-Request-Method: GET" -s -w "HTTP Status: %%{http_code}\n"
echo.

echo Test CORS Dashboard Service...
curl -X OPTIONS "http://localhost:8085/api/dashboard/1" -H "Origin: http://localhost:4200" -H "Access-Control-Request-Method: GET" -s -w "HTTP Status: %%{http_code}\n"
echo.

echo Test CORS Transaction Service...
curl -X OPTIONS "http://localhost:8083/api/transactions" -H "Origin: http://localhost:4200" -H "Access-Control-Request-Method: GET" -s -w "HTTP Status: %%{http_code}\n"
echo.

echo Test CORS Notification Service...
curl -X OPTIONS "http://localhost:8084/api/notifications" -H "Origin: http://localhost:4200" -H "Access-Control-Request-Method: GET" -s -w "HTTP Status: %%{http_code}\n"
echo.

echo ========================================
echo RÉSUMÉ
echo ========================================
echo.
echo Tous les microservices sont configurés pour:
echo - Accepter les connexions directes du frontend Angular
echo - Supporter CORS depuis http://localhost:4200
echo - Fonctionner sans passer par l'API Gateway
echo.
echo Les URLs dans environment.ts correspondent aux ports:
echo - clientServiceUrl: http://localhost:8081 (Client Service)
echo - accountServiceUrl: http://localhost:8082 (Account Service)  
echo - transactionServiceUrl: http://localhost:8083 (Transaction Service)
echo - notificationServiceUrl: http://localhost:8084 (Notification Service)
echo - dashboardServiceUrl: http://localhost:8085 (Dashboard Service)
echo.

pause