package com.homematch.domain.residency.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HousingCostSettingsRequest {
    private BigDecimal rent;
    private BigDecimal maintenance;
    private BigDecimal utilities;
    private Integer paymentDate;
    private Boolean autoRegister;
}
