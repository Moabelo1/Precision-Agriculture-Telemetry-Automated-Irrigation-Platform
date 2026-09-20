package com.agritech.irrigation.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "water_consumption_logs")
public class WaterConsumptionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long valveId;

    @Column(nullable = false)
    private String valveCode;

    @Column(nullable = false)
    private String zoneId;

    @Column(nullable = false)
    private Double litersDispensed;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Column(nullable = false)
    private String triggeredBy; // "MANUAL_OVERRIDE", "AUTOMATED_SOA_ORCHESTRATION"

    private LocalDateTime loggedAt = LocalDateTime.now();

    public WaterConsumptionLog() {}

    public WaterConsumptionLog(Long valveId, String valveCode, String zoneId, Double litersDispensed, Integer durationMinutes, String triggeredBy) {
        this.valveId = valveId;
        this.valveCode = valveCode;
        this.zoneId = zoneId;
        this.litersDispensed = litersDispensed;
        this.durationMinutes = durationMinutes;
        this.triggeredBy = triggeredBy;
        this.loggedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getValveId() {
        return valveId;
    }

    public String getValveCode() {
        return valveCode;
    }

    public String getZoneId() {
        return zoneId;
    }

    public Double getLitersDispensed() {
        return litersDispensed;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public String getTriggeredBy() {
        return triggeredBy;
    }

    public LocalDateTime getLoggedAt() {
        return loggedAt;
    }
}
