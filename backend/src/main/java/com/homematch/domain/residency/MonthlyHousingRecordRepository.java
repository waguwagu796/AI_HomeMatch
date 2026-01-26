package com.homematch.domain.residency;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlyHousingRecordRepository extends JpaRepository<MonthlyHousingRecord, Long> {
    @Query("SELECT m FROM MonthlyHousingRecord m JOIN m.user u WHERE u.user_no = :userNo ORDER BY m.year DESC, m.month DESC")
    List<MonthlyHousingRecord> findByUser_User_noOrderByYearDescMonthDesc(@Param("userNo") Integer userNo);

    @Query("SELECT m FROM MonthlyHousingRecord m JOIN m.user u WHERE u.user_no = :userNo AND m.year = :year AND m.month = :month")
    Optional<MonthlyHousingRecord> findByUser_User_noAndYearAndMonth(
            @Param("userNo") Integer userNo,
            @Param("year") Integer year,
            @Param("month") Integer month);

    @Query("SELECT m FROM MonthlyHousingRecord m JOIN m.user u WHERE u.user_no = :userNo AND m.year = :year ORDER BY m.month DESC")
    List<MonthlyHousingRecord> findByUser_User_noAndYearOrderByMonthDesc(
            @Param("userNo") Integer userNo,
            @Param("year") Integer year);
}
