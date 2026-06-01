package com.interview.platform.repository;

import com.interview.platform.entity.Job;
import com.interview.platform.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findByPostedByOrderByCreatedAtDesc(User postedBy);
    List<Job> findAllByOrderByCreatedAtDesc();
}
