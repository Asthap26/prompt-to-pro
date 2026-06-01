package com.interview.platform.controller;

import com.interview.platform.entity.CompanyProfile;
import com.interview.platform.repository.CompanyProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyProfileRepository companyProfileRepository;

    public CompanyController(CompanyProfileRepository companyProfileRepository) {
        this.companyProfileRepository = companyProfileRepository;
    }

    @Override
    public String toString() {
        return "CompanyController";
    }

    @GetMapping
    public ResponseEntity<List<CompanyProfile>> getCompanies() {
        return ResponseEntity.ok(companyProfileRepository.findAll());
    }

    @GetMapping("/{slug}/profile")
    public ResponseEntity<?> getCompanyProfile(@PathVariable("slug") String slug) {
        return companyProfileRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
