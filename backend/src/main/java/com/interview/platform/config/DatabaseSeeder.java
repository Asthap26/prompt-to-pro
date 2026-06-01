package com.interview.platform.config;

import com.interview.platform.entity.CompanyProfile;
import com.interview.platform.entity.Role;
import com.interview.platform.entity.User;
import com.interview.platform.repository.CompanyProfileRepository;
import com.interview.platform.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, CompanyProfileRepository companyProfileRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.companyProfileRepository = companyProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("user@example.com").isEmpty()) {
            User demoUser = User.builder()
                    .email("user@example.com")
                    .passwordHash(passwordEncoder.encode("password"))
                    .role(Role.CANDIDATE)
                    .build();
            userRepository.save(demoUser);
            System.out.println("Seeded demo user: user@example.com / password");
        }

        if (companyProfileRepository.count() == 0) {
            CompanyProfile amazon = CompanyProfile.builder()
                    .name("Amazon")
                    .slug("amazon")
                    .promptInjection("Amazon's 14 Leadership Principles (e.g. Customer Obsession, Ownership, Bias for Action, Dive Deep). Questions must enforce STAR response structures auditing behavioral trade-offs.")
                    .build();

            CompanyProfile google = CompanyProfile.builder()
                    .name("Google")
                    .slug("google")
                    .promptInjection("Google Core Values: Googliness, technical rigor, intellectual humility, scaling complexity, system performance. Questions must assess clean algorithms and system design principles.")
                    .build();

            CompanyProfile netflix = CompanyProfile.builder()
                    .name("Netflix")
                    .slug("netflix")
                    .promptInjection("Netflix Culture: Freedom and Responsibility, context not control, stunning colleagues, high talent density. Questions must evaluate self-motivation, high independence, and product-focused delivery.")
                    .build();

            CompanyProfile stripe = CompanyProfile.builder()
                    .name("Stripe")
                    .slug("stripe")
                    .promptInjection("Stripe Values: Technical precision, extreme API elegance, system integrity, robust testing, simple integrations. Questions must target robust architecture validation and developer usability focus.")
                    .build();

            companyProfileRepository.saveAll(List.of(amazon, google, netflix, stripe));
            System.out.println("Seeded default company prompt profiles.");
        }
    }
}
