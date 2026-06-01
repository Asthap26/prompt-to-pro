package com.interview.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "company_profiles")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CompanyProfile {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    @Indexed(unique = true)
    private String slug;

    private String promptInjection;

    // Constructors
    public CompanyProfile() {}

    public CompanyProfile(String id, String name, String slug, String promptInjection) {
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
        private String id;
        private String name;
        private String slug;
        private String promptInjection;

        public CompanyProfileBuilder id(String id) {
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
    public String getId() {
        return id;
    }

    public void setId(String id) {
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
