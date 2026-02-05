# AI_HomeMatch DB ERD 정의서

---

## 1. 논리적 ERD (Logical ERD)

### 1.1 엔티티 및 관계 (개념적 모델)

| 엔티티(한글) | 엔티티(영문) | 설명 | 관계 |
|-------------|-------------|------|------|
| 사용자 | User | 회원 정보(이메일, 비밀번호, 역할 등) | - |
| 매물 | Listing | 부동산 매물 정보(주소, 가격, 면적 등) | 독립 |
| 등기부등본 분석 문서 | DeedAnalysisDocument | OCR/AI 분석 결과, 원본 파일 메타 | 사용자 1:N |
| 사용자 동의 | UserConsent | 약관/개인정보동의 이력 | 사용자 1:N |
| 입주 상태 기록 | EntryStatusRecord | 입주 시점 집 상태 사진 | 사용자 1:N |
| 퇴실 체크리스트 | MoveoutChecklist | 퇴실 전 필수 체크 항목 | 사용자 1:N |
| 보증금 관리 | DepositManagement | 보증금 정산/반환 상태 | 사용자 1:N |
| 보증금 반환 이력 | DepositReturnHistory | 내용증명, 지급명령 등 이벤트 | 보증금관리 1:N |
| 퇴실 사진 | MoveoutPhoto | 퇴실 직전 집 상태 증빙 사진 | 사용자 1:N |
| 분쟁 기록 | DisputeRecord | 보증금·시설 분쟁 내용 | 사용자 1:N |
| 거주 계약 | HousingContract | 계약 기간(입주일~종료일) | 사용자 1:1 |
| 주거비 설정 | HousingCostSettings | 월세/관리비/공과금 기본값 | 사용자 1:1 |
| 월별 주거비 기록 | MonthlyHousingRecord | 월별 납부 내역 | 사용자 1:N |
| 하자 신고 | ResidencyDefectIssue | 입주 하자 사진·상태 | 사용자 1:N |
| 하자 이슈 타임라인 | ResidencyIssueTimeline | 하자 처리 진행 이벤트 | 하자신고 1:N |
| 거주 합의 기록 | ResidencyAgreementRecord | 임대인/관리자와 소통 기록 | 사용자 1:N, 하자신고 N:1(선택) |
| 채팅 세션 | ChatSession | 대화 세션 | 사용자 1:N |
| 채팅 메시지 | ChatMessage | 세션 내 메시지 | 채팅세션 1:N |
| 계약서 | Contract | 계약서 파일 메타·특약 수 | 사용자 1:N |
| 특약 분석 결과 | ClauseAnalysisResult | 특약별 AI 분석(위험도, 근거 등) | 계약서 1:N |
| 계약서 검토 | ContractReview | 계약서 검토 요청(파일경로, 특약) | 사용자 1:N |

### 1.2 논리적 ERD 다이어그램 (텍스트)

```
[사용자] 1───N [등기부등본 분석 문서]
[사용자] 1───N [사용자 동의]
[사용자] 1───N [입주 상태 기록]
[사용자] 1───N [퇴실 체크리스트]
[사용자] 1───N [보증금 관리] 1───N [보증금 반환 이력]
[사용자] 1───N [퇴실 사진]
[사용자] 1───N [분쟁 기록]
[사용자] 1───1 [거주 계약]
[사용자] 1───1 [주거비 설정]
[사용자] 1───N [월별 주거비 기록]
[사용자] 1───N [하자 신고] 1───N [하자 이슈 타임라인]
[사용자] 1───N [거주 합의 기록] N───1 [하자 신고] (선택)
[사용자] 1───N [채팅 세션] 1───N [채팅 메시지]
[사용자] 1───N [계약서] 1───N [특약 분석 결과]
[사용자] 1───N [계약서 검토]

[매물] (독립, FK 없음)
```

---

## 2. 물리적 ERD (Physical ERD)

### 2.1 테이블 목록 및 컬럼

#### users (사용자)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| user_no | INT | N | AUTO | PK |
| email | VARCHAR(255) | N | - | UK |
| password | VARCHAR(255) | N | - | |
| name | VARCHAR(255) | N | - | |
| role | VARCHAR(30) | N | - | USER/HOUSEOWNER/ADMIN |
| phone | VARCHAR(30) | Y | - | |
| nickname | VARCHAR(30) | N | - | |
| updated_at | DATETIME | N | - | |

---

