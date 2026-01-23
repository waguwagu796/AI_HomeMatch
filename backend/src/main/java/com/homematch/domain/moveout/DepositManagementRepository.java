package com.homematch.domain.moveout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepositManagementRepository extends JpaRepository<DepositManagement, Long> {
    @Query("SELECT d FROM DepositManagement d WHERE d.user.user_no = :userNo ORDER BY d.moveoutDate DESC")
    List<DepositManagement> findByUser_User_noOrderByMoveoutDateDesc(@Param("userNo") Integer userNo);
    
    @Query("SELECT d FROM DepositManagement d WHERE d.user.user_no = :userNo ORDER BY d.moveoutDate DESC")
    Optional<DepositManagement> findFirstByUser_User_noOrderByMoveoutDateDesc(@Param("userNo") Integer userNo);
}
