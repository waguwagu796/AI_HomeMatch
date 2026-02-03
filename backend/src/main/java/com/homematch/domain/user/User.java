package com.homematch.domain.user;

import java.time.LocalDateTime;

// import javax.management.relation.Role;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int user_no;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = true, length = 30)
    private String phone;

    @Column(nullable = false, length = 30)
    private String nickname;

    @Column(nullable = false, name = "updated_at")
    private LocalDateTime updated_at;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    public void encodePassword(String email, String password, Role role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // user_no 필드에 대한 getUserNo() 메서드 추가 (Lombok이 getUser_no()를 생성하므로 수동 추가)
    public Integer getUserNo() {
        return this.user_no;
    }

    // 사용자 정보 업데이트 메서드
    public void updateInfo(String name, String nickname, String phone) {
        if (name != null) {
            this.name = name;
        }
        if (nickname != null) {
            this.nickname = nickname;
        }
        if (phone != null) {
            this.phone = phone;
        }
        this.updated_at = LocalDateTime.now();
    }

    // 이메일 변경 메서드
    public void updateEmail(String newEmail) {
        this.email = newEmail;
        this.updated_at = LocalDateTime.now();
    }
}
