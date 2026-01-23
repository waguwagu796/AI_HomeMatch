package com.homematch.domain.residency.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HousingContractRequest {
    private LocalDate contractStartDate;
    private LocalDate contractEndDate;
    private Integer contractDurationMonths;
    private String notes;
}
