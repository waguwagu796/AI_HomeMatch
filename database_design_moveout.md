# 퇴실 & 분쟁 예방 페이지 데이터베이스 설계

## 개요
로그인 기반 사용자별 퇴실 관련 데이터를 저장하기 위한 MariaDB 테이블 설계

---

## 1. 입주 기록 (Entry Status Records)
입주 시 촬영한 사진과 상태 기록

### 테이블: `entry_status_records`
```sql
CREATE TABLE entry_status_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL COMMENT '이미지 파일 경로 또는 URL',
    record_type VARCHAR(50) NOT NULL COMMENT '공간 종류: 현관, 거실, 안방, 주방, 욕실, 베란다/발코니, 기타 공간',
    record_date DATE NOT NULL COMMENT '기록 날짜',
    description TEXT COMMENT '추가 설명',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_record_date (record_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**필드 설명:**
- `user_id`: 사용자 ID (users 테이블 참조)
- `image_url`: 이미지 저장 경로 (S3, 로컬 파일 경로 등)
- `record_type`: 입주 상태 종류
- `record_date`: 기록 날짜
- `description`: 추가 메모

---

## 2. 퇴실 체크리스트 (Move-out Checklist)
퇴실 전 필수 절차 체크리스트

### 테이블: `moveout_checklists`
```sql
CREATE TABLE moveout_checklists (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    checklist_type VARCHAR(20) NOT NULL COMMENT 'CHECKLIST_TYPE: MOVE_OUT, RESTORATION',
    item_name VARCHAR(100) NOT NULL COMMENT '체크리스트 항목명',
    is_completed BOOLEAN DEFAULT FALSE COMMENT '완료 여부',
    completed_at TIMESTAMP NULL COMMENT '완료 일시',
    notes TEXT COMMENT '메모',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_checklist_type (checklist_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**체크리스트 항목 예시:**
- **MOVE_OUT (퇴실 체크리스트):**
  - 전기 요금 해지 및 정산
  - 가스 요금 해지 및 정산
  - 수도 요금 정산
  - 인터넷 / TV 해지
  - 열쇠 반납 및 도어락 초기화

- **RESTORATION (원상복구 체크리스트):**
  - 바닥재 오염 및 파손 점검
  - 붙박이 가구 기능 점검
  - 창문 및 문 파손 여부
  - 벽지 손상 여부 확인
  - 조명·콘센트·스위치 정상 작동

---

## 3. 보증금 관리 (Deposit Management)
보증금 반환 진행 상황 및 정보

### 테이블: `deposit_managements`
```sql
CREATE TABLE deposit_managements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    deposit_amount DECIMAL(15, 2) NOT NULL COMMENT '보증금 금액',
    moveout_date DATE NOT NULL COMMENT '퇴실일',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '상태: PENDING, SETTLEMENT, RETURNED, DELAYED',
    expected_return_date DATE COMMENT '예상 반환일',
    actual_return_date DATE COMMENT '실제 반환일',
    returned_amount DECIMAL(15, 2) COMMENT '실제 반환 금액',
    deduction_amount DECIMAL(15, 2) DEFAULT 0 COMMENT '공제 금액',
    deduction_reason TEXT COMMENT '공제 사유',
    notes TEXT COMMENT '메모',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_moveout_date (moveout_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**상태 값:**
- `PENDING`: 퇴실 완료 (반환 대기)
- `SETTLEMENT`: 정산 완료
- `RETURNED`: 반환 완료
- `DELAYED`: 반환 지연

---

## 4. 퇴실 전 사진 기록 (Move-out Photos)
퇴실 전 촬영한 상태 사진

### 테이블: `moveout_photos`
```sql
CREATE TABLE moveout_photos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    photo_url VARCHAR(500) NOT NULL COMMENT '사진 파일 경로',
    photo_type VARCHAR(50) COMMENT '사진 종류: 전체구조, 청소상태, 벽바닥설비, 계량기수치 등',
    taken_date DATE NOT NULL COMMENT '촬영일',
    description TEXT COMMENT '설명',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_taken_date (taken_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 5. 분쟁 관련 기록 (Dispute Records)
분쟁 발생 시 기록 및 대응 내역

### 테이블: `dispute_records`
```sql
CREATE TABLE dispute_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    dispute_type VARCHAR(50) NOT NULL COMMENT '분쟁 유형: WALLPAPER, KITCHEN, WALL 등',
    dispute_date DATE NOT NULL COMMENT '분쟁 발생일',
    description TEXT NOT NULL COMMENT '분쟁 내용',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '상태: PENDING, RESOLVED, ESCALATED',
    resolution TEXT COMMENT '해결 내용',
    related_photos TEXT COMMENT '관련 사진 ID 목록 (JSON 배열)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_dispute_type (dispute_type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 6. 보증금 반환 이력 (Deposit Return History)
보증금 반환 관련 이벤트 기록

### 테이블: `deposit_return_history`
```sql
CREATE TABLE deposit_return_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    deposit_management_id BIGINT NOT NULL,
    action_type VARCHAR(50) NOT NULL COMMENT '액션 유형: NOTICE_SENT, LEGAL_ACTION, RETURNED 등',
    action_date DATE NOT NULL COMMENT '액션 일자',
    description TEXT COMMENT '상세 내용',
    document_url VARCHAR(500) COMMENT '관련 문서 URL (내용증명, 지급명령 등)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (deposit_management_id) REFERENCES deposit_managements(id) ON DELETE CASCADE,
    INDEX idx_deposit_management_id (deposit_management_id),
    INDEX idx_action_date (action_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 테이블 관계도

```
users (사용자)
  ├── entry_status_records (입주 기록)
  ├── moveout_checklists (퇴실 체크리스트)
  ├── deposit_managements (보증금 관리)
  │   └── deposit_return_history (보증금 반환 이력)
  ├── moveout_photos (퇴실 전 사진)
  └── dispute_records (분쟁 기록)
```

---

## 초기 데이터 설정

### 체크리스트 기본 항목 (시드 데이터)
```sql
-- 퇴실 체크리스트 기본 항목 (사용자별로 복사하여 생성)
INSERT INTO moveout_checklists (user_id, checklist_type, item_name) VALUES
(1, 'MOVE_OUT', '전기 요금 해지 및 정산'),
(1, 'MOVE_OUT', '가스 요금 해지 및 정산'),
(1, 'MOVE_OUT', '수도 요금 정산'),
(1, 'MOVE_OUT', '인터넷 / TV 해지'),
(1, 'MOVE_OUT', '열쇠 반납 및 도어락 초기화');

-- 원상복구 체크리스트 기본 항목
INSERT INTO moveout_checklists (user_id, checklist_type, item_name) VALUES
(1, 'RESTORATION', '바닥재 오염 및 파손 점검'),
(1, 'RESTORATION', '붙박이 가구 기능 점검'),
(1, 'RESTORATION', '창문 및 문 파손 여부'),
(1, 'RESTORATION', '벽지 손상 여부 확인'),
(1, 'RESTORATION', '조명·콘센트·스위치 정상 작동');
```

---

## 주요 쿼리 예시

### 1. 사용자의 입주 기록 조회
```sql
SELECT * FROM entry_status_records 
WHERE user_id = ? 
ORDER BY record_date DESC;
```

### 2. 사용자의 퇴실 체크리스트 조회
```sql
SELECT * FROM moveout_checklists 
WHERE user_id = ? AND checklist_type = 'MOVE_OUT'
ORDER BY id;
```

### 3. 보증금 관리 정보 조회
```sql
SELECT * FROM deposit_managements 
WHERE user_id = ? 
ORDER BY moveout_date DESC 
LIMIT 1;
```

### 4. 체크리스트 항목 완료 처리
```sql
UPDATE moveout_checklists 
SET is_completed = TRUE, 
    completed_at = NOW() 
WHERE id = ? AND user_id = ?;
```

---

## 추가 고려사항

1. **이미지 저장**: 
   - AWS S3, Google Cloud Storage 등 외부 스토리지 사용 권장
   - 또는 서버 로컬 파일 시스템 (경로만 DB에 저장)

2. **파일 업로드**:
   - 이미지 파일 크기 제한 설정
   - 이미지 압축 및 리사이징 고려

3. **인덱싱**:
   - `user_id`는 모든 테이블에 인덱스 필수
   - 날짜 기반 조회가 많으므로 날짜 필드 인덱스 권장

4. **보안**:
   - 사용자별 데이터 접근 권한 검증 (JWT 토큰 기반)
   - 이미지 파일 접근 권한 관리

5. **확장성**:
   - 대용량 이미지 처리를 위한 CDN 고려
   - 데이터 아카이빙 전략 (오래된 기록 처리)
