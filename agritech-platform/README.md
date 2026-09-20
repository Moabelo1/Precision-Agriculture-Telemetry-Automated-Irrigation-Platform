# PS043: Precision Agriculture Telemetry & Automated Irrigation Platform
**Course Mapped**: 24SDCS03R - SOA PROGRAMMING AND MICROSERVICES  
**Company / Use Case**: AgriTech Sensing Solutions  
**Stack**: Java 21 LTS, Spring Boot 3.4.0, Spring Cloud 2024.0.0, Netflix Eureka, Spring Cloud Gateway, OpenFeign, Spring Security, JWT, React 18, Tailwind CSS, H2 / PostgreSQL / MySQL.

---

## 1. Project Overview & Business Use Case

AgriTech Sensing Solutions requires an automated precision agriculture platform to:
- Collect real-time soil condition data (moisture %, temperature °C, humidity, pH).
- Evaluate crop environmental dynamics and calculate health stress indexes against biological crop thresholds.
- Execute automated water delivery schedules to improve crop yields while conserving water resources.
- Provide role-based JWT authentication for agronomists, farm administrators, and farmers.
- Use API Gateway routing and Eureka-based load balancing for seamless IoT telemetry processing.

---

## 2. Microservices Architecture & Topology

```
                                      +---------------------------------------------+
                                      |            Netflix Eureka Server            |
                                      |                 (Port 8761)                 |
                                      +---------------------------------------------+
                                            ^            ^            ^            ^
                                            |            |            |            |
                                      (Registration & Heartbeat via Eureka Discovery)
                                            |            |            |            |
+----------------------+              +-----+-----+ +----+----+ +-----+-----+ +----+----+
| React 18 Frontend UI | --(HTTP)--> |  Gateway  | |  Sensor | |    Crop    | |Irrigation|
|     (Port 5173)      |             | (:8080)   | | (:8082) | |  Monitoring| | (:8084)  |
+----------------------+             +-----------+ +---------+ |  (:8083)   | +---------+
                                           |                        |              |
                                           |     OpenFeign Call     |              |
                                           +----------------------->+              |
                                           |                                       |
                                           |            OpenFeign Call             |
                                           +-------------------------------------->+
                                           |
                                           v OpenFeign Inter-Service Loop:
                                           [Irrigation-Service]
                                                   |
                                                   v (calls Crop-Monitoring-Service via Feign)
                                           [Crop-Monitoring-Service]
                                                   |
                                                   v (calls Sensor-Service via Feign)
                                           [Sensor-Service]
```

### Microservices Port Allocation & Purpose:
| Service Name | Port | Primary Responsibility | Embedded DB Console |
| :--- | :--- | :--- | :--- |
| **Discovery Service** | `8761` | Netflix Eureka Service Registry | N/A |
| **API Gateway** | `8080` | Edge Gateway, JWT Filter, Eureka Load Balancing (`lb://*`) | N/A |
| **Auth Service** | `8081` | User Management & JWT Issuer (Admin, Agronomist, Farmer) | `http://localhost:8081/h2-console` |
| **Sensor Service** | `8082` | IoT Sensor Probes & Real-time Telemetry Ingestion | `http://localhost:8082/h2-console` |
| **Crop Monitoring Service** | `8083` | Crop Growth Dynamics & Threshold Evaluation (OpenFeign Client) | `http://localhost:8083/h2-console` |
| **Irrigation Service** | `8084` | Automated Solenoid Valve Control & Water Conservation Logs | `http://localhost:8084/h2-console` |
| **React Frontend** | `5173` | Interactive Agricultural Dashboard & Real-Time SOA Visualizer | N/A |

---

## 3. Pre-Seeded Demonstration Accounts

| Role | Email | Password | Permissions & Access Scope |
| :--- | :--- | :--- | :--- |
| **Chief Farm Administrator** | `admin@agritech.com` | `admin123` | Full access to all sensors, valves, overrides, and user accounts. |
| **Senior Agronomist** | `agronomist@agritech.com` | `agro123` | Crop threshold administration, biological health audits, and automated irrigation triggers. |
| **Regional Farmer** | `farmer@agritech.com` | `farmer123` | Zone monitoring, manual valve operation, and field telemetry inspection. |

