package com.agritech.sensor.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sensor_devices")
public class SensorDevice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String deviceCode;

    @Column(nullable = false)
    private String zoneId; // e.g., "ZONE-1", "ZONE-2"

    @Column(nullable = false)
    private String locationDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SensorType sensorType;

    @Column(nullable = false)
    private String status; // "ACTIVE", "MAINTENANCE", "OFFLINE"

    private Double batteryPercentage;

    private LocalDateTime installedAt = LocalDateTime.now();

    public SensorDevice() {}

    public SensorDevice(String deviceCode, String zoneId, String locationDescription, SensorType sensorType, String status, Double batteryPercentage) {
        this.deviceCode = deviceCode;
        this.zoneId = zoneId;
        this.locationDescription = locationDescription;
        this.sensorType = sensorType;
        this.status = status;
        this.batteryPercentage = batteryPercentage;
        this.installedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getDeviceCode() {
        return deviceCode;
    }

    public void setDeviceCode(String deviceCode) {
        this.deviceCode = deviceCode;
    }

    public String getZoneId() {
        return zoneId;
    }

    public void setZoneId(String zoneId) {
        this.zoneId = zoneId;
    }

    public String getLocationDescription() {
        return locationDescription;
    }

    public void setLocationDescription(String locationDescription) {
        this.locationDescription = locationDescription;
    }

    public SensorType getSensorType() {
        return sensorType;
    }

    public void setSensorType(SensorType sensorType) {
        this.sensorType = sensorType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getBatteryPercentage() {
        return batteryPercentage;
    }

    public void setBatteryPercentage(Double batteryPercentage) {
        this.batteryPercentage = batteryPercentage;
    }

    public LocalDateTime getInstalledAt() {
        return installedAt;
    }
}
