@echo off
echo =================================================================
echo   AgriTech Precision Agriculture Platform (PS043)
echo   Course: 24SDCS03R - SOA Programming and Microservices
echo =================================================================
echo.

set PROJECT_ROOT=%~dp0

echo [1/7] Compiling backend microservices with Maven...
cd /d "%PROJECT_ROOT%"
call mvn clean package -DskipTests=true
if %ERRORLEVEL% NEQ 0 (
    echo Maven build failed.
    pause
    exit /b 1
)

echo.
echo [2/7] Starting Discovery Service (Eureka on 8761)...
start "Eureka-8761" cmd /k "cd /d %PROJECT_ROOT%\discovery-service && java -jar target\discovery-service-1.0.0-SNAPSHOT.jar"
timeout /t 12 /nobreak

echo [3/7] Starting Auth Service (8081)...
start "Auth-8081" cmd /k "cd /d %PROJECT_ROOT%\auth-service && java -jar target\auth-service-1.0.0-SNAPSHOT.jar"

echo [4/7] Starting Sensor Service (8082)...
start "Sensor-8082" cmd /k "cd /d %PROJECT_ROOT%\sensor-service && java -jar target\sensor-service-1.0.0-SNAPSHOT.jar"

echo [5/7] Starting Crop Monitoring Service (8083)...
start "Crop-8083" cmd /k "cd /d %PROJECT_ROOT%\crop-monitoring-service && java -jar target\crop-monitoring-service-1.0.0-SNAPSHOT.jar"

echo [6/7] Starting Irrigation Service (8084)...
start "Irrigation-8084" cmd /k "cd /d %PROJECT_ROOT%\irrigation-service && java -jar target\irrigation-service-1.0.0-SNAPSHOT.jar"

timeout /t 10 /nobreak

echo [7/7] Starting API Gateway (8080)...
start "Gateway-8080" cmd /k "cd /d %PROJECT_ROOT%\api-gateway && java -jar target\api-gateway-1.0.0-SNAPSHOT.jar"

echo Starting React Frontend Dashboard (5173)...
start "Frontend-5173" cmd /k "cd /d %PROJECT_ROOT%\frontend && npm.cmd run dev"

echo.
echo All microservices launched!
echo - Eureka Registry: http://localhost:8761
echo - API Gateway:     http://localhost:8080
echo - React Frontend:  http://localhost:5173
pause
