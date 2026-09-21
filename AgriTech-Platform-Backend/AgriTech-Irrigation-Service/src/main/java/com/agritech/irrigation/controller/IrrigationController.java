package com.agritech.irrigation.controller;

import com.agritech.irrigation.dto.AutoIrrigationResultDTO;
import com.agritech.irrigation.dto.ValveToggleRequest;
import com.agritech.irrigation.entity.IrrigationSchedule;
import com.agritech.irrigation.entity.IrrigationValve;
import com.agritech.irrigation.entity.WaterConsumptionLog;
import com.agritech.irrigation.repository.IrrigationScheduleRepository;
import com.agritech.irrigation.repository.IrrigationValveRepository;
import com.agritech.irrigation.repository.WaterConsumptionLogRepository;
import com.agritech.irrigation.service.IrrigationDecisionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/irrigation")
public class IrrigationController {

    private final IrrigationValveRepository valveRepository;
    private final IrrigationScheduleRepository scheduleRepository;
    private final WaterConsumptionLogRepository consumptionLogRepository;
    private final IrrigationDecisionService decisionService;

    public IrrigationController(IrrigationValveRepository valveRepository,
                                IrrigationScheduleRepository scheduleRepository,
                                WaterConsumptionLogRepository consumptionLogRepository,
                                IrrigationDecisionService decisionService) {
        this.valveRepository = valveRepository;
        this.scheduleRepository = scheduleRepository;
        this.consumptionLogRepository = consumptionLogRepository;
        this.decisionService = decisionService;
    }

    @GetMapping("/valves")
    public ResponseEntity<List<IrrigationValve>> getAllValves() {
        return ResponseEntity.ok(valveRepository.findAllByOrderByZoneIdAsc());
    }

    @PostMapping("/valves/{id}/toggle")
    public ResponseEntity<IrrigationValve> toggleValve(@PathVariable Long id, @RequestBody(required = false) ValveToggleRequest request) {
        if (request == null) {
            request = new ValveToggleRequest();
        }
        return ResponseEntity.ok(decisionService.toggleValve(id, request));
    }

    @PostMapping("/auto-evaluate-and-irrigate/{zoneId}")
    public ResponseEntity<AutoIrrigationResultDTO> autoEvaluateAndIrrigate(@PathVariable String zoneId) {
        return ResponseEntity.ok(decisionService.evaluateAndIrrigate(zoneId));
    }

    @GetMapping("/schedules")
    public ResponseEntity<List<IrrigationSchedule>> getSchedules() {
        return ResponseEntity.ok(scheduleRepository.findTop10ByOrderByScheduledStartTimeDesc());
    }

    @GetMapping("/logs")
    public ResponseEntity<List<WaterConsumptionLog>> getWaterLogs() {
        return ResponseEntity.ok(consumptionLogRepository.findTop20ByOrderByLoggedAtDesc());
    }

    @GetMapping("/water-summary")
    public ResponseEntity<Map<String, Object>> getWaterSummary() {
        Double totalWater = consumptionLogRepository.getTotalWaterDispensed();
        long openValvesCount = valveRepository.findAll().stream()
                .filter(v -> v.getStatus() == com.agritech.irrigation.entity.ValveStatus.OPEN)
                .count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalLitersDispensed", totalWater);
        summary.put("estimatedWaterSavedLiters", Math.round(totalWater * 0.35)); // 35% water savings through smart telemetry
        summary.put("openValvesCount", openValvesCount);
        summary.put("activeValvesTotal", valveRepository.count());

        return ResponseEntity.ok(summary);
    }
}
