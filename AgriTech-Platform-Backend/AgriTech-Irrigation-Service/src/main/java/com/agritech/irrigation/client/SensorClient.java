package com.agritech.irrigation.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "sensor-service")
public interface SensorClient {

    @GetMapping("/api/sensors/zone/{zoneId}/latest")
    Map<String, Object> getLatestTelemetryByZone(@PathVariable("zoneId") String zoneId);
}
