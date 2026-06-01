package com.interview.platform.service;

import com.interview.platform.entity.*;
import com.interview.platform.gateway.NlpGateway;
import com.interview.platform.repository.CompanyProfileRepository;
import com.interview.platform.repository.InterviewSessionRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class InterviewService {

    private final InterviewSessionRepository sessionRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final ResumeParserService resumeParserService;
    private final NlpGateway nlpGateway;

    public InterviewService(InterviewSessionRepository sessionRepository, CompanyProfileRepository companyProfileRepository, ResumeParserService resumeParserService, NlpGateway nlpGateway) {
        this.sessionRepository = sessionRepository;
        this.companyProfileRepository = companyProfileRepository;
        this.resumeParserService = resumeParserService;
        this.nlpGateway = nlpGateway;
    }

    public InterviewSession initializeSession(User user, String company, String targetRole, org.springframework.web.multipart.MultipartFile resumeFile, Job job) {
        String resumeText = resumeParserService.extractText(resumeFile);
        List<String> skills = resumeParserService.extractSkills(resumeText);
        if ((skills == null || skills.isEmpty()) && job != null && job.getSkillsRequired() != null) {
            skills = java.util.Arrays.asList(job.getSkillsRequired().split("\\s*,\\s*"));
        }

        String slug = company.toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-");
        Optional<CompanyProfile> companyProfile = companyProfileRepository.findBySlug(slug);
        String companyPrompt = companyProfile.map(CompanyProfile::getPromptInjection).orElse("");

        List<String> questionContents = nlpGateway.generateQuestions(skills, companyPrompt, targetRole);

        List<Question> questions = new ArrayList<>();
        for (int i = 0; i < questionContents.size(); i++) {
            Question question = Question.builder()
                    .id(UUID.randomUUID().toString())
                    .content(questionContents.get(i))
                    .type(i % 2 == 0 ? QuestionType.TECHNICAL : QuestionType.BEHAVIORAL)
                    .orderIndex(i)
                    .build();
            questions.add(question);
        }

        InterviewSession session = InterviewSession.builder()
                .company(company)
                .targetRole(targetRole)
                .status(SessionStatus.INITIALIZED)
                .user(user)
                .job(job)
                .questions(questions)
                .build();

        return sessionRepository.save(session);
    }

    public List<InterviewSession> getSessionsForUser(User user) {
        return sessionRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Optional<InterviewSession> getSessionById(String id) {
        return sessionRepository.findById(id);
    }
}
