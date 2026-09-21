package com.agritech.sensor.repository;

import com.agritech.sensor.entity.SensorDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SensorDeviceRepository extends JpaRepository<SensorDevice, Long> {
    Optional<SensorDevice> findByDeviceCode(String deviceCode);
    List<SensorDevice> findByZoneId(String zoneId);
}
