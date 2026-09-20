# =============================================================================
# AgriTech Precision Agriculture Platform (PS043)
# Microservices Multi-Process Startup Script (PowerShell)
# =============================================================================

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  AgriTech Precision Agriculture Platform (PS043) Orchestrator   " -ForegroundColor Green
Write-Host "  Course: 24SDCS03R - SOA Programming and Microservices          " -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

$ProjectRoot = $PSScriptRoot

Write-Host "[1/7] Building backend microservices with Maven..." -ForegroundColor Cyan
Set-Location $ProjectRoot
mvn clean package -DskipTests=true
if ($LASTEXITCODE -ne 0) {
    Write-Host "Maven build failed. Please inspect compiler logs." -ForegroundColor Red
    exit 1
}

Write-Host "`n[2/7] Starting Discovery Service (Eureka Server on port 8761)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot\discovery-service'; java -jar target\discovery-service-1.0.0-SNAPSHOT.jar"
Write-Host "Waiting 12 seconds for Eureka Server to initialize..." -ForegroundColor DarkGray
Start-Sleep -Seconds 12

Write-Host "[3/7] Starting Auth Service (port 8081)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot\auth-service'; java -jar target\auth-service-1.0.0-SNAPSHOT.jar"

Write-Host "[4/7] Starting Sensor Service (port 8082)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot\sensor-service'; java -jar target\sensor-service-1.0.0-SNAPSHOT.jar"

Write-Host "[5/7] Starting Crop Monitoring Service (port 8083)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot\crop-monitoring-service'; java -jar target\crop-monitoring-service-1.0.0-SNAPSHOT.jar"

Write-Host "[6/7] Starting Irrigation Service (port 8084)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot\irrigation-service'; java -jar target\irrigation-service-1.0.0-SNAPSHOT.jar"

Write-Host "Waiting 10 seconds for microservices to register with Eureka..." -ForegroundColor DarkGray
Start-Sleep -Seconds 10

Write-Host "[7/7] Starting API Gateway (port 8080)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot\api-gateway'; java -jar target\api-gateway-1.0.0-SNAPSHOT.jar"

Write-Host "`nLaunching React Frontend Dashboard (port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot\frontend'; npm.cmd run dev"

Write-Host "`nAll services have been launched in separate processes!" -ForegroundColor Green
Write-Host "- Eureka Dashboard: http://localhost:8761" -ForegroundColor White
Write-Host "- API Gateway:      http://localhost:8080" -ForegroundColor White
Write-Host "- React Frontend:   http://localhost:5173" -ForegroundColor White
