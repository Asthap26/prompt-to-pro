package com.interview.platform.controller;

import com.interview.platform.entity.InterviewResponse;
import com.interview.platform.entity.InterviewSession;
import com.interview.platform.entity.Question;
import com.interview.platform.entity.User;
import com.interview.platform.entity.Job;
import com.interview.platform.gateway.NlpGateway;
import com.interview.platform.repository.JobRepository;
import com.interview.platform.repository.InterviewSessionRepository;
import com.interview.platform.service.AnalyticsService;
import com.interview.platform.service.EvaluationService;
import com.interview.platform.service.InterviewService;
import com.interview.platform.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;
    private final UserService userService;
    private final EvaluationService evaluationService;
    private final AnalyticsService analyticsService;
    private final NlpGateway nlpGateway;
    private final JobRepository jobRepository;
    private final InterviewSessionRepository sessionRepository;

    public InterviewController(InterviewService interviewService, UserService userService, EvaluationService evaluationService, AnalyticsService analyticsService, NlpGateway nlpGateway, JobRepository jobRepository, InterviewSessionRepository sessionRepository) {
        this.interviewService = interviewService;
        this.userService = userService;
        this.evaluationService = evaluationService;
        this.analyticsService = analyticsService;
        this.nlpGateway = nlpGateway;
        this.jobRepository = jobRepository;
        this.sessionRepository = sessionRepository;
    }

    @PostMapping("/initialize")
    public ResponseEntity<?> initialize(
            @RequestParam(value = "company", required = false) String company,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "jobId", required = false) String jobId,
            @RequestParam(value = "resume", required = false) MultipartFile resume,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
        
        Job job = null;
        String finalCompany = company;
        String finalRole = role;

        if (jobId != null && !jobId.isBlank()) {
            job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new IllegalArgumentException("Job position not found"));
            finalCompany = job.getCompanyName();
            finalRole = job.getTitle();
        }

        if (finalCompany == null || finalCompany.isBlank() || finalRole == null || finalRole.isBlank()) {
            return ResponseEntity.badRequest().body("Company name and target role must be specified or derived from a job position");
        }

        InterviewSession session = interviewService.initializeSession(user, finalCompany, finalRole, resume, job);
        return ResponseEntity.ok(session);
    }

    @GetMapping
    public ResponseEntity<List<InterviewSession>> getSessions(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
        
        return ResponseEntity.ok(interviewService.getSessionsForUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSession(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
        
        return interviewService.getSessionById(id)
                .map(session -> {
                    if (!session.getUser().getId().equals(user.getId())) {
                        return ResponseEntity.status(403).body("Access denied to this session");
                    }
                    return ResponseEntity.ok(session);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/responses/submit")
    public ResponseEntity<?> submitResponse(
            @PathVariable("id") String sessionId,
            @RequestParam("questionId") String questionId,
            @RequestParam(value = "audio", required = false) MultipartFile audioFile,
            @RequestParam(value = "transcript", required = false) String customTranscript,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            User user = userService.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            InterviewSession session = interviewService.getSessionById(sessionId)
                    .orElseThrow(() -> new IllegalArgumentException("Session not found"));

            if (!session.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Access denied to this session");
            }

            Question question = session.getQuestions().stream()
                    .filter(q -> q.getId().equals(questionId))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Question not found in this session"));

            String transcript = "";
            if (customTranscript != null && !customTranscript.isBlank()) {
                transcript = customTranscript;
            } else if (audioFile != null && !audioFile.isEmpty()) {
                byte[] audioBytes = audioFile.getBytes();
                transcript = nlpGateway.transcribeAudio(audioBytes);
            } else {
                return ResponseEntity.badRequest().body("Either audio file or text transcript must be provided");
            }

            InterviewResponse response = evaluationService.evaluateResponse(question, transcript);

            // Update session question list
            boolean allAnswered = true;
            for (Question q : session.getQuestions()) {
                if (q.getId().equals(questionId)) {
                    q.setResponse(response);
                }
                if (q.getResponse() == null) {
                    allAnswered = false;
                }
            }

            if (allAnswered) {
                analyticsService.generateReport(session);
            } else {
                sessionRepository.save(session);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to submit response: " + e.getMessage());
        }
    }
}
