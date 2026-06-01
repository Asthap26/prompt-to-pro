package com.interview.platform.service;

import com.interview.platform.entity.*;
import com.interview.platform.repository.InterviewSessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AnalyticsService {

    private final InterviewSessionRepository sessionRepository;

    public AnalyticsService(InterviewSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    public PerformanceReport generateReport(InterviewSession session) {
        List<Question> questions = session.getQuestions();
        if (questions == null || questions.isEmpty()) {
            throw new IllegalArgumentException("Cannot generate report for session with no questions");
        }

        int totalScore = 0;
        int totalFillers = 0;
        int techCount = 0;
        int techScore = 0;
        int behCount = 0;
        int behScore = 0;
        int responseCount = 0;

        for (Question q : questions) {
            InterviewResponse r = q.getResponse();
            if (r != null) {
                responseCount++;
                totalScore += r.getConfidenceScore();
                totalFillers += r.getFillerWordCount();
                
                if (q.getType() == QuestionType.TECHNICAL) {
                    techCount++;
                    techScore += r.getConfidenceScore();
                } else {
                    behCount++;
                    behScore += r.getConfidenceScore();
                }
            }
        }

        if (responseCount == 0) {
            throw new IllegalStateException("Cannot evaluate session with zero responses");
        }

        int communicationDim = Math.max(50, 100 - (totalFillers * 5));
        double avgFillers = (double) totalFillers / responseCount;
        int pacingDim = Math.max(40, (int) (100 - (avgFillers * 12)));
        int technicalDim = techCount > 0 ? (techScore / techCount) : 80;
        int behavioralDim = behCount > 0 ? (behScore / behCount) : 80;

        int overall = (communicationDim + pacingDim + technicalDim + behavioralDim) / 4;

        StringBuilder suggestions = new StringBuilder();
        suggestions.append("### Key Insights & Tips\n\n");
        
        if (avgFillers > 2.0) {
            suggestions.append("- ⚠️ **Pacing Caution**: You used an average of ")
                    .append(String.format("%.1f", avgFillers))
                    .append(" filler words per answer. Focus on pausing intentionally rather than saying 'um' or 'basically'.\n");
        } else {
            suggestions.append("- ✨ **Great Pacing**: Your flow is structured and calm. Keep utilizing deliberate pauses to organize thoughts.\n");
        }

        if (overall < 75) {
            suggestions.append("- 💡 **STAR Method**: When answering behavioral prompts, try formatting your answers with the **STAR** framework (Situation, Task, Action, Result) to boost coherence.\n");
        } else {
            suggestions.append("- 🚀 **Strong Delivery**: You displayed authoritative tone and clear competence matching top-tier requirements.\n");
        }

        if (technicalDim < 75) {
            suggestions.append("- 💻 **Technical Depth**: Work on detailing architectural trade-offs (e.g. database selections) rather than just listing terms.\n");
        }

        String breakdownJson = String.format(
                "{\"Communication\":%d,\"Technical\":%d,\"Behavioral\":%d,\"Pacing\":%d}",
                communicationDim, technicalDim, behavioralDim, pacingDim
        );

        PerformanceReport report = PerformanceReport.builder()
                .id(UUID.randomUUID().toString())
                .overallScore(overall)
                .suggestions(suggestions.toString())
                .skillBreakdown(breakdownJson)
                .build();

        session.setStatus(SessionStatus.COMPLETED);
        session.setPerformanceReport(report);
        sessionRepository.save(session);

        return report;
    }
}
