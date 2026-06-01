package com.interview.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Question {

    private String id;

    private String content;

    private QuestionType type;

    private Integer orderIndex;

    private InterviewResponse response;

    // Constructors
    public Question() {}

    public Question(String id, String content, QuestionType type, Integer orderIndex, InterviewResponse response) {
        this.id = id;
        this.content = content;
        this.type = type;
        this.orderIndex = orderIndex;
        this.response = response;
    }

    // Builder Pattern
    public static QuestionBuilder builder() {
        return new QuestionBuilder();
    }

    public static class QuestionBuilder {
        private String id;
        private String content;
        private QuestionType type;
        private Integer orderIndex;
        private InterviewResponse response;

        public QuestionBuilder id(String id) {
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

        public QuestionBuilder response(InterviewResponse response) {
            this.response = response;
            return this;
        }

        public Question build() {
            return new Question(id, content, type, orderIndex, response);
        }
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public InterviewResponse getResponse() {
        return response;
    }

    public void setResponse(InterviewResponse response) {
        this.response = response;
    }
}
