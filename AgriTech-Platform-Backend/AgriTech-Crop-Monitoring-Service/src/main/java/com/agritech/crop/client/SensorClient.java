package com.agritech.crop.client;

import com.agritech.crop.dto.TelemetryReadingDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "sensor-service")
public interface SensorClient {

    @GetMapping("/api/sensors/zone/{zoneId}/latest")
    TelemetryReadingDTO getLatestTelemetryByZone(@PathVariable("zoneId") String zoneId);
}
