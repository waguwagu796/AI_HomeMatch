package com.homematch.domain.residency;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResidencyDefectIssueRepository extends JpaRepository<ResidencyDefectIssue, Long> {
    @Query("SELECT r FROM ResidencyDefectIssue r JOIN r.user u WHERE u.user_no = :userNo ORDER BY r.issueDate DESC, r.createdAt DESC")
    List<ResidencyDefectIssue> findByUser_User_noOrderByIssueDateDesc(@Param("userNo") Integer userNo);

    @Query("SELECT r FROM ResidencyDefectIssue r JOIN r.user u WHERE u.user_no = :userNo AND r.status = :status ORDER BY r.issueDate DESC")
    List<ResidencyDefectIssue> findByUser_User_noAndStatusOrderByIssueDateDesc(
            @Param("userNo") Integer userNo,
            @Param("status") ResidencyDefectIssue.IssueStatus status);
}
