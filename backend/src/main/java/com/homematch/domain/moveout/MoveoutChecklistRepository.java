package com.homematch.domain.moveout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoveoutChecklistRepository extends JpaRepository<MoveoutChecklist, Long> {
    @Query("SELECT m FROM MoveoutChecklist m JOIN m.user u WHERE u.user_no = :userNo AND m.checklistType = :checklistType ORDER BY m.id")
    List<MoveoutChecklist> findByUser_User_noAndChecklistTypeOrderById(@Param("userNo") Integer userNo, @Param("checklistType") String checklistType);
    
    @Query("SELECT m FROM MoveoutChecklist m JOIN m.user u WHERE u.user_no = :userNo ORDER BY m.id")
    List<MoveoutChecklist> findByUser_User_noOrderById(@Param("userNo") Integer userNo);
    
    // 중복 체크: 같은 사용자, 같은 타입, 같은 항목명이 이미 있는지 확인
    @Query("SELECT COUNT(m) > 0 FROM MoveoutChecklist m JOIN m.user u WHERE u.user_no = :userNo AND m.checklistType = :checklistType AND m.itemName = :itemName")
    boolean existsByUser_User_noAndChecklistTypeAndItemName(@Param("userNo") Integer userNo, @Param("checklistType") String checklistType, @Param("itemName") String itemName);
}
