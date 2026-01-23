package com.homematch.domain.residency.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyHousingRecordResponse {
    private Long id;
    private Integer year;
    private Integer month;
    private BigDecimal rent;
    private BigDecimal maintenance;
    private BigDecimal utilities;
    private Integer paymentDate;
    private Boolean paid;
    private LocalDateTime paidAt;
    private String notes;
}
