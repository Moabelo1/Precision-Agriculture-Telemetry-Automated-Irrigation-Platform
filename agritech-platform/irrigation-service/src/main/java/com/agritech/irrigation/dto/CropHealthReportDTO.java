package com.agritech.irrigation.dto;

import java.time.LocalDateTime;

public class CropHealthReportDTO {
    private Long cropId;
    private String cropName;
    private String zoneId;
    private Double currentMoisture;
    private Double minOptimalMoisture;
    private Double maxOptimalMoisture;
    private Double currentTemperature;
    private Integer healthScore;
    private String healthStatus;
    private String recommendation;
    private String diagnosticNotes;
    private LocalDateTime evaluatedAt;

    public CropHealthReportDTO() {}

    public Long getCropId() {
        return cropId;
    }

    public void setCropId(Long cropId) {
        this.cropId = cropId;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getZoneId() {
        return zoneId;
    }

    public void setZoneId(String zoneId) {
        this.zoneId = zoneId;
    }

    public Double getCurrentMoisture() {
        return currentMoisture;
    }

    public void setCurrentMoisture(Double currentMoisture) {
        this.currentMoisture = currentMoisture;
    }

    public Double getMinOptimalMoisture() {
        return minOptimalMoisture;
    }

    public void setMinOptimalMoisture(Double minOptimalMoisture) {
        this.minOptimalMoisture = minOptimalMoisture;
    }

    public Double getMaxOptimalMoisture() {
        return maxOptimalMoisture;
    }

    public void setMaxOptimalMoisture(Double maxOptimalMoisture) {
        this.maxOptimalMoisture = maxOptimalMoisture;
    }

    public Double getCurrentTemperature() {
        return currentTemperature;
    }

    public void setCurrentTemperature(Double currentTemperature) {
        this.currentTemperature = currentTemperature;
    }

    public Integer getHealthScore() {
        return healthScore;
    }

    public void setHealthScore(Integer healthScore) {
        this.healthScore = healthScore;
    }

    public String getHealthStatus() {
        return healthStatus;
    }

    public void setHealthStatus(String healthStatus) {
        this.healthStatus = healthStatus;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public String getDiagnosticNotes() {
        return diagnosticNotes;
    }

    public void setDiagnosticNotes(String diagnosticNotes) {
        this.diagnosticNotes = diagnosticNotes;
    }

    public LocalDateTime getEvaluatedAt() {
        return evaluatedAt;
    }

    public void setEvaluatedAt(LocalDateTime evaluatedAt) {
        this.evaluatedAt = evaluatedAt;
    }
}
