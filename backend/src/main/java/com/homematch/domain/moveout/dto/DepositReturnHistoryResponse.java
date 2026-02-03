package com.homematch.domain.moveout.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepositReturnHistoryResponse {
    private Long id;
    private Long depositManagementId;
    private String actionType;
    private LocalDate actionDate;
    private String description;
    private String documentUrl;
}
