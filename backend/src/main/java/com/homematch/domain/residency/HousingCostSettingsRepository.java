package com.homematch.domain.residency;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HousingCostSettingsRepository extends JpaRepository<HousingCostSettings, Long> {
    @Query("SELECT h FROM HousingCostSettings h JOIN h.user u WHERE u.user_no = :userNo")
    Optional<HousingCostSettings> findByUser_User_no(@Param("userNo") Integer userNo);
}
