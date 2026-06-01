package com.interview.platform.controller;

import com.interview.platform.entity.InterviewSession;
import com.interview.platform.entity.Job;
import com.interview.platform.entity.Role;
import com.interview.platform.entity.User;
import com.interview.platform.repository.InterviewSessionRepository;
import com.interview.platform.repository.JobRepository;
import com.interview.platform.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepository;
    private final InterviewSessionRepository sessionRepository;
    private final UserService userService;

    public JobController(JobRepository jobRepository, InterviewSessionRepository sessionRepository, UserService userService) {
        this.jobRepository = jobRepository;
        this.sessionRepository = sessionRepository;
        this.userService = userService;
    }

    public record JobPostRequest(
            String title,
            String companyName,
            String type,
            String description,
            String skillsRequired
    ) {}

    @PostMapping
    public ResponseEntity<?> createJob(
            @RequestBody JobPostRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getRole() != Role.COMPANY) {
            return ResponseEntity.status(403).body("Only Company/Recruiter accounts can post jobs.");
        }

        Job job = Job.builder()
                .title(request.title())
                .companyName(request.companyName())
                .type(request.type())
                .description(request.description())
                .skillsRequired(request.skillsRequired())
                .postedBy(user)
                .build();

        Job savedJob = jobRepository.save(job);
        return ResponseEntity.ok(savedJob);
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/recruiter")
    public ResponseEntity<?> getRecruiterJobs(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getRole() != Role.COMPANY) {
            return ResponseEntity.status(403).body("Only Company/Recruiter accounts can view posted jobs.");
        }

        return ResponseEntity.ok(jobRepository.findByPostedByOrderByCreatedAtDesc(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobDetails(@PathVariable("id") String id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/applications")
    public ResponseEntity<?> getJobApplications(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        if (!job.getPostedBy().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Access denied. You can only view applications for jobs you posted.");
        }

        List<InterviewSession> sessions = sessionRepository.findByJobOrderByCreatedAtDesc(job);
        return ResponseEntity.ok(sessions);
    }
}
