-- ============================================
-- ResidencyManagementPage 전체 테이블 생성 SQL
-- 거주 중 관리 페이지에서 사용하는 모든 테이블
-- ============================================

-- ============================================
-- 1. 입주 상태 기록 (Entry Status Records)
-- ResidencyManagementPage와 MoveOutPage에서 공유
-- ============================================
CREATE TABLE IF NOT EXISTS entry_status_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '사용자 ID (users.user_no 참조)',
    image_url MEDIUMTEXT NOT NULL COMMENT '이미지 파일 경로 또는 URL (base64 데이터 URL 지원, 최대 16MB)',
    record_type VARCHAR(50) NOT NULL COMMENT '공간 종류: 현관, 거실, 안방, 주방, 욕실, 베란다/발코니, 기타 공간',
    record_date DATE NOT NULL COMMENT '기록 날짜',
    description TEXT COMMENT '추가 설명',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_no) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_record_date (record_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. 거주 계약 기간 (Housing Contracts)
-- ============================================
CREATE TABLE IF NOT EXISTS housing_contracts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE COMMENT '사용자 ID (users.user_no 참조, 1인당 1개만 존재)',
    contract_start_date DATE NOT NULL COMMENT '계약 시작일 (입주일)',
    contract_end_date DATE NOT NULL COMMENT '계약 종료일 (거주 마감일)',
    contract_duration_months INT COMMENT '계약 기간 (월 단위, 예: 12개월, 6개월)',
    notes TEXT COMMENT '계약 관련 메모',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_no) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_contract_start_date (contract_start_date),
    INDEX idx_contract_end_date (contract_end_date),
    CONSTRAINT chk_contract_dates CHECK (contract_end_date > contract_start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. 주거비 기본 설정 (Housing Cost Settings)
-- ============================================
CREATE TABLE IF NOT EXISTS housing_cost_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE COMMENT '사용자 ID (users.user_no 참조, 1인당 1개만 존재)',
    rent DECIMAL(15, 2) NOT NULL DEFAULT 0 COMMENT '월세',
    maintenance DECIMAL(15, 2) NOT NULL DEFAULT 0 COMMENT '관리비',
    utilities DECIMAL(15, 2) NOT NULL DEFAULT 0 COMMENT '전기/수도/가스 예상 금액',
    payment_date TINYINT NOT NULL DEFAULT 1 COMMENT '납부일 (1~31)',
    auto_register BOOLEAN DEFAULT FALSE COMMENT '매월 자동 등록 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_no) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    CONSTRAINT chk_payment_date CHECK (payment_date >= 1 AND payment_date <= 31)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. 월별 주거비 기록 (Monthly Housing Records)
-- ============================================
CREATE TABLE IF NOT EXISTS monthly_housing_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '사용자 ID (users.user_no 참조)',
    year INT NOT NULL COMMENT '연도',
    month TINYINT NOT NULL COMMENT '월 (1~12)',
    rent DECIMAL(15, 2) NOT NULL DEFAULT 0 COMMENT '월세',
    maintenance DECIMAL(15, 2) NOT NULL DEFAULT 0 COMMENT '관리비',
    utilities DECIMAL(15, 2) NOT NULL DEFAULT 0 COMMENT '전기/수도/가스',
    payment_date TINYINT NOT NULL COMMENT '납부일 (1~31)',
    paid BOOLEAN DEFAULT FALSE COMMENT '납부 완료 여부',
    paid_at TIMESTAMP NULL COMMENT '납부 완료 일시',
    notes TEXT COMMENT '메모',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_no) ON DELETE CASCADE,
    UNIQUE KEY uk_user_year_month (user_id, year, month),
    INDEX idx_user_id (user_id),
    INDEX idx_year_month (year, month),
    CONSTRAINT chk_month_range CHECK (month >= 1 AND month <= 12),
    CONSTRAINT chk_payment_date_range CHECK (payment_date >= 1 AND payment_date <= 31)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. 거주 중 이슈 기록 (Residency Defect Issues)
-- ============================================
CREATE TABLE IF NOT EXISTS residency_defect_issues (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '사용자 ID (users.user_no 참조)',
    title VARCHAR(200) NOT NULL COMMENT '이슈 제목',
    image_url MEDIUMTEXT NOT NULL COMMENT '이슈 사진 URL (base64 데이터 URL 지원, 최대 16MB)',
    issue_date DATE NOT NULL COMMENT '이슈 발생/접수 날짜',
    status VARCHAR(20) NOT NULL DEFAULT 'RECEIVED' COMMENT '상태: IN_PROGRESS, RECEIVED, COMPLETED, REJECTED',
    memo TEXT COMMENT '메모',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_no) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_issue_date (issue_date),
    CONSTRAINT chk_status CHECK (status IN ('IN_PROGRESS', 'RECEIVED', 'COMPLETED', 'REJECTED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 테이블 요약
-- ============================================
-- 1. entry_status_records      - 입주 상태 기록 (MoveOutPage와 공유)
-- 2. housing_contracts         - 거주 계약 기간 (시작일/종료일)
-- 3. housing_cost_settings     - 주거비 기본 설정 (월세, 관리비 등)
-- 4. monthly_housing_records   - 월별 주거비 기록
-- 5. residency_defect_issues   - 거주 중 이슈 기록
--
-- 모든 테이블은 users 테이블의 user_no를 참조합니다.
-- housing_contracts와 housing_cost_settings는 사용자당 1개만 존재합니다 (UNIQUE 제약).
-- monthly_housing_records는 사용자별 연도+월 조합이 중복되지 않습니다 (UNIQUE 제약).
