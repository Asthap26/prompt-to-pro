package com.interview.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "jobs")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Job {

    @Id
    private String id;

    private String title;

    private String companyName;

    private String type; // EMPLOYEE or INTERN

    private String description;

    private String skillsRequired; // comma-separated values

    @DBRef(lazy = true)
    @JsonIgnoreProperties({"passwordHash", "role", "authorities"})
    private User postedBy;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public Job() {}

    public Job(String id, String title, String companyName, String type, String description, String skillsRequired, User postedBy, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.companyName = companyName;
        this.type = type;
        this.description = description;
        this.skillsRequired = skillsRequired;
        this.postedBy = postedBy;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    // Builder
    public static JobBuilder builder() {
        return new JobBuilder();
    }

    public static class JobBuilder {
        private String id;
        private String title;
        private String companyName;
        private String type;
        private String description;
        private String skillsRequired;
        private User postedBy;
        private LocalDateTime createdAt;

        public JobBuilder id(String id) {
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
    public String getId() {
        return id;
    }

    public void setId(String id) {
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
