package br.com.kinetix.api.security;

import br.com.kinetix.api.domain.Perfil;
import br.com.kinetix.api.domain.Usuario;
import br.com.kinetix.api.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class KinetixUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public KinetixUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado"));

        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getSenhaHash())
                .disabled(!Boolean.TRUE.equals(usuario.getAtivo()))
                .authorities(usuario.getPerfis()
                        .stream()
                        .map(Perfil::getNome)
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .toList())
                .build();
    }
}
