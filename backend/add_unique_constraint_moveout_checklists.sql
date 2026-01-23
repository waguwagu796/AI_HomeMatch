-- moveout_checklists 테이블에 Unique 제약조건 추가
-- 같은 사용자, 같은 타입, 같은 항목명이 중복되지 않도록

-- 기존 중복 데이터가 있다면 먼저 삭제 (필요시)
-- 주의: 실행 전에 백업을 권장합니다
-- DELETE t1 FROM moveout_checklists t1
-- INNER JOIN moveout_checklists t2 
-- WHERE t1.id > t2.id 
-- AND t1.user_id = t2.user_id 
-- AND t1.checklist_type = t2.checklist_type 
-- AND t1.item_name = t2.item_name;

-- Unique 제약조건 추가
ALTER TABLE moveout_checklists
ADD CONSTRAINT uk_user_checklist_type_item 
UNIQUE (user_id, checklist_type, item_name);
