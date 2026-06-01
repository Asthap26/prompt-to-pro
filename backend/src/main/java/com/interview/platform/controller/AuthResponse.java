package com.interview.platform.controller;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    String email,
    String role
) {}
