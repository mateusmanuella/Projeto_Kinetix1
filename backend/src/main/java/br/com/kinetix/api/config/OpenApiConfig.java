package br.com.kinetix.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI kinetixOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("KINETIX API")
                        .version("v1")
                        .description("API REST da plataforma KINETIX para reabilitacao fisioterapeutica."));
    }
}
