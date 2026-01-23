package com.homematch.domain.user;

import com.homematch.domain.user.dto.UserResponse;
import com.homematch.domain.user.dto.UserUpdateRequest;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void signup(String email, String rawPassword, String name, String nickname) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .name(name)
                .nickname(nickname)
                .role(Role.USER) // 기본 권한
                .updated_at(LocalDateTime.now())
                .build();

        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public String getNicknameByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getNickname)
                .orElse("사용자"); // 유저를 찾지 못할 경우 기본값
    }

    @Transactional(readOnly = true)
    public String getRoleByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(user -> user.getRole().name()) // Role enum을 String으로 변환
                .orElse("USER"); // 유저를 찾지 못할 경우 기본값
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        return UserResponse.builder()
                .userNo(user.getUserNo())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .nickname(user.getNickname())
                .role(user.getRole().name())
                .build();
    }

    @Transactional
    public UserResponse updateUser(String email, UserUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 이메일 변경 시 중복 체크
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
            }
            user.updateEmail(request.getEmail());
        }

        // 다른 정보 업데이트
        user.updateInfo(
                request.getName(),
                request.getNickname(),
                request.getPhone()
        );

        User saved = userRepository.save(user);
        
        return UserResponse.builder()
                .userNo(saved.getUserNo())
                .email(saved.getEmail())
                .name(saved.getName())
                .phone(saved.getPhone())
                .nickname(saved.getNickname())
                .role(saved.getRole().name())
                .build();
    }

}
