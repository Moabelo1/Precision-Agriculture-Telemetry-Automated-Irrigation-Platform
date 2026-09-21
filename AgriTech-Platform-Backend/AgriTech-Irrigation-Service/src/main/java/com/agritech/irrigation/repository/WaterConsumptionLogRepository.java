package com.agritech.irrigation.repository;

import com.agritech.irrigation.entity.WaterConsumptionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WaterConsumptionLogRepository extends JpaRepository<WaterConsumptionLog, Long> {
    List<WaterConsumptionLog> findByZoneId(String zoneId);
    List<WaterConsumptionLog> findTop20ByOrderByLoggedAtDesc();

    @Query("SELECT COALESCE(SUM(w.litersDispensed), 0.0) FROM WaterConsumptionLog w")
    Double getTotalWaterDispensed();
}
