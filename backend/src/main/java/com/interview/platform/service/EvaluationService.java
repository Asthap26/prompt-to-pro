package com.interview.platform.service;

import com.interview.platform.entity.EmotionVector;
import com.interview.platform.entity.InterviewResponse;
import com.interview.platform.entity.Question;
import com.interview.platform.gateway.NlpGateway;
import com.interview.platform.repository.InterviewResponseRepository;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class EvaluationService {

    private final InterviewResponseRepository responseRepository;
    private final NlpGateway nlpGateway;

    public EvaluationService(InterviewResponseRepository responseRepository, NlpGateway nlpGateway) {
        this.responseRepository = responseRepository;
        this.nlpGateway = nlpGateway;
    }

    public InterviewResponse evaluateResponse(Question question, String transcript) {
        String[] fillers = {"um", "uh", "like", "basically", "actually", "honestly", "so"};
        int fillerCount = 0;
        
        for (String filler : fillers) {
            Pattern pattern = Pattern.compile("\\b" + Pattern.quote(filler) + "\\b", Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(transcript);
            while (matcher.find()) {
                fillerCount++;
            }
        }

        int confidence = Math.max(40, 100 - (fillerCount * 8));

        EmotionVector emotion = nlpGateway.analyzeSentiment(transcript);

        if (emotion == EmotionVector.ANXIOUS) {
            confidence = Math.max(40, confidence - 15);
        } else if (emotion == EmotionVector.ENTHUSIASTIC) {
            confidence = Math.min(100, confidence + 5);
        }

        InterviewResponse response = InterviewResponse.builder()
                .transcript(transcript)
                .confidenceScore(confidence)
                .emotionVector(emotion)
                .fillerWordCount(fillerCount)
                .question(question)
                .build();

        return responseRepository.save(response);
    }
}
