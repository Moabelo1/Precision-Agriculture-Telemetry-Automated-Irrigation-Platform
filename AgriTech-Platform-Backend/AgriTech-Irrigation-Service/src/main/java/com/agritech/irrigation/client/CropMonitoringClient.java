package com.agritech.irrigation.client;

import com.agritech.irrigation.dto.CropHealthReportDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "crop-monitoring-service")
public interface CropMonitoringClient {

    @GetMapping("/api/crop-monitoring/zone/{zoneId}/evaluate")
    CropHealthReportDTO evaluateCropByZone(@PathVariable("zoneId") String zoneId);
}
