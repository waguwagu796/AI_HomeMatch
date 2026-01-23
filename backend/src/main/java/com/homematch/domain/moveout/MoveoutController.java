package com.homematch.domain.moveout;

import com.homematch.domain.moveout.dto.*;
import com.homematch.domain.user.User;
import com.homematch.domain.user.UserRepository;
import com.homematch.global.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moveout")
@RequiredArgsConstructor
public class MoveoutController {

    private final MoveoutService moveoutService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    // JWT 토큰에서 사용자 ID 추출 헬퍼 메서드
    private Integer getUserIdFromToken(String token) {
        try {
            String email = jwtTokenProvider.getEmail(token);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
            return user.getUserNo();
        } catch (Exception e) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }
    }

    // ========== Entry Status Records ==========
    @GetMapping("/entry-status-records")
    public ResponseEntity<List<EntryStatusRecordResponse>> getEntryStatusRecords(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Integer userNo = getUserIdFromToken(token);
            List<EntryStatusRecordResponse> records = moveoutService.getEntryStatusRecords(userNo);
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/entry-status-records")
    public ResponseEntity<?> createEntryStatusRecord(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody EntryStatusRecordRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Integer userNo = getUserIdFromToken(token);
            EntryStatusRecordResponse response = moveoutService.createEntryStatusRecord(userNo, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"서버 오류가 발생했습니다: " + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/entry-status-records/{id}")
    public ResponseEntity<Void> deleteEntryStatusRecord(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Integer userNo = getUserIdFromToken(token);
            moveoutService.deleteEntryStatusRecord(userNo, id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // ========== Moveout Checklists ==========
    @GetMapping("/checklists")
    public ResponseEntity<List<MoveoutChecklistResponse>> getMoveoutChecklists(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String checklistType) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Integer userNo = getUserIdFromToken(token);
            List<MoveoutChecklistResponse> checklists = moveoutService.getMoveoutChecklists(userNo, checklistType);
            return ResponseEntity.ok(checklists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/checklists")
    public ResponseEntity<MoveoutChecklistResponse> createMoveoutChecklist(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody MoveoutChecklistRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Integer userNo = getUserIdFromToken(token);
            MoveoutChecklistResponse response = moveoutService.createMoveoutChecklist(userNo, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/checklists/{id}")
    public ResponseEntity<MoveoutChecklistResponse> updateMoveoutChecklist(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody MoveoutChecklistRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Integer userNo = getUserIdFromToken(token);
            MoveoutChecklistResponse response = moveoutService.updateMoveoutChecklist(userNo, id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/checklists/{id}")
    public ResponseEntity<Void> deleteMoveoutChecklist(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Integer userNo = getUserIdFromToken(token);
            moveoutService.deleteMoveoutChecklist(userNo, id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // ========== Deposit Management ==========
    @GetMapping("/deposit-management")
    public ResponseEntity<DepositManagementResponse> getDepositManagement(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Integer userNo = getUserIdFromToken(token);
            DepositManagementResponse response = moveoutService.getDepositManagement(userNo);
            if (response == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/deposit-management")
    public ResponseEntity<DepositManagementResponse> createDepositManagement(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody DepositManagementRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Integer userNo = getUserIdFromToken(token);
            DepositManagementResponse response = moveoutService.createDepositManagement(userNo, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/deposit-management/{id}")
    public ResponseEntity<DepositManagementResponse> updateDepositManagement(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody DepositManagementRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Integer userNo = getUserIdFromToken(token);
            DepositManagementResponse response = moveoutService.updateDepositManagement(userNo, id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // ========== Moveout Photos ==========
    @GetMapping("/photos")
    public ResponseEntity<List<MoveoutPhotoResponse>> getMoveoutPhotos(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Integer userNo = getUserIdFromToken(token);
            List<MoveoutPhotoResponse> photos = moveoutService.getMoveoutPhotos(userNo);
            return ResponseEntity.ok(photos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/photos")
    public ResponseEntity<MoveoutPhotoResponse> createMoveoutPhoto(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody MoveoutPhotoRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Integer userNo = getUserIdFromToken(token);
            MoveoutPhotoResponse response = moveoutService.createMoveoutPhoto(userNo, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/photos/{id}")
    public ResponseEntity<Void> deleteMoveoutPhoto(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Integer userNo = getUserIdFromToken(token);
            moveoutService.deleteMoveoutPhoto(userNo, id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // ========== Dispute Records ==========
    @GetMapping("/dispute-records")
    public ResponseEntity<List<DisputeRecordResponse>> getDisputeRecords(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Integer userNo = getUserIdFromToken(token);
            List<DisputeRecordResponse> records = moveoutService.getDisputeRecords(userNo);
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/dispute-records")
    public ResponseEntity<DisputeRecordResponse> createDisputeRecord(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody DisputeRecordRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Integer userNo = getUserIdFromToken(token);
            DisputeRecordResponse response = moveoutService.createDisputeRecord(userNo, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // ========== Deposit Return History ==========
    @GetMapping("/deposit-return-history/{depositManagementId}")
    public ResponseEntity<List<DepositReturnHistoryResponse>> getDepositReturnHistory(
            @PathVariable Long depositManagementId) {
        try {
            List<DepositReturnHistoryResponse> history = moveoutService.getDepositReturnHistory(depositManagementId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/deposit-return-history")
    public ResponseEntity<DepositReturnHistoryResponse> createDepositReturnHistory(
            @RequestBody DepositReturnHistoryRequest request) {
        try {
            DepositReturnHistoryResponse response = moveoutService.createDepositReturnHistory(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
