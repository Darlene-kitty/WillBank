#!/bin/bash

echo "========================================"
echo "WillBank Microservices Startup Script"
echo "========================================"
echo ""

echo "Checking prerequisites..."
echo ""

# Function to start a service in a new terminal
start_service() {
    local service_name=$1
    local service_dir=$2
    local port=$3
    
    echo "[$4/7] Starting $service_name ($port)..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript -e "tell app \"Terminal\" to do script \"cd $(pwd)/$service_dir && mvn spring-boot:run\""
    else
        # Linux
        gnome-terminal -- bash -c "cd $service_dir && mvn spring-boot:run; exec bash"
    fi
    
    sleep $5
}

# Start services in order
start_service "Eureka Server" "eureka-server" "8761" "1" 30
start_service "Client Service" "client-service" "8081" "2" 15
start_service "Account Service" "account-service" "8082" "3" 15
start_service "Transaction Service" "transaction-service" "8083" "4" 15
start_service "Notification Service" "notification-service" "8084" "5" 15
start_service "Dashboard Composite Service" "dashboard-composite-service" "8085" "6" 15
start_service "API Gateway" "api-gateway" "8080" "7" 0

echo ""
echo "========================================"
echo "All services are starting..."
echo "Please wait 2-3 minutes for full startup"
echo ""
echo "Eureka Dashboard: http://localhost:8761"
echo "API Gateway: http://localhost:8080"
echo "========================================"
echo ""
