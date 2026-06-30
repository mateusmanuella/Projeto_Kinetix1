package br.com.kinetix.api.dto.auth;

public record RegisterResponse(
        Long userId,
        String role,
        String name,
        String message
) {
}
