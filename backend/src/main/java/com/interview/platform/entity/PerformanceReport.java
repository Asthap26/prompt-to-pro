package com.interview.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PerformanceReport {

    private String id;

    private Integer overallScore;

    private String suggestions;

    private String skillBreakdown; // JSON string containing dimensions

    // Constructors
    public PerformanceReport() {}

    public PerformanceReport(String id, Integer overallScore, String suggestions, String skillBreakdown) {
        this.id = id;
        this.overallScore = overallScore;
        this.suggestions = suggestions;
        this.skillBreakdown = skillBreakdown;
    }

    // Builder Pattern
    public static PerformanceReportBuilder builder() {
        return new PerformanceReportBuilder();
    }

    public static class PerformanceReportBuilder {
        private String id;
        private Integer overallScore;
        private String suggestions;
        private String skillBreakdown;

        public PerformanceReportBuilder id(String id) {
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

        public PerformanceReport build() {
            return new PerformanceReport(id, overallScore, suggestions, skillBreakdown);
        }
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
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
}
