echo off
echo ========================================
echo Test des endpoints CORS
echo ========================================

echo.
echo Test Account Service (port 8082)...
curl -H "Origin: http://localhost:4200" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: X-Requested-With" -X OPTIONS http://localhost:8082/api/accounts
echo.

echo.
echo Test Transaction Service (port 8083)...
curl -H "Origin: http://localhost:4200" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: X-Requested-With" -X OPTIONS http://localhost:8083/api/transactions
echo.

echo.
echo Test Dashboard Service (port 8085)...
curl -H "Origin: http://localhost:4200" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: X-Requested-With" -X OPTIONS http://localhost:8085/api/dashboard/1
echo.

echo.
echo Test Notification Service (port 8084)...
curl -H "Origin: http://localhost:4200" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: X-Requested-With" -X OPTIONS http://localhost:8084/api/notifications
echo.

echo ========================================
echo Tests termines
echo ========================================
pause