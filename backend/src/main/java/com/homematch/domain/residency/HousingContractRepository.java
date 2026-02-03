package com.homematch.domain.residency;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HousingContractRepository extends JpaRepository<HousingContract, Long> {
    @Query("SELECT h FROM HousingContract h JOIN h.user u WHERE u.user_no = :userNo")
    Optional<HousingContract> findByUser_User_no(@Param("userNo") Integer userNo);
}