#### listings (매물)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| listing_id | INT | N | AUTO | PK |
| owner | VARCHAR(100) | N | - | |
| title | VARCHAR(200) | N | - | |
| address | VARCHAR(200) | N | - | |
| image_url | VARCHAR(512) | Y | - | |
| sub_image_url_1~3 | VARCHAR(512) | Y | - | |
| lat, lng | DECIMAL(10,7) | Y | - | |
| price_deposit | BIGINT | N | - | |
| lease_type | VARCHAR(20) | N | - | 월/전세 |
| price_rent | BIGINT | Y | - | |
| m_cost | BIGINT | Y | - | |
| area_m2 | DECIMAL(10,2) | N | - | |
| built_year | INT | Y | - | |
| floor, floor_building | INT | Y | - | |
| rooms, bathrooms | INT | Y | - | |
| parking | BOOLEAN | Y | FALSE | |
| move_in_date | DATE | Y | - | |
| created_at | DATETIME | N | CURRENT_TIMESTAMP | |

**인덱스:** idx_address, idx_lease_type, idx_price_deposit, idx_created_at

---

#### deed_analysis_documents (등기부등본 분석 문서)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | N | AUTO | PK |
| user_id | INT | N | - | FK → users(user_no) |
| source_filename | VARCHAR(255) | Y | - | |
| source_mime_type | VARCHAR(100) | Y | - | |
| source_file_path | VARCHAR(512) | Y | - | images 폴더 상대경로 |
| source_file_blob | LONGBLOB | Y | - | (ALTER 추가) |
| source_file_size | BIGINT | Y | - | (ALTER 추가) |
| extracted_text | LONGTEXT | Y | - | OCR 추출 텍스트 |
| structured_json | LONGTEXT | Y | - | |
| sections_json | LONGTEXT | Y | - | |
| risk_flags_json | LONGTEXT | Y | - | |
| check_items_json | LONGTEXT | Y | - | |
| explanation | LONGTEXT | Y | - | |
| archived | TINYINT(1) | N | 0 | |
| deleted_at | DATETIME | Y | - | Soft Delete |
| created_at | DATETIME | N | CURRENT_TIMESTAMP | |
| updated_at | DATETIME | N | ON UPDATE | |

**인덱스:** idx_deed_doc_user_created, idx_deed_doc_user_archived, idx_deed_doc_deleted_at

---

#### user_consents (사용자 동의)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| consent_id | INT | N | AUTO | PK |
| user_no | INT | N | - | FK → users(user_no) |
| consent_type | VARCHAR(50) | N | - | TERMS/PRIVACY/DATA_STORE 등 |
| consent_content | TEXT | N | - | |
| content_hash | CHAR(64) | N | - | SHA-256 |
| version | VARCHAR(20) | N | - | |
| agreed_at | DATETIME | N | CURRENT_TIMESTAMP | |
| withdrawn_at | DATETIME | Y | - | NULL=유효 |

---

#### entry_status_records (입주 상태 기록)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | N | AUTO | PK |
| user_id | INT | N | - | FK → users(user_no) |
| image_url | MEDIUMTEXT | N | - | |
| record_type | VARCHAR(50) | N | - | |
| record_date | DATE | N | - | |
| description | TEXT | Y | - | |
| created_at | TIMESTAMP | N | CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | N | ON UPDATE | |

**인덱스:** idx_entry_status_user, idx_entry_status_user_type, idx_entry_status_date

---

#### moveout_checklists (퇴실 체크리스트)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | N | AUTO | PK |
| user_id | INT | N | - | FK → users(user_no) |
| checklist_type | VARCHAR(20) | N | - | MOVE_OUT/RESTORATION |
| item_name | VARCHAR(100) | N | - | |
| is_completed | BOOLEAN | N | FALSE | |
| completed_at | TIMESTAMP | Y | - | |
| notes | TEXT | Y | - | |
| created_at | TIMESTAMP | N | CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | N | ON UPDATE | |

---

#### deposit_managements (보증금 관리)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | N | AUTO | PK |
| user_id | INT | N | - | FK → users(user_no) |
| deposit_amount | DECIMAL(15,2) | N | - | |
| moveout_date | DATE | N | - | |
| status | VARCHAR(20) | N | PENDING | PENDING/RETURNED 등 |
| expected_return_date | DATE | Y | - | |
| actual_return_date | DATE | Y | - | |
| returned_amount | DECIMAL(15,2) | Y | - | |
| deduction_amount | DECIMAL(15,2) | N | 0 | |
| deduction_reason | TEXT | Y | - | |
| notes | TEXT | Y | - | |
| created_at | TIMESTAMP | N | CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | N | ON UPDATE | |

