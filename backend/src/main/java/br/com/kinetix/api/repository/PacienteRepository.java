package br.com.kinetix.api.repository;

import br.com.kinetix.api.domain.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
}
