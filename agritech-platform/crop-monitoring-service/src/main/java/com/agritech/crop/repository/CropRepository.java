package com.agritech.crop.repository;

import com.agritech.crop.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {
    Optional<Crop> findByZoneId(String zoneId);
    List<Crop> findAllByOrderByZoneIdAsc();
}
