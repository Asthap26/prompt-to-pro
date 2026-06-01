package com.interview.platform.repository;

import com.interview.platform.entity.InterviewResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewResponseRepository extends JpaRepository<InterviewResponse, Long> {
}
