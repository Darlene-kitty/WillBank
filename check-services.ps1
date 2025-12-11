Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verification de l'etat des services WillBank" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$services = @(
    @{Name="Eureka Server"; Port=8761; Path="/actuator/health"},
    @{Name="Client Service"; Port=8081; Path="/actuator/health"},
    @{Name="Account Service"; Port=8082; Path="/actuator/health"},
    @{Name="Transaction Service"; Port=8083; Path="/actuator/health"},
    @{Name="Notification Service"; Port=8084; Path="/actuator/health"},
    @{Name="Dashboard Service"; Port=8085; Path="/actuator/health"}
)

$endpoints = @(
    @{Name="Accounts API"; Url="http://localhost:8082/api/accounts"},
    @{Name="Transactions API"; Url="http://localhost:8083/api/transactions"},
    @{Name="Clients API"; Url="http://localhost:8081/api/clients"},
    @{Name="Dashboard API"; Url="http://localhost:8085/api/dashboard/1"}
)

Write-Host "`nVerification des services..." -ForegroundColor Yellow

foreach ($service in $services) {
    $url = "http://localhost:$($service.Port)$($service.Path)"
    Write-Host "[$($service.Name)] " -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "OK" -ForegroundColor Green
        } else {
            Write-Host "Status: $($response.StatusCode)" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "Non disponible" -ForegroundColor Red
    }
}

Write-Host "`nVerification des endpoints API..." -ForegroundColor Yellow

foreach ($endpoint in $endpoints) {
    Write-Host "[$($endpoint.Name)] " -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $endpoint.Url -Method GET -TimeoutSec 5 -ErrorAction Stop
        Write-Host "OK (Status: $($response.StatusCode))" -ForegroundColor Green
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "OK (Authentification requise)" -ForegroundColor Yellow
        } else {
            Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Verification terminee" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nSi des services ne sont pas prets, attendez encore quelques minutes." -ForegroundColor White
Write-Host "Les services Spring Boot peuvent prendre 2-3 minutes pour demarrer completement." -ForegroundColor White