---

## 4. Step-by-Step Implementation & Execution Guide

### Prerequisite Check
- **Java 21 LTS** (`java -version`)
- **Apache Maven 3.9+** (`mvn -v`)
- **Node.js 20+ and npm** (`node -v`, `npm.cmd -v`)

### Option A: One-Click Launch (Recommended)
From the project root:
```powershell
# In PowerShell:
.\run-all.ps1

# Or in Windows Command Prompt:
run-all.bat
```

### Option B: Step-by-Step Execution (For Learning & Grading Presentation)

#### Step 1: Build the Maven Project
```powershell
cd C:\Users\Admin\.gemini\antigravity\scratch\agritech-platform
mvn clean package -DskipTests=true
```

#### Step 2: Start Eureka Discovery Server (Port 8761)
```powershell
cd discovery-service
java -jar target\discovery-service-1.0.0-SNAPSHOT.jar
```
*Verify*: Open your browser at `http://localhost:8761` to view the Netflix Eureka Dashboard.

#### Step 3: Start Auth Service (Port 8081)
```powershell
cd ..\auth-service
java -jar target\auth-service-1.0.0-SNAPSHOT.jar
```

#### Step 4: Start Sensor Service (Port 8082)
```powershell
cd ..\sensor-service
java -jar target\sensor-service-1.0.0-SNAPSHOT.jar
```

#### Step 5: Start Crop Monitoring Service (Port 8083)
```powershell
cd ..\crop-monitoring-service
java -jar target\crop-monitoring-service-1.0.0-SNAPSHOT.jar
```

#### Step 6: Start Irrigation Service (Port 8084)
```powershell
cd ..\irrigation-service
java -jar target\irrigation-service-1.0.0-SNAPSHOT.jar
```

#### Step 7: Start API Gateway (Port 8080)
```powershell
cd ..\api-gateway
java -jar target\api-gateway-1.0.0-SNAPSHOT.jar
```

#### Step 8: Start React Frontend (Port 5173)
```powershell
cd ..\frontend
npm.cmd run dev
```
*Verify*: Open `http://localhost:5173` in your browser.

---

## 5. Testing Inter-Service Communication (`Monitoring -> Sensor -> Irrigation`)

You can test the full inter-service flow directly in the React UI under the **"SOA Inter-Service Trace"** tab, or via curl:

```bash
# 1. Login to get JWT Token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@agritech.com", "password": "admin123"}'

# 2. Trigger Automated Irrigation for Zone-2 (Sweet Golden Corn)
curl -X POST http://localhost:8080/api/irrigation/auto-evaluate-and-irrigate/ZONE-2 \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### What happens behind the scenes:
1. **API Gateway** intercepts request on port 8080, validates the Bearer JWT token, and routes to `lb://IRRIGATION-SERVICE` via Eureka.
2. **Irrigation Service** receives the request and calls **Crop Monitoring Service** (`GET /api/crop-monitoring/zone/ZONE-2/evaluate`) via OpenFeign.
3. **Crop Monitoring Service** calls **Sensor Service** (`GET /api/sensors/zone/ZONE-2/latest`) via OpenFeign to obtain the latest soil moisture and temperature readings.
4. **Crop Monitoring Service** compares the reading (e.g. 19.4%) against Corn's optimal minimum (35%), detects `WATER_DEFICIT`, and generates `IRRIGATE_URGENT`.
5. **Irrigation Service** receives the recommendation, opens valve `VALVE-Z2-01`, records 900 Liters dispensed in the database, and returns the complete trace!

---

## 6. Database Implementation Guidance

- **Default Out-of-the-Box**: Embedded **H2 Database** is activated by default. Zero setup needed.
- **H2 Web Console**: Access `http://localhost:8081/h2-console`, `http://localhost:8082/h2-console`, etc. (JDBC URLs: `jdbc:h2:mem:agritech_<service>_db`, User: `sa`, Password: blank).
- **PostgreSQL / MySQL Transition**:
  - Full schemas are provided in [database/schema.sql](database/schema.sql).
  - Docker compose file in [database/docker-compose.yml](database/docker-compose.yml).
  - Switch `spring.profiles.active: postgres` in `application.yml` to switch seamlessly to standalone RDBMS.
