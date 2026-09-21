package com.agritech.sensor.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "telemetry_readings")
public class TelemetryReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String zoneId;

    @Column(nullable = false)
    private String deviceCode;

    @Column(nullable = false)
    private Double soilMoisture; // Percentage (e.g. 35.5%)

    @Column(nullable = false)
    private Double temperature; // Celsius (e.g. 24.2°C)

    private Double humidity; // Relative Humidity % (e.g. 60.0%)

    private Double soilPh; // pH (e.g. 6.5)

    @Column(nullable = false)
    private LocalDateTime recordedAt = LocalDateTime.now();

    public TelemetryReading() {}

    public TelemetryReading(String zoneId, String deviceCode, Double soilMoisture, Double temperature, Double humidity, Double soilPh) {
        this.zoneId = zoneId;
        this.deviceCode = deviceCode;
        this.soilMoisture = soilMoisture;
        this.temperature = temperature;
        this.humidity = humidity;
        this.soilPh = soilPh;
        this.recordedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getZoneId() {
        return zoneId;
    }

    public void setZoneId(String zoneId) {
        this.zoneId = zoneId;
    }

    public String getDeviceCode() {
        return deviceCode;
    }

    public void setDeviceCode(String deviceCode) {
        this.deviceCode = deviceCode;
    }

    public Double getSoilMoisture() {
        return soilMoisture;
    }

    public void setSoilMoisture(Double soilMoisture) {
        this.soilMoisture = soilMoisture;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getHumidity() {
        return humidity;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public Double getSoilPh() {
        return soilPh;
    }

    public void setSoilPh(Double soilPh) {
        this.soilPh = soilPh;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
}
