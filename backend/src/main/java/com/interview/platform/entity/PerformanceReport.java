package com.interview.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "performance_reports")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PerformanceReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer overallScore;

    @Column(columnDefinition = "TEXT")
    private String suggestions;

    @Column(columnDefinition = "TEXT")
    private String skillBreakdown; // JSON string containing dimensions

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_session_id", nullable = false, unique = true)
    @JsonIgnoreProperties("performanceReport")
    private InterviewSession interviewSession;

    // Constructors
    public PerformanceReport() {}

    public PerformanceReport(Long id, Integer overallScore, String suggestions, String skillBreakdown, InterviewSession interviewSession) {
        this.id = id;
        this.overallScore = overallScore;
        this.suggestions = suggestions;
        this.skillBreakdown = skillBreakdown;
        this.interviewSession = interviewSession;
    }

    // Builder Pattern
    public static PerformanceReportBuilder builder() {
        return new PerformanceReportBuilder();
    }

    public static class PerformanceReportBuilder {
        private Long id;
        private Integer overallScore;
        private String suggestions;
        private String skillBreakdown;
        private InterviewSession interviewSession;

        public PerformanceReportBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PerformanceReportBuilder overallScore(Integer overallScore) {
            this.overallScore = overallScore;
            return this;
        }

        public PerformanceReportBuilder suggestions(String suggestions) {
            this.suggestions = suggestions;
            return this;
        }

        public PerformanceReportBuilder skillBreakdown(String skillBreakdown) {
            this.skillBreakdown = skillBreakdown;
            return this;
        }

        public PerformanceReportBuilder interviewSession(InterviewSession interviewSession) {
            this.interviewSession = interviewSession;
            return this;
        }

        public PerformanceReport build() {
            return new PerformanceReport(id, overallScore, suggestions, skillBreakdown, interviewSession);
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Integer overallScore) {
        this.overallScore = overallScore;
    }

    public String getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(String suggestions) {
        this.suggestions = suggestions;
    }

    public String getSkillBreakdown() {
        return skillBreakdown;
    }

    public void setSkillBreakdown(String skillBreakdown) {
        this.skillBreakdown = skillBreakdown;
    }

    public InterviewSession getInterviewSession() {
        return interviewSession;
    }

    public void setInterviewSession(InterviewSession interviewSession) {
        this.interviewSession = interviewSession;
    }
}
