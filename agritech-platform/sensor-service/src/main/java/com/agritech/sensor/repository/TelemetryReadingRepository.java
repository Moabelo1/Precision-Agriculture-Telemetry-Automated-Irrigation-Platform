package com.agritech.sensor.repository;

import com.agritech.sensor.entity.TelemetryReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TelemetryReadingRepository extends JpaRepository<TelemetryReading, Long> {
    List<TelemetryReading> findByZoneIdOrderByRecordedAtDesc(String zoneId);
    Optional<TelemetryReading> findFirstByZoneIdOrderByRecordedAtDesc(String zoneId);
    List<TelemetryReading> findByDeviceCodeOrderByRecordedAtDesc(String deviceCode);
    List<TelemetryReading> findTop20ByOrderByRecordedAtDesc();
}
