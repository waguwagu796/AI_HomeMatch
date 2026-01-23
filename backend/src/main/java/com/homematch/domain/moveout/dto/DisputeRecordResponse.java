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
public class DisputeRecordResponse {
    private Long id;
    private String disputeType;
    private LocalDate disputeDate;
    private String description;
    private String status;
    private String resolution;
    private String relatedPhotos;
}
