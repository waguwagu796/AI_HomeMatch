package com.homematch.domain.moveout.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepositManagementResponse {
    private Long id;
    private BigDecimal depositAmount;
    private LocalDate moveoutDate;
    private String status;
    private LocalDate expectedReturnDate;
    private LocalDate actualReturnDate;
    private BigDecimal returnedAmount;
    private BigDecimal deductionAmount;
    private String deductionReason;
    private String notes;
}
