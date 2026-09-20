-- =============================================================================
-- AgriTech Precision Agriculture Platform (PS043)
-- Unified Database Schema & Sample Records (PostgreSQL / MySQL / H2 Compatible)
-- =============================================================================

-- =============================================================================
-- 1. AUTH SERVICE DATABASE (agritech_auth_db)
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Pre-seeded users (Password: admin123, agro123, farmer123 hashed with BCrypt)
-- $2a$10$wK1mJ.Vd... BCrypt hashes are automatically managed by Spring Security
INSERT INTO users (email, password, full_name, role) VALUES 
('admin@agritech.com', '$2a$10$eE7c0f1XzG09V/wJj/9jfu9U0zXbY81H4J0N8yW9Yw2kI0FzF/i6e', 'Sarah Jenkins (Chief Farm Administrator)', 'ROLE_ADMIN'),
('agronomist@agritech.com', '$2a$10$eE7c0f1XzG09V/wJj/9jfu9U0zXbY81H4J0N8yW9Yw2kI0FzF/i6e', 'Dr. Robert Thorne (Senior Agronomist)', 'ROLE_AGRONOMIST'),
('farmer@agritech.com', '$2a$10$eE7c0f1XzG09V/wJj/9jfu9U0zXbY81H4J0N8yW9Yw2kI0FzF/i6e', 'John Miller (Regional Farmer)', 'ROLE_FARMER');

-- =============================================================================
-- 2. SENSOR SERVICE DATABASE (agritech_sensor_db)
-- =============================================================================
CREATE TABLE IF NOT EXISTS sensor_devices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_code VARCHAR(100) NOT NULL UNIQUE,
    zone_id VARCHAR(50) NOT NULL,
    location_description VARCHAR(255) NOT NULL,
    sensor_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    battery_percentage DOUBLE,
    installed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS telemetry_readings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    zone_id VARCHAR(50) NOT NULL,
    device_code VARCHAR(100) NOT NULL,
    soil_moisture DOUBLE NOT NULL,
    temperature DOUBLE NOT NULL,
    humidity DOUBLE,
    soil_ph DOUBLE,
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sensor_devices (device_code, zone_id, location_description, sensor_type, status, battery_percentage) VALUES
('SN-Z1-001', 'ZONE-1', 'North Plot - Wheat Field Section A', 'MULTI_COMBO', 'ACTIVE', 94.5),
('SN-Z2-002', 'ZONE-2', 'South Plot - Corn Field Central', 'MULTI_COMBO', 'ACTIVE', 89.0),
('SN-Z3-003', 'ZONE-3', 'East Plot - Greenhouse Tomatoes', 'MULTI_COMBO', 'ACTIVE', 98.2),
('SN-Z4-004', 'ZONE-4', 'West Plot - Soybean Ridge', 'MULTI_COMBO', 'ACTIVE', 82.0);

INSERT INTO telemetry_readings (zone_id, device_code, soil_moisture, temperature, humidity, soil_ph) VALUES
('ZONE-1', 'SN-Z1-001', 32.5, 24.8, 62.0, 6.8),
('ZONE-2', 'SN-Z2-002', 19.4, 31.2, 45.0, 6.5),
('ZONE-3', 'SN-Z3-003', 44.0, 23.5, 70.0, 6.2),
('ZONE-4', 'SN-Z4-004', 28.0, 29.5, 52.0, 6.7);

-- =============================================================================
-- 3. CROP MONITORING SERVICE DATABASE (agritech_crop_db)
-- =============================================================================
CREATE TABLE IF NOT EXISTS crops (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    variety VARCHAR(255) NOT NULL,
    zone_id VARCHAR(50) NOT NULL,
    acreage DOUBLE NOT NULL,
    growth_stage VARCHAR(50) NOT NULL,
    min_optimal_moisture DOUBLE NOT NULL,
    max_optimal_moisture DOUBLE NOT NULL,
    min_optimal_temp DOUBLE NOT NULL,
    max_optimal_temp DOUBLE NOT NULL
);

CREATE TABLE IF NOT EXISTS crop_health_evaluations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    crop_id BIGINT NOT NULL,
    crop_name VARCHAR(255) NOT NULL,
    zone_id VARCHAR(50) NOT NULL,
    current_moisture DOUBLE,
    current_temperature DOUBLE,
    health_score INT,
    health_status VARCHAR(50) NOT NULL,
    recommendation VARCHAR(50) NOT NULL,
    diagnostic_notes VARCHAR(500),
    evaluated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO crops (name, variety, zone_id, acreage, growth_stage, min_optimal_moisture, max_optimal_moisture, min_optimal_temp, max_optimal_temp) VALUES
('Hard Red Winter Wheat', 'Triticum aestivum', 'ZONE-1', 120.0, 'VEGETATIVE', 28.0, 48.0, 15.0, 28.0),
('Sweet Golden Corn', 'Zea mays', 'ZONE-2', 200.0, 'FLOWERING', 35.0, 55.0, 18.0, 32.0),
('Roma Plum Tomatoes', 'Solanum lycopersicum', 'ZONE-3', 45.0, 'RIPENING', 38.0, 60.0, 18.0, 28.0),
('Northern High-Yield Soybeans', 'Glycine max', 'ZONE-4', 180.0, 'SEEDLING', 25.0, 45.0, 16.0, 30.0);

-- =============================================================================
-- 4. IRRIGATION SERVICE DATABASE (agritech_irrigation_db)
-- =============================================================================
CREATE TABLE IF NOT EXISTS irrigation_valves (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    valve_code VARCHAR(100) NOT NULL UNIQUE,
    zone_id VARCHAR(50) NOT NULL,
    location_description VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CLOSED',
    flow_rate_liters_per_min DOUBLE NOT NULL,
    last_activated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS irrigation_schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    zone_id VARCHAR(50) NOT NULL,
    valve_id BIGINT NOT NULL,
    duration_minutes INT NOT NULL,
    scheduled_start_time TIMESTAMP NOT NULL,
    automated BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS water_consumption_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    valve_id BIGINT NOT NULL,
    valve_code VARCHAR(100) NOT NULL,
    zone_id VARCHAR(50) NOT NULL,
    liters_dispensed DOUBLE NOT NULL,
    duration_minutes INT NOT NULL,
    triggered_by VARCHAR(100) NOT NULL,
    logged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO irrigation_valves (valve_code, zone_id, location_description, status, flow_rate_liters_per_min) VALUES
('VALVE-Z1-01', 'ZONE-1', 'North Acreage Main Sprinkler Gate', 'CLOSED', 45.0),
('VALVE-Z2-01', 'ZONE-2', 'South Acreage Drip Irrigation Line', 'CLOSED', 60.0),
('VALVE-Z3-01', 'ZONE-3', 'East Greenhouse Mist Injector', 'CLOSED', 30.0),
('VALVE-Z4-01', 'ZONE-4', 'West Acreage Pivot Sprinkler', 'CLOSED', 55.0);

INSERT INTO water_consumption_logs (valve_id, valve_code, zone_id, liters_dispensed, duration_minutes, triggered_by) VALUES
(1, 'VALVE-Z1-01', 'ZONE-1', 450.0, 10, 'MANUAL_OVERRIDE'),
(2, 'VALVE-Z2-01', 'ZONE-2', 900.0, 15, 'AUTOMATED_SOA_ORCHESTRATION');
