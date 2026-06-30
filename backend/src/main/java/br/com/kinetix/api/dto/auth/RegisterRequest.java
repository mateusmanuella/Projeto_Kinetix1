package br.com.kinetix.api.dto.auth;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record RegisterRequest(
        @NotBlank(message = "Nome e obrigatorio")
        @Size(max = 120, message = "Nome deve ter no maximo 120 caracteres")
        String nome,

        @NotBlank(message = "Email e obrigatorio")
        @Email(message = "Email invalido")
        @Size(max = 160, message = "Email deve ter no maximo 160 caracteres")
        String email,

        @NotBlank(message = "Senha e obrigatoria")
        @Size(min = 8, max = 80, message = "Senha deve ter entre 8 e 80 caracteres")
        String senha,

        @NotBlank(message = "Perfil e obrigatorio")
        @Pattern(regexp = "PACIENTE|FISIOTERAPEUTA|CLINICA", message = "Perfil deve ser PACIENTE, FISIOTERAPEUTA ou CLINICA")
        String role,

        String telefone,

        LocalDate dataNascimento,

        String crefito,

        String nomeClinica,

        String enderecoClinica,

        @NotNull(message = "Aceite dos termos LGPD e obrigatorio")
        @AssertTrue(message = "Aceite dos termos LGPD e obrigatorio")
        Boolean aceiteTermos
) {
}
