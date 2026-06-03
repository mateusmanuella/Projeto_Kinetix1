package br.com.kinetix.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    @Operation(summary = "Verifica se a API esta em execucao")
    public Map<String, Object> health() {
        return Map.of(
                "status", "UP",
                "service", "kinetix-api",
                "timestamp", OffsetDateTime.now()
        );
    }
}
