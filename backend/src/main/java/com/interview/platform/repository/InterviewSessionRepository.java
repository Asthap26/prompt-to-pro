package com.interview.platform.repository;

import com.interview.platform.entity.InterviewSession;
import com.interview.platform.entity.Job;
import com.interview.platform.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewSessionRepository extends MongoRepository<InterviewSession, String> {
    List<InterviewSession> findByUserOrderByCreatedAtDesc(User user);
    List<InterviewSession> findByJobOrderByCreatedAtDesc(Job job);
}
