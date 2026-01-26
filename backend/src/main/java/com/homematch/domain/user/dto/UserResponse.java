package com.homematch.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Integer userNo;
    private String email;
    private String name;
    private String phone;
    private String nickname;
    private String role;
}
