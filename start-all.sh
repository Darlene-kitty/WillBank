#!/bin/bash

echo "========================================"
echo "Démarrage de WillBank Backend"
echo "========================================"

echo ""
echo "[1/7] Démarrage Eureka Server..."
cd eureka-server && mvn spring-boot:run &
sleep 30

echo ""
echo "[2/7] Démarrage API Gateway..."
cd ../api-gateway && mvn spring-boot:run &
sleep 20

echo ""
echo "[3/7] Démarrage Client Service..."
cd ../client-service && mvn spring-boot:run &
sleep 15

echo ""
echo "[4/7] Démarrage Account Service..."
cd ../account-service && mvn spring-boot:run &
sleep 15

echo ""
echo "[5/7] Démarrage Transaction Service..."
cd ../transaction-service && mvn spring-boot:run &
sleep 15

echo ""
echo "[6/7] Démarrage Notification Service..."
cd ../notification-service && mvn spring-boot:run &
sleep 15

echo ""
echo "[7/7] Démarrage Dashboard Composite Service..."
cd ../dashboard-composite-service && mvn spring-boot:run &

echo ""
echo "========================================"
echo "Tous les services sont en cours de démarrage"
echo "Veuillez patienter 2-3 minutes"
echo "========================================"
echo ""
echo "Eureka Dashboard: http://localhost:8761"
echo "API Gateway: http://localhost:8080"
echo "Swagger UI disponible sur chaque service"
echo ""
