package com.homematch.domain.moveout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoveoutPhotoRepository extends JpaRepository<MoveoutPhoto, Long> {
    @Query("SELECT m FROM MoveoutPhoto m JOIN m.user u WHERE u.user_no = :userNo ORDER BY m.takenDate DESC")
    List<MoveoutPhoto> findByUser_User_noOrderByTakenDateDesc(@Param("userNo") Integer userNo);
}
