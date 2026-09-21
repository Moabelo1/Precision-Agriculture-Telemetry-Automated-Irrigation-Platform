package com.agritech.crop.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "crops")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g., "Hard Red Winter Wheat"

    @Column(nullable = false)
    private String variety; // e.g., "Triticum aestivum"

    @Column(nullable = false)
    private String zoneId; // e.g., "ZONE-1"

    @Column(nullable = false)
    private Double acreage; // Acreage size, e.g. 150.0 acres

    @Column(nullable = false)
    private String growthStage; // "VEGETATIVE", "FLOWERING", "RIPENING", "SEEDLING"

    @Column(nullable = false)
    private Double minOptimalMoisture; // e.g. 25.0%

    @Column(nullable = false)
    private Double maxOptimalMoisture; // e.g. 45.0%

    @Column(nullable = false)
    private Double minOptimalTemp; // e.g. 15.0°C

    @Column(nullable = false)
    private Double maxOptimalTemp; // e.g. 28.0°C

    public Crop() {}

    public Crop(String name, String variety, String zoneId, Double acreage, String growthStage,
                Double minOptimalMoisture, Double maxOptimalMoisture, Double minOptimalTemp, Double maxOptimalTemp) {
        this.name = name;
        this.variety = variety;
        this.zoneId = zoneId;
        this.acreage = acreage;
        this.growthStage = growthStage;
        this.minOptimalMoisture = minOptimalMoisture;
        this.maxOptimalMoisture = maxOptimalMoisture;
        this.minOptimalTemp = minOptimalTemp;
        this.maxOptimalTemp = maxOptimalTemp;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVariety() {
        return variety;
    }

    public void setVariety(String variety) {
        this.variety = variety;
    }

    public String getZoneId() {
        return zoneId;
    }

    public void setZoneId(String zoneId) {
        this.zoneId = zoneId;
    }

    public Double getAcreage() {
        return acreage;
    }

    public void setAcreage(Double acreage) {
        this.acreage = acreage;
    }

    public String getGrowthStage() {
        return growthStage;
    }

    public void setGrowthStage(String growthStage) {
        this.growthStage = growthStage;
    }

    public Double getMinOptimalMoisture() {
        return minOptimalMoisture;
    }

    public void setMinOptimalMoisture(Double minOptimalMoisture) {
        this.minOptimalMoisture = minOptimalMoisture;
    }

    public Double getMaxOptimalMoisture() {
        return maxOptimalMoisture;
    }

    public void setMaxOptimalMoisture(Double maxOptimalMoisture) {
        this.maxOptimalMoisture = maxOptimalMoisture;
    }

    public Double getMinOptimalTemp() {
        return minOptimalTemp;
    }

    public void setMinOptimalTemp(Double minOptimalTemp) {
        this.minOptimalTemp = minOptimalTemp;
    }

    public Double getMaxOptimalTemp() {
        return maxOptimalTemp;
    }

    public void setMaxOptimalTemp(Double maxOptimalTemp) {
        this.maxOptimalTemp = maxOptimalTemp;
    }
}
