package com.interview.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "sessions")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class InterviewSession {

    @Id
    private String id;

    private SessionStatus status;

    private String company;

    private String targetRole;

    private LocalDateTime createdAt = LocalDateTime.now();

    @DBRef(lazy = true)
    @JsonIgnoreProperties({"passwordHash", "role", "authorities"})
    private User user;

    @DBRef(lazy = true)
    @JsonIgnoreProperties({"postedBy"})
    private Job job;

    // Embedded questions list (no DBRef, stored nested in MongoDB session document)
    private List<Question> questions = new java.util.ArrayList<>();

    // Embedded performance report (no DBRef, stored nested in MongoDB session document)
    private PerformanceReport performanceReport;

    // Constructors
    public InterviewSession() {}

    public InterviewSession(String id, SessionStatus status, String company, String targetRole, LocalDateTime createdAt, User user, Job job, List<Question> questions, PerformanceReport performanceReport) {
        this.id = id;
        this.status = status;
        this.company = company;
        this.targetRole = targetRole;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
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
        private String id;
        private SessionStatus status;
        private String company;
        private String targetRole;
        private LocalDateTime createdAt;
        private User user;
        private Job job;
        private List<Question> questions = new java.util.ArrayList<>();
        private PerformanceReport performanceReport;

        public InterviewSessionBuilder id(String id) {
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
    public String getId() {
        return id;
    }

    public void setId(String id) {
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
