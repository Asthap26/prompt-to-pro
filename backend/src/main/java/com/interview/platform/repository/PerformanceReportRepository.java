package com.interview.platform.repository;

import com.interview.platform.entity.PerformanceReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PerformanceReportRepository extends JpaRepository<PerformanceReport, Long> {
}
