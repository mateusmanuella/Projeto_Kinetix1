package br.com.kinetix.api.dto.auth;

public record AuthResponse(
        String token,
        Long userId,
        String role,
        String name
) {
}
