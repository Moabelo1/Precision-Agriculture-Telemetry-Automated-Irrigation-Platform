package com.agritech.irrigation.repository;

import com.agritech.irrigation.entity.IrrigationValve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IrrigationValveRepository extends JpaRepository<IrrigationValve, Long> {
    Optional<IrrigationValve> findByZoneId(String zoneId);
    Optional<IrrigationValve> findByValveCode(String valveCode);
    List<IrrigationValve> findAllByOrderByZoneIdAsc();
}
