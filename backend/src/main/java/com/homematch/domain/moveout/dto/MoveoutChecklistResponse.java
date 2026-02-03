package com.homematch.domain.moveout.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoveoutChecklistResponse {
    private Long id;
    private String checklistType;
    private String itemName;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
    private String notes;
}
