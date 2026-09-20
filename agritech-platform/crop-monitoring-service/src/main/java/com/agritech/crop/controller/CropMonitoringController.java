package com.agritech.crop.controller;

import com.agritech.crop.dto.CropHealthReportDTO;
import com.agritech.crop.entity.Crop;
import com.agritech.crop.entity.CropHealthEvaluation;
import com.agritech.crop.repository.CropHealthEvaluationRepository;
import com.agritech.crop.repository.CropRepository;
import com.agritech.crop.service.CropEvaluationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping
public class CropMonitoringController {

    private final CropRepository cropRepository;
    private final CropHealthEvaluationRepository evaluationRepository;
    private final CropEvaluationService evaluationService;

    public CropMonitoringController(CropRepository cropRepository,
                                  CropHealthEvaluationRepository evaluationRepository,
                                  CropEvaluationService evaluationService) {
        this.cropRepository = cropRepository;
        this.evaluationRepository = evaluationRepository;
        this.evaluationService = evaluationService;
    }

    @GetMapping("/api/crops")
    public ResponseEntity<List<Crop>> getAllCrops() {
        return ResponseEntity.ok(cropRepository.findAllByOrderByZoneIdAsc());
    }

    @PostMapping("/api/crops")
    public ResponseEntity<Crop> registerCrop(@RequestBody Crop crop) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cropRepository.save(crop));
    }

    @GetMapping("/api/crop-monitoring/evaluate/{cropId}")
    public ResponseEntity<CropHealthReportDTO> evaluateCropById(@PathVariable Long cropId) {
        return ResponseEntity.ok(evaluationService.evaluateCropHealth(cropId));
    }

    @GetMapping("/api/crop-monitoring/zone/{zoneId}/evaluate")
    public ResponseEntity<CropHealthReportDTO> evaluateCropByZone(@PathVariable String zoneId) {
        return ResponseEntity.ok(evaluationService.evaluateCropByZone(zoneId));
    }

    @GetMapping("/api/crop-monitoring/evaluations/latest")
    public ResponseEntity<List<CropHealthEvaluation>> getLatestEvaluations() {
        return ResponseEntity.ok(evaluationRepository.findTop10ByOrderByEvaluatedAtDesc());
    }

    @GetMapping("/api/crop-monitoring/health-summary")
    public ResponseEntity<List<CropHealthReportDTO>> getFarmHealthSummary() {
        List<Crop> crops = cropRepository.findAllByOrderByZoneIdAsc();
        List<CropHealthReportDTO> summary = new ArrayList<>();
        for (Crop crop : crops) {
            summary.add(evaluationService.evaluateCropHealth(crop.getId()));
        }
        return ResponseEntity.ok(summary);
    }
}
