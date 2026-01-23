package com.homematch.domain.moveout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntryStatusRecordRepository extends JpaRepository<EntryStatusRecord, Long> {
    @Query("SELECT e FROM EntryStatusRecord e WHERE e.user.user_no = :userNo ORDER BY e.recordDate DESC")
    List<EntryStatusRecord> findByUser_User_noOrderByRecordDateDesc(@Param("userNo") Integer userNo);
}
