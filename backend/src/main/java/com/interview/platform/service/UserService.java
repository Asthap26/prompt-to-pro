package com.interview.platform.service;

import com.interview.platform.config.JwtService;
import com.interview.platform.entity.Role;
import com.interview.platform.entity.User;
import com.interview.platform.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public User register(String email, String password, String roleStr) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }
        Role role = Role.CANDIDATE;
        if (roleStr != null) {
            try {
                role = Role.valueOf(roleStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Keep default CANDIDATE
            }
        }
        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .role(role)
                .build();
        return userRepository.save(user);
    }

    public String authenticate(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        return jwtService.generateToken(user);
    }

    public String generateRefreshToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return jwtService.generateRefreshToken(user);
    }

    public String refreshAccessToken(String refreshToken) {
        String email = jwtService.extractUsername(refreshToken);
        if (email != null) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            if (jwtService.isTokenValid(refreshToken, user)) {
                return jwtService.generateToken(user);
            }
        }
        throw new IllegalArgumentException("Invalid refresh token");
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
