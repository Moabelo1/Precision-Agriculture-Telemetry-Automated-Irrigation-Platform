package com.agritech.irrigation.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AutoIrrigationResultDTO {
    private String zoneId;
    private String cropName;
    private Double currentSoilMoisture;
    private Double minOptimalMoisture;
    private Double currentTemperature;
    private String cropHealthStatus;
    private String cropRecommendation;
    private String valveAction;
    private String valveCode;
    private Double litersDispensed;
    private Integer durationMinutes;
    private String executionMessage;
    private List<String> soaCallTrace;
    private LocalDateTime timestamp;

    public AutoIrrigationResultDTO() {}

    public String getZoneId() {
        return zoneId;
    }

    public void setZoneId(String zoneId) {
        this.zoneId = zoneId;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public Double getCurrentSoilMoisture() {
        return currentSoilMoisture;
    }

    public void setCurrentSoilMoisture(Double currentSoilMoisture) {
        this.currentSoilMoisture = currentSoilMoisture;
    }

    public Double getMinOptimalMoisture() {
        return minOptimalMoisture;
    }

    public void setMinOptimalMoisture(Double minOptimalMoisture) {
        this.minOptimalMoisture = minOptimalMoisture;
    }

    public Double getCurrentTemperature() {
        return currentTemperature;
    }

    public void setCurrentTemperature(Double currentTemperature) {
        this.currentTemperature = currentTemperature;
    }

    public String getCropHealthStatus() {
        return cropHealthStatus;
    }

    public void setCropHealthStatus(String cropHealthStatus) {
        this.cropHealthStatus = cropHealthStatus;
    }

    public String getCropRecommendation() {
        return cropRecommendation;
    }

    public void setCropRecommendation(String cropRecommendation) {
        this.cropRecommendation = cropRecommendation;
    }

    public String getValveAction() {
        return valveAction;
    }

    public void setValveAction(String valveAction) {
        this.valveAction = valveAction;
    }

    public String getValveCode() {
        return valveCode;
    }

    public void setValveCode(String valveCode) {
        this.valveCode = valveCode;
    }

    public Double getLitersDispensed() {
        return litersDispensed;
    }

    public void setLitersDispensed(Double litersDispensed) {
        this.litersDispensed = litersDispensed;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getExecutionMessage() {
        return executionMessage;
    }

    public void setExecutionMessage(String executionMessage) {
        this.executionMessage = executionMessage;
    }

    public List<String> getSoaCallTrace() {
        return soaCallTrace;
    }

    public void setSoaCallTrace(List<String> soaCallTrace) {
        this.soaCallTrace = soaCallTrace;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
