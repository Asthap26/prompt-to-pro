package com.interview.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "questions")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2000)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;

    @Column(nullable = false)
    private Integer orderIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_session_id", nullable = false)
    @JsonIgnore
    private InterviewSession interviewSession;

    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private InterviewResponse response;

    // Constructors
    public Question() {}

    public Question(Long id, String content, QuestionType type, Integer orderIndex, InterviewSession interviewSession, InterviewResponse response) {
        this.id = id;
        this.content = content;
        this.type = type;
        this.orderIndex = orderIndex;
        this.interviewSession = interviewSession;
        this.response = response;
    }

    // Builder Pattern
    public static QuestionBuilder builder() {
        return new QuestionBuilder();
    }

    public static class QuestionBuilder {
        private Long id;
        private String content;
        private QuestionType type;
        private Integer orderIndex;
        private InterviewSession interviewSession;
        private InterviewResponse response;

        public QuestionBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public QuestionBuilder content(String content) {
            this.content = content;
            return this;
        }

        public QuestionBuilder type(QuestionType type) {
            this.type = type;
            return this;
        }

        public QuestionBuilder orderIndex(Integer orderIndex) {
            this.orderIndex = orderIndex;
            return this;
        }

        public QuestionBuilder interviewSession(InterviewSession interviewSession) {
            this.interviewSession = interviewSession;
            return this;
        }

        public QuestionBuilder response(InterviewResponse response) {
            this.response = response;
            return this;
        }

        public Question build() {
            return new Question(id, content, type, orderIndex, interviewSession, response);
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public QuestionType getType() {
        return type;
    }

    public void setType(QuestionType type) {
        this.type = type;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public InterviewSession getInterviewSession() {
        return interviewSession;
    }

    public void setInterviewSession(InterviewSession interviewSession) {
        this.interviewSession = interviewSession;
    }

    public InterviewResponse getResponse() {
        return response;
    }

    public void setResponse(InterviewResponse response) {
        this.response = response;
    }
}
