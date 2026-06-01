package com.interview.platform.repository;

import com.interview.platform.entity.CompanyProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyProfileRepository extends MongoRepository<CompanyProfile, String> {
    Optional<CompanyProfile> findBySlug(String slug);
}
