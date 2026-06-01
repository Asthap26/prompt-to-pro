package com.interview.platform.gateway;

import com.interview.platform.entity.EmotionVector;
import java.util.List;

public interface NlpGateway {
    List<String> generateQuestions(List<String> skills, String companyPrompt, String targetRole);
    String transcribeAudio(byte[] audioBytes);
    EmotionVector analyzeSentiment(String transcript);
    byte[] speak(String text);
}
