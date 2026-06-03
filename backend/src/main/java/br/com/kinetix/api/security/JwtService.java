package br.com.kinetix.api.security;

import br.com.kinetix.api.domain.Perfil;
import br.com.kinetix.api.domain.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expirationSeconds;

    public JwtService(
            @Value("${kinetix.security.jwt-secret}") String jwtSecret,
            @Value("${kinetix.security.jwt-expiration-seconds:86400}") long expirationSeconds
    ) {
        if (jwtSecret.length() < 32) {
            throw new IllegalArgumentException("JWT secret deve ter pelo menos 32 caracteres");
        }
        this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.expirationSeconds = expirationSeconds;
    }

    public String generateToken(Usuario usuario) {
        Instant now = Instant.now();
        List<String> roles = usuario.getPerfis()
                .stream()
                .map(Perfil::getNome)
                .toList();

        return Jwts.builder()
                .subject(usuario.getEmail())
                .claim("userId", usuario.getId())
                .claim("name", usuario.getNome())
                .claim("roles", roles)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(expirationSeconds)))
                .signWith(secretKey)
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isValid(String token, Usuario usuario) {
        Claims claims = extractClaims(token);
        return claims.getSubject().equals(usuario.getEmail())
                && claims.getExpiration().after(new Date())
                && Boolean.TRUE.equals(usuario.getAtivo());
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
