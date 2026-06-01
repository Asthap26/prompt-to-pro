package com.interview.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class InterviewResponse {

    private String id;

    private String transcript;

    private Integer confidenceScore;

    private EmotionVector emotionVector;

    private Integer fillerWordCount;

    // Constructors
    public InterviewResponse() {}

    public InterviewResponse(String id, String transcript, Integer confidenceScore, EmotionVector emotionVector, Integer fillerWordCount) {
        this.id = id;
        this.transcript = transcript;
        this.confidenceScore = confidenceScore;
        this.emotionVector = emotionVector;
        this.fillerWordCount = fillerWordCount;
    }

    // Builder Pattern
    public static InterviewResponseBuilder builder() {
        return new InterviewResponseBuilder();
    }

    public static class InterviewResponseBuilder {
        private String id;
        private String transcript;
        private Integer confidenceScore;
        private EmotionVector emotionVector;
        private Integer fillerWordCount;

        public InterviewResponseBuilder id(String id) {
            this.id = id;
            return this;
        }

        public InterviewResponseBuilder transcript(String transcript) {
            this.transcript = transcript;
            return this;
        }

        public InterviewResponseBuilder confidenceScore(Integer confidenceScore) {
            this.confidenceScore = confidenceScore;
            return this;
        }

        public InterviewResponseBuilder emotionVector(EmotionVector emotionVector) {
            this.emotionVector = emotionVector;
            return this;
        }

        public InterviewResponseBuilder fillerWordCount(Integer fillerWordCount) {
            this.fillerWordCount = fillerWordCount;
            return this;
        }

        public InterviewResponse build() {
            return new InterviewResponse(id, transcript, confidenceScore, emotionVector, fillerWordCount);
        }
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTranscript() {
        return transcript;
    }

    public void setTranscript(String transcript) {
        this.transcript = transcript;
    }

    public Integer getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Integer confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public EmotionVector getEmotionVector() {
        return emotionVector;
    }

    public void setEmotionVector(EmotionVector emotionVector) {
        this.emotionVector = emotionVector;
    }

    public Integer getFillerWordCount() {
        return fillerWordCount;
    }

    public void setFillerWordCount(Integer fillerWordCount) {
        this.fillerWordCount = fillerWordCount;
    }
}
