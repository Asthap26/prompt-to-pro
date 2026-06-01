package com.interview.platform.repository;

import com.interview.platform.entity.Job;
import com.interview.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByPostedByOrderByCreatedAtDesc(User postedBy);
    List<Job> findAllByOrderByCreatedAtDesc();
}
