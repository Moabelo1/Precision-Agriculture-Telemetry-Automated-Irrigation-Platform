package com.agritech.sensor.config;

import com.agritech.sensor.entity.SensorDevice;
import com.agritech.sensor.entity.SensorType;
import com.agritech.sensor.entity.TelemetryReading;
import com.agritech.sensor.repository.SensorDeviceRepository;
import com.agritech.sensor.repository.TelemetryReadingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initSensorData(SensorDeviceRepository sensorRepository, TelemetryReadingRepository telemetryRepository) {
        return args -> {
            if (sensorRepository.count() == 0) {
                // Pre-seed IoT Sensors
                SensorDevice s1 = sensorRepository.save(new SensorDevice("SN-Z1-001", "ZONE-1", "North Plot - Wheat Field Section A", SensorType.MULTI_COMBO, "ACTIVE", 94.5));
                SensorDevice s2 = sensorRepository.save(new SensorDevice("SN-Z2-002", "ZONE-2", "South Plot - Corn Field Central", SensorType.MULTI_COMBO, "ACTIVE", 89.0));
                SensorDevice s3 = sensorRepository.save(new SensorDevice("SN-Z3-003", "ZONE-3", "East Plot - Greenhouse Tomatoes", SensorType.MULTI_COMBO, "ACTIVE", 98.2));
                SensorDevice s4 = sensorRepository.save(new SensorDevice("SN-Z4-004", "ZONE-4", "West Plot - Soybean Ridge", SensorType.MULTI_COMBO, "ACTIVE", 82.0));

                // Pre-seed Historical Telemetry
                LocalDateTime now = LocalDateTime.now();

                // Zone 1: Wheat (Moisture moderate, good condition)
                telemetryRepository.save(new TelemetryReading("ZONE-1", s1.getDeviceCode(), 32.5, 24.8, 62.0, 6.8));
                
                // Zone 2: Corn (Moisture low, dry soil, deficit needing irrigation!)
                telemetryRepository.save(new TelemetryReading("ZONE-2", s2.getDeviceCode(), 19.4, 31.2, 45.0, 6.5));

                // Zone 3: Tomato (Optimal greenhouse conditions)
                telemetryRepository.save(new TelemetryReading("ZONE-3", s3.getDeviceCode(), 44.0, 23.5, 70.0, 6.2));

                // Zone 4: Soybean (Moderate moisture, slight heat)
                telemetryRepository.save(new TelemetryReading("ZONE-4", s4.getDeviceCode(), 28.0, 29.5, 52.0, 6.7));
            }
        };
    }
}
