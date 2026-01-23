-- 이미지 URL 길이 제한 해결을 위한 ALTER TABLE
-- base64 데이터 URL은 매우 길 수 있으므로 MEDIUMTEXT 타입으로 변경
-- MEDIUMTEXT는 최대 16MB까지 저장 가능 (TEXT는 65KB 제한)

-- 입주 상태 기록 테이블 수정
ALTER TABLE entry_status_records 
MODIFY COLUMN image_url MEDIUMTEXT NOT NULL COMMENT '이미지 파일 경로 또는 URL (base64 데이터 URL 지원)';

-- 거주 중 이슈 기록 테이블 수정
ALTER TABLE residency_defect_issues 
MODIFY COLUMN image_url MEDIUMTEXT NOT NULL COMMENT '이슈 사진 URL (base64 데이터 URL 지원)';

-- 참고: 
-- TEXT 타입: 최대 65,535 바이트 (약 65KB)
-- MEDIUMTEXT 타입: 최대 16,777,215 바이트 (약 16MB)
-- base64 인코딩된 이미지는 원본 이미지 크기의 약 1.33배입니다.
