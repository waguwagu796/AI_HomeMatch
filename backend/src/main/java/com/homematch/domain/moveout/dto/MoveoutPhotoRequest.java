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
public class MoveoutPhotoRequest {
    private String photoUrl;
    private String photoType;
    private LocalDate takenDate;
    private String description;
}
