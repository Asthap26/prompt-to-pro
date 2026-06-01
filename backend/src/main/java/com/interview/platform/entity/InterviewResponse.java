package com.interview.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "interview_responses")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class InterviewResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String transcript;

    @Column(nullable = false)
    private Integer confidenceScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmotionVector emotionVector;

    @Column(nullable = false)
    private Integer fillerWordCount;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false, unique = true)
    @JsonIgnore
    private Question question;

    // Constructors
    public InterviewResponse() {}

    public InterviewResponse(Long id, String transcript, Integer confidenceScore, EmotionVector emotionVector, Integer fillerWordCount, Question question) {
        this.id = id;
        this.transcript = transcript;
        this.confidenceScore = confidenceScore;
        this.emotionVector = emotionVector;
        this.fillerWordCount = fillerWordCount;
        this.question = question;
    }

    // Builder Pattern
    public static InterviewResponseBuilder builder() {
        return new InterviewResponseBuilder();
    }

    public static class InterviewResponseBuilder {
        private Long id;
        private String transcript;
        private Integer confidenceScore;
        private EmotionVector emotionVector;
        private Integer fillerWordCount;
        private Question question;

        public InterviewResponseBuilder id(Long id) {
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

        public InterviewResponseBuilder question(Question question) {
            this.question = question;
            return this;
        }

        public InterviewResponse build() {
            return new InterviewResponse(id, transcript, confidenceScore, emotionVector, fillerWordCount, question);
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }
}
