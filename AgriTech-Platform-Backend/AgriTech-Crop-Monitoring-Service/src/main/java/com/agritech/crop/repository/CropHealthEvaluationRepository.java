package com.agritech.crop.repository;

import com.agritech.crop.entity.CropHealthEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CropHealthEvaluationRepository extends JpaRepository<CropHealthEvaluation, Long> {
    List<CropHealthEvaluation> findByCropIdOrderByEvaluatedAtDesc(Long cropId);
    Optional<CropHealthEvaluation> findFirstByZoneIdOrderByEvaluatedAtDesc(String zoneId);
    List<CropHealthEvaluation> findTop10ByOrderByEvaluatedAtDesc();
}
