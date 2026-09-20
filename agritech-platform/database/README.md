# AgriTech Microservices Database Architecture & Implementation Guide

This guide explains how data persistence is designed and implemented across the **AgriTech Sensing Solutions Precision Agriculture Platform (PS043)** for the course **24SDCS03R - SOA Programming and Microservices**.

---

## 1. Microservices Data Pattern: "Database-per-Service"

In Service-Oriented Architecture (SOA) and Microservices, sharing a single centralized database across all services violates service loose coupling and boundary autonomy. 

Instead, AgriTech implements the industry-standard **Database-per-Service** pattern:

| Microservice | Database Name | Port | Entities Managed |
| :--- | :--- | :--- | :--- |
| **Auth Service** | `agritech_auth_db` | 8081 | `User`, `Role` |
| **Sensor Service** | `agritech_sensor_db` | 8082 | `SensorDevice`, `TelemetryReading` |
| **Crop Monitoring Service** | `agritech_crop_db` | 8083 | `Crop`, `CropHealthEvaluation` |
| **Irrigation Service** | `agritech_irrigation_db` | 8084 | `IrrigationValve`, `IrrigationSchedule`, `WaterConsumptionLog` |

### Key Benefits:
1. **Loose Coupling**: Schema changes in `Sensor Service` (e.g. adding new telemetry metrics like soil salinity or solar radiation) do not impact or require downtime for `Crop Monitoring` or `Irrigation` services.
2. **Independent Scalability**: High-throughput telemetry writes in `Sensor Service` can scale to specialized time-series storage without bottlenecking user authentication.
3. **Data Encapsulation**: Services never query another service's database directly. Instead, `Irrigation Service` invokes `Crop Monitoring Service` via OpenFeign REST clients, which in turn invokes `Sensor Service`.

---

## 2. Default Embedded Database: H2 (Zero Setup Required)

Each microservice is pre-configured with **H2 In-Memory Database** by default (`spring.profiles.active: h2`).

### Why H2 for Development & Learning?
- **Zero Installation**: No need to install PostgreSQL, MySQL, or Docker.
- **Instant Execution**: The application starts immediately on any machine with Java.
- **Automated Schema Initialization**: Hibernate automatically creates the tables on startup and pre-seeds realistic agricultural telemetry data.

### Inspecting H2 In-Memory Databases:
Each service exposes an interactive web console:

| Service | H2 Console URL | JDBC URL | User / Password |
| :--- | :--- | :--- | :--- |
| **Auth Service** | `http://localhost:8081/h2-console` | `jdbc:h2:mem:agritech_auth_db` | `sa` / *(blank)* |
| **Sensor Service** | `http://localhost:8082/h2-console` | `jdbc:h2:mem:agritech_sensor_db` | `sa` / *(blank)* |
| **Crop Service** | `http://localhost:8083/h2-console` | `jdbc:h2:mem:agritech_crop_db` | `sa` / *(blank)* |
| **Irrigation Service** | `http://localhost:8084/h2-console` | `jdbc:h2:mem:agritech_irrigation_db` | `sa` / *(blank)* |

---

## 3. Transitioning to Standalone PostgreSQL

When you want persistent relational storage for production deployment:

### Step 1: Install or Run PostgreSQL
If you have Docker:
```bash
docker-compose up -d agritech-postgres
```
Or if you have native PostgreSQL installed locally:
Open `psql` or pgAdmin and run:
```sql
CREATE DATABASE agritech_auth_db;
CREATE DATABASE agritech_sensor_db;
CREATE DATABASE agritech_crop_db;
CREATE DATABASE agritech_irrigation_db;
```

### Step 2: Switch the Active Profile in `application.yml`
In each microservice's `src/main/resources/application.yml`, simply change:
```yaml
spring:
  profiles:
    active: postgres
```
Or start the service with the VM argument:
```bash
java -jar -Dspring.profiles.active=postgres target/sensor-service-1.0.0-SNAPSHOT.jar
```

---

## 4. Transitioning to Standalone MySQL

### Step 1: Create the MySQL Databases
Open MySQL Workbench or the `mysql` CLI:
```sql
CREATE DATABASE agritech_auth_db;
CREATE DATABASE agritech_sensor_db;
CREATE DATABASE agritech_crop_db;
CREATE DATABASE agritech_irrigation_db;
```

### Step 2: Switch the Active Profile
In `src/main/resources/application.yml`:
```yaml
spring:
  profiles:
    active: mysql
```
