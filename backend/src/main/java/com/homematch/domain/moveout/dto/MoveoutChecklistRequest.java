package com.homematch.domain.moveout.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoveoutChecklistRequest {
    private String checklistType;
    private String itemName;
    private Boolean isCompleted;
    private String notes;
}
