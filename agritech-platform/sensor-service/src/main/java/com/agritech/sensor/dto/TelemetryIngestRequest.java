package com.agritech.sensor.dto;

public class TelemetryIngestRequest {
    private String zoneId;
    private String deviceCode;
    private Double soilMoisture;
    private Double temperature;
    private Double humidity;
    private Double soilPh;

    public TelemetryIngestRequest() {}

    public TelemetryIngestRequest(String zoneId, String deviceCode, Double soilMoisture, Double temperature, Double humidity, Double soilPh) {
        this.zoneId = zoneId;
        this.deviceCode = deviceCode;
        this.soilMoisture = soilMoisture;
        this.temperature = temperature;
        this.humidity = humidity;
        this.soilPh = soilPh;
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
}
