package com.homematch.domain.moveout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepositReturnHistoryRepository extends JpaRepository<DepositReturnHistory, Long> {
    List<DepositReturnHistory> findByDepositManagement_IdOrderByActionDateDesc(Long depositManagementId);
}
