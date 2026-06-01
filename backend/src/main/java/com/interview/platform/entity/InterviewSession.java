package com.interview.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "interview_sessions")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String targetRole;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties("interviewSessions")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    @JsonIgnoreProperties({"postedBy"})
    private Job job;

    @OneToMany(mappedBy = "interviewSession", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<Question> questions = new java.util.ArrayList<>();

    @OneToOne(mappedBy = "interviewSession", cascade = CascadeType.ALL, orphanRemoval = true)
    private PerformanceReport performanceReport;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Constructors
    public InterviewSession() {}

    public InterviewSession(Long id, SessionStatus status, String company, String targetRole, LocalDateTime createdAt, User user, Job job, List<Question> questions, PerformanceReport performanceReport) {
        this.id = id;
        this.status = status;
        this.company = company;
        this.targetRole = targetRole;
        this.createdAt = createdAt;
        this.user = user;
        this.job = job;
        this.questions = questions != null ? questions : new java.util.ArrayList<>();
        this.performanceReport = performanceReport;
    }

    // Builder Pattern
    public static InterviewSessionBuilder builder() {
        return new InterviewSessionBuilder();
    }

    public static class InterviewSessionBuilder {
        private Long id;
        private SessionStatus status;
        private String company;
        private String targetRole;
        private LocalDateTime createdAt;
        private User user;
        private Job job;
        private List<Question> questions = new java.util.ArrayList<>();
        private PerformanceReport performanceReport;

        public InterviewSessionBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public InterviewSessionBuilder status(SessionStatus status) {
            this.status = status;
            return this;
        }

        public InterviewSessionBuilder company(String company) {
            this.company = company;
            return this;
        }

        public InterviewSessionBuilder targetRole(String targetRole) {
            this.targetRole = targetRole;
            return this;
        }

        public InterviewSessionBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public InterviewSessionBuilder user(User user) {
            this.user = user;
            return this;
        }

        public InterviewSessionBuilder job(Job job) {
            this.job = job;
            return this;
        }

        public InterviewSessionBuilder questions(List<Question> questions) {
            this.questions = questions;
            return this;
        }

        public InterviewSessionBuilder performanceReport(PerformanceReport performanceReport) {
            this.performanceReport = performanceReport;
            return this;
        }

        public InterviewSession build() {
            return new InterviewSession(id, status, company, targetRole, createdAt, user, job, questions, performanceReport);
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public PerformanceReport getPerformanceReport() {
        return performanceReport;
    }

    public void setPerformanceReport(PerformanceReport performanceReport) {
        this.performanceReport = performanceReport;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }
}
