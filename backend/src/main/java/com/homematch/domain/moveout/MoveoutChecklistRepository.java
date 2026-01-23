package com.homematch.domain.moveout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoveoutChecklistRepository extends JpaRepository<MoveoutChecklist, Long> {
    @Query("SELECT m FROM MoveoutChecklist m WHERE m.user.user_no = :userNo AND m.checklistType = :checklistType ORDER BY m.id")
    List<MoveoutChecklist> findByUser_User_noAndChecklistTypeOrderById(@Param("userNo") Integer userNo, @Param("checklistType") String checklistType);
    
    @Query("SELECT m FROM MoveoutChecklist m WHERE m.user.user_no = :userNo ORDER BY m.id")
    List<MoveoutChecklist> findByUser_User_noOrderById(@Param("userNo") Integer userNo);
}
