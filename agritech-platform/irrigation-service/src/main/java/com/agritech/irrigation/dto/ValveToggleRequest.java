package com.agritech.irrigation.dto;

import com.agritech.irrigation.entity.ValveStatus;

public class ValveToggleRequest {
    private ValveStatus status;
    private Integer durationMinutes;
    private String triggeredBy;

    public ValveToggleRequest() {}

    public ValveToggleRequest(ValveStatus status, Integer durationMinutes, String triggeredBy) {
        this.status = status;
        this.durationMinutes = durationMinutes;
        this.triggeredBy = triggeredBy;
    }

    public ValveStatus getStatus() {
        return status;
    }

    public void setStatus(ValveStatus status) {
        this.status = status;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getTriggeredBy() {
        return triggeredBy;
    }

    public void setTriggeredBy(String triggeredBy) {
        this.triggeredBy = triggeredBy;
    }
}
