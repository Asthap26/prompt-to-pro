package com.interview.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "company_profiles")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CompanyProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String promptInjection;

    // Constructors
    public CompanyProfile() {}

    public CompanyProfile(Long id, String name, String slug, String promptInjection) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.promptInjection = promptInjection;
    }

    // Builder Pattern
    public static CompanyProfileBuilder builder() {
        return new CompanyProfileBuilder();
    }

    public static class CompanyProfileBuilder {
        private Long id;
        private String name;
        private String slug;
        private String promptInjection;

        public CompanyProfileBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CompanyProfileBuilder name(String name) {
            this.name = name;
            return this;
        }

        public CompanyProfileBuilder slug(String slug) {
            this.slug = slug;
            return this;
        }

        public CompanyProfileBuilder promptInjection(String promptInjection) {
            this.promptInjection = promptInjection;
            return this;
        }

        public CompanyProfile build() {
            return new CompanyProfile(id, name, slug, promptInjection);
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getPromptInjection() {
        return promptInjection;
    }

    public void setPromptInjection(String promptInjection) {
        this.promptInjection = promptInjection;
    }
}
