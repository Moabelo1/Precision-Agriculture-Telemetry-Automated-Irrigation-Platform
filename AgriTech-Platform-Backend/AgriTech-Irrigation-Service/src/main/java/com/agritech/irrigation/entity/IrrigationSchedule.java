package com.agritech.irrigation.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "irrigation_schedules")
public class IrrigationSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String zoneId;

    @Column(nullable = false)
    private Long valveId;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Column(nullable = false)
    private LocalDateTime scheduledStartTime;

    private boolean automated = true;

    @Column(nullable = false)
    private String status; // "PENDING", "IN_PROGRESS", "COMPLETED", "SKIPPED"

    public IrrigationSchedule() {}

    public IrrigationSchedule(String zoneId, Long valveId, Integer durationMinutes, LocalDateTime scheduledStartTime, boolean automated, String status) {
        this.zoneId = zoneId;
        this.valveId = valveId;
        this.durationMinutes = durationMinutes;
        this.scheduledStartTime = scheduledStartTime;
        this.automated = automated;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getZoneId() {
        return zoneId;
    }

    public Long getValveId() {
        return valveId;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public LocalDateTime getScheduledStartTime() {
        return scheduledStartTime;
    }

    public boolean isAutomated() {
        return automated;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
