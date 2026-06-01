package com.interview.platform.controller;

import com.interview.platform.entity.InterviewSession;
import com.interview.platform.entity.PerformanceReport;
import com.interview.platform.entity.User;
import com.interview.platform.service.InterviewService;
import com.interview.platform.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final InterviewService interviewService;
    private final UserService userService;

    public AnalyticsController(InterviewService interviewService, UserService userService) {
        this.interviewService = interviewService;
        this.userService = userService;
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<?> getReport(
            @PathVariable("id") Long sessionId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return interviewService.getSessionById(sessionId)
                .map(session -> {
                    boolean isCandidate = session.getUser().getId().equals(user.getId());
                    boolean isRecruiter = session.getJob() != null && session.getJob().getPostedBy().getId().equals(user.getId());

                    if (!isCandidate && !isRecruiter) {
                        return ResponseEntity.status(403).body("Access denied to this report");
                    }
                    PerformanceReport report = session.getPerformanceReport();
                    if (report == null) {
                        return ResponseEntity.badRequest().body("Report has not been generated for this session yet");
                    }
                    return ResponseEntity.ok(report);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<InterviewSession> sessions = interviewService.getSessionsForUser(user);
        
        int completedCount = 0;
        int totalScore = 0;
        
        for (InterviewSession session : sessions) {
            if (session.getStatus() == com.interview.platform.entity.SessionStatus.COMPLETED 
                    && session.getPerformanceReport() != null) {
                completedCount++;
                totalScore += session.getPerformanceReport().getOverallScore();
            }
        }
        
        int averageScore = completedCount > 0 ? (totalScore / completedCount) : 0;
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("completedCount", completedCount);
        summary.put("averageScore", averageScore);
        summary.put("totalSessions", sessions.size());
        
        return ResponseEntity.ok(summary);
    }
}
