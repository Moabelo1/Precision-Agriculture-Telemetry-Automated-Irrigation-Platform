package com.agritech.sensor.controller;

import com.agritech.sensor.dto.TelemetryIngestRequest;
import com.agritech.sensor.entity.SensorDevice;
import com.agritech.sensor.entity.TelemetryReading;
import com.agritech.sensor.repository.SensorDeviceRepository;
import com.agritech.sensor.repository.TelemetryReadingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/sensors")
public class SensorController {

    private final SensorDeviceRepository sensorRepository;
    private final TelemetryReadingRepository telemetryRepository;

    public SensorController(SensorDeviceRepository sensorRepository, TelemetryReadingRepository telemetryRepository) {
        this.sensorRepository = sensorRepository;
        this.telemetryRepository = telemetryRepository;
    }

    @GetMapping
    public ResponseEntity<List<SensorDevice>> getAllSensors() {
        return ResponseEntity.ok(sensorRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<SensorDevice> registerSensor(@RequestBody SensorDevice device) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sensorRepository.save(device));
    }

    @GetMapping("/zone/{zoneId}")
    public ResponseEntity<List<SensorDevice>> getSensorsByZone(@PathVariable String zoneId) {
        return ResponseEntity.ok(sensorRepository.findByZoneId(zoneId));
    }

    @PostMapping("/telemetry")
    public ResponseEntity<TelemetryReading> ingestTelemetry(@RequestBody TelemetryIngestRequest request) {
        TelemetryReading reading = new TelemetryReading(
                request.getZoneId(),
                request.getDeviceCode(),
                request.getSoilMoisture(),
                request.getTemperature(),
                request.getHumidity(),
                request.getSoilPh()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(telemetryRepository.save(reading));
    }

    @GetMapping("/zone/{zoneId}/latest")
    public ResponseEntity<TelemetryReading> getLatestTelemetryByZone(@PathVariable String zoneId) {
        return telemetryRepository.findFirstByZoneIdOrderByRecordedAtDesc(zoneId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/telemetry/latest")
    public ResponseEntity<List<TelemetryReading>> getLatestFarmTelemetry() {
        return ResponseEntity.ok(telemetryRepository.findTop20ByOrderByRecordedAtDesc());
    }

    @GetMapping("/device/{deviceCode}/history")
    public ResponseEntity<List<TelemetryReading>> getDeviceTelemetryHistory(@PathVariable String deviceCode) {
        return ResponseEntity.ok(telemetryRepository.findByDeviceCodeOrderByRecordedAtDesc(deviceCode));
    }

    @PostMapping("/simulate")
    public ResponseEntity<List<TelemetryReading>> simulateNewTelemetry() {
        List<SensorDevice> devices = sensorRepository.findAll();
        List<TelemetryReading> newReadings = new ArrayList<>();
        Random rand = new Random();

        for (SensorDevice dev : devices) {
            // Realistic varying values
            double moisture = 18.0 + (rand.nextDouble() * 30.0); // 18% to 48%
            double temp = 22.0 + (rand.nextDouble() * 12.0);      // 22°C to 34°C
            double humidity = 45.0 + (rand.nextDouble() * 30.0);  // 45% to 75%
            double ph = 6.0 + (rand.nextDouble() * 1.5);          // 6.0 to 7.5

            TelemetryReading reading = new TelemetryReading(
                    dev.getZoneId(),
                    dev.getDeviceCode(),
                    Math.round(moisture * 10.0) / 10.0,
                    Math.round(temp * 10.0) / 10.0,
                    Math.round(humidity * 10.0) / 10.0,
                    Math.round(ph * 10.0) / 10.0
            );
            newReadings.add(telemetryRepository.save(reading));
        }

        return ResponseEntity.ok(newReadings);
    }
}
