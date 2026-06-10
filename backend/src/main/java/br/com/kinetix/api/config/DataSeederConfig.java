package br.com.kinetix.api.config;

import br.com.kinetix.api.domain.Perfil;
import br.com.kinetix.api.domain.Usuario;
import br.com.kinetix.api.repository.PerfilRepository;
import br.com.kinetix.api.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeederConfig {

    @Bean
    CommandLineRunner seedDefaultUsers(
            UsuarioRepository usuarioRepository,
            PerfilRepository perfilRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (usuarioRepository.existsByEmail("admin@kinetix.com")) {
                return;
            }

            Perfil adminPerfil = perfilRepository.findByNome("ADMIN")
                    .orElseThrow(() -> new IllegalStateException("Perfil ADMIN nao encontrado"));

            Usuario admin = new Usuario();
            admin.setNome("Administrador KINETIX");
            admin.setEmail("admin@kinetix.com");
            admin.setSenhaHash(passwordEncoder.encode("Admin@123"));
            admin.getPerfis().add(adminPerfil);

            usuarioRepository.save(admin);
        };
    }
}
