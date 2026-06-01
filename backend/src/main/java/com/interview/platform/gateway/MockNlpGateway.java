package com.interview.platform.gateway;

import com.interview.platform.entity.EmotionVector;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class MockNlpGateway implements NlpGateway {

    @Override
    public List<String> generateQuestions(List<String> skills, String companyPrompt, String targetRole) {
        List<String> questions = new ArrayList<>();
        String primarySkill = skills.isEmpty() ? "Software Development" : skills.get(0);
        String secondSkill = skills.size() > 1 ? skills.get(1) : "System Architecture";

        questions.add(String.format("Can you tell me about a time you designed and implemented a core system using %s, and how you ensured it met standard performance criteria?", primarySkill));
        questions.add(String.format("Imagine you are asked to lead a migration from a monolithic backend to a microservices architecture for a %s role. What steps do you prioritize?", targetRole));
        questions.add(String.format("Explain how you handle team disagreements regarding technical choices, such as selecting between MySQL and a NoSQL alternative like %s.", secondSkill));
        
        if (companyPrompt != null && !companyPrompt.isBlank()) {
            questions.add("Considering the target company's values, how do you handle client feedback that contradicts your initial technical design?");
        }
        
        return questions;
    }

    @Override
    public String transcribeAudio(byte[] audioBytes) {
        return "Honestly, in my last project, we, um, had to build a real-time messaging server. It was, like, quite difficult because we had to scale to thousands of active sessions, basically. But we resolved it using Redis.";
    }

    @Override
    public EmotionVector analyzeSentiment(String transcript) {
        if (transcript.contains("difficult") || transcript.contains("anxious") || transcript.contains("um")) {
            return EmotionVector.NEUTRAL;
        }
        return EmotionVector.PROFESSIONAL;
    }

    @Override
    public byte[] speak(String text) {
        return new byte[100];
    }
}
