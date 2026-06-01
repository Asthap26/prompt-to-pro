package com.interview.platform.controller;

import com.interview.platform.config.JwtService;
import com.interview.platform.entity.User;
import com.interview.platform.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userService.existsByEmail(request.email())) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }
        User user = userService.register(request.email(), request.password(), request.role());
        String accessToken = userService.authenticate(request.email(), request.password());
        String refreshToken = userService.generateRefreshToken(request.email());
        return ResponseEntity.ok(new AuthResponse(
                accessToken,
                refreshToken,
                user.getEmail(),
                user.getRole().name()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            String accessToken = userService.authenticate(request.email(), request.password());
            String refreshToken = userService.generateRefreshToken(request.email());
            User user = userService.findByEmail(request.email())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            return ResponseEntity.ok(new AuthResponse(
                    accessToken,
                    refreshToken,
                    user.getEmail(),
                    user.getRole().name()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@Valid @RequestBody RefreshRequest request) {
        try {
            String accessToken = userService.refreshAccessToken(request.refreshToken());
            String email = jwtService.extractUsername(request.refreshToken());
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            return ResponseEntity.ok(new AuthResponse(
                    accessToken,
                    request.refreshToken(),
                    user.getEmail(),
                    user.getRole().name()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid refresh token");
        }
    }
}
