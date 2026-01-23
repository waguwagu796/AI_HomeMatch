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
public class EntryStatusRecordRequest {
    private String imageUrl;
    private String recordType;
    private LocalDate recordDate;
    private String description;
}
