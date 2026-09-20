package com.agritech.crop.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "crop_health_evaluations")
public class CropHealthEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long cropId;

    @Column(nullable = false)
    private String cropName;

    @Column(nullable = false)
    private String zoneId;

    private Double currentMoisture;

    private Double currentTemperature;

    private Integer healthScore; // 0 to 100

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HealthStatus healthStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IrrigationRecommendation recommendation;

    @Column(length = 500)
    private String diagnosticNotes;

    private LocalDateTime evaluatedAt = LocalDateTime.now();

    public CropHealthEvaluation() {}

    public CropHealthEvaluation(Long cropId, String cropName, String zoneId, Double currentMoisture,
                                Double currentTemperature, Integer healthScore, HealthStatus healthStatus,
                                IrrigationRecommendation recommendation, String diagnosticNotes) {
        this.cropId = cropId;
        this.cropName = cropName;
        this.zoneId = zoneId;
        this.currentMoisture = currentMoisture;
        this.currentTemperature = currentTemperature;
        this.healthScore = healthScore;
        this.healthStatus = healthStatus;
        this.recommendation = recommendation;
        this.diagnosticNotes = diagnosticNotes;
        this.evaluatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getCropId() {
        return cropId;
    }

    public String getCropName() {
        return cropName;
    }

    public String getZoneId() {
        return zoneId;
    }

    public Double getCurrentMoisture() {
        return currentMoisture;
    }

    public Double getCurrentTemperature() {
        return currentTemperature;
    }

    public Integer getHealthScore() {
        return healthScore;
    }

    public HealthStatus getHealthStatus() {
        return healthStatus;
    }

    public IrrigationRecommendation getRecommendation() {
        return recommendation;
    }

    public String getDiagnosticNotes() {
        return diagnosticNotes;
    }

    public LocalDateTime getEvaluatedAt() {
        return evaluatedAt;
    }
}