---

#### deposit_return_history (보증금 반환 이력)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | N | AUTO | PK |
| deposit_management_id | BIGINT | N | - | FK → deposit_managements(id) |
| action_type | VARCHAR(50) | N | - | NOTICE_SENT 등 |
| action_date | DATE | N | - | |
| description | TEXT | Y | - | |
| document_url | VARCHAR(500) | Y | - | |
| created_at | TIMESTAMP | N | CURRENT_TIMESTAMP | |

---

#### moveout_photos (퇴실 사진)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | N | AUTO | PK |
| user_id | INT | N | - | FK → users(user_no) |
| photo_url | VARCHAR(500) | N | - | |
| photo_type | VARCHAR(50) | Y | - | |
| taken_date | DATE | N | - | |
| description | TEXT | Y | - | |
| created_at | TIMESTAMP | N | CURRENT_TIMESTAMP | |

---

#### dispute_records (분쟁 기록)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | N | AUTO | PK |
| user_id | INT | N | - | FK → users(user_no) |
| dispute_type | VARCHAR(50) | N | - | |
| dispute_date | DATE | N | - | |
| description | TEXT | N | - | |
| status | VARCHAR(20) | N | PENDING | |
| resolution | TEXT | Y | - | |
| related_photos | JSON | Y | - | |
| created_at | TIMESTAMP | N | CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | N | ON UPDATE | |

---

#### housing_contracts (거주 계약)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | N | AUTO | PK |
| user_id | INT | N | - | FK → users(user_no) UNIQUE |
| contract_start_date | DATE | N | - | |
| contract_end_date | DATE | N | - | CHECK(end>start) |
| contract_duration_months | INT | Y | - | |
| notes | TEXT | Y | - | |
| created_at | TIMESTAMP | N | CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | N | ON UPDATE | |

---

#### housing_cost_settings (주거비 설정)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | N | AUTO | PK |
| user_id | INT | N | - | FK → users(user_no) UNIQUE |
| rent | DECIMAL(15,2) | N | 0 | |
| maintenance | DECIMAL(15,2) | N | 0 | |
| utilities | DECIMAL(15,2) | N | 0 | |
| payment_date | TINYINT | N | - | CHECK(1~31) |
| auto_register | BOOLEAN | N | FALSE | |
| created_at | TIMESTAMP | N | CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | N | ON UPDATE | |

---

#### monthly_housing_records (월별 주거비 기록)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | N | AUTO | PK |
| user_id | INT | N | - | FK → users(user_no) |
| year | INT | N | - | |
| month | TINYINT | N | - | CHECK(1~12) |
| rent | DECIMAL(15,2) | N | 0 | |
| maintenance | DECIMAL(15,2) | N | 0 | |
| utilities | DECIMAL(15,2) | N | 0 | |
| payment_date | TINYINT | N | - | CHECK(1~31) |
| paid | BOOLEAN | N | FALSE | |
| paid_at | TIMESTAMP | Y | - | |
| notes | TEXT | Y | - | |
| created_at | TIMESTAMP | N | CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | N | ON UPDATE | |

**UNIQUE:** (user_id, year, month)

---

#### residency_defect_issues (하자 신고)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | N | AUTO | PK |
| user_id | INT | N | - | FK → users(user_no) |
| title | VARCHAR(200) | N | - | |
| image_url | MEDIUMTEXT | N | - | |
| issue_date | DATE | N | - | |
| status | ENUM | N | RECEIVED | RECEIVED/IN_PROGRESS/COMPLETED/REJECTED |
| memo | TEXT | Y | - | |
| created_at | TIMESTAMP | N | CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | N | ON UPDATE | |

---

#### residency_issue_timelines (하자 이슈 타임라인)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | N | AUTO | PK |
| defect_issue_id | BIGINT | N | - | FK → residency_defect_issues(id) |
| event_type | VARCHAR(20) | N | - | CREATED/NOTIFIED/PROMISED 등 |
| note | TEXT | Y | - | |
| created_at | TIMESTAMP | N | CURRENT_TIMESTAMP | |

---

