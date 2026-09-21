package com.agritech.irrigation.config;

import com.agritech.irrigation.entity.IrrigationValve;
import com.agritech.irrigation.entity.ValveStatus;
import com.agritech.irrigation.entity.WaterConsumptionLog;
import com.agritech.irrigation.repository.IrrigationValveRepository;
import com.agritech.irrigation.repository.WaterConsumptionLogRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initIrrigationData(IrrigationValveRepository valveRepository,
                                                WaterConsumptionLogRepository consumptionRepository) {
        return args -> {
            if (valveRepository.count() == 0) {
                IrrigationValve v1 = valveRepository.save(new IrrigationValve("VALVE-Z1-01", "ZONE-1", "North Acreage Main Sprinkler Gate", ValveStatus.CLOSED, 45.0));
                IrrigationValve v2 = valveRepository.save(new IrrigationValve("VALVE-Z2-01", "ZONE-2", "South Acreage Drip Irrigation Line", ValveStatus.CLOSED, 60.0));
                IrrigationValve v3 = valveRepository.save(new IrrigationValve("VALVE-Z3-01", "ZONE-3", "East Greenhouse Mist Injector", ValveStatus.CLOSED, 30.0));
                IrrigationValve v4 = valveRepository.save(new IrrigationValve("VALVE-Z4-01", "ZONE-4", "West Acreage Pivot Sprinkler", ValveStatus.CLOSED, 55.0));

                // Seed some past consumption logs
                consumptionRepository.save(new WaterConsumptionLog(v1.getId(), v1.getValveCode(), "ZONE-1", 450.0, 10, "MANUAL_OVERRIDE"));
                consumptionRepository.save(new WaterConsumptionLog(v2.getId(), v2.getValveCode(), "ZONE-2", 900.0, 15, "AUTOMATED_SOA_ORCHESTRATION"));
            }
        };
    }
}
