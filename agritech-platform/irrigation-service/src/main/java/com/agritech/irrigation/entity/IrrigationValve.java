package com.agritech.irrigation.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "irrigation_valves")
public class IrrigationValve {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String valveCode;

    @Column(nullable = false)
    private String zoneId;

    @Column(nullable = false)
    private String locationDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ValveStatus status = ValveStatus.CLOSED;

    @Column(nullable = false)
    private Double flowRateLitersPerMin; // e.g. 50.0 L/min

    private LocalDateTime lastActivatedAt;

    public IrrigationValve() {}

    public IrrigationValve(String valveCode, String zoneId, String locationDescription, ValveStatus status, Double flowRateLitersPerMin) {
        this.valveCode = valveCode;
        this.zoneId = zoneId;
        this.locationDescription = locationDescription;
        this.status = status;
        this.flowRateLitersPerMin = flowRateLitersPerMin;
    }

    public Long getId() {
        return id;
    }

    public String getValveCode() {
        return valveCode;
    }

    public void setValveCode(String valveCode) {
        this.valveCode = valveCode;
    }

    public String getZoneId() {
        return zoneId;
    }

    public void setZoneId(String zoneId) {
        this.zoneId = zoneId;
    }

    public String getLocationDescription() {
        return locationDescription;
    }

    public void setLocationDescription(String locationDescription) {
        this.locationDescription = locationDescription;
    }

    public ValveStatus getStatus() {
        return status;
    }

    public void setStatus(ValveStatus status) {
        this.status = status;
    }

    public Double getFlowRateLitersPerMin() {
        return flowRateLitersPerMin;
    }

    public void setFlowRateLitersPerMin(Double flowRateLitersPerMin) {
        this.flowRateLitersPerMin = flowRateLitersPerMin;
    }

    public LocalDateTime getLastActivatedAt() {
        return lastActivatedAt;
    }

    public void setLastActivatedAt(LocalDateTime lastActivatedAt) {
        this.lastActivatedAt = lastActivatedAt;
    }
}
