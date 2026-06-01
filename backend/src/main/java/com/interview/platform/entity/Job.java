package com.interview.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String type; // EMPLOYEE or INTERN

    @Column(length = 2000, nullable = false)
    private String description;

    @Column(nullable = false)
    private String skillsRequired; // comma-separated values

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id", nullable = false)
    @JsonIgnoreProperties({"interviewSessions", "passwordHash", "role", "authorities"})
    private User postedBy;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Constructors
    public Job() {}

    public Job(Long id, String title, String companyName, String type, String description, String skillsRequired, User postedBy, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.companyName = companyName;
        this.type = type;
        this.description = description;
        this.skillsRequired = skillsRequired;
        this.postedBy = postedBy;
        this.createdAt = createdAt;
    }

    // Builder
    public static JobBuilder builder() {
        return new JobBuilder();
    }

    public static class JobBuilder {
        private Long id;
        private String title;
        private String companyName;
        private String type;
        private String description;
        private String skillsRequired;
        private User postedBy;
        private LocalDateTime createdAt;

        public JobBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public JobBuilder title(String title) {
            this.title = title;
            return this;
        }

        public JobBuilder companyName(String companyName) {
            this.companyName = companyName;
            return this;
        }

        public JobBuilder type(String type) {
            this.type = type;
            return this;
        }

        public JobBuilder description(String description) {
            this.description = description;
            return this;
        }

        public JobBuilder skillsRequired(String skillsRequired) {
            this.skillsRequired = skillsRequired;
            return this;
        }

        public JobBuilder postedBy(User postedBy) {
            this.postedBy = postedBy;
            return this;
        }

        public JobBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Job build() {
            return new Job(id, title, companyName, type, description, skillsRequired, postedBy, createdAt);
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSkillsRequired() {
        return skillsRequired;
    }

    public void setSkillsRequired(String skillsRequired) {
        this.skillsRequired = skillsRequired;
    }

    public User getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(User postedBy) {
        this.postedBy = postedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