#### residency_agreement_records (거주 합의 기록)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | N | AUTO | PK |
| user_id | INT | N | - | FK → users(user_no) |
| defect_issue_id | BIGINT | Y | - | FK → residency_defect_issues(id) |
| counterpart | VARCHAR(20) | N | - | LANDLORD/MANAGER |
| communication_type | VARCHAR(20) | N | - | CALL/MESSAGE/VISIT |
| summary | TEXT | N | - | |
| created_at | TIMESTAMP | N | CURRENT_TIMESTAMP | |

---

#### chat_sessions (채팅 세션)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| session_id | INT | N | AUTO | PK |
| user_no | INT | N | - | FK → users(user_no) |
| created_at | DATETIME | N | CURRENT_TIMESTAMP | |

---

#### chat_messages (채팅 메시지)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| message_id | INT | N | AUTO | PK |
| session_id | INT | N | - | FK → chat_sessions(session_id) |
| role | VARCHAR(20) | N | - | user/assistant/system |
| content | TEXT | N | - | |
| created_at | DATETIME | N | CURRENT_TIMESTAMP | |

---

#### contracts (계약서)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| contract_id | BIGINT UNSIGNED | N | AUTO | PK |
| user_id | BIGINT UNSIGNED | N | - | |
| file_name | VARCHAR(255) | Y | - | |
| mime_type | VARCHAR(100) | Y | - | |
| file_size_bytes | BIGINT | Y | - | |
| uploaded_at | DATETIME | Y | - | |
| contract_alias | VARCHAR(100) | N | - | |
| special_term_count | INT | N | 0 | |
| created_at | DATETIME | N | CURRENT_TIMESTAMP | |
| updated_at | DATETIME | N | ON UPDATE | |

---

#### clause_analysis_results (특약 분석 결과)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| clause_analysis_id | BIGINT UNSIGNED | N | AUTO | PK |
| contract_id | BIGINT UNSIGNED | N | - | FK → contracts(contract_id) |
| clause_index | INT | N | - | |
| clause_text | LONGTEXT | N | - | |
| level | ENUM | N | - | SAFE/NEEDS_UNDERSTANDING/NEEDS_REVIEW |
| conclusion | TEXT | Y | - | |
| risk_points | JSON | Y | - | |
| mediation_summaries | TEXT | Y | - | |
| mediation_case_ids | JSON | Y | - | |
| precedent_summaries | TEXT | Y | - | |
| precedent_case_ids | JSON | Y | - | |
| precedent_evidence | JSON | Y | - | |
| law_summaries | TEXT | Y | - | |
| law_ids | JSON | Y | - | |
| recommended_clause_text | LONGTEXT | Y | - | |
| created_at | DATETIME | N | CURRENT_TIMESTAMP | |

**UNIQUE:** (contract_id, clause_index)

---

#### contract_reviews (계약서 검토)
| 컬럼명 | 타입 | NULL | 기본값 | 설명 |
|--------|------|------|--------|------|
| id | BIGINT | N | AUTO | PK |
| user_id | INT | N | - | FK → users(user_no) |
| file_path | JSON | Y | - | 파일 경로 배열 |
| special_terms | JSON | Y | - | |
| created_at | DATETIME | N | CURRENT_TIMESTAMP | |
| updated_at | DATETIME | Y | - | |

---

### 2.2 FK 관계 요약

| 자식 테이블 | FK 컬럼 | 부모 테이블 | 부모 컬럼 |
|------------|---------|-------------|-----------|
| deed_analysis_documents | user_id | users | user_no |
| user_consents | user_no | users | user_no |
| entry_status_records | user_id | users | user_no |
| moveout_checklists | user_id | users | user_no |
| deposit_managements | user_id | users | user_no |
| deposit_return_history | deposit_management_id | deposit_managements | id |
| moveout_photos | user_id | users | user_no |
| dispute_records | user_id | users | user_no |
| housing_contracts | user_id | users | user_no |
| housing_cost_settings | user_id | users | user_no |
| monthly_housing_records | user_id | users | user_no |
| residency_defect_issues | user_id | users | user_no |
| residency_issue_timelines | defect_issue_id | residency_defect_issues | id |
| residency_agreement_records | user_id | users | user_no |
| residency_agreement_records | defect_issue_id | residency_defect_issues | id |
| chat_sessions | user_no | users | user_no |
| chat_messages | session_id | chat_sessions | session_id |
| clause_analysis_results | contract_id | contracts | contract_id |
| contract_reviews | user_id | users | user_no |

---

*문서 버전: 1.0 | 기준: create_tables.sql, JPA Entity*
