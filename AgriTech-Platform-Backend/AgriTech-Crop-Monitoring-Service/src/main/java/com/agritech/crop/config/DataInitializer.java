package com.agritech.crop.config;

import com.agritech.crop.entity.Crop;
import com.agritech.crop.repository.CropRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initCrops(CropRepository cropRepository) {
        return args -> {
            if (cropRepository.count() == 0) {
                cropRepository.save(new Crop(
                        "Hard Red Winter Wheat",
                        "Triticum aestivum",
                        "ZONE-1",
                        120.0,
                        "VEGETATIVE",
                        28.0, 48.0,
                        15.0, 28.0
                ));

                cropRepository.save(new Crop(
                        "Sweet Golden Corn",
                        "Zea mays",
                        "ZONE-2",
                        200.0,
                        "FLOWERING",
                        35.0, 55.0,
                        18.0, 32.0
                ));

                cropRepository.save(new Crop(
                        "Roma Plum Tomatoes",
                        "Solanum lycopersicum",
                        "ZONE-3",
                        45.0,
                        "RIPENING",
                        38.0, 60.0,
                        18.0, 28.0
                ));

                cropRepository.save(new Crop(
                        "Northern High-Yield Soybeans",
                        "Glycine max",
                        "ZONE-4",
                        180.0,
                        "SEEDLING",
                        25.0, 45.0,
                        16.0, 30.0
                ));
            }
        };
    }
}
