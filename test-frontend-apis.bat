@echo off
echo ========================================
echo Test des APIs depuis le frontend
echo ========================================

echo.
echo Test direct des endpoints sans authentification...

echo.
echo [1] Test Account Service - GET /api/accounts
curl -H "Origin: http://localhost:4200" -H "Content-Type: application/json" http://localhost:8082/api/accounts
echo.

echo.
echo [2] Test Transaction Service - GET /api/transactions  
curl -H "Origin: http://localhost:4200" -H "Content-Type: application/json" http://localhost:8083/api/transactions
echo.

echo.
echo [3] Test Client Service - GET /api/clients (necessite auth)
curl -H "Origin: http://localhost:4200" -H "Content-Type: application/json" http://localhost:8081/api/clients
echo.

echo.
echo ========================================
echo Test CORS preflight
echo ========================================

echo.
echo [4] Test CORS Account Service
curl -H "Origin: http://localhost:4200" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS http://localhost:8082/api/accounts
echo.

echo.
echo [5] Test CORS Transaction Service
curl -H "Origin: http://localhost:4200" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS http://localhost:8083/api/transactions
echo.

echo ========================================
echo Tests termines
echo ========================================
echo.
echo Les services Account et Transaction devraient repondre avec des donnees.
echo Le service Client necessite une authentification (403 normal).
echo.
pause