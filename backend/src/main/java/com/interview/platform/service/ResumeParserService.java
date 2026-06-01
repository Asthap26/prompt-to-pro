package com.interview.platform.service;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeParserService {

    private final Tika tika = new Tika();

    public String extractText(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return "";
        }
        try (InputStream stream = file.getInputStream()) {
            return tika.parseToString(stream);
        } catch (Exception e) {
            // Log warning and fallback
            return "Fallback resume content for file: " + file.getOriginalFilename();
        }
    }

    public List<String> extractSkills(String text) {
        List<String> skills = new ArrayList<>();
        if (text == null || text.isBlank()) {
            return skills;
        }

        String[] keywordPool = {
            "Java", "Python", "JavaScript", "TypeScript", "React", "Angular", "Vue",
            "Spring Boot", "Spring", "MySQL", "PostgreSQL", "MongoDB", "Redis",
            "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Git", "CI/CD", "HTML", "CSS",
            "REST API", "GraphQL", "Microservices", "System Design", "Node.js", "Express",
            "Next.js", "C++", "C#", "Go", "Rust", "Lombok", "JPA", "Hibernate"
        };

        for (String keyword : keywordPool) {
            Pattern pattern = Pattern.compile("\\b" + Pattern.quote(keyword) + "\\b", Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(text);
            if (matcher.find()) {
                skills.add(keyword);
            }
        }
        return skills;
    }
}
