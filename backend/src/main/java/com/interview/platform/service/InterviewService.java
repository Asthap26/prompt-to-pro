package com.interview.platform.service;

import com.interview.platform.entity.*;
import com.interview.platform.gateway.NlpGateway;
import com.interview.platform.repository.CompanyProfileRepository;
import com.interview.platform.repository.InterviewSessionRepository;
import com.interview.platform.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class InterviewService {

    private final InterviewSessionRepository sessionRepository;
    private final QuestionRepository questionRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final ResumeParserService resumeParserService;
    private final NlpGateway nlpGateway;

    public InterviewService(InterviewSessionRepository sessionRepository, QuestionRepository questionRepository, CompanyProfileRepository companyProfileRepository, ResumeParserService resumeParserService, NlpGateway nlpGateway) {
        this.sessionRepository = sessionRepository;
        this.questionRepository = questionRepository;
        this.companyProfileRepository = companyProfileRepository;
        this.resumeParserService = resumeParserService;
        this.nlpGateway = nlpGateway;
    }

    @Transactional
    public InterviewSession initializeSession(User user, String company, String targetRole, MultipartFile resumeFile, Job job) {
        String resumeText = resumeParserService.extractText(resumeFile);
        List<String> skills = resumeParserService.extractSkills(resumeText);
        if ((skills == null || skills.isEmpty()) && job != null && job.getSkillsRequired() != null) {
            skills = java.util.Arrays.asList(job.getSkillsRequired().split("\\s*,\\s*"));
        }

        String slug = company.toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-");
        Optional<CompanyProfile> companyProfile = companyProfileRepository.findBySlug(slug);
        String companyPrompt = companyProfile.map(CompanyProfile::getPromptInjection).orElse("");

        List<String> questionContents = nlpGateway.generateQuestions(skills, companyPrompt, targetRole);

        InterviewSession session = InterviewSession.builder()
                .company(company)
                .targetRole(targetRole)
                .status(SessionStatus.INITIALIZED)
                .user(user)
                .job(job)
                .build();

        InterviewSession savedSession = sessionRepository.save(session);

        List<Question> questions = new ArrayList<>();
        for (int i = 0; i < questionContents.size(); i++) {
            Question question = Question.builder()
                    .content(questionContents.get(i))
                    .type(i % 2 == 0 ? QuestionType.TECHNICAL : QuestionType.BEHAVIORAL)
                    .orderIndex(i)
                    .interviewSession(savedSession)
                    .build();
            questions.add(questionRepository.save(question));
        }

        savedSession.setQuestions(questions);
        return savedSession;
    }

    public List<InterviewSession> getSessionsForUser(User user) {
        return sessionRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Optional<InterviewSession> getSessionById(Long id) {
        return sessionRepository.findById(id);
    }
}
