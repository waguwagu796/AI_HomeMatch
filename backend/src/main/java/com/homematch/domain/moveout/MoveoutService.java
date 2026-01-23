package com.homematch.domain.moveout;

import com.homematch.domain.moveout.dto.*;
import com.homematch.domain.user.User;
import com.homematch.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MoveoutService {

    private final EntryStatusRecordRepository entryStatusRecordRepository;
    private final MoveoutChecklistRepository moveoutChecklistRepository;
    private final DepositManagementRepository depositManagementRepository;
    private final MoveoutPhotoRepository moveoutPhotoRepository;
    private final DisputeRecordRepository disputeRecordRepository;
    private final DepositReturnHistoryRepository depositReturnHistoryRepository;
    private final UserRepository userRepository;

    // ========== Entry Status Records ==========
    public List<EntryStatusRecordResponse> getEntryStatusRecords(Integer userNo) {
        List<EntryStatusRecord> records = entryStatusRecordRepository.findByUser_User_noOrderByRecordDateDesc(userNo);
        return records.stream()
                .map(this::toEntryStatusRecordResponse)
                .collect(Collectors.toList());
    }

    public EntryStatusRecordResponse createEntryStatusRecord(Integer userNo, EntryStatusRecordRequest request) {
        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        EntryStatusRecord record = EntryStatusRecord.builder()
                .user(user)
                .imageUrl(request.getImageUrl())
                .recordType(request.getRecordType())
                .recordDate(request.getRecordDate())
                .description(request.getDescription())
                .build();

        EntryStatusRecord saved = entryStatusRecordRepository.save(record);
        return toEntryStatusRecordResponse(saved);
    }

    public void deleteEntryStatusRecord(Integer userNo, Long id) {
        EntryStatusRecord record = entryStatusRecordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("기록을 찾을 수 없습니다."));

        if (!record.getUser().getUserNo().equals(userNo)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }

        entryStatusRecordRepository.delete(record);
    }

    private EntryStatusRecordResponse toEntryStatusRecordResponse(EntryStatusRecord record) {
        return EntryStatusRecordResponse.builder()
                .id(record.getId())
                .imageUrl(record.getImageUrl())
                .recordType(record.getRecordType())
                .recordDate(record.getRecordDate())
                .description(record.getDescription())
                .build();
    }

    // ========== Moveout Checklists ==========
    public List<MoveoutChecklistResponse> getMoveoutChecklists(Integer userNo, String checklistType) {
        List<MoveoutChecklist> checklists;
        if (checklistType != null && !checklistType.isEmpty()) {
            checklists = moveoutChecklistRepository.findByUser_User_noAndChecklistTypeOrderById(userNo, checklistType);
        } else {
            checklists = moveoutChecklistRepository.findByUser_User_noOrderById(userNo);
        }
        return checklists.stream()
                .map(this::toMoveoutChecklistResponse)
                .collect(Collectors.toList());
    }

    public MoveoutChecklistResponse createMoveoutChecklist(Integer userNo, MoveoutChecklistRequest request) {
        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        MoveoutChecklist checklist = MoveoutChecklist.builder()
                .user(user)
                .checklistType(request.getChecklistType())
                .itemName(request.getItemName())
                .isCompleted(request.getIsCompleted() != null ? request.getIsCompleted() : false)
                .notes(request.getNotes())
                .build();

        MoveoutChecklist saved = moveoutChecklistRepository.save(checklist);
        return toMoveoutChecklistResponse(saved);
    }

    public MoveoutChecklistResponse updateMoveoutChecklist(Integer userNo, Long id, MoveoutChecklistRequest request) {
        MoveoutChecklist checklist = moveoutChecklistRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("체크리스트를 찾을 수 없습니다."));

        if (!checklist.getUser().getUserNo().equals(userNo)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }

        if (request.getIsCompleted() != null) {
            if (request.getIsCompleted()) {
                checklist.complete();
            } else {
                checklist.uncomplete();
            }
        }

        if (request.getItemName() != null) {
            // itemName은 일반적으로 변경하지 않지만, 요청이 있으면 업데이트
        }

        if (request.getNotes() != null) {
            checklist.updateNotes(request.getNotes());
        }

        MoveoutChecklist saved = moveoutChecklistRepository.save(checklist);
        return toMoveoutChecklistResponse(saved);
    }

    public void deleteMoveoutChecklist(Integer userNo, Long id) {
        MoveoutChecklist checklist = moveoutChecklistRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("체크리스트를 찾을 수 없습니다."));

        if (!checklist.getUser().getUserNo().equals(userNo)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }

        moveoutChecklistRepository.delete(checklist);
    }

    private MoveoutChecklistResponse toMoveoutChecklistResponse(MoveoutChecklist checklist) {
        return MoveoutChecklistResponse.builder()
                .id(checklist.getId())
                .checklistType(checklist.getChecklistType())
                .itemName(checklist.getItemName())
                .isCompleted(checklist.getIsCompleted())
                .completedAt(checklist.getCompletedAt())
                .notes(checklist.getNotes())
                .build();
    }

    // ========== Deposit Management ==========
    public DepositManagementResponse getDepositManagement(Integer userNo) {
        DepositManagement management = depositManagementRepository.findFirstByUser_User_noOrderByMoveoutDateDesc(userNo)
                .orElse(null);

        if (management == null) {
            return null;
        }

        return toDepositManagementResponse(management);
    }

    public DepositManagementResponse createDepositManagement(Integer userNo, DepositManagementRequest request) {
        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        DepositManagement management = DepositManagement.builder()
                .user(user)
                .depositAmount(request.getDepositAmount())
                .moveoutDate(request.getMoveoutDate())
                .status(request.getStatus() != null ? request.getStatus() : "PENDING")
                .expectedReturnDate(request.getExpectedReturnDate())
                .actualReturnDate(request.getActualReturnDate())
                .returnedAmount(request.getReturnedAmount())
                .deductionAmount(request.getDeductionAmount() != null ? request.getDeductionAmount() : java.math.BigDecimal.ZERO)
                .deductionReason(request.getDeductionReason())
                .notes(request.getNotes())
                .build();

        DepositManagement saved = depositManagementRepository.save(management);
        return toDepositManagementResponse(saved);
    }

    public DepositManagementResponse updateDepositManagement(Integer userNo, Long id, DepositManagementRequest request) {
        DepositManagement management = depositManagementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("보증금 관리를 찾을 수 없습니다."));

        if (!management.getUser().getUserNo().equals(userNo)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }

        if (request.getStatus() != null) {
            management.updateStatus(request.getStatus());
        }
        if (request.getExpectedReturnDate() != null) {
            management.updateExpectedReturnDate(request.getExpectedReturnDate());
        }
        if (request.getActualReturnDate() != null) {
            management.updateActualReturnDate(request.getActualReturnDate());
        }
        if (request.getReturnedAmount() != null) {
            management.updateReturnedAmount(request.getReturnedAmount());
        }
        if (request.getDeductionAmount() != null) {
            management.updateDeductionAmount(request.getDeductionAmount());
        }
        if (request.getDeductionReason() != null) {
            management.updateDeductionReason(request.getDeductionReason());
        }
        if (request.getNotes() != null) {
            management.updateNotes(request.getNotes());
        }

        DepositManagement saved = depositManagementRepository.save(management);
        return toDepositManagementResponse(saved);
    }

    private DepositManagementResponse toDepositManagementResponse(DepositManagement management) {
        return DepositManagementResponse.builder()
                .id(management.getId())
                .depositAmount(management.getDepositAmount())
                .moveoutDate(management.getMoveoutDate())
                .status(management.getStatus())
                .expectedReturnDate(management.getExpectedReturnDate())
                .actualReturnDate(management.getActualReturnDate())
                .returnedAmount(management.getReturnedAmount())
                .deductionAmount(management.getDeductionAmount())
                .deductionReason(management.getDeductionReason())
                .notes(management.getNotes())
                .build();
    }

    // ========== Moveout Photos ==========
    public List<MoveoutPhotoResponse> getMoveoutPhotos(Integer userNo) {
        List<MoveoutPhoto> photos = moveoutPhotoRepository.findByUser_User_noOrderByTakenDateDesc(userNo);
        return photos.stream()
                .map(this::toMoveoutPhotoResponse)
                .collect(Collectors.toList());
    }

    public MoveoutPhotoResponse createMoveoutPhoto(Integer userNo, MoveoutPhotoRequest request) {
        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        MoveoutPhoto photo = MoveoutPhoto.builder()
                .user(user)
                .photoUrl(request.getPhotoUrl())
                .photoType(request.getPhotoType())
                .takenDate(request.getTakenDate())
                .description(request.getDescription())
                .build();

        MoveoutPhoto saved = moveoutPhotoRepository.save(photo);
        return toMoveoutPhotoResponse(saved);
    }

    public void deleteMoveoutPhoto(Integer userNo, Long id) {
        MoveoutPhoto photo = moveoutPhotoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사진을 찾을 수 없습니다."));

        if (!photo.getUser().getUserNo().equals(userNo)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }

        moveoutPhotoRepository.delete(photo);
    }

    private MoveoutPhotoResponse toMoveoutPhotoResponse(MoveoutPhoto photo) {
        return MoveoutPhotoResponse.builder()
                .id(photo.getId())
                .photoUrl(photo.getPhotoUrl())
                .photoType(photo.getPhotoType())
                .takenDate(photo.getTakenDate())
                .description(photo.getDescription())
                .build();
    }

    // ========== Dispute Records ==========
    public List<DisputeRecordResponse> getDisputeRecords(Integer userNo) {
        List<DisputeRecord> records = disputeRecordRepository.findByUser_User_noOrderByDisputeDateDesc(userNo);
        return records.stream()
                .map(this::toDisputeRecordResponse)
                .collect(Collectors.toList());
    }

    public DisputeRecordResponse createDisputeRecord(Integer userNo, DisputeRecordRequest request) {
        User user = userRepository.findById(userNo)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        DisputeRecord record = DisputeRecord.builder()
                .user(user)
                .disputeType(request.getDisputeType())
                .disputeDate(request.getDisputeDate())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : "PENDING")
                .resolution(request.getResolution())
                .relatedPhotos(request.getRelatedPhotos())
                .build();

        DisputeRecord saved = disputeRecordRepository.save(record);
        return toDisputeRecordResponse(saved);
    }

    private DisputeRecordResponse toDisputeRecordResponse(DisputeRecord record) {
        return DisputeRecordResponse.builder()
                .id(record.getId())
                .disputeType(record.getDisputeType())
                .disputeDate(record.getDisputeDate())
                .description(record.getDescription())
                .status(record.getStatus())
                .resolution(record.getResolution())
                .relatedPhotos(record.getRelatedPhotos())
                .build();
    }

    // ========== Deposit Return History ==========
    public List<DepositReturnHistoryResponse> getDepositReturnHistory(Long depositManagementId) {
        List<DepositReturnHistory> history = depositReturnHistoryRepository.findByDepositManagement_IdOrderByActionDateDesc(depositManagementId);
        return history.stream()
                .map(this::toDepositReturnHistoryResponse)
                .collect(Collectors.toList());
    }

    public DepositReturnHistoryResponse createDepositReturnHistory(DepositReturnHistoryRequest request) {
        DepositManagement management = depositManagementRepository.findById(request.getDepositManagementId())
                .orElseThrow(() -> new IllegalArgumentException("보증금 관리를 찾을 수 없습니다."));

        DepositReturnHistory history = DepositReturnHistory.builder()
                .depositManagement(management)
                .actionType(request.getActionType())
                .actionDate(request.getActionDate())
                .description(request.getDescription())
                .documentUrl(request.getDocumentUrl())
                .build();

        DepositReturnHistory saved = depositReturnHistoryRepository.save(history);
        return toDepositReturnHistoryResponse(saved);
    }

    private DepositReturnHistoryResponse toDepositReturnHistoryResponse(DepositReturnHistory history) {
        return DepositReturnHistoryResponse.builder()
                .id(history.getId())
                .depositManagementId(history.getDepositManagement().getId())
                .actionType(history.getActionType())
                .actionDate(history.getActionDate())
                .description(history.getDescription())
                .documentUrl(history.getDocumentUrl())
                .build();
    }
}
