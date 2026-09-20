package com.agritech.crop.service;

import com.agritech.crop.client.SensorClient;
import com.agritech.crop.dto.CropHealthReportDTO;
import com.agritech.crop.dto.TelemetryReadingDTO;
import com.agritech.crop.entity.Crop;
import com.agritech.crop.entity.CropHealthEvaluation;
import com.agritech.crop.entity.HealthStatus;
import com.agritech.crop.entity.IrrigationRecommendation;
import com.agritech.crop.repository.CropHealthEvaluationRepository;
import com.agritech.crop.repository.CropRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CropEvaluationService {

    private final CropRepository cropRepository;
    private final CropHealthEvaluationRepository evaluationRepository;
    private final SensorClient sensorClient;

    public CropEvaluationService(CropRepository cropRepository,
                                 CropHealthEvaluationRepository evaluationRepository,
                                 SensorClient sensorClient) {
        this.cropRepository = cropRepository;
        this.evaluationRepository = evaluationRepository;
        this.sensorClient = sensorClient;
    }

    public CropHealthReportDTO evaluateCropHealth(Long cropId) {
        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new IllegalArgumentException("Crop not found with ID: " + cropId));

        return evaluateCrop(crop);
    }

    public CropHealthReportDTO evaluateCropByZone(String zoneId) {
        Crop crop = cropRepository.findByZoneId(zoneId)
                .orElseThrow(() -> new IllegalArgumentException("Crop not found for Zone: " + zoneId));

        return evaluateCrop(crop);
    }

    private CropHealthReportDTO evaluateCrop(Crop crop) {
        Double moisture = 30.0; // fallback
        Double temperature = 24.0; // fallback

        // Inter-service OpenFeign call to sensor-service via Eureka Load Balancing
        try {
            TelemetryReadingDTO telemetry = sensorClient.getLatestTelemetryByZone(crop.getZoneId());
            if (telemetry != null) {
                moisture = telemetry.getSoilMoisture();
                temperature = telemetry.getTemperature();
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not fetch real-time telemetry from sensor-service via Feign: " + e.getMessage());
        }

        // Evaluate Dynamics
        int score = 100;
        HealthStatus status = HealthStatus.OPTIMAL;
        IrrigationRecommendation recommendation = IrrigationRecommendation.NO_ACTION;
        StringBuilder notes = new StringBuilder();

        // Moisture check
        if (moisture < crop.getMinOptimalMoisture()) {
            double deficit = crop.getMinOptimalMoisture() - moisture;
            if (deficit > 10.0) {
                status = HealthStatus.CRITICAL_DROUGHT;
                recommendation = IrrigationRecommendation.IRRIGATE_URGENT;
                score -= 40;
                notes.append(String.format("Critical soil moisture deficit (%.1f%% vs min %.1f%%). Immediate irrigation required. ", moisture, crop.getMinOptimalMoisture()));
            } else {
                status = HealthStatus.WATER_DEFICIT;
                recommendation = IrrigationRecommendation.IRRIGATE_SCHEDULED;
                score -= 20;
                notes.append(String.format("Soil moisture below optimal (%.1f%% vs min %.1f%%). Scheduled watering advised. ", moisture, crop.getMinOptimalMoisture()));
            }
        } else if (moisture > crop.getMaxOptimalMoisture()) {
            status = HealthStatus.OVER_WATERED;
            recommendation = IrrigationRecommendation.HALT_IRRIGATION;
            score -= 15;
            notes.append(String.format("Soil moisture saturation high (%.1f%% vs max %.1f%%). Suspend irrigation to prevent root rot. ", moisture, crop.getMaxOptimalMoisture()));
        } else {
            notes.append(String.format("Soil moisture is in the optimal range (%.1f%%). ", moisture));
        }

        // Temperature check
        if (temperature > crop.getMaxOptimalTemp()) {
            score -= 15;
            if (status == HealthStatus.OPTIMAL) {
                status = HealthStatus.HEAT_STRESS;
            }
            notes.append(String.format("Ambient temperature (%.1f°C) exceeds optimal max (%.1f°C). Heat stress detected. ", temperature, crop.getMaxOptimalTemp()));
        } else if (temperature < crop.getMinOptimalTemp()) {
            score -= 10;
            if (status == HealthStatus.OPTIMAL) {
                status = HealthStatus.MILD_STRESS;
            }
            notes.append(String.format("Ambient temperature (%.1f°C) below optimal min (%.1f°C). Cold stress possible. ", temperature, crop.getMinOptimalTemp()));
        }

        score = Math.max(10, Math.min(100, score));

        // Save evaluation log
        CropHealthEvaluation evaluation = new CropHealthEvaluation(
                crop.getId(),
                crop.getName(),
                crop.getZoneId(),
                moisture,
                temperature,
                score,
                status,
                recommendation,
                notes.toString().trim()
        );
        evaluationRepository.save(evaluation);

        // Build Report DTO
        CropHealthReportDTO report = new CropHealthReportDTO();
        report.setCropId(crop.getId());
        report.setCropName(crop.getName());
        report.setZoneId(crop.getZoneId());
        report.setCurrentMoisture(moisture);
        report.setMinOptimalMoisture(crop.getMinOptimalMoisture());
        report.setMaxOptimalMoisture(crop.getMaxOptimalMoisture());
        report.setCurrentTemperature(temperature);
        report.setHealthScore(score);
        report.setHealthStatus(status);
        report.setRecommendation(recommendation);
        report.setDiagnosticNotes(notes.toString().trim());
        report.setEvaluatedAt(LocalDateTime.now());

        return report;
    }
}
