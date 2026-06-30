package br.com.kinetix.api.service;

import br.com.kinetix.api.domain.Clinica;
import br.com.kinetix.api.domain.Fisioterapeuta;
import br.com.kinetix.api.domain.Paciente;
import br.com.kinetix.api.domain.Perfil;
import br.com.kinetix.api.domain.TermoConsentimento;
import br.com.kinetix.api.domain.Usuario;
import br.com.kinetix.api.dto.auth.AuthResponse;
import br.com.kinetix.api.dto.auth.LoginRequest;
import br.com.kinetix.api.dto.auth.RegisterRequest;
import br.com.kinetix.api.dto.auth.RegisterResponse;
import br.com.kinetix.api.repository.ClinicaRepository;
import br.com.kinetix.api.repository.FisioterapeutaRepository;
import br.com.kinetix.api.repository.PacienteRepository;
import br.com.kinetix.api.repository.PerfilRepository;
import br.com.kinetix.api.repository.TermoConsentimentoRepository;
import br.com.kinetix.api.repository.UsuarioRepository;
import br.com.kinetix.api.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PerfilRepository perfilRepository;
    private final PacienteRepository pacienteRepository;
    private final FisioterapeutaRepository fisioterapeutaRepository;
    private final ClinicaRepository clinicaRepository;
    private final TermoConsentimentoRepository termoConsentimentoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PerfilRepository perfilRepository,
            PacienteRepository pacienteRepository,
            FisioterapeutaRepository fisioterapeutaRepository,
            ClinicaRepository clinicaRepository,
            TermoConsentimentoRepository termoConsentimentoRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
        this.pacienteRepository = pacienteRepository;
        this.fisioterapeutaRepository = fisioterapeutaRepository;
        this.clinicaRepository = clinicaRepository;
        this.termoConsentimentoRepository = termoConsentimentoRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        if (usuarioRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email ja cadastrado");
        }

        Perfil perfil = perfilRepository.findByNome(request.role())
                .orElseThrow(() -> new IllegalArgumentException("Perfil nao encontrado: " + request.role()));

        Usuario usuario = new Usuario();
        usuario.setNome(request.nome().trim());
        usuario.setEmail(email);
        usuario.setSenhaHash(passwordEncoder.encode(request.senha()));
        usuario.getPerfis().add(perfil);
        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        criarRegistroPorPerfil(request, usuarioSalvo);
        registrarConsentimento(usuarioSalvo);

        return new RegisterResponse(
                usuarioSalvo.getId(),
                request.role(),
                usuarioSalvo.getNome(),
                "Usuario cadastrado com sucesso"
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Credenciais invalidas"));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenhaHash())) {
            throw new BadCredentialsException("Credenciais invalidas");
        }

        if (!Boolean.TRUE.equals(usuario.getAtivo())) {
            throw new BadCredentialsException("Conta inativa");
        }

        String role = usuario.getPerfis()
                .stream()
                .findFirst()
                .map(Perfil::getNome)
                .orElse("PACIENTE");

        return new AuthResponse(
                jwtService.generateToken(usuario),
                usuario.getId(),
                role,
                usuario.getNome()
        );
    }

    private void criarRegistroPorPerfil(RegisterRequest request, Usuario usuario) {
        switch (request.role()) {
            case "PACIENTE" -> criarPaciente(request, usuario);
            case "FISIOTERAPEUTA" -> criarFisioterapeuta(request, usuario);
            case "CLINICA" -> criarClinica(request);
            default -> throw new IllegalArgumentException("Perfil invalido");
        }
    }

    private void criarPaciente(RegisterRequest request, Usuario usuario) {
        Paciente paciente = new Paciente();
        paciente.setUsuario(usuario);
        paciente.setTelefone(request.telefone());
        paciente.setDataNascimento(request.dataNascimento());
        pacienteRepository.save(paciente);
    }

    private void criarFisioterapeuta(RegisterRequest request, Usuario usuario) {
        if (request.crefito() == null || request.crefito().isBlank()) {
            throw new IllegalArgumentException("CREFITO e obrigatorio para fisioterapeuta");
        }

        Fisioterapeuta fisioterapeuta = new Fisioterapeuta();
        fisioterapeuta.setUsuario(usuario);
        fisioterapeuta.setCrefito(request.crefito().trim());
        fisioterapeutaRepository.save(fisioterapeuta);
    }

    private void criarClinica(RegisterRequest request) {
        if (request.nomeClinica() == null || request.nomeClinica().isBlank()) {
            throw new IllegalArgumentException("Nome da clinica e obrigatorio");
        }
        if (request.enderecoClinica() == null || request.enderecoClinica().isBlank()) {
            throw new IllegalArgumentException("Endereco da clinica e obrigatorio");
        }

        Clinica clinica = new Clinica();
        clinica.setNome(request.nomeClinica().trim());
        clinica.setEndereco(request.enderecoClinica().trim());
        clinicaRepository.save(clinica);
    }

    private void registrarConsentimento(Usuario usuario) {
        TermoConsentimento termo = new TermoConsentimento();
        termo.setUsuario(usuario);
        termo.setAceito(true);
        termoConsentimentoRepository.save(termo);
    }
}
