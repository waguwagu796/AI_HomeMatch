package com.homematch.domain.moveout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisputeRecordRepository extends JpaRepository<DisputeRecord, Long> {
    @Query("SELECT d FROM DisputeRecord d WHERE d.user.user_no = :userNo ORDER BY d.disputeDate DESC")
    List<DisputeRecord> findByUser_User_noOrderByDisputeDateDesc(@Param("userNo") Integer userNo);
}